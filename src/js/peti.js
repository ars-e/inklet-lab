document.addEventListener('DOMContentLoaded', () => {
  // ---------- Elements ----------
  const searchInput = document.getElementById('search-input');
  const allProjectCards = Array.from(document.querySelectorAll('.project-card'));
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const pageInfo = document.getElementById('page-info');
  const filtersWrap = document.getElementById('filters'); // preferred dynamic container

  // ---------- Utils ----------
  const slug = s => (s || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  // ---------- Build filter chips dynamically (if #filters exists) ----------
  let filterBtns; // NodeList later

  if (filtersWrap) {
    // Collect unique tags from cards
    const tagSet = new Set();
    allProjectCards.forEach(card => {
      try {
        const tags = JSON.parse(card.dataset.tags || '[]');
        tags.forEach(t => tagSet.add(t));
      } catch (_) {}
    });

    // Optionally exclude housekeeping tags (edit as needed)
    const EXCLUDE = new Set(['projects']);

    // Helper to create a button
    const makeBtn = (label, value, isActive=false) => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn' + (isActive ? ' active' : '');
      btn.dataset.filter = value;
      btn.textContent = label;
      return btn;
    };

    // Always include "All"
    filtersWrap.appendChild(makeBtn('All', 'all', true));

    // Add one chip per unique tag (sorted)
    [...tagSet]
      .filter(t => !EXCLUDE.has(t))
      .sort((a,b) => a.localeCompare(b))
      .forEach(t => filtersWrap.appendChild(makeBtn(t.toUpperCase(), slug(t))));

    filterBtns = filtersWrap.querySelectorAll('.filter-btn');
  } else {
    // Fallback: use any hard-coded buttons (legacy)
    filterBtns = document.querySelectorAll('.filter-btn');
    // Ensure we have at least one active button
    if (![...filterBtns].some(b => b.classList.contains('active')) && filterBtns[0]) {
      filterBtns[0].classList.add('active');
    }
  }

  // ---------- Filtering + Pagination ----------
  let currentPage = 1;
  const itemsPerPage = 4;
  let filteredCards = allProjectCards;

  function displayPage() {
    const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
    if (pageInfo) pageInfo.textContent = `PAGE ${currentPage} / ${totalPages || 1}`;

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    allProjectCards.forEach(card => card.classList.add('hidden'));
    filteredCards.slice(start, end).forEach(card => card.classList.remove('hidden'));
  }

  function applyFilters() {
    const searchTerm = (searchInput?.value || '').toLowerCase();
    const activeBtn = document.querySelector('.filter-btn.active');
    const activeFilter = activeBtn ? activeBtn.dataset.filter : 'all';

    filteredCards = allProjectCards.filter(card => {
      const title = (card.dataset.title || '').toLowerCase();

      let tags = [];
      try { tags = JSON.parse(card.dataset.tags || '[]'); } catch (_) {}
      const tagSlugs = tags.map(t => slug(t));

      const titleMatch  = title.includes(searchTerm);
      const filterMatch = activeFilter === 'all' || tagSlugs.includes(activeFilter);

      return titleMatch && filterMatch;
    });

    currentPage = 1;
    displayPage();
  }

  searchInput?.addEventListener('input', applyFilters);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  prevBtn?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      displayPage();
    }
  });

  nextBtn?.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      displayPage();
    }
  });

  applyFilters(); // initial render

  // ---------- Footer year ----------
  const footerYear = document.getElementById('footer-year');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  // ---------- Custom Cursor ----------
  const cursorDot = document.querySelector('.cursor-dot');
  if (cursorDot) {
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
      cursorDot.style.opacity = '1';
    });

    const interactiveElements = document.querySelectorAll('a, button, .project-card, .filter-btn, .cta-btn');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursorDot.classList.add('grow'));
      el.addEventListener('mouseleave', () => cursorDot.classList.remove('grow'));
    });
  }

  // ---------- Nav hover/focus pop colors ----------
  const navLinks = document.querySelectorAll('.vertical-nav-list a');
  const popPalette = ['#ff4d4f', '#ffb703', '#3dd5f3', '#22c55e', '#ec4899', '#60a5fa'];
  const setRandomPopColor = el => {
    const c = popPalette[Math.floor(Math.random() * popPalette.length)];
    el.style.setProperty('--pop-color', c);
  };
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => setRandomPopColor(link));
    link.addEventListener('focus', () => setRandomPopColor(link));
  });
});
