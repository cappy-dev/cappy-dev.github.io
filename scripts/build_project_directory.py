#!/usr/bin/env python3
"""Render the public source repository snapshot into the projects page."""

import json
import re
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
START = "<!-- repository-directory:start -->"
END = "<!-- repository-directory:end -->"


def main():
    repositories = json.loads((ROOT / "data/repositories.json").read_text())
    links = "\n".join(
        f'            <li><a href="{escape(repo["url"], quote=True)}">{escape(repo["name"])}</a></li>'
        for repo in sorted(repositories, key=lambda repo: repo["name"].lower())
    )
    section = f'''{START}
    <section class="repository-directory" aria-labelledby="directory-title">
        <h2 id="directory-title">Repository directory</h2>
        <p>All active public repositories that GitHub lists as source repositories. The cards above are a selection.</p>
        <ul>
{links}
        </ul>
    </section>
    {END}'''
    path = ROOT / "projects.html"
    html = path.read_text()
    if START in html and END in html:
        html = re.sub(re.escape(START) + ".*?" + re.escape(END), lambda _: section, html, flags=re.S)
    else:
        html = html.replace("    </main>", section + "\n    </main>", 1)
    path.write_text(html)
    print(f"Repository directory: {len(repositories)} source repositories")


if __name__ == "__main__":
    main()
