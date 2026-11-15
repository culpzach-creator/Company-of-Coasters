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

/* ===== ZAMPERLA GIANT DISCOVERY 16-SKIN METADATA ===== */
const DISCOVERY_SKINS = {
  standard:     {id:'standard',     label:'Unthemed (Tier 0–2)', name:'Zamperla Giant Discovery',     sub:'Tubular Steel A-Frame, Counterweight & 30-Seat Ring',  hex:'#cbd5e1', border:'#38bdf8', leg1:'#475569', leg2:'#94a3b8', ring:'#ef4444', trim:'#facc15'},
  classic:      {id:'classic',      label:'Classic Midway',      name:'Star-Spangled Lasso Pendulum', sub:'Striped Big-Top A-Frames, Starburst Hub & Gold Ring',  hex:'#cbb07c', border:'#e11d48', leg1:'#e11d48', leg2:'#fffbeb', ring:'#2563eb', trim:'#facc15'},
  western:      {id:'western',      label:'Wild West',           name:'Canyon Mine-Derrick Pendulum', sub:'Red-Rock Buttes, Heavy Timber Trestle & Ore-Cart Ring',hex:'#c99a62', border:'#b91c1c', leg1:'#5a3b22', leg2:'#9a6a3c', ring:'#b91c1c', trim:'#f59e0b'},
  frontier:     {id:'frontier',     label:'Frontier',            name:'Paul Bunyan Crosscut Pendulum',sub:'River-Stone Piers, Cedar Log A-Frame & Sawblade Ring', hex:'#7d955d', border:'#566e42', leg1:'#4a3320', leg2:'#8a5a33', ring:'#2f5f3a', trim:'#eab308'},
  space:        {id:'space',        label:'Space',               name:'Orbital Singularity Pendulum', sub:'Curved Titanium Pylons, Plasma Core & Cryo-Ring',      hex:'#334155', border:'#0ea5e9', leg1:'#0f172a', leg2:'#e2e8f0', ring:'#0284c7', trim:'#22d3ee'},
  retro_future: {id:'retro_future', label:'Retro-Future',        name:'Tomorrowland Atom Pendulum',   sub:'Googie Boomerang Pylons, Sputnik & Flying Saucer Ring',hex:'#bcc8d5', border:'#f97316', leg1:'#f8fafc', leg2:'#06b6d4', ring:'#f97316', trim:'#facc15'},
  jungle:       {id:'jungle',       label:'Jungle',              name:'Temple of Kukulkan Pendulum',  sub:'Stepped Mayan Stone Pylons, Serpent Arch & Jade Ring', hex:'#587c48', border:'#2fbf9a', leg1:'#6e6a56', leg2:'#bdb9a0', ring:'#137a70', trim:'#eab308'},
  tiki:         {id:'tiki',         label:'Tiki',                name:'Volcano Idol Tiki Pendulum',   sub:'Carved Tiki Totem Legs, Fire Cauldron & Bamboo Ring',  hex:'#5c9444', border:'#d97706', leg1:'#451a03', leg2:'#78350f', ring:'#d97706', trim:'#f97316'},
  caribbean:    {id:'caribbean',    label:'Caribbean',           name:'Kraken’s Maelstrom Pendulum',  sub:'Coquina Fort Bastion Pylons, Cannon Crown & Helm Ring',hex:'#6aa04a', border:'#d97706', leg1:'#7a705e', leg2:'#e2d8c3', ring:'#991b1b', trim:'#f59e0b'},
  medieval:     {id:'medieval',     label:'Medieval',            name:'Royal Siege Trebuchet Swing',  sub:'Crenellated Keep Towers, Lion Shields & Crown Ring',   hex:'#6c8c58', border:'#eab308', leg1:'#475569', leg2:'#cbd5e1', ring:'#1d4ed8', trim:'#f5c542'},
  gothic:       {id:'gothic',       label:'Gothic',              name:'The Pit & The Pendulum',       sub:'Obsidian Cathedral Buttresses, Rose Hub & Scythe Ring',hex:'#3b3345', border:'#7e22ce', leg1:'#09090b', leg2:'#3f3f46', ring:'#7f1d1d', trim:'#c084fc'},
  bavarian:     {id:'bavarian',     label:'Bavarian',            name:'Oktoberfest Maibaum Pendulum', sub:'Fachwerk A-Frame Pylons, Onion-Dome & Lozenge Ring',   hex:'#769958', border:'#2563eb', leg1:'#451a03', leg2:'#f8fafc', ring:'#2563eb', trim:'#f5c542'},
  alps:         {id:'alps',         label:'Alps',                name:'Avalanche Funicular Pendulum', sub:'Snow-Capped Chalet Pylons, Bullwheel & Glacier Ring',  hex:'#a8c5d6', border:'#0284c7', leg1:'#475569', leg2:'#f8fafc', ring:'#dc2626', trim:'#38bdf8'},
  fiesta:       {id:'fiesta',       label:'Fiesta',              name:'El Sol de Fuego Pendulum',     sub:'Talavera Mission Pylons, Sunburst Crown & Fiesta Ring',hex:'#d99b52', border:'#e11d48', leg1:'#c2410c', leg2:'#fef3c7', ring:'#e11d48', trim:'#facc15'},
  nordic:       {id:'nordic',       label:'Nordic',              name:'Mjölnir’s Thunder Pendulum',   sub:'Stave-Wood Dragon Pylons, Runestone & Shield Ring',    hex:'#4d6b63', border:'#d97706', leg1:'#290f02', leg2:'#5a361a', ring:'#0284c7', trim:'#f59e0b'},
  americana:    {id:'americana',    label:'Americana',           name:'Liberty Bell Fair Pendulum',   sub:'Victorian Brick & Lattice Pylons, Eagle & Star Ring',  hex:'#a8644c', border:'#b91c1c', leg1:'#7f1d1d', leg2:'#fbf6e8', ring:'#1d3557', trim:'#fbbf24'}
};
DISCOVERY_SKINS.unthemed = DISCOVERY_SKINS.standard;
DISCOVERY_SKINS.german   = DISCOVERY_SKINS.bavarian;
DISCOVERY_SKINS.wildwest = DISCOVERY_SKINS.western;
DISCOVERY_SKINS.retro    = DISCOVERY_SKINS.retro_future;

