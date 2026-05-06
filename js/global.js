/* ─────────────────────────────────────────────
   global.js  —  Baker's Fresh
   ───────────────────────────────────────────── */

/* ── THEME & DIR: apply before paint ────────── */
(function () {
  const theme = localStorage.getItem('bf-theme') || 'light';
  const dir   = localStorage.getItem('bf-dir')   || 'ltr';
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('dir',        dir);
})();

/* ── ACTIVE NAV ──────────────────────────────── */
function setActiveNav() {
  // Get current filename; handle trailing slash, empty string, SPA roots
  const raw  = window.location.pathname;
  const page = raw.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a, .mob-nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    // Exact match OR both resolve to index
    const match =
      href === page ||
      (page === '' && (href === 'index.html' || href === '/')) ||
      (page === 'index.html' && href === '/');
    a.classList.toggle('act', match);
  });
}

/* ── THEME TOGGLE ────────────────────────────── */
function toggleTheme() {
  const html   = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next   = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('bf-theme', next);
  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = isDark ? '🌙' : '☀️';
}

/* ── RTL TOGGLE ──────────────────────────────── */
function toggleRTL() {
  const html  = document.documentElement;
  const isRTL = html.getAttribute('dir') === 'rtl';
  const next  = isRTL ? 'ltr' : 'rtl';
  html.setAttribute('dir', next);
  localStorage.setItem('bf-dir', next);
  const btn = document.getElementById('rtl-btn');
  if (btn) btn.textContent = isRTL ? 'RTL' : 'LTR';
}

/* ── MOBILE HAMBURGER ────────────────────────── */
let _mobOpen = false;

function toggleMob() {
  _mobOpen = !_mobOpen;
  const menu  = document.getElementById('mob-nav');
  const ham   = document.getElementById('ham');
  const spans = ham.querySelectorAll('span');

  menu.classList.toggle('open', _mobOpen);

  if (_mobOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
}

function closeMob() {
  _mobOpen = false;
  const menu  = document.getElementById('mob-nav');
  const ham   = document.getElementById('ham');
  if (!menu || !ham) return;
  menu.classList.remove('open');
  ham.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}

/* Auto-close mobile menu when resizing above mobile breakpoint */
window.addEventListener('resize', () => {
  /* Match the CSS breakpoint — hide menu and reset hamburger above 768px */
  if (window.innerWidth >= 769 && _mobOpen) closeMob();
}, { passive: true });

/* Close mobile menu on outside click */
document.addEventListener('click', e => {
  const nav  = document.getElementById('nav');
  const menu = document.getElementById('mob-nav');
  if (_mobOpen && nav && menu && !nav.contains(e.target) && !menu.contains(e.target)) {
    closeMob();
  }
});

/* ── MOBILE DROPDOWN ACCORDION ───────────────── */
function toggleMobDrop(btn) {
  btn.classList.toggle('open');
  const dd = btn.nextElementSibling;
  if (!dd) return;
  dd.classList.toggle('open');
  dd.style.display = dd.classList.contains('open') ? 'flex' : 'none';
}

/* ── DESKTOP DROPDOWN INIT ───────────────────── */
/*
  CSS :hover alone is unreliable at cramped widths (e.g. 1024px) because
  the cursor can exit the <li> hit-area before reaching the panel.
  We add a JS click-toggle (.open class) as the primary trigger so the
  dropdown works at every desktop width without hover race conditions.

  Mobile accordion remains handled by the inline onclick="toggleMobDrop(this)".
*/
function initDropdowns() {
  document.querySelectorAll('.nav-links li.has-drop').forEach(li => {
    const link = li.querySelector(':scope > a');
    if (!link) return;

    link.addEventListener('click', e => {
      /* Only intercept on desktop — mobile uses the mob-nav instead */
      if (window.innerWidth < 769) return;

      const isOpen = li.classList.contains('open');

      /* Close all other open dropdowns first */
      document.querySelectorAll('.nav-links li.has-drop.open').forEach(other => {
        if (other !== li) other.classList.remove('open');
      });

      if (isOpen) {
        /* Already open — clicking again navigates to href normally */
        li.classList.remove('open');
      } else {
        /* Open this dropdown, prevent navigation on first click */
        e.preventDefault();
        li.classList.add('open');
      }
    });
  });

  /* Close open dropdowns when clicking anywhere outside the nav */
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-links')) {
      document.querySelectorAll('.nav-links li.has-drop.open').forEach(li => {
        li.classList.remove('open');
      });
    }
  });

  /* Close open dropdowns on Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav-links li.has-drop.open').forEach(li => {
        li.classList.remove('open');
      });
    }
  });
}

/* ── STICKY NAV ──────────────────────────────── */
function initStickyNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('stuck', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // apply immediately on load
}

/* ── SCROLL REVEAL ───────────────────────────── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ── PROMO CODE COPY ─────────────────────────── */
function doCopy(btn, code) {
  navigator.clipboard.writeText(code)
    .then(() => {
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    })
    .catch(() => {
      btn.textContent = '✓';
      setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
    });
}

/* ── SYNC ICON BUTTONS with stored state ─────── */
function syncButtons() {
  const theme = document.documentElement.getAttribute('data-theme');
  const dir   = document.documentElement.getAttribute('dir');
  const tb = document.getElementById('theme-btn');
  const rb = document.getElementById('rtl-btn');
  if (tb) tb.textContent = theme === 'dark' ? '☀️' : '🌙';
  if (rb) rb.textContent = dir   === 'rtl'  ? 'LTR' : 'RTL';
}

/* ── INIT ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  syncButtons();
  initStickyNav();
  initReveal();
  initDropdowns();   /* defined above — no longer throws */
});