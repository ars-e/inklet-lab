document.addEventListener('DOMContentLoaded', () => {
  // === Filtering + Pagination ===
  const searchInput = document.getElementById('search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const allProjectCards = Array.from(document.querySelectorAll('.project-card'));
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const pageInfo = document.getElementById('page-info');

  let currentPage = 1;
  const itemsPerPage = 4;
  let filteredCards = allProjectCards;

  function displayPage() {
    const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
    pageInfo.textContent = `PAGE ${currentPage} / ${totalPages || 1}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    allProjectCards.forEach(card => card.classList.add('hidden'));
    filteredCards.slice(start, end).forEach(card => card.classList.remove('hidden'));
  }

  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

    filteredCards = allProjectCards.filter(card => {
      const title = (card.dataset.title || "").toLowerCase();
      let tags = [];
      try { tags = JSON.parse(card.dataset.tags); } catch (e) {}
      const titleMatch = title.includes(searchTerm);
      const filterMatch =
        activeFilter === 'all' ||
        tags.includes(activeFilter) ||
        tags.some(tag => tag.toLowerCase().includes(activeFilter));
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

  applyFilters();

  // === Footer year ===
  const footerYear = document.getElementById('footer-year');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  // === Custom Cursor ===
  const cursorDot = document.querySelector('.cursor-dot');
  if (cursorDot) {
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
      cursorDot.style.opacity = "1"; // ensure visible
    });

    const interactiveElements = document.querySelectorAll('a, button, .project-card, .filter-btn, .cta-btn');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursorDot.classList.add('grow'));
      el.addEventListener('mouseleave', () => cursorDot.classList.remove('grow'));
    });
  }
});

// === Nav hover/focus pop colors (outside DOMContentLoaded is fine too) ===
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.vertical-nav-list a');
  const popPalette = ['#ff4d4f', '#ffb703', '#3dd5f3', '#22c55e', '#ec4899', '#60a5fa'];

  function setRandomPopColor(el) {
    const c = popPalette[Math.floor(Math.random() * popPalette.length)];
    el.style.setProperty('--pop-color', c);
  }

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => setRandomPopColor(link));
    link.addEventListener('focus', () => setRandomPopColor(link));
  });
});
