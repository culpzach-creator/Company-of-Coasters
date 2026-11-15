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

/* ===== ENCLOSED BUMPER CARS 16-SKIN METADATA ===== */
const BUMPER_CAR_SKINS = {
  standard:     {id:'standard',     label:'Unthemed (Tier 0–2)', name:'Standard Midway Dodgems',     sub:'Steel Mesh Pavilion, Illuminated Marquee & Dodgems', sign:'DODGEMS',     hex:'#cbd5e1', border:'#ef4444', floor:'#334155', floor2:'#475569', curb:'#94a3b8', post:'#e2e8f0', roof:'#1e293b', trim:'#facc15', spark:'#38bdf8', cars:['#ef4444','#3b82f6','#22c55e','#facc15','#a855f7','#f97316']},
  classic:      {id:'classic',      label:'Classic Midway',      name:'Coney Island Dodgem Palace',  sub:'Red & Gold Scalloped Canopy, Bulb Marquee & Hot Rods', sign:'DODGEMS',     hex:'#cbb07c', border:'#e11d48', floor:'#27272a', floor2:'#3f3f46', curb:'#b91c1c', post:'#f5c542', roof:'#e11d48', trim:'#fef08a', spark:'#fef08a', cars:['#e11d48','#2563eb','#f59e0b','#10b981','#ec4899','#8b5cf6']},
  americana:    {id:'americana',    label:'Americana',           name:'Route 66 Sock-Hop Cruisers',  sub:'Checkered Diner Floor, Neon Sign & 1950s Tailfins',    sign:'CRUISERS',    hex:'#a8644c', border:'#b91c1c', floor:'#f8fafc', floor2:'#18181b', curb:'#b91c1c', post:'#fbf6e8', roof:'#1d3557', trim:'#fbbf24', spark:'#38bdf8', cars:['#ef4444','#06b6d4','#facc15','#ec4899','#3b82f6','#10b981']},
  space:        {id:'space',        label:'Space',               name:'Orbital Zero-G Bumper Pods',  sub:'Titanium Containment Cage, Cyan Grid & Hover Saucers', sign:'ASTRO PODS',  hex:'#334155', border:'#0ea5e9', floor:'#0f172a', floor2:'#1e293b', curb:'#0284c7', post:'#cbd5e1', roof:'#0284c7', trim:'#22d3ee', spark:'#22d3ee', cars:['#22d3ee','#e879f9','#38bdf8','#facc15','#a855f7','#f8fafc']},
  retro_future: {id:'retro_future', label:'Retro-Future',        name:'Tomorrowland Atom Bumpers',   sub:'White Googie Roof, Teal Floor & Finned Rockets',      sign:'ATOM CARS',   hex:'#bcc8d5', border:'#f97316', floor:'#0f172a', floor2:'#164e63', curb:'#f97316', post:'#f8fafc', roof:'#f8fafc', trim:'#f97316', spark:'#facc15', cars:['#f97316','#06b6d4','#facc15','#ec4899','#38bdf8','#a855f7']},
  western:      {id:'western',      label:'Wild West',           name:'Tombstone Chuckwagon Bumpers',sub:'Timber Corral Cage, False-Front & Ore-Cart Buggies',   sign:'STAMPEDE',    hex:'#c99a62', border:'#b91c1c', floor:'#78350f', floor2:'#92400e', curb:'#5a3b22', post:'#8a5a33', roof:'#78350f', trim:'#f59e0b', spark:'#f97316', cars:['#b91c1c','#d97706','#15803d','#1d4ed8','#9a3412','#ca8a04']},
  frontier:     {id:'frontier',     label:'Frontier',            name:'Grizzly Log-Cabin Bumpers',   sub:'Peeled Cedar Palisade, Green Shake Roof & Log Buggies',sign:'LOG BUMPERS', hex:'#7d955d', border:'#566e42', floor:'#5a3b22', floor2:'#6b4a2b', curb:'#4a3320', post:'#8a5a33', roof:'#2f5f3a', trim:'#eab308', spark:'#fde047', cars:['#b45309','#15803d','#b91c1c','#d97706','#3f6212','#9a3412']},
  jungle:       {id:'jungle',       label:'Jungle',              name:'Mayan Temple Jaguar Bumpers', sub:'Carved Stone Pillars, Palm Thatch Roof & Expedition 4x4',sign:'JAGUAR RUN', hex:'#587c48', border:'#2fbf9a', floor:'#4a4737', floor2:'#595443', curb:'#8e8a72', post:'#bdb9a0', roof:'#b5893d', trim:'#2fbf9a', spark:'#2fbf9a', cars:['#eab308','#10b981','#ef4444','#f97316','#06b6d4','#84cc16']},
  tiki:         {id:'tiki',         label:'Tiki',                name:'Volcano Lagoon Tiki Bumpers', sub:'Bamboo Cage, Curved Thatch Roof & Outrigger Canoes',   sign:'TIKI BUMP',   hex:'#5c9444', border:'#d97706', floor:'#451a03', floor2:'#5a3b22', curb:'#78350f', post:'#d9a74a', roof:'#d9a74a', trim:'#f97316', spark:'#facc15', cars:['#f97316','#10b981','#eab308','#e11d48','#06b6d4','#a855f7']},
  caribbean:    {id:'caribbean',    label:'Caribbean',           name:'Port Royal Cannonball Boats', sub:'Coquina Stone Arches, Barrel-Tile Roof & Mini Galleons',sign:'BROADSIDE',  hex:'#6aa04a', border:'#d97706', floor:'#1e3a8a', floor2:'#1d4ed8', curb:'#a89c84', post:'#e2d8c3', roof:'#c2410c', trim:'#f59e0b', spark:'#fde047', cars:['#b91c1c','#d97706','#0d9488','#2563eb','#7e22ce','#15803d']},
  medieval:     {id:'medieval',     label:'Medieval',            name:'Royal Jousting Lists Arena',  sub:'Crenellated Stone Cage, Pavilion Tent & Knight Chariots',sign:'JOUST LISTS',hex:'#6c8c58', border:'#eab308', floor:'#475569', floor2:'#64748b', curb:'#334155', post:'#cbd5e1', roof:'#1d4ed8', trim:'#f5c542', spark:'#fde047', cars:['#b91c1c','#1d4ed8','#eab308','#15803d','#7e22ce','#ea580c']},
  gothic:       {id:'gothic',       label:'Gothic',              name:'Midnight Crypt Hearse Bumpers',sub:'Wrought-Iron Cage, Slate Mansard Roof & Velvet Hearses',sign:'CRYPT CRASH', hex:'#3b3345', border:'#7e22ce', floor:'#09090b', floor2:'#18181b', curb:'#27272a', post:'#52525b', roof:'#312e81', trim:'#dc2626', spark:'#c084fc', cars:['#991b1b','#6b21a8','#1e3a8a','#b45309','#0f766e','#be123c']},
  bavarian:     {id:'bavarian',     label:'Bavarian',            name:'Oktoberfest Brauhaus Bumpers',sub:'Fachwerk Timber Cage, Red Tile Roof & Barrel Buggies', sign:'AUTOSCOOTER', hex:'#769958', border:'#2563eb', floor:'#5a3b22', floor2:'#78350f', curb:'#dfd9c8', post:'#f8fafc', roof:'#b91c1c', trim:'#2563eb', spark:'#38bdf8', cars:['#2563eb','#ef4444','#f59e0b','#16a34a','#ffffff','#9333ea']},
  alps:         {id:'alps',         label:'Alps',                name:'Matterhorn Ice-Rink Bumpers', sub:'Glacier Ice Floor, Snow-Capped Chalet & Snowcat Pods', sign:'EIS-AUTO',    hex:'#a8c5d6', border:'#0284c7', floor:'#bae6fd', floor2:'#e0f2fe', curb:'#64748b', post:'#b45309', roof:'#ffffff', trim:'#dc2626', spark:'#38bdf8', cars:['#dc2626','#0284c7','#f59e0b','#16a34a','#7e22ce','#ea580c']},
  fiesta:       {id:'fiesta',       label:'Fiesta',              name:'Hacienda Chocones Cantina',   sub:'Talavera Tile Plaza, Clay Tile Roof & Fiesta Roadsters',sign:'CHOCONES',   hex:'#d99b52', border:'#e11d48', floor:'#fef3c7', floor2:'#fde68a', curb:'#0d9488', post:'#f59e0b', roof:'#c2410c', trim:'#e11d48', spark:'#facc15', cars:['#e11d48','#0d9488','#f59e0b','#9333ea','#2563eb','#10b981']},
  nordic:       {id:'nordic',       label:'Nordic',              name:'Asgardian Longship Clash',    sub:'Stave Timber Cage, Shingled Roof & Mini Viking Ships', sign:'SKJOLD',      hex:'#4d6b63', border:'#d97706', floor:'#1e293b', floor2:'#334155', curb:'#475569', post:'#451a03', roof:'#0f172a', trim:'#f59e0b', spark:'#38bdf8', cars:['#991b1b','#0284c7','#d97706','#15803d','#7e22ce','#ea580c']}
};
BUMPER_CAR_SKINS.unthemed = BUMPER_CAR_SKINS.standard;
BUMPER_CAR_SKINS.german   = BUMPER_CAR_SKINS.bavarian;
BUMPER_CAR_SKINS.wildwest = BUMPER_CAR_SKINS.western;
BUMPER_CAR_SKINS.retro    = BUMPER_CAR_SKINS.retro_future;

