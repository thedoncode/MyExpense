// Entry point for hosting (Hostinger and similar): node server.js
// Settings come from environment variables; see docs/HOSTINGER.md.
const { loadConfig } = require('./server/config');
const { connect } = require('./server/db');
const { createApp } = require('./server/app');
const { helpApp } = require('./server/setup-help');
const { rekey } = require('./server/rekey');
const { recoverAdmin } = require('./server/admin');

const PORT = Number(process.env.PORT) || 3000;
const listen = (app) => new Promise((res, rej) => { const s = app.listen(PORT, () => res(s)); s.on('error', rej); });
const close = (s) => new Promise(res => s.close(() => res()));

(async () => {
  let cfg;
  try { cfg = loadConfig(); }
  catch (e) {
    if (!e.config) throw e;
    const problem = e.message.replace(/^Configuration: /, '');
    console.error('MyExpense is not configured: ' + problem);
    await listen(helpApp(problem, { keys: /DATA_KEY|SETUP_TOKEN/.test(problem) }));
    console.error('Showing the setup page on port ' + PORT + ' until the settings are complete.');
    return;
  }

  // The database may be briefly unavailable (or wrongly set up): show the setup page meanwhile and keep trying
  let pool, help = null;
  for (;;) {
    try { pool = await connect(cfg.db); break; }
    catch (e) {
      const code = e.code || 'error';
      console.error('Could not open the database (' + code + '): ' + e.message);
      if (!help) help = await listen(helpApp('MyExpense can’t open its database (' + code + '). Check DB_NAME, DB_USER and DB_PASSWORD, and that the database user is assigned to the database. Use DB_HOST 127.0.0.1, not localhost.'));
      await new Promise(r => setTimeout(r, 15000));
    }
  }
  if (help) await close(help);

  const app = createApp(cfg, pool);
  const server = await listen(app);
  console.log('MyExpense (' + cfg.appEnv + ') listening on port ' + PORT + ' for ' + cfg.origin + (cfg.ai.key ? '' : ' (receipt reading off: no ANTHROPIC_API_KEY)') + (cfg.setupToken ? ' (SETUP_TOKEN is set: remove it once the first administrator exists)' : ''));
  server.headersTimeout = 30000;
  server.requestTimeout = 120000;
  const timer = setInterval(app.locals.sweep, 15 * 60000); timer.unref();
  app.locals.sweep();
  if (cfg.previousKey) rekey(pool, app.locals.ctx.keys).catch(e => console.error('Re-encrypting with the new DATA_KEY failed: ' + e.message));
  if (process.env.RECOVER_ADMIN_EMAIL) recoverAdmin(app.locals.ctx, process.env.RECOVER_ADMIN_EMAIL).catch(e => console.error('RECOVER_ADMIN_EMAIL failed: ' + e.message));
  const stop = () => { server.close(() => pool.end().finally(() => process.exit(0))); setTimeout(() => process.exit(0), 10000).unref(); };
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
})().catch(e => { console.error(e); process.exit(1); });
