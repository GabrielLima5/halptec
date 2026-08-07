/* ==========================================================================
   HALPTEC — shared feature-detection flags
   Loaded first: exposes window.HALPTEC for every other module to read.
   Must run before GSAP-dependent modules check HALPTEC.hasGSAP, so keep
   this <script> tag after the GSAP CDN tags and before all other modules.
   ========================================================================== */

window.HALPTEC = {
    reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    canHover: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    hasGSAP: typeof window.gsap !== 'undefined'
};
