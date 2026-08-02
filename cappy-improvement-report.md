As Cappy, I've completed this turn's visual improvement to cappy-dev.github.io:

**Rendered the unused `data-count` values as a small mono count beside each projects page category label, closing the editorial-metadata gap the CSS itself anticipated.**

The projects page is an Explore surface: a visitor scans four category groupings ("Self-hosting & infrastructure", "AI & LLM tooling", "Network, web & developer utilities", "Apps & misc") covering 14 repos. The blog index — the other Explore surface — already shows a mono count next to its filter ("18 posts"), signaling scale the way Linear does. The projects page had no equivalent affordance: every `.projects-cat` carried a `data-count` attribute (5, 4, 4, 1) that was completely unused in the markup, and the `.projects-cat-label` CSS comment explicitly anticipated a count pair but never rendered one ("The category itself is the primary signal; the count is the secondary mono detail, exactly mirroring how .article-header .meta pairs a date with the dimmed read-time").

This run closes that gap. Each category label is now a flex row: the primary label text plus a dimmed mono `· N` count, reusing the exact "label · detail" recipe already established by `.article-header .meta .read` (opacity-dimmed secondary span joined by a `::before` middot). No new boxes, icons, colors, or tokens — just type as hierarchy.

Why this run chose ONE thing:
- Ran the slop diagnostic against the diff before committing: scored 0/10. No gradient, glass, rail, icon, monument stat, center-stack, or wrong-surface tells. The change adds editorial metadata that aids an Explore-surface reader, using mono micro-type as the hierarchy tool — the opposite of feature-tile filler.
- The `data-count` values already existed in the markup but were invisible. This fix surfaces existing structured data, it doesn't invent decoration.
- Confirmed data integrity before rendering: the four `data-count` values (5, 4, 4, 1) match the actual number of `.project-card` anchors in each category exactly.

Key facts about the change:
- 2 files modified: `style.css` (added `.projects-cat-label` flex rule + `.projects-cat-label .count` and `.count::before` treatments, ~20 lines) and `projects.html` (converted the four `.projects-cat-label` divs to two-span label · count pairs, 8 lines touched).
- No new CSS tokens — reuses the existing JetBrains Mono / `--fg4` / `--border2` / opacity-dim recipe from `.article-header .meta .read`. The middot separator turns the two spans into one typographic pair, matching Linear's "label · detail" rhythm.
- Anti-slop audit on the diff: 0/10 tells.

Verification:
- CSS brace balance: 340 open / 340 close (balanced). New `.count` and `.count::before` blocks present.
- HTML tag balance for projects.html: the 4 label divs each have 2 spans open + 2 close (balanced); overall 32 `<div>` / 32 `</div>` (balanced).
- Data integrity: `data-count=['5','4','4','1']` == actual card counts `[5,4,4,1]`.
- Security sweep: grep for `nvapi` / `sk-{@20}` / `ghp_` / `password` / `secret` / `evan` / `castillo` / `192.168` / `10.0.` found only legitimate article prose (e.g., "trade secret" in the Apple lawsuit post, "reset my password" in the embedding example, "Secrets" in the Kubernetes ConfigMaps listing). No actual secrets, keys, internal IPs, or personal names present.
- No browser tool used (per instructions). Verified via terminal grep counts, python tag/brace balance checks, and file diff review.
