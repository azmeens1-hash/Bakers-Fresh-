/* ══════════════════════════════════════════
   Baker's Fresh — global.js  (v7 — definitive dropdown fix)
   ══════════════════════════════════════════ */

/* ── THEME + DIR: apply before first paint to avoid flash ── */
(function () {
  var theme = localStorage.getItem('bf-theme');
  var dir   = localStorage.getItem('bf-dir');
  if (theme) document.documentElement.setAttribute('data-theme', theme);
  if (dir)   document.documentElement.setAttribute('dir', dir);
})();

/* ── THEME TOGGLE ── */
function toggleTheme() {
  var html   = document.documentElement;
  var isDark = html.getAttribute('data-theme') === 'dark';
  var next   = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('bf-theme', next);
  var btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = isDark ? '🌙' : '☀️';
}

/* ── RTL TOGGLE ── */
function toggleRTL() {
  var html  = document.documentElement;
  var isRTL = html.getAttribute('dir') === 'rtl';
  var next  = isRTL ? 'ltr' : 'rtl';
  html.setAttribute('dir', next);
  localStorage.setItem('bf-dir', next);
  var btn = document.getElementById('rtl-btn');
  if (btn) btn.textContent = isRTL ? 'RTL' : 'LTR';
}

/* ── MOBILE NAV ── */
function toggleMob() {
  document.getElementById('mob-nav') && document.getElementById('mob-nav').classList.toggle('open');
  document.getElementById('ham')     && document.getElementById('ham').classList.toggle('open');
}
function closeMob() {
  document.getElementById('mob-nav') && document.getElementById('mob-nav').classList.remove('open');
  document.getElementById('ham')     && document.getElementById('ham').classList.remove('open');
}
function toggleMobDrop(btn) {
  btn.classList.toggle('open');
  var drop = btn.nextElementSibling;
  if (drop) drop.style.display = drop.style.display === 'flex' ? 'none' : 'flex';
}

/* ── SCROLL REVEAL ── */
function initReveal() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function(el) { io.observe(el); });
}

/* ── STICKY NAV ── */
function initNav() {
  var nav = document.getElementById('nav');
  if (!nav) return;
  var fn = function() { nav.classList.toggle('stuck', window.scrollY > 40); };
  window.addEventListener('scroll', fn, { passive: true });
  fn();
}

/* ── PROMO CODE COPY ── */
function doCopy(btn, code) {
  navigator.clipboard.writeText(code).then(function() {
    var orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(function() { btn.textContent = orig; }, 1800);
  });
}

/* ── HAMBURGER LAYOUT ── */
function initHamburger() {
  var ham      = document.getElementById('ham');
  var navLinks = document.querySelector('.nav-links');
  var loginBtn = document.querySelector('.nav-r .btn-primary');
  var themeBtn = document.getElementById('theme-btn');
  var rtlBtn   = document.getElementById('rtl-btn');
  var mobNav   = document.getElementById('mob-nav');
  if (!ham) return;

  function applyLayout() {
    var desk = window.innerWidth >= 769;
    ham.style.display = desk ? 'none' : 'flex';
    if (navLinks) { desk ? navLinks.style.removeProperty('display') : (navLinks.style.display = 'none'); }
    if (loginBtn) { desk ? loginBtn.style.removeProperty('display') : (loginBtn.style.display = 'none'); }
    if (themeBtn) { desk ? themeBtn.style.removeProperty('display') : (themeBtn.style.display = 'flex'); }
    if (rtlBtn)   { desk ? rtlBtn.style.removeProperty('display')   : (rtlBtn.style.display   = 'flex'); }
    if (!desk && mobNav) { mobNav.classList.remove('open'); ham.classList.remove('open'); }
  }
  applyLayout();
  window.addEventListener('resize', applyLayout, { passive: true });
}

