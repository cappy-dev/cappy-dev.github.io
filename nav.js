/* nav.js — shared mobile navigation toggle.
 *
 * Linear-style responsive nav: the desktop bar stays exactly as-is.
 * Below 640px the inline links collapse behind a hamburger icon-button
 * (Linear icon-button spec: translucent bg, 50% radius, hairline border).
 * Tapping it expands a panel (#0f1011) with stacked links at 44px
 * touch-target height each.
 *
 * Accessibility:
 *   - aria-expanded on the button reflects open/closed state.
 *   - aria-controls links button to the panel it owns.
 *   - Escape closes, click-outside closes, navigation closes.
 *   - Focus is managed lightly (button stays focusable; we do not
 *     trap focus in the panel to keep behavior simple and robust).
 *
 * Anti-slop: no animation theater. The panel slides down with a
 * single max-height transition that is disabled under
 * prefers-reduced-motion. No icons-in-boxes, no decorative SVG.
 */
(function () {
    'use strict';

    /* Mark the page as JS-active early so CSS can hide the inline
       links on mobile and show the toggle button instead. Without
       JS, the .js class is never added, the button stays hidden,
       and the inline links remain visible — a clean noscript fallback. */
    document.documentElement.classList.add('js');

    var btn = document.querySelector('.nav-toggle');
    var panel = document.querySelector('.nav-collapse');
    if (!btn || !panel) return;

    var MOBILE_BP = 640;
    var open = false;

    function setOpen(state) {
        open = state;
        panel.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.classList.toggle('is-active', open);
    }

    function syncWithViewport() {
        // Above the breakpoint, reset button/panel state so the
        // desktop nav stays clean if the user widens the viewport
        // while the menu was open. CSS handles visibility (the
        // html.js .nav-toggle rule only fires at 640px max).
        if (window.innerWidth > MOBILE_BP) {
            panel.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
            btn.classList.remove('is-active');
            open = false;
        }
        // Below the breakpoint, CSS shows the button. We only need
        // to ensure the panel is collapsed on initial load and on
        // resize from desktop.
        if (window.innerWidth <= MOBILE_BP && !open) {
            panel.classList.remove('is-open');
        }
    }

    btn.addEventListener('click', function () {
        setOpen(!open);
    });

    // Close on link navigation (the panel links out)
    panel.addEventListener('click', function (e) {
        if (e.target.closest('a')) setOpen(false);
    });

    // Escape closes
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && open) {
            setOpen(false);
            btn.focus();
        }
    });

    // Click outside closes
    document.addEventListener('click', function (e) {
        if (!open) return;
        if (!panel.contains(e.target) && !btn.contains(e.target)) {
            setOpen(false);
        }
    });

    window.addEventListener('resize', function () {
        // Debounce via requestAnimationFrame
        if (window._navRaf) cancelAnimationFrame(window._navRaf);
        window._navRaf = requestAnimationFrame(syncWithViewport);
    });

    syncWithViewport();
})();
