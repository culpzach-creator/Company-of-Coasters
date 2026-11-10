const NEBULAZ_SKIN_PACK = (() => {
/* ===== SHARED HELPERS ===== */
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

/* ===== DROP-IN ENGINE SPRITE CODE: copy into engine.js ===== */
const NEBULAZ_META = {
  standard: { name: 'Standard Steampunk Nebulaz', sub: 'Geared Dynamo, Radial Star Hubs & Wheel Cages' },
  western:  { name: 'Iron Horse Steam Smokestack', sub: 'Balloon Smokestack, Brass Whistle, Spur Gears & Coal Tenders' },
  medieval: { name: 'Royal Quintain Training Dummy', sub: 'Rotating Oak Knight Dummy, Broadsword Arms & Heraldic Shields' },
  frontier: { name: 'Timberjack Axe-Swinging Mill', sub: 'Cedar Stump Tower, Cross-Cut Saw Hubs & Double-Bit Axe Blades' },
  fiesta:   { name: 'Calavera Fiesta Piñata', sub: 'Fringed Tissue Pillar, Sugar Skull Crown & 7-Pointed Star Pods' },
  space:    { name: 'Quantum Tachyon Gyro-Core', sub: 'Titanium Spire, Levitating Plasma Ring & Sleek Halo Pods' },
  bavarian: { name: 'Lederhosen & Frothy Steins', sub: 'Embroidered Suspenders Pillar, Pretzel Hubs & Dimpled Beer Mugs' },
  gothic:   { name: "Frankenstein's Tesla Dynamo", sub: 'Galvanic Coil Spire, Jacob\'s Ladder Arcs & Copper Lab Cages' },
  classic:  { name: 'Midway Starburst Nebulaz', sub: 'Chasing Neon Marquee Pillar, Pinwheel Hubs & Striped Carnival Pods' },
  jungle:   { name: 'Tiki Idol & Carved Stone Hands', sub: 'Mossy Temple Pillar, Giant Carved Tiki Head & Open Stone Palms' },
  alps:     { name: 'Glacier Rotary Snowblower', sub: ' Warning-Orange Blower Chute, Serrated Auger Arms & Snowplow Buckets' },
  nordic:   { name: 'Drakkar Dragon & Viking Axes', sub: 'Carved Stave Pillar, Sculpted Wood Dragon Head & Bearded Axes' }
};

/**
 * drawNebulaz(ctx, cx, cy, R, opts)
 *  opts.theme         : 'western'|'medieval'|'frontier'|'fiesta'|'space'|'bavarian'|'gothic'|'classic'|'jungle'|'alps'|'nordic'
 *  opts.rideThemeTier : 1..4 (<=2 draws Unthemed Standard; >=3 draws Heavy/Immersive themed skin)
 *  opts.accent        : Land color (default '#f97316')
 *  opts.t             : animation time in seconds
 *  opts.speed         : speed multiplier (default 1.0)
 *  opts.tile          : draw hex tile underneath (default false in engine, true in preview)
 */
function drawNebulaz(ctx, cx, cy, R, opts = {}) {
  const tier = opts.rideThemeTier != null ? opts.rideThemeTier : (opts.theme && opts.theme !== 'standard' ? 3 : 1);
  const theme = tier <= 2 ? 'standard' : (opts.theme || 'classic');
  const accent = opts.accent || '#f97316';
  const spd = opts.speed != null ? opts.speed : 1.0;
  const sec = (opts.t != null ? opts.t : (typeof performance !== 'undefined' ? performance.now() / 1000 : 0)) * spd;
  const r = v => R * v, TAU = Math.PI * 2;

  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Isometric 3D -> 2D projection: +X is down-right, +Y is down-left, +Z is straight up
  const P = (X, Y, Z) => [cx + (X - Y) * 0.7, cy + (X + Y) * 0.35 - Z];
  const line = (a, b, col, w) => {
    ctx.strokeStyle = col;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  };
  const poly = (pts, fill, stroke, lw) => {
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || r(0.006); ctx.stroke(); }
  };
  const ell = (p, rx, ry, fill, stroke, lw, rot = 0) => {
    ctx.beginPath();
    ctx.ellipse(p[0], p[1], Math.max(0.5, rx), Math.max(0.5, ry), rot, 0, TAU);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || r(0.006); ctx.stroke(); }
  };
  const cyl = (rr, Z0, Z1, col, topCol, strokeCol) => {
    if (Z1 <= Z0) return;
    const b = P(0, 0, Z0), t = P(0, 0, Z1), rx = 0.99 * rr, ry = 0.495 * rr;
    const grd = ctx.createLinearGradient(b[0] - rx, 0, b[0] + rx, 0);
    grd.addColorStop(0, shade(col, 0.24));
    grd.addColorStop(0.45, col);
    grd.addColorStop(1, shade(col, -0.38));
    ctx.beginPath();
    ctx.moveTo(b[0] - rx, b[1]);
    ctx.lineTo(t[0] - rx, t[1]);
    ctx.lineTo(t[0] + rx, t[1]);
    ctx.lineTo(b[0] + rx, b[1]);
    ctx.ellipse(b[0], b[1], rx, ry, 0, 0, Math.PI);
    ctx.closePath();
    ctx.fillStyle = grd;
    ctx.fill();
    if (strokeCol) { ctx.strokeStyle = strokeCol; ctx.lineWidth = r(0.006); ctx.stroke(); }
    if (topCol !== false) ell(t, rx, ry, topCol || shade(col, 0.28), strokeCol, r(0.005));
  };
  const cone = (rr0, rr1, Z0, Z1, col, topCol) => {
    const b = P(0, 0, Z0), t = P(0, 0, Z1);
    const rx0 = 0.99 * rr0, ry0 = 0.495 * rr0;
    const rx1 = 0.99 * rr1, ry1 = 0.495 * rr1;
    const grd = ctx.createLinearGradient(b[0] - Math.max(rx0, rx1), 0, b[0] + Math.max(rx0, rx1), 0);
    grd.addColorStop(0, shade(col, 0.25));
    grd.addColorStop(0.5, col);
    grd.addColorStop(1, shade(col, -0.4));
    ctx.beginPath();
    ctx.moveTo(b[0] - rx0, b[1]);
    ctx.lineTo(t[0] - rx1, t[1]);
    ctx.lineTo(t[0] + rx1, t[1]);
    ctx.lineTo(b[0] + rx0, b[1]);
    ctx.ellipse(b[0], b[1], rx0, ry0, 0, 0, Math.PI);
    ctx.closePath();
    ctx.fillStyle = grd;
    ctx.fill();
    if (topCol !== false && rr1 > 0.5) ell(t, rx1, ry1, topCol || shade(col, 0.25));
  };
  const isoBox = (x0, x1, y0, y1, z0, z1, cf, ce, ct) => {
    poly([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)], cf, shade(cf, -0.3), r(0.004));
    poly([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)], ce, shade(ce, -0.3), r(0.004));
    if (ct !== false) poly([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], ct);
  };

  if (opts.tile) {
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.lineWidth = Math.max(2, R * 0.04);
    ctx.strokeStyle = accent;
    ctx.stroke();
  }

  // Core kinematic dimensions
  const Z0 = r(0.02);
  const Zhub = r(0.49);
  const Ztop = r(0.78);
  const Rtw = r(0.16);
  const Rarm = r(0.38);
  const omega = sec * 2.25;

  // 1. AMBIENT SHADOW & CIRCULAR SAFETY APRON
  const pGnd = P(0, 0, Z0);
  ell([pGnd[0] + r(0.05), pGnd[1] + r(0.03)], r(0.64), r(0.32), 'rgba(8, 12, 22, 0.36)');
  const padCol =
    theme === 'western' ? '#78553a' :
    theme === 'frontier' || theme === 'nordic' ? '#5c4028' :
    theme === 'jungle' ? '#7d775e' :
    theme === 'space' ? '#0f172a' :
    theme === 'alps' ? '#cbd5e1' : '#334155';
  cyl(r(0.56), Z0, Z0 + r(0.028), padCol, shade(padCol, 0.14));
  // Safety clearance ring on deck
  const pPad = P(0, 0, Z0 + r(0.029));
  ell(pPad, r(0.49), r(0.245), null, accent, r(0.012));

  // Helper: Toothed spur gear on an isometric plane
  function drawIsoGear(X, Y, Z, plane, rad, teeth, rotAng, fillCol, rimCol) {
    const pts = [];
    const steps = teeth * 2;
    for (let i = 0; i < steps; i++) {
      const a = rotAng + (i / steps) * TAU;
      const rr = (i % 2 === 0) ? rad : rad * 0.80;
      const u = Math.cos(a) * rr, v = Math.sin(a) * rr;
      pts.push(plane === 'X' ? P(X, Y + u, Z + v) : P(X + u, Y, Z + v));
    }
    poly(pts, fillCol, rimCol, r(0.006));
    const c0 = P(X, Y, Z);
    ell(c0, rad * 0.35, rad * 0.25, rimCol);
  }

  // 2. CENTRAL PILLAR & SUMMIT CROWN (Unique per theme!)
  function drawCentralTower() {
    if (theme === 'western') {
      // Cast-iron locomotive firebox base + riveted boiler + tall diamond balloon smokestack + spur gears + steam puffs
      cone(Rtw * 1.48, Rtw * 1.15, Z0 + r(0.025), r(0.16), '#7c2d12', '#9a3412');
      // Glowing firebox grate slots
      for (let i = -2; i <= 2; i++) {
        const a = Math.PI * 0.25 + i * 0.35;
        const p0 = P(Math.cos(a) * Rtw * 1.18, Math.sin(a) * Rtw * 1.18, r(0.07));
        const p1 = P(Math.cos(a) * Rtw * 1.12, Math.sin(a) * Rtw * 1.12, r(0.14));
        line(p0, p1, '#f97316', r(0.016));
      }
      // Black riveted cast-iron boiler trunk
      cyl(Rtw * 1.05, r(0.16), r(0.62), '#1e293b', '#334155');
      // Polished brass boiler bands
      [0.24, 0.36, 0.60].forEach(z => cyl(Rtw * 1.10, r(z), r(z + 0.022), '#eab308', '#fde047'));
      // External cast-iron & brass spur gears on the gearbox
      drawIsoGear(Rtw * 1.06, 0, Zhub, 'X', r(0.14), 12, omega, '#b45309', '#f59e0b');
      drawIsoGear(0, Rtw * 1.06, Zhub, 'Y', r(0.14), 12, -omega, '#b45309', '#f59e0b');
      // Balloon / Diamond Smokestack Crown
      cone(Rtw * 0.90, Rtw * 1.55, r(0.62), r(0.80), '#0f172a', '#1e293b');
      cyl(Rtw * 1.55, r(0.80), r(0.84), '#eab308', '#facc15'); // Brass lip band
      cone(Rtw * 1.55, Rtw * 1.05, r(0.84), r(0.95), '#1e293b', '#090d16');
      // Side brass steam whistle
      const pw = P(-Rtw * 0.85, Rtw * 0.85, r(0.68));
      line(pw, [pw[0], pw[1] - r(0.09)], '#fbbf24', r(0.026));
      // Billowing locomotive steam puffs rising from the smokestack
      for (let k = 0; k < 4; k++) {
        const ph = (sec * 0.85 + k * 0.25) % 1;
        const ps = P(Math.sin(sec * 2 + k) * r(0.04), -ph * r(0.08), r(0.96 + ph * 0.28));
        ell(ps, r(0.06 + ph * 0.09), r(0.04 + ph * 0.06), `rgba(241, 245, 249, ${(1 - ph) * 0.65})`);
      }

    } else if (theme === 'medieval') {
      // Heavy iron-bound oak timber post + rotating Knight's Quintain Training Dummy at the top
      cone(Rtw * 1.4, Rtw * 1.05, Z0 + r(0.025), r(0.18), '#64748b', '#94a3b8'); // Stone plinth
      isoBox(-Rtw * 0.72, Rtw * 0.72, -Rtw * 0.72, Rtw * 0.72, r(0.18), r(0.68), '#78350f', '#451a03', '#92400e');
      // Forged iron strapping bands
      [0.24, 0.40, 0.58, 0.66].forEach(z => {
        isoBox(-Rtw * 0.78, Rtw * 0.78, -Rtw * 0.78, Rtw * 0.78, r(z), r(z + 0.022), '#334155', '#1e293b', '#475569');
      });
      // Quintain Training Dummy torso, crossbar, shield & sandbag flail atop the post
      cyl(Rtw * 0.58, r(0.68), r(0.84), '#94a3b8', '#cbd5e1'); // Steel breastplate cuirass
      cyl(Rtw * 0.46, r(0.70), r(0.76), accent, false);        // Heraldic surcoat belt
      // Dummy crossbar arms spinning slowly with the ride
      const qa = sec * 1.4;
      const qL = P(Math.cos(qa) * r(0.22), Math.sin(qa) * r(0.22), r(0.79));
      const qR = P(-Math.cos(qa) * r(0.22), -Math.sin(qa) * r(0.22), r(0.79));
      line(qL, qR, '#78350f', r(0.026));
      // Target shield on one arm, swinging sandbag on the other
      ell(qL, r(0.055), r(0.065), accent, '#fbbf24', r(0.008));
      line(qR, [qR[0], qR[1] + r(0.07)], '#d6d3d1', r(0.008));
      ell([qR[0], qR[1] + r(0.08)], r(0.038), r(0.045), '#a8a29e', '#57534e', r(0.006));
      // Great Helm with Visor Slits & Flowing Feather Plume
      cyl(Rtw * 0.44, r(0.84), r(0.95), '#cbd5e1', '#f8fafc');
      const pHelm = P(0, 0, r(0.90));
      line([pHelm[0] - r(0.04), pHelm[1]], [pHelm[0] + r(0.04), pHelm[1]], '#0f172a', r(0.010));
      const pPlume = P(0, 0, r(0.96));
      poly([pPlume, [pPlume[0] - r(0.08), pPlume[1] - r(0.09)], [pPlume[0] + r(0.02), pPlume[1] - r(0.13)], [pPlume[0] + r(0.09), pPlume[1] - r(0.05)]], accent);

    } else if (theme === 'frontier') {
      // Giant Rough-Bark Cedar Tree Stump & Log Mill Frame with Bite-Notches & Embedded Splitting Wedge
      cone(Rtw * 1.65, Rtw * 1.18, Z0 + r(0.025), r(0.22), '#5c3a21', '#7c4d2b');
      cyl(Rtw * 1.15, r(0.22), r(0.78), '#6e472b', '#eab308');
      // Vertical bark ridges
      for (let k = -2; k <= 2; k++) {
        const a = Math.PI * 0.25 + k * 0.42;
        line(P(Math.cos(a) * Rtw * 1.12, Math.sin(a) * Rtw * 1.12, r(0.20)), P(Math.cos(a) * Rtw * 1.12, Math.sin(a) * Rtw * 1.12, r(0.77)), '#3e2723', r(0.015));
      }
      // Fresh golden heartwood rings on top of the stump
      const pStump = P(0, 0, r(0.78));
      ell(pStump, Rtw * 1.12, Rtw * 0.56, '#fde68a', '#92400e', r(0.012));
      ell(pStump, Rtw * 0.75, Rtw * 0.37, null, '#d97706', r(0.006));
      ell(pStump, Rtw * 0.38, Rtw * 0.19, null, '#b45309', r(0.006));
      // Giant Paul Bunyan Double-Bit Splitting Axe embedded into the top of the stump!
      poly([
        [pStump[0] - r(0.11), pStump[1] - r(0.02)],
        [pStump[0] + r(0.09), pStump[1] - r(0.11)],
        [pStump[0] + r(0.12), pStump[1] + r(0.02)],
        [pStump[0] - r(0.06), pStump[1] + r(0.04)]
      ], '#cbd5e1', '#475569', r(0.008));
      line([pStump[0] + r(0.01), pStump[1] - r(0.04)], [pStump[0] - r(0.14), pStump[1] - r(0.22)], '#b45309', r(0.024));

    } else if (theme === 'fiesta') {
      // Layered Paper-Fringe Piñata Pillar topped with a Festive Día de los Muertos Sugar Skull (Calavera)
      const fringeCols = ['#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#a855f7', '#ef4444'];
      for (let i = 0; i < 6; i++) {
        const zA = r(0.04 + i * 0.11), zB = r(0.16 + i * 0.11);
        cyl(Rtw * (1.18 - i * 0.02), zA, zB, fringeCols[i % fringeCols.length], false);
      }
      // Giant Sculpted White Calavera (Sugar Skull) Crown with Marigold Eyes & Sombrero
      const pSk = P(0, 0, r(0.80));
      ell(pSk, r(0.15), r(0.14), '#f8fafc', '#1e293b', r(0.008));
      // Jaw & grinning teeth
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(pSk[0] - r(0.08), pSk[1] + r(0.06), r(0.16), r(0.07));
      for (let k = -2; k <= 2; k++) {
        line([pSk[0] + k * r(0.028), pSk[1] + r(0.06)], [pSk[0] + k * r(0.028), pSk[1] + r(0.12)], '#1e293b', r(0.006));
      }
      // Scalloped marigold eye sockets
      [-1, 1].forEach(s => {
        const ex = pSk[0] + s * r(0.055), ey = pSk[1] - r(0.01);
        ell([ex, ey], r(0.038), r(0.038), '#ec4899', '#facc15', r(0.007));
        ell([ex, ey], r(0.018), r(0.018), '#0f172a');
      });
      // Upside-down heart nose
      poly([[pSk[0], pSk[1] + r(0.01)], [pSk[0] - r(0.02), pSk[1] + r(0.045)], [pSk[0] + r(0.02), pSk[1] + r(0.045)]], '#0f172a');
      // Charro Sombrero crowning the Sugar Skull
      const pHat = [pSk[0], pSk[1] - r(0.11)];
      ell(pHat, r(0.24), r(0.07), '#1e1b4b', '#facc15', r(0.010));
      poly([[pHat[0] - r(0.09), pHat[1]], [pHat[0] - r(0.05), pHat[1] - r(0.11)], [pHat[0] + r(0.05), pHat[1] - r(0.11)], [pHat[0] + r(0.09), pHat[1]]], '#1e1b4b', '#ec4899', r(0.008));

    } else if (theme === 'space') {
      // Sleek White/Titanium Aero-Spire with Glowing Cyan Tachyon Core & Levitating Gyro-Rings
      cone(Rtw * 1.5, Rtw * 1.05, Z0 + r(0.025), r(0.20), '#0f172a', '#1e293b');
      cyl(Rtw * 0.72, r(0.20), r(0.74), '#38bdf8', '#bae6fd'); // Inner glowing plasma core
      // 3 Sleek curved white titanium armor fins around the core
      [-1, 1].forEach(s => {
        const pB = P(s * Rtw * 1.05, s * Rtw * 0.4, r(0.18));
        const pT = P(s * Rtw * 0.85, s * Rtw * 0.3, r(0.74));
        line(pB, pT, '#f8fafc', r(0.036));
        line(pB, pT, '#94a3b8', r(0.014));
      });
      // Levitating Singularity Orb & Counter-Rotating Gyro Halo at the apex
      const pOrb = P(0, 0, r(0.88));
      ell(pOrb, r(0.09), r(0.09), '#0ea5e9', '#e0f2fe', r(0.010));
      ell([pOrb[0] - r(0.025), pOrb[1] - r(0.025)], r(0.03), r(0.03), '#ffffff');
      ell(pOrb, r(0.19), r(0.065), null, '#38bdf8', r(0.012), Math.sin(sec * 2) * 0.45);
      ell(pOrb, r(0.16), r(0.055), null, accent, r(0.009), -Math.cos(sec * 2) * 0.45);

    } else if (theme === 'bavarian') {
      // Lederhosen Suede-Brown Pillar with Green Embroidered Suspenders, Horn Buttons & Alpine Tirolerhut Hat Crown
      cyl(Rtw * 1.25, Z0 + r(0.025), r(0.18), '#d97706', '#f59e0b'); // Carved oak keg base
      cyl(Rtw * 1.08, r(0.18), r(0.75), '#5c3a21', '#78350f');        // Rich suede leather trunk
      // Green-trimmed Lederhosen H-suspenders & Edelweiss chestlatz
      const pCh = P(0, 0, r(0.55));
      [-0.07, 0.07].forEach(dx => {
        line([pCh[0] + r(dx), pCh[1] + r(0.22)], [pCh[0] + r(dx), pCh[1] - r(0.18)], '#15803d', r(0.032));
        line([pCh[0] + r(dx), pCh[1] + r(0.22)], [pCh[0] + r(dx), pCh[1] - r(0.18)], '#86efac', r(0.008));
        // Stag-horn buttons
        ell([pCh[0] + r(dx), pCh[1] + r(0.14)], r(0.018), r(0.018), '#fef3c7', '#78350f', r(0.004));
      });
      // Horizontal chest strap ("Steg") with embroidered white Edelweiss flower
      poly([
        [pCh[0] - r(0.09), pCh[1] - r(0.02)],
        [pCh[0] + r(0.09), pCh[1] - r(0.02)],
        [pCh[0] + r(0.09), pCh[1] + r(0.06)],
        [pCh[0] - r(0.09), pCh[1] + r(0.06)]
      ], '#15803d', '#fde047', r(0.006));
      ell([pCh[0], pCh[1] + r(0.02)], r(0.022), r(0.022), '#ffffff', '#facc15', r(0.006));
      // Alpine Green Felt Tirolerhut (Bavarian Hat) with Red Cord & White Gamsbart Feather Plume
      const pHat = P(0, 0, r(0.77));
      ell(pHat, Rtw * 1.45, Rtw * 0.65, '#15803d', '#14532d', r(0.010));
      cone(Rtw * 1.05, Rtw * 0.65, r(0.77), r(0.95), '#166534', '#15803d');
      cyl(Rtw * 1.02, r(0.78), r(0.81), '#dc2626', false); // Red hatband cord
      // White feather plume
      poly([[pHat[0] + r(0.08), pHat[1] - r(0.04)], [pHat[0] + r(0.20), pHat[1] - r(0.18)], [pHat[0] + r(0.12), pHat[1] - r(0.20)]], '#f8fafc', '#cbd5e1', r(0.005));

    } else if (theme === 'gothic') {
      // Frankenstein's Dark Steampunk Galvanic Spire with Copper Induction Coils, Spur Gears & Jacob's Ladder Lightning
      cone(Rtw * 1.5, Rtw * 1.15, Z0 + r(0.025), r(0.20), '#1e1b4b', '#312e81');
      // Glowing green galvanic electrolyte chamber at base
      cyl(Rtw * 0.92, r(0.16), r(0.34), '#10b981', '#34d399');
      for (let i = -3; i <= 3; i++) {
        const a = i * 0.35;
        line(P(Math.cos(a) * Rtw, Math.sin(a) * Rtw, r(0.16)), P(Math.cos(a) * Rtw, Math.sin(a) * Rtw, r(0.34)), '#0f172a', r(0.014));
      }
      // Dark gunmetal gearbox with bronze spur gears
      cyl(Rtw * 1.08, r(0.34), r(0.64), '#1e293b', '#334155');
      drawIsoGear(Rtw * 1.08, 0, Zhub, 'X', r(0.14), 12, omega, '#7c2d12', '#d97706');
      drawIsoGear(0, Rtw * 1.08, Zhub, 'Y', r(0.14), 12, -omega, '#7c2d12', '#d97706');
      // Stacked Copper Tesla Toroid Rings
      [0.65, 0.71, 0.77].forEach((z, idx) => {
        cyl(Rtw * (1.28 - idx * 0.14), r(z), r(z + 0.038), '#b45309', '#f59e0b');
      });
      // Twin V-shaped Jacob's Ladder Electrodes with Climbing Electric Arcs!
      const pBase = P(0, 0, r(0.81));
      const pL = [pBase[0] - r(0.14), pBase[1] - r(0.22)], pR = [pBase[0] + r(0.14), pBase[1] - r(0.22)];
      line([pBase[0] - r(0.04), pBase[1]], pL, '#94a3b8', r(0.016));
      line([pBase[0] + r(0.04), pBase[1]], pR, '#94a3b8', r(0.016));
      ell(pL, r(0.028), r(0.028), '#f59e0b', '#78350f', r(0.006));
      ell(pR, r(0.028), r(0.028), '#f59e0b', '#78350f', r(0.006));
      // Animated climbing lightning arc between the electrodes
      const arcH = (sec * 1.8) % 1;
      const axL = pBase[0] - r(0.04 + arcH * 0.10), axR = pBase[0] + r(0.04 + arcH * 0.10);
      const ay = pBase[1] - arcH * r(0.21);
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = r(0.014);
      ctx.beginPath();
      ctx.moveTo(axL, ay);
      ctx.lineTo((axL + axR) * 0.5, ay - r(0.035) + Math.sin(sec * 35) * r(0.02));
      ctx.lineTo(axR, ay);
      ctx.stroke();

    } else if (theme === 'classic') {
      // Fun Carnival Midway Tower with Red/Cream Vertical Stripes, Chasing Bulb Rings & Spinning Starburst Crown
      cone(Rtw * 1.45, Rtw * 1.12, Z0 + r(0.025), r(0.18), accent, '#fde047');
      cyl(Rtw * 1.06, r(0.18), r(0.74), '#fef3c7', '#fde68a');
      // Vertical carnival stripes
      for (let i = -2; i <= 2; i += 2) {
        const a = Math.PI * 0.25 + i * 0.35;
        line(P(Math.cos(a) * Rtw * 1.04, Math.sin(a) * Rtw * 1.04, r(0.19)), P(Math.cos(a) * Rtw * 1.04, Math.sin(a) * Rtw * 1.04, r(0.73)), accent, r(0.032));
      }
      // Chasing marquee bulb rings
      [0.20, 0.36, 0.62, 0.74].forEach((z, idx) => {
        cyl(Rtw * 1.15, r(z), r(z + 0.025), '#eab308', '#fef08a');
      });
      // Giant 12-Pointed Illuminated Carnival Starburst Crown
      const pSt = P(0, 0, r(0.90));
      const pts = [];
      for (let i = 0; i < 24; i++) {
        const a = sec * 1.2 + (i / 24) * TAU;
        const rad = (i % 2 === 0) ? r(0.17) : r(0.075);
        pts.push([pSt[0] + Math.cos(a) * rad, pSt[1] + Math.sin(a) * rad]);
      }
      poly(pts, '#facc15', accent, r(0.010));
      ell(pSt, r(0.055), r(0.055), accent, '#ffffff', r(0.008));

    } else if (theme === 'jungle') {
      // Mossy Temple Ruin Pillar Topped with a Giant Carved Stone Tiki / Mayan Idol Head & Flaming Crown Brazier
      isoBox(-Rtw * 0.95, Rtw * 0.95, -Rtw * 0.95, Rtw * 0.95, Z0 + r(0.025), r(0.22), '#8e8a72', '#6e6a56', '#bdb9a0');
      isoBox(-Rtw * 0.80, Rtw * 0.80, -Rtw * 0.80, Rtw * 0.80, r(0.22), r(0.62), '#a8a288', '#7d7762', '#d1cbb0');
      // Creeping jungle vines on the stone pillar
      const pV0 = P(-Rtw * 0.7, Rtw * 0.82, r(0.22)), pV1 = P(Rtw * 0.6, Rtw * 0.82, r(0.58));
      line(pV0, pV1, '#15803d', r(0.022));
      // Giant Carved Stone Idol Head at the top of the tower (r(0.62) .. r(0.92))
      isoBox(-Rtw * 1.05, Rtw * 1.05, -Rtw * 1.05, Rtw * 1.05, r(0.62), r(0.90), '#bdb9a0', '#8e8a72', '#dad7c3');
      const pFace = P(0, Rtw * 1.06, r(0.76));
      // Glowing jade/turquoise idol eyes & heavy brow ridge
      line([pFace[0] - r(0.12), pFace[1] - r(0.05)], [pFace[0] + r(0.12), pFace[1] - r(0.05)], '#57534e', r(0.024));
      ell([pFace[0] - r(0.055), pFace[1] - r(0.015)], r(0.032), r(0.024), '#10b981', '#064e3b', r(0.006));
      ell([pFace[0] + r(0.055), pFace[1] - r(0.015)], r(0.032), r(0.024), '#10b981', '#064e3b', r(0.006));
      // Grimacing stone mouth with carved fangs
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(pFace[0] - r(0.085), pFace[1] + r(0.03), r(0.17), r(0.048));
      for (let k = -2; k <= 2; k++) {
        poly([
          [pFace[0] + k * r(0.032) - r(0.012), pFace[1] + r(0.03)],
          [pFace[0] + k * r(0.032) + r(0.012), pFace[1] + r(0.03)],
          [pFace[0] + k * r(0.032), pFace[1] + r(0.065)]
        ], '#f5f5f4');
      }
      // Feathered headdress crest & flaming sacrificial bowl on top
      const pTop = P(0, 0, r(0.91));
      for (let k = -3; k <= 3; k++) {
        const a = -Math.PI * 0.5 + k * 0.22;
        line(pTop, [pTop[0] + Math.cos(a) * r(0.16), pTop[1] + Math.sin(a) * r(0.14)], k % 2 ? '#10b981' : '#ef4444', r(0.022));
      }
      const fh = r(0.12 + 0.03 * Math.sin(sec * 12));
      poly([[pTop[0] - r(0.06), pTop[1]], [pTop[0], pTop[1] - fh], [pTop[0] + r(0.06), pTop[1]]], '#f97316');
      poly([[pTop[0] - r(0.03), pTop[1]], [pTop[0], pTop[1] - fh * 0.65], [pTop[0] + r(0.03), pTop[1]]], '#fde047');

    } else if (theme === 'alps') {
      // Heavy-Duty Municipal Orange & Hazard-Yellow Rotary Glacier Snowblower Tower with Directional Snow Chute
      cone(Rtw * 1.5, Rtw * 1.15, Z0 + r(0.025), r(0.20), '#334155', '#475569');
      // Hazard-striped lower housing
      cyl(Rtw * 1.12, r(0.20), r(0.36), '#facc15', '#eab308');
      for (let i = -2; i <= 2; i++) {
        const a = Math.PI * 0.25 + i * 0.35;
        line(P(Math.cos(a) * Rtw * 1.12, Math.sin(a) * Rtw * 1.12, r(0.21)), P(Math.cos(a + 0.2) * Rtw * 1.12, Math.sin(a + 0.2) * Rtw * 1.12, r(0.35)), '#0f172a', r(0.018));
      }
      // Heavy orange snowblower impeller housing
      cyl(Rtw * 1.08, r(0.36), r(0.68), '#ea580c', '#f97316');
      drawIsoGear(Rtw * 1.08, 0, Zhub, 'X', r(0.14), 10, omega, '#475569', '#cbd5e1');
      drawIsoGear(0, Rtw * 1.08, Zhub, 'Y', r(0.14), 10, -omega, '#475569', '#cbd5e1');
      // Curved Directional Snow-Ejection Chute Hood at the Summit + Amber Strobe + Blowing Snow Plume!
      cyl(Rtw * 0.82, r(0.68), r(0.84), '#ea580c', '#c2410c');
      const pChute = P(0, 0, r(0.84));
      poly([
        [pChute[0] - r(0.10), pChute[1]],
        [pChute[0] - r(0.06), pChute[1] - r(0.14)],
        [pChute[0] + r(0.15), pChute[1] - r(0.17)],
        [pChute[0] + r(0.16), pChute[1] - r(0.06)],
        [pChute[0] + r(0.08), pChute[1]]
      ], '#f97316', '#9a3412', r(0.008));
      // Spraying snow particles arc out of the chute!
      for (let k = 0; k < 5; k++) {
        const ph = (sec * 1.6 + k * 0.2) % 1;
        const sx = pChute[0] + r(0.15 + ph * 0.22);
        const sy = pChute[1] - r(0.13 + ph * 0.06 - ph * ph * 0.14);
        ell([sx, sy], r(0.025 + ph * 0.03), r(0.02 + ph * 0.025), `rgba(248, 250, 252, ${(1 - ph) * 0.8})`);
      }
      // Flashing amber snowplow beacon
      ell([pChute[0] - r(0.02), pChute[1] - r(0.16)], r(0.026), r(0.026), Math.sin(sec * 10) > 0 ? '#facc15' : '#ea580c', '#ffffff', r(0.005));

    } else if (theme === 'nordic') {
      // Carved Dark-Pine Stave Pillar Crowned with a Fierce Sculpted Wood Dragon Head (Drakkar Prow)
      cyl(Rtw * 1.4, Z0 + r(0.025), r(0.18), '#475569', '#64748b'); // Fjord stone base
      cyl(Rtw * 1.05, r(0.18), r(0.72), '#451a03', '#78350f');        // Tarred stave timber column
      // Golden rune rings
      [0.22, 0.36, 0.62, 0.70].forEach(z => cyl(Rtw * 1.12, r(z), r(z + 0.022), '#d97706', '#fbbf24'));
      // Sculpted Wooden Dragon Head Prow rising from the pillar summit!
      const pBase = P(0, 0, r(0.72));
      // S-curved dragon neck with carved golden scales
      poly([
        [pBase[0] - r(0.09), pBase[1]],
        [pBase[0] - r(0.12), pBase[1] - r(0.16)],
        [pBase[0] - r(0.03), pBase[1] - r(0.28)],
        [pBase[0] + r(0.07), pBase[1] - r(0.22)],
        [pBase[0] + r(0.08), pBase[1]]
      ], '#78350f', '#451a03', r(0.009));
      // Dorsal golden spine fins along the neck
      for (let k = 0; k < 4; k++) {
        const ny = pBase[1] - r(0.05 + k * 0.055);
        poly([[pBase[0] - r(0.10), ny], [pBase[0] - r(0.17), ny - r(0.025)], [pBase[0] - r(0.09), ny - r(0.04)]], '#f59e0b');
      }
      // Snarling sculpted wooden dragon head, open jaws, fangs & swept horns
      const pHd = [pBase[0] + r(0.02), pBase[1] - r(0.25)];
      // Upper snout
      poly([pHd, [pHd[0] + r(0.18), pHd[1] - r(0.05)], [pHd[0] + r(0.15), pHd[1] + r(0.02)], [pHd[0] + r(0.02), pHd[1] + r(0.02)]], '#92400e', '#451a03', r(0.007));
      // Lower jaw + red tongue
      poly([[pHd[0] + r(0.02), pHd[1] + r(0.03)], [pHd[0] + r(0.15), pHd[1] + r(0.08)], [pHd[0] + r(0.12), pHd[1] + r(0.11)], [pHd[0], pHd[1] + r(0.06)]], '#78350f', '#451a03', r(0.007));
      line([pHd[0] + r(0.06), pHd[1] + r(0.03)], [pHd[0] + r(0.19), pHd[1] + r(0.04)], '#ef4444', r(0.010));
      // Swept golden horns & glowing rune eye
      line([pHd[0], pHd[1] - r(0.02)], [pHd[0] - r(0.14), pHd[1] - r(0.11)], '#fbbf24', r(0.018));
      ell([pHd[0] + r(0.06), pHd[1] - r(0.015)], r(0.016), r(0.012), '#38bdf8');

    } else {
      // UNTHEMED STANDARD: Geared Steampunk Dynamo Tower (from reference photo)
      cone(Rtw * 1.48, Rtw * 1.15, Z0 + r(0.025), r(0.14), '#64748b', '#94a3b8');
      cyl(Rtw * 0.88, r(0.14), r(0.32), '#1e293b', false);
      const glow = 0.75 + 0.25 * Math.sin(sec * 6);
      for (let k = 0; k < 3; k++) {
        const zc = r(0.17 + k * 0.045);
        cyl(Rtw * 0.82, zc, zc + r(0.022), glow > 0.85 ? '#fb923c' : accent, false);
      }
      for (let i = 0; i < 9; i++) {
        const a = -0.3 + (i / 8) * (Math.PI + 0.6);
        const x = Math.cos(a) * Rtw * 1.04, y = Math.sin(a) * Rtw * 1.04;
        line(P(x, y, r(0.14)), P(x, y, r(0.32)), '#94a3b8', r(0.011));
      }
      cyl(Rtw * 1.12, r(0.32), r(0.36), '#64748b', '#cbd5e1');
      cyl(Rtw * 1.02, r(0.36), r(0.62), '#64748b', '#94a3b8');
      drawIsoGear(Rtw * 1.05, 0, Zhub, 'X', r(0.14), 12, omega, '#94a3b8', '#475569');
      drawIsoGear(0, Rtw * 1.05, Zhub, 'Y', r(0.14), 12, -omega, '#94a3b8', '#475569');
      cyl(Rtw * 1.08, r(0.61), r(0.66), '#78350f', '#b45309');
      for (let k = 0; k < 4; k++) {
        const zRing = r(0.66 + k * 0.028);
        const rad = Rtw * (0.98 - k * 0.08);
        cyl(rad, zRing, zRing + r(0.020), k % 2 ? '#92400e' : '#d97706', '#f59e0b');
      }
      const Zfin = r(0.77);
      for (let k = 0; k < 6; k++) {
        const zf = Zfin + r(k * 0.024);
        const rad = Rtw * (0.58 - k * 0.04);
        cyl(rad, zf, zf + r(0.016), k % 2 ? '#334155' : '#94a3b8', '#cbd5e1');
      }
    }
  }

  // 3. SELF-LEVELING PASSENGER GONDOLA POD (8 pods total — themed per variant!)
  function drawGondolaPod(tipX, tipY, tipZ, armIdx, endIdx) {
    const pc = P(tipX, tipY, tipZ);
    const rx = r(0.125), ry = r(0.118);
    const shirtColors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308'];

    // Draw 4 seated riders helper
    const drawRiders = (yOff = 0, helmCol = null) => {
      for (let s = 0; s < 4; s++) {
        const sx = pc[0] + (s - 1.5) * r(0.036);
        const sy = pc[1] + r(0.012) + yOff;
        line([sx - r(0.005), sy + r(0.022)], [sx - r(0.006), sy + r(0.046)], '#1e293b', r(0.009));
        line([sx + r(0.005), sy + r(0.022)], [sx + r(0.006), sy + r(0.046)], '#1e293b', r(0.009));
        ctx.fillStyle = shirtColors[(s + armIdx + endIdx) % 4];
        ctx.fillRect(sx - r(0.013), sy - r(0.004), r(0.026), r(0.026));
        ell([sx, sy - r(0.014)], r(0.011), r(0.011), '#fde4c8');
        if (helmCol) ell([sx, sy - r(0.018)], r(0.013), r(0.009), helmCol);
        line([sx - r(0.010), sy - r(0.004)], [sx - r(0.005), sy + r(0.016)], accent, r(0.006));
        line([sx + r(0.010), sy - r(0.004)], [sx + r(0.005), sy + r(0.016)], accent, r(0.006));
      }
    };

    if (theme === 'bavarian') {
      // Giant Dimpled Glass & Pewter Oktoberfest Beer Mugs (Maßkrüge) with Overflowing White Foam!
      const mw = r(0.095), mh = r(0.088);
      // Curved glass mug handle on the right side
      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = r(0.020);
      ctx.beginPath();
      ctx.arc(pc[0] + mw * 0.92, pc[1] + r(0.01), r(0.042), -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
      // Golden Amber Beer Mug Cylinder
      poly([
        [pc[0] - mw, pc[1] - mh * 0.4],
        [pc[0] + mw, pc[1] - mh * 0.4],
        [pc[0] + mw * 0.92, pc[1] + mh * 0.7],
        [pc[0] - mw * 0.92, pc[1] + mh * 0.7]
      ], '#f59e0b', '#fef3c7', r(0.010));
      // Glass dimple highlights
      for (let gx = -1; gx <= 1; gx++) {
        ell([pc[0] + gx * r(0.048), pc[1] + r(0.02)], r(0.018), r(0.026), 'rgba(255,255,255,0.35)');
      }
      // Pewter bottom foot rim
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(pc[0] - mw * 0.94, pc[1] + mh * 0.62, mw * 1.88, r(0.018));
      // Riders sitting in the frothy top of the mug
      drawRiders(-r(0.022));
      // Billowing white beer foam puffs along the mug rim!
      [-0.07, -0.025, 0.025, 0.07].forEach((fx, idx) => {
        ell([pc[0] + r(fx), pc[1] - mh * 0.38 + (idx % 2) * r(0.008)], r(0.038), r(0.024), '#ffffff', '#e2e8f0', r(0.004));
      });

    } else if (theme === 'medieval') {
      // Ornate Heater / Kite Heraldic Shields with Gold Rim & Lion Boss
      drawRiders(-r(0.012), '#94a3b8');
      // Kite shield silhouette in front of the lower carriage
      const sw = r(0.105), sh = r(0.115);
      poly([
        [pc[0] - sw, pc[1] - sh * 0.35],
        [pc[0] + sw, pc[1] - sh * 0.35],
        [pc[0] + sw * 0.85, pc[1] + sh * 0.25],
        [pc[0], pc[1] + sh * 0.85],
        [pc[0] - sw * 0.85, pc[1] + sh * 0.25]
      ], (armIdx + endIdx) % 2 ? '#b91c1c' : '#1d4ed8', '#fbbf24', r(0.014));
      // Quartered gold cross & shield boss on the shield face
      line([pc[0], pc[1] - sh * 0.32], [pc[0], pc[1] + sh * 0.78], '#fbbf24', r(0.016));
      line([pc[0] - sw * 0.88, pc[1] + sh * 0.12], [pc[0] + sw * 0.88, pc[1] + sh * 0.12], '#fbbf24', r(0.016));
      ell([pc[0], pc[1] + sh * 0.12], r(0.026), r(0.026), '#fde047', '#78350f', r(0.006));

    } else if (theme === 'frontier') {
      // Double-Bit Lumberjack Steel Axe Head & Fresh-Cut Log Gondola
      const bw = r(0.145), bh = r(0.105);
      // Flared Crescent Steel Axe Blades on Left & Right of the Pod!
      [-1, 1].forEach(s => {
        poly([
          [pc[0] + s * r(0.04), pc[1] - bh * 0.45],
          [pc[0] + s * bw, pc[1] - bh * 0.85],
          [pc[0] + s * (bw + r(0.025)), pc[1]],
          [pc[0] + s * bw, pc[1] + bh * 0.85],
          [pc[0] + s * r(0.04), pc[1] + bh * 0.45]
        ], '#334155', '#e2e8f0', r(0.012));
        // Honed silver cutting edge
        line([pc[0] + s * bw, pc[1] - bh * 0.82], [pc[0] + s * (bw + r(0.025)), pc[1]], '#f8fafc', r(0.016));
        line([pc[0] + s * (bw + r(0.025)), pc[1]], [pc[0] + s * bw, pc[1] + bh * 0.82], '#f8fafc', r(0.016));
      });
      // Hollowed timber log seat in the eye of the axe
      poly([
        [pc[0] - r(0.085), pc[1] + r(0.01)],
        [pc[0] + r(0.085), pc[1] + r(0.01)],
        [pc[0] + r(0.075), pc[1] + r(0.055)],
        [pc[0] - r(0.075), pc[1] + r(0.055)]
      ], '#78350f', '#451a03', r(0.007));
      drawRiders(0, '#b91c1c');

    } else if (theme === 'nordic') {
      // Giant Viking Bearded Crescent Battle-Axe Blades with Nordic Runes & Shield Boss
      const bw = r(0.148), bh = r(0.115);
      [-1, 1].forEach(s => {
        poly([
          [pc[0] + s * r(0.035), pc[1] - bh * 0.35],
          [pc[0] + s * bw, pc[1] - bh * 0.75],
          [pc[0] + s * (bw + r(0.03)), pc[1] + bh * 0.1],
          [pc[0] + s * (bw * 0.85), pc[1] + bh * 0.95], // Bearded lower hook!
          [pc[0] + s * r(0.035), pc[1] + bh * 0.35]
        ], '#475569', '#f59e0b', r(0.010));
        // Gleaming silver axe edge
        line([pc[0] + s * bw, pc[1] - bh * 0.72], [pc[0] + s * (bw + r(0.03)), pc[1] + bh * 0.1], '#f8fafc', r(0.016));
        line([pc[0] + s * (bw + r(0.03)), pc[1] + bh * 0.1], [pc[0] + s * (bw * 0.85), pc[1] + bh * 0.92], '#f8fafc', r(0.016));
      });
      drawRiders(0, '#f59e0b');
      // Round Viking shield boss on front safety bar
      ell([pc[0], pc[1] + r(0.025)], r(0.028), r(0.028), '#b91c1c', '#fbbf24', r(0.006));

    } else if (theme === 'jungle') {
      // Giant Carved Stone Idol Hands cradling the riders in their open palms!
      // Stone palm base
      poly([
        [pc[0] - r(0.115), pc[1] + r(0.015)],
        [pc[0] + r(0.115), pc[1] + r(0.015)],
        [pc[0] + r(0.095), pc[1] + r(0.070)],
        [pc[0] - r(0.095), pc[1] + r(0.070)]
      ], '#a8a288', '#57534e', r(0.008));
      // 4 Carved stone fingers curling up behind the riders + 1 thumb on the side
      for (let f = 0; f < 4; f++) {
        const fx = pc[0] + (f - 1.5) * r(0.052);
        poly([
          [fx - r(0.020), pc[1] + r(0.015)],
          [fx + r(0.020), pc[1] + r(0.015)],
          [fx + r(0.016), pc[1] - r(0.075)],
          [fx - r(0.016), pc[1] - r(0.075)]
        ], '#bdb9a0', '#6e6a56', r(0.006));
      }
      // Carved stone thumb curling around the left side + glowing jade wrist cuff
      poly([
        [pc[0] - r(0.115), pc[1] + r(0.03)],
        [pc[0] - r(0.145), pc[1] - r(0.03)],
        [pc[0] - r(0.105), pc[1] - r(0.045)],
        [pc[0] - r(0.090), pc[1] + r(0.02)]
      ], '#d1cbb0', '#57534e', r(0.006));
      drawRiders(0);
      // Turquoise/Jade sacrificial wrist band across the palm base
      ctx.fillStyle = '#10b981';
      ctx.fillRect(pc[0] - r(0.092), pc[1] + r(0.052), r(0.184), r(0.016));

    } else if (theme === 'fiesta') {
      // 7-Pointed Conical Star Piñata Gondola with Rainbow Paper Cones & Streaming Tassels
      const coneCols = ['#ec4899', '#facc15', '#10b981', '#3b82f6', '#f97316', '#a855f7', '#ef4444'];
      for (let k = 0; k < 7; k++) {
        const a = -Math.PI * 0.5 + (k / 7) * TAU;
        const bx1 = pc[0] + Math.cos(a - 0.25) * r(0.075), by1 = pc[1] + Math.sin(a - 0.25) * r(0.075);
        const bx2 = pc[0] + Math.cos(a + 0.25) * r(0.075), by2 = pc[1] + Math.sin(a + 0.25) * r(0.075);
        const tx = pc[0] + Math.cos(a) * r(0.155), ty = pc[1] + Math.sin(a) * r(0.155);
        poly([[bx1, by1], [tx, ty], [bx2, by2]], coneCols[k], '#ffffff', r(0.004));
        // Paper streamer tassels fluttering from each star point
        line([tx, ty], [tx + Math.sin(sec * 6 + k) * r(0.025), ty + r(0.035)], coneCols[(k + 2) % 7], r(0.007));
      }
      ell(pc, r(0.088), r(0.075), '#f59e0b', '#ec4899', r(0.010));
      drawRiders(0);

    } else if (theme === 'alps') {
      // Rotary Snowblower Bucket / Snowplow Scoop with Serrated Ice Teeth & Chew-Auger Drum
      // Orange steel snow-scoop bucket shell
      poly([
        [pc[0] - r(0.115), pc[1] - r(0.065)],
        [pc[0] + r(0.115), pc[1] - r(0.065)],
        [pc[0] + r(0.125), pc[1] + r(0.055)],
        [pc[0] - r(0.125), pc[1] + r(0.055)]
      ], '#ea580c', '#cbd5e1', r(0.010));
      // Yellow/Black hazard stripe along lower plow blade
      ctx.fillStyle = '#facc15';
      ctx.fillRect(pc[0] - r(0.120), pc[1] + r(0.038), r(0.240), r(0.018));
      // Serrated steel ice-breaker teeth on both side cheeks
      [-1, 1].forEach(s => {
        for (let k = -1; k <= 1; k++) {
          poly([
            [pc[0] + s * r(0.118), pc[1] + k * r(0.032) - r(0.012)],
            [pc[0] + s * r(0.148), pc[1] + k * r(0.032)],
            [pc[0] + s * r(0.118), pc[1] + k * r(0.032) + r(0.012)]
          ], '#e2e8f0', '#475569', r(0.004));
        }
      });
      drawRiders(0, '#38bdf8');

    } else if (theme === 'space') {
      // Sleek Glowing Cyan Orbital Gyro-Ring Pod with White Aero-Shell
      ell(pc, rx * 1.05, ry * 1.0, 'rgba(14, 165, 233, 0.14)', '#38bdf8', r(0.016));
      ell(pc, rx * 0.88, ry * 0.84, null, '#f8fafc', r(0.010));
      poly([
        [pc[0] - r(0.092), pc[1] + r(0.015)],
        [pc[0] + r(0.092), pc[1] + r(0.015)],
        [pc[0] + r(0.075), pc[1] + r(0.055)],
        [pc[0] - r(0.075), pc[1] + r(0.055)]
      ], '#f8fafc', '#0284c7', r(0.008));
      drawRiders(0, '#e2e8f0');

    } else if (theme === 'gothic') {
      // Copper & Wrought-Iron Victorian Tesla Faraday Cage with Glowing Green Insulators
      ell(pc, rx, ry, 'rgba(16, 185, 129, 0.10)', '#b45309', r(0.015));
      for (let k = 0; k < 8; k++) {
        const a = k * TAU / 8;
        line(pc, [pc[0] + Math.cos(a) * rx, pc[1] + Math.sin(a) * ry], '#78350f', r(0.007));
      }
      // Glowing green glass insulator bulbs on top & sides of the cage
      [[0, -ry], [-rx, 0], [rx, 0]].forEach(([dx, dy]) => {
        ell([pc[0] + dx, pc[1] + dy], r(0.018), r(0.018), '#10b981', '#ecfdf5', r(0.004));
      });
      drawRiders(0);

    } else if (theme === 'western') {
      // Iron-Rimmed Locomotive spoked Wheel Cage & Riveted Coal-Tender Car
      ell(pc, rx, ry, null, '#78350f', r(0.018));
      ell(pc, rx * 0.90, ry * 0.90, null, '#eab308', r(0.008));
      for (let k = 0; k < 8; k++) {
        const a = k * TAU / 8;
        line(pc, [pc[0] + Math.cos(a) * rx * 0.9, pc[1] + Math.sin(a) * ry * 0.9], '#92400e', r(0.008));
      }
      poly([
        [pc[0] - r(0.092), pc[1] + r(0.015)],
        [pc[0] + r(0.092), pc[1] + r(0.015)],
        [pc[0] + r(0.082), pc[1] + r(0.058)],
        [pc[0] - r(0.082), pc[1] + r(0.058)]
      ], '#1e293b', '#eab308', r(0.008));
      drawRiders(0, '#78350f');

    } else {
      // STANDARD / CLASSIC MIDWAY: Circular Wheel Cage & Self-Leveling Gondola
      ell([pc[0], pc[1] - r(0.008)], rx * 0.96, ry * 0.92, null, theme === 'classic' ? '#fde047' : '#64748b', r(0.012));
      for (let k = 0; k < 6; k++) {
        const a = k * Math.PI / 3;
        line(pc, [pc[0] + Math.cos(a) * rx * 0.95, pc[1] + Math.sin(a) * ry * 0.92], '#94a3b8', r(0.006));
      }
      poly([
        [pc[0] - r(0.088), pc[1] + r(0.028)],
        [pc[0] + r(0.088), pc[1] + r(0.028)],
        [pc[0] + r(0.076), pc[1] + r(0.056)],
        [pc[0] - r(0.076), pc[1] + r(0.056)]
      ], theme === 'classic' ? accent : '#334155', '#1e293b', r(0.006));
      drawRiders(0);
      ell(pc, rx, ry, null, '#e2e8f0', r(0.014));
      ctx.strokeStyle = accent;
      ctx.lineWidth = r(0.018);
      ctx.beginPath();
      ctx.ellipse(pc[0], pc[1], rx, ry, 0, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    }
  }

  // 4. ARM BEAM & PIVOT HUB RENDERER (4 Intermeshing Arms — Customized per theme!)
  const armConfigs = [
    { idx: 0, side: 'X', sign: -1, axX: -r(0.24), axY: 0, ang:  omega },
    { idx: 1, side: 'Y', sign: -1, axX: 0, axY: -r(0.24), ang: -omega + Math.PI * 0.5 },
    { idx: 2, side: 'Y', sign:  1, axX: 0, axY:  r(0.24), ang:  omega + Math.PI * 0.5 },
    { idx: 3, side: 'X', sign:  1, axX:  r(0.24), axY: 0, ang: -omega }
  ];

  function drawCustomBeam(cfg, tipA, tipB) {
    const pA = P(tipA[0], tipA[1], tipA[2]);
    const pB = P(tipB[0], tipB[1], tipB[2]);
    const pHub = P(cfg.axX, cfg.axY, Zhub);
    const dx = pB[0] - pA[0], dy = pB[1] - pA[1], len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const nx = -uy, ny = ux;

    if (theme === 'medieval') {
      // Giant Double-Ended Broadsword Blade with Golden Cross-Guards & Fuller Groove!
      const wMid = r(0.044), wTip = r(0.026);
      poly([
        [pA[0] + nx * wTip, pA[1] + ny * wTip],
        [pHub[0] + nx * wMid, pHub[1] + ny * wMid],
        [pB[0] + nx * wTip, pB[1] + ny * wTip],
        [pB[0] - nx * wTip, pB[1] - ny * wTip],
        [pHub[0] - nx * wMid, pHub[1] - ny * wMid],
        [pA[0] - nx * wTip, pA[1] - ny * wTip]
      ], '#cbd5e1', '#475569', r(0.008));
      // Blood-grooves (fullers) + golden cross-hilt at hub
      line(pA, pB, '#f8fafc', r(0.014));
      line([pHub[0] - nx * r(0.095), pHub[1] - ny * r(0.095)], [pHub[0] + nx * r(0.095), pHub[1] + ny * r(0.095)], '#fbbf24', r(0.026));

    } else if (theme === 'frontier' || theme === 'nordic') {
      // Curved Hickory / Ash Wooden Axe Helves with Leather Grip Wraps
      const colWood = theme === 'nordic' ? '#78350f' : '#b45309';
      const w = r(0.034);
      poly([
        [pA[0] + nx * w, pA[1] + ny * w],
        [pB[0] + nx * w, pB[1] + ny * w],
        [pB[0] - nx * w, pB[1] - ny * w],
        [pA[0] - nx * w, pA[1] - ny * w]
      ], colWood, '#451a03', r(0.008));
      line(pA, pB, shade(colWood, 0.25), r(0.014));
      // Crossed leather grip bands along the handle
      for (let f = 0.2; f <= 0.8; f += 0.15) {
        const gx = pA[0] + dx * f, gy = pA[1] + dy * f;
        line([gx - nx * w, gy - ny * w], [gx + nx * w, gy + ny * w], '#292524', r(0.010));
      }

    } else if (theme === 'alps') {
      // Serrated Steel Rotary Snow-Auger Screw Arm with Orange Spiral Flights
      const w = r(0.038);
      poly([
        [pA[0] + nx * w, pA[1] + ny * w],
        [pB[0] + nx * w, pB[1] + ny * w],
        [pB[0] - nx * w, pB[1] - ny * w],
        [pA[0] - nx * w, pA[1] - ny * w]
      ], '#ea580c', '#9a3412', r(0.008));
      // Diagonal auger screw flights
      for (let f = 0.12; f <= 0.88; f += 0.11) {
        const gx = pA[0] + dx * f, gy = pA[1] + dy * f;
        line([gx - nx * w * 1.35, gy - ny * w * 1.35], [gx + nx * w * 1.35 + ux * r(0.025), gy + ny * w * 1.35 + uy * r(0.025)], '#e2e8f0', r(0.014));
      }

    } else if (theme === 'fiesta') {
      // Rainbow Striped Piñata Stick (Palo de Piñata) with Festive Ribbons
      const cols = ['#ec4899', '#facc15', '#10b981', '#3b82f6', '#f97316', '#a855f7'];
      const segs = 6, w = r(0.036);
      for (let k = 0; k < segs; k++) {
        const f0 = k / segs, f1 = (k + 1) / segs;
        const x0 = pA[0] + dx * f0, y0 = pA[1] + dy * f0;
        const x1 = pA[0] + dx * f1, y1 = pA[1] + dy * f1;
        poly([
          [x0 + nx * w, y0 + ny * w],
          [x1 + nx * w, y1 + ny * w],
          [x1 - nx * w, y1 - ny * w],
          [x0 - nx * w, y0 - ny * w]
        ], cols[k % cols.length], '#ffffff', r(0.004));
      }

    } else if (theme === 'jungle') {
      // Carved Totem Timber & Stone Arm Wrapped in Jungle Vines
      const w = r(0.040);
      poly([
        [pA[0] + nx * w, pA[1] + ny * w],
        [pB[0] + nx * w, pB[1] + ny * w],
        [pB[0] - nx * w, pB[1] - ny * w],
        [pA[0] - nx * w, pA[1] - ny * w]
      ], '#8e8a72', '#57534e', r(0.008));
      // Crisscrossing green jungle liana vines
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = r(0.014);
      ctx.beginPath();
      for (let f = 0.1; f <= 0.9; f += 0.1) {
        const s = (Math.round(f * 10) % 2 === 0) ? 1 : -1;
        const vx = pA[0] + dx * f + nx * w * s * 0.9;
        const vy = pA[1] + dy * f + ny * w * s * 0.9;
        f === 0.1 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy);
      }
      ctx.stroke();

    } else if (theme === 'space') {
      // Sleek Split-Pronged White Titanium & Glowing Cyan Energy Arm
      const w = r(0.038);
      poly([
        [pA[0] + nx * w, pA[1] + ny * w],
        [pB[0] + nx * w, pB[1] + ny * w],
        [pB[0] - nx * w, pB[1] - ny * w],
        [pA[0] - nx * w, pA[1] - ny * w]
      ], '#f8fafc', '#475569', r(0.008));
      line(pA, pB, '#0ea5e9', r(0.018));
      line(pA, pB, '#e0f2fe', r(0.006));

    } else if (theme === 'gothic') {
      // Copper Busbar & Dark Wrought-Iron Lattice Arm with Crackling Electricity
      const w = r(0.038);
      poly([
        [pA[0] + nx * w, pA[1] + ny * w],
        [pB[0] + nx * w, pB[1] + ny * w],
        [pB[0] - nx * w, pB[1] - ny * w],
        [pA[0] - nx * w, pA[1] - ny * w]
      ], '#1e293b', '#b45309', r(0.009));
      line(pA, pB, '#d97706', r(0.014));
      // Crackling green/cyan plasma line
      line(pA, pB, '#34d399', r(0.005));

    } else if (theme === 'bavarian') {
      // Blue-and-White Bavarian Lozenge Timber Beam
      const w = r(0.040);
      poly([
        [pA[0] + nx * w, pA[1] + ny * w],
        [pB[0] + nx * w, pB[1] + ny * w],
        [pB[0] - nx * w, pB[1] - ny * w],
        [pA[0] - nx * w, pA[1] - ny * w]
      ], '#f8fafc', '#78350f', r(0.009));
      for (let f = 0.15; f <= 0.85; f += 0.14) {
        const gx = pA[0] + dx * f, gy = pA[1] + dy * f;
        poly([
          [gx - ux * r(0.025), gy - uy * r(0.025)],
          [gx + nx * w * 0.85, gy + ny * w * 0.85],
          [gx + ux * r(0.025), gy + uy * r(0.025)],
          [gx - nx * w * 0.85, gy - ny * w * 0.85]
        ], '#1d4ed8');
      }

    } else {
      // STANDARD / WESTERN / CLASSIC: Heavy Tapered Riveted Steel Box-Beam / Locomotive Connecting Rod
      const wMid = r(0.046), wTip = r(0.028);
      const beamCol = theme === 'western' ? '#334155' : theme === 'classic' ? accent : '#94a3b8';
      const trimCol = theme === 'western' ? '#eab308' : theme === 'classic' ? '#fde047' : '#cbd5e1';
      poly([
        [pA[0] + nx * wTip, pA[1] + ny * wTip],
        [pHub[0] + nx * wMid, pHub[1] + ny * wMid],
        [pB[0] + nx * wTip, pB[1] + ny * wTip],
        [pB[0] - nx * wTip, pB[1] - ny * wTip],
        [pHub[0] - nx * wMid, pHub[1] - ny * wMid],
        [pA[0] - nx * wTip, pA[1] - ny * wTip]
      ], beamCol, shade(beamCol, -0.45), r(0.008));
      line(pA, pB, trimCol, r(0.014));
      for (let f = 0.12; f <= 0.88; f += 0.09) {
        if (Math.abs(f - 0.5) < 0.08) continue;
        const rxp = pA[0] + dx * f, ryp = pA[1] + dy * f;
        ell([rxp, ryp], r(0.007), r(0.007), '#1e293b');
      }
    }
  }

  function drawPivotHub(pHub, cfg) {
    if (theme === 'frontier') {
      // Spinning 16-Tooth Steel Circular Sawblade Hub!
      drawIsoGear(cfg.axX * 1.15, cfg.axY * 1.15, Zhub, cfg.side, r(0.095), 14, cfg.ang * 2, '#cbd5e1', '#475569');
      ell(pHub, r(0.036), r(0.036), '#b91c1c', '#f8fafc', r(0.006));
    } else if (theme === 'bavarian') {
      // Giant Golden Bavarian Pretzel / Copper Kettle Medallion Hub
      ell(pHub, r(0.078), r(0.078), '#b45309', '#fef3c7', r(0.010));
      ell(pHub, r(0.045), r(0.045), '#1d4ed8', '#ffffff', r(0.006));
    } else if (theme === 'medieval' || theme === 'nordic') {
      // Forged Iron & Gold Shield-Boss Medallion
      ell(pHub, r(0.080), r(0.080), '#475569', '#fbbf24', r(0.012));
      ell(pHub, r(0.038), r(0.038), '#f59e0b', '#78350f', r(0.006));
    } else if (theme === 'fiesta') {
      // Marigold Flower (Cempasúchil) Rosette Hub
      for (let k = 0; k < 8; k++) {
        const a = cfg.ang + k * TAU / 8;
        ell([pHub[0] + Math.cos(a) * r(0.055), pHub[1] + Math.sin(a) * r(0.055)], r(0.032), r(0.022), '#f97316', '#facc15', r(0.004), a);
      }
      ell(pHub, r(0.038), r(0.038), '#ec4899', '#ffffff', r(0.006));
    } else if (theme === 'jungle') {
      // Carved Jade & Gold Sun-Medallion Hub
      ell(pHub, r(0.082), r(0.082), '#10b981', '#eab308', r(0.012));
      ell(pHub, r(0.042), r(0.042), '#a8a288', '#064e3b', r(0.006));
    } else if (theme === 'space') {
      // Glowing Cyan Tachyon Turbine Hub
      ell(pHub, r(0.082), r(0.082), '#0f172a', '#38bdf8', r(0.012));
      ell(pHub, r(0.045), r(0.045), '#38bdf8', '#ffffff', r(0.006));
    } else {
      // Signature 5-Cylinder Radial Star Engine Hub (Standard, Western, Gothic, Classic, Alps)
      const cylCol = theme === 'western' ? '#b45309' : theme === 'gothic' ? '#7c2d12' : '#475569';
      const finCol = theme === 'western' ? '#fde047' : theme === 'gothic' ? '#f59e0b' : '#cbd5e1';
      for (let c = 0; c < 5; c++) {
        const ca = cfg.ang + (c / 5) * TAU;
        const vx = Math.cos(ca), vy = Math.sin(ca);
        const cBase = [pHub[0] + vx * r(0.025), pHub[1] + vy * r(0.025)];
        const cTip  = [pHub[0] + vx * r(0.095), pHub[1] + vy * r(0.095)];
        line(cBase, cTip, cylCol, r(0.042));
        for (let f = 0.35; f <= 0.85; f += 0.22) {
          const fx = pHub[0] + vx * r(0.095 * f), fy = pHub[1] + vy * r(0.095 * f);
          line([fx - vy * r(0.022), fy + vx * r(0.022)], [fx + vy * r(0.022), fy - vx * r(0.022)], finCol, r(0.007));
        }
      }
      ell(pHub, r(0.046), r(0.046), '#334155', '#94a3b8', r(0.007));
      ell(pHub, r(0.030), r(0.030), accent, '#fde68a', r(0.005));
    }
  }

  function drawArmAssembly(cfg) {
    const u = Math.cos(cfg.ang) * Rarm;
    const v = Math.sin(cfg.ang) * Rarm;
    const tipA = cfg.side === 'X' ? [cfg.axX, cfg.axY + u, Zhub + v] : [cfg.axX + u, cfg.axY, Zhub + v];
    const tipB = cfg.side === 'X' ? [cfg.axX, cfg.axY - u, Zhub - v] : [cfg.axX - u, cfg.axY, Zhub - v];
    const depthA = tipA[0] + tipA[1];
    const depthB = tipB[0] + tipB[1];
    const pHub = P(cfg.axX, cfg.axY, Zhub);
    const pTowerMount = P(cfg.axX * 0.62, cfg.axY * 0.62, Zhub);

    // 1. Far-end gondola (if behind the arm beam)
    if (depthA < depthB) drawGondolaPod(tipA[0], tipA[1], tipA[2], cfg.idx, 0);
    else drawGondolaPod(tipB[0], tipB[1], tipB[2], cfg.idx, 1);

    // 2. Horizontal axle housing from tower if this is a front arm
    if (cfg.sign > 0) {
      line(pTowerMount, pHub, '#334155', r(0.055));
      line(pTowerMount, pHub, '#64748b', r(0.036));
    }

    // 3. Themed Double-Ended Swing Arm Beam
    drawCustomBeam(cfg, tipA, tipB);

    // 4. Themed Pivot Hub
    drawPivotHub(pHub, cfg);

    // 5. Near-end gondola (in front of the arm beam)
    if (depthA >= depthB) drawGondolaPod(tipA[0], tipA[1], tipA[2], cfg.idx, 0);
    else drawGondolaPod(tipB[0], tipB[1], tipB[2], cfg.idx, 1);

    if (cfg.sign < 0) {
      line(pHub, pTowerMount, '#1e293b', r(0.048));
    }
  }

  // === PAINTER'S ORDER EXECUTION ===
  // 1. Back two arms (-X and -Y)
  drawArmAssembly(armConfigs[0]);
  drawArmAssembly(armConfigs[1]);

  // 2. Central Tower & Summit Setpiece
  drawCentralTower();

  // 3. Front two arms (+Y and +X)
  drawArmAssembly(armConfigs[2]);
  drawArmAssembly(armConfigs[3]);

  // 4. Foreground Perimeter Fence
  const Rfen = r(0.58);
  for (let i = 0; i < 8; i++) {
    const a0 = -0.15 + (i / 8) * (Math.PI * 0.8);
    const a1 = -0.15 + ((i + 1) / 8) * (Math.PI * 0.8);
    const b0 = P(Math.cos(a0) * Rfen, Math.sin(a0) * Rfen, Z0 + r(0.02));
    const t0 = P(Math.cos(a0) * Rfen, Math.sin(a0) * Rfen, Z0 + r(0.095));
    const b1 = P(Math.cos(a1) * Rfen, Math.sin(a1) * Rfen, Z0 + r(0.02));
    const t1 = P(Math.cos(a1) * Rfen, Math.sin(a1) * Rfen, Z0 + r(0.095));
    line(b0, t0, '#94a3b8', r(0.008));
    line(t0, t1, accent, r(0.008));
    line([b0[0], (b0[1] + t0[1]) * 0.5], [b1[0], (b1[1] + t1[1]) * 0.5], '#64748b', r(0.005));
  }

  ctx.restore();
}
/* ===== END SPRITE CODE ===== */

/* ===== INTERACTIVE PREVIEW HARNESS ===== */
return Object.freeze({ draw: drawNebulaz });
})();
