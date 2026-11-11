#!/usr/bin/env python3
"""Name the unnamed shapes on the 1815 (vienna) map as the world stood after the Congress of Vienna. Run once; it refuses
to run twice.

Max's choices (2026-11-11): colonies are named one by one, as the 1815 map already does (Cape Colony, Viceroyalty of New
Spain): "Dutch Guiana", "British Ceylon", "Portuguese Angola", tiny islands merged ("British West Indies"); everything
else that can be named becomes a realm too (the Netherlands, German and Italian states, African and Asian kingdoms); the
~170 Aboriginal Australian language-group shapes become ONE realm "Aboriginal Australian nations". Areas the source
leaves blank on purpose (interior Central Africa, the Arabian deserts, inland Borneo, Sakhalin, Wrangel Island) stay
unnamed, so they stay untappable (label rule 3).
Changes: src/data/maps/PACKS4.json (vienna only), src/data/HIST4.json, src/data/FAME_H4.json.
Usage: python3 scripts/apply_1815.py [--dry-run]
"""
import json, math, os, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC = os.path.join(ROOT, 'src')
sys.path.insert(0, ROOT); sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import pretty
from apply_1960 import decoder, area_cent, inside

PER = 'vienna'
LEAVE = 'LEAVE'
UK, RU, DK, SW, PR, OT = 'United Kingdom of Great Britain and Ireland', 'Russian Empire', 'Denmark', 'Sweden–Norway', 'Prussia', 'Ottoman Empire'
QING, JP = 'Manchu Empire', 'Japan'
BWI = ('British West Indies', 'British West Indies', None, 'M')
FWI = ('French West Indies', 'French West Indies', None, 'M')
ABO = ('Aboriginal Australia', 'Aboriginal Australian nations', None, 'O')
NSW = ('New South Wales', 'British New South Wales', 'Sydney', 'O')
MOZ = ('Mozambique', 'Portuguese Mozambique', 'Mozambique Island', 'A')
PAMPAS = ('Pampas', 'Pampas and Patagonian peoples', None, 'M')
DEI = ('Dutch East Indies', 'Dutch East Indies', 'Batavia', 'S')
STATUS = {
    # Europe
    '': ('United Kingdom of the Netherlands', 'United Kingdom of the Netherlands', None, 'E'),  # Amsterdam / Brussels
    'Grand Duchy of Hesse': ('Hesse-Darmstadt', 'Grand Duchy of Hesse', 'Darmstadt', 'E'),
    'Electoral Hesse': ('Hesse-Kassel', 'Electorate of Hesse', 'Kassel', 'E'),
    'Anhalt': ('Anhalt', 'Anhalt duchies', None, 'E'),
    'Oldenburg': ('Oldenburg', 'Grand Duchy of Oldenburg', 'Oldenburg', 'E'),
    'Hohenzollern': ('Hohenzollern', 'Hohenzollern principalities', None, 'E'),
    'Mecklenburg-Schwerin': ('Mecklenburg-Schwerin', 'Mecklenburg-Schwerin', 'Schwerin', 'E'),
    'Mecklenburg-Strelitz': ('Mecklenburg-Strelitz', 'Mecklenburg-Strelitz', 'Neustrelitz', 'E'),
    'Nassau': ('Nassau', 'Duchy of Nassau', 'Weilburg', 'E'),   # Wiesbaden only from 1816
    'Waldeck': ('Waldeck', 'Waldeck', 'Arolsen', 'E'),
    'Lippe-Detmold': ('Lippe', 'Lippe-Detmold', 'Detmold', 'E'),
    'Schaumburg-Lippe': ('Schaumburg-Lippe', 'Schaumburg-Lippe', 'Bückeburg', 'E'),
    'Brunswick': ('Brunswick', 'Duchy of Brunswick', 'Brunswick', 'E'),
    'Thuringia': ('Thuringian states', 'Thuringian states (Saxe-Weimar, Gotha...)', None, 'E'),
    'Lübeck': ('Lübeck', 'Free City of Lübeck', 'Lübeck', 'E'),
    'Bremen': ('Bremen', 'Free City of Bremen', 'Bremen', 'E'),
    'Hamburg': ('Hamburg', 'Free City of Hamburg', 'Hamburg', 'E'), 'Cuxhaven': ('Hamburg', 'Free City of Hamburg', 'Hamburg', 'E'),
    'Hanover': 'Hanover', 'Wetzlar': PR, 'Palatinate': 'Bavaria', 'Schleswig': DK, 'Holstein': DK,
    'Parma': ('Parma', 'Duchy of Parma', 'Parma', 'E'), 'Modena': ('Modena', 'Duchy of Modena', 'Modena', 'E'),
    'Massa': ('Modena', 'Duchy of Modena', 'Modena', 'E'), 'Lucca': ('Lucca', 'Duchy of Lucca', 'Lucca', 'E'),
    'Pontremoli': 'Tuscany', 'Fivizzano': 'Tuscany', 'San Marino': ('San Marino', 'San Marino', 'San Marino', 'E'),
    # colonies
    'Guiana': ('Dutch Guiana', 'Dutch Guiana (Suriname)', 'Paramaribo', 'M'),
    'Netherlands Antilles': ('Curaçao', 'Dutch Curaçao', 'Willemstad', 'M'),
    'Dutch East Indies': DEI,
    'Ceylon': ('Ceylon', 'British Ceylon', 'Colombo', 'S'),
    'Sierra Leone': ('Sierra Leone', 'British Sierra Leone', 'Freetown', 'A'),
    'New South Wales': NSW,
    'Trinidad': BWI, 'Antigua and Barbuda': BWI, 'Barbados': BWI, 'Dominica': BWI, 'Grenada': BWI, 'Montserrat': BWI,
    'Anguilla': BWI, 'Saint Kitts and Nevis': BWI, 'Saint Lucia': BWI, 'Saint Vincent and the Grenadines': BWI,
    'United Kingdom': BWI,   # Jamaica and the Caymans in the source
    'Martinique': FWI, 'Guadeloupe': FWI, 'Saint Martin': FWI,
    'Saint Barthelemy': ('Saint Barthélemy', 'Swedish Saint Barthélemy', 'Gustavia', 'M'),
    'Senegal': ('Senegal', 'French Senegal', 'Saint-Louis', 'A'),
    'Portuguese Guinea': ('Portuguese Guinea', 'Portuguese Guinea', None, 'A'),
    'Angola': ('Angola', 'Portuguese Angola', 'Luanda', 'A'),
    'Portuguese East Africa': MOZ, 'Delagoa Bay': MOZ,
    'Goa': ('Goa', 'Portuguese Goa', None, 'S'),
    'Philippines': ('Philippines', 'Spanish Philippines', 'Manila', 'S'),
    'Guanches': 'Spain',      # Canary Islands
    # Africa
    'Congo': ('Kongo', 'Kingdom of Kongo', 'São Salvador', 'A'),
    'Lunda': ('Lunda', 'Lunda Empire', 'Musumba', 'A'),
    'Imbangala': ('Kasanje', 'Kasanje (Imbangala)', None, 'A'),
    'Kazembe': ('Kazembe', 'Kazembe', None, 'A'),
    'Lozi': ('Lozi', 'Lozi Kingdom (Barotseland)', None, 'A'),
    'Bunyoro': ('Bunyoro', 'Bunyoro', None, 'A'), 'Nkore': ('Nkore', 'Nkore (Ankole)', None, 'A'),
    'Rwanda': ('Rwanda', 'Kingdom of Rwanda', None, 'A'), 'Burundi': ('Burundi', 'Kingdom of Burundi', None, 'A'),
    'Xhosa': ('Xhosa', 'Xhosa kingdoms', None, 'A'),
    'Fante': ('Fante', 'Fante Confederacy', None, 'A'),
    'Mossi States': ('Mossi', 'Mossi kingdoms', 'Ouagadougou', 'A'),
    'Kaarta': ('Kaarta', 'Kaarta (Bambara)', None, 'A'),
    'Sotho': ('Benin', 'Kingdom of Benin', 'Benin City', 'A'),   # mislabelled in the source; this is the Edo kingdom
    'Somalia': ('Somali', 'Somali sultanates', None, 'A'),
    'Zanzibar': 'Oman', 'Cyrenaica': 'Tripolitania',
    # the source's Merina feature also covers the rest of Madagascar; the map's named Merina Kingdom is the highland core
    'Merina Kingdom': ('Malagasy kingdoms', 'Sakalava and other Malagasy kingdoms', None, 'A'),
    # Asia
    'Cambodia': ('Cambodia', 'Cambodia', 'Oudong', 'S'), 'Cochin China': 'Annam', 'Arakan': 'Burma',
    'Assam': ('Assam', 'Ahom Kingdom (Assam)', 'Jorhat', 'S'),
    'Sikkim (Indian princely state)': ('Sikkim', 'Sikkim', 'Tumlong', 'S'),
    'Oudh': ('Oudh', 'Oudh (Awadh)', 'Lucknow', 'S'),
    'Travancore': ('Travancore', 'Travancore', 'Trivandrum', 'S'),
    'Bhutan': ('Bhutan', 'Bhutan', 'Punakha', 'S'),
    'Malaya': ('Malay sultanates', 'Malay sultanates', None, 'S'),
    'Brunei': ('Brunei', 'Sultanate of Brunei', 'Brunei Town', 'S'),
    'Hong Kong': QING,
    'central Asian khanates': ('Kazakh hordes', 'Kazakh hordes', None, 'S'),
    'Turan': ('Turan', 'Central Asian khanates (Bukhara, Khiva, Kokand)', None, 'S'),
    'Kuril Islands': RU,
    # Americas and Oceania
    'Pampas cultures': PAMPAS, 'Shuar': ('Shuar', 'Shuar', None, 'M'),
    'Papuans': ('Papuans', 'Papuan peoples', None, 'O'), 'Polynesians': ('Rapa Nui', 'Rapa Nui', None, 'O'),
}
FAME_ADD = {'order': ['United Kingdom of the Netherlands', 'Aboriginal Australia', 'New South Wales', 'Ceylon'],
            'last': ['Anhalt', 'Hohenzollern', 'Waldeck', 'Lippe', 'Schaumburg-Lippe', 'Mecklenburg-Strelitz', 'Lübeck', 'Bremen',
                     'San Marino', 'Lucca', 'Saint Barthélemy', 'Curaçao', 'Kazembe', 'Nkore', 'Kaarta', 'Shuar', 'Sikkim',
                     'Goa', 'Portuguese Guinea', 'Rapa Nui']}


