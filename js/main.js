/* =========================================================
   Best Haryana Solar Energy - main.js
   Header scroll, mobile menu, smooth scroll, gallery filter,
   scroll reveal, form-to-WhatsApp, FAQ accordion behavior,
   testimonials carousel dots.

   Components (header/footer/CTAs) are injected at runtime by
   js/components.js. We bind header- and menu-related events
   on the `components:ready` event so injected elements exist.
   ========================================================= */

(function () {
  'use strict';

  const WA_NUMBER = '919050984623';

  /* ---------- Header scroll + hamburger menu (post-inject) ---------- */
  function initHeader() {
    const header = document.querySelector('.site-header');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (header && !header.dataset.bound) {
      header.dataset.bound = '1';
      const onScroll = () => {
        if (window.scrollY > 12) header.classList.add('is-scrolled');
        else header.classList.remove('is-scrolled');
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    function setMenu(open) {
      if (!hamburger || !mobileMenu) return;
      hamburger.classList.toggle('is-open', open);
      mobileMenu.classList.toggle('is-open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    }

    if (hamburger && !hamburger.dataset.bound) {
      hamburger.dataset.bound = '1';
      hamburger.addEventListener('click', () => {
        setMenu(!hamburger.classList.contains('is-open'));
      });
    }

    // Close mobile menu when a nav link is tapped
    document.querySelectorAll('.mobile-menu a[href]').forEach((a) => {
      if (a.dataset.bound) return;
      a.dataset.bound = '1';
      a.addEventListener('click', () => setMenu(false));
    });
  }

  // Run when components are ready OR immediately if already in DOM (e.g. pages
  // that hardcode the header)
  document.addEventListener('components:ready', initHeader);
  if (document.readyState !== 'loading') initHeader();
  else document.addEventListener('DOMContentLoaded', initHeader);

  /* ---------- Smooth-scroll for in-page anchor links ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      if (a.dataset.smoothBound) return;
      a.dataset.smoothBound = '1';
      a.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#' || href.length < 2) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if it was open
        const ham = document.querySelector('.hamburger');
        if (ham && ham.classList.contains('is-open')) ham.click();
      });
    });
  }
  document.addEventListener('DOMContentLoaded', initSmoothScroll);
  document.addEventListener('components:ready', initSmoothScroll);

  /* ---------- Gallery filter ---------- */
  function initGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!filterBtns.length) return;
    filterBtns.forEach((btn) => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-filter');
        filterBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        galleryItems.forEach((item) => {
          const ic = item.getAttribute('data-category');
          if (cat === 'all' || ic === cat) item.classList.remove('is-hidden');
          else item.classList.add('is-hidden');
        });
      });
    });
  }
  document.addEventListener('DOMContentLoaded', initGallery);

  /* ---------- IntersectionObserver for fade-ins ---------- */
  function initFades() {
    const faders = document.querySelectorAll('.fade-in:not(.in-view)');
    if (!('IntersectionObserver' in window)) {
      faders.forEach((el) => el.classList.add('in-view'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    );
    faders.forEach((el) => io.observe(el));
  }
  document.addEventListener('DOMContentLoaded', initFades);

  /* ---------- Animated counters (data-counter="48000") ---------- */
  function initCounters() {
    const els = document.querySelectorAll('[data-counter]');
    if (!els.length || !('IntersectionObserver' in window)) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fmt = (n) => Math.round(n).toLocaleString('en-IN');
    const animate = (el) => {
      const target = parseFloat(el.dataset.counter) || 0;
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      if (reduced) { el.textContent = prefix + fmt(target) + suffix; return; }
      const dur = 1400;
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = prefix + fmt(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (e.isIntersecting) {
          animate(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.35 });
    els.forEach((el) => io.observe(el));
  }
  document.addEventListener('DOMContentLoaded', initCounters);

  /* ---------- Contact form: prevent submit, build WhatsApp message ---------- */
  function initLeadForm() {
    const form = document.getElementById('leadForm');
    const successBox = document.getElementById('formSuccess');
    if (!form || form.dataset.bound) return;
    form.dataset.bound = '1';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = new FormData(form);
      const get = (k) => (data.get(k) || '').toString().trim();

      const lines = [
        'Namaste! I would like to know about solar installation.',
        '',
        'Name: ' + get('name'),
        'Phone: ' + get('phone'),
      ];
      if (get('email'))    lines.push('Email: ' + get('email'));
      if (get('location')) lines.push('Location: ' + get('location'));
      if (get('interest')) lines.push('Interest: ' + get('interest'));
      if (get('bill'))     lines.push('Monthly Bill: ₹' + get('bill'));
      if (get('message'))  lines.push('', 'Message: ' + get('message'));
      lines.push('', 'Please share more details. Dhanyavaad!');

      const text = encodeURIComponent(lines.join('\n'));
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + text, '_blank', 'noopener');

      if (successBox) {
        successBox.classList.add('show');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => form.reset(), 400);
        setTimeout(() => successBox.classList.remove('show'), 8000);
      }
    });
  }
  document.addEventListener('DOMContentLoaded', initLeadForm);

  /* ---------- FAQ: one-open accordion ---------- */
  function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
      if (item.dataset.bound) return;
      item.dataset.bound = '1';
      item.addEventListener('toggle', function () {
        if (!this.open) return;
        faqItems.forEach((other) => {
          if (other !== this) other.open = false;
        });
      });
    });
  }
  document.addEventListener('DOMContentLoaded', initFaq);

  /* ---------- Testimonials: mobile dots indicator ---------- */
  function initTestimonials() {
    const testiMarquee = document.getElementById('testiMarquee');
    const testiDots    = document.getElementById('testiDots');
    if (!testiMarquee || !testiDots) return;

    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
    let cards = [], dots = [], built = false;

    function buildDots() {
      if (built) return;
      cards = Array.from(testiMarquee.querySelectorAll('.testi-card:not([aria-hidden="true"])'));
      testiDots.innerHTML = '';
      cards.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'testi-dot' + (i === 0 ? ' is-active' : '');
        d.type = 'button';
        d.setAttribute('aria-label', 'Review ' + (i + 1) + ' of ' + cards.length);
        d.addEventListener('click', () => {
          cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
        testiDots.appendChild(d);
      });
      dots = Array.from(testiDots.children);
      built = true;
    }

    function syncActive() {
      if (!dots.length || !cards.length) return;
      const r = testiMarquee.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      let idx = 0, min = Infinity;
      cards.forEach((card, i) => {
        const cr = card.getBoundingClientRect();
        const ccx = cr.left + cr.width / 2;
        const d = Math.abs(ccx - cx);
        if (d < min) { min = d; idx = i; }
      });
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    }

    function refresh() { if (isMobile()) { buildDots(); syncActive(); } }
    refresh();
    let t;
    testiMarquee.addEventListener('scroll', () => {
      if (!isMobile()) return;
      clearTimeout(t);
      t = setTimeout(syncActive, 50);
    }, { passive: true });
    window.addEventListener('resize', refresh);
  }
  document.addEventListener('DOMContentLoaded', initTestimonials);

})();
