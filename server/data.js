// Each person's reports, receipts and details. Every query is scoped to the signed-in person's id,
// which comes from their session on the server, never from the request. Everything is validated with
// the same rules the app uses (src/core.js), and stored encrypted with a context naming its owner.
const express = require('express');
const core = require('../src/core.js');
const { tx } = require('./db');
const { Limiter } = require('./security');
const { readReceipt } = require('./ai');

const ID = /^[A-Za-z0-9_-]{1,64}$/;
const PART = 1 << 20;                 // receipts are stored in 1 MB encrypted pieces
const MAX_IMAGE = 8 * 1024 * 1024;    // the app sends at most a 3000px JPEG
const MAX_ORIGINAL = 7 * 1024 * 1024; // the app keeps original PDFs up to 6 MB
const MAX_REPORT = 900 * 1024;
const MAX_REPORTS = 2000, MAX_RECEIPTS = 6000;
const IMG = 0, ORIG = 1;

function dataRoutes(app, ctx) {
  const { cfg, pool, keys, audit, full } = ctx;
  const aiMinute = new Limiter(12, 60000);
  const json = express.json({ limit: '1mb', type: 'application/json' });
  const raw = (types, limit) => express.raw({ type: types, limit });
  const idParam = (req, res, next) => (ID.test(req.params.id) ? next() : res.status(400).json({ code: 'bad_id' }));

  async function used(c, uid) {
    const [[r]] = await c.query('SELECT COALESCE((SELECT SUM(bytes) FROM reports WHERE user_id = ?), 0) + COALESCE((SELECT SUM(bytes) FROM receipts WHERE user_id = ?), 0) AS b', [uid, uid]);
    return Number(r.b);
  }
  const overQuota = (res) => res.status(507).json({ code: 'quota' });

  /* ---------- reports ---------- */
  app.get('/api/reports', full, async (req, res) => {
    const uid = req.user.id;
    const [rows] = await pool.query('SELECT id, body FROM reports WHERE user_id = ?', [uid]);
    const out = [];
    for (const r of rows) {
      try { const rep = core.cleanReport(keys.openJSON(r.body, 'report:' + uid + ':' + r.id)); if (rep && rep.id === r.id) out.push(rep); }
      catch (e) { console.error('report ' + r.id + ' of user ' + uid + ' could not be opened'); }
    }
    res.json(out);
  });
  app.put('/api/reports/:id', full, idParam, json, async (req, res) => {
    const uid = req.user.id, id = req.params.id;
    const rep = core.cleanReport(req.body);
    if (!rep || rep.id !== id) return res.status(400).json({ code: 'bad_report' });
    const plain = Buffer.from(JSON.stringify(rep), 'utf8');
    if (plain.length > MAX_REPORT) return res.status(413).json({ code: 'too_large' });
    const sealed = keys.seal(plain, 'report:' + uid + ':' + id);
    const err = await tx(pool, async (c) => {
      const [[cur]] = await c.query('SELECT bytes FROM reports WHERE user_id = ? AND id = ? FOR UPDATE', [uid, id]);
      if (!cur) { const [[n]] = await c.query('SELECT COUNT(*) AS n FROM reports WHERE user_id = ?', [uid]); if (n.n >= MAX_REPORTS) return 'quota'; }
      if (await used(c, uid) - (cur ? cur.bytes : 0) + sealed.length > cfg.quotaBytes) return 'quota';
      await c.query('INSERT INTO reports (user_id, id, body, bytes, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT (user_id, id) DO UPDATE SET body = EXCLUDED.body, bytes = EXCLUDED.bytes, updated_at = EXCLUDED.updated_at',
        [uid, id, sealed, sealed.length, Date.now()]);
      return null;
    });
    if (err) return overQuota(res);
    res.status(204).end();
  });
  app.delete('/api/reports/:id', full, idParam, async (req, res) => {
    await pool.query('DELETE FROM reports WHERE user_id = ? AND id = ?', [req.user.id, req.params.id]);
    res.status(204).end();
  });

  /* ---------- receipts ---------- */
  const ctxFor = (uid, rid, kind, seq) => 'receipt:' + uid + ':' + rid + ':' + kind + ':' + seq;
  async function putParts(c, uid, rid, kind, buf) {
    await c.query('DELETE FROM receipt_parts WHERE user_id = ? AND receipt_id = ? AND kind = ?', [uid, rid, kind]);
    let n = 0;
    for (let off = 0; off < buf.length; off += PART, n++) {
      await c.query('INSERT INTO receipt_parts (user_id, receipt_id, kind, seq, body) VALUES (?, ?, ?, ?, ?)',
        [uid, rid, kind, n, keys.seal(buf.subarray(off, off + PART), ctxFor(uid, rid, kind, n))]);
    }
    return n;
  }
  async function getParts(uid, rid, kind, n) {
    const [rows] = await pool.query('SELECT seq, body FROM receipt_parts WHERE user_id = ? AND receipt_id = ? AND kind = ? ORDER BY seq', [uid, rid, kind]);
    if (rows.length !== n || rows.some((r, i) => r.seq !== i)) return null;
    return Buffer.concat(rows.map(r => keys.open(r.body, ctxFor(uid, rid, kind, r.seq))));
  }
  async function receiptRow(c, uid, rid, lock) {
    const [[r]] = await c.query('SELECT * FROM receipts WHERE user_id = ? AND id = ?' + (lock ? ' FOR UPDATE' : ''), [uid, rid]);
    if (!r) return null;
    r.m = keys.openJSON(r.meta, 'receipt-meta:' + uid + ':' + rid);
    return r;
  }
  const dim = (v) => { const n = Number(v); return Number.isInteger(n) && n > 0 && n <= 20000 ? n : null; };

  app.put('/api/receipts/:id', full, idParam, raw('image/jpeg', MAX_IMAGE), async (req, res) => {
    const uid = req.user.id, rid = req.params.id, buf = req.body;
    if (!Buffer.isBuffer(buf) || buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8 || buf[2] !== 0xff) return res.status(400).json({ code: 'not_jpeg' });
    const w = dim(req.headers['x-image-width']), h = dim(req.headers['x-image-height']);
    if (!w || !h) return res.status(400).json({ code: 'bad_size' });
    const err = await tx(pool, async (c) => {
      const cur = await receiptRow(c, uid, rid, true);
      if (!cur) { const [[n]] = await c.query('SELECT COUNT(*) AS n FROM receipts WHERE user_id = ?', [uid]); if (n.n >= MAX_RECEIPTS) return 'quota'; }
      if (await used(c, uid) - (cur ? cur.bytes : 0) + buf.length > cfg.quotaBytes) return 'quota';
      const meta = keys.sealJSON({ w, h, size: buf.length, osize: 0, otype: null, oname: null }, 'receipt-meta:' + uid + ':' + rid);
      await c.query('INSERT INTO receipts (user_id, id, meta, img_parts, orig_parts, bytes, created_at) VALUES (?, ?, ?, 0, 0, ?, ?) ON CONFLICT (user_id, id) DO UPDATE SET meta = EXCLUDED.meta, img_parts = 0, orig_parts = 0, bytes = EXCLUDED.bytes',
        [uid, rid, meta, buf.length, Date.now()]);
      await c.query('DELETE FROM receipt_parts WHERE user_id = ? AND receipt_id = ?', [uid, rid]);
      const n = await putParts(c, uid, rid, IMG, buf);
      await c.query('UPDATE receipts SET img_parts = ? WHERE user_id = ? AND id = ?', [n, uid, rid]);
      return null;
    });
    if (err) return overQuota(res);
    res.status(204).end();
  });
  app.put('/api/receipts/:id/original', full, idParam, raw('application/pdf', MAX_ORIGINAL), async (req, res) => {
    const uid = req.user.id, rid = req.params.id, buf = req.body;
    if (!Buffer.isBuffer(buf) || buf.subarray(0, 5).toString('latin1') !== '%PDF-') return res.status(400).json({ code: 'not_pdf' });
    let name = 'receipt.pdf';
    try { name = decodeURIComponent(String(req.headers['x-file-name'] || 'receipt.pdf')); } catch (e) { /* keep default */ }
    name = core.safeName(name.replace(/\.pdf$/i, '')).slice(0, 100) + '.pdf';
    const err = await tx(pool, async (c) => {
      const cur = await receiptRow(c, uid, rid, true);
      if (!cur) return 'missing';
      if (await used(c, uid) - cur.bytes + cur.m.size + buf.length > cfg.quotaBytes) return 'quota';
      const n = await putParts(c, uid, rid, ORIG, buf);
      const meta = keys.sealJSON({ ...cur.m, osize: buf.length, otype: 'application/pdf', oname: name }, 'receipt-meta:' + uid + ':' + rid);
      await c.query('UPDATE receipts SET meta = ?, orig_parts = ?, bytes = ? WHERE user_id = ? AND id = ?', [meta, n, cur.m.size + buf.length, uid, rid]);
      return null;
    });
    if (err === 'missing') return res.status(404).json({ code: 'not_found' });
    if (err) return overQuota(res);
    res.status(204).end();
  });
  app.get('/api/receipts/:id', full, idParam, async (req, res) => {
    const uid = req.user.id, rid = req.params.id;
    const r = await receiptRow(pool, uid, rid);
    if (!r) return res.status(404).json({ code: 'not_found' });
    const buf = await getParts(uid, rid, IMG, r.img_parts);
    if (!buf) return res.status(404).json({ code: 'not_found' });
    res.set({ 'Content-Type': 'image/jpeg', 'Content-Disposition': 'attachment; filename="receipt.jpg"', 'X-Image-Width': String(r.m.w), 'X-Image-Height': String(r.m.h) });
    res.end(buf);
  });
  app.get('/api/receipts/:id/original', full, idParam, async (req, res) => {
    const uid = req.user.id, rid = req.params.id;
    const r = await receiptRow(pool, uid, rid);
    if (!r || !r.orig_parts) return res.status(404).json({ code: 'not_found' });
    const buf = await getParts(uid, rid, ORIG, r.orig_parts);
    if (!buf) return res.status(404).json({ code: 'not_found' });
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="receipt.pdf"', 'X-File-Name': encodeURIComponent(r.m.oname || 'receipt.pdf') });
    res.end(buf);
  });
  app.delete('/api/receipts/:id', full, idParam, async (req, res) => {
    await pool.query('DELETE FROM receipts WHERE user_id = ? AND id = ?', [req.user.id, req.params.id]);
    res.status(204).end();
  });

  // Claude reads a stored receipt. The server builds the request itself from the person's own stored
  // file and a fixed prompt, so this can't be used to send anything else to Claude.
  app.post('/api/receipts/:id/read', full, idParam, json, async (req, res) => {
    if (!cfg.ai.key || cfg.ai.dailyLimit === 0) return res.status(503).json({ code: 'ai_off' });
    const uid = req.user.id, rid = req.params.id;
    if (!aiMinute.hit(uid)) return res.status(429).json({ code: 'rate_limited' });
    const r = await receiptRow(pool, uid, rid);
    if (!r) return res.status(404).json({ code: 'not_found' });
    const day = new Date().toISOString().slice(0, 10);
    await pool.query('INSERT INTO ai_usage (user_id, day, n) VALUES (?, ?, 1) ON CONFLICT (user_id, day) DO UPDATE SET n = ai_usage.n + 1', [uid, day]);
    const [[u]] = await pool.query('SELECT n FROM ai_usage WHERE user_id = ? AND day = ?', [uid, day]);
    if (u.n > cfg.ai.dailyLimit) return res.status(429).json({ code: 'ai_limit' });
    // The person's own date (their time zone), if it's within a day of the server's
    let today = req.body && req.body.today;
    if (!core.isISO(today) || Math.abs(core.daysBetween(today, day)) > 1) today = day;
    const kind = req.body && req.body.kind === 'statement' ? 'statement' : 'receipt';
    const pdf = r.orig_parts && kind === 'receipt' ? await getParts(uid, rid, ORIG, r.orig_parts) : null;
    const image = pdf ? null : await getParts(uid, rid, IMG, r.img_parts);
    if (!pdf && !image) return res.status(404).json({ code: 'not_found' });
    try {
      res.json(await readReceipt(cfg.ai, { pdf, image, today, kind }));
    } catch (e) {
      console.error('receipt reading failed: ' + (e.code || '') + ' ' + (e.status || ''));
      res.status(e.code === 'rate_limited' ? 429 : e.code === 'image_rejected' ? 422 : 502).json({ code: e.code || 'ai_error' });
    }
  });

  /* ---------- the person's details (name, manager) ---------- */
  app.get('/api/settings', full, async (req, res) => {
    const uid = req.user.id;
    const [[r]] = await pool.query('SELECT body FROM settings WHERE user_id = ?', [uid]);
    res.json(r ? core.cleanSettings(keys.openJSON(r.body, 'settings:' + uid)) : {});
  });
  app.put('/api/settings', full, json, async (req, res) => {
    const uid = req.user.id;
    const body = keys.sealJSON(core.cleanSettings(req.body), 'settings:' + uid);
    await pool.query('INSERT INTO settings (user_id, body) VALUES (?, ?) ON CONFLICT (user_id) DO UPDATE SET body = EXCLUDED.body', [uid, body]);
    res.status(204).end();
  });

  // Erase everything this person has stored. Their account stays, so they can keep using MyExpense.
  app.delete('/api/me/data', full, async (req, res) => {
    const uid = req.user.id;
    await tx(pool, async (c) => {
      await c.query('DELETE FROM reports WHERE user_id = ?', [uid]);
      await c.query('DELETE FROM receipts WHERE user_id = ?', [uid]);
      await c.query('DELETE FROM settings WHERE user_id = ?', [uid]);
    });
    audit(req, 'data_deleted', { actor: uid, subject: uid });
    res.status(204).end();
  });
}

module.exports = { dataRoutes };
