#!/usr/bin/env python3
"""Generate Arabic markup from index.html without runtime translation flicker.

Edit English structure in index.html and Arabic copy in locales/ar.json, then run
python3 build-locales.py. Product model names and specification values remain
original; sourceLabels identifies text that must render left-to-right.
"""
from html import escape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parent
LOCALE = json.loads((ROOT / 'locales/ar.json').read_text())
TEXT = LOCALE['text']
SOURCE_LABELS = set(LOCALE['sourceLabels'])
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}
TRANSLATED_ATTRIBUTES = {'alt', 'aria-label', 'placeholder', 'title', 'data-fp-label'}

class ArabicPage(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.output = []
        self.stack = []
        self.missing = set()

    def translate(self, value):
        normalized = ' '.join(value.split())
        if normalized in TEXT:
            return TEXT[normalized]
        if normalized in SOURCE_LABELS or not re.search('[A-Za-z]', normalized):
            return normalized
        self.missing.add(normalized)
        return normalized

    def start(self, tag, attrs, self_closing=False):
        attrs = dict(attrs)
        if tag == 'html':
            attrs.update(lang='ar', dir='rtl')
        for key, value in list(attrs.items()):
            if key in TRANSLATED_ATTRIBUTES and value:
                attrs[key] = self.translate(value)
            if key in {'href', 'action'} and value and value.startswith('http://localhost:4318'):
                url = urlsplit(value)
                path = '/ar' + (url.path if url.path != '/' else '')
                attrs[key] = urlunsplit((url.scheme, url.netloc, path, url.query, url.fragment))
        if attrs.get('data-locale'):
            attrs.pop('aria-current', None)
            if attrs['data-locale'] == 'ar':
                attrs['aria-current'] = 'page'
        if tag == 'input' and attrs.get('type') not in {'hidden', 'submit', 'button'}:
            attrs['dir'] = 'ltr' if attrs.get('type') == 'email' else 'auto'
        if tag == 'textarea':
            attrs['dir'] = 'auto'
        rendered = ''.join(f' {key}' if value is None else f' {key}="{escape(value, quote=True)}"' for key, value in attrs.items())
        self.output.append(f'<{tag}{rendered}{" /" if self_closing else ""}>')
        if not self_closing and tag not in VOID:
            self.stack.append(tag)

    def handle_starttag(self, tag, attrs):
        self.start(tag, attrs)

    def handle_startendtag(self, tag, attrs):
        self.start(tag, attrs, True)

    def handle_endtag(self, tag):
        self.output.append(f'</{tag}>')
        if self.stack and tag in self.stack:
            while self.stack.pop() != tag:
                pass

    def handle_data(self, data):
        if any(tag in {'style', 'script'} for tag in self.stack) or not data.strip():
            self.output.append(data)
            return
        normalized = ' '.join(data.split())
        translated = self.translate(data)
        leading = re.match(r'\s*', data).group()
        trailing = re.search(r'\s*$', data).group()
        text = escape(translated, quote=False)
        if normalized in SOURCE_LABELS and self.stack[-1] not in {'title', 'option'}:
            text = f'<bdi dir="ltr" lang="en">{text}</bdi>'
        self.output.append(leading + text + trailing)

    def handle_decl(self, data):
        self.output.append(f'<!{data}>')

    def handle_comment(self, data):
        self.output.append(f'<!--{data}-->')

parser = ArabicPage()
parser.feed((ROOT / 'index.html').read_text())
if parser.missing:
    raise SystemExit('Missing Arabic translations:\n' + '\n'.join(sorted(parser.missing)))
(ROOT / 'ar.html').write_text(''.join(parser.output))
print('Generated ar.html with complete Arabic copy and shared assets.')
