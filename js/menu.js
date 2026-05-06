/* ─────────────────────────────────────────────
   menu.js  —  Baker's Fresh  |  Menu & Pricing
   ───────────────────────────────────────────── */

/* ── INTERSECTION OBSERVER for .reveal ─────── */
const revealObs = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
  { threshold: 0.08 }
);

function observeReveals(container) {
  (container || document).querySelectorAll('.reveal:not(.in)').forEach(el => revealObs.observe(el));
}

/* ── TAB SWITCHING ──────────────────────────── */
function mTab(btn, cat) {
  /* update tab active state */
  document.querySelectorAll('.mtab').forEach(t => t.classList.remove('on'));
  btn.classList.add('on');

  /* hide every panel */
  document.querySelectorAll('.mcat').forEach(c => c.classList.remove('show'));

  /* show requested panel; fall back to mc-all */
  const target = document.getElementById('mc-' + cat) || document.getElementById('mc-all');
  if (target) {
    target.classList.add('show');
    /* trigger reveals on newly visible elements after paint */
    requestAnimationFrame(() => setTimeout(() => observeReveals(target), 60));
  }
}

/* ── ADD-TO-CART BUTTON FEEDBACK ────────────── */
function initAddButtons() {
  document.querySelectorAll('.madd').forEach(btn => {
    /* avoid double-binding on dynamic panels */
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (this.dataset.busy) return;

      this.dataset.busy = '1';
      const orig = this.textContent;
      this.textContent = '✓';
      this.style.background = '#2A7A4A';
      this.style.color = '#fff';
      this.style.transform = 'scale(1.18)';

      setTimeout(() => {
        this.textContent = orig;
        this.style.background = '';
        this.style.color = '';
        this.style.transform = '';
        delete this.dataset.busy;
      }, 1200);
    });
  });
}

/* ── TABLE ROW HOVER (CSS handles it, but keep for legacy) ── */
function initTableRows() {
  document.querySelectorAll('.stable tbody tr').forEach(row => {
    row.style.transition = 'background .2s';
  });
}

/* ── INIT ───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  /* reveal all elements already in the visible panel */
  observeReveals();

  initAddButtons();
  initTableRows();
});