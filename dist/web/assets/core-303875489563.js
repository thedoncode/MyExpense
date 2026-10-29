/* ExpenseMe core: dates, weekly split, template cell values, xlsx cloning, PDF forms.
   Pure logic; works in the browser (window.ExpenseCore) and in Node (module.exports). */
(function (root) {
  'use strict';

  /* ---------------- dates ---------------- */
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const DOW3 = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function isISO(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(parse(s)) && iso(parse(s)) === s; } // real calendar dates only
  function parse(s) { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); }
  function iso(ms) { const d = new Date(ms); return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0'); }
  function addDays(s, n) { return iso(parse(s) + n * 86400000); }
  function dow(s) { return new Date(parse(s)).getUTCDay(); }
  function saturdayOf(s) { return addDays(s, 6 - dow(s)); }
  function sundayOf(s) { return addDays(s, -dow(s)); }
  function daysBetween(a, b) { return Math.round((parse(b) - parse(a)) / 86400000); }
  function serial(s) { return Math.round((parse(s) - Date.UTC(1899, 11, 30)) / 86400000); }
  function parts(s) { const d = new Date(parse(s)); return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate() }; }
  function fmtDDMonYY(s) { const p = parts(s); return String(p.d).padStart(2, '0') + '-' + MON[p.m] + '-' + String(p.y % 100).padStart(2, '0'); }
  function fmtMonD(s) { const p = parts(s); return MON[p.m] + ' ' + p.d; }
  function fmtNice(s) { const p = parts(s); return DOW3[dow(s)] + ', ' + MON[p.m] + ' ' + p.d; }
  function fmtLong(s) { const p = parts(s); return MON[p.m] + ' ' + p.d + ', ' + p.y; }
  function weekTitle(sat) { return 'Week Ending ' + fmtDDMonYY(sat); }

  function round2(n) { return Math.round((Number(n) + Number.EPSILON) * 100) / 100; }
  function money(n, cur) {
    const s = round2(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return (cur && cur !== 'USD' && cur !== 'CAD' ? cur + ' ' : '$') + s;
  }

  /* ---------------- per diem rules ---------------- */
  const PD = {
    destination: 'United States', currency: 'USD', department: 'Service',
    full: 100, partial: 50,
    fullDesc: 'Per Diam - Full Day', partialDesc: 'Per Diam - Partial Day',
    maxDays: 186,
  };

  function perDiemProblems(r) {
    const p = [];
    if (!r.name || !r.name.trim()) p.push({ field: 'name', msg: 'Add the employee’s full name.' });
    if (!r.customer || !r.customer.trim()) p.push({ field: 'customer', msg: 'Add the customer name.' });
    if (!isISO(r.start)) p.push({ field: 'start', msg: 'Pick the trip start date.' });
    if (!isISO(r.end)) p.push({ field: 'end', msg: 'Pick the trip end date.' });
    if (isISO(r.start) && isISO(r.end)) {
      if (parse(r.end) < parse(r.start)) p.push({ field: 'end', msg: 'The end date is before the start date.' });
      else if (daysBetween(r.start, r.end) + 1 > PD.maxDays) p.push({ field: 'end', msg: 'Trips longer than ' + PD.maxDays + ' days aren’t supported.' });
    }
    if (r.partialMode !== 'none' && r.partialMode !== 'some') p.push({ field: 'partial', msg: 'Say whether any days are partial (50%), or choose “None”.' });
    else if (r.partialMode === 'some' && !(r.partialDays || []).some(d => inTrip(r, d))) p.push({ field: 'partial', msg: 'Tap the partial days, or choose “None”.' });
    return p;
  }
  function inTrip(r, d) { return isISO(d) && isISO(r.start) && isISO(r.end) && parse(d) >= parse(r.start) && parse(d) <= parse(r.end); }

  function perDiemWeeks(r) {
    if (!isISO(r.start) || !isISO(r.end) || parse(r.end) < parse(r.start)) return [];
    const partial = new Set(r.partialMode === 'some' ? (r.partialDays || []) : []);
    const weeks = [];
    let cur = r.start;
    while (parse(cur) <= parse(r.end)) {
      const sat = saturdayOf(cur);
      const last = parse(sat) < parse(r.end) ? sat : r.end;
      const days = [];
      for (let d = cur; parse(d) <= parse(last); d = addDays(d, 1)) {
        const isP = partial.has(d);
        days.push({ date: d, partial: isP, desc: isP ? PD.partialDesc : PD.fullDesc, amount: isP ? PD.partial : PD.full });
      }
      weeks.push({ weekEnding: sat, title: weekTitle(sat), days, total: days.reduce((a, b) => a + b.amount, 0) });
      cur = addDays(sat, 1);
    }
    return weeks;
  }

  function perDiemSummary(r) {
    const weeks = perDiemWeeks(r);
    const days = weeks.flatMap(w => w.days);
    const partial = days.filter(d => d.partial);
    return {
      weeks, fullDays: days.length - partial.length, partialDays: partial.length,
      total: weeks.reduce((a, w) => a + w.total, 0),
    };
  }

  /* ---------------- itemized rules ---------------- */
  // Category rows on the EXPENSE CLAIM REPORT (rows 14-31). q = qualifying by default.
  const CATS = [
    { key: 'airfare', row: 14, label: 'Air Fare (baggage fees)', short: 'Baggage', q: true },
    { key: 'taxi', row: 27, label: 'Taxi / Uber', short: 'Taxi', q: true },
    { key: 'rental', row: 24, label: 'Auto Rental', short: 'Auto Rental', q: true },
    { key: 'fuel', row: 29, label: 'Fuel', short: 'Fuel', q: true },
    { key: 'parking', row: 26, label: 'Parking', q: false },
    { key: 'airporttax', row: 15, label: 'Airport Tax', q: false },
    { key: 'breakfast', row: 16, label: 'Breakfast', q: false },
    { key: 'lunch', row: 17, label: 'Lunch - food', q: false },
    { key: 'lunchalc', row: 18, label: 'Lunch - alcohol', q: false },
    { key: 'dinner', row: 19, label: 'Dinner - food', q: false },
    { key: 'dinneralc', row: 20, label: 'Dinner - alcohol', q: false },
    { key: 'latemeal', row: 21, label: 'Late Meal/Overtime', q: false },
    { key: 'snacks', row: 22, label: 'Snacks', q: false },
    { key: 'hotel', row: 23, label: 'Hotel', q: false },
    { key: 'entertainment', row: 25, label: 'Entertainment (sales only)', q: false },
    { key: 'tips', row: 28, label: 'Tips', q: false },
    { key: 'mileage', row: 30, label: 'Mileage', q: false },
    { key: 'misc', row: 31, label: 'Miscellaneous', q: false },
  ];
  const CAT = Object.fromEntries(CATS.map(c => [c.key, c]));
  const DAYCOL = ['B', 'D', 'F', 'H', 'J', 'L', 'N']; // Sunday..Saturday charge columns
  const HSTCOL = ['C', 'E', 'G', 'I', 'K', 'M', 'O'];

  function chargeCAD(c) {
    if (c.currency === 'CAD') return isFinite(c.amount) && c.amount !== null && c.amount !== '' ? round2(c.amount) : null;
    return isFinite(c.cad) && c.cad !== null && c.cad !== '' ? round2(c.cad) : null;
  }
  // Why a charge is left off the report (null when it's in)
  function chargeIssue(c) {
    if (c.ai === 'processing' || c.ai === 'reading') return 'is still being read';
    if (!isISO(c.date)) return 'needs a date';
    if (!CAT[c.category]) return 'needs a category';
    if (!c.currency) return 'needs the currency';
    const cad = chargeCAD(c);
    if (cad === null) return c.currency === 'CAD' ? 'needs an amount' : 'needs the CAD amount from your card statement';
    if (cad <= 0) return 'amount must be more than $0';
    if (!CAT[c.category].q && !c.approved) return CAT[c.category].label + ' needs your OK to include';
    return null;
  }

  function itemizedProblems(r) {
    const p = [];
    if (!r.name || !r.name.trim()) p.push({ field: 'name', msg: 'Add the employee’s full name.' });
    if (!r.customer || !r.customer.trim()) p.push({ field: 'customer', msg: 'Add the customer / trip name.' });
    if (!(r.charges || []).some(c => !chargeIssue(c))) p.push({ field: 'charges', msg: 'Add at least one complete charge.' });
    return p;
  }

  function itemizedWeeks(r) {
    const ok = (r.charges || []).filter(c => !chargeIssue(c));
    const bySat = new Map();
    for (const c of ok) {
      const sat = saturdayOf(c.date);
      if (!bySat.has(sat)) bySat.set(sat, []);
      bySat.get(sat).push(c);
    }
    return [...bySat.keys()].sort().map(sat => {
      const charges = bySat.get(sat).slice().sort((a, b) => a.date.localeCompare(b.date) || CAT[a.category].row - CAT[b.category].row);
      const grid = new Map(); // "row|di" -> amounts[]
      for (const c of charges) {
        const k = CAT[c.category].row + '|' + dow(c.date);
        if (!grid.has(k)) grid.set(k, []);
        grid.get(k).push(chargeCAD(c));
      }
      return {
        weekEnding: sat, title: weekTitle(sat), charges, grid,
        total: round2(charges.reduce((a, c) => a + chargeCAD(c), 0)),
      };
    });
  }

  function itemizedSummary(r) {
    const weeks = itemizedWeeks(r);
    const all = r.charges || [];
    const left = all.map(c => ({ c, issue: chargeIssue(c) })).filter(x => x.issue);
    const inc = weeks.flatMap(w => w.charges);
    const dates = inc.map(c => c.date).sort();
    return { weeks, left, included: inc.length, total: round2(weeks.reduce((a, w) => a + w.total, 0)), first: dates[0], last: dates[dates.length - 1] };
  }

  /* ---------------- cell values per weekly sheet ----------------
     op: num | str | date | clear | cache (keep template formula, set cached value) | formula */
  const COLS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  function colIdx(c) { let n = 0; for (const ch of c) n = n * 26 + (ch.charCodeAt(0) - 64); return n; }
  function colName(n) { let s = ''; while (n > 0) { const m = (n - 1) % 26; s = COLS[m] + s; n = Math.floor((n - 1) / 26); } return s; }
  function splitRef(ref) { const m = /^([A-Z]+)(\d+)$/.exec(ref); return [m[1], Number(m[2])]; }

  function itemizedCells(r, week) {
    const V = {};
    const sun = sundayOf(week.weekEnding);
    V.N2 = { op: 'date', v: serial(week.weekEnding) };
    V.N3 = { op: 'str', v: r.name.trim() };
    V.N4 = { op: 'str', v: 'Service' };
    V.N5 = (r.manager || '').trim() ? { op: 'str', v: r.manager.trim() } : { op: 'clear' };
    const daysWith = new Set(week.charges.map(c => dow(c.date)));
    for (let i = 0; i < 7; i++) {
      V[DAYCOL[i] + '10'] = { op: 'date', v: serial(addDays(sun, i)) };
      V[DAYCOL[i] + '12'] = (r.location || '').trim() && daysWith.has(i) ? { op: 'str', v: r.location.trim() } : { op: 'clear' };
    }
    const colTot = {};
    for (let row = 14; row <= 31; row++) {
      let rowP = 0;
      for (let i = 0; i < 7; i++) {
        const amts = week.grid.get(row + '|' + i);
        const ref = DAYCOL[i] + row;
        if (amts && amts.length) {
          const sum = round2(amts.reduce((a, b) => a + b, 0));
          V[ref] = amts.length === 1 ? { op: 'num', v: sum } : { op: 'formula', f: amts.map(a => String(a)).join('+'), v: sum };
          rowP += sum;
          colTot[DAYCOL[i]] = (colTot[DAYCOL[i]] || 0) + sum;
        } else V[ref] = { op: 'clear' };
        V[HSTCOL[i] + row] = { op: 'clear' };
      }
      V['P' + row] = { op: 'cache', v: round2(rowP) };
      V['Q' + row] = { op: 'cache', v: 0 };
    }
    for (let c = 2; c <= 15; c++) V[colName(c) + '32'] = { op: 'cache', v: round2(colTot[colName(c)] || 0) };
    V.P32 = { op: 'cache', v: week.total };
    V.Q32 = { op: 'cache', v: 0 };
    V.F34 = { op: 'cache', v: week.total };
    return V;
  }

  const PD_FIRST = 15, PD_LAST = 29;
  const PD_CATCOLS = ['G', 'H', 'I', 'J', 'K', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
  function perDiemCells(r, week) {
    const V = {};
    V.N4 = { op: 'date', v: serial(week.weekEnding) };
    V.N5 = { op: 'str', v: r.name.trim() };
    V.N6 = { op: 'str', v: PD.department };
    V.N7 = { op: 'str', v: r.customer.trim() };
    V.N8 = { op: 'str', v: PD.destination };
    const sums = {};
    let uSum = 0;
    for (let row = PD_FIRST; row <= PD_LAST; row++) {
      const day = week.days[row - PD_FIRST];
      for (const c of PD_CATCOLS) V[c + row] = { op: 'cache', v: '', f: 'IF($D' + row + '=' + c + '$14,$F' + row + ',"")' };
      V['B' + row] = { op: 'clear' };
      V['F' + row] = { op: 'clear' };
      if (day) {
        V['C' + row] = { op: 'date', v: serial(day.date) };
        V['D' + row] = { op: 'str', v: day.desc };
        V['E' + row] = { op: 'str', v: PD.currency };
        V['L' + row] = { op: 'num', v: day.amount };
      } else {
        V['C' + row] = { op: 'clear' };
        V['D' + row] = { op: 'clear' };
        V['E' + row] = { op: 'clear' };
        V['L' + row] = { op: 'cache', v: '', f: "IF(OR($D" + row + "='Expense Descriptions'!$A$2,$D" + row + "='Expense Descriptions'!$A$3),$F" + row + ',"")' };
      }
      const u = day ? day.amount : 0;
      V['U' + row] = { op: 'cache', v: u };
      V['V' + row] = { op: 'num', v: 0 };
      V['W' + row] = { op: 'cache', v: u };
      uSum += u;
      sums.L = (sums.L || 0) + u;
    }
    for (const c of PD_CATCOLS.concat(['L'])) V[c + '30'] = { op: 'cache', v: c === 'L' ? sums.L : 0, soft: true };
    V.U31 = { op: 'cache', v: uSum };
    V.V31 = { op: 'cache', v: 0 };
    V.W31 = { op: 'cache', v: uSum };
    V.U33 = { op: 'cache', v: uSum };
    return V;
  }

  /* ---------------- xlsx: clone template parts ---------------- */
  function escXml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function unescXml(s) { return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&'); }
  function parseAttrs(s) { const out = []; const re = /([\w:]+)="([^"]*)"/g; let m; while ((m = re.exec(s))) out.push([m[1], m[2]]); return out; }
  function attrStr(a) { return a.map(([k, v]) => ' ' + k + '="' + v + '"').join(''); }
  function getA(a, k) { const x = a.find(p => p[0] === k); return x ? x[1] : undefined; }
  function setA(a, k, v) {
    const i = a.findIndex(p => p[0] === k);
    if (v === undefined) { if (i >= 0) a.splice(i, 1); return; }
    if (i >= 0) a[i][1] = v;
    else {
      // keep Excel's r, s, t order
      const order = ['r', 's', 't'];
      const pos = order.indexOf(k);
      let at = a.length;
      if (pos >= 0) { at = a.findIndex(p => order.indexOf(p[0]) > pos || order.indexOf(p[0]) < 0); if (at < 0) at = a.length; }
      a.splice(at, 0, [k, v]);
    }
  }

  class SST {
    constructor(xml) {
      this.head = xml.slice(0, xml.indexOf('<sst'));
      const open = /<sst\b[^>]*>/.exec(xml);
      this.openAttrs = parseAttrs(open[0].slice(4, -1));
      const body = xml.slice(open.index + open[0].length, xml.lastIndexOf('</sst>'));
      this.items = body.match(/<si>[\s\S]*?<\/si>/g) || [];
      this.map = new Map();
      this.items.forEach((si, i) => {
        const m = /^<si><t(?: xml:space="preserve")?>([\s\S]*?)<\/t><\/si>$/.exec(si);
        if (m && !this.map.has(unescXml(m[1]))) this.map.set(unescXml(m[1]), i);
      });
      this.refs = 0;
    }
    idx(text) {
      this.refs++;
      if (this.map.has(text)) return this.map.get(text);
      const sp = /^\s|\s$/.test(text) ? ' xml:space="preserve"' : '';
      this.items.push('<si><t' + sp + '>' + escXml(text) + '</t></si>');
      this.map.set(text, this.items.length - 1);
      return this.items.length - 1;
    }
    toXml(extraCount) {
      const a = this.openAttrs.map(x => x.slice());
      const cnt = Number(getA(a, 'count') || this.items.length) + (extraCount || 0);
      setA(a, 'count', String(cnt));
      setA(a, 'uniqueCount', String(this.items.length));
      return (this.head || '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n') + '<sst' + attrStr(a) + '>' + this.items.join('') + '</sst>';
    }
  }

  function parseSheet(xml) {
    const s = xml.indexOf('<sheetData');
    const sOpenEnd = xml.indexOf('>', s) + 1;
    const selfClosing = xml[sOpenEnd - 2] === '/';
    const e = selfClosing ? sOpenEnd : xml.indexOf('</sheetData>');
    const pre = xml.slice(0, s) + '<sheetData>';
    const post = '</sheetData>' + xml.slice(selfClosing ? sOpenEnd : e + '</sheetData>'.length);
    const body = selfClosing ? '' : xml.slice(sOpenEnd, e);
    const rows = new Map();
    const reRow = /<row\b([^>]*?)(?:\/>|>([\s\S]*?)<\/row>)/g;
    let m;
    while ((m = reRow.exec(body))) {
      const attrs = parseAttrs(m[1]);
      const rn = Number(getA(attrs, 'r'));
      const cells = new Map();
      const reC = /<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;
      let c;
      const inner = m[2] || '';
      while ((c = reC.exec(inner))) {
        const ca = parseAttrs(c[1]);
        cells.set(getA(ca, 'r'), { attrs: ca, inner: c[2] || '' });
      }
      rows.set(rn, { attrs, cells });
    }
    return { pre, post, rows };
  }
  function serializeSheet(sh) {
    const rowNums = [...sh.rows.keys()].sort((a, b) => a - b);
    let out = '';
    for (const rn of rowNums) {
      const row = sh.rows.get(rn);
      const refs = [...row.cells.keys()].sort((a, b) => colIdx(splitRef(a)[0]) - colIdx(splitRef(b)[0]));
      out += '<row' + attrStr(row.attrs) + '>';
      for (const ref of refs) {
        const c = row.cells.get(ref);
        out += c.inner ? '<c' + attrStr(c.attrs) + '>' + c.inner + '</c>' : '<c' + attrStr(c.attrs) + '/>';
      }
      out += '</row>';
    }
    return sh.pre + out + sh.post;
  }
  function getCell(sh, ref) {
    const [, rn] = splitRef(ref);
    if (!sh.rows.has(rn)) sh.rows.set(rn, { attrs: [['r', String(rn)]], cells: new Map() });
    const row = sh.rows.get(rn);
    if (!row.cells.has(ref)) row.cells.set(ref, { attrs: [['r', ref]], inner: '' });
    return row.cells.get(ref);
  }
  function numStr(v) { const n = Math.round(v * 1e6) / 1e6; return String(n); }

  function applyCell(sh, ref, op, sst, warn) {
    const c = getCell(sh, ref);
    const fEl = (/<f\b[^>]*\/>|<f\b[^>]*>[\s\S]*?<\/f>/.exec(c.inner) || [null])[0];
    const isMasterShared = fEl && /t="shared"/.test(fEl) && /ref="/.test(fEl);
    const isChildShared = fEl && /t="shared"/.test(fEl) && !/ref="/.test(fEl);
    const setVal = (v) => {
      if (typeof v === 'string') { setA(c.attrs, 't', 'str'); return '<v>' + escXml(v) + '</v>'; }
      setA(c.attrs, 't', undefined); return '<v>' + numStr(v) + '</v>';
    };
    switch (op.op) {
      case 'num': case 'date':
        if (isMasterShared) throw new Error('Refusing to overwrite shared formula master ' + ref);
        setA(c.attrs, 't', undefined); c.inner = '<v>' + numStr(op.v) + '</v>'; break;
      case 'str':
        if (isMasterShared) throw new Error('Refusing to overwrite shared formula master ' + ref);
        setA(c.attrs, 't', 's'); c.inner = '<v>' + sst.idx(op.v) + '</v>'; break;
      case 'clear':
        if (isMasterShared) throw new Error('Refusing to clear shared formula master ' + ref);
        setA(c.attrs, 't', undefined); c.inner = ''; break;
      case 'formula':
        if (isMasterShared) throw new Error('Refusing to overwrite shared formula master ' + ref);
        c.inner = '<f>' + escXml(op.f) + '</f>' + setVal(op.v); break;
      case 'cache':
        if (fEl) { c.inner = fEl + setVal(op.v); }
        else if (op.f) { c.inner = '<f>' + escXml(op.f) + '</f>' + setVal(op.v); }
        else if (op.soft) { /* template has no formula here: leave as-is */ }
        else { warn && warn('No formula at ' + ref); c.inner = setVal(op.v); }
        break;
      default: throw new Error('bad op ' + op.op);
    }
    void isChildShared;
  }

  function guid() {
    const h = '0123456789ABCDEF';
    let s = '';
    for (let i = 0; i < 32; i++) s += h[Math.floor(Math.random() * 16)];
    return '{' + s.slice(0, 8) + '-' + s.slice(8, 12) + '-' + s.slice(12, 16) + '-' + s.slice(16, 20) + '-' + s.slice(20) + '}';
  }

  function prepSheetXml(xml, selected) {
    xml = xml.replace(/xr:uid="\{[0-9A-Fa-f-]+\}"/g, () => 'xr:uid="' + guid() + '"');
    xml = xml.replace(/<sheetView\b([^>]*?)(\/?)>/, (m, attrs, close) => {
      const a = parseAttrs(attrs);
      setA(a, 'tabSelected', selected ? '1' : undefined);
      // tabSelected must come first among sheetView attributes
      const i = a.findIndex(p => p[0] === 'tabSelected');
      if (i > 0) a.unshift(a.splice(i, 1)[0]);
      return '<sheetView' + attrStr(a) + close + '>';
    });
    return xml;
  }

  const CT_SHEET = 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml';
  const REL_SHEET = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet';
  const REL_PRINTER = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/printerSettings';

  async function readRels(zip, path) {
    const f = zip.file(path);
    if (!f) return [];
    const xml = await f.async('string');
    return (xml.match(/<Relationship\b[^>]*\/>/g) || []).map(r => Object.fromEntries(parseAttrs(r)));
  }
  function relsXml(list) {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      list.map(r => '<Relationship Id="' + r.Id + '" Type="' + r.Type + '" Target="' + escXml(r.Target) + '"' + (r.TargetMode ? ' TargetMode="' + r.TargetMode + '"' : '') + '/>').join('') + '</Relationships>';
  }

  /* Build a workbook: `weekly` = [{title, values}] cloned from template sheet `baseIndex`;
     template sheets listed in `keep` (by original index) follow, unchanged. */
  async function buildWorkbook(JSZip, templateBytes, { baseIndex, keep, weekly, printArea, author }) {
    const zip = await JSZip.loadAsync(templateBytes);
    let wbXml = await zip.file('xl/workbook.xml').async('string');
    const wbRels = await readRels(zip, 'xl/_rels/workbook.xml.rels');
    const sheetTags = wbXml.match(/<sheet\b[^>]*\/>/g);
    const orig = sheetTags.map(t => {
      const a = Object.fromEntries(parseAttrs(t));
      const rel = wbRels.find(r => r.Id === a['r:id']);
      return { name: unescXml(a.name), state: a.state, path: 'xl/' + rel.Target.replace(/^\/?xl\//, '') };
    });
    const sst = new SST(await zip.file('xl/sharedStrings.xml').async('string'));
    const warnings = [];

    // Load all sheets we need before deleting anything
    const loadSheet = async (i) => {
      const p = orig[i].path;
      const xml = await zip.file(p).async('string');
      const relPath = p.replace(/worksheets\/(sheet\d+\.xml)$/, 'worksheets/_rels/$1.rels');
      const rels = await readRels(zip, relPath);
      const parts = {};
      for (const r of rels) {
        if (r.TargetMode === 'External') continue;
        const target = 'xl/' + r.Target.replace(/^\.\.\//, '');
        const f = zip.file(target);
        if (f) parts[r.Id] = { type: r.Type, data: await f.async('uint8array'), ext: target.split('.').pop(), target };
      }
      return { xml, rels, parts };
    };
    const base = await loadSheet(baseIndex);
    const kept = [];
    for (const i of keep) kept.push({ i, name: orig[i].name, state: orig[i].state, ...(await loadSheet(i)) });

    // Remove old sheet parts, their rels, printer settings, calc chain
    zip.forEach((p) => {
      if (/^xl\/worksheets\//.test(p) || /^xl\/printerSettings\//.test(p) || p === 'xl/calcChain.xml') zip.remove(p);
    });

    const out = []; // {name, state, xml, rels, parts}
    weekly.forEach((w, k) => {
      const sh = parseSheet(prepSheetXml(base.xml, k === 0));
      for (const [ref, op] of Object.entries(w.values)) applyCell(sh, ref, op, sst, m => warnings.push(w.title + ': ' + m));
      out.push({ name: w.title, xml: serializeSheet(sh), rels: base.rels, parts: base.parts });
    });
    for (const s of kept) out.push({ name: s.name, state: s.state, xml: prepSheetXml(s.xml, false), rels: s.rels, parts: s.parts });

    // Keep only the shared strings these sheets use, so no leftover template text ships
    const reS = /(<c\b[^>]*\bt="s"[^>]*>)<v>(\d+)<\/v>/g;
    const used = [];
    const seen = new Map();
    let refs = 0;
    for (const s of out) {
      s.xml = s.xml.replace(reS, (m, open, idx) => {
        refs++;
        const i = Number(idx);
        if (!seen.has(i)) { seen.set(i, used.length); used.push(sst.items[i]); }
        return open + '<v>' + seen.get(i) + '</v>';
      });
    }
    sst.items = used;

    let printerN = 0;
    out.forEach((s, k) => {
      const n = k + 1;
      zip.file('xl/worksheets/sheet' + n + '.xml', s.xml);
      const rels = s.rels.map(r => {
        const part = s.parts[r.Id];
        if (part && r.Type === REL_PRINTER) {
          printerN++;
          const name = 'printerSettings' + printerN + '.bin';
          zip.file('xl/printerSettings/' + name, part.data);
          return { ...r, Target: '../printerSettings/' + name };
        }
        return r;
      });
      if (rels.length) zip.file('xl/worksheets/_rels/sheet' + n + '.xml.rels', relsXml(rels));
    });

    // workbook.xml.rels: sheets first, then everything that isn't a sheet or calcChain
    const others = wbRels.filter(r => r.Type !== REL_SHEET && !/calcChain/.test(r.Type));
    const newRels = out.map((s, k) => ({ Id: 'rId' + (k + 1), Type: REL_SHEET, Target: 'worksheets/sheet' + (k + 1) + '.xml' }));
    others.forEach((r, k) => newRels.push({ ...r, Id: 'rId' + (out.length + k + 1) }));
    zip.file('xl/_rels/workbook.xml.rels', relsXml(newRels));

    // workbook.xml: sheets, print areas, first tab active, recalc on open
    const sheetsXml = '<sheets>' + out.map((s, k) => '<sheet name="' + escXml(s.name) + '" sheetId="' + (k + 1) + '"' + (s.state ? ' state="' + s.state + '"' : '') + ' r:id="rId' + (k + 1) + '"/>').join('') + '</sheets>';
    wbXml = wbXml.replace(/<sheets>[\s\S]*?<\/sheets>/, sheetsXml);
    const oldDefs = (wbXml.match(/<definedName\b[^>]*>[\s\S]*?<\/definedName>/g) || []);
    const defs = [];
    weekly.forEach((w, k) => { if (printArea) defs.push({ name: '_xlnm.Print_Area', local: k, body: "'" + w.title.replace(/'/g, "''") + "'!" + printArea }); });
    for (const d of oldDefs) {
      const a = Object.fromEntries(parseAttrs(d.slice(0, d.indexOf('>'))));
      const body = d.slice(d.indexOf('>') + 1, d.lastIndexOf('<'));
      if (a.localSheetId === undefined) { defs.push({ name: a.name, body: unescXml(body), raw: d }); continue; }
      const oi = Number(a.localSheetId);
      const ki = kept.findIndex(s => s.i === oi);
      if (ki >= 0) defs.push({ name: a.name, local: weekly.length + ki, body: unescXml(body) });
    }
    defs.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : (a.local ?? -1) - (b.local ?? -1)));
    const defsXml = defs.length ? '<definedNames>' + defs.map(d => d.raw || ('<definedName name="' + d.name + '"' + (d.local !== undefined ? ' localSheetId="' + d.local + '"' : '') + '>' + escXml(d.body) + '</definedName>')).join('') + '</definedNames>' : '';
    if (/<definedNames>[\s\S]*?<\/definedNames>/.test(wbXml)) wbXml = wbXml.replace(/<definedNames>[\s\S]*?<\/definedNames>/, defsXml);
    else wbXml = wbXml.replace('</sheets>', '</sheets>' + defsXml);
    wbXml = wbXml.replace(/<workbookView\b([^>]*?)\/>/, (m, attrs) => {
      const a = parseAttrs(attrs); setA(a, 'activeTab', undefined); setA(a, 'firstSheet', undefined); return '<workbookView' + attrStr(a) + '/>';
    });
    wbXml = wbXml.replace(/<calcPr\b([^>]*?)\/>/, (m, attrs) => { const a = parseAttrs(attrs); setA(a, 'fullCalcOnLoad', '1'); return '<calcPr' + attrStr(a) + '/>'; });
    // drop the template author's local folder path
    wbXml = wbXml.replace(/<mc:AlternateContent\b[^>]*>\s*<mc:Choice Requires="x15">\s*<x15ac:absPath\b[^>]*\/>\s*<\/mc:Choice>\s*<\/mc:AlternateContent>/, '');
    zip.file('xl/workbook.xml', wbXml);

    // [Content_Types].xml
    let ct = await zip.file('[Content_Types].xml').async('string');
    ct = ct.replace(/<Override PartName="\/xl\/worksheets\/[^"]*"[^>]*\/>/g, '').replace(/<Override PartName="\/xl\/calcChain\.xml"[^>]*\/>/g, '');
    ct = ct.replace('</Types>', out.map((s, k) => '<Override PartName="/xl/worksheets/sheet' + (k + 1) + '.xml" ContentType="' + CT_SHEET + '"/>').join('') + '</Types>');
    zip.file('[Content_Types].xml', ct);

    // docProps/app.xml titles
    const appF = zip.file('docProps/app.xml');
    if (appF) {
      let app = await appF.async('string');
      const titles = out.map(s => s.name).concat(defs.filter(d => d.name === '_xlnm.Print_Area').map(d => (/^'/.test(d.body) ? d.body.split('!')[0] : "'" + d.body.split('!')[0] + "'") + '!Print_Area'));
      const nNamed = titles.length - out.length;
      const hp = '<HeadingPairs><vt:vector size="' + (nNamed ? 4 : 2) + '" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>' + out.length + '</vt:i4></vt:variant>' + (nNamed ? '<vt:variant><vt:lpstr>Named Ranges</vt:lpstr></vt:variant><vt:variant><vt:i4>' + nNamed + '</vt:i4></vt:variant>' : '') + '</vt:vector></HeadingPairs>';
      const tp = '<TitlesOfParts><vt:vector size="' + titles.length + '" baseType="lpstr">' + titles.map(t => '<vt:lpstr>' + escXml(t) + '</vt:lpstr>').join('') + '</vt:vector></TitlesOfParts>';
      app = app.replace(/<HeadingPairs>[\s\S]*?<\/HeadingPairs>/, hp).replace(/<TitlesOfParts>[\s\S]*?<\/TitlesOfParts>/, tp);
      zip.file('docProps/app.xml', app);
    }
    const coreF = zip.file('docProps/core.xml');
    if (coreF) {
      let core = await coreF.async('string');
      const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
      core = core.replace(/(<dcterms:modified[^>]*>)[^<]*(<\/dcterms:modified>)/, '$1' + now + '$2');
      if (author) core = core.replace(/(<cp:lastModifiedBy>)[^<]*(<\/cp:lastModifiedBy>)/, '$1' + escXml(author) + '$2');
      core = core.replace(/<cp:lastPrinted>[^<]*<\/cp:lastPrinted>/, '');
      zip.file('docProps/core.xml', core);
    }
    sst.openAttrs = sst.openAttrs.filter(a => a[0] !== 'count');
    sst.openAttrs.push(['count', String(refs)]);
    zip.file('xl/sharedStrings.xml', sst.toXml(0));
    const bytes = await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE', compressionOptions: { level: 6 }, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return { bytes, warnings };
  }

  async function perDiemXlsx(JSZip, tpl, r) {
    const weeks = perDiemWeeks(r);
    return buildWorkbook(JSZip, tpl, {
      baseIndex: 0, keep: [1, 2, 3], printArea: null, author: (r.name || '').trim(),
      weekly: weeks.map(w => ({ title: w.title, values: perDiemCells(r, w) })),
    });
  }
  async function itemizedXlsx(JSZip, tpl, r) {
    const weeks = itemizedWeeks(r);
    return buildWorkbook(JSZip, tpl, {
      baseIndex: 0, keep: [], printArea: '$A$1:$Q$40', author: (r.name || '').trim(),
      weekly: weeks.map(w => ({ title: w.title, values: itemizedCells(r, w) })),
    });
  }

  function safeName(s) { return String(s).replace(/[\\/:*?"<>|\u0000-\u001f]+/g, '-').replace(/\s+/g, ' ').trim().slice(0, 120); }
  // Receipts for the charges on the report, in date order, numbered like the receipts PDF
  function receiptList(r) {
    const s = itemizedSummary(r);
    const by = new Map();
    for (const w of s.weeks) for (const c of w.charges) if (c.imageId) { if (!by.has(c.imageId)) by.set(c.imageId, []); by.get(c.imageId).push(c); }
    const list = [...by.entries()].map(([imageId, cs]) => ({ imageId, charges: cs.slice().sort((a, b) => a.date.localeCompare(b.date)) }));
    list.sort((a, b) => a.charges[0].date.localeCompare(b.charges[0].date));
    const money2 = (n) => 'CA$' + round2(n).toFixed(2);
    return list.map((x, i) => {
      const c0 = x.charges[0];
      const total = round2(x.charges.reduce((a, c) => a + chargeCAD(c), 0));
      const what = x.charges.length === 1 ? (CAT[c0.category].short || CAT[c0.category].label) + (c0.vendor ? ' - ' + c0.vendor : '') : x.charges.length + ' charges';
      const lines = x.charges.map(c => fmtNice(c.date) + ' · ' + CAT[c.category].label + (c.vendor ? ' · ' + c.vendor : '') + (c.payment ? ' · ' + c.payment : '') + ' · ' + money2(chargeCAD(c)) +
        (c.currency !== 'CAD' && isFinite(c.amount) && c.amount !== null ? ' (' + c.currency + ' ' + round2(c.amount).toFixed(2) + ')' : ''));
      lines.push(weekTitle(saturdayOf(c0.date)));
      return { no: i + 1, imageId: x.imageId, charges: x.charges, total, lines, name: safeName(String(i + 1).padStart(2, '0') + ' ' + c0.date + ' ' + what + ' - ' + money2(total)) };
    });
  }

  function fileBase(r) {
    const cust = (r.customer || 'Trip').trim().replace(/[\\/:*?"<>|]+/g, '-');
    if (r.type === 'perdiem') {
      return cust + ' PD Expenses ' + fmtMonD(r.start) + '-' + fmtMonD(r.end) + ' ' + parts(r.end).y;
    }
    const s = itemizedSummary(r);
    if (!s.first) return cust + ' Itemized Expenses';
    return cust + ' Itemized Expenses ' + fmtMonD(s.first) + '-' + fmtMonD(s.last) + ' ' + parts(s.last).y;
  }

  /* ---------------- number formats for the PDF ---------------- */
  function serialToISO(n) { return iso(Date.UTC(1899, 11, 30) + Math.round(n) * 86400000); }
  function numberText(n, dec) { return Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
  function formatCell(v, nf) {
    if (v === null || v === undefined || v === '') return null;
    if (typeof v === 'object' && v.d !== undefined) v = v.d; // date serial from layout
    if (typeof v === 'string') {
      return { kind: /\* /.test(nf || '') ? 'acctText' : 'text', text: v };
    }
    nf = nf || 'General';
    if (/mmm|d-|yy/.test(nf) && !/#/.test(nf)) {
      const p = parts(serialToISO(v));
      if (/^mmm-yy$/.test(nf.replace(/\\/g, ''))) return { kind: 'num', text: MON[p.m] + '-' + String(p.y % 100).padStart(2, '0') };
      return { kind: 'num', text: p.d + '-' + MON[p.m] + '-' + String(p.y % 100).padStart(2, '0') };
    }
    if (/\* /.test(nf)) { // accounting
      const sym = /"\$"/.test(nf.split(';')[0]) ? '$' : '';
      if (Math.abs(v) < 0.005) return { kind: 'acct', sym, text: '-', zero: true };
      return { kind: 'acct', sym, text: v < 0 ? '(' + numberText(v, 2) + ')' : numberText(v, 2) };
    }
    if (/#,##0\.00/.test(nf)) {
      const secs = nf.split(';');
      if (Math.abs(v) < 0.005 && secs[2] !== undefined) return { kind: 'num', text: secs[2].replace(/\\/g, '').replace(/"/g, '') || '' };
      const neg = v < 0;
      return { kind: 'num', text: (neg ? '($' : '$') + numberText(v, 2) + (neg ? ')' : '') };
    }
    if (Number.isInteger(v)) return { kind: 'num', text: String(v) };
    return { kind: 'num', text: String(Math.round(v * 1e9) / 1e9) };
  }

  /* ---------------- PDF: draw a weekly sheet like Excel prints it ---------------- */
  function hexRGB(h) { return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  const BW = { hair: 0.25, thin: 0.5, dotted: 0.5, dashed: 0.5, mediumDashed: 1, medium: 1.1, thick: 1.6, double: 1.4 };

  function drawSheet(doc, L, values, pageW, pageH) {
    const [c1, r1] = splitRef(L.range.split(':')[0]);
    const c1i = colIdx(c1);
    const xs = [0]; L.cols.forEach(w => xs.push(xs[xs.length - 1] + w));
    const ys = [0]; L.rows.forEach(h => ys.push(ys[ys.length - 1] + h));
    const W = xs[xs.length - 1], H = ys[ys.length - 1];
    const m = L.margins;
    const scale = Math.min((pageW - m.left - m.right) / W, (pageH - m.top - m.bottom) / H);
    const X = (ci) => m.left + xs[ci] * scale;
    const Y = (ri) => m.top + ys[ri] * scale;
    const merges = (L.merges || []).map(s => {
      const [a, b] = s.split(':'); const [ac, ar] = splitRef(a); const [bc, br] = splitRef(b);
      return { c0: colIdx(ac) - c1i, r0: ar - r1, c1: colIdx(bc) - c1i, r1: br - r1 };
    });
    const mergeAt = (ci, ri) => merges.find(g => ci >= g.c0 && ci <= g.c1 && ri >= g.r0 && ri <= g.r1);
    const cells = L.cells.map(([ref, si, v]) => {
      const [c, r] = splitRef(ref);
      const ov = values[ref];
      let val = v;
      if (ov) val = ov.op === 'clear' ? null : ov.v;
      return { ref, ci: colIdx(c) - c1i, ri: r - r1, st: L.styles[si], v: val };
    });
    // fills (a merged range takes its top-left cell's fill, like Excel)
    const byPos = new Map(cells.map(c => [c.ci + ',' + c.ri, c]));
    for (const c of cells) {
      const g = mergeAt(c.ci, c.ri);
      let fill = c.st.fill;
      if (g) { const a = byPos.get(g.c0 + ',' + g.r0); fill = a ? a.st.fill : null; }
      if (!fill) continue;
      doc.setFillColor(...hexRGB(fill));
      doc.rect(X(c.ci), Y(c.ri), (xs[c.ci + 1] - xs[c.ci]) * scale + 0.05, (ys[c.ri + 1] - ys[c.ri]) * scale + 0.05, 'F');
    }
    if (merges.length) {
      for (const g of merges) {
        if (byPos.has(g.c0 + ',' + g.r0)) {
          const a = byPos.get(g.c0 + ',' + g.r0);
          if (a.st.fill) { doc.setFillColor(...hexRGB(a.st.fill)); doc.rect(X(g.c0), Y(g.r0), X(g.c1 + 1) - X(g.c0), Y(g.r1 + 1) - Y(g.r0), 'F'); }
        }
      }
    }
    // borders
    const line = (side, x1, y1, x2, y2) => {
      if (!side) return;
      doc.setDrawColor(...hexRGB(side[1] || '000000'));
      doc.setLineWidth(BW[side[0]] || 0.5);
      if (side[0] === 'dotted' || side[0] === 'hair') doc.setLineDashPattern([0.6, 0.9], 0);
      else if (/dash/i.test(side[0])) doc.setLineDashPattern([2, 1.2], 0);
      else doc.setLineDashPattern([], 0);
      doc.line(x1, y1, x2, y2);
    };
    for (const c of cells) {
      const x0 = X(c.ci), x1 = X(c.ci + 1), y0 = Y(c.ri), y1 = Y(c.ri + 1);
      const g = mergeAt(c.ci, c.ri);
      // inside a merge, only outer edges show
      if (!g || c.ci === g.c0) line(c.st.bl, x0, y0, x0, y1);
      if (!g || c.ci === g.c1) line(c.st.br, x1, y0, x1, y1);
      if (!g || c.ri === g.r0) line(c.st.bt, x0, y0, x1, y0);
      if (!g || c.ri === g.r1) line(c.st.bb, x0, y1, x1, y1);
    }
    doc.setLineDashPattern([], 0);
    // text
    for (const c of cells) {
      if (c.v === null || c.v === undefined || c.v === '' || (typeof c.v === 'string' && !c.v.trim())) continue;
      const g = mergeAt(c.ci, c.ri);
      if (g && (c.ci !== g.c0 || c.ri !== g.r0)) continue;
      const ce = g ? g.c1 : c.ci, re = g ? g.r1 : c.ri;
      const bx0 = X(c.ci), bx1 = X(ce + 1), by0 = Y(c.ri), by1 = Y(re + 1);
      const st = c.st;
      const f = formatCell(c.v, st.nf);
      if (!f) continue;
      const style = st.b && st.i ? 'bolditalic' : st.b ? 'bold' : st.i ? 'italic' : 'normal';
      doc.setFont('helvetica', style);
      const size = st.sz * scale * (st.fn === 'Tahoma' ? 0.97 : 1);
      doc.setFontSize(size);
      doc.setTextColor(...hexRGB(st.fc || '000000'));
      const pad = 2.2 * scale;
      let lineH = size * 1.15;
      let lines = String(f.text).split('\n');
      const maxW = bx1 - bx0 - 2 * pad;
      if (st.wrap) {
        const wrapped = lines.flatMap(t => doc.splitTextToSize(t, Math.max(maxW, 1)));
        if (wrapped.length * lineH <= (by1 - by0) + 0.5 || lines.length > 1) lines = wrapped;
        else if (lines.length === 1 && doc.getTextWidth(lines[0]) > maxW) {
          // a wrapped label that won't fit the fixed row height: shrink to one line instead
          const s2 = size * maxW / doc.getTextWidth(lines[0]);
          doc.setFontSize(s2); lineH = s2 * 1.15;
        }
      }
      const blockH = lines.length * lineH;
      let ytop;
      const va = st.va || 'bottom';
      if (va === 'center') ytop = (by0 + by1) / 2 - blockH / 2;
      else if (va === 'top') ytop = by0 + pad * 0.6;
      else ytop = by1 - blockH - pad * 0.5;
      if (f.kind === 'acct') {
        const yb = ytop + lineH * 0.82;
        if (f.sym) doc.text(f.sym, bx0 + pad, yb);
        const rightPad = pad + doc.getTextWidth(f.zero ? '  ' : ')') * 0.9;
        doc.text(f.text, bx1 - rightPad, yb, { align: 'right' });
        continue;
      }
      let ha = st.ha;
      if (!ha || ha === 'general') ha = f.kind === 'num' ? 'right' : 'left';
      if (f.kind === 'acctText' && (!st.ha || st.ha === 'general')) ha = 'left';
      lines.forEach((t, k) => {
        const yb = ytop + lineH * (k + 0.82);
        let x = bx0 + pad, align = 'left';
        if (ha === 'right') { x = bx1 - pad; align = 'right'; }
        else if (ha === 'center' || ha === 'centerContinuous') { x = (bx0 + bx1) / 2; align = 'center'; }
        doc.text(t, x, yb, { align });
        if (st.u) {
          const tw = doc.getTextWidth(t);
          const ux = align === 'left' ? x : align === 'right' ? x - tw : x - tw / 2;
          doc.setDrawColor(...hexRGB(st.fc || '000000')); doc.setLineWidth(Math.max(0.3, size / 18));
          doc.line(ux, yb + size * 0.12, ux + tw, yb + size * 0.12);
        }
      });
    }
  }

  const LETTER_L = [792, 612], LETTER_P = [612, 792];

  function pdfForms(doc, layout, sheets) {
    sheets.forEach((s, k) => {
      if (k > 0) doc.addPage('letter', 'landscape');
      drawSheet(doc, layout, s.values, LETTER_L[0], LETTER_L[1]);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); doc.setTextColor(140, 140, 140);
      doc.text(s.title + '  ·  page ' + (k + 1) + ' of ' + sheets.length, LETTER_L[0] - 18, LETTER_L[1] - 10, { align: 'right' });
    });
  }

  /* receipts: [{dataUrl, w, h, lines:[...]}] two per portrait page */
  function pdfReceipts(doc, receipts, heading, fresh) {
    const [PW, PH] = LETTER_P;
    const M = 36, gap = 18, colW = (PW - 2 * M - gap) / 2;
    for (let i = 0; i < receipts.length; i += 2) {
      if (!(fresh && i === 0)) doc.addPage('letter', 'portrait');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(20, 24, 32);
      doc.text(heading, M, M);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(110, 110, 110);
      doc.text('Receipts ' + (i + 1) + (receipts[i + 1] ? '–' + (i + 2) : '') + ' of ' + receipts.length, PW - M, M, { align: 'right' });
      doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.5); doc.line(M, M + 8, PW - M, M + 8);
      for (let j = 0; j < 2 && i + j < receipts.length; j++) {
        const r = receipts[i + j];
        const x = M + j * (colW + gap);
        let y = M + 26;
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(20, 24, 32);
        doc.text('#' + (r.no || i + j + 1), x, y);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
        const wrapped = r.lines.flatMap(t => doc.splitTextToSize(t, colW - 22));
        wrapped.forEach((t, k) => doc.text(t, x + 20, y + k * 11));
        y += Math.max(1, wrapped.length) * 11 + 6;
        const maxH = PH - M - y;
        if (r.data) {
          const sc = Math.min(colW / r.w, maxH / r.h);
          const w = r.w * sc, h = r.h * sc;
          doc.setDrawColor(210, 210, 210); doc.rect(x - 0.5, y - 0.5, w + 1, h + 1, 'S');
          doc.addImage(r.data, 'JPEG', x, y, w, h, undefined, 'FAST');
        } else {
          doc.setTextColor(150, 150, 150); doc.text('No receipt photo attached', x, y + 12);
        }
      }
    }
  }

  /* ---------------- stored data: validate everything read back ---------------- */
  // Card numbers are never kept in full: any run of 8+ digits becomes ••<last 4>.
  function maskPayment(s) { return String(s || '').replace(/\d(?:[\s-]?\d){7,}/g, m => '••' + m.replace(/\D/g, '').slice(-4)); }
  const ID = /^[A-Za-z0-9_-]{1,64}$/;
  const str = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '');
  const num = (v) => (typeof v === 'number' && isFinite(v) && Math.abs(v) < 1e7 ? v : null);
  function cleanCharge(c) {
    if (!c || typeof c !== 'object' || typeof c.id !== 'string' || !ID.test(c.id)) return null;
    const interrupted = c.ai === 'reading' || c.ai === 'processing';
    return {
      id: c.id, date: isISO(c.date) ? c.date : null, vendor: str(c.vendor, 60), category: CAT[c.category] ? c.category : '',
      amount: num(c.amount), currency: typeof c.currency === 'string' && /^[A-Z]{3}$/.test(c.currency) ? c.currency : null, cad: num(c.cad),
      approved: c.approved === true, imageId: typeof c.imageId === 'string' && ID.test(c.imageId) ? c.imageId : null,
      ai: interrupted ? 'failed' : (c.ai === 'read' || c.ai === 'failed' ? c.ai : null), checked: c.checked === true,
      payment: maskPayment(str(c.payment, 40)), fromStatement: c.fromStatement === true,
      aiNote: interrupted ? 'Reading this receipt was interrupted. Fill in the details from the photo.' : str(c.aiNote, 200),
    };
  }
  // Returns a well-formed copy of a stored report, or null if it isn't one
  function cleanReport(r) {
    if (!r || typeof r !== 'object' || (r.type !== 'perdiem' && r.type !== 'itemized') || typeof r.id !== 'string' || !ID.test(r.id)) return null;
    const base = { id: r.id, type: r.type, name: str(r.name, 80), customer: str(r.customer, 80), createdAt: num(r.createdAt) || 0, updatedAt: num(r.updatedAt) || 0 };
    if (r.type === 'perdiem') {
      return { ...base, start: isISO(r.start) ? r.start : '', end: isISO(r.end) ? r.end : '',
        partialMode: r.partialMode === 'none' || r.partialMode === 'some' ? r.partialMode : null,
        partialDays: Array.isArray(r.partialDays) ? r.partialDays.filter(isISO).slice(0, 400) : [] };
    }
    const charges = (Array.isArray(r.charges) ? r.charges : []).slice(0, 500).map(cleanCharge).filter(Boolean);
    const ids = new Set(charges.map(c => c.id));
    const statements = (Array.isArray(r.statements) ? r.statements : []).slice(0, 30).map(cleanStatementPage).filter(Boolean);
    for (const p of statements) for (const row of p.rows) if (row.chargeId && !ids.has(row.chargeId)) row.chargeId = null; // the charge was deleted
    return { ...base, manager: str(r.manager, 80), location: str(r.location, 80), charges, statements };
  }
  function cleanSettings(s) { return s && typeof s === 'object' ? { name: str(s.name, 80), ...(typeof s.manager === 'string' ? { manager: str(s.manager, 80) } : {}) } : {}; }

  /* ---------------- receipt reading (AI) ---------------- */
  const AI_PROMPT = (today) => [
    'You are reading a photo for an employee travel expense claim. The photo is either a single receipt, or a screenshot/photo of a bank or credit card statement.',
    'Extract each transaction that should go on the claim. Rules:',
    '- If it is a statement and some rows are marked (red box, highlight, circled, ticked), return only the marked rows. If nothing is marked, return every row that is a taxi/rideshare, car rental, airline baggage fee, fuel or parking charge.',
    '- If it is a single receipt, return exactly one transaction: the final total actually charged (including tax and tip).',
    '- Never guess. If a value is not clearly readable, use null.',
    '- date: the transaction date as YYYY-MM-DD. Today is ' + today + '; if the year is not printed, use the most recent past date that fits.',
    '- amount and currency: the amount and ISO currency code exactly as printed for that charge (e.g. USD for a US receipt, CAD on a Canadian card statement).',
    '- cad: the amount in Canadian dollars ONLY if the document itself shows it (e.g. a Canadian card statement). Do not convert currencies yourself; otherwise null.',
    '- category: one of "taxi" (Uber, Lyft, taxi, rideshare), "rental" (car/vehicle rental), "airfare" (airline baggage / luggage fee), "fuel" (gas station fuel), "parking", "hotel", "meal", "other".',
    '- vendor: short merchant name, e.g. "Uber", "Enterprise", "Air Canada", "Shell".',
    '- payment: the card type and ONLY the last 4 digits if shown (e.g. "Visa 4412", "Amex 1005"), never a full card number; else null.',
    'Reply with only JSON in this shape: {"kind":"receipt"|"statement"|"unreadable","transactions":[{"date":"YYYY-MM-DD"|null,"vendor":string|null,"category":string,"amount":number|null,"currency":string|null,"cad":number|null,"payment":string|null,"note":string|null}]}',
  ].join('\n');

  function normalizeAi(json) {
    const out = [];
    const list = json && Array.isArray(json.transactions) ? json.transactions : [];
    for (const t of list.slice(0, 20)) {
      if (!t || typeof t !== 'object') continue;
      let cat = String(t.category || '').toLowerCase();
      if (cat === 'meal' || cat === 'other') cat = 'misc';
      if (cat === 'uber' || cat === 'rideshare') cat = 'taxi';
      if (cat === 'baggage') cat = 'airfare';
      if (!CAT[cat]) cat = 'misc';
      const num = (x) => (typeof x === 'number' && isFinite(x) ? round2(x) : typeof x === 'string' && x.trim() && isFinite(Number(x.replace(/[$,\s]/g, ''))) ? round2(Number(x.replace(/[$,\s]/g, ''))) : null);
      let cur = typeof t.currency === 'string' ? t.currency.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3) : null;
      if (cur === 'CDN') cur = 'CAD';
      if (cur === 'US') cur = 'USD';
      const amount = num(t.amount);
      const cad = num(t.cad);
      out.push({
        date: isISO(t.date) ? t.date : null,
        vendor: typeof t.vendor === 'string' ? t.vendor.slice(0, 60) : '',
        category: cat,
        amount: amount,
        currency: cur || (cad !== null && amount === null ? 'CAD' : null),
        cad: cur === 'CAD' ? null : cad,
        payment: typeof t.payment === 'string' ? maskPayment(t.payment).slice(0, 40) : '',
        note: typeof t.note === 'string' ? t.note.slice(0, 140) : '',
      });
    }
    return { kind: json && json.kind, transactions: out };
  }

  /* ---------------- bank statements ----------------
     An itemized report carries the card statement pages that show its charges. Claude reads every row
     on a page; each charge on the report is paired with the line that posted to the card (which also
     gives a foreign-currency receipt its CAD); ticked lines not on the report can be added as charges;
     and the pages download as their own PDF, with the lines on the claim listed first. */
  const STATEMENT_PROMPT = (today) => [
    'You are reading one page (a photo, screenshot or PDF page) of a bank or credit card statement, for an employee travel expense claim.',
    'List every transaction row on the page, top to bottom. Rules:',
    '- Never guess. If a value is not clearly readable, use null.',
    '- date: the transaction date as YYYY-MM-DD. Today is ' + today + '; if the year is not printed, use the most recent past date that fits.',
    '- description: the merchant or description as printed, up to 60 characters.',
    '- amount: the amount as a positive number in the statement\'s own currency. currency: that currency\'s ISO code (usually CAD).',
    '- credit: true for payments, refunds and other credits; false for purchases.',
    '- foreign: if the row also shows an original foreign-currency amount (e.g. "USD 26.85"), give it as {"amount": 26.85, "currency": "USD"}; else null.',
    '- category: one of "taxi" (Uber, Lyft, taxi, rideshare), "rental" (car/vehicle rental), "airfare" (airline, including baggage fees), "fuel" (gas station), "parking", "hotel", "meal", "other".',
    '- marked: true only if the row is visibly marked on the image (red box, highlight, circle, tick or arrow); else false.',
    '- card: the card type and ONLY its last 4 digits if shown on the page (e.g. "Visa 4412"), never a full card number; else null.',
    'Reply with only JSON in this shape: {"kind":"statement"|"not_statement"|"unreadable","card":string|null,"rows":[{"date":"YYYY-MM-DD"|null,"description":string|null,"amount":number|null,"currency":string|null,"credit":boolean,"foreign":{"amount":number,"currency":string}|null,"category":string,"marked":boolean}]}',
  ].join('\n');

  const toNum = (x) => (typeof x === 'number' && isFinite(x) ? round2(Math.abs(x)) : typeof x === 'string' && x.trim() && isFinite(Number(x.replace(/[$,\s]/g, ''))) ? round2(Math.abs(Number(x.replace(/[$,\s]/g, '')))) : null);
  const toCur = (x) => { let c = typeof x === 'string' ? x.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3) : ''; if (c === 'CDN') c = 'CAD'; if (c === 'US') c = 'USD'; return /^[A-Z]{3}$/.test(c) ? c : null; };
  function toCat(x) {
    let c = String(x || '').toLowerCase();
    if (c === 'meal' || c === 'other') c = 'misc';
    if (c === 'uber' || c === 'rideshare') c = 'taxi';
    if (c === 'baggage') c = 'airfare';
    return CAT[c] ? c : 'misc';
  }
  // Validates Claude's answer for a statement page and decides which rows start ticked: the rows the
  // person marked on the image if there are any, otherwise the usual claim types. Credits never are.
  function normalizeStatement(json) {
    const list = json && Array.isArray(json.rows) ? json.rows : [];
    const rows = [];
    for (const t of list.slice(0, 80)) {
      if (!t || typeof t !== 'object') continue;
      const f = t.foreign && typeof t.foreign === 'object' ? { amount: toNum(t.foreign.amount), currency: toCur(t.foreign.currency) } : null;
      rows.push({
        date: isISO(t.date) ? t.date : null,
        description: typeof t.description === 'string' ? maskPayment(t.description).slice(0, 60) : '',
        amount: toNum(t.amount), currency: toCur(t.currency), credit: t.credit === true,
        foreign: f && f.amount !== null && f.currency ? f : null,
        category: toCat(t.category), marked: t.marked === true,
      });
    }
    const anyMarked = rows.some(r => r.marked);
    for (const r of rows) r.claim = !r.credit && r.amount !== null && (anyMarked ? r.marked : CAT[r.category].q);
    const kind = ['statement', 'not_statement', 'unreadable'].includes(json && json.kind) ? json.kind : null;
    return { kind, card: json && typeof json.card === 'string' ? maskPayment(json.card).slice(0, 40) : '', rows };
  }

  // Pairs statement rows with the report's charges, so each charge on the claim corresponds to the line
  // that posted to the card. A charge is paired with at most one row.
  //   linked: paired already (the row's chargeId names the charge)
  //   same:   the same CAD amount within 3 days
  //   fx:     a foreign-currency charge whose original amount the row shows (e.g. USD 26.85), within 3 days;
  //           the row's amount is the CAD that posted
  //   cad:    a ticked row that looks like a foreign-currency charge still missing its CAD (same vendor,
  //           within 3 days) but doesn't show the original amount: offered, not applied
  //   dupe:   the same row on another page (a page added twice, overlapping screenshots)
  //   none:   a ticked row that isn't on the report
  // Rows nobody ticked that pair with nothing are left out.
  const words = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(w => w.length >= 3 && !/^\d+$/.test(w) && !['the', 'and', 'inc', 'ltd', 'llc', 'com', 'www', 'trip', 'help', 'pending'].includes(w));
  const sameVendor = (a, b) => { const A = new Set(words(a)); return words(b).some(w => A.has(w) || [...A].some(x => x.startsWith(w) || w.startsWith(x))); };
  const near = (a, b, n) => isISO(a) && isISO(b) && Math.abs(daysBetween(a, b)) <= n;
  const isFx = (c) => !!c.currency && c.currency !== 'CAD';
  function linkStatement(r) {
    const charges = r.charges || [];
    const byId = new Map(charges.map(c => [c.id, c]));
    const used = new Set(), out = new Map(), pageOf = new Map();
    const rows = [];
    (r.statements || []).forEach((p, i) => { for (const row of p.rows || []) if (!row.credit && row.amount !== null) { rows.push(row); pageOf.set(row.id, i); } });
    rows.sort((a, b) => (b.claim ? 1 : 0) - (a.claim ? 1 : 0)); // ticked rows pair first
    const pair = (row, how, c) => { out.set(row.id, { how, charge: c }); used.add(c.id); };
    for (const row of rows) if (row.chargeId && byId.has(row.chargeId) && !used.has(row.chargeId)) pair(row, 'linked', byId.get(row.chargeId));
    for (const row of rows) {
      if (out.has(row.id)) continue;
      const c = charges.find(c => !used.has(c.id) && chargeCAD(c) !== null && Math.abs(chargeCAD(c) - row.amount) < 0.005 && near(c.date, row.date, 3));
      if (c) pair(row, 'same', c);
    }
    for (const row of rows) {
      if (out.has(row.id) || !row.foreign) continue;
      const c = charges.find(c => !used.has(c.id) && isFx(c) && c.currency === row.foreign.currency && c.amount !== null && Math.abs(row.foreign.amount - c.amount) < 0.005 && near(c.date, row.date, 3));
      if (c) pair(row, 'fx', c);
    }
    for (const row of rows) {
      if (out.has(row.id) || !row.claim) continue;
      const fx = charges.filter(c => !used.has(c.id) && isFx(c) && (c.cad === null || c.cad === undefined) && near(c.date, row.date, 3) && sameVendor(c.vendor, row.description));
      const rivals = fx.length === 1 ? rows.filter(x => x !== row && !out.has(x.id) && x.claim && near(fx[0].date, x.date, 3) && sameVendor(fx[0].vendor, x.description)) : [];
      if (fx.length === 1 && !rivals.length) pair(row, 'cad', fx[0]);
    }
    const key = (row) => [row.date, row.amount, String(row.description || '').toLowerCase()].join('|');
    const seen = new Map();
    for (const row of rows) { const l = out.get(row.id); if (l && !seen.has(key(row))) seen.set(key(row), { charge: l.charge, page: pageOf.get(row.id) }); }
    for (const row of rows) {
      if (out.has(row.id) || !row.claim) continue;
      const s = seen.get(key(row));
      out.set(row.id, s && s.page !== pageOf.get(row.id) ? { how: 'dupe', charge: s.charge } : { how: 'none', charge: null });
    }
    return out;
  }
  const PAIRED = ['linked', 'same', 'fx'];
  // The report against its statement: which charges are on it (and whether the amounts agree), which
  // aren't, and which ticked rows aren't on the report
  function statementCheck(r) {
    const pages = r.statements || [];
    const links = linkStatement(r);
    const onStatement = new Map();
    pages.forEach((p, i) => (p.rows || []).forEach(row => {
      const l = links.get(row.id);
      if (!l || !PAIRED.includes(l.how) || onStatement.has(l.charge.id)) return;
      const v = chargeCAD(l.charge);
      const cadRow = (row.currency || 'CAD') === 'CAD';
      onStatement.set(l.charge.id, { row, page: i + 1, how: l.how, mismatch: cadRow && v !== null && Math.abs(v - row.amount) >= 0.005 });
    }));
    const ready = pages.length > 0 && !pages.some(p => p.ai === 'reading' || p.ai === 'processing');
    const charges = r.charges || [];
    const missing = ready ? charges.filter(c => !onStatement.has(c.id) && c.ai !== 'reading' && c.ai !== 'processing') : [];
    const rows = pages.flatMap(p => p.rows || []);
    const of = (how) => rows.filter(x => links.get(x.id) && links.get(x.id).how === how);
    return { links, onStatement, ready, missing, unlisted: of('none'), suggestions: of('cad'), mismatches: [...onStatement.values()].filter(x => x.mismatch) };
  }
  const hasReceipt = (c) => !!c.imageId;
  const isBusy = (c) => c.ai === 'processing' || c.ai === 'reading';
  const allRows = (r) => (r.statements || []).flatMap(p => p.rows || []);
  // A charge and a statement line are the same transaction: the same CAD within 3 days, or the line
  // shows the receipt's original foreign amount
  function sameTransaction(c, row) {
    if (row.amount === null || !near(c.date, row.date, 3)) return false;
    const v = chargeCAD(c);
    if (v !== null && Math.abs(v - row.amount) < 0.005) return true;
    return !!(row.foreign && isFx(c) && c.currency === row.foreign.currency && c.amount !== null && Math.abs(row.foreign.amount - c.amount) < 0.005);
  }
  // A receipt joins the charge its statement line put on the report: the receipt's details and photo,
  // the CAD that posted (for a foreign-currency receipt), and the OK already given, as one charge.
  function attachReceipt(r, stmtChargeId, receiptChargeId) {
    const S = (r.charges || []).find(c => c.id === stmtChargeId), R = (r.charges || []).find(c => c.id === receiptChargeId);
    if (!S || !R || S === R) return r;
    const line = allRows(r).find(x => x.chargeId === S.id);
    const cad = isFx(R) && (R.cad === null || R.cad === undefined) && line && (line.currency || 'CAD') === 'CAD' ? line.amount : R.cad;
    const merged = { ...R, cad, date: R.date || S.date, category: R.category || S.category, approved: !!(R.approved || S.approved), fromStatement: false };
    return {
      ...r,
      charges: r.charges.filter(c => c.id !== R.id).map(c => (c.id === S.id ? merged : c)),
      statements: r.statements.map(p => (p.rows.some(x => x.chargeId === S.id) ? { ...p, rows: p.rows.map(x => (x.chargeId === S.id ? { ...x, chargeId: R.id, claim: true } : x)) } : p)),
    };
  }
  // Keeps the report and its statement in step, on every change:
  //   1. a receipt that matches a line already on the report (as a charge with no receipt) joins that charge
  //   2. charges and lines with the same amount are paired, and a foreign-currency receipt gets the CAD
  //      that posted
  //   3. a ticked line that isn't on the report goes on it, as a charge with no receipt
  // Returns the same report when nothing changes.
  let idSeq = 0;
  const defaultId = () => 'c' + Date.now().toString(36) + (idSeq++).toString(36) + Math.random().toString(36).slice(2, 5);
  function reconcile(r, newId = defaultId) {
    if (!r || r.type !== 'itemized' || !(r.statements || []).length) return r;
    let out = r;
    // 1.
    for (const row of allRows(out)) {
      if (!row.chargeId) continue;
      const S = out.charges.find(c => c.id === row.chargeId);
      if (!S || hasReceipt(S) || !S.fromStatement) continue;
      const linked = new Set(allRows(out).map(x => x.chargeId).filter(Boolean));
      const R = out.charges.find(c => c.id !== S.id && hasReceipt(c) && !isBusy(c) && !linked.has(c.id) && sameTransaction(c, row));
      if (R) out = attachReceipt(out, S.id, R.id);
    }
    // 2.
    let links = linkStatement(out);
    const fill = new Map();
    let changed = out !== r;
    const pairRows = (fn) => out.statements.map(p => {
      let pc = false;
      const rows = (p.rows || []).map(row => { const n = fn(row); if (n !== row) pc = true; return n; });
      if (pc) changed = true;
      return pc ? { ...p, rows } : p;
    });
    let statements = pairRows(row => {
      const l = links.get(row.id);
      if (!l || !PAIRED.includes(l.how)) return row;
      if (l.how === 'fx' && (row.currency || 'CAD') === 'CAD' && (l.charge.cad === null || l.charge.cad === undefined)) fill.set(l.charge.id, row.amount);
      return row.chargeId === l.charge.id && row.claim ? row : { ...row, claim: true, chargeId: l.charge.id };
    });
    let charges = fill.size ? out.charges.map(c => (fill.has(c.id) ? { ...c, cad: fill.get(c.id) } : c)) : out.charges;
    if (fill.size) changed = true;
    out = { ...out, charges, statements };
    // 3.
    links = linkStatement(out);
    const added = [];
    statements = pairRows(row => {
      const l = links.get(row.id);
      if (!l || l.how !== 'none' || row.amount === null) return row;
      const id = newId();
      added.push(chargeFromRow(row, id));
      return { ...row, chargeId: id };
    });
    if (added.length) out = { ...out, charges: [...out.charges, ...added], statements };
    return changed || added.length ? out : r;
  }
  // Receipts the report is missing: every charge with no receipt photo, wherever it came from
  function missingReceipts(r) { return (r.charges || []).filter(c => !hasReceipt(c) && !isBusy(c)); }
  // A ticked line on the report as a charge with no receipt, and a receipt that isn't on the statement,
  // with the same vendor within 3 days but no amount to prove they're the same: offered, not applied
  function receiptSuggestions(r) {
    const rows = allRows(r);
    const linked = new Set(rows.map(x => x.chargeId).filter(Boolean));
    const out = [];
    for (const row of rows) {
      const S = row.chargeId && (r.charges || []).find(c => c.id === row.chargeId);
      if (!S || hasReceipt(S) || !S.fromStatement) continue;
      const cands = (r.charges || []).filter(c => hasReceipt(c) && !isBusy(c) && !linked.has(c.id) && near(c.date, row.date, 3) && sameVendor(c.vendor, row.description));
      if (cands.length === 1 && !out.some(x => x.receipt.id === cands[0].id)) out.push({ row, charge: S, receipt: cands[0] });
    }
    return out;
  }
  // The charge a ticked line becomes when it isn't on the report yet
  function chargeFromRow(row, id) {
    const cur = row.currency || 'CAD';
    return { id, date: isISO(row.date) ? row.date : null, vendor: String(row.description || '').slice(0, 60), category: CAT[row.category] ? row.category : '',
      amount: row.amount, currency: cur, cad: null, approved: false, imageId: null, ai: 'read', checked: false, payment: '', fromStatement: true,
      aiNote: 'From your card statement, with no receipt yet. Check the details, and attach the receipt if you have it.' };
  }
  // Rows for the statement PDF's list: every row on the claim (ticked or paired), in date order, with
  // the charge it corresponds to
  function statementList(r) {
    const links = linkStatement(r);
    const out = [];
    (r.statements || []).forEach((p, pi) => (p.rows || []).forEach(row => {
      const l = links.get(row.id);
      if (l && l.how === 'dupe') return;
      const paired = l && PAIRED.includes(l.how);
      if (!row.claim && !paired) return;
      out.push({ page: pi + 1, row, charge: paired ? l.charge : null, how: l ? l.how : 'none' });
    }));
    out.sort((a, b) => String(a.row.date || '9999').localeCompare(String(b.row.date || '9999')) || a.page - b.page);
    return out;
  }

  // The statement PDF: the statement lines on the claim listed first, each with the charge it
  // corresponds to, then any charges not found on the statement, then each statement page.
  function pdfStatement(doc, { heading, sub, items, missing, pages, fresh }) {
    const [PW, PH] = LETTER_P;
    const M = 40;
    const ink = () => doc.setTextColor(20, 24, 32);
    let first = true;
    const newPage = () => { if (!(fresh && first)) doc.addPage('letter', 'portrait'); first = false; };
    const top = (label) => {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11); ink(); doc.text(heading, M, M);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(110, 110, 110); doc.text(label, PW - M, M, { align: 'right' });
      doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.5); doc.line(M, M + 8, PW - M, M + 8);
    };
    // 1. the list of claimed statement charges
    newPage(); top('Bank statement charges');
    let y = M + 30;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); ink();
    for (const t of sub) { doc.text(t, M, y); y += 12; }
    y += 8;
    const cur = items.length && items[0].row.currency ? items[0].row.currency : 'CAD';
    const amt = (n, c) => (c && c !== cur ? c + ' ' : '') + round2(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const cols = [{ k: 'Date', x: M, w: 62 }, { k: 'Description', x: M + 62, w: 196 }, { k: 'Amount (' + cur + ')', x: M + 258, w: 74, right: true }, { k: 'On the claim as', x: M + 344, w: PW - 2 * M - 344 }];
    const head = () => {
      doc.setFillColor(238, 241, 244); doc.rect(M, y - 10, PW - 2 * M, 15, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); ink();
      for (const c of cols) doc.text(c.k, c.right ? c.x + c.w : c.x + 2, y, c.right ? { align: 'right' } : undefined);
      y += 15; doc.setFont('helvetica', 'normal');
    };
    if (!items.length) {
      doc.setTextColor(110, 110, 110); doc.text('No charges on these statement pages are on the claim.', M, y); y += 14;
    } else {
      head();
      let total = 0;
      for (const it of items) {
        const r = it.row, c = it.charge;
        const v = c ? chargeCAD(c) : null;
        const off = c && (r.currency || 'CAD') === 'CAD' && v !== null && Math.abs(v - r.amount) >= 0.005;
        const claimAs = c ? (CAT[c.category] ? CAT[c.category].label : 'Charge') + (c.vendor ? ', ' + c.vendor : '') + (isISO(c.date) ? ', week ending ' + fmtDDMonYY(saturdayOf(c.date)) : '') + (off ? '. The report has ' + amt(v, 'CAD') : '') + (c.imageId ? '' : '. No receipt') : 'Not on the report';
        const desc = doc.splitTextToSize((r.description || '—') + (r.foreign ? ' (' + r.foreign.currency + ' ' + r.foreign.amount.toFixed(2) + ')' : ''), cols[1].w - 6);
        const claim = doc.splitTextToSize(claimAs + ' · page ' + it.page, cols[3].w - 4);
        const h = Math.max(desc.length, claim.length) * 10.5 + 4;
        if (y + h > PH - M - 30) { newPage(); top('Bank statement charges (continued)'); y = M + 30; head(); }
        doc.setFontSize(8.5); ink();
        doc.text(r.date ? fmtNice(r.date) : '—', cols[0].x + 2, y);
        desc.forEach((t, k) => doc.text(t, cols[1].x + 2, y + k * 10.5));
        doc.text(r.amount !== null ? amt(r.amount, r.currency) : '—', cols[2].x + cols[2].w, y, { align: 'right' });
        if (!c || off || !c.imageId) doc.setTextColor(170, 60, 40);
        claim.forEach((t, k) => doc.text(t, cols[3].x + 2, y + k * 10.5));
        doc.setDrawColor(225, 225, 225); doc.line(M, y + h - 8, PW - M, y + h - 8);
        y += h;
        if (r.amount !== null && (r.currency || cur) === cur) total += r.amount;
      }
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); ink();
      doc.text('Total of the charges listed', cols[1].x + 2, y + 4);
      doc.text(amt(total, cur), cols[2].x + cols[2].w, y + 4, { align: 'right' });
      y += 20;
    }
    if (missing && missing.length) {
      if (y + 40 > PH - M) { newPage(); top('Bank statement charges (continued)'); y = M + 30; }
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(170, 60, 40);
      doc.text('On the report but not found on these statement pages', M, y); y += 13;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); ink();
      for (const t of missing) {
        if (y > PH - M - 20) { newPage(); top('Bank statement charges (continued)'); y = M + 30; doc.setFontSize(8.5); ink(); }
        doc.text(t, M + 2, y); y += 11;
      }
      y += 8;
    }
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(110, 110, 110);
    doc.text(pages.length ? 'The statement page' + (pages.length > 1 ? 's follow' : ' follows') + '.' : 'No statement pages attached.', M, Math.min(y, PH - M));
    // 2. the statement pages
    pages.forEach((p, i) => {
      newPage(); top('Statement page ' + (i + 1) + ' of ' + pages.length + (p.label ? ' · ' + p.label : ''));
      const yy = M + 22, maxW = PW - 2 * M, maxH = PH - M - yy;
      if (!p.data) { doc.setFontSize(9); doc.setTextColor(150, 150, 150); doc.text('This page’s image couldn’t be loaded.', M, yy + 14); return; }
      const sc = Math.min(maxW / p.w, maxH / p.h);
      const w = p.w * sc, h = p.h * sc, x = M + (maxW - w) / 2;
      doc.setDrawColor(210, 210, 210); doc.setLineWidth(0.5); doc.rect(x - 0.5, yy - 0.5, w + 1, h + 1, 'S');
      doc.addImage(p.data, 'JPEG', x, yy, w, h, undefined, 'FAST');
    });
  }

  function cleanStatementPage(p) {
    if (!p || typeof p !== 'object' || typeof p.id !== 'string' || !ID.test(p.id)) return null;
    const interrupted = p.ai === 'reading' || p.ai === 'processing';
    const rows = (Array.isArray(p.rows) ? p.rows : []).slice(0, 120).map(r => {
      if (!r || typeof r !== 'object' || typeof r.id !== 'string' || !ID.test(r.id)) return null;
      const f = r.foreign && typeof r.foreign === 'object' && num(r.foreign.amount) !== null && toCur(r.foreign.currency) ? { amount: num(r.foreign.amount), currency: toCur(r.foreign.currency) } : null;
      return { id: r.id, date: isISO(r.date) ? r.date : null, description: maskPayment(str(r.description, 60)), amount: num(r.amount), currency: toCur(r.currency),
        credit: r.credit === true, foreign: f, category: CAT[r.category] ? r.category : 'misc', marked: r.marked === true, claim: r.claim === true,
        chargeId: typeof r.chargeId === 'string' && ID.test(r.chargeId) ? r.chargeId : null, source: r.source === 'you' ? 'you' : 'ai' };
    }).filter(Boolean);
    return { id: p.id, imageId: typeof p.imageId === 'string' && ID.test(p.imageId) ? p.imageId : null, name: str(p.name, 80),
      group: typeof p.group === 'string' && ID.test(p.group) ? p.group : p.id, orig: p.orig === true,
      w: num(p.w) || 0, h: num(p.h) || 0, card: maskPayment(str(p.card, 40)),
      ai: interrupted ? 'failed' : (p.ai === 'read' || p.ai === 'failed' ? p.ai : null),
      aiNote: interrupted ? 'Reading this page was interrupted. Tick and fill in the charges yourself.' : str(p.aiNote, 200), rows };
  }

  const api = {
    MON, DOW, DOW3, PD, CATS, CAT, DAYCOL,
    isISO, parse, iso, addDays, dow, saturdayOf, sundayOf, daysBetween, serial, fmtDDMonYY, fmtMonD, fmtNice, fmtLong, weekTitle,
    round2, money,
    perDiemProblems, perDiemWeeks, perDiemSummary, perDiemCells, perDiemXlsx,
    chargeCAD, chargeIssue, itemizedProblems, itemizedWeeks, itemizedSummary, itemizedCells, itemizedXlsx,
    fileBase, safeName, receiptList, formatCell, drawSheet, pdfForms, pdfReceipts,
    AI_PROMPT, normalizeAi, maskPayment, cleanReport, cleanCharge, cleanSettings,
    STATEMENT_PROMPT, normalizeStatement, linkStatement, statementCheck, reconcile, attachReceipt, missingReceipts, receiptSuggestions, chargeFromRow, statementList, pdfStatement, cleanStatementPage,
    _internal: { parseSheet, serializeSheet, SST, applyCell },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ExpenseCore = api;
})(typeof window !== 'undefined' ? window : globalThis);
