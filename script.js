const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* =========================
   HERO SYNC CONTROLLER
========================= */

const heroSection = $('.hero');

// setup active bg layer for crossfade ('a' or 'b')
if (heroSection) {
  const computed = getComputedStyle(heroSection).getPropertyValue('--hero-photo') || '';
  const initialPhoto = computed.trim() || backgroundImages[0];
  // initialize CSS vars used by the layered background
  heroSection.style.setProperty('--hero-bg-a', initialPhoto);
  heroSection.style.setProperty('--hero-bg-b', '');
  heroSection.dataset.activeBg = heroSection.dataset.activeBg || 'a';
}

const HERO_DURATION = 8000;

const backgroundImages = [
  "url('MGL%20Photos/PHOTO-2026-04-21-15-30-35%205.jpg')",
  "url('MGL%20Photos/PHOTO-2026-04-21-15-30-38%205.jpg')",
  "url('MGL%20Photos/PHOTO-2026-04-21-15-30-35%206.jpg')",
  "url('MGL%20Photos/PHOTO-2026-04-21-15-30-33%206.jpg')",
];

const spotlightOrder = ['grow', 'cleanup', 'build', 'winter'];
let heroIndex = 0;

/* =========================
   TOAST
========================= */

const toastEl = $('#toast');
let toastTimer = null;

const toast = (message) => {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('is-showing');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl.classList.remove('is-showing'), 2400);
};

/* =========================
   NAV
========================= */

const navToggle = $('.nav-toggle');
const siteNav = $('#site-nav');

if (navToggle && siteNav) {
  const setOpen = (isOpen) => {
    siteNav.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  };

  navToggle.addEventListener('click', () => {
    const isOpen = !siteNav.classList.contains('is-open');
    setOpen(isOpen);
  });

  siteNav.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.matches('a')) setOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) setOpen(false);
  });
}

/* =========================
   FOOTER YEAR
========================= */

const yearEl = $('#year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* =========================
   REVEAL
========================= */

const revealEls = $$('.reveal-on-scroll');

if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-in'));
}

/* =========================
   SPOTLIGHT SYSTEM
========================= */

const spotlight = {
  grow: {
    accent: ['#4ade80', '#16a34a'],
    title: 'Full-season lawn care',
    text: 'Keep your property clean, trimmed, and healthy all season long.',
    list: [
      'Weekly / bi-weekly mowing',
      'Edging & trimming',
      'Pruning & upkeep',
      'Consistent scheduling'
    ],
  },
  cleanup: {
    accent: ['#fbbf24', '#d97706'],
    title: 'Seasonal cleanups done right',
    text: 'We reset your yard after storms, fall, and messy seasons.',
    list: [
      'Leaf + debris removal',
      'Junk haul-off',
      'Gutter cleaning',
      'Full property reset'
    ],
  },
  build: {
    accent: ['#b08968', '#8b5a2b'],
    title: 'Hardscape & outdoor upgrades',
    text: 'We build and improve outdoor spaces that last.',
    list: [
      'Patios',
      'Retaining walls',
      'Paver work',
      'New bed installs'
    ],
  },
  winter: {
    accent: ['#7dd3fc', '#38bdf8'],
    title: 'Snow & winter protection',
    text: 'Reliable winter service so your property stays safe.',
    list: [
      'Snow removal',
      'Salt / ice control',
      'Final fall cleanup',
      'Property prep'
    ],
  },
};

const spotlightTitle = $('#spotlightTitle');
const spotlightText = $('#spotlightText');
const spotlightList = $('#spotlightList');
const spotlightChips = $$('.chip[data-season]');

const setSpotlight = (key) => {
  const next = spotlight[key];
  if (!next) return;

  // Scope accent variables to the hero section to avoid leaking styles site-wide
  if (heroSection) {
    heroSection.style.setProperty('--accent', next.accent[0]);
    heroSection.style.setProperty('--accent-2', next.accent[1] || next.accent[0]);
  } else {
    document.documentElement.style.setProperty('--accent', next.accent[0]);
    document.documentElement.style.setProperty('--accent-2', next.accent[1] || next.accent[0]);
  }

  spotlightChips.forEach((chip) => {
    const isActive = chip.dataset.season === key;
    chip.classList.toggle('is-active', isActive);
    chip.setAttribute('aria-selected', String(isActive));
  });

  if (spotlightTitle) spotlightTitle.textContent = next.title;
  if (spotlightText) spotlightText.textContent = next.text;

  if (spotlightList) {
    spotlightList.innerHTML = '';
    next.list.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      spotlightList.appendChild(li);
    });
  }
};

spotlightChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const key = chip.dataset.season || 'grow';
    const idx = spotlightOrder.indexOf(key);
    if (idx >= 0) heroIndex = idx;
    setSpotlight(key);
    resetHeroCycle();
  });
});

/* =========================
   HERO PROGRESS BAR
========================= */

const progressBar = document.getElementById('heroProgressBar');

function resetProgressBar() {
  if (!progressBar) return;

  progressBar.style.transition = 'none';
  progressBar.style.width = '0%';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      progressBar.style.transition = `width ${HERO_DURATION}ms linear`;
      progressBar.style.width = '100%';
    });
  });
}

