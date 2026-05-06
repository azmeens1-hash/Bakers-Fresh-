

document.addEventListener('DOMContentLoaded', () => {
 
  const counters = document.querySelectorAll('.stat-n');
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const numMatch = raw.match(/[\d,.]+/);
      if (!numMatch) return;
      const target = parseFloat(numMatch[0].replace(/,/g, ''));
      const suffix = raw.replace(numMatch[0], '');
      let start = 0;
      const step = target / 40;
      const timer = setInterval(() => {
        start = Math.min(start + step, target);
        el.textContent = (Number.isInteger(target)
          ? Math.round(start).toLocaleString()
          : start.toFixed(1)) + suffix;
        if (start >= target) clearInterval(timer);
      }, 30);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObs.observe(c));

  
  document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = 'contact.html';
    });
  });
});
