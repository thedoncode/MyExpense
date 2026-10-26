(function () {
'use strict';
const C = window.ExpenseCore;
const LAYOUTS = /*__LAYOUTS__*/null;
const TPL = { itemized: '/*__TPL_IT__*/', perdiem: '/*__TPL_PD__*/' };
// pdf.js, loaded only when someone adds a PDF receipt. Pinned and integrity-checked (the legacy build,
// for older phones); the build fills in where it's served from. pdf.js 6 has no eval code path
// (CVE-2024-4367 is fixed upstream); XFA stays off.
const PDFJS = /*__PDFJS__*/null;
const MAX_UPLOAD = 25 * 1024 * 1024; // per file
// Claude or web: storage, sign-in, receipt reading and downloads (src/platform-*.js)
const PLAT = window.MyExpensePlatform;
// Set per environment: by build.js for Claude (environments.json), by the server for the web version
const ENV = PLAT.env || /*__ENV__*/{ name: 'prod', title: 'MyExpense', banner: '' };

if (!window.htmPreact) {
  document.getElementById('app').innerHTML = '<div class="wrap"><div class="panel panel-b"><h2>MyExpense couldn’t load</h2><p class="muted">A required script didn’t load. Check your connection and reload the page.</p></div></div>';
  return;
}
const { html, render, useState, useEffect, useRef, useMemo } = window.htmPreact;

/* ---------- small utils ---------- */
const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const todayISO = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
function b64ToBytes(b64) { const bin = atob(b64); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
function bytesToB64(u8) { let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); }
const usd = (n) => '$' + C.round2(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const cad = (n) => 'CA$' + C.round2(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const plural = (n, w, p) => n + ' ' + (n === 1 ? w : (p || w + 's'));
function rangeText(a, b) {
  if (!C.isISO(a) || !C.isISO(b)) return '';
  const ya = a.slice(0, 4), yb = b.slice(0, 4);
  return C.fmtMonD(a) + (ya !== yb ? ', ' + ya : '') + ' – ' + C.fmtMonD(b) + ', ' + yb;
}
function loadScript([src, integrity]) {
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    if (/\.mjs$/.test(src)) s.type = 'module';
    s.src = src; s.integrity = integrity; s.crossOrigin = 'anonymous';
    s.onload = res; s.onerror = () => rej(new Error('Couldn’t load the PDF reader. Check your connection and try again.'));
    document.head.appendChild(s);
  });
}

/* ---------- icons ---------- */
const P = {
  back: 'M15 18l-6-6 6-6', camera: 'M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  upload: 'M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3', plus: 'M12 5v14M5 12h14', trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  check: 'M5 12l5 5 9-10', alert: 'M12 8v5M12 16.5v.5M10.3 4.2L2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z',
  cloud: 'M7 18a4 4 0 0 1-.5-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17.5 18z', phone: 'M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3', cal: 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5', x: 'M6 6l12 12M18 6L6 18',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0', lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3', download: 'M12 4v12M7 11l5 5 5-5M5 20h14', sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
};
const Icon = ({ n, size }) => html`<svg class="i" viewBox="0 0 24 24" aria-hidden="true" style=${size ? 'width:' + size + 'px;height:' + size + 'px' : ''}><path d=${P[n]} /></svg>`;

/* ---------- services: the platform provides sign-in, private storage, receipt reading, downloads ---------- */
// Each person's reports and receipts live only in their own private storage, enforced on the
// server (Claude's database rules, or the MyExpense server). Nothing is kept on the device.
const bus = new Set();
const emit = () => bus.forEach(f => f());
const Svc = {
  ready: false, store: null, user: null,
  access: 'checking', // checking | ok | signin | no-access | error, plus platform-specific screens
};
async function initServices() {
  try { await PLAT.init(Svc, ENV, emit); } catch (e) { Svc.store = null; Svc.access = 'error'; }
  Svc.ready = true; emit();
}
const aiOn = () => PLAT.aiAvailable(Svc);

// A refused write or read (no access, access removed, or the session ended) drops everything held
// in memory and shows the access or sign-in screen.
function lostAccess(state) {
  for (const t of timers.values()) clearTimeout(t);
  timers.clear();
  for (const u of urlCache.values()) URL.revokeObjectURL(u);
  urlCache.clear();
  Model.reports = []; Model.settings = {}; Model.loaded = false;
  Svc.store = null; Svc.user = null; Svc.access = state || 'no-access'; emit();
}
// Returns true when the caller may retry later
function writeFailed(e, what) {
  const kind = PLAT.classify(e, what);
  if (kind === 'toolarge') { toast('This report is too large to save. Split it into two reports.'); return false; }
  if (kind === 'access') { lostAccess('no-access'); return false; }
  if (kind === 'signin') { lostAccess('signin'); return false; }
  if (kind === 'quota') { toast('MyExpense’s storage is full. Delete reports you’ve already submitted, then try again.'); return false; }
  if (kind === 'bad') { toast('That change couldn’t be saved. Reload the page and try again.'); return false; }
  return true;
}

/* ---------- model: reports kept in memory, saved as they change ---------- */
const Model = {
  reports: [], settings: {}, loaded: false, saveState: 'idle',
  get(id) { return this.reports.find(r => r.id === id); },
  set(list) { this.reports = list; emit(); },
  update(id, fn) {
    const cur = this.get(id); if (!cur) return;
    const next = fn(cur); if (!next || next === cur) return;
    next.updatedAt = Date.now();
    this.reports = this.reports.map(r => (r.id === id ? next : r));
    schedule(next.id); emit();
  },
  add(r) { this.reports = [r, ...this.reports]; schedule(r.id); emit(); },
  async remove(id) {
    const r = this.get(id); if (!r) return;
    clearTimeout(timers.get(id)); timers.delete(id);
    this.reports = this.reports.filter(x => x.id !== id); emit();
    const imgs = new Set((r.charges || []).map(c => c.imageId).filter(Boolean));
    try { await Svc.store.deleteReport(id); for (const i of imgs) await Svc.store.deleteImage(i).catch(() => {}); }
    catch (e) { if (writeFailed(e)) toast('Couldn’t delete that report. Try again.'); }
  },
  async saveSettings(s) {
    this.settings = s; emit();
    try { await Svc.store.saveSettings(s); } catch (e) { if (writeFailed(e)) toast('Couldn’t save your details. Try again.'); }
  },
};
const timers = new Map();
const retries = new Map();
function setSave(s) { Model.saveState = s; emit(); }
function schedule(id) { clearTimeout(timers.get(id)); setSave('saving'); timers.set(id, setTimeout(() => persist(id), 600)); }
async function persist(id) {
  timers.delete(id);
  const r = Model.get(id); if (!r || !Svc.store) return;
  try { await Svc.store.saveReport(r); retries.delete(id); if (!timers.size) setSave('saved'); }
  catch (e) {
    if (!writeFailed(e, r)) { if (Svc.access === 'ok') setSave('error'); return; }
    const n = (retries.get(id) || 0) + 1; retries.set(id, n);
    setSave('retrying');
    timers.set(id, setTimeout(() => persist(id), Math.min(60000, 2000 * 2 ** n) + Math.random() * 1000));
  }
}
async function flush(id) { if (timers.has(id)) { clearTimeout(timers.get(id)); await persist(id); } }
async function loadAll() {
  try {
    const [list, s] = await Promise.all([Svc.store.listReports(), Svc.store.getSettings()]);
    Model.settings = C.cleanSettings(s);
    Model.reports = list.map(C.cleanReport).filter(Boolean).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)); // validate everything read back
    Model.loaded = true; emit();
  } catch (e) {
    const kind = PLAT.classify(e);
    if (kind === 'access' || kind === 'signin') lostAccess(kind === 'signin' ? 'signin' : 'no-access'); else { Svc.access = 'error'; emit(); }
  }
}
function useTick() { const [, set] = useState(0); useEffect(() => { const f = () => set(x => x + 1); bus.add(f); return () => bus.delete(f); }, []); }

