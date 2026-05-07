/* ══════════════════════════════════════════
   Baker's Fresh — global.js
   ══════════════════════════════════════════ */

/* ── THEME (run before DOMContentLoaded so no flash) ── */
(function () {
  const theme = localStorage.getItem('bf-theme');
  const dir   = localStorage.getItem('bf-dir');
  if (theme) document.documentElement.setAttribute('data-theme', theme);
  if (dir)   document.documentElement.setAttribute('dir', dir);
})();

/* ── THEME TOGGLE ── */
function toggleTheme() {
  const html   = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next   = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('bf-theme', next);
  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = isDark ? '🌙' : '☀️';
}

/* ── RTL TOGGLE ── */
function toggleRTL() {
  const html  = document.documentElement;
  const isRTL = html.getAttribute('dir') === 'rtl';
  const next  = isRTL ? 'ltr' : 'rtl';
  html.setAttribute('dir', next);
  localStorage.setItem('bf-dir', next);
  const btn = document.getElementById('rtl-btn');
  if (btn) btn.textContent = isRTL ? 'RTL' : 'LTR';
}

/* ── MOBILE NAV ── */
function toggleMob() {
  const nav = document.getElementById('mob-nav');
  const ham = document.getElementById('ham');
  if (nav) nav.classList.toggle('open');
  if (ham) ham.classList.toggle('open');
}
function closeMob() {
  const nav = document.getElementById('mob-nav');
  const ham = document.getElementById('ham');
  if (nav) nav.classList.remove('open');
  if (ham) ham.classList.remove('open');
}
function toggleMobDrop(btn) {
  btn.classList.toggle('open');
  const drop = btn.nextElementSibling;
  if (drop) drop.style.display = drop.style.display === 'flex' ? 'none' : 'flex';
}

/* ── SCROLL REVEAL ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

/* ── STICKY NAV ── */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('stuck', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── PROMO CODE COPY ── */
function doCopy(btn, code) {
  navigator.clipboard.writeText(code).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = orig, 1800);
  });
}

/* ── HAMBURGER LAYOUT ── */
function initHamburger() {
  const ham      = document.getElementById('ham');
  const navLinks = document.querySelector('.nav-links');
  const loginBtn = document.querySelector('.nav-r .btn-primary');
  const themeBtn = document.getElementById('theme-btn');
  const rtlBtn   = document.getElementById('rtl-btn');
  const mobNav   = document.getElementById('mob-nav');
  if (!ham) return;

  function applyLayout() {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      ham.style.display = 'none';
      if (navLinks) navLinks.style.removeProperty('display');
      if (loginBtn) loginBtn.style.removeProperty('display');
      if (themeBtn) themeBtn.style.removeProperty('display');
      if (rtlBtn)   rtlBtn.style.removeProperty('display');
      if (mobNav)   mobNav.classList.remove('open');
      ham.classList.remove('open');
    } else {
      ham.style.display = 'flex';
      if (navLinks) navLinks.style.display = 'none';
      if (loginBtn) loginBtn.style.display = 'none';
      if (themeBtn) themeBtn.style.display = 'flex';
      if (rtlBtn)   rtlBtn.style.display   = 'flex';
    }
  }
  applyLayout();
  window.addEventListener('resize', applyLayout, { passive: true });
}

/* ══════════════════════════════════════════
   ACTIVE NAV — DUAL-LAYER APPROACH
   Layer 1: sets data-page on <html> → CSS rules in global.css fire instantly
   Layer 2: sets .act class via JS → covers dropdown items, mob-nav, edge cases
   Both layers reinforce each other. Either alone is a full fallback.
   Works on: local file://, GitHub Pages, Netlify, cPanel, subfolders, all hosts.
   ══════════════════════════════════════════ */

/* filename → data-page key */
const PAGE_MAP = {
  '':                    'home1',
  'index.html':          'home1',
  'home2.html':          'home2',
  'about.html':          'about',
  'services.html':       'services',
  'service-detail.html': 'services',
  'service-detail1.html':'services',
  'service-detail2.html':'services',
  'menu.html':           'menu',
  'blog.html':           'blog',
  'blog-detail.html':    'blog',
  'contact.html':        'contact',
  'dashboard.html':      'dashboard',
};

