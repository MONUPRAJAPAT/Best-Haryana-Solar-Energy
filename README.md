# Best Haryana Solar Energy — Site Architecture

Static, multi-page site for [bestharyanasolarenergy.in](https://bestharyanasolarenergy.in). Pure HTML + CSS + vanilla JS. **No build step. No npm. Deploy by FTP drop.**

---

## 1. Sitemap

| Page | Path | What it covers |
|---|---|---|
| Home | `/index.html` | Hero, 3D scrollytelling, brief overview, CTAs |
| About | `/about.html` | Story, govt recognition (Hindi), trust stats |
| Services hub | `/services.html` | All 6 services in a grid |
| Service detail (×6) | `/services/{slug}.html` | One per service — full spec sheet + CTA |
| Calculator | `/calculator.html` | ROI calculator (Bill / Size / Cost) |
| Subsidy | `/subsidy.html` | PM Surya Ghar subsidy slabs + steps |
| Projects | `/projects.html` | Flagship + 13 gallery items + filter |
| Service Area | `/service-area.html` | Districts + Google Maps embed |
| FAQ | `/faq.html` | 8 questions accordion |
| Contact | `/contact.html` | WhatsApp form + testimonials + FAQ |
| 404 | `/404.html` | Themed error page |
| Crawl | `/sitemap.xml`, `/robots.txt` | SEO |

---

## 2. Files

```
solar-website/
├── index.html                    Home (Hero + 3D + brief)
├── about.html                    About / Why us
├── services.html                 Services hub
├── services/
│   ├── on-grid-solar-inverter.html
│   ├── off-grid-solar-inverter.html
│   ├── hybrid-solar-system.html
│   ├── solar-street-light.html
│   ├── solar-agriculture-pump.html
│   └── solar-atta-chakki.html
├── calculator.html               ROI Calculator
├── subsidy.html                  PM Surya Ghar guide
├── projects.html                 Project Gallery
├── service-area.html             Coverage + map
├── faq.html                      Accordion
├── contact.html                  WhatsApp form
├── 404.html                      Themed not-found
├── sitemap.xml
├── robots.txt
├── css/
│   └── style.css                 ~2200 lines, sectioned, CSS-var tokens
├── js/
│   ├── components.js             Shared header/footer/CTAs (template fns)
│   ├── main.js                   Header scroll, mobile menu, gallery filter, FAQ, dots
│   ├── animations.js             Reveal, magnet/tilt, View Transitions
│   ├── calculator.js             ROI calculator logic
│   └── hero3d.js                 Three.js sunrise→install→hero scene
└── images/                       Assets (logos, products, gallery)
```

---

## 3. The shared component system

The header, footer, floating WhatsApp+Call buttons, and sticky mobile bar are defined **once** in `js/components.js` and injected via placeholder elements:

```html
<body>
  <div data-include="site-header"></div>
  <main>…page content…</main>
  <div data-include="site-footer"></div>
  <div data-include="floating-ctas"></div>
  <div data-include="sticky-cta-bar"></div>
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  <script src="js/components.js?v=11"></script>
  <script src="js/animations.js?v=11" defer></script>
  <script src="js/main.js?v=11" defer></script>
</body>
```

`components.js` runs on `DOMContentLoaded`, replaces each placeholder with rendered markup, and fires `components:ready`. `main.js` listens for that event and binds header scroll / hamburger / mobile-menu handlers.

**To edit the nav, header, or footer:** open `js/components.js`. One place. Every page updates.

---

## 4. The CSS block library

`css/style.css` is split into numbered sections (look at the file header). The reusable "blocks" you can drop into any page:

| Block | Class | Use |
|---|---|---|
| Page hero | `.page-hero` | Section-top headline + lede + breadcrumb |
| Bento grid | `.bento` + `.bento-tile` + `[data-bento]` | Asymmetric tile grid (services, features) |
| Stat band | `.stat-band` + `[data-counter]` | Animated counters (years, projects, etc.) |
| CTA band | `.cta-band` | Dark closing CTA, contact info on the side |
| Reveal animation | `.reveal`, `.reveal-stagger` | Scroll-in opacity/translate |
| Magnetic button | `.magnet` | Pulls toward cursor on hover (desktop only) |
| Tilt card | `.tilt` | Subtle 3D rotation following cursor |
| Service detail | `.service-detail` | 2-column image + features + specs |
| Brand marquee | `.brand-marquee` + `.brand-marquee-track` | Continuous logo scroll |

All blocks use the same CSS-var color tokens. No new colors needed.

### Theme tokens

```css
--paper:     #FBF6EC    /* main background */
--ivory:     #FFF5E0
--ink-900:   #1F1612    /* text + dark sections */
--sun-500:   #E89B2D    /* primary accent */
--set-600:   #B14820    /* terracotta (italic accents) */
--leaf-500:  #2D5F3F    /* trust badges */
```

---

## 5. Rich-UI techniques in use

| Technique | Where | Lib? |
|---|---|---|
| Procedural Three.js 3D scrollytelling | Home: dawn→install→hero | Three.js (CDN import map, `0.160.0`) |
| Scroll-reveal (IntersectionObserver) | All `.reveal` blocks | None |
| Animated counters | Stat bands | None |
| Magnetic buttons | `.magnet` CTAs | None |
| Tilt cards | `.tilt` photo cards | None |
| View Transitions API | Inner-site navigation | Native (graceful fallback) |
| Auto-marquee | Brands strip, testimonials desktop | CSS only |
| Scroll-snap carousel | Testimonials mobile | CSS scroll-snap + JS dots |

All effects respect `prefers-reduced-motion: reduce` and gracefully degrade on coarse-pointer / mobile / older browsers.

---

## 6. How to add a new page

1. Create a new file at the root (or in `services/`). Use this skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title — Best Haryana Solar Energy</title>
  <meta name="description" content="…" />
  <link rel="icon" type="image/webp" href="images/logo.webp" />
  <link rel="stylesheet" href="css/style.css?v=11" />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body>
  <div data-include="site-header"></div>
  <main id="top">
    <section class="page-hero">
      <div class="container">
        <nav class="breadcrumb"><a href="index.html">Home</a> <span class="breadcrumb-sep">›</span> <span aria-current="page">Your Page</span></nav>
        <span class="page-hero-eyebrow">Section</span>
        <h1 class="page-hero-title">Your <em>headline</em> here.</h1>
        <p class="page-hero-lede">Lede paragraph.</p>
      </div>
    </section>
    <!-- …content blocks here… -->
  </main>
  <div data-include="site-footer"></div>
  <div data-include="floating-ctas"></div>
  <div data-include="sticky-cta-bar"></div>
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  <script src="js/components.js?v=11"></script>
  <script src="js/animations.js?v=11" defer></script>
  <script src="js/main.js?v=11" defer></script>
</body>
</html>
```

2. Add the page to the nav by editing `NAV_ITEMS` in `js/components.js`.
3. Add the URL to `sitemap.xml`.

---

## 7. Deploy

1. **Hostinger / GoDaddy / cPanel**: upload the **contents** of `solar-website/` into `public_html/`. Done.
2. **Netlify drop**: drag the `solar-website` folder onto [app.netlify.com/drop](https://app.netlify.com/drop). Done.
3. For Apache hosts, create a `.htaccess` with `ErrorDocument 404 /404.html` so the themed 404 page serves correctly.

---

## 8. CDN libraries used

All loaded by a single `<script>` / `<link>` each. No build step.

| Library | URL | What for |
|---|---|---|
| **Google Fonts** | `fonts.googleapis.com` | Fraunces, Plus Jakarta Sans, Caveat, Noto Sans Devanagari |
| **Lucide Icons** | `unpkg.com/lucide@latest/dist/umd/lucide.js` | UI icons (replaces `<i data-lucide>` tags with SVGs) |
| **Three.js** | `unpkg.com/three@0.160.0/build/three.module.js` (import map) | 3D scrollytelling scene on home |

If any CDN fails, the site still renders — Lucide tags stay as empty `<i>` (harmless), the 3D scene falls back to its static warm-gradient panel, and fonts fall back to system serif / sans.

---

## 9. Tweak guide (common edits)

- **Phone / email / address** — search and replace in `js/components.js` (footer + contact line are defined there).
- **Sticky bottom CTA** — `js/components.js` → `tplStickyCTA()`.
- **3D scrollytelling length** — `css/style.css` → `.hero3d { height: 320vh }`. Smaller = faster scrub.
- **3D animation thresholds** — `js/hero3d.js` → `updateScene(p)` function (the `if (p < 0.22)…` chain).
- **Color tokens** — `css/style.css` `:root` block.
- **Add a service** — duplicate one of `services/*.html`, add to the services array in `services.html`, list it in the footer's services column inside `js/components.js`.
