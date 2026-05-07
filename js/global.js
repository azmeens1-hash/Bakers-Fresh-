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
   HAMBURGER VISIBILITY
   The CSS breakpoint across all pages is
   1024px — hamburger appears below 1024px,
   full nav appears at 1024px and above.
   This JS mirrors that exactly and also
   handles window resize (e.g. DevTools
   toggling between mobile/desktop views).
   ══════════════════════════════════════════ */
function initHamburger() {
  const ham      = document.getElementById('ham');
  const navLinks = document.querySelector('.nav-links');
  const loginBtn = document.querySelector('.nav-r .btn-primary');
  const mobNav   = document.getElementById('mob-nav');

  if (!ham) return;

  const BREAKPOINT = 1024;

  function applyLayout() {
    const isDesktop = window.innerWidth >= BREAKPOINT;

    if (isDesktop) {
      // ── Desktop: hide hamburger, show nav links + login
      ham.style.display = 'none';
      if (navLinks) navLinks.style.removeProperty('display');  // let CSS handle it (flex)
      if (loginBtn) loginBtn.style.removeProperty('display');

      // Close mobile menu if it was open
      if (mobNav) mobNav.classList.remove('open');
      ham.classList.remove('open');
    } else {
      // ── Mobile/Tablet: show hamburger, hide nav links + login
      ham.style.display = 'flex';
      if (navLinks) navLinks.style.display = 'none';
      if (loginBtn) loginBtn.style.display = 'none';
    }
  }

  applyLayout();
  window.addEventListener('resize', applyLayout, { passive: true });
}

/* ══════════════════════════════════════════
   AUTO ACTIVE NAV LINK
   ══════════════════════════════════════════ */
function setActiveNav() {
  const path    = window.location.pathname;
  const current = path.split('/').pop() || 'index.html';

  const isHomeOne   = current === 'index.html' || current === '';
  const isHomeTwo   = current === 'home2.html';
  const isHome      = isHomeOne || isHomeTwo;
  const isAbout     = current === 'about.html';
  const isServices  = ['services.html', 'service-detail.html',
                        'service-detail1.html', 'service-detail2.html'].includes(current);
  const isMenu      = current === 'menu.html';
  const isBlog      = current === 'blog.html' || current === 'blog-detail.html';
  const isContact   = current === 'contact.html';
  const isDashboard = current === 'dashboard.html';

  /* ── Desktop nav ── */
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('act'));

  // Top-level parent links only (not dropdown items)
  document.querySelectorAll('.nav-links > li > a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (isHome      && href === 'index.html')     a.classList.add('act');
    if (isAbout     && href === 'about.html')     a.classList.add('act');
    if (isServices  && href === 'services.html')  a.classList.add('act');
    if (isMenu      && href === 'menu.html')      a.classList.add('act');
    if (isBlog      && href === 'blog.html')      a.classList.add('act');
    if (isContact   && href === 'contact.html')   a.classList.add('act');
    if (isDashboard && href === 'dashboard.html') a.classList.add('act');
  });

  // Dropdown items (Home I / Home II)
  document.querySelectorAll('.nav-dropdown .dd-item').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (isHomeOne && href === 'index.html') a.classList.add('act');
    if (isHomeTwo && href === 'home2.html') a.classList.add('act');
  });

  /* ── Mobile nav ── */
  document.querySelectorAll('.mob-nav a').forEach(a => a.classList.remove('act'));

  document.querySelectorAll('.mob-nav a:not(.btn)').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (isHomeOne   && href === 'index.html')     a.classList.add('act');
    if (isHomeTwo   && href === 'home2.html')     a.classList.add('act');
    if (isAbout     && href === 'about.html')     a.classList.add('act');
    if (isServices  && href === 'services.html')  a.classList.add('act');
    if (isMenu      && href === 'menu.html')      a.classList.add('act');
    if (isBlog      && href === 'blog.html')      a.classList.add('act');
    if (isContact   && href === 'contact.html')   a.classList.add('act');
    if (isDashboard && href === 'dashboard.html') a.classList.add('act');
  });
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