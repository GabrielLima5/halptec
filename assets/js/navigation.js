/* ==========================================================================
   Navigation — mobile off-canvas menu, active link on scroll,
   header shrink-on-scroll, back-to-top button
   ========================================================================== */

(function () {
    'use strict';
    var reduceMotion = window.HALPTEC.reduceMotion;

    function navBarSettings() {
        var ul = document.querySelector('.menu');
        var openBtn = document.querySelector('.open-menu');
        var closeBtn = document.querySelector('.close-menu');
        var mainEl = document.querySelector('main');
        if (!ul || !openBtn || !closeBtn) return;

        function openMenu() {
            ul.classList.add('open');
            document.body.classList.add('menu-open');
            if (mainEl) mainEl.classList.add('is-dimmed');
        }
        function closeMenu() {
            ul.classList.remove('open');
            document.body.classList.remove('menu-open');
            if (mainEl) mainEl.classList.remove('is-dimmed');
        }
        openBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        if (mainEl) mainEl.addEventListener('click', function () {
            if (ul.classList.contains('open')) closeMenu();
        });
        ul.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', closeMenu);
        });
    }

    function initActiveNav() {
        var links = Array.prototype.slice.call(document.querySelectorAll('header .menu a[href^="#"]'));
        if (!links.length || !('IntersectionObserver' in window)) return;
        var map = {};
        links.forEach(function (a) {
            var id = a.getAttribute('href').slice(1);
            var section = document.getElementById(id);
            if (section) map[id] = a;
        });
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var link = map[entry.target.id];
                if (!link) return;
                if (entry.isIntersecting) {
                    links.forEach(function (l) { l.classList.remove('nav-active'); });
                    link.classList.add('nav-active');
                }
            });
        }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
        Object.keys(map).forEach(function (id) { observer.observe(document.getElementById(id)); });
    }

    function initHeaderState() {
        var header = document.getElementById('header');
        var toTop = document.querySelector('.back-to-top');
        var ticking = false;
        var isScrolled = false;
        var isTopVisible = false;
        function update() {
            var y = window.scrollY || window.pageYOffset;

            // Hysteresis: separate enter/exit thresholds with a dead zone between
            // them, so momentum/smooth scrolling hovering near the boundary
            // doesn't rapidly flip the class (and re-trigger the CSS transition,
            // which reads as the header "shaking").
            if (header) {
                if (!isScrolled && y > 40) isScrolled = true;
                else if (isScrolled && y < 15) isScrolled = false;
                header.classList.toggle('scrolled', isScrolled);
            }
            if (toTop) {
                if (!isTopVisible && y > 620) isTopVisible = true;
                else if (isTopVisible && y < 560) isTopVisible = false;
                toTop.classList.toggle('visible', isTopVisible);
            }
            ticking = false;
        }
        window.addEventListener('scroll', function () {
            if (!ticking) { requestAnimationFrame(update); ticking = true; }
        }, { passive: true });
        update();
        if (toTop) {
            toTop.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
            });
        }
    }

    function init() {
        navBarSettings();
        initActiveNav();
        initHeaderState();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
