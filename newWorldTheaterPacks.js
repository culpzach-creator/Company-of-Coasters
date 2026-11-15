/* Imported theater artwork, isolated by theme. */
const NEW_WORLD_THEATER_PACKS = Object.freeze({
  jurassic: (() => {
/* ===== SHARED ISOMETRIC & COLOR HELPERS ===== */
function shade(hex, amt) {
  if (!hex || hex[0] !== '#') return hex || '#888888';
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = c => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

function hexPath(c, x, y, R) {
  c.beginPath();
  [[0.866, 0.29], [0, 0.58], [-0.866, 0.29], [-0.866, -0.29], [0, -0.58], [0.866, -0.29]].forEach((v, i) => {
    const px = x + v[0] * R, py = y + v[1] * R;
    i ? c.lineTo(px, py) : c.moveTo(px, py);
  });
  c.closePath();
}

const TH = {
  ln(ctx, a, b, c, w) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  },
  ell(ctx, x, y, rx, ry, c, rot) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(0.2, rx), Math.max(0.2, ry), rot || 0, 0, Math.PI * 2);
    ctx.fill();
  },
  poly(ctx, pts, fill, stroke, lw) {
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.lineJoin = 'round'; ctx.stroke(); }
  },
  iso(x, y, u, X, Y, Z) {
    return [x + (X - Y) * 0.7 * u, y + (X + Y) * 0.35 * u - Z * u];
  }
};

/* ============================================================================
   JURASSIC ISLAND THEATER FACILITY: MOSASAURUS LAGOON FEEDING SHOW AMPHITHEATER
   ============================================================================ */
function drawTheaterJurassic(ctx, cx, cy, R, opts = {}) {
  const flip = !!opts.flip;
  const t = opts.t || 0;
  const u = R * 0.105;
  const cyB = cy + R * 0.17;

  const I = (X, Y, Z) => TH.iso(cx, cyB, u, X, Y, Z);
  const poly = (pts, fill, stroke, lw) => TH.poly(ctx, pts, fill, stroke, lw);
  const ln = (a, b, col, w) => TH.ln(ctx, a, b, col, w || u * 0.055);
  const ell = (x, y, rx, ry, fill, rot = 0) => TH.ell(ctx, x, y, rx, ry, fill, rot);

  if (opts.tile) {
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = '#3d6838';
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, R * 0.025);
    ctx.strokeStyle = '#274724';
    ctx.stroke();
  }

  ctx.save();
  if (flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  // Jurassic Lagoon & Modern Steel-Glass Stadium Palette
  const steelL   = '#64748b'; // Brushed architectural steel highlight
  const steelM   = '#334155'; // Dark gunmetal steel structure
  const steelD   = '#1e293b'; // Deep steel shadow
  const concL    = '#cbd5e1'; // Light concrete trim
  const concM    = '#94a3b8'; // Mid concrete seating
  const lagDeep  = '#0e7490'; // Deep lagoon teal-blue
  const lagMid   = '#0891b2'; // Mid turquoise lagoon water
  const lagLite  = '#22d3ee'; // Sunlit aqua water shimmer
  const foamW    = '#ffffff'; // Breaching splash whitewater
  const foamMist = 'rgba(224, 242, 254, 0.72)';
  const mosaTop  = '#364942'; // Dark olive-slate crocodilian dorsal hide
  const mosaMid  = '#4d645b'; // Mid mottled Mosasaurus skin
  const mosaBelly= '#cbd5c0'; // Pale underbelly & inner jaw
  const amber    = '#f59e0b'; // Safety beacon / Jurassic amber accent

  // 1. Ground Ambient Shadow & Basalt Perimeter Apron
  ell(...I(0.35, 0.35, 0), u * 5.7, u * 2.85, 'rgba(8, 20, 12, 0.36)');

  // Rotate perspective (`stadiumRot = Math.PI * 0.25` in iso = straight down-screen!)
  // so the curved steel-and-glass grandstand sits squarely in the BACK and opens forward,
  // with the turquoise lagoon pool & breaching Mosasaurus centered right in the MIDDLE!
  const ox = 0.25, oy = 0.25;
  const stadiumRot = Math.PI * 0.25;
  const cosS = Math.cos(stadiumRot), sinS = Math.sin(stadiumRot);

  const stadPt = (ang, rad, z) => {
    const lx = -Math.cos(ang) * rad;
    const ly = -Math.sin(ang) * rad;
    const wx = ox + lx * cosS - ly * sinS;
    const wy = oy + lx * sinS + ly * cosS;
    return I(wx, wy, z);
  };

  // 2. Centered Turquoise Lagoon Arena Basin & Foreground Splash-Zone Seawall
  const pPool = I(0.65, 0.65, 0.08);
  ell(pPool[0], pPool[1] + u * 0.08, u * 3.95, u * 1.98, steelD);
  ell(pPool[0], pPool[1], u * 3.86, u * 1.92, lagDeep);
  ell(pPool[0], pPool[1] - u * 0.04, u * 3.22, u * 1.56, lagMid);
  ell(pPool[0], pPool[1] - u * 0.10, u * 2.15, u * 0.98, 'rgba(34, 211, 238, 0.32)');

  // Subtle concentric water ripples centered around the Mosasaurus breach zone
  const ripShift = Math.sin(t * 2.2) * u * 0.06;
  ctx.strokeStyle = 'rgba(186, 230, 253, 0.36)';
  ctx.lineWidth = u * 0.032;
  ctx.beginPath();
  ctx.ellipse(pPool[0], pPool[1] + u * 0.08, u * 1.75 + ripShift, u * 0.84 + ripShift * 0.5, 0, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Curved Multi-Tiered Grandstand Bleachers & Rear Stadium Shell (In the Back!)
  const spanAng = 0.52 * Math.PI; // ~187-degree curved amphitheater wrapping the rear
  const rInner = 2.05, rOuter = 4.35;
  const zLow = 0.78, zHigh = 3.45;
  const N_ARC = 24;

  // Solid dark gunmetal rear stadium outer wall
  for (let s = 0; s < N_ARC; s++) {
    const a0 = -spanAng + (s / N_ARC) * (spanAng * 2);
    const a1 = -spanAng + ((s + 1) / N_ARC) * (spanAng * 2);
    const pB0 = stadPt(a0, rOuter + 0.16, 0), pB1 = stadPt(a1, rOuter + 0.16, 0);
    const pT0 = stadPt(a0, rOuter + 0.16, zHigh + 0.35), pT1 = stadPt(a1, rOuter + 0.16, zHigh + 0.35);
    poly([pB0, pB1, pT1, pT0], s < N_ARC * 0.5 ? steelM : steelD);
    ln(pT0, pT1, steelL, u * 0.045);
  }

  // Lower Lagoon-Side Splash Wall & Cantilevered Trainer Presenter Platform
  for (let s = 0; s < N_ARC; s++) {
    const a0 = -spanAng + (s / N_ARC) * (spanAng * 2);
    const a1 = -spanAng + ((s + 1) / N_ARC) * (spanAng * 2);
    const pW0 = stadPt(a0, rInner, 0.08), pW1 = stadPt(a1, rInner, 0.08);
    const pWT0 = stadPt(a0, rInner, zLow), pWT1 = stadPt(a1, rInner, zLow);
    poly([pW0, pW1, pWT1, pWT0], s < N_ARC * 0.5 ? steelL : steelM);
    ln(pWT0, pWT1, concL, u * 0.04);
  }

  // Cantilevered Trainer Catwalk Platform jutting over the lagoon (right-center of seawall)
  const catAng = 0.28 * Math.PI;
  const pCat0 = stadPt(catAng - 0.08, rInner, zLow);
  const pCat1 = stadPt(catAng + 0.08, rInner, zLow);
  const pCat2 = stadPt(catAng + 0.07, rInner - 0.85, zLow);
  const pCat3 = stadPt(catAng - 0.07, rInner - 0.85, zLow);
  poly([pCat0, pCat1, pCat2, pCat3], concL, steelD, u * 0.03);
  ln([pCat3[0], pCat3[1] - u * 0.24], [pCat2[0], pCat2[1] - u * 0.24], amber, u * 0.035);
  // Tiny trainer figure in blue uniform standing on the catwalk
  const pTrainer = [(pCat2[0] + pCat3[0]) * 0.5, (pCat2[1] + pCat3[1]) * 0.5];
  ln(pTrainer, [pTrainer[0], pTrainer[1] - u * 0.28], '#0284c7', u * 0.11);
  ell(pTrainer[0], pTrainer[1] - u * 0.34, u * 0.06, u * 0.07, '#fde4c8');

  // Steeply Banked Curved Grandstand Seating Tiers with Colorful Spectators (Drawn Top-to-Bottom)
  const nRows = 9;
  const crowdCols = ['#f8fafc', '#38bdf8', '#facc15', '#fb7185', '#a7f3d0', '#fdba74', '#e2e8f0'];
  for (let row = nRows - 1; row >= 0; row--) {
    const f0 = row / nRows;
    const f1 = (row + 1) / nRows;
    const isConcourse = (row === 4);

    const r0 = rInner + (rOuter - rInner) * f0;
    const r1 = rInner + (rOuter - rInner) * f1;
    const z0 = zLow + (zHigh - zLow) * f0;
    const z1 = isConcourse ? z0 + 0.06 : zLow + (zHigh - zLow) * f1;

    for (let s = 0; s < N_ARC; s++) {
      const a0 = -spanAng + (s / N_ARC) * (spanAng * 2);
      const a1 = -spanAng + ((s + 1) / N_ARC) * (spanAng * 2);

      const pIn0 = stadPt(a0, r0, z0), pIn1 = stadPt(a1, r0, z0);
      const pR0  = stadPt(a0, r0, z1), pR1  = stadPt(a1, r0, z1);
      const pOut0= stadPt(a0, r1, z1), pOut1= stadPt(a1, r1, z1);

      poly([pIn0, pIn1, pR1, pR0], isConcourse ? steelL : steelD);
      poly([pR0, pR1, pOut1, pOut0], isConcourse ? concL : (s < N_ARC * 0.5 ? concM : steelL));

      if (!isConcourse && (s % 2 === row % 2)) {
        const am = (a0 + a1) * 0.5;
        const rm = (r0 + r1) * 0.5;
        const pSpec = stadPt(am, rm, z1 + 0.04);
        const cCol = crowdCols[(row * 7 + s * 3) % crowdCols.length];
        ell(pSpec[0], pSpec[1] - u * 0.06, u * 0.075, u * 0.085, cCol);
        ell(pSpec[0], pSpec[1] - u * 0.14, u * 0.045, u * 0.045, '#fde4c8');
      }
    }
  }

  // Radial concrete stair aisles & steel divider ribs
  [-0.26 * Math.PI, 0, 0.26 * Math.PI].forEach(aAisle => {
    ln(stadPt(aAisle, rInner, zLow + 0.03), stadPt(aAisle, rOuter, zHigh + 0.03), steelD, u * 0.08);
  });

  // Solid Structural Side Bulkhead Walls closing off both ends of the curved grandstands
  [-1, 1].forEach(sideSign => {
    const aEnd = sideSign * spanAng;
    const pInB  = stadPt(aEnd, rInner, 0.08);
    const pOutB = stadPt(aEnd, rOuter + 0.16, 0.00);
    const pInT  = stadPt(aEnd, rInner, zLow);
    const pOutT = stadPt(aEnd, rOuter + 0.16, zHigh + 0.35);

    // Main sloped structural end-wall
    poly([pInB, pOutB, pOutT, pInT], sideSign < 0 ? concM : steelL, steelD, u * 0.035);
    // Thick top coping cap & diagonal steel support rib
    ln(pInT, pOutT, concL, u * 0.08);
    ln(
      [pInB[0] + (pOutB[0] - pInB[0]) * 0.15, pInB[1] + (pOutB[1] - pInB[1]) * 0.15],
      [pInT[0] + (pOutT[0] - pInT[0]) * 0.85, pInT[1] + (pOutT[1] - pInT[1]) * 0.85],
      steelM,
      u * 0.065
    );
    // Horizontal architectural panel seam lines on the side bulkhead
    [0.33, 0.66].forEach(hf => {
      ln(
        [pInB[0] + (pInT[0] - pInB[0]) * hf, pInB[1] + (pInT[1] - pInB[1]) * hf],
        [pOutB[0] + (pOutT[0] - pOutB[0]) * hf, pOutB[1] + (pOutT[1] - pOutB[1]) * hf],
        'rgba(30, 41, 59, 0.35)',
        u * 0.025
      );
    });
  });

  // 4. Iconic Sweeping C-Shaped Steel Rib Arches & Translucent Glass Canopy Roof
  const ribAngles = [-0.38 * Math.PI, -0.13 * Math.PI, 0.13 * Math.PI, 0.38 * Math.PI];
  const canopyFrontPts = [];
  const canopyBackPts  = [];
  const canopyMidPts   = [];

  ribAngles.forEach(ang => {
    const pBase  = stadPt(ang, rOuter + 0.12, zLow + 0.45);
    const pBackT = stadPt(ang, rOuter + 0.18, zHigh + 1.45);
    const pMidT  = stadPt(ang, (rInner + rOuter) * 0.52, zHigh + 1.88);
    const pTip   = stadPt(ang, rInner - 0.35, zHigh + 1.72);

    canopyBackPts.push(pBackT);
    canopyMidPts.push(pMidT);
    canopyFrontPts.push(pTip);

    ctx.strokeStyle = steelD;
    ctx.lineWidth = u * 0.24;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(pBase[0], pBase[1]);
    ctx.quadraticCurveTo(pBackT[0], pBackT[1] + u * 0.35, pBackT[0], pBackT[1]);
    ctx.quadraticCurveTo(pMidT[0], pMidT[1], pTip[0], pTip[1]);
    ctx.stroke();

    ctx.strokeStyle = steelL;
    ctx.lineWidth = u * 0.08;
    ctx.stroke();
  });

  for (let i = 0; i < ribAngles.length - 1; i++) {
    const b0 = canopyBackPts[i], b1 = canopyBackPts[i + 1];
    const m0 = canopyMidPts[i],  m1 = canopyMidPts[i + 1];
    const f0 = canopyFrontPts[i], f1 = canopyFrontPts[i + 1];

    poly([b0, b1, m1, m0], 'rgba(186, 230, 253, 0.46)', steelM, u * 0.045);
    poly([m0, m1, f1, f0], 'rgba(224, 242, 254, 0.54)', steelM, u * 0.045);

    [0.33, 0.66].forEach(pf => {
      ln(
        [b0[0] + (m0[0] - b0[0]) * pf, b0[1] + (m0[1] - b0[1]) * pf],
        [b1[0] + (m1[0] - b1[0]) * pf, b1[1] + (m1[1] - b1[1]) * pf],
        'rgba(30, 41, 59, 0.55)', u * 0.025
      );
      ln(
        [m0[0] + (f0[0] - m0[0]) * pf, m0[1] + (f0[1] - m0[1]) * pf],
        [m1[0] + (f1[0] - m1[0]) * pf, m1[1] + (f1[1] - m1[1]) * pf],
        'rgba(30, 41, 59, 0.55)', u * 0.025
      );
    });
  }
  for (let i = 0; i < canopyFrontPts.length - 1; i++) {
    ln(canopyFrontPts[i], canopyFrontPts[i + 1], steelD, u * 0.14);
    ln(canopyFrontPts[i], canopyFrontPts[i + 1], concL, u * 0.045);
  }

  // 5. Full Breach -> Jaw-Snap Chomp -> Submerge Feeding Show Cycle (4.6s loop)
  const cycleLen = 4.6;
  const phase = ((t % cycleLen) + cycleLen) % cycleLen / cycleLen; // 0..1

  let emerge = 0;      // 0 = completely submerged underwater, 1 = full apex breach height
  let jawRatio = 1;    // 1 = wide-open jaws, 0 = snapped tightly shut
  let splashAmp = 0;   // 0..1 splash foam intensity
  let sharkEaten = false;

  if (phase < 0.16) {
    // Underwater buildup & swirling ripples before breach
    emerge = 0;
    jawRatio = 1;
    splashAmp = (phase / 0.16) * 0.25;
  } else if (phase < 0.40) {
    // Explosive vertical breach out of the lagoon with jaws wide open
    const k = (phase - 0.16) / 0.24;
    emerge = Math.sin(k * Math.PI * 0.5); // smooth fast launch to apex (1.0)
    jawRatio = 1;
    splashAmp = 0.25 + emerge * 0.75;
  } else if (phase < 0.54) {
    // Apex hang-time: jaws snap shut on the shark bait!
    const k = (phase - 0.40) / 0.14;
    emerge = 1.0 - k * 0.06;
    jawRatio = Math.max(0, 1 - k * 2.4); // snaps closed quickly
    splashAmp = 1.0;
    sharkEaten = jawRatio < 0.35;
  } else if (phase < 0.80) {
    // Sliding back down into the lagoon with jaws clamped shut
    const k = (phase - 0.54) / 0.26;
    emerge = Math.max(0, (1 - k * k) * 0.94);
    jawRatio = 0;
    splashAmp = (1 - k) * 0.95;
    sharkEaten = true;
  } else {
    // Fully submerged underwater while expanding surface ripples settle & new bait lowers
    const k = (phase - 0.80) / 0.20;
    emerge = 0;
    jawRatio = 1;
    splashAmp = (1 - k) * 0.20;
    sharkEaten = false;
  }

  // Overhead Steel Feeding Crane Boom & Suspended Great White Shark Lure
  const pCraneBase = stadPt(-0.44 * Math.PI, rInner + 0.12, zLow + 0.1);
  const pCraneTop  = stadPt(-0.44 * Math.PI, rInner + 0.12, zHigh + 1.85);
  const pCraneTip  = I(0.55, 0.55, 5.45);

  ln(pCraneBase, pCraneTop, steelD, u * 0.16);
  ln(pCraneTop, pCraneTip, steelM, u * 0.12);
  ln(pCraneTop, pCraneTip, concL, u * 0.04);

  const cableDrop = sharkEaten ? u * 0.30 : u * 0.52;
  const pSharkHook = [pCraneTip[0], pCraneTip[1] + cableDrop];
  ln(pCraneTip, pSharkHook, '#e2e8f0', u * 0.025);

  if (!sharkEaten) {
    poly([
      [pSharkHook[0], pSharkHook[1]],
      [pSharkHook[0] - u * 0.14, pSharkHook[1] + u * 0.28],
      [pSharkHook[0] - u * 0.34, pSharkHook[1] + u * 0.36],
      [pSharkHook[0] - u * 0.14, pSharkHook[1] + u * 0.44],
      [pSharkHook[0], pSharkHook[1] + u * 0.68],
      [pSharkHook[0] + u * 0.14, pSharkHook[1] + u * 0.44],
      [pSharkHook[0] + u * 0.34, pSharkHook[1] + u * 0.36],
      [pSharkHook[0] + u * 0.14, pSharkHook[1] + u * 0.28]
    ], '#64748b', '#1e293b', u * 0.022);
    ell(pSharkHook[0], pSharkHook[1] + u * 0.38, u * 0.08, u * 0.22, '#f8fafc');
  }

  // 6. Colossal Breaching Mosasaurus (Clipped cleanly at the lagoon waterline so it emerges & disappears underwater!)
  const pMosaBase = I(0.55, 0.55, 0.12);
  const mx = pMosaBase[0];
  const waterY = pMosaBase[1] + u * 0.16;

  // Expanding concentric lagoon surface ripples during anticipation, breach & submerge
  const ripRad = u * (0.95 + phase * 1.45);
  ctx.strokeStyle = `rgba(224, 242, 254, ${0.48 * (1 - phase * 0.65)})`;
  ctx.lineWidth = u * 0.036;
  ctx.beginPath();
  ctx.ellipse(mx, waterY - u * 0.04, ripRad, ripRad * 0.48, 0, 0, Math.PI * 2);
  ctx.stroke();

  if (emerge > 0.01) {
    // At emerge = 0, the snout tip sits just below waterY; at emerge = 1, the torso & jaws reach the shark lure
    const riseH = emerge * u * 3.18;
    const my = waterY + u * 2.85 - riseH;

    // Rear splash water curtain behind the Mosasaurus
    ell(mx, waterY - u * 0.06, u * (0.75 + splashAmp * 0.78), u * (0.34 + splashAmp * 0.32), 'rgba(186, 230, 253, 0.55)');
    ell(mx, waterY - u * 0.22 * splashAmp, u * (0.55 + splashAmp * 0.65), u * (0.32 + splashAmp * 0.44), foamMist);

    // Clip the Mosasaurus body strictly above the lagoon waterline (`y <= waterY + u * 0.06`)
    ctx.save();
    ctx.beginPath();
    ctx.rect(mx - u * 2.5, waterY - u * 5.0, u * 5.0, u * 5.06);
    ctx.clip();

    // Massive muscular Mosasaurus neck/torso rising vertically out of the lagoon
    poly([
      [mx - u * 0.78, my + u * 0.35],
      [mx - u * 0.56, my - u * 1.35],
      [mx + u * 0.54, my - u * 1.35],
      [mx + u * 0.80, my + u * 0.35]
    ], mosaMid);
    // Shaded right flank & armored osteoderm ridges
    poly([
      [mx + u * 0.08, my + u * 0.35],
      [mx + u * 0.06, my - u * 1.35],
      [mx + u * 0.54, my - u * 1.35],
      [mx + u * 0.80, my + u * 0.35]
    ], mosaTop);

    // Left & Right Swept Hydrodynamic Flippers
    poly([
      [mx - u * 0.58, my - u * 0.45],
      [mx - u * 1.28, my - u * 0.12],
      [mx - u * 0.95, my + u * 0.18],
      [mx - u * 0.56, my - u * 0.12]
    ], mosaMid, steelD, u * 0.025);
    poly([
      [mx + u * 0.58, my - u * 0.45],
      [mx + u * 1.25, my - u * 0.10],
      [mx + u * 0.92, my + u * 0.20],
      [mx + u * 0.56, my - u * 0.12]
    ], mosaTop, steelD, u * 0.025);

    // Mosasaurus Jaws: Interpolate smoothly from wide-open V (`jawRatio = 1`) to snapped shut (`jawRatio = 0`)
    const openSpread = jawRatio * u * 0.64;
    const pThroat   = [mx, my - u * 1.22];
    const pUpperTip = [mx - u * 0.08 - openSpread, my - u * 2.88];
    const pLowerTip = [mx + u * 0.08 + openSpread * 0.96, my - u * 2.82];

    if (jawRatio > 0.08) {
      // Inner mouth cavity & pale throat palate (visible while jaws are open)
      poly([
        [mx - u * 0.46, my - u * 1.28],
        pUpperTip,
        pThroat,
        pLowerTip,
        [mx + u * 0.46, my - u * 1.28]
      ], '#9f5f68');
      ell(mx, my - u * 1.48, u * 0.26 * jawRatio, u * 0.20 * jawRatio, '#fca5a5');
    }

    // Upper Jaw (Left snout)
    poly([
      [mx - u * 0.56, my - u * 1.25],
      [mx - u * (0.48 + jawRatio * 0.24), my - u * 2.15],
      pUpperTip,
      [mx - u * (0.04 + jawRatio * 0.20), my - u * 1.45]
    ], mosaMid, steelD, u * 0.025);

    // Lower Jaw (Right mandible)
    poly([
      [mx + u * 0.54, my - u * 1.25],
      [mx + u * (0.46 + jawRatio * 0.24), my - u * 2.12],
      pLowerTip,
      [mx + u * (0.04 + jawRatio * 0.20), my - u * 1.45]
    ], mosaBelly, steelD, u * 0.025);

    // Rows of Sharp Conical White Mosasaurus Teeth lining both jaws
    for (let k = 1; k <= 5; k++) {
      const f = k / 6;
      const uStart = mx - u * (0.06 + jawRatio * 0.22);
      const ux = uStart + (pUpperTip[0] - uStart) * f;
      const uy = (my - u * 1.48) + (pUpperTip[1] - (my - u * 1.48)) * f;
      poly([[ux, uy - u * 0.04], [ux + u * 0.10, uy + u * 0.04], [ux - u * 0.02, uy + u * 0.08]], foamW);

      const lStart = mx + u * (0.06 + jawRatio * 0.22);
      const lx = lStart + (pLowerTip[0] - lStart) * f;
      const ly = (my - u * 1.48) + (pLowerTip[1] - (my - u * 1.48)) * f;
      poly([[lx, ly - u * 0.04], [lx - u * 0.10, ly + u * 0.04], [lx + u * 0.02, ly + u * 0.08]], foamW);
    }

    // Glowing Amber Predator Eye & Brow Ridge
    ell(mx - u * 0.40, my - u * 1.56, u * 0.075, u * 0.06, amber);
    ell(mx - u * 0.40, my - u * 1.56, u * 0.025, u * 0.045, '#090d16');

    ctx.restore();
  }

  // Foreground Whitewater Splash Plumes, Cascading Water Sheets & Foam Spray
  if (splashAmp > 0.02) {
    ell(mx, waterY + u * 0.02, u * (0.45 + splashAmp * 1.05), u * (0.18 + splashAmp * 0.38), foamW);
    [
      [-0.78, -0.45, 0.34, 0.58],
      [-0.36, -0.68, 0.38, 0.76],
      [ 0.14, -0.72, 0.40, 0.80],
      [ 0.62, -0.50, 0.34, 0.62],
      [ 0.92, -0.24, 0.28, 0.42]
    ].forEach(([dx, dy, rx, ry], idx) => {
      ell(
        mx + dx * u * (0.5 + splashAmp * 0.5),
        waterY + dy * u * splashAmp,
        rx * u * splashAmp,
        ry * u * splashAmp,
        idx % 2 ? foamW : foamMist
      );
    });

    // Flying water spray droplets around the splash plume
    if (splashAmp > 0.45) {
      [
        [-1.15, -1.05], [-0.95, -1.45], [0.98, -1.25], [1.18, -0.88], [-0.15, -1.35]
      ].forEach(([dx, dy]) => {
        ell(mx + dx * u * splashAmp, waterY + dy * u * splashAmp, u * 0.065 * splashAmp, u * 0.085 * splashAmp, foamW);
      });
    }
  }

  // 7. Foreground Low Splash-Zone Seawall & Safety Railing Framing the Bottom Edge
  const N_FG = 16;
  for (let k = 0; k < N_FG; k++) {
    const a0 = 0.62 * Math.PI + (k / N_FG) * 0.76 * Math.PI;
    const a1 = 0.62 * Math.PI + ((k + 1) / N_FG) * 0.76 * Math.PI;
    const rFgIn = 3.10, rFgOut = 3.48;
    const pI0 = stadPt(a0, rFgIn, 0.08), pI1 = stadPt(a1, rFgIn, 0.08);
    const pO0 = stadPt(a0, rFgOut, 0.00), pO1 = stadPt(a1, rFgOut, 0.00);
    const pI0T = stadPt(a0, rFgIn, 0.48), pI1T = stadPt(a1, rFgIn, 0.48);
    const pO0T = stadPt(a0, rFgOut, 0.48), pO1T = stadPt(a1, rFgOut, 0.48);

    poly([pO0, pO1, pO1T, pO0T], k % 2 ? steelM : steelD);
    poly([pI0T, pI1T, pO1T, pO0T], concM);
    ln([pI0T[0], pI0T[1] - u * 0.18], [pI1T[0], pI1T[1] - u * 0.18], concL, u * 0.032);
    if (k % 3 === 1) {
      ln(pI0T, [pI0T[0], pI0T[1] - u * 0.20], steelL, u * 0.045);
      ell(pI0T[0], pI0T[1] - u * 0.22, u * 0.04, u * 0.04, amber);
    }
  }

  ctx.restore();
}

/* ===== OFFSCREEN 2X RETINA BAKER ===== */
return drawTheaterJurassic;
})(),
  egypt: (() => {
/* ===== SHARED ISOMETRIC & COLOR HELPERS ===== */
function shade(hex, amt) {
  if (!hex || hex[0] !== '#') return hex || '#888888';
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = c => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

function hexPath(c, x, y, R) {
  c.beginPath();
  [[0.866, 0.29], [0, 0.58], [-0.866, 0.29], [-0.866, -0.29], [0, -0.58], [0.866, -0.29]].forEach((v, i) => {
    const px = x + v[0] * R, py = y + v[1] * R;
    i ? c.lineTo(px, py) : c.moveTo(px, py);
  });
  c.closePath();
}

const TH = {
  ln(ctx, a, b, c, w) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  },
  ell(ctx, x, y, rx, ry, c, rot) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(0.2, rx), Math.max(0.2, ry), rot || 0, 0, Math.PI * 2);
    ctx.fill();
  },
  poly(ctx, pts, fill, stroke, lw) {
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.lineJoin = 'round'; ctx.stroke(); }
  },
  iso(x, y, u, X, Y, Z) {
    return [x + (X - Y) * 0.7 * u, y + (X + Y) * 0.35 * u - Z * u];
  },
  box(ctx, x, y, u, x0, x1, y0, y1, z0, z1, cf, ce, ct) {
    const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
    TH.poly(ctx, [I(x0, y1, z0), I(x1, y1, z0), I(x1, y1, z1), I(x0, y1, z1)], cf);
    TH.poly(ctx, [I(x1, y0, z0), I(x1, y1, z0), I(x1, y1, z1), I(x1, y0, z1)], ce);
    if (ct !== false) {
      TH.poly(ctx, [I(x0, y0, z1), I(x1, y0, z1), I(x1, y1, z1), I(x0, y1, z1)], ct);
    }
  }
};