/* ===== SPRITE CODE: copy this block into engine.js ===== */
/**
 * drawBumperCars(ctx, cx, cy, R, opts)
 *  Enclosed 1-Hex Bumper Cars / Dodgems Pavilion:
 *   - Fully enclosed arena:
 *       1. Raised octagonal/rectangular electrified steel-plate floor with checkerboard/grid tiles
 *          and cushioned perimeter bumper curbing.
 *       2. Back enclosure walls & safety wire-mesh fencing panels (so cars stay strictly inside).
 *       3. 6 animated bumper cars weaving and rebounding off the perimeter wall and each other,
 *          complete with thick wrap-around black rubber bumpers, headlights, 2 riders, and tall
 *          spring-loaded trolley poles touching the overhead electrified ceiling grid (emitting
 *          electric sparks on impact!).
 *       4. Front safety mesh guardrail + corner support columns + overhead electrified wire-mesh
 *          ceiling grid & themed pavilion roof canopy (rendered with adjustable `roofAlpha` cutaway
 *          so players always see the cars zipping around inside the enclosed building!).
 *
 *  opts.themeId / theme : any of the 16 theme keys above
 *  opts.rideThemeTier   : 0..4 (<=2 renders Standard Unthemed; >=3 renders Heavy/Immersive themed pavilion)
 *  opts.accent          : Land color (used for standard accents & hex border)
 *  opts.t               : elapsed time in seconds (drives deterministic multi-car bumping & sparks)
 *  opts.roofAlpha       : 0.12 .. 0.85 opacity of the overhead roof canopy (default 0.34 cutaway)
 *  opts.flip            : true when mirrored horizontally
 *  opts.tile            : draw hex tile underneath (default true)
 */
