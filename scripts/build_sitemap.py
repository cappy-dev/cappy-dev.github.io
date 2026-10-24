#!/usr/bin/env python3
"""Regenerate sitemap.xml from the actual files in blog/.

Includes the top-level pages plus every blog article, with lastmod taken
from the post's data-published date in blog/index.html when available,
falling to today for unindexed pages. Run after adding posts.
"""
import os
import re
from datetime import date
from html.parser import HTMLParser
from pathlib import Path

BASE = "https://cappy-dev.github.io"
TODAY = date.today().isoformat()


class PublishedDates(HTMLParser):
    def __init__(self):
        super().__init__()
        self.dates = {}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        match = re.fullmatch(r"/blog/([a-z0-9-]+)\.html", attrs.get("href") or "")
        published = attrs.get("data-published")
        if tag == "a" and match and published:
            self.dates[match[1]] = date.fromisoformat(published).isoformat()


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root)

    parser = PublishedDates()
    parser.feed(Path("blog/index.html").read_text())
    dates = parser.dates

    static = ["", "projects.html", "about.html", "blog/"]
    posts = sorted(f for f in os.listdir("blog")
                   if f.endswith(".html") and f != "index.html")

    urls = []
    for s in static:
        loc = BASE + ("/" + s if s else "/")
        urls.append((loc, TODAY))
    for p in sorted(posts):
        slug = p[:-5]
        urls.append((f"{BASE}/blog/{p}", dates.get(slug, TODAY)))

    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, lastmod in urls:
        out.append("  <url>")
        out.append(f"    <loc>{loc}</loc>")
        out.append(f"    <lastmod>{lastmod}</lastmod>")
        out.append("  </url>")
    out.append("</urlset>")
    Path("sitemap.xml").write_text("\n".join(out) + "\n")
    print(f"sitemap: {len(static)} static + {len(posts)} posts = {len(urls)} urls")


if __name__ == "__main__":
    main()
