"""Publish the selected supplier preview's markup and assets into the main app.

The original EN/AR documents remain the reviewed source. Runtime behavior and
scoped styles live in supplier-home-runtime.tsx and supplier-home.css.
"""

import json
import re
import shutil
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "previews/supplier-direction"
DESTINATION = ROOT / "public/images/supplier-home"
OUTPUT = ROOT / "src/features/landing/supplier-home-markup.json"


def local_url(value, locale):
    if value == "./index.html":
        return "/"
    if value == "./ar.html":
        return "/ar"
    if value == "#":
        return "/ar" if locale == "ar" else "/"
    if value.startswith("http://localhost:4318"):
        parsed = urlsplit(value)
        path = re.sub(r"^/ar(?=/|$)", "", parsed.path) or "/"
        if locale == "ar":
            path = "/ar" + (path if path != "/" else "")
        return urlunsplit(("", "", path, parsed.query, parsed.fragment))
    return value


def markup(locale):
    source = SOURCE / ("ar.html" if locale == "ar" else "index.html")
    html = source.read_text()
    body = re.search(r"<body[^>]*>(.*?)</body>", html, re.S).group(1)
    body = re.sub(r"<script\b[^>]*>.*?</script>", "", body, flags=re.S)
    body = re.sub(r'<div class="proposal">.*?</div>', "", body, count=1, flags=re.S)

    def anchor(match):
        content = match.group(0)
        href = re.search(r'href="([^"]*)"', content)
        if not href:
            return content
        old = href.group(1)
        new = local_url(old, locale)
        content = content.replace(f'href="{old}"', f'href="{new}"', 1)
        if new.startswith("/") or new.startswith("#"):
            content = re.sub(r'\s+target="_blank"', "", content)
            content = re.sub(r'\s+rel="noopener(?: noreferrer)?"', "", content)
            content = content.replace(" (opens in a new tab)", "")
            content = content.replace(" (يفتح في علامة تبويب جديدة)", "")
        return content

    body = re.sub(r"<a\b[^>]*>.*?</a\s*>", anchor, body, flags=re.S)

    def form(match):
        tag = match.group(0)
        action = re.search(r'action="([^"]*)"', tag)
        if action:
            tag = tag.replace(action.group(1), local_url(action.group(1), locale), 1)
            tag = re.sub(r'\s+target="_blank"', "", tag)
        return tag

    body = re.sub(r"<form\b[^>]*>", form, body, flags=re.S)
    body = body.replace("./assets/", "/images/supplier-home/")
    body = body.replace("<main>", '<main id="main-content" tabindex="-1">', 1)
    skip = "الانتقال إلى المحتوى" if locale == "ar" else "Skip to content"
    return f'<a class="supplier-skip" href="#main-content">{skip}</a>\n' + body.strip()


rendered = {locale: markup(locale) for locale in ("en", "ar")}
OUTPUT.write_text(json.dumps(rendered, ensure_ascii=False, indent=2) + "\n")

assets = set()
for file in [SOURCE / "index.html", SOURCE / "ar.html", *SOURCE.glob("*.css")]:
    assets.update(re.findall(r'\./assets/([^\s\"\'()<>?]+)', file.read_text()))
for relative in sorted(assets):
    source = SOURCE / "assets" / relative
    destination = DESTINATION / relative
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)

print(f"Prepared EN/AR supplier homepage markup and {len(assets)} referenced assets.")

# Keep the refinement stylesheet identical in the preview and production app.
shutil.copy2(
    SOURCE / "corporate-refinement.css",
    ROOT / "src/features/landing/supplier-home-refinement.css",
)
