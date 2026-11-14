#!/usr/bin/env python3
"""Build crawlable pages for the ICJF site.

Reads _shell.html and data/, writes one index.html per page and news post at
/<slug>/index.html (the same addresses the old WordPress site used), plus the
home page, 404.html, the /media/ redirect, sitemap.xml and robots.txt.

The front end (assets/site.js) still renders every page in the browser; the
pre-rendered HTML gives search engines and link previews real titles,
descriptions, structured data and content.

Settings live in site.json:
  origin   public address of the live site (used for canonical links)
  base     path the site is served from (/icjf-website/ on the prototype, / at launch)
  noindex  true keeps search engines out (prototype); set false at launch
"""
import json, os, re, html, glob, shutil, hashlib, base64, datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
CFG = json.load(open('site.json'))
ORIGIN, BASE, NOINDEX = CFG['origin'].rstrip('/'), CFG['base'], CFG.get('noindex', True)
NAME = 'International Catholic Jurists Forum'
SHORT = 'ICJF'
SITE_DESC = ('The International Catholic Jurists Forum (ICJF) is a forum for Catholic jurists and scholars '
             'to study, research, and discuss important issues of the day related to attacks on the rights '
             'of the family, life, and religious freedom.')
OG_DEFAULT = 'img/og-default.jpg'

shell = open('_shell.html').read()
ver = hashlib.sha1((open('assets/site.css').read() + open('assets/site.js').read()).encode()).hexdigest()[:10]
shell = shell.replace('{{BASE}}', BASE).replace('{{V}}', ver)
# Analytics: set "goatcounter" in site.json to the account code (the part before .goatcounter.com).
GC = (CFG.get('goatcounter') or '').strip()
shell = shell.replace('{{ANALYTICS}}', f'<script data-goatcounter="https://{GC}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>' if GC else '')

import cms_merge, extract_images
cms_merge.run()
extract_images.run()
IDX = json.load(open('data/index.json'))
PAGES = IDX['pages']
POSTS = IDX['posts']
CHUNKS = {}


def chunk(c):
    if c not in CHUNKS:
        CHUNKS[c] = json.load(open(f'data/n/{c}.json'))
    return CHUNKS[c]


def esc(s):
    return html.escape(s or '', quote=True)


def strip(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s or ''))).strip()


def clip(s, n=158):
    s = strip(s)
    if len(s) <= n:
        return s
    cut = s[:n].rsplit(' ', 1)[0].rstrip(',;:.')
    return cut + '…'


def path_for(slug):
    return '' if slug in ('', 'home') else slug + '/'


def url_for(slug):
    return ORIGIN + '/' + path_for(slug)


DATA_IMG = re.compile(r'''<img\b[^>]*\bsrc=["']data:[^"']*["'][^>]*>''', re.I)


def clean_html(h):
    """Prepare stored page HTML for the static copy: real links, no inline base64 images."""
    h = h or ''
    h = DATA_IMG.sub('', h)
    h = re.sub(r'src=["\']data:[^"\']*["\']', 'src=""', h)
    h = re.sub(r'href="#([a-z0-9-]*)"', lambda m: f'href="{path_for(m.group(1)) or "./"}"', h)
    h = re.sub(r'<iframe\b[^>]*>.*?</iframe>', '', h, flags=re.S | re.I)
    return h


def save_img(data_uri, path):
    """Write a base64 data URI to a file (for link previews). Returns the path or None."""
    if data_uri and not data_uri.startswith('data:'):
        return data_uri.lstrip('/') if os.path.exists(data_uri.lstrip('/')) else None
    m = re.match(r'data:image/(\w+);base64,(.*)', data_uri or '', re.S)
    if not m:
        return None
    os.makedirs(os.path.dirname(path), exist_ok=True)
    raw = base64.b64decode(m.group(2))
    if not os.path.exists(path) or open(path, 'rb').read() != raw:
        open(path, 'wb').write(raw)
    return path


ORG_LD = {
    '@context': 'https://schema.org', '@type': 'Organization', '@id': ORIGIN + '/#org',
    'name': NAME, 'alternateName': [SHORT, 'International Center on Law, Life, Faith and Family'],
    'url': ORIGIN + '/', 'logo': ORIGIN + '/img/icjf-seal.png', 'description': SITE_DESC,
    'email': 'icjuristsforum@gmail.com',
}


