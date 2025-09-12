// Year
  document.getElementById('y').textContent = new Date().getFullYear();

  // ---- Filters / search / sort / length (+ pagination) ----
  const searchInput = document.querySelector('.filters input[type="search"]');
  const chips = document.querySelectorAll('.filters .chip');
  const cards = [...document.querySelectorAll('.card')];
  const sortSel = document.getElementById('sortSel');
  const lenSel  = document.getElementById('lenSel');
  const resCount = document.getElementById('resCount');
  const emptyState = document.getElementById('emptyState');
  const grid = document.querySelector('.grid');

  // Create a Prev/Next pager (inline styles so it works without extra CSS)
  let pager = document.getElementById('pager');
  let prevBtn, nextBtn, pageLabel;
  (function ensurePager(){
    if (!pager) {
      pager = document.createElement('div');
      pager.id = 'pager';
      pager.style.display = 'flex';
      pager.style.alignItems = 'center';
      pager.style.justifyContent = 'center';
      pager.style.gap = '.6rem';
      pager.style.margin = '1.25rem auto 0';

      prevBtn = document.createElement('button');
      nextBtn = document.createElement('button');
      pageLabel = document.createElement('span');

      [prevBtn, nextBtn].forEach((b, i) => {
        b.type = 'button';
        b.textContent = i ? '›' : '‹';                 // ‹ › glyphs
        b.setAttribute('aria-label', i ? 'Next page' : 'Previous page');
        b.style.fontWeight = '800';
        b.style.fontFamily = 'Libre Franklin, system-ui, sans-serif';
        b.style.fontSize = '1rem';
        b.style.padding = '.5rem .8rem';
        b.style.border = '2px solid #00000022';
        b.style.borderRadius = '999px';
        b.style.background = '#fff';
        b.style.cursor = 'pointer';
        b.style.boxShadow = '0 8px 18px rgba(0,0,0,.08)';
        b.disabled = false;
      });

      pageLabel.style.fontFamily = 'Fira Code, ui-monospace, monospace';
      pageLabel.style.fontWeight = '700';
      pageLabel.style.opacity = '.8';

      pager.appendChild(prevBtn);
      pager.appendChild(pageLabel);
      pager.appendChild(nextBtn);

      // place after grid
      grid.parentElement.appendChild(pager);
    } else {
      prevBtn = pager.querySelector('button:first-child');
      pageLabel = pager.querySelector('span');
      nextBtn = pager.querySelector('button:last-child');
    }
  })();

  // Disabled style helper
  function setDisabled(btn, isDisabled){
    btn.disabled = isDisabled;
    btn.style.opacity = isDisabled ? '.45' : '1';
    btn.style.cursor  = isDisabled ? 'not-allowed' : 'pointer';
  }

  let activeType = 'all';
  let query = '';
  const BATCH = 2; // items per page
  let page = 1;    // 1-based
  let totalPages = 1;

  function parseMins(card){
    const m = card.querySelector('.meta')?.textContent.match(/(\d+)\s*min/);
    return m ? +m[1] : 9;
  }

  // Compute filtered cards (no pagination yet) + sort
  function computeFiltered(){
    const len = lenSel.value;
    const list = cards.filter(card=>{
      const matchesType  = (activeType === 'all') || (card.dataset.type === activeType);
      const matchesQuery = card.dataset.title.toLowerCase().includes(query);
      const mins = parseMins(card);
      const matchesLen = (len==='all') || (len==='short' ? mins<=6 : mins>=7);
      return matchesType && matchesQuery && matchesLen;
    });

    if (sortSel.value === 'alpha'){
      list.sort((a,b)=> a.dataset.title.localeCompare(b.dataset.title));
    }
    return list;
  }

  // Render respecting pagination
  function render(){
    // hide all first
    cards.forEach(c => c.style.display = 'none');

    const filtered = computeFiltered();

    // maintain DOM order for tab/focus
    filtered.forEach(el => grid.appendChild(el));

    // pagination math
    totalPages = Math.max(1, Math.ceil(filtered.length / BATCH));
    if (page > totalPages) page = totalPages;
    const start = (page - 1) * BATCH;
    const end   = start + BATCH;

    const pageSlice = filtered.slice(start, end);
    pageSlice.forEach(c => c.style.display = '');

    // counts + states
    const total = filtered.length;
    const shown = pageSlice.length;
    resCount.textContent = `(${shown}${total ? ' / ' + total : ''})`;
    emptyState.style.display = total === 0 ? '' : 'none';

    // pager visibility + state
    pager.style.display = total > BATCH ? 'flex' : 'none';
    pageLabel.textContent = `${page} / ${totalPages}`;
    setDisabled(prevBtn, page <= 1);
    setDisabled(nextBtn, page >= totalPages);
  }

  function resetAndRender(){
    page = 1;
    render();
  }

  // chip clicks
  chips.forEach(chip=>{
    chip.addEventListener('click', (e)=>{
      e.preventDefault();
      chips.forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      activeType = chip.dataset.type || 'all';
      resetAndRender();
      if (window.closeMenu) window.closeMenu();
    });
  });

  // search
  searchInput.addEventListener('input', (e)=>{
    query = e.target.value.trim().toLowerCase();
    resetAndRender();
  });

  sortSel.addEventListener('change', resetAndRender);
  lenSel.addEventListener('change', resetAndRender);

  // Pager actions
  prevBtn.addEventListener('click', ()=>{
    if (page > 1){ page--; render(); }
  });
  nextBtn.addEventListener('click', ()=>{
    if (page < totalPages){ page++; render(); }
  });

  // Keyboard shortcuts: ← / →
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'ArrowLeft' && page > 1){ page--; render(); }
    if (e.key === 'ArrowRight' && page < totalPages){ page++; render(); }
  });

  // Initial paint
  resetAndRender();

  // Back to top
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY || document.documentElement.scrollTop;
    toTop.classList.toggle('show', y > 600);
  });
  toTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

  // --- Chips: keep only the first N visible; rest go to "More" ---
  (function () {
    const MAX_VISIBLE = 5;
    const row   = document.getElementById('chips');
    const more  = document.getElementById('chipsMore');
    const menu  = document.getElementById('chipsMenu');
    const wrap  = document.getElementById('chipsWrap');
    if (!row || !more || !menu || !wrap) return;

    function layoutChipsFixed() {
      const all = [...row.querySelectorAll('.chip'), ...menu.querySelectorAll('.chip')];
      all.forEach(ch => row.appendChild(ch)); // reset
      const vis = [...row.querySelectorAll('.chip')];
      vis.slice(MAX_VISIBLE).forEach(ch => menu.appendChild(ch));
      more.style.display = menu.children.length ? 'inline-flex' : 'none';
      if (!menu.children.length) closeMenu();
    }

    function promoteChip(chip) {
      if (!menu.contains(chip)) return;
      const slots = row.querySelectorAll('.chip');
      const lastVisible = slots[MAX_VISIBLE - 1];
      if (lastVisible) menu.appendChild(lastVisible);
      row.insertBefore(chip, row.children[MAX_VISIBLE - 1] || null);
      layoutChipsFixed();
      closeMenu();
      resetAndRender();
    }

    function flipIfOverflow() {
      menu.classList.remove('align-right');
      requestAnimationFrame(() => {
        const r = menu.getBoundingClientRect();
        if (r.right > window.innerWidth - 12) {
          menu.classList.add('align-right');
        }
      });
    }

    function openMenu() {
      if (!menu.children.length) return;
      menu.classList.add('open');
      more.setAttribute('aria-expanded', 'true');
      flipIfOverflow();
    }
    function closeMenu() {
      menu.classList.remove('open');
      more.setAttribute('aria-expanded', 'false');
    }
    window.closeMenu = closeMenu;

    more.addEventListener('click', (e) => {
      e.preventDefault();
      const willOpen = !menu.classList.contains('open');
      if (willOpen) openMenu(); else closeMenu();
    });

    document.addEventListener('click', (e) => {
      if (wrap.contains(e.target)) return;
      closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    menu.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (chip) promoteChip(chip);
    });

    window.addEventListener('resize', () => {
      layoutChipsFixed();
      closeMenu();
    });

    layoutChipsFixed();
  })();