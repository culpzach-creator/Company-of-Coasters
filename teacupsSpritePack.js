(function() {
"use strict";
/* ===== SHARED HELPERS (skip if already in engine.js) ===== */
function shade(hex, amt) {
  if (!hex || hex[0] !== '#') return hex || '#888888';
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = c => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
function hexPath(ctx, cx, cy, R) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 180 * (60 * i + 30);
    ctx[i ? 'lineTo' : 'moveTo'](cx + R * Math.cos(a), cy + R * Math.sin(a) * 0.58);
  }
  ctx.closePath();
}

/* ===== TEACUPS / SPINNING CUPS 16-SKIN METADATA ===== */
const TEACUP_SKINS = {
  standard:     {id:'standard',     label:'Unthemed (Tier 0–2)', name:'Standard Park Teacups',       sub:'Porcelain Teapot Hub, 3 Sub-Discs & 9 Pastel Cups',     hex:'#cbd5e1', border:'#ec4899', deck:'#334155', deck2:'#475569', trim:'#facc15', subDisc:'#64748b', roof:'#e11d48', cups:['#f472b6','#38bdf8','#facc15','#a78bfa','#34d399','#fb923c']},
  classic:      {id:'classic',      label:'Classic Midway',      name:'Wonderland Mad Tea Party',    sub:'Giant Dormouse Teapot, Lantern Canopy & Gilded Cups',   hex:'#cbb07c', border:'#e11d48', deck:'#fffbeb', deck2:'#fef3c7', trim:'#e11d48', subDisc:'#f5c542', roof:'#e11d48', cups:['#e11d48','#2563eb','#f59e0b','#10b981','#a855f7','#ec4899']},
  americana:    {id:'americana',    label:'Americana',           name:'Main Street Soda-Fountain Spin',sub:'Checkered Diner Floor, Sundae Hub & Root-Beer Floats',  hex:'#a8644c', border:'#b91c1c', deck:'#f8fafc', deck2:'#18181b', trim:'#b91c1c', subDisc:'#38bdf8', roof:'#1d3557', cups:['#ef4444','#06b6d4','#facc15','#ec4899','#3b82f6','#10b981']},
  space:        {id:'space',        label:'Space',               name:'Orbital Zero-G Gyro Pods',    sub:'Titanium Deck, Tokamak Plasma Hub & Hovering Pods',     hex:'#334155', border:'#0ea5e9', deck:'#0f172a', deck2:'#1e293b', trim:'#22d3ee', subDisc:'#0284c7', roof:'#0284c7', cups:['#22d3ee','#e879f9','#38bdf8','#facc15','#a855f7','#f8fafc']},
  retro_future: {id:'retro_future', label:'Retro-Future',        name:'Tomorrowland Atom Saucers',   sub:'Googie Starburst Deck, Sputnik Core & Flying Saucers',  hex:'#bcc8d5', border:'#f97316', deck:'#f8fafc', deck2:'#e2e8f0', trim:'#f97316', subDisc:'#06b6d4', roof:'#f97316', cups:['#f97316','#06b6d4','#facc15','#ec4899','#38bdf8','#a855f7']},
  western:      {id:'western',      label:'Wild West',           name:'Dry Gulch Whiskey Barrel Spin',sub:'Wagon-Wheel Deck, Water-Barrel Hub & Oak Cask Tubs',   hex:'#c99a62', border:'#b91c1c', deck:'#8a5a33', deck2:'#78350f', trim:'#f59e0b', subDisc:'#5a3b22', roof:'#78350f', cups:['#92400e','#b45309','#78350f','#a16207','#9a3412','#854d0e']},
  frontier:     {id:'frontier',     label:'Frontier',            name:'Grizzly Honey-Pot Jamboree',  sub:'Cedar Log Turntable, Beehive Hub & Overflowing Pots',   hex:'#7d955d', border:'#566e42', deck:'#6b4a2b', deck2:'#5a3b22', trim:'#eab308', subDisc:'#2f5f3a', roof:'#2f5f3a', cups:['#d97706','#b45309','#ca8a04','#92400e','#a16207','#ea580c']},
  jungle:       {id:'jungle',       label:'Jungle',              name:'Mayan Jaguar Idol Spinner',   sub:'Carved Stone Plaza, Sun-Idol Hub & Jade-Inlaid Bowls',  hex:'#587c48', border:'#2fbf9a', deck:'#8e8a72', deck2:'#bdb9a0', trim:'#2fbf9a', subDisc:'#137a70', roof:'#b5893d', cups:['#2fbf9a','#eab308','#10b981','#d97706','#06b6d4','#84cc16']},
  tiki:         {id:'tiki',         label:'Tiki',                name:'Volcano Lagoon Coconut Spin', sub:'Bamboo Turntable, Tiki Totem Hub & Carved Coconut Cups',hex:'#5c9444', border:'#d97706', deck:'#5a3b22', deck2:'#78350f', trim:'#f97316', subDisc:'#d9a74a', roof:'#d9a74a', cups:['#6d4224','#5a3b22','#78350f','#8a5a33','#451a03','#92400e']},
  caribbean:    {id:'caribbean',    label:'Caribbean',           name:'Port Royal Rum-Cask Whirl',   sub:'Coquina Pier, Capstan Helm Hub & Brass-Hooped Casks',   hex:'#6aa04a', border:'#d97706', deck:'#e2d8c3', deck2:'#cfc4ac', trim:'#c2410c', subDisc:'#1e3a8a', roof:'#c2410c', cups:['#78350f','#991b1b','#0d9488','#b45309','#1e3a8a','#854d0e']},
  medieval:     {id:'medieval',     label:'Medieval',            name:'Royal Goblet & Chalice Dance',sub:'Stone Bailey Deck, Crown Chalice Hub & Jeweled Goblets',hex:'#6c8c58', border:'#eab308', deck:'#64748b', deck2:'#94a3b8', trim:'#f5c542', subDisc:'#1d4ed8', roof:'#1d4ed8', cups:['#eab308','#b91c1c','#1d4ed8','#15803d','#7e22ce','#d97706']},
  gothic:       {id:'gothic',       label:'Gothic',              name:'Witches’ Bubbling Cauldron',  sub:'Obsidian Stone Deck, Skull Altar & Iron Brew Cauldrons',hex:'#3b3345', border:'#7e22ce', deck:'#18181b', deck2:'#27272a', trim:'#a855f7', subDisc:'#3b0764', roof:'#312e81', cups:['#27272a','#18181b','#3f3f46','#312e81','#450a0a','#1e1b4b']},
  bavarian:     {id:'bavarian',     label:'Bavarian',            name:'Oktoberfest Maßkrug Whirl',   sub:'Blue/White Lozenge Deck, Keg Hub & Foamy Beer Steins',  hex:'#769958', border:'#2563eb', deck:'#f8fafc', deck2:'#2563eb', trim:'#f5c542', subDisc:'#78350f', roof:'#b91c1c', cups:['#f59e0b','#d97706','#eab308','#ca8a04','#f59e0b','#d97706']},
  alps:         {id:'alps',         label:'Alps',                name:'Alpine Fondue & Curling Spin',sub:'Glacier Ice Turntable, Cowbell Hub & Copper Fondue Pots',hex:'#a8c5d6', border:'#0284c7', deck:'#e0f2fe', deck2:'#bae6fd', trim:'#dc2626', subDisc:'#0284c7', roof:'#ffffff', cups:['#dc2626','#0284c7','#d97706','#16a34a','#b91c1c','#0369a1']},
  fiesta:       {id:'fiesta',       label:'Fiesta',              name:'Talavera Piñata & Jarritos',  sub:'Mosaic Tile Plaza, Sombrero Hub & Painted Clay Jarritos',hex:'#d99b52', border:'#e11d48', deck:'#fef3c7', deck2:'#fde68a', trim:'#e11d48', subDisc:'#0d9488', roof:'#c2410c', cups:['#e11d48','#0d9488','#f59e0b','#9333ea','#2563eb','#10b981']},
  nordic:       {id:'nordic',       label:'Nordic',              name:'Valhalla Mead-Horn & Keg Spin',sub:'Stave Timber Deck, Mjölnir Hub & Rune-Banded Mead Tubs',hex:'#4d6b63', border:'#d97706', deck:'#451a03', deck2:'#5a361a', trim:'#f59e0b', subDisc:'#1e293b', roof:'#0f172a', cups:['#78350f','#991b1b','#0284c7','#5a361a','#b45309','#334155']}
};
TEACUP_SKINS.unthemed = TEACUP_SKINS.standard;
TEACUP_SKINS.german   = TEACUP_SKINS.bavarian;
TEACUP_SKINS.wildwest = TEACUP_SKINS.western;
TEACUP_SKINS.retro    = TEACUP_SKINS.retro_future;

/* ===== SPRITE CODE: copy this block into engine.js ===== */
/**
 * drawTeacups(ctx, cx, cy, R, opts)
 *  1-Hex Planetary Spinning Teacups / Mad Tea Party:
 *   - Hierarchical planetary motion:
 *       1. Main circular turntable platform (`Rmain = 5.45`) rotates at `omega1 = clockT * 0.75`.
 *       2. Three secondary planetary sub-turntables (`Rsub = 2.05`, centered at `Rorbit = 2.85`)
 *          counter-rotate at `omega2 = -clockT * 1.65`.
 *       3. Nine themed passenger vessels (3 per sub-turntable, at `Rcup = 1.18`) spin on their own
 *          axes at `omega3 = clockT * 2.6 + idx * 1.1` with center steering wheels & 2 riders each!
 *   - Strict back-to-front depth sorting across all 9 vessels and the central hub centerpiece.
 *   - Optional translucent or opaque themed pavilion canopy (`opts.canopyAlpha`, default `0` open-air).
 *
 *  opts.themeId / theme : any of the 16 theme keys above
 *  opts.rideThemeTier   : 0..4 (<=2 renders Standard Unthemed; >=3 renders Heavy/Immersive themed ride)
 *  opts.accent          : Land color (used for standard accents & hex border)
 *  opts.t               : elapsed time in seconds
 *  opts.canopyAlpha     : 0.0 (open-air default) .. 0.90 (overhead pavilion roof)
 *  opts.flip            : true when mirrored horizontally
 *  opts.tile            : draw hex tile underneath (default true)
 */
function drawTeacups(ctx, cx, cy, R, o = {}) {
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTh = String(o.themeId || o.theme || 'standard').toLowerCase().replace(/-/g, '_');
  if (rawTh === 'unthemed') rawTh = 'standard';
  if (rawTh === 'german') rawTh = 'bavarian';
  if (rawTh === 'wildwest' || rawTh === 'wild_west') rawTh = 'western';
  if (rawTh === 'retro') rawTh = 'retro_future';
  const theme = (tier <= 2 || !TEACUP_SKINS[rawTh]) ? 'standard' : rawTh;
  const meta = TEACUP_SKINS[theme] || TEACUP_SKINS.standard;

  const accent = o.accent || meta.border || '#ec4899';
  const canopyAlpha = o.canopyAlpha != null ? o.canopyAlpha : 0.0;
  const clockT = (o.t != null) ? o.t : (typeof performance !== 'undefined' ? performance.now() / 1000 : 0.85);
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

  // Isometric Projection
  const cyB = cy + R * 0.06;
  const S = R * 0.072;
  const P = (X, Y, Z = 0) => [cx + (X - Y) * 0.7 * S, cyB + (X + Y) * 0.35 * S - Z * S];

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

  const trimCol = theme === 'standard' ? accent : meta.trim;
  const Rmain  = 5.45;
  const zDeck  = 0.36;
  const Rorbit = 2.88;
  const Rsub   = 2.02;
  const Rcup   = 1.14;

  // 2. Ambient Shadow & Stepped Main Circular Turntable Platform
  const pGnd = P(0, 0, 0);
  ell([pGnd[0] + S * 0.30, pGnd[1] + S * 0.18], (Rmain + 0.55) * 0.99 * S, (Rmain + 0.55) * 0.495 * S, 'rgba(10, 15, 25, 0.32)');

  // Outer stationary safety curb ring & extruded turntable drum
  ell(pGnd, (Rmain + 0.32) * 0.99 * S, (Rmain + 0.32) * 0.495 * S, shade(meta.deck, -0.38), '#0f172a', S * 0.06);
  const pDeck = P(0, 0, zDeck);
  ell(pDeck, Rmain * 0.99 * S, Rmain * 0.495 * S, meta.deck, trimCol, S * 0.08);

  // Rotating Radial Wedges / Checkerboard / Sunburst Floor Pattern on Main Turntable
  const omega1 = clockT * 0.72;
  const nWedges = 12;
  for (let i = 0; i < nWedges; i++) {
    const a0 = omega1 + (i / nWedges) * TAU;
    const a1 = a0 + TAU / nWedges;
    const pts = [pDeck];
    for (let s = 0; s <= 4; s++) {
      const a = a0 + (a1 - a0) * (s / 4);
      pts.push(P(Math.cos(a) * (Rmain - 0.08), Math.sin(a) * (Rmain - 0.08), zDeck + 0.01));
    }
    poly(pts, i % 2 === 0 ? meta.deck : meta.deck2);
  }
  ell(pDeck, Rmain * 0.99 * S, Rmain * 0.495 * S, null, trimCol, S * 0.08);

  // Back perimeter safety guardrail posts & top rail (behind the cups)
  const nPosts = 16;
  for (let i = 0; i < nPosts; i++) {
    const a = (i / nPosts) * TAU;
    const nx = Math.cos(a), ny = Math.sin(a);
    if (nx + ny >= 0) continue; // front posts drawn later
    const px = nx * (Rmain + 0.20), py = ny * (Rmain + 0.20);
    line(P(px, py, 0.12), P(px, py, 0.98), '#1e293b', S * 0.10);
    disc(P(px, py, 1.00), S * 0.08, trimCol);
  }

  // 3. Three Counter-Rotating Planetary Sub-Turntables (at Rorbit = 2.88)
  const omega2 = -clockT * 1.55;
  const omega3 =  clockT * 2.45;
  const subDiscs = [];
  const allCups = [];

  for (let d = 0; d < 3; d++) {
    const aSub = omega1 + (d * TAU) / 3;
    const sx = Rorbit * Math.cos(aSub);
    const sy = Rorbit * Math.sin(aSub);
    subDiscs.push({ d, sx, sy, depth: sx + sy });

    // Draw flush rotating planetary sub-disc on the main turntable
    const pSub = P(sx, sy, zDeck + 0.02);
    ell(pSub, Rsub * 0.99 * S, Rsub * 0.495 * S, meta.subDisc, trimCol, S * 0.06);
    // Brass planetary gear ring & spokes inside sub-disc
    for (let sp = 0; sp < 6; sp++) {
      const sa = omega2 + (sp * TAU) / 6;
      line(pSub, P(sx + Math.cos(sa) * (Rsub - 0.12), sy + Math.sin(sa) * (Rsub - 0.12), zDeck + 0.025), 'rgba(255,255,255,0.22)', S * 0.05);
    }
    ell(pSub, S * 0.45, S * 0.23, '#1e293b', trimCol, S * 0.05);

    // 3 Spinning Vessels per Sub-Turntable (9 total)
    for (let c = 0; c < 3; c++) {
      const idx = d * 3 + c;
      const aCup = aSub + omega2 + (c * TAU) / 3;
      const cxU = sx + Rcup * Math.cos(aCup);
      const cyU = sy + Rcup * Math.sin(aCup);
      const selfSpin = omega3 + idx * 1.15;
      allCups.push({
        idx,
        d,
        c,
        X: cxU,
        Y: cyU,
        selfSpin,
        col: meta.cups[idx % meta.cups.length],
        depth: cxU + cyU
      });
    }
  }

  // =========================================================================
  // 4. BESPOKE CENTRAL HUB CENTERPIECE (`drawCentralHub` at `(0, 0, zDeck)`)
  // =========================================================================
  const drawCentralHub = () => {
    const pBase = P(0, 0, zDeck + 0.03);
    ell(pBase, S * 1.35, S * 0.68, '#1e293b', trimCol, S * 0.08);

    if (theme === 'standard' || theme === 'classic') {
      // Giant Sculpted Porcelain / Royal Teapot Hub with Curved Spout, Handle & Lid Finial!
      const potCol = theme === 'classic' ? '#e11d48' : accent;
      const potHi  = theme === 'classic' ? '#fef08a' : '#f8fafc';
      const pBody  = P(0, 0, zDeck + 1.15);
      // Curved teapot handle (-X) & gooseneck spout (+X)
      ctx.strokeStyle = potHi; ctx.lineWidth = S * 0.22;
      ctx.beginPath(); ctx.arc(pBody[0] - S * 0.95, pBody[1], S * 0.58, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pBody[0] + S * 0.85, pBody[1] + S * 0.25);
      ctx.quadraticCurveTo(pBody[0] + S * 1.55, pBody[1] + S * 0.15, pBody[0] + S * 1.48, pBody[1] - S * 0.65); ctx.stroke();
      // Plump teapot belly, gold band & domed lid
      disc(pBody, S * 1.12, potCol, potHi, S * 0.07);
      ell([pBody[0], pBody[1] + S * 0.05], S * 1.10, S * 0.34, null, potHi, S * 0.10);
      ell([pBody[0], pBody[1] - S * 0.88], S * 0.72, S * 0.32, potHi, potCol, S * 0.06);
      disc([pBody[0], pBody[1] - S * 1.24], S * 0.24, '#facc15', '#78350f', S * 0.05);
    }
    else if (theme === 'americana') {
      // Giant 1950s Glass Ice-Cream Sundae / Milkshake Fountain Hub with Whipped Cream & Cherry!
      const pCup = P(0, 0, zDeck + 1.05);
      poly([[pCup[0]-S*0.85, pCup[1]-S*0.65], [pCup[0]+S*0.85, pCup[1]-S*0.65], [pCup[0]+S*0.42, pCup[1]+S*0.85], [pCup[0]-S*0.42, pCup[1]+S*0.85]], '#bae6fd', '#ffffff', S * 0.06);
      disc([pCup[0], pCup[1] - S * 0.72], S * 0.76, '#ffffff', '#e2e8f0', S * 0.05);
      disc([pCup[0], pCup[1] - S * 1.38], S * 0.24, '#ef4444', '#7f1d1d', S * 0.05);
      line([pCup[0], pCup[1] - S * 1.55], [pCup[0] + S * 0.28, pCup[1] - S * 1.95], '#22c55e', S * 0.08);
    }
    else if (theme === 'space' || theme === 'retro_future') {
      // Glowing Cyan Tokamak Plasma Core / Sputnik Atomic Hub with Orbiting Rings
      const isRetro = theme === 'retro_future';
      const cCore = isRetro ? '#f97316' : '#22d3ee';
      const pOrb = P(0, 0, zDeck + 1.45);
      line(pBase, pOrb, '#cbd5e1', S * 0.28);
      ell(pOrb, S * 1.45, S * 0.52, null, '#22d3ee', S * 0.09, omega1);
      ell(pOrb, S * 1.45, S * 0.52, null, '#e879f9', S * 0.09, -omega1 + 1.0);
      disc(pOrb, S * 0.68, '#0f172a', cCore, S * 0.09);
      disc(pOrb, S * 0.36, cCore);
    }
    else if (theme === 'western' || theme === 'frontier' || theme === 'caribbean') {
      // Giant Banded Oak Whiskey / Rum Barrel & Beehive Hub
      const pBar = P(0, 0, zDeck + 1.05);
      ell([pBar[0], pBar[1] + S * 0.1], S * 0.95, S * 0.92, theme === 'frontier' ? '#d97706' : '#78350f', '#291509', S * 0.07);
      ell([pBar[0], pBar[1] - S * 0.25], S * 0.92, S * 0.34, null, '#f59e0b', S * 0.09);
      ell([pBar[0], pBar[1] + S * 0.35], S * 0.92, S * 0.34, null, '#f59e0b', S * 0.09);
      ell([pBar[0], pBar[1] - S * 0.65], S * 0.72, S * 0.32, '#facc15', '#451a03', S * 0.06);
    }
    else if (theme === 'jungle' || theme === 'tiki') {
      // Carved Mayan Sun-Idol / Tiki Totem Pillar with Roaring Flame Crown
      const pTot = P(0, 0, zDeck + 1.15);
      poly([[pTot[0]-S*0.75, pTot[1]+S*0.9], [pTot[0]+S*0.75, pTot[1]+S*0.9], [pTot[0]+S*0.65, pTot[1]-S*0.9], [pTot[0]-S*0.65, pTot[1]-S*0.9]], theme === 'tiki' ? '#5a3b22' : '#8e8a72', '#292524', S * 0.07);
      disc([pTot[0]-S*0.25, pTot[1]-S*0.2], S * 0.16, '#2fbf9a');
      disc([pTot[0]+S*0.25, pTot[1]-S*0.2], S * 0.16, '#2fbf9a');
      poly([[pTot[0]-S*0.35, pTot[1]-S*0.9], [pTot[0], pTot[1]-S*1.65], [pTot[0]+S*0.35, pTot[1]-S*0.9]], '#f97316');
      poly([[pTot[0]-S*0.18, pTot[1]-S*0.9], [pTot[0], pTot[1]-S*1.35], [pTot[0]+S*0.18, pTot[1]-S*0.9]], '#fde047');
    }
    else if (theme === 'gothic') {
      // Bubbling Witches' Iron Cauldron & Emerald Potion Vapor Hub
      const pCaul = P(0, 0, zDeck + 1.0);
      disc(pCaul, S * 1.05, '#18181b', '#7e22ce', S * 0.08);
      ell([pCaul[0], pCaul[1] - S * 0.55], S * 0.92, S * 0.36, '#10b981', '#a855f7', S * 0.07);
      disc([pCaul[0]-S*0.25, pCaul[1]-S*1.05], S * 0.22, 'rgba(52, 211, 153, 0.75)');
      disc([pCaul[0]+S*0.22, pCaul[1]-S*1.35], S * 0.28, 'rgba(168, 85, 247, 0.70)');
    }
    else if (theme === 'bavarian') {
      // Giant Oktoberfest Wooden Beer Keg + Spiral Blue/White Maibaum Pole
      const pKeg = P(0, 0, zDeck + 0.95);
      ell(pKeg, S * 0.92, S * 0.85, '#92400e', '#f5c542', S * 0.07);
      line(pKeg, [pKeg[0], pKeg[1] - S * 1.9], '#2563eb', S * 0.22);
      line(pKeg, [pKeg[0], pKeg[1] - S * 1.9], '#ffffff', S * 0.09);
      ell([pKeg[0], pKeg[1] - S * 1.35], S * 0.65, S * 0.24, null, '#15803d', S * 0.12);
    }
    else {
      // Medieval, Alps, Fiesta, Nordic: Ornate Crown / Cowbell / Sombrero / Mjölnir Hub
      const pHub = P(0, 0, zDeck + 1.05);
      disc(pHub, S * 0.95, meta.border, '#facc15', S * 0.08);
      disc([pHub[0], pHub[1] - S * 0.85], S * 0.45, '#facc15', '#78350f', S * 0.06);
    }
  };

  // =========================================================================
  // 5. BESPOKE SPINNING CUP / VESSEL DRAWER (`drawSpinningVessel`) — ALL 16 THEMES!
  // =========================================================================
  const drawSpinningVessel = (cup) => {
    const pBase = P(cup.X, cup.Y, zDeck + 0.03);
    const px = pBase[0], py = pBase[1];

    // Contact shadow on sub-turntable
    ell([px + S * 0.04, py + S * 0.06], S * 0.62, S * 0.30, 'rgba(10, 14, 22, 0.32)');

    // 1. Saucer Base Plate (underneath every cup/pod)
    const saucerCol = (theme === 'space' || theme === 'retro_future') ? '#0f172a'
                    : (theme === 'gothic') ? '#27272a' : '#f8fafc';
    ell([px, py], S * 0.66, S * 0.34, saucerCol, trimCol, S * 0.05);

    const hDir = Math.cos(cup.selfSpin) >= 0 ? 1 : -1;

    // 2. Theme-Specific Vessel Bodywork
    if (theme === 'bavarian') {
      // BAVARIAN: Dimpled Oktoberfest Beer Steins (Maßkrüge) with Glass Handles & Overflowing Foam!
      const mw = S * 0.44, mh = S * 0.68;
      // Glass mug handle rotating around the stein
      ctx.strokeStyle = '#e0f2fe'; ctx.lineWidth = S * 0.10;
      ctx.beginPath(); ctx.arc(px + hDir * mw * 0.92, py - mh * 0.45, S * 0.22, -Math.PI*0.45, Math.PI*0.45); ctx.stroke();
      // Amber glass stein cylinder
      poly([[px - mw, py - mh], [px + mw, py - mh], [px + mw*0.92, py - S*0.04], [px - mw*0.92, py - S*0.04]], '#f59e0b', '#fef3c7', S * 0.05);
      // Pewter base rim
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(px - mw * 0.96, py - S * 0.12, mw * 1.92, S * 0.09);
      // Riders & overflowing white beer foam head!
      [-0.16, 0.16].forEach((ox, rIdx) => {
        disc([px + ox * S, py - mh - S * 0.14], S * 0.12, '#fde4c8', '#1e293b', S * 0.025);
      });
      [-0.30, 0, 0.30].forEach((fx, i) => {
        disc([px + fx * S, py - mh - (i === 1 ? S * 0.04 : 0)], S * 0.17, '#ffffff');
      });
    }
    else if (theme === 'western' || theme === 'frontier' || theme === 'caribbean' || theme === 'nordic') {
      // WESTERN / FRONTIER / CARIBBEAN / NORDIC: Staved Wooden Whiskey / Rum / Mead Barrels!
      const bCol = theme === 'nordic' ? '#451a03' : theme === 'caribbean' ? '#5a3a22' : '#92400e';
      const hoop = (theme === 'caribbean' || theme === 'nordic') ? '#f59e0b' : '#334155';
      ell([px, py - S * 0.34], S * 0.52, S * 0.44, bCol, '#291509', S * 0.05);
      ell([px, py - S * 0.22], S * 0.50, S * 0.18, null, hoop, S * 0.06);
      ell([px, py - S * 0.48], S * 0.50, S * 0.18, null, hoop, S * 0.06);
      ell([px, py - S * 0.62], S * 0.44, S * 0.18, '#291509', hoop, S * 0.05);
    }
    else if (theme === 'gothic') {
      // GOTHIC: Cast-Iron Bubbling Witches' Cauldrons with Glowing Green/Violet Brew!
      disc([px, py - S * 0.34], S * 0.50, '#18181b', '#71717a', S * 0.05);
      ell([px, py - S * 0.62], S * 0.44, S * 0.18, cup.idx % 2 === 0 ? '#10b981' : '#a855f7', '#52525b', S * 0.05);
    }
    else if (theme === 'space' || theme === 'retro_future') {
      // SPACE & RETRO-FUTURE: Sleek Flying Saucers / Orbital Gyro-Pods with Neon Ring!
      ell([px, py - S * 0.26], S * 0.62, S * 0.28, cup.col, '#ffffff', S * 0.05);
      ell([px, py - S * 0.42], S * 0.46, S * 0.22, '#0f172a', '#22d3ee', S * 0.05);
    }
    else if (theme === 'tiki') {
      // TIKI: Carved Polynesian Coconut Cups with Hibiscus Flowers & Bamboo Straws!
      disc([px, py - S * 0.34], S * 0.48, cup.col, '#291509', S * 0.05);
      ell([px, py - S * 0.60], S * 0.42, S * 0.17, '#3e2716', '#d9a74a', S * 0.05);
      disc([px + hDir * S * 0.36, py - S * 0.52], S * 0.12, '#ec4899');
    }
    else if (theme === 'fiesta') {
      // FIESTA: Hand-Painted Terracotta Jarritos & Talavera Bowls!
      poly([[px - S*0.36, py - S*0.64], [px + S*0.36, py - S*0.64], [px + S*0.48, py - S*0.28], [px + S*0.32, py - S*0.04], [px - S*0.32, py - S*0.04], [px - S*0.48, py - S*0.28]], cup.col, '#fde047', S * 0.05);
      ell([px, py - S * 0.64], S * 0.36, S * 0.15, '#fef3c7', '#e11d48', S * 0.04);
    }
    else {
      // STANDARD, CLASSIC MIDWAY, AMERICANA, JUNGLE, MEDIEVAL, ALPS:
      // Classic Sculpted Porcelain Teacup / Goblet with C-Shaped Ear Handle!
      ctx.strokeStyle = cup.col; ctx.lineWidth = S * 0.09;
      ctx.beginPath(); ctx.arc(px + hDir * S * 0.44, py - S * 0.36, S * 0.18, -Math.PI*0.45, Math.PI*0.45); ctx.stroke();
      poly([
        [px - S*0.50, py - S*0.62], [px + S*0.50, py - S*0.62],
        [px + S*0.38, py - S*0.14], [px + S*0.22, py - S*0.04],
        [px - S*0.22, py - S*0.04], [px - S*0.38, py - S*0.14]
      ], cup.col, '#ffffff', S * 0.045);
      // Gold filigree stripe & open cup rim
      ell([px, py - S * 0.34], S * 0.44, S * 0.14, null, '#facc15', S * 0.05);
      ell([px, py - S * 0.62], S * 0.50, S * 0.19, shade(cup.col, -0.35), '#ffffff', S * 0.045);
    }

    // 3. Center Turntable Spinner Wheel + 2 Riders inside the Cup (except Bavarian which draws foam/riders above)
    if (theme !== 'bavarian') {
      const shirts = ['#ef4444', '#3b82f6', '#22c55e', '#facc15', '#a855f7'];
      [-0.18, 0.18].forEach((ox, rIdx) => {
        const rx = px + ox * S, ry = py - S * 0.72;
        disc([rx, ry + S * 0.12], S * 0.13, shirts[(cup.idx + rIdx) % 5]);
        disc([rx, ry], S * 0.11, (theme === 'space' || theme === 'retro_future') ? '#ffffff' : '#fde4c8', '#1e293b', S * 0.025);
      });
      // Center hand-spinner disc inside the cup
      line([px, py - S * 0.55], [px, py - S * 0.74], '#cbd5e1', S * 0.05);
      ell([px, py - S * 0.74], S * 0.16, S * 0.08, '#facc15', '#1e293b', S * 0.03);
    }
  };

  // =========================================================================
  // 6. STRICT BACK-TO-FRONT DEPTH SORTING OF ALL 9 VESSELS + CENTRAL HUB
  // =========================================================================
  const renderQueue = [];
  renderQueue.push({ depth: 0, draw: drawCentralHub });
  allCups.forEach(cup => {
    renderQueue.push({ depth: cup.depth, draw: () => drawSpinningVessel(cup) });
  });
  renderQueue.sort((a, b) => a.depth - b.depth).forEach(item => item.draw());

  // Front perimeter safety guardrail posts (in front of the cups)
  for (let i = 0; i < nPosts; i++) {
    const a = (i / nPosts) * TAU;
    const nx = Math.cos(a), ny = Math.sin(a);
    if (nx + ny < 0) continue;
    const px = nx * (Rmain + 0.20), py = ny * (Rmain + 0.20);
    line(P(px, py, 0.12), P(px, py, 0.98), '#1e293b', S * 0.10);
    disc(P(px, py, 1.00), S * 0.08, trimCol);
  }

  // 7. Optional Overhead Lantern / Pavilion Canopy (`canopyAlpha > 0`)
  if (canopyAlpha > 0.01) {
    ctx.save();
    ctx.globalAlpha = canopyAlpha;
    const zEave = 3.45, zPeak = 5.15;
    // 6 slim corner posts
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * TAU + Math.PI / 6;
      const px = Math.cos(a) * (Rmain + 0.15), py = Math.sin(a) * (Rmain + 0.15);
      line(P(px, py, 0.2), P(px, py, zEave), trimCol, S * 0.12);
    }
    // Striped octagonal pavilion canopy
    const pPeak = P(0, 0, zPeak);
    const nGores = 12;
    for (let g = 0; g < nGores; g++) {
      const a0 = (g / nGores) * TAU, a1 = ((g + 1) / nGores) * TAU;
      const p0 = P(Math.cos(a0) * (Rmain + 0.35), Math.sin(a0) * (Rmain + 0.35), zEave);
      const p1 = P(Math.cos(a1) * (Rmain + 0.35), Math.sin(a1) * (Rmain + 0.35), zEave);
      poly([p0, p1, pPeak], g % 2 === 0 ? meta.roof : '#fffbeb', trimCol, S * 0.05);
    }
    ctx.restore();
  }

  ctx.restore();
}
window.drawTeacups = drawTeacups;
})();
