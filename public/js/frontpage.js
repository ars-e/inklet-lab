/* ===============================
   Utilities
=============================== */
const $ = sel => document.querySelector(sel);
const toDate = s => (s ? new Date(s) : new Date(0));
const safeTime = (x) => {
  const t = x ? new Date(x).getTime() : 0;
  return Number.isFinite(t) ? t : 0;
};

// Prefer dek -> summary -> deck -> description -> excerpt (NO TAGS)
const textFrom = (o = {}) =>
  o.dek || o.summary || o.deck || o.description || o.excerpt || "";

// soft cap so long deks don’t overflow card height on small screens
const truncate = (s = "", n = 180) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

/* ---------- Mappers ---------- */
const mapDispatch = (arr = []) => arr.map(a => ({
  title: a.title,
  blurb: textFrom(a),
  href: `articles/${a.slug}/`,
  date: toDate(a.date),
  type: 'post'
}));

const mapProjects = (arr = []) => arr.map(p => ({
  title: p.title,
  blurb: textFrom(p),
  href: p.url || `projects/${p.slug}/`,
  date: toDate(p.date),
  type: 'project'
}));

function setPanel(id, item){
  const el = document.getElementById(id);
  if (!el) return;
  if (!item){ el.remove(); return; } // hide tile if no item
  el.href = item.href || '#';
  el.target = '_blank';
  el.rel = 'noopener noreferrer';
  el.querySelector('h3').textContent = item.title || '';
  el.querySelector('p').textContent  = truncate(item.blurb || '');
}

// Fetch helper with cache-buster (dev)
async function getJSON(url){
  try{
    const r = await fetch(`${url}?v=${Date.now()}`, { credentials: 'same-origin' });
    if (!r.ok) return [];
    return await r.json();
  }catch{
    return [];
  }
}

/* ===============================
   Year
=============================== */
$('#year').textContent = new Date().getFullYear();

/* ===============================
   Hero Typewriter (mobile-safe)
=============================== */
(function specialEliteTypewriter(){
  const el = document.getElementById('heroTitle');
  if (!el) return;

  const mq = matchMedia('(max-width:480px)');
  const rm = matchMedia('(prefers-reduced-motion: reduce)');

  function run(){
    if (mq.matches || rm.matches){
      el.style.animation = 'none';
      el.style.width = 'auto';
      return;
    }
    const steps = el.textContent.length;
    const fullWidth = Math.ceil(el.scrollWidth) + 'px';

    el.style.setProperty('--tw-steps', steps);
    el.style.setProperty('--tw-target-px', fullWidth);

    // restart animation
    el.style.animation = 'none';
    void el.offsetWidth; // reflow
    el.style.animation = `typingPX var(--tw-speed) steps(${steps}, end) var(--tw-delay) 1 both`;
  }

  run();
  addEventListener('resize', run, { passive:true });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) run(); });
})();

/* ===============================
   Load newest tiles (1–4)
=============================== */
async function loadNewest(){
  const [dispatch, projects] = await Promise.all([
    getJSON('./data/dispatch.json'),
    getJSON('./data/projects.json')
  ]);

  const all = [
    ...mapDispatch(dispatch || []),
    ...mapProjects(projects || [])
  ].sort((a, b) => safeTime(b.date) - safeTime(a.date));

  const tiles = [all[0], all[1], all[2], all[3]]; // show up to 4 if available
  setPanel('p1', tiles[0]);
  setPanel('p2', tiles[1]);
  setPanel('p3', tiles[2]);
  setPanel('p4', tiles[3]);

  const burst = document.getElementById('burst1');
  if (burst && tiles[0]) burst.hidden = false;

  const last = document.getElementById('lastUpdated');
  if (last && tiles[0]){
    last.textContent = `Last updated: ${tiles[0].date.toLocaleDateString('en-IN', {
      day:'2-digit', month:'short', year:'numeric'
    })}`;
  }else if (last){
    last.textContent = 'No recent items found.';
  }

  // debug
  console.log('[Frontpage]', {
    dispatchCount: (dispatch || []).length,
    projectsCount: (projects || []).length,
    rendered: tiles.filter(Boolean).length,
    top: tiles
  });
}

// Run once; schedule idle refresh if available
loadNewest();
if ('requestIdleCallback' in window){
  requestIdleCallback(loadNewest, { timeout: 1200 });
}

/* ===============================
   Guide toggle + contact copy
=============================== */
(function guideAndContact(){
  const btn = document.getElementById('toggleGuide');
  const list = document.getElementById('guideList');
  if (btn && list){
    const toggle = () => {
      const open = list.hasAttribute('hidden') ? false : true;
      if (open){ list.setAttribute('hidden',''); btn.setAttribute('aria-expanded','false'); }
      else { list.removeAttribute('hidden'); btn.setAttribute('aria-expanded','true'); }
    };
    btn.addEventListener('click', toggle, { passive:true });
    // Keyboard: '?' toggles guide
    addEventListener('keydown', (e) => {
      if (e.key === '?') toggle();
    });
  }

  const email = document.getElementById('emailCopy');
  if (email){
    email.addEventListener('click', async () => {
      try{
        await navigator.clipboard.writeText(email.textContent.trim());
        email.classList.add('copied');
        email.title = 'Copied!';
        setTimeout(() => { email.classList.remove('copied'); email.title = 'Click to copy'; }, 1600);
      }catch{}
    });
    // Keyboard: 'c' copies email (when hero is visible)
    addEventListener('keydown', async (e) => {
      if (e.key.toLowerCase() === 'c'){
        try{
          await navigator.clipboard.writeText(email.textContent.trim());
          email.classList.add('copied');
          setTimeout(() => email.classList.remove('copied'), 1200);
        }catch{}
      }
    });
  }
})();

