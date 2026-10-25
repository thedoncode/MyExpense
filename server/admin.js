// Administration: invite people, reset someone's sign-in, turn accounts off and on, and read the
// audit log. Administrators manage accounts only. Nothing here can read anyone's reports or receipts.
const express = require('express');
const K = require('./crypto');
const { tx } = require('./db');
const { normEmail, validEmail } = require('./auth');

const DAY = 86400000;
const INVITE_MS = 3 * DAY, RESET_MS = DAY;

async function resetLink(ctx, u, actorId, signOut) {
  const token = K.newToken(), now = Date.now();
  await tx(ctx.pool, async (c) => {
    await c.query("UPDATE links SET used_at = ? WHERE kind = 'reset' AND user_id = ? AND used_at IS NULL", [now, u.id]);
    await c.query("INSERT INTO links (kind, token_hash, email, role, user_id, created_by, created_at, expires_at) VALUES ('reset', ?, ?, ?, ?, ?, ?, ?)", [K.tokenHash(token), u.email, u.role, u.id, actorId, now, now + RESET_MS]);
    if (signOut) await c.query('DELETE FROM sessions WHERE user_id = ?', [u.id]);
  });
  return { link: ctx.cfg.origin + '/#reset=' + token, expiresAt: now + RESET_MS };
}

// Break-glass for a locked-out administrator (lost phone and recovery codes, or forgotten password):
// with RECOVER_ADMIN_EMAIL set in the hosting settings, the server writes a one-time reset link for
// that administrator to its own log, which only the hosting account can read. Remove the setting after.
async function recoverAdmin(ctx, email, log = console.log) {
  const [[u]] = await ctx.pool.query("SELECT id, email, role, status FROM users WHERE email = ? AND role = 'admin'", [normEmail(email)]);
  if (!u) { log('RECOVER_ADMIN_EMAIL: no administrator with that email.'); return null; }
  await ctx.pool.query("UPDATE users SET status = 'active', failed_logins = 0, locked_until = 0 WHERE id = ?", [u.id]);
  const out = await resetLink(ctx, u, null, true);
  ctx.audit(null, 'reset_created', { subject: u.id, detail: 'from the hosting settings (RECOVER_ADMIN_EMAIL)' });
  log('Administrator reset link for ' + u.email + ' (works once, for 24 hours): ' + out.link + '\nRemove RECOVER_ADMIN_EMAIL from the environment variables now.');
  return out;
}

