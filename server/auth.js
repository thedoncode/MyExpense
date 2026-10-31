// Accounts and sign-in: first-admin setup, invite and reset links, email + password, then a code
// from an authenticator app (or a one-time recovery code). Sessions live in the database; the browser
// only holds a random token in an HttpOnly, Secure, SameSite=Strict cookie.
const QRCode = require('qrcode');
const K = require('./crypto');
const { tx } = require('./db');
const { Limiter, parseCookies } = require('./security');

const COOKIE = '__Host-myexpense';
const PENDING_MS = 10 * 60000;      // to finish two-step sign-in or set it up
const LOCK_AFTER = 5;               // wrong passwords or codes in a row
const LOCK_MS = 15 * 60000;
const MIN = 60000;

const normEmail = (e) => (typeof e === 'string' ? e.trim().toLowerCase() : '');
const validEmail = (e) => e.length <= 254 && /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i.test(e);
const cleanName = (n) => (typeof n === 'string' ? n.replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, 80) : '');

function authRoutes(app, ctx) {
  const { cfg, pool, keys, audit } = ctx;
  const ipFails = new Limiter(30, 15 * MIN);   // failed sign-in attempts from one address
  const emailFails = new Limiter(LOCK_AFTER, LOCK_MS); // for addresses with no account, so they behave the same
  ctx.ipFails = ipFails;
  let dummyHash = null;
  K.hashPassword('not-a-real-password-' + Math.random()).then(h => { dummyHash = h; });

  /* ---------- sessions ---------- */
  const cookie = (token, ms) => COOKIE + '=' + token + '; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=' + Math.max(0, Math.floor(ms / 1000));
  const clearCookie = (res) => res.append('Set-Cookie', cookie('', 0));

  async function startSession(conn, res, req, userId, stage) {
    const token = K.newToken();
    const now = Date.now();
    const ttl = stage === 'full' ? cfg.absoluteMs : PENDING_MS;
    await conn.query('INSERT INTO sessions (token_hash, user_id, stage, created_at, last_seen_at, expires_at, ip, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [K.tokenHash(token), userId, stage, now, now, now + ttl, String(req.ip || '').slice(0, 45), String(req.headers['user-agent'] || '').slice(0, 200)]);
    res.append('Set-Cookie', cookie(token, ttl));
    return stage;
  }
  // A new token at every step up (password -> code -> signed in), so a token seen early is useless later
  async function stepUp(conn, res, req, stage) {
    await conn.query('DELETE FROM sessions WHERE id = ?', [req.sess.id]);
    return startSession(conn, res, req, req.user.id, stage);
  }
  ctx.startSession = startSession;

  // Loads the session for every API request
  app.use('/api', async (req, res, next) => {
    req.sess = null; req.user = null;
    const t = parseCookies(req.headers.cookie)[COOKIE];
    if (!t || t.length > 100) return next();
    const [rows] = await pool.query(
      `SELECT s.id AS sid, s.stage, s.pending_secret, s.created_at AS s_created, s.last_seen_at, s.expires_at,
              u.id, u.email, u.name, u.role, u.status, u.totp_secret, u.totp_last_step, u.failed_logins, u.locked_until, u.pw_hash
         FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ?`, [K.tokenHash(t)]);
    const r = rows[0];
    const now = Date.now();
    if (!r) { clearCookie(res); req.ended = true; return next(); }
    const idle = r.stage === 'full' && now - r.last_seen_at > cfg.idleMs;
    if (now >= r.expires_at || idle || r.status !== 'active') {
      await pool.query('DELETE FROM sessions WHERE id = ?', [r.sid]);
      clearCookie(res); req.ended = true; return next();
    }
    req.sess = { id: r.sid, stage: r.stage, pending: r.pending_secret, created: r.s_created };
    req.user = { id: r.id, email: r.email, name: r.name, role: r.role, totp: r.totp_secret, totpStep: Number(r.totp_last_step), lockedUntil: Number(r.locked_until), pw: r.pw_hash };
    if (now - r.last_seen_at > 15000) await pool.query('UPDATE sessions SET last_seen_at = ? WHERE id = ?', [now, r.sid]);
    next();
  });

  const full = (req, res, next) => (req.user && req.sess.stage === 'full' ? next() : res.status(401).json({ code: 'signin' }));
  const admin = (req, res, next) => {
    if (!req.user || req.sess.stage !== 'full') return res.status(401).json({ code: 'signin' });
    if (req.user.role !== 'admin') return res.status(403).json({ code: 'forbidden' });
    next();
  };
  ctx.full = full; ctx.admin = admin;

  const tooMany = (res, ms) => res.status(429).json({ code: 'locked', minutes: Math.max(1, Math.ceil((ms || LOCK_MS) / MIN)) });
  async function failed(req, userId) {
    ipFails.hit(req.ip);
    if (!userId) return false;
    const now = Date.now();
    await pool.query(
      'UPDATE users SET locked_until = CASE WHEN failed_logins + 1 >= ? THEN ? ELSE locked_until END, failed_logins = CASE WHEN failed_logins + 1 >= ? THEN 0 ELSE failed_logins + 1 END WHERE id = ?',
      [LOCK_AFTER, now + LOCK_MS, LOCK_AFTER, userId]);
    const [[u]] = await pool.query('SELECT locked_until FROM users WHERE id = ?', [userId]);
    if (u && Number(u.locked_until) > now) {
      await pool.query("DELETE FROM sessions WHERE user_id = ? AND stage <> 'full'", [userId]);
      audit(req, 'account_locked', { subject: userId });
      return true;
    }
    return false;
  }
  const signedIn = async (conn, userId) => conn.query('UPDATE users SET failed_logins = 0, locked_until = 0, last_login_at = ? WHERE id = ?', [Date.now(), userId]);

  async function hasUsers() { const [[r]] = await pool.query('SELECT COUNT(*) AS n FROM users'); return r.n > 0; }

  /* ---------- what the page needs to know on load ---------- */
  app.get('/api/session', async (req, res) => {
    const out = { env: cfg.env, stage: req.sess ? req.sess.stage : null, ended: !!req.ended, idleMinutes: Math.round(cfg.idleMs / MIN), ai: !!cfg.ai.key };
    if (!req.sess) out.setup = (await hasUsers()) ? null : (cfg.setupToken ? 'open' : 'locked');
    if (req.sess && req.sess.stage === 'full') out.user = { email: req.user.email, name: req.user.name, role: req.user.role };
    if (req.sess && req.sess.stage !== 'full') out.email = req.user.email;
    res.json(out);
  });
  // The page calls this while someone is using it, so the session doesn't time out mid-task
  app.post('/api/session/active', full, (req, res) => res.status(204).end());

  /* ---------- first administrator ---------- */
  app.post('/api/setup', async (req, res) => {
    if (ipFails.blocked(req.ip)) return tooMany(res);
    if (!cfg.setupToken) return res.status(403).json({ code: 'setup_off' });
    const { token, password } = req.body || {};
    const email = normEmail(req.body && req.body.email), name = cleanName(req.body && req.body.name);
    if (await hasUsers()) return res.status(409).json({ code: 'setup_done' });
    if (typeof token !== 'string' || !K.sameSecret(token.trim(), cfg.setupToken)) { await failed(req, null); return res.status(401).json({ code: 'bad_token' }); }
    if (!validEmail(email)) return res.status(400).json({ code: 'bad_email' });
    if (!name) return res.status(400).json({ code: 'bad_name' });
    const pwProblem = K.passwordProblem(password, email);
    if (pwProblem) return res.status(400).json({ code: 'weak_password', message: pwProblem });
    const hash = await K.hashPassword(password);
    const made = await tx(pool, async (c) => {
      await c.query("SELECT pg_advisory_xact_lock(hashtext('myexpense_setup'))"); // one setup at a time
      const [[n]] = await c.query('SELECT COUNT(*) AS n FROM users');
      if (n.n > 0) return null;
      const [r] = await c.query("INSERT INTO users (email, name, role, pw_hash, created_at) VALUES (?, ?, 'admin', ?, ?) RETURNING id", [email, name, hash, Date.now()]);
      await startSession(c, res, req, r.insertId, 'enroll');
      return r.insertId;
    });
    if (!made) return res.status(409).json({ code: 'setup_done' });
    audit(req, 'setup', { actor: made, subject: made });
    res.json({ stage: 'enroll' });
  });

  /* ---------- email + password ---------- */
  app.post('/api/auth/login', async (req, res) => {
    if (ipFails.blocked(req.ip)) return tooMany(res);
    const email = normEmail(req.body && req.body.email);
    const pw = req.body && req.body.password;
    if (!email || email.length > 254 || typeof pw !== 'string' || !pw || pw.length > 256) return res.status(400).json({ code: 'bad_login' });
    const [[u]] = await pool.query('SELECT id, email, status, pw_hash, totp_secret, locked_until FROM users WHERE email = ?', [email]);
    const now = Date.now();
    if (u && Number(u.locked_until) > now) return tooMany(res, Number(u.locked_until) - now);
    if (!u && emailFails.blocked(email)) return tooMany(res);
    let ok = false;
    if (u && u.pw_hash) ok = await K.verifyPassword(pw, u.pw_hash);
    else { await K.verifyPassword(pw, dummyHash || await K.hashPassword('x')); } // same time either way
    if (!ok) {
      if (!u) emailFails.hit(email);
      const locked = await failed(req, u && u.id);
      audit(req, 'signin_failed', { subject: u ? u.id : null, detail: u ? 'wrong password' : 'no such account' });
      return locked ? tooMany(res) : res.status(401).json({ code: 'bad_login' });
    }
    if (u.status !== 'active') { audit(req, 'signin_refused', { subject: u.id, detail: 'account disabled' }); return res.status(403).json({ code: 'disabled' }); }
    if (K.needsRehash(u.pw_hash)) await pool.query('UPDATE users SET pw_hash = ? WHERE id = ?', [await K.hashPassword(pw), u.id]);
    if (req.sess) await pool.query('DELETE FROM sessions WHERE id = ?', [req.sess.id]);
    const stage = await startSession(pool, res, req, u.id, u.totp_secret ? 'totp' : 'enroll');
    res.json({ stage });
  });

  /* ---------- the code from the authenticator app, or a recovery code ---------- */
  app.post('/api/auth/totp', async (req, res) => {
    if (!req.sess || req.sess.stage !== 'totp') return res.status(401).json({ code: 'signin' });
    if (ipFails.blocked(req.ip)) return tooMany(res);
    const u = req.user, now = Date.now();
    if (u.lockedUntil > now) return tooMany(res, u.lockedUntil - now);
    const body = req.body || {};
    let how = null, left = null;
    if (typeof body.recovery === 'string' && body.recovery.length <= 40) {
      const [r] = await pool.query('DELETE FROM recovery_codes WHERE user_id = ? AND code_hash = ?', [u.id, K.recoveryHash(body.recovery)]);
      if (r.affectedRows === 1) how = 'recovery code';
    } else if (typeof body.code === 'string') {
      const secret = keys.open(u.totp, 'totp:' + u.id);
      const step = K.checkTotp(secret, body.code, u.totpStep, now);
      if (step) {
        const [r] = await pool.query('UPDATE users SET totp_last_step = ? WHERE id = ? AND totp_last_step < ?', [step, u.id, step]);
        if (r.affectedRows === 1) how = 'authenticator code';
      }
    }
    if (!how) {
      const locked = await failed(req, u.id);
      audit(req, 'signin_failed', { subject: u.id, detail: 'wrong ' + (body.recovery ? 'recovery code' : 'code') });
      if (locked) { clearCookie(res); return tooMany(res); }
      return res.status(401).json({ code: 'bad_code' });
    }
    await tx(pool, async (c) => { await signedIn(c, u.id); await stepUp(c, res, req, 'full'); });
    if (how === 'recovery code') { const [[n]] = await pool.query('SELECT COUNT(*) AS n FROM recovery_codes WHERE user_id = ?', [u.id]); left = n.n; }
    audit(req, 'signin', { actor: u.id, subject: u.id, detail: how });
    res.json({ stage: 'full', recoveryLeft: left });
  });

  /* ---------- setting up two-step sign-in ---------- */
  app.post('/api/auth/totp/setup', async (req, res) => {
    if (!req.sess || req.sess.stage !== 'enroll') return res.status(401).json({ code: 'signin' });
    const secret = K.newTotpSecret();
    await pool.query('UPDATE sessions SET pending_secret = ? WHERE id = ?', [keys.seal(secret, 'pending:' + req.sess.id), req.sess.id]);
    const b32 = K.base32(secret);
    const issuer = cfg.env.title;
    const uri = 'otpauth://totp/' + encodeURIComponent(issuer + ':' + req.user.email) + '?secret=' + b32 + '&issuer=' + encodeURIComponent(issuer) + '&algorithm=SHA1&digits=6&period=30';
    const svg = await QRCode.toString(uri, { type: 'svg', errorCorrectionLevel: 'M', margin: 2, color: { dark: '#000000', light: '#ffffff' } });
    res.json({ secret: b32.match(/.{1,4}/g).join(' '), uri, qr: 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64') });
  });
  app.post('/api/auth/totp/enable', async (req, res) => {
    if (!req.sess || req.sess.stage !== 'enroll' || !req.sess.pending) return res.status(401).json({ code: 'signin' });
    if (ipFails.blocked(req.ip)) return tooMany(res);
    const secret = keys.open(req.sess.pending, 'pending:' + req.sess.id);
    const step = K.checkTotp(secret, req.body && req.body.code, 0);
    if (!step) { await failed(req, null); return res.status(401).json({ code: 'bad_code' }); }
    const codes = K.newRecoveryCodes();
    const u = req.user;
    await tx(pool, async (c) => {
      await c.query('UPDATE users SET totp_secret = ?, totp_last_step = ? WHERE id = ?', [keys.seal(secret, 'totp:' + u.id), step, u.id]);
      await c.query('DELETE FROM recovery_codes WHERE user_id = ?', [u.id]);
      for (const code of codes) await c.query('INSERT INTO recovery_codes (user_id, code_hash) VALUES (?, ?)', [u.id, K.recoveryHash(code)]);
      await signedIn(c, u.id);
      await stepUp(c, res, req, 'full');
    });
    audit(req, 'two_step_on', { actor: u.id, subject: u.id });
    audit(req, 'signin', { actor: u.id, subject: u.id, detail: 'after setting up two-step sign-in' });
    res.json({ stage: 'full', codes });
  });

  app.post('/api/auth/logout', async (req, res) => {
    if (req.sess) { await pool.query('DELETE FROM sessions WHERE id = ?', [req.sess.id]); audit(req, 'signout', { actor: req.user.id, subject: req.user.id }); }
    clearCookie(res);
    res.status(204).end();
  });

  /* ---------- invite and reset links ---------- */
  async function findLink(c, token, lock) {
    if (typeof token !== 'string' || token.length < 20 || token.length > 100) return null;
    const [[l]] = await c.query('SELECT * FROM links WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?' + (lock ? ' FOR UPDATE' : ''), [K.tokenHash(token), Date.now()]);
    if (!l) return null;
    if (l.kind === 'reset') {
      const [[u]] = await c.query('SELECT status FROM users WHERE id = ?', [l.user_id]);
      if (!u || u.status !== 'active') return null;
    }
    return l;
  }
  app.post('/api/links/check', async (req, res) => {
    if (ipFails.blocked(req.ip)) return tooMany(res);
    const l = await findLink(pool, req.body && req.body.token);
    if (!l) { await failed(req, null); return res.status(404).json({ code: 'link_invalid' }); }
    res.json({ kind: l.kind, email: l.email });
  });
  app.post('/api/links/accept', async (req, res) => {
    if (ipFails.blocked(req.ip)) return tooMany(res);
    const body = req.body || {};
    const pre = await findLink(pool, body.token);
    if (!pre) { await failed(req, null); return res.status(404).json({ code: 'link_invalid' }); }
    const name = cleanName(body.name);
    if (pre.kind === 'invite' && !name) return res.status(400).json({ code: 'bad_name' });
    const pwProblem = K.passwordProblem(body.password, pre.email);
    if (pwProblem) return res.status(400).json({ code: 'weak_password', message: pwProblem });
    const hash = await K.hashPassword(body.password);
    const out = await tx(pool, async (c) => {
      const l = await findLink(c, body.token, true);
      if (!l) return { err: 'link_invalid' };
      let uid;
      if (l.kind === 'invite') {
        const [[dupe]] = await c.query('SELECT id FROM users WHERE email = ?', [l.email]);
        if (dupe) return { err: 'account_exists' };
        const [r] = await c.query('INSERT INTO users (email, name, role, pw_hash, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id', [l.email, name, l.role, hash, Date.now()]);
        uid = r.insertId;
      } else {
        uid = l.user_id;
        await c.query('UPDATE users SET pw_hash = ?, totp_secret = NULL, totp_last_step = 0, failed_logins = 0, locked_until = 0 WHERE id = ?', [hash, uid]);
        await c.query('DELETE FROM recovery_codes WHERE user_id = ?', [uid]);
        await c.query('DELETE FROM sessions WHERE user_id = ?', [uid]);
        await c.query("UPDATE links SET used_at = ? WHERE user_id = ? AND kind = 'reset' AND used_at IS NULL", [Date.now(), uid]);
      }
      await c.query('UPDATE links SET used_at = ? WHERE id = ?', [Date.now(), l.id]);
      if (req.sess) await c.query('DELETE FROM sessions WHERE id = ?', [req.sess.id]);
      await startSession(c, res, req, uid, 'enroll');
      return { uid, kind: l.kind };
    });
    if (out.err) return res.status(out.err === 'account_exists' ? 409 : 404).json({ code: out.err });
    audit(req, out.kind === 'invite' ? 'invite_used' : 'reset_used', { actor: out.uid, subject: out.uid });
    res.json({ stage: 'enroll' });
  });

  /* ---------- your account ---------- */
  app.get('/api/me', full, async (req, res) => {
    const [[n]] = await pool.query('SELECT COUNT(*) AS n FROM recovery_codes WHERE user_id = ?', [req.user.id]);
    res.json({ email: req.user.email, name: req.user.name, role: req.user.role, recoveryLeft: n.n });
  });
  async function checkCurrent(req, res, pw) {
    const now = Date.now();
    if (req.user.lockedUntil > now) { tooMany(res, req.user.lockedUntil - now); return false; }
    if (typeof pw === 'string' && pw.length <= 256 && await K.verifyPassword(pw, req.user.pw)) return true;
    const locked = await failed(req, req.user.id);
    if (locked) { await pool.query('DELETE FROM sessions WHERE user_id = ?', [req.user.id]); clearCookie(res); res.status(401).json({ code: 'signin' }); return false; }
    res.status(401).json({ code: 'bad_password' });
    return false;
  }
  app.post('/api/me/password', full, async (req, res) => {
    const body = req.body || {};
    if (!(await checkCurrent(req, res, body.current))) return;
    const pwProblem = K.passwordProblem(body.password, req.user.email);
    if (pwProblem) return res.status(400).json({ code: 'weak_password', message: pwProblem });
    if (body.password === body.current) return res.status(400).json({ code: 'weak_password', message: 'Choose a password you haven’t used here.' });
    const hash = await K.hashPassword(body.password);
    await tx(pool, async (c) => {
      await c.query('UPDATE users SET pw_hash = ?, failed_logins = 0 WHERE id = ?', [hash, req.user.id]);
      await c.query('DELETE FROM sessions WHERE user_id = ? AND id <> ?', [req.user.id, req.sess.id]); // sign out everywhere else
      await stepUp(c, res, req, 'full');
    });
    audit(req, 'password_changed', { actor: req.user.id, subject: req.user.id });
    res.status(204).end();
  });
  app.post('/api/me/recovery-codes', full, async (req, res) => {
    if (!(await checkCurrent(req, res, req.body && req.body.password))) return;
    const codes = K.newRecoveryCodes();
    await tx(pool, async (c) => {
      await c.query('DELETE FROM recovery_codes WHERE user_id = ?', [req.user.id]);
      for (const code of codes) await c.query('INSERT INTO recovery_codes (user_id, code_hash) VALUES (?, ?)', [req.user.id, K.recoveryHash(code)]);
    });
    audit(req, 'recovery_codes_new', { actor: req.user.id, subject: req.user.id });
    res.json({ codes });
  });
  app.post('/api/me/signout-everywhere', full, async (req, res) => {
    await pool.query('DELETE FROM sessions WHERE user_id = ?', [req.user.id]);
    audit(req, 'signout_everywhere', { actor: req.user.id, subject: req.user.id });
    clearCookie(res);
    res.status(204).end();
  });
}

module.exports = { authRoutes, normEmail, validEmail, cleanName, COOKIE };
