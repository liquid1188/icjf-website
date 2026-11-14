"""Move images embedded in the data files out into real image files.

Older content stored photographs inside the JSON as base64 data URIs, which made
every page download every picture in a collection before it could render.
This step writes each embedded image to img/e/<hash>.<ext> (identical images
share one file) and puts the file path in its place, so browsers can cache
images and load offscreen ones only when needed. It also marks images inside
stored page HTML as lazy-loading.

Runs at the start of every build, so anything pasted in later as a data URI is
moved out automatically. Safe to run repeatedly.
"""
import base64, glob, hashlib, json, os, re

OUT = 'img/e'
DATA_URI = re.compile(r'data:image/(webp|jpeg|jpg|png|gif|avif);base64,([A-Za-z0-9+/=\s]+)')
IMG_TAG = re.compile(r'<img\b(?![^>]*\bloading=)', re.I)
EXT = {'jpeg': 'jpg'}


def _save(kind, b64):
    raw = base64.b64decode(re.sub(r'\s+', '', b64))
    name = hashlib.sha1(raw).hexdigest()[:16] + '.' + EXT.get(kind, kind)
    path = f'{OUT}/{name}'
    if not os.path.exists(path):
        os.makedirs(OUT, exist_ok=True)
        with open(path, 'wb') as f:
            f.write(raw)
    return path


def _fix(s):
    if 'data:image/' in s:
        s = DATA_URI.sub(lambda m: _save(m.group(1).lower(), m.group(2)), s)
    if '<img' in s:
        s = IMG_TAG.sub('<img loading="lazy" decoding="async"', s)
    return s


def _walk(v):
    if isinstance(v, str):
        return _fix(v)
    if isinstance(v, list):
        return [_walk(x) for x in v]
    if isinstance(v, dict):
        return {k: _walk(x) for k, x in v.items()}
    return v


def run():
    moved = 0
    files = ['data/hero.json', 'data/index.json'] + sorted(glob.glob('data/p/*.json')) + sorted(glob.glob('data/n/*.json'))
    for f in files:
        if not os.path.exists(f):
            continue
        raw = open(f, encoding='utf-8').read()
        if 'data:image/' not in raw and not IMG_TAG.search(raw):
            continue
        new = json.dumps(_walk(json.loads(raw)), ensure_ascii=False)
        if new != raw:
            open(f, 'w', encoding='utf-8').write(new)
            moved += 1
    if moved:
        print(f'extract_images: updated {moved} data files')


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    run()