def head(title, desc, slug, img=None, typ='website', ld=None, extra=''):
    full = NAME if slug == 'home' else f'{title} · {NAME}'
    img_url = ORIGIN + '/' + (img or OG_DEFAULT)
    out = [
        f'<title>{esc(full)}</title>',
        f'<meta name="description" content="{esc(desc)}">',
        '<meta name="robots" content="noindex, nofollow">' if NOINDEX else '<meta name="robots" content="index, follow, max-image-preview:large">',
        f'<link rel="canonical" href="{esc(url_for(slug))}" data-origin="{esc(ORIGIN)}">',
        f'<meta property="og:site_name" content="{esc(NAME)}">',
        f'<meta property="og:type" content="{typ}">',
        f'<meta property="og:title" content="{esc(title if slug != "home" else NAME)}">',
        f'<meta property="og:description" content="{esc(desc)}">',
        f'<meta property="og:url" content="{esc(url_for(slug))}">',
        f'<meta property="og:image" content="{esc(img_url)}">',
        '<meta name="twitter:card" content="summary_large_image">',
    ]
    blocks = [ORG_LD] + (ld or [])
    out.append('<script type="application/ld+json">' + json.dumps(blocks if len(blocks) > 1 else blocks[0], ensure_ascii=False).replace('</', '<\\/') + '</script>')
    return '\n'.join(out) + extra


