/* ══════════════════════════════════════════
   Baker's Fresh — global.js  (v5 — final fix)
   ══════════════════════════════════════════ */

/* ── THEME + DIR: apply before first paint to avoid flash ── */
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
  document.getElementById('mob-nav')?.classList.toggle('open');
  document.getElementById('ham')?.classList.toggle('open');
}
function closeMob() {
  document.getElementById('mob-nav')?.classList.remove('open');
  document.getElementById('ham')?.classList.remove('open');
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
  const io = new IntersectionObserver(entries => {
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
  const fn = () => nav.classList.toggle('stuck', window.scrollY > 40);
  window.addEventListener('scroll', fn, { passive: true });
  fn();
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
    const desk = window.innerWidth >= 1024;
    ham.style.display = desk ? 'none' : 'flex';
    if (navLinks) desk ? navLinks.style.removeProperty('display') : navLinks.style.display = 'none';
    if (loginBtn) desk ? loginBtn.style.removeProperty('display') : loginBtn.style.display = 'none';
    if (themeBtn) desk ? themeBtn.style.removeProperty('display') : themeBtn.style.display = 'flex';
    if (rtlBtn)   desk ? rtlBtn.style.removeProperty('display')   : rtlBtn.style.display   = 'flex';
    if (!desk) { mobNav?.classList.remove('open'); ham.classList.remove('open'); }
  }
  applyLayout();
  window.addEventListener('resize', applyLayout, { passive: true });
}

/* ── DROPDOWN (desktop) ── */
function initDropdowns() {
  document.querySelectorAll('.nav-links li.has-drop').forEach(li => {
    const trigger = li.querySelector(':scope > a');
    if (!trigger) return;
    trigger.addEventListener('click', e => {
      if (!trigger.getAttribute('href') || trigger.getAttribute('href') === '#') {
        e.preventDefault();
        const open = li.classList.contains('open');
        document.querySelectorAll('.nav-links li.has-drop').forEach(l => l.classList.remove('open'));
        if (!open) li.classList.add('open');
      }
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-links li.has-drop'))
      document.querySelectorAll('.nav-links li.has-drop.open').forEach(l => l.classList.remove('open'));
  });
}

/* ══════════════════════════════════════════
   ACTIVE NAV  —  v5
   
   ROOT CAUSE (confirmed from about.html):
     Your HTML files have data-page on <body>:  <body data-page="about">
     Your CSS rules target <html>:              [data-page="about"] .nav-links a { }
     Previous JS was setting on <html> but
     reading from URL — which failed on
     published hosts.

   THE FIX:
     1. Read data-page directly from <body>
        (already set correctly in every HTML file — no HTML edits needed)
     2. Copy it up to <html> so the CSS rules
        [data-page="..."] fire correctly
     3. Use it to add .act class to the right
        nav links for JS-driven styles too
   ══════════════════════════════════════════ */
function setActiveNav() {

  /* ── Step 1: Read data-page from <body> (the source of truth) ── */
  const pageKey = document.body.getAttribute('data-page') || '';

  if (!pageKey) {
    console.warn('[BF Nav] No data-page found on <body>. Add data-page="pagename" to your <body> tag.');
    return;
  }

  /* ── Step 2: Mirror it onto <html> so CSS [data-page="..."] rules fire ── */
  document.documentElement.setAttribute('data-page', pageKey);

  /* ── Step 3: Which nav href should be highlighted for this page? ── */
  const PAGE_TO_HREF = {
    'home1':     'index.html',
    'home2':     'index.html',   // "Home" parent link covers both home pages
    'about':     'about.html',
    'services':  'services.html',
    'menu':      'menu.html',
    'blog':      'blog.html',
    'contact':   'contact.html',
    'dashboard': 'dashboard.html',
  };

  const activeHref = PAGE_TO_HREF[pageKey];
  if (!activeHref) return;

  /* ── Step 4: Desktop nav — top-level links ── */
  document.querySelectorAll('.nav-links > li > a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    a.classList.toggle('act', href === activeHref);
  });

  /* ── Step 5: Desktop nav — dropdown items (Home I / Home II exact match) ── */
  const DD_EXACT = { 'home1': 'index.html', 'home2': 'home2.html' };
  const ddHref = DD_EXACT[pageKey];
  document.querySelectorAll('.nav-dropdown .dd-item').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    a.classList.toggle('act', !!ddHref && href === ddHref);
  });

  /* ── Step 6: Mobile nav links ── */
  document.querySelectorAll('.mob-nav a:not(.btn)').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    a.classList.toggle('act', href === activeHref);
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {

  // Sync theme button icon with current theme
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
  setActiveNav();
});