/* ===== SPRITE CODE: copy this block into engine.js ===== */
/**
 * drawDiscovery(ctx, cx, cy, R, opts)
 *  Zamperla Giant Discovery (Colossal 4-Leg A-Frame Mega-Pendulum Frisbee):
 *   - Tall, wide-stanced 4-leg A-frame support structure (`Zp = 8.4`, `ax = 3.15`, `leg = 3.25`)
 *     built with heavy architectural theming on the support towers, base piers, cross-beams,
 *     and apex motor crowns (inspired by *The Claw* / *Wonder Woman Lasso of Truth* / *Pandora's Box*).
 *   - Dynamic 120° high-swing pendulum boom with an upper counterweight drum (`Lcw = 1.95`)
 *     and a counter-rotating 30-seat outward-facing passenger ring (`Rg = 2.38`, `L = 5.65`).
 *   - Strict back-to-front painter's order:
 *       1. Ground loading deck & dynamic pendulum ground shadow
 *       2. Back A-frame support tower (`-ax`) + back-half of spinning gondola ring & riders
 *       3. Main pendulum boom arm, counterweight & central hub of the gondola disc
 *       4. Front-half of spinning gondola ring & riders (occluding the pendulum shaft)
 *       5. Front A-frame support tower (`+ax`) & bespoke themed apex crown
 *
 *  opts.themeId / theme : any of the 16 theme keys above
 *  opts.rideThemeTier   : 0..4 (<=2 renders Standard Unthemed; >=3 renders Heavy/Immersive themed ride)
 *  opts.accent          : Land color (used for standard accents & hex border)
 *  opts.t               : elapsed time in seconds (auto-swings pendulum + spins gondola ring)
 *  opts.angle           : optional explicit pendulum swing angle in radians (-1.95 .. +1.95)
 *  opts.flip            : true when mirrored horizontally
 *  opts.tile            : draw hex tile underneath (default true)
 */