def crumbs_ld(items):
    return {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': url_for(s)} for i, (n, s) in enumerate(items)]}


written = []


def write(slug, head_html, content, lastmod=None, priority=None):
    out = shell.replace('{{HEAD}}', head_html).replace('{{CONTENT}}', content)
    path = os.path.join(path_for(slug), 'index.html') if slug != 'home' else 'index.html'
    if os.path.dirname(path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
    if not os.path.exists(path) or open(path).read() != out:
        open(path, 'w').write(out)
    written.append((slug, lastmod, priority))


# ---------- link previews ----------
HERO = json.load(open('data/hero.json'))
save_img(HERO.get('seal'), 'img/icjf-seal.webp')
if not os.path.exists(OG_DEFAULT) or not os.path.exists('img/icjf-seal.png'):
    print('note: run tools/make_og.py to create the default share image and seal PNG')

# ---------- pages ----------
PARENTS = {'how-we-started': 'About', 'what-we-stand-for': 'About', 'who-we-are': 'About'}
page_files = {os.path.basename(f)[:-5]: f for f in glob.glob('data/p/*.json')}
nav_links = []
for slug, meta in sorted(PAGES.items()):
    f = page_files.get(slug)
    if not f:
        continue
    p = json.load(open(f))
    title = p.get('title') or meta.get('title') or slug
    kind = p.get('kind')
    ld = []
    img = None
    body = [f'<h1>{esc(title)}</h1>']
    if kind == 'person':
        role = (p.get('role') or '').title()
        bio = p.get('html', '')
        desc = clip(bio) or f'{title}, {NAME}.'
        img = save_img(p.get('img'), f'img/people/{slug}.webp')
        if role:
            body.append(f'<p><em>{esc(role)}</em></p>')
        if img:
            body.append(f'<img src="{img}" alt="{esc(p.get("name") or title)}" width="212" height="293">')
        body.append(clean_html(bio))
        person = {'@context': 'https://schema.org', '@type': 'Person', 'name': p.get('name') or title,
                  'description': desc, 'url': url_for(slug), 'affiliation': {'@id': ORIGIN + '/#org'}}
        if role:
            person['jobTitle'] = role
        if img:
            person['image'] = ORIGIN + '/' + img
        ld += [person, crumbs_ld([('Home', 'home'), ('Who We Are', 'who-we-are'), (title, slug)])]
        typ = 'profile'
    elif kind == 'tiles':
        parts = []
        for sec in p.get('sections', []):
            if sec.get('heading'):
                parts.append(f'<h2>{esc(sec["heading"])}</h2>')
            items = []
            for c in sec.get('cards', []):
                href = c.get('href') or ''
                href = (path_for(href[1:]) or './') if href.startswith('#') else href
                sub = ''.join(f' <small>{esc(x)}</small>' for x in (c.get('sub') or []))
                items.append(f'<li><a href="{esc(href)}">{esc(c.get("title"))}</a>{sub}</li>')
            parts.append('<ul>' + ''.join(items) + '</ul>')
        body.append(clean_html(p.get('html', '')))
        body += parts
        desc = clip(p.get('text', '').replace(title, '', 1)) or f'{title} from the {NAME}.'
        ld.append(crumbs_ld([('Home', 'home'), (title, slug)]))
        typ = 'website'
    elif kind == 'timeline':
        for it in p.get('items', []):
            body.append(clean_html(it.get('html', '')))
        desc = 'Conferences organized, co-hosted, and co-sponsored by the International Catholic Jurists Forum, from Rome to Warsaw, Madrid, Washington, and beyond.'
        events = []
        for it in p.get('items', [])[:30]:
            h = it.get('html', '')
            m = re.search(r'<strong>(.*?)</strong>', h)
            if m:
                events.append({'@type': 'Event', 'name': strip(m.group(1)), 'description': clip(h, 300),
                               'organizer': {'@id': ORIGIN + '/#org'}})
        ld += [{'@context': 'https://schema.org', '@type': 'ItemList', 'itemListElement': [
            {'@type': 'ListItem', 'position': i + 1, 'item': e} for i, e in enumerate(events)]},
            crumbs_ld([('Home', 'home'), (title, slug)])]
        typ = 'website'
    else:
        h = p.get('html', '')
        body.append(clean_html(h))
        desc = clip(re.sub(r'^\s*' + re.escape(title), '', strip(h))) or f'{title}, {NAME}.'
        crumbs = [('Home', 'home')]
        if slug in PARENTS:
            crumbs.append((PARENTS[slug], 'who-we-are' if slug != 'who-we-are' else 'how-we-started'))
        ld.append(crumbs_ld(crumbs + [(title, slug)]))
        typ = 'article' if kind == 'article' else 'website'
    if slug == 'contact':
        desc = 'Contact the International Catholic Jurists Forum.'
    if slug == 'donate':
        desc = 'Support the work of the International Catholic Jurists Forum.'
    write(slug, head(title, desc, slug, img, typ, ld), '\n'.join(body), p.get('modified'))
    nav_links.append((title, slug, kind))

# ---------- pages drawn only by the front end ----------
if 'donate' not in {w[0] for w in written}:
    write('donate', head('Support the Forum', 'Support the work of the International Catholic Jurists Forum.', 'donate',
                         ld=[crumbs_ld([('Home', 'home'), ('Donate', 'donate')])]),
          '<h1>Support the Forum</h1><p>Gifts to the Forum support its conferences, books, podcasts, and research on the rights '
          'of the family, life, and religious freedom.</p><p>To give by check, stock, or donor-advised fund, '
          f'<a href="{path_for("contact")}">contact the Forum</a>.</p>')

# ---------- news ----------
posts_sorted = sorted(POSTS, key=lambda x: x['date'], reverse=True)
for i, meta in enumerate(posts_sorted):
    slug = meta['slug']
    body_html = chunk(meta['c']).get(slug, '')
    desc = clip(meta.get('excerpt') or body_html)
    tags = ', '.join(t for t in meta.get('tags', []) if t != 'News')
    content = (f'<p><a href="{path_for("news")}">News</a></p><h1>{esc(meta["title"])}</h1>'
               f'<p><time datetime="{meta["date"]}">{datetime.date.fromisoformat(meta["date"]).strftime("%B %-d, %Y")}</time>'
               + (f' · {esc(tags)}' if tags else '') + '</p>' + clean_html(body_html))
    ld = [{'@context': 'https://schema.org', '@type': 'NewsArticle', 'headline': meta['title'][:110],
           'datePublished': meta['date'], 'dateModified': meta['date'], 'description': desc,
           'mainEntityOfPage': url_for(slug), 'publisher': {'@id': ORIGIN + '/#org'},
           'author': {'@id': ORIGIN + '/#org'}, 'image': ORIGIN + '/' + OG_DEFAULT},
          crumbs_ld([('Home', 'home'), ('News', 'news'), (meta['title'], slug)])]
    extra = f'\n<meta property="article:published_time" content="{meta["date"]}">'
    write(slug, head(meta['title'], desc, slug, None, 'article', ld, extra), content, meta['date'])

news_list = ''.join(f'<li><a href="{path_for(m["slug"])}">{esc(m["title"])}</a> <small>{m["date"]}</small></li>' for m in posts_sorted)
write('news', head('News', f'News from the {NAME}: {len(POSTS)} articles on family, life, religious freedom, and the Church.', 'news',
                   ld=[crumbs_ld([('Home', 'home'), ('News', 'news')])]),
      f'<h1>News</h1><ul>{news_list}</ul>', posts_sorted[0]['date'] if posts_sorted else None)

# ---------- home ----------
SECTIONS = [('What We Stand For', 'what-we-stand-for'), ('How We Started', 'how-we-started'), ('Who We Are', 'who-we-are'),
            ('Projects', 'projects'), ('Books', 'books'), ('Conferences', 'conferences'), ('News', 'news'),
            ('Resources', 'resources-2'), ('Press', 'press'), ('Podcasts', 'podcast-series'), ('Contact', 'contact'), ('Donate', 'donate')]
home_body = (f'<h1>{NAME}</h1><p>{esc(SITE_DESC)}</p><nav><ul>'
             + ''.join(f'<li><a href="{path_for(s)}">{esc(t)}</a></li>' for t, s in SECTIONS)
             + '</ul></nav><h2>Latest news</h2><ul>'
             + ''.join(f'<li><a href="{path_for(m["slug"])}">{esc(m["title"])}</a></li>' for m in posts_sorted[:10]) + '</ul>')
website_ld = {'@context': 'https://schema.org', '@type': 'WebSite', 'name': NAME, 'url': ORIGIN + '/', 'publisher': {'@id': ORIGIN + '/#org'}}
write('home', head(NAME, SITE_DESC, 'home', ld=[website_ld]), home_body, None, '1.0')

# ---------- 404 and old addresses ----------
open('404.html', 'w').write(shell.replace('{{HEAD}}', f'<title>Page not found · {NAME}</title>\n<meta name="robots" content="noindex">').replace('{{CONTENT}}', '<h1>Page not found</h1>'))
REDIRECTS = {'media': 'press'}
REDIRECTS.update(CFG.get('redirects', {}))
for old, new in REDIRECTS.items():
    os.makedirs(old, exist_ok=True)
    target = BASE + path_for(new)
    open(os.path.join(old, 'index.html'), 'w').write(
        f'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Moved · {NAME}</title>'
        f'<link rel="canonical" href="{url_for(new)}"><meta name="robots" content="noindex">'
        f'<meta http-equiv="refresh" content="0; url={target}"><script>location.replace("{target}"+location.search)</script>'
        f'</head><body><p>This page has moved to <a href="{target}">{target}</a>.</p></body></html>')

# ---------- remove stale generated pages ----------
keep = {s for s, _, _ in written} | set(REDIRECTS)
manifest = '.generated'
old = set(open(manifest).read().split()) if os.path.exists(manifest) else set()
for s in old - keep:
    p = os.path.join(s, 'index.html')
    if os.path.exists(p):
        os.remove(p)
        try:
            os.rmdir(s)
        except OSError:
            pass
open(manifest, 'w').write('\n'.join(sorted(keep - {'home'})) + '\n')

# ---------- sitemap and robots ----------
today = datetime.date.today().isoformat()
urls = []
for slug, lastmod, pr in written:
    lm = lastmod if lastmod and re.match(r'\d{4}-\d{2}-\d{2}$', str(lastmod)) else today
    urls.append(f'<url><loc>{esc(url_for(slug))}</loc><lastmod>{lm}</lastmod></url>')
open('sitemap.xml', 'w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                               + '\n'.join(urls) + '\n</urlset>\n')
if NOINDEX:
    robots = 'User-agent: *\nDisallow: /\n'
else:
    robots = f'User-agent: *\nDisallow: /admin/\nDisallow: /data/\n\nSitemap: {ORIGIN}/sitemap.xml\n'
open('robots.txt', 'w').write(robots)
print(f'built {len(written)} pages, {len(REDIRECTS)} redirects; noindex={NOINDEX}; base={BASE}')
