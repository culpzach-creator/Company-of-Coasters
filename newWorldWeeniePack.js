/* Imported landmark artwork. */
const NEW_WORLD_WEENIES = (() => {
/* ===== CORE HELPERS ===== */
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

function hexPath(c, x, y, R) {
  c.beginPath();
  [[0.866, 0.29], [0, 0.58], [-0.866, 0.29], [-0.866, -0.29], [0, -0.58], [0.866, -0.29]].forEach((v, i) => {
    const px = x + v[0] * R, py = y + v[1] * R;
    i ? c.lineTo(px, py) : c.moveTo(px, py);
  });
  c.closePath();
}

/* ===== CATALOG METADATA ===== */
const WEENIE_V3_CATALOG = {
  china: {
    id: 'china',
    fnName: 'drawWeenieChinaTempleOfHeaven',
    themeLabel: 'CHINA WEENIE',
    title: 'Temple of Heaven (Qiniandian)',
    sub: 'Three-Tiered White Marble Altar, Vermilion Colonnade & Triple Imperial Blue Roofs',
    tileCol: '#5c8e43',
    tileRim: '#3f682c',
    desc: 'Iconic circular Hall of Prayer for Good Harvests (Qiniandian) in Beijing: a three-tiered white marble circular altar platform with carved balustrades and central ceremonial staircase, supporting a round vermilion-lacquered timber colonnade hall and three cascading imperial cobalt-blue glazed tile roofs with upturned eaves and a gleaming gilded spire finial.'
  },
  japan: {
    id: 'japan',
    fnName: 'drawWeenieJapanHimejiCastle',
    themeLabel: 'JAPAN WEENIE',
    title: 'Himeji Castle (White Heron Keep)',
    sub: 'Sloped Ishigaki Stone Ramparts, Multi-Tiered White Tenshu & Shachihoko Roofs',
    tileCol: '#547e42',
    tileRim: '#395a2b',
    desc: 'Japan’s "White Heron Castle" (Shirasagi-jō): rising from massive curved ishigaki dry-stone rampart walls, the soaring multi-tiered white shikkui-plaster main tenshu keep and flanking side turrets feature cascading charcoal-grey kawara tile roofs, triangular white chidori-hafu gables, golden shachihoko roof-ridge finials, and blooming pink sakura cherry trees.'
  },
  jurassic: {
    id: 'jurassic',
    fnName: 'drawWeenieJurassicVisitorCenter',
    themeLabel: 'JURASSIC ISLAND WEENIE',
    title: 'Prehistoric Expedition Visitor Center',
    sub: 'Battered Stone Walls, Twin Terraced Steps, Carved Portal & Red Conical Rotunda Roofs',
    tileCol: '#3d6838',
    tileRim: '#274724',
    desc: 'Inspired by classic island expedition architecture with a distinctive crimson-red shingle roof: battered grey-limestone curved wings, twin terraced entrance staircases flanked by lush tropical planters, a monumental stone portal with a spoked wooden door, tall gallery windows, two flanking turret rotundas, and a soaring two-tiered red conical rotunda roof.'
  },
  rome: {
    id: 'rome',
    fnName: 'drawWeenieRomeTempleOfApollo',
    themeLabel: 'ANCIENT ROME WEENIE',
    title: 'Temple of Apollo (Palatine)',
    sub: 'High Travertine Podium, Corinthian Portico, Clean Pediment & Terracotta Roof',
    tileCol: '#768646',
    tileRim: '#55632c',
    desc: 'Augustan-era marble sanctuary on the Palatine Hill: elevated on a tall Roman travertine podium with a grand frontal staircase and bronze altars, six fluted Corinthian marble columns support an inscribed architrave, a sculpted triangular pediment, and warm terracotta tegula roof tiles.'
  },
  greece: {
    id: 'greece',
    fnName: 'drawWeenieGreeceParthenon',
    themeLabel: 'ANCIENT GREECE WEENIE',
    title: 'The Parthenon on the Acropolis Hill',
    sub: 'Natural Sacred Rock Karst Cliff, Ashlar Circuit Wall & Pentelic Marble Parthenon',
    tileCol: '#8aa054',
    tileRim: '#65783a',
    desc: 'Modeled after the real Sacred Rock of Athens: an irregular, deeply fissured pale grey-buff and warm tan karst limestone crag with tilted geological strata, capped by the classical ashlar stone fortification circuit wall with square stone buttresses, Propylaea ramp, Mediterranean olive and cypress trees, and the Pentelic white marble Parthenon.'
  },
  galactic: {
    id: 'galactic',
    fnName: 'drawWeenieGalacticSpaceport',
    themeLabel: 'GALACTIC OUTPOST WEENIE',
    title: 'Curved Outer-Rim Spaceport & Starfighter',
    sub: 'Curved Batuu Sandstone Docking Bay, Control Tower, Gantry & Twin-Boom Starfighter',
    tileCol: '#cda372',
    tileRim: '#9c7448',
    desc: 'An open-air curved Outer-Rim spaceport bay framed by battered Batuu sandstone & duracrete blast walls, arched docking alcoves, a saucer-domed flight control tower, and an articulated loading gantry—housing a sleek, original twin-boom / forward-swept starfighter (distinct from the Millennium Falcon) resting on an illuminated landing pad.'
  }
};

/* ===== SHARED ISOMETRIC CONTEXT BUILDER ===== */
function makeWeenieContext(ctx, cx, cy, R, opts) {
  const flip = !!opts.flip;
  const u = R * 0.088;
  const cyB = cy + (opts.oy != null ? opts.oy : R * 0.14);

  const I = (X, Y, Z) => TH.iso(cx, cyB, u, X, Y, Z);
  const poly = (pts, fill, stroke, lw) => TH.poly(ctx, pts, fill, stroke, lw);
  const ln = (a, b, col, w) => TH.ln(ctx, a, b, col, w || u * 0.055);
  const ell = (x, y, rx, ry, fill, rot = 0, stroke, lw) => {
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(0.2, rx), Math.max(0.2, ry), rot, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || u * 0.045; ctx.stroke(); }
  };
  const clipPoly = (pts, fn) => {
    ctx.save();
    ctx.beginPath();
    pts.forEach((p, idx) => (idx ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    ctx.clip();
    fn();
    ctx.restore();
  };
  const box = (x0, x1, y0, y1, z0, z1, cf, ce, ct, stroke, lw) => {
    TH.box(ctx, cx, cyB, u, x0, x1, y0, y1, z0, z1, cf, ce || shade(cf, -0.26), ct !== false ? (ct || shade(cf, 0.14)) : false);
    if (stroke) {
      poly([I(x0, y1, z0), I(x1, y1, z0), I(x1, y1, z1), I(x0, y1, z1)], null, stroke, lw);
      poly([I(x1, y0, z0), I(x1, y1, z0), I(x1, y1, z1), I(x1, y0, z1)], null, stroke, lw);
    }
  };
  const cylZ = (X, Y, rad, z0, z1, colMain, colTop) => {
    const pB = I(X, Y, z0), pT = I(X, Y, z1);
    const rx = 0.99 * rad * u, ry = 0.495 * rad * u;
    const gr = ctx.createLinearGradient(pB[0] - rx, 0, pB[0] + rx, 0);
    gr.addColorStop(0.00, shade(colMain, 0.22));
    gr.addColorStop(0.45, colMain);
    gr.addColorStop(1.00, shade(colMain, -0.34));
    ctx.beginPath();
    ctx.moveTo(pB[0] - rx, pB[1]);
    ctx.lineTo(pT[0] - rx, pT[1]);
    ctx.lineTo(pT[0] + rx, pT[1]);
    ctx.lineTo(pB[0] + rx, pB[1]);
    ctx.ellipse(pB[0], pB[1], rx, ry, 0, 0, Math.PI);
    ctx.closePath();
    ctx.fillStyle = gr;
    ctx.fill();
    if (colTop !== false) {
      ell(pT[0], pT[1], rx, ry, colTop || shade(colMain, 0.18));
    }
    return { pB, pT, rx, ry };
  };
  const coneZ = (X, Y, rad, z0, z1, colMain, flare = 0) => {
    const pB = I(X, Y, z0), pT = I(X, Y, z1);
    const rx = 0.99 * rad * u, ry = 0.495 * rad * u;
    const gr = ctx.createLinearGradient(pB[0] - rx, 0, pB[0] + rx, 0);
    gr.addColorStop(0.00, shade(colMain, 0.24));
    gr.addColorStop(0.45, colMain);
    gr.addColorStop(1.00, shade(colMain, -0.36));
    ctx.beginPath();
    ctx.moveTo(pB[0] - rx, pB[1]);
    if (flare > 0) {
      ctx.quadraticCurveTo(pB[0] - rx * 0.56, pB[1] - (pB[1] - pT[1]) * 0.45 - flare * u, pT[0], pT[1]);
      ctx.quadraticCurveTo(pB[0] + rx * 0.56, pB[1] - (pB[1] - pT[1]) * 0.45 - flare * u, pB[0] + rx, pB[1]);
    } else {
      ctx.lineTo(pT[0], pT[1]);
      ctx.lineTo(pB[0] + rx, pB[1]);
    }
    ctx.ellipse(pB[0], pB[1], rx, ry, 0, 0, Math.PI);
    ctx.closePath();
    ctx.fillStyle = gr;
    ctx.fill();
    return { pB, pT, rx, ry };
  };

  return { flip, u, cyB, I, poly, ln, ell, clipPoly, box, cylZ, coneZ };
}

/* ============================================================================
   1. CHINA WEENIE: TEMPLE OF HEAVEN (QINIANDIAN — HALL OF PRAYER FOR GOOD HARVESTS)
   ============================================================================ */
function drawWeenieChinaTempleOfHeaven(ctx, cx, cy, R, opts = {}) {
  const g = makeWeenieContext(ctx, cx, cy, R, Object.assign({ oy: R * 0.17 }, opts));
  const { u, I, poly, ln, ell, box, cylZ, coneZ } = g;

  ctx.save();
  if (g.flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  const marF = '#f5f2eb', marR = '#d6cfc2', marT = '#ffffff';
  const vermF = '#b83227', vermD = '#7e1e17';
  const blueF = '#1d4ed8', blueL = '#2563eb', blueD = '#1e3a8a', tealTrim = '#0d9488';
  const gold  = '#facc15', goldM = '#eab308', goldD = '#b45309';

  // Ambient shadow
  ell(...I(0.5, 0.3, 0), u * 5.8, u * 2.85, 'rgba(14, 34, 16, 0.32)');

  // 1. Three-Tiered Circular White Marble Altar Terrace (Qiniangu)
  const tiers = [
    { r: 4.55, z0: 0.00, z1: 0.42 },
    { r: 3.72, z0: 0.42, z1: 0.84 },
    { r: 2.90, z0: 0.84, z1: 1.26 }
  ];
  tiers.forEach(t => {
    cylZ(0, 0, t.r, t.z0, t.z1, marF, marT);
    const pTop = I(0, 0, t.z1);
    ell(pTop[0], pTop[1], 0.99 * t.r * u, 0.495 * t.r * u, null, goldM, u * 0.042);

    // Carved white marble balustrade posts & rail around front perimeter
    const nPosts = 18;
    for (let k = 0; k <= nPosts; k++) {
      const a = -0.22 + (k / nPosts) * (Math.PI + 0.44);
      const px = (t.r - 0.12) * Math.cos(a), py = (t.r - 0.12) * Math.sin(a);
      if (Math.abs(px - py) < 0.58 && px + py > 0) continue; // Leave opening for imperial stairway
      const pB = I(px, py, t.z1), pT = I(px, py, t.z1 + 0.32);
      ln(pB, pT, marT, u * 0.055);
      ell(pT[0], pT[1], u * 0.045, u * 0.045, gold);
    }
  });

  // Central Ceremonial Triple-Flight Marble Stairway & Imperial Dragon Spirit Ramp (Danbi)
  const stAng = Math.PI * 0.25;
  const dirX = Math.cos(stAng), dirY = Math.sin(stAng);
  const perpX = -dirY, perpY = dirX;
  const stPt = (dist, lat, z) => I(dirX * dist + perpX * lat, dirY * dist + perpY * lat, z);

  poly([stPt(2.85, -0.78, 1.26), stPt(2.85, 0.78, 1.26), stPt(4.95, 0.78, 0), stPt(4.95, -0.78, 0)], marT, marR, u * 0.04);
  for (let s = 1; s < 12; s++) {
    const f = s / 12;
    ln(stPt(2.85 + 2.10 * f, -0.78, 1.26 * (1 - f)), stPt(2.85 + 2.10 * f, 0.78, 1.26 * (1 - f)), 'rgba(120, 113, 108, 0.42)', u * 0.025);
  }
  // Imperial gilded danbi spirit ramp down center of stairs
  poly([stPt(2.85, -0.26, 1.27), stPt(2.85, 0.26, 1.27), stPt(4.95, 0.26, 0.01), stPt(4.95, -0.26, 0.01)], goldM, goldD, u * 0.035);

  // Twin Gilded Bronze Ding Incense Tripods on the top terrace
  [-1.08, 1.08].forEach(lat => {
    const pDing = stPt(2.55, lat, 1.26);
    ell(pDing[0], pDing[1], u * 0.24, u * 0.12, goldD);
    ln(pDing, [pDing[0], pDing[1] - u * 0.36], gold, u * 0.26);
    ell(pDing[0], pDing[1] - u * 0.42, u * 0.18, u * 0.09, goldM);
  });

  // 2. Circular Vermilion Timber Colonnade Hall & Triple Imperial Blue Glazed Tile Roofs
  const drawCircularTempleRoof = (rad, z0, z1, isTop = false) => {
    const cMain = coneZ(0, 0, rad, z0, z1, blueF, 0.22);
    // Turquoise glazed eave border & gold trim ring
    ell(cMain.pB[0], cMain.pB[1] + u * 0.03, cMain.rx * 1.03, cMain.ry * 1.03, null, goldD, u * 0.075);
    ell(cMain.pB[0], cMain.pB[1], cMain.rx * 1.01, cMain.ry * 1.01, null, tealTrim, u * 0.065);
    ell(cMain.pB[0], cMain.pB[1] - u * 0.02, cMain.rx, cMain.ry, null, gold, u * 0.032);

    // Golden hip-ridge ribs radiating down the cobalt-blue glazed roof
    for (let k = 0; k <= 12; k++) {
      const a = -0.15 + (k / 12) * (Math.PI + 0.30);
      const bx = cMain.pB[0] + cMain.rx * 0.98 * Math.cos(a);
      const by = cMain.pB[1] + cMain.ry * 0.98 * Math.sin(a) - 0.16 * u;
      ln(cMain.pT, [bx, by], k % 3 === 0 ? gold : 'rgba(15, 23, 42, 0.34)', k % 3 === 0 ? u * 0.042 : u * 0.028);
    }
    return cMain;
  };

  // Lower hall story & gilded lattice doors
  cylZ(0, 0, 2.25, 1.26, 2.95, vermF, vermD);
  for (let k = 0; k <= 10; k++) {
    const a = -0.15 + (k / 10) * (Math.PI + 0.30);
    const px = 2.26 * Math.cos(a), py = 2.26 * Math.sin(a);
    ln(I(px, py, 1.26), I(px, py, 2.75), vermD, u * 0.085);
  }
  // Emerald-teal & gold dougong bracket frieze
  cylZ(0, 0, 2.34, 2.72, 2.96, tealTrim, gold);

  // Tier 1 Lower Eave Roof
  drawCircularTempleRoof(2.88, 2.94, 4.35, false);

  // Middle clerestory drum & Tier 2 Middle Eave Roof
  cylZ(0, 0, 1.76, 4.10, 5.05, vermF, tealTrim);
  cylZ(0, 0, 1.84, 4.82, 5.05, tealTrim, gold);
  drawCircularTempleRoof(2.28, 5.02, 6.32, false);

  // Upper clerestory drum & Tier 3 Crown Roof
  cylZ(0, 0, 1.24, 6.05, 6.85, vermF, tealTrim);
  const topRoof = drawCircularTempleRoof(1.68, 6.82, 8.05, true);

  // Multi-tiered Gilded Bronze Baoding Spire Finial
  const pApex = topRoof.pT;
  ell(pApex[0], pApex[1], u * 0.34, u * 0.16, goldD);
  ell(pApex[0], pApex[1] - u * 0.14, u * 0.24, u * 0.14, gold);
  ln([pApex[0], pApex[1] - u * 0.14], [pApex[0], pApex[1] - u * 0.85], gold, u * 0.09);
  ell(pApex[0], pApex[1] - u * 0.85, u * 0.14, u * 0.14, '#fef08a');

  ctx.restore();
}

/* ============================================================================
   2. JAPAN WEENIE: HIMEJI CASTLE (SHIRASAGI-JŌ — WHITE HERON CASTLE)
      Civilization VI World Wonder Proportions: Outer Courtyard Walls & Corner
      Yagura Turrets, Broad Ishigaki Stone Base, Wide Stepped Tenshu & Wings,
      Crisp White-Seamed Kawara Roofs, Chidori-Hafu Gables & Sakura Trees
   ============================================================================ */
function drawWeenieJapanHimejiCastle(ctx, cx, cy, R, opts = {}) {
  const g = makeWeenieContext(ctx, cx, cy, R, Object.assign({ oy: R * 0.16 }, opts));
  const { u, I, poly, ln, ell, box } = g;

  ctx.save();
  if (g.flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  const stoneF = '#848b94', stoneR = '#575d66', stoneT = '#a5acb5', stoneD = '#3b4047';
  const plasF  = '#ffffff', plasR  = '#e2ddd1', plasT  = '#faf8f2';
  const tileF  = '#313845', tileR  = '#1b2029', tileL  = '#465061';
  const cedar  = '#3b2414', gold   = '#facc15', goldD  = '#b45309';

  // Ground ambient shadow
  ell(...I(0.5, 0.3, 0), u * 6.3, u * 3.1, 'rgba(12, 28, 16, 0.34)');

  // Helper: Clean, crisp faceted Japanese Irimoya (Hip-and-Gable) roof with white shikkui seams
  const drawHimejiRoof = (x0, x1, y0, y1, z0, rise, optsRoof = {}) => {
    const { gable = 'none', shachihoko = false, ridgeAxis = 'X' } = optsRoof;
    const xm = (x0 + x1) * 0.5, ym = (y0 + y1) * 0.5;
    const ov = 0.28;
    const eFL = I(x0 - ov, y1 + ov, z0);
    const eFR = I(x1 + ov, y1 + ov, z0);
    const eBR = I(x1 + ov, y0 - ov, z0);
    const eBL = I(x0 - ov, y0 - ov, z0);

    const inset = 0.24;
    const rA = ridgeAxis === 'X' ? I(x0 + inset, ym, z0 + rise) : I(xm, y0 + inset, z0 + rise);
    const rB = ridgeAxis === 'X' ? I(x1 - inset, ym, z0 + rise) : I(xm, y1 - inset, z0 + rise);

    if (ridgeAxis === 'X') {
      // Back-left slope
      poly([eBL, eFL, rA, rB], tileL);
      // Right hip slope
      poly([eFR, eBR, rB], tileR);
      // Front-left main slope
      poly([eFL, eFR, rB, rA], tileF);
    } else {
      // Back-left slope
      poly([eBL, eFL, rB, rA], tileL);
      // Right main slope
      poly([eFR, eBR, rA, rB], tileR);
      // Front hip slope
      poly([eFL, eFR, rB], tileF);
    }

    // Crisp white shikkui plaster eave, hip-ridge & main-ridge seams (zero stray curves!)
    ln(eFL, eFR, plasF, u * 0.048);
    ln(eFR, eBR, plasR, u * 0.044);
    ln(eFL, ridgeAxis === 'X' ? rA : rB, plasF, u * 0.040);
    ln(eFR, rB, plasF, u * 0.040);
    ln(eBR, ridgeAxis === 'X' ? rB : rA, plasR, u * 0.038);
    ln(rA, rB, plasF, u * 0.080);

    // Triangular Chidori-Hafu dormer gable cleanly seated on the front slope
    const drawChidori = (gxCenter, gHalfW, gBaseZ, gTopZ) => {
      const gL = I(gxCenter - gHalfW, y1 + 0.04, gBaseZ);
      const gR = I(gxCenter + gHalfW, y1 + 0.04, gBaseZ);
      const gT = I(gxCenter, y1 - 0.14, gTopZ);
      poly([gL, gR, gT], plasF, cedar, u * 0.032);
      ln(gL, gT, tileF, u * 0.055);
      ln(gR, gT, tileR, u * 0.055);
      ln(
        [gL[0] + (gT[0] - gL[0]) * 0.36, gL[1] + (gT[1] - gL[1]) * 0.36],
        [gR[0] + (gT[0] - gR[0]) * 0.36, gR[1] + (gT[1] - gR[1]) * 0.36],
        cedar,
        u * 0.028
      );
    };

    if (gable === 'chidori') {
      drawChidori(xm, (x1 - x0) * 0.28, z0 + rise * 0.08, z0 + rise * 0.88);
    } else if (gable === 'double') {
      const span = (x1 - x0) * 0.22;
      drawChidori(xm - span * 1.05, span * 0.82, z0 + rise * 0.08, z0 + rise * 0.84);
      drawChidori(xm + span * 1.05, span * 0.82, z0 + rise * 0.08, z0 + rise * 0.84);
    }

    if (shachihoko) {
      [rA, rB].forEach((rp, idx) => {
        const dir = idx === 0 ? -1 : 1;
        poly([
          [rp[0] - u * 0.05, rp[1]],
          [rp[0] + u * 0.05, rp[1]],
          [rp[0] + dir * u * 0.04, rp[1] - u * 0.24],
          [rp[0] - dir * u * 0.03, rp[1] - u * 0.38],
          [rp[0] - dir * u * 0.08, rp[1] - u * 0.22]
        ], gold, goldD, u * 0.028);
      });
    }
  };

  // Helper: Sloped dry-stone Ishigaki rampart block with ashlar courses & corner quoins
  const drawIshigakiRampart = (x0, x1, y0, y1, z0, z1, flare = 0.42) => {
    const pFL0 = I(x0 - flare, y1 + flare, z0), pFR0 = I(x1 + flare, y1 + flare, z0), pBR0 = I(x1 + flare, y0 - flare, z0);
    const pFL1 = I(x0, y1, z1), pFR1 = I(x1, y1, z1), pBR1 = I(x1, y0, z1), pBL1 = I(x0, y0, z1);

    poly([pFL0, pFR0, pFR1, pFL1], stoneF);
    poly([pFR0, pBR0, pBR1, pFR1], stoneR);
    poly([pBL1, pBR1, pFR1, pFL1], stoneT);

    const nRows = 3;
    for (let r = 1; r <= nRows; r++) {
      const t = r / (nRows + 1);
      const zS = z0 + (z1 - z0) * t;
      const ins = flare * (1 - t);
      ln(I(x0 - ins, y1 + ins, zS), I(x1 + ins, y1 + ins, zS), 'rgba(30, 41, 59, 0.26)', u * 0.022);
      ln(I(x1 + ins, y0 - ins, zS), I(x1 + ins, y1 + ins, zS), 'rgba(15, 23, 42, 0.32)', u * 0.022);
      const qp = I(x1 + ins, y1 + ins, zS);
      ell(qp[0], qp[1], u * (r % 2 ? 0.12 : 0.08), u * 0.06, stoneD);
    }
  };

  // =========================================================================
  // 1. OUTER COURTYARD PERIMETER WALL, CORNER YAGURA TURRETS & FRONT GATEHOUSE
  //    (Matching Civ VI's iconic walled bailey around Himeji Castle)
  // =========================================================================
  const zOuter = 0.55;
  // Stone perimeter foundation & white Dobei plaster walls
  box(-3.65, 3.65, -3.55, 3.55, 0, zOuter, stoneF, stoneR, stoneT);
  box(-3.55, 3.55, 3.38, 3.55, zOuter, zOuter + 0.52, plasF, plasR, tileF);
  box(3.38, 3.55, -3.55, 3.55, zOuter, zOuter + 0.52, plasF, plasR, tileR);
  box(-3.55, -3.38, -3.55, 3.55, zOuter, zOuter + 0.52, plasF, plasR, tileL);

  // Front Gatehouse (Otemon) centered along the front-left wall
  box(-0.85, 0.45, 3.25, 3.72, 0, zOuter + 0.72, plasF, plasR, plasT);
  poly([I(-0.46, 3.73, 0), I(0.06, 3.73, 0), I(0.06, 3.73, 0.95), I(-0.46, 3.73, 0.95)], cedar, goldD, u * 0.03);
  drawHimejiRoof(-0.88, 0.48, 3.22, 3.75, zOuter + 0.72, 0.44, { gable: 'none', ridgeAxis: 'X' });

  // Three Corner Yagura Watch-Turrets anchored into the outer perimeter corners
  // Front-Left Corner Yagura
  box(-3.72, -2.65, 2.55, 3.62, 0, zOuter + 0.95, plasF, plasR, plasT);
  drawHimejiRoof(-3.75, -2.62, 2.52, 3.65, zOuter + 0.95, 0.52, { gable: 'none', ridgeAxis: 'X' });

  // Front-Right Corner Yagura
  box(2.55, 3.62, 2.55, 3.62, 0, zOuter + 0.95, plasF, plasR, plasT);
  drawHimejiRoof(2.52, 3.65, 2.52, 3.65, zOuter + 0.95, 0.52, { gable: 'none', ridgeAxis: 'Y' });

  // Back-Right Corner Yagura
  box(2.55, 3.62, -3.62, -2.55, 0, zOuter + 0.95, plasF, plasR, plasT);
  drawHimejiRoof(2.52, 3.65, -3.65, -2.52, zOuter + 0.95, 0.52, { gable: 'none', ridgeAxis: 'Y' });

  // =========================================================================
  // 2. BROAD CENTRAL ISHIGAKI STONE CITADEL MOUND & TERRACED WINGS
  // =========================================================================
  const zCitadel = 1.95;
  drawIshigakiRampart(-2.55, 2.35, -2.45, 2.15, zOuter, zCitadel, 0.45);

  // Long Cascading Lower Gallery Wing (Watari-yagura) spanning the front-right terrace
  const zWing1 = zCitadel + 1.05;
  box(-2.35, 2.15, 0.75, 1.95, zCitadel, zWing1, plasF, plasR, plasT);
  [-1.8, -1.0, -0.2, 0.6, 1.4].forEach(wx => {
    box(wx - 0.14, wx + 0.14, 1.95, 1.97, zCitadel + 0.32, zCitadel + 0.78, cedar, cedar, cedar);
  });
  [1.05, 1.60].forEach(wy => {
    box(2.15, 2.17, wy - 0.14, wy + 0.14, zCitadel + 0.32, zCitadel + 0.78, cedar, cedar, cedar);
  });
  drawHimejiRoof(-2.38, 2.18, 0.72, 1.98, zWing1, 0.68, { gable: 'double', ridgeAxis: 'X' });

  // Flanking East Minor Keep (Higashi-Kotenshu) on the right side of the citadel
  const zEast1 = zCitadel + 1.25;
  box(0.85, 2.25, -1.55, 0.65, zCitadel, zEast1, plasF, plasR, plasT);
  drawHimejiRoof(0.82, 2.28, -1.58, 0.68, zEast1, 0.65, { gable: 'none', ridgeAxis: 'Y' });
  const zEast2 = zEast1 + 1.15;
  box(1.08, 2.02, -1.25, 0.35, zEast1 + 0.35, zEast2, plasF, plasR, plasT);
  drawHimejiRoof(1.05, 2.05, -1.28, 0.38, zEast2, 0.72, { gable: 'chidori', shachihoko: true, ridgeAxis: 'Y' });

  // Flanking West Minor Keep (Nishi-Kotenshu) on the left side of the citadel
  const zWest1 = zCitadel + 1.20;
  box(-2.45, -1.25, -0.95, 0.85, zCitadel, zWest1, plasF, plasR, plasT);
  drawHimejiRoof(-2.48, -1.22, -0.98, 0.88, zWest1, 0.62, { gable: 'chidori', ridgeAxis: 'X' });

  // =========================================================================
  // 3. BROAD, STEPPED 4-TIER MAIN KEEP (DAITENSHU — WHITE HERON HERO KEEP)
  // =========================================================================
  // Tier 1 (Wide White Plastered Base Keep Story + Double Chidori-Hafu Gables)
  const zK1 = zCitadel + 1.38;
  box(-2.05, 0.85, -2.15, 0.55, zCitadel, zK1, plasF, plasR, plasT);
  [-1.55, -0.60, 0.35].forEach(wx => {
    box(wx - 0.16, wx + 0.16, 0.55, 0.57, zCitadel + 0.42, zCitadel + 0.96, cedar, cedar, cedar);
  });
  [-1.65, -0.80, 0.05].forEach(wy => {
    box(0.85, 0.87, wy - 0.16, wy + 0.16, zCitadel + 0.42, zCitadel + 0.96, cedar, cedar, cedar);
  });
  drawHimejiRoof(-2.08, 0.88, -2.18, 0.58, zK1, 0.78, { gable: 'double', ridgeAxis: 'X' });

  // Tier 2 (Tapering Keep Story + Central Chidori-Hafu Triangular Gable)
  const zK2 = zK1 + 1.58;
  box(-1.72, 0.52, -1.85, 0.25, zK1 + 0.46, zK2, plasF, plasR, plasT);
  [-1.20, -0.60, 0.00].forEach(wx => {
    box(wx - 0.14, wx + 0.14, 0.25, 0.27, zK1 + 0.82, zK1 + 1.28, cedar, cedar, cedar);
  });
  drawHimejiRoof(-1.75, 0.55, -1.88, 0.28, zK2, 0.74, { gable: 'chidori', ridgeAxis: 'X' });

  // Tier 3 (Upper Keep Story + Broad Kawara Roof)
  const zK3 = zK2 + 1.45;
  box(-1.38, 0.18, -1.52, -0.08, zK2 + 0.44, zK3, plasF, plasR, plasT);
  [-0.95, -0.25].forEach(wx => {
    box(wx - 0.13, wx + 0.13, -0.08, -0.06, zK2 + 0.76, zK2 + 1.18, cedar, cedar, cedar);
  });
  drawHimejiRoof(-1.41, 0.21, -1.55, -0.05, zK3, 0.68, { gable: 'none', ridgeAxis: 'X' });

  // Tier 4 (Top Observation Belvedere Story + Crowning Roof with Golden Shachihoko!)
  const zK4 = zK3 + 1.35;
  box(-1.05, -0.15, -1.18, -0.42, zK3 + 0.40, zK4, plasF, plasR, plasT);
  [-0.78, -0.42].forEach(wx => {
    box(wx - 0.10, wx + 0.10, -0.42, -0.40, zK3 + 0.68, zK3 + 1.06, cedar, cedar, cedar);
  });
  drawHimejiRoof(-1.08, -0.12, -1.21, -0.39, zK4, 0.85, { gable: 'none', shachihoko: true, ridgeAxis: 'X' });

  // =========================================================================
  // 4. BLOOMING PINK SAKURA CHERRY TREES RINGING THE OUTER COURTYARD
  // =========================================================================
  const drawSakuraTree = (sx, sy, sc = 1) => {
    const ps = I(sx, sy, 0);
    ell(ps[0] + u * 0.12 * sc, ps[1] + u * 0.05 * sc, u * 0.85 * sc, u * 0.32 * sc, 'rgba(12, 28, 16, 0.28)');
    ln(ps, [ps[0], ps[1] - u * 1.18 * sc], '#3b2822', u * 0.22 * sc);
    ell(ps[0], ps[1] - u * 1.55 * sc, u * 0.96 * sc, u * 0.56 * sc, '#f472b6');
    ell(ps[0] - u * 0.26 * sc, ps[1] - u * 1.72 * sc, u * 0.72 * sc, u * 0.42 * sc, '#f9a8d4');
    ell(ps[0] + u * 0.22 * sc, ps[1] - u * 1.66 * sc, u * 0.62 * sc, u * 0.36 * sc, '#fbcfe8');
  };

  drawSakuraTree(-3.95, 1.45, 0.95);
  drawSakuraTree(-2.15, 3.95, 0.92);
  drawSakuraTree( 1.45, 3.95, 0.94);
  drawSakuraTree( 3.95, 1.55, 0.96);
  drawSakuraTree( 3.95, -1.25, 0.88);

  ctx.restore();
}
/* ============================================================================
   3. JURASSIC ISLAND WEENIE: PREHISTORIC EXPEDITION VISITOR CENTER (RED ROOF)
   ============================================================================ */
function drawWeenieJurassicVisitorCenter(ctx, cx, cy, R, opts = {}) {
  const g = makeWeenieContext(ctx, cx, cy, R, Object.assign({ oy: R * 0.15 }, opts));
  const { u, I, poly, ln, ell, box, cylZ } = g;

  ctx.save();
  if (g.flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  const concF  = '#d0ccc2', concM = '#b5b0a6', concR = '#8c877e', concT = '#e6e2d8';
  const redF   = '#b83227', redL  = '#d64538', redD  = '#7c1d16';
  const wood   = '#6b3a1c', woodD = '#3b1d0b', glass = '#1e293b', water = '#7dd3fc';

  // Helper: Draw a wide convex 3D dome-frustum band (matching the 3D reference model's curved roof!)
  const drawRedDomeBand = (X, Y, rBot, rTop, zBot, zTop, bulge = 0.14) => {
    const pB = I(X, Y, zBot), pT = I(X, Y, zTop);
    const rxB = 0.99 * rBot * u, ryB = 0.495 * rBot * u;
    const rxT = 0.99 * rTop * u, ryT = 0.495 * rTop * u;

    const gr = ctx.createLinearGradient(pB[0] - rxB, 0, pB[0] + rxB, 0);
    gr.addColorStop(0.00, redL);
    gr.addColorStop(0.45, redF);
    gr.addColorStop(1.00, redD);

    const midY = (pB[1] + pT[1]) * 0.5;
    const midRx = (rxB + rxT) * 0.5 + bulge * u;

    ctx.beginPath();
    ctx.moveTo(pB[0] - rxB, pB[1]);
    ctx.quadraticCurveTo(pB[0] - midRx, midY, pT[0] - rxT, pT[1]);
    ctx.ellipse(pT[0], pT[1], rxT, ryT, 0, Math.PI, 0, false);
    ctx.quadraticCurveTo(pB[0] + midRx, midY, pB[0] + rxB, pB[1]);
    ctx.ellipse(pB[0], pB[1], rxB, ryB, 0, 0, Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = gr;
    ctx.fill();

    // Subtle shingle texture ribs curving down the dome band
    for (let k = 1; k < 12; k++) {
      const a = (k / 12) * Math.PI;
      const bx = pB[0] + rxB * Math.cos(a), by = pB[1] + ryB * Math.sin(a);
      const tx = pT[0] + rxT * Math.cos(a), ty = pT[1] + ryT * Math.sin(a);
      ln([tx, ty], [bx, by], 'rgba(56, 12, 8, 0.26)', u * 0.028);
    }

    // Crisp eave shadow rim along front bottom edge
    ctx.strokeStyle = redD;
    ctx.lineWidth = u * 0.045;
    ctx.beginPath();
    ctx.ellipse(pB[0], pB[1], rxB, ryB, 0, 0, Math.PI);
    ctx.stroke();
  };

  // Helper: Draw a recessed clerestory glass ring with vertical concrete mullions
  const drawClerestoryRing = (X, Y, rad, zBot, zTop, nMullions = 9) => {
    cylZ(X, Y, rad, zBot, zTop, '#1e293b', concT);
    const pB = I(X, Y, zBot), pT = I(X, Y, zTop);
    const rx = 0.99 * rad * u, ry = 0.495 * rad * u;
    // Top concrete lintel band
    ctx.strokeStyle = concT;
    ctx.lineWidth = u * 0.065;
    ctx.beginPath();
    ctx.ellipse(pT[0], pT[1], rx * 1.02, ry * 1.02, 0, 0, Math.PI);
    ctx.stroke();
    // Vertical concrete window mullions
    for (let k = 0; k <= nMullions; k++) {
      const a = (k / nMullions) * Math.PI;
      const mx = Math.cos(a) * rx, my = Math.sin(a) * ry;
      ln([pB[0] + mx, pB[1] + my], [pT[0] + mx, pT[1] + my], concF, u * 0.055);
    }
  };

  // Helper: Flanking turret with clerestory ring + convex red dome + small tapered apex peak
  const drawSideTurret = (X, Y, rad, zWallTop) => {
    drawClerestoryRing(X, Y, rad * 0.88, zWallTop, zWallTop + 0.48, 7);
    drawRedDomeBand(X, Y, rad * 1.06, rad * 0.24, zWallTop + 0.46, zWallTop + 1.48, 0.16);
    // Small tapered crimson lantern peak at apex (matching 3D model!)
    drawRedDomeBand(X, Y, rad * 0.24, rad * 0.08, zWallTop + 1.46, zWallTop + 1.98, 0.02);
  };

  // Ground ambient shadow
  ell(...I(0.5, 0.3, 0), u * 5.8, u * 2.85, 'rgba(8, 22, 10, 0.34)');

  // 1. Two Flanking Secondary Rotunda Turrets (Back-Left & Back-Right)
  cylZ(-2.65, -0.85, 1.22, 0.15, 2.35, concF, concT);
  drawSideTurret(-2.65, -0.85, 1.22, 2.35);

  cylZ(2.45, -1.25, 1.18, 0.15, 2.35, concR, concM);
  drawSideTurret(2.45, -1.25, 1.18, 2.35);

  // 2. Battered Concrete Terrace Deck & Wings (Left & Right of Central Portal)
  poly([I(-3.95, 1.25, 0), I(-0.95, 1.85, 0), I(-0.95, 1.65, 2.25), I(-3.65, 1.08, 2.25)], concF);
  poly([I(-3.95, -0.95, 0), I(-3.95, 1.25, 0), I(-3.65, 1.08, 2.25), I(-3.65, -0.82, 2.25)], concM);
  poly([I(-3.65, -0.82, 2.25), I(-0.95, -0.55, 2.25), I(-0.95, 1.65, 2.25), I(-3.65, 1.08, 2.25)], concT);

  poly([I(0.85, 1.85, 0), I(3.85, 1.15, 0), I(3.55, 0.98, 2.25), I(0.85, 1.65, 2.25)], concF);
  poly([I(3.85, -1.25, 0), I(3.85, 1.15, 0), I(3.55, 0.98, 2.25), I(3.55, -1.08, 2.25)], concR);
  poly([I(0.85, -0.65, 2.25), I(3.55, -1.08, 2.25), I(3.55, 0.98, 2.25), I(0.85, 1.65, 2.25)], concT);

  // Red Terrace Railings along the upper roof deck edges (matching 3D model!)
  const drawTerraceRail = (pA, pB, nPosts = 7) => {
    const pATop = [pA[0], pA[1] - u * 0.32], pBTop = [pB[0], pB[1] - u * 0.32];
    ln(pATop, pBTop, redF, u * 0.045);
    for (let k = 0; k <= nPosts; k++) {
      const f = k / nPosts;
      const bx = pA[0] + (pB[0] - pA[0]) * f, by = pA[1] + (pB[1] - pA[1]) * f;
      ln([bx, by], [bx, by - u * 0.32], redD, u * 0.032);
    }
  };
  drawTerraceRail(I(-3.60, 1.05, 2.26), I(-1.05, 1.58, 2.26), 7);
  drawTerraceRail(I(-3.60, -0.78, 2.26), I(-3.60, 1.05, 2.26), 5);
  drawTerraceRail(I(0.95, 1.58, 2.26), I(3.50, 0.95, 2.26), 7);
  drawTerraceRail(I(3.50, -1.04, 2.26), I(3.50, 0.95, 2.26), 5);

  // Tall Gallery Windows & Round Concrete Columns along Curved Facade
  [[-2.85, 1.32], [-1.95, 1.48], [-1.25, 1.60]].forEach(([wx, wy], idx) => {
    if (idx < 2) {
      poly([I(wx - 0.32, wy, 0.45), I(wx + 0.32, wy, 0.45), I(wx + 0.30, wy - 0.05, 1.78), I(wx - 0.30, wy - 0.05, 1.78)], glass, concT, u * 0.04);
      ln(I(wx, wy, 0.45), I(wx, wy - 0.05, 1.78), concM, u * 0.03);
      ln(I(wx - 0.31, wy - 0.02, 1.12), I(wx + 0.31, wy - 0.02, 1.12), concM, u * 0.03);
    }
    // Round concrete column beside window
    ln(I(wx + 0.42, wy + 0.08, 0.25), I(wx + 0.42, wy + 0.04, 2.22), concT, u * 0.14);
  });
  [[1.65, 1.50], [2.55, 1.30]].forEach(([wx, wy]) => {
    poly([I(wx - 0.32, wy, 0.45), I(wx + 0.32, wy, 0.45), I(wx + 0.30, wy - 0.05, 1.78), I(wx - 0.30, wy - 0.05, 1.78)], glass, concT, u * 0.04);
    ln(I(wx, wy, 0.45), I(wx, wy - 0.05, 1.78), concM, u * 0.03);
    ln(I(wx - 0.31, wy - 0.02, 1.12), I(wx + 0.31, wy - 0.02, 1.12), concM, u * 0.03);
    ln(I(wx - 0.42, wy + 0.08, 0.25), I(wx - 0.42, wy + 0.04, 2.22), concT, u * 0.14);
  });

  // 3. Central 3-Tiered Convex Red Dome-Cone Roof with 2 Clerestory Window Bands & Lantern Peak!
  const cx0 = -0.08, cy0 = -0.22;
  // Lower broad convex dome skirt (resting cleanly on the concrete terrace deck at z = 2.25)
  drawRedDomeBand(cx0, cy0, 2.95, 1.98, 2.25, 3.45, 0.22);
  // First recessed clerestory window ring with concrete mullions
  drawClerestoryRing(cx0, cy0, 1.84, 3.42, 3.82, 11);
  // Middle convex dome tier
  drawRedDomeBand(cx0, cy0, 1.95, 1.04, 3.80, 4.72, 0.14);
  // Second upper clerestory window ring with concrete mullions
  drawClerestoryRing(cx0, cy0, 0.94, 4.70, 5.02, 9);
  // Upper dome cap + small tapered lantern finial peak (exact match to 3D reference!)
  drawRedDomeBand(cx0, cy0, 1.02, 0.32, 5.00, 5.58, 0.06);
  drawRedDomeBand(cx0, cy0, 0.32, 0.10, 5.56, 6.18, 0.02);

  // 4. Twin Stepped Turquoise Reflecting Pools, Tropical Planters & Central Grand Staircase
  box(-2.95, -0.95, 1.60, 2.95, 0, 0.68, concM, concR, concT);
  box( 0.85,  2.85, 1.60, 2.95, 0, 0.68, concM, concR, concT);

  // Turquoise reflecting pool basins flanking the stairs (matching 3D model!)
  poly([I(-2.45, 2.05, 0.42), I(-1.15, 2.05, 0.42), I(-1.15, 2.82, 0.42), I(-2.45, 2.82, 0.42)], water, concR, u * 0.04);
  poly([I( 1.05, 2.05, 0.42), I( 2.35, 2.05, 0.42), I( 2.35, 2.82, 0.42), I( 1.05, 2.82, 0.42)], water, concR, u * 0.04);

  // Lush green planters tucked along the pool borders
  [[-2.65, 2.35], [-1.35, 1.85], [1.25, 1.85], [2.55, 2.35]].forEach(([px, py], idx) => {
    const pp = I(px, py, 0.68);
    ell(pp[0], pp[1], u * 0.42, u * 0.22, idx % 2 ? '#2e7d36' : '#3d8f44');
    ell(pp[0] - u * 0.10, pp[1] - u * 0.06, u * 0.26, u * 0.14, '#55a85c');
  });

  // Central Front-Facing Grand Staircase ascending from z=0 to z=0.68
  poly([I(-0.95, 2.95, 0), I(0.85, 2.95, 0), I(0.85, 1.95, 0.68), I(-0.95, 1.95, 0.68)], concT, concR, u * 0.04);
  for (let s = 1; s < 8; s++) {
    const f = s / 8;
    ln(I(-0.95, 2.95 - 1.00 * f, 0.68 * f), I(0.85, 2.95 - 1.00 * f, 0.68 * f), concR, u * 0.028);
  }

  // 5. Monumental Carved Stone Entrance Portal & Spoked Wooden Double Doors
  const zP0 = 0.68, zP1 = 2.88;
  poly([I(-1.02, 1.96, zP0), I(0.92, 1.96, zP0), I(0.82, 1.88, zP1), I(-0.92, 1.88, zP1)], concT, concR, u * 0.045);
  poly([I(0.92, 1.55, zP0), I(0.92, 1.96, zP0), I(0.82, 1.88, zP1), I(0.82, 1.50, zP1)], concR);

  // Carved stone relief lintel panel above doors
  poly([I(-0.56, 1.93, 1.96), I(0.46, 1.93, 1.96), I(0.44, 1.90, 2.66), I(-0.54, 1.90, 2.66)], '#8c8278', concR, u * 0.035);
  ln(I(-0.36, 1.92, 2.32), I(0.26, 1.92, 2.26), '#d6d3d1', u * 0.065);

  // Recessed spoked wooden double doors with amber ring emblem
  poly([I(-0.52, 1.98, zP0), I(0.42, 1.98, zP0), I(0.42, 1.98, 1.90), I(-0.52, 1.98, 1.90)], wood, woodD, u * 0.045);
  const pDoorC = I(-0.05, 1.99, 1.30);
  ell(pDoorC[0], pDoorC[1], u * 0.28, u * 0.34, null, '#d97706', u * 0.04);
  ln(I(-0.05, 1.99, zP0), I(-0.05, 1.99, 1.90), woodD, u * 0.045);
  ln([pDoorC[0] - u * 0.24, pDoorC[1]], [pDoorC[0] + u * 0.24, pDoorC[1]], '#d97706', u * 0.035);

  ctx.restore();
}
/* ============================================================================
   4. ANCIENT ROME WEENIE: TEMPLE OF APOLLO (PALATINE HILL)
   ============================================================================ */
function drawWeenieRomeTempleOfApollo(ctx, cx, cy, R, opts = {}) {
  const g = makeWeenieContext(ctx, cx, cy, R, Object.assign({ oy: R * 0.16 }, opts));
  const { u, I, poly, ln, ell, box } = g;

  ctx.save();
  if (g.flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  const travF = '#f2e8d4', travR = '#cbb996', travT = '#fcf8f0', travD = '#a89470';
  const tileF = '#b84628', red = '#9e2a2b', purple = '#581c46';
  const gold  = '#facc15', goldM = '#eab308', goldD = '#b45309', goldHi = '#fef9c3';

  poly([I(2.9, -3.7, 0), I(5.8, -0.4, 0), I(4.6, 4.4, 0), I(0.5, 4.7, 0)], 'rgba(20, 22, 10, 0.30)');

  const zPod = 1.55;
  box(-2.55, 2.55, -3.45, 2.85, 0, zPod, travF, travR, travT);
  box(-2.70, 2.70, -3.60, 3.00, 0, 0.30, travR, travD, travF);
  box(-2.66, 2.66, -3.56, 2.96, zPod - 0.18, zPod + 0.04, travT, travR, travT);

  [0.58, 0.92, 1.24].forEach(zp => {
    ln(I(-2.55, 2.86, zp), I(2.55, 2.86, zp), 'rgba(130, 110, 82, 0.28)', u * 0.025);
    ln(I(2.56, -3.45, zp), I(2.56, 2.85, zp), 'rgba(90, 75, 55, 0.30)', u * 0.025);
  });

  box(-2.55, -1.72, 2.85, 4.55, 0, zPod, travF, travR, travT);
  box( 1.72,  2.55, 2.85, 4.55, 0, zPod, travF, travR, travT);
  poly([I(-1.72, 4.55, 0), I(1.72, 4.55, 0), I(1.72, 2.85, zPod), I(-1.72, 2.85, zPod)], travT);
  for (let s = 1; s < 10; s++) {
    const f = s / 10;
    ln(I(-1.72, 4.55 - 1.70 * f, zPod * f), I(1.72, 4.55 - 1.70 * f, zPod * f), 'rgba(120, 100, 72, 0.42)', u * 0.030);
  }

  [-2.14, 2.14].forEach(ax => {
    box(ax - 0.25, ax + 0.25, 3.75, 4.25, zPod, zPod + 0.52, red, shade(red, -0.25), gold);
    const pFl = I(ax, 4.00, zPod + 0.62);
    ell(pFl[0], pFl[1], u * 0.14, u * 0.22, '#f97316');
    ell(pFl[0], pFl[1] + u * 0.04, u * 0.07, u * 0.12, goldHi);
  });

  const zCol0 = zPod + 0.04, zCol1 = zCol0 + 3.35;
  box(-1.92, 1.92, -3.15, 0.68, zCol0, zCol1, travR, shade(travR, -0.20), travF);

  [-1.32, 1.32].forEach(nx => {
    poly([I(nx - 0.24, 0.69, zCol0 + 0.35), I(nx + 0.24, 0.69, zCol0 + 0.35), I(nx + 0.24, 0.69, zCol0 + 1.85), I(nx, 0.69, zCol0 + 2.12), I(nx - 0.24, 0.69, zCol0 + 1.85)], '#2b1810', goldM, u * 0.04);
    ln(I(nx, 0.70, zCol0 + 0.42), I(nx, 0.70, zCol0 + 1.65), gold, u * 0.13);
  });

  poly([I(-0.66, 0.69, zCol0), I(0.66, 0.69, zCol0), I(0.66, 0.69, zCol0 + 2.52), I(-0.66, 0.69, zCol0 + 2.52)], '#3b150c', gold, u * 0.065);
  ln(I(0, 0.70, zCol0), I(0, 0.70, zCol0 + 2.52), gold, u * 0.045);

  const drawCorinthianCol = (cxO, cyO, isFront) => {
    const pB = I(cxO, cyO, zCol0), pT = I(cxO, cyO, zCol1);
    ln(pB, pT, isFront ? '#ffffff' : travF, u * 0.24);
    ln([pB[0] + u * 0.06, pB[1]], [pT[0] + u * 0.06, pT[1]], travR, u * 0.08);
    ell(pB[0], pB[1], u * 0.19, u * 0.09, travR);
    ell(pT[0], pT[1] + u * 0.06, u * 0.19, u * 0.09, goldD);
    ell(pT[0], pT[1], u * 0.22, u * 0.11, gold);
  };

  [-2.24, -1.34, -0.45, 0.45, 1.34, 2.24].forEach(cxO => drawCorinthianCol(cxO, 2.66, true));
  [1.88, 1.12, 0.36, -0.40, -1.16, -1.92, -2.68, -3.15].forEach(cyO => drawCorinthianCol(2.24, cyO, false));

  const zEnt0 = zCol1, zEnt1 = zCol1 + 0.72, zApex = zEnt1 + 1.56;
  box(-2.48, 2.48, -3.38, 2.90, zEnt0, zEnt1, travT, travR, travT);

  poly([I(-2.42, 2.91, zEnt0 + 0.18), I(2.42, 2.91, zEnt0 + 0.18), I(2.42, 2.91, zEnt0 + 0.52), I(-2.42, 2.91, zEnt0 + 0.52)], red, gold, u * 0.042);
  poly([I(2.49, -3.32, zEnt0 + 0.18), I(2.49, 2.86, zEnt0 + 0.18), I(2.49, 2.86, zEnt0 + 0.52), I(2.49, -3.32, zEnt0 + 0.52)], shade(red, -0.24), goldM, u * 0.038);

  const eFL = I(-2.62, 3.04, zEnt1), eFR = I(2.62, 3.04, zEnt1);
  const eBR = I(2.62, -3.50, zEnt1), eBL = I(-2.62, -3.50, zEnt1);
  const rF  = I(0, 3.04, zApex), rB = I(0, -3.50, zApex);
  poly([eBL, eFL, rF, rB], shade(tileF, 0.14));
  poly([eFR, eBR, rB, rF], tileF);
  for (let k = 1; k <= 9; k++) {
    const tb = -3.50 + (6.54 * k) / 10;
    ln(I(0, tb, zApex), I(2.62, tb, zEnt1), 'rgba(42, 14, 6, 0.34)', u * 0.045);
  }
  ln(rB, rF, goldM, u * 0.12);

  poly([I(-2.56, 2.96, zEnt1), I(2.56, 2.96, zEnt1), I(0, 2.96, zApex)], travT, travR, u * 0.05);
  poly([I(-2.12, 2.98, zEnt1 + 0.14), I(2.12, 2.98, zEnt1 + 0.14), I(0, 2.98, zApex - 0.22)], purple);
  ell(...I(0, 2.99, zEnt1 + 0.62), u * 0.32, u * 0.28, gold);
  ell(...I(-0.68, 2.99, zEnt1 + 0.42), u * 0.22, u * 0.16, goldM);
  ell(...I( 0.68, 2.99, zEnt1 + 0.42), u * 0.22, u * 0.16, goldM);

  ctx.restore();
}

/* ============================================================================
   5. ANCIENT GREECE WEENIE: THE PARTHENON ON TOP OF NATURAL ACROPOLIS ROCK
   ============================================================================ */
function drawWeenieGreeceParthenon(ctx, cx, cy, R, opts = {}) {
  const g = makeWeenieContext(ctx, cx, cy, R, Object.assign({ oy: R * 0.16 }, opts));
  const { u, I, poly, ln, ell, clipPoly, box } = g;
  const rnd = mulberry(4471);

  ctx.save();
  if (g.flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  const zRockRim = 2.45;
  const zHill    = 2.95;

  ell(...I(0.85, 0.25, 0), u * 4.6, u * 3.3, 'rgba(22, 24, 14, 0.30)', 0.32);

  // Elongated along Y (-4.95 .. +4.75) and narrower across X (-3.95 .. +4.15) to match the Parthenon's proportions
  const basePts = [
    I(-3.95,  2.25, 0),
    I(-3.25,  3.85, 0),
    I(-1.75,  4.55, 0),
    I(-0.10,  4.80, 0),
    I( 1.65,  4.50, 0),
    I( 3.15,  3.75, 0),
    I( 4.05,  2.15, 0),
    I( 4.15,  0.10, 0),
    I( 3.75, -2.35, 0),
    I( 3.10, -4.65, 0),
    I(-3.45, -4.45, 0)
  ];

  const rimPts = [
    I(-2.75,  1.85, zRockRim - 0.12),
    I(-2.15,  2.55, zRockRim - 0.05),
    I(-1.05,  2.90, zRockRim + 0.04),
    I( 0.18,  3.02, zRockRim + 0.08),
    I( 1.45,  2.80, zRockRim + 0.02),
    I( 2.45,  2.20, zRockRim - 0.06),
    I( 2.85,  0.65, zRockRim - 0.10),
    I( 2.75, -1.45, zRockRim - 0.14),
    I( 2.25, -3.55, zRockRim - 0.18),
    I(-2.55, -3.35, zRockRim - 0.18)
  ];

  const traceCragSilhouette = () => {
    ctx.beginPath();
    ctx.moveTo(basePts[0][0], basePts[0][1]);
    for (let i = 1; i <= 9; i++) {
      const p0 = basePts[i - 1], p1 = basePts[i];
      const mx = (p0[0] + p1[0]) * 0.5 + (rnd() - 0.5) * u * 0.24;
      const my = (p0[1] + p1[1]) * 0.5 + (rnd() - 0.35) * u * 0.16;
      ctx.quadraticCurveTo(mx, my, p1[0], p1[1]);
    }
    ctx.lineTo(I(3.35, -3.95, 1.15)[0], I(3.35, -3.95, 1.15)[1]);
    ctx.lineTo(I(2.80, -3.70, 1.85)[0], I(2.80, -3.70, 1.85)[1]);
    ctx.lineTo(rimPts[8][0], rimPts[8][1]);
    for (let k = 7; k >= 0; k--) {
      ctx.lineTo(rimPts[k][0], rimPts[k][1]);
    }
    ctx.lineTo(I(-3.30, 2.05, 1.55)[0], I(-3.30, 2.05, 1.55)[1]);
    ctx.lineTo(I(-3.65, 2.20, 0.72)[0], I(-3.65, 2.20, 0.72)[1]);
    ctx.closePath();
  };

  const baseGrad = ctx.createLinearGradient(I(-3, 0, zRockRim)[0], I(0, -3, zRockRim)[1], I(3, 3, 0)[0], I(0, 4.5, 0)[1]);
  baseGrad.addColorStop(0.00, '#dfd4be');
  baseGrad.addColorStop(0.45, '#c4b496');
  baseGrad.addColorStop(0.82, '#9e8c6e');
  baseGrad.addColorStop(1.00, '#7d6d54');
  traceCragSilhouette();
  ctx.fillStyle = baseGrad;
  ctx.fill();

  clipPoly(
    [
      basePts[0], basePts[1], basePts[2], basePts[3], basePts[4],
      basePts[5], basePts[6], basePts[7], basePts[8], basePts[9],
      I(2.80, -3.70, 1.85), rimPts[8], rimPts[7], rimPts[6], rimPts[5],
      rimPts[4], rimPts[3], rimPts[2], rimPts[1], rimPts[0],
      I(-3.30, 2.05, 1.55), I(-3.65, 2.20, 0.72)
    ],
    () => {
      poly([
        I(-3.4, 2.1, 1.5), I(-2.75, 1.85, zRockRim), I(0.18, 3.02, zRockRim + 0.08),
        I(2.45, 2.20, zRockRim), I(2.9, 3.0, 1.3), I(0.15, 4.1, 1.1), I(-2.6, 3.4, 1.1)
      ], '#d9c9ab');

      poly([
        I(2.45, 2.20, zRockRim), I(2.85, 0.65, zRockRim), I(2.75, -1.45, zRockRim),
        I(2.25, -3.55, zRockRim), I(3.5, -3.8, 1.0), I(4.15, 0.10, 0),
        I(4.05, 2.15, 0), I(3.15, 3.75, 0), I(2.6, 2.8, 1.3)
      ], '#8a795e');

      const rockFacets = [
        [[[-2.6, 2.0, 2.3], [-1.6, 2.6, 2.4], [-1.9, 3.4, 1.3], [-3.0, 2.8, 1.2]], '#e6dac3'],
        [[[-1.6, 2.6, 2.4], [-0.5, 2.9, 2.5], [-0.8, 3.9, 1.3], [-1.9, 3.4, 1.3]], '#b8a688'],
        [[[-0.5, 2.9, 2.5], [ 0.6, 2.9, 2.5], [ 0.8, 3.9, 1.2], [-0.6, 3.9, 1.2]], '#e3d5bc'],
        [[[ 0.6, 2.9, 2.5], [ 1.7, 2.5, 2.4], [ 2.1, 3.5, 1.2], [ 0.8, 3.9, 1.2]], '#ad9b7d'],
        [[[ 1.7, 2.5, 2.4], [ 2.5, 2.1, 2.3], [ 3.1, 3.1, 1.1], [ 2.1, 3.5, 1.2]], '#877559'],
        [[[ 2.6, 1.7, 2.3], [ 2.9, 0.2, 2.3], [ 3.7, 0.6, 1.0], [ 3.2, 2.6, 1.0]], '#75654c'],
        [[[ 2.9, 0.2, 2.3], [ 2.6,-1.8, 2.2], [ 3.5,-2.1, 0.9], [ 3.7, 0.6, 1.0]], '#968468'],
        [[[-2.8, 3.2, 1.2], [-1.5, 3.8, 1.3], [-1.8, 4.5, 0.1], [-3.2, 3.8, 0.1]], '#c7b699'],
        [[[-0.6, 3.8, 1.2], [ 0.7, 3.9, 1.2], [ 0.4, 4.7, 0.1], [-0.9, 4.5, 0.1]], '#b3a082'],
        [[[ 1.0, 3.7, 1.1], [ 2.3, 3.3, 1.1], [ 3.0, 3.8, 0.1], [ 1.5, 4.5, 0.1]], '#9c8a6c']
      ];
      rockFacets.forEach(([pts3, col]) => {
        poly(pts3.map(p => I(p[0], p[1], p[2])), col);
      });

      for (let st = 0; st < 7; st++) {
        const zS = 0.35 + st * 0.32;
        ln(
          I(-3.5, 2.4, zS - 0.18),
          I( 2.7, 2.6, zS + 0.16),
          st % 2 === 0 ? 'rgba(64, 52, 34, 0.28)' : 'rgba(252, 245, 230, 0.28)',
          u * 0.042
        );
        ln(
          I(2.7, 2.6, zS + 0.16),
          I(3.4, -3.6, zS - 0.14),
          'rgba(48, 38, 24, 0.32)',
          u * 0.040
        );
      }

      const fissures = [
        [[-2.2, 2.4, 2.35], [-2.5, 3.1, 1.45], [-3.0, 3.8, 0.25]],
        [[-1.3, 2.7, 2.42], [-1.5, 3.5, 1.35], [-1.7, 4.4, 0.20]],
        [[-0.3, 2.9, 2.48], [-0.1, 3.8, 1.30], [-0.2, 4.7, 0.15]],
        [[ 0.9, 2.8, 2.45], [ 1.2, 3.6, 1.30], [ 1.5, 4.4, 0.20]],
        [[ 1.9, 2.3, 2.38], [ 2.3, 3.1, 1.25], [ 2.8, 3.8, 0.20]],
        [[ 2.7, 0.9, 2.32], [ 3.3, 1.3, 1.15], [ 3.9, 1.8, 0.15]],
        [[ 2.7,-1.0, 2.26], [ 3.3,-1.2, 1.10], [ 3.9,-1.4, 0.15]]
      ];
      fissures.forEach(chain => {
        for (let k = 0; k < chain.length - 1; k++) {
          const pA = I(...chain[k]), pB = I(...chain[k + 1]);
          ln(pA, pB, 'rgba(48, 38, 24, 0.48)', u * 0.065);
          ln([pA[0] - u * 0.07, pA[1]], [pB[0] - u * 0.07, pB[1]], 'rgba(255, 248, 232, 0.42)', u * 0.045);
        }
      });

      const pCave = I(-0.95, 4.05, 0.55);
      ell(pCave[0], pCave[1], u * 0.26, u * 0.34, '#2e2418');
      ell(pCave[0] + u * 0.04, pCave[1] + u * 0.04, u * 0.16, u * 0.22, '#17120c');
    }
  );

  // Classical Acropolis Ashlar Fortification Circuit Wall & Stone Buttresses
  const wallF = '#e3d3b4', wallR = '#b5a282', wallT = '#f5ebd6', wallD = '#8f7d60';
  for (let k = 0; k < 5; k++) {
    const p0 = rimPts[k], p1 = rimPts[k + 1];
    const p0T = [p0[0], p0[1] - (zHill - zRockRim) * u];
    const p1T = [p1[0], p1[1] - (zHill - zRockRim) * u];
    poly([p0, p1, p1T, p0T], k % 2 ? wallF : shade(wallF, -0.05));
    ln([p0[0], (p0[1] + p0T[1]) * 0.5], [p1[0], (p1[1] + p1T[1]) * 0.5], 'rgba(92, 76, 52, 0.32)', u * 0.025);
    ln(p0T, p1T, wallT, u * 0.055);
  }
  for (let k = 5; k < 8; k++) {
    const p0 = rimPts[k], p1 = rimPts[k + 1];
    const p0T = [p0[0], p0[1] - (zHill - zRockRim) * u];
    const p1T = [p1[0], p1[1] - (zHill - zRockRim) * u];
    poly([p0, p1, p1T, p0T], wallR);
    ln([p0[0], (p0[1] + p0T[1]) * 0.5], [p1[0], (p1[1] + p1T[1]) * 0.5], 'rgba(54, 44, 28, 0.36)', u * 0.025);
    ln(p0T, p1T, wallF, u * 0.050);

    const bm = [(p0[0] + p1[0]) * 0.5, (p0[1] + p1[1]) * 0.5];
    const bmT = [(p0T[0] + p1T[0]) * 0.5, (p0T[1] + p1T[1]) * 0.5];
    poly([
      [bm[0] - u * 0.08, bm[1] + u * 0.04],
      [bm[0] + u * 0.14, bm[1] + u * 0.08],
      [bmT[0] + u * 0.14, bmT[1] + u * 0.08],
      [bmT[0] - u * 0.08, bmT[1] + u * 0.04]
    ], wallD);
  }

  // Elongated pale-limestone Acropolis summit terrace framing the entire Parthenon
  poly([
    I(-2.55, -3.35, zHill - 0.18),
    I( 2.25, -3.55, zHill - 0.18),
    I( 2.75, -1.45, zHill - 0.14),
    I( 2.85,  0.65, zHill - 0.10),
    I( 2.45,  2.20, zHill - 0.06),
    I( 1.45,  2.80, zHill + 0.02),
    I( 0.18,  3.02, zHill + 0.08),
    I(-1.05,  2.90, zHill + 0.04),
    I(-2.15,  2.55, zHill - 0.05),
    I(-2.75,  1.85, zHill - 0.12)
  ], '#efe1c4');

  // Winding Propylaea marble ramp & steps ascending the western/front slope
  poly([I(-2.8, 3.3, 0.12), I(-1.9, 3.8, 0.12), I(-1.5, 2.4, zHill), I(-2.2, 2.1, zHill)], '#f7f3eb', '#9c8660', u * 0.032);
  for (let s = 1; s < 9; s++) {
    const f = s / 9;
    ln(I(-2.8 + 0.6 * f, 3.3 - 1.2 * f, zHill * f), I(-1.9 + 0.4 * f, 3.8 - 1.4 * f, zHill * f), 'rgba(110, 92, 62, 0.42)', u * 0.025);
  }

  // Mediterranean scrub, olive trees & cypresses nestled at the base of the elongated slopes
  const drawMedScrub = (X, Y, sc = 1) => {
    const ps = I(X, Y, 0.05);
    ell(ps[0] + u * 0.10 * sc, ps[1] + u * 0.04 * sc, u * 0.62 * sc, u * 0.22 * sc, 'rgba(22, 24, 14, 0.22)');
    ell(ps[0], ps[1] - u * 0.20 * sc, u * 0.58 * sc, u * 0.32 * sc, '#617d42');
    ell(ps[0] - u * 0.16 * sc, ps[1] - u * 0.30 * sc, u * 0.40 * sc, u * 0.22 * sc, '#7a9954');
  };
  drawMedScrub(-3.3, 2.8, 1.00);
  drawMedScrub(-1.1, 4.2, 0.88);
  drawMedScrub( 1.0, 4.3, 0.92);
  drawMedScrub( 2.8, 3.2, 0.96);
  drawMedScrub( 3.6, 0.8, 0.85);

  [[-3.4, 1.9, 0.88], [3.3, 2.1, 0.84]].forEach(([ox, oy, sc]) => {
    const po = I(ox, oy, 0);
    ell(po[0] + u * 0.12 * sc, po[1] + u * 0.05 * sc, u * 0.72 * sc, u * 0.26 * sc, 'rgba(22, 24, 14, 0.24)');
    ln(po, [po[0], po[1] - u * 0.98 * sc], '#5c4b3b', u * 0.20 * sc);
    ell(po[0], po[1] - u * 1.24 * sc, u * 0.84 * sc, u * 0.46 * sc, '#739152');
    ell(po[0] - u * 0.18 * sc, po[1] - u * 1.40 * sc, u * 0.58 * sc, u * 0.32 * sc, '#8ca868');
  });
  [-2.85, -3.12].forEach((cxP, idx) => {
    const pc = I(cxP, 2.95 + idx * 0.32, 0);
    const ch = u * (1.80 - idx * 0.22);
    ln(pc, [pc[0], pc[1] - ch * 0.22], '#4a3728', u * 0.10);
    poly([[pc[0] - u * 0.22, pc[1] - ch * 0.18], [pc[0], pc[1] - ch], [pc[0] + u * 0.22, pc[1] - ch * 0.18]], idx === 0 ? '#325936' : '#3f6e44');
  });

  // Pentelic White Marble Parthenon Crowned Comfortably Inside the Elongated Acropolis Summit
  const marF = '#ffffff', marR = '#dfd8c8', marT = '#faf8f5', marD = '#c4bba8';
  const tileF = '#c2593a', blue = '#1d5fa7', gold = '#facc15', goldD = '#b45309';

  box(-1.88, 1.88, -2.95, 2.35, zHill, zHill + 0.20, marR, marD, marT);
  box(-1.74, 1.74, -2.80, 2.20, zHill + 0.20, zHill + 0.38, marF, marR, marT);
  box(-1.62, 1.62, -2.66, 2.06, zHill + 0.38, zHill + 0.54, marT, marR, marT);

  const zC0 = zHill + 0.54, zC1 = zC0 + 2.48;
  box(-1.02, 1.02, -1.98, 1.44, zC0, zC1, marR, shade(marR, -0.22), marF);
  poly([I(-0.38, 1.45, zC0), I(0.38, 1.45, zC0), I(0.38, 1.45, zC0 + 1.90), I(-0.38, 1.45, zC0 + 1.90)], '#2b1d14', gold, u * 0.045);
  ln(I(0, 1.46, zC0 + 0.15), I(0, 1.46, zC0 + 1.60), gold, u * 0.15);

  for (let k = 0; k < 8; k++) {
    const cxO = -1.46 + (2.92 * k) / 7;
    const pB = I(cxO, 1.92, zC0), pT = I(cxO, 1.92, zC1);
    ln(pB, pT, marF, u * 0.145);
    ln([pB[0] + u * 0.04, pB[1]], [pT[0] + u * 0.04, pT[1]], marR, u * 0.05);
    ell(pT[0], pT[1], u * 0.12, u * 0.055, marT);
  }
  for (let k = 0; k < 10; k++) {
    const cyO = 1.92 - (4.42 * k) / 9;
    const pB = I(1.46, cyO, zC0), pT = I(1.46, cyO, zC1);
    ln(pB, pT, marT, u * 0.145);
    ln([pB[0] + u * 0.04, pB[1]], [pT[0] + u * 0.04, pT[1]], marR, u * 0.05);
    ell(pT[0], pT[1], u * 0.12, u * 0.055, marR);
  }

  const zE0 = zC1, zE1 = zC1 + 0.52, zApex = zE1 + 1.06;
  box(-1.60, 1.60, -2.62, 2.04, zE0, zE1, marT, marR, marT);
  ln(I(-1.60, 2.05, zE0 + 0.22), I(1.60, 2.05, zE0 + 0.22), marD, u * 0.04);
  for (let k = -4; k <= 4; k++) {
    ln(I(k * 0.34, 2.05, zE0 + 0.24), I(k * 0.34, 2.05, zE0 + 0.46), blue, u * 0.07);
  }
  for (let k = -5; k <= 4; k++) {
    ln(I(1.61, -0.25 + k * 0.42, zE0 + 0.24), I(1.61, -0.25 + k * 0.42, zE0 + 0.46), shade(blue, -0.22), u * 0.068);
  }

  const eFL = I(-1.72, 2.14, zE1), eFR = I(1.72, 2.14, zE1);
  const eBR = I(1.72, -2.72, zE1), eBL = I(-1.72, -2.72, zE1);
  const rF  = I(0, 2.14, zApex), rB = I(0, -2.72, zApex);
  poly([eBL, eFL, rF, rB], shade(tileF, 0.14));
  poly([eFR, eBR, rB, rF], tileF);
  for (let k = 1; k <= 7; k++) {
    const tb = -2.72 + (4.86 * k) / 8;
    ln(I(0, tb, zApex), I(1.72, tb, zE1), 'rgba(55, 20, 10, 0.30)', u * 0.04);
  }
  ln(rB, rF, gold, u * 0.085);

  poly([I(-1.68, 2.08, zE1), I(1.68, 2.08, zE1), I(0, 2.08, zApex)], marT, marR, u * 0.045);
  poly([I(-1.32, 2.10, zE1 + 0.10), I(1.32, 2.10, zE1 + 0.10), I(0, 2.10, zApex - 0.15)], blue);
  ell(...I(0, 2.11, zE1 + 0.40), u * 0.24, u * 0.19, gold);
  ell(...I(-0.48, 2.11, zE1 + 0.26), u * 0.16, u * 0.13, marT);
  ell(...I( 0.48, 2.11, zE1 + 0.26), u * 0.16, u * 0.13, marT);
  ell(rF[0], rF[1] - u * 0.12, u * 0.10, u * 0.13, gold);
  ell(eFL[0], eFL[1] - u * 0.10, u * 0.085, u * 0.11, goldD);
  ell(eFR[0], eFR[1] - u * 0.10, u * 0.085, u * 0.11, goldD);

  ctx.restore();
}
/* ============================================================================
   6. GALACTIC OUTPOST WEENIE: CURVED SPACEPORT & ORIGINAL TWIN-BOOM STARFIGHTER
   ============================================================================ */
function drawWeenieGalacticSpaceport(ctx, cx, cy, R, opts = {}) {
  const g = makeWeenieContext(ctx, cx, cy, R, Object.assign({ oy: R * 0.15 }, opts));
  const { u, I, poly, ln, ell, box, cylZ } = g;

  ctx.save();
  if (g.flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  const stucco = '#e2cbb0', stuccoD = '#a88e70', sand = '#cfa070', sandD = '#9c7148';
  const slate = '#3d4856', slateD = '#1e293b', terra = '#b85a3a', teal = '#1f7a7a';
  const cyan = '#38bdf8', amber = '#f59e0b', gold = '#facc15';

  // Ground ambient shadow
  ell(...I(0.5, 0.3, 0), u * 5.6, u * 2.75, 'rgba(20, 12, 8, 0.34)');

  // 1. Fluted Petrified Black Spire Outcrops framing the rear bay perimeter (Batuu skyline character!)
  const drawBackdropSpire = (sx, sy, w, h) => {
    const pB = I(sx, sy, 0.15);
    const tipX = pB[0] - w * 0.08 * u, tipY = pB[1] - h * u;
    poly([
      [pB[0] - w * u, pB[1]],
      [pB[0] - w * 0.58 * u, pB[1] - h * 0.52 * u],
      [tipX, tipY],
      [pB[0] + w * 0.05 * u, pB[1] + u * 0.05]
    ], '#7c6b5e');
    poly([
      [pB[0] + w * 0.05 * u, pB[1] + u * 0.05],
      [tipX, tipY],
      [pB[0] + w * 0.62 * u, pB[1] - h * 0.48 * u],
      [pB[0] + w * u, pB[1]]
    ], '#2f2c36');
    ln([tipX, tipY], [pB[0] + w * 0.05 * u, pB[1]], '#c7b29e', u * 0.045);
  };
  drawBackdropSpire(-1.65, -3.55, 0.85, 4.45);
  drawBackdropSpire( 1.95, -3.35, 0.72, 3.65);

  // 2. Sunken Multi-Ringed Duracrete Landing Deck with Blast-Scorched Thruster Ring & Guidance Lights
  const pPad = I(0.25, 0.35, 0.18);
  ell(pPad[0], pPad[1] + u * 0.18, u * 4.55, u * 2.25, '#262d37');
  ell(pPad[0], pPad[1], u * 4.45, u * 2.18, '#475569');
  // Radial deck expansion seams
  for (let s = 0; s < 8; s++) {
    const a = (s / 8) * Math.PI * 2 + 0.2;
    ln(pPad, [pPad[0] + Math.cos(a) * u * 4.35, pPad[1] + Math.sin(a) * u * 2.12], 'rgba(15, 23, 42, 0.38)', u * 0.035);
  }
  ell(pPad[0], pPad[1], u * 3.18, u * 1.56, '#334155', 0, amber, u * 0.065);
  ell(pPad[0], pPad[1], u * 2.38, u * 1.16, '#1e293b', 0, cyan, u * 0.05);
  // Central blast-deflector grate
  ell(pPad[0], pPad[1], u * 1.15, u * 0.56, '#0f172a');

  // 3. Curved Batuu Sandstone & Duracrete Docking Bay Wall with Stepped Battlements, Alcoves & Canopy Sails
  const N_ARC = 11;
  for (let k = 0; k < N_ARC; k++) {
    const a0 = Math.PI * 0.88 + (k / N_ARC) * Math.PI * 1.24;
    const a1 = Math.PI * 0.88 + ((k + 1) / N_ARC) * Math.PI * 1.24;
    const rIn = 3.55, rOut = 4.38;
    // Stepped Batuu parapet height variation for lived-in organic silhouette
    const zH = 2.55 + (k % 3 === 1 ? 0.42 : k % 2 === 0 ? 0.16 : 0);
    const pI0 = I(0.25 + rIn * Math.cos(a0), 0.35 + rIn * Math.sin(a0), 0.18);
    const pI1 = I(0.25 + rIn * Math.cos(a1), 0.35 + rIn * Math.sin(a1), 0.18);
    const pO0 = I(0.25 + rOut * Math.cos(a0), 0.35 + rOut * Math.sin(a0), 0.18);
    const pO1 = I(0.25 + rOut * Math.cos(a1), 0.35 + rOut * Math.sin(a1), 0.18);

    const pI0T = [pI0[0], pI0[1] - zH * u], pI1T = [pI1[0], pI1[1] - zH * u];
    const pO0T = [pO0[0], pO0[1] - zH * u], pO1T = [pO1[0], pO1[1] - zH * u];

    poly([pI0, pI1, pI1T, pI0T], k % 2 ? stucco : sand);
    poly([pO0, pO1, pO1T, pO0T], stuccoD);
    poly([pI0T, pI1T, pO1T, pO0T], '#efe0cb');

    // Horizontal weathering belt course & recessed rounded service alcoves
    ln([pI0[0], pI0[1] - zH * 0.52 * u], [pI1[0], pI1[1] - zH * 0.52 * u], 'rgba(92, 64, 40, 0.35)', u * 0.045);

    if (k % 2 === 1 && k < 9) {
      const pm = [(pI0[0] + pI1[0]) * 0.5, (pI0[1] + pI1[1]) * 0.5];
      ell(pm[0], pm[1] - u * 0.92, u * 0.30, u * 0.48, slateD);
      ell(pm[0], pm[1] - u * 1.12, u * 0.14, u * 0.09, k === 3 || k === 7 ? amber : cyan);
    }
  }

  // Draped Batuu woven fabric shade sails stretched along the inner upper docking wall
  const pSailA = I(-2.65, -2.05, 2.55), pSailB = I(-0.55, -3.15, 2.65), pSailC = I(1.65, -2.75, 2.50);
  poly([pSailA, pSailB, [pSailB[0], pSailB[1] + u * 0.48], [pSailA[0], pSailA[1] + u * 0.44]], terra);
  poly([pSailB, pSailC, [pSailC[0], pSailC[1] + u * 0.44], [pSailB[0], pSailB[1] + u * 0.48]], teal);

  // 4. Tiered Batuu Saucer-Domed Flight Control Tower (Left Back Rim)
  const pTowB = I(-3.25, -1.65, 0.18), pTowT = I(-3.25, -1.65, 4.55);
  cylZ(-3.25, -1.65, 1.18, 0.18, 4.55, stucco, stuccoD);
  // External conduit pipes & glowing flight-deck observation slit
  ln([pTowB[0] - u * 0.72, pTowB[1] - u * 0.2], [pTowT[0] - u * 0.72, pTowT[1] + u * 0.2], terra, u * 0.11);
  ell(pTowT[0] + u * 0.12, pTowT[1] + u * 0.58, u * 0.55, u * 0.14, cyan);
  ell(pTowT[0], pTowT[1], u * 1.42, u * 0.68, slate);
  ctx.fillStyle = terra;
  ctx.beginPath();
  ctx.ellipse(pTowT[0], pTowT[1] - u * 0.04, u * 1.22, u * 0.76, 0, Math.PI, 0);
  ctx.ellipse(pTowT[0], pTowT[1] - u * 0.04, u * 1.22, u * 0.58, 0, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  ln([pTowT[0], pTowT[1] - u * 0.76], [pTowT[0], pTowT[1] - u * 1.92], '#cbd5e1', u * 0.085);
  ell(pTowT[0], pTowT[1] - u * 1.96, u * 0.15, u * 0.15, cyan);

  // Sagging overhead power cables connecting the Flight Control Tower to the Docking Bay Wall!
  const pWire1 = [pTowT[0] + u * 0.95, pTowT[1] + u * 0.35];
  const pWire2 = I(0.45, -3.15, 2.75);
  ctx.strokeStyle = 'rgba(28, 25, 23, 0.78)';
  ctx.lineWidth = u * 0.04;
  ctx.beginPath();
  ctx.moveTo(pWire1[0], pWire1[1]);
  ctx.quadraticCurveTo((pWire1[0] + pWire2[0]) * 0.5, (pWire1[1] + pWire2[1]) * 0.5 + u * 0.42, pWire2[0], pWire2[1]);
  ctx.stroke();

  // 5. Right-Side Fueling Pylon & Articulated Overhead Gantry Crane
  cylZ(3.65, -0.85, 0.95, 0.18, 2.85, sand, slate);
  const pG1 = I(3.45, -0.75, 2.65), pG2 = I(1.75, 0.08, 2.42);
  ln(pG1, pG2, slateD, u * 0.20);
  ln(pG1, pG2, amber, u * 0.075);
  ln(pG2, [pG2[0], pG2[1] + u * 0.62], '#94a3b8', u * 0.055);
  ell(pG2[0], pG2[1] + u * 0.65, u * 0.14, u * 0.08, amber);

  // 6. Original Sleek Twin-Boom / Forward-Swept Outer-Rim Starfighter (NOT Millennium Falcon!)
  const sx = 0.22, sy = 0.48, sz = 0.84;

  // Ship ground shadow on landing pad
  ell(I(sx, sy, 0.20)[0], I(sx, sy, 0.20)[1], u * 2.25, u * 1.12, 'rgba(10, 14, 22, 0.48)');

  // Tripod landing struts
  [[-1.05, 0.68], [0.95, 0.68], [-0.15, -1.00]].forEach(([lx, ly]) => {
    ln(I(sx + lx, sy + ly, sz), I(sx + lx * 1.15, sy + ly * 1.15, 0.20), '#94a3b8', u * 0.11);
    ell(...I(sx + lx * 1.15, sy + ly * 1.15, 0.20), u * 0.22, u * 0.10, slateD);
  });

  // Swept Forward-Boom Wings with Crimson/Amber Outer-Rim Livery Stripes
  poly([
    I(sx - 1.68, sy - 0.92, sz + 0.10),
    I(sx - 0.45, sy - 0.48, sz + 0.20),
    I(sx - 0.15, sy + 0.50, sz + 0.12),
    I(sx - 1.48, sy + 1.08, sz + 0.05)
  ], '#cbd5e1', slateD, u * 0.045);
  poly([
    I(sx + 0.45, sy - 0.48, sz + 0.20),
    I(sx + 1.68, sy - 0.92, sz + 0.10),
    I(sx + 1.48, sy + 1.08, sz + 0.05),
    I(sx + 0.15, sy + 0.50, sz + 0.12)
  ], '#e2e8f0', slateD, u * 0.045);

  // Twin Wingtip Laser Cannon Booms & Livery Stripes
  ln(I(sx - 1.68, sy - 0.92, sz + 0.10), I(sx - 1.55, sy + 1.45, sz + 0.04), terra, u * 0.12);
  ln(I(sx + 1.68, sy - 0.92, sz + 0.10), I(sx + 1.55, sy + 1.45, sz + 0.04), terra, u * 0.12);
  ln(I(sx - 0.92, sy - 0.65, sz + 0.16), I(sx - 0.78, sy + 0.72, sz + 0.10), amber, u * 0.085);
  ln(I(sx + 0.92, sy - 0.65, sz + 0.16), I(sx + 0.78, sy + 0.72, sz + 0.10), amber, u * 0.085);

  // Sleek Central Dart-Shaped Starfighter Fuselage
  poly([
    I(sx - 0.38, sy - 1.20, sz + 0.05),
    I(sx + 0.38, sy - 1.20, sz + 0.05),
    I(sx + 0.50, sy + 0.38, sz + 0.28),
    I(sx + 0.22, sy + 1.88, sz + 0.06),
    I(sx - 0.22, sy + 1.88, sz + 0.06),
    I(sx - 0.50, sy + 0.38, sz + 0.28)
  ], '#f8fafc', slateD, u * 0.045);

  // Nose Cone Accent & Twin Vertical Stabilizer Fins
  poly([
    I(sx - 0.22, sy + 1.88, sz + 0.06),
    I(sx + 0.22, sy + 1.88, sz + 0.06),
    I(sx + 0.14, sy + 2.30, sz + 0.02),
    I(sx - 0.14, sy + 2.30, sz + 0.02)
  ], terra);
  poly([I(sx - 0.36, sy - 1.15, sz + 0.10), I(sx - 0.42, sy - 0.35, sz + 0.18), I(sx - 0.48, sy - 1.18, sz + 0.78)], terra);
  poly([I(sx + 0.36, sy - 1.15, sz + 0.10), I(sx + 0.42, sy - 0.35, sz + 0.18), I(sx + 0.48, sy - 1.18, sz + 0.78)], terra);

  // Tinted Cyan Bubble Canopy Cockpit
  poly([
    I(sx - 0.24, sy + 0.12, sz + 0.30),
    I(sx + 0.24, sy + 0.12, sz + 0.30),
    I(sx + 0.16, sy + 1.22, sz + 0.24),
    I(sx - 0.16, sy + 1.22, sz + 0.24)
  ], '#0284c7', '#e0f2fe', u * 0.04);
  ell(...I(sx - 0.06, sy + 0.68, sz + 0.32), u * 0.14, u * 0.08, '#bae6fd');

  // Twin Glowing Cyan Ion Thruster Exhausts
  [-0.58, 0.58].forEach(ex => {
    const pEng = I(sx + ex, sy - 0.96, sz + 0.16);
    ell(pEng[0], pEng[1], u * 0.28, u * 0.23, slateD);
    ell(pEng[0], pEng[1], u * 0.17, u * 0.15, cyan);
    ell(pEng[0], pEng[1], u * 0.08, u * 0.07, '#ffffff');
  });

  // 7. Lived-In Spaceport Bay Clutter: Guidance Beacons, Cargo Containers, Fuel Drum & Astromech Droid
  [-1.95, 2.45].forEach(bx => {
    const pBec = I(bx, 2.38, 0.20);
    ln(pBec, [pBec[0], pBec[1] - u * 0.76], slateD, u * 0.12);
    ell(pBec[0], pBec[1] - u * 0.82, u * 0.20, u * 0.20, 'rgba(56, 189, 248, 0.35)');
    ell(pBec[0], pBec[1] - u * 0.82, u * 0.10, u * 0.10, cyan);
  });
  box(-2.95, -2.15, 0.65, 1.35, 0.18, 0.78, terra, shade(terra, -0.25), amber);
  box(-2.55, -1.95, 1.38, 1.88, 0.18, 0.62, teal, shade(teal, -0.25), '#cbd5e1');

  // Miniature dome-headed utility droid rolling beside the cargo crates
  const pDroid = I(-1.65, 1.55, 0.20);
  ell(pDroid[0], pDroid[1], u * 0.18, u * 0.09, 'rgba(10, 14, 22, 0.38)');
  ln(pDroid, [pDroid[0], pDroid[1] - u * 0.34], '#f8fafc', u * 0.22);
  ell(pDroid[0], pDroid[1] - u * 0.38, u * 0.12, u * 0.10, '#0284c7');
  ell(pDroid[0] + u * 0.04, pDroid[1] - u * 0.39, u * 0.035, u * 0.035, amber);

  ctx.restore();
}

/* ===== UNIFIED DISPATCHER, BAKE & FOOTPRINT API ===== */
function drawWeenieLandmarkV3(ctx, cx, cy, R, themeId = 'china', opts = {}) {
  const key = String(themeId || 'china').toLowerCase();
  const id = key.includes('jap') ? 'japan'
           : key.includes('jur') ? 'jurassic'
           : key.includes('rom') ? 'rome'
           : key.includes('gre') ? 'greece'
           : key.includes('gal') ? 'galactic'
           : 'china';
  const meta = WEENIE_V3_CATALOG[id];

  if (opts.tile) {
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = meta.tileCol;
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, R * 0.025);
    ctx.strokeStyle = meta.tileRim;
    ctx.stroke();
  }

  if (id === 'japan')    return drawWeenieJapanHimejiCastle(ctx, cx, cy, R, opts);
  if (id === 'jurassic') return drawWeenieJurassicVisitorCenter(ctx, cx, cy, R, opts);
  if (id === 'rome')     return drawWeenieRomeTempleOfApollo(ctx, cx, cy, R, opts);
  if (id === 'greece')   return drawWeenieGreeceParthenon(ctx, cx, cy, R, opts);
  if (id === 'galactic') return drawWeenieGalacticSpaceport(ctx, cx, cy, R, opts);
  return drawWeenieChinaTempleOfHeaven(ctx, cx, cy, R, opts);
}

const WEENIE_V3_BAKE_CACHE = {};
function bakeWeenieLandmarkV3(theme, R, opts = {}) {
  const pr = opts.pixelRatio || 2;
  const key = [theme, R, !!opts.flip, pr].join('|');
  if (WEENIE_V3_BAKE_CACHE[key]) return WEENIE_V3_BAKE_CACHE[key];

  const W = Math.ceil(R * 4.0 * pr);
  const H = Math.ceil(R * 4.6 * pr);
  const ax = W * 0.5;
  const ay = H * 0.72;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const c = cv.getContext('2d');
  c.scale(pr, pr);
  drawWeenieLandmarkV3(c, ax / pr, ay / pr, R, theme, { flip: opts.flip, tile: false });

  const d = cv.getContext('2d').getImageData(0, 0, W, H).data;
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (d[(y * W + x) * 4 + 3] > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  const pad = 2;
  const bx = Math.max(0, x0 - pad);
  const by = Math.max(0, y0 - pad);
  const bw = Math.min(W, x1 + pad + 1) - bx;
  const bh = Math.min(H, y1 + pad + 1) - by;
  const out = document.createElement('canvas');
  out.width = bw;
  out.height = bh;
  out.getContext('2d').drawImage(cv, bx, by, bw, bh, 0, 0, bw, bh);

  return (WEENIE_V3_BAKE_CACHE[key] = {
    canvas: out,
    ox: (ax - bx) / pr,
    oy: (ay - by) / pr,
    w: bw / pr,
    h: bh / pr,
    pixelRatio: pr,
    bbox: {
      left: -(ax - bx) / pr,
      top: -(ay - by) / pr,
      right: (bx + bw - ax) / pr,
      bottom: (by + bh - ay) / pr
    }
  });
}

const WEENIE_LANDMARKS_V3 = {
  china:    drawWeenieChinaTempleOfHeaven,
  japan:    drawWeenieJapanHimejiCastle,
  jurassic: drawWeenieJurassicVisitorCenter,
  rome:     drawWeenieRomeTempleOfApollo,
  greece:   drawWeenieGreeceParthenon,
  galactic: drawWeenieGalacticSpaceport,
  draw:     drawWeenieLandmarkV3,
  bake:     bakeWeenieLandmarkV3
};
return WEENIE_LANDMARKS_V3;
})();