/* ---------- toasts & confirm ---------- */
let toastList = [];
function toast(msg) { const id = uid('t'); toastList = [...toastList, { id, msg }]; emit(); setTimeout(() => { toastList = toastList.filter(t => t.id !== id); emit(); }, 4200); }
let confirmState = null;
function askConfirm(opts) { return new Promise(res => { confirmState = { ...opts, res }; emit(); }); }

/* ---------- images: compress, PDFs, thumbnails ---------- */
function canvasBlob(cv, q) { return new Promise((res, rej) => cv.toBlob(b => (b ? res(b) : rej(new Error('Could not encode image'))), 'image/jpeg', q)); }
async function decodeImage(file) {
  if (window.createImageBitmap) { try { return await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch (e) { /* fall back */ } }
  const url = URL.createObjectURL(file);
  try { const img = new Image(); img.src = url; await img.decode(); return img; }
  finally { setTimeout(() => URL.revokeObjectURL(url), 2000); }
}
async function scaleToJpeg(src, maxSide, q) {
  const w0 = src.width, h0 = src.height;
  const k = Math.min(1, maxSide / Math.max(w0, h0));
  const cv = document.createElement('canvas'); cv.width = Math.round(w0 * k); cv.height = Math.round(h0 * k);
  const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); g.drawImage(src, 0, 0, cv.width, cv.height);
  return { blob: await canvasBlob(cv, q), w: cv.width, h: cv.height, canvas: cv };
}
async function loadPdfJs() {
  if (window.pdfjsLib && window.pdfjsWorker) return window.pdfjsLib;
  await loadScript(PDFJS.lib);    // sets window.pdfjsLib
  await loadScript(PDFJS.worker); // sets window.pdfjsWorker, so pdf.js runs on the page itself
  if (!window.pdfjsLib || !window.pdfjsWorker) throw new Error('Couldn’t start the PDF reader. Try a photo of the receipt instead.');
  return window.pdfjsLib;
}
async function processFile(file) {
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '');
  if (!isPdf) {
    let src;
    try { src = await decodeImage(file); } catch (e) { throw new Error('That photo format can’t be opened here. Try a JPEG or PNG, or take a screenshot.'); }
    if (src.width * src.height > 80e6) throw new Error('That image is too large to open (over 80 megapixels).');
    const out = await scaleToJpeg(src, 1600, 0.74);
    return { blob: out.blob, w: out.w, h: out.h, aiBlobs: [out.blob] };
  }
  const lib = await loadPdfJs();
  const pdf = await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()), enableXfa: false, isEvalSupported: false }).promise;
  const pages = Math.min(pdf.numPages, 3);
  const canvases = [];
  for (let p = 1; p <= pages; p++) {
    const page = await pdf.getPage(p);
    const vp0 = page.getViewport({ scale: 1 });
    const vp = page.getViewport({ scale: 1100 / vp0.width });
    const cv = document.createElement('canvas'); cv.width = Math.round(vp.width); cv.height = Math.round(vp.height);
    const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height);
    await page.render({ canvasContext: g, viewport: vp }).promise;
    canvases.push(cv);
  }
  const aiBlobs = [];
  for (const cv of canvases) aiBlobs.push(await canvasBlob(cv, 0.8));
  const W = canvases[0].width, H = canvases.reduce((a, c) => a + c.height, 0);
  const all = document.createElement('canvas'); all.width = W; all.height = H;
  const g = all.getContext('2d'); let y = 0; for (const cv of canvases) { g.drawImage(cv, 0, y); y += cv.height; }
  const out = await scaleToJpeg(all, 3000, 0.72);
  const orig = file.size <= 6 * 1024 * 1024 ? { blob: file.slice(0, file.size, 'application/pdf'), name: file.name || 'receipt.pdf', type: 'application/pdf' } : null;
  return { blob: out.blob, w: out.w, h: out.h, aiBlobs, orig };
}
const urlCache = new Map();
function useImageURL(id) {
  const [url, setUrl] = useState(urlCache.get(id) || null);
  useEffect(() => {
    let live = true;
    if (!id || !Svc.store) { setUrl(null); return; }
    if (urlCache.has(id)) { setUrl(urlCache.get(id)); return; }
    Svc.store.getImage(id).then(img => { if (img && img.blob) { const u = URL.createObjectURL(img.blob); urlCache.set(id, u); if (live) setUrl(u); } }).catch(() => {});
    return () => { live = false; };
  }, [id]);
  return url;
}