/* ============================================================================
   ANCIENT EGYPT THEATER FACILITY: ENCLOSED BOX MASKED BY GRAND PYLON TEMPLE
   ============================================================================ */
function drawTheaterEgypt(ctx, cx, cy, R, opts = {}) {
  const flip = !!opts.flip;
  const t = opts.t || 0;
  const u = R * 0.098;
  const cyB = cy + R * 0.16;

  const I = (X, Y, Z) => TH.iso(cx, cyB, u, X, Y, Z);
  const poly = (pts, fill, stroke, lw) => TH.poly(ctx, pts, fill, stroke, lw);
  const ln = (a, b, col, w) => TH.ln(ctx, a, b, col, w || u * 0.055);
  const ell = (x, y, rx, ry, fill, rot = 0) => TH.ell(ctx, x, y, rx, ry, fill, rot);
  const box = (x0, x1, y0, y1, z0, z1, cf, ce, ct) =>
    TH.box(ctx, cx, cyB, u, x0, x1, y0, y1, z0, z1, cf, ce || shade(cf, -0.26), ct !== false ? (ct || shade(cf, 0.14)) : false);

  if (opts.tile) {
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = '#e5c687';
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, R * 0.025);
    ctx.strokeStyle = '#c29b54';
    ctx.stroke();
  }

  ctx.save();
  if (flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  // Sunlit Egyptian Limestone, Gold Banner & Lapis-Turquoise Palette
  const sandL   = '#f7ebd2'; // Sunlit creamy Egyptian limestone
  const sandF   = '#e8d3a8'; // Main warm sandstone face
  const sandR   = '#c2a674'; // Shaded right wall
  const sandD   = '#997d4d'; // Deep stone shadow
  const gold    = '#facc15'; // Ceremonial gold banners & throne
  const goldM   = '#eab308';
  const goldD   = '#b45309';
  const lapis   = '#1d4ed8'; // Lapis lazuli cornice & obelisk trim
  const turq    = '#0d9488'; // Turquoise sacred pool & papyrus inlay
  const crimson = '#b91c1c'; // Waving royal pennant & carpet
  const cedar   = '#4a2c16'; // Cedar flagpole masts
  const linen   = '#faf8f2'; // Draped white linen portico swags

  // 1. Ground Ambient Shadow & Paved Sandstone Temple Forecourt Plinth
  ell(...I(0.45, 0.35, 0), u * 6.0, u * 3.0, 'rgba(56, 36, 12, 0.30)');
  box(-4.15, 4.15, -3.85, 3.65, 0.00, 0.30, sandR, sandD, sandL);

  // 2. Enclosed Rear Theater Auditorium Box (Masked behind the monumental Pylon facade!)
  //    Tucked behind the pylon towers (Y: -3.55 .. +0.35), styled with Egyptian clerestory
  //    vents, battered side walls, and a cavetto cornice roof so it reads seamlessly as the
  //    Hypostyle Hall / Theater auditorium behind the temple facade!
  const zBox0 = 0.30, zBox1 = 3.85;
  // Slightly battered auditorium box walls
  poly([I(-3.75, 0.35, zBox0), I(3.75, 0.35, zBox0), I(3.55, 0.25, zBox1), I(-3.55, 0.25, zBox1)], sandF);
  poly([I(3.75, -3.55, zBox0), I(3.75, 0.35, zBox0), I(3.55, 0.25, zBox1), I(3.55, -3.40, zBox1)], sandR);
  poly([I(-3.55, -3.40, zBox1), I(3.55, -3.40, zBox1), I(3.55, 0.25, zBox1), I(-3.55, 0.25, zBox1)], sandL);

  // Cavetto cornice cap & clerestory reliefs along the right side of the theater box
  box(-3.65, 3.65, -3.50, 0.35, zBox1 - 0.16, zBox1 + 0.08, sandL, sandR, sandL);
  for (let cyO = -2.95; cyO <= -0.25; cyO += 0.68) {
    // Engaged papyrus pilasters & upper clerestory vents on the side of the auditorium box
    ln(I(3.66, cyO, zBox0), I(3.56, cyO, zBox1 - 0.16), sandL, u * 0.085);
    poly([
      I(3.60, cyO - 0.18, zBox1 - 0.85),
      I(3.60, cyO + 0.18, zBox1 - 0.85),
      I(3.57, cyO + 0.18, zBox1 - 0.36),
      I(3.57, cyO - 0.18, zBox1 - 0.36)
    ], '#291d14', goldD, u * 0.025);
  }

  // 3. Twin Towering Battered Egyptian Pylon Towers Masking the Front of the Box!
  //    Left Tower: X in [-3.85 .. -1.15], Right Tower: X in [1.15 .. 3.85], Y in [0.15 .. 1.65]
  const zPyl0 = 0.30, zPyl1 = 5.45;
  const drawPylonTower = (x0, x1, seedShift) => {
    const xm = (x0 + x1) * 0.5;
    const bat = 0.24; // Classic Egyptian inward batter slope
    const yF0 = 1.68, yB0 = 0.12;
    const yF1 = yF0 - bat, yB1 = yB0 + bat * 0.6;
    const xL0 = x0, xR0 = x1;
    const xL1 = x0 + bat, xR1 = x1 - bat;

    // Front battered pylon face (+Y)
    poly([I(xL0, yF0, zPyl0), I(xR0, yF0, zPyl0), I(xR1, yF1, zPyl1), I(xL1, yF1, zPyl1)], sandL);
    // Right battered pylon face (+X)
    poly([I(xR0, yB0, zPyl0), I(xR0, yF0, zPyl0), I(xR1, yF1, zPyl1), I(xR1, yB1, zPyl1)], sandR);
    // Flat pylon summit terrace
    poly([I(xL1, yB1, zPyl1), I(xR1, yB1, zPyl1), I(xR1, yF1, zPyl1), I(xL1, yF1, zPyl1)], sandL);

    // Flared Cavetto Lotus-Leaf Cornice Crown & Torus Roll Molding
    const cOut = 0.18;
    poly([
      I(xL1, yF1, zPyl1 - 0.42), I(xR1, yF1, zPyl1 - 0.42),
      I(xR1 + cOut, yF1 + cOut, zPyl1 + 0.08), I(xL1 - cOut, yF1 + cOut, zPyl1 + 0.08)
    ], sandF, sandD, u * 0.03);
    poly([
      I(xR1, yB1, zPyl1 - 0.42), I(xR1, yF1, zPyl1 - 0.42),
      I(xR1 + cOut, yF1 + cOut, zPyl1 + 0.08), I(xR1 + cOut, yB1 - cOut, zPyl1 + 0.08)
    ], sandR, sandD, u * 0.03);

    // Painted blue-and-gold lotus-petal stripes along the cavetto cornice
    const nPetals = 9;
    for (let k = 0; k < nPetals; k++) {
      const f = (k + 0.5) / nPetals;
      const px0 = xL1 + (xR1 - xL1) * f;
      const px1 = (xL1 - cOut) + ((xR1 + cOut) - (xL1 - cOut)) * f;
      ln(I(px0, yF1 + 0.01, zPyl1 - 0.38), I(px1, yF1 + cOut + 0.01, zPyl1 + 0.04), k % 2 === 0 ? lapis : goldD, u * 0.045);
    }

    // Torus roll molding lines framing the battered pylon face
    ln(I(xL1, yF1, zPyl1 - 0.42), I(xR1, yF1, zPyl1 - 0.42), goldD, u * 0.055);
    ln(I(xL0 + 0.04, yF0, zPyl0), I(xL1 + 0.04, yF1, zPyl1 - 0.42), sandD, u * 0.045);
    ln(I(xR0 - 0.04, yF0, zPyl0), I(xR1 - 0.04, yF1, zPyl1 - 0.42), sandD, u * 0.045);

    // Carved Hieroglyphic Register Bands & Large Pharaoh Reliefs on Pylon Face
    [1.45, 2.35, 3.25, 4.15].forEach((zr, rIdx) => {
      const f = (zr - zPyl0) / (zPyl1 - zPyl0);
      const xl = xL0 + bat * f + 0.18, xr = xR0 - bat * f - 0.18;
      const yf = yF0 - bat * f + 0.01;
      ln(I(xl, yf, zr), I(xr, yf, zr), 'rgba(130, 98, 52, 0.34)', u * 0.032);
      // Small hieroglyphic cartouche glyphs along the band
      for (let gStep = 0; gStep < 5; gStep++) {
        const gx = xl + ((xr - xl) * (gStep + 0.5)) / 5;
        ell(...I(gx, yf, zr + 0.16), u * 0.045, u * 0.075, rIdx % 2 ? 'rgba(29, 78, 216, 0.38)' : 'rgba(180, 83, 9, 0.42)');
      }
    });

    // Twin Vertical Gold Silk Temple Banners hanging down the upper pylon face (matching reference!)
    [-0.48, 0.48].forEach(offX => {
      const bx = xm + offX;
      const fTop = (zPyl1 - 0.44 - zPyl0) / (zPyl1 - zPyl0);
      const fBot = (zPyl1 - 2.15 - zPyl0) / (zPyl1 - zPyl0);
      const yTop = yF0 - bat * fTop + 0.025;
      const yBot = yF0 - bat * fBot + 0.025;
      poly([
        I(bx - 0.16, yTop, zPyl1 - 0.44),
        I(bx + 0.16, yTop, zPyl1 - 0.44),
        I(bx + 0.16, yBot, zPyl1 - 2.15),
        I(bx,        yBot, zPyl1 - 2.32),
        I(bx - 0.16, yBot, zPyl1 - 2.15)
      ], goldM, goldD, u * 0.025);
      // Sacred solar scarab / Horus emblem on gold banner
      ell(...I(bx, (yTop + yBot) * 0.5 + 0.01, zPyl1 - 1.25), u * 0.075, u * 0.095, '#fef08a');
    });

    // Twin Towering Cedar Flagpoles with Bronze Clamps & Waving Crimson-Gold Pennants!
    const wave = Math.sin(t * 2.6 + seedShift) * u * 0.09;
    [-0.68, 0.68].forEach((fxOff, pIdx) => {
      const fx = xm + fxOff;
      // Recessed vertical flagpole slot niche in the pylon wall
      ln(I(fx, yF0 + 0.01, zPyl0), I(fx, yF1 + 0.01, zPyl1 - 0.42), '#5c4224', u * 0.09);
      // Tall cedar flagpole mast rising well above the pylon roof
      const pPoleB = I(fx, yF0 + 0.06, zPyl0);
      const pPoleT = I(fx, yF1 + 0.06, zPyl1 + 1.55);
      ln(pPoleB, pPoleT, cedar, u * 0.075);
      // Bronze mounting brackets
      [2.1, 3.6].forEach(zb => {
        const fb = (zb - zPyl0) / (zPyl1 - zPyl0);
        const pb = I(fx, yF0 - bat * fb + 0.04, zb);
        ln([pb[0] - u * 0.07, pb[1]], [pb[0] + u * 0.07, pb[1]], goldD, u * 0.055);
      });
      // Gilded spear finial & fluttering swallowtail temple pennant
      ell(pPoleT[0], pPoleT[1], u * 0.065, u * 0.09, gold);
      const wOff = pIdx === 0 ? wave : -wave;
      poly([
        [pPoleT[0], pPoleT[1] + u * 0.08],
        [pPoleT[0] + u * 0.72, pPoleT[1] + u * 0.22 + wOff],
        [pPoleT[0] + u * 0.52, pPoleT[1] + u * 0.36 + wOff * 0.7],
        [pPoleT[0] + u * 0.76, pPoleT[1] + u * 0.50 + wOff],
        [pPoleT[0], pPoleT[1] + u * 0.48]
      ], pIdx === 0 ? crimson : goldM, goldD, u * 0.022);
    });
  };

  drawPylonTower(-3.85, -1.12, 0.0);
  drawPylonTower( 1.12,  3.85, 1.4);

  // 4. Central Papyrus-Columned Portico Stage & Golden Lotus Throne Sanctuary
  //    Bridging the space between the two pylon towers (X in [-1.15 .. +1.15])
  const zPort1 = 3.15;
  // Recessed sanctuary backdrop wall with hieroglyphic reliefs
  poly([I(-1.15, 0.62, 0.30), I(1.15, 0.62, 0.30), I(1.15, 0.62, zPort1), I(-1.15, 0.62, zPort1)], sandF);

  // Stepped Central Stage Platform & Golden Lotus Throne (matching reference!)
  box(-0.78, 0.78, 0.68, 1.55, 0.30, 0.78, sandL, sandR, sandL);
  poly([I(-0.46, 1.55, 0.78), I(0.46, 1.55, 0.78), I(0.46, 2.25, 0.30), I(-0.46, 2.25, 0.30)], sandL);
  poly([I(-0.22, 1.55, 0.79), I(0.22, 1.55, 0.79), I(0.22, 2.25, 0.31), I(-0.22, 2.25, 0.31)], crimson);

  // Sculpted Golden Lotus Petals Backdrop & Royal Seat on the Stage
  const pLotus = I(0, 0.85, 1.32);
  [
    [-0.36, 0.06, 0.24, 0.42, -0.35],
    [ 0.36, 0.06, 0.24, 0.42,  0.35],
    [-0.18, -0.06, 0.22, 0.48, -0.15],
    [ 0.18, -0.06, 0.22, 0.48,  0.15],
    [ 0.00, -0.14, 0.24, 0.56,  0.00]
  ].forEach(([dx, dy, rx, ry, rot], idx) => {
    ell(pLotus[0] + dx * u, pLotus[1] + dy * u, rx * u, ry * u, idx === 4 ? gold : goldM, rot);
  });
  box(-0.22, 0.22, 0.82, 1.12, 0.78, 1.24, goldD, '#78350f', gold);

  // Twin Seated Colossal Pharaoh Statues Flanking the Portico Stage
  [-1.02, 1.02].forEach(sx => {
    box(sx - 0.24, sx + 0.24, 1.35, 1.85, 0.30, 1.15, '#4b5563', '#1f2937', '#6b7280');
    ln(I(sx, 1.58, 1.15), I(sx, 1.58, 2.15), '#374151', u * 0.26);
    ell(...I(sx, 1.58, 2.30), u * 0.16, u * 0.20, goldM);
  });

  // Portico Entablature Roof & 4 Papyrus-Capital Columns with Draped White Linen Festoons
  box(-1.26, 1.26, 0.62, 2.18, zPort1 - 0.34, zPort1, sandL, sandR, sandL);
  ln(I(-1.28, 2.19, zPort1 - 0.16), I(1.28, 2.19, zPort1 - 0.16), lapis, u * 0.065);

  const drawPapyrusCol = (cxO, cyO, z0, z1) => {
    const pB = I(cxO, cyO, z0), pT = I(cxO, cyO, z1);
    ln(pB, pT, sandL, u * 0.18);
    ln([pB[0] + u * 0.05, pB[1]], [pT[0] + u * 0.05, pT[1]], sandR, u * 0.06);
    // Flared polychrome papyrus blossom capital
    poly([
      [pT[0] - u * 0.12, pT[1] + u * 0.22],
      [pT[0] + u * 0.12, pT[1] + u * 0.22],
      [pT[0] + u * 0.22, pT[1]],
      [pT[0] - u * 0.22, pT[1]]
    ], goldM, turq, u * 0.03);
  };
  [-0.86, -0.32, 0.32, 0.86].forEach(px => drawPapyrusCol(px, 2.05, 0.30, zPort1 - 0.34));

  // White linen stage curtains & draped festoon swags across the portico lintel
  [-0.86, -0.32, 0.32, 0.86].forEach((px, idx) => {
    const pTop = I(px, 2.08, zPort1 - 0.34);
    poly([
      [pTop[0] - u * 0.11, pTop[1]],
      [pTop[0] + u * 0.11, pTop[1]],
      [pTop[0] + u * 0.09, pTop[1] + u * (idx === 1 || idx === 2 ? 0.58 : 0.82)],
      [pTop[0] - u * 0.09, pTop[1] + u * (idx === 1 || idx === 2 ? 0.58 : 0.82)]
    ], linen, '#d6cfc2', u * 0.02);
  });

  // 5. Twin Gilded Obelisks, Burning Incense Braziers & Sacred Courtyard Reflecting Pools
  [-2.65, 2.65].forEach(ox => {
    const oy = 2.45;
    box(ox - 0.32, ox + 0.32, oy - 0.32, oy + 0.32, 0.30, 0.72, sandL, sandR, goldM);
    const w0 = 0.22, w1 = 0.14, hOb = 3.15;
    poly([I(ox - w0, oy + w0, 0.72), I(ox + w0, oy + w0, 0.72), I(ox + w1, oy + w1, hOb), I(ox - w1, oy + w1, hOb)], sandL);
    poly([I(ox + w0, oy - w0, 0.72), I(ox + w0, oy + w0, 0.72), I(ox + w1, oy + w1, hOb), I(ox + w1, oy - w1, hOb)], sandR);
    const pTip = I(ox, oy, hOb + 0.42);
    poly([I(ox - w1, oy + w1, hOb), I(ox + w1, oy + w1, hOb), pTip], gold);
    poly([I(ox + w1, oy - w1, hOb), I(ox + w1, oy + w1, hOb), pTip], goldD);
  });

  // Twin Turquoise Sacred Reflecting Pools & Burning Bronze Braziers in Forecourt
  poly([I(-2.35, 2.55, 0.31), I(-0.78, 2.55, 0.31), I(-0.78, 3.45, 0.31), I(-2.35, 3.45, 0.31)], turq, goldD, u * 0.035);
  poly([I( 0.78, 2.55, 0.31), I( 2.35, 2.55, 0.31), I( 2.35, 3.45, 0.31), I( 0.78, 3.45, 0.31)], turq, goldD, u * 0.035);

  const flicker = Math.sin(t * 6.5) * u * 0.025;
  [-0.95, 0.95].forEach(bx => {
    const pBr = I(bx, 2.28, 0.30);
    ln(pBr, [pBr[0], pBr[1] - u * 0.34], goldD, u * 0.16);
    ell(pBr[0], pBr[1] - u * 0.38, u * 0.16 + flicker, u * 0.22 + flicker, '#f97316');
    ell(pBr[0], pBr[1] - u * 0.34, u * 0.08, u * 0.12, '#fef08a');
  });

  ctx.restore();
}

