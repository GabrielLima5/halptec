/* ==========================================================================
   Products accordion — smooth measured height animation
   ========================================================================== */

(function () {
    'use strict';
    var reduceMotion = window.HALPTEC.reduceMotion;

    function buttonSettings() {
        var buttons = Array.prototype.slice.call(document.querySelectorAll('button[class*="btn-"]'));
        buttons.forEach(function (btn) {
            var match = btn.className.match(/btn-(\d+)/);
            if (!match) return;
            var panel = document.getElementById('product-' + match[1]);
            if (!panel) return;

            btn.addEventListener('click', function () {
                var isHidden = panel.classList.contains('hide');
                btn.classList.toggle('rotate');

                if (isHidden) {
                    panel.classList.remove('hide');
                    var target = panel.scrollHeight;
                    panel.style.maxHeight = target + 'px';
                    var settle = setTimeout(function () {
                        // re-measure in case images finished loading and grew the panel
                        panel.style.maxHeight = panel.scrollHeight + 'px';
                    }, 420);
                    panel._settleTimer = settle;
                    if (!reduceMotion) {
                        btn.closest('.product').scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                } else {
                    clearTimeout(panel._settleTimer);
                    panel.style.maxHeight = panel.scrollHeight + 'px';
                    requestAnimationFrame(function () {
                        requestAnimationFrame(function () {
                            panel.style.maxHeight = '0px';
                        });
                    });
                    panel.addEventListener('transitionend', function handler(e) {
                        if (e.propertyName === 'max-height') {
                            panel.classList.add('hide');
                            panel.removeEventListener('transitionend', handler);
                        }
                    });
                }
            });
        });

        // keep open panels correctly sized on resize
        window.addEventListener('resize', function () {
            document.querySelectorAll('.product-desc:not(.hide)').forEach(function (panel) {
                panel.style.maxHeight = panel.scrollHeight + 'px';
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buttonSettings);
    } else {
        buttonSettings();
    }
})();
