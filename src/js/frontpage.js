    /* ===============================
       Utilities
    =============================== */
    const $ = sel => document.querySelector(sel);
    const toDate = s => (s ? new Date(s) : new Date(0));

    // Prefer summary -> deck -> description -> excerpt -> tags
    const textFrom = (o = {}) => {
      const tags = Array.isArray(o.tags)
        ? o.tags
        : (typeof o.tags === 'string' ? o.tags.split(',').map(s => s.trim()) : []);
      if (tags && tags.length) return tags.slice(0, 3).join(' • ');
      return o.summary || o.deck || o.description || o.excerpt || '';
    };

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
      href: p.url || `projects/${p.slug}.html`,
      date: toDate(p.date),
      type: 'project'
    }));

    const mapLab = (arr = []) => arr.map(x => ({
      title: `Lab: ${x.title}`,
      blurb: textFrom(x),
      href: x.url || `lab/${x.slug}.html`,
      date: toDate(x.date),
      type: 'lab'
    }));

    const mapVideos = (arr = []) => arr.map(v => ({
      title: ((v.type || 'video').toLowerCase() === 'podcast' ? 'Podcast: ' : 'Video: ') + v.title,
      blurb: textFrom(v) || 'Watch/Listen',
      href: v.url,
      date: toDate(v.date),
      type: 'video'
    }));

    function setPanel(id, item){
      const el = document.getElementById(id);
      if (!el) return;
      if (!item){ el.remove(); return; } // hide unused tiles when < 4 items
      el.href = item.href || '#';
      el.querySelector('h3').textContent = item.title || '';
      el.querySelector('p').textContent  = item.blurb || '';
    }

    // Robust JSON fetch helper with fallback to []
    async function getJSON(url){
      try{
        const r = await fetch(url, { credentials: 'same-origin' });
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
        // reflow
        void el.offsetWidth;
        el.style.animation = `typingPX var(--tw-speed) steps(${steps}, end) var(--tw-delay) 1 both`;
      }

      run();
      addEventListener('resize', run, { passive:true });
      document.addEventListener('visibilitychange', () => { if (!document.hidden) run(); });
    })();

    /* ===============================
       Load newest 4 tiles
    =============================== */
    async function loadNewest4(){
      const [dispatch, projects, lab, videos] = await Promise.all([
        getJSON('./data/dispatch.json'),
        getJSON('./data/projects.json'),
        getJSON('./data/lab.json'),
        getJSON('./data/videos.json')
      ]);

      const all = [
        ...mapDispatch(dispatch || []),
        ...mapProjects(projects || []),
        ...mapLab(lab || []),
        ...mapVideos(videos || [])
      ]
      .filter(x => x.date && x.date.getTime() > 0)
      .sort((a, b) => b.date - a.date);

      const [a, b, c, d] = all;

      setPanel('p1', a);
      setPanel('p2', b);
      setPanel('p3', c);
      setPanel('p4', d);

      // NEW burst + last updated
      const burst = document.getElementById('burst1');
      if (burst && a) burst.hidden = false;

      const last = document.getElementById('lastUpdated');
      if (last && a){
        last.textContent = `Last updated: ${a.date.toLocaleDateString('en-IN', {
          day:'2-digit', month:'short', year:'numeric'
        })}`;
      }else if (last){
        last.textContent = 'No recent items found.';
      }
    }

    // Run once; schedule an idle refresh if available
    loadNewest4();
    if ('requestIdleCallback' in window){
      requestIdleCallback(loadNewest4, { timeout: 1200 });
    }