function drawBumperCars(ctx, cx, cy, R, o = {}) {
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTh = String(o.themeId || o.theme || 'standard').toLowerCase().replace(/-/g, '_');
  if (rawTh === 'unthemed') rawTh = 'standard';
  if (rawTh === 'german') rawTh = 'bavarian';
  if (rawTh === 'wildwest' || rawTh === 'wild_west') rawTh = 'western';
  if (rawTh === 'retro') rawTh = 'retro_future';
  const theme = (tier <= 2 || !BUMPER_CAR_SKINS[rawTh]) ? 'standard' : rawTh;
  const meta = BUMPER_CAR_SKINS[theme] || BUMPER_CAR_SKINS.standard;

  const accent = o.accent || meta.border || '#ef4444';
  const roofAlpha = o.roofAlpha != null ? o.roofAlpha : 1.0;
  const clockT = (o.t != null) ? o.t : (typeof performance !== 'undefined' ? performance.now() / 1000 : 1.2);
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

  // Two-Angle Isometric Projection:
  // `X` = width (-ax .. +ax), `Y` = depth (-ay .. +ay), `Z` = height (0 .. Zroof)
  const cyB = cy + R * 0.08;
  const S = R * 0.078;
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
  const isoBox = (x0, x1, y0, y1, z0, z1, cf, ce, ct, stroke, lw) => {
    if (ct) poly([P(x0,y0,z1), P(x1,y0,z1), P(x1,y1,z1), P(x0,y1,z1)], ct, stroke, lw);
    poly([P(x0,y1,z0), P(x1,y1,z0), P(x1,y1,z1), P(x0,y1,z1)], cf, stroke, lw);
    poly([P(x1,y0,z0), P(x1,y1,z0), P(x1,y1,z1), P(x1,y0,z1)], ce, stroke, lw);
  };
  const marqueeText = (xa, xb, y, zTop, zH, txt, fg) => {
    const p = P(xa, y, zTop);
    ctx.save();
    ctx.transform(0.7, 0.35, 0, 1, p[0], p[1]);
    ctx.fillStyle = fg || '#ffffff';
    ctx.font = 'bold ' + Math.round(zH * 0.66 * S) + 'px Arial Black, Arial, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(txt, (xb - xa) * 0.5 * S, zH * 0.52 * S, (xb - xa) * 0.92 * S);
    ctx.restore();
  };

  // Enclosed Pavilion Dimensions
  const ax = 4.35;       // Half-width of arena (-ax .. +ax)
  const ay = 3.55;       // Half-depth of arena (-ay .. +ay)
  const zFloor = 0.36;   // Raised electrified steel floor height
  const zRail  = 1.48;   // Perimeter safety enclosure cage height
  const zEave  = 3.45;   // Electrified ceiling grid & eaves height
  const zPeak  = 4.75;   // Pavilion roof ridge peak height
  const trimCol = theme === 'standard' ? accent : meta.trim;

  // 2. Ambient Drop Shadow + Raised Arena Plinth & Electrified Floor Grid
  const pGnd = P(0, 0, 0);
  ell([pGnd[0] + S * 0.35, pGnd[1] + S * 0.22], S * 5.8, S * 2.9, 'rgba(10, 15, 25, 0.32)');

  // Outer foundation plinth & cushioned perimeter bumper curbing
  isoBox(-ax - 0.35, ax + 0.35, -ay - 0.35, ay + 0.35, 0, zFloor, meta.curb, shade(meta.curb, -0.25), shade(meta.curb, 0.15), '#0f172a', S * 0.06);

  // Electrified floor grid (6 x 5 tiles inside the arena)
  const nx = 6, ny = 5;
  for (let ix = 0; ix < nx; ix++) {
    for (let iy = 0; iy < ny; iy++) {
      const x0 = -ax + (2 * ax * ix) / nx, x1 = -ax + (2 * ax * (ix + 1)) / nx;
      const y0 = -ay + (2 * ay * iy) / ny, y1 = -ay + (2 * ay * (iy + 1)) / ny;
      const col = (ix + iy) % 2 === 0 ? meta.floor : meta.floor2;
      poly([P(x0,y0,zFloor+0.01), P(x1,y0,zFloor+0.01), P(x1,y1,zFloor+0.01), P(x0,y1,zFloor+0.01)], col, 'rgba(255,255,255,0.12)', S * 0.03);
    }
  }

  // Interior cushioned rubber bumper curb around the floor perimeter
  const drawInnerCurb = (x0, x1, y0, y1) => {
    poly([P(x0,y0,zFloor+0.01), P(x1,y0,zFloor+0.01), P(x1,y1,zFloor+0.01), P(x0,y1,zFloor+0.01)], '#0f172a', trimCol, S * 0.05);
  };
  drawInnerCurb(-ax, ax, -ay, -ay + 0.24); // Back curb
  drawInnerCurb(-ax, -ax + 0.24, -ay, ay); // Left curb

  // =========================================================================
  // 3. BACK ENCLOSURE WALLS, SAFETY MESH & REAR SUPPORT PILLARS
  //    (Renders behind the bumper cars so the building is truly enclosed!)
  // =========================================================================
  const drawMeshPanel = (pBL, pBR, pTR, pTL, nCols = 6, nRows = 3) => {
    poly([pBL, pBR, pTR, pTL], 'rgba(15, 23, 42, 0.24)', meta.post, S * 0.06);
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.34)';
    ctx.lineWidth = S * 0.035;
    for (let i = 1; i < nCols; i++) {
      const f = i / nCols;
      const b = [pBL[0] + (pBR[0] - pBL[0]) * f, pBL[1] + (pBR[1] - pBL[1]) * f];
      const t = [pTL[0] + (pTR[0] - pTL[0]) * f, pTL[1] + (pTR[1] - pTL[1]) * f];
      ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(t[0], t[1]); ctx.stroke();
    }
    for (let j = 1; j < nRows; j++) {
      const f = j / nRows;
      const l = [pBL[0] + (pTL[0] - pBL[0]) * f, pBL[1] + (pTL[1] - pBL[1]) * f];
      const r = [pBR[0] + (pTR[0] - pBR[0]) * f, pBR[1] + (pTR[1] - pBR[1]) * f];
      ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.lineTo(r[0], r[1]); ctx.stroke();
    }
  };

  // Back-Left (-X) & Back-Right (-Y) Enclosed Safety Mesh Walls + Corner Pillars
  drawMeshPanel(P(-ax, ay, zFloor), P(-ax, -ay, zFloor), P(-ax, -ay, zEave), P(-ax, ay, zEave), 6, 4);
  drawMeshPanel(P(-ax, -ay, zFloor), P(ax, -ay, zFloor), P(ax, -ay, zEave), P(-ax, -ay, zEave), 7, 4);

  // Back 3 Pavilion Support Columns
  [[-ax, -ay], [0, -ay], [ax, -ay], [-ax, 0], [-ax, ay]].forEach(([px, py]) => {
    drawThemedColumn(px, py, zFloor, zEave, false);
  });

  // =========================================================================
  // 4. DETERMINISTIC BUMPER-CAR ARENA MOTION, COLLISIONS & ELECTRIC SPARKS
  //    6 cars roam inside `[-ax+0.8 .. ax-0.8] x [-ay+0.8 .. ay-0.8]`, bouncing off walls
  //    and each other, with spring-loaded trolley poles touching the ceiling grid at `zEave`!
  // =========================================================================
  const xLim = ax - 0.85, yLim = ay - 0.85;
  const CAR_SEEDS = [
    { x0: -1.8, y0: -1.4, vx:  2.35, vy:  1.75, ph: 0.2 },
    { x0:  1.6, y0: -1.1, vx: -2.10, vy:  2.05, ph: 1.4 },
    { x0: -1.5, y0:  1.5, vx:  2.55, vy: -1.65, ph: 2.6 },
    { x0:  1.9, y0:  1.3, vx: -1.95, vy: -2.20, ph: 3.8 },
    { x0:  0.1, y0: -0.2, vx:  2.25, vy:  2.15, ph: 5.0 },
    { x0: -0.4, y0:  0.8, vx: -2.40, vy: -1.55, ph: 4.1 }
  ];

  // Triangle-wave bounce helper with smooth collision rebound kick
  const bounce1D = (p0, v, t, lim) => {
    const span = 2 * lim;
    const raw = p0 + v * t + lim;
    const period = 2 * span;
    const m = ((raw % period) + period) % period;
    const pos = m <= span ? (m - lim) : (period - m - lim);
    const dir = m <= span ? 1 : -1;
    // Distance to nearest wall bounce (0 = right at impact!)
    const distWall = Math.min(Math.abs(pos - lim), Math.abs(pos + lim));
    return { pos, dir, nearImpact: distWall < 0.22 };
  };

  const cars = CAR_SEEDS.map((sd, idx) => {
    const bx = bounce1D(sd.x0, sd.vx, clockT, xLim);
    const by = bounce1D(sd.y0, sd.vy, clockT, yLim);
    // Add gentle figure-8 steering weave so cars arc realistically instead of moving in straight lines
    const wx = Math.max(-xLim, Math.min(xLim, bx.pos + Math.sin(clockT * 1.9 + sd.ph) * 0.35));
    const wy = Math.max(-yLim, Math.min(yLim, by.pos + Math.cos(clockT * 1.7 + sd.ph) * 0.35));
    const heading = Math.atan2(by.dir * Math.abs(sd.vy), bx.dir * Math.abs(sd.vx)) + Math.sin(clockT * 2.4 + sd.ph) * 0.22;
    return {
      idx,
      X: wx,
      Y: wy,
      heading,
      col: meta.cars[idx % meta.cars.length],
      sparking: bx.nearImpact || by.nearImpact || ((Math.floor(clockT * 5 + idx * 1.7) % 7) === 0),
      depth: wx + wy
    };
  });

  // Sort back-to-front by isometric depth `X + Y`
  cars.sort((a, b) => a.depth - b.depth);

  const drawBumperCar = (car) => {
    const pBase = P(car.X, car.Y, zFloor + 0.02);
    const px = pBase[0], py = pBase[1];
    const dirX = Math.cos(car.heading) >= 0 ? 1 : -1;
    const tilt = Math.sin(car.heading) * 0.24;

    // 1. Contact shadow on electrified floor
    ell([px + S * 0.06, py + S * 0.08], S * 0.88, S * 0.44, 'rgba(0, 0, 0, 0.38)');

    // 2. Tall Spring-Loaded Trolley Pole reaching from rear of car up to the electrified ceiling grid `zEave`!
    const pPoleBot = P(car.X - dirX * 0.32, car.Y, zFloor + 0.48);
    const pPoleTop = P(car.X - dirX * 0.48, car.Y, zEave - 0.05);
    line(pPoleBot, pPoleTop, '#94a3b8', S * 0.065);
    line(pPoleBot, pPoleTop, '#f8fafc', S * 0.025);
    // Sliding brass contact shoe on ceiling mesh
    disc(pPoleTop, S * 0.09, '#facc15', '#0f172a', S * 0.03);

    // Electric Spark Burst at ceiling shoe & bumper when bumping!
    if (car.sparking) {
      for (let sp = 0; sp < 5; sp++) {
        const sa = clockT * 25 + sp * TAU / 5;
        const sl = S * (0.14 + (sp % 2) * 0.10);
        line(pPoleTop, [pPoleTop[0] + Math.cos(sa) * sl, pPoleTop[1] + Math.sin(sa) * sl], sp % 2 ? '#ffffff' : meta.spark, S * 0.045);
      }
      disc(pPoleTop, S * 0.15, meta.spark);
    }

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(tilt);

    // 3. Thick Wrap-Around Black Rubber Bumper Cushion + Colored Rub-Rail
    ell([0, S * 0.05], S * 0.92, S * 0.48, '#09090b', '#27272a', S * 0.05);
    ell([0, 0],        S * 0.90, S * 0.46, '#18181b', '#3f3f46', S * 0.05);
    ell([0, -S * 0.03],S * 0.86, S * 0.42, null, trimCol, S * 0.055);

    // 4. Theme-Styled Enclosed Bumper Car Bodywork
    if (theme === 'space' || theme === 'retro_future') {
      // Sleek Flying Saucer / Atomic Pod Bumper Car
      ell([0, -S * 0.14], S * 0.76, S * 0.38, car.col, '#ffffff', S * 0.05);
      // Tailfin or rear thruster
      poly([[-dirX * S * 0.55, -S * 0.16], [-dirX * S * 0.85, -S * 0.45], [-dirX * S * 0.35, -S * 0.24]], trimCol);
    }
    else if (theme === 'caribbean' || theme === 'nordic') {
      // Mini Pirate Galleon / Viking Longship Bumper Boat
      poly([
        [-S * 0.72, -S * 0.12], [S * 0.72, -S * 0.12],
        [ S * 0.58,  S * 0.06], [-S * 0.58, S * 0.06]
      ], car.col, '#facc15', S * 0.05);
      // Upswept prow & stern
      poly([[dirX * S * 0.55, -S * 0.12], [dirX * S * 0.86, -S * 0.36], [dirX * S * 0.45, -S * 0.24]], '#facc15');
    }
    else if (theme === 'americana') {
      // 1950s Tailfin Cruiser Bumper Car with Chrome Grille & Whitewall Trim
      poly([
        [-S * 0.78, -S * 0.28], [-S * 0.52, -S * 0.14], [S * 0.68, -S * 0.14],
        [ S * 0.76,  S * 0.04], [-S * 0.76,  S * 0.04]
      ], car.col, '#ffffff', S * 0.05);
      line([-S * 0.70, -S * 0.05], [S * 0.70, -S * 0.05], '#f8fafc', S * 0.05);
    }
    else if (theme === 'western' || theme === 'frontier' || theme === 'tiki') {
      // Timber Chuckwagon / Bamboo Buggy Bumper Car
      poly([
        [-S * 0.70, -S * 0.24], [S * 0.70, -S * 0.24],
        [ S * 0.64,  S * 0.04], [-S * 0.64, S * 0.04]
      ], car.col, '#451a03', S * 0.05);
    }
    else {
      // Classic Sculpted Fiberglass Dodgem Body with Chrome Grille & Twin Headlights
      poly([
        [-S * 0.74, -S * 0.24], [S * 0.72, -S * 0.22],
        [ S * 0.68,  S * 0.04], [-S * 0.68, S * 0.04]
      ], car.col, '#0f172a', S * 0.05);
      // Hood racing stripe & glowing headlights at front (+dirX)
      line([-dirX * S * 0.45, -S * 0.16], [dirX * S * 0.65, -S * 0.14], '#ffffff', S * 0.06);
      disc([dirX * S * 0.68, -S * 0.10], S * 0.09, '#fef08a', '#0f172a', S * 0.03);
    }

    // 5. Steering Wheel & Two Riders inside the Cockpit
    line([dirX * S * 0.28, -S * 0.14], [dirX * S * 0.18, -S * 0.34], '#cbd5e1', S * 0.05);
    disc([dirX * S * 0.18, -S * 0.34], S * 0.08, '#0f172a');
    [-0.16, 0.14].forEach((oy, rIdx) => {
      const rx = -dirX * S * 0.12 + oy * S * 0.45;
      const ry = -S * 0.34 + oy * S * 0.25;
      disc([rx, ry + S * 0.12], S * 0.13, ['#f8fafc', '#38bdf8', '#facc15', '#a855f7'][(car.idx + rIdx) % 4]);
      disc([rx, ry], S * 0.11, (theme === 'space' || theme === 'retro_future') ? '#ffffff' : '#fde4c8', '#0f172a', S * 0.025);
    });

    ctx.restore();
  };

  cars.forEach(drawBumperCar);

  // =========================================================================
  // 5. FRONT ENCLOSURE CAGE WALLS, ENTRY GATE, CORNER PILLARS & OVERHEAD
  //    ELECTRIFIED CEILING GRID + TRANSLUCENT ROOF CANOPY (ENCLOSED BUILDING!)
  // =========================================================================
  // Front-Right (+X) & Front-Left (+Y) Safety Mesh Enclosure Walls (with Boarding Gate opening on +Y)
  drawMeshPanel(P(ax, -ay, zFloor), P(ax, ay, zFloor), P(ax, ay, zEave), P(ax, -ay, zEave), 6, 4);
  drawMeshPanel(P(-ax, ay, zFloor), P(-1.2, ay, zFloor), P(-1.2, ay, zEave), P(-ax, ay, zEave), 3, 4);
  drawMeshPanel(P(1.2, ay, zFloor),  P(ax, ay, zFloor),  P(ax, ay, zEave),  P(1.2, ay, zEave),  3, 4);
  // Transom mesh above the front boarding gate
  drawMeshPanel(P(-1.2, ay, 2.35), P(1.2, ay, 2.35), P(1.2, ay, zEave), P(-1.2, ay, zEave), 3, 2);

  // Front cushioned rubber bumper curbs
  drawInnerCurb(ax - 0.24, ax, -ay, ay);
  drawInnerCurb(-ax, -1.2, ay - 0.24, ay);
  drawInnerCurb(1.2, ax, ay - 0.24, ay);

  // Front 3 Support Pillars & Boarding Gate Arch
  [[ax, 0], [ax, ay], [-1.2, ay], [1.2, ay]].forEach(([px, py]) => {
    drawThemedColumn(px, py, zFloor, zEave, true);
  });

  // =========================================================================
  // BESPOKE THEMED COLUMNS (`drawThemedColumn`)
  // =========================================================================
  function drawThemedColumn(px, py, z0, z1, isFront) {
    const h = z1 - z0;
    if (theme === 'classic') {
      // Fluted Venetian-Red & Gold Corinthian Column with Illuminated Bulb Capital
      isoBox(px - 0.24, px + 0.24, py - 0.24, py + 0.24, z0, z0 + 0.28, '#991b1b', '#7f1d1d', '#f5c542', '#0f172a', S * 0.05);
      isoBox(px - 0.17, px + 0.17, py - 0.17, py + 0.17, z0 + 0.28, z1 - 0.26, '#fffbeb', '#dfd3b8', '#f5c542', '#78350f', S * 0.05);
      line(P(px, py + 0.18, z0 + 0.28), P(px, py + 0.18, z1 - 0.26), '#e11d48', S * 0.07);
      isoBox(px - 0.26, px + 0.26, py - 0.26, py + 0.26, z1 - 0.26, z1, '#f5c542', '#b45309', '#fef08a', '#0f172a', S * 0.05);
    }
    else if (theme === 'americana') {
      // 1950s Chrome Diner Column with Candy-Apple Red Bands & Neon Ring
      isoBox(px - 0.22, px + 0.22, py - 0.22, py + 0.22, z0, z0 + 0.24, '#b91c1c', '#7f1d1d', '#f8fafc', '#0f172a', S * 0.05);
      isoBox(px - 0.15, px + 0.15, py - 0.15, py + 0.15, z0 + 0.24, z1, '#f8fafc', '#cbd5e1', '#38bdf8', '#1e293b', S * 0.05);
      [0.35, 0.70].forEach(f => {
        const zb = z0 + h * f;
        isoBox(px - 0.20, px + 0.20, py - 0.20, py + 0.20, zb - 0.08, zb + 0.08, '#ef4444', '#991b1b', '#38bdf8');
      });
    }
    else if (theme === 'space') {
      // Angled Titanium Containment Strut with Glowing Cyan Plasma Core
      isoBox(px - 0.24, px + 0.24, py - 0.24, py + 0.24, z0, z0 + 0.32, '#0f172a', '#020617', '#22d3ee', '#22d3ee', S * 0.05);
      isoBox(px - 0.14, px + 0.14, py - 0.14, py + 0.14, z0 + 0.32, z1, '#cbd5e1', '#64748b', '#0284c7', '#0f172a', S * 0.05);
      line(P(px + 0.15, py + 0.15, z0 + 0.35), P(px + 0.15, py + 0.15, z1 - 0.1), '#22d3ee', S * 0.08);
    }
    else if (theme === 'retro_future') {
      // Swept Googie Outward-Flared White Fin Pylon with Orange Atomic Accent
      const flr = isFront ? 0.14 : 0.0;
      poly([
        P(px - 0.16, py + 0.16, z0), P(px + 0.16, py + 0.16, z0),
        P(px + 0.24 + flr, py + 0.24 + flr, z1), P(px - 0.14, py + 0.14, z1)
      ], '#f8fafc', '#0284c7', S * 0.05);
      poly([
        P(px + 0.16, py - 0.16, z0), P(px + 0.16, py + 0.16, z0),
        P(px + 0.24 + flr, py + 0.24 + flr, z1), P(px + 0.24 + flr, py - 0.16, z1)
      ], '#cbd5e1', '#0284c7', S * 0.05);
      disc(P(px + 0.22 + flr, py + 0.22 + flr, z0 + h * 0.65), S * 0.14, '#f97316', '#ffffff', S * 0.04);
    }
    else if (theme === 'western') {
      // Rough-Hewn Timber Corral Post with Diagonal Knee-Braces & Wagon Wheel Hub
      isoBox(px - 0.18, px + 0.18, py - 0.18, py + 0.18, z0, z1, '#8a5a33', '#5a3b22', '#f59e0b', '#291509', S * 0.05);
      // Diagonal timber knee-brace struts near top
      line(P(px, py, z1 - 0.75), P(px - 0.55, py, z1 - 0.05), '#6b4423', S * 0.11);
      line(P(px, py, z1 - 0.75), P(px + 0.55, py, z1 - 0.05), '#6b4423', S * 0.11);
      if (isFront) disc(P(px, py + 0.20, z0 + h * 0.52), S * 0.16, '#451a03', '#f59e0b', S * 0.04);
    }
    else if (theme === 'frontier') {
      // Peeled Cedar Log Trunk with River-Stone Base Pier & Timber Cross-Corbel
      isoBox(px - 0.26, px + 0.26, py - 0.26, py + 0.26, z0, z0 + 0.45, '#80858d', '#575c63', '#94a3b8', '#1e293b', S * 0.05);
      isoBox(px - 0.17, px + 0.17, py - 0.17, py + 0.17, z0 + 0.45, z1, '#7c4d2b', '#4a2e16', '#eab308', '#291509', S * 0.05);
      isoBox(px - 0.34, px + 0.34, py - 0.20, py + 0.20, z1 - 0.24, z1, '#5a3b22', '#3e2723', '#8a5a33');
    }
    else if (theme === 'jungle') {
      // Carved Mayan Serpent Stone Pillar with Stepped Capital & Climbing Vines
      isoBox(px - 0.24, px + 0.24, py - 0.24, py + 0.24, z0, z0 + 0.32, '#8e8a72', '#595443', '#bdb9a0', '#292524', S * 0.05);
      isoBox(px - 0.19, px + 0.19, py - 0.19, py + 0.19, z0 + 0.32, z1 - 0.28, '#bdb9a0', '#8e8a72', '#2fbf9a', '#292524', S * 0.05);
      isoBox(px - 0.28, px + 0.28, py - 0.28, py + 0.28, z1 - 0.28, z1, '#137a70', '#0f524b', '#eab308', '#292524', S * 0.05);
      line(P(px - 0.18, py + 0.20, z0 + 0.4), P(px + 0.18, py + 0.20, z1 - 0.4), '#15803d', S * 0.08);
    }
    else if (theme === 'tiki') {
      // Hand-Carved Polynesian Tiki Totem Mask Pillar with Glowing Eyes & Bamboo Trim
      isoBox(px - 0.22, px + 0.22, py - 0.22, py + 0.22, z0, z1, '#6d4224', '#3e2716', '#d9a74a', '#1c1917', S * 0.05);
      if (isFront) {
        const mP = P(px, py + 0.24, z0 + h * 0.54);
        disc([mP[0] - S * 0.08, mP[1]], S * 0.06, '#facc15');
        disc([mP[0] + S * 0.08, mP[1]], S * 0.06, '#facc15');
        line([mP[0] - S * 0.12, mP[1] + S * 0.14], [mP[0] + S * 0.12, mP[1] + S * 0.14], '#f97316', S * 0.07);
      }
    }
    else if (theme === 'caribbean') {
      // Coquina-Stone Fort Pier with Arched Corbels & Brass Ship Lantern
      isoBox(px - 0.25, px + 0.25, py - 0.25, py + 0.25, z0, z1, '#e2d8c3', '#a89c84', '#c2410c', '#451a03', S * 0.05);
      isoBox(px - 0.29, px + 0.29, py - 0.29, py + 0.29, z1 - 0.24, z1, '#b0a590', '#7a705e', '#f59e0b');
      if (isFront) {
        disc(P(px, py + 0.30, z0 + h * 0.65), S * 0.12, '#fef08a', '#78350f', S * 0.04);
      }
    }
    else if (theme === 'medieval') {
      // Crenellated Castle Keep Stone Turret Column with Heraldic Shield
      isoBox(px - 0.25, px + 0.25, py - 0.25, py + 0.25, z0, z1, '#cbd5e1', '#64748b', '#f5c542', '#1e293b', S * 0.05);
      isoBox(px - 0.30, px + 0.30, py - 0.30, py + 0.30, z1 - 0.26, z1, '#94a3b8', '#475569', '#1d4ed8', '#1e293b', S * 0.05);
      if (isFront) {
        const sP = P(px, py + 0.27, z0 + h * 0.55);
        poly([[sP[0]-S*0.12,sP[1]-S*0.14],[sP[0]+S*0.12,sP[1]-S*0.14],[sP[0]+S*0.10,sP[1]+S*0.06],[sP[0],sP[1]+S*0.18],[sP[0]-S*0.10,sP[1]+S*0.06]], '#b91c1c', '#f5c542', S * 0.04);
      }
    }
    else if (theme === 'gothic') {
      // Clustered Dark Obsidian Gothic Buttress Pier with Crimson Lancet Trim
      isoBox(px - 0.24, px + 0.24, py - 0.24, py + 0.24, z0, z1, '#27272a', '#09090b', '#7e22ce', '#000000', S * 0.05);
      line(P(px, py + 0.25, z0 + 0.2), P(px, py + 0.25, z1 - 0.2), '#dc2626', S * 0.07);
      isoBox(px - 0.28, px + 0.28, py - 0.28, py + 0.28, z1 - 0.22, z1, '#3f3f46', '#18181b', '#dc2626');
    }
    else if (theme === 'bavarian') {
      // Fachwerk Half-Timbered Column with Diagonal Oak Struts & Blue/White Lozenge
      isoBox(px - 0.22, px + 0.22, py - 0.22, py + 0.22, z0, z1, '#f8fafc', '#dfd9c8', '#2563eb', '#451a03', S * 0.05);
      line(P(px - 0.22, py + 0.23, z0), P(px + 0.22, py + 0.23, z1), '#451a03', S * 0.08);
      line(P(px + 0.22, py + 0.23, z0), P(px - 0.22, py + 0.23, z1), '#451a03', S * 0.08);
    }
    else if (theme === 'alps') {
      // Stone-Base & Honey-Larch Chalet Column with Snow-Capped Corbel & Geraniums
      isoBox(px - 0.24, px + 0.24, py - 0.24, py + 0.24, z0, z0 + 0.55, '#cbd5e1', '#64748b', '#f8fafc', '#334155', S * 0.05);
      isoBox(px - 0.18, px + 0.18, py - 0.18, py + 0.18, z0 + 0.55, z1, '#b45309', '#78350f', '#ffffff', '#451a03', S * 0.05);
    }
    else if (theme === 'fiesta') {
      // Polychrome Talavera-Tiled Adobe Pillar with Terracotta & Gold Bands
      isoBox(px - 0.22, px + 0.22, py - 0.22, py + 0.22, z0, z1, '#fef3c7', '#f5deb3', '#e11d48', '#7c2d12', S * 0.05);
      [0.25, 0.55, 0.82].forEach((f, idx) => {
        const zb = z0 + h * f;
        isoBox(px - 0.24, px + 0.24, py - 0.24, py + 0.24, zb - 0.10, zb + 0.10, idx % 2 ? '#0d9488' : '#e11d48', '#9f1239', '#facc15');
      });
    }
    else if (theme === 'nordic') {
      // Tarred Stave-Wood Pillar with Gold Knotwork Rings & Viking Round Shield
      isoBox(px - 0.20, px + 0.20, py - 0.20, py + 0.20, z0, z1, '#451a03', '#290f02', '#f59e0b', '#0f172a', S * 0.05);
      if (isFront) {
        const sP = P(px, py + 0.22, z0 + h * 0.55);
        disc(sP, S * 0.17, '#991b1b', '#f59e0b', S * 0.05);
        disc(sP, S * 0.06, '#fde047');
      }
    }
    else {
      // Unthemed Standard Steel Box-Column
      isoBox(px - 0.20, px + 0.20, py - 0.20, py + 0.20, z0, z1, meta.post, shade(meta.post, -0.25), trimCol, '#0f172a', S * 0.05);
    }
  }

  // 6. Overhead Electrified Ceiling Wire Grid (at z = zEave)
  ctx.save();
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.45)';
  ctx.lineWidth = S * 0.04;
  for (let gx = -ax; gx <= ax + 0.01; gx += (2 * ax) / 6) {
    line(P(gx, -ay, zEave), P(gx, ay, zEave), ctx.strokeStyle, ctx.lineWidth);
  }
  for (let gy = -ay; gy <= ay + 0.01; gy += (2 * ay) / 5) {
    line(P(-ax, gy, zEave), P(ax, gy, zEave), ctx.strokeStyle, ctx.lineWidth);
  }
  ctx.restore();

  // =========================================================================
  // 7. BESPOKE OPAQUE THEMED PAVILION ROOF ARCHITECTURE (`drawThemedRoof`)
  //    Every single theme builds a distinct 3D roof structure & crown!
  // =========================================================================
  ctx.save();
  ctx.globalAlpha = roofAlpha;
  const ov = 0.42;
  const rx0 = -ax - ov, rx1 = ax + ov, ry0 = -ay - ov, ry1 = ay + ov;
  const mx0 = -ax * 0.42, mx1 = ax * 0.42;

  const drawHipRoof = (cBack, cLeft, cRight, cFront, strokeC, zTop = zPeak) => {
    poly([P(rx0, ry0, zEave), P(rx1, ry0, zEave), P(mx1, 0, zTop), P(mx0, 0, zTop)], cBack, strokeC, S * 0.06);
    poly([P(rx0, ry0, zEave), P(rx0, ry1, zEave), P(mx0, 0, zTop)], cLeft, strokeC, S * 0.06);
    poly([P(rx1, ry0, zEave), P(rx1, ry1, zEave), P(mx1, 0, zTop)], cRight, strokeC, S * 0.07);
    poly([P(rx0, ry1, zEave), P(rx1, ry1, zEave), P(mx1, 0, zTop), P(mx0, 0, zTop)], cFront, strokeC, S * 0.08);
  };

  if (theme === 'classic') {
    // CLASSIC MIDWAY: Alternating Red-and-Cream Striped Big-Top Pavilion + Clerestory Cupola & Pennants!
    const nSt = 10;
    poly([P(rx0, ry0, zEave), P(rx1, ry0, zEave), P(mx1, 0, zPeak), P(mx0, 0, zPeak)], '#9f1239', '#f5c542', S * 0.06);
    poly([P(rx0, ry0, zEave), P(rx0, ry1, zEave), P(mx0, 0, zPeak)], '#be123c', '#f5c542', S * 0.06);
    for (let i = 0; i < nSt; i++) {
      const f0 = i / nSt, f1 = (i + 1) / nSt;
      const col = i % 2 === 0 ? '#e11d48' : '#fffbeb';
      poly([
        P(rx0 + (rx1 - rx0) * f0, ry1, zEave),
        P(rx0 + (rx1 - rx0) * f1, ry1, zEave),
        P(mx0 + (mx1 - mx0) * f1, 0, zPeak),
        P(mx0 + (mx1 - mx0) * f0, 0, zPeak)
      ], col, '#f5c542', S * 0.04);
      // Right-hand (+X) striped hip slope
      poly([
        P(rx1, ry0 + (ry1 - ry0) * f0, zEave),
        P(rx1, ry0 + (ry1 - ry0) * f1, zEave),
        P(mx1, 0, zPeak)
      ], i % 2 === 0 ? '#be123c' : '#dfd3b8', '#f5c542', S * 0.04);
    }
    // Upper Baroque Lantern Cupola & Twin Pennant Flags
    isoBox(-1.35, 1.35, -0.75, 0.75, zPeak - 0.15, zPeak + 0.45, '#1e3a8a', '#172554', '#f5c542', '#f5c542', S * 0.06);
    [-1.2, 1.2].forEach((fx, idx) => {
      const fp = P(fx, 0, zPeak + 0.45);
      line(fp, [fp[0], fp[1] - S * 1.15], '#f5c542', S * 0.08);
      poly([[fp[0], fp[1] - S * 1.15], [fp[0] + S * 0.95, fp[1] - S * 0.92], [fp[0], fp[1] - S * 0.68]], idx === 0 ? '#e11d48' : '#2563eb', '#fef08a', S * 0.04);
    });
  }
  else if (theme === 'americana') {
    // AMERICANA: 1950s Checkered Diner Roof + Giant Chrome Jukebox Arch & Neon Star!
    drawHipRoof('#0f172a', '#1e293b', '#1e3a8a', '#1d3557', '#f8fafc', zPeak - 0.15);
    // Bold Red-and-White Diner Racing Stripes across the front roof slope
    const nStripes = 12;
    for (let i = 0; i < nStripes; i++) {
      const f0 = i / nStripes, f1 = (i + 1) / nStripes;
      poly([
        P(rx0 + (rx1 - rx0) * f0, ry1, zEave),
        P(rx0 + (rx1 - rx0) * f1, ry1, zEave),
        P(mx0 + (mx1 - mx0) * f1, 0, zPeak - 0.15),
        P(mx0 + (mx1 - mx0) * f0, 0, zPeak - 0.15)
      ], i % 2 === 0 ? '#dc2626' : '#f8fafc', '#1d3557', S * 0.04);
    }
    // Giant Rooftop Neon Starburst & "50s" Chrome Fin
    const sp = P(0, 0, zPeak + 0.45);
    line(P(0, 0, zPeak - 0.15), sp, '#e2e8f0', S * 0.12);
    disc(sp, S * 0.55, '#ef4444', '#fef08a', S * 0.08);
    disc(sp, S * 0.28, '#38bdf8');
  }
  else if (theme === 'space') {
    // SPACE: Faceted Titanium Geodesic Saucer Dome + Glowing Cyan Plasma Ring & Radar Spire!
    drawHipRoof('#0f172a', '#1e293b', '#334155', '#475569', '#22d3ee', zPeak - 0.25);
    // Upper glowing cobalt & cyan glass command cupola
    isoBox(-1.65, 1.65, -1.15, 1.15, zPeak - 0.35, zPeak + 0.35, '#0284c7', '#0369a1', '#0f172a', '#22d3ee', S * 0.07);
    const orb = P(0, 0, zPeak + 0.95);
    line(P(0, 0, zPeak + 0.35), orb, '#e2e8f0', S * 0.10);
    ell(orb, S * 1.45, S * 0.48, null, '#22d3ee', S * 0.09);
    disc(orb, S * 0.34, '#0f172a', '#e879f9', S * 0.08);
  }
  else if (theme === 'retro_future') {
    // RETRO-FUTURE: Crisp White Googie Hip Roof with Teal Trim & Sputnik Spire
    drawHipRoof('#cbd5e1', '#e2e8f0', '#e2e8f0', '#ffffff', '#06b6d4', zPeak - 0.30);
    const sp = P(0, 0, zPeak + 0.65);
    line(P(0, 0, zPeak - 0.30), sp, '#f97316', S * 0.10);
    disc(sp, S * 0.30, '#f97316', '#06b6d4', S * 0.06);
  }
  else if (theme === 'western') {
    // WILD WEST: Corrugated Tin Barn Roof + Stepped Boomtown False-Front Parapet & Windmill!
    drawHipRoof('#475569', '#64748b', '#475569', '#64748b', '#291509', zPeak - 0.20);
    // Standing-seam corrugated tin ribs on front slope
    for (let k = -6; k <= 6; k++) {
      const fx = (k + 6) / 12;
      line(P(rx0 + (rx1 - rx0) * fx, ry1, zEave), P(mx0 + (mx1 - mx0) * fx, 0, zPeak - 0.20), '#334155', S * 0.05);
    }
    // Tall Stepped Boomtown Timber False-Front Wall rising above the front eaves
    poly([
      P(rx0, ry1, zEave), P(rx1, ry1, zEave),
      P(rx1, ry1, zEave + 0.65), P(2.4, ry1, zEave + 0.65),
      P(2.4, ry1, zEave + 1.25), P(-2.4, ry1, zEave + 1.25),
      P(-2.4, ry1, zEave + 0.65), P(rx0, ry1, zEave + 0.65)
    ], '#8a5a33', '#451a03', S * 0.08);
  }
  else if (theme === 'frontier') {
    // FRONTIER: Deep Forest-Green Cedar-Shake Roof with Heavy Log Ridgepole & River-Stone Chimney!
    drawHipRoof('#1e3f28', '#244d30', '#1e3f28', '#2f5f3a', '#3e2723', zPeak);
    for (let c = 1; c <= 3; c++) {
      const f = c / 4;
      line(P(rx0 + (mx0 - rx0) * f, ry1 * (1 - f), zEave + (zPeak - zEave) * f), P(rx1 + (mx1 - rx1) * f, ry1 * (1 - f), zEave + (zPeak - zEave) * f), '#14301d', S * 0.06);
    }
    // Heavy peeled-log ridge beam & stone chimney stack
    line(P(mx0 - 0.3, 0, zPeak), P(mx1 + 0.3, 0, zPeak), '#8a5a33', S * 0.22);
    isoBox(1.8, 2.6, -1.2, -0.4, zEave + 0.4, zPeak + 0.85, '#80858d', '#575c63', '#cbd5e1', '#1e293b', S * 0.06);
  }
  else if (theme === 'jungle') {
    // JUNGLE: Layered Golden Palm-Thatch Palapa Roof + Carved Stone Mayan Sun-Idol Crown!
    drawHipRoof('#78520d', '#926c29', '#78520d', '#b5893d', '#451a03', zPeak);
    // Second upper overlapping thatch tier
    const uScale = 0.56;
    poly([P(rx0 * uScale, ry1 * uScale, zEave + 0.72), P(rx1 * uScale, ry1 * uScale, zEave + 0.72), P(mx1 * uScale, 0, zPeak + 0.25), P(mx0 * uScale, 0, zPeak + 0.25)], '#c99a49', '#5a4028', S * 0.06);
    // Golden Mayan Sun-God Mask crowning the ridge
    const sunP = P(0, 0, zPeak + 0.55);
    disc(sunP, S * 0.48, '#eab308', '#78350f', S * 0.08);
    disc(sunP, S * 0.22, '#2fbf9a');
  }
  else if (theme === 'tiki') {
    // TIKI: Dramatic High-Peaked Saddle-Ridge Polynesian Longhouse Thatch Roof + Tiki Finials!
    const zSad = zPeak + 0.35;
    poly([P(rx0, ry0, zEave), P(rx1, ry0, zEave), P(mx1 + 0.4, 0, zSad), P(mx0 - 0.4, 0, zSad)], '#926c29', '#451a03', S * 0.06);
    poly([P(rx0, ry0, zEave), P(rx0, ry1, zEave), P(mx0 - 0.4, 0, zSad)], '#b45309', '#451a03', S * 0.06);
    poly([P(rx1, ry0, zEave), P(rx1, ry1, zEave), P(mx1 + 0.4, 0, zSad)], '#9a3412', '#451a03', S * 0.07);
    poly([P(rx0, ry1, zEave), P(rx1, ry1, zEave), P(mx1 + 0.4, 0, zSad), P(mx0 - 0.4, 0, zSad)], '#d9a74a', '#451a03', S * 0.08);
    // Crossed bamboo ridge spars & blazing tiki torch bowls at ridge ends
    [-1, 1].forEach(s => {
      const rp = P(s * (mx1 + 0.4), 0, zSad);
      line(rp, [rp[0] + s * S * 0.65, rp[1] - S * 0.55], '#f59e0b', S * 0.14);
      disc([rp[0] + s * S * 0.65, rp[1] - S * 0.62], S * 0.22, '#f97316');
    });
  }
  else if (theme === 'caribbean') {
    // CARIBBEAN: Spanish Terracotta Barrel-Tile Roof + Fort Watchtower Cupola & Jolly Roger!
    drawHipRoof('#7c2d12', '#9a3412', '#7c2d12', '#c2410c', '#451a03', zPeak - 0.10);
    for (let k = -7; k <= 7; k++) {
      const f = (k + 7) / 14;
      line(P(rx0 + (rx1 - rx0) * f, ry1, zEave), P(mx0 + (mx1 - mx0) * f, 0, zPeak - 0.10), '#ea580c', S * 0.06);
    }
    // Coquina sentry turret cupola & pirate flag
    isoBox(-0.85, 0.85, -0.65, 0.65, zPeak - 0.2, zPeak + 0.45, '#e2d8c3', '#a89c84', '#c2410c', '#451a03', S * 0.06);
    const fp = P(0, 0, zPeak + 0.45);
    line(fp, [fp[0], fp[1] - S * 1.15], '#f59e0b', S * 0.09);
    poly([[fp[0], fp[1] - S * 1.15], [fp[0] + S * 1.0, fp[1] - S * 0.90], [fp[0], fp[1] - S * 0.65]], '#0f172a', '#ffffff', S * 0.04);
  }
  else if (theme === 'medieval') {
    // MEDIEVAL: Royal Blue & Crimson Quartered Tournament Tent Roof + Gold Crown & Pennant!
    const nG = 8;
    poly([P(rx0, ry0, zEave), P(rx1, ry0, zEave), P(mx1, 0, zPeak + 0.15), P(mx0, 0, zPeak + 0.15)], '#1e3a8a', '#f5c542', S * 0.06);
    poly([P(rx0, ry0, zEave), P(rx0, ry1, zEave), P(mx0, 0, zPeak + 0.15)], '#991b1b', '#f5c542', S * 0.06);
    poly([P(rx1, ry0, zEave), P(rx1, ry1, zEave), P(mx1, 0, zPeak + 0.15)], '#1e40af', '#f5c542', S * 0.06);
    for (let i = 0; i < nG; i++) {
      const f0 = i / nG, f1 = (i + 1) / nG;
      poly([
        P(rx0 + (rx1 - rx0) * f0, ry1, zEave),
        P(rx0 + (rx1 - rx0) * f1, ry1, zEave),
        P(mx0 + (mx1 - mx0) * f1, 0, zPeak + 0.15),
        P(mx0 + (mx1 - mx0) * f0, 0, zPeak + 0.15)
      ], i % 2 === 0 ? '#1d4ed8' : '#b91c1c', '#f5c542', S * 0.05);
    }
    const fp = P(0, 0, zPeak + 0.15);
    line(fp, [fp[0], fp[1] - S * 1.25], '#f5c542', S * 0.10);
    poly([[fp[0], fp[1] - S * 1.25], [fp[0] + S * 1.05, fp[1] - S * 1.0], [fp[0], fp[1] - S * 0.72]], '#b91c1c', '#f5c542', S * 0.05);
  }
  else if (theme === 'gothic') {
    // GOTHIC: Steep Dark-Slate Mansard Roof + Wrought-Iron Widow's Walk & Bat Spire!
    drawHipRoof('#09090b', '#18181b', '#18181b', '#27272a', '#dc2626', zPeak + 0.15);
    // Flat upper mansard deck with wrought-iron spikes
    poly([P(mx0 - 0.5, -0.6, zPeak + 0.15), P(mx1 + 0.5, -0.6, zPeak + 0.15), P(mx1 + 0.5, 0.6, zPeak + 0.15), P(mx0 - 0.5, 0.6, zPeak + 0.15)], '#09090b', '#7e22ce', S * 0.07);
    for (let kx = -2; kx <= 2; kx++) {
      const sp = P(kx * 0.85, 0.6, zPeak + 0.15);
      line(sp, [sp[0], sp[1] - S * 0.42], '#dc2626', S * 0.06);
    }
  }
  else if (theme === 'bavarian') {
    // BAVARIAN: Steep Red-Tile Roof + Central Glockenspiel Clock-House & Copper Onion Dome!
    drawHipRoof('#7f1d1d', '#991b1b', '#7f1d1d', '#b91c1c', '#f5c542', zPeak);
    isoBox(-1.05, 1.05, -0.75, 0.75, zPeak - 0.15, zPeak + 0.55, '#f8fafc', '#dfd9c8', '#0d9488', '#451a03', S * 0.06);
    const ck = P(0, 0.77, zPeak + 0.22);
    disc(ck, S * 0.28, '#ffffff', '#f59e0b', S * 0.06);
    const od = P(0, 0, zPeak + 0.95);
    disc(od, S * 0.55, '#0d9488', '#f5c542', S * 0.07);
    line(od, [od[0], od[1] - S * 0.85], '#f5c542', S * 0.09);
  }
  else if (theme === 'alps') {
    // ALPS: Deep Snow-Blanketed Chalet Roof + Overhanging Snowdrifts & Swiss Cross Cupola!
    drawHipRoof('#cbd5e1', '#e2e8f0', '#dbeafe', '#ffffff', '#0284c7', zPeak);
    // Scalloped white snow overhang along the front eaves
    for (let k = 0; k <= 8; k++) {
      const sx = rx0 + (rx1 - rx0) * (k / 8);
      disc(P(sx, ry1 + 0.04, zEave - 0.05), S * 0.26, '#ffffff', '#bae6fd', S * 0.04);
    }
    const fp = P(0, 0, zPeak);
    line(fp, [fp[0], fp[1] - S * 1.1], '#f59e0b', S * 0.09);
    poly([[fp[0], fp[1] - S * 1.1], [fp[0] + S * 0.85, fp[1] - S * 0.85], [fp[0], fp[1] - S * 0.60]], '#dc2626', '#ffffff', S * 0.04);
  }
  else if (theme === 'fiesta') {
    // FIESTA: Terracotta Clay-Tile Roof + Polychrome Talavera Bell-Gable (Espadaña)!
    drawHipRoof('#7c2d12', '#9a3412', '#7c2d12', '#c2410c', '#facc15', zPeak - 0.10);
    // Stepped white & turquoise mission bell-gable rising from the center ridge
    poly([
      P(-1.25, 0.2, zPeak - 0.15), P(1.25, 0.2, zPeak - 0.15),
      P(0.95, 0.2, zPeak + 0.65), P(0, 0.2, zPeak + 1.05), P(-0.95, 0.2, zPeak + 0.65)
    ], '#fef3c7', '#e11d48', S * 0.08);
    disc(P(0, 0.22, zPeak + 0.42), S * 0.26, '#f5c542', '#78350f', S * 0.05);
  }
  else if (theme === 'nordic') {
    // NORDIC: Steep Tarred-Shingle Viking Stave Roof + Upper Stave Rider & 4 Golden Dragon Prows!
    drawHipRoof('#0f172a', '#1e293b', '#0f172a', '#334155', '#f59e0b', zPeak + 0.10);
    // Upper Stave Turret Rider
    isoBox(-1.15, 1.15, -0.75, 0.75, zPeak, zPeak + 0.55, '#451a03', '#290f02', '#1e293b', '#f59e0b', S * 0.06);
    [-1, 1].forEach(s => {
      const dp = P(s * (mx1 + 0.1), 0, zPeak + 0.10);
      line(dp, [dp[0] + s * S * 0.75, dp[1] - S * 0.68], '#f59e0b', S * 0.16);
      disc([dp[0] + s * S * 0.78, dp[1] - S * 0.72], S * 0.16, '#dc2626');
    });
  }
  else {
    // UNTHEMED STANDARD: Clean Standing-Seam Steel Pavilion Roof + Central Ventilation Cupola
    drawHipRoof(shade(meta.roof, -0.32), shade(meta.roof, -0.18), shade(meta.roof, -0.24), meta.roof, trimCol, zPeak);
    isoBox(-1.1, 1.1, -0.65, 0.65, zPeak - 0.15, zPeak + 0.35, '#334155', '#1e293b', trimCol, '#0f172a', S * 0.05);
  }
  ctx.restore();

  // 8. Crisp Roof Fascia Eaves Trim, Chasing Marquee Lights & Illuminated Front Signboard (100% opaque!)
  poly([P(rx0, ry1, zEave - 0.18), P(rx1, ry1, zEave - 0.18), P(rx1, ry1, zEave + 0.08), P(rx0, ry1, zEave + 0.08)], meta.roof, trimCol, S * 0.07);
  poly([P(rx1, ry0, zEave - 0.18), P(rx1, ry1, zEave - 0.18), P(rx1, ry1, zEave + 0.08), P(rx1, ry0, zEave + 0.08)], shade(meta.roof, -0.25), trimCol, S * 0.07);

  // Chasing Carnival/Neon Bulbs along the Front Eaves
  for (let b = 0; b <= 10; b++) {
    const bx = rx0 + (rx1 - rx0) * (b / 10);
    const bp = P(bx, ry1 + 0.02, zEave - 0.05);
    disc(bp, S * 0.085, (Math.floor(clockT * 6) + b) % 2 ? '#fef08a' : trimCol);
  }

  // Illuminated Front Entrance Signboard ("DODGEMS" / Theme Sign)
  isoBox(-2.25, 2.25, ry1 - 0.05, ry1 + 0.22, zEave - 0.28, zEave + 0.52, '#0f172a', '#1e293b', trimCol, trimCol, S * 0.08);
  marqueeText(-2.15, 2.15, ry1 + 0.24, zEave + 0.48, 0.72, meta.sign, '#fef08a');

  ctx.restore();
}
window.drawBumperCars = drawBumperCars;
})();
