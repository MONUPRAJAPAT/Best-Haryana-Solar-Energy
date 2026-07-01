/* =========================================================
   Best Haryana Solar Energy — Shared Components
   Single source of truth for the header, footer, floating
   CTAs and sticky-mobile bar. Injected into placeholder
   elements at DOMContentLoaded.

   Usage in any HTML page:
     <div data-include="site-header"></div>
     <div data-include="site-footer"></div>
     <div data-include="floating-ctas"></div>
     <div data-include="sticky-cta-bar"></div>

   The placeholder is REPLACED with the rendered markup
   (via outerHTML), so the surrounding DOM stays clean.

   Why a vanilla template-function approach instead of
   fetch()? Because the site must deploy by FTP drop —
   any file:// or CORS hiccup would break fetch-based
   partials. Template functions just work.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Active page detection ---------- */
  function currentPage() {
    let path = window.location.pathname;
    // Strip trailing slash
    path = path.replace(/\/$/, '');
    // Take last segment
    const seg = path.split('/').pop() || 'index.html';
    return seg;
  }
  function activeKey() {
    const p = currentPage();
    if (!p || p === '' || p === 'index.html') return 'home';
    if (p === 'services.html') return 'services';
    if (p.indexOf('services/') !== -1 || window.location.pathname.indexOf('/services/') !== -1) return 'services';
    if (p === 'calculator.html') return 'calculator';
    if (p === 'subsidy.html') return 'subsidy';
    if (p === 'projects.html') return 'projects';
    if (p === 'service-area.html') return 'service-area';
    if (p === 'about.html') return 'about';
    if (p === 'contact.html') return 'contact';
    if (p === 'faq.html') return 'faq';
    return '';
  }

  // Helper to build link href that adjusts for service detail subpages
  function inDir() {
    // True when current URL contains "/services/" (i.e. we're in the services/ folder)
    return window.location.pathname.indexOf('/services/') !== -1;
  }
  function href(target) {
    return inDir() ? '../' + target : target;
  }

  const NAV_ITEMS = [
    { key: 'services',     href: 'services.html',     label: 'Services'     },
    { key: 'calculator',   href: 'calculator.html',   label: 'Calculator'   },
    { key: 'subsidy',      href: 'subsidy.html',      label: 'Subsidy'      },
    { key: 'projects',     href: 'projects.html',     label: 'Projects'     },
    { key: 'about',        href: 'about.html',        label: 'About'        },
    { key: 'contact',      href: 'contact.html',      label: 'Contact'      },
  ];

  /* ---------- Inline SVG fragments (kept here so every page uses identical brand glyphs) ---------- */
  const WA_SVG = '<svg class="icn" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
  const WA_PLAIN_SVG = WA_SVG.replace('class="icn" ', '');
  const FB_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';
  const IG_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>';
  const SUN_BRAND_SVG = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4.5" fill="#FFC52E"/><g stroke="#FFC52E" stroke-width="2" stroke-linecap="round"><line x1="12" y1="2.5" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="21.5"/><line x1="2.5" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="21.5" y2="12"/><line x1="5.3" y1="5.3" x2="7.1" y2="7.1"/><line x1="16.9" y1="16.9" x2="18.7" y2="18.7"/><line x1="18.7" y1="5.3" x2="16.9" y2="7.1"/><line x1="7.1" y1="16.9" x2="5.3" y2="18.7"/></g></svg>';

  /* ---------- Header ---------- */
  function tplHeader() {
    const active = activeKey();
    const navHTML = NAV_ITEMS.map(item => {
      const isActive = item.key === active;
      return `<a href="${href(item.href)}"${isActive ? ' aria-current="page" class="is-active"' : ''}>${item.label}</a>`;
    }).join('');
    const mobileHTML = NAV_ITEMS.map(item => {
      const isActive = item.key === active;
      return `<li><a href="${href(item.href)}"${isActive ? ' aria-current="page" class="is-active"' : ''}>${item.label}</a></li>`;
    }).join('');

    return `<header class="site-header" role="banner">
    <div class="container header-inner">
      <a href="${href('index.html')}" class="brand" aria-label="Best Haryana Solar Energy - Home">
        <span class="brand-mark" aria-hidden="true">
          <img src="${href('images/logo.webp')}" alt="" width="38" height="38" />
        </span>
        <span class="brand-text">
          Best Haryana Solar Energy
          <small>Since 2013</small>
        </span>
      </a>

      <nav class="nav" role="navigation" aria-label="Primary">
        ${navHTML}
      </nav>

      <a class="btn btn--primary btn--sm header-cta" href="tel:+919050984623" aria-label="Call now">
        <i data-lucide="phone" class="icn"></i> Call Now
      </a>

      <button class="hamburger" aria-label="Toggle menu" aria-controls="mobileMenu" aria-expanded="false">
        <span class="hamburger-lines" aria-hidden="true"><span></span><span></span><span></span></span>
      </button>
    </div>

    <div class="mobile-menu" id="mobileMenu" role="navigation" aria-label="Mobile">
      <ul>${mobileHTML}</ul>
      <a class="btn btn--primary" href="tel:+919050984623">Call +91 90509 84623</a>
    </div>
  </header>`;
  }

  /* ---------- Footer ---------- */
  function tplFooter() {
    const nav = NAV_ITEMS.map(i => `<li><a href="${href(i.href)}">${i.label}</a></li>`).join('');
    const services = [
      { href: 'services/on-grid-solar-inverter.html',   label: 'On-grid Solar Inverters' },
      { href: 'services/off-grid-solar-inverter.html',  label: 'Off-grid Solar Inverters' },
      { href: 'services/hybrid-solar-system.html',      label: 'Hybrid Solar System' },
      { href: 'services/solar-street-light.html',       label: 'Solar Street Light' },
      { href: 'services/solar-agriculture-pump.html',   label: 'Solar Agriculture Pump' },
      { href: 'services/solar-atta-chakki.html',        label: 'Solar Atta Chakki' },
    ];
    const servicesHTML = services.map(s => `<li><a href="${href(s.href)}">${s.label}</a></li>`).join('');

    return `<footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="footer-grid">

        <div class="footer-brand">
          <a href="${href('index.html')}" class="brand" aria-label="Best Haryana Solar Energy - Home">
            <span class="brand-mark" aria-hidden="true">
              <img src="${href('images/logo.webp')}" alt="" width="38" height="38" />
            </span>
            <span class="brand-text">
              Best Haryana Solar Energy
              <small>Since 2013</small>
            </span>
          </a>
          <p class="footer-tagline">"Sunlight is free. Your bill shouldn't be either."</p>
          <div class="footer-socials">
            <a class="footer-social" href="https://www.facebook.com/profile.php?id=61560082832521" target="_blank" rel="noopener" aria-label="Facebook">${FB_SVG}</a>
            <a class="footer-social" href="https://www.instagram.com/best.haryanasolarenergy/" target="_blank" rel="noopener" aria-label="Instagram">${IG_SVG}</a>
            <a class="footer-social" href="https://wa.me/919050984623" target="_blank" rel="noopener" aria-label="WhatsApp">${WA_PLAIN_SVG}</a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul>${nav}</ul>
        </div>

        <div class="footer-col">
          <h4>Services</h4>
          <ul>${servicesHTML}</ul>
        </div>

        <div class="footer-col">
          <h4>Contact</h4>
          <ul>
            <li class="contact-line">
              <i data-lucide="map-pin" aria-hidden="true"></i>
              <span>Vikash Colony, H.No. 88, Behind Sector-4, Karnal-132001, Haryana</span>
            </li>
            <li class="contact-line">
              <i data-lucide="phone" aria-hidden="true"></i>
              <a href="tel:+919050984623">+91 90509 84623</a>
            </li>
            <li class="contact-line">
              <i data-lucide="mail" aria-hidden="true"></i>
              <a href="mailto:info@bestharyanasolarenergy.com">info@bestharyanasolarenergy.com</a>
            </li>
            <li class="contact-line">
              <i data-lucide="mail" aria-hidden="true"></i>
              <a href="mailto:bestharyanasolarenergy@gmail.com">bestharyanasolarenergy@gmail.com</a>
            </li>
          </ul>
        </div>

      </div>

      <div class="footer-bottom">
        <span>&copy; 2026 Best Haryana Solar Energy. All rights reserved.</span>
        <span>Karnal, Haryana, India</span>
      </div>
    </div>
  </footer>`;
  }

  /* ---------- Floating action buttons ---------- */
  function tplFloatingCTAs() {
    return `<div class="fab-stack" aria-hidden="false">
    <a class="fab fab--wa" href="https://wa.me/919050984623?text=Hi%2C%20I%27m%20interested%20in%20solar%20installation" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${WA_PLAIN_SVG}</a>
    <a class="fab fab--call" href="tel:+919050984623" aria-label="Call now"><i data-lucide="phone"></i></a>
  </div>`;
  }

  /* ---------- Sticky mobile CTA bar (removed) ---------- */
  function tplStickyCTA() {
    return '';
  }

  const TEMPLATES = {
    'site-header': tplHeader,
    'site-footer': tplFooter,
    'floating-ctas': tplFloatingCTAs,
    'sticky-cta-bar': tplStickyCTA,
  };

  function inject() {
    document.querySelectorAll('[data-include]').forEach(el => {
      const tpl = TEMPLATES[el.dataset.include];
      if (!tpl) return;
      const html = tpl();
      // Replace the placeholder div with the rendered markup
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      const node = tmp.firstElementChild;
      if (node) el.replaceWith(node);
    });

    // Refresh Lucide icons after injection
    if (typeof window.lucide !== 'undefined') {
      try { window.lucide.createIcons({ attrs: { 'stroke-width': 2 } }); } catch (e) {}
    }

    // Signal that components are mounted so other scripts (header scroll,
    // hamburger menu, etc.) can re-bind.
    document.dispatchEvent(new CustomEvent('components:ready'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