function drawDiscovery(ctx, cx, cy, R, o = {}) {
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTh = String(o.themeId || o.theme || 'standard').toLowerCase().replace(/-/g, '_');
  if (rawTh === 'unthemed') rawTh = 'standard';
  if (rawTh === 'german') rawTh = 'bavarian';
  if (rawTh === 'wildwest' || rawTh === 'wild_west') rawTh = 'western';
  if (rawTh === 'retro') rawTh = 'retro_future';
  const theme = (tier <= 2 || !DISCOVERY_SKINS[rawTh]) ? 'standard' : rawTh;
  const meta = DISCOVERY_SKINS[theme] || DISCOVERY_SKINS.standard;

  const accent = o.accent || meta.border || '#38bdf8';
  const fl = o.flip ? -1 : 1;
  const clockT = (o.t != null) ? o.t : (typeof performance !== 'undefined' ? performance.now() / 1000 : 1.1);
  // Giant Discovery swings up to ~115 degrees (2.0 rad) in each direction!
  const ph = (o.angle != null) ? o.angle : (1.82 * Math.sin(clockT * 1.15));
  const spin = clockT * 2.1;
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
  // `X` = axle axis between Back A-frame (-ax) and Front A-frame (+ax)
  // `Y` = swing plane axis (-leg .. +leg)
  // `Z` = vertical height (0 .. Zp)
  const cyB = cy + R * 0.14;
  const S = R * 0.072;
  const P = (X, Y, Z = 0) => [cx + (X - Y) * 0.7 * S, cyB + (X + Y) * 0.35 * S - Z * S];
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

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

  // Colossal Giant Discovery Structural Proportions
  const ax   = 3.15;   // Half-span between Back (-ax) and Front (+ax) A-frame towers
  const leg  = 3.25;   // Half-spread of A-frame legs along the Y swing axis
  const Zp   = 8.35;   // Towering apex pivot height
  const L    = 5.65;   // Pendulum arm length from pivot down to gondola center
  const Lcw  = 1.95;   // Counterweight arm length above pivot
  const Rg   = 2.38;   // Giant 30-seat spinning ring radius

  const sp = Math.sin(ph), cp = Math.cos(ph);
  // Gondola 3D center `Hc` and Counterweight 3D center `Hcw`
  const Hc  = [0,  L * sp,   Zp - L * cp];
  const Hcw = [0, -Lcw * sp, Zp + Lcw * cp];
  const trimCol = theme === 'standard' ? accent : meta.trim;
  const ringCol = theme === 'standard' ? accent : meta.ring;

  // 2. Compact Boarding Platform & Dynamic Projected Gondola Shadow (NO giant slab!)
  const p0 = P(0, 0, 0);
  ell([p0[0] + fl * S * 0.25, p0[1] + S * 0.12], S * 3.2, S * 1.55, 'rgba(15, 23, 42, 0.20)');
  // Loading platform floor beneath the gondola's lowest point
  ell(p0, Rg * 1.05 * S, Rg * 0.52 * S, 'rgba(30, 41, 59, 0.42)', trimCol, S * 0.08);

  // Dynamic shadow of the swinging ring on the ground
  const shY = Math.max(-3.6, Math.min(3.6, Hc[1]));
  const shScale = Math.max(0.55, 1.0 - Hc[2] / 12.0);
  ell(P(0, shY, 0), Rg * S * shScale, Rg * 0.48 * S * shScale, 'rgba(10, 15, 25, 0.34)');

  // =========================================================================
  // 3. BESPOKE THEMED 4-LEG A-FRAME SUPPORT PYLONS (`drawThemedAFrame(X0, isFront)`)
  //    Heavy architectural theming on the support legs, base piers, cross-bracing & crown!
  // =========================================================================
  const drawThemedAFrame = (X0, isFront) => {
    const fBack  = P(X0, -leg, 0.05);
    const fFront = P(X0,  leg, 0.05);
    const top    = P(X0 * 0.86, 0, Zp);
    const c1     = theme === 'standard' ? meta.leg1 : meta.leg1;
    const c2     = theme === 'standard' ? meta.leg2 : meta.leg2;

    // 1. Theme-Specific Footpad Piers & Base Anchor Architecture
    [[-leg, -1], [leg, 1]].forEach(([ly, dir]) => {
      const pf = P(X0, ly, 0);
      ell([pf[0] + fl * S * 0.12, pf[1] + S * 0.08], S * 0.72, S * 0.34, 'rgba(10,15,25,0.34)');

      if (theme === 'western') {
        // Layered Monument-Valley Red-Rock Sandstone Buttes anchoring each leg!
        isoBox(X0 - 0.55, X0 + 0.55, ly - 0.55, ly + 0.55, 0, 0.65, '#b84a2c', '#8f361b', '#e07a4c', '#451a03', S * 0.05);
        isoBox(X0 - 0.38, X0 + 0.38, ly - 0.38, ly + 0.38, 0.65, 1.25, '#cf5c36', '#9a3412', '#e07a4c', '#451a03', S * 0.05);
      } else if (theme === 'jungle' || theme === 'fiesta') {
        // Stepped Mayan / Aztec Limestone Pyramid Plinths
        isoBox(X0 - 0.52, X0 + 0.52, ly - 0.52, ly + 0.52, 0, 0.45, '#8e8a72', '#595443', '#bdb9a0', '#292524', S * 0.05);
        isoBox(X0 - 0.36, X0 + 0.36, ly - 0.36, ly + 0.36, 0.45, 0.88, theme === 'jungle' ? '#137a70' : '#e11d48', '#0f524b', '#eab308');
      } else if (theme === 'medieval' || theme === 'gothic' || theme === 'caribbean') {
        // Ashlar / Coquina Stone Bastion Pedestal
        isoBox(X0 - 0.48, X0 + 0.48, ly - 0.48, ly + 0.48, 0, 0.75, c2, c1, trimCol, '#0f172a', S * 0.05);
      } else if (theme === 'frontier' || theme === 'alps' || theme === 'nordic') {
        // Craggy River-Stone / Snow-Capped Granite Pier
        isoBox(X0 - 0.48, X0 + 0.48, ly - 0.48, ly + 0.48, 0, 0.55, '#64748b', '#475569', theme === 'alps' ? '#ffffff' : '#94a3b8', '#1e293b', S * 0.05);
      } else {
        // Heavy Steel Anchor Pier
        isoBox(X0 - 0.42, X0 + 0.42, ly - 0.42, ly + 0.42, 0, 0.36, '#334155', '#1e293b', trimCol, '#0f172a', S * 0.05);
      }
    });

    // 2. Theme-Specific A-Frame Pylon Legs & Cross-Bracing
    if (theme === 'space' || theme === 'retro_future') {
      // Swept Curved Parabolic Titanium / Googie Boomerang A-Frame Arches!
      const isRetro = theme === 'retro_future';
      const bow = isFront ? S * 0.65 : -S * 0.45;
      [fBack, fFront].forEach((f, idx) => {
        const ctrl = [(f[0] + top[0]) * 0.5 + (idx === 0 ? -S*0.45 : S*0.55), (f[1] + top[1]) * 0.5 - S*0.35];
        ctx.strokeStyle = '#0f172a'; ctx.lineWidth = S * 0.68;
        ctx.beginPath(); ctx.moveTo(f[0], f[1]); ctx.quadraticCurveTo(ctrl[0], ctrl[1], top[0], top[1]); ctx.stroke();
        ctx.strokeStyle = c2; ctx.lineWidth = S * 0.48;
        ctx.beginPath(); ctx.moveTo(f[0], f[1]); ctx.quadraticCurveTo(ctrl[0], ctrl[1], top[0], top[1]); ctx.stroke();
        ctx.strokeStyle = trimCol; ctx.lineWidth = S * 0.16;
        ctx.beginPath(); ctx.moveTo(f[0], f[1]); ctx.quadraticCurveTo(ctrl[0], ctrl[1], top[0], top[1]); ctx.stroke();
      });
      // Floating glowing plasma/neon crossbar ring
      const m0 = lerp(fBack, top, 0.36), m1 = lerp(fFront, top, 0.36);
      line(m0, m1, '#0f172a', S * 0.32);
      line(m0, m1, trimCol, S * 0.16);
    }
    else if (theme === 'classic') {
      // Red-and-Cream Striped Carnival A-Frame Pylons with Chasing Marquee Bulbs & Scalloped Crossbar!
      const m0 = lerp(fBack, top, 0.32), m1 = lerp(fFront, top, 0.32);
      line(m0, m1, '#991b1b', S * 0.36);
      line(m0, m1, '#facc15', S * 0.16);
      [fBack, fFront].forEach(f => {
        line(f, top, '#7f1d1d', S * 0.64);
        const nSeg = 8;
        for (let s = 0; s < nSeg; s++) {
          const a = lerp(f, top, s / nSeg), b = lerp(f, top, (s + 0.9) / nSeg);
          line(a, b, s % 2 === 0 ? '#e11d48' : '#fffbeb', S * 0.48);
        }
        if (isFront) {
          for (let d = 1; d < 8; d++) {
            const lp = lerp(f, top, d / 8);
            disc(lp, S * 0.11, (d + Math.floor(clockT * 6)) % 2 ? '#fef08a' : '#f97316');
          }
        }
      });
    }
    else if (theme === 'bavarian') {
      // White Stucco & Oak Fachwerk Half-Timbered A-Frame with Blue/White Lozenge Cross-Beam!
      const m0 = lerp(fBack, top, 0.32), m1 = lerp(fFront, top, 0.32);
      line(m0, m1, '#2563eb', S * 0.38);
      line(m0, m1, '#ffffff', S * 0.16);
      [fBack, fFront].forEach(f => {
        line(f, top, '#451a03', S * 0.64);
        line(f, top, '#f8fafc', S * 0.44);
        // Diagonal timber cross-braces along the legs
        for (let s = 0.15; s < 0.85; s += 0.22) {
          const pA = lerp(f, top, s), pB = lerp(f, top, s + 0.12);
          line([pA[0] - S*0.18, pA[1]], [pB[0] + S*0.18, pB[1]], '#5a3b22', S * 0.12);
        }
      });
    }
    else if (theme === 'western' || theme === 'frontier') {
      // Heavy Timber Mine-Derrick / Cedar Log A-Frame with Diagonal X-Bracing & Iron Gussets!
      const m0 = lerp(fBack, top, 0.28), m1 = lerp(fFront, top, 0.28);
      const u0 = lerp(fBack, top, 0.56), u1 = lerp(fFront, top, 0.56);
      line(m0, m1, c1, S * 0.32);
      line(u0, u1, c1, S * 0.24);
      line(m0, u1, c2, S * 0.16);
      line(m1, u0, c2, S * 0.16);
      [fBack, fFront].forEach(f => {
        line(f, top, '#291509', S * 0.64);
        line(f, top, c2, S * 0.46);
        // Black iron gusset collars
        [0.28, 0.56, 0.82].forEach(t => {
          disc(lerp(f, top, t), S * 0.28, '#27272a', trimCol, S * 0.05);
        });
      });
    }
    else if (theme === 'gothic') {
      // Pointed-Arch Obsidian Cathedral Flying-Buttress A-Frame with Crimson Rose Tracery!
      const m0 = lerp(fBack, top, 0.34), m1 = lerp(fFront, top, 0.34);
      const archApex = [(m0[0] + m1[0]) * 0.5, (m0[1] + m1[1]) * 0.5 - S * 0.85];
      line(m0, archApex, '#09090b', S * 0.32);
      line(m1, archApex, '#09090b', S * 0.32);
      line(m0, archApex, '#991b1b', S * 0.14);
      line(m1, archApex, '#991b1b', S * 0.14);
      [fBack, fFront].forEach(f => {
        line(f, top, '#09090b', S * 0.64);
        line(f, top, '#3f3f46', S * 0.42);
        line(f, top, '#7e22ce', S * 0.12);
      });
    }
    else {
      // Standard, Jungle, Tiki, Caribbean, Medieval, Alps, Fiesta, Nordic, Americana:
      // Heavy Tapered Steel / Stone / Timber A-Frame with Double Cross-Ties & Theme Banding!
      const m0 = lerp(fBack, top, 0.30), m1 = lerp(fFront, top, 0.30);
      const u0 = lerp(fBack, top, 0.60), u1 = lerp(fFront, top, 0.60);
      line(m0, m1, '#1e293b', S * 0.32);
      line(m0, m1, trimCol, S * 0.16);
      line(u0, u1, c1, S * 0.22);
      [fBack, fFront].forEach((f, idx) => {
        line(f, top, '#1e293b', S * 0.62);
        line(f, top, c1, S * 0.46);
        line([f[0] - S*0.12, f[1]], [top[0] - S*0.12, top[1]], c2, S * 0.16);
        // Upper theme accent sleeve near apex
        line(lerp(f, top, 0.72), lerp(f, top, 0.92), trimCol, S * 0.50);
        // Theme emblem mounted mid-leg on front pylon
        if (isFront && (theme === 'medieval' || theme === 'nordic')) {
          const sp = lerp(f, top, 0.46);
          disc(sp, S * 0.34, idx === 0 ? '#b91c1c' : '#1d4ed8', '#f5c542', S * 0.06);
        }
      });
    }

    // 3. Apex Bearing Drum & Bespoke Themed Motor Crown on `top`
    disc(top, S * 0.64, '#1e293b', trimCol, S * 0.10);
    disc(top, S * 0.36, trimCol);

    if (isFront) {
      const cr = [top[0], top[1] - S * 0.85];
      if (theme === 'classic') {
        // 12-Point Illuminated Midway Starburst Crown
        const pts = [];
        for (let k = 0; k < 24; k++) {
          const a = clockT * 1.5 + (k / 24) * TAU;
          const rad = k % 2 === 0 ? S * 0.85 : S * 0.42;
          pts.push([cr[0] + Math.cos(a) * rad, cr[1] + Math.sin(a) * rad]);
        }
        poly(pts, '#facc15', '#e11d48', S * 0.08);
        disc(cr, S * 0.34, '#e11d48', '#fffbeb', S * 0.06);
      }
      else if (theme === 'jungle' || theme === 'fiesta') {
        // Golden Mayan / Aztec Sun-Calendar Medallion Crown
        disc(cr, S * 0.75, '#eab308', '#78350f', S * 0.10);
        disc(cr, S * 0.48, theme === 'jungle' ? '#137a70' : '#e11d48', '#fde047', S * 0.06);
      }
      else if (theme === 'tiki') {
        // Blazing Tiki Fire Bowl at Apex
        ell([cr[0], cr[1] + S * 0.25], S * 0.68, S * 0.30, '#451a03', '#f59e0b', S * 0.08);
        poly([[cr[0]-S*0.42, cr[1]+S*0.2], [cr[0], cr[1]-S*0.75], [cr[0]+S*0.42, cr[1]+S*0.2]], '#f97316');
        poly([[cr[0]-S*0.22, cr[1]+S*0.2], [cr[0], cr[1]-S*0.45], [cr[0]+S*0.22, cr[1]+S*0.2]], '#fde047');
      }
      else if (theme === 'medieval' || theme === 'nordic' || theme === 'caribbean') {
        // Royal Crown / Pirate Jolly Roger Pennant Mast
        line(top, [cr[0], cr[1] - S * 0.65], '#facc15', S * 0.12);
        poly([
          [cr[0], cr[1] - S * 0.65],
          [cr[0] + S * 1.15, cr[1] - S * 0.38],
          [cr[0] + S * 0.85, cr[1] - S * 0.15],
          [cr[0] + S * 1.15, cr[1] + S * 0.08],
          [cr[0], cr[1] + S * 0.05]
        ], theme === 'caribbean' ? '#0f172a' : '#b91c1c', '#facc15', S * 0.05);
      }
      else if (theme === 'space' || theme === 'retro_future') {
        // Orbiting Gyroscopic Atom / Plasma Orb Crown
        ell(cr, S * 0.95, S * 0.34, null, trimCol, S * 0.09, 0.3);
        ell(cr, S * 0.95, S * 0.34, null, trimCol, S * 0.09, -0.3);
        disc(cr, S * 0.36, '#0f172a', '#ffffff', S * 0.07);
      }
      else if (theme === 'bavarian') {
        // Verdigris Copper Onion Dome Crown
        disc(cr, S * 0.56, '#0d9488', '#f5c542', S * 0.08);
        line(cr, [cr[0], cr[1] - S * 0.85], '#f5c542', S * 0.10);
      }
      else if (theme === 'western' || theme === 'frontier') {
        // Spinning Galvanized Windmill / Lumberjack Sawblade Crown
        disc(cr, S * 0.68, '#cbd5e1', '#451a03', S * 0.08);
        for (let b = 0; b < 8; b++) {
          const ba = clockT * 3 + b * TAU / 8;
          line(cr, [cr[0] + Math.cos(ba)*S*0.65, cr[1] + Math.sin(ba)*S*0.65], '#451a03', S * 0.07);
        }
        disc(cr, S * 0.24, '#b91c1c');
      }
    }
  };

  // =========================================================================
  // PASS 1: BACK A-FRAME SUPPORT PYLON (-ax) & OVERHEAD AXLE BEAM
  // =========================================================================
  drawThemedAFrame(-ax, false);
  const pAxBack  = P(-ax * 0.86, 0, Zp);
  const pAxFront = P( ax * 0.86, 0, Zp);
  line(pAxBack, pAxFront, '#0f172a', S * 0.62);
  line(pAxBack, pAxFront, meta.leg2, S * 0.38);

  // =========================================================================
  // PASS 2: 30-SEAT SPINNING GONDOLA RING & PENDULUM BOOM (3D Depth-Sorted!)
  // =========================================================================
  // Helper to project a point on the tilting gondola ring at angle `a` and radius `rad`
  const ringPt = (a, rad = Rg, zOff = 0) => {
    const lx = rad * Math.cos(a);
    const ly = rad * Math.sin(a);
    // Tilt the gondola plane by `ph` around the X-axis:
    const wy = Hc[1] + ly * cp + zOff * sp;
    const wz = Hc[2] + ly * sp - zOff * cp;
    return P(lx, wy, wz);
  };

  // Build 15 outward-facing twin-seat clusters (30 riders total) around the Giant Discovery ring
  const N_SEATS = 15;
  const seats = [];
  const shirtCols = ['#ef4444', '#3b82f6', '#22c55e', '#facc15', '#a855f7', '#f97316'];
  for (let k = 0; k < N_SEATS; k++) {
    const a = spin + k * TAU / N_SEATS;
    const wy = Hc[1] + Rg * Math.sin(a) * cp;
    const wz = Hc[2] + Rg * Math.sin(a) * sp;
    const lx = Rg * Math.cos(a);
    seats.push({
      k, a, lx, wy, wz,
      depth: lx * 0.35 + wy + wz * 0.25,
      col: shirtCols[k % 6]
    });
  }
  seats.sort((u, v) => u.depth - v.depth);

  const drawSeatCluster = (st) => {
    const pSeat = P(st.lx, st.wy, st.wz);
    const pHead = ringPt(st.a, Rg * 1.05, 0.42);
    const pFoot = ringPt(st.a, Rg * 1.18, -0.38);

    // Molded bucket seat backing
    line(pSeat, pHead, '#1e293b', S * 0.36);
    line(pSeat, pHead, ringCol, S * 0.24);
    // Outward-dangling legs!
    line(pSeat, pFoot, '#0f172a', S * 0.14);
    // Rider torso & Over-The-Shoulder Harness (OTSR)
    disc(lerp(pSeat, pHead, 0.45), S * 0.17, st.col);
    line(lerp(pSeat, pHead, 0.25), lerp(pSeat, pHead, 0.72), trimCol, S * 0.09);
    // Rider head
    disc(pHead, S * 0.15, (theme === 'space' || theme === 'retro_future') ? '#ffffff' : '#fde4c8', '#0f172a', S * 0.03);
  };

  // 2A. Back-half of the 30-seat gondola ring & riders (behind the pendulum shaft)
  seats.filter(s => s.depth < Hc[1] + Hc[2] * 0.25).forEach(drawSeatCluster);

  // 2B. Upper Counterweight Boom & Heavy Counterweight Drum (`Hcw`) + Main Pendulum Boom (`P(0,0,Zp) -> P(...Hc)`)
  const pPiv = P(0, 0, Zp);
  const pGon = P(Hc[0], Hc[1], Hc[2]);
  const pCW  = P(Hcw[0], Hcw[1], Hcw[2]);

  // Counterweight arm & heavy theme-trimmed counterweight drum
  line(pPiv, pCW, '#1e293b', S * 0.56);
  line(pPiv, pCW, meta.leg2, S * 0.36);
  disc(pCW, S * 0.72, '#1e293b', trimCol, S * 0.10);
  disc(pCW, S * 0.42, ringCol);

  // Main giant tapered pendulum boom shaft
  line(pPiv, pGon, '#0f172a', S * 0.62);
  line(pPiv, pGon, meta.leg2, S * 0.42);
  line(lerp(pPiv, pGon, 0.15), lerp(pPiv, pGon, 0.75), trimCol, S * 0.18);

  // 2C. Giant Circular Gondola Ring Chassis, Radial Spokes & Illuminated Rim Lights
  // Draw structural ring tube
  ctx.strokeStyle = '#0f172a'; ctx.lineWidth = S * 0.44;
  ctx.beginPath();
  for (let i = 0; i <= 48; i++) {
    const p = ringPt(i / 48 * TAU, Rg);
    i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]);
  }
  ctx.closePath(); ctx.stroke();

  ctx.strokeStyle = ringCol; ctx.lineWidth = S * 0.30;
  ctx.stroke();

  ctx.strokeStyle = trimCol; ctx.lineWidth = S * 0.10;
  ctx.stroke();

  // Radial spokes connecting center pendulum bell `pGon` to the outer gondola ring
  for (let k = 0; k < 8; k++) {
    const a = spin + k * TAU / 8;
    line(pGon, ringPt(a, Rg * 0.96), '#cbd5e1', S * 0.10);
  }
  // Center pendulum bell housing
  disc(pGon, S * 0.58, '#1e293b', trimCol, S * 0.09);
  disc(pGon, S * 0.30, trimCol);

  // Chasing lights around the gondola ring
  for (let i = 0; i < 16; i++) {
    const lp = ringPt(spin + i * TAU / 16, Rg);
    disc(lp, S * 0.08, (i + Math.floor(clockT * 8)) % 2 ? '#fef08a' : '#ffffff');
  }

  // 2D. Front-half of the 30-seat gondola ring & riders (drawn in front of the pendulum shaft!)
  seats.filter(s => s.depth >= Hc[1] + Hc[2] * 0.25).forEach(drawSeatCluster);

  // =========================================================================
  // PASS 3: FRONT A-FRAME SUPPORT PYLON (+ax) OVER THE SCENE
  // =========================================================================
  drawThemedAFrame(ax, true);

  ctx.restore();
}
window.drawDiscovery = drawDiscovery;
window.drawGiantDiscovery = drawDiscovery;
})();