function adminRoutes(app, ctx) {
  const { cfg, pool, audit, admin } = ctx;
  const json = express.json({ limit: '16kb', type: 'application/json' });
  const uidParam = (req, res, next) => (/^\d{1,10}$/.test(req.params.id) ? next() : res.status(400).json({ code: 'bad_id' }));
  const link = (kind, token) => cfg.origin + '/#' + kind + '=' + token; // in the fragment, so it never reaches any server's logs

  app.get('/api/admin/users', admin, async (req, res) => {
    const [users] = await pool.query('SELECT id, email, name, role, status, totp_secret IS NOT NULL AS two_step, locked_until, created_at, last_login_at FROM users ORDER BY email');
    const [invites] = await pool.query("SELECT id, email, role, created_at, expires_at FROM links WHERE kind = 'invite' AND used_at IS NULL AND expires_at > ? ORDER BY created_at DESC", [Date.now()]);
    const now = Date.now();
    res.json({
      me: req.user.id,
      users: users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role, status: u.status, twoStep: !!u.two_step, locked: Number(u.locked_until) > now, createdAt: Number(u.created_at), lastSignIn: u.last_login_at ? Number(u.last_login_at) : null })),
      invites: invites.map(i => ({ id: i.id, email: i.email, role: i.role, createdAt: Number(i.created_at), expiresAt: Number(i.expires_at) })),
    });
  });

  app.post('/api/admin/invites', admin, json, async (req, res) => {
    const email = normEmail(req.body && req.body.email);
    const role = req.body && req.body.role === 'admin' ? 'admin' : 'user';
    if (!validEmail(email)) return res.status(400).json({ code: 'bad_email' });
    const [[dupe]] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (dupe) return res.status(409).json({ code: 'account_exists' });
    const token = K.newToken(), now = Date.now();
    await tx(pool, async (c) => {
      await c.query("UPDATE links SET used_at = ? WHERE kind = 'invite' AND email = ? AND used_at IS NULL", [now, email]); // only the newest invite works
      await c.query("INSERT INTO links (kind, token_hash, email, role, created_by, created_at, expires_at) VALUES ('invite', ?, ?, ?, ?, ?, ?)", [K.tokenHash(token), email, role, req.user.id, now, now + INVITE_MS]);
    });
    audit(req, 'invite_created', { actor: req.user.id, detail: email + (role === 'admin' ? ' (administrator)' : '') });
    res.json({ link: link('invite', token), expiresAt: now + INVITE_MS });
  });
  app.delete('/api/admin/invites/:id', admin, uidParam, async (req, res) => {
    const [r] = await pool.query("UPDATE links SET used_at = ? WHERE id = ? AND kind = 'invite' AND used_at IS NULL", [Date.now(), req.params.id]);
    if (r.affectedRows) audit(req, 'invite_cancelled', { actor: req.user.id, detail: 'invite ' + req.params.id });
    res.status(204).end();
  });

  async function target(req, res) {
    const [[u]] = await pool.query('SELECT id, email, role, status FROM users WHERE id = ?', [req.params.id]);
    if (!u) { res.status(404).json({ code: 'not_found' }); return null; }
    return u;
  }
  async function otherActiveAdmins(id) {
    const [[n]] = await pool.query("SELECT COUNT(*) AS n FROM users WHERE role = 'admin' AND status = 'active' AND id <> ?", [id]);
    return n.n;
  }

  // A one-time link to choose a new password and set up two-step sign-in again (for a forgotten
  // password or a lost phone). The person is signed out everywhere straight away.
  app.post('/api/admin/users/:id/reset', admin, uidParam, async (req, res) => {
    const u = await target(req, res); if (!u) return;
    if (u.status !== 'active') return res.status(409).json({ code: 'disabled' });
    const out = await resetLink(ctx, u, req.user.id, u.id !== req.user.id);
    audit(req, 'reset_created', { actor: req.user.id, subject: u.id });
    res.json(out);
  });

  app.post('/api/admin/users/:id/disable', admin, uidParam, async (req, res) => {
    const u = await target(req, res); if (!u) return;
    if (u.id === req.user.id) return res.status(409).json({ code: 'self' });
    await tx(pool, async (c) => {
      await c.query("UPDATE users SET status = 'disabled' WHERE id = ?", [u.id]);
      await c.query('DELETE FROM sessions WHERE user_id = ?', [u.id]);
      await c.query("UPDATE links SET used_at = ? WHERE user_id = ? AND used_at IS NULL", [Date.now(), u.id]);
    });
    audit(req, 'user_disabled', { actor: req.user.id, subject: u.id });
    res.status(204).end();
  });
  app.post('/api/admin/users/:id/enable', admin, uidParam, async (req, res) => {
    const u = await target(req, res); if (!u) return;
    await pool.query("UPDATE users SET status = 'active', failed_logins = 0, locked_until = 0 WHERE id = ?", [u.id]);
    audit(req, 'user_enabled', { actor: req.user.id, subject: u.id });
    res.status(204).end();
  });
  app.post('/api/admin/users/:id/role', admin, uidParam, json, async (req, res) => {
    const u = await target(req, res); if (!u) return;
    const role = req.body && req.body.role === 'admin' ? 'admin' : 'user';
    if (u.id === req.user.id && role !== 'admin') return res.status(409).json({ code: 'self' });
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, u.id]);
    audit(req, 'role_changed', { actor: req.user.id, subject: u.id, detail: role });
    res.status(204).end();
  });
  // Deletes the account and everything it stored. Can't be undone.
  app.delete('/api/admin/users/:id', admin, uidParam, async (req, res) => {
    const u = await target(req, res); if (!u) return;
    if (u.id === req.user.id) return res.status(409).json({ code: 'self' });
    if (u.role === 'admin' && !(await otherActiveAdmins(u.id))) return res.status(409).json({ code: 'last_admin' });
    await pool.query('DELETE FROM users WHERE id = ?', [u.id]);
    audit(req, 'user_deleted', { actor: req.user.id, subject: u.id, detail: u.email });
    res.status(204).end();
  });

  app.get('/api/admin/audit', admin, async (req, res) => {
    const before = /^\d{1,20}$/.test(String(req.query.before || '')) ? Number(req.query.before) : Number.MAX_SAFE_INTEGER;
    const [rows] = await pool.query(
      `SELECT a.id, a.at, a.event, a.ip, a.detail, ua.email AS actor, us.email AS subject
         FROM audit a LEFT JOIN users ua ON ua.id = a.actor_id LEFT JOIN users us ON us.id = a.subject_id
        WHERE a.id < ? ORDER BY a.id DESC LIMIT 100`, [before]);
    res.json(rows.map(r => ({ id: Number(r.id), at: Number(r.at), event: r.event, actor: r.actor, subject: r.subject, ip: r.ip, detail: r.detail })));
  });
}

module.exports = { adminRoutes, recoverAdmin };
