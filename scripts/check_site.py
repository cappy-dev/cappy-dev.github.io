#!/usr/bin/env python3
"""Check static pages without a build or third-party packages."""

import json
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://cappy-dev.github.io/"


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = []
        self.categories = []
        self.category = None
        self.depth = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        for key in ("href", "src"):
            if attrs.get(key):
                self.links.append(attrs[key])
        if tag == "div":
            self.depth += 1
            if "projects-cat" in attrs.get("class", "").split():
                self.category = [int(attrs["data-count"]), 0, self.depth]
        if tag == "a" and self.category and "project-card" in attrs.get("class", "").split():
            self.category[1] += 1

    def handle_endtag(self, tag):
        if tag == "div":
            if self.category and self.depth == self.category[2]:
                self.categories.append(self.category[:2])
                self.category = None
            self.depth -= 1


def check():
    errors = []
    pages = sorted(ROOT.rglob("*.html"))
    references = 0
    for file in pages:
        page = Page()
        page.feed(file.read_text())
        relative = file.relative_to(ROOT)
        for identifier, count in Counter(page.ids).items():
            if count > 1:
                errors.append(f"{relative}: duplicate ID {identifier}")
        for expected, actual in page.categories:
            if expected != actual:
                errors.append(f"{relative}: category declares {expected}, contains {actual}")
        for link in page.links:
            target = urlsplit(urljoin(ORIGIN + str(relative), link))
            if target.netloc != urlsplit(ORIGIN).netloc:
                continue
            path = ROOT / unquote(target.path.lstrip("/"))
            if path.is_dir():
                path /= "index.html"
            references += 1
            if not path.is_file():
                errors.append(f"{relative}: missing {link}")
            elif target.fragment:
                target_page = Page()
                target_page.feed(path.read_text())
                if target.fragment not in target_page.ids:
                    errors.append(f"{relative}: missing anchor {link}")
    index = Page()
    index.feed((ROOT / "blog/index.html").read_text())
    indexed = {urlsplit(urljoin(ORIGIN + "blog/index.html", link)).path for link in index.links}
    for article in sorted((ROOT / "blog").glob("*.html")):
        if article.name != "index.html" and f"/blog/{article.name}" not in indexed:
            errors.append(f"blog/index.html: unlisted article {article.name}")
    catalog = ROOT / "data/repositories.json"
    if catalog.exists():
        projects = Page()
        projects.feed((ROOT / "projects.html").read_text())
        linked = {link.rstrip("/") for link in projects.links}
        for repository in json.loads(catalog.read_text()):
            if repository["url"].rstrip("/") not in linked:
                errors.append(f"projects.html: unlisted repository {repository['name']}")
    for error in errors:
        print(error)
    print(f"Checked {len(pages)} HTML files and {references} local references; {len(errors)} errors.")
    return bool(errors)


if __name__ == "__main__":
    raise SystemExit(check())
