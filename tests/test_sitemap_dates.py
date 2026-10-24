import contextlib
import importlib.util
import io
import os
import tempfile
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location(
    "build_sitemap", Path(__file__).resolve().parents[1] / "scripts/build_sitemap.py"
)
sitemap = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(sitemap)


class SitemapDatesTests(unittest.TestCase):
    def test_dates_stay_with_their_own_link(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "blog").mkdir()
            (root / "blog/index.html").write_text(
                '<a data-published="2025-08-01" href="/blog/first.html">First</a>'
                '<a href="/blog/second.html" data-published="2026-07-02">Second</a>'
                '<a href="/blog/undated.html">Undated</a>'
            )
            for name in ["first", "second", "undated"]:
                (root / f"blog/{name}.html").write_text("<h1>Post</h1>")
            previous = Path.cwd()
            try:
                with patch.object(sitemap, "__file__", str(root / "scripts/build_sitemap.py")):
                    with contextlib.redirect_stdout(io.StringIO()):
                        sitemap.main()
            finally:
                os.chdir(previous)
            ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
            dates = {
                entry.find("s:loc", ns).text: entry.find("s:lastmod", ns).text
                for entry in ET.parse(root / "sitemap.xml").getroot()
            }
            self.assertEqual(dates[sitemap.BASE + "/blog/first.html"], "2025-08-01")
            self.assertEqual(dates[sitemap.BASE + "/blog/second.html"], "2026-07-02")
            self.assertEqual(dates[sitemap.BASE + "/blog/undated.html"], sitemap.TODAY)


if __name__ == "__main__":
    unittest.main()
