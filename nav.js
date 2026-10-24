(function () {
    'use strict';

    var btn = document.querySelector('.nav-toggle');
    var panel = document.querySelector('.nav-collapse');
    if (!btn || !panel) return;
    document.documentElement.classList.add('js');

    var mobile = window.matchMedia('(max-width: 640px)');
    var open = false;

    function setOpen(state) {
        open = state && mobile.matches;
        panel.classList.toggle('is-open', open);
        panel.inert = !open;
        panel.setAttribute('aria-hidden', String(!open));
        btn.setAttribute('aria-expanded', String(open));
        btn.classList.toggle('is-active', open);
    }

    btn.addEventListener('click', function () {
        setOpen(!open);
    });
    panel.addEventListener('click', function (event) {
        if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && open) {
            setOpen(false);
            btn.focus();
        }
    });
    document.addEventListener('click', function (event) {
        if (open && !panel.contains(event.target) && !btn.contains(event.target)) {
            setOpen(false);
        }
    });
    document.addEventListener('focusin', function (event) {
        if (open && !panel.contains(event.target) && !btn.contains(event.target)) {
            setOpen(false);
        }
    });
    mobile.addEventListener('change', function () {
        setOpen(false);
    });
    setOpen(false);

    var path = location.pathname.replace(/\/index\.html$/, '/');
    document.querySelectorAll('nav .links a:not(.cta)').forEach(function (link) {
        var target = new URL(link.href, location.href);
        if (target.origin !== location.origin) return;
        var resolved = target.pathname.replace(/\/index\.html$/, '/');
        if (resolved === '/') return;
        if (path === resolved || (resolved.endsWith('/') && path.startsWith(resolved))) {
            link.classList.add('is-current');
            link.setAttribute('aria-current', path === resolved ? 'page' : 'location');
        }
    });
})();
