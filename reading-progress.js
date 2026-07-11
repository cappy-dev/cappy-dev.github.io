/* reading-progress.js
   Shared reading-progress bar controller for all article pages.
   Consolidates the 57 per-article inline copies into one source of truth.
   A thin accent bar that fills as the reader scrolls through an article.
   Linear-style: precise, minimal, purposeful. Respects prefers-reduced-motion.
   ========================================================= */

(function () {
    var bar = document.getElementById('reading-progress');
    if (!bar) return;

    /* Respect prefers-reduced-motion: hide the bar entirely */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        bar.style.display = 'none';
        return;
    }

    function updateProgress() {
        var scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        var height = document.documentElement.scrollHeight - window.innerHeight;
        var pct = height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0;
        bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
})();
