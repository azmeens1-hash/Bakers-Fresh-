/* ══════════════════════════════════════════
   Baker's Fresh — global.js  (v6 — dropdown fix)
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
    const desk = window.innerWidth >= 769;
    ham.style.display      = desk ? 'none' : 'flex';
    if (navLinks) { desk ? navLinks.style.removeProperty('display') : (navLinks.style.display = 'none'); }
    if (loginBtn) { desk ? loginBtn.style.removeProperty('display') : (loginBtn.style.display = 'none'); }
    if (themeBtn) { desk ? themeBtn.style.removeProperty('display') : (themeBtn.style.display = 'flex'); }
    if (rtlBtn)   { desk ? rtlBtn.style.removeProperty('display')   : (rtlBtn.style.display   = 'flex'); }
    if (!desk) { mobNav?.classList.remove('open'); ham.classList.remove('open'); }
  }
  applyLayout();
  window.addEventListener('resize', applyLayout, { passive: true });
}

/* ══════════════════════════════════════════
   DESKTOP DROPDOWN
   ──────────────────────────────────────────
   Uses mouseenter/mouseleave with a short
   close-delay so the mouse can travel from
   the nav link to the dropdown panel without
   the menu snapping shut mid-journey.
   This is the most reliable pattern across
   all desktop widths including exactly 1024px.
   ══════════════════════════════════════════ */
function initDropdowns() {
  document.querySelectorAll('.nav-links li.has-drop').forEach(function (li) {
    var closeTimer = null;

    function openMenu() {
      clearTimeout(closeTimer);
      /* Close any other open dropdowns first */
      document.querySelectorAll('.nav-links li.has-drop.open').forEach(function (other) {
        if (other !== li) other.classList.remove('open');
      });
      li.classList.add('open');
    }

    function scheduleClose() {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(function () {
        li.classList.remove('open');
      }, 120); /* 120 ms grace window — enough for mouse travel */
    }

    /* Hover on the li (includes the parent link) */
    li.addEventListener('mouseenter', openMenu);
    li.addEventListener('mouseleave', scheduleClose);

    /* Hover directly on the dropdown panel keeps it open */
    var panel = li.querySelector('.nav-dropdown');
    if (panel) {
      panel.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
      panel.addEventListener('mouseleave', scheduleClose);
    }

    /* Click on the parent <a> — only intercept if it has no real href */
    var trigger = li.querySelector(':scope > a');
    if (trigger) {
      trigger.addEventListener('click', function (e) {
        var href = trigger.getAttribute('href');
        if (!href || href === '#') {
          e.preventDefault();
          li.classList.contains('open') ? li.classList.remove('open') : openMenu();
        }
        /* If the link has a real href (e.g. index.html) let it navigate normally */
      });
    }
  });

  /* Click outside closes all dropdowns */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-links li.has-drop')) {
      document.querySelectorAll('.nav-links li.has-drop.open').forEach(function (l) {
        l.classList.remove('open');
      });
    }
  });
}

/* ══════════════════════════════════════════
   ACTIVE NAV  —  v6
   ══════════════════════════════════════════ */
function setActiveNav() {
  const pageKey = document.body.getAttribute('data-page') || '';
  if (!pageKey) return;

  document.documentElement.setAttribute('data-page', pageKey);

  const PAGE_TO_HREF = {
    'home1':     'index.html',
    'home2':     'index.html',
    'about':     'about.html',
    'services':  'services.html',
    'menu':      'menu.html',
    'blog':      'blog.html',
    'contact':   'contact.html',
    'dashboard': 'dashboard.html',
  };

  const activeHref = PAGE_TO_HREF[pageKey];
  if (!activeHref) return;

  /* Desktop top-level links */
  document.querySelectorAll('.nav-links > li > a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('/').pop();
    a.classList.toggle('act', href === activeHref);
  });

  /* Desktop dropdown items (Home I / Home II exact match) */
  var DD_EXACT = { 'home1': 'index.html', 'home2': 'home2.html' };
  var ddHref = DD_EXACT[pageKey];
  document.querySelectorAll('.nav-dropdown .dd-item').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('/').pop();
    a.classList.toggle('act', !!ddHref && href === ddHref);
  });

  /* Mobile nav links */
  document.querySelectorAll('.mob-nav a:not(.btn)').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('/').pop();
    a.classList.toggle('act', href === activeHref);
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', function () {

  /* Sync theme button icon */
  var curTheme = document.documentElement.getAttribute('data-theme') || 'light';
  var themeBtn = document.getElementById('theme-btn');
  if (themeBtn) themeBtn.textContent = curTheme === 'dark' ? '☀️' : '🌙';

  /* Sync RTL button label */
  var curDir = document.documentElement.getAttribute('dir') || 'ltr';
  var rtlBtn = document.getElementById('rtl-btn');
  if (rtlBtn) rtlBtn.textContent = curDir === 'rtl' ? 'LTR' : 'RTL';

  initNav();
  initReveal();
  initHamburger();
  initDropdowns();
  setActiveNav();
});