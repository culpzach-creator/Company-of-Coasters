(function(){
/* ===== SHARED HELPERS (skip if already in engine.js) ===== */
function shade(hex, amt){
  if(!hex || hex[0]!=='#') return hex || '#888888';
  const n=parseInt(hex.slice(1),16); let r=n>>16, g=(n>>8)&255, b=n&255;
  const f=c=>Math.max(0,Math.min(255,Math.round(amt<0?c*(1+amt):c+(255-c)*amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
function hexPath(ctx,cx,cy,R){
  ctx.beginPath();
  for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);
    ctx[i?'lineTo':'moveTo'](cx+R*Math.cos(a), cy+R*Math.sin(a)*0.58);}
  ctx.closePath();
}
function prism(ctx,cx,by,w,d,h,col){
  const ty=by-h;
  ctx.fillStyle=shade(col,-0.35); ctx.beginPath();
  ctx.moveTo(cx-w,by);ctx.lineTo(cx,by+d);ctx.lineTo(cx,ty+d);ctx.lineTo(cx-w,ty);ctx.closePath();ctx.fill();
  ctx.fillStyle=shade(col,-0.1); ctx.beginPath();
  ctx.moveTo(cx+w,by);ctx.lineTo(cx,by+d);ctx.lineTo(cx,ty+d);ctx.lineTo(cx+w,ty);ctx.closePath();ctx.fill();
  ctx.fillStyle=shade(col,0.2); ctx.beginPath();
  ctx.moveTo(cx-w,ty);ctx.lineTo(cx,ty-d);ctx.lineTo(cx+w,ty);ctx.lineTo(cx,ty+d);ctx.closePath();ctx.fill();
}

/* ===== FERRIS WHEEL 16-SKIN METADATA ===== */
const FERRIS_WHEEL_SKINS = {
  standard:     {id:'standard',     label:'Unthemed (Tier 0–2)', name:'Standard Park Ferris Wheel',    sub:'Steel A-Frame, Chasing Rim Bulbs & Cabins',      hex:'#cbd5e1', border:'#eab308'},
  western:      {id:'western',      label:'Wild West',           name:'Pioneer Covered-Basket Wheel',  sub:'Red-Rock Buttes, Timber Derrick & Covered Baskets',hex:'#c99a62', border:'#b91c1c'},
  bavarian:     {id:'bavarian',     label:'Bavarian',            name:'Oktoberfest Beer-Mug Wheel',    sub:'Fachwerk Gable Pylons, Clock Hub & Foamy Steins', hex:'#769958', border:'#2563eb'},
  classic:      {id:'classic',      label:'Classic Midway',      name:'Wonder Wheel Hot-Air Balloons', sub:'Circus Striped Pylons, Sunburst & Balloon Pods',  hex:'#cbb07c', border:'#e11d48'},
  jungle:       {id:'jungle',       label:'Jungle',              name:'Temple of the Sun Wheel',       sub:'Mayan Stone Obelisks, Chaac Sun Hub & Jade Cabins',hex:'#587c48', border:'#2fbf9a'},
  medieval:     {id:'medieval',     label:'Medieval',            name:'Royal Siege-Tower Wheel',       sub:'Castle Turret Pylons, Shield Hub & Royal Cabins', hex:'#6c8c58', border:'#eab308'},
  nordic:       {id:'nordic',       label:'Nordic',              name:'Asgardian Runestone Wheel',     sub:'Stave Dragon Pylons, Bifrost Hub & Fjord Cabins', hex:'#4d6b63', border:'#d97706'},
  frontier:     {id:'frontier',     label:'Frontier',            name:'Grizzly Timber Sawmill Wheel',  sub:'Notched Pine Logs, Buzzsaw Hub & Lodge Cabins',   hex:'#7d955d', border:'#566e42'},
  americana:    {id:'americana',    label:'Americana',           name:'World’s Fair 1893 Columbian',   sub:'Victorian Lattice Towers, Eagle Hub & Red Cabins',hex:'#a8644c', border:'#b91c1c'},
  alps:         {id:'alps',         label:'Alps',                name:'Matterhorn Glacier Gondola',    sub:'Snow-Capped Chalet Pylons, Edelweiss & Ski Cabins',hex:'#a8c5d6', border:'#0284c7'},
  fiesta:       {id:'fiesta',       label:'Fiesta',              name:'La Rueda de la Fiesta',         sub:'Talavera Bell Towers, Aztec Sun & Piñata Cabins', hex:'#d99b52', border:'#e11d48'},
  gothic:       {id:'gothic',       label:'Gothic',              name:'Midnight Abbey Rose Wheel',     sub:'Gargoyle Buttresses, Rose Window & Raven Cabins', hex:'#3b3345', border:'#7e22ce'},
  space:        {id:'space',        label:'Space',               name:'Orbital Space-Elevator Wheel',  sub:'Titanium Gantry Pylons, Plasma Core & Aero Pods', hex:'#334155', border:'#0ea5e9'},
  retro_future: {id:'retro_future', label:'Retro-Future',        name:'Tomorrowland Atomic Wheel',     sub:'Googie Boomerang Pylons, Atom Hub & Retro Pods',  hex:'#bcc8d5', border:'#f97316'},
  jungle_tiki:  {id:'tiki',         label:'Tiki',                name:'Polynesian Tiki-Totem Wheel',   sub:'Carved Tiki Pillars, Fire Bowl & Bamboo Cabins',  hex:'#5c9444', border:'#d97706'},
  caribbean:    {id:'caribbean',    label:'Caribbean',           name:'Port Royal Galleon Wheel',      sub:'Sea-Fort Bastion Pylons, Helm Hub & Pirate Cabins',hex:'#6aa04a', border:'#d97706'}
};
FERRIS_WHEEL_SKINS.tiki     = FERRIS_WHEEL_SKINS.jungle_tiki;
FERRIS_WHEEL_SKINS.unthemed = FERRIS_WHEEL_SKINS.standard;
FERRIS_WHEEL_SKINS.german   = FERRIS_WHEEL_SKINS.bavarian;
FERRIS_WHEEL_SKINS.wildwest = FERRIS_WHEEL_SKINS.western;
FERRIS_WHEEL_SKINS.retro    = FERRIS_WHEEL_SKINS.retro_future;

/* ===== SPRITE CODE: copy this block into engine.js ===== */
/**
 * drawFerrisWheel(ctx, cx, cy, R, opts)
 *  1-Hex Observation Wheel with 16 Architectural & Gondola Skins:
 *   - Heavier thematic focus on the A-frame support structures (Red-Rock Buttes, Fachwerk Gables,
 *     Castle Turrets, Mayan Obelisks, Stave Dragon Pylons, Sea-Fort Bastions, Googie Boomerangs,
 *     Carved Tiki Totems, Gothic Buttresses, etc.) and the Central Axle Hub Centerpiece.
 *   - Custom Vehicles:
 *       * `western`  -> Covered Baskets (woven wicker baskets topped with hooped white canvas bonnets)
 *       * `bavarian` -> Beer Mugs (dimpled Oktoberfest Maßkrüge with handles & overflowing white foam)
 *       * `classic`  -> Hot-Air Balloons (striped gore balloon envelopes suspending wicker baskets)
 *       * All others -> Theme-colored passenger cabins with tinted glass windows & roofs
 *
 *  opts.themeId / theme : any of the 16 theme keys above
 *  opts.rideThemeTier   : 0..4 (<=2 renders Standard Unthemed; >=3 renders Heavy/Immersive themed wheel)
 *  opts.accent          : Land color (used for standard accents & hex border)
 *  opts.t               : wheel rotation in radians (auto-rotates if omitted)
 *  opts.flip            : true when mirrored horizontally (keeps shadows on the same screen side)
 *  opts.tile            : draw hex tile underneath (default true)
 */
function drawFerrisWheel(ctx, cx, cy, R, o = {}) {
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTh = String(o.themeId || o.theme || 'standard').toLowerCase().replace(/-/g, '_');
  if (rawTh === 'unthemed') rawTh = 'standard';
  if (rawTh === 'german') rawTh = 'bavarian';
  if (rawTh === 'wildwest' || rawTh === 'wild_west') rawTh = 'western';
  if (rawTh === 'retro') rawTh = 'retro_future';
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

  // 2. Ground Boarding Dock & Projected Wheel Shadow (NO giant grey concrete slab!)
  const pGnd = P(0, 0, 0);
  // Subtle wooden boarding dock step directly beneath the lowest cabin
  poly([P(-R*0.18, -R*0.14, 0), P(R*0.18, -R*0.14, 0), P(R*0.18, R*0.14, 0), P(-R*0.18, R*0.14, 0)], 'rgba(15, 23, 42, 0.24)');

  // Projected wheel shadow on the ground
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
  //    Heavy architectural theming on both the back (-ya) and front (+ya) A-frame supports!
  // =========================================================================
  const drawThemedSupport = (Y, isFront) => {
    const top = P(0, Y, Zh);
    const f0  = P(-R * 0.39, Y, z0);
    const f1  = P( R * 0.39, Y, z0);

    // Compact footpad piers under each leg
    [f0, f1].forEach(f => {
      ell([f[0], f[1] + R*0.008], R * 0.065, R * 0.030, 'rgba(15,23,42,0.34)');
      ell(f, R * 0.056, R * 0.025, '#475569', '#1e293b', R * 0.006);
    });

    if (theme === 'standard') {
      // Unthemed Steel A-Frame with Accent Top Sleeves & Cross-Tie
      [f0, f1].forEach(f => {
        line(f, top, '#64748b', R * 0.048);
        line([f[0] - R*0.01, f[1]], [top[0] - R*0.01, top[1]], '#94a3b8', R * 0.014);
        line(lerp(f, top, 0.70), lerp(f, top, 0.92), accent, R * 0.052);
      });
      line(lerp(f0, top, 0.28), lerp(f1, top, 0.28), '#64748b', R * 0.026);
    }
    else if (theme === 'western') {
      // WILD WEST: Monument-Valley Layered Red-Rock Sandstone Buttes + Timber Mine Derrick & X-Bracing!
      [[-R*0.39, -1], [R*0.39, 1]].forEach(([bx, dir]) => {
        const pb = P(bx, Y, 0);
        // 2-tier layered red-rock sandstone crag flanking each foot
        poly([
          [pb[0] - R*0.085, pb[1]], [pb[0] + R*0.085, pb[1]],
          [pb[0] + R*0.065, pb[1] - R*0.09], [pb[0] - R*0.065, pb[1] - R*0.09]
        ], '#b84a2c', '#451a03', R * 0.007);
        poly([
          [pb[0] - R*0.055, pb[1] - R*0.09], [pb[0] + R*0.055, pb[1] - R*0.09],
          [pb[0] + R*0.040, pb[1] - R*0.16], [pb[0] - R*0.040, pb[1] - R*0.16]
        ], '#e07a4c', '#451a03', R * 0.006);
      });
      // Heavy rough-sawn cedar mine derrick legs + iron gussets + timber X-bracing
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
      // BAVARIAN: White Stucco & Brown Fachwerk Half-Timbered A-Frame with Blue/White Lozenge Arch & Geraniums!
      const m0 = lerp(f0, top, 0.30), m1 = lerp(f1, top, 0.30);
      // Half-timbered arch portal between legs
      poly([f0, m0, m1, f1, lerp(f1, f0, 0.16), lerp(m1, m0, 0.22), lerp(m0, m1, 0.22), lerp(f0, f1, 0.16)], '#f8fafc', '#5a3b22', R * 0.008);
      [f0, f1].forEach(f => {
        line(f, top, '#5a3b22', R * 0.056);
        line(f, top, '#f8fafc', R * 0.036);
        // Diagonal Fachwerk timber chevrons
        for (let s = 0.2; s < 0.85; s += 0.22) {
          const pA = lerp(f, top, s), pB = lerp(f, top, s + 0.12);
          line([pA[0] - R*0.015, pA[1]], [pB[0] + R*0.015, pB[1]], '#5a3b22', R * 0.012);
        }
      });
      line(m0, m1, '#2563eb', R * 0.030);
      line(m0, m1, '#ffffff', R * 0.012);
      // Red geranium flower boxes at the leg bases
      if (isFront) {
        [f0, f1].forEach(f => {
          ell([f[0], f[1] - R*0.015], R * 0.055, R * 0.024, '#15803d');
          disc([f[0] - R*0.018, f[1] - R*0.022], R * 0.014, '#ef4444');
          disc([f[0] + R*0.018, f[1] - R*0.022], R * 0.014, '#ef4444');
        });
      }
    }
    else if (theme === 'classic') {
      // CLASSIC MIDWAY: Red-and-Cream Striped Carnival Pylons with Chasing Marquee Bulbs & Scalloped Arch!
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
      // JUNGLE: Stepped Mayan Limestone Obelisk Pylons with Carved Jade Masks & Hanging Vines!
      const m0 = lerp(f0, top, 0.30), m1 = lerp(f1, top, 0.30);
      line(m0, m1, '#78350f', R * 0.032);
      line(m0, m1, '#2fbf9a', R * 0.014);
      [f0, f1].forEach(f => {
        line(f, top, '#4a4737', R * 0.062);
        line(f, top, '#bdb9a0', R * 0.044);
        [0.32, 0.62].forEach(t => {
          const vp = lerp(f, top, t);
          ell(vp, R * 0.035, R * 0.020, '#15803d');
          line(vp, [vp[0], vp[1] + R*0.07], '#166534', R * 0.010);
        });
      });
    }
    else if (theme === 'medieval') {
      // MEDIEVAL: Crenellated Castle Stone Gatehouse Pylons with Heraldic Shields & Royal Banners!
      const m0 = lerp(f0, top, 0.30), m1 = lerp(f1, top, 0.30);
      line(m0, m1, '#475569', R * 0.034);
      line(m0, m1, '#f5c542', R * 0.014);
      [f0, f1].forEach((f, idx) => {
        line(f, top, '#334155', R * 0.060);
        line(f, top, '#cbd5e1', R * 0.042);
        if (isFront) {
          const sp = lerp(f, top, 0.48);
          poly([
            [sp[0] - R*0.032, sp[1] - R*0.032], [sp[0] + R*0.032, sp[1] - R*0.032],
            [sp[0] + R*0.028, sp[1] + R*0.015], [sp[0], sp[1] + R*0.045], [sp[0] - R*0.028, sp[1] + R*0.015]
          ], idx % 2 ? '#1d4ed8' : '#b91c1c', '#f5c542', R * 0.008);
        }
      });
    }
    else if (theme === 'nordic') {
      // NORDIC: Tarred Viking Stave-Timber Pylons with Painted Round Shields & Golden Dragon Finials!
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
      // GOTHIC: Pointed-Arch Obsidian Cathedral Buttress Pylons with Crimson Rose Tracery!
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
      // SPACE & RETRO-FUTURE: Curved Swept Googie / Titanium Parabolic Arch Pylons with Neon Conduits!
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
      // FRONTIER, AMERICANA, ALPS, FIESTA, TIKI, CARIBBEAN: Theme-Colored Architectural Pylons & Portal Crossbars
      const pCols = {
        frontier:  ['#4a3320', '#8a5a33', '#2f5f3a'],
        americana: ['#7f1d1d', '#fbf6e8', '#1d3557'],
        alps:      ['#451a03', '#b45309', '#f8fafc'],
        fiesta:    ['#9a3412', '#f59e0b', '#0d9488'],
        tiki:      ['#3e2716', '#78350f', '#d9a74a'],
        caribbean: ['#5c5443', '#e2d8c3', '#c2410c']
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
    standard: '#cbd5e1', western: '#9a6a3c', bavarian: '#f8fafc', classic: '#fef08a',
    jungle: '#bdb9a0',   medieval: '#94a3b8', nordic: '#78350f',   frontier: '#8a5a33',
    americana: '#fbf6e8',alps: '#f8fafc',     fiesta: '#f59e0b',   gothic: '#52525b',
    space: '#e2e8f0',    retro_future: '#f8fafc', tiki: '#d9a74a', caribbean: '#d97706'
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
  //    - `western`  : Covered Baskets (wicker basket + hooped white canvas wagon bonnet)
  //    - `bavarian` : Beer Mugs (dimpled Oktoberfest Maßkrüge + glass handle + overflowing foam)
  //    - `classic`  : Hot-Air Balloons (striped balloon envelopes + suspended wicker baskets)
  //    - All others : Theme-colored passenger cabins with tinted glass windows & roofs
  // =========================================================================
  const CABIN_PALETTES = {
    standard:     [accent, '#f8fafc', '#facc15'],
    jungle:       ['#137a70', '#eab308', '#b45309'],
    medieval:     ['#b91c1c', '#1d4ed8', '#f5c542'],
    nordic:       ['#991b1b', '#0284c7', '#d97706'],
    frontier:     ['#2f5f3a', '#9a3412', '#d97706'],
    americana:    ['#b91c1c', '#fbf6e8', '#1d3557'],
    alps:         ['#dc2626', '#f8fafc', '#0284c7'],
    fiesta:       ['#e11d48', '#0d9488', '#f59e0b'],
    gothic:       ['#581c87', '#991b1b', '#27272a'],
    space:        ['#0284c7', '#e2e8f0', '#22d3ee'],
    retro_future: ['#f97316', '#06b6d4', '#f8fafc'],
    tiki:         ['#d97706', '#15803d', '#b45309'],
    caribbean:    ['#b91c1c', '#0d9488', '#d97706']
  };

  const cab = [];
  for (let k = 0; k < N; k++) {
    const a = th + k * TAU / N;
    cab.push({ c: rim(a, 0), k });
  }
  cab.sort((u, v) => u.c[1] - v.c[1]).forEach(({ c, k }) => {
    const cxG = c[0], cyG = c[1];

    if (theme === 'western') {
      // WILD WEST: Covered Baskets (Wicker Basket Tub + Hooped White Canvas Bonnet!)
      line(c, [cxG, cyG + R * 0.025], '#451a03', R * 0.011);
      const bw = R * 0.042, bh = R * 0.036, bTop = cyG + R * 0.056;
      // Arched white canvas covered-wagon bonnet above the basket
      ctx.fillStyle = k % 2 ? '#fdfbf5' : '#f5efe0';
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = R * 0.007;
      ctx.beginPath();
      ctx.arc(cxG, bTop, bw * 0.96, Math.PI, 0);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // Canvas hoop rib line
      ctx.beginPath();
      ctx.arc(cxG, bTop, bw * 0.62, Math.PI, 0);
      ctx.stroke();
      // Woven wicker & cedar basket body underneath
      prism(ctx, cxG, bTop + bh, bw, R * 0.020, bh, '#b45309');
      // Dark interior passenger opening & golden rim
      ctx.fillStyle = '#451a03';
      ctx.fillRect(cxG - bw * 0.65, bTop - R * 0.012, bw * 1.3, R * 0.014);
    }
    else if (theme === 'bavarian') {
      // BAVARIAN: Frothy Oktoberfest Beer Mugs (Maßkrüge) with Handles & Overflowing Foam!
      line(c, [cxG, cyG + R * 0.025], '#78350f', R * 0.011);
      const mw = R * 0.034, mh = R * 0.062, mTop = cyG + R * 0.036, mBot = mTop + mh;
      // Curved glass mug handle on the right side
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = R * 0.012;
      ctx.beginPath();
      ctx.arc(cxG + mw * 0.92, mTop + mh * 0.52, R * 0.022, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
      // Golden amber beer mug body
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = R * 0.006;
      ctx.beginPath();
      ctx.roundRect(cxG - mw, mTop, mw * 2, mh, R * 0.008);
      ctx.fill(); ctx.stroke();
      // Dimpled glass vertical flutes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
      ctx.lineWidth = R * 0.005;
      [-0.45, 0, 0.45].forEach(fx => {
        ctx.beginPath();
        ctx.moveTo(cxG + fx * mw, mTop + R * 0.012);
        ctx.lineTo(cxG + fx * mw, mBot - R * 0.010);
        ctx.stroke();
      });
      // Pewter base foot ring
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(cxG - mw * 1.04, mBot - R * 0.010, mw * 2.08, R * 0.010);
      // Overflowing fluffy white beer foam head!
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
      // Teardrop hot-air balloon envelope
      ctx.fillStyle = bCol1;
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = R * 0.006;
      ctx.beginPath();
      ctx.arc(cxG, bCy - R * 0.008, bRad, Math.PI * 0.85, Math.PI * 0.15, false);
      ctx.lineTo(cxG + bRad * 0.35, bCy + bRad * 0.92);
      ctx.lineTo(cxG - bRad * 0.35, bCy + bRad * 0.92);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // Center vertical cream gore stripe on balloon
      ell([cxG, bCy - R * 0.004], bRad * 0.42, bRad * 0.92, bCol2);
      // Rigging lines & wicker passenger basket below balloon
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
    const c1 = (theme === 'space' || theme === 'retro_future') ? '#22d3ee' : (theme === 'gothic') ? '#c084fc' : '#fef08a';
    const c2 = (theme === 'space') ? '#e879f9' : (theme === 'bavarian') ? '#38bdf8' : '#fb923c';
    disc(p, R * 0.011, (i + Math.floor(th * 3)) % 2 ? c1 : c2);
  }

  // Front Support Tower (+ya)
  drawThemedSupport(ya, true);

  // =========================================================================
  // 7. BESPOKE CENTRAL HUB CENTERPIECE (`P(0, ya, Zh)`)
  // =========================================================================
  const h = P(0, ya, Zh);
  if (theme === 'standard') {
    disc(h, R * 0.068, accent, '#f8fafc', R * 0.008);
    disc([h[0] - R * 0.02, h[1] - R * 0.02], R * 0.02, shade(accent, 0.45));
  }
  else if (theme === 'western') {
    // Golden 6-Point Sheriff Star & Wagon-Wheel Hub
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
    // Ornate Gold-Rimmed Bavarian Clock Face & Lozenge Hub
    disc(h, R * 0.088, '#2563eb', '#f5c542', R * 0.014);
    disc(h, R * 0.062, '#ffffff', '#1e3a8a', R * 0.006);
    line(h, [h[0], h[1] - R * 0.044], '#1e293b', R * 0.009);
    line(h, [h[0] + R * 0.035, h[1]], '#dc2626', R * 0.008);
    disc(h, R * 0.012, '#f5c542');
  }
  else if (theme === 'classic') {
    // 16-Point Illuminated Midway Starburst Hub
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
    // Carved Golden Mayan / Aztec Sun-Calendar Medallion
    disc(h, R * 0.092, '#eab308', '#78350f', R * 0.012);
    disc(h, R * 0.064, theme === 'jungle' ? '#137a70' : '#e11d48', '#fde047', R * 0.007);
    disc([h[0] - R * 0.022, h[1] - R * 0.01], R * 0.012, '#fef08a');
    disc([h[0] + R * 0.022, h[1] - R * 0.01], R * 0.012, '#fef08a');
  }
  else if (theme === 'medieval' || theme === 'nordic') {
    // Royal Heraldic Lion Shield / Viking Dragon Boss Hub
    disc(h, R * 0.088, theme === 'medieval' ? '#b91c1c' : '#451a03', '#f5c542', R * 0.014);
    disc(h, R * 0.048, theme === 'medieval' ? '#f5c542' : '#0284c7', '#fef08a', R * 0.007);
  }
  else if (theme === 'space' || theme === 'retro_future') {
    // Glowing Cyan Plasma Core / Atomic Orbit Hub
    const cCore = theme === 'space' ? '#22d3ee' : '#f97316';
    disc(h, R * 0.090, '#0f172a', cCore, R * 0.014);
    ell(h, R * 0.075, R * 0.032, null, '#ffffff', R * 0.007, th);
    ell(h, R * 0.075, R * 0.032, null, '#ffffff', R * 0.007, -th);
    disc(h, R * 0.035, cCore);
  }
  else if (theme === 'gothic') {
    // Crimson Stained-Glass Rose Window Hub
    disc(h, R * 0.088, '#18181b', '#a1a1aa', R * 0.012);
    disc(h, R * 0.065, '#991b1b', '#facc15', R * 0.006);
    for (let k = 0; k < 6; k++) {
      const a = th + k * Math.PI / 3;
      line(h, [h[0] + Math.cos(a)*R*0.065, h[1] + Math.sin(a)*R*0.065], '#09090b', R * 0.006);
    }
  }
  else if (theme === 'alps') {
    // White & Gold Alpine Edelweiss Star Hub
    disc(h, R * 0.085, '#dc2626', '#f8fafc', R * 0.012);
    for (let k = 0; k < 6; k++) {
      const a = th + k * Math.PI / 3;
      disc([h[0] + Math.cos(a)*R*0.036, h[1] + Math.sin(a)*R*0.036], R * 0.018, '#ffffff');
    }
    disc(h, R * 0.022, '#facc15');
  }
  else {
    // Tiki, Frontier, Americana, Caribbean: Brass Compass / Emblem Hub
    disc(h, R * 0.085, meta.border, '#facc15', R * 0.012);
    disc(h, R * 0.045, '#fef3c7');
  }

  ctx.restore();
}
/* ===== END SPRITE CODE ===== */
window.drawFerrisWheel = drawFerrisWheel;
})();
