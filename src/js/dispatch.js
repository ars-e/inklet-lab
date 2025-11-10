// dispatch.js — consolidated, stable

(() => {
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // Year
  const yEl = $('#y');
  if (yEl) yEl.textContent = new Date().getFullYear();

  // Essentials
  const chipsWrap   = $("#chips");
  const searchInput = $('.filters input[type="search"]');
  const sortSel     = $("#sortSel");
  const resCount    = $("#resCount");
  const emptyState  = $("#emptyState");
  const grid        = $(".grid");
  if (!chipsWrap || !searchInput || !sortSel || !resCount || !grid) return;

  const cards = $$(".grid .card");
  const originalOrder = [...cards]; // for "Recent" (initial DOM order)

  // Helpers
  const titleCase = s => s.replace(/(^|\s|-|_)\w/g, m => m.toUpperCase());
  const fullText  = el => `${el.dataset.title || ""} ${(el.querySelector(".meta")?.textContent || "")}`.toLowerCase();

  // Discover categories from cards
  const categories = Array.from(new Set(
    cards.map(c => (c.dataset.type || "").trim()).filter(Boolean)
  )).sort();

  // State
  const state = { type: "all", q: "", sort: "recent" };

  // Build chips
  function makeChip(val, label, active=false){
    const a = document.createElement("a");
    a.className = "chip" + (active ? " active" : "");
    a.href = "#";
    a.dataset.type = val;
    a.textContent = label;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      state.type = val;
      $$(".chip", chipsWrap).forEach(c => c.classList.toggle("active", c === a));
      apply();
    });
    return a;
  }
  chipsWrap.appendChild(makeChip("all", "All", true));
  categories.forEach(cat => chipsWrap.appendChild(makeChip(cat, titleCase(cat))));

  // Sorting
  function sortCards() {
    if (state.sort === "recent") {
      originalOrder.forEach(c => grid.appendChild(c));
      return;
    }
    const sorted = [...cards].sort((a,b) =>
      (a.dataset.title || "").localeCompare(b.dataset.title || "", undefined, { sensitivity: "base" })
    );
    sorted.forEach(c => grid.appendChild(c));
  }

  // Filter + render + count
  function apply() {
    sortCards();
    let visible = 0;
    const q = state.q;

    cards.forEach(card => {
      const catOK    = state.type === "all" || (card.dataset.type === state.type);
      const searchOK = !q || fullText(card).includes(q);
      const show = catOK && searchOK;
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });

    resCount.textContent = `(${visible})`;
    if (emptyState) emptyState.style.display = visible ? "none" : "";
  }

  // Wire inputs
  searchInput.addEventListener("input", (e) => { state.q = e.target.value.trim().toLowerCase(); apply(); });
  sortSel.addEventListener("change", (e) => { state.sort = e.target.value; apply(); });

  // Make cards fully clickable + keyboard friendly
  cards.forEach(card => {
    const href = card.getAttribute('data-href');
    if (!href) return;
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // let inner links work
      window.location.assign(href);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.assign(href);
      }
    });
  });

  // First paint
  apply();

  // Back to top (keep your existing button)
  const toTop = $("#toTop");
  if (toTop) {
    window.addEventListener('scroll', ()=>{
      const y = window.scrollY || document.documentElement.scrollTop;
      toTop.classList.toggle('show', y > 600);
    });
    toTop.addEventListener('click', ()=> window.scrollTo({ top:0, behavior:'smooth' }));
  }
})();
