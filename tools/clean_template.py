"""Clean an Excel template before it goes into templates/.

Removes what identifies the people and computers that edited it, and nothing else:
  - the author and last-modified-by names and the last-printed date (docProps/core.xml)
  - the local folder the file was saved from (xl/workbook.xml)
  - printer settings, which can carry printer and user names (xl/printerSettings/*.bin)
  - values in the cells passed with --clear, such as a pre-filled person's name
  - shared strings no cell uses any more, so cleared text doesn't stay in the file

Two optional fixes:
  --date SHEET:CELL         gives a cell the app fills with a date the template's own date format
  --delete-rows SHEET:A-B   removes rows A to B the way Excel's "Delete rows" does: everything below
                            moves up, and formulas, merged cells, conditional formatting, data
                            validation and the sheet's other ranges follow. Ranges that ran into the
                            removed rows are shortened. Excel rebuilds its calculation chain on open.

Every other part is copied byte for byte, so layout, styles and formulas are otherwise unchanged.

  python3 tools/clean_template.py NEW.xlsx templates/itemized-expense-claim.xlsx --clear 1:N5 --date 1:N2
  python3 tools/clean_template.py NEW.xlsx templates/perdiem-travel-expense.xlsx --delete-rows 1:22-42
"""
import argparse, re, sys, zipfile

REL_PRINTER = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/printerSettings'
REF = re.compile(r"(?<![A-Za-z0-9_.])((?:'(?:[^']|'')+'|[A-Za-z_][A-Za-z0-9_.]*)!)?(\$?[A-Z]{1,3}\$?\d+)(?::(\$?[A-Z]{1,3}\$?\d+))?(?![A-Za-z0-9_(!])")
CELL = re.compile(r'^(\$?[A-Z]{1,3}\$?)(\d+)$')


class Rows:
    """Row arithmetic for deleting rows first..last of one sheet."""
    def __init__(self, first, last, sheet_name):
        self.first, self.last, self.n = first, last, last - first + 1
        self.names = {"'%s'!" % sheet_name.replace("'", "''"), sheet_name + '!'}

    def row(self, r):
        return None if self.first <= r <= self.last else (r - self.n if r > self.last else r)

    def cell(self, ref):
        col, r = CELL.match(ref).groups()
        nr = self.row(int(r))
        return None if nr is None else col + str(nr)

    def span(self, a, b):
        """A range a:b (cell refs); None when it lies wholly in the removed rows."""
        ca, ra = CELL.match(a).groups()
        cb, rb = CELL.match(b).groups()
        ra, rb = int(ra), int(rb)
        na = self.row(ra) if not (self.first <= ra <= self.last) else self.first
        nb = self.row(rb) if not (self.first <= rb <= self.last) else self.first - 1
        if nb < na:
            return None
        return ca + str(na), cb + str(nb)

    def sqref(self, value):
        """A space-separated list of cells and ranges; '' when nothing is left."""
        out = []
        for part in value.split():
            if ':' in part:
                s = self.span(*part.split(':'))
                if s:
                    out.append('%s:%s' % s)
            else:
                c = self.cell(part)
                if c:
                    out.append(c)
        return ' '.join(out)

    def formula(self, f, own_sheet=True):
        """Shift the references in a formula. own_sheet: refs without a sheet name are on this sheet."""
        segs = f.split('"')
        for i in range(0, len(segs), 2):  # outside string literals
            def sub(m):
                pre, a, b = m.group(1), m.group(2), m.group(3)
                mine = (pre in self.names) if pre else own_sheet
                if not mine:
                    return m.group(0)
                if b:
                    s = self.span(a, b)
                    return (pre or '') + ('%s:%s' % s if s else '#REF!')
                c = self.cell(a)
                return (pre or '') + (c if c else '#REF!')
            segs[i] = REF.sub(sub, segs[i])
        return '"'.join(segs)


def unescape(t):
    return t.replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"').replace('&apos;', "'").replace('&amp;', '&')


def escape(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def delete_rows(parts, removed, sheet_no, first, last):
    text = lambda p: parts[p].decode('utf-8')
    path = 'xl/worksheets/sheet%s.xml' % sheet_no
    # which sheet name is sheetN.xml
    rels = dict(re.findall(r'<Relationship\b[^>]*Id="([^"]+)"[^>]*Target="(?:/xl/)?([^"]+)"', text('xl/_rels/workbook.xml.rels')))
    rels.update({k: v for v, k in re.findall(r'<Relationship\b[^>]*Target="(?:/xl/)?([^"]+)"[^>]*Id="([^"]+)"', text('xl/_rels/workbook.xml.rels'))})
    name = None
    for m in re.finditer(r'<sheet\b[^>]*/>', text('xl/workbook.xml')):
        a = dict(re.findall(r'([\w:]+)="([^"]*)"', m.group(0)))
        if rels.get(a.get('r:id')) == 'worksheets/sheet%s.xml' % sheet_no:
            name = unescape(a['name'])
    if name is None:
        sys.exit('no sheet for %s' % path)
    R = Rows(first, last, name)
    fx = lambda f, own=True: escape(R.formula(unescape(f), own))

    sx = text(path)
    # a shared formula whose first cell is removed would orphan the rest of its group
    for m in re.finditer(r'<c r="[A-Z]+(\d+)"[^>]*>\s*<f\b[^>]*t="shared"[^>]*\bref="[^"]+"', sx):
        if first <= int(m.group(1)) <= last:
            sys.exit('a shared formula starts in a removed row (%s); remove fewer rows' % m.group(0)[:60])

    def cell_xml(m):
        c = m.group(0)
        ref = re.match(r'<c r="([A-Z]+\d+)"', c).group(1)
        c = c.replace('<c r="%s"' % ref, '<c r="%s"' % R.cell(ref), 1)
        c = re.sub(r'(<f\b[^>]*\bref=")([^"]+)(")', lambda k: k.group(1) + R.sqref(k.group(2)) + k.group(3), c)
        c = re.sub(r'(<f\b[^>]*>)(.*?)(</f>)', lambda k: k.group(1) + fx(k.group(2)) + k.group(3), c, flags=re.S)
        return c

    def row_xml(m):
        r = int(m.group(1))
        nr = R.row(r)
        if nr is None:
            return ''
        body = m.group(0).replace('<row r="%d"' % r, '<row r="%d"' % nr, 1)
        return re.sub(r'<c r="[A-Z]+\d+"[^>]*?(?:/>|>.*?</c>)', cell_xml, body, flags=re.S)

    head, data, tail = re.match(r'(.*<sheetData>)(.*)(</sheetData>.*)', sx, re.S).groups()
    data = re.sub(r'<row r="(\d+)"[^>]*?(?:/>|>.*?</row>)', row_xml, data, flags=re.S)

    def fix_attr(xml, tag, attr, kind='sqref'):
        def sub(m):
            v = m.group(2)
            nv = R.sqref(v) if kind == 'sqref' else (R.cell(v) or R.cell(re.sub(r'\d+$', str(first - 1), v)))
            return m.group(1) + nv + m.group(3)
        return re.sub(r'(<%s\b[^>]*\b%s=")([^"]*)(")' % (tag, attr), sub, xml)

    head = fix_attr(head, 'dimension', 'ref')
    head = fix_attr(head, 'selection', 'sqref')
    head = fix_attr(head, 'selection', 'activeCell', 'cell')
    head = fix_attr(head, 'pane', 'topLeftCell', 'cell')
    for tag in ('mergeCell', 'hyperlink', 'ignoredError', 'conditionalFormatting', 'dataValidation', 'protectedRange'):
        tail = fix_attr(tail, tag, 'ref' if tag in ('mergeCell', 'hyperlink') else 'sqref')
    tail = re.sub(r'(<xm:sqref>)([^<]*)(</xm:sqref>)', lambda m: m.group(1) + R.sqref(m.group(2)) + m.group(3), tail)
    tail = re.sub(r'(<(formula|formula1|formula2|xm:f)>)([^<]*)(</\2>)', lambda m: m.group(1) + fx(m.group(3)) + m.group(4), tail)
    # drop what no longer covers any cell, and fix the counts
    tail = re.sub(r'<mergeCell ref=""/>', '', tail)
    tail = re.sub(r'<hyperlink\b[^>]*ref=""[^>]*/>', '', tail)
    tail = re.sub(r'<ignoredError sqref=""[^>]*/>', '', tail)
    tail = re.sub(r'<conditionalFormatting\b[^>]*sqref=""[^>]*>.*?</conditionalFormatting>', '', tail, flags=re.S)
    tail = re.sub(r'<dataValidation\b[^>]*sqref=""[^>]*(?:/>|>.*?</dataValidation>)', '', tail, flags=re.S)
    tail = re.sub(r'<x14:dataValidation\b(?:(?!</x14:dataValidation>).)*<xm:sqref></xm:sqref>\s*</x14:dataValidation>', '', tail, flags=re.S)
    for outer, inner in (('mergeCells', 'mergeCell'), ('dataValidations', 'dataValidation'), ('x14:dataValidations', 'x14:dataValidation'), ('hyperlinks', 'hyperlink')):
        def recount(m):
            n = len(re.findall(r'<%s\b' % inner, m.group(0)))
            return re.sub(r'\scount="\d+"', ' count="%d"' % n, m.group(0), count=1) if n else ''
        tail = re.sub(r'<%s\b[^>]*>.*?</%s>' % (outer, outer), recount, tail, flags=re.S)
    tail = re.sub(r'<rowBreaks\b.*?</rowBreaks>', lambda m: re.sub(r'(<brk id=")(\d+)(")', lambda k: k.group(1) + str(R.row(int(k.group(2))) or first - 1) + k.group(3), m.group(0)), tail, flags=re.S)
    parts[path] = (head + data + tail).encode('utf-8')

    # other sheets and defined names that point at this sheet
    for p in [p for p in parts if re.match(r'xl/worksheets/sheet\d+\.xml$', p) and p != path]:
        o = text(p)
        n = re.sub(r'(<f\b[^>]*>)(.*?)(</f>)', lambda k: k.group(1) + fx(k.group(2), False) + k.group(3), o, flags=re.S)
        if n != o:
            parts[p] = n.encode('utf-8')
    wb = text('xl/workbook.xml')
    parts['xl/workbook.xml'] = re.sub(r'(<definedName\b[^>]*>)([^<]*)(</definedName>)', lambda k: k.group(1) + fx(k.group(2), False) + k.group(3), wb).encode('utf-8')
    srels = parts.get('xl/worksheets/_rels/sheet%s.xml.rels' % sheet_no, b'').decode('utf-8')
    if re.search(r'/(drawing|vmlDrawing|comments|table)"', srels):
        sys.exit('this sheet has drawings, comments or tables; moving them is not supported')

    # Excel rebuilds the calculation chain when it's missing
    if 'xl/calcChain.xml' in parts:
        del parts['xl/calcChain.xml']
        parts['xl/_rels/workbook.xml.rels'] = re.sub(r'<Relationship\b[^>]*Target="[^"]*calcChain\.xml"[^>]*/>', '', text('xl/_rels/workbook.xml.rels')).encode('utf-8')
        parts['[Content_Types].xml'] = re.sub(r'<Override PartName="/xl/calcChain\.xml"[^>]*/>', '', text('[Content_Types].xml')).encode('utf-8')
        removed.append('xl/calcChain.xml (Excel rebuilds it)')
    removed.append('rows %d-%d of %s' % (first, last, name))


def clean(src, dst, clears, dates=(), deletes=()):
    zin = zipfile.ZipFile(src)
    parts = {i.filename: zin.read(i.filename) for i in zin.infolist()}
    infos = {i.filename: i for i in zin.infolist()}
    text = lambda p: parts[p].decode('utf-8')
    removed = []

    # names and dates of whoever edited it
    if 'docProps/core.xml' in parts:
        core = text('docProps/core.xml')
        for tag in ('dc:creator', 'cp:lastModifiedBy'):
            core = re.sub(r'<%s>[^<]*</%s>' % (tag, tag), '<%s></%s>' % (tag, tag), core)
        core = re.sub(r'<cp:lastPrinted>[^<]*</cp:lastPrinted>', '', core)
        parts['docProps/core.xml'] = core.encode('utf-8')

    # the folder it was saved from
    wb = text('xl/workbook.xml')
    wb = re.sub(r'<mc:AlternateContent\b[^>]*>\s*<mc:Choice Requires="x15">\s*<x15ac:absPath\b[^>]*/>\s*</mc:Choice>\s*</mc:AlternateContent>', '', wb)
    parts['xl/workbook.xml'] = wb.encode('utf-8')

    # printer settings: the parts, their relationships, and the r:id that points at them
    for p in [p for p in parts if p.startswith('xl/printerSettings/')]:
        del parts[p]
        removed.append(p)
    for relp in [p for p in parts if re.match(r'xl/worksheets/_rels/sheet\d+\.xml\.rels$', p)]:
        rels = text(relp)
        ids = re.findall(r'<Relationship\b[^>]*Id="([^"]+)"[^>]*Type="%s"[^>]*/>' % re.escape(REL_PRINTER), rels)
        ids += re.findall(r'<Relationship\b[^>]*Type="%s"[^>]*Id="([^"]+)"[^>]*/>' % re.escape(REL_PRINTER), rels)
        if not ids:
            continue
        rels = re.sub(r'<Relationship\b[^>]*Type="%s"[^>]*/>' % re.escape(REL_PRINTER), '', rels)
        sheet = relp.replace('_rels/', '').replace('.rels', '')
        sx = text(sheet)
        for rid in ids:
            sx = re.sub(r'(<pageSetup\b[^>]*?)\s+r:id="%s"' % re.escape(rid), r'\1', sx)
        parts[sheet] = sx.encode('utf-8')
        if re.search(r'<Relationship\b', rels):
            parts[relp] = rels.encode('utf-8')
        else:
            del parts[relp]
            removed.append(relp)
    ct = text('[Content_Types].xml')
    ct = re.sub(r'<Override PartName="/xl/printerSettings/[^"]*"[^>]*/>', '', ct)
    if not any(p.endswith('.bin') for p in parts):
        ct = re.sub(r'<Default Extension="bin"[^>]*/>', '', ct)
    parts['[Content_Types].xml'] = ct.encode('utf-8')

    # cleared cells keep their style, lose their value
    sheets = sorted((p for p in parts if re.match(r'xl/worksheets/sheet\d+\.xml$', p)), key=lambda p: int(re.search(r'(\d+)\.xml$', p).group(1)))
    for spec in clears:
        n, ref = spec.split(':')
        p = 'xl/worksheets/sheet%s.xml' % n
        sx = text(p)
        pat = re.compile(r'<c r="%s"([^>]*?)(/>|>.*?</c>)' % re.escape(ref))
        m = pat.search(sx)
        if not m:
            sys.exit('cell %s not found in %s' % (ref, p))
        attrs = re.sub(r'\s+t="[^"]*"', '', m.group(1))
        sx = sx[:m.start()] + '<c r="%s"%s/>' % (ref, attrs) + sx[m.end():]
        parts[p] = sx.encode('utf-8')

    for spec in deletes:
        n, rr = spec.split(':')
        a, b = (int(x) for x in rr.split('-'))
        delete_rows(parts, removed, n, a, b)

    # date cells left as "General" get the template's own d-mmm-yy format, keeping the rest of their style
    if dates:
        st = text('xl/styles.xml')
        fmts = dict((m.group(2), m.group(1)) for m in re.finditer(r'<numFmt numFmtId="(\d+)" formatCode="([^"]*)"/>', st))
        fid = next((i for code, i in fmts.items() if re.search(r'd\\?-mmm\\?-yy', code)), '15')
        block = re.search(r'<cellXfs count="\d+">(.*?)</cellXfs>', st, re.S)
        xfs = re.findall(r'<xf\b[^>]*/>|<xf\b[^>]*>.*?</xf>', block.group(1), re.S)
        for spec in dates:
            n, ref = spec.split(':')
            p = 'xl/worksheets/sheet%s.xml' % n
            sx = text(p)
            m = re.search(r'<c r="%s"([^>]*?)(/>|>)' % re.escape(ref), sx)
            if not m:
                sys.exit('cell %s not found in %s' % (ref, p))
            sm = re.search(r'\ss="(\d+)"', m.group(1))
            xf = xfs[int(sm.group(1)) if sm else 0]
            xf = re.sub(r'numFmtId="\d+"', 'numFmtId="%s"' % fid, xf, count=1)
            xf = xf if 'applyNumberFormat=' in xf else xf.replace('<xf ', '<xf applyNumberFormat="1" ', 1)
            xfs.append(xf)
            attrs = re.sub(r'\ss="\d+"', '', m.group(1)) + ' s="%d"' % (len(xfs) - 1)
            sx = sx[:m.start()] + '<c r="%s"%s%s' % (ref, attrs, m.group(2)) + sx[m.end():]
            parts[p] = sx.encode('utf-8')
        st = st[:block.start()] + '<cellXfs count="%d">%s</cellXfs>' % (len(xfs), ''.join(xfs)) + st[block.end():]
        parts['xl/styles.xml'] = st.encode('utf-8')

    # drop shared strings nothing uses, renumbering the rest
    if 'xl/sharedStrings.xml' in parts:
        sst = text('xl/sharedStrings.xml')
        head = sst[:sst.index('<si>')] if '<si>' in sst else sst
        items = re.findall(r'<si>.*?</si>', sst, re.S)
        cell = re.compile(r'(<c\b[^>]*\bt="s"[^>]*>)<v>(\d+)</v>')
        used, remap, refs = [], {}, 0
        for p in sheets:
            def sub(m):
                nonlocal refs
                refs += 1
                i = int(m.group(2))
                if i not in remap:
                    remap[i] = len(used)
                    used.append(items[i])
                return m.group(1) + '<v>%d</v>' % remap[i]
            parts[p] = cell.sub(sub, text(p)).encode('utf-8')
        head = re.sub(r'\scount="\d+"', ' count="%d"' % refs, head)
        head = re.sub(r'\suniqueCount="\d+"', ' uniqueCount="%d"' % len(used), head)
        parts['xl/sharedStrings.xml'] = (head + ''.join(used) + '</sst>').encode('utf-8')
        if len(used) < len(items):
            removed.append('%d unused shared strings' % (len(items) - len(used)))

    with zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as zout:
        for name, info in infos.items():
            if name in parts:
                zi = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
                zi.compress_type = zipfile.ZIP_DEFLATED
                zout.writestr(zi, parts[name])
    return removed


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('src')
    ap.add_argument('dst')
    ap.add_argument('--clear', action='append', default=[], metavar='SHEET:CELL', help='empty a cell, e.g. 1:N5 (sheet number as in xl/worksheets/sheetN.xml)')
    ap.add_argument('--date', action='append', default=[], metavar='SHEET:CELL', help='give a cell the template\'s d-mmm-yy date format, e.g. 1:N2')
    ap.add_argument('--delete-rows', action='append', default=[], metavar='SHEET:A-B', help='remove rows A to B, e.g. 1:22-42')
    a = ap.parse_args()
    for r in clean(a.src, a.dst, a.clear, a.date, a.delete_rows):
        print('removed', r)
