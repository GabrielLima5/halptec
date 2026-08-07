/* ==========================================================================
   Hero — word-by-word title split, cinematic entrance timeline,
   discreet particle-network canvas background
   ========================================================================== */

(function () {
    'use strict';
    var reduceMotion = window.HALPTEC.reduceMotion;
    var hasGSAP = window.HALPTEC.hasGSAP;

    /* Split the hero title into word spans so each can animate in.
       The separating space is appended as its own text node *between*
       the word wrappers (not inside the last inline-block's text) —
       a space trapped at the end of an inline-block's own line box gets
       trimmed by the UA, which silently glues words together. */
    function prepareHeroTitle() {
        var title = document.querySelector('.hero-title');
        if (!title || title.dataset.split === 'true') return;
        var text = title.textContent.trim();
        var words = text.split(/\s+/);
        title.textContent = '';
        title.dataset.split = 'true';
        words.forEach(function (word, i) {
            var wrap = document.createElement('span');
            wrap.className = 'word';
            var inner = document.createElement('span');
            inner.textContent = word;
            wrap.appendChild(inner);
            title.appendChild(wrap);
            if (i < words.length - 1) title.appendChild(document.createTextNode(' '));
        });
    }

    /* Cinematic entrance, run once the preloader has faded (see preloader.js). */
    function runHeroEntrance() {
        var words = document.querySelectorAll('.hero-title .word > span');
        var lead = document.querySelector('.hero-copy .eyebrow');
        var leadP = document.querySelector('.hero-copy p.lead');
        var cta = document.querySelector('.hero-cta');
        var stats = document.querySelector('.hero-stats');
        var visual = document.querySelector('.hero-visual');

        if (reduceMotion) return; // elements are visible by default via base CSS

        if (hasGSAP) {
            var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.set([lead, leadP, cta, stats, visual], { opacity: 0 });
            tl.set(words, { yPercent: 120, opacity: 0 });
            tl.to(lead, { opacity: 1, y: 0, duration: .5 }, 0.05)
              .to(words, { yPercent: 0, opacity: 1, duration: .9, stagger: 0.05 }, 0.15)
              .to(leadP, { opacity: 1, duration: .7 }, '-=0.5')
              .to(cta, { opacity: 1, duration: .7 }, '-=0.45')
              .to(stats, { opacity: 1, duration: .7 }, '-=0.45')
              .fromTo(visual, { opacity: 0, scale: .92 }, { opacity: 1, scale: 1, duration: 1 }, '-=0.9');
        } else {
            [lead, leadP, cta, stats, visual].forEach(function (el, i) {
                if (!el) return;
                el.style.transition = 'opacity .7s ease ' + (i * 0.08) + 's';
                requestAnimationFrame(function () { el.style.opacity = '1'; });
            });
            words.forEach(function (w, i) {
                w.style.transform = 'translateY(120%)';
                w.style.opacity = '0';
                w.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1) ' + (i * 0.045) + 's, opacity .8s ease ' + (i * 0.045) + 's';
                requestAnimationFrame(function () {
                    w.style.transform = 'translateY(0)';
                    w.style.opacity = '1';
                });
            });
        }
    }

    /* Discreet particle network, confined to the hero canvas. */
    function initHeroParticles() {
        var canvas = document.querySelector('.hero-canvas');
        if (!canvas || reduceMotion) return;
        var ctx = canvas.getContext('2d');
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w, h, particles = [];
        var count = window.innerWidth < 700 ? 26 : 52;
        var running = true;

        function resize() {
            var rect = canvas.parentElement.getBoundingClientRect();
            w = rect.width; h = rect.height;
            canvas.width = w * dpr; canvas.height = h * dpr;
            canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        function makeParticles() {
            particles = [];
            for (var i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.18,
                    vy: (Math.random() - 0.5) * 0.18,
                    r: Math.random() * 1.6 + 0.6
                });
            }
        }
        function step() {
            if (!running) return;
            ctx.clearRect(0, 0, w, h);
            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.35)';
                ctx.fill();
                for (var j = i + 1; j < particles.length; j++) {
                    var q = particles[j];
                    var dx = p.x - q.x, dy = p.y - q.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = 'rgba(255,80,110,' + (0.14 * (1 - dist / 120)) + ')';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(step);
        }
        resize();
        makeParticles();
        requestAnimationFrame(step);
        window.addEventListener('resize', function () { resize(); makeParticles(); });
        document.addEventListener('visibilitychange', function () {
            running = !document.hidden;
            if (running) requestAnimationFrame(step);
        });
    }

    // Registered at parse time (not gated behind DOMContentLoaded) so it can
    // never miss the event, however fast/slow the preloader resolves.
    document.addEventListener('halptec:preloaded', runHeroEntrance);

    function init() {
        prepareHeroTitle();
        initHeroParticles();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
