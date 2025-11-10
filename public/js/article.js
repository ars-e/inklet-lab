// /js/article.js
document.addEventListener('DOMContentLoaded', () => {
  // --- KaTeX auto-render (if available)
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$',  right: '$',  display: false },
      ],
    });
  }

  setupInteractions();
  setFooterYear();

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
      toc.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', (e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          const href = a.getAttribute('href');
          if (!href || !href.startsWith('#')) return;
          const target = document.querySelector(href);
          if (!target) return;
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });

          const url = new URL(window.location.href);
          url.hash = href.slice(1);
          history.replaceState(null, '', url);
        });
      });
    }

    // Footnote highlight
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

      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.innerText ?? '';
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(code);
          } else {
            const ta = document.createElement('textarea');
            ta.value = code; ta.setAttribute('readonly','');
            ta.style.position = 'fixed'; ta.style.top = '-9999px';
            document.body.appendChild(ta); ta.select(); document.execCommand('copy');
            document.body.removeChild(ta);
          }
          btn.textContent = 'Copied!';
          setTimeout(() => (btn.textContent = 'Copy'), 2000);
        } catch (_) {}
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

  // --- Social share (normalize URLs, LinkedIn warm, copy-link toast)
  function setupSocialShare() {
    const wrap = document.getElementById('socialShare');
    const toast = document.getElementById('shareToast');
    if (!wrap) return;

    const absolutize = (u) => {
      try { return new URL(u, window.location.origin).toString(); }
      catch { return window.location.href; }
    };

    // Normalize url= params to absolute for X/LinkedIn anchors
    wrap.querySelectorAll('a[href*="twitter.com/intent/tweet"], a[href*="linkedin.com/"]')
      .forEach(a => {
        try {
          const u = new URL(a.href);
          if (u.searchParams.has('url')) {
            const raw = u.searchParams.get('url') || location.href;
            u.searchParams.set('url', absolutize(raw));
            a.href = u.toString();
          }
        } catch (_) {}
      });

    // Also normalize copy button’s data attribute once
    const copyBtn = document.getElementById('copyLinkBtn');
    if (copyBtn) {
      const raw = copyBtn.getAttribute('data-clipboard-text') || location.href;
      if (!/^https?:\/\//i.test(raw)) {
        copyBtn.setAttribute('data-clipboard-text', absolutize(raw));
      }
    }

    wrap.addEventListener('click', async (e) => {
      const a = e.target.closest('a');
      const btn = e.target.closest('button');

      // Copy link
      if (btn?.dataset?.service === 'copy') {
        e.preventDefault();
        const url = btn.getAttribute('data-clipboard-text')
          || `${location.origin}${location.pathname}${location.search}${location.hash}`;
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(url);
          } else {
            const ta = document.createElement('textarea');
            ta.value = url; ta.setAttribute('readonly','');
            ta.style.position = 'fixed'; ta.style.top = '-9999px';
            document.body.appendChild(ta); ta.select(); document.execCommand('copy');
            document.body.removeChild(ta);
          }
          if (toast) {
            toast.hidden = false;
            toast.classList.add('show');
            clearTimeout(setupSocialShare._t);
            setupSocialShare._t = setTimeout(() => {
              toast.classList.remove('show');
              toast.hidden = true;
            }, 1400);
          }
        } catch (_) {
          btn.title = 'Copy failed';
        }
        return;
      }

      // LinkedIn: warm cache via Post Inspector, then open composer
      if (a && a.dataset.service === 'linkedin') {
        e.preventDefault();
        try {
          const shareUrl = new URL(a.href);
          const target = shareUrl.searchParams.get('url') || location.href;

          // Warm cache (non-blocking)
          const inspector = `https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(target)}`;
          fetch(inspector, { mode: 'no-cors', keepalive: true }).catch(() => {});

          // Open composer shortly after to allow scrape start
          setTimeout(() => {
            window.open(shareUrl.toString(), '_blank', 'noopener,noreferrer');
          }, 350);
        } catch (_) {
          window.open(a.href, '_blank', 'noopener,noreferrer');
        }
      }
    });
  }
});
