#!/usr/bin/env python3
"""Split the 1914 (wwi) realm "Papua and New Guinea" into Australian Papua and German New Guinea (Max's choice,
2026-11-11). Run once; it refuses to run twice. Needs shapely (python3 -m pip install --user shapely).

The mainland piece is cut along the 1885 Anglo-German boundary: from the east coast along 8°S to 147°E, straight to
6°S 144°E, then to 5°S 141°E. North of it (and New Britain) is German New Guinea (capital Rabaul), south of it is
Australian Papua (capital Port Moresby). The cut pieces get new arcs; everything else in the topology is untouched.
Changes: src/data/maps/PACKS2.json (wwi only), src/data/HIST2.json, src/data/FAME_HIST2.json.
"""
import json, os, sys
from shapely.geometry import Polygon, MultiPolygon
from shapely.geometry.polygon import orient
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
sys.path.insert(0, ROOT); sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import pretty
from apply_1960 import decoder

OLD = 'Papua New Guinea'
GER = ['German New Guinea', 'German New Guinea', 'Rabaul', 'O']
AUS = ['Australian Papua', 'Australian Papua', 'Port Moresby', 'O']
# everything on the Papuan (south) side of the 1885 line, as one big polygon (lon, lat)
SOUTH = Polygon([(141, -5), (144, -6), (147, -8), (152, -8), (152, -13), (139, -13), (139, -5)])


def main():
    pp = os.path.join(ROOT, 'src', 'data', 'maps', 'PACKS2.json')
    text = open(pp, encoding='utf-8').read().strip()
    k = text.index('"wwi":') + len('"wwi":')
    P, end = json.JSONDecoder().raw_decode(text, k)
    G = P['objects']['shapes']['geometries']
    idx = [i for i, g in enumerate(G) if (g.get('properties') or {}).get('name') == OLD]
    if not idx: raise SystemExit('split_papua_1914: already applied')
    g = G[idx[0]]; assert len(idx) == 1 and g['type'] == 'MultiPolygon'
    polys = decoder(P)(g)
    # the mainland is the piece that crosses the 1885 line; New Britain (and anything else) stays German
    main_i = max(range(len(polys)), key=lambda i: Polygon(polys[i][0]).area)
    ring = polys[main_i][0]
    sign = 1 if Polygon(ring).exterior.is_ccw else -1          # keep the source's winding for exterior rings
    mainland = Polygon(polys[main_i][0], polys[main_i][1:]).buffer(0)
    south, north = mainland.intersection(SOUTH), mainland.difference(SOUTH)

    sx, sy = P['transform']['scale']; tx, ty = P['transform']['translate']
    def arc(coords):
        q = [(round((x - tx) / sx), round((y - ty) / sy)) for x, y in coords]
        if q[0] != q[-1]: q.append(q[0])
        out, px, py = [], 0, 0
        for x, y in q:
            if out and x == px and y == py: continue
            out.append([x - px, y - py]); px, py = x, y
        P['arcs'].append(out)
        return len(P['arcs']) - 1
    def encode(geom):
        parts = list(geom.geoms) if isinstance(geom, MultiPolygon) else [geom]
        res = []
        for p in parts:
            if p.is_empty or p.area < 1e-6: continue
            p = orient(p, sign=1.0 if sign > 0 else -1.0)
            res.append([[arc(p.exterior.coords)]] + [[arc(h.coords)] for h in p.interiors])
        return res
    north_arcs, south_arcs = encode(north), encode(south)
    other = [a for i, a in enumerate(g['arcs']) if i != main_i]       # New Britain etc., original arcs
    G[idx[0]] = {'type': 'MultiPolygon', 'arcs': north_arcs + other, 'properties': {'name': GER[0]}}
    G.insert(idx[0] + 1, {'type': 'MultiPolygon', 'arcs': south_arcs, 'properties': {'name': AUS[0]}})
    print(f'mainland area {mainland.area:.2f} -> north {north.area:.2f} + south {south.area:.2f}; '
          f'German pieces {len(north_arcs) + len(other)}, Papuan pieces {len(south_arcs)}')
    open(pp, 'w', encoding='utf-8').write(text[:k] + json.dumps(P, separators=(',', ':'), ensure_ascii=False) + text[end:] + '\n')

    hp = os.path.join(ROOT, 'src', 'data', 'HIST2.json'); H = json.load(open(hp, encoding='utf-8'))
    i = [j for j, r in enumerate(H['wwi']) if r[0] == OLD][0]
    H['wwi'][i:i + 1] = [GER, AUS]
    open(hp, 'w', encoding='utf-8').write(pretty(H) + '\n')
    fp = os.path.join(ROOT, 'src', 'data', 'FAME_HIST2.json'); F = json.load(open(fp, encoding='utf-8'))
    for key in F['wwi']:
        if OLD in F['wwi'][key]:
            j = F['wwi'][key].index(OLD); F['wwi'][key][j:j + 1] = [GER[0], AUS[0]]
    open(fp, 'w', encoding='utf-8').write(pretty(F) + '\n')
    print('written')


if __name__ == '__main__':
    main()
