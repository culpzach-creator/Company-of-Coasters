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

/* ===== DROP TOWER 16-SKIN METADATA & STRUCTURAL STEEL PALETTES ===== */
const DROP_TOWER_SKINS = {
  standard:     {id:'standard',     label:'Unthemed (Tier 0–2)', name:'Intamin Gyro-Drop Tower',      sub:'Open Steel Lattice, Hoist Cap & Aviation Strobe',      hex:'#cbd5e1', border:'#38bdf8', chFront:'#cbd5e1', chLeft:'#94a3b8', chRight:'#64748b', chBack:'#334155', braceL:'#cbd5e1', braceR:'#94a3b8', braceB:'#475569', band:null,      car:'#38bdf8', baseType:'rail'},
  frontier:     {id:'frontier',     label:'Frontier',            name:'Grizzly Fire-Watchtower',      sub:'Fire-Watchtower Cabin Top & Spiked Wooden Palisade',   hex:'#7d955d', border:'#566e42', chFront:'#8a5a33', chLeft:'#6b4a2b', chRight:'#5a3b22', chBack:'#3e2723', braceL:'#a97d49', braceR:'#8a5a33', braceB:'#4a3320', band:'#2f5f3a', car:'#2f5f3a', baseType:'spiked_wood'},
  western:      {id:'western',      label:'Wild West',           name:'Spindletop Oil-Derrick Drop',  sub:'Oil Derrick Crown-Block Top & Spiked Wooden Fence',    hex:'#c99a62', border:'#b91c1c', chFront:'#9a6a3c', chLeft:'#78350f', chRight:'#5a3b22', chBack:'#3b2313', braceL:'#b8824c', braceR:'#8a5a33', braceB:'#451a03', band:'#b91c1c', car:'#b91c1c', baseType:'spiked_wood'},
  fiesta:       {id:'fiesta',       label:'Fiesta',              name:'Campanario Mission Belltower', sub:'Spanish Belltower Top & Half-Height Brick Wall + Arch',hex:'#d99b52', border:'#e11d48', chFront:'#f59e0b', chLeft:'#d97706', chRight:'#b45309', chBack:'#78350f', braceL:'#fde047', braceR:'#f59e0b', braceB:'#9a3412', band:'#0d9488', car:'#e11d48', baseType:'brick_arch_fiesta'},
  space:        {id:'space',        label:'Space',               name:'Orbital Saucer Tractor Beam',  sub:'Round UFO Saucer Top & Titanium Base Perimeter',       hex:'#334155', border:'#0ea5e9', chFront:'#e2e8f0', chLeft:'#cbd5e1', chRight:'#94a3b8', chBack:'#1e293b', braceL:'#38bdf8', braceR:'#0284c7', braceB:'#0f172a', band:'#22d3ee', car:'#0284c7', baseType:'space_rail'},
  retro_future: {id:'retro_future', label:'Retro-Future',        name:'Tomorrowland Jetsons Spire',   sub:'Googie Ringed Pod Top with Needle Spire & Orbit Rail', hex:'#bcc8d5', border:'#f97316', chFront:'#f8fafc', chLeft:'#e2e8f0', chRight:'#cbd5e1', chBack:'#475569', braceL:'#06b6d4', braceR:'#0284c7', braceB:'#334155', band:'#f97316', car:'#f97316', baseType:'retro_rail'},
  jungle:       {id:'jungle',       label:'Jungle',              name:'Temple of Kukulkan Drop',      sub:'Sculpted Mayan Head Top & Half-Height Brick Wall + Arch',hex:'#587c48', border:'#2fbf9a', chFront:'#bdb9a0', chLeft:'#a8a084', chRight:'#8e8a72', chBack:'#595443', braceL:'#d4cdb3', braceR:'#a8a084', braceB:'#6e6a56', band:'#2fbf9a', car:'#137a70', baseType:'brick_arch_jungle'},
  gothic:       {id:'gothic',       label:'Gothic',              name:'Cathedral Gargoyle Belfry',    sub:'Pitched Gothic Pyramid Roof, Corner Gargoyles & Brick Wall',hex:'#3b3345', border:'#7e22ce', chFront:'#52525b', chLeft:'#3f3f46', chRight:'#27272a', chBack:'#18181b', braceL:'#71717a', braceR:'#52525b', braceB:'#18181b', band:'#991b1b', car:'#7e22ce', baseType:'brick_arch_gothic'},
  nordic:       {id:'nordic',       label:'Nordic',              name:'Borgund Stave-Church Spire',   sub:'Tiered Stave-Church Roof Top & Runic Timber Fence',    hex:'#4d6b63', border:'#d97706', chFront:'#78350f', chLeft:'#5a361a', chRight:'#451a03', chBack:'#290f02', braceL:'#d97706', braceR:'#92400e', braceB:'#3e2410', band:'#0284c7', car:'#991b1b', baseType:'nordic_fence'},
  tiki:         {id:'tiki',         label:'Tiki',                name:'Volcano Tiki Altar Tower',     sub:'Round Carved Tiki Altar Top & Spiked Wooden Fence',    hex:'#5c9444', border:'#d97706', chFront:'#8a5a33', chLeft:'#6d4224', chRight:'#5a3b22', chBack:'#3e2716', braceL:'#d9a74a', braceR:'#b45309', braceB:'#451a03', band:'#f97316', car:'#d97706', baseType:'spiked_wood_tiki'},
  alps:         {id:'alps',         label:'Alps',                name:'Jungfrau Alpine Peak Drop',    sub:'Snow-Capped Pitched Roof with Swiss Flag & Chalet Rail',hex:'#a8c5d6', border:'#0284c7', chFront:'#f8fafc', chLeft:'#e2e8f0', chRight:'#cbd5e1', chBack:'#64748b', braceL:'#38bdf8', braceR:'#0284c7', braceB:'#475569', band:'#dc2626', car:'#dc2626', baseType:'alps_rail'},
  bavarian:     {id:'bavarian',     label:'Bavarian',            name:'Rathaus Glockenspiel Tower',   sub:'Half-Timbered Clock Tower Top & Biergarten Fence',     hex:'#769958', border:'#2563eb', chFront:'#f8fafc', chLeft:'#e2e8f0', chRight:'#cbd5e1', chBack:'#475569', braceL:'#2563eb', braceR:'#1d4ed8', braceB:'#1e3a8a', band:'#2563eb', car:'#2563eb', baseType:'bavarian_fence'},
  medieval:     {id:'medieval',     label:'Medieval',            name:'Royal Fantasy Castle Spire',   sub:'Round Castle Turret Roof Top & Stone Wall + Gated Arch',hex:'#6c8c58', border:'#eab308', chFront:'#cbd5e1', chLeft:'#94a3b8', chRight:'#64748b', chBack:'#334155', braceL:'#e2e8f0', braceR:'#94a3b8', braceB:'#475569', band:'#b91c1c', car:'#1d4ed8', baseType:'stone_gate_medieval'},
  americana:    {id:'americana',    label:'Americana',           name:'Liberty Eagle Cupola Tower',   sub:'Federal Brass-Domed Eagle Cupola & Brick/Iron Fence',  hex:'#a8644c', border:'#b91c1c', chFront:'#fbf6e8', chLeft:'#e2d8c3', chRight:'#cbd5e1', chBack:'#475569', braceL:'#b91c1c', braceR:'#1d3557', braceB:'#1e293b', band:'#b91c1c', car:'#1d3557', baseType:'americana_fence'},
  classic:      {id:'classic',      label:'Classic Midway',      name:'Boardwalk Parachute Big-Top',  sub:'Striped Carnival Big-Top Canopy & Bulb-Lit Ticket Gate',hex:'#cbb07c', border:'#e11d48', chFront:'#fffbeb', chLeft:'#fef3c7', chRight:'#fde68a', chBack:'#991b1b', braceL:'#e11d48', braceR:'#be123c', braceB:'#7f1d1d', band:'#e11d48', car:'#e11d48', baseType:'classic_fence'},
  caribbean:    {id:'caribbean',    label:'Caribbean',           name:'Port Royal Pirate Belltower',  sub:'Coquina Belltower with Pirate Flag & Stone Sea-Wall',  hex:'#6aa04a', border:'#d97706', chFront:'#e2d8c3', chLeft:'#cfc4ac', chRight:'#a89c84', chBack:'#5c5443', braceL:'#f59e0b', braceR:'#d97706', braceB:'#78350f', band:'#c2410c', car:'#991b1b', baseType:'caribbean_wall'}
};
DROP_TOWER_SKINS.unthemed = DROP_TOWER_SKINS.standard;
DROP_TOWER_SKINS.german   = DROP_TOWER_SKINS.bavarian;
DROP_TOWER_SKINS.wildwest = DROP_TOWER_SKINS.western;
DROP_TOWER_SKINS.retro    = DROP_TOWER_SKINS.retro_future;

