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
    }

    if (hamburger && !hamburger.dataset.bound) {
      hamburger.dataset.bound = '1';
      hamburger.addEventListener('click', () => {
        setMenu(!hamburger.classList.contains('is-open'));
      });

      // iOS-style dismiss: tap anywhere outside the floating menu to close
      document.addEventListener('click', (e) => {
        if (!mobileMenu.classList.contains('is-open')) return;
        if (mobileMenu.contains(e.target) || hamburger.contains(e.target)) return;
        setMenu(false);
      });
      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenu(false);
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

  /* ---------- Solar Assistant (rule-based FAQ chatbot) ---------- */
  function initChatbot() {
    const root = document.getElementById('chatbot');
    if (!root || root.dataset.bound) return;
    root.dataset.bound = '1';

    const toggle = document.getElementById('chatbotToggle');
    const panel  = document.getElementById('chatbotPanel');
    const closeB = document.getElementById('chatbotClose');
    const backdrop = document.getElementById('chatbotBackdrop');
    const body   = document.getElementById('chatbotBody');
    const form   = document.getElementById('chatbotForm');
    const input  = document.getElementById('chatbotInput');
    if (!toggle || !panel || !body) return;

    // Relative-path prefix so links work from /services/ subpages too
    const BASE = location.pathname.indexOf('/services/') !== -1 ? '../' : '';
    const WA = 'https://wa.me/919050984623?text=Hi%2C%20I%27d%20like%20a%20free%20solar%20quote';
    const waLink   = '<a href="' + WA + '" target="_blank" rel="noopener">WhatsApp</a>';
    const callLink = '<a href="tel:+919050984623">+91&nbsp;90509&nbsp;84623</a>';
    const calcLink = '<a href="' + BASE + 'calculator.html">savings calculator</a>';

    // Knowledge base — grounded in the site's own FAQ / subsidy / services copy
    const KB = [
      { label: 'Cost per kW?', keys: ['cost','price','prices','pricing','kw','per kw','rate','rates','how much','expensive','budget','quote price','₹'],
        a: 'For a standard on-grid rooftop in Haryana it&rsquo;s about <b>₹60,000&ndash;₹70,000 per kW</b> before subsidy. Example: a 3&nbsp;kW system &asymp; ₹1,95,000, which drops to roughly <b>₹1,17,000 net</b> after the ₹78,000 PM&nbsp;Surya&nbsp;Ghar subsidy. Try our ' + calcLink + ' for your estimate.' },
      { label: 'How the subsidy works', keys: ['subsidy','surya','ghar','pm','yojana','78000','78,000','government','govt','scheme'],
        a: 'Under <b>PM&nbsp;Surya&nbsp;Ghar</b> you can get up to <b>₹78,000</b> credited directly to your bank account. We handle everything &mdash; portal registration with your DISCOM consumer number, feasibility approval, installation, commissioning docs, and the net-meter process.' },
      { label: 'Warranty', keys: ['warranty','guarantee','warrantee','life','lifespan','years warranty'],
        a: 'Panels carry a <b>25-year performance</b> warranty and 10&ndash;12-year product warranty (Tata Power Solar, Waaree, Adani, Vikram). Inverters carry 5&ndash;10 years (Luminous, Microtek, Havells), and the galvanized mounting structure lasts 20+ years.' },
      { label: 'Maintenance', keys: ['maintenance','maintain','clean','cleaning','service','upkeep','dust'],
        a: 'Very little &mdash; just rinse the panels with water every 15&ndash;30 days (more often in dusty areas) and an annual check of cables. We include <b>5 years of routine maintenance support</b> with every system.' },
      { label: 'Installation time', keys: ['install','installation','how long','time','timeline','days','duration','fast'],
        a: 'The physical installation of a 1&ndash;10&nbsp;kW system is completed in just <b>1&ndash;2 days</b>. The rest &mdash; subsidy approval, DISCOM inspection and net-meter commissioning &mdash; is usually wrapped up within <b>10&ndash;15 days</b>.' },
      { label: 'Net metering', keys: ['net meter','net metering','metering','bidirectional','export','sell','credit units'],
        a: 'Net metering uses a bidirectional meter that measures power you draw <i>and</i> the surplus solar you send back. You only pay for the <b>net</b> consumption &mdash; extra units are credited and offset future bills.' },
      { label: 'Power cut backup', keys: ['power cut','powercut','backup','battery','cut','outage','blackout','hybrid'],
        a: 'A standard on-grid system switches off during a power cut (DISCOM safety rule). For backup during cuts we recommend a <b>hybrid system with battery</b> &mdash; it keeps fans, lights, TV and fridge running. We size the battery to your needs.' },
      { label: 'Payback & ROI', keys: ['payback','roi','return','savings','save','worth','profit','recover'],
        a: 'Payback is typically <b>3&ndash;5 years</b> after subsidy, and the system keeps generating free power for 20+ years &mdash; so 25-year savings often cross <b>₹5&ndash;₹10 lakh</b>. See your number with our ' + calcLink + '.' },
      { label: 'Services', keys: ['service','services','install what','offer','products','on-grid','off-grid','street light','pump','atta','chakki','system'],
        a: 'We install <b>on-grid, off-grid &amp; hybrid</b> solar systems, plus solar <b>street lights</b>, <b>agriculture pumps</b> and <b>atta chakki</b> setups &mdash; from 1&nbsp;kW homes to 25&nbsp;kW commercial. <a href="' + BASE + 'services.html">See all services</a>.' },
      { label: 'Do you cover my area?', keys: ['area','areas','city','cover','location','karnal','panipat','kurukshetra','ambala','yamunanagar','kaithal','sonipat','rohtak','jind','hisar','panchkula','near me','haryana'],
        a: 'We serve <b>Karnal, Panipat, Kurukshetra, Ambala, Yamunanagar, Kaithal, Sonipat, Rohtak, Jind, Hisar, Panchkula</b> and across Haryana. Tell us your town on ' + waLink + ' and we&rsquo;ll confirm a free site survey.' },
      { label: 'Talk to a person', keys: ['contact','talk','human','call','phone','number','whatsapp','person','agent','reach','speak'],
        a: 'Happy to help directly! Call ' + callLink + ' or message us on ' + waLink + ' &mdash; we usually reply within minutes during working hours (Mon&ndash;Sat, 9am&ndash;7pm).' },
      { label: 'Get a free quote', keys: ['quote','estimate','free quote','survey','book','get started','interested','apply'],
        a: 'Great! Two easy ways: get an instant figure from our ' + calcLink + ', or send your monthly bill on ' + waLink + ' for a free, no-obligation quote and site survey.' },
      { label: 'What size do I need?', keys: ['size','sizing','how many kw','what size','kw do i need','capacity','how big','which size','recommend size'],
        a: 'As a rough guide, each <b>1&nbsp;kW</b> suits about <b>₹800&ndash;₹1,000</b> of monthly bill (roughly 120&ndash;150 units). Most Haryana homes go for <b>2&ndash;5&nbsp;kW</b>. Pop your bill into our ' + calcLink + ' and it&rsquo;ll suggest the right size instantly.' },
      { label: 'How much will it generate?', keys: ['generate','generation','units per day','how much power','output','produce','kwh','electricity produced','how many units'],
        a: 'In Haryana, roughly <b>4&ndash;5 units (kWh) per kW per day</b> &mdash; so a 3&nbsp;kW system makes about <b>360&ndash;450 units a month</b>, enough to cover a typical home&rsquo;s usage. Output varies a little by season and shading.' },
      { label: 'Roof space needed?', keys: ['roof','space','area required','sqft','square feet','how much roof','terrace','area needed','shadow','shade'],
        a: 'You need about <b>80&ndash;100 sq ft (8&ndash;10 sq m) of shadow-free roof per kW</b>. A 3&nbsp;kW system needs roughly 250&ndash;300 sq ft. Our free site survey confirms the exact layout for your roof.' },
      { label: 'Loan / EMI options?', keys: ['loan','emi','finance','financing','installment','instalment','down payment','bank loan','monthly payment','credit'],
        a: 'Yes &mdash; low-interest, largely collateral-free solar loans are available under the PM&nbsp;Surya&nbsp;Ghar scheme, so you can pay in easy EMIs instead of a lump sum. Share your details on ' + waLink + ' and we&rsquo;ll help arrange financing.' },
      { label: 'Documents needed?', keys: ['document','documents','papers','required','aadhaar','aadhar','kyc','proof','id proof','what do i need'],
        a: 'Just the basics: your <b>latest electricity bill</b>, <b>Aadhaar</b>, a <b>bank passbook/cancelled cheque</b>, a passport photo, and a photo of your roof. We handle all the portal and DISCOM paperwork for you.' },
      { label: 'On-grid vs off-grid vs hybrid', keys: ['on-grid','off-grid','hybrid','difference','which system','types of system','ongrid','offgrid','grid tie','with battery'],
        a: '<b>On-grid</b>: cheapest, sells surplus to the grid, no backup during cuts (subsidy-eligible). <b>Off-grid</b>: runs on batteries, ideal where grid is weak. <b>Hybrid</b>: grid + battery, so you also get backup during power cuts. We help you pick based on your needs.' },
      { label: 'Will it cut my bill?', keys: ['reduce bill','zero bill','save bill','lower bill','electricity bill','bijli bill','cut bill','bill kam','no bill'],
        a: 'A rightly-sized system can cut <b>90&ndash;100%</b> of your electricity bill. With net metering, surplus units are credited, so many customers see bills drop to just the fixed charges.' },
      { label: 'Commercial / farm / society?', keys: ['commercial','business','factory','society','housing','farm','agriculture','pump','shop','industrial','company','apartment'],
        a: 'Absolutely &mdash; we do <b>homes, shops, factories, housing societies</b> and <b>agricultural pumps</b>, from 1&nbsp;kW up to 25&nbsp;kW+ commercial plants. Tell us your load on ' + waLink + ' for a tailored quote.' },
      { label: 'Office & timings', keys: ['address','office','where are you','located','location','visit','shop address','timing','timings','open','hours','when open','contact address'],
        a: 'We&rsquo;re in <b>Karnal</b> &mdash; Vikash Colony, H.No.&nbsp;88, Behind Sector-4, Karnal&nbsp;132001. Open <b>Mon&ndash;Sat, 9am&ndash;7pm</b>. Call ' + callLink + ' before visiting and we&rsquo;ll keep things ready.' },
      { label: 'Am I eligible?', keys: ['eligible','eligibility','qualify','who can','can i get subsidy','am i eligible','requirement'],
        a: 'Any <b>residential electricity consumer with their own roof</b> and a valid DISCOM connection can apply for the PM&nbsp;Surya&nbsp;Ghar subsidy. We check your eligibility for free &mdash; just share your latest bill on ' + waLink + '.' }
    ];

    // Contextual follow-ups — what to suggest after each answer
    const FOLLOW = {
      'How the subsidy works': ['Am I eligible?', 'Documents needed?'],
      'Am I eligible?': ['How the subsidy works', 'Get a free quote'],
      'Cost per kW?': ['What size do I need?', 'Loan / EMI options?'],
      'What size do I need?': ['How much will it generate?', 'Cost per kW?'],
      'How much will it generate?': ['Will it cut my bill?', 'What size do I need?'],
      'Payback & ROI': ['Will it cut my bill?', 'Get a free quote'],
      'Will it cut my bill?': ['Net metering', 'Payback & ROI'],
      'Loan / EMI options?': ['Cost per kW?', 'Documents needed?'],
      'Documents needed?': ['How the subsidy works', 'Installation time'],
      'Warranty': ['Maintenance', 'On-grid vs off-grid vs hybrid'],
      'Maintenance': ['Warranty', 'Will it cut my bill?'],
      'Installation time': ['Documents needed?', 'Get a free quote'],
      'Net metering': ['Will it cut my bill?', 'Power cut backup'],
      'Power cut backup': ['On-grid vs off-grid vs hybrid', 'Cost per kW?'],
      'On-grid vs off-grid vs hybrid': ['Power cut backup', 'What size do I need?'],
      'Services': ['What size do I need?', 'Commercial / farm / society?'],
      'Do you cover my area?': ['Get a free quote', 'Office & timings'],
      'Commercial / farm / society?': ['What size do I need?', 'Get a free quote'],
      'Office & timings': ['Do you cover my area?', 'Get a free quote'],
      'Roof space needed?': ['What size do I need?', 'Get a free quote'],
      'Get a free quote': ['What size do I need?', 'How the subsidy works']
    };
    const STARTERS = ['How the subsidy works', 'Cost per kW?', 'What size do I need?', 'Get a free quote'];
    const PHONE = '+919050984623';

    let opened = false, greeted = false, chipGroup = null;

    function esc(s) {
      return s.replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    function scrollDown() { body.scrollTop = body.scrollHeight; }

    function addMsg(html, who) {
      const el = document.createElement('div');
      el.className = 'chatbot-msg chatbot-msg--' + who;
      el.innerHTML = html;
      body.appendChild(el);
      scrollDown();
      return el;
    }

    // Render tappable suggestion chips inline, right under the latest message
    function showChips(items) {
      if (chipGroup) { chipGroup.remove(); chipGroup = null; }
      if (!items || !items.length) return;
      const g = document.createElement('div');
      g.className = 'chatbot-chips chatbot-chips--inline';
      items.forEach(function (it) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'chatbot-chip' + (it.primary ? ' chatbot-chip--primary' : '');
        b.innerHTML = it.text;
        b.addEventListener('click', function () {
          if (chipGroup) { chipGroup.remove(); chipGroup = null; }
          it.run();
        });
        g.appendChild(b);
      });
      body.appendChild(g);
      chipGroup = g;
      scrollDown();
    }

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reveal HTML answer token-by-token (typewriter), keeping tags/entities/emoji intact
    function typeInto(el, html, done) {
      var tokens = html.match(/<[^>]+>|&[a-zA-Z]+;|&#\d+;|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S]/g) || [];
      var i = 0;
      el.innerHTML = '';
      el.classList.add('is-typing');
      (function step() {
        if (i >= tokens.length) {
          el.classList.remove('is-typing');
          if (done) done();
          return;
        }
        i++;
        el.innerHTML = tokens.slice(0, i).join('');
        scrollDown();
        var tok = tokens[i - 1];
        setTimeout(step, tok && tok.charAt(0) === '<' ? 0 : 13);
      })();
    }

    function botSay(html, chipItems) {
      var bubble = addMsg('<span class="chatbot-typing"><i></i><i></i><i></i></span>', 'bot');
      setTimeout(function () {
        if (reduceMotion) {
          bubble.innerHTML = html;
          scrollDown();
          if (chipItems) showChips(chipItems);
          return;
        }
        typeInto(bubble, html, function () {
          if (chipItems) showChips(chipItems);
        });
      }, 380);
    }

    // Chip builders
    function qChip(label) { return { text: label, run: function () { answerByLabel(label); } }; }
    function contactChip() { return { text: '💬 Talk to our team', run: askContact }; }
    function followChips(item) {
      const rel = (FOLLOW[item.label] || STARTERS).filter(function (l) { return l !== item.label; });
      return rel.slice(0, 2).map(qChip).concat(contactChip());
    }
    function starterChips() { return STARTERS.map(qChip).concat(contactChip()); }

    function answerByLabel(label) {
      const item = KB.find(function (k) { return k.label === label; });
      if (!item) return;
      addMsg(esc(label), 'user');
      if (item.label === 'Talk to a person') { askContact(); return; }
      botSay(item.a, followChips(item));
    }

    // ---- Action flow: confirm, then actually call / open WhatsApp ----
    function askContact() {
      botSay('Sure &mdash; I can connect you with our team right away. 😊 Would you like me to call you now?', [
        { text: '✅ Yes, call now', primary: true, run: doCall },
        { text: '💬 WhatsApp instead', run: doWhatsApp },
        { text: '↩️ No, keep browsing', run: function () {
          botSay('No problem! What else would you like to know?', starterChips());
        } }
      ]);
    }
    function doCall() {
      addMsg('Yes, call now', 'user');
      window.location.href = 'tel:' + PHONE;
      botSay('📞 Dialing <b>+91&nbsp;90509&nbsp;84623</b> for you&hellip; if your phone didn&rsquo;t open the dialer, tap ' + callLink + '.', starterChips());
    }
    function doWhatsApp() {
      addMsg('Open WhatsApp', 'user');
      window.open(WA, '_blank', 'noopener');
      botSay('💬 I&rsquo;ve opened <b>WhatsApp</b> for you. Didn&rsquo;t open? Tap ' + waLink + ' &mdash; send your latest bill and we&rsquo;ll reply with a quick quote.', starterChips());
    }

    function match(text) {
      const q = text.toLowerCase();
      let best = null, bestScore = 0;
      KB.forEach(function (item) {
        let score = 0;
        item.keys.forEach(function (k) { if (q.indexOf(k) !== -1) score += k.length; });
        if (score > bestScore) { bestScore = score; best = item; }
      });
      return bestScore > 0 ? best : null;
    }

    function handleInput(text) {
      addMsg(esc(text), 'user');
      const q = text.toLowerCase();
      if (/(^|\s)(hi|hii|hey|hello|helo|hlo|namaste|namaskar|ram ram|good morning|good evening|good afternoon)(\s|$|!|\.|,)/.test(q)) {
        botSay('Namaste! 🙏 How can I help &mdash; subsidy, cost, savings, or your area?', starterChips());
        return;
      }
      if (/(thank|thanks|thanku|thnx|shukriya|dhanyavad|dhanyawad)/.test(q)) {
        botSay('You&rsquo;re welcome! 🙏 Anything else I can help with?', starterChips());
        return;
      }
      // Direct intent to reach a human -> jump straight to the call/WhatsApp flow
      if (/\b(call|call me|phone|talk|contact|whatsapp|speak|connect|reach you|number)\b/.test(q)) {
        askContact();
        return;
      }
      const hit = match(text);
      if (hit) {
        if (hit.label === 'Talk to a person') { askContact(); return; }
        botSay(hit.a, followChips(hit));
      } else {
        botSay('I&rsquo;m not sure about that one yet &mdash; but our team can help right away. Would you like to connect?', [
          { text: '✅ Yes, call now', primary: true, run: doCall },
          { text: '💬 WhatsApp', run: doWhatsApp },
          qChip('How the subsidy works'),
          qChip('Get a free quote')
        ]);
      }
    }

    function openPanel() {
      opened = true;
      root.classList.add('is-open');
      panel.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      if (!greeted) {
        greeted = true;
        botSay('Namaste! 🙏 I&rsquo;m your Solar Assistant. Ask me anything about solar &mdash; or tap below. I can also connect you straight to our team.', starterChips());
      }
      setTimeout(function () { if (window.matchMedia('(min-width: 768px)').matches) input.focus(); }, 300);
    }
    function closePanel() {
      opened = false;
      root.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () { opened ? closePanel() : openPanel(); });
    if (closeB) closeB.addEventListener('click', closePanel);
    if (backdrop) backdrop.addEventListener('click', closePanel);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && opened) closePanel(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      handleInput(text);
    });
  }
  document.addEventListener('components:ready', initChatbot);
  if (document.readyState !== 'loading') initChatbot();
  else document.addEventListener('DOMContentLoaded', initChatbot);

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
