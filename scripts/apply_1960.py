#!/usr/bin/env python3
"""Name the unnamed shapes on the 1960 (coldwar) map as the world stood at the END OF 1960. Run once; it refuses to
run twice. Same method as 1945: colonies are grouped into British/French/Belgian/Portuguese/Spanish/Dutch Empire
realms (no capital), territories of non-European powers join that power (Puerto Rico -> United States, South West
Africa -> South Africa, Papua New Guinea -> Australia...), and states independent by 31 Dec 1960 become realms.

Unlike the 1945 source, data/sources/world_1960.geojson has no colonial info (SUBJECTO = the feature itself), so the
status of every territory below is written by hand. Each map shape is matched to the source feature that contains its
centroid. Changes: src/data/maps/PACKS4.json (coldwar only), src/data/HIST4.json, src/data/FAME_H4.json.
Usage: python3 scripts/apply_1960.py [--dry-run]
"""
import json, math, os, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC = os.path.join(ROOT, 'src')
sys.path.insert(0, ROOT)
from build import pretty

E = 'British Empire', 'French Empire', 'Belgian Empire', 'Portuguese Empire', 'Spanish Empire', 'Dutch Empire'
BR, FR, BE, PT, ES, NL = E
# source NAME -> an existing/empire realm name, or (map name, display name, capital, region) for a new state
STATUS = {
    # independent by 31 Dec 1960 (the "Year of Africa" states included)
    'Mali': ('Mali', 'Mali', 'Bamako', 'A'), 'Niger': ('Niger', 'Niger', 'Niamey', 'A'),
    'Chad': ('Chad', 'Chad', 'Fort-Lamy', 'A'), 'Burkina Faso': ('Upper Volta', 'Upper Volta', 'Ouagadougou', 'A'),
    'Central African Republic': ('Central African Republic', 'Central African Republic', 'Bangui', 'A'),
    'Madagascar': ('Madagascar', 'Malagasy Republic (Madagascar)', 'Tananarive', 'A'),
    'Benin': ('Dahomey', 'Dahomey', 'Porto-Novo', 'A'), 'Togo': ('Togo', 'Togo', 'Lomé', 'A'),
    'Ivory Coast': ('Ivory Coast', 'Ivory Coast', 'Abidjan', 'A'),
    'Congo': ('Congo (Brazzaville)', 'Congo (Brazzaville)', 'Brazzaville', 'A'),
    'Gabon': ('Gabon', 'Gabon', 'Libreville', 'A'), 'Cameroon': ('Cameroon', 'Cameroon', 'Yaoundé', 'A'),
    'Mauritania': ('Mauritania', 'Mauritania', 'Nouakchott', 'A'), 'Senegal': ('Senegal', 'Senegal', 'Dakar', 'A'),
    'Guinea': ('Guinea', 'Guinea', 'Conakry', 'A'), 'Liberia': ('Liberia', 'Liberia', 'Monrovia', 'A'),
    'Somalia': ('Somalia', 'Somalia', 'Mogadishu', 'A'),
    'Haiti': ('Haiti', 'Haiti', 'Port-au-Prince', 'M'),
    'Dominican Republic': ('Dominican Republic', 'Dominican Republic', 'Ciudad Trujillo', 'M'),
    'Nicaragua': ('Nicaragua', 'Nicaragua', 'Managua', 'M'), 'Costa Rica': ('Costa Rica', 'Costa Rica', 'San José', 'M'),
    'Panama': ('Panama', 'Panama', 'Panama City', 'M'), 'Guatemala': ('Guatemala', 'Guatemala', 'Guatemala City', 'M'),
    'Honduras': ('Honduras', 'Honduras', 'Tegucigalpa', 'M'), 'El Salvador': ('El Salvador', 'El Salvador', 'San Salvador', 'M'),
    'Bolivia': ('Bolivia', 'Bolivia', 'Sucre', 'M'), 'Paraguay': ('Paraguay', 'Paraguay', 'Asunción', 'M'),
    'Ecuador': ('Ecuador', 'Ecuador', 'Quito', 'M'), 'Uruguay': ('Uruguay', 'Uruguay', 'Montevideo', 'M'),
    'Nepal': ('Nepal', 'Nepal', 'Kathmandu', 'S'), 'Bhutan': ('Bhutan', 'Bhutan', 'Thimphu', 'S'),
    'Oman': ('Muscat and Oman', 'Muscat and Oman', 'Muscat', 'S'),
    'Taiwan': ('Taiwan', 'Republic of China (Taiwan)', 'Taipei', 'S'),
    'Luxembourg': ('Luxembourg', 'Luxembourg', 'Luxembourg', 'E'), 'Andorra': ('Andorra', 'Andorra', 'Andorra la Vella', 'E'),
    # colonies, protectorates and trust territories of European powers
    'Western Sahara': ES, 'Equatorial Guinea': ES,
    'Angola': PT, 'Mozambique': PT, 'Guinea-Bissau': PT,
    'Rwanda': BE, 'Burundi': BE,
    'Suriname': NL,
    'Djibouti': FR, 'Wallis and Futuna Islands': FR,
    'Qatar': BR, 'United Arab Emirates': BR, 'Jamaica': BR, 'Sierra Leone': BR, 'Guyana': BR,
    'Tanzania, United Republic of': BR, 'Zambia': BR, 'Malawi': BR, 'Zimbabwe': BR, 'Botswana': BR, 'Swaziland': BR,
    'Lesotho': BR, 'Belize': BR, 'Gambia, The': BR, 'Trinidad': BR, 'Brunei': BR, 'Uganda': BR,
    'Turks and Caicos Islands': BR, 'Bahamas': BR, 'Fiji': BR, 'Tonga': BR,
    # territories joined to the realm that held them
    'Puerto Rico': 'United States', 'American Samoa': 'United States', 'Namibia': 'South Africa',
    'Papua New Guinea': 'Australia', 'Niue': 'New Zealand', 'Samoa': 'New Zealand', 'Greenland': 'Denmark',
    'French Guiana': 'France', 'Eritrea': 'Ethiopia',
    'Rapa Nui': 'Chile', 'Hong Kong': BR,
}
NEW_ROWS = [(BR, BR, None, 'A'), (FR, FR, None, 'A'), (BE, BE, None, 'A'), (PT, PT, None, 'A'), (ES, ES, None, 'A'),
            (NL, NL, None, 'M'), ('Malaya', 'Federation of Malaya', 'Kuala Lumpur', 'S')]
