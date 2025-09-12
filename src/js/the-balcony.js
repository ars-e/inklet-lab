/* ---------- 5×7 bitmap glyphs ---------- */
const F = {
  "A":[ "01110","10001","10001","11111","10001","10001","10001" ],
  "B":[ "11110","10001","11110","10001","10001","10001","11110" ],
  "C":[ "01111","10000","10000","10000","10000","10000","01111" ],
  "E":[ "11111","10000","11110","10000","10000","10000","11111" ],
  "H":[ "10001","10001","10001","11111","10001","10001","10001" ],
  "L":[ "10000","10000","10000","10000","10000","10000","11111" ],
  "N":[ "10001","11001","10101","10011","10001","10001","10001" ],
  "O":[ "01110","10001","10001","10001","10001","10001","01110" ],
  "T":[ "11111","00100","00100","00100","00100","00100","00100" ],
  "Y":[ "10001","01010","00100","00100","00100","00100","00100" ],
  " ":[ "0","0","0","0","0","0","0" ]
};
const phrase = "THE BALCONY";
const ROWS = 7;

/* --------- canvas / context --------- */
const canvas = document.getElementById('neon');
const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });

/* --------- perf limiter --------- */
let last = 0;
const FRAME_MS = 1000/60; // target 60fps (change to /45 if needed)

/* --------- state --------- */
let S = null;
let glowSprite = null;

/* --------- utilities --------- */
function measure(msg, letterGapCols){
  let cols = 0;
  const letters = [];
  for(const ch of msg){
    const g = F[ch] || F[" "];
    const w = g[0].length;
    letters.push({glyph:g, width:w});
    cols += w + letterGapCols;
  }
  cols -= letterGapCols;
  return {cols, letters};
}

