// Until its settings are complete (or while its database can't be reached), the server shows only a
// page saying what's missing. It never shows a setting's value. The page makes fresh secrets in the
// visitor's own browser.
const fs = require('fs');
const path = require('path');
const express = require('express');
const { headers } = require('./security');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function helpApp(problem, { keys = false } = {}) {
  const WEB = path.join(__dirname, '..', 'dist', 'web');
  const page = fs.readFileSync(path.join(WEB, 'setup-help.html'), 'utf8').replace('__PROBLEM__', esc(problem)).replace('__SHOW_KEYS__', keys ? '1' : '0');
  const app = express();
  app.disable('x-powered-by');
  app.use(headers({ origin: '' }));
  app.get('/healthz', (req, res) => res.status(503).type('text/plain').send('not configured'));
  app.use('/assets', express.static(path.join(WEB, 'assets'), { immutable: true, maxAge: '365d', index: false, dotfiles: 'deny', fallthrough: false, redirect: false }));
  app.use((req, res) => {
    if (req.path.startsWith('/api/')) return res.status(503).set('Cache-Control', 'no-store').json({ code: 'not_configured' });
    res.status(503).set({ 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }).send(page);
  });
  return app;
}

module.exports = { helpApp };
