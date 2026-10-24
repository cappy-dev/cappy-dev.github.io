import contextlib
import importlib.util
import io
import json
import tempfile
import unittest
from pathlib import Path

SPEC = importlib.util.spec_from_file_location(
    "check_site", Path(__file__).resolve().parents[1] / "scripts/check_site.py"
)
checker = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(checker)


class CoverageTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        previous = checker.ROOT
        checker.ROOT = self.root
        self.addCleanup(setattr, checker, "ROOT", previous)
        (self.root / "blog").mkdir()
        (self.root / "data").mkdir()
        (self.root / "blog/post.html").write_text("<h1>Post</h1>")
        (self.root / "blog/index.html").write_text('<a class="post-row" href="/blog/post.html">Post</a>')
        (self.root / "projects.html").write_text('<a href="https://github.com/cappy-dev/example">Example</a>')
        (self.root / "data/repositories.json").write_text(json.dumps([
            {"name": "example", "url": "https://github.com/cappy-dev/example"}
        ]))

    def run_check(self):
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            result = checker.check()
        return result, output.getvalue()

    def test_complete_catalog_passes(self):
        self.assertFalse(self.run_check()[0])

    def test_unlisted_article_fails(self):
        (self.root / "blog/unlisted.html").write_text("<h1>Unlisted</h1>")
        result, output = self.run_check()
        self.assertTrue(result)
        self.assertIn("unlisted article unlisted.html", output)

    def test_unlisted_repository_fails(self):
        (self.root / "projects.html").write_text("<h1>Projects</h1>")
        result, output = self.run_check()
        self.assertTrue(result)
        self.assertIn("unlisted repository example", output)


if __name__ == "__main__":
    unittest.main()
