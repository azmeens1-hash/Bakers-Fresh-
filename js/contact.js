/* ══════════════════════════════════════════
   Baker's Fresh — contact.js
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');
  const successBox = document.getElementById('form-success');

  if (!form) return;

  /* ── FIELD VALIDATION HELPERS ── */
  function showError(input, msg) {
    input.style.borderColor = '#e05050';
    input.style.boxShadow   = '0 0 0 3px rgba(224,80,80,.12)';
    let err = input.parentElement.querySelector('.field-err');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-err';
      err.style.cssText = 'font-size:.7rem;color:#e05050;margin-top:3px;';
      input.parentElement.appendChild(err);
    }
    err.textContent = msg;
  }

  function clearError(input) {
    input.style.borderColor = '';
    input.style.boxShadow   = '';
    const err = input.parentElement.querySelector('.field-err');
    if (err) err.remove();
  }

  /* ── CLEAR ERRORS ON INPUT ── */
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => clearError(el));
    el.addEventListener('change', () => clearError(el));
  });

  /* ── FORM SUBMIT ── */
  form.addEventListener('submit', e => {
    e.preventDefault();

    const firstName = form.querySelector('input[placeholder="Your first name"]');
    const lastName  = form.querySelector('input[placeholder="Your last name"]');
    const email     = form.querySelector('input[type="email"]');
    const message   = form.querySelector('textarea');

    let valid = true;

    if (!firstName.value.trim()) {
      showError(firstName, 'First name is required');
      valid = false;
    }
    if (!lastName.value.trim()) {
      showError(lastName, 'Last name is required');
      valid = false;
    }
    if (!email.value.trim()) {
      showError(email, 'Email address is required');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showError(email, 'Please enter a valid email address');
      valid = false;
    }
    if (!message.value.trim()) {
      showError(message, 'Please tell us about your cake');
      valid = false;
    }

    if (!valid) {
      // Scroll to first error
      const firstErr = form.querySelector('[style*="border-color: rgb(224"]');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    /* ── LOADING STATE ── */
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;
    submitBtn.style.opacity = '0.7';

    // Simulate send (replace with real API call if needed)
    setTimeout(() => {
      form.style.display         = 'none';
      successBox.style.display   = 'block';
      successBox.style.animation = 'fadeIn .5s ease both';
    }, 1200);
  });

  /* ── PHONE NUMBER FORMATTING ── */
  const phone = form.querySelector('input[type="tel"]');
  if (phone) {
    phone.addEventListener('input', function () {
      // Allow only digits, spaces, +, -
      this.value = this.value.replace(/[^\d\s+\-()]/g, '');
    });
  }

  /* ── DATE INPUT: Prevent past dates ── */
  const dateInput = form.querySelector('input[type="date"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  /* ── CONTACT ITEM CLICK TO ACTION ── */
  // Make phone number clickable
  document.querySelectorAll('.ci-txt').forEach(item => {
    const h5 = item.querySelector('h5');
    const p  = item.querySelector('p');
    if (!h5 || !p) return;

    if (h5.textContent.trim() === 'Call Us') {
      item.parentElement.style.cursor = 'pointer';
      item.parentElement.addEventListener('click', () => {
        window.location.href = 'tel:+919676843210';
      });
    }
    if (h5.textContent.trim() === 'Email') {
      item.parentElement.style.cursor = 'pointer';
      item.parentElement.addEventListener('click', () => {
        window.location.href = 'mailto:info@bakersfresh.com';
      });
    }
  });

  /* ── TEXTAREA AUTO RESIZE ── */
  const textarea = form.querySelector('textarea');
  if (textarea) {
    textarea.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 280) + 'px';
    });
  }

});