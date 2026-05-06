

document.addEventListener('DOMContentLoaded', () => {

 
  const bar = document.createElement('div');
  bar.id = 'read-bar';
  Object.assign(bar.style, {
    position: 'fixed', top: '70px', left: '0', right: '0',
    height: '3px', background: '#C07828',
    width: '0%', zIndex: '998', transition: 'width .1s linear',
  });
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const doc    = document.documentElement;
    const scrolled = doc.scrollTop;
    const total    = doc.scrollHeight - doc.clientHeight;
    bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  });

  
  const body = document.querySelector('.bd-body');
  const readEl = document.querySelector('.bd-read');
  if (body && readEl) {
    const words = body.textContent.trim().split(/\s+/).length;
    const mins  = Math.max(1, Math.round(words / 200));
    readEl.textContent = `${mins} min read`;
  }

 
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({ title: document.title, url: window.location.href });
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          btn.textContent = '✓';
          setTimeout(() => { btn.textContent = btn.dataset.icon || '🔗'; }, 1500);
        });
      }
    });
  });

 
  document.querySelectorAll('.rpost').forEach(post => {
    post.addEventListener('mouseenter', () => { post.style.color = '#C07828'; });
    post.addEventListener('mouseleave', () => { post.style.color = '';        });
  });

});