/* ---------- receipt reading with Claude ---------- */
const aiQueue = []; let aiBusy = false;
function queueAI(job) { aiQueue.push(job); pumpAI(); }
async function pumpAI() {
  if (aiBusy) return; const job = aiQueue.shift(); if (!job) return;
  aiBusy = true; try { await runAI(job); } finally { aiBusy = false; pumpAI(); }
}
function patchCharge(r, cid, patch) { return { ...r, charges: r.charges.map(c => (c.id === cid ? { ...c, ...patch } : c)) }; }
function aiErrorText(e) {
  const code = e && e.code;
  if (code === 'not_granted' || code === 'ai_off') return 'Receipt reading is turned off. Fill in the details from the photo.';
  if (code === 'ai_limit') return 'You’ve reached today’s limit for receipt reading. Fill in the details from the photo.';
  if (code === 'rate_limited' || code === 'usage_limited') return 'Claude is busy right now. Fill in the details from the photo.';
  if (code === 'image_rejected') return 'Claude couldn’t open this photo. Fill in the details from it.';
  return 'Couldn’t read this receipt. Fill in the details from the photo.';
}
async function runAI({ reportId, chargeId, blobs, imageId }) {
  if (!aiOn()) { Model.update(reportId, r => patchCharge(r, chargeId, { ai: null, currency: 'CAD' })); return; }
  try {
    const raw = await PLAT.readReceipt(Svc, { blobs, imageId, today: todayISO(), prompt: C.AI_PROMPT(todayISO()) });
    const res = C.normalizeAi(raw);
    if (!res.transactions.length) {
      Model.update(reportId, r => patchCharge(r, chargeId, { ai: 'failed', currency: 'CAD', aiNote: res.kind === 'unreadable' ? 'Claude couldn’t make out this photo. Fill in the details, or retake it.' : 'No claimable charges found on this photo. Fill in the details if it belongs on the report.' }));
      return;
    }
    Model.update(reportId, r => {
      const at = r.charges.findIndex(c => c.id === chargeId); if (at < 0) return r;
      const base = r.charges[at];
      const made = res.transactions.map((t, k) => ({
        ...base, id: k === 0 ? chargeId : uid('c'), date: t.date, vendor: t.vendor || '', category: t.category,
        amount: t.amount, currency: t.currency, cad: t.cad, payment: t.payment || '', approved: false, ai: 'read', checked: false, aiNote: t.note || '',
      }));
      const charges = r.charges.slice(); charges.splice(at, 1, ...made);
      return { ...r, charges };
    });
  } catch (e) {
    if (PLAT.aiFailed(Svc, e)) emit();
    if (PLAT.classify(e) === 'signin') { lostAccess('signin'); return; }
    Model.update(reportId, r => patchCharge(r, chargeId, { ai: 'failed', currency: 'CAD', aiNote: aiErrorText(e) }));
  }
}
const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
async function expandFiles(files) {
  const out = [];
  for (const f of files) {
    if (f.type === DOCX || /\.docx$/i.test(f.name || '')) {
      try {
        const z = await window.JSZip.loadAsync(await f.arrayBuffer());
        const media = Object.keys(z.files).filter(p => /^word\/media\/[^/]+\.(png|jpe?g|gif|bmp|webp)$/i.test(p))
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        if (!media.length) { toast(f.name + ' has no pictures in it.'); continue; }
        for (const p of media) {
          const ext = p.split('.').pop().toLowerCase();
          const b = await z.file(p).async('blob');
          out.push(new File([b], (f.name || 'document').replace(/\.docx$/i, '') + ' - ' + p.split('/').pop(), { type: 'image/' + (ext === 'jpg' ? 'jpeg' : ext) }));
        }
      } catch (e) { toast('Couldn’t open ' + (f.name || 'that document') + '.'); }
    } else out.push(f);
  }
  return out;
}
async function addFiles(reportId, files) {
  const tooBig = [...files].filter(f => f.size > MAX_UPLOAD);
  if (tooBig.length) toast(tooBig.map(f => f.name || 'A file').join(', ') + ' is over 25 MB, so it was skipped.');
  const list = (await expandFiles([...files].filter(f => f.size <= MAX_UPLOAD))).filter(f => /^image\//.test(f.type) || f.type === 'application/pdf' || /\.(pdf|jpe?g|png|heic|webp)$/i.test(f.name || ''));
  if (!list.length) { toast('Choose a photo, PDF or Word file with the receipts.'); return; }
  for (const file of list) {
    const cid = uid('c');
    Model.update(reportId, r => ({ ...r, charges: [...r.charges, { id: cid, date: null, vendor: '', category: '', amount: null, currency: null, cad: null, approved: false, imageId: null, ai: 'processing', checked: false }] }));
    try {
      const img = await processFile(file);
      const imageId = uid('i');
      if (!Svc.store) return;
      try { await Svc.store.putImage(imageId, img.blob, { w: img.w, h: img.h }, img.orig); }
      catch (e) { writeFailed(e); if (Svc.access !== 'ok') return; throw new Error('Couldn’t save the photo. Check your connection and add it again.'); }
      const reading = aiOn();
      Model.update(reportId, r => patchCharge(r, cid, { imageId, ai: reading ? 'reading' : null, currency: reading ? null : 'CAD' }));
      if (reading) queueAI({ reportId, chargeId: cid, blobs: img.aiBlobs, imageId });
    } catch (e) {
      Model.update(reportId, r => patchCharge(r, cid, { ai: 'failed', currency: 'CAD', aiNote: (e && e.message) || 'Couldn’t add that file.' }));
    }
  }
}

/* ---------- downloads & exports ---------- */
function saveFile(filename, blob) { return PLAT.saveFile(Svc, filename, blob, toast); }
async function exportXlsx(r) {
  const tpl = b64ToBytes(r.type === 'perdiem' ? TPL.perdiem : TPL.itemized);
  const res = r.type === 'perdiem' ? await C.perDiemXlsx(window.JSZip, tpl, r) : await C.itemizedXlsx(window.JSZip, tpl, r);
  return saveFile(C.fileBase(r) + '.xlsx', new Blob([res.bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
}
async function exportPdf(r) {
  const doc = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter', compress: true });
  doc.setProperties({ title: C.fileBase(r), author: r.name || '', creator: ENV.title });
  if (r.type === 'perdiem') {
    const weeks = C.perDiemWeeks(r);
    C.pdfForms(doc, LAYOUTS.perdiem, weeks.map(w => ({ title: w.title, values: C.perDiemCells(r, w) })));
  } else {
    const s = C.itemizedSummary(r);
    C.pdfForms(doc, LAYOUTS.itemized, s.weeks.map(w => ({ title: w.title, values: C.itemizedCells(r, w) })));
  }
  return saveFile(C.fileBase(r) + '.pdf', doc.output('blob'));
}
// Receipts for the charges on the report, numbered in date order (same numbers in the PDF and the zip)
async function exportReceiptsPdf(r) {
  const recs = [];
  for (const x of C.receiptList(r)) {
    const img = await Svc.store.getImage(x.imageId).catch(() => null);
    recs.push({ no: x.no, data: img && img.blob ? new Uint8Array(await img.blob.arrayBuffer()) : null, w: img ? img.w : 1, h: img ? img.h : 1, lines: x.lines });
  }
  if (!recs.length) { toast('There are no receipt photos on this report.'); return false; }
  const doc = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter', compress: true });
  doc.setProperties({ title: C.fileBase(r) + ' Receipts', author: r.name || '', creator: ENV.title });
  C.pdfReceipts(doc, recs, (r.customer || '') + ' · ' + (r.name || '') + ' · receipts', true);
  return saveFile(C.fileBase(r) + ' Receipts.pdf', doc.output('blob'));
}
function extFor(orig) { if (orig.type === 'application/pdf') return 'pdf'; const m = /\.([a-z0-9]{2,5})$/i.exec(orig.name || ''); return m ? m[1].toLowerCase() : 'bin'; }
async function receiptFile(imageId) {
  const orig = Svc.store.getOriginal ? await Svc.store.getOriginal(imageId).catch(() => null) : null;
  if (orig && orig.blob) return { blob: orig.blob, ext: extFor(orig) };
  const img = await Svc.store.getImage(imageId).catch(() => null);
  return img && img.blob ? { blob: img.blob, ext: 'jpg' } : null;
}
async function exportReceiptsZip(r) {
  const zip = new window.JSZip();
  let n = 0;
  for (const x of C.receiptList(r)) {
    const f = await receiptFile(x.imageId);
    if (f) { zip.file(x.name + '.' + f.ext, f.blob); n++; }
  }
  if (!n) { toast('There are no receipt photos on this report.'); return false; }
  return saveFile(C.fileBase(r) + ' Receipts.zip', await zip.generateAsync({ type: 'blob', compression: 'STORE' }));
}
async function downloadReceipt(c) {
  const f = await receiptFile(c.imageId);
  if (!f) { toast('That receipt photo couldn’t be loaded.'); return false; }
  const cat = C.CAT[c.category];
  const name = C.safeName((C.isISO(c.date) ? c.date + ' ' : '') + (cat ? (cat.short || cat.label) : 'Receipt') + (c.vendor ? ' - ' + c.vendor : '')) || 'Receipt';
  return saveFile(name + '.' + f.ext, f.blob);
}

/* ---------- report helpers ---------- */
function newReport(type) {
  const base = { id: uid('r'), type, name: Model.settings.name || '', customer: '', createdAt: Date.now(), updatedAt: Date.now() };
  if (type === 'perdiem') return { ...base, start: '', end: '', partialMode: null, partialDays: [] };
  return { ...base, manager: Model.settings.manager !== undefined ? Model.settings.manager : 'Nic Cameron', location: '', charges: [] };
}
function isBlank(r) { return r.type === 'perdiem' ? !r.customer && !r.start && !r.end : !r.customer && !(r.charges || []).length; }
function reportStatus(r) {
  if (r.type === 'perdiem') {
    const p = C.perDiemProblems(r); const s = C.perDiemSummary(r);
    return { total: s.total, cur: 'USD', range: rangeText(r.start, r.end), meta: s.weeks.length ? plural(s.weeks.length, 'week') + ' · ' + plural(s.fullDays + s.partialDays, 'day') : 'No dates yet', problems: p };
  }
  const s = C.itemizedSummary(r); const p = C.itemizedProblems(r);
  const pending = (r.charges || []).filter(c => c.ai === 'read' && !c.checked).length;
  return { total: s.total, cur: 'CAD', range: s.first ? rangeText(s.first, s.last) : '', meta: plural((r.charges || []).length, 'charge') + (s.weeks.length ? ' · ' + plural(s.weeks.length, 'week') : ''), problems: p, left: s.left.length, pending };
}

/* ---------- components ---------- */
function EnvBand() {
  return ENV.banner ? html`<div class="envband" role="note">${ENV.banner}</div>` : null;
}
function StorePill() {
  if (Svc.access !== 'ok') return null;
  return html`<span class="store-pill"><${Icon} n=${WORDS.pillIcon} size=${16} />${WORDS.pill}</span>`;
}
function SaveState() {
  const s = Model.saveState;
  if (s === 'saving') return html`<span>Saving…</span>`;
  if (s === 'retrying') return html`<span style="color:var(--warn)">Not saved yet. Retrying…</span>`;
  if (s === 'error') return html`<span style="color:var(--bad)">Not saved</span>`;
  if (s === 'saved') return html`<span>${WORDS.saved}</span>`;
  return null;
}

function Home({ open, openSettings }) {
  const reps = Model.reports;
  const name = Model.settings.name;
  return html`
  <div class="wrap">
    <div class="section-h">
      <div style="display:grid;gap:4px">
        <h1>${name ? 'Expense reports for ' + name.split(' ')[0] : 'Expense reports'}</h1>
        <${StorePill} />
      </div>
      <button class="btn sm" onClick=${openSettings}><${Icon} n="user" size=${18} />${name ? 'Your details' : 'Add your name'}</button>
    </div>
    <div class="start">
      <button class="start-card" onClick=${() => open(newReport('perdiem'), true)}>
        <div class="row"><span class="tag pd">Per diem</span><${Icon} n="cal" /></div>
        <div class="big">New per diem report</div>
        <p class="muted small">US trip at $100 a day, $50 for partial days. Pick the dates; it splits into Sunday–Saturday weeks for you.</p>
      </button>
      <button class="start-card" onClick=${() => open(newReport('itemized'), true)}>
        <div class="row"><span class="tag it">Itemized</span><${Icon} n="receipt" /></div>
        <div class="big">New itemized report</div>
        <p class="muted small">Snap your Uber, rental, baggage and fuel receipts. Each charge lands on its day in the right week.</p>
      </button>
    </div>
    <div class="section-h"><h2>Your reports</h2>${Model.loaded && reps.length > 0 && html`<span class="muted small">${plural(reps.length, 'report')}</span>`}</div>
    ${!Model.loaded ? html`<div class="list"><div class="skel"></div><div class="skel"></div></div>`
      : reps.length === 0 ? html`<div class="empty"><${Icon} n="receipt" size=${28} /><b style="color:var(--ink)">No reports yet</b><p class="small">${WORDS.empty}</p></div>`
      : html`<div class="list">${reps.map(r => html`<${ReportCard} key=${r.id} r=${r} onOpen=${() => open(r)} />`)}</div>`}
  </div>`;
}
function ReportCard({ r, onOpen }) {
  const st = reportStatus(r);
  let chip;
  if (r.type === 'itemized' && (r.charges || []).some(c => c.ai === 'reading' || c.ai === 'processing')) chip = html`<span class="chip info"><span class="spin"></span>Reading receipts</span>`;
  else if (st.problems.length) chip = html`<span class="chip warn"><span class="dot"></span>${st.problems.length === 1 ? st.problems[0].msg.replace(/\.$/, '') : st.problems.length + ' things to finish'}</span>`;
  else if (st.pending) chip = html`<span class="chip warn"><span class="dot"></span>${plural(st.pending, 'charge')} to check</span>`;
  else chip = html`<span class="chip ok"><${Icon} n="check" size=${14} />Ready to download</span>`;
  return html`<button class="rcard" onClick=${onOpen}>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class=${'tag ' + (r.type === 'perdiem' ? 'pd' : 'it')}>${r.type === 'perdiem' ? 'Per diem' : 'Itemized'}</span><span class="meta">${st.range}</span></div>
    <div class="total">${st.cur === 'USD' ? usd(st.total) : cad(st.total)}<div class="faint small" style="font-family:var(--f-body)">${st.cur}</div></div>
    <div class="cust">${r.customer || html`<span class="faint">Untitled ${r.type === 'perdiem' ? 'per diem' : 'itemized'} report</span>`}</div>
    <div></div>
    <div class="meta">${st.meta}</div>
    <div class="status">${chip}</div>
  </button>`;
}

function Field({ id, label, hint, children }) {
  return html`<div class="field"><label for=${id}>${label}</label>${children}${hint && html`<span class="hint">${hint}</span>`}</div>`;
}
function TextInput({ id, value, onValue, placeholder, bad, autocomplete, type, max }) {
  return html`<input id=${id} class=${'inp' + (bad ? ' bad' : '')} type=${type || 'text'} value=${value || ''} maxlength=${max || 80} placeholder=${placeholder || ''} autocomplete=${autocomplete || 'off'} onInput=${e => onValue(e.target.value)} />`;
}
function MoneyInput({ id, value, onValue, bad, placeholder }) {
  const [txt, setTxt] = useState(value === null || value === undefined || value === '' ? '' : String(value));
  const focused = useRef(false);
  useEffect(() => { if (!focused.current) setTxt(value === null || value === undefined || value === '' ? '' : String(value)); }, [value]);
  return html`<input id=${id} class=${'inp money' + (bad ? ' bad' : '')} inputmode="decimal" value=${txt} placeholder=${placeholder || '0.00'}
    onFocus=${() => { focused.current = true; }} onBlur=${() => { focused.current = false; const n = parseFloat(String(txt).replace(/[$,\s]/g, '')); setTxt(isFinite(n) ? n.toFixed(2) : ''); }}
    onInput=${e => { const t = e.target.value; setTxt(t); const n = parseFloat(t.replace(/[$,\s]/g, '')); onValue(t.trim() === '' ? null : isFinite(n) ? C.round2(n) : null); }} />`;
}
function rememberName(v) {
  if (v && v.trim().length > 3 && !Model.settings.name) Model.settings = { ...Model.settings, name: v.trim() };
}

/* ---- Per diem editor ---- */
function PerDiemEditor({ r }) {
  const set = (patch) => Model.update(r.id, x => ({ ...x, ...patch }));
  const problems = C.perDiemProblems(r);
  const bad = (f) => problems.some(p => p.field === f);
  const weeks = C.perDiemWeeks(r);
  const sum = C.perDiemSummary(r);
  const partial = new Set(r.partialMode === 'some' ? r.partialDays : []);
  function toggle(d) {
    const cur = new Set(r.partialMode === 'some' ? r.partialDays : []);
    cur.has(d) ? cur.delete(d) : cur.add(d);
    set({ partialMode: 'some', partialDays: [...cur].sort() });
  }
  const tooLong = bad('end') && C.isISO(r.start) && C.isISO(r.end) && C.parse(r.end) >= C.parse(r.start);
  return html`
  <div class="wrap">
    <section class="panel">
      <div class="panel-h"><h2>Trip</h2></div>
      <div class="panel-b">
        <div class="fields">
          <${Field} id="pd-name" label="Employee full name"><${TextInput} id="pd-name" value=${r.name} bad=${!r.name && r.customer} autocomplete="name" placeholder="First and last name" onValue=${v => { set({ name: v }); rememberName(v); }} /><//>
          <${Field} id="pd-cust" label="Customer"><${TextInput} id="pd-cust" value=${r.customer} placeholder="e.g. NBC Universal" onValue=${v => set({ customer: v })} /><//>
          <${Field} id="pd-start" label="Trip start"><input id="pd-start" class="inp" type="date" value=${r.start} onChange=${e => set({ start: e.target.value, ...(r.end && e.target.value > r.end ? { end: e.target.value } : {}) })} /><//>
          <${Field} id="pd-end" label="Trip end"><input id="pd-end" class=${'inp' + (bad('end') && r.end ? ' bad' : '')} type="date" min=${r.start || ''} value=${r.end} onChange=${e => set({ end: e.target.value })} /><//>
        </div>
        ${tooLong && html`<p class="small" style="color:var(--bad)">${problems.find(p => p.field === 'end').msg}</p>`}
        <div class="terms">
          <span>Destination <b>United States</b></span><span>Currency <b>USD</b></span><span>Full day <b>$100</b></span><span>Partial day <b>$50</b></span><span>Department <b>Service</b></span>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-h"><h2>Partial days</h2><span class="muted small">Paid at 50%. Only the days you mark count as partial.</span></div>
      <div class="panel-b">
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
          <div class="seg" role="group" aria-label="Any partial days?">
            <button aria-pressed=${r.partialMode === 'none'} onClick=${() => set({ partialMode: 'none', partialDays: [] })}>None</button>
            <button aria-pressed=${r.partialMode === 'some'} onClick=${() => set({ partialMode: 'some' })}>Mark partial days</button>
          </div>
          ${r.partialMode === null && weeks.length > 0 && html`<span class="chip warn"><span class="dot"></span>Choose one to finish</span>`}
          ${r.partialMode === 'some' && html`<span class="muted small">${partial.size ? plural([...partial].filter(d => weeks.some(w => w.days.some(x => x.date === d))).length, 'partial day') + ' marked' : 'Tap each partial day below'}</span>`}
        </div>
        ${weeks.length === 0
          ? html`<div class="empty"><${Icon} n="cal" size=${26} /><p class="small">Pick the trip start and end dates. The days appear here, split into the Sunday–Saturday weeks used on the form.</p></div>`
          : html`<div class="legend"><span><i class="sw full"></i>Full day · $100</span><span><i class="sw partial"></i>Partial day · $50</span></div>
            <div style="display:grid;gap:10px">${weeks.map(w => html`<${PdWeek} key=${w.weekEnding} w=${w} partial=${partial} onToggle=${toggle} />`)}</div>`}
      </div>
    </section>

    ${weeks.length > 0 && html`<section class="panel">
      <div class="panel-h"><h2>Totals</h2></div>
      <div class="panel-b">
        <div class="math">
          ${weeks.map(w => html`<div class="row"><span>${w.title}</span><span>${usd(w.total)}</span></div>`)}
          <div class="row faint" style="margin-top:4px"><span>${sum.fullDays} full × $100 + ${sum.partialDays} partial × $50</span></div>
          <div class="row tot"><span>Grand total (USD)</span><span>${usd(sum.total)}</span></div>
        </div>
      </div>
    </section>`}
  </div>`;
}
function PdWeek({ w, partial, onToggle }) {
  const sun = C.sundayOf(w.weekEnding);
  const inTrip = new Map(w.days.map(d => [d.date, d]));
  return html`<div class="week">
    <div class="week-tab"><span class="caps">Week ending</span><span class="we">${C.fmtDDMonYY(w.weekEnding)}</span><span class="sum">${usd(w.total)}</span></div>
    <div class="cal">
      ${C.DOW3.map(d => html`<div class="dh" aria-hidden="true">${d.slice(0, 1)}</div>`)}
      ${Array.from({ length: 7 }, (_, i) => {
        const d = C.addDays(sun, i); const day = inTrip.get(d);
        if (!day) return html`<div class="day off" aria-hidden="true"></div>`;
        const p = partial.has(d);
        return html`<button class=${'day ' + (p ? 'partial' : 'full')} aria-pressed=${p} aria-label=${C.fmtNice(d) + (p ? ', partial day, $50' : ', full day, $100')} onClick=${() => onToggle(d)}>
          <span class="dm">${C.MON[Number(d.slice(5, 7)) - 1]}</span><span class="dn">${Number(d.slice(8))}</span><span class="amt">${p ? '$50' : '$100'}</span>
        </button>`;
      })}
    </div>
  </div>`;
}

/* ---- Itemized editor ---- */
const CURRENCIES = ['CAD', 'USD', 'EUR', 'GBP', 'MXN', 'JPY', 'AUD', 'INR'];
function ItemizedEditor({ r }) {
  const set = (patch) => Model.update(r.id, x => ({ ...x, ...patch }));
  const [openId, setOpenId] = useState(null);
  const [drag, setDrag] = useState(false);
  const [viewer, setViewer] = useState(null);
  const camRef = useRef(null), upRef = useRef(null);
  const sum = C.itemizedSummary(r);
  const touch = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;

  useEffect(() => {
    const onPaste = (e) => {
      const files = [...(e.clipboardData && e.clipboardData.files || [])];
      if (files.length) { e.preventDefault(); addFiles(r.id, files); }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [r.id]);

  function addManual() {
    const id = uid('c');
    Model.update(r.id, x => ({ ...x, charges: [...x.charges, { id, date: todayISO(), vendor: '', category: 'taxi', amount: null, currency: 'CAD', cad: null, approved: false, imageId: null, ai: null, checked: true }] }));
    setOpenId(id);
  }
  const unplaced = r.charges.filter(c => !C.isISO(c.date) || c.ai === 'processing' || c.ai === 'reading');
  const placed = r.charges.filter(c => !unplaced.includes(c));
  const byWeek = new Map();
  for (const c of placed.slice().sort((a, b) => a.date.localeCompare(b.date))) {
    const sat = C.saturdayOf(c.date); if (!byWeek.has(sat)) byWeek.set(sat, []); byWeek.get(sat).push(c);
  }
  const weekTotal = (sat) => (sum.weeks.find(w => w.weekEnding === sat) || { total: 0 }).total;
  const row = (c) => html`<${ChargeItem} key=${c.id} c=${c} open=${openId === c.id} onToggle=${() => setOpenId(openId === c.id ? null : c.id)} reportId=${r.id} onView=${() => setViewer(c)} />`;

  return html`
  <div class="wrap">
    <section class="panel">
      <div class="panel-h"><h2>Report details</h2></div>
      <div class="panel-b">
        <div class="fields">
          <${Field} id="it-name" label="Employee full name"><${TextInput} id="it-name" value=${r.name} autocomplete="name" placeholder="First and last name" onValue=${v => { set({ name: v }); rememberName(v); }} /><//>
          <${Field} id="it-cust" label="Customer / trip" hint="Used in the file name"><${TextInput} id="it-cust" value=${r.customer} placeholder="e.g. WBD LA" onValue=${v => set({ customer: v })} /><//>
          <${Field} id="it-mgr" label="Manager name"><${TextInput} id="it-mgr" value=${r.manager} placeholder="Manager" onValue=${v => { set({ manager: v }); }} /><//>
          <${Field} id="it-loc" label="Location (optional)" hint="Printed in the Location row on days with charges"><${TextInput} id="it-loc" value=${r.location} placeholder="e.g. Burbank, CA" onValue=${v => set({ location: v })} /><//>
        </div>
        <p class="muted small">Department: <b>Service</b> · Amounts are the Canadian dollars that posted to your card.</p>
      </div>
    </section>

    <section class=${'capture' + (drag ? ' drag' : '')}
      onDragOver=${e => { e.preventDefault(); setDrag(true); }} onDragLeave=${() => setDrag(false)}
      onDrop=${e => { e.preventDefault(); setDrag(false); if (e.dataTransfer && e.dataTransfer.files.length) addFiles(r.id, e.dataTransfer.files); }}>
      <div class="capture-btns">
        ${touch && html`<button class="btn primary" onClick=${() => camRef.current && camRef.current.click()}><${Icon} n="camera" />Take photo</button>`}
        <button class=${'btn' + (touch ? '' : ' primary')} onClick=${() => upRef.current && upRef.current.click()}><${Icon} n="upload" />${touch ? 'Choose photos' : 'Upload receipts'}</button>
        <button class="btn" onClick=${addManual}><${Icon} n="plus" />Add without receipt</button>
      </div>
      <input ref=${camRef} id="it-cam" class="vh" type="file" accept="image/*" capture="environment" onChange=${e => { if (e.target.files.length) addFiles(r.id, e.target.files); e.target.value = ''; }} />
      <input ref=${upRef} id="it-up" class="vh" type="file" accept="image/*,application/pdf,.docx" multiple onChange=${e => { if (e.target.files.length) addFiles(r.id, e.target.files); e.target.value = ''; }} />
      <p class="note">${aiOn()
        ? html`<${Icon} n="sparkle" size=${14} /> Claude reads each receipt or card statement and fills in the charge for you to check. Photos, PDFs, Word files with pictures and pasted screenshots all work.`
        : 'Each photo becomes a charge with the receipt attached. Fill in the date, type and amount from it. Photos, PDFs, Word files with pictures and pasted screenshots all work.'}</p>
    </section>

    ${r.charges.length === 0 && html`<div class="empty"><${Icon} n="receipt" size=${28} /><b style="color:var(--ink)">No charges yet</b><p class="small">Usually claimed: Uber and taxi rides, vehicle rentals, airline baggage fees and fuel. Parking goes on only when you OK it.</p></div>`}

    ${unplaced.length > 0 && html`<div class="week">
      <div class="week-tab"><span class="caps">Needs a date</span><span class="sum faint" style="font-family:var(--f-body);font-weight:400">${plural(unplaced.length, 'charge')}</span></div>
      <div class="charges">${unplaced.map(row)}</div>
    </div>`}

    ${[...byWeek.keys()].sort().map(sat => html`<div class="week" key=${sat}>
      <div class="week-tab"><span class="caps">Week ending</span><span class="we">${C.fmtDDMonYY(sat)}</span><span class="sum">${cad(weekTotal(sat))}</span></div>
      <div class="charges">${byWeek.get(sat).map(row)}</div>
    </div>`)}

    ${r.charges.length > 0 && html`<section class="panel">
      <div class="panel-h"><h2>Totals</h2><span class="muted small">CAD</span></div>
      <div class="panel-b">
        <div class="math">
          ${sum.weeks.map(w => html`<div class="row"><span>${w.title}</span><span>${cad(w.total)}</span></div>`)}
          ${sum.weeks.length === 0 && html`<div class="row faint"><span>No complete charges yet</span><span>${cad(0)}</span></div>`}
          <div class="row tot"><span>Grand total</span><span>${cad(sum.total)}</span></div>
        </div>
        ${sum.left.length > 0 && html`<div class="left-off"><b class="small" style="color:var(--warn)">Not on the report yet</b><ul class="plain small">${sum.left.map(x => html`<li>${x.c.date ? C.fmtNice(x.c.date) : 'Undated'} ${x.c.category && C.CAT[x.c.category] ? '· ' + C.CAT[x.c.category].label : ''}${x.c.vendor ? ' · ' + x.c.vendor : ''}: ${x.issue}</li>`)}</ul></div>`}
      </div>
    </section>`}
    ${viewer && html`<${ImageViewer} c=${viewer} onClose=${() => setViewer(null)} />`}
  </div>`;
}

function shortIssue(t) {
  if (/OK to include/.test(t)) return 'Needs your OK';
  if (/CAD amount/.test(t)) return 'Needs CAD amount';
  return t.replace(/^needs/, 'Needs').replace(/^is still/, 'Still').replace(/^amount/, 'Amount');
}
function ChargeItem({ c, open, onToggle, reportId, onView }) {
  const url = useImageURL(c.imageId);
  const issue = C.chargeIssue(c);
  const cat = C.CAT[c.category];
  const val = C.chargeCAD(c);
  let chips = [];
  if (c.ai === 'processing') chips.push(html`<span class="chip info"><span class="spin"></span>Adding photo</span>`);
  else if (c.ai === 'reading') chips.push(html`<span class="chip info"><span class="spin"></span>Reading receipt</span>`);
  else {
    if (c.ai === 'read' && !c.checked) chips.push(html`<span class="chip warn"><span class="dot"></span>Check details</span>`);
    if (issue) chips.push(html`<span class="chip bad"><span class="dot"></span>${shortIssue(issue)}</span>`);
  }
  return html`<div class="charge">
    <button class="charge-row" onClick=${onToggle} aria-expanded=${open}>
      <span class="thumb">${url ? html`<img src=${url} alt="" />` : html`<${Icon} n=${c.imageId ? 'receipt' : 'plus'} />`}</span>
      <span style="min-width:0;display:grid;gap:3px">
        <span class="l1">${c.date && C.isISO(c.date) ? C.fmtNice(c.date) : 'Date needed'}${cat ? ' · ' + cat.label : ''}</span>
        <span class="l2">${c.vendor && html`<span>${c.vendor}</span>`}${c.payment && html`<span class="faint">${c.payment}</span>`}${chips}</span>
      </span>
      <span class="amt">${val !== null ? cad(val) : html`<span class="faint">—</span>`}${c.currency && c.currency !== 'CAD' && c.amount !== null && c.amount !== undefined ? html`<small>${c.currency} ${C.round2(c.amount).toFixed(2)}</small>` : ''}</span>
    </button>
    ${open && html`<${ChargeEdit} c=${c} url=${url} reportId=${reportId} onView=${onView} onDone=${onToggle} />`}
  </div>`;
}
function ChargeEdit({ c, url, reportId, onView, onDone }) {
  const set = (patch) => Model.update(reportId, r => patchCharge(r, c.id, patch));
  const cat = C.CAT[c.category];
  const id = (k) => 'ch-' + c.id + '-' + k;
  async function del() {
    const ok = await askConfirm({ title: 'Delete this charge?', body: c.imageId ? 'The charge and its receipt photo will be removed from this report.' : 'The charge will be removed from this report.', yes: 'Delete charge', danger: true });
    if (!ok) return;
    Model.update(reportId, r => {
      const charges = r.charges.filter(x => x.id !== c.id);
      if (c.imageId && Svc.store && !charges.some(x => x.imageId === c.imageId)) Svc.store.deleteImage(c.imageId).catch(() => {});
      return { ...r, charges };
    });
  }
  const busy = c.ai === 'processing' || c.ai === 'reading';
  return html`<div class="charge-edit">
    ${c.aiNote && html`<p class="small" style="color:var(--warn)">${c.aiNote}</p>`}
    ${(c.imageId || busy) && html`<div class="photo">
      <button class="big" onClick=${onView} aria-label="View receipt photo" disabled=${!url}>${url ? html`<img src=${url} alt="Receipt photo" />` : html`<span class="spin"></span>`}</button>
      <p class="small muted">${busy ? 'Reading the receipt…' : c.ai === 'read' ? 'Filled in by Claude from the photo. Compare it with the receipt, then confirm.' : 'Tap the photo to see it full size.'}</p>
    </div>`}
    <div class="fields">
      <${Field} id=${id('date')} label="Date"><input id=${id('date')} class=${'inp' + (!C.isISO(c.date) ? ' bad' : '')} type="date" value=${c.date || ''} onChange=${e => set({ date: e.target.value || null })} /><//>
      <${Field} id=${id('cat')} label="Type">
        <select id=${id('cat')} class=${'inp' + (!cat ? ' bad' : '')} value=${c.category || ''} onChange=${e => set({ category: e.target.value, approved: false })}>
          ${!cat && html`<option value="">Choose…</option>`}
          <optgroup label="Usually claimed">${C.CATS.filter(x => x.q).map(x => html`<option value=${x.key}>${x.label}</option>`)}</optgroup>
          <optgroup label="Only with your OK">${C.CATS.filter(x => !x.q).map(x => html`<option value=${x.key}>${x.label}</option>`)}</optgroup>
        </select>
      <//>
      <${Field} id=${id('vendor')} label="Vendor"><${TextInput} id=${id('vendor')} value=${c.vendor} max=${60} placeholder="e.g. Uber" onValue=${v => set({ vendor: v })} /><//>
      <${Field} id=${id('amt')} label="Amount on receipt">
        <div class="money-row">
          <${MoneyInput} id=${id('amt')} value=${c.amount} onValue=${v => set({ amount: v })} bad=${c.currency === 'CAD' && C.chargeCAD(c) === null} />
          <select id=${id('cur')} class=${'inp' + (!c.currency ? ' bad' : '')} aria-label="Currency" value=${c.currency || ''} onChange=${e => set({ currency: e.target.value })}>
            ${!c.currency && html`<option value="">—</option>`}
            ${CURRENCIES.concat(c.currency && !CURRENCIES.includes(c.currency) ? [c.currency] : []).map(k => html`<option value=${k}>${k}</option>`)}
          </select>
        </div>
      <//>
      ${c.currency && c.currency !== 'CAD' && html`<${Field} id=${id('cad')} label="CAD charged to your card" hint="From your card statement. MyExpense never converts currencies.">
        <${MoneyInput} id=${id('cad')} value=${c.cad} onValue=${v => set({ cad: v })} bad=${C.chargeCAD(c) === null} />
      <//>`}
    </div>
    ${cat && !cat.q && html`<label class="check"><input type="checkbox" checked=${!!c.approved} onChange=${e => set({ approved: e.target.checked })} /><span><b>Include on this report.</b> ${cat.label} isn’t on the usual list (taxi, rental, baggage, fuel). Tick this only if it’s approved.</span></label>`}
    <div class="edit-actions">
      <button class="btn sm ghost danger" onClick=${del}><${Icon} n="trash" size=${18} />Delete</button>
      ${c.ai === 'read' && !c.checked
        ? html`<button class="btn sm primary" onClick=${() => { set({ checked: true }); onDone(); }}><${Icon} n="check" size=${18} />Details are correct</button>`
        : html`<button class="btn sm" onClick=${onDone}>Done</button>`}
    </div>
  </div>`;
}
function ImageViewer({ c, onClose }) {
  const url = useImageURL(c.imageId);
  const [isPdf, setIsPdf] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => { let live = true; if (Svc.store.getOriginal) Svc.store.getOriginal(c.imageId).then(o => { if (live) setIsPdf(!!(o && o.type === 'application/pdf')); }).catch(() => {}); return () => { live = false; }; }, [c.imageId]);
  return html`<div class="scrim" onClick=${e => { if (e.target === e.currentTarget) onClose(); }}>
    <div class="sheet viewer" role="dialog" aria-label="Receipt photo">
      <div class="sheet-h"><h2>${c.vendor || 'Receipt'}${c.date ? ' · ' + C.fmtNice(c.date) : ''}</h2><button class="icon-btn" onClick=${onClose} aria-label="Close"><${Icon} n="x" /></button></div>
      ${url ? html`<img src=${url} alt="Receipt photo" />` : html`<div class="skel" style="height:300px"></div>`}
      <button class="btn" disabled=${busy || !url} onClick=${async () => { setBusy(true); try { await downloadReceipt(c); } finally { setBusy(false); } }}><${Icon} n="download" />${isPdf ? 'Download receipt PDF' : 'Download photo'}</button>
    </div>
  </div>`;
}

/* ---- export sheet ---- */
function OutButton({ ext, title, sub, busy, disabled, onClick }) {
  return html`<button class="out-btn" disabled=${disabled} onClick=${onClick}>
    <span class=${'ext ' + ext.toLowerCase()}>${ext}</span>
    <span><b>${busy ? 'Building…' : title}</b><span>${sub}</span></span>
    <${Icon} n="download" />
  </button>`;
}
function ExportSheet({ r, onClose }) {
  const [busy, setBusy] = useState(null);
  const isPd = r.type === 'perdiem';
  const problems = isPd ? C.perDiemProblems(r) : C.itemizedProblems(r);
  const sum = isPd ? C.perDiemSummary(r) : C.itemizedSummary(r);
  const warns = [], notes = [];
  let receipts = [];
  if (!isPd) {
    const reading = r.charges.filter(c => c.ai === 'reading' || c.ai === 'processing').length;
    if (reading) warns.push(plural(reading, 'receipt') + ' still being read. Wait a moment so ' + (reading === 1 ? 'it lands' : 'they land') + ' on the report.');
    const unchecked = r.charges.filter(c => c.ai === 'read' && !c.checked && !C.chargeIssue(c)).length;
    if (unchecked) warns.push(plural(unchecked, 'charge') + ' read by Claude ' + (unchecked === 1 ? 'hasn’t' : 'haven’t') + ' been checked against the receipt yet.');
    const left = sum.left.filter(x => x.c.ai !== 'reading' && x.c.ai !== 'processing');
    if (left.length) warns.push(plural(left.length, 'charge') + ' will be left off: ' + left.map(x => (x.c.date ? C.fmtMonD(x.c.date) : 'undated') + ' ' + x.issue).join('; ') + '.');
    const inc = sum.weeks.flatMap(w => w.charges);
    const okd = new Map();
    for (const c of inc) if (!C.CAT[c.category].q) okd.set(c.category, (okd.get(c.category) || 0) + 1);
    if (okd.size) notes.push('Included with your OK: ' + [...okd].map(([k, n]) => C.CAT[k].label + (n > 1 ? ' ×' + n : '')).join(', ') + '.');
    const fx = inc.filter(c => c.currency !== 'CAD').length;
    if (fx) notes.push('CAD amount entered by you for ' + plural(fx, 'foreign-currency receipt') + '.');
    notes.push('HST columns left blank.');
    receipts = C.receiptList(r);
  }
  const partialDates = isPd ? sum.weeks.flatMap(w => w.days).filter(d => d.partial).map(d => C.fmtNice(d.date)) : [];
  async function run(kind) {
    setBusy(kind);
    try {
      await flush(r.id);
      if (kind === 'xlsx') await exportXlsx(r);
      else if (kind === 'pdf') await exportPdf(r);
      else if (kind === 'rpdf') await exportReceiptsPdf(r);
      else if (kind === 'zip') await exportReceiptsZip(r);
    } catch (e) { console.error(e); toast('Couldn’t build the file: ' + (e && e.message ? e.message : 'unknown error')); }
    setBusy(null);
  }
  const blocked = problems.length > 0;
  return html`<div class="scrim" onClick=${e => { if (e.target === e.currentTarget) onClose(); }}>
    <div class="sheet" role="dialog" aria-label="Download report">
      <div class="sheet-h"><h2>Download & print</h2><button class="icon-btn" onClick=${onClose} aria-label="Close"><${Icon} n="x" /></button></div>
      ${blocked ? html`<div class="issues">${problems.map(p => html`<div class="issue bad"><${Icon} n="alert" size=${18} /><span>${p.msg}</span></div>`)}</div>`
        : html`<div class="math">
            ${sum.weeks.map(w => html`<div class="row"><span>${w.title}</span><span>${isPd ? usd(w.total) : cad(w.total)}</span></div>`)}
            <div class="row tot"><span>Total (${isPd ? 'USD' : 'CAD'})</span><span>${isPd ? usd(sum.total) : cad(sum.total)}</span></div>
          </div>
          ${isPd && html`<p class="small"><b>Partial days:</b> ${partialDates.length ? partialDates.join(', ') : 'none'}</p>`}
          ${!isPd && sum.weeks.length > 0 && html`<details class="byday">
            <summary>Charges by day</summary>
            ${sum.weeks.map(w => html`<div class="byday-week"><span class="caps muted">${w.title}</span>
              ${w.charges.map(c => html`<div class="row"><span>${C.fmtNice(c.date)} · ${C.CAT[c.category].label}${c.vendor ? ' · ' + c.vendor : ''}</span><span class="mono">${cad(C.chargeCAD(c))}</span></div>`)}
            </div>`)}
          </details>`}
          ${notes.length > 0 && html`<p class="small muted">${notes.join(' ')}</p>`}`}
      ${!blocked && warns.length > 0 && html`<div class="issues">${warns.map(w => html`<div class="issue warn"><${Icon} n="alert" size=${18} /><span>${w}</span></div>`)}</div>`}
      <div class="out-group">
        <span class="caps muted">Report form</span>
        <${OutButton} ext="XLSX" title="Excel workbook" sub=${'The ' + (isPd ? 'Travel Expense Report' : 'Expense Claim Report') + ' template, one sheet per week'} busy=${busy === 'xlsx'} disabled=${blocked || !!busy} onClick=${() => run('xlsx')} />
        <${OutButton} ext="PDF" title="Print-ready PDF" sub="The same form, one landscape page per week" busy=${busy === 'pdf'} disabled=${blocked || !!busy} onClick=${() => run('pdf')} />
      </div>
      ${!isPd && html`<div class="out-group">
        <span class="caps muted">Receipts${receipts.length ? ' · ' + receipts.length : ''}</span>
        ${receipts.length === 0 ? html`<p class="small muted">No receipt photos on the charges in this report yet.</p>` : html`
          <${OutButton} ext="PDF" title="Receipts PDF" sub="Every receipt, two per page, numbered and labelled with date, type and amount" busy=${busy === 'rpdf'} disabled=${!!busy} onClick=${() => run('rpdf')} />
          <${OutButton} ext="ZIP" title="Receipt files" sub="Each receipt as its own file, named by number, date, type and amount" busy=${busy === 'zip'} disabled=${!!busy} onClick=${() => run('zip')} />`}
      </div>`}
      <p class="faint small">File name: ${C.fileBase(r)}</p>
    </div>
  </div>`;
}

function SettingsSheet({ onClose }) {
  const [name, setName] = useState(Model.settings.name || '');
  const [mgr, setMgr] = useState(Model.settings.manager !== undefined ? Model.settings.manager : 'Nic Cameron');
  const [wiping, setWiping] = useState(false);
  async function wipe() {
    const ok = await askConfirm({ title: 'Delete all your MyExpense data?', body: 'Every report, receipt photo and saved detail of yours is erased for good. Download anything you still need first.', yes: 'Delete everything', danger: true });
    if (!ok) return;
    setWiping(true);
    for (const t of timers.values()) clearTimeout(t);
    timers.clear();
    try {
      await Svc.store.deleteAll();
      for (const u of urlCache.values()) URL.revokeObjectURL(u);
      urlCache.clear();
      Model.reports = []; Model.settings = {}; emit();
      toast('All your MyExpense data was deleted.');
      onClose();
    } catch (e) { if (writeFailed(e)) toast('Couldn’t delete everything. Try again.'); }
    setWiping(false);
  }
  return html`<div class="scrim" onClick=${e => { if (e.target === e.currentTarget) onClose(); }}>
    <form class="sheet" role="dialog" aria-label="Your details" onSubmit=${e => { e.preventDefault(); Model.saveSettings({ ...Model.settings, name: name.trim(), manager: mgr.trim() }); toast('Saved. New reports start with these details.'); onClose(); }}>
      <div class="sheet-h"><h2>Your details</h2><button type="button" class="icon-btn" onClick=${onClose} aria-label="Close"><${Icon} n="x" /></button></div>
      <p class="muted small">New reports start with these. You can still change them on any report.</p>
      <${Field} id="set-name" label="Your full name"><${TextInput} id="set-name" value=${name} autocomplete="name" placeholder="First and last name" onValue=${setName} /><//>
      <${Field} id="set-mgr" label="Manager name (itemized reports)"><${TextInput} id="set-mgr" value=${mgr} placeholder="Manager" onValue=${setMgr} /><//>
      <button class="btn primary" type="submit">Save details</button>
      <div class="terms" style="display:grid;gap:4px">
        <b style="font-family:var(--f-body)">Your privacy</b>
        ${PUI.privacy(aiOn()).map(t => html`<span class="muted">${t}</span>`)}
      </div>
      <button type="button" class="btn ghost danger" disabled=${wiping} onClick=${wipe}><${Icon} n="trash" size=${18} />${wiping ? 'Deleting…' : 'Delete all my data'}</button>
    </form>
  </div>`;
}
function ConfirmDialog() {
  const s = confirmState; if (!s) return null;
  const done = (v) => { confirmState = null; emit(); s.res(v); };
  return html`<div class="scrim" onClick=${e => { if (e.target === e.currentTarget) done(false); }}>
    <div class="sheet" role="alertdialog" aria-label=${s.title}>
      <h2>${s.title}</h2>${s.body && html`<p class="muted">${s.body}</p>`}
      <div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap">
        <button class="btn" onClick=${() => done(false)}>Cancel</button>
        <button class=${'btn primary'} style=${s.danger ? 'background:var(--bad);border-color:var(--bad);color:#fff' : ''} onClick=${() => done(true)}>${s.yes || 'OK'}</button>
      </div>
    </div>
  </div>`;
}

function Editor({ id, back }) {
  const r = Model.get(id);
  const [exp, setExp] = useState(false);
  if (!r) return html`<div class="wrap"><div class="empty">This report was deleted.<button class="btn" onClick=${back}>Back to reports</button></div></div>`;
  const isPd = r.type === 'perdiem';
  const st = reportStatus(r);
  async function del() {
    const ok = await askConfirm({ title: 'Delete this report?', body: (r.customer || 'This report') + (isPd ? '' : ' and its receipt photos') + ' will be deleted for good.', yes: 'Delete report', danger: true });
    if (ok) { await Model.remove(r.id); back(true); }
  }
  return html`
    <header class="bar"><${EnvBand} /><div class="bar-in">
      <button class="icon-btn" onClick=${() => back()} aria-label="Back to reports"><${Icon} n="back" /></button>
      <div class="bar-title">
        <h1>${r.customer || (isPd ? 'New per diem report' : 'New itemized report')}</h1>
        <div class="sub"><span class=${'tag ' + (isPd ? 'pd' : 'it')} style="height:18px;font-size:10px">${isPd ? 'Per diem' : 'Itemized'}</span><${SaveState} /></div>
      </div>
      <button class="icon-btn" onClick=${del} aria-label="Delete report" title="Delete report"><${Icon} n="trash" /></button>
    </div></header>
    ${isPd ? html`<${PerDiemEditor} r=${r} />` : html`<${ItemizedEditor} r=${r} />`}
    <div class="dock"><div class="dock-in">
      <div class="t"><b>${isPd ? usd(st.total) : cad(st.total)}</b><span>${st.problems.length ? st.problems[0].msg : (isPd ? 'Total per diem (USD)' : 'Total claimed (CAD)') + (st.range ? ' · ' + st.range : '')}</span></div>
      <button class="btn primary" onClick=${() => setExp(true)}><${Icon} n="download" />Download</button>
    </div></div>
    ${exp && html`<${ExportSheet} r=${r} onClose=${() => setExp(false)} />`}`;
}

// The platform's own screens (sign-in, account), built with the same toolkit as the rest of the app
const PUI = PLAT.ui({ html, useState, useEffect, useRef, Icon, toast, askConfirm, Field, TextInput, Svc, ENV, emit, lostAccess, plural, initServices });
const WORDS = { pill: 'Private to you: only you can see these reports', pillIcon: 'lock', saved: 'Saved', empty: 'Start a per diem or itemized report above. Reports save as you type, and only you can see them.', ...(PUI.words || {}) };

function App() {
  useTick();
  const [route, setRoute] = useState({ view: 'home' });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const loadedOnce = useRef(false);
  useEffect(() => { initServices(); }, []);
  useEffect(() => { if (Svc.access === 'ok' && !loadedOnce.current) { loadedOnce.current = true; loadAll(); } });
  useEffect(() => { if (Svc.access !== 'ok' && Svc.ready) { loadedOnce.current = false; if (route.view !== 'home') setRoute({ view: 'home' }); setSettingsOpen(false); } });
  function open(r, isNew) {
    if (isNew) Model.add(r);
    setRoute({ view: 'edit', id: r.id }); window.scrollTo(0, 0);
  }
  async function back(deleted) {
    const id = route.id;
    if (!deleted && id) {
      const r = Model.get(id);
      if (r && isBlank(r)) await Model.remove(id); else await flush(id);
      if (Svc.store && Model.settings.name && r && r.name && !(await Svc.store.getSettings().catch(() => ({}))).name) Model.saveSettings({ ...Model.settings });
    }
    Model.reports = Model.reports.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    setSave('idle'); setRoute({ view: 'home' }); window.scrollTo(0, 0);
  }
  return html`
    ${(route.view === 'home' || Svc.access !== 'ok') && html`<header class="bar"><${EnvBand} /><div class="bar-in"><div class="wordmark"><span class="stub" aria-hidden="true"></span>MyExpense${ENV.name !== 'prod' && html`<span class="envtag">${ENV.name.toUpperCase()}</span>`}</div>${PUI.HeaderRight && html`<${PUI.HeaderRight} />`}</div></header>`}
    ${Svc.access !== 'ok' ? html`<${PUI.Gate} />`
      : route.view === 'home' ? html`<${Home} open=${open} openSettings=${() => setSettingsOpen(true)} />` : html`<${Editor} key=${route.id} id=${route.id} back=${back} />`}
    ${settingsOpen && Svc.access === 'ok' && html`<${SettingsSheet} onClose=${() => setSettingsOpen(false)} />`}
    <${ConfirmDialog} />
    <div class="toasts" aria-live="polite">${toastList.map(t => html`<div class="toast" key=${t.id}>${t.msg}</div>`)}</div>`;
}

render(html`<${App} />`, document.getElementById('app'));
})();
