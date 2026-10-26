// Starts a real MyExpense server against a throwaway MySQL/MariaDB database, plus a stand-in for the
// Anthropic API, for the server and web tests.
// Database settings: TEST_DB_HOST, TEST_DB_PORT, TEST_DB_USER, TEST_DB_PASSWORD (the user must be able
// to create databases named mx_test_*).
const http = require('http');
const crypto = require('crypto');
const mysql = require('mysql2/promise');
const { loadConfig } = require('../../server/config');
const { connect } = require('../../server/db');
const { createApp } = require('../../server/app');

const DB = {
  host: process.env.TEST_DB_HOST || '127.0.0.1',
  port: Number(process.env.TEST_DB_PORT || 3307),
  user: process.env.TEST_DB_USER || 'mx',
  password: process.env.TEST_DB_PASSWORD || 'mx-test-pw',
};

// Stand-in for api.anthropic.com: records each request and answers with whatever the test queued
function fakeAnthropic() {
  const calls = [];
  const replies = [];
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', c => { body += c; });
    req.on('end', () => {
      let json = null; try { json = JSON.parse(body); } catch (e) { /* recorded as null */ }
      calls.push({ path: req.url, headers: req.headers, body: json });
      const r = replies.shift() || { status: 200, text: '{"kind":"receipt","transactions":[{"date":"2026-05-01","vendor":"Uber","category":"taxi","amount":23.5,"currency":"USD","cad":null,"payment":"Visa 4412","note":null}]}' };
      res.writeHead(r.status || 200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(r.status && r.status !== 200 ? { type: 'error', error: { type: 'x', message: r.message || 'err' } } : { content: [{ type: 'text', text: r.text }] }));
    });
  });
  return new Promise(res => server.listen(0, '127.0.0.1', () => res({ server, calls, replies, url: 'http://127.0.0.1:' + server.address().port })));
}

async function start(opts = {}) {
  const dbName = 'mx_test_' + crypto.randomBytes(4).toString('hex');
  const admin = await mysql.createConnection({ ...DB });
  await admin.query('CREATE DATABASE `' + dbName + '` CHARACTER SET utf8mb4');
  await admin.end();
  const ai = await fakeAnthropic();
  const host = opts.host || '127.0.0.1';
  // Find a free port first, so APP_ORIGIN can name it
  const port = await new Promise(res => { const s = http.createServer(); s.listen(0, host, () => { const p = s.address().port; s.close(() => res(p)); }); });
  const cfg = loadConfig({
    APP_ENV: opts.appEnv || 'qa',
    APP_ORIGIN: 'http://' + (host === '127.0.0.1' && opts.localhost ? 'localhost' : host) + ':' + port,
    TRUST_PROXY: 'false',
    DB_HOST: DB.host, DB_PORT: String(DB.port), DB_USER: DB.user, DB_PASSWORD: DB.password, DB_NAME: dbName,
    DATA_KEY: crypto.randomBytes(32).toString('base64'),
    SETUP_TOKEN: opts.setupToken === undefined ? 'test-setup-token-0123456789abcdefghij' : opts.setupToken,
    ANTHROPIC_API_KEY: opts.aiKey === undefined ? 'sk-ant-test-key' : opts.aiKey,
    ANTHROPIC_BASE_URL: ai.url,
    ...(opts.env || {}),
  });
  const pool = await connect(cfg.db);
  const app = createApp(cfg, pool);
  const server = await new Promise(res => { const s = app.listen(port, host, () => res(s)); });
  return {
    cfg, pool, ai, app, server, origin: cfg.origin, dbName,
    async stop() {
      await new Promise(r => server.close(r));
      ai.server.close();
      await pool.end();
      if (!process.env.KEEP_TEST_DB) { const c = await mysql.createConnection({ ...DB }); await c.query('DROP DATABASE `' + dbName + '`'); await c.end(); }
    },
  };
}

// A browser-like API client: keeps its own cookies and sends this site's Origin
function client(origin) {
  const jar = new Map();
  const c = {
    jar,
    async req(method, path, body, extra = {}) {
      const headers = { 'x-myexpense': '1', origin, ...extra.headers };
      if (extra.noOrigin) delete headers.origin;
      if (extra.noMarker) delete headers['x-myexpense'];
      if (jar.size) headers.cookie = [...jar].map(([k, v]) => k + '=' + v).join('; ');
      let payload;
      if (Buffer.isBuffer(body)) { payload = body; headers['content-type'] = headers['content-type'] || 'application/octet-stream'; }
      else if (body !== undefined) { payload = JSON.stringify(body); headers['content-type'] = 'application/json'; }
      const res = await fetch(origin + path, { method, headers, body: payload, redirect: 'manual' });
      for (const sc of res.headers.getSetCookie()) {
        const [kv] = sc.split(';'); const i = kv.indexOf('=');
        const k = kv.slice(0, i), v = kv.slice(i + 1);
        if (!v || /max-age=0/i.test(sc)) jar.delete(k); else jar.set(k, v);
      }
      const buf = Buffer.from(await res.arrayBuffer());
      let json = null;
      if ((res.headers.get('content-type') || '').includes('json')) { try { json = JSON.parse(buf.toString('utf8')); } catch (e) { /* not json */ } }
      return { status: res.status, headers: res.headers, json, buf, setCookie: res.headers.getSetCookie() };
    },
    get: (p, x) => c.req('GET', p, undefined, x),
    post: (p, b, x) => c.req('POST', p, b === undefined ? {} : b, x),
    put: (p, b, x) => c.req('PUT', p, b, x),
    del: (p, x) => c.req('DELETE', p, undefined, x),
  };
  return c;
}

module.exports = { start, client, DB };
