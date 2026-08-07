/* ==========================================================================
   Preloader — branded splash while fonts/DOM settle.
   Dispatches "halptec:preloaded" on document once hidden, so hero.js can
   time its entrance animation without a direct function dependency.
   ========================================================================== */

(function () {
    'use strict';
    var reduceMotion = window.HALPTEC.reduceMotion;

    function init() {
        var pre = document.querySelector('.preloader');
        if (!pre) { document.dispatchEvent(new CustomEvent('halptec:preloaded')); return; }

        document.body.classList.add('is-loading');

        function reveal() {
            if (pre.classList.contains('is-hidden')) return;
            pre.classList.add('is-hidden');
            document.body.classList.remove('is-loading');
            document.dispatchEvent(new CustomEvent('halptec:preloaded'));
            setTimeout(function () { pre.parentNode && pre.parentNode.removeChild(pre); }, 700);
        }

        var minTime = new Promise(function (res) { setTimeout(res, reduceMotion ? 0 : 500); });
        var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
        Promise.all([minTime, fontsReady]).then(reveal);

        // safety net in case fonts.ready never resolves
        setTimeout(reveal, 2500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