function cssNumber(varName, fallback){
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

/* --- build an offscreen glow sprite once --- */
function makeGlowSprite(r, colors) {
  const off = document.createElement('canvas');
  const pad = Math.ceil(r * 3);
  const size = Math.max(8, Math.floor(r*2 + pad*2));
  off.width = off.height = size;
  const octx = off.getContext('2d', { alpha: true });

  const cx = size/2, cy = size/2;
  const g = octx.createRadialGradient(cx, cy, r*0.2, cx, cy, r*1.8);
  // Add subtle alpha on outer rings; use 8-digit hex by appending "ee"/"00"
  g.addColorStop(0.00, colors.cOn);
  g.addColorStop(0.35, colors.cG1);
  g.addColorStop(0.70, colors.cG2 + "ee");
  g.addColorStop(1.00, colors.cG3 + "00");

  octx.globalCompositeOperation = 'lighter';
  octx.fillStyle = g;
  octx.beginPath();
  octx.arc(cx, cy, r*1.85, 0, Math.PI*2);
  octx.fill();

  // bright core
  octx.fillStyle = colors.cOn;
  octx.beginPath();
  octx.arc(cx, cy, r*0.75, 0, Math.PI*2);
  octx.fill();

  return { canvas: off, pad, r };
}

/* --------- layout --------- */
function buildLayout(){
  const minDot = cssNumber('--dot-min', 8);
  const maxDot = cssNumber('--dot-max', 24);
  const gapXMul = cssNumber('--gap-x', 0.75);
  const gapYMul = cssNumber('--gap-y', 0.85);

  const cssWidth = canvas.clientWidth || canvas.getBoundingClientRect().width || window.innerWidth;
  const vh = window.innerHeight || 640;

  // fewer inter-letter columns on tiny screens
  const letterGapCols = cssWidth < 420 ? 0 : (cssWidth < 560 ? 1 : 2);

  const {cols, letters} = measure(phrase.toUpperCase(), letterGapCols);
  const dpr = window.devicePixelRatio || 1;

  // estimate vertical space available for the canvas after text/buttons
  const reserved = cssWidth < 520 ? 220 : 260;              // px to leave for pretitle/tagline/buttons
  const maxCanvasH = Math.max(160, vh - reserved);          // never let canvas area be negative

  // dot size that fits by width
  const dotFitW = Math.floor((cssWidth * dpr) / (cols + gapXMul*(cols-1)));
  // dot size that fits by height
  const dotFitH = Math.floor((maxCanvasH * dpr) / (ROWS + gapYMul*(ROWS-1) + 2));

  // choose the smaller -> guarantees it fits both axes
  let dot = Math.min(dotFitW, dotFitH, maxDot);
  dot = Math.max(2 * dpr, dot);                             // hard floor for visibility

  const gapX = Math.round(dot * gapXMul);
  const gapY = Math.round(dot * gapYMul);

  // compute desired backing store size
  let width  = Math.max(1, Math.round(cssWidth * dpr));
  let height = Math.round(ROWS * dot + (ROWS-1) * gapY + 2*dot);

  // Hard caps to play nice with Chrome's rasterizer
  const MAX_W = 2600;
  const MAX_H = 1600;
  width  = Math.min(width, MAX_W);
  height = Math.min(height, MAX_H);

  canvas.width  = width;
  canvas.height = height;
  canvas.style.height = `${Math.round(height / dpr)}px`;

  // map bulbs
  const bulbs = [];
  let colOffset = 0, letterIdx = 0;

  letters.forEach(({glyph, width:w})=>{
    const baseDelay = letterIdx * 280;
    let k = 0;
    for(let r=0;r<ROWS;r++){
      for(let c=0;c<w;c++){
        if(glyph[r][c] === '1'){
          const x = dot/2 + (colOffset + c) * (dot + gapX);
          const y = dot/2 + r * (dot + gapY) + dot;
          const jitter = Math.random()*20;
          const reveal = baseDelay + k*35 + jitter;
          const phase = Math.random()*Math.PI*2;
          bulbs.push({x,y,reveal,phase});
          k++;
        }
      }
    }
    colOffset += w + letterGapCols;
    letterIdx++;
  });

  const cs  = getComputedStyle(document.documentElement);
  const cOn =  cs.getPropertyValue('--on').trim()   || '#0b5fff';
  const cG1 = cs.getPropertyValue('--glow1').trim() || '#7fb0ff';
  const cG2 = cs.getPropertyValue('--glow2').trim() || '#3c86ff';
  const cG3 = cs.getPropertyValue('--glow3').trim() || '#1a4dff';

  const maxReveal = bulbs.reduce((m,b)=>Math.max(m,b.reveal),0);

  S = {dpr, dot, gapX, gapY, width, height, bulbs, maxReveal,
       colors:{cOn,cG1,cG2,cG3}, taglineShown:false};

  // build/update the glow sprite for this dot size
  const r = Math.max(2, Math.round(S.dot/2));
  glowSprite = makeGlowSprite(r, S.colors);
}

/* --------- animation --------- */
let startTime = 0;
function drawFrame(now){
  if (!startTime) startTime = now;
  if (now - last < FRAME_MS) { requestAnimationFrame(drawFrame); return; }
  last = now;

  const t = now - startTime; // ms

  if (!S.taglineShown && t > S.maxReveal + 400) {
    document.querySelector('.tagline').classList.add('show');
    S.taglineShown = true;

    setTimeout(()=> {
      document.querySelector('.comingsoon').classList.add('show');
      setTimeout(()=> {
        document.querySelector('.homebtn').classList.add('show');
      }, 700);
    }, 800);
  }

  const {bulbs} = S;
  const img = glowSprite.canvas;
  const r   = glowSprite.r;

  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.globalCompositeOperation = 'lighter';

  for (const b of bulbs) {
    if (t < b.reveal) continue;
    const pulse = 1 + 0.015 * Math.sin((t/1000)*Math.PI*2/2.2 + b.phase);
    const s = (r*2 + glowSprite.pad*2) * pulse;
    const x = b.x - s/2;
    const y = b.y - s/2;
    ctx.globalAlpha = 0.95;
    ctx.drawImage(img, x, y, s, s);
  }
  ctx.globalAlpha = 1;

  requestAnimationFrame(drawFrame);
}

/* --------- mount / resize --------- */
function mount(){
  buildLayout();
  startTime = 0;

  const pre = document.querySelector('.pretitle');
  if (pre){
    pre.classList.remove('show');
    void pre.offsetWidth;
    pre.classList.add('show');
  }

  setTimeout(()=> requestAnimationFrame(drawFrame), 650);
}

let resizeT;
window.addEventListener('resize', ()=>{
  clearTimeout(resizeT);
  resizeT = setTimeout(mount, 80);
}, {passive:true});

mount();