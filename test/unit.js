// Unit checks for the rules and the safety guards in src/core.js. Run: node test/unit.js
const assert = require('assert');
const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');
const C = require('../src/core.js');

const tests = [];
const test = (name, fn) => tests.push([name, fn]);

test('per diem: weeks run Sunday-Saturday; first starts on the trip start, last ends on the trip end', () => {
  const w = C.perDiemWeeks({ start: '2026-06-17', end: '2026-07-01', partialMode: 'none', partialDays: [] });
  assert.deepStrictEqual(w.map(x => x.title), ['Week Ending 20-Jun-26', 'Week Ending 27-Jun-26', 'Week Ending 04-Jul-26']);
  assert.strictEqual(w[0].days[0].date, '2026-06-17');
  assert.strictEqual(w[2].days[w[2].days.length - 1].date, '2026-07-01');
});
test('per diem: only explicitly marked days are partial', () => {
  const s = C.perDiemSummary({ start: '2026-06-15', end: '2026-06-20', partialMode: 'some', partialDays: ['2026-06-15'] });
  assert.strictEqual(s.partialDays, 1); assert.strictEqual(s.fullDays, 5); assert.strictEqual(s.total, 550);
  const none = C.perDiemSummary({ start: '2026-06-15', end: '2026-06-20', partialMode: 'none', partialDays: ['2026-06-15'] });
  assert.strictEqual(none.partialDays, 0);
});
test('per diem: the partial-day question must be answered', () => {
  const p = C.perDiemProblems({ name: 'A', customer: 'B', start: '2026-06-15', end: '2026-06-20', partialMode: null });
  assert.ok(p.some(x => x.field === 'partial'));
});
test('itemized: parking and other rows stay off without an explicit OK', () => {
  assert.match(C.chargeIssue({ date: '2026-05-01', category: 'parking', amount: 20, currency: 'CAD' }), /OK/);
  assert.strictEqual(C.chargeIssue({ date: '2026-05-01', category: 'parking', amount: 20, currency: 'CAD', approved: true }), null);
});
test('itemized: foreign-currency receipts need the CAD amount; nothing is converted', () => {
  assert.match(C.chargeIssue({ date: '2026-05-01', category: 'taxi', amount: 20, currency: 'USD' }), /CAD amount/);
  assert.strictEqual(C.chargeCAD({ amount: 20, currency: 'USD', cad: 27.4 }), 27.4);
});
test('card numbers are masked to the last four digits', () => {
  assert.strictEqual(C.maskPayment('Visa 4111 1111 1111 1234'), 'Visa ••1234');
  assert.strictEqual(C.maskPayment('Amex 3782-822463-10005'), 'Amex ••0005');
  assert.strictEqual(C.maskPayment('Visa 4412'), 'Visa 4412');
  const ai = C.normalizeAi({ transactions: [{ date: '2026-05-01', category: 'taxi', amount: 10, currency: 'USD', payment: 'VISA 4111111111111111' }] });
  assert.strictEqual(ai.transactions[0].payment, 'VISA ••1111');
});
test('receipt reading output is validated, never trusted', () => {
  const ai = C.normalizeAi({ transactions: [{ date: 'yesterday', category: '<script>', amount: '12,50', currency: 'us dollars', vendor: 'x'.repeat(500) }] });
  const t = ai.transactions[0];
  assert.strictEqual(t.date, null); assert.strictEqual(t.category, 'misc'); assert.strictEqual(t.vendor.length, 60);
  assert.ok(t.currency === null || /^[A-Z]{3}$/.test(t.currency));
  assert.strictEqual(C.normalizeAi({ transactions: 'nope' }).transactions.length, 0);
  assert.strictEqual(C.normalizeAi({ transactions: new Array(100).fill({ category: 'taxi' }) }).transactions.length, 20);
});
test('stored reports are validated on load', () => {
  assert.strictEqual(C.cleanReport(null), null);
  assert.strictEqual(C.cleanReport({ id: '../x', type: 'perdiem' }), null);
  assert.strictEqual(C.cleanReport({ id: 'r1', type: 'admin' }), null);
  const r = C.cleanReport({ id: 'r1', type: 'itemized', name: 'n'.repeat(300), evil: 1, charges: [
    { id: 'c1', date: '2026-05-01', category: 'taxi', amount: 1e12, currency: 'CAD', payment: '4111 1111 1111 1111', ai: 'reading', imageId: 'bad/id' },
    { id: '', category: 'taxi' }, 'junk'] });
  assert.strictEqual(r.name.length, 80); assert.ok(!('evil' in r));
  assert.strictEqual(r.charges.length, 1);
  const c = r.charges[0];
  assert.strictEqual(c.amount, null); assert.strictEqual(c.imageId, null); assert.strictEqual(c.payment, '••1111');
  assert.strictEqual(c.ai, 'failed'); assert.match(c.aiNote, /interrupted/);
  const pd = C.cleanReport({ id: 'r2', type: 'perdiem', start: '2026-13-40', partialMode: 'all', partialDays: ['2026-06-15', 'x'] });
  assert.strictEqual(pd.start, ''); assert.strictEqual(pd.partialMode, null); assert.deepStrictEqual(pd.partialDays, ['2026-06-15']);
});
test('file names can’t carry paths or reserved characters', () => {
  const n = C.safeName('../..\\evil:<name>|?*"\u0000');
  assert.ok(!/[\\/:*?"<>|\u0000]/.test(n), n);
  const r = { type: 'perdiem', customer: '../../etc/passwd', start: '2026-06-15', end: '2026-06-20' };
  assert.ok(!/[\\/]/.test(C.fileBase(r)), C.fileBase(r));
});
test('text that looks like a formula is written as plain text in Excel', async () => {
  const tpl = fs.readFileSync(path.join(__dirname, '..', 'templates', 'itemized-expense-claim.xlsx'));
  const r = { type: 'itemized', name: '=HYPERLINK("http://evil","x")', customer: '+cmd|calc', manager: '@SUM(1)', location: '-2+3',
    charges: [{ id: 'c1', date: '2026-05-01', category: 'taxi', amount: 10, currency: 'CAD', vendor: '=1+1' }] };
  const { bytes } = await C.itemizedXlsx(JSZip, tpl, r);
  const z = await JSZip.loadAsync(bytes);
  const sheet = await z.file('xl/worksheets/sheet1.xml').async('string');
  const formulas = [...sheet.matchAll(/<f[^>]*>([^<]*)<\/f>/g)].map(m => m[1]);
  assert.ok(!formulas.some(f => /HYPERLINK|cmd|SUM\(1\)/.test(f)), 'a user string became a formula');
  const sst = await z.file('xl/sharedStrings.xml').async('string');
  assert.ok(sst.includes('=HYPERLINK(&quot;http://evil&quot;,&quot;x&quot;)'), 'the name is stored as text');
});

/* ---------- bank statements ---------- */
const stRows = (rows) => C.normalizeStatement({ kind: 'statement', rows }).rows;
test('statements: the rows you marked are ticked; otherwise the usual claim types; never credits', () => {
  const marked = stRows([
    { date: '2026-05-01', description: 'UBER *TRIP', amount: 36.93, currency: 'CAD', category: 'uber', marked: true },
    { date: '2026-05-01', description: 'STARBUCKS', amount: 6.45, currency: 'CAD', category: 'meal', marked: false },
    { date: '2026-05-02', description: 'PAYMENT THANK YOU', amount: -500, currency: 'CAD', credit: true, category: 'other', marked: true },
  ]);
  assert.deepStrictEqual(marked.map(r => r.claim), [true, false, false]);
  assert.strictEqual(marked[0].category, 'taxi'); assert.strictEqual(marked[2].amount, 500);
  const unmarked = stRows([
    { date: '2026-05-01', description: 'LYFT', amount: 20, currency: 'CAD', category: 'taxi' },
    { date: '2026-05-01', description: 'IMPARK', amount: 18, currency: 'CAD', category: 'parking' },
    { date: '2026-05-01', description: 'HILTON', amount: 300, currency: 'CAD', category: 'hotel' },
    { date: '2026-05-01', description: 'ESSO', amount: 60, currency: 'CAD', category: 'fuel' },
  ]);
  assert.deepStrictEqual(unmarked.map(r => r.claim), [true, false, false, true], 'parking and hotels need ticking by hand');
});
test('statements: Claude’s answer is validated and card numbers are masked', () => {
  const s = C.normalizeStatement({ kind: 'statement', card: 'Visa 4111 1111 1111 4412', rows: [
    { date: 'May 1', description: 'REF 4111111111111111 ' + 'x'.repeat(100), amount: 'abc', currency: 'us dollars', category: '<b>', foreign: { amount: '26.85', currency: 'usd' } }, 'junk', null] });
  assert.strictEqual(s.card, 'Visa ••4412');
  assert.strictEqual(s.rows.length, 1);
  const r = s.rows[0];
  assert.strictEqual(r.date, null); assert.strictEqual(r.amount, null); assert.strictEqual(r.category, 'misc'); assert.strictEqual(r.claim, false);
  assert.ok(!/4111111111111111/.test(r.description) && r.description.length <= 60);
  assert.deepStrictEqual(r.foreign, { amount: 26.85, currency: 'USD' });
  assert.strictEqual(C.normalizeStatement({ rows: new Array(200).fill({ amount: 1 }) }).rows.length, 80);
});
test('statements: each charge is paired with the line that posted, once', () => {
  const row = (id, date, amount, description, extra) => ({ id, date, amount, description, currency: 'CAD', claim: true, chargeId: null, foreign: null, category: 'taxi', ...extra });
  const r = { type: 'itemized', charges: [
    { id: 'c1', date: '2026-04-29', category: 'taxi', vendor: 'Uber', amount: 26.85, currency: 'USD', cad: null },
    { id: 'c2', date: '2026-05-10', category: 'rental', vendor: 'Budget', amount: 980.25, currency: 'CAD' },
    { id: 'c3', date: '2026-05-03', category: 'taxi', vendor: 'Lyft', amount: 14.10, currency: 'USD', cad: null },
    { id: 'c4', date: '2026-05-06', category: 'parking', vendor: 'Impark', amount: 31.50, currency: 'CAD', approved: true },
    { id: 'c5', date: '2026-05-20', category: 'fuel', vendor: 'Esso', amount: 40, currency: 'CAD' },
  ], statements: [{ ai: 'read', rows: [
    row('a', '2026-04-30', 36.93, 'UBER *TRIP', { foreign: { amount: 26.85, currency: 'USD' } }),
    row('b', '2026-05-11', 980.25, 'BUDGET RENT A CAR'),
    row('c', '2026-05-11', 980.25, 'BUDGET RENT A CAR'),
    row('d', '2026-05-04', 19.40, 'LYFT *RIDE SUN'),
    row('e', '2026-05-20', 50, 'SHELL'),
    row('f', '2026-05-06', 31.50, 'IMPARK 1234', { claim: false }),
    row('g', '2026-05-20', 9, 'IGNORED', { claim: false }),
    row('h', '2026-05-02', 500, 'PAYMENT', { credit: true, claim: false }),
  ] }] };
  const l = C.linkStatement(r);
  assert.strictEqual(l.get('a').how, 'fx', 'the original USD amount on the line'); assert.strictEqual(l.get('a').charge.id, 'c1');
  assert.strictEqual(l.get('b').how, 'same'); assert.strictEqual(l.get('b').charge.id, 'c2');
  assert.strictEqual(l.get('c').how, 'none', 'two identical lines on one page are two charges');
  assert.strictEqual(l.get('d').how, 'cad', 'same vendor and days, no USD amount shown: offered, not applied'); assert.strictEqual(l.get('d').charge.id, 'c3');
  assert.strictEqual(l.get('e').how, 'none');
  assert.strictEqual(l.get('f').how, 'same', 'an unticked line still pairs with its charge');
  assert.ok(!l.has('g') && !l.has('h'));
  const chk = C.statementCheck(r);
  assert.deepStrictEqual(chk.missing.map(c => c.id), ['c3', 'c5'], 'charges not on the statement');
  assert.strictEqual(chk.unlisted.length, 2); assert.strictEqual(chk.suggestions.length, 1);
  // reconcile records the pairs, fills in the CAD that posted, and puts ticked lines on the report
  let k = 0;
  const rr = C.reconcile(r, () => 'n' + (++k));
  assert.strictEqual(rr.charges.find(c => c.id === 'c1').cad, 36.93);
  assert.strictEqual(rr.charges.find(c => c.id === 'c3').cad, null, 'a guess is never applied');
  const rows = rr.statements[0].rows;
  assert.strictEqual(rows.find(x => x.id === 'a').chargeId, 'c1');
  assert.strictEqual(rows.find(x => x.id === 'f').claim, true, 'a line paired with a charge is on the claim');
  const made2 = rr.charges.filter(c => c.fromStatement);
  assert.deepStrictEqual(made2.map(c => [c.vendor, c.amount, c.imageId]), [['BUDGET RENT A CAR', 980.25, null], ['SHELL', 50, null]], 'ticked lines with no receipt still go on the report');
  assert.strictEqual(rows.find(x => x.id === 'd').chargeId, null, 'the vendor-only guess is left for the person');
  assert.deepStrictEqual(C.missingReceipts(rr).map(c => c.vendor), ['Uber', 'Budget', 'Lyft', 'Impark', 'Esso', 'BUDGET RENT A CAR', 'SHELL'], 'every charge without a photo');
  assert.strictEqual(C.reconcile(rr, () => 'x'), rr, 'nothing more to do the second time');
  // an edited charge stays paired, and the difference shows
  const edited = { ...rr, charges: rr.charges.map(c => (c.id === 'c2' ? { ...c, amount: 990 } : c)) };
  const m = C.statementCheck(edited).mismatches;
  assert.strictEqual(m.length, 1); assert.strictEqual(m[0].row.id, 'b');
  // the same line on a second page isn't a new charge
  rr.statements.push({ ai: 'read', rows: [row('b2', '2026-05-11', 980.25, 'BUDGET RENT A CAR')] });
  assert.strictEqual(C.linkStatement(rr).get('b2').how, 'dupe');
  assert.ok(!C.statementList(rr).some(it => it.row.id === 'b2'), 'listed once in the PDF');
  assert.strictEqual(C.reconcile(rr, () => 'y').charges.length, rr.charges.length, 'and isn’t added again');
  const made = C.chargeFromRow(r.statements[0].rows[4], 'c9');
  assert.strictEqual(made.amount, 50); assert.strictEqual(made.currency, 'CAD'); assert.strictEqual(made.checked, false); assert.strictEqual(made.imageId, null);
});
test('statements: a receipt added after the statement joins the charge its line made', () => {
  let k = 0;
  const id = () => 'n' + (++k);
  const line = (rid, date, amount, description, extra) => ({ id: rid, date, amount, description, currency: 'CAD', claim: true, chargeId: null, foreign: null, category: 'taxi', ...extra });
  let r = { type: 'itemized', charges: [], statements: [{ ai: 'read', rows: [
    line('a', '2026-04-29', 36.93, 'UBER *TRIP', { foreign: { amount: 26.85, currency: 'USD' } }),
    line('b', '2026-05-10', 72.15, 'SHELL 57444', { category: 'fuel' }),
    line('c', '2026-05-03', 19.40, 'LYFT *RIDE'),
  ] }] };
  r = C.reconcile(r, id);
  assert.strictEqual(r.charges.length, 3); assert.strictEqual(C.missingReceipts(r).length, 3);
  const approvedId = r.charges[1].id;
  r = { ...r, charges: r.charges.map(c => (c.id === approvedId ? { ...c, approved: true } : c)) };
  // the Uber receipt (US dollars) and the Shell receipt (CAD) arrive
  r = { ...r, charges: [...r.charges,
    { id: 'R1', date: '2026-04-29', vendor: 'Uber', category: 'taxi', amount: 26.85, currency: 'USD', cad: null, imageId: 'img1', ai: 'read' },
    { id: 'R2', date: '2026-05-10', vendor: 'Shell', category: 'fuel', amount: 72.15, currency: 'CAD', imageId: 'img2', ai: 'read' },
    { id: 'R3', date: '2026-05-03', vendor: 'Lyft', category: 'taxi', amount: 14.10, currency: 'USD', cad: null, imageId: 'img3', ai: 'read' },
    { id: 'R4', date: '2026-05-12', vendor: 'Air Canada', category: 'airfare', amount: 30, currency: 'CAD', imageId: 'img4', ai: 'reading' }] };
  r = C.reconcile(r, id);
  const uber = r.charges.find(c => c.id === 'R1');
  assert.ok(uber && uber.cad === 36.93 && uber.imageId === 'img1', 'the receipt joins its line’s charge, with the CAD that posted');
  assert.strictEqual(r.charges.find(c => c.id === 'R2').approved, true, 'an OK already given carries over');
  assert.strictEqual(r.charges.filter(c => /UBER|SHELL/.test(c.vendor)).length, 0, 'no duplicate charges left behind');
  assert.deepStrictEqual(r.statements[0].rows.map(x => x.chargeId).slice(0, 2), ['R1', 'R2']);
  assert.ok(r.charges.some(c => c.id === 'R4'), 'a receipt still being read is left alone');
  // the Lyft receipt shows no USD amount on the line: offered, not applied
  const offers = C.receiptSuggestions(r);
  assert.strictEqual(offers.length, 1); assert.strictEqual(offers[0].receipt.id, 'R3');
  r = C.reconcile(C.attachReceipt(r, offers[0].charge.id, 'R3'), id);
  const lyft = r.charges.find(c => c.id === 'R3');
  assert.ok(lyft.cad === 19.40 && lyft.imageId === 'img3');
  assert.deepStrictEqual(C.missingReceipts(r).map(c => c.id), [], 'no receipts missing now');
  assert.strictEqual(r.charges.length, 4);
});
test('statements: stored pages are validated on load', () => {
  const r = C.cleanReport({ id: 'r1', type: 'itemized', charges: [{ id: 'c1', category: 'taxi' }], statements: [
    { id: 'p1', imageId: 'i1', ai: 'reading', marks: [{ x: 0.1, y: 0.1, w: 0.5, h: 0.05 }],
      rows: [{ id: 's1', description: 'card 4111 1111 1111 1111', amount: 5, claim: true, chargeId: 'c1' }, { id: 's2', amount: 5, claim: true, chargeId: 'gone' }, { id: '../x' }] },
    { id: 'bad/id' }, 'junk'] });
  assert.strictEqual(r.statements[0].group, 'p1'); assert.strictEqual(r.statements[0].orig, false);
  assert.strictEqual(C.cleanReport({ id: 'r3', type: 'itemized', charges: [{ id: 'c1', fromStatement: true }, { id: 'c2', fromStatement: 'yes' }] }).charges.map(c => c.fromStatement).join(), 'true,false');
  assert.strictEqual(r.statements.length, 1);
  const p = r.statements[0];
  assert.strictEqual(p.ai, 'failed'); assert.match(p.aiNote, /interrupted/);
  assert.ok(!('marks' in p), 'unknown fields are dropped');
  assert.strictEqual(p.rows.length, 2); assert.ok(!/1111 1111/.test(p.rows[0].description));
  assert.strictEqual(p.rows[0].chargeId, 'c1'); assert.strictEqual(p.rows[1].chargeId, null, 'a link to a deleted charge is dropped');
  assert.deepStrictEqual(C.cleanReport({ id: 'r2', type: 'itemized' }).statements, []);
});
test('statements: the PDF lists the lines on the claim and what’s missing, then one page per statement page', () => {
  const { jsPDF } = require('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
  const jpg = new Uint8Array(fs.readFileSync(path.join(__dirname, 'fixtures', 'sample.jpg')));
  const r = { charges: [], statements: [{ rows: [{ id: 's1', date: '2026-05-01', description: 'UBER TRIP', amount: 36.93, currency: 'CAD', claim: true }] }] };
  C.pdfStatement(doc, { heading: 'Test', sub: ['Employee: Alex'], items: C.statementList(r), missing: ['Sun, May 3 · Taxi / Uber · Lyft · CA$19.40'], pages: [{ data: jpg, w: 600, h: 1400 }, { data: jpg, w: 600, h: 1400 }], fresh: true });
  assert.strictEqual(doc.getNumberOfPages(), 3);
  const out = doc.output();
  assert.ok(out.includes('UBER TRIP') && out.includes('Not on the report') && out.includes('Statement page 2 of 2'));
  assert.ok(out.includes('not found on these statement pages') && out.includes('Lyft'), 'charges missing from the statement are listed');
});

/* ---------- web server building blocks (server/) ---------- */
const K = require('../server/crypto');
const { loadConfig } = require('../server/config');
test('two-step codes match the RFC 6238 test vectors', () => {
  const secret = Buffer.from('12345678901234567890');
  assert.strictEqual(K.totpAt(secret, Math.floor(59 / 30)), '287082');
  assert.strictEqual(K.totpAt(secret, Math.floor(1111111109 / 30)), '081804');
  assert.strictEqual(K.totpAt(secret, Math.floor(2000000000 / 30)), '279037');
  assert.deepStrictEqual(K.unbase32(K.base32(secret)), secret);
  const now = 1111111109 * 1000;
  assert.strictEqual(K.checkTotp(secret, '081804', 0, now), Math.floor(1111111109 / 30));
  assert.strictEqual(K.checkTotp(secret, '081804', Math.floor(1111111109 / 30), now), null, 'a used step is refused');
  assert.strictEqual(K.checkTotp(secret, '12345', 0, now), null);
});
test('sealed data opens only with its key and its own context', () => {
  const k1 = require('crypto').randomBytes(32), k2 = require('crypto').randomBytes(32);
  const ring = K.keyring(k1);
  const sealed = ring.seal(Buffer.from('secret report'), 'report:1:r1');
  assert.strictEqual(ring.open(sealed, 'report:1:r1').toString(), 'secret report');
  assert.throws(() => ring.open(sealed, 'report:2:r1'), 'another person');
  assert.throws(() => K.keyring(k2).open(sealed, 'report:1:r1'), 'another key');
  const tampered = Buffer.from(sealed); tampered[tampered.length - 1] ^= 1;
  assert.throws(() => ring.open(tampered, 'report:1:r1'), 'tampering');
  const rotated = K.keyring(k2, k1);
  assert.strictEqual(rotated.open(sealed, 'report:1:r1').toString(), 'secret report', 'the previous key still opens old data');
  assert.ok(!rotated.isCurrent(sealed) && rotated.isCurrent(rotated.seal(Buffer.from('x'), 'c')));
});
test('passwords are hashed with scrypt and checked against the rules', async () => {
  const h = await K.hashPassword('correct horse battery staple');
  assert.match(h, /^scrypt\$16384\$8\$5\$/);
  assert.ok(await K.verifyPassword('correct horse battery staple', h));
  assert.ok(!(await K.verifyPassword('correct horse battery stapl', h)));
  assert.ok(!(await K.verifyPassword('x', 'md5$abc')));
  assert.ok(K.passwordProblem('short', 'a@b.co'));
  assert.ok(K.passwordProblem('password1234', 'a@b.co'));
  assert.ok(K.passwordProblem('alexandra-is-great', 'alexandra@example.com'));
  assert.strictEqual(K.passwordProblem('orchid tractor violin', 'a@b.co'), null);
  const codes = K.newRecoveryCodes();
  assert.strictEqual(new Set(codes).size, 10);
  assert.ok(K.recoveryHash(codes[0]).equals(K.recoveryHash(codes[0].toLowerCase().replace(/-/g, ' '))));
});
test('the server refuses to start with unsafe settings', () => {
  const ok = { APP_ORIGIN: 'https://expenses.example.com', DB_USER: 'u', DB_PASSWORD: 'p', DB_NAME: 'd', DATA_KEY: require('crypto').randomBytes(32).toString('base64') };
  assert.strictEqual(loadConfig(ok).origin, 'https://expenses.example.com');
  assert.throws(() => loadConfig({ ...ok, APP_ORIGIN: 'http://expenses.example.com' }), /https/);
  assert.throws(() => loadConfig({ ...ok, DATA_KEY: '' }), /DATA_KEY/);
  assert.throws(() => loadConfig({ ...ok, DATA_KEY: 'c2hvcnQ=' }), /32 random bytes/);
  assert.throws(() => loadConfig({ ...ok, SETUP_TOKEN: 'abc' }), /SETUP_TOKEN/);
  assert.throws(() => loadConfig({ ...ok, DB_PASSWORD: '' }), /DB_PASSWORD/);
  assert.throws(() => loadConfig({ ...ok, APP_ENV: 'dev' }), /APP_ENV/);
  assert.throws(() => loadConfig({ ...ok, ANTHROPIC_BASE_URL: 'http://evil.example' }), /https/);
});

(async () => {
  let failed = 0;
  for (const [name, fn] of tests) {
    try { await fn(); console.log('  ok   ' + name); }
    catch (e) { failed++; console.log('  FAIL ' + name + '\n       ' + e.message); }
  }
  console.log(failed ? 'FAIL (' + failed + ')' : 'PASS (' + tests.length + ' unit checks)');
  process.exit(failed ? 1 : 0);
})();
