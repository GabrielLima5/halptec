/* ==========================================================================
   Scroll effects — top progress bar + generic scroll-reveal
   ([data-animation] directional reveals + structural card/list stagger)
   ========================================================================== */

(function () {
    'use strict';
    var reduceMotion = window.HALPTEC.reduceMotion;

    function initScrollProgress() {
        var bar = document.querySelector('.scroll-progress-bar');
        if (!bar) return;
        var ticking = false;
        function update() {
            var h = document.documentElement;
            var scrolled = h.scrollTop || document.body.scrollTop;
            var height = h.scrollHeight - h.clientHeight;
            var pct = height > 0 ? (scrolled / height) * 100 : 0;
            bar.style.width = pct + '%';
            ticking = false;
        }
        window.addEventListener('scroll', function () {
            if (!ticking) { requestAnimationFrame(update); ticking = true; }
        }, { passive: true });
        update();
    }

    function initReveal() {
        var directional = Array.prototype.slice.call(document.querySelectorAll('[data-animation]'));
        var generic = Array.prototype.slice.call(document.querySelectorAll(
            '.about-us .stats > div, .products-list > .product, .services-list li, .contact-box > div, .hero-stats .stat'
        ));
        generic.forEach(function (el) { el.classList.add('reveal-up'); });

        var all = directional.concat(generic);
        if (!all.length) return;

        if (!('IntersectionObserver' in window) || reduceMotion) {
            all.forEach(function (el) { el.classList.add('animate', 'in-view'); });
            return;
        }

        // stagger siblings sharing the same parent
        var seen = new Map();
        all.forEach(function (el) {
            var parent = el.parentElement;
            var count = seen.get(parent) || 0;
            el.style.setProperty('--i', count);
            seen.set(parent, count + 1);
        });

        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var delay = (parseInt(entry.target.style.getPropertyValue('--i'), 10) || 0) * 70;
                    setTimeout(function () {
                        entry.target.classList.add('animate', 'in-view');
                    }, Math.min(delay, 560));
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

        all.forEach(function (el) { observer.observe(el); });
    }

    function init() {
        initScrollProgress();
        initReveal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
