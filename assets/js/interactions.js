/* ==========================================================================
   Pointer micro-interactions — custom cursor, magnetic buttons,
   click ripple, 3D tilt + shine for product/hero cards
   ========================================================================== */

(function () {
    'use strict';
    var reduceMotion = window.HALPTEC.reduceMotion;
    var canHover = window.HALPTEC.canHover;

    function initCursor() {
        if (!canHover || reduceMotion) return;
        var dot = document.querySelector('.cursor-dot');
        var outline = document.querySelector('.cursor-outline');
        if (!dot || !outline) return;
        document.body.classList.add('has-custom-cursor');

        var mx = -100, my = -100, ox = -100, oy = -100;
        window.addEventListener('mousemove', function (e) {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0) translate(-50%,-50%)';
        });
        (function loop() {
            ox += (mx - ox) * 0.18;
            oy += (my - oy) * 0.18;
            outline.style.transform = 'translate3d(' + ox + 'px,' + oy + 'px,0) translate(-50%,-50%)';
            requestAnimationFrame(loop);
        })();

        var interactive = 'a, button, input, textarea, .item, .hero-card';
        document.addEventListener('mouseover', function (e) {
            if (e.target.closest(interactive)) outline.classList.add('is-active');
        });
        document.addEventListener('mouseout', function (e) {
            if (e.target.closest(interactive)) outline.classList.remove('is-active');
        });
        document.addEventListener('mouseleave', function () {
            dot.style.opacity = '0'; outline.style.opacity = '0';
        });
        document.addEventListener('mouseenter', function () {
            dot.style.opacity = '1'; outline.style.opacity = '1';
        });
    }

    function initMagnetic() {
        if (!canHover || reduceMotion) return;
        var targets = document.querySelectorAll('.budget-request, .btn, .back-to-top');
        targets.forEach(function (el) {
            el.classList.add('magnetic');
            el.addEventListener('mousemove', function (e) {
                var r = el.getBoundingClientRect();
                var relX = e.clientX - r.left - r.width / 2;
                var relY = e.clientY - r.top - r.height / 2;
                el.style.transform = 'translate(' + relX * 0.28 + 'px,' + relY * 0.35 + 'px)';
            });
            el.addEventListener('mouseleave', function () {
                el.style.transform = 'translate(0,0)';
            });
        });
    }

    function initRipple() {
        var selector = '.budget-request, .btn, main > .contact form button, main > .products > .products-list button';
        document.addEventListener('click', function (e) {
            var target = e.target.closest(selector);
            if (!target) return;
            var rect = target.getBoundingClientRect();
            var size = Math.max(rect.width, rect.height);
            var span = document.createElement('span');
            span.className = 'ripple';
            span.style.width = span.style.height = size + 'px';
            span.style.left = (e.clientX - rect.left - size / 2) + 'px';
            span.style.top = (e.clientY - rect.top - size / 2) + 'px';
            var pos = getComputedStyle(target).position;
            if (pos === 'static') target.style.position = 'relative';
            target.style.overflow = target.style.overflow || 'hidden';
            target.appendChild(span);
            setTimeout(function () { span.remove(); }, 700);
        });
    }

    function initTilt() {
        if (!canHover || reduceMotion) return;
        var items = document.querySelectorAll('.products-list .item, .hero-card');
        items.forEach(function (card) {
            var raf = null;
            card.addEventListener('mousemove', function (e) {
                if (raf) return;
                raf = requestAnimationFrame(function () {
                    var r = card.getBoundingClientRect();
                    var px = (e.clientX - r.left) / r.width;
                    var py = (e.clientY - r.top) / r.height;
                    var rx = (py - 0.5) * -8;
                    var ry = (px - 0.5) * 8;
                    card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(4px)';
                    card.style.setProperty('--mx', (px * 100) + '%');
                    card.style.setProperty('--my', (py * 100) + '%');
                    raf = null;
                });
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }

    function init() {
        initCursor();
        initMagnetic();
        initRipple();
        initTilt();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
