// Builds sample workbooks and PDFs with the same core the app uses (Node).
// Run: npm run test:generate  → files land in test/out/
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const { jsPDF } = require('jspdf');
const C = require('../src/core.js');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });
const tplIt = fs.readFileSync(path.join(ROOT, 'templates', 'itemized-expense-claim.xlsx'));
const tplPd = fs.readFileSync(path.join(ROOT, 'templates', 'perdiem-travel-expense.xlsx'));
const L = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'layouts.json'), 'utf8'));
const jpg = fs.readFileSync(path.join(__dirname, 'fixtures', 'sample.jpg'));

// Fictional sample trips. Their output is pinned by the snapshots in test/golden/
// (first recorded from the generator after it reproduced the original filled-in Evertz workbooks cell for cell).
const pdA = { type: 'perdiem', name: 'Alex Morgan', customer: 'Acme Broadcasting', start: '2026-01-19', end: '2026-01-24', partialMode: 'some', partialDays: ['2026-01-19'] };
const pdB = { type: 'perdiem', name: 'Jamie Chen', customer: 'Northwind Studios', start: '2026-06-15', end: '2026-07-10', partialMode: 'some', partialDays: ['2026-06-15', '2026-07-10'] };
let n = 0;
const ch = (date, category, amount, extra = {}) => ({ id: 'c' + (++n), date, category, amount, currency: 'CAD', ...extra });
const itA = {
  type: 'itemized', name: 'Alex Morgan', customer: 'Contoso LA', manager: 'Jordan Lee', location: '',
  charges: [
    ch('2026-04-30', 'airfare', 60.00), ch('2026-04-30', 'parking', 31.50, { approved: true }), ch('2026-05-01', 'parking', 31.50, { approved: true }), ch('2026-04-29', 'taxi', 41.20, { imageId: 'img1', vendor: 'Uber' }),
    ch('2026-05-04', 'parking', 33.00, { approved: true }), ch('2026-05-05', 'parking', 27.75, { approved: true }), ch('2026-05-06', 'parking', 30.10, { approved: true }), ch('2026-05-07', 'parking', 30.10, { approved: true }), ch('2026-05-08', 'parking', 28.40, { approved: true }),
    ch('2026-05-11', 'airfare', 60.00), ch('2026-05-10', 'rental', 980.25, { imageId: 'img2', vendor: 'Budget' }), ch('2026-05-10', 'taxi', 44.60), ch('2026-05-10', 'fuel', 72.15, { imageId: 'img2' }),
    // left off: unapproved parking, USD without CAD
    ch('2026-05-09', 'parking', 12, {}), ch('2026-05-09', 'taxi', 20, { currency: 'USD' }),
  ],
};
const itB = JSON.parse(JSON.stringify(itA));
itB.name = 'Jamie Chen';
itB.location = 'Burbank, CA';
itB.charges.push(ch('2026-04-29', 'taxi', 12.5, { currency: 'USD', cad: 17.21 })); // two rides on one day → a formula cell

(async () => {
  const jobs = [['pdA', pdA, 'perdiem'], ['pdB', pdB, 'perdiem'], ['itA', itA, 'itemized'], ['itB', itB, 'itemized']];
  for (const [tag, r, kind] of jobs) {
    const res = kind === 'perdiem' ? await C.perDiemXlsx(JSZip, tplPd, r) : await C.itemizedXlsx(JSZip, tplIt, r);
    const name = tag + ' - ' + C.fileBase(r);
    fs.writeFileSync(path.join(OUT, name + '.xlsx'), res.bytes);
    if (res.warnings.length) console.log(tag, 'WARN', res.warnings);
    const sum = kind === 'perdiem' ? C.perDiemSummary(r) : C.itemizedSummary(r);
    console.log(tag, '→', C.fileBase(r), '| weeks', sum.weeks.map(w => w.title + ' $' + w.total).join(', '), '| total', sum.total);

    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' });
    const sheets = sum.weeks.map(w => ({ title: w.title, values: kind === 'perdiem' ? C.perDiemCells(r, w) : C.itemizedCells(r, w) }));
    C.pdfForms(doc, kind === 'perdiem' ? L.perdiem : L.itemized, sheets);
    fs.writeFileSync(path.join(OUT, name + '.pdf'), Buffer.from(doc.output('arraybuffer')));
    if (kind === 'itemized') {
      const list = C.receiptList(r);
      console.log('   receipts:', list.map(x => x.name).join(' | '));
      const rd = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
      C.pdfReceipts(rd, list.map(x => ({ no: x.no, data: new Uint8Array(jpg), w: 600, h: 1400, lines: x.lines })), r.customer + ' · ' + r.name + ' · receipts', true);
      fs.writeFileSync(path.join(OUT, name + ' Receipts.pdf'), Buffer.from(rd.output('arraybuffer')));
    }
    // nothing from another report may ship in this file
    const z = await JSZip.loadAsync(res.bytes);
    const sst = await z.file('xl/sharedStrings.xml').async('string');
    const wb = await z.file('xl/workbook.xml').async('string');
    const core = await z.file('docProps/core.xml').async('string');
    const other = ['Alex Morgan', 'Jamie Chen', 'Acme Broadcasting', 'Northwind Studios', 'Contoso LA'].filter(t => t !== r.name && t !== r.customer);
    const leaks = other.filter(t => (sst + wb + core).includes(t));
    console.log('   text from other reports in this file:', leaks.length ? leaks : 'none');
  }
})().catch(e => { console.error(e); process.exit(1); });
