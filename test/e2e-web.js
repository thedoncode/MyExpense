// Headless-browser run-through of the web version against the real server and a real database:
// first-admin setup with two-step sign-in, invites, two people using it at once, receipts read by a
// stand-in for Claude, downloads, signing out and sessions ending. Also checks that the page runs
// under its Content-Security-Policy without a single violation.
// Run: npm run build && node test/e2e-web.js   (database settings: test/support/server-harness.js)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const K = require('../server/crypto');
const { start } = require('./support/server-harness');

const FIX = path.join(__dirname, 'fixtures');
const OUT = path.join(__dirname, 'e2e-out', 'web');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

let failures = 0;
const check = (ok, msg) => { console.log((ok ? '  ok   ' : '  FAIL ') + msg); if (!ok) failures++; };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png'), fullPage: true });
const codeFor = (secret) => K.totpAt(K.unbase32(secret.replace(/\s/g, '')), K.stepNow());
const nextWindow = () => new Promise(r => setTimeout(r, 30000 - (Date.now() % 30000) + 300));

(async () => {
  const H = await start({ localhost: true });
  const origin = H.origin; // http://localhost:<port>
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP localhost 127.0.0.1'] });
  async function open(opts = {}) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, colorScheme: opts.dark ? 'dark' : 'light', acceptDownloads: true });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push('pageerror: ' + e.message));
    page.on('console', m => { if (m.type() === 'error' && !/status of (40[0-9]|429)/.test(m.text())) errors.push('console: ' + m.text()); });
    await page.goto(opts.url || origin + '/');
    return { ctx, page, errors };
  }
  const PW = { admin: 'orchid tractor violin 31', alex: 'sunny harbour lantern 42', jamie: 'quiet maple ledger 77' };
  const secrets = {};
  async function enroll(page, who) {
    await page.waitForSelector('text=Set up two-step sign-in');
    await page.waitForSelector('img.qr');
    secrets[who] = await page.textContent('.secret');
    await page.fill('#code', codeFor(secrets[who]));
    await page.click('text=Turn on two-step sign-in');
    await page.waitForSelector('text=Save your recovery codes');
    const codes = await page.$$eval('.codes span', els => els.map(e => e.textContent));
    await page.check('input[type=checkbox]');
    await page.click('text=Go to my expenses');
    await page.waitForSelector('text=New per diem report');
    return codes;
  }
  async function signIn(page, email, pw, secret) {
    await page.waitForSelector('#email');
    await page.fill('#email', email); await page.fill('#password', pw);
    await page.click('button:has-text("Continue")');
    await page.waitForSelector('text=Enter your code');
    await page.fill('#code', codeFor(secret));
    await page.click('button:has-text("Sign in")');
    await page.waitForSelector('text=New per diem report');
  }
  async function invite(page, email) {
    await page.click('[aria-label="Account"]');
    await page.click('text=Manage people');
    await page.fill('#inv-email', email);
    await page.click('text=Make invite link');
    await page.waitForSelector('.linkbox code');
    const link = await page.textContent('.linkbox code');
    await page.click('[role=dialog] [aria-label="Close"]');
    return link;
  }

  try {
    console.log('A: the first administrator sets up MyExpense');
    const adm = await open();
    {
      const { page, errors } = adm;
      await page.waitForSelector('text=Set up MyExpense QA');
      check(await page.isVisible('.envband'), 'the QA band shows');
      await shot(page, 'A-setup');
      await page.fill('#token', H.cfg.setupToken);
      await page.fill('#email', 'admin@example.com');
      await page.fill('#name', 'Sam Admin');
      await page.fill('#password', 'too short');
      await page.fill('#password2', 'too short');
      await page.click('button:has-text("Continue")');
      await page.waitForSelector('text=Use at least 12 characters');
      check(true, 'a short password is refused with a reason');
      await page.fill('#password', PW.admin); await page.fill('#password2', PW.admin);
      await page.click('button:has-text("Continue")');
      await page.waitForSelector('text=Set up two-step sign-in');
      await page.waitForSelector('img.qr');
      await shot(page, 'A-enroll');
      const codes = await enroll(page, 'admin');
      check(codes.length === 10 && codes.every(c => /^[A-Z0-9]{4}(-[A-Z0-9]{4}){3}$/.test(c)), 'ten recovery codes shown once');
      const dev = await page.evaluate(async () => ({ cookie: document.cookie, ls: localStorage.length, ss: sessionStorage.length, idb: (await indexedDB.databases()).length }));
      check(dev.cookie === '' && dev.ls === 0 && dev.ss === 0 && dev.idb === 0, 'the session cookie is hidden from scripts and nothing is stored on the device ' + JSON.stringify(dev));
      const scripts = await page.$$eval('script', els => els.map(e => ({ src: e.getAttribute('src'), sri: e.integrity, inline: !e.src && e.textContent.trim().length > 0 })));
      check(scripts.length === 6 && scripts.every(s => s.src && s.src.startsWith('/assets/') && /^sha384-/.test(s.sri) && !s.inline), 'every script is served from the site itself with an integrity hash, none inline');
      await shot(page, 'A-admin-home');
      check(errors.length === 0, 'no page errors or policy violations ' + JSON.stringify(errors));
    }

    console.log('B: people are invited and set themselves up');
    const alexLink = await invite(adm.page, 'alex@example.com');
    const jamieLink = await invite(adm.page, 'jamie@example.com');
    check(alexLink.startsWith(origin + '/#invite='), 'invite link made: ' + alexLink.replace(/=.*/, '=…'));
    const alex = await open({ url: alexLink });
    {
      const { page } = alex;
      await page.waitForSelector('text=Welcome to MyExpense QA');
      check(page.url() === origin + '/', 'the one-time token is taken out of the address bar');
      check(await page.isVisible('text=alex@example.com'), 'the invite shows whose account it is');
      await page.fill('#name', 'Alex Morgan');
      await page.fill('#password', PW.alex); await page.fill('#password2', PW.alex);
      await page.click('button:has-text("Continue")');
      await enroll(page, 'alex');
      check(true, 'Alex accepted the invite and turned on two-step sign-in');
    }
    const jamie = await open({ url: jamieLink });
    {
      const { page } = jamie;
      await page.waitForSelector('text=Welcome to MyExpense QA');
      await page.fill('#name', 'Jamie Chen');
      await page.fill('#password', PW.jamie); await page.fill('#password2', PW.jamie);
      await page.click('button:has-text("Continue")');
      await enroll(page, 'jamie');
    }
    {
      const used = await open({ url: alexLink });
      await used.page.waitForSelector('text=This link has expired or was already used');
      check(true, 'an invite link works only once');
      await used.ctx.close();
    }

    console.log('C: Alex makes an itemized report with receipts read by Claude');
    {
      const { page, errors } = alex;
      H.ai.replies.push({ text: '{"kind":"receipt","transactions":[{"date":"2026-04-29","vendor":"Uber","category":"taxi","amount":26.85,"currency":"USD","cad":null,"payment":"Visa 4412"}]}' });
      H.ai.replies.push({ text: '{"kind":"receipt","transactions":[{"date":"2026-05-10","vendor":"Budget","category":"rental","amount":980.25,"currency":"CAD","payment":"Visa 4412"}]}' });
      await page.click('text=New itemized report');
      await page.fill('#it-name', 'Alex Morgan');
      await page.fill('#it-cust', 'Alex itemized Contoso');
      await page.setInputFiles('#it-cam', path.join(FIX, 'uber.jpg'));
      await page.waitForTimeout(150);
      await page.setInputFiles('#it-up', path.join(FIX, 'rental.pdf'));
      await page.waitForFunction(() => document.querySelectorAll('.charge-row').length >= 2 && !/Reading receipt|Adding photo/.test(document.body.innerText), null, { timeout: 30000 });
      const text = await page.innerText('body');
      check(/Uber/.test(text) && /Budget/.test(text), 'both receipts were read');
      const calls = H.ai.calls.map(c => c.body.messages[0].content[0].type);
      check(calls.join() === 'image,document', 'the photo went to Claude as an image and the PDF as the original document: ' + calls.join());
      await page.click('.charge-row >> nth=0');
      const id = await page.$eval('.charge-edit input[type=date]', e => e.id);
      await page.fill('#' + id.replace(/-date$/, '') + '-cad', '36.93');
      await page.click('text=Details are correct');
      await page.click('.charge-row >> nth=1');
      await page.click('text=Details are correct');
      await page.waitForTimeout(1200);
      await shot(page, 'C-alex-itemized');
      await page.click('.dock >> text=Download');
      await page.waitForSelector('text=Receipt files');
      const files = [];
      for (const t of ['text=Excel workbook', 'text=Print-ready PDF', 'text=Receipts PDF', 'text=Receipt files']) {
        const [dl] = await Promise.all([page.waitForEvent('download'), page.click(t)]);
        const p = path.join(OUT, 'C-' + dl.suggestedFilename());
        await dl.saveAs(p);
        files.push(p);
      }
      check(files.length === 4, 'downloads: ' + files.map(f => path.basename(f)).join(' | '));
      const zip = await JSZip.loadAsync(fs.readFileSync(files[3]));
      const names = Object.keys(zip.files);
      check(names.length === 2 && names.some(n => n.endsWith('.pdf')), 'receipt zip has the photo and the original PDF: ' + names.join(', '));
      const xlsx = await JSZip.loadAsync(fs.readFileSync(files[0]));
      check(!!xlsx.file('xl/worksheets/sheet1.xml'), 'the Excel file opens');
      await page.click('[aria-label="Close"]');
      await page.click('[aria-label="Back to reports"]');
      await page.reload();
      await page.waitForSelector('.rcard');
      check((await page.$$eval('.rcard .cust', els => els.map(e => e.textContent))).join() === 'Alex itemized Contoso', 'Alex’s report comes back after a reload');
      const [rows] = await H.pool.query('SELECT body FROM reports');
      check(rows.length === 1 && !rows[0].body.toString('latin1').includes('Contoso'), 'it is stored encrypted');
      check(errors.length === 0, 'no page errors or policy violations ' + JSON.stringify(errors));
    }

    console.log('D: Jamie, at the same time, sees only Jamie’s own reports');
    {
      const { page, errors } = jamie;
      await page.reload();
      await page.waitForSelector('text=No reports yet');
      check(!(await page.innerText('body')).includes('Contoso'), 'none of Alex’s reports');
      const probe = await page.evaluate(async () => {
        const h = { 'X-MyExpense': '1' };
        const a = await fetch('/api/reports', { headers: h }).then(r => r.json());
        const b = await fetch('/api/admin/users', { headers: h }).then(r => r.status);
        return { reports: a.length, admin: b };
      });
      check(probe.reports === 0 && probe.admin === 403, 'calling the API directly gets nothing of Alex’s, and no administration ' + JSON.stringify(probe));
      await page.click('text=New per diem report');
      await page.fill('#pd-name', 'Jamie Chen');
      await page.fill('#pd-cust', 'Jamie private trip');
      await page.fill('#pd-start', '2026-06-15'); await page.dispatchEvent('#pd-start', 'change');
      await page.fill('#pd-end', '2026-06-20'); await page.dispatchEvent('#pd-end', 'change');
      await page.waitForSelector('.week');
      await page.waitForTimeout(1200);
      await page.click('[aria-label="Back to reports"]');
      await page.waitForSelector('.rcard');
      await alex.page.reload();
      await alex.page.waitForSelector('.rcard');
      const alexSees = await alex.page.$$eval('.rcard .cust', els => els.map(e => e.textContent));
      check(alexSees.join() === 'Alex itemized Contoso', 'Alex still sees only Alex’s report');
      check(errors.length === 0, 'no page errors ' + JSON.stringify(errors));
    }

    console.log('E: administration never shows expenses');
    {
      const { page } = adm;
      await page.reload();
      await page.waitForSelector('text=No reports yet');
      await page.click('[aria-label="Account"]');
      await page.click('text=Manage people');
      await page.waitForSelector('.urow');
      const t = await page.innerText('[role=dialog]');
      check(/alex@example\.com/.test(t) && /jamie@example\.com/.test(t) && !/Contoso|Jamie private trip/.test(t), 'the people list shows accounts only');
      await page.click('text=Activity');
      await page.waitForSelector('.audit .row');
      const log = await page.innerText('[role=dialog]');
      check(/Accepted invite/.test(log) && /Turned on two-step sign-in/.test(log) && !/Contoso/.test(log), 'the activity log shows sign-ins and account changes, not expenses');
      await shot(page, 'E-admin-activity');
      await page.click('[role=dialog] [aria-label="Close"]');
    }

    console.log('F: signing out, and back in with the code');
    {
      const { page, errors } = alex;
      await page.click('[aria-label="Account"]');
      await page.click('[role=dialog] >> text=Sign out');
      await page.waitForSelector('text=You’re signed out.');
      check(!(await page.innerText('body')).includes('Contoso'), 'nothing of Alex’s is left on screen');
      await page.reload();
      await page.waitForSelector('#email');
      check(true, 'after a reload it still asks to sign in');
      await nextWindow();
      await signIn(page, 'alex@example.com', PW.alex, secrets.alex);
      await page.waitForSelector('.rcard');
      check(true, 'signed back in with password and code');
      check(errors.length === 0, 'no page errors ' + JSON.stringify(errors));
    }

    console.log('G: a session that ends on the server ends on screen');
    {
      const { page } = alex;
      await H.pool.query("UPDATE sessions s JOIN users u ON u.id = s.user_id SET s.last_seen_at = ? WHERE u.email = 'alex@example.com'", [Date.now() - 31 * 60000]);
      await page.click('.rcard');
      await page.fill('#it-cust', 'Alex itemized Contoso (edited)');
      await page.waitForSelector('text=Your session ended. Sign in again to keep going.', { timeout: 10000 });
      check(!(await page.innerText('body')).includes('Contoso'), 'the report is cleared from the screen');
      await shot(page, 'G-ended');
    }

    console.log('H: a turned-off account is stopped');
    {
      const { page } = adm;
      const users = await page.evaluate(() => fetch('/api/admin/users', { headers: { 'X-MyExpense': '1' } }).then(r => r.json()));
      const jid = users.users.find(u => u.email === 'jamie@example.com').id;
      await page.evaluate((id) => fetch('/api/admin/users/' + id + '/disable', { method: 'POST', headers: { 'X-MyExpense': '1' } }), jid);
      await jamie.page.click('text=New per diem report');
      await jamie.page.fill('#pd-name', 'Jamie again');
      await jamie.page.waitForSelector('#email', { timeout: 10000 });
      check(true, 'Jamie’s next save sends them to sign-in');
      await jamie.page.fill('#email', 'jamie@example.com'); await jamie.page.fill('#password', PW.jamie);
      await jamie.page.click('button:has-text("Continue")');
      await jamie.page.waitForSelector('text=This account is turned off');
      check(true, 'and they can’t sign back in');
    }

    console.log('I: dark mode');
    {
      const d = await open({ dark: true });
      await d.page.waitForSelector('#email');
      await shot(d.page, 'I-signin-dark');
      check(d.errors.length === 0, 'no page errors ' + JSON.stringify(d.errors));
      await d.ctx.close();
    }
  } finally {
    await browser.close();
    await H.stop();
  }
  console.log(failures ? 'FAIL (' + failures + ')' : 'PASS');
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
