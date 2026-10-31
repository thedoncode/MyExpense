// Re-encrypts everything with DATA_KEY. Runs by itself when the server starts with DATA_KEY_PREVIOUS
// set (see "Changing DATA_KEY" in docs/HOSTINGER.md); records already on the new key are skipped.
async function rekey(pool, keys, log = console.log) {
  let n = 0;
  const redo = async (rows, ctxOf, update) => {
    for (const r of rows) {
      const col = Object.keys(r).find(k => Buffer.isBuffer(r[k]));
      if (keys.isCurrent(r[col])) continue;
      const fresh = keys.seal(keys.open(r[col], ctxOf(r)), ctxOf(r));
      await pool.query(update, [fresh, ...Object.keys(r).filter(k => k !== col).map(k => r[k])]);
      n++;
    }
  };
  const q = async (sql) => (await pool.query(sql))[0];
  await redo(await q('SELECT body, user_id, id FROM reports'), r => 'report:' + r.user_id + ':' + r.id, 'UPDATE reports SET body = ? WHERE user_id = ? AND id = ?');
  await redo(await q('SELECT meta, user_id, id FROM receipts'), r => 'receipt-meta:' + r.user_id + ':' + r.id, 'UPDATE receipts SET meta = ? WHERE user_id = ? AND id = ?');
  await redo(await q('SELECT body, user_id, receipt_id, kind, seq FROM receipt_parts'), r => 'receipt:' + r.user_id + ':' + r.receipt_id + ':' + r.kind + ':' + r.seq, 'UPDATE receipt_parts SET body = ? WHERE user_id = ? AND receipt_id = ? AND kind = ? AND seq = ?');
  await redo(await q('SELECT body, user_id FROM settings'), r => 'settings:' + r.user_id, 'UPDATE settings SET body = ? WHERE user_id = ?');
  await redo(await q('SELECT totp_secret, id FROM users WHERE totp_secret IS NOT NULL'), r => 'totp:' + r.id, 'UPDATE users SET totp_secret = ? WHERE id = ?');
  await pool.query('UPDATE sessions SET pending_secret = NULL WHERE pending_secret IS NOT NULL');
  log('Re-encrypted ' + n + ' stored values with the new DATA_KEY. You can now remove DATA_KEY_PREVIOUS.');
  return n;
}
module.exports = { rekey };
