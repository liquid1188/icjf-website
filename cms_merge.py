"""Merge entries made in the site editor (content/) into the site's data files.

Each kind of entry lives in its own folder as a Markdown file with front matter:
  content/news/          news posts
  content/press/         Press page items
  content/conferences/   Conferences timeline entries
  content/books/         Books page items (with an optional book page)
  content/people/        Executive team and advisors (card plus bio page)
  content/pages/         stand-alone pages

Merged items are tagged "cms" in the data files, so each build removes the old
copies and adds the current ones. Hand-edited data is never touched.
"""
import json, os, re, glob, html, datetime
import markdown as md_lib

MD = md_lib.Markdown(extensions=['extra', 'sane_lists'])


def md(text):
    MD.reset()
    return MD.convert(text or '')


def read_entries(folder):
    out = []
    for f in sorted(glob.glob(f'content/{folder}/*.md')):
        raw = open(f, encoding='utf-8').read()
        m = re.match(r'^---\s*\n(.*?)\n---\s*\n?(.*)$', raw, re.S)
        meta, body = ({}, raw) if not m else (parse_yaml(m.group(1)), m.group(2))
        meta.setdefault('slug', os.path.basename(f)[:-3])
        meta['body'] = body.strip()
        if str(meta.get('draft', '')).lower() == 'true':
            continue
        out.append(meta)
    return out


def parse_yaml(s):
    try:
        import yaml
        return yaml.safe_load(s) or {}
    except ImportError:
        d = {}
        for line in s.splitlines():
            if ':' in line and not line.startswith(' '):
                k, v = line.split(':', 1)
                d[k.strip()] = v.strip().strip('"\'')
        return d


def esc(s):
    return html.escape(str(s or ''), quote=True)


def slugify(s):
    s = re.sub(r'[^a-z0-9]+', '-', str(s).lower()).strip('-')
    return s[:80] or 'item'


def link(href):
    """Turn a site address the editor typed (/who-we-are/ or a full URL) into the form the site uses."""
    href = str(href or '').strip()
    m = re.match(r'^(?:https?://(?:www\.)?icjurist\.org)?/([a-z0-9-]+)/?$', href)
    if m:
        return '#' + m.group(1)
    return href


def ext(href):
    return bool(re.match(r'^https?://', href or ''))


def img(path):
    p = str(path or '').strip()
    return p.lstrip('/') if p and not p.startswith(('http', 'data:')) else p


def load(path):
    return json.load(open(path, encoding='utf-8'))


def save(path, data):
    s = json.dumps(data, ensure_ascii=False)
    if not os.path.exists(path) or open(path, encoding='utf-8').read() != s:
        open(path, 'w', encoding='utf-8').write(s)


def date_words(d):
    try:
        return datetime.date.fromisoformat(str(d)[:10]).strftime('%B %-d, %Y')
    except ValueError:
        return str(d)


