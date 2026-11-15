(function () {
/* ===== CORE HELPERS (shared style from guest_services_pack.html) ===== */
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
const WEENIE_V2_CATALOG = {
  nordic: {
    id: 'nordic',
    fnName: 'drawWeenieNordicStaveChurch',
    themeLabel: 'NORDIC WEENIE',
    title: 'Great Stave Church of Borgund',
    sub: 'Full Wrap-Around Tarred Shingles, Seam-Hugging Moss, Stave Planks & Dragon Prows',
    tileCol: '#5b7a68',
    tileRim: '#3f594a',
    desc: 'Monumental Borgund-style Norwegian Stave Church with all 5 cascading tarred-shingle roof tiers, a complete hipped/wrap-around lower ambulatory shingle roof (both front-left and right slopes fully shingled with scalloped eaves, zero exposed brown roof faces), and a shingled rear apse turret. Clipped organic multi-toned green moss colonies creep along the damp shingle seams and ridge lines, paired with weathered vertical stave planks, mortised horizontal sill beams with timber pegs, carved Urnes interlace bargeboards, and golden dragon-head gable prows.'
  },
  gothic: {
    id: 'gothic',
    fnName: 'drawWeenieGothicCathedral',
    themeLabel: 'GOTHIC WEENIE',
    title: 'Ruined Haunted Gothic Cathedral',
    sub: 'Weathered Dark Ashlar, Isometric Rose Window, Shattered Spire & Wall-Projected Ivy',
    tileCol: '#374151',
    tileRim: '#1f2937',
    desc: 'Dark, atmospheric ruined High-Gothic cathedral: weathered charcoal-limestone ashlar masonry with mortar courses, grime mottling, and structural cracks; a stained-glass rose window projected onto the true isometric front wall plane; cleanly routed flying buttresses clearing the side transept; a shattered upper right spire and collapsed nave/transept roofs exposing rafters; wall-projected creeping ivy; gnarled cemetery trees; and low-lying ground fog.'
  },
  western: {
    id: 'western',
    fnName: 'drawWeenieWesternMitten',
    themeLabel: 'WILD WEST WEENIE',
    title: 'Monument Valley Mitten Butte',
    sub: 'Organic Sculpted Sandstone Cliffs, Fluted Talus & Detached Thumb Spire',
    tileCol: '#d6a468',
    tileRim: '#a86e38',
    desc: 'Organic, non-blocky Monument Valley West Mitten Butte sculpted with curved Wingate sandstone cliffs, fluted red-ochre talus scree aprons, natural erosion gullies, stratified sedimentary bands, a flat caprock mesa, and the detached slender "thumb" pinnacle—surrounded by desert boulders, sagebrush, and saguaro cacti.'
  },
  medieval: {
    id: 'medieval',
    fnName: 'drawWeenieMedievalNeuschwanstein',
    themeLabel: 'MEDIEVAL WEENIE',
    title: 'Fairytale Fantasy Hilltop Castle',
    sub: 'Natural Pine & Waterfall Crag, Arched Stone Viaduct & Soaring Turrets',
    tileCol: '#6d9158',
    tileRim: '#4a6939',
    desc: 'A natural, lively Alpine mountain crag draped in rolling emerald meadows, a cascading mountain stream and pool, wildflowers, mossy boulders, and layered evergreen pines—crowned directly on the rock ridge by a detailed fairytale fantasy castle with an arched stone viaduct bridge, timbered bartizan turrets, stained-glass rose & lancet windows, and gold-ribbed cobalt spires with fluttering pennants.'
  }
};

/* ===== SHARED ISOMETRIC CONTEXT BUILDER ===== */
function makeWeenieContext(ctx, cx, cy, R, opts) {
  const flip = !!opts.flip;
  const u = R * 0.088;
  const cyB = cy + (opts.oy != null ? opts.oy : R * 0.13);

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

  const wallPlane = (X, Y, Z, plane = 'F') => {
    const p = I(X, Y, Z);
    ctx.translate(p[0], p[1]);
    if (plane === 'R') {
      ctx.transform(-0.7 * u, 0.35 * u, 0, -u, 0, 0);
    } else {
      ctx.transform(0.7 * u, 0.35 * u, 0, -u, 0, 0);
    }
  };

  const softFog = (x, y, rx, ry, rgb, a) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, ry / rx);
    const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    gr.addColorStop(0, `rgba(${rgb},${a})`);
    gr.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.arc(0, 0, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const box = (x0, x1, y0, y1, z0, z1, colFront, colRight, colTop, stroke, lw) => {
    TH.box(ctx, cx, cyB, u, x0, x1, y0, y1, z0, z1, colFront, colRight || shade(colFront, -0.25), colTop !== false ? (colTop || shade(colFront, 0.14)) : false);
    if (stroke) {
      poly([I(x0, y1, z0), I(x1, y1, z0), I(x1, y1, z1), I(x0, y1, z1)], null, stroke, lw);
      poly([I(x1, y0, z0), I(x1, y1, z0), I(x1, y1, z1), I(x1, y0, z1)], null, stroke, lw);
    }
  };

  const cylZ = (X, Y, rad, z0, z1, colMain, colTop) => {
    const pB = I(X, Y, z0);
    const pT = I(X, Y, z1);
    const rx = 0.99 * rad * u;
    const ry = 0.495 * rad * u;
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
  };

  const coneZ = (X, Y, rad, z0, z1, colMain) => {
    const pB = I(X, Y, z0);
    const pT = I(X, Y, z1);
    const rx = 0.99 * rad * u;
    const ry = 0.495 * rad * u;
    const gr = ctx.createLinearGradient(pB[0] - rx, 0, pB[0] + rx, 0);
    gr.addColorStop(0.00, shade(colMain, 0.24));
    gr.addColorStop(0.45, colMain);
    gr.addColorStop(1.00, shade(colMain, -0.36));
    ctx.beginPath();
    ctx.moveTo(pB[0] - rx, pB[1]);
    ctx.lineTo(pT[0], pT[1]);
    ctx.lineTo(pB[0] + rx, pB[1]);
    ctx.ellipse(pB[0], pB[1], rx, ry, 0, 0, Math.PI);
    ctx.closePath();
    ctx.fillStyle = gr;
    ctx.fill();
    return pT;
  };

  const gableX = (x0, x1, y0, y1, z0, rh, colFrontSlope, colRightEnd, colRidge, nCourses = 0) => {
    const ym = (y0 + y1) * 0.5;
    const zTop = z0 + rh;
    const A = I(x0, y1, z0), B = I(x1, y1, z0), R1 = I(x1, ym, zTop), R0 = I(x0, ym, zTop);
    poly([I(x1, y0, z0), I(x1, y1, z0), I(x1, ym, zTop)], colRightEnd);
    poly([A, B, R1, R0], colFrontSlope);
    if (nCourses > 0) {
      for (let k = 1; k <= nCourses; k++) {
        const t = k / (nCourses + 1);
        const L = [A[0] + (R0[0] - A[0]) * t, A[1] + (R0[1] - A[1]) * t];
        const Rr = [B[0] + (R1[0] - B[0]) * t, B[1] + (R1[1] - B[1]) * t];
        ln(L, Rr, 'rgba(0, 0, 0, 0.24)', u * 0.045);
        ln([L[0], L[1] - u * 0.04], [Rr[0], Rr[1] - u * 0.04], 'rgba(255, 255, 255, 0.10)', u * 0.03);
      }
    }
    ln(R0, R1, colRidge || shade(colFrontSlope, 0.28), u * 0.055);
    return [A, B, R1, R0];
  };

  const gableY = (x0, x1, y0, y1, z0, rh, colFrontEnd, colRightSlope, colRidge, nCourses = 0) => {
    const xm = (x0 + x1) * 0.5;
    const zTop = z0 + rh;
    const A = I(x1, y1, z0), B = I(x1, y0, z0), R1 = I(xm, y0, zTop), R0 = I(xm, y1, zTop);
    poly([I(x0, y1, z0), I(x1, y1, z0), I(xm, y1, zTop)], colFrontEnd);
    poly([A, B, R1, R0], colRightSlope);
    if (nCourses > 0) {
      for (let k = 1; k <= nCourses; k++) {
        const t = k / (nCourses + 1);
        const L = [A[0] + (R0[0] - A[0]) * t, A[1] + (R0[1] - A[1]) * t];
        const Rr = [B[0] + (R1[0] - B[0]) * t, B[1] + (R1[1] - B[1]) * t];
        ln(L, Rr, 'rgba(0, 0, 0, 0.26)', u * 0.045);
      }
    }
    ln(R0, R1, colRidge || shade(colRightSlope, 0.28), u * 0.055);
    return [A, B, R1, R0];
  };

  const drawAlpinePine = (X, Y, Z, sc = 1) => {
    const pb = I(X, Y, Z);
    const h = u * 1.95 * sc;
    ell(pb[0] + u * 0.16 * sc, pb[1] + u * 0.05 * sc, u * 0.52 * sc, u * 0.20 * sc, 'rgba(12, 24, 14, 0.28)');
    ln(pb, [pb[0], pb[1] - h * 0.28], '#4a3320', u * 0.16 * sc);
    const tiers = 4;
    for (let l = 0; l < tiers; l++) {
      const f = l / (tiers - 1);
      const by = pb[1] - h * (0.18 + f * 0.62);
      const bw = u * (0.62 - f * 0.34) * sc;
      const tip = by - h * 0.34;
      poly([[pb[0] - bw, by], [pb[0], tip], [pb[0] + bw, by]], l % 2 ? '#295734' : '#376e43');
      poly([[pb[0], tip], [pb[0] + bw, by], [pb[0] + bw * 0.25, by + h * 0.04]], 'rgba(8, 22, 12, 0.34)');
    }
  };

  return { flip, u, cyB, I, poly, ln, ell, clipPoly, wallPlane, softFog, box, cylZ, coneZ, gableX, gableY, drawAlpinePine };
}

/* ============================================================================
   1. NORDIC WEENIE: GREAT NORWEGIAN STAVE CHURCH OF BORGUND
      Full Wrap-Around Tarred Shingles, Hand-Drawn Cushion Moss & Drakkar Prows
   ============================================================================ */
function drawWeenieNordicStaveChurch(ctx, cx, cy, R, opts = {}) {
  const g = makeWeenieContext(ctx, cx, cy, R, Object.assign({ oy: R * 0.14 }, opts));
  const { u, I, poly, ln, ell, clipPoly, box, gableX, gableY } = g;

  ctx.save();
  if (g.flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  // Ground ambient shadow & dry-stone foundation plinth
  poly([I(3.4, -3.5, 0), I(6.1, -0.3, 0), I(4.8, 3.8, 0), I(0.8, 4.1, 0)], 'rgba(10, 18, 14, 0.34)');
  box(-3.28, 3.28, -3.68, 3.68, 0, 0.42, '#9aa3ac', '#68717a', '#bac2ca');

  // Rich tarred-pine timber & dark slate-shingle palette
  const woodLit   = '#7c4c27';
  const woodMain  = '#5c361a';
  const woodDark  = '#3b200d';
  const woodDeep  = '#241205';
  const roofLit   = '#333b48';
  const roofMain  = '#232933';
  const roofDark  = '#151921';
  const goldTrim  = '#d97706';
  const goldBright = '#facc15';

  // Helper: Paint weathered vertical stave planks, wood grain, sill beams & timber pegs
  const paintWeatheredStaves = (quadPts, cols, isDarkSide = false, seed = 101) => {
    const rnd = mulberry(seed);
    clipPoly(quadPts, () => {
      const [A, B, C2, D] = quadPts;
      // Alternating plank tone variation + vertical wood-grain streaks
      for (let c = 0; c < cols; c++) {
        const t0 = c / cols;
        const t1 = (c + 1) / cols;
        const p0 = [A[0] + (B[0] - A[0]) * t0, A[1] + (B[1] - A[1]) * t0];
        const p1 = [A[0] + (B[0] - A[0]) * t1, A[1] + (B[1] - A[1]) * t1];
        const p2 = [D[0] + (C2[0] - D[0]) * t1, D[1] + (C2[1] - D[1]) * t1];
        const p3 = [D[0] + (C2[0] - D[0]) * t0, D[1] + (C2[1] - D[1]) * t0];

        if (rnd() > 0.45) {
          poly([p0, p1, p2, p3], isDarkSide ? 'rgba(10, 4, 1, 0.22)' : 'rgba(255, 205, 145, 0.08)');
        }
        // Plank joint groove & sunlit edge highlight
        ln(p0, p3, 'rgba(12, 5, 1, 0.56)', u * 0.036);
        if (!isDarkSide) {
          ln([p0[0] + u * 0.03, p0[1]], [p3[0] + u * 0.03, p3[1]], 'rgba(255, 210, 150, 0.14)', u * 0.024);
        }
      }
      // Horizontal mortised timber sill beams & dowel pegs
      [0.14, 0.88].forEach(ht => {
        const L = [A[0] + (D[0] - A[0]) * ht, A[1] + (D[1] - A[1]) * ht];
        const Rr = [B[0] + (C2[0] - B[0]) * ht, B[1] + (C2[1] - B[1]) * ht];
        ln(L, Rr, isDarkSide ? '#1c0d04' : '#3a1e0b', u * 0.075);
        for (let c = 1; c < cols; c++) {
          const f = c / cols;
          ell(L[0] + (Rr[0] - L[0]) * f, L[1] + (Rr[1] - L[1]) * f, u * 0.022, u * 0.022, isDarkSide ? '#5c361a' : '#9c6234');
        }
      });
    });
  };

  // Helper: Paint overlapping diamond/scalloped tarred shingles + hand-drawn cushion moss colonies
  const paintShingledRoofWithMoss = (quadPts, rows, cols, mossColonies = [], isDarkSlope = false, seed = 77) => {
    const rnd = mulberry(seed);
    const [A, B, C2, D] = quadPts;
    const R0 = D, R1 = C2;

    clipPoly(quadPts, () => {
      // Subtle top-to-bottom weathered tar gradient
      const topY = Math.min(R0[1], R1[1]);
      const botY = Math.max(A[1], B[1]);
      const rGrad = ctx.createLinearGradient(0, topY, 0, botY);
      rGrad.addColorStop(0.0, isDarkSlope ? 'rgba(60, 72, 92, 0.22)' : 'rgba(110, 128, 156, 0.24)');
      rGrad.addColorStop(1.0, 'rgba(6, 9, 14, 0.34)');
      poly(quadPts, rGrad);

      // Overlapping horizontal shingle courses with individual staggered vertical tabs
      for (let r = 1; r <= rows; r++) {
        const t = r / (rows + 1);
        const L = [A[0] + (R0[0] - A[0]) * t, A[1] + (R0[1] - A[1]) * t];
        const Rr = [B[0] + (R1[0] - B[0]) * t, B[1] + (R1[1] - B[1]) * t];
        // Shingle course shadow & sunlit highlight edge
        ln(L, Rr, 'rgba(5, 8, 13, 0.58)', u * 0.042);
        ln([L[0], L[1] - u * 0.032], [Rr[0], Rr[1] - u * 0.032],
          isDarkSlope ? 'rgba(148, 163, 184, 0.12)' : 'rgba(203, 213, 225, 0.20)', u * 0.024);

        const tPrev = (r - 1) / (rows + 1);
        const Lp = [A[0] + (R0[0] - A[0]) * tPrev, A[1] + (R0[1] - A[1]) * tPrev];
        const Rp = [B[0] + (R1[0] - B[0]) * tPrev, B[1] + (R1[1] - B[1]) * tPrev];

        for (let c = 0; c < cols; c++) {
          const s = (c + (r % 2) * 0.5) / cols;
          if (s <= 0.02 || s >= 0.98) continue;
          const pTop = [L[0] + (Rr[0] - L[0]) * s, L[1] + (Rr[1] - L[1]) * s];
          const pBot = [Lp[0] + (Rp[0] - Lp[0]) * s, Lp[1] + (Rp[1] - Lp[1]) * s];
          ln(pTop, pBot, 'rgba(5, 8, 13, 0.45)', u * 0.026);
        }
      }

      // Organic Seam-Hugging Cushion Moss & Creeping Lichen Colonies (Hand-drawn scalloped lobes, upright fronds & seam tendrils)
      mossColonies.forEach(([s0, t0, spreadW, spreadH]) => {
        const cxM = A[0] + (B[0] - A[0]) * s0 + (R0[0] - A[0]) * t0;
        const cyM = A[1] + (B[1] - A[1]) * s0 + (R0[1] - A[1]) * t0;
        const ang = isDarkSlope ? 0.36 : -0.36;
        const cosA = Math.cos(ang), sinA = Math.sin(ang);

        // Helper to transform local seam-aligned coordinates (lx along shingle course, ly up/down slope) into screen space
        const toRoofPt = (lx, ly) => [
          cxM + cosA * lx - sinA * ly,
          cyM + sinA * lx + cosA * ly
        ];

        // Helper to trace an organic bezier-scalloped moss cushion silhouette
        const traceScallopedCushion = (ox, oy, rx, ry, lobes, seedOff) => {
          const pts = [];
          for (let i = 0; i < lobes; i++) {
            const a = (i / lobes) * Math.PI * 2;
            const jitter = 0.76 + 0.38 * Math.sin(i * 2.7 + seedOff) * Math.cos(i * 1.9 - seedOff);
            pts.push(toRoofPt(ox + Math.cos(a) * rx * jitter, oy + Math.sin(a) * ry * jitter));
          }
          ctx.beginPath();
          for (let i = 0; i < lobes; i++) {
            const p0 = pts[i];
            const p1 = pts[(i + 1) % lobes];
            const pMid = [(p0[0] + p1[0]) * 0.5, (p0[1] + p1[1]) * 0.5];
            // Outward scalloped bulge between vertices
            const nx = -(p1[1] - p0[1]) * 0.24;
            const ny = (p1[0] - p0[0]) * 0.24;
            if (i === 0) ctx.moveTo(p0[0], p0[1]);
            ctx.quadraticCurveTo(pMid[0] + nx, pMid[1] + ny, p1[0], p1[1]);
          }
          ctx.closePath();
        };

        // 1. Damp, dark-stained shingle rot halo & creeping seam tendrils underneath
        ctx.fillStyle = 'rgba(7, 11, 7, 0.48)';
        traceScallopedCushion(0, u * 0.03, spreadW * u * 0.68, spreadH * u * 0.66, 10, 1.1);
        ctx.fill();

        // Creeping lichen/moss fingers sneaking left & right along the horizontal shingle overlap seam
        [-1, 1].forEach(dir => {
          const nFingers = 3;
          for (let f = 0; f < nFingers; f++) {
            const startX = dir * spreadW * u * (0.38 + f * 0.12);
            const startY = (f - 1) * spreadH * u * 0.22;
            const reach = dir * spreadW * u * (0.28 + rnd() * 0.26);
            const pStart = toRoofPt(startX, startY);
            const pMid = toRoofPt(startX + reach * 0.55, startY + (rnd() - 0.5) * u * 0.08);
            const pTip = toRoofPt(startX + reach, startY + (rnd() - 0.5) * u * 0.10);

            ln(pStart, pMid, '#263a18', u * 0.075);
            ln(pMid, pTip, '#3d5c26', u * 0.048);
            ell(pTip[0], pTip[1], u * 0.042, u * 0.028, '#557d34', ang);
          }
        });

        // 2. Main multi-lobed cushion moss body (3 overlapping organic cushions per colony)
        const subLobes = [
          [-spreadW * 0.24,  spreadH * 0.06, spreadW * 0.36, spreadH * 0.38, 2.3],
          [ spreadW * 0.22, -spreadH * 0.05, spreadW * 0.34, spreadH * 0.35, 4.1],
          [ 0.0,             0.0,            spreadW * 0.48, spreadH * 0.46, 0.7]
        ];

        subLobes.forEach(([ox, oy, rx, ry, sOff]) => {
          // Deep shadow-olive cushion base
          ctx.fillStyle = '#263a18';
          traceScallopedCushion(ox * u, (oy + 0.025) * u, rx * u, ry * u, 9, sOff);
          ctx.fill();

          // Mid-tone emerald/forest cushion dome
          ctx.fillStyle = isDarkSlope ? '#365222' : '#3d5c26';
          traceScallopedCushion(ox * u, oy * u, rx * u * 0.90, ry * u * 0.88, 9, sOff + 0.4);
          ctx.fill();

          // Directional top-left sunlit velvety moss highlight pillow
          ctx.fillStyle = isDarkSlope ? '#496e2e' : '#537a34';
          traceScallopedCushion((ox - 0.04) * u, (oy - 0.03) * u, rx * u * 0.62, ry * u * 0.58, 7, sOff + 0.9);
          ctx.fill();
        });

        // 3. Hand-drawn upright velvety moss shoots/fronds & tiny chartreuse spore-capsule tips
        const nFronds = 16;
        for (let fr = 0; fr < nFronds; fr++) {
          const fx = (rnd() - 0.52) * spreadW * u * 0.86;
          const fy = (rnd() - 0.55) * spreadH * u * 0.78;
          const pBase = toRoofPt(fx, fy);
          const shootH = u * (0.065 + rnd() * 0.065);
          const lean = (rnd() - 0.45) * u * 0.04;
          const pTop = [pBase[0] + lean, pBase[1] - shootH];

          ln(pBase, pTop, fr % 2 === 0 ? '#5c873a' : '#466b2b', u * 0.026);
          if (fr % 3 === 0) {
            ell(pTop[0], pTop[1], u * 0.022, u * 0.018, isDarkSlope ? '#6e9c46' : '#84b354');
          }
        }
      });
    });

    // Scalloped wooden eave trim along the bottom drip edge A -> B
    const nScallops = Math.max(4, cols);
    for (let k = 0; k < nScallops; k++) {
      const t0 = k / nScallops;
      const t1 = (k + 1) / nScallops;
      const p0 = [A[0] + (B[0] - A[0]) * t0, A[1] + (B[1] - A[1]) * t0];
      const p1 = [A[0] + (B[0] - A[0]) * t1, A[1] + (B[1] - A[1]) * t1];
      const pm = [(p0[0] + p1[0]) * 0.5, (p0[1] + p1[1]) * 0.5 + u * 0.09];
      poly([p0, p1, pm], isDarkSlope ? woodDark : woodMain);
    }
  };

  // Sculpted S-Curved Viking Drakkar Dragon-Head Gable Prow (Carved Oak & Gilded Bronze)
  const drawDragonProw = (X, Y, Z, dirX, dirY) => {
    const p0 = I(X, Y, Z);
    const s = u * 0.82;
    ctx.save();
    ctx.translate(p0[0], p0[1]);
    // Orient cleanly outward from left (-1) or right (+1) gable apex with slight isometric pitch
    ctx.scale(dirX, 1);
    ctx.rotate(dirY * 0.14);

    // 1. Sculpted S-curved swept wooden neck & roaring dragon head silhouette
    const traceDragonBody = () => {
      ctx.beginPath();
      // Neck root anchored to gable ridge
      ctx.moveTo(-0.14 * s, 0.22 * s);
      // Sweeping S-curve throat up to lower jaw
      ctx.bezierCurveTo(0.18 * s, 0.16 * s, 0.24 * s, -0.26 * s, 0.54 * s, -0.44 * s);
      // Lower jaw & curled chin beard
      ctx.lineTo(0.84 * s, -0.34 * s);
      ctx.quadraticCurveTo(0.76 * s, -0.24 * s, 0.62 * s, -0.32 * s);
      // Open roaring mouth cavity
      ctx.lineTo(0.54 * s, -0.42 * s);
      ctx.lineTo(0.72 * s, -0.48 * s);
      // Upper snout with Viking scrolled nose curl
      ctx.lineTo(0.92 * s, -0.48 * s);
      ctx.bezierCurveTo(0.98 * s, -0.58 * s, 0.84 * s, -0.66 * s, 0.74 * s, -0.56 * s);
      // Forehead brow & swept-back Viking horn/crest ear
      ctx.lineTo(0.58 * s, -0.58 * s);
      ctx.quadraticCurveTo(0.42 * s, -0.82 * s, 0.24 * s, -0.86 * s);
      ctx.quadraticCurveTo(0.36 * s, -0.68 * s, 0.42 * s, -0.56 * s);
      // Notched dorsal neck mane fin curving back down to the gable
      ctx.bezierCurveTo(0.14 * s, -0.46 * s, 0.04 * s, -0.10 * s, -0.22 * s, 0.04 * s);
      ctx.closePath();
    };

    // Deep dark-oak drop shadow & carved outline
    ctx.save();
    ctx.translate(0.03 * s, 0.04 * s);
    traceDragonBody();
    ctx.fillStyle = '#140903';
    ctx.fill();
    ctx.restore();

    // Rich oiled-oak to gilded-bronze directional shading across the dragon sculpture
    const dGrad = ctx.createLinearGradient(-0.1 * s, 0.2 * s, 0.85 * s, -0.75 * s);
    dGrad.addColorStop(0.00, '#3a2210');
    dGrad.addColorStop(0.45, '#6b4322');
    dGrad.addColorStop(0.82, '#b8832c');
    dGrad.addColorStop(1.00, '#e5b84b');
    traceDragonBody();
    ctx.fillStyle = dGrad;
    ctx.fill();
    ctx.strokeStyle = '#241206';
    ctx.lineWidth = 0.045 * s;
    ctx.stroke();

    // 2. Notched dorsal mane spines along the back of the neck
    [
      [0.24, -0.50, 0.14, -0.62],
      [0.14, -0.36, 0.02, -0.46],
      [0.04, -0.20, -0.08, -0.28]
    ].forEach(([nx0, ny0, nx1, ny1]) => {
      ln([nx0 * s, ny0 * s], [nx1 * s, ny1 * s], '#c8963e', 0.042 * s);
    });

    // 3. Carved Urnes S-scroll & scale relief lines along the neck & cheek
    ctx.strokeStyle = '#e5b84b';
    ctx.lineWidth = 0.034 * s;
    ctx.beginPath();
    ctx.moveTo(-0.04 * s, 0.08 * s);
    ctx.bezierCurveTo(0.18 * s, -0.02 * s, 0.24 * s, -0.32 * s, 0.48 * s, -0.46 * s);
    ctx.stroke();

    // 4. Tiny ivory/gold fangs inside the open dragon jaws + gleaming eye
    poly([[0.74 * s, -0.48 * s], [0.79 * s, -0.48 * s], [0.76 * s, -0.41 * s]], '#fef3c7');
    poly([[0.72 * s, -0.35 * s], [0.77 * s, -0.35 * s], [0.75 * s, -0.41 * s]], '#fef3c7');
    ell(0.62 * s, -0.51 * s, 0.042 * s, 0.032 * s, '#fef08a', -0.2);

    ctx.restore();
  };

  const drawCrossFinial = (X, Y, Z, sc = 1) => {
    const p0 = I(X, Y, Z);
    const p1 = [p0[0], p0[1] - u * 0.72 * sc];
    ln(p0, p1, '#92400e', u * 0.10 * sc);
    ln(p0, p1, goldTrim, u * 0.065 * sc);
    ln([p1[0] - u * 0.26 * sc, p1[1] + u * 0.22 * sc], [p1[0] + u * 0.26 * sc, p1[1] + u * 0.22 * sc], goldBright, u * 0.065 * sc);
  };

  // =========================================================================
  // 1. REAR ROUNDED APSE TURRET (-Y end, fully shingled conical roof!)
  // =========================================================================
  box(-1.18, 1.18, -3.65, -2.0, 0.42, 3.80, woodMain, woodDark, woodLit);
  paintWeatheredStaves([I(-1.18, -3.65, 0.42), I(1.18, -3.65, 0.42), I(1.18, -3.65, 3.80), I(-1.18, -3.65, 3.80)], 6, false, 11);
  paintWeatheredStaves([I(1.18, -3.65, 0.42), I(1.18, -2.0, 0.42), I(1.18, -2.0, 3.80), I(1.18, -3.65, 3.80)], 5, true, 12);

  // Full hipped/pyramidal dark tarred-shingle roof over the rear apse (all visible faces shingled!)
  const pApseApex = I(0, -2.85, 5.42);
  const apseBackL = [I(-1.34, -3.82, 3.80), I(-1.34, -2.0, 3.80), pApseApex, pApseApex];
  const apseBackR = [I(1.34, -3.82, 3.80), I(1.34, -2.0, 3.80), pApseApex, pApseApex];
  const apseBackEnd = [I(-1.34, -3.82, 3.80), I(1.34, -3.82, 3.80), pApseApex, pApseApex];
  poly([I(-1.34, -3.82, 3.80), I(-1.34, -2.0, 3.80), pApseApex], roofLit);
  poly([I(-1.34, -3.82, 3.80), I(1.34, -3.82, 3.80), pApseApex], roofMain);
  poly([I(1.34, -3.82, 3.80), I(1.34, -2.0, 3.80), pApseApex], roofDark);
  paintShingledRoofWithMoss(apseBackL, 4, 5, [[0.45, 0.42, 0.35, 0.16]], false, 21);
  paintShingledRoofWithMoss(apseBackR, 4, 5, [[0.50, 0.38, 0.32, 0.15]], true, 22);
  drawCrossFinial(0, -2.85, 5.42, 0.92);

  // =========================================================================
  // 2. TIER 1: OUTER AMBULATORY GALLERY (SVALGANG) & COMPLETE HIPPED SHINGLE SKIRT
  //    (Fixes the exposed brown triangle on the right: ALL slopes are now dark
  //     tarred shingles with scalloped eaves and seam-hugging moss!)
  // =========================================================================
  box(-3.00, 3.00, -3.40, 3.40, 0.42, 1.85, woodMain, woodDark, woodLit);
  paintWeatheredStaves([I(-3.00, 3.40, 0.42), I(3.00, 3.40, 0.42), I(3.00, 3.40, 1.85), I(-3.00, 3.40, 1.85)], 14, false, 31);
  paintWeatheredStaves([I(3.00, -3.40, 0.42), I(3.00, 3.40, 0.42), I(3.00, 3.40, 1.85), I(3.00, -3.40, 1.85)], 15, true, 32);

  // Open Svalgang colonnade arcades on front (+Y) and right (+X) gallery walls
  for (let gx = -2.45; gx <= 2.45; gx += 0.82) {
    if (Math.abs(gx) < 0.85) continue;
    poly([I(gx - 0.26, 3.41, 0.68), I(gx + 0.26, 3.41, 0.68), I(gx + 0.26, 3.41, 1.38), I(gx, 3.41, 1.56), I(gx - 0.26, 3.41, 1.38)], '#160c05');
    // Turned wooden colonnette shafts
    ln(I(gx - 0.27, 3.41, 0.68), I(gx - 0.27, 3.41, 1.38), woodLit, u * 0.045);
    ln(I(gx + 0.27, 3.41, 0.68), I(gx + 0.27, 3.41, 1.38), woodLit, u * 0.045);
  }
  for (let gy = -2.75; gy <= 2.75; gy += 0.88) {
    poly([I(3.01, gy - 0.26, 0.68), I(3.01, gy + 0.26, 0.68), I(3.01, gy + 0.26, 1.38), I(3.01, gy, 1.56), I(3.01, gy - 0.26, 1.38)], '#100803');
    ln(I(3.01, gy - 0.27, 0.68), I(3.01, gy - 0.27, 1.38), woodMain, u * 0.042);
  }

  // Full 4-sided hipped ambulatory shingle roof skirt (z = 1.85 .. 3.18)
  // Front-left slope (+Y), Right-hand slope (+X), and Back-left slope (-X) all fully shingled!
  const ambEaveFL = I(-3.26, 3.66, 1.85);
  const ambEaveFR = I(3.26, 3.66, 1.85);
  const ambEaveBR = I(3.26, -3.66, 1.85);
  const ambEaveBL = I(-3.26, -3.66, 1.85);
  const ambTopFL  = I(-2.08, 2.38, 3.18);
  const ambTopFR  = I(2.08, 2.38, 3.18);
  const ambTopBR  = I(2.08, -2.38, 3.18);
  const ambTopBL  = I(-2.08, -2.38, 3.18);

  const ambFrontQuad = [ambEaveFL, ambEaveFR, ambTopFR, ambTopFL];
  const ambRightQuad = [ambEaveFR, ambEaveBR, ambTopBR, ambTopFR];
  const ambLeftQuad  = [ambEaveBL, ambEaveFL, ambTopFL, ambTopBL];

  poly(ambLeftQuad, roofLit);
  poly(ambFrontQuad, roofMain);
  poly(ambRightQuad, roofDark);

  paintShingledRoofWithMoss(ambLeftQuad, 5, 12, [[0.35, 0.45, 0.55, 0.22]], false, 40);
  paintShingledRoofWithMoss(ambFrontQuad, 5, 14, [[0.20, 0.42, 0.68, 0.24], [0.78, 0.36, 0.58, 0.20]], false, 41);
  paintShingledRoofWithMoss(ambRightQuad, 5, 14, [[0.28, 0.48, 0.65, 0.24], [0.72, 0.35, 0.55, 0.20]], true, 42);

  // Hip ridge timber caps
  ln(ambEaveFR, ambTopFR, woodLit, u * 0.055);
  ln(ambEaveFL, ambTopFL, woodLit, u * 0.055);
  ln(ambEaveBR, ambTopBR, woodDark, u * 0.05);

  // =========================================================================
  // 3. TIER 2: MAIN RAISED STAVE NAVE & SECOND SHINGLE ROOF (z = 2.85 .. 5.75)
  // =========================================================================
  box(-2.12, 2.12, -2.42, 2.42, 2.85, 4.28, woodMain, woodDark, woodLit);
  paintWeatheredStaves([I(-2.12, 2.42, 2.85), I(2.12, 2.42, 2.85), I(2.12, 2.42, 4.28), I(-2.12, 2.42, 4.28)], 11, false, 51);
  paintWeatheredStaves([I(2.12, -2.42, 2.85), I(2.12, 2.42, 2.85), I(2.12, 2.42, 4.28), I(2.12, -2.42, 4.28)], 12, true, 52);

  // Glowing amber clerestory roundels & St. Andrew's X-bracing
  [-1.28, 0, 1.28].forEach(wx => {
    const wp = I(wx, 2.43, 3.60);
    ell(wp[0], wp[1], u * 0.14, u * 0.16, '#f59e0b', 0, woodDeep, u * 0.032);
    ell(wp[0] - u * 0.03, wp[1] - u * 0.03, u * 0.06, u * 0.07, '#fef08a');
  });

  // Tier 2 Gable Roof (Shingled front slope + textured timber right gable wall with Urnes trim)
  const q2 = gableX(-2.32, 2.32, -2.62, 2.62, 4.28, 1.50, roofMain, woodDark, roofLit, 0);
  paintShingledRoofWithMoss(q2, 5, 11, [[0.26, 0.50, 0.56, 0.22], [0.72, 0.34, 0.50, 0.19]], false, 53);

  // Detailed right gable end wall: vertical stave boards, cross-brace & Urnes bargeboards
  const g2Tri = [I(2.32, -2.62, 4.28), I(2.32, 2.62, 4.28), I(2.32, 0, 5.78)];
  clipPoly(g2Tri, () => {
    for (let gy = -2.4; gy <= 2.4; gy += 0.42) {
      ln(I(2.32, gy, 4.28), I(2.32, gy, 5.78), 'rgba(14, 6, 2, 0.45)', u * 0.034);
    }
    ln(I(2.32, -2.62, 4.28), I(2.32, 2.62, 4.28), woodLit, u * 0.07);
    ln(I(2.32, 0, 4.28), I(2.32, 0, 5.78), woodLit, u * 0.065);
  });
  ln(I(2.32, 2.62, 4.28), I(2.32, 0, 5.78), woodLit, u * 0.065);
  ln(I(2.32, -2.62, 4.28), I(2.32, 0, 5.78), woodLit, u * 0.065);
  drawDragonProw(-2.32, 0, 5.78, -1, -0.35);
  drawDragonProw(2.32, 0, 5.78, 1, 0.35);

  // =========================================================================
  // 4. TIER 3: UPPER CLERESTORY NAVE & THIRD SHINGLE ROOF (z = 5.30 .. 7.62)
  // =========================================================================
  box(-1.42, 1.42, -1.62, 1.62, 5.30, 6.32, woodMain, woodDark, woodLit);
  paintWeatheredStaves([I(-1.42, 1.62, 5.30), I(1.42, 1.62, 5.30), I(1.42, 1.62, 6.32), I(-1.42, 1.62, 6.32)], 8, false, 61);
  paintWeatheredStaves([I(1.42, -1.62, 5.30), I(1.42, 1.62, 5.30), I(1.42, 1.62, 6.32), I(1.42, -1.62, 6.32)], 8, true, 62);

  const q3 = gableX(-1.58, 1.58, -1.78, 1.78, 6.32, 1.34, roofMain, woodDark, roofLit, 0);
  paintShingledRoofWithMoss(q3, 4, 8, [[0.46, 0.44, 0.48, 0.18]], false, 63);
  ln(I(1.58, 0, 6.32), I(1.58, 0, 7.66), woodLit, u * 0.055);
  ln(I(1.58, 1.78, 6.32), I(1.58, 0, 7.66), woodLit, u * 0.055);
  ln(I(1.58, -1.78, 6.32), I(1.58, 0, 7.66), woodLit, u * 0.055);
  drawDragonProw(-1.58, 0, 7.66, -1, -0.35);
  drawDragonProw(1.58, 0, 7.66, 1, 0.35);

  // =========================================================================
  // 5. TIER 4 & 5: CENTRAL CROSSING FLECHE TOWER (TAKRYTTER, z = 7.25 .. 10.35)
  // =========================================================================
  box(-0.72, 0.72, -0.72, 0.72, 7.25, 8.20, woodLit, woodDark, woodLit);
  paintWeatheredStaves([I(-0.72, 0.72, 7.25), I(0.72, 0.72, 7.25), I(0.72, 0.72, 8.20), I(-0.72, 0.72, 8.20)], 4, false, 71);
  paintWeatheredStaves([I(0.72, -0.72, 7.25), I(0.72, 0.72, 7.25), I(0.72, 0.72, 8.20), I(0.72, -0.72, 8.20)], 4, true, 72);

  const pT4 = I(0, 0, 9.12);
  const t4Front = [I(-0.88, 0.88, 8.20), I(0.88, 0.88, 8.20), pT4, pT4];
  const t4Right = [I(0.88, -0.88, 8.20), I(0.88, 0.88, 8.20), pT4, pT4];
  poly([I(-0.88, 0.88, 8.20), I(0.88, 0.88, 8.20), pT4], roofMain);
  poly([I(0.88, -0.88, 8.20), I(0.88, 0.88, 8.20), pT4], roofDark);
  paintShingledRoofWithMoss(t4Front, 3, 5, [[0.35, 0.45, 0.25, 0.11]], false, 73);
  paintShingledRoofWithMoss(t4Right, 3, 5, [], true, 74);

  box(-0.40, 0.40, -0.40, 0.40, 8.80, 9.42, woodMain, woodDark, woodLit);
  const pSpire = I(0, 0, 10.38);
  const spFront = [I(-0.50, 0.50, 9.42), I(0.50, 0.50, 9.42), pSpire, pSpire];
  poly([I(-0.50, 0.50, 9.42), I(0.50, 0.50, 9.42), pSpire], roofLit);
  poly([I(0.50, -0.50, 9.42), I(0.50, 0.50, 9.42), pSpire], roofDark);
  paintShingledRoofWithMoss(spFront, 3, 4, [], false, 75);
  drawCrossFinial(0, 0, 10.38, 0.98);

  // =========================================================================
  // 6. PROJECTING FRONT URNES CARVED PORTAL PORCH (+Y face, z = 0.42 .. 3.60)
  // =========================================================================
  box(-0.96, 0.96, 2.95, 3.98, 0.42, 2.25, woodLit, woodDark, woodLit);
  paintWeatheredStaves([I(-0.96, 3.98, 0.42), I(0.96, 3.98, 0.42), I(0.96, 3.98, 2.25), I(-0.96, 3.98, 2.25)], 6, false, 81);
  paintWeatheredStaves([I(0.96, 2.95, 0.42), I(0.96, 3.98, 0.42), I(0.96, 3.98, 2.25), I(0.96, 2.95, 2.25)], 4, true, 82);

  // Ornate Urnes carved gold portal arch surround & recessed dark doorway
  poly([I(-0.56, 3.99, 0.42), I(0.56, 3.99, 0.42), I(0.56, 3.99, 1.54), I(0, 3.99, 1.90), I(-0.56, 3.99, 1.54)], goldTrim);
  poly([I(-0.38, 4.00, 0.42), I(0.38, 4.00, 0.42), I(0.38, 4.00, 1.46), I(0, 4.00, 1.74), I(-0.38, 4.00, 1.46)], '#1a0e05');
  // Carved Urnes interlace dots along the portal jambs
  [0.65, 0.98, 1.30].forEach(pz => {
    ell(...I(-0.47, 4.00, pz), u * 0.032, u * 0.04, goldBright);
    ell(...I(0.47, 4.00, pz), u * 0.032, u * 0.04, goldBright);
  });

  // Porch gable roof (with shingled right slope + carved bargeboard on front gable)
  const qPorch = gableY(-1.10, 1.10, 2.90, 4.18, 2.25, 1.30, woodLit, roofMain, roofLit, 0);
  paintShingledRoofWithMoss(qPorch, 4, 6, [[0.52, 0.44, 0.34, 0.14]], true, 83);
  ln(I(-1.10, 4.18, 2.25), I(0, 4.18, 3.55), goldTrim, u * 0.055);
  ln(I(1.10, 4.18, 2.25), I(0, 4.18, 3.55), goldTrim, u * 0.055);
  drawDragonProw(0, 4.18, 3.55, -0.65, 0.65);

  // Stone threshold steps
  box(-0.82, 0.82, 3.98, 4.48, 0, 0.22, '#9aa3ac', '#68717a', '#bac2ca');

  ctx.restore();
}

/* ============================================================================
   2. GOTHIC WEENIE: RUINED & SPOOKY TWIN-SPIRE CATHEDRAL
   ============================================================================ */
function drawWeenieGothicCathedral(ctx, cx, cy, R, opts = {}) {
  const g = makeWeenieContext(ctx, cx, cy, R, Object.assign({ oy: R * 0.15 }, opts));
  const { u, I, poly, ln, ell, clipPoly, wallPlane, softFog, box, gableX, gableY } = g;

  ctx.save();
  if (g.flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  softFog(...I(-3.8, -2.5, 0.2), u * 2.8, u * 0.95, '145, 165, 198', 0.28);
  softFog(...I(3.6, -3.2, 0.2), u * 2.6, u * 0.85, '145, 165, 198', 0.26);
  poly([I(3.6, -4.4, 0), I(6.8, -0.8, 0), I(5.4, 4.5, 0), I(0.8, 4.9, 0)], 'rgba(4, 6, 14, 0.48)');

  const stFront = '#565463';
  const stRight = '#383642';
  const stTop   = '#757385';
  const stDark  = '#1b1922';
  const slFront = '#181b24';
  const slRight = '#0e1017';
  const ivyDark = '#1b3820';
  const ivyMid  = '#295230';
  const ivyLit  = '#3b7044';

  const paintAshlarWeathering = (quadPts, rows, cols, cracks = [], seed = 17) => {
    const rnd = mulberry(seed);
    clipPoly(quadPts, () => {
      const [A, B, C2, D] = quadPts;
      for (let m = 0; m < 14; m++) {
        const sx = rnd(), sy = rnd();
        const px = A[0] + (B[0] - A[0]) * sx + (D[0] - A[0]) * sy;
        const py = A[1] + (B[1] - A[1]) * sx + (D[1] - A[1]) * sy;
        ell(px, py, u * (0.28 + rnd() * 0.45), u * (0.16 + rnd() * 0.28),
          m % 3 === 0 ? 'rgba(22, 42, 26, 0.28)' : 'rgba(10, 10, 16, 0.24)', rnd() * 3.14);
      }
      for (let r = 1; r < rows; r++) {
        const t = r / rows;
        const L = [A[0] + (D[0] - A[0]) * t, A[1] + (D[1] - A[1]) * t];
        const Rr = [B[0] + (C2[0] - B[0]) * t, B[1] + (C2[1] - B[1]) * t];
        ln(L, Rr, 'rgba(10, 10, 16, 0.42)', u * 0.032);
        for (let c = 0; c < cols; c++) {
          const s = (c + (r % 2) * 0.5) / cols;
          const px = L[0] + (Rr[0] - L[0]) * s;
          const py = L[1] + (Rr[1] - L[1]) * s;
          ln([px, py], [px, py - (D[1] - A[1]) / rows], 'rgba(10, 10, 16, 0.34)', u * 0.028);
          if ((r * 7 + c * 13) % 11 === 0) {
            ell(px + u * 0.14, py - u * 0.12, u * 0.18, u * 0.10, 'rgba(8, 8, 14, 0.36)', 0.2);
          }
        }
      }
      cracks.forEach(pts => {
        ctx.strokeStyle = '#0e0c14';
        ctx.lineWidth = u * 0.048;
        ctx.beginPath();
        pts.forEach(([sx, sy], idx) => {
          const px = A[0] + (B[0] - A[0]) * sx + (D[0] - A[0]) * sy;
          const py = A[1] + (B[1] - A[1]) * sx + (D[1] - A[1]) * sy;
          idx === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        });
        ctx.stroke();
      });
    });
  };

  const drawWallIvy = (plane, fixedCoord, a0, a1, zBot, zTop, seed = 42) => {
    const rnd = mulberry(seed);
    ctx.save();
    if (plane === 'F') {
      wallPlane((a0 + a1) * 0.5, fixedCoord, zBot, 'F');
    } else {
      wallPlane(fixedCoord, (a0 + a1) * 0.5, zBot, 'R');
    }
    const span = Math.abs(a1 - a0);
    const height = zTop - zBot;
    const nStems = Math.max(3, Math.round(span * 3.2));

    for (let s = 0; s < nStems; s++) {
      let lx = (rnd() - 0.5) * span * 0.85;
      let lz = 0;
      const maxH = height * (0.45 + rnd() * 0.55);
      const steps = 10;

      ctx.strokeStyle = '#162b19';
      ctx.lineWidth = 0.045;
      ctx.beginPath();
      ctx.moveTo(lx, lz);
      for (let k = 1; k <= steps; k++) {
        lx += (rnd() - 0.5) * 0.24;
        lz = (k / steps) * maxH;
        ctx.lineTo(lx, lz);

        for (let lf = 0; lf < 3; lf++) {
          const ox = lx + (rnd() - 0.5) * 0.24;
          const oz = lz + (rnd() - 0.5) * 0.18;
          const rLeaf = 0.085 + rnd() * 0.075;
          ctx.fillStyle = (k + lf) % 3 === 0 ? ivyDark : ((k + lf) % 3 === 1 ? ivyMid : ivyLit);
          ctx.beginPath();
          ctx.ellipse(ox, oz, rLeaf, rLeaf * 0.72, rnd() * 3.14, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawDeadTree = (X, Y, sc = 1) => {
    const p0 = I(X, Y, 0);
    const p1 = [p0[0] - u * 0.12 * sc, p0[1] - u * 1.15 * sc];
    const p2 = [p1[0] + u * 0.18 * sc, p1[1] - u * 0.85 * sc];
    ln(p0, p1, '#1b1822', u * 0.18 * sc);
    ln(p1, p2, '#24202e', u * 0.11 * sc);
    ln(p1, [p1[0] - u * 0.65 * sc, p1[1] - u * 0.55 * sc], '#1b1822', u * 0.08 * sc);
    ln([p1[0] - u * 0.35 * sc, p1[1] - u * 0.30 * sc], [p1[0] - u * 0.45 * sc, p1[1] - u * 0.78 * sc], '#24202e', u * 0.05 * sc);
    ln(p2, [p2[0] + u * 0.58 * sc, p2[1] - u * 0.48 * sc], '#1b1822', u * 0.07 * sc);
    ln(p2, [p2[0] - u * 0.32 * sc, p2[1] - u * 0.55 * sc], '#24202e', u * 0.05 * sc);
  };

  box(-3.6, 3.6, -4.5, 4.4, 0, 0.35, '#3e424d', '#282b33', '#565b69');
  box(-2.4, 2.4, 4.4, 5.1, 0, 0.18, '#484d59', '#2f333d', '#626878');
  poly([I(1.75, 5.11, 0), I(2.41, 5.11, 0), I(2.41, 5.11, 0.18), I(2.05, 5.11, 0.18), I(1.90, 5.11, 0.08)], '#161821');

  box(-2.45, 2.45, -3.9, 2.1, 0.35, 3.25, stFront, stRight, slFront);
  paintAshlarWeathering([I(2.45, -3.9, 0.35), I(2.45, 2.1, 0.35), I(2.45, 2.1, 3.25), I(2.45, -3.9, 3.25)], 7, 11, [
    [[0.22, 0.92], [0.27, 0.62], [0.20, 0.32]],
    [[0.74, 0.88], [0.78, 0.52], [0.71, 0.28]]
  ], 101);
  drawWallIvy('R', 2.46, -3.6, -1.8, 0.35, 2.95, 11);
  drawWallIvy('R', 2.46, 0.2, 1.9, 0.35, 3.15, 12);

  [-3.0, -2.1, 0.95].forEach((wy, idx) => {
    poly([
      I(2.46, wy - 0.20, 1.05),
      I(2.46, wy + 0.20, 1.05),
      I(2.46, wy + 0.20, 2.25),
      I(2.46, wy, 2.58),
      I(2.46, wy - 0.20, 2.25)
    ], '#0b0a10');
    if (idx !== 1) {
      ln(I(2.47, wy, 1.05), I(2.47, wy, 1.85), stTop, u * 0.035);
    }
  });

  box(-1.45, 1.45, -4.1, 2.1, 0.35, 5.55, stFront, stRight, stTop);
  paintAshlarWeathering([I(1.45, -4.1, 0.35), I(1.45, 2.1, 0.35), I(1.45, 2.1, 5.55), I(1.45, -4.1, 5.55)], 10, 10, [
    [[0.45, 0.95], [0.49, 0.72], [0.43, 0.55]]
  ], 102);

  gableY(-1.55, 1.55, -4.2, 2.1, 5.55, 1.65, slFront, slRight, '#565463', 5);
  poly([
    I(1.48, -3.35, 5.65),
    I(1.48, -1.95, 5.65),
    I(0.45, -2.15, 6.75),
    I(0.08, -2.65, 7.18),
    I(0.72, -3.15, 6.50)
  ], '#09080e');
  [-3.05, -2.70, -2.35].forEach(ry => {
    ln(I(1.45, ry, 5.70), I(0.20, ry, 7.08), '#2e2218', u * 0.055);
  });

  poly([
    I(1.48, 0.25, 5.65),
    I(1.48, 1.15, 5.65),
    I(0.75, 0.95, 6.45),
    I(0.85, 0.45, 6.35)
  ], '#09080e');
  ln(I(1.45, 0.70, 5.70), I(0.80, 0.70, 6.40), '#2e2218', u * 0.05);

  box(1.45, 2.95, -1.55, -0.15, 0.35, 5.35, stFront, stRight, stTop);
  paintAshlarWeathering([I(2.95, -1.55, 0.35), I(2.95, -0.15, 0.35), I(2.95, -0.15, 5.35), I(2.95, -1.55, 5.35)], 9, 4, [
    [[0.38, 0.90], [0.48, 0.58], [0.40, 0.28]],
    [[0.70, 0.85], [0.64, 0.62]]
  ], 103);
  gableX(1.45, 3.05, -1.65, -0.05, 5.35, 1.45, slFront, stRight, '#565463', 4);
  poly([
    I(1.95, -0.05, 5.45),
    I(2.75, -0.05, 5.45),
    I(2.55, -0.65, 6.35),
    I(2.05, -0.55, 6.20)
  ], '#09080e');
  ln(I(2.35, -0.08, 5.48), I(2.35, -0.60, 6.28), '#2e2218', u * 0.048);

  drawWallIvy('R', 2.96, -1.45, -0.25, 0.35, 4.45, 13);
  drawWallIvy('F', -0.14, 1.65, 2.85, 0.35, 3.85, 14);

  ctx.save();
  wallPlane(2.97, -0.85, 3.95, 'R');
  ctx.fillStyle = '#0d0b1a';
  ctx.strokeStyle = stTop;
  ctx.lineWidth = 0.06;
  ctx.beginPath();
  ctx.arc(0, 0, 0.46, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#691515';
  ctx.beginPath();
  ctx.arc(0, 0, 0.28, 0.4, Math.PI * 1.65);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  [-3.45, -2.45, 0.55, 1.45].forEach((by, bIdx) => {
    const isCrumbled = (bIdx === 1);
    const pinTopZ = isCrumbled ? 4.55 : 5.10;
    box(2.15, 2.65, by - 0.17, by + 0.17, 0.35, 4.45, stFront, stRight, stTop);
    const pPin = I(2.40, by, pinTopZ);
    poly([I(2.15, by + 0.17, 4.45), I(2.65, by + 0.17, 4.45), pPin], stTop);
    poly([I(2.65, by - 0.17, 4.45), I(2.65, by + 0.17, 4.45), pPin], stRight);
    ln(I(2.25, by, 4.15), I(1.45, by, 4.95), stTop, u * 0.13);
    ln(I(2.25, by, 3.45), I(1.45, by, 4.25), stRight, u * 0.11);
  });

  const fX = 0, fY = -0.85, fZ0 = 7.15, fZ1 = 10.05;
  poly([I(fX - 0.26, fY + 0.26, fZ0), I(fX + 0.26, fY + 0.26, fZ0), I(fX + 0.10, fY, fZ1)], '#232733');
  poly([I(fX + 0.26, fY - 0.26, fZ0), I(fX + 0.26, fY + 0.26, fZ0), I(fX + 0.10, fY, fZ1)], '#12151c');
  ln(I(fX + 0.10, fY, fZ1), [I(fX + 0.10, fY, fZ1)[0] + u * 0.08, I(fX + 0.10, fY, fZ1)[1] - u * 0.48], '#8a8a96', u * 0.045);

  const westFrontQuad = [I(-2.65, 3.85, 0.35), I(2.65, 3.85, 0.35), I(2.65, 3.85, 6.15), I(-2.65, 3.85, 6.15)];
  box(-2.65, 2.65, 2.1, 3.85, 0.35, 6.15, stFront, stRight, stTop);
  paintAshlarWeathering(westFrontQuad, 12, 9, [
    [[0.16, 0.94], [0.22, 0.68], [0.15, 0.42]],
    [[0.84, 0.90], [0.77, 0.58], [0.86, 0.32]],
    [[0.52, 0.35], [0.47, 0.15]]
  ], 104);

  drawWallIvy('F', 3.87, -2.55, -1.25, 0.35, 5.45, 21);
  drawWallIvy('F', 3.87, 1.25, 2.55, 0.35, 5.95, 22);
  drawWallIvy('R', 2.67, 2.15, 3.80, 0.35, 5.85, 23);

  [-2.68, -1.05, 1.05, 2.68].forEach(bx => {
    box(bx - 0.22, bx + 0.22, 3.65, 4.05, 0.35, 6.25, stTop, stRight, '#868496');
  });

  [
    [0, 0.72, 2.35],
    [-1.85, 0.48, 1.95],
    [1.85, 0.48, 1.95]
  ].forEach(([px, pw, ph]) => {
    poly([
      I(px - pw - 0.14, 3.88, 0.35),
      I(px + pw + 0.14, 3.88, 0.35),
      I(px + pw + 0.14, 3.88, ph * 0.72),
      I(px, 3.88, ph + 0.48),
      I(px - pw - 0.14, 3.88, ph * 0.72)
    ], stTop);
    poly([
      I(px - pw, 3.90, 0.35),
      I(px + pw, 3.90, 0.35),
      I(px + pw, 3.90, ph * 0.70),
      I(px, 3.90, ph + 0.15),
      I(px - pw, 3.90, ph * 0.70)
    ], '#09080d');
    if (px === 0) {
      poly([I(-0.24, 3.91, 0.35), I(0.24, 3.91, 0.35), I(0.24, 3.91, 1.25), I(-0.24, 3.91, 1.25)], '#69220d');
      ell(...I(0, 3.92, 0.85), u * 0.14, u * 0.22, 'rgba(245, 158, 11, 0.42)');
    }
  });

  box(-2.65, 2.65, 3.82, 3.96, 2.90, 3.45, stTop, stRight, '#868496');
  for (let kx = -2.35; kx <= 2.35; kx += 0.36) {
    if (Math.abs(kx - 1.45) < 0.25 || Math.abs(kx + 1.10) < 0.25) continue;
    ln(I(kx, 3.97, 2.95), I(kx, 3.97, 3.40), stDark, u * 0.045);
  }

  ctx.save();
  wallPlane(0, 3.88, 4.68, 'F');
  ctx.fillStyle = '#0d0b1c';
  ctx.strokeStyle = '#8e8ca0';
  ctx.lineWidth = 0.11;
  ctx.beginPath();
  ctx.arc(0, 0, 0.96, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#3b1578';
  ctx.beginPath();
  ctx.arc(0, 0, 0.74, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#7f1616';
  ctx.beginPath();
  ctx.arc(0, 0, 0.48, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(0, 0, 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#757385';
  ctx.lineWidth = 0.045;
  for (let r = 0; r < 12; r++) {
    const ra = (r / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(ra) * 0.94, Math.sin(ra) * 0.94);
    ctx.stroke();
  }
  ctx.fillStyle = '#07060b';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, 0.88, 0.15, 1.05);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, 0.72, 3.4, 4.1);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  [-1.85, 1.85].forEach((tx, towerIdx) => {
    const tw = 0.78;
    const isRuinedRight = (towerIdx === 1);

    box(tx - tw, tx + tw, 2.25, 3.75, 6.15, 7.85, stFront, stRight, stTop);
    paintAshlarWeathering([I(tx - tw, 3.75, 6.15), I(tx + tw, 3.75, 6.15), I(tx + tw, 3.75, 7.85), I(tx - tw, 3.75, 7.85)], 5, 4, [], 200 + towerIdx);
    if (isRuinedRight) {
      drawWallIvy('F', 3.77, tx - tw * 0.7, tx + tw * 0.7, 6.15, 7.65, 31);
      drawWallIvy('R', tx + tw + 0.02, 2.35, 3.65, 6.15, 7.75, 32);
    }

    [-0.32, 0.32].forEach(lx => {
      poly([
        I(tx + lx - 0.16, 3.76, 6.35),
        I(tx + lx + 0.16, 3.76, 6.35),
        I(tx + lx + 0.16, 3.76, 7.35),
        I(tx + lx, 3.76, 7.62),
        I(tx + lx - 0.16, 3.76, 7.35)
      ], '#09080d');
    });

    if (!isRuinedRight) {
      [[-tw, tw], [tw, tw]].forEach(([pxOff, pyOff]) => {
        const pPinTop = I(tx + pxOff, 3.00 + pyOff, 8.80);
        poly([
          I(tx + pxOff - 0.14, 3.00 + pyOff + 0.14, 7.85),
          I(tx + pxOff + 0.14, 3.00 + pyOff + 0.14, 7.85),
          pPinTop
        ], stTop);
      });

      const pSpireApex = I(tx, 3.00, 11.15);
      poly([I(tx - tw * 0.85, 3.00 + tw * 0.85, 7.85), I(tx + tw * 0.85, 3.00 + tw * 0.85, 7.85), pSpireApex], stTop);
      poly([I(tx + tw * 0.85, 3.00 - tw * 0.85, 7.85), I(tx + tw * 0.85, 3.00 + tw * 0.85, 7.85), pSpireApex], stRight);

      [8.6, 9.4, 10.2].forEach(zs => {
        const f = (zs - 7.85) / 3.30;
        const rw = tw * 0.85 * (1 - f);
        ln(I(tx - rw, 3.00 + rw, zs), I(tx + rw, 3.00 + rw, zs), '#868496', u * 0.045);
        ln(I(tx + rw, 3.00 - rw, zs), I(tx + rw, 3.00 + rw, zs), '#383642', u * 0.045);
      });
      ln(pSpireApex, [pSpireApex[0], pSpireApex[1] - u * 0.50], '#8a8a96', u * 0.045);
    } else {
      const zBreakL = 9.25, zBreakM = 8.60, zBreakR = 9.00;
      const fL = (zBreakL - 7.85) / 3.35;
      const fM = (zBreakM - 7.85) / 3.35;
      const fR = (zBreakR - 7.85) / 3.35;
      const rw0 = tw * 0.85;

      poly([
        I(tx - rw0, 3.00 + rw0, 7.85),
        I(tx + rw0, 3.00 + rw0, 7.85),
        I(tx + rw0 * (1 - fR), 3.00 + rw0 * (1 - fR), zBreakR),
        I(tx + rw0 * 0.15, 3.00 + rw0 * (1 - fM), zBreakM),
        I(tx - rw0 * (1 - fL), 3.00 + rw0 * (1 - fL), zBreakL)
      ], stTop);

      poly([
        I(tx + rw0, 3.00 - rw0, 7.85),
        I(tx + rw0, 3.00 + rw0, 7.85),
        I(tx + rw0 * (1 - fR), 3.00 + rw0 * (1 - fR), zBreakR),
        I(tx + rw0 * (1 - fM), 3.00 - rw0 * (1 - fM), zBreakM - 0.25)
      ], stRight);

      poly([
        I(tx - rw0 * (1 - fL), 3.00 + rw0 * (1 - fL), zBreakL),
        I(tx + rw0 * 0.15, 3.00 + rw0 * (1 - fM), zBreakM),
        I(tx + rw0 * (1 - fR), 3.00 + rw0 * (1 - fR), zBreakR),
        I(tx + rw0 * (1 - fM), 3.00 - rw0 * (1 - fM), zBreakM - 0.25)
      ], '#07060b');
    }
  });

  drawDeadTree(-4.1, 2.8, 0.95);
  drawDeadTree(4.2, 2.2, 0.88);

  [
    [3.1, 3.8, 0.34, 0.24],
    [3.55, 2.95, 0.28, 0.20],
    [2.85, 4.35, 0.22, 0.16],
    [-3.15, 3.65, 0.30, 0.22],
    [-3.55, 4.25, 0.20, 0.15]
  ].forEach(([rx, ry, rw, rh]) => {
    box(rx - rw, rx + rw, ry - rw, ry + rw, 0, rh, stFront, stRight, stTop);
  });

  [-3.8, -3.1, -2.5].forEach((fx, idx) => {
    const pB = I(fx, 4.75, 0), pT = [I(fx, 4.75, 0.85)[0] + (idx === 1 ? u * 0.08 : 0), I(fx, 4.75, 0.85)[1]];
    ln(pB, pT, '#121018', u * 0.08);
  });
  ln(I(-3.8, 4.75, 0.68), I(-2.5, 4.75, 0.68), '#121018', u * 0.05);
  const pLan = I(-2.5, 4.75, 0.95);
  ell(pLan[0], pLan[1], u * 0.34, u * 0.34, 'rgba(125, 211, 252, 0.24)');
  ell(pLan[0], pLan[1], u * 0.10, u * 0.14, '#bae6fd');

  softFog(...I(-3.2, 4.1, 0.1), u * 2.8, u * 0.82, '155, 175, 205', 0.34);
  softFog(...I(3.4, 3.6, 0.1), u * 2.9, u * 0.86, '155, 175, 205', 0.36);
  softFog(...I(0.3, 5.1, 0.1), u * 2.5, u * 0.72, '155, 175, 205', 0.28);

  ctx.restore();
}

/* ============================================================================
   3. WESTERN WEENIE: MONUMENT VALLEY MITTEN BUTTE
      Centered, larger 3/4-angled Monument Valley formation with an organically
      integrated thumb pinnacle sharing the talus saddle & sedimentary strata.
   ============================================================================ */
function drawWeenieWesternMitten(ctx, cx, cy, R, opts = {}) {
  const g = makeWeenieContext(ctx, cx, cy, R, Object.assign({ oy: R * 0.08 }, opts));
  const { u, I, ln, ell } = g;
  const rnd = mulberry(7319);

  ctx.save();
  if (g.flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  // Centered directly in the middle of the hex tile, scaled up for bold presence
  const pCenter = I(0, 0, 0);
  const bx = pCenter[0];
  const by = pCenter[1] + u * 0.18;

  // 1. Soft Ambient Desert Shadow & Broad Sand-Wash Apron
  ctx.fillStyle = 'rgba(46, 20, 6, 0.25)';
  ctx.beginPath();
  ctx.ellipse(bx + u * 1.15, by + u * 0.22, u * 6.0, u * 2.15, -0.14, 0, Math.PI * 2);
  ctx.fill();

  const sandGrad = ctx.createRadialGradient(bx, by, u * 0.8, bx, by, u * 6.4);
  sandGrad.addColorStop(0.0, 'rgba(196, 114, 58, 0.45)');
  sandGrad.addColorStop(0.65, 'rgba(214, 148, 86, 0.22)');
  sandGrad.addColorStop(1.0, 'rgba(214, 148, 86, 0.0)');
  ctx.fillStyle = sandGrad;
  ctx.beginPath();
  ctx.ellipse(bx, by + u * 0.14, u * 6.4, u * 2.35, -0.10, 0, Math.PI * 2);
  ctx.fill();

  // -------------------------------------------------------------------------
  // 2. UNIFIED 3/4-ANGLED MONUMENT VALLEY BUTTE + SHARED TALUS SADDLE
  //    Angled diagonally along the isometric 3/4 view (broad sunlit front-left
  //    face sweeping up-right, shaded east flank receding to the upper-right)
  //    so it reads as a grand side-angled mesa rather than pointing straight at you.
  // -------------------------------------------------------------------------
  const traceUnifiedButte = () => {
    ctx.beginPath();
    // Sweeping front-left (southwest) desert base edge angled diagonally up-right
    ctx.moveTo(bx - u * 5.85, by + u * 0.55);
    ctx.quadraticCurveTo(bx - u * 2.60, by + u * 1.48, bx + u * 0.75, by + u * 1.42);
    ctx.quadraticCurveTo(bx + u * 3.65, by + u * 1.15, bx + u * 5.75, by - u * 0.15);

    // Right-hand (east) concave talus scree slope rising toward the upper-right cliff
    ctx.bezierCurveTo(
      bx + u * 4.35, by - u * 1.10,
      bx + u * 3.35, by - u * 2.55,
      bx + u * 3.05, by - u * 4.25
    );
    // Craggy east Wingate sandstone cliff wall (angled back-right)
    ctx.lineTo(bx + u * 2.95, by - u * 5.45);
    ctx.lineTo(bx + u * 3.08, by - u * 6.35);
    ctx.lineTo(bx + u * 2.85, by - u * 7.45);
    ctx.lineTo(bx + u * 2.62, by - u * 8.65);

    // Broad 3/4-angled flat caprock mesa crown (sweeping diagonally from upper-right to mid-left)
    ctx.lineTo(bx + u * 1.75, by - u * 8.85);
    ctx.lineTo(bx + u * 0.65, by - u * 8.72);
    ctx.lineTo(bx - u * 0.35, by - u * 8.62);
    ctx.lineTo(bx - u * 1.05, by - u * 8.35);

    // Sheer inner palm cliff wall dropping into the U-shaped V-notch saddle
    ctx.lineTo(bx - u * 1.18, by - u * 7.15);
    ctx.lineTo(bx - u * 1.12, by - u * 6.10);
    ctx.lineTo(bx - u * 1.32, by - u * 4.95);
    // Curved natural sandstone saddle notch connecting Palm and Thumb!
    ctx.quadraticCurveTo(bx - u * 1.72, by - u * 4.45, bx - u * 2.08, by - u * 4.85);

    // Inner east wall of the Thumb pinnacle rising organically from the shared saddle
    ctx.lineTo(bx - u * 2.04, by - u * 5.85);
    ctx.lineTo(bx - u * 2.18, by - u * 6.85);
    // Weathered Thumb pinnacle caprock
    ctx.lineTo(bx - u * 2.62, by - u * 7.02);
    ctx.lineTo(bx - u * 3.08, by - u * 6.72);

    // Outer west cliff of the Thumb descending seamlessly into the shared western talus skirt
    ctx.lineTo(bx - u * 3.22, by - u * 5.35);
    ctx.lineTo(bx - u * 3.48, by - u * 3.75);
    ctx.bezierCurveTo(
      bx - u * 4.10, by - u * 2.15,
      bx - u * 4.95, by - u * 0.65,
      bx - u * 5.85, by + u * 0.55
    );
    ctx.closePath();
  };

  // Base warm terracotta-red sandstone fill
  const mainGrad = ctx.createLinearGradient(bx - u * 4.2, by - u * 8.8, bx + u * 4.2, by + u * 1.4);
  mainGrad.addColorStop(0.00, '#ee8c5c');
  mainGrad.addColorStop(0.45, '#d46134');
  mainGrad.addColorStop(0.80, '#b54720');
  mainGrad.addColorStop(1.00, '#8f3314');
  traceUnifiedButte();
  ctx.fillStyle = mainGrad;
  ctx.fill();

  // Clip inside the unified silhouette for 3/4 lighting planes, shared strata & scree gullies
  ctx.save();
  traceUnifiedButte();
  ctx.clip();

  // 2A. Broad Sunlit Front-Left (Southwest) Cliff & Talus Light Plane
  ctx.fillStyle = 'rgba(255, 200, 152, 0.28)';
  ctx.beginPath();
  ctx.moveTo(bx - u * 6.0, by + u * 0.8);
  ctx.lineTo(bx - u * 3.3, by - u * 7.2);
  ctx.lineTo(bx + u * 1.25, by - u * 8.9);
  ctx.lineTo(bx + u * 1.42, by - u * 4.2);
  ctx.quadraticCurveTo(bx + u * 1.15, by - u * 1.4, bx + u * 0.65, by + u * 1.5);
  ctx.closePath();
  ctx.fill();

  // 2B. Shaded East/Right Flank Plane (Receding back-right for natural 3/4 volume)
  const shadeGrad = ctx.createLinearGradient(bx + u * 1.1, 0, bx + u * 5.6, 0);
  shadeGrad.addColorStop(0.0, 'rgba(92, 26, 12, 0.42)');
  shadeGrad.addColorStop(0.5, 'rgba(68, 18, 14, 0.64)');
  shadeGrad.addColorStop(1.0, 'rgba(46, 12, 14, 0.78)');
  ctx.fillStyle = shadeGrad;
  ctx.beginPath();
  ctx.moveTo(bx + u * 1.25, by - u * 8.9);
  ctx.lineTo(bx + u * 3.4, by - u * 8.9);
  ctx.lineTo(bx + u * 6.0, by);
  ctx.lineTo(bx + u * 0.65, by + u * 1.5);
  ctx.quadraticCurveTo(bx + u * 1.15, by - u * 1.4, bx + u * 1.42, by - u * 4.2);
  ctx.closePath();
  ctx.fill();

  // 2C. Deep Shadowed Canyon Cleft Behind the Thumb Saddle (Integrates Thumb into Main Butte!)
  const cleftGrad = ctx.createLinearGradient(bx - u * 2.2, by - u * 5.2, bx - u * 1.1, by - u * 2.4);
  cleftGrad.addColorStop(0.0, 'rgba(56, 14, 6, 0.62)');
  cleftGrad.addColorStop(0.65, 'rgba(72, 20, 8, 0.34)');
  cleftGrad.addColorStop(1.0, 'rgba(72, 20, 8, 0.0)');
  ctx.fillStyle = cleftGrad;
  ctx.beginPath();
  ctx.moveTo(bx - u * 2.15, by - u * 4.8);
  ctx.lineTo(bx - u * 1.25, by - u * 4.9);
  ctx.lineTo(bx - u * 1.10, by - u * 2.5);
  ctx.quadraticCurveTo(bx - u * 1.75, by - u * 2.1, bx - u * 2.45, by - u * 2.6);
  ctx.closePath();
  ctx.fill();

  // 2D. Continuous Sedimentary Sandstone Strata Bands (Sweeping continuously across Thumb & Palm!)
  const strataLevels = [
    { yOff: 8.15, col: 'rgba(254, 218, 182, 0.36)', w: 0.11 },
    { yOff: 7.40, col: 'rgba(84, 22, 8, 0.28)',    w: 0.09 },
    { yOff: 6.55, col: 'rgba(252, 198, 152, 0.32)', w: 0.12 },
    { yOff: 5.65, col: 'rgba(72, 18, 6, 0.32)',    w: 0.10 },
    { yOff: 4.75, col: 'rgba(248, 176, 124, 0.30)', w: 0.13 },
    { yOff: 3.75, col: 'rgba(64, 16, 6, 0.34)',    w: 0.11 },
    { yOff: 2.60, col: 'rgba(235, 145, 92, 0.26)',  w: 0.12 },
    { yOff: 1.45, col: 'rgba(58, 14, 4, 0.28)',    w: 0.10 }
  ];
  strataLevels.forEach((st, idx) => {
    const sy = by - u * st.yOff;
    ctx.strokeStyle = st.col;
    ctx.lineWidth = u * st.w;
    ctx.beginPath();
    // Angled slightly upward from left to right to match the 3/4 perspective
    ctx.moveTo(bx - u * 6.0, sy + u * 0.22);
    ctx.bezierCurveTo(
      bx - u * 2.0, sy + u * (idx % 2 ? 0.18 : -0.10),
      bx + u * 1.5, sy - u * (idx % 2 ? 0.24 : 0.02),
      bx + u * 6.0, sy - u * 0.32
    );
    ctx.stroke();
  });

  // 2E. Vertical Cliff Fluting & Shared Talus Scree Gullies
  const cliffRibs = [
    [-2.58, -2.85, 3.6, 6.9, true],
    [-0.95, -1.35, 3.5, 8.3, true],
    [-0.22, -0.45, 3.3, 8.5, false],
    [ 0.55,  0.45, 3.2, 8.7, true],
    [ 1.32,  1.45, 3.4, 8.8, false],
    [ 2.15,  2.45, 3.6, 8.6, true]
  ];
  cliffRibs.forEach(([xTop, xBot, z0, z1, isLit]) => {
    ctx.strokeStyle = isLit ? 'rgba(255, 214, 176, 0.34)' : 'rgba(54, 12, 4, 0.36)';
    ctx.lineWidth = u * 0.13;
    ctx.beginPath();
    ctx.moveTo(bx + u * xTop, by - u * z1);
    ctx.quadraticCurveTo(
      bx + u * ((xTop + xBot) * 0.5 + (rnd() - 0.5) * 0.16),
      by - u * ((z0 + z1) * 0.5),
      bx + u * xBot,
      by - u * z0
    );
    ctx.stroke();
  });

  // Fluted talus scree ribs radiating down the broad shared apron
  const screeRibs = [
    [-3.35, -5.25, 3.6,  0.35],
    [-2.65, -3.95, 3.4,  0.85],
    [-1.85, -2.55, 3.2,  1.15],
    [-1.05, -1.15, 3.3,  1.28],
    [-0.15,  0.25, 3.2,  1.32],
    [ 0.65,  1.55, 3.3,  1.22],
    [ 1.45,  2.85, 3.4,  0.98],
    [ 2.25,  4.15, 3.5,  0.55],
    [ 2.85,  5.25, 3.6,  0.05]
  ];
  screeRibs.forEach(([xTop, xBot, zTop, yBot], idx) => {
    const pA = [bx + u * xTop, by - u * zTop];
    const pB = [bx + u * xBot, by + u * yBot];
    ctx.strokeStyle = idx < 5 ? 'rgba(255, 198, 152, 0.32)' : 'rgba(42, 10, 4, 0.36)';
    ctx.lineWidth = u * 0.12;
    ctx.beginPath();
    ctx.moveTo(pA[0], pA[1]);
    ctx.quadraticCurveTo((pA[0] + pB[0]) * 0.5, (pA[1] + pB[1]) * 0.5 + u * 0.25, pB[0], pB[1]);
    ctx.stroke();
  });

  // Sunlit mesa caprock crusts on both Palm & Thumb crowns
  ctx.fillStyle = '#f5a97f';
  ctx.beginPath();
  ctx.moveTo(bx - u * 1.05, by - u * 8.35);
  ctx.lineTo(bx - u * 0.35, by - u * 8.62);
  ctx.lineTo(bx + u * 0.65, by - u * 8.72);
  ctx.lineTo(bx + u * 1.75, by - u * 8.85);
  ctx.lineTo(bx + u * 2.62, by - u * 8.65);
  ctx.lineTo(bx + u * 1.95, by - u * 8.35);
  ctx.lineTo(bx - u * 0.85, by - u * 8.08);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(bx - u * 3.08, by - u * 6.72);
  ctx.lineTo(bx - u * 2.62, by - u * 7.02);
  ctx.lineTo(bx - u * 2.18, by - u * 6.85);
  ctx.lineTo(bx - u * 2.35, by - u * 6.62);
  ctx.lineTo(bx - u * 2.95, by - u * 6.52);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // -------------------------------------------------------------------------
  // 3. DESERT FLORA & WEATHERED RED-ROCK BOULDERS FRAMING THE CENTERED BASE
  // -------------------------------------------------------------------------
  const drawSaguaro = (px, py, sc) => {
    const h = u * 1.48 * sc;
    ell(px + u * 0.22 * sc, py + u * 0.05 * sc, u * 0.36 * sc, u * 0.12 * sc, 'rgba(38, 16, 4, 0.28)');
    ln([px, py], [px, py - h], '#2d6a3e', u * 0.22 * sc);
    ln([px - u * 0.04 * sc, py], [px - u * 0.04 * sc, py - h * 0.96], '#428c56', u * 0.07 * sc);
    ln([px, py - h * 0.46], [px - u * 0.27 * sc, py - h * 0.46], '#2d6a3e', u * 0.14 * sc);
    ln([px - u * 0.27 * sc, py - h * 0.46], [px - u * 0.27 * sc, py - h * 0.84], '#397d4c', u * 0.14 * sc);
    ln([px, py - h * 0.60], [px + u * 0.26 * sc, py - h * 0.60], '#245732', u * 0.14 * sc);
    ln([px + u * 0.26 * sc, py - h * 0.60], [px + u * 0.26 * sc, py - h * 0.92], '#2d6a3e', u * 0.14 * sc);
  };

  drawSaguaro(bx - u * 4.85, by + u * 0.85, 1.05);
  drawSaguaro(bx + u * 4.65, by + u * 0.45, 0.98);
  drawSaguaro(bx - u * 1.35, by + u * 1.55, 0.84);

  [
    [-3.55, 1.15, 0.44, '#b54924'],
    [ 2.15, 1.32, 0.48, '#9c3b19'],
    [ 3.85, 0.82, 0.36, '#b54924'],
    [-0.15, 1.55, 0.34, '#c4552d']
  ].forEach(([ox, oy, rad, col]) => {
    const rx = bx + u * ox, ry = by + u * oy;
    ell(rx + u * 0.10, ry + u * 0.06, u * rad * 1.25, u * rad * 0.52, 'rgba(36, 14, 4, 0.26)');
    ell(rx, ry, u * rad * 1.15, u * rad * 0.58, col);
    ell(rx - u * rad * 0.22, ry - u * rad * 0.14, u * rad * 0.62, u * rad * 0.30, '#e38052');
  });

  [
    [-4.15, 0.95, 0.38, '#658a48'],
    [-2.65, 1.38, 0.42, '#789e58'],
    [ 1.15, 1.48, 0.44, '#658a48'],
    [ 3.15, 1.12, 0.40, '#789e58'],
    [ 5.15, 0.18, 0.34, '#5c7d41']
  ].forEach(([sx, sy, rad, col]) => {
    const px = bx + u * sx, py = by + u * sy;
    ell(px, py, u * rad * 1.1, u * rad * 0.55, col);
    ell(px - u * rad * 0.18, py - u * rad * 0.12, u * rad * 0.65, u * rad * 0.32, '#8cb369');
  });

  ctx.restore();
}
/* ============================================================================
   4. MEDIEVAL WEENIE: FAIRYTALE FANTASY HILLTOP CASTLE
      Organic Grassy Hilltop, Limestone Outcrops, Dirt Trail & Fantasy Citadel
   ============================================================================ */
function drawWeenieMedievalNeuschwanstein(ctx, cx, cy, R, opts = {}) {
  const g = makeWeenieContext(ctx, cx, cy, R, Object.assign({ oy: R * 0.16 }, opts));
  const { u, I, poly, ln, ell, clipPoly, wallPlane, box, cylZ, coneZ, gableX, gableY, drawAlpinePine } = g;

  ctx.save();
  if (g.flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  // Soft natural shadow cast by the hilltop across the right side of the hex
  ell(...I(1.4, 0.8, 0), u * 5.2, u * 2.4, 'rgba(14, 28, 12, 0.28)', -0.25);

  // -------------------------------------------------------------------------
  // 1. NATURAL GRASSY HILLTOP & STEPPED LIMESTONE OUTCROPS (Built from Scratch!)
  //    No waterfall, no spring pool, no viaduct staircase—just a lush, rolling
  //    grassy knoll with natural rocky limestone ledges and a winding dirt path.
  // -------------------------------------------------------------------------
  const zHill = 2.42;

  // Lower rolling grassy hill skirt (smooth organic dome)
  const pFootL  = I(-5.1, 2.8, 0);
  const pFootFL = I(-2.6, 4.7, 0);
  const pFootFM = I(0.2, 4.9, 0);
  const pFootFR = I(3.6, 4.1, 0);
  const pFootER = I(5.2, 0.8, 0);
  const pFootBR = I(4.5, -3.2, 0);
  const pFootBL = I(-4.6, -2.6, 0);

  const pMidL   = I(-4.1, 2.2, 1.35);
  const pMidFM  = I(-0.1, 3.3, 1.55);
  const pMidFR  = I(3.1, 2.6, 1.40);
  const pMidER  = I(4.0, -0.2, 1.30);
  const pMidBR  = I(3.2, -2.8, 1.20);
  const pMidBL  = I(-3.7, -2.2, 1.15);

  // Sunlit front-left grassy hillside
  ctx.beginPath();
  ctx.moveTo(pFootL[0], pFootL[1]);
  ctx.quadraticCurveTo(pFootFL[0], pFootFL[1], pFootFM[0], pFootFM[1]);
  ctx.quadraticCurveTo(I(2.1, 4.7, 0)[0], I(2.1, 4.7, 0)[1], pFootFR[0], pFootFR[1]);
  ctx.lineTo(pMidFR[0], pMidFR[1]);
  ctx.quadraticCurveTo(pMidFM[0], pMidFM[1], pMidL[0], pMidL[1]);
  ctx.closePath();
  const gradSlopeL = ctx.createLinearGradient(0, pMidFM[1], 0, pFootFM[1]);
  gradSlopeL.addColorStop(0.0, '#6a9e48');
  gradSlopeL.addColorStop(1.0, '#4a7731');
  ctx.fillStyle = gradSlopeL;
  ctx.fill();

  // Shaded right-hand grassy hillside
  ctx.beginPath();
  ctx.moveTo(pFootFR[0], pFootFR[1]);
  ctx.quadraticCurveTo(I(4.7, 2.5, 0)[0], I(4.7, 2.5, 0)[1], pFootER[0], pFootER[1]);
  ctx.quadraticCurveTo(I(5.0, -1.3, 0)[0], I(5.0, -1.3, 0)[1], pFootBR[0], pFootBR[1]);
  ctx.lineTo(pMidBR[0], pMidBR[1]);
  ctx.quadraticCurveTo(pMidER[0], pMidER[1], pMidFR[0], pMidFR[1]);
  ctx.closePath();
  const gradSlopeR = ctx.createLinearGradient(pMidER[0], 0, pFootER[0], 0);
  gradSlopeR.addColorStop(0.0, '#4f7a36');
  gradSlopeR.addColorStop(1.0, '#335422');
  ctx.fillStyle = gradSlopeR;
  ctx.fill();

  // Upper rocky limestone crag & grass summit collar (z = 1.25 .. zHill)
  const pTopL  = I(-3.4, 1.8, zHill - 0.08);
  const pTopFM = I(-0.1, 2.3, zHill + 0.06);
  const pTopFR = I(2.8, 1.9, zHill - 0.05);
  const pTopER = I(3.3, -0.3, zHill - 0.12);
  const pTopBR = I(2.7, -2.4, zHill - 0.18);
  const pTopBL = I(-3.2, -1.9, zHill - 0.18);

  // Limestone crag face (front-left sunlit rock)
  poly([pMidL, pMidFM, pMidFR, pTopFR, pTopFM, pTopL], '#8c968e');
  // Limestone crag face (right shaded rock)
  poly([pMidFR, pMidER, pMidBR, pTopBR, pTopER, pTopFR], '#5c665f');

  // Natural vertical rock crevices & grassy overhangs draped over the crag lip
  [
    [[-2.6, 2.0, zHill], [-3.1, 2.7, 1.35]],
    [[-1.2, 2.2, zHill], [-1.5, 3.1, 1.45]],
    [[0.6, 2.2, zHill], [0.9, 3.0, 1.45]],
    [[2.1, 2.0, zHill], [2.5, 2.7, 1.38]],
    [[3.1, 0.5, zHill - 0.1], [3.7, 0.7, 1.28]],
    [[2.9, -1.2, zHill - 0.15], [3.5, -1.6, 1.22]]
  ].forEach(([a, b]) => {
    const pA = I(...a), pB = I(...b);
    ln(pA, pB, 'rgba(20, 30, 22, 0.34)', u * 0.075);
    ln([pA[0] - u * 0.07, pA[1]], [pB[0] - u * 0.07, pB[1]], 'rgba(220, 228, 222, 0.26)', u * 0.05);
  });

  // Lush grassy summit meadow crown where the castle sits naturally
  poly([pTopBL, pTopBR, pTopER, pTopFR, pTopFM, pTopL], '#6da34b');
  poly([I(-2.8, -1.5, zHill), I(2.3, -2.0, zHill), I(2.8, 0.3, zHill), I(2.1, 1.7, zHill), I(-2.6, 1.6, zHill)], '#7cb556');

  // Soft grassy turf tongues draping naturally over the top edge of the rock crag
  [
    [[-2.9, 2.0, zHill - 0.05], 0.65, 0.28],
    [[-1.6, 2.2, zHill],        0.75, 0.32],
    [[0.1, 2.3, zHill + 0.04],  0.80, 0.34],
    [[1.6, 2.1, zHill - 0.02],  0.70, 0.30]
  ].forEach(([pt, rx, ry]) => {
    const p = I(...pt);
    ell(p[0], p[1] + u * 0.08, u * rx, u * ry, '#6da34b', -0.2);
  });

  // Natural mossy fieldstones & wildflowers scattered on the hillside
  [
    [-3.6, 3.8, 0.30], [-2.1, 4.4, 0.24], [0.4, 4.6, 0.28],
    [3.8, 3.2, 0.32], [4.5, 1.2, 0.26], [-4.3, 1.9, 0.28]
  ].forEach(([bx, by, rad], idx) => {
    const bp = I(bx, by, 0);
    ell(bp[0], bp[1], u * rad * 1.2, u * rad * 0.62, idx % 2 ? '#7c877f' : '#8e9991');
    ell(bp[0] - u * rad * 0.14, bp[1] - u * rad * 0.12, u * rad * 0.68, u * rad * 0.32, '#5c8a42');
  });

  [
    [-2.8, 4.1, '#facc15'], [-1.4, 4.5, '#f472b6'], [1.1, 4.5, '#fef08a'],
    [1.6, 4.1, '#fb7185'], [3.3, 3.6, '#38bdf8'], [-3.9, 3.1, '#facc15'],
    [-2.2, 3.0, '#fef08a'], [0.7, 3.2, '#f472b6']
  ].forEach(([fx, fy, col]) => {
    const fp = I(fx, fy, 0.02);
    ell(fp[0], fp[1], u * 0.10, u * 0.06, col);
  });

  // -------------------------------------------------------------------------
  // 2. FAIRYTALE FANTASY CASTLE ARCHITECTURE (Perched directly on the Hilltop!)
  // -------------------------------------------------------------------------
  const limeF  = '#fffdf7';
  const limeR  = '#e2dac8';
  const limeT  = '#ffffff';
  const slateF = '#1d4ed8'; // Vibrant fairytale royal-cobalt slate
  const slateR = '#1e3a8a';
  const gold   = '#facc15';
  const goldD  = '#ca8a04';
  const brickF = '#b93829';
  const brickR = '#852217';

  // Helper: Draw gold-ribbed fairytale conical turret roof with fluttering pennant
  const drawFantasySpire = (X, Y, rad, z0, z1, roofCol = slateF, flagCol = '#ef4444') => {
    const pTip = coneZ(X, Y, rad, z0, z1, roofCol);
    const pBase = I(X, Y, z0);
    // Gold eaves collar & gilded vertical roof ribs
    ell(pBase[0], pBase[1], 0.99 * rad * u, 0.495 * rad * u, null, gold, u * 0.045);
    [-0.55, 0, 0.55].forEach(ang => {
      ln([pBase[0] + Math.sin(ang) * rad * 0.85 * u, pBase[1] + Math.cos(ang) * rad * 0.42 * u], pTip, 'rgba(254, 240, 138, 0.45)', u * 0.03);
    });
    // Tall golden finial spire & fluttering swallowtail pennant
    const pFin = [pTip[0], pTip[1] - u * 0.56];
    ln(pTip, pFin, gold, u * 0.048);
    ell(pTip[0], pTip[1] - u * 0.22, u * 0.09, u * 0.09, '#fef08a');
    poly([
      [pFin[0], pFin[1] + u * 0.04],
      [pFin[0] + u * 0.52, pFin[1] + u * 0.12],
      [pFin[0] + u * 0.36, pFin[1] + u * 0.22],
      [pFin[0] + u * 0.50, pFin[1] + u * 0.32],
      [pFin[0], pFin[1] + u * 0.34]
    ], flagCol);
  };

  // Helper: Paint ashlar corner quoins & masonry texture onto white limestone walls
  const paintCastleQuoins = (quadPts, rows, seed = 88) => {
    const rnd = mulberry(seed);
    clipPoly(quadPts, () => {
      const [A, B, C2, D] = quadPts;
      for (let r = 0; r < rows; r++) {
        const t0 = r / rows, t1 = (r + 1) / rows;
        const y0 = A[1] + (D[1] - A[1]) * t0;
        const y1 = A[1] + (D[1] - A[1]) * t1;
        const qw = (r % 2 === 0) ? u * 0.22 : u * 0.14;
        // Left & right corner quoins
        poly([[A[0], y0], [A[0] + qw, y0], [A[0] + qw, y1], [A[0], y1]], 'rgba(148, 138, 118, 0.34)');
        poly([[B[0] - qw, y0], [B[0], y0], [B[0], y1], [B[0] - qw, y1]], 'rgba(120, 110, 92, 0.34)');
        if (rnd() > 0.35) {
          ln([A[0], y0], [B[0], y0], 'rgba(148, 138, 118, 0.20)', u * 0.025);
        }
      }
    });
  };

  // 2B. Upper Knight's Keep & North Curtain Wall (-X, -Y)
  box(-3.15, -1.35, -2.35, -0.45, zHill, zHill + 4.15, limeF, limeR, limeT);
  paintCastleQuoins([I(-3.15, -0.45, zHill), I(-1.35, -0.45, zHill), I(-1.35, -0.45, zHill + 4.15), I(-3.15, -0.45, zHill + 4.15)], 8, 11);

  // Square Upper Keep Tower with Machicolated Corbels & Golden-Ribbed Spire
  box(-3.05, -1.95, -2.25, -1.15, zHill + 4.15, zHill + 5.65, limeF, limeR, limeT);
  // Machicolated parapet corbel ring
  box(-3.16, -1.84, -2.36, -1.04, zHill + 5.55, zHill + 5.78, '#cbd5e1', '#94a3b8', '#f8fafc');
  const pSqKeep = I(-2.50, -1.70, zHill + 7.45);
  poly([I(-3.18, -1.02, zHill + 5.78), I(-1.82, -1.02, zHill + 5.78), pSqKeep], slateF);
  poly([I(-1.82, -2.38, zHill + 5.78), I(-1.82, -1.02, zHill + 5.78), pSqKeep], slateR);
  ln(pSqKeep, [pSqKeep[0], pSqKeep[1] - u * 0.55], gold, u * 0.05);
  poly([[pSqKeep[0], pSqKeep[1] - u * 0.52], [pSqKeep[0] + u * 0.48, pSqKeep[1] - u * 0.40], [pSqKeep[0], pSqKeep[1] - u * 0.25]], '#2563eb');

  // 2C. Grand Fairytale Palas Great Hall (Central White Limestone Palace Wing)
  box(-2.85, 0.95, -1.55, 0.72, zHill, zHill + 3.55, limeF, limeR, limeT);
  paintCastleQuoins([I(-2.85, 0.72, zHill), I(0.95, 0.72, zHill), I(0.95, 0.72, zHill + 3.55), I(-2.85, 0.72, zHill + 3.55)], 7, 22);

  // Three Tiers of Romanesque Arched Loggia Galleries & Glowing Golden Windows
  [zHill + 0.55, zHill + 1.50, zHill + 2.45].forEach((zw, rowIdx) => {
    for (let wx = -2.35; wx <= 0.55; wx += 0.58) {
      poly([
        I(wx - 0.15, 0.73, zw),
        I(wx + 0.15, 0.73, zw),
        I(wx + 0.15, 0.73, zw + 0.40),
        I(wx, 0.73, zw + 0.56),
        I(wx - 0.15, 0.73, zw + 0.40)
      ], rowIdx === 1 ? '#f59e0b' : '#1e3a8a');
      if (rowIdx === 1) {
        ell(...I(wx, 0.74, zw + 0.28), u * 0.10, u * 0.14, '#fef08a');
      }
    }
    if (rowIdx > 0) {
      ln(I(-2.88, 0.74, zw - 0.05), I(0.98, 0.74, zw - 0.05), '#cbd5e1', u * 0.06);
    }
  });

  // Ornate Stained-Glass Rose Window on the Palas +X Gable Wall!
  ctx.save();
  wallPlane(0.96, -0.42, zHill + 2.55, 'R');
  ctx.fillStyle = '#1e3a8a';
  ctx.strokeStyle = gold;
  ctx.lineWidth = 0.08;
  ctx.beginPath();
  ctx.arc(0, 0, 0.58, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(0, 0, 0.34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(0, 0, 0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Steep Royal-Blue Slate Gable Roof with Golden Cresting, Finials & Gabled Dormers
  gableX(-2.98, 1.08, -1.68, 0.85, zHill + 3.55, 1.65, slateF, limeR, '#93c5fd', 4);
  [-2.5, -1.0, 0.6].forEach(fx => {
    const fp = I(fx, -0.42, zHill + 5.20);
    ln(fp, [fp[0], fp[1] - u * 0.46], gold, u * 0.048);
    ell(fp[0], fp[1] - u * 0.46, u * 0.08, u * 0.08, '#fef08a');
  });
  [-2.1, -0.9, 0.3].forEach(dx => {
    gableY(dx - 0.22, dx + 0.22, 0.05, 0.72, zHill + 3.65, 0.62, limeF, slateR);
  });

  // 2D. Soaring Round Fairytale Observation Tower (Tallest Spire!)
  const tx = 0.65, ty = -1.45;
  cylZ(tx, ty, 0.60, zHill, zHill + 6.15, limeF, '#e2e8f0');
  // Corbelled stone gallery & golden balcony trim
  cylZ(tx, ty, 0.74, zHill + 6.15, zHill + 6.52, '#cbd5e1', '#f8fafc');
  ell(...I(tx, ty, zHill + 6.15), 0.74 * u, 0.37 * u, null, goldD, u * 0.04);
  [zHill + 1.8, zHill + 3.3, zHill + 4.8].forEach(zw => {
    const wp = I(tx + 0.36, ty + 0.36, zw);
    ln(wp, [wp[0], wp[1] - u * 0.34], '#1e3a8a', u * 0.055);
  });
  drawFantasySpire(tx, ty, 0.78, zHill + 6.52, zHill + 8.45, slateF, '#ef4444');

  // 2A. Low Stone Courtyard Terrace Wall & Arched Entrance Gate at Top of Hill Path
  box(1.10, 3.05, 0.35, 1.85, zHill, zHill + 1.85, brickF, brickR, '#d46555');
  // Arched portcullis gate opening with raised iron grille
  poly([I(1.88, 1.86, zHill), I(2.52, 1.86, zHill), I(2.52, 1.86, zHill + 0.82), I(2.20, 1.86, zHill + 1.12), I(1.88, 1.86, zHill + 0.82)], '#18181b');
  [2.02, 2.20, 2.38].forEach(gx => {
    ln(I(gx, 1.87, zHill + 0.35), I(gx, 1.87, zHill + 0.95), '#94a3b8', u * 0.032);
  });
  // Crenellated gatehouse battlements & glowing amber windows
  [1.42, 2.20, 2.82].forEach(wx => {
    poly([I(wx - 0.11, 1.86, zHill + 1.25), I(wx + 0.11, 1.86, zHill + 1.25), I(wx + 0.11, 1.86, zHill + 1.62), I(wx - 0.11, 1.86, zHill + 1.62)], '#fef08a');
  });
  gableX(1.04, 3.12, 0.28, 1.92, zHill + 1.85, 0.85, slateF, brickR, '#60a5fa', 2);

  // 2F. Three Cantilevered Fairytale Corner Bartizan Turrets with Gold-Ribbed Cones
  cylZ(1.02, ty + 3.30, 0.36, zHill, zHill + 2.65, brickF, '#e2e8f0');
  drawFantasySpire(1.02, ty + 3.30, 0.44, zHill + 2.65, zHill + 3.85, slateF, '#facc15');

  cylZ(-3.05, 1.75, 0.38, zHill, zHill + 2.55, limeF, '#e2e8f0');
  drawFantasySpire(-3.05, 1.75, 0.45, zHill + 2.55, zHill + 3.70, slateF, '#3b82f6');

  cylZ(3.05, 0.35, 0.34, zHill, zHill + 2.35, limeF, '#e2e8f0');
  drawFantasySpire(3.05, 0.35, 0.40, zHill + 2.35, zHill + 3.45, slateF, '#ef4444');
  // 2G. Lush Layered Alpine Pines Framing the Natural Hilltop & Slopes
  drawAlpinePine(-3.35, 2.05, zHill * 0.96, 0.80); // Pine on the western hilltop shoulder
  drawAlpinePine(2.95, 1.35, zHill * 0.94, 0.74);  // Pine on the eastern hilltop shoulder
  drawAlpinePine(-4.5, 3.5, 0, 1.06);
  drawAlpinePine(-3.5, 4.2, 0, 0.88);
  drawAlpinePine(-4.7, 1.6, 0, 0.92);
  drawAlpinePine(4.4, 2.4, 0, 1.00);
  drawAlpinePine(4.6, 0.5, 0, 0.86);
  drawAlpinePine(-0.4, 4.5, 0, 0.82);

  ctx.restore();
}

/* ===== UNIFIED DISPATCHER, BAKE & FOOTPRINT API ===== */
function drawWeenieLandmarkV2(ctx, cx, cy, R, themeId = 'nordic', opts = {}) {
  const key = String(themeId || 'nordic').toLowerCase();
  const meta = WEENIE_V2_CATALOG[key.includes('west') ? 'western' : key.includes('gothic') ? 'gothic' : key.includes('med') ? 'medieval' : 'nordic'];

  if (opts.tile) {
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = meta.tileCol;
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, R * 0.025);
    ctx.strokeStyle = meta.tileRim;
    ctx.stroke();
  }

  if (meta.id === 'western') return drawWeenieWesternMitten(ctx, cx, cy, R, opts);
  if (meta.id === 'gothic') return drawWeenieGothicCathedral(ctx, cx, cy, R, opts);
  if (meta.id === 'medieval') return drawWeenieMedievalNeuschwanstein(ctx, cx, cy, R, opts);
  return drawWeenieNordicStaveChurch(ctx, cx, cy, R, opts);
}

const WEENIE_BAKE_CACHE = {};
function bakeWeenieLandmarkV2(theme, R, opts = {}) {
  const pr = opts.pixelRatio || 2;
  const key = [theme, R, !!opts.flip, pr].join('|');
  if (WEENIE_BAKE_CACHE[key]) return WEENIE_BAKE_CACHE[key];

  const W = Math.ceil(R * 4.0 * pr);
  const H = Math.ceil(R * 4.6 * pr);
  const ax = W * 0.5;
  const ay = H * 0.72;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const c = cv.getContext('2d');
  c.scale(pr, pr);
  drawWeenieLandmarkV2(c, ax / pr, ay / pr, R, theme, { flip: opts.flip, tile: false });

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

  return (WEENIE_BAKE_CACHE[key] = {
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

const WEENIE_LANDMARKS_V2 = {
  nordic:   drawWeenieNordicStaveChurch,
  gothic:   drawWeenieGothicCathedral,
  western:  drawWeenieWesternMitten,
  medieval: drawWeenieMedievalNeuschwanstein,
  draw:     drawWeenieLandmarkV2,
  bake:     bakeWeenieLandmarkV2
};


window.HERO_WEENIE_LANDMARKS_V2 = WEENIE_LANDMARKS_V2;
})();