/* ===== OFFSCREEN 2X RETINA BAKER ===== */
return drawTheaterEgypt;
})(),
  babylon: (() => {
/* ===== DETERMINISTIC PRNG & COLOR UTILITIES ===== */
function mulberry32(seed) {
  let a = seed | 0;
  return function() {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shade(hex, amt) {
  if (!hex || hex[0] !== '#') return hex || '#888888';
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const adj = c => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  return `rgb(${adj(r)},${adj(g)},${adj(b)})`;
}

/* ===== ISOMETRIC PROJECTION & VECTOR PRIMITIVES ===== */
function isoProject(cx, cy, u, X, Y, Z, rot = 0) {
  let rx = X, ry = Y;
  if (rot !== 0) {
    const c = Math.cos(rot);
    const s = Math.sin(rot);
    rx = X * c - Y * s;
    ry = X * s + Y * c;
  }
  return [
    cx + (rx - ry) * 0.7 * u,
    cy + (rx + ry) * 0.35 * u - Z * u
  ];
}

function drawPoly(ctx, pts, fill, stroke, lw = 1) {
  ctx.beginPath();
  for (let i = 0; i < pts.length; i++) {
    if (i === 0) ctx.moveTo(pts[i][0], pts[i][1]);
    else ctx.lineTo(pts[i][0], pts[i][1]);
  }
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
}

function drawLine(ctx, a, b, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]);
  ctx.lineTo(b[0], b[1]);
  ctx.stroke();
}

function drawEllipse(ctx, x, y, rx, ry, fill, rot = 0, stroke = null, lw = 1) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(0.2, rx), Math.max(0.2, ry), rot, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.stroke();
  }
}

/* ===== BEVELLED SANDSTONE HEX BASE TILE ===== */
function drawSandstoneHexBase(ctx, cx, cy, R, showGuides = false) {
  const verts = [
    [0.866, 0.29],
    [0, 0.58],
    [-0.866, 0.29],
    [-0.866, -0.29],
    [0, -0.58],
    [0.866, -0.29]
  ].map(([vx, vy]) => [cx + vx * R, cy + vy * R]);

  const depth = R * 0.085;

  // Ambient drop shadow under hex slab
  ctx.save();
  ctx.beginPath();
  verts.forEach(([vx, vy], i) => {
    const sy = vy + depth * 1.35;
    i === 0 ? ctx.moveTo(vx, sy) : ctx.lineTo(vx, sy);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(2, 6, 18, 0.55)';
  ctx.fill();
  ctx.restore();

  // Front-left bevel face (v1 -> v2) & front-right bevel face (v0 -> v1) & right side (v5 -> v0)
  const bevelFaces = [
    { i0: 1, i1: 2, col: '#b8894c' },
    { i0: 0, i1: 1, col: '#946934' },
    { i0: 5, i1: 0, col: '#785225' }
  ];
  bevelFaces.forEach(({ i0, i1, col }) => {
    const p0 = verts[i0], p1 = verts[i1];
    drawPoly(ctx, [
      p0, p1,
      [p1[0], p1[1] + depth],
      [p0[0], p0[1] + depth]
    ], col, '#5c3d19', 1);
  });

  // Top desert-ochre sandstone hex surface with warm sun gradient
  const grad = ctx.createLinearGradient(cx - R * 0.85, cy - R * 0.55, cx + R * 0.85, cy + R * 0.55);
  grad.addColorStop(0.00, '#edd09e');
  grad.addColorStop(0.52, '#dcb67a');
  grad.addColorStop(1.00, '#c49a5b');

  drawPoly(ctx, verts, grad, '#f7e3bd', Math.max(1.4, R * 0.012));

  // Subtle carved sandstone flagstone grid lines on top face
  ctx.save();
  drawPoly(ctx, verts, null);
  ctx.clip();
  ctx.strokeStyle = 'rgba(130, 88, 38, 0.16)';
  ctx.lineWidth = Math.max(1, R * 0.005);
  for (let k = -3; k <= 3; k++) {
    ctx.beginPath();
    ctx.moveTo(cx - R + k * R * 0.28, cy - R * 0.6);
    ctx.lineTo(cx + R + k * R * 0.28, cy + R * 0.4);
    ctx.stroke();
  }
  ctx.restore();

  if (showGuides) {
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx - R * 0.9, cy);
    ctx.lineTo(cx + R * 0.9, cy);
    ctx.moveTo(cx, cy - R * 0.62);
    ctx.lineTo(cx, cy + R * 0.62);
    ctx.stroke();
    ctx.setLineDash([]);
    drawEllipse(ctx, cx, cy, 4, 4, '#f43f5e');
    ctx.restore();
  }
}

/* ============================================================================
   MAIN RENDERER: ISHTAR GATE GRAND THEATER (ANCIENT BABYLON)
   ============================================================================ */
function drawTheaterBabylon(ctx, cx, cy, R, opts = {}) {
  const rot = opts.rot || 0;
  const t = opts.t || 0;
  const u = R * 0.096;
  const cyB = cy + R * 0.14;

  const I = (X, Y, Z) => isoProject(cx, cyB, u, X, Y, Z, rot);
  const poly = (pts, fill, stroke, lw) => drawPoly(ctx, pts, fill, stroke, lw);
  const ln = (a, b, col, w) => drawLine(ctx, a, b, col, w || u * 0.05);
  const ell = (x, y, rx, ry, fill, rAng = 0, stroke = null, lw = 1) =>
    drawEllipse(ctx, x, y, rx, ry, fill, rAng, stroke, lw);

  // Determine which vertical faces are visible under rotation `rot`
  // In standard isometric (rot = 0): +Y is front-left, +X is front-right.
  // Under rotation `rot`: local +Y normal is (-sin(rot), cos(rot)), local +X normal is (cos(rot), sin(rot)).
  const normFront = [-Math.sin(rot), Math.cos(rot)]; // +Y face normal
  const normRight = [ Math.cos(rot), Math.sin(rot)]; // +X face normal
  const normBack  = [ Math.sin(rot),-Math.cos(rot)]; // -Y face normal
  const normLeft  = [-Math.cos(rot),-Math.sin(rot)]; // -X face normal

  // Screen-downward visibility test (in iso, screen +Y points along (+1, +1) in rotated world coords)
  const visFront = (normFront[0] + normFront[1]) > -0.05;
  const visRight = (normRight[0] + normRight[1]) > -0.05;
  const visBack  = (normBack[0]  + normBack[1])  > -0.05;
  const visLeft  = (normLeft[0]  + normLeft[1])  > -0.05;

  // Painter-sorted 3D prism helper supporting arbitrary 90-degree rotation cleanly
  const drawPrism = (x0, x1, y0, y1, z0, z1, cols) => {
    const { front, right, back, left, top, stroke, lw } = cols;
    const faces = [];
    if (visBack && back) {
      faces.push({
        pts: [I(x0, y0, z0), I(x1, y0, z0), I(x1, y0, z1), I(x0, y0, z1)],
        fill: back
      });
    }
    if (visLeft && left) {
      faces.push({
        pts: [I(x0, y0, z0), I(x0, y1, z0), I(x0, y1, z1), I(x0, y0, z1)],
        fill: left
      });
    }
    if (visFront && front) {
      faces.push({
        pts: [I(x0, y1, z0), I(x1, y1, z0), I(x1, y1, z1), I(x0, y1, z1)],
        fill: front
      });
    }
    if (visRight && right) {
      faces.push({
        pts: [I(x1, y0, z0), I(x1, y1, z0), I(x1, y1, z1), I(x1, y0, z1)],
        fill: right
      });
    }
    faces.forEach(f => poly(f.pts, f.fill, stroke, lw));
    if (top !== false) {
      poly([I(x0, y0, z1), I(x1, y0, z1), I(x1, y1, z1), I(x0, y1, z1)], top, stroke, lw);
    }
  };

  // Palette: Lapis-Lazuli Glazed Brick, Desert Mudbrick Ochre, Gold & Ivory Reliefs
  const mudL     = '#edd3a6'; // Sunlit ochre plaster
  const mudF     = '#d9b47c'; // Main warm mudbrick wall
  const mudR     = '#b38b54'; // Shaded mudbrick right face
  const mudD     = '#8a6636'; // Deep ochre shadow
  const lapisL   = '#1675eb'; // Sunlit glazed lapis-lazuli blue
  const lapisF   = '#0b5ec9'; // Iconic cobalt Ishtar blue
  const lapisR   = '#08479e'; // Shaded glazed blue side
  const lapisD   = '#052e6b'; // Deep lapis shadow
  const gold     = '#facc15'; // Glazed yellow-gold trim & sirrush dragons
  const goldM    = '#eab308';
  const goldD    = '#b45309';
  const ivory    = '#faf8f2'; // White glazed bulls & rosette petals
  const bronze   = '#422a14'; // Wrought bronze gate & braziers
  const turq     = '#0d9488'; // Turquoise glazed accent

  // Helper: White Daisy / Rosette Floral Medallion (`*`)
  const drawRosette = (pt, rad) => {
    const [px, py] = pt;
    ell(px, py, rad * 1.15, rad * 1.15, '#1e293b');
    for (let p = 0; p < 6; p++) {
      const a = (p / 6) * Math.PI;
      const dx = Math.cos(a) * rad * 0.92;
      const dy = Math.sin(a) * rad * 0.92;
      ln([px - dx, py - dy], [px + dx, py + dy], ivory, Math.max(0.8, rad * 0.34));
    }
    ell(px, py, rad * 0.38, rad * 0.38, gold);
  };

  // Helper: Stepped Crow-Step Crenellations (Merlons) along a 3D wall edge
  const drawCrenellations = (pA, pB, count, hStep, colFill, colShade) => {
    for (let k = 0; k < count; k++) {
      const f0 = (k + 0.14) / count;
      const f1 = (k + 0.86) / count;
      const fm = (f0 + f1) * 0.5;
      const q0 = [pA[0] + (pB[0] - pA[0]) * f0, pA[1] + (pB[1] - pA[1]) * f0];
      const q1 = [pA[0] + (pB[0] - pA[0]) * f1, pA[1] + (pB[1] - pA[1]) * f1];
      const qm = [pA[0] + (pB[0] - pA[0]) * fm, pA[1] + (pB[1] - pA[1]) * fm];
      const wHalf = (q1[0] - q0[0]) * 0.5;
      const yHalf = (q1[1] - q0[1]) * 0.5;

      // 3-step Babylonian crow-step merlon silhouette
      poly([
        q0,
        [q0[0], q0[1] - hStep * 0.42],
        [q0[0] + wHalf * 0.34, q0[1] + yHalf * 0.34 - hStep * 0.42],
        [q0[0] + wHalf * 0.34, q0[1] + yHalf * 0.34 - hStep * 0.76],
        [qm[0] - wHalf * 0.24, qm[1] - yHalf * 0.24 - hStep * 0.76],
        [qm[0] - wHalf * 0.24, qm[1] - yHalf * 0.24 - hStep],
        [qm[0] + wHalf * 0.24, qm[1] + yHalf * 0.24 - hStep],
        [qm[0] + wHalf * 0.24, qm[1] + yHalf * 0.24 - hStep * 0.76],
        [q1[0] - wHalf * 0.34, q1[1] - yHalf * 0.34 - hStep * 0.76],
        [q1[0] - wHalf * 0.34, q1[1] - yHalf * 0.34 - hStep * 0.42],
        [q1[0], q1[1] - hStep * 0.42],
        q1
      ], colFill, colShade, Math.max(0.6, u * 0.015));

      // Tiny white rosette dot inside each merlon
      ell(qm[0], qm[1] - hStep * 0.36, u * 0.032, u * 0.032, ivory);
    }
  };

  // Helper: Bas-Relief Sacred Animal Silhouette (Sirrush Dragon in Gold / Aurochs Bull in Ivory)
  const drawReliefCreature = (centerPt, dirX, scaleU, isDragon) => {
    const [cx0, cy0] = centerPt;
    const fill = isDragon ? gold : ivory;
    const shd  = isDragon ? goldD : '#cbd5e1';
    const sx = dirX * scaleU;
    const sy = scaleU;

    // Legs & torso
    ln([cx0 - sx * 0.24, cy0 + sy * 0.04], [cx0 - sx * 0.28, cy0 + sy * 0.24], shd, scaleU * 0.06);
    ln([cx0 + sx * 0.22, cy0 + sy * 0.04], [cx0 + sx * 0.26, cy0 + sy * 0.24], shd, scaleU * 0.06);
    ell(cx0, cy0, Math.abs(sx) * 0.34, sy * 0.11, fill);

    if (isDragon) {
      // Long slender sirrush neck, horned head & raised tail
      ln([cx0 + sx * 0.24, cy0 - sy * 0.02], [cx0 + sx * 0.38, cy0 - sy * 0.24], fill, scaleU * 0.075);
      ell(cx0 + sx * 0.42, cy0 - sy * 0.26, Math.abs(sx) * 0.11, sy * 0.06, fill);
      ln([cx0 - sx * 0.30, cy0 - sy * 0.02], [cx0 - sx * 0.46, cy0 - sy * 0.22], fill, scaleU * 0.05);
    } else {
      // Muscular aurochs bull shoulder hump & forward-curving horn
      ell(cx0 + sx * 0.22, cy0 - sy * 0.05, Math.abs(sx) * 0.18, sy * 0.13, fill);
      ln([cx0 + sx * 0.34, cy0 - sy * 0.08], [cx0 + sx * 0.46, cy0 - sy * 0.20], ivory, scaleU * 0.045);
      ln([cx0 - sx * 0.32, cy0 - sy * 0.02], [cx0 - sx * 0.40, cy0 + sy * 0.14], shd, scaleU * 0.04);
    }
  };

  // Helper: Draw a Glazed Lapis-Lazuli Band with Yellow/Black Borders & White Rosettes
  const drawGlazedFriezeBand = (p0, p1, hBand, nRosettes) => {
    const p0T = [p0[0], p0[1] - hBand];
    const p1T = [p1[0], p1[1] - hBand];
    poly([p0, p1, p1T, p0T], lapisD);
    ln(p0, p1, gold, Math.max(1, hBand * 0.22));
    ln(p0T, p1T, gold, Math.max(1, hBand * 0.22));
    for (let k = 0; k < nRosettes; k++) {
      const f = (k + 0.5) / nRosettes;
      drawRosette([
        p0[0] + (p1[0] - p0[0]) * f,
        p0[1] + (p1[1] - p0[1]) * f - hBand * 0.5
      ], hBand * 0.24);
    }
  };

  // 1. Soft Ground Contact Shadow & Paved Processional Way Forecourt
  ell(...I(0.15, 0.25, 0), u * 4.5, u * 2.35, 'rgba(38, 22, 6, 0.32)', rot * 0.5);

  // Processional Way paved sandstone approach leading up to the Ishtar Gate
  poly([
    I(-1.45, 1.35, 0.01), I(1.45, 1.35, 0.01),
    I(1.45, 3.65, 0.01), I(-1.45, 3.65, 0.01)
  ], '#f2dec0', '#b8894c', u * 0.03);
  // Subtle turquoise-and-gold ceremonial runner down the center of the Processional Way
  poly([
    I(-0.48, 1.35, 0.015), I(0.48, 1.35, 0.015),
    I(0.48, 3.65, 0.015), I(-0.48, 3.65, 0.015)
  ], 'rgba(13, 148, 136, 0.28)');

  // 2. ENCLOSED MUDBRICK & GLAZE THEATER AUDITORIUM BOX (Masked Behind the Ishtar Gate!)
  //    X: -2.95 .. +2.95, Y: -3.15 .. +0.35, Z: 0 .. 4.35
  const bx0 = -2.95, bx1 = 2.95;
  const by0 = -3.15, by1 = 0.35;
  const bz1 = 4.35;

  drawPrism(bx0, bx1, by0, by1, 0, bz1, {
    front: mudF,
    right: mudR,
    back:  mudR,
    left:  mudL,
    top:   mudL,
    stroke: mudD,
    lw: u * 0.025
  });

  // Raised Clerestory Roof Deck & Acoustic Lantern Monitor atop the Theater Box
  drawPrism(-2.15, 2.15, -2.55, -0.35, bz1, bz1 + 0.56, {
    front: mudL,
    right: mudR,
    back:  mudR,
    left:  mudL,
    top:   '#f7e6c8',
    stroke: mudD,
    lw: u * 0.022
  });
  // Clerestory louver vents along the raised theater roof monitor
  for (let vx = -1.65; vx <= 1.65; vx += 0.66) {
    if (visFront) {
      poly([
        I(vx - 0.16, -0.34, bz1 + 0.14), I(vx + 0.16, -0.34, bz1 + 0.14),
        I(vx + 0.16, -0.34, bz1 + 0.42), I(vx - 0.16, -0.34, bz1 + 0.42)
      ], '#291d14', goldM, u * 0.02);
    }
  }

  // Blind Recessed Architectural Pilasters & Glazed Frieze along the Box Side Walls
  for (let py = -2.75; py <= -0.15; py += 0.65) {
    if (visRight) {
      ln(I(bx1 + 0.01, py, 0), I(bx1 + 0.01, py, bz1 - 0.25), mudL, u * 0.09);
      ln(I(bx1 + 0.02, py + 0.05, 0), I(bx1 + 0.02, py + 0.05, bz1 - 0.25), mudD, u * 0.035);
    }
    if (visLeft) {
      ln(I(bx0 - 0.01, py, 0), I(bx0 - 0.01, py, bz1 - 0.25), mudF, u * 0.09);
    }
  }
  if (visRight) {
    drawGlazedFriezeBand(I(bx1 + 0.02, by0, bz1 - 0.38), I(bx1 + 0.02, by1, bz1 - 0.38), u * 0.24, 7);
    drawCrenellations(I(bx1, by0, bz1), I(bx1, by1, bz1), 7, u * 0.28, mudL, mudD);
  }
  if (visLeft) {
    drawGlazedFriezeBand(I(bx0 - 0.02, by1, bz1 - 0.38), I(bx0 - 0.02, by0, bz1 - 0.38), u * 0.24, 7);
    drawCrenellations(I(bx0, by1, bz1), I(bx0, by0, bz1), 7, u * 0.28, mudL, mudD);
  }
  if (visBack) {
    drawCrenellations(I(bx1, by0, bz1), I(bx0, by0, bz1), 10, u * 0.28, mudF, mudD);
  }

  // 3. MONUMENTAL LAPIS-LAZULI BLUE ISHTAR GATE FACADE MASKING THE FRONT
  //    Central Curtain Bridge Wall (X: -1.35 .. +1.35, Y: +0.35 .. +1.15, Z: 0 .. 4.95)
  //    Twin Tall Bastion Towers (X: -3.25 .. -1.15 and +1.15 .. +3.25, Y: +0.35 .. +1.45, Z: 0 .. 6.25)
  const zBridge = 4.95;
  const zTower  = 6.25;

  // Draw the Central Bridge Wall first so the projecting Bastion Towers overlap it cleanly
  drawPrism(-1.25, 1.25, 0.35, 1.15, 0, zBridge, {
    front: lapisF,
    right: lapisR,
    back:  lapisD,
    left:  lapisL,
    top:   lapisL,
    stroke: lapisD,
    lw: u * 0.025
  });

  if (visFront) {
    // Upper frieze band & stepped crenellations on the central bridge wall
    drawGlazedFriezeBand(I(-1.15, 1.16, zBridge - 0.42), I(1.15, 1.16, zBridge - 0.42), u * 0.32, 6);
    drawCrenellations(I(-1.15, 1.15, zBridge), I(1.15, 1.15, zBridge), 5, u * 0.32, lapisL, lapisD);

    // Semicircular Arched Portal & Radiating White-and-Gold Rosette Archivolt
    const archHalfW = 0.72;
    const zSpring   = 2.15;
    const zCrown    = 2.92;
    const nArchSegs = 16;

    // Outer gold & lapis archivolt arch frame
    const outerArchPts = [I(-archHalfW - 0.18, 1.165, 0), I(-archHalfW - 0.18, 1.165, zSpring)];
    for (let s = 0; s <= nArchSegs; s++) {
      const ang = Math.PI - (s / nArchSegs) * Math.PI;
      const ax = Math.cos(ang) * (archHalfW + 0.18);
      const az = zSpring + Math.sin(ang) * (zCrown - zSpring + 0.18);
      outerArchPts.push(I(ax, 1.165, az));
    }
    outerArchPts.push(I(archHalfW + 0.18, 1.165, zSpring), I(archHalfW + 0.18, 1.165, 0));
    poly(outerArchPts, lapisD, gold, u * 0.045);

    // Radiating white rosettes along the semicircular arch ring
    for (let s = 1; s < nArchSegs; s += 2) {
      const ang = Math.PI - (s / nArchSegs) * Math.PI;
      const ax = Math.cos(ang) * (archHalfW + 0.09);
      const az = zSpring + Math.sin(ang) * (zCrown - zSpring + 0.09);
      drawRosette(I(ax, 1.17, az), u * 0.068);
    }

    // Inner Archway Opening: Warm Golden Theater Lobby Glow & Ornate Wrought-Bronze Lattice Gate
    const innerArchPts = [I(-archHalfW, 1.17, 0), I(-archHalfW, 1.17, zSpring)];
    for (let s = 0; s <= nArchSegs; s++) {
      const ang = Math.PI - (s / nArchSegs) * Math.PI;
      const ax = Math.cos(ang) * archHalfW;
      const az = zSpring + Math.sin(ang) * (zCrown - zSpring);
      innerArchPts.push(I(ax, 1.17, az));
    }
    innerArchPts.push(I(archHalfW, 1.17, zSpring), I(archHalfW, 1.17, 0));

    // Warm golden-amber theater interior glow behind the wrought-bronze gate
    const glowGrad = ctx.createLinearGradient(
      I(0, 1.17, zCrown)[0], I(0, 1.17, zCrown)[1],
      I(0, 1.17, 0)[0], I(0, 1.17, 0)[1]
    );
    glowGrad.addColorStop(0.0, '#1e1b18');
    glowGrad.addColorStop(0.45, '#78350f');
    glowGrad.addColorStop(1.0, '#f59e0b');
    poly(innerArchPts, glowGrad);

    // Ornate Wrought-Bronze Double Gate Lattice Bars & Medallions
    ctx.save();
    poly(innerArchPts, null);
    ctx.clip();
    for (let gx = -0.54; gx <= 0.54; gx += 0.18) {
      ln(I(gx, 1.175, 0), I(gx, 1.175, zCrown), bronze, u * 0.032);
    }
    for (let gz = 0.45; gz <= 2.45; gz += 0.48) {
      ln(I(-archHalfW, 1.175, gz), I(archHalfW, 1.175, gz), bronze, u * 0.032);
    }
    // Central gate meeting stile & golden ring knockers
    ln(I(0, 1.18, 0), I(0, 1.18, zCrown), '#1c1208', u * 0.05);
    ell(...I(-0.18, 1.18, 1.15), u * 0.075, u * 0.085, gold);
    ell(...I( 0.18, 1.18, 1.15), u * 0.075, u * 0.085, gold);
    ctx.restore();

    // Re-stroke arch border cleanly
    poly(innerArchPts, null, goldD, u * 0.035);

    // Flanking single-column bas-relief animals on the narrow piers beside the arch
    [0.55, 1.25, 1.95, 2.65].forEach((zr, rIdx) => {
      const isDragon = rIdx % 2 === 0;
      drawReliefCreature(I(-0.98, 1.17, zr),  1, u * 0.42, isDragon);
      drawReliefCreature(I( 0.98, 1.17, zr), -1, u * 0.42, isDragon);
    });
  }

  // Helper: Draw one of the Twin Square-Bastioned Lapis-Lazuli Ishtar Towers
  const drawIshtarTower = (tx0, tx1, dirFacing) => {
    const ty0 = 0.35, ty1 = 1.45;
    drawPrism(tx0, tx1, ty0, ty1, 0, zTower, {
      front: lapisF,
      right: lapisR,
      back:  lapisD,
      left:  lapisL,
      top:   lapisL,
      stroke: lapisD,
      lw: u * 0.025
    });

    const xm = (tx0 + tx1) * 0.5;
    const zUpperTier = 4.95;

    if (visFront) {
      // Base plinth glazed rosette frieze
      drawGlazedFriezeBand(I(tx0, ty1 + 0.01, 0.04), I(tx1, ty1 + 0.01, 0.04), u * 0.26, 5);

      // Vertical gold-and-white rosette trim strips framing the left & right edges of the tower front
      const insetX = 0.14;
      [tx0 + insetX, tx1 - insetX].forEach(vx => {
        ln(I(vx, ty1 + 0.01, 0.30), I(vx, ty1 + 0.01, zUpperTier - 0.15), gold, u * 0.075);
        for (let rz = 0.55; rz <= zUpperTier - 0.45; rz += 0.58) {
          drawRosette(I(vx, ty1 + 0.015, rz), u * 0.048);
        }
      });

      // 6 Stacked Rows of Alternating Golden Sirrush Dragons & Ivory Aurochs Bulls (2 per row!)
      const rowsZ = [0.68, 1.34, 2.00, 2.66, 3.32, 3.98];
      rowsZ.forEach((zr, rIdx) => {
        const isDragon = rIdx % 2 === 0;
        drawReliefCreature(I(xm - 0.44, ty1 + 0.015, zr), dirFacing, u * 0.52, isDragon);
        drawReliefCreature(I(xm + 0.44, ty1 + 0.015, zr), dirFacing, u * 0.52, isDragon);
      });

      // Mid-tower horizontal glazed rosette cornice separating main shaft from upper watch-tier
      drawGlazedFriezeBand(I(tx0 - 0.03, ty1 + 0.02, zUpperTier - 0.18), I(tx1 + 0.03, ty1 + 0.02, zUpperTier - 0.18), u * 0.28, 5);

      // Upper Watch-Tier Pair of Recessed Circular Shield/Bullseye Bosses (Exact Reference Match!)
      [-0.46, 0.46].forEach(bxOff => {
        const pBoss = I(xm + bxOff, ty1 + 0.02, zUpperTier + 0.56);
        ell(pBoss[0], pBoss[1], u * 0.22, u * 0.25, gold);
        ell(pBoss[0], pBoss[1], u * 0.16, u * 0.18, lapisD);
        ell(pBoss[0], pBoss[1], u * 0.09, u * 0.10, '#090d16');
        ell(pBoss[0] - u * 0.03, pBoss[1] - u * 0.03, u * 0.03, u * 0.03, '#38bdf8');
      });

      // Top tower glazed rosette frieze & stepped crow-step crenellations
      drawGlazedFriezeBand(I(tx0 - 0.03, ty1 + 0.02, zTower - 0.34), I(tx1 + 0.03, ty1 + 0.02, zTower - 0.34), u * 0.28, 5);
      drawCrenellations(I(tx0, ty1, zTower), I(tx1, ty1, zTower), 4, u * 0.34, lapisL, lapisD);
    }

    if (visRight) {
      drawGlazedFriezeBand(I(tx1 + 0.01, ty0, 0.04), I(tx1 + 0.01, ty1, 0.04), u * 0.26, 3);
      [1.05, 2.15, 3.25].forEach((zr, rIdx) => {
        drawReliefCreature(I(tx1 + 0.015, (ty0 + ty1) * 0.5, zr), 1, u * 0.48, rIdx % 2 === 0);
      });
      drawGlazedFriezeBand(I(tx1 + 0.02, ty0 - 0.02, zUpperTier - 0.18), I(tx1 + 0.02, ty1 + 0.02, zUpperTier - 0.18), u * 0.28, 3);
      drawGlazedFriezeBand(I(tx1 + 0.02, ty0 - 0.02, zTower - 0.34), I(tx1 + 0.02, ty1 + 0.02, zTower - 0.34), u * 0.28, 3);
      drawCrenellations(I(tx1, ty0, zTower), I(tx1, ty1, zTower), 3, u * 0.34, lapisR, lapisD);
    }

    if (visLeft) {
      drawGlazedFriezeBand(I(tx0 - 0.01, ty1, 0.04), I(tx0 - 0.01, ty0, 0.04), u * 0.26, 3);
      [1.05, 2.15, 3.25].forEach((zr, rIdx) => {
        drawReliefCreature(I(tx0 - 0.015, (ty0 + ty1) * 0.5, zr), -1, u * 0.48, rIdx % 2 === 0);
      });
      drawGlazedFriezeBand(I(tx0 - 0.02, ty1 + 0.02, zUpperTier - 0.18), I(tx0 - 0.02, ty0 - 0.02, zUpperTier - 0.18), u * 0.28, 3);
      drawGlazedFriezeBand(I(tx0 - 0.02, ty1 + 0.02, zTower - 0.34), I(tx0 - 0.02, ty0 - 0.02, zTower - 0.34), u * 0.28, 3);
      drawCrenellations(I(tx0, ty1, zTower), I(tx0, ty0, zTower), 3, u * 0.34, lapisL, lapisD);
    }
  };

  drawIshtarTower(-3.25, -1.15,  1);
  drawIshtarTower( 1.15,  3.25, -1);

  // 4. Processional Way Guardian Lion Plinths & Flickering Bronze Fire Braziers
  const flicker1 = Math.sin(t * 7.2) * u * 0.03;
  const flicker2 = Math.cos(t * 6.4) * u * 0.03;

  [[-1.65, 1.95, flicker1], [1.65, 1.95, flicker2]].forEach(([gx, gy, flk]) => {
    // Low glazed blue & gold guardian plinth
    drawPrism(gx - 0.34, gx + 0.34, gy - 0.42, gy + 0.42, 0, 0.54, {
      front: lapisF,
      right: lapisR,
      back:  lapisD,
      left:  lapisL,
      top:   goldM,
      stroke: lapisD,
      lw: u * 0.02
    });
    // Sculpted golden striding lion figure atop plinth
    const pLion = I(gx, gy, 0.72);
    ell(pLion[0], pLion[1], u * 0.26, u * 0.13, gold);
    ell(pLion[0] + (gx < 0 ? u * 0.14 : -u * 0.14), pLion[1] - u * 0.06, u * 0.12, u * 0.12, goldD);
  });

  // Twin Ceremonial Bronze Fire Braziers flanking the Ishtar Gate Archway
  [[-1.08, 1.48, flicker1], [1.08, 1.48, flicker2]].forEach(([bx, by, flk]) => {
    const pBase = I(bx, by, 0);
    const pBowl = [pBase[0], pBase[1] - u * 0.52];
    ln(pBase, pBowl, bronze, u * 0.16);
    ell(pBowl[0], pBowl[1], u * 0.22, u * 0.11, goldD);
    // Animated flame plume
    ell(pBowl[0], pBowl[1] - u * 0.14, u * 0.20 + flk, u * 0.28 + flk, 'rgba(249, 115, 22, 0.42)');
    ell(pBowl[0], pBowl[1] - u * 0.12, u * 0.12 + flk * 0.6, u * 0.18 + flk * 0.6, '#f97316');
    ell(pBowl[0], pBowl[1] - u * 0.09, u * 0.06, u * 0.10, '#fef08a');
  });

  // 5. Subtle Desert Dust & Golden Sun Motes when Animation is Enabled
  if (t > 0) {
    const rnd = mulberry32(8088);
    for (let m = 0; m < 10; m++) {
      const mx = cx + (rnd() - 0.5) * R * 1.45 + Math.sin(t * 1.1 + m) * u * 0.25;
      const my = cy - R * 0.15 + (rnd() - 0.5) * R * 0.95 - ((t * 12 + m * 19) % (R * 0.65));
      const alpha = 0.25 + 0.25 * Math.sin(t * 2.5 + m * 1.7);
      ell(mx, my, u * 0.032, u * 0.032, `rgba(253, 224, 71, ${alpha.toFixed(2)})`);
    }
  }
}

/* ===== 2X RETINA TRANSPARENT PNG BAKER ===== */
return drawTheaterBabylon;
})(),
  japan: (() => {
/* ===== DETERMINISTIC PRNG & COLOR UTILITIES ===== */
function mulberry32(seed) {
  let a = seed | 0;
  return function() {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shade(hex, amt) {
  if (!hex || hex[0] !== '#') return hex || '#888888';
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const adj = c => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  return `rgb(${adj(r)},${adj(g)},${adj(b)})`;
}

/* ===== ISOMETRIC PROJECTION & VECTOR PRIMITIVES ===== */
function isoProject(cx, cy, u, X, Y, Z, rot = 0) {
  let rx = X, ry = Y;
  if (rot !== 0) {
    const c = Math.cos(rot);
    const s = Math.sin(rot);
    rx = X * c - Y * s;
    ry = X * s + Y * c;
  }
  return [
    cx + (rx - ry) * 0.7 * u,
    cy + (rx + ry) * 0.35 * u - Z * u
  ];
}

function drawPoly(ctx, pts, fill, stroke, lw = 1) {
  ctx.beginPath();
  for (let i = 0; i < pts.length; i++) {
    if (i === 0) ctx.moveTo(pts[i][0], pts[i][1]);
    else ctx.lineTo(pts[i][0], pts[i][1]);
  }
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
}

function drawLine(ctx, a, b, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]);
  ctx.lineTo(b[0], b[1]);
  ctx.stroke();
}

function drawEllipse(ctx, x, y, rx, ry, fill, rot = 0, stroke = null, lw = 1) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(0.2, rx), Math.max(0.2, ry), rot, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.stroke();
  }
}

