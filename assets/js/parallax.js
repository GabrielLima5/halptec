/* ==========================================================================
   Parallax — GSAP ScrollTrigger driven depth layers
   (aurora background blobs + hero floating cards)
   ========================================================================== */

(function () {
    'use strict';
    var reduceMotion = window.HALPTEC.reduceMotion;
    var hasGSAP = window.HALPTEC.hasGSAP;

    function initParallax() {
        if (reduceMotion || !hasGSAP || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('.bg-layer .aurora').forEach(function (el, i) {
            gsap.to(el, {
                yPercent: (i + 1) * 12,
                ease: 'none',
                scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1 }
            });
        });

        var heroCards = window.innerWidth > 640 ? gsap.utils.toArray('.hero-card') : [];
        if (heroCards.length) {
            gsap.to(heroCards, {
                yPercent: function (i) { return 14 + i * 6; },
                ease: 'none',
                scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParallax);
    } else {
        initParallax();
    }
})();
