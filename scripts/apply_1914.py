#!/usr/bin/env python3
"""Name the unnamed shapes on the 1914 (wwi) map as the world stood on the eve of the First World War (mid-1914).
Run once; it refuses to run twice.

Unlike 1945/1960, the 1914 map already names colonies one by one (Belgian Congo, German East Africa, British East
Africa...), so Max chose the same style here: each remaining colony becomes its own realm ("British Gold Coast",
"German Togoland", "Italian Eritrea"...), tiny island groups are merged ("British West Indies", "French West Indies"),
and Caucasus/Sakhalin/island shapes join the realm that held them. Status is written by hand below; each map shape is
matched to the world_1914.geojson feature containing its centroid. Changes: src/data/maps/PACKS2.json (wwi only),
src/data/HIST2.json, src/data/FAME_HIST2.json.  Usage: python3 scripts/apply_1914.py [--dry-run]
"""
import json, math, os, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC = os.path.join(ROOT, 'src')
sys.path.insert(0, ROOT); sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import pretty
from apply_1960 import decoder, area_cent, inside

PER = 'wwi'
UK, RU, IT, GR, DK = 'United Kingdom of Great Britain and Ireland', 'Russian Empire', 'Kingdom of Italy', 'Greece', 'Denmark'
BWI = ('British West Indies', 'British West Indies', None, 'M')
FWI = ('French West Indies', 'French West Indies', None, 'M')
BAR = ('British Arabia', 'British Arabia (Aden, Oman, Trucial States)', None, 'S')
# source NAME -> existing realm (map name) or (map name, display name, capital in 1914, region)
STATUS = {
    # independent states
    'Dominican Republic': ('Dominican Republic', 'Dominican Republic', 'Santo Domingo', 'M'),
    'Nicaragua': ('Nicaragua', 'Nicaragua', 'Managua', 'M'), 'Costa Rica': ('Costa Rica', 'Costa Rica', 'San José', 'M'),
    'Honduras': ('Honduras', 'Honduras', 'Tegucigalpa', 'M'), 'El Salvador': ('El Salvador', 'El Salvador', 'San Salvador', 'M'),
    'Bhutan': ('Bhutan', 'Bhutan', None, 'S'),
    # central Arabia: Ibn Saud's Nejd and Hasa plus the rival Rashidi emirate of Ha'il, one shape on this map
    'Arabia (Nejd)': ('Nejd', "Nejd and Ha'il (central Arabia)", None, 'S'),
    'Qatar': ('Qatar', 'Qatar', 'Doha', 'S'),
    'Kuwait': ('Kuwait', 'Kuwait (British protectorate)', 'Kuwait', 'S'),
    'British Protectorate': BAR,
    # British colonies and protectorates
    'Malawi': ('Nyasaland', 'British Nyasaland', 'Zomba', 'A'),
    'Botswana': ('Bechuanaland', 'British Bechuanaland', None, 'A'),   # run from Mafeking, outside the territory
    'Gold Coast': ('Gold Coast', 'British Gold Coast', 'Accra', 'A'),
    'Sierra Leone': ('Sierra Leone', 'British Sierra Leone', 'Freetown', 'A'),
    'Gambia, The': ('Gambia', 'British Gambia', 'Bathurst', 'A'),
    'Uganda': ('Uganda', 'British Uganda', 'Entebbe', 'A'),
    'Swaziland': ('Swaziland', 'British Swaziland', 'Mbabane', 'A'),
    'Lesotho': ('Basutoland', 'British Basutoland', 'Maseru', 'A'),
    'Guyana': ('British Guiana', 'British Guiana', 'Georgetown', 'M'),
    'Belize': ('British Honduras', 'British Honduras', 'Belize', 'M'),
    'Antigua and Barbuda': BWI, 'Barbados': BWI, 'Dominica': BWI, 'Grenada': BWI, 'Montserrat': BWI, 'Anguilla': BWI,
    'Saint Kitts and Nevis': BWI, 'Saint Lucia': BWI, 'Saint Vincent and the Grenadines': BWI,
    'Malta': ('Malta', 'British Malta', 'Valletta', 'E'),
    'Brunei': ('Brunei', 'Brunei (British protectorate)', 'Brunei Town', 'S'),
    'Hong Kong': ('Hong Kong', 'British Hong Kong', 'Victoria', 'S'),
    'Fiji': ('Fiji', 'British Fiji', 'Suva', 'O'),
    'Tonga': ('Tonga', 'Tonga (British protectorate)', 'Nukuʻalofa', 'O'),
    # other powers
    'Eritrea': ('Eritrea', 'Italian Eritrea', 'Asmara', 'A'),
    'Togoland': ('Togoland', 'German Togoland', 'Lomé', 'A'),
    'Samoa': ('Samoa', 'German Samoa', 'Apia', 'O'),
    'French Guiana': ('French Guiana', 'French Guiana', 'Cayenne', 'M'),
    'Djibouti': ('French Somaliland', 'French Somaliland', 'Djibouti', 'A'),
    'Martinique': FWI, 'Guadeloupe': FWI, 'Saint Martin': FWI, 'Saint Barthelemy': FWI,
    'Wallis and Futuna Islands': ('Wallis and Futuna', 'French Wallis and Futuna', None, 'O'),
    'Equatorial Guinea': ('Spanish Guinea', 'Spanish Guinea', 'Santa Isabel', 'A'),
    'Spanish Morocco': ('Spanish Morocco', 'Spanish Morocco', 'Tetuán', 'A'),
    'Spanish Sahara': ('Spanish Sahara', 'Spanish Sahara (Río de Oro)', 'Villa Cisneros', 'A'),
    'Rio De Oro': ('Spanish Sahara', 'Spanish Sahara (Río de Oro)', 'Villa Cisneros', 'A'),
    'Portuguese Guinea': ('Portuguese Guinea', 'Portuguese Guinea', 'Bolama', 'A'),
    'Suriname': ('Suriname', 'Dutch Suriname', 'Paramaribo', 'M'),
    'Netherlands Antilles': ('Curaçao', 'Dutch Curaçao', 'Willemstad', 'M'),
    'United States Virgin Islands': ('Danish West Indies', 'Danish West Indies', 'Charlotte Amalie', 'M'),  # sold to the US in 1917
    # joined to the realm that held them
    'Georgia': RU, 'Azerbaijan': RU, 'Armenia': RU, 'Sakhalin (RU)': RU,
    'Puerto Rico': 'United States', 'American Samoa': 'United States', 'Niue': 'New Zealand', 'Rapa Nui': 'Chile',
}
SOMALI_N = ('British Somaliland', 'British Somaliland', 'Berbera', 'A')
SOMALI_S = ('Italian Somaliland', 'Italian Somaliland', 'Mogadishu', 'A')
FAME_ADD = {'order': [], 'last': ['Bhutan', 'Qatar', 'Tonga', 'Brunei', 'Wallis and Futuna', 'Curaçao', 'Danish West Indies',
                                  'Swaziland', 'Basutoland', 'Bechuanaland', 'Portuguese Guinea', 'Spanish Guinea']}


