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

/* ===== PIRATE SHIP 16-SKIN METADATA ===== */
const PIRATE_SHIP_SKINS = {
  standard:     {id:'standard',     label:'Unthemed (Tier 0–2)', name:'Standard Huss Pirate Ship',     sub:'Steel A-Frame, Timber Hull & Square Sails',       hex:'#cbd5e1', border:'#d97706', leg1:'#f8fafc', leg2:'#3b82f6'},
  caribbean:    {id:'caribbean',    label:'Caribbean',           name:'Blackbeard’s Spanish Galleon',  sub:'High Poop-Deck, Stern Lanterns & Jolly Roger Sail',hex:'#6aa04a', border:'#d97706', leg1:'#78350f', leg2:'#f59e0b'},
  medieval:     {id:'medieval',     label:'Medieval',            name:'Hanseatic Trading Cog',         sub:'Clinker-Built Tub Hull, Aft Castle & Heraldic Sail',hex:'#6c8c58',border:'#eab308', leg1:'#64748b', leg2:'#b91c1c'},
  nordic:       {id:'nordic',       label:'Nordic',              name:'Asgardian Viking Longship',     sub:'Dragon-Head Prow, Round Shields & Striped Sail',   hex:'#4d6b63', border:'#d97706', leg1:'#451a03', leg2:'#f59e0b'},
  western:      {id:'western',      label:'Wild West',           name:'Mississippi Sternwheeler Boat', sub:'Twin Smokestacks, Texas Deck & Red Paddlewheel',   hex:'#c99a62', border:'#b91c1c', leg1:'#9a3412', leg2:'#fef3c7'},
  frontier:     {id:'frontier',     label:'Frontier',            name:'Birchbark Indian War Canoe',    sub:'High-Curled Birch Hull, Painted Totems & Paddles', hex:'#7d955d', border:'#566e42', leg1:'#6b4a2b', leg2:'#eab308'},
  americana:    {id:'americana',    label:'Americana',           name:'Staten Island Harbor Ferry',    sub:'Double-Deck Red/Cream Passenger Ferry & Wheelhouse',hex:'#a8644c',border:'#b91c1c', leg1:'#fbf6e8', leg2:'#1d3557'},
  alps:         {id:'alps',         label:'Alps',                name:'Matterhorn Snowtube Cruiser',   sub:'Giant Inflatable Red/Blue Snowtube Ship & Handles',hex:'#a8c5d6', border:'#0284c7', leg1:'#f8fafc', leg2:'#dc2626'},
  fiesta:       {id:'fiesta',       label:'Fiesta',              name:'Rainbow Paper-Fringe Piñata',   sub:'7-Pointed Piñata Spikes, Tissue Fringes & Streamers',hex:'#d99b52',border:'#e11d48', leg1:'#f59e0b', leg2:'#0d9488'},
  gothic:       {id:'gothic',       label:'Gothic',              name:'The Flying Dutchman Ghost Ship',sub:'Tattered Spectral Sails, Ectoplasm Glow & Rib Cage',hex:'#3b3345', border:'#7e22ce', leg1:'#18181b', leg2:'#10b981'},
  space:        {id:'space',        label:'Space',               name:'Orbital Star-Cruiser Frigate',  sub:'Titanium Hull, Glowing Cyan Ion Thrusters & Fins', hex:'#334155', border:'#0ea5e9', leg1:'#0f172a', leg2:'#22d3ee'},
  retro_future: {id:'retro_future', label:'Retro-Future',        name:'Tomorrowland Atomic Rocketship',sub:'Chrome 1950s Finned Spaceship, Bubble Dome & Ring',hex:'#bcc8d5', border:'#f97316', leg1:'#f8fafc', leg2:'#06b6d4'},
  jungle:       {id:'jungle',       label:'Jungle',              name:'Amazon Explorer Bamboo Raft',   sub:'Lashed Bamboo Logs, Crate Cargo & Fern-Leaf Sail', hex:'#587c48', border:'#2fbf9a', leg1:'#78350f', leg2:'#2fbf9a'},
  tiki:         {id:'tiki',         label:'Tiki',                name:'Kon-Tiki Outrigger Raft',       sub:'Bound Driftwood Logs, Tiki Idol Mask & Woven Sail',hex:'#5c9444', border:'#d97706', leg1:'#5a3b22', leg2:'#f59e0b'},
  classic:      {id:'classic',      label:'Classic Midway',      name:'Coney Island Showboat Flyer',   sub:'Red-and-Gold Striped Carnival Hull & Bulb Mast',   hex:'#cbb07c', border:'#e11d48', leg1:'#e11d48', leg2:'#fef08a'},
  bavarian:     {id:'bavarian',     label:'Bavarian',            name:'Königssee Royal Excursion Ship',sub:'Blue-and-White Lozenge Hull, Onion Mast & Barrels',hex:'#769958', border:'#2563eb', leg1:'#f8fafc', leg2:'#2563eb'}
};
PIRATE_SHIP_SKINS.unthemed = PIRATE_SHIP_SKINS.standard;
PIRATE_SHIP_SKINS.german   = PIRATE_SHIP_SKINS.bavarian;
PIRATE_SHIP_SKINS.wildwest = PIRATE_SHIP_SKINS.western;
PIRATE_SHIP_SKINS.retro    = PIRATE_SHIP_SKINS.retro_future;

