document.addEventListener('DOMContentLoaded', () => {
  /* 1) Interactive header */
  const title = document.getElementById('main-title');
  if (title){
    const text = title.innerText;
    title.innerHTML = '';
    text.split('').forEach(ch=>{
      const span=document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      title.appendChild(span);
    });
  }

  /* 2) Custom cursor */
  const cursor = document.getElementById('custom-cursor');
  if (cursor){
    window.addEventListener('mousemove', e=>{
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, .poi-card, .progress-marker').forEach(el=>{
      el.addEventListener('mouseenter', ()=>cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', ()=>cursor.classList.remove('hovering'));
    });
  }

  /* 3) Scroll follower / shapes */
  const oblio  = document.getElementById('oblio');
  const shapes = document.querySelectorAll('.shape');
  const scrollIndicator = document.getElementById('scroll-down-indicator');

  /* 4) Progress bar + mini TOC */
  const progressBar = document.getElementById('scroll-progress-bar');
  const chapterSections = document.querySelectorAll('.chapter');

  function setupProgressBar(){
    if (!progressBar) return;
    progressBar.querySelectorAll('.progress-marker, .progress-label').forEach(el=>el.remove());

    const totalHeight = document.body.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;

    chapterSections.forEach(ch=>{
      const titleEl = ch.querySelector('.chapter-title');
      if (!titleEl) return;
      const chapterTop = ch.offsetTop;
      const percentPosition = (chapterTop / totalHeight) * 100;

      const marker = document.createElement('div');
      marker.className = 'progress-marker';
      marker.style.top = percentPosition + '%';
      marker.title = titleEl.textContent;
      marker.addEventListener('click', ()=>{
        window.scrollTo({ top: chapterTop, behavior:'smooth' });
      });

      const label = document.createElement('div');
      label.className = 'progress-label';
      label.style.top = percentPosition + '%';
      label.textContent = titleEl.textContent;

      progressBar.appendChild(marker);
      progressBar.appendChild(label);
    });
  }
  setupProgressBar();

  let resizeTimer;
  window.addEventListener('resize', ()=>{
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setupProgressBar, 100);
  });

  /* 5) Scroll handler */
  window.addEventListener('scroll', ()=>{
    const scrollY = window.scrollY;
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
    const progressIndicator = document.getElementById('scroll-progress-indicator');

    if (oblio){
      const rotation = scrollY / 5;
      const scale = 1 + Math.sin(scrollY / 100) * 0.1;
      oblio.style.transform = `translateY(-50%) rotate(${rotation}deg) scale(${scale})`;
    }

    shapes.forEach((shape,i)=>{
      const speed = i === 0 ? 0.2 : 0.1;
      shape.style.transform = `translateY(-${scrollY * speed}px)`;
    });

    if (progressIndicator){
      progressIndicator.style.height = progress + '%';
    }

    if (scrollIndicator){
      scrollIndicator.classList.toggle('is-hidden', scrollY > 50);
    }
  }, { passive:true });

  /* 7) Mobile menu */
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobileMenu   = document.getElementById('mobile-menu');
  if (mobileToggle && mobileMenu){
    mobileToggle.addEventListener('click', ()=>{
      mobileMenu.classList.toggle('is-open');
    });
    mobileMenu.querySelectorAll('a').forEach(link=>{
      link.addEventListener('click', ()=>mobileMenu.classList.remove('is-open'));
    });
  }

  /* 8) POI cards: click + keyboard */
  document.querySelectorAll('.poi-card').forEach(card => {
    const flip = () => card.classList.toggle('is-flipped');

    card.addEventListener('click', (e) => {
      // If the click is on the link, let the browser handle navigation.
      // The `closest` method checks the element itself and its ancestors.
      if (e.target.closest('.visit-page-link')) {
        return;
      }
      flip();
    });

    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        // If the focused element is the link itself, allow the default browser
        // action (which is to 'click' the link and navigate).
        if (document.activeElement.classList.contains('visit-page-link')) {
          return;
        }
        // Otherwise, prevent default to stop space from scrolling and flip the card.
        e.preventDefault();
        flip();
      }
    });
  });

  /* 9) Footnotes focusable */
  document.querySelectorAll('.footnote sup').forEach(fn=>{
    fn.setAttribute('tabindex','0');
  });

  /* 10) Bio Modal Logic */
  const openBtn = document.getElementById('open-bio-modal');
  const closeBtn = document.getElementById('close-bio-modal');
  const modal = document.getElementById('bio-modal');
  const modalContent = modal ? modal.querySelector('.bio-modal-content') : null; // Get content for overlay click check

  if (openBtn && closeBtn && modal && modalContent) {
    const openModal = () => {
      modal.removeAttribute('hidden');
      document.body.classList.add('modal-open');
      // Add close button to cursor hover list
      if (cursor) {
        closeBtn.addEventListener('mouseenter', ()=>cursor.classList.add('hovering'));
        closeBtn.addEventListener('mouseleave', ()=>cursor.classList.remove('hovering'));
      }
    };

    const closeModal = () => {
      modal.setAttribute('hidden', 'true');
      document.body.classList.remove('modal-open');
      // Remove close button from cursor hover list
      if (cursor) {
        closeBtn.removeEventListener('mouseenter', ()=>cursor.classList.add('hovering'));
        closeBtn.removeEventListener('mouseleave', ()=>cursor.classList.remove('hovering'));
      }
    };

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    // Click outside to close
    modal.addEventListener('click', (e) => {
      // Check if the click is on the overlay itself, not the content
      if (e.target === modal) {
        closeModal();
      }
    });

    // Escape key to close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
        closeModal();
      }
    });
  }

});
