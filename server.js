// Entry point for hosting (Hostinger and similar): node server.js
// Settings come from environment variables; see docs/HOSTINGER.md.
const { loadConfig } = require('./server/config');
const { connect } = require('./server/db');
const { createApp } = require('./server/app');
const { helpApp } = require('./server/setup-help');
const { rekey } = require('./server/rekey');
const { recoverAdmin } = require('./server/admin');

const PORT = Number(process.env.PORT) || 3000;

// What to tell the person setting up, for each way the database connection fails (never the URL or password)
function dbProblem(e) {
  const code = String(e.code || '');
  const why = {
    '28P01': 'the database password in DATABASE_URL isn’t right',
    '28000': 'the database login in DATABASE_URL isn’t allowed in. For Supabase’s pooler it looks like myexpense_app.<project ref>',
    '3D000': 'the database name at the end of DATABASE_URL doesn’t exist (on Supabase it’s postgres)',
    ENOTFOUND: 'the database address in DATABASE_URL can’t be found. On Supabase, copy the Session pooler connection string',
    ECONNREFUSED: 'nothing answered at the database address and port in DATABASE_URL',
    ETIMEDOUT: 'the database didn’t answer in time. Check the address and port, and that the hosting allows outgoing database connections',
    SELF_SIGNED_CERT_IN_CHAIN: 'the database’s certificate couldn’t be checked. Add DB_SSL_CA with the certificate from Supabase (Database settings → SSL configuration)',
    UNABLE_TO_VERIFY_LEAF_SIGNATURE: 'the database’s certificate couldn’t be checked. Add DB_SSL_CA with the certificate from Supabase (Database settings → SSL configuration)',
    ERR_TLS_CERT_ALTNAME_INVALID: 'the database’s certificate doesn’t match its address. Use the host name from Supabase’s connection string',
    SCHEMA_MISSING: 'the MyExpense tables aren’t set up in the database yet. Run server/schema.sql for this environment (node server/tools.js sql ' + (process.env.APP_ENV || 'prod') + ') in Supabase’s SQL editor',
    SCHEMA_NEWER: 'the database was set up by a newer version of MyExpense. Deploy the latest version',
    '42501': 'the database login doesn’t have access to the MyExpense tables. Run server/schema.sql for this environment again',
  }[code];
  return 'MyExpense can’t open its database (' + (code || 'error') + '): ' + (why || 'check DATABASE_URL') + '.';
}
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
      if (!help) help = await listen(helpApp(dbProblem(e)));
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