/* ===== BEVELLED NEUTRAL STONE / GRAVEL HEX BASE TILE ===== */
function drawJapanGardenHexBase(ctx, cx, cy, R, showGuides = false) {
  const verts = [
    [0.866, 0.29],
    [0, 0.58],
    [-0.866, 0.29],
    [-0.866, -0.29],
    [0, -0.58],
    [0.866, -0.29]
  ].map(([vx, vy]) => [cx + vx * R, cy + vy * R]);

  const depth = R * 0.085;

  // Ambient drop shadow under hex slab
  ctx.save();
  ctx.beginPath();
  verts.forEach(([vx, vy], i) => {
    const sy = vy + depth * 1.35;
    i === 0 ? ctx.moveTo(vx, sy) : ctx.lineTo(vx, sy);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(2, 6, 18, 0.58)';
  ctx.fill();
  ctx.restore();

  // Bevelled stone side faces
  const bevelFaces = [
    { i0: 1, i1: 2, col: '#64748b' },
    { i0: 0, i1: 1, col: '#475569' },
    { i0: 5, i1: 0, col: '#334155' }
  ];
  bevelFaces.forEach(({ i0, i1, col }) => {
    const p0 = verts[i0], p1 = verts[i1];
    drawPoly(ctx, [
      p0, p1,
      [p1[0], p1[1] + depth],
      [p0[0], p0[1] + depth]
    ], col, '#1e293b', 1);
  });

  // Clean neutral raked-stone hex surface
  const grad = ctx.createLinearGradient(cx - R * 0.85, cy - R * 0.55, cx + R * 0.85, cy + R * 0.55);
  grad.addColorStop(0.00, '#cbd5e1');
  grad.addColorStop(0.50, '#b0bccb');
  grad.addColorStop(1.00, '#94a3b8');

  drawPoly(ctx, verts, grad, '#e2e8f0', Math.max(1.4, R * 0.012));

  if (showGuides) {
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx - R * 0.9, cy);
    ctx.lineTo(cx + R * 0.9, cy);
    ctx.moveTo(cx, cy - R * 0.62);
    ctx.lineTo(cx, cy + R * 0.62);
    ctx.stroke();
    ctx.setLineDash([]);
    drawEllipse(ctx, cx, cy, 4, 4, '#f43f5e');
    ctx.restore();
  }
}

/* ============================================================================
   MAIN RENDERER: PHOENIX HALL (BYŌDŌ-IN) GRAND THEATER (JAPAN)
   Standalone Building Complex (No Pond, Flowers, Lanterns, or Bridges)
   ============================================================================ */
function drawTheaterJapan(ctx, cx, cy, R, opts = {}) {
  const rot = opts.rot || 0;
  const t = opts.t || 0;
  const u = R * 0.098;
  const cyB = cy + R * 0.14;

  const I = (X, Y, Z) => isoProject(cx, cyB, u, X, Y, Z, rot);
  const poly = (pts, fill, stroke, lw) => drawPoly(ctx, pts, fill, stroke, lw);
  const ln = (a, b, col, w) => drawLine(ctx, a, b, col, w || u * 0.05);
  const ell = (x, y, rx, ry, fill, rAng = 0, stroke = null, lw = 1) =>
    drawEllipse(ctx, x, y, rx, ry, fill, rAng, stroke, lw);

  // Face visibility tests under rotation `rot`
  const normFront = [-Math.sin(rot), Math.cos(rot)]; // +Y face normal
  const normRight = [ Math.cos(rot), Math.sin(rot)]; // +X face normal
  const normBack  = [ Math.sin(rot),-Math.cos(rot)]; // -Y face normal
  const normLeft  = [-Math.cos(rot),-Math.sin(rot)]; // -X face normal

  const visFront = (normFront[0] + normFront[1]) > -0.05;
  const visRight = (normRight[0] + normRight[1]) > -0.05;
  const visBack  = (normBack[0]  + normBack[1])  > -0.05;
  const visLeft  = (normLeft[0]  + normLeft[1])  > -0.05;

  // Painter-sorted 3D prism helper
  const drawPrism = (x0, x1, y0, y1, z0, z1, cols) => {
    const { front, right, back, left, top, stroke, lw } = cols;
    const faces = [];
    if (visBack && back) {
      faces.push({ pts: [I(x0, y0, z0), I(x1, y0, z0), I(x1, y0, z1), I(x0, y0, z1)], fill: back });
    }
    if (visLeft && left) {
      faces.push({ pts: [I(x0, y0, z0), I(x0, y1, z0), I(x0, y1, z1), I(x0, y0, z1)], fill: left });
    }
    if (visFront && front) {
      faces.push({ pts: [I(x0, y1, z0), I(x1, y1, z0), I(x1, y1, z1), I(x0, y1, z1)], fill: front });
    }
    if (visRight && right) {
      faces.push({ pts: [I(x1, y0, z0), I(x1, y1, z0), I(x1, y1, z1), I(x1, y0, z1)], fill: right });
    }
    faces.forEach(f => poly(f.pts, f.fill, stroke, lw));
    if (top !== false) {
      poly([I(x0, y0, z1), I(x1, y0, z1), I(x1, y1, z1), I(x0, y1, z1)], top, stroke, lw);
    }
  };

  // Authentic Heian-Period Byōdō-in Palette
  const plasW    = '#ffffff'; // Pure white shikkui plaster highlight
  const plasF    = '#f4f0e8'; // Warm white shikkui plaster wall
  const plasR    = '#dcd5c7'; // Shaded right plaster wall
  const vermL    = '#e04836'; // Sunlit vermilion lacquer
  const vermF    = '#c43222'; // Iconic Byōdō-in vermilion red
  const vermR    = '#942115'; // Shaded vermilion side
  const vermD    = '#69140c'; // Deep vermilion timber shadow
  const timber   = '#362218'; // Dark structural hinoki timber beams
  const roofL    = '#4a5568'; // Sunlit slate-charcoal kawara tile
  const roofF    = '#323c4d'; // Charcoal-blue kawara roof tile
  const roofR    = '#1e2533'; // Shaded right kawara slope
  const roofD    = '#111622'; // Deep roof eave shadow
  const jade     = '#158066'; // Tokyō bracket & frieze green accent
  const gold     = '#facc15'; // Gilded hōō phoenix finials & ridge caps
  const goldD    = '#a16207';
  const stoneL   = '#e2e8f0'; // White-grey granite plinth
  const stoneF   = '#cbd5e1';
  const stoneR   = '#94a3b8';
  const goldM    = '#eab308';

  // Helper: Crisp Faceted Japanese Irimoya (Hip-and-Gable) Roof with Upturned Eave Corners
  const drawJapaneseRoof = (x0, x1, y0, y1, zBase, rise, optsRoof = {}) => {
    const {
      overhang = 0.32,
      upturn = 0.22,
      ridgeAxis = 'X',
      phoenixFinials = false,
      jewelFinial = false,
      ridgeGold = true,
      gableInset = 0.58
    } = optsRoof;

    const xm = (x0 + x1) * 0.5;
    const ym = (y0 + y1) * 0.5;

    // 4 outer eave corners with subtle upturned feiyan/sori lift
    const eFL = I(x0 - overhang, y1 + overhang, zBase + upturn);
    const eFR = I(x1 + overhang, y1 + overhang, zBase + upturn);
    const eBR = I(x1 + overhang, y0 - overhang, zBase + upturn);
    const eBL = I(x0 - overhang, y0 - overhang, zBase + upturn);

    // Mid-eave points (slightly lower than corners to give authentic upturned corner sweep)
    const mF = I(xm, y1 + overhang * 0.96, zBase);
    const mR = I(x1 + overhang * 0.96, ym, zBase);
    const mB = I(xm, y0 - overhang * 0.96, zBase);
    const mL = I(x0 - overhang * 0.96, ym, zBase);

    // Under-eave dark timber rafter soffit plate
    poly([eFL, mF, eFR, mR, eBR, mB, eBL, mL], roofD);

    if (ridgeAxis === 'X') {
      const rL = I(x0 + gableInset, ym, zBase + rise);
      const rR = I(x1 - gableInset, ym, zBase + rise);
      const gL = I(x0 + gableInset * 0.55, ym, zBase + rise * 0.62);
      const gR = I(x1 - gableInset * 0.55, ym, zBase + rise * 0.62);

      // Back-left slope
      poly([eBL, mL, eFL, gL, rL, rR, gR, eBR, mB], roofL);
      // Front main slope (+Y)
      poly([eFL, mF, eFR, gR, rR, rL, gL], roofF);
      // Right hip skirt (+X)
      poly([eFR, mR, eBR, gR], roofR);
      // Left hip skirt (-X)
      poly([eBL, mL, eFL, gL], roofL);

      // Triangular Irimoya gable infill triangles at ends of main ridge
      poly([rL, gL, I(x0 + gableInset * 0.55, ym - 0.16, zBase + rise * 0.60), I(x0 + gableInset * 0.55, ym + 0.16, zBase + rise * 0.60)], plasW, timber, u * 0.02);
      poly([rR, gR, I(x1 - gableInset * 0.55, ym - 0.16, zBase + rise * 0.60), I(x1 - gableInset * 0.55, ym + 0.16, zBase + rise * 0.60)], plasR, timber, u * 0.02);

      // Kawara tile rib lines along front slope
      const nRibs = Math.max(5, Math.round((x1 - x0) * 2.2));
      for (let k = 1; k < nRibs; k++) {
        const f = k / nRibs;
        const pTop = [rL[0] + (rR[0] - rL[0]) * f, rL[1] + (rR[1] - rL[1]) * f];
        const pBot = [eFL[0] + (eFR[0] - eFL[0]) * f, eFL[1] + (eFR[1] - eFL[1]) * f];
        ln(pTop, pBot, 'rgba(15, 23, 42, 0.35)', u * 0.024);
      }
      // Tile ribs on right hip skirt
      for (let k = 1; k <= 3; k++) {
        const f = k / 4;
        const pBot = [eFR[0] + (eBR[0] - eFR[0]) * f, eFR[1] + (eBR[1] - eFR[1]) * f];
        ln(gR, pBot, 'rgba(10, 15, 28, 0.42)', u * 0.022);
      }

      // Crisp eave edge & descending hip ridges
      ln(eFL, mF, stoneL, u * 0.032);
      ln(mF, eFR, stoneL, u * 0.032);
      ln(eFR, mR, stoneF, u * 0.030);
      ln(mR, eBR, stoneF, u * 0.030);
      ln(eFL, gL, stoneF, u * 0.030);
      ln(eFR, gR, stoneF, u * 0.030);
      ln(eBR, gR, stoneR, u * 0.028);
      ln(gL, rL, stoneL, u * 0.036);
      ln(gR, rR, stoneL, u * 0.036);

      // Main horizontal ridge beam
      ln(rL, rR, ridgeGold ? gold : stoneL, u * 0.075);

      // Iconic Golden Hōō (Phoenix) Finials perched on both ends of the Central Hall ridge!
      if (phoenixFinials) {
        [rL, rR].forEach((rp, idx) => {
          const dir = idx === 0 ? -1 : 1;
          // Pedestal block
          ell(rp[0], rp[1] - u * 0.04, u * 0.09, u * 0.06, goldD);
          // Outstretched phoenix body, arched neck & tail plumes
          poly([
            [rp[0], rp[1] - u * 0.06],
            [rp[0] + dir * u * 0.14, rp[1] - u * 0.24],
            [rp[0] + dir * u * 0.20, rp[1] - u * 0.42],
            [rp[0] + dir * u * 0.06, rp[1] - u * 0.34],
            [rp[0] - dir * u * 0.12, rp[1] - u * 0.46],
            [rp[0] - dir * u * 0.06, rp[1] - u * 0.22]
          ], gold, goldD, u * 0.02);
          ell(rp[0] + dir * u * 0.18, rp[1] - u * 0.44, u * 0.05, u * 0.05, '#fef08a');
        });
      }

      if (jewelFinial) {
        const pMid = [(rL[0] + rR[0]) * 0.5, (rL[1] + rR[1]) * 0.5];
        ell(pMid[0], pMid[1] - u * 0.06, u * 0.11, u * 0.07, goldD);
        ln(pMid, [pMid[0], pMid[1] - u * 0.32], gold, u * 0.065);
        ell(pMid[0], pMid[1] - u * 0.34, u * 0.085, u * 0.085, '#fef08a');
      }
    } else {
      // Pyramid / Square Pavilion Hōgyō-zukuri roof (for the Rōkaku corner turrets)
      const pApex = I(xm, ym, zBase + rise);
      poly([eBL, mL, eFL, pApex], roofL);
      poly([eFL, mF, eFR, pApex], roofF);
      poly([eFR, mR, eBR, pApex], roofR);
      poly([eBR, mB, eBL, pApex], roofR);

      ln(eFL, mF, stoneL, u * 0.028);
      ln(mF, eFR, stoneL, u * 0.028);
      ln(eFR, mR, stoneF, u * 0.026);
      ln(mR, eBR, stoneF, u * 0.026);
      ln(eFL, pApex, stoneF, u * 0.032);
      ln(eFR, pApex, stoneF, u * 0.032);
      ln(eBR, pApex, stoneR, u * 0.028);

      if (jewelFinial) {
        ell(pApex[0], pApex[1] - u * 0.04, u * 0.12, u * 0.07, goldD);
        ln(pApex, [pApex[0], pApex[1] - u * 0.36], gold, u * 0.065);
        ell(pApex[0], pApex[1] - u * 0.38, u * 0.09, u * 0.09, '#fef08a');
      }
    }
  };

  // =========================================================================
  // 1. TIGHT GROUND CONTACT SHADOW & CLEAN GRANITE FOUNDATION PLINTH
  // =========================================================================
  poly([
    I(-3.65, 1.55, 0.00), I(3.65, 1.55, 0.00),
    I(3.65, -3.35, 0.00), I(-3.65, -3.35, 0.00)
  ], 'rgba(15, 23, 42, 0.32)');

  // Clean Low Granite Foundation Plinth (`Z: 0.00 .. 0.18`) directly under the building
  drawPrism(-3.55, 3.55, -3.25, 1.48, 0.00, 0.18, {
    front: stoneR,
    right: '#64748b',
    back:  '#64748b',
    left:  stoneF,
    top:   stoneL,
    stroke: '#64748b',
    lw: u * 0.02
  });

  // =========================================================================
  // 2. ENCLOSED TRADITIONAL JAPANESE AUDITORIUM BOX (Masked Behind Facade!)
  //    X: -3.10 .. +3.10, Y: -3.20 .. +0.35, Z: 0.18 .. 4.30
  // =========================================================================
  const bx0 = -3.10, bx1 = 3.10;
  const by0 = -3.20, by1 = 0.35;
  const bz0 = 0.18,  bz1 = 4.30;

  // Stone foundation plinth under auditorium box
  drawPrism(bx0 - 0.06, bx1 + 0.06, by0 - 0.06, by1, bz0, bz0 + 0.42, {
    front: stoneF, right: stoneR, back: stoneR, left: stoneL, top: stoneL, stroke: '#64748b', lw: u * 0.02
  });

  // White shikkui-plaster enclosed auditorium box walls
  drawPrism(bx0, bx1, by0, by1, bz0 + 0.42, bz1, {
    front: plasF,
    right: plasR,
    back:  plasR,
    left:  plasW,
    top:   plasF,
    stroke: timber,
    lw: u * 0.022
  });

  // Dark Hinoki timber structural post-and-beam framing on the enclosed box walls
  for (let ty = -2.85; ty <= 0.15; ty += 0.75) {
    if (visRight) {
      ln(I(bx1 + 0.01, ty, bz0 + 0.42), I(bx1 + 0.01, ty, bz1), timber, u * 0.085);
    }
    if (visLeft) {
      ln(I(bx0 - 0.01, ty, bz0 + 0.42), I(bx0 - 0.01, ty, bz1), timber, u * 0.085);
    }
  }
  for (let tx = -2.75; tx <= 2.75; tx += 1.10) {
    if (visBack) {
      ln(I(tx, by0 - 0.01, bz0 + 0.42), I(tx, by0 - 0.01, bz1), timber, u * 0.085);
    }
  }
  // Horizontal nageshi tie-beams & vermilion trim bands wrapping the auditorium box
  [1.85, 3.15, bz1 - 0.18].forEach((zb, idx) => {
    const bCol = idx === 2 ? vermF : timber;
    const bW   = idx === 2 ? u * 0.11 : u * 0.065;
    if (visRight) ln(I(bx1 + 0.015, by0, zb), I(bx1 + 0.015, by1, zb), bCol, bW);
    if (visLeft)  ln(I(bx0 - 0.015, by0, zb), I(bx0 - 0.015, by1, zb), bCol, bW);
    if (visBack)  ln(I(bx0, by0 - 0.015, zb), I(bx1, by0 - 0.015, zb), bCol, bW);
  });

  // Shōji warm backlit lattice clerestory windows along the upper box flanks
  for (let wy = -2.45; wy <= -0.25; wy += 0.75) {
    if (visRight) {
      poly([
        I(bx1 + 0.015, wy - 0.22, 3.30), I(bx1 + 0.015, wy + 0.22, 3.30),
        I(bx1 + 0.015, wy + 0.22, 3.92), I(bx1 + 0.015, wy - 0.22, 3.92)
      ], '#fef3c7', timber, u * 0.025);
    }
    if (visLeft) {
      poly([
        I(bx0 - 0.015, wy - 0.22, 3.30), I(bx0 - 0.015, wy + 0.22, 3.30),
        I(bx0 - 0.015, wy + 0.22, 3.92), I(bx0 - 0.015, wy - 0.22, 3.92)
      ], '#fef9c3', timber, u * 0.025);
    }
  }

  // Main Charcoal-Blue Kawara Tiled Roof & Raised Upper Clerestory Monitor over Auditorium Box
  drawJapaneseRoof(bx0, bx1, by0, by1, bz1, 1.38, {
    overhang: 0.34,
    upturn: 0.24,
    ridgeAxis: 'X',
    ridgeGold: true,
    gableInset: 0.72
  });

  // Raised Upper Acoustic Clerestory Lantern Monitor atop the Main Box Roof
  const zMon0 = bz1 + 0.92, zMon1 = bz1 + 1.54;
  drawPrism(-1.85, 1.85, -2.15, -0.75, zMon0, zMon1, {
    front: plasW, right: plasR, back: plasR, left: plasW, top: plasF, stroke: timber, lw: u * 0.02
  });
  drawJapaneseRoof(-1.85, 1.85, -2.15, -0.75, zMon1, 0.86, {
    overhang: 0.26,
    upturn: 0.18,
    ridgeAxis: 'X',
    jewelFinial: true,
    ridgeGold: true,
    gableInset: 0.45
  });

  // =========================================================================
  // 3. MONUMENTAL BYŌDŌ-IN (PHOENIX HALL) FACADE MASKING THE FRONT (`Y: +0.35 .. +1.55`)
  //    - Left & Right Elevated Wing Corridors (Yoku-rō) + Corner Turrets (Rōkaku)
  //    - Central Two-Story Main Hall (Chū-dō) with Golden Hōō Phoenix Finials
  // =========================================================================

  // Helper: Draw one of the Symmetrical Wing Corridors (Yoku-rō) & Corner Turret (Rōkaku)
  const drawPhoenixWing = (sideSign) => {
    // sideSign = -1 for Left Wing (X: -3.45 .. -1.15), +1 for Right Wing (X: +1.15 .. +3.45)
    const xInner = sideSign * 1.15;
    const xTurIn = sideSign * 2.45;
    const xOuter = sideSign * 3.45;
    const wx0 = Math.min(xInner, xTurIn), wx1 = Math.max(xInner, xTurIn);
    const tx0 = Math.min(xTurIn, xOuter), tx1 = Math.max(xTurIn, xOuter);
    const wy0 = 0.35, wy1 = 1.25;
    const ty0 = 0.35, ty1 = 1.38;

    // 3A. Elevated Gallery Corridor (Yoku-rō)
    const zDeck = 1.38;
    const zGalTop = 2.75;
    // Lower stilted vermilion support pillars standing in the shallow stone plinth
    [wx0 + 0.15, (wx0 + wx1) * 0.5, wx1 - 0.15].forEach(px => {
      ln(I(px, wy1 - 0.06, 0.16), I(px, wy1 - 0.06, zDeck), vermF, u * 0.12);
      ln(I(px, wy0 + 0.06, 0.16), I(px, wy0 + 0.06, zDeck), vermR, u * 0.11);
    });
    // Lower horizontal vermilion tie-beam
    if (visFront) ln(I(wx0, wy1 - 0.04, 0.72), I(wx1, wy1 - 0.04, 0.72), vermF, u * 0.075);

    // Elevated gallery deck & red balustrade railing
    drawPrism(wx0, wx1, wy0, wy1, zDeck, zDeck + 0.18, {
      front: vermL, right: vermR, back: vermD, left: vermL, top: '#7c2d12', stroke: vermD, lw: u * 0.018
    });
    if (visFront) {
      ln(I(wx0, wy1 + 0.02, zDeck + 0.44), I(wx1, wy1 + 0.02, zDeck + 0.44), vermL, u * 0.055);
      for (let bx = wx0 + 0.18; bx <= wx1 - 0.12; bx += 0.34) {
        ln(I(bx, wy1 + 0.02, zDeck + 0.18), I(bx, wy1 + 0.02, zDeck + 0.44), vermF, u * 0.045);
      }
    }

    // Upper corridor colonnade, white plaster frieze & charcoal-blue tiled corridor roof
    [wx0 + 0.15, (wx0 + wx1) * 0.5, wx1 - 0.15].forEach(px => {
      ln(I(px, wy1 - 0.05, zDeck + 0.18), I(px, wy1 - 0.05, zGalTop), vermL, u * 0.11);
    });
    drawPrism(wx0, wx1, wy0, wy1, zGalTop - 0.42, zGalTop, {
      front: plasW, right: plasR, back: plasR, left: plasW, top: vermF, stroke: vermD, lw: u * 0.018
    });
    if (visFront) {
      ln(I(wx0, wy1 + 0.01, zGalTop - 0.42), I(wx1, wy1 + 0.01, zGalTop - 0.42), vermF, u * 0.065);
      ln(I(wx0, wy1 + 0.01, zGalTop), I(wx1, wy1 + 0.01, zGalTop), jade, u * 0.065);
    }
    drawJapaneseRoof(wx0, wx1, wy0, wy1, zGalTop, 0.78, {
      overhang: 0.22,
      upturn: 0.16,
      ridgeAxis: 'X',
      ridgeGold: false,
      gableInset: 0.25
    });

    // 3B. Corner Two-Tiered Pavilion Turret (Rōkaku) anchoring each wing end!
    const zTur1 = 3.15;
    const zTur2 = 4.35;

    // Lower open-pillar turret stage
    [tx0 + 0.12, tx1 - 0.12].forEach(px => {
      [ty0 + 0.12, ty1 - 0.12].forEach(py => {
        ln(I(px, py, 0.16), I(px, py, zTur1), vermF, u * 0.13);
      });
    });
    // Mid-level turret gallery deck & balustrade
    drawPrism(tx0 - 0.04, tx1 + 0.04, ty0 - 0.04, ty1 + 0.04, zDeck, zDeck + 0.20, {
      front: vermL, right: vermR, back: vermD, left: vermL, top: '#7c2d12', stroke: vermD, lw: u * 0.018
    });
    if (visFront) {
      ln(I(tx0 - 0.04, ty1 + 0.05, zDeck + 0.46), I(tx1 + 0.04, ty1 + 0.05, zDeck + 0.46), vermL, u * 0.055);
    }
    if (visRight && sideSign > 0) {
      ln(I(tx1 + 0.05, ty0 - 0.04, zDeck + 0.46), I(tx1 + 0.05, ty1 + 0.04, zDeck + 0.46), vermR, u * 0.055);
    }

    // First-tier white plaster upper frieze & eaves roof
    drawPrism(tx0, tx1, ty0, ty1, zTur1 - 0.56, zTur1, {
      front: plasW, right: plasR, back: plasR, left: plasW, top: vermF, stroke: vermD, lw: u * 0.018
    });
    drawJapaneseRoof(tx0, tx1, ty0, ty1, zTur1, 0.72, {
      overhang: 0.28,
      upturn: 0.20,
      ridgeAxis: 'Y',
      ridgeGold: false,
      gableInset: 0.28
    });

    // Second-tier upper turret belvedere box & crowning Hōgyō pyramid roof with jewel finial
    const ins2 = 0.18;
    drawPrism(tx0 + ins2, tx1 - ins2, ty0 + ins2, ty1 - ins2, zTur1 + 0.35, zTur2, {
      front: plasW, right: plasR, back: plasR, left: plasW, top: vermF, stroke: timber, lw: u * 0.018
    });
    // Vermilion corner pillars & window lattice on upper turret story
    if (visFront) {
      ln(I(tx0 + ins2, ty1 - ins2 + 0.01, zTur1 + 0.35), I(tx0 + ins2, ty1 - ins2 + 0.01, zTur2), vermL, u * 0.09);
      ln(I(tx1 - ins2, ty1 - ins2 + 0.01, zTur1 + 0.35), I(tx1 - ins2, ty1 - ins2 + 0.01, zTur2), vermF, u * 0.09);
      ln(I(tx0 + ins2, ty1 - ins2 + 0.01, zTur2 - 0.06), I(tx1 - ins2, ty1 - ins2 + 0.01, zTur2 - 0.06), jade, u * 0.065);
    }
    drawJapaneseRoof(tx0 + ins2, tx1 - ins2, ty0 + ins2, ty1 - ins2, zTur2, 0.88, {
      overhang: 0.26,
      upturn: 0.20,
      ridgeAxis: 'P',
      jewelFinial: true
    });
  };

  drawPhoenixWing(-1);
  drawPhoenixWing( 1);

  // 3C. Central Two-Story Main Hall (Chū-dō) Masking the Center Front (`X: -1.18 .. +1.18`, `Y: +0.35 .. +1.55`)
  const cx0 = -1.18, cx1 = 1.18;
  const cy0 = 0.35,  cy1 = 1.55;
  const zBase = 0.56;
  const zLowRoof = 2.95;
  const zTopRoof = 4.65;

  // White granite podium platform & central ceremonial steps (`Z: 0.16 .. 0.56`)
  drawPrism(cx0 - 0.08, cx1 + 0.08, cy0, cy1 + 0.08, 0.16, zBase, {
    front: stoneL, right: stoneR, back: stoneR, left: stoneL, top: stoneL, stroke: '#64748b', lw: u * 0.02
  });
  if (visFront) {
    poly([
      I(-0.56, cy1 + 0.42, 0.16), I(0.56, cy1 + 0.42, 0.16),
      I(0.56, cy1 + 0.08, zBase), I(-0.56, cy1 + 0.08, zBase)
    ], stoneL, '#64748b', u * 0.02);
    for (let s = 1; s < 4; s++) {
      const f = s / 4;
      ln(I(-0.56, cy1 + 0.42 - 0.34 * f, 0.16 + 0.40 * f), I(0.56, cy1 + 0.42 - 0.34 * f, 0.16 + 0.40 * f), stoneR, u * 0.022);
    }
  }

  // Lower Story: Vermilion timber & white plaster sanctuary core with lattice doors
  drawPrism(cx0 + 0.12, cx1 - 0.12, cy0, cy1 - 0.16, zBase, zLowRoof, {
    front: vermF, right: vermR, back: plasR, left: vermL, top: vermF, stroke: vermD, lw: u * 0.02
  });

  // Front Veranda Colonnade (6 tall vermilion columns across `cy1`) & Ornate Lattice Doors
  const colXs = [-1.12, -0.66, -0.24, 0.24, 0.66, 1.12];
  colXs.forEach(px => {
    ln(I(px, cy1, zBase), I(px, cy1, zLowRoof), vermL, u * 0.14);
    // Gold-and-jade tokyō bracket capital atop each column
    ell(...I(px, cy1, zLowRoof - 0.06), u * 0.12, u * 0.07, jade);
  });

  if (visFront) {
    // Central sanctuary portal doors revealing warm golden lantern glow inside
    poly([
      I(-0.34, cy1 - 0.15, zBase), I(0.34, cy1 - 0.15, zBase),
      I(0.34, cy1 - 0.15, zLowRoof - 0.48), I(-0.34, cy1 - 0.15, zLowRoof - 0.48)
    ], '#29150c', gold, u * 0.035);
    // Warm golden glow inside the sanctuary shrine
    const glowPulse = 0.85 + 0.15 * Math.sin(t * 3.0);
    poly([
      I(-0.22, cy1 - 0.14, zBase + 0.04), I(0.22, cy1 - 0.14, zBase + 0.04),
      I(0.22, cy1 - 0.14, zLowRoof - 0.62), I(-0.22, cy1 - 0.14, zLowRoof - 0.62)
    ], `rgba(251, 191, 36, ${(0.42 * glowPulse).toFixed(2)})`);

    // Flanking vermilion shitomido lattice panels on left & right bays
    [-0.78, 0.78].forEach(bx => {
      poly([
        I(bx - 0.24, cy1 - 0.15, zBase + 0.28), I(bx + 0.24, cy1 - 0.15, zBase + 0.28),
        I(bx + 0.24, cy1 - 0.15, zLowRoof - 0.52), I(bx - 0.24, cy1 - 0.15, zLowRoof - 0.52)
      ], vermL, goldD, u * 0.025);
      ln(I(bx - 0.24, cy1 - 0.14, (zBase + zLowRoof) * 0.48), I(bx + 0.24, cy1 - 0.14, (zBase + zLowRoof) * 0.48), goldM, u * 0.028);
    });

    // Horizontal vermilion lintel beam & green-and-gold tokyō bracket frieze
    ln(I(cx0, cy1 + 0.01, zLowRoof - 0.34), I(cx1, cy1 + 0.01, zLowRoof - 0.34), vermL, u * 0.085);
    ln(I(cx0, cy1 + 0.01, zLowRoof - 0.12), I(cx1, cy1 + 0.01, zLowRoof - 0.12), jade, u * 0.085);
  }

  // Lower Eave Skirt Roof (Mokoshi) wrapping the Central Main Hall
  drawJapaneseRoof(cx0, cx1, cy0, cy1, zLowRoof, 0.92, {
    overhang: 0.28,
    upturn: 0.20,
    ridgeAxis: 'X',
    ridgeGold: false,
    gableInset: 0.36
  });

  // Upper Clerestory Story of the Central Main Hall (`z: 3.45 .. 4.65`)
  const ux0 = -0.94, ux1 = 0.94;
  const uy0 = 0.42,  uy1 = 1.32;
  drawPrism(ux0, ux1, uy0, uy1, zLowRoof + 0.42, zTopRoof, {
    front: plasW, right: plasR, back: plasR, left: plasW, top: vermF, stroke: timber, lw: u * 0.02
  });
  if (visFront) {
    [-0.90, -0.32, 0.32, 0.90].forEach(px => {
      ln(I(px, uy1 + 0.01, zLowRoof + 0.42), I(px, uy1 + 0.01, zTopRoof), vermL, u * 0.10);
    });
    ln(I(ux0, uy1 + 0.01, zTopRoof - 0.32), I(ux1, uy1 + 0.01, zTopRoof - 0.32), vermF, u * 0.075);
    ln(I(ux0, uy1 + 0.01, zTopRoof - 0.10), I(ux1, uy1 + 0.01, zTopRoof - 0.10), jade, u * 0.085);
    // Central high window opening under the upper eave
    poly([
      I(-0.24, uy1 + 0.015, zLowRoof + 0.56), I(0.24, uy1 + 0.015, zLowRoof + 0.56),
      I(0.24, uy1 + 0.015, zTopRoof - 0.38), I(-0.24, uy1 + 0.015, zTopRoof - 0.38)
    ], '#29150c', goldM, u * 0.025);
  }

  // Grand Crowning Irimoya Roof of the Central Main Hall with Twin Golden Hōō Phoenix Finials!
  drawJapaneseRoof(ux0, ux1, uy0, uy1, zTopRoof, 1.36, {
    overhang: 0.36,
    upturn: 0.26,
    ridgeAxis: 'X',
    phoenixFinials: true,
    ridgeGold: true,
    gableInset: 0.42
  });
}

/* ===== 2X RETINA TRANSPARENT PNG BAKER ===== */
return drawTheaterJapan;
})(),
  rome: (() => {
/* ===== SHARED ISOMETRIC & COLOR HELPERS ===== */
function shade(hex, amt) {
  if (!hex || hex[0] !== '#') return hex || '#888888';
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = c => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

function hexPath(c, x, y, R) {
  c.beginPath();
  [[0.866, 0.29], [0, 0.58], [-0.866, 0.29], [-0.866, -0.29], [0, -0.58], [0.866, -0.29]].forEach((v, i) => {
    const px = x + v[0] * R, py = y + v[1] * R;
    i ? c.lineTo(px, py) : c.moveTo(px, py);
  });
  c.closePath();
}

const TH = {
  ln(ctx, a, b, c, w) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  },
  ell(ctx, x, y, rx, ry, c, rot) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(0.2, rx), Math.max(0.2, ry), rot || 0, 0, Math.PI * 2);
    ctx.fill();
  },
  poly(ctx, pts, fill, stroke, lw) {
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.lineJoin = 'round'; ctx.stroke(); }
  },
  iso(x, y, u, X, Y, Z) {
    return [x + (X - Y) * 0.7 * u, y + (X + Y) * 0.35 * u - Z * u];
  }
};

