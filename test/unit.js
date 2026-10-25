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

(async () => {
  let failed = 0;
  for (const [name, fn] of tests) {
    try { await fn(); console.log('  ok   ' + name); }
    catch (e) { failed++; console.log('  FAIL ' + name + '\n       ' + e.message); }
  }
  console.log(failed ? 'FAIL (' + failed + ')' : 'PASS (' + tests.length + ' unit checks)');
  process.exit(failed ? 1 : 0);
})();
