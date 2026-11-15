(function() {
"use strict";
/* ===== SHARED COLOR & ISOMETRIC HELPERS (skip if already in engine.js) ===== */
function mulberry(a) {
  return function() {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function shade(hex, amt) {
  if (!hex || hex[0] !== '#') return hex || '#888888';
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = c => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

function hexPath(ctx, cx, cy, R, scale = 1) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i + 30);
    const px = cx + R * scale * Math.cos(a);
    const py = cy + R * scale * Math.sin(a) * 0.58;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

/* ===== WEENIE METADATA ===== */
const WEENIE_CATALOG = {
  pyramid: {
    id: 'pyramid',
    fnName: 'drawWeenieEgyptPyramid',
    themeLabel: 'EGYPT WEENIE #1',
    title: 'The Great Pyramid of Giza (2500 BC)',
    sub: 'Polished White Tura Limestone & Solid Gold Capstone',
    desertCol: '#e4c484',
    desertRim: '#c49d56',
    desc: 'Reconstructed at the height of the Old Kingdom (c. 2500 BC): clad in gleaming, mirror-smooth white Tura limestone casing blocks with subtle horizontal masonry courses, warm sunlit ivory on the front-left face, and cool desert-sky shadow on the right face. Crowned with a radiant faceted solid gold/electrum pyramidion capstone, flanked by twin rose-granite obelisks, mortuary temple pylons, palm trees, and a ceremonial limestone causeway.'
  },
  sphinx: {
    id: 'sphinx',
    fnName: 'drawWeenieEgyptSphinx',
    themeLabel: 'EGYPT WEENIE #2',
    title: 'The Great Sphinx of Giza (2000 BC Polychrome)',
    sub: 'Full Ancient Painted Colors, Lapis Nemes & Dream Stele',
    desertCol: '#e4c484',
    desertRim: '#c49d56',
    desc: 'Depicted in its vibrant Middle Kingdom (2000 BC) polychrome painted splendor before millennia of sand erosion: a monumental recumbent lion painted in rich warm terracotta-ochre with sculpted haunches, curled tail, and outstretched paws. Features the royal Pharaoh head with intact nose, kohl-rimmed eyes, braided ceremonial beard, golden uraeus cobra, and brilliant lapis-lazuli blue & gold striped Nemes headdress. Between its forepaws stands the painted red-and-gold Dream Stele flanked by twin burning incense braziers.'
  },
  ziggurat: {
    id: 'ziggurat',
    fnName: 'drawWeenieBabylonZiggurat',
    themeLabel: 'BABYLON WEENIE',
    title: 'Great Ziggurat of Babylon (Etemenanki)',
    sub: 'Tiered Tan Mudbrick Blocks, Triple Stairways & Blue Summit Shrine',
    desertCol: '#dfc088',
    desertRim: '#b5894c',
    desc: 'Inspired by Etemenanki ("Temple of the Foundation of Heaven and Earth"): a towering six-stage stepped Mesopotamian ziggurat constructed from hundreds of individual tan and sun-baked ochre mudbrick blocks with battered vertical buttress pilasters and recessed arched niches. Features the iconic triple staircase system—a grand central ramp flanked by twin angled side stairs converging on the main terrace gatehouse—crenellated parapets with crimson pennants, and the glazed lapis-lazuli blue summit temple adorned with gold rosette medallions.'
  }
};

/* ===== SHARED DRAWING PRIMITIVES FOR ANCIENT WEENIES ===== */
function makeWeenieContext(ctx, cx, cy, R, opts) {
  const flip = !!opts.flip;
  const groundMode = opts.ground || 'desert';
  // Scale factor `u` tuned so a 1-hex / grand weenie landmark commands the tile with crisp architectural relief
  const u = R * 0.088;
  const cyB = cy + (opts.oy != null ? opts.oy : R * 0.04);

  // Two-angle isometric projection:
  // +X = front-right axis (shaded side), +Y = front-left axis (sunlit face), +Z = vertical elevation
  const I = (X, Y, Z) => [cx + (X - Y) * 0.7 * u, cyB + (X + Y) * 0.35 * u - Z * u];

  const poly = (pts, fill, stroke, lw) => {
    ctx.beginPath();
    pts.forEach((p, idx) => (idx ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || u * 0.05; ctx.lineJoin = 'round'; ctx.stroke(); }
  };

  const ln = (a, b, col, w) => {
    ctx.strokeStyle = col;
    ctx.lineWidth = w || u * 0.06;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  };

  const ell = (x, y, rx, ry, fill, rot = 0, stroke, lw) => {
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(0.2, rx), Math.max(0.2, ry), rot, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || u * 0.05; ctx.stroke(); }
  };

  const box = (x0, x1, y0, y1, z0, z1, colFront, colRight, colTop, stroke, lw) => {
    poly([I(x0, y1, z0), I(x1, y1, z0), I(x1, y1, z1), I(x0, y1, z1)], colFront, stroke, lw);
    poly([I(x1, y0, z0), I(x1, y1, z0), I(x1, y1, z1), I(x1, y0, z1)], colRight || shade(colFront, -0.24), stroke, lw);
    if (colTop !== false) {
      poly([I(x0, y0, z1), I(x1, y0, z1), I(x1, y1, z1), I(x0, y1, z1)], colTop || shade(colFront, 0.14), stroke, lw);
    }
  };

  const drawPalm = (X, Y, Z, scale = 1, seed = 101) => {
    const rnd = mulberry(seed);
    const pBase = I(X, Y, Z);
    const h = u * 2.45 * scale;
    const lean = (rnd() - 0.5) * u * 0.55 * scale;
    const pTop = [pBase[0] + lean, pBase[1] - h];

    // Soft cast shadow on sand
    ell(pBase[0] + u * 0.25 * scale, pBase[1] + u * 0.06 * scale, u * 0.65 * scale, u * 0.28 * scale, 'rgba(30, 22, 12, 0.22)');

    // Curved textured palm trunk
    ctx.strokeStyle = '#6d4728';
    ctx.lineWidth = u * 0.16 * scale;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(pBase[0], pBase[1]);
    ctx.quadraticCurveTo(pBase[0] + lean * 0.35, pBase[1] - h * 0.55, pTop[0], pTop[1]);
    ctx.stroke();

    // Frond crown
    const nFronds = 7;
    for (let k = 0; k < nFronds; k++) {
      const ang = (k / nFronds) * Math.PI * 2 + 0.3;
      const len = u * (0.85 + (k % 2) * 0.22) * scale;
      const ex = pTop[0] + Math.cos(ang) * len;
      const ey = pTop[1] + Math.sin(ang) * len * 0.52 + u * 0.28 * scale;
      ctx.strokeStyle = k % 2 ? '#2f7a3e' : '#439652';
      ctx.lineWidth = u * 0.11 * scale;
      ctx.beginPath();
      ctx.moveTo(pTop[0], pTop[1]);
      ctx.quadraticCurveTo(pTop[0] + Math.cos(ang) * len * 0.55, pTop[1] - u * 0.26 * scale, ex, ey);
      ctx.stroke();
    }
  };

  const paintBaseHex = (meta) => {
    if (groundMode === 'none') return;
    hexPath(ctx, cx, cy, R);
    if (groundMode === 'grass') {
      ctx.fillStyle = '#7ea656';
      ctx.fill();
      ctx.lineWidth = Math.max(1.5, R * 0.025);
      ctx.strokeStyle = '#5a7d39';
      ctx.stroke();
    } else {
      ctx.fillStyle = meta.desertCol || '#e4c484';
      ctx.fill();
      ctx.lineWidth = Math.max(1.5, R * 0.025);
      ctx.strokeStyle = meta.desertRim || '#c49d56';
      ctx.stroke();
    }
  };

  return { flip, groundMode, u, cyB, I, poly, ln, ell, box, drawPalm, paintBaseHex };
}

/* ============================================================================
   1. WEENIE SPRITE: THE GREAT PYRAMID OF GIZA (2500 BC White Tura Limestone & Gold Tip)
   ============================================================================ */
function drawWeenieEgyptPyramid(ctx, cx, cy, R, opts = {}) {
  const meta = WEENIE_CATALOG.pyramid;
  // Centered right on the hex tile with zero vertical drop offset
  const g = makeWeenieContext(ctx, cx, cy, R, Object.assign({ oy: R * 0.02 }, opts));
  const { u, I, poly, ln, ell, box, paintBaseHex } = g;

  ctx.save();
  if (g.flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  paintBaseHex(meta);

  // Soft cast shadow to the east/right of the pyramid
  poly([I(4.7, -4.7, 0), I(6.8, -1.4, 0), I(5.6, 3.8, 0), I(1.1, 4.7, 0)], 'rgba(25, 22, 16, 0.24)');

  // Stepped sandstone perimeter courtyard plinth centered on (0, 0)
  box(-4.85, 4.85, -4.85, 4.85, 0, 0.28, '#e3c78e', '#c2a266', '#f2dcb0');

  // Ceremonial limestone processional causeway extending toward front-left (+Y)
  box(-0.95, 0.95, 4.85, 6.25, 0, 0.22, '#efe2c6', '#cbb894', '#faf3e3');
  ln(I(-0.85, 4.85, 0.26), I(-0.85, 6.20, 0.26), '#d6c39e', u * 0.12);
  ln(I(0.85, 4.85, 0.26), I(0.85, 6.20, 0.26), '#d6c39e', u * 0.12);

  // Wider & Taller Pyramid Geometry centered at (0, 0):
  // Half-base B = 4.6, Total Apex Height H = 8.8, Gold Capstone starts at zCap = 7.35
  const B = 4.60;
  const H = 8.80;
  const zCap = 7.35;
  const fCap = zCap / H; // fraction up from base where gold pyramidion starts
  const bCap = B * (1 - fCap);

  const pSW = I(-B, B, 0.28);   // Front-left corner
  const pSE = I(B, B, 0.28);    // Front-most bottom corner
  const pNE = I(B, -B, 0.28);   // Back-right corner
  const pApex = I(0, 0, 0.28 + H);

  // Gold capstone base corners
  const cSW = I(-bCap, bCap, 0.28 + zCap);
  const cSE = I(bCap, bCap, 0.28 + zCap);
  const cNE = I(bCap, -bCap, 0.28 + zCap);

  // Sunlit Front-Left Face (+Y): Gleaming polished white Tura limestone
  const gradLeft = ctx.createLinearGradient(pApex[0], pApex[1], pSW[0], pSE[1]);
  gradLeft.addColorStop(0, '#ffffff');
  gradLeft.addColorStop(0.55, '#faf6ec');
  gradLeft.addColorStop(1, '#ede3ce');
  poly([pSW, pSE, cSE, cSW], gradLeft);

  // Shaded Front-Right Face (+X): Cool alabaster-sandstone shadow slope
  const gradRight = ctx.createLinearGradient(pApex[0], pApex[1], pNE[0], pSE[1]);
  gradRight.addColorStop(0, '#dcd5c7');
  gradRight.addColorStop(0.6, '#c7beae');
  gradRight.addColorStop(1, '#b2a795');
  poly([pSE, pNE, cNE, cSE], gradRight);

  // Subtle Tura limestone casing courses (fine horizontal block joints, not heavy outlines)
  const nCourses = 16;
  for (let k = 1; k < nCourses; k++) {
    const t = (k / nCourses) * fCap;
    const bk = B * (1 - t);
    const zk = 0.28 + H * t;
    ln(I(-bk, bk, zk), I(bk, bk, zk), 'rgba(165, 148, 118, 0.26)', u * 0.032);
    ln(I(bk, bk, zk), I(bk, -bk, zk), 'rgba(95, 88, 76, 0.26)', u * 0.032);
  }

  // Ceremonial North/Front Entrance Chapel & Chevron Portal at base of +Y face
  box(-0.74, 0.74, B - 0.15, B + 0.35, 0.28, 1.38, '#f2e8d5', '#cbbda4', '#ffffff');
  poly([I(-0.35, B + 0.36, 0.28), I(0.35, B + 0.36, 0.28), I(0.35, B + 0.36, 0.94), I(0, B + 0.36, 1.20), I(-0.35, B + 0.36, 0.94)], '#2b241d');

  // Crisp edge highlight down the central arris ridge separating sunlit and shaded faces
  ln(cSE, pSE, 'rgba(255, 255, 255, 0.75)', u * 0.055);

  // SOLID GOLD / ELECTRUM PYRAMIDION CAPSTONE (2500 BC)
  const goldLeft = ctx.createLinearGradient(pApex[0], pApex[1], cSE[0], cSE[1]);
  goldLeft.addColorStop(0, '#fef9c3');
  goldLeft.addColorStop(0.45, '#facc15');
  goldLeft.addColorStop(1, '#eab308');
  poly([cSW, cSE, pApex], goldLeft);

  const goldRight = ctx.createLinearGradient(pApex[0], pApex[1], cNE[0], cNE[1]);
  goldRight.addColorStop(0, '#f59e0b');
  goldRight.addColorStop(1, '#b45309');
  poly([cSE, cNE, pApex], goldRight);

  // Specular sun glint star on the gold capstone ridge
  ln(pApex, cSE, '#fef9c3', u * 0.05);
  ell(pApex[0] - u * 0.05, pApex[1] + u * 0.35, u * 0.22, u * 0.06, 'rgba(255,255,255,0.85)');
  ell(pApex[0] - u * 0.05, pApex[1] + u * 0.35, u * 0.06, u * 0.22, 'rgba(255,255,255,0.85)');

  // Twin Rose-Granite Obelisks with Gold Tips flanking the entrance causeway
  [-1.75, 1.75].forEach(ox => {
    box(ox - 0.28, ox + 0.28, 4.70, 5.26, 0.28, 0.65, '#b87a56', '#8c583a', '#d49672');
    // Tapered obelisk shaft
    poly([I(ox - 0.20, 5.17, 0.65), I(ox + 0.20, 5.17, 0.65), I(ox + 0.13, 5.10, 2.40), I(ox - 0.13, 5.10, 2.40)], '#c98863');
    poly([I(ox + 0.20, 4.79, 0.65), I(ox + 0.20, 5.17, 0.65), I(ox + 0.13, 5.10, 2.40), I(ox + 0.13, 4.86, 2.40)], '#966042');
    // Gold obelisk tip
    const oTip = I(ox, 4.98, 2.80);
    poly([I(ox - 0.13, 5.10, 2.40), I(ox + 0.13, 5.10, 2.40), oTip], '#facc15');
    poly([I(ox + 0.13, 4.86, 2.40), I(ox + 0.13, 5.10, 2.40), oTip], '#ca8a04');
  });

  ctx.restore();
}

/* ============================================================================
   2. WEENIE SPRITE: THE GREAT SPHINX OF GIZA (2000 BC Polychrome Painted Glory)
   ============================================================================ */
function drawWeenieEgyptSphinx(ctx, cx, cy, R, opts = {}) {
  const meta = WEENIE_CATALOG.sphinx;
  // Shifted upward (-0.07 * R, i.e., ~ -0.11 * R higher than the default +0.04 * R baseline)
  // so the recumbent lion body, paws, Nemes headdress, and Dream Stele sit dead-center inside the hex tile
  const g = makeWeenieContext(ctx, cx, cy, R, Object.assign({ oy: -R * 0.07 }, opts));
  const { u, I, poly, ln, ell, box, drawPalm, paintBaseHex } = g;

  ctx.save();
  if (g.flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  paintBaseHex(meta);

  // Temple Forecourt Sandstone Base Platform (centered symmetrically on Y = 0)
  box(-3.6, 3.6, -4.6, 4.6, 0, 0.30, '#e3c78e', '#c2a266', '#f3dfb6');
  // Recessed Sanctuary Pit Floor
  poly([I(-3.1, -4.1, 0.31), I(3.1, -4.1, 0.31), I(3.1, 4.1, 0.31), I(-3.1, 4.1, 0.31)], '#d9b87c');

  // Rear palm trees behind the Sphinx enclosure
  drawPalm(-3.4, -4.2, 0.30, 0.85, 401);
  drawPalm(3.2, -4.1, 0.30, 0.90, 402);

  // Soft cast shadow under the colossal lion body
  ell(I(0.55, -0.2, 0.31)[0], I(0.55, -0.2, 0.31)[1], u * 4.2, u * 2.1, 'rgba(35, 25, 14, 0.26)', -0.38);

  // Polychrome 2000 BC Lion Body Color Palette (Rich Terracotta-Ochre & Warm Limestone)
  const lionMain = '#d48244';
  const lionDark = '#9e5826';
  const lionLight = '#e89e62';
  const nemesBlue = '#1d4ed8';
  const nemesGold = '#facc15';
  const faceRed = '#c85a32';

  // 1. Rear Lion Haunches & Curled Tail (-Y = back, +Y = front)
  box(-1.55, 1.55, -3.9, -1.5, 0.30, 2.45, lionMain, lionDark, lionLight);
  const pHaunchR = I(1.55, -2.7, 1.45);
  ell(pHaunchR[0], pHaunchR[1], u * 1.15, u * 0.95, lionDark, -0.35);
  const pHaunchTop = I(0, -2.7, 2.55);
  ell(pHaunchTop[0], pHaunchTop[1], u * 1.45, u * 0.85, lionLight, -0.35);

  // Curled lion tail sweeping up over the right haunch
  ctx.strokeStyle = '#7c3f16';
  ctx.lineWidth = u * 0.22;
  ctx.lineCap = 'round';
  ctx.beginPath();
  const t0 = I(1.58, -3.6, 0.85);
  const t1 = I(1.64, -2.8, 2.15);
  const t2 = I(1.58, -2.1, 1.75);
  ctx.moveTo(t0[0], t0[1]);
  ctx.quadraticCurveTo(t1[0], t1[1], t2[0], t2[1]);
  ctx.stroke();

  // 2. Central Ribbed Lion Torso & Spine
  box(-1.42, 1.42, -1.7, 1.05, 0.30, 2.65, lionMain, lionDark, lionLight);
  for (let ry = -1.3; ry <= 0.6; ry += 0.45) {
    ln(I(1.43, ry, 0.75), I(1.43, ry, 2.25), 'rgba(95, 45, 15, 0.28)', u * 0.045);
  }

  // 3. Monumental Extended Lion Forelegs & Sculpted Paws (+Y = 0.85 to 3.85)
  [-1.12, 1.12].forEach((px) => {
    box(px - 0.38, px + 0.38, 0.85, 3.25, 0.30, 1.05, lionMain, lionDark, lionLight);
    box(px - 0.46, px + 0.46, 3.15, 3.85, 0.30, 0.88, lionLight, lionDark, '#f2b279');
    [-0.24, 0, 0.24].forEach(tx => {
      ln(I(px + tx, 3.86, 0.32), I(px + tx, 3.86, 0.78), lionDark, u * 0.045);
    });
  });

  // 4. The Dream Stele & Ceremonial Offering Altar (between the extended front paws)
  box(-0.56, 0.56, 1.15, 1.42, 0.30, 1.95, '#991b1b', '#6b1212', '#b91c1c');
  const stTop = I(0, 1.32, 1.95);
  ell(stTop[0], stTop[1], u * 0.42, u * 0.28, '#991b1b');
  ell(stTop[0], stTop[1] - u * 0.04, u * 0.16, u * 0.16, '#facc15');
  poly([I(-0.42, 1.43, 0.45), I(0.42, 1.43, 0.45), I(0.42, 1.43, 1.78), I(-0.42, 1.43, 1.78)], '#b91c1c', '#facc15', u * 0.045);

  box(-0.48, 0.48, 2.15, 2.85, 0.30, 0.72, '#e2d2b5', '#b8a482', '#f5ebd6');
  [-0.72, 0.72].forEach(bx => {
    const bp = I(bx, 3.45, 0.62);
    box(bx - 0.16, bx + 0.16, 3.30, 3.60, 0.30, 0.62, '#d97706', '#92400e', '#f59e0b');
    ell(bp[0], bp[1] - u * 0.14, u * 0.14, u * 0.22, '#f97316');
    ell(bp[0], bp[1] - u * 0.10, u * 0.07, u * 0.12, '#fef08a');
  });

  // 5. Colossal Pharaoh Chest & Lapis-Lazuli + Gold Striped Nemes Headdress (Z = 2.4 to 5.65)
  poly([
    I(-1.65, 0.65, 2.35),
    I(-1.95, 0.45, 4.15),
    I(-1.15, 0.35, 5.45),
    I(1.15, 0.35, 5.45),
    I(1.95, 0.45, 4.15),
    I(1.65, 0.65, 2.35)
  ], nemesBlue);

  poly([
    I(0.85, 0.95, 2.25),
    I(1.65, 0.65, 2.35),
    I(1.95, 0.45, 4.15),
    I(1.15, 0.35, 5.45),
    I(0.75, 1.05, 4.85)
  ], '#1e3a8a');

  for (let s = 0; s < 7; s++) {
    const zs = 2.55 + s * 0.38;
    const wSpread = 1.55 + Math.sin((s / 6) * Math.PI) * 0.35;
    ln(I(-wSpread, 0.72, zs), I(-0.75, 1.08, zs + 0.08), s % 2 === 0 ? nemesGold : '#60a5fa', u * 0.10);
    ln(I(0.75, 1.08, zs + 0.08), I(wSpread, 0.65, zs), s % 2 === 0 ? '#eab308' : '#3b82f6', u * 0.10);
  }
  ln(I(-1.05, 0.95, 5.05), I(1.05, 0.95, 5.05), nemesGold, u * 0.13);
  ln(I(-0.85, 0.85, 5.32), I(0.85, 0.85, 5.32), nemesGold, u * 0.11);

  // 6. Sculpted Royal Pharaoh Face (Warm Terracotta-Red 2000 BC Pigment, Intact Nose & Braided Beard)
  poly([
    I(-0.78, 1.18, 4.75),
    I(0.78, 1.18, 4.75),
    I(0.68, 1.25, 3.65),
    I(0, 1.32, 3.22),
    I(-0.68, 1.25, 3.65)
  ], faceRed);
  poly([
    I(0, 1.25, 4.75),
    I(0.78, 1.18, 4.75),
    I(0.68, 1.25, 3.65),
    I(0, 1.32, 3.22)
  ], '#a64422');

  const pCobra = I(0, 1.22, 4.92);
  ell(pCobra[0], pCobra[1], u * 0.14, u * 0.24, '#facc15');
  ell(pCobra[0], pCobra[1] - u * 0.05, u * 0.07, u * 0.09, '#dc2626');

  [-0.34, 0.34].forEach(ex => {
    const ep = I(ex, 1.26, 4.32);
    ln(I(ex - 0.16, 1.25, 4.50), I(ex + 0.16, 1.25, 4.50), '#1e3a8a', u * 0.065);
    ell(ep[0], ep[1], u * 0.13, u * 0.065, '#ffffff');
    ell(ep[0], ep[1], u * 0.06, u * 0.06, '#0f172a');
  });

  poly([I(0, 1.30, 4.32), I(-0.11, 1.36, 3.88), I(0.11, 1.36, 3.88)], '#e07248');
  ln(I(-0.22, 1.32, 3.58), I(0.22, 1.32, 3.58), '#7c2d12', u * 0.055);

  box(-0.18, 0.18, 1.15, 1.42, 2.25, 3.25, '#1d4ed8', '#1e3a8a', '#3b82f6');
  for (let bz = 2.40; bz <= 3.10; bz += 0.22) {
    ln(I(-0.18, 1.43, bz), I(0.18, 1.43, bz), '#facc15', u * 0.05);
  }

  ctx.restore();
}

/* ============================================================================
   3. WEENIE SPRITE: GREAT ZIGGURAT OF BABYLON (ETEMENANKI)
      Tan Mudbrick Masonry, Triple Monumental Stairways & Blue Summit Shrine
   ============================================================================ */
function drawWeenieBabylonZiggurat(ctx, cx, cy, R, opts = {}) {
  const meta = WEENIE_CATALOG.ziggurat;
  const g = makeWeenieContext(ctx, cx, cy, R, opts);
  const { u, I, poly, ln, ell, box, drawPalm, paintBaseHex } = g;

  ctx.save();
  if (g.flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  paintBaseHex(meta);

  // Cast shadow to the east/right
  poly([I(4.2, -4.2, 0), I(6.3, -1.0, 0), I(5.0, 3.9, 0), I(1.2, 4.2, 0)], 'rgba(28, 22, 14, 0.26)');

  // Outer Babylonian sanctuary brick courtyard
  box(-4.6, 4.6, -4.6, 4.6, 0, 0.24, '#d9b882', '#b5925a', '#ebd09e');

  // Corner glazed-blue Ishtar-style guardian bastions flanking the forecourt
  [[-3.95, 3.95], [3.95, 3.95], [3.95, -3.95]].forEach(([bx, by]) => {
    box(bx - 0.52, bx + 0.52, by - 0.52, by + 0.52, 0.24, 1.35, '#1e3a8a', '#172554', '#2563eb');
    ln(I(bx - 0.52, by + 0.52, 1.15), I(bx + 0.52, by + 0.52, 1.15), '#facc15', u * 0.05);
    ln(I(bx + 0.52, by - 0.52, 1.15), I(bx + 0.52, by + 0.52, 1.15), '#eab308', u * 0.05);
  });

  // Palm trees in the temple gardens
  drawPalm(-4.1, -3.7, 0.24, 0.85, 501);
  drawPalm(4.1, 2.3, 0.24, 0.78, 502);

  // -------------------------------------------------------------------------
  // FIVE STEPPED TAN MUDBRICK TERRACES (Inspired by Etemenanki reference)
  // -------------------------------------------------------------------------
  const tiers = [
    { b: 4.15, z0: 0.24, z1: 2.05, cF: '#e6c58e', cR: '#c29e65', cT: '#f2d9ad' },
    { b: 3.30, z0: 2.05, z1: 3.55, cF: '#ebd09e', cR: '#c7a46b', cT: '#f7e3be' },
    { b: 2.55, z0: 3.55, z1: 4.85, cF: '#e3c086', cR: '#bd985e', cT: '#f2d7a7' },
    { b: 1.88, z0: 4.85, z1: 5.95, cF: '#edd2a1', cR: '#c9a66d', cT: '#f9e6c3' },
    { b: 1.32, z0: 5.95, z1: 6.85, cF: '#e6c58e', cR: '#c09b61', cT: '#f4dcb0' }
  ];

  tiers.forEach((tr, tIdx) => {
    const B = tr.b;
    box(-B, B, -B, B, tr.z0, tr.z1, tr.cF, tr.cR, tr.cT);

    // Individual tan mudbrick courses & staggered block masonry texture
    const hTier = tr.z1 - tr.z0;
    const nRows = Math.max(3, Math.round(hTier / 0.34));
    for (let r = 1; r < nRows; r++) {
      const zr = tr.z0 + (hTier * r) / nRows;
      ln(I(-B, B, zr), I(B, B, zr), 'rgba(130, 95, 48, 0.28)', u * 0.03);
      ln(I(B, -B, zr), I(B, B, zr), 'rgba(85, 60, 28, 0.30)', u * 0.03);
    }

    // Vertical Mesopotamian buttress pilasters & recessed arched wall niches
    const nBut = Math.max(3, Math.floor((B * 2) / 0.95));
    for (let k = 0; k <= nBut; k++) {
      const pos = -B + (2 * B * k) / nBut;
      // Front (+Y) vertical pilaster
      ln(I(pos, B + 0.01, tr.z0), I(pos, B + 0.01, tr.z1), shade(tr.cF, -0.14), u * 0.09);
      // Right (+X) vertical pilaster
      ln(I(B + 0.01, pos, tr.z0), I(B + 0.01, pos, tr.z1), shade(tr.cR, -0.16), u * 0.09);

      // Small arched window/niche between pilasters on lower tiers
      if (k < nBut && tIdx < 4) {
        const mid = pos + B / nBut;
        if (tIdx === 0 && Math.abs(mid) < 1.1) continue; // keep clear for central stairway
        const nw = 0.13, nz0 = tr.z0 + 0.18, nz1 = tr.z0 + hTier * 0.56;
        poly([I(mid - nw, B + 0.02, nz0), I(mid + nw, B + 0.02, nz0), I(mid + nw, B + 0.02, nz1), I(mid, B + 0.02, nz1 + 0.12), I(mid - nw, B + 0.02, nz1)], '#5c3f1d');
        poly([I(B + 0.02, mid - nw, nz0), I(B + 0.02, mid + nw, nz0), I(B + 0.02, mid + nw, nz1), I(B + 0.02, mid, nz1 + 0.12), I(B + 0.02, mid - nw, nz1)], '#3d2811');
      }
    }

    // Crenellated mudbrick parapet teeth along the terrace edges + tiny crimson pennants at corners
    const nMerl = Math.max(4, Math.floor((B * 2) / 0.55));
    for (let m = 0; m < nMerl; m++) {
      const mx = -B + (2 * B * (m + 0.5)) / nMerl;
      box(mx - 0.11, mx + 0.11, B - 0.14, B, tr.z1, tr.z1 + 0.16, tr.cF, tr.cR, tr.cT);
      box(B - 0.14, B, mx - 0.11, mx + 0.11, tr.z1, tr.z1 + 0.16, tr.cF, tr.cR, tr.cT);
    }

    // Tiny red Babylonian banners on corners of terraces
    if (tIdx % 2 === 0) {
      [[-B, B], [B, B], [B, -B]].forEach(([fx, fy]) => {
        const pPoleB = I(fx, fy, tr.z1 + 0.12);
        const pPoleT = I(fx, fy, tr.z1 + 0.62);
        ln(pPoleB, pPoleT, '#451a03', u * 0.04);
        poly([pPoleT, [pPoleT[0] + u * 0.32, pPoleT[1] + u * 0.08], [pPoleT[0], pPoleT[1] + u * 0.22]], '#dc2626');
      });
    }

    // Glazed Lapis-Blue & Gold Gatehouse Portal on the front (+Y) face of upper terraces
    if (tIdx >= 1 && tIdx <= 3) {
      const gw = 0.52;
      box(-gw, gw, B - 0.05, B + 0.24, tr.z0, tr.z1 + 0.22, '#1e3a8a', '#172554', '#2563eb');
      ln(I(-gw, B + 0.25, tr.z1 + 0.12), I(gw, B + 0.25, tr.z1 + 0.12), '#facc15', u * 0.05);
      poly([I(-0.24, B + 0.25, tr.z0), I(0.24, B + 0.25, tr.z0), I(0.24, B + 0.25, tr.z0 + hTier * 0.68), I(0, B + 0.25, tr.z0 + hTier * 0.88), I(-0.24, B + 0.25, tr.z0 + hTier * 0.68)], '#451a03');
    }
  });

  // -------------------------------------------------------------------------
  // GRAND TRIPLE MONUMENTAL STAIRWAY (Central Ramp + Twin Lateral Side Stairs)
  // -------------------------------------------------------------------------
  // Left & Right lateral angled stairs ascending Terrace 1
  [-1, 1].forEach(side => {
    const xStart = side * 3.85;
    const xEnd = side * 0.65;
    const yWall = 4.16;
    const zBot = 0.24;
    const zTop = 2.05;
    // Stair flank wall
    poly([
      I(xStart, yWall + 0.42, zBot),
      I(xEnd, yWall + 0.42, zTop),
      I(xEnd, yWall + 0.42, zBot),
      I(xStart, yWall + 0.42, zBot)
    ], '#d4af72');
    // Stepped tread slope
    poly([
      I(xStart, yWall, zBot),
      I(xEnd, yWall, zTop),
      I(xEnd, yWall + 0.42, zTop),
      I(xStart, yWall + 0.42, zBot)
    ], '#f5e1bc');
    for (let s = 1; s < 9; s++) {
      const f = s / 9;
      const sx = xStart + (xEnd - xStart) * f;
      const sz = zBot + (zTop - zBot) * f;
      ln(I(sx, yWall, sz), I(sx, yWall + 0.42, sz), '#a88248', u * 0.035);
    }
  });

  // Grand Central Processional Staircase rising straight out from the front gate
  const sw = 0.56;
  const yFoot = 5.65;
  const yHead = 3.30;
  const zFoot = 0.24;
  const zHead = 3.55;

  // Left & right stepped balustrade walls of the grand staircase
  [-sw - 0.14, sw].forEach(bx => {
    box(bx, bx + 0.14, yHead, yFoot, zFoot, zFoot + 0.45, '#cfa86b', '#a88248', '#e6c58e');
  });
  // Central staircase ramp & individual horizontal steps
  poly([I(-sw, yFoot, zFoot), I(sw, yFoot, zFoot), I(sw, yHead, zHead), I(-sw, yHead, zHead)], '#f7e6c4');
  // Right-side cheek wall of central stairway
  poly([I(sw, yFoot, zFoot), I(sw, yHead, zHead), I(sw, yHead, zFoot)], '#bd975c');
  const nSteps = 16;
  for (let s = 1; s < nSteps; s++) {
    const f = s / nSteps;
    const sy = yFoot + (yHead - yFoot) * f;
    const sz = zFoot + (zHead - zFoot) * f;
    ln(I(-sw, sy, sz), I(sw, sy, sz), '#9e7840', u * 0.038);
  }

  // -------------------------------------------------------------------------
  // SUMMIT GLAZED LAPIS-LAZULI BLUE ALTAR TEMPLE (SHAHURU / ETEMENANKI SHRINE)
  // -------------------------------------------------------------------------
  const sB = 0.92;
  const sz0 = 6.85;
  const sz1 = 8.15;
  // Vibrant cobalt / lapis-lazuli glazed brick shrine body
  box(-sB, sB, -sB, sB, sz0, sz1, '#1d4ed8', '#1e3a8a', '#3b82f6');

  // Four corner blue bastion towers rising slightly above the shrine roof
  [[-sB, -sB], [sB - 0.34, -sB], [-sB, sB - 0.34], [sB - 0.34, sB - 0.34]].forEach(([tx, ty]) => {
    box(tx, tx + 0.34, ty, ty + 0.34, sz1, sz1 + 0.36, '#2563eb', '#172554', '#60a5fa');
    // Gold medallion dot on front corner towers
    if (ty > 0) {
      const mp = I(tx + 0.17, sB + 0.01, sz1 + 0.18);
      ell(mp[0], mp[1], u * 0.09, u * 0.09, '#facc15');
    }
  });

  // Gold Ishtar frieze band & rosette stars across the summit shrine
  ln(I(-sB, sB + 0.01, sz1 - 0.18), I(sB, sB + 0.01, sz1 - 0.18), '#facc15', u * 0.075);
  ln(I(sB + 0.01, -sB, sz1 - 0.18), I(sB + 0.01, sB, sz1 - 0.18), '#eab308', u * 0.075);

  // Arched golden-framed sanctuary doorway & glowing sacred altar flame inside
  poly([I(-0.26, sB + 0.02, sz0), I(0.26, sB + 0.02, sz0), I(0.26, sB + 0.02, sz0 + 0.72), I(0, sB + 0.02, sz0 + 0.94), I(-0.26, sB + 0.02, sz0 + 0.72)], '#0f172a', '#facc15', u * 0.045);
  const pFlame = I(0, sB + 0.03, sz0 + 0.28);
  ell(pFlame[0], pFlame[1], u * 0.11, u * 0.18, '#f97316');
  ell(pFlame[0], pFlame[1] + u * 0.03, u * 0.055, u * 0.10, '#fef08a');

  // Stepped golden altar crown & sun-disc finial atop the summit shrine
  box(-0.56, 0.56, -0.56, 0.56, sz1, sz1 + 0.24, '#facc15', '#ca8a04', '#fef08a');
  const pSun = I(0, 0, sz1 + 0.44);
  ell(pSun[0], pSun[1], u * 0.20, u * 0.20, '#fef08a', 0, '#d97706', u * 0.04);

  ctx.restore();
}

/* ===== UNIFIED DISPATCHER & DROP-IN SPRITE LIBRARY ===== */
function drawAncientWeenie(ctx, cx, cy, R, type = 'ziggurat', opts = {}) {
  const key = String(type || 'ziggurat').toLowerCase();
  if (key.includes('pyramid') || key === 'giza') {
    return drawWeenieEgyptPyramid(ctx, cx, cy, R, opts);
  }
  if (key.includes('sphinx')) {
    return drawWeenieEgyptSphinx(ctx, cx, cy, R, opts);
  }
  return drawWeenieBabylonZiggurat(ctx, cx, cy, R, opts);
}

const WEENIE_MONUMENTS = {
  pyramid:  drawWeenieEgyptPyramid,
  sphinx:   drawWeenieEgyptSphinx,
  ziggurat: drawWeenieBabylonZiggurat,
  draw:     drawAncientWeenie
};
window.ANCIENT_MONUMENT_ART = { draw: drawAncientWeenie, pyramid: drawWeenieEgyptPyramid, sphinx: drawWeenieEgyptSphinx, ziggurat: drawWeenieBabylonZiggurat };
})();
