


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


function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('bf-theme', next);
  syncBtns();
}

function toggleRTL() {
  const html = document.documentElement;
  const next = html.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
  html.setAttribute('dir', next);
  localStorage.setItem('bf-dir', next);
  syncBtns();
}

function togglePw(id, btn) {
  const inp = document.getElementById(id);
  if (!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.textContent = inp.type === 'password' ? '👁️' : '🙈';
}

function checkStrength(val) {
  const fill = document.querySelector('.pw-fill');
  const lbl  = document.querySelector('.pw-lbl');
  const wrap = document.querySelector('.pw-strength');
  if (!fill || !lbl || !wrap) return;
  if (!val) { wrap.classList.remove('on'); return; }
  wrap.classList.add('on');
  let s = 0;
  if (val.length >= 8)           s++;
  if (/[A-Z]/.test(val))        s++;
  if (/[0-9]/.test(val))        s++;
  if (/[^A-Za-z0-9]/.test(val)) s++;
  fill.className = 'pw-fill';
  lbl.className  = 'pw-lbl';
  if      (s <= 1) { fill.classList.add('weak');   lbl.classList.add('weak');   lbl.textContent = 'Weak — add numbers & symbols'; }
  else if (s <= 2) { fill.classList.add('fair');   lbl.classList.add('fair');   lbl.textContent = 'Fair — getting stronger!'; }
  else             { fill.classList.add('strong'); lbl.classList.add('strong'); lbl.textContent = 'Strong password ✓'; }
}

function showMsg(text, type) {
  const el = document.getElementById('auth-msg');
  if (!el) return;
  el.textContent = text;
  el.className   = 'auth-msg' + (type ? ' ' + type : '');
}

function validateField(inp) {
  const v = (inp.value || '').trim();
  if (!v) { inp.classList.add('err'); return false; }
  if (inp.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
    inp.classList.add('err'); return false;
  }
  inp.classList.remove('err');
  return true;
}

function socialClick(btn, provider) {
  const orig = btn.innerHTML;
  btn.innerHTML = '<span style="font-size:.74rem">Connecting…</span>';
  btn.disabled = true;
  setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  syncBtns();
  document.querySelectorAll('.input-wrap input').forEach(inp =>
    inp.addEventListener('input', () => inp.classList.remove('err'))
  );
  const pw = document.getElementById('password');
  if (pw) pw.addEventListener('input', () => checkStrength(pw.value));
});
function handleLogin(e) {
      e.preventDefault();
      const email = document.getElementById('email');
      const pw    = document.getElementById('pw');
      const btn   = document.getElementById('login-btn');
      if (!(validateField(email) & validateField(pw))) {
        showMsg('Please fill in all required fields correctly.', 'error');
        return;
      }
      btn.textContent = 'Signing in…';
      btn.classList.add('loading');
      setTimeout(() => {
        btn.textContent = '✓ Signed In!';
        btn.style.background = '#2A7A4A';
        showMsg('Welcome back! Redirecting…', 'success');
        setTimeout(() => {
          btn.textContent = 'Sign In ✦';
          btn.style.background = '';
          btn.classList.remove('loading');
          showMsg('', '');
        }, 3000);
      }, 1400);
    }