FAME_ADD = {'order': [BR, FR, PT, 'Taiwan'],
            'last': ['Andorra', 'Luxembourg', 'Bhutan', 'Muscat and Oman', 'Nepal', 'Upper Volta', 'Dahomey', BE, ES, NL]}


def unnamed_island(c):
    """Shapes the source left without any name: British and Faroe isles, and the islands south of Kyushu."""
    lon, lat = c
    if lon < 0: return 'Denmark' if lat > 61.5 else 'United Kingdom'
    # Ryukyu (Okinawa and Sakishima) stayed under US administration until 1972; Amami and Tokara went back in 1952-53
    return 'United States' if lat < 26.95 else 'Japan'


# ---------- geometry helpers (TopoJSON decode, area/centroid, point in polygon) ----------
def decoder(P):
    sx, sy = P['transform']['scale']; tx, ty = P['transform']['translate']
    arcs = []
    for a in P['arcs']:
        x = y = 0; pts = []
        for dx, dy in a:
            x += dx; y += dy; pts.append((x * sx + tx, y * sy + ty))
        arcs.append(pts)
    def ring(ix):
        out = []
        for i in ix:
            pts = arcs[i] if i >= 0 else arcs[~i][::-1]
            out.extend(pts if not out else pts[1:])
        return out
    def polys(g):
        if g['type'] == 'Polygon': return [[ring(r) for r in g['arcs']]]
        if g['type'] == 'MultiPolygon': return [[ring(r) for r in p] for p in g['arcs']]
        return []
    return polys


def area_cent(polys):
    A = cx = cy = 0
    for rings in polys:
        for r in rings:
            for (x1, y1), (x2, y2) in zip(r, r[1:] + r[:1]):
                c = x1 * y2 - x2 * y1; A += c / 2; cx += (x1 + x2) * c / 6; cy += (y1 + y2) * c / 6
    if abs(A) < 1e-12:
        r = polys[0][0]; return 0, (sum(p[0] for p in r) / len(r), sum(p[1] for p in r) / len(r))
    return abs(A), (cx / A, cy / A)


def inside(pt, rings):
    x, y = pt; ins = False
    for r in rings:
        for (x1, y1), (x2, y2) in zip(r, r[1:] + r[:1]):
            if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1: ins = not ins
    return ins


