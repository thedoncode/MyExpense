// Postgres (Supabase) connection. The tables live in the environment's own schema (server/schema.sql),
// which the server's login can read and write but not change. Every table holding someone's data is
// keyed by user_id, and the code only ever queries it with the signed-in person's id. Reports,
// receipts, details and two-step secrets are encrypted before they get here.
const fs = require('fs');
const path = require('path');
const { Pool, types } = require('pg');

// Counts, sums and millisecond timestamps come back as numbers (all well under 2^53)
types.setTypeParser(20, (v) => Number(v));   // int8
types.setTypeParser(1700, (v) => Number(v)); // numeric

const SCHEMA_VERSION = 1;
const SCHEMA_SQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
const IDENT = /^[a-z_][a-z0-9_]{0,62}$/;
function schemaSql(schema, role) {
  if (!IDENT.test(schema) || !IDENT.test(role)) throw new Error('schema and role names must be lowercase letters, digits and _');
  return SCHEMA_SQL.split('__SCHEMA__').join(schema).split('__ROLE__').join(role);
}

// Queries keep MySQL-style ? placeholders in the code (none of the SQL here has a literal ?), and
// results come back as [rows], with affectedRows and insertId on the array, as the code expects.
const toPg = (sql) => { let n = 0; return sql.replace(/\?/g, () => '$' + (++n)); };
function wrap(q) {
  return {
    async query(sql, params) {
      const res = await q.query(toPg(sql), params || []);
      const rows = res.rows || [];
      rows.affectedRows = res.rowCount || 0;
      rows.insertId = rows[0] && rows[0].id;
      return [rows];
    },
  };
}

async function connect(cfg) {
  const pool = new Pool({
    connectionString: cfg.url,
    ssl: cfg.ssl,
    max: cfg.connectionLimit,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
    application_name: 'myexpense',
  });
  pool.on('error', (e) => console.error('database connection dropped: ' + (e.code || e.message)));
  // Each connection works in the environment's schema only
  pool.on('connect', (client) => { client.query('set search_path to ' + cfg.schema).catch(() => {}); });
  const db = wrap(pool);
  db.pool = pool;
  db.end = () => pool.end();
  db.getConnection = async () => { const c = await pool.connect(); const w = wrap(c); w.release = () => c.release(); w.raw = c; return w; };
  db.schema = cfg.schema;
  await checkSchema(db, cfg);
  return db;
}

// The tables are created once, by someone allowed to (server/schema.sql, applied with Supabase's SQL
// editor or connector). The server's own login can't create tables, so it only checks the version.
// For local testing, DB_AUTO_MIGRATE=1 lets a login that owns the database create them itself.
async function checkSchema(db, cfg) {
  const c = await db.getConnection();
  try {
    await c.query('set search_path to ' + cfg.schema);
    const [[t]] = await c.query("select to_regclass(?) as t", [cfg.schema + '.schema_version']);
    let have = 0;
    if (t && t.t) { const [[v]] = await c.query('select max(version) as v from schema_version'); have = (v && v.v) || 0; }
    if (have < SCHEMA_VERSION && cfg.autoMigrate) {
      await c.raw.query('begin');
      try { await c.raw.query('select pg_advisory_xact_lock(hashtext(\'myexpense_migrate\'))'); await c.raw.query(schemaSql(cfg.schema, cfg.role)); await c.raw.query('commit'); }
      catch (e) { await c.raw.query('rollback').catch(() => {}); throw e; }
      have = SCHEMA_VERSION;
    }
    if (have > SCHEMA_VERSION) throw Object.assign(new Error('The database is newer than this version of MyExpense (schema ' + have + ').'), { code: 'SCHEMA_NEWER' });
    if (have < SCHEMA_VERSION) throw Object.assign(new Error('The database tables aren’t set up yet. Apply server/schema.sql for this environment (node server/tools.js sql ' + (cfg.envName || 'prod') + ').'), { code: 'SCHEMA_MISSING' });
  } finally { c.release(); }
}

// Runs fn(conn) in a transaction
async function tx(db, fn) {
  const c = await db.getConnection();
  try {
    await c.raw.query('begin');
    const out = await fn(c);
    await c.raw.query('commit');
    return out;
  } catch (e) { try { await c.raw.query('rollback'); } catch (_) { /* ignore */ } throw e; }
  finally { c.release(); }
}

module.exports = { connect, tx, schemaSql, SCHEMA_VERSION };