/* ============================================================================
   ANCIENT ROME THEATER FACILITY: FLAVIAN COLOSSEUM AMPHITHEATER
   ============================================================================ */
function drawTheaterRome(ctx, cx, cy, R, opts = {}) {
  const flip = !!opts.flip;
  const t = opts.t || 0;
  const u = R * 0.112;
  const cyB = cy + R * 0.17;

  const I = (X, Y, Z) => TH.iso(cx, cyB, u, X, Y, Z);
  const poly = (pts, fill, stroke, lw) => TH.poly(ctx, pts, fill, stroke, lw);
  const ln = (a, b, col, w) => TH.ln(ctx, a, b, col, w || u * 0.055);
  const ell = (x, y, rx, ry, fill, rot = 0) => TH.ell(ctx, x, y, rx, ry, fill, rot);

  if (opts.tile) {
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = '#768646';
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, R * 0.025);
    ctx.strokeStyle = '#55632c';
    ctx.stroke();
  }

  ctx.save();
  if (flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  // Imperial Roman Travertine & Arena Palette
  const travL   = '#f7efe0'; // Sunlit travertine highlight
  const travF   = '#e6d6b8'; // Warm Roman travertine main
  const travR   = '#bfa982'; // Shaded right travertine
  const travD   = '#8c7654'; // Deep stone shadow
  const travT   = '#fcf8f0'; // Top rim marble
  const archVoid= '#1c1510'; // Deep vaulted arcade shadow
  const sandF   = '#e8c488'; // Arena floor sand
  const sandD   = '#c99f5d';
  const pompRed = '#9e3324'; // Pompeian crimson velarium & podium
  const purp    = '#5b2147'; // Imperial purple banner
  const gold    = '#eab308'; // Gilded bronze shields & finials
  const goldHi  = '#fef08a';

  // Elliptical footprint helper oriented along the primary isometric axis
  const rotAng = -0.36;
  const cosR = Math.cos(rotAng), sinR = Math.sin(rotAng);
  const aOut = 4.25, bOut = 3.35; // Outer elliptical semi-axes in world units

  const rimPt = (theta, scaleR = 1.0, z = 0) => {
    const lx = aOut * scaleR * Math.cos(theta);
    const ly = bOut * scaleR * Math.sin(theta);
    const wx = lx * cosR - ly * sinR;
    const wy = lx * sinR + ly * cosR;
    return I(wx, wy, z);
  };

  // Helper: Draw a complete elliptical prism ring between z0 and z1
  const drawEllipticalBand = (scaleR, z0, z1, colL, colM, colR, colTop = null) => {
    const N = 48;
    // Draw segmented outer wall quads from back to front so lighting wraps smoothly around the ellipse
    const segs = [];
    for (let i = 0; i < N; i++) {
      const a0 = (i / N) * Math.PI * 2;
      const a1 = ((i + 1) / N) * Math.PI * 2;
      const am = (a0 + a1) * 0.5;
      const p0B = rimPt(a0, scaleR, z0), p1B = rimPt(a1, scaleR, z0);
      const p1T = rimPt(a1, scaleR, z1), p0T = rimPt(a0, scaleR, z1);
      const depthY = (p0B[1] + p1B[1]) * 0.5;
      // Directional sunlight from front-left (-X, +Y in screen)
      const lightDot = -Math.cos(am - 0.55);
      const col = lightDot > 0.25 ? colL : (lightDot > -0.35 ? colM : colR);
      segs.push({ depthY, pts: [p0B, p1B, p1T, p0T], col });
    }
    segs.sort((a, b) => a.depthY - b.depthY).forEach(s => {
      poly(s.pts, s.col);
    });

    if (colTop) {
      const topPts = [];
      for (let i = 0; i < N; i++) {
        topPts.push(rimPt((i / N) * Math.PI * 2, scaleR, z1));
      }
      poly(topPts, colTop);
    }
  };

  // 1. Ground Ambient Shadow & Travertine Piazza Apron
  const pGnd = I(0.35, 0.25, 0);
  ell(pGnd[0], pGnd[1], u * 5.6, u * 2.85, 'rgba(20, 22, 10, 0.34)', rotAng * 0.5);

  // Subtle paved travertine forecourt ring around the Colosseum base
  const apronPts = [];
  for (let i = 0; i < 48; i++) apronPts.push(rimPt((i / 48) * Math.PI * 2, 1.08, 0));
  poly(apronPts, 'rgba(223, 208, 180, 0.42)');

  // 2. Stepped Travertine Stylobate Base (z = 0.00 .. 0.34)
  drawEllipticalBand(1.03, 0.00, 0.34, travF, travR, travD, travT);

  // 3. Lower Three Arched Arcade Stories (z = 0.34 .. 3.16)
  const zWall0 = 0.34;
  const zTier1 = 1.28;
  const zTier2 = 2.22;
  const zTier3 = 3.16;
  const zAttic = 4.14; // Iconic 4th attic story!

  // Main solid travertine drum for the 3 lower arcade stories
  drawEllipticalBand(1.00, zWall0, zTier3, travL, travF, travR, travT);

  // Draw the 4th Attic Story (Stepped silhouette: full height on the back-left arc, stepped down on front-right!)
  const N_ATTIC = 48;
  const atticSegs = [];
  for (let i = 0; i < N_ATTIC; i++) {
    const a0 = (i / N_ATTIC) * Math.PI * 2;
    const a1 = ((i + 1) / N_ATTIC) * Math.PI * 2;
    const am = (a0 + a1) * 0.5;
    // Iconic stepped Colosseum silhouette: full 4th attic on the upper/left half, stepping down on front-right
    const isFullAttic = Math.sin(am + 0.65) < 0.32;
    const zTopSeg = isFullAttic ? zAttic : zTier3 + 0.16;

    const p0B = rimPt(a0, 1.00, zTier3), p1B = rimPt(a1, 1.00, zTier3);
    const p1T = rimPt(a1, 1.00, zTopSeg), p0T = rimPt(a0, 1.00, zTopSeg);
    const depthY = (p0B[1] + p1B[1]) * 0.5;
    const lightDot = -Math.cos(am - 0.55);
    const col = lightDot > 0.25 ? travL : (lightDot > -0.35 ? travF : travR);
    atticSegs.push({ depthY, pts: [p0B, p1B, p1T, p0T], col, am, isFullAttic, zTopSeg });
  }
  atticSegs.sort((a, b) => a.depthY - b.depthY).forEach(s => {
    poly(s.pts, s.col);
  });

  // 4. Interior Bowl: Stepped Marble Cavea Seating Tiers, Podium Wall & Sunken Sandy Arena
  //    Drawn inside the top rim so the open-air amphitheater interior has crisp 3D depth!
  const drawClosedEllipsePoly = (scaleR, z, fill, stroke = null, lw = 0) => {
    const pts = [];
    for (let i = 0; i < 48; i++) pts.push(rimPt((i / 48) * Math.PI * 2, scaleR, z));
    poly(pts, fill, stroke, lw);
  };

  // Outer attic walk rim & upper maenianum seating ring
  drawClosedEllipsePoly(0.95, zTier3 + 0.04, travR, travD, u * 0.03);
  // Concentric stepped marble Cavea seating tiers descending into the bowl
  const caveaTiers = [
    { sr: 0.90, z: 2.75, col: travF },
    { sr: 0.83, z: 2.32, col: travR },
    { sr: 0.76, z: 1.90, col: travF },
    { sr: 0.69, z: 1.48, col: travR },
    { sr: 0.62, z: 1.08, col: travD } // Tall marble podium wall bordering the arena
  ];
  caveaTiers.forEach(ct => {
    drawClosedEllipsePoly(ct.sr, ct.z, ct.col, 'rgba(60, 48, 32, 0.35)', u * 0.022);
  });

  // Radial vomitoria staircases dividing the marble seating wedges
  for (let v = 0; v < 12; v++) {
    const ang = (v / 12) * Math.PI * 2 + 0.15;
    ln(rimPt(ang, 0.92, 2.82), rimPt(ang, 0.62, 1.08), 'rgba(54, 42, 26, 0.42)', u * 0.035);
  }

  // Sunken Sandy Arena Floor (z = 0.68) with Wooden Trapdoor Stage & Imperial Crimson Podium Trim
  drawClosedEllipsePoly(0.58, 0.68, sandF, pompRed, u * 0.055);
  // Subtle raked arena sand tracks & central timber hypogeum stage platform
  const pArena = I(0, 0, 0.69);
  ell(pArena[0], pArena[1], u * 1.45, u * 0.74, sandD);
  ell(pArena[0], pArena[1], u * 1.25, u * 0.62, sandF);

  // Central wooden performance stage & tiny gladiator/actor figures
  poly([
    I(-0.48, 0.32, 0.72), I(0.48, 0.32, 0.72),
    I(0.48, -0.32, 0.72), I(-0.48, -0.32, 0.72)
  ], '#8c5832', '#451a03', u * 0.03);
  const pulse = Math.sin(t * 2.5) * u * 0.04;
  ell(pArena[0] - u * 0.18, pArena[1] - u * 0.08 + pulse, u * 0.07, u * 0.11, pompRed);
  ell(pArena[0] + u * 0.18, pArena[1] - u * 0.06 - pulse, u * 0.07, u * 0.11, '#1d4ed8');

  // Re-draw the foreground front-facing outer wall arc (theta in [0.05*PI .. 0.95*PI]) over the interior
  // so the front-facing wall cleanly occludes the sunken arena floor!
  const N_BAYS = 28;
  const frontArcBays = [];
  for (let b = 0; b < N_BAYS; b++) {
    const a0 = (b / N_BAYS) * Math.PI * 2;
    const a1 = ((b + 1) / N_BAYS) * Math.PI * 2;
    const am = (a0 + a1) * 0.5;
    const pMid = rimPt(am, 1.00, 0);
    const isFrontFacing = pMid[1] >= cyB - u * 0.35;
    if (!isFrontFacing) continue;

    const isFullAttic = Math.sin(am + 0.65) < 0.32;
    const zTopSeg = isFullAttic ? zAttic : zTier3 + 0.16;
    const lightDot = -Math.cos(am - 0.55);
    const colWall = lightDot > 0.25 ? travL : (lightDot > -0.35 ? travF : travR);

    frontArcBays.push({ a0, a1, am, depthY: pMid[1], colWall, isFullAttic, zTopSeg });
  }

  frontArcBays.sort((a, b) => a.depthY - b.depthY).forEach(bay => {
    const { a0, a1, am, colWall, isFullAttic, zTopSeg } = bay;
    const p0B = rimPt(a0, 1.00, zWall0), p1B = rimPt(a1, 1.00, zWall0);
    const p1T = rimPt(a1, 1.00, zTopSeg), p0T = rimPt(a0, 1.00, zTopSeg);
    poly([p0B, p1B, p1T, p0T], colWall);

    // Three tiers of arched Roman arcades (Doric, Ionic, Corinthian)
    const span = a1 - a0;
    const archA0 = a0 + span * 0.20;
    const archA1 = a1 - span * 0.20;
    const archMid = (archA0 + archA1) * 0.5;

    [
      [zWall0 + 0.04, zTier1 - 0.14],
      [zTier1 + 0.04, zTier2 - 0.14],
      [zTier2 + 0.04, zTier3 - 0.14]
    ].forEach(([za0, za1], tierIdx) => {
      const zSpring = za0 + (za1 - za0) * 0.62;
      poly([
        rimPt(archA0, 1.002, za0),
        rimPt(archA1, 1.002, za0),
        rimPt(archA1, 1.002, zSpring),
        rimPt(archMid, 1.002, za1),
        rimPt(archA0, 1.002, zSpring)
      ], archVoid);

      // Engaged Doric/Ionic/Corinthian half-column & moulded cornice band
      ln(rimPt(a0, 1.008, za0 - 0.04), rimPt(a0, 1.008, za1 + 0.14), travT, u * 0.048);
      ln(rimPt(a0, 1.010, za1 + 0.14), rimPt(a1, 1.010, za1 + 0.14), travT, u * 0.045);

      if (tierIdx > 0) {
        const pStat = rimPt(archMid, 1.006, za0 + 0.06);
        ell(pStat[0], pStat[1] - u * 0.14, u * 0.045, u * 0.12, travT);
      }
    });

    // 4th Attic Story Pilasters, Windows & Gilded Bronze Clipei Shields
    if (isFullAttic) {
      ln(rimPt(a0, 1.008, zTier3), rimPt(a0, 1.008, zAttic), travT, u * 0.048);
      ln(rimPt(a0, 1.010, zAttic), rimPt(a1, 1.010, zAttic), travT, u * 0.055);
      poly([
        rimPt(a0 + span * 0.34, 1.004, zTier3 + 0.22),
        rimPt(a1 - span * 0.34, 1.004, zTier3 + 0.22),
        rimPt(a1 - span * 0.34, 1.004, zTier3 + 0.46),
        rimPt(a0 + span * 0.34, 1.004, zTier3 + 0.46)
      ], archVoid);
      const pShield = rimPt(archMid, 1.010, zTier3 + 0.68);
      ell(pShield[0], pShield[1], u * 0.075, u * 0.095, gold);
      ell(pShield[0] - u * 0.015, pShield[1] - u * 0.02, u * 0.032, u * 0.042, goldHi);
    } else {
      ln(rimPt(a0, 1.010, zTopSeg), rimPt(a1, 1.010, zTopSeg), travT, u * 0.055);
    }
  });

  // 5. Grand Imperial Entrance Portico on Front-Left Plaza (Aligned to Curved Wall Tangent)
  const entAng = Math.PI * 0.62;
  const pEntC = rimPt(entAng, 1.03, 0.34);
  const dAng = 0.135;
  const aL = entAng + dAng, aR = entAng - dAng;
  const rInPort = 0.99, rOutPort = 1.11;
  const zP0 = 0.34, zP1 = 1.62, zPed = 2.02;

  // Portico Side Cheek Walls & Front Projection Block
  poly([
    rimPt(aL, rInPort, zP0), rimPt(aL, rOutPort, zP0),
    rimPt(aL, rOutPort, zP1), rimPt(aL, rInPort, zP1)
  ], travL, travD, u * 0.025);
  poly([
    rimPt(aR, rInPort, zP0), rimPt(aR, rOutPort, zP0),
    rimPt(aR, rOutPort, zP1), rimPt(aR, rInPort, zP1)
  ], travR, travD, u * 0.025);
  poly([
    rimPt(aL, rOutPort, zP0), rimPt(aR, rOutPort, zP0),
    rimPt(aR, rOutPort, zP1), rimPt(aL, rOutPort, zP1)
  ], travT, travD, u * 0.032);

  // Recessed Rounded Roman Imperial Archway
  const archSpan = dAng * 0.56;
  const aAL = entAng + archSpan, aAR = entAng - archSpan;
  const zSpring = zP0 + (zP1 - zP0) * 0.56;
  const zCrown  = zP0 + (zP1 - zP0) * 0.84;
  poly([
    rimPt(aAL, rOutPort + 0.004, zP0),
    rimPt(aAR, rOutPort + 0.004, zP0),
    rimPt(aAR, rOutPort + 0.004, zSpring),
    rimPt(entAng + archSpan * 0.5, rOutPort + 0.004, zCrown * 0.96 + zSpring * 0.04),
    rimPt(entAng, rOutPort + 0.004, zCrown),
    rimPt(entAng - archSpan * 0.5, rOutPort + 0.004, zCrown * 0.96 + zSpring * 0.04),
    rimPt(aAL, rOutPort + 0.004, zSpring)
  ], archVoid);

  // Flanking Engaged Columns, Entablature Cornice & Triangular Classical Pediment
  ln(rimPt(aL - 0.02, rOutPort + 0.01, zP0), rimPt(aL - 0.02, rOutPort + 0.01, zP1), travT, u * 0.065);
  ln(rimPt(aR + 0.02, rOutPort + 0.01, zP0), rimPt(aR + 0.02, rOutPort + 0.01, zP1), travT, u * 0.065);
  ln(rimPt(aL, rOutPort + 0.015, zP1), rimPt(aR, rOutPort + 0.015, zP1), gold, u * 0.055);
  poly([
    rimPt(aL + 0.015, rOutPort + 0.01, zP1),
    rimPt(aR - 0.015, rOutPort + 0.01, zP1),
    rimPt(entAng, rOutPort + 0.01, zPed)
  ], travT, travD, u * 0.032);
  poly([
    rimPt(aL - 0.01, rOutPort + 0.014, zP1 + 0.04),
    rimPt(aR + 0.01, rOutPort + 0.014, zP1 + 0.04),
    rimPt(entAng, rOutPort + 0.014, zPed - 0.08)
  ], pompRed);
  // Threshold step at plaza level
  poly([
    rimPt(aL, rOutPort, 0.02), rimPt(aR, rOutPort, 0.02),
    rimPt(aR, rOutPort + 0.06, 0.02), rimPt(aL, rOutPort + 0.06, 0.02)
  ], travT, travD, u * 0.025);

  // 6. Wooden Velarium Rigging Masts & Billowing Crimson-and-Gold Sun-Shade Sails
  const wave = Math.sin(t * 2.1) * u * 0.04;
  const nMasts = 14;
  for (let m = 0; m < nMasts; m++) {
    const a = (m / nMasts) * Math.PI * 2 + 0.18;
    const isFullAttic = Math.sin(a + 0.65) < 0.32;
    const zBaseM = isFullAttic ? zAttic : zTier3 + 0.16;
    const pM0 = rimPt(a, 0.99, zBaseM);
    const pM1 = [pM0[0], pM0[1] - u * 0.62];
    ln(pM0, pM1, '#5c3a1e', u * 0.045);
    ell(pM1[0], pM1[1], u * 0.04, u * 0.04, goldHi);

    // Unfurled Velarium canvas sail stretching inward over the top seating rim
    if (m % 2 === 0) {
      const aNext = ((m + 1) / nMasts) * Math.PI * 2 + 0.18;
      const pN0 = rimPt(aNext, 0.99, isFullAttic ? zAttic : zTier3 + 0.16);
      const pN1 = [pN0[0], pN0[1] - u * 0.62];
      const pIn0 = rimPt(a, 0.84, zBaseM + 0.18);
      const pIn1 = rimPt(aNext, 0.84, zBaseM + 0.18);
      poly([
        pM1,
        pN1,
        [pIn1[0], pIn1[1] + wave],
        [pIn0[0], pIn0[1] - wave]
      ], m % 4 === 0 ? pompRed : purp, gold, u * 0.025);
    }
  }

  ctx.restore();
}

