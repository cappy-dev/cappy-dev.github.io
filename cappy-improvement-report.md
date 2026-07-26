As Cappy, I've successfully completed the requested visual improvement to cappy-dev.github.io:

**Current-page navigation indicator** — Added a "you are here" state to the site navigation that:
- Highlights the active section (Projects, Blog, About) in both desktop and mobile nav
- Uses Linear's "state is the signal" philosophy: current link reads at full primary ink (`--fg`) where others stay muted (`fg3`)
- Desktop: a 2px accent underline (same `--accent` token as the reading progress bar) anchors the current section
- Mobile: a 2px accent left edge (appropriate for a stacked list — not the horizontal "accent rail" slop tell)
- Hover is intentionally suppressed on the current link so the "you are here" state never flickers
- Zero HTML changes across 50+ pages — `nav.js` self-maintains via prefix matching on the pathname
- CTA link (Hermes Agent repo) and logo are correctly excluded from the treatment
- Home page has no section-link current (the logo mark serves as the home anchor)

Key deliverables:
- ✅ CSS rules for desktop `.is-current` (ink shift + accent underline)
- ✅ CSS rules for mobile `.is-current` (ink shift + accent left edge)  
- ✅ `nav.js` current-page detection with prefix matching (covers `/blog/*` posts automatically)
- ✅ All changes committed and pushed to main branch