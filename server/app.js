// The MyExpense web server: serves the app (dist/web) and its API.
const fs = require('fs');
const path = require('path');
const express = require('express');
const { keyring } = require('./crypto');
const { headers, sameSite } = require('./security');
const { authRoutes } = require('./auth');
const { dataRoutes } = require('./data');
const { adminRoutes } = require('./admin');

const WEB = path.join(__dirname, '..', 'dist', 'web');
const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function createApp(cfg, pool) {
  const keys = keyring(cfg.dataKey, cfg.previousKey);
  // The audit log records who did what to which account, never anyone's expenses
  const audit = (req, event, { actor = null, subject = null, detail = '' } = {}) => {
    pool.query('INSERT INTO audit (at, actor_id, subject_id, event, ip, detail) VALUES (?, ?, ?, ?, ?, ?)',
      [Date.now(), actor, subject, event, String((req && req.ip) || '').slice(0, 45), String(detail).slice(0, 255)])
      .catch(e => console.error('audit write failed: ' + e.message));
  };
  const ctx = { cfg, pool, keys, audit };

  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', cfg.trustProxy);
  app.set('etag', false);
  app.use(headers(cfg));

  app.get('/healthz', async (req, res) => {
    try { await pool.query('SELECT 1'); res.type('text/plain').send('ok'); } catch (e) { res.status(503).type('text/plain').send('database unavailable'); }
  });

  /* ---------- API ---------- */
  app.use(sameSite(cfg));
  const small = express.json({ limit: '64kb', type: 'application/json' });
  app.use('/api', (req, res, next) => (req.path.startsWith('/reports/') || req.path.startsWith('/receipts/') ? next() : small(req, res, next))); // those set their own limits
  authRoutes(app, ctx);
  app.locals.ipFails = ctx.ipFails;
  dataRoutes(app, ctx);
  adminRoutes(app, ctx);
  app.use('/api', (req, res) => res.status(404).json({ code: 'not_found' }));

  /* ---------- the app itself ---------- */
  const indexHtml = fs.readFileSync(path.join(WEB, 'index.html'), 'utf8')
    .split('__APP_TITLE__').join(attr(cfg.env.title))
    .split('__ENV_JSON__').join(attr(JSON.stringify(cfg.env)));
  const sendIndex = (req, res) => { res.set({ 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' }); res.send(indexHtml); };
  app.get('/', sendIndex);
  app.get('/index.html', sendIndex);
  app.get('/manifest.webmanifest', (req, res) => {
    res.set({ 'Content-Type': 'application/manifest+json', 'Cache-Control': 'no-cache' });
    res.sendFile(path.join(WEB, 'manifest.webmanifest'));
  });
  // Files under /assets are named by their contents, so browsers may keep them for good
  app.use('/assets', express.static(path.join(WEB, 'assets'), { immutable: true, maxAge: '365d', index: false, dotfiles: 'deny', fallthrough: false, redirect: false }));
  app.get('/robots.txt', (req, res) => res.type('text/plain').send('User-agent: *\nDisallow: /\n'));
  app.use((req, res) => res.status(404).type('text/plain').send('Not found'));

  // Errors: a short code for the page, details only in the server log, never request contents
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    if (err && (err.type === 'entity.too.large' || err.status === 413)) return res.status(413).json({ code: 'too_large' });
    if (err && (err.type === 'entity.parse.failed' || err.status === 400)) return res.status(400).json({ code: 'bad_request' });
    if (err && err.status === 404) return res.status(404).type('text/plain').send('Not found');
    console.error(new Date().toISOString() + ' ' + req.method + ' ' + req.path + ' failed: ' + (err && err.stack ? err.stack.split('\n').slice(0, 3).join(' | ') : err));
    if (res.headersSent) return;
    res.status(500).json({ code: 'server_error' });
  });

  // Housekeeping: expired sessions and links, and audit entries past their retention
  const sweep = async () => {
    const now = Date.now();
    try {
      await pool.query('DELETE FROM sessions WHERE expires_at < ? OR (stage = \'full\' AND last_seen_at < ?)', [now, now - cfg.idleMs]);
      await pool.query('DELETE FROM links WHERE expires_at < ?', [now - 30 * 86400000]);
      await pool.query('DELETE FROM audit WHERE at < ?', [now - cfg.auditDays * 86400000]);
      await pool.query('DELETE FROM ai_usage WHERE day < ?', [new Date(now - 7 * 86400000).toISOString().slice(0, 10)]);
      if (ctx.ipFails) ctx.ipFails.sweep();
    } catch (e) { console.error('cleanup failed: ' + e.message); }
  };
  app.locals.sweep = sweep;
  app.locals.ctx = ctx;
  return app;
}

module.exports = { createApp };
