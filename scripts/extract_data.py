#!/usr/bin/env python3
"""Pull every data table that is embedded in pinpoint.html out into data/embedded/*.json.

The game file is the source of truth: edits made after the original build scripts ran (realm flags, the 1945
colony/empire grouping, period-specific flags, ...) live only inside it. Run this to get the current data as JSON
whenever you need to inspect or diff it. Usage:  python3 scripts/extract_data.py [path/to/pinpoint.html]
"""
import json, re, sys, os
src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'pinpoint.html')
out = os.path.join(os.path.dirname(__file__), '..', 'data', 'embedded'); os.makedirs(out, exist_ok=True)
t = open(src, encoding='utf-8').read()
done, skipped = [], []
for m in re.finditer(r'(?m)^var ([A-Z][A-Za-z0-9_]*) = ', t):
    name, s = m.group(1), m.end()
    obj = None
    # the statement ends at the first line that finishes with ';' (most tables are one line, a few span several)
    pos = s
    while pos < len(t):
        k = t.find('\n', pos)
        if k < 0: k = len(t)
        chunk = t[s:k].rstrip()
        if chunk.endswith(';'):
            try: obj = json.loads(chunk[:-1])
            except Exception: obj = None
            break
        pos = k + 1
        if pos - s > 8_000_000: break
    if obj is None or name == 'W':
        skipped.append(name); continue
    p = os.path.join(out, name + '.json')
    json.dump(obj, open(p, 'w', encoding='utf-8'), ensure_ascii=False)
    done.append(f'{name} ({os.path.getsize(p)//1024} KB)')
print('written:', ', '.join(done)); print('not plain JSON (look in the HTML):', ', '.join(skipped))
