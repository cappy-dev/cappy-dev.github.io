/* heading-anchors.js — shared across every article page.
 *
 * Auto-slugs genuine section headings (h2/h3) inside an article and
 * links them, so deep links to a section land on a real hash target
 * and the heading picks up the hover/focus permalink glyph defined in
 * style.css.
 *
 * The site is a Command/Inspect surface at this level — a reader dug
 * into one post — and these anchors are the navigation affordance a
 * long-form technical blog was missing.
 *
 * Non-features (anti-slop):
 *   - No TOC sidebar, no floating rail, no "back to top" button.
 *   - The glyph is a single '#' mark, not an icon or a box.
 *   - Only genuine section headings get anchors.
 *
 * Skip rules (what does NOT get an anchor):
 *   - Headings inside .story-card (daily-news posts use `<h3><a href>`
 *     story titles; those are linkified titles, not sections, and a
 *     nested `<a>` inside an `<a>` is invalid HTML anyway).
 *   - Headings whose only child is an <a> (linkified heading). We never
 *     nest anchors.
 *   - Headings that already carry their own .heading-anchor (idempotent)
 *     or already have an id we want to keep.
 *   - Headings with no usable text (skip the slug).
 */
(function () {
    'use strict';

    var scope = document.querySelector('.article-body') || document.querySelector('article');
    if (!scope) return;

    var headings = scope.querySelectorAll('h2, h3');
    if (!headings.length) return;

    var used = {};

    function slugify(text) {
        return (text || '')
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    headings.forEach(function (h) {
        if (h.querySelector('.heading-anchor')) return;

        // Skip linkified story-card titles — they are external links,
        // not section anchors, and <a> cannot nest <a>.
        if (h.closest('.story-card')) return;

        // Skip any heading whose sole child is an anchor (a linkified
        // heading outside of story-card, for safety).
        var onlyChildIsAnchor =
            h.children.length === 1 && h.children[0].tagName.toLowerCase() === 'a';

        var text = (h.textContent || '').trim();
        if (!text) return;

        // If the heading is itself a single link, do not add an inner
        // anchor link (would be invalid nested <a>).
        if (onlyChildIsAnchor) return;

        var id = h.id || slugify(text);
        if (!id) id = 'section';

        if (!h.id) {
            var base = id;
            var n = 1;
            while (used[id]) {
                id = base + '-' + (++n);
            }
            h.id = id;
        }
        used[id] = true;

        var a = document.createElement('a');
        a.className = 'heading-anchor';
        a.href = '#' + id;
        a.setAttribute('aria-label', 'Link to this section');
        a.setAttribute('tabindex', '0');
        a.textContent = '#';
        h.appendChild(a);
    });
})();
