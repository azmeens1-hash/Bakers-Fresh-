
(function () {
  var theme = localStorage.getItem('bf-theme');
  var dir   = localStorage.getItem('bf-dir');
  if (theme) document.documentElement.setAttribute('data-theme', theme);
  if (dir)   document.documentElement.setAttribute('dir', dir);
})();



function toggleTheme() {
  var html   = document.documentElement;
  var isDark = html.getAttribute('data-theme') === 'dark';
  var next   = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('bf-theme', next);
  syncThemeIcon(next);
}


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
  var html  = document.documentElement;
  var isRTL = html.getAttribute('dir') === 'rtl';
  var next  = isRTL ? 'ltr' : 'rtl';
  html.setAttribute('dir', next);
  localStorage.setItem('bf-dir', next);
  var btn = document.getElementById('rtl-btn');
  if (btn) btn.textContent = isRTL ? 'RTL' : 'LTR';
}


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

function initNav() {
  var nav = document.getElementById('nav');
  if (!nav) return;
  var fn = function() { nav.classList.toggle('stuck', window.scrollY > 40); };
  window.addEventListener('scroll', fn, { passive: true });
  fn();
}


function doCopy(btn, code) {
  navigator.clipboard.writeText(code).then(function() {
    var orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(function() { btn.textContent = orig; }, 1800);
  });
}


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


function initDropdowns() {
  document.querySelectorAll('.nav-links li.has-drop').forEach(function(li) {
    var panel      = li.querySelector('.nav-dropdown');
    var trigger    = li.querySelector(':scope > a');
    var closeTimer = null;

    function openMenu() {
      
      document.querySelectorAll('.nav-links li.has-drop.open').forEach(function(other) {
        if (other !== li) other.classList.remove('open');
      });
      clearTimeout(closeTimer);
      li.classList.add('open');
    }

    function scheduleClose() {
      clearTimeout(closeTimer);
     
      closeTimer = setTimeout(function() {
        li.classList.remove('open');
      }, 300);
    }

    
    li.addEventListener('mouseenter', openMenu);

   
    li.addEventListener('mouseleave', scheduleClose);

  
    if (panel) {
      panel.addEventListener('mouseenter', function() {
        clearTimeout(closeTimer);
      });
     
      panel.addEventListener('mouseleave', scheduleClose);
    }

    
    if (trigger) {
      trigger.addEventListener('click', function(e) {
        var href = (trigger.getAttribute('href') || '').trim();
        if (!href || href === '#') {
          e.preventDefault();
          li.classList.contains('open') ? li.classList.remove('open') : openMenu();
        }
        
      });
    }
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-links li.has-drop')) {
      document.querySelectorAll('.nav-links li.has-drop.open').forEach(function(l) {
        l.classList.remove('open');
      });
    }
  });
}


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

   document.querySelectorAll('.nav-links > li > a').forEach(function(a) {
    var href = (a.getAttribute('href') || '').split('/').pop();
    a.classList.toggle('act', href === activeHref);
  });

 
  var DD_EXACT = { 'home1': 'index.html', 'home2': 'home2.html' };
  var ddHref = DD_EXACT[pageKey];
  document.querySelectorAll('.nav-dropdown .dd-item').forEach(function(a) {
    var href = (a.getAttribute('href') || '').split('/').pop();
    a.classList.toggle('act', !!ddHref && href === ddHref);
  });

  
  document.querySelectorAll('.mob-nav a:not(.btn)').forEach(function(a) {
    var href = (a.getAttribute('href') || '').split('/').pop();
    a.classList.toggle('act', href === activeHref);
  });
}


document.addEventListener('DOMContentLoaded', function() {
 
  var curTheme = document.documentElement.getAttribute('data-theme') || 'light';
syncThemeIcon(curTheme);

  var curDir = document.documentElement.getAttribute('dir') || 'ltr';
  var rtlBtn = document.getElementById('rtl-btn');
  if (rtlBtn) rtlBtn.textContent = curDir === 'rtl' ? 'LTR' : 'RTL';

  initNav();
  initReveal();
  initHamburger();
  initDropdowns();
  setActiveNav();
});