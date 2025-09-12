document.addEventListener('DOMContentLoaded', () => {

    // Set footer year
    document.getElementById('footer-year').textContent = new Date().getFullYear();

    // --- Custom Cursor Logic ---
    const cursorDot = document.querySelector('.cursor-dot');
    const interactiveElements = document.querySelectorAll('a, button');

    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorDot.classList.add('grow'));
        el.addEventListener('mouseleave', () => cursorDot.classList.remove('grow'));
    });

    // === NAV color-pop on hover/focus ===
    const navLinks = document.querySelectorAll('.vertical-nav-list a');
    const popPalette = ['#ff4d4f', '#ffb703', '#3dd5f3', '#22c55e', '#ec4899', '#60a5fa'];

    function setRandomPopColor(el) {
        const c = popPalette[Math.floor(Math.random() * popPalette.length)];
        el.style.setProperty('--pop-color', c);
    }

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => setRandomPopColor(link));
        link.addEventListener('focus', () => setRandomPopColor(link)); // for keyboard nav
    });

    // --- Case Study ToC Logic ---
  const tocContainer = document.getElementById('case-study-toc');
  const headings = Array.from(document.querySelectorAll('.content-main h2'));

  if (tocContainer && headings.length) {
    headings.forEach(h => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = h.textContent;
      a.href = `#${h.id}`;
      li.appendChild(a);
      tocContainer.appendChild(li);
    });

    const observer = new IntersectionObserver(entries => {
      tocContainer.querySelectorAll('li').forEach(l => l.classList.remove('active'));
      const visibleHeadings = entries.filter(e => e.isIntersecting);
      if (visibleHeadings.length > 0) {
        const lastVisibleHeading = visibleHeadings[visibleHeadings.length - 1];
        const activeLink = tocContainer.querySelector(`a[href="#${lastVisibleHeading.target.id}"]`);
        if (activeLink) {
          activeLink.parentElement.classList.add('active');
        }
      }
    }, { rootMargin: '-100px 0px -75% 0px' });

    headings.forEach(h => observer.observe(h));
  }
  
});