/* ===== OFFSCREEN 2X RETINA BAKER ===== */
return drawTheaterRome;
})(),
  china: (() => {
/* ===== SHARED ISOMETRIC & COLOR HELPERS ===== */
function shade(hex, amt) {
  if (!hex || hex[0] !== '#') return hex || '#888888';
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = c => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

function hexPath(c, x, y, R) {
  c.beginPath();
  [[0.866, 0.29], [0, 0.58], [-0.866, 0.29], [-0.866, -0.29], [0, -0.58], [0.866, -0.29]].forEach((v, i) => {
    const px = x + v[0] * R, py = y + v[1] * R;
    i ? c.lineTo(px, py) : c.moveTo(px, py);
  });
  c.closePath();
}

const TH = {
  ln(ctx, a, b, c, w) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  },
  ell(ctx, x, y, rx, ry, c, rot) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(0.2, rx), Math.max(0.2, ry), rot || 0, 0, Math.PI * 2);
    ctx.fill();
  },
  poly(ctx, pts, fill, stroke, lw) {
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.lineJoin = 'round'; ctx.stroke(); }
  },
  iso(x, y, u, X, Y, Z) {
    return [x + (X - Y) * 0.7 * u, y + (X + Y) * 0.35 * u - Z * u];
  },
  box(ctx, x, y, u, x0, x1, y0, y1, z0, z1, cf, ce, ct) {
    const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
    TH.poly(ctx, [I(x0, y1, z0), I(x1, y1, z0), I(x1, y1, z1), I(x0, y1, z1)], cf);
    TH.poly(ctx, [I(x1, y0, z0), I(x1, y1, z0), I(x1, y1, z1), I(x1, y0, z1)], ce);
    if (ct !== false) {
      TH.poly(ctx, [I(x0, y0, z1), I(x1, y0, z1), I(x1, y1, z1), I(x0, y1, z1)], ct);
    }
  }
};

/* ============================================================================
   CHINA THEATER FACILITY: IMPERIAL FORBIDDEN CITY PAVILION (TAIHEDIAN STYLE)
   ============================================================================ */
