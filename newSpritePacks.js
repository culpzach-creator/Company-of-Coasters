// Sprite artwork imported from the standalone ride and facility packs.
const NEW_SPRITE_PACKS = { rides: {}, facilities: {} };

(function () {

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

/* ===== FLYER RIDE SKIN METADATA (UNTHEMED + 23 HEAVY/IMMERSIVE SKINS) ===== */
const FLYER_SKINS = {
  unthemed:         { id: 'unthemed',         label: 'Unthemed (Tier 0–2)', name: 'County-Fair Aero-Jets',            sub: 'Steel Control Drum & Twin-Fin Jet Pods',                   hex: '#cbd5e1', border: '#38bdf8' },

  /* === 12 BESPOKE EXPANSION LANDS === */
  retro_future:     { id: 'retro_future',     label: 'Retro-Future',        name: 'Astro-Orbiter Solar System',       sub: 'Googie Rocket Gantry, Orbiting Solar System & 1950s Rockets', hex: '#bcc8d5', border: '#f97316', isNew: true },
  tiki:             { id: 'tiki',             label: 'Tiki',                name: 'Tiki-Totem & Volcano Flyer',       sub: 'Carved Tiki Idol Column, Torches, Lava Caldera & Outriggers', hex: '#5c9444', border: '#d97706', isNew: true },
  americana:        { id: 'americana',        label: 'Americana',           name: '1903 Wright & Victorian Flyer',    sub: 'Victorian Exposition Gazebo, Brass Balloon & Wright Flyers', hex: '#a8644c', border: '#b91c1c', isNew: true },
  caribbean:        { id: 'caribbean',        label: 'Caribbean',           name: 'Port Royal Galleon Crow’s-Nest',   sub: 'Full-Rigged Mainmast, Yardarm Sail, Lanterns & Pirate Sloops', hex: '#6aa04a', border: '#d97706', isNew: true },
  china:            { id: 'china',            label: 'China',               name: 'Imperial Lantern Festival Flyer',  sub: 'Tiered Vermilion Pagoda, Silk Lanterns & Paper Dragons',    hex: '#6e8b5e', border: '#dc2626', isNew: true },
  japan:            { id: 'japan',            label: 'Japan',               name: 'Edo Shogunate Dojo & Torii Flyer', sub: 'Ishigaki Base, Irimoya Dojo, Torii Gates & Samurai Kago',   hex: '#5d7a64', border: '#e11d48', isNew: true },
  egypt:            { id: 'egypt',            label: 'Egypt',               name: 'Karnak Solar Falcon & Pharaoh',    sub: 'Lotus Temple Column, Seated Pharaoh Statue & Horus Hawks',  hex: '#d4b475', border: '#d97706', isNew: true },
  babylon:          { id: 'babylon',          label: 'Babylon',             name: 'Ishtar Gate & Winged Lion Flyer',  sub: 'Lapis Ziggurat, Striding Golden Lion & Lamassu Chariots',   hex: '#8b7e6a', border: '#2563eb', isNew: true },
  galactic_outpost: { id: 'galactic_outpost', label: 'Galactic Outpost',    name: 'Batuu Hangar & Hover Speeders',    sub: 'Armored Outpost Bunker, Radar Dish & Repulsor Landspeeders', hex: '#7c6f64', border: '#ea580c', isNew: true },
  jurassic_island:  { id: 'jurassic_island',  label: 'Jurassic Island',     name: 'Isla Nublar Helipad Control Tower',sub: 'Airfield Control Tower, Catwalk, Beacon & Tour Choppers',  hex: '#4d7c47', border: '#eab308', isNew: true },
  ancient_rome:     { id: 'ancient_rome',     label: 'Ancient Rome',        name: 'Roman Corinthian Chariot Flyer',   sub: 'Travertine Corinthian Column & Gladiator War Chariots',    hex: '#b89f7d', border: '#b91c1c', isNew: true },
  ancient_greece:   { id: 'ancient_greece',   label: 'Ancient Greece',      name: 'Athenian Corinthian Pegasus Flyer',sub: 'Pentelic Marble Corinthian Column & Winged Pegasus Cars',  hex: '#8da4b5', border: '#0284c7', isNew: true },

  /* === ORIGINAL 11 THEMED SKINS === */
  classic:          { id: 'classic',          label: 'Classic Midway',      name: 'Jumbo the Flying Elephant',        sub: 'Baroque Circus Drum & Flapping-Ear Elephants',             hex: '#cbb07c', border: '#e11d48' },
  jungle:           { id: 'jungle',           label: 'Jungle',              name: 'Totem Toucans & Macaws',           sub: 'Mayan Sun Pillar & Feathered Tropical Birds',          hex: '#587c48', border: '#2fbf9a' },
  western:          { id: 'western',          label: 'Wild West',           name: 'Dynamite Barnstormers',            sub: 'Water-Tower Hub & TNT Rocket-Biplanes',                hex: '#c99a62', border: '#b91c1c' },
  frontier:         { id: 'frontier',         label: 'Frontier',            name: 'Soaring Bald Eagles',              sub: 'Carved Cedar Totem & Winged Timber Eagles',            hex: '#7d955d', border: '#566e42' },
  space:            { id: 'space',            label: 'Space',               name: 'Astro-Orbiter Starfighters',       sub: 'Orbital Radar Tower & Delta-Wing Rocket Jets',         hex: '#334155', border: '#0ea5e9' },
  gothic:           { id: 'gothic',           label: 'Gothic',              name: 'Gargoyle & Vampire Flyers',        sub: 'Obsidian Belfry Spire & Winged Stone Gargoyles',       hex: '#3b3345', border: '#991b1b' },
  medieval:         { id: 'medieval',         label: 'Medieval',            name: 'Royal Dragon Riders',              sub: 'Wizard Keep Turret & Winged Fantasy Wyverns',          hex: '#6c8c58', border: '#eab308' },
  alps:             { id: 'alps',             label: 'Alps',                name: 'Alpine Rescue Ski-Planes',         sub: 'Chalet Cuckoo-Clock Tower & Red Ski-Biplanes',         hex: '#a8c5d6', border: '#0284c7' },
  fiesta:           { id: 'fiesta',           label: 'Fiesta',              name: 'Alebrije Spirit Flyers',           sub: 'Talavera Sun Kiosk & Painted Winged Jaguars',          hex: '#d99b52', border: '#e11d48' },
  nordic:           { id: 'nordic',           label: 'Nordic',              name: 'Asgardian Sky-Drakkars',           sub: 'Runic Stave Pillar & Flying Viking Longships',         hex: '#4d6b63', border: '#d97706' },
  bavarian:         { id: 'bavarian',         label: 'Bavarian',            name: 'Oktoberfest Zeppelin Flyers',      sub: 'Maibaum Brewery Cupola & Copper Dirigibles',           hex: '#769958', border: '#2563eb' }
};

/* Theme aliases for seamless engine lookup */
FLYER_SKINS.german       = FLYER_SKINS.bavarian;
FLYER_SKINS.wildwest     = FLYER_SKINS.western;
FLYER_SKINS.wild_west    = FLYER_SKINS.western;
FLYER_SKINS.retro        = FLYER_SKINS.retro_future;
FLYER_SKINS.galaxys_edge = FLYER_SKINS.galactic_outpost;
FLYER_SKINS.galactic     = FLYER_SKINS.galactic_outpost;
FLYER_SKINS.jurassic     = FLYER_SKINS.jurassic_island;
FLYER_SKINS.rome         = FLYER_SKINS.ancient_rome;
FLYER_SKINS.greece       = FLYER_SKINS.ancient_greece;
FLYER_SKINS.standard     = FLYER_SKINS.unthemed;

/* ===== SPRITE CODE ===== */
function drawFlyerRide(ctx, cx, cy, R, o = {}) {
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTheme = String(o.themeId || o.theme || 'unthemed').toLowerCase().replace(/[\s-]+/g, '_');
  if (rawTheme === 'wildwest' || rawTheme === 'wild_west') rawTheme = 'western';
  if (rawTheme === 'german') rawTheme = 'bavarian';
  if (rawTheme === 'retro') rawTheme = 'retro_future';
  if (rawTheme === 'galaxys_edge' || rawTheme === 'galactic') rawTheme = 'galactic_outpost';
  if (rawTheme === 'jurassic') rawTheme = 'jurassic_island';
  if (rawTheme === 'rome') rawTheme = 'ancient_rome';
  if (rawTheme === 'greece') rawTheme = 'ancient_greece';
  if (rawTheme === 'standard') rawTheme = 'unthemed';

  const theme = (tier <= 2 || !FLYER_SKINS[rawTheme]) ? 'unthemed' : rawTheme;
  const skin = FLYER_SKINS[theme] || FLYER_SKINS.unthemed;
  const accent = o.accent || skin.border || '#38bdf8';
  const rot = o.t == null ? 0.45 : o.t;
  const fly = o.fly == null ? 0.72 : o.fly;
  const tm = o.tm == null ? rot : o.tm;
  const fl = o.flip ? -1 : 1;
  const r = v => R * v;
  const TAU = Math.PI * 2;

  const cyB = cy + R * 0.05;
  const P = (X, Y, Z) => [cx + (X - Y) * 0.7, cyB + (X + Y) * 0.35 - Z];
  const g = (rr, a, Z) => P(rr * Math.cos(a), rr * Math.sin(a), Z);
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

  const line = (a, b, c, w) => {
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  };
  const poly = (pts, fill, stroke, lw) => {
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || R * 0.008; ctx.lineJoin = 'round'; ctx.stroke(); }
  };
  const disc = (p, rr, c, stroke, lw) => {
    ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(0.5, rr), 0, TAU);
    if (c) { ctx.fillStyle = c; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || R * 0.008; ctx.stroke(); }
  };
  const ell = (p, rr, fill, stroke, lw) => {
    ctx.beginPath(); ctx.ellipse(p[0], p[1], Math.max(0.5, 0.99 * rr), Math.max(0.5, 0.495 * rr), 0, 0, TAU);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || R * 0.009; ctx.stroke(); }
  };
  const cyl = (rr, Z, h, col, rimCol, drawTop = true) => {
    const pB = P(0, 0, Z), pT = P(0, 0, Z + h), rx = 0.99 * rr, ry = 0.495 * rr;
    ctx.beginPath();
    ctx.moveTo(pB[0] - rx, pB[1]);
    ctx.lineTo(pT[0] - rx, pT[1]);
    ctx.lineTo(pT[0] + rx, pT[1]);
    ctx.lineTo(pB[0] + rx, pB[1]);
    ctx.ellipse(pB[0], pB[1], rx, ry, 0, 0, Math.PI);
    ctx.closePath();
    const gr = ctx.createLinearGradient(pB[0] - rx, 0, pB[0] + rx, 0);
    gr.addColorStop(0, shade(col, 0.22));
    gr.addColorStop(0.38, col);
    gr.addColorStop(1, shade(col, -0.35));
    ctx.fillStyle = gr;
    ctx.fill();
    if (rimCol) {
      ctx.strokeStyle = rimCol; ctx.lineWidth = R * 0.008;
      ctx.beginPath(); ctx.ellipse(pB[0], pB[1], rx, ry, 0, 0, Math.PI); ctx.stroke();
    }
    if (drawTop) {
      ell(pT, rr, shade(col, 0.18), rimCol, R * 0.008);
    }
  };
  const cone = (rr, Z, h, col, rimCol) => {
    const p = P(0, 0, Z), rx = 0.99 * rr, ry = 0.495 * rr, tp = [p[0], p[1] - h];
    const gr = ctx.createLinearGradient(p[0] - rx, 0, p[0] + rx, 0);
    gr.addColorStop(0, shade(col, 0.28)); gr.addColorStop(0.45, col); gr.addColorStop(1, shade(col, -0.38));
    ctx.beginPath(); ctx.moveTo(p[0] - rx, p[1]); ctx.lineTo(tp[0], tp[1]); ctx.lineTo(p[0] + rx, p[1]);
    ctx.ellipse(p[0], p[1], rx, ry, 0, 0, Math.PI); ctx.closePath();
    ctx.fillStyle = gr; ctx.fill();
    if (rimCol) {
      ctx.strokeStyle = rimCol; ctx.lineWidth = R * 0.008;
      ctx.beginPath(); ctx.ellipse(p[0], p[1], rx, ry, 0, 0, Math.PI); ctx.stroke();
    }
    return tp;
  };
  const cylStripes = (rr, Z0, Z1, nStripes, colA, colB, rotOff = 0) => {
    for (let i = 0; i < nStripes; i++) {
      const a0 = -Math.PI * 0.25 + i * Math.PI / nStripes, a1 = a0 + Math.PI / nStripes;
      const idx = Math.floor((i + rotOff * nStripes / Math.PI) % 2 + 2) % 2;
      poly([g(rr, a0, Z0), g(rr, a1, Z0), g(rr, a1, Z1), g(rr, a0, Z1)], idx === 0 ? colA : colB);
    }
    const pB = P(0, 0, Z0);
    ctx.strokeStyle = 'rgba(15,23,42,0.35)'; ctx.lineWidth = R * 0.007;
    ctx.beginPath(); ctx.ellipse(pB[0], pB[1], 0.99 * rr, 0.495 * rr, 0, 0, Math.PI); ctx.stroke();
  };

  // 1. Optional Hex Tile Base
  if (o.tile !== false) {
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = theme === 'unthemed' ? '#cbd5e1' : skin.hex;
    ctx.fill();
    ctx.lineWidth = Math.max(2, R * 0.055);
    ctx.strokeStyle = accent;
    ctx.stroke();
  }

  // 2. Soft Ambient Shadow + Compact Central Turret Plinth
  const z0 = r(0.025);
  const p0 = P(0, 0, 0);
  ell([p0[0] + fl * r(0.05), p0[1] + r(0.02)], r(0.36), 'rgba(15,23,42,0.24)');

  const plinthCols = {
    unthemed:         ['#94a3b8', '#475569'],
    retro_future:     ['#e2e8f0', '#f97316'],
    tiki:             ['#5a3b22', '#15803d'],
    americana:        ['#f8fafc', '#b91c1c'],
    caribbean:        ['#78350f', '#f59e0b'],
    china:            ['#991b1b', '#facc15'],
    japan:            ['#475569', '#dc2626'],
    egypt:            ['#d97706', '#1d4ed8'],
    babylon:          ['#1d4ed8', '#facc15'],
    galactic_outpost: ['#475569', '#ea580c'],
    jurassic_island:  ['#57534e', '#eab308'],
    ancient_rome:     ['#e7e5e4', '#b91c1c'],
    ancient_greece:   ['#ffffff', '#0284c7'],
    classic:          ['#f5c542', '#b91c1c'],
    jungle:           ['#8e8a72', '#2fbf9a'],
    western:          ['#8a5a33', '#451a03'],
    frontier:         ['#6b4a2b', '#eab308'],
    space:            ['#0f172a', '#22d3ee'],
    gothic:           ['#27272a', '#991b1b'],
    medieval:         ['#64748b', '#f5c542'],
    alps:             ['#e2e8f0', '#dc2626'],
    fiesta:           ['#e11d48', '#facc15'],
    nordic:           ['#451a03', '#f59e0b'],
    bavarian:         ['#f8fafc', '#2563eb']
  }[theme] || ['#94a3b8', '#475569'];

  cyl(r(0.26), 0, z0, plinthCols[0], plinthCols[1]);
  ell(P(0, 0, z0), r(0.22), shade(plinthCols[0], 0.14), plinthCols[1], R * 0.008);

  // 3. Calculate 8 Sweeping Hydraulic Arms & Flying Vehicles
  const N = 8;
  const La = r(0.50);
  const Zhub = r(0.235);
  const Rcol = r(0.195);
  const pods = [];

  const podPalettes = {
    unthemed:         [accent, '#38bdf8', '#f59e0b', '#ef4444'],
    retro_future:     ['#f97316', '#06b6d4', '#facc15', '#e2e8f0'],
    tiki:             ['#d97706', '#15803d', '#b45309', '#f59e0b'],
    americana:        ['#b91c1c', '#1d4ed8', '#f8fafc', '#d97706'],
    caribbean:        ['#78350f', '#991b1b', '#451a03', '#b45309'],
    china:            ['#dc2626', '#facc15', '#10b981', '#ec4899'],
    japan:            ['#f8fafc', '#dc2626', '#1e293b', '#facc15'],
    egypt:            ['#eab308', '#0d9488', '#1d4ed8', '#f59e0b'],
    babylon:          ['#1d4ed8', '#eab308', '#15803d', '#0284c7'],
    galactic_outpost: ['#cbd5e1', '#c2410c', '#94a3b8', '#64748b'],
    jurassic_island:  ['#eab308', '#15803d', '#dc2626', '#f59e0b'],
    ancient_rome:     ['#b91c1c', '#f5efe0', '#d97706', '#7f1d1d'],
    ancient_greece:   ['#ffffff', '#0284c7', '#e2e8f0', '#38bdf8'],
    classic:          ['#94a3b8', '#a1a1aa', '#cbd5e1', '#94a3b8'],
    jungle:           ['#ef4444', '#10b981', '#f59e0b', '#06b6d4'],
    western:          ['#b45309', '#9a3412', '#78350f', '#a16207'],
    frontier:         ['#5a3b22', '#4a3320', '#6b4a2b', '#3e2723'],
    space:            ['#e2e8f0', '#38bdf8', '#c084fc', '#22d3ee'],
    gothic:           ['#3f3f46', '#52525b', '#27272a', '#450a0a'],
    medieval:         ['#b91c1c', '#1d4ed8', '#15803d', '#7e22ce'],
    alps:             ['#dc2626', '#0284c7', '#16a34a', '#f59e0b'],
    fiesta:           ['#e11d48', '#0d9488', '#f59e0b', '#9333ea'],
    nordic:           ['#78350f', '#991b1b', '#451a03', '#1e3a8a'],
    bavarian:         ['#d97706', '#2563eb', '#b91c1c', '#0d9488']
  }[theme];

  for (let k = 0; k < N; k++) {
    const a = rot + k * TAU / N;
    const wave = 0.14 * Math.sin(rot * 2.0 + k * 1.57);
    const effFly = Math.max(0.02, Math.min(1.0, fly * (0.86 + wave)));
    const el = -0.18 + effFly * 0.72;
    const ce = Math.cos(el), se = Math.sin(el);
    const E = [La * ce * Math.cos(a), La * ce * Math.sin(a), Zhub + La * se];
    const P0 = [Rcol * 0.92 * Math.cos(a), Rcol * 0.92 * Math.sin(a), Zhub];
    pods.push({ k, a, el, effFly, E, P0, key: E[0] + E[1], col: podPalettes[k % 4] });
  }

  // 4. Cast Individual Ground Shadows Underneath the 8 Flying Vehicles
  pods.forEach(p => {
    const sh = P(p.E[0], p.E[1], 0);
    const sc = Math.max(0.55, 1.0 - p.E[2] / (R * 0.9));
    ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
    ctx.beginPath();
    ctx.ellipse(sh[0] + fl * p.E[2] * 0.15, sh[1] + p.E[2] * 0.08, r(0.115) * sc, r(0.055) * sc, 0, 0, TAU);
    ctx.fill();
  });

  const armColors = {
    unthemed:         ['#64748b', '#cbd5e1', accent],
    retro_future:     ['#334155', '#f8fafc', '#f97316'],
    tiki:             ['#3e2716', '#8a5a33', '#22c55e'],
    americana:        ['#7f1d1d', '#fbf6e8', '#1d3557'],
    caribbean:        ['#3e2716', '#78350f', '#facc15'],
    china:            ['#7f1d1d', '#dc2626', '#facc15'],
    japan:            ['#0f172a', '#dc2626', '#facc15'],
    egypt:            ['#78350f', '#eab308', '#1d4ed8'],
    babylon:          ['#172554', '#1d4ed8', '#facc15'],
    galactic_outpost: ['#1e293b', '#64748b', '#ea580c'],
    jurassic_island:  ['#292524', '#78716c', '#eab308'],
    ancient_rome:     ['#78350f', '#f5efe0', '#b91c1c'],
    ancient_greece:   ['#475569', '#ffffff', '#0284c7'],
    classic:          ['#b91c1c', '#f5c542', '#fffbeb'],
    jungle:           ['#5a4028', '#eab308', '#2fbf9a'],
    western:          ['#451a03', '#8a5a33', '#b91c1c'],
    frontier:         ['#3e2723', '#6b4a2b', '#eab308'],
    space:            ['#0f172a', '#e2e8f0', '#22d3ee'],
    gothic:           ['#09090b', '#3f3f46', '#dc2626'],
    medieval:         ['#451a03', '#f5c542', '#b91c1c'],
    alps:             ['#475569', '#f8fafc', '#dc2626'],
    fiesta:           ['#9a3412', '#f59e0b', '#0d9488'],
    nordic:           ['#290f02', '#78350f', '#f59e0b'],
    bavarian:         ['#78350f', '#f8fafc', '#2563eb']
  }[theme];

  const drawArmAndVehicle = p => {
    const Hpiv = P(p.P0[0], p.P0[1], Zhub);
    const Hpist = P(p.P0[0] * 0.82, p.P0[1] * 0.82, Zhub - r(0.048));
    const Ep = P(p.E[0], p.E[1], p.E[2]);
    const midArm = lerp(Hpiv, Ep, 0.44);

    disc(Hpiv, r(0.022), armColors[0], armColors[2], R * 0.005);
    line(Hpist, midArm, '#475569', r(0.022));
    line(lerp(Hpist, midArm, 0.4), midArm, '#e2e8f0', r(0.011));

    line(Hpiv, Ep, armColors[0], r(0.046));
    line(Hpiv, Ep, armColors[1], r(0.026));
    line(lerp(Hpiv, Ep, 0.20), lerp(Hpiv, Ep, 0.54), armColors[2], r(0.030));
    disc(Ep, r(0.020), armColors[2], armColors[0], R * 0.006);

    // Upright-Locked 3D Tangent Transform (vehicles & riders NEVER flip upside down!)
    const tx = (-Math.sin(p.a) - Math.cos(p.a)) * 0.70;
    const ty = (-Math.sin(p.a) + Math.cos(p.a)) * 0.35;
    const tl = Math.hypot(tx, ty) || 1;
    const dir = (tx >= 0) ? 1 : -1;
    const scX = Math.max(0.56, Math.abs(tx) / 0.72);
    const slopeY = Math.max(-0.34, Math.min(0.34, (ty / tl) * 0.42 - p.el * 0.16));

    const C = [Ep[0], Ep[1] - r(0.024)];
    const col = p.col;
    const flap = Math.sin(tm * 5.5 + p.k * 1.2) * r(0.025);

    ctx.save();
    ctx.transform(dir * scX, slopeY, 0, 1, C[0], C[1]);

    const L = r(0.138);
    const H = r(0.064);

    /* ==================== 12 NEW EXPANSION VEHICLES ==================== */

    if (theme === 'retro_future') {
      // 1. RETRO-FUTURE: 1950s Chrome & Atomic-Orange Finned Rocketship with Bubble Canopy!
      poly([[-L * 1.02, -H * 0.24], [-L * 1.65, 0], [-L * 1.02, H * 0.28]], '#f97316');
      poly([[-L * 1.02, -H * 0.12], [-L * 1.38, 0], [-L * 1.02, H * 0.14]], '#fef08a');
      poly([[-L * 0.55, -H * 0.25], [-L * 1.15, -H * 1.15], [-L * 0.25, -H * 0.45]], '#06b6d4', '#ffffff', R * 0.006);
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath(); ctx.ellipse(0, H * 0.14, L * 1.04, H * 0.76, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath(); ctx.ellipse(0, 0, L * 1.04, H * 0.74, 0, 0, TAU); ctx.fill();
      poly([[L * 0.65, -H * 0.52], [L * 1.48, 0], [L * 0.65, H * 0.52]], col, '#0f172a', R * 0.007);
      line([L * 1.45, 0], [L * 1.72, 0], '#f97316', R * 0.010);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.ellipse(0, -H * 0.18, L * 0.52, H * 0.42, 0, 0, TAU); ctx.fill();
      [-0.22, 0.18].forEach((rx, rIdx) => {
        const px = rx * L, py = -H * 0.35;
        ctx.fillStyle = rIdx ? '#06b6d4' : '#f97316';
        ctx.fillRect(px - R * 0.015, py - R * 0.01, R * 0.030, R * 0.032);
        disc([px, py - R * 0.022], R * 0.020, '#ffffff', '#0284c7', R * 0.004);
      });
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.85)'; ctx.lineWidth = R * 0.008;
      ctx.beginPath(); ctx.arc(0, -H * 0.25, L * 0.52, Math.PI, 0); ctx.stroke();
      poly([[-L * 0.45, H * 0.18], [-L * 1.12, H * 1.08], [-L * 0.12, H * 0.45]], col, '#ffffff', R * 0.007);
      line([-L * 1.25, H * 1.08], [-L * 0.85, H * 1.08], '#06b6d4', R * 0.012);
    }
    else if (theme === 'tiki') {
      // 2. TIKI: Carved Polynesian Outrigger War-Canoe with Bamboo Pontoon, Lauhala Sail & Glowing Tiki Prow!
      // Far outrigger struts & bamboo pontoon
      line([-L * 0.38, H * 0.45], [-L * 0.38, H * 1.10], '#d9a74a', R * 0.010);
      line([ L * 0.38, H * 0.45], [ L * 0.38, H * 1.10], '#d9a74a', R * 0.010);
      ctx.fillStyle = '#ca8a04';
      ctx.strokeStyle = '#451a03'; ctx.lineWidth = R * 0.006;
      ctx.beginPath(); ctx.ellipse(0, H * 1.12, L * 0.90, H * 0.22, 0, 0, TAU); ctx.fill(); ctx.stroke();
      // Upswept dark koa-wood war-canoe hull with tribal chevron carvings
      ctx.fillStyle = '#5a3b22';
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = R * 0.008;
      ctx.beginPath(); ctx.ellipse(0, H * 0.12, L * 1.05, H * 0.76, 0, 0, TAU); ctx.fill(); ctx.stroke();
      // Carved Tiki Idol Mask Prow (+L) with glowing ember eyes & feathered headdress
      poly([[L * 0.88, -H * 0.55], [L * 1.28, -H * 0.45], [L * 1.24, H * 0.32], [L * 0.88, H * 0.28]], '#78350f', '#facc15', R * 0.007);
      disc([L * 1.08, -H * 0.22], R * 0.011, '#f97316', '#fef08a', R * 0.004);
      line([L * 0.92, -H * 0.55], [L * 0.78, -H * 1.02], '#dc2626', R * 0.012);
      line([L * 1.06, -H * 0.55], [L * 1.02, -H * 1.08], '#facc15', R * 0.012);
      // Woven lauhala triangular crab-claw sail behind cockpit
      line([-L * 0.48, -H * 0.20], [-L * 0.48, -H * 1.48], '#8a5a33', R * 0.011);
      poly([[-L * 0.48, -H * 1.42], [L * 0.05, -H * 0.92], [-L * 0.48, -H * 0.55]], '#fef3c7', '#b45309', R * 0.006);
      // Riders
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.ellipse(0.04 * L, -H * 0.16, L * 0.48, H * 0.38, 0, 0, TAU); ctx.fill();
      [-0.14, 0.22].forEach((rx, rIdx) => {
        const px = rx * L, py = -H * 0.34;
        ctx.fillStyle = rIdx ? '#22c55e' : '#f97316';
        ctx.fillRect(px - R * 0.015, py - R * 0.01, R * 0.030, R * 0.032);
        disc([px, py - R * 0.022], R * 0.020, '#fde4c8');
      });
    }
    else if (theme === 'americana') {
      // 3. AMERICANA: Early 1903 Wright-Style Twin-Wing Biplane with Wire Bracing, Mahogany Hull & Spinning Prop!
      // Upper cream canvas wing + mahogany interplane struts & cross-wire bracing
      poly([[-L * 0.52, -H * 1.18], [L * 0.52, -H * 1.18], [L * 0.38, -H * 0.90], [-L * 0.62, -H * 0.90]], '#fffbeb', '#b91c1c', R * 0.007);
      [-0.32, 0.26].forEach(sx => {
        line([sx * L, -H * 0.90], [sx * L, -H * 0.12], '#78350f', R * 0.009);
      });
      line([-L * 0.32, -H * 0.90], [L * 0.26, -H * 0.12], '#d97706', R * 0.004);
      line([ L * 0.26, -H * 0.90], [-L * 0.32, -H * 0.12], '#d97706', R * 0.004);
      // Open-lattice wooden tail boom & rudder with stars-and-stripes stripe
      poly([[-L * 0.65, -H * 0.12], [-L * 1.38, -H * 0.98], [-L * 1.05, H * 0.25]], '#1d4ed8', '#ffffff', R * 0.006);
      line([-L * 1.28, -H * 0.45], [-L * 1.02, -H * 0.45], '#dc2626', R * 0.014);
      // Varnished mahogany fuselage with brass radiator nose
      ctx.fillStyle = col;
      ctx.strokeStyle = '#facc15'; ctx.lineWidth = R * 0.007;
      ctx.beginPath(); ctx.ellipse(0, H * 0.08, L * 0.98, H * 0.72, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(L * 0.85, -H * 0.38, L * 0.16, H * 0.76);
      // Spinning twin-blade wooden propeller at nose (+L)
      const prLen = H * 1.02 * Math.cos(tm * 18 + p.k);
      line([L * 1.05, -H * 0.12 - prLen], [L * 1.05, -H * 0.12 + prLen], '#92400e', R * 0.014);
      disc([L * 1.05, -H * 0.12], R * 0.015, '#facc15');
      // Riders & Lower cream canvas wing + vintage spoked landing wheels
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.ellipse(0, -H * 0.18, L * 0.50, H * 0.38, 0, 0, TAU); ctx.fill();
      [-0.22, 0.16].forEach((rx, rIdx) => {
        const px = rx * L, py = -H * 0.34;
        ctx.fillStyle = rIdx ? '#b91c1c' : '#1d4ed8';
        ctx.fillRect(px - R * 0.015, py - R * 0.01, R * 0.030, R * 0.032);
        disc([px, py - R * 0.022], R * 0.020, '#fde4c8');
      });
      poly([[-L * 0.38, H * 0.15], [-L * 0.72, H * 0.88], [L * 0.32, H * 0.48]], '#fffbeb', '#1d4ed8', R * 0.007);
      disc([L * 0.35, H * 0.88], R * 0.022, '#1e293b', '#f8fafc', R * 0.005);
    }
    else if (theme === 'caribbean') {
      // 4. CARIBBEAN: Armed Pirate Galleon Sloop with Bowsprit, Swivel Cannons & Jolly Roger Sail!
      ctx.fillStyle = '#5a3b22';
      ctx.strokeStyle = '#facc15'; ctx.lineWidth = R * 0.008;
      ctx.beginPath(); ctx.ellipse(0, H * 0.14, L * 1.04, H * 0.78, 0, 0, TAU); ctx.fill(); ctx.stroke();
      // High stern castle gallery (-L) with golden stern lantern & figurehead bowsprit (+L)
      poly([[-L * 1.02, -H * 0.42], [-L * 0.52, -H * 0.42], [-L * 0.52, H * 0.25], [-L * 1.02, H * 0.25]], '#451a03', '#facc15', R * 0.006);
      disc([-L * 1.06, -H * 0.32], R * 0.015, '#fef08a', '#b45309', R * 0.004);
      line([L * 0.88, -H * 0.12], [L * 1.54, -H * 0.58], '#78350f', R * 0.012);
      // Brass cannon barrels protruding from gunports
      [-0.25, 0.25].forEach(cx => {
        line([cx * L, H * 0.28], [cx * L - L * 0.08, H * 0.52], '#18181b', R * 0.012);
      });
      // Mini mast & billowing black Jolly Roger square sail behind cockpit
      line([-L * 0.42, -H * 0.2], [-L * 0.42, -H * 1.62], '#451a03', R * 0.011);
      poly([[-L * 0.42, -H * 1.45], [L * 0.04, -H * 1.08], [-L * 0.42, -H * 0.68]], '#0f172a', '#ffffff', R * 0.005);
      disc([-L * 0.24, -H * 1.08], R * 0.014, '#ffffff');
      // Riders
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.ellipse(0.06 * L, -H * 0.16, L * 0.48, H * 0.38, 0, 0, TAU); ctx.fill();
      [-0.14, 0.22].forEach((rx, rIdx) => {
        const px = rx * L, py = -H * 0.34;
        ctx.fillStyle = rIdx ? '#dc2626' : '#0f172a';
        ctx.fillRect(px - R * 0.015, py - R * 0.01, R * 0.030, R * 0.032);
        disc([px, py - R * 0.022], R * 0.020, '#fde4c8');
      });
    }
    else if (theme === 'china') {
      // 5. CHINA: Articulated Flying Paper Festival Dragon with Silk Ribbons & Flaming Pearl!
      const tailWave = Math.sin(tm * 6 + p.k) * H * 0.38;
      line([-L * 0.85, 0], [-L * 1.62, -H * 0.38 + tailWave], '#facc15', R * 0.015);
      line([-L * 0.85, H * 0.15], [-L * 1.54, H * 0.38 - tailWave], '#ef4444', R * 0.013);
      // Glowing flaming pearl suspended ahead of dragon's jaws (+1.68 L)
      disc([L * 1.68, -H * 0.25 + flap * 0.5], R * 0.022, '#f97316', '#fef08a', R * 0.005);
      // Segmented scalloped paper-lantern dragon body
      [-0.68, -0.24, 0.22, 0.66].forEach((sx, sIdx) => {
        const segCol = ['#dc2626', '#facc15', '#10b981', '#ec4899'][sIdx];
        ctx.fillStyle = segCol;
        ctx.strokeStyle = '#fef08a'; ctx.lineWidth = R * 0.006;
        ctx.beginPath(); ctx.ellipse(sx * L, Math.sin(tm * 5 + sIdx) * H * 0.14, L * 0.38, H * 0.74, 0, 0, TAU); ctx.fill(); ctx.stroke();
      });
      // Ornate horned Chinese Dragon Head at Front (+L) with whiskers & mane
      poly([[L * 0.68, -H * 0.58], [L * 1.46, -H * 0.24], [L * 1.34, H * 0.36], [L * 0.68, H * 0.34]], '#dc2626', '#facc15', R * 0.008);
      line([L * 0.85, -H * 0.50], [L * 0.60, -H * 1.22], '#facc15', R * 0.013);
      line([L * 1.25, H * 0.12], [L * 1.64, H * 0.58 + flap], '#fef08a', R * 0.008);
      disc([L * 1.02, -H * 0.24], R * 0.013, '#fef08a', '#0f172a', R * 0.004);
      // Riders
      ctx.fillStyle = '#450a0a';
      ctx.beginPath(); ctx.ellipse(0, -H * 0.18, L * 0.48, H * 0.38, 0, 0, TAU); ctx.fill();
      [-0.18, 0.18].forEach((rx, rIdx) => {
        const px = rx * L, py = -H * 0.35;
        ctx.fillStyle = rIdx ? '#facc15' : '#ef4444';
        ctx.fillRect(px - R * 0.015, py - R * 0.01, R * 0.030, R * 0.032);
        disc([px, py - R * 0.022], R * 0.020, '#fde4c8');
      });
    }
    else if (theme === 'japan') {
      // 6. JAPAN: Lacquered Edo Samurai Kago Palanquin with Curved Irimoya Roof & Nobori War Banner!
      // Carrying pole & fluttering crimson Nobori samurai banner at rear (-L)
      line([-L * 1.32, -H * 0.28], [L * 1.32, -H * 0.28], '#78350f', R * 0.013);
      line([-L * 0.92, -H * 0.28], [-L * 0.92, -H * 1.55], '#facc15', R * 0.009);
      poly([[-L * 0.92, -H * 1.50], [-L * 1.26, -H * 1.50], [-L * 1.26, -H * 0.72], [-L * 0.92, -H * 0.72]], '#dc2626', '#facc15', R * 0.005);
      // Black & crimson lacquered palanquin cabin with gold Kamon crest
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#dc2626'; ctx.lineWidth = R * 0.008;
      ctx.beginPath(); ctx.roundRect(-L * 0.85, -H * 0.38, L * 1.70, H * 0.92, R * 0.012); ctx.fill(); ctx.stroke();
      disc([L * 0.58, H * 0.12], R * 0.020, '#facc15', '#dc2626', R * 0.005);
      // Riders
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.ellipse(-0.06 * L, -H * 0.20, L * 0.46, H * 0.36, 0, 0, TAU); ctx.fill();
      [-0.22, 0.14].forEach((rx, rIdx) => {
        const px = rx * L, py = -H * 0.35;
        ctx.fillStyle = rIdx ? '#dc2626' : '#1e293b';
        ctx.fillRect(px - R * 0.015, py - R * 0.01, R * 0.030, R * 0.032);
        disc([px, py - R * 0.022], R * 0.020, '#fde4c8');
      });
      // Corner struts & curved dark-slate Irimoya Dojo Canopy Roof with gold ridge
      line([-L * 0.68, -H * 0.35], [-L * 0.68, -H * 1.12], '#dc2626', R * 0.009);
      line([ L * 0.68, -H * 0.35], [ L * 0.68, -H * 1.12], '#dc2626', R * 0.009);
      poly([[-L * 0.96, -H * 1.05], [0, -H * 1.45], [L * 0.96, -H * 1.05]], '#0f172a', '#facc15', R * 0.006);
    }
    else if (theme === 'egypt') {
      // 7. EGYPT: Sacred Golden Horus Falcon with Outspread Lapis & Turquoise Wings + Solar Disc Crown!
      poly([[0, -H * 0.2], [-L * 0.44, -H * 1.42 - flap], [L * 0.26, -H * 0.95 - flap * 0.5]], '#0d9488', '#facc15', R * 0.006);
      poly([[-L * 0.72, 0], [-L * 1.44, -H * 0.50], [-L * 1.36, H * 0.38]], '#1d4ed8', '#facc15', R * 0.006);
      ctx.fillStyle = '#eab308';
      ctx.strokeStyle = '#78350f'; ctx.lineWidth = R * 0.007;
      ctx.beginPath(); ctx.ellipse(0, 0, L * 0.95, H * 0.80, 0, 0, TAU); ctx.fill(); ctx.stroke();
      // Hooked golden falcon beak, Eye of Horus & red Solar Disc crown (+L)
      poly([[L * 0.75, -H * 0.45], [L * 1.50, -H * 0.12], [L * 1.30, H * 0.32], [L * 0.75, H * 0.22]], '#facc15', '#1d4ed8', R * 0.007);
      disc([L * 0.82, -H * 0.76], R * 0.024, '#ef4444', '#facc15', R * 0.006);
      disc([L * 0.95, -H * 0.22], R * 0.011, '#0f172a');
      // Riders & Near Lapis-and-Gold Wing
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.ellipse(0, -H * 0.18, L * 0.48, H * 0.38, 0, 0, TAU); ctx.fill();
      [-0.20, 0.16].forEach((rx, rIdx) => {
        const px = rx * L, py = -H * 0.34;
        ctx.fillStyle = rIdx ? '#1d4ed8' : '#0d9488';
        ctx.fillRect(px - R * 0.015, py - R * 0.01, R * 0.030, R * 0.032);
        disc([px, py - R * 0.022], R * 0.020, '#fde4c8');
      });
      poly([[L * 0.15, H * 0.15], [-L * 0.35, H * 1.18 + flap], [L * 0.45, H * 0.76 + flap * 0.5]], '#1d4ed8', '#facc15', R * 0.007);
    }
    else if (theme === 'babylon') {
      // 8. BABYLON: Winged Lamassu / Lapis-Lazuli Royal Chariot-Barge with Turquoise Wings!
      poly([[0, -H * 0.2], [-L * 0.42, -H * 1.36 - flap], [L * 0.25, -H * 0.90 - flap * 0.5]], '#0d9488', '#facc15', R * 0.006);
      ctx.fillStyle = '#1d4ed8';
      ctx.strokeStyle = '#facc15'; ctx.lineWidth = R * 0.008;
      ctx.beginPath(); ctx.ellipse(0, H * 0.10, L * 0.98, H * 0.78, 0, 0, TAU); ctx.fill(); ctx.stroke();
      [-0.45, 0, 0.45].forEach(rx => disc([rx * L, H * 0.25], R * 0.014, '#facc15', '#ffffff', R * 0.004));
      // Golden horned Lamassu / lion prow at +L
      poly([[L * 0.75, -H * 0.48], [L * 1.44, -H * 0.26], [L * 1.30, H * 0.30], [L * 0.75, H * 0.26]], '#facc15', '#172554', R * 0.007);
      // Riders & Near Gold/Cobalt Wing
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.ellipse(0, -H * 0.18, L * 0.48, H * 0.38, 0, 0, TAU); ctx.fill();
      [-0.20, 0.16].forEach((rx, rIdx) => {
        const px = rx * L, py = -H * 0.34;
        ctx.fillStyle = rIdx ? '#facc15' : '#15803d';
        ctx.fillRect(px - R * 0.015, py - R * 0.01, R * 0.030, R * 0.032);
        disc([px, py - R * 0.022], R * 0.020, '#fde4c8');
      });
      poly([[L * 0.15, H * 0.15], [-L * 0.35, H * 1.14 + flap], [L * 0.45, H * 0.74 + flap * 0.5]], '#facc15', '#1d4ed8', R * 0.007);
    }
    else if (theme === 'galactic_outpost') {
      // 9. GALACTIC OUTPOST: Weathered Batuu Repulsorlift Hover Speeder with Triple Turbines!
      ctx.fillStyle = 'rgba(56, 189, 248, 0.40)';
      ctx.beginPath(); ctx.ellipse(0, H * 0.85, L * 1.08, H * 0.24, 0, 0, TAU); ctx.fill();
      poly([[-L * 0.98, -H * 0.24], [-L * 1.58, 0], [-L * 0.98, H * 0.28]], '#fb923c');
      ctx.fillStyle = '#334155';
      ctx.fillRect(-L * 1.06, -H * 0.48, L * 0.34, H * 0.90);
      poly([
        [-L * 0.92, -H * 0.42],
        [ L * 0.55, -H * 0.42],
        [ L * 1.54, -H * 0.14],
        [ L * 1.54,  H * 0.24],
        [ L * 0.55,  H * 0.54],
        [-L * 0.92,  H * 0.50]
      ], col, '#1e293b', R * 0.008);
      line([-L * 0.85, H * 0.08], [L * 1.46, H * 0.08], '#c2410c', R * 0.015);
      poly([[L * 0.32, -H * 0.38], [L * 0.68, -H * 0.28], [L * 0.45, -H * 0.65], [L * 0.20, -H * 0.62]], 'rgba(56,189,248,0.68)', '#e2e8f0', R * 0.006);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.ellipse(-0.08 * L, -H * 0.18, L * 0.48, H * 0.38, 0, 0, TAU); ctx.fill();
      [-0.24, 0.12].forEach((rx, rIdx) => {
        const px = rx * L, py = -H * 0.34;
        ctx.fillStyle = rIdx ? '#c2410c' : '#475569';
        ctx.fillRect(px - R * 0.015, py - R * 0.01, R * 0.030, R * 0.032);
        disc([px, py - R * 0.022], R * 0.020, '#fde4c8');
      });
    }
    else if (theme === 'jurassic_island') {
      // 10. JURASSIC ISLAND: Isla Nublar Tour Helicopter with Spinning Main & Tail Rotors!
      poly([[-L * 0.65, -H * 0.18], [-L * 1.50, -H * 0.28], [-L * 1.50, H * 0.08], [-L * 0.65, H * 0.24]], '#15803d', '#052e16', R * 0.007);
      poly([[-L * 1.32, -H * 0.25], [-L * 1.56, -H * 0.88], [-L * 1.48, H * 0.35]], '#eab308', '#15803d', R * 0.006);
      disc([-L * 1.46, -H * 0.18], R * 0.028 * Math.abs(Math.sin(tm * 16 + p.k)) + R * 0.008, 'rgba(226, 232, 240, 0.65)');
      line([-L * 0.55, H * 0.86], [L * 0.68, H * 0.86], '#27272a', R * 0.013);
      line([ L * 0.68, H * 0.86], [L * 0.88, H * 0.65], '#27272a', R * 0.013);
      line([-L * 0.32, H * 0.52], [-L * 0.32, H * 0.86], '#27272a', R * 0.010);
      line([ L * 0.32, H * 0.52], [ L * 0.32, H * 0.86], '#27272a', R * 0.010);
      ctx.fillStyle = col;
      ctx.strokeStyle = '#15803d'; ctx.lineWidth = R * 0.008;
      ctx.beginPath(); ctx.ellipse(0.05 * L, 0, L * 0.94, H * 0.82, 0, 0, TAU); ctx.fill(); ctx.stroke();
      line([-L * 0.72, H * 0.14], [L * 0.85, H * 0.14], '#dc2626', R * 0.015);
      poly([[L * 0.42, -H * 0.55], [L * 0.95, -H * 0.15], [L * 0.82, H * 0.38], [L * 0.42, H * 0.38]], 'rgba(186, 230, 253, 0.72)', '#15803d', R * 0.006);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.ellipse(-0.08 * L, -H * 0.18, L * 0.46, H * 0.38, 0, 0, TAU); ctx.fill();
      [-0.24, 0.12].forEach((rx, rIdx) => {
        const px = rx * L, py = -H * 0.34;
        ctx.fillStyle = rIdx ? '#15803d' : '#eab308';
        ctx.fillRect(px - R * 0.015, py - R * 0.01, R * 0.030, R * 0.032);
        disc([px, py - R * 0.022], R * 0.020, '#fde4c8');
      });
      line([0, -H * 0.75], [0, -H * 1.18], '#1e293b', R * 0.014);
      const rotSpan = L * 1.52 * Math.cos(tm * 14 + p.k * 0.8);
      line([-rotSpan, -H * 1.18], [rotSpan, -H * 1.18], '#e2e8f0', R * 0.012);
      disc([0, -H * 1.18], R * 0.016, '#dc2626', '#facc15', R * 0.004);
    }
    else if (theme === 'ancient_rome') {
      // 11. ANCIENT ROME: Gladiator War Chariot with Bronze Ram Prow, Scutum Shield & Spoked Wheel!
      ctx.fillStyle = col;
      ctx.strokeStyle = '#facc15'; ctx.lineWidth = R * 0.008;
      ctx.beginPath(); ctx.ellipse(0, H * 0.10, L * 0.96, H * 0.78, 0, 0, TAU); ctx.fill(); ctx.stroke();
      poly([[L * 0.45, -H * 0.68], [L * 1.18, -H * 0.42], [L * 1.08, H * 0.38], [L * 0.45, H * 0.38]], '#b91c1c', '#facc15', R * 0.007);
      disc([L * 0.86, -H * 0.12], R * 0.022, '#facc15', '#7f1d1d', R * 0.004);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.ellipse(-0.10 * L, -H * 0.18, L * 0.46, H * 0.38, 0, 0, TAU); ctx.fill();
      [-0.26, 0.08].forEach((rx, rIdx) => {
        const px = rx * L, py = -H * 0.34;
        ctx.fillStyle = rIdx ? '#facc15' : '#dc2626';
        ctx.fillRect(px - R * 0.015, py - R * 0.01, R * 0.030, R * 0.032);
        disc([px, py - R * 0.022], R * 0.020, '#fde4c8');
      });
      // Rectangular Roman Scutum shield & spoked bronze chariot wheel
      ctx.fillStyle = '#991b1b'; ctx.strokeStyle = '#facc15'; ctx.lineWidth = R * 0.006;
      ctx.fillRect(L * 0.12, -H * 0.05, L * 0.38, H * 0.56); ctx.strokeRect(L * 0.12, -H * 0.05, L * 0.38, H * 0.56);
      disc([-L * 0.28, H * 0.42], R * 0.035, '#78350f', '#facc15', R * 0.007);
      disc([-L * 0.28, H * 0.42], R * 0.012, '#facc15');
    }
    else if (theme === 'ancient_greece') {
      // 12. ANCIENT GREECE: Winged Pegasus & Celestial Star-Chariot with Ophthalmos Eye & Spoked Wheel!
      poly([[0, -H * 0.2], [-L * 0.40, -H * 1.32 - flap], [L * 0.24, -H * 0.88 - flap * 0.5]], '#38bdf8', '#ffffff', R * 0.006);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0284c7'; ctx.lineWidth = R * 0.008;
      ctx.beginPath(); ctx.ellipse(0, H * 0.10, L * 0.96, H * 0.78, 0, 0, TAU); ctx.fill(); ctx.stroke();
      disc([L * 0.78, -H * 0.08], R * 0.021, '#ffffff', '#0f172a', R * 0.005);
      disc([L * 0.80, -H * 0.08], R * 0.010, '#0284c7');
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.ellipse(-0.08 * L, -H * 0.18, L * 0.46, H * 0.38, 0, 0, TAU); ctx.fill();
      [-0.24, 0.10].forEach((rx, rIdx) => {
        const px = rx * L, py = -H * 0.34;
        ctx.fillStyle = rIdx ? '#0284c7' : '#facc15';
        ctx.fillRect(px - R * 0.015, py - R * 0.01, R * 0.030, R * 0.032);
        disc([px, py - R * 0.022], R * 0.020, '#fde4c8');
      });
      disc([-L * 0.25, H * 0.42], R * 0.034, '#0284c7', '#facc15', R * 0.007);
      disc([-L * 0.25, H * 0.42], R * 0.012, '#ffffff');
      poly([[L * 0.15, H * 0.15], [-L * 0.35, H * 1.12 + flap], [L * 0.45, H * 0.72 + flap * 0.5]], '#f8fafc', '#0284c7', R * 0.007);
    }

    /* ==================== ORIGINAL 12 VEHICLES ==================== */
    else {
      // Back Wing / Far Ear
      if (theme === 'classic') {
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath(); ctx.ellipse(-L * 0.05, -H * 0.65 - flap * 0.6, L * 0.42, H * 0.52, -0.25, 0, TAU); ctx.fill();
      } else if (theme === 'jungle' || theme === 'frontier' || theme === 'gothic' || theme === 'medieval' || theme === 'fiesta') {
        const wCol = theme === 'jungle' ? '#10b981' : theme === 'frontier' ? '#3e2723' : theme === 'gothic' ? '#18181b' : shade(col, -0.25);
        poly([[0, -H * 0.2], [-L * 0.45, -H * 1.35 - flap], [L * 0.25, -H * 0.95 - flap * 0.5]], wCol, '#0f172a', R * 0.006);
      } else if (theme === 'space') {
        poly([[-L * 0.42, -H * 0.18], [-L * 0.72, -H * 0.95], [L * 0.18, -H * 0.35]], '#334155', '#22d3ee', R * 0.006);
        line([-L * 0.85, -H * 0.95], [-L * 0.35, -H * 0.95], '#22d3ee', R * 0.012);
      } else if (theme === 'unthemed' || theme === 'western' || theme === 'alps') {
        poly([[-L * 0.25, -H * 0.2], [-L * 0.55, -H * 0.95], [L * 0.15, -H * 0.55]], shade(col, -0.25), '#1e293b', R * 0.006);
      }

      // Main Fuselage / Creature Body
      if (theme === 'classic') {
        ctx.fillStyle = '#64748b';
        ctx.beginPath(); ctx.ellipse(0, H * 0.15, L * 0.92, H * 0.88, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath(); ctx.ellipse(0, 0, L * 0.90, H * 0.85, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath(); ctx.arc(L * 0.78, -H * 0.18, H * 0.68, 0, TAU); ctx.fill();
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = H * 0.36; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(L * 1.15, -H * 0.15); ctx.quadraticCurveTo(L * 1.58, -H * 0.25, L * 1.45, -H * 0.85); ctx.stroke();
        poly([[L * 0.62, -H * 0.75], [L * 1.02, -H * 0.75], [L * 0.82, -H * 1.45]], '#facc15', '#b91c1c', R * 0.007);
        disc([L * 0.96, -H * 0.28], R * 0.011, '#0f172a');
        ctx.fillStyle = '#e11d48';
        ctx.strokeStyle = '#f5c542'; ctx.lineWidth = R * 0.01;
        ctx.beginPath(); ctx.roundRect(-L * 0.48, -H * 0.55, L * 0.88, H * 0.95, R * 0.015); ctx.fill(); ctx.stroke();
      }
      else if (theme === 'space') {
        poly([[-L * 1.02, -H * 0.28], [-L * 1.72, 0], [-L * 1.02, H * 0.32]], '#22d3ee');
        poly([[-L * 1.02, -H * 0.14], [-L * 1.42, 0], [-L * 1.02, H * 0.16]], '#ffffff');
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-L * 1.08, -H * 0.34, L * 0.24, H * 0.68);
        poly([[-L * 0.42, -H * 0.25], [-L * 1.08, -H * 1.32], [-L * 0.92, -H * 0.10]], '#0284c7', '#22d3ee', R * 0.007);
        poly([[-L * 0.92, -H * 0.46], [L * 0.52, -H * 0.46], [L * 1.58, 0.00], [L * 0.55, H * 0.56], [-L * 0.92, H * 0.52]], '#e2e8f0', '#334155', R * 0.008);
        poly([[-L * 0.92, 0.05 * H], [L * 1.58, 0.00], [L * 0.55, H * 0.56], [-L * 0.92, H * 0.52]], '#94a3b8');
        poly([[L * 0.85, -H * 0.26], [L * 1.58, 0], [L * 0.85, H * 0.28]], col, '#0f172a', R * 0.006);
        line([L * 1.55, 0], [L * 1.85, 0], '#22d3ee', R * 0.010);
        line([-L * 0.85, 0], [L * 0.82, 0], '#22d3ee', R * 0.011);
      }
      else if (theme === 'jungle') {
        poly([[-L * 0.75, 0], [-L * 1.45, -H * 0.55], [-L * 1.35, H * 0.35]], '#facc15', '#b91c1c', R * 0.006);
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.ellipse(0, 0, L * 0.92, H * 0.82, 0, 0, TAU); ctx.fill();
        poly([[L * 0.72, -H * 0.45], [L * 1.55, -H * 0.15], [L * 1.35, H * 0.35], [L * 0.72, H * 0.25]], '#f59e0b', '#1e293b', R * 0.007);
        poly([[L * 1.25, -H * 0.26], [L * 1.55, -H * 0.15], [L * 1.35, H * 0.35]], '#18181b');
        disc([L * 0.78, -H * 0.22], R * 0.013, '#ffffff', '#0f172a', R * 0.005);
      }
      else if (theme === 'frontier') {
        poly([[-L * 0.75, 0], [-L * 1.38, -H * 0.42], [-L * 1.32, H * 0.32]], '#f8fafc', '#451a03', R * 0.006);
        ctx.fillStyle = '#4a3320';
        ctx.beginPath(); ctx.ellipse(-L * 0.05, 0, L * 0.92, H * 0.80, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath(); ctx.arc(L * 0.78, -H * 0.12, H * 0.62, 0, TAU); ctx.fill();
        poly([[L * 1.18, -H * 0.32], [L * 1.58, -H * 0.05], [L * 1.35, H * 0.28], [L * 1.12, H * 0.10]], '#f59e0b', '#78350f', R * 0.006);
        disc([L * 0.92, -H * 0.20], R * 0.011, '#0f172a');
      }
      else if (theme === 'medieval' || theme === 'gothic' || theme === 'fiesta') {
        ctx.strokeStyle = shade(col, -0.2); ctx.lineWidth = H * 0.32;
        ctx.beginPath(); ctx.moveTo(-L * 0.75, 0); ctx.quadraticCurveTo(-L * 1.35, -H * 0.65, -L * 1.55, -H * 0.15); ctx.stroke();
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.ellipse(0, 0, L * 0.92, H * 0.80, 0, 0, TAU); ctx.fill();
        if (theme === 'fiesta') {
          [-0.35, 0.05, 0.38].forEach(dx => disc([dx * L, H * 0.25], R * 0.012, '#fde047'));
        }
        poly([[L * 0.65, -H * 0.48], [L * 1.42, -H * 0.25], [L * 1.35, H * 0.25], [L * 0.65, H * 0.32]], col, shade(col, -0.35), R * 0.007);
        line([L * 0.78, -H * 0.42], [L * 0.48, -H * 1.05], '#f5c542', R * 0.012);
        disc([L * 0.98, -H * 0.22], R * 0.012, theme === 'gothic' ? '#ef4444' : '#fde047');
      }
      else if (theme === 'nordic') {
        ctx.fillStyle = '#5a361a';
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = R * 0.009;
        ctx.beginPath(); ctx.ellipse(0, H * 0.1, L * 1.02, H * 0.76, 0, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = R * 0.022;
        ctx.beginPath(); ctx.moveTo(L * 0.85, 0); ctx.quadraticCurveTo(L * 1.35, -H * 0.5, L * 1.15, -H * 1.25); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-L * 0.85, 0); ctx.quadraticCurveTo(-L * 1.25, -H * 0.4, -L * 1.05, -H * 1.05); ctx.stroke();
        [-0.52, -0.18, 0.18, 0.52].forEach((sx, si) => {
          disc([sx * L, H * 0.28], R * 0.021, si % 2 ? '#b91c1c' : '#0284c7', '#fde047', R * 0.005);
        });
      }
      else if (theme === 'bavarian') {
        const bY = -H * 1.65;
        ctx.fillStyle = '#fef3c7';
        ctx.strokeStyle = '#d97706'; ctx.lineWidth = R * 0.01;
        ctx.beginPath(); ctx.ellipse(0, bY, L * 1.08, H * 0.78, 0, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(-L * 0.85, bY - H * 0.18, L * 1.7, H * 0.36);
        poly([[-L * 0.85, bY], [-L * 1.28, bY - H * 0.55], [-L * 1.15, bY + H * 0.45]], '#b91c1c', '#f59e0b', R * 0.006);
        line([-L * 0.45, bY + H * 0.65], [-L * 0.35, -H * 0.2], '#78350f', R * 0.01);
        line([ L * 0.45, bY + H * 0.65], [ L * 0.35, -H * 0.2], '#78350f', R * 0.01);
        ctx.fillStyle = '#92400e';
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = R * 0.009;
        ctx.beginPath(); ctx.ellipse(0, H * 0.15, L * 0.78, H * 0.65, 0, 0, TAU); ctx.fill(); ctx.stroke();
      }
      else {
        poly([[-L * 0.65, -H * 0.1], [-L * 1.25, -H * 1.05], [-L * 0.95, H * 0.25]], shade(col, -0.22), '#0f172a', R * 0.007);
        if (theme === 'western') {
          poly([[-L * 0.95, -H * 0.15], [-L * 1.55, 0], [-L * 0.95, H * 0.25]], '#f97316');
        }
        ctx.fillStyle = shade(col, -0.32);
        ctx.beginPath(); ctx.ellipse(0, H * 0.16, L * 0.98, H * 0.82, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.ellipse(0, 0, L * 0.98, H * 0.80, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = R * 0.012;
        ctx.beginPath(); ctx.moveTo(-L * 0.75, H * 0.12); ctx.lineTo(L * 0.82, H * 0.12); ctx.stroke();
        if (theme === 'western' || theme === 'alps') {
          const prLen = H * 0.95 * Math.cos(tm * 18 + p.k);
          line([L * 1.02, -H * 0.25 - prLen], [L * 1.02, -H * 0.25 + prLen], '#e2e8f0', R * 0.012);
          disc([L * 1.02, -H * 0.25], R * 0.014, '#f59e0b');
        }
        if (theme === 'alps') {
          line([-L * 0.65, H * 0.88], [L * 0.75, H * 0.88], '#78350f', R * 0.014);
          line([L * 0.75, H * 0.88], [L * 0.95, H * 0.62], '#78350f', R * 0.014);
        }
      }

      // Cockpit & Riders
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.ellipse(0, -H * 0.18, L * 0.54, H * 0.44, 0, 0, TAU); ctx.fill();
      [-0.24, 0.18].forEach((rx, rIdx) => {
        const px = rx * L, py = -H * 0.35;
        ctx.fillStyle = ['#38bdf8', '#ef4444', '#22c55e', '#facc15', '#a855f7', '#f97316'][(p.k * 2 + rIdx) % 6];
        ctx.fillRect(px - R * 0.016, py - R * 0.01, R * 0.032, R * 0.034);
        disc([px, py - R * 0.022], R * 0.021, '#fde4c8');
      });
      line([L * 0.38, -H * 0.15], [L * 0.48, -H * 0.62], '#e2e8f0', R * 0.008);
      disc([L * 0.48, -H * 0.62], R * 0.010, '#ef4444');

      // Near Wing / Flapping Front Ear
      if (theme === 'classic') {
        ctx.fillStyle = '#cbd5e1';
        ctx.strokeStyle = '#64748b'; ctx.lineWidth = R * 0.007;
        ctx.beginPath(); ctx.ellipse(L * 0.28, H * 0.22 + flap, L * 0.48, H * 0.62, 0.25, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#f472b6';
        ctx.beginPath(); ctx.ellipse(L * 0.28, H * 0.26 + flap, L * 0.32, H * 0.42, 0.25, 0, TAU); ctx.fill();
      } else if (theme === 'jungle' || theme === 'frontier' || theme === 'gothic' || theme === 'medieval' || theme === 'fiesta') {
        const wCol = theme === 'jungle' ? '#facc15' : theme === 'frontier' ? '#5a3b22' : theme === 'gothic' ? '#7f1d1d' : shade(col, 0.15);
        poly([[L * 0.15, H * 0.15], [-L * 0.35, H * 1.15 + flap], [L * 0.45, H * 0.75 + flap * 0.5]], wCol, '#0f172a', R * 0.007);
      } else if (theme === 'space') {
        poly([[L * 0.22, -H * 0.18], [L * 0.65, -H * 0.18], [L * 0.42, -H * 0.58], [L * 0.12, -H * 0.52]], 'rgba(56,189,248,0.68)', '#e2e8f0', R * 0.006);
        poly([[L * 0.25, H * 0.18], [-L * 0.58, H * 0.95], [L * 0.32, H * 0.52]], '#cbd5e1', '#0284c7', R * 0.007);
        line([-L * 0.72, H * 0.95], [-L * 0.18, H * 0.95], '#e879f9', R * 0.014);
      } else if (theme === 'unthemed' || theme === 'western' || theme === 'alps') {
        poly([[L * 0.15, H * 0.2], [-L * 0.45, H * 0.92], [L * 0.35, H * 0.55]], shade(col, 0.18), '#0f172a', R * 0.007);
      }
    }

    ctx.restore();
  };

  // Pass A: Draw Back-Half Arms & Flying Vehicles (key < 0)
  pods.filter(p => p.key < 0).sort((u, v) => u.key - v.key).forEach(drawArmAndVehicle);

  // =========================================================================
  // 5. CENTRAL SCULPTED HUB DRUM & BESPOKE THEMED TOWER CROWN (24 SKINS!)
  // =========================================================================
  const Zbase = z0;
  const Z1    = Zbase + r(0.055);
  const Zc0   = Zhub - r(0.032);
  const Zc1   = Zhub + r(0.032);
  const Ztop  = r(0.48);

  if (theme === 'retro_future') {
    // 1. RETRO-FUTURE: Tomorrowland Astro-Orbiter Chrome Rocket Gantry + MOVING SOLAR SYSTEM MODEL ON TOP!
    cyl(r(0.22), Zbase, r(0.055), '#e2e8f0', '#f97316');
    cyl(r(0.148), Z1, Zc0 - Z1, '#f8fafc', '#0284c7');
    cylStripes(r(0.150), Z1, Zc0, 8, '#f8fafc', '#f97316', rot * 0.5);
    cyl(Rcol, Zc0, Zc1 - Zc0, '#f97316', '#0f172a', true);
    cyl(r(0.148), Zc1, Ztop - Zc1, '#f8fafc', '#0284c7');
    cylStripes(r(0.150), Zc1, Ztop, 8, '#f8fafc', '#06b6d4', rot * 0.5);
    cyl(r(0.195), Ztop, r(0.045), '#0f172a', '#f97316');
    const cSol = P(0, 0, Ztop + r(0.24));
    line(P(0, 0, Ztop + r(0.045)), cSol, '#cbd5e1', R * 0.018);

    // MOVING SOLAR SYSTEM MODEL (Astro-Orbiter Kinetic Orrery!)
    const orbits = [
      { rx: r(0.15), ry: r(0.062), tilt:  0.22, speed: 2.6, phase: 0.4, pCol: '#38bdf8', pRad: r(0.020), hasRing: false },
      { rx: r(0.22), ry: r(0.092), tilt: -0.18, speed: 1.8, phase: 2.1, pCol: '#ef4444', pRad: r(0.024), hasRing: false },
      { rx: r(0.29), ry: r(0.120), tilt:  0.14, speed: 1.2, phase: 4.0, pCol: '#f59e0b', pRad: r(0.030), hasRing: true  },
      { rx: r(0.35), ry: r(0.145), tilt: -0.10, speed: 0.8, phase: 1.3, pCol: '#a855f7', pRad: r(0.022), hasRing: false }
    ];

    orbits.forEach(ob => {
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.55)';
      ctx.lineWidth = R * 0.008;
      ctx.beginPath();
      ctx.ellipse(cSol[0], cSol[1], ob.rx, ob.ry, ob.tilt, 0, TAU);
      ctx.stroke();
    });

    disc(cSol, r(0.068), 'rgba(251, 146, 60, 0.35)');
    disc(cSol, r(0.046), '#facc15', '#ea580c', R * 0.008);
    disc([cSol[0] - r(0.012), cSol[1] - r(0.012)], r(0.016), '#fef9c3');

    orbits.forEach(ob => {
      const ang = tm * ob.speed + ob.phase;
      const lx = ob.rx * Math.cos(ang);
      const ly = ob.ry * Math.sin(ang);
      const ct = Math.cos(ob.tilt), st = Math.sin(ob.tilt);
      const px = cSol[0] + lx * ct - ly * st;
      const py = cSol[1] + lx * st + ly * ct;
      disc([px, py], ob.pRad, ob.pCol, '#ffffff', R * 0.005);
      if (ob.hasRing) {
        ctx.strokeStyle = '#fde047'; ctx.lineWidth = R * 0.007;
        ctx.beginPath(); ctx.ellipse(px, py, ob.pRad * 1.85, ob.pRad * 0.65, -0.35, 0, TAU); ctx.stroke();
      }
    });
  }
  else if (theme === 'tiki') {
    // 2. TIKI: Multi-Tiered Carved Polynesian Tiki Totem + Blazing Tiki Torches + Erupting Volcanic Caldera!
    // Volcanic basalt rock base & bamboo outrigger crossbeams
    cyl(r(0.24), Zbase, r(0.065), '#3e2716', '#22c55e');
    // Flanking bamboo tiki torches on left & right of plinth
    [-1, 1].forEach(side => {
      const pBase = P(side * r(0.24), -side * r(0.12), Zbase + r(0.04));
      const pTop  = [pBase[0] + side * r(0.03), pBase[1] - r(0.22)];
      line(pBase, pTop, '#8a5a33', R * 0.014);
      const flk = Math.sin(tm * 9 + side) * r(0.008);
      disc([pTop[0], pTop[1] - r(0.01)], r(0.028) + flk, '#f97316');
      disc([pTop[0], pTop[1] - r(0.02)], r(0.015), '#fef08a');
    });
    // Lower carved Tiki mask tier
    cyl(r(0.168), Z1, Zc0 - Z1, '#6b4423', '#3e2716');
    // Woven grass-skirt & bamboo rotating hub collar
    cyl(Rcol, Zc0, Zc1 - Zc0, '#15803d', '#facc15', true);
    // Upper Giant Carved Tiki Idol Face Column!
    const zFaceTop = Ztop + r(0.06);
    cyl(r(0.172), Zc1, zFaceTop - Zc1, '#78350f', '#3e2716');
    // Carved geometric brow ridge, glowing ember eyes & wide toothy Tiki grin
    const pEyeL = P(r(0.05), r(0.16), Zc1 + (zFaceTop - Zc1) * 0.68);
    const pEyeR = P(r(0.16), r(0.05), Zc1 + (zFaceTop - Zc1) * 0.68);
    disc(pEyeL, r(0.030), '#facc15', '#dc2626', R * 0.006);
    disc(pEyeR, r(0.030), '#facc15', '#dc2626', R * 0.006);
    const pMouth = P(r(0.12), r(0.12), Zc1 + (zFaceTop - Zc1) * 0.28);
    ell(pMouth, r(0.10), '#dc2626', '#fef08a', R * 0.006);
    // Erupting Volcanic Rock Caldera Crown with glowing lava streaks & rising smoke puffs!
    cone(r(0.24), zFaceTop, r(0.18), '#292524', '#ea580c');
    const cVolc = P(0, 0, zFaceTop + r(0.16));
    ell(cVolc, r(0.095), '#f97316', '#fef08a', R * 0.006);
    // Animated volcanic lava sparks & smoke puffs
    const sLift = ((tm * 0.45) % 1) * r(0.18);
    disc([cVolc[0] + Math.sin(tm * 3) * r(0.03), cVolc[1] - r(0.04) - sLift], r(0.032), 'rgba(148, 163, 184, 0.55)');
    disc([cVolc[0] - Math.cos(tm * 4) * r(0.04), cVolc[1] - r(0.02) - sLift * 0.6], r(0.018), '#facc15');
  }
  else if (theme === 'americana') {
    // 3. AMERICANA: 1893 World's Fair White & Crimson Victorian Gazebo + Rotating Brass Hot-Air Balloon Finial!
    cyl(r(0.24), Zbase, r(0.065), '#f8fafc', '#b91c1c');
    // Fluted ivory & crimson Victorian pavilion columns
    cyl(r(0.155), Z1, Zc0 - Z1, '#fbf6e8', '#1d3557');
    cylStripes(r(0.157), Z1, Zc0, 8, '#fbf6e8', '#b91c1c', rot * 0.5);
    // Patriotic bunting & brass rotating hub collar
    cyl(Rcol, Zc0, Zc1 - Zc0, '#1d3557', '#facc15', true);
    // Upper Victorian gazebo arcade with stained-glass transoms
    cyl(r(0.158), Zc1, Ztop - Zc1, '#fbf6e8', '#1d3557');
    cyl(r(0.22), Ztop, r(0.05), '#b91c1c', '#facc15');
    // Scalloped Victorian cupola dome
    const ap = cone(r(0.24), Ztop + r(0.05), r(0.18), '#1d3557', '#facc15');
    // Rotating Miniature Victorian Hot-Air Balloon & Brass Weathervane Finial on top!
    const bCenter = P(0, 0, Ztop + r(0.36));
    line(ap, bCenter, '#facc15', R * 0.016);
    disc(bCenter, r(0.072), '#e11d48', '#facc15', R * 0.008);
    ctx.fillStyle = '#fffbeb';
    ctx.beginPath(); ctx.ellipse(bCenter[0] + Math.sin(tm * 2) * r(0.018), bCenter[1], r(0.032), r(0.070), 0, 0, TAU); ctx.fill();
    // Miniature brass balloon basket & top spire
    ctx.fillStyle = '#78350f';
    ctx.fillRect(bCenter[0] - r(0.022), bCenter[1] + r(0.078), r(0.044), r(0.028));
    line([bCenter[0], bCenter[1] - r(0.072)], [bCenter[0], bCenter[1] - r(0.13)], '#facc15', R * 0.012);
  }
  else if (theme === 'caribbean') {
    // 4. CARIBBEAN: Full-Rigged Galleon Mainmast, Rope Shrouds, Crow's Nest, Billowing Sail & Jolly Roger!
    // Oak deck capstan & coiled rope base
    cyl(r(0.24), Zbase, r(0.065), '#451a03', '#facc15');
    cyl(r(0.135), Z1, Zc0 - Z1, '#78350f', '#3e2716');
    // Brass-bound ship's wheel & capstan hub collar
    cyl(Rcol, Zc0, Zc1 - Zc0, '#b45309', '#facc15', true);
    // Upper ship mainmast rising into the crow's nest
    const zNest = Ztop - r(0.02);
    const zMastTop = Ztop + r(0.42);
    cyl(r(0.112), Zc1, zNest - Zc1, '#8a5a33', '#3e2716');
    // Diagonal rope ratline shrouds on left & right of mast
    [-1, 1].forEach(side => {
      const pBot = P(side * r(0.20), -side * r(0.08), Zc1);
      const pTop = P(side * r(0.12), -side * r(0.05), zNest);
      line(pBot, pTop, '#d9b27a', R * 0.008);
      for (let rIdx = 1; rIdx <= 3; rIdx++) {
        const mPt = lerp(pBot, pTop, rIdx / 4);
        line(mPt, P(0, 0, Zc1 + (zNest - Zc1) * (rIdx / 4)), '#b45309', R * 0.005);
      }
    });
    // Timber Crow's Nest lookout platform with brass railing & swinging lanterns
    cyl(r(0.195), zNest, r(0.060), '#5a3b22', '#facc15');
    [-1, 1].forEach(side => {
      const pLan = P(side * r(0.22), side * r(0.08), zNest - r(0.02));
      disc([pLan[0], pLan[1] + r(0.02)], r(0.018), '#fef08a', '#b45309', R * 0.004);
    });
    // Topmast, horizontal yardarm spar with furled pirate sail & fluttering Jolly Roger skull flag!
    cyl(r(0.072), zNest + r(0.060), zMastTop - (zNest + r(0.060)), '#8a5a33', '#3e2716');
    const pYard = P(0, 0, zNest + r(0.20));
    line([pYard[0] - r(0.28), pYard[1] - r(0.07)], [pYard[0] + r(0.28), pYard[1] + r(0.07)], '#451a03', R * 0.017);
    poly([
      [pYard[0] - r(0.24), pYard[1] - r(0.06)],
      [pYard[0] + r(0.24), pYard[1] + r(0.06)],
      [pYard[0] + r(0.16), pYard[1] + r(0.16)],
      [pYard[0] - r(0.16), pYard[1] + r(0.04)]
    ], '#fef3c7', '#78350f', R * 0.006);
    const ft = P(0, 0, zMastTop);
    const waveF = Math.sin(tm * 6) * r(0.012);
    poly([ft, [ft[0] + r(0.15), ft[1] + r(0.02) + waveF], [ft[0], ft[1] + r(0.08)]], '#0f172a', '#ef4444', R * 0.006);
    disc([ft[0] + r(0.05), ft[1] + r(0.036)], r(0.015), '#ffffff');
  }
  else if (theme === 'china') {
    // 5. CHINA: Tiered Vermilion & Gold Imperial Pagoda Pavilion + Hanging Red Lanterns + Golden Dragon Finial!
    cyl(r(0.24), Zbase, r(0.065), '#991b1b', '#facc15');
    cyl(r(0.158), Z1, Zc0 - Z1, '#dc2626', '#facc15');
    cyl(Rcol, Zc0, Zc1 - Zc0, '#facc15', '#991b1b', true);
    cyl(r(0.158), Zc1, Ztop - Zc1, '#dc2626', '#facc15');
    // Lower Wide Pagoda Eave Roof with Hanging Red Silk Lanterns
    cone(r(0.28), Ztop, r(0.14), '#1e293b', '#facc15');
    [-1, 1].forEach(side => {
      const pEave = P(side * r(0.24), side * r(0.10), Ztop);
      disc([pEave[0], pEave[1] + r(0.025)], r(0.020), '#ef4444', '#facc15', R * 0.005);
      line([pEave[0], pEave[1] + r(0.045)], [pEave[0], pEave[1] + r(0.075)], '#facc15', R * 0.006);
    });
    // Second Pagoda Tier & Coiled Golden Dragon Pearl Finial
    cyl(r(0.125), Ztop + r(0.08), r(0.09), '#dc2626', '#facc15');
    const ap = cone(r(0.20), Ztop + r(0.16), r(0.15), '#0f172a', '#facc15');
    const ft = P(0, 0, Ztop + r(0.38));
    line(ap, ft, '#facc15', R * 0.018);
    disc(ft, r(0.032), '#facc15', '#dc2626', R * 0.006);
  }
  else if (theme === 'japan') {
    // 6. JAPAN: Multi-Tiered Edo Castle Dojo Tower with Stone Ishigaki Base, Crimson Torii Portals & Shachihoko Roof!
    // Sloped castle stone ishigaki foundation
    cone(r(0.27), Zbase, r(0.085), '#64748b', '#1e293b');
    cyl(r(0.158), Z1, Zc0 - Z1, '#f8fafc', '#1e293b');
    // Vermilion Torii-beam & gold rotating hub collar
    cyl(Rcol, Zc0, Zc1 - Zc0, '#dc2626', '#0f172a', true);
    // Upper white-plaster & dark-timber Dojo wall + miniature crimson Torii portal frame
    cyl(r(0.158), Zc1, Ztop - Zc1, '#f8fafc', '#1e293b');
    const pTorii = P(r(0.11), r(0.11), Zc1 + (Ztop - Zc1) * 0.55);
    line([pTorii[0] - r(0.07), pTorii[1] - r(0.04)], [pTorii[0] + r(0.07), pTorii[1] - r(0.04)], '#dc2626', R * 0.014);
    line([pTorii[0] - r(0.05), pTorii[1] - r(0.04)], [pTorii[0] - r(0.05), pTorii[1] + r(0.05)], '#dc2626', R * 0.010);
    line([pTorii[0] + r(0.05), pTorii[1] - r(0.04)], [pTorii[0] + r(0.05), pTorii[1] + r(0.05)], '#dc2626', R * 0.010);
    // Double-tiered dark slate Irimoya Dojo Roof + Golden Shachihoko Carp Finials
    cone(r(0.26), Ztop, r(0.14), '#1e293b', '#facc15');
    const ap = cone(r(0.19), Ztop + r(0.12), r(0.16), '#0f172a', '#facc15');
    const ft = P(0, 0, Ztop + r(0.35));
    line(ap, ft, '#facc15', R * 0.016);
    disc(ft, r(0.028), '#facc15', '#dc2626', R * 0.006);
  }
  else if (theme === 'egypt') {
    // 7. EGYPT: Fluted Karnak Lotus Temple Column + Seated Golden Pharaoh Emperor Monument on Top!
    cyl(r(0.24), Zbase, r(0.065), '#b45309', '#1d4ed8');
    cyl(r(0.158), Z1, Zc0 - Z1, '#eab308', '#78350f');
    cyl(Rcol, Zc0, Zc1 - Zc0, '#1d4ed8', '#facc15', true);
    cyl(r(0.158), Zc1, Ztop - Zc1, '#eab308', '#78350f');
    // Flared Lotus Capital & Throne Pedestal
    cyl(r(0.22), Ztop, r(0.055), '#facc15', '#1d4ed8');
    // Monumental Gilded Pharaoh Emperor Statue (Throne, Golden Robes, Crook & Flail, Striped Nemes Headdress & Double Crown!)
    const zStat = Ztop + r(0.055);
    cyl(r(0.13), zStat, r(0.10), '#1d4ed8', '#facc15'); // Lapis throne base
    cyl(r(0.088), zStat + r(0.06), r(0.16), '#facc15', '#78350f'); // Pharaoh's gilded torso & kilt
    // Crossed golden royal crook & flail on chest
    const pChest = P(r(0.05), r(0.05), zStat + r(0.16));
    line([pChest[0] - r(0.03), pChest[1] - r(0.03)], [pChest[0] + r(0.03), pChest[1] + r(0.03)], '#fef08a', R * 0.010);
    line([pChest[0] + r(0.03), pChest[1] - r(0.03)], [pChest[0] - r(0.03), pChest[1] + r(0.03)], '#fef08a', R * 0.010);
    // Pharaoh's Head with Blue-and-Gold Striped Nemes Headdress & Red/White Double Crown (Pschent)
    const pHead = P(0, 0, zStat + r(0.26));
    poly([
      [pHead[0] - r(0.080), pHead[1] + r(0.055)],
      [pHead[0] - r(0.055), pHead[1] - r(0.065)],
      [pHead[0] + r(0.055), pHead[1] - r(0.065)],
      [pHead[0] + r(0.080), pHead[1] + r(0.055)]
    ], '#1d4ed8', '#facc15', R * 0.007);
    disc(pHead, r(0.046), '#fde047', '#78350f', R * 0.006);
    // Double Crown & Uraeus Cobra
    disc([pHead[0], pHead[1] - r(0.072)], r(0.026), '#dc2626', '#facc15', R * 0.005);
    disc([pHead[0], pHead[1] - r(0.095)], r(0.016), '#ffffff', '#facc15', R * 0.004);
  }
  else if (theme === 'babylon') {
    // 8. BABYLON: Cobalt-Blue Glazed Ishtar Ziggurat Tower + Striding Golden Lion of Babylon Statue on Top!
    cyl(r(0.24), Zbase, r(0.065), '#172554', '#facc15');
    cyl(r(0.162), Z1, Zc0 - Z1, '#1d4ed8', '#facc15');
    cyl(Rcol, Zc0, Zc1 - Zc0, '#facc15', '#172554', true);
    cyl(r(0.162), Zc1, Ztop - Zc1, '#1d4ed8', '#facc15');
    // Gold Ishtar rosette medallions around the upper lapis drum
    [-0.5, 0.2, 0.9].forEach(ang => {
      const pRos = g(r(0.165), ang, Zc1 + (Ztop - Zc1) * 0.52);
      disc(pRos, r(0.018), '#facc15', '#ffffff', R * 0.004);
    });
    // Stepped Ziggurat Pedestal
    cyl(r(0.22), Ztop, r(0.050), '#1e3a8a', '#facc15');
    cyl(r(0.17), Ztop + r(0.050), r(0.045), '#facc15', '#172554');
    // Monumental Striding Golden Lion of Babylon Statue on Top!
    const zLion = Ztop + r(0.095);
    const pLion = P(0, 0, zLion + r(0.085));
    // Striding lion legs & curled tail
    line([pLion[0] - r(0.09), pLion[1] + r(0.02)], [pLion[0] - r(0.11), pLion[1] + r(0.095)], '#d97706', R * 0.014);
    line([pLion[0] - r(0.04), pLion[1] + r(0.02)], [pLion[0] - r(0.03), pLion[1] + r(0.095)], '#b45309', R * 0.013);
    line([pLion[0] + r(0.06), pLion[1] + r(0.02)], [pLion[0] + r(0.07), pLion[1] + r(0.095)], '#b45309', R * 0.013);
    line([pLion[0] + r(0.09), pLion[1] + r(0.02)], [pLion[0] + r(0.12), pLion[1] + r(0.095)], '#d97706', R * 0.014);
    line([pLion[0] - r(0.12), pLion[1] - r(0.01)], [pLion[0] - r(0.16), pLion[1] - r(0.08)], '#facc15', R * 0.010);
    // Muscular golden lion torso, shaggy mane & roaring head
    ctx.fillStyle = '#facc15'; ctx.strokeStyle = '#78350f'; ctx.lineWidth = R * 0.007;
    ctx.beginPath(); ctx.ellipse(pLion[0], pLion[1], r(0.135), r(0.065), -0.06, 0, TAU); ctx.fill(); ctx.stroke();
    disc([pLion[0] + r(0.095), pLion[1] - r(0.042)], r(0.062), '#eab308', '#78350f', R * 0.007);
    disc([pLion[0] + r(0.132), pLion[1] - r(0.048)], r(0.038), '#fef08a', '#78350f', R * 0.005);
  }
  else if (theme === 'galactic_outpost') {
    // 9. GALACTIC OUTPOST: Multi-Story Armored Batuu Outpost Building / Hangar Bunker + Rotating Radar Dish!
    // Heavy octagonal armored bunker base with blast-door bay
    cyl(r(0.25), Zbase, r(0.085), '#292524', '#ea580c');
    cyl(r(0.178), Z1, Zc0 - Z1, '#64748b', '#1e293b');
    // Rust-orange & durasteel rotating hydraulic collar
    cyl(Rcol, Zc0, Zc1 - Zc0, '#ea580c', '#0f172a', true);
    // Upper Armored Outpost Control Bunker with Glowing Slit Viewports & External Cooling Pipes
    cyl(r(0.175), Zc1, Ztop - Zc1, '#475569', '#1e293b');
    const pWin = P(r(0.11), r(0.11), Zc1 + (Ztop - Zc1) * 0.55);
    ell(pWin, r(0.095), '#38bdf8', '#0f172a', R * 0.005);
    // Bunker Roof Deck, Communications Spire & Rotating Radar Dish
    cyl(r(0.225), Ztop, r(0.075), '#334155', '#ea580c');
    const cRad = P(0, 0, Ztop + r(0.20));
    line(P(0, 0, Ztop + r(0.075)), cRad, '#94a3b8', R * 0.020);
    ctx.fillStyle = '#cbd5e1'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = R * 0.008;
    ctx.beginPath(); ctx.ellipse(cRad[0], cRad[1], r(0.18), r(0.095), Math.sin(tm * 1.5) * 0.45, 0, TAU); ctx.fill(); ctx.stroke();
    line(cRad, [cRad[0], cRad[1] - r(0.11)], '#f97316', R * 0.012);
    disc([cRad[0], cRad[1] - r(0.12)], r(0.022), '#38bdf8', '#ffffff', R * 0.004);
  }
  else if (theme === 'jurassic_island') {
    // 10. JURASSIC ISLAND: Isla Nublar Airfield Control Tower with Angled Glass Cab, Catwalk & Beacon!
    cyl(r(0.24), Zbase, r(0.065), '#44403c', '#eab308');
    // Concrete & timber-braced control tower shaft with yellow/black hazard stripes
    cyl(r(0.148), Z1, Zc0 - Z1, '#78716c', '#292524');
    cyl(Rcol, Zc0, Zc1 - Zc0, '#eab308', '#15803d', true);
    cyl(r(0.148), Zc1, Ztop - Zc1, '#57534e', '#292524');
    // Exterior Steel Catwalk Balcony Ring around Observation Cab
    cyl(r(0.245), Ztop - r(0.02), r(0.030), '#334155', '#eab308');
    // Panoramic Green-Tinted Glass Air-Traffic Control Tower Cab
    cyl(r(0.215), Ztop + r(0.01), r(0.105), '#15803d', '#eab308');
    cyl(r(0.198), Ztop + r(0.03), r(0.070), '#38bdf8', '#0f172a');
    // Control Tower Roof, Rotating Radar Bar & Flashing Red Aviation Beacon
    const ap = cone(r(0.238), Ztop + r(0.115), r(0.10), '#eab308', '#15803d');
    const ft = P(0, 0, Ztop + r(0.35));
    line(ap, ft, '#e2e8f0', R * 0.015);
    const radW = r(0.13) * Math.cos(tm * 3.5);
    line([ap[0] - radW, ap[1] - r(0.05)], [ap[0] + radW, ap[1] - r(0.05)], '#facc15', R * 0.014);
    disc(ft, r(0.028), '#ef4444', '#fef08a', R * 0.005);
  }
  else if (theme === 'ancient_rome') {
    // 11. ANCIENT ROME: Clean Travertine Corinthian Column (Attic Base, Fluted Shaft, Acanthus Capital & Abacus — Nothing on Top!)
    const mBase = '#e7e5e4', mShaft = '#f5f5f4', mEdge = '#78716c', mTrim = '#b91c1c';
    // Stepped square stylobate & Attic torus-scotia-torus molded base
    cyl(r(0.25), Zbase, r(0.035), mBase, mEdge);
    cyl(r(0.21), Zbase + r(0.035), r(0.030), mShaft, mEdge);
    // Lower fluted Corinthian shaft (24 vertical concave flutes wrapped across front arc)
    cyl(r(0.162), Z1, Zc0 - Z1, mShaft, mEdge);
    for (let i = -4; i <= 4; i++) {
      const a = Math.PI * 0.25 + i * 0.14;
      line(g(r(0.163), a, Z1 + r(0.008)), g(r(0.163), a, Zc0 - r(0.006)), '#d6d3d1', R * 0.006);
    }
    // Crimson & gold rotating arm-hub collar
    cyl(Rcol, Zc0, Zc1 - Zc0, mTrim, '#facc15', true);
    // Upper fluted Corinthian shaft
    const zCap0 = Ztop - r(0.015);
    cyl(r(0.162), Zc1, zCap0 - Zc1, mShaft, mEdge);
    for (let i = -4; i <= 4; i++) {
      const a = Math.PI * 0.25 + i * 0.14;
      line(g(r(0.163), a, Zc1 + r(0.008)), g(r(0.163), a, zCap0 - r(0.006)), '#d6d3d1', R * 0.006);
    }
    // Astragal necking ring + Bell-shaped Corinthian Acanthus Capital + Corner Volute Scrolls + Clean Abacus Slab
    cyl(r(0.176), zCap0, r(0.018), '#e7e5e4', mEdge);
    cyl(r(0.195), zCap0 + r(0.018), r(0.055), mShaft, mEdge);
    // Two staggered tiers of carved acanthus leaves around the bell
    for (let row = 0; row < 2; row++) {
      const zLeaf = zCap0 + r(0.022 + row * 0.024);
      const nLeaves = 7;
      for (let k = 0; k < nLeaves; k++) {
        const a = -Math.PI * 0.22 + (k + row * 0.5) * (Math.PI * 0.92 / nLeaves);
        const pL = g(r(0.198), a, zLeaf);
        ell(pL, r(0.024), row === 0 ? '#e7e5e4' : '#ffffff', mEdge, R * 0.004);
      }
    }
    // Corner volute spirals & molded flat abacus top slab (completely bare on top)
    [-0.18, 0.25, 0.68].forEach(a => {
      const pVol = g(r(0.212), a, zCap0 + r(0.070));
      disc(pVol, r(0.018), '#ffffff', mEdge, R * 0.005);
      disc(pVol, r(0.007), '#a8a29e');
    });
    cyl(r(0.232), zCap0 + r(0.073), r(0.032), mShaft, mEdge, true);
  }
  else if (theme === 'ancient_greece') {
    // 12. ANCIENT GREECE: Clean Pentelic White Marble Corinthian Column (Attic Base, Fluted Shaft, Acanthus Capital & Abacus — Nothing on Top!)
    const mBase = '#e2e8f0', mShaft = '#ffffff', mEdge = '#64748b', mTrim = '#0284c7';
    // Stepped marble stylobate & Attic molded base
    cyl(r(0.25), Zbase, r(0.035), mBase, mEdge);
    cyl(r(0.21), Zbase + r(0.035), r(0.030), mShaft, mEdge);
    // Lower fluted Pentelic marble shaft
    cyl(r(0.160), Z1, Zc0 - Z1, mShaft, mEdge);
    for (let i = -4; i <= 4; i++) {
      const a = Math.PI * 0.25 + i * 0.14;
      line(g(r(0.161), a, Z1 + r(0.008)), g(r(0.161), a, Zc0 - r(0.006)), '#cbd5e1', R * 0.006);
    }
    // Aegean-blue & gold rotating arm-hub collar
    cyl(Rcol, Zc0, Zc1 - Zc0, mTrim, '#facc15', true);
    // Upper fluted Pentelic marble shaft
    const zCap0 = Ztop - r(0.015);
    cyl(r(0.160), Zc1, zCap0 - Zc1, mShaft, mEdge);
    for (let i = -4; i <= 4; i++) {
      const a = Math.PI * 0.25 + i * 0.14;
      line(g(r(0.161), a, Zc1 + r(0.008)), g(r(0.161), a, zCap0 - r(0.006)), '#cbd5e1', R * 0.006);
    }
    // Astragal necking ring + Bell-shaped Corinthian Acanthus Capital + Corner Volute Scrolls + Clean Abacus Slab
    cyl(r(0.175), zCap0, r(0.018), '#e2e8f0', mEdge);
    cyl(r(0.194), zCap0 + r(0.018), r(0.055), mShaft, mEdge);
    for (let row = 0; row < 2; row++) {
      const zLeaf = zCap0 + r(0.022 + row * 0.024);
      const nLeaves = 7;
      for (let k = 0; k < nLeaves; k++) {
        const a = -Math.PI * 0.22 + (k + row * 0.5) * (Math.PI * 0.92 / nLeaves);
        const pL = g(r(0.197), a, zLeaf);
        ell(pL, r(0.024), row === 0 ? '#f1f5f9' : '#ffffff', mEdge, R * 0.004);
      }
    }
    [-0.18, 0.25, 0.68].forEach(a => {
      const pVol = g(r(0.210), a, zCap0 + r(0.070));
      disc(pVol, r(0.018), '#ffffff', mEdge, R * 0.005);
      disc(pVol, r(0.007), '#94a3b8');
    });
    cyl(r(0.230), zCap0 + r(0.073), r(0.032), mShaft, mEdge, true);
  }

  /* ==================== ORIGINAL 12 CENTRAL COLUMNS ==================== */
  else if (theme === 'unthemed') {
    cyl(r(0.20), Zbase, r(0.055), '#cbd5e1', '#64748b');
    cyl(r(0.148), Z1, Zc0 - Z1, '#f8fafc', '#94a3b8');
    cylStripes(r(0.150), Z1, Zc0, 8, '#f8fafc', accent, rot * 0.5);
    cyl(Rcol, Zc0, Zc1 - Zc0, accent, '#1e293b', true);
    cyl(r(0.148), Zc1, Ztop - Zc1, '#f8fafc', '#475569');
    cylStripes(r(0.150), Zc1, Ztop, 8, '#f8fafc', accent, rot * 0.5);
    cyl(r(0.18), Ztop, r(0.045), '#334155', '#f8fafc');
    const ap = cone(r(0.21), Ztop + r(0.045), r(0.19), accent, '#1e293b');
    const ft = P(0, 0, Ztop + r(0.32));
    line(ap, ft, '#facc15', R * 0.014);
    disc(ft, r(0.026), '#ef4444', '#ffffff', R * 0.006);
  }
  else if (theme === 'classic') {
    cyl(r(0.22), Zbase, r(0.055), '#b91c1c', '#f5c542');
    cyl(r(0.162), Z1, Zc0 - Z1, '#fef08a', '#f5c542');
    cylStripes(r(0.164), Z1, Zc0, 8, '#fffbeb', '#e11d48', rot * 0.5);
    cyl(Rcol, Zc0, Zc1 - Zc0, '#f5c542', '#b45309', true);
    cyl(r(0.162), Zc1, Ztop - Zc1, '#fef08a', '#b45309');
    cylStripes(r(0.164), Zc1, Ztop, 8, '#fffbeb', '#e11d48', rot * 0.5);
    cyl(r(0.205), Ztop, r(0.05), '#1e3a8a', '#f5c542');
    const ap = P(0, 0, Ztop + r(0.24));
    for (let i = 0; i < 12; i++) {
      const a0 = rot * 0.5 + i * TAU / 12, a1 = a0 + TAU / 12;
      poly([g(r(0.23), a0, Ztop + r(0.05)), g(r(0.23), a1, Ztop + r(0.05)), ap], i % 2 ? '#fffbeb' : '#e11d48', '#f5c542', R * 0.005);
    }
    const ft = P(0, 0, Ztop + r(0.35));
    line(ap, ft, '#f5c542', R * 0.018);
    disc(P(0, 0, Ztop + r(0.29)), r(0.036), '#f5c542', '#b45309', R * 0.007);
    poly([ft, [ft[0] + r(0.11), ft[1] + r(0.02)], [ft[0], ft[1] + r(0.055)]], '#2563eb', '#f5c542', R * 0.006);
  }
  else if (theme === 'space') {
    cyl(r(0.22), Zbase, r(0.055), '#0f172a', '#22d3ee');
    cyl(r(0.145), Z1, Zc0 - Z1, '#1e293b', '#38bdf8');
    cyl(Rcol, Zc0, Zc1 - Zc0, '#0284c7', '#22d3ee', true);
    cyl(r(0.145), Zc1, Ztop - Zc1, '#1e293b', '#22d3ee');
    cyl(r(0.18), Ztop, r(0.045), '#0f172a', '#22d3ee');
    const cSp = P(0, 0, Ztop + r(0.18));
    disc(cSp, r(0.092), '#f59e0b', '#fef08a', R * 0.01);
    ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = R * 0.016;
    ctx.beginPath(); ctx.ellipse(cSp[0], cSp[1], r(0.22), r(0.09), 0.35, 0, TAU); ctx.stroke();
    ctx.strokeStyle = '#f5c542'; ctx.lineWidth = R * 0.014;
    ctx.beginPath(); ctx.ellipse(cSp[0], cSp[1], r(0.19), r(0.15), -0.45, 0, TAU); ctx.stroke();
    disc([cSp[0] + Math.cos(tm * 3) * r(0.20), cSp[1] + Math.sin(tm * 3) * r(0.08)], r(0.024), '#e879f9', '#ffffff', R * 0.005);
    const ft = P(0, 0, Ztop + r(0.36));
    line(cSp, ft, '#e2e8f0', R * 0.015);
    disc(ft, r(0.024), '#22d3ee');
  }
  else if (theme === 'jungle' || theme === 'fiesta') {
    const cShaft = theme === 'jungle' ? '#bdb9a0' : '#f59e0b';
    cyl(r(0.22), Zbase, r(0.055), theme === 'jungle' ? '#8e8a72' : '#c2410c', '#eab308');
    cyl(r(0.16), Z1, Zc0 - Z1, cShaft, '#78350f');
    cyl(Rcol, Zc0, Zc1 - Zc0, '#0d9488', '#fde047', true);
    cyl(r(0.16), Zc1, Ztop - Zc1, cShaft, '#78350f');
    cyl(r(0.195), Ztop, r(0.05), '#eab308', '#78350f');
    const cSun = P(0, 0, Ztop + r(0.19));
    for (let k = 0; k < 10; k++) {
      const a = tm * 1.5 + k * TAU / 10;
      line(cSun, [cSun[0] + Math.cos(a) * r(0.16), cSun[1] + Math.sin(a) * r(0.16)], k % 2 ? '#f59e0b' : '#ef4444', R * 0.018);
    }
    disc(cSun, r(0.095), '#facc15', '#78350f', R * 0.01);
    disc([cSun[0] - r(0.03), cSun[1] - r(0.015)], r(0.016), '#0d9488');
    disc([cSun[0] + r(0.03), cSun[1] - r(0.015)], r(0.016), '#0d9488');
  }
  else if (theme === 'medieval' || theme === 'gothic') {
    const cMain = theme === 'gothic' ? '#27272a' : '#94a3b8';
    const cRoof = theme === 'gothic' ? '#09090b' : '#1d4ed8';
    const cCollar = theme === 'gothic' ? '#7f1d1d' : '#f5c542';
    cyl(r(0.22), Zbase, r(0.055), '#475569', '#1e293b');
    cyl(r(0.158), Z1, Zc0 - Z1, cMain, '#1e293b');
    cyl(Rcol, Zc0, Zc1 - Zc0, cCollar, '#1e293b', true);
    cyl(r(0.158), Zc1, Ztop - Zc1, cMain, '#1e293b');
    cyl(r(0.20), Ztop, r(0.055), shade(cMain, -0.18), cCollar);
    const ap = cone(r(0.23), Ztop + r(0.055), r(0.26), cRoof, cCollar);
    const ft = P(0, 0, Ztop + r(0.39));
    line(ap, ft, '#f5c542', R * 0.015);
    if (theme === 'medieval') {
      poly([ft, [ft[0] + r(0.12), ft[1] + r(0.02)], [ft[0], ft[1] + r(0.06)]], '#b91c1c', '#f5c542', R * 0.006);
    } else {
      disc(ft, r(0.028), '#dc2626');
    }
  }
  else {
    // Western, Frontier, Alps, Nordic, Bavarian
    cyl(r(0.22), Zbase, r(0.055), plinthCols[0], plinthCols[1]);
    cyl(r(0.155), Z1, Zc0 - Z1, armColors[1], armColors[0]);
    cylStripes(r(0.157), Z1, Zc0, 8, armColors[1], armColors[2], rot * 0.5);
    cyl(Rcol, Zc0, Zc1 - Zc0, armColors[2], armColors[0], true);
    cyl(r(0.155), Zc1, Ztop - Zc1, armColors[1], armColors[0]);
    cylStripes(r(0.157), Zc1, Ztop, 8, armColors[1], armColors[2], rot * 0.5);
    cyl(r(0.195), Ztop, r(0.05), armColors[0], '#f5c542');
    const ap = cone(r(0.22), Ztop + r(0.05), r(0.22), theme === 'alps' ? '#f8fafc' : armColors[2], '#f5c542');
    const ft = P(0, 0, Ztop + r(0.35));
    line(ap, ft, '#f5c542', R * 0.016);
    disc(ft, r(0.032), '#f59e0b', '#78350f', R * 0.007);
  }

  // Pass B: Draw Front-Half Arms & Flying Vehicles (key >= 0)
  pods.filter(p => p.key >= 0).sort((u, v) => u.key - v.key).forEach(drawArmAndVehicle);
}


NEW_SPRITE_PACKS.rides.flyer = { skins: FLYER_SKINS, draw: drawFlyerRide };
})();

(function () {

/* ===== SHARED HELPERS & ISOMETRIC 3D ENGINE (FR) ===== */
function shade(hex, amt) {
  if (!hex || hex[0] !== '#') return hex || '#888888';
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = c => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

const FR = {
  proj(cx, cy, S) { return (X, Y, Z) => [cx + (X - Y) * 0.7 * S, cy + (X + Y) * 0.35 * S - Z * S]; },
  poly(g, pts, fill, stroke, lw) {
    g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath();
    if (fill) { g.fillStyle = fill; g.fill(); g.strokeStyle = fill; g.lineWidth = 0.6; g.stroke(); }
    if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw || 1; g.lineJoin = 'round'; g.stroke(); }
  },
  ell(g, x, y, rx, ry, fill, stroke, lw) {
    g.beginPath(); g.ellipse(x, y, Math.max(0.4, rx), Math.max(0.4, ry), 0, 0, 7);
    if (fill) { g.fillStyle = fill; g.fill(); }
    if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw || 1; g.stroke(); }
  },
  ln(g, a, b, col, w) { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); },
  rbox(g, Pj, x0, y0, z0, l, w, h, psi, col, o) {
    o = o || {};
    const c = Math.cos(psi), s = Math.sin(psi), pts = [[-l / 2, -w / 2], [l / 2, -w / 2], [l / 2, w / 2], [-l / 2, w / 2]].map(([a, b]) => [x0 + a * c - b * s, y0 + a * s + b * c]), faces = [];
    for (let i = 0; i < 4; i++) {
      const A = pts[i], B = pts[(i + 1) % 4], dx = B[0] - A[0], dy = B[1] - A[1], m = Math.hypot(dx, dy) || 1, nx = dy / m, ny = -dx / m;
      if (nx + ny > 0.02) faces.push({ A, B, nx, ny, d: (A[0] + B[0] + A[1] + B[1]) / 2 });
    }
    faces.sort((p, q) => p.d - q.d).forEach(f => {
      const amt = Math.max(-0.5, Math.min(0.3, -0.12 + 0.14 * f.ny - 0.22 * f.nx));
      FR.poly(g, [Pj(f.A[0], f.A[1], z0), Pj(f.B[0], f.B[1], z0), Pj(f.B[0], f.B[1], z0 + h), Pj(f.A[0], f.A[1], z0 + h)], shade(col, amt), o.stroke, o.lw);
    });
    if (!o.noTop) FR.poly(g, pts.map(p => Pj(p[0], p[1], z0 + h)), o.top || shade(col, 0.16), o.stroke, o.lw);
  },
  hex(g, cx, cy, R, fill, stroke) {
    g.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 180 * (60 * i + 30); g[i ? 'lineTo' : 'moveTo'](cx + R * Math.cos(a), cy + R * Math.sin(a) * 0.58); } g.closePath();
    g.fillStyle = fill; g.fill(); g.lineWidth = Math.max(1.5, R * 0.03); g.strokeStyle = stroke; g.stroke();
  },
  layers(key, R, Wf, Hf, oyf, draw) {
    FR._c = FR._c || {}; if (FR._c[key]) return FR._c[key];
    const dpr = (typeof devicePixelRatio === 'number' && devicePixelRatio > 1) ? devicePixelRatio : 1;
    const sc = getCampusBakeScale(), W = Math.ceil(Wf * R), H = Math.ceil(Hf * R), oy = oyf * R, S = R * 0.066, res = { w: W, h: H, ox: W / 2, oy };
    ['back', 'hub', 'front', 'still'].forEach(p => {
      const cv = document.createElement('canvas'); cv.width = Math.ceil(W * sc); cv.height = Math.ceil(H * sc);
      const g = cv.getContext('2d'); g.scale(sc, sc); const Pj = FR.proj(W / 2, oy, S);
      if (p === 'still') { draw(g, Pj, S, 'back'); draw(g, Pj, S, 'cars_back', 0); draw(g, Pj, S, 'hub'); draw(g, Pj, S, 'cars_front', 0); draw(g, Pj, S, 'front'); }
      else draw(g, Pj, S, p);
      res[p] = cv;
    });
    return FR._c[key] = res;
  },
  render(ctx, cx, cy, R, key, Wf, Hf, oyf, draw, t) {
    const L = FR.layers(key, R, Wf, Hf, oyf, draw);
    if (t == null) { ctx.drawImage(L.still, cx - L.ox, cy - L.oy, L.w, L.h); return; }
    const S = R * 0.066, Pj = FR.proj(cx, cy, S), bl = n => ctx.drawImage(L[n], cx - L.ox, cy - L.oy, L.w, L.h);
    bl('back'); draw(ctx, Pj, S, 'cars_back', t); bl('hub'); draw(ctx, Pj, S, 'cars_front', t); bl('front');
  },
  atlas(S, w, h, ox, oy, n, fn) {
    const dpr = (typeof devicePixelRatio === 'number' && devicePixelRatio > 1) ? devicePixelRatio : 1;
    const sc = getCampusBakeScale(), cache = new Map();
    return function (i, psi) {
      const k = Math.round((((psi % 6.2832) + 6.2832) % 6.2832) / 6.2832 * n) % n, key = i * 1000 + k;
      let e = cache.get(key);
      if (!e) {
        const cv = document.createElement('canvas'); cv.width = Math.ceil(w * sc); cv.height = Math.ceil(h * sc);
        const g = cv.getContext('2d'); g.scale(sc, sc); fn(g, FR.proj(ox, oy, S), i, k / n * 6.2832);
        e = { cv, w, h, ox, oy };
        if (cache.size >= 48) cache.delete(cache.keys().next().value);
      } else {
        cache.delete(key);
      }
      cache.set(key, e);
      return e;
    };
  }
};
FR._d = {};

/* ===== CRAZY BUS / FLYING GONDOLA SKIN DEFINITIONS (UNTHEMED + 19 THEMES) ===== */
const CRAZY_BUS_SKINS = {
  unthemed: {
    id: 'unthemed', label: 'Unthemed (Tier 0–2)', name: 'Zamperla Crazy Bus', sub: 'Checkered Transit Plaza, Twin Towers & Cheerful 3D Bus',
    sign: 'CRAZY BUS', hex: '#9bbf63', border: '#f59e0b',
    plinth: '#cbd5e1', floor1: '#475569', floor2: '#334155', trim: '#facc15',
    tow: '#f8fafc', band1: '#ef4444', band2: '#3b82f6', crown: 'beacon',
    arm1: '#ef4444', arm2: '#facc15', cw: '#3b82f6'
  },

  /* === 8 NEW EXPANSION LANDS === */
  china: {
    id: 'china', label: 'China', name: 'Imperial Prayer Pavilion', sub: 'Vermilion Pagoda Pavilion, Silk Lanterns & Dragon Palanquin',
    sign: 'PRAYER PAVILION', hex: '#6e8b5e', border: '#dc2626', isNew: true,
    plinth: '#d6d3d1', floor1: '#15803d', floor2: '#991b1b', trim: '#facc15',
    tow: '#dc2626', band1: '#facc15', band2: '#1e293b', crown: 'pagoda',
    arm1: '#dc2626', arm2: '#facc15', cw: '#15803d'
  },
  japan: {
    id: 'japan', label: 'Japan', name: 'Edo Martial Arts Dojo', sub: 'Shoji Timber Dojo, Tatami Courtyard & Samurai Palanquin',
    sign: 'SHOGUN DOJO', hex: '#5d7a64', border: '#e11d48', isNew: true,
    plinth: '#78716c', floor1: '#84cc16', floor2: '#1e293b', trim: '#facc15',
    tow: '#f8fafc', band1: '#1e293b', band2: '#dc2626', crown: 'dojo_roof',
    arm1: '#1e293b', arm2: '#dc2626', cw: '#facc15'
  },
  ancient_rome: {
    id: 'ancient_rome', label: 'Ancient Rome', name: 'Roman Wagon Workshop', sub: 'Travertine Officina, Spoked Wheel Racks & Imperial War Chariot',
    sign: 'CHARIOT WORKS', hex: '#b89f7d', border: '#b91c1c', isNew: true,
    plinth: '#d6d3d1', floor1: '#e7e5e4', floor2: '#78350f', trim: '#facc15',
    tow: '#f5f5f4', band1: '#b91c1c', band2: '#d97706', crown: 'aquila',
    arm1: '#b45309', arm2: '#facc15', cw: '#b91c1c'
  },
  ancient_greece: {
    id: 'ancient_greece', label: 'Ancient Greece', name: 'Athenian Wagon Workshop', sub: 'Pentelic Marble Ergasterion, Amphorae & Hellenic Chariot',
    sign: 'AGORA WORKS', hex: '#8da4b5', border: '#0284c7', isNew: true,
    plinth: '#cbd5e1', floor1: '#f8fafc', floor2: '#0284c7', trim: '#facc15',
    tow: '#ffffff', band1: '#0284c7', band2: '#d97706', crown: 'pediment',
    arm1: '#0284c7', arm2: '#f8fafc', cw: '#d97706'
  },
  jurassic_island: {
    id: 'jurassic_island', label: 'Jurassic Island', name: 'Isla Nublar Island Tour Bus', sub: 'Volcanic Stone Safari Depot, Palm Fronds & Bubble-Roof Tour Bus',
    sign: 'ISLAND TOUR', hex: '#4d7c47', border: '#eab308', isNew: true,
    plinth: '#57534e', floor1: '#78716c', floor2: '#15803d', trim: '#eab308',
    tow: '#78350f', band1: '#15803d', band2: '#dc2626', crown: 'amber',
    arm1: '#15803d', arm2: '#eab308', cw: '#dc2626'
  },
  galactic_outpost: {
    id: 'galactic_outpost', label: 'Galactic Outpost', name: 'Batuu Hover Speeder Workshop', sub: 'Weathered Durasteel Repair Bay, Radar Dish & Repulsor Landspeeder',
    sign: 'SPEEDER BAY', hex: '#7c6f64', border: '#ea580c', isNew: true,
    plinth: '#292524', floor1: '#44403c', floor2: '#1e293b', trim: '#ea580c',
    tow: '#64748b', band1: '#ea580c', band2: '#38bdf8', crown: 'radar',
    arm1: '#475569', arm2: '#ea580c', cw: '#38bdf8'
  },
  egypt: {
    id: 'egypt', label: 'Egypt', name: 'Duat Solar Afterlife Boat', sub: 'Karnak Sandstone Mortuary Dock, Anubis Guardians & Barque of Ra',
    sign: 'AFTERLIFE BOAT', hex: '#d4b475', border: '#d97706', isNew: true,
    plinth: '#b45309', floor1: '#eab308', floor2: '#1d4ed8', trim: '#facc15',
    tow: '#eab308', band1: '#1d4ed8', band2: '#0d9488', crown: 'solar_disc',
    arm1: '#d97706', arm2: '#facc15', cw: '#1d4ed8'
  },
  babylon: {
    id: 'babylon', label: 'Babylon', name: 'Euphrates Afterlife Barge', sub: 'Ishtar Gate Lapis Wharf, Gold Rosettes & Winged-Bull Afterlife Barge',
    sign: 'ISHTAR BARGE', hex: '#8b7e6a', border: '#2563eb', isNew: true,
    plinth: '#172554', floor1: '#1e3a8a', floor2: '#15803d', trim: '#facc15',
    tow: '#1d4ed8', band1: '#facc15', band2: '#15803d', crown: 'ziggurat',
    arm1: '#1d4ed8', arm2: '#facc15', cw: '#15803d'
  },

  /* === ORIGINAL 11 THEMED SKINS === */
  western: {
    id: 'western', label: 'Wild West', name: 'Pioneer Covered Wagon Flyer', sub: 'Timber Depot Platform, Water-Tank Towers & Conestoga Covered Wagon',
    sign: 'WAGON TRAIN', hex: '#c99a62', border: '#b45309',
    plinth: '#8a5a33', floor1: '#a8784a', floor2: '#78350f', trim: '#f59e0b',
    tow: '#9a6a3c', band1: '#78350f', band2: '#b45309', crown: 'windmill',
    arm1: '#78350f', arm2: '#d97706', cw: '#27272a'
  },
  classic: {
    id: 'classic', label: 'Classic Midway', name: 'Boardwalk Cable-Car Flyer', sub: 'Victorian Mosaic Pavilion, Gilded Towers & 1920s San Francisco Trolley',
    sign: 'TROLLEY FLYER', hex: '#cbb07c', border: '#e11d48',
    plinth: '#f8f1df', floor1: '#e8dec3', floor2: '#991b1b', trim: '#f5c542',
    tow: '#fffbeb', band1: '#e11d48', band2: '#1d4ed8', crown: 'dome',
    arm1: '#f5c542', arm2: '#fff3b0', cw: '#e11d48'
  },
  jungle: {
    id: 'jungle', label: 'Jungle', name: 'Temple Expedition Safari Bus', sub: 'Mayan Limestone Courtyard, Serpent Pillars & 4x4 Croc-Prow Jungle Bus',
    sign: 'SAFARI EXPED.', hex: '#587c48', border: '#2fbf9a',
    plinth: '#8e8a72', floor1: '#bdb9a0', floor2: '#137a70', trim: '#eab308',
    tow: '#c7bfa4', band1: '#137a70', band2: '#b45309', crown: 'brazier',
    arm1: '#78350f', arm2: '#eab308', cw: '#2fbf9a'
  },
  frontier: {
    id: 'frontier', label: 'Frontier', name: 'Yukon Voyageur War Canoe', sub: 'Log Trading Post Deck, Totem Towers & Carved Birchbark War Canoe',
    sign: 'YUKON CANOE', hex: '#7d955d', border: '#566e42',
    plinth: '#6b4a2b', floor1: '#8a5a33', floor2: '#2f5f3a', trim: '#eab308',
    tow: '#8a5a33', band1: '#2f5f3a', band2: '#5a3b22', crown: 'pinecone',
    arm1: '#5a3b22', arm2: '#d9b27a', cw: '#2f5f3a'
  },
  space: {
    id: 'space', label: 'Space', name: 'Orbital VTOL Dropship', sub: 'Titanium Telemetry Pad, Plasma Pylons & Lunar Personnel Shuttle',
    sign: 'STAR SHUTTLE', hex: '#334155', border: '#0ea5e9',
    plinth: '#0f172a', floor1: '#1e293b', floor2: '#0284c7', trim: '#22d3ee',
    tow: '#e2e8f0', band1: '#0284c7', band2: '#a855f7', crown: 'orb',
    arm1: '#cbd5e1', arm2: '#22d3ee', cw: '#a855f7'
  },
  gothic: {
    id: 'gothic', label: 'Gothic', name: 'River Styx Charon Ferry Boat', sub: 'Crypt Cobblestone Dock, Gargoyle Belfries & Lantern-Lit Ferry Skiff',
    sign: 'STYX FERRY', hex: '#3b3345', border: '#7e22ce',
    plinth: '#27272a', floor1: '#3f3f46', floor2: '#1e1b4b', trim: '#a855f7',
    tow: '#3f3f46', band1: '#18181b', band2: '#581c87', crown: 'spire',
    arm1: '#18181b', arm2: '#a855f7', cw: '#4c1d95'
  },
  medieval: {
    id: 'medieval', label: 'Medieval', name: 'Royal Sky-Galley Barge', sub: 'Cut-Stone Castle Courtyard, Turret Bastions & Gilded Lion War-Galley',
    sign: 'ROYAL GALLEY', hex: '#6c8c58', border: '#eab308',
    plinth: '#94a3b8', floor1: '#cbd5e1', floor2: '#1e3a8a', trim: '#f5c542',
    tow: '#e2dcd0', band1: '#1d4ed8', band2: '#b91c1c', crown: 'turret',
    arm1: '#b45309', arm2: '#f5c542', cw: '#1d4ed8'
  },
  alps: {
    id: 'alps', label: 'Alps', name: 'Glacier Express Panorama Car', sub: 'Alpine Stone Terrace, Chalet Pylons & Red Swiss Panorama Cable-Car',
    sign: 'GLACIER EXPR.', hex: '#a8c5d6', border: '#0284c7',
    plinth: '#cbd5e1', floor1: '#e2e8f0', floor2: '#0284c7', trim: '#dc2626',
    tow: '#b45309', band1: '#dc2626', band2: '#f8fafc', crown: 'chalet',
    arm1: '#dc2626', arm2: '#f8fafc', cw: '#0284c7'
  },
  fiesta: {
    id: 'fiesta', label: 'Fiesta', name: 'Xochimilco Fiesta Trajinera', sub: 'Talavera Tile Courtyard, Mission Bell Towers & Flower-Crowned Gondola Boat',
    sign: 'XOCHIMILCO', hex: '#d99b52', border: '#e11d48',
    plinth: '#fef3c7', floor1: '#fde68a', floor2: '#0d9488', trim: '#e11d48',
    tow: '#fef3c7', band1: '#0d9488', band2: '#e11d48', crown: 'bell',
    arm1: '#f59e0b', arm2: '#ec4899', cw: '#0d9488'
  },
  nordic: {
    id: 'nordic', label: 'Nordic', name: 'Asgardian Sky-Drakkar Ship', sub: 'Fjord Flagstone Hall, Runic Stave Towers & Shield-Rimmed Viking Longship',
    sign: 'SKY DRAKKAR', hex: '#4d6b63', border: '#d97706',
    plinth: '#475569', floor1: '#64748b', floor2: '#451a03', trim: '#f59e0b',
    tow: '#451a03', band1: '#0284c7', band2: '#d97706', crown: 'dragon',
    arm1: '#78350f', arm2: '#f59e0b', cw: '#0284c7'
  },
  bavarian: {
    id: 'bavarian', label: 'Bavarian', name: 'Oktoberfest Brewery Dray Wagon', sub: 'Fachwerk Courtyard, Copper Kettle Towers & Barrel-Stacked Fest Wagon',
    sign: 'FEST WAGON', hex: '#769958', border: '#2563eb',
    plinth: '#f8f5ec', floor1: '#dfd9c8', floor2: '#2563eb', trim: '#eab308',
    tow: '#f8f5ec', band1: '#2563eb', band2: '#b91c1c', crown: 'onion',
    arm1: '#d97706', arm2: '#fef08a', cw: '#2563eb'
  }
};

/* Theme aliases */
CRAZY_BUS_SKINS.german       = CRAZY_BUS_SKINS.bavarian;
CRAZY_BUS_SKINS.wildwest     = CRAZY_BUS_SKINS.western;
CRAZY_BUS_SKINS.standard     = CRAZY_BUS_SKINS.unthemed;
CRAZY_BUS_SKINS.galaxys_edge = CRAZY_BUS_SKINS.galactic_outpost;
CRAZY_BUS_SKINS.galactic     = CRAZY_BUS_SKINS.galactic_outpost;
CRAZY_BUS_SKINS.jurassic     = CRAZY_BUS_SKINS.jurassic_island;
CRAZY_BUS_SKINS.rome         = CRAZY_BUS_SKINS.ancient_rome;
CRAZY_BUS_SKINS.greece       = CRAZY_BUS_SKINS.ancient_greece;

/* ===== SPRITE CODE ===== */
const CB_CFG = {
  pivX: [-1.85, 1.85],
  pivY: -1.42,
  pivZ:  3.75,
  armR:  1.95,
  cwR:   0.95,
  carY:  0.55
};

function cbGondola(g, Pj, S, theme, A) {
  const sk = CRAZY_BUS_SKINS[theme] || CRAZY_BUS_SKINS.unthemed;
  const Z = 0, fI = (X, Y, Zz) => Pj(X, Y, Z + Zz);
  const gold = '#f5c542', goldD = '#b8861b', goldL = '#fff3b0';

  const drawWheel3D = (wx, wy, wz, rad, tireCol, rimCol, spoked = false) => {
    const p = fI(wx, wy, wz);
    FR.ell(g, p[0], p[1], S * rad * 0.92, S * rad * 1.02, tireCol, '#0f172a', S * 0.05);
    FR.ell(g, p[0], p[1], S * rad * 0.58, S * rad * 0.64, rimCol);
    if (spoked) {
      for (let k = 0; k < 6; k++) {
        const a = k * Math.PI / 3;
        FR.ln(g, [p[0] - Math.cos(a) * S * rad * 0.8, p[1] - Math.sin(a) * S * rad * 0.85], [p[0] + Math.cos(a) * S * rad * 0.8, p[1] + Math.sin(a) * S * rad * 0.85], rimCol, S * 0.045);
      }
    }
    FR.ell(g, p[0], p[1], S * rad * 0.18, S * rad * 0.18, gold);
  };

  const drawRiders4Rows = (rowsX, zSeat, benchCol) => {
    const shirts = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
    const skins  = ['#fde4c8', '#e8b890', '#f5cba7', '#d49b72'];
    rowsX.forEach((rx, rIdx) => {
      FR.rbox(g, Pj, rx, 0, Z + zSeat, 0.42, 1.52, 0.22, 0, benchCol || '#334155', { top: shade(benchCol || '#334155', 0.2) });
      [-0.42, 0.42].forEach((ry, sIdx) => {
        const idx = rIdx * 2 + sIdx;
        const torso = fI(rx, ry, zSeat + 0.36);
        const head  = fI(rx, ry, zSeat + 0.74);
        FR.ell(g, torso[0], torso[1], S * 0.23, S * 0.27, shirts[idx % shirts.length]);
        FR.ell(g, head[0],  head[1],  S * 0.17, S * 0.17, theme === 'space' ? '#ffffff' : skins[idx % skins.length]);
        if ((rIdx === 0 || rIdx === rowsX.length - 1) && sIdx === 1) {
          FR.ln(g, torso, [head[0] + S * 0.22, head[1] - S * 0.24], skins[idx % skins.length], S * 0.065);
        }
      });
      FR.ln(g, fI(rx + 0.16, -0.76, zSeat + 0.34), fI(rx + 0.16, 0.76, zSeat + 0.34), goldL, S * 0.075);
    });
  };

  // Under-cradle beam connecting to 4-bar linkage pins
  FR.rbox(g, Pj, 0, 0, Z + 0.12, 4.2, 1.95, 0.16, 0, '#1e293b');

  /* ==================== 8 NEW EXPANSION LANDS ==================== */

  // 1. CHINA: Imperial Dragon Palanquin / Flying Prayer Pavilion
  if (theme === 'china') {
    FR.rbox(g, Pj, 0, 0, Z + 0.28, 4.65, 2.15, 0.24, 0, '#991b1b', { top: gold });
    FR.rbox(g, Pj, 0, 0, Z + 0.52, 4.15, 1.92, 0.42, 0, '#dc2626', { top: '#7f1d1d' });
    // Golden lattice railings & dragon carrying poles jutting bow & stern
    FR.ln(g, fI(-2.95, -0.82, 0.36), fI(2.95, -0.82, 0.36), goldD, S * 0.14);
    FR.ln(g, fI(-2.95,  0.82, 0.36), fI(2.95,  0.82, 0.36), gold,  S * 0.16);
    FR.ell(g, ...fI(3.05, 0.82, 0.46), S * 0.22, S * 0.20, goldL, '#991b1b', S * 0.04);
    drawRiders4Rows([-1.50, -0.50, 0.50, 1.50], 0.72, '#7f1d1d');
    // Vermilion & gold pavilion columns
    [-1.85, -0.62, 0.62, 1.85].forEach(px => {
      FR.ln(g, fI(px, -0.90, 0.90), fI(px, -0.90, 1.78), '#991b1b', S * 0.10);
      FR.ln(g, fI(px,  0.90, 0.90), fI(px,  0.90, 1.78), '#dc2626', S * 0.12);
    });
    // Upturned dark-slate & gold-trimmed Pagoda Canopy Roof + hanging red silk lanterns
    FR.poly(g, [fI(-2.45, -1.18, 1.76), fI(2.45, -1.18, 1.76), fI(2.45, 1.18, 1.76), fI(-2.45, 1.18, 1.76)], '#1e293b', gold, S * 0.07);
    FR.rbox(g, Pj, 0, 0, Z + 1.84, 3.45, 1.55, 0.24, 0, '#0f172a', { top: gold });
    FR.ell(g, ...fI(0, 0, 2.25), S * 0.26, S * 0.26, goldL, '#dc2626', S * 0.05);
    [-2.25, 2.25].forEach(lx => {
      const lp = fI(lx, 1.05, 1.48);
      FR.ell(g, lp[0], lp[1], S * 0.18, S * 0.22, '#ef4444', gold, S * 0.05);
    });
  }

  // 2. JAPAN: Edo Shogunate Samurai Palanquin / Dojo Training Gondola
  else if (theme === 'japan') {
    FR.rbox(g, Pj, 0, 0, Z + 0.28, 4.60, 2.10, 0.22, 0, '#0f172a', { top: '#dc2626' });
    FR.rbox(g, Pj, 0, 0, Z + 0.50, 4.10, 1.88, 0.45, 0, '#1e293b', { top: '#84cc16' });
    // Gold kamon crest medallions along the black-lacquered gunwale
    [-1.4, 0, 1.4].forEach(mx => {
      FR.ell(g, ...fI(mx, 0.96, 0.72), S * 0.18, S * 0.18, gold, '#dc2626', S * 0.04);
    });
    drawRiders4Rows([-1.50, -0.50, 0.50, 1.50], 0.72, '#7f1d1d');
    // Dark cedar pillars & rolled bamboo sudare blinds
    [-1.85, -0.62, 0.62, 1.85].forEach(px => {
      FR.ln(g, fI(px, -0.88, 0.92), fI(px, -0.88, 1.74), '#090d16', S * 0.10);
      FR.ln(g, fI(px,  0.88, 0.92), fI(px,  0.88, 1.74), '#291509', S * 0.12);
    });
    FR.rbox(g, Pj, 0, 0.90, Z + 1.58, 3.65, 0.08, 0.18, 0, '#d9b27a');
    // Curved grey kawara tiled Irimoya dojo roof with gold ridge beam
    FR.poly(g, [fI(-2.35, -1.12, 1.74), fI(2.35, -1.12, 1.74), fI(2.35, 1.12, 1.74), fI(-2.35, 1.12, 1.74)], '#334155', '#0f172a', S * 0.06);
    FR.rbox(g, Pj, 0, 0, Z + 1.82, 3.85, 1.45, 0.22, 0, '#1e293b', { top: gold });
    // White chochin paper lanterns at front & rear corners
    [-2.15, 2.15].forEach(lx => {
      FR.ell(g, ...fI(lx, 1.00, 1.48), S * 0.16, S * 0.20, '#fef3c7', '#dc2626', S * 0.05);
    });
  }

  // 3. ANCIENT ROME: Newly Forged Imperial War Chariot & Supply Wagon (Wagon Workshop)
  else if (theme === 'ancient_rome') {
    const wood = '#78350f', crim = '#b91c1c';
    drawWheel3D(-1.35, -1.08, 0.48, 0.58, '#451a03', gold, true);
    drawWheel3D( 1.35, -1.08, 0.48, 0.58, '#451a03', gold, true);
    // Heavy oak chariot chassis & crimson bronze-trimmed war-wagon box
    FR.rbox(g, Pj, 0, 0, Z + 0.34, 4.35, 2.02, 0.62, 0, crim, { top: wood });
    // High curved bronze & crimson chariot breastwork shield at +X prow
    FR.rbox(g, Pj, 2.05, 0, Z + 0.48, 0.55, 1.88, 0.78, 0, crim, { top: gold });
    FR.ell(g, ...fI(2.34, 0, 0.88), S * 0.26, S * 0.28, gold, '#7f1d1d', S * 0.05);
    // Legionary scutum shields & spare spoked wheel mounted along the +Y workshop side
    [-0.95, 0.45].forEach(sx => {
      FR.rbox(g, Pj, sx, 1.04, Z + 0.48, 0.72, 0.10, 0.52, 0, crim, { top: gold });
    });
    drawRiders4Rows([-1.50, -0.50, 0.50, 1.45], 0.78, wood);
    // Roman crimson-and-cream striped canvas sun canopy on bronze poles
    [-1.75, 1.65].forEach(px => {
      FR.ln(g, fI(px, -0.92, 0.94), fI(px, -0.92, 1.72), goldD, S * 0.09);
      FR.ln(g, fI(px,  0.92, 0.94), fI(px,  0.92, 1.72), gold,  S * 0.11);
    });
    FR.rbox(g, Pj, -0.05, 0, Z + 1.72, 3.65, 1.98, 0.18, 0, crim, { top: '#fef3c7' });
    drawWheel3D(-1.35, 1.08, 0.48, 0.60, '#451a03', gold, true);
    drawWheel3D( 1.35, 1.08, 0.48, 0.60, '#451a03', gold, true);
  }

  // 4. ANCIENT GREECE: Classical Athenian Ceremonial Wagon & Chariot Frame (Wagon Workshop)
  else if (theme === 'ancient_greece') {
    const oak = '#a16207', blue = '#0284c7';
    drawWheel3D(-1.35, -1.08, 0.48, 0.58, '#451a03', '#f59e0b', true);
    drawWheel3D( 1.35, -1.08, 0.48, 0.58, '#451a03', '#f59e0b', true);
    // Whitewashed oak & Aegean-blue Greek ceremonial carriage bed
    FR.rbox(g, Pj, 0, 0, Z + 0.34, 4.35, 2.02, 0.60, 0, '#f8fafc', { top: oak });
    FR.poly(g, [fI(-2.15, 1.02, 0.62), fI(2.15, 1.02, 0.62), fI(2.15, 1.02, 0.84), fI(-2.15, 1.02, 0.84)], blue, gold, S * 0.04);
    // Carved Greek scroll prow & apotropaic eye medallion at +X
    FR.rbox(g, Pj, 2.05, 0, Z + 0.48, 0.52, 1.85, 0.72, 0, blue, { top: '#ffffff' });
    FR.ell(g, ...fI(2.33, 0, 0.86), S * 0.24, S * 0.22, '#ffffff', '#0f172a', S * 0.05);
    FR.ell(g, ...fI(2.34, 0, 0.86), S * 0.10, S * 0.10, blue);
    drawRiders4Rows([-1.50, -0.50, 0.50, 1.45], 0.78, oak);
    // Aegean-blue & white striped canvas canopy on bronze-tipped poles
    [-1.75, 1.65].forEach(px => {
      FR.ln(g, fI(px, -0.92, 0.92), fI(px, -0.92, 1.70), '#b45309', S * 0.09);
      FR.ln(g, fI(px,  0.92, 0.92), fI(px,  0.92, 1.70), '#d97706', S * 0.11);
    });
    FR.rbox(g, Pj, -0.05, 0, Z + 1.70, 3.65, 1.98, 0.18, 0, blue, { top: '#ffffff' });
    drawWheel3D(-1.35, 1.08, 0.48, 0.60, '#451a03', '#f59e0b', true);
    drawWheel3D( 1.35, 1.08, 0.48, 0.60, '#451a03', '#f59e0b', true);
  }

  // 5. JURASSIC ISLAND: Isla Nublar Safari Tour Bus (Jungle Green, Yellow & Crimson Stripes + Bubble Roof!)
  else if (theme === 'jurassic_island') {
    const jGreen = '#15803d', jYel = '#eab308', jRed = '#dc2626';
    drawWheel3D(-1.35, -1.08, 0.44, 0.52, '#1c1917', '#64748b');
    drawWheel3D( 1.25, -1.08, 0.44, 0.52, '#1c1917', '#64748b');
    // Iconic Jurassic Park Tour Vehicle Chassis (Yellow lower body + Jungle Green upper trim + Crimson diagonal stripe)
    FR.rbox(g, Pj, -0.20, 0, Z + 0.30, 4.30, 2.04, 0.72, 0, jYel, { top: '#1c1917' });
    FR.rbox(g, Pj, 2.22, 0, Z + 0.30, 0.85, 1.76, 0.66, 0, jGreen, { top: jYel });
    // Heavy black front safari brush-guard bull-bar & expedition fog lights
    FR.rbox(g, Pj, 2.68, 0, Z + 0.32, 0.18, 1.84, 0.56, 0, '#18181b', { top: '#3f3f46' });
    [-0.65, 0.65].forEach(hy => FR.ell(g, ...fI(2.72, hy, 0.62), S * 0.14, S * 0.14, '#fef08a', '#18181b', S * 0.04));
    // Jungle green & crimson Jurassic Park side stripes + rear spare tire
    FR.poly(g, [fI(-2.35, 1.04, 0.76), fI(1.95, 1.04, 0.76), fI(1.95, 1.04, 1.00), fI(-2.35, 1.04, 1.00)], jGreen);
    FR.poly(g, [fI(-1.40, 1.05, 0.34), fI(0.85, 1.05, 0.34), fI(0.35, 1.05, 0.96), fI(-1.90, 1.05, 0.96)], jRed);
    drawWheel3D(-2.42, 0, 0.74, 0.42, '#1c1917', jYel);
    drawRiders4Rows([-1.60, -0.60, 0.40, 1.35], 0.80, '#451a03');
    // Roll-cage stanchions & Panoramic Translucent Glass Bubble Roof with 4 Roof Spotlights
    [-2.15, -0.85, 0.45, 1.70].forEach(px => {
      FR.ln(g, fI(px, -0.96, 0.98), fI(px, -0.96, 1.70), '#14532d', S * 0.10);
      FR.ln(g, fI(px,  0.96, 0.98), fI(px,  0.96, 1.70), jGreen,    S * 0.12);
    });
    FR.rbox(g, Pj, -0.25, 0, Z + 1.70, 4.05, 1.98, 0.16, 0, jGreen, { top: 'rgba(186, 230, 253, 0.75)' });
    [-0.65, -0.22, 0.22, 0.65].forEach(ly => {
      FR.ell(g, ...fI(1.72, ly, 1.92), S * 0.11, S * 0.11, '#fef08a', '#18181b', S * 0.04);
    });
    drawWheel3D(-1.35, 1.08, 0.44, 0.54, '#1c1917', '#64748b');
    drawWheel3D( 1.25, 1.08, 0.44, 0.54, '#1c1917', '#64748b');
  }

  // 6. GALACTIC OUTPOST: Weathered Batuu / Star Wars Repulsorlift Landspeeder (Hover Speeder!)
  else if (theme === 'galactic_outpost') {
    const sand = '#d6c7b2', rust = '#c2410c', slate = '#475569';
    // Glowing cyan repulsorlift hover field beneath the speeder hull (zero wheels!)
    const hGlow = fI(0, 0, 0.18);
    FR.ell(g, hGlow[0], hGlow[1], S * 2.65, S * 1.15, 'rgba(56, 189, 248, 0.28)');
    // Main tapered sand-tan & rust-orange repulsorlift speeder chassis
    FR.rbox(g, Pj, -0.25, 0, Z + 0.34, 4.25, 2.06, 0.62, 0, sand, { top: '#78716c' });
    // Tapered speeder nose cone (+1.85 to +2.85) with exposed mechanical radiator grille
    FR.poly(g, [fI(1.85, -0.95, 0.36), fI(2.85, -0.45, 0.42), fI(2.85, 0.45, 0.42), fI(1.85, 0.95, 0.36)], sand, '#292524', S * 0.06);
    FR.poly(g, [fI(1.85, -0.95, 0.36), fI(1.85, 0.95, 0.36), fI(1.85, 0.95, 0.92), fI(1.85, -0.95, 0.92)], sand);
    FR.poly(g, [fI(2.86, -0.38, 0.44), fI(2.86, 0.38, 0.44), fI(2.86, 0.38, 0.78), fI(2.86, -0.38, 0.78)], '#1c1917', rust, S * 0.05);
    // Rust-orange racing stripes & weathered durasteel armor plate on +Y flank
    FR.poly(g, [fI(-2.25, 1.04, 0.52), fI(1.85, 1.04, 0.52), fI(1.85, 1.04, 0.74), fI(-2.25, 1.04, 0.74)], rust);
    FR.rbox(g, Pj, -0.45, 1.05, Z + 0.40, 1.25, 0.08, 0.46, 0, slate, { top: '#94a3b8' });
    // Angled wraparound cockpit windscreen & 4 rows of riders
    FR.poly(g, [fI(1.65, -0.94, 0.94), fI(1.65, 0.94, 0.94), fI(1.35, 0.94, 1.46), fI(1.35, -0.94, 1.46)], 'rgba(56, 189, 248, 0.48)', '#e2e8f0', S * 0.06);
    drawRiders4Rows([-1.55, -0.55, 0.45, 1.25], 0.78, '#1e293b');
    // Triple Rear Turbine Engine Nacelles (Left, Right, and Center-Top Pod) with glowing cyan/orange exhausts!
    [[-1.85, -1.18, 0.78], [-1.85, 1.18, 0.78], [-2.05, 0, 1.42]].forEach(([tx, ty, tz]) => {
      FR.rbox(g, Pj, tx, ty, Z + tz, 1.15, 0.44, 0.42, 0, slate, { top: rust });
      FR.ell(g, ...fI(tx - 0.60, ty, tz + 0.21), S * 0.18, S * 0.18, '#38bdf8', '#ffffff', S * 0.04);
    });
  }

  // 7. EGYPT: Pharaonic Golden Solar Afterlife Boat (Barque of Ra / Duat Ferry)
  else if (theme === 'egypt') {
    const N = 24, prof = [];
    for (let i = 0; i <= N; i++) {
      const s = -1 + 2 * i / N, X = s * 2.65;
      const edge = Math.max(0, Math.abs(s) - 0.48) / 0.52;
      const zBot = 0.22 + 0.48 * Math.pow(edge, 2.0);
      const zGun = 0.86 + 0.68 * Math.pow(edge, 1.85);
      prof.push([X, zBot, zGun]);
    }
    const W = 1.08;
    FR.rbox(g, Pj, 0, 0, Z + 0.32, 4.2, 1.85, 0.20, 0, '#1d4ed8', { top: '#b45309' });
    drawRiders4Rows([-1.50, -0.50, 0.50, 1.50], 0.55, '#1d4ed8');
    // Hammered-gold crescent hull & lapis-lazuli collar stripe
    const frontTop = prof.map(([X, zb, zg]) => fI(X, W, zg));
    const frontBot = prof.slice().reverse().map(([X, zb, zg]) => fI(X, W * 0.82, zb));
    FR.poly(g, frontTop.concat(frontBot), '#eab308', '#78350f', S * 0.07);
    const stripeTop = prof.map(([X, zb, zg]) => fI(X, W + 0.01, zg - 0.06));
    const stripeBot = prof.slice().reverse().map(([X, zb, zg]) => fI(X, W + 0.01, zg - 0.22));
    FR.poly(g, stripeTop.concat(stripeBot), '#1d4ed8');
    // Towering Lotus-Blossom Prow (+X) & Inward-Curled Papyrus Stern (-X)
    const pBow = fI(2.65, 0, 1.50), pLotus = fI(3.05, 0, 2.35);
    FR.ln(g, pBow, pLotus, '#d97706', S * 0.32);
    FR.ell(g, pLotus[0], pLotus[1], S * 0.30, S * 0.26, goldL, '#1d4ed8', S * 0.06);
    const pStern = fI(-2.65, 0, 1.50), pCurl = fI(-2.45, 0, 2.25);
    FR.ln(g, pStern, pCurl, '#d97706', S * 0.28);
    FR.ell(g, pCurl[0], pCurl[1], S * 0.24, S * 0.24, '#1d4ed8', goldL, S * 0.05);
    // Starry lapis-blue Duat Afterlife Canopy Shrine & winged solar disc
    [-1.45, 1.45].forEach(px => {
      FR.ln(g, fI(px, -W * 0.85, 0.88), fI(px, -W * 0.85, 1.72), goldD, S * 0.10);
      FR.ln(g, fI(px,  W * 0.85, 0.88), fI(px,  W * 0.85, 1.72), goldL, S * 0.12);
    });
    FR.rbox(g, Pj, 0, 0, Z + 1.72, 3.25, 1.92, 0.22, 0, '#1e3a8a', { top: gold });
    FR.ell(g, ...fI(0, 0.96, 1.84), S * 0.24, S * 0.20, '#ef4444', goldL, S * 0.05);
    // Twin Anubis-headed steering rudder oars at stern (-X)
    FR.ln(g, fI(-2.05, W + 0.04, 1.15), fI(-2.75, W + 0.18, 0.18), gold, S * 0.11);
  }

  // 8. BABYLON: Mesopotamian Royal Afterlife Barge (Lapis Hull, Golden Winged-Bull Prow & Ziggurat Shrine)
  else if (theme === 'babylon') {
    const N = 24, prof = [];
    for (let i = 0; i <= N; i++) {
      const s = -1 + 2 * i / N, X = s * 2.65;
      const edge = Math.max(0, Math.abs(s) - 0.50) / 0.50;
      const zBot = 0.22 + 0.42 * Math.pow(edge, 2.0);
      const zGun = 0.86 + 0.58 * Math.pow(edge, 1.85);
      prof.push([X, zBot, zGun]);
    }
    const W = 1.08;
    FR.rbox(g, Pj, 0, 0, Z + 0.32, 4.2, 1.85, 0.20, 0, '#172554', { top: '#78350f' });
    drawRiders4Rows([-1.50, -0.50, 0.50, 1.50], 0.55, '#172554');
    // Deep lapis-lazuli glazed blue hull with gold Ishtar rosette medallions
    const frontTop = prof.map(([X, zb, zg]) => fI(X, W, zg));
    const frontBot = prof.slice().reverse().map(([X, zb, zg]) => fI(X, W * 0.82, zb));
    FR.poly(g, frontTop.concat(frontBot), '#1d4ed8', gold, S * 0.07);
    [-1.6, -0.8, 0, 0.8, 1.6].forEach(rx => {
      FR.ell(g, ...fI(rx, W + 0.03, 0.65), S * 0.16, S * 0.16, gold, '#ffffff', S * 0.04);
    });
    // Towering Golden Winged-Bull (Lamassu) Prow at +X & Stepped Ziggurat Stern Finial at -X
    const bBow = fI(2.65, 0, 1.40), bBull = fI(2.98, 0, 2.30);
    FR.ln(g, bBow, bBull, goldD, S * 0.32);
    FR.ln(g, bBow, bBull, gold,  S * 0.20);
    FR.poly(g, [bBull, [bBull[0] + S * 0.48, bBull[1] - S * 0.18], [bBull[0] + S * 0.32, bBull[1] + S * 0.14]], goldL, '#172554', S * 0.05);
    FR.rbox(g, Pj, -2.55, 0, Z + 1.35, 0.65, 1.35, 0.45, 0, '#1e3a8a', { top: gold });
    // Stepped Ziggurat Afterlife Shrine Canopy & golden funerary lanterns
    [-1.45, 1.45].forEach(px => {
      FR.ln(g, fI(px, -W * 0.85, 0.88), fI(px, -W * 0.85, 1.70), goldD, S * 0.10);
      FR.ln(g, fI(px,  W * 0.85, 0.88), fI(px,  W * 0.85, 1.70), goldL, S * 0.12);
    });
    FR.rbox(g, Pj, 0, 0, Z + 1.70, 3.35, 1.94, 0.18, 0, '#1e3a8a', { top: gold });
    FR.rbox(g, Pj, 0, 0, Z + 1.88, 2.15, 1.32, 0.18, 0, gold, { top: goldL });
  }

  /* ==================== ORIGINAL 12 SKINS ==================== */

  // 9. UNTHEMED STANDARD: Cheerful 3D Zamperla School / Tour Bus
  else if (theme === 'unthemed') {
    const busCol = A || '#f59e0b', busDark = shade(busCol, -0.25);
    drawWheel3D(-1.35, -1.08, 0.42, 0.46, '#18181b', '#e2e8f0');
    drawWheel3D( 1.25, -1.08, 0.42, 0.46, '#18181b', '#e2e8f0');
    FR.rbox(g, Pj, -0.25, 0, Z + 0.28, 4.3, 2.05, 0.72, 0, busCol, { top: '#fef3c7' });
    FR.rbox(g, Pj, 2.22, 0, Z + 0.28, 0.85, 1.72, 0.66, 0, busCol, { top: shade(busCol, 0.12) });
    FR.poly(g, [fI(2.66, -0.55, 0.34), fI(2.66, 0.55, 0.34), fI(2.66, 0.55, 0.82), fI(2.66, -0.55, 0.82)], '#e2e8f0', '#475569', S * 0.05);
    [-0.68, 0.68].forEach(hy => FR.ell(g, ...fI(2.67, hy, 0.58), S * 0.14, S * 0.14, '#fef08a', '#d97706', S * 0.04));
    FR.poly(g, [fI(-2.40, 1.04, 0.48), fI(1.90, 1.04, 0.48), fI(1.90, 1.04, 0.66), fI(-2.40, 1.04, 0.66)], '#ef4444', '#ffffff', S * 0.04);
    FR.ln(g, fI(-2.45, 1.06, 0.30), fI(2.68, 1.06, 0.30), '#e2e8f0', S * 0.12);
    drawRiders4Rows([-1.65, -0.65, 0.35, 1.30], 0.78, '#1e3a8a');
    [-2.25, -1.15, -0.15, 0.85, 1.78].forEach(px => {
      FR.ln(g, fI(px, -0.98, 0.98), fI(px, -0.98, 1.72), busDark, S * 0.11);
      FR.ln(g, fI(px,  0.98, 0.98), fI(px,  0.98, 1.72), busCol,  S * 0.13);
    });
    FR.poly(g, [fI(1.80, -0.96, 0.98), fI(1.80, 0.96, 0.98), fI(1.62, 0.96, 1.72), fI(1.62, -0.96, 1.72)], 'rgba(186,230,253,0.45)', '#e2e8f0', S * 0.06);
    FR.rbox(g, Pj, -0.32, 0, Z + 1.72, 4.15, 2.02, 0.20, 0, '#f8fafc', { top: busCol });
    FR.rbox(g, Pj, 1.45, 0, Z + 1.92, 0.55, 1.35, 0.24, 0, '#0f172a', { top: gold });
    drawWheel3D(-1.35, 1.08, 0.42, 0.48, '#18181b', '#f8fafc');
    drawWheel3D( 1.25, 1.08, 0.42, 0.48, '#18181b', '#f8fafc');
  }

  // 10. WILD WEST (`western`): Conestoga Pioneer Covered Wagon
  else if (theme === 'western') {
    const wagonBed = '#8a5a33', trimG = '#f59e0b', woodD = '#451a03';
    drawWheel3D(-1.38, -1.08, 0.48, 0.58, woodD, trimG, true);
    drawWheel3D( 1.32, -1.08, 0.42, 0.48, woodD, trimG, true);
    FR.rbox(g, Pj, -0.10, 0, Z + 0.34, 4.45, 2.02, 0.62, 0, wagonBed, { top: woodD });
    FR.rbox(g, Pj,  2.05, 0, Z + 0.42, 0.72, 1.82, 0.65, 0, woodD, { top: trimG });
    FR.ln(g, fI(-2.30, 1.03, 0.62), fI(2.30, 1.03, 0.62), trimG, S * 0.11);
    drawRiders4Rows([-1.45, -0.45, 0.55, 1.65], 0.78, woodD);
    const bonnetBays = [-1.85, -0.95, -0.05, 0.80];
    bonnetBays.forEach((bx, bIdx) => {
      const colCanv = (bIdx % 2 === 0) ? '#f8f2e0' : '#efe6cc';
      FR.rbox(g, Pj, bx, 0, Z + 1.52, 0.90, 2.04, 0.42, 0, colCanv, { top: '#ffffff' });
      FR.rbox(g, Pj, bx, 0, Z + 1.94, 0.86, 1.48, 0.20, 0, '#ffffff', { top: '#fdfbf5' });
      FR.ln(g, fI(bx - 0.42, -1.00, 0.95), fI(bx - 0.42, -1.00, 1.65), woodD, S * 0.09);
      FR.ln(g, fI(bx - 0.42,  1.00, 0.95), fI(bx - 0.42,  1.00, 1.65), trimG, S * 0.10);
    });
    FR.ln(g, fI(1.22, -1.00, 0.95), fI(1.22, 1.00, 1.85), woodD, S * 0.10);
    const bPos = fI(-0.15, 1.12, 0.62);
    FR.ell(g, bPos[0], bPos[1], S * 0.26, S * 0.32, '#78350f', woodD, S * 0.05);
    FR.ell(g, ...fI(1.95, 0.98, 1.22), S * 0.14, S * 0.17, '#fef08a', trimG, S * 0.05);
    drawWheel3D(-1.38, 1.08, 0.48, 0.60, woodD, trimG, true);
    drawWheel3D( 1.32, 1.08, 0.42, 0.50, woodD, trimG, true);
  }

  // 11. CLASSIC MIDWAY (`classic`): 1920s San Francisco Boardwalk Cable Car
  else if (theme === 'classic') {
    const carCol = '#e11d48', cream = '#fffbeb';
    drawWheel3D(-1.30, -0.95, 0.34, 0.38, '#334155', gold);
    drawWheel3D( 1.30, -0.95, 0.34, 0.38, '#334155', gold);
    FR.rbox(g, Pj, 0, 0, Z + 0.26, 4.75, 2.15, 0.16, 0, '#78350f', { top: gold });
    FR.rbox(g, Pj, 0, 0, Z + 0.42, 4.45, 1.98, 0.65, 0, carCol, { top: cream });
    [-1.45, 0, 1.45].forEach(px => {
      FR.poly(g, [fI(px - 0.55, 1.00, 0.50), fI(px + 0.55, 1.00, 0.50), fI(px + 0.55, 1.00, 0.96), fI(px - 0.55, 1.00, 0.96)], cream, gold, S * 0.05);
    });
    FR.poly(g, [fI(2.25, -0.85, 0.22), fI(2.65, 0, 0.22), fI(2.25, 0.85, 0.22), fI(2.25, 0, 0.52)], goldD, goldL, S * 0.05);
    FR.ell(g, ...fI(2.32, 0, 0.72), S * 0.20, S * 0.20, '#fef08a', goldD, S * 0.06);
    drawRiders4Rows([-1.55, -0.52, 0.52, 1.55], 0.82, '#1e3a8a');
    [-2.05, -1.02, 0, 1.02, 2.05].forEach(px => {
      FR.ln(g, fI(px, -0.94, 1.05), fI(px, -0.94, 1.76), goldD, S * 0.09);
      FR.ln(g, fI(px,  0.94, 1.05), fI(px,  0.94, 1.76), goldL, S * 0.11);
    });
    FR.rbox(g, Pj, 0, 0, Z + 1.76, 4.55, 2.02, 0.16, 0, cream, { top: carCol });
    FR.rbox(g, Pj, 0, 0, Z + 1.92, 3.10, 1.28, 0.24, 0, '#1e3a8a', { top: gold });
    drawWheel3D(-1.30, 0.95, 0.34, 0.38, '#334155', gold);
    drawWheel3D( 1.30, 0.95, 0.34, 0.38, '#334155', gold);
  }

  // 12–17. JUNGLE, FRONTIER, FIESTA, NORDIC, MEDIEVAL, GOTHIC: Curved 3D Boat & Ship Hulls
  else if (theme === 'jungle' || theme === 'frontier' || theme === 'fiesta' || theme === 'nordic' || theme === 'medieval' || theme === 'gothic') {
    const hullC = {
      jungle:   ['#78350f', '#15803d', '#eab308'],
      frontier: ['#d9b27a', '#8a5a33', '#2f5f3a'],
      fiesta:   ['#0d9488', '#e11d48', '#facc15'],
      nordic:   ['#5a361a', '#3e2410', '#f59e0b'],
      medieval: ['#1e3a8a', '#b91c1c', '#f5c542'],
      gothic:   ['#18181b', '#3b0764', '#a855f7']
    }[theme];

    const N = 24, prof = [];
    for (let i = 0; i <= N; i++) {
      const s = -1 + 2 * i / N, X = s * 2.60;
      const edge = Math.max(0, Math.abs(s) - 0.55) / 0.45;
      const zBot = 0.22 + 0.38 * Math.pow(edge, 2.0);
      const zGun = 0.86 + 0.52 * Math.pow(edge, 1.85);
      prof.push([X, zBot, zGun]);
    }
    const W = 1.08;
    FR.rbox(g, Pj, 0, 0, Z + 0.32, 4.2, 1.85, 0.20, 0, hullC[1], { top: shade(hullC[0], -0.15) });
    drawRiders4Rows([-1.50, -0.50, 0.50, 1.50], 0.55, hullC[1]);

    const frontTop = prof.map(([X, zb, zg]) => fI(X, W, zg));
    const frontBot = prof.slice().reverse().map(([X, zb, zg]) => fI(X, W * 0.82, zb));
    FR.poly(g, frontTop.concat(frontBot), hullC[0], hullC[2], S * 0.07);
    const stripeTop = prof.map(([X, zb, zg]) => fI(X, W + 0.01, zg - 0.06));
    const stripeBot = prof.slice().reverse().map(([X, zb, zg]) => fI(X, W + 0.01, zg - 0.22));
    FR.poly(g, stripeTop.concat(stripeBot), hullC[1]);

    if (theme === 'nordic') {
      const pBow = fI(2.65, 0, 1.35), pHead = fI(2.95, 0, 2.35);
      FR.ln(g, pBow, pHead, goldD, S * 0.34);
      FR.ln(g, pBow, pHead, gold,  S * 0.20);
      FR.poly(g, [pHead, [pHead[0] + S * 0.55, pHead[1] - S * 0.18], [pHead[0] + S * 0.35, pHead[1] + S * 0.15]], gold, goldL, S * 0.05);
      const pStern = fI(-2.65, 0, 1.35), pTail = fI(-2.85, 0, 2.15);
      FR.ln(g, pStern, pTail, gold, S * 0.24);
      FR.ell(g, pTail[0], pTail[1], S * 0.22, S * 0.22, goldL, goldD, S * 0.05);
      [-1.8, -1.08, -0.36, 0.36, 1.08, 1.8].forEach((sx, si) => {
        const sp = fI(sx, W + 0.04, 0.72);
        FR.ell(g, sp[0], sp[1], S * 0.26, S * 0.26, si % 2 ? '#334155' : '#0284c7', gold, S * 0.05);
        FR.ell(g, sp[0], sp[1], S * 0.09, S * 0.09, goldL);
      });
    }
    else if (theme === 'gothic') {
      const pBow = fI(2.62, 0, 1.38), pHook = fI(3.15, 0, 2.45), pLamp = fI(3.15, 0, 1.75);
      FR.ln(g, pBow, pHook, '#27272a', S * 0.26);
      FR.ln(g, pBow, pHook, '#a1a1aa', S * 0.12);
      FR.ln(g, pHook, pLamp, '#d4d4d8', S * 0.06);
      FR.ell(g, pLamp[0], pLamp[1], S * 0.24, S * 0.28, '#10b981', '#fde047', S * 0.06);
      FR.ell(g, pLamp[0], pLamp[1], S * 0.12, S * 0.14, '#ecfdf5');
      const pSkull = fI(2.78, 0, 1.25);
      FR.ell(g, pSkull[0], pSkull[1], S * 0.22, S * 0.22, '#e4e4e7', '#18181b', S * 0.05);
      [-2.15, -1.15].forEach(px => {
        FR.ln(g, fI(px, -W * 0.88, 0.95), fI(px, -W * 0.88, 1.82), '#27272a', S * 0.09);
        FR.ln(g, fI(px,  W * 0.88, 0.95), fI(px,  W * 0.88, 1.82), '#71717a', S * 0.11);
      });
      FR.rbox(g, Pj, -1.65, 0, Z + 1.82, 1.35, 1.92, 0.20, 0, '#18181b', { top: '#581c87' });
      [-0.8, 0.6].forEach(ox => {
        FR.ln(g, fI(ox, W + 0.04, 0.88), fI(ox - 0.45, W + 0.14, 0.24), '#52525b', S * 0.09);
      });
    }
    else if (theme === 'fiesta') {
      [-1.75, 0, 1.75].forEach(px => {
        FR.ln(g, fI(px, -W * 0.9, 0.88), fI(px, -W * 0.9, 1.72), '#f59e0b', S * 0.09);
        FR.ln(g, fI(px,  W * 0.9, 0.88), fI(px,  W * 0.9, 1.72), '#f59e0b', S * 0.11);
      });
      FR.rbox(g, Pj, 0, 0, Z + 1.72, 3.85, 2.05, 0.22, 0, '#e11d48', { top: '#facc15' });
      for (let k = -5; k <= 5; k++) {
        const fp = fI(k * 0.34, W + 0.02, 1.84);
        FR.ell(g, fp[0], fp[1], S * 0.15, S * 0.15, k % 2 ? '#fde047' : '#10b981');
      }
    }
    else if (theme === 'jungle') {
      const pTip = fI(3.35, 0, 0.65);
      FR.poly(g, [fI(2.45, -0.65, 0.95), pTip, fI(2.45, 0.65, 0.95), fI(2.45, 0, 0.45)], '#15803d', '#14532d', S * 0.06);
      FR.ell(g, ...fI(2.65, 0.35, 0.98), S * 0.13, S * 0.13, '#facc15', '#0f172a', S * 0.04);
      [-1.65, 1.65].forEach(px => {
        FR.ln(g, fI(px, -W * 0.88, 0.88), fI(px, -W * 0.88, 1.72), '#a16207', S * 0.09);
        FR.ln(g, fI(px,  W * 0.88, 0.88), fI(px,  W * 0.88, 1.72), '#ca8a04', S * 0.11);
      });
      FR.rbox(g, Pj, 0, 0, Z + 1.72, 3.75, 1.98, 0.22, 0, '#b5893d', { top: '#d97706' });
    }
    else if (theme === 'frontier') {
      [-2.55, 2.55].forEach(ex => {
        const pTip = fI(ex, 0, 1.55);
        FR.ell(g, pTip[0], pTip[1], S * 0.24, S * 0.32, '#8a5a33', '#451a03', S * 0.06);
      });
      [-1.2, 0.2, 1.4].forEach(px => {
        FR.ln(g, fI(px, W + 0.03, 0.92), fI(px - 0.35, W + 0.12, 0.25), '#8a5a33', S * 0.09);
      });
    }
    else if (theme === 'medieval') {
      const pLion = fI(2.75, 0, 1.15);
      FR.ell(g, pLion[0], pLion[1], S * 0.34, S * 0.30, gold, goldD, S * 0.06);
      FR.ell(g, pLion[0] + S * 0.12, pLion[1] - S * 0.06, S * 0.18, S * 0.18, goldL);
      [-1.5, -0.5, 0.5, 1.5].forEach((sx, si) => {
        const sp = fI(sx, W + 0.03, 0.72);
        FR.poly(g, [[sp[0] - S * 0.18, sp[1] - S * 0.18], [sp[0] + S * 0.18, sp[1] - S * 0.18], [sp[0] + S * 0.18, sp[1] + S * 0.08], [sp[0], sp[1] + S * 0.26], [sp[0] - S * 0.18, sp[1] + S * 0.08]], si % 2 ? '#b91c1c' : gold, goldL, S * 0.04);
      });
    }
  }

  // 18–20. SPACE, ALPS, BAVARIAN
  else if (theme === 'space') {
    [-1.45, 0, 1.45].forEach(tx => {
      const tp = fI(tx, 0, 0.22);
      FR.ell(g, tp[0], tp[1], S * 0.45, S * 0.22, '#22d3ee', '#ffffff', S * 0.05);
    });
    FR.rbox(g, Pj, -0.15, 0, Z + 0.32, 4.45, 2.08, 0.65, 0, '#e2e8f0', { top: '#0284c7' });
    FR.poly(g, [fI(2.05, -0.92, 0.35), fI(2.85, 0, 0.45), fI(2.05, 0.92, 0.35), fI(2.05, 0, 0.98)], '#0284c7', '#22d3ee', S * 0.06);
    FR.poly(g, [fI(-0.8, 1.06, 0.55), fI(0.8, 1.06, 0.55), fI(0.2, 1.65, 0.45), fI(-1.1, 1.65, 0.45)], '#38bdf8', '#0f172a', S * 0.05);
    drawRiders4Rows([-1.50, -0.50, 0.50, 1.45], 0.78, '#0f172a');
    FR.rbox(g, Pj, -2.15, 0, Z + 0.95, 0.55, 1.85, 0.72, 0, '#0284c7', { top: '#22d3ee' });
  }
  else if (theme === 'alps') {
    FR.rbox(g, Pj, 0, 0, Z + 0.28, 4.45, 2.02, 0.72, 0, '#dc2626', { top: '#f8fafc' });
    const sc = fI(0, 1.03, 0.62);
    FR.ln(g, [sc[0] - S * 0.22, sc[1]], [sc[0] + S * 0.22, sc[1]], '#ffffff', S * 0.11);
    FR.ln(g, [sc[0], sc[1] - S * 0.22], [sc[0], sc[1] + S * 0.22], '#ffffff', S * 0.11);
    drawRiders4Rows([-1.50, -0.50, 0.50, 1.50], 0.80, '#0284c7');
    [-2.05, -0.70, 0.70, 2.05].forEach(px => {
      FR.ln(g, fI(px, -0.96, 0.98), fI(px, -0.96, 1.74), '#991b1b', S * 0.10);
      FR.ln(g, fI(px,  0.96, 0.98), fI(px,  0.96, 1.74), '#dc2626', S * 0.12);
    });
    FR.rbox(g, Pj, 0, 0, Z + 1.74, 4.35, 1.98, 0.20, 0, '#f8fafc', { top: '#ffffff' });
    FR.rbox(g, Pj, 0, 0, Z + 1.94, 1.45, 0.85, 0.25, 0, '#475569', { top: '#facc15' });
  }
  else if (theme === 'bavarian') {
    drawWheel3D(-1.38, -1.08, 0.44, 0.54, '#451a03', gold, true);
    drawWheel3D( 1.38, -1.08, 0.44, 0.54, '#451a03', gold, true);
    FR.rbox(g, Pj, 0, 0, Z + 0.36, 4.45, 2.05, 0.62, 0, '#78350f', { top: '#92400e' });
    for (let k = -4; k <= 4; k++) {
      const dp = fI(k * 0.46, 1.04, 0.68);
      FR.poly(g, [[dp[0], dp[1] - S * 0.14], [dp[0] + S * 0.14, dp[1]], [dp[0], dp[1] + S * 0.14], [dp[0] - S * 0.14, dp[1]]], k % 2 ? '#2563eb' : '#ffffff');
    }
    drawRiders4Rows([-1.25, -0.42, 0.42, 1.25], 0.78, '#1d4ed8');
    [-2.02, 2.02].forEach(bx => {
      FR.rbox(g, Pj, bx, 0, Z + 0.88, 0.68, 1.55, 0.65, 0, '#92400e', { top: gold });
    });
    drawWheel3D(-1.38, 1.08, 0.44, 0.54, '#451a03', gold, true);
    drawWheel3D( 1.38, 1.08, 0.44, 0.54, '#451a03', gold, true);
  }
}

/**
 * Corner Architectural Posts / Pillars / Statues for the 4 corners of the Raised Courtyard
 */
function cbCornerPost(g, Pj, S, X, Y, Z0, H, sk, A) {
  const gold = '#f5c542', goldL = '#fff3b0';
  FR.rbox(g, Pj, X, Y, Z0, 0.68, 0.68, 0.34, 0, sk.trim);
  FR.rbox(g, Pj, X, Y, Z0 + 0.34, 0.46, 0.46, H, 0, sk.tow, { top: '#ffffff' });
  FR.rbox(g, Pj, X, Y, Z0 + 0.34 + H * 0.45, 0.52, 0.52, 0.22, 0, sk.band1);
  const topZ = Z0 + 0.34 + H;
  FR.rbox(g, Pj, X, Y, topZ, 0.70, 0.70, 0.18, 0, sk.trim);
  const dp = Pj(X, Y, topZ + 0.48);

  if (sk.crown === 'pagoda' || sk.crown === 'dojo_roof') {
    // Upturned curved Pagoda / Dojo corner roof + hanging lantern
    FR.poly(g, [[dp[0] - S * 0.68, dp[1] + S * 0.18], [dp[0], dp[1] - S * 0.42], [dp[0] + S * 0.68, dp[1] + S * 0.18]], sk.band2, gold, S * 0.05);
    FR.ell(g, dp[0], dp[1] - S * 0.46, S * 0.14, S * 0.14, goldL);
    FR.ell(g, dp[0] + S * 0.42, dp[1] + S * 0.42, S * 0.15, S * 0.20, sk.crown === 'pagoda' ? '#ef4444' : '#fef3c7', gold, S * 0.04);
  }
  else if (sk.crown === 'radar') {
    // Batuu rotating radar dish & orange beacon
    FR.ell(g, dp[0], dp[1], S * 0.46, S * 0.24, '#cbd5e1', '#1e293b', S * 0.05);
    FR.ell(g, dp[0], dp[1] - S * 0.22, S * 0.14, S * 0.14, '#f97316');
  }
  else if (sk.crown === 'amber') {
    // Jurassic amber sphere & tropical palm fronds
    FR.ell(g, dp[0], dp[1], S * 0.42, S * 0.42, '#f59e0b', '#fef08a', S * 0.05);
    FR.ell(g, dp[0] - S * 0.25, dp[1] + S * 0.22, S * 0.32, S * 0.14, '#15803d');
  }
  else if (sk.crown === 'aquila' || sk.crown === 'pediment') {
    // Classical Roman / Greek urn & golden finial
    FR.ell(g, dp[0], dp[1], S * 0.38, S * 0.44, sk.crown === 'aquila' ? '#b91c1c' : '#0284c7', gold, S * 0.05);
    FR.ell(g, dp[0], dp[1] - S * 0.45, S * 0.20, S * 0.20, goldL);
  }
  else if (sk.crown === 'solar_disc' || sk.crown === 'ziggurat') {
    // Stepped Ziggurat / Golden Scarab Obelisk finial
    FR.rbox(g, Pj, X, Y, topZ + 0.18, 0.56, 0.56, 0.24, 0, sk.band1, { top: gold });
    FR.rbox(g, Pj, X, Y, topZ + 0.42, 0.36, 0.36, 0.24, 0, gold, { top: goldL });
  }
  else if (sk.crown === 'orb') {
    FR.ell(g, dp[0], dp[1], S * 0.42, S * 0.42, '#22d3ee', '#ffffff', S * 0.06);
  }
  else if (sk.crown === 'brazier') {
    FR.poly(g, [[dp[0] - S * 0.28, dp[1] + S * 0.15], [dp[0], dp[1] - S * 0.65], [dp[0] + S * 0.28, dp[1] + S * 0.15]], '#f97316');
    FR.poly(g, [[dp[0] - S * 0.14, dp[1] + S * 0.15], [dp[0], dp[1] - S * 0.42], [dp[0] + S * 0.14, dp[1] + S * 0.15]], '#fde047');
  }
  else {
    FR.ell(g, dp[0], dp[1], S * 0.46, S * 0.42, sk.band2, gold, S * 0.05);
    FR.ell(g, dp[0] - S * 0.10, dp[1] - S * 0.10, S * 0.16, S * 0.14, goldL);
    FR.poly(g, [[dp[0] - S * 0.16, dp[1] - S * 0.30], [dp[0] + S * 0.16, dp[1] - S * 0.30], [dp[0], dp[1] - S * 0.88]], gold);
  }
}

function makeCrazyBusDrawer(theme, A) {
  const sk = CRAZY_BUS_SKINS[theme] || CRAZY_BUS_SKINS.unthemed;
  const gold = '#f5c542', goldD = '#b8861b', goldL = '#fff3b0';
  const carAt = {};

  return function (g, Pj, S, part, t) {
    const getCar = carAt[S] || (carAt[S] = FR.atlas(S, 8.2 * S, 5.8 * S, 4.1 * S, 3.8 * S, 1, (g2, P2) => {
      cbGondola(g2, P2, S, theme, A);
    }));

    const omega = 1.65;
    const theta = (t || 0) * omega + 0.65;
    const dx = CB_CFG.armR * Math.cos(theta);
    const dz = CB_CFG.armR * Math.sin(theta);
    const carX = dx;
    const carY = CB_CFG.carY;
    const carZ = CB_CFG.pivZ + dz - 1.15;

    if (part === 'back') {
      const c0 = Pj(0, 0, 0);
      g.fillStyle = 'rgba(15, 20, 28, 0.30)';
      g.beginPath(); g.ellipse(c0[0] + S * 0.35, c0[1] + S * 0.25, 7.4 * S, 3.7 * S, 0, 0, 7); g.fill();

      // Main Raised 3D Architectural Platform Base
      FR.rbox(g, Pj, 0, 0, 0, 9.2, 6.8, 0.48, 0, shade(sk.plinth, -0.15), { top: sk.plinth });

      // Decorative mosaic / hazard / stone border tiles along the +Y and +X platform skirts
      const N = 12;
      for (let i = 0; i < N; i++) {
        const x0 = -4.6 + 9.2 * i / N, x1 = -4.6 + 9.2 * (i + 1) / N;
        FR.poly(g, [Pj(x0, 3.41, 0.06), Pj(x1, 3.41, 0.06), Pj(x1, 3.41, 0.42), Pj(x0, 3.41, 0.42)], i % 3 === 0 ? sk.trim : i % 3 === 1 ? sk.band1 : sk.band2);
      }
      for (let j = 0; j < 8; j++) {
        const y0 = -3.4 + 6.8 * j / 8, y1 = -3.4 + 6.8 * (j + 1) / 8;
        FR.poly(g, [Pj(4.61, y0, 0.06), Pj(4.61, y1, 0.06), Pj(4.61, y1, 0.42), Pj(4.61, y0, 0.42)], j % 2 ? shade(sk.band1, -0.2) : shade(sk.band2, -0.2));
      }

      // Inner Courtyard Floor & Inlaid Center Runner
      FR.poly(g, [Pj(-4.15, -2.95, 0.49), Pj(4.15, -2.95, 0.49), Pj(4.15, 2.95, 0.49), Pj(-4.15, 2.95, 0.49)], sk.floor1, sk.trim, S * 0.08);
      FR.poly(g, [Pj(-3.4, -2.2, 0.50), Pj(3.4, -2.2, 0.50), Pj(3.4, 2.2, 0.50), Pj(-3.4, 2.2, 0.50)], sk.floor2, sk.trim, S * 0.06);
      for (let k = -2; k <= 2; k++) {
        const mx = k * 1.25;
        FR.poly(g, [Pj(mx - 0.45, 0, 0.51), Pj(mx, -0.45, 0.51), Pj(mx + 0.45, 0, 0.51), Pj(mx, 0.45, 0.51)], k % 2 ? sk.trim : sk.band1, goldL, S * 0.03);
      }

      // Theme-Specific Courtyard Props (Spare Wheels for Rome/Greece Workshops, Thrusters for Galactic Outpost, Palm Planters for Jurassic Island)
      if (theme === 'ancient_rome' || theme === 'ancient_greece') {
        // Stacked wooden spoked chariot wheels & lumber rack on the right deck (+3.2, -1.8)
        [0.56, 0.72, 0.88].forEach(wz => {
          const wp = Pj(3.15, -1.85, wz);
          FR.ell(g, wp[0], wp[1], S * 0.52, S * 0.28, '#78350f', gold, S * 0.05);
        });
      }
      else if (theme === 'galactic_outpost') {
        // Spare hyperdrive fuel canisters & diagnostic crate on right deck
        FR.rbox(g, Pj, 3.15, -1.85, 0.49, 0.95, 0.75, 0.72, 0, '#c2410c', { top: '#94a3b8' });
        FR.ell(g, ...Pj(3.15, -1.85, 1.25), S * 0.24, S * 0.14, '#38bdf8');
      }
      else if (theme === 'jurassic_island') {
        // Tropical fern & palm frond planter at right courtyard
        const fp = Pj(3.15, -1.85, 0.65);
        FR.ell(g, fp[0], fp[1], S * 0.55, S * 0.30, '#15803d', '#052e16', S * 0.04);
      }

      // 3D Operator Control Booth / Shrine / Workshop Office at back-left corner (-X, -Y)
      FR.rbox(g, Pj, -3.55, -2.05, 0.48, 1.5, 1.4, 1.75, 0, sk.tow, { top: sk.trim });
      FR.poly(g, [Pj(-3.55, -1.34, 1.15), Pj(-2.85, -1.34, 1.15), Pj(-2.85, -1.34, 1.95), Pj(-3.55, -1.34, 1.95)],
        (theme === 'china' || theme === 'japan') ? '#fef3c7' : '#38bdf8', sk.band1, S * 0.05);
      const bDome = Pj(-3.55, -2.05, 2.65);
      if (theme === 'china' || theme === 'japan') {
        FR.poly(g, [[bDome[0] - S * 0.95, bDome[1] + S * 0.25], [bDome[0], bDome[1] - S * 0.65], [bDome[0] + S * 0.95, bDome[1] + S * 0.25]], sk.band2, gold, S * 0.06);
      } else {
        FR.ell(g, bDome[0], bDome[1], S * 0.62, S * 0.52, sk.band2, sk.trim, S * 0.06);
        FR.ell(g, bDome[0] - S * 0.15, bDome[1] - S * 0.12, S * 0.22, S * 0.18, goldL);
      }

      // Two Rear Corner Architectural Pillars / Minarets
      cbCornerPost(g, Pj, S, -4.25, -3.05, 0.48, 1.85, sk, A);
      cbCornerPost(g, Pj, S,  4.25, -3.05, 0.48, 1.85, sk, A);

      // Back perimeter balustrade railing
      for (let k = -3; k <= 3; k++) {
        const X = k * 1.1;
        FR.ln(g, Pj(X, -3.15, 0.48), Pj(X, -3.15, 1.22), sk.trim, S * 0.08);
      }
      FR.ln(g, Pj(-3.9, -3.15, 1.20), Pj(3.9, -3.15, 1.20), sk.band1, S * 0.11);
      FR.ln(g, Pj(-3.9, -3.15, 0.88), Pj(3.9, -3.15, 0.88), sk.trim,  S * 0.07);
    }

    if (part === 'hub') {
      // Twin Sculpted Support Towers at Y = CB_CFG.pivY (-1.42)
      CB_CFG.pivX.forEach(tx => {
        FR.rbox(g, Pj, tx, CB_CFG.pivY, 0.48, 1.22, 1.14, 0.38, 0, shade(sk.trim, -0.25), { top: sk.trim });
        FR.rbox(g, Pj, tx, CB_CFG.pivY, 0.86, 0.88, 0.84, 4.05, 0, sk.tow, { top: sk.trim });
        FR.rbox(g, Pj, tx, CB_CFG.pivY, 1.65, 0.92, 0.88, 0.38, 0, sk.band1);
        FR.rbox(g, Pj, tx, CB_CFG.pivY, 3.05, 0.92, 0.88, 0.38, 0, sk.band2);
        FR.ln(g, Pj(tx, CB_CFG.pivY + 0.44, 1.0), Pj(tx, CB_CFG.pivY + 0.44, 4.5), sk.trim, S * 0.08);
      });

      // Ornate Illuminated Overhead Marquee Bridge spanning between the twin towers
      FR.rbox(g, Pj, 0, CB_CFG.pivY - 0.08, 4.65, 5.35, 0.60, 1.38, 0, sk.band1, { top: sk.trim });
      const crown = Pj(0, CB_CFG.pivY + 0.15, 6.45);

      // Theme-bespoke centerpiece crowning the marquee!
      if (sk.crown === 'pagoda' || sk.crown === 'dojo_roof') {
        FR.poly(g, [[crown[0] - S * 1.85, crown[1] + S * 0.25], [crown[0], crown[1] - S * 0.95], [crown[0] + S * 1.85, crown[1] + S * 0.25]], sk.band2, gold, S * 0.07);
        FR.ell(g, crown[0], crown[1] - S * 1.05, S * 0.22, S * 0.22, goldL);
      }
      else if (sk.crown === 'radar') {
        FR.ell(g, crown[0], crown[1] - S * 0.15, S * 1.05, S * 0.45, '#cbd5e1', '#1e293b', S * 0.06);
        FR.ln(g, [crown[0], crown[1] - S * 0.15], [crown[0], crown[1] - S * 0.95], '#94a3b8', S * 0.09);
        FR.ell(g, crown[0], crown[1] - S * 0.98, S * 0.18, S * 0.18, '#f97316');
      }
      else if (sk.crown === 'solar_disc') {
        FR.ln(g, [crown[0] - S * 1.35, crown[1]], [crown[0] + S * 1.35, crown[1]], gold, S * 0.22);
        FR.ell(g, crown[0], crown[1], S * 0.55, S * 0.55, '#dc2626', goldL, S * 0.06);
      }
      else if (sk.crown === 'ziggurat') {
        FR.ell(g, crown[0], crown[1], S * 1.15, S * 0.65, '#1d4ed8', gold, S * 0.06);
        FR.ell(g, crown[0], crown[1], S * 0.65, S * 0.45, goldL);
      }
      else {
        FR.ell(g, crown[0], crown[1], S * 1.18, S * 0.62, sk.trim);
        FR.ell(g, crown[0], crown[1], S * 0.85, S * 0.44, sk.band2);
        FR.poly(g, [[crown[0] - S * 0.2, crown[1] - S * 0.5], [crown[0] + S * 0.2, crown[1] - S * 0.5], [crown[0], crown[1] - S * 1.15]], goldL);
      }

      // Recessed sign board & chasing marquee bulbs
      const sL = Pj(-2.38, CB_CFG.pivY + 0.24, 4.82), sR = Pj(2.38, CB_CFG.pivY + 0.24, 4.82), sTR = Pj(2.38, CB_CFG.pivY + 0.24, 5.88), sTL = Pj(-2.38, CB_CFG.pivY + 0.24, 5.88);
      FR.poly(g, [sL, sR, sTR, sTL], '#111827', sk.trim, S * 0.13);
      for (let k = 0; k <= 12; k++) {
        const bx = -2.25 + 4.5 * k / 12;
        [4.86, 5.84].forEach((bz, row) => {
          const bp = Pj(bx, CB_CFG.pivY + 0.27, bz);
          FR.ell(g, bp[0], bp[1], S * 0.08, S * 0.08, (k + row) % 2 ? goldL : '#38bdf8');
        });
      }

      // Isometric skewed Marquee Title
      const o = Pj(-2.38, CB_CFG.pivY + 0.28, 5.85);
      g.save();
      g.transform(0.7, 0.35, 0, 1, o[0], o[1]);
      g.fillStyle = (theme === 'space' || theme === 'galactic_outpost') ? '#38bdf8' : goldL;
      g.font = 'bold ' + (0.54 * S) + 'px Arial Black, Arial, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(sk.sign, 2.38 * S, 0.52 * S, 4.55 * S);
      g.restore();

      // Tower Crowns atop both support towers
      CB_CFG.pivX.forEach(tx => {
        const dp = Pj(tx, CB_CFG.pivY, 6.35);
        if (sk.crown === 'pagoda' || sk.crown === 'dojo_roof') {
          FR.poly(g, [[dp[0] - S * 0.82, dp[1] + S * 0.18], [dp[0], dp[1] - S * 0.55], [dp[0] + S * 0.82, dp[1] + S * 0.18]], sk.band2, gold, S * 0.06);
        } else {
          FR.ell(g, dp[0], dp[1], S * 0.55, S * 0.48, sk.trim);
          FR.ell(g, dp[0] - S * 0.12, dp[1] - S * 0.10, S * 0.18, S * 0.15, goldL);
          FR.poly(g, [[dp[0] - S * 0.15, dp[1] - S * 0.38], [dp[0] + S * 0.15, dp[1] - S * 0.38], [dp[0], dp[1] - S * 1.05]], sk.band2);
        }
      });
    }

    if (part === 'cars_front') {
      const shP = Pj(carX, carY, 0.52);
      const shScale = Math.max(0.50, 1.0 - (carZ - 0.5) * 0.085);
      g.fillStyle = 'rgba(12, 16, 26, 0.34)';
      g.beginPath(); g.ellipse(shP[0], shP[1], S * 2.85 * shScale, S * 1.28 * shScale, 0, 0, 7); g.fill();

      // Four-Bar Parallel Linkage Arms & Counterweight Drums
      CB_CFG.pivX.forEach(px => {
        [0, -0.36].forEach((zOff, barIdx) => {
          const piv    = Pj(px, CB_CFG.pivY + 0.35, CB_CFG.pivZ + zOff);
          const busPin = Pj(px + dx, carY - 0.92, CB_CFG.pivZ + zOff + dz);
          if (barIdx === 0) {
            const cwEnd = Pj(px - CB_CFG.cwR * Math.cos(theta), CB_CFG.pivY + 0.35, CB_CFG.pivZ - CB_CFG.cwR * Math.sin(theta));
            FR.ln(g, piv, cwEnd, shade(sk.arm1, -0.35), S * 0.30);
            FR.ln(g, piv, cwEnd, sk.arm2, S * 0.15);
            FR.ell(g, cwEnd[0], cwEnd[1], S * 0.42, S * 0.42, sk.trim);
            FR.ell(g, cwEnd[0], cwEnd[1], S * 0.26, S * 0.26, sk.cw);
            FR.ell(g, cwEnd[0], cwEnd[1], S * 0.12, S * 0.12, goldL);
          }
          FR.ln(g, piv, busPin, barIdx === 0 ? shade(sk.arm1, -0.35) : shade(sk.arm2, -0.3), S * (barIdx === 0 ? 0.32 : 0.19));
          FR.ln(g, piv, busPin, barIdx === 0 ? sk.arm1 : sk.arm2, S * (barIdx === 0 ? 0.18 : 0.10));
        });

        const pivTop = Pj(px, CB_CFG.pivY + 0.36, CB_CFG.pivZ);
        FR.ell(g, pivTop[0], pivTop[1], S * 0.38, S * 0.38, sk.trim);
        FR.ell(g, pivTop[0], pivTop[1], S * 0.22, S * 0.22, sk.band1);
        FR.ell(g, pivTop[0], pivTop[1], S * 0.10, S * 0.10, goldL);
      });

      const cSpr = getCar(0, 0);
      const cp = Pj(carX, carY, carZ);
      g.drawImage(cSpr.cv, cp[0] - cSpr.ox, cp[1] - cSpr.oy, cSpr.w, cSpr.h);
    }

    if (part === 'front') {
      // Front Grand Boarding Steps (+Y edge) with Runner
      FR.rbox(g, Pj, 0, 3.68, 0, 2.55, 0.62, 0.26, 0, shade(sk.plinth, -0.15), { top: sk.plinth });
      FR.rbox(g, Pj, 0, 3.68, 0.02, 1.55, 0.64, 0.26, 0, sk.band1, { top: sk.trim });

      // Front & Side Ornate Balustrade Railings
      const postX = [-3.8, -2.8, -1.9, -1.25, 1.25, 1.9, 2.8, 3.8];
      postX.forEach(X => {
        FR.ln(g, Pj(X, 3.22, 0.48), Pj(X, 3.22, 1.25), sk.trim, S * 0.09);
        FR.ell(g, ...Pj(X, 3.22, 1.28), S * 0.08, S * 0.08, goldL);
      });
      [[-3.8, -1.25], [1.25, 3.8]].forEach(([x0, x1]) => {
        FR.ln(g, Pj(x0, 3.22, 1.20), Pj(x1, 3.22, 1.20), sk.band1, S * 0.11);
        FR.ln(g, Pj(x0, 3.22, 0.86), Pj(x1, 3.22, 0.86), sk.trim,  S * 0.08);
      });
      for (let k = -2; k <= 2; k++) {
        FR.ln(g, Pj(4.25, k * 1.1, 0.48), Pj(4.25, k * 1.1, 1.22), sk.trim, S * 0.08);
      }
      FR.ln(g, Pj(4.25, -2.8, 1.20), Pj(4.25, 2.8, 1.20), sk.band1, S * 0.10);

      // Two Front Corner Pillars framing the entrance
      cbCornerPost(g, Pj, S, -4.25, 3.15, 0.48, 1.65, sk, A);
      cbCornerPost(g, Pj, S,  4.25, 3.15, 0.48, 1.65, sk, A);
    }
  };
}

/**
 * PUBLIC ENGINE ENTRY POINT:
 *  drawCrazyBus(ctx, cx, cy, R, { themeId, rideThemeTier, accent, t, tile })
 */
function drawCrazyBus(ctx, cx, cy, R, o) {
  o = o || {};
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTheme = String(o.themeId || o.theme || 'unthemed').toLowerCase().replace(/[\s-]+/g, '_');
  if (rawTheme === 'wildwest' || rawTheme === 'wild_west') rawTheme = 'western';
  if (rawTheme === 'german') rawTheme = 'bavarian';
  if (rawTheme === 'standard') rawTheme = 'unthemed';
  if (rawTheme === 'galaxys_edge' || rawTheme === 'galactic') rawTheme = 'galactic_outpost';
  if (rawTheme === 'jurassic') rawTheme = 'jurassic_island';
  if (rawTheme === 'rome') rawTheme = 'ancient_rome';
  if (rawTheme === 'greece') rawTheme = 'ancient_greece';
  const theme = (tier <= 2 || !CRAZY_BUS_SKINS[rawTheme]) ? 'unthemed' : rawTheme;
  const skin = CRAZY_BUS_SKINS[theme] || CRAZY_BUS_SKINS.unthemed;
  const A = o.accent || skin.border || '#f59e0b';

  if (o.tile) {
    FR.hex(ctx, cx, cy, R, o.ground || skin.hex, A);
  }
  const cacheKey = 'cb|' + theme + '|' + R + '|' + A + '|' + getCampusBakeScale();
  FR._order = FR._order || [];
  const previous = FR._order.indexOf(cacheKey);
  if (previous !== -1) FR._order.splice(previous, 1);
  FR._order.push(cacheKey);
  if (FR._order.length > 12) {
    const oldest = FR._order.shift();
    delete FR._d[oldest];
    if (FR._c) delete FR._c[oldest];
  }
  const fn = FR._d[cacheKey] || (FR._d[cacheKey] = makeCrazyBusDrawer(theme, A));
  FR.render(ctx, cx, cy, R, cacheKey, 1.48, 1.65, 1.12, fn, o.t);
}
const drawFlyingCarpet = drawCrazyBus;
const drawMagicCarpet  = drawCrazyBus;
/* ===== END CRAZY BUS SPRITE CODE ===== */


NEW_SPRITE_PACKS.rides.crazy_bus = { skins: CRAZY_BUS_SKINS, draw: drawCrazyBus };
})();

(function () {

/* ===== SHARED HELPERS (skip if already in engine.js) ===== */
function shade(hex, amt){
  if(!hex || hex[0]!=='#') return hex || '#888888';
  const n=parseInt(hex.slice(1),16); let r=n>>16, g=(n>>8)&255, b=n&255;
  const f=c=>Math.max(0,Math.min(255,Math.round(amt<0?c*(1+amt):c+(255-c)*amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

/* ===== FLAT RIDES ENGINE (FR) WITH 3.5x HiDPI SUPERSAMPLING ===== */
const FR={
  proj(cx,cy,S){return(X,Y,Z)=>[cx+(X-Y)*0.7*S,cy+(X+Y)*0.35*S-Z*S];},
  poly(g,pts,fill,stroke,lw){g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();if(fill){g.fillStyle=fill;g.fill();g.strokeStyle=fill;g.lineWidth=0.6;g.stroke();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();}},
  ell(g,x,y,rx,ry,fill){g.fillStyle=fill;g.beginPath();g.ellipse(x,y,Math.max(0.4,rx),Math.max(0.4,ry),0,0,7);g.fill();},
  ln(g,a,b,col,w){g.strokeStyle=col;g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();},
  rbox(g,Pj,x0,y0,z0,l,w,h,psi,col,o){o=o||{};const c=Math.cos(psi),s=Math.sin(psi),pts=[[-l/2,-w/2],[l/2,-w/2],[l/2,w/2],[-l/2,w/2]].map(([a,b])=>[x0+a*c-b*s,y0+a*s+b*c]),faces=[];
    for(let i=0;i<4;i++){const A=pts[i],B=pts[(i+1)%4],dx=B[0]-A[0],dy=B[1]-A[1],m=Math.hypot(dx,dy)||1,nx=dy/m,ny=-dx/m;if(nx+ny>0.02)faces.push({A,B,nx,ny,d:(A[0]+B[0]+A[1]+B[1])/2});}
    faces.sort((p,q)=>p.d-q.d).forEach(f=>{const amt=Math.max(-0.5,Math.min(0.3,-0.12+0.14*f.ny-0.22*f.nx));FR.poly(g,[Pj(f.A[0],f.A[1],z0),Pj(f.B[0],f.B[1],z0),Pj(f.B[0],f.B[1],z0+h),Pj(f.A[0],f.A[1],z0+h)],shade(col,amt));});
    if(!o.noTop)FR.poly(g,pts.map(p=>Pj(p[0],p[1],z0+h)),o.top||shade(col,0.16));},
  hex(g,cx,cy,R,fill,stroke){g.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);g[i?'lineTo':'moveTo'](cx+R*Math.cos(a),cy+R*Math.sin(a)*0.58);}g.closePath();g.fillStyle=fill;g.fill();g.lineWidth=Math.max(1.5,R*0.03);g.strokeStyle=stroke;g.stroke();},
  layers(key,R,Wf,Hf,oyf,draw){FR._c=FR._c||{};if(FR._c[key])return FR._c[key];
    const dpr=(typeof devicePixelRatio==='number'&&devicePixelRatio>1)?devicePixelRatio:1;
    const sc=getCampusBakeScale(),W=Math.ceil(Wf*R),H=Math.ceil(Hf*R),oy=oyf*R,S=R*0.066,res={w:W,h:H,ox:W/2,oy};
    ['back','hub','front','still'].forEach(p=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);const Pj=FR.proj(W/2,oy,S);
      if(p==='still'){draw(g,Pj,S,'back');draw(g,Pj,S,'cars_back',0);draw(g,Pj,S,'hub');draw(g,Pj,S,'cars_front',0);draw(g,Pj,S,'front');}else draw(g,Pj,S,p);res[p]=cv;});return FR._c[key]=res;},
  render(ctx,cx,cy,R,key,Wf,Hf,oyf,draw,t){const L=FR.layers(key,R,Wf,Hf,oyf,draw);if(t==null){ctx.drawImage(L.still,cx-L.ox,cy-L.oy,L.w,L.h);return;}
    const S=R*0.066,Pj=FR.proj(cx,cy,S),bl=n=>ctx.drawImage(L[n],cx-L.ox,cy-L.oy,L.w,L.h);bl('back');draw(ctx,Pj,S,'cars_back',t);bl('hub');draw(ctx,Pj,S,'cars_front',t);bl('front');}
};
FR.atlas=function(S,w,h,ox,oy,n,fn){
  const dpr=(typeof devicePixelRatio==='number'&&devicePixelRatio>1)?devicePixelRatio:1;
  const sc=getCampusBakeScale(),cache=new Map();
  return function(i,psi){const k=Math.round((((psi%6.2832)+6.2832)%6.2832)/6.2832*n)%n,key=i*1000+k;let e=cache.get(key);
    if(!e){const cv=document.createElement('canvas');cv.width=Math.ceil(w*sc);cv.height=Math.ceil(h*sc);const g=cv.getContext('2d');g.scale(sc,sc);fn(g,FR.proj(ox,oy,S),i,k/n*6.2832);e={cv,w,h,ox,oy};if(cache.size>=48)cache.delete(cache.keys().next().value);}else cache.delete(key);cache.set(key,e);return e;};
};
FR._d={};

/* ===== ANTIQUE CARS SKIN METADATA (GENERIC + 19 HEAVY/IMMERSIVE VARIANTS) ===== */
const ANTIQUE_CARS_SKINS = {
  unthemed: {
    id:'unthemed', label:'Generic (Tier 0–2)', name:'Antique Cars',
    sub:'Brass-Radiator Vintage Roadsters & Gazebo Station', sign:'ANTIQUE CARS',
    hex:'#9bbf63', border:'#d9342b', curb:'#bfb7a6', road:'#4c515c', lawn:'#76ad58', line:'#f2c230',
    stWall:'#f2e3c8', stRoof:null,
    cars:['#1c2029','#8a1f26',null,'#e8dcc0','#1f5a3a'], hats:['#1a1a22','#8a6a3a','#e8dcc0','#3a3a46','#5a3b22']
  },

  /* === 8 NEW EXPANSION LANDS === */
  galactic_outpost: {
    id:'galactic_outpost', label:'Galactic Outpost', name:'Batuu Hover Speeders',
    sub:'Repulsorlift Landspeeders, Outrigger Turbines & Hangar Bay', sign:'OUTPOST BAY',
    hex:'#7c6f64', border:'#ea580c', curb:'#57534e', road:'#292524', lawn:'#6b5e54', line:'#f97316',
    stWall:'#64748b', stRoof:'#334155', isNew:true,
    cars:['#cbd5e1','#ea580c','#94a3b8','#64748b','#d97706'], hats:['#334155','#78350f','#1e293b','#451a03','#0f172a']
  },
  jurassic_island: {
    id:'jurassic_island', label:'Jurassic Island', name:'Isla Nublar Gyrospheres',
    sub:'Translucent Glass Gyrospheres, Gyro Chassis & Safari Pavilion', sign:'GYROSPHERE',
    hex:'#4d7c47', border:'#eab308', curb:'#78716c', road:'#57534e', lawn:'#3f6a38', line:'#eab308',
    stWall:'#78350f', stRoof:'#15803d', isNew:true,
    cars:['#eab308','#0284c7','#f59e0b','#16a34a','#38bdf8'], hats:['#78350f','#fef08a','#15803d','#d9b27a','#451a03']
  },
  china: {
    id:'china', label:'China', name:'Imperial Chinese Carriages',
    sub:'Lacquered Anju Pagoda Carriages, Silk Lanterns & Pavilion', sign:'IMPERIAL TOUR',
    hex:'#6e8b5e', border:'#dc2626', curb:'#a8a29e', road:'#57534e', lawn:'#587846', line:'#facc15',
    stWall:'#991b1b', stRoof:'#1e293b', isNew:true,
    cars:['#dc2626','#b91c1c','#991b1b','#c2410c','#7f1d1d'], hats:['#facc15','#1e293b','#fde047','#0f172a','#facc15']
  },
  japan: {
    id:'japan', label:'Japan', name:'Edo Japanese Wagons',
    sub:'Lacquered Gosho-guruma Noble Wagons, Bamboo Blinds & Gatehouse', sign:'EDO WAGON',
    hex:'#5d7a64', border:'#e11d48', curb:'#94a3b8', road:'#475569', lawn:'#4b6852', line:'#f8fafc',
    stWall:'#f8fafc', stRoof:'#1e293b', isNew:true,
    cars:['#1e293b','#991b1b','#0f172a','#7f1d1d','#27272a'], hats:['#1e293b','#facc15','#0f172a','#dc2626','#1e293b']
  },
  ancient_rome: {
    id:'ancient_rome', label:'Ancient Rome', name:'Roman Red Chariots',
    sub:'Imperial Crimson Biga Racing Chariots, Warhorses & Colonnade', sign:'CIRCUS ROMA',
    hex:'#b89f7d', border:'#b91c1c', curb:'#d6d3d1', road:'#78716c', lawn:'#a8906e', line:'#dc2626',
    stWall:'#f5f5f4', stRoof:'#b91c1c', isNew:true,
    cars:['#b91c1c','#dc2626','#991b1b','#b91c1c','#dc2626'], hats:['#facc15','#fde047','#f59e0b','#facc15','#fde047']
  },
  ancient_greece: {
    id:'ancient_greece', label:'Ancient Greece', name:'Hellenic White Chariots',
    sub:'Marble-White Harma Chariots, Aegean Key Trim & Temple Station', sign:'OLYMPIA',
    hex:'#8da4b5', border:'#0284c7', curb:'#e2e8f0', road:'#94a3b8', lawn:'#7792a6', line:'#0284c7',
    stWall:'#ffffff', stRoof:'#0284c7', isNew:true,
    cars:['#f8fafc','#ffffff','#e2e8f0','#f8fafc','#ffffff'], hats:['#0284c7','#facc15','#0369a1','#0284c7','#facc15']
  },
  egypt: {
    id:'egypt', label:'Egypt', name:'Pharaonic Gold Chariots',
    sub:'Hammered-Gold Royal War Chariots, Lapis Inlays & Pylon Gate', sign:'PHARAOH RUN',
    hex:'#d4b475', border:'#d97706', curb:'#e7e5e4', road:'#b5945b', lawn:'#c4a362', line:'#1d4ed8',
    stWall:'#eab308', stRoof:'#1d4ed8', isNew:true,
    cars:['#facc15','#eab308','#d97706','#facc15','#eab308'], hats:['#1d4ed8','#facc15','#0d9488','#1d4ed8','#facc15']
  },
  babylon: {
    id:'babylon', label:'Babylon', name:'Babylonian Blue Chariots',
    sub:'Lapis-Lazuli Glazed Royal Chariots, Gold Rosettes & Ishtar Gate', sign:'ISHTAR TRACK',
    hex:'#8b7e6a', border:'#2563eb', curb:'#93c5fd', road:'#57534e', lawn:'#756956', line:'#facc15',
    stWall:'#1d4ed8', stRoof:'#facc15', isNew:true,
    cars:['#1d4ed8','#1e40af','#2563eb','#1d4ed8','#1e40af'], hats:['#facc15','#ffffff','#fde047','#facc15','#ffffff']
  },

  /* === ORIGINAL 11 THEMED SKINS === */
  western: {
    id:'western', label:'Wild West', name:'Conestoga Covered Wagons',
    sub:'Canvas-Hooped Pioneer Wagons, Dirt Trail & Trading Post', sign:'WAGON TRAIL',
    hex:'#c99a62', border:'#8a5a33', curb:'#8a5a33', road:'#9e7348', lawn:'#b88952', line:'#78350f',
    stWall:'#9a6a3c', stRoof:'#78350f',
    cars:['#9a3412','#78350f','#b45309','#8a5a33','#6b4423'], hats:['#451a03','#78350f','#d9b27a','#291509','#5a3b22']
  },
  gothic: {
    id:'gothic', label:'Gothic', name:'Victorian Horseless Carriages',
    sub:'1890s Tiller-Steered Broughams, Cobblestones & Crypt Gatehouse', sign:'CARRIAGES',
    hex:'#3b3345', border:'#991b1b', curb:'#3f3f46', road:'#18181b', lawn:'#2d2638', line:'#7f1d1d',
    stWall:'#3f3f46', stRoof:'#18181b',
    cars:['#18181b','#450a0a','#3b0764','#27272a','#581c87'], hats:['#09090b','#18181b','#450a0a','#27272a','#09090b']
  },
  medieval: {
    id:'medieval', label:'Medieval', name:'Royal Horse-Drawn Carriages',
    sub:'Gilded Coaches Pulled by Caparisoned Steeds & Keep Station', sign:'ROYAL COACH',
    hex:'#6c8c58', border:'#eab308', curb:'#94a3b8', road:'#64748b', lawn:'#587846', line:'#eab308',
    stWall:'#e2dcd0', stRoof:'#1d4ed8',
    cars:['#b91c1c','#1d4ed8','#7e22ce','#15803d','#b45309'], hats:['#eab308','#facc15','#cbd5e1','#eab308','#f59e0b']
  },
  space: {
    id:'space', label:'Space', name:'Lunar Exploration Rovers',
    sub:'6-Wheel Mars/Moon Buggy Rovers, Dish Antennas & Outpost Hub', sign:'LUNAR ROVERS',
    hex:'#334155', border:'#0ea5e9', curb:'#0f172a', road:'#1e293b', lawn:'#334155', line:'#22d3ee',
    stWall:'#e2e8f0', stRoof:'#0284c7',
    cars:['#f8fafc','#0284c7','#facc15','#e2e8f0','#6366f1'], hats:['#ffffff','#38bdf8','#ffffff','#22d3ee','#ffffff']
  },
  jungle: {
    id:'jungle', label:'Jungle', name:'Safari Offroad Expedition Trucks',
    sub:'4x4 Roll-Cage Jungle Jeeps, Spare Tires & Bamboo Outpost', sign:'SAFARI 4X4',
    hex:'#587c48', border:'#2fbf9a', curb:'#7d765f', road:'#6b5335', lawn:'#3f6a38', line:'#a8a084',
    stWall:'#bdb9a0', stRoof:'#b5893d',
    cars:['#3f6212','#d97706','#b45309','#15803d','#a16207'], hats:['#d9b27a','#fef08a','#d9b27a','#ca8a04','#e2d5b5']
  },
  classic: {
    id:'classic', label:'Classic Midway', name:'1914 Ford Model T Tin Lizzies',
    sub:'Boxy Flat-Roof Model T Sedans, Brass Radiators & Depot', sign:'MODEL T TOUR',
    hex:'#cbb07c', border:'#e11d48', curb:'#d6ceba', road:'#3f4452', lawn:'#76ad58', line:'#facc15',
    stWall:'#fff9ed', stRoof:'#e11d48',
    cars:['#111827','#7f1d1d','#1e3a8a','#14532d','#27272a'], hats:['#1f2937','#d9b27a','#78350f','#f8fafc','#111827']
  },
  fiesta: {
    id:'fiesta', label:'Fiesta', name:'Convertible Antique Cruisers',
    sub:'Vibrant Open-Top Vintage Convertibles, Whitewalls & Hacienda', sign:'PASEO AUTOS',
    hex:'#d99b52', border:'#e11d48', curb:'#f59e0b', road:'#57534e', lawn:'#658c48', line:'#fde047',
    stWall:'#fef3c7', stRoof:'#c2410c',
    cars:['#e11d48','#0d9488','#f59e0b','#ec4899','#2563eb'], hats:['#fde047','#f59e0b','#fef3c7','#e11d48','#fde047']
  },
  frontier: {
    id:'frontier', label:'Frontier', name:'1930s Timber Pickup Trucks',
    sub:'Antique Flatbed Stake-Side Logging Pickups & Timber Barn', sign:'LOGGING TRUCKS',
    hex:'#7d955d', border:'#566e42', curb:'#6b4a2b', road:'#5c4938', lawn:'#526e40', line:'#8a6a45',
    stWall:'#8a5a33', stRoof:'#2f5f3a',
    cars:['#991b1b','#166534','#b45309','#1e3a8a','#7c2d12'], hats:['#78350f','#b91c1c','#451a03','#d97706','#5a3b22']
  },
  alps: {
    id:'alps', label:'Alps', name:'Alpine Postbus Model Ts',
    sub:'Swiss Yellow & Red Model T Mountain Buses & Snow Chalet', sign:'ALPENPOST',
    hex:'#a8c5d6', border:'#0284c7', curb:'#cbd5e1', road:'#475569', lawn:'#e2e8f0', line:'#facc15',
    stWall:'#b45309', stRoof:'#f8fafc',
    cars:['#eab308','#dc2626','#0284c7','#f59e0b','#16a34a'], hats:['#1e293b','#dc2626','#78350f','#0284c7','#15803d']
  },
  nordic: {
    id:'nordic', label:'Nordic', name:'Viking Horse-Drawn Timber Wagons',
    sub:'Draft Horses Pulling Shield-Banded Stave Wagons & Longhouse', sign:'NORSE WAGONS',
    hex:'#4d6b63', border:'#d97706', curb:'#475569', road:'#334155', lawn:'#3f5a52', line:'#94a3b8',
    stWall:'#451a03', stRoof:'#1e293b',
    cars:['#78350f','#7f1d1d','#1e3a8a','#451a03','#92400e'], hats:['#d97706','#94a3b8','#facc15','#78350f','#cbd5e1']
  },
  bavarian: {
    id:'bavarian', label:'Bavarian', name:'Bavarian Touring Phaetons',
    sub:'Polished Brass-Trimmed Vintage Touring Cars & Fachwerk Garage', sign:'OLDTIMER BAHN',
    hex:'#769958', border:'#2563eb', curb:'#cbd5e1', road:'#4b5563', lawn:'#658c48', line:'#f8fafc',
    stWall:'#f8fafc', stRoof:'#b91c1c',
    cars:['#1d4ed8','#991b1b','#f8fafc','#15803d','#b45309'], hats:['#15803d','#1e3a8a','#78350f','#15803d','#451a03']
  }
};

/* Theme aliases */
ANTIQUE_CARS_SKINS.german       = ANTIQUE_CARS_SKINS.bavarian;
ANTIQUE_CARS_SKINS.wildwest     = ANTIQUE_CARS_SKINS.western;
ANTIQUE_CARS_SKINS.standard     = ANTIQUE_CARS_SKINS.unthemed;
ANTIQUE_CARS_SKINS.galaxys_edge = ANTIQUE_CARS_SKINS.galactic_outpost;
ANTIQUE_CARS_SKINS.galactic     = ANTIQUE_CARS_SKINS.galactic_outpost;
ANTIQUE_CARS_SKINS.jurassic     = ANTIQUE_CARS_SKINS.jurassic_island;
ANTIQUE_CARS_SKINS.rome         = ANTIQUE_CARS_SKINS.ancient_rome;
ANTIQUE_CARS_SKINS.greece       = ANTIQUE_CARS_SKINS.ancient_greece;

/* ===== SPRITE CODE ===== */
const AC = {A: 5.8, B: 5.0, w: 1.15, N: 5};
const acPos = (A,B,s) => [(A*Math.cos(s) + B*Math.sin(s))/Math.SQRT2, (-A*Math.cos(s) + B*Math.sin(s))/Math.SQRT2];

function acVehicle(g, Pj, S, X, Y, psi, theme, body, hat, idx){
  const c = Math.cos(psi), s = Math.sin(psi);
  const L = (a,b) => [X + a*c - b*s, Y + a*s + b*c];
  const Z = 0.12;
  const part = (a,b,z,l,w,h,col,o) => { const p=L(a,b); FR.rbox(g,Pj,p[0],p[1],Z+z,l,w,h,psi,col,o); };

  // Wheel helper supporting Vintage Whitewalls, Spoked Wooden/Bronze Wheels, Offroad Knobby Tires, or Lunar Mesh Wheels
  const drawWheel = (a, b, rSc=1, style='vintage') => {
    const p = L(a,b), q = Pj(p[0],p[1],Z+0.36*rSc), hx=c, hy=s, dx=(hx-hy)*0.7*S, dy=(hx+hy)*0.35*S, r=0.36*rSc;
    const rimPts = (rad) => {
      const out=[];
      for(let k=0;k<=12;k++){
        const th=k/12*6.2832;
        out.push([q[0]+rad*(Math.cos(th)*dx), q[1]+rad*(Math.cos(th)*dy - Math.sin(th)*S)]);
      }
      return out;
    };
    const outerCol = (style==='wagon') ? '#451a03'
                   : (style==='bronze') ? '#b45309'
                   : (style==='gold_wheel') ? '#92400e'
                   : (style==='lacquer') ? '#0f172a'
                   : (style==='lunar') ? '#475569' : '#16161b';
    const innerCol = (style==='wagon') ? '#b4824c'
                   : (style==='bronze') ? '#f59e0b'
                   : (style==='gold_wheel') ? '#fde047'
                   : (style==='lacquer') ? '#dc2626'
                   : (style==='lunar') ? '#22d3ee'
                   : (style==='offroad') ? '#64748b' : '#f8f2dc';
    FR.poly(g, rimPts(r), outerCol);
    FR.poly(g, rimPts(r*0.64), innerCol);
    if(style === 'wagon' || style === 'bronze' || style === 'gold_wheel' || style === 'lacquer'){
      const spokeCol = (style==='gold_wheel') ? '#b45309' : (style==='lacquer') ? '#facc15' : '#5a3b22';
      const nSpokes = (style==='lacquer') ? 8 : 6;
      for(let k=0;k<nSpokes;k++){
        const th = k/nSpokes*3.1416;
        const p1=[q[0]+r*0.85*(Math.cos(th)*dx), q[1]+r*0.85*(Math.cos(th)*dy-Math.sin(th)*S)];
        const p2=[q[0]-r*0.85*(Math.cos(th)*dx), q[1]-r*0.85*(Math.cos(th)*dy-Math.sin(th)*S)];
        FR.ln(g, p1, p2, spokeCol, S*0.045);
      }
    }
    FR.ell(g, q[0], q[1], S*0.07*rSc, S*0.07*rSc, style==='lunar' ? '#facc15' : '#d9a63a');
  };

  // Helper to draw two seated passengers at local offset `xR` and height `zR`
  const drawPassengers = (xR, zR, shirtA, shirtB) => {
    [[xR, -0.26, shirtA], [xR, 0.26, shirtB]].forEach(([a,b,sh], i) => {
      const p = L(a,b), q = Pj(p[0],p[1],Z+zR), h = Pj(p[0],p[1],Z+zR+0.48);
      FR.ell(g, q[0], q[1], S*0.20, S*0.24, sh);
      FR.ell(g, h[0], h[1], S*0.16, S*0.16, theme==='space' ? '#ffffff' : '#e8b890');
      if(theme === 'space'){
        FR.ell(g, h[0]+c*S*0.05, h[1]+s*S*0.03, S*0.10, S*0.08, '#0284c7');
      } else if(hat){
        FR.ell(g, h[0], h[1]-S*0.10, S*(i?0.20:0.22), S*0.08, hat);
        FR.ell(g, h[0], h[1]-S*0.13, S*0.13, S*0.10, hat);
      }
    });
  };

  // Helper to draw a Draft Horse / Warhorse in front of Carriages, Wagons & Chariots
  const drawDraftHorse = (hX, horseCol, maneCol, bardingCol) => {
    [-0.30, 0.30].forEach(sy => {
      const p0 = L(0.45, sy), p1 = L(hX+0.15, sy);
      FR.ln(g, Pj(p0[0],p0[1],Z+0.55), Pj(p1[0],p1[1],Z+0.68), '#5a3b22', S*0.065);
    });
    [[hX-0.32,-0.22],[hX-0.32,0.22],[hX+0.32,-0.22],[hX+0.32,0.22]].forEach(([lx,ly]) => {
      const p = L(lx,ly);
      FR.ln(g, Pj(p[0],p[1],Z+0.05), Pj(p[0],p[1],Z+0.65), shade(horseCol,-0.3), S*0.085);
    });
    part(hX, 0, 0.55, 0.96, 0.50, 0.42, horseCol);
    if(bardingCol){
      part(hX-0.05, 0, 0.62, 0.66, 0.56, 0.36, bardingCol, {top:'#facc15'});
    }
    part(hX+0.40, 0, 0.82, 0.30, 0.26, 0.44, horseCol, {top:maneCol});
    part(hX+0.60, 0, 1.04, 0.34, 0.24, 0.22, horseCol);
    const t0 = L(hX-0.50, 0);
    FR.ln(g, Pj(t0[0],t0[1],Z+0.88), Pj(t0[0],t0[1],Z+0.42), maneCol, S*0.09);
  };

  const isChariot = (theme==='ancient_rome' || theme==='ancient_greece' || theme==='egypt' || theme==='babylon');
  const isWheelless = (theme==='galactic_outpost' || theme==='jurassic_island');

  // Wheel lists & styles per theme
  const wList = isWheelless ? []
    : isChariot ? [[-0.45, -0.76], [-0.45, 0.76]]
    : (theme === 'space') ? [[0.98,-0.75],[0.98,0.75],[0,-0.75],[0,0.75],[-0.98,-0.75],[-0.98,0.75]]
    : [[0.95,-0.72],[0.95,0.72],[-0.95,-0.72],[-0.95,0.72]];

  const wStyle = (theme==='western'||theme==='medieval'||theme==='nordic'||theme==='gothic'||theme==='china') ? 'wagon'
               : (theme==='japan') ? 'lacquer'
               : (theme==='ancient_rome'||theme==='ancient_greece') ? 'bronze'
               : (theme==='egypt'||theme==='babylon') ? 'gold_wheel'
               : (theme==='space') ? 'lunar'
               : (theme==='jungle') ? 'offroad' : 'vintage';

  const ws = wList.map(([a,b]) => ({a, b, d: L(a,b)[0] + L(a,b)[1]})).sort((p,q) => p.d - q.d);
  const cd = X + Y;

  // 1. Far-side wheels
  ws.filter(w => w.d < cd).forEach(w => {
    const rScale = isChariot ? 1.28 : (theme==='japan' || theme==='china' ? 1.22 : (wStyle==='wagon'&&w.a<0 ? 1.15 : 1.0));
    drawWheel(w.a, w.b, rScale, wStyle);
  });

  // 2. Theme-Specific Vehicle Bodywork
  if(theme === 'galactic_outpost'){
    // 1. GALACTIC OUTPOST: Sleek Batuu / Star Wars Repulsorlift Hover Speeder (NO wheels!)
    // Glowing cyan/blue repulsorlift hover cushion & ground shadow glow underneath
    const hGlow = Pj(X, Y, 0.04);
    FR.ell(g, hGlow[0], hGlow[1], S*1.55, S*0.78, 'rgba(56, 189, 248, 0.30)');
    FR.ell(g, hGlow[0], hGlow[1], S*0.95, S*0.48, 'rgba(125, 211, 252, 0.42)');

    // Main tapered repulsorlift hull floating at Z+0.34
    part(-0.15, 0, 0.34, 2.25, 1.18, 0.34, body, {top:shade(body, 0.16)});
    // Forked tapered speeder nose prongs (+1.05 .. +1.65)
    part(1.15, -0.26, 0.36, 0.92, 0.36, 0.24, body, {top:'#ea580c'});
    part(1.15,  0.26, 0.36, 0.92, 0.36, 0.24, body, {top:'#ea580c'});
    // Angled wraparound cockpit windscreen & two seated speeder pilots
    part(0.32, 0, 0.68, 0.14, 1.08, 0.36, '#bae6fd', {top:'#38bdf8'});
    drawPassengers(-0.22, 0.86, '#475569', '#c2410c');
    // Twin outrigger turbine pods on rear flanks (-0.75) + top stabilizer fin
    [[-0.75, -0.78], [-0.75, 0.78]].forEach(([tx, ty]) => {
      part(tx, ty, 0.44, 0.88, 0.32, 0.30, '#334155', {top:'#ea580c'});
      const pExhaust = L(tx - 0.46, ty), qEx = Pj(pExhaust[0], pExhaust[1], Z + 0.58);
      FR.ell(g, qEx[0], qEx[1], S*0.13, S*0.13, '#fb923c');
    });
    part(-0.92, 0, 0.68, 0.65, 0.14, 0.46, '#ea580c', {top:'#facc15'});
  }
  else if(theme === 'jurassic_island'){
    // 2. JURASSIC ISLAND: Jurassic World Translucent Glass Gyrosphere!
    const gCenter = Pj(X, Y, Z + 0.96);
    const sphRad = S * 1.12;

    // Inner gyroscopic stabilizer ring & seated safari passengers
    FR.ell(g, gCenter[0], gCenter[1], sphRad * 0.94, sphRad * 0.94, 'rgba(186, 230, 253, 0.22)');
    part(0, 0, 0.28, 1.35, 1.05, 0.26, '#1e293b', {top:'#eab308'});
    drawPassengers(-0.08, 0.78, '#15803d', '#eab308');

    // Outer glossy cyan-tinted glass sphere dome with specular highlight
    g.save();
    g.beginPath();
    g.arc(gCenter[0], gCenter[1], sphRad, 0, 6.2832);
    g.fillStyle = 'rgba(186, 230, 253, 0.34)';
    g.fill();
    g.lineWidth = S * 0.08;
    g.strokeStyle = 'rgba(224, 242, 254, 0.85)';
    g.stroke();
    // Curved specular glass glare arc
    g.beginPath();
    g.arc(gCenter[0] - sphRad * 0.25, gCenter[1] - sphRad * 0.25, sphRad * 0.55, Math.PI * 1.1, Math.PI * 1.65);
    g.strokeStyle = 'rgba(255, 255, 255, 0.78)';
    g.lineWidth = S * 0.09;
    g.stroke();
    g.restore();

    // Left & right yellow/blue gyroscopic axle hub rings
    [-0.95, 0.95].forEach(hy => {
      const hp = L(0, hy), hq = Pj(hp[0], hp[1], Z + 0.96);
      FR.ell(g, hq[0], hq[1], S * 0.28, S * 0.32, body);
      FR.ell(g, hq[0], hq[1], S * 0.13, S * 0.15, '#1e293b');
    });
  }
  else if(theme === 'china'){
    // 3. CHINA: Imperial Chinese Covered Wooden Carriage (Anju / Luche) with Pagoda Roof & Red Lanterns
    drawDraftHorse(1.36, '#f8fafc', '#1e293b', '#dc2626');
    // Crimson & gold lacquered carriage chassis and cabin box (-1.20 .. +0.35)
    part(-0.42, 0, 0.42, 1.65, 1.12, 0.16, '#facc15');
    part(-0.42, 0, 0.58, 1.48, 1.06, 0.62, body, {top:'#facc15'});
    drawPassengers(-0.42, 1.08, '#facc15', '#dc2626');
    // Four golden corner pillars supporting an upturned dark-tile Pagoda Canopy Roof
    [[-1.08,-0.46],[-1.08,0.46],[0.24,-0.46],[0.24,0.46]].forEach(([px,py]) => {
      const p = L(px,py);
      FR.ln(g, Pj(p[0],p[1],Z+1.18), Pj(p[0],p[1],Z+1.72), '#facc15', S*0.07);
    });
    part(-0.42, 0, 1.70, 1.62, 1.24, 0.16, '#1e293b', {top:'#334155'});
    part(-0.42, 0, 1.86, 1.05, 0.82, 0.14, '#facc15', {top:'#fde047'});
    // Hanging red silk palace lanterns at front corners
    [[0.32,-0.58],[0.32,0.58]].forEach(([lx,ly]) => {
      const lp = L(lx,ly), lq = Pj(lp[0],lp[1],Z+1.52);
      FR.ell(g, lq[0], lq[1], S*0.13, S*0.17, '#ef4444');
    });
  }
  else if(theme === 'japan'){
    // 4. JAPAN: Edo-Period Gosho-guruma / Gissha Noble Wagon with Bamboo Blinds & Curved Black Roof
    drawDraftHorse(1.36, '#1e293b', '#facc15', '#dc2626');
    // Black & crimson lacquered noble wagon box (-1.20 .. +0.35)
    part(-0.42, 0, 0.44, 1.68, 1.14, 0.16, '#dc2626');
    part(-0.42, 0, 0.60, 1.52, 1.08, 0.72, body, {top:'#dc2626'});
    // Rolled bamboo sudare screen blinds & passengers
    part(-0.42, -0.55, 0.92, 1.12, 0.06, 0.34, '#d9b27a');
    part(-0.42,  0.55, 0.92, 1.12, 0.06, 0.34, '#d9b27a');
    drawPassengers(-0.42, 1.08, '#dc2626', '#f8fafc');
    // Arched black-lacquered Irimoya wagon roof with gold crest trim
    part(-0.42, 0, 1.32, 1.64, 1.18, 0.22, '#0f172a', {top:'#1e293b'});
    part(-0.42, 0, 1.54, 1.48, 0.68, 0.12, '#facc15');
  }
  else if(isChariot){
    // 5–8. ANCIENT ROME (Red), ANCIENT GREECE (White), EGYPT (Gold), BABYLON (Blue) CHARIOTS!
    const horseCol = (theme==='ancient_rome') ? '#f8fafc'
                   : (theme==='ancient_greece') ? '#d6d3d1'
                   : (theme==='egypt') ? '#d97706' : '#451a03';
    const maneCol  = (theme==='ancient_rome' || theme==='egypt') ? '#facc15' : '#1e293b';
    const trimCol  = (theme==='ancient_rome') ? '#facc15'
                   : (theme==='ancient_greece') ? '#0284c7'
                   : (theme==='egypt') ? '#1d4ed8' : '#facc15';
    const shirtA   = (theme==='ancient_rome') ? '#dc2626'
                   : (theme==='ancient_greece') ? '#0284c7'
                   : (theme==='egypt') ? '#facc15' : '#1d4ed8';
    const shirtB   = (theme==='ancient_rome') ? '#f8fafc'
                   : (theme==='ancient_greece') ? '#facc15'
                   : (theme==='egypt') ? '#0d9488' : '#facc15';

    // Galloping chariot warhorse pulling the chariot yoke pole
    drawDraftHorse(1.26, horseCol, maneCol, body);

    // Chariot axle platform & sculpted semicircular/boxy chariot basket (-1.05 .. +0.18)
    part(-0.45, 0, 0.44, 1.25, 1.26, 0.14, trimCol);
    part(-0.52, 0, 0.58, 1.05, 1.14, 0.56, body, {top:trimCol});
    // High curved front breastwork shield-dash (+0.05) with metallic relief trim
    part(0.02, 0, 0.58, 0.22, 1.16, 0.78, body, {top:trimCol});
    const shieldP = L(0.14, 0), shieldQ = Pj(shieldP[0], shieldP[1], Z + 0.96);
    FR.ell(g, shieldQ[0], shieldQ[1], S*0.22, S*0.24, trimCol);

    // Two standing/riding charioteers inside the open chariot basket
    drawPassengers(-0.52, 1.12, shirtA, shirtB);
  }
  else if(theme === 'western'){
    // WILD WEST: Conestoga Covered Wagon
    part(0, 0, 0.38, 2.55, 1.18, 0.48, body, {top:'#451a03'});
    part(0.82, 0, 0.72, 0.42, 1.12, 0.22, '#5a3b22');
    drawPassengers(0.76, 0.96, '#dc2626', '#2563eb');
    [-0.95, -0.50, -0.05, 0.38].forEach((rx, rIdx) => {
      part(rx, 0, 0.85, 0.44, 1.16, 0.82, rIdx%2 ? '#f5efe0' : '#fdfbf5', {top:'#ffffff'});
    });
    const bp = L(-0.2, 0.68), bq = Pj(bp[0],bp[1],Z+0.62);
    FR.ell(g, bq[0], bq[1], S*0.18, S*0.22, '#78350f');
  }
  else if(theme === 'medieval'){
    // MEDIEVAL: Royal Gilded Horse-Drawn Carriage
    drawDraftHorse(1.38, '#f8fafc', '#f5c542', body);
    part(-0.45, 0, 0.35, 1.85, 1.12, 0.16, '#f5c542');
    part(-0.45, 0, 0.50, 1.55, 1.06, 0.58, body, {top:'#f5c542'});
    drawPassengers(-0.45, 1.05, '#eab308', '#3b82f6');
    [[-1.05,-0.45],[-1.05,0.45],[0.15,-0.45],[0.15,0.45]].forEach(([px,py]) => {
      const p = L(px,py);
      FR.ln(g, Pj(p[0],p[1],Z+1.05), Pj(p[0],p[1],Z+1.62), '#f5c542', S*0.07);
    });
    part(-0.45, 0, 1.60, 1.48, 1.10, 0.18, body, {top:'#f5c542'});
    const crP = L(-0.45, 0), crQ = Pj(crP[0],crP[1],Z+1.88);
    FR.ell(g, crQ[0], crQ[1], S*0.20, S*0.16, '#facc15');
  }
  else if(theme === 'nordic'){
    // NORDIC: Viking Horse-Drawn Timber Wagon
    drawDraftHorse(1.35, '#92400e', '#fde68a', null);
    part(-0.42, 0, 0.38, 1.85, 1.14, 0.52, '#5a361a', {top:'#3e2410'});
    drawPassengers(-0.45, 0.95, '#b91c1c', '#0284c7');
    const dp = L(0.45, 0);
    FR.ln(g, Pj(dp[0],dp[1],Z+0.85), Pj(dp[0],dp[1],Z+1.45), '#f59e0b', S*0.12);
    [[-0.85,-0.62],[-0.15,-0.62],[-0.85,0.62],[-0.15,0.62]].forEach(([sx,sy], si) => {
      const sp = L(sx,sy), sq = Pj(sp[0],sp[1],Z+0.65);
      FR.ell(g, sq[0], sq[1], S*0.20, S*0.20, si%2 ? '#b91c1c' : '#0284c7');
      FR.ell(g, sq[0], sq[1], S*0.07, S*0.07, '#fde047');
    });
  }
  else if(theme === 'gothic'){
    // GOTHIC: 1890s Victorian Horseless Carriage
    part(0, 0, 0.34, 2.35, 1.25, 0.12, '#09090b');
    part(-0.15, 0, 0.45, 1.45, 1.04, 0.56, body, {top:'#7f1d1d'});
    part(0.78, 0, 0.45, 0.22, 1.04, 0.68, '#18181b', {top:'#d97706'});
    const tA = L(0.75, 0), tB = L(0.15, -0.22);
    FR.ln(g, Pj(tA[0],tA[1],Z+1.12), Pj(tB[0],tB[1],Z+1.18), '#f5c542', S*0.06);
    drawPassengers(-0.20, 1.08, '#991b1b', '#6b21a8');
    part(-0.82, 0, 0.95, 0.65, 1.08, 0.72, '#09090b', {top:'#27272a'});
    part(-0.62, 0, 1.55, 0.85, 1.08, 0.16, '#18181b');
    [[0.78,-0.62],[0.78,0.62]].forEach(([lx,ly]) => {
      const lp = L(lx,ly), lq = Pj(lp[0],lp[1],Z+1.05);
      FR.ell(g, lq[0], lq[1], S*0.13, S*0.16, '#fbbf24');
    });
  }
  else if(theme === 'space'){
    // SPACE: 6-Wheel Lunar Exploration Rover
    part(0, 0, 0.32, 2.65, 1.38, 0.18, '#e2e8f0', {top:'#0f172a'});
    part(0.92, 0, 0.48, 0.72, 1.12, 0.36, '#eab308', {top:'#fde047'});
    part(-1.02, 0, 0.48, 0.55, 1.15, 0.45, body, {top:'#22d3ee'});
    part(0.35, 0, 0.48, 0.16, 1.18, 0.52, '#22d3ee', {top:'#e0f2fe'});
    drawPassengers(-0.22, 0.98, '#f8fafc', '#e2e8f0');
    const dBase = L(0.85, -0.45), dTop = Pj(dBase[0],dBase[1],Z+1.65);
    FR.ln(g, Pj(dBase[0],dBase[1],Z+0.82), dTop, '#cbd5e1', S*0.07);
    FR.ell(g, dTop[0], dTop[1], S*0.36, S*0.22, '#facc15');
    FR.ell(g, dTop[0], dTop[1]-S*0.08, S*0.10, S*0.10, '#22d3ee');
  }
  else if(theme === 'jungle'){
    // JUNGLE: Rugged 4x4 Safari Offroad Expedition Truck
    part(0, 0, 0.34, 2.65, 1.48, 0.16, '#1c1917');
    part(-0.35, 0, 0.48, 1.55, 1.22, 0.56, body);
    part(0.88, 0, 0.48, 0.95, 1.12, 0.54, body, {top:shade(body,0.15)});
    part(1.42, 0, 0.42, 0.16, 1.24, 0.24, '#27272a');
    drawPassengers(-0.25, 1.10, '#ca8a04', '#15803d');
    [[-1.05,-0.54],[-1.05,0.54],[0.32,-0.54],[0.32,0.54]].forEach(([px,py]) => {
      const p = L(px,py);
      FR.ln(g, Pj(p[0],p[1],Z+1.02), Pj(p[0],p[1],Z+1.65), '#1c1917', S*0.07);
    });
    part(-0.36, 0, 1.62, 1.48, 1.18, 0.12, '#d9b27a', {top:'#f5efe0'});
    [-0.35, 0, 0.35].forEach(ly => {
      const lp = L(0.38, ly), lq = Pj(lp[0],lp[1],Z+1.78);
      FR.ell(g, lq[0], lq[1], S*0.10, S*0.10, '#fef08a');
    });
    drawWheel(-1.22, 0, 0.78, 'offroad');
  }
  else if(theme === 'frontier'){
    // FRONTIER: 1930s Antique Flatbed Stake-Side Pickup Truck
    part(0, 0, 0.30, 2.65, 1.45, 0.12, '#1f2937');
    part(0.98, 0, 0.42, 0.88, 0.68, 0.52, body);
    part(1.45, 0, 0.44, 0.10, 0.62, 0.48, '#d97706');
    part(0.18, 0, 0.42, 0.78, 1.06, 0.62, body);
    part(0.55, 0, 1.02, 0.08, 0.98, 0.52, '#bae6fd');
    part(0.15, 0, 1.52, 0.82, 1.08, 0.14, shade(body,-0.22), {top:body});
    drawPassengers(0.15, 1.05, '#b91c1c', '#d97706');
    part(-0.78, 0, 0.42, 1.12, 1.12, 0.38, '#8a5a33', {top:'#5a3b22'});
    part(-0.78, -0.52, 0.80, 1.08, 0.08, 0.32, '#a97d49');
    part(-0.78,  0.52, 0.80, 1.08, 0.08, 0.32, '#a97d49');
    part(-0.75, 0, 0.78, 0.55, 0.65, 0.35, '#d9b27a');
  }
  else if(theme === 'classic' || theme === 'alps'){
    // CLASSIC MIDWAY & ALPS: 1914 Ford Model T
    part(0, 0, 0.30, 2.55, 1.48, 0.10, '#18181b');
    [[0,-0.62],[0,0.62]].forEach(([a,b]) => part(a, b, 0.36, 2.35, 0.24, 0.08, '#111827'));
    part(-0.32, 0, 0.40, 1.35, 1.04, 0.62, body);
    part(0.92, 0, 0.42, 0.92, 0.58, 0.50, body);
    part(1.42, 0, 0.44, 0.12, 0.56, 0.54, '#f59e0b');
    part(0.34, 0, 1.00, 0.07, 0.98, 0.62, '#bae6fd');
    drawPassengers(-0.32, 1.10, '#dc2626', '#2563eb');
    [[-0.95,-0.46],[-0.95,0.46],[0.32,-0.46],[0.32,0.46]].forEach(([px,py]) => {
      const p = L(px,py);
      FR.ln(g, Pj(p[0],p[1],Z+1.00), Pj(p[0],p[1],Z+1.66), '#d97706', S*0.055);
    });
    const roofCol = (theme === 'alps') ? '#f8fafc' : '#1f2937';
    part(-0.32, 0, 1.64, 1.42, 1.08, 0.14, roofCol, {top: theme==='alps' ? '#ffffff' : '#374151'});
    [[1.38,-0.48],[1.38,0.48]].forEach(([a,b]) => {
      const p = L(a,b), q = Pj(p[0],p[1],Z+0.84);
      FR.ell(g, q[0], q[1], S*0.12, S*0.12, '#fef08a');
    });
  }
  else if(theme === 'fiesta'){
    // FIESTA: Open-Top Convertible Antique Cruiser
    part(0, 0, 0.30, 2.60, 1.52, 0.10, '#1f2937');
    part(-0.30, 0, 0.40, 1.40, 1.08, 0.54, body, {top:'#fde047'});
    part(0.92, 0, 0.42, 0.98, 0.72, 0.48, body, {top:'#ffffff'});
    part(1.44, 0, 0.44, 0.12, 0.68, 0.46, '#e2e8f0');
    part(0.32, 0, 0.94, 0.08, 1.02, 0.46, '#bae6fd', {top:'#ffffff'});
    part(-0.98, 0, 0.92, 0.36, 1.06, 0.22, '#fef3c7', {top:'#fde047'});
    drawPassengers(-0.30, 1.08, '#10b981', '#f97316');
    [[1.40,-0.50],[1.40,0.50]].forEach(([a,b]) => {
      const p = L(a,b), q = Pj(p[0],p[1],Z+0.82);
      FR.ell(g, q[0], q[1], S*0.13, S*0.13, '#fef08a');
    });
  }
  else {
    // UNTHEMED (Generic) & BAVARIAN: Classic Brass-Era Antique Roadster
    part(0, 0, 0.30, 2.55, 1.50, 0.10, '#22222a');
    part(-0.35, 0, 0.40, 1.20, 1.00, 0.60, body);
    part(0.30, 0, 0.40, 0.28, 1.02, 0.45, body);
    part(0.95, 0, 0.42, 0.95, 0.58, 0.50, body);
    part(1.46, 0, 0.45, 0.10, 0.56, 0.46, '#d9a63a');
    part(0.28, 0, 1.00, 0.07, 0.96, 0.50, '#cfe8f2', {top:'#e8f6fb'});
    part(-1.00, 0, 0.95, 0.30, 0.96, 0.50, shade(body,-0.30));
    part(-1.05, 0, 1.42, 0.55, 0.96, 0.20, theme==='bavarian' ? '#f5efe0' : '#352a22');
    [[0.95,-0.5],[0.95,0.5],[-0.95,-0.5],[-0.95,0.5]].forEach(([a,b]) => {
      part(a, b*1.12, 0.72, 0.70, 0.20, 0.08, theme==='bavarian' ? '#f5c542' : '#1b1b22');
    });
    [[1.4,-0.5],[1.4,0.5]].forEach(([a,b]) => {
      const p = L(a,b), q = Pj(p[0],p[1],Z+0.85);
      FR.ell(g, q[0], q[1], S*0.12, S*0.12, '#ffe9a0');
    });
    drawPassengers(-0.35, 1.10, '#8b3a2e', '#2e4a8b');
  }

  // 3. Near-side wheels
  ws.filter(w => w.d >= cd).forEach(w => {
    const rScale = isChariot ? 1.28 : (theme==='japan' || theme==='china' ? 1.22 : (wStyle==='wagon'&&w.a<0 ? 1.15 : 1.0));
    drawWheel(w.a, w.b, rScale, wStyle);
  });
}

function acDrawer(theme, A){
  const sk = ANTIQUE_CARS_SKINS[theme] || ANTIQUE_CARS_SKINS.unthemed;
  const roofCol = sk.stRoof || A;
  const roofDark = shade(roofCol, -0.30);
  const cols = sk.cars.map(c => c || A);
  const hats = sk.hats;
  const lampS = [0.55, 2.1, 3.7, 5.3];
  const ats = {};

  // Theme-adapted perimeter lamps / torches / beacons
  const drawLamp = (g, Pj, S, s) => {
    const p = acPos(AC.A + AC.w + 0.55, AC.B + AC.w + 0.55, s);
    const b = Pj(p[0], p[1], 0.2), t = Pj(p[0], p[1], 3.5);
    g.fillStyle = 'rgba(20,25,30,.28)';
    g.beginPath(); g.ellipse(b[0]+S*0.1, b[1], S*0.35, S*0.17, 0, 0, 7); g.fill();
    const postCol = (theme==='western'||theme==='frontier'||theme==='jungle'||theme==='nordic'||theme==='jurassic_island') ? '#5a3b22'
                  : (theme==='china'||theme==='japan') ? '#991b1b'
                  : (theme==='egypt'||theme==='babylon') ? '#d97706' : '#2a2a33';
    FR.ln(g, b, t, postCol, S*0.14);
    const glowCol = (theme==='space'||theme==='galactic_outpost') ? '56,189,248'
                  : (theme==='gothic') ? '192,132,252'
                  : (theme==='china') ? '239,68,68' : '255,225,140';
    const gl = g.createRadialGradient(t[0], t[1]-S*0.3, 0, t[0], t[1]-S*0.3, S*1.1);
    gl.addColorStop(0, `rgba(${glowCol},0.48)`);
    gl.addColorStop(1, `rgba(${glowCol},0)`);
    g.fillStyle = gl; g.beginPath(); g.arc(t[0], t[1]-S*0.3, S*1.1, 0, 7); g.fill();
    FR.poly(g, [[t[0]-S*0.28,t[1]],[t[0]+S*0.28,t[1]],[t[0]+S*0.22,t[1]-S*0.52],[t[0]-S*0.22,t[1]-S*0.52]],
      (theme==='space'||theme==='galactic_outpost')?'#22d3ee':(theme==='china'?'#ef4444':'#fff0b0'), postCol, S*0.06);
    FR.poly(g, [[t[0]-S*0.36,t[1]-S*0.52],[t[0]+S*0.36,t[1]-S*0.52],[t[0],t[1]-S*0.86]], postCol);
  };

  return function(g, Pj, S, part, t){
    // Generous 6.8*S atlas canvas so chariots with horses & carriages fit without clipping
    const at = ats[S] || (ats[S] = FR.atlas(S, 6.8*S, 6.8*S, 3.4*S, 4.9*S, 48, (g2, P2, i, psi) => {
      acVehicle(g2, P2, S, 0, 0, psi, theme, cols[i%5], hats[i%5], i);
    }));

    const N = 120;
    const path = (a,b,z,n) => {
      n = n || N;
      return Array.from({length:n}, (_,k) => {
        const p = acPos(a, b, k/n*6.2832);
        return Pj(p[0], p[1], z);
      });
    };

    if(part === 'back'){
      const c0 = Pj(0,0,0);
      g.fillStyle = 'rgba(20,25,30,.26)';
      g.beginPath(); g.ellipse(c0[0]+S*0.4, c0[1]+S*0.3, (AC.A+AC.w+0.9)*0.99*S, (AC.B+AC.w+0.9)*0.495*S, 0, 0, 7); g.fill();

      const ow = AC.w + 0.3;
      for(let k=0; k<N; k++){
        const s0 = k/N*6.2832, s1 = (k+1)/N*6.2832, m = (s0+s1)/2;
        const a0 = acPos(AC.A+ow, AC.B+ow, s0), a1 = acPos(AC.A+ow, AC.B+ow, s1);
        const vis = (acPos(AC.A+ow, AC.B+ow, m)[0] + acPos(AC.A+ow, AC.B+ow, m)[1]) > 0;
        if(vis) FR.poly(g, [Pj(a0[0],a0[1],0.2),Pj(a1[0],a1[1],0.2),Pj(a1[0],a1[1],0),Pj(a0[0],a0[1],0)], shade(sk.curb,-0.22));
      }
      FR.poly(g, path(AC.A+ow, AC.B+ow, 0.2), sk.curb);
      FR.poly(g, path(AC.A+AC.w, AC.B+AC.w, 0.2), sk.road);
      FR.poly(g, path(AC.A-AC.w, AC.B-AC.w, 0.2), sk.curb);
      const ig = AC.w + 0.3;
      FR.poly(g, path(AC.A-ig, AC.B-ig, 0.28), sk.lawn);

      const edge = (a,b,col,wd) => {
        g.beginPath(); path(a,b,0.22).forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));
        g.closePath(); g.strokeStyle=col; g.lineWidth=wd; g.stroke();
      };
      edge(AC.A+AC.w-0.18, AC.B+AC.w-0.18, shade(sk.curb,0.25), S*0.09);
      edge(AC.A-AC.w+0.18, AC.B-AC.w+0.18, shade(sk.curb,0.25), S*0.09);

      // Center guide rail & dashed lane divider
      g.save(); g.setLineDash([S*0.5, S*0.45]);
      edge(AC.A, AC.B, sk.line, S*0.09);
      g.restore();
      g.beginPath(); path(AC.A, AC.B, 0.28).forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));
      g.closePath(); g.strokeStyle='rgba(20,25,35,.60)'; g.lineWidth=S*0.07; g.stroke();

      // Infield flower/stone/beacon border dots
      for(let k=0; k<22; k++){
        const s = k/22*6.2832, p = acPos(AC.A-ig-0.45, AC.B-ig-0.45, s), q = Pj(p[0],p[1],0.3);
        const fCols = (theme==='space'||theme==='galactic_outpost') ? ['#22d3ee','#f97316','#38bdf8']
                    : theme==='gothic' ? ['#dc2626','#71717a','#991b1b']
                    : theme==='babylon' ? ['#1d4ed8','#facc15','#15803d']
                    : ['#d9467a','#f2c230','#f6efe0','#f08a22'];
        FR.ell(g, q[0], q[1], S*0.10, S*0.08, fCols[k % fCols.length]);
      }
      lampS.filter(s => { const p=acPos(AC.A+AC.w+0.55,AC.B+AC.w+0.55,s); return p[0]+p[1]<0; }).forEach(s => drawLamp(g,Pj,S,s));
    }

    if(part === 'front'){
      lampS.filter(s => { const p=acPos(AC.A+AC.w+0.55,AC.B+AC.w+0.55,s); return p[0]+p[1]>=0; }).forEach(s => drawLamp(g,Pj,S,s));
    }

    if(part === 'hub'){
      const z = 0.28;
      // Central Infield Station Building (Themed per variant!)
      FR.rbox(g, Pj, 0, 0, z, 3.0, 2.0, 2.2, 0, sk.stWall);

      if(theme === 'galactic_outpost'){
        // Galactic Outpost: Industrial Batuu Hangar Bay with Slanted Durasteel Roof, Radar Dish & Beacon
        FR.poly(g, [Pj(-1.7,1.2,z+2.2),Pj(1.7,1.2,z+2.2),Pj(1.7,-1.2,z+2.2),Pj(-1.7,-1.2,z+2.2)], roofCol);
        FR.rbox(g, Pj, 0, 0, z+2.2, 2.6, 1.6, 0.55, 0, '#475569', {top:'#94a3b8'});
        const rBase = Pj(-0.7, -0.3, z+2.75), rDish = Pj(-0.7, -0.3, z+3.65);
        FR.ln(g, rBase, rDish, '#94a3b8', S*0.10);
        FR.ell(g, rDish[0], rDish[1], S*0.55, S*0.30, '#cbd5e1');
        const bTop = Pj(0.8, 0.2, z+3.35);
        FR.ln(g, Pj(0.8, 0.2, z+2.75), bTop, '#334155', S*0.09);
        FR.ell(g, bTop[0], bTop[1], S*0.18, S*0.18, '#f97316');
      }
      else if(theme === 'space'){
        // Space: Domed Titanium & Cyan Telemetry Outpost
        const dm = Pj(0, 0, z+2.5);
        FR.ell(g, dm[0], dm[1], S*1.55, S*0.85, roofCol);
        FR.ell(g, dm[0], dm[1]-S*0.2, S*0.95, S*0.48, '#22d3ee');
      }
      else if(theme === 'china' || theme === 'japan'){
        // China & Japan: Tiered Pagoda / Edo Gatehouse Roof with Upturned Gold Eaves
        FR.poly(g, [Pj(-1.85,1.35,z+2.2),Pj(1.85,1.35,z+2.2),Pj(1.85,-1.35,z+2.2),Pj(-1.85,-1.35,z+2.2)], '#facc15');
        FR.poly(g, [Pj(-1.7,1.2,z+2.25),Pj(1.7,1.2,z+2.25),Pj(1.7,-1.2,z+2.25),Pj(0,0,z+3.55)], roofCol);
        FR.poly(g, [Pj(1.7,1.2,z+2.25),Pj(1.7,-1.2,z+2.25),Pj(0,0,z+3.55)], roofDark);
        const pk = Pj(0, 0, z+3.55);
        FR.ell(g, pk[0], pk[1]-S*0.18, S*0.22, S*0.22, '#facc15');
      }
      else if(theme === 'egypt' || theme === 'babylon'){
        // Egypt & Babylon: Stepped Pylon / Ziggurat Parapet Roof with Gold Rosettes
        FR.rbox(g, Pj, 0, 0, z+2.2, 3.2, 2.2, 0.35, 0, roofCol, {top:'#facc15'});
        FR.rbox(g, Pj, 0, 0, z+2.55, 2.1, 1.4, 0.55, 0, sk.stWall, {top:roofCol});
      }
      else {
        // Hip/Gable Station Roof + Striped Awning (Rome, Greece, Jurassic Island, & Original Themes)
        FR.poly(g, [Pj(-1.7,1.2,z+2.2),Pj(1.7,1.2,z+2.2),Pj(1.7,-1.2,z+2.2),Pj(0,0,z+3.6)], roofCol);
        FR.poly(g, [Pj(1.7,1.2,z+2.2),Pj(1.7,-1.2,z+2.2),Pj(0,0,z+3.6)], roofDark);
        FR.poly(g, [Pj(-1.7,1.2,z+2.2),Pj(1.7,1.2,z+2.2),Pj(0,0,z+3.6)], shade(roofCol,0.12), 'rgba(0,0,0,.2)', S*0.05);
      }

      if(theme === 'medieval' || theme === 'nordic' || theme === 'ancient_rome'){
        const pk = Pj(0, 0, z+3.6);
        FR.ln(g, pk, [pk[0], pk[1]-S*0.85], '#facc15', S*0.09);
        FR.poly(g, [[pk[0],pk[1]-S*0.85],[pk[0]+S*0.75,pk[1]-S*0.6],[pk[0],pk[1]-S*0.35]], '#b91c1c');
      }

      for(let k=0; k<6; k++){
        const a = -1.5 + k*0.5;
        const awAlt = (theme==='jurassic_island') ? '#fef3c7' : (theme==='galactic_outpost' ? '#94a3b8' : '#f6efe0');
        FR.poly(g, [Pj(a,1.55,z+1.4),Pj(a+0.5,1.55,z+1.4),Pj(a+0.5,1.05,z+2.0),Pj(a,1.05,z+2.0)], k%2 ? awAlt : roofDark);
      }
      FR.poly(g, [Pj(-0.6,1.01,z),Pj(0.6,1.01,z),Pj(0.6,1.01,z+1.3),Pj(-0.6,1.01,z+1.3)], '#291d12');

      const o = Pj(-1.3, 1.02, z+2.15);
      g.save();
      g.transform(0.7, 0.35, 0, 1, o[0], o[1]);
      g.fillStyle = '#17171f';
      g.fillRect(0, 0, 2.6*S, 0.5*S);
      g.fillStyle = (theme==='space'||theme==='galactic_outpost') ? '#38bdf8' : '#f6d34a';
      g.font = 'bold ' + (0.35*S) + 'px Arial Black, Arial, sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(sk.sign, 1.3*S, 0.27*S, 2.5*S);
      g.restore();
    }

    if(part === 'cars_back' || part === 'cars_front'){
      const cars = [];
      for(let i=0; i<AC.N; i++){
        const s = i*6.2832/AC.N + 0.32*(t||0);
        const p = acPos(AC.A, AC.B, s);
        const q = acPos(AC.A, AC.B, s+0.03), r = acPos(AC.A, AC.B, s-0.03);
        cars.push({i, X:p[0], Y:p[1], psi:Math.atan2(q[1]-r[1], q[0]-r[0]), d:p[0]+p[1]});
      }
      cars.filter(c => part==='cars_back' ? c.d<0 : c.d>=0).sort((p,q) => p.d-q.d).forEach(c => {
        const b = Pj(c.X, c.Y, 0.1);
        g.fillStyle = 'rgba(15,20,25,.30)';
        g.beginPath(); g.ellipse(b[0]+S*0.15, b[1]+S*0.08, 1.65*0.99*S, 1.65*0.495*S, 0, 0, 7); g.fill();
        const e = at(c.i, c.psi), q = Pj(c.X, c.Y, 0);
        g.drawImage(e.cv, q[0]-e.ox, q[1]-e.oy, e.w, e.h);
      });
    }
  };
}

/**
 * PUBLIC ENGINE ENTRY POINT:
 *  drawAntiqueCars(ctx, cx, cy, R, { themeId, rideThemeTier, accent, t, tile })
 */
function drawAntiqueCars(ctx, cx, cy, R, o){
  o = o || {};
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTheme = String(o.themeId || o.theme || 'unthemed').toLowerCase().replace(/[\s-]+/g, '_');
  if(rawTheme === 'wildwest' || rawTheme === 'wild_west') rawTheme = 'western';
  if(rawTheme === 'german') rawTheme = 'bavarian';
  if(rawTheme === 'standard') rawTheme = 'unthemed';
  if(rawTheme === 'galaxys_edge' || rawTheme === 'galactic') rawTheme = 'galactic_outpost';
  if(rawTheme === 'jurassic') rawTheme = 'jurassic_island';
  if(rawTheme === 'rome') rawTheme = 'ancient_rome';
  if(rawTheme === 'greece') rawTheme = 'ancient_greece';
  const theme = (tier <= 2 || !ANTIQUE_CARS_SKINS[rawTheme]) ? 'unthemed' : rawTheme;
  const skin = ANTIQUE_CARS_SKINS[theme] || ANTIQUE_CARS_SKINS.unthemed;
  const A = o.accent || skin.border || '#d9342b';

  if(o.tile){
    FR.hex(ctx, cx, cy, R, o.ground || skin.hex, A);
  }
  const cacheKey = 'ac|' + theme + '|' + R + '|' + A + '|' + getCampusBakeScale();
  FR._order = FR._order || [];
  const previous = FR._order.indexOf(cacheKey);
  if (previous !== -1) FR._order.splice(previous, 1);
  FR._order.push(cacheKey);
  if (FR._order.length > 12) {
    const oldest = FR._order.shift();
    delete FR._d[oldest];
    if (FR._c) delete FR._c[oldest];
  }
  const fn = FR._d[cacheKey] || (FR._d[cacheKey] = acDrawer(theme, A));
  FR.render(ctx, cx, cy, R, cacheKey, 1.55, 1.45, 0.96, fn, o.t);
}
/* ===== END ANTIQUE CARS SPRITE CODE ===== */


NEW_SPRITE_PACKS.rides.antique_cars = { skins: ANTIQUE_CARS_SKINS, draw: drawAntiqueCars };
})();

(function () {

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

function prism(ctx, cx, by, w, d, h, col) {
  const ty = by - h;
  ctx.fillStyle = shade(col, -0.35);
  ctx.beginPath();
  ctx.moveTo(cx - w, by); ctx.lineTo(cx, by + d); ctx.lineTo(cx, ty + d); ctx.lineTo(cx - w, ty);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = shade(col, -0.1);
  ctx.beginPath();
  ctx.moveTo(cx + w, by); ctx.lineTo(cx, by + d); ctx.lineTo(cx, ty + d); ctx.lineTo(cx + w, ty);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = shade(col, 0.2);
  ctx.beginPath();
  ctx.moveTo(cx - w, ty); ctx.lineTo(cx, ty - d); ctx.lineTo(cx + w, ty); ctx.lineTo(cx, ty + d);
  ctx.closePath(); ctx.fill();
}

/* ===== FERRIS WHEEL 24-SKIN METADATA ===== */
const FERRIS_WHEEL_SKINS = {
  standard:         { id: 'standard',         label: 'Unthemed (Tier 0–2)', name: 'Standard Park Ferris Wheel',          sub: 'Steel A-Frame, Chasing Rim Bulbs & Cabins',              hex: '#cbd5e1', border: '#eab308' },
  western:          { id: 'western',          label: 'Wild West',           name: 'Pioneer Covered-Basket Wheel',        sub: 'Red-Rock Buttes, Timber Derrick & Covered Baskets',      hex: '#c99a62', border: '#b91c1c' },
  bavarian:         { id: 'bavarian',         label: 'Bavarian',            name: 'Oktoberfest Beer-Mug Wheel',          sub: 'Fachwerk Gable Pylons, Clock Hub & Foamy Steins',       hex: '#769958', border: '#2563eb' },
  classic:          { id: 'classic',          label: 'Classic Midway',      name: 'Wonder Wheel Hot-Air Balloons',       sub: 'Circus Striped Pylons, Sunburst & Balloon Pods',        hex: '#cbb07c', border: '#e11d48' },
  jungle:           { id: 'jungle',           label: 'Jungle',              name: 'Temple of the Sun Wheel',             sub: 'Mayan Stone Obelisks, Chaac Sun Hub & Jade Cabins',      hex: '#587c48', border: '#2fbf9a' },
  medieval:         { id: 'medieval',         label: 'Medieval',            name: 'Royal Siege-Tower Wheel',             sub: 'Castle Turret Pylons, Shield Hub & Royal Cabins',       hex: '#6c8c58', border: '#eab308' },
  nordic:           { id: 'nordic',           label: 'Nordic',              name: 'Asgardian Runestone Wheel',           sub: 'Stave Dragon Pylons, Bifrost Hub & Fjord Cabins',       hex: '#4d6b63', border: '#d97706' },
  frontier:         { id: 'frontier',         label: 'Frontier',            name: 'Grizzly Timber Sawmill Wheel',        sub: 'Notched Pine Logs, Buzzsaw Hub & Lodge Cabins',         hex: '#7d955d', border: '#566e42' },
  americana:        { id: 'americana',        label: 'Americana',           name: 'World’s Fair 1893 Columbian',         sub: 'Victorian Lattice Towers, Eagle Hub & Red Cabins',      hex: '#a8644c', border: '#b91c1c' },
  alps:             { id: 'alps',             label: 'Alps',                name: 'Matterhorn Glacier Gondola',          sub: 'Snow-Capped Chalet Pylons, Edelweiss & Ski Cabins',      hex: '#a8c5d6', border: '#0284c7' },
  fiesta:           { id: 'fiesta',           label: 'Fiesta',              name: 'La Rueda de la Fiesta',               sub: 'Talavera Bell Towers, Aztec Sun & Piñata Cabins',       hex: '#d99b52', border: '#e11d48' },
  gothic:           { id: 'gothic',           label: 'Gothic',              name: 'Midnight Abbey Rose Wheel',           sub: 'Gargoyle Buttresses, Rose Window & Raven Cabins',       hex: '#3b3345', border: '#7e22ce' },
  space:            { id: 'space',            label: 'Space',               name: 'Orbital Space-Elevator Wheel',        sub: 'Titanium Gantry Pylons, Plasma Core & Aero Pods',       hex: '#334155', border: '#0ea5e9' },
  retro_future:     { id: 'retro_future',     label: 'Retro-Future',        name: 'Tomorrowland Atomic Wheel',           sub: 'Googie Boomerang Pylons, Atom Hub & Retro Pods',        hex: '#bcc8d5', border: '#f97316' },
  jungle_tiki:      { id: 'tiki',             label: 'Tiki',                name: 'Polynesian Tiki-Totem Wheel',         sub: 'Carved Tiki Pillars, Fire Bowl & Bamboo Cabins',        hex: '#5c9444', border: '#d97706' },
  caribbean:        { id: 'caribbean',        label: 'Caribbean',           name: 'Port Royal Galleon Wheel',            sub: 'Sea-Fort Bastion Pylons, Helm Hub & Pirate Cabins',      hex: '#6aa04a', border: '#d97706' },

  /* === 8 NEW EXPANSION LANDS === */
  galactic_outpost: { id: 'galactic_outpost', label: 'Galactic Outpost',    name: 'Batuu Spire Observation Wheel',       sub: 'Batuu Spire Rocks, Industrial Gantry & Shuttle Pods',   hex: '#7c6f64', border: '#ea580c', isNew: true },
  jurassic_island:  { id: 'jurassic_island',  label: 'Jurassic Island',     name: 'Isla Nublar Canopy Tour Wheel',      sub: 'Vine-Wrapped Teak Towers, Amber Hub & Safari Cabins',   hex: '#4d7c47', border: '#eab308', isNew: true },
  china:            { id: 'china',            label: 'China',               name: 'Ming Imperial Pagoda Wheel',          sub: 'Crimson Pagoda Pylons, Jade Dragon Hub & Silk Lanterns', hex: '#6e8b5e', border: '#dc2626', isNew: true },
  japan:            { id: 'japan',            label: 'Japan',               name: 'Edo Shogunate Torii & Sakura Wheel',  sub: 'Vermilion Torii Pylons, Kamon Hub & Yakatabune Cabins', hex: '#5d7a64', border: '#e11d48', isNew: true },
  ancient_rome:     { id: 'ancient_rome',     label: 'Ancient Rome',        name: 'Imperial Colosseum Aqueduct Wheel',   sub: 'Travertine Aqueduct Pylons, Aquila Hub & Chariot Pods', hex: '#b89f7d', border: '#b91c1c', isNew: true },
  ancient_greece:   { id: 'ancient_greece',   label: 'Ancient Greece',      name: 'Athenian Parthenon Marble Wheel',     sub: 'Pentelic Doric Columns, Owl Sunburst & Gazebo Cabins',  hex: '#8da4b5', border: '#0284c7', isNew: true },
  egypt:            { id: 'egypt',            label: 'Egypt',               name: 'Pharaonic Obelisk & Solar Wheel',     sub: 'Gilded Temple Obelisks, Winged Sun Hub & Barque Pods',  hex: '#d4b475', border: '#d97706', isNew: true },
  babylon:          { id: 'babylon',          label: 'Babylon',             name: 'Ishtar Gate Hanging-Gardens Wheel',   sub: 'Lapis Glazed Towers, Ishtar Star Hub & Ziggurat Pods',  hex: '#8b7e6a', border: '#2563eb', isNew: true }
};

/* Theme aliases for seamless engine lookup */
FERRIS_WHEEL_SKINS.tiki         = FERRIS_WHEEL_SKINS.jungle_tiki;
FERRIS_WHEEL_SKINS.unthemed     = FERRIS_WHEEL_SKINS.standard;
FERRIS_WHEEL_SKINS.german       = FERRIS_WHEEL_SKINS.bavarian;
FERRIS_WHEEL_SKINS.wildwest     = FERRIS_WHEEL_SKINS.western;
FERRIS_WHEEL_SKINS.retro        = FERRIS_WHEEL_SKINS.retro_future;
FERRIS_WHEEL_SKINS.galaxys_edge = FERRIS_WHEEL_SKINS.galactic_outpost;
FERRIS_WHEEL_SKINS.galactic     = FERRIS_WHEEL_SKINS.galactic_outpost;
FERRIS_WHEEL_SKINS.jurassic     = FERRIS_WHEEL_SKINS.jurassic_island;
FERRIS_WHEEL_SKINS.rome         = FERRIS_WHEEL_SKINS.ancient_rome;
FERRIS_WHEEL_SKINS.greece       = FERRIS_WHEEL_SKINS.ancient_greece;

/* ===== SPRITE RENDERER ===== */
function drawFerrisWheel(ctx, cx, cy, R, o = {}) {
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTh = String(o.themeId || o.theme || 'standard').toLowerCase().replace(/[\s-]+/g, '_');
  if (rawTh === 'unthemed') rawTh = 'standard';
  if (rawTh === 'german') rawTh = 'bavarian';
  if (rawTh === 'wildwest' || rawTh === 'wild_west') rawTh = 'western';
  if (rawTh === 'retro') rawTh = 'retro_future';
  if (rawTh === 'tiki') rawTh = 'jungle_tiki';
  if (rawTh === 'galaxys_edge' || rawTh === 'galactic') rawTh = 'galactic_outpost';
  if (rawTh === 'jurassic') rawTh = 'jurassic_island';
  if (rawTh === 'rome') rawTh = 'ancient_rome';
  if (rawTh === 'greece') rawTh = 'ancient_greece';
  const theme = (tier <= 2 || !FERRIS_WHEEL_SKINS[rawTh]) ? 'standard' : rawTh;
  const meta = FERRIS_WHEEL_SKINS[theme] || FERRIS_WHEEL_SKINS.standard;

  const accent = o.accent || meta.border || '#eab308';
  const th = o.t == null ? ((typeof performance !== 'undefined' ? performance.now() / 1000 : 0.9) * 0.35) : o.t;
  const fl = o.flip ? -1 : 1;
  const TAU = Math.PI * 2;

  ctx.save();
  if (o.flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  // Isometric Projection:
  // Wheel rotates in the X-Z plane; Y separates the Back (-ya) and Front (+ya) support towers
  const cyB = cy + R * 0.04;
  const P = (X, Y, Z) => [cx + (X - Y) * 0.7, cyB + (X + Y) * 0.35 - Z];
  const Zh = R * 0.63;    // Axle hub height
  const Rw = R * 0.50;    // Main wheel rim radius
  const yw = R * 0.068;   // Half-width between back and front wheel rims
  const ya = R * 0.165;   // Half-distance between back and front support towers
  const N  = 12;          // 12 gondolas & spokes
  const z0 = R * 0.025;   // Compact pier base height

  const line = (a, b, c, w) => {
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  };
  const poly = (pts, fill, stroke, lw) => {
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || R * 0.008; ctx.stroke(); }
  };
  const disc = (p, rad, fill, stroke, lw) => {
    ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(0.5, rad), 0, TAU);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || R * 0.008; ctx.stroke(); }
  };
  const ell = (p, rx, ry, fill, stroke, lw, rot = 0) => {
    ctx.beginPath(); ctx.ellipse(p[0], p[1], Math.max(0.4, rx), Math.max(0.4, ry), rot, 0, TAU);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || R * 0.008; ctx.stroke(); }
  };
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const rim = (a, Y, rad = Rw) => P(rad * Math.cos(a), Y, Zh + rad * Math.sin(a));

  // 1. Optional Hex Tile Base
  if (o.tile !== false) {
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = theme === 'standard' ? '#cbd5e1' : meta.hex;
    ctx.fill();
    ctx.lineWidth = Math.max(2, R * 0.05);
    ctx.strokeStyle = theme === 'standard' ? accent : meta.border;
    ctx.stroke();
  }

  // 2. Ground Boarding Dock & Projected Wheel Shadow
  poly([P(-R * 0.18, -R * 0.14, 0), P(R * 0.18, -R * 0.14, 0), P(R * 0.18, R * 0.14, 0), P(-R * 0.18, R * 0.14, 0)], 'rgba(15, 23, 42, 0.24)');

  ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
  ctx.beginPath();
  for (let i = 0; i <= 48; i++) {
    const a = i / 48 * TAU, Z = Zh + Rw * Math.sin(a), p = P(Rw * Math.cos(a), 0, 0);
    const x = p[0] + fl * Z * 0.28, y = p[1] + Z * 0.14;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // =========================================================================
  // 3. BESPOKE THEMED SUPPORT TOWERS (`drawThemedSupport(Y, isFront)`)
  // =========================================================================
  const drawThemedSupport = (Y, isFront) => {
    const top = P(0, Y, Zh);
    const f0  = P(-R * 0.39, Y, z0);
    const f1  = P( R * 0.39, Y, z0);

    // Compact footpad piers under each leg
    [f0, f1].forEach(f => {
      ell([f[0], f[1] + R * 0.008], R * 0.065, R * 0.030, 'rgba(15,23,42,0.34)');
      ell(f, R * 0.056, R * 0.025, '#475569', '#1e293b', R * 0.006);
    });

    if (theme === 'galactic_outpost') {
      // GALACTIC OUTPOST: Batuu Petrified Spire Rocks + Weathered Durasteel Industrial Gantry
      [[-R * 0.39, -1], [R * 0.39, 1]].forEach(([bx, dir]) => {
        const pb = P(bx, Y, 0);
        const oX = dir * R * 0.055;
        // Tall primary petrified sandstone/basalt spire flanking each foot
        poly([
          [pb[0] - R * 0.085 + oX, pb[1]],
          [pb[0] + R * 0.085 + oX, pb[1]],
          [pb[0] + R * 0.042 + oX, pb[1] - R * 0.26],
          [pb[0] - R * 0.015 + oX, pb[1] - R * 0.33],
          [pb[0] - R * 0.058 + oX, pb[1] - R * 0.22]
        ], '#6b5e54', '#29221c', R * 0.007);
        // Shaded facet on spire
        poly([
          [pb[0] + R * 0.012 + oX, pb[1]],
          [pb[0] + R * 0.085 + oX, pb[1]],
          [pb[0] + R * 0.042 + oX, pb[1] - R * 0.26],
          [pb[0] - R * 0.015 + oX, pb[1] - R * 0.33]
        ], '#4a4038', '#29221c', R * 0.006);
        // Sedimentary horizontal strata grooves
        line([pb[0] - R * 0.068 + oX, pb[1] - R * 0.11], [pb[0] + R * 0.062 + oX, pb[1] - R * 0.11], '#3d342d', R * 0.006);
        line([pb[0] - R * 0.052 + oX, pb[1] - R * 0.19], [pb[0] + R * 0.046 + oX, pb[1] - R * 0.19], '#3d342d', R * 0.006);
      });
      // Weathered Gunmetal & Rust-Orange Industrial Gantry A-frame
      const m0 = lerp(f0, top, 0.30), m1 = lerp(f1, top, 0.30);
      line(m0, m1, '#1e293b', R * 0.034);
      line(m0, m1, '#ea580c', R * 0.015);
      [f0, f1].forEach(f => {
        line(f, top, '#1e293b', R * 0.058);
        line(f, top, '#64748b', R * 0.038);
        line(lerp(f, top, 0.42), lerp(f, top, 0.56), '#c2410c', R * 0.046);
        if (isFront) {
          disc(lerp(f, top, 0.72), R * 0.014, '#f97316', '#fef08a', R * 0.004);
        }
      });
    }
    else if (theme === 'jurassic_island') {
      // JURASSIC ISLAND: Vine-Wrapped Teak/Bamboo Towers, Stone Gate Piers & Amber Torches
      [f0, f1].forEach((f, idx) => {
        const dir = idx === 0 ? -1 : 1;
        // Carved volcanic stone gate pier at base with flickering torch
        poly([
          [f[0] - R * 0.065, f[1]], [f[0] + R * 0.065, f[1]],
          [f[0] + R * 0.052, f[1] - R * 0.12], [f[0] - R * 0.052, f[1] - R * 0.12]
        ], '#57534e', '#292524', R * 0.007);
        if (isFront) {
          const tPos = [f[0] + dir * R * 0.035, f[1] - R * 0.145];
          disc(tPos, R * 0.022, 'rgba(245, 158, 11, 0.35)');
          disc(tPos, R * 0.012, '#facc15', '#ea580c', R * 0.004);
        }
      });
      const m0 = lerp(f0, top, 0.30), m1 = lerp(f1, top, 0.30);
      line(m0, m1, '#451a03', R * 0.034);
      line(m0, m1, '#eab308', R * 0.014);
      [f0, f1].forEach(f => {
        line(f, top, '#451a03', R * 0.058);
        line(f, top, '#854d27', R * 0.040);
        // Lush tropical vine clusters & palm fronds spiraling up the timber legs
        [0.28, 0.54, 0.78].forEach(t => {
          const vp = lerp(f, top, t);
          ell(vp, R * 0.036, R * 0.020, '#15803d', '#052e16', R * 0.004);
          line(vp, [vp[0], vp[1] + R * 0.055], '#22c55e', R * 0.008);
        });
      });
    }
    else if (theme === 'china') {
      // CHINA: Crimson-Lacquered Pagoda Pylons with Upturned Golden Eaves & Red Silk Lanterns
      const m0 = lerp(f0, top, 0.30), m1 = lerp(f1, top, 0.30);
      line(m0, m1, '#7f1d1d', R * 0.036);
      line(m0, m1, '#facc15', R * 0.016);
      // Upturned golden-tiled pagoda eave roof across the portal crossbar
      poly([
        [m0[0] - R * 0.045, m0[1] - R * 0.022],
        [(m0[0] + m1[0]) * 0.5, (m0[1] + m1[1]) * 0.5 - R * 0.014],
        [m1[0] + R * 0.045, m1[1] - R * 0.022],
        [m1[0] + R * 0.025, m1[1] + R * 0.008],
        [m0[0] - R * 0.025, m0[1] + R * 0.008]
      ], '#facc15', '#991b1b', R * 0.007);
      [f0, f1].forEach(f => {
        line(f, top, '#450a0a', R * 0.058);
        line(f, top, '#dc2626', R * 0.040);
        line(lerp(f, top, 0.48), lerp(f, top, 0.54), '#facc15', R * 0.048);
        if (isFront) {
          const lp = lerp(f, top, 0.65);
          disc([lp[0], lp[1] + R * 0.022], R * 0.018, '#ef4444', '#facc15', R * 0.005);
        }
      });
    }
    else if (theme === 'japan') {
      // JAPAN: Vermilion Shinto Torii-Gate Architectural A-Frame with Black Kasagi Lintel
      const m0 = lerp(f0, top, 0.32), m1 = lerp(f1, top, 0.32);
      // Traditional Torii nuki tie-beam with wedge joints
      line([m0[0] - R * 0.03, m0[1]], [m1[0] + R * 0.03, m1[1]], '#0f172a', R * 0.032);
      line([m0[0] - R * 0.03, m0[1]], [m1[0] + R * 0.03, m1[1]], '#dc2626', R * 0.020);
      // Curved black kasagi lintel crowning the upper A-frame
      const u0 = lerp(f0, top, 0.68), u1 = lerp(f1, top, 0.68);
      poly([
        [u0[0] - R * 0.05, u0[1] - R * 0.022],
        [u1[0] + R * 0.05, u1[1] - R * 0.022],
        [u1[0] + R * 0.035, u1[1] + R * 0.008],
        [u0[0] - R * 0.035, u0[1] + R * 0.008]
      ], '#0f172a', '#dc2626', R * 0.006);
      [f0, f1].forEach(f => {
        // Black kamebara base stone socks
        line(f, top, '#0f172a', R * 0.058);
        line(lerp(f, top, 0.14), top, '#dc2626', R * 0.040);
      });
    }
    else if (theme === 'ancient_rome') {
      // ANCIENT ROME: Travertine Marble Aqueduct Arch Pylons & Crimson SPQR Banners
      const m0 = lerp(f0, top, 0.32), m1 = lerp(f1, top, 0.32);
      const archApex = [(m0[0] + m1[0]) * 0.5, (m0[1] + m1[1]) * 0.5 - R * 0.055];
      line(m0, archApex, '#78350f', R * 0.030);
      line(m1, archApex, '#78350f', R * 0.030);
      line(m0, archApex, '#f5efe0', R * 0.018);
      line(m1, archApex, '#f5efe0', R * 0.018);
      [f0, f1].forEach(f => {
        line(f, top, '#78716c', R * 0.060);
        line(f, top, '#f5f5f4', R * 0.042);
        // Golden Corinthian capital collars
        line(lerp(f, top, 0.82), lerp(f, top, 0.88), '#facc15', R * 0.052);
        if (isFront) {
          const bp = lerp(f, top, 0.52);
          poly([
            [bp[0] - R * 0.020, bp[1] - R * 0.025],
            [bp[0] + R * 0.020, bp[1] - R * 0.025],
            [bp[0] + R * 0.020, bp[1] + R * 0.035],
            [bp[0], bp[1] + R * 0.050],
            [bp[0] - R * 0.020, bp[1] + R * 0.035]
          ], '#b91c1c', '#facc15', R * 0.006);
        }
      });
    }
    else if (theme === 'ancient_greece') {
      // ANCIENT GREECE: White Pentelic Marble Fluted Doric Column A-Frames & Aegean Blue Triglyph Beam
      const m0 = lerp(f0, top, 0.30), m1 = lerp(f1, top, 0.30);
      line(m0, m1, '#0284c7', R * 0.034);
      line(m0, m1, '#f8fafc', R * 0.014);
      [f0, f1].forEach(f => {
        line(f, top, '#64748b', R * 0.060);
        line(f, top, '#ffffff', R * 0.042);
        // Doric fluting line & Aegean blue/gold echinus capital
        line(lerp(f, top, 0.08), lerp(f, top, 0.86), '#cbd5e1', R * 0.010);
        line(lerp(f, top, 0.84), lerp(f, top, 0.90), '#0284c7', R * 0.050);
      });
    }
    else if (theme === 'egypt') {
      // EGYPT: Carved Sandstone Temple Obelisk Pylons with Gilded Pyramidion Tips & Lapis Collars
      const m0 = lerp(f0, top, 0.30), m1 = lerp(f1, top, 0.30);
      line(m0, m1, '#1d4ed8', R * 0.034);
      line(m0, m1, '#facc15', R * 0.016);
      [f0, f1].forEach(f => {
        line(f, top, '#78350f', R * 0.062);
        line(f, top, '#eab308', R * 0.044);
        // Lapis-blue & turquoise pharaonic collar bands
        line(lerp(f, top, 0.25), lerp(f, top, 0.31), '#1d4ed8', R * 0.048);
        line(lerp(f, top, 0.72), lerp(f, top, 0.78), '#1d4ed8', R * 0.048);
        // Gilded pyramidion apex cap
        line(lerp(f, top, 0.82), top, '#fef08a', R * 0.046);
      });
    }
    else if (theme === 'babylon') {
      // BABYLON: Lapis-Lazuli Glazed Ishtar Gate Towers with Gold Rosettes & Hanging Gardens Foliage
      const m0 = lerp(f0, top, 0.30), m1 = lerp(f1, top, 0.30);
      line(m0, m1, '#172554', R * 0.036);
      line(m0, m1, '#facc15', R * 0.016);
      [f0, f1].forEach(f => {
        line(f, top, '#172554', R * 0.060);
        line(f, top, '#1d4ed8', R * 0.042);
        // Gold rosette studs & cascading green Hanging Gardens vines
        [0.34, 0.62].forEach(t => {
          const gp = lerp(f, top, t);
          disc(gp, R * 0.014, '#facc15', '#ffffff', R * 0.004);
          ell([gp[0] + R * 0.022, gp[1] + R * 0.015], R * 0.026, R * 0.015, '#15803d');
          line([gp[0] + R * 0.022, gp[1] + R * 0.015], [gp[0] + R * 0.022, gp[1] + R * 0.065], '#22c55e', R * 0.007);
        });
      });
    }
    else if (theme === 'standard') {
      // Unthemed Steel A-Frame with Accent Top Sleeves & Cross-Tie
      [f0, f1].forEach(f => {
        line(f, top, '#64748b', R * 0.048);
        line([f[0] - R * 0.01, f[1]], [top[0] - R * 0.01, top[1]], '#94a3b8', R * 0.014);
        line(lerp(f, top, 0.70), lerp(f, top, 0.92), accent, R * 0.052);
      });
      line(lerp(f0, top, 0.28), lerp(f1, top, 0.28), '#64748b', R * 0.026);
    }
    else if (theme === 'western') {
      // WILD WEST: Monument-Valley Layered Red-Rock Sandstone Buttes + Timber Mine Derrick & X-Bracing
      [[-R * 0.39, -1], [R * 0.39, 1]].forEach(([bx]) => {
        const pb = P(bx, Y, 0);
        poly([
          [pb[0] - R * 0.085, pb[1]], [pb[0] + R * 0.085, pb[1]],
          [pb[0] + R * 0.065, pb[1] - R * 0.09], [pb[0] - R * 0.065, pb[1] - R * 0.09]
        ], '#b84a2c', '#451a03', R * 0.007);
        poly([
          [pb[0] - R * 0.055, pb[1] - R * 0.09], [pb[0] + R * 0.055, pb[1] - R * 0.09],
          [pb[0] + R * 0.040, pb[1] - R * 0.16], [pb[0] - R * 0.040, pb[1] - R * 0.16]
        ], '#e07a4c', '#451a03', R * 0.006);
      });
      [f0, f1].forEach(f => {
        line(f, top, '#451a03', R * 0.056);
        line(f, top, '#9a6a3c', R * 0.038);
        line(lerp(f, top, 0.45), lerp(f, top, 0.55), '#27272a', R * 0.058);
      });
      const m0 = lerp(f0, top, 0.28), m1 = lerp(f1, top, 0.28);
      const u0 = lerp(f0, top, 0.55), u1 = lerp(f1, top, 0.55);
      line(m0, m1, '#5a3b22', R * 0.026);
      line(m0, u1, '#78350f', R * 0.015);
      line(m1, u0, '#78350f', R * 0.015);
    }
    else if (theme === 'bavarian') {
      // BAVARIAN: White Stucco & Brown Fachwerk Half-Timbered A-Frame with Blue/White Lozenge Arch & Geraniums
      const m0 = lerp(f0, top, 0.30), m1 = lerp(f1, top, 0.30);
      poly([f0, m0, m1, f1, lerp(f1, f0, 0.16), lerp(m1, m0, 0.22), lerp(m0, m1, 0.22), lerp(f0, f1, 0.16)], '#f8fafc', '#5a3b22', R * 0.008);
      [f0, f1].forEach(f => {
        line(f, top, '#5a3b22', R * 0.056);
        line(f, top, '#f8fafc', R * 0.036);
        for (let s = 0.2; s < 0.85; s += 0.22) {
          const pA = lerp(f, top, s), pB = lerp(f, top, s + 0.12);
          line([pA[0] - R * 0.015, pA[1]], [pB[0] + R * 0.015, pB[1]], '#5a3b22', R * 0.012);
        }
      });
      line(m0, m1, '#2563eb', R * 0.030);
      line(m0, m1, '#ffffff', R * 0.012);
      if (isFront) {
        [f0, f1].forEach(f => {
          ell([f[0], f[1] - R * 0.015], R * 0.055, R * 0.024, '#15803d');
          disc([f[0] - R * 0.018, f[1] - R * 0.022], R * 0.014, '#ef4444');
          disc([f[0] + R * 0.018, f[1] - R * 0.022], R * 0.014, '#ef4444');
        });
      }
    }
    else if (theme === 'classic') {
      // CLASSIC MIDWAY: Red-and-Cream Striped Carnival Pylons with Chasing Marquee Bulbs
      const m0 = lerp(f0, top, 0.30), m1 = lerp(f1, top, 0.30);
      line(m0, m1, '#b91c1c', R * 0.034);
      line(m0, m1, '#facc15', R * 0.014);
      [f0, f1].forEach(f => {
        line(f, top, '#7f1d1d', R * 0.056);
        for (let s = 0; s < 7; s++) {
          const a = lerp(f, top, s / 7), b = lerp(f, top, (s + 0.9) / 7);
          line(a, b, s % 2 === 0 ? '#fffbeb' : '#e11d48', R * 0.042);
        }
        if (isFront) {
          for (let d = 1; d <= 6; d++) {
            const lp = lerp(f, top, d / 7);
            disc(lp, R * 0.010, (d + Math.floor(th * 6)) % 2 ? '#fef08a' : '#f97316');
          }
        }
      });
    }
    else if (theme === 'jungle') {
      // JUNGLE: Stepped Mayan Limestone Obelisk Pylons with Hanging Vines
      const m0 = lerp(f0, top, 0.30), m1 = lerp(f1, top, 0.30);
      line(m0, m1, '#78350f', R * 0.032);
      line(m0, m1, '#2fbf9a', R * 0.014);
      [f0, f1].forEach(f => {
        line(f, top, '#4a4737', R * 0.062);
        line(f, top, '#bdb9a0', R * 0.044);
        [0.32, 0.62].forEach(t => {
          const vp = lerp(f, top, t);
          ell(vp, R * 0.035, R * 0.020, '#15803d');
          line(vp, [vp[0], vp[1] + R * 0.07], '#166534', R * 0.010);
        });
      });
    }
    else if (theme === 'medieval') {
      // MEDIEVAL: Crenellated Castle Stone Gatehouse Pylons with Heraldic Shields
      const m0 = lerp(f0, top, 0.30), m1 = lerp(f1, top, 0.30);
      line(m0, m1, '#475569', R * 0.034);
      line(m0, m1, '#f5c542', R * 0.014);
      [f0, f1].forEach((f, idx) => {
        line(f, top, '#334155', R * 0.060);
        line(f, top, '#cbd5e1', R * 0.042);
        if (isFront) {
          const sp = lerp(f, top, 0.48);
          poly([
            [sp[0] - R * 0.032, sp[1] - R * 0.032], [sp[0] + R * 0.032, sp[1] - R * 0.032],
            [sp[0] + R * 0.028, sp[1] + R * 0.015], [sp[0], sp[1] + R * 0.045], [sp[0] - R * 0.028, sp[1] + R * 0.015]
          ], idx % 2 ? '#1d4ed8' : '#b91c1c', '#f5c542', R * 0.008);
        }
      });
    }
    else if (theme === 'nordic') {
      // NORDIC: Tarred Viking Stave-Timber Pylons with Painted Round Shields
      const m0 = lerp(f0, top, 0.30), m1 = lerp(f1, top, 0.30);
      line(m0, m1, '#290f02', R * 0.034);
      line(m0, m1, '#f59e0b', R * 0.014);
      [f0, f1].forEach((f, idx) => {
        line(f, top, '#290f02', R * 0.058);
        line(f, top, '#5a361a', R * 0.040);
        if (isFront) {
          [0.35, 0.65].forEach((t, si) => {
            const sp = lerp(f, top, t);
            disc(sp, R * 0.028, (idx + si) % 2 ? '#991b1b' : '#0284c7', '#f59e0b', R * 0.007);
            disc(sp, R * 0.009, '#fde047');
          });
        }
      });
    }
    else if (theme === 'gothic') {
      // GOTHIC: Pointed-Arch Obsidian Cathedral Buttress Pylons
      const m0 = lerp(f0, top, 0.32), m1 = lerp(f1, top, 0.32);
      const archApex = [(m0[0] + m1[0]) * 0.5, (m0[1] + m1[1]) * 0.5 - R * 0.065];
      line(m0, archApex, '#18181b', R * 0.028);
      line(m1, archApex, '#18181b', R * 0.028);
      line(m0, archApex, '#991b1b', R * 0.012);
      line(m1, archApex, '#991b1b', R * 0.012);
      [f0, f1].forEach(f => {
        line(f, top, '#09090b', R * 0.058);
        line(f, top, '#3f3f46', R * 0.038);
      });
    }
    else if (theme === 'space' || theme === 'retro_future') {
      // SPACE & RETRO-FUTURE: Curved Swept Googie / Titanium Parabolic Arch Pylons
      const isRetro = theme === 'retro_future';
      const cMain = isRetro ? '#f8fafc' : '#cbd5e1';
      const cGlow = isRetro ? '#f97316' : '#22d3ee';
      const m0 = lerp(f0, top, 0.30), m1 = lerp(f1, top, 0.30);
      line(m0, m1, '#0f172a', R * 0.030);
      line(m0, m1, cGlow, R * 0.014);
      [f0, f1].forEach((f, idx) => {
        const bow = idx === 0 ? -R * 0.055 : R * 0.055;
        const ctrl = [(f[0] + top[0]) * 0.5 + bow, (f[1] + top[1]) * 0.5];
        ctx.strokeStyle = '#0f172a'; ctx.lineWidth = R * 0.060;
        ctx.beginPath(); ctx.moveTo(f[0], f[1]); ctx.quadraticCurveTo(ctrl[0], ctrl[1], top[0], top[1]); ctx.stroke();
        ctx.strokeStyle = cMain; ctx.lineWidth = R * 0.042;
        ctx.beginPath(); ctx.moveTo(f[0], f[1]); ctx.quadraticCurveTo(ctrl[0], ctrl[1], top[0], top[1]); ctx.stroke();
        ctx.strokeStyle = cGlow; ctx.lineWidth = R * 0.014;
        ctx.beginPath(); ctx.moveTo(f[0], f[1]); ctx.quadraticCurveTo(ctrl[0], ctrl[1], top[0], top[1]); ctx.stroke();
      });
    }
    else {
      // FRONTIER, AMERICANA, ALPS, FIESTA, TIKI, CARIBBEAN
      const pCols = {
        frontier:    ['#4a3320', '#8a5a33', '#2f5f3a'],
        americana:   ['#7f1d1d', '#fbf6e8', '#1d3557'],
        alps:        ['#451a03', '#b45309', '#f8fafc'],
        fiesta:      ['#9a3412', '#f59e0b', '#0d9488'],
        jungle_tiki: ['#3e2716', '#78350f', '#d9a74a'],
        caribbean:   ['#5c5443', '#e2d8c3', '#c2410c']
      }[theme] || ['#475569', '#94a3b8', accent];

      const m0 = lerp(f0, top, 0.30), m1 = lerp(f1, top, 0.30);
      line(m0, m1, pCols[0], R * 0.032);
      line(m0, m1, pCols[2], R * 0.016);
      [f0, f1].forEach(f => {
        line(f, top, pCols[0], R * 0.058);
        line(f, top, pCols[1], R * 0.040);
        line(lerp(f, top, 0.65), lerp(f, top, 0.90), pCols[2], R * 0.046);
      });
    }
  };

  // =========================================================================
  // 4. WHEEL RIMS, SPOKES & TIE RODS
  // =========================================================================
  const rimColMain = {
    standard: '#cbd5e1',         western: '#9a6a3c',         bavarian: '#f8fafc',       classic: '#fef08a',
    jungle: '#bdb9a0',           medieval: '#94a3b8',        nordic: '#78350f',         frontier: '#8a5a33',
    americana: '#fbf6e8',        alps: '#f8fafc',            fiesta: '#f59e0b',         gothic: '#52525b',
    space: '#e2e8f0',            retro_future: '#f8fafc',    jungle_tiki: '#d9a74a',    caribbean: '#d97706',
    galactic_outpost: '#94a3b8', jurassic_island: '#d97706', china: '#facc15',          japan: '#f8fafc',
    ancient_rome: '#f5f5f4',     ancient_greece: '#ffffff',  egypt: '#eab308',          babylon: '#3b82f6'
  }[theme] || '#cbd5e1';

  const ring = (Y, c, w) => {
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i <= 64; i++) {
      const p = rim(i / 64 * TAU, Y);
      i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]);
    }
    ctx.closePath();
    ctx.stroke();
  };
  const spokes = (Y, c) => {
    for (let k = 0; k < N; k++) line(P(0, Y, Zh), rim(th + k * TAU / N, Y), c, R * 0.011);
  };

  // Back support tower (-ya) & main axle
  drawThemedSupport(-ya, false);
  line(P(0, -ya, Zh), P(0, ya, Zh), '#475569', R * 0.055);
  line(P(0, -ya, Zh), P(0, ya, Zh), '#cbd5e1', R * 0.025);

  // Back wheel rim, spokes & cross-tie rods
  ring(-yw, shade(rimColMain, -0.35), R * 0.028);
  spokes(-yw, shade(rimColMain, -0.35));
  for (let k = 0; k < N; k++) {
    line(rim(th + k * TAU / N, -yw), rim(th + k * TAU / N, yw), '#94a3b8', R * 0.010);
  }

  // =========================================================================
  // 5. GONDOLAS & CUSTOM VEHICLES (Hanging Upright at Mid-Depth Y = 0)
  // =========================================================================
  const CABIN_PALETTES = {
    standard:        [accent, '#f8fafc', '#facc15'],
    jungle:          ['#137a70', '#eab308', '#b45309'],
    medieval:        ['#b91c1c', '#1d4ed8', '#f5c542'],
    nordic:          ['#991b1b', '#0284c7', '#d97706'],
    frontier:        ['#2f5f3a', '#9a3412', '#d97706'],
    americana:       ['#b91c1c', '#fbf6e8', '#1d3557'],
    alps:            ['#dc2626', '#f8fafc', '#0284c7'],
    fiesta:          ['#e11d48', '#0d9488', '#f59e0b'],
    gothic:          ['#581c87', '#991b1b', '#27272a'],
    space:           ['#0284c7', '#e2e8f0', '#22d3ee'],
    retro_future:    ['#f97316', '#06b6d4', '#f8fafc'],
    jungle_tiki:     ['#d97706', '#15803d', '#b45309'],
    caribbean:       ['#b91c1c', '#0d9488', '#d97706'],
    galactic_outpost:['#475569', '#c2410c', '#64748b'],
    jurassic_island: ['#854d27', '#15803d', '#d97706'],
    japan:           ['#1e293b', '#b91c1c', '#78350f'],
    ancient_rome:    ['#f5efe0', '#b91c1c', '#eab308'],
    ancient_greece:  ['#ffffff', '#0284c7', '#e2e8f0'],
    egypt:           ['#eab308', '#1d4ed8', '#0d9488'],
    babylon:         ['#1d4ed8', '#eab308', '#15803d']
  };

  const cab = [];
  for (let k = 0; k < N; k++) {
    const a = th + k * TAU / N;
    cab.push({ c: rim(a, 0), k });
  }
  cab.sort((u, v) => u.c[1] - v.c[1]).forEach(({ c, k }) => {
    const cxG = c[0], cyG = c[1];

    if (theme === 'china') {
      // CHINA: Hanging Red-and-Gold Octagonal Silk Palace Lanterns with Golden Tassels!
      line(c, [cxG, cyG + R * 0.022], '#facc15', R * 0.010);
      const lw = R * 0.036, lh = R * 0.056, lTop = cyG + R * 0.024, lBot = lTop + lh;
      // Top & bottom golden lantern caps
      ctx.fillStyle = '#facc15';
      ctx.fillRect(cxG - lw * 0.58, lTop - R * 0.008, lw * 1.16, R * 0.010);
      ctx.fillRect(cxG - lw * 0.58, lBot - R * 0.002, lw * 1.16, R * 0.010);
      // Crimson silk lantern body with vertical gold ribs & warm amber core glow
      ell([cxG, lTop + lh * 0.5], lw, lh * 0.52, '#dc2626', '#facc15', R * 0.006);
      ell([cxG, lTop + lh * 0.5], lw * 0.45, lh * 0.42, '#f97316');
      disc([cxG, lTop + lh * 0.5], R * 0.012, '#fef08a');
      // Hanging golden silk tassel below
      line([cxG, lBot + R * 0.008], [cxG, lBot + R * 0.030], '#facc15', R * 0.008);
    }
    else if (theme === 'galactic_outpost') {
      // GALACTIC OUTPOST: Weathered Durasteel & Rust-Orange Industrial Shuttle Pods
      line(c, [cxG, cyG + R * 0.026], '#334155', R * 0.011);
      const podCol = k % 2 ? '#475569' : '#9a3412';
      prism(ctx, cxG, cyG + R * 0.088, R * 0.038, R * 0.019, R * 0.052, podCol);
      // Industrial armor ridge & glowing cyan viewport slit
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(cxG - R * 0.024, cyG + R * 0.046, R * 0.048, R * 0.014);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(cxG - R * 0.018, cyG + R * 0.049, R * 0.036, R * 0.007);
    }
    else if (theme === 'jurassic_island') {
      // JURASSIC ISLAND: Open-Air Varnished Teak Safari Cabins with Striped Resort Canopies
      line(c, [cxG, cyG + R * 0.026], '#451a03', R * 0.010);
      prism(ctx, cxG, cyG + R * 0.090, R * 0.036, R * 0.018, R * 0.044, '#854d27');
      // Stanchion posts & striped safari-green / cream canopy awning
      line([cxG - R * 0.026, cyG + R * 0.036], [cxG - R * 0.026, cyG + R * 0.054], '#facc15', R * 0.005);
      line([cxG + R * 0.026, cyG + R * 0.036], [cxG + R * 0.026, cyG + R * 0.054], '#facc15', R * 0.005);
      poly([
        [cxG - R * 0.040, cyG + R * 0.038],
        [cxG, cyG + R * 0.024],
        [cxG + R * 0.040, cyG + R * 0.038]
      ], k % 2 ? '#15803d' : '#fef3c7', '#451a03', R * 0.005);
    }
    else if (theme === 'japan') {
      // JAPAN: Edo Wooden Yakatabune / Palanquin Cabins with Curved Dark-Tiled Roofs
      line(c, [cxG, cyG + R * 0.026], '#1e293b', R * 0.010);
      prism(ctx, cxG, cyG + R * 0.090, R * 0.035, R * 0.017, R * 0.048, k % 2 ? '#b91c1c' : '#78350f');
      // Warm shoji screen window
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(cxG - R * 0.015, cyG + R * 0.052, R * 0.030, R * 0.018);
      // Curved black-tiled Edo roof eave
      poly([
        [cxG - R * 0.044, cyG + R * 0.042],
        [cxG, cyG + R * 0.026],
        [cxG + R * 0.044, cyG + R * 0.042]
      ], '#0f172a', '#facc15', R * 0.005);
    }
    else if (theme === 'ancient_rome' || theme === 'ancient_greece') {
      // ANCIENT ROME & GREECE: Classical Marble & Imperial Draped Chariot/Gazebo Cabins
      const isRome = theme === 'ancient_rome';
      line(c, [cxG, cyG + R * 0.026], isRome ? '#facc15' : '#0284c7', R * 0.010);
      prism(ctx, cxG, cyG + R * 0.090, R * 0.036, R * 0.018, R * 0.046, isRome ? '#f5efe0' : '#ffffff');
      // Classical pediment roof in crimson/gold (Rome) or Aegean blue/white (Greece)
      poly([
        [cxG - R * 0.042, cyG + R * 0.044],
        [cxG, cyG + R * 0.026],
        [cxG + R * 0.042, cyG + R * 0.044]
      ], isRome ? '#b91c1c' : '#0284c7', isRome ? '#facc15' : '#ffffff', R * 0.005);
    }
    else if (theme === 'egypt' || theme === 'babylon') {
      // EGYPT & BABYLON: Gilded Solar Barque / Lapis Ziggurat Royal Cabins
      const isEgypt = theme === 'egypt';
      line(c, [cxG, cyG + R * 0.026], '#facc15', R * 0.010);
      prism(ctx, cxG, cyG + R * 0.090, R * 0.036, R * 0.018, R * 0.048, isEgypt ? '#eab308' : '#1d4ed8');
      ctx.fillStyle = isEgypt ? '#1d4ed8' : '#facc15';
      ctx.fillRect(cxG - R * 0.016, cyG + R * 0.052, R * 0.032, R * 0.016);
      // Stepped ziggurat or curved lotus canopy roof
      poly([
        [cxG - R * 0.040, cyG + R * 0.042],
        [cxG - R * 0.020, cyG + R * 0.028],
        [cxG + R * 0.020, cyG + R * 0.028],
        [cxG + R * 0.040, cyG + R * 0.042]
      ], isEgypt ? '#0d9488' : '#facc15', '#78350f', R * 0.005);
    }
    else if (theme === 'western') {
      // WILD WEST: Covered Baskets (Wicker Basket Tub + Hooped White Canvas Bonnet!)
      line(c, [cxG, cyG + R * 0.025], '#451a03', R * 0.011);
      const bw = R * 0.042, bh = R * 0.036, bTop = cyG + R * 0.056;
      ctx.fillStyle = k % 2 ? '#fdfbf5' : '#f5efe0';
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = R * 0.007;
      ctx.beginPath();
      ctx.arc(cxG, bTop, bw * 0.96, Math.PI, 0);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.arc(cxG, bTop, bw * 0.62, Math.PI, 0);
      ctx.stroke();
      prism(ctx, cxG, bTop + bh, bw, R * 0.020, bh, '#b45309');
      ctx.fillStyle = '#451a03';
      ctx.fillRect(cxG - bw * 0.65, bTop - R * 0.012, bw * 1.3, R * 0.014);
    }
    else if (theme === 'bavarian') {
      // BAVARIAN: Frothy Oktoberfest Beer Mugs (Maßkrüge) with Handles & Overflowing Foam!
      line(c, [cxG, cyG + R * 0.025], '#78350f', R * 0.011);
      const mw = R * 0.034, mh = R * 0.062, mTop = cyG + R * 0.036, mBot = mTop + mh;
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = R * 0.012;
      ctx.beginPath();
      ctx.arc(cxG + mw * 0.92, mTop + mh * 0.52, R * 0.022, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = R * 0.006;
      ctx.beginPath();
      ctx.roundRect(cxG - mw, mTop, mw * 2, mh, R * 0.008);
      ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
      ctx.lineWidth = R * 0.005;
      [-0.45, 0, 0.45].forEach(fx => {
        ctx.beginPath();
        ctx.moveTo(cxG + fx * mw, mTop + R * 0.012);
        ctx.lineTo(cxG + fx * mw, mBot - R * 0.010);
        ctx.stroke();
      });
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(cxG - mw * 1.04, mBot - R * 0.010, mw * 2.08, R * 0.010);
      [-0.65, 0, 0.65].forEach((fx, idx) => {
        disc([cxG + fx * mw * 0.85, mTop - (idx === 1 ? R * 0.006 : 0)], R * 0.018, '#ffffff');
      });
    }
    else if (theme === 'classic') {
      // CLASSIC MIDWAY: Colorful Striped Hot-Air Balloons with Suspended Wicker Baskets!
      line(c, [cxG, cyG + R * 0.016], '#b45309', R * 0.010);
      const bRad = R * 0.044, bCy = cyG + R * 0.052;
      const bCol1 = ['#e11d48', '#2563eb', '#f59e0b', '#10b981'][k % 4];
      const bCol2 = '#fffbeb';
      ctx.fillStyle = bCol1;
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = R * 0.006;
      ctx.beginPath();
      ctx.arc(cxG, bCy - R * 0.008, bRad, Math.PI * 0.85, Math.PI * 0.15, false);
      ctx.lineTo(cxG + bRad * 0.35, bCy + bRad * 0.92);
      ctx.lineTo(cxG - bRad * 0.35, bCy + bRad * 0.92);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ell([cxG, bCy - R * 0.004], bRad * 0.42, bRad * 0.92, bCol2);
      const baskY = bCy + bRad * 0.92 + R * 0.016;
      line([cxG - bRad * 0.3, bCy + bRad * 0.90], [cxG - R * 0.016, baskY], '#d6ceba', R * 0.004);
      line([cxG + bRad * 0.3, bCy + bRad * 0.90], [cxG + R * 0.016, baskY], '#d6ceba', R * 0.004);
      prism(ctx, cxG, baskY + R * 0.024, R * 0.022, R * 0.011, R * 0.024, '#b45309');
    }
    else {
      // ALL OTHER THEMES: Theme-Colored Passenger Cabins with Tinted Windows & Roof Trim
      const cols = CABIN_PALETTES[theme] || CABIN_PALETTES.standard;
      const cabCol = cols[k % 3];
      const winCol = (theme === 'space' || theme === 'retro_future') ? '#22d3ee'
                   : (theme === 'gothic') ? '#facc15' : '#7dd3fc';
      line(c, [cxG, cyG + R * 0.03], '#475569', R * 0.01);
      prism(ctx, cxG, cyG + R * 0.09, R * 0.036, R * 0.018, R * 0.055, cabCol);
      ctx.fillStyle = winCol;
      ctx.fillRect(cxG - R * 0.014, cyG + R * 0.05, R * 0.028, R * 0.018);
    }
  });

  // =========================================================================
  // 6. FRONT WHEEL RIM, SPOKES, CHASING LIGHTS, FRONT SUPPORT & HUB CENTERPIECE
  // =========================================================================
  spokes(yw, rimColMain);
  ring(yw, rimColMain, R * 0.034);
  ring(yw, theme === 'standard' ? accent : meta.border, R * 0.014);

  // Chasing Rim Lights
  for (let i = 0; i < 24; i++) {
    const p = rim(th + i * Math.PI / 12, yw);
    const c1 = (theme === 'space' || theme === 'retro_future' || theme === 'galactic_outpost') ? '#38bdf8'
             : (theme === 'gothic') ? '#c084fc' : '#fef08a';
    const c2 = (theme === 'space') ? '#e879f9'
             : (theme === 'bavarian' || theme === 'ancient_greece' || theme === 'babylon') ? '#38bdf8'
             : (theme === 'jurassic_island') ? '#4ade80' : '#fb923c';
    disc(p, R * 0.011, (i + Math.floor(th * 3)) % 2 ? c1 : c2);
  }

  // Front Support Tower (+ya)
  drawThemedSupport(ya, true);

  // =========================================================================
  // 7. BESPOKE CENTRAL HUB CENTERPIECE (`P(0, ya, Zh)`)
  // =========================================================================
  const h = P(0, ya, Zh);
  if (theme === 'galactic_outpost') {
    // Weathered Durasteel & Rust-Orange Reactor Core Hub with Glowing Cyan/Amber Ring
    disc(h, R * 0.092, '#1e293b', '#ea580c', R * 0.014);
    disc(h, R * 0.062, '#334155', '#38bdf8', R * 0.008);
    disc(h, R * 0.028, '#f97316', '#fef08a', R * 0.005);
  }
  else if (theme === 'jurassic_island') {
    // Prehistoric Amber Mosquito / Jurassic Crest Medallion Hub
    disc(h, R * 0.092, '#15803d', '#eab308', R * 0.014);
    disc(h, R * 0.064, '#f59e0b', '#fef08a', R * 0.008);
    ell(h, R * 0.022, R * 0.014, '#451a03', null, 0, -0.4);
  }
  else if (theme === 'china') {
    // Imperial Gold Dragon / Yin-Yang Jade & Crimson Medallion Hub
    disc(h, R * 0.092, '#dc2626', '#facc15', R * 0.014);
    disc(h, R * 0.060, '#10b981', '#fef08a', R * 0.007);
    disc(h, R * 0.024, '#facc15');
  }
  else if (theme === 'japan') {
    // Gold-and-Crimson Samurai Kamon Crest & Cherry Blossom Medallion Hub
    disc(h, R * 0.090, '#0f172a', '#dc2626', R * 0.014);
    for (let k = 0; k < 5; k++) {
      const a = th + k * TAU / 5;
      disc([h[0] + Math.cos(a) * R * 0.036, h[1] + Math.sin(a) * R * 0.036], R * 0.018, '#fbcfe8', '#f43f5e', R * 0.004);
    }
    disc(h, R * 0.022, '#facc15');
  }
  else if (theme === 'ancient_rome') {
    // Imperial Gold Laurel Wreath & Crimson Aquila Shield Hub
    disc(h, R * 0.092, '#b91c1c', '#facc15', R * 0.015);
    disc(h, R * 0.056, '#facc15', '#7f1d1d', R * 0.007);
    disc(h, R * 0.022, '#ffffff');
  }
  else if (theme === 'ancient_greece') {
    // Aegean-Blue & Gold Athenian Owl / Meander Sunburst Medallion Hub
    disc(h, R * 0.092, '#0284c7', '#ffffff', R * 0.014);
    const pts = [];
    for (let i = 0; i < 12; i++) {
      const a = th + i * TAU / 12;
      const rad = (i % 2 === 0) ? R * 0.068 : R * 0.034;
      pts.push([h[0] + Math.cos(a) * rad, h[1] + Math.sin(a) * rad]);
    }
    poly(pts, '#facc15', '#0f172a', R * 0.005);
  }
  else if (theme === 'egypt') {
    // Winged Solar Disc of Ra / Scarab Medallion Hub
    disc(h, R * 0.092, '#1d4ed8', '#facc15', R * 0.014);
    line([h[0] - R * 0.072, h[1]], [h[0] + R * 0.072, h[1]], '#facc15', R * 0.018);
    disc(h, R * 0.036, '#dc2626', '#fef08a', R * 0.007);
  }
  else if (theme === 'babylon') {
    // Golden 8-Pointed Star of Ishtar Medallion Hub on Cobalt Blue
    disc(h, R * 0.092, '#1d4ed8', '#facc15', R * 0.014);
    const pts = [];
    for (let i = 0; i < 16; i++) {
      const a = -th + i * TAU / 16;
      const rad = (i % 2 === 0) ? R * 0.074 : R * 0.030;
      pts.push([h[0] + Math.cos(a) * rad, h[1] + Math.sin(a) * rad]);
    }
    poly(pts, '#facc15', '#ffffff', R * 0.005);
    disc(h, R * 0.020, '#dc2626');
  }
  else if (theme === 'standard') {
    disc(h, R * 0.068, accent, '#f8fafc', R * 0.008);
    disc([h[0] - R * 0.02, h[1] - R * 0.02], R * 0.02, shade(accent, 0.45));
  }
  else if (theme === 'western') {
    disc(h, R * 0.085, '#451a03', '#f59e0b', R * 0.012);
    const pts = [];
    for (let i = 0; i < 12; i++) {
      const a = th + i * TAU / 12;
      const rad = (i % 2 === 0) ? R * 0.072 : R * 0.032;
      pts.push([h[0] + Math.cos(a) * rad, h[1] + Math.sin(a) * rad]);
    }
    poly(pts, '#facc15', '#78350f', R * 0.006);
  }
  else if (theme === 'bavarian') {
    disc(h, R * 0.088, '#2563eb', '#f5c542', R * 0.014);
    disc(h, R * 0.062, '#ffffff', '#1e3a8a', R * 0.006);
    line(h, [h[0], h[1] - R * 0.044], '#1e293b', R * 0.009);
    line(h, [h[0] + R * 0.035, h[1]], '#dc2626', R * 0.008);
    disc(h, R * 0.012, '#f5c542');
  }
  else if (theme === 'classic') {
    const pts = [];
    for (let i = 0; i < 16; i++) {
      const a = -th + i * TAU / 16;
      const rad = (i % 2 === 0) ? R * 0.098 : R * 0.052;
      pts.push([h[0] + Math.cos(a) * rad, h[1] + Math.sin(a) * rad]);
    }
    poly(pts, '#facc15', '#e11d48', R * 0.010);
    disc(h, R * 0.042, '#e11d48', '#fffbeb', R * 0.007);
  }
  else if (theme === 'jungle' || theme === 'fiesta') {
    disc(h, R * 0.092, '#eab308', '#78350f', R * 0.012);
    disc(h, R * 0.064, theme === 'jungle' ? '#137a70' : '#e11d48', '#fde047', R * 0.007);
    disc([h[0] - R * 0.022, h[1] - R * 0.01], R * 0.012, '#fef08a');
    disc([h[0] + R * 0.022, h[1] - R * 0.01], R * 0.012, '#fef08a');
  }
  else if (theme === 'medieval' || theme === 'nordic') {
    disc(h, R * 0.088, theme === 'medieval' ? '#b91c1c' : '#451a03', '#f5c542', R * 0.014);
    disc(h, R * 0.048, theme === 'medieval' ? '#f5c542' : '#0284c7', '#fef08a', R * 0.007);
  }
  else if (theme === 'space' || theme === 'retro_future') {
    const cCore = theme === 'space' ? '#22d3ee' : '#f97316';
    disc(h, R * 0.090, '#0f172a', cCore, R * 0.014);
    ell(h, R * 0.075, R * 0.032, null, '#ffffff', R * 0.007, th);
    ell(h, R * 0.075, R * 0.032, null, '#ffffff', R * 0.007, -th);
    disc(h, R * 0.035, cCore);
  }
  else if (theme === 'gothic') {
    disc(h, R * 0.088, '#18181b', '#a1a1aa', R * 0.012);
    disc(h, R * 0.065, '#991b1b', '#facc15', R * 0.006);
    for (let k = 0; k < 6; k++) {
      const a = th + k * Math.PI / 3;
      line(h, [h[0] + Math.cos(a) * R * 0.065, h[1] + Math.sin(a) * R * 0.065], '#09090b', R * 0.006);
    }
  }
  else if (theme === 'alps') {
    disc(h, R * 0.085, '#dc2626', '#f8fafc', R * 0.012);
    for (let k = 0; k < 6; k++) {
      const a = th + k * Math.PI / 3;
      disc([h[0] + Math.cos(a) * R * 0.036, h[1] + Math.sin(a) * R * 0.036], R * 0.018, '#ffffff');
    }
    disc(h, R * 0.022, '#facc15');
  }
  else {
    disc(h, R * 0.085, meta.border, '#facc15', R * 0.012);
    disc(h, R * 0.045, '#fef3c7');
  }

  ctx.restore();
}


NEW_SPRITE_PACKS.rides.ferris_wheel = { skins: FERRIS_WHEEL_SKINS, draw: drawFerrisWheel };
})();

(function () {

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

/* ===== PIRATE SHIP 24-SKIN METADATA ===== */
const PIRATE_SHIP_SKINS = {
  standard:         { id: 'standard',         label: 'Unthemed (Tier 0–2)', name: 'Standard Huss Pirate Ship',         sub: 'Steel A-Frame, Timber Hull & Square Sails',             hex: '#cbd5e1', border: '#d97706', leg1: '#f8fafc', leg2: '#3b82f6' },
  caribbean:        { id: 'caribbean',        label: 'Caribbean',           name: 'Blackbeard’s Spanish Galleon',      sub: 'High Poop-Deck, Stern Lanterns & Jolly Roger Sail',    hex: '#6aa04a', border: '#d97706', leg1: '#78350f', leg2: '#f59e0b' },
  medieval:         { id: 'medieval',         label: 'Medieval',            name: 'Hanseatic Trading Cog',             sub: 'Clinker-Built Tub Hull, Aft Castle & Heraldic Sail',    hex: '#6c8c58', border: '#eab308', leg1: '#64748b', leg2: '#b91c1c' },
  nordic:           { id: 'nordic',           label: 'Nordic',              name: 'Asgardian Viking Longship',         sub: 'Dragon-Head Prow, Round Shields & Striped Sail',       hex: '#4d6b63', border: '#d97706', leg1: '#451a03', leg2: '#f59e0b' },
  western:          { id: 'western',          label: 'Wild West',           name: 'Mississippi Sternwheeler Boat',     sub: 'Twin Smokestacks, Texas Deck & Red Paddlewheel',       hex: '#c99a62', border: '#b91c1c', leg1: '#9a3412', leg2: '#fef3c7' },
  frontier:         { id: 'frontier',         label: 'Frontier',            name: 'Birchbark Indian War Canoe',        sub: 'High-Curled Birch Hull, Painted Totems & Paddles',     hex: '#7d955d', border: '#566e42', leg1: '#6b4a2b', leg2: '#eab308' },
  americana:        { id: 'americana',        label: 'Americana',           name: 'Staten Island Harbor Ferry',        sub: 'Double-Deck Red/Cream Passenger Ferry & Wheelhouse',    hex: '#a8644c', border: '#b91c1c', leg1: '#fbf6e8', leg2: '#1d3557' },
  alps:             { id: 'alps',             label: 'Alps',                name: 'Matterhorn Snowtube Cruiser',       sub: 'Giant Inflatable Red/Blue Snowtube Ship & Handles',    hex: '#a8c5d6', border: '#0284c7', leg1: '#f8fafc', leg2: '#dc2626' },
  fiesta:           { id: 'fiesta',           label: 'Fiesta',              name: 'Rainbow Paper-Fringe Piñata',       sub: '7-Pointed Piñata Spikes, Tissue Fringes & Streamers',    hex: '#d99b52', border: '#e11d48', leg1: '#f59e0b', leg2: '#0d9488' },
  gothic:           { id: 'gothic',           label: 'Gothic',              name: 'The Flying Dutchman Ghost Ship',    sub: 'Tattered Spectral Sails, Ectoplasm Glow & Rib Cage',    hex: '#3b3345', border: '#7e22ce', leg1: '#18181b', leg2: '#10b981' },
  space:            { id: 'space',            label: 'Space',               name: 'Orbital Star-Cruiser Frigate',      sub: 'Titanium Hull, Glowing Cyan Ion Thrusters & Fins',     hex: '#334155', border: '#0ea5e9', leg1: '#0f172a', leg2: '#22d3ee' },
  retro_future:     { id: 'retro_future',     label: 'Retro-Future',        name: 'Tomorrowland Atomic Rocketship',    sub: 'Chrome 1950s Finned Spaceship, Bubble Dome & Ring',    hex: '#bcc8d5', border: '#f97316', leg1: '#f8fafc', leg2: '#06b6d4' },
  jungle:           { id: 'jungle',           label: 'Jungle',              name: 'Amazon Explorer Bamboo Raft',       sub: 'Lashed Bamboo Logs, Crate Cargo & Fern-Leaf Sail',     hex: '#587c48', border: '#2fbf9a', leg1: '#78350f', leg2: '#2fbf9a' },
  tiki:             { id: 'tiki',             label: 'Tiki',                name: 'Kon-Tiki Outrigger Raft',           sub: 'Bound Driftwood Logs, Tiki Idol Mask & Woven Sail',    hex: '#5c9444', border: '#d97706', leg1: '#5a3b22', leg2: '#f59e0b' },
  classic:          { id: 'classic',          label: 'Classic Midway',      name: 'Coney Island Showboat Flyer',       sub: 'Red-and-Gold Striped Carnival Hull & Bulb Mast',       hex: '#cbb07c', border: '#e11d48', leg1: '#e11d48', leg2: '#fef08a' },
  bavarian:         { id: 'bavarian',         label: 'Bavarian',            name: 'Königssee Royal Excursion Ship',    sub: 'Blue-and-White Lozenge Hull, Onion Mast & Barrels',    hex: '#769958', border: '#2563eb', leg1: '#f8fafc', leg2: '#2563eb' },

  /* === 8 NEW EXPANSION LANDS === */
  galactic_outpost: { id: 'galactic_outpost', label: 'Galactic Outpost',    name: 'Batuu Industrial Cargo Shuttle',    sub: 'Weathered Heavy Freighter, Engine Vents & Spire Rocks', hex: '#7c6f64', border: '#d97706', leg1: '#6b5e54', leg2: '#ea580c', isNew: true },
  jurassic_island:  { id: 'jurassic_island',  label: 'Jurassic Island',     name: 'Isla Nublar Resort Timber Cruiser', sub: 'Varnished Teak Launch, Striped Canopy & Life Rings',   hex: '#4d7c47', border: '#eab308', leg1: '#5c3a21', leg2: '#eab308', isNew: true },
  china:            { id: 'china',            label: 'China',               name: 'Ming Imperial Dragon Junk',          sub: 'High Stern Castle, Red Battened Lug Sails & Lanterns',  hex: '#6e8b5e', border: '#dc2626', leg1: '#991b1b', leg2: '#facc15', isNew: true },
  japan:            { id: 'japan',            label: 'Japan',               name: 'Edo Shogunate Atakebune Warship',   sub: 'Lacquered Armor Hull, Crest Sail & Pagoda Yagura',      hex: '#5d7a64', border: '#e11d48', leg1: '#1e293b', leg2: '#dc2626', isNew: true },
  ancient_rome:     { id: 'ancient_rome',     label: 'Ancient Rome',        name: 'Imperial Quinquereme War Galley',   sub: 'Bronze Battering Ram, Boarding Corvus & Eagle Sail',    hex: '#b89f7d', border: '#b91c1c', leg1: '#e2e8f0', leg2: '#b91c1c', isNew: true },
  ancient_greece:   { id: 'ancient_greece',   label: 'Ancient Greece',      name: 'Athenian Olympias Trireme',         sub: 'Bronze Ram, Painted Eye Prow, Oar Banks & Owl Sail',    hex: '#8da4b5', border: '#0284c7', leg1: '#f8fafc', leg2: '#0284c7', isNew: true },
  egypt:            { id: 'egypt',            label: 'Egypt',               name: 'Pharaonic Solar Barque of Ra',      sub: 'Gilded Papyrus-Stem Prow, Lotus Stern & Sun-Disc Sail', hex: '#d4b475', border: '#d97706', leg1: '#c29b61', leg2: '#1d4ed8', isNew: true },
  babylon:          { id: 'babylon',          label: 'Babylon',             name: 'Euphrates Royal Processional Barge', sub: 'Lapis-Lazuli Glazed Hull, Gold Bull Prow & Lion Sail',  hex: '#8b7e6a', border: '#2563eb', leg1: '#1d4ed8', leg2: '#facc15', isNew: true }
};

/* Theme aliases for seamless engine lookup */
PIRATE_SHIP_SKINS.unthemed     = PIRATE_SHIP_SKINS.standard;
PIRATE_SHIP_SKINS.german       = PIRATE_SHIP_SKINS.bavarian;
PIRATE_SHIP_SKINS.wildwest     = PIRATE_SHIP_SKINS.western;
PIRATE_SHIP_SKINS.retro        = PIRATE_SHIP_SKINS.retro_future;
PIRATE_SHIP_SKINS.galaxys_edge = PIRATE_SHIP_SKINS.galactic_outpost;
PIRATE_SHIP_SKINS.jurassic     = PIRATE_SHIP_SKINS.jurassic_island;
PIRATE_SHIP_SKINS.rome         = PIRATE_SHIP_SKINS.ancient_rome;
PIRATE_SHIP_SKINS.greece       = PIRATE_SHIP_SKINS.ancient_greece;

/* ===== SPRITE RENDERER ===== */
function drawPirateShip(ctx, cx, cy, R, o = {}) {
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTh = String(o.themeId || o.theme || 'standard').toLowerCase().replace(/[\s-]+/g, '_');
  if (rawTh === 'unthemed') rawTh = 'standard';
  if (rawTh === 'german') rawTh = 'bavarian';
  if (rawTh === 'wildwest' || rawTh === 'wild_west') rawTh = 'western';
  if (rawTh === 'retro') rawTh = 'retro_future';
  if (rawTh === 'galaxys_edge' || rawTh === 'galactic') rawTh = 'galactic_outpost';
  if (rawTh === 'jurassic') rawTh = 'jurassic_island';
  if (rawTh === 'rome') rawTh = 'ancient_rome';
  if (rawTh === 'greece') rawTh = 'ancient_greece';
  const theme = (tier <= 2 || !PIRATE_SHIP_SKINS[rawTh]) ? 'standard' : rawTh;
  const meta = PIRATE_SHIP_SKINS[theme] || PIRATE_SHIP_SKINS.standard;

  const accent = o.accent || meta.border || '#d97706';
  const clockT = (o.t != null) ? o.t : (typeof performance !== 'undefined' ? performance.now() / 1000 : 0.6);
  const swingAng = (o.angle != null) ? o.angle : (0.92 * Math.sin(clockT * 1.45));
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
  const cyB = cy + R * 0.07;
  const S = R * 0.076;
  const P = (X, Y, Z) => [cx + (X - Y) * 0.7 * S, cyB + (X + Y) * 0.35 * S - Z * S];
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

  const line = (a, b, c, w) => {
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  };
  const poly = (pts, fill, stroke, lw) => {
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || S * 0.06; ctx.stroke(); }
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

  // Structural A-frame dimensions
  const Zp   = 7.8;    // Overhead pivot axle height
  const Larm = 5.45;   // Pendulum suspension radius
  const ay   = 2.15;   // Half-distance between Back (-ay) and Front (+ay) A-frame pylons
  const leg  = 3.15;   // Half-spread of A-frame legs

  // Pendulum 3D kinematics
  const sp = Math.sin(swingAng), cp = Math.cos(swingAng);
  const V = (lx, ly, lz) => {
    const relZ = lz - Larm;
    const wx = lx * cp + relZ * sp;
    const wz = Zp - lx * sp + relZ * cp;
    return P(wx, ly, wz);
  };

  // Helper: Draw a 3D box attached to swinging vessel frame
  const vBox = (x0, x1, y0, y1, z0, z1, cFront, cSide, cTop, strokeCol, lw) => {
    if (cTop) poly([V(x0,y0,z1), V(x1,y0,z1), V(x1,y1,z1), V(x0,y1,z1)], cTop, strokeCol, lw);
    poly([V(x0,y1,z0), V(x1,y1,z0), V(x1,y1,z1), V(x0,y1,z1)], cFront, strokeCol, lw);
    poly([V(x1,y0,z0), V(x1,y1,z0), V(x1,y1,z1), V(x1,y0,z1)], cSide, strokeCol, lw);
  };

  // Helper: Draw 5 Rows of 2 Seated Passengers inside the vessel
  const drawVesselRiders = (rowsX, zSeat, benchCol) => {
    const shirts = ['#ef4444', '#3b82f6', '#22c55e', '#facc15', '#a855f7'];
    const isHelmet = (theme === 'space' || theme === 'retro_future');
    rowsX.forEach((rx, rIdx) => {
      vBox(rx - 0.25, rx + 0.25, -0.78, 0.78, zSeat - 0.15, zSeat + 0.08, benchCol, shade(benchCol, -0.25), shade(benchCol, 0.15));
      [-0.42, 0.42].forEach((ry, sIdx) => {
        const torso = V(rx, ry, zSeat + 0.34);
        const head  = V(rx, ry, zSeat + 0.72);
        ell(torso, S * 0.23, S * 0.26, shirts[(rIdx + sIdx) % 5]);
        disc(head, S * 0.18, isHelmet ? '#ffffff' : '#fde4c8', '#1e293b', S * 0.03);
        if (isHelmet) {
          disc([head[0] + S * 0.04, head[1]], S * 0.11, '#0284c7');
        }
      });
      line(V(rx + 0.22, -0.76, zSeat + 0.35), V(rx + 0.22, 0.76, zSeat + 0.35), '#facc15', S * 0.08);
    });
  };

  // 2. Ground Boarding Platform & Dynamic Vessel Shadow
  poly([P(-2.4, -1.1, 0), P(2.4, -1.1, 0), P(2.4, 1.1, 0), P(-2.4, 1.1, 0)], 'rgba(15, 23, 42, 0.22)');
  const shX = Larm * sp * 0.85;
  ell(P(shX, 0, 0), S * 3.8, S * 1.15, 'rgba(10, 15, 25, 0.32)');

  // 3. Helper to draw a themed A-Frame Support Pylon at `Y0`
  const drawAFrame = (Y0, isFront) => {
    const topY = Y0 * 0.82;
    const top  = P(0, topY, Zp);
    const fL   = P(-leg, Y0, 0);
    const fR   = P( leg, Y0, 0);
    const c1   = theme === 'standard' ? '#f8fafc' : meta.leg1;
    const c2   = theme === 'standard' ? accent    : meta.leg2;

    if (theme === 'galactic_outpost') {
      // GALAXY'S EDGE / BATUU PETRIFIED SPIRE ROCKS ENCASING THE A-FRAME SUPPORTS!
      const drawBatuuSpire = (baseX, baseY, peakX, peakY, peakZ, wBase, wTop) => {
        const b1 = P(baseX - wBase, baseY - wBase * 0.55, 0);
        const b2 = P(baseX + wBase, baseY - wBase * 0.45, 0);
        const b3 = P(baseX + wBase * 0.9, baseY + wBase * 0.65, 0);
        const b4 = P(baseX - wBase * 0.85, baseY + wBase * 0.60, 0);
        const t1 = P(peakX - wTop, peakY - wTop * 0.4, peakZ);
        const t2 = P(peakX + wTop, peakY - wTop * 0.3, peakZ + 0.45);
        const t3 = P(peakX + wTop * 0.8, peakY + wTop * 0.5, peakZ + 0.25);
        const t4 = P(peakX - wTop * 0.8, peakY + wTop * 0.45, peakZ - 0.15);

        ell(P(baseX, baseY, 0), S * (wBase * 1.15), S * (wBase * 0.58), 'rgba(15,12,10,0.42)');
        poly([b4, b3, t3, t4], '#6b5e54', '#29221c', S * 0.06);
        poly([b3, b2, t2, t3], '#4a4038', '#29221c', S * 0.06);
        poly([t1, t2, t3, t4], '#85776b', '#29221c', S * 0.05);
        for (let st = 0.22; st <= 0.78; st += 0.26) {
          line(lerp(b4, t4, st), lerp(b3, t3, st), '#3d342d', S * 0.06);
          line(lerp(b3, t3, st), lerp(b2, t2, st), '#29221c', S * 0.06);
        }
        const clamp = lerp(b4, t4, 0.85);
        disc(clamp, S * 0.24, '#334155', '#ea580c', S * 0.05);
      };

      drawBatuuSpire(-leg, Y0, -0.45, topY, Zp + 0.5, 1.15, 0.42);
      drawBatuuSpire( leg, Y0,  0.45, topY, Zp + 0.5, 1.15, 0.42);
      drawBatuuSpire(-leg - 0.75, Y0 + 0.25, -leg - 0.45, Y0 + 0.15, 3.1, 0.65, 0.22);
      drawBatuuSpire( leg + 0.75, Y0 + 0.25,  leg + 0.45, Y0 + 0.15, 3.4, 0.65, 0.22);

      const gL = P(-0.65, topY, Zp - 0.25), gR = P(0.65, topY, Zp - 0.25);
      line(gL, gR, '#1e293b', S * 0.42);
      line(gL, gR, '#475569', S * 0.22);
      disc(top, S * 0.48, '#1e293b', '#ea580c', S * 0.08);
      disc(top, S * 0.24, '#ea580c');
      if (isFront) {
        const antTop = [top[0], top[1] - S * 0.95];
        line(top, antTop, '#94a3b8', S * 0.09);
        disc(antTop, S * 0.14, '#f97316', '#ffffff', S * 0.03);
      }
      return;
    }

    // Standard / Themed A-Frame Footpads
    [fL, fR].forEach(ft => {
      ell([ft[0], ft[1] + S * 0.06], S * 0.55, S * 0.26, 'rgba(15,23,42,0.34)');
      ell(ft, S * 0.46, S * 0.22, '#64748b', '#1e293b', S * 0.06);
    });

    // Horizontal tie-bar
    const mL = lerp(fL, top, 0.32), mR = lerp(fR, top, 0.32);
    line(mL, mR, '#1e293b', S * 0.22);
    line(mL, mR, c2, S * 0.12);

    // Splayed A-frame legs
    [fL, fR].forEach(f => {
      line(f, top, '#1e293b', S * 0.44);
      const nSeg = 6;
      for (let s = 0; s < nSeg; s++) {
        const a = lerp(f, top, s / nSeg + 0.01), b = lerp(f, top, (s + 0.88) / nSeg);
        line(a, b, s % 2 === 0 ? c1 : c2, S * 0.30);
      }
    });

    // Apex Bearing Hub & Theme Finial
    disc(top, S * 0.45, '#1e293b', c2, S * 0.08);
    disc(top, S * 0.24, c2);
    if (isFront) {
      const cr = [top[0], top[1] - S * 0.55];
      if (theme === 'caribbean' || theme === 'medieval' || theme === 'nordic' || theme === 'china' || theme === 'japan') {
        line(top, cr, '#facc15', S * 0.10);
        poly([cr, [cr[0] + S * 0.85, cr[1] + S * 0.18], [cr[0], cr[1] + S * 0.42]], theme === 'caribbean' ? '#0f172a' : '#b91c1c', '#facc15', S * 0.05);
      } else if (theme === 'space' || theme === 'retro_future') {
        disc(cr, S * 0.26, '#0f172a', '#22d3ee', S * 0.07);
        disc(cr, S * 0.12, '#22d3ee');
      } else if (theme === 'alps' || theme === 'bavarian') {
        disc(cr, S * 0.28, '#dc2626', '#ffffff', S * 0.07);
      } else if (theme === 'egypt' || theme === 'babylon' || theme === 'ancient_rome' || theme === 'ancient_greece') {
        disc(cr, S * 0.28, '#facc15', '#1d4ed8', S * 0.07);
      }
    }
  };

  // =========================================================================
  // PASS 1: DRAW BACK A-FRAME PYLON (-ay) & OVERHEAD AXLE BEAM
  // =========================================================================
  drawAFrame(-ay, false);
  const axBack = P(0, -ay * 0.82, Zp), axFront = P(0, ay * 0.82, Zp);
  line(axBack, axFront, '#1e293b', S * 0.44);
  line(axBack, axFront, theme === 'galactic_outpost' ? '#64748b' : meta.leg1, S * 0.26);

  // =========================================================================
  // PASS 2: BACK SUSPENSION STRUTS
  // =========================================================================
  const pAxFar  = P(0, -ay * 0.65, Zp);
  const pAxNear = P(0,  ay * 0.65, Zp);
  const woodThemes = ['western', 'frontier', 'jungle', 'tiki', 'nordic', 'jurassic_island', 'china', 'japan', 'ancient_rome', 'ancient_greece', 'egypt', 'babylon'];
  const armCol  = woodThemes.includes(theme) ? '#78350f' : (theme === 'galactic_outpost' ? '#475569' : '#cbd5e1');

  [-2.2, 2.2].forEach(lx => {
    line(pAxFar, V(lx, -0.78, 0.85), '#1e293b', S * 0.22);
    line(pAxFar, V(lx, -0.78, 0.85), armCol, S * 0.12);
  });

  // =========================================================================
  // PASS 3: THE 24 BESPOKE SWINGING VESSELS (Centered at `V(0, 0, 0)`)
  // =========================================================================

  // Helper for classic curved wooden boat hull
  const drawCurvedBoatHull = (hullMain, hullTrim, hullDark, prowZ, sternZ, deckZ, hasSternCastle) => {
    const N = 16;
    const keelPts = [], gunPts = [];
    for (let i = 0; i <= N; i++) {
      const s = -1 + 2 * i / N; // -1 = stern (left), +1 = bow (right)
      const lx = s * 3.45;
      const sheer = Math.pow(Math.abs(s), 2.1);
      const zBot = 0.05 + sheer * (s > 0 ? prowZ * 0.45 : sternZ * 0.45);
      const zTop = deckZ + sheer * (s > 0 ? prowZ : sternZ) + (hasSternCastle && s < -0.45 ? 0.85 : 0);
      keelPts.push(V(lx, 0.72, zBot));
      gunPts.push(V(lx, 0.96, zTop));
    }
    vBox(-2.45, 2.45, -0.82, 0.82, 0.25, deckZ - 0.12, hullDark, hullDark, shade(hullMain, 0.18));
    drawVesselRiders([-2.0, -1.0, 0, 1.0, 2.0], deckZ, hullDark);

    poly(gunPts.concat(keelPts.slice().reverse()), hullMain, hullDark, S * 0.07);
    ctx.strokeStyle = hullTrim; ctx.lineWidth = S * 0.13;
    ctx.beginPath(); gunPts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
  };

  /* -------------------- 8 NEW EXPANSION LANDS -------------------- */
  if (theme === 'galactic_outpost') {
    // 17. GALACTIC OUTPOST: Industrial Batuu Heavy Cargo Freighter
    vBox(-3.1, 2.9, -0.98, 0.98, 0.22, 1.05, '#64748b', '#475569', '#94a3b8', '#1e293b', S * 0.06);
    poly([V(2.9, -0.95, 0.25), V(4.25, -0.35, 0.42), V(4.25, -0.15, 0.85), V(2.9, -0.95, 1.02)], '#475569', '#1e293b', S * 0.06);
    poly([V(2.9,  0.95, 0.25), V(4.25,  0.35, 0.42), V(4.25,  0.15, 0.85), V(2.9,  0.95, 1.02)], '#64748b', '#1e293b', S * 0.06);
    vBox(-2.2, -0.8, 0.96, 1.04, 0.35, 0.92, '#c2410c', '#9a3412', '#ea580c', '#1e293b', S * 0.04);
    vBox( 0.6,  2.1, 0.96, 1.04, 0.35, 0.92, '#334155', '#1e293b', '#475569', '#0f172a', S * 0.04);
    disc(V(-0.1, 1.02, 0.64), S * 0.32, '#475569', '#cbd5e1', S * 0.06);
    disc(V(-0.1, 1.04, 0.64), S * 0.14, '#1e293b');
    vBox(0.8, 2.5, 0.95, 1.52, 0.55, 1.15, '#475569', '#334155', '#64748b', '#0f172a', S * 0.05);
    disc(V(2.52, 1.24, 0.86), S * 0.20, '#0ea5e9', '#1e293b', S * 0.04);
    vBox(-3.35, -3.05, -0.85, 0.85, 0.32, 0.98, '#1e293b', '#0f172a', '#334155', '#0f172a', S * 0.05);
    [-0.52, 0, 0.52].forEach(ty => {
      disc(V(-3.38, ty, 0.65), S * 0.22, '#38bdf8', '#e0f2fe', S * 0.04);
    });
    drawVesselRiders([-2.0, -1.0, 0, 1.0, 2.0], 1.05, '#334155');
    line(V(-1.4, -0.5, 1.05), V(-1.4, -0.5, 2.25), '#475569', S * 0.14);
    ell(V(-1.4, -0.5, 2.35), S * 0.36, S * 0.22, '#cbd5e1', '#1e293b', S * 0.05, -0.35);
  }
  else if (theme === 'jurassic_island') {
    // 18. JURASSIC ISLAND: Resort-Style Varnished Teak Wood Excursion Launch
    drawCurvedBoatHull('#854d27', '#fde047', '#451a03', 0.95, 0.85, 0.95, false);
    vBox(-2.5, 2.5, 0.94, 1.01, 0.55, 0.88, '#b45309', '#78350f', '#d97706', '#451a03', S * 0.04);
    [-1.6, 0, 1.6].forEach(rx => {
      disc(V(rx, 1.02, 0.65), S * 0.19, '#f8fafc', '#ea580c', S * 0.06);
    });
    drawVesselRiders([-2.0, -1.0, 0, 1.0, 2.0], 0.95, '#78350f');
    [-2.1, 0, 2.1].forEach(px => {
      [-0.78, 0.78].forEach(py => {
        line(V(px, py, 0.95), V(px, py, 2.45), '#facc15', S * 0.09);
      });
    });
    const cCols = ['#fef3c7', '#15803d', '#fef3c7', '#eab308', '#fef3c7', '#15803d', '#fef3c7'];
    for (let s = 0; s < 7; s++) {
      const xa = -2.35 + s * 0.67, xb = xa + 0.68;
      vBox(xa, xb, -0.88, 0.88, 2.42, 2.58, cCols[s], shade(cCols[s], -0.18), cCols[s], '#451a03', S * 0.03);
    }
    disc(V(3.25, 0, 1.55), S * 0.18, '#fef08a', '#78350f', S * 0.05);
    line(V(3.1, 0, 1.45), V(3.1, 0, 2.55), '#facc15', S * 0.08);
    poly([V(3.1, 0, 2.55), V(2.35, 0, 2.38), V(3.1, 0, 2.18)], '#15803d', '#facc15', S * 0.04);
  }
  else if (theme === 'china') {
    // 19. CHINA: Historic Ming Dynasty Treasure Junk
    drawCurvedBoatHull('#991b1b', '#facc15', '#450a0a', 1.45, 1.95, 1.05, true);
    vBox(-3.55, -2.35, -0.88, 0.88, 1.65, 2.45, '#7f1d1d', '#450a0a', '#b91c1c', '#facc15', S * 0.06);
    poly([V(-3.75, -0.95, 2.45), V(-2.2, -0.95, 2.45), V(-2.2, 0.95, 2.45), V(-3.75, 0.95, 2.45)], '#1e293b', '#facc15', S * 0.06);
    disc(V(2.85, 0.96, 1.35), S * 0.20, '#fef08a', '#0f172a', S * 0.05);
    disc(V(2.88, 0.97, 1.35), S * 0.08, '#0f172a');
    disc(V(-3.65, 0.72, 2.15), S * 0.19, '#ef4444', '#facc15', S * 0.05);
    disc(V(3.45, 0.55, 2.05), S * 0.17, '#ef4444', '#facc15', S * 0.05);
    line(V(0.1, 0, 0.9), V(0.1, 0, 4.45), '#451a03', S * 0.22);
    poly([
      V(-0.15, 0.76, 1.75), V(-0.15, -0.76, 1.75),
      V(0.55, -0.72, 2.75), V(-0.1, -0.64, 3.85),
      V(-0.1,  0.64, 3.85), V(0.55,  0.72, 2.75)
    ], '#dc2626', '#facc15', S * 0.07);
    [2.15, 2.65, 3.15, 3.55].forEach(bz => {
      line(V(0.22, -0.66, bz), V(0.22, 0.66, bz), '#fde047', S * 0.07);
    });
    poly([V(0.1, 0, 4.45), V(-0.85, 0, 4.25), V(0.1, 0, 3.95)], '#facc15', '#dc2626', S * 0.04);
  }
  else if (theme === 'japan') {
    // 20. JAPAN: Edo-Period Atakebune / Sengokubune Shogunate Warship
    drawCurvedBoatHull('#1e293b', '#dc2626', '#090d16', 1.55, 1.65, 1.02, true);
    for (let ax = -2.2; ax <= 2.2; ax += 0.55) {
      vBox(ax - 0.22, ax + 0.22, 0.92, 0.99, 0.65, 1.12, '#b91c1c', '#7f1d1d', '#facc15', '#0f172a', S * 0.03);
    }
    vBox(-3.45, -2.35, -0.85, 0.85, 1.55, 2.35, '#f8fafc', '#cbd5e1', '#1e293b', '#dc2626', S * 0.05);
    poly([V(-3.65, -0.95, 2.35), V(-2.2, -0.95, 2.35), V(-2.2, 0.95, 2.35), V(-3.65, 0.95, 2.35)], '#0f172a', '#facc15', S * 0.05);
    line(V(0.05, 0, 0.9), V(0.05, 0, 4.35), '#291509', S * 0.22);
    poly([V(-0.12, 0.74, 1.8), V(-0.12, -0.74, 1.8), V(0.52, -0.74, 2.75), V(-0.12, -0.74, 3.7), V(-0.12, 0.74, 3.7), V(0.52, 0.74, 2.75)], '#f8fafc', '#1e293b', S * 0.06);
    line(V(0.24, 0, 1.85), V(0.24, 0, 3.65), '#dc2626', S * 0.26);
    disc(V(0.26, 0, 2.75), S * 0.24, '#facc15', '#0f172a', S * 0.04);
    line(V(-3.45, 0.75, 2.35), V(-3.45, 0.75, 3.75), '#facc15', S * 0.08);
    poly([V(-3.45, 0.75, 3.7), V(-3.85, 0.75, 3.7), V(-3.85, 0.75, 2.75), V(-3.45, 0.75, 2.75)], '#dc2626', '#facc15', S * 0.04);
  }
  else if (theme === 'ancient_rome') {
    // 21. ANCIENT ROME: Imperial Quinquereme / Liburna War Galley
    drawCurvedBoatHull('#7c2d12', '#facc15', '#431407', 1.25, 1.65, 1.0, false);
    poly([V(3.2, 0.65, 0.15), V(4.45, 0, 0.28), V(3.2, -0.65, 0.15), V(3.35, 0, 0.75)], '#d97706', '#fef08a', S * 0.06);
    line(V(-3.35, 0, 2.35), V(-3.75, 0, 3.15), '#facc15', S * 0.24);
    disc(V(-3.75, 0, 3.15), S * 0.20, '#b91c1c', '#facc15', S * 0.05);
    for (let k = -2; k <= 2; k++) {
      const ox = k * 0.92;
      vBox(ox - 0.22, ox + 0.22, 0.94, 1.01, 0.72, 1.15, '#b91c1c', '#7f1d1d', '#facc15', '#facc15', S * 0.03);
      line(V(ox, 0.92, 0.45), V(ox - 0.45, 1.55, -0.35), '#a16207', S * 0.07);
    }
    line(V(0, 0, 0.9), V(0, 0, 4.25), '#5a3b22', S * 0.22);
    poly([V(-0.12, 0.74, 1.8), V(-0.12, -0.74, 1.8), V(0.55, -0.74, 2.75), V(-0.12, -0.74, 3.7), V(-0.12, 0.74, 3.7), V(0.55, 0.74, 2.75)], '#fef3c7', '#b91c1c', S * 0.07);
    line(V(0.24, -0.65, 2.75), V(0.24, 0.65, 2.75), '#b91c1c', S * 0.22);
    disc(V(0.26, 0, 2.75), S * 0.24, '#facc15', '#7f1d1d', S * 0.05);
  }
  else if (theme === 'ancient_greece') {
    // 22. ANCIENT GREECE: Classical Athenian Trireme
    drawCurvedBoatHull('#9a6b3e', '#0284c7', '#451a03', 1.35, 1.75, 0.95, false);
    poly([V(3.25, 0.58, 0.15), V(4.35, 0, 0.25), V(3.25, -0.58, 0.15), V(3.35, 0, 0.68)], '#b45309', '#fde047', S * 0.06);
    ell(V(2.75, 0.95, 1.18), S * 0.28, S * 0.16, '#ffffff', '#0f172a', S * 0.05);
    disc(V(2.75, 0.96, 1.18), S * 0.09, '#0284c7');
    line(V(-3.35, 0, 2.45), V(-3.65, 0, 3.25), '#0284c7', S * 0.22);
    line(V(-2.85, 0.95, 0.65), V(-3.45, 1.45, -0.35), '#78350f', S * 0.10);
    for (let k = -2; k <= 2; k++) {
      const ox = k * 0.88;
      line(V(ox, 0.92, 0.55), V(ox - 0.35, 1.55, -0.32), '#d97706', S * 0.06);
      line(V(ox + 0.3, 0.92, 0.35), V(ox - 0.05, 1.48, -0.42), '#92400e', S * 0.06);
    }
    line(V(0, 0, 0.85), V(0, 0, 4.25), '#6b4222', S * 0.20);
    poly([V(-0.12, 0.74, 1.8), V(-0.12, -0.74, 1.8), V(0.55, -0.74, 2.75), V(-0.12, -0.74, 3.7), V(-0.12, 0.74, 3.7), V(0.55, 0.74, 2.75)], '#f8fafc', '#0284c7', S * 0.07);
    line(V(0.23, -0.68, 2.05), V(0.23, 0.68, 2.05), '#0284c7', S * 0.14);
    line(V(0.23, -0.68, 3.45), V(0.23, 0.68, 3.45), '#0284c7', S * 0.14);
    disc(V(0.25, 0, 2.75), S * 0.22, '#0284c7', '#facc15', S * 0.05);
  }
  else if (theme === 'egypt') {
    // 23. EGYPT: Pharaonic Royal Solar Barque of Khufu / Ra
    const N = 18, keelPts = [], gunPts = [];
    for (let i = 0; i <= N; i++) {
      const s = -1 + 2 * i / N, lx = s * 3.55;
      const crescent = Math.pow(Math.abs(s), 2.35);
      keelPts.push(V(lx, 0.68, 0.06 + crescent * 1.35));
      gunPts.push(V(lx, 0.92, 0.95 + crescent * 1.95));
    }
    vBox(-2.4, 2.4, -0.78, 0.78, 0.25, 0.88, '#92400e', '#5a3b22', '#d97706');
    drawVesselRiders([-2.0, -1.0, 0, 1.0, 2.0], 0.92, '#1d4ed8');
    poly(gunPts.concat(keelPts.slice().reverse()), '#eab308', '#78350f', S * 0.07);
    ctx.strokeStyle = '#1d4ed8'; ctx.lineWidth = S * 0.14;
    ctx.beginPath(); gunPts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();

    const prowTip = V(3.65, 0, 3.15);
    disc(prowTip, S * 0.30, '#facc15', '#1d4ed8', S * 0.06);
    const sternTip = V(-3.35, 0, 3.15);
    disc(sternTip, S * 0.28, '#1d4ed8', '#facc15', S * 0.06);

    line(V(0, 0, 0.85), V(0, 0, 4.35), '#92400e', S * 0.20);
    poly([V(-0.12, 0.74, 1.8), V(-0.12, -0.74, 1.8), V(0.55, -0.74, 2.75), V(-0.12, -0.74, 3.7), V(-0.12, 0.74, 3.7), V(0.55, 0.74, 2.75)], '#fef3c7', '#d97706', S * 0.07);
    line(V(0.24, -0.58, 2.75), V(0.24, 0.58, 2.75), '#1d4ed8', S * 0.14);
    disc(V(0.26, 0, 2.75), S * 0.24, '#ef4444', '#facc15', S * 0.06);
  }
  else if (theme === 'babylon') {
    // 24. BABYLON: Euphrates Royal Processional Barge of Nebuchadnezzar
    drawCurvedBoatHull('#1d4ed8', '#facc15', '#172554', 1.55, 1.65, 1.02, false);
    [-2.0, -1.0, 0, 1.0, 2.0].forEach(rx => {
      disc(V(rx, 0.96, 0.68), S * 0.18, '#facc15', '#ffffff', S * 0.04);
      disc(V(rx, 0.97, 0.68), S * 0.07, '#1d4ed8');
    });
    const bProw = V(3.45, 0, 2.65), bHead = V(3.85, 0, 3.35);
    line(bProw, bHead, '#facc15', S * 0.26);
    poly([bHead, [bHead[0] + S * 0.48, bHead[1] - S * 0.22], [bHead[0] + S * 0.32, bHead[1] + S * 0.14]], '#facc15', '#172554', S * 0.05);
    vBox(-3.55, -2.75, -0.65, 0.65, 1.95, 2.65, '#1e3a8a', '#172554', '#facc15', '#facc15', S * 0.05);

    line(V(0, 0, 0.9), V(0, 0, 4.3), '#78350f', S * 0.22);
    poly([V(-0.12, 0.74, 1.8), V(-0.12, -0.74, 1.8), V(0.55, -0.74, 2.75), V(-0.12, -0.74, 3.7), V(-0.12, 0.74, 3.7), V(0.55, 0.74, 2.75)], '#1e3a8a', '#facc15', S * 0.07);
    disc(V(0.25, 0, 2.75), S * 0.28, '#facc15', '#ffffff', S * 0.05);
    disc(V(0.26, 0, 2.75), S * 0.12, '#dc2626');
  }

  /* -------------------- ORIGINAL 16 SKINS -------------------- */
  else if (theme === 'caribbean') {
    drawCurvedBoatHull('#6b4222', '#f59e0b', '#3e2716', 1.35, 1.65, 1.05, true);
    line(V(3.3, 0, 2.1), V(4.6, 0, 2.85), '#78350f', S * 0.16);
    disc(V(3.55, 0, 1.85), S * 0.24, '#facc15', '#78350f', S * 0.05);
    vBox(-3.55, -2.55, -0.85, 0.85, 1.55, 2.35, '#451a03', '#291509', '#78350f', '#f59e0b', S * 0.06);
    disc(V(-3.62, 0.65, 2.45), S * 0.18, '#fef08a', '#b45309', S * 0.05);
    line(V(0, 0, 0.9), V(0, 0, 4.35), '#5a3a22', S * 0.22);
    poly([V(-0.15, 0.72, 1.85), V(-0.15, -0.72, 1.85), V(0.55, -0.72, 2.75), V(-0.15, -0.72, 3.65), V(-0.15, 0.72, 3.65), V(0.55, 0.72, 2.75)], '#0f172a', '#f8fafc', S * 0.06);
    disc(V(0.25, 0.25, 2.78), S * 0.22, '#f8fafc');
    poly([V(0, 0, 4.35), V(-0.95, 0, 4.15), V(0, 0, 3.85)], '#0f172a', '#ef4444', S * 0.04);
  }
  else if (theme === 'medieval') {
    drawCurvedBoatHull('#8a5a33', '#eab308', '#5a3b22', 1.45, 1.55, 1.15, true);
    vBox(-3.45, -2.35, -0.88, 0.88, 1.65, 2.45, '#78350f', '#451a03', '#a16207', '#eab308', S * 0.06);
    [-1.6, -0.5, 0.6, 1.7].forEach((sx, i) => {
      disc(V(sx, 0.96, 1.15), S * 0.20, i % 2 ? '#b91c1c' : '#1d4ed8', '#facc15', S * 0.05);
    });
    line(V(0.1, 0, 0.9), V(0.1, 0, 4.25), '#5a3b22', S * 0.24);
    poly([V(-0.1, 0.75, 1.85), V(-0.1, -0.75, 1.85), V(0.55, -0.75, 2.75), V(-0.1, -0.75, 3.65), V(-0.1, 0.75, 3.65), V(0.55, 0.75, 2.75)], '#fffbeb', '#b91c1c', S * 0.07);
    line(V(0.25, 0.45, 2.75), V(0.25, -0.45, 2.75), '#b91c1c', S * 0.16);
    line(V(0.25, 0, 2.15), V(0.25, 0, 3.35), '#b91c1c', S * 0.16);
  }
  else if (theme === 'nordic') {
    drawCurvedBoatHull('#5a361a', '#f59e0b', '#290f02', 1.65, 1.55, 0.85, false);
    const pBow = V(3.35, 0, 2.35), pDrag = V(3.75, 0, 3.35);
    line(pBow, pDrag, '#f59e0b', S * 0.26);
    poly([pDrag, [pDrag[0] + S * 0.55, pDrag[1] - S * 0.18], [pDrag[0] + S * 0.35, pDrag[1] + S * 0.15]], '#f59e0b', '#78350f', S * 0.05);
    line(V(-3.35, 0, 2.25), V(-3.65, 0, 3.05), '#f59e0b', S * 0.22);
    for (let k = -3; k <= 3; k++) {
      disc(V(k * 0.82, 0.96, 0.92), S * 0.22, k % 2 ? '#991b1b' : '#0284c7', '#facc15', S * 0.05);
    }
    line(V(0, 0, 0.8), V(0, 0, 4.15), '#451a03', S * 0.20);
    poly([V(-0.1, 0.72, 1.75), V(-0.1, -0.72, 1.75), V(0.55, -0.72, 2.65), V(-0.1, -0.72, 3.55), V(-0.1, 0.72, 3.55), V(0.55, 0.72, 2.65)], '#b91c1c', '#facc15', S * 0.07);
    line(V(0.22, 0.5, 2.15), V(0.22, -0.5, 2.15), '#fef08a', S * 0.14);
    line(V(0.22, 0.5, 3.15), V(0.22, -0.5, 3.15), '#fef08a', S * 0.14);
  }
  else if (theme === 'western') {
    vBox(-3.2, 3.4, -0.95, 0.95, 0.15, 0.95, '#f8fafc', '#cbd5e1', '#d97706', '#451a03', S * 0.06);
    poly([V(3.4, -0.95, 0.15), V(4.15, 0, 0.45), V(3.4, 0.95, 0.15), V(3.4, 0, 0.95)], '#f8fafc', '#451a03', S * 0.06);
    drawVesselRiders([-2.2, -1.1, 0, 1.1, 2.2], 0.95, '#78350f');
    vBox(-2.1, 1.9, -0.75, 0.75, 1.65, 2.45, '#fef3c7', '#fde68a', '#b91c1c', '#78350f', S * 0.06);
    vBox(-0.6, 0.8, -0.52, 0.52, 2.45, 3.15, '#ffffff', '#e2e8f0', '#b91c1c', '#451a03', S * 0.05);
    [-0.45, 0.45].forEach(sy => {
      line(V(2.35, sy, 0.95), V(2.35, sy, 3.85), '#18181b', S * 0.24);
      disc(V(2.35, sy, 3.85), S * 0.16, '#facc15');
    });
    const pwC = V(-3.55, 0.85, 0.65);
    disc(pwC, S * 0.58, '#991b1b', '#facc15', S * 0.08);
    for (let b = 0; b < 8; b++) {
      const ba = clockT * 4 + b * TAU / 8;
      line(pwC, [pwC[0] + Math.cos(ba) * S * 0.54, pwC[1] + Math.sin(ba) * S * 0.54], '#fef08a', S * 0.07);
    }
  }
  else if (theme === 'frontier') {
    const N = 16, keelPts = [], gunPts = [];
    for (let i = 0; i <= N; i++) {
      const s = -1 + 2 * i / N, lx = s * 3.55;
      const curl = Math.pow(Math.abs(s), 2.8);
      keelPts.push(V(lx, 0.65, 0.08 + curl * 0.85));
      gunPts.push(V(lx, 0.88, 0.88 + curl * 1.45));
    }
    vBox(-2.4, 2.4, -0.75, 0.75, 0.22, 0.75, '#8a5a33', '#5a3b22', '#b58858');
    drawVesselRiders([-2.0, -1.0, 0, 1.0, 2.0], 0.78, '#5a3b22');
    poly(gunPts.concat(keelPts.slice().reverse()), '#e8d8b5', '#5a3b22', S * 0.07);
    ctx.strokeStyle = '#5a3b22'; ctx.lineWidth = S * 0.13;
    ctx.beginPath(); gunPts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
    [-1.8, 0, 1.8].forEach((mx, idx) => {
      disc(V(mx, 0.90, 0.55), S * 0.18, idx === 1 ? '#b91c1c' : '#0d9488', '#451a03', S * 0.04);
    });
    [-1.2, 1.2].forEach(px => {
      line(V(px - 0.5, 0.92, 0.85), V(px + 0.5, 0.92, 0.35), '#78350f', S * 0.09);
    });
  }
  else if (theme === 'americana') {
    vBox(-3.3, 3.3, -1.0, 1.0, 0.15, 0.95, '#b91c1c', '#7f1d1d', '#fbf6e8', '#1d3557', S * 0.06);
    [-1, 1].forEach(dir => {
      poly([V(dir * 3.3, -1.0, 0.15), V(dir * 3.95, 0, 0.35), V(dir * 3.3, 1.0, 0.15), V(dir * 3.3, 0, 0.95)], '#b91c1c', '#fbbf24', S * 0.06);
    });
    drawVesselRiders([-2.1, -1.05, 0, 1.05, 2.1], 0.95, '#1d3557');
    vBox(-2.2, 2.2, -0.82, 0.82, 1.65, 2.35, '#fbf6e8', '#dfd3b8', '#1d3557', '#b91c1c', S * 0.06);
    vBox(-0.65, 0.65, -0.55, 0.55, 2.35, 3.05, '#ffffff', '#e2e8f0', '#b91c1c', '#1d3557', S * 0.05);
    line(V(-1.1, 0, 2.35), V(-1.1, 0, 3.55), '#1d3557', S * 0.26);
    line(V(-1.1, 0, 3.25), V(-1.1, 0, 3.45), '#fbbf24', S * 0.28);
    [-1.8, 0, 1.8].forEach(rx => disc(V(rx, 1.02, 0.62), S * 0.16, '#ffffff', '#ef4444', S * 0.05));
  }
  else if (theme === 'alps') {
    vBox(-2.6, 2.6, -0.78, 0.78, 0.25, 0.85, '#0284c7', '#0369a1', '#38bdf8');
    drawVesselRiders([-2.0, -1.0, 0, 1.0, 2.0], 0.85, '#1e3a8a');
    const N = 16;
    for (let i = 0; i <= N; i++) {
      const s = -1 + 2 * i / N, lx = s * 3.45;
      const lift = Math.pow(Math.abs(s), 2.3) * 1.15;
      const pTube = V(lx, 0.88, 0.62 + lift);
      const colT = (i % 2 === 0) ? '#dc2626' : '#f8fafc';
      disc(pTube, S * 0.44, colT, '#0284c7', S * 0.06);
      if (i % 3 === 1) {
        line([pTube[0] - S * 0.18, pTube[1] - S * 0.15], [pTube[0] + S * 0.18, pTube[1] - S * 0.15], '#0f172a', S * 0.08);
      }
    }
    line(V(0, 0, 0.8), V(0, 0, 3.45), '#f8fafc', S * 0.16);
    poly([V(0, 0, 3.45), V(0.85, 0, 3.2), V(0, 0, 2.85)], '#dc2626', '#ffffff', S * 0.05);
  }
  else if (theme === 'fiesta') {
    const pCols = ['#e11d48', '#f59e0b', '#10b981', '#3b82f6', '#a855f7', '#ec4899'];
    vBox(-2.8, 2.8, -0.85, 0.85, 0.25, 0.95, '#0d9488', '#115e59', '#fde047');
    drawVesselRiders([-2.0, -1.0, 0, 1.0, 2.0], 0.95, '#e11d48');
    for (let b = 0; b < 6; b++) {
      const xa = -3.2 + b * 1.06, xb = xa + 1.08;
      vBox(xa, xb, -0.95, 0.95, 0.18, 1.15, pCols[b], shade(pCols[b], -0.22), pCols[(b + 1) % 6], '#ffffff', S * 0.04);
    }
    const spikes = [
      [V(3.2, 0.85, 0.8),  V(4.35, 1.15, 1.35), '#facc15'],
      [V(-3.2, 0.85, 0.8), V(-4.35, 1.15, 1.35),'#ec4899'],
      [V(0, 0.95, 0.7),    V(0, 1.85, 0.55),    '#10b981'],
      [V(-1.6, 0.95, 0.7), V(-1.8, 1.75, 0.65), '#3b82f6'],
      [V(1.6, 0.95, 0.7),  V(1.8, 1.75, 0.65),  '#f97316']
    ];
    spikes.forEach(([pB, pTip, col]) => {
      poly([[pB[0] - S * 0.24, pB[1]], pTip, [pB[0] + S * 0.24, pB[1]]], col, '#ffffff', S * 0.05);
      line(pTip, [pTip[0], pTip[1] + S * 0.55], col, S * 0.06);
    });
  }
  else if (theme === 'gothic') {
    ctx.save();
    ell(V(0, 0.4, 1.2), S * 4.2, S * 1.8, 'rgba(16, 185, 129, 0.16)');
    drawCurvedBoatHull('#1e293b', '#34d399', '#090d16', 1.45, 1.65, 1.05, true);
    for (let rx = -2.2; rx <= 2.2; rx += 0.72) {
      line(V(rx, 0.96, 0.25), V(rx, 0.96, 1.18), '#6ee7b7', S * 0.08);
    }
    line(V(0, 0, 0.9), V(0, 0, 4.35), '#334155', S * 0.20);
    poly([
      V(-0.15, 0.72, 1.85), V(-0.15, 0.2, 2.25), V(-0.15, -0.72, 1.85),
      V(0.55, -0.72, 2.75), V(-0.15, -0.72, 3.65), V(-0.15, 0.72, 3.65), V(0.55, 0.72, 2.75)
    ], 'rgba(110, 231, 183, 0.52)', '#a7f3d0', S * 0.06);
    disc(V(-3.55, 0.65, 2.45), S * 0.20, '#34d399');
    ctx.restore();
  }
  else if (theme === 'space') {
    vBox(-2.9, 2.8, -0.88, 0.88, 0.25, 1.05, '#e2e8f0', '#94a3b8', '#0284c7', '#0f172a', S * 0.06);
    poly([V(2.8, -0.88, 0.25), V(4.25, 0, 0.55), V(2.8, 0.88, 0.25), V(2.8, 0, 1.05)], '#0284c7', '#22d3ee', S * 0.07);
    poly([V(-2.4, 0.88, 0.55), V(0.6, 0.88, 0.55), V(-1.8, 1.85, 0.45)], '#cbd5e1', '#22d3ee', S * 0.06);
    disc(V(-3.05, 0.42, 0.65), S * 0.26, '#22d3ee', '#ffffff', S * 0.05);
    disc(V(-3.05, -0.42, 0.65), S * 0.26, '#22d3ee', '#ffffff', S * 0.05);
    drawVesselRiders([-2.0, -1.0, 0, 1.0, 2.0], 1.05, '#0f172a');
    line(V(-1.5, 0, 1.05), V(0, 0, 2.85), '#22d3ee', S * 0.14);
    line(V(1.5, 0, 1.05), V(0, 0, 2.85), '#22d3ee', S * 0.14);
  }
  else if (theme === 'retro_future') {
    vBox(-2.8, 2.7, -0.86, 0.86, 0.25, 1.02, '#f8fafc', '#cbd5e1', '#f97316', '#0284c7', S * 0.06);
    poly([V(2.7, -0.86, 0.25), V(4.15, 0, 0.58), V(2.7, 0.86, 0.25), V(2.7, 0, 1.02)], '#f97316', '#ffffff', S * 0.07);
    poly([V(-2.9, 0, 1.0), V(-3.55, 0, 2.25), V(-1.4, 0, 1.02)], '#06b6d4', '#ffffff', S * 0.06);
    poly([V(-2.8, 0.86, 0.6), V(-3.45, 1.55, 0.85), V(-1.5, 0.86, 0.6)], '#f97316', '#ffffff', S * 0.06);
    drawVesselRiders([-2.0, -1.0, 0, 1.0, 2.0], 1.02, '#0284c7');
    line(V(0, 0, 1.0), V(0, 0, 3.25), '#cbd5e1', S * 0.14);
    disc(V(0, 0, 3.25), S * 0.24, '#f97316', '#ffffff', S * 0.05);
  }
  else if (theme === 'jungle' || theme === 'tiki') {
    const logCol = theme === 'jungle' ? '#a16207' : '#78350f';
    const logAlt = theme === 'jungle' ? '#ca8a04' : '#5a3b22';
    [-0.78, -0.39, 0, 0.39, 0.78].forEach((ly, idx) => {
      vBox(-3.35, 3.35, ly - 0.18, ly + 0.18, 0.22, 0.62, idx % 2 ? logCol : logAlt, shade(logCol, -0.25), shade(logCol, 0.18), '#3e2716', S * 0.05);
    });
    [-2.4, 0, 2.4].forEach(bx => {
      vBox(bx - 0.16, bx + 0.16, -0.96, 0.96, 0.58, 0.78, '#d9a74a', '#92400e', '#fef08a');
    });
    drawVesselRiders([-2.0, -1.0, 0, 1.0, 2.0], 0.78, '#451a03');
    if (theme === 'tiki') {
      vBox(2.55, 3.15, -0.45, 0.45, 0.75, 1.85, '#5a3b22', '#3e2716', '#d97706', '#facc15', S * 0.05);
      disc(V(3.18, 0.18, 1.45), S * 0.12, '#facc15');
    } else {
      vBox(2.55, 3.15, -0.5, 0.5, 0.75, 1.45, '#b45309', '#78350f', '#fde68a');
    }
    line(V(-0.2, 0, 0.75), V(-0.2, 0, 3.85), '#8a5a33', S * 0.18);
    poly([V(-0.3, 0.68, 1.65), V(-0.3, -0.68, 1.65), V(0.35, -0.68, 2.5), V(-0.3, -0.68, 3.35), V(-0.3, 0.68, 3.35), V(0.35, 0.68, 2.5)], theme === 'tiki' ? '#e0c075' : '#15803d', '#451a03', S * 0.06);
  }
  else {
    // 14, 15, 16. STANDARD, CLASSIC MIDWAY & BAVARIAN
    const hullC = theme === 'classic' ? '#e11d48' : theme === 'bavarian' ? '#2563eb' : '#92400e';
    const trimC = theme === 'classic' ? '#fef08a' : theme === 'bavarian' ? '#ffffff' : accent;
    drawCurvedBoatHull(hullC, trimC, shade(hullC, -0.35), 1.35, 1.35, 1.05, false);
    if (theme === 'bavarian') {
      vBox(2.45, 3.05, -0.45, 0.45, 1.05, 1.65, '#92400e', '#5a3b22', '#facc15');
    }
    line(V(0, 0, 0.9), V(0, 0, 4.15), '#f8fafc', S * 0.18);
    poly([V(-0.1, 0.72, 1.75), V(-0.1, -0.72, 1.75), V(0.55, -0.72, 2.65), V(-0.1, -0.72, 3.55), V(-0.1, 0.72, 3.55), V(0.55, 0.72, 2.65)], trimC, hullC, S * 0.06);
  }

  // =========================================================================
  // PASS 4: FRONT SUSPENSION STRUTS
  // =========================================================================
  [-2.2, 2.2].forEach(lx => {
    line(pAxNear, V(lx, 0.78, 0.85), '#1e293b', S * 0.24);
    line(pAxNear, V(lx, 0.78, 0.85), armCol, S * 0.14);
    disc(V(lx, 0.82, 0.85), S * 0.18, '#facc15', '#1e293b', S * 0.04);
  });

  // =========================================================================
  // PASS 5: DRAW FRONT A-FRAME PYLON (+ay) OVER THE VESSEL
  // =========================================================================
  drawAFrame(ay, true);

  ctx.restore();
}


NEW_SPRITE_PACKS.rides.pirate_ship = { skins: PIRATE_SHIP_SKINS, draw: drawPirateShip };
})();

(function () {


/* ===== core (shared by every pack) ===== */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shade(hex, amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=c=>Math.round(amt<0?c*(1+amt):c+(255-c)*amt);return `rgb(${f(r)},${f(g)},${f(b)})`;}
const TH={
  ln(ctx,a,b,c,w){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();},
  ell(ctx,x,y,rx,ry,c,rot){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot||0,0,7);ctx.fill();},
  poly(ctx,pts,fill,stroke,lw){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||1;ctx.stroke();}},
  iso(x,y,u,X,Y,Z){return[x+(X-Y)*0.7*u,y+(X+Y)*0.35*u-Z*u];},
  box(ctx,x,y,u,x0,x1,y0,y1,z0,z1,cf,ce,ct){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);
    TH.poly(ctx,[I(x0,y1,z0),I(x1,y1,z0),I(x1,y1,z1),I(x0,y1,z1)],cf);TH.poly(ctx,[I(x1,y0,z0),I(x1,y1,z0),I(x1,y1,z1),I(x1,y0,z1)],ce);
    TH.poly(ctx,[I(x0,y0,z1),I(x1,y0,z1),I(x1,y1,z1),I(x0,y1,z1)],ct);},
  blob(ctx,x,y,rx,ry,col,rnd,n){const pts=[];n=n||8;for(let k=0;k<n;k++){const a=k/n*6.283,rr=0.78+rnd()*0.3;pts.push([x+Math.cos(a)*rx*rr,y+Math.sin(a)*ry*rr]);}
    TH.poly(ctx,pts,col);ctx.fillStyle='rgba(255,255,255,.14)';ctx.beginPath();ctx.ellipse(x-rx*0.25,y-ry*0.3,rx*0.45,ry*0.35,0,0,7);ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x+rx*0.35,y+ry*0.25,rx*0.4,ry*0.5,0,0,7);ctx.fill();},
  /* pointed (lancet) arch outline in the X-Z plane at depth Y, centred on xc, half-width w */
  arch(x,y,u,Y,xc,w,z0,zs,zt){const I=(X,Z)=>TH.iso(x,y,u,X,Y,Z),L=[],Rr=[];for(let t=0;t<=8;t++){const s=t/8,q=1-s,
      X=q*q*(xc-w)+2*q*s*(xc-w*0.85)+s*s*xc,Z=q*q*zs+2*q*s*(zs+(zt-zs)*0.85)+s*s*zt;L.push(I(X,Z));Rr.push(I(2*xc-X,Z));}
    return [I(xc-w,z0)].concat(L,Rr.slice().reverse(),[I(xc+w,z0)]);}
};


const JS=(c,x,y,rx)=>{c.fillStyle='rgba(12,40,22,.28)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const JBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.28),shade(col,0.16));
const MIR=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
const BP=(c,pts,fill,stroke,lw)=>TH.poly(c,pts,fill,stroke,lw);
const BF=(c,I,x0,x1,y1,z0,z1,col)=>BP(c,[I(x0,y1,z0),I(x1,y1,z0),I(x1,y1,z1),I(x0,y1,z1)],col);
const BR=(c,I,x1,y0,y1,z0,z1,col)=>BP(c,[I(x1,y0,z0),I(x1,y1,z0),I(x1,y1,z1),I(x1,y0,z1)],col);
const BT=(c,I,x0,x1,y0,y1,z,col)=>BP(c,[I(x0,y0,z),I(x1,y0,z),I(x1,y1,z),I(x0,y1,z)],col);
const WF=(c,I,y1,X,Z,w,h,col,fr)=>BP(c,[I(X-w/2,y1,Z-h/2),I(X+w/2,y1,Z-h/2),I(X+w/2,y1,Z+h/2),I(X-w/2,y1,Z+h/2)],col,fr,fr?0.9:0);
const WR=(c,I,x1,Y,Z,w,h,col,fr)=>BP(c,[I(x1,Y-w/2,Z-h/2),I(x1,Y+w/2,Z-h/2),I(x1,Y+w/2,Z+h/2),I(x1,Y-w/2,Z+h/2)],col,fr,fr?0.9:0);
const BFL=(c,I,x0,x1,y1,z0,z1,step,col,u)=>{for(let z=z0+step;z<z1-0.01;z+=step)TH.ln(c,I(x0,y1,z),I(x1,y1,z),col,u*0.05);};
const BRL=(c,I,x1,y0,y1,z0,z1,step,col,u)=>{for(let z=z0+step;z<z1-0.01;z+=step)TH.ln(c,I(x1,y0,z),I(x1,y1,z),col,u*0.05);};
function HIP(c,I,x0,x1,y0,y1,z,H,o,cf,cr,u,tex){const yc=(y0+y1)/2,xr0=x0+(y1-y0)/2,xr1=x1-(y1-y0)/2,A=I(x0-o,y1+o,z),B=I(x1+o,y1+o,z),R1=I(xr1,yc,z+H),R0=I(xr0,yc,z+H),C=I(x1+o,y0-o,z);
  BP(c,[B,C,R1],cr);BP(c,[A,B,R1,R0],cf);
  if(tex){for(let k=1;k<=tex;k++){const t=k/(tex+1),L=[A[0]+(R0[0]-A[0])*t,A[1]+(R0[1]-A[1])*t],Rr=[B[0]+(R1[0]-B[0])*t,B[1]+(R1[1]-B[1])*t];TH.ln(c,L,Rr,'rgba(0,0,0,.16)',u*0.07);TH.ln(c,[L[0],L[1]-u*0.07],[Rr[0],Rr[1]-u*0.07],'rgba(255,255,255,.14)',u*0.05);}}
  TH.ln(c,R0,R1,shade(cf,-0.3),u*0.16);}
function GAB(c,I,x0,x1,y0,y1,z,H,o,cf,cg,u,tex){const yc=(y0+y1)/2,A=I(x0-o,y1+o,z),B=I(x1+o,y1+o,z),R1=I(x1+o,yc,z+H),R0=I(x0-o,yc,z+H);
  BP(c,[I(x1,y0,z),I(x1,y1,z),I(x1,yc,z+H*0.86)],cg);BP(c,[A,B,R1,R0],cf);
  if(tex){for(let k=1;k<=tex;k++){const t=k/(tex+1),L=[A[0]+(R0[0]-A[0])*t,A[1]+(R0[1]-A[1])*t],Rr=[B[0]+(R1[0]-B[0])*t,B[1]+(R1[1]-B[1])*t];TH.ln(c,L,Rr,'rgba(0,0,0,.16)',u*0.07);TH.ln(c,[L[0],L[1]-u*0.07],[Rr[0],Rr[1]-u*0.07],'rgba(255,255,255,.14)',u*0.05);}}
  TH.ln(c,R0,R1,shade(cf,-0.3),u*0.16);TH.ln(c,A,B,shade(cf,-0.25),u*0.1);}
const GLOW=(c,x,y,r,rgb,a)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();};
function RCYL(c,x,y,rx,ry,wh,cols){cols=cols||['#ffffff','#e9eef3','#a9b6c6'];const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,cols[0]);g.addColorStop(0.5,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y-wh);c.lineTo(x-rx,y);c.ellipse(x,y,rx,ry,0,Math.PI,0,true);c.lineTo(x+rx,y-wh);c.ellipse(x,y-wh,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();}
function RGLASS(c,pts,alpha){const ys=pts.map(p=>p[1]),g=c.createLinearGradient(0,Math.min(...ys),0,Math.max(...ys));g.addColorStop(0,RW.glass[0]);g.addColorStop(0.5,RW.glass[1]);g.addColorStop(1,RW.glass[2]);c.save();c.globalAlpha=alpha||1;c.fillStyle=g;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();c.restore();}
function RSPHERE(c,x,y,r,cols){const g=c.createRadialGradient(x-r*0.35,y-r*0.4,r*0.1,x,y,r*1.05);g.addColorStop(0,cols[0]);g.addColorStop(0.55,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();}
function ACONE(c,x,y,rx,ry,h,col,u,scal){const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,shade(col,0.18));g.addColorStop(0.5,col);g.addColorStop(1,shade(col,-0.3));c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y);c.lineTo(x,y-h);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();
  if(scal){for(let k=0;k<scal;k++){const a0=Math.PI*k/scal,a1=Math.PI*(k+1)/scal;c.fillStyle=k%2?'#fbf6e8':shade(col,-0.1);c.beginPath();c.moveTo(x+Math.cos(a0)*rx,y+Math.sin(a0)*ry);c.lineTo(x+Math.cos((a0+a1)/2)*rx,y+Math.sin((a0+a1)/2)*ry+u*0.4);c.lineTo(x+Math.cos(a1)*rx,y+Math.sin(a1)*ry);c.closePath();c.fill();}}
  c.save();c.beginPath();c.moveTo(x-rx,y);c.lineTo(x,y-h);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.clip();for(let k=0;k<=14;k++){const a=Math.PI*k/14;TH.ln(c,[x,y-h],[x+Math.cos(a)*rx,y+Math.sin(a)*ry],'rgba(0,0,0,.12)',u*0.05);}c.restore();}
function AWN(c,I,X0,X1,y1,zTop,zBot,dY,col,u){const n=Math.max(4,Math.round((X1-X0)/0.5));for(let k=0;k<n;k++){const a=X0+(X1-X0)*k/n,b=X0+(X1-X0)*(k+1)/n,cc=k%2?col[1]:col[0];BP(c,[I(a,y1,zTop),I(b,y1,zTop),I(b,y1+dY,zBot),I(a,y1+dY,zBot)],cc);const p=I(a,y1+dY,zBot),q=I(b,y1+dY,zBot);BP(c,[p,q,[(p[0]+q[0])/2,(p[1]+q[1])/2+u*0.42]],cc);}}
const RW={w:'#f4f6f8',ws:'#b9c4d1',wl:'#ffffff',teal:'#2fb8c4',tealD:'#1f8a96',org:'#ff7a3c',yel:'#ffd23c',navy:'#2a3a52',leaf:['#8fd05a','#6ab83c','#4a9a30'],glass:['#cdeef8','#8ccfe4','#4f9fc0']};
const RSH_=(c,x,y,rx,ry,rgb)=>{c.fillStyle='rgba('+(rgb||'40,30,18')+',.24)';c.beginPath();c.ellipse(x+rx*0.1,y+ry*0.2,rx*0.88,(ry||rx*0.4)*0.9,0,0,7);c.fill();};
const RPOST=(c,I,X,Y,z0,z1,col,u,w)=>TH.ln(c,I(X,Y,z0),I(X,Y,z1),col,u*(w||0.22));
const RCLIP=(c,pts,fn)=>{c.save();c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.clip();fn();c.restore();};
const RBARREL=(c,x,y,u,col)=>{TH.ell(c,x,y,u*0.55,u*0.22,'rgba(0,0,0,.2)');const g=c.createLinearGradient(x-u*0.5,0,x+u*0.5,0);g.addColorStop(0,shade(col||'#9a6a3a',0.2));g.addColorStop(0.6,col||'#9a6a3a');g.addColorStop(1,shade(col||'#9a6a3a',-0.35));c.fillStyle=g;c.beginPath();c.moveTo(x-u*0.42,y);c.quadraticCurveTo(x-u*0.62,y-u*0.55,x-u*0.42,y-u*1.1);c.lineTo(x+u*0.42,y-u*1.1);c.quadraticCurveTo(x+u*0.62,y-u*0.55,x+u*0.42,y);c.closePath();c.fill();TH.ell(c,x,y-u*1.1,u*0.42,u*0.17,shade(col||'#9a6a3a',0.22));TH.ln(c,[x-u*0.55,y-u*0.35],[x+u*0.55,y-u*0.35],'#3a2a1a',u*0.09);TH.ln(c,[x-u*0.55,y-u*0.75],[x+u*0.55,y-u*0.75],'#3a2a1a',u*0.09);};
const RLANTERN=(c,x,y,u,rgb)=>{GLOW(c,x,y,u*1.3,rgb||'255,200,90',0.5);TH.ln(c,[x,y-u*0.5],[x,y-u*0.15],'#2a2018',u*0.08);TH.poly(c,[[x-u*0.18,y-u*0.15],[x+u*0.18,y-u*0.15],[x+u*0.14,y+u*0.32],[x-u*0.14,y+u*0.32]],'#ffd36a');TH.ell(c,x,y-u*0.15,u*0.2,u*0.08,'#2a2018');};
const RWINDOW=(c,I,y1,X,Z,w,h,glow,frame)=>{BP(c,[I(X-w/2-0.08,y1,Z-h/2-0.08),I(X+w/2+0.08,y1,Z-h/2-0.08),I(X+w/2+0.08,y1,Z+h/2+0.08),I(X-w/2-0.08,y1,Z+h/2+0.08)],frame||'#f4ead2');BP(c,[I(X-w/2,y1,Z-h/2),I(X+w/2,y1,Z-h/2),I(X+w/2,y1,Z+h/2),I(X-w/2,y1,Z+h/2)],glow||'#ffd27a');};
const SHDW_=(c,x,y,rx)=>{c.fillStyle='rgba(30,20,10,.22)';c.beginPath();c.ellipse(x+rx*0.2,y+rx*0.08,rx,rx*0.34,0,0,7);c.fill();};
const RTORCH=(c,x,y,u,h)=>{TH.ln(c,[x,y],[x,y-h],'#6a4a28',u*0.2);TH.ln(c,[x,y-h*0.7],[x,y-h*0.5],'#c8a050',u*0.2);GLOW(c,x,y-h-u*0.5,u*1.5,'255,160,50',0.5);c.fillStyle='#ff8a2a';c.beginPath();c.moveTo(x-u*0.3,y-h);c.quadraticCurveTo(x-u*0.4,y-h-u*0.9,x,y-h-u*1.5);c.quadraticCurveTo(x+u*0.4,y-h-u*0.8,x+u*0.3,y-h);c.closePath();c.fill();c.fillStyle='#ffd45a';c.beginPath();c.moveTo(x-u*0.14,y-h);c.quadraticCurveTo(x-u*0.14,y-h-u*0.6,x,y-h-u*0.95);c.quadraticCurveTo(x+u*0.14,y-h-u*0.5,x+u*0.14,y-h);c.closePath();c.fill();};
const RTHATCH=(c,pts,u,base,dark,n)=>{BP(c,pts,base);RCLIP(c,pts,()=>{const A=pts[0],B=pts[1],C2=pts[2],D=pts[3];for(let k=1;k<n;k++){const t=k/n,L=[A[0]+(D[0]-A[0])*t,A[1]+(D[1]-A[1])*t],Rr=[B[0]+(C2[0]-B[0])*t,B[1]+(C2[1]-B[1])*t];TH.ln(c,L,Rr,k%2?dark:'rgba(255,240,190,.25)',u*0.1);const m=(Rr[0]-L[0])/Math.round((Rr[0]-L[0])/(u*0.5)||1);for(let q=0;q<Math.round((Rr[0]-L[0])/(u*0.5));q++){const px=L[0]+q*m+(k%2)*m*0.5,py=L[1]+(Rr[1]-L[1])*(q*m/((Rr[0]-L[0])||1));TH.ln(c,[px,py],[px+m*0.12,py+u*0.45],dark,u*0.05);}}});};
const SOFT_=(c,x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
const RSTRIPE=(c,A,B,Cc,D,n,c1,c2)=>{BP(c,[A,B,Cc,D],c1);for(let k=0;k<n;k+=2){const t0=k/n,t1=(k+1)/n,P=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];BP(c,[P(A,B,t0),P(A,B,t1),P(D,Cc,t1),P(D,Cc,t0)],c2);}};
const RBULBS=(c,pts,u,col)=>pts.forEach(p=>{GLOW(c,p[0],p[1],u*0.6,'255,220,120',0.55);TH.ell(c,p[0],p[1],u*0.13,u*0.13,col||'#fff3c0');});
const RTABLE=(c,x,y,u,col)=>{TH.ell(c,x,y+u*0.1,u*0.9,u*0.3,'rgba(0,0,0,.18)');TH.ln(c,[x,y],[x,y-u*0.9],'#6a4a2a',u*0.14);TH.ell(c,x,y-u*0.9,u*0.75,u*0.28,col||'#f4efe0');TH.ell(c,x-u*0.2,y-u*1.0,u*0.18,u*0.07,'#d9433b');};
function EGCYL_(c,x,y,rx,ry,h,cols){const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,cols[0]);g.addColorStop(0.55,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y);c.lineTo(x-rx,y-h);c.ellipse(x,y-h,rx,ry,0,Math.PI,0,false);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();c.fillStyle=cols[0];c.beginPath();c.ellipse(x,y-h,rx,ry,0,0,7);c.fill();}
const RRPLANE=(c,x,y,u,plane)=>{c.translate(x,y);if(plane==='R')c.transform(-0.7*u,0.35*u,0,-u,0,0);else c.transform(0.7*u,0.35*u,0,-u,0,0);};

const RRSIDEWIN=(c,I,x1,Y,Z,w,h,glass,frame)=>{BP(c,[I(x1+0.01,Y-w/2-0.1,Z-h/2-0.1),I(x1+0.01,Y+w/2+0.1,Z-h/2-0.1),I(x1+0.01,Y+w/2+0.1,Z+h/2+0.1),I(x1+0.01,Y-w/2-0.1,Z+h/2+0.1)],frame||'#e4e0d6');BP(c,[I(x1+0.02,Y-w/2,Z-h/2),I(x1+0.02,Y+w/2,Z-h/2),I(x1+0.02,Y+w/2,Z+h/2),I(x1+0.02,Y-w/2,Z+h/2)],glass||'#cfe3ee');TH.ln(c,I(x1+0.03,Y,Z-h/2),I(x1+0.03,Y,Z+h/2),'rgba(255,255,255,.7)',1.2);};

/* ===== GUEST SERVICES HELPERS: service window + attendant, "i" information signs, park-map board, strollers ===== */
/* the information "i" on a plaque drawn on a wall plane or a free-standing sign; shape: round | shield | rect | arch */
const GSINFO=(c,x,y,u,bg,fg,rim,shape,plane,sc)=>{c.save();RRPLANE(c,x,y,u*(sc||1.5),plane||'F');
  if(shape==='round'){c.beginPath();c.arc(0,0,0.68,0,7);c.fillStyle=rim||fg;c.fill();c.beginPath();c.arc(0,0,0.58,0,7);c.fillStyle=bg;c.fill();}
  else if(shape==='shield'){c.beginPath();c.moveTo(-0.58,0.64);c.lineTo(0.58,0.64);c.lineTo(0.58,0.0);c.quadraticCurveTo(0.52,-0.52,0,-0.76);c.quadraticCurveTo(-0.52,-0.52,-0.58,0.0);c.closePath();c.fillStyle=rim||fg;c.fill();c.beginPath();c.moveTo(-0.49,0.55);c.lineTo(0.49,0.55);c.lineTo(0.49,0.0);c.quadraticCurveTo(0.45,-0.44,0,-0.65);c.quadraticCurveTo(-0.45,-0.44,-0.49,0.0);c.closePath();c.fillStyle=bg;c.fill();}
  else if(shape==='arch'){c.beginPath();c.moveTo(-0.55,-0.68);c.lineTo(-0.55,0.1);c.arc(0,0.1,0.55,Math.PI,0,false);c.lineTo(0.55,-0.68);c.closePath();c.fillStyle=rim||fg;c.fill();c.beginPath();c.moveTo(-0.46,-0.59);c.lineTo(-0.46,0.1);c.arc(0,0.1,0.46,Math.PI,0,false);c.lineTo(0.46,-0.59);c.closePath();c.fillStyle=bg;c.fill();}
  else{c.fillStyle=rim||fg;c.fillRect(-0.62,-0.68,1.24,1.36);c.fillStyle=bg;c.fillRect(-0.53,-0.59,1.06,1.18);}
  c.fillStyle=fg;c.beginPath();c.arc(0,0.34,0.115,0,7);c.fill();c.fillRect(-0.09,-0.3,0.18,0.5);c.fillRect(-0.21,-0.36,0.42,0.1);c.fillRect(-0.2,0.08,0.2,0.11);c.restore();};
/* a post-mounted information sign standing on the ground at (X,Y): plaque centre at height zTop */
const GSSIGN=(c,I,u,X,Y,zTop,bg,fg,rim,shape,postCol,sc,plane)=>{const p=I(X,Y,0),q=I(X,Y,zTop);TH.ell(c,p[0],p[1]+u*0.1,u*0.6,u*0.22,'rgba(0,0,0,.2)');TH.ln(c,p,q,postCol||'#6a7684',u*0.24);TH.ell(c,p[0],p[1],u*0.3,u*0.12,shade(postCol||'#6a7684',-0.2));GSINFO(c,q[0],q[1],u,bg,fg,rim,shape,plane||'F',sc||1.45);};
/* the park-map board: two posts and a framed panel with a little map (kind 'map') or pinned notices (kind 'posters') */
const GSMAP=(c,I,u,X,Y,frame,paper,kind,pal)=>{pal=Object.assign({g:'#8fcf88',w:'#7cc4e8',t:'#d9b27a',p:'#b8824a',d:'#d9433b',y:'#e8a030'},pal||{});const pL=I(X-0.95,Y,0),pR=I(X+0.95,Y,0);TH.ell(c,I(X,Y,0)[0],I(X,Y,0)[1]+u*0.1,u*1.5,u*0.3,'rgba(0,0,0,.18)');RPOST(c,I,X-0.95,Y,0,2.3,frame,u,0.22);RPOST(c,I,X+0.95,Y,0,2.3,frame,u,0.22);
  const p=I(X,Y+0.08,2.3);c.save();RRPLANE(c,p[0],p[1],u,'F');c.fillStyle=frame;c.fillRect(-1.12,-0.86,2.24,1.72);c.fillStyle=paper||'#efe6c8';c.fillRect(-1.0,-0.74,2.0,1.48);
  if(kind==='posters'){[[-0.72,0.28,0.55,0.7],[0.0,0.34,0.55,0.62],[0.7,0.26,0.5,0.7],[-0.4,-0.38,0.55,0.55],[0.35,-0.36,0.6,0.58]].forEach(([a,b,w,h],i)=>{c.fillStyle=['#f7f0dc','#efe0b8','#f2e8c8'][i%3];c.fillRect(a-w/2,b-h/2,w,h);c.fillStyle='rgba(60,30,12,.55)';c.fillRect(a-w*0.36,b+h*0.12,w*0.72,0.06);c.fillRect(a-w*0.36,b-h*0.08,w*0.5,0.05);c.fillStyle='#b83a2a';c.beginPath();c.arc(a,b-h*0.28,0.06,0,7);c.fill();});}
  else{c.fillStyle=pal.g;c.beginPath();c.ellipse(-0.45,0.2,0.5,0.34,0.3,0,7);c.fill();c.beginPath();c.ellipse(0.5,-0.2,0.42,0.3,-0.2,0,7);c.fill();c.fillStyle=pal.w;c.beginPath();c.ellipse(0.35,0.3,0.32,0.2,0.1,0,7);c.fill();c.fillStyle=pal.t;c.beginPath();c.ellipse(-0.45,-0.38,0.3,0.18,0,0,7);c.fill();c.strokeStyle=pal.p;c.lineWidth=0.06;c.beginPath();c.moveTo(-0.8,0.05);c.quadraticCurveTo(-0.1,0.4,0.2,0.0);c.quadraticCurveTo(0.5,-0.2,0.85,-0.5);c.stroke();c.fillStyle=pal.d;c.beginPath();c.arc(0.05,0.12,0.09,0,7);c.fill();[[0.62,0.42],[-0.7,-0.05],[0.1,-0.5]].forEach(([a,b])=>{c.fillStyle=pal.y;c.fillRect(a-0.07,b-0.07,0.14,0.14);});}
  c.restore();};
/* a parked stroller (side view): canopy, seat, push-bar and two wheels */
const GSSTROLLER=(c,x,y,u,col,dir)=>{const d=dir||1;c.save();c.translate(x,y);c.scale(d,1);TH.ell(c,0,u*0.1,u*0.85,u*0.2,'rgba(0,0,0,.2)');
  TH.ln(c,[u*0.5,-u*0.5],[u*0.95,-u*1.55],'#5a6674',u*0.1);TH.ln(c,[u*0.8,-u*1.55],[u*1.15,-u*1.55],'#3a4450',u*0.14);
  TH.poly(c,[[-u*0.6,-u*0.55],[u*0.55,-u*0.55],[u*0.45,-u*1.0],[-u*0.6,-u*1.05]],shade(col,-0.1));
  c.fillStyle=col;c.beginPath();c.moveTo(-u*0.6,-u*1.05);c.quadraticCurveTo(-u*0.55,-u*1.9,u*0.1,-u*1.7);c.lineTo(u*0.25,-u*1.0);c.closePath();c.fill();c.fillStyle='rgba(255,255,255,.22)';c.beginPath();c.moveTo(-u*0.5,-u*1.05);c.quadraticCurveTo(-u*0.45,-u*1.65,-u*0.05,-u*1.55);c.lineTo(-u*0.05,-u*1.05);c.closePath();c.fill();
  [-u*0.4,u*0.45].forEach(wx=>{TH.ell(c,wx,-u*0.28,u*0.26,u*0.26,'#2a3038');TH.ell(c,wx,-u*0.28,u*0.12,u*0.12,'#9aa6b4');});TH.ln(c,[-u*0.4,-u*0.3],[u*0.45,-u*0.3],'#5a6674',u*0.07);c.restore();};
/* the attendant seen through the service window */
const GSATT=(c,x,y,u,shirt,hat,skin,hatKind)=>{skin=skin||'#fde4c8';TH.poly(c,[[x-u*0.55,y],[x+u*0.55,y],[x+u*0.42,y-u*0.95],[x-u*0.42,y-u*0.95]],shirt);TH.poly(c,[[x-u*0.12,y-u*0.95],[x+u*0.12,y-u*0.95],[x,y-u*0.55]],'rgba(255,255,255,.5)');
  TH.ell(c,x,y-u*1.28,u*0.3,u*0.32,skin);TH.ell(c,x-u*0.1,y-u*1.3,u*0.04,u*0.04,'#2a1a10');TH.ell(c,x+u*0.1,y-u*1.3,u*0.04,u*0.04,'#2a1a10');
  if(hat){if(hatKind==='ranger'||hatKind==='wide'){TH.ell(c,x,y-u*1.52,u*0.62,u*0.16,hat);TH.poly(c,[[x-u*0.3,y-u*1.52],[x+u*0.3,y-u*1.52],[x+u*0.24,y-u*1.95],[x-u*0.24,y-u*1.95]],hat);}else{c.fillStyle=hat;c.beginPath();c.ellipse(x,y-u*1.45,u*0.34,u*0.3,0,Math.PI,0,false);c.fill();TH.ell(c,x,y-u*1.45,u*0.34,u*0.08,shade(hat,-0.25));}}};
/* the service window: frame, warm interior with an attendant, and a deep counter in front (the wall must already be drawn) */
const GSWIN=(c,x,y,u,I,X,y1,w,z0,h,o)=>{o=o||{};BP(c,[I(X-w/2-0.16,y1+0.01,z0-0.12),I(X+w/2+0.16,y1+0.01,z0-0.12),I(X+w/2+0.16,y1+0.01,z0+h+0.16),I(X-w/2-0.16,y1+0.01,z0+h+0.16)],o.frame||'#e8e2d4');
  BP(c,[I(X-w/2,y1+0.03,z0),I(X+w/2,y1+0.03,z0),I(X+w/2,y1+0.03,z0+h),I(X-w/2,y1+0.03,z0+h)],o.inside||'#3a2a1c');GLOW(c,...I(X,y1+0.1,z0+h*0.5),u*w*(o.glowR||0.75),o.glow||'255,200,120',o.glowA===undefined?0.4:o.glowA);
  const sh=z0+h*0.5;BP(c,[I(X-w/2+0.15,y1+0.07,sh),I(X+w/2-0.15,y1+0.07,sh),I(X+w/2-0.15,y1+0.07,sh+0.09),I(X-w/2+0.15,y1+0.07,sh+0.09)],o.shelf||'#8a6a46');
  [[-0.32,0.34,'#d9433b'],[-0.1,0.3,'#f2c230'],[0.12,0.4,'#4aa0d8'],[0.32,0.26,'#ffffff']].forEach(([k,hh,col])=>{const a=I(X+k*w*0.9,y1+0.07,sh+0.09),b=I(X+k*w*0.9+0.28,y1+0.07,sh+0.09),c2=I(X+k*w*0.9+0.28,y1+0.07,sh+0.09+hh),d=I(X+k*w*0.9,y1+0.07,sh+0.09+hh);BP(c,[a,b,c2,d],col);});
  BP(c,[I(X-w/2+0.15,y1+0.07,z0+0.15),I(X+w/2-0.15,y1+0.07,z0+0.15),I(X+w/2-0.15,y1+0.07,z0+0.24),I(X-w/2+0.15,y1+0.07,z0+0.24)],o.shelf||'#8a6a46');
  TH.ln(c,I(X-w*0.28,y1+0.08,z0+h),I(X-w*0.28,y1+0.08,z0+h-0.45),'#2a2018',u*0.05);TH.ell(c,...I(X-w*0.28,y1+0.1,z0+h-0.55),u*0.2,u*0.14,'#ffe9a8');GLOW(c,...I(X-w*0.28,y1+0.1,z0+h-0.55),u*1.4,'255,225,150',0.5);
  TH.ln(c,I(X,y1+0.08,z0+h),I(X,y1+0.08,z0+h*0.55),'rgba(255,255,255,.0)',1);
  if(o.glass!==false){BP(c,[I(X+w/2-0.9,y1+0.1,z0+0.15),I(X+w/2-0.1,y1+0.1,z0+0.15),I(X+w/2-0.1,y1+0.1,z0+h-0.15),I(X+w/2-0.9,y1+0.1,z0+h-0.15)],'rgba(180,225,250,.18)');}
  JBOX(c,x,y,u,X-w/2-0.35,X+w/2+0.35,y1,y1+0.8,0,z0+0.06,o.counter||'#c8c2b4');BT(c,I,X-w/2-0.35,X+w/2+0.35,y1,y1+0.8,z0+0.06,o.top||'#e8e2d4');
  [-0.5,0,0.5].forEach(k=>{TH.ln(c,I(X+k*w*0.6,y1+0.8,0.25),I(X+k*w*0.6,y1+0.8,z0-0.1),'rgba(0,0,0,.12)',u*0.05);});
  /* a service bell and a few leaflets on the counter */
  const b=I(X+w*0.28,y1+0.4,z0+0.06);TH.ell(c,b[0],b[1],u*0.22,u*0.09,'#c8a040');c.fillStyle='#e8c050';c.beginPath();c.ellipse(b[0],b[1]-u*0.12,u*0.17,u*0.14,0,Math.PI,0,false);c.fill();TH.ell(c,b[0],b[1]-u*0.3,u*0.04,u*0.04,'#8a6a20');
  const l=I(X-w*0.3,y1+0.42,z0+0.07);[0,1,2].forEach(k=>TH.poly(c,[[l[0]+k*u*0.28,l[1]],[l[0]+k*u*0.28+u*0.22,l[1]-u*0.08],[l[0]+k*u*0.28+u*0.22,l[1]-u*0.5],[l[0]+k*u*0.28,l[1]-u*0.42]],['#d9433b','#f2c230','#4aa0d8'][k]));};
const RFRONT=(c,I,y1,x0,x1,z0,z1)=>[I(x0,y1,z0),I(x1,y1,z0),I(x1,y1,z1),I(x0,y1,z1)];
const RIGHTF=(c,I,x1,y0,y1,z0,z1)=>[I(x1,y0,z0),I(x1,y1,z0),I(x1,y1,z1),I(x1,y0,z1)];
const FGAB_=(c,I,x0,x1,y0,y1,z,H,o,roofC,faceC,trim,u)=>{const xc=(x0+x1)/2;BP(c,[I(x1+o,y1+o,z),I(x1+o,y0,z),I(xc,y0,z+H),I(xc,y1+o,z+H)],roofC);TH.ln(c,I(xc,y0,z+H),I(xc,y1+o,z+H),shade(roofC,-0.3),u*0.14);TH.ln(c,I(x1+o,y1+o,z),I(x1+o,y0,z),shade(roofC,-0.3),u*0.1);
  BP(c,[I(x0-o,y1+o,z),I(x1+o,y1+o,z),I(xc,y1+o,z+H)],faceC,trim,u*0.1);};
/* ===== shared little props for the new lands ===== */
const RRNG_=v=>mulberry(1234+(v|0));
const RPALM_=(c,x,y,u,h,lean,col)=>{col=col||['#4f9a3c','#3a7d2c'];TH.ell(c,x,y,u*0.8,u*0.28,'rgba(20,30,10,.22)');const tx=x+lean*u,ty=y-h;c.strokeStyle='#8a6038';c.lineWidth=u*0.3;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*u*0.2,y-h*0.55,tx,ty);c.stroke();
  for(let k=0;k<7;k++){const a=k/7*6.283+0.3,dx=Math.cos(a),dy=Math.sin(a)*0.45,L=u*2.1;c.fillStyle=k%2?col[0]:col[1];c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+dx*L*0.6,ty+dy*L*0.6-u*0.9,tx+dx*L,ty+dy*L+u*0.5);c.quadraticCurveTo(tx+dx*L*0.5,ty+dy*L*0.5-u*0.1,tx,ty);c.fill();}
  TH.ell(c,tx,ty+u*0.1,u*0.22,u*0.2,'#7a5430');};
const RCYPRESS_=(c,x,y,u,h)=>{TH.ell(c,x,y,u*0.7,u*0.25,'rgba(20,30,10,.22)');const g=c.createLinearGradient(x-u*0.6,0,x+u*0.6,0);g.addColorStop(0,'#4d8a45');g.addColorStop(0.55,'#2f6a34');g.addColorStop(1,'#1e4a28');c.fillStyle=g;c.beginPath();c.moveTo(x-u*0.62,y-u*0.2);c.quadraticCurveTo(x-u*0.75,y-h*0.55,x,y-h);c.quadraticCurveTo(x+u*0.75,y-h*0.55,x+u*0.62,y-u*0.2);c.closePath();c.fill();};
const ROLIVE_=(c,x,y,u,h)=>{TH.ell(c,x,y,u*0.9,u*0.3,'rgba(20,30,10,.22)');c.strokeStyle='#7a6a58';c.lineWidth=u*0.32;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.2,y-h*0.5,x+u*0.1,y-h*0.8);c.stroke();const rn=RRNG_(Math.round(x));[[0,-h*0.95,1.25,0.8],[-1.0,-h*0.78,0.95,0.65],[1.0,-h*0.8,0.95,0.65]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy,rx*u,ry*u,['#7d9a63','#6b8a56','#8aa86e'][i],rn,9));};
const RJAR_=(c,x,y,u,col,h)=>{h=h||1.5;TH.ell(c,x,y,u*0.55,u*0.2,'rgba(0,0,0,.2)');const g=c.createLinearGradient(x-u*0.5,0,x+u*0.5,0);g.addColorStop(0,shade(col,0.22));g.addColorStop(0.55,col);g.addColorStop(1,shade(col,-0.35));c.fillStyle=g;c.beginPath();c.moveTo(x-u*0.2,y-u*h);c.quadraticCurveTo(x-u*0.62,y-u*h*0.55,x-u*0.3,y);c.lineTo(x+u*0.3,y);c.quadraticCurveTo(x+u*0.62,y-u*h*0.55,x+u*0.2,y-u*h);c.closePath();c.fill();TH.ell(c,x,y-u*h,u*0.24,u*0.09,shade(col,-0.4));TH.ln(c,[x-u*0.5,y-u*h*0.55],[x+u*0.5,y-u*h*0.55],shade(col,-0.25),u*0.07);};
const RLANT_RED_=(c,x,y,u,s)=>{s=s||1;GLOW(c,x,y+u*0.4*s,u*1.1*s,'255,70,40',0.45);TH.ln(c,[x,y-u*0.35*s],[x,y],'#3a2a1a',u*0.06);TH.ell(c,x,y+u*0.45*s,u*0.36*s,u*0.46*s,'#d8261c');TH.ell(c,x-u*0.1*s,y+u*0.35*s,u*0.1*s,u*0.18*s,'rgba(255,200,170,.55)');TH.ell(c,x,y,u*0.2*s,u*0.07*s,'#e9b43a');TH.ell(c,x,y+u*0.92*s,u*0.2*s,u*0.07*s,'#e9b43a');TH.ln(c,[x,y+u*0.95*s],[x,y+u*1.3*s],'#e9b43a',u*0.06);};
const RBOWL_=(c,x,y,u,s,steam)=>{s=s||1;TH.ell(c,x,y+u*0.5*s,u*0.9*s,u*0.28*s,'rgba(0,0,0,.18)');c.fillStyle='#f4efe6';c.beginPath();c.moveTo(x-u*0.9*s,y);c.quadraticCurveTo(x-u*0.7*s,y+u*0.75*s,x,y+u*0.8*s);c.quadraticCurveTo(x+u*0.7*s,y+u*0.75*s,x+u*0.9*s,y);c.closePath();c.fill();c.fillStyle='#c33a2b';c.fillRect(x-u*0.82*s,y+u*0.12*s,u*1.64*s,u*0.1*s);TH.ell(c,x,y,u*0.9*s,u*0.3*s,'#e8b85a');for(let k=0;k<5;k++)TH.ln(c,[x-u*0.6*s+k*u*0.3*s,y-u*0.08*s],[x-u*0.45*s+k*u*0.3*s,y+u*0.1*s],'#fff0b8',u*0.07*s);TH.ell(c,x+u*0.25*s,y-u*0.05*s,u*0.14*s,u*0.07*s,'#7bb04a');TH.ln(c,[x+u*0.1*s,y-u*0.15*s],[x+u*1.0*s,y-u*1.25*s],'#6a3a1a',u*0.08*s);TH.ln(c,[x+u*0.3*s,y-u*0.12*s],[x+u*1.2*s,y-u*1.1*s],'#6a3a1a',u*0.08*s);
  if(steam){c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=u*0.1*s;c.lineCap='round';for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(x+k*u*0.4*s,y-u*0.2*s);c.bezierCurveTo(x+k*u*0.4*s-u*0.3*s,y-u*0.6*s,x+k*u*0.4*s+u*0.3*s,y-u*0.9*s,x+k*u*0.4*s,y-u*1.3*s);c.stroke();}}};
const RNIGIRI_=(c,x,y,u,s,fish)=>{s=s||1;TH.ell(c,x,y+u*0.18*s,u*0.7*s,u*0.22*s,'rgba(0,0,0,.2)');c.fillStyle='#fbf8f0';c.beginPath();c.moveTo(x-u*0.55*s,y);c.quadraticCurveTo(x-u*0.6*s,y-u*0.4*s,x-u*0.35*s,y-u*0.42*s);c.lineTo(x+u*0.35*s,y-u*0.42*s);c.quadraticCurveTo(x+u*0.6*s,y-u*0.4*s,x+u*0.55*s,y);c.closePath();c.fill();c.fillStyle=fish||'#f26b4f';c.beginPath();c.moveTo(x-u*0.68*s,y-u*0.28*s);c.quadraticCurveTo(x,y-u*0.95*s,x+u*0.68*s,y-u*0.28*s);c.quadraticCurveTo(x,y-u*0.4*s,x-u*0.68*s,y-u*0.28*s);c.fill();c.strokeStyle='#fde7dd';c.lineWidth=u*0.06*s;c.beginPath();c.moveTo(x-u*0.4*s,y-u*0.4*s);c.quadraticCurveTo(x,y-u*0.62*s,x+u*0.4*s,y-u*0.4*s);c.stroke();};
const RCHERRY_=(c,x,y,u,h,v)=>{TH.ell(c,x,y,u*1.0,u*0.34,'rgba(20,20,10,.22)');c.strokeStyle='#5a3d2e';c.lineWidth=u*0.3;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+u*0.15,y-h*0.5,x-u*0.1,y-h*0.8);c.stroke();TH.ln(c,[x-u*0.05,y-h*0.55],[x+u*0.9,y-h*0.85],'#5a3d2e',u*0.16);const rn=RRNG_(v||3);[[-0.8,-h*0.98,1.4,0.95,'#f2a9c1'],[0.9,-h*0.95,1.3,0.9,'#f6bfd0'],[0.0,-h*1.15,1.35,0.9,'#f9cddb'],[-0.1,-h*0.85,1.1,0.7,'#ee97b3']].forEach(([dx,dy,rx,ry,col])=>TH.blob(c,x+dx*u,y+dy,rx*u,ry*u,col,rn,10));for(let k=0;k<7;k++)TH.ell(c,x+(rn()-0.5)*u*3.6,y+u*0.05+rn()*u*0.15,u*0.12,u*0.05,'#f9cddb');};
const RUPT_=(c,I,X,Y,Z,w,col,u)=>{/* small curved eave tip */const p=I(X,Y,Z);TH.poly(c,[[p[0]-u*w,p[1]+u*0.1],[p[0],p[1]-u*0.5],[p[0]+u*w,p[1]+u*0.1]],col);};


/* ===== RESTROOM HELPERS: pictogram plaques, door pairs, drinking fountain, roof vents ===== */
/* A little person pictogram on a plaque drawn ON a wall plane: (x,y) = screen point of the plaque centre; plane 'F' = the front wall (along +X), 'R' = the right wall (along -Y). */
const RRFOUNT=(c,x,y,u,col)=>{TH.ell(c,x,y+u*0.1,u*0.55,u*0.2,'rgba(0,0,0,.2)');EGCYL_(c,x,y,u*0.3,u*0.12,u*1.4,[shade(col||'#b8c2cc',0.2),col||'#b8c2cc',shade(col||'#b8c2cc',-0.35)]);TH.ell(c,x,y-u*1.5,u*0.62,u*0.24,shade(col||'#b8c2cc',0.15));TH.ell(c,x,y-u*1.55,u*0.46,u*0.17,'#6fa8c8');TH.ln(c,[x+u*0.1,y-u*1.5],[x+u*0.1,y-u*2.0],'#8a96a4',u*0.1);TH.ln(c,[x+u*0.1,y-u*2.0],[x+u*0.4,y-u*2.0],'#8a96a4',u*0.1);};
/* a small round roof turbine vent / chimney cowl */
const RRLOUVER=(c,I,y1,x0,x1,z0,z1,n,col,dk)=>{BP(c,[I(x0,y1+0.01,z0),I(x1,y1+0.01,z0),I(x1,y1+0.01,z1),I(x0,y1+0.01,z1)],dk||'#2a3038');for(let k=0;k<n;k++){const z=z0+(z1-z0)*(k+0.5)/n;BP(c,[I(x0+0.04,y1+0.04,z-0.05),I(x1-0.04,y1+0.04,z-0.05),I(x1-0.04,y1+0.08,z+0.06),I(x0+0.04,y1+0.08,z+0.06)],col||'#dfe5ea');}};
/* a small frosted window on the right wall (x1 plane) */
const RRI=(x,y,u)=>(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);
const RRBRICK_=(c,I,x0,x1,y1,z0,z1,col,u)=>{for(let z=z0+0.3;z<z1-0.01;z+=0.3)TH.ln(c,I(x0,y1+0.01,z),I(x1,y1+0.01,z),col,u*0.035);for(let r=0;r<Math.round((z1-z0)/0.3);r++)for(let X=x0+(r%2)*0.3;X<x1;X+=0.6)TH.ln(c,I(X,y1+0.01,z0+r*0.3),I(X,y1+0.01,z0+r*0.3+0.3),col,u*0.03);};
const RRBRICKR_=(c,I,x1,y0,y1,z0,z1,col,u)=>{for(let z=z0+0.3;z<z1-0.01;z+=0.3)TH.ln(c,I(x1+0.01,y0,z),I(x1+0.01,y1,z),col,u*0.035);};
/* arched opening on the front wall: dark recess, leaf, stone frame; w = width, hh = height to the springing of the arch */
const RRARCH_=(c,I,u,y1,X,w,hh,frame,leaf,leafD,studs)=>{const top=I(X,y1+0.02,hh),rx=u*0.7*w/2;c.fillStyle=frame;c.beginPath();const a=I(X-w/2-0.14,y1+0.02,0),b=I(X+w/2+0.14,y1+0.02,0),at=I(X-w/2-0.14,y1+0.02,hh);c.moveTo(a[0],a[1]);c.lineTo(at[0],at[1]);c.ellipse(top[0],top[1],rx+u*0.1,u*0.34+u*0.1,0,Math.PI,0);c.lineTo(b[0],b[1]);c.closePath();c.fill();
  const a2=I(X-w/2,y1+0.04,0),b2=I(X+w/2,y1+0.04,0),a2t=I(X-w/2,y1+0.04,hh);c.fillStyle='#1a120c';c.beginPath();c.moveTo(a2[0],a2[1]);c.lineTo(a2t[0],a2t[1]);c.ellipse(top[0],top[1],rx,u*0.34,0,Math.PI,0);c.lineTo(b2[0],b2[1]);c.closePath();c.fill();
  const a3=I(X-w/2+0.1,y1+0.06,0),b3=I(X+w/2-0.1,y1+0.06,0),a3t=I(X-w/2+0.1,y1+0.06,hh*0.96);c.fillStyle=leaf;c.beginPath();c.moveTo(a3[0],a3[1]);c.lineTo(a3t[0],a3t[1]);c.ellipse(top[0],top[1]+u*0.03,rx-u*0.08,u*0.3,0,Math.PI,0);c.lineTo(b3[0],b3[1]);c.closePath();c.fill();
  for(let k=1;k<4;k++){const t=k/4,p=I(X-w/2+0.1+(w-0.2)*t,y1+0.07,0),q=I(X-w/2+0.1+(w-0.2)*t,y1+0.07,hh*0.94);TH.ln(c,p,q,leafD,u*0.06);}
  if(studs)for(let r=0;r<3;r++)for(let k=0;k<3;k++){const p=I(X-w/2+0.3+k*(w-0.6)/2,y1+0.08,0.4+r*(hh-0.9)/2);TH.ell(c,p[0],p[1],u*0.06,u*0.06,studs);}};
const RRSLIT_=(c,I,y1,X,Z,w,h,glass,frame)=>{BP(c,[I(X-w/2-0.06,y1+0.01,Z-h/2-0.06),I(X+w/2+0.06,y1+0.01,Z-h/2-0.06),I(X+w/2+0.06,y1+0.01,Z+h/2+0.06),I(X-w/2-0.06,y1+0.01,Z+h/2+0.06)],frame);BP(c,[I(X-w/2,y1+0.02,Z-h/2),I(X+w/2,y1+0.02,Z-h/2),I(X+w/2,y1+0.02,Z+h/2),I(X-w/2,y1+0.02,Z+h/2)],glass);};
const GUEST_ART={};
const GI=(x,y,u)=>(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);
const GSSTAR=(c,x,y,r,col,n)=>{n=n||5;const pts=[];for(let k=0;k<n*2;k++){const a=-Math.PI/2+k*Math.PI/n,rr=k%2?r*0.42:r;pts.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr]);}TH.poly(c,pts,col);};
const GSWHEEL=(c,x,y,r,col,spokes)=>{c.strokeStyle=col;c.lineWidth=r*0.16;c.beginPath();c.arc(x,y,r,0,7);c.stroke();c.lineWidth=r*0.1;for(let k=0;k<(spokes||8);k++){const a=k*Math.PI*2/(spokes||8);c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);c.stroke();}TH.ell(c,x,y,r*0.22,r*0.22,col);};
/* ===== GUEST SERVICES ART for the new lands: a service window with a deep counter, a post-mounted "i" sign, a park-map board and parked strollers. Trees and plants are drawn first, behind the building. ===== */
const GSSTR2_=(c,I,u,list)=>list.forEach(([X,Y,col,d])=>GSSTROLLER(c,...I(X,Y,0),u,col,d));

/* ---- CHINA: a tea-house style information pavilion (red lacquered posts, lattice panels, a grey-tile hip roof with upturned corners, red lanterns) ---- */
GUEST_ART.china={dy:0.05,k:1.15,draw(c,x,y,u,v){const I=GI(x,y,u),red='#c4301f',redD='#8f2216',gold='#e6b43c',tile='#4f5a60',tileD='#323a40',tileL='#6f7c84',plas='#f2ece0',brick='#8d9298';RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'44,38,30');
  const bb=I(-7.4,1.8,0);RJAR_(c,bb[0],bb[1],u*1.2,'#c4301f',1.2);for(let k=0;k<4;k++)TH.ln(c,[bb[0]+(k-1.5)*u*0.2,bb[1]-u*1.5],[bb[0]+(k-1.5)*u*0.35,bb[1]-u*2.9-(k%2)*u*0.5],'#5ea04a',u*0.13);
  JBOX(c,x,y,u,-4.6,4.6,-2.7,2.7,0,0.4,'#b8b0a0');
  JBOX(c,x,y,u,-4.2,4.2,-2.5,2.5,0.4,3.8,plas);BP(c,RFRONT(c,I,2.5,-4.2,4.2,0.4,1.0),brick);BP(c,RIGHTF(c,I,4.2,-2.5,2.5,0.4,1.0),shade(brick,-0.25));RRBRICK_(c,I,-4.2,4.2,2.5,0.4,1.0,'rgba(30,34,40,.35)',u);RRBRICKR_(c,I,4.2,-2.5,2.5,0.4,1.0,'rgba(20,24,30,.35)',u);
  [-4.2,4.2].forEach(X=>RPOST(c,I,X,2.56,0.4,3.8,red,u,0.38));RPOST(c,I,4.26,-2.5,0.4,3.8,red,u,0.34);RPOST(c,I,4.26,0,0.4,3.8,red,u,0.3);
  TH.ln(c,I(-4.2,2.56,3.55),I(4.2,2.56,3.55),redD,u*0.3);TH.ln(c,I(4.26,-2.5,3.55),I(4.26,2.5,3.55),redD,u*0.3);
  /* lattice panels either side of the window */
  [-3.0,3.0].forEach(X=>{BP(c,RFRONT(c,I,2.52,X-0.75,X+0.75,1.4,3.0),'#3a1410',gold,u*0.08);for(let k=-2;k<=2;k++)TH.ln(c,I(X+k*0.3,2.55,1.4),I(X+k*0.3,2.55,3.0),gold,u*0.05);for(let k=0;k<4;k++)TH.ln(c,I(X-0.75,2.55,1.7+k*0.4),I(X+0.75,2.55,1.7+k*0.4),gold,u*0.05);});
  BP(c,RIGHTF(c,I,4.22,-0.8,0.8,1.8,3.0),'#3a1410',gold,u*0.08);for(let k=-2;k<=2;k++)TH.ln(c,I(4.25,k*0.32,1.8),I(4.25,k*0.32,3.0),gold,u*0.05);for(let k=-1;k<=1;k++)TH.ln(c,I(4.25,-0.8,2.4+k*0.4),I(4.25,0.8,2.4+k*0.4),gold,u*0.05);
  GSWIN(c,x,y,u,I,0,2.5,3.0,1.25,1.9,{frame:red,inside:'#2a140c',counter:'#8f2216',top:'#e6b43c'});
  [-1.9,1.9].forEach(X=>RPOST(c,I,X,2.58,0.4,3.7,red,u,0.3));
  HIP(c,I,-4.9,4.9,-3.0,3.0,3.8,1.9,0.3,tile,tileD,u,6);[[-5.2,3.3],[5.2,3.3],[5.2,-3.3]].forEach(([X,Y])=>RUPT_(c,I,X,Y,3.9,0.5,tileL,u));
  const rp=I(0,0,5.7);TH.ln(c,[rp[0],rp[1]],[rp[0],rp[1]-u*0.4],gold,u*0.12);TH.ell(c,rp[0],rp[1]-u*0.5,u*0.2,u*0.2,gold);TH.ln(c,I(-1.8,0,5.7),I(1.8,0,5.7),gold,u*0.16);
  [-3.0,3.0].forEach(X=>{const p=I(X,3.1,3.8);RLANT_RED_(c,p[0],p[1],u,0.9);});
  GSSIGN(c,I,u,5.8,3.8,3.5,'#c4301f','#f6d36a','#e6b43c','round','#5a1810');GSMAP(c,I,u,-5.7,3.7,'#5a1810','#f1e4c0','map');
  GSSTR2_(c,I,u,[[-2.6,5.6,'#d9433b'],[-0.8,6.2,'#e6b43c'],[2.4,5.8,'#4aa0d8',-1]]);}};

/* ---- JAPAN: a machiya-style information office (charred cedar, a slatted service window under indigo noren, a deep slate roof, a stone lantern and a maple) ---- */
GUEST_ART.japan={dy:0.05,k:1.15,draw(c,x,y,u,v){const I=GI(x,y,u),wood='#3d3028',woodD='#2a201a',plas='#f1ebdd',slate='#4a5260',slateD='#2f3540',rn=RRNG_(14+(v|0));RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'40,34,28');
  const sl=I(-6.8,0.6,0);TH.ell(c,sl[0],sl[1]+u*0.1,u*0.6,u*0.22,'rgba(0,0,0,.2)');JBOX(c,x,y,u,-7.2,-6.4,0.2,1.0,0,0.8,'#9a9a90');JBOX(c,x,y,u,-7.1,-6.5,0.3,0.9,0.8,1.25,'#ffe9b0');TH.poly(c,[I(-7.4,0.1,1.3),I(-6.2,0.1,1.3),I(-6.8,0.6,1.9)],'#7a7a72');
  const mp=I(-8.3,2.6,0);TH.ell(c,mp[0],mp[1],u*1.0,u*0.34,'rgba(20,20,10,.22)');c.strokeStyle='#4a3326';c.lineWidth=u*0.28;c.lineCap='round';c.beginPath();c.moveTo(mp[0],mp[1]);c.quadraticCurveTo(mp[0]+u*0.1,mp[1]-u*1.2,mp[0]-u*0.1,mp[1]-u*2.0);c.stroke();[[0,-2.5,1.2,0.8,'#c8402a'],[-0.8,-2.1,0.9,0.6,'#d9582e'],[0.8,-2.1,0.9,0.6,'#b8321f']].forEach(([dx,dy,rx,ry,col])=>TH.blob(c,mp[0]+dx*u,mp[1]+dy*u,rx*u,ry*u,col,rn,9));
  JBOX(c,x,y,u,-4.6,4.6,-2.7,2.7,0,0.45,'#9a9a90');
  JBOX(c,x,y,u,-4.2,4.2,-2.5,2.5,0.45,3.6,wood);for(let k=0;k<17;k++)TH.ln(c,I(-4.1+k*0.5,2.51,0.45),I(-4.1+k*0.5,2.51,3.6),'rgba(255,225,180,.1)',u*0.04);for(let k=0;k<10;k++)TH.ln(c,I(4.21,-2.4+k*0.5,0.45),I(4.21,-2.4+k*0.5,3.6),'rgba(0,0,0,.25)',u*0.05);
  BP(c,RFRONT(c,I,2.52,-4.2,4.2,3.2,3.6),plas);BP(c,RIGHTF(c,I,4.22,-2.5,2.5,3.2,3.6),shade(plas,-0.18));TH.ln(c,I(-4.2,2.54,3.2),I(4.2,2.54,3.2),'#2a201a',u*0.14);
  [-4.2,-2.0,2.0,4.2].forEach(X=>RPOST(c,I,X,2.56,0.45,3.6,'#2a201a',u,0.24));
  [-3.1,3.1].forEach(X=>{BP(c,RFRONT(c,I,2.52,X-0.6,X+0.6,1.5,2.9),'#2a201a');BP(c,RFRONT(c,I,2.54,X-0.52,X+0.52,1.58,2.82),'#f6eed6');for(let k=-1;k<=1;k++)TH.ln(c,I(X+k*0.3,2.56,1.58),I(X+k*0.3,2.56,2.82),'#7a5a3a',u*0.05);for(let k=0;k<4;k++)TH.ln(c,I(X-0.52,2.56,1.58+k*0.41),I(X+0.52,2.56,1.58+k*0.41),'#7a5a3a',u*0.05);});
  BP(c,RIGHTF(c,I,4.24,-0.7,0.7,1.7,2.6),'#2a201a');for(let k=-2;k<=2;k++)TH.ln(c,I(4.26,k*0.26,1.7),I(4.26,k*0.26,2.6),'#a8884e',u*0.05);
  GSWIN(c,x,y,u,I,0,2.5,3.0,1.25,1.9,{frame:'#2a201a',inside:'#e8d8b0',glow:'255,214,140',glowA:0.35,shelf:'#7a5a3a',counter:'#5a4030',top:'#c8a878'});
  for(let k=0;k<3;k++){const X0=-1.5+k*1.0;BP(c,[I(X0,2.66,3.15),I(X0+0.96,2.66,3.15),I(X0+0.96,2.66,2.5),I(X0,2.66,2.5)],'#2a3a6a');TH.ell(c,...I(X0+0.48,2.68,2.82),u*0.13,u*0.13,'#f0e8d0');}TH.ln(c,I(-1.55,2.68,3.17),I(1.55,2.68,3.17),'#2a201a',u*0.1);
  HIP(c,I,-4.9,4.9,-3.0,3.0,3.6,1.8,0.55,slate,slateD,u,7);TH.ln(c,I(-1.6,0,5.4),I(1.6,0,5.4),'#1f242e',u*0.26);
  GSSIGN(c,I,u,5.8,3.8,3.5,'#2a3a6a','#f6eed6','#c8a040','round','#3a2a1c');GSMAP(c,I,u,-5.7,3.7,'#3a2a1c','#f1e4c8','map');
  GSSTR2_(c,I,u,[[-2.6,5.6,'#2a3a6a'],[-0.8,6.2,'#c8402a'],[2.4,5.8,'#8aa84e',-1]]);}};

/* ---- ROME / GREECE: an ancient forum office (stucco walls and pilasters around a deep service window, a low hip roof) ---- */
function DOMUSG_(c,x,y,u,v,P){const I=GI(x,y,u);RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'44,36,24');
  const a1=I(-7.2,2.4,0);RJAR_(c,a1[0],a1[1],u*1.1,P.jar,1.6);const a2=I(-7.6,3.4,0);RJAR_(c,a2[0],a2[1],u*1.0,P.jar2,1.3);
  P.tree(c,I(-7.6,0.2,0)[0],I(-7.6,0.2,0)[1],u,u*P.treeH);
  const hb=I(5.8,-1.8,0);TH.blob(c,hb[0],hb[1]-u*0.5,u*0.9,u*0.55,'#4f8a45',RRNG_(5),8);
  JBOX(c,x,y,u,-4.6,4.6,-2.8,2.8,0,0.35,P.step);JBOX(c,x,y,u,-4.3,4.3,-2.55,2.55,0.35,0.7,P.step2);
  JBOX(c,x,y,u,-4.0,4.0,-2.35,2.35,0.7,3.9,P.wall);
  BP(c,RFRONT(c,I,2.35,-4.0,4.0,0.7,1.4),P.dado);BP(c,RIGHTF(c,I,4.0,-2.35,2.35,0.7,1.4),shade(P.dado,-0.25));TH.ln(c,I(-4.0,2.38,1.4),I(4.0,2.38,1.4),P.trim,u*0.1);
  BP(c,RFRONT(c,I,2.35,-4.0,4.0,3.4,3.9),P.band);for(let k=0;k<11;k++)BP(c,RFRONT(c,I,2.36,-3.8+k*0.72,-3.8+k*0.72+0.32,3.5,3.8),P.band2);
  [-4.0,-2.0,2.0,4.0].forEach(X=>{JBOX(c,x,y,u,X-0.2,X+0.2,2.15,2.55,0.7,3.9,P.trim);});
  [-3.0,3.0].forEach(X=>RRSLIT_(c,I,2.35,X,2.3,0.7,1.1,P.glass,P.trim));BP(c,RIGHTF(c,I,4.02,-0.5,0.5,2.0,3.0),P.glass,P.trim,u*0.1);TH.ln(c,I(4.04,0,2.0),I(4.04,0,3.0),P.trim,u*0.05);
  GSWIN(c,x,y,u,I,0,2.35,3.0,1.35,1.7,{frame:P.trim,inside:'#3a2c22',counter:P.counter,top:P.trim});
  HIP(c,I,-4.6,4.6,-3.0,3.0,3.9,1.5,0.3,P.roof,P.roofD,u,6);
  GSSIGN(c,I,u,5.8,3.8,3.5,P.sbg,P.sfg,P.srim,'round',P.spost);GSMAP(c,I,u,-5.7,3.7,P.mframe,P.mpaper,'map');
  GSSTR2_(c,I,u,[[-2.6,5.6,P.s1],[-0.8,6.2,P.s2],[2.4,5.8,P.s3,-1]]);}
GUEST_ART.rome={dy:0.05,k:1.15,draw(c,x,y,u,v){DOMUSG_(c,x,y,u,v,{step:'#d9d2c0',step2:'#e6e0d0',wall:'#e9d3a0',dado:'#a8352a',trim:'#f5efe0',band:'#f0e4c4',band2:'#c9a36a',glass:'#3a2c22',roof:'#c0552f',roofD:'#8e3a1e',counter:'#c9b79a',jar:'#b4542a',jar2:'#8f3d1e',tree:RCYPRESS_,treeH:4.6,sbg:'#a8352a',sfg:'#f5efe0',srim:'#c9a36a',spost:'#6a5a40',mframe:'#7a4a28',mpaper:'#f0e4c4',s1:'#a8352a',s2:'#c9a36a',s3:'#4a7a5a'});}};
GUEST_ART.greece={dy:0.05,k:1.15,draw(c,x,y,u,v){DOMUSG_(c,x,y,u,v,{step:'#e4e8ee',step2:'#f0f3f7',wall:'#fbfbf8',dado:'#6aa6d6',trim:'#ffffff',band:'#eef3f8',band2:'#2f78c4',glass:'#2d4a6a',roof:'#f3f5f8',roofD:'#d3dae4',counter:'#dfe6ee',jar:'#ece3d0',jar2:'#c9a36a',tree:ROLIVE_,treeH:3.6,sbg:'#2f78c4',sfg:'#ffffff',srim:'#e6e0d0',spost:'#cfd8e2',mframe:'#1c5296',mpaper:'#f3f5f8',s1:'#2f78c4',s2:'#e6e0d0',s3:'#6aa6d6'});}};

/* ---- JURASSIC ISLAND: a bamboo-and-timber visitor bungalow (a slatted service window under a bamboo awning, a deep green hip roof, palms and ferns) ---- */
GUEST_ART.jurassic={dy:0.05,k:1.15,draw(c,x,y,u,v){const I=GI(x,y,u),wood='#b98a56',woodD='#5e3a1e',roof='#2f7a45',amber='#f2a62c',rn=RRNG_(61+(v|0));RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'20,40,16');
  RPALM_(c,I(-7.4,-0.6,0)[0],I(-7.4,-0.6,0)[1],u,u*4.6,-0.4,['#3f9a3c','#2d7a2c']);RPALM_(c,I(7.9,-1.2,0)[0],I(7.9,-1.2,0)[1],u,u*4.8,0.5,['#3f9a3c','#2d7a2c']);
  [[-7.0,4.0],[7.2,5.6],[-5.4,5.8]].forEach(([X,Y])=>{const p=I(X,Y,0);TH.ell(c,p[0],p[1],u*1.0,u*0.34,'rgba(20,40,16,.22)');for(let k=0;k<9;k++){const a=-Math.PI+k/8*Math.PI;c.strokeStyle=k%2?'#3f9a3c':'#5fb84a';c.lineWidth=u*0.2;c.lineCap='round';c.beginPath();c.moveTo(p[0],p[1]);c.quadraticCurveTo(p[0]+Math.cos(a)*u*0.9,p[1]-u*1.3,p[0]+Math.cos(a)*u*1.5,p[1]-u*0.3+Math.sin(a)*u*0.2);c.stroke();}});
  JBOX(c,x,y,u,-4.6,4.6,-2.7,2.7,0,0.6,'#8f8a78');for(let k=0;k<9;k++)TH.ln(c,I(-4.4+k*1.1,2.72,0),I(-4.4+k*1.1,2.72,0.6),'rgba(40,40,30,.3)',u*0.05);
  JBOX(c,x,y,u,-4.2,4.2,-2.5,2.5,0.6,3.6,wood);for(let k=0;k<17;k++)TH.ln(c,I(-4.1+k*0.5,2.51,0.6),I(-4.1+k*0.5,2.51,3.6),'rgba(70,40,14,.3)',u*0.05);for(let k=0;k<10;k++)TH.ln(c,I(4.21,-2.4+k*0.5,0.6),I(4.21,-2.4+k*0.5,3.6),'rgba(60,34,12,.35)',u*0.05);
  [-4.2,-2.0,2.0,4.2].forEach(X=>RPOST(c,I,X,2.56,0.6,3.6,woodD,u,0.3));TH.ln(c,I(-4.2,2.56,3.5),I(4.2,2.56,3.5),woodD,u*0.26);
  RRLOUVER(c,I,2.52,-3.6,-2.4,1.6,2.8,5,'#c9a066','#2a1a10');RRLOUVER(c,I,2.52,2.4,3.6,1.6,2.8,5,'#c9a066','#2a1a10');RRSIDEWIN(c,I,4.22,0,2.3,1.2,1.1,'#5aa9b8',woodD);
  GSWIN(c,x,y,u,I,0,2.5,3.0,1.25,1.8,{frame:woodD,inside:'#4a2e18',glow:'255,190,90',shelf:'#6a4a2a',counter:'#7a5a36',top:'#c9a066'});
  /* bamboo-slat awning over the window */
  const aA=I(-2.0,2.52,3.3),aB=I(2.0,2.52,3.3),aC=I(2.0,3.5,2.95),aD=I(-2.0,3.5,2.95);BP(c,[aA,aB,aC,aD],'#c9a066');for(let k=0;k<12;k++){const t=k/11;TH.ln(c,[aD[0]+(aC[0]-aD[0])*t,aD[1]+(aC[1]-aD[1])*t],[aA[0]+(aB[0]-aA[0])*t,aA[1]+(aB[1]-aA[1])*t],k%2?'#9a7a46':'#dcb878',u*0.1);}TH.ln(c,aD,aC,woodD,u*0.12);
  HIP(c,I,-4.4,4.4,-2.8,2.8,3.6,2.0,0.75,roof,'#1d5530',u,9);
  TH.ln(c,I(-5.15,3.45,3.6),I(5.15,3.45,3.6),woodD,u*0.18);TH.ln(c,I(5.15,3.45,3.6),I(5.15,-3.45,3.6),'#3e2412',u*0.16);
  TH.ln(c,I(-1.8,0,5.62),I(1.8,0,5.62),'#1a4a2a',u*0.3);TH.ln(c,I(-1.8,0,5.7),I(1.8,0,5.7),'#4aa05c',u*0.1);
  for(let k=0;k<10;k++){const X=-4.1+k*0.9;TH.ln(c,I(X,2.9,3.6),I(X,3.4,3.45),woodD,u*0.1);}
  GSSIGN(c,I,u,5.8,3.8,3.5,'#5e3a1e','#f2a62c','#c9a066','shield','#3e2412');GSMAP(c,I,u,-5.7,3.7,'#5e3a1e','#e8d8a8','map',{g:'#6fbf5a'});
  GSSTR2_(c,I,u,[[-2.6,5.6,'#2f7a45'],[-0.8,6.2,'#f2a62c'],[2.4,5.8,'#4aa0d8',-1]]);}};

/* ---- GALACTIC OUTPOST: an adobe comms-and-info pod (a glowing teal service window, a flat bronze roof slab with a dome, a holo-map board, a rock spire beside it) ---- */
GUEST_ART.galactic={dy:0.05,k:1.15,draw(c,x,y,u,v){const I=GI(x,y,u),tan='#d9bf8a',tanD='#bfa270',rn=RRNG_(77+(v|0));RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'60,40,16');
  {const bx=x+u*6.0,by=y-u*0.2,P=[[-1.2,0.4],[-1.3,-1.6],[-0.8,-2.8],[-0.5,-4.2],[0.1,-5.0],[0.5,-3.6],[1.0,-2.6],[1.3,-1.0],[1.0,0.4]],poly=P.map(p=>[bx+p[0]*u,by+p[1]*u]);c.save();c.beginPath();poly.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.clip();const g=c.createLinearGradient(bx-u*1.3,0,bx+u*1.4,0);g.addColorStop(0,'#aab2c0');g.addColorStop(0.5,'#7f8aa0');g.addColorStop(1,'#4c566c');c.fillStyle=g;c.fillRect(bx-u*2,by-u*6,u*4,u*7);c.strokeStyle='rgba(30,38,56,.55)';c.lineWidth=u*0.06;[[-1.0,-1.0,0.4,-1.8],[-0.4,-3.0,0.5,-3.8]].forEach(l=>{c.beginPath();c.moveTo(bx+l[0]*u,by+l[1]*u);c.lineTo(bx+l[2]*u,by+l[3]*u);c.stroke();});c.restore();TH.blob(c,bx-u*0.4,by-u*1.4,u*0.4,u*0.26,'#5a8a4a',rn,7);}
  JBOX(c,x,y,u,-4.5,4.5,-2.7,2.7,0,0.35,'#a89878');
  JBOX(c,x,y,u,-4.2,4.2,-2.5,2.5,0.35,3.6,tan);
  BP(c,RFRONT(c,I,2.5,-4.2,4.2,0.9,1.25),'#9a3a2a');BP(c,RIGHTF(c,I,4.2,-2.5,2.5,0.9,1.25),'#6e2a20');
  BP(c,RFRONT(c,I,2.5,-4.2,4.2,3.1,3.6),'#3a3a34');for(let k=0;k<17;k++)BP(c,RFRONT(c,I,2.51,-4.05+k*0.48,-4.05+k*0.48+0.2,3.22,3.48),'#8a8062');BP(c,RIGHTF(c,I,4.2,-2.5,2.5,3.1,3.6),'#2a2a26');
  [-3.1,3.1].forEach(X=>RRSLIT_(c,I,2.5,X,2.0,0.6,1.0,'#2a1a10','#8a8062'));BP(c,RIGHTF(c,I,4.22,-0.6,0.6,1.8,2.7),'#2a1a10','#8a8062',u*0.08);for(let k=-1;k<=1;k++)TH.ln(c,I(4.24,k*0.35,1.8),I(4.24,k*0.35,2.7),'#8a8062',u*0.05);
  GSWIN(c,x,y,u,I,0,2.5,3.0,1.25,1.8,{frame:'#6e625a',inside:'#10202c',glow:'110,220,255',glowA:0.55,shelf:'#4f5a4c',counter:'#5a5048',top:'#8a8062'});
  JBOX(c,x,y,u,-4.6,4.6,-2.9,2.9,3.6,4.05,'#6e625a');BT(c,I,-4.6,4.6,-2.9,2.9,4.05,'#7a6e64');TH.ln(c,I(-4.6,2.9,3.85),I(4.6,2.9,3.85),'rgba(255,230,190,.2)',u*0.06);
  const dc=I(-1.4,-0.4,4.05);EGCYL_(c,dc[0],dc[1],u*0.9,u*0.4,u*0.5,['#c8ccd4','#9aa0aa','#5a6070']);const dm=c.createRadialGradient(dc[0]-u*0.3,dc[1]-u*1.0,u*0.1,dc[0],dc[1]-u*0.6,u*1.0);dm.addColorStop(0,'#f0f2f6');dm.addColorStop(1,'#8a92a0');c.fillStyle=dm;c.beginPath();c.ellipse(dc[0],dc[1]-u*0.5,u*0.8,u*0.34,0,Math.PI,0,true);c.bezierCurveTo(dc[0]+u*0.8,dc[1]-u*1.3,dc[0]+u*0.3,dc[1]-u*1.6,dc[0],dc[1]-u*1.6);c.bezierCurveTo(dc[0]-u*0.3,dc[1]-u*1.6,dc[0]-u*0.8,dc[1]-u*1.3,dc[0]-u*0.8,dc[1]-u*0.5);c.fill();
  GSSIGN(c,I,u,5.8,3.8,3.5,'#1c1f33','#6ad8ff','#8a8062','arch','#4a5058');GSMAP(c,I,u,-5.7,3.7,'#4f5a4c','#1c2a3a','map',{g:'#2f8a6a',w:'#2a6ab0',t:'#8a6a3a',p:'#6ad8ff',d:'#ff6a3a',y:'#ffcf5a'});
  GSSTR2_(c,I,u,[[-2.6,5.6,'#6ad8ff'],[-0.8,6.2,'#c8a040'],[2.4,5.8,'#d96a3a',-1]]);}};

/* ---- EGYPT: a scribe's office (mud-brick walls, palm-log beam ends, a striped canvas awning over the counter, a little dome on one corner) ---- */
GUEST_ART.egypt={dy:0.05,k:1.15,draw(c,x,y,u,v){const I=GI(x,y,u),mud='#d9b97a',mudD='#b8955a',rn=RRNG_(91+(v|0));RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'60,44,20');
  RPALM_(c,I(-6.8,-1.0,0)[0],I(-6.8,-1.0,0)[1],u,u*4.6,-0.5,['#5fa040','#3f8030']);
  [[5.8,-1.4]].forEach(([X,Y])=>{const p=I(X+0.8,Y-0.4,0);for(let k=0;k<5;k++)TH.ln(c,[p[0]+(k-2)*u*0.12,p[1]],[p[0]+(k-2)*u*0.45,p[1]-u*1.8-(k%2)*u*0.5],'#5ea04a',u*0.12);TH.ell(c,p[0],p[1]-u*0.05,u*0.5,u*0.18,'#3f8030');});
  JBOX(c,x,y,u,-4.3,4.3,-2.7,2.7,0,3.7,mud);for(let k=0;k<7;k++)TH.ln(c,I(-4.1+k*1.3,2.71,0.2),I(-4.1+k*1.3,2.71,3.5),'rgba(90,56,20,.14)',u*0.05);
  for(let z=0.5;z<3.6;z+=0.6)TH.ln(c,I(-4.3,2.71,z),I(4.3,2.71,z),'rgba(90,56,20,.12)',u*0.04);
  BP(c,RIGHTF(c,I,4.3,-2.7,2.7,0,3.7),'rgba(60,40,10,.2)');
  JBOX(c,x,y,u,-4.5,4.5,-2.9,2.9,3.7,4.1,'#e3c88c');
  for(let k=0;k<7;k++){const p=I(-3.9+k*1.3,2.8,3.45);TH.ell(c,p[0],p[1],u*0.2,u*0.17,'#6a4426');TH.ell(c,p[0]-u*0.04,p[1]-u*0.02,u*0.12,u*0.1,'#8a6238');}
  const dm=I(-2.6,-0.8,4.1);EGCYL_(c,dm[0],dm[1],u*1.1,u*0.5,u*0.5,['#efd9a6','#d8ba7c','#a08150']);c.fillStyle='#e3c88c';c.beginPath();c.ellipse(dm[0],dm[1]-u*0.5,u*1.1,u*0.5,0,Math.PI,0,true);c.bezierCurveTo(dm[0]+u*1.1,dm[1]-u*2.0,dm[0]+u*0.4,dm[1]-u*2.3,dm[0],dm[1]-u*2.3);c.bezierCurveTo(dm[0]-u*0.4,dm[1]-u*2.3,dm[0]-u*1.1,dm[1]-u*2.0,dm[0]-u*1.1,dm[1]-u*0.5);c.fill();TH.ell(c,dm[0]+u*0.1,dm[1]-u*1.2,u*0.35,u*0.55,'rgba(255,255,255,.15)');
  [-3.1,3.1].forEach(X=>RRSLIT_(c,I,2.7,X,2.3,0.7,1.0,'#2a1a10','#e8d4a0'));BP(c,RIGHTF(c,I,4.32,-0.5,0.5,2.0,3.0),'#2a1a10','#e8d4a0',u*0.08);
  GSWIN(c,x,y,u,I,0,2.7,3.0,1.2,1.55,{frame:'#e8d4a0',inside:'#2a1a10',glow:'255,190,100',shelf:'#8a6a46',counter:'#c4a064',top:'#e8d4a0'});
  /* striped canvas awning over the counter, on two poles */
  const A=I(-2.6,2.72,3.55),B=I(2.6,2.72,3.55),C2=I(2.6,4.0,3.05),D=I(-2.6,4.0,3.05);RSTRIPE(c,A,B,C2,D,9,'#f4e8cc','#c4562a');for(let k=0;k<9;k++){const a=I(-2.6+k*0.578,4.0,3.05),b=I(-2.6+(k+1)*0.578,4.0,3.05);TH.poly(c,[a,b,[(a[0]+b[0])/2,(a[1]+b[1])/2+u*0.3]],k%2?'#f4e8cc':'#c4562a');}
  [-2.6,2.6].forEach(X=>RPOST(c,I,X,3.9,0,3.05,'#6a4426',u,0.22));
  GSSIGN(c,I,u,5.8,3.8,3.5,'#1f5fae','#f4e8cc','#c4562a','round','#6a4426');GSMAP(c,I,u,-5.7,3.7,'#6a4426','#e8d8a8','map');
  GSSTR2_(c,I,u,[[-2.6,6.0,'#c4562a'],[-0.8,6.6,'#1f5fae'],[2.4,6.2,'#e8d4a0',-1]]);}};

/* ---- BABYLON: a gate-clerk's house (blue glazed-tile bands with gold rosettes, a stepped battlement roof, a glazed window frame, date palms and planters) ---- */
GUEST_ART.babylon={dy:0.05,k:1.15,draw(c,x,y,u,v){const I=GI(x,y,u),mud='#d4b274',mudD='#b8955a',blue='#1f5fb4',blueD='#143f82',gold='#e6b43c',rn=RRNG_(77+(v|0));RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'50,36,18');
  [[-7.2,1.6,'#4f9a3c'],[-7.8,-0.4,'#62ae48']].forEach(([X,Y,col])=>{const p=I(X,Y,0);RJAR_(c,p[0],p[1],u*1.0,'#b0653a',1.0);TH.blob(c,p[0],p[1]-u*1.35,u*0.8,u*0.5,col,rn,8);});
  RPALM_(c,I(-7.8,0.2,0)[0],I(-7.8,0.2,0)[1],u,u*4.6,-0.5);RPALM_(c,I(6.8,-1.4,0)[0],I(6.8,-1.4,0)[1],u,u*4.2,0.5);
  JBOX(c,x,y,u,-4.3,4.3,-2.7,2.7,0,3.6,mud);RRBRICK_(c,I,-4.3,4.3,2.7,0,3.6,'rgba(80,50,20,.22)',u);BP(c,RIGHTF(c,I,4.3,-2.7,2.7,0,3.6),'rgba(60,40,10,.22)');
  BP(c,RFRONT(c,I,2.7,-4.3,4.3,2.7,3.3),blue);for(let k=0;k<14;k++)BP(c,RFRONT(c,I,2.71,-4.1+k*0.6,-4.1+k*0.6+0.3,2.8,3.2),gold);BP(c,RIGHTF(c,I,4.3,-2.7,2.7,2.7,3.3),blueD);
  BP(c,RFRONT(c,I,2.7,-4.3,4.3,0,0.4),blue);BP(c,RIGHTF(c,I,4.3,-2.7,2.7,0,0.4),blueD);
  JBOX(c,x,y,u,-4.5,4.5,-2.9,2.9,3.6,3.85,'#c9a36a');for(let k=0;k<8;k++){const X=-4.3+k*1.2;JBOX(c,x,y,u,X,X+0.6,2.5,2.9,3.85,4.4,mudD);}for(let k=0;k<5;k++){const Y=-2.5+k*1.1;JBOX(c,x,y,u,4.1,4.5,Y,Y+0.55,3.85,4.4,mudD);}
  [-3.2,3.2].forEach(X=>RRSLIT_(c,I,2.7,X,1.7,0.7,0.9,'#2a1a10',blue));BP(c,RIGHTF(c,I,4.32,-0.5,0.5,1.6,2.4),'#2a1a10',blue,u*0.08);
  GSWIN(c,x,y,u,I,0,2.7,3.0,1.1,1.4,{frame:blue,inside:'#3a2214',glow:'255,190,100',shelf:'#8a6a46',counter:'#c9a36a',top:'#e8d4a0'});
  GSSIGN(c,I,u,5.8,3.8,3.5,'#143f82','#f2d36a','#e6b43c','round','#5a3a1e');GSMAP(c,I,u,-5.7,3.7,'#143f82','#efe0b8','map');
  GSSTR2_(c,I,u,[[-2.6,5.6,'#1f5fb4'],[-0.8,6.2,'#e6b43c'],[2.4,5.8,'#b0653a',-1]]);}};


const GS_U=0.0975;
const GS_DX={"china":0.035,"japan":0.07,"rome":0.045,"greece":0.045,"jurassic":0.03,"galactic":0.035,"egypt":0.035,"babylon":-0.005}
;   /* horizontal nudge (in R) that centres each building on the hex, filled in after measuring */
const GS_ALIAS={chinese:'china',japanese:'japan',roman:'rome','ancient_rome':'rome',greek:'greece','ancient_greece':'greece',jurassic_island:'jurassic',jurassic_park:'jurassic',galactic_outpost:'galactic',galaxy:'galactic',egyptian:'egypt','ancient_egypt':'egypt',babylonian:'babylon','ancient_babylon':'babylon'};
function guestServicesTheme(t){t=String(t||'china').toLowerCase();return GS_ALIAS[t]||t;}
/* drawGuestServices(ctx, cx, cy, R, {theme, flip, scale, dy, dx, accent}): (cx,cy) = centre of the hex tile, R = hex radius in px. Static, one hex, no ground. */
function drawGuestServices(ctx,cx,cy,R,opts){opts=opts||{};const th=guestServicesTheme(opts.theme),T=GUEST_ART[th];if(!T)throw new Error('unknown guest services theme: '+opts.theme);
  const S=opts.scale||1,u=R*GS_U*S*(T.k||1),dy=(opts.dy===undefined?T.dy:opts.dy)*R;ctx.save();if(opts.flip){ctx.translate(cx,0);ctx.scale(-1,1);ctx.translate(-cx,0);}T.draw(ctx,cx+(opts.dx===undefined?(GS_DX[th]||0):opts.dx)*R,cy+dy,u,opts.v===undefined?0:opts.v,opts.accent);ctx.restore();}
const GS_BAKE_CACHE={};
/* bakeGuestServices(theme, R, {scale, flip, pixelRatio, accent}) -> {canvas, ox, oy, w, h, bbox}: a transparent sprite cropped to its painted pixels; (ox,oy) = where the hex centre sits inside the canvas */
function bakeGuestServices(theme,R,opts){opts=opts||{};const th=guestServicesTheme(theme),pr=opts.pixelRatio||1,S=opts.scale||1,key=[th,R,S,!!opts.flip,pr,opts.accent||''].join('|');if(GS_BAKE_CACHE[key])return GS_BAKE_CACHE[key];
  const W=Math.ceil(R*4.2*pr),H=Math.ceil(R*5.0*pr),ax=W/2,ay=H*0.76,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');c.scale(pr,pr);drawGuestServices(c,ax/pr,ay/pr,R,{theme:th,scale:S,flip:opts.flip,accent:opts.accent});
  const d=cv.getContext('2d').getImageData(0,0,W,H).data;let x0=W,y0=H,x1=0,y1=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(d[(y*W+x)*4+3]>8){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}}
  const pad=2,bx=Math.max(0,x0-pad),by=Math.max(0,y0-pad),bw=Math.min(W,x1+pad+1)-bx,bh=Math.min(H,y1+pad+1)-by,out=document.createElement('canvas');out.width=bw;out.height=bh;out.getContext('2d').drawImage(cv,bx,by,bw,bh,0,0,bw,bh);
  return GS_BAKE_CACHE[key]={canvas:out,ox:(ax-bx)/pr,oy:(ay-by)/pr,w:bw/pr,h:bh/pr,pixelRatio:pr,bbox:{left:-(ax-bx)/pr,top:-(ay-by)/pr,right:(bx+bw-ax)/pr,bottom:(by+bh-ay)/pr}};}
function drawGuestServicesBaked(ctx,cx,cy,sprite){ctx.drawImage(sprite.canvas,cx-sprite.ox,cy-sprite.oy,sprite.w,sprite.h);}
function guestServicesFootprint(R,theme,opts){return bakeGuestServices(theme,R,opts).bbox;}


NEW_SPRITE_PACKS.facilities.guest_services = { bake: bakeGuestServices, drawBaked: drawGuestServicesBaked };
})();

(function () {


/* ===== core (shared by every pack) ===== */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shade(hex, amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=c=>Math.round(amt<0?c*(1+amt):c+(255-c)*amt);return `rgb(${f(r)},${f(g)},${f(b)})`;}
const TH={
  ln(ctx,a,b,c,w){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();},
  ell(ctx,x,y,rx,ry,c,rot){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot||0,0,7);ctx.fill();},
  poly(ctx,pts,fill,stroke,lw){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||1;ctx.stroke();}},
  iso(x,y,u,X,Y,Z){return[x+(X-Y)*0.7*u,y+(X+Y)*0.35*u-Z*u];},
  box(ctx,x,y,u,x0,x1,y0,y1,z0,z1,cf,ce,ct){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);
    TH.poly(ctx,[I(x0,y1,z0),I(x1,y1,z0),I(x1,y1,z1),I(x0,y1,z1)],cf);TH.poly(ctx,[I(x1,y0,z0),I(x1,y1,z0),I(x1,y1,z1),I(x1,y0,z1)],ce);
    TH.poly(ctx,[I(x0,y0,z1),I(x1,y0,z1),I(x1,y1,z1),I(x0,y1,z1)],ct);},
  blob(ctx,x,y,rx,ry,col,rnd,n){const pts=[];n=n||8;for(let k=0;k<n;k++){const a=k/n*6.283,rr=0.78+rnd()*0.3;pts.push([x+Math.cos(a)*rx*rr,y+Math.sin(a)*ry*rr]);}
    TH.poly(ctx,pts,col);ctx.fillStyle='rgba(255,255,255,.14)';ctx.beginPath();ctx.ellipse(x-rx*0.25,y-ry*0.3,rx*0.45,ry*0.35,0,0,7);ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x+rx*0.35,y+ry*0.25,rx*0.4,ry*0.5,0,0,7);ctx.fill();},
  /* pointed (lancet) arch outline in the X-Z plane at depth Y, centred on xc, half-width w */
  arch(x,y,u,Y,xc,w,z0,zs,zt){const I=(X,Z)=>TH.iso(x,y,u,X,Y,Z),L=[],Rr=[];for(let t=0;t<=8;t++){const s=t/8,q=1-s,
      X=q*q*(xc-w)+2*q*s*(xc-w*0.85)+s*s*xc,Z=q*q*zs+2*q*s*(zs+(zt-zs)*0.85)+s*s*zt;L.push(I(X,Z));Rr.push(I(2*xc-X,Z));}
    return [I(xc-w,z0)].concat(L,Rr.slice().reverse(),[I(xc+w,z0)]);}
};


const JS=(c,x,y,rx)=>{c.fillStyle='rgba(12,40,22,.28)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const JBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.28),shade(col,0.16));
const MIR=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
const BP=(c,pts,fill,stroke,lw)=>TH.poly(c,pts,fill,stroke,lw);
const BF=(c,I,x0,x1,y1,z0,z1,col)=>BP(c,[I(x0,y1,z0),I(x1,y1,z0),I(x1,y1,z1),I(x0,y1,z1)],col);
const BR=(c,I,x1,y0,y1,z0,z1,col)=>BP(c,[I(x1,y0,z0),I(x1,y1,z0),I(x1,y1,z1),I(x1,y0,z1)],col);
const BT=(c,I,x0,x1,y0,y1,z,col)=>BP(c,[I(x0,y0,z),I(x1,y0,z),I(x1,y1,z),I(x0,y1,z)],col);
const WF=(c,I,y1,X,Z,w,h,col,fr)=>BP(c,[I(X-w/2,y1,Z-h/2),I(X+w/2,y1,Z-h/2),I(X+w/2,y1,Z+h/2),I(X-w/2,y1,Z+h/2)],col,fr,fr?0.9:0);
const WR=(c,I,x1,Y,Z,w,h,col,fr)=>BP(c,[I(x1,Y-w/2,Z-h/2),I(x1,Y+w/2,Z-h/2),I(x1,Y+w/2,Z+h/2),I(x1,Y-w/2,Z+h/2)],col,fr,fr?0.9:0);
const BFL=(c,I,x0,x1,y1,z0,z1,step,col,u)=>{for(let z=z0+step;z<z1-0.01;z+=step)TH.ln(c,I(x0,y1,z),I(x1,y1,z),col,u*0.05);};
const BRL=(c,I,x1,y0,y1,z0,z1,step,col,u)=>{for(let z=z0+step;z<z1-0.01;z+=step)TH.ln(c,I(x1,y0,z),I(x1,y1,z),col,u*0.05);};
function HIP(c,I,x0,x1,y0,y1,z,H,o,cf,cr,u,tex){const yc=(y0+y1)/2,xr0=x0+(y1-y0)/2,xr1=x1-(y1-y0)/2,A=I(x0-o,y1+o,z),B=I(x1+o,y1+o,z),R1=I(xr1,yc,z+H),R0=I(xr0,yc,z+H),C=I(x1+o,y0-o,z);
  BP(c,[B,C,R1],cr);BP(c,[A,B,R1,R0],cf);
  if(tex){for(let k=1;k<=tex;k++){const t=k/(tex+1),L=[A[0]+(R0[0]-A[0])*t,A[1]+(R0[1]-A[1])*t],Rr=[B[0]+(R1[0]-B[0])*t,B[1]+(R1[1]-B[1])*t];TH.ln(c,L,Rr,'rgba(0,0,0,.16)',u*0.07);TH.ln(c,[L[0],L[1]-u*0.07],[Rr[0],Rr[1]-u*0.07],'rgba(255,255,255,.14)',u*0.05);}}
  TH.ln(c,R0,R1,shade(cf,-0.3),u*0.16);}
function GAB(c,I,x0,x1,y0,y1,z,H,o,cf,cg,u,tex){const yc=(y0+y1)/2,A=I(x0-o,y1+o,z),B=I(x1+o,y1+o,z),R1=I(x1+o,yc,z+H),R0=I(x0-o,yc,z+H);
  BP(c,[I(x1,y0,z),I(x1,y1,z),I(x1,yc,z+H*0.86)],cg);BP(c,[A,B,R1,R0],cf);
  if(tex){for(let k=1;k<=tex;k++){const t=k/(tex+1),L=[A[0]+(R0[0]-A[0])*t,A[1]+(R0[1]-A[1])*t],Rr=[B[0]+(R1[0]-B[0])*t,B[1]+(R1[1]-B[1])*t];TH.ln(c,L,Rr,'rgba(0,0,0,.16)',u*0.07);TH.ln(c,[L[0],L[1]-u*0.07],[Rr[0],Rr[1]-u*0.07],'rgba(255,255,255,.14)',u*0.05);}}
  TH.ln(c,R0,R1,shade(cf,-0.3),u*0.16);TH.ln(c,A,B,shade(cf,-0.25),u*0.1);}
const GLOW=(c,x,y,r,rgb,a)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();};
function RCYL(c,x,y,rx,ry,wh,cols){cols=cols||['#ffffff','#e9eef3','#a9b6c6'];const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,cols[0]);g.addColorStop(0.5,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y-wh);c.lineTo(x-rx,y);c.ellipse(x,y,rx,ry,0,Math.PI,0,true);c.lineTo(x+rx,y-wh);c.ellipse(x,y-wh,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();}
function RGLASS(c,pts,alpha){const ys=pts.map(p=>p[1]),g=c.createLinearGradient(0,Math.min(...ys),0,Math.max(...ys));g.addColorStop(0,RW.glass[0]);g.addColorStop(0.5,RW.glass[1]);g.addColorStop(1,RW.glass[2]);c.save();c.globalAlpha=alpha||1;c.fillStyle=g;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();c.restore();}
function RSPHERE(c,x,y,r,cols){const g=c.createRadialGradient(x-r*0.35,y-r*0.4,r*0.1,x,y,r*1.05);g.addColorStop(0,cols[0]);g.addColorStop(0.55,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();}
function ACONE(c,x,y,rx,ry,h,col,u,scal){const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,shade(col,0.18));g.addColorStop(0.5,col);g.addColorStop(1,shade(col,-0.3));c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y);c.lineTo(x,y-h);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();
  if(scal){for(let k=0;k<scal;k++){const a0=Math.PI*k/scal,a1=Math.PI*(k+1)/scal;c.fillStyle=k%2?'#fbf6e8':shade(col,-0.1);c.beginPath();c.moveTo(x+Math.cos(a0)*rx,y+Math.sin(a0)*ry);c.lineTo(x+Math.cos((a0+a1)/2)*rx,y+Math.sin((a0+a1)/2)*ry+u*0.4);c.lineTo(x+Math.cos(a1)*rx,y+Math.sin(a1)*ry);c.closePath();c.fill();}}
  c.save();c.beginPath();c.moveTo(x-rx,y);c.lineTo(x,y-h);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.clip();for(let k=0;k<=14;k++){const a=Math.PI*k/14;TH.ln(c,[x,y-h],[x+Math.cos(a)*rx,y+Math.sin(a)*ry],'rgba(0,0,0,.12)',u*0.05);}c.restore();}
function AWN(c,I,X0,X1,y1,zTop,zBot,dY,col,u){const n=Math.max(4,Math.round((X1-X0)/0.5));for(let k=0;k<n;k++){const a=X0+(X1-X0)*k/n,b=X0+(X1-X0)*(k+1)/n,cc=k%2?col[1]:col[0];BP(c,[I(a,y1,zTop),I(b,y1,zTop),I(b,y1+dY,zBot),I(a,y1+dY,zBot)],cc);const p=I(a,y1+dY,zBot),q=I(b,y1+dY,zBot);BP(c,[p,q,[(p[0]+q[0])/2,(p[1]+q[1])/2+u*0.42]],cc);}}
const RW={w:'#f4f6f8',ws:'#b9c4d1',wl:'#ffffff',teal:'#2fb8c4',tealD:'#1f8a96',org:'#ff7a3c',yel:'#ffd23c',navy:'#2a3a52',leaf:['#8fd05a','#6ab83c','#4a9a30'],glass:['#cdeef8','#8ccfe4','#4f9fc0']};
/* ===== (shared helpers) 1. Each draw(c, x, y, u, v): (x,y) = ground centre of the hex, u = 0.075*R, v = variant seed. Static, one hex, no ground. ===== */
const RSH_=(c,x,y,rx,ry,rgb)=>{c.fillStyle='rgba('+(rgb||'40,30,18')+',.24)';c.beginPath();c.ellipse(x+rx*0.1,y+ry*0.2,rx*0.88,(ry||rx*0.4)*0.9,0,0,7);c.fill();};
const RPOST=(c,I,X,Y,z0,z1,col,u,w)=>TH.ln(c,I(X,Y,z0),I(X,Y,z1),col,u*(w||0.22));
const RCLIP=(c,pts,fn)=>{c.save();c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.clip();fn();c.restore();};
const RFRONT=(c,I,y1,x0,x1,z0,z1)=>[I(x0,y1,z0),I(x1,y1,z0),I(x1,y1,z1),I(x0,y1,z1)];
const RIGHTF=(c,I,x1,y0,y1,z0,z1)=>[I(x1,y0,z0),I(x1,y1,z0),I(x1,y1,z1),I(x1,y0,z1)];
const RBARREL=(c,x,y,u,col)=>{TH.ell(c,x,y,u*0.55,u*0.22,'rgba(0,0,0,.2)');const g=c.createLinearGradient(x-u*0.5,0,x+u*0.5,0);g.addColorStop(0,shade(col||'#9a6a3a',0.2));g.addColorStop(0.6,col||'#9a6a3a');g.addColorStop(1,shade(col||'#9a6a3a',-0.35));c.fillStyle=g;c.beginPath();c.moveTo(x-u*0.42,y);c.quadraticCurveTo(x-u*0.62,y-u*0.55,x-u*0.42,y-u*1.1);c.lineTo(x+u*0.42,y-u*1.1);c.quadraticCurveTo(x+u*0.62,y-u*0.55,x+u*0.42,y);c.closePath();c.fill();TH.ell(c,x,y-u*1.1,u*0.42,u*0.17,shade(col||'#9a6a3a',0.22));TH.ln(c,[x-u*0.55,y-u*0.35],[x+u*0.55,y-u*0.35],'#3a2a1a',u*0.09);TH.ln(c,[x-u*0.55,y-u*0.75],[x+u*0.55,y-u*0.75],'#3a2a1a',u*0.09);};
const RLANTERN=(c,x,y,u,rgb)=>{GLOW(c,x,y,u*1.3,rgb||'255,200,90',0.5);TH.ln(c,[x,y-u*0.5],[x,y-u*0.15],'#2a2018',u*0.08);TH.poly(c,[[x-u*0.18,y-u*0.15],[x+u*0.18,y-u*0.15],[x+u*0.14,y+u*0.32],[x-u*0.14,y+u*0.32]],'#ffd36a');TH.ell(c,x,y-u*0.15,u*0.2,u*0.08,'#2a2018');};
const RWINDOW=(c,I,y1,X,Z,w,h,glow,frame)=>{BP(c,[I(X-w/2-0.08,y1,Z-h/2-0.08),I(X+w/2+0.08,y1,Z-h/2-0.08),I(X+w/2+0.08,y1,Z+h/2+0.08),I(X-w/2-0.08,y1,Z+h/2+0.08)],frame||'#f4ead2');BP(c,[I(X-w/2,y1,Z-h/2),I(X+w/2,y1,Z-h/2),I(X+w/2,y1,Z+h/2),I(X-w/2,y1,Z+h/2)],glow||'#ffd27a');};
const RTOTEM=(c,x,y,u,h,pal,v)=>{const w=u*0.72,n=Math.max(2,Math.round(h/(u*1.3)));SHDW_(c,x,y,u*0.9);for(let k=0;k<n;k++){const yy=y-k*(h/n),hh=h/n,col=pal[k%pal.length];TH.poly(c,[[x-w,yy],[x+w,yy],[x+w*0.95,yy-hh],[x-w*0.95,yy-hh]],col);TH.poly(c,[[x+w,yy],[x+w,yy-hh],[x+w*0.95,yy-hh]],'rgba(0,0,0,.28)');TH.ell(c,x-w*0.38,yy-hh*0.64,u*0.2,u*0.14,'#fff6dc');TH.ell(c,x+w*0.38,yy-hh*0.64,u*0.2,u*0.14,'#fff6dc');TH.ell(c,x-w*0.38,yy-hh*0.64,u*0.08,u*0.08,'#1a1008');TH.ell(c,x+w*0.38,yy-hh*0.64,u*0.08,u*0.08,'#1a1008');TH.poly(c,[[x-w*0.2,yy-hh*0.5],[x+w*0.2,yy-hh*0.5],[x,yy-hh*0.3]],'#2a1a10');TH.poly(c,[[x-w*0.55,yy-hh*0.22],[x+w*0.55,yy-hh*0.22],[x+w*0.4,yy-hh*0.08],[x-w*0.4,yy-hh*0.08]],'#1a1008');if(k%2===0)for(let t=-1;t<=1;t++)TH.poly(c,[[x+t*w*0.32-u*0.09,yy-hh*0.22],[x+t*w*0.32+u*0.09,yy-hh*0.22],[x+t*w*0.32,yy-hh*0.12]],'#fff6dc');}
  TH.poly(c,[[x-w*1.5,y-h],[x+w*1.5,y-h],[x+w*0.5,y-h-u*0.9],[x-w*0.5,y-h-u*0.9]],pal[0]);TH.ell(c,x,y-h-u*0.9,w*0.5,u*0.2,pal[1]);};
const SHDW_=(c,x,y,rx)=>{c.fillStyle='rgba(30,20,10,.22)';c.beginPath();c.ellipse(x+rx*0.2,y+rx*0.08,rx,rx*0.34,0,0,7);c.fill();};
const RTORCH=(c,x,y,u,h)=>{TH.ln(c,[x,y],[x,y-h],'#6a4a28',u*0.2);TH.ln(c,[x,y-h*0.7],[x,y-h*0.5],'#c8a050',u*0.2);GLOW(c,x,y-h-u*0.5,u*1.5,'255,160,50',0.5);c.fillStyle='#ff8a2a';c.beginPath();c.moveTo(x-u*0.3,y-h);c.quadraticCurveTo(x-u*0.4,y-h-u*0.9,x,y-h-u*1.5);c.quadraticCurveTo(x+u*0.4,y-h-u*0.8,x+u*0.3,y-h);c.closePath();c.fill();c.fillStyle='#ffd45a';c.beginPath();c.moveTo(x-u*0.14,y-h);c.quadraticCurveTo(x-u*0.14,y-h-u*0.6,x,y-h-u*0.95);c.quadraticCurveTo(x+u*0.14,y-h-u*0.5,x+u*0.14,y-h);c.closePath();c.fill();};
const RTHATCH=(c,pts,u,base,dark,n)=>{BP(c,pts,base);RCLIP(c,pts,()=>{const A=pts[0],B=pts[1],C2=pts[2],D=pts[3];for(let k=1;k<n;k++){const t=k/n,L=[A[0]+(D[0]-A[0])*t,A[1]+(D[1]-A[1])*t],Rr=[B[0]+(C2[0]-B[0])*t,B[1]+(C2[1]-B[1])*t];TH.ln(c,L,Rr,k%2?dark:'rgba(255,240,190,.25)',u*0.1);const m=(Rr[0]-L[0])/Math.round((Rr[0]-L[0])/(u*0.5)||1);for(let q=0;q<Math.round((Rr[0]-L[0])/(u*0.5));q++){const px=L[0]+q*m+(k%2)*m*0.5,py=L[1]+(Rr[1]-L[1])*(q*m/((Rr[0]-L[0])||1));TH.ln(c,[px,py],[px+m*0.12,py+u*0.45],dark,u*0.05);}}});};
const SOFT_=(c,x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
const RSTRIPE=(c,A,B,Cc,D,n,c1,c2)=>{BP(c,[A,B,Cc,D],c1);for(let k=0;k<n;k+=2){const t0=k/n,t1=(k+1)/n,P=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];BP(c,[P(A,B,t0),P(A,B,t1),P(D,Cc,t1),P(D,Cc,t0)],c2);}};
const RBULBS=(c,pts,u,col)=>pts.forEach(p=>{GLOW(c,p[0],p[1],u*0.6,'255,220,120',0.55);TH.ell(c,p[0],p[1],u*0.13,u*0.13,col||'#fff3c0');});
const RUMBRELLA=(c,x,y,u,c1,c2)=>{TH.ln(c,[x,y],[x,y-u*2.8],'#6a4a2a',u*0.14);const r=u*1.55,cy=y-u*2.4,ap=[x,y-u*3.5];for(let k=0;k<8;k++){const a0=Math.PI*k/8,a1=Math.PI*(k+1)/8;TH.poly(c,[ap,[x+Math.cos(a0)*r,cy+Math.sin(a0)*r*0.45],[x+Math.cos(a1)*r,cy+Math.sin(a1)*r*0.45]],k%2?c2:c1);}for(let k=0;k<8;k++){const a0=Math.PI+Math.PI*k/8,a1=Math.PI+Math.PI*(k+1)/8;TH.poly(c,[ap,[x+Math.cos(a0)*r,cy+Math.sin(a0)*r*0.45],[x+Math.cos(a1)*r,cy+Math.sin(a1)*r*0.45]],k%2?c1:c2);}};
const RTABLE=(c,x,y,u,col)=>{TH.ell(c,x,y+u*0.1,u*0.9,u*0.3,'rgba(0,0,0,.18)');TH.ln(c,[x,y],[x,y-u*0.9],'#6a4a2a',u*0.14);TH.ell(c,x,y-u*0.9,u*0.75,u*0.28,col||'#f4efe0');TH.ell(c,x-u*0.2,y-u*1.0,u*0.18,u*0.07,'#d9433b');};
function EGCYL_(c,x,y,rx,ry,h,cols){const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,cols[0]);g.addColorStop(0.55,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y);c.lineTo(x-rx,y-h);c.ellipse(x,y-h,rx,ry,0,Math.PI,0,false);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();c.fillStyle=cols[0];c.beginPath();c.ellipse(x,y-h,rx,ry,0,0,7);c.fill();}


/* front gable (ridge runs along Y): right slope + a pediment face, used for temple fronts and glazed bays */
const FGAB_=(c,I,x0,x1,y0,y1,z,H,o,roofC,faceC,trim,u)=>{const xc=(x0+x1)/2;BP(c,[I(x1+o,y1+o,z),I(x1+o,y0,z),I(xc,y0,z+H),I(xc,y1+o,z+H)],roofC);TH.ln(c,I(xc,y0,z+H),I(xc,y1+o,z+H),shade(roofC,-0.3),u*0.14);TH.ln(c,I(x1+o,y1+o,z),I(x1+o,y0,z),shade(roofC,-0.3),u*0.1);
  BP(c,[I(x0-o,y1+o,z),I(x1+o,y1+o,z),I(xc,y1+o,z+H)],faceC,trim,u*0.1);};
/* ===== shared little props for the new lands ===== */
const RRNG_=v=>mulberry(1234+(v|0));
const RPALM_=(c,x,y,u,h,lean,col)=>{col=col||['#4f9a3c','#3a7d2c'];TH.ell(c,x,y,u*0.8,u*0.28,'rgba(20,30,10,.22)');const tx=x+lean*u,ty=y-h;c.strokeStyle='#8a6038';c.lineWidth=u*0.3;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*u*0.2,y-h*0.55,tx,ty);c.stroke();
  for(let k=0;k<7;k++){const a=k/7*6.283+0.3,dx=Math.cos(a),dy=Math.sin(a)*0.45,L=u*2.1;c.fillStyle=k%2?col[0]:col[1];c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+dx*L*0.6,ty+dy*L*0.6-u*0.9,tx+dx*L,ty+dy*L+u*0.5);c.quadraticCurveTo(tx+dx*L*0.5,ty+dy*L*0.5-u*0.1,tx,ty);c.fill();}
  TH.ell(c,tx,ty+u*0.1,u*0.22,u*0.2,'#7a5430');};
const RCYPRESS_=(c,x,y,u,h)=>{TH.ell(c,x,y,u*0.7,u*0.25,'rgba(20,30,10,.22)');const g=c.createLinearGradient(x-u*0.6,0,x+u*0.6,0);g.addColorStop(0,'#4d8a45');g.addColorStop(0.55,'#2f6a34');g.addColorStop(1,'#1e4a28');c.fillStyle=g;c.beginPath();c.moveTo(x-u*0.62,y-u*0.2);c.quadraticCurveTo(x-u*0.75,y-h*0.55,x,y-h);c.quadraticCurveTo(x+u*0.75,y-h*0.55,x+u*0.62,y-u*0.2);c.closePath();c.fill();};
const ROLIVE_=(c,x,y,u,h)=>{TH.ell(c,x,y,u*0.9,u*0.3,'rgba(20,30,10,.22)');c.strokeStyle='#7a6a58';c.lineWidth=u*0.32;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.2,y-h*0.5,x+u*0.1,y-h*0.8);c.stroke();const rn=RRNG_(Math.round(x));[[0,-h*0.95,1.25,0.8],[-1.0,-h*0.78,0.95,0.65],[1.0,-h*0.8,0.95,0.65]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy,rx*u,ry*u,['#7d9a63','#6b8a56','#8aa86e'][i],rn,9));};
const RJAR_=(c,x,y,u,col,h)=>{h=h||1.5;TH.ell(c,x,y,u*0.55,u*0.2,'rgba(0,0,0,.2)');const g=c.createLinearGradient(x-u*0.5,0,x+u*0.5,0);g.addColorStop(0,shade(col,0.22));g.addColorStop(0.55,col);g.addColorStop(1,shade(col,-0.35));c.fillStyle=g;c.beginPath();c.moveTo(x-u*0.2,y-u*h);c.quadraticCurveTo(x-u*0.62,y-u*h*0.55,x-u*0.3,y);c.lineTo(x+u*0.3,y);c.quadraticCurveTo(x+u*0.62,y-u*h*0.55,x+u*0.2,y-u*h);c.closePath();c.fill();TH.ell(c,x,y-u*h,u*0.24,u*0.09,shade(col,-0.4));TH.ln(c,[x-u*0.5,y-u*h*0.55],[x+u*0.5,y-u*h*0.55],shade(col,-0.25),u*0.07);};
const RLANT_RED_=(c,x,y,u,s)=>{s=s||1;GLOW(c,x,y+u*0.4*s,u*1.1*s,'255,70,40',0.45);TH.ln(c,[x,y-u*0.35*s],[x,y],'#3a2a1a',u*0.06);TH.ell(c,x,y+u*0.45*s,u*0.36*s,u*0.46*s,'#d8261c');TH.ell(c,x-u*0.1*s,y+u*0.35*s,u*0.1*s,u*0.18*s,'rgba(255,200,170,.55)');TH.ell(c,x,y,u*0.2*s,u*0.07*s,'#e9b43a');TH.ell(c,x,y+u*0.92*s,u*0.2*s,u*0.07*s,'#e9b43a');TH.ln(c,[x,y+u*0.95*s],[x,y+u*1.3*s],'#e9b43a',u*0.06);};
const RBOWL_=(c,x,y,u,s,steam)=>{s=s||1;TH.ell(c,x,y+u*0.5*s,u*0.9*s,u*0.28*s,'rgba(0,0,0,.18)');c.fillStyle='#f4efe6';c.beginPath();c.moveTo(x-u*0.9*s,y);c.quadraticCurveTo(x-u*0.7*s,y+u*0.75*s,x,y+u*0.8*s);c.quadraticCurveTo(x+u*0.7*s,y+u*0.75*s,x+u*0.9*s,y);c.closePath();c.fill();c.fillStyle='#c33a2b';c.fillRect(x-u*0.82*s,y+u*0.12*s,u*1.64*s,u*0.1*s);TH.ell(c,x,y,u*0.9*s,u*0.3*s,'#e8b85a');for(let k=0;k<5;k++)TH.ln(c,[x-u*0.6*s+k*u*0.3*s,y-u*0.08*s],[x-u*0.45*s+k*u*0.3*s,y+u*0.1*s],'#fff0b8',u*0.07*s);TH.ell(c,x+u*0.25*s,y-u*0.05*s,u*0.14*s,u*0.07*s,'#7bb04a');TH.ln(c,[x+u*0.1*s,y-u*0.15*s],[x+u*1.0*s,y-u*1.25*s],'#6a3a1a',u*0.08*s);TH.ln(c,[x+u*0.3*s,y-u*0.12*s],[x+u*1.2*s,y-u*1.1*s],'#6a3a1a',u*0.08*s);
  if(steam){c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=u*0.1*s;c.lineCap='round';for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(x+k*u*0.4*s,y-u*0.2*s);c.bezierCurveTo(x+k*u*0.4*s-u*0.3*s,y-u*0.6*s,x+k*u*0.4*s+u*0.3*s,y-u*0.9*s,x+k*u*0.4*s,y-u*1.3*s);c.stroke();}}};
const RNIGIRI_=(c,x,y,u,s,fish)=>{s=s||1;TH.ell(c,x,y+u*0.18*s,u*0.7*s,u*0.22*s,'rgba(0,0,0,.2)');c.fillStyle='#fbf8f0';c.beginPath();c.moveTo(x-u*0.55*s,y);c.quadraticCurveTo(x-u*0.6*s,y-u*0.4*s,x-u*0.35*s,y-u*0.42*s);c.lineTo(x+u*0.35*s,y-u*0.42*s);c.quadraticCurveTo(x+u*0.6*s,y-u*0.4*s,x+u*0.55*s,y);c.closePath();c.fill();c.fillStyle=fish||'#f26b4f';c.beginPath();c.moveTo(x-u*0.68*s,y-u*0.28*s);c.quadraticCurveTo(x,y-u*0.95*s,x+u*0.68*s,y-u*0.28*s);c.quadraticCurveTo(x,y-u*0.4*s,x-u*0.68*s,y-u*0.28*s);c.fill();c.strokeStyle='#fde7dd';c.lineWidth=u*0.06*s;c.beginPath();c.moveTo(x-u*0.4*s,y-u*0.4*s);c.quadraticCurveTo(x,y-u*0.62*s,x+u*0.4*s,y-u*0.4*s);c.stroke();};
const RCHERRY_=(c,x,y,u,h,v)=>{TH.ell(c,x,y,u*1.0,u*0.34,'rgba(20,20,10,.22)');c.strokeStyle='#5a3d2e';c.lineWidth=u*0.3;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+u*0.15,y-h*0.5,x-u*0.1,y-h*0.8);c.stroke();TH.ln(c,[x-u*0.05,y-h*0.55],[x+u*0.9,y-h*0.85],'#5a3d2e',u*0.16);const rn=RRNG_(v||3);[[-0.8,-h*0.98,1.4,0.95,'#f2a9c1'],[0.9,-h*0.95,1.3,0.9,'#f6bfd0'],[0.0,-h*1.15,1.35,0.9,'#f9cddb'],[-0.1,-h*0.85,1.1,0.7,'#ee97b3']].forEach(([dx,dy,rx,ry,col])=>TH.blob(c,x+dx*u,y+dy,rx*u,ry*u,col,rn,10));for(let k=0;k<7;k++)TH.ell(c,x+(rn()-0.5)*u*3.6,y+u*0.05+rn()*u*0.15,u*0.12,u*0.05,'#f9cddb');};
const RUPT_=(c,I,X,Y,Z,w,col,u)=>{/* small curved eave tip */const p=I(X,Y,Z);TH.poly(c,[[p[0]-u*w,p[1]+u*0.1],[p[0],p[1]-u*0.5],[p[0]+u*w,p[1]+u*0.1]],col);};


/* ===== RESTROOM HELPERS: pictogram plaques, door pairs, drinking fountain, roof vents ===== */
/* A little person pictogram on a plaque drawn ON a wall plane: (x,y) = screen point of the plaque centre; plane 'F' = the front wall (along +X), 'R' = the right wall (along -Y). */
const RRPLANE=(c,x,y,u,plane)=>{c.translate(x,y);if(plane==='R')c.transform(-0.7*u,0.35*u,0,-u,0,0);else c.transform(0.7*u,0.35*u,0,-u,0,0);};
const RRPICTO=(c,x,y,u,kind,fg,bg,shape,plane,rim)=>{c.save();RRPLANE(c,x,y,u*1.15,plane||'F');
  if(shape==='round'){c.beginPath();c.arc(0,0,0.64,0,7);c.fillStyle=rim||fg;c.fill();c.beginPath();c.arc(0,0,0.55,0,7);c.fillStyle=bg;c.fill();}
  else if(shape==='shield'){c.beginPath();c.moveTo(-0.55,0.62);c.lineTo(0.55,0.62);c.lineTo(0.55,0.0);c.quadraticCurveTo(0.5,-0.5,0,-0.72);c.quadraticCurveTo(-0.5,-0.5,-0.55,0.0);c.closePath();c.fillStyle=rim||fg;c.fill();c.beginPath();c.moveTo(-0.47,0.54);c.lineTo(0.47,0.54);c.lineTo(0.47,0.0);c.quadraticCurveTo(0.43,-0.42,0,-0.62);c.quadraticCurveTo(-0.43,-0.42,-0.47,0.0);c.closePath();c.fillStyle=bg;c.fill();}
  else{c.fillStyle=rim||fg;c.fillRect(-0.58,-0.66,1.16,1.32);c.fillStyle=bg;c.fillRect(-0.5,-0.58,1.0,1.16);}
  c.fillStyle=fg;c.beginPath();c.arc(0,0.36,0.13,0,7);c.fill();
  if(kind==='m'){c.fillRect(-0.17,0.14,0.34,0.17);c.fillRect(-0.17,-0.04,0.07,0.3);c.fillRect(0.1,-0.04,0.07,0.3);c.fillRect(-0.1,-0.36,0.08,0.34);c.fillRect(0.02,-0.36,0.08,0.34);c.beginPath();c.moveTo(-0.12,0.31);c.lineTo(0.12,0.31);c.lineTo(0.1,0.0);c.lineTo(-0.1,0.0);c.closePath();c.fill();}
  else{c.beginPath();c.moveTo(-0.08,0.28);c.lineTo(0.08,0.28);c.lineTo(0.22,-0.14);c.lineTo(-0.22,-0.14);c.closePath();c.fill();c.fillRect(-0.15,0.1,0.07,0.17);c.fillRect(0.08,0.1,0.07,0.17);c.fillRect(-0.1,-0.4,0.07,0.28);c.fillRect(0.03,-0.4,0.07,0.28);}
  c.restore();};
/* two matching door recesses on the front wall (y1) at X = -dx and +dx, door height dh; paints the dark recess, the leaf and a pictogram plaque above. opts: leaf colours, plaque style */
const RRDOOR=(c,I,u,y1,X,w,dh,leaf,leafD,frame)=>{BP(c,[I(X-w/2-0.12,y1+0.01,0),I(X+w/2+0.12,y1+0.01,0),I(X+w/2+0.12,y1+0.01,dh+0.12),I(X-w/2-0.12,y1+0.01,dh+0.12)],frame||'#e4e0d6');BP(c,[I(X-w/2,y1+0.02,0),I(X+w/2,y1+0.02,0),I(X+w/2,y1+0.02,dh),I(X-w/2,y1+0.02,dh)],'#1c1a18');
  BP(c,[I(X-w/2+0.08,y1+0.06,0),I(X+w/2-0.08,y1+0.06,0),I(X+w/2-0.08,y1+0.06,dh-0.08),I(X-w/2+0.08,y1+0.06,dh-0.08)],leaf);BP(c,[I(X+w/2-0.45,y1+0.07,0.1),I(X+w/2-0.08,y1+0.07,0.1),I(X+w/2-0.08,y1+0.07,dh-0.16),I(X+w/2-0.45,y1+0.07,dh-0.16)],leafD||shade(leaf,-0.25));
  TH.ell(c,...I(X-w/2+0.3,y1+0.08,dh*0.5),u*0.07,u*0.07,'#c8cfd8');};
/* drinking fountain / wash-up post (pedestal, bowl, tap) */
const RRFOUNT=(c,x,y,u,col)=>{TH.ell(c,x,y+u*0.1,u*0.55,u*0.2,'rgba(0,0,0,.2)');EGCYL_(c,x,y,u*0.3,u*0.12,u*1.4,[shade(col||'#b8c2cc',0.2),col||'#b8c2cc',shade(col||'#b8c2cc',-0.35)]);TH.ell(c,x,y-u*1.5,u*0.62,u*0.24,shade(col||'#b8c2cc',0.15));TH.ell(c,x,y-u*1.55,u*0.46,u*0.17,'#6fa8c8');TH.ln(c,[x+u*0.1,y-u*1.5],[x+u*0.1,y-u*2.0],'#8a96a4',u*0.1);TH.ln(c,[x+u*0.1,y-u*2.0],[x+u*0.4,y-u*2.0],'#8a96a4',u*0.1);};
/* a small round roof turbine vent / chimney cowl */
const RRVENT=(c,x,y,u,col)=>{TH.ln(c,[x,y],[x,y-u*0.8],'#8a96a4',u*0.28);c.fillStyle=col||'#c8d0d8';c.beginPath();c.ellipse(x,y-u*1.5,u*0.6,u*0.72,0,0,7);c.fill();for(let k=-2;k<=2;k++)TH.ln(c,[x+k*u*0.22,y-u*2.1],[x+k*u*0.2,y-u*0.9],'rgba(60,70,84,.4)',u*0.07);TH.ell(c,x,y-u*2.12,u*0.55,u*0.14,shade(col||'#c8d0d8',0.2));};
/* louvre vents: a row of slats on a wall plane */
const RRLOUVER=(c,I,y1,x0,x1,z0,z1,n,col,dk)=>{BP(c,[I(x0,y1+0.01,z0),I(x1,y1+0.01,z0),I(x1,y1+0.01,z1),I(x0,y1+0.01,z1)],dk||'#2a3038');for(let k=0;k<n;k++){const z=z0+(z1-z0)*(k+0.5)/n;BP(c,[I(x0+0.04,y1+0.04,z-0.05),I(x1-0.04,y1+0.04,z-0.05),I(x1-0.04,y1+0.08,z+0.06),I(x0+0.04,y1+0.08,z+0.06)],col||'#dfe5ea');}};
/* a small frosted window on the right wall (x1 plane) */
const RRSIDEWIN=(c,I,x1,Y,Z,w,h,glass,frame)=>{BP(c,[I(x1+0.01,Y-w/2-0.1,Z-h/2-0.1),I(x1+0.01,Y+w/2+0.1,Z-h/2-0.1),I(x1+0.01,Y+w/2+0.1,Z+h/2+0.1),I(x1+0.01,Y-w/2-0.1,Z+h/2+0.1)],frame||'#e4e0d6');BP(c,[I(x1+0.02,Y-w/2,Z-h/2),I(x1+0.02,Y+w/2,Z-h/2),I(x1+0.02,Y+w/2,Z+h/2),I(x1+0.02,Y-w/2,Z+h/2)],glass||'#cfe3ee');TH.ln(c,I(x1+0.03,Y,Z-h/2),I(x1+0.03,Y,Z+h/2),'rgba(255,255,255,.7)',1.2);};
const RRI=(x,y,u)=>(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);

const RESTROOM_ART={};
/* ===== RESTROOM ART for the new lands. Compact utility buildings: two doors with pictogram plaques, high louvres / small windows, roof vents, a wash post or fountain outside. ===== */
const RRBRICK_=(c,I,x0,x1,y1,z0,z1,col,u)=>{for(let z=z0+0.3;z<z1-0.01;z+=0.3)TH.ln(c,I(x0,y1+0.01,z),I(x1,y1+0.01,z),col,u*0.035);for(let r=0;r<Math.round((z1-z0)/0.3);r++)for(let X=x0+(r%2)*0.3;X<x1;X+=0.6)TH.ln(c,I(X,y1+0.01,z0+r*0.3),I(X,y1+0.01,z0+r*0.3+0.3),col,u*0.03);};
const RRBRICKR_=(c,I,x1,y0,y1,z0,z1,col,u)=>{for(let z=z0+0.3;z<z1-0.01;z+=0.3)TH.ln(c,I(x1+0.01,y0,z),I(x1+0.01,y1,z),col,u*0.035);};
/* arched opening on the front wall: dark recess, leaf, stone frame; w = width, hh = height to the springing of the arch */
const RRARCH_=(c,I,u,y1,X,w,hh,frame,leaf,leafD,studs)=>{const top=I(X,y1+0.02,hh),rx=u*0.7*w/2;c.fillStyle=frame;c.beginPath();const a=I(X-w/2-0.14,y1+0.02,0),b=I(X+w/2+0.14,y1+0.02,0),at=I(X-w/2-0.14,y1+0.02,hh);c.moveTo(a[0],a[1]);c.lineTo(at[0],at[1]);c.ellipse(top[0],top[1],rx+u*0.1,u*0.34+u*0.1,0,Math.PI,0);c.lineTo(b[0],b[1]);c.closePath();c.fill();
  const a2=I(X-w/2,y1+0.04,0),b2=I(X+w/2,y1+0.04,0),a2t=I(X-w/2,y1+0.04,hh);c.fillStyle='#1a120c';c.beginPath();c.moveTo(a2[0],a2[1]);c.lineTo(a2t[0],a2t[1]);c.ellipse(top[0],top[1],rx,u*0.34,0,Math.PI,0);c.lineTo(b2[0],b2[1]);c.closePath();c.fill();
  const a3=I(X-w/2+0.1,y1+0.06,0),b3=I(X+w/2-0.1,y1+0.06,0),a3t=I(X-w/2+0.1,y1+0.06,hh*0.96);c.fillStyle=leaf;c.beginPath();c.moveTo(a3[0],a3[1]);c.lineTo(a3t[0],a3t[1]);c.ellipse(top[0],top[1]+u*0.03,rx-u*0.08,u*0.3,0,Math.PI,0);c.lineTo(b3[0],b3[1]);c.closePath();c.fill();
  for(let k=1;k<4;k++){const t=k/4,p=I(X-w/2+0.1+(w-0.2)*t,y1+0.07,0),q=I(X-w/2+0.1+(w-0.2)*t,y1+0.07,hh*0.94);TH.ln(c,p,q,leafD,u*0.06);}
  if(studs)for(let r=0;r<3;r++)for(let k=0;k<3;k++){const p=I(X-w/2+0.3+k*(w-0.6)/2,y1+0.08,0.4+r*(hh-0.9)/2);TH.ell(c,p[0],p[1],u*0.06,u*0.06,studs);}};
const RRSLIT_=(c,I,y1,X,Z,w,h,glass,frame)=>{BP(c,[I(X-w/2-0.06,y1+0.01,Z-h/2-0.06),I(X+w/2+0.06,y1+0.01,Z-h/2-0.06),I(X+w/2+0.06,y1+0.01,Z+h/2+0.06),I(X-w/2-0.06,y1+0.01,Z+h/2+0.06)],frame);BP(c,[I(X-w/2,y1+0.02,Z-h/2),I(X+w/2,y1+0.02,Z-h/2),I(X+w/2,y1+0.02,Z+h/2),I(X-w/2,y1+0.02,Z+h/2)],glass);};
const RRPICT2_=(c,I,u,y1,X,Z,kind,fg,bg,shape,rim)=>RRPICTO(c,...I(X,y1+0.05,Z),u,kind,fg,bg,shape,'F',rim);

/* ---- CHINA: a small white-plaster and grey-brick lavatory house with red lacquered double doors, a grey-tile hip roof with upturned corners, lanterns and a carved-stone wash basin ---- */
RESTROOM_ART.china={dy:0.05,k:1.2,draw(c,x,y,u,v){const I=RRI(x,y,u),red='#c4301f',redD='#8f2216',gold='#e6b43c',tile='#4f5a60',tileD='#323a40',tileL='#6f7c84',plas='#f2ece0',brick='#8d9298';RSH_(c,x,y+u*0.5,u*7.0,u*3.0,'44,38,30');
  const bb=I(-5.0,4.2,0);RJAR_(c,bb[0],bb[1],u*1.2,'#c4301f',1.2);for(let k=0;k<4;k++)TH.ln(c,[bb[0]+(k-1.5)*u*0.2,bb[1]-u*1.5],[bb[0]+(k-1.5)*u*0.35,bb[1]-u*2.9-(k%2)*u*0.5],'#5ea04a',u*0.13);
  JBOX(c,x,y,u,-4.3,4.3,-2.8,2.8,0,0.4,'#b8b0a0');
  JBOX(c,x,y,u,-3.9,3.9,-2.4,2.4,0.4,3.8,plas);BP(c,RFRONT(c,I,2.4,-3.9,3.9,0.4,1.0),brick);BP(c,RIGHTF(c,I,3.9,-2.4,2.4,0.4,1.0),shade(brick,-0.25));RRBRICK_(c,I,-3.9,3.9,2.4,0.4,1.0,'rgba(30,34,40,.35)',u);RRBRICKR_(c,I,3.9,-2.4,2.4,0.4,1.0,'rgba(20,24,30,.35)',u);
  [-3.9,0,3.9].forEach(X=>RPOST(c,I,X,2.46,0.4,3.8,red,u,0.38));RPOST(c,I,3.96,-2.4,0.4,3.8,red,u,0.34);RPOST(c,I,3.96,0,0.4,3.8,red,u,0.3);
  TH.ln(c,I(-3.9,2.46,3.55),I(3.9,2.46,3.55),redD,u*0.3);TH.ln(c,I(3.96,-2.4,3.55),I(3.96,2.4,3.55),redD,u*0.3);
  [-1.95,1.95].forEach((X,i)=>{BP(c,RFRONT(c,I,2.42,X-0.85,X+0.85,0.4,2.7),'#3a1410');[-1,1].forEach(s=>{BP(c,RFRONT(c,I,2.45,s>0?X+0.05:X-0.8,s>0?X+0.8:X-0.05,0.45,2.6),red,redD,u*0.05);for(let r=0;r<3;r++)for(let q=0;q<2;q++){const px=s>0?X+0.25+q*0.3:X-0.55+q*0.3;TH.ell(c,...I(px,2.47,0.85+r*0.55),u*0.06,u*0.06,gold);}TH.ell(c,...I(s>0?X+0.12:X-0.12,2.47,1.4),u*0.09,u*0.09,gold);});
    RRPICT2_(c,I,u,2.42,X,3.15,i?'f':'m','#8f2216','#fbe9b8','round',gold);TH.ln(c,I(X-0.6,2.43,3.65),I(X+0.6,2.43,3.65),gold,u*0.1);});
  /* lattice windows: between the doors and on the end wall */
  BP(c,RFRONT(c,I,2.42,-0.45,0.45,1.5,2.7),'#3a1410',gold,u*0.08);for(let k=-1;k<=1;k++){TH.ln(c,I(k*0.3,2.45,1.5),I(k*0.3,2.45,2.7),gold,u*0.05);TH.ln(c,I(-0.45,2.45,2.1+k*0.35),I(0.45,2.45,2.1+k*0.35),gold,u*0.05);}
  BP(c,RIGHTF(c,I,3.92,-0.8,0.8,1.8,3.0),'#3a1410',gold,u*0.08);for(let k=-2;k<=2;k++){TH.ln(c,I(3.95,k*0.32,1.8),I(3.95,k*0.32,3.0),gold,u*0.05);}for(let k=-1;k<=1;k++)TH.ln(c,I(3.95,-0.8,2.4+k*0.4),I(3.95,0.8,2.4+k*0.4),gold,u*0.05);
  /* single hip roof with upturned corners */
  HIP(c,I,-4.7,4.7,-3.0,3.0,3.8,1.9,0.3,tile,tileD,u,6);[[-5.0,3.3],[5.0,3.3],[5.0,-3.3]].forEach(([X,Y])=>RUPT_(c,I,X,Y,3.9,0.5,tileL,u));
  const rp=I(0,0,5.7);TH.ln(c,[rp[0],rp[1]],[rp[0],rp[1]-u*0.4],gold,u*0.12);TH.ell(c,rp[0],rp[1]-u*0.5,u*0.2,u*0.2,gold);TH.ln(c,I(-1.8,0,5.7),I(1.8,0,5.7),gold,u*0.16);
  [-4.3,4.3].forEach(X=>{const p=I(X,3.3,3.8);RLANT_RED_(c,p[0],p[1],u,0.9);});
  const wb=I(6.0,4.1,0);TH.ell(c,wb[0],wb[1]+u*0.1,u*0.9,u*0.3,'rgba(0,0,0,.2)');EGCYL_(c,wb[0],wb[1],u*0.5,u*0.19,u*1.1,['#d8d4c8','#b4b0a2','#7a776c']);TH.ell(c,wb[0],wb[1]-u*1.2,u*0.9,u*0.34,'#cac6b8');TH.ell(c,wb[0],wb[1]-u*1.25,u*0.7,u*0.25,'#6fa8c8');TH.ln(c,[wb[0]-u*0.7,wb[1]-u*1.2],[wb[0]-u*0.7,wb[1]-u*1.9],'#b4b0a2',u*0.28);TH.ell(c,wb[0]-u*0.7,wb[1]-u*1.95,u*0.22,u*0.18,'#b4b0a2');TH.ln(c,[wb[0]-u*0.7,wb[1]-u*1.85],[wb[0]-u*0.45,wb[1]-u*1.35],'#6fa8c8',u*0.08);
  /* carved stone wash basin with a dragon spout, a bamboo pot */
}};

/* ---- JAPAN: a small charred-cedar board lavatory with two sliding paper-screen doors, a deep slate roof, a stone water basin with a bamboo spout, a lantern and a maple ---- */
RESTROOM_ART.japan={dy:0.05,k:1.2,draw(c,x,y,u,v){const I=RRI(x,y,u),wood='#3d3028',woodD='#2a201a',plas='#f1ebdd',slate='#4a5260',slateD='#2f3540',rn=RRNG_(14+(v|0));RSH_(c,x,y+u*0.5,u*7.0,u*3.0,'40,34,28');
  const sl=I(-5.2,3.6,0);TH.ell(c,sl[0],sl[1]+u*0.1,u*0.6,u*0.22,'rgba(0,0,0,.2)');JBOX(c,x,y,u,-5.6,-4.8,3.2,4.0,0,0.8,'#9a9a90');JBOX(c,x,y,u,-5.5,-4.9,3.3,3.9,0.8,1.25,'#ffe9b0');TH.poly(c,[I(-5.8,3.1,1.3),I(-4.6,3.1,1.3),I(-5.2,3.6,1.9)],'#7a7a72');
  const mp=I(-8.0,2.2,0);TH.ell(c,mp[0],mp[1],u*1.0,u*0.34,'rgba(20,20,10,.22)');c.strokeStyle='#4a3326';c.lineWidth=u*0.28;c.lineCap='round';c.beginPath();c.moveTo(mp[0],mp[1]);c.quadraticCurveTo(mp[0]+u*0.1,mp[1]-u*1.2,mp[0]-u*0.1,mp[1]-u*2.0);c.stroke();[[0,-2.5,1.2,0.8,'#c8402a'],[-0.8,-2.1,0.9,0.6,'#d9582e'],[0.8,-2.1,0.9,0.6,'#b8321f']].forEach(([dx,dy,rx,ry,col])=>TH.blob(c,mp[0]+dx*u,mp[1]+dy*u,rx*u,ry*u,col,rn,9));
  for(let k=0;k<5;k++){const p=I(1.0+k*0.55,5.2,0);TH.ln(c,[p[0],p[1]],[p[0],p[1]-u*0.9],'#9fb858',u*0.2);}TH.ln(c,I(0.9,5.2,0.65),I(3.2,5.2,0.65),'#7a6a3a',u*0.1);
  JBOX(c,x,y,u,-4.2,4.2,-2.8,2.8,0,0.45,'#9a9a90');
  JBOX(c,x,y,u,-3.8,3.8,-2.4,2.4,0.45,3.6,wood);for(let k=0;k<16;k++)TH.ln(c,I(-3.7+k*0.5,2.41,0.45),I(-3.7+k*0.5,2.41,3.6),'rgba(255,225,180,.1)',u*0.04);for(let k=0;k<10;k++)TH.ln(c,I(3.81,-2.3+k*0.5,0.45),I(3.81,-2.3+k*0.5,3.6),'rgba(0,0,0,.25)',u*0.05);
  BP(c,RFRONT(c,I,2.42,-3.8,3.8,2.9,3.6),plas);BP(c,RIGHTF(c,I,3.82,-2.4,2.4,2.9,3.6),shade(plas,-0.18));TH.ln(c,I(-3.8,2.44,2.9),I(3.8,2.44,2.9),'#2a201a',u*0.14);
  [-3.8,-1.0,1.0,3.8].forEach(X=>RPOST(c,I,X,2.46,0.45,3.6,'#2a201a',u,0.24));
  [-1.95,1.95].forEach((X,i)=>{BP(c,RFRONT(c,I,2.44,X-0.85,X+0.85,0.5,2.7),'#2a201a');BP(c,RFRONT(c,I,2.46,X-0.78,X+0.78,0.55,2.62),'#f6eed6');for(let k=-2;k<=2;k++)TH.ln(c,I(X+k*0.3,2.48,0.55),I(X+k*0.3,2.48,2.62),'#7a5a3a',u*0.05);for(let k=0;k<5;k++)TH.ln(c,I(X-0.78,2.48,0.55+k*0.52),I(X+0.78,2.48,0.55+k*0.52),'#7a5a3a',u*0.05);TH.ell(c,...I(X+0.55,2.5,1.5),u*0.07,u*0.07,'#2a201a');
    /* indigo noren over the door head with the pictogram */
    for(let k=0;k<2;k++){const X0=X-0.8+k*0.8;BP(c,[I(X0,2.5,2.7),I(X0+0.76,2.5,2.7),I(X0+0.76,2.5,2.1),I(X0,2.5,2.1)],'#2a3a6a');}TH.ln(c,I(X-0.85,2.5,2.72),I(X+0.85,2.5,2.72),'#2a201a',u*0.1);
    RRPICT2_(c,I,u,2.42,X,3.28,i?'f':'m','#8f1f18','#f4ecd8','rect','#7a5a3a');});
  BP(c,RFRONT(c,I,2.42,-0.5,0.5,1.4,2.5),'#2a201a');for(let k=-2;k<=2;k++)TH.ln(c,I(k*0.2,2.45,1.4),I(k*0.2,2.45,2.5),'#a8884e',u*0.05);
  BP(c,RIGHTF(c,I,3.84,-0.7,0.7,1.7,2.6),'#2a201a');for(let k=-2;k<=2;k++)TH.ln(c,I(3.86,k*0.26,1.7),I(3.86,k*0.26,2.6),'#a8884e',u*0.05);
  HIP(c,I,-4.5,4.5,-2.9,2.9,3.6,1.8,0.55,slate,slateD,u,7);TH.ln(c,I(-1.6,0,5.4),I(1.6,0,5.4),'#1f242e',u*0.26);
  const tb=I(5.9,3.9,0);TH.ell(c,tb[0],tb[1]+u*0.1,u*0.9,u*0.3,'rgba(0,0,0,.2)');JBOX(c,x,y,u,4.8,5.9,3.0,4.1,0,0.7,'#9a9a90');TH.ell(c,...I(5.95,4.05,0.72),u*0.62,u*0.28,'#6a6a62');TH.ell(c,...I(5.95,4.05,0.76),u*0.5,u*0.2,'#6fa8c8');TH.ln(c,I(4.6,3.2,1.9),I(5.2,3.5,1.0),'#8aa84e',u*0.22);TH.ln(c,I(4.6,3.2,1.9),I(4.6,3.2,0.0),'#7a5a3a',u*0.12);
  /* tsukubai: stone basin, bamboo spout, and a stone lantern */
  /* maple at the back corner and a bamboo screen */
}};

/* ---- ROME / GREECE: a small ancient town house (stucco walls, pilasters, two arched doors under round marble medallions, a low hip roof, a wall fountain) ---- */
function DOMUS_(c,x,y,u,v,P){const I=RRI(x,y,u);RSH_(c,x,y+u*0.5,u*7.0,u*3.0,'44,36,24');
  const a1=I(-5.1,3.6,0);RJAR_(c,a1[0],a1[1],u*1.1,P.jar,1.6);const a2=I(-4.4,4.6,0);RJAR_(c,a2[0],a2[1],u*1.0,P.jar2,1.3);
  P.tree(c,I(-7.5,1.0,0)[0],I(-7.5,1.0,0)[1],u,u*P.treeH);
  const hb=I(5.4,-1.6,0);TH.blob(c,hb[0],hb[1]-u*0.5,u*0.9,u*0.55,'#4f8a45',RRNG_(5),8);
  JBOX(c,x,y,u,-4.3,4.3,-2.8,2.8,0,0.35,P.step);JBOX(c,x,y,u,-4.0,4.0,-2.5,2.5,0.35,0.7,P.step2);
  JBOX(c,x,y,u,-3.7,3.7,-2.3,2.3,0.7,3.9,P.wall);
  BP(c,RFRONT(c,I,2.3,-3.7,3.7,0.7,1.4),P.dado);BP(c,RIGHTF(c,I,3.7,-2.3,2.3,0.7,1.4),shade(P.dado,-0.25));TH.ln(c,I(-3.7,2.33,1.4),I(3.7,2.33,1.4),P.trim,u*0.1);
  BP(c,RFRONT(c,I,2.3,-3.7,3.7,3.4,3.9),P.band);for(let k=0;k<10;k++)BP(c,RFRONT(c,I,2.31,-3.5+k*0.72,-3.5+k*0.72+0.32,3.5,3.8),P.band2);
  [-3.7,3.7].forEach(X=>{JBOX(c,x,y,u,X-0.2,X+0.2,2.1,2.5,0.7,3.9,P.trim);});
  [-1.8,1.8].forEach((X,i)=>{RRARCH_(c,I,u,2.3,X,1.4,2.0,P.trim,P.leaf,P.leafD,P.stud);RRPICT2_(c,I,u,2.3,X,3.1,i?'f':'m',P.pfg,P.pbg,'round',P.prim);});
  RRSLIT_(c,I,2.3,0,2.2,0.5,1.0,P.glass,P.trim);BP(c,RIGHTF(c,I,3.72,-0.5,0.5,2.0,3.0),P.glass,P.trim,u*0.1);TH.ln(c,I(3.74,0,2.0),I(3.74,0,3.0),P.trim,u*0.05);
  HIP(c,I,-4.2,4.2,-2.8,2.8,3.9,1.5,0.3,P.roof,P.roofD,u,6);
  const fo=I(5.7,3.9,0);TH.ell(c,fo[0],fo[1],u*1.1,u*0.4,P.step);TH.ell(c,fo[0],fo[1]-u*0.12,u*0.9,u*0.32,P.water);RRFOUNT(c,fo[0],fo[1]-u*0.1,u*0.9,P.step);
  /* wall fountain: a stone spout and basin on the right of the front */
}
RESTROOM_ART.rome={dy:0.05,k:1.2,draw(c,x,y,u,v){DOMUS_(c,x,y,u,v,{step:'#d9d2c0',step2:'#e6e0d0',wall:'#e9d3a0',dado:'#a8352a',trim:'#f5efe0',band:'#f0e4c4',band2:'#c9a36a',glass:'#3a2c22',roof:'#c0552f',roofD:'#8e3a1e',leaf:'#8a5a30',leafD:'#4a2e18',stud:'#2a1a10',pfg:'#7a2a20',pbg:'#f5efe0',prim:'#a8352a',vent:'#b4542a',water:'#7ec3d6',jar:'#b4542a',jar2:'#8f3d1e',tree:RCYPRESS_,treeH:4.6});}};
RESTROOM_ART.greece={dy:0.05,k:1.2,draw(c,x,y,u,v){DOMUS_(c,x,y,u,v,{step:'#e4e8ee',step2:'#f0f3f7',wall:'#fbfbf8',dado:'#6aa6d6',trim:'#ffffff',band:'#eef3f8',band2:'#2f78c4',glass:'#2d4a6a',roof:'#f3f5f8',roofD:'#d3dae4',leaf:'#2f78c4',leafD:'#1c5296',stud:'#e6e0d0',pfg:'#1c5296',pbg:'#ffffff',prim:'#2f78c4',vent:'#e6e0d0',water:'#5fc0e0',jar:'#ece3d0',jar2:'#c9a36a',tree:ROLIVE_,treeH:3.6});}};
/* ---- JURASSIC ISLAND: a bamboo-and-timber resort bungalow (louvred doors under carved plaques, a deep green roof, palms, a wooden wash post) ---- */
RESTROOM_ART.jurassic={dy:0.05,k:1.2,draw(c,x,y,u,v){const I=RRI(x,y,u),wood='#b98a56',woodD='#5e3a1e',roof='#2f7a45',amber='#f2a62c',rn=RRNG_(61+(v|0));RSH_(c,x,y+u*0.5,u*7.2,u*3.0,'20,40,16');
  RPALM_(c,I(-7.4,-0.6,0)[0],I(-7.4,-0.6,0)[1],u,u*4.6,-0.4,['#3f9a3c','#2d7a2c']);RPALM_(c,I(7.9,-1.2,0)[0],I(7.9,-1.2,0)[1],u,u*4.8,0.5,['#3f9a3c','#2d7a2c']);
  RTORCH(c,I(-4.6,3.4,0)[0],I(-4.6,3.4,0)[1],u,u*1.8);
  [[-5.2,4.0],[4.4,5.4],[-3.0,5.4]].forEach(([X,Y])=>{const p=I(X,Y,0);TH.ell(c,p[0],p[1],u*1.0,u*0.34,'rgba(20,40,16,.22)');for(let k=0;k<9;k++){const a=-Math.PI+k/8*Math.PI;c.strokeStyle=k%2?'#3f9a3c':'#5fb84a';c.lineWidth=u*0.2;c.lineCap='round';c.beginPath();c.moveTo(p[0],p[1]);c.quadraticCurveTo(p[0]+Math.cos(a)*u*0.9,p[1]-u*1.3,p[0]+Math.cos(a)*u*1.5,p[1]-u*0.3+Math.sin(a)*u*0.2);c.stroke();}});
  JBOX(c,x,y,u,-4.2,4.2,-2.8,2.8,0,0.6,'#8f8a78');for(let k=0;k<8;k++)TH.ln(c,I(-4.0+k*1.15,2.82,0),I(-4.0+k*1.15,2.82,0.6),'rgba(40,40,30,.3)',u*0.05);
  JBOX(c,x,y,u,-3.8,3.8,-2.4,2.4,0.6,3.6,wood);for(let k=0;k<16;k++)TH.ln(c,I(-3.7+k*0.5,2.41,0.6),I(-3.7+k*0.5,2.41,3.6),'rgba(70,40,14,.3)',u*0.05);for(let k=0;k<10;k++)TH.ln(c,I(3.81,-2.3+k*0.5,0.6),I(3.81,-2.3+k*0.5,3.6),'rgba(60,34,12,.35)',u*0.05);
  [-3.8,-1.0,1.0,3.8].forEach(X=>RPOST(c,I,X,2.46,0.6,3.6,woodD,u,0.3));TH.ln(c,I(-3.8,2.46,3.5),I(3.8,2.46,3.5),woodD,u*0.26);
  [-1.95,1.95].forEach((X,i)=>{BP(c,RFRONT(c,I,2.42,X-0.8,X+0.8,0.6,2.8),woodD);BP(c,RFRONT(c,I,2.44,X-0.7,X+0.7,0.65,2.72),'#c9a066');for(let k=0;k<7;k++)TH.ln(c,I(X-0.7,2.46,0.8+k*0.27),I(X+0.7,2.46,0.8+k*0.27),'rgba(60,34,12,.45)',u*0.07);TH.ell(c,...I(X+0.5,2.48,1.6),u*0.07,u*0.07,'#3a2412');
    RRPICT2_(c,I,u,2.42,X,3.2,i?'f':'m','#3a2412',amber,'shield','#5e3a1e');});
  RRLOUVER(c,I,2.42,-0.5,0.5,1.5,2.7,5,'#c9a066','#2a1a10');RRSIDEWIN(c,I,3.84,0,2.3,1.2,1.1,'#5aa9b8',woodD);
  HIP(c,I,-3.8,3.8,-2.4,2.4,3.6,2.0,0.75,roof,'#1d5530',u,9);
  TH.ln(c,I(-4.55,3.15,3.6),I(4.55,3.15,3.6),woodD,u*0.18);TH.ln(c,I(4.55,3.15,3.6),I(4.55,-3.15,3.6),'#3e2412',u*0.16);
  TH.ln(c,I(-1.8,0,5.62),I(1.8,0,5.62),'#1a4a2a',u*0.3);TH.ln(c,I(-1.8,0,5.7),I(1.8,0,5.7),'#4aa05c',u*0.1);
  /* a row of timber brackets under the eave */
  for(let k=0;k<9;k++){const X=-3.6+k*0.9;TH.ln(c,I(X,2.5,3.6),I(X,3.0,3.45),woodD,u*0.1);}
  /* wooden wash post with a bamboo spout and a bowl */
  const wp=I(5.9,3.9,0);TH.ell(c,wp[0],wp[1]+u*0.1,u*0.7,u*0.25,'rgba(0,0,0,.2)');TH.ln(c,[wp[0],wp[1]],[wp[0],wp[1]-u*1.6],woodD,u*0.3);TH.ell(c,wp[0],wp[1]-u*1.0,u*0.7,u*0.26,'#8a6a40');TH.ell(c,wp[0],wp[1]-u*1.05,u*0.55,u*0.2,'#6fa8c8');TH.ln(c,[wp[0],wp[1]-u*1.6],[wp[0]-u*0.5,wp[1]-u*1.45],'#8aa84e',u*0.2);
}};

/* ---- GALACTIC OUTPOST: an adobe utility pod with a flat bronze roof slab, two arched glowing doors, a vent dome and a vaporator post ---- */
RESTROOM_ART.galactic={dy:0.05,k:1.2,draw(c,x,y,u,v){const I=RRI(x,y,u),tan='#d9bf8a',tanD='#bfa270',rn=RRNG_(77+(v|0));RSH_(c,x,y+u*0.5,u*7.2,u*3.0,'60,40,16');
  const bo=I(-5.0,3.4,0);TH.ell(c,bo[0],bo[1],u*0.5,u*0.18,'rgba(0,0,0,.2)');c.fillStyle='#a9a888';c.beginPath();c.moveTo(bo[0]-u*0.38,bo[1]);c.lineTo(bo[0]-u*0.34,bo[1]-u*1.0);c.ellipse(bo[0],bo[1]-u*1.0,u*0.34,u*0.34,0,Math.PI,0);c.lineTo(bo[0]+u*0.38,bo[1]);c.closePath();c.fill();c.fillStyle='#5a8a88';c.fillRect(bo[0]-u*0.36,bo[1]-u*0.7,u*0.72,u*0.22);
  const cr=I(-5.2,0.8,0);JBOX(c,x,y,u,-5.8,-4.8,0.4,1.4,0,0.9,'#7a6a58');
  /* little rock outcrop behind on the right */
  {const bx=x+u*5.6,by=y-u*0.2,P=[[-1.2,0.4],[-1.3,-1.6],[-0.8,-2.8],[-0.5,-4.2],[0.1,-5.0],[0.5,-3.6],[1.0,-2.6],[1.3,-1.0],[1.0,0.4]],poly=P.map(p=>[bx+p[0]*u,by+p[1]*u]);c.save();c.beginPath();poly.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.clip();const g=c.createLinearGradient(bx-u*1.3,0,bx+u*1.4,0);g.addColorStop(0,'#aab2c0');g.addColorStop(0.5,'#7f8aa0');g.addColorStop(1,'#4c566c');c.fillStyle=g;c.fillRect(bx-u*2,by-u*6,u*4,u*7);c.strokeStyle='rgba(30,38,56,.55)';c.lineWidth=u*0.06;[[-1.0,-1.0,0.4,-1.8],[-0.4,-3.0,0.5,-3.8]].forEach(l=>{c.beginPath();c.moveTo(bx+l[0]*u,by+l[1]*u);c.lineTo(bx+l[2]*u,by+l[3]*u);c.stroke();});c.restore();TH.blob(c,bx-u*0.4,by-u*1.4,u*0.4,u*0.26,'#5a8a4a',rn,7);}
  JBOX(c,x,y,u,-4.1,4.1,-2.7,2.7,0,0.35,'#a89878');
  JBOX(c,x,y,u,-3.8,3.8,-2.4,2.4,0.35,3.6,tan);
  for(let k=0;k<14;k++){const px=-3.6+Math.random()*0;}
  BP(c,RFRONT(c,I,2.4,-3.8,3.8,0.9,1.25),'#9a3a2a');BP(c,RIGHTF(c,I,3.8,-2.4,2.4,0.9,1.25),'#6e2a20');
  BP(c,RFRONT(c,I,2.4,-3.8,3.8,3.1,3.6),'#3a3a34');for(let k=0;k<16;k++)BP(c,RFRONT(c,I,2.41,-3.65+k*0.46,-3.65+k*0.46+0.2,3.22,3.48),'#8a8062');BP(c,RIGHTF(c,I,3.8,-2.4,2.4,3.1,3.6),'#2a2a26');
  [-1.9,1.9].forEach((X,i)=>{RRARCH_(c,I,u,2.4,X,1.5,1.7,'#4f5a4c','#7a4a24','#3a2010',null);GLOW(c,...I(X,2.45,1.0),u*1.3,i?'120,220,255':'255,170,80',0.35);RRPICT2_(c,I,u,2.4,X,2.75,i?'f':'m','#6ad8ff','#1c1f33','round','#8a8062');for(let k=0;k<5;k++){const a=Math.PI+Math.PI*(k+0.5)/5,t=I(X,2.43,1.7);c.fillStyle='#8a9a86';c.fillRect(t[0]+Math.cos(a)*u*0.9-u*0.07,t[1]+Math.sin(a)*u*0.4-u*0.28,u*0.14,u*0.14);}});
  RRSLIT_(c,I,2.4,0,2.0,0.5,0.9,'#2a1a10','#8a8062');BP(c,RIGHTF(c,I,3.82,-0.6,0.6,1.8,2.7),'#2a1a10','#8a8062',u*0.08);for(let k=-1;k<=1;k++)TH.ln(c,I(3.84,k*0.35,1.8),I(3.84,k*0.35,2.7),'#8a8062',u*0.05);
  /* flat bronze roof slab, vent dome, stacks */
  JBOX(c,x,y,u,-4.2,4.2,-2.8,2.8,3.6,4.05,'#6e625a');BT(c,I,-4.2,4.2,-2.8,2.8,4.05,'#7a6e64');TH.ln(c,I(-4.2,2.8,3.85),I(4.2,2.8,3.85),'rgba(255,230,190,.2)',u*0.06);
  const dc=I(-1.4,-0.4,4.05);EGCYL_(c,dc[0],dc[1],u*0.9,u*0.4,u*0.5,['#c8ccd4','#9aa0aa','#5a6070']);const dm=c.createRadialGradient(dc[0]-u*0.3,dc[1]-u*1.0,u*0.1,dc[0],dc[1]-u*0.6,u*1.0);dm.addColorStop(0,'#f0f2f6');dm.addColorStop(1,'#8a92a0');c.fillStyle=dm;c.beginPath();c.ellipse(dc[0],dc[1]-u*0.5,u*0.8,u*0.34,0,Math.PI,0,true);c.bezierCurveTo(dc[0]+u*0.8,dc[1]-u*1.3,dc[0]+u*0.3,dc[1]-u*1.6,dc[0],dc[1]-u*1.6);c.bezierCurveTo(dc[0]-u*0.3,dc[1]-u*1.6,dc[0]-u*0.8,dc[1]-u*1.3,dc[0]-u*0.8,dc[1]-u*0.5);c.fill();
  /* vaporator water post and a bollard */
  const vp=I(7.8,3.1,0);TH.ell(c,vp[0],vp[1]+u*0.1,u*0.6,u*0.22,'rgba(0,0,0,.22)');const vg=c.createLinearGradient(vp[0]-u*0.3,0,vp[0]+u*0.3,0);vg.addColorStop(0,'#c8ccd4');vg.addColorStop(0.5,'#9aa0aa');vg.addColorStop(1,'#5a6070');c.fillStyle=vg;c.fillRect(vp[0]-u*0.26,vp[1]-u*3.2,u*0.52,u*3.2);for(let k=0;k<3;k++)TH.poly(c,[[vp[0]-u*0.26,vp[1]-u*(0.9+k*0.8)],[vp[0]-u*0.8,vp[1]-u*(1.15+k*0.8)],[vp[0]-u*0.8,vp[1]-u*(1.65+k*0.8)],[vp[0]-u*0.26,vp[1]-u*(1.4+k*0.8)]],'#b8bcc6');TH.ell(c,vp[0],vp[1]-u*3.2,u*0.3,u*0.12,'#d8dce4');TH.ell(c,vp[0]+u*0.5,vp[1]-u*0.5,u*0.3,u*0.12,'#6fa8c8');TH.ln(c,[vp[0]+u*0.26,vp[1]-u*1.0],[vp[0]+u*0.5,vp[1]-u*0.65],'#8a96a4',u*0.1);
}};

/* ---- EGYPT: a mud-brick hut with palm-log beam ends, two arched doorways hung with striped cloth, a domed corner room and clay water jars ---- */
RESTROOM_ART.egypt={dy:0.05,k:1.2,draw(c,x,y,u,v){const I=RRI(x,y,u),mud='#d9b97a',mudD='#b8955a',rn=RRNG_(91+(v|0));RSH_(c,x,y+u*0.5,u*7.2,u*3.0,'60,44,20');
  const bn=I(5.2,3.2,0);JBOX(c,x,y,u,6.4,7.7,3.4,4.2,0,0.7,'#cfae6c');RJAR_(c,...I(6.8,3.8,0.7),u*1.0,'#b4542a',1.4);RJAR_(c,...I(7.4,3.8,0.7),u*0.9,'#c9a36a',1.2);
  RJAR_(c,...I(-5.6,4.2,0),u*1.1,'#a8452a',1.5);
  RPALM_(c,I(-6.6,-1.0,0)[0],I(-6.6,-1.0,0)[1],u,u*4.6,-0.5,['#5fa040','#3f8030']);
  [[5.4,-1.4]].forEach(([X,Y])=>{const p=I(X+0.8,Y-0.4,0);for(let k=0;k<5;k++)TH.ln(c,[p[0]+(k-2)*u*0.12,p[1]],[p[0]+(k-2)*u*0.45,p[1]-u*1.8-(k%2)*u*0.5],'#5ea04a',u*0.12);TH.ell(c,p[0],p[1]-u*0.05,u*0.5,u*0.18,'#3f8030');});
  JBOX(c,x,y,u,-4.0,4.0,-2.6,2.6,0,3.7,mud);for(let k=0;k<7;k++)TH.ln(c,I(-3.8+k*1.25,2.61,0.2),I(-3.8+k*1.25,2.61,3.5),'rgba(90,56,20,.14)',u*0.05);
  for(let z=0.5;z<3.6;z+=0.6)TH.ln(c,I(-4.0,2.61,z),I(4.0,2.61,z),'rgba(90,56,20,.12)',u*0.04);
  BP(c,RIGHTF(c,I,4.0,-2.6,2.6,0,3.7),'rgba(60,40,10,.2)');
  /* flat roof lip, palm-log ends and a tiny dome on one corner */
  JBOX(c,x,y,u,-4.2,4.2,-2.8,2.8,3.7,4.1,'#e3c88c');
  for(let k=0;k<6;k++){const p=I(-3.4+k*1.4,2.7,3.45);TH.ell(c,p[0],p[1],u*0.2,u*0.17,'#6a4426');TH.ell(c,p[0]-u*0.04,p[1]-u*0.02,u*0.12,u*0.1,'#8a6238');}
  const dm=I(-2.2,-0.6,4.1);EGCYL_(c,dm[0],dm[1],u*1.1,u*0.5,u*0.5,['#efd9a6','#d8ba7c','#a08150']);c.fillStyle='#e3c88c';c.beginPath();c.ellipse(dm[0],dm[1]-u*0.5,u*1.1,u*0.5,0,Math.PI,0,true);c.bezierCurveTo(dm[0]+u*1.1,dm[1]-u*2.0,dm[0]+u*0.4,dm[1]-u*2.3,dm[0],dm[1]-u*2.3);c.bezierCurveTo(dm[0]-u*0.4,dm[1]-u*2.3,dm[0]-u*1.1,dm[1]-u*2.0,dm[0]-u*1.1,dm[1]-u*0.5);c.fill();TH.ell(c,dm[0]+u*0.1,dm[1]-u*1.2,u*0.35,u*0.55,'rgba(255,255,255,.15)');
  [-1.9,1.9].forEach((X,i)=>{RRARCH_(c,I,u,2.6,X,1.5,1.7,'#e8d4a0','#1a120c','#1a120c',null);
    /* striped cloth curtains */
    const a=I(X-0.65,2.66,0),b=I(X+0.65,2.66,0),at=I(X-0.65,2.66,1.9),bt=I(X+0.65,2.66,1.9);for(let k=0;k<6;k++){const t0=k/6,t1=(k+1)/6,P=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];BP(c,[P(at,bt,t0),P(at,bt,t1),P(a,b,t1),P(a,b,t0)],k%2?'#f4e8cc':(i?'#2f7ab8':'#c4562a'));}TH.ln(c,at,bt,'#5a3a22',u*0.1);
    RRPICT2_(c,I,u,2.6,X,3.2,i?'f':'m','#1f5fae','#f4e8cc','rect','#c4562a');});
  RRSLIT_(c,I,2.6,0,2.2,0.5,0.9,'#2a1a10','#e8d4a0');BP(c,RIGHTF(c,I,4.02,-0.5,0.5,2.0,3.0),'#2a1a10','#e8d4a0',u*0.08);
  /* clay water jars on a mud-brick bench, palms and reeds */
}};

/* ---- BABYLON: a blue-dyed mud-brick hut with glazed-tile bands, a stepped battlement roof, pointed arch doors, trailing vines and a date palm ---- */
RESTROOM_ART.babylon={dy:0.05,k:1.2,draw(c,x,y,u,v){const I=RRI(x,y,u),mud='#d4b274',mudD='#b8955a',blue='#1f5fb4',blueD='#143f82',gold='#e6b43c',rn=RRNG_(77+(v|0));RSH_(c,x,y+u*0.5,u*7.2,u*3.0,'50,36,18');
  const wj=I(5.2,3.2,0);JBOX(c,x,y,u,6.4,7.7,3.4,4.2,0,0.7,'#c9a36a');RJAR_(c,...I(6.8,3.8,0.7),u*1.0,'#b0653a',1.4);RJAR_(c,...I(7.4,3.8,0.7),u*0.9,blue,1.2);
  [[-5.9,3.0,'#4f9a3c'],[-4.6,4.4,'#62ae48']].forEach(([X,Y,col])=>{const p=I(X,Y,0);RJAR_(c,p[0],p[1],u*1.0,'#b0653a',1.0);TH.blob(c,p[0],p[1]-u*1.35,u*0.8,u*0.5,col,rn,8);});
  RPALM_(c,I(-7.4,0.2,0)[0],I(-7.4,0.2,0)[1],u,u*4.6,-0.5);RPALM_(c,I(6.6,-1.2,0)[0],I(6.6,-1.2,0)[1],u,u*4.2,0.5);
  const leaf=(X,Y,Z,rx,ry,col)=>{const p=I(X,Y,Z);TH.blob(c,p[0],p[1]-u*0.3,u*rx,u*ry,col||'#4f9a3c',rn,9);};
  JBOX(c,x,y,u,-4.0,4.0,-2.6,2.6,0,3.6,mud);RRBRICK_(c,I,-4.0,4.0,2.6,0,3.6,'rgba(80,50,20,.22)',u);BP(c,RIGHTF(c,I,4.0,-2.6,2.6,0,3.6),'rgba(60,40,10,.22)');
  BP(c,RFRONT(c,I,2.6,-4.0,4.0,2.6,3.2),blue);for(let k=0;k<13;k++)BP(c,RFRONT(c,I,2.61,-3.8+k*0.62,-3.8+k*0.62+0.3,2.7,3.1),gold);BP(c,RIGHTF(c,I,4.0,-2.6,2.6,2.6,3.2),blueD);
  BP(c,RFRONT(c,I,2.6,-4.0,4.0,0,0.4),blue);BP(c,RIGHTF(c,I,4.0,-2.6,2.6,0,0.4),blueD);
  /* parapet with battlements */
  JBOX(c,x,y,u,-4.2,4.2,-2.8,2.8,3.6,3.85,'#c9a36a');for(let k=0;k<8;k++){const X=-4.0+k*1.1;JBOX(c,x,y,u,X,X+0.55,2.4,2.8,3.85,4.4,mudD);}for(let k=0;k<5;k++){const Y=-2.4+k*1.1;JBOX(c,x,y,u,3.8,4.2,Y,Y+0.55,3.85,4.4,mudD);}
  [-1.9,1.9].forEach((X,i)=>{RRARCH_(c,I,u,2.6,X,1.5,1.6,blue,'#3a2214','#1a0e06',null);GLOW(c,...I(X,2.65,0.9),u*1.2,'255,190,100',0.3);RRPICT2_(c,I,u,2.6,X,2.9,i?'f':'m',blueD,'#f4e8cc','rect',gold);});
  RRSLIT_(c,I,2.6,0,1.9,0.5,0.9,'#2a1a10',blue);BP(c,RIGHTF(c,I,4.02,-0.5,0.5,1.6,2.4),'#2a1a10',blue,u*0.08);
  /* roof plants and trailing vines */
  /* water jar, potted shrubs, date palms */
}};

const RESTROOM_U=0.0975;

const RESTROOM_DX={china:0.01,japan:-0.01,rome:-0.005,greece:-0.005,jurassic:-0.015,galactic:-0.04,egypt:-0.025,babylon:-0.06};
const RESTROOM_ALIAS={chinese:'china',japanese:'japan',roman:'rome','ancient_rome':'rome','ancient_greece':'greece',greek:'greece',jurassic_island:'jurassic',dino:'jurassic',dinosaur:'jurassic',galactic_outpost:'galactic',space_cantina:'galactic',outpost:'galactic',ancient_egypt:'egypt',egyptian:'egypt',ancient_babylon:'babylon',babylonian:'babylon'};

function restroomTheme(t){t=String(t||'standard').toLowerCase();return RESTROOM_ALIAS[t]||t;}
/* drawRestroom(ctx, cx, cy, R, {theme, flip, scale, dy}): (cx,cy) = centre of the hex tile, R = hex radius in px. Static, one hex, no ground. */
function drawRestroom(ctx,cx,cy,R,opts){opts=opts||{};const th=restroomTheme(opts.theme),T=RESTROOM_ART[th];if(!T)throw new Error('unknown restroom theme: '+opts.theme);
  const S=opts.scale||1,u=R*RESTROOM_U*S*(T.k||1),dy=(opts.dy===undefined?T.dy:opts.dy)*R;ctx.save();if(opts.flip){ctx.translate(cx,0);ctx.scale(-1,1);ctx.translate(-cx,0);}T.draw(ctx,cx+(opts.dx===undefined?(RESTROOM_DX[th]||0):opts.dx)*R,cy+dy,u,opts.v===undefined?0:opts.v,opts.accent);ctx.restore();}
const RESTROOM_BAKE_CACHE={};
/* bakeRestroom(theme, R, {scale, flip, pixelRatio}) -> {canvas, ox, oy, w, h, bbox}: a transparent sprite cropped to its painted pixels; (ox,oy) = where the hex centre sits inside the canvas */
function bakeRestroom(theme,R,opts){opts=opts||{};const th=restroomTheme(theme),pr=opts.pixelRatio||1,S=opts.scale||1,key=[th,R,S,!!opts.flip,pr,opts.accent||''].join('|');if(RESTROOM_BAKE_CACHE[key])return RESTROOM_BAKE_CACHE[key];
  const W=Math.ceil(R*4.2*pr),H=Math.ceil(R*5.0*pr),ax=W/2,ay=H*0.76,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');c.scale(pr,pr);drawRestroom(c,ax/pr,ay/pr,R,{theme:th,scale:S,flip:opts.flip,accent:opts.accent});
  const d=cv.getContext('2d').getImageData(0,0,W,H).data;let x0=W,y0=H,x1=0,y1=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(d[(y*W+x)*4+3]>8){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}}
  const pad=2,bx=Math.max(0,x0-pad),by=Math.max(0,y0-pad),bw=Math.min(W,x1+pad+1)-bx,bh=Math.min(H,y1+pad+1)-by,out=document.createElement('canvas');out.width=bw;out.height=bh;out.getContext('2d').drawImage(cv,bx,by,bw,bh,0,0,bw,bh);
  return RESTROOM_BAKE_CACHE[key]={canvas:out,ox:(ax-bx)/pr,oy:(ay-by)/pr,w:bw/pr,h:bh/pr,pixelRatio:pr,bbox:{left:-(ax-bx)/pr,top:-(ay-by)/pr,right:(bx+bw-ax)/pr,bottom:(by+bh-ay)/pr}};}
function drawRestroomBaked(ctx,cx,cy,sprite){ctx.drawImage(sprite.canvas,cx-sprite.ox,cy-sprite.oy,sprite.w,sprite.h);}
function restroomFootprint(R,theme,opts){return bakeRestroom(theme,R,opts).bbox;}


NEW_SPRITE_PACKS.facilities.toilets = { bake: bakeRestroom, drawBaked: drawRestroomBaked };
})();

(function () {


/* ===== core (shared by every pack) ===== */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shade(hex, amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=c=>Math.round(amt<0?c*(1+amt):c+(255-c)*amt);return `rgb(${f(r)},${f(g)},${f(b)})`;}
const TH={
  ln(ctx,a,b,c,w){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();},
  ell(ctx,x,y,rx,ry,c,rot){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot||0,0,7);ctx.fill();},
  poly(ctx,pts,fill,stroke,lw){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||1;ctx.stroke();}},
  iso(x,y,u,X,Y,Z){return[x+(X-Y)*0.7*u,y+(X+Y)*0.35*u-Z*u];},
  box(ctx,x,y,u,x0,x1,y0,y1,z0,z1,cf,ce,ct){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);
    TH.poly(ctx,[I(x0,y1,z0),I(x1,y1,z0),I(x1,y1,z1),I(x0,y1,z1)],cf);TH.poly(ctx,[I(x1,y0,z0),I(x1,y1,z0),I(x1,y1,z1),I(x1,y0,z1)],ce);
    TH.poly(ctx,[I(x0,y0,z1),I(x1,y0,z1),I(x1,y1,z1),I(x0,y1,z1)],ct);},
  blob(ctx,x,y,rx,ry,col,rnd,n){const pts=[];n=n||8;for(let k=0;k<n;k++){const a=k/n*6.283,rr=0.78+rnd()*0.3;pts.push([x+Math.cos(a)*rx*rr,y+Math.sin(a)*ry*rr]);}
    TH.poly(ctx,pts,col);ctx.fillStyle='rgba(255,255,255,.14)';ctx.beginPath();ctx.ellipse(x-rx*0.25,y-ry*0.3,rx*0.45,ry*0.35,0,0,7);ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x+rx*0.35,y+ry*0.25,rx*0.4,ry*0.5,0,0,7);ctx.fill();},
  /* pointed (lancet) arch outline in the X-Z plane at depth Y, centred on xc, half-width w */
  arch(x,y,u,Y,xc,w,z0,zs,zt){const I=(X,Z)=>TH.iso(x,y,u,X,Y,Z),L=[],Rr=[];for(let t=0;t<=8;t++){const s=t/8,q=1-s,
      X=q*q*(xc-w)+2*q*s*(xc-w*0.85)+s*s*xc,Z=q*q*zs+2*q*s*(zs+(zt-zs)*0.85)+s*s*zt;L.push(I(X,Z));Rr.push(I(2*xc-X,Z));}
    return [I(xc-w,z0)].concat(L,Rr.slice().reverse(),[I(xc+w,z0)]);}
};


const JS=(c,x,y,rx)=>{c.fillStyle='rgba(12,40,22,.28)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const JBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.28),shade(col,0.16));
const MIR=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
const BP=(c,pts,fill,stroke,lw)=>TH.poly(c,pts,fill,stroke,lw);
const BF=(c,I,x0,x1,y1,z0,z1,col)=>BP(c,[I(x0,y1,z0),I(x1,y1,z0),I(x1,y1,z1),I(x0,y1,z1)],col);
const BR=(c,I,x1,y0,y1,z0,z1,col)=>BP(c,[I(x1,y0,z0),I(x1,y1,z0),I(x1,y1,z1),I(x1,y0,z1)],col);
const BT=(c,I,x0,x1,y0,y1,z,col)=>BP(c,[I(x0,y0,z),I(x1,y0,z),I(x1,y1,z),I(x0,y1,z)],col);
const WF=(c,I,y1,X,Z,w,h,col,fr)=>BP(c,[I(X-w/2,y1,Z-h/2),I(X+w/2,y1,Z-h/2),I(X+w/2,y1,Z+h/2),I(X-w/2,y1,Z+h/2)],col,fr,fr?0.9:0);
const WR=(c,I,x1,Y,Z,w,h,col,fr)=>BP(c,[I(x1,Y-w/2,Z-h/2),I(x1,Y+w/2,Z-h/2),I(x1,Y+w/2,Z+h/2),I(x1,Y-w/2,Z+h/2)],col,fr,fr?0.9:0);
const BFL=(c,I,x0,x1,y1,z0,z1,step,col,u)=>{for(let z=z0+step;z<z1-0.01;z+=step)TH.ln(c,I(x0,y1,z),I(x1,y1,z),col,u*0.05);};
const BRL=(c,I,x1,y0,y1,z0,z1,step,col,u)=>{for(let z=z0+step;z<z1-0.01;z+=step)TH.ln(c,I(x1,y0,z),I(x1,y1,z),col,u*0.05);};
function HIP(c,I,x0,x1,y0,y1,z,H,o,cf,cr,u,tex){const yc=(y0+y1)/2,xr0=x0+(y1-y0)/2,xr1=x1-(y1-y0)/2,A=I(x0-o,y1+o,z),B=I(x1+o,y1+o,z),R1=I(xr1,yc,z+H),R0=I(xr0,yc,z+H),C=I(x1+o,y0-o,z);
  BP(c,[B,C,R1],cr);BP(c,[A,B,R1,R0],cf);
  if(tex){for(let k=1;k<=tex;k++){const t=k/(tex+1),L=[A[0]+(R0[0]-A[0])*t,A[1]+(R0[1]-A[1])*t],Rr=[B[0]+(R1[0]-B[0])*t,B[1]+(R1[1]-B[1])*t];TH.ln(c,L,Rr,'rgba(0,0,0,.16)',u*0.07);TH.ln(c,[L[0],L[1]-u*0.07],[Rr[0],Rr[1]-u*0.07],'rgba(255,255,255,.14)',u*0.05);}}
  TH.ln(c,R0,R1,shade(cf,-0.3),u*0.16);}
function GAB(c,I,x0,x1,y0,y1,z,H,o,cf,cg,u,tex){const yc=(y0+y1)/2,A=I(x0-o,y1+o,z),B=I(x1+o,y1+o,z),R1=I(x1+o,yc,z+H),R0=I(x0-o,yc,z+H);
  BP(c,[I(x1,y0,z),I(x1,y1,z),I(x1,yc,z+H*0.86)],cg);BP(c,[A,B,R1,R0],cf);
  if(tex){for(let k=1;k<=tex;k++){const t=k/(tex+1),L=[A[0]+(R0[0]-A[0])*t,A[1]+(R0[1]-A[1])*t],Rr=[B[0]+(R1[0]-B[0])*t,B[1]+(R1[1]-B[1])*t];TH.ln(c,L,Rr,'rgba(0,0,0,.16)',u*0.07);TH.ln(c,[L[0],L[1]-u*0.07],[Rr[0],Rr[1]-u*0.07],'rgba(255,255,255,.14)',u*0.05);}}
  TH.ln(c,R0,R1,shade(cf,-0.3),u*0.16);TH.ln(c,A,B,shade(cf,-0.25),u*0.1);}
const GLOW=(c,x,y,r,rgb,a)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();};
function RCYL(c,x,y,rx,ry,wh,cols){cols=cols||['#ffffff','#e9eef3','#a9b6c6'];const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,cols[0]);g.addColorStop(0.5,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y-wh);c.lineTo(x-rx,y);c.ellipse(x,y,rx,ry,0,Math.PI,0,true);c.lineTo(x+rx,y-wh);c.ellipse(x,y-wh,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();}
function RGLASS(c,pts,alpha){const ys=pts.map(p=>p[1]),g=c.createLinearGradient(0,Math.min(...ys),0,Math.max(...ys));g.addColorStop(0,RW.glass[0]);g.addColorStop(0.5,RW.glass[1]);g.addColorStop(1,RW.glass[2]);c.save();c.globalAlpha=alpha||1;c.fillStyle=g;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();c.restore();}
function RSPHERE(c,x,y,r,cols){const g=c.createRadialGradient(x-r*0.35,y-r*0.4,r*0.1,x,y,r*1.05);g.addColorStop(0,cols[0]);g.addColorStop(0.55,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();}
function ACONE(c,x,y,rx,ry,h,col,u,scal){const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,shade(col,0.18));g.addColorStop(0.5,col);g.addColorStop(1,shade(col,-0.3));c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y);c.lineTo(x,y-h);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();
  if(scal){for(let k=0;k<scal;k++){const a0=Math.PI*k/scal,a1=Math.PI*(k+1)/scal;c.fillStyle=k%2?'#fbf6e8':shade(col,-0.1);c.beginPath();c.moveTo(x+Math.cos(a0)*rx,y+Math.sin(a0)*ry);c.lineTo(x+Math.cos((a0+a1)/2)*rx,y+Math.sin((a0+a1)/2)*ry+u*0.4);c.lineTo(x+Math.cos(a1)*rx,y+Math.sin(a1)*ry);c.closePath();c.fill();}}
  c.save();c.beginPath();c.moveTo(x-rx,y);c.lineTo(x,y-h);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.clip();for(let k=0;k<=14;k++){const a=Math.PI*k/14;TH.ln(c,[x,y-h],[x+Math.cos(a)*rx,y+Math.sin(a)*ry],'rgba(0,0,0,.12)',u*0.05);}c.restore();}
function AWN(c,I,X0,X1,y1,zTop,zBot,dY,col,u){const n=Math.max(4,Math.round((X1-X0)/0.5));for(let k=0;k<n;k++){const a=X0+(X1-X0)*k/n,b=X0+(X1-X0)*(k+1)/n,cc=k%2?col[1]:col[0];BP(c,[I(a,y1,zTop),I(b,y1,zTop),I(b,y1+dY,zBot),I(a,y1+dY,zBot)],cc);const p=I(a,y1+dY,zBot),q=I(b,y1+dY,zBot);BP(c,[p,q,[(p[0]+q[0])/2,(p[1]+q[1])/2+u*0.42]],cc);}}
const RW={w:'#f4f6f8',ws:'#b9c4d1',wl:'#ffffff',teal:'#2fb8c4',tealD:'#1f8a96',org:'#ff7a3c',yel:'#ffd23c',navy:'#2a3a52',leaf:['#8fd05a','#6ab83c','#4a9a30'],glass:['#cdeef8','#8ccfe4','#4f9fc0']};
/* ===== RESTAURANT ART, batch 1. Each draw(c, x, y, u, v): (x,y) = ground centre of the hex, u = 0.075*R, v = variant seed. Static, one hex, no ground. ===== */
const RSH_=(c,x,y,rx,ry,rgb)=>{c.fillStyle='rgba('+(rgb||'40,30,18')+',.24)';c.beginPath();c.ellipse(x+rx*0.1,y+ry*0.2,rx*0.88,(ry||rx*0.4)*0.9,0,0,7);c.fill();};
const RPOST=(c,I,X,Y,z0,z1,col,u,w)=>TH.ln(c,I(X,Y,z0),I(X,Y,z1),col,u*(w||0.22));
const RCLIP=(c,pts,fn)=>{c.save();c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.clip();fn();c.restore();};
const RFRONT=(c,I,y1,x0,x1,z0,z1)=>[I(x0,y1,z0),I(x1,y1,z0),I(x1,y1,z1),I(x0,y1,z1)];
const RIGHTF=(c,I,x1,y0,y1,z0,z1)=>[I(x1,y0,z0),I(x1,y1,z0),I(x1,y1,z1),I(x1,y0,z1)];
const RBARREL=(c,x,y,u,col)=>{TH.ell(c,x,y,u*0.55,u*0.22,'rgba(0,0,0,.2)');const g=c.createLinearGradient(x-u*0.5,0,x+u*0.5,0);g.addColorStop(0,shade(col||'#9a6a3a',0.2));g.addColorStop(0.6,col||'#9a6a3a');g.addColorStop(1,shade(col||'#9a6a3a',-0.35));c.fillStyle=g;c.beginPath();c.moveTo(x-u*0.42,y);c.quadraticCurveTo(x-u*0.62,y-u*0.55,x-u*0.42,y-u*1.1);c.lineTo(x+u*0.42,y-u*1.1);c.quadraticCurveTo(x+u*0.62,y-u*0.55,x+u*0.42,y);c.closePath();c.fill();TH.ell(c,x,y-u*1.1,u*0.42,u*0.17,shade(col||'#9a6a3a',0.22));TH.ln(c,[x-u*0.55,y-u*0.35],[x+u*0.55,y-u*0.35],'#3a2a1a',u*0.09);TH.ln(c,[x-u*0.55,y-u*0.75],[x+u*0.55,y-u*0.75],'#3a2a1a',u*0.09);};
const RLANTERN=(c,x,y,u,rgb)=>{GLOW(c,x,y,u*1.3,rgb||'255,200,90',0.5);TH.ln(c,[x,y-u*0.5],[x,y-u*0.15],'#2a2018',u*0.08);TH.poly(c,[[x-u*0.18,y-u*0.15],[x+u*0.18,y-u*0.15],[x+u*0.14,y+u*0.32],[x-u*0.14,y+u*0.32]],'#ffd36a');TH.ell(c,x,y-u*0.15,u*0.2,u*0.08,'#2a2018');};
const RWINDOW=(c,I,y1,X,Z,w,h,glow,frame)=>{BP(c,[I(X-w/2-0.08,y1,Z-h/2-0.08),I(X+w/2+0.08,y1,Z-h/2-0.08),I(X+w/2+0.08,y1,Z+h/2+0.08),I(X-w/2-0.08,y1,Z+h/2+0.08)],frame||'#f4ead2');BP(c,[I(X-w/2,y1,Z-h/2),I(X+w/2,y1,Z-h/2),I(X+w/2,y1,Z+h/2),I(X-w/2,y1,Z+h/2)],glow||'#ffd27a');};
const RTOTEM=(c,x,y,u,h,pal,v)=>{const w=u*0.72,n=Math.max(2,Math.round(h/(u*1.3)));SHDW_(c,x,y,u*0.9);for(let k=0;k<n;k++){const yy=y-k*(h/n),hh=h/n,col=pal[k%pal.length];TH.poly(c,[[x-w,yy],[x+w,yy],[x+w*0.95,yy-hh],[x-w*0.95,yy-hh]],col);TH.poly(c,[[x+w,yy],[x+w,yy-hh],[x+w*0.95,yy-hh]],'rgba(0,0,0,.28)');TH.ell(c,x-w*0.38,yy-hh*0.64,u*0.2,u*0.14,'#fff6dc');TH.ell(c,x+w*0.38,yy-hh*0.64,u*0.2,u*0.14,'#fff6dc');TH.ell(c,x-w*0.38,yy-hh*0.64,u*0.08,u*0.08,'#1a1008');TH.ell(c,x+w*0.38,yy-hh*0.64,u*0.08,u*0.08,'#1a1008');TH.poly(c,[[x-w*0.2,yy-hh*0.5],[x+w*0.2,yy-hh*0.5],[x,yy-hh*0.3]],'#2a1a10');TH.poly(c,[[x-w*0.55,yy-hh*0.22],[x+w*0.55,yy-hh*0.22],[x+w*0.4,yy-hh*0.08],[x-w*0.4,yy-hh*0.08]],'#1a1008');if(k%2===0)for(let t=-1;t<=1;t++)TH.poly(c,[[x+t*w*0.32-u*0.09,yy-hh*0.22],[x+t*w*0.32+u*0.09,yy-hh*0.22],[x+t*w*0.32,yy-hh*0.12]],'#fff6dc');}
  TH.poly(c,[[x-w*1.5,y-h],[x+w*1.5,y-h],[x+w*0.5,y-h-u*0.9],[x-w*0.5,y-h-u*0.9]],pal[0]);TH.ell(c,x,y-h-u*0.9,w*0.5,u*0.2,pal[1]);};
const SHDW_=(c,x,y,rx)=>{c.fillStyle='rgba(30,20,10,.22)';c.beginPath();c.ellipse(x+rx*0.2,y+rx*0.08,rx,rx*0.34,0,0,7);c.fill();};
const RTORCH=(c,x,y,u,h)=>{TH.ln(c,[x,y],[x,y-h],'#6a4a28',u*0.2);TH.ln(c,[x,y-h*0.7],[x,y-h*0.5],'#c8a050',u*0.2);GLOW(c,x,y-h-u*0.5,u*1.5,'255,160,50',0.5);c.fillStyle='#ff8a2a';c.beginPath();c.moveTo(x-u*0.3,y-h);c.quadraticCurveTo(x-u*0.4,y-h-u*0.9,x,y-h-u*1.5);c.quadraticCurveTo(x+u*0.4,y-h-u*0.8,x+u*0.3,y-h);c.closePath();c.fill();c.fillStyle='#ffd45a';c.beginPath();c.moveTo(x-u*0.14,y-h);c.quadraticCurveTo(x-u*0.14,y-h-u*0.6,x,y-h-u*0.95);c.quadraticCurveTo(x+u*0.14,y-h-u*0.5,x+u*0.14,y-h);c.closePath();c.fill();};
const RTHATCH=(c,pts,u,base,dark,n)=>{BP(c,pts,base);RCLIP(c,pts,()=>{const A=pts[0],B=pts[1],C2=pts[2],D=pts[3];for(let k=1;k<n;k++){const t=k/n,L=[A[0]+(D[0]-A[0])*t,A[1]+(D[1]-A[1])*t],Rr=[B[0]+(C2[0]-B[0])*t,B[1]+(C2[1]-B[1])*t];TH.ln(c,L,Rr,k%2?dark:'rgba(255,240,190,.25)',u*0.1);const m=(Rr[0]-L[0])/Math.round((Rr[0]-L[0])/(u*0.5)||1);for(let q=0;q<Math.round((Rr[0]-L[0])/(u*0.5));q++){const px=L[0]+q*m+(k%2)*m*0.5,py=L[1]+(Rr[1]-L[1])*(q*m/((Rr[0]-L[0])||1));TH.ln(c,[px,py],[px+m*0.12,py+u*0.45],dark,u*0.05);}}});};
const SOFT_=(c,x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
const RSTRIPE=(c,A,B,Cc,D,n,c1,c2)=>{BP(c,[A,B,Cc,D],c1);for(let k=0;k<n;k+=2){const t0=k/n,t1=(k+1)/n,P=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];BP(c,[P(A,B,t0),P(A,B,t1),P(D,Cc,t1),P(D,Cc,t0)],c2);}};
const RBULBS=(c,pts,u,col)=>pts.forEach(p=>{GLOW(c,p[0],p[1],u*0.6,'255,220,120',0.55);TH.ell(c,p[0],p[1],u*0.13,u*0.13,col||'#fff3c0');});
const RUMBRELLA=(c,x,y,u,c1,c2)=>{TH.ln(c,[x,y],[x,y-u*2.8],'#6a4a2a',u*0.14);const r=u*1.55,cy=y-u*2.4,ap=[x,y-u*3.5];for(let k=0;k<8;k++){const a0=Math.PI*k/8,a1=Math.PI*(k+1)/8;TH.poly(c,[ap,[x+Math.cos(a0)*r,cy+Math.sin(a0)*r*0.45],[x+Math.cos(a1)*r,cy+Math.sin(a1)*r*0.45]],k%2?c2:c1);}for(let k=0;k<8;k++){const a0=Math.PI+Math.PI*k/8,a1=Math.PI+Math.PI*(k+1)/8;TH.poly(c,[ap,[x+Math.cos(a0)*r,cy+Math.sin(a0)*r*0.45],[x+Math.cos(a1)*r,cy+Math.sin(a1)*r*0.45]],k%2?c1:c2);}};
const RTABLE=(c,x,y,u,col)=>{TH.ell(c,x,y+u*0.1,u*0.9,u*0.3,'rgba(0,0,0,.18)');TH.ln(c,[x,y],[x,y-u*0.9],'#6a4a2a',u*0.14);TH.ell(c,x,y-u*0.9,u*0.75,u*0.28,col||'#f4efe0');TH.ell(c,x-u*0.2,y-u*1.0,u*0.18,u*0.07,'#d9433b');};
function EGCYL_(c,x,y,rx,ry,h,cols){const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,cols[0]);g.addColorStop(0.55,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y);c.lineTo(x-rx,y-h);c.ellipse(x,y-h,rx,ry,0,Math.PI,0,false);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();c.fillStyle=cols[0];c.beginPath();c.ellipse(x,y-h,rx,ry,0,0,7);c.fill();}
const RESTAURANT_ART={};

/* front gable (ridge runs along Y): right slope + a pediment face, used for temple fronts and glazed bays */
const FGAB_=(c,I,x0,x1,y0,y1,z,H,o,roofC,faceC,trim,u)=>{const xc=(x0+x1)/2;BP(c,[I(x1+o,y1+o,z),I(x1+o,y0,z),I(xc,y0,z+H),I(xc,y1+o,z+H)],roofC);TH.ln(c,I(xc,y0,z+H),I(xc,y1+o,z+H),shade(roofC,-0.3),u*0.14);TH.ln(c,I(x1+o,y1+o,z),I(x1+o,y0,z),shade(roofC,-0.3),u*0.1);
  BP(c,[I(x0-o,y1+o,z),I(x1+o,y1+o,z),I(xc,y1+o,z+H)],faceC,trim,u*0.1);};
/* ===== shared little props for the new lands ===== */
const RRNG_=v=>mulberry(1234+(v|0));
const RPALM_=(c,x,y,u,h,lean,col)=>{col=col||['#4f9a3c','#3a7d2c'];TH.ell(c,x,y,u*0.8,u*0.28,'rgba(20,30,10,.22)');const tx=x+lean*u,ty=y-h;c.strokeStyle='#8a6038';c.lineWidth=u*0.3;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*u*0.2,y-h*0.55,tx,ty);c.stroke();
  for(let k=0;k<7;k++){const a=k/7*6.283+0.3,dx=Math.cos(a),dy=Math.sin(a)*0.45,L=u*2.1;c.fillStyle=k%2?col[0]:col[1];c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+dx*L*0.6,ty+dy*L*0.6-u*0.9,tx+dx*L,ty+dy*L+u*0.5);c.quadraticCurveTo(tx+dx*L*0.5,ty+dy*L*0.5-u*0.1,tx,ty);c.fill();}
  TH.ell(c,tx,ty+u*0.1,u*0.22,u*0.2,'#7a5430');};
const RCYPRESS_=(c,x,y,u,h)=>{TH.ell(c,x,y,u*0.7,u*0.25,'rgba(20,30,10,.22)');const g=c.createLinearGradient(x-u*0.6,0,x+u*0.6,0);g.addColorStop(0,'#4d8a45');g.addColorStop(0.55,'#2f6a34');g.addColorStop(1,'#1e4a28');c.fillStyle=g;c.beginPath();c.moveTo(x-u*0.62,y-u*0.2);c.quadraticCurveTo(x-u*0.75,y-h*0.55,x,y-h);c.quadraticCurveTo(x+u*0.75,y-h*0.55,x+u*0.62,y-u*0.2);c.closePath();c.fill();};
const ROLIVE_=(c,x,y,u,h)=>{TH.ell(c,x,y,u*0.9,u*0.3,'rgba(20,30,10,.22)');c.strokeStyle='#7a6a58';c.lineWidth=u*0.32;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.2,y-h*0.5,x+u*0.1,y-h*0.8);c.stroke();const rn=RRNG_(Math.round(x));[[0,-h*0.95,1.25,0.8],[-1.0,-h*0.78,0.95,0.65],[1.0,-h*0.8,0.95,0.65]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy,rx*u,ry*u,['#7d9a63','#6b8a56','#8aa86e'][i],rn,9));};
const RJAR_=(c,x,y,u,col,h)=>{h=h||1.5;TH.ell(c,x,y,u*0.55,u*0.2,'rgba(0,0,0,.2)');const g=c.createLinearGradient(x-u*0.5,0,x+u*0.5,0);g.addColorStop(0,shade(col,0.22));g.addColorStop(0.55,col);g.addColorStop(1,shade(col,-0.35));c.fillStyle=g;c.beginPath();c.moveTo(x-u*0.2,y-u*h);c.quadraticCurveTo(x-u*0.62,y-u*h*0.55,x-u*0.3,y);c.lineTo(x+u*0.3,y);c.quadraticCurveTo(x+u*0.62,y-u*h*0.55,x+u*0.2,y-u*h);c.closePath();c.fill();TH.ell(c,x,y-u*h,u*0.24,u*0.09,shade(col,-0.4));TH.ln(c,[x-u*0.5,y-u*h*0.55],[x+u*0.5,y-u*h*0.55],shade(col,-0.25),u*0.07);};
const RLANT_RED_=(c,x,y,u,s)=>{s=s||1;GLOW(c,x,y+u*0.4*s,u*1.1*s,'255,70,40',0.45);TH.ln(c,[x,y-u*0.35*s],[x,y],'#3a2a1a',u*0.06);TH.ell(c,x,y+u*0.45*s,u*0.36*s,u*0.46*s,'#d8261c');TH.ell(c,x-u*0.1*s,y+u*0.35*s,u*0.1*s,u*0.18*s,'rgba(255,200,170,.55)');TH.ell(c,x,y,u*0.2*s,u*0.07*s,'#e9b43a');TH.ell(c,x,y+u*0.92*s,u*0.2*s,u*0.07*s,'#e9b43a');TH.ln(c,[x,y+u*0.95*s],[x,y+u*1.3*s],'#e9b43a',u*0.06);};
const RBOWL_=(c,x,y,u,s,steam)=>{s=s||1;TH.ell(c,x,y+u*0.5*s,u*0.9*s,u*0.28*s,'rgba(0,0,0,.18)');c.fillStyle='#f4efe6';c.beginPath();c.moveTo(x-u*0.9*s,y);c.quadraticCurveTo(x-u*0.7*s,y+u*0.75*s,x,y+u*0.8*s);c.quadraticCurveTo(x+u*0.7*s,y+u*0.75*s,x+u*0.9*s,y);c.closePath();c.fill();c.fillStyle='#c33a2b';c.fillRect(x-u*0.82*s,y+u*0.12*s,u*1.64*s,u*0.1*s);TH.ell(c,x,y,u*0.9*s,u*0.3*s,'#e8b85a');for(let k=0;k<5;k++)TH.ln(c,[x-u*0.6*s+k*u*0.3*s,y-u*0.08*s],[x-u*0.45*s+k*u*0.3*s,y+u*0.1*s],'#fff0b8',u*0.07*s);TH.ell(c,x+u*0.25*s,y-u*0.05*s,u*0.14*s,u*0.07*s,'#7bb04a');TH.ln(c,[x+u*0.1*s,y-u*0.15*s],[x+u*1.0*s,y-u*1.25*s],'#6a3a1a',u*0.08*s);TH.ln(c,[x+u*0.3*s,y-u*0.12*s],[x+u*1.2*s,y-u*1.1*s],'#6a3a1a',u*0.08*s);
  if(steam){c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=u*0.1*s;c.lineCap='round';for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(x+k*u*0.4*s,y-u*0.2*s);c.bezierCurveTo(x+k*u*0.4*s-u*0.3*s,y-u*0.6*s,x+k*u*0.4*s+u*0.3*s,y-u*0.9*s,x+k*u*0.4*s,y-u*1.3*s);c.stroke();}}};
const RNIGIRI_=(c,x,y,u,s,fish)=>{s=s||1;TH.ell(c,x,y+u*0.18*s,u*0.7*s,u*0.22*s,'rgba(0,0,0,.2)');c.fillStyle='#fbf8f0';c.beginPath();c.moveTo(x-u*0.55*s,y);c.quadraticCurveTo(x-u*0.6*s,y-u*0.4*s,x-u*0.35*s,y-u*0.42*s);c.lineTo(x+u*0.35*s,y-u*0.42*s);c.quadraticCurveTo(x+u*0.6*s,y-u*0.4*s,x+u*0.55*s,y);c.closePath();c.fill();c.fillStyle=fish||'#f26b4f';c.beginPath();c.moveTo(x-u*0.68*s,y-u*0.28*s);c.quadraticCurveTo(x,y-u*0.95*s,x+u*0.68*s,y-u*0.28*s);c.quadraticCurveTo(x,y-u*0.4*s,x-u*0.68*s,y-u*0.28*s);c.fill();c.strokeStyle='#fde7dd';c.lineWidth=u*0.06*s;c.beginPath();c.moveTo(x-u*0.4*s,y-u*0.4*s);c.quadraticCurveTo(x,y-u*0.62*s,x+u*0.4*s,y-u*0.4*s);c.stroke();};
const RCHERRY_=(c,x,y,u,h,v)=>{TH.ell(c,x,y,u*1.0,u*0.34,'rgba(20,20,10,.22)');c.strokeStyle='#5a3d2e';c.lineWidth=u*0.3;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+u*0.15,y-h*0.5,x-u*0.1,y-h*0.8);c.stroke();TH.ln(c,[x-u*0.05,y-h*0.55],[x+u*0.9,y-h*0.85],'#5a3d2e',u*0.16);const rn=RRNG_(v||3);[[-0.8,-h*0.98,1.4,0.95,'#f2a9c1'],[0.9,-h*0.95,1.3,0.9,'#f6bfd0'],[0.0,-h*1.15,1.35,0.9,'#f9cddb'],[-0.1,-h*0.85,1.1,0.7,'#ee97b3']].forEach(([dx,dy,rx,ry,col])=>TH.blob(c,x+dx*u,y+dy,rx*u,ry*u,col,rn,10));for(let k=0;k<7;k++)TH.ell(c,x+(rn()-0.5)*u*3.6,y+u*0.05+rn()*u*0.15,u*0.12,u*0.05,'#f9cddb');};
const RUPT_=(c,I,X,Y,Z,w,col,u)=>{/* small curved eave tip */const p=I(X,Y,Z);TH.poly(c,[[p[0]-u*w,p[1]+u*0.1],[p[0],p[1]-u*0.5],[p[0]+u*w,p[1]+u*0.1]],col);};

/* ---- CHINA: noodle house (red hall, a truncated green-glazed lower roof carrying a smaller upper hall, upturned eaves, lanterns, moon-gate door) ---- */
RESTAURANT_ART.china={dy:0.05,k:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),red='#c4301f',redD='#8f2216',gold='#e6b43c',tile='#2f7d6a',tileD='#1d5a4c',tileL='#4aa38a',base='#b8b0a0';RSH_(c,x,y+u*0.5,u*8.8,u*3.7);
  JBOX(c,x,y,u,-5.2,5.2,-3.2,3.2,0,0.45,base);BFL(c,I,-5.2,5.2,3.2,0,0.45,0.22,'rgba(40,40,30,.25)',u);
  JBOX(c,x,y,u,-4.5,4.5,-2.6,2.6,0.45,3.1,red);
  [-3.3,3.3].forEach(X=>{BP(c,RFRONT(c,I,2.62,X-1.0,X+1.0,1.0,2.7),'#3a1410');for(let k=-3;k<=3;k++){TH.ln(c,I(X+k*0.28,2.64,1.0),I(X+k*0.28,2.64,2.7),gold,u*0.05);TH.ln(c,I(X-1.0,2.64,1.85+k*0.26),I(X+1.0,2.64,1.85+k*0.26),gold,u*0.05);}BP(c,RFRONT(c,I,2.63,X-1.0,X+1.0,1.0,2.7),'rgba(255,190,90,.22)',gold,u*0.1);});
  const gc=I(0,2.66,1.9);c.fillStyle='#2a0f0a';c.beginPath();c.ellipse(gc[0],gc[1],u*1.55,u*1.35,0,0,7);c.fill();GLOW(c,gc[0],gc[1]+u*0.2,u*1.6,'255,190,90',0.4);c.strokeStyle=gold;c.lineWidth=u*0.16;c.beginPath();c.ellipse(gc[0],gc[1],u*1.55,u*1.35,0,0,7);c.stroke();
  TH.ell(c,gc[0],gc[1]+u*0.35,u*0.9,u*0.35,'#6a3a1c');RBOWL_(c,gc[0]-u*0.35,gc[1]+u*0.1,u*0.5,1,true);
  [-4.4,-2.2,2.2,4.4].forEach(X=>{RPOST(c,I,X,2.9,0.45,3.1,red,u,0.42);TH.ln(c,I(X,2.9,0.45),I(X,2.9,0.8),gold,u*0.5);TH.ln(c,I(X,2.9,2.7),I(X,2.9,3.1),gold,u*0.5);});
  JBOX(c,x,y,u,-4.7,4.7,2.7,3.0,3.0,3.28,redD);TH.ln(c,I(-4.7,3.0,3.16),I(4.7,3.0,3.16),gold,u*0.1);
  /* lower roof: a truncated hip (frustum) with a flat deck on top where the upper hall stands */
  const A=I(-5.7,3.6,3.28),B=I(5.7,3.6,3.28),Cc=I(3.5,2.0,4.5),D=I(-3.5,2.0,4.5),E=I(5.7,-3.6,3.28),F=I(3.5,-2.0,4.5);
  BP(c,[B,E,F,Cc],tileD);BP(c,[A,B,Cc,D],tile);
  for(let k=1;k<=5;k++){const t=k/6,L=[A[0]+(D[0]-A[0])*t,A[1]+(D[1]-A[1])*t],Rr=[B[0]+(Cc[0]-B[0])*t,B[1]+(Cc[1]-B[1])*t];TH.ln(c,L,Rr,'rgba(0,0,0,.18)',u*0.07);TH.ln(c,[L[0],L[1]-u*0.07],[Rr[0],Rr[1]-u*0.07],'rgba(255,255,255,.12)',u*0.05);const L2=[B[0]+(E[0]-B[0])*t,B[1]+(E[1]-B[1])*t],R2=[Cc[0]+(F[0]-Cc[0])*t,Cc[1]+(F[1]-Cc[1])*t];TH.ln(c,L2,R2,'rgba(0,0,0,.2)',u*0.07);}
  TH.ln(c,A,B,gold,u*0.12);TH.ln(c,B,E,shade(gold,-0.3),u*0.12);TH.ln(c,D,Cc,shade(tile,-0.3),u*0.12);TH.ln(c,Cc,F,shade(tile,-0.35),u*0.12);
  BP(c,[D,Cc,F,I(-3.5,-2.0,4.5)],tileL);
  [[-5.9,3.8],[5.9,3.8],[5.9,-3.8]].forEach(([X,Y])=>RUPT_(c,I,X,Y,3.3,0.5,tileL,u));
  /* upper hall rises from the deck */
  JBOX(c,x,y,u,-3.0,3.0,-1.5,1.5,4.5,5.9,red);
  [-1.5,1.5].forEach(X=>{BP(c,RFRONT(c,I,1.52,X-0.65,X+0.65,4.85,5.65),'#3a1410');TH.ln(c,I(X,1.54,4.85),I(X,1.54,5.65),gold,u*0.06);TH.ln(c,I(X-0.65,1.54,5.25),I(X+0.65,1.54,5.25),gold,u*0.06);BP(c,RFRONT(c,I,1.53,X-0.65,X+0.65,4.85,5.65),'rgba(255,190,90,.25)',gold,u*0.08);});
  [-2.9,0,2.9].forEach(X=>RPOST(c,I,X,1.62,4.5,5.9,red,u,0.3));
  TH.ln(c,I(-3.0,1.55,5.82),I(3.0,1.55,5.82),gold,u*0.1);TH.ln(c,I(3.02,-1.5,5.82),I(3.02,1.5,5.82),shade(gold,-0.2),u*0.1);
  HIP(c,I,-3.7,3.7,-2.2,2.2,5.9,1.9,0.25,tile,tileD,u,6);
  [[-3.95,2.45],[3.95,2.45],[3.95,-2.45]].forEach(([X,Y])=>RUPT_(c,I,X,Y,6.0,0.5,tileL,u));
  const rp=I(0,0,7.8);TH.ln(c,[rp[0],rp[1]],[rp[0],rp[1]-u*0.5],gold,u*0.12);TH.ell(c,rp[0],rp[1]-u*0.62,u*0.2,u*0.2,gold);TH.ln(c,I(-1.5,0,7.8),I(1.5,0,7.8),gold,u*0.16);
  [-4.6,-2.4,2.4,4.6].forEach(X=>{const p=I(X,3.6,3.28);RLANT_RED_(c,p[0],p[1],u,1);});
  [-2.0,2.0].forEach(X=>{const p=I(X,2.4,5.9);RLANT_RED_(c,p[0],p[1],u,0.8);});
  const st=I(4.4,4.6,0);for(let k=0;k<3;k++){TH.ell(c,st[0],st[1]-k*u*0.38,u*0.85,u*0.3,k%2?'#d8b070':'#c89a58');TH.ln(c,[st[0]-u*0.85,st[1]-k*u*0.38],[st[0]-u*0.85,st[1]-(k+1)*u*0.38],'#b08040',u*0.05);}TH.ell(c,st[0],st[1]-3*u*0.38,u*0.85,u*0.3,'#e0bf80');
  const rt=I(-1.2,5.6,0);RTABLE(c,rt[0],rt[1],u*1.15,'#d8261c');[-1,1].forEach(s=>TH.ell(c,rt[0]+s*u*1.7,rt[1]+u*0.05,u*0.42,u*0.16,'#7a4a24'));
  const bb=I(-5.0,5.0,0);RJAR_(c,bb[0],bb[1],u*1.2,'#c4301f',1.3);for(let k=0;k<4;k++){TH.ln(c,[bb[0]+(k-1.5)*u*0.2,bb[1]-u*1.6],[bb[0]+(k-1.5)*u*0.35,bb[1]-u*3.0-(k%2)*u*0.5],'#5ea04a',u*0.13);}
}};

/* ---- JAPAN: sushi bar (white plaster and dark timber, deep slate roof, indigo noren, red lanterns, a sakura tree) ---- */
RESTAURANT_ART.japan={dy:0.05,k:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),wood='#5a3a28',plas='#f1ebdd',plasD='#cfc6b2',slate='#4a5260',slateD='#2f3540',indigo='#2a3a6a';RSH_(c,x,y+u*0.5,u*8.8,u*3.6,'40,34,28');
  /* raised engawa deck */
  JBOX(c,x,y,u,-5.2,5.2,-3.0,3.4,0,0.5,'#b58a58');for(let k=0;k<11;k++)TH.ln(c,I(-5.0+k*0.98,3.4,0.5),I(-5.0+k*0.98,-3.0,0.5),'rgba(60,34,14,.25)',u*0.04);
  /* main hall, two walls in plaster with timber grid */
  JBOX(c,x,y,u,-4.6,4.6,-2.5,2.5,0.5,3.2,plas);
  [-4.6,-2.3,0,2.3,4.6].forEach(X=>RPOST(c,I,X,2.55,0.5,3.2,wood,u,0.26));TH.ln(c,I(-4.6,2.55,3.1),I(4.6,2.55,3.1),wood,u*0.26);TH.ln(c,I(-4.6,2.55,0.55),I(4.6,2.55,0.55),wood,u*0.2);TH.ln(c,I(-4.6,2.55,1.4),I(4.6,2.55,1.4),wood,u*0.1);
  [-3.45,3.45].forEach(X=>{BP(c,RFRONT(c,I,2.58,X-1.0,X+1.0,1.4,3.0),'#fff3cf');for(let k=-3;k<=3;k++)TH.ln(c,I(X+k*0.3,2.6,1.4),I(X+k*0.3,2.6,3.0),'#7a5a3a',u*0.05);for(let k=0;k<4;k++)TH.ln(c,I(X-1.0,2.6,1.4+k*0.4),I(X+1.0,2.6,1.4+k*0.4),'#7a5a3a',u*0.05);GLOW(c,I(X,2.6,2.2)[0],I(X,2.6,2.2)[1],u*1.6,'255,210,120',0.28);});
  /* open centre bay: sushi counter and a chef-less lit interior */
  BP(c,RFRONT(c,I,2.58,-1.1,1.1,0.55,3.0),'#2a1810');BP(c,RFRONT(c,I,2.6,-1.0,1.0,0.6,2.0),'#7a3a24');BP(c,RFRONT(c,I,2.61,-1.0,1.0,0.6,1.1),'#e8d6b0');RNIGIRI_(c,I(-0.5,2.65,1.55)[0],I(-0.5,2.65,1.55)[1],u*0.9,1,'#f26b4f');RNIGIRI_(c,I(0.45,2.65,1.55)[0],I(0.45,2.65,1.55)[1],u*0.9,1,'#f6a8a0');GLOW(c,I(0,2.6,1.7)[0],I(0,2.6,1.7)[1],u*1.5,'255,200,110',0.35);
  /* indigo noren curtains */
  for(let k=0;k<4;k++){const X0=-1.1+k*0.55;BP(c,[I(X0,2.7,3.0),I(X0+0.5,2.7,3.0),I(X0+0.5,2.7,2.0),I(X0,2.7,2.0)],indigo);BP(c,[I(X0+0.2,2.71,2.75),I(X0+0.3,2.71,2.75),I(X0+0.3,2.71,2.3),I(X0+0.2,2.71,2.3)],'#f4f0e4');}TH.ln(c,I(-1.15,2.7,3.02),I(1.15,2.7,3.02),'#3a2418',u*0.1);
  /* side wall details */
  [-1.2,1.2].forEach(Y=>{BP(c,RIGHTF(c,I,4.62,Y-0.55,Y+0.55,1.3,2.8),'#fff3cf',wood,u*0.1);});
  [-2.5,0,2.5].forEach(Y=>RPOST(c,I,4.62,Y,0.5,3.2,wood,u,0.22));
  /* deep slate roof with big overhang and curved ridge ends */
  HIP(c,I,-5.4,5.4,-3.3,3.3,3.2,2.2,0.3,slate,slateD,u,7);
  TH.ln(c,I(-2.1,0,5.4),I(2.1,0,5.4),'#1f242e',u*0.28);[-2.1,2.1].forEach(X=>{const p=I(X,0,5.4);TH.poly(c,[[p[0]-u*0.2,p[1]],[p[0],p[1]-u*0.6],[p[0]+u*0.2,p[1]]],'#1f242e');});
  /* torii-style entrance gate in front */
  const g1=I(-1.9,5.6,0),g2=I(1.9,5.6,0);[g1,g2].forEach(p=>{RPOST(c,I,(p===g1?-1.9:1.9),5.6,0,3.5,'#d8261c',u,0.34);});TH.ln(c,I(-2.5,5.6,3.4),I(2.5,5.6,3.4),'#1f1f26',u*0.42);TH.ln(c,I(-2.0,5.6,2.7),I(2.0,5.6,2.7),'#d8261c',u*0.24);
  /* nobori flags */
  [[-5.4,4.4,'#d8261c'],[5.4,4.6,'#d8261c']].forEach(([X,Y,col])=>{const p=I(X,Y,0);TH.ln(c,[p[0],p[1]],[p[0],p[1]-u*4.2],'#4a3a2a',u*0.12);BP(c,[[p[0],p[1]-u*4.1],[p[0]+u*0.95,p[1]-u*4.0],[p[0]+u*0.95,p[1]-u*1.4],[p[0],p[1]-u*1.5]],col);RNIGIRI_(c,p[0]+u*0.48,p[1]-u*2.3,u*0.7,1,'#fbe8c8');});
  /* lanterns on the eave */
  [-4.2,4.2].forEach(X=>{const p=I(X,3.1,3.2);RLANT_RED_(c,p[0],p[1],u,0.9);});
  /* stone lantern, sakura and bamboo fence */
  const sl=I(3.4,5.4,0);TH.ell(c,sl[0],sl[1],u*0.6,u*0.22,'rgba(0,0,0,.18)');JBOX(c,x,y,u,3.0,3.8,5.0,5.8,0,0.7,'#9a9a90');JBOX(c,x,y,u,3.1,3.7,5.1,5.7,0.7,1.15,'#ffe9b0');TH.poly(c,[I(2.9,4.9,1.2),I(3.9,4.9,1.2),I(3.4,5.4,1.8)],'#7a7a72');
  RCHERRY_(c,I(-6.6,2.6,0)[0],I(-6.6,2.6,0)[1],u,u*4.2,v);
  for(let k=0;k<6;k++){const p=I(-4.6+k*0.5,5.9,0);TH.ln(c,[p[0],p[1]],[p[0],p[1]-u*0.9],'#9fb858',u*0.2);}TH.ln(c,I(-4.7,5.9,0.7),I(-1.8,5.9,0.7),'#7a6a3a',u*0.1);
}};

/* ---- ROME / GREECE: one villa, two palettes (columned portico + pediment, hip roof, courtyard garden, amphorae) ---- */
function VILLA_(c,x,y,u,v,P){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);RSH_(c,x,y+u*0.5,u*8.8,u*3.7,'44,36,24');
  /* stylobate steps */
  JBOX(c,x,y,u,-5.4,5.4,-3.2,5.4,0,0.28,P.step);JBOX(c,x,y,u,-5.0,5.0,-3.0,5.0,0.28,0.56,P.step2);
  /* main block with painted dado and frieze */
  JBOX(c,x,y,u,-4.6,4.6,-2.8,2.4,0.56,3.7,P.wall);
  BP(c,RFRONT(c,I,2.42,-4.6,4.6,0.56,1.3),P.dado);BP(c,RIGHTF(c,I,4.62,-2.8,2.4,0.56,1.3),shade(P.dado,-0.25));TH.ln(c,I(-4.6,2.45,1.3),I(4.6,2.45,1.3),P.trim,u*0.1);
  BP(c,RFRONT(c,I,2.42,-4.6,4.6,3.2,3.7),P.band);for(let k=0;k<14;k++)BP(c,RFRONT(c,I,2.43,-4.4+k*0.65,-4.4+k*0.65+0.3,3.3,3.6),P.band2);
  /* windows with arched heads on the wings */
  [-3.6,3.6].forEach(X=>{BP(c,RFRONT(c,I,2.44,X-0.5,X+0.5,1.7,2.8),P.glass,P.trim,u*0.1);const a=I(X,2.44,2.8);c.fillStyle=P.glass;c.beginPath();c.ellipse(a[0],a[1],u*0.5*0.7,u*0.3,0,Math.PI,0);c.fill();c.strokeStyle=P.trim;c.lineWidth=u*0.1;c.beginPath();c.ellipse(a[0],a[1],u*0.5*0.7,u*0.3,0,Math.PI,0);c.stroke();TH.ln(c,I(X,2.45,1.7),I(X,2.45,3.1),P.trim,u*0.05);});
  BP(c,RIGHTF(c,I,4.62,-1.9,-0.7,1.7,2.8),P.glass,P.trim,u*0.1);BP(c,RIGHTF(c,I,4.62,0.4,1.6,1.7,2.8),P.glass,P.trim,u*0.1);
  /* roof */
  HIP(c,I,-5.0,5.0,-3.2,2.8,3.7,1.7,0.3,P.roof,P.roofD,u,6);
  /* atrium roof opening: a raised skylight */
  /* portico: doorway on the wall, then an entablature, a front-facing gabled roof (pediment) and the columns in front */
  const Dx=-1.2;BP(c,RFRONT(c,I,2.46,Dx-0.8,Dx+0.8,0.56,2.7),P.door);const dg=I(Dx,2.47,2.7);c.fillStyle=P.door;c.beginPath();c.ellipse(dg[0],dg[1],u*0.8*0.7,u*0.36,0,Math.PI,0);c.fill();c.strokeStyle=P.trim;c.lineWidth=u*0.1;c.beginPath();c.moveTo(I(Dx-0.85,2.47,0.56)[0],I(Dx-0.85,2.47,0.56)[1]);c.lineTo(I(Dx-0.85,2.47,2.7)[0],I(Dx-0.85,2.47,2.7)[1]);c.ellipse(dg[0],dg[1],u*0.85*0.7,u*0.4,0,Math.PI,0);c.lineTo(I(Dx+0.85,2.47,0.56)[0],I(Dx+0.85,2.47,0.56)[1]);c.stroke();GLOW(c,I(Dx,2.5,1.6)[0],I(Dx,2.5,1.6)[1],u*1.3,'255,200,120',0.3);
  JBOX(c,x,y,u,-3.5,3.5,2.4,3.9,3.3,3.8,P.trim);TH.ln(c,I(-3.5,3.92,3.55),I(3.5,3.92,3.55),shade(P.trim,-0.12),u*0.06);
  FGAB_(c,I,-3.5,3.5,2.4,3.9,3.8,1.5,0.15,P.roof,P.ped,P.trim,u);
  BP(c,[I(-2.75,3.95,3.95),I(2.75,3.95,3.95),I(0,3.95,5.0)],P.pedIn);const em=I(0,3.96,4.3);TH.ell(c,em[0],em[1],u*0.36,u*0.36,P.emblem);TH.ell(c,em[0],em[1],u*0.2,u*0.2,P.pedIn);
  [-3.2,-2.2,2.2,3.2].forEach(X=>{const b=I(X,3.6,0.28),t=I(X,3.6,3.3);const g=c.createLinearGradient(b[0]-u*0.32,0,b[0]+u*0.32,0);g.addColorStop(0,shade(P.col,0.15));g.addColorStop(0.5,P.col);g.addColorStop(1,shade(P.col,-0.3));c.fillStyle=g;c.fillRect(b[0]-u*0.3,t[1],u*0.6,b[1]-t[1]);for(let k=-1;k<=1;k++)TH.ln(c,[b[0]+k*u*0.16,t[1]],[b[0]+k*u*0.16,b[1]],'rgba(0,0,0,.12)',u*0.04);TH.ell(c,b[0],b[1],u*0.42,u*0.15,shade(P.col,-0.05));TH.ell(c,t[0],t[1],u*0.42,u*0.15,shade(P.col,0.1));});
  /* long low garden wall with a statue plinth */
  /* courtyard: fountain, tables with striped awning cloth, planters */
  const fo=I(-3.8,6.4,0);TH.ell(c,fo[0],fo[1],u*1.35,u*0.52,P.step);TH.ell(c,fo[0],fo[1]-u*0.15,u*1.15,u*0.42,P.water);TH.ln(c,[fo[0],fo[1]-u*0.1],[fo[0],fo[1]-u*1.1],P.step,u*0.28);TH.ell(c,fo[0],fo[1]-u*1.15,u*0.5,u*0.18,P.step);c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=u*0.08;c.beginPath();c.moveTo(fo[0],fo[1]-u*1.2);c.quadraticCurveTo(fo[0]-u*0.5,fo[1]-u*1.7,fo[0]-u*0.7,fo[1]-u*0.5);c.moveTo(fo[0],fo[1]-u*1.2);c.quadraticCurveTo(fo[0]+u*0.5,fo[1]-u*1.7,fo[0]+u*0.7,fo[1]-u*0.5);c.stroke();
  const t1=I(3.6,6.6,0),t2=I(0.0,7.4,0);[t1,t2].forEach(t=>{RTABLE(c,t[0],t[1],u*1.1,P.cloth);});
  TH.poly(c,[[t1[0]-u*1.3,t1[1]-u*2.4],[t1[0]+u*1.3,t1[1]-u*2.4],[t1[0]+u*1.1,t1[1]-u*1.7],[t1[0]-u*1.1,t1[1]-u*1.7]],P.cloth);TH.ln(c,[t1[0]-u*1.2,t1[1]-u*1.7],[t1[0]-u*1.2,t1[1]-u*0.2],'#7a6a58',u*0.07);TH.ln(c,[t1[0]+u*1.2,t1[1]-u*1.7],[t1[0]+u*1.2,t1[1]-u*0.2],'#7a6a58',u*0.07);
  P.tree(c,I(5.9,3.4,0)[0],I(5.9,3.4,0)[1],u,u*P.treeH);P.tree(c,I(-6.4,1.8,0)[0],I(-6.4,1.8,0)[1],u,u*P.treeH*0.72);
  const a1=I(-5.5,4.9,0),a2=I(5.5,5.8,0);RJAR_(c,a1[0],a1[1],u*1.1,P.jar,1.7);RJAR_(c,a2[0],a2[1],u*1.1,P.jar2,1.5);
  /* green planter hedges flanking the steps */
  [[-4.8,5.8],[4.6,5.0]].forEach(([X,Y])=>{const p=I(X,Y,0);const rn=RRNG_(Math.round(X*9));JBOX(c,x,y,u,X-0.7,X+0.7,Y-0.5,Y+0.5,0,0.5,P.step);TH.blob(c,p[0],p[1]-u*0.8,u*0.9,u*0.55,'#4f8a45',rn,8);});
}
RESTAURANT_ART.rome={dy:0.05,k:1,draw(c,x,y,u,v){VILLA_(c,x,y,u,v,{step:'#d9d2c0',step2:'#e6e0d0',wall:'#e9d3a0',dado:'#a8352a',trim:'#f5efe0',band:'#f0e4c4',band2:'#c9a36a',glass:'#4a3a2e',roof:'#c0552f',roofD:'#8e3a1e',ped:'#efe5cf',pedIn:'#d3b383',emblem:'#a8352a',col:'#f2ead8',door:'#3a2418',water:'#7ec3d6',cloth:'#a8352a',jar:'#b4542a',jar2:'#8f3d1e',tree:RCYPRESS_,treeH:5.2});}};
RESTAURANT_ART.greece={dy:0.05,k:1,draw(c,x,y,u,v){VILLA_(c,x,y,u,v,{step:'#e4e8ee',step2:'#f0f3f7',wall:'#fbfbf8',dado:'#6aa6d6',trim:'#ffffff',band:'#eef3f8',band2:'#2f78c4',glass:'#2d4a6a',roof:'#f3f5f8',roofD:'#d3dae4',ped:'#ffffff',pedIn:'#cfe2f4',emblem:'#2f78c4',col:'#ffffff',door:'#1f5fae',water:'#5fc0e0',cloth:'#2f78c4',jar:'#ece3d0',jar2:'#c9a36a',tree:ROLIVE_,treeH:4.2});}};

/* ---- BABYLON: stepped mud-brick villa with blue glazed-tile bands, golden friezes, and gardens spilling off every terrace ---- */
RESTAURANT_ART.babylon={dy:0.05,k:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),mud='#d4b274',mudD='#b8955a',blue='#1f5fb4',blueD='#143f82',gold='#e6b43c',rn=RRNG_(77+(v|0));RSH_(c,x,y+u*0.5,u*8.8,u*3.8,'50,36,18');
  const leaf=(X,Y,Z,rx,ry,col)=>{const p=I(X,Y,Z);TH.blob(c,p[0],p[1]-u*0.3,u*rx,u*ry,col||'#4f9a3c',rn,9);};
  const brick=(x0,x1,y1,z0,z1,w)=>{for(let z=z0+0.4;z<z1;z+=0.4)TH.ln(c,I(x0,y1,z),I(x1,y1,z),'rgba(80,50,20,.22)',u*0.04);for(let r=0;r<Math.round((z1-z0)/0.4);r++)for(let X=x0+((r%2)*0.3);X<x1;X+=0.6)TH.ln(c,I(X,y1,z0+r*0.4),I(X,y1,z0+r*0.4+0.4),'rgba(80,50,20,.16)',u*0.04);};
  /* tier 1 */
  JBOX(c,x,y,u,-5.0,5.0,-3.2,3.0,0,2.2,mud);brick(-5.0,5.0,3.02,0,2.2);BR(c,I,5.0,-3.2,3.0,0,2.2,'rgba(60,40,10,.18)');
  BP(c,RFRONT(c,I,3.03,-5.0,5.0,1.5,1.95),blue);for(let k=0;k<16;k++)BP(c,RFRONT(c,I,3.04,-4.8+k*0.62,-4.8+k*0.62+0.3,1.58,1.87),gold);BP(c,RIGHTF(c,I,5.03,-3.2,3.0,1.5,1.95),blueD);
  JBOX(c,x,y,u,-5.2,5.2,-3.4,3.2,2.2,2.5,mudD);
  /* door: pointed arch framed in blue glazed brick */
  BP(c,RFRONT(c,I,3.05,-1.1,1.1,0,1.9),blue);BP(c,RFRONT(c,I,3.06,-0.8,0.8,0,1.7),'#3a2214');const da=I(0,3.07,1.7);c.fillStyle='#3a2214';c.beginPath();c.ellipse(da[0],da[1],u*0.8*0.7,u*0.45,0,Math.PI,0);c.fill();c.strokeStyle=blue;c.lineWidth=u*0.2;c.beginPath();c.ellipse(da[0],da[1],u*0.95*0.7,u*0.52,0,Math.PI,0);c.stroke();GLOW(c,I(0,3.1,1.0)[0],I(0,3.1,1.0)[1],u*1.3,'255,190,100',0.35);
  [-3.4,3.4].forEach(X=>{BP(c,RFRONT(c,I,3.05,X-0.4,X+0.4,0.6,1.3),'#2a1a10');BP(c,RFRONT(c,I,3.06,X-0.4,X+0.4,1.2,1.3),blue);});
  /* pot gardens on tier 1 ledge */
  for(let k=0;k<7;k++){const X=-4.6+k*1.55;leaf(X,3.35,2.5,0.7,0.5,k%2?'#4f9a3c':'#62ae48');if(k%2===0)for(let t=0;t<3;t++)TH.ln(c,I(X+(t-1)*0.35,3.35,2.5),I(X+(t-1)*0.45,3.45,1.2-t*0.2),'#4f9a3c',u*0.1);}
  /* tier 2 */
  JBOX(c,x,y,u,-3.8,3.8,-2.4,2.0,2.5,4.6,mud);brick(-3.8,3.8,2.02,2.5,4.6);BR(c,I,3.8,-2.4,2.0,2.5,4.6,'rgba(60,40,10,.18)');
  BP(c,RFRONT(c,I,2.03,-3.8,3.8,3.5,3.95),blue);for(let k=0;k<12;k++)BP(c,RFRONT(c,I,2.04,-3.6+k*0.62,-3.6+k*0.62+0.3,3.58,3.87),gold);
  [-2.2,0,2.2].forEach(X=>{BP(c,RFRONT(c,I,2.04,X-0.4,X+0.4,2.8,3.4),'#2a1a10');const a=I(X,2.05,3.4);c.fillStyle='#2a1a10';c.beginPath();c.ellipse(a[0],a[1],u*0.28,u*0.2,0,Math.PI,0);c.fill();GLOW(c,I(X,2.1,3.0)[0],I(X,2.1,3.0)[1],u*0.9,'255,190,100',0.3);});
  JBOX(c,x,y,u,-4.0,4.0,-2.6,2.2,4.6,4.9,mudD);
  for(let k=0;k<8;k++){const X=-3.8+k*1.1;leaf(X,2.4,5.2,0.65,0.5,k%2?'#4f9a3c':'#62ae48');}
  /* trailing vines down the front */
  [-3.4,-1.2,1.6,3.4].forEach((X,i)=>{const t=I(X,2.5,4.9);for(let k=0;k<3;k++)TH.ln(c,[t[0]+(k-1)*u*0.25,t[1]],[t[0]+(k-1)*u*0.4,t[1]+u*(1.6+k*0.4+i%2*0.5)],'#4f9a3c',u*0.14);for(let k=0;k<4;k++)TH.ell(c,t[0]+(k-1.5)*u*0.25,t[1]+u*(0.6+k*0.5),u*0.17,u*0.12,'#7ac25a');});
  /* tier 3 with crenellations and a tiny shrine */
  JBOX(c,x,y,u,-2.5,2.5,-1.6,1.2,4.9,6.5,mud);brick(-2.5,2.5,1.22,4.9,6.5);BR(c,I,2.5,-1.6,1.2,4.9,6.5,'rgba(60,40,10,.2)');
  BP(c,RFRONT(c,I,1.23,-2.5,2.5,5.7,6.1),blue);for(let k=0;k<8;k++)BP(c,RFRONT(c,I,1.24,-2.3+k*0.62,-2.3+k*0.62+0.3,5.75,6.05),gold);
  const dg=I(0,1.25,5.6);BP(c,RFRONT(c,I,1.25,-0.5,0.5,4.9,5.5),'#2a1a10');
  for(let k=0;k<6;k++){const X=-2.4+k*0.96;JBOX(c,x,y,u,X,X+0.5,-1.6,-1.2,6.5,7.0,mudD);JBOX(c,x,y,u,X,X+0.5,1.0,1.4,6.5,7.0,mudD);}
  [-2.4,2.0].forEach(X=>{JBOX(c,x,y,u,X,X+0.5,-1.6,1.4,6.5,6.9,mudD);});
  /* roof garden spilling over the top */
  [[-1.2,0,7.0,1.2,0.8],[0.6,-0.4,7.1,1.1,0.8],[1.5,0.4,6.9,0.9,0.6],[-0.2,0.6,7.2,1.0,0.7]].forEach(([X,Y,Z,rx,ry],i)=>leaf(X,Y,Z,rx,ry,['#4f9a3c','#62ae48','#3f8a35','#78c25a'][i]));
  /* date palms and potted shrubs around the foot */
  RPALM_(c,I(-6.0,2.6,0)[0],I(-6.0,2.6,0)[1],u,u*5.6,-0.4);RPALM_(c,I(6.1,-0.8,0)[0],I(6.1,-0.8,0)[1],u,u*6.4,0.5);RPALM_(c,I(6.4,2.6,0)[0],I(6.4,2.6,0)[1],u,u*4.2,0.3);
  [[-4.8,5.0,'#4f9a3c'],[-2.6,5.6,'#62ae48'],[2.5,5.8,'#4f9a3c']].forEach(([X,Y,col])=>{const p=I(X,Y,0);RJAR_(c,p[0],p[1],u*1.0,'#b0653a',1.0);TH.blob(c,p[0],p[1]-u*1.35,u*0.8,u*0.55,col,rn,8);});
  /* tables with parasol cloth on the front court */
  const t1=I(0.6,5.2,0);RTABLE(c,t1[0],t1[1],u*1.1,'#f4efe0');TH.poly(c,[[t1[0]-u*1.3,t1[1]-u*2.4],[t1[0]+u*1.3,t1[1]-u*2.4],[t1[0]+u*1.1,t1[1]-u*1.7],[t1[0]-u*1.1,t1[1]-u*1.7]],blue);TH.ln(c,[t1[0]-u*1.2,t1[1]-u*1.7],[t1[0]-u*1.2,t1[1]-u*0.2],'#7a6a58',u*0.07);TH.ln(c,[t1[0]+u*1.2,t1[1]-u*1.7],[t1[0]+u*1.2,t1[1]-u*0.2],'#7a6a58',u*0.07);
}};

/* ---- JURASSIC ISLAND: timber-and-glass island resort lodge (green roof, glazed atrium, wraparound deck, palms, a safari jeep) ---- */
RESTAURANT_ART.jurassic={dy:0.05,k:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),cream='#efe6cc',stone='#8f8a78',wood='#8a5a34',woodD='#5e3a1e',roof='#2f7a45',roofD='#1d5530',amber='#f2a62c',rn=RRNG_(31+(v|0));RSH_(c,x,y+u*0.5,u*8.8,u*3.7,'20,40,16');
  RPALM_(c,I(-6.2,-2.4,0)[0],I(-6.2,-2.4,0)[1],u,u*5.6,-0.5,['#3f9a3c','#2d7a2c']);RPALM_(c,I(6.2,-3.2,0)[0],I(6.2,-3.2,0)[1],u,u*6.2,0.6,['#3f9a3c','#2d7a2c']);RPALM_(c,I(-1.0,-4.4,0)[0],I(-1.0,-4.4,0)[1],u,u*5.8,-0.2,['#4aa840','#2d7a2c']);
  /* stone plinth + timber deck */
  JBOX(c,x,y,u,-5.2,5.2,-3.0,3.0,0,0.7,stone);for(let k=0;k<9;k++)TH.ln(c,I(-5.0+k*1.25,3.02,0),I(-5.0+k*1.25,3.02,0.7),'rgba(40,40,30,.3)',u*0.05);
  /* main lodge body */
  JBOX(c,x,y,u,-4.7,4.7,-2.6,2.6,0.7,3.6,cream);
  [-4.7,-2.35,0,2.35,4.7].forEach(X=>RPOST(c,I,X,2.65,0.7,3.6,wood,u,0.3));TH.ln(c,I(-4.7,2.65,3.5),I(4.7,2.65,3.5),woodD,u*0.28);TH.ln(c,I(-4.7,2.65,0.75),I(4.7,2.65,0.75),woodD,u*0.22);
  [-3.5,3.5].forEach(X=>{BP(c,RFRONT(c,I,2.66,X-0.9,X+0.9,1.5,3.1),'#5aa9b8',woodD,u*0.1);GLOW(c,I(X,2.7,2.3)[0],I(X,2.7,2.3)[1],u*1.4,'255,225,150',0.22);for(let k=-1;k<=1;k++)TH.ln(c,I(X+k*0.45,2.68,1.5),I(X+k*0.45,2.68,3.1),woodD,u*0.05);TH.ln(c,I(X-0.9,2.68,2.3),I(X+0.9,2.68,2.3),woodD,u*0.05);});
  [-1.6,0.4].forEach(Y=>BP(c,RIGHTF(c,I,4.72,Y-0.5,Y+0.5,1.6,3.0),'#5aa9b8',woodD,u*0.1));
  /* big green roof */
  GAB(c,I,-4.7,4.7,-2.6,2.6,3.6,2.3,0.7,roof,'#e8dcb4',u,7);
  {const gp=I(4.72,0,5.0);TH.ell(c,gp[0],gp[1],u*0.5,u*0.5,woodD);TH.ell(c,gp[0],gp[1],u*0.36,u*0.36,'#f6c455');GLOW(c,gp[0],gp[1],u*1.2,'255,200,90',0.35);for(let k=-2;k<=2;k++)TH.ln(c,I(4.72,k*0.45,3.65),I(4.72,k*0.25,4.3-Math.abs(k)*0.28),woodD,u*0.06);}
  /* amber-lit gable end with a timber lattice */
  /* glazed atrium bay projecting at the front */
  JBOX(c,x,y,u,-1.9,1.9,2.6,4.7,0.7,3.5,'#8dd0d6');
  BP(c,RFRONT(c,I,4.72,-1.9,1.9,0.8,3.4),'#7bc4cf');for(let k=-3;k<=3;k++)TH.ln(c,I(k*0.5,4.74,0.8),I(k*0.5,4.74,3.4),woodD,u*0.07);for(let k=0;k<5;k++)TH.ln(c,I(-1.9,4.74,0.8+k*0.65),I(1.9,4.74,0.8+k*0.65),woodD,u*0.07);GLOW(c,I(0,4.8,2.0)[0],I(0,4.8,2.0)[1],u*1.8,'255,230,160',0.3);
  BP(c,RIGHTF(c,I,1.92,2.6,4.7,0.8,3.4),'#5aa9b8',woodD,u*0.08);
  FGAB_(c,I,-1.9,1.9,2.6,4.7,3.5,1.7,0.3,roof,'#8dd0d6',woodD,u);for(let k=-2;k<=2;k++)TH.ln(c,I(k*0.45,4.98,3.5+Math.max(0,0)),I(k*0.2,4.98,3.5+1.7*(1-Math.abs(k*0.45)/1.9)*0.95),woodD,u*0.05);TH.ln(c,I(-1.5,4.98,3.95),I(1.5,4.98,3.95),woodD,u*0.05);
  /* wraparound deck with railing in front */
  BT(c,I,-5.4,5.4,3.0,5.6,0.55,'#b98a56');JBOX(c,x,y,u,-5.4,5.4,5.4,5.6,0.2,0.55,woodD);for(let k=0;k<12;k++)TH.ln(c,I(-5.2+k*0.95,3.0,0.55),I(-5.2+k*0.95,5.6,0.55),'rgba(60,34,14,.25)',u*0.04);
  /* entrance steps */
  BT(c,I,-1.4,1.4,5.6,6.6,0.28,'#a67a48');BF(c,I,-1.4,1.4,6.6,0,0.28,woodD);
  for(let k=0;k<12;k++){const X=-5.2+k*0.95;if(Math.abs(X)<1.5)continue;RPOST(c,I,X,5.55,0.55,1.5,woodD,u,0.14);}TH.ln(c,I(-5.3,5.55,1.5),I(-1.5,5.55,1.5),woodD,u*0.14);TH.ln(c,I(1.5,5.55,1.5),I(5.3,5.55,1.5),woodD,u*0.14);TH.ln(c,I(5.3,3.0,1.5),I(5.3,5.55,1.5),woodD,u*0.14);RPOST(c,I,5.3,3.0,0.55,1.5,woodD,u,0.14);
  /* entry gate posts with an amber footprint banner */
  [-1.9,1.9].forEach(X=>RPOST(c,I,X,6.8,0,4.6,woodD,u,0.4));TH.ln(c,I(-2.3,6.8,4.4),I(2.3,6.8,4.4),woodD,u*0.4);
  const bn=I(0,6.85,3.5);BP(c,[[bn[0]-u*1.55,bn[1]-u*0.55],[bn[0]+u*1.55,bn[1]-u*0.55],[bn[0]+u*1.55,bn[1]+u*1.05],[bn[0],bn[1]+u*1.4],[bn[0]-u*1.55,bn[1]+u*1.05]],amber,woodD,u*0.08);
  TH.ell(c,bn[0],bn[1]+u*0.55,u*0.42,u*0.34,'#3a2412');[-0.55,0,0.55].forEach((dx,i)=>TH.ell(c,bn[0]+dx*u,bn[1]-u*0.1-(i===1?u*0.15:0),u*0.15,u*0.2,'#3a2412'));
  /* torches */
  RTORCH(c,I(-2.3,6.4,0)[0],I(-2.3,6.4,0)[1],u,u*1.9);RTORCH(c,I(2.3,6.4,0)[0],I(2.3,6.4,0)[1],u,u*1.9);
  /* palms, ferns, safari jeep */
  
  [[5.9,4.6],[-5.9,4.4],[-4.0,6.6]].forEach(([X,Y],i)=>{const p=I(X,Y,0);TH.ell(c,p[0],p[1],u*1.0,u*0.34,'rgba(20,40,16,.22)');for(let k=0;k<9;k++){const a=-Math.PI+k/8*Math.PI;c.strokeStyle=k%2?'#3f9a3c':'#5fb84a';c.lineWidth=u*0.2;c.lineCap='round';c.beginPath();c.moveTo(p[0],p[1]);c.quadraticCurveTo(p[0]+Math.cos(a)*u*0.9,p[1]-u*1.3,p[0]+Math.cos(a)*u*1.5,p[1]-u*0.3+Math.sin(a)*u*0.2);c.stroke();}});
  /* jeep */
  const j=I(4.6,6.9,0);TH.ell(c,j[0],j[1]+u*0.1,u*1.9,u*0.6,'rgba(0,0,0,.25)');JBOX(c,x,y,u,3.4,5.8,6.3,7.5,0.35,1.15,'#c9b27a');JBOX(c,x,y,u,3.4,4.6,6.3,7.5,1.15,1.7,'#c9b27a');BP(c,[I(3.4,7.52,1.15),I(4.6,7.52,1.15),I(4.6,7.52,1.7),I(3.4,7.52,1.7)],'#5a8a9a');TH.ln(c,I(3.5,6.4,1.7),I(3.5,6.4,2.5),'#3a3a3a',u*0.1);TH.ln(c,I(4.7,6.4,1.7),I(4.7,6.4,2.5),'#3a3a3a',u*0.1);TH.ln(c,I(3.5,7.4,1.7),I(3.5,7.4,2.5),'#3a3a3a',u*0.1);TH.ln(c,I(3.5,6.4,2.5),I(3.5,7.4,2.5),'#3a3a3a',u*0.1);BP(c,[I(3.4,7.52,0.7),I(5.8,7.52,0.7),I(5.8,7.52,0.95),I(3.4,7.52,0.95)],'#c0392b');
  [[3.9,7.55],[5.3,7.55]].forEach(([X,Y])=>{const w=I(X,Y,0.35);TH.ell(c,w[0],w[1],u*0.42,u*0.42,'#242424');TH.ell(c,w[0],w[1],u*0.18,u*0.18,'#a8a8a8');});
}};

/* ---- GALACTIC OUTPOST: round ochre cantina under a wide flat bronze roof disc (tall drum, patterned frieze band, arched ornate door, hanging banners, a domed tower and a rock spire) ---- */
RESTAURANT_ART.galactic={dy:0.05,k:1,draw(c,x,y,u,v){const tan=['#e9cf96','#cfae6c','#8f7142'],tanL=['#efd9a6','#d8ba7c','#a08150'],bronze=['#6e625a','#4f4640','#2c2622'],rn=RRNG_(55+(v|0));
  const cx0=x-u*0.9,cy0=y+u*0.2,r=u*3.9,ry=r*0.5,hh=u*5.0;RSH_(c,x,y+u*0.6,u*8.8,u*3.7,'60,40,16');
  /* tower behind the drum on the left, with a small silver dome and antenna */
  const tx=cx0-u*3.9,ty=cy0-u*1.0,tr=u*1.9,th=u*7.0;EGCYL_(c,tx,ty,tr,tr*0.5,th,tan);
  c.save();c.beginPath();c.moveTo(tx-tr,ty);c.lineTo(tx-tr,ty-th);c.lineTo(tx+tr,ty-th);c.lineTo(tx+tr,ty);c.ellipse(tx,ty,tr,tr*0.5,0,0,Math.PI,false);c.closePath();c.clip();for(let k=1;k<5;k++)TH.ln(c,[tx-tr,ty-th*k/5],[tx+tr,ty-th*k/5],'rgba(90,60,20,.1)',u*0.05);c.restore();
  [[0.0,-0.12],[0.35,-0.36]].forEach(([dx,dz])=>{});
  TH.ell(c,tx,ty-th*0.55,tr*0.22,tr*0.34,'#5a4a30');TH.ell(c,tx,ty-th*0.55,tr*0.12,tr*0.22,'#ffb860');
  c.fillStyle='#b8bcc4';c.beginPath();c.ellipse(tx,ty-th,tr*1.1,tr*0.55,0,0,7);c.fill();const dm=c.createRadialGradient(tx-tr*0.3,ty-th-tr*0.7,tr*0.1,tx,ty-th-tr*0.2,tr*1.1);dm.addColorStop(0,'#f0f2f6');dm.addColorStop(1,'#8a92a0');c.fillStyle=dm;c.beginPath();c.ellipse(tx,ty-th,tr*1.0,tr*0.5,0,Math.PI,0,true);c.bezierCurveTo(tx+tr,ty-th-tr*1.0,tx+tr*0.4,ty-th-tr*1.3,tx,ty-th-tr*1.3);c.bezierCurveTo(tx-tr*0.4,ty-th-tr*1.3,tx-tr,ty-th-tr*1.0,tx-tr,ty-th);c.fill();
  TH.ln(c,[tx,ty-th-tr*1.25],[tx,ty-th-tr*3.2],'#7a8090',u*0.1);TH.ln(c,[tx-tr*0.5,ty-th-tr*2.3],[tx+tr*0.5,ty-th-tr*2.0],'#7a8090',u*0.08);TH.ell(c,tx,ty-th-tr*3.25,u*0.1,u*0.1,'#ff5a4a');
  /* main drum */
  EGCYL_(c,cx0,cy0,r,ry,hh,tan);
  c.save();c.beginPath();c.moveTo(cx0-r,cy0-hh);c.lineTo(cx0-r,cy0);c.ellipse(cx0,cy0,r,ry,0,Math.PI,0,true);c.lineTo(cx0+r,cy0-hh);c.closePath();c.clip();
  /* plaster weathering and soft shading toward the right edge */
  for(let k=0;k<26;k++){const px=cx0-r+rn()*2*r,py=cy0-hh+rn()*hh;SOFT_(c,px,py,u*(0.5+rn()*0.9),u*(0.3+rn()*0.5),rn()<0.5?'150,110,60':'255,235,190',0.13);}
  const sh=c.createLinearGradient(cx0-r,0,cx0+r,0);sh.addColorStop(0,'rgba(255,240,200,.14)');sh.addColorStop(0.6,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(40,24,6,.34)');c.fillStyle=sh;c.fillRect(cx0-r,cy0-hh-ry,r*2,hh+ry*2.2);
  c.restore();
  /* the dark patterned frieze band under the roof, and the red stripe near the base */
  const band=(z0,z1,fill)=>{c.beginPath();c.moveTo(cx0-r,cy0-z1);c.lineTo(cx0-r,cy0-z0);c.ellipse(cx0,cy0-z0,r,ry,0,Math.PI,0,true);c.lineTo(cx0+r,cy0-z1);c.ellipse(cx0,cy0-z1,r,ry,0,0,Math.PI,false);c.closePath();c.fillStyle=fill;c.fill();};
  band(hh-u*0.95,hh-u*0.1,'#3a3a34');
  for(let k=0;k<=24;k++){const t=Math.PI*k/24,px=cx0+Math.cos(t)*r,py=cy0-hh+u*0.52+Math.sin(t)*ry,w=Math.max(0.15,Math.sin(t))*u*0.3;if(k%2===0){c.fillStyle='#8a8062';c.fillRect(px-w/2,py-u*0.26,w,u*0.2);c.fillRect(px-w/2,py+u*0.06,w,u*0.2);}else{c.fillStyle='#8a8062';c.fillRect(px-w/2,py-u*0.1,w,u*0.2);}}
  band(u*0.75,u*1.2,'#9a3a2a');
  /* wide flat bronze roof disc */
  const rr=u*4.55,rry=rr*0.5,rz=hh+u*0.25;EGCYL_(c,cx0,cy0-rz+u*0.45,rr,rry,u*0.45,bronze);c.fillStyle='#5a504a';c.beginPath();c.ellipse(cx0,cy0-rz,rr,rry,0,0,7);c.fill();const rg=c.createLinearGradient(cx0-rr,0,cx0+rr,0);rg.addColorStop(0,'#8a7e74');rg.addColorStop(0.5,'#6a5e56');rg.addColorStop(1,'#3e3630');c.fillStyle=rg;c.beginPath();c.ellipse(cx0,cy0-rz,rr*0.97,rry*0.95,0,0,7);c.fill();c.strokeStyle='rgba(255,230,190,.2)';c.lineWidth=u*0.08;c.beginPath();c.ellipse(cx0,cy0-rz,rr*0.8,rry*0.8,0,0,7);c.stroke();
  TH.ell(c,cx0+u*0.3,cy0-rz-u*0.05,u*1.3,u*0.6,'#4a403a');TH.ell(c,cx0+u*0.3,cy0-rz-u*0.3,u*1.0,u*0.42,'#9a8e84');TH.ell(c,cx0+u*0.3,cy0-rz-u*0.55,u*0.45,u*0.2,'#b8aca0');
  /* medallions on the wall */
  [2.55,0.62].forEach((t)=>{const px=cx0+Math.cos(t)*r,py=cy0-hh*0.46+Math.sin(t)*ry,k=Math.max(0.35,Math.sin(t));c.save();c.translate(px,py);c.scale(k,1);c.fillStyle='rgba(120,90,50,.25)';c.beginPath();c.arc(0,0,u*0.65,0,7);c.fill();c.strokeStyle='rgba(90,64,32,.55)';c.lineWidth=u*0.09;c.beginPath();c.arc(0,0,u*0.65,0,7);c.stroke();c.beginPath();c.arc(0,0,u*0.4,0,7);c.stroke();c.restore();});
  /* grand arched door with a patterned frame */
  const dx0=cx0,dy0=cy0+ry-u*0.1,dw=u*1.3,dh=u*2.7;
  c.fillStyle='#4f5a4c';c.beginPath();c.moveTo(dx0-dw-u*0.45,dy0+u*0.15);c.lineTo(dx0-dw-u*0.45,dy0-dh);c.ellipse(dx0,dy0-dh,dw+u*0.45,u*1.35,0,Math.PI,0);c.lineTo(dx0+dw+u*0.45,dy0+u*0.15);c.closePath();c.fill();
  for(let k=0;k<8;k++){const a=Math.PI+Math.PI*(k+0.5)/8;c.fillStyle='#8a9a86';c.fillRect(dx0+Math.cos(a)*(dw+u*0.22)-u*0.1,dy0-dh+Math.sin(a)*u*1.1-u*0.1,u*0.2,u*0.2);}for(let k=0;k<5;k++){c.fillStyle='#8a9a86';c.fillRect(dx0-dw-u*0.32,dy0-dh*(k+0.5)/5.5-u*0.1,u*0.2,u*0.2);c.fillRect(dx0+dw+u*0.12,dy0-dh*(k+0.5)/5.5-u*0.1,u*0.2,u*0.2);}
  c.fillStyle='#1a1008';c.beginPath();c.moveTo(dx0-dw,dy0+u*0.15);c.lineTo(dx0-dw,dy0-dh);c.ellipse(dx0,dy0-dh,dw,u*0.95,0,Math.PI,0);c.lineTo(dx0+dw,dy0+u*0.15);c.closePath();c.fill();GLOW(c,dx0,dy0-u*0.8,u*2.2,'255,170,80',0.35);c.fillStyle='rgba(120,70,30,.9)';c.fillRect(dx0-dw*0.8,dy0-dh*0.9,dw*1.6,dh*0.9+u*0.1);for(let k=1;k<4;k++)TH.ln(c,[dx0-dw*0.8+dw*1.6*k/4,dy0-dh*0.9],[dx0-dw*0.8+dw*1.6*k/4,dy0+u*0.1],'rgba(40,20,8,.6)',u*0.06);
  c.strokeStyle='#5a4a3a';c.lineWidth=u*0.22;c.lineCap='round';c.beginPath();c.ellipse(dx0,dy0-dh-u*0.2,dw+u*1.0,u*1.5,0,Math.PI*1.04,Math.PI*1.96);c.stroke();
  /* hanging banners: blue and amber */
  const bn=(t,w,len,fill,fill2)=>{const px=cx0+Math.cos(t)*r,py=cy0-hh+u*1.0+Math.sin(t)*ry,k=Math.max(0.45,Math.sin(t));c.save();c.translate(px,py);c.scale(k,1);c.fillStyle=fill;c.beginPath();c.moveTo(-w/2,0);c.lineTo(w/2,0);c.lineTo(w/2,len);c.lineTo(w*0.15,len-u*0.35);c.lineTo(0,len+u*0.1);c.lineTo(-w*0.2,len-u*0.35);c.lineTo(-w/2,len);c.closePath();c.fill();c.strokeStyle=fill2;c.lineWidth=u*0.12;c.beginPath();c.moveTo(-w*0.5,len*0.3);c.lineTo(0,len*0.5);c.lineTo(w*0.5,len*0.3);c.moveTo(-w*0.5,len*0.55);c.lineTo(0,len*0.75);c.lineTo(w*0.5,len*0.55);c.stroke();c.restore();};
  bn(0.92,u*1.1,u*3.2,'#2f66b0','#1b4580');bn(0.55,u*1.0,u*2.9,'#e0a23a','#c4452e');
  /* lantern and a sagging canvas sail */
  const lp=[cx0-u*2.2,cy0+u*0.7-hh*0.42];TH.ln(c,[lp[0],lp[1]-u*0.9],[lp[0],lp[1]-u*0.3],'#3a2a1a',u*0.06);GLOW(c,lp[0],lp[1]+u*0.2,u*1.3,'255,200,110',0.5);TH.ell(c,lp[0],lp[1]+u*0.2,u*0.28,u*0.4,'#ffd36a');TH.ell(c,lp[0],lp[1]-u*0.18,u*0.34,u*0.14,'#6a5a3a');
  c.fillStyle='#dccda6';c.beginPath();c.moveTo(cx0-u*3.9,cy0-hh+u*1.0);c.quadraticCurveTo(cx0-u*3.3,cy0-hh+u*2.7,cx0-u*2.2,cy0-hh+u*2.3);c.lineTo(cx0-u*2.9,cy0-hh+u*1.1);c.closePath();c.fill();c.strokeStyle='rgba(120,90,50,.4)';c.lineWidth=u*0.05;c.stroke();
  /* rock spire on the right */
  const bx=x+u*5.4,by=y+u*0.9,P=[[-2.0,0.4],[-2.1,-2.4],[-1.6,-4.2],[-1.8,-5.6],[-0.9,-6.6],[-0.7,-8.2],[0.0,-9.6],[0.5,-7.6],[1.2,-6.6],[1.6,-4.8],[2.1,-3.0],[2.3,-1.0],[1.7,0.5],[0.2,1.0]];
  const poly=P.map(p=>[bx+p[0]*u,by+p[1]*u]);TH.ell(c,bx+u*0.4,by+u*0.7,u*2.6,u*0.8,'rgba(30,24,16,.25)');
  c.save();c.beginPath();poly.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.clip();
  const rg2=c.createLinearGradient(bx-u*2.2,0,bx+u*2.4,0);rg2.addColorStop(0,'#aab2c0');rg2.addColorStop(0.45,'#7f8aa0');rg2.addColorStop(1,'#4c566c');c.fillStyle=rg2;c.fillRect(bx-u*3,by-u*11,u*6,u*13);
  [[-2.2,-2.0,0.3,-3.0,-1.0,-2.6,-0.6,-1.0,'rgba(210,220,235,.5)'],[-1.0,-6.4,1.0,-7.0,1.2,-5.2,-1.2,-4.8,'rgba(200,215,235,.45)'],[0.2,-3.8,2.4,-4.4,2.4,-2.4,0.3,-1.6,'rgba(30,40,60,.38)'],[-1.9,-0.4,2.4,-1.4,2.4,0.8,-1.9,1.0,'rgba(90,60,70,.35)']].forEach(q=>{c.fillStyle=q[8];c.beginPath();c.moveTo(bx+q[0]*u,by+q[1]*u);c.lineTo(bx+q[2]*u,by+q[3]*u);c.lineTo(bx+q[4]*u,by+q[5]*u);c.lineTo(bx+q[6]*u,by+q[7]*u);c.closePath();c.fill();});
  c.strokeStyle='rgba(30,38,56,.55)';c.lineWidth=u*0.07;[[-1.8,-1.2,0.4,-2.4],[-1.2,-3.6,0.8,-4.4],[0.0,-5.4,-0.2,-8.0],[0.5,-2.0,1.5,-3.0],[-1.0,-6.4,0.3,-7.4],[0.6,-5.2,1.3,-6.2]].forEach(l=>{c.beginPath();c.moveTo(bx+l[0]*u,by+l[1]*u);c.lineTo(bx+l[2]*u,by+l[3]*u);c.stroke();});
  c.strokeStyle='rgba(190,90,70,.45)';c.lineWidth=u*0.16;[[-1.9,-3.5,1.8,-4.2],[-1.5,-5.2,1.2,-5.7]].forEach(l=>{c.beginPath();c.moveTo(bx+l[0]*u,by+l[1]*u);c.lineTo(bx+l[2]*u,by+l[3]*u);c.stroke();});
  c.restore();c.strokeStyle='rgba(30,36,50,.5)';c.lineWidth=u*0.08;c.beginPath();poly.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.stroke();
  [[-1.6,-3.9],[1.3,-3.0],[-1.0,-0.1],[0.6,-6.4]].forEach(([dx,dy],i)=>{TH.blob(c,bx+dx*u,by+dy*u,u*0.5,u*0.32,i%2?'#5a8a4a':'#6a9a52',rn,7);});
  /* red umbrellas with tables, bollards and planters out front */
  [[cx0+u*3.9,y+u*4.9,'#a3202f','#7a1622'],[cx0+u*6.4,y+u*4.0,'#4d3b34','#3a2c26']].forEach(([px,py,a,b])=>{RTABLE(c,px,py,u*1.0,'#d9cfb6');RUMBRELLA(c,px,py,u*1.1,a,b);});
  [[cx0-u*2.8,y+u*3.4],[cx0+u*2.6,y+u*3.3]].forEach(([px,py])=>{TH.ell(c,px,py,u*0.5,u*0.18,'rgba(0,0,0,.2)');c.fillStyle='#a9a888';c.beginPath();c.moveTo(px-u*0.38,py);c.lineTo(px-u*0.34,py-u*1.0);c.ellipse(px,py-u*1.0,u*0.34,u*0.34,0,Math.PI,0);c.lineTo(px+u*0.38,py);c.closePath();c.fill();c.fillStyle='#5a8a88';c.fillRect(px-u*0.36,py-u*0.7,u*0.72,u*0.22);});
  [[cx0-u*5.0,y+u*3.2],[cx0-u*3.6,y+u*4.2]].forEach(([px,py])=>{TH.ell(c,px,py,u*0.7,u*0.24,'rgba(0,0,0,.2)');RJAR_(c,px,py,u*0.9,'#8a6a40',0.9);TH.blob(c,px,py-u*1.25,u*0.7,u*0.45,'#5a8a45',rn,8);});
  JBOX(c,x,y,u,-6.0,-5.0,4.0,5.0,0,0.8,'#7a6a58');
}};

/* ---- EGYPT: open-air market (mud-brick back wall, four canvas-awning stalls, baskets of produce, jars, hanging chillies, a date palm) ---- */
RESTAURANT_ART.egypt={dy:0.05,k:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),sand='#e2c58a',rn=RRNG_(91+(v|0));RSH_(c,x,y+u*0.5,u*8.9,u*3.8,'60,44,20');
  /* back wall with a painted frieze and two gate pylons */
  JBOX(c,x,y,u,-5.4,5.4,-3.5,-2.9,0,2.9,'#d9b97a');BP(c,RFRONT(c,I,-2.9,-5.4,5.4,2.2,2.6),'#2f7ab8');for(let k=0;k<14;k++)BP(c,RFRONT(c,I,-2.88,-5.2+k*0.78,-5.2+k*0.78+0.34,2.28,2.52),'#e6b43c');BP(c,RFRONT(c,I,-2.9,-5.4,5.4,2.6,2.9),'#b8452a');
  for(let k=0;k<9;k++)TH.ln(c,I(-5.2+k*1.3,-2.88,0.3),I(-5.2+k*1.3,-2.88,2.1),'rgba(90,56,20,.14)',u*0.05);
  BR(c,I,5.4,-3.5,-2.9,0,2.9,'rgba(70,44,16,.3)');
  [-5.4,5.0].forEach(X=>{JBOX(c,x,y,u,X,X+0.8,-3.7,-2.7,0,3.6,'#e3c88c');BP(c,RFRONT(c,I,-2.7,X,X+0.8,3.2,3.6),'#b8452a');});
  /* the four stalls: each has a table, produce and a striped canvas awning */
  const stalls=[{x0:-5.0,x1:-2.6,c1:'#c4562a',c2:'#f4e8cc',goods:['#f08a2a','#e8c23a','#d8452a']},{x0:-2.5,x1:0.1,c1:'#2f8a8a',c2:'#f4e8cc',goods:['#c42a3a','#7ac25a','#e8c23a']},{x0:0.2,x1:2.8,c1:'#d9a02a',c2:'#b8452a',goods:['#f2e6c8','#d8452a','#9a6a3a']},{x0:2.9,x1:5.3,c1:'#2a4a8a',c2:'#f4e8cc',goods:['#e8c23a','#f08a2a','#7ac25a']}];
  stalls.forEach((s,i)=>{const w=s.x1-s.x0,mx=(s.x0+s.x1)/2;JBOX(c,x,y,u,s.x0+0.2,s.x1-0.2,-0.2,1.0,0,0.95,'#9a6a3a');BT(c,I,s.x0+0.2,s.x1-0.2,-0.2,1.0,0.95,'#b98a56');
    /* produce: baskets and spice cones on the table */
    for(let k=0;k<3;k++){const px=s.x0+0.55+k*(w-1.1)/2.0,p=I(px,0.35,0.95);if(i%2===0){TH.ell(c,p[0],p[1]+u*0.05,u*0.5,u*0.2,'#8a5a30');TH.blob(c,p[0],p[1]-u*0.2,u*0.5,u*0.32,s.goods[k],rn,7);}else{ACONE(c,p[0],p[1],u*0.46,u*0.18,u*0.7,s.goods[k],u,0);}}
    /* a jar on the ground beside each stall */
    const jp=I(s.x1-0.5,1.5,0);RJAR_(c,jp[0],jp[1],u*1.0,['#b4542a','#8a6a3a','#c9a36a','#a8452a'][i],1.3);
    });
  stalls.forEach((s,i)=>{AWN(c,I,s.x0,s.x1,-2.9,3.5,2.55,4.4,[s.c1,s.c2],u);
    /* hanging chillies / gourds from the awning edge */
    for(let k=0;k<4;k++){const p=I(s.x0+0.4+k*(s.x1-s.x0-0.8)/3,1.5,2.45);TH.ln(c,[p[0],p[1]],[p[0],p[1]+u*0.6],'#5a3a22',u*0.05);TH.ell(c,p[0],p[1]+u*0.8,u*0.13,u*0.3,i%2?'#c42a3a':'#6a9a3a');}
    [s.x0+0.05,s.x1-0.05].forEach(X=>RPOST(c,I,X,1.45,0,2.6,'#6a4a28',u,0.2));});
  /* foreground: date palm, papyrus, sacks and a brazier pot */
  RPALM_(c,I(6.6,0.0,0)[0],I(6.6,0.0,0)[1],u,u*6.0,0.2,['#5fa040','#3f8030']);RPALM_(c,I(-6.1,2.2,0)[0],I(-6.1,2.2,0)[1],u,u*4.6,-0.4,['#5fa040','#3f8030']);
  [[-4.2,3.8],[-3.2,4.4]].forEach(([X,Y],i)=>{const p=I(X,Y,0);TH.ell(c,p[0],p[1],u*0.6,u*0.22,'rgba(0,0,0,.2)');c.fillStyle=i?'#c9a36a':'#b98a56';c.beginPath();c.moveTo(p[0]-u*0.55,p[1]);c.quadraticCurveTo(p[0]-u*0.7,p[1]-u*0.8,p[0]-u*0.2,p[1]-u*1.1);c.quadraticCurveTo(p[0],p[1]-u*1.2,p[0]+u*0.2,p[1]-u*1.1);c.quadraticCurveTo(p[0]+u*0.7,p[1]-u*0.8,p[0]+u*0.55,p[1]);c.closePath();c.fill();TH.ln(c,[p[0]-u*0.2,p[1]-u*1.1],[p[0]+u*0.2,p[1]-u*1.1],'#6a4a28',u*0.12);});
  [[1.0,4.2],[2.6,4.6]].forEach(([X,Y],i)=>{const p=I(X,Y,0);RJAR_(c,p[0],p[1],u*1.1,i?'#8a6a3a':'#c4562a',1.6);});
  [[-0.4,4.6],[5.0,2.6]].forEach(([X,Y])=>{const p=I(X,Y,0);for(let k=0;k<5;k++)TH.ln(c,[p[0]+(k-2)*u*0.12,p[1]],[p[0]+(k-2)*u*0.45,p[1]-u*1.8-(k%2)*u*0.5],'#5ea04a',u*0.12);TH.ell(c,p[0],p[1]-u*0.05,u*0.5,u*0.18,'#3f8030');});
  /* bunting along the front edge of the awnings */
  const b0=I(-5.0,1.6,2.7),b1=I(5.2,1.6,2.7);c.strokeStyle='#4a3a2a';c.lineWidth=u*0.05;c.beginPath();c.moveTo(b0[0],b0[1]);c.quadraticCurveTo((b0[0]+b1[0])/2,(b0[1]+b1[1])/2+u*0.8,b1[0],b1[1]);c.stroke();for(let k=1;k<12;k++){const t=k/12,px=b0[0]+(b1[0]-b0[0])*t,py=(1-t)*(1-t)*b0[1]+2*(1-t)*t*((b0[1]+b1[1])/2+u*0.8)+t*t*b1[1];TH.poly(c,[[px-u*0.18,py],[px+u*0.18,py],[px,py+u*0.45]],['#c4562a','#2f7ab8','#e6b43c','#2f8a8a'][k%4]);}
}};

const RESTAURANT_U=0.0975;

const RESTAURANT_DX={china:-0.045,japan:-0.01,rome:-0.005,greece:-0.005,jurassic:-0.01,galactic:-0.04,egypt:-0.02,babylon:-0.005};   /* horizontal nudge (in R) that centres each building on the hex */
const RESTAURANT_ALIAS={chinese:'china',japanese:'japan',roman:'rome','ancient_rome':'rome','ancient_greece':'greece',greek:'greece',jurassic_island:'jurassic',dino:'jurassic',dinosaur:'jurassic',galactic_outpost:'galactic',space_cantina:'galactic',outpost:'galactic',ancient_egypt:'egypt',egyptian:'egypt',ancient_babylon:'babylon',babylonian:'babylon'};

function restaurantTheme(t){t=String(t||'standard').toLowerCase();return RESTAURANT_ALIAS[t]||t;}
/* drawRestaurant(ctx, cx, cy, R, {theme, flip, scale, dy}): (cx,cy) = centre of the hex tile, R = hex radius in px. Static, one hex, no ground. */
function drawRestaurant(ctx,cx,cy,R,opts){opts=opts||{};const th=restaurantTheme(opts.theme),T=RESTAURANT_ART[th];if(!T)throw new Error('unknown restaurant theme: '+opts.theme);
  const S=opts.scale||1,u=R*RESTAURANT_U*S*(T.k||1),dy=(opts.dy===undefined?T.dy:opts.dy)*R;ctx.save();if(opts.flip){ctx.translate(cx,0);ctx.scale(-1,1);ctx.translate(-cx,0);}T.draw(ctx,cx+(opts.dx===undefined?(RESTAURANT_DX[th]||0):opts.dx)*R,cy+dy,u,opts.v===undefined?0:opts.v,opts.accent);ctx.restore();}
const RESTAURANT_BAKE_CACHE={};
/* bakeRestaurant(theme, R, {scale, flip, pixelRatio}) -> {canvas, ox, oy, w, h, bbox}: a transparent sprite cropped to its painted pixels; (ox,oy) = where the hex centre sits inside the canvas */
function bakeRestaurant(theme,R,opts){opts=opts||{};const th=restaurantTheme(theme),pr=opts.pixelRatio||1,S=opts.scale||1,key=[th,R,S,!!opts.flip,pr,opts.accent||''].join('|');if(RESTAURANT_BAKE_CACHE[key])return RESTAURANT_BAKE_CACHE[key];
  const W=Math.ceil(R*4.2*pr),H=Math.ceil(R*5.0*pr),ax=W/2,ay=H*0.76,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');c.scale(pr,pr);drawRestaurant(c,ax/pr,ay/pr,R,{theme:th,scale:S,flip:opts.flip,accent:opts.accent});
  const d=cv.getContext('2d').getImageData(0,0,W,H).data;let x0=W,y0=H,x1=0,y1=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(d[(y*W+x)*4+3]>8){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}}
  const pad=2,bx=Math.max(0,x0-pad),by=Math.max(0,y0-pad),bw=Math.min(W,x1+pad+1)-bx,bh=Math.min(H,y1+pad+1)-by,out=document.createElement('canvas');out.width=bw;out.height=bh;out.getContext('2d').drawImage(cv,bx,by,bw,bh,0,0,bw,bh);
  return RESTAURANT_BAKE_CACHE[key]={canvas:out,ox:(ax-bx)/pr,oy:(ay-by)/pr,w:bw/pr,h:bh/pr,pixelRatio:pr,bbox:{left:-(ax-bx)/pr,top:-(ay-by)/pr,right:(bx+bw-ax)/pr,bottom:(by+bh-ay)/pr}};}
function drawRestaurantBaked(ctx,cx,cy,sprite){ctx.drawImage(sprite.canvas,cx-sprite.ox,cy-sprite.oy,sprite.w,sprite.h);}
function restaurantFootprint(R,theme,opts){return bakeRestaurant(theme,R,opts).bbox;}


NEW_SPRITE_PACKS.facilities.restaurant = { bake: bakeRestaurant, drawBaked: drawRestaurantBaked };
})();
