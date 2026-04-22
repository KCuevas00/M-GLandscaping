const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* =========================
   HERO SYNC CONTROLLER
========================= */

const heroSection = $('.hero');

const HERO_DURATION = 8000;

const backgroundImages = [
  "url('MGL%20Photos/PHOTO-2026-04-21-15-30-34.jpg')",
  "url('MGL%20Photos/PHOTO-2026-04-21-15-30-33%208.jpg')",
  "url('MGL%20Photos/PHOTO-2026-04-21-15-30-35%205.jpg')",
  "url('MGL%20Photos/PHOTO-2026-04-21-15-30-36.jpg')",
  "url('MGL%20Photos/PHOTO-2026-04-21-15-30-38.jpg')"
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

  document.documentElement.style.setProperty('--accent', next.accent[0]);
  document.documentElement.style.setProperty('--accent-2', next.accent[1] || next.accent[0]);

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

  heroSection.style.setProperty(
    '--hero-photo',
    backgroundImages[heroIndex % backgroundImages.length]
  );

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
   LIGHTBOX / QUOTE / GALLERY
   (UNCHANGED BELOW — your code)
========================= */

// keep everything else EXACTLY as you had it
// (quote, gallery, copy, etc. unchanged)