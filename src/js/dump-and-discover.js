/* Right-rail scroll-spy */
const links=[...document.querySelectorAll('.railnav a[data-target]')];
const map=new Map(links.map(a=>[a.dataset.target, a]));
const sections=[...document.querySelectorAll('#explore,#submit,#how,#about,#faq')];
const obs=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ links.forEach(l=>l.classList.remove('active')); const id=entry.target.id; if(map.has(id)) map.get(id).classList.add('active'); }
  });
},{rootMargin:'-30% 0px -60% 0px'}); sections.forEach(s=>obs.observe(s));

/* Submit form bits */
const title = document.getElementById('title'), titleCount = document.getElementById('titleCount');
title?.addEventListener('input',()=>titleCount.textContent=`${title.value.length} / ${title.maxLength}`);
const tldr = document.getElementById('tldr'), tldrCount = document.getElementById('tldrCount');
tldr?.addEventListener('input',()=>tldrCount.textContent=`${tldr.value.length} / ${tldr.maxLength}`);
const STAGES=['Half-baked','Semi-baked','Baked'];
const stageRange = document.getElementById('stageRange'), stageLabel = document.getElementById('stageLabel');
stageRange?.addEventListener('input',()=>stageLabel.textContent=`Stage: ${STAGES[+stageRange.value]}`); stageLabel&&(stageLabel.textContent=`Stage: ${STAGES[+stageRange.value]}`);

function makeSelectable(container){ container?.addEventListener('click',e=>{ if(e.target.classList.contains('badge')) e.target.classList.toggle('selected'); });}
makeSelectable(document.getElementById('cats')); makeSelectable(document.getElementById('skills'));

const drop = document.getElementById('drop'), fileInput = document.getElementById('file'), preview = document.getElementById('preview');
function addFiles(files){ [...files].forEach(f=>{ if(!f.type.startsWith('image/')) return; const img=document.createElement('img'); img.src=URL.createObjectURL(f); preview.appendChild(img);});}
drop?.addEventListener('dragover',e=>{e.preventDefault(); drop.classList.add('drag');});
drop?.addEventListener('dragleave',()=>drop.classList.remove('drag'));
drop?.addEventListener('drop',e=>{e.preventDefault(); drop.classList.remove('drag'); addFiles(e.dataTransfer.files);});
fileInput?.addEventListener('change',e=>addFiles(e.target.files));

/* Generate Card */
const wall = document.getElementById('wall');
document.getElementById('genCard')?.addEventListener('click', ()=>{
  const titleVal = (title.value.trim()||'Untitled spark').replace(/</g,'&lt;');
  const stageVal = STAGES[+stageRange.value];
  const tldrVal  = (tldr.value.trim()||'No description yet.').replace(/</g,'&lt;');
  const cats = [...document.querySelectorAll('#cats .badge.selected')].map(b=>b.textContent);
  const skills = [...document.querySelectorAll('#skills .badge.selected')].map(b=>b.textContent);
  const tags = (document.getElementById('tags').value||'').split(',').map(s=>s.trim()).filter(Boolean);
  const contact = document.getElementById('contact').value.trim() || 'no-contact';

  const card = document.createElement('article');
  card.className='card';
  card.dataset.stage = stageVal;
  card.dataset.cats = cats.join(',');
  card.dataset.skills = skills.join(',');
  card.dataset.contact = contact;
  card.innerHTML = `
    <div class="stage">Stage: ${stageVal}</div>
    <h3>${titleVal}</h3>
    <div>${[...cats, ...tags].slice(0,6).map(t=>`<span class="tag">${t}</span>`).join(' ')}</div>
    <p>${tldrVal}</p>
    <div class="cta-row">
      <a class="pill like" href="#">Like</a>
      <a class="pill pass" href="#">Pass</a>
      <a class="pill dm" href="#" data-title="${titleVal}">DM</a>
    </div>`;
  wall.prepend(card);
  location.hash = '#explore';
  wireDM(card); // DM for new card
});