def placed(sname, c, subj=None):
    lon, lat = c
    if sname is None and subj == 'Dutch East Indies': return DEI   # Java, Sumatra, Lesser Sundas, Halmahera
    if sname is None:
        if lon < -160 or lon > 175: return LEAVE if lat > 70 else RU          # Aleutians, Pribilofs; Wrangel stays blank
        if -10 < lon < 0 and lat > 50: return DK if lat > 61.5 else UK         # Faroes; Hebrides, Orkney, Shetland, Man...
        if lon < -60 and lat < -45: return PAMPAS                               # Tierra del Fuego
        if 112 < lon < 155 and -40 < lat < -10: return ABO
        if 145 < lon < 149 and lat < -40: return NSW                            # Van Diemen's Land, under NSW until 1825
        if 123 < lon < 132 and 24 < lat < 33:                                   # Ryukyu Kingdom; Amami, Tokara, Goto (Satsuma)
            return ('Ryukyu', 'Ryukyu Kingdom', 'Shuri', 'S') if lat < 26.95 else JP
        if 119 < lon < 123 and 21 < lat < 26: return QING                       # Taiwan
        if 18 < lon < 20 and 57 < lat < 58.5: return SW                         # Gotland
        if 19 < lon < 21 and 59.5 < lat < 60.6: return RU                       # Aland (Grand Duchy of Finland)
        if 21.5 < lon < 24 and 58 < lat < 59.5: return RU                       # Saaremaa, Hiiumaa
        if 13 < lon < 14 and 54 < lat < 55: return PR                           # Rugen
        if (14.5 < lon < 15.5 and 54.8 < lat < 55.4) or (10.8 < lon < 11.4 and 54.3 < lat < 54.7): return DK   # Bornholm, Fehmarn
        if 27 < lon < 28.5 and lat < 37: return OT                              # Rhodes
        return LEAVE                                                            # interior Africa, Arabia, Borneo, Sakhalin
    if sname == 'Dutch East Indies' and lon < 60: return 'Cape Colony'          # the source puts this label inside the Cape
    st = STATUS.get(sname)
    if st is None and 112 < lon < 155 and -40 < lat < -10: return ABO          # the ~170 Aboriginal language groups
    return st


