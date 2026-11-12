#!/usr/bin/env python3
"""Fill in capitals for older realms that had a real seat of government at the map's date (2026-11-12).
Cultures, tribal areas, confederations and groups of states ("Greek city-states", "Rajput kingdoms", "Vikings") stay
without a capital on purpose: they had none, and a blank capital means no capital question is asked.
Keyed by period, then by the map data name (first column of HIST*.json). Safe to run twice.
Changes: src/data/HIST.json, HIST2.json, HIST3.json.
"""
import json, os, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
sys.path.insert(0, ROOT)
from build import pretty

CAPS = {
    'bronze': {  # c. 1500 BCE
        'Babylonia': 'Babylon',
        'Greek city-states': 'Mycenae',
        'Sinic': 'Ao',
    },
    'classical': {  # c. 500 BCE
        'Achaemenid Empire': 'Persepolis',
        'Rome': 'Rome',
        'Carthaginian Empire': 'Carthage',
        'Olmec': 'La Venta',
        'Meroe': 'Meroë',
        'Chavin': 'Chavín de Huántar',
        'Gandhāra': 'Taxila',
        'Kuru': 'Indraprastha',
        'Pancala': 'Kampilya',
        'Surasena': 'Mathura',
        'Malla': 'Kushinagar',
    },
    'ancient': {  # c. 100 CE
        'Koguryo': 'Gungnae',
        'Paekche': 'Wiryeseong',
        'Scythians': 'Scythian Neapolis',
        'Teotihuacan': 'Teotihuacan',
        'Moche': 'Huacas de Moche',
        'Nazca': 'Cahuachi',
        'Monte Albán': 'Monte Albán',
        'Arakan': 'Dhanyawadi',
    },
    'early': {  # c. 800 CE
        'Emirate of Córdoba': 'Córdoba',
        'Mercia': 'Tamworth',
        'Parhae': 'Sanggyeong',
        'Nan Chao': 'Dali',
        'Palas': 'Pataliputra',
        'Axum': 'Aksum',
        'Kanem': 'Njimi',
        'Huari Empire': 'Huari',
        'Tiahuanaco Empire': 'Tiwanaku',
        'Scots': 'Dunadd',
    },
    'medieval': {  # c. 1200 CE
        'Aragón': 'Zaragoza',
        'Castilla': 'Toledo',
        'León': 'León',
        'Venice': 'Venice',
        'Denmark': 'Roskilde',
        'Norway': 'Bergen',
        'Poland': 'Kraków',
        'Hungary': 'Esztergom',
        'Principality of Galicia-Volhynia': 'Halych',
        'Khwarazmian dynasty': 'Gurganj',
        'Kara Khitai Khaganate': 'Balasagun',
        'Bagan': 'Bagan',
        'Champa City States': 'Vijaya',
        'Sultanate of Delhi': 'Delhi',
        'Chola Empire': 'Gangaikonda Cholapuram',
        'Kanem': 'Njimi',
        'Great Zimbabwe': 'Great Zimbabwe',
    },
    'discovery': {  # c. 1500 CE
        'Castille': 'Toledo',
        'Aragón': 'Zaragoza',
        'Venice': 'Venice',
        'Poland-Lithuania': 'Kraków',
        'Golden Horde': 'Sarai',
        'Mali': 'Niani',
        'Benin': 'Benin City',
        'Kanem-Bornu': 'Ngazargamu',
        'Oyo': 'Oyo-Ile',
        'Vijayanagara': 'Vijayanagara',
        'Sultanate of Delhi': 'Delhi',
        'Bengal': 'Gaur',
        'Ayutthaya': 'Ayutthaya',
        'Timurid Emirates': 'Herat',
        'Emirate of the White Sheep Turks': 'Tabriz',
        'Kalmar Union': 'Stockholm',  # Denmark-Norway is its own realm here, so this shape is Sweden
        'Teutonic Knights': 'Königsberg',
        'Navarre': 'Pamplona',
        'Cyprus': 'Nicosia',
        'Aceh': 'Banda Aceh',
        'Malacca': 'Malacca',
        'Pegu': 'Pegu',
        'Tuʻi Tonga Empire': 'Muʻa',
        'Ahmadnagar': 'Ahmadnagar',
        'Bijapur': 'Bijapur',
        'Golkonda': 'Golconda',
        'Orissa': 'Cuttack',
        'Khanate of Sibir': 'Qashliq',
        'Ndongo': 'Kabasa',
        'Funj': 'Sennar',
        'Adal': 'Dakkar',
    },
}


def main():
    done = {p: set() for p in CAPS}
    for f in ('HIST', 'HIST2', 'HIST3'):
        fp = os.path.join(ROOT, 'src', 'data', f + '.json'); H = json.load(open(fp, encoding='utf-8')); changed = 0
        for p, rows in H.items():
            for r in rows:
                cap = CAPS.get(p, {}).get(r[0])
                if cap is None: continue
                done[p].add(r[0])
                if r[2] and r[2] != cap: raise SystemExit(f'{p} {r[0]}: already has capital {r[2]!r}')
                if r[2] != cap: r[2] = cap; changed += 1
        if changed: open(fp, 'w', encoding='utf-8').write(pretty(H) + '\n')
        print(f'{f}.json: {changed} capitals added')
    missing = [(p, n) for p in CAPS for n in CAPS[p] if n not in done[p]]
    if missing: raise SystemExit(f'not found: {missing}')


if __name__ == '__main__':
    main()
