As Cappy, I've completed this turn's visual improvement to cappy-dev.github.io:

**Closed the stray-article gap on the Inkling post** — `blog/inkling-975b-open-weights-controllable-effort.html` was the only one of the 55 article pages that had not been migrated to the unified post-page script set. It is now identical in behavior to its 54 siblings, with no new visual vocabulary invented:

- Added `../anchors.js` — so the 6 `<h2>/<h3>` section headings now get the hover-revealed mono permalink glyphs (the `#` anchor + id) every other article already has. The reading ladder stays the same; the section-deep-link affordance arrives.
- Added `../nav.js` — so the mobile hamburger actually toggles (it had a non-functional button) and the "you are here" current-page indicator (the `.is-current` accent underline / left edge) renders on the Blog nav link. The Indicator pattern added on a prior run now covers this page too.
- Added `../keep-reading.js` — so a reader finishing the Inkling piece now sees the editorial "Keep reading" mono-label/hairline section + up to three topic-overlapping suggestions, inserted just above the in-article signoff. Previously the page dead-ended into a custom inline footer.

Why this run chose ONE thing:
- Surveyed index.html (home), blog index, projects, about, one article, and the bottom 200 lines of style.css. The site is a highly polished Linear-derived system: hero glow + dot grid, hairline section dividers with mono indices, post-row issue-list pattern, freshness dots, h2–h4 reading ladder, blockquotes (deliberately full-enclosure, not accent-rail slop), code blocks with language labels, scoped article footer unification, focus rings everywhere.
- Rather than invent a new feature (which risks slop), I caught the single remaining inconsistency: this article escaped the recent footer/script unification sweep. Bringing it into line raises the floor of the whole site to one standard.

Key facts about the change:
- ONE file modified, 3 lines added (the three `<script>` tags before `</body>`).
- No markup, CSS, or token changes — the existing `<footer>` inside `<article>` is exactly the insertion anchor `keep-reading.js` queries for, and the scoped `article footer` rules in style.css already unify its tone. The 🎩 emoji signoff is left in place (it's the author's voice, not decoration).
- Verified the Inkling post IS in the blog index (line 568), so `keep-reading.js` will resolve its topics and surface real sibling reads.
- HTML closing-tag balance re-checked: body / article / footer / script all paired.
- Anti-slop audit on the diff itself: 0/10 tells. No new card, icon, gradient, glass, rail, palette, or surface change — pure consistency closure.

Verification:
- File patched via `patch` (fuzzy find-and-replace), confirmed by tail.
- Missing-script sweep re-run: only `blog/index.html` (correctly) lacks keep-reading.js.
- HTML structure check: 1 open / 1 close for body, article, footer; 3 open / 3 close for script.
- Security sweep: `grep -rn -i -E "(nvapi|sk-|ghp_|password|secret|evan|castillo|192\.168|10\.0)" --include="*.html"` — all hits are legitimate English in blog prose (security research writeups; "secret"/"secrets.env"/"password" as content). The one `ghp_` match is `ghp_&hellip;REDACTED&hellip;` in the Hanwha writeup, explicitly redacted, not a key. The file I edited contains none of the patterns.
- Did NOT use browser tool per the cron instructions — file work only, via terminal / read_file / patch.
- Committed `5c1cc55` and pushed to `main` successfully (`efa09c6..5c1cc55`).

Caveat: per cron constraints I could not open the rendered page in a browser, so behaviour is verified by static structure + the existing scripts' published insertion logic, not by live screenshot.