def main():
    dry = '--dry-run' in sys.argv
    pp = os.path.join(SRC, 'data', 'maps', 'PACKS4.json')
    text = open(pp, encoding='utf-8').read().strip()
    k = text.index('"' + PER + '":') + len(PER) + 3
    P, end = json.JSONDecoder().raw_decode(text, k)
    hp, fp = os.path.join(SRC, 'data', 'HIST4.json'), os.path.join(SRC, 'data', 'FAME_H4.json')
    H = json.load(open(hp, encoding='utf-8')); F = json.load(open(fp, encoding='utf-8'))
    if any(r[0] == 'United Kingdom of the Netherlands' for r in H[PER]): raise SystemExit('apply_1815: already applied')
    polys = decoder(P)
    src = []
    for f in json.load(open(os.path.join(ROOT, 'data', 'sources', 'world_1815.geojson'), encoding='utf-8'))['features']:
        g = f['geometry']
        if not g: continue
        pl = [[[tuple(p[:2]) for p in r] for r in g['coordinates']]] if g['type'] == 'Polygon' else \
             [[[tuple(p[:2]) for p in r] for r in p] for p in g['coordinates']]
        nm = f['properties'].get('NAME')
        a, c = area_cent(pl); src.append((nm.strip() if nm is not None else None, pl, a, c, f['properties'].get('SUBJECTO')))
    rows = list(H[PER]); known = {r[0] for r in rows}; log = []; left = []
    for i, g in enumerate(P['objects']['shapes']['geometries']):
        if (g.get('properties') or {}).get('name'): continue
        pl = polys(g)
        if not pl: continue
        a, c = area_cent(pl)
        cand = [s for s in src if any(inside(c, p) for p in s[1])]
        s = min(cand, key=lambda s: abs(math.log((s[2] + 1e-9) / (a + 1e-9)))) if cand else \
            min(src, key=lambda s: math.hypot(s[3][0] - c[0], s[3][1] - c[1]))
        st = placed(s[0], c, s[4])
        if st is None: raise SystemExit(f'apply_1815: no 1815 status for "{s[0]}" (shape {i} at {c})')
        if st == LEAVE: left.append(f'#{i} {s[0]} @ {c[0]:.1f},{c[1]:.1f} area {a:.1f}'); continue
        if isinstance(st, tuple):
            target = st[0]
            if target not in known: rows.append(list(st)); known.add(target)
        else:
            target = st
            if target not in known: raise SystemExit(f'apply_1815: "{target}" is not an 1815 realm')
        g['properties'] = {'name': target}
        log.append(f'#{i} {s[0] if s[0] is not None else "(unnamed)"} @ {c[0]:.1f},{c[1]:.1f} -> {target}')
    print('\n'.join(log)); print('\nleft unnamed (untappable):\n  ' + '\n  '.join(left))
    print(f'\nrealms: {len(H[PER])} -> {len(rows)}')
    if dry: return
    H[PER] = rows
    for key, names in FAME_ADD.items():
        F[PER][key] += [n for n in names if n in known and n not in F[PER][key]]
    open(pp, 'w', encoding='utf-8').write(text[:k] + json.dumps(P, separators=(',', ':'), ensure_ascii=False) + text[end:] + '\n')
    open(hp, 'w', encoding='utf-8').write(pretty(H) + '\n'); open(fp, 'w', encoding='utf-8').write(pretty(F) + '\n')
    print('written')


if __name__ == '__main__':
    main()
