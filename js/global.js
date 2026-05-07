/* ══════════════════════════════════════════
   Baker's Fresh — global.js
   ══════════════════════════════════════════ */

/* ── THEME ── */
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('theme-btn').textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('bf-theme', isDark ? 'light' : 'dark');
}

/* ── RTL ── */
function toggleRTL() {
  const html = document.documentElement;
  const isRTL = html.getAttribute('dir') === 'rtl';
  html.setAttribute('dir', isRTL ? 'ltr' : 'rtl');
  document.getElementById('rtl-btn').textContent = isRTL ? 'RTL' : 'LTR';
  localStorage.setItem('bf-dir', isRTL ? 'ltr' : 'rtl');
}

/* ── MOBILE NAV ── */
function toggleMob() {
  const nav = document.getElementById('mob-nav');
  const ham = document.getElementById('ham');
  nav.classList.toggle('open');
  ham.classList.toggle('open');
}
function closeMob() {
  document.getElementById('mob-nav').classList.remove('open');
  document.getElementById('ham').classList.remove('open');
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
  window.addEventListener('scroll', () => {
    nav.classList.toggle('stuck', window.scrollY > 40);
  }, { passive: true });
}

/* ── PROMO CODE COPY ── */
function doCopy(btn, code) {
  navigator.clipboard.writeText(code).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = orig, 1800);
  });
}

/* ══════════════════════════════════════════
   HAMBURGER + NAV LAYOUT
   ══════════════════════════════════════════ */
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
      if (navLinks)  navLinks.style.removeProperty('display');
      if (loginBtn)  loginBtn.style.removeProperty('display');
      if (themeBtn)  themeBtn.style.removeProperty('display');
      if (rtlBtn)    rtlBtn.style.removeProperty('display');
      if (mobNav)    mobNav.classList.remove('open');
      ham.classList.remove('open');
    } else {
      ham.style.display = 'flex';
      if (navLinks)  navLinks.style.display = 'none';
      if (loginBtn)  loginBtn.style.display = 'none';
      if (themeBtn)  themeBtn.style.display = 'flex';
      if (rtlBtn)    rtlBtn.style.display   = 'flex';
    }
  }
  applyLayout();
  window.addEventListener('resize', applyLayout, { passive: true });
}

/* ══════════════════════════════════════════
   AUTO ACTIVE NAV LINK
   Works on: local file://, GitHub Pages,
   Netlify, shared hosting, subfolders — any
   environment.
   ══════════════════════════════════════════ */
function setActiveNav() {

  /* ── Step 1: Get current page filename ──────────────────
     Handles all these cases:
       http://site.com/index.html        → "index.html"
       http://site.com/                  → "index.html"
       http://site.com/about.html        → "about.html"
       http://site.com/folder/about.html → "about.html"
       file:///C:/project/about.html     → "about.html"
  ─────────────────────────────────────────────────────── */
  const fullPath = window.location.href;           // full URL
  const filename = fullPath
    .split('?')[0]                                 // strip query string
    .split('#')[0]                                 // strip hash
    .split('/')                                    // split by slash
    .filter(Boolean)                               // remove empty parts
    .pop()                                         // last segment = filename
    || 'index.html';                               // fallback for root "/"

  // Normalise: "index.html" covers both "/" and "index.html"
  const current = (filename === '' || filename === 'index.html')
    ? 'index.html'
    : filename;

  /* ── Step 2: Define page groups ── */
  const isHomeOne   = current === 'index.html';
  const isHomeTwo   = current === 'home2.html';
  const isHome      = isHomeOne || isHomeTwo;
  const isAbout     = current === 'about.html';
  const isServices  = ['services.html', 'service-detail.html',
                        'service-detail1.html', 'service-detail2.html'].includes(current);
  const isMenu      = current === 'menu.html';
  const isBlog      = current === 'blog.html' || current === 'blog-detail.html';
  const isContact   = current === 'contact.html';
  const isDashboard = current === 'dashboard.html';

  /* ── Step 3: Helper — does this link match current page? ── */
  function linkMatches(href) {
    if (!href) return false;
    // Get just the filename from the href
    const linkFile = href
      .split('?')[0]
      .split('#')[0]
      .split('/')
      .filter(Boolean)
      .pop() || 'index.html';
    return linkFile === current;
  }

  /* ── Step 4: Desktop nav — clear all, then set correct ── */
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('act'));

  // Top-level parent links (li > a, NOT dropdown items)
  document.querySelectorAll('.nav-links > li > a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const file = href.split('/').pop() || 'index.html';

    if (isHome      && file === 'index.html')     a.classList.add('act');
    if (isAbout     && file === 'about.html')     a.classList.add('act');
    if (isServices  && file === 'services.html')  a.classList.add('act');
    if (isMenu      && file === 'menu.html')      a.classList.add('act');
    if (isBlog      && file === 'blog.html')      a.classList.add('act');
    if (isContact   && file === 'contact.html')   a.classList.add('act');
    if (isDashboard && file === 'dashboard.html') a.classList.add('act');
  });

  // Dropdown items — Home I / Home II
  document.querySelectorAll('.nav-dropdown .dd-item').forEach(a => {
    const file = (a.getAttribute('href') || '').split('/').pop() || 'index.html';
    if (isHomeOne && file === 'index.html')  a.classList.add('act');
    if (isHomeTwo && file === 'home2.html')  a.classList.add('act');
  });

  /* ── Step 5: Mobile nav — clear all, then set correct ── */
  document.querySelectorAll('.mob-nav a').forEach(a => a.classList.remove('act'));

  document.querySelectorAll('.mob-nav a:not(.btn)').forEach(a => {
    const file = (a.getAttribute('href') || '').split('/').pop() || 'index.html';

    if (isHomeOne   && file === 'index.html')     a.classList.add('act');
    if (isHomeTwo   && file === 'home2.html')     a.classList.add('act');
    if (isAbout     && file === 'about.html')     a.classList.add('act');
    if (isServices  && file === 'services.html')  a.classList.add('act');
    if (isMenu      && file === 'menu.html')      a.classList.add('act');
    if (isBlog      && file === 'blog.html')      a.classList.add('act');
    if (isContact   && file === 'contact.html')   a.classList.add('act');
    if (isDashboard && file === 'dashboard.html') a.classList.add('act');
  });

  /* ── Step 6: Debug log (remove after confirming it works) ── */
  console.log('[BF Nav] current page:', current);
  console.log('[BF Nav] active group:',
    isHomeOne ? 'Home I' : isHomeTwo ? 'Home II' :
    isAbout ? 'About' : isServices ? 'Services' :
    isMenu ? 'Menu' : isBlog ? 'Blog' :
    isContact ? 'Contact' : isDashboard ? 'Dashboard' : 'UNKNOWN'
  );
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {

  // Restore saved theme
  const savedTheme = localStorage.getItem('bf-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    const btn = document.getElementById('theme-btn');
    if (btn) btn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }

  // Restore saved direction
  const savedDir = localStorage.getItem('bf-dir');
  if (savedDir) {
    document.documentElement.setAttribute('dir', savedDir);
    const btn = document.getElementById('rtl-btn');
    if (btn) btn.textContent = savedDir === 'rtl' ? 'LTR' : 'RTL';
  }

  initNav();
  initReveal();
  initHamburger();
  setActiveNav();
});