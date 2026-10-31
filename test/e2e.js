// Headless-browser run-through of the built app, with several people using it at once.
//
// A stand-in for the claude.ai runtime runs on the Node side, with the signed-in person bound to
// each browser context, so a page can't pretend to be someone else. It enforces the same
// privacy rules the app declares: each person's own data/users/<id>/ area for people allowed to
// use the app, and nothing else for anyone but the owner.
// Library files are served from node_modules (the exact bytes the integrity hashes were made from).
//
// Run: npm run build && npm run test:e2e   (needs the `playwright` package and a Chromium)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const ROOT = path.join(__dirname, '..');
const FIX = path.join(__dirname, 'fixtures');
const OUT = path.join(__dirname, 'e2e-out');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const NM = path.join(ROOT, 'node_modules');
// every library URL the app references, served from the locked node_modules copy
const LIBS = {};
for (const f of [path.join(ROOT, 'src', 'shell-claude.html'), path.join(ROOT, 'src', 'vendor.json')]) {
  const html = fs.readFileSync(f, 'utf8');
  for (const m of html.matchAll(/https:\/\/cdn\.jsdelivr\.net\/npm\/((?:@[^/]+\/)?[^@/]+)@[^/]+\/([^"'\s]+)/g)) LIBS[m[0]] = path.join(m[1], m[2]);
}
const envs = JSON.parse(fs.readFileSync(path.join(ROOT, 'environments.json'), 'utf8'));
const pageFor = (env) => {
  const file = env === 'preview' ? 'MyExpense-Preview.html' : envs[env].title.replace(/\s+/g, '-') + '.html';
  const body = fs.readFileSync(path.join(ROOT, 'dist', env, file), 'utf8');
  // the Artifact wraps the page in this skeleton
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>';
};

/* ---------- stand-in server: one database per environment, rules enforced here ---------- */
const RANK = { view: 0, interact: 1, admin: 2, owner: 3 };
const servers = { prod: new Map(), qa: new Map(), preview: new Map() };
function allowed(who, p) {
  const seg = p.split('/');
  if (seg[0] === 'data' && seg[1] === 'users' && seg.length >= 4) return seg[2] === who.id && RANK[who.level] >= RANK.interact; // data/users/{self}
  return who.level === 'owner'; // everything else: owner only
}
function serverOp(store, who, op, p, data, opts) {
  if (!who) return { error: { code: 'not_granted' } };
  const deny = { error: { code: 'invalid_argument', message: 'not allowed' } };
  if (op === 'get') return allowed(who, p) && store.has(p) ? { exists: true, data: store.get(p) } : { exists: false };
  if (op === 'set') { if (!allowed(who, p)) return deny; if (JSON.stringify(data).length > 256 * 1024) return deny; store.set(p, JSON.parse(JSON.stringify(data))); return {}; }
  if (op === 'delete') { if (!allowed(who, p)) return deny; store.delete(p); return {}; }
  if (op === 'list') {
    const docs = [...store.keys()].filter(k => k.startsWith(p + '/') && !k.slice(p.length + 1).includes('/') && allowed(who, k)).sort()
      .slice(0, (opts && opts.limit) || 1e9).map(k => ({ id: k.split('/').pop(), data: store.get(k) }));
    return { docs };
  }
  return { error: { code: 'invalid_argument' } };
}
const RUNTIME = `
(() => {
  const who = window.__who; // set per context by the test; the server keeps its own copy
  if (!who) return;          // outside Claude: no runtime at all
  const call = async (op, p, d, o) => { const r = await window.__db(op, p, d || null, o || null); if (r && r.error) throw r.error; return r; };
  const snap = (id, r) => ({ id, exists: !!r.exists, data: () => r.data, metadata: {} });
  const docRef = (p) => ({ id: p.split('/').pop(), path: p, get: async () => snap(p.split('/').pop(), await call('get', p)),
    set: (d) => call('set', p, d), update: (d) => call('set', p, d), delete: () => call('delete', p), collection: (c) => colRef(p + '/' + c) });
  const list = async (p, limit) => { const r = await call('list', p, null, { limit }); const docs = r.docs.map(d => ({ id: d.id, exists: true, data: () => d.data, metadata: {} })); return { docs, size: docs.length, empty: !docs.length }; };
  const colRef = (p) => ({ path: p, doc: (id) => docRef(p + '/' + id), get: () => list(p), limit: (n) => ({ get: () => list(p, n) }) });
  window.__downloads = [];
  let n = 0;
  const R = who.R || [
    { kind: 'receipt', transactions: [{ date: '2026-04-29', vendor: 'Uber', category: 'taxi', amount: 26.85, currency: 'USD', cad: null, payment: 'Visa 4412' }] },
    { kind: 'receipt', transactions: [{ date: '2026-05-10', vendor: 'Budget', category: 'rental', amount: 980.25, currency: 'CAD', payment: 'Visa 4412' }] },
  ];
  // A statement page: what Claude returns for the statement prompt
  const STMT = { kind: 'statement', card: 'Visa 4412', rows: [
    { date: '2026-04-29', description: 'UBER *TRIP HELP.UBER.COM', amount: 36.93, currency: 'CAD', credit: false, foreign: { amount: 26.85, currency: 'USD' }, category: 'taxi', marked: true },
    { date: '2026-04-30', description: 'STARBUCKS 0412', amount: 6.45, currency: 'CAD', credit: false, foreign: null, category: 'meal', marked: false },
    { date: '2026-05-10', description: 'BUDGET RENT-A-CAR LAX', amount: 980.25, currency: 'CAD', credit: false, foreign: null, category: 'rental', marked: true },
    { date: '2026-05-02', description: 'PAYMENT - THANK YOU', amount: 500, currency: 'CAD', credit: true, foreign: null, category: 'other', marked: false },
  ] };
  const sample = Object.assign(async () => ({ text: '' }), {
    limits: async () => ({ maxInputBytes: 1e6, images: { maxCount: 5, maxInputBytes: 5e6, mediaTypes: ['image/jpeg', 'image/png'] } }),
    json: async (prompt, opts) => { if (!opts.images || !opts.images.length) throw { code: 'invalid_argument' }; await new Promise(r => setTimeout(r, 200)); if (/one page .* of a bank or credit card statement/.test(prompt)) return STMT; return R[Math.min(n++, R.length - 1)]; } });
  const caps = who.signedIn ? {
    db: { doc: docRef, collection: colRef },
    user: { id: async () => who.id, can: async () => null, isOwner: async () => who.level === 'owner' },
    sample,
    downloads: { save: async ({ filename, data }) => { const b = new Uint8Array(await data.arrayBuffer()); let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); window.__downloads.push({ filename, b64: btoa(s) }); return { status: 'saved' }; } },
  } : {};
  window.claude = { use: (name) => new Promise(r => setTimeout(() => r(caps[name] || null), 30)) };
})();`;

let failures = 0;
const check = (ok, msg) => { console.log((ok ? '  ok   ' : '  FAIL ') + msg); if (!ok) failures++; };

async function open(browser, { env = 'prod', who = null, dark = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, colorScheme: dark ? 'dark' : 'light' });
  await ctx.route('**/*', (route) => {
    const u = route.request().url();
    if (LIBS[u]) return route.fulfill({ status: 200, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(path.join(NM, LIBS[u])) });
    if (u === 'https://myexpense.test/') return route.fulfill({ status: 200, contentType: 'text/html', body: pageFor(env) });
    return route.fulfill({ status: 404, body: '' }); // web fonts are unavailable offline
  });
  const store = servers[env] || new Map();
  await ctx.exposeFunction('__db', (op, p, d, o) => serverOp(store, who && who.signedIn ? who : null, op, p, d, o));
  if (who) await ctx.addInitScript('window.__who = ' + JSON.stringify(who) + ';\n' + RUNTIME);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); });
  await page.goto('https://myexpense.test/');
  return { ctx, page, errors };
}
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png'), fullPage: true });
const keysOf = (env, prefix) => [...servers[env].keys()].filter(k => !prefix || k.startsWith(prefix));
async function onDevice(page) {
  return page.evaluate(async () => ({ idb: (await indexedDB.databases()).map(d => d.name), ls: localStorage.length, ss: sessionStorage.length }));
}
async function editOpenCharge(page, f) {
  const id = await page.$eval('.charge-edit input[type=date]', e => e.id);
  const base = '#' + id.replace(/-date$/, '');
  if (f.date) { await page.fill(base + '-date', f.date); await page.dispatchEvent(base + '-date', 'change'); }
  if (f.cat) await page.selectOption(base + '-cat', f.cat);
  if (f.vendor) await page.fill(base + '-vendor', f.vendor);
  if (f.amt) await page.fill(base + '-amt', f.amt);
  if (f.cad) await page.fill(base + '-cad', f.cad);
}
async function newPerDiem(page, name, customer) {
  await page.click('text=New per diem report');
  await page.fill('#pd-name', name);
  await page.fill('#pd-cust', customer);
  await page.fill('#pd-start', '2026-06-15'); await page.dispatchEvent('#pd-start', 'change');
  await page.fill('#pd-end', '2026-07-10'); await page.dispatchEvent('#pd-end', 'change');
  await page.waitForSelector('.week');
}
const ALEX = { id: 'u_alex', level: 'interact', signedIn: true };
const JAMIE = { id: 'u_jamie', level: 'interact', signedIn: true };
const VIEWER = { id: 'u_viewer', level: 'view', signedIn: true };
const SIGNED_OUT = { id: null, level: 'view', signedIn: false };