/* nav link href → which pageKey values it should highlight for */
const LINK_GROUPS = {
  'index.html':     ['home1', 'home2'],  // "Home" parent link covers both home pages
  'home2.html':     ['home2'],
  'about.html':     ['about'],
  'services.html':  ['services'],
  'menu.html':      ['menu'],
  'blog.html':      ['blog'],
  'contact.html':   ['contact'],
  'dashboard.html': ['dashboard'],
};

/* dropdown item href → exact pageKey only */
const DD_EXACT = {
  'index.html': 'home1',
  'home2.html': 'home2',
};

function getCurrentFilename() {
  /*
    Extracts just the HTML filename from any URL:
      https://user.github.io/Baker-s-Fresh/about.html  →  "about.html"
      https://user.github.io/Baker-s-Fresh/            →  ""
      https://domain.com/about.html                    →  "about.html"
      file:///C:/project/index.html                    →  "index.html"
  */
  const cleaned = window.location.href
    .split('?')[0]   // drop query string
    .split('#')[0];  // drop hash

  const segments = cleaned.split('/').filter(Boolean);
  const last = segments.pop() || '';

  // If last segment has no dot, it's a folder/slug, not a filename → treat as root
  return last.includes('.') ? last : '';
}

function setActiveNav() {
  const filename = getCurrentFilename();               // e.g. "about.html" or ""
  const pageKey  = PAGE_MAP[filename] ?? 'home1';     // e.g. "about"

  /* ── Layer 1: data-page attribute — CSS handles styling instantly ── */
  document.documentElement.setAttribute('data-page', pageKey);

  /* ── Layer 2: .act class on desktop nav ── */
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('act'));

  // Top-level parent links (li > a directly, not inside .nav-dropdown)
  document.querySelectorAll('.nav-links > li > a').forEach(a => {
    if (a.closest('.nav-dropdown')) return; // skip dropdown items here
    const href  = (a.getAttribute('href') || '').split('/').pop() || 'index.html';
    const group = LINK_GROUPS[href];
    if (group && group.includes(pageKey)) a.classList.add('act');
  });

  // Dropdown items — exact page match
  document.querySelectorAll('.nav-dropdown .dd-item').forEach(a => {
    const href   = (a.getAttribute('href') || '').split('/').pop() || 'index.html';
    const target = DD_EXACT[href];
    if (target === pageKey) a.classList.add('act');
  });

  /* ── Layer 2: .act class on mobile nav ── */
  document.querySelectorAll('.mob-nav a:not(.btn)').forEach(a => {
    a.classList.remove('act');
    const href  = (a.getAttribute('href') || '').split('/').pop() || 'index.html';
    const group = LINK_GROUPS[href];
    if (group && group.includes(pageKey)) a.classList.add('act');
  });
}

/* ── DROPDOWNS (desktop) ── */
function initDropdowns() {
  document.querySelectorAll('.nav-links li.has-drop').forEach(li => {
    const trigger = li.querySelector(':scope > a');
    if (!trigger) return;

    trigger.addEventListener('click', e => {
      const href = (trigger.getAttribute('href') || '').trim();
      // Only intercept pure toggles (no real destination)
      if (!href || href === '#') {
        e.preventDefault();
        const isOpen = li.classList.contains('open');
        // Close all
        document.querySelectorAll('.nav-links li.has-drop').forEach(l => l.classList.remove('open'));
        if (!isOpen) li.classList.add('open');
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-links li.has-drop')) {
      document.querySelectorAll('.nav-links li.has-drop.open').forEach(l => l.classList.remove('open'));
    }
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {

  // Sync theme button icon
  const curTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const themeBtn = document.getElementById('theme-btn');
  if (themeBtn) themeBtn.textContent = curTheme === 'dark' ? '☀️' : '🌙';

  // Sync RTL button label
  const curDir = document.documentElement.getAttribute('dir') || 'ltr';
  const rtlBtn = document.getElementById('rtl-btn');
  if (rtlBtn) rtlBtn.textContent = curDir === 'rtl' ? 'LTR' : 'RTL';

  initNav();
  initReveal();
  initHamburger();
  initDropdowns();
  setActiveNav();   // must run last so DOM is fully ready
});