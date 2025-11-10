document.addEventListener('DOMContentLoaded', () => {
  /* =========================
     0) Utilities
  ========================== */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* =========================
     1) Footer year
  ========================== */
  const yearEl = $('#footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================
     2) Custom cursor
  ========================== */
  const cursorDot = $('.cursor-dot');
  if (cursorDot) {
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top  = `${e.clientY}px`;
    });

    $$('.vertical-nav-list a, a, button').forEach(el => {
      el.addEventListener('mouseenter', () => cursorDot.classList.add('grow'));
      el.addEventListener('mouseleave', () => cursorDot.classList.remove('grow'));
    });
  }

  /* =========================
     3) Nav color-pop on hover
  ========================== */
  const popPalette = ['#ff4d4f', '#ffb703', '#3dd5f3', '#22c55e', '#ec4899', '#60a5fa'];
  const setRandomPopColor = (el) => {
    const c = popPalette[Math.floor(Math.random() * popPalette.length)];
    el.style.setProperty('--pop-color', c);
  };
  $$('.vertical-nav-list a').forEach(link => {
    link.addEventListener('mouseenter', () => setRandomPopColor(link));
    link.addEventListener('focus',     () => setRandomPopColor(link));
  });

  /* =========================
     4) Case Study ToC
  ========================== */
  const tocContainer = $('#case-study-toc');
  const headings = $$('.content-main h2');

  // ensure we have stable IDs for headings (for anchor links)
  const slug = (s) => s.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  if (tocContainer && headings.length) {
    headings.forEach((h, i) => {
      if (!h.id || h.id.trim() === '') {
        const s = slug(h.textContent) || `section-${i+1}`;
        // avoid duplicates
        let candidate = s, n = 2;
        while (document.getElementById(candidate)) candidate = `${s}-${n++}`;
        h.id = candidate;
      }
      const li = document.createElement('li');
      const a  = document.createElement('a');
      a.textContent = h.textContent;
      a.href = `#${h.id}`;
      li.appendChild(a);
      tocContainer.appendChild(li);
    });

    const observer = new IntersectionObserver(entries => {
      $$('#case-study-toc li').forEach(l => l.classList.remove('active'));
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length) {
        const last = visible[visible.length - 1];
        const activeLink = tocContainer.querySelector(`a[href="#${last.target.id}"]`);
        if (activeLink) activeLink.parentElement.classList.add('active');
      }
    }, { rootMargin: '-100px 0px -75% 0px' });

    headings.forEach(h => observer.observe(h));
  }

  /* =========================
     5) Share bar (X, LinkedIn, Copy)
     - Uses existing HTML with ids: #share-x, #share-li, #share-copy
     - If share bar is missing, auto-injects it right after the hero figure.
  ========================== */
  (function setupShareBar(){
    let shareBar = $('.share-bar');
    if (!shareBar) {
      // Auto-insert if not present
      const figure = $('.hero-image-container .stylized-frame');
      if (figure && figure.parentElement) {
        shareBar = document.createElement('div');
        shareBar.className = 'share-bar';
        shareBar.setAttribute('role', 'group');
        shareBar.setAttribute('aria-label', 'Share this case study');
        shareBar.innerHTML = `
          <button class="share-btn share-x" id="share-x" type="button" title="Share on X">
            <svg viewBox="0 0 24 24" aria-hidden="true" class="icon"><path d="M18.9 2H21l-6.5 7.4L22 22h-6.8l-4.2-5-4.8 5H3l7-7.7L2 2h6.9l3.8 4.6L18.9 2zm-3 18h1.6L8.2 4H6.6l9.3 16z"/></svg>
            <span class="sr-only">Share on X</span>
          </button>
          <button class="share-btn share-li" id="share-li" type="button" title="Share on LinkedIn">
            <svg viewBox="0 0 24 24" aria-hidden="true" class="icon"><path d="M4.98 3.5C3.87 3.5 3 4.37 3 5.48c0 1.1.87 1.98 1.98 1.98h.02c1.1 0 1.98-.88 1.98-1.98C6.98 4.37 6.1 3.5 4.98 3.5zM3.5 8.75h3v11.75h-3V8.75zM9 8.75h2.88v1.61h.04c.4-.75 1.37-1.54 2.83-1.54 3.03 0 3.59 1.99 3.59 4.58v6.1h-3v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85v5.5H9V8.75z"/></svg>
            <span class="sr-only">Share on LinkedIn</span>
          </button>
          <button class="share-btn share-copy" id="share-copy" type="button" title="Copy link">
            <svg viewBox="0 0 24 24" aria-hidden="true" class="icon"><path d="M3.9 12a4.9 4.9 0 0 1 4.9-4.9h3v2h-3a2.9 2.9 0 0 0 0 5.8h3v2h-3A4.9 4.9 0 0 1 3.9 12Zm6.2 1h3v-2h-3v2Zm5-5h3a4.9 4.9 0 1 1 0 9.8h-3v-2h3a2.9 2.9 0 1 0 0-5.8h-3v-2Z"/></svg>
            <span class="sr-only">Copy link</span>
          </button>
        `;
        figure.insertAdjacentElement('afterend', shareBar);
      }
    }

    const shareX  = $('#share-x');
    const shareLi = $('#share-li');
    const shareCp = $('#share-copy');
    if (!(shareX && shareLi && shareCp)) return;

    const url   = window.location.href;
    const title = document.title || 'Check this out';

  // --- Share helpers ---
function openInNewTab(url) {
  // Opens in a new tab instead of popup
  window.open(url, '_blank');
}

// Example use:
shareX.addEventListener('click', () => {
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  openInNewTab(shareUrl);
});

shareLi.addEventListener('click', () => {
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  openInNewTab(shareUrl);
});


    shareX.addEventListener('click', () => {
      const text = `${title}`;
      const u = 'https://twitter.com/intent/tweet?' +
                `text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      popupShare(u);
    });

    shareLi.addEventListener('click', () => {
      const u = 'https://www.linkedin.com/sharing/share-offsite/?' +
                `url=${encodeURIComponent(url)}`;
      popupShare(u);
    });

    shareCp.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(url);
        const original = shareCp.innerHTML;
        shareCp.classList.add('copied');
        shareCp.innerHTML = '<span class="copied-text">Copied!</span>';
        setTimeout(() => {
          shareCp.classList.remove('copied');
          shareCp.innerHTML = original;
        }, 1200);
      } catch {
        // Fallback for restricted clipboard permissions
        const tmp = document.createElement('input');
        tmp.value = url;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand('copy');
        document.body.removeChild(tmp);
      }
    });

    // Optional native share on long-press/context menu (mobile)
    if (navigator.share) {
      shareBar?.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        navigator.share({ title, url }).catch(() => {});
      });
    }
  })();
});
