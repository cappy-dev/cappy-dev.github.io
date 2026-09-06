#!/usr/bin/env python3
"""Rebuild blog/index.html sorted by post date (newest first).

Reads every .post-row in blog/index.html, derives a date for each:
  1. data-published attribute if present
  2. YYYY-MM-DD in the href (daily-news posts)
  3. the visible date label ("Sep 6", "Jun 12", ...)
Sorts newest first, regenerates year/month dividers and the month nav,
stamps data-published on rows that lack it, and rewrites index.html.
Idempotent: run after every publish so ordering can never drift.
"""
import re
import sys
from datetime import date

INDEX = "blog/index.html"
MONTHS = {m: i for i, m in enumerate(
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], 1)}
FULL_MONTHS = ["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November",
               "December"]


def parse_label(label):
    m = re.match(r"([A-Z][a-z]{2})\s+(\d{1,2})", label.strip())
    if m and m.group(1) in MONTHS:
        return date(2026, MONTHS[m.group(1)], int(m.group(2)))
    return None


def derive_date(row, href):
    m = re.search(r'data-published="(\d{4}-\d{2}-\d{2})"', row)
    if m:
        return date.fromisoformat(m.group(1))
    m = re.search(r"(\d{4}-\d{2}-\d{2})", href)
    if m:
        return date.fromisoformat(m.group(1))
    m = re.search(r'<div class="post-date">([^<]+)', row)
    if m:
        return parse_label(m.group(1))
    return None


def main():
    html = open(INDEX).read()
    # split out the <section class="posts"> ... </section> body
    start = html.index('<section class="posts">')
    end = html.index("</section>", start) + len("</section>")
    posts_html = html[start:end]

    # capture everything between rows: dividers, whitespace
    pieces = re.split(r'(<a class="post-row.*?</a>)', posts_html, flags=re.S)
    rows = [p for p in pieces if p.startswith('<a class="post-row')]
    if not rows:
        sys.exit("no post rows found")

    parsed = []
    for row in rows:
        href_m = re.search(r'href="([^"]+)"', row)
        href = href_m.group(1) if href_m else ""
        d = derive_date(row, href)
        if d is None:
            print(f"WARN no date for {href}", file=sys.stderr)
            continue
        if 'data-published' not in row:
            row = row.replace('<a class="post-row',
                              f'<a data-published="{d.isoformat()}" class="post-row', 1)
        parsed.append((d, row))
    parsed.sort(key=lambda t: t[0], reverse=True)

    # rebuild body with dividers
    parts = ['<section class="posts">']
    last_ym = None
    for d, row in parsed:
        ym = (d.year, d.month)
        if ym != last_ym:
            anchor = "m-" + FULL_MONTHS[d.month - 1].lower()
            parts.append(f'\n<div class="post-month" data-divider id="{anchor}">'
                         f'{FULL_MONTHS[d.month - 1]}</div>\n')
            last_ym = ym
        parts.append(row)
    parts.append("</section>")
    new_posts = "".join(parts)
    html = html[:start] + new_posts + html[end:]

    # regenerate month nav from actual months present
    months_desc = sorted({(d.year, d.month) for d, _ in parsed}, reverse=True)
    nav_links = '\n'.join(
        f'            <a href="#m-{FULL_MONTHS[m - 1].lower()}">{FULL_MONTHS[m - 1]}</a>'
        + ('\n            <span aria-hidden="true">·</span>' if i < len(months_desc) - 1 else "")
        for i, (_, m) in enumerate(months_desc))
    html = re.sub(
        r'(<nav class="month-nav"[^>]*>).*?(</nav>)',
        lambda m: m.group(1) + "\n" + nav_links + "\n        " + m.group(2),
        html, count=1, flags=re.S)

    open(INDEX, "w").write(html)
    print(f"rebuilt index: {len(parsed)} posts, "
          f"{len(months_desc)} months, newest {parsed[0][0]}")


if __name__ == "__main__":
    main()
