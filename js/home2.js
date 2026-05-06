/* ══════════════════════════════════════════
   Baker's Fresh — home2.js
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── MASONRY CARD CLICK → relevant page ── */
  document.querySelectorAll('.mc').forEach((card, i) => {
    card.addEventListener('click', () => {
      const destinations = [
        'service-detail.html',   // Birthday Extravaganza
        'service-detail.html',   // Chocolate Dream
        'service-detail.html',   // Strawberry Cloud
        'service-detail.html',   // Artisan Croissant
        'service-detail.html',   // Wedding Elegance
        'service-detail2.html',  // Anniversary Romance
        'service-detail.html',   // Baby Shower Bliss
      ];
      window.location.href = destinations[i] || 'services.html';
    });
  });

  /* ── STEP HOVER: highlight connector line ── */
  document.querySelectorAll('.step').forEach(step => {
    step.addEventListener('mouseenter', () => {
      const steps = document.querySelector('.steps');
      if (steps) steps.classList.add('step-active');
    });
    step.addEventListener('mouseleave', () => {
      const steps = document.querySelector('.steps');
      if (steps) steps.classList.remove('step-active');
    });
  });

  /* ── NEWSLETTER FORM FEEDBACK ── */
  const nlForm = document.querySelector('.nl-form');
  if (nlForm) {
    const input = nlForm.querySelector('input[type="email"]');
    const btn   = nlForm.querySelector('button');
    btn.addEventListener('click', () => {
      if (!input.value || !input.value.includes('@')) {
        input.style.outline = '2px solid #e05050';
        input.focus();
        setTimeout(() => { input.style.outline = ''; }, 1800);
        return;
      }
      btn.textContent = '✓ Subscribed!';
      btn.style.background = '#2A7A4A';
      input.value = '';
      input.placeholder = 'You\'re on the list! 🎉';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
        input.placeholder = 'Enter your email address…';
      }, 3000);
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') btn.click();
    });
  }

});