/* ===== SPRITE CODE: copy this block into engine.js ===== */
/**
 * drawPirateShip(ctx, cx, cy, R, opts)
 *  1-Hex Pendulum Swinging Vessel with 16 Distinct 3D Isometric Craft:
 *   - `caribbean`    : Pirate Galleon with high poop deck, stern lanterns, bowsprit & Jolly Roger
 *   - `medieval`     : Hanseatic Cog (round-bellied clinker tub hull, aft castle & heraldic cross sail)
 *   - `nordic`       : Viking Longship (dragon-head prow, curled tail, round shields & striped sail)
 *   - `western`      : Mississippi Sternwheeler Riverboat (twin smokestacks, white decks & red paddlewheel)
 *   - `frontier`     : Indian Birchbark Canoe (high-curled birch prow/stern, painted totems & paddles)
 *   - `americana`    : Double-Ended Harbor Ferry (walk-around decks, red/cream hull & upper pilothouse)
 *   - `alps`         : Giant Inflatable Snowtube Boat (toroidal rubber bumpers, grab handles & ski flags)
 *   - `fiesta`       : Rainbow Piñata Ship (fringed tissue-paper bands, 7-pointed conical spikes & ribbons)
 *   - `gothic`       : Spectral Ghost Ship (translucent ectoplasm glow, skeletal ribs & tattered sails)
 *   - `space`        : Orbital Star-Cruiser Spaceship (sleek titanium hull, delta wings & cyan thrusters)
 *   - `retro_future` : 1950s Atomic Rocketship (chrome hull, swept tailfins, bubble dome & Saturn ring)
 *   - `jungle`       : Lashed Bamboo Expedition Raft (bundled bamboo logs, wooden crates & palm sail)
 *   - `tiki`         : Kon-Tiki Polynesian Raft (driftwood logs, carved Tiki mask prow & woven reed sail)
 *   - `classic`      : Carnival Showboat (crimson & cream stripes, chasing lights & scalloped canopy)
 *   - `bavarian`     : Bavarian Royal Lake Ship (blue/white lozenge hull, copper onion finial & beer kegs)
 *   - `standard`     : Unthemed Huss Swinging Ship
 *
 *  opts.themeId / theme : any of the 16 theme keys above
 *  opts.rideThemeTier   : 0..4 (<=2 renders Standard Unthemed; >=3 renders Heavy/Immersive themed craft)
 *  opts.accent          : Land color (used for standard accents & hex border)
 *  opts.t               : elapsed time in seconds (auto-swings pendulum) OR manual angle if `opts.angle` is set
 *  opts.angle           : optional explicit swing angle in radians (-1.15 .. +1.15)
 *  opts.flip            : true when mirrored horizontally (NE-SW orientation)
 *  opts.tile            : draw hex tile underneath (default true)
 */
