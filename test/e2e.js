// Headless-browser run-through of dist/MyExpense.html.
// CDN scripts are served from node_modules, so it runs offline.
// Run: npm run build && npm run test:e2e   (needs the `playwright` package and a Chromium)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');
const JSZip = require('jszip');

const ROOT = path.join(__dirname, '..');
const FIX = path.join(__dirname, 'fixtures');
const OUT = path.join(__dirname, 'e2e-out');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const NM = path.join(ROOT, 'node_modules');
const LIBS = {
  'https://cdn.jsdelivr.net/npm/htm@3.1.1/preact/standalone.umd.js': 'htm/preact/standalone.umd.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js': 'jszip/dist/jszip.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js': 'jspdf/dist/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js': 'pdfjs-dist/build/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js': 'pdfjs-dist/build/pdf.worker.min.js',
};
const PAGES = { prod: fs.readFileSync(path.join(ROOT, 'dist', 'prod', 'index.html'), 'utf8'), qa: fs.readFileSync(path.join(ROOT, 'dist', 'qa', 'index.html'), 'utf8') };
const server = http.createServer((req, res) => { res.writeHead(200, { 'content-type': 'text/html' }); res.end(req.url.startsWith('/qa') ? PAGES.qa : PAGES.prod); });

// Stand-ins for the claude.ai runtime: private db, user, receipt reading, downloads.
const MOCK = `
(() => {
  const store = new Map();
  const snap = (p) => ({ id: p.split('/').pop(), exists: store.has(p), data: () => store.has(p) ? JSON.parse(JSON.stringify(store.get(p))) : undefined, metadata: {} });
  const docRef = (p) => ({ id: p.split('/').pop(), path: p, get: async () => snap(p),
    set: async (d) => { if (JSON.stringify(d).length > 256 * 1024) throw { code: 'invalid_argument', message: 'too big' }; store.set(p, JSON.parse(JSON.stringify(d))); },
    update: async (d) => { store.set(p, { ...store.get(p), ...d }); }, delete: async () => { store.delete(p); }, collection: (c) => colRef(p + '/' + c) });
  const colRef = (p) => ({ path: p, doc: (id) => docRef(p + '/' + id),
    get: async () => { const docs = [...store.keys()].filter(k => k.startsWith(p + '/') && k.slice(p.length + 1).indexOf('/') < 0).sort().map(snap); return { docs, size: docs.length, empty: !docs.length }; } });
  window.__mockStore = store;
  window.__downloads = [];
  let n = 0;
  const sample = Object.assign(async () => ({ text: '' }), {
    limits: async () => ({ maxInputBytes: 1e6, images: { maxCount: 5, maxInputBytes: 5e6, mediaTypes: ['image/jpeg', 'image/png'] } }),
    json: async (prompt, opts) => {
      window.__aiCalls = (window.__aiCalls || 0) + 1;
      if (!opts.images || !opts.images.length) throw { code: 'invalid_argument' };
      await new Promise(r => setTimeout(r, 250));
      n++;
      if (n === 1) return { kind: 'receipt', transactions: [{ date: '2026-04-29', vendor: 'Uber', category: 'taxi', amount: 26.85, currency: 'USD', cad: null, payment: 'Visa 4412' }] };
      return { kind: 'statement', transactions: [
        { date: '2026-04-30', vendor: 'Air Canada', category: 'airfare', amount: 63.25, currency: 'CAD' },
        { date: '2026-05-01', vendor: 'Impark', category: 'parking', amount: 29.31, currency: 'CAD' }] };
    } });
  const caps = {
    db: { doc: docRef, collection: colRef },
    user: { id: async () => 'u_test1', can: async () => true, isOwner: async () => true },
    sample,
    downloads: { save: async ({ filename, data }) => { const b = new Uint8Array(await data.arrayBuffer()); let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); window.__downloads.push({ filename, b64: btoa(s) }); return { status: 'saved' }; } },
  };
  window.claude = { use: (name) => new Promise(r => setTimeout(() => r(caps[name] || null), 50)) };
})();`;

