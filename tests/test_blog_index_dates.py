import importlib.util
import unittest
from datetime import date
from pathlib import Path

SPEC = importlib.util.spec_from_file_location(
    "build_blog_index", Path(__file__).resolve().parents[1] / "scripts/build_blog_index.py"
)
assert SPEC and SPEC.loader
blog_index = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(blog_index)


class BlogIndexDateTests(unittest.TestCase):
    def test_visible_dates_use_the_current_year_by_default(self):
        self.assertEqual(
            blog_index.parse_label("Jan 3"),
            date(date.today().year, 1, 3),
        )

    def test_visible_dates_accept_an_explicit_year(self):
        self.assertEqual(blog_index.parse_label("Dec 31", 2027), date(2027, 12, 31))


if __name__ == "__main__":
    unittest.main()
