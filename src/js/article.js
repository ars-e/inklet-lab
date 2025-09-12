document.addEventListener('DOMContentLoaded', function() {
  // --- Initialize Features ---
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(document.body, { delimiters: [ {left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false} ] });
  }
  setupUI();
  setupInteractions();
  
  function setupUI() {
    // Set Footer Year
    const yearSpan = document.getElementById('y');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
  }



  function setupInteractions() {
    // Back to top button
    const toTop = document.getElementById('toTop');
    if (toTop) {
        window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 600));
        toTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
    }

    // Reading Progress Bar
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
          const totalHeight = document.body.scrollHeight - window.innerHeight;
          progressBar.style.width = `${(window.scrollY / totalHeight) * 100}%`;
        });
    }

    // TOC & Sidenotes setup
    setupTOCAndSidenotes();

    // Copy Code Buttons
    document.querySelectorAll('.prose pre').forEach(pre => {
        const button = document.createElement('button');
        button.className = 'copy-code-button'; 
        button.textContent = 'Copy';
        pre.appendChild(button);
        button.addEventListener('click', () => {
            const code = pre.querySelector('code').innerText;
            navigator.clipboard.writeText(code).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => button.textContent = 'Copy', 2000);
            });
        });
    });

    // Image Lightbox
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    if (lightboxOverlay && lightboxImage && lightboxClose) {
        document.querySelectorAll('.prose img, .cover-image img').forEach(img => {
            img.addEventListener('click', () => {
                lightboxImage.src = img.src;
                lightboxOverlay.classList.add('show');
            });
        });
        const closeLightbox = () => lightboxOverlay.classList.remove('show');
        lightboxOverlay.addEventListener('click', e => {
            if (e.target === lightboxOverlay) closeLightbox();
        });
        lightboxClose.addEventListener('click', closeLightbox);
    }
  
    // Social Sharing
    setupSocialShare();
  }
  
  function setupTOCAndSidenotes() {
      const tocContainer = document.getElementById('toc-links');
      const headings = Array.from(document.querySelectorAll('.prose h2'));
      const sidenotesContainer = document.getElementById('sidenotesContainer');
      const footnoteRefs = document.querySelectorAll('.footnote-ref');

      // TOC Logic
      if (tocContainer && headings.length) {
          headings.forEach(h => {
              if (!h.id) h.id = h.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
              const a = document.createElement('a');
              a.textContent = h.textContent; a.href = `#${h.id}`;
              const li = document.createElement('li');
              li.className = 'toc-link'; li.appendChild(a);
              tocContainer.appendChild(li);
          });
          
          const observer = new IntersectionObserver(entries => {
              entries.forEach(entry => {
                  const link = tocContainer.querySelector(`a[href="#${entry.target.id}"]`);
                  if (link && entry.isIntersecting) {
                      tocContainer.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
                      link.parentElement.classList.add('active');
                  }
              });
          }, { rootMargin: '-30% 0px -60% 0px', threshold: 0.7 });
          headings.forEach(h => observer.observe(h));
      }

      // Sidenotes Logic
      if (footnoteRefs.length > 0 && sidenotesContainer) {
          footnoteRefs.forEach(refLink => {
              const noteId = refLink.getAttribute('href').substring(1);
              const noteContent = document.getElementById(noteId);
              if (noteContent) {
                  const sidenote = document.createElement('div');
                  sidenote.id = `sidenote-${noteId.split(':')[1]}`;
                  sidenote.className = 'sidenote';
                  sidenote.innerHTML = noteContent.innerHTML;
                  sidenote.querySelector('.footnote-backref')?.remove();
                  sidenotesContainer.appendChild(sidenote);
                  
                  refLink.addEventListener('click', (e) => {
                      e.preventDefault();
                      const isActive = refLink.classList.contains('active');
                      // Deactivate all others
                      document.querySelectorAll('.footnote-ref').forEach(r => r.classList.remove('active'));
                      document.querySelectorAll('.sidenote').forEach(s => s.classList.remove('active'));
                      // Activate the clicked one if it wasn't already active
                      if (!isActive) {
                          refLink.classList.add('active');
                          sidenote.classList.add('active');
                      }
                  });
              }
          });
      }
  }
  
  function setupSocialShare() {
    const socialShare = document.getElementById('socialShare');
    if (socialShare) {
      socialShare.addEventListener('click', function(e) {
        const link = e.target.closest('a'); 
        if (!link) return;
        
        e.preventDefault();
        
        const service = link.dataset.service;
        const url = window.location.href;
        const title = document.title;
        let shareUrl = '';

        if (service === 'twitter') {
          shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        } else if (service === 'facebook') {
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        } else if (service === 'linkedin') {
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        } else if (service === 'copy') {
          navigator.clipboard.writeText(url).then(() => {
            if(!link.dataset.originalTitle) {
              link.dataset.originalTitle = link.title;
            }
            link.title = 'Copied!';
            setTimeout(() => { link.title = link.dataset.originalTitle; }, 2000);
          });
          return;
        }
        
        if(shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
        }
      });
    }
  }
});

// after your existing DOMContentLoaded logic in article.js
document.querySelectorAll('.related-articles-section .card').forEach(card => {
  const link = card.querySelector('a[href]');
  if (!link) return;

  card.style.cursor = 'pointer';

  card.addEventListener('click', (e) => {
    // avoid double navigating when clicking the title <a>
    if (e.target.closest('a')) return;
    window.location.assign(link.getAttribute('href'));
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      link.click();
    }
  });
});
