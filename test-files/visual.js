/* global registerExperiment, width, height, background, noStroke, stroke, strokeWeight, fill, ellipse, rect, beginShape, endShape, vertex, bezier, push, pop, translate, rotate, radians, color, text, textSize, textAlign, CENTER */

(function() {
  // --- Parameters (with humane defaults) ---
  let P = {
    headTiltA: -10,   // left figure (°)
    headTiltB:  14,   // right figure (°)
    gazeDelta:  12,   // misalignment between gazes (°)
    shoulderSlopeA: 6,
    shoulderSlopeB: -8,
    embraceRadius: 120,
    warmthBloom: 0.55, // 0..1 (maps to radius & intensity)
    palette: 0.65,     // 0..1 (0=cool, 1=warm)
    showGuides: false
  };

  // Utility: map 0..1 to color temps
  function mix(a, b, t){ return a + (b - a) * t; }

  function bgColor() {
    // cool blue → smoky teal as palette warms
    const r = mix(16, 28, P.palette);
    const g = mix(24, 40, P.palette);
    const b = mix(38, 34, P.palette);
    return color(r, g, b);
  }

  function skinWarm() {
    // warm peach
    const r = mix(195, 230, P.palette);
    const g = mix(140, 170, P.palette);
    const b = mix(120, 130, P.palette);
    return color(r, g, b);
  }

  function dressCool() {
    // desaturated cool clothing
    const r = mix(30, 45, P.palette);
    const g = mix(55, 70, P.palette);
    const b = mix(70, 60, P.palette);
    return color(r, g, b);
  }

  function haloColor(alpha=80){
    // warmth bloom color
    const r = 255, g = 140, b = 110;
    return color(r, g, b, alpha);
  }

  // Heuristic label based on geometry
  function classifyMood() {
    const closeness  = 1 - Math.min(1, Math.abs(P.gazeDelta)/30);
    const tenderness = (Math.max(0, -P.headTiltA) + Math.max(0, P.headTiltB)) / 40;
    const wrap       = Math.min(1, P.embraceRadius / 160);
    const warmth     = P.warmthBloom;

    const score = 0.35*closeness + 0.25*tenderness + 0.25*wrap + 0.15*warmth;

    if (score < 0.35) return "calm";
    if (score < 0.55) return "tender";
    if (score < 0.75) return "yearning";
    if (score < 0.92) return "melodramatic";
    return "devotional";
  }

  function drawWarmBloom(cx, cy) {
    const maxR = Math.min(width, height) * (0.25 + 0.35*P.warmthBloom);
    for (let i=8; i>=1; i--) {
      const t = i/8;
      const r = maxR * t;
      const a = 10 + 70*t*t*P.warmthBloom;
      fill(haloColor(a));
      noStroke();
      ellipse(cx, cy, r, r*0.9);
    }
  }

  function drawTorso(x, y, shoulderSlope, facing='left') {
    push();
    translate(x, y);
    // torso block
    noStroke();
    fill(dressCool());
    const w = 160, h = 220;
    rect(-w/2, -h*0.1, w, h, 24);

    // shoulders line (for silhouette feel)
    stroke(255, 20);
    strokeWeight(2);
    const s = radians(shoulderSlope) * (facing==='left'?1:1);
    const y0 = -h*0.1 + 30;
    line(-w/2, y0 + Math.sin(s)*6, w/2, y0 - Math.sin(s)*6);
    pop();
  }

  function drawHead(x, y, tiltDeg, facing='left') {
    push();
    translate(x, y);
    rotate(radians(tiltDeg) * (facing==='left' ? 1 : -1));

    // neck
    noStroke();
    fill(skinWarm());
    rect(-10, 28, 20, 32, 8);

    // head shape
    noStroke();
    fill(skinWarm());
    ellipse(0, 0, 110, 140);

    // eyelid arc (downward = inwardness)
    stroke(0, 40);
    strokeWeight(3);
    noFill();
    const dir = (facing==='left' ? -1 : 1);
    bezier(-28*dir, -4, -10*dir, -8, 10*dir, -8, 28*dir, -4);

    // cheek highlight (subtle warmth)
    noStroke();
    fill(255, 70);
    ellipse(28*dir, 10, 18, 10);

    pop();
  }

  function drawEmbrace(cx, cy, radius, side='left') {
    // simple curve suggesting an arm wrap
    push();
    stroke(skinWarm());
    strokeWeight(10);
    noFill();
    const dir = side==='left' ? -1 : 1;
    bezier(
      cx + dir*40, cy + 10,
      cx + dir*(20+radius*0.25), cy + 30,
      cx + dir*(40+radius*0.65), cy + 50,
      cx + dir*(60+radius),     cy + 30
    );
    pop();
  }

  registerExperiment('geometry-of-longing', {
    notes: [
      "Move a few sliders and watch the scene shift from calm → tender → yearning → melodramatic → devotional.",
      "We only draw silhouettes and warmth—no faces—to isolate the geometry of feeling.",
      "Tiny angles do the heavy lifting: head tilt, gaze misalignment, shoulder slope, and wrap radius."
    ],
    controls: [
      { type:'range', key:'headTiltA', label:'Head Tilt (left)', min:-30, max:30, value:P.headTiltA, step:1 },
      { type:'range', key:'headTiltB', label:'Head Tilt (right)', min:-30, max:30, value:P.headTiltB, step:1 },
      { type:'range', key:'gazeDelta', label:'Gaze Misalignment', min:0, max:30, value:P.gazeDelta, step:1 },
      { type:'range', key:'shoulderSlopeA', label:'Shoulder Slope (left)', min:-20, max:20, value:P.shoulderSlopeA, step:1 },
      { type:'range', key:'shoulderSlopeB', label:'Shoulder Slope (right)', min:-20, max:20, value:P.shoulderSlopeB, step:1 },
      { type:'range', key:'embraceRadius', label:'Embrace Radius', min:40, max:220, value:P.embraceRadius, step:2 },
      { type:'range', key:'warmthBloom', label:'Warmth Bloom', min:0, max:1, value:P.warmthBloom, step:0.01 },
      { type:'range', key:'palette', label:'Warm Palette', min:0, max:1, value:P.palette, step:0.01 },
      { type:'checkbox', key:'guides', label:'Show Guides', value:P.showGuides }
    ],
    onControl: (key, el) => {
      const isCheckbox = el.type === 'checkbox';
      const v = isCheckbox ? el.checked : Number(el.value);
      if (key === 'headTiltA') P.headTiltA = v;
      if (key === 'headTiltB') P.headTiltB = v;
      if (key === 'gazeDelta') P.gazeDelta = v;
      if (key === 'shoulderSlopeA') P.shoulderSlopeA = v;
      if (key === 'shoulderSlopeB') P.shoulderSlopeB = v;
      if (key === 'embraceRadius') P.embraceRadius = v;
      if (key === 'warmthBloom') P.warmthBloom = v;
      if (key === 'palette') P.palette = v;
      if (key === 'guides') P.showGuides = v;
    },
    reset: () => {},
    onResize: () => {},
    draw: () => {
      background(bgColor());

      const cx = width/2, cy = height/2 + 30;

      // warmth bloom around the pair
      drawWarmBloom(cx, cy - 40);

      // torsos
      drawTorso(cx - 90, cy + 30, P.shoulderSlopeA, 'left');
      drawTorso(cx + 90, cy + 30, P.shoulderSlopeB, 'right');

      // heads
      drawHead(cx - 72, cy - 80, P.headTiltA, 'left');
      drawHead(cx + 72, cy - 84, P.headTiltB, 'right');

      // embrace curves
      drawEmbrace(cx - 20, cy + 10, P.embraceRadius, 'right');
      drawEmbrace(cx + 20, cy + 6,  P.embraceRadius*0.6, 'left');

      // (optional) gaze hint as tiny arcs (using gazeDelta only for label)
      if (P.showGuides) {
        push();
        stroke(255, 40); strokeWeight(2); noFill();
        const r = 40;
        translate(cx - 72, cy - 100);
        arc(0,0, r*2, r*2, radians(-10), radians(-10 + P.gazeDelta));
        pop();

        push();
        stroke(255, 40); strokeWeight(2); noFill();
        translate(cx + 72, cy - 104);
        arc(0,0, r*2, r*2, radians(190 - P.gazeDelta), radians(190));
        pop();
      }

      // mood label + title
      const mood = classifyMood();
      push();
      textAlign(CENTER);
      textSize(22);
      fill(255, 170);
      text(`mood: ${mood}`, cx, 38);

      // title as soft swash that subtly swells with warmth
      const swell = 1 + 0.18 * P.warmthBloom;
      textSize(64 * swell);
      fill(255, 220);
      text("The Geometry of Longing", cx, height - 40);
      pop();
    }
  });

})();