def run():
    if not os.path.isdir('content'):
        return
    idx = load('data/index.json')
    pages = idx['pages']
    made_pages = set()

    def write_page(slug, page):
        page['cms'] = True
        save(f'data/p/{slug}.json', page)
        pages[slug] = {'title': page['title'], 'kind': page['kind'], 'text': page.get('text', '')}
        made_pages.add(slug)

    # ----- news -----
    posts = [p for p in idx['posts'] if not p.get('cms')]
    bodies, thumbs = {}, {}
    for e in read_entries('news'):
        slug = e.get('slug') or slugify(e.get('title'))
        d = str(e.get('date') or datetime.date.today())[:10]
        body = ''
        if e.get('source') or e.get('author'):
            bits = [date_words(d)] + [x for x in (e.get('author'), e.get('source')) if x]
            body += f'<p>{esc(" | ".join(bits))}</p>\n'
        body += md(e['body'])
        if e.get('link'):
            body += f'\n<p><a href="{esc(e["link"])}" rel="noopener" target="_blank">View article</a></p>'
        tags = e.get('tags') or ['News']
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.split(',') if t.strip()]
        excerpt = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', body))).strip()[:220]
        posts.append({'slug': slug, 'title': e.get('title', slug), 'date': d, 'tags': tags,
                      'excerpt': excerpt, 'c': 'cms', 'img': bool(e.get('image')), 'cms': True})
        bodies[slug] = body
        if e.get('image'):
            thumbs[slug] = img(e['image'])
    posts.sort(key=lambda p: p['date'], reverse=True)
    idx['posts'] = posts
    save('data/n/cms.json', bodies)
    save('data/n/tcms.json', thumbs)

    # ----- press -----
    press = load('data/p/press.json')
    cards = [c for c in press['sections'][0]['cards'] if not c.get('cms')]
    new = []
    for e in sorted(read_entries('press'), key=lambda x: str(x.get('date') or ''), reverse=True):
        new.append({'href': link(e.get('link')), 'img': img(e.get('image')), 'title': e.get('title', ''),
                    'sub': [], 'ratio': 0.777, 'cms': True})
    press['sections'][0]['cards'] = new + cards
    save('data/p/press.json', press)
    if os.path.exists('data/p/media.json'):
        save('data/p/media.json', press | {'slug': 'media'})

    # ----- conferences -----
    conf = load('data/p/conferences.json')
    items = [i for i in conf['items'] if not i.get('cms')]
    new = []
    for e in read_entries('conferences'):
        when = e.get('dates') or ''
        h = f'<p>{esc(when)}{", " if when else ""}<strong>{esc(e.get("title"))}</strong>'
        if e.get('details'):
            h += ', ' + esc(e['details'])
        h += '</p>'
        if e['body']:
            h += md(e['body'])
        for lab, key in (('Program (PDF)', 'program'), ('Website', 'link'), ('Coverage', 'coverage')):
            if e.get(key):
                tgt = link(e[key])
                attrs = '' if tgt.startswith('#') else ' target="_blank" rel="noopener"'
                h += f'<p class="tl-more"><a href="{esc(img(tgt) if key == "program" else tgt)}"{attrs}>{lab}</a></p>'
        new.append({'year': str(e.get('year') or str(e.get('sort_date', ''))[:4]), 'html': h, 'cms': True,
                    '_sort': str(e.get('sort_date') or e.get('year') or '')})
    merged = new + items
    merged.sort(key=lambda i: (i.get('year') or ''), reverse=True)
    for i in merged:
        i.pop('_sort', None)
    conf['items'] = merged
    save('data/p/conferences.json', conf)

    # ----- books -----
    books = load('data/p/books.json')
    cards = [c for c in books['sections'][0]['cards'] if not c.get('cms')]
    new = []
    for e in read_entries('books'):
        slug = e.get('slug') or slugify(e.get('title'))
        href = link(e.get('link'))
        if e['body']:
            body = f'<h2>{esc(e.get("title"))}</h2>'
            if e.get('authors'):
                body += f'<p><em>{esc(e["authors"])}</em></p>'
            if e.get('cover'):
                body += f'<p><img src="{esc(img(e["cover"]))}" alt="Cover of {esc(e.get("title"))}"></p>'
            body += md(e['body'])
            if e.get('link'):
                body += f'<p><a href="{esc(e["link"])}" target="_blank" rel="noopener">Order the book</a></p>'
            write_page(slug, {'slug': slug, 'title': e.get('title', slug), 'kind': 'article',
                              'modified': str(datetime.date.today()), 'html': body,
                              'text': e.get('title', '') + ' ' + re.sub(r'<[^>]+>', ' ', body)})
            href = '#' + slug
        new.append({'href': href, 'img': img(e.get('cover')), 'title': e.get('title', ''),
                    'sub': [], 'ratio': 0.777, 'cms': True})
    books['sections'][0]['cards'] = new + cards
    save('data/p/books.json', books)

    # ----- people -----
    team = load('data/p/who-we-are.json')
    for sec in team['sections']:
        sec['cards'] = [c for c in sec['cards'] if not c.get('cms')]
    for e in sorted(read_entries('people'), key=lambda x: str(x.get('order', '999')).zfill(4)):
        slug = e.get('slug') or slugify(e.get('name'))
        name = e.get('name', slug)
        role = e.get('role') or ''
        bio = md(e['body'])
        write_page(slug, {'slug': slug, 'title': name, 'kind': 'person', 'modified': str(datetime.date.today()),
                          'img': img(e.get('photo')), 'role': role.upper(), 'name': name, 'html': bio,
                          'text': f'{role} {name} ' + re.sub(r'<[^>]+>', ' ', bio)})
        group = 'Executive Team' if str(e.get('group', '')).lower().startswith('exec') else 'Advisors'
        sec = next((s for s in team['sections'] if s.get('heading') == group), team['sections'][-1])
        card = {'href': '#' + slug, 'img': img(e.get('photo')), 'title': e.get('card_name') or name,
                'sub': [role] if role else [], 'ratio': 1.0, 'cms': True}
        if group == 'Advisors':
            last = lambda t: re.sub(r',.*$', '', t).split()[-1].lower()
            pos = next((i for i, c in enumerate(sec['cards']) if last(c['title']) > last(card['title'])), len(sec['cards']))
            sec['cards'].insert(pos, card)
        else:
            sec['cards'].append(card)
    save('data/p/who-we-are.json', team)

    # ----- pages -----
    for e in read_entries('pages'):
        slug = e.get('slug') or slugify(e.get('title'))
        body = md(e['body'])
        write_page(slug, {'slug': slug, 'title': e.get('title', slug), 'kind': 'article',
                          'modified': str(datetime.date.today()), 'html': body,
                          'text': e.get('title', '') + ' ' + re.sub(r'<[^>]+>', ' ', body)})

    # ----- remove pages whose editor entry was deleted -----
    for f in glob.glob('data/p/*.json'):
        slug = os.path.basename(f)[:-5]
        if slug in made_pages:
            continue
        try:
            if load(f).get('cms'):
                os.remove(f)
                pages.pop(slug, None)
        except (ValueError, OSError):
            pass

    save('data/index.json', idx)
