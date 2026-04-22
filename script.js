const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Hero background image rotation
const heroSection = $('.hero');
if (heroSection) {
  const backgroundImages = [
    "url('MGL%20Photos/PHOTO-2026-04-21-15-30-34.jpg')",
    "url('MGL%20Photos/PHOTO-2026-04-21-15-30-33%208.jpg')",
    "url('MGL%20Photos/PHOTO-2026-04-21-15-30-35%205.jpg')",
    "url('MGL%20Photos/PHOTO-2026-04-21-15-30-36.jpg')",
    "url('MGL%20Photos/PHOTO-2026-04-21-15-30-38.jpg')"
  ];
  
  let currentImageIndex = 0;
  
  const rotateHeroBackground = () => {
    currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
    heroSection.style.setProperty('--hero-photo', backgroundImages[currentImageIndex]);
  };
  
  // Rotate every 8 seconds
  setInterval(rotateHeroBackground, 8000);
}

const toastEl = $('#toast');
let toastTimer = null;
const toast = (message) => {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('is-showing');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl.classList.remove('is-showing'), 2400);
};

// Header nav (mobile)
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
    if (!(target instanceof HTMLElement)) return;
    if (target.matches('a')) setOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) setOpen(false);
  });
}

// Footer year
const yearEl = $('#year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Reveal-on-scroll
const revealEls = $$('.reveal-on-scroll');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-in'));
}

// Spotlight (hero) — reimagined "state switch"
const spotlight = {
  grow: {
    accent: ['#4ade80', '#16a34a'],
    title: 'Weekly lawn & bed care',
    text: 'Clean lines and dependable scheduling.',
    list: ['Weekly / bi-weekly options', 'Quick text updates'],
  },
  cleanup: {
    accent: ['#fbbf24', '#d97706'],
    title: 'Seasonal cleanups',
    text: 'Spring and fall resets for a fresh look.',
    list: ['Leaf + debris removal', 'Haul-away options'],
  },
  build: {
    accent: ['#b08968', '#8b5a2b'],
    title: 'Hardscape touches',
    text: 'Small upgrades that boost curb appeal.',
    list: ['Borders & edging', 'Small paver fixes'],
  },
  winter: {
    accent: ['#7dd3fc', '#38bdf8'],
    title: 'Winter property prep',
    text: 'Get ready for cold weather and cleanup.',
    list: ['Final mow + trim', 'Bed cleanup'],
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
  chip.addEventListener('click', () => setSpotlight(chip.dataset.season || 'grow'));
});

// Default state
setSpotlight('grow');

// Quote dialog — creates a mailto (placeholder contact)
const quoteDialog = $('#quoteDialog');
const quoteForm = $('#quoteForm');
const openQuoteButtons = $$('.js-open-quote');
const closeQuoteButtons = $$('[data-quote-close]');

const supportsDialog = () => quoteDialog && typeof quoteDialog.showModal === 'function';

const openQuote = () => {
  if (!quoteDialog) return;
  if (supportsDialog()) {
    quoteDialog.showModal();
  } else {
    quoteDialog.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
  }
};

const closeQuote = () => {
  if (!quoteDialog) return;
  if (supportsDialog()) {
    quoteDialog.close();
  } else {
    quoteDialog.removeAttribute('open');
    document.body.style.overflow = '';
  }
};

openQuoteButtons.forEach((btn) => btn.addEventListener('click', openQuote));
closeQuoteButtons.forEach((btn) => btn.addEventListener('click', closeQuote));

if (quoteDialog) {
  quoteDialog.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    // Click outside panel closes
    if (target === quoteDialog) closeQuote();
  });
}

const buildMailto = ({ name, email, phone, service, message }) => {
  const to = 'goyan_cc@hotmail.com';
  const subject = `Quote request — M&G Landscaping (${service || 'General'})`;
  const lines = [
    'Hi M&G Landscaping,',
    '',
    'I would like a quote for:',
    `Service: ${service || '-'}`,
    '',
    'Contact info:',
    `Name: ${name || '-'}`,
    `Email: ${email || '-'}`,
    `Phone: ${phone || '-'}`,
    '',
    'Message:',
    message || '-',
    '',
    '— Sent from mglandscaping website',
  ];
  const body = lines.join('\n');
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const handleMailtoSubmit = (form) => {
  if (!form) return;
  if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;

  const data = Object.fromEntries(new FormData(form).entries());
  const mailto = buildMailto({
    name: String(data.name || ''),
    email: String(data.email || ''),
    phone: String(data.phone || ''),
    service: String(data.service || ''),
    message: String(data.message || ''),
  });

  toast('Opening your email app…');
  window.location.href = mailto;
};

if (quoteForm) {
  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    handleMailtoSubmit(quoteForm);
    closeQuote();
  });
}

// Contact form — also mailto
const contactForm = $('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    handleMailtoSubmit(contactForm);
  });
}

