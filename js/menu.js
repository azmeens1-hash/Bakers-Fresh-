
const revealObs = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
  { threshold: 0.08 }
);

function observeReveals(container) {
  (container || document).querySelectorAll('.reveal:not(.in)').forEach(el => revealObs.observe(el));
}

function mTab(btn, cat) {

  document.querySelectorAll('.mtab').forEach(t => t.classList.remove('on'));
  btn.classList.add('on');

  
  document.querySelectorAll('.mcat').forEach(c => c.classList.remove('show'));

 
  const target = document.getElementById('mc-' + cat) || document.getElementById('mc-all');
  if (target) {
    target.classList.add('show');
   
    requestAnimationFrame(() => setTimeout(() => observeReveals(target), 60));
  }
}


function initAddButtons() {
  document.querySelectorAll('.madd').forEach(btn => {
   
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


function initTableRows() {
  document.querySelectorAll('.stable tbody tr').forEach(row => {
    row.style.transition = 'background .2s';
  });
}


document.addEventListener('DOMContentLoaded', () => {
 
  observeReveals();

  initAddButtons();
  initTableRows();
});