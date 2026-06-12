

document.addEventListener('DOMContentLoaded', () => {


  const revealObs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
    { threshold: 0.08 }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  const clockSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;

  document.querySelectorAll('.bcard').forEach(card => {
    const excerpt = card.querySelector('.bexcerpt');
    if (!excerpt) return;

    const words = excerpt.textContent.trim().split(/\s+/).length;
    const mins  = Math.max(1, Math.round(words / 200));
    const dateEl = card.querySelector('.bdate');
    if (!dateEl) return;

   
    const existingText = dateEl.textContent.trim();
    dateEl.innerHTML = `<span>${existingText}</span><span class="bdate-read">${clockSVG} ${mins} min read</span>`;
  });

});