/* =========================
   HERO CYCLE (SYNCED)
========================= */

function updateHero() {
  if (!heroSection) return;

  const key = spotlightOrder[heroIndex];

  // Crossfade backgrounds using the inactive layer
  const nextImage = backgroundImages[heroIndex % backgroundImages.length];
  const active = heroSection.dataset.activeBg || 'a';
  const inactive = active === 'a' ? 'b' : 'a';

  // put the next image on the inactive layer, then flip the active flag to trigger CSS opacity transition
  heroSection.style.setProperty(`--hero-bg-${inactive}`, nextImage);
  // flip which pseudo-element is visible (CSS handles opacity transition)
  heroSection.dataset.activeBg = inactive;

  setSpotlight(key);
  resetProgressBar();

  heroIndex = (heroIndex + 1) % spotlightOrder.length;
}

let heroTimer = null;

function resetHeroCycle() {
  clearInterval(heroTimer);
  updateHero();
  heroTimer = setInterval(updateHero, HERO_DURATION);
}

/* start */
if (heroSection) {
  resetHeroCycle();
}

/* =========================
   GALLERY RENDERING
========================= */

const galleryGrid = $('#galleryGrid');
const loadMoreBtn = $('#loadMore');
const lightbox = $('#lightbox');
const lightboxImg = $('#lightboxImg');
const lightboxTitle = $('#lightboxTitle');

let galleryIndex = 0;
const BATCH_SIZE = 12;
let currentItems = window.GALLERY_ITEMS || [];

function createTile(item, index) {
  const btn = document.createElement('button');
  btn.className = 'gallery-tile';
  btn.type = 'button';
  btn.dataset.index = index;
  // store the original src on the element for reliable matching later
  btn.dataset.src = item.src;

  const img = document.createElement('img');
  img.src = item.src;
  img.alt = item.alt || '';
  img.loading = 'lazy';

  btn.appendChild(img);

  btn.addEventListener('click', () => openLightbox(index));

  return btn;
}

function renderBatch() {
  if (!galleryGrid) return;

  const slice = currentItems.slice(galleryIndex, galleryIndex + BATCH_SIZE);

  slice.forEach((item, i) => {
    const realIndex = galleryIndex + i;
    galleryGrid.appendChild(createTile(item, realIndex));
  });

  galleryIndex += slice.length;

  if (galleryIndex >= currentItems.length && loadMoreBtn) {
    loadMoreBtn.style.display = 'none';
  }
}

function openLightbox(index) {
  const item = currentItems[index];
  if (!item || !lightbox) return;

  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  // Resolve and set an absolute URL for the lightbox image so comparisons are consistent
  const resolved = new URL(item.src, location.href).href;
  if (lightboxImg) lightboxImg.src = resolved;
  if (lightboxTitle) lightboxTitle.textContent = item.title || '';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
}

/* nav lightbox */
const lbPrev = $('#lbPrev');
const lbNext = $('#lbNext');

function stepLightbox(dir) {
  const currentSrc = lightboxImg?.src;
  // Find current index by comparing resolved hrefs to avoid percent-encoding mismatches
  const currentIndex = currentItems.findIndex(i => {
    try {
      return currentSrc && new URL(i.src, location.href).href === currentSrc;
    } catch (e) {
      return false;
    }
  });

  let next = (currentIndex === -1 ? 0 : currentIndex) + dir;
  if (next < 0) next = currentItems.length - 1;
  if (next >= currentItems.length) next = 0;

  openLightbox(next);
}

/* events */
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', renderBatch);
}

if (lbPrev) lbPrev.addEventListener('click', () => stepLightbox(-1));
if (lbNext) lbNext.addEventListener('click', () => stepLightbox(1));

$$('[data-lb-close="true"]').forEach(el => {
  el.addEventListener('click', closeLightbox);
});

/* ESC + arrows */
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();

  if (lightbox?.classList.contains('is-open')) {
    if (event.key === 'ArrowLeft') stepLightbox(-1);
    if (event.key === 'ArrowRight') stepLightbox(1);
  }
});

/* INIT */
if (galleryGrid) {
  renderBatch();
}

/* Support static gallery tiles present in `index.html`: build currentItems from DOM if GALLERY_ITEMS absent */
if (galleryGrid && (!currentItems || !currentItems.length)) {
  const staticTiles = Array.from(galleryGrid.querySelectorAll('.gallery-tile'));
  if (staticTiles.length) {
    currentItems = staticTiles.map((tile) => {
      const img = tile.querySelector('img');
      const src = img ? (img.currentSrc || img.src) : tile.dataset.src || '';
      const title = tile.dataset.title || img?.alt || '';
      return { src, title };
    });

    staticTiles.forEach((tile, i) => {
      tile.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(i);
      });
    });
  }
}

