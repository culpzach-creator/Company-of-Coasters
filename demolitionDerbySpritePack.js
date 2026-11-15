(function() {
"use strict";
/* ===== SHARED HELPERS (skip if already in engine.js) ===== */
function shade(hex, amt){
  if(!hex || hex[0]!=='#') return hex || '#888888';
  const n=parseInt(hex.slice(1),16); let r=n>>16, g=(n>>8)&255, b=n&255;
  const f=c=>Math.max(0,Math.min(255,Math.round(amt<0?c*(1+amt):c+(255-c)*amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
function hexPath(ctx,cx,cy,R){
  ctx.beginPath();
  for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);
    ctx[i?'lineTo':'moveTo'](cx+R*Math.cos(a), cy+R*Math.sin(a)*0.58);}
  ctx.closePath();
}

/* ===== DEMOLITION DERBY 16-SKIN METADATA ===== */
const DERBY_SKINS = {
  standard:     {id:'standard',     label:'Unthemed (Tier 0–2)', name:'Zamperla Demolition Derby',    sub:'3 Interlocking Turntables, Light Poles & Stock Cars', hex:'#cbd5e1', border:'#ef4444', deck:'#334155', rim:'#facc15', disc1:'#475569', disc2:'#1e293b', disc3:'#3b475e'},
  western:      {id:'western',      label:'Wild West',           name:'Bucking Longhorn Rodeo Whip',  sub:'Corral Fence, Windmill Pylon & Bucking Bulls',          hex:'#c99a62', border:'#b91c1c', deck:'#8a5a33', rim:'#f59e0b', disc1:'#78350f', disc2:'#9a3412', disc3:'#6b2f10'},
  frontier:     {id:'frontier',     label:'Frontier',            name:'Whitewater Whiskey Barrel Spin',sub:'Timber Deck, Pine Totems & Oak Whiskey Barrels',        hex:'#7d955d', border:'#566e42', deck:'#6b4a2b', rim:'#d9b27a', disc1:'#5a3b22', disc2:'#2f5f3a', disc3:'#4b331d'},
  space:        {id:'space',        label:'Space',               name:'Orbital Quantum Gyro-Pods',    sub:'Titanium Deck, Plasma Beacons & Hovering Gravity Pods', hex:'#334155', border:'#0ea5e9', deck:'#0f172a', rim:'#22d3ee', disc1:'#1e293b', disc2:'#0284c7', disc3:'#172554'},
  retro_future: {id:'retro_future', label:'Retro-Future',        name:'Tomorrowland Planetary Orbit', sub:'Googie Atomic Arch & Ringed Saturn/Jupiter Planets',    hex:'#bcc8d5', border:'#f97316', deck:'#1e293b', rim:'#06b6d4', disc1:'#0284c7', disc2:'#f97316', disc3:'#4f46e5'},
  classic:      {id:'classic',      label:'Classic Midway',      name:'Midway Beach-Ball Whirl',      sub:'Striped Carnival Deck & Oversized Colorful Beach Balls',hex:'#cbb07c', border:'#e11d48', deck:'#fffbeb', rim:'#e11d48', disc1:'#2563eb', disc2:'#facc15', disc3:'#e11d48'},
  tiki:         {id:'tiki',         label:'Tiki',                name:'Polynesian Tiki-Mask Whip',    sub:'Bamboo Deck, Fire Torches & Giant Carved Tiki Heads',   hex:'#5c9444', border:'#d97706', deck:'#5a3b22', rim:'#f59e0b', disc1:'#78350f', disc2:'#15803d', disc3:'#92400e'},
  caribbean:    {id:'caribbean',    label:'Caribbean',           name:'Port Royal Rum-Cask Spin',     sub:'Harbour Planks, Cannon Posts & Brass-Hooped Rum Barrels',hex:'#6aa04a',border:'#d97706', deck:'#786f5c', rim:'#d97706', disc1:'#5a3a22', disc2:'#0d9488', disc3:'#442b18'},
  jungle:       {id:'jungle',       label:'Jungle',              name:'Tribal Bongo-Drum Jamboree',   sub:'Mayan Stone Plaza, Tiki Braziers & Carved Tribal Drums',hex:'#587c48', border:'#2fbf9a', deck:'#8e8a72', rim:'#eab308', disc1:'#137a70', disc2:'#78350f', disc3:'#1e5c52'},
  americana:    {id:'americana',    label:'Americana',           name:'Route 66 Convertible Cruisers',sub:'Checkered Diner Asphalt & 1950s Tailfin Convertibles',  hex:'#a8644c', border:'#b91c1c', deck:'#27272a', rim:'#f8fafc', disc1:'#b91c1c', disc2:'#1d3557', disc3:'#3f3f46'},
  fiesta:       {id:'fiesta',       label:'Fiesta',              name:'Día de los Muertos Calaveras', sub:'Talavera Tile Plaza, Papel Picado & Sugar Skull Cars',  hex:'#d99b52', border:'#e11d48', deck:'#fef3c7', rim:'#e11d48', disc1:'#0d9488', disc2:'#9333ea', disc3:'#e11d48'},
  bavarian:     {id:'bavarian',     label:'Bavarian',            name:'Oktoberfest Maßkrug Whirl',    sub:'Biergarten Deck, Maibaum & Frothy Oktoberfest Beer Mugs',hex:'#769958',border:'#2563eb', deck:'#dfd9c8', rim:'#2563eb', disc1:'#2563eb', disc2:'#f8fafc', disc3:'#1d4ed8'},
  alps:         {id:'alps',         label:'Alps',                name:'Matterhorn Snowtube Slalom',   sub:'Packed Glacier Ice Rink & Inflatable Alpine Snow Tubes',hex:'#a8c5d6', border:'#0284c7', deck:'#e0f2fe', rim:'#dc2626', disc1:'#bae6fd', disc2:'#38bdf8', disc3:'#7dd3fc'},
  nordic:       {id:'nordic',       label:'Nordic',              name:'Asgard Iron-Keg Maelstrom',    sub:'Fjord Flagstone, Rune Pillars & Riveted Steel Barrels', hex:'#4d6b63', border:'#d97706', deck:'#334155', rim:'#f59e0b', disc1:'#475569', disc2:'#1e293b', disc3:'#2c3a4f'},
  medieval:     {id:'medieval',     label:'Medieval',            name:'Royal Tournament Supply Wagons',sub:'Cobblestone Bailey, Pennants & Canvas-Topped Wagons',  hex:'#6c8c58', border:'#eab308', deck:'#64748b', rim:'#eab308', disc1:'#b91c1c', disc2:'#1d4ed8', disc3:'#7e22ce'},
  gothic:       {id:'gothic',       label:'Gothic',              name:'Midnight Crypt Coffin Waltz',  sub:'Obsidian Flagstone, Gaslamps & Velvet-Lined Coffins',   hex:'#3b3345', border:'#7e22ce', deck:'#18181b', rim:'#991b1b', disc1:'#27272a', disc2:'#3b0764', disc3:'#1f1635'}
};
DERBY_SKINS.unthemed = DERBY_SKINS.standard;
DERBY_SKINS.german   = DERBY_SKINS.bavarian;
DERBY_SKINS.wildwest = DERBY_SKINS.western;
DERBY_SKINS.retro    = DERBY_SKINS.retro_future;

/* ===== SPRITE CODE: copy this block into engine.js ===== */
/**
 * drawDemolitionDerby(ctx, cx, cy, R, opts)
 *  Modern 3-Turntable Zamperla Demolition Derby / Mater's Junkyard Jamboree Whip Ride:
 *   - Three large interlocking flush turntables arranged in an equilateral triangle:
 *       * Top-Back Turntable   : `(0, -Rcenter)` rotating CW
 *       * Front-Left Turntable : `(-Rdisc, +Rcenter * 0.52)` rotating CCW
 *       * Front-Right Turntable: `(+Rdisc, +Rcenter * 0.52)` rotating CW
 *     Each pair kisses tangentially at a shared hand-off pinch point so vehicles weave in a
 *     continuous 3-lobe cloverleaf loop, whipping outward at every turntable transfer!
 *   - 16 Distinct Skins (`standard`, `western`, `frontier`, `space`, `retro_future`, `classic`,
 *     `tiki`, `caribbean`, `jungle`, `americana`, `fiesta`, `bavarian`, `alps`, `nordic`, `medieval`, `gothic`).
 */
function drawDemolitionDerby(ctx, cx, cy, R, o = {}) {
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTh = String(o.themeId || o.theme || 'standard').toLowerCase().replace(/-/g, '_');
  if (rawTh === 'unthemed') rawTh = 'standard';
  if (rawTh === 'german') rawTh = 'bavarian';
  if (rawTh === 'wildwest' || rawTh === 'wild_west') rawTh = 'western';
  if (rawTh === 'retro') rawTh = 'retro_future';
  const theme = (tier <= 2 || !DERBY_SKINS[rawTh]) ? 'standard' : rawTh;
  const meta = DERBY_SKINS[theme] || DERBY_SKINS.standard;

  const accent = o.accent || meta.border || '#ef4444';
  const fl = o.flip ? -1 : 1;
  const clockT = (o.t != null) ? o.t : (typeof performance !== 'undefined' ? performance.now() / 1000 : 0.4);
  const TAU = Math.PI * 2;

  ctx.save();
  if (o.flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  // 1. Optional Hex Tile Base
  if (o.tile !== false) {
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = theme === 'standard' ? '#cbd5e1' : meta.hex;
    ctx.fill();
    ctx.lineWidth = Math.max(2, R * 0.05);
    ctx.strokeStyle = theme === 'standard' ? accent : meta.border;
    ctx.stroke();
  }

  // Isometric Projection:
  // Centered slightly lower so the 3-turntable triangular cloverleaf sits squarely in the hex!
  const cyB = cy + R * 0.03;
  const S = R * 0.068;
  // Map local `(u, v, z)` where `u` is along the wide horizontal axis of the hex,
  // `v` is the front-to-back depth axis, and `z` is vertical height.
  const P = (u, v, z = 0) => [cx + u * S, cyB + v * 0.58 * S - z * S];

  const line = (a, b, c, w) => {
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  };
  const poly = (pts, fill, stroke, lw) => {
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || S * 0.05; ctx.stroke(); }
  };
  const disc = (p, rad, fill, stroke, lw) => {
    ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(0.5, rad), 0, TAU);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || S * 0.05; ctx.stroke(); }
  };
  const ell = (p, rx, ry, fill, stroke, lw, rot = 0) => {
    ctx.beginPath(); ctx.ellipse(p[0], p[1], Math.max(0.4, rx), Math.max(0.4, ry), rot, 0, TAU);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || S * 0.05; ctx.stroke(); }
  };

  // =========================================================================
  // 2. ZAMPERLA DEMOLITION DERBY ARENA FLOOR & THREE INTERLOCKING TURNTABLES
  //    3 Turntables arranged in an equilateral triangle (side length = 2 * Rdisc):
  //      - Top-Back Turntable   : (0, -2.18)        [CW]
  //      - Front-Left Turntable : (-2.85, +2.75)    [CCW]
  //      - Front-Right Turntable: (+2.85, +2.75)    [CW]
  //    Each pair kisses tangentially at radius Rdisc = 2.85!
  // =========================================================================
  const Rdisc = 2.85;
  const Rtrack = 2.15;
  const zDeck = 0.28;
  const SQ3 = Math.sqrt(3);
  // Equilateral triangle centers separated by `2 * Rdisc = 5.70`:
  // Circumradius = 2 * Rdisc / sqrt(3) = 3.29
  const Rcirc = (2 * Rdisc) / SQ3;
  const TURNTABLES = [
    { id: 0, cxU: 0,          cyU: -Rcirc,        dir:  1, col: meta.disc1 }, // Top-Back
    { id: 1, cxU: -Rdisc,     cyU:  Rcirc * 0.5,  dir: -1, col: meta.disc2 }, // Front-Left
    { id: 2, cxU:  Rdisc,     cyU:  Rcirc * 0.5,  dir:  1, col: meta.disc3 || meta.disc1 } // Front-Right
  ];

  // Trefoil / Triangular Rounded Arena Deck Hull wrapping all 3 turntables
  const drawTrefoilArena = (padR, zH, fillCol, strokeCol, lw) => {
    const pts = [];
    const nArc = 16;
    const rad = Rdisc + padR;
    // Sweep around the 3 outer arcs in clockwise order:
    // Top-Back (-150° to -30°), Front-Right (-30° to +90°), Front-Left (+90° to +210°)
    const arcs = [
      { tb: TURNTABLES[0], a0: -Math.PI * 5 / 6, a1: -Math.PI / 6 },
      { tb: TURNTABLES[2], a0: -Math.PI / 6,     a1:  Math.PI * 0.5 },
      { tb: TURNTABLES[1], a0:  Math.PI * 0.5,   a1:  Math.PI * 7 / 6 }
    ];
    arcs.forEach(arc => {
      for (let i = 0; i <= nArc; i++) {
        const a = arc.a0 + (arc.a1 - arc.a0) * (i / nArc);
        pts.push(P(arc.tb.cxU + Math.cos(a) * rad, arc.tb.cyU + Math.sin(a) * rad, zH));
      }
    });
    poly(pts, fillCol, strokeCol, lw);
  };

  // Ambient shadow + 3D extruded trefoil arena base skirt + deck top
  drawTrefoilArena(0.95, -0.06, 'rgba(10, 15, 25, 0.34)');
  drawTrefoilArena(0.72, 0, shade(meta.deck, -0.35), '#0f172a', S * 0.06);
  drawTrefoilArena(0.72, zDeck, meta.deck, theme === 'standard' ? accent : meta.rim, S * 0.08);

  // Three Giant Interlocking Counter-Rotating Flush Turntables
  const omega = clockT * 1.45;
  TURNTABLES.forEach((tb) => {
    const pC = P(tb.cxU, tb.cyU, zDeck + 0.01);
    const rx = Rdisc * S, ry = Rdisc * 0.58 * S;
    ell(pC, rx, ry, tb.col, theme === 'standard' ? accent : meta.rim, S * 0.07);

    // Rotating pie-slice segments on each turntable
    const nSeg = 8;
    for (let k = 0; k < nSeg; k++) {
      const a0 = tb.dir * omega + (k / nSeg) * TAU;
      const a1 = a0 + TAU / (nSeg * 2);
      const pts = [pC];
      for (let s = 0; s <= 4; s++) {
        const a = a0 + (a1 - a0) * (s / 4);
        pts.push(P(tb.cxU + Math.cos(a) * (Rdisc - 0.10), tb.cyU + Math.sin(a) * (Rdisc - 0.10), zDeck + 0.015));
      }
      poly(pts, shade(tb.col, 0.15));
    }

    // Guide slot track ring & center turntable hub cap
    ell(pC, Rtrack * S, Rtrack * 0.58 * S, null, 'rgba(255,255,255,0.24)', S * 0.06);
    ell(pC, S * 0.58, S * 0.34, '#1e293b', theme === 'standard' ? accent : meta.rim, S * 0.06);
  });

  // Back perimeter safety wall & themed light pylons (behind the vehicles)
  const drawArenaPost = (u, v) => {
    const b = P(u, v, zDeck), t = P(u, v, zDeck + 2.10);
    line(b, t, '#1e293b', S * 0.16);
    line(b, t, theme === 'standard' ? accent : meta.rim, S * 0.08);
    if (theme === 'tiki' || theme === 'jungle' || theme === 'fiesta') {
      poly([[t[0]-S*0.14, t[1]], [t[0], t[1]-S*0.45], [t[0]+S*0.14, t[1]]], '#f97316');
      disc([t[0], t[1]-S*0.15], S*0.10, '#fde047');
    } else if (theme === 'space' || theme === 'retro_future') {
      disc(t, S * 0.18, '#22d3ee', '#ffffff', S * 0.04);
    } else {
      disc(t, S * 0.16, '#fef08a', '#b45309', S * 0.04);
    }
  };
  drawArenaPost(-Rdisc * 1.15, -Rcirc * 1.12);
  drawArenaPost( Rdisc * 1.15, -Rcirc * 1.12);

  // =========================================================================
  // 3. 3-TURNTABLE CLOVERLEAF TANGENT HAND-OFF KINEMATICS + OUTWARD WHIP
  //    Each full loop visits all 3 turntables smoothly via tangent kiss-points:
  //      - Segment 0 (Top-Back CW)     : sweeps 300° from -180° to +120° (bottom-left kiss-point)
  //      - Segment 1 (Front-Left CCW)  : sweeps 300° from -60°  to -360° (right kiss-point)
  //      - Segment 2 (Front-Right CW)  : sweeps 300° from +180° to +480° (top-left kiss-point)
  //    Using exact 300° (5*PI/3) arcs at the true equilateral kiss-points ensures C1 continuous
  //    position and tangent velocity across every transition so vehicles never jump or vanish!
  // =========================================================================
  const SEG_ARC = (5 * Math.PI) / 3; // 300 degrees per turntable lobe (exact equilateral kiss-to-kiss angle)
  const LOOP_LEN = 3 * SEG_ARC;      // 900 degrees (5*PI) total 3-turntable cloverleaf loop

  const evalCloverleaf3 = (sPhase) => {
    const p = ((sPhase % LOOP_LEN) + LOOP_LEN) % LOOP_LEN;
    const segIdx = Math.floor(p / SEG_ARC);
    const q = p - segIdx * SEG_ARC; // 0 .. 5*PI/3 within current turntable
    let u, v, tu, tv, whipBias;

    // Smooth whip envelope peaking right after each turntable hand-off and settling smoothly to 0 at exit
    const whipEnv = Math.sin((q / SEG_ARC) * Math.PI);
    const whipOsc = Math.sin(q * 1.8) * whipEnv * 0.42;

    if (segIdx === 0) {
      // Lobe 0: Top-Back Turntable (CW: enters at -150° from Front-Left, exits at +150°? Wait:
      // Let's use the exact kiss-point angles for the triangle:
      //   TB0 (0, -Rcirc)       -> TB1 (-Rdisc, +Rcirc/2) is at angle +120° (2*PI/3) on TB0, and -60° (-PI/3) on TB1
      //   TB1 (-Rdisc, +Rcirc/2)-> TB2 (+Rdisc, +Rcirc/2) is at angle 0° on TB1, and 180° (PI) on TB2
      //   TB2 (+Rdisc, +Rcirc/2)-> TB0 (0, -Rcirc)       is at angle -120° (-2*PI/3) on TB2, and +60° (PI/3) on TB0
      // Going CW on TB0 from +60° (PI/3) around to +480° (8*PI/3) = 420° (7*PI/3) outer sweep!
      const tb = TURNTABLES[0];
      const a = (Math.PI / 3) + (q * 1.4); // 300° * 1.4 = 420° (7*PI/3) outer sweep from +60° CW to +120°!
      u = tb.cxU + Rtrack * Math.cos(a);
      v = tb.cyU + Rtrack * Math.sin(a);
      tu = -Math.sin(a);
      tv =  Math.cos(a);
      whipBias = whipOsc;
    } else if (segIdx === 1) {
      // Lobe 1: Front-Left Turntable (CCW: enters at -60° (-PI/3) from TB0, sweeps 420° CCW to 0° (2*PI) to meet TB2!)
      const tb = TURNTABLES[1];
      const a = (-Math.PI / 3) - (q * 1.4); // -60° CCW by 420° = -480° (which is +240°? Wait: -60° - 300° = -360° = 0°!)
      u = tb.cxU + Rtrack * Math.cos(a);
      v = tb.cyU + Rtrack * Math.sin(a);
      tu =  Math.sin(a);
      tv = -Math.cos(a);
      whipBias = -whipOsc;
    } else {
      // Lobe 2: Front-Right Turntable (CW: enters at 180° (PI) from TB1, sweeps 420° CW to +600° = +240° (-120°) to meet TB0!)
      const tb = TURNTABLES[2];
      const a = Math.PI + (q * 1.4); // 180° + 420° = 600° = 240° (-120°)!
      u = tb.cxU + Rtrack * Math.cos(a);
      v = tb.cyU + Rtrack * Math.sin(a);
      tu = -Math.sin(a);
      tv =  Math.cos(a);
      whipBias = whipOsc;
    }

    const heading = Math.atan2(tv, tu) + whipBias;
    return { u, v, tu, tv, heading, whipBias };
  };

  // Helper to draw 2 seated riders peeking out of any open-top themed vehicle
  const drawRiders = (px, py, idx, hatCol = null) => {
    const shirts = ['#ef4444', '#3b82f6', '#22c55e', '#facc15', '#a855f7'];
    [-0.22, 0.22].forEach((ox, rIdx) => {
      const rx = px + ox * S, ry = py - S * 0.14;
      disc([rx, ry + S * 0.14], S * 0.16, shirts[(idx + rIdx) % 5]);
      disc([rx, ry], S * 0.14, (theme === 'space' || theme === 'retro_future') ? '#ffffff' : '#fde4c8', '#1e293b', S * 0.03);
      if (hatCol) {
        ell([rx, ry - S * 0.10], S * 0.19, S * 0.07, hatCol);
      }
    });
  };

  // =========================================================================
  // 4. BESPOKE THEMED VEHICLE DRAWER (`drawDerbyVehicle`) — ALL 16 THEMES!
  // =========================================================================
  const drawDerbyVehicle = (veh, idx) => {
    const pos = P(veh.u, veh.v, zDeck + 0.05);
    const px = pos[0], py = pos[1];
    const dir = Math.cos(veh.heading) >= 0 ? 1 : -1;
    const tilt = Math.sin(veh.heading) * 0.28;

    // Contact shadow on the turntable
    ell([px + S * 0.08, py + S * 0.12], S * 0.92, S * 0.44, 'rgba(10, 14, 22, 0.34)');

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(tilt);

    const vCol = ['#ef4444', '#2563eb', '#eab308', '#10b981', '#a855f7', '#f97316'][idx % 6];

    if (theme === 'western') {
      // WILD WEST: Bucking Longhorn Bulls with Curved Horns, Leather Saddles & Cowboy Hats!
      const bullCol = idx % 2 === 0 ? '#78350f' : '#451a03';
      // Muscular bull body & kicking hooves
      line([-dir*S*0.45, S*0.1], [-dir*S*0.72, -S*0.18], bullCol, S*0.14);
      line([ dir*S*0.45, S*0.1], [ dir*S*0.65,  S*0.32], bullCol, S*0.14);
      ell([0, 0], S * 0.72, S * 0.46, bullCol, '#291509', S * 0.05);
      // Red/gold western saddle blanket & rider with cowboy hat
      ell([-dir*S*0.05, -S*0.08], S * 0.38, S * 0.28, '#b91c1c', '#facc15', S * 0.04);
      drawRiders(0, -S * 0.12, idx, '#d97706');
      // Bull head, nostrils & wide sweeping ivory Texas Longhorns!
      const hx = dir * S * 0.65, hy = -S * 0.18;
      disc([hx, hy], S * 0.30, bullCol, '#291509', S * 0.05);
      line([hx, hy - S*0.15], [hx - dir*S*0.25, hy - S*0.52], '#fef3c7', S * 0.11);
      line([hx, hy - S*0.15], [hx + dir*S*0.45, hy - S*0.46], '#fef3c7', S * 0.11);
    }
    else if (theme === 'frontier' || theme === 'caribbean') {
      // FRONTIER (Oak Whiskey Barrels) & CARIBBEAN (Brass-Hooped Pirate Rum Barrels)
      const isCarib = theme === 'caribbean';
      const bMain = isCarib ? '#5a3a22' : '#92400e';
      const hoopC = isCarib ? '#f59e0b' : '#334155';
      // Plump staved wooden barrel tub
      ell([0, S*0.05], S * 0.68, S * 0.56, bMain, '#291509', S * 0.06);
      // Metallic/brass barrel hoops
      ell([0, S*0.18], S * 0.65, S * 0.24, null, hoopC, S * 0.08);
      ell([0, -S*0.15], S * 0.64, S * 0.24, null, hoopC, S * 0.08);
      // Open barrel top rim with riders standing/seated inside!
      ell([0, -S*0.24], S * 0.56, S * 0.22, '#291509', hoopC, S * 0.06);
      drawRiders(0, -S * 0.16, idx, isCarib ? '#b91c1c' : '#78350f');
      if (isCarib) {
        // White skull emblem on front of rum cask
        disc([0, S * 0.08], S * 0.14, '#f8fafc');
      }
    }
    else if (theme === 'space') {
      // SPACE: Sleek Titanium Hover-Pods with Glowing Cyan Anti-Grav Rings & Bubble Canopies!
      ell([0, S*0.14], S * 0.92, S * 0.36, '#0f172a', '#22d3ee', S * 0.08);
      ell([0, 0], S * 0.78, S * 0.44, '#e2e8f0', '#0284c7', S * 0.06);
      drawRiders(0, -S * 0.12, idx);
      // Translucent cyan bubble dome over the astronauts
      ctx.fillStyle = 'rgba(34, 211, 238, 0.34)';
      ctx.strokeStyle = '#67e8f9'; ctx.lineWidth = S * 0.05;
      ctx.beginPath(); ctx.arc(0, -S*0.12, S * 0.52, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    else if (theme === 'retro_future') {
      // RETRO-FUTURE: Ringed Planets (Saturn, Jupiter, Neptune) with Tilted Planetary Rings!
      const pCols = [
        ['#f59e0b', '#fef08a', '#22d3ee'], // Saturn (Gold + Cyan Ring)
        ['#ea580c', '#fed7aa', '#facc15'], // Jupiter (Terracotta + Gold Ring)
        ['#0284c7', '#7dd3fc', '#f97316']  // Neptune (Cobalt + Orange Ring)
      ][idx % 3];
      // Back half of planetary ring
      ctx.strokeStyle = pCols[2]; ctx.lineWidth = S * 0.14;
      ctx.beginPath(); ctx.ellipse(0, 0, S * 1.05, S * 0.32, -0.22, Math.PI, TAU); ctx.stroke();
      // Spherical planet body
      disc([0, 0], S * 0.58, pCols[0], '#0f172a', S * 0.05);
      ell([0, -S*0.12], S * 0.52, S * 0.16, pCols[1]);
      drawRiders(0, -S * 0.18, idx);
      // Front half of planetary ring wrapping in front of the planet!
      ctx.strokeStyle = pCols[2]; ctx.lineWidth = S * 0.14;
      ctx.beginPath(); ctx.ellipse(0, 0, S * 1.05, S * 0.32, -0.22, 0, Math.PI); ctx.stroke();
    }
    else if (theme === 'classic') {
      // CLASSIC MIDWAY: Oversized Colorful 6-Panel Midway Beach Balls!
      const bCols = ['#ef4444', '#facc15', '#2563eb', '#22c55e', '#f97316', '#ec4899'];
      disc([0, -S*0.04], S * 0.64, '#ffffff', '#1e293b', S * 0.06);
      // Colorful beach-ball gores
      for (let g = 0; g < 3; g++) {
        const cG = bCols[(idx + g*2) % 6];
        ctx.fillStyle = cG;
        ctx.beginPath();
        ctx.ellipse(0, -S*0.04, S * (0.62 - g*0.18), S * 0.62, g * 0.65, 0, TAU);
        ctx.fill();
      }
      disc([0, -S*0.48], S * 0.16, '#facc15', '#1e293b', S * 0.04);
      drawRiders(0, -S * 0.14, idx);
    }
    else if (theme === 'tiki') {
      // TIKI: Giant Hand-Carved Polynesian Tiki Heads with Glowing Eyes & Grimaces!
      const wCol = idx % 2 === 0 ? '#6d4224' : '#4a2c16';
      poly([
        [-S*0.52, -S*0.48], [S*0.52, -S*0.48],
        [S*0.46,  S*0.45], [-S*0.46, S*0.45]
      ], wCol, '#291509', S * 0.06);
      // Carved brow, glowing yellow Tiki eyes & fanged grimace
      line([-S*0.42, -S*0.18], [S*0.42, -S*0.18], '#d97706', S * 0.10);
      ell([-S*0.22, -S*0.04], S * 0.14, S * 0.09, '#facc15');
      ell([ S*0.22, -S*0.04], S * 0.14, S * 0.09, '#facc15');
      poly([[-S*0.32, S*0.16], [S*0.32, S*0.16], [S*0.26, S*0.34], [-S*0.26, S*0.34]], '#1c1917');
      for (let t = -1; t <= 1; t++) {
        disc([t * S * 0.16, S * 0.24], S * 0.05, '#ffffff');
      }
      drawRiders(0, -S * 0.36, idx, '#15803d');
    }
    else if (theme === 'jungle') {
      // JUNGLE: Carved Tribal Bongo / Conga Drums with Rope Lacing & Animal-Hide Heads!
      poly([
        [-S*0.56, -S*0.38], [S*0.56, -S*0.38],
        [S*0.40,  S*0.46], [-S*0.40, S*0.46]
      ], '#78350f', '#291509', S * 0.06);
      // Zigzag rawhide tension ropes along the drum shell
      ctx.strokeStyle = '#fde68a'; ctx.lineWidth = S * 0.05;
      ctx.beginPath();
      ctx.moveTo(-S*0.48, -S*0.32); ctx.lineTo(-S*0.25, S*0.36);
      ctx.lineTo(0, -S*0.32); ctx.lineTo(S*0.25, S*0.36); ctx.lineTo(S*0.48, -S*0.32);
      ctx.stroke();
      // Stretched parchment drumhead top
      ell([0, -S*0.38], S * 0.56, S * 0.22, '#fef3c7', '#92400e', S * 0.06);
      drawRiders(0, -S * 0.28, idx);
    }
    else if (theme === 'americana') {
      // AMERICANA: 1950s Tailfin Convertibles with Chrome Bumpers & Whitewall Tires!
      const cCol = ['#ef4444', '#06b6d4', '#facc15', '#ec4899', '#3b82f6', '#10b981'][idx % 6];
      // Swept 1950s sedan body & tailfins
      poly([
        [-S*0.85, -S*0.24], [-S*0.55, -S*0.08], [S*0.75, -S*0.08],
        [S*0.88, S*0.18], [-S*0.88, S*0.18]
      ], cCol, '#1e293b', S * 0.05);
      // Chrome side spear & bumpers
      line([-S*0.82, S*0.05], [S*0.82, S*0.05], '#f8fafc', S * 0.06);
      // Whitewall tires
      [-0.50, 0.50].forEach(wx => {
        disc([wx * S, S * 0.22], S * 0.22, '#0f172a');
        disc([wx * S, S * 0.22], S * 0.14, '#ffffff');
        disc([wx * S, S * 0.22], S * 0.07, cCol);
      });
      drawRiders(0, -S * 0.06, idx);
    }
    else if (theme === 'fiesta') {
      // FIESTA: Día de los Muertos Calaveras (Sugar Skulls with Marigold Eyes & Sombreros)!
      disc([0, -S*0.08], S * 0.56, '#f8fafc', '#1e293b', S * 0.06);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-S*0.30, S*0.18, S*0.60, S*0.26);
      // Grinning teeth lines
      for (let t = -2; t <= 2; t++) {
        line([t*S*0.11, S*0.18], [t*S*0.11, S*0.42], '#1e293b', S * 0.04);
      }
      // Vibrant marigold & pink eye sockets
      [-0.22, 0.22].forEach(ex => {
        disc([ex * S, -S*0.06], S * 0.16, '#ec4899', '#facc15', S * 0.05);
        disc([ex * S, -S*0.06], S * 0.07, '#0f172a');
      });
      // Festive Charro Sombrero crowning the Calavera
      ell([0, -S*0.46], S * 0.85, S * 0.22, '#f59e0b', '#e11d48', S * 0.06);
      drawRiders(0, -S * 0.34, idx);
    }
    else if (theme === 'bavarian') {
      // BAVARIAN: Dimpled Oktoberfest Beer Mugs (Maßkrüge) with Glass Handles & Overflowing Foam!
      const mw = S * 0.52, mh = S * 0.44;
      // Curved glass mug handle on right
      ctx.strokeStyle = '#e0f2fe'; ctx.lineWidth = S * 0.12;
      ctx.beginPath(); ctx.arc(mw * 0.9, 0, S * 0.24, -Math.PI*0.45, Math.PI*0.45); ctx.stroke();
      // Golden amber beer mug cylinder
      poly([[-mw, -mh], [mw, -mh], [mw*0.94, mh], [-mw*0.94, mh]], '#f59e0b', '#fef3c7', S * 0.06);
      // Dimpled glass highlights
      [-0.26, 0, 0.26].forEach(gx => ell([gx * S, S*0.04], S*0.09, S*0.16, 'rgba(255,255,255,0.35)'));
      drawRiders(0, -S * 0.26, idx);
      // Fluffy overflowing white beer foam head!
      [-0.35, -0.12, 0.12, 0.35].forEach((fx, i) => {
        disc([fx * S, -mh - (i%2)*S*0.06], S * 0.20, '#ffffff');
      });
    }
    else if (theme === 'alps') {
      // ALPS: Inflatable Alpine Snow Tubes with Grab Handles!
      const tCol = idx % 2 === 0 ? '#dc2626' : '#0284c7';
      ell([0, S*0.08], S * 0.86, S * 0.44, shade(tCol, -0.35));
      ell([0, 0], S * 0.86, S * 0.44, tCol, '#ffffff', S * 0.08);
      ell([0, -S*0.02], S * 0.44, S * 0.22, '#0f172a');
      // Black rubber grab handles on both sides
      [-0.68, 0.68].forEach(hx => line([hx*S, -S*0.12], [hx*S, S*0.08], '#1e293b', S * 0.09));
      drawRiders(0, -S * 0.08, idx, '#facc15');
    }
    else if (theme === 'nordic') {
      // NORDIC: Riveted Industrial Steel Barrels with Hazard Bands & Viking Riders!
      ell([0, S*0.05], S * 0.66, S * 0.56, '#475569', '#0f172a', S * 0.06);
      // Ribbed steel rolling hoops & gold/amber hazard stripe
      ell([0, S*0.16], S * 0.64, S * 0.22, null, '#94a3b8', S * 0.08);
      ell([0, -S*0.14], S * 0.63, S * 0.22, null, '#f59e0b', S * 0.08);
      ell([0, -S*0.24], S * 0.54, S * 0.20, '#1e293b', '#94a3b8', S * 0.06);
      drawRiders(0, -S * 0.16, idx, '#94a3b8');
    }
    else if (theme === 'medieval') {
      // MEDIEVAL: Canvas-Hooped Medieval Tournament & Merchant Wagons with Spoked Wheels!
      poly([[-S*0.76, -S*0.05], [S*0.76, -S*0.05], [S*0.68, S*0.32], [-S*0.68, S*0.32]], '#78350f', '#451a03', S * 0.06);
      // Spoked wooden wagon wheels
      [-0.46, 0.46].forEach(wx => {
        disc([wx * S, S * 0.34], S * 0.24, '#451a03', '#f59e0b', S * 0.05);
        disc([wx * S, S * 0.34], S * 0.08, '#facc15');
      });
      // Arched cream canvas wagon canopy at rear & riders in front
      ctx.fillStyle = '#fef3c7'; ctx.strokeStyle = '#78350f'; ctx.lineWidth = S * 0.05;
      ctx.beginPath(); ctx.arc(-dir*S*0.22, -S*0.05, S * 0.48, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
      drawRiders(dir * S * 0.28, -S * 0.06, idx, '#b91c1c');
    }
    else if (theme === 'gothic') {
      // GOTHIC: Velvet-Lined Vampire Coffins with Brass Handles & Gold Crosses!
      // Iconic 6-sided tapered coffin silhouette
      poly([
        [-S*0.82, -S*0.18], [-S*0.35, -S*0.44], [S*0.35, -S*0.44],
        [S*0.82, -S*0.18], [S*0.68, S*0.34], [-S*0.68, S*0.34]
      ], '#18181b', '#71717a', S * 0.07);
      // Crimson velvet interior & golden cross emblem
      poly([
        [-S*0.66, -S*0.14], [-S*0.28, -S*0.34], [S*0.28, -S*0.34],
        [S*0.66, -S*0.14], [S*0.54, S*0.22], [-S*0.54, S*0.22]
      ], '#7f1d1d');
      line([-S*0.35, S*0.05], [S*0.35, S*0.05], '#facc15', S * 0.07);
      line([0, -S*0.15], [0, S*0.24], '#facc15', S * 0.07);
      drawRiders(0, -S * 0.14, idx);
    }
    else {
      // STANDARD (Unthemed): Modern Zamperla Demolition Derby Stock Cars with Checkered Bumpers!
      poly([
        [-S*0.82, -S*0.16], [S*0.82, -S*0.16],
        [S*0.76,  S*0.26], [-S*0.76, S*0.26]
      ], vCol, '#0f172a', S * 0.06);
      // Heavy rubber wrap-around bumper guard with checkered stripe
      line([-S*0.84, S*0.18], [S*0.84, S*0.18], '#0f172a', S * 0.14);
      line([-S*0.78, S*0.18], [S*0.78, S*0.18], '#facc15', S * 0.06);
      // Roll-bar hoop & 2 riders
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = S * 0.07;
      ctx.beginPath(); ctx.arc(-dir*S*0.15, -S*0.16, S * 0.34, Math.PI, 0); ctx.stroke();
      drawRiders(0, -S * 0.14, idx);
    }

    ctx.restore();
  };

  // Evaluate all 9 vehicles (3 cars per turntable) spaced evenly along the 3-turntable cloverleaf loop, depth-sort by v, and draw!
  const N_VEH = 9;
  const fleet = [];
  for (let k = 0; k < N_VEH; k++) {
    const sPhase = omega + (k / N_VEH) * LOOP_LEN;
    const state = evalCloverleaf3(sPhase);
    fleet.push({ ...state, idx: k });
  }
  fleet.sort((a, b) => a.v - b.v).forEach(v => drawDerbyVehicle(v, v.idx));

  // Front perimeter safety posts (in front of the vehicles)
  drawArenaPost(-Rdisc * 1.48, Rcirc * 0.72);
  drawArenaPost( 0,            Rcirc * 1.15);
  drawArenaPost( Rdisc * 1.48, Rcirc * 0.72);

  ctx.restore();
}
window.drawDemolitionDerby = drawDemolitionDerby;
})();