(async () => {
  const browser = await chromium.launch();

  console.log('A: opened outside Claude');
  {
    const { ctx, page, errors } = await open(browser);
    await page.waitForSelector('text=Open MyExpense from its Claude link');
    check(!(await page.isVisible('text=New per diem report')), 'no way to create a report without signing in');
    const dev = await onDevice(page);
    check(dev.idb.length === 0 && dev.ls === 0 && dev.ss === 0, 'nothing stored on the device ' + JSON.stringify(dev));
    const scripts = await page.$$eval('script[src]', els => els.map(e => ({ src: e.src, sri: e.integrity, co: e.crossOrigin })));
    check(scripts.length === 3 && scripts.every(s => /^sha384-/.test(s.sri) && s.co === 'anonymous'), 'every library script is integrity-checked');
    await shot(page, 'A-outside');
    check(errors.length === 0, 'no page errors ' + JSON.stringify(errors));
    await ctx.close();
  }

  console.log('B: signed out of Claude');
  {
    const { ctx, page, errors } = await open(browser, { who: SIGNED_OUT });
    await page.waitForSelector('text=Sign in to use MyExpense');
    check(!(await page.isVisible('text=New itemized report')), 'signed-out visitors get the sign-in screen only');
    check(errors.length === 0, 'no page errors ' + JSON.stringify(errors));
    await ctx.close();
  }

  console.log('C: Alex uses the app');
  {
    const { ctx, page, errors } = await open(browser, { who: ALEX });
    await page.waitForSelector('text=Private to you');
    await newPerDiem(page, 'Alex Morgan', 'Alex trip to Northwind');
    await page.click('[aria-label^="Mon, Jun 15"]');
    await page.waitForTimeout(900);
    await page.click('[aria-label="Back to reports"]');
    await page.waitForSelector('.rcard');
    await page.click('text=New itemized report');
    await page.fill('#it-name', 'Alex Morgan');
    await page.fill('#it-cust', 'Alex itemized Contoso');
    const mgr = await page.$eval('#it-mgr', el => ({ value: el.value, placeholder: el.placeholder }));
    check(mgr.value === '' && mgr.placeholder === 'Manager’s first and last name', 'a new report’s manager name starts empty, with a placeholder: ' + JSON.stringify(mgr));
    await page.setInputFiles('#it-cam', path.join(FIX, 'uber.jpg'));
    await page.waitForTimeout(100);
    await page.setInputFiles('#it-up', path.join(FIX, 'rental.pdf')); // loads pdf.js through its integrity check
    await page.waitForFunction(() => document.querySelectorAll('.charge-row').length >= 2 && !/Reading receipt|Adding photo/.test(document.body.innerText), null, { timeout: 30000 });
    await page.setInputFiles('#it-up', { name: 'huge.jpg', mimeType: 'image/jpeg', buffer: Buffer.alloc(26 * 1024 * 1024) });
    await page.waitForSelector('text=is over 25 MB');
    check(true, 'files over 25 MB are refused');
    await page.click('.charge-row >> nth=0');
    await editOpenCharge(page, { cad: '36.93' });
    await page.click('text=Details are correct');
    await page.click('.charge-row >> nth=1');
    await page.click('text=Details are correct');
    await page.waitForTimeout(900);
    await shot(page, 'C-alex-itemized');
    await page.click('.dock >> text=Download');
    await page.waitForSelector('text=Receipt files');
    check(await page.isVisible('text=No manager name yet'), 'downloading without a manager name gives a reminder');
    for (const t of ['text=Excel workbook', 'text=Print-ready PDF', 'text=Receipts PDF', 'text=Receipt files']) {
      const b = await page.evaluate(() => window.__downloads.length);
      await page.click(t);
      await page.waitForFunction((x) => window.__downloads.length > x, b);
    }
    const dls = await page.evaluate(() => window.__downloads);
    for (const d of dls) fs.writeFileSync(path.join(OUT, 'C-' + d.filename), Buffer.from(d.b64, 'base64'));
    check(dls.length === 4, 'downloads: ' + dls.map(d => d.filename).join(' | '));
    const zipNames = Object.keys((await JSZip.loadAsync(Buffer.from(dls[3].b64, 'base64'))).files);
    check(zipNames.length === 2 && zipNames.some(n => n.endsWith('.pdf')), 'receipt zip: ' + zipNames.join(', '));
    await page.click('[aria-label="Close"]');
    await page.click('[aria-label="Back to reports"]');
    await page.reload();
    await page.waitForSelector('.rcard');
    const mine = await page.$$eval('.rcard .cust', els => els.map(e => e.textContent).sort());
    check(mine.join() === 'Alex itemized Contoso,Alex trip to Northwind', 'Alex’s reports come back after a reload');
    const dev = await onDevice(page);
    check(dev.idb.length === 0 && dev.ls === 0, 'still nothing stored on the device ' + JSON.stringify(dev));
    const outside = keysOf('prod').filter(k => !k.startsWith('data/users/u_alex/'));
    check(outside.length === 0, 'everything Alex saved is inside Alex’s own area (' + keysOf('prod').length + ' docs)');
    await shot(page, 'C-alex-home');
    check(errors.length === 0, 'no page errors ' + JSON.stringify(errors));
    await ctx.close();
  }

  console.log('D: Jamie uses the app at the same time');
  {
    const alex = await open(browser, { who: ALEX });
    const jamie = await open(browser, { who: JAMIE });
    await jamie.page.waitForSelector('text=No reports yet');
    check(!(await jamie.page.innerText('body')).includes('Alex'), 'Jamie sees none of Alex’s reports');
    // Jamie tries to reach Alex's data directly, bypassing the app
    const probe = await jamie.page.evaluate(async () => {
      const db = await window.claude.use('db');
      const out = {};
      out.readReports = (await db.collection('data/users/u_alex/app/reports').get()).size;
      out.readSettings = (await db.doc('data/users/u_alex/settings').get()).exists;
      try { await db.doc('data/users/u_alex/app/reports/x').set({ hacked: true }); out.write = 'allowed'; } catch (e) { out.write = e.code; }
      try { await db.doc('data/users/u_alex/app/reports/' + 'r').delete(); out.del = 'allowed'; } catch (e) { out.del = e.code; }
      try { await db.doc('shared/everyone').set({ x: 1 }); out.shared = 'allowed'; } catch (e) { out.shared = e.code; }
      return out;
    });
    check(probe.readReports === 0 && probe.readSettings === false, 'reading Alex’s data directly returns nothing ' + JSON.stringify(probe));
    check(probe.write === 'invalid_argument' && probe.del === 'invalid_argument', 'writing or deleting Alex’s data directly is refused');
    check(probe.shared === 'invalid_argument', 'nobody but the owner can write outside their own area');
    await newPerDiem(jamie.page, 'Jamie Chen', 'Jamie private trip');
    await jamie.page.waitForTimeout(900);
    await jamie.page.click('[aria-label="Back to reports"]');
    await jamie.page.waitForSelector('.rcard');
    await alex.page.reload();
    await alex.page.waitForSelector('.rcard');
    const alexSees = await alex.page.$$eval('.rcard .cust', els => els.map(e => e.textContent));
    check(!alexSees.some(t => t.includes('Jamie')) && alexSees.length === 2, 'Alex still sees only Alex’s two reports: ' + alexSees.join(', '));
    await shot(jamie.page, 'D-jamie-home');
    check(alex.errors.length + jamie.errors.length === 0, 'no page errors ' + JSON.stringify(alex.errors.concat(jamie.errors)));
    await alex.ctx.close(); await jamie.ctx.close();
  }

  console.log('E: someone who may only view the page');
  {
    const { ctx, page, errors } = await open(browser, { who: VIEWER });
    await page.waitForSelector('text=New per diem report');
    check(!(await page.innerText('body')).includes('Alex') && !(await page.innerText('body')).includes('Jamie'), 'a viewer sees nobody’s reports');
    await newPerDiem(page, 'Vic Viewer', 'Viewer attempt');
    await page.waitForSelector('text=You can’t save expenses here yet', { timeout: 10000 });
    check(true, 'their first save is refused and the access screen replaces the app');
    check(keysOf('prod', 'data/users/u_viewer').length === 0, 'nothing of theirs was stored');
    await shot(page, 'E-viewer-refused');
    check(errors.length === 0, 'no page errors ' + JSON.stringify(errors));
    await ctx.close();
  }

  console.log('F: QA is separate from production');
  {
    const { ctx, page, errors } = await open(browser, { env: 'qa', who: ALEX });
    await page.waitForSelector('text=No reports yet');
    check(await page.title() === 'MyExpense QA' && await page.isVisible('.envband'), 'QA title and band');
    check(!(await page.innerText('body')).includes('Alex trip'), 'Alex’s production reports are not in QA');
    check(errors.length === 0, 'no page errors ' + JSON.stringify(errors));
    await ctx.close();
  }

  console.log('G: Alex deletes all their data');
  {
    const before = keysOf('prod', 'data/users/u_alex/').length;
    const { ctx, page, errors } = await open(browser, { who: ALEX });
    await page.waitForSelector('.rcard');
    await page.click('text=Your details');
    await page.click('text=Delete all my data');
    await page.click('.sheet[role=alertdialog] >> text=Delete everything');
    await page.waitForSelector('text=All your MyExpense data was deleted.');
    const after = keysOf('prod', 'data/users/u_alex/').length;
    check(before > 0 && after === 0, 'Alex’s area went from ' + before + ' documents to ' + after);
    check(keysOf('prod', 'data/users/u_jamie/').length > 0, 'Jamie’s data is untouched');
    check(errors.length === 0, 'no page errors ' + JSON.stringify(errors));
    await ctx.close();
  }

  console.log('S: a bank statement on an itemized report');
  {
    const UBER = { kind: 'receipt', transactions: [{ date: '2026-04-29', vendor: 'Uber', category: 'taxi', amount: 26.85, currency: 'USD', cad: null, payment: 'Visa 4412' }] };
    const SAM = { id: 'u_sam', level: 'interact', signedIn: true, R: [
      UBER,
      { kind: 'statement', transactions: [{ date: '2026-04-29', vendor: 'Uber', category: 'taxi', amount: 36.93, currency: 'CAD' }] },
      UBER,
    ] };
    const { ctx, page, errors } = await open(browser, { who: SAM });
    const rowsText = () => page.$$eval('.charge-row', els => els.map(e => e.innerText.replace(/\s+/g, ' ')));
    await page.waitForSelector('text=New itemized report');
    await page.click('text=New itemized report');
    await page.fill('#it-name', 'Sam Lee');
    await page.fill('#it-cust', 'Fabrikam Burbank');
    await page.setInputFiles('#it-cam', path.join(FIX, 'uber.jpg'));
    await page.waitForFunction(() => document.querySelectorAll('.charge-row').length === 1 && !/Reading receipt|Adding photo/.test(document.body.innerText), null, { timeout: 30000 });
    await page.setInputFiles('#st-up', path.join(FIX, 'statement.png'));
    await page.waitForFunction(() => document.querySelectorAll('.stmt-row').length > 0 && !/Reading statement|Adding page/.test(document.body.innerText) && document.querySelectorAll('.charge-row').length === 2, null, { timeout: 30000 });
    const lines = await page.$$eval('.stmt-row', els => els.map(e => e.innerText.replace(/\s+/g, ' ')));
    check(lines.length === 2 && /UBER/.test(lines[0]) && /BUDGET/.test(lines[1]), 'the marked lines are on the report; the coffee and the payment aren’t: ' + JSON.stringify(lines));
    check(await page.isVisible('text=Show all 4 lines'), 'the other lines are a tap away');
    check(/On the report: Taxi \/ Uber/.test(lines[0]) && /Receipt/.test(lines[0]), 'the Uber line is paired with the Uber receipt by itself');
    let rows = await rowsText();
    check(/CA\$36\.93/.test(rows[0]) && /On statement/.test(rows[0]), 'the US-dollar receipt gets the CAD that posted, with no typing: ' + rows[0]);
    check(rows.some(t => /BUDGET RENT-A-CAR LAX/.test(t) && /980\.25/.test(t) && /No receipt/.test(t)), 'the rental on the statement, with no receipt, is still on the report: ' + JSON.stringify(rows));
    const sum = await page.innerText('.stmt-sum');
    check(/2 of 2 charges on the report are on your statement/.test(sum) && /Missing a receipt: May 10 BUDGET RENT-A-CAR LAX/.test(sum), 'and the missing receipt is pointed out: ' + sum);
    check(/Missing receipts/.test(await page.innerText('.panel:has(h2:text("Totals"))')), 'in the totals too');
    // the person attaches the rental receipt to that charge
    await page.setInputFiles('.stmt-row:has-text("BUDGET") input[type=file]', path.join(FIX, 'rental.pdf'));
    await page.waitForSelector('text=Receipt attached.');
    await page.waitForFunction(() => !/No receipt|Missing a receipt/.test(document.body.innerText));
    check(true, 'attaching the receipt clears the warning');
    await page.click('.charge-row >> text=BUDGET');
    await page.click('text=Details are correct');
    // a charge edited off the statement amount is flagged on both sides
    await page.click('.charge-row >> text=BUDGET');
    const amtId = await page.$eval('.charge-edit input[type=date]', e => e.id.replace(/-date$/, '-amt'));
    await page.fill('#' + amtId, '990.25'); await page.dispatchEvent('#' + amtId, 'blur');
    await page.waitForSelector('.charge-row >> text=Statement shows CA$980.25');
    await page.click('text=Use CA$980.25 from the statement');
    await page.waitForFunction(() => !/Statement shows/.test(document.body.innerText));
    check(true, 'an amount that doesn’t match the statement is flagged, and one tap fixes it');
    // a charge with no statement line is flagged
    await page.click('text=Add without receipt');
    await page.waitForTimeout(300);
    const manual = (await rowsText()).find(t => /Date needed|Taxi/.test(t) && /Not on statement/.test(t));
    check(!!manual && /No receipt/.test(manual), 'a charge that isn’t on the statement is flagged: ' + manual);
    await page.click('.charge-edit >> text=Delete');
    await page.click('.sheet[role=alertdialog] >> text=Delete charge');
    await page.waitForTimeout(900);
    const stored = [...servers.prod.entries()].filter(([k]) => k.startsWith('data/users/u_sam/app/reports/')).map(([, v]) => v);
    const st = stored[0] && stored[0].statements && stored[0].statements[0];
    const sc = stored[0] && stored[0].charges;
    check(st && st.rows.length === 4 && st.rows.filter(x => x.chargeId).length === 2 && sc.length === 2 && sc.find(c => c.vendor === 'Uber').cad === 36.93 && sc.every(c => c.imageId), 'the page, its lines, the pairings and both receipts are saved with the report');
    await shot(page, 'S-statement');
    await page.click('.dock >> text=Download');
    await page.waitForSelector('text=Bank statement PDF');
    check(await page.isVisible('text=Receipts · 2'), 'the statement isn’t one of the receipts');
    const grab = async (t) => {
      const before = await page.evaluate(() => window.__downloads.length);
      await page.click(t);
      await page.waitForFunction((x) => window.__downloads.length > x, before);
      const d = (await page.evaluate(() => window.__downloads)).pop();
      const buf = Buffer.from(d.b64, 'base64');
      fs.writeFileSync(path.join(OUT, 'S-' + d.filename), buf);
      return { name: d.filename, buf };
    };
    const pdf = await grab('text=Bank statement PDF');
    const pageCount = (pdf.buf.toString('latin1').match(/\/Type \/Page[^s]/g) || []).length;
    check(/Fabrikam Burbank Itemized Expenses .* Bank Statement\.pdf$/.test(pdf.name) && pdf.buf.subarray(0, 5).toString() === '%PDF-' && pageCount === 2, 'the statement downloads as its own PDF: ' + pdf.name + ' (' + pageCount + ' pages)');
    const zf = await grab('text=Statement files');
    const names = Object.keys((await JSZip.loadAsync(zf.buf)).files);
    check(/Bank Statement files\.zip$/.test(zf.name) && names.length === 1 && /^Statement 01 - statement\.jpg$/.test(names[0]), 'and the statement as uploaded: ' + zf.name + ' → ' + names.join(', '));
    await page.click('[aria-label="Close"]');
    await page.click('[aria-label="Back to reports"]');
    // statement first, receipt after: the receipt joins the charge its line made
    await page.click('text=New itemized report');
    await page.fill('#it-cust', 'Fabrikam statement first');
    await page.setInputFiles('#it-up', path.join(FIX, 'statement.png'));
    await page.waitForSelector('text=That looks like a card statement');
    await page.waitForFunction(() => document.querySelectorAll('.stmt-row').length > 0 && document.querySelectorAll('.charge-row').length === 2, null, { timeout: 30000 });
    check(true, 'a statement added with the receipts moves to Bank statement, and its two charges go on the report');
    await page.setInputFiles('#it-cam', path.join(FIX, 'uber.jpg'));
    await page.waitForFunction(() => !/Reading receipt|Adding photo/.test(document.body.innerText) && document.querySelectorAll('.charge-row img').length === 1, null, { timeout: 30000 });
    await page.waitForTimeout(200);
    rows = await rowsText();
    check(rows.length === 2 && rows.some(t => /Uber/.test(t) && /CA\$36\.93/.test(t) && !/No receipt/.test(t)), 'the Uber receipt joins the Uber charge from the statement, no duplicate: ' + JSON.stringify(rows));
    // a PDF statement exports exactly as uploaded; the same lines on it aren't added twice
    await page.setInputFiles('#st-up', path.join(FIX, 'rental.pdf'));
    await page.waitForFunction(() => document.querySelectorAll('.stmt-page').length === 3 && !/Reading statement|Adding page/.test(document.body.innerText), null, { timeout: 30000 }); // the PDF has two pages
    check((await rowsText()).length === 2, 'the same lines on other pages don’t add charges');
    await page.click('.dock >> text=Download');
    const zf2 = await grab('text=Statement files');
    const z2 = await JSZip.loadAsync(zf2.buf);
    const n2 = Object.keys(z2.files);
    const pdfIn = n2.find(n => /\.pdf$/.test(n));
    check(n2.length === 2 && pdfIn && (await z2.file(pdfIn).async('nodebuffer')).equals(fs.readFileSync(path.join(FIX, 'rental.pdf'))), 'the PDF statement comes back byte for byte: ' + n2.join(', '));
    await page.click('[aria-label="Close"]');
    check(errors.length === 0, 'no page errors ' + JSON.stringify(errors));
    await ctx.close();
  }

  console.log('P: the shareable preview (nothing saved, no sign-in)');
  {
    const { ctx, page, errors } = await open(browser, { env: 'preview' });
    await page.waitForSelector('text=Preview: nothing you enter is saved');
    const cards = await page.$$eval('.rcard .cust', els => els.map(e => e.textContent));
    check(cards.length === 2 && cards.every(t => /\(example\)/.test(t)), 'opens on two marked examples: ' + cards.join(', '));
    check(await page.isVisible('.envband'), 'the preview band shows');
    await page.click('text=Contoso LA (example)');
    await page.click('.dock >> text=Download');
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('text=Excel workbook')]);
    const z = await JSZip.loadAsync(fs.readFileSync(await dl.path()));
    check(!!z.file('xl/worksheets/sheet1.xml'), 'the example downloads as the Excel form: ' + dl.suggestedFilename());
    await page.click('[aria-label="Close"]');
    await page.click('[aria-label="Back to reports"]');
    await newPerDiem(page, 'Pat Visitor', 'Visitor trial trip');
    await page.click('[aria-label="Back to reports"]');
    await page.waitForSelector('text=Visitor trial trip');
    const dev = await onDevice(page);
    check(dev.idb.length === 0 && dev.ls === 0 && dev.ss === 0, 'nothing stored on the device ' + JSON.stringify(dev));
    await page.reload();
    await page.waitForSelector('.rcard');
    check(!(await page.innerText('body')).includes('Visitor trial trip'), 'a reload clears what the visitor entered');
    await shot(page, 'P-preview-home');
    check(errors.length === 0, 'no page errors ' + JSON.stringify(errors));
    await ctx.close();
  }
  {
    const { ctx, page, errors } = await open(browser, { env: 'preview', who: ALEX });
    await page.waitForSelector('text=Preview: nothing you enter is saved');
    await page.click('text=New itemized report');
    await page.fill('#it-name', 'Pat Visitor');
    await page.fill('#it-cust', 'Visitor itemized');
    await page.setInputFiles('#it-cam', path.join(FIX, 'uber.jpg'));
    await page.waitForFunction(() => document.querySelectorAll('.charge-row').length >= 1 && !/Reading receipt|Adding photo/.test(document.body.innerText), null, { timeout: 30000 });
    check(/Uber/.test(await page.innerText('body')), 'opened in Claude, receipts are read by Claude');
    check(keysOf('preview').length === 0, 'and nothing is written to any database');
    check(errors.length === 0, 'no page errors ' + JSON.stringify(errors));
    await ctx.close();
  }

  await browser.close();
  console.log(failures ? 'FAIL (' + failures + ')' : 'PASS');
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
