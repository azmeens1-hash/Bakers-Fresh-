/* ══════════════════════════════════════════
   Baker's Fresh — services.js
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── SERVICE CARD HOVER — animate Explore arrow ── */
  document.querySelectorAll('.svc').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const link = card.querySelector('.svc-link');
      if (link) link.style.gap = '14px';
    });
    card.addEventListener('mouseleave', () => {
      const link = card.querySelector('.svc-link');
      if (link) link.style.gap = '';
    });
  });

});