As Cappy, I've completed this turn's visual improvement to cappy-dev.github.io:

**Unified the daily-news tag pills with the accent-tinted pill-news treatment across all 13 daily-news posts and the blog index.** The recurring "Daily News" series is the site's most frequent post type (32 entries across June and July), and it had three inconsistent tag treatments that broke the visual rhythm of the Explore-surface blog index:

- **June 22–29 posts** (8 files): plain `pill` class, lowercase `daily-news` + `ai-news`
- **June 30 post** (1 file): legacy unstyled `tag` class, lowercase, no design-system pill at all
- **July 3–6 posts** (4 files): accent `pill-news` on daily-news only, plain `pill` on ai-news, both lowercase
- **July 7–29 posts** (17 entries on the index): no `pill-news` accent tint, but already Title Case
- **Blog index** (all 32 entries): mixed between the two conventions depending on which month's post

Now every "Daily News" and "AI News" pill across 14 files uses the same treatment: `<span class="pill pill-news">Daily News</span>` and `<span class="pill pill-news">AI News</span>` — Title Case, accent-bright color (`--accent-bright #7170ff`) with the violet border tint (`rgba(94, 106, 210, 0.20)`). This completes the design intent expressed at style.css line 672: "daily-news pill — accent tint to signal recurring series."

Why this run chose ONE thing:
- Ran the slop diagnostic against the existing site: scored 1.5/10 — very clean already. The Linear design system is mature (scroll-aware nav, hairline section dividers, post-row issue-list pattern, freshness dots, h2–h4 reading ladder, full-enclosure blockquotes, code block language labels, scoped article footers, universal focus rings).
- The single most visible inconsistency was the daily-news tag treatment. A reader scanning the blog index (an Explore surface with 60+ post rows) would see the same recurring series change appearance halfway down the page — June posts had lowercase faded pills, July posts had Title Case pills without the accent tint that was designed for this exact purpose. That breaks the "the state IS the signal" principle that the rest of the site follows.
- The `.pill-news` accent tint is a deliberate design token already in the CSS, created specifically to mark recurring series. It was just inconsistently applied. This fix closes the gap without inventing any new vocabulary.

Key facts about the change:
- 14 files modified (13 individual daily-news posts + blog/index.html), 90 lines changed (45 pairs of tag spans).
- No CSS changes, no new tokens, no new components — only normalization of existing markup to use the established design system consistently.
- Title Case labels ("Daily News", "AI News") match the site-wide convention used by all other tags (e.g., "Open Source", "Hacker News", "Cybersecurity").
- The `data-topics` attributes on the blog index remain lowercase (they're JS filter keys, not visible labels).
- Security sweep: grep for nvapi/sk-/ghp_/password/secret/evan/castillo/192.168/10.0 found only legitimate content words in article prose (e.g., "secrets.env" in the hackmyclaw prompt-injection story, "secret" in MCP spec text). No actual secrets present.
- Anti-slop audit on the diff: 0/10 tells. No new gradient, glass, rail, icon, box, or surface change — pure consistency closure on an existing design token.

Verification:
- Deployed to main (commit ff61df0). GitHub Pages will rebuild automatically.
- Grep verification: zero old-format pills remain across all HTML files.
- 14 files now use the unified `pill pill-news">Daily News` treatment; 14 files use `pill pill-news">AI News`.
- No browser tool used (per instructions). Verified via terminal grep counts and file diff review.
