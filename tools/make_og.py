"""Create img/icjf-seal.png and the default link-preview image img/og-default.jpg."""
import json, base64, io, os
from PIL import Image
from playwright.sync_api import sync_playwright
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
h = json.load(open('data/hero.json'))
seal = Image.open(io.BytesIO(base64.b64decode(h['seal'].split(',', 1)[1]))).convert('RGBA')
seal.save('img/icjf-seal.png', optimize=True)
html = f'''<html><head><link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Cormorant+Garamond:ital,wght@0,500;1,400&display=swap" rel="stylesheet">
<style>body{{margin:0;width:1200px;height:630px;background:#15130f;display:flex;align-items:center;gap:64px;padding:0 90px;box-sizing:border-box;color:#efe0bb}}
img{{width:380px;height:380px}}h1{{font-family:'Cormorant Garamond';font-weight:500;font-size:68px;line-height:1.02;margin:0 0 22px;color:#f6f1e7}}
p{{font-family:Cinzel;letter-spacing:.28em;font-size:19px;color:#d6b878;margin:0}}</style></head>
<body><img src="{h['seal']}"><div><h1>International<br>Catholic Jurists<br>Forum</h1><p>FAITH · FAMILY · LIFE · LAW</p></div></body></html>'''
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1200, 'height': 630})
    pg.set_content(html); pg.wait_for_timeout(1500)
    pg.screenshot(path='img/og-default.png'); b.close()
Image.open('img/og-default.png').convert('RGB').save('img/og-default.jpg', quality=88); os.remove('img/og-default.png')
print('ok')
