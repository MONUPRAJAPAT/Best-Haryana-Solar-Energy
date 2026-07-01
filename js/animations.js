/* =========================================================
   Best Haryana Solar Energy - animations.js
   Micro-interactions and scroll-driven reveals using CSS-
   first techniques + light JS. Avoids GSAP for now —
   modern CSS scroll-driven animations + IntersectionObserver
   give us all we need with zero CDN dependency.

   Features:
     - .reveal blocks: opacity/translate in on scroll
     - .reveal-stagger > * : staggered reveal
     - .tilt buttons: cursor-tracking 3D tilt on desktop
     - .magnet buttons: subtle magnetic pull on cursor hover
     - .marquee--brands: continuous brand-logo scroller
     - View Transitions API: smooth page-to-page when navigating
       between same-origin pages with [data-page-transition]
   ========================================================= */

(function () {
  'use strict';

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse     = matchMedia('(pointer: coarse)').matches;

  /* ---------- Scroll reveal (.reveal, .reveal-stagger) ---------- */
  function initReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!reveals.length || !('IntersectionObserver' in window)) {
      reveals.forEach((r) => r.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((r) => io.observe(r));
  }
  document.addEventListener('DOMContentLoaded', initReveal);

  /* ---------- Magnetic buttons (.magnet) ---------- */
  function initMagnet() {
    if (reducedMotion || isCoarse) return;
    const els = document.querySelectorAll('.magnet');
    els.forEach((el) => {
      if (el.dataset.magnetBound) return;
      el.dataset.magnetBound = '1';
      const STRENGTH = 0.20;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * STRENGTH;
        const dy = (e.clientY - (r.top + r.height / 2)) * STRENGTH;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }
  document.addEventListener('DOMContentLoaded', initMagnet);

  /* ---------- Tilt cards (.tilt) ---------- */
  function initTilt() {
    if (reducedMotion || isCoarse) return;
    document.querySelectorAll('.tilt').forEach((el) => {
      if (el.dataset.tiltBound) return;
      el.dataset.tiltBound = '1';
      const MAX = 6;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;   // 0..1
        const py = (e.clientY - r.top) / r.height;
        const rx = (py - 0.5) * -MAX;
        const ry = (px - 0.5) * MAX;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }
  document.addEventListener('DOMContentLoaded', initTilt);

  /* ---------- View Transitions API for inner-site nav ---------- */
  // Wrap same-origin link clicks so the browser uses the View Transitions API
  // when supported. Falls back to a normal navigation silently.
  function initViewTransitions() {
    if (!document.startViewTransition) return;
    document.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
      // Same-origin internal nav
      if (a.target && a.target !== '_self') return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      document.startViewTransition(() => {
        window.location.href = href;
      });
    });
  }
  document.addEventListener('DOMContentLoaded', initViewTransitions);

})();
