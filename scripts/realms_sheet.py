#!/usr/bin/env python3
"""Write docs/pinpoint_realms.xlsx from src/: every historical realm and modern country with the name and capital the
game shows, for Max to check and mark up. Needs openpyxl (python3 -m pip install --user openpyxl).
Usage: python3 scripts/realms_sheet.py [--old docs/old.xlsx]   (--old: copy any filled-in "Your correction" cells across)
"""
import datetime, json, os, re, sys
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC = os.path.join(ROOT, 'src')
OUT = os.path.join(ROOT, 'docs', 'pinpoint_realms.xlsx')
CHECK_DATE = '2026-11-11'
PERIODS = [('bronze', 'Bronze Age (1500 BCE)'), ('classical', 'Classical (500 BCE)'), ('ancient', 'Ancient (100 CE)'),
           ('early', 'Early medieval (800 CE)'), ('medieval', 'Medieval (1200 CE)'), ('discovery', 'Age of Discovery (1500)'),
           ('vienna', 'Congress of Vienna (1815)'), ('wwi', 'World War I (1914)'), ('ww2', 'World War II (1945)'),
           ('coldwar', 'Cold War (1960)')]
REGION = {'E': 'Europe', 'S': 'Asia', 'A': 'Africa', 'M': 'Americas', 'O': 'Oceania'}

# findings of the 2026-11-11 check, keyed by (period, map data name); modern ones by map data name
FIXED = {
    ('medieval', 'Buyid dynasty'): 'Fixed: was "Buyid dynasty" (ended 1062); the shape is Kashmir and the upper Indus',
    ('medieval', 'Ifat'): 'Fixed: was "Ifat Sultanate" (founded c. 1285); the shape is the Ethiopian highlands',
    ('medieval', 'Ghaznavid Emirate'): 'Fixed: was "Ghaznavid Emirate" (fell 1186); Ghurid lands in 1200',
    ('medieval', 'Imperial Japan (Fujiwara)'): 'Fixed: was "Heian Japan" (Heian period ended 1185)',
    ('ww2', 'Bhutan'): 'Fixed: capital was Thimphu (capital only from the 1950s)',
    ('early', 'Gurjara Pratihara'): 'Fixed: capital was Kannauj (taken c. 815)',
    ('vienna', 'Nassau'): 'Fixed: capital was Wiesbaden (from 1816)',
    ('medieval', 'Mongol Empire'): 'Fixed: was "Mongol Empire" (proclaimed 1206)',
    ('medieval', 'Sultanate of Delhi'): 'Fixed: was "Delhi Sultanate" (founded 1206; Ghurid-held in 1200)',
    ('medieval', 'Toltec Empire'): 'Fixed: was "Toltec Empire", capital Tula (Tula had fallen by c. 1150)',
    ('medieval', 'Merina Kingdom'): 'Fixed: was "Merina Kingdom" (the Merina kingdom formed c. 1540)',
    ('coldwar', 'China'): 'Fixed: Tibet merged in (under PRC control since 1950); was a separate realm',
    ('medieval', 'Srivijaya Empire'): 'Fixed: capital was Palembang (centre had moved to Jambi by 1200)',
    ('ww2', 'Dominican Republic'): 'Fixed earlier today: capital was Santo Domingo (Ciudad Trujillo 1936-1961)',
}
QUESTION = {
}
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from add_capitals import CAPS
CAP_NOTE = 'Capital added 2026-11-12 (was blank)'
QUESTION_MODERN = {'Indonesia': 'Watch: becomes Nusantara once the move is made official'}


def load():
    H = {}
    for f in ('HIST', 'HIST2', 'HIST3', 'HIST4'):
        H.update(json.load(open(os.path.join(SRC, 'data', f + '.json'), encoding='utf-8')))
    F = json.load(open(os.path.join(SRC, 'data', 'FAME.json'), encoding='utf-8'))
    js = open(os.path.join(SRC, 'game.js'), encoding='utf-8').read()
    fame = {'ancient': F['A'], 'medieval': F['D']}
    fame.update(json.load(open(os.path.join(SRC, 'data', 'FAME_HIST2.json'), encoding='utf-8')))
    fame.update(json.load(open(os.path.join(SRC, 'data', 'FAME_H4.json'), encoding='utf-8')))
    fame['bronze'] = json.loads(re.search(r'^FAME\.H\.bronze = (.*);$', js, re.M).group(1))
    a = js.index('var RAW = ['); raw = json.loads(js[a + len('var RAW = '):js.index('];', a) + 1])
    return H, fame, F['M'], raw


