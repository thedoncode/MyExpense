// Reads and checks the server's settings from environment variables (set in the hosting dashboard).
// The server refuses to start when a required setting is missing or unsafe, rather than running weakly.
const fs = require('fs');
const path = require('path');

function fail(msg) { const e = new Error('Configuration: ' + msg); e.config = true; throw e; }

function key32(name, value, required) {
  if (!value) { if (required) fail(name + ' is not set.'); return null; }
  const buf = Buffer.from(value, 'base64');
  if (buf.length !== 32 || buf.toString('base64').replace(/=+$/, '') !== value.trim().replace(/=+$/, '')) fail(name + ' must be 32 random bytes, base64-encoded. This page makes one for you below.');
  return buf;
}

function loadConfig(e = process.env) {
  const envs = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'environments.json'), 'utf8'));
  const appEnv = e.APP_ENV || 'prod';
  if (!envs[appEnv]) fail('APP_ENV must be one of: ' + Object.keys(envs).join(', '));

  const missing0 = ['APP_ORIGIN', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DATA_KEY'].filter(k => !e[k]);
  if (missing0.length > 1) fail('these settings are not set: ' + missing0.join(', ') + '.');
  const origin = (e.APP_ORIGIN || '').replace(/\/+$/, '');
  let url;
  try { url = new URL(origin); } catch (err) { fail('APP_ORIGIN must be the site address, for example https://expenses.example.com'); }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (url.protocol !== 'https:' && !(local && url.protocol === 'http:')) fail('APP_ORIGIN must start with https://');
  if (url.pathname !== '/' || url.search || url.hash) fail('APP_ORIGIN must be just the site address, with no path');

  for (const k of ['DB_USER', 'DB_PASSWORD', 'DB_NAME']) if (!e[k]) fail(k + ' is not set.');

  const setupToken = e.SETUP_TOKEN || '';
  if (setupToken && setupToken.length < 32) fail('SETUP_TOKEN must be at least 32 characters. This page makes one for you below.');

  const aiBase = (e.ANTHROPIC_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '');
  if (!/^https:\/\//.test(aiBase) && !/^http:\/\/127\.0\.0\.1(:\d+)?$/.test(aiBase)) fail('ANTHROPIC_BASE_URL must use https');

  const num = (k, d, min, max) => {
    if (e[k] === undefined || e[k] === '') return d;
    const n = Number(e[k]);
    if (!Number.isFinite(n) || n < min || n > max) fail(k + ' must be a number from ' + min + ' to ' + max);
    return n;
  };
  let trustProxy = e.TRUST_PROXY === undefined || e.TRUST_PROXY === '' ? 1 : e.TRUST_PROXY;
  if (/^\d+$/.test(String(trustProxy))) trustProxy = Number(trustProxy);
  else if (trustProxy === 'false') trustProxy = false;

  return {
    appEnv,
    env: { name: appEnv, title: envs[appEnv].title, banner: envs[appEnv].banner || '' },
    origin,
    host: url.host,
    port: num('PORT', 3000, 1, 65535),
    trustProxy,
    db: {
      host: e.DB_HOST || '127.0.0.1', port: num('DB_PORT', 3306, 1, 65535),
      user: e.DB_USER, password: e.DB_PASSWORD, database: e.DB_NAME,
      connectionLimit: num('DB_CONNECTIONS', 5, 1, 50),
    },
    dataKey: key32('DATA_KEY', e.DATA_KEY, true),
    previousKey: key32('DATA_KEY_PREVIOUS', e.DATA_KEY_PREVIOUS, false),
    setupToken,
    ai: {
      key: e.ANTHROPIC_API_KEY || '',
      model: e.ANTHROPIC_MODEL || 'claude-sonnet-5-5',
      base: aiBase,
      dailyLimit: num('AI_DAILY_LIMIT', 100, 0, 10000),
      timeoutMs: num('AI_TIMEOUT_SECONDS', 90, 5, 600) * 1000,
    },
    quotaBytes: num('USER_QUOTA_MB', 500, 10, 100000) * 1024 * 1024,
    idleMs: num('SESSION_IDLE_MINUTES', 30, 5, 240) * 60000,
    absoluteMs: num('SESSION_MAX_HOURS', 12, 1, 72) * 3600000,
    auditDays: num('AUDIT_RETENTION_DAYS', 400, 30, 3650),
  };
}

module.exports = { loadConfig };