let failures = 0;
const check = (ok, msg) => { console.log((ok ? '  ok   ' : '  FAIL ') + msg); if (!ok) failures++; };

async function setup(browser, opts) {
  const ctx = await browser.newContext({ acceptDownloads: true, viewport: opts.viewport || { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: !!opts.touch, isMobile: !!opts.touch, colorScheme: opts.dark ? 'dark' : 'light' });
  await ctx.route('**/*', (route) => {
    const u = route.request().url();
    if (LIBS[u]) return route.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(path.join(NM, LIBS[u])) });
    if (u.startsWith('http://127.0.0.1')) return route.continue();
    return route.fulfill({ status: 404, body: '' }); // web fonts are unavailable offline
  });
  if (opts.mock) await ctx.addInitScript(MOCK);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); });
  await page.goto('http://127.0.0.1:' + server.address().port + (opts.qa ? '/qa' : '/'));
  return { ctx, page, errors };
}
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png'), fullPage: true });
async function download(page, text) {
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click(text)]);
  const file = path.join(OUT, 'A-' + dl.suggestedFilename());
  await dl.saveAs(file);
  return file;
}
async function editOpenCharge(page, f) {
  const id = await page.$eval('.charge-edit input[type=date]', e => e.id);
  const base = '#' + id.replace(/-date$/, '');
  if (f.date) { await page.fill(base + '-date', f.date); await page.dispatchEvent(base + '-date', 'change'); }
  if (f.cat) await page.selectOption(base + '-cat', f.cat);
  if (f.vendor) await page.fill(base + '-vendor', f.vendor);
  if (f.amt) await page.fill(base + '-amt', f.amt);
  if (f.cur) await page.selectOption(base + '-cur', f.cur);
  if (f.cad) await page.fill(base + '-cad', f.cad);
}