/* =========================
   QUOTE DIALOG (open/close handlers + EmailJS integration)
   - Centralize EmailJS submission via sendQuoteFormEmail(formData)
   - Remove any mailto fallback: submissions must go through EmailJS only
   - Provide openQuoteForm() to unify CTA handlers
========================= */
const quoteDialog = $('#quoteDialog');
const quoteForm = $('#quoteForm');
const openQuoteEls = $$('.js-open-quote') || [];
const closeQuoteEls = $$('[data-quote-close]') || [];

// helper to open the existing dialog/form in a single place
function openQuoteForm() {
  if (!quoteDialog) return;
  try {
    if (typeof quoteDialog.showModal === 'function') quoteDialog.showModal();
    else quoteDialog.classList.add('is-open');
  } catch (err) {
    quoteDialog.classList.add('is-open');
  }
}

// attach open handlers to known CTA selectors (centralized)
const CTA_SELECTORS = ['.js-open-quote', '[data-open-quote]', '.request-quote', 'a.request-quote'];
CTA_SELECTORS.forEach((sel) => {
  document.querySelectorAll(sel).forEach((el) => {
    // avoid duplicate listeners
    if (el.dataset.quoteHandled) return;
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openQuoteForm();
    });
    el.dataset.quoteHandled = '1';
  });
});

// close buttons
closeQuoteEls.forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    try { if (typeof quoteDialog.close === 'function') quoteDialog.close(); else quoteDialog.classList.remove('is-open'); } catch (err) { quoteDialog.classList.remove('is-open'); }
  });
});

// Centralized EmailJS sender function required by the migration
async function sendQuoteFormEmail(formData) {
  // Accept either a FormData instance or a plain object
  const get = (k) => (formData instanceof FormData ? (formData.get(k) || '') : (formData[k] || '') || '');

  const name = get('name');
  const email = get('email');
  const phone = get('phone');
  const service = get('service');
  const address = get('address');
  const city = get('city');
  const state = get('state');
  const zip = get('zip');
  const message = get('message');
  const time = new Date().toLocaleString();

  const templateParamsBase = { name, email, phone, service, address, city, state, zip, message, time };

  const SERVICE_ID = 'service_je5l433';
  const TEMPLATE_ADMIN = 'template_fxd7yaz';
  const TEMPLATE_AUTO = 'template_9cihges';

  // helper to send via SDK or REST API
  const emailjsSend = async (serviceId, templateId, params) => {
    // Deterministic: assume emailjs is loaded and initialized before script.js runs
    console.log('Attempting EmailJS SDK send', { serviceId, templateId, params });
    return emailjs.send(serviceId, templateId, params);
  };

  // prepare params
  const adminParams = Object.assign({}, templateParamsBase, { to_email: 'mglandscaping@gmail.com' });
  const autoParams = Object.assign({}, templateParamsBase, { to_email: email });

  // DEBUG: log payload and EmailJS presence
  try {
    console.log('Form Data:', { name, email, phone, service, address, city, state, zip, message, time });

    // send both emails via SDK only
    const results = await Promise.all([
      emailjsSend(SERVICE_ID, TEMPLATE_ADMIN, templateParamsBase),
      emailjsSend(SERVICE_ID, TEMPLATE_AUTO, templateParamsBase),
    ]);

    console.log('EmailJS responses:', results);
    return results;
  } catch (err) {
    // Bubble up with detailed info
    console.error('EmailJS FULL ERROR:', err);
    throw err;
  }
}

// submit handler: delegates to sendQuoteFormEmail and enforces locking and UI behavior
if (quoteForm) {
  // ensure we only bind once
  if (!quoteForm.dataset.submitHandled) {
    quoteForm.addEventListener('submit', async (e) => {
      console.log('Form submit triggered');
      e.preventDefault();
      const form = e.target;

      if (form.dataset.sending === '1') return;
      form.dataset.sending = '1';

      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const data = new FormData(form);

      const maybeToast = (msg) => { try { if (typeof toast === 'function') toast(msg); } catch (err) { /* silent */ } };

      try {
        const resp = await sendQuoteFormEmail(data);
        console.log('Email sent successfully', resp);
        console.log('EmailJS success');
        maybeToast('Quote request sent — thank you');
        try { if (quoteDialog) { if (typeof quoteDialog.close === 'function') quoteDialog.close(); else quoteDialog.classList.remove('is-open'); } } catch (err) { /* ignore */ }
      } catch (err) {
        console.error('EmailJS FULL ERROR:', err);
        // if the error has a response or text, log it
        try { if (err && err.text) console.error('Error response text:', err.text); } catch (e) { /* ignore */ }
        maybeToast('Failed to send quote. Please try again.');
        try { alert('Failed to send. Check console for details.'); } catch (e) { /* ignore */ }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        delete form.dataset.sending;
      }
    });
    quoteForm.dataset.submitHandled = '1';
  }
}

/* Universal lightbox removed — using single, consolidated lightbox controller above */

// Back-to-top smooth scroll (minimal, isolated handler)
(() => {
  const backLinks = document.querySelectorAll('a.footer-link[href="#top"]');
  backLinks.forEach((link) => {
    // avoid duplicate listeners
    if (link.dataset.backHandled) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    link.dataset.backHandled = '1';
  });
})();