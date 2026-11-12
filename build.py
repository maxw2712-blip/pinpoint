#!/usr/bin/env python3
"""Build pinpoint.html from src/.

src/ is the source of truth. This inlines everything into one self-contained HTML file (the only runtime
dependencies stay d3 and topojson-client from jsdelivr):

  src/index.html        page markup; the lines `/* @include style.css */` and `// @include game.js` are replaced
  src/style.css         all CSS
  src/game.js           all game logic; data is pulled in with three placeholders:
      __JSON__("data/X.json")       the JSON file, minified
      __IMAGE__("img/a.webp")       one data: URL string
      __IMAGES__("flags/modern")    {"<key>": "data:..."} for every image in the folder; the key is the file name
                                    without extension, with %2F %3A %25 decoded to / : %
  src/data/*.json       hand-editable tables (realms, fame orders, trivia, security, ...), pretty-printed
  src/data/maps/*.json  TopoJSON map packs (machine-generated, one line)
  src/flags/modern/     modern + lost-country flags (key "h:Soviet Union" -> file "h%3ASoviet Union.webp")
  src/flags/realms/     historical realm flags; period-specific ones are "ww2|Afghanistan.webp"
  src/img/              shaded relief and planet textures

Usage:  python3 build.py [--dev] [--out FILE] [--check]
  (default) the PUBLIC build, pinpoint.html: everything between @dev-start and @dev-end markers is left out (dev mode:
            the Report buttons, report panels, the Settings toggle and their code), so players can't find it. The build
            fails if any dev-mode trace is left in it.
  --dev     the PRIVATE build, pinpoint-dev.html, with dev mode included. It is git-ignored: keep it local, never publish it.
  --check   build to memory and fail if the result differs from the existing output (for CI or a pre-commit hook)
Markers: <!-- @dev-start --> ... <!-- @dev-end --> in index.html, /* @dev-start */ ... /* @dev-end */ in style.css,
         // @dev-start ... // @dev-end (each on its own line) in game.js.
"""
import base64, json, os, re, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')
MIME = {'.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml'}


# ---------- helpers shared with other scripts ----------
def key_to_file(k):
    """Flag/realm key -> file name stem (only characters a file name cannot hold are escaped)."""
    return k.replace('%', '%25').replace('/', '%2F').replace(':', '%3A')


def file_to_key(stem):
    return stem.replace('%2F', '/').replace('%3A', ':').replace('%25', '%')


def pretty(obj, ind=0, width=150):
    """JSON with short containers on one line, so tables read and diff as one row per line."""
    one = json.dumps(obj, ensure_ascii=False)
    if not isinstance(obj, (list, dict)) or len(one) + ind <= width or not obj:
        return one
    pad, sub = ' ' * ind, ' ' * (ind + 2)
    if isinstance(obj, list):
        return '[\n' + ',\n'.join(sub + pretty(v, ind + 2, width) for v in obj) + '\n' + pad + ']'
    return '{\n' + ',\n'.join(sub + json.dumps(k, ensure_ascii=False) + ': ' + pretty(v, ind + 2, width)
                              for k, v in obj.items()) + '\n' + pad + '}'


# ---------- build ----------
def _safe(s):
    # keep "</script>" or "<!--" inside data from ending the inline script
    return s.replace('</', '\\u003c/').replace('<!--', '\\u003c!--')


def data_url(path):
    ext = os.path.splitext(path)[1].lower()
    if ext not in MIME: raise SystemExit(f'build: unsupported image type {path}')
    with open(path, 'rb') as f:
        return f'data:{MIME[ext]};base64,' + base64.b64encode(f.read()).decode('ascii')


def inline_json(rel):
    p = os.path.join(SRC, rel)
    text = open(p, encoding='utf-8').read().strip()
    try: obj = json.loads(text)
    except json.JSONDecodeError as e: raise SystemExit(f'build: {rel} is not valid JSON: {e}')
    # one-line files (map packs) go in verbatim; pretty ones are minified
    out = text if '\n' not in text else json.dumps(obj, ensure_ascii=False, separators=(',', ':'))
    return _safe(out)


def inline_images(rel):
    d = os.path.join(SRC, rel)
    items = {}
    for fn in sorted(os.listdir(d)):
        stem, ext = os.path.splitext(fn)
        if fn.startswith('.') or ext.lower() not in MIME: continue
        key = file_to_key(stem)
        if key in items: raise SystemExit(f'build: two files for "{key}" in {rel}')
        items[key] = data_url(os.path.join(d, fn))
    return json.dumps(items, ensure_ascii=False, separators=(',', ':'))


PLACEHOLDER = re.compile(r'__(JSON|IMAGE|IMAGES)__\("([^"]+)"\)')


def expand(m):
    kind, rel = m.groups()
    if kind == 'JSON': return inline_json(rel)
    if kind == 'IMAGE': return json.dumps(data_url(os.path.join(SRC, rel)))
    return inline_images(rel)


DEV_BLOCKS = {
    'html': re.compile(r'[ \t]*<!-- @dev-start -->.*?<!-- @dev-end -->[ \t]*\n?', re.S),
    'css': re.compile(r'/\* @dev-start \*/.*?/\* @dev-end \*/\n?', re.S),
    'js': re.compile(r'[ \t]*// @dev-start\n.*?// @dev-end[ \t]*\n?', re.S),
}
DEV_TRACES = ['devToggle', 'reportPanel', 'reportsView', 'reportBtn', 'exploreReport', 'pinpoint:dev', 'pinpoint:reports',
              'openReport', 'Report a problem']


def strip_dev(text, kind, dev):
    if dev: return text
    out = DEV_BLOCKS[kind].sub('', text)
    if '@dev-start' in out or '@dev-end' in out: raise SystemExit(f'build: unbalanced @dev markers in the {kind} source')
    return out


def build(dev=False):
    page = strip_dev(open(os.path.join(SRC, 'index.html'), encoding='utf-8').read(), 'html', dev)
    css = strip_dev(open(os.path.join(SRC, 'style.css'), encoding='utf-8').read(), 'css', dev).rstrip('\n')
    js = PLACEHOLDER.sub(expand, strip_dev(open(os.path.join(SRC, 'game.js'), encoding='utf-8').read(), 'js', dev)).rstrip('\n')
    for marker, body in (('/* @include style.css */', css), ('// @include game.js', js)):
        if page.count(marker) != 1: raise SystemExit(f'build: index.html must contain "{marker}" exactly once')
        page = page.replace(marker, body)
    if not dev:
        left = [t for t in DEV_TRACES if t in page]
        if left: raise SystemExit(f'build: dev-mode traces left in the public build: {left}')
    return page


def main():
    args = sys.argv[1:]
    dev = '--dev' in args
    out = os.path.join(ROOT, args[args.index('--out') + 1] if '--out' in args else ('pinpoint-dev.html' if dev else 'pinpoint.html'))
    html = build(dev)
    if '--check' in args:
        same = os.path.exists(out) and open(out, encoding='utf-8').read() == html
        print('up to date' if same else f'{os.path.relpath(out, ROOT)} is stale: run python3 build.py')
        sys.exit(0 if same else 1)
    with open(out, 'w', encoding='utf-8') as f: f.write(html)
    print(f'wrote {os.path.relpath(out, ROOT)} ({len(html.encode()) / 1e6:.2f} MB, {"PRIVATE build with dev mode" if dev else "public build, no dev mode"})')


if __name__ == '__main__':
    main()