(async () => {
  await new Promise(r => server.listen(0, r));
  const browser = await chromium.launch();

  console.log('A: standalone (no Claude): device storage, browser downloads');
  {
    const { ctx, page, errors } = await setup(browser, { touch: true });
    await page.waitForSelector('text=New per diem report');
    check(await page.title() === 'MyExpense', 'page title is MyExpense');
    check(!(await page.innerText('body')).includes('Evertz'), 'no "Evertz" in the app UI');
    await shot(page, 'A1-home');
    await page.click('text=New per diem report');
    await page.fill('#pd-name', 'Alex Morgan');
    await page.fill('#pd-cust', 'NBC Universal');
    await page.fill('#pd-start', '2026-06-15'); await page.dispatchEvent('#pd-start', 'change');
    await page.fill('#pd-end', '2026-07-10'); await page.dispatchEvent('#pd-end', 'change');
    await page.waitForSelector('.week');
    await page.click('[aria-label^="Mon, Jun 15"]');
    await page.click('[aria-label^="Fri, Jul 10"]');
    await page.waitForTimeout(800);
    await shot(page, 'A2-perdiem');
    await page.click('.dock >> text=Download');
    await page.waitForSelector('text=Excel workbook');
    check((await page.innerText('.sheet')).includes('Partial days: Mon, Jun 15, Fri, Jul 10'), 'export sheet lists the partial days');
    await shot(page, 'A3-perdiem-export');
    const x1 = await download(page, 'text=Excel workbook');
    const p1 = await download(page, 'text=Print-ready PDF');
    check(path.basename(x1) === 'A-NBC Universal PD Expenses Jun 15-Jul 10 2026.xlsx', 'per diem xlsx name');
    check(path.basename(p1) === 'A-NBC Universal PD Expenses Jun 15-Jul 10 2026.pdf', 'per diem pdf name');
    await page.click('[aria-label="Close"]');
    await page.click('[aria-label="Back to reports"]');
    await page.waitForSelector('.rcard');

    await page.click('text=New itemized report');
    await page.fill('#it-name', 'Alex Morgan');
    await page.fill('#it-cust', 'WBD LA');
    await page.setInputFiles('#it-up', [path.join(FIX, 'sample.jpg'), path.join(FIX, 'rental.pdf'), path.join(FIX, 'receipts.docx')]);
    await page.waitForFunction(() => document.querySelectorAll('.charge .thumb img').length >= 4, null, { timeout: 30000 });
    check(true, 'photo, PDF and Word file (2 pictures) became 4 charges with receipts');
    await page.waitForTimeout(400);
    await shot(page, 'A4-itemized-photos');
    await page.click('.charge-row >> nth=0');
    await editOpenCharge(page, { date: '2026-04-29', cat: 'taxi', vendor: 'Uber', amt: '26.85', cur: 'USD', cad: '36.93' });
    await page.click('.charge-edit >> text=Done');
    await page.click('.charge-row >> nth=0');
    await editOpenCharge(page, { date: '2026-05-10', cat: 'rental', vendor: 'Enterprise', amt: '1056.44' });
    await page.click('.charge-edit >> text=Done');
    await page.click('.charge-row >> nth=0');
    await editOpenCharge(page, { date: '2026-04-30', cat: 'airfare', vendor: 'Air Canada', amt: '63.25' });
    await page.click('.charge-edit >> text=Done');
    await page.click('.charge-row >> nth=0');
    await editOpenCharge(page, { date: '2026-05-01', cat: 'parking', vendor: 'Impark', amt: '29.31' });
    await page.check('.charge-edit .check input');
    await page.click('.charge-edit >> text=Done');
    await page.waitForTimeout(800);
    // one receipt on its own
    await page.click('.charge-row >> nth=0');
    await page.click('.charge-edit .photo .big');
    await page.waitForSelector('text=Download photo');
    const one = await download(page, 'text=Download photo');
    check(/A-2026-04-29 Taxi - Uber\.jpg$/.test(one), 'single receipt download: ' + path.basename(one));
    await page.click('.viewer [aria-label="Close"]');
    await shot(page, 'A5-itemized-filled');
    await page.click('.dock >> text=Download');
    await page.waitForSelector('text=Receipt files');
    await page.click('text=Charges by day');
    await shot(page, 'A6-itemized-export');
    const sheetText = await page.innerText('.sheet');
    check(sheetText.includes('Included with your OK: Parking') && sheetText.includes('HST columns left blank'), 'export sheet notes the decisions');
    const x2 = await download(page, 'text=Excel workbook');
    const p2 = await download(page, 'text=Print-ready PDF');
    const rp = await download(page, 'text=Receipts PDF');
    const rz = await download(page, 'text=Receipt files');
    check(path.basename(rz) === 'A-WBD LA Itemized Expenses Apr 29-May 10 2026 Receipts.zip', 'receipts zip name');
    const names = Object.keys((await JSZip.loadAsync(fs.readFileSync(rz))).files);
    console.log('       zip contents:', names);
    check(names.length === 4 && names.some(n => /Auto Rental - Enterprise - CA\$1056\.44\.pdf$/.test(n)), 'zip holds 4 receipts and keeps the rental PDF as a PDF');
    void x2; void p2; void rp;
    await page.click('[aria-label="Close"]');
    await page.click('[aria-label="Back to reports"]');
    await page.reload();
    await page.waitForSelector('.rcard');
    check((await page.$$eval('.rcard .cust', els => els.map(e => e.textContent))).join() === 'WBD LA,NBC Universal', 'reports survive a reload');
    await shot(page, 'A7-home-list');
    check(errors.length === 0, 'no page errors ' + JSON.stringify(errors));
    await ctx.close();
  }

  console.log('B: inside Claude (stand-in runtime): account storage, receipt reading, save prompts');
  {
    const { ctx, page, errors } = await setup(browser, { touch: true, mock: true, dark: true });
    await page.waitForSelector('text=Saved to your Claude account');
    await page.click('text=New itemized report');
    await page.fill('#it-name', 'Alex Morgan');
    await page.fill('#it-cust', 'WBD LA');
    await page.setInputFiles('#it-cam', path.join(FIX, 'sample.jpg'));
    await page.waitForSelector('text=Reading receipt');
    await page.waitForFunction(() => !document.body.innerText.includes('Reading receipt'), null, { timeout: 15000 });
    await page.setInputFiles('#it-up', path.join(FIX, 'rental.pdf'));
    await page.waitForFunction(() => (window.__aiCalls || 0) >= 2 && !document.body.innerText.includes('Reading receipt'), null, { timeout: 20000 });
    await page.waitForTimeout(800);
    const rows = await page.$$eval('.charge-row', els => els.map(e => e.innerText.replace(/\s+/g, ' ').trim()));
    console.log('       charges:', rows);
    check(rows.length === 3 && rows[0].includes('Visa 4412'), 'Claude-read charges land on their days, statement split into 2, payment shown');
    await page.click('.charge-row >> nth=0');
    await editOpenCharge(page, { cad: '36.93' });
    await page.click('text=Details are correct');
    await page.waitForTimeout(700);
    await shot(page, 'B1-after-ai');
    await page.click('.dock >> text=Download');
    await page.waitForSelector('text=Receipt files');
    await shot(page, 'B2-export');
    for (const t of ['text=Excel workbook', 'text=Print-ready PDF', 'text=Receipts PDF', 'text=Receipt files']) {
      const before = await page.evaluate(() => window.__downloads.length);
      await page.click(t);
      await page.waitForFunction((b) => window.__downloads.length > b, before);
    }
    const dls = await page.evaluate(() => window.__downloads);
    for (const d of dls) fs.writeFileSync(path.join(OUT, 'B-' + d.filename), Buffer.from(d.b64, 'base64'));
    console.log('       saved:', dls.map(d => d.filename));
    check(dls.length === 4, 'all four files go through the save prompt');
    const keys = await page.evaluate(() => [...window.__mockStore.keys()]);
    check(keys.some(k => /\/reports\//.test(k)) && keys.some(k => /\.o\.0$/.test(k)), 'report and the original PDF are kept in the private store');
    check(errors.length === 0, 'no page errors ' + JSON.stringify(errors));
    await ctx.close();
  }

  console.log('C: desktop');
  {
    const { ctx, page, errors } = await setup(browser, { viewport: { width: 1280, height: 900 } });
    await page.waitForSelector('text=New itemized report');
    await page.click('text=New per diem report');
    await page.fill('#pd-name', 'Alex Morgan'); await page.fill('#pd-cust', 'Acme Broadcasting');
    await page.fill('#pd-start', '2026-01-19'); await page.dispatchEvent('#pd-start', 'change');
    await page.fill('#pd-end', '2026-01-24'); await page.dispatchEvent('#pd-end', 'change');
    await page.waitForSelector('.week');
    await shot(page, 'C1-desktop');
    check(errors.length === 0, 'no page errors ' + JSON.stringify(errors));
    await ctx.close();
  }
  console.log('D: QA build');
  {
    const { ctx, page, errors } = await setup(browser, { qa: true });
    await page.waitForSelector('text=New per diem report');
    check(await page.title() === 'MyExpense QA', 'QA page title');
    check(await page.isVisible('.envband'), 'QA band is shown');
    await page.click('text=New per diem report');
    await page.fill('#pd-cust', 'QA only trip');
    await page.waitForTimeout(800);
    await page.click('[aria-label="Back to reports"]');
    await page.waitForSelector('.rcard');
    await page.goto('http://127.0.0.1:' + server.address().port + '/');
    await page.waitForSelector('text=New per diem report');
    await page.waitForTimeout(500);
    check(!(await page.innerText('body')).includes('QA only trip') && !(await page.isVisible('.envband')), 'prod build on the same site does not see QA data or the band');
    check(errors.length === 0, 'no page errors ' + JSON.stringify(errors));
    await ctx.close();
  }
  await browser.close();
  server.close();
  console.log(failures ? 'FAIL (' + failures + ')' : 'PASS');
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