function drawTheaterChina(ctx, cx, cy, R, opts = {}) {
  const flip = !!opts.flip;
  const t = opts.t || 0;
  const u = R * 0.098;
  const cyB = cy + R * 0.16;

  const I = (X, Y, Z) => TH.iso(cx, cyB, u, X, Y, Z);
  const poly = (pts, fill, stroke, lw) => TH.poly(ctx, pts, fill, stroke, lw);
  const ln = (a, b, col, w) => TH.ln(ctx, a, b, col, w || u * 0.055);
  const ell = (x, y, rx, ry, fill, rot = 0) => TH.ell(ctx, x, y, rx, ry, fill, rot);
  const box = (x0, x1, y0, y1, z0, z1, cf, ce, ct) =>
    TH.box(ctx, cx, cyB, u, x0, x1, y0, y1, z0, z1, cf, ce || shade(cf, -0.26), ct !== false ? (ct || shade(cf, 0.14)) : false);

  if (opts.tile) {
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = '#5c8e43';
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, R * 0.025);
    ctx.strokeStyle = '#3f682c';
    ctx.stroke();
  }

  ctx.save();
  if (flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  // Forbidden City Imperial Palette
  const marF   = '#f5f2eb'; // White marble sunlit face
  const marR   = '#d6cfc2'; // White marble shaded right face
  const marT   = '#ffffff'; // White marble terrace top
  const marD   = '#b8b0a2';
  const vermF  = '#b83227'; // Forbidden City lacquered vermilion
  const vermD  = '#7e1e17';
  const vermL  = '#d44638';
  const goldF  = '#eab308'; // Imperial yellow-gold glazed roof tile
  const goldL  = '#facc15';
  const goldD  = '#b45309';
  const goldHi = '#fef08a';
  const jade   = '#0d9488'; // Emerald-teal dougong bracket & frieze paint
  const lapis  = '#1d4ed8'; // Imperial blue beam accent

  // 1. Ground Ambient Shadow & Terracotta-Paved Imperial Courtyard Apron
  ell(...I(0.55, 0.35, 0), u * 6.0, u * 3.0, 'rgba(14, 34, 16, 0.34)');
  poly([
    I(-4.4, 3.2, 0), I(4.4, 3.2, 0), I(4.4, 4.4, 0), I(-4.4, 4.4, 0)
  ], '#9a7b64');
  poly([
    I(3.2, -3.9, 0), I(4.4, -3.9, 0), I(4.4, 4.4, 0), I(3.2, 4.4, 0)
  ], '#826652');

  // 2. Deeper Two-Tiered White Marble Xumi Pedestal & Carved Balustrades
  // Lower Marble Terrace (z = 0.00 .. 0.46)
  box(-4.15, 4.15, -3.75, 3.25, 0.00, 0.46, marF, marR, marT);
  box(-4.20, 4.20, -3.80, 3.30, 0.36, 0.46, marT, marR, marT);

  // Upper Marble Terrace (z = 0.46 .. 0.92)
  box(-3.65, 3.65, -3.25, 2.75, 0.46, 0.92, marF, marR, marT);
  box(-3.70, 3.70, -3.30, 2.80, 0.82, 0.92, marT, marR, marT);

  // Lower terrace balustrade posts & rails
  for (let bx = -3.95; bx <= 3.95; bx += 0.65) {
    if (Math.abs(bx) < 0.95) continue;
    const pB = I(bx, 3.20, 0.46), pT = I(bx, 3.20, 0.82);
    ln(pB, pT, marT, u * 0.058);
    ell(pT[0], pT[1], u * 0.042, u * 0.042, goldL);
  }
  ln(I(-4.05, 3.20, 0.76), I(-0.95, 3.20, 0.76), marT, u * 0.044);
  ln(I( 0.95, 3.20, 0.76), I( 4.05, 3.20, 0.76), marT, u * 0.044);

  for (let by = -3.55; by <= 3.05; by += 0.66) {
    const pB = I(4.10, by, 0.46), pT = I(4.10, by, 0.82);
    ln(pB, pT, marR, u * 0.054);
    ell(pT[0], pT[1], u * 0.040, u * 0.040, goldF);
  }
  ln(I(4.10, -3.65, 0.76), I(4.10, 3.15, 0.76), marR, u * 0.042);

  // Upper terrace balustrade posts & rails
  for (let bx = -3.48; bx <= 3.48; bx += 0.62) {
    if (Math.abs(bx) < 0.92) continue;
    const pB = I(bx, 2.70, 0.92), pT = I(bx, 2.70, 1.28);
    ln(pB, pT, marT, u * 0.058);
    ell(pT[0], pT[1], u * 0.042, u * 0.042, goldL);
  }
  ln(I(-3.56, 2.70, 1.22), I(-0.92, 2.70, 1.22), marT, u * 0.044);
  ln(I( 0.92, 2.70, 1.22), I( 3.56, 2.70, 1.22), marT, u * 0.044);

  // Ceremonial Imperial Stairway & Gilded Dragon Spirit Ramp (Danbi) on Front (+Y)
  poly([I(-0.88, 4.05, 0), I(0.88, 4.05, 0), I(0.88, 2.75, 0.92), I(-0.88, 2.75, 0.92)], marT);
  poly([I(0.88, 2.75, 0), I(0.88, 4.05, 0), I(0.88, 2.75, 0.92)], marR);
  for (let s = 1; s < 9; s++) {
    const f = s / 9;
    ln(I(-0.88, 4.05 - 1.30 * f, 0.92 * f), I(0.88, 4.05 - 1.30 * f, 0.92 * f), marD, u * 0.025);
  }
  poly([I(-0.28, 4.05, 0.01), I(0.28, 4.05, 0.01), I(0.28, 2.75, 0.93), I(-0.28, 2.75, 0.93)], goldF);
  ln(I(-0.88, 4.05, 0.16), I(-0.88, 2.75, 1.08), marT, u * 0.07);
  ln(I( 0.88, 4.05, 0.16), I( 0.88, 2.75, 1.08), marT, u * 0.07);

  // Twin Gilded Bronze Ding Incense Cauldrons flanking top landing
  [-1.36, 1.36].forEach(dx => {
    const pD = I(dx, 2.48, 0.92);
    ell(pD[0], pD[1], u * 0.24, u * 0.11, goldD);
    ln(pD, [pD[0], pD[1] - u * 0.34], goldL, u * 0.24);
    ell(pD[0], pD[1] - u * 0.38, u * 0.18, u * 0.09, goldHi);
  });

  // 3. Fully Enclosed Indoor Imperial Palace Theater Hall (z = 0.92 .. 3.15)
  //    The entire porch footprint is now enclosed indoors behind vermilion walls,
  //    gilded lattice geshan screens, and grand imperial theater doors!
  const zH0 = 0.92, zH1 = 3.15;
  box(-3.20, 3.20, -2.85, 2.25, zH0, zH1, vermF, vermD, vermL);

  // White marble dado base band wrapping the enclosed exterior walls
  box(-3.22, 3.22, -2.87, 2.27, zH0, zH0 + 0.34, marF, marR, marT);

  // Grand Central Imperial Theater Double Doors on Front (+Y = 2.26)
  poly([
    I(-0.74, 2.26, zH0 + 0.34),
    I( 0.74, 2.26, zH0 + 0.34),
    I( 0.74, 2.26, zH1 - 0.38),
    I(-0.74, 2.26, zH1 - 0.38)
  ], '#450a0a', goldL, u * 0.055);
  ln(I(0, 2.27, zH0 + 0.34), I(0, 2.27, zH1 - 0.38), goldL, u * 0.05);
  // Gilded door bosses (men-ding)
  [-0.28, 0.28].forEach(dx => {
    [1.55, 1.95, 2.35].forEach(dz => {
      ell(...I(dx, 2.28, dz), u * 0.045, u * 0.045, goldHi);
    });
  });

  // Warm backlit golden-amber Geshan lattice windows along both Front (+Y) and Right (+X) indoor walls
  [-2.48, -1.42, 1.42, 2.48].forEach(wx => {
    poly([
      I(wx - 0.36, 2.26, zH0 + 0.52),
      I(wx + 0.36, 2.26, zH0 + 0.52),
      I(wx + 0.36, 2.26, zH1 - 0.44),
      I(wx - 0.36, 2.26, zH1 - 0.44)
    ], '#fef3c7', goldD, u * 0.045);
    ln(I(wx, 2.27, zH0 + 0.52), I(wx, 2.27, zH1 - 0.44), vermD, u * 0.032);
    ln(I(wx - 0.36, 2.27, (zH0 + zH1) * 0.52), I(wx + 0.36, 2.27, (zH0 + zH1) * 0.52), vermD, u * 0.032);
  });

  [-2.15, -1.10, -0.05, 1.00, 1.85].forEach(wy => {
    poly([
      I(3.21, wy - 0.32, zH0 + 0.52),
      I(3.21, wy + 0.32, zH0 + 0.52),
      I(3.21, wy + 0.32, zH1 - 0.44),
      I(3.21, wy - 0.32, zH1 - 0.44)
    ], '#fde68a', goldD, u * 0.042);
    ln(I(3.22, wy, zH0 + 0.52), I(3.22, wy, zH1 - 0.44), vermD, u * 0.030);
    ln(I(3.22, wy - 0.32, (zH0 + zH1) * 0.52), I(3.22, wy + 0.32, (zH0 + zH1) * 0.52), vermD, u * 0.030);
  });

  // Engaged Vermilion Timber Pilasters along Front & Right Walls
  [-3.18, -1.95, -0.82, 0.82, 1.95, 3.18].forEach(cxO => {
    ln(I(cxO, 2.26, zH0), I(cxO, 2.26, zH1), vermL, u * 0.14);
  });
  [-2.82, -1.62, -0.55, 0.50, 1.50, 2.22].forEach(cyO => {
    ln(I(3.21, cyO, zH0), I(3.21, cyO, zH1), vermD, u * 0.14);
  });

  // Emerald-Jade & Imperial-Blue Dougong Bracket Architrave Band
  box(-3.28, 3.28, -2.93, 2.33, zH1 - 0.32, zH1 + 0.04, jade, shade(jade, -0.26), goldF);
  ln(I(-3.28, 2.34, zH1 - 0.14), I(3.28, 2.34, zH1 - 0.14), lapis, u * 0.09);
  ln(I(3.29, -2.93, zH1 - 0.14), I(3.29, 2.33, zH1 - 0.14), shade(lapis, -0.25), u * 0.09);

  // Gold-framed Imperial Plaque centered above the main doors
  poly([I(-0.68, 2.35, zH1 - 0.42), I(0.68, 2.35, zH1 - 0.42), I(0.68, 2.35, zH1 + 0.08), I(-0.68, 2.35, zH1 + 0.08)], '#1e1b4b', goldL, u * 0.055);
  ell(...I(0, 2.36, zH1 - 0.17), u * 0.36, u * 0.11, goldHi);

  // 4. Clean, Crisp Double-Eave Imperial Yellow Glazed Tile Roof (Chongyan Wuding)
  const drawImperialYellowRoof = (x0, x1, y0, y1, zBase, rise, flare, isUpper) => {
    const xm = (x0 + x1) * 0.5, ym = (y0 + y1) * 0.5;
    const ov = 0.34;
    const eFL = I(x0 - ov, y1 + ov, zBase + flare * 0.45);
    const eFR = I(x1 + ov, y1 + ov, zBase + flare * 0.70);
    const eBR = I(x1 + ov, y0 - ov, zBase + flare * 0.45);
    const eBL = I(x0 - ov, y0 - ov, zBase + flare * 0.30);

    const inset = isUpper ? 0.92 : 0.78;
    const rL = I(x0 + inset, ym, zBase + rise);
    const rR = I(x1 - inset, ym, zBase + rise);

    // Back-left slope (clean faceted hip)
    poly([eBL, eFL, rL, rR], goldL);
    // Right hip slope (clean shaded hip)
    poly([eFR, eBR, rR], goldD);
    // Front main slope (clean sunlit imperial gold slope)
    poly([eFL, eFR, rR, rL], goldF);

    // Glazed yellow tile ribs running cleanly down the front slope
    const nRibs = isUpper ? 9 : 13;
    for (let k = 1; k < nRibs; k++) {
      const f = k / nRibs;
      const pTop = [rL[0] + (rR[0] - rL[0]) * f, rL[1] + (rR[1] - rL[1]) * f];
      const pBot = [eFL[0] + (eFR[0] - eFL[0]) * f, eFL[1] + (eFR[1] - eFL[1]) * f];
      ln(pTop, pBot, 'rgba(120, 53, 15, 0.28)', u * 0.036);
    }

    // Glazed tile ribs on right hip slope
    const nSideRibs = isUpper ? 5 : 7;
    for (let k = 1; k < nSideRibs; k++) {
      const f = k / nSideRibs;
      const pBot = [eFR[0] + (eBR[0] - eFR[0]) * f, eFR[1] + (eBR[1] - eFR[1]) * f];
      ln(rR, pBot, 'rgba(92, 40, 10, 0.30)', u * 0.032);
    }

    // Crisp Jade-Green & Gold Eave Trim + Hip Ridges
    ln(eFL, eFR, jade, u * 0.075);
    ln(eFR, eBR, shade(jade, -0.22), u * 0.075);
    ln(eFL, rL, goldHi, u * 0.048);
    ln(eFR, rR, goldHi, u * 0.052);
    ln(eBR, rR, goldF, u * 0.045);

    // Corner Zoushou guardian beasts
    [eFL, eFR, eBR].forEach(ep => {
      ell(ep[0], ep[1] - u * 0.08, u * 0.075, u * 0.10, goldHi);
    });

    if (isUpper) {
      // Heavy golden main ridge + Chiwen dragon-fish finials at both ends
      ln(rL, rR, goldHi, u * 0.13);
      [rL, rR].forEach((rp, idx) => {
        const dir = idx === 0 ? -1 : 1;
        poly([
          [rp[0] - u * 0.08, rp[1]],
          [rp[0] + u * 0.08, rp[1]],
          [rp[0] + dir * u * 0.12, rp[1] - u * 0.34],
          [rp[0] - dir * u * 0.06, rp[1] - u * 0.24]
        ], goldL);
      });
    }
    return { eFL, eFR, eBR };
  };

  // Lower Eave Skirt Roof (z = 3.12 .. 4.25)
  const lowEaves = drawImperialYellowRoof(-3.32, 3.32, -2.96, 2.36, 3.12, 1.18, 0.30, false);

  // Upper Clerestory Story & Crown Roof (z = 4.02 .. 5.95)
  box(-2.45, 2.45, -2.12, 1.68, 4.02, 4.68, vermF, vermD, jade);
  box(-2.52, 2.52, -2.18, 1.74, 4.44, 4.68, jade, shade(jade, -0.26), goldF);
  const topEaves = drawImperialYellowRoof(-2.55, 2.55, -2.20, 1.76, 4.68, 1.42, 0.34, true);

  // 5. Swaying Red Silk Palace Lanterns under Lower Eave Corners
  const lanternSwing = Math.sin(t * 2.2) * u * 0.05;
  [lowEaves.eFL, lowEaves.eFR, lowEaves.eBR].forEach((ep, idx) => {
    const lx = ep[0] + (idx === 1 ? 0 : (idx === 0 ? u * 0.12 : -u * 0.12)) + lanternSwing;
    const ly = ep[1] + u * 0.06;
    ln([ep[0], ep[1]], [lx, ly + u * 0.14], '#1c1917', u * 0.03);
    ell(lx, ly + u * 0.30, u * 0.16, u * 0.14, '#ef4444');
    ell(lx - u * 0.03, ly + u * 0.27, u * 0.06, u * 0.07, '#fef08a');
    ln([lx - u * 0.09, ly + u * 0.17], [lx + u * 0.09, ly + u * 0.17], goldL, u * 0.04);
    ln([lx - u * 0.09, ly + u * 0.43], [lx + u * 0.09, ly + u * 0.43], goldL, u * 0.04);
    ln([lx, ly + u * 0.44], [lx + lanternSwing * 0.6, ly + u * 0.62], '#dc2626', u * 0.028);
  });

  ctx.restore();
}

/* ===== OFFSCREEN 2X RETINA BAKER ===== */
return drawTheaterChina;
})(),
  greece: (() => {
/* ===== SHARED ISOMETRIC & COLOR HELPERS ===== */
function shade(hex, amt) {
  if (!hex || hex[0] !== '#') return hex || '#888888';
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = c => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

function hexPath(c, x, y, R) {
  c.beginPath();
  [[0.866, 0.29], [0, 0.58], [-0.866, 0.29], [-0.866, -0.29], [0, -0.58], [0.866, -0.29]].forEach((v, i) => {
    const px = x + v[0] * R, py = y + v[1] * R;
    i ? c.lineTo(px, py) : c.moveTo(px, py);
  });
  c.closePath();
}

const TH = {
  ln(ctx, a, b, c, w) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  },
  ell(ctx, x, y, rx, ry, c, rot) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(0.2, rx), Math.max(0.2, ry), rot || 0, 0, Math.PI * 2);
    ctx.fill();
  },
  poly(ctx, pts, fill, stroke, lw) {
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.lineJoin = 'round'; ctx.stroke(); }
  },
  iso(x, y, u, X, Y, Z) {
    return [x + (X - Y) * 0.7 * u, y + (X + Y) * 0.35 * u - Z * u];
  },
  box(ctx, x, y, u, x0, x1, y0, y1, z0, z1, cf, ce, ct) {
    const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
    TH.poly(ctx, [I(x0, y1, z0), I(x1, y1, z0), I(x1, y1, z1), I(x0, y1, z1)], cf);
    TH.poly(ctx, [I(x1, y0, z0), I(x1, y1, z0), I(x1, y1, z1), I(x1, y0, z1)], ce);
    if (ct !== false) {
      TH.poly(ctx, [I(x0, y0, z1), I(x1, y0, z1), I(x1, y1, z1), I(x0, y1, z1)], ct);
    }
  }
};

/* ============================================================================
   ANCIENT GREECE THEATER FACILITY: EPIDAURUS / SEGESTA HILLSIDE AMPHITHEATER
   ============================================================================ */
