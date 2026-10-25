// MySQL / MariaDB connection and schema. The schema is created and upgraded automatically on start.
// Every table holding someone's data is keyed by user_id, and the code only ever queries it with the
// signed-in person's id. Reports, receipts, settings and two-step secrets are stored encrypted.
const mysql = require('mysql2/promise');

const MIGRATIONS = [
  // 1: initial schema
  [
    `CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(254) NOT NULL,
      name VARCHAR(80) NOT NULL DEFAULT '',
      role ENUM('user','admin') NOT NULL DEFAULT 'user',
      status ENUM('active','disabled') NOT NULL DEFAULT 'active',
      pw_hash VARCHAR(200) NULL,
      totp_secret VARBINARY(200) NULL,
      totp_last_step BIGINT NOT NULL DEFAULT 0,
      failed_logins INT NOT NULL DEFAULT 0,
      locked_until BIGINT NOT NULL DEFAULT 0,
      created_at BIGINT NOT NULL,
      last_login_at BIGINT NULL,
      UNIQUE KEY uq_users_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin`,
    `CREATE TABLE IF NOT EXISTS recovery_codes (
      user_id INT UNSIGNED NOT NULL,
      code_hash BINARY(32) NOT NULL,
      PRIMARY KEY (user_id, code_hash),
      CONSTRAINT fk_rc_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS sessions (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      token_hash BINARY(32) NOT NULL,
      user_id INT UNSIGNED NOT NULL,
      stage ENUM('totp','enroll','full') NOT NULL,
      pending_secret VARBINARY(200) NULL,
      created_at BIGINT NOT NULL,
      last_seen_at BIGINT NOT NULL,
      expires_at BIGINT NOT NULL,
      ip VARCHAR(45) NOT NULL DEFAULT '',
      user_agent VARCHAR(200) NOT NULL DEFAULT '',
      UNIQUE KEY uq_sessions_token (token_hash),
      KEY k_sessions_user (user_id),
      CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS links (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      kind ENUM('invite','reset') NOT NULL,
      token_hash BINARY(32) NOT NULL,
      email VARCHAR(254) NOT NULL,
      role ENUM('user','admin') NOT NULL DEFAULT 'user',
      user_id INT UNSIGNED NULL,
      created_by INT UNSIGNED NULL,
      created_at BIGINT NOT NULL,
      expires_at BIGINT NOT NULL,
      used_at BIGINT NULL,
      UNIQUE KEY uq_links_token (token_hash),
      CONSTRAINT fk_links_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin`,
    `CREATE TABLE IF NOT EXISTS reports (
      user_id INT UNSIGNED NOT NULL,
      id VARCHAR(64) NOT NULL,
      body MEDIUMBLOB NOT NULL,
      bytes INT UNSIGNED NOT NULL,
      updated_at BIGINT NOT NULL,
      PRIMARY KEY (user_id, id),
      CONSTRAINT fk_reports_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_bin`,
    `CREATE TABLE IF NOT EXISTS receipts (
      user_id INT UNSIGNED NOT NULL,
      id VARCHAR(64) NOT NULL,
      meta VARBINARY(1024) NOT NULL,
      img_parts INT UNSIGNED NOT NULL DEFAULT 0,
      orig_parts INT UNSIGNED NOT NULL DEFAULT 0,
      bytes INT UNSIGNED NOT NULL DEFAULT 0,
      created_at BIGINT NOT NULL,
      PRIMARY KEY (user_id, id),
      CONSTRAINT fk_receipts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_bin`,
    `CREATE TABLE IF NOT EXISTS receipt_parts (
      user_id INT UNSIGNED NOT NULL,
      receipt_id VARCHAR(64) NOT NULL,
      kind TINYINT UNSIGNED NOT NULL,
      seq INT UNSIGNED NOT NULL,
      body MEDIUMBLOB NOT NULL,
      PRIMARY KEY (user_id, receipt_id, kind, seq),
      CONSTRAINT fk_parts_receipt FOREIGN KEY (user_id, receipt_id) REFERENCES receipts(user_id, id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_bin`,
    `CREATE TABLE IF NOT EXISTS settings (
      user_id INT UNSIGNED NOT NULL PRIMARY KEY,
      body BLOB NOT NULL,
      CONSTRAINT fk_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS ai_usage (
      user_id INT UNSIGNED NOT NULL,
      day CHAR(10) NOT NULL,
      n INT UNSIGNED NOT NULL DEFAULT 0,
      PRIMARY KEY (user_id, day),
      CONSTRAINT fk_ai_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`,
    // The audit log has no foreign keys, so it outlives the accounts it mentions. It never holds
    // anyone's expenses.
    `CREATE TABLE IF NOT EXISTS audit (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      at BIGINT NOT NULL,
      actor_id INT UNSIGNED NULL,
      subject_id INT UNSIGNED NULL,
      event VARCHAR(40) NOT NULL,
      ip VARCHAR(45) NOT NULL DEFAULT '',
      detail VARCHAR(255) NOT NULL DEFAULT '',
      KEY k_audit_at (at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin`,
  ],
];

async function connect(cfg) {
  const pool = mysql.createPool({
    host: cfg.host, port: cfg.port, user: cfg.user, password: cfg.password, database: cfg.database,
    connectionLimit: cfg.connectionLimit, waitForConnections: true, queueLimit: 200,
    charset: 'utf8mb4', timezone: 'Z', multipleStatements: false, supportBigNumbers: true, bigNumberStrings: false,
    enableKeepAlive: true,
  });
  await migrate(pool);
  return pool;
}

async function migrate(pool) {
  const c = await pool.getConnection();
  try {
    const [[lock]] = await c.query("SELECT GET_LOCK('myexpense_migrate', 60) AS ok");
    if (!lock.ok) throw new Error('Could not lock the database to upgrade it');
    try {
      await c.query('CREATE TABLE IF NOT EXISTS schema_version (version INT NOT NULL PRIMARY KEY, applied_at BIGINT NOT NULL) ENGINE=InnoDB');
      const [rows] = await c.query('SELECT MAX(version) AS v FROM schema_version');
      const have = rows[0].v || 0;
      if (have > MIGRATIONS.length) throw new Error('The database is newer than this version of MyExpense (schema ' + have + ')');
      for (let v = have + 1; v <= MIGRATIONS.length; v++) {
        for (const sql of MIGRATIONS[v - 1]) await c.query(sql);
        await c.query('INSERT INTO schema_version (version, applied_at) VALUES (?, ?)', [v, Date.now()]);
      }
    } finally { await c.query("SELECT RELEASE_LOCK('myexpense_migrate')"); }
  } finally { c.release(); }
}

// Runs fn(conn) in a transaction
async function tx(pool, fn) {
  const c = await pool.getConnection();
  try {
    await c.beginTransaction();
    const out = await fn(c);
    await c.commit();
    return out;
  } catch (e) { try { await c.rollback(); } catch (_) { /* ignore */ } throw e; }
  finally { c.release(); }
}

module.exports = { connect, migrate, tx, SCHEMA_VERSION: MIGRATIONS.length };