def placed(sname, c):
    lon, lat = c
    if sname in ('British Somaliland', 'Italian Somaliland'):
        return SOMALI_N if lat > 8 else SOMALI_S       # the source swaps the two labels; place them by latitude
    if sname is None:
        if lon < 0: return DK if lat > 61.5 else UK    # Faroes; Hebrides, Orkney, Shetland, Man, Anglesey...
        if 27.0 < lon < 28.5 and lat < 36.8: return IT # Rhodes / Dodecanese, Italian since 1912
        return GR                                      # Crete, Ionian and Aegean islands (Greek by 1913)
    if sname == 'Arabia (Nejd)' and lon > 55.5: return BAR   # Musandam exclave, part of Oman
    return STATUS.get(sname)


def main():
    dry = '--dry-run' in sys.argv
    pp = os.path.join(SRC, 'data', 'maps', 'PACKS2.json')
    text = open(pp, encoding='utf-8').read().strip()
    k = text.index('"' + PER + '":') + len(PER) + 3
    P, end = json.JSONDecoder().raw_decode(text, k)
    hp, fp = os.path.join(SRC, 'data', 'HIST2.json'), os.path.join(SRC, 'data', 'FAME_HIST2.json')
    H = json.load(open(hp, encoding='utf-8')); F = json.load(open(fp, encoding='utf-8'))
    if any(r[0] == 'British Gold Coast' or r[0] == 'Gold Coast' for r in H[PER]): raise SystemExit('apply_1914: already applied')
    polys = decoder(P)
    src = []
    for f in json.load(open(os.path.join(ROOT, 'data', 'sources', 'world_1914.geojson'), encoding='utf-8'))['features']:
        g = f['geometry']
        if not g: continue
        pl = [[[tuple(p[:2]) for p in r] for r in g['coordinates']]] if g['type'] == 'Polygon' else \
             [[[tuple(p[:2]) for p in r] for r in p] for p in g['coordinates']]
        a, c = area_cent(pl); src.append((f['properties']['NAME'], pl, a, c))
    rows = list(H[PER]); known = {r[0] for r in rows}; log = []
    for i, g in enumerate(P['objects']['shapes']['geometries']):
        if (g.get('properties') or {}).get('name'): continue
        pl = polys(g)
        if not pl: continue
        a, c = area_cent(pl)
        cand = [s for s in src if any(inside(c, p) for p in s[1])]
        s = min(cand, key=lambda s: abs(math.log((s[2] + 1e-9) / (a + 1e-9)))) if cand else \
            min(src, key=lambda s: math.hypot(s[3][0] - c[0], s[3][1] - c[1]))
        st = placed(s[0], c)
        if st is None: raise SystemExit(f'apply_1914: no 1914 status for "{s[0]}" (shape {i} at {c})')
        if isinstance(st, tuple):
            target = st[0]
            if target not in known: rows.append(list(st)); known.add(target)
        else:
            target = st
            if target not in known: raise SystemExit(f'apply_1914: "{target}" is not a 1914 realm')
        g['properties'] = {'name': target}
        log.append(f'#{i} {s[0] or "(unnamed island)"} @ {c[0]:.1f},{c[1]:.1f} -> {target}')
    left = sum(1 for g in P['objects']['shapes']['geometries'] if polys(g) and not (g.get('properties') or {}).get('name'))
    print('\n'.join(log)); print(f'\nrealms: {len(H[PER])} -> {len(rows)}; unnamed shapes left: {left}')
    if dry: return
    H[PER] = rows
    for key, names in FAME_ADD.items():
        F[PER][key] += [n for n in names if n in known and n not in F[PER][key]]
    open(pp, 'w', encoding='utf-8').write(text[:k] + json.dumps(P, separators=(',', ':'), ensure_ascii=False) + text[end:] + '\n')
    open(hp, 'w', encoding='utf-8').write(pretty(H) + '\n'); open(fp, 'w', encoding='utf-8').write(pretty(F) + '\n')
    print('written')


if __name__ == '__main__':
    main()