// Copy buttons
const copyButtons = $$('.js-copy');
const copyText = async (text) => {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
};

copyButtons.forEach((btn) => {
  btn.addEventListener('click', async () => {
    const text = btn.getAttribute('data-copy') || '';
    if (!text) return;
    const ok = await copyText(text);
    toast(ok ? 'Copied to clipboard' : 'Copy failed');
  });
});

// Gallery filtering + lightbox (reimagined)
const initGallery = () => {
  const grid = $('#galleryGrid');
  if (!grid) return;

  const loadMoreBtn = $('#loadMore');

  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  const lightboxTitle = $('#lightboxTitle');
  const lbPrev = $('#lbPrev');
  const lbNext = $('#lbNext');

  let activeFilter = 'all';
  let visibleTiles = [];
  let lightboxIndex = 0;
  let lastFocusedEl = null;

  const getTiles = () => $$('.gallery-tile', grid);

  const computeVisible = () => {
    visibleTiles = getTiles().filter((tile) => !tile.hasAttribute('hidden'));
  };

  const updateLoadMoreVisibility = (rendered, total) => {
    if (!loadMoreBtn) return;
    const hasMore = rendered < total;
    loadMoreBtn.toggleAttribute('hidden', !hasMore);
  };

  const openLightbox = (tile) => {
    if (!lightbox || !lightboxImg || !tile) return;
    lastFocusedEl = document.activeElement;
    const img = $('img', tile);
    const title = tile.getAttribute('data-title') || 'Project photo';
    if (img) {
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || title;
    }
    if (lightboxTitle) lightboxTitle.textContent = title;

    computeVisible();
    lightboxIndex = Math.max(0, visibleTiles.indexOf(tile));

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const closeBtn = $('.lightbox-close', lightbox);
    if (closeBtn) closeBtn.focus();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedEl instanceof HTMLElement) lastFocusedEl.focus();
  };

  const stepLightbox = (direction) => {
    if (!visibleTiles.length) return;
    lightboxIndex = (lightboxIndex + direction + visibleTiles.length) % visibleTiles.length;
    const tile = visibleTiles[lightboxIndex];
    if (!tile) return;
    const img = $('img', tile);
    const title = tile.getAttribute('data-title') || 'Project photo';
    if (img && lightboxImg) {
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || title;
    }
    if (lightboxTitle) lightboxTitle.textContent = title;
  };

  const wireTileClicks = (tiles) => {
    tiles.forEach((tile) => tile.addEventListener('click', () => openLightbox(tile)));
  };

  // Optional JS-driven gallery (full gallery page)
  const shouldRenderFromJs = grid.getAttribute('data-gallery-source') === 'js' && Array.isArray(window.GALLERY_ITEMS);
  let renderedCount = 0;
  const batchSize = 18;
  let galleryItems = null;

  const renderBatch = (count) => {
    if (!shouldRenderFromJs) return;
    if (!galleryItems) {
      // Keep the original order (client-provided).
      galleryItems = window.GALLERY_ITEMS.slice();
    }
    const next = galleryItems.slice(renderedCount, renderedCount + count);
    const newTiles = [];

    next.forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gallery-tile';
      btn.setAttribute('data-tags', Array.isArray(item.tags) ? item.tags.join(' ') : String(item.tags || ''));
      btn.setAttribute('data-title', String(item.title || 'Project photo'));

      const img = document.createElement('img');
      img.loading = 'lazy';
      img.src = encodeURI(String(item.src || ''));
      img.alt = String(item.alt || item.title || 'Project photo');

      btn.appendChild(img);
      grid.appendChild(btn);
      newTiles.push(btn);
    });

    renderedCount += next.length;
    wireTileClicks(newTiles);
    computeVisible();
    updateLoadMoreVisibility(renderedCount, galleryItems.length);
  };

  // Render or wire existing
  if (shouldRenderFromJs) {
    renderBatch(batchSize);
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', () => renderBatch(batchSize));
  } else {
    wireTileClicks(getTiles());
    computeVisible();
    if (loadMoreBtn) loadMoreBtn.setAttribute('hidden', '');
  }

  computeVisible();

  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.getAttribute('data-lb-close') === 'true') closeLightbox();
    });
  }
  if (lbPrev) lbPrev.addEventListener('click', () => stepLightbox(-1));
  if (lbNext) lbNext.addEventListener('click', () => stepLightbox(1));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLightbox();
      closeQuote();
    }
    if (lightbox && lightbox.classList.contains('is-open')) {
      if (event.key === 'ArrowLeft') stepLightbox(-1);
      if (event.key === 'ArrowRight') stepLightbox(1);
    }
  });
};

const progressBar = document.getElementById('heroProgressBar');

const HERO_DURATION = 8000;

function animateProgressBar() {
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

if (progressBar) {
  animateProgressBar();
  setInterval(animateProgressBar, HERO_DURATION);
}

// Initialize gallery if present
initGallery();