/* ══════════════════════════════════════════════════════════
   DESKTOP DROPDOWN — definitive fix

   THE ROOT CAUSE (confirmed):
   Previous code set pointer-events: none on .nav-dropdown in CSS.
   When the mouse moved from the nav link down toward the panel,
   the panel was fading in (opacity 0→1, 200ms transition) but still
   had pointer-events: none the entire time.
   Meanwhile the JS close timer (120ms) was shorter than the CSS
   transition (200ms), so the menu closed before the panel was
   interactive — especially at 1024px where nav items are tightly spaced.

   THE FIX:
   1. CSS: pointer-events: auto ALWAYS on .nav-dropdown (never toggled).
      visibility:hidden already blocks clicks when closed. No race condition.
   2. CSS: transition only opacity + transform. visibility switches instantly.
   3. JS: close timer = 300ms (comfortably longer than 180ms CSS transition).
   4. JS: panel mouseenter cancels the close timer unconditionally.
   5. CSS: padding-bottom: 22px on .has-drop li creates a large invisible
      hit area so mouseLeave doesn't fire during downward mouse travel.
   6. CSS: ::before pseudo on .nav-dropdown extends 22px above the panel,
      providing an additional hover-catch zone in the gap.
   ══════════════════════════════════════════════════════════ */
function initDropdowns() {
  document.querySelectorAll('.nav-links li.has-drop').forEach(function(li) {
    var panel      = li.querySelector('.nav-dropdown');
    var trigger    = li.querySelector(':scope > a');
    var closeTimer = null;

    function openMenu() {
      /* Close any other open dropdown first */
      document.querySelectorAll('.nav-links li.has-drop.open').forEach(function(other) {
        if (other !== li) other.classList.remove('open');
      });
      clearTimeout(closeTimer);
      li.classList.add('open');
    }

    function scheduleClose() {
      clearTimeout(closeTimer);
      /*
       * 300ms — must be longer than the CSS opacity transition (180ms).
       * This gives the mouse enough time to travel from the nav link
       * into the panel before the menu closes.
       */
      closeTimer = setTimeout(function() {
        li.classList.remove('open');
      }, 300);
    }

    /* Open on li mouseenter (covers both link and padding-bottom zone) */
    li.addEventListener('mouseenter', openMenu);

    /* Schedule close when mouse leaves the li */
    li.addEventListener('mouseleave', scheduleClose);

    /* If mouse enters the panel, cancel the close unconditionally */
    if (panel) {
      panel.addEventListener('mouseenter', function() {
        clearTimeout(closeTimer);
      });
      /* Schedule close when mouse leaves the panel */
      panel.addEventListener('mouseleave', scheduleClose);
    }

    /*
     * Click on the parent <a>:
     * - If it has a real href (e.g. "index.html") → navigate normally, don't intercept.
     * - If href is "#" or missing → toggle the open class instead.
     */
    if (trigger) {
      trigger.addEventListener('click', function(e) {
        var href = (trigger.getAttribute('href') || '').trim();
        if (!href || href === '#') {
          e.preventDefault();
          li.classList.contains('open') ? li.classList.remove('open') : openMenu();
        }
        /* Real href → let it navigate, dropdown will close naturally */
      });
    }
  });

  /* Click anywhere outside closes all dropdowns */
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-links li.has-drop')) {
      document.querySelectorAll('.nav-links li.has-drop.open').forEach(function(l) {
        l.classList.remove('open');
      });
    }
  });
}

/* ── ACTIVE NAV ── */
function setActiveNav() {
  var pageKey = document.body.getAttribute('data-page') || '';
  if (!pageKey) return;

  document.documentElement.setAttribute('data-page', pageKey);

  var PAGE_TO_HREF = {
    'home1':     'index.html',
    'home2':     'index.html',
    'about':     'about.html',
    'services':  'services.html',
    'menu':      'menu.html',
    'blog':      'blog.html',
    'contact':   'contact.html',
    'dashboard': 'dashboard.html',
  };

  var activeHref = PAGE_TO_HREF[pageKey];
  if (!activeHref) return;

  /* Desktop top-level links */
  document.querySelectorAll('.nav-links > li > a').forEach(function(a) {
    var href = (a.getAttribute('href') || '').split('/').pop();
    a.classList.toggle('act', href === activeHref);
  });

  /* Dropdown items — exact page match */
  var DD_EXACT = { 'home1': 'index.html', 'home2': 'home2.html' };
  var ddHref = DD_EXACT[pageKey];
  document.querySelectorAll('.nav-dropdown .dd-item').forEach(function(a) {
    var href = (a.getAttribute('href') || '').split('/').pop();
    a.classList.toggle('act', !!ddHref && href === ddHref);
  });

  /* Mobile nav links */
  document.querySelectorAll('.mob-nav a:not(.btn)').forEach(function(a) {
    var href = (a.getAttribute('href') || '').split('/').pop();
    a.classList.toggle('act', href === activeHref);
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', function() {
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