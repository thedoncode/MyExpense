"""Clean an Excel template before it goes into templates/.

Removes what identifies the people and computers that edited it, and nothing else:
  - the author and last-modified-by names and the last-printed date (docProps/core.xml)
  - the local folder the file was saved from (xl/workbook.xml)
  - printer settings, which can carry printer and user names (xl/printerSettings/*.bin)
  - values in the cells passed with --clear, such as a pre-filled person's name
And, with --date, gives a cell the app fills with a date the template's own date format.
  - shared strings no cell uses any more, so cleared text doesn't stay in the file

Every other part is copied byte for byte, so layout, styles and formulas are unchanged.

  python3 tools/clean_template.py NEW.xlsx templates/itemized-expense-claim.xlsx --clear 1:N5 --date 1:N2
  python3 tools/clean_template.py NEW.xlsx templates/perdiem-travel-expense.xlsx
"""
import argparse, re, sys, zipfile

REL_PRINTER = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/printerSettings'


def clean(src, dst, clears, dates=()):
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
    a = ap.parse_args()
    for r in clean(a.src, a.dst, a.clear, a.date):
        print('removed', r)
