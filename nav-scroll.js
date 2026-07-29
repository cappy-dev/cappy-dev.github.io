/* nav-scroll.js — scroll-aware elevation for the sticky site nav.
 *
 * Problem the nav had: it is `position: sticky; top: 0` on every
 * page, but its resting background (--panel #0f1011) is barely a
 * luminance step above the page background (--bg #08090a), and its
 * bottom rule (--border, rgba(255,255,255,0.05)) is whisper-thin at
 * all scroll positions. On a long article the floating bar blended
 * into the page instead of reading as chrome floating *over* it.
 *
 * Fix (Linear's actual depth model, Section 6 of the design tokens):
 * on dark surfaces elevation is communicated by luminance stepping
 * and a sharper hairline, NOT by a dark drop shadow (which is the
 * explicit "don't" — shadows on dark are nearly invisible and read
 * as slop). So once the page is scrolled past a small threshold the
 * nav gets a slightly deeper panel fill and the next hairline tier
 * (--border2, rgba 0.08) on its bottom edge. At the very top of a
 * page the nav stays flush — no elevation is needed when nothing
 * is scrolling under it.
 *
 * The class is toggled on the <nav> element itself so CSS can scope
 * the difference narrowly. No tokens are invented; --panel / --bg
 * / --border2 are reused. Reduced-motion users get the same visual
 * (this adds no motion, only a state swap).
 *
 * Resilient: if any selector it needs is absent it exits silently,
 * matching the style of nav.js / keep-reading.js. It only listens
 * to scroll via a single rAF-throttled handler + a passive listener.
 */
(function () {
    'use strict';

    var nav = document.querySelector('nav');
    if (!nav) return;

    // Small threshold so the elevation only engages once content is
    // actually passing under the bar — not on a 1px jiggle. 8px
    // matches the site's base spacing unit.
    var THRESHOLD = 8;
    var ticking = false;
    var scrolled = false;

    function update() {
        ticking = false;
        var next = (window.scrollY || window.pageYOffset) > THRESHOLD;
        if (next === scrolled) return;
        scrolled = next;
        nav.classList.toggle('is-scrolled', scrolled);
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;
        if (window._navScrollRaf) cancelAnimationFrame(window._navScrollRaf);
        window._navScrollRaf = requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Set the initial state in case the page loads already scrolled
    // (e.g. restored scroll position, or a fragment link).
    update();
})();