/* ===== SPRITE CODE: copy this block into engine.js ===== */
function dropTowerCycle(msOrSec) {
  const s = (msOrSec > 100 ? msOrSec / 1000 : msOrSec) % 6.2;
  if (s < 3.1) return (1 - Math.cos(Math.PI * s / 3.1)) / 2 * 0.999; // Smooth winch lift
  if (s < 4.2) return 1.0;                                            // Tense summit pause
  if (s < 4.95) { const u = (s - 4.2) / 0.75; return Math.max(0, 1 - u * u); } // Smooth magnetic arrest (no bounce)
  return 0;
}

/**
 * drawDropTower(ctx, cx, cy, R, opts)
 *  Evolved Intamin Gyro-Drop Tower with 16 Architectural Cap & Base Enclosure Skins:
 *   - Main structural steel mast stays structural (only color-themed per land).
 *   - Compact, well-proportioned architectural cap tops (no oversized overhangs!).
 *   - Custom themed base perimeter walls/fences with front-right entrance arches/gates.
 *
 *  opts.themeId / theme : any of the 16 theme keys above
 *  opts.rideThemeTier   : 0..4 (<=2 renders Standard Unthemed; >=3 renders Heavy/Immersive skin)
 *  opts.accent          : Land color (default '#38bdf8')
 *  opts.levels          : Tower height 3..10 (default 6)
 *  opts.t               : Gondola position 0..1, OR elapsed time in seconds if > 1.05
 *  opts.lift            : Optional explicit 0..1 gondola height override
 *  opts.flip            : Mirror horizontally
 *  opts.tile            : Draw hex tile underneath (default true)
 */
