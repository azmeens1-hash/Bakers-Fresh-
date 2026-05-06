/* ══════════════════════════════════════════
   Baker's Fresh — home1.js
   ══════════════════════════════════════════ */

/* ── SMOOTH SCROLL UTILITY ── */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {

  /* Parallax removed — hero background is static */

  /* ── ADD TO CART BUTTON FEEDBACK ── */
  document.querySelectorAll('.padd').forEach(btn => {
    btn.addEventListener('click', function () {
      this.textContent = '✓';
      this.style.background = '#2A7A4A';
      this.style.color = '#fff';
      this.style.transform = 'scale(1.2)';
      setTimeout(() => {
        this.textContent = '+';
        this.style.background = '';
        this.style.color = '';
        this.style.transform = '';
      }, 1200);
    });
  });

  /* ── THEME CAKE CARDS → navigate to service detail ── */
  document.querySelectorAll('.tcake').forEach((card, i) => {
    card.addEventListener('click', () => {
      const pages = [
        'service-detail.html',
        'service-detail.html',
        'service-detail2.html',
      ];
      window.location.href = pages[i] || 'service-detail.html';
    });
  });

  /* ── PRODUCT CARD HOVER TILT ── */
  document.querySelectorAll('.pcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotX   = ((y - cy) / cy) * -4;
      const rotY   = ((x - cx) / cx) *  4;
      card.style.transform = `translateY(-10px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── STATS COUNTER ANIMATION ── */
  const statNums = document.querySelectorAll('.stat-n');
  const statObs  = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();
      // Extract numeric part and suffix (e.g. "500+" → 500, "+")
      const match = raw.match(/^(\d+(?:\.\d+)?)(.*)/);
      if (!match) return;
      const target = parseFloat(match[1]);
      const suffix = match[2];
      let start    = 0;
      const dur    = 1400;
      const step   = 16;
      const inc    = target / (dur / step);
      const timer  = setInterval(() => {
        start += inc;
        if (start >= target) {
          el.textContent = target % 1 === 0
            ? target.toFixed(0) + suffix
            : target.toFixed(1) + suffix;
          clearInterval(timer);
        } else {
          el.textContent = (target % 1 === 0
            ? Math.floor(start).toString()
            : start.toFixed(1)) + suffix;
        }
      }, step);
      statObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  statNums.forEach(n => statObs.observe(n));

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
      btn.textContent  = '✓ Subscribed!';
      btn.style.background = '#2A7A4A';
      input.value      = '';
      input.placeholder = 'You\'re on the list! 🎉';
      setTimeout(() => {
        btn.textContent  = 'Subscribe';
        btn.style.background = '';
        input.placeholder = 'Enter your email address…';
      }, 3000);
    });

    // Also fire on Enter key
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') btn.click();
    });
  }

  /* ── FEATURE CARDS — staggered entrance on scroll ── */
  const fcardObs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('in');
        }, i * 100);
        fcardObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.fcard').forEach(c => fcardObs.observe(c));

  /* ── PROMO BAR — pulsing attention ── */
  const promo = document.querySelector('.promo');
  if (promo) {
    const promoObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          promo.style.animation = 'none';
          // small flash effect
          promo.style.opacity = '0.85';
          setTimeout(() => { promo.style.opacity = '1'; }, 180);
          promoObs.unobserve(promo);
        }
      });
    }, { threshold: 0.5 });
    promoObs.observe(promo);
  }

  /* ── TESTIMONIAL CARDS AUTO-CYCLE ON MOBILE ── */
  if (window.innerWidth < 640) {
    const tgrid  = document.querySelector('.tgrid');
    const tcards = document.querySelectorAll('.tcard');
    if (tgrid && tcards.length > 1) {
      let current = 0;
      // Show only one card at a time on small mobile by adding a dim class
      const setActive = idx => {
        tcards.forEach((c, i) => {
          c.style.opacity  = i === idx ? '1' : '0.45';
          c.style.transform = i === idx ? 'scale(1.02)' : 'scale(1)';
        });
      };
      setActive(0);
      setInterval(() => {
        current = (current + 1) % tcards.length;
        setActive(current);
      }, 3200);
    }
  }

});