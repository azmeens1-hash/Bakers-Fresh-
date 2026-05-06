

document.addEventListener('DOMContentLoaded', () => {
  /* ── STICKY SIDEBAR SCROLL INDICATOR ── */
  const sidebar = document.querySelector('.sd-sidebar');
  const hero    = document.querySelector('.sd-hero');
  if (sidebar && hero) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        sidebar.style.opacity = e.isIntersecting ? '1' : '1';
      });
    });
    obs.observe(hero);
  }

  
  const rows = document.querySelectorAll('.feat-row');
  const rowObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => { e.target.style.opacity = '1'; e.target.style.transform = 'none'; }, i * 60);
        rowObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  rows.forEach(r => { r.style.opacity = '0'; r.style.transform = 'translateX(-12px)'; r.style.transition = 'opacity .4s ease, transform .4s ease'; rowObs.observe(r); });


  const orderBtn = document.querySelector('.sd-sidebar .btn-primary');
  if (orderBtn) {
    setInterval(() => {
      orderBtn.style.boxShadow = '0 0 0 6px rgba(192,120,40,.18)';
      setTimeout(() => { orderBtn.style.boxShadow = ''; }, 600);
    }, 3500);
  }
});
