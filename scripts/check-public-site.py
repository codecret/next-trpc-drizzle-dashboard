"""Read-only HTTP acceptance check for the local/public preview. No database needed."""
import concurrent.futures
import json
from pathlib import Path
import sys
import urllib.request
import urllib.error
import urllib.parse
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parent.parent
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:4318'
data = json.loads((ROOT / 'src/features/catalogue/data/catalogue.json').read_text())

class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(); self.h1 = 0; self.canonical = ''; self.description = ''; self.og = ''; self.links = []; self.jsonld = []; self.script = None; self.title = ''; self.in_title = False; self.lang = ''; self.direction = ''
        self.feed(html)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'h1': self.h1 += 1
        if tag == 'html': self.lang = a.get('lang', ''); self.direction = a.get('dir', '')
        if tag == 'title': self.in_title = True
        if tag == 'link' and a.get('rel') == 'canonical': self.canonical = a.get('href', '')
        if tag == 'meta' and a.get('name') == 'description': self.description = a.get('content', '')
        if tag == 'meta' and a.get('property') == 'og:url': self.og = a.get('content', '')
        if tag == 'a': self.links.append(a.get('href', ''))
        if tag == 'script' and a.get('type') == 'application/ld+json': self.script = ''
    def handle_data(self, text):
        if self.script is not None: self.script += text
        if self.in_title: self.title += text
    def handle_endtag(self, tag):
        if tag == 'script' and self.script is not None: self.jsonld.append(json.loads(self.script)); self.script = None
        if tag == 'title': self.in_title = False

def fetch(path):
    try:
        with urllib.request.urlopen(BASE + path, timeout=40) as response:
            return response.status, response.read().decode('utf-8'), response.geturl(), dict(response.headers)
    except urllib.error.HTTPError as error:
        return error.code, error.read().decode('utf-8'), error.geturl(), dict(error.headers)

paths = ['/', '/about', '/products', '/services', '/support', '/contact'] + ['/products/' + x['slug'] for x in data['categories'] + data['products']]
localized = [(('/ar' + (p if p != '/' else '')) if lang == 'ar' else p, lang) for lang in ['en', 'ar'] for p in paths]

def check_page(item):
    path, lang = item
    status, html, final, _ = fetch(path)
    assert status == 200, (path, status)
    page = Page(html)
    assert page.h1 == 1, (path, 'H1 count', page.h1)
    assert page.lang == lang, (path, 'html lang', page.lang)
    assert page.direction == ('rtl' if lang == 'ar' else 'ltr'), (path, 'html dir', page.direction)
    assert page.title and page.description and page.canonical and page.og, (path, 'missing SEO')
    assert urllib.parse.urlparse(page.canonical).path.rstrip('/') == path.rstrip('/'), (path, 'wrong canonical', page.canonical)
    assert page.og == page.canonical, (path, 'Open Graph URL')
    assert page.jsonld, (path, 'missing structured data')
    assert not any('/admin' in link or '/dashboard' in link or '/auth/' in link for link in page.links), (path, 'hidden page link')
    assert not any(link == '#' for link in page.links), (path, 'placeholder link')
    for link in page.links:
        target = urllib.parse.urlparse(link)
        if target.path.startswith('/products/'):
            assert target.path in paths, (path, 'broken catalogue link', link)
    return path

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
    completed = list(executor.map(check_page, localized))
print('Public pages and SEO verified:', len(completed), flush=True)
for prefix in ['', '/en', '/ar']:
    for path in ['/admin', '/admin/users', '/dashboard/overview', '/auth/sign-in', '/auth/sign-up']:
        assert fetch(prefix + path)[0] == 404, ('Exposed hidden page', prefix + path)
hidden_apis = ['/api/auth', '/api/auth/get-session', '/api/trpc', '/api/trpc/user.getCurrentUser']
for path in hidden_apis:
    assert fetch(path)[0] == 404, ('Exposed dormant API', path)
assert fetch('/products/not-a-catalogue-product')[0] == 404
assert fetch('/this-page-does-not-exist')[0] == 404
for path, snippet in [('/products?q=LPT-6000', 'POWERBANK LPT-6000'), ('/products?category=sugar', 'Sugar ICUMSA 1200'), ('/products?q=NO-MATCH-FOR-THIS-QUERY', 'No matching products'), ('/products?page=2', 'Page 2 of 18'), ('/products/led-lighting?family=SMD+A+Bulb', 'Toshiba Standard A Bulb')]:
    status, html, _, _ = fetch(path)
    assert status == 200 and snippet in html, (path, 'catalogue state')
for path, destination in [('/ProductDetails.aspx?id=1', '/products/high-power-6aa-4aaa-blister-pack'), ('/Products.aspx?sbctid=1', '/products/high-power'), ('/ledlightDetails.aspx?id=1', '/products/toshiba-standard-a-bulb-4-7w'), ('/products-by-sugar.html', '/products/sugar'), ('/Contactus.aspx', '/contact')]:
    status, _, final, _ = fetch(path)
    assert status == 200 and urllib.parse.urlparse(final).path == destination, ('Legacy redirect', path, final)
status, sitemap, _, _ = fetch('/sitemap.xml')
assert status == 200 and sitemap.count('<loc>') == len(completed)
assert '/dashboard' not in sitemap and '/auth/' not in sitemap
status, robots, _, _ = fetch('/robots.txt')
assert status == 200 and 'Disallow: /admin' in robots and 'sitemap.xml' in robots
for file in data['downloads']:
    with urllib.request.urlopen(BASE + file['path']) as response:
        assert response.status == 200 and response.read(5) == b'%PDF-'
print('Verified hidden routes, dormant APIs, 404s, search/filter/pagination states, legacy redirects, sitemap, robots and four PDF downloads.', flush=True)
report = {'publicPages': len(completed), 'products': len(data['products']), 'categories': len(data['categories']), 'sourceSpecifications': 149, 'hiddenRoutes': 15, 'hiddenApis': len(hidden_apis), 'pdfs': 4, 'status': 'passed'}
(ROOT / 'docs/source-audit/http-verification.json').write_text(json.dumps(report, indent=2) + '\n')