/* Reset form */
document.getElementById('resetForm')?.addEventListener('click', ()=>{
  document.querySelectorAll('.badge.selected').forEach(b=>b.classList.remove('selected'));
  title.value=''; title.dispatchEvent(new Event('input'));
  tldr.value='';  tldr.dispatchEvent(new Event('input'));
  document.getElementById('contact').value=''; document.getElementById('tags').value='';
  stageRange.value=0; stageRange.dispatchEvent(new Event('input'));
  preview.innerHTML='';
});

/* Explore filters */
const fStage = document.getElementById('fStage');
const fSearch = document.getElementById('fSearch');
const fClear = document.getElementById('fClear');
const chips = [...document.querySelectorAll('.chip[data-cat], .chip[data-skill]')];
chips.forEach(ch=>ch.addEventListener('click', ()=>{ ch.classList.toggle('on'); applyFilters(); }));
[fStage, fSearch].forEach(el=>el?.addEventListener('input', applyFilters));
fClear?.addEventListener('click', ()=>{ fStage.value=''; fSearch.value=''; chips.forEach(c=>c.classList.remove('on')); applyFilters(); });

function applyFilters(){
  const stage = fStage?.value || '';
  const query = (fSearch?.value || '').trim().toLowerCase();
  const needCats = chips.filter(c=>c.dataset.cat && c.classList.contains('on')).map(c=>c.dataset.cat);
  const needSkills = chips.filter(c=>c.dataset.skill && c.classList.contains('on')).map(c=>c.dataset.skill);

  document.querySelectorAll('.card').forEach(card=>{
    const cStage = (card.dataset.stage||'').toLowerCase();
    const cCats = (card.dataset.cats||'').split(',').map(s=>s.trim());
    const cSkills = (card.dataset.skills||'').split(',').map(s=>s.trim());
    const text = (card.textContent||'').toLowerCase();
    const okStage = !stage || cStage.includes(stage.toLowerCase());
    const okCats = needCats.every(x=>cCats.includes(x));
    const okSkills = needSkills.every(x=>cSkills.includes(x));
    const okSearch = !query || text.includes(query);
    card.style.display = (okStage && okCats && okSkills && okSearch) ? '' : 'none';
  });
}
applyFilters();

/* DM modal */
const modal = document.getElementById('dmModal');
const dmTitle = document.getElementById('dmProject');
const dmTo = document.getElementById('dmTo');
const dmMsg = document.getElementById('dmMessage');
const dmClose = document.getElementById('dmClose');
const dmSend = document.getElementById('dmSend');

function openModal(project, to){ dmTitle.textContent = project||'—'; dmTo.textContent = to||'no-contact'; dmMsg.value=''; modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); }
function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }

function wireDM(scope=document){
  scope.querySelectorAll('.pill.dm').forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.preventDefault();
      const card = btn.closest('.card');
      openModal(btn.dataset.title || card.querySelector('h3')?.textContent.trim(), card.dataset.contact || 'no-contact');
    });
  });
}
wireDM();
dmClose.addEventListener('click', closeModal);
modal.addEventListener('click', e=>{ if(e.target===modal) closeModal(); });
dmSend.addEventListener('click', ()=>{ closeModal(); alert('Demo: message queued to ' + dmTo.textContent); });

/* ENTRY GATE logic — always show on refresh */
const gate = document.getElementById('gate');
const enterBtn = document.getElementById('gateEnter');
const skipBtn = document.getElementById('gateSkip');

function closeGate(){
  gate.classList.remove('open');
  gate.setAttribute('aria-hidden','true');
  document.body.classList.remove('gated');
}

enterBtn.addEventListener('click', closeGate);
skipBtn.addEventListener('click', closeGate);

// Optional dev bypass: add ?gate=0 to the URL to skip the gate once
if (new URLSearchParams(location.search).get('gate') === '0') closeGate();
