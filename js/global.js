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
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
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
   AUTO ACTIVE NAV LINK
   Sets .act on the nav link that matches
   the current page — works on all pages
   automatically after publishing.
   ══════════════════════════════════════════ */
function setActiveNav() {
  // Get current filename e.g. "about.html" or "" / "index.html"
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  // ── Desktop nav links ──
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(a => {
    a.classList.remove('act');
    const href = a.getAttribute('href') || '';
    const linkPage = href.split('/').pop();

    // Dropdown items (Home I / Home II)
    if (a.classList.contains('dd-item')) {
      if (
        (linkPage === 'index.html' && (page === 'index.html' || page === '')) ||
        (linkPage === page && page !== '')
      ) {
        a.classList.add('act');
      }
      return;
    }

    // Top-level "Home" parent — active on both home pages
    if (href === 'index.html' && (page === 'index.html' || page === '' || page === 'home2.html')) {
      a.classList.add('act');
      return;
    }

    // All other top-level links
    if (linkPage === page && page !== 'index.html' && page !== '') {
      a.classList.add('act');
    }
  });

  // ── Mobile nav links ──
  const mobLinks = document.querySelectorAll('.mob-nav a:not(.btn)');
  mobLinks.forEach(a => {
    a.classList.remove('act');
    const href = a.getAttribute('href') || '';
    const linkPage = href.split('/').pop();

    if (
      (linkPage === 'index.html' && (page === 'index.html' || page === '')) ||
      (linkPage === page && page !== '')
    ) {
      a.classList.add('act');
    }
  });

  // ── Special: service-detail pages — highlight "Services" ──
  const servicePages = ['service-detail.html', 'service-detail1.html', 'service-detail2.html'];
  if (servicePages.includes(page)) {
    navLinks.forEach(a => {
      if ((a.getAttribute('href') || '').includes('services.html')) {
        a.classList.add('act');
      }
    });
  }

  // ── Special: blog-detail page — highlight "Blog" ──
  if (page === 'blog-detail.html') {
    navLinks.forEach(a => {
      if ((a.getAttribute('href') || '').includes('blog.html')) {
        a.classList.add('act');
      }
    });
  }
}

/* ── INIT ON DOM READY ── */
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
  setActiveNav();   // ← auto-highlights correct nav link on every page
});