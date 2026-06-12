
(function () {
  const theme = localStorage.getItem('bf-theme') || 'light';
  const dir   = localStorage.getItem('bf-dir')   || 'ltr';
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('dir', dir);
})();



function toggleTheme() {
  var html   = document.documentElement;
  var isDark = html.getAttribute('data-theme') === 'dark';
  var next   = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('bf-theme', next);
  syncThemeIcon(next);
}

// ADD this helper function:
function syncThemeIcon(theme) {
  var moon = document.getElementById('icon-moon');
  var sun  = document.getElementById('icon-sun');
  if (!moon || !sun) return;
  if (theme === 'dark') {
    moon.style.display = 'none';
    sun.style.display  = 'block';
  } else {
    moon.style.display = 'block';
    sun.style.display  = 'none';
  }
}
function toggleRTL() {
  const html  = document.documentElement;
  const isRTL = html.getAttribute('dir') === 'rtl';
  const next  = isRTL ? 'ltr' : 'rtl';
  html.setAttribute('dir', next);
  localStorage.setItem('bf-dir', next);
  const btn = document.getElementById('rtl-btn');
  if (btn) btn.textContent = isRTL ? 'RTL' : 'LTR';
}



/* ── SIDEBAR TOGGLE ── */
function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sb-overlay');
  const isOpen   = sidebar.classList.contains('open');
  sidebar.classList.toggle('open', !isOpen);
  overlay.classList.toggle('show', !isOpen);
  // Animate hamburger
  const toggle = document.getElementById('mob-toggle');
  if (toggle) {
    const spans = toggle.querySelectorAll('span');
    if (!isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sb-overlay');
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
  const toggle = document.getElementById('mob-toggle');
  if (toggle) {
    toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
}

/* ── AUTO CLOSE SIDEBAR ON DESKTOP RESIZE ── */
window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) closeSidebar();
});

/* ── ACTIVE NAV ── */
function activateNav(btn, titleHtml) {
  document.querySelectorAll('.sb-link').forEach(l => l.classList.remove('act'));
  btn.classList.add('act');
  const h1 = document.querySelector('.dash-header-left h1');
  if (h1 && titleHtml) h1.innerHTML = titleHtml;
  // Close sidebar on mobile after nav click
  if (window.innerWidth < 1024) closeSidebar();
}

/* ── TOAST NOTIFICATIONS ── */
let toastWrap = null;
function showToast(msg, type = 'info') {
  if (!toastWrap) {
    toastWrap = document.createElement('div');
    toastWrap.className = 'toast-wrap';
    document.body.appendChild(toastWrap);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  toastWrap.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'toastOut .3s ease forwards';
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

/* ── DONUT CHART ── */
function drawDonut() {
  const svg = document.getElementById('donut-svg');
  if (!svg) return;
  const segments = [
    { pct: 42, color: '#C07828' },
    { pct: 28, color: '#D4A853' },
    { pct: 18, color: '#9A5F18' },
    { pct: 12, color: '#E8C86A' },
  ];
  const cx = 80, cy = 80, r = 60, stroke = 14;
  const circumference = 2 * Math.PI * r;
  let offset = -Math.PI / 2; // start at top

  segments.forEach(seg => {
    const arc = (seg.pct / 100) * circumference;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', seg.color);
    circle.setAttribute('stroke-width', stroke);
    circle.setAttribute('stroke-dasharray', `${arc} ${circumference - arc}`);
    circle.setAttribute('stroke-dashoffset', -offset * r);
    circle.style.transformOrigin = `${cx}px ${cy}px`;
    circle.style.transform = `rotate(${(offset * 180 / Math.PI)}deg)`;
    circle.style.transition = 'stroke-dasharray 1s ease';
    svg.insertBefore(circle, svg.firstChild);
    offset += (seg.pct / 100) * 2 * Math.PI;
  });
}

/* ── BAR CHART ANIMATION ── */
function animateBars() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.chart-bar-fill').forEach(bar => {
          const w = bar.getAttribute('data-width') || '0%';
          setTimeout(() => { bar.style.width = w; }, 200);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  const chartEl = document.querySelector('.chart-bars');
  if (chartEl) observer.observe(chartEl);
}

/* ── STAT COUNTER ANIMATION ── */
function animateStats() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-target') || el.textContent);
      const suffix = el.getAttribute('data-suffix') || '';
      if (isNaN(target)) return;
      let current = 0;
      const duration = 1000;
      const step = 16;
      const inc = target / (duration / step);
      const timer = setInterval(() => {
        current += inc;
        if (current >= target) {
          el.textContent = target + suffix;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current) + suffix;
        }
      }, step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-n[data-target]').forEach(n => observer.observe(n));
}
document.addEventListener('DOMContentLoaded', function() {
 
  var curTheme = document.documentElement.getAttribute('data-theme') || 'light';
syncThemeIcon(curTheme);
});

document.addEventListener('DOMContentLoaded', () => {
  syncButtons();
  drawDonut();
  animateBars();
  animateStats();
});