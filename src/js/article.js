document.addEventListener('DOMContentLoaded', () => {
  // --- KaTeX auto-render (if available)
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$',  right: '$',  display: false }
      ]
    });
  }

  setupInteractions();
  setFooterYear(); // harmless fallback

  function setFooterYear() {
    const y = document.getElementById('y');
    if (y) y.textContent = new Date().getFullYear();
  }

  function setupInteractions() {
    setupToTop();
    setupProgressBar();
    setupTOCAndFootnotes();
    setupCopyCodeButtons();
    setupLightbox();
    setupSocialShare();
  }

  // --- Back to top
  function setupToTop() {
    const toTop = document.getElementById('toTop');
    if (!toTop) return;

    const onScroll = () => toTop.classList.toggle('show', window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toTop.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  // --- Reading progress
  function setupProgressBar() {
    const bar = document.getElementById('progressBar');
    if (!bar) return;

    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      bar.style.width = `${(window.scrollY / total) * 100}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- ToC + Footnotes
  function setupTOCAndFootnotes() {
    const toc = document.getElementById('toc-links');
    const headings = Array.from(document.querySelectorAll('.prose h2'));
    const footnoteRefs = document.querySelectorAll('.footnote-ref');

    // Build ToC
    if (toc && headings.length) {
      headings.forEach(h => {
        if (!h.id) h.id = h.textContent.toLowerCase()
          .replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        const a = document.createElement('a');
        a.textContent = h.textContent;
        a.href = `#${h.id}`;
        const li = document.createElement('li');
        li.className = 'toc-link';
        li.appendChild(a);
        toc.appendChild(li);
      });

      // Active section highlight
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const link = toc.querySelector(`a[href="#${entry.target.id}"]`);
          if (link && entry.isIntersecting) {
            toc.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
            link.parentElement.classList.add('active');
          }
        });
      }, { rootMargin: '-30% 0px -60% 0px', threshold: 0.7 });
      headings.forEach(h => observer.observe(h));

      // Smooth-scroll without adding history entries
      // so the browser Back button returns to the previous page.
      toc.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', (e) => {
          // preserve modified/middle clicks
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

          const href = a.getAttribute('href');
          if (!href || !href.startsWith('#')) return;

          const target = document.querySelector(href);
          if (!target) return;

          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Update URL hash WITHOUT pushing a new history entry
          const url = new URL(window.location.href);
          url.hash = href.slice(1);
          history.replaceState(null, '', url);
        });
      });
    }

    // Footnote highlight (let default jump occur)
    if (footnoteRefs.length) {
      footnoteRefs.forEach(ref => {
        ref.addEventListener('click', () => {
          const isActive = ref.classList.contains('active');
          document.querySelectorAll('.footnote-ref').forEach(r => r.classList.remove('active'));
          if (!isActive) ref.classList.add('active');
        });
      });
    }
  }

  // --- Copy code buttons
  function setupCopyCodeButtons() {
    document.querySelectorAll('.prose pre').forEach(pre => {
      const btn = document.createElement('button');
      btn.className = 'copy-code-button';
      btn.textContent = 'Copy';
      pre.appendChild(btn);

      btn.addEventListener('click', () => {
        const code = pre.querySelector('code')?.innerText ?? '';
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = 'Copied!';
          setTimeout(() => (btn.textContent = 'Copy'), 2000);
        });
      });
    });
  }

  // --- Image lightbox
  function setupLightbox() {
    const overlay = document.getElementById('lightboxOverlay');
    const imgEl = document.getElementById('lightboxImage');
    const closeBtn = document.getElementById('lightboxClose');
    if (!overlay || !imgEl || !closeBtn) return;

    document.querySelectorAll('.prose img, .cover-image img').forEach(img => {
      img.addEventListener('click', () => {
        imgEl.src = img.src;
        overlay.classList.add('show');
      });
    });

    const close = () => overlay.classList.remove('show');
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    closeBtn.addEventListener('click', close);
  }

  // --- Social share (anchors use their own href; handle copy button)
  function setupSocialShare() {
    const wrap = document.getElementById('socialShare');
    if (!wrap) return;

    wrap.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (button?.dataset?.service === 'copy') {
        e.preventDefault();
        const url = `${location.origin}${location.pathname}${location.search}${location.hash}`;
        navigator.clipboard.writeText(url).then(() => {
          button.title = 'Copied!';
          button.setAttribute('aria-label', 'Copied!');
          setTimeout(() => {
            button.title = 'Copy link';
            button.setAttribute('aria-label', 'Copy link');
          }, 2000);
        });
      }
      // Note: <a> links keep default target=_blank behavior
    });
  }
});