def main():
    dry = '--dry-run' in sys.argv
    pp = os.path.join(SRC, 'data', 'maps', 'PACKS4.json')
    text = open(pp, encoding='utf-8').read().strip()
    k = text.index('"coldwar":') + len('"coldwar":')
    P, end = json.JSONDecoder().raw_decode(text, k)
    H = json.load(open(os.path.join(SRC, 'data', 'HIST4.json'), encoding='utf-8'))
    F = json.load(open(os.path.join(SRC, 'data', 'FAME_H4.json'), encoding='utf-8'))
    if any(r[0] == BR for r in H['coldwar']): raise SystemExit('apply_1960: already applied')

    polys = decoder(P)
    src = []
    for f in json.load(open(os.path.join(ROOT, 'data', 'sources', 'world_1960.geojson'), encoding='utf-8'))['features']:
        g = f['geometry']
        if not g: continue
        pl = [[[tuple(p[:2]) for p in r] for r in g['coordinates']]] if g['type'] == 'Polygon' else \
             [[[tuple(p[:2]) for p in r] for r in p] for p in g['coordinates']]
        a, c = area_cent(pl); src.append((f['properties']['NAME'], pl, a, c))

    geoms = P['objects']['shapes']['geometries']
    known = {r[0] for r in H['coldwar']} | {r[0] for r in NEW_ROWS}
    rows = list(H['coldwar']); added = []; log = []
    extra = []
    for i, g in enumerate(geoms):
        name = (g.get('properties') or {}).get('name')
        pl = polys(g)
        if not pl: continue
        a, c = area_cent(pl)
        if name == 'Indonesia':
            # Western New Guinea stayed Dutch until 1962: split those pieces off
            keep, dutch = [], []
            for arcs_, p in zip(g['arcs'], pl):
                (dutch if area_cent([p])[1][0] > 134.5 else keep).append(arcs_)
            if dutch:
                g['arcs'] = keep
                extra.append({'type': 'MultiPolygon', 'arcs': dutch, 'properties': {'name': NL}})
                log.append(f'split Indonesia: {len(dutch)} pieces of Western New Guinea -> {NL}')
            continue
        if name: continue
        cand = [s for s in src if any(inside(c, p) for p in s[1])]
        s = min(cand, key=lambda s: abs(math.log((s[2] + 1e-9) / (a + 1e-9)))) if cand else \
            min(src, key=lambda s: math.hypot(s[3][0] - c[0], s[3][1] - c[1]))
        sname = s[0]
        if sname == 'Ethiopia' and c[0] > 43: sname = 'Somalia'   # the source draws Somalia inside its Ethiopia feature
        if sname == 'Malaysia':
            # Malaya (independent 1957) and British Borneo (Sarawak, North Borneo) are one shape: split
            assert g['type'] == 'MultiPolygon'
            ma, bo = [], []
            for arcs_, p in zip(g['arcs'], pl):
                (bo if area_cent([p])[1][0] > 109 else ma).append(arcs_)
            g['arcs'] = ma; g['properties'] = {'name': 'Malaya'}
            extra.append({'type': 'MultiPolygon', 'arcs': bo, 'properties': {'name': BR}})
            log.append(f'#{i} Malaysia -> Malaya + {BR} (Borneo)')
            continue
        st = unnamed_island(c) if sname is None else STATUS.get(sname)
        if st is None: raise SystemExit(f'apply_1960: no 1960 status for "{sname}" (shape {i} at {c})')
        if isinstance(st, tuple):
            target = st[0]
            if target not in known: rows.append(list(st)); known.add(target); added.append(target)
        else:
            target = st
            if target not in known: raise SystemExit(f'apply_1960: "{target}" is not a 1960 realm')
        g['properties'] = {'name': target}
        log.append(f'#{i} {sname or "(unnamed island)"} @ {c[0]:.1f},{c[1]:.1f} -> {target}')
    geoms.extend(extra)
    for r in NEW_ROWS:
        if r[0] not in {x[0] for x in rows}: rows.append(list(r))
    used = {(g.get('properties') or {}).get('name') for g in geoms}
    missing = [r[0] for r in rows if r[0] not in used]
    if missing: raise SystemExit(f'apply_1960: rows without a shape: {missing}')
    left = sum(1 for g in geoms if polys(g) and not (g.get('properties') or {}).get('name'))
    print('\n'.join(log))
    print(f'\nrealms: {len(H["coldwar"])} -> {len(rows)}; unnamed shapes left: {left}')
    if dry: return
    H['coldwar'] = rows
    for key, names in FAME_ADD.items():
        F['coldwar'][key] += [n for n in names if n not in F['coldwar'][key]]
    out = text[:k] + json.dumps(P, separators=(',', ':'), ensure_ascii=False) + text[end:]
    open(pp, 'w', encoding='utf-8').write(out + '\n')
    for name, obj in (('HIST4', H), ('FAME_H4', F)):
        open(os.path.join(SRC, 'data', name + '.json'), 'w', encoding='utf-8').write(pretty(obj) + '\n')
    print('written')


if __name__ == '__main__':
    main()
