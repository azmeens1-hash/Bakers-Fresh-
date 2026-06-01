
document.addEventListener('DOMContentLoaded', () => {

  /* ── READ TIME ────────────────────────────── */
  document.querySelectorAll('.bcard').forEach(card => {
    const excerpt = card.querySelector('.bexcerpt');
    if (!excerpt) return;
    const words = excerpt.textContent.trim().split(/\s+/).length;
    const mins  = Math.max(1, Math.round(words / 200));
    const dateEl = card.querySelector('.bdate');
    if (dateEl) dateEl.textContent += ` · ${mins} min read`;
  });

});