def recog(name, f):
    if name in f.get('order', []): return f['order'].index(name) + 1
    return 'Obscure' if name in f.get('last', []) else 'Middle'


def old_corrections(path):
    """(sheet, first two identifying cells) -> correction text, from an earlier copy of this workbook."""
    out = {}
    if not path or not os.path.exists(path): return out
    wb = load_workbook(path)
    for ws in wb.worksheets[1:]:
        hdr = [c.value for c in ws[1]]
        if 'Your correction' not in hdr: continue
        ci = hdr.index('Your correction')
        for row in ws.iter_rows(min_row=2, values_only=True):
            if row[ci]: out[(ws.title, row[0], row[1])] = row[ci]
    return out


def main():
    old = old_corrections(sys.argv[sys.argv.index('--old') + 1]) if '--old' in sys.argv else {}
    H, fame, fame_m, raw = load()
    prev = set()          # (period, map name) rows already in the existing sheet
    prev_added = {}       # their "Added ..." notes, kept across regenerations
    if os.path.exists(OUT):
        wb0 = load_workbook(OUT)
        if 'Realms by period' in wb0.sheetnames:
            ws0 = wb0['Realms by period']; hdr = [c.value for c in ws0[1]]
            ck = next((i for i, h in enumerate(hdr) if h and str(h).startswith('Check')), None)
            for r in ws0.iter_rows(min_row=2, values_only=True):
                if not r[0]: continue
                prev.add((r[0], r[5]))
                note = (r[ck] or '') if ck is not None else ''
                m = re.search(r'Added[^;]*', note)
                if m: prev_added[(r[0], r[5])] = m.group(0)

    A10 = Font(name='Arial', size=10); B10 = Font(name='Arial', size=10, bold=True)
    HDR = Font(name='Arial', size=10, bold=True, color='FFFFFF'); HFILL = PatternFill('solid', fgColor='1F3A4D')
    YEL = PatternFill('solid', fgColor='FFF2CC'); FIXF = PatternFill('solid', fgColor='E2EFDA'); ASKF = PatternFill('solid', fgColor='FCE4D6')
    wb = Workbook()

    rd = wb.active; rd.title = 'Read me'
    n_realms = sum(len(H[p]) for p, _ in PERIODS)
    lines = [
        ('Pinpoint: realms and capitals', Font(name='Arial', size=12, bold=True)), None,
        (f'Sheet "Realms by period" lists every historical realm in the game: {n_realms} rows across 10 periods.', A10),
        (f'Sheet "Modern countries" lists the {len(raw)} modern countries and the capitals the game uses.', A10),
        ('Sheet "On this day" lists the event shown on the menu for each of the 366 calendar dates (check the date and year).', A10),
        (f'Generated from the game source (src/) by scripts/realms_sheet.py; regenerate it after data changes.', A10), None,
        ('How to use it', B10),
        ('1. Filter by period or region with the arrows in the header row.', A10),
        (f'2. Read the "Check ({CHECK_DATE})" column: green rows were fixed that day, orange rows are open questions for you.', A10),
        ('3. Where a name, capital or region looks wrong, type the fix in the yellow "Your correction" column, then send it back.', A10), None,
        ('Columns', B10),
        ('Realm (as shown): the name players see.  Capital in game: used in Impossible capital questions; blank means no capital question is asked.', A10),
        ('Recognizability: a number is the realm\'s position in the hand-ranked "well known first" list (1 = most recognizable); "Middle" and "Obscure" are the unranked rest and the bottom list.', A10),
        ('Map data name: the label in the source border dataset (historical-basemaps). It can differ from the display name.', A10),
        (f'Check ({CHECK_DATE}): Claude checked every name and capital against the period. Blank means no problem was found. "Added" marks rows that were not in the first version of this sheet.', A10),
        None, ('Example of a correction (not real data)', B10),
    ]
    for i, ln in enumerate(lines, 1):
        if ln: rd.cell(i, 1, ln[0]).font = ln[1]
    ex = ['Ancient (100 CE)', 'Kingdom of Axum', 'Axum', 'Africa', 6, 'Axum', '', 'Capital should be Aksum (alternate spelling); fine as is']
    for j, v in enumerate(ex, 1):
        c = rd.cell(len(lines) + 1, j, v); c.font = A10
        if j == 8: c.fill = YEL
    rd.column_dimensions['A'].width = 26
    for col in 'BCDEFGH': rd.column_dimensions[col].width = 24

    def sheet(title, headers, rows, widths):
        ws = wb.create_sheet(title)
        for j, h in enumerate(headers, 1):
            c = ws.cell(1, j, h); c.font = HDR; c.fill = HFILL
        ck = headers.index(f'Check ({CHECK_DATE})') + 1; yc = headers.index('Your correction') + 1
        for i, r in enumerate(rows, 2):
            for j, v in enumerate(r, 1):
                c = ws.cell(i, j, v); c.font = A10
            note = r[ck - 1] or ''
            if note.startswith('Fixed'): ws.cell(i, ck).fill = FIXF
            elif note.startswith(('Your call', 'Minor', 'Watch', 'Capital added')): ws.cell(i, ck).fill = ASKF
            ws.cell(i, yc).fill = YEL
            ws.cell(i, ck).alignment = Alignment(wrap_text=True, vertical='top')
        for j, w in enumerate(widths): ws.column_dimensions[chr(65 + j)].width = w
        ws.freeze_panes = 'A2'; ws.auto_filter.ref = ws.dimensions
        return ws

    rows = []
    for pid, plabel in PERIODS:
        for mn, dn, cap, reg in H[pid]:
            note = FIXED.get((pid, mn)) or QUESTION.get((pid, mn)) or ''
            if mn in CAPS.get(pid, {}): note = f'{note}; {CAP_NOTE}' if note else CAP_NOTE
            added = prev_added.get((plabel, mn))
            if not added and prev and (plabel, mn) not in prev:
                added = f'Added {datetime.date.today().isoformat()}'
            if added: note = f'{note}; {added}' if note else added
            rows.append([plabel, dn, cap, REGION[reg], recog(mn, fame.get(pid, {})), mn, note,
                         old.get(('Realms by period', plabel, dn), '')])
    sheet('Realms by period', ['Period', 'Realm (as shown)', 'Capital in game', 'Region', 'Recognizability', 'Map data name',
                               f'Check ({CHECK_DATE})', 'Your correction'], rows, [26, 36, 20, 11, 16, 34, 48, 40])
    mrows = []
    for r in raw:
        dn = r[3] if len(r) > 3 else r[0]
        mrows.append([dn, r[1], REGION[r[2]], recog(r[0], fame_m), r[0], QUESTION_MODERN.get(dn, ''),
                      old.get(('Modern countries', dn, r[1]), '')])
    sheet('Modern countries', ['Country (as shown)', 'Capital in game', 'Region', 'Recognizability', 'Map data name',
                               f'Check ({CHECK_DATE})', 'Your correction'], mrows, [30, 26, 11, 16, 32, 40, 40])
    # On this day: the fact shown on the menu for each calendar date, written from memory (2026-11-13)
    otd = json.load(open(os.path.join(SRC, 'data', 'ONTHISDAY.json'), encoding='utf-8'))
    months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    orows = []
    for k in sorted(otd):
        date = f'{int(k[3:])} {months[int(k[:2])-1]}'
        orows.append([date, otd[k][0], otd[k][1], '', old.get(('On this day', date, otd[k][0]), '')])
    sheet('On this day', ['Date', 'Year', 'Event shown on the menu', f'Check ({CHECK_DATE})', 'Your correction'],
          orows, [14, 10, 90, 16, 40])
    wb.save(OUT)
    print(f'wrote {os.path.relpath(OUT, ROOT)}: {len(rows)} realms, {len(mrows)} modern countries; '
          f'{sum(1 for r in rows if (r[6] or "").startswith("Fixed"))} fixed, '
          f'{sum(1 for r in rows if (r[6] or "").startswith(("Your call", "Minor")))} open questions, '
           f'{sum(1 for r in rows if "Added" in (r[6] or ""))} added, {sum(1 for r in rows if "Capital added" in (r[6] or ""))} capitals added; corrections carried over: {sum(1 for r in rows + mrows if r[-1])}')


if __name__ == '__main__':
    main()