function drawTheaterGreece(ctx, cx, cy, R, opts = {}) {
  const flip = !!opts.flip;
  const t = opts.t || 0;
  const u = R * 0.104;
  const cyB = cy + R * 0.18;

  const I = (X, Y, Z) => TH.iso(cx, cyB, u, X, Y, Z);
  const poly = (pts, fill, stroke, lw) => TH.poly(ctx, pts, fill, stroke, lw);
  const ln = (a, b, col, w) => TH.ln(ctx, a, b, col, w || u * 0.055);
  const ell = (x, y, rx, ry, fill, rot = 0) => TH.ell(ctx, x, y, rx, ry, fill, rot);

  if (opts.tile) {
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = '#8aa054';
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, R * 0.025);
    ctx.strokeStyle = '#65783a';
    ctx.stroke();
  }

  ctx.save();
  if (flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  // Sunlit Pentelic Marble, Warm Limestone & Mediterranean Hillside Palette
  const marW    = '#ffffff'; // Sunlit white marble
  const marF    = '#f2ede2'; // Main warm white marble
  const marR    = '#d4ccb8'; // Shaded marble riser / right face
  const marD    = '#a69d88'; // Deep marble shadow
  const limeF   = '#e3d7be'; // Ashlar limestone wall front
  const limeR   = '#b8aa8e'; // Ashlar limestone wall shaded
  const hillTop = '#8da656'; // Sunlit olive meadow hill crest
  const hillMid = '#728c43'; // Mid-slope olive grass
  const hillShd = '#566e31'; // Shaded right hillside slope
  const rockF   = '#cfc4ae'; // Karst limestone outcrop
  const rockD   = '#9c907a';
  const terra   = '#c2593a'; // Terracotta roof tiles
  const aegean  = '#1d5fa7'; // Aegean blue trim
  const gold    = '#eab308'; // Gilded bronze trim

  // 1. Ground Ambient Shadow & Paved Forecourt
  ell(...I(0.35, 0.35, 0), u * 5.6, u * 2.8, 'rgba(26, 32, 14, 0.30)', -0.22);

  // Face the amphitheater bowl straight toward the front-bottom viewer (`rotBowl = Math.PI * 0.25` in iso = straight down-screen!)
  const ox = 0.35, oy = 0.35;
  const rotBowl = Math.PI * 0.25;
  const cosB = Math.cos(rotBowl), sinB = Math.sin(rotBowl);

  // Polar helper in the theater's local frame:
  // ang = 0 is directly up-slope (back summit); ang in [-0.56*PI .. +0.56*PI] sweeps left-to-right facing the viewer!
  const bowlPt = (ang, rad, z) => {
    const lx = -Math.cos(ang) * rad;
    const ly = -Math.sin(ang) * rad;
    const wx = ox + lx * cosB - ly * sinB;
    const wy = oy + lx * sinB + ly * cosB;
    return I(wx, wy, z);
  };

  const zBowlRim  = 3.35;
  const rInner    = 1.55;
  const rOuter    = 4.15;
  const zInner    = 0.22;
  const spanAng   = 0.56 * Math.PI; // ~202-degree horseshoe bowl

  // 2. Solid, Opaque Mediterranean Hillside Dome Rising Behind the Theater
  //    Drawn as a unified solid hill mass so there are zero transparent gaps anywhere!
  const pHillSummit = bowlPt(0, rOuter + 1.35, zBowlRim + 1.55);
  const pHillBaseL  = bowlPt(-0.76 * Math.PI, rOuter + 0.95, 0);
  const pHillBaseR  = bowlPt( 0.76 * Math.PI, rOuter + 0.95, 0);
  const pHillMidL   = bowlPt(-0.42 * Math.PI, rOuter + 1.25, zBowlRim + 0.72);
  const pHillMidR   = bowlPt( 0.42 * Math.PI, rOuter + 1.25, zBowlRim + 0.65);

  // Left sunlit hillside flank
  ctx.beginPath();
  ctx.moveTo(pHillBaseL[0], pHillBaseL[1]);
  ctx.quadraticCurveTo(pHillMidL[0], pHillMidL[1], pHillSummit[0], pHillSummit[1]);
  ctx.lineTo(bowlPt(0, rInner, 0)[0], bowlPt(0, rInner, 0)[1]);
  ctx.closePath();
  ctx.fillStyle = hillTop;
  ctx.fill();

  // Right shaded hillside flank
  ctx.beginPath();
  ctx.moveTo(pHillBaseR[0], pHillBaseR[1]);
  ctx.quadraticCurveTo(pHillMidR[0], pHillMidR[1], pHillSummit[0], pHillSummit[1]);
  ctx.lineTo(bowlPt(0, rInner, 0)[0], bowlPt(0, rInner, 0)[1]);
  ctx.closePath();
  ctx.fillStyle = hillShd;
  ctx.fill();

  // Central hill crest cap & karst limestone ledges
  ctx.beginPath();
  ctx.moveTo(pHillMidL[0], pHillMidL[1]);
  ctx.quadraticCurveTo(pHillSummit[0], pHillSummit[1] - u * 0.25, pHillMidR[0], pHillMidR[1]);
  ctx.lineTo(bowlPt(0, rOuter * 0.6, zBowlRim)[0], bowlPt(0, rOuter * 0.6, zBowlRim)[1]);
  ctx.closePath();
  ctx.fillStyle = hillMid;
  ctx.fill();

  // Exposed karst limestone rock crags along the outer hillside shoulders
  [
    [-0.64 * Math.PI, rOuter + 0.45, 1.85, rockF],
    [ 0.64 * Math.PI, rOuter + 0.45, 1.75, rockD]
  ].forEach(([ang, rad, zTop, col]) => {
    poly([
      bowlPt(ang - 0.12, rad + 0.35, 0),
      bowlPt(ang + 0.12, rad + 0.35, 0),
      bowlPt(ang + 0.08, rad - 0.05, zTop),
      bowlPt(ang - 0.08, rad - 0.05, zTop * 0.92)
    ], col);
  });

  // 3. Upper Arched Colonnade Gallery & Parapet Crown (Matching your reference photo!)
  const N_ARC = 28;
  for (let s = 0; s < N_ARC; s++) {
    const a0 = -spanAng + (s / N_ARC) * (spanAng * 2);
    const a1 = -spanAng + ((s + 1) / N_ARC) * (spanAng * 2);
    const am = (a0 + a1) * 0.5;
    const isFrontLight = am < 0.15;
    const wallCol = isFrontLight ? limeF : limeR;

    // Back arcade wall & top cornice
    const pB0 = bowlPt(a0, rOuter, zBowlRim), pB1 = bowlPt(a1, rOuter, zBowlRim);
    const pT0 = bowlPt(a0, rOuter + 0.18, zBowlRim + 0.62), pT1 = bowlPt(a1, rOuter + 0.18, zBowlRim + 0.62);
    poly([pB0, pB1, pT1, pT0], wallCol, marD, u * 0.022);
    ln(pT0, pT1, marW, u * 0.045);

    // Dark arched gallery niche in each upper bay
    const aN0 = a0 + (a1 - a0) * 0.24;
    const aN1 = a1 - (a1 - a0) * 0.24;
    poly([
      bowlPt(aN0, rOuter + 0.02, zBowlRim + 0.06),
      bowlPt(aN1, rOuter + 0.02, zBowlRim + 0.06),
      bowlPt(aN1, rOuter + 0.12, zBowlRim + 0.42),
      bowlPt(aN0, rOuter + 0.12, zBowlRim + 0.42)
    ], '#29241c');
  }

  // 4. Solid, Opaque Concentric Marble Koilon Seating Tiers (Drawn Top-to-Bottom)
  const nTiers = 11;
  for (let tier = nTiers - 1; tier >= 0; tier--) {
    const f0 = tier / nTiers;
    const f1 = (tier + 1) / nTiers;
    const isDiazoma = (tier === 5); // Wide mid-bowl horizontal walkway

    const r0 = rInner + (rOuter - rInner) * f0;
    const r1 = rInner + (rOuter - rInner) * f1;
    const z0 = zInner + (zBowlRim - zInner) * f0;
    const z1 = isDiazoma ? z0 + 0.07 : zInner + (zBowlRim - zInner) * f1;

    for (let s = 0; s < N_ARC; s++) {
      const a0 = -spanAng + (s / N_ARC) * (spanAng * 2);
      const a1 = -spanAng + ((s + 1) / N_ARC) * (spanAng * 2);
      const am = (a0 + a1) * 0.5;

      const pIn0    = bowlPt(a0, r0, z0), pIn1    = bowlPt(a1, r0, z0);
      const pRiser0 = bowlPt(a0, r0, z1), pRiser1 = bowlPt(a1, r0, z1);
      const pOut0   = bowlPt(a0, r1, z1), pOut1   = bowlPt(a1, r1, z1);

      // Directional marble shading across the amphitheater bowl
      const benchCol = isDiazoma
        ? limeF
        : (am < -0.25 ? marW : (am < 0.35 ? marF : marR));
      const riserCol = isDiazoma
        ? aegean
        : (am < 0.10 ? marR : marD);

      // Solid vertical step riser + solid horizontal marble bench seat
      poly([pIn0, pIn1, pRiser1, pRiser0], riserCol);
      poly([pRiser0, pRiser1, pOut1, pOut0], benchCol);
    }
  }

  // Radial Klimakes Staircase Aisles dividing the seating into 7 wedges (kerkides)
  const nAisles = 6;
  for (let k = 1; k < nAisles; k++) {
    const aStair = -spanAng + (k / nAisles) * (spanAng * 2);
    ln(bowlPt(aStair, rInner, zInner + 0.02), bowlPt(aStair, rOuter, zBowlRim + 0.02), 'rgba(72, 64, 50, 0.55)', u * 0.055);
  }

  // 5. Tall Ashlar Stone Analemma Retaining Wing Walls Flanking Both Sides (Like your reference photo!)
  [-1, 1].forEach(sideSign => {
    const aEnd = sideSign * spanAng;
    const pInB  = bowlPt(aEnd, rInner, 0);
    const pOutB = bowlPt(aEnd, rOuter + 0.18, 0);
    const pOutT = bowlPt(aEnd, rOuter + 0.18, zBowlRim + 0.62);
    const pInT  = bowlPt(aEnd, rInner, zInner + 0.65);

    // Solid outer ashlar stone retaining wall face
    poly([pInB, pOutB, pOutT, pInT], sideSign < 0 ? limeF : limeR, marD, u * 0.032);
    ln(pInT, pOutT, marW, u * 0.055);

    // Horizontal ashlar stone block courses & vertical joints
    [0.25, 0.50, 0.75].forEach(hf => {
      ln(
        [pInB[0] + (pInT[0] - pInB[0]) * hf, pInB[1] + (pInT[1] - pInB[1]) * hf],
        [pOutB[0] + (pOutT[0] - pOutB[0]) * hf, pOutB[1] + (pOutT[1] - pOutB[1]) * hf],
        'rgba(82, 72, 54, 0.34)', u * 0.024
      );
    });

    // Square corner bastion buttress at the outer wing tip
    const pButt0 = bowlPt(aEnd + sideSign * 0.07, rOuter + 0.22, 0);
    const pButt1 = bowlPt(aEnd + sideSign * 0.07, rOuter + 0.22, zBowlRim + 0.62);
    poly([pOutB, pButt0, pButt1, pOutT], sideSign < 0 ? limeR : marD, marD, u * 0.028);
  });

  // 6. Circular Pentelic Marble Orchestra Floor & Central Bronze Thymele Altar
  const pOrch = I(ox, oy, 0.06);
  ell(pOrch[0], pOrch[1] + u * 0.08, u * 2.15, u * 1.08, marD);
  ell(pOrch[0], pOrch[1], u * 2.12, u * 1.06, marF, 0, aegean, u * 0.05);
  ell(pOrch[0], pOrch[1], u * 1.52, u * 0.76, marW, 0, gold, u * 0.032);

  // Radial marble paving joints on the Orchestra floor
  for (let p = 0; p < 8; p++) {
    const a = (p / 8) * Math.PI * 2 + 0.2;
    ln(pOrch, [pOrch[0] + Math.cos(a) * u * 2.05, pOrch[1] + Math.sin(a) * u * 1.02], 'rgba(148, 138, 118, 0.35)', u * 0.025);
  }

  // Central Bronze Thymele Altar & Animated Greek Chorus Performers
  ell(pOrch[0], pOrch[1], u * 0.24, u * 0.12, gold);
  ln(pOrch, [pOrch[0], pOrch[1] - u * 0.22], '#b45309', u * 0.18);
  ell(pOrch[0], pOrch[1] - u * 0.24, u * 0.14, u * 0.07, '#fef08a');

  const stepDance = Math.sin(t * 2.4) * u * 0.05;
  [
    [-0.55, -0.06, '#ffffff', gold],
    [ 0.52, -0.06, aegean, '#ffffff'],
    [ 0.02,  0.22, terra, gold]
  ].forEach(([dx, dy, robeCol, trimCol], idx) => {
    const px = pOrch[0] + dx * u;
    const py = pOrch[1] + dy * u + (idx === 1 ? -stepDance : stepDance);
    ell(px, py + u * 0.04, u * 0.12, u * 0.06, 'rgba(30, 24, 16, 0.28)');
    poly([[px - u * 0.10, py], [px + u * 0.10, py], [px + u * 0.07, py - u * 0.32], [px - u * 0.07, py - u * 0.32]], robeCol, trimCol, u * 0.025);
    ell(px, py - u * 0.38, u * 0.065, u * 0.075, '#fde4c8');
  });

  // 7. Low Classical Doric Marble Skene Stage House (Front-Right Edge, matching your reference photo!)
  const skPt = (along, depth, z) => {
    const lx = 1.92 + depth;
    const ly = 0.78 + along;
    const wx = ox + lx * cosB - ly * sinB;
    const wy = oy + lx * sinB + ly * cosB;
    return I(wx, wy, z);
  };

  const skHalfW = 1.18;
  const zSk0 = 0.06, zSk1 = 0.96, zSkRoof = 1.28;
  // Marble proskenion platform
  poly([
    skPt(-skHalfW, -0.38, zSk0), skPt(skHalfW, -0.38, zSk0),
    skPt(skHalfW,  0.38, zSk0), skPt(-skHalfW,  0.38, zSk0)
  ], marW, marD, u * 0.028);
  poly([
    skPt(-skHalfW,  0.38, 0), skPt(skHalfW,  0.38, 0),
    skPt(skHalfW,  0.38, zSk0 + 0.12), skPt(-skHalfW,  0.38, zSk0 + 0.12)
  ], marR);

  // Back wall & 4 Doric columns of the Skene
  poly([
    skPt(-skHalfW + 0.10, 0.26, zSk0 + 0.12), skPt(skHalfW - 0.10, 0.26, zSk0 + 0.12),
    skPt(skHalfW - 0.10, 0.26, zSk1), skPt(-skHalfW + 0.10, 0.26, zSk1)
  ], limeR);
  [-0.98, -0.34, 0.34, 0.98].forEach(along => {
    ln(skPt(along, -0.18, zSk0 + 0.12), skPt(along, -0.18, zSk1), marW, u * 0.10);
  });

  // Terracotta tiled Skene roof & triangular pediment
  const sFL = skPt(-skHalfW - 0.08, -0.28, zSk1), sFR = skPt(skHalfW + 0.08, -0.28, zSk1);
  const sBR = skPt(skHalfW + 0.08,  0.38, zSk1), sBL = skPt(-skHalfW - 0.08,  0.38, zSk1);
  const sRidgeL = skPt(-skHalfW - 0.08, 0.05, zSkRoof), sRidgeR = skPt(skHalfW + 0.08, 0.05, zSkRoof);

  poly([sFL, sFR, sRidgeR, sRidgeL], terra);
  poly([sFR, sBR, sRidgeR], marF, marD, u * 0.028);
  poly([sFL, sBL, sRidgeL], marR, marD, u * 0.028);
  ln(sRidgeL, sRidgeR, gold, u * 0.045);

  // 8. Mediterranean Olive Tree & Cypresses Framing the Hillside (Matching your reference photo!)
  const drawOliveCluster = (px, py, sc = 1) => {
    ell(px + u * 0.14 * sc, py + u * 0.06 * sc, u * 0.92 * sc, u * 0.34 * sc, 'rgba(26, 32, 14, 0.28)');
    ln([px, py], [px, py - u * 0.95 * sc], '#5c4b3b', u * 0.22 * sc);
    ell(px, py - u * 1.25 * sc, u * 1.05 * sc, u * 0.62 * sc, '#6c8748');
    ell(px - u * 0.28 * sc, py - u * 1.42 * sc, u * 0.76 * sc, u * 0.46 * sc, '#8ca868');
    ell(px + u * 0.24 * sc, py - u * 1.35 * sc, u * 0.65 * sc, u * 0.38 * sc, '#9eb878');
  };

  const drawCypress = (px, py, sc = 1) => {
    const h = u * 2.15 * sc;
    ell(px + u * 0.10 * sc, py + u * 0.04 * sc, u * 0.36 * sc, u * 0.14 * sc, 'rgba(26, 32, 14, 0.26)');
    ln([px, py], [px, py - h * 0.22], '#4a3728', u * 0.12 * sc);
    poly([
      [px - u * 0.26 * sc, py - h * 0.18],
      [px, py - h],
      [px + u * 0.26 * sc, py - h * 0.18]
    ], '#2d5232');
    poly([
      [px, py - h],
      [px + u * 0.26 * sc, py - h * 0.18],
      [px + u * 0.06 * sc, py - h * 0.16]
    ], '#1f3b23');
  };

  // Upper hillside ridge cypresses & olive trees
  const pRidgeL = bowlPt(-0.28 * Math.PI, rOuter + 0.55, zBowlRim + 0.72);
  const pRidgeR = bowlPt( 0.25 * Math.PI, rOuter + 0.55, zBowlRim + 0.72);
  drawCypress(pRidgeL[0], pRidgeL[1], 0.95);
  drawCypress(pRidgeL[0] + u * 0.36, pRidgeL[1] - u * 0.08, 0.82);
  drawOliveCluster(pRidgeR[0], pRidgeR[1], 0.78);

  // Foreground-left olive tree nestled beside the left analemma wall (just like in your photo!)
  const pLeftWingTree = bowlPt(-0.62 * Math.PI, rOuter * 0.85, 0.12);
  drawOliveCluster(pLeftWingTree[0], pLeftWingTree[1], 0.96);

  ctx.restore();
}

/* ===== OFFSCREEN 2X RETINA BAKER ===== */
return drawTheaterGreece;
})(),
  galactic: (() => {
/* ===== SHARED ISOMETRIC & COLOR HELPERS ===== */
function shade(hex, amt) {
  if (!hex || hex[0] !== '#') return hex || '#888888';
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = c => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

function hexPath(c, x, y, R) {
  c.beginPath();
  [[0.866, 0.29], [0, 0.58], [-0.866, 0.29], [-0.866, -0.29], [0, -0.58], [0.866, -0.29]].forEach((v, i) => {
    const px = x + v[0] * R, py = y + v[1] * R;
    i ? c.lineTo(px, py) : c.moveTo(px, py);
  });
  c.closePath();
}

const TH = {
  ln(ctx, a, b, c, w) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  },
  ell(ctx, x, y, rx, ry, c, rot) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(0.2, rx), Math.max(0.2, ry), rot || 0, 0, Math.PI * 2);
    ctx.fill();
  },
  poly(ctx, pts, fill, stroke, lw) {
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.lineJoin = 'round'; ctx.stroke(); }
  },
  iso(x, y, u, X, Y, Z) {
    return [x + (X - Y) * 0.7 * u, y + (X + Y) * 0.35 * u - Z * u];
  },
  box(ctx, x, y, u, x0, x1, y0, y1, z0, z1, cf, ce, ct) {
    const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
    TH.poly(ctx, [I(x0, y1, z0), I(x1, y1, z0), I(x1, y1, z1), I(x0, y1, z1)], cf);
    TH.poly(ctx, [I(x1, y0, z0), I(x1, y1, z0), I(x1, y1, z1), I(x1, y0, z1)], ce);
    if (ct !== false) {
      TH.poly(ctx, [I(x0, y0, z1), I(x1, y0, z1), I(x1, y1, z1), I(x0, y1, z1)], ct);
    }
  }
};

/* ============================================================================
   GALACTIC OUTPOST THEATER: DUNE SEA PALACE & CANTINA HOLO-STAGE (JABBA STYLE)
   ============================================================================ */
function drawTheaterGalactic(ctx, cx, cy, R, opts = {}) {
  const flip = !!opts.flip;
  const t = opts.t || 0;
  const u = R * 0.104;
  const cyB = cy + R * 0.17;

  const I = (X, Y, Z) => TH.iso(cx, cyB, u, X, Y, Z);
  const poly = (pts, fill, stroke, lw) => TH.poly(ctx, pts, fill, stroke, lw);
  const ln = (a, b, col, w) => TH.ln(ctx, a, b, col, w || u * 0.055);
  const ell = (x, y, rx, ry, fill, rot = 0) => TH.ell(ctx, x, y, rx, ry, fill, rot);
  const box = (x0, x1, y0, y1, z0, z1, cf, ce, ct) =>
    TH.box(ctx, cx, cyB, u, x0, x1, y0, y1, z0, z1, cf, ce || shade(cf, -0.26), ct !== false ? (ct || shade(cf, 0.14)) : false);

  if (opts.tile) {
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = '#cda372';
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, R * 0.025);
    ctx.strokeStyle = '#9c7448';
    ctx.stroke();
  }

  ctx.save();
  if (flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  // Dune Sea Sandstone, Weathered Plaster & Copper-Patina Palette
  const sandL   = '#ead4b7'; // Sunlit desert plaster
  const sandF   = '#d6b48c'; // Warm adobe-sandstone main
  const sandR   = '#a8845c'; // Shaded right wall
  const sandD   = '#7c5d3c'; // Deep sandstone shadow
  const rockF   = '#9c623e'; // Dune Sea red-ochre crag
  const rockR   = '#6e4228';
  const domeL   = '#5a9486'; // Patinated verdigris-copper highlight
  const domeF   = '#3b6e62'; // Patinated copper-patina dome
  const domeD   = '#23453d';
  const steel   = '#334155'; // Rusted durasteel door & trim
  const steelD  = '#1e293b';
  const terra   = '#b85a3a'; // Terracotta canopy & accents
  const cyan    = '#38bdf8'; // Hologram & diagnostic glow
  const amber   = '#f59e0b'; // Torch & beacon glow

  // Helper: Draw a 3D Cylindrical Dune Sea Drum with Weathering Seams
  const drawPalaceDrum = (X, Y, rad, z0, z1, colMain, colDark, seams = 2) => {
    const pB = I(X, Y, z0), pT = I(X, Y, z1);
    const rx = 0.99 * rad * u, ry = 0.495 * rad * u;
    const gr = ctx.createLinearGradient(pB[0] - rx, 0, pB[0] + rx, 0);
    gr.addColorStop(0.00, shade(colMain, 0.20));
    gr.addColorStop(0.45, colMain);
    gr.addColorStop(0.85, colDark || shade(colMain, -0.28));
    gr.addColorStop(1.00, shade(colMain, -0.42));

    ctx.beginPath();
    ctx.moveTo(pB[0] - rx, pB[1]);
    ctx.lineTo(pT[0] - rx, pT[1]);
    ctx.ellipse(pT[0], pT[1], rx, ry, 0, Math.PI, 0, false);
    ctx.lineTo(pB[0] + rx, pB[1]);
    ctx.ellipse(pB[0], pB[1], rx, ry, 0, 0, Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = gr;
    ctx.fill();

    // Horizontal plaster bands
    ctx.strokeStyle = 'rgba(54, 34, 18, 0.30)';
    ctx.lineWidth = u * 0.038;
    for (let s = 1; s <= seams; s++) {
      const f = s / (seams + 1);
      const sy = pB[1] + (pT[1] - pB[1]) * f;
      ctx.beginPath();
      ctx.ellipse(pB[0], sy, rx * 0.99, ry * 0.96, 0, 0.08, Math.PI - 0.08);
      ctx.stroke();
    }
    return { pB, pT, rx, ry };
  };

  // Helper: Draw Hemispherical Copper-Patina Dome with Collar Ring & Finial
  const drawHemisphereDome = (X, Y, rad, z0, hDome, colL, colM, colD) => {
    const pB = I(X, Y, z0);
    const rx = 0.99 * rad * u, ry = 0.495 * rad * u;

    // Overhanging stone collar cornice
    ell(pB[0], pB[1] + u * 0.03, rx * 1.07, ry * 1.07, sandD);
    ell(pB[0], pB[1], rx * 1.05, ry * 1.05, sandL);

    const gr = ctx.createLinearGradient(pB[0] - rx, pB[1] - hDome * u, pB[0] + rx, pB[1]);
    gr.addColorStop(0.00, colL);
    gr.addColorStop(0.50, colM);
    gr.addColorStop(1.00, colD);

    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.ellipse(pB[0], pB[1] - u * 0.02, rx, hDome * u, 0, Math.PI, 0, false);
    ctx.ellipse(pB[0], pB[1] - u * 0.02, rx, ry * 0.94, 0, 0, Math.PI, false);
    ctx.closePath();
    ctx.fill();

    // Meridional copper plate seams
    [-0.45, 0, 0.45].forEach(f => {
      ctx.strokeStyle = 'rgba(18, 38, 34, 0.30)';
      ctx.lineWidth = u * 0.028;
      ctx.beginPath();
      ctx.ellipse(pB[0], pB[1] - u * 0.02, rx * Math.abs(f || 0.03), hDome * u, 0, Math.PI, 0);
      ctx.stroke();
    });

    // Summit finial spire
    const pTop = [pB[0], pB[1] - hDome * u];
    ell(pTop[0], pTop[1], u * 0.24, u * 0.11, sandD);
    ln(pTop, [pTop[0], pTop[1] - u * 0.65], '#cbd5e1', u * 0.065);
    ell(pTop[0], pTop[1] - u * 0.68, u * 0.09, u * 0.09, amber);
  };

  // 1. Clean Tight Ground Ambient Shadow Directly Under the Palace Footprint
  ell(...I(0.05, -0.25, 0), u * 3.35, u * 1.72, 'rgba(28, 16, 8, 0.30)');
  ell(...I(-2.35, -0.85, 0), u * 1.25, u * 0.65, 'rgba(28, 16, 8, 0.26)');
  ell(...I(2.05, -1.35, 0), u * 1.65, u * 0.85, 'rgba(28, 16, 8, 0.26)');

  // 2. Tall Slender Cylindrical Watchtower Turret (Left-Rear, Jabba's Palace Iconic Silhouette!)
  const towX = -2.35, towY = -0.85;
  drawPalaceDrum(towX, towY, 1.02, 0.00, 5.15, sandF, sandR, 4);
  // Slit observation windows & rusted intake vents on tower
  [1.95, 3.25, 4.35].forEach(zw => {
    const pw = I(towX + 0.38, towY + 0.58, zw);
    ell(pw[0], pw[1], u * 0.14, u * 0.08, steelD);
    ell(pw[0], pw[1], u * 0.07, u * 0.04, amber);
  });
  drawHemisphereDome(towX, towY, 1.08, 5.15, 0.98, domeL, domeF, domeD);

  // 3. Secondary Rear Bastion Drum (Right-Rear)
  drawPalaceDrum(2.05, -1.35, 1.42, 0.00, 2.95, sandR, sandD, 2);
  drawHemisphereDome(2.05, -1.35, 1.46, 2.95, 1.08, domeF, domeD, '#152b26');

  // 4. Grand Central Rotunda Citadel & Massive Copper-Patina Dome
  const mainX = 0.05, mainY = -0.25;
  drawPalaceDrum(mainX, mainY, 2.95, 0.00, 2.75, sandL, sandR, 3);

  // Clean recessed base plinth molding wrapping the bottom of the rotunda
  const pRotBase = I(mainX, mainY, 0.00);
  ctx.strokeStyle = 'rgba(72, 48, 28, 0.55)';
  ctx.lineWidth = u * 0.14;
  ctx.beginPath();
  ctx.ellipse(pRotBase[0], pRotBase[1], 0.99 * 2.97 * u, 0.495 * 2.97 * u, 0, 0.02, Math.PI - 0.02);
  ctx.stroke();

  // Massive Hemispherical Copper-Patina Main Dome
  drawHemisphereDome(mainX, mainY, 3.02, 2.75, 2.38, domeL, domeF, domeD);

  // 5. Monumental Recessed Durasteel Blast Door & Security Eye-Stalk Gatehouse (Centered Front)
  const dX = -0.25, dY = 2.45;
  poly([
    I(dX - 1.15, dY + 0.15, 0.00), I(dX + 1.05, dY + 0.45, 0.00),
    I(dX + 0.96, dY + 0.35, 2.45), I(dX - 1.06, dY + 0.08, 2.45)
  ], sandL, sandD, u * 0.035);

  // Heavy recessed iron blast gate with horizontal rib plates
  poly([
    I(dX - 0.70, dY + 0.22, 0.00), I(dX + 0.60, dY + 0.40, 0.00),
    I(dX + 0.56, dY + 0.36, 1.85), I(dX - 0.66, dY + 0.18, 1.85)
  ], steel, steelD, u * 0.04);
  [0.46, 0.92, 1.38].forEach(zb => {
    ln(I(dX - 0.66, dY + 0.19, zb), I(dX + 0.56, dY + 0.37, zb), steelD, u * 0.045);
  });
  // Glowing red-amber droid security scanner eye above gate
  const pEye = I(dX - 0.05, dY + 0.28, 2.08);
  ell(pEye[0], pEye[1], u * 0.15, u * 0.11, steelD);
  ell(pEye[0], pEye[1], u * 0.075, u * 0.055, '#ef4444');

  // Subtle entrance threshold slab & twin desert torch bollards flanking the blast gate
  poly([
    I(dX - 1.35, dY + 0.35, 0.00), I(dX + 1.25, dY + 0.65, 0.00),
    I(dX + 1.55, dY + 1.25, 0.00), I(dX - 1.05, dY + 0.95, 0.00)
  ], sandR);

  const flicker = Math.sin(t * 6.0) * u * 0.02;
  [[-1.55, 2.65], [1.15, 2.95]].forEach(([bx, by]) => {
    const pB = I(bx, by, 0.00), pT = [pB[0], pB[1] - u * 0.62];
    ln(pB, pT, steel, u * 0.15);
    ell(pT[0], pT[1] - u * 0.06, u * 0.18 + flicker, u * 0.18 + flicker, 'rgba(245, 158, 11, 0.38)');
    ell(pT[0], pT[1] - u * 0.06, u * 0.085, u * 0.085, amber);
  });

  ctx.restore();
}

/* ===== OFFSCREEN 2X RETINA BAKER ===== */
return drawTheaterGalactic;
})()
});