function drawDropTower(ctx, cx, cy, R, opts = {}) {
  const tier = opts.rideThemeTier != null ? opts.rideThemeTier : (opts.tier != null ? opts.tier : (opts.themeId || opts.theme ? 3 : 0));
  let rawTh = String(opts.themeId || opts.theme || 'standard').toLowerCase().replace(/-/g, '_');
  if (rawTh === 'unthemed') rawTh = 'standard';
  if (rawTh === 'german') rawTh = 'bavarian';
  if (rawTh === 'wildwest' || rawTh === 'wild_west') rawTh = 'western';
  if (rawTh === 'retro') rawTh = 'retro_future';
  const theme = (tier <= 2 || !DROP_TOWER_SKINS[rawTh]) ? 'standard' : rawTh;
  const meta = DROP_TOWER_SKINS[theme] || DROP_TOWER_SKINS.standard;

  const accent = opts.accent || meta.border || '#38bdf8';
  const levels = Math.max(3, Math.min(12, opts.levels || 6));
  const fl = opts.flip ? -1 : 1;
  const clockSec = (opts.tm != null) ? opts.tm : (typeof performance !== 'undefined' ? performance.now() / 1000 : 0);
  const t = (opts.lift != null)
    ? opts.lift
    : (opts.t == null ? 0.82 : (opts.t > 1.05 ? dropTowerCycle(opts.t) : opts.t));
  const TAU = Math.PI * 2;

  ctx.save();
  if (opts.flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Isometric Projection:
  // `X` and `Y` form the horizontal plane; `Z` is vertical elevation in world units `S`
  const cyB = cy + R * 0.14;
  const S = R * 0.088;
  const P = (X, Y, Z = 0) => [cx + (X - Y) * 0.7 * S, cyB + (X + Y) * 0.35 * S - Z * S];

  const line = (a, b, c, w) => {
    ctx.strokeStyle = c; ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  };
  const poly = (pts, fill, stroke, lw) => {
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || S * 0.05; ctx.stroke(); }
  };
  const disc = (p, rad, fill) => {
    ctx.fillStyle = fill;
    ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(0.5, rad), 0, TAU); ctx.fill();
  };
  const ell = (p, rx, ry, fill, stroke, lw) => {
    ctx.beginPath(); ctx.ellipse(p[0], p[1], Math.max(0.4, rx), Math.max(0.4, ry), 0, 0, TAU);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || S * 0.05; ctx.stroke(); }
  };
  const isoBox = (x0, x1, y0, y1, z0, z1, cf, ce, ct) => {
    if (ct) poly([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], ct);
    poly([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)], cf);
    poly([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)], ce);
  };
  const cylZ = (rad, z0, z1, col, topCol) => {
    const b = P(0, 0, z0), t = P(0, 0, z1), rx = 0.99 * rad * S, ry = 0.495 * rad * S;
    const gr = ctx.createLinearGradient(b[0] - rx, 0, b[0] + rx, 0);
    gr.addColorStop(0, shade(col, 0.25));
    gr.addColorStop(0.42, col);
    gr.addColorStop(1, shade(col, -0.36));
    ctx.beginPath();
    ctx.moveTo(b[0] - rx, b[1]); ctx.lineTo(t[0] - rx, t[1]);
    ctx.lineTo(t[0] + rx, t[1]); ctx.lineTo(b[0] + rx, b[1]);
    ctx.ellipse(b[0], b[1], rx, ry, 0, 0, Math.PI);
    ctx.closePath();
    ctx.fillStyle = gr; ctx.fill();
    if (topCol !== false) ell(t, rx, ry, topCol || shade(col, 0.22));
  };
  const coneZ = (rad, z0, z1, col) => {
    const b = P(0, 0, z0), t = P(0, 0, z1), rx = 0.99 * rad * S, ry = 0.495 * rad * S;
    const gr = ctx.createLinearGradient(b[0] - rx, 0, b[0] + rx, 0);
    gr.addColorStop(0, shade(col, 0.25));
    gr.addColorStop(0.45, col);
    gr.addColorStop(1, shade(col, -0.38));
    ctx.beginPath();
    ctx.moveTo(b[0] - rx, b[1]); ctx.lineTo(t[0], t[1]); ctx.lineTo(b[0] + rx, b[1]);
    ctx.ellipse(b[0], b[1], rx, ry, 0, 0, Math.PI);
    ctx.closePath();
    ctx.fillStyle = gr; ctx.fill();
    return t;
  };
  const pyrCap = (hw, z0, z1, colFront, colRight) => {
    const ap = P(0, 0, z1);
    poly([P(-hw, hw, z0), P(hw, hw, z0), ap], colFront);
    poly([P(hw, -hw, z0), P(hw, hw, z0), ap], colRight);
    return ap;
  };

  // Structural Proportions (in `S` world units)
  const zDeck = 0.42;              // Boarding deck elevation
  const segH  = 2.15;              // Vertical height per tower segment
  const zMast0 = zDeck;
  const zMast1 = zMast0 + (levels + 1) * segH; // Top of steel lattice mast
  const mw    = 0.88;              // Half-width of the square steel lattice mast (-mw .. +mw)
  const bw    = 1.62;              // Half-width of the slanted 4-leg base buttress (-bw .. +bw)
  const zButt = Math.min(zMast0 + 2.4, zMast0 + (zMast1 - zMast0) * 0.45);
  const bandCol = meta.band || accent;

  // 1. Optional Hex Tile Base & Clipped Directional Tower Shadow
  if (opts.tile !== false) {
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = theme === 'standard' ? '#cbd5e1' : meta.hex;
    ctx.fill();
    ctx.lineWidth = Math.max(2, R * 0.05);
    ctx.strokeStyle = theme === 'standard' ? accent : meta.border;
    ctx.stroke();

    ctx.save();
    hexPath(ctx, cx, cy, R * 0.96);
    ctx.clip();
    const pBase = P(0, 0, 0);
    const shLen = Math.min(zMast1 * 0.45 * S, R * 0.95);
    poly([
      [pBase[0] - S * 1.4, pBase[1] - S * 0.5],
      [pBase[0] + S * 1.4, pBase[1] + S * 0.5],
      [pBase[0] + S * 1.4 + fl * shLen, pBase[1] + S * 0.5 + shLen * 0.36],
      [pBase[0] - S * 1.4 + fl * shLen, pBase[1] - S * 0.5 + shLen * 0.36]
    ], 'rgba(15, 23, 42, 0.22)');
    ctx.restore();
  }

  // 2. Stepped Circular Boarding Platform & Buffer Pistons
  const pGnd = P(0, 0, 0);
  ell([pGnd[0] + fl * S * 0.22, pGnd[1] + S * 0.14], S * 3.85, S * 1.92, 'rgba(15, 23, 42, 0.28)');
  const deckRimCol = (theme === 'frontier' || theme === 'western' || theme === 'tiki' || theme === 'nordic') ? '#5a3b22'
                   : (theme === 'jungle' || theme === 'fiesta' || theme === 'caribbean' || theme === 'medieval') ? '#78716c'
                   : (theme === 'gothic') ? '#27272a' : '#64748b';
  const deckTopCol = (theme === 'frontier' || theme === 'western' || theme === 'tiki' || theme === 'nordic') ? '#b58858'
                   : (theme === 'jungle' || theme === 'fiesta' || theme === 'caribbean' || theme === 'medieval') ? '#d6ceba'
                   : (theme === 'gothic') ? '#3f3f46' : '#e2e8f0';
  cylZ(3.55, 0, 0.22, deckRimCol, shade(deckRimCol, 0.2));
  cylZ(3.25, 0.22, zDeck, shade(deckTopCol, -0.15), deckTopCol);
  ell(P(0, 0, zDeck + 0.01), 3.05 * S, 1.52 * S, null, bandCol, S * 0.09);

  // =========================================================================
  // HELPER: THEMED BASE ENCLOSURE (Walls, Spiked Fences & Gated Arches)
  //   Split into `isFront = false` (Back half behind tower) and `isFront = true`
  //   (Front half with entrance arch/gate on the front-left `+Y` side)
  // =========================================================================
  const drawBaseEnclosure = (isFront) => {
    const bt = meta.baseType;
    const rEnc = 3.16;

    // A. SPIKED WOODEN FENCE (Frontier, Wild West, Tiki)
    if (bt === 'spiked_wood' || bt === 'spiked_wood_tiki') {
      const wDark = bt === 'spiked_wood_tiki' ? '#451a03' : '#5a3b22';
      const wLit  = bt === 'spiked_wood_tiki' ? '#78350f' : '#8a5a33';
      const hLog  = 1.15;
      const N_LOGS = 28;
      // Horizontal binding rails
      for (let k = 0; k < N_LOGS; k++) {
        const a0 = (k / N_LOGS) * TAU, a1 = ((k + 1) / N_LOGS) * TAU;
        const am = (a0 + a1) * 0.5;
        const frontSide = (Math.cos(am) + Math.sin(am)) >= 0;
        if (frontSide !== isFront) continue;
        // Leave entrance gap at front-left (am ~ +0.85 rad)
        if (isFront && Math.abs(am - 0.85) < 0.34) continue;
        const p0 = P(rEnc * Math.cos(a0), rEnc * Math.sin(a0), zDeck + 0.55);
        const p1 = P(rEnc * Math.cos(a1), rEnc * Math.sin(a1), zDeck + 0.55);
        line(p0, p1, wDark, S * 0.14);
      }
      // Vertical pointed wooden spikes
      const stakes = [];
      for (let k = 0; k < N_LOGS; k++) {
        const a = (k / N_LOGS) * TAU;
        const frontSide = (Math.cos(a) + Math.sin(a)) >= 0;
        if (frontSide !== isFront) continue;
        if (isFront && Math.abs(a - 0.85) < 0.34) continue;
        stakes.push({ a, x: rEnc * Math.cos(a), y: rEnc * Math.sin(a), h: hLog + (k % 3) * 0.08 });
      }
      stakes.sort((u, v) => (u.x + u.y) - (v.x + v.y)).forEach(st => {
        const pB = P(st.x, st.y, zDeck);
        const pT = P(st.x, st.y, zDeck + st.h);
        const pTip = P(st.x, st.y, zDeck + st.h + 0.34);
        line(pB, pT, wLit, S * 0.20);
        poly([[pT[0] - S * 0.10, pT[1]], pTip, [pT[0] + S * 0.10, pT[1]]], '#d9b27a');
      });
      // Entrance Gateposts & Cross-Lintel at a = 0.85 rad
      if (isFront) {
        [0.48, 1.22].forEach(ga => {
          const gx = rEnc * Math.cos(ga), gy = rEnc * Math.sin(ga);
          line(P(gx, gy, zDeck), P(gx, gy, zDeck + 1.85), wDark, S * 0.28);
          if (bt === 'spiked_wood_tiki') {
            disc(P(gx, gy, zDeck + 1.95), S * 0.20, '#f97316');
          } else {
            disc(P(gx, gy, zDeck + 1.95), S * 0.16, '#eab308');
          }
        });
        line(P(rEnc * Math.cos(0.48), rEnc * Math.sin(0.48), zDeck + 1.75), P(rEnc * Math.cos(1.22), rEnc * Math.sin(1.22), zDeck + 1.75), wLit, S * 0.22);
      }
    }
    // B. HALF-HEIGHT BRICK / STONE WALL WITH ARCH ENTRANCE (Fiesta, Jungle, Gothic, Medieval, Caribbean)
    else if (bt.startsWith('brick_arch') || bt === 'stone_gate_medieval' || bt === 'caribbean_wall') {
      const wCols = bt === 'brick_arch_fiesta'    ? ['#e07a5f', '#c2410c', '#facc15']
                  : bt === 'brick_arch_jungle'    ? ['#a8a084', '#7d765f', '#2fbf9a']
                  : bt === 'brick_arch_gothic'    ? ['#52525b', '#27272a', '#991b1b']
                  : bt === 'caribbean_wall'       ? ['#e2d8c3', '#a89c84', '#c2410c']
                  :                                 ['#cbd5e1', '#64748b', '#eab308']; // Medieval stone
      const hWall = 1.05;
      const N_SEG = 20;
      const segs = [];
      for (let k = 0; k < N_SEG; k++) {
        const a0 = (k / N_SEG) * TAU, a1 = ((k + 1) / N_SEG) * TAU;
        const am = (a0 + a1) * 0.5;
        const frontSide = (Math.cos(am) + Math.sin(am)) >= 0;
        if (frontSide !== isFront) continue;
        // Entrance archway opening at am ~ +0.85 rad
        if (isFront && Math.abs(am - 0.85) < 0.32) continue;
        segs.push({ a0, a1, am, depth: Math.cos(am) + Math.sin(am) });
      }
      segs.sort((u, v) => u.depth - v.depth).forEach(sg => {
        const x0 = rEnc * Math.cos(sg.a0), y0 = rEnc * Math.sin(sg.a0);
        const x1 = rEnc * Math.cos(sg.a1), y1 = rEnc * Math.sin(sg.a1);
        const col = (Math.cos(sg.am) - Math.sin(sg.am)) < 0 ? wCols[0] : wCols[1];
        poly([P(x0, y0, zDeck), P(x1, y1, zDeck), P(x1, y1, zDeck + hWall), P(x0, y0, zDeck + hWall)], col, shade(col, -0.35), S * 0.04);
        // Stone coping cap along top of wall
        line(P(x0, y0, zDeck + hWall), P(x1, y1, zDeck + hWall), wCols[2], S * 0.14);
      });

      // Entrance Archway on the front half
      if (isFront) {
        const aL = 0.50, aR = 1.20, aMid = 0.85;
        const pL0 = P(rEnc * Math.cos(aL), rEnc * Math.sin(aL), zDeck);
        const pL1 = P(rEnc * Math.cos(aL), rEnc * Math.sin(aL), zDeck + 1.65);
        const pR0 = P(rEnc * Math.cos(aR), rEnc * Math.sin(aR), zDeck);
        const pR1 = P(rEnc * Math.cos(aR), rEnc * Math.sin(aR), zDeck + 1.65);
        const pPeak = P(rEnc * Math.cos(aMid), rEnc * Math.sin(aMid), zDeck + 2.25);

        // Twin gate piers
        line(pL0, pL1, wCols[0], S * 0.34);
        line(pR0, pR1, wCols[1], S * 0.34);
        // Arched lintel bridge
        poly([
          [pL1[0] - S*0.14, pL1[1]],
          [pR1[0] + S*0.14, pR1[1]],
          [pR1[0] + S*0.14, pR1[1] - S*0.24],
          [pPeak[0], pPeak[1] - S*0.18],
          [pL1[0] - S*0.14, pL1[1] - S*0.24]
        ], wCols[0], wCols[2], S * 0.06);

        // Iron portcullis gate bars for Medieval & Gothic
        if (bt === 'stone_gate_medieval' || bt === 'brick_arch_gothic') {
          [0.65, 0.85, 1.05].forEach(ga => {
            const gx = rEnc * Math.cos(ga), gy = rEnc * Math.sin(ga);
            line(P(gx, gy, zDeck + 0.95), P(gx, gy, zDeck + 1.72), '#1e293b', S * 0.06);
          });
        }
      }
    }
    // C. THEMED PERIMETER RAILINGS & FENCES (Standard, Space, Retro, Alps, Bavarian, Nordic, Americana, Classic)
    else {
      const postCol = (bt === 'nordic' || bt === 'alps' || bt === 'bavarian') ? '#5a3b22' : '#475569';
      const railCol = bandCol;
      for (let k = 0; k < 16; k++) {
        const a = (k / 16) * TAU;
        const frontSide = (Math.cos(a) + Math.sin(a)) >= 0;
        if (frontSide !== isFront) continue;
        if (isFront && Math.abs(a - 0.85) < 0.25) continue;
        const gx = rEnc * Math.cos(a), gy = rEnc * Math.sin(a);
        line(P(gx, gy, zDeck), P(gx, gy, zDeck + 0.72), postCol, S * 0.08);
        disc(P(gx, gy, zDeck + 0.75), S * 0.07, railCol);
        const aNext = ((k + 1) / 16) * TAU;
        if (!isFront || Math.abs(aNext - 0.85) >= 0.25) {
          line(P(gx, gy, zDeck + 0.65), P(rEnc * Math.cos(aNext), rEnc * Math.sin(aNext), zDeck + 0.65), railCol, S * 0.07);
        }
      }
    }
  };

  // Draw Back Half of Base Enclosure
  drawBaseEnclosure(false);

  // 4 Hydraulic Emergency Buffer Pistons at base of mast
  [[-mw * 0.55, -mw * 0.55], [mw * 0.55, -mw * 0.55], [-mw * 0.55, mw * 0.55], [mw * 0.55, mw * 0.55]].forEach(([bx, by]) => {
    line(P(bx, by, zDeck), P(bx, by, zDeck + 0.72), '#334155', S * 0.18);
    line(P(bx, by, zDeck + 0.45), P(bx, by, zDeck + 0.92), '#facc15', S * 0.11);
  });

  // =========================================================================
  // 3. OPEN-INTERIOR 3D STEEL LATTICE MAST — BACK HALF (Color-Themed Only!)
  // =========================================================================
  const backCorner  = [-mw, -mw];
  const leftCorner  = [-mw,  mw];
  const rightCorner = [ mw, -mw];
  const frontCorner = [ mw,  mw];

  line(P(backCorner[0], backCorner[1], zMast0), P(backCorner[0], backCorner[1], zMast1), meta.chBack, S * 0.22);

  const nSegs = levels + 1;
  for (let i = 0; i < nSegs; i++) {
    const za = zMast0 + i * segH;
    const zb = za + segH;
    const isBand = (i > 0 && i % 3 === 0);

    // Back-Left face
    line(P(backCorner[0], backCorner[1], za), P(leftCorner[0], leftCorner[1], zb), meta.braceB, S * 0.085);
    line(P(leftCorner[0], leftCorner[1], za), P(backCorner[0], backCorner[1], zb), meta.braceB, S * 0.085);
    line(P(backCorner[0], backCorner[1], zb), P(leftCorner[0], leftCorner[1], zb), isBand ? bandCol : meta.braceB, S * (isBand ? 0.14 : 0.09));

    // Back-Right face
    line(P(backCorner[0], backCorner[1], za), P(rightCorner[0], rightCorner[1], zb), shade(meta.braceB, -0.2), S * 0.085);
    line(P(rightCorner[0], rightCorner[1], za), P(backCorner[0], backCorner[1], zb), shade(meta.braceB, -0.2), S * 0.085);
    line(P(backCorner[0], backCorner[1], zb), P(rightCorner[0], rightCorner[1], zb), isBand ? shade(bandCol, -0.25) : shade(meta.braceB, -0.2), S * (isBand ? 0.14 : 0.09));
  }

  // Back slanted base buttress leg
  line(P(-bw, -bw, zDeck), P(-mw, -mw, zButt), meta.chBack, S * 0.24);
  line(P(-bw, -bw, zDeck), P(-bw, bw, zDeck), meta.chRight, S * 0.14);
  line(P(-bw, -bw, zDeck), P(bw, -bw, zDeck), meta.chBack, S * 0.14);

  // =========================================================================
  // 4. CIRCULAR 14-SEAT GYRO-DROP GONDOLA & TENSION HOIST CABLES
  // =========================================================================
  const zCarMin = zDeck + 0.95;
  const zCarMax = zMast1 - 1.35;
  const zCar = zCarMin + t * Math.max(0.2, zCarMax - zCarMin);
  const Rgon = 2.08;
  const hGon = 0.68;

  [[-0.35, -0.35], [0.35, -0.35], [-0.35, 0.35], [0.35, 0.35]].forEach(([cxOff, cyOff]) => {
    line(P(cxOff, cyOff, zCar + hGon), P(cxOff, cyOff, zMast1 + 0.2), 'rgba(203, 213, 225, 0.65)', S * 0.045);
  });

  const drawGondolaHalf = (isFront) => {
    const N_ARC = 24;
    const aStart = isFront ? -Math.PI * 0.25 : Math.PI * 0.75;
    const aEnd   = isFront ?  Math.PI * 0.75 : Math.PI * 1.75;
    const carMain = theme === 'standard' ? accent : meta.car;

    const ptsBot = [], ptsTop = [];
    for (let k = 0; k <= N_ARC; k++) {
      const a = aStart + (aEnd - aStart) * (k / N_ARC);
      ptsBot.push(P(Rgon * Math.cos(a), Rgon * Math.sin(a), zCar));
      ptsTop.push(P(Rgon * Math.cos(a), Rgon * Math.sin(a), zCar + hGon));
    }
    poly(ptsTop.concat(ptsBot.slice().reverse()), isFront ? carMain : shade(carMain, -0.45));

    ctx.strokeStyle = isFront ? shade(carMain, 0.35) : shade(carMain, -0.25);
    ctx.lineWidth = S * 0.11;
    ctx.beginPath();
    ptsTop.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.stroke();

    const shirtCols = ['#ef4444', '#38bdf8', '#22c55e', '#facc15', '#a855f7', '#f97316'];
    const nSeats = 14;
    for (let s = 0; s < nSeats; s++) {
      const a = (s / nSeats) * TAU + 0.22;
      const inFrontHalf = (Math.cos(a) + Math.sin(a)) >= 0;
      if (inFrontHalf !== isFront) continue;

      const rSeat = Rgon + 0.14;
      const rFoot = Rgon + 0.48;
      const pHip  = P(rSeat * Math.cos(a), rSeat * Math.sin(a), zCar + 0.16);
      const pShld = P(rSeat * Math.cos(a), rSeat * Math.sin(a), zCar + 0.56);
      const pHead = P(rSeat * Math.cos(a), rSeat * Math.sin(a), zCar + 0.84);
      const pKnee = P(rFoot * Math.cos(a), rFoot * Math.sin(a), zCar + 0.08);
      const pToe  = P(rFoot * Math.cos(a), rFoot * Math.sin(a), zCar - 0.34);

      line(pHip, pKnee, '#1e293b', S * 0.13);
      line(pKnee, pToe, '#0f172a', S * 0.12);
      disc(pToe, S * 0.07, '#e2e8f0');

      line(pHip, P(rSeat * Math.cos(a), rSeat * Math.sin(a), zCar + 0.72), '#1e293b', S * 0.26);
      line(pHip, pShld, shirtCols[s % 6], S * 0.22);
      line(pHip, pShld, '#facc15', S * 0.09);
      disc(pHead, S * 0.15, '#fde4c8');
    }
  };

  drawGondolaHalf(false);

  // =========================================================================
  // 5. OPEN-INTERIOR 3D STEEL LATTICE MAST — FRONT HALF & MAGNETIC BRAKE FINS
  // =========================================================================
  for (let i = 0; i < nSegs; i++) {
    const za = zMast0 + i * segH;
    const zb = za + segH;
    const isBand = (i > 0 && i % 3 === 0);

    // Front-Left face
    line(P(leftCorner[0], leftCorner[1], za), P(frontCorner[0], frontCorner[1], zb), meta.braceL, S * 0.095);
    line(P(frontCorner[0], frontCorner[1], za), P(leftCorner[0], leftCorner[1], zb), meta.braceL, S * 0.095);
    line(P(leftCorner[0], leftCorner[1], zb), P(frontCorner[0], frontCorner[1], zb), isBand ? bandCol : meta.braceL, S * (isBand ? 0.16 : 0.10));

    // Front-Right face
    line(P(rightCorner[0], rightCorner[1], za), P(frontCorner[0], frontCorner[1], zb), meta.braceR, S * 0.095);
    line(P(frontCorner[0], frontCorner[1], za), P(rightCorner[0], rightCorner[1], zb), meta.braceR, S * 0.095);
    line(P(rightCorner[0], rightCorner[1], zb), P(frontCorner[0], frontCorner[1], zb), isBand ? shade(bandCol, -0.25) : meta.braceR, S * (isBand ? 0.16 : 0.10));
  }

  // Magnetic Brake Fins
  const zBrakeTop = zMast0 + (zMast1 - zMast0) * 0.34;
  [-0.38, 0.38].forEach(fOff => {
    line(P(fOff * mw, mw + 0.04, zMast0 + 0.4), P(fOff * mw, mw + 0.04, zBrakeTop), '#d97706', S * 0.11);
    line(P(mw + 0.04, fOff * mw, zMast0 + 0.4), P(mw + 0.04, fOff * mw, zBrakeTop), '#b45309', S * 0.11);
  });

  // Three Front Main Tubular Corner Chords
  const drawChord = (cxC, cyC, colMain, colHi) => {
    const pB = P(cxC, cyC, zMast0), pT = P(cxC, cyC, zMast1);
    line(pB, pT, colMain, S * 0.25);
    line([pB[0] - S * 0.05, pB[1]], [pT[0] - S * 0.05, pT[1]], colHi, S * 0.08);
  };
  drawChord(leftCorner[0], leftCorner[1], meta.chLeft, shade(meta.chLeft, 0.35));
  drawChord(rightCorner[0], rightCorner[1], meta.chRight, shade(meta.chRight, 0.30));
  drawChord(frontCorner[0], frontCorner[1], meta.chFront, shade(meta.chFront, 0.35));

  // Three Slanted Base Buttress Legs + Horizontal Tie-Beams
  [
    [-bw,  bw, -mw,  mw, meta.chLeft],
    [ bw, -bw,  mw, -mw, meta.chRight],
    [ bw,  bw,  mw,  mw, meta.chFront]
  ].forEach(([bx, by, tx, ty, col]) => {
    line(P(bx, by, zDeck), P(tx, ty, zButt), col, S * 0.25);
    line([P(bx, by, zDeck)[0] - S * 0.05, P(bx, by, zDeck)[1]], [P(tx, ty, zButt)[0] - S * 0.05, P(tx, ty, zButt)[1]], shade(col, 0.35), S * 0.08);
  });
  line(P(-bw, bw, zDeck), P(bw, bw, zDeck), meta.chLeft, S * 0.16);
  line(P(bw, -bw, zDeck), P(bw, bw, zDeck), meta.chRight, S * 0.16);

  // =========================================================================
  // 6. FRONT HALF OF GYRO-DROP GONDOLA & FRONT HALF OF BASE ENCLOSURE
  // =========================================================================
  drawGondolaHalf(true);
  drawBaseEnclosure(true);

  // =========================================================================
  // 7. COMPACT PROPORTIONAL ARCHITECTURAL CAP TOPS (`zCap0 = zMast1`)
  //    Strictly compact width (`cw <= 1.55 * mw`) so caps never look oversized!
  // =========================================================================
  const zCap0 = zMast1;

  if (theme === 'standard') {
    // STANDARD: Intamin Hoist Machine Room Crown & Pulsing Red Strobe
    const cw = mw * 1.48;
    isoBox(-cw, cw, -cw, cw, zCap0, zCap0 + 0.26, '#64748b', '#475569', '#cbd5e1');
    [[-cw, cw], [0, cw], [cw, cw], [cw, 0], [cw, -cw]].forEach(([rx, ry]) => {
      line(P(rx, ry, zCap0 + 0.26), P(rx, ry, zCap0 + 0.68), '#e2e8f0', S * 0.06);
    });
    line(P(-cw, cw, zCap0 + 0.65), P(cw, cw, zCap0 + 0.65), accent, S * 0.075);
    line(P(cw, -cw, zCap0 + 0.65), P(cw, cw, zCap0 + 0.65), shade(accent, -0.22), S * 0.075);

    const hw = mw * 1.12;
    isoBox(-hw, hw, -hw, hw, zCap0 + 0.26, zCap0 + 1.15, accent, shade(accent, -0.32), shade(accent, 0.24));
    [-0.30, 0.30].forEach(py => {
      const pDrum = P(hw + 0.04, py, zCap0 + 0.72);
      disc(pDrum, S * 0.26, '#334155');
      disc(pDrum, S * 0.14, '#facc15');
    });
    isoBox(-hw * 1.06, hw * 1.06, -hw * 1.06, hw * 1.06, zCap0 + 1.15, zCap0 + 1.32, '#475569', '#334155', '#94a3b8');
    const pSpireT = P(0, 0, zCap0 + 2.65);
    line(P(0, 0, zCap0 + 1.32), pSpireT, '#e2e8f0', S * 0.13);
    const strobeOn = Math.sin(clockSec * 7.5) > 0;
    if (strobeOn) disc(pSpireT, S * 0.40, 'rgba(239, 68, 68, 0.35)');
    disc(pSpireT, S * 0.18, strobeOn ? '#ef4444' : '#991b1b');
  }
  else if (theme === 'frontier') {
    // FRONTIER: Compact Forest-Service Fire-Watchtower Cabin Top
    const cw = mw * 1.48;
    isoBox(-cw, cw, -cw, cw, zCap0, zCap0 + 0.22, '#6b4a2b', '#4a3320', '#8a5a33');
    // Catwalk posts
    [[-cw, cw], [cw, cw], [cw, -cw]].forEach(([rx, ry]) => {
      line(P(rx, ry, zCap0 + 0.22), P(rx, ry, zCap0 + 0.62), '#8a5a33', S * 0.06);
    });
    const hw = mw * 1.12;
    isoBox(-hw, hw, -hw, hw, zCap0 + 0.22, zCap0 + 1.18, '#7c4d2b', '#5a3b22', '#2f5f3a');
    // Glowing lookout windows
    poly([P(-hw*0.7, hw+0.01, zCap0+0.42), P(hw*0.7, hw+0.01, zCap0+0.42), P(hw*0.7, hw+0.01, zCap0+0.98), P(-hw*0.7, hw+0.01, zCap0+0.98)], '#fde047');
    poly([P(hw+0.01, -hw*0.7, zCap0+0.42), P(hw+0.01, hw*0.7, zCap0+0.42), P(hw+0.01, hw*0.7, zCap0+0.98), P(hw+0.01, -hw*0.7, zCap0+0.98)], '#f59e0b');
    // Forest-green hipped shingle roof
    const ap = pyrCap(hw * 1.24, zCap0 + 1.18, zCap0 + 2.15, '#2f5f3a', '#1e3f28');
    line(ap, [ap[0], ap[1] - S * 0.45], '#eab308', S * 0.09);
  }
  else if (theme === 'western') {
    // WILD WEST: Compact Timber Oil-Derrick Crown-Block & Twin Sheave Pulleys
    const cw = mw * 1.45;
    isoBox(-cw, cw, -cw, cw, zCap0, zCap0 + 0.24, '#78350f', '#451a03', '#9a6a3c');
    const hw = mw * 0.92;
    line(P(-hw, hw, zCap0 + 0.24), P(-hw * 0.55, hw * 0.55, zCap0 + 1.45), '#5a3b22', S * 0.16);
    line(P( hw, hw, zCap0 + 0.24), P( hw * 0.55, hw * 0.55, zCap0 + 1.45), '#451a03', S * 0.16);
    line(P( hw,-hw, zCap0 + 0.24), P( hw * 0.55,-hw * 0.55, zCap0 + 1.45), '#5a3b22', S * 0.16);
    isoBox(-hw * 0.75, hw * 0.75, -hw * 0.75, hw * 0.75, zCap0 + 1.40, zCap0 + 1.65, '#b91c1c', '#7f1d1d', '#f59e0b');
    // Twin iron crown-block sheave wheels
    [-0.28, 0.28].forEach(ox => {
      const wp = P(ox, 0, zCap0 + 1.95);
      disc(wp, S * 0.34, '#27272a');
      disc(wp, S * 0.18, '#f59e0b');
    });
  }
  else if (theme === 'fiesta') {
    // FIESTA: Compact Spanish Mission Belltower (Campanario)
    const cw = mw * 1.38;
    isoBox(-cw, cw, -cw, cw, zCap0, zCap0 + 0.22, '#c2410c', '#7c2d12', '#f59e0b');
    const hw = mw * 1.15;
    isoBox(-hw, hw, -hw, hw, zCap0 + 0.22, zCap0 + 1.35, '#fffbeb', '#dfd3b8', '#0d9488');
    // Arched bell opening + golden mission bell
    poly([P(-hw*0.45, hw+0.01, zCap0+0.35), P(hw*0.45, hw+0.01, zCap0+0.35), P(hw*0.45, hw+0.01, zCap0+0.95), P(0, hw+0.01, zCap0+1.18), P(-hw*0.45, hw+0.01, zCap0+0.95)], '#291509');
    disc(P(0, hw + 0.02, zCap0 + 0.65), S * 0.20, '#f59e0b');
    // Terracotta pyramid roof & mission cross
    const ap = pyrCap(hw * 1.12, zCap0 + 1.35, zCap0 + 2.25, '#c2410c', '#9a3412');
    line(ap, [ap[0], ap[1] - S * 0.55], '#facc15', S * 0.09);
    line([ap[0] - S * 0.22, ap[1] - S * 0.36], [ap[0] + S * 0.22, ap[1] - S * 0.36], '#facc15', S * 0.08);
  }
  else if (theme === 'space') {
    // SPACE: Round UFO Flying Saucer Top with Glowing Cyan Rim Lights & Dome
    const rUfo = mw * 1.75;
    cylZ(rUfo * 0.72, zCap0, zCap0 + 0.24, '#334155', '#0284c7');
    const pMid = P(0, 0, zCap0 + 0.44);
    ell(pMid, rUfo * 0.99 * S, rUfo * 0.495 * S, '#cbd5e1', '#22d3ee', S * 0.08);
    // Glowing cyan/magenta rim lights around the saucer
    for (let k = 0; k < 8; k++) {
      const a = clockSec * 2.5 + (k / 8) * Math.PI;
      const lp = P(rUfo * 0.88 * Math.cos(a), rUfo * 0.88 * Math.sin(a), zCap0 + 0.45);
      disc(lp, S * 0.09, k % 2 ? '#22d3ee' : '#e879f9');
    }
    // Translucent cyan cockpit bubble dome on top of the UFO
    const pDome = P(0, 0, zCap0 + 0.52);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.72)';
    ctx.beginPath(); ctx.arc(pDome[0], pDome[1], mw * 0.85 * S, Math.PI, 0); ctx.closePath(); ctx.fill();
    disc([pDome[0] - S * 0.22, pDome[1] - S * 0.35], S * 0.14, '#ffffff');
  }
  else if (theme === 'retro_future') {
    // RETRO-FUTURE: Jetsons-Style Googie Ringed Saucer Pod with Tall Atomic Needle Spire
    const rPod = mw * 1.55;
    cylZ(mw * 0.75, zCap0, zCap0 + 0.28, '#0284c7', '#22d3ee');
    const pPod = P(0, 0, zCap0 + 0.56);
    ell(pPod, rPod * 0.99 * S, rPod * 0.495 * S, '#f8fafc', '#f97316', S * 0.09);
    cylZ(mw * 0.92, zCap0 + 0.56, zCap0 + 0.98, '#06b6d4', '#f8fafc');
    // Tall Jetsons needle spire with twin floating rings
    const pTip = P(0, 0, zCap0 + 2.65);
    line(P(0, 0, zCap0 + 0.98), pTip, '#f8fafc', S * 0.11);
    ell(P(0, 0, zCap0 + 1.65), S * 0.65, S * 0.24, null, '#f97316', S * 0.07);
    disc(pTip, S * 0.16, '#f97316');
  }
  else if (theme === 'jungle') {
    // JUNGLE: Sculpted Mayan Stone Deity Head Top
    const cw = mw * 1.38;
    isoBox(-cw, cw, -cw, cw, zCap0, zCap0 + 0.22, '#8e8a72', '#595443', '#bdb9a0');
    const hw = mw * 1.18;
    // Sculpted Mayan stone head block
    isoBox(-hw, hw, -hw, hw, zCap0 + 0.22, zCap0 + 1.48, '#bdb9a0', '#8e8a72', '#2fbf9a');
    // Jade-inlaid eyes, carved nose & fanged mouth on front-left face
    disc(P(-hw * 0.38, hw + 0.02, zCap0 + 1.02), S * 0.14, '#2fbf9a');
    disc(P( hw * 0.38, hw + 0.02, zCap0 + 1.02), S * 0.14, '#2fbf9a');
    poly([P(-hw * 0.15, hw + 0.02, zCap0 + 0.72), P(hw * 0.15, hw + 0.02, zCap0 + 0.72), P(0, hw + 0.02, zCap0 + 1.08)], '#d4cdb3');
    poly([P(-hw * 0.55, hw + 0.02, zCap0 + 0.36), P(hw * 0.55, hw + 0.02, zCap0 + 0.36), P(hw * 0.45, hw + 0.02, zCap0 + 0.62), P(-hw * 0.45, hw + 0.02, zCap0 + 0.62)], '#292524');
    // Golden feathered crown crest
    isoBox(-hw * 0.85, hw * 0.85, -hw * 0.85, hw * 0.85, zCap0 + 1.48, zCap0 + 1.82, '#eab308', '#b45309', '#fde047');
  }
  else if (theme === 'gothic') {
    // GOTHIC: Pitched Gothic Pyramid Roof with Corner Stone Gargoyles
    const cw = mw * 1.42;
    isoBox(-cw, cw, -cw, cw, zCap0, zCap0 + 0.26, '#27272a', '#18181b', '#3f3f46');
    const hw = mw * 1.15;
    isoBox(-hw, hw, -hw, hw, zCap0 + 0.26, zCap0 + 0.85, '#3f3f46', '#27272a', '#52525b');
    // 4 Corner Gargoyles projecting outward from the cornice
    [[-cw, cw], [cw, cw], [cw, -cw]].forEach(([gx, gy]) => {
      const gp = P(gx, gy, zCap0 + 0.85);
      poly([gp, [gp[0] + (gx < 0 ? -S*0.42 : S*0.42), gp[1] - S*0.24], [gp[0] + (gx < 0 ? -S*0.24 : S*0.24), gp[1] + S*0.14]], '#52525b');
    });
    // Steep dark-slate Gothic pyramid spire & iron cross
    const ap = pyrCap(hw * 1.12, zCap0 + 0.85, zCap0 + 2.45, '#18181b', '#09090b');
    line(ap, [ap[0], ap[1] - S * 0.48], '#a1a1aa', S * 0.08);
  }
  else if (theme === 'nordic') {
    // NORDIC: Tiered Norwegian Stave-Church Roof with Golden Dragon-Head Prows
    const cw = mw * 1.45;
    isoBox(-cw, cw, -cw, cw, zCap0, zCap0 + 0.24, '#451a03', '#290f02', '#78350f');
    const ap1 = pyrCap(cw * 1.05, zCap0 + 0.24, zCap0 + 1.25, '#1e293b', '#0f172a');
    // Upper Stave Turret & Second Steep Shingled Pyramid Roof
    const hw = mw * 0.78;
    isoBox(-hw, hw, -hw, hw, zCap0 + 0.95, zCap0 + 1.55, '#5a361a', '#3e2410', '#d97706');
    const ap2 = pyrCap(hw * 1.12, zCap0 + 1.55, zCap0 + 2.55, '#1e293b', '#0f172a');
    // Crossed golden dragon-head gable prows
    line(ap2, [ap2[0] - S * 0.42, ap2[1] - S * 0.35], '#f59e0b', S * 0.11);
    line(ap2, [ap2[0] + S * 0.42, ap2[1] - S * 0.35], '#f59e0b', S * 0.11);
  }
  else if (theme === 'tiki') {
    // TIKI: Round Carved Tiki Altar Top with Fire Crown
    const rAlt = mw * 1.32;
    cylZ(rAlt * 1.12, zCap0, zCap0 + 0.24, '#451a03', '#78350f');
    cylZ(rAlt, zCap0 + 0.24, zCap0 + 1.42, '#6d4224', '#d9a74a');
    // Glowing yellow Tiki eyes & fanged grimace on the round altar drum
    const pFace = P(0.65, 0.65, zCap0 + 0.85);
    disc([pFace[0] - S * 0.24, pFace[1] - S * 0.08], S * 0.13, '#facc15');
    disc([pFace[0] + S * 0.24, pFace[1] - S * 0.08], S * 0.13, '#facc15');
    line([pFace[0] - S * 0.32, pFace[1] + S * 0.22], [pFace[0] + S * 0.32, pFace[1] + S * 0.22], '#f97316', S * 0.14);
    // Flame bowl at top
    const pTop = P(0, 0, zCap0 + 1.45);
    poly([[pTop[0]-S*0.45, pTop[1]], [pTop[0], pTop[1]-S*0.95], [pTop[0]+S*0.45, pTop[1]]], '#f97316');
    poly([[pTop[0]-S*0.22, pTop[1]], [pTop[0], pTop[1]-S*0.62], [pTop[0]+S*0.22, pTop[1]]], '#fde047');
  }
  else if (theme === 'alps') {
    // ALPS: Snow-Blanketed Pitched Roof with Swiss Flag
    const cw = mw * 1.45;
    isoBox(-cw, cw, -cw, cw, zCap0, zCap0 + 0.24, '#78350f', '#451a03', '#b45309');
    const hw = mw * 1.15;
    isoBox(-hw, hw, -hw, hw, zCap0 + 0.24, zCap0 + 0.95, '#9a6a3c', '#78350f', '#f8fafc');
    // Snow-blanketed pitched pyramid roof
    const ap = pyrCap(hw * 1.18, zCap0 + 0.95, zCap0 + 1.95, '#ffffff', '#dbeafe');
    // Swiss Red-and-White Flag at summit
    const pFlagT = [ap[0], ap[1] - S * 0.72];
    line(ap, pFlagT, '#facc15', S * 0.09);
    poly([pFlagT, [pFlagT[0] + S * 0.75, pFlagT[1] + S * 0.16], [pFlagT[0], pFlagT[1] + S * 0.38]], '#dc2626');
  }
  else if (theme === 'bavarian') {
    // BAVARIAN: Half-Timbered Clock Tower Top with Onion Dome Finial
    const cw = mw * 1.38;
    isoBox(-cw, cw, -cw, cw, zCap0, zCap0 + 0.22, '#2563eb', '#1d4ed8', '#f5c542');
    const hw = mw * 1.12;
    isoBox(-hw, hw, -hw, hw, zCap0 + 0.22, zCap0 + 1.38, '#fffbeb', '#dfd3b8', '#b91c1c');
    // Golden Clock Faces on both visible sides
    disc(P(0, hw + 0.02, zCap0 + 0.82), S * 0.34, '#ffffff');
    disc(P(0, hw + 0.02, zCap0 + 0.82), S * 0.26, '#1e3a8a');
    disc(P(hw + 0.02, 0, zCap0 + 0.82), S * 0.34, '#ffffff');
    disc(P(hw + 0.02, 0, zCap0 + 0.82), S * 0.26, '#1e3a8a');
    const ap = pyrCap(hw * 1.10, zCap0 + 1.38, zCap0 + 2.15, '#b91c1c', '#7f1d1d');
    disc([ap[0], ap[1] - S * 0.18], S * 0.26, '#0d9488');
    line([ap[0], ap[1] - S * 0.42], [ap[0], ap[1] - S * 0.72], '#f5c542', S * 0.08);
  }
  else if (theme === 'medieval') {
    // MEDIEVAL: Round Fantasy Castle Pitched Turret Roof Top
    const rTur = mw * 1.32;
    cylZ(rTur * 1.14, zCap0, zCap0 + 0.24, '#64748b', '#94a3b8');
    cylZ(rTur, zCap0 + 0.24, zCap0 + 1.15, '#cbd5e1', '#f5c542');
    // Conical Royal-Blue Fantasy Castle Turret Roof + Pennant
    const pTop = coneZ(rTur * 1.12, zCap0 + 1.15, zCap0 + 2.45, '#1d4ed8');
    const pFlagT = [pTop[0], pTop[1] - S * 0.65];
    line(pTop, pFlagT, '#f5c542', S * 0.09);
    poly([pFlagT, [pFlagT[0] + S * 0.75, pFlagT[1] + S * 0.16], [pFlagT[0], pFlagT[1] + S * 0.36]], '#b91c1c');
  }
  else if (theme === 'americana') {
    // AMERICANA: Federal Brass-Domed Eagle Cupola Top
    const cw = mw * 1.40;
    isoBox(-cw, cw, -cw, cw, zCap0, zCap0 + 0.22, '#fbf6e8', '#dfd3b8', '#b91c1c');
    const hw = mw * 1.08;
    isoBox(-hw, hw, -hw, hw, zCap0 + 0.22, zCap0 + 1.12, '#b91c1c', '#7f1d1d', '#fbf6e8');
    const pTop = coneZ(hw * 1.08, zCap0 + 1.12, zCap0 + 2.05, '#1d3557');
    disc([pTop[0], pTop[1] - S * 0.15], S * 0.22, '#fbbf24');
  }
  else if (theme === 'classic') {
    // CLASSIC MIDWAY: Striped Carnival Big-Top Canopy Crown & Bulb Finial
    const cw = mw * 1.42;
    isoBox(-cw, cw, -cw, cw, zCap0, zCap0 + 0.24, '#e11d48', '#be123c', '#facc15');
    const pTop = coneZ(mw * 1.38, zCap0 + 0.24, zCap0 + 1.95, '#e11d48');
    // Cream vertical carnival stripe on front of cone
    poly([P(-mw * 0.45, mw * 1.1, zCap0 + 0.24), P(mw * 0.45, mw * 1.1, zCap0 + 0.24), pTop], '#fffbeb');
    disc([pTop[0], pTop[1] - S * 0.16], S * 0.22, '#facc15');
  }
  else if (theme === 'caribbean') {
    // CARIBBEAN: Coquina Stone Belltower with Pirate Jolly Roger Flag
    const cw = mw * 1.38;
    isoBox(-cw, cw, -cw, cw, zCap0, zCap0 + 0.22, '#a89c84', '#7a705e', '#e2d8c3');
    const hw = mw * 1.12;
    isoBox(-hw, hw, -hw, hw, zCap0 + 0.22, zCap0 + 1.32, '#e2d8c3', '#cfc4ac', '#c2410c');
    // Bell arch & brass ship bell
    poly([P(-hw*0.45, hw+0.01, zCap0+0.35), P(hw*0.45, hw+0.01, zCap0+0.35), P(hw*0.45, hw+0.01, zCap0+0.95), P(0, hw+0.01, zCap0+1.16), P(-hw*0.45, hw+0.01, zCap0+0.95)], '#1c1917');
    disc(P(0, hw + 0.02, zCap0 + 0.65), S * 0.20, '#f59e0b');
    const ap = pyrCap(hw * 1.12, zCap0 + 1.32, zCap0 + 2.15, '#c2410c', '#9a3412');
    // Pirate Jolly Roger Flag at summit
    const pFlagT = [ap[0], ap[1] - S * 0.72];
    line(ap, pFlagT, '#f59e0b', S * 0.09);
    poly([pFlagT, [pFlagT[0] + S * 0.82, pFlagT[1] + S * 0.16], [pFlagT[0], pFlagT[1] + S * 0.42]], '#0f172a');
    disc([pFlagT[0] + S * 0.30, pFlagT[1] + S * 0.22], S * 0.10, '#ffffff');
  }

  ctx.restore();
}
window.drawDropTower = drawDropTower;
})();