function drawPirateShip(ctx, cx, cy, R, o = {}) {
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTh = String(o.themeId || o.theme || 'standard').toLowerCase().replace(/-/g, '_');
  if (rawTh === 'unthemed') rawTh = 'standard';
  if (rawTh === 'german') rawTh = 'bavarian';
  if (rawTh === 'wildwest' || rawTh === 'wild_west') rawTh = 'western';
  if (rawTh === 'retro') rawTh = 'retro_future';
  const theme = (tier <= 2 || !PIRATE_SHIP_SKINS[rawTh]) ? 'standard' : rawTh;
  const meta = PIRATE_SHIP_SKINS[theme] || PIRATE_SHIP_SKINS.standard;

  const accent = o.accent || meta.border || '#d97706';
  const fl = o.flip ? -1 : 1;
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

  // Isometric Projection:
  // Ship swings along the `X` axis (NW-SE diagonal in isometric space)
  // `Y` runs across the width of the ship (between back A-frame at -ay and front A-frame at +ay)
  // `Z` runs vertically upward
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
  const Zp  = 7.8;    // Overhead pivot axle height
  const Larm = 5.45;  // Pendulum suspension radius from pivot down to vessel keel
  const ay  = 2.15;   // Half-distance between Back (-ay) and Front (+ay) A-frame pylons
  const leg = 3.15;   // Half-spread of A-frame legs along the swing axis (X = +-leg)

  // Pendulum 3D kinematics in the X-Z plane (rotating around Y-axis at (0, 0, Zp))
  const sp = Math.sin(swingAng), cp = Math.cos(swingAng);
  // Local vessel coordinates `(lx, ly, lz)` where `(0, 0, 0)` is the vessel's keel center
  // and `+lz` points up toward the pivot `(0, 0, Zp)`!
  const V = (lx, ly, lz) => {
    const relZ = lz - Larm; // relative to pivot at Zp
    const wx = lx * cp + relZ * sp;
    const wz = Zp - lx * sp + relZ * cp;
    return P(wx, ly, wz);
  };

  // Helper: Draw a 3D box attached to the swinging vessel frame `V(lx, ly, lz)`
  const vBox = (x0, x1, y0, y1, z0, z1, cFront, cSide, cTop, strokeCol, lw) => {
    if (cTop) poly([V(x0,y0,z1), V(x1,y0,z1), V(x1,y1,z1), V(x0,y1,z1)], cTop, strokeCol, lw);
    poly([V(x0,y1,z0), V(x1,y1,z0), V(x1,y1,z1), V(x0,y1,z1)], cFront, strokeCol, lw);
    poly([V(x1,y0,z0), V(x1,y1,z0), V(x1,y1,z1), V(x1,y0,z1)], cSide, strokeCol, lw);
  };

  // Helper: Draw 5 Rows of 2 Seated Passengers inside the vessel
  const drawVesselRiders = (rowsX, zSeat, benchCol) => {
    const shirts = ['#ef4444', '#3b82f6', '#22c55e', '#facc15', '#a855f7'];
    rowsX.forEach((rx, rIdx) => {
      vBox(rx - 0.25, rx + 0.25, -0.78, 0.78, zSeat - 0.15, zSeat + 0.08, benchCol, shade(benchCol,-0.25), shade(benchCol,0.15));
      [-0.42, 0.42].forEach((ry, sIdx) => {
        const torso = V(rx, ry, zSeat + 0.34);
        const head  = V(rx, ry, zSeat + 0.72);
        ell(torso, S * 0.23, S * 0.26, shirts[(rIdx + sIdx) % 5]);
        disc(head, S * 0.18, theme === 'space' || theme === 'retro_future' ? '#ffffff' : '#fde4c8', '#1e293b', S * 0.03);
        if (theme === 'space' || theme === 'retro_future') {
          disc([head[0] + S * 0.04, head[1]], S * 0.11, '#0284c7');
        }
      });
      // Safety lap-bar across the row
      line(V(rx + 0.22, -0.76, zSeat + 0.35), V(rx + 0.22, 0.76, zSeat + 0.35), '#facc15', S * 0.08);
    });
  };

  // 2. Ground Boarding Platform & Dynamic Vessel Shadow (NO giant slab!)
  const pGnd = P(0, 0, 0);
  // Subtle wooden boarding dock step directly beneath the resting ship
  poly([P(-2.4, -1.1, 0), P(2.4, -1.1, 0), P(2.4, 1.1, 0), P(-2.4, 1.1, 0)], 'rgba(15, 23, 42, 0.22)');
  // Dynamic shadow cast by the swinging ship on the ground
  const shX = Larm * sp * 0.85;
  ell(P(shX, 0, 0), S * 3.8, S * 1.15, 'rgba(10, 15, 25, 0.32)');

  // 3. Helper to draw a themed A-Frame Support Pylon at `Y0` (-ay = Back pylon, +ay = Front pylon)
  const drawAFrame = (Y0, isFront) => {
    const topY = Y0 * 0.82;
    const top  = P(0, topY, Zp);
    const fL   = P(-leg, Y0, 0);
    const fR   = P( leg, Y0, 0);
    const c1   = theme === 'standard' ? '#f8fafc' : meta.leg1;
    const c2   = theme === 'standard' ? accent    : meta.leg2;

    // Compact footpad piers
    [fL, fR].forEach(ft => {
      ell([ft[0], ft[1] + S * 0.06], S * 0.55, S * 0.26, 'rgba(15,23,42,0.34)');
      ell(ft, S * 0.46, S * 0.22, '#64748b', '#1e293b', S * 0.06);
    });

    // Horizontal tie-bar & cross-bracing
    const mL = lerp(fL, top, 0.32), mR = lerp(fR, top, 0.32);
    line(mL, mR, '#1e293b', S * 0.22);
    line(mL, mR, c2, S * 0.12);

    // Splayed A-frame legs with striped carnival/themed segments
    [fL, fR].forEach(f => {
      line(f, top, '#1e293b', S * 0.44);
      const nSeg = 6;
      for (let s = 0; s < nSeg; s++) {
        const a = lerp(f, top, s / nSeg + 0.01), b = lerp(f, top, (s + 0.88) / nSeg);
        line(a, b, s % 2 === 0 ? c1 : c2, S * 0.30);
      }
    });

    // Apex Bearing Hub & Theme Crest on Front Pylon
    disc(top, S * 0.45, '#1e293b', c2, S * 0.08);
    disc(top, S * 0.24, c2);
    if (isFront) {
      // Theme finial crowning the front A-frame apex
      const cr = [top[0], top[1] - S * 0.55];
      if (theme === 'caribbean' || theme === 'medieval' || theme === 'nordic') {
        line(top, cr, '#facc15', S * 0.10);
        poly([cr, [cr[0] + S * 0.85, cr[1] + S * 0.18], [cr[0], cr[1] + S * 0.42]], theme === 'caribbean' ? '#0f172a' : '#b91c1c', '#facc15', S * 0.05);
      } else if (theme === 'space' || theme === 'retro_future') {
        disc(cr, S * 0.26, '#0f172a', '#22d3ee', S * 0.07);
        disc(cr, S * 0.12, '#22d3ee');
      } else if (theme === 'alps' || theme === 'bavarian') {
        disc(cr, S * 0.28, '#dc2626', '#ffffff', S * 0.07);
      }
    }
  };

  // =========================================================================
  // PASS 1: DRAW BACK A-FRAME PYLON (-ay) & OVERHEAD AXLE BEAM
  // =========================================================================
  drawAFrame(-ay, false);
  const axBack = P(0, -ay * 0.82, Zp), axFront = P(0, ay * 0.82, Zp);
  line(axBack, axFront, '#1e293b', S * 0.44);
  line(axBack, axFront, meta.leg1, S * 0.26);

  // =========================================================================
  // PASS 2: BACK SUSPENSION STRUTS (Connecting Overhead Axle to Far Side `-0.82` of Vessel)
  // =========================================================================
  const pAxFar  = P(0, -ay * 0.65, Zp);
  const pAxNear = P(0,  ay * 0.65, Zp);
  const armCol  = (theme === 'western' || theme === 'frontier' || theme === 'jungle' || theme === 'tiki' || theme === 'nordic') ? '#78350f' : '#cbd5e1';

  [-2.2, 2.2].forEach(lx => {
    line(pAxFar, V(lx, -0.78, 0.85), '#1e293b', S * 0.22);
    line(pAxFar, V(lx, -0.78, 0.85), armCol, S * 0.12);
  });

  // =========================================================================
  // PASS 3: THE 16 BESPOKE SWINGING VESSELS (Centered at `V(0, 0, 0)`)
  // =========================================================================

  // Helper for classic curved wooden boat hull (Galleon, Cog, Longship, Ghost Ship, Showboat, Bavarian)
  const drawCurvedBoatHull = (hullMain, hullTrim, hullDark, prowZ, sternZ, deckZ, hasSternCastle) => {
    const N = 16;
    const keelPts = [], gunPts = [];
    for (let i = 0; i <= N; i++) {
      const s = -1 + 2 * i / N; // -1 = stern (left), +1 = bow (right)
      const lx = s * 3.45;
      const sheer = Math.pow(Math.abs(s), 2.1);
      const zBot = 0.05 + sheer * (s > 0 ? prowZ*0.45 : sternZ*0.45);
      const zTop = deckZ + sheer * (s > 0 ? prowZ : sternZ) + (hasSternCastle && s < -0.45 ? 0.85 : 0);
      keelPts.push(V(lx, 0.72, zBot));
      gunPts.push(V(lx, 0.96, zTop));
    }
    // Interior deck floor & 5 rows of riders
    vBox(-2.45, 2.45, -0.82, 0.82, 0.25, deckZ - 0.12, hullDark, hullDark, shade(hullMain, 0.18));
    drawVesselRiders([-2.0, -1.0, 0, 1.0, 2.0], deckZ, hullDark);

    // Sculpted 3D curved front (+Y) hull planking & rub-rail trim
    poly(gunPts.concat(keelPts.slice().reverse()), hullMain, hullDark, S * 0.07);
    ctx.strokeStyle = hullTrim; ctx.lineWidth = S * 0.13;
    ctx.beginPath(); gunPts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
  };

  if (theme === 'caribbean') {
    // 1. CARIBBEAN: Normal Pirate Galleon with High Poop Deck, Stern Lanterns, Bowsprit & Jolly Roger Sail!
    drawCurvedBoatHull('#6b4222', '#f59e0b', '#3e2716', 1.35, 1.65, 1.05, true);
    // Bowsprit spar & golden figurehead
    line(V(3.3, 0, 2.1), V(4.6, 0, 2.85), '#78350f', S * 0.16);
    disc(V(3.55, 0, 1.85), S * 0.24, '#facc15', '#78350f', S * 0.05);
    // Stern gallery windows & brass lanterns
    vBox(-3.55, -2.55, -0.85, 0.85, 1.55, 2.35, '#451a03', '#291509', '#78350f', '#f59e0b', S * 0.06);
    disc(V(-3.62, 0.65, 2.45), S * 0.18, '#fef08a', '#b45309', S * 0.05);
    // Center Mast + Billowing Black Jolly Roger Square Sail + Crow's Nest
    line(V(0, 0, 0.9), V(0, 0, 4.35), '#5a3a22', S * 0.22);
    poly([V(-0.15, 0.72, 1.85), V(-0.15, -0.72, 1.85), V(0.55, -0.72, 2.75), V(-0.15, -0.72, 3.65), V(-0.15, 0.72, 3.65), V(0.55, 0.72, 2.75)], '#0f172a', '#f8fafc', S * 0.06);
    disc(V(0.25, 0.25, 2.78), S * 0.22, '#f8fafc');
    // Pirate flag at masthead
    poly([V(0, 0, 4.35), V(-0.95, 0, 4.15), V(0, 0, 3.85)], '#0f172a', '#ef4444', S * 0.04);
  }
  else if (theme === 'medieval') {
    // 2. MEDIEVAL: Hanseatic Cog (Round-bellied clinker tub hull, raised aft castle & crimson/gold cross sail)
    drawCurvedBoatHull('#8a5a33', '#eab308', '#5a3b22', 1.45, 1.55, 1.15, true);
    // Raised timber aft & fore battle-castles with shields
    vBox(-3.45, -2.35, -0.88, 0.88, 1.65, 2.45, '#78350f', '#451a03', '#a16207', '#eab308', S * 0.06);
    [-1.6, -0.5, 0.6, 1.7].forEach((sx, i) => {
      disc(V(sx, 0.96, 1.15), S * 0.20, i % 2 ? '#b91c1c' : '#1d4ed8', '#facc15', S * 0.05);
    });
    // Single Cog Mast & White/Crimson Heraldic Cross Square Sail
    line(V(0.1, 0, 0.9), V(0.1, 0, 4.25), '#5a3b22', S * 0.24);
    poly([V(-0.1, 0.75, 1.85), V(-0.1, -0.75, 1.85), V(0.55, -0.75, 2.75), V(-0.1, -0.75, 3.65), V(-0.1, 0.75, 3.65), V(0.55, 0.75, 2.75)], '#fffbeb', '#b91c1c', S * 0.07);
    line(V(0.25, 0.45, 2.75), V(0.25, -0.45, 2.75), '#b91c1c', S * 0.16);
    line(V(0.25, 0, 2.15), V(0.25, 0, 3.35), '#b91c1c', S * 0.16);
  }
  else if (theme === 'nordic') {
    // 3. NORDIC: Viking Drakkar Longship (Low sleek hull, fierce dragon prow, curled tail, round shields & striped sail)
    drawCurvedBoatHull('#5a361a', '#f59e0b', '#290f02', 1.65, 1.55, 0.85, false);
    // Towering Golden Dragon Head Prow (+X) & Curled Tail (-X)
    const pBow = V(3.35, 0, 2.35), pDrag = V(3.75, 0, 3.35);
    line(pBow, pDrag, '#f59e0b', S * 0.26);
    poly([pDrag, [pDrag[0]+S*0.55, pDrag[1]-S*0.18], [pDrag[0]+S*0.35, pDrag[1]+S*0.15]], '#f59e0b', '#78350f', S * 0.05);
    line(V(-3.35, 0, 2.25), V(-3.65, 0, 3.05), '#f59e0b', S * 0.22);
    // 7 Overlapping Painted Viking Round Shields along the gunwale
    for (let k = -3; k <= 3; k++) {
      disc(V(k * 0.82, 0.96, 0.92), S * 0.22, k % 2 ? '#991b1b' : '#0284c7', '#facc15', S * 0.05);
    }
    // Red-and-Gold Striped Square Viking Sail
    line(V(0, 0, 0.8), V(0, 0, 4.15), '#451a03', S * 0.20);
    poly([V(-0.1, 0.72, 1.75), V(-0.1, -0.72, 1.75), V(0.55, -0.72, 2.65), V(-0.1, -0.72, 3.55), V(-0.1, 0.72, 3.55), V(0.55, 0.72, 2.65)], '#b91c1c', '#facc15', S * 0.07);
    line(V(0.22, 0.5, 2.15), V(0.22, -0.5, 2.15), '#fef08a', S * 0.14);
    line(V(0.22, 0.5, 3.15), V(0.22, -0.5, 3.15), '#fef08a', S * 0.14);
  }
  else if (theme === 'western') {
    // 4. WILD WEST: Old Mississippi Sternwheeler Paddlewheel Riverboat!
    // Wide flat-bottomed white & crimson riverboat hull
    vBox(-3.2, 3.4, -0.95, 0.95, 0.15, 0.95, '#f8fafc', '#cbd5e1', '#d97706', '#451a03', S * 0.06);
    poly([V(3.4, -0.95, 0.15), V(4.15, 0, 0.45), V(3.4, 0.95, 0.15), V(3.4, 0, 0.95)], '#f8fafc', '#451a03', S * 0.06);
    drawVesselRiders([-2.2, -1.1, 0, 1.1, 2.2], 0.95, '#78350f');
    // Second-story Texas Boiler Deck & Pilothouse
    vBox(-2.1, 1.9, -0.75, 0.75, 1.65, 2.45, '#fef3c7', '#fde68a', '#b91c1c', '#78350f', S * 0.06);
    vBox(-0.6, 0.8, -0.52, 0.52, 2.45, 3.15, '#ffffff', '#e2e8f0', '#b91c1c', '#451a03', S * 0.05);
    // Twin Tall Black Fluted Smokestacks with Gold Crowns at the Bow (+2.3)
    [-0.45, 0.45].forEach(sy => {
      line(V(2.35, sy, 0.95), V(2.35, sy, 3.85), '#18181b', S * 0.24);
      disc(V(2.35, sy, 3.85), S * 0.16, '#facc15');
    });
    // Giant Red Rotating Stern Paddlewheel at the Rear (-3.55)!
    const pwC = V(-3.55, 0.85, 0.65);
    disc(pwC, S * 0.58, '#991b1b', '#facc15', S * 0.08);
    for (let b = 0; b < 8; b++) {
      const ba = clockT * 4 + b * TAU / 8;
      line(pwC, [pwC[0] + Math.cos(ba)*S*0.54, pwC[1] + Math.sin(ba)*S*0.54], '#fef08a', S * 0.07);
    }
  }
  else if (theme === 'frontier') {
    // 5. FRONTIER: Indian Birchbark Canoe with High-Curled Prow/Stern, Painted Totems & Paddles!
    const N = 16, keelPts = [], gunPts = [];
    for (let i = 0; i <= N; i++) {
      const s = -1 + 2 * i / N, lx = s * 3.55;
      const curl = Math.pow(Math.abs(s), 2.8);
      keelPts.push(V(lx, 0.65, 0.08 + curl * 0.85));
      gunPts.push(V(lx, 0.88, 0.88 + curl * 1.45));
    }
    vBox(-2.4, 2.4, -0.75, 0.75, 0.22, 0.75, '#8a5a33', '#5a3b22', '#b58858');
    drawVesselRiders([-2.0, -1.0, 0, 1.0, 2.0], 0.78, '#5a3b22');
    // Cream-gold birchbark hull with dark cedar gunwales & painted red/teal tribal motifs
    poly(gunPts.concat(keelPts.slice().reverse()), '#e8d8b5', '#5a3b22', S * 0.07);
    ctx.strokeStyle = '#5a3b22'; ctx.lineWidth = S * 0.13;
    ctx.beginPath(); gunPts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
    // Painted tribal sun & chevron motifs on the birchbark hull
    [-1.8, 0, 1.8].forEach((mx, idx) => {
      disc(V(mx, 0.90, 0.55), S * 0.18, idx === 1 ? '#b91c1c' : '#0d9488', '#451a03', S * 0.04);
    });
    // Crossed wooden canoe paddles mounted along the hull side
    [-1.2, 1.2].forEach(px => {
      line(V(px - 0.5, 0.92, 0.85), V(px + 0.5, 0.92, 0.35), '#78350f', S * 0.09);
    });
  }
  else if (theme === 'americana') {
    // 6. AMERICANA: Double-Ended Staten Island Harbor Ferry Boat!
    // Rounded double-ended crimson & cream ferry hull
    vBox(-3.3, 3.3, -1.0, 1.0, 0.15, 0.95, '#b91c1c', '#7f1d1d', '#fbf6e8', '#1d3557', S * 0.06);
    [-1, 1].forEach(dir => {
      poly([V(dir*3.3, -1.0, 0.15), V(dir*3.95, 0, 0.35), V(dir*3.3, 1.0, 0.15), V(dir*3.3, 0, 0.95)], '#b91c1c', '#fbbf24', S * 0.06);
    });
    drawVesselRiders([-2.1, -1.05, 0, 1.05, 2.1], 0.95, '#1d3557');
    // Upper Promenade Cabin Deck & Central Pilothouse Wheelhouse + Smokestack
    vBox(-2.2, 2.2, -0.82, 0.82, 1.65, 2.35, '#fbf6e8', '#dfd3b8', '#1d3557', '#b91c1c', S * 0.06);
    vBox(-0.65, 0.65, -0.55, 0.55, 2.35, 3.05, '#ffffff', '#e2e8f0', '#b91c1c', '#1d3557', S * 0.05);
    line(V(-1.1, 0, 2.35), V(-1.1, 0, 3.55), '#1d3557', S * 0.26);
    line(V(-1.1, 0, 3.25), V(-1.1, 0, 3.45), '#fbbf24', S * 0.28);
    // White life-rings along the ferry rail
    [-1.8, 0, 1.8].forEach(rx => disc(V(rx, 1.02, 0.62), S * 0.16, '#ffffff', '#ef4444', S * 0.05));
  }
  else if (theme === 'alps') {
    // 7. ALPS: Giant Inflatable Snowtube in the Shape of a Ship!
    vBox(-2.6, 2.6, -0.78, 0.78, 0.25, 0.85, '#0284c7', '#0369a1', '#38bdf8');
    drawVesselRiders([-2.0, -1.0, 0, 1.0, 2.0], 0.85, '#1e3a8a');
    // Thick, pillowy inflatable rubber snowtube bolsters wrapping the entire perimeter + upturned bow/stern tubes!
    const N = 16;
    for (let i = 0; i <= N; i++) {
      const s = -1 + 2 * i / N, lx = s * 3.45;
      const lift = Math.pow(Math.abs(s), 2.3) * 1.15;
      const pTube = V(lx, 0.88, 0.62 + lift);
      const colT = (i % 2 === 0) ? '#dc2626' : '#f8fafc';
      disc(pTube, S * 0.44, colT, '#0284c7', S * 0.06);
      // Black rubber webbing grab-handles on the tube bolsters
      if (i % 3 === 1) {
        line([pTube[0] - S*0.18, pTube[1] - S*0.15], [pTube[0] + S*0.18, pTube[1] - S*0.15], '#0f172a', S * 0.08);
      }
    }
    // Crossed alpine skis & Swiss flag mast
    line(V(0, 0, 0.8), V(0, 0, 3.45), '#f8fafc', S * 0.16);
    poly([V(0, 0, 3.45), V(0.85, 0, 3.2), V(0, 0, 2.85)], '#dc2626', '#ffffff', S * 0.05);
  }
  else if (theme === 'fiesta') {
    // 8. FIESTA: Rainbow Paper-Fringe Piñata Ship with 7-Pointed Conical Spikes & Streamers!
    const pCols = ['#e11d48', '#f59e0b', '#10b981', '#3b82f6', '#a855f7', '#ec4899'];
    vBox(-2.8, 2.8, -0.85, 0.85, 0.25, 0.95, '#0d9488', '#115e59', '#fde047');
    drawVesselRiders([-2.0, -1.0, 0, 1.0, 2.0], 0.95, '#e11d48');
    // Layered colorful tissue-paper fringed hull bands
    for (let b = 0; b < 6; b++) {
      const xa = -3.2 + b * 1.06, xb = xa + 1.08;
      vBox(xa, xb, -0.95, 0.95, 0.18, 1.15, pCols[b], shade(pCols[b], -0.22), pCols[(b+1)%6], '#ffffff', S * 0.04);
    }
    // Giant 7-Pointed Conical Piñata Star Spikes jutting out from Bow, Stern & Sides!
    const spikes = [
      [V(3.2, 0.85, 0.8),  V(4.35, 1.15, 1.35), '#facc15'],
      [V(-3.2, 0.85, 0.8), V(-4.35, 1.15, 1.35),'#ec4899'],
      [V(0, 0.95, 0.7),    V(0, 1.85, 0.55),    '#10b981'],
      [V(-1.6, 0.95, 0.7), V(-1.8, 1.75, 0.65), '#3b82f6'],
      [V(1.6, 0.95, 0.7),  V(1.8, 1.75, 0.65),  '#f97316']
    ];
    spikes.forEach(([pB, pTip, col]) => {
      poly([[pB[0]-S*0.24, pB[1]], pTip, [pB[0]+S*0.24, pB[1]]], col, '#ffffff', S * 0.05);
      // Fluttering tissue streamers at each spike tip
      line(pTip, [pTip[0], pTip[1] + S * 0.55], col, S * 0.06);
    });
  }
  else if (theme === 'gothic') {
    // 9. GOTHIC: Spectral Ghost Ship ("The Flying Dutchman") with Glowing Ectoplasm Hull & Tattered Sails!
    ctx.save();
    // Eerie green/violet ghostly aura around the ship
    ell(V(0, 0.4, 1.2), S * 4.2, S * 1.8, 'rgba(16, 185, 129, 0.16)');
    drawCurvedBoatHull('#1e293b', '#34d399', '#090d16', 1.45, 1.65, 1.05, true);
    // Exposed skeletal ship ribs along the hull
    for (let rx = -2.2; rx <= 2.2; rx += 0.72) {
      line(V(rx, 0.96, 0.25), V(rx, 0.96, 1.18), '#6ee7b7', S * 0.08);
    }
    // Tattered ragged spectral sails & glowing ghost lantern
    line(V(0, 0, 0.9), V(0, 0, 4.35), '#334155', S * 0.20);
    poly([
      V(-0.15, 0.72, 1.85), V(-0.15, 0.2, 2.25), V(-0.15, -0.72, 1.85),
      V(0.55, -0.72, 2.75), V(-0.15, -0.72, 3.65), V(-0.15, 0.72, 3.65), V(0.55, 0.72, 2.75)
    ], 'rgba(110, 231, 183, 0.52)', '#a7f3d0', S * 0.06);
    disc(V(-3.55, 0.65, 2.45), S * 0.20, '#34d399');
    ctx.restore();
  }
  else if (theme === 'space') {
    // 10. SPACE: Orbital Star-Cruiser Spaceship with Titanium Hull, Delta Wings & Cyan Ion Thrusters!
    vBox(-2.9, 2.8, -0.88, 0.88, 0.25, 1.05, '#e2e8f0', '#94a3b8', '#0284c7', '#0f172a', S * 0.06);
    // Sharp pointed starfighter nose cone (+X)
    poly([V(2.8, -0.88, 0.25), V(4.25, 0, 0.55), V(2.8, 0.88, 0.25), V(2.8, 0, 1.05)], '#0284c7', '#22d3ee', S * 0.07);
    // Swept delta wings & twin glowing cyan ion thruster bells at rear (-X)
    poly([V(-2.4, 0.88, 0.55), V(0.6, 0.88, 0.55), V(-1.8, 1.85, 0.45)], '#cbd5e1', '#22d3ee', S * 0.06);
    disc(V(-3.05, 0.42, 0.65), S * 0.26, '#22d3ee', '#ffffff', S * 0.05);
    disc(V(-3.05, -0.42, 0.65), S * 0.26, '#22d3ee', '#ffffff', S * 0.05);
    drawVesselRiders([-2.0, -1.0, 0, 1.0, 2.0], 1.05, '#0f172a');
    // Overhead glowing cyan deflector arch
    line(V(-1.5, 0, 1.05), V(0, 0, 2.85), '#22d3ee', S * 0.14);
    line(V(1.5, 0, 1.05), V(0, 0, 2.85), '#22d3ee', S * 0.14);
  }
  else if (theme === 'retro_future') {
    // 11. RETRO-FUTURE: 1950s Chrome Atomic Rocketship with Swept Tailfins & Bubble Canopy!
    vBox(-2.8, 2.7, -0.86, 0.86, 0.25, 1.02, '#f8fafc', '#cbd5e1', '#f97316', '#0284c7', S * 0.06);
    // Chrome nose cone with orange racing stripe
    poly([V(2.7, -0.86, 0.25), V(4.15, 0, 0.58), V(2.7, 0.86, 0.25), V(2.7, 0, 1.02)], '#f97316', '#ffffff', S * 0.07);
    // Swept 1950s dorsal & side rocket tailfins at rear (-X)
    poly([V(-2.9, 0, 1.0), V(-3.55, 0, 2.25), V(-1.4, 0, 1.02)], '#06b6d4', '#ffffff', S * 0.06);
    poly([V(-2.8, 0.86, 0.6), V(-3.45, 1.55, 0.85), V(-1.5, 0.86, 0.6)], '#f97316', '#ffffff', S * 0.06);
    drawVesselRiders([-2.0, -1.0, 0, 1.0, 2.0], 1.02, '#0284c7');
    // Atomic spire & Saturn ring
    line(V(0, 0, 1.0), V(0, 0, 3.25), '#cbd5e1', S * 0.14);
    disc(V(0, 0, 3.25), S * 0.24, '#f97316', '#ffffff', S * 0.05);
  }
  else if (theme === 'jungle' || theme === 'tiki') {
    // 12 & 13. JUNGLE & TIKI: Lashed Wooden & Bamboo Log Rafts!
    const logCol = theme === 'jungle' ? '#a16207' : '#78350f';
    const logAlt = theme === 'jungle' ? '#ca8a04' : '#5a3b22';
    // 5 Thick Parallel Lashed Bamboo/Driftwood Logs forming the raft deck
    [-0.78, -0.39, 0, 0.39, 0.78].forEach((ly, idx) => {
      vBox(-3.35, 3.35, ly - 0.18, ly + 0.18, 0.22, 0.62, idx % 2 ? logCol : logAlt, shade(logCol, -0.25), shade(logCol, 0.18), '#3e2716', S * 0.05);
    });
    // Cross-lashed bamboo poles & braided rope bindings
    [-2.4, 0, 2.4].forEach(bx => {
      vBox(bx - 0.16, bx + 0.16, -0.96, 0.96, 0.58, 0.78, '#d9a74a', '#92400e', '#fef08a');
    });
    drawVesselRiders([-2.0, -1.0, 0, 1.0, 2.0], 0.78, '#451a03');
    // Carved Tiki Idol / Wooden Crate at bow (+2.8) + Woven Reed / Palm-Leaf Sail
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
    // 14, 15, 16. STANDARD, CLASSIC MIDWAY & BAVARIAN: Classic Swinging Ships!
    const hullC = theme === 'classic' ? '#e11d48' : theme === 'bavarian' ? '#2563eb' : '#92400e';
    const trimC = theme === 'classic' ? '#fef08a' : theme === 'bavarian' ? '#ffffff' : accent;
    drawCurvedBoatHull(hullC, trimC, shade(hullC, -0.35), 1.35, 1.35, 1.05, false);
    if (theme === 'bavarian') {
      // Bavarian oak beer barrels at bow & stern + copper onion dome finial on mast
      vBox(2.45, 3.05, -0.45, 0.45, 1.05, 1.65, '#92400e', '#5a3b22', '#facc15');
    }
    line(V(0, 0, 0.9), V(0, 0, 4.15), '#f8fafc', S * 0.18);
    poly([V(-0.1, 0.72, 1.75), V(-0.1, -0.72, 1.75), V(0.55, -0.72, 2.65), V(-0.1, -0.72, 3.55), V(-0.1, 0.72, 3.55), V(0.55, 0.72, 2.65)], trimC, hullC, S * 0.06);
  }

  // =========================================================================
  // PASS 4: FRONT SUSPENSION STRUTS (Connecting Overhead Axle to Near Side `+0.82` of Vessel)
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
/* ===== END SPRITE CODE ===== */
window.drawPirateShip = drawPirateShip;
})();
