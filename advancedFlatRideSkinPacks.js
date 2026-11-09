/* Themed flat-ride sprite implementations from the supplied skin packs. */
const TopSpinSkinPack = (() => {
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
    ctx.lineTo(cx+R*Math.cos(a), cy+R*Math.sin(a)*0.58);}
  ctx.closePath();
}

/* ===== TOP SPIN SKIN METADATA (UNTHEMED + 11 HEAVY/IMMERSIVE SKINS) ===== */
const TOPSPIN_SKINS = {
  unthemed: {id:'unthemed', label:'Unthemed (Tier 0–2)', name:'Huss Park Model ("No. 1 Machine")', sub:'Sunset Gradient Towers, Starburst Signs & Drum Weights', hex:'#cbd5e1', border:'#ef4444'},
  classic:  {id:'classic',  label:'Classic Midway',      name:'Kirmes Harlequin Top Spin',         sub:'Harlequin Diamond Drums, Sunburst Wheels & Lollipop Arms', hex:'#cbb07c', border:'#e11d48'},
  jungle:   {id:'jungle',   label:'Jungle',              name:'Talocan: Temple of Fire & Water',   sub:'Aztec Coffered Back Wall, Tlaloc Statues, Geysers & Fireballs', hex:'#587c48', border:'#2fbf9a'},
  western:  {id:'western',  label:'Wild West',           name:'Runaway Steam Boiler & Derrick',    sub:'Locomotive Smokestack Boilers, Connecting Rods & TNT Weights', hex:'#c99a62', border:'#b91c1c'},
  frontier: {id:'frontier', label:'Frontier',            name:'Thunderbird Totem & Log Bucksaw',   sub:'Outstretched Winged Totem Poles, Serrated Saw Arms & Millstones', hex:'#7d955d', border:'#566e42'},
  space:    {id:'space',    label:'Space',               name:'Orbital Tesla Ring & Warp Fork',    sub:'Curved C-Arc Accelerator Pylons, Tuning-Fork Arms & Singularity', hex:'#334155', border:'#0ea5e9'},
  gothic:   {id:'gothic',   label:'Gothic',              name:'Inquisition Crypt & Hellfire',      sub:'Catacomb Charnel Back Wall, Cleaver Arms & Soul-Fire Jets', hex:'#3b3345', border:'#991b1b'},
  medieval: {id:'medieval', label:'Medieval',            name:'Siege Mangonel & Royal Trebuchet',  sub:'Round Crenellated Castle Towers, Truss Arms & Spiked Flails', hex:'#6c8c58', border:'#eab308'},
  alps:     {id:'alps',     label:'Alps',                name:'Avalanche Cable-Car & Ice Pick',    sub:'Red Steel Funicular Lattice Pylons, Bull-Wheels & Ice-Pick Arms', hex:'#a8c5d6', border:'#0284c7'},
  fiesta:   {id:'fiesta',   label:'Fiesta',              name:'El Torbellino de Fuego',            sub:'Stepped Aztec Sun-Temples, Flaming Torch Braziers & Piñata Stars', hex:'#d99b52', border:'#e11d48'},
  nordic:   {id:'nordic',   label:'Nordic',              name:'Drakkar Prow & Viking Battle-Axe',  sub:'Curved Dragon-Ship Prow Pillars, Double-Bit Axe Arms & Geysers', hex:'#4d6b63', border:'#d97706'},
  bavarian: {id:'bavarian', label:'Bavarian',            name:'Sudhaus Copper Brew-Kettles',       sub:'Domed Copper Brewing Kettles, Steam Pipes & Pretzel/Mug Arms', hex:'#769958', border:'#2563eb'}
};
TOPSPIN_SKINS.german = TOPSPIN_SKINS.bavarian;

/* ===== SPRITE CODE: copy this block into engine.js ===== */
/**
 * drawTopSpin(ctx, cx, cy, R, opts)
 *  opts.accent        : Land / chain accent color (default '#ef4444')
 *  opts.themeId       : 'classic'|'jungle'|'western'|'wildwest'|'frontier'|'space'|'gothic'|'medieval'|'alps'|'fiesta'|'nordic'|'bavarian'|'german'
 *  opts.rideThemeTier : 0..4 (<=2 draws Standard Unthemed; >=3 draws Heavy/Immersive Themed Top Spin)
 *  opts.t             : main arm swing angle in radians (0 = hanging straight down, +-PI = inverted)
 *  opts.tm            : continuous time in seconds for fire/geyser/neon animation
 *  opts.tile          : draw the hex tile background (default true)
 */
function drawTopSpin(ctx, cx, cy, R, opts={}){
  const tier = opts.rideThemeTier != null ? opts.rideThemeTier : (opts.tier != null ? opts.tier : (opts.themeId || opts.theme ? 3 : 0));
  let rawTheme = String(opts.themeId || opts.theme || 'unthemed').toLowerCase();
  if(rawTheme === 'wildwest' || rawTheme === 'wild_west') rawTheme = 'western';
  if(rawTheme === 'german') rawTheme = 'bavarian';
  const theme = (tier <= 2 || !TOPSPIN_SKINS[rawTheme]) ? 'unthemed' : rawTheme;
  const skin = TOPSPIN_SKINS[theme] || TOPSPIN_SKINS.unthemed;
  const accent = opts.accent || skin.border || '#ef4444';
  const ph = opts.t == null ? 0.85 : opts.t;
  const tm = opts.tm == null ? Math.abs(ph)*2 : opts.tm;
  const TAU = Math.PI * 2;

  const cyB = cy + R * 0.08;
  const P = (X,Y,Z) => [cx + (X - Y)*0.7, cyB + (X + Y)*0.35 - Z];
  const lerp = (a,b,t) => [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t];
  const line = (a,b,c,w) => {
    ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
  };
  const poly = (pts,fill,stroke,lw) => {
    ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.lineJoin='round';ctx.stroke();}
  };
  const disc = (p,rr,c,stroke,lw) => {
    ctx.beginPath();ctx.arc(p[0],p[1],Math.max(0.5,rr),0,TAU);
    if(c){ctx.fillStyle=c;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.stroke();}
  };
  const ell = (p,rx,ry,fill,stroke,lw) => {
    ctx.beginPath();ctx.ellipse(p[0],p[1],Math.max(0.5,rx),Math.max(0.5,ry),0,0,TAU);
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.stroke();}
  };
  const isoBox = (x0,x1,y0,y1,z0,z1,cf,ce,ct,stroke,lw) => {
    if(ct) poly([P(x0,y0,z1),P(x1,y0,z1),P(x1,y1,z1),P(x0,y1,z1)], ct, stroke, lw);
    poly([P(x0,y1,z0),P(x1,y1,z0),P(x1,y1,z1),P(x0,y1,z1)], cf, stroke, lw);
    poly([P(x1,y0,z0),P(x1,y1,z0),P(x1,y1,z1),P(x1,y0,z1)], ce, stroke, lw);
  };
  const cylAt = (X, Y, rr, Z0, Z1, col, rimCol, drawTop=true) => {
    const pB = P(X,Y,Z0), pT = P(X,Y,Z1), rx = 0.99*rr, ry = 0.495*rr;
    ctx.beginPath();
    ctx.moveTo(pB[0]-rx, pB[1]); ctx.lineTo(pT[0]-rx, pT[1]);
    ctx.lineTo(pT[0]+rx, pT[1]); ctx.lineTo(pB[0]+rx, pB[1]);
    ctx.ellipse(pB[0], pB[1], rx, ry, 0, 0, Math.PI);
    ctx.closePath();
    const gr = ctx.createLinearGradient(pB[0]-rx, 0, pB[0]+rx, 0);
    gr.addColorStop(0, shade(col, 0.25)); gr.addColorStop(0.4, col); gr.addColorStop(1, shade(col, -0.35));
    ctx.fillStyle = gr; ctx.fill();
    if(rimCol){
      ctx.strokeStyle = rimCol; ctx.lineWidth = R*0.008;
      ctx.beginPath(); ctx.ellipse(pB[0], pB[1], rx, ry, 0, 0, Math.PI); ctx.stroke();
    }
    if(drawTop) ell(pT, rx, ry, shade(col, 0.2), rimCol, R*0.008);
  };
  const coneAt = (X, Y, rr, Z0, Z1, col, rimCol) => {
    const pB = P(X,Y,Z0), tp = P(X,Y,Z1), rx = 0.99*rr, ry = 0.495*rr;
    const gr = ctx.createLinearGradient(pB[0]-rx, 0, pB[0]+rx, 0);
    gr.addColorStop(0, shade(col, 0.28)); gr.addColorStop(0.45, col); gr.addColorStop(1, shade(col, -0.38));
    ctx.beginPath();
    ctx.moveTo(pB[0]-rx, pB[1]); ctx.lineTo(tp[0], tp[1]); ctx.lineTo(pB[0]+rx, pB[1]);
    ctx.ellipse(pB[0], pB[1], rx, ry, 0, 0, Math.PI);
    ctx.closePath();
    ctx.fillStyle = gr; ctx.fill();
    if(rimCol){
      ctx.strokeStyle = rimCol; ctx.lineWidth = R*0.008;
      ctx.beginPath(); ctx.ellipse(pB[0], pB[1], rx, ry, 0, 0, Math.PI); ctx.stroke();
    }
    return tp;
  };
  const frontText = (xa, xb, y, zTop, zH, txt, fg, fontFam) => {
    const p = P(xa, y, zTop);
    ctx.save();
    ctx.transform(0.7, 0.35, 0, 1, p[0], p[1]);
    ctx.fillStyle = fg || '#ffffff';
    ctx.font = 'bold ' + Math.round(zH * 0.66) + 'px ' + (fontFam || 'Arial Black, Arial, sans-serif');
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(txt, (xb - xa)/2, zH/2, (xb - xa)*0.94);
    ctx.restore();
  };

  // Structural dimensions calibrated to fit the 1-hex diamond cleanly
  const Zp  = R * 0.54;   // Motor pivot axle height
  const L   = R * 0.37;   // Forward swing arm length to gondola
  const Lcw = R * 0.195;  // Rear counterweight tail arm length
  const ax  = R * 0.43;   // Half-distance between left/back (-ax) and right/front (+ax) support towers
  const g   = R * 0.315;  // Half-distance between the two counterweighted swing arms (-g and +g)
  const W   = R * 0.25;   // Gondola depth
  const leg = R * 0.25;   // A-frame stabilizer strut spread in Y

  // 1. Optional Hex Tile Base (NO Rectangular Concrete Baseplate!)
  if(opts.tile !== false){
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = theme === 'unthemed' ? '#cbd5e1' : skin.hex;
    ctx.fill();
    ctx.lineWidth = Math.max(2, R*0.055);
    ctx.strokeStyle = accent;
    ctx.stroke();
  }

  // Kinematics of the main swing arms (angle ph) and independently flipping gondola (angle gPh)
  const sp = Math.sin(ph), cp = Math.cos(ph);
  const C = [0, L*sp, Zp - L*cp];                // Gondola 3D center
  const CW3 = (X) => [X, -Lcw*sp, Zp + Lcw*cp];  // Counterweight 3D center at arm X

  // Gondola independent pitch/flip angle (flips dramatically as arms swing through top/bottom)
  const gPh = ph * 1.65 + Math.sin(ph * 2) * 0.55;
  const u = [0, -Math.sin(gPh), Math.cos(gPh)];  // Gondola local "up" vector (head direction)
  const w = [0,  Math.cos(gPh), Math.sin(gPh)];  // Gondola local "forward/back" width vector

  // 2. Ground Basin / Splash Trench & Dynamic Gondola Ground Shadow (NO Rectangular Concrete Slab!)
  const pCenter = P(0, 0, 0);
  if(theme === 'jungle'){
    // Talocan Sunken Sacrificial Water & Fire Trench directly beneath the gondola
    ell(pCenter, R*0.44, R*0.21, '#292524', '#78350f', R*0.014);
    ell(pCenter, R*0.38, R*0.17, '#0f766e', '#2fbf9a', R*0.008);
  } else if(theme === 'gothic'){
    // Sunken Obsidian Soul-Fire Pit beneath the gondola
    ell(pCenter, R*0.44, R*0.21, '#09090b', '#7f1d1d', R*0.014);
    ell(pCenter, R*0.37, R*0.16, '#3b0764', '#c084fc', R*0.008);
  } else if(theme === 'frontier' || theme === 'nordic' || theme === 'alps'){
    // Foaming River Rapids / Geothermal / Snow Basin Ring
    ell(pCenter, R*0.38, R*0.18, 'rgba(15,23,42,0.22)', '#64748b', R*0.01);
    ell(pCenter, R*0.32, R*0.14, theme==='alps' ? '#e0f2fe' : '#0284c7');
  } else {
    // Subtle dark safety target ring directly on the ground under the gondola sweep
    ell(pCenter, R*0.34, R*0.16, 'rgba(15,23,42,0.18)', 'rgba(255,255,255,0.16)', R*0.008);
  }

  // Dynamic shadow of the swinging gondola on the ground
  const shY = Math.max(-R*0.35, Math.min(R*0.35, C[1]));
  const gs = P(0, shY, 0);
  ell(gs, R*0.26, R*0.10, 'rgba(15,23,42,0.32)');

  // =========================================================================
  // 3. SPECIAL ARENA BACKDROP WALLS (JUNGLE "TALOCAN", GOTHIC CRYPT, & CLASSIC KIRMES)
  //    Drawn at Y = -R*0.34 .. -R*0.25 behind the twin towers & swing arms!
  // =========================================================================
  if(theme === 'jungle'){
    // TALOCAN: Towering Aztec / Mayan Coffered Terracotta-Stone Temple Back Wall (image_93f8e4.png)
    const wy0 = -R*0.40, wy1 = -R*0.28, wx0 = -ax - R*0.08, wx1 = ax + R*0.08, wH = Zp + R*0.30;
    // Main terracotta-sandstone temple back wall
    isoBox(wx0, wx1, wy0, wy1, 0, wH, '#b85d3b', '#8c3f23', '#d47a55', '#4a1d0e', R*0.01);
    // Upper projecting Aztec frieze lintel with turquoise & gold glyph blocks
    isoBox(wx0-R*0.02, wx1+R*0.02, wy0-R*0.01, wy1+R*0.02, wH-R*0.07, wH+R*0.02, '#7c2d12', '#451a03', '#d97706', '#eab308', R*0.009);
    for(let k=-4; k<=4; k++){
      const gx = k * R * 0.095;
      poly([P(gx-R*0.025,wy1+R*0.022,wH-R*0.05), P(gx+R*0.025,wy1+R*0.022,wH-R*0.05), P(gx+R*0.025,wy1+R*0.022,wH), P(gx-R*0.025,wy1+R*0.022,wH)], k%2===0 ? '#2fbf9a' : '#facc15');
    }
    // 4x3 Grid of Recessed Coffered Aztec Stone Panels with Skull & Step-Fret Reliefs!
    const nCols = 4, nRows = 3;
    for(let rIdx=0; rIdx<nRows; rIdx++){
      const za = R*0.05 + rIdx*(wH - R*0.14)/nRows;
      const zb = za + (wH - R*0.14)/nRows - R*0.022;
      for(let cIdx=0; cIdx<nCols; cIdx++){
        const xa = -ax*0.82 + cIdx*(ax*1.64)/nCols;
        const xb = xa + (ax*1.64)/nCols - R*0.025;
        // Recessed shadow coffer
        poly([P(xa,wy1+0.002,za), P(xb,wy1+0.002,za), P(xb,wy1+0.002,zb), P(xa,wy1+0.002,zb)], '#7c2d12', '#d97706', R*0.006);
        // Carved stone skull / step-fret relief inside each coffer
        const xm = (xa+xb)*0.5, zm = (za+zb)*0.5, cp = P(xm, wy1+0.005, zm);
        if((rIdx + cIdx) % 2 === 0){
          // Aztec Skull Relief
          ell(cp, R*0.032, R*0.028, '#d47a55', '#451a03', R*0.005);
          disc([cp[0]-R*0.011, cp[1]-R*0.004], R*0.007, '#291509');
          disc([cp[0]+R*0.011, cp[1]-R*0.004], R*0.007, '#291509');
        } else {
          // Stepped Temple Cross / Jade Glyph Relief
          poly([P(xm-R*0.03,wy1+0.005,zm), P(xm,wy1+0.005,zm+R*0.03), P(xm+R*0.03,wy1+0.005,zm), P(xm,wy1+0.005,zm-R*0.03)], '#eab308', '#451a03', R*0.005);
          disc(cp, R*0.009, '#2fbf9a');
        }
      }
    }
    // Creeping jungle vines hanging down the outer stone wings
    [-ax*0.92, ax*0.88].forEach(vx => {
      const vp = P(vx, wy1+0.01, wH);
      ell(vp, R*0.055, R*0.025, '#15803d');
      line(vp, [vp[0], vp[1]+R*0.18], '#166534', R*0.014);
    });
  }
  else if(theme === 'gothic'){
    // GOTHIC: Towering Ruined Inquisition Catacomb & Bone Charnel Back Wall with Crimson Rose Window
    const wy0 = -R*0.40, wy1 = -R*0.28, wx0 = -ax - R*0.08, wx1 = ax + R*0.08, wH = Zp + R*0.28;
    isoBox(wx0, wx1, wy0, wy1, 0, wH, '#27272a', '#18181b', '#3f3f46', '#09090b', R*0.01);
    // Jagged ruined stone battlements along top of back wall
    for(let k=-4; k<=4; k++){
      const bx = k * R * 0.095;
      isoBox(bx-R*0.03, bx+R*0.03, wy0, wy1, wH, wH + (k%2===0 ? R*0.065 : R*0.03), '#3f3f46', '#18181b', '#52525b');
    }
    // Central Glowing Crimson Rose Window set into the upper charnel wall
    const rwP = P(0, wy1+0.005, wH - R*0.16);
    disc(rwP, R*0.11, '#09090b', '#71717a', R*0.012);
    disc(rwP, R*0.088, '#991b1b', '#f59e0b', R*0.007);
    for(let k=0; k<8; k++){
      const a = k*TAU/8;
      line(rwP, [rwP[0]+Math.cos(a)*R*0.088, rwP[1]+Math.sin(a)*R*0.088], '#09090b', R*0.007);
    }
    disc(rwP, R*0.028, '#ef4444');
    // Flanking Pointed Gothic Catacomb Niches filled with glowing candles & skulls
    [-ax*0.58, ax*0.58].forEach(nx => {
      poly([
        P(nx-R*0.07, wy1+0.004, R*0.08),
        P(nx+R*0.07, wy1+0.004, R*0.08),
        P(nx+R*0.07, wy1+0.004, R*0.38),
        P(nx,        wy1+0.004, R*0.48),
        P(nx-R*0.07, wy1+0.004, R*0.38)
      ], '#09090b', '#71717a', R*0.008);
      const skP = P(nx, wy1+0.006, R*0.22);
      disc(skP, R*0.024, '#d4d4d8');
      disc([skP[0], skP[1]-R*0.045], R*0.012, '#f97316');
    });
  }
  else if(theme === 'classic'){
    // CLASSIC MIDWAY: Scalloped Kirmes Painted Backdrop Wall & Retro "Top Spin" Scripted Marquee (image_93f620.png)
    const wy = -R*0.28, wH = R*0.32;
    poly([P(-ax,wy,0), P(ax,wy,0), P(ax,wy,wH), P(-ax,wy,wH)], '#0284c7', '#facc15', R*0.012);
    // Painted wave mural & scalloped bulb medallions along the top rim
    poly([P(-ax,wy,R*0.04), P(0,wy,R*0.22), P(ax,wy,R*0.08), P(ax,wy,0), P(-ax,wy,0)], '#38bdf8');
    for(let k=-4; k<=4; k++){
      const mx = k * ax * 0.22;
      disc(P(mx, wy, wH), R*0.032, k%2===0 ? '#e11d48' : '#facc15', '#ffffff', R*0.006);
    }
    // Retro "Top Spin" raised sign above the backdrop wall
    poly([P(-R*0.22,wy,wH+R*0.02), P(R*0.22,wy,wH+R*0.02), P(R*0.22,wy,wH+R*0.13), P(-R*0.22,wy,wH+R*0.13)], '#e11d48', '#fef08a', R*0.01);
    frontText(-R*0.22, R*0.22, wy, wH+R*0.125, R*0.10, 'TOP SPIN', '#fef08a');
  }

  // =========================================================================
  // 4. HELPER FOR TWIN SCULPTED SUPPORT TOWERS (X0 = -ax Back-Left, +ax Front-Right)
  //    Each tower stands on its own compact 3D footpad pier (NO giant baseplate!)
  // =========================================================================
  const drawSupportTower = (X0, isFront) => {
    const pBase = P(X0, 0, 0);
    // Individual 3D Footpad Pier under this tower + under its front/back stabilizer struts
    ell(pBase, R*0.13, R*0.065, 'rgba(15,23,42,0.30)');
    isoBox(X0-R*0.095, X0+R*0.095, -R*0.095, R*0.095, 0, R*0.045, '#475569', '#334155', '#94a3b8', '#1e293b', R*0.007);

    const top = P(X0, 0, Zp);
    const fBack  = P(X0, -leg, R*0.02);
    const fFront = P(X0,  leg, R*0.02);

    if(theme === 'unthemed'){
      // Classic Huss Park Model ("THE No. 1 MACHINE" — image_93f906.png):
      // Sunset gradient vertical tower (yellow -> orange -> red -> black) + white angled stabilizer struts + top starburst box!
      [fBack, fFront].forEach(fp => ell(fp, R*0.05, R*0.025, '#334155', '#94a3b8', R*0.006));
      // Back stabilizer strut
      line(fBack, top, '#1e293b', R*0.042);
      line(fBack, top, '#cbd5e1', R*0.022);
      // Main vertical tower column with 4 sunset gradient bands
      const bands = [['#facc15','#eab308'], ['#f97316','#ea580c'], ['#ef4444','#dc2626'], ['#1e293b','#0f172a']];
      bands.forEach(([cF, cE], idx) => {
        const zA = R*0.045 + idx*(Zp - R*0.045)/4;
        const zB = R*0.045 + (idx+1)*(Zp - R*0.045)/4;
        isoBox(X0-R*0.065, X0+R*0.065, -R*0.065, R*0.065, zA, zB, cF, cE, null, '#0f172a', R*0.005);
      });
      // Front white/cream angled stabilizer strut with black rungs (matching image_93f906.png!)
      line(fFront, top, '#0f172a', R*0.046);
      line(fFront, top, '#fef3c7', R*0.028);
      [0.25, 0.50, 0.75].forEach(t => {
        const rp = lerp(fFront, top, t);
        disc(rp, R*0.011, '#0f172a');
      });
      // Upper black spire extension + Illuminated Starburst Sign Box at the very top!
      const zSpire = Zp + R*0.22;
      isoBox(X0-R*0.042, X0+R*0.042, -R*0.042, R*0.042, Zp, zSpire, '#1e293b', '#0f172a', '#334155');
      isoBox(X0-R*0.075, X0+R*0.075, -R*0.048, R*0.048, zSpire, zSpire+R*0.11, '#0f172a', '#1e293b', '#334155', accent, R*0.008);
      const sbP = P(X0, R*0.05, zSpire+R*0.055);
      for(let k=0; k<8; k++){
        const a = k*TAU/8;
        line(sbP, [sbP[0]+Math.cos(a)*R*0.042, sbP[1]+Math.sin(a)*R*0.042], k%2 ? '#facc15' : '#f97316', R*0.008);
      }
      // Motor Hub Drum at Zp
      disc(top, R*0.065, '#1e293b', accent, R*0.01);
      disc(top, R*0.032, accent);
    }
    else if(theme === 'classic'){
      // Kirmes Travelling Top Spin (image_93f620.png):
      // Harlequin diamond-patterned cylindrical drum tower + chaser crown + radial neon sunburst wheel sign on front!
      const rDrum = R*0.088, zTop = Zp + R*0.10;
      const pB = P(X0, 0, R*0.045), pT = P(X0, 0, zTop);
      // Cylindrical tower body
      poly([[pB[0]-rDrum,pB[1]], [pT[0]-rDrum,pT[1]], [pT[0]+rDrum,pT[1]], [pB[0]+rDrum,pB[1]]], '#e11d48', '#7f1d1d', R*0.008);
      // Harlequin colorful diamond pattern on the drum
      const dCols = ['#facc15', '#38bdf8', '#f472b6', '#ffffff'];
      for(let row=0; row<3; row++){
        const py = pB[1] - (row+0.5)*(pB[1]-pT[1])/3;
        [-0.45, 0, 0.45].forEach((dx, ci) => {
          const px = pB[0] + dx*rDrum;
          poly([[px,py-R*0.035],[px+R*0.028,py],[px,py+R*0.035],[px-R*0.028,py]], dCols[(row+ci)%4]);
        });
      }
      // Illuminated chaser-bulb crown ring at top of drum
      ell(pT, rDrum*1.12, rDrum*0.55, '#facc15', '#b91c1c', R*0.01);
      // Radial Neon Sunburst "Top Spin" Wheel Emblem mounted on the lower-front of the tower!
      const wP = P(X0, R*0.08, R*0.22);
      disc(wP, R*0.095, '#7f1d1d', '#fef08a', R*0.012);
      for(let k=0; k<12; k++){
        const a = tm*1.5 + k*TAU/12;
        line(wP, [wP[0]+Math.cos(a)*R*0.082, wP[1]+Math.sin(a)*R*0.082], k%2 ? '#fef08a' : '#22c55e', R*0.009);
      }
      disc(wP, R*0.035, '#e11d48', '#ffffff', R*0.006);
      disc(top, R*0.062, '#facc15', '#e11d48', R*0.01);
    }
    else if(theme === 'jungle'){
      // TALOCAN: Massive Carved Aztec Tlaloc Rain-God Stone Monolith Pillar with Side Scroll Volutes & Jade Mask
      const zMon = Zp + R*0.24;
      isoBox(X0-R*0.095, X0+R*0.095, -R*0.095, R*0.095, R*0.045, zMon, '#a88b73', '#7d634d', '#c4a88e', '#451a03', R*0.009);
      // Carved Tlaloc Deity Face on the front of each monolith tower
      const mP = P(X0, R*0.098, Zp + R*0.08);
      ell(mP, R*0.065, R*0.072, '#8e735b', '#451a03', R*0.008);
      disc([mP[0]-R*0.024, mP[1]-R*0.01], R*0.016, '#2fbf9a', '#eab308', R*0.005);
      disc([mP[0]+R*0.024, mP[1]-R*0.01], R*0.016, '#2fbf9a', '#eab308', R*0.005);
      poly([[mP[0]-R*0.035,mP[1]+R*0.02],[mP[0]+R*0.035,mP[1]+R*0.02],[mP[0]+R*0.025,mP[1]+R*0.05],[mP[0]-R*0.025,mP[1]+R*0.05]], '#eab308');
      // Projecting stone scroll volutes on outer edge (matching right side of image_93f8e4.png!)
      const sDir = X0 > 0 ? 1 : -1;
      [0.35, 0.58, 0.80].forEach(zf => {
        const vp = P(X0 + sDir*R*0.095, 0, zMon*zf);
        line(vp, [vp[0]+sDir*R*0.055, vp[1]-R*0.02], '#a88b73', R*0.024);
        disc([vp[0]+sDir*R*0.055, vp[1]], R*0.018, '#eab308');
      });
      // Bronze Aztec Calendar Bearing Drum at Zp
      disc(top, R*0.072, '#92400e', '#eab308', R*0.012);
      disc(top, R*0.038, '#2fbf9a');
    }
    else if(theme === 'gothic'){
      // GOTHIC: Obsidian Cathedral Buttress Pier with Wrought-Iron Spikes & Gargoyle Flame Brazier
      const zBut = Zp + R*0.22;
      isoBox(X0-R*0.085, X0+R*0.085, -R*0.085, R*0.085, R*0.045, zBut, '#27272a', '#18181b', '#3f3f46', '#09090b', R*0.009);
      line(fFront, top, '#18181b', R*0.042);
      line(fFront, top, '#52525b', R*0.018);
      // Pointed gothic spire cap + glowing violet/crimson brazier
      const tTop = P(X0, 0, zBut);
      poly([[tTop[0]-R*0.07,tTop[1]], [tTop[0]+R*0.07,tTop[1]], [tTop[0],tTop[1]-R*0.14]], '#09090b', '#991b1b', R*0.008);
      disc(top, R*0.068, '#18181b', '#dc2626', R*0.011);
      disc(top, R*0.034, '#991b1b');
    }
    else if(theme === 'western'){
      // WILD WEST: Riveted Cast-Iron Steam Locomotive Boiler & Diamond Smokestack Pylon + Brass Pressure Gauge!
      const zBoiler = Zp + R*0.06;
      // Brick firebox pedestal
      isoBox(X0-R*0.085, X0+R*0.085, -R*0.085, R*0.085, R*0.045, R*0.18, '#9a3412', '#7c2d12', '#b45309', '#451a03', R*0.007);
      // Cylindrical black cast-iron vertical steam boiler with brass tension bands
      cylAt(X0, 0, R*0.082, R*0.18, zBoiler, '#27272a', '#f59e0b', true);
      [0.35, 0.68].forEach(f => {
        const pBand = P(X0, 0, R*0.18 + (zBoiler-R*0.18)*f);
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = R*0.012;
        ctx.beginPath(); ctx.ellipse(pBand[0], pBand[1], R*0.083, R*0.041, 0, 0, Math.PI); ctx.stroke();
      });
      // Flared Diamond-Stack Locomotive Funnel on top of the boiler + billowing white steam puffs!
      const zStack = zBoiler + R*0.15;
      cylAt(X0, 0, R*0.038, zBoiler, zBoiler+R*0.07, '#18181b', '#451a03', false);
      coneAt(X0, 0, R*0.082, zBoiler+R*0.11, zStack, '#27272a', '#f59e0b');
      const puff = Math.sin(tm*4 + (X0>0?1:0))*R*0.015;
      disc(P(X0+puff, 0, zStack+R*0.05), R*0.032, 'rgba(248,250,252,0.75)');
      disc(P(X0-puff, 0, zStack+R*0.10), R*0.044, 'rgba(248,250,252,0.50)');
      // Brass pressure gauge & iron flywheel hub at Zp
      disc(P(X0, R*0.085, R*0.34), R*0.026, '#fef3c7', '#d97706', R*0.006);
      disc(top, R*0.076, '#451a03', '#f59e0b', R*0.012);
      for(let s=0; s<6; s++){
        const a = ph + s*TAU/6;
        line(top, [top[0]+Math.cos(a)*R*0.068, top[1]+Math.sin(a)*R*0.068], '#f59e0b', R*0.009);
      }
      disc(top, R*0.028, '#b91c1c');
    }
    else if(theme === 'frontier'){
      // FRONTIER: Hand-Carved Cedar Thunderbird Totem Pole with Wide Outstretched Painted Wings!
      const zTotem = Zp + R*0.18;
      // Stacked carved cedar totem cylinder
      cylAt(X0, 0, R*0.080, R*0.045, zTotem, '#6b4a2b', '#3e2723', true);
      // Colored carved totem face bands (Ochre, Crimson, Teal)
      [[0.22,'#b91c1c'],[0.48,'#eab308'],[0.74,'#137a70']].forEach(([f, col]) => {
        const zb = R*0.045 + (zTotem-R*0.045)*f;
        cylAt(X0, 0, R*0.084, zb, zb+R*0.065, col, '#2e1f14', false);
        const ep = P(X0, R*0.086, zb+R*0.035);
        disc([ep[0]-R*0.02, ep[1]], R*0.012, '#fef08a', '#18181b', R*0.004);
        disc([ep[0]+R*0.02, ep[1]], R*0.012, '#fef08a', '#18181b', R*0.004);
      });
      // Dramatic Outstretched Thunderbird Wings & Hooked Beak crowning each Totem Pole!
      const wTop = P(X0, 0, zTotem - R*0.03);
      [-1, 1].forEach(wDir => {
        poly([
          [wTop[0], wTop[1]],
          [wTop[0] + wDir*R*0.17, wTop[1] - R*0.06],
          [wTop[0] + wDir*R*0.14, wTop[1] + R*0.03],
          [wTop[0], wTop[1] + R*0.04]
        ], '#eab308', '#451a03', R*0.008);
        line([wTop[0]+wDir*R*0.03, wTop[1]-R*0.01], [wTop[0]+wDir*R*0.15, wTop[1]-R*0.03], '#b91c1c', R*0.010);
      });
      // Hooked golden Thunderbird beak & circular buzzsaw hub
      poly([[wTop[0]-R*0.025,wTop[1]],[wTop[0]+R*0.025,wTop[1]],[wTop[0],wTop[1]+R*0.055]], '#f59e0b', '#451a03', R*0.006);
      disc(top, R*0.072, '#cbd5e1', '#451a03', R*0.010);
      disc(top, R*0.034, '#eab308');
    }
    else if(theme === 'space'){
      // SPACE: Sweeping Curved C-Arc Magnetic Accelerator Ring Pylon + Levitating Plasma Orb!
      const sDir = X0 > 0 ? 1 : -1;
      // Futuristic curved C-ring particle-accelerator pylon bowing outward around the hub
      ctx.strokeStyle = '#0f172a'; ctx.lineWidth = R*0.068; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(pBase[0], pBase[1]-R*0.03);
      ctx.quadraticCurveTo(top[0] + sDir*R*0.17, (pBase[1]+top[1])*0.5, top[0], top[1] - R*0.12);
      ctx.stroke();
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = R*0.042; ctx.stroke();
      ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = R*0.014; ctx.stroke();
      // Levitating glowing magenta/cyan plasma energy sphere & orbital rings above the C-arc!
      const orbP = [top[0], top[1] - R*0.21];
      ell(orbP, R*0.095, R*0.035, null, '#22d3ee', R*0.010);
      disc(orbP, R*0.045, '#0f172a', '#e879f9', R*0.010);
      disc(orbP, R*0.024, '#22d3ee');
      // High-tech Tokamak hub ring at Zp
      disc(top, R*0.078, '#0f172a', '#22d3ee', R*0.012);
      disc(top, R*0.048, '#0284c7', '#e879f9', R*0.008);
      disc(top, R*0.022, '#ffffff');
    }
    else if(theme === 'medieval'){
      // MEDIEVAL: Cylindrical Stone Castle Keep Turret with Crenellated Battlements, Conical Pavilion & Fluttering Banner!
      const zTur = Zp + R*0.13;
      cylAt(X0, 0, R*0.088, R*0.045, zTur, '#cbd5e1', '#475569', true);
      // Arrow-slit embrasure on turret shaft
      line(P(X0, R*0.088, R*0.18), P(X0, R*0.088, R*0.32), '#0f172a', R*0.014);
      // Crenellated stone machicolation collar
      cylAt(X0, 0, R*0.104, zTur-R*0.035, zTur+R*0.015, '#94a3b8', '#334155', true);
      // Steep royal-blue & gold conical turret roof + fluttering tournament swallowtail pennant!
      const ap = coneAt(X0, 0, R*0.112, zTur+R*0.015, zTur+R*0.19, '#1d4ed8', '#f5c542');
      const fTop = [ap[0], ap[1]-R*0.11];
      line(ap, fTop, '#f5c542', R*0.012);
      const wv = Math.sin(tm*5 + (X0>0?2:0))*R*0.015;
      poly([fTop, [fTop[0]+R*0.11, fTop[1]+R*0.025+wv], [fTop[0]+R*0.08, fTop[1]+R*0.045+wv], [fTop[0]+R*0.11, fTop[1]+R*0.065+wv], [fTop[0], fTop[1]+R*0.07]], '#b91c1c', '#f5c542', R*0.005);
      // Royal Golden Lion Shield Hub at Zp
      disc(top, R*0.072, '#b91c1c', '#f5c542', R*0.012);
      disc(top, R*0.036, '#f5c542');
    }
    else if(theme === 'alps'){
      // ALPS: Red-Steel Swiss Cable-Car Truss Pylon with Overhead Bull-Wheel Sheaves & Snow-Capped Chalet Motor House!
      // Tapered 4-leg red steel funicular lattice tower with white X-bracing
      const wB = R*0.085, wT = R*0.048, zTrussTop = Zp + R*0.16;
      for(let lv=0; lv<4; lv++){
        const z0L = R*0.045 + lv*(zTrussTop-R*0.045)/4;
        const z1L = R*0.045 + (lv+1)*(zTrussTop-R*0.045)/4;
        const r0L = wB + (wT-wB)*(lv/4), r1L = wB + (wT-wB)*((lv+1)/4);
        line(P(X0-r0L,r0L,z0L), P(X0-r1L,r1L,z1L), '#dc2626', R*0.020);
        line(P(X0+r0L,r0L,z0L), P(X0+r1L,r1L,z1L), '#dc2626', R*0.020);
        line(P(X0-r0L,r0L,z0L), P(X0+r1L,r1L,z1L), '#f8fafc', R*0.010);
        line(P(X0+r0L,r0L,z0L), P(X0-r1L,r1L,z1L), '#f8fafc', R*0.010);
      }
      // Crossbar T-beam at top of pylon with twin spinning cable-car sheave wheels!
      const pCrossL = P(X0-R*0.09, 0, zTrussTop), pCrossR = P(X0+R*0.09, 0, zTrussTop);
      line(pCrossL, pCrossR, '#dc2626', R*0.024);
      disc(pCrossL, R*0.032, '#facc15', '#475569', R*0.007);
      disc(pCrossR, R*0.032, '#facc15', '#475569', R*0.007);
      // Giant Alpine Bull-Wheel Hub at Zp
      disc(top, R*0.076, '#0284c7', '#f8fafc', R*0.012);
      for(let s=0; s<6; s++){
        const a = ph + s*TAU/6;
        line(top, [top[0]+Math.cos(a)*R*0.068, top[1]+Math.sin(a)*R*0.068], '#f8fafc', R*0.009);
      }
      disc(top, R*0.028, '#dc2626');
    }
    else if(theme === 'fiesta'){
      // FIESTA: 3-Tiered Stepped Aztec/Mayan Sun-Pyramid Column + Roaring Fire Brazier Cauldron & Papel Picado!
      const tiers = [
        [R*0.095, R*0.045, R*0.20, '#e11d48', '#9f1239'],
        [R*0.076, R*0.20,  R*0.38, '#f59e0b', '#b45309'],
        [R*0.058, R*0.38,  Zp+R*0.08, '#0d9488', '#115e59']
      ];
      tiers.forEach(([w, za, zb, cF, cE]) => {
        isoBox(X0-w, X0+w, -w, w, za, zb, cF, cE, '#fde047', '#451a03', R*0.007);
      });
      // Carved golden sun-bowl brazier at summit with flickering fiesta flames!
      const bTop = P(X0, 0, Zp + R*0.10);
      ell(bTop, R*0.068, R*0.032, '#78350f', '#facc15', R*0.008);
      const flk = Math.sin(tm*10 + (X0>0?2:0))*R*0.016;
      poly([[bTop[0]-R*0.045,bTop[1]], [bTop[0]+flk,bTop[1]-R*0.14], [bTop[0]+R*0.045,bTop[1]]], '#f97316');
      poly([[bTop[0]-R*0.025,bTop[1]], [bTop[0]+flk*0.5,bTop[1]-R*0.09], [bTop[0]+R*0.025,bTop[1]]], '#fef08a');
      // Radiant Aztec Sun-Calendar Hub at Zp
      disc(top, R*0.074, '#facc15', '#e11d48', R*0.012);
      disc(top, R*0.042, '#0d9488', '#fde047', R*0.007);
    }
    else if(theme === 'nordic'){
      // NORDIC: Sweeping Curved Viking Drakkar Dragon-Ship Prow Column with Overlapping Shield Wall & Open-Jawed Dragon Head!
      const sDir = X0 > 0 ? 1 : -1;
      // Clinker-built curved oak ship stempost sweeping upward to a fierce golden Dragon Head!
      const pStemBase = P(X0, R*0.04, R*0.045);
      const pStemMid  = P(X0 + sDir*R*0.03, R*0.02, Zp*0.65);
      const pDragon   = P(X0 + sDir*R*0.05, 0, Zp + R*0.20);
      line(fBack, top, '#290f02', R*0.048);
      ctx.strokeStyle = '#451a03'; ctx.lineWidth = R*0.085; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(pStemBase[0], pStemBase[1]); ctx.quadraticCurveTo(pStemMid[0], pStemMid[1], pDragon[0], pDragon[1]); ctx.stroke();
      ctx.strokeStyle = '#78350f'; ctx.lineWidth = R*0.055; ctx.stroke();
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = R*0.014; ctx.stroke();
      // Sculpted Golden Open-Jawed Viking Dragon Head at pDragon!
      poly([
        [pDragon[0]-sDir*R*0.03, pDragon[1]+R*0.02],
        [pDragon[0]+sDir*R*0.11, pDragon[1]-R*0.06],
        [pDragon[0]+sDir*R*0.05, pDragon[1]+R*0.01],
        [pDragon[0]+sDir*R*0.10, pDragon[1]+R*0.04]
      ], '#f59e0b', '#451a03', R*0.008);
      disc([pDragon[0]+sDir*R*0.03, pDragon[1]-R*0.02], R*0.011, '#38bdf8');
      // Overlapping painted Viking round shields mounted up the ship prow
      [0.28, 0.55].forEach((f, idx) => {
        const sp = lerp(pStemBase, top, f);
        disc(sp, R*0.036, idx%2 ? '#991b1b' : '#0284c7', '#f59e0b', R*0.007);
        disc(sp, R*0.012, '#fde047');
      });
      // Glowing Bifrost Rune Hub at Zp
      disc(top, R*0.072, '#451a03', '#f59e0b', R*0.012);
      disc(top, R*0.036, '#38bdf8');
    }
    else if(theme === 'bavarian'){
      // BAVARIAN: Gleaming Domed Copper Sudhaus Brewing Kettle Tower with Brass Steam Pipes & Spiral Maibaum Finial!
      // Red-brick brewery furnace base
      isoBox(X0-R*0.085, X0+R*0.085, -R*0.085, R*0.085, R*0.045, R*0.22, '#991b1b', '#7f1d1d', '#b91c1c', '#451a03', R*0.007);
      // Plump Burnished-Copper Brewing Kettle Drum + Hemispherical Copper Dome & Chimney Pipe
      const zKettle = Zp + R*0.04;
      cylAt(X0, 0, R*0.092, R*0.22, zKettle, '#d97706', '#78350f', true);
      const pKetTop = P(X0, 0, zKettle);
      ell(pKetTop, R*0.092, R*0.075, '#f59e0b', '#78350f', R*0.009);
      // Curved brass goose-neck steam pipe & blue/white Bavarian Maibaum spire above the kettle!
      cylAt(X0, 0, R*0.032, zKettle+R*0.05, zKettle+R*0.20, '#2563eb', '#ffffff', true);
      disc(P(X0, 0, zKettle+R*0.22), R*0.042, '#0d9488', '#f59e0b', R*0.008);
      // Brass Clockwork Gear Hub at Zp
      disc(top, R*0.074, '#f5c542', '#78350f', R*0.012);
      disc(top, R*0.042, '#2563eb', '#ffffff', R*0.007);
    }
  };

  // =========================================================================
  // 5. HELPER FOR SCULPTED 3D COUNTERWEIGHTED SWING ARMS (X = -g and X = +g)
  //    Each theme now has a DISTINCT arm silhouette & counterweight sculpture!
  // =========================================================================
  const drawSwingArm = (X, isFrontArm) => {
    const pPiv = P(X, 0, Zp);
    const pGon = P(X, C[1], C[2]);
    const cw3  = CW3(X);
    const pCW  = P(cw3[0], cw3[1], cw3[2]);

    // Screen-space unit vector (ux, uy) from Pivot to Gondola, and perpendicular normal (nx, ny)
    const dx = pGon[0] - pPiv[0], dy = pGon[1] - pPiv[1];
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const nx = -uy, ny = ux;
    const wPiv = R * 0.052, wTip = R * 0.026, wCW = R * 0.036;

    const armPoly = [
      [pCW[0]  + nx*wCW,  pCW[1]  + ny*wCW],
      [pPiv[0] + nx*wPiv, pPiv[1] + ny*wPiv],
      [pGon[0] + nx*wTip, pGon[1] + ny*wTip],
      [pGon[0] - nx*wTip, pGon[1] - ny*wTip],
      [pPiv[0] - nx*wPiv, pPiv[1] - ny*wPiv],
      [pCW[0]  - nx*wCW,  pCW[1]  - ny*wCW]
    ];

    if(theme === 'unthemed'){
      // Classic Huss Tapered White/Accent Steel Arm + Twin Cylindrical Drum Counterweights
      poly(armPoly, '#f8fafc', '#334155', R*0.010);
      line(lerp(pPiv,pGon,0.18), lerp(pPiv,pGon,0.78), accent, R*0.026);
      disc([pCW[0]-R*0.014, pCW[1]+R*0.008], R*0.052, '#334155', '#0f172a', R*0.008);
      disc(pCW, R*0.052, accent, '#f8fafc', R*0.009);
      disc(pCW, R*0.020, '#facc15');
    }
    else if(theme === 'classic'){
      // Kirmes Scalloped Showman Arm with Chasing Light Medallions & Giant Spiral Lollipop Counterweight!
      poly(armPoly, '#fef08a', '#e11d48', R*0.012);
      [0.22, 0.45, 0.68].forEach((t, idx) => {
        const mp = lerp(pPiv, pGon, t);
        disc(mp, R*0.024, idx%2 ? '#e11d48' : '#2563eb', '#ffffff', R*0.006);
      });
      disc([pCW[0]-R*0.016, pCW[1]+R*0.008], R*0.058, '#1e3a8a', '#facc15', R*0.008);
      disc(pCW, R*0.058, '#e11d48', '#fef08a', R*0.01);
      for(let s=0; s<6; s++){
        const a = ph*2 + s*TAU/6;
        line(pCW, [pCW[0]+Math.cos(a)*R*0.052, pCW[1]+Math.sin(a)*R*0.052], '#fef08a', R*0.010);
      }
    }
    else if(theme === 'jungle'){
      // TALOCAN: Forged Bronze Aztec Macuahuitl Obsidian-Toothed War-Club Arm & Jade Sun-Stone Counterweight
      poly(armPoly, '#b45309', '#451a03', R*0.011);
      line(pCW, pGon, '#eab308', R*0.016);
      [0.25, 0.45, 0.65, 0.82].forEach(t => {
        const bp = lerp(pPiv, pGon, t);
        poly([
          [bp[0]+nx*wPiv*0.7, bp[1]+ny*wPiv*0.7],
          [bp[0]+nx*wPiv*1.45, bp[1]+ny*wPiv*1.45],
          [bp[0]+nx*wPiv*0.7 + dx*0.08, bp[1]+ny*wPiv*0.7 + dy*0.08]
        ], '#18181b', '#eab308', R*0.005);
      });
      disc(pCW, R*0.062, '#eab308', '#451a03', R*0.01);
      disc(pCW, R*0.042, '#2fbf9a', '#78350f', R*0.007);
      disc(pCW, R*0.018, '#b91c1c');
    }
    else if(theme === 'gothic'){
      // GOTHIC: Jagged Wrought-Iron Executioner Cleaver Blade + Spiked Morning-Star Mace Counterweight
      poly(armPoly, '#27272a', '#09090b', R*0.012);
      line(pCW, pGon, '#dc2626', R*0.016);
      [0.3, 0.55, 0.8].forEach(t => {
        const bp = lerp(pPiv, pGon, t);
        poly([
          [bp[0]-nx*wPiv*0.6, bp[1]-ny*wPiv*0.6],
          [bp[0]-nx*wPiv*1.6, bp[1]-ny*wPiv*1.6],
          [bp[0]-nx*wPiv*0.6 + dx*0.09, bp[1]-ny*wPiv*0.6 + dy*0.09]
        ], '#71717a', '#09090b', R*0.006);
      });
      for(let s=0; s<8; s++){
        const a = ph + s*TAU/8;
        line(pCW, [pCW[0]+Math.cos(a)*R*0.072, pCW[1]+Math.sin(a)*R*0.072], '#a1a1aa', R*0.011);
      }
      disc(pCW, R*0.052, '#18181b', '#dc2626', R*0.01);
      disc(pCW, R*0.022, '#c084fc');
    }
    else if(theme === 'western'){
      // WILD WEST: Open-Web Steel Locomotive Connecting Rod (with Lightning Holes) + Bundle of Red TNT Dynamite & Detonator!
      // Twin parallel I-beam flanges with circular lightning holes punched along the web
      const rodA1 = [pCW[0]+nx*wCW, pCW[1]+ny*wCW], rodB1 = [pGon[0]+nx*wTip, pGon[1]+ny*wTip];
      const rodA2 = [pCW[0]-nx*wCW, pCW[1]-ny*wCW], rodB2 = [pGon[0]-nx*wTip, pGon[1]-ny*wTip];
      poly([rodA1, rodB1, rodB2, rodA2], '#78350f', '#27272a', R*0.012);
      line(rodA1, rodB1, '#d97706', R*0.014);
      line(rodA2, rodB2, '#d97706', R*0.014);
      [0.25, 0.48, 0.70].forEach(t => {
        disc(lerp(pPiv, pGon, t), R*0.018, '#18181b', '#f59e0b', R*0.005);
      });
      // Counterweight: Strapped Red Dynamite TNT Keg Bundle with a Sparking Fuse!
      poly([
        [pCW[0]-nx*R*0.055-ux*R*0.04, pCW[1]-ny*R*0.055-uy*R*0.04],
        [pCW[0]+nx*R*0.055-ux*R*0.04, pCW[1]+ny*R*0.055-uy*R*0.04],
        [pCW[0]+nx*R*0.055+ux*R*0.04, pCW[1]+ny*R*0.055+uy*R*0.04],
        [pCW[0]-nx*R*0.055+ux*R*0.04, pCW[1]-ny*R*0.055+uy*R*0.04]
      ], '#dc2626', '#451a03', R*0.010);
      line([pCW[0]-nx*R*0.055, pCW[1]-ny*R*0.055], [pCW[0]+nx*R*0.055, pCW[1]+ny*R*0.055], '#facc15', R*0.012);
      disc([pCW[0]-ux*R*0.055, pCW[1]-uy*R*0.055], R*0.018, '#fef08a', '#f97316', R*0.006);
    }
    else if(theme === 'frontier'){
      // FRONTIER: Giant Serrated Crosscut Lumberjack Sawblade Arm + Banded Cedar Log Counterweight!
      // Back wood spine + gleaming silver serrated sawblade edge with 7 sharp crosscut teeth
      poly(armPoly, '#94a3b8', '#334155', R*0.010);
      line([pCW[0]-nx*wCW*0.7, pCW[1]-ny*wCW*0.7], [pGon[0]-nx*wTip*0.7, pGon[1]-ny*wTip*0.7], '#6b4a2b', R*0.022);
      for(let k=1; k<=6; k++){
        const bp = lerp(pPiv, pGon, k/7);
        poly([
          [bp[0]+nx*wPiv*0.5, bp[1]+ny*wPiv*0.5],
          [bp[0]+nx*wPiv*1.55, bp[1]+ny*wPiv*1.55],
          [bp[0]+nx*wPiv*0.5 + ux*R*0.032, bp[1]+ny*wPiv*0.5 + uy*R*0.032]
        ], '#e2e8f0', '#475569', R*0.005);
      }
      // Cross-section of a giant Sequoia Tree Trunk with growth rings as the counterweight!
      disc(pCW, R*0.060, '#5a3b22', '#2e1f14', R*0.012);
      disc(pCW, R*0.044, '#d9b27a', '#8a5a33', R*0.007);
      disc(pCW, R*0.022, '#d9b27a', '#8a5a33', R*0.005);
    }
    else if(theme === 'space'){
      // SPACE: Open Dual-Pronged Tuning-Fork Plasma Conduit Arm + Glowing Black-Hole Singularity Counterweight!
      // Two separated parallel chrome & cyan energy rails with plasma lightning arcs jumping between them
      const gap = R * 0.030;
      line([pCW[0]+nx*gap, pCW[1]+ny*gap], [pGon[0]+nx*gap*0.6, pGon[1]+ny*gap*0.6], '#0f172a', R*0.028);
      line([pCW[0]-nx*gap, pCW[1]-ny*gap], [pGon[0]-nx*gap*0.6, pGon[1]-ny*gap*0.6], '#0f172a', R*0.028);
      line([pCW[0]+nx*gap, pCW[1]+ny*gap], [pGon[0]+nx*gap*0.6, pGon[1]+ny*gap*0.6], '#e2e8f0', R*0.015);
      line([pCW[0]-nx*gap, pCW[1]-ny*gap], [pGon[0]-nx*gap*0.6, pGon[1]-ny*gap*0.6], '#e2e8f0', R*0.015);
      // Glowing cyan plasma arcs bridging the open gap
      [0.25, 0.50, 0.75].forEach(t => {
        const cM = lerp(pPiv, pGon, t);
        line([cM[0]-nx*gap, cM[1]-ny*gap], [cM[0]+nx*gap, cM[1]+ny*gap], '#22d3ee', R*0.012);
      });
      // Counterweight: Floating Black-Hole Singularity with Accretion Ring
      ell(pCW, R*0.082, R*0.032, null, '#22d3ee', R*0.010);
      disc(pCW, R*0.048, '#020617', '#e879f9', R*0.012);
      disc(pCW, R*0.018, '#ffffff');
    }
    else if(theme === 'medieval'){
      // MEDIEVAL: Cross-Braced Oak Siege Trebuchet Truss Arm + Hanging Chain-Flail Spiked Wrecking Ball Counterweight!
      const rA1 = [pCW[0]+nx*wCW, pCW[1]+ny*wCW], rB1 = [pGon[0]+nx*wTip, pGon[1]+ny*wTip];
      const rA2 = [pCW[0]-nx*wCW, pCW[1]-ny*wCW], rB2 = [pGon[0]-nx*wTip, pGon[1]-ny*wTip];
      line(rA1, rB1, '#5a3b22', R*0.024);
      line(rA2, rB2, '#5a3b22', R*0.024);
      [0.2, 0.45, 0.7].forEach(t => {
        const p1 = lerp(rA1, rB1, t), p2 = lerp(rA2, rB2, t+0.18);
        line(p1, p2, '#f5c542', R*0.010);
      });
      // Spiked Iron Morning-Star / Trebuchet Counterweight Box
      for(let s=0; s<8; s++){
        const a = ph + s*TAU/8;
        line(pCW, [pCW[0]+Math.cos(a)*R*0.072, pCW[1]+Math.sin(a)*R*0.072], '#cbd5e1', R*0.011);
      }
      disc(pCW, R*0.052, '#334155', '#f5c542', R*0.011);
      disc(pCW, R*0.022, '#b91c1c');
    }
    else if(theme === 'alps'){
      // ALPS: Curved Mountaineer's Steel Ice-Axe Pick Arm + Polished Granite Curling Stone Counterweight!
      poly(armPoly, '#e2e8f0', '#0284c7', R*0.011);
      line(pCW, pGon, '#dc2626', R*0.015);
      // Curved steel ice-pick beak & adze head sweeping out near the gondola end!
      const pkP = lerp(pPiv, pGon, 0.78);
      poly([
        pkP,
        [pkP[0]+nx*R*0.11 - ux*R*0.03, pkP[1]+ny*R*0.11 - uy*R*0.03],
        [pGon[0]+nx*R*0.03, pGon[1]+ny*R*0.03]
      ], '#bae6fd', '#0284c7', R*0.008);
      // Granite Alpine Curling Stone / Snow-Boulder Counterweight with Red Handle
      disc(pCW, R*0.058, '#64748b', '#cbd5e1', R*0.012);
      disc(pCW, R*0.036, '#dc2626', '#f8fafc', R*0.007);
    }
    else if(theme === 'fiesta'){
      // FIESTA: Zigzag Feathered-Serpent / Lightning Bolt Arm + 7-Pointed Conical Star Piñata Counterweight!
      poly(armPoly, '#0d9488', '#fde047', R*0.011);
      // Stepped Aztec zigzag lightning pattern along the arm
      for(let k=1; k<=4; k++){
        const pA = lerp(pPiv, pGon, (k-0.5)/5), pB = lerp(pPiv, pGon, k/5);
        line([pA[0]+nx*wPiv*0.6, pA[1]+ny*wPiv*0.6], [pB[0]-nx*wPiv*0.6, pB[1]-ny*wPiv*0.6], '#facc15', R*0.014);
      }
      // 7-Pointed Colorful Mexican Star Piñata Counterweight with Streamers!
      const pCols = ['#e11d48', '#facc15', '#10b981', '#3b82f6', '#a855f7', '#f97316', '#ec4899'];
      for(let s=0; s<7; s++){
        const a = ph*1.5 + s*TAU/7;
        poly([
          [pCW[0]+Math.cos(a-0.25)*R*0.035, pCW[1]+Math.sin(a-0.25)*R*0.035],
          [pCW[0]+Math.cos(a)*R*0.088,      pCW[1]+Math.sin(a)*R*0.088],
          [pCW[0]+Math.cos(a+0.25)*R*0.035, pCW[1]+Math.sin(a+0.25)*R*0.035]
        ], pCols[s], '#ffffff', R*0.005);
      }
      disc(pCW, R*0.042, '#facc15', '#e11d48', R*0.009);
    }
    else if(theme === 'nordic'){
      // NORDIC: Giant Double-Bit Viking Battle-Axe Arm + Glowing Runic Mjölnir Hammerhead Counterweight!
      poly(armPoly, '#5a361a', '#290f02', R*0.011);
      line(pCW, pGon, '#f59e0b', R*0.014);
      // Twin Sweeping Crescent Battle-Axe Blades near the gondola end!
      const axP = lerp(pPiv, pGon, 0.68);
      [-1, 1].forEach(bSide => {
        poly([
          axP,
          [axP[0]+bSide*nx*R*0.105 - ux*R*0.02, axP[1]+bSide*ny*R*0.105 - uy*R*0.02],
          [pGon[0]+bSide*nx*R*0.085, pGon[1]+bSide*ny*R*0.085],
          [pGon[0], pGon[1]]
        ], '#cbd5e1', '#f59e0b', R*0.008);
      });
      // Forged Iron & Cyan-Rune Mjölnir Hammer Block Counterweight at pCW
      poly([
        [pCW[0]-nx*R*0.068-ux*R*0.035, pCW[1]-ny*R*0.068-uy*R*0.035],
        [pCW[0]+nx*R*0.068-ux*R*0.035, pCW[1]+ny*R*0.068-uy*R*0.035],
        [pCW[0]+nx*R*0.055+ux*R*0.035, pCW[1]+ny*R*0.055+uy*R*0.035],
        [pCW[0]-nx*R*0.055+ux*R*0.035, pCW[1]-ny*R*0.055+uy*R*0.035]
      ], '#475569', '#f59e0b', R*0.010);
      disc(pCW, R*0.022, '#38bdf8');
    }
    else if(theme === 'bavarian'){
      // BAVARIAN: Ornate Blue-and-White Lozenge Brewery Arm + Frothy Oktoberfest Beer-Stein / Copper Keg Counterweight!
      poly(armPoly, '#2563eb', '#f59e0b', R*0.011);
      [0.25, 0.50, 0.75].forEach(t => {
        const dp = lerp(pPiv, pGon, t);
        poly([[dp[0],dp[1]-R*0.022],[dp[0]+R*0.018,dp[1]],[dp[0],dp[1]+R*0.022],[dp[0]-R*0.018,dp[1]]], '#ffffff');
      });
      // Giant Banded Oak & Frothy Foam Beer Keg Counterweight
      disc(pCW, R*0.060, '#78350f', '#f59e0b', R*0.012);
      disc([pCW[0], pCW[1]-R*0.025], R*0.038, '#ffffff', '#e2e8f0', R*0.006); // Frothy beer head!
      disc(pCW, R*0.024, '#facc15');
    }

    // Pivot Hub Cap on the Arm
    disc(pPiv, R*0.044, '#1e293b', '#facc15', R*0.008);
    disc(pPiv, R*0.020, accent);
    // Gondola Trunnion Bearing Cap at pGon
    disc(pGon, R*0.032, '#facc15', '#1e293b', R*0.007);
  };

  // =========================================================================
  // 6. RENDER PASSES (STRICT BACK-TO-FRONT PAINTER'S ORDER)
  // =========================================================================

  // PASS A: Far Support Tower (-ax)
  drawSupportTower(-ax, false);

  // PASS B: Lower Torque Synchronization Shaft & Upper Cross-Bridge Lintel
  const shBack = P(-ax*0.88, 0, Zp*0.64), shFront = P(ax*0.88, 0, Zp*0.64);
  line(shBack, shFront, '#1e293b', R*0.044);
  line(shBack, shFront, '#cbd5e1', R*0.022);
  if(theme === 'classic' || theme === 'fiesta' || theme === 'bavarian'){
    // Candy-striped torque shaft (matching image_93f620.png!)
    for(let k=0; k<8; k++){
      const a = lerp(shBack, shFront, k/8), b = lerp(shBack, shFront, (k+0.6)/8);
      line(a, b, k%2 ? '#e11d48' : '#facc15', R*0.026);
    }
  }

  // Upper Cross-Bridge Beam ("THE No. 1 MACHINE" on Unthemed, or themed upper bridge)
  if(theme === 'unthemed'){
    const zBr = Zp - R*0.02;
    poly([P(-ax,0,zBr-R*0.045), P(ax,0,zBr-R*0.045), P(ax,0,zBr+R*0.045), P(-ax,0,zBr+R*0.045)], '#0f172a', '#475569', R*0.008);
    frontText(-ax*0.85, ax*0.85, 0, zBr+R*0.04, R*0.075, 'THE No. 1 MACHINE', '#ef4444');
  }

  // PASS C: Far Counterweighted Swing Arm (-g)
  drawSwingArm(-g, false);

  // PASS D: Multi-Seat Floorless Gondola Bar, Chaser Light Strip, 10 Riders, OTSR Harnesses & Dangling Legs
  const dk = (offU) => [
    [-g-R*0.02, -1], [g+R*0.02, -1], [g+R*0.02, 1], [-g-R*0.02, 1]
  ].map(([X, s]) => P(
    X,
    C[1] + w[1]*s*W*0.48 - u[1]*offU,
    C[2] + w[2]*s*W*0.48 - u[2]*offU
  ));

  const gonMainCol = {
    unthemed: '#1e293b', classic: '#7f1d1d', jungle: '#92400e', western: '#451a03',
    frontier: '#5a3b22', space:   '#0f172a', gothic: '#18181b', medieval:'#1e3a8a',
    alps:     '#dc2626', fiesta:  '#0d9488', nordic: '#451a03', bavarian:'#78350f'
  }[theme];
  const otsrCol = (theme==='jungle' || theme==='western') ? '#f97316' : (theme==='space' ? '#22d3ee' : '#facc15');

  // Gondola lower chassis & illuminated chaser light-bar underneath (like image_93f620.png!)
  poly(dk(R*0.042), '#0f172a', otsrCol, R*0.010);
  poly(dk(0), gonMainCol, accent, R*0.016);
  // Row of glowing chaser bulbs along the gondola front edge
  const gLeft = P(-g, C[1]+w[1]*W*0.48, C[2]+w[2]*W*0.48);
  const gRight = P(g, C[1]+w[1]*W*0.48, C[2]+w[2]*W*0.48);
  for(let b=0; b<=8; b++){
    const bp = lerp(gLeft, gRight, b/8);
    disc(bp, R*0.009, (Math.floor(tm*8)+b)%2 ? '#fef08a' : '#f97316');
  }

  // 10 Riders in 2 back-to-back rows of 5, with dangling legs, colorful torsos, heads & OTSR harnesses
  const rc = ['#ef4444','#38bdf8','#22c55e','#facc15','#a855f7','#f97316','#ec4899','#14b8a6','#e2e8f0','#fb7185'];
  const riders = [];
  [-1, 1].forEach((s, rowIdx) => {
    [-0.24, -0.12, 0.0, 0.12, 0.24].forEach((kx, seatIdx) => {
      const X = kx * R * 1.02;
      const Y = C[1] + w[1]*s*W*0.26;
      const Z = C[2] + w[2]*s*W*0.26;
      riders.push({X, Y, Z, s, key: X + Y + Z*0.3, col: rc[(rowIdx*5 + seatIdx)%10]});
    });
  });

  riders.sort((a,b) => a.key - b.key).forEach(r => {
    const at = h => P(r.X, r.Y + u[1]*h, r.Z + u[2]*h);
    // Dangling legs below the floorless seat (-u direction)
    const legA = at(-R*0.008), legB = at(-R*0.068);
    line([legA[0]-R*0.007, legA[1]], [legB[0]-R*0.007, legB[1]], '#1e293b', R*0.012);
    line([legA[0]+R*0.007, legA[1]], [legB[0]+R*0.007, legB[1]], '#1e293b', R*0.012);
    // Molded bucket seat & rider torso
    line(at(0), at(R*0.042), gonMainCol, R*0.062);
    line(at(R*0.025), at(R*0.095), r.col, R*0.048);
    // Over-The-Shoulder Restraint (OTSR) U-collar (like the glowing orange teeth on Talocan!)
    line(at(R*0.035), at(R*0.098), otsrCol, R*0.022);
    // Rider Head
    const hd = at(R*0.122);
    disc(hd, R*0.026, '#fde4c8', '#1e293b', R*0.004);
  });

  // PASS E: Near Counterweighted Swing Arm (+g) & Near Support Tower (+ax)
  drawSwingArm(g, true);
  drawSupportTower(ax, true);

  // =========================================================================
  // 7. FOREGROUND PYROTECHNICS, FIREBALL PLUMES & WATER GEYSER JETS
  //    (Erupts dynamically in front of the gondola for JUNGLE "Talocan", GOTHIC & NORDIC!)
  // =========================================================================
  if(theme === 'jungle' || theme === 'gothic' || theme === 'nordic'){
    // Eruption intensity peaks when the gondola swoops low/forward over the trench!
    const swoopBoost = 0.55 + 0.45 * Math.max(0, Math.cos(ph - 0.55));
    const pulse = 0.80 + 0.20 * Math.sin(tm * 9);
    const hScale = swoopBoost * pulse;

    // 1. Row of Vertical Water Fountain Geysers along the front trench
    const nJets = 9;
    for(let j=0; j<nJets; j++){
      const jx = (-0.28 + j*0.07) * R;
      const jy = R * 0.16;
      const bP = P(jx, jy, 0);
      const jH = R * (0.14 + 0.08*Math.sin(tm*7 + j)) * hScale;
      const tP = P(jx, jy, jH);
      const jetCol = theme==='gothic' ? 'rgba(192,132,252,0.55)' : 'rgba(186,230,253,0.70)';
      line(bP, tP, jetCol, R*0.018);
      line(bP, tP, 'rgba(255,255,255,0.85)', R*0.008);
    }

    // 2. Twin Erupting Fireball Plumes (Orange/Gold for Talocan Jungle; Violet/Crimson Hellfire for Gothic)
    if(theme === 'jungle' || theme === 'gothic'){
      const fCols = theme === 'jungle'
        ? ['#ea580c', '#f97316', '#facc15', '#fef08a']
        : ['#7f1d1d', '#dc2626', '#9333ea', '#f0abfc'];

      // Carved stone fire-altar pedestal at front-left of the trench (like Talocan's foreground altar in image_93f8e4.png!)
      isoBox(-R*0.16, -R*0.02, R*0.18, R*0.30, 0, R*0.11, '#78350f', '#451a03', '#a88b73', '#291509', R*0.007);

      [[-R*0.15, R*0.22, 1.05], [-R*0.02, R*0.24, 0.92]].forEach(([fx, fy, sc], fIdx) => {
        const fb = P(fx, fy, R*0.09);
        const fH = R * 0.34 * sc * hScale;
        const sway = Math.sin(tm*12 + fIdx*2) * R * 0.022;
        // Outer fireball glow
        const grad = ctx.createRadialGradient(fb[0], fb[1]-fH*0.5, R*0.01, fb[0], fb[1]-fH*0.5, fH*0.75);
        grad.addColorStop(0, theme==='jungle' ? 'rgba(254,240,138,0.85)' : 'rgba(240,171,252,0.80)');
        grad.addColorStop(0.5, theme==='jungle' ? 'rgba(249,115,22,0.55)' : 'rgba(220,38,38,0.50)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(fb[0], fb[1]-fH*0.5, fH*0.75, 0, TAU); ctx.fill();

        // Layered flame tongues
        poly([
          [fb[0]-R*0.055*sc, fb[1]],
          [fb[0]-R*0.068*sc, fb[1]-fH*0.45],
          [fb[0]+sway,       fb[1]-fH],
          [fb[0]+R*0.068*sc, fb[1]-fH*0.45],
          [fb[0]+R*0.055*sc, fb[1]]
        ], fCols[1]);
        poly([
          [fb[0]-R*0.032*sc, fb[1]],
          [fb[0]+sway*0.6,   fb[1]-fH*0.78],
          [fb[0]+R*0.032*sc, fb[1]]
        ], fCols[3]);
      });
    }
  }
}
/* ===== END SPRITE CODE ===== */
return drawTopSpin;
})();
window.drawTopSpin = TopSpinSkinPack;
const CarouselSkinPack = (() => {
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
    ctx.lineTo(cx+R*Math.cos(a), cy+R*Math.sin(a)*0.58);}
  ctx.closePath();
}

/* ===== CAROUSEL SKIN METADATA (UNTHEMED + 11 HEAVY/IMMERSIVE SKINS) ===== */
const CAROUSEL_SKINS = {
  unthemed: {id:'unthemed', label:'Unthemed (Tier 0–2)', name:'Standard Park Carousel',          sub:'Striped Cone Canopy & Painted Fairground Horses',     hex:'#cbd5e1', border:'#ef4444'},
  classic:  {id:'classic',  label:'Classic Midway',      name:'Grand Wurlitzer Menagerie',       sub:'2-Tier Baroque Pagoda Crown • Lions, Ostriches & Steeds', hex:'#cbb07c', border:'#e11d48'},
  jungle:   {id:'jungle',   label:'Jungle',              name:'Rainforest Palapa Menagerie',     sub:'2-Tier Palm Thatch & Sun Idol • Jaguars, Frogs & Toucans',hex:'#587c48', border:'#2fbf9a'},
  western:  {id:'western',  label:'Wild West',           name:'Buckaroo Wagon-Wheel Roundup',    sub:'12-Spoke Wagon-Wheel Roof • Longhorns, Mustangs & Burros',hex:'#c99a62', border:'#b91c1c'},
  frontier: {id:'frontier', label:'Frontier',            name:'Wilderness Totem Carousel',       sub:'Cedar-Shake Octagon & Bear Finial • Grizzlies, Moose & Elk',hex:'#7d955d', border:'#566e42'},
  space:    {id:'space',    label:'Space',               name:'Galactic Holo-Dome Carousel',     sub:'Translucent Saucer & Saturn Ring • Cyber-Pegasi & Rovers',hex:'#334155', border:'#0ea5e9'},
  gothic:   {id:'gothic',   label:'Gothic',              name:'Danse Macabre Crypt Carousel',    sub:'Ribbed Bat-Wing Belfry • Skeletal Nightmares & Gargoyles',hex:'#3b3345', border:'#991b1b'},
  medieval: {id:'medieval', label:'Medieval',            name:'Royal Jousting Lists Carousel',   sub:'Crowned Silk Tournament Tent • Barded Destriers & Griffins',hex:'#6c8c58', border:'#eab308'},
  alps:     {id:'alps',     label:'Alps',                name:'Matterhorn Snow-Chalet Carousel', sub:'Snow-Blanketed Chalet Roof & Cowbells • St. Bernards & Ibex',hex:'#a8c5d6', border:'#0284c7'},
  fiesta:   {id:'fiesta',   label:'Fiesta',              name:'Gran Tiovivo de Alebrijes',       sub:'Giant Embroidered Sombrero Canopy • Jaguars, Burros & Roosters',hex:'#d99b52', border:'#e11d48'},
  nordic:   {id:'nordic',   label:'Nordic',              name:'Asgardian Stave-Shield Carousel', sub:'Viking Shield Rim & Dragon Prows • Sleipnir, Boars & Wolves',hex:'#4d6b63', border:'#d97706'},
  bavarian: {id:'bavarian', label:'Bavarian',            name:'Oktoberfest Glockenspiel Carousel',sub:'Copper Onion Dome & Lozenge Valance • Draft Horses & Rams',hex:'#769958', border:'#2563eb'}
};
CAROUSEL_SKINS.german = CAROUSEL_SKINS.bavarian;

/* ===== SPRITE CODE: copy this block into engine.js ===== */
/**
 * drawCarousel(ctx, cx, cy, R, o)
 *  o.accent        : Land / chain accent color (default '#ef4444')
 *  o.themeId       : 'classic'|'jungle'|'western'|'wildwest'|'frontier'|'space'|'gothic'|'medieval'|'alps'|'fiesta'|'nordic'|'bavarian'|'german'
 *  o.rideThemeTier : 0..4 (<=2 draws Standard Unthemed; >=3 draws Heavy/Immersive Themed Carousel)
 *  o.t             : turntable & mount rotation angle in radians
 *  o.tm            : continuous time in seconds for chasing bulbs, flames, and flags
 *  o.flip          : true when called under ctx.scale(-1,1)
 *  o.tile          : draw the hex tile background (default true)
 */
function drawCarousel(ctx, cx, cy, R, o={}){
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTheme = String(o.themeId || o.theme || 'unthemed').toLowerCase();
  if(rawTheme === 'wildwest' || rawTheme === 'wild_west') rawTheme = 'western';
  if(rawTheme === 'german') rawTheme = 'bavarian';
  const theme = (tier <= 2 || !CAROUSEL_SKINS[rawTheme]) ? 'unthemed' : rawTheme;
  const skin = CAROUSEL_SKINS[theme] || CAROUSEL_SKINS.unthemed;
  const accent = o.accent || skin.border || '#ef4444';
  const rot = o.t == null ? 0.45 : o.t;
  const tm  = o.tm == null ? rot : o.tm;
  const fl  = o.flip ? -1 : 1;
  const r   = v => R * v;
  const TAU = Math.PI * 2;

  const cyB = cy + R * 0.05;
  const P = (X,Y,Z) => [cx + (X - Y)*0.7, cyB + (X + Y)*0.35 - Z];
  const g = (rr,a,Z) => P(rr*Math.cos(a), rr*Math.sin(a), Z);

  const line = (a,b,c,w) => {
    ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
  };
  const poly = (pts,fill,stroke,lw) => {
    ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.lineJoin='round';ctx.stroke();}
  };
  const disc = (p,rr,c,stroke,lw) => {
    ctx.beginPath();ctx.arc(p[0],p[1],Math.max(0.5,rr),0,TAU);
    if(c){ctx.fillStyle=c;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.007;ctx.stroke();}
  };
  const ell = (p,rr,fill,stroke,lw) => {
    ctx.beginPath();ctx.ellipse(p[0],p[1],Math.max(0.5,0.99*rr),Math.max(0.5,0.495*rr),0,0,TAU);
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.stroke();}
  };
  const cyl = (rr,Z,h,col,topc,rimCol) => {
    const pB = P(0,0,Z), pT = P(0,0,Z+h), rx = 0.99*rr, ry = 0.495*rr;
    ctx.beginPath();
    ctx.moveTo(pB[0]-rx, pB[1]); ctx.lineTo(pT[0]-rx, pT[1]);
    ctx.lineTo(pT[0]+rx, pT[1]); ctx.lineTo(pB[0]+rx, pB[1]);
    ctx.ellipse(pB[0], pB[1], rx, ry, 0, 0, Math.PI);
    ctx.closePath();
    const gr = ctx.createLinearGradient(pB[0]-rx, 0, pB[0]+rx, 0);
    gr.addColorStop(0, shade(col, 0.22)); gr.addColorStop(0.4, col); gr.addColorStop(1, shade(col, -0.35));
    ctx.fillStyle = gr; ctx.fill();
    if(rimCol){
      ctx.strokeStyle = rimCol; ctx.lineWidth = R*0.008;
      ctx.beginPath(); ctx.ellipse(pB[0], pB[1], rx, ry, 0, 0, Math.PI); ctx.stroke();
    }
    if(topc !== false){
      ell(pT, rr, topc || shade(col, 0.16), rimCol, R*0.008);
    }
  };
  const coneGores = (rBot, zBot, zPeak, nGores, colFn, strokeCol, rotOff=0) => {
    const pk = P(0, 0, zPeak);
    for(let i=0; i<nGores; i++){
      const a0 = rotOff + i*TAU/nGores, a1 = a0 + TAU/nGores;
      ctx.fillStyle = colFn(i);
      ctx.beginPath();
      ctx.moveTo(pk[0], pk[1]);
      for(let s=0; s<=3; s++){
        const p = g(rBot, a0 + (a1-a0)*s/3, zBot);
        ctx.lineTo(p[0], p[1]);
      }
      ctx.closePath(); ctx.fill();
      if(strokeCol){
        ctx.strokeStyle = strokeCol; ctx.lineWidth = R*0.005; ctx.stroke();
      }
    }
    return pk;
  };

  // Structural elevations
  const z0 = r(0.015), zd = r(0.068), zr = r(0.47), Rr = r(0.58);
  const cream = '#fde8c0', gold = '#fbbf24';

  // 1. Optional Hex Tile Base
  if(o.tile !== false){
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = theme === 'unthemed' ? '#cbd5e1' : skin.hex;
    ctx.fill();
    ctx.lineWidth = Math.max(2, R*0.055);
    ctx.strokeStyle = accent;
    ctx.stroke();
  }

  // Theme palette for turntable platform, center column, and poles
  const PAL = {
    unthemed: {step:'#94a3b8', rim:accent,    deck:cream,     ring:shade(accent,-0.15), pole:gold},
    classic:  {step:'#991b1b', rim:'#f5c542', deck:'#fffbeb', ring:'#e11d48',           pole:'#facc15'},
    jungle:   {step:'#595443', rim:'#137a70', deck:'#d4cdb3', ring:'#eab308',           pole:'#a16207'},
    western:  {step:'#451a03', rim:'#9a3412', deck:'#c89d66', ring:'#78350f',           pole:'#d97706'},
    frontier: {step:'#575c63', rim:'#5a3b22', deck:'#a97d49', ring:'#2f5f3a',           pole:'#d9b27a'},
    space:    {step:'#0f172a', rim:'#0284c7', deck:'#1e293b', ring:'#22d3ee',           pole:'#22d3ee'},
    gothic:   {step:'#18181b', rim:'#7f1d1d', deck:'#27272a', ring:'#991b1b',           pole:'#a1a1aa'},
    medieval: {step:'#475569', rim:'#b91c1c', deck:'#fef3c7', ring:'#1d4ed8',           pole:'#f5c542'},
    alps:     {step:'#cbd5e1', rim:'#dc2626', deck:'#f5deb3', ring:'#0284c7',           pole:'#facc15'},
    fiesta:   {step:'#c2410c', rim:'#f59e0b', deck:'#fef3c7', ring:'#0d9488',           pole:'#fde047'},
    nordic:   {step:'#334155', rim:'#451a03', deck:'#78350f', ring:'#f59e0b',           pole:'#f59e0b'},
    bavarian: {step:'#64748b', rim:'#2563eb', deck:'#fef3c7', ring:'#d97706',           pole:'#f5c542'}
  }[theme];

  // 2. Soft Ambient Shadow + Stepped Circular Carousel Turntable Platform (NO extra outer slab!)
  const gp = P(0, 0, 0);
  ell([gp[0]+fl*r(0.08), gp[1]+r(0.03)], r(0.64), 'rgba(15,23,42,0.28)');
  cyl(r(0.62), 0, z0+r(0.015), PAL.step, shade(PAL.step,0.15), shade(PAL.step,-0.3));
  cyl(r(0.56), z0+r(0.015), zd - z0, PAL.rim, PAL.deck, shade(PAL.rim,-0.35));

  // Rotating radial parquet wedges & concentric track rings on the turntable deck
  const dp = P(0, 0, zd);
  if(theme !== 'unthemed'){
    for(let i=0; i<12; i++){
      const a0 = rot + i*TAU/12, a1 = a0 + TAU/24;
      poly([dp, g(r(0.54),a0,zd), g(r(0.54),a1,zd)], shade(PAL.deck, -0.09));
    }
  }
  ctx.strokeStyle = PAL.ring; ctx.lineWidth = R*0.011;
  [0.44, 0.28, 0.14].forEach(rr => {
    ctx.beginPath(); ctx.ellipse(dp[0], dp[1], 0.99*r(rr), 0.495*r(rr), 0, 0, TAU); ctx.stroke();
  });

  // Recessed dark under-ceiling shadow at zr so the brass poles visibly plug into the roof underside!
  ell(P(0, 0, zr - r(0.008)), Rr*0.95, 'rgba(15, 23, 42, 0.42)');

  // =========================================================================
  // 3. BESPOKE ANIMAL & CREATURE MENAGERIE (Outer Ring: 10 Mounts, Inner Ring: 6 Mounts)
  //    Uses upright-locked tangent transform so riders & creatures NEVER flip upside-down!
  // =========================================================================
  const MENAGERIE = {
    unthemed: [
      {kind:'horse',    body:'#f8fafc', mane:'#f59e0b', saddle:accent},
      {kind:'horse',    body:'#92400e', mane:'#1e293b', saddle:accent},
      {kind:'horse',    body:'#fde047', mane:'#f8fafc', saddle:accent},
      {kind:'horse',    body:'#334155', mane:'#e2e8f0', saddle:accent}
    ],
    classic: [
      {kind:'horse',    body:'#fffbeb', mane:'#f5c542', saddle:'#e11d48'}, // Golden-maned lead jumper
      {kind:'lion',     body:'#f59e0b', mane:'#9a3412', saddle:'#1d4ed8'}, // King Lion
      {kind:'ostrich',  body:'#1e293b', mane:'#f472b6', saddle:'#facc15', neck:'#f9a8d4'}, // Plumed Circus Ostrich
      {kind:'chariot',  body:'#e11d48', mane:'#f5c542', saddle:'#fef08a'}  // Baroque Swan Chariot
    ],
    jungle: [
      {kind:'jaguar',   body:'#f59e0b', mane:'#18181b', saddle:'#2fbf9a'}, // Spotted Mayan Jaguar
      {kind:'frog',     body:'#22c55e', mane:'#ef4444', saddle:'#eab308'}, // Red-Eyed Tree Frog
      {kind:'toucan',   body:'#18181b', mane:'#f97316', saddle:'#10b981'}, // Giant-Beaked Toucan
      {kind:'elephant', body:'#94a3b8', mane:'#eab308', saddle:'#dc2626'}  // Ceremonial Temple Elephant
    ],
    western: [
      {kind:'longhorn', body:'#b45309', mane:'#f8fafc', saddle:'#b91c1c'}, // Texas Longhorn Steer
      {kind:'horse',    body:'#f8fafc', mane:'#9a3412', saddle:'#d97706', spots:'#9a3412'}, // Pinto Mustang
      {kind:'burro',    body:'#78716c', mane:'#292524', saddle:'#dc2626'}, // Prospecting Pack Mule
      {kind:'stagecoach',body:'#9a3412',mane:'#f59e0b', saddle:'#fef3c7'}  // Mini Overland Stagecoach
    ],
    frontier: [
      {kind:'bear',     body:'#5a3b22', mane:'#3e2723', saddle:'#b91c1c'}, // Grizzly Bear
      {kind:'moose',    body:'#6b4a2b', mane:'#d9b27a', saddle:'#2f5f3a'}, // Bull Moose with Antlers
      {kind:'wolf',     body:'#94a3b8', mane:'#e2e8f0', saddle:'#d97706'}, // Timber Wolf
      {kind:'bison',    body:'#451a03', mane:'#290f02', saddle:'#eab308'}  // American Plains Bison
    ],
    space: [
      {kind:'pegasus',  body:'#e2e8f0', mane:'#22d3ee', saddle:'#0284c7'}, // Cyber-Neon Winged Pegasus
      {kind:'strider',  body:'#a855f7', mane:'#38bdf8', saddle:'#f472b6'}, // 3-Eyed Alien Exo-Strider
      {kind:'saucer',   body:'#0284c7', mane:'#22d3ee', saddle:'#e879f9'}, // Mini Saucer Hover-Bike
      {kind:'rover',    body:'#facc15', mane:'#0f172a', saddle:'#22d3ee'}  // Lunar Buggy Pod
    ],
    gothic: [
      {kind:'nightmare',body:'#18181b', mane:'#dc2626', saddle:'#7f1d1d'}, // Flaming-Mane Skeletal Steed
      {kind:'gargoyle', body:'#52525b', mane:'#a1a1aa', saddle:'#991b1b'}, // Winged Stone Gargoyle
      {kind:'hellhound',body:'#27272a', mane:'#ef4444', saddle:'#450a0a'}, // Cerberus Hellhound
      {kind:'hearse',   body:'#3b0764', mane:'#c084fc', saddle:'#dc2626'}  // Bat-Winged Vampire Chariot
    ],
    medieval: [
      {kind:'destrier', body:'#f8fafc', mane:'#f5c542', saddle:'#b91c1c'}, // Barded Jousting Warhorse
      {kind:'unicorn',  body:'#ffffff', mane:'#fde047', saddle:'#3b82f6'}, // Golden-Horned Unicorn
      {kind:'griffin',  body:'#d97706', mane:'#fef3c7', saddle:'#1d4ed8'}, // Winged Royal Griffin
      {kind:'dragon',   body:'#15803d', mane:'#facc15', saddle:'#b91c1c'}  // Emerald Wyvern Mount
    ],
    alps: [
      {kind:'stbernard',body:'#d97706', mane:'#f8fafc', saddle:'#dc2626'}, // St. Bernard with Brandy Keg
      {kind:'ibex',     body:'#78716c', mane:'#44403c', saddle:'#0284c7'}, // Swept-Horn Alpine Ibex
      {kind:'cow',      body:'#f8fafc', mane:'#78350f', saddle:'#dc2626', spots:'#78350f'}, // Milka Cow with Brass Bell
      {kind:'sleigh',   body:'#dc2626', mane:'#f5c542', saddle:'#f8fafc'}  // Carved Swan Ice-Sleigh
    ],
    fiesta: [
      {kind:'alebrije', body:'#e11d48', mane:'#facc15', saddle:'#0d9488'}, // Winged Oaxacan Alebrije Jaguar
      {kind:'pinata',   body:'#38bdf8', mane:'#ec4899', saddle:'#f59e0b'}, // Festive Rainbow Piñata Burro
      {kind:'rooster',  body:'#f97316', mane:'#dc2626', saddle:'#10b981'}, // Giant Fighting Rooster (Gallo)
      {kind:'quetzal',  body:'#10b981', mane:'#e11d48', saddle:'#facc15'}  // Plumed Quetzal Bird
    ],
    nordic: [
      {kind:'sleipnir', body:'#cbd5e1', mane:'#38bdf8', saddle:'#d97706'}, // Odin's 8-Legged Steed Sleipnir
      {kind:'boar',     body:'#eab308', mane:'#fef08a', saddle:'#991b1b'}, // Gullinbursti Golden Tusker Boar
      {kind:'wolf',     body:'#475569', mane:'#94a3b8', saddle:'#0284c7'}, // Fenrir Giant Dire-Wolf
      {kind:'ram',      body:'#78350f', mane:'#fde68a', saddle:'#b91c1c'}  // Thor's Chariot Goat Tanngrisnir
    ],
    bavarian: [
      {kind:'draft',    body:'#78350f', mane:'#fef3c7', saddle:'#2563eb'}, // Plumed Oktoberfest Brewery Horse
      {kind:'lion',     body:'#f5c542', mane:'#b45309', saddle:'#2563eb'}, // Golden Bavarian Heraldic Lion
      {kind:'swan',     body:'#ffffff', mane:'#f5c542', saddle:'#0284c7'}, // Neuschwanstein Royal Swan
      {kind:'barrel',   body:'#92400e', mane:'#f5c542', saddle:'#2563eb'}  // Carved Riding Beer-Barrel Steed
    ]
  }[theme];

  const mounts = [];
  [[r(0.43), 10, 0], [r(0.26), 6, 0.5]].forEach(([rad, n, ph], ringIdx) => {
    for(let i=0; i<n; i++){
      const a = rot + (i + ph)*TAU/n;
      const spec = MENAGERIE[(i + ringIdx*2) % MENAGERIE.length];
      // Chariots / sleighs stay level on the deck; animals gallop up and down on their brass poles!
      const isChariot = (spec.kind === 'chariot' || spec.kind === 'stagecoach' || spec.kind === 'sleigh' || spec.kind === 'hearse' || spec.kind === 'rover');
      const bob = isChariot ? 0 : r(0.036) * Math.sin(rot*3.0 + i*1.57 + ringIdx*1.1);
      mounts.push({
        a, rad, ringIdx, i, spec,
        z: r(isChariot ? 0.125 : 0.175) + bob,
        bob,
        key: Math.cos(a) + Math.sin(a)
      });
    }
  });

  // Helper to draw a single Brass Pole + Bespoke Creature/Mount + Rider
  const drawMount = m => {
    const bot = g(m.rad, m.a, zd + r(0.005));
    const top = g(m.rad, m.a, zr - r(0.005));
    const C   = g(m.rad, m.a, m.z);

    // 1. Vertical Brass / Spiral Carousel Pole (from deck zd to ceiling zr)
    line(bot, top, shade(PAL.pole, -0.38), R*0.013);
    line(bot, top, PAL.pole, R*0.0075);

    // Contact shadow on the turntable deck directly beneath the creature
    ell([bot[0], bot[1]], r(0.052), 'rgba(15,23,42,0.24)');

    // 2. Upright-Locked 3D Tangent Transform for Creature & Rider!
    const tx = (-Math.sin(m.a) - Math.cos(m.a)) * 0.70;
    const ty = (-Math.sin(m.a) + Math.cos(m.a)) * 0.35;
    const tl = Math.hypot(tx, ty) || 1;
    const dir = (tx >= 0) ? 1 : -1;
    const scX = Math.max(0.55, Math.abs(tx) / 0.72);
    const slopeY = Math.max(-0.28, Math.min(0.28, (ty / tl) * 0.36));

    const sp = m.spec;
    const knd = sp.kind;
    const darkBody = shade(sp.body, -0.32);

    ctx.save();
    ctx.transform(dir * scX, slopeY, 0, 1, C[0], C[1]);

    const L = r(0.068), H = r(0.035);

    if(knd === 'chariot' || knd === 'sleigh' || knd === 'stagecoach' || knd === 'hearse' || knd === 'rover'){
      // Carved Swan Chariot / Stagecoach / Alpine Sleigh / Vampire Hearse / Lunar Rover
      poly([[-L*1.05, H*0.8], [L*1.05, H*0.8], [L*1.25, -H*0.5], [L*0.4, -H*0.2], [-L*0.5, -H*0.2], [-L*1.15, -H*0.85]], sp.body, sp.mane, R*0.008);
      poly([[-L*0.65, H*0.6], [L*0.55, H*0.6], [L*0.55, -H*0.25], [-L*0.65, -H*0.25]], sp.saddle);
      if(knd === 'stagecoach' || knd === 'rover'){
        disc([-L*0.6, H*0.85], r(0.022), '#1e293b', sp.mane, R*0.005);
        disc([ L*0.6, H*0.85], r(0.022), '#1e293b', sp.mane, R*0.005);
      }
    }
    else if(knd === 'ostrich' || knd === 'toucan' || knd === 'rooster' || knd === 'quetzal' || knd === 'swan'){
      // Bipedal Bird Mounts (Ostrich, Toucan, Fighting Rooster, Quetzal, Royal Swan)
      // Bird legs
      line([-L*0.1, H*0.3], [-L*0.2, H*1.55], '#f59e0b', R*0.012);
      line([ L*0.15, H*0.3], [ L*0.25, H*1.55], '#f59e0b', R*0.012);
      // Plumed tail feathers
      poly([[-L*0.65, 0], [-L*1.35, -H*0.95], [-L*1.2, H*0.25]], sp.mane);
      // Plump bird body & saddle
      ctx.fillStyle = sp.body; ctx.beginPath(); ctx.ellipse(0, 0, L*0.92, H*0.92, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = sp.saddle; ctx.beginPath(); ctx.ellipse(-L*0.08, -H*0.15, L*0.48, H*0.68, 0, 0, TAU); ctx.fill();
      // Neck & Head
      const nCol = sp.neck || sp.body;
      line([L*0.65, -H*0.2], [L*0.95, -H*1.45], nCol, R*0.024);
      disc([L*1.02, -H*1.52], r(0.020), nCol);
      if(knd === 'toucan'){
        // Giant colorful Toucan beak!
        poly([[L*1.1, -H*1.75], [L*1.85, -H*1.45], [L*1.1, -H*1.25]], '#f97316', '#18181b', R*0.005);
      } else if(knd === 'rooster'){
        // Red rooster comb
        poly([[L*0.9, -H*1.7], [L*1.15, -H*2.1], [L*1.2, -H*1.6]], '#dc2626');
        poly([[L*1.15, -H*1.6], [L*1.45, -H*1.48], [L*1.15, -H*1.35]], '#facc15');
      } else {
        poly([[L*1.15, -H*1.6], [L*1.48, -H*1.48], [L*1.15, -H*1.35]], '#facc15');
      }
    }
    else if(knd === 'frog'){
      // Giant Red-Eyed Rainforest Tree Frog
      line([-L*0.45, H*0.3], [-L*0.85, H*1.1], '#15803d', R*0.020);
      line([ L*0.55, H*0.3], [ L*0.85, H*1.1], '#15803d', R*0.018);
      ctx.fillStyle = sp.body; ctx.beginPath(); ctx.ellipse(0, 0, L*0.98, H*0.95, -0.15, 0, TAU); ctx.fill();
      ctx.fillStyle = sp.saddle; ctx.beginPath(); ctx.ellipse(-L*0.1, -H*0.2, L*0.48, H*0.65, 0, 0, TAU); ctx.fill();
      disc([L*0.72, -H*0.72], r(0.022), '#ef4444', '#ffffff', R*0.004);
      disc([L*0.78, -H*0.72], r(0.009), '#09090b');
    }
    else if(knd === 'saucer'){
      // Space Hover-Saucer Bike
      ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.ellipse(0, H*0.2, L*1.15, H*0.65, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = sp.body; ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = R*0.008;
      ctx.beginPath(); ctx.ellipse(0, 0, L*1.12, H*0.62, 0, 0, TAU); ctx.fill(); ctx.stroke();
      disc([L*0.75, -H*0.25], r(0.020), '#22d3ee');
      disc([-L*0.95, 0], r(0.016), '#e879f9');
    }
    else {
      // Quadruped Mounts (Horses, Lions, Jaguars, Longhorns, Bears, Moose, Unicorns, Griffins, Dragons, St. Bernards, Sleipnir, Boars, etc.)
      // 1. Galloping Legs (8 legs for Odin's Sleipnir; 4 legs for all others!)
      const legOffsets = (knd === 'sleipnir') ? [-0.65, -0.42, 0.42, 0.68] : [-0.55, 0.55];
      legOffsets.forEach((lx, j) => {
        line([lx*L, H*0.3], [(lx - 0.25)*L, H*1.55], darkBody, R*0.013);
        line([lx*L, H*0.3], [(lx + 0.28)*L, H*1.48], sp.body, R*0.013);
      });

      // 2. Flowing Tail (or Spiked Dragon Tail)
      if(knd === 'dragon' || knd === 'gargoyle'){
        line([-L*0.85, 0], [-L*1.45, -H*0.55], sp.body, R*0.016);
      } else if(knd !== 'bear' && knd !== 'boar'){
        line([-L*0.88, -H*0.1], [-L*1.25, H*1.1], sp.mane, R*0.018);
      }

      // 3. Torso Body +Spots + Saddle Blanket (or Medieval Barding)
      ctx.fillStyle = sp.body;
      ctx.beginPath(); ctx.ellipse(0, 0, L, H*0.95, 0, 0, TAU); ctx.fill();
      if(sp.spots){
        [[-0.35,0.1],[0.25,-0.15],[0.45,0.2]].forEach(([sx,sy]) => disc([sx*L, sy*H], r(0.014), sp.spots));
      }
      if(knd === 'jaguar' || knd === 'alebrije'){
        [[-0.4,0.1],[0.3,-0.1],[0.1,0.25]].forEach(([sx,sy]) => disc([sx*L, sy*H], r(0.010), sp.mane));
      }
      // Saddle blanket or armored warhorse caparison
      if(knd === 'destrier'){
        poly([[-L*0.85, -H*0.3], [L*0.75, -H*0.3], [L*0.85, H*0.95], [-L*0.95, H*0.95]], sp.saddle, '#f5c542', R*0.007);
      } else {
        ctx.fillStyle = sp.saddle;
        ctx.beginPath(); ctx.ellipse(-L*0.06, -H*0.12, L*0.48, H*0.76, 0, 0, TAU); ctx.fill();
      }

      // 4. Neck, Mane & Sculpted Species Head!
      const nb = [L*0.68, -H*0.15], nt = [L*1.02, -H*1.35];
      if(knd === 'lion'){
        // Shaggy Golden Lion Mane Collar
        disc([L*0.82, -H*0.65], r(0.036), sp.mane);
      }
      line(nb, nt, sp.body, R*0.028);
      line([nb[0]-L*0.18, nb[1]-H*0.2], [nt[0]-L*0.18, nt[1]], sp.mane, R*0.014);
      // Head ellipse
      ctx.fillStyle = sp.body;
      ctx.beginPath(); ctx.ellipse(nt[0]+L*0.22, nt[1]+H*0.08, L*0.42, H*0.45, 0.35, 0, TAU); ctx.fill();

      // 5. Species-Specific Horns, Antlers, Tusks, Wings & Accessories!
      if(knd === 'longhorn' || knd === 'cow'){
        // Wide sweeping Texas Longhorns
        line([nt[0], nt[1]-H*0.25], [nt[0]-L*0.45, nt[1]-H*0.95], '#f8fafc', R*0.012);
        line([nt[0], nt[1]-H*0.25], [nt[0]+L*0.55, nt[1]-H*0.85], '#f8fafc', R*0.012);
      } else if(knd === 'moose'){
        // Broad palmate Moose Antlers
        poly([[nt[0],nt[1]-H*0.2], [nt[0]-L*0.55,nt[1]-H*1.15], [nt[0]+L*0.2,nt[1]-H*0.95]], '#d9b27a', '#5a3b22', R*0.005);
      } else if(knd === 'ibex' || knd === 'ram'){
        // Swept-back curved Alpine Ibex / Ram horns
        ctx.strokeStyle = '#d6d3d1'; ctx.lineWidth = R*0.013;
        ctx.beginPath(); ctx.arc(nt[0]-L*0.15, nt[1]-H*0.2, L*0.45, -Math.PI*0.8, 0.2); ctx.stroke();
      } else if(knd === 'unicorn'){
        // Spiraling Golden Unicorn Horn
        line([nt[0]+L*0.25, nt[1]-H*0.15], [nt[0]+L*0.85, nt[1]-H*0.95], '#facc15', R*0.012);
      } else if(knd === 'elephant'){
        // Upturned Elephant Trunk & Ivory Tusks
        line([nt[0]+L*0.35, nt[1]+H*0.1], [nt[0]+L*0.75, nt[1]-H*0.75], sp.body, R*0.018);
        line([nt[0]+L*0.25, nt[1]+H*0.3], [nt[0]+L*0.65, nt[1]+H*0.2], '#ffffff', R*0.010);
      } else if(knd === 'boar'){
        // Golden Boar Tusks
        line([nt[0]+L*0.35, nt[1]+H*0.25], [nt[0]+L*0.62, nt[1]-H*0.15], '#fef08a', R*0.011);
      } else if(knd === 'stbernard'){
        // Wooden rescue brandy barrel collar under the St. Bernard's chin
        disc([nt[0]+L*0.05, nt[1]+H*0.45], r(0.016), '#78350f', '#facc15', R*0.004);
      }

      // Feathered or Bat Wings on Pegasus, Griffin, Dragon, Gargoyle, Alebrije
      if(knd === 'pegasus' || knd === 'griffin' || knd === 'dragon' || knd === 'gargoyle' || knd === 'alebrije'){
        poly([[0, -H*0.2], [-L*0.55, -H*1.55], [L*0.25, -H*0.85]], sp.mane, '#0f172a', R*0.005);
      }
    }

    // 3. Rider Seated on the Mount (on outer ring & alternate inner mounts)
    if(m.i % 2 === 0 || m.ringIdx === 0){
      const shirtCol = ['#3b82f6','#22c55e','#f97316','#a855f7','#ec4899','#eab308'][(m.i + m.ringIdx) % 6];
      ctx.fillStyle = shirtCol;
      ctx.fillRect(-r(0.014), -r(0.068), r(0.028), r(0.042));
      disc([0, -r(0.084)], r(0.018), '#fde4c8', '#1e293b', R*0.004);
    }

    ctx.restore();
  };

  // =========================================================================
  // 4. RENDER PASSES: BACK MOUNTS -> CENTER COLUMN -> FRONT MOUNTS -> ROOF CANOPY!
  //    CRITICAL FIX: Drawing ALL mounts & poles BEFORE the roof canopy (`zr` and above)
  //    ensures the brass poles terminate cleanly under the roof ceiling instead of
  //    drawing lines on top of the roof cone!
  // =========================================================================

  // PASS A: Back-half mounts & poles (behind the center column: key < 0)
  mounts.filter(m => m.key < 0).sort((u,v) => u.key - v.key).forEach(drawMount);

  // PASS B: Central Ornate Mirror / Calliope / Totem / Reactor Column (from zd to zr)
  const ctr = r(0.118), cb = P(0, 0, zd), ch = zr - zd;
  const colStyle = {
    unthemed: ['#fde8c0', '#bae6fd', accent],
    classic:  ['#f5c542', '#bae6fd', '#e11d48'],
    jungle:   ['#8e8a72', '#2fbf9a', '#eab308'],
    western:  ['#8a5a33', '#fde047', '#9a3412'],
    frontier: ['#6b4a2b', '#eab308', '#2f5f3a'],
    space:    ['#0f172a', '#22d3ee', '#a855f7'],
    gothic:   ['#18181b', '#991b1b', '#52525b'],
    medieval: ['#cbd5e1', '#f5c542', '#1d4ed8'],
    alps:     ['#b45309', '#f8fafc', '#dc2626'],
    fiesta:   ['#f59e0b', '#0d9488', '#e11d48'],
    nordic:   ['#451a03', '#f59e0b', '#991b1b'],
    bavarian: ['#f8fafc', '#2563eb', '#f5c542']
  }[theme];

  cyl(ctr*1.12, zd, r(0.035), colStyle[2], colStyle[0]);
  ctx.fillStyle = colStyle[0];
  ctx.fillRect(cb[0]-0.99*ctr, cb[1]-ch, 1.98*ctr, ch);
  for(let i=0; i<8; i++){
    const a0 = -Math.PI/4 + i*Math.PI/8, a1 = a0 + Math.PI/8;
    poly([g(ctr,a0,zd+r(0.03)), g(ctr,a1,zd+r(0.03)), g(ctr,a1,zr), g(ctr,a0,zr)], i%2 ? colStyle[1] : colStyle[2], colStyle[0], R*0.005);
    if(i % 2 === 1){
      poly([g(ctr,a0+0.05,zd+ch*0.18), g(ctr,a0+0.12,zd+ch*0.18), g(ctr,a0+0.07,zd+ch*0.82), g(ctr,a0+0.02,zd+ch*0.82)], 'rgba(255,255,255,0.55)');
    }
  }

  // PASS C: Front-half mounts & poles (in front of the center column, but UNDER the roof canopy!)
  mounts.filter(m => m.key >= 0).sort((u,v) => u.key - v.key).forEach(drawMount);

  // =========================================================================
  // 5. BESPOKE ARCHITECTURAL CANOPIES & ROOF CROWNS (AT Z = zr AND ABOVE)
  // =========================================================================
  const drawChaserBulbs = (rad, zBulb, col1, col2) => {
    for(let i=0; i<28; i++){
      const a = i * TAU / 28;
      if(Math.cos(a) + Math.sin(a) > -0.05){
        const p = g(rad, a, zBulb);
        disc(p, R*0.009, (Math.floor(tm*4) + i) % 2 ? col1 : col2);
      }
    }
  };
  const drawScallopedValance = (rad, zVal, nScallops, colA, colB, strokeC) => {
    for(let i=0; i<nScallops; i++){
      const a0 = -Math.PI*0.25 + i*Math.PI/nScallops, a1 = a0 + Math.PI/nScallops;
      const p0 = g(rad, a0, zVal), p1 = g(rad, a1, zVal);
      poly([p0, p1, [(p0[0]+p1[0])*0.5, (p0[1]+p1[1])*0.5 + r(0.045)]], i%2 ? colA : colB, strokeC, R*0.006);
    }
  };
  const drawFlagFinial = (zBase, zTop, poleCol, flagCol) => {
    const pB = P(0,0,zBase), pT = P(0,0,zTop);
    line(pB, pT, poleCol, R*0.015);
    disc(pB, R*0.022, poleCol);
    const wv = Math.sin(tm*3.5)*r(0.012);
    poly([pT, [pT[0]+r(0.11), pT[1]+r(0.015)+wv], [pT[0]+r(0.08), pT[1]+r(0.038)+wv], [pT[0]+r(0.11), pT[1]+r(0.06)+wv], [pT[0], pT[1]+r(0.05)]], flagCol, poleCol, R*0.006);
  };

  if(theme === 'unthemed'){
    // Standard Fairground Carousel Canopy
    cyl(Rr, zr, r(0.055), cream, false, shade(accent,-0.3));
    const rb = P(0,0,zr);
    ctx.fillStyle = accent; ctx.fillRect(rb[0]-0.99*Rr, rb[1]-r(0.038), 1.98*Rr, r(0.016));
    drawChaserBulbs(Rr, zr+r(0.028), '#fef08a', '#fdba74');
    drawScallopedValance(Rr, zr, 22, '#f8fafc', accent, shade(accent,-0.3));
    const zRim = zr + r(0.055);
    coneGores(Rr, zRim, r(0.78), 16, i => i%2 ? cream : accent, 'rgba(120,53,15,0.22)');
    drawFlagFinial(r(0.78), r(0.92), gold, accent);
  }
  else if(theme === 'classic'){
    // 1. CLASSIC MIDWAY: Grand 2-Tier Victorian Wurlitzer Pagoda Canopy with Cameo Medallions & Clerestory Crown!
    cyl(Rr, zr, r(0.065), '#991b1b', false, '#f5c542');
    drawScallopedValance(Rr, zr, 20, '#f5c542', '#e11d48', '#7f1d1d');
    // Painted Baroque Cameo Portrait Shields & Chaser Bulbs around the rounding board
    for(let i=0; i<10; i++){
      const a = -Math.PI*0.2 + i*Math.PI/9;
      const p = g(Rr*1.01, a, zr+r(0.032));
      ell(p, r(0.028), i%2 ? '#38bdf8' : '#fef08a', '#f5c542', R*0.007);
    }
    drawChaserBulbs(Rr, zr+r(0.055), '#fffbeb', '#facc15');
    // Lower 16-gore Crimson & Cream Tent Slope
    coneGores(Rr, zr+r(0.065), r(0.71), 16, i => i%2 ? '#fffbeb' : '#e11d48', '#f5c542');
    // Upper Golden Clerestory Lantern Drum + Upper Pagoda Crown & Brass Finial
    cyl(Rr*0.48, r(0.66), r(0.065), '#1e3a8a', '#f5c542', '#f5c542');
    drawChaserBulbs(Rr*0.49, r(0.69), '#fef08a', '#f472b6');
    coneGores(Rr*0.52, r(0.725), r(0.86), 12, i => i%2 ? '#f5c542' : '#e11d48', '#b45309');
    drawFlagFinial(r(0.86), r(0.98), '#f5c542', '#2563eb');
  }
  else if(theme === 'jungle'){
    // 2. JUNGLE: 2-Tier Tropical Palm-Frond & Bamboo Thatch Palapa Canopy + Carved Mayan Sun-Idol Crown!
    cyl(Rr*0.98, zr, r(0.05), '#137a70', false, '#eab308');
    // Overlapping green tropical banana/palm leaf valance around the eaves
    drawScallopedValance(Rr*1.02, zr, 16, '#15803d', '#22c55e', '#14532d');
    // Lower woven palm-thatch cone
    coneGores(Rr*1.02, zr+r(0.045), r(0.72), 14, i => i%2 ? '#b5893d' : '#926c29', '#5a4028');
    // Upper second-tier thatch cone & green palm-frond starburst
    coneGores(Rr*0.62, r(0.66), r(0.83), 12, i => i%2 ? '#c99a49' : '#a16207', '#5a4028');
    coneGores(Rr*0.42, r(0.76), r(0.85), 10, i => i%2 ? '#15803d' : '#16a34a', '#14532d');
    // Golden Mayan Sun-Idol Finial at the summit
    const pk = P(0, 0, r(0.88));
    disc(pk, r(0.055), '#eab308', '#78350f', R*0.009);
    disc(pk, r(0.025), '#2fbf9a');
  }
  else if(theme === 'western'){
    // 3. WILD WEST: Giant 12-Spoke Wooden Wagon-Wheel Canopy with Iron Tire Rim, Canvas Wedges & Longhorn Crown!
    // Riveted black iron wagon-wheel tire rim & weathered oak felloes
    cyl(Rr, zr, r(0.055), '#27272a', false, '#451a03');
    cyl(Rr*0.97, zr+r(0.01), r(0.038), '#8a5a33', false, '#f59e0b');
    // Hanging frontier kerosene lanterns around the wagon wheel rim
    for(let i=0; i<8; i++){
      const a = -Math.PI*0.2 + i*Math.PI/7;
      const lp = g(Rr*0.99, a, zr - r(0.015));
      disc(lp, r(0.016), '#fde047', '#78350f', R*0.005);
    }
    // Canvas dust-cover wedges with 12 thick exposed wooden wagon-wheel spokes radiating from the central iron hub!
    const zRim = zr + r(0.055), zHub = r(0.75);
    const pk = coneGores(Rr, zRim, zHub, 12, i => i%2 ? '#fef3c7' : '#b45309', '#451a03');
    for(let i=0; i<12; i++){
      const a = i * TAU / 12;
      line(pk, g(Rr, a, zRim), '#5a3b22', R*0.018);
      line(pk, g(Rr, a, zRim), '#a8784a', R*0.008);
    }
    // Central Iron Wagon-Wheel Hub Cap & Longhorn Steer Skull Finial!
    cyl(r(0.14), zHub-r(0.02), r(0.06), '#27272a', '#451a03', '#f59e0b');
    const sk = P(0, 0, zHub + r(0.07));
    line([sk[0]-r(0.12), sk[1]-r(0.04)], [sk[0]+r(0.12), sk[1]-r(0.04)], '#f8fafc', R*0.016);
    disc(sk, r(0.032), '#f8fafc', '#451a03', R*0.006);
  }
  else if(theme === 'frontier'){
    // 4. FRONTIER: Rustic Peeled-Log & Forest-Green Cedar-Shake Octagonal Lodge Roof + Carved Grizzly Bear Finial!
    cyl(Rr, zr, r(0.055), '#6b4a2b', false, '#3e2723');
    // Notched log eaves ring & warm camp lanterns
    drawChaserBulbs(Rr, zr+r(0.025), '#fde047', '#f97316');
    const zRim = zr + r(0.055), zPeak = r(0.79);
    const pk = coneGores(Rr*1.02, zRim, zPeak, 8, i => i%2 ? '#2f5f3a' : '#244d30', '#3e2723');
    // Exposed cedar log rafters along the 8 octagon hips
    for(let i=0; i<8; i++){
      line(pk, g(Rr*1.02, i*TAU/8, zRim), '#8a5a33', R*0.016);
    }
    // Carved Wooden Grizzly Bear / Totem Finial at the summit
    cyl(r(0.11), zPeak-r(0.02), r(0.08), '#5a3b22', '#8a5a33', '#eab308');
    disc(P(0,0,zPeak+r(0.09)), r(0.042), '#6b4a2b', '#eab308', R*0.008);
  }
  else if(theme === 'space'){
    // 5. SPACE: Translucent Cyan Geodesic Saucer Canopy, Tilted Saturn Ring & Levitating Planetarium Orb!
    cyl(Rr*1.02, zr, r(0.05), '#0f172a', false, '#22d3ee');
    drawChaserBulbs(Rr*1.02, zr+r(0.025), '#22d3ee', '#e879f9');
    // Faceted Metallic & Neon-Cyan Geodesic Saucer Dome
    const zRim = zr + r(0.05), zPeak = r(0.75);
    const pk = coneGores(Rr*1.02, zRim, zPeak, 16, i => i%2 ? '#1e293b' : '#0284c7', '#22d3ee');
    // Sweeping Tilted Neon Planetary Ring (Saturn Halo) orbiting the roof dome!
    const ringC = P(0, 0, r(0.68));
    ctx.save(); ctx.translate(ringC[0], ringC[1]); ctx.rotate(-0.22);
    ctx.strokeStyle = '#e879f9'; ctx.lineWidth = R*0.020;
    ctx.beginPath(); ctx.ellipse(0, 0, Rr*0.92, Rr*0.26, 0, 0, TAU); ctx.stroke();
    ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = R*0.009;
    ctx.beginPath(); ctx.ellipse(0, 0, Rr*0.92, Rr*0.26, 0, 0, TAU); ctx.stroke();
    ctx.restore();
    // Glowing Plasma Core Sphere at the apex
    const orb = P(0, 0, r(0.84));
    line(pk, orb, '#e2e8f0', R*0.016);
    disc(orb, r(0.055), '#0f172a', '#22d3ee', R*0.010);
    disc(orb, r(0.028), '#22d3ee');
  }
  else if(theme === 'gothic'){
    // 6. GOTHIC: Ribbed Black-Iron & Blood-Crimson Bat-Wing Cathedral Canopy + Wrought-Iron Gargoyle Belfry!
    cyl(Rr, zr, r(0.05), '#18181b', false, '#991b1b');
    const zRim = zr + r(0.05), pk = P(0, 0, r(0.82));
    // Scalloped bat-wing webbed gores with pointed iron rib tips & violet soul-candles
    for(let i=0; i<12; i++){
      const a0 = i*TAU/12, a1 = (i+1)*TAU/12, am = (a0+a1)*0.5;
      const p0 = g(Rr*1.04, a0, zRim - r(0.025)), p1 = g(Rr*1.04, a1, zRim - r(0.025));
      const pm = g(Rr*0.88, am, zRim + r(0.02));
      poly([pk, p0, pm, p1], i%2 ? '#18181b' : '#7f1d1d', '#09090b', R*0.008);
      line(pk, p0, '#52525b', R*0.011);
      if(Math.cos(a0) + Math.sin(a0) > -0.1){
        disc([p0[0], p0[1]-r(0.016)], r(0.012), '#c084fc');
      }
    }
    // Wrought-iron gothic belfry lantern & bat weathervane at the peak
    cyl(r(0.11), r(0.78), r(0.07), '#27272a', '#09090b', '#dc2626');
    const sp = P(0, 0, r(0.95));
    line(P(0,0,r(0.85)), sp, '#a1a1aa', R*0.014);
    poly([[sp[0]-r(0.08),sp[1]-r(0.02)], [sp[0],sp[1]+r(0.02)], [sp[0]+r(0.08),sp[1]-r(0.02)]], '#09090b', '#dc2626', R*0.006);
  }
  else if(theme === 'medieval'){
    // 7. MEDIEVAL: Royal Silk Jousting Pavilion Canopy with Heraldic Shields, Golden Crown & Tournament Pennant!
    cyl(Rr, zr, r(0.055), '#1e3a8a', false, '#f5c542');
    drawScallopedValance(Rr, zr, 16, '#b91c1c', '#f5c542', '#78350f');
    // Heraldic shields mounted around the frieze band
    for(let i=0; i<10; i++){
      const a = -Math.PI*0.2 + i*Math.PI/9;
      const p = g(Rr*1.01, a, zr+r(0.028));
      disc(p, r(0.022), i%2 ? '#f5c542' : '#b91c1c', '#fef08a', R*0.006);
    }
    const tentCols = ['#b91c1c', '#fef3c7', '#1d4ed8', '#f5c542'];
    coneGores(Rr, zr+r(0.055), r(0.81), 16, i => tentCols[i%4], '#b45309');
    // Sculpted Golden Royal Crown at the peak + fluttering swallowtail banner
    cyl(r(0.14), r(0.77), r(0.055), '#f5c542', '#fef08a', '#b45309');
    drawFlagFinial(r(0.825), r(0.97), '#f5c542', '#b91c1c');
  }
  else if(theme === 'alps'){
    // 8. ALPS: Overhanging Larch-Timber Chalet Roof with Thick Sculpted Snow Blanket, Cowbells & Cuckoo Turret!
    cyl(Rr, zr, r(0.05), '#78350f', false, '#451a03');
    // Hanging brass Alpine cowbells & red geranium flower clusters around the eaves!
    for(let i=0; i<14; i++){
      const a = -Math.PI*0.2 + i*Math.PI/13;
      const p = g(Rr*1.0, a, zr);
      disc(p, r(0.016), i%2 ? '#facc15' : '#ef4444', '#451a03', R*0.005);
    }
    const zRim = zr + r(0.05), zPeak = r(0.77);
    coneGores(Rr*1.03, zRim, zPeak, 12, i => i%2 ? '#92400e' : '#78350f', '#451a03');
    // Thick white Alpine snowpack blanketing the upper two-thirds of the chalet roof with scalloped drifts!
    coneGores(Rr*0.72, zRim + r(0.065), zPeak + r(0.01), 12, () => '#ffffff', '#bae6fd');
    for(let i=0; i<12; i++){
      const a = -Math.PI*0.2 + i*Math.PI/11;
      ell(g(Rr*0.72, a, zRim + r(0.065)), r(0.045), '#ffffff');
    }
    // Alpine Chalet Clock Cupola & Swiss Cross Finial at the summit
    cyl(r(0.11), zPeak, r(0.07), '#b45309', '#f8fafc', '#451a03');
    drawFlagFinial(zPeak+r(0.07), r(0.96), '#f8fafc', '#dc2626');
  }
  else if(theme === 'fiesta'){
    // 9. FIESTA: Giant Festive Embroidered Mexican Sombrero Canopy with Pom-Pom Tassels & Papel Picado!
    // Wide upturned embroidered sombrero brim!
    cyl(Rr*1.06, zr, r(0.06), '#f59e0b', false, '#e11d48');
    coneGores(Rr*1.06, zr+r(0.06), zr+r(0.13), 16, i => ['#e11d48','#f59e0b','#0d9488','#1d4ed8'][i%4], '#fde047');
    // Dangling colorful pom-pom tassels & papel picado flags around the sombrero brim
    for(let i=0; i<18; i++){
      const a = -Math.PI*0.22 + i*Math.PI/17;
      const p = g(Rr*1.05, a, zr - r(0.008));
      disc(p, r(0.017), ['#fde047','#ec4899','#10b981','#ffffff'][i%4]);
    }
    // Tall tapered central Sombrero Crown rising above the brim!
    cyl(Rr*0.48, zr+r(0.10), r(0.045), '#0d9488', '#fde047', '#fde047');
    coneGores(Rr*0.46, zr+r(0.145), r(0.88), 12, i => i%2 ? '#f59e0b' : '#e11d48', '#fde047');
    ell(P(0, 0, r(0.88)), r(0.095), '#f59e0b', '#e11d48', R*0.010);
  }
  else if(theme === 'nordic'){
    // 10. NORDIC: 2-Tiered Tarred Stave-Shingle Canopy Rimmed with Overlapping Viking Shields & Crossed Dragon Prows!
    cyl(Rr, zr, r(0.05), '#290f02', false, '#d97706');
    // Row of 14 overlapping painted wooden Viking round shields around the canopy rim!
    for(let i=0; i<14; i++){
      const a = -Math.PI*0.22 + i*Math.PI/13;
      const p = g(Rr*1.01, a, zr + r(0.025));
      disc(p, r(0.034), i%2 ? '#991b1b' : '#0284c7', '#f59e0b', R*0.007);
      disc(p, r(0.011), '#fde047');
    }
    // Lower & Upper dark tarred stave-church shingle roof tiers
    coneGores(Rr, zr+r(0.05), r(0.74), 12, i => i%2 ? '#1e293b' : '#334155', '#d97706');
    cyl(Rr*0.45, r(0.68), r(0.055), '#451a03', '#f59e0b', '#d97706');
    const pk = coneGores(Rr*0.48, r(0.735), r(0.87), 10, i => i%2 ? '#0f172a' : '#1e293b', '#f59e0b');
    // Crossed Golden Open-Jawed Dragon-Head Prows (Drakhuvud) crowning the stave peak!
    [-1, 1].forEach(s => {
      line(pk, [pk[0]+s*r(0.12), pk[1]-r(0.085)], '#f59e0b', R*0.022);
      disc([pk[0]+s*r(0.13), pk[1]-r(0.09)], r(0.022), '#dc2626', '#fde047', R*0.006);
    });
  }
  else if(theme === 'bavarian'){
    // 11. BAVARIAN: Blue-and-White Lozenge Frieze, Domed Red-Tile Pavilion & Giant Verdigris Copper Onion Dome!
    cyl(Rr, zr, r(0.06), '#2563eb', false, '#f5c542');
    drawScallopedValance(Rr, zr, 20, '#ffffff', '#2563eb', '#1e3a8a');
    drawChaserBulbs(Rr, zr+r(0.03), '#fef08a', '#ffffff');
    // Blue-and-white Bavarian diamond lozenge canopy
    coneGores(Rr, zr+r(0.06), r(0.75), 16, i => i%2 ? '#ffffff' : '#2563eb', '#f5c542');
    // Glockenspiel Clock Cupola + Giant Verdigris Copper Onion Dome & Golden Pretzel Finial!
    cyl(r(0.16), r(0.70), r(0.08), '#fef3c7', '#0d9488', '#78350f');
    disc(P(0, r(0.16), r(0.74)), r(0.032), '#ffffff', '#f59e0b', R*0.007);
    const od = P(0, 0, r(0.84));
    ell(od, r(0.13), '#0d9488', '#f5c542', R*0.010);
    disc([od[0], od[1]-r(0.04)], r(0.055), '#0d9488', '#f5c542', R*0.008);
    drawFlagFinial(r(0.88), r(0.99), '#f5c542', '#2563eb');
  }
}
/* ===== END SPRITE CODE ===== */
return drawCarousel;
})();
window.drawCarousel = CarouselSkinPack;
const EnterpriseSkinPack = (() => {
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
    ctx.lineTo(cx+R*Math.cos(a), cy+R*Math.sin(a)*0.58);}
  ctx.closePath();
}

/* ===== ENTERPRISE SKIN METADATA (UNTHEMED + 11 HEAVY/IMMERSIVE SKINS) ===== */
const ENTERPRISE_SKINS = {
  unthemed: {id:'unthemed', label:'Unthemed (Tier 0–2)', name:'Standard Huss Enterprise',     sub:'Steel Spokes, Hydraulic Ram & Aero Pods',       hex:'#cbd5e1', border:'#22c55e'},
  classic:  {id:'classic',  label:'Classic Midway',      name:'Super Star Enterprise',        sub:'Chasing Neon Spokes, 8-Point Star Hub & Chrome',hex:'#cbb07c', border:'#e11d48'},
  jungle:   {id:'jungle',   label:'Jungle',              name:'Wheel of the Sun God',         sub:'Mayan Calendar Rim, Gold Sun Mask & Jade Cages',hex:'#587c48', border:'#2fbf9a'},
  western:  {id:'western',  label:'Wild West',           name:'The Runaway Wagon Wheel',      sub:'Iron-Tired Timber Wheel, Sheriff Hub & Wagons', hex:'#c99a62', border:'#b91c1c'},
  frontier: {id:'frontier', label:'Frontier',            name:'Lumberjack Sawmill Blade',     sub:'Notched Buzzsaw Rim, Cedar Spokes & Bear Hub',  hex:'#7d955d', border:'#566e42'},
  space:    {id:'space',    label:'Space',               name:'Centrifuge Orbital Ring',      sub:'Tokamak Plasma Core, Cyan Spokes & Cryo-Pods',  hex:'#334155', border:'#0ea5e9'},
  gothic:   {id:'gothic',   label:'Gothic',              name:'The Wheel of Torment',         sub:'Rose-Window Tracery, Crimson Hub & Raven Cages',hex:'#3b3345', border:'#991b1b'},
  medieval: {id:'medieval', label:'Medieval',            name:'Siege Wheel of Fortune',       sub:'Heraldic Spoke Shields, Crown Hub & Trebuchet', hex:'#6c8c58', border:'#eab308'},
  alps:     {id:'alps',     label:'Alps',                name:'Glacier Funicular Bull-Wheel', sub:'Cogwheel Rim, Edelweiss Hub & Red Cable Cabins',hex:'#a8c5d6', border:'#0284c7'},
  fiesta:   {id:'fiesta',   label:'Fiesta',              name:'Rueda de Fuego (Sun Wheel)',   sub:'Talavera Pinwheel, Aztec Sun Face & Trajineras',hex:'#d99b52', border:'#e11d48'},
  nordic:   {id:'nordic',   label:'Nordic',              name:"Jörmungandr's Maelstrom",      sub:'Viking Shield Rim, Valknut Hub & Longship Pods',hex:'#4d6b63', border:'#d97706'},
  bavarian: {id:'bavarian', label:'Bavarian',            name:'Oktoberfest Wasserrad',        sub:'Brass Clockwork Gear, Lozenge Ring & Kettles',  hex:'#769958', border:'#2563eb'}
};
ENTERPRISE_SKINS.german = ENTERPRISE_SKINS.bavarian;

/* ===== SPRITE CODE: copy this block into engine.js ===== */
/**
 * drawEnterprise(ctx, cx, cy, R, opts)
 *  opts.accent        : Land / chain accent color (default '#22c55e')
 *  opts.themeId       : 'classic'|'jungle'|'western'|'wildwest'|'frontier'|'space'|'gothic'|'medieval'|'alps'|'fiesta'|'nordic'|'bavarian'|'german'
 *  opts.rideThemeTier : 0..4 (<=2 draws Standard Unthemed; >=3 draws Heavy/Immersive Themed Skin)
 *  opts.t             : wheel spin angle in radians
 *  opts.tilt          : wheel tilt in radians (0 = flat loading, ~1.4 = nearly vertical)
 *  opts.flip          : true when called under horizontal mirror
 *  opts.tile          : draw the hex tile background (default true)
 */
function drawEnterprise(ctx, cx, cy, R, opts={}){
  const tier = opts.rideThemeTier != null ? opts.rideThemeTier : (opts.tier != null ? opts.tier : (opts.themeId || opts.theme ? 3 : 0));
  let rawTheme = String(opts.themeId || opts.theme || 'unthemed').toLowerCase();
  if(rawTheme === 'wildwest' || rawTheme === 'wild_west') rawTheme = 'western';
  if(rawTheme === 'german') rawTheme = 'bavarian';
  const theme = (tier <= 2 || !ENTERPRISE_SKINS[rawTheme]) ? 'unthemed' : rawTheme;
  const skin = ENTERPRISE_SKINS[theme] || ENTERPRISE_SKINS.unthemed;
  const accent = opts.accent || skin.border || '#22c55e';
  const spin = opts.t == null ? 0.65 : opts.t;
  const al = opts.tilt == null ? 1.18 : opts.tilt;
  const fl = opts.flip ? -1 : 1;
  const sa = Math.sin(al), ca = Math.cos(al);
  const TAU = Math.PI * 2;

  const cyB = cy + R * 0.04;
  const P = (X,Y,Z) => [cx + (X - Y)*0.7, cyB + (X + Y)*0.35 - Z];
  const lerp = (a,b,t) => [a[0] + (b[0]-a[0])*t, a[1] + (b[1]-a[1])*t];
  const line = (a,b,c,w) => {
    ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
  };
  const poly = (pts,fill,stroke,lw) => {
    ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.009;ctx.lineJoin='round';ctx.stroke();}
  };
  const ell = (p,rx,ry,fill,stroke,lw) => {
    ctx.beginPath();ctx.ellipse(p[0],p[1],Math.max(0.5,rx),Math.max(0.5,ry),0,0,TAU);
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.009;ctx.stroke();}
  };
  const isoBox = (x0,x1,y0,y1,z0,z1,cf,ce,ct,stroke,lw) => {
    if(ct) poly([P(x0,y0,z1),P(x1,y0,z1),P(x1,y1,z1),P(x0,y1,z1)], ct, stroke, lw);
    poly([P(x0,y1,z0),P(x1,y1,z0),P(x1,y1,z1),P(x0,y1,z1)], cf, stroke, lw);
    poly([P(x1,y0,z0),P(x1,y1,z0),P(x1,y1,z1),P(x1,y0,z1)], ce, stroke, lw);
  };

  // Wheel & Boom kinematics
  const Rw = R * 0.50;                         // Main wheel radius
  const Zh = R * 0.16 + Rw * sa * 0.96;        // Wheel hub height (rises as wheel tilts)
  const Yh = -R * 0.04 * (1 - ca);             // Slight Y shift as boom arcs up
  const N = 12;                                // 12 spokes & 12 enclosed cage gondolas
  const nw = [0, -sa, ca];                     // Unit normal vector to the tilted wheel plane
  const rim3 = (th, rad=Rw, nOff=0) => [
    rad * Math.cos(th) + nw[0]*nOff,
    Yh + rad * Math.sin(th)*ca + nw[1]*nOff,
    Zh + rad * Math.sin(th)*sa + nw[2]*nOff
  ];

  // 1. Optional Hex Tile Base
  if(opts.tile !== false){
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = theme === 'unthemed' ? '#cbd5e1' : skin.hex;
    ctx.fill();
    ctx.lineWidth = Math.max(2, R*0.055);
    ctx.strokeStyle = accent;
    ctx.stroke();
  }

  // Theme palette table
  const PAL = {
    unthemed: {pier:'#475569', boom:'#64748b', rim:'#94a3b8', rimIn:'#cbd5e1', sp1:'#64748b', sp2:'#94a3b8', hub:accent,    trim:'#f8fafc', pod1:accent,    pod2:'#334155', cage:'#e2e8f0', pad:'#64748b'},
    classic:  {pier:'#991b1b', boom:'#f59e0b', rim:'#e11d48', rimIn:'#fef08a', sp1:'#fef08a', sp2:'#e11d48', hub:'#f59e0b', trim:'#fffbeb', pod1:'#e11d48', pod2:'#2563eb', cage:'#fef08a', pad:'#b91c1c'},
    jungle:   {pier:'#6e6a56', boom:'#8e8a72', rim:'#bdb9a0', rimIn:'#137a70', sp1:'#eab308', sp2:'#2fbf9a', hub:'#eab308', trim:'#2fbf9a', pod1:'#78350f', pod2:'#137a70', cage:'#d9b27a', pad:'#595443'},
    western:  {pier:'#78350f', boom:'#9a6a3c', rim:'#27272a', rimIn:'#9a6a3c', sp1:'#8a5a33', sp2:'#6f4a28', hub:'#451a03', trim:'#f59e0b', pod1:'#9a3412', pod2:'#78350f', cage:'#fef3c7', pad:'#6f4a28'},
    frontier: {pier:'#5f656c', boom:'#6b4a2b', rim:'#94a3b8', rimIn:'#8a5a33', sp1:'#8a5a33', sp2:'#5a3b22', hub:'#6b4a2b', trim:'#eab308', pod1:'#5a3b22', pod2:'#2f5f3a', cage:'#d9b27a', pad:'#5a3b22'},
    space:    {pier:'#0f172a', boom:'#cbd5e1', rim:'#0f172a', rimIn:'#22d3ee', sp1:'#22d3ee', sp2:'#e2e8f0', hub:'#0284c7', trim:'#e879f9', pod1:'#e2e8f0', pod2:'#0284c7', cage:'#22d3ee', pad:'#1e293b'},
    gothic:   {pier:'#27272a', boom:'#18181b', rim:'#18181b', rimIn:'#991b1b', sp1:'#27272a', sp2:'#7f1d1d', hub:'#991b1b', trim:'#c084fc', pod1:'#18181b', pod2:'#450a0a', cage:'#71717a', pad:'#27272a'},
    medieval: {pier:'#64748b', boom:'#78350f', rim:'#475569', rimIn:'#f5c542', sp1:'#78350f', sp2:'#b91c1c', hub:'#f5c542', trim:'#1d4ed8', pod1:'#b91c1c', pod2:'#1d4ed8', cage:'#f5c542', pad:'#64748b'},
    alps:     {pier:'#cbd5e1', boom:'#475569', rim:'#64748b', rimIn:'#dc2626', sp1:'#dc2626', sp2:'#f8fafc', hub:'#f59e0b', trim:'#38bdf8', pod1:'#dc2626', pod2:'#0284c7', cage:'#f8fafc', pad:'#94a3b8'},
    fiesta:   {pier:'#c2410c', boom:'#d97706', rim:'#e11d48', rimIn:'#0d9488', sp1:'#f59e0b', sp2:'#0d9488', hub:'#facc15', trim:'#e11d48', pod1:'#e11d48', pod2:'#0d9488', cage:'#fde047', pad:'#b45309'},
    nordic:   {pier:'#475569', boom:'#451a03', rim:'#451a03', rimIn:'#d97706', sp1:'#78350f', sp2:'#d97706', hub:'#d97706', trim:'#38bdf8', pod1:'#451a03', pod2:'#7f1d1d', cage:'#f59e0b', pad:'#334155'},
    bavarian: {pier:'#f8fafc', boom:'#78350f', rim:'#b45309', rimIn:'#2563eb', sp1:'#d97706', sp2:'#f8fafc', hub:'#f5c542', trim:'#2563eb', pod1:'#92400e', pod2:'#1d4ed8', cage:'#fde047', pad:'#64748b'}
  }[theme];

  // 2. Ground Target Ring + Dynamic Projected Wheel Shadow (NO Giant Rectangular Concrete Slab!)
  const p0 = P(0, 0, 0);
  // Subtle circular boarding ring directly on the ground where the horizontal wheel rests at tilt = 0
  ell(p0, R*0.44, R*0.22, 'rgba(15,23,42,0.18)', PAL.pad, R*0.012);
  ell(p0, R*0.18, R*0.09, shade(PAL.pad,-0.2), PAL.trim, R*0.007);

  // Projected 3D wheel shadow cast onto the ground plane z = 0
  ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
  ctx.beginPath();
  for(let i=0; i<=48; i++){
    const q = rim3(i/48*TAU);
    const p = P(q[0], q[1], 0);
    const sx = p[0] + fl*q[2]*0.24, sy = p[1] + q[2]*0.12;
    i ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy);
  }
  ctx.closePath();
  ctx.fill();

  // 3. Compact Rear Mechanical Anchor Pier & Hydraulic Hoist Housing (at Y = -R*0.44)
  const py0 = -R*0.54, py1 = -R*0.32, pxW = R*0.16, pH = R*0.17;
  // Shadow under rear pier
  ell(P(0, (py0+py1)/2, 0), R*0.24, R*0.12, 'rgba(15,23,42,0.32)');
  // Stepped foundation & themed hoist housing
  isoBox(-pxW*1.15, pxW*1.15, py0-R*0.03, py1+R*0.03, 0, R*0.04, shade(PAL.pier,-0.2), shade(PAL.pier,-0.35), PAL.pad);
  isoBox(-pxW, pxW, py0, py1, R*0.04, pH, PAL.pier, shade(PAL.pier,-0.25), shade(PAL.pier,0.18), PAL.trim, R*0.008);
  // Heavy Rear Counterweight Drum on back of the boom (-Y side of pivot)
  const cwZ = pH + R*0.02 - R*0.06*sa;
  isoBox(-pxW*0.75, pxW*0.75, py0-R*0.08, py0+R*0.02, cwZ-R*0.04, cwZ+R*0.05, PAL.hub, shade(PAL.hub,-0.3), PAL.trim);

  // 4. Twin-Beam Hydraulic Lifting Arm & Telescopic Chrome Hydraulic Ram Piston
  const pivL = P(-R*0.065, -R*0.40, pH), pivR = P(R*0.065, -R*0.40, pH);
  const hubRear = P(nw[0]*(-R*0.06), Yh + nw[1]*(-R*0.06), Zh + nw[2]*(-R*0.06));
  const hubCenter = P(0, Yh, Zh);

  // Telescopic Hydraulic Cylinder (from base front-bottom to mid-boom)
  const cylBase = P(0, -R*0.33, R*0.05);
  const boomMid = lerp(P(0, -R*0.40, pH), hubRear, 0.58);
  line(cylBase, lerp(cylBase, boomMid, 0.55), '#334155', R*0.046); // outer hydraulic sleeve
  line(lerp(cylBase, boomMid, 0.45), boomMid, '#e2e8f0', R*0.024); // gleaming chrome piston rod
  // Twin structural lifting boom beams
  line(pivL, hubRear, shade(PAL.boom,-0.32), R*0.062);
  line(pivR, hubRear, PAL.boom, R*0.062);
  line(P(0, -R*0.40, pH), hubRear, PAL.trim, R*0.018);
  // Pivot trunnion caps on the anchor block
  ell(pivL, R*0.032, R*0.032, PAL.trim, '#1e293b', R*0.006);
  ell(pivR, R*0.032, R*0.032, PAL.trim, '#1e293b', R*0.006);

  // Helper to draw a single enclosed cage gondola + 2 riders at 3D wheel rim angle th
  const shirtCols = ['#ef4444','#facc15','#22c55e','#38bdf8','#f97316','#ec4899'];
  const drawGondolaPod = (k, th, G3) => {
    const gP = P(G3[0], G3[1], G3[2]);
    // Centrifugal + gravity swing orientation: when flat (sa~0), hangs vertically; when vertical (sa~1), swings radially outward
    const radAng = Math.atan2(gP[1] - hubCenter[1], gP[0] - hubCenter[0]);
    const podAng = (radAng - Math.PI/2) * (0.25 + 0.75*sa);

    ctx.save();
    ctx.translate(gP[0], gP[1]);
    ctx.rotate(podAng);

    const pw = R * 0.072, ph = R * 0.054;
    const bodyCol = (k % 2 === 0) ? PAL.pod1 : PAL.pod2;

    if(theme === 'western'){
      // Miniature Covered Wagon / Ore Cart Gondola with Canvas Hoop Top
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-pw, -ph*0.1, pw*2, ph*1.1);
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath(); ctx.arc(0, -ph*0.1, pw*0.92, Math.PI, 0); ctx.fill();
      ctx.strokeStyle = '#451a03'; ctx.lineWidth = R*0.009; ctx.stroke();
    } else if(theme === 'space'){
      // Sleek Zero-G Cryo-Capsule with Glowing Cyan Canopy
      ctx.fillStyle = bodyCol;
      ctx.beginPath(); ctx.ellipse(0, 0, pw*1.08, ph*0.95, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#0284c7';
      ctx.beginPath(); ctx.ellipse(0, -ph*0.15, pw*0.75, ph*0.55, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = R*0.009; ctx.stroke();
    } else if(theme === 'gothic'){
      // Wrought-Iron Raven / Torment Cage with Pointed Arch Roof
      ctx.fillStyle = '#450a0a';
      ctx.fillRect(-pw*0.9, -ph*0.8, pw*1.8, ph*1.7);
      ctx.strokeStyle = '#a1a1aa'; ctx.lineWidth = R*0.009;
      ctx.strokeRect(-pw*0.9, -ph*0.8, pw*1.8, ph*1.7);
    } else if(theme === 'nordic'){
      // Miniature Viking Longship Gondola with Round Shield
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-pw, -ph*0.2, pw*2, ph*1.1);
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = R*0.01;
      ctx.strokeRect(-pw, -ph*0.2, pw*2, ph*1.1);
    } else {
      // Aerodynamic Huss Enterprise Enclosed Cage Car (Lower body + upper mesh/glass roof)
      ctx.fillStyle = shade(bodyCol, -0.35);
      ctx.beginPath(); ctx.roundRect(-pw, -ph, pw*2, ph*2, R*0.022); ctx.fill();
      // Interior cabin well
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.roundRect(-pw*0.78, -ph*0.72, pw*1.56, ph*1.35, R*0.014); ctx.fill();
      // Two riders inside the cage car
      [-0.36, 0.36].forEach((sx, j) => {
        ctx.fillStyle = shirtCols[(k + j*2) % 6];
        ctx.beginPath(); ctx.arc(sx*pw, ph*0.12, R*0.022, 0, TAU); ctx.fill();
        ctx.fillStyle = '#fde4c8';
        ctx.beginPath(); ctx.arc(sx*pw, -ph*0.22, R*0.016, 0, TAU); ctx.fill();
      });
      // Lower colored fiberglass shell + overhead protective cage bars
      ctx.fillStyle = bodyCol;
      ctx.fillRect(-pw*0.95, ph*0.18, pw*1.9, ph*0.82);
      ctx.strokeStyle = PAL.cage; ctx.lineWidth = R*0.008;
      ctx.beginPath(); ctx.roundRect(-pw, -ph, pw*2, ph*2, R*0.022); ctx.stroke();
      [-0.45, 0, 0.45].forEach(bx => {
        ctx.beginPath(); ctx.moveTo(bx*pw, -ph); ctx.lineTo(bx*pw, ph*0.18); ctx.stroke();
      });
    }
    ctx.restore();
  };

  // 5. Build & Depth-Sort All 12 Spokes, Rim Segments, Theme Accents & Gondolas
  // First draw the continuous 3D Outer Wheel Rim & Inner Structural Ring
  const drawWheelRim = (rad, col, lw) => {
    ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineJoin = 'round';
    ctx.beginPath();
    for(let i=0; i<=64; i++){
      const q = rim3(i/64*TAU, rad);
      const p = P(q[0], q[1], q[2]);
      i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]);
    }
    ctx.closePath(); ctx.stroke();
  };

  // Theme-specific outer rim teeth (Sawteeth for Frontier, Cog teeth for Alps/Bavarian, Gothic arches for Gothic)
  if(theme === 'frontier' || theme === 'alps' || theme === 'bavarian'){
    const nTeeth = theme === 'frontier' ? 36 : 28;
    ctx.fillStyle = theme === 'frontier' ? '#cbd5e1' : PAL.trim;
    for(let i=0; i<nTeeth; i++){
      const a0 = spin + i/nTeeth*TAU, a1 = a0 + TAU/nTeeth*0.55, am = (a0+a1)*0.5;
      const p0 = P(...rim3(a0, Rw)), p1 = P(...rim3(a1, Rw)), pm = P(...rim3(am, Rw*1.09));
      poly([p0, pm, p1], ctx.fillStyle, PAL.pier, R*0.005);
    }
  } else if(theme === 'gothic'){
    // Pointed gothic rose-window tracery arches between the 12 spokes
    for(let k=0; k<N; k++){
      const a0 = spin + k*TAU/N, a1 = spin + (k+1)*TAU/N, am = (a0+a1)*0.5;
      const p0 = P(...rim3(a0, Rw*0.92)), p1 = P(...rim3(a1, Rw*0.92)), pm = P(...rim3(am, Rw*0.72));
      line(p0, pm, '#991b1b', R*0.014);
      line(p1, pm, '#991b1b', R*0.014);
    }
  }

  // Outer & Inner Wheel Rings
  drawWheelRim(Rw, shade(PAL.rim, -0.25), R*0.044);
  drawWheelRim(Rw, PAL.rim, R*0.026);
  drawWheelRim(Rw*0.64, PAL.rimIn, R*0.020);

  // Collect all 12 radial spokes & outer gondolas for back-to-front depth sorting
  const items = [];
  const hubKey = Yh + Zh * 0.85;

  for(let k=0; k<N; k++){
    const th = spin + k * TAU / N;
    const R3 = rim3(th, Rw);
    const M3 = rim3(th, Rw*0.64);
    // Gondola hangs slightly outside and below/forward of the rim hanger
    const G3 = rim3(th, Rw + R*0.055, R*0.02);
    const key = R3[0]*0.35 + R3[1] + R3[2]*0.85;

    items.push({
      key,
      draw: () => {
        const pR = P(...R3), pM = P(...M3);
        // Main structural radial spoke from hub to rim
        line(hubCenter, pR, shade(PAL.sp1, -0.3), R*0.036);
        line(hubCenter, pR, (k%2===0) ? PAL.sp1 : PAL.sp2, R*0.022);

        // Theme-specific spoke embellishments
        if(theme === 'classic' || theme === 'space' || theme === 'fiesta'){
          // Chasing neon light dots along each spoke
          [0.35, 0.55, 0.78].forEach((f, dIdx) => {
            const dp = lerp(hubCenter, pR, f);
            ell(dp, R*0.010, R*0.010, (k+dIdx)%2 ? '#fff3b0' : PAL.trim);
          });
        } else if(theme === 'medieval' || theme === 'nordic'){
          // Heraldic shield or Viking round shield mounted at mid-spoke M3
          ell(pM, R*0.024, R*0.024, (k%2===0) ? PAL.pod1 : PAL.pod2, PAL.trim, R*0.006);
        }

        // Rim hanger yoke & pivoting enclosed cage gondola
        const pG = P(...G3);
        line(pR, pG, PAL.trim, R*0.018);
        drawGondolaPod(k, th, G3);
      }
    });
  }

  items.sort((a,b) => a.key - b.key);

  // Pass A: Back-half spokes & gondolas
  items.filter(it => it.key < hubKey).forEach(it => it.draw());

  // 6. Central 3D Wheel Hub & Bespoke Themed Hub Emblem (using normal vector nw for 3D depth!)
  const hBack = P(-nw[0]*R*0.045, Yh - nw[1]*R*0.045, Zh - nw[2]*R*0.045);
  const hFront = P(nw[0]*R*0.045, Yh + nw[1]*R*0.045, Zh + nw[2]*R*0.045);
  line(hBack, hFront, shade(PAL.hub, -0.35), R*0.14);
  ell(hFront, R*0.082, R*0.082*(0.48 + 0.52*sa), PAL.hub, PAL.trim, R*0.012);

  // Theme-specific Hub Centerpiece on hFront
  const hx = hFront[0], hy = hFront[1];
  if(theme === 'classic'){
    // 8-Point Golden Circus Starburst Hub
    for(let s=0; s<8; s++){
      const a = spin + s*TAU/8;
      line(hFront, [hx+Math.cos(a)*R*0.095, hy+Math.sin(a)*R*0.095], '#fef08a', R*0.014);
    }
    ell(hFront, R*0.042, R*0.042, '#e11d48', '#fffbeb', R*0.007);
  } else if(theme === 'jungle' || theme === 'fiesta'){
    // Sculpted Golden Mayan / Aztec Sun Mask Hub
    ell(hFront, R*0.065, R*0.065, '#facc15', '#78350f', R*0.008);
    ell([hx-R*0.02, hy-R*0.01], R*0.011, R*0.011, '#137a70');
    ell([hx+R*0.02, hy-R*0.01], R*0.011, R*0.011, '#137a70');
    ell([hx, hy+R*0.018], R*0.016, R*0.010, '#dc2626');
  } else if(theme === 'space'){
    // Pulsing Cyan Tokamak Plasma Core Hub
    ell(hFront, R*0.062, R*0.062, '#0f172a', '#22d3ee', R*0.010);
    ell(hFront, R*0.032, R*0.032, '#22d3ee');
  } else if(theme === 'alps'){
    // White & Gold Alpine Edelweiss Flower Hub
    for(let s=0; s<6; s++){
      const a = spin + s*TAU/6;
      ell([hx+Math.cos(a)*R*0.042, hy+Math.sin(a)*R*0.042], R*0.018, R*0.018, '#f8fafc');
    }
    ell(hFront, R*0.026, R*0.026, '#facc15');
  } else {
    ell([hx-R*0.018, hy-R*0.018], R*0.028, R*0.028, shade(PAL.hub, 0.38));
  }

  // Pass B: Front-half spokes & gondolas (drawn in front of the central hub)
  items.filter(it => it.key >= hubKey).forEach(it => it.draw());
}
/* ===== END SPRITE CODE ===== */
return drawEnterprise;
})();
window.drawEnterprise = EnterpriseSkinPack;
const FlyerSkinPack = (() => {
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
    ctx.lineTo(cx+R*Math.cos(a), cy+R*Math.sin(a)*0.58);}
  ctx.closePath();
}

/* ===== FLYER RIDE SKIN METADATA (UNTHEMED + 11 HEAVY/IMMERSIVE SKINS) ===== */
const FLYER_SKINS = {
  unthemed: {id:'unthemed', label:'Unthemed (Tier 0–2)', name:'County-Fair Aero-Jets',        sub:'Steel Control Drum & Twin-Fin Jet Pods',          hex:'#cbd5e1', border:'#38bdf8'},
  classic:  {id:'classic',  label:'Classic Midway',      name:'Jumbo the Flying Elephant',    sub:'Baroque Circus Drum & Flapping-Ear Elephants',    hex:'#cbb07c', border:'#e11d48'},
  jungle:   {id:'jungle',   label:'Jungle',              name:'Totem Toucans & Macaws',       sub:'Mayan Sun Pillar & Feathered Tropical Birds',     hex:'#587c48', border:'#2fbf9a'},
  western:  {id:'western',  label:'Wild West',           name:'Dynamite Barnstormers',        sub:'Water-Tower Hub & TNT Rocket-Biplanes',           hex:'#c99a62', border:'#b91c1c'},
  frontier: {id:'frontier', label:'Frontier',            name:'Soaring Bald Eagles',          sub:'Carved Cedar Totem & Winged Timber Eagles',       hex:'#7d955d', border:'#566e42'},
  space:    {id:'space',    label:'Space',               name:'Astro-Orbiter Starfighters',   sub:'Orbital Radar Tower & Delta-Wing Rocket Jets',    hex:'#334155', border:'#0ea5e9'},
  gothic:   {id:'gothic',   label:'Gothic',              name:'Gargoyle & Vampire Flyers',    sub:'Obsidian Belfry Spire & Winged Stone Gargoyles',  hex:'#3b3345', border:'#991b1b'},
  medieval: {id:'medieval', label:'Medieval',            name:'Royal Dragon Riders',          sub:'Wizard Keep Turret & Winged Fantasy Wyverns',     hex:'#6c8c58', border:'#eab308'},
  alps:     {id:'alps',     label:'Alps',                name:'Alpine Rescue Ski-Planes',     sub:'Chalet Cuckoo-Clock Tower & Red Ski-Biplanes',    hex:'#a8c5d6', border:'#0284c7'},
  fiesta:   {id:'fiesta',   label:'Fiesta',              name:'Alebrije Spirit Flyers',       sub:'Talavera Sun Kiosk & Painted Winged Jaguars',     hex:'#d99b52', border:'#e11d48'},
  nordic:   {id:'nordic',   label:'Nordic',              name:'Asgardian Sky-Drakkars',       sub:'Runic Stave Pillar & Flying Viking Longships',    hex:'#4d6b63', border:'#d97706'},
  bavarian: {id:'bavarian', label:'Bavarian',            name:'Oktoberfest Zeppelin Flyers',  sub:'Maibaum Brewery Cupola & Copper Dirigibles',      hex:'#769958', border:'#2563eb'}
};
FLYER_SKINS.german = FLYER_SKINS.bavarian;

/* ===== SPRITE CODE: copy this block into engine.js ===== */
/**
 * drawFlyerRide(ctx, cx, cy, R, opts)
 *  opts.accent        : Land / chain accent color (default '#38bdf8')
 *  opts.themeId       : 'classic'|'jungle'|'western'|'wildwest'|'frontier'|'space'|'gothic'|'medieval'|'alps'|'fiesta'|'nordic'|'bavarian'|'german'
 *  opts.rideThemeTier : 0..4 (<=2 draws Standard Unthemed; >=3 draws Heavy/Immersive Themed Flyer)
 *  opts.t             : spin angle in radians
 *  opts.fly           : 0..1 how high the arms lift the vehicles (0 = low loading, 1 = high flight)
 *  opts.tm            : continuous time in seconds for wing/propeller/flag animation
 *  opts.flip          : true when called under horizontal mirror
 *  opts.tile          : draw the hex tile background (default true)
 */
function drawFlyerRide(ctx, cx, cy, R, o={}){
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTheme = String(o.themeId || o.theme || 'unthemed').toLowerCase();
  if(rawTheme === 'wildwest' || rawTheme === 'wild_west') rawTheme = 'western';
  if(rawTheme === 'german') rawTheme = 'bavarian';
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
  const P = (X,Y,Z) => [cx + (X - Y)*0.7, cyB + (X + Y)*0.35 - Z];
  const g = (rr,a,Z) => P(rr*Math.cos(a), rr*Math.sin(a), Z);
  const lerp = (a,b,t) => [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t];

  const line = (a,b,c,w) => {
    ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
  };
  const poly = (pts,fill,stroke,lw) => {
    ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.lineJoin='round';ctx.stroke();}
  };
  const disc = (p,rr,c,stroke,lw) => {
    ctx.beginPath();ctx.arc(p[0],p[1],Math.max(0.5,rr),0,TAU);
    if(c){ctx.fillStyle=c;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.stroke();}
  };
  const ell = (p,rr,fill,stroke,lw) => {
    ctx.beginPath();ctx.ellipse(p[0],p[1],Math.max(0.5,0.99*rr),Math.max(0.5,0.495*rr),0,0,TAU);
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.009;ctx.stroke();}
  };
  /**
   * 3D Isometric Cylinder from Z to Z+h:
   *  - Bottom curved base is filled & stroked so when an upper cylinder sits on top of a wider collar,
   *    its bottom curved seam cleanly hugs the collar instead of the collar cutting across the pillar!
   */
  const cyl = (rr,Z,h,col,rimCol,drawTop=true) => {
    const pB = P(0,0,Z), pT = P(0,0,Z+h), rx = 0.99*rr, ry = 0.495*rr;
    ctx.beginPath();
    ctx.moveTo(pB[0]-rx, pB[1]);
    ctx.lineTo(pT[0]-rx, pT[1]);
    ctx.lineTo(pT[0]+rx, pT[1]);
    ctx.lineTo(pB[0]+rx, pB[1]);
    ctx.ellipse(pB[0], pB[1], rx, ry, 0, 0, Math.PI);
    ctx.closePath();
    const gr = ctx.createLinearGradient(pB[0]-rx, 0, pB[0]+rx, 0);
    gr.addColorStop(0, shade(col, 0.22));
    gr.addColorStop(0.38, col);
    gr.addColorStop(1, shade(col, -0.35));
    ctx.fillStyle = gr;
    ctx.fill();
    if(rimCol){
      ctx.strokeStyle = rimCol; ctx.lineWidth = R*0.008;
      ctx.beginPath(); ctx.ellipse(pB[0], pB[1], rx, ry, 0, 0, Math.PI); ctx.stroke();
    }
    if(drawTop){
      ell(pT, rr, shade(col, 0.18), rimCol, R*0.008);
    }
  };
  const cone = (rr,Z,h,col,rimCol) => {
    const p = P(0,0,Z), rx = 0.99*rr, ry = 0.495*rr, tp = [p[0], p[1]-h];
    const gr = ctx.createLinearGradient(p[0]-rx,0,p[0]+rx,0);
    gr.addColorStop(0, shade(col,0.28)); gr.addColorStop(0.45, col); gr.addColorStop(1, shade(col,-0.38));
    ctx.beginPath(); ctx.moveTo(p[0]-rx,p[1]); ctx.lineTo(tp[0],tp[1]); ctx.lineTo(p[0]+rx,p[1]);
    ctx.ellipse(p[0],p[1],rx,ry,0,0,Math.PI); ctx.closePath();
    ctx.fillStyle = gr; ctx.fill();
    if(rimCol){
      ctx.strokeStyle = rimCol; ctx.lineWidth = R*0.008;
      ctx.beginPath(); ctx.ellipse(p[0],p[1],rx,ry,0,0,Math.PI); ctx.stroke();
    }
    return tp;
  };
  // Helper to wrap vertical stripes around only the visible front half (a in [-PI/4 .. 3*PI/4]) of a cylinder from Z0 to Z1
  const cylStripes = (rr, Z0, Z1, nStripes, colA, colB, rotOff=0) => {
    for(let i=0; i<nStripes; i++){
      const a0 = -Math.PI*0.25 + i*Math.PI/nStripes, a1 = a0 + Math.PI/nStripes;
      const idx = Math.floor((i + rotOff*nStripes/Math.PI) % 2 + 2) % 2;
      poly([g(rr,a0,Z0), g(rr,a1,Z0), g(rr,a1,Z1), g(rr,a0,Z1)], idx===0 ? colA : colB);
    }
    // Re-draw curved bottom seam of the striped band
    const pB = P(0,0,Z0);
    ctx.strokeStyle = 'rgba(15,23,42,0.35)'; ctx.lineWidth = R*0.007;
    ctx.beginPath(); ctx.ellipse(pB[0], pB[1], 0.99*rr, 0.495*rr, 0, 0, Math.PI); ctx.stroke();
  };

  // 1. Optional Hex Tile Base
  if(o.tile !== false){
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = theme === 'unthemed' ? '#cbd5e1' : skin.hex;
    ctx.fill();
    ctx.lineWidth = Math.max(2, R*0.055);
    ctx.strokeStyle = accent;
    ctx.stroke();
  }

  // 2. Soft Ambient Shadow + COMPACT Central Turret Plinth ONLY (NO Giant r(0.8) Concrete Slab!)
  const z0 = r(0.025);
  const p0 = P(0, 0, 0);
  ell([p0[0]+fl*r(0.05), p0[1]+r(0.02)], r(0.36), 'rgba(15,23,42,0.24)');

  const plinthCols = {
    unthemed: ['#94a3b8', '#475569'],
    classic:  ['#f5c542', '#b91c1c'],
    jungle:   ['#8e8a72', '#2fbf9a'],
    western:  ['#8a5a33', '#451a03'],
    frontier: ['#6b4a2b', '#eab308'],
    space:    ['#0f172a', '#22d3ee'],
    gothic:   ['#27272a', '#991b1b'],
    medieval: ['#64748b', '#f5c542'],
    alps:     ['#e2e8f0', '#dc2626'],
    fiesta:   ['#e11d48', '#facc15'],
    nordic:   ['#451a03', '#f59e0b'],
    bavarian: ['#f8fafc', '#2563eb']
  }[theme] || ['#94a3b8', '#475569'];

  cyl(r(0.26), 0, z0, plinthCols[0], plinthCols[1]);
  ell(P(0,0,z0), r(0.22), shade(plinthCols[0], 0.14), plinthCols[1], R*0.008);

  // 3. Calculate 8 Sweeping Hydraulic Arms & Flying Vehicles
  const N = 8;
  const La = r(0.50);          // Sweeping arm length
  const Zhub = r(0.235);       // Rotating arm-collar center height on the central drum
  const Rcol = r(0.195);       // Radius of the rotating central arm-hub collar
  const pods = [];

  const podPalettes = {
    unthemed: [accent, '#38bdf8', '#f59e0b', '#ef4444'],
    classic:  ['#94a3b8', '#a1a1aa', '#cbd5e1', '#94a3b8'], // Adorable grey circus elephants!
    jungle:   ['#ef4444', '#10b981', '#f59e0b', '#06b6d4'], // Scarlet Macaws & Emerald Toucans
    western:  ['#b45309', '#9a3412', '#78350f', '#a16207'], // Barnstormer biplanes
    frontier: ['#5a3b22', '#4a3320', '#6b4a2b', '#3e2723'], // Soaring Bald Eagles
    space:    ['#e2e8f0', '#38bdf8', '#c084fc', '#22d3ee'], // Chrome & Neon Star Cruisers
    gothic:   ['#3f3f46', '#52525b', '#27272a', '#450a0a'], // Stone Gargoyles & Vampire Bats
    medieval: ['#b91c1c', '#1d4ed8', '#15803d', '#7e22ce'], // Royal Wyvern Dragons
    alps:     ['#dc2626', '#0284c7', '#16a34a', '#f59e0b'], // Alpine Rescue Ski-Planes
    fiesta:   ['#e11d48', '#0d9488', '#f59e0b', '#9333ea'], // Oaxacan Alebrijes
    nordic:   ['#78350f', '#991b1b', '#451a03', '#1e3a8a'], // Sky-Drakkar Longships
    bavarian: ['#d97706', '#2563eb', '#b91c1c', '#0d9488']  // Oktoberfest Zeppelins
  }[theme];

  for(let k=0; k<N; k++){
    const a = rot + k * TAU / N;
    // Independent per-vehicle bobbing wave when flying (just like Dumbo's guest-controlled levers!)
    const wave = 0.14 * Math.sin(rot*2.0 + k*1.57);
    const effFly = Math.max(0.02, Math.min(1.0, fly * (0.86 + wave)));
    const el = -0.18 + effFly * 0.72; // Arm elevation angle in radians
    const ce = Math.cos(el), se = Math.sin(el);
    // 3D Arm Tip (Vehicle Mount Point)
    const E = [La*ce*Math.cos(a), La*ce*Math.sin(a), Zhub + La*se];
    // Root socket on the outer perimeter of the Rotating Hub Collar (Rcol) so front arms never clip through the upper pillar!
    const P0 = [Rcol*0.92*Math.cos(a), Rcol*0.92*Math.sin(a), Zhub];
    pods.push({k, a, el, effFly, E, P0, key: E[0] + E[1], col: podPalettes[k % 4]});
  }

  // 4. Cast Individual Ground Shadows Underneath the 8 Flying Vehicles
  pods.forEach(p => {
    const sh = P(p.E[0], p.E[1], 0);
    const sc = Math.max(0.55, 1.0 - p.E[2]/(R*0.9));
    ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
    ctx.beginPath();
    ctx.ellipse(sh[0] + fl*p.E[2]*0.15, sh[1] + p.E[2]*0.08, r(0.115)*sc, r(0.055)*sc, 0, 0, TAU);
    ctx.fill();
  });

  // Helper: Draw a single Sweeping Hydraulic Arm + Bespoke Themed Flying Vehicle at Tip E
  const armColors = {
    unthemed: ['#64748b', '#cbd5e1', accent],
    classic:  ['#b91c1c', '#f5c542', '#fffbeb'],
    jungle:   ['#5a4028', '#eab308', '#2fbf9a'],
    western:  ['#451a03', '#8a5a33', '#b91c1c'],
    frontier: ['#3e2723', '#6b4a2b', '#eab308'],
    space:    ['#0f172a', '#e2e8f0', '#22d3ee'],
    gothic:   ['#09090b', '#3f3f46', '#dc2626'],
    medieval: ['#451a03', '#f5c542', '#b91c1c'],
    alps:     ['#475569', '#f8fafc', '#dc2626'],
    fiesta:   ['#9a3412', '#f59e0b', '#0d9488'],
    nordic:   ['#290f02', '#78350f', '#f59e0b'],
    bavarian: ['#78350f', '#f8fafc', '#2563eb']
  }[theme];

  const drawArmAndVehicle = p => {
    const Hpiv = P(p.P0[0], p.P0[1], Zhub);
    const Hpist = P(p.P0[0]*0.82, p.P0[1]*0.82, Zhub - r(0.048));
    const Ep = P(p.E[0], p.E[1], p.E[2]);
    const midArm = lerp(Hpiv, Ep, 0.44);

    // Root socket boss on the hub collar
    disc(Hpiv, r(0.022), armColors[0], armColors[2], R*0.005);

    // 1. Lower Hydraulic Lift Cylinder Rod (from lower collar to mid-arm)
    line(Hpist, midArm, '#475569', r(0.022));
    line(lerp(Hpist, midArm, 0.4), midArm, '#e2e8f0', r(0.011));

    // 2. Main Sweeping Radial Lift Arm with Fairground Accent Collar
    line(Hpiv, Ep, armColors[0], r(0.046));
    line(Hpiv, Ep, armColors[1], r(0.026));
    line(lerp(Hpiv, Ep, 0.20), lerp(Hpiv, Ep, 0.54), armColors[2], r(0.030));
    disc(Ep, r(0.020), armColors[2], armColors[0], R*0.006);

    // 3. UPRIGHT-LOCKED 3D Tangent Transform for Vehicle & Riders!
    // Screen tangent vector (tx, ty) along the circular flight path:
    const tx = (-Math.sin(p.a) - Math.cos(p.a)) * 0.70;
    const ty = (-Math.sin(p.a) + Math.cos(p.a)) * 0.35;
    const tl = Math.hypot(tx, ty) || 1;
    // Horizontal facing direction (+1 = moving right on screen, -1 = moving left on screen)
    const dir = (tx >= 0) ? 1 : -1;
    // Foreshortening scale along the horizontal axis (clamped so end-on turns still show a plump 3D profile)
    const scX = Math.max(0.56, Math.abs(tx) / 0.72);
    // Vertical pitch slope along the flight path + slight nose-up climb angle when lifted
    const slopeY = Math.max(-0.34, Math.min(0.34, (ty / tl) * 0.42 - p.el * 0.16));

    const C = [Ep[0], Ep[1] - r(0.024)];
    const col = p.col;
    const flap = Math.sin(tm*5.5 + p.k*1.2) * r(0.025);

    ctx.save();
    // CRITICAL FIX: ctx.transform keeps local -Y ALWAYS pointing straight UP on screen!
    // Local +X points forward along the direction of travel (left or right), and local -Y is ALWAYS skyward.
    // Vehicles and riders NEVER flip upside-down at the bottom of the tile!
    ctx.transform(dir * scX, slopeY, 0, 1, C[0], C[1]);

    const L = r(0.138);
    const H = r(0.064);

    // --- BACK WING / FAR EAR (Drawn behind the fuselage & riders) ---
    if(theme === 'classic'){
      // Far Elephant Ear
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath(); ctx.ellipse(-L*0.05, -H*0.65 - flap*0.6, L*0.42, H*0.52, -0.25, 0, TAU); ctx.fill();
    } else if(theme === 'jungle' || theme === 'frontier' || theme === 'gothic' || theme === 'medieval' || theme === 'fiesta'){
      // Far Feathered / Dragon / Bat Wing
      const wCol = theme==='jungle' ? '#10b981' : theme==='frontier' ? '#3e2723' : theme==='gothic' ? '#18181b' : shade(col, -0.25);
      poly([[0, -H*0.2], [-L*0.45, -H*1.35 - flap], [L*0.25, -H*0.95 - flap*0.5]], wCol, '#0f172a', R*0.006);
    } else if(theme === 'space'){
      // Far Swept Starfighter Delta Wing + Far Wingtip Laser/Thruster Pod
      poly([[-L*0.42, -H*0.18], [-L*0.72, -H*0.95], [L*0.18, -H*0.35]], '#334155', '#22d3ee', R*0.006);
      line([-L*0.85, -H*0.95], [-L*0.35, -H*0.95], '#22d3ee', R*0.012);
    } else if(theme === 'unthemed' || theme === 'western' || theme === 'alps'){
      // Far Swept Delta Wing / Biplane Upper Wing
      poly([[-L*0.25, -H*0.2], [-L*0.55, -H*0.95], [L*0.15, -H*0.55]], shade(col, -0.25), '#1e293b', R*0.006);
    }

    // --- MAIN FUSELAGE / CREATURE BODY ---
    if(theme === 'classic'){
      // Adorable Plump Grey Circus Elephant Body + Upturned Trunk + Red/Gold Saddle Blanket!
      ctx.fillStyle = '#64748b';
      ctx.beginPath(); ctx.ellipse(0, H*0.15, L*0.92, H*0.88, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath(); ctx.ellipse(0, 0, L*0.90, H*0.85, 0, 0, TAU); ctx.fill();
      // Elephant Head & Joyfully Curled Trunk at Front (+L)
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath(); ctx.arc(L*0.78, -H*0.18, H*0.68, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = H*0.36; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(L*1.15, -H*0.15); ctx.quadraticCurveTo(L*1.58, -H*0.25, L*1.45, -H*0.85); ctx.stroke();
      // Little yellow circus hat on elephant's head & eye
      poly([[L*0.62, -H*0.75], [L*1.02, -H*0.75], [L*0.82, -H*1.45]], '#facc15', '#b91c1c', R*0.007);
      disc([L*0.96, -H*0.28], R*0.011, '#0f172a');
      // Red & gold circus saddle blanket
      ctx.fillStyle = '#e11d48';
      ctx.strokeStyle = '#f5c542'; ctx.lineWidth = R*0.01;
      ctx.beginPath(); ctx.roundRect(-L*0.48, -H*0.55, L*0.88, H*0.95, R*0.015); ctx.fill(); ctx.stroke();
    }
    else if(theme === 'space'){
      // Sleek Retro-Futuristic Rocket Starfighter / Viper (Sharp Needle Nose Cone, Angular Hull, Twin Ion Thrusters — ZERO Fish!)
      // 1. Rear Twin-Ion Thruster Nozzles & Glowing Cyan/Magenta Plasma Exhaust Plume
      poly([[-L*1.02, -H*0.28], [-L*1.72, 0], [-L*1.02, H*0.32]], '#22d3ee');
      poly([[-L*1.02, -H*0.14], [-L*1.42, 0], [-L*1.02, H*0.16]], '#ffffff');
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-L*1.08, -H*0.34, L*0.24, H*0.68);
      // 2. Tall Swept Dorsal Starfighter Tail Fin
      poly([[-L*0.42, -H*0.25], [-L*1.08, -H*1.32], [-L*0.92, -H*0.10]], '#0284c7', '#22d3ee', R*0.007);
      // 3. Faceted Metallic Starfighter Fuselage & Sharp Pointed Nose Cone (+L)
      poly([
        [-L*0.92, -H*0.46],
        [ L*0.52, -H*0.46],
        [ L*1.58,  0.00],
        [ L*0.55,  H*0.56],
        [-L*0.92,  H*0.52]
      ], '#e2e8f0', '#334155', R*0.008);
      // Lower shaded hull chine & glowing neon plasma racing stripe
      poly([
        [-L*0.92,  0.05*H],
        [ L*1.58,  0.00],
        [ L*0.55,  H*0.56],
        [-L*0.92,  H*0.52]
      ], '#94a3b8');
      // Chrome / Neon nose cone tip & forward laser pitot spike
      poly([[L*0.85, -H*0.26], [L*1.58, 0], [L*0.85, H*0.28]], col, '#0f172a', R*0.006);
      line([L*1.55, 0], [L*1.85, 0], '#22d3ee', R*0.010);
      line([-L*0.85, 0], [L*0.82, 0], '#22d3ee', R*0.011);
    }
    else if(theme === 'jungle'){
      // Vibrant Scarlet Macaw / Emerald Toucan Body + Giant Curved Toucan Beak & Tail Feathers
      poly([[-L*0.75, 0], [-L*1.45, -H*0.55], [-L*1.35, H*0.35]], '#facc15', '#b91c1c', R*0.006);
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(0, 0, L*0.92, H*0.82, 0, 0, TAU); ctx.fill();
      // Oversized Tropical Curved Beak at Front (+L)
      poly([[L*0.72, -H*0.45], [L*1.55, -H*0.15], [L*1.35, H*0.35], [L*0.72, H*0.25]], '#f59e0b', '#1e293b', R*0.007);
      poly([[L*1.25, -H*0.26], [L*1.55, -H*0.15], [L*1.35, H*0.35]], '#18181b');
      disc([L*0.78, -H*0.22], R*0.013, '#ffffff', '#0f172a', R*0.005);
    }
    else if(theme === 'frontier'){
      // Majestic Soaring Bald Eagle (Dark Umber Body, Pure White Feathered Head, Golden Hooked Beak)
      poly([[-L*0.75, 0], [-L*1.38, -H*0.42], [-L*1.32, H*0.32]], '#f8fafc', '#451a03', R*0.006);
      ctx.fillStyle = '#4a3320';
      ctx.beginPath(); ctx.ellipse(-L*0.05, 0, L*0.92, H*0.80, 0, 0, TAU); ctx.fill();
      // White feathered eagle head
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath(); ctx.arc(L*0.78, -H*0.12, H*0.62, 0, TAU); ctx.fill();
      // Golden hooked eagle beak
      poly([[L*1.18, -H*0.32], [L*1.58, -H*0.05], [L*1.35, H*0.28], [L*1.12, H*0.10]], '#f59e0b', '#78350f', R*0.006);
      disc([L*0.92, -H*0.20], R*0.011, '#0f172a');
    }
    else if(theme === 'medieval' || theme === 'gothic' || theme === 'fiesta'){
      // Winged Wyvern Dragon / Stone Gargoyle / Oaxacan Alebrije Jaguar-Dragon!
      // Spiked tail at rear (-L)
      ctx.strokeStyle = shade(col, -0.2); ctx.lineWidth = H*0.32;
      ctx.beginPath(); ctx.moveTo(-L*0.75, 0); ctx.quadraticCurveTo(-L*1.35, -H*0.65, -L*1.55, -H*0.15); ctx.stroke();
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(0, 0, L*0.92, H*0.80, 0, 0, TAU); ctx.fill();
      // Fiesta Alebrije folk dots
      if(theme === 'fiesta'){
        [-0.35, 0.05, 0.38].forEach(dx => disc([dx*L, H*0.25], R*0.012, '#fde047'));
      }
      // Sculpted Dragon/Gargoyle Head, Horns & Snout at Front (+L)
      poly([[L*0.65, -H*0.48], [L*1.42, -H*0.25], [L*1.35, H*0.25], [L*0.65, H*0.32]], col, shade(col,-0.35), R*0.007);
      line([L*0.78, -H*0.42], [L*0.48, -H*1.05], '#f5c542', R*0.012); // Swept horn
      disc([L*0.98, -H*0.22], R*0.012, theme==='gothic' ? '#ef4444' : '#fde047');
    }
    else if(theme === 'nordic'){
      // Miniature Flying Viking Dragon Longship with Shields & Golden Prow!
      ctx.fillStyle = '#5a361a';
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = R*0.009;
      ctx.beginPath(); ctx.ellipse(0, H*0.1, L*1.02, H*0.76, 0, 0, TAU); ctx.fill(); ctx.stroke();
      // Curved golden dragon head prow at front (+L) & curled tail at stern (-L)
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = R*0.022;
      ctx.beginPath(); ctx.moveTo(L*0.85, 0); ctx.quadraticCurveTo(L*1.35, -H*0.5, L*1.15, -H*1.25); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-L*0.85, 0); ctx.quadraticCurveTo(-L*1.25, -H*0.4, -L*1.05, -H*1.05); ctx.stroke();
      // Row of painted Viking shields along the hull side
      [-0.52, -0.18, 0.18, 0.52].forEach((sx, si) => {
        disc([sx*L, H*0.28], R*0.021, si%2 ? '#b91c1c' : '#0284c7', '#fde047', R*0.005);
      });
    }
    else if(theme === 'bavarian'){
      // Steampunk Oktoberfest Zeppelin (Underslung Gondola + Overhead Copper/Striped Blimp Envelope!)
      // Overhead blimp balloon envelope
      const bY = -H * 1.65;
      ctx.fillStyle = '#fef3c7';
      ctx.strokeStyle = '#d97706'; ctx.lineWidth = R*0.01;
      ctx.beginPath(); ctx.ellipse(0, bY, L*1.08, H*0.78, 0, 0, TAU); ctx.fill(); ctx.stroke();
      // Bavarian blue stripe & tail fins on blimp
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(-L*0.85, bY - H*0.18, L*1.7, H*0.36);
      poly([[-L*0.85, bY], [-L*1.28, bY-H*0.55], [-L*1.15, bY+H*0.45]], '#b91c1c', '#f59e0b', R*0.006);
      // Suspension struts down to passenger gondola
      line([-L*0.45, bY+H*0.65], [-L*0.35, -H*0.2], '#78350f', R*0.01);
      line([ L*0.45, bY+H*0.65], [ L*0.35, -H*0.2], '#78350f', R*0.01);
      // Underslung oak-and-brass gondola
      ctx.fillStyle = '#92400e';
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = R*0.009;
      ctx.beginPath(); ctx.ellipse(0, H*0.15, L*0.78, H*0.65, 0, 0, TAU); ctx.fill(); ctx.stroke();
    }
    else {
      // Unthemed / Space / Western / Alps: Sleek Jet Pod, Star Cruiser, or Biplane Fuselage
      // Rear vertical tailfin
      poly([[-L*0.65, -H*0.1], [-L*1.25, -H*1.05], [-L*0.95, H*0.25]], theme==='space' ? '#22d3ee' : shade(col,-0.22), '#0f172a', R*0.007);
      //Glowing rear thruster flame (Space) or TNT rocket (Western)
      if(theme === 'space' || theme === 'western'){
        poly([[-L*0.95, -H*0.15], [-L*1.55, 0], [-L*0.95, H*0.25]], theme==='space' ? '#22d3ee' : '#f97316');
      }
      ctx.fillStyle = shade(col, -0.32);
      ctx.beginPath(); ctx.ellipse(0, H*0.16, L*0.98, H*0.82, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(0, 0, L*0.98, H*0.80, 0, 0, TAU); ctx.fill();
      // Racing stripe along fuselage
      ctx.strokeStyle = theme==='space' ? '#22d3ee' : '#f8fafc';
      ctx.lineWidth = R*0.012;
      ctx.beginPath(); ctx.moveTo(-L*0.75, H*0.12); ctx.lineTo(L*0.82, H*0.12); ctx.stroke();
      // Spinning nose propeller for Western & Alps biplanes; landing skis for Alps
      if(theme === 'western' || theme === 'alps'){
        const prLen = H * 0.95 * Math.cos(tm*18 + p.k);
        line([L*1.02, -H*0.25 - prLen], [L*1.02, -H*0.25 + prLen], '#e2e8f0', R*0.012);
        disc([L*1.02, -H*0.25], R*0.014, '#f59e0b');
      }
      if(theme === 'alps'){
        line([-L*0.65, H*0.88], [L*0.75, H*0.88], '#78350f', R*0.014);
        line([L*0.75, H*0.88], [L*0.95, H*0.62], '#78350f', R*0.014);
      }
    }

    // --- COCKPIT WELL & TWO RIDERS + JOYSTICK CONTROL LEVER ---
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.ellipse(0, -H*0.18, L*0.54, H*0.44, 0, 0, TAU); ctx.fill();
    [-0.24, 0.18].forEach((rx, rIdx) => {
      const px = rx * L, py = -H * 0.35;
      ctx.fillStyle = ['#38bdf8','#ef4444','#22c55e','#facc15','#a855f7','#f97316'][(p.k*2 + rIdx) % 6];
      ctx.fillRect(px - R*0.016, py - R*0.01, R*0.032, R*0.034);
      disc([px, py - R*0.022], R*0.021, '#fde4c8');
    });
    // Chrome altitude control joystick lever at front of cockpit
    line([L*0.38, -H*0.15], [L*0.48, -H*0.62], '#e2e8f0', R*0.008);
    disc([L*0.48, -H*0.62], R*0.010, '#ef4444');

    // --- NEAR WING / FLAPPING FRONT EAR (Drawn in front of the fuselage!) ---
    if(theme === 'classic'){
      // Big Flapping Grey & Pink Circus Elephant Ear!
      ctx.fillStyle = '#cbd5e1';
      ctx.strokeStyle = '#64748b'; ctx.lineWidth = R*0.007;
      ctx.beginPath(); ctx.ellipse(L*0.28, H*0.22 + flap, L*0.48, H*0.62, 0.25, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f472b6';
      ctx.beginPath(); ctx.ellipse(L*0.28, H*0.26 + flap, L*0.32, H*0.42, 0.25, 0, TAU); ctx.fill();
    } else if(theme === 'jungle' || theme === 'frontier' || theme === 'gothic' || theme === 'medieval' || theme === 'fiesta'){
      const wCol = theme==='jungle' ? '#facc15' : theme==='frontier' ? '#5a3b22' : theme==='gothic' ? '#7f1d1d' : shade(col, 0.15);
      poly([[L*0.15, H*0.15], [-L*0.35, H*1.15 + flap], [L*0.45, H*0.75 + flap*0.5]], wCol, '#0f172a', R*0.007);
    } else if(theme === 'space'){
      // Translucent Cyan Bubble Canopy Windscreen + Swept Delta Wing + Glowing Wingtip Thruster Pod
      poly([[L*0.22, -H*0.18], [L*0.65, -H*0.18], [L*0.42, -H*0.58], [L*0.12, -H*0.52]], 'rgba(56,189,248,0.68)', '#e2e8f0', R*0.006);
      poly([[L*0.25, H*0.18], [-L*0.58, H*0.95], [L*0.32, H*0.52]], '#cbd5e1', '#0284c7', R*0.007);
      line([-L*0.72, H*0.95], [-L*0.18, H*0.95], '#e879f9', R*0.014);
    } else if(theme === 'unthemed' || theme === 'western' || theme === 'alps'){
      poly([[L*0.15, H*0.2], [-L*0.45, H*0.92], [L*0.35, H*0.55]], shade(col, 0.18), '#0f172a', R*0.007);
    }

    ctx.restore();
  };

  // Pass A: Draw Back-Half Arms & Flying Vehicles (behind central tower: key < 0)
  pods.filter(p => p.key < 0).sort((u,v) => u.key - v.key).forEach(drawArmAndVehicle);

  // 5. Central Sculpted Hub Drum & Bespoke Themed Tower Crown (at (0,0))
  // CRITICAL PAINTER'S ORDER FIX:
  //   1) Base Plinth (Zbase .. Z1)
  //   2) Lower Pillar Shaft (Z1 .. Zhub - hCol)
  //   3) Rotating Hub Collar Ring (Zhub - hCol .. Zhub + hCol) WITH its top ellipse
  //   4) Upper Pillar Shaft (Zhub + hCol .. Ztop) drawn ON TOP OF the collar's top ellipse!
  //      Because `cyl()` fills and strokes its bottom curved seam at `Zhub + hCol`, the upper pillar
  //      emerges cleanly out of the center of the collar ring instead of the collar cutting across the pillar!
  //   5) Tower Crown / Canopy / Finial (Ztop and above)
  const Zbase = z0;
  const Z1    = Zbase + r(0.055);
  const Zc0   = Zhub - r(0.032);
  const Zc1   = Zhub + r(0.032);
  const Ztop  = r(0.48);

  if(theme === 'unthemed'){
    // 1. Base & Lower Striped Pillar
    cyl(r(0.20), Zbase, r(0.055), '#cbd5e1', '#64748b');
    cyl(r(0.148), Z1, Zc0 - Z1, '#f8fafc', '#94a3b8');
    cylStripes(r(0.150), Z1, Zc0, 8, '#f8fafc', accent, rot*0.5);
    // 2. Rotating Hub Collar Ring
    cyl(Rcol, Zc0, Zc1 - Zc0, accent, '#1e293b', true);
    // 3. Upper Striped Pillar (drawn ON TOP of the collar ring!)
    cyl(r(0.148), Zc1, Ztop - Zc1, '#f8fafc', '#475569');
    cylStripes(r(0.150), Zc1, Ztop, 8, '#f8fafc', accent, rot*0.5);
    // 4. Upper Gallery & Conical Canopy + Pennant
    cyl(r(0.18), Ztop, r(0.045), '#334155', '#f8fafc');
    const ap = cone(r(0.21), Ztop+r(0.045), r(0.19), accent, '#1e293b');
    const ft = P(0,0,Ztop+r(0.32));
    line(ap, ft, '#facc15', R*0.014);
    disc(ft, r(0.026), '#ef4444', '#ffffff', R*0.006);
  }
  else if(theme === 'classic'){
    // 1. Baroque Circus Base & Lower Striped Drum
    cyl(r(0.22), Zbase, r(0.055), '#b91c1c', '#f5c542');
    cyl(r(0.162), Z1, Zc0 - Z1, '#fef08a', '#f5c542');
    cylStripes(r(0.164), Z1, Zc0, 8, '#fffbeb', '#e11d48', rot*0.5);
    // 2. Gold Filigree Hydraulic Hub Collar Ring
    cyl(Rcol, Zc0, Zc1 - Zc0, '#f5c542', '#b45309', true);
    // 3. Upper Striped Circus Drum (emerges cleanly out of the gold collar!)
    cyl(r(0.162), Zc1, Ztop - Zc1, '#fef08a', '#b45309');
    cylStripes(r(0.164), Zc1, Ztop, 8, '#fffbeb', '#e11d48', rot*0.5);
    // 4. Royal Blue Frieze & Striped Big-Top Canopy + Golden Peanut/Ringmaster Finial
    cyl(r(0.205), Ztop, r(0.05), '#1e3a8a', '#f5c542');
    const ap = P(0,0,Ztop+r(0.24));
    for(let i=0; i<12; i++){
      const a0 = rot*0.5 + i*TAU/12, a1 = a0 + TAU/12;
      poly([g(r(0.23),a0,Ztop+r(0.05)), g(r(0.23),a1,Ztop+r(0.05)), ap], i%2 ? '#fffbeb' : '#e11d48', '#f5c542', R*0.005);
    }
    const ft = P(0,0,Ztop+r(0.35));
    line(ap, ft, '#f5c542', R*0.018);
    disc(P(0,0,Ztop+r(0.29)), r(0.036), '#f5c542', '#b45309', R*0.007);
    poly([ft, [ft[0]+r(0.11), ft[1]+r(0.02)], [ft[0], ft[1]+r(0.055)]], '#2563eb', '#f5c542', R*0.006);
  }
  else if(theme === 'space'){
    // 1. Base & Lower Titanium Shaft
    cyl(r(0.22), Zbase, r(0.055), '#0f172a', '#22d3ee');
    cyl(r(0.145), Z1, Zc0 - Z1, '#1e293b', '#38bdf8');
    // 2. Neon-Cyan & Cobalt Rotating Hub Collar
    cyl(Rcol, Zc0, Zc1 - Zc0, '#0284c7', '#22d3ee', true);
    // 3. Upper Titanium Shaft (drawn ON TOP of the collar ring)
    cyl(r(0.145), Zc1, Ztop - Zc1, '#1e293b', '#22d3ee');
    cyl(r(0.18), Ztop, r(0.045), '#0f172a', '#22d3ee');
    // 4. Golden-Brass & Neon-Cyan Celestial Armillary Sphere Crown
    const cSp = P(0, 0, Ztop + r(0.18));
    disc(cSp, r(0.092), '#f59e0b', '#fef08a', R*0.01);
    ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = R*0.016;
    ctx.beginPath(); ctx.ellipse(cSp[0], cSp[1], r(0.22), r(0.09), 0.35, 0, TAU); ctx.stroke();
    ctx.strokeStyle = '#f5c542'; ctx.lineWidth = R*0.014;
    ctx.beginPath(); ctx.ellipse(cSp[0], cSp[1], r(0.19), r(0.15), -0.45, 0, TAU); ctx.stroke();
    disc([cSp[0]+Math.cos(tm*3)*r(0.20), cSp[1]+Math.sin(tm*3)*r(0.08)], r(0.024), '#e879f9', '#ffffff', R*0.005);
    const ft = P(0, 0, Ztop + r(0.36));
    line(cSp, ft, '#e2e8f0', R*0.015);
    disc(ft, r(0.024), '#22d3ee');
  }
  else if(theme === 'jungle' || theme === 'fiesta'){
    // 1. Base & Lower Carved Stone Pillar
    const cShaft = theme==='jungle' ? '#bdb9a0' : '#f59e0b';
    cyl(r(0.22), Zbase, r(0.055), theme==='jungle' ? '#8e8a72' : '#c2410c', '#eab308');
    cyl(r(0.16), Z1, Zc0 - Z1, cShaft, '#78350f');
    // 2. Jade / Turquoise Hub Collar Ring
    cyl(Rcol, Zc0, Zc1 - Zc0, '#0d9488', '#fde047', true);
    // 3. Upper Carved Stone Pillar (drawn ON TOP of the jade collar!)
    cyl(r(0.16), Zc1, Ztop - Zc1, cShaft, '#78350f');
    cyl(r(0.195), Ztop, r(0.05), '#eab308', '#78350f');
    // 4. Radiant Golden Sun/Serpent Crown
    const cSun = P(0, 0, Ztop + r(0.19));
    for(let k=0; k<10; k++){
      const a = tm*1.5 + k*TAU/10;
      line(cSun, [cSun[0]+Math.cos(a)*r(0.16), cSun[1]+Math.sin(a)*r(0.16)], k%2 ? '#f59e0b' : '#ef4444', R*0.018);
    }
    disc(cSun, r(0.095), '#facc15', '#78350f', R*0.01);
    disc([cSun[0]-r(0.03), cSun[1]-r(0.015)], r(0.016), '#0d9488');
    disc([cSun[0]+r(0.03), cSun[1]-r(0.015)], r(0.016), '#0d9488');
  }
  else if(theme === 'medieval' || theme === 'gothic'){
    // 1. Base & Lower Stone Turret Shaft
    const cMain = theme==='gothic' ? '#27272a' : '#94a3b8';
    const cRoof = theme==='gothic' ? '#09090b' : '#1d4ed8';
    const cCollar = theme==='gothic' ? '#7f1d1d' : '#f5c542';
    cyl(r(0.22), Zbase, r(0.055), '#475569', '#1e293b');
    cyl(r(0.158), Z1, Zc0 - Z1, cMain, '#1e293b');
    // 2. Gold / Crimson Hub Collar Ring
    cyl(Rcol, Zc0, Zc1 - Zc0, cCollar, '#1e293b', true);
    // 3. Upper Stone Turret Shaft (drawn ON TOP of the collar ring so the gold ellipse never cuts across the pillar!)
    cyl(r(0.158), Zc1, Ztop - Zc1, cMain, '#1e293b');
    // 4. Upper Machicolated Corbel Band & Conical Roof Spire + Pennant
    cyl(r(0.20), Ztop, r(0.055), shade(cMain,-0.18), cCollar);
    const ap = cone(r(0.23), Ztop+r(0.055), r(0.26), cRoof, cCollar);
    const ft = P(0, 0, Ztop + r(0.39));
    line(ap, ft, '#f5c542', R*0.015);
    if(theme === 'medieval'){
      poly([ft, [ft[0]+r(0.12), ft[1]+r(0.02)], [ft[0], ft[1]+r(0.06)]], '#b91c1c', '#f5c542', R*0.006);
    } else {
      disc(ft, r(0.028), '#dc2626');
    }
  }
  else {
    // Western, Frontier, Alps, Nordic, Bavarian: Timber / Spiral Maibaum / Totem Tower
    // 1. Base & Lower Striped Shaft
    cyl(r(0.22), Zbase, r(0.055), plinthCols[0], plinthCols[1]);
    cyl(r(0.155), Z1, Zc0 - Z1, armColors[1], armColors[0]);
    cylStripes(r(0.157), Z1, Zc0, 8, armColors[1], armColors[2], rot*0.5);
    // 2. Rotating Hub Collar Ring
    cyl(Rcol, Zc0, Zc1 - Zc0, armColors[2], armColors[0], true);
    // 3. Upper Striped Shaft (drawn ON TOP of the collar ring!)
    cyl(r(0.155), Zc1, Ztop - Zc1, armColors[1], armColors[0]);
    cylStripes(r(0.157), Zc1, Ztop, 8, armColors[1], armColors[2], rot*0.5);
    // 4. Conical Crown & Finial
    cyl(r(0.195), Ztop, r(0.05), armColors[0], '#f5c542');
    const ap = cone(r(0.22), Ztop+r(0.05), r(0.22), theme==='alps' ? '#f8fafc' : armColors[2], '#f5c542');
    const ft = P(0, 0, Ztop + r(0.35));
    line(ap, ft, '#f5c542', R*0.016);
    disc(ft, r(0.032), '#f59e0b', '#78350f', R*0.007);
  }

  // Pass B: Draw Front-Half Arms & Flying Vehicles (in front of central tower: key >= 0)
  pods.filter(p => p.key >= 0).sort((u,v) => u.key - v.key).forEach(drawArmAndVehicle);
}
/* ===== END SPRITE CODE ===== */
return drawFlyerRide;
})();
window.drawFlyerRide = FlyerSkinPack;
const AirRaceSkinPack = (() => {
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
    ctx.lineTo(cx+R*Math.cos(a), cy+R*Math.sin(a)*0.58);}
  ctx.closePath();
}

/* ===== AIR RACE SKIN METADATA (UNTHEMED + 11 HEAVY/IMMERSIVE SKINS) ===== */
const AIRRACE_SKINS = {
  unthemed: {id:'unthemed', label:'Unthemed (Tier 0–2)', name:'Zamperla Air Race',               sub:'Checkered Control Spire, Radar Beacon & Stunt Planes', hex:'#cbd5e1', border:'#eab308'},
  classic:  {id:'classic',  label:'Classic Midway',      name:'Barnstormer Airshow Pylon',       sub:'Art-Deco ATC Glass Cab, Searchlight & Giant Windsock', hex:'#cbb07c', border:'#e11d48'},
  jungle:   {id:'jungle',   label:'Jungle',              name:'Mayan Sun-Calendar Temple',       sub:'Stepped Stone Sanctuary, Serpent Heads & Sun Disk',    hex:'#587c48', border:'#2fbf9a'},
  western:  {id:'western',  label:'Wild West',           name:'Dry Gulch Water Tank & Windmill', sub:'Red-Rock Mesa Base, Railroad Water Tank & Windmill',   hex:'#c99a62', border:'#b91c1c'},
  frontier: {id:'frontier', label:'Frontier',            name:'Firewatch Lookout Cabin Tower',   sub:'Log Trestle Tower, 360° Forest Cabin & Perched Eagle', hex:'#7d955d', border:'#566e42'},
  space:    {id:'space',    label:'Space',               name:'Orbital Tesla Coil & Dish Array', sub:'Plasma Containment Core, 3 Toroid Coils & Radar Dish', hex:'#334155', border:'#0ea5e9'},
  gothic:   {id:'gothic',   label:'Gothic',              name:"Nosferatu's Gargoyle Belfry",     sub:'Lancet Stone Bell Tower, Swinging Bell & Gargoyles',   hex:'#3b3345', border:'#991b1b'},
  medieval: {id:'medieval', label:'Medieval',            name:"Astronomer's Astrolabe Turret",   sub:'Crenellated Keep Base & Rotating Brass Armillary',     hex:'#6c8c58', border:'#eab308'},
  alps:     {id:'alps',     label:'Alps',                name:'Matterhorn Peak & Chalet Shrine', sub:'Jagged Snow-Capped Crag, Cliff Chalet & Summit Cross', hex:'#a8c5d6', border:'#0284c7'},
  fiesta:   {id:'fiesta',   label:'Fiesta',              name:'Castillo Pirotécnico Tower',      sub:'Talavera Base, Spinning Firework Wheels & Sun Effigy', hex:'#d99b52', border:'#e11d48'},
  nordic:   {id:'nordic',   label:'Nordic',              name:'Stave Belfry & Mjölnir Crown',    sub:'2-Tiered Stave Roofs, Dragon Prows & Thor Hammer',     hex:'#4d6b63', border:'#d97706'},
  bavarian: {id:'bavarian', label:'Bavarian',            name:'Maibaum & Glockenspiel Tower',    sub:'Spiral Maypole, 2-Tier Cuckoo Clockhouse & Onion Dome',hex:'#769958', border:'#2563eb'}
};
AIRRACE_SKINS.german = AIRRACE_SKINS.bavarian;

/* ===== SPRITE CODE: copy this block into engine.js ===== */
/**
 * drawAirRace(ctx, cx, cy, R, o)
 *  o.accent        : Land / chain accent color (default '#eab308')
 *  o.themeId       : 'classic'|'jungle'|'western'|'wildwest'|'frontier'|'space'|'gothic'|'medieval'|'alps'|'fiesta'|'nordic'|'bavarian'|'german'
 *  o.rideThemeTier : 0..4 (<=2 draws Standard Unthemed; >=3 draws Heavy/Immersive Themed Air Race)
 *  o.t             : slow orbit angle in radians
 *  o.fly           : 0..1 barrel-roll tilt amplitude (0 = level flight, 1 = full graceful barrel roll)
 *  o.flip          : true when called under ctx.scale(-1,1)
 *  o.tile          : draw the hex tile background (default true)
 */
function drawAirRace(ctx, cx, cy, R, o={}){
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTheme = String(o.themeId || o.theme || 'unthemed').toLowerCase();
  if(rawTheme === 'wildwest' || rawTheme === 'wild_west') rawTheme = 'western';
  if(rawTheme === 'german') rawTheme = 'bavarian';
  const theme = (tier <= 2 || !AIRRACE_SKINS[rawTheme]) ? 'unthemed' : rawTheme;
  const skin = AIRRACE_SKINS[theme] || AIRRACE_SKINS.unthemed;
  const accent = o.accent || skin.border || '#eab308';
  const rot = o.t == null ? 0.50 : o.t;
  const fly = o.fly == null ? 0.75 : o.fly;
  const fl = o.flip ? -1 : 1;
  const r = v => R * v;
  const TAU = Math.PI * 2;

  const cyB = cy + R * 0.07;
  const P = (X,Y,Z) => [cx + (X - Y)*0.7, cyB + (X + Y)*0.35 - Z];
  const g = (rr,a,Z) => P(rr*Math.cos(a), rr*Math.sin(a), Z);
  const lerp = (a,b,t) => [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t];

  const line = (a,b,c,w) => {
    ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
  };
  const poly = (pts,fill,stroke,lw) => {
    ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.lineJoin='round';ctx.stroke();}
  };
  const disc = (p,rr,c,stroke,lw) => {
    ctx.beginPath();ctx.arc(p[0],p[1],Math.max(0.5,rr),0,TAU);
    if(c){ctx.fillStyle=c;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.stroke();}
  };
  const ell = (p,rr,fill,stroke,lw) => {
    ctx.beginPath();ctx.ellipse(p[0],p[1],Math.max(0.5,0.99*rr),Math.max(0.5,0.495*rr),0,0,TAU);
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.stroke();}
  };
  const isoBox = (x0,x1,y0,y1,z0,z1,cf,ce,ct,stroke,lw) => {
    if(ct) poly([P(x0,y0,z1),P(x1,y0,z1),P(x1,y1,z1),P(x0,y1,z1)], ct, stroke, lw);
    poly([P(x0,y1,z0),P(x1,y1,z0),P(x1,y1,z1),P(x0,y1,z1)], cf, stroke, lw);
    poly([P(x1,y0,z0),P(x1,y1,z0),P(x1,y1,z1),P(x1,y0,z1)], ce, stroke, lw);
  };
  const cyl = (rr,Z,h,col,rimCol,drawTop=true) => {
    const pB = P(0,0,Z), pT = P(0,0,Z+h), rx = 0.99*rr, ry = 0.495*rr;
    ctx.beginPath();
    ctx.moveTo(pB[0]-rx, pB[1]);
    ctx.lineTo(pT[0]-rx, pT[1]);
    ctx.lineTo(pT[0]+rx, pT[1]);
    ctx.lineTo(pB[0]+rx, pB[1]);
    ctx.ellipse(pB[0], pB[1], rx, ry, 0, 0, Math.PI);
    ctx.closePath();
    const gr = ctx.createLinearGradient(pB[0]-rx, 0, pB[0]+rx, 0);
    gr.addColorStop(0, shade(col, 0.22));
    gr.addColorStop(0.38, col);
    gr.addColorStop(1, shade(col, -0.35));
    ctx.fillStyle = gr;
    ctx.fill();
    if(rimCol){
      ctx.strokeStyle = rimCol; ctx.lineWidth = R*0.008;
      ctx.beginPath(); ctx.ellipse(pB[0], pB[1], rx, ry, 0, 0, Math.PI); ctx.stroke();
    }
    if(drawTop){
      ell(pT, rr, shade(col, 0.18), rimCol, R*0.008);
    }
  };
  const cone = (rr,Z,h,col,rimCol) => {
    const p = P(0,0,Z), rx = 0.99*rr, ry = 0.495*rr, tp = [p[0], p[1]-h];
    const gr = ctx.createLinearGradient(p[0]-rx,0,p[0]+rx,0);
    gr.addColorStop(0, shade(col,0.28)); gr.addColorStop(0.45, col); gr.addColorStop(1, shade(col,-0.38));
    ctx.beginPath(); ctx.moveTo(p[0]-rx,p[1]); ctx.lineTo(tp[0],tp[1]); ctx.lineTo(p[0]+rx,p[1]);
    ctx.ellipse(p[0],p[1],rx,ry,0,0,Math.PI); ctx.closePath();
    ctx.fillStyle = gr; ctx.fill();
    if(rimCol){
      ctx.strokeStyle = rimCol; ctx.lineWidth = R*0.008;
      ctx.beginPath(); ctx.ellipse(p[0],p[1],rx,ry,0,0,Math.PI); ctx.stroke();
    }
    return tp;
  };
  const cylCheckered = (rr, Z0, Z1, nCols, nRows, colA, colB) => {
    for(let i=0; i<nCols; i++){
      const a0 = -Math.PI*0.25 + i*Math.PI/nCols, a1 = a0 + Math.PI/nCols;
      for(let j=0; j<nRows; j++){
        const zA = Z0 + (Z1-Z0)*j/nRows, zB = Z0 + (Z1-Z0)*(j+1)/nRows;
        poly([g(rr,a0,zA), g(rr,a1,zA), g(rr,a1,zB), g(rr,a0,zB)], (i+j)%2 ? colA : colB);
      }
    }
    const pB = P(0,0,Z0);
    ctx.strokeStyle = 'rgba(15,23,42,0.35)'; ctx.lineWidth = R*0.007;
    ctx.beginPath(); ctx.ellipse(pB[0], pB[1], 0.99*rr, 0.495*rr, 0, 0, Math.PI); ctx.stroke();
  };

  // 1. Optional Hex Tile Base
  if(o.tile !== false){
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = theme === 'unthemed' ? '#cbd5e1' : skin.hex;
    ctx.fill();
    ctx.lineWidth = Math.max(2, R*0.055);
    ctx.strokeStyle = accent;
    ctx.stroke();
  }

  // Theme palette lookup for arms, hanger poles, and aircraft
  const PAL = {
    unthemed: {plinth:'#94a3b8', hub:'#dc2626', arm:'#ef4444', pole:'#0284c7', cw:accent,    pod:'#0ea5e9', wing:accent,    trim:'#facc15'},
    classic:  {plinth:'#b91c1c', hub:'#1e3a8a', arm:'#e11d48', pole:'#f59e0b', cw:'#1e3a8a', pod:'#facc15', wing:'#e11d48', trim:'#fef08a'},
    jungle:   {plinth:'#6e6a56', hub:'#eab308', arm:'#78350f', pole:'#137a70', cw:'#2fbf9a', pod:'#ef4444', wing:'#10b981', trim:'#facc15'},
    western:  {plinth:'#963820', hub:'#451a03', arm:'#78350f', pole:'#d97706', cw:'#b91c1c', pod:'#b45309', wing:'#fef3c7', trim:'#f59e0b'},
    frontier: {plinth:'#5f656c', hub:'#4a3320', arm:'#5a3b22', pole:'#eab308', cw:'#2f5f3a', pod:'#eab308', wing:'#2f5f3a', trim:'#d9b27a'},
    space:    {plinth:'#0f172a', hub:'#0f172a', arm:'#334155', pole:'#22d3ee', cw:'#a855f7', pod:'#e2e8f0', wing:'#0284c7', trim:'#22d3ee'},
    gothic:   {plinth:'#18181b', hub:'#450a0a', arm:'#18181b', pole:'#71717a', cw:'#dc2626', pod:'#27272a', wing:'#7f1d1d', trim:'#c084fc'},
    medieval: {plinth:'#64748b', hub:'#b91c1c', arm:'#78350f', pole:'#f5c542', cw:'#475569', pod:'#b91c1c', wing:'#f5c542', trim:'#1d4ed8'},
    alps:     {plinth:'#94a3b8', hub:'#0284c7', arm:'#dc2626', pole:'#e2e8f0', cw:'#f59e0b', pod:'#dc2626', wing:'#f8fafc', trim:'#38bdf8'},
    fiesta:   {plinth:'#c2410c', hub:'#e11d48', arm:'#f59e0b', pole:'#0d9488', cw:'#ec4899', pod:'#e11d48', wing:'#facc15', trim:'#10b981'},
    nordic:   {plinth:'#475569', hub:'#290f02', arm:'#78350f', pole:'#d97706', cw:'#38bdf8', pod:'#7f1d1d', wing:'#f8fafc', trim:'#f59e0b'},
    bavarian: {plinth:'#94a3b8', hub:'#b45309', arm:'#d97706', pole:'#2563eb', cw:'#78350f', pod:'#2563eb', wing:'#fef3c7', trim:'#f5c542'}
  }[theme];

  // 2. Compact Central Turret Shadow & Base Plinth ONLY (NO Giant Concrete Slab or Fence!)
  const z0 = r(0.032);
  const p0 = P(0, 0, 0);
  ell([p0[0]+fl*r(0.06), p0[1]+r(0.02)], r(0.38), 'rgba(15,23,42,0.26)');
  cyl(r(0.26), 0, z0, PAL.plinth, shade(PAL.plinth,-0.35));
  ell(P(0,0,z0), r(0.22), shade(PAL.plinth,0.15), PAL.trim, R*0.008);

  // 3. Calculate 6 Radial Arms & SMOOTH, GRACEFUL Barrel-Rolling Aircraft Struts
  const N = 6;
  const Zh = r(0.32);          // Central rotating 6-arm hub height
  const Rcol = r(0.185);       // Radius of the central rotating hub collar
  const La = r(0.46);          // Horizontal radial arm length
  const Lg = r(0.22);          // Hanger strut length from arm-tip motor E to aircraft gondola G
  const Lf = r(0.15);          // Counterweight strut length from arm-tip motor E to counterweight F
  const arms = [];

  for(let k=0; k<N; k++){
    const a = rot + k * TAU / N;
    const ca = Math.cos(a), sa = Math.sin(a);
    const P0 = [Rcol*0.92*ca, Rcol*0.92*sa, Zh];
    const E  = [La*ca, La*sa, Zh];

    // LIVELY ACROBATIC SWING + FULL 360° BARREL-ROLL INVERSIONS!
    // Combines continuous barrel-roll rotation (rot * 1.85) with an acrobatic pitch surge
    // so the counterweighted struts swing high and flip all the way over the top!
    const gam = fly * (rot * 1.85 + k * 1.047 + 0.65 * Math.sin(rot * 1.2 + k));
    const sg = Math.sin(gam), cg = Math.cos(gam);

    // Strut direction perpendicular to radial arm: dVec = [-sa*sg, ca*sg, -cg]
    const dVec = [-sa*sg, ca*sg, -cg];
    const G = [E[0] + dVec[0]*Lg, E[1] + dVec[1]*Lg, Math.max(r(0.05), E[2] + dVec[2]*Lg)];
    const F = [E[0] - dVec[0]*Lf, E[1] - dVec[1]*Lf, Math.max(r(0.05), E[2] - dVec[2]*Lf)];

    arms.push({k, a, ca, sa, P0, E, G, F, gam, key: E[0] + E[1]});
  }

  // 4. Cast Individual Ground Shadows Underneath the 6 Banking Aircraft Gondolas
  arms.forEach(A => {
    const sh = P(A.G[0], A.G[1], 0);
    const sc = Math.max(0.52, 1.0 - A.G[2]/(R*0.85));
    ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
    ctx.beginPath();
    ctx.ellipse(sh[0] + fl*A.G[2]*0.14, sh[1] + A.G[2]*0.07, r(0.11)*sc, r(0.052)*sc, 0, 0, TAU);
    ctx.fill();
  });

  // Helper to draw one Radial Arm + Motor Pod + Counterweighted Strut + Banking Aircraft Gondola
  const drawArmAssembly = A => {
    const Hpiv = P(A.P0[0], A.P0[1], A.P0[2]);
    const Ep   = P(A.E[0],  A.E[1],  A.E[2]);
    const Gp   = P(A.G[0],  A.G[1],  A.G[2]);
    const Fp   = P(A.F[0],  A.F[1],  A.F[2]);

    // 1. Horizontal Radial Arm (from Hub Collar socket Hpiv to Tip Motor Housing Ep)
    disc(Hpiv, r(0.022), shade(PAL.arm,-0.3), PAL.trim, R*0.005);
    line(Hpiv, Ep, shade(PAL.arm,-0.35), r(0.050));
    line(Hpiv, Ep, PAL.arm, r(0.032));
    line(lerp(Hpiv, Ep, 0.25), lerp(Hpiv, Ep, 0.65), PAL.trim, r(0.020));

    // 2. Counterweighted Hanger Strut (from Counterweight Fp through Motor Ep to Aircraft Gondola Gp)
    line(Fp, Gp, shade(PAL.pole,-0.35), r(0.038));
    line(Fp, Gp, PAL.pole, r(0.022));

    // 3. Opposite-End Counterweight Fin / Themed Weight at Fp
    const fu = [Fp[0]-Gp[0], Fp[1]-Gp[1]];
    const fl2 = Math.hypot(fu[0], fu[1]) || 1;
    fu[0] /= fl2; fu[1] /= fl2;
    if(theme === 'space'){
      disc(Fp, r(0.032), '#0f172a', '#22d3ee', R*0.007);
      disc(Fp, r(0.017), '#e879f9');
    } else if(theme === 'bavarian' || theme === 'western'){
      disc(Fp, r(0.032), '#78350f', '#f59e0b', R*0.007);
      disc(Fp, r(0.015), '#b91c1c');
    } else {
      poly([
        [Fp[0] - fu[1]*r(0.034), Fp[1] + fu[0]*r(0.034)],
        [Fp[0] + fu[1]*r(0.034), Fp[1] - fu[0]*r(0.034)],
        [Fp[0] + fu[0]*r(0.048), Fp[1] + fu[1]*r(0.048)]
      ], PAL.cw, shade(PAL.cw,-0.35), R*0.007);
    }

    // 4. Arm-Tip Motor Housing Nacelle at Ep
    const tx = -A.sa, ty = A.ca;
    const nRear = P(A.E[0] - tx*r(0.062), A.E[1] - ty*r(0.062), A.E[2]);
    const nNose = P(A.E[0] + tx*r(0.062), A.E[1] + ty*r(0.062), A.E[2]);
    line(nRear, nNose, '#1e293b', r(0.062));
    line(nRear, nNose, PAL.hub, r(0.044));
    disc(Ep, r(0.022), PAL.trim, '#0f172a', R*0.005);

    // 5. Banking 4-Seat Stunt Aircraft / Themed Glider Gondola at Gp
    const wA = P(A.G[0] + A.ca*r(0.145), A.G[1] + A.sa*r(0.145), A.G[2]);
    const wB = P(A.G[0] - A.ca*r(0.145), A.G[1] - A.sa*r(0.145), A.G[2]);
    const nF = P(A.G[0] + tx*r(0.105),   A.G[1] + ty*r(0.105),   A.G[2]);
    const nB = P(A.G[0] - tx*r(0.105),   A.G[1] - ty*r(0.105),   A.G[2]);
    const upX = -fu[0], upY = -fu[1];
    const wingChord = r(0.046);

    // Tail fin at rear nB
    poly([
      nB,
      [nB[0] - (nF[0]-nB[0])*0.32 + upX*r(0.055), nB[1] - (nF[1]-nB[1])*0.32 + upY*r(0.055)],
      [nB[0] + (nF[0]-nB[0])*0.18, nB[1] + (nF[1]-nB[1])*0.18]
    ], PAL.trim, '#0f172a', R*0.006);

    // Main Swept Wing / Biplane Wing / Feathered Wing
    poly([
      [wA[0] + (nF[0]-Gp[0])*0.35, wA[1] + (nF[1]-Gp[1])*0.35],
      [wB[0] + (nF[0]-Gp[0])*0.35, wB[1] + (nF[1]-Gp[1])*0.35],
      [wB[0] - (nF[0]-Gp[0])*0.45, wB[1] - (nF[1]-Gp[1])*0.45],
      [wA[0] - (nF[0]-Gp[0])*0.45, wA[1] - (nF[1]-Gp[1])*0.45]
    ], PAL.wing, shade(PAL.wing,-0.35), R*0.008);

    // Upper Biplane Wing for Classic, Western, Frontier, Bavarian
    if(theme === 'classic' || theme === 'western' || theme === 'frontier' || theme === 'bavarian'){
      const uOffX = upX * wingChord * 0.85, uOffY = upY * wingChord * 0.85;
      poly([
        [wA[0]*0.92 + Gp[0]*0.08 + uOffX + (nF[0]-Gp[0])*0.25, wA[1]*0.92 + Gp[1]*0.08 + uOffY + (nF[1]-Gp[1])*0.25],
        [wB[0]*0.92 + Gp[0]*0.08 + uOffX + (nF[0]-Gp[0])*0.25, wB[1]*0.92 + Gp[1]*0.08 + uOffY + (nF[1]-Gp[1])*0.25],
        [wB[0]*0.92 + Gp[0]*0.08 + uOffX - (nF[0]-Gp[0])*0.30, wB[1]*0.92 + Gp[1]*0.08 + uOffY - (nF[1]-Gp[1])*0.30],
        [wA[0]*0.92 + Gp[0]*0.08 + uOffX - (nF[0]-Gp[0])*0.30, wA[1]*0.92 + Gp[1]*0.08 + uOffY - (nF[1]-Gp[1])*0.30]
      ], PAL.pod, shade(PAL.pod,-0.35), R*0.007);
    }

    [wA, wB].forEach(wt => disc(wt, r(0.018), PAL.trim, PAL.hub, R*0.005));

    // Fuselage body & 4 riders
    line(nB, nF, shade(PAL.pod,-0.38), r(0.082));
    line(nB, nF, PAL.pod, r(0.064));
    [-0.35, 0.35].forEach((s, rIdx) => {
      const rx = Gp[0] + (wA[0]-Gp[0])*s + upX*r(0.014);
      const ry = Gp[1] + (wA[1]-Gp[1])*s + upY*r(0.014);
      disc([rx, ry], r(0.022), ['#38bdf8','#ef4444','#22c55e','#facc15'][(A.k + rIdx)%4]);
      disc([rx + upX*r(0.016), ry + upY*r(0.016)], r(0.016), '#fde4c8');
    });

    // Nose Cone & Smoothly Spinning Propeller / Thruster / Beak
    if(theme === 'space'){
      disc(nF, r(0.020), '#22d3ee', '#ffffff', R*0.005);
    } else if(theme === 'jungle' || theme === 'medieval' || theme === 'fiesta' || theme === 'gothic'){
      const fDir = [nF[0]-Gp[0], nF[1]-Gp[1]];
      poly([
        [nF[0]-fDir[1]*0.25, nF[1]+fDir[0]*0.25],
        [nF[0]+fDir[1]*0.25, nF[1]-fDir[0]*0.25],
        [nF[0]+fDir[0]*0.55, nF[1]+fDir[1]*0.55]
      ], '#facc15', '#78350f', R*0.006);
    } else {
      const sp = rot * 6.5 + A.k * 1.3;
      [0, 1].forEach(j => {
        const aa = sp + j * Math.PI/2;
        line(
          [nF[0] - Math.cos(aa)*r(0.040), nF[1] - Math.sin(aa)*r(0.040)],
          [nF[0] + Math.cos(aa)*r(0.040), nF[1] + Math.sin(aa)*r(0.040)],
          '#facc15', r(0.012)
        );
      });
      disc(nF, r(0.014), '#dc2626', '#fef08a', R*0.004);
    }
  };

  // =========================================================================
  // 5. BESPOKE CENTRAL TOWER SET PIECES (SPLIT BELOW & ABOVE THE HUB COLLAR!)
  // =========================================================================
  const Zc0 = Zh - r(0.032);
  const Zc1 = Zh + r(0.032);

  // PASS A: Back-half Radial Arms & Banking Aircraft (behind central tower: key < 0)
  arms.filter(A => A.key < 0).sort((u,v) => u.key - v.key).forEach(drawArmAssembly);

  // PASS B: LOWER TOWER BASE (z0 .. Zc0) — Customized per theme!
  if(theme === 'unthemed'){
    cyl(r(0.165), z0, Zc0 - z0, '#f8fafc', '#64748b', false);
    cylCheckered(r(0.166), z0, Zc0, 8, 3, '#f8fafc', accent);
  }
  else if(theme === 'classic'){
    // Red-and-Cream Art-Deco Airshow Control Pylon Base with Gold Fins
    cyl(r(0.168), z0, Zc0 - z0, '#fffbeb', '#b91c1c', false);
    for(let i=0; i<8; i++){
      const a0 = -Math.PI*0.25 + i*Math.PI/8, a1 = a0 + Math.PI/8;
      poly([g(r(0.169),a0,z0), g(r(0.169),a1,z0), g(r(0.169),a1,Zc0), g(r(0.169),a0,Zc0)], i%2 ? '#e11d48' : '#fffbeb');
    }
  }
  else if(theme === 'jungle'){
    // Stepped Moss-Draped Mayan Limestone Pyramid Plinth Base with Carved Staircase
    isoBox(-r(0.175), r(0.175), -r(0.175), r(0.175), z0, z0+r(0.095), '#c7bfa4', '#8d856d', '#dfd8be', '#4a4737', R*0.008);
    isoBox(-r(0.145), r(0.145), -r(0.145), r(0.145), z0+r(0.095), Zc0, '#b5ad92', '#7d765f', '#d4cdb3', '#4a4737', R*0.008);
    // Central stone temple steps on the +Y front face
    poly([P(-r(0.055),r(0.18),z0), P(r(0.055),r(0.18),z0), P(r(0.048),r(0.148),Zc0), P(-r(0.048),r(0.148),Zc0)], '#dfd8be', '#595443', R*0.006);
  }
  else if(theme === 'western'){
    // Stacked Layered Red-Sandstone Canyon Mesa Outcrop Base
    isoBox(-r(0.175), r(0.175), -r(0.16), r(0.16), z0, z0+r(0.09), '#cf5c36', '#963820', '#e07a4c', '#451a03', R*0.007);
    isoBox(-r(0.14), r(0.14), -r(0.13), r(0.13), z0+r(0.09), Zc0, '#b84a2c', '#7c2d12', '#cf5c36', '#451a03', R*0.007);
  }
  else if(theme === 'frontier'){
    // River-Stone & Cross-Braced Timber Trestle Base
    isoBox(-r(0.16), r(0.16), -r(0.16), r(0.16), z0, z0+r(0.08), '#80858d', '#575c63', '#9499a1', '#334155', R*0.007);
    [[-0.12,-0.12],[0.12,-0.12],[-0.12,0.12],[0.12,0.12]].forEach(([dx,dy])=>{
      line(P(r(dx),r(dy),z0+r(0.08)), P(r(dx*0.85),r(dy*0.85),Zc0), '#5a3b22', R*0.022);
    });
    line(P(-r(0.11),r(0.11),z0+r(0.09)), P(r(0.11),r(0.11),Zc0), '#8a5a33', R*0.014);
    line(P(r(0.11),r(0.11),z0+r(0.09)), P(-r(0.11),r(0.11),Zc0), '#8a5a33', R*0.014);
  }
  else if(theme === 'space'){
    // Dark Titanium Reactor Core Base with Glowing Cyan Cooling Vents
    cyl(r(0.165), z0, Zc0 - z0, '#0f172a', '#22d3ee', false);
    [0.35, 0.70].forEach(f => {
      const zp = z0 + (Zc0-z0)*f;
      ell(P(0,0,zp), r(0.168), null, '#22d3ee', R*0.012);
    });
  }
  else if(theme === 'gothic' || theme === 'medieval'){
    // Buttressed Stone Keep / Obsidian Belfry Base
    const cF = theme==='gothic' ? '#27272a' : '#94a3b8';
    const cE = theme==='gothic' ? '#18181b' : '#64748b';
    isoBox(-r(0.145), r(0.145), -r(0.145), r(0.145), z0, Zc0, cF, cE, null, '#0f172a', R*0.008);
    // Pointed lancet slit or heraldic banner on front face
    poly([P(-r(0.04),r(0.148),z0+r(0.04)), P(r(0.04),r(0.148),z0+r(0.04)), P(r(0.04),r(0.148),Zc0-r(0.04)), P(-r(0.04),r(0.148),Zc0-r(0.04))], theme==='gothic' ? '#dc2626' : '#b91c1c', '#f5c542', R*0.006);
  }
  else if(theme === 'alps'){
    // Craggy Granite Alpine Rock Base with Snow Patches
    isoBox(-r(0.17), r(0.17), -r(0.16), r(0.16), z0, Zc0, '#64748b', '#475569', '#f8fafc', '#334155', R*0.008);
  }
  else if(theme === 'fiesta'){
    // Talavera-Tiled Adobe Plinth Base
    cyl(r(0.165), z0, Zc0 - z0, '#fef3c7', '#c2410c', false);
    cylCheckered(r(0.166), z0+r(0.04), Zc0-r(0.02), 8, 2, '#0d9488', '#f59e0b');
  }
  else if(theme === 'nordic'){
    // Octagonal Fjord-Stone & Tarred Stave-Timber Base with Painted Viking Shield Wall
    isoBox(-r(0.165), r(0.165), -r(0.165), r(0.165), z0, z0+r(0.07), '#64748b', '#475569', '#94a3b8', '#1e293b', R*0.007);
    isoBox(-r(0.145), r(0.145), -r(0.145), r(0.145), z0+r(0.07), Zc0, '#451a03', '#290f02', null, '#78350f', R*0.008);
    [-0.08, 0, 0.08].forEach((ox, idx) => {
      disc(P(r(ox), r(0.148), z0+r(0.16)), r(0.032), idx%2 ? '#991b1b' : '#0284c7', '#f59e0b', R*0.006);
    });
  }
  else if(theme === 'bavarian'){
    // Half-Timbered Fachwerk Base with Blue/White Lozenge Band
    isoBox(-r(0.15), r(0.15), -r(0.15), r(0.15), z0, Zc0, '#f8fafc', '#dfd9c8', null, '#451a03', R*0.008);
    line(P(-r(0.15),r(0.152),z0), P(r(0.15),r(0.152),Zc0), '#451a03', R*0.010);
    line(P(r(0.15),r(0.152),z0), P(-r(0.15),r(0.152),Zc0), '#451a03', R*0.010);
  }

  // PASS C: ROTATING 6-ARM DRIVE HUB COLLAR (Zc0 .. Zc1)
  cyl(Rcol, Zc0, Zc1 - Zc0, PAL.hub, PAL.trim, true);

  // PASS D: 11 BESPOKE SCULPTURAL UPPER TOWER SET PIECES (Zc1 and above — Drawn ON TOP of the collar!)
  if(theme === 'unthemed'){
    // Classic Zamperla Tapered Checkered Spire & ATC Radar Beacon
    const rc0 = r(0.132), Ztop = r(0.84), bands = 6;
    for(let b=0; b<bands; b++){
      const t0 = b/bands, t1 = (b+1)/bands;
      const rA = rc0*(1 - t0*0.72), rB = rc0*(1 - t1*0.72);
      const zA = Zc1 + (Ztop - Zc1)*t0, zB = Zc1 + (Ztop - Zc1)*t1;
      const pa = P(0,0,zA), pb2 = P(0,0,zB);
      ctx.fillStyle = (b % 2 === 0) ? '#f8fafc' : accent;
      ctx.beginPath();
      ctx.ellipse(pa[0], pa[1], 0.99*rA, 0.495*rA, 0, 0, Math.PI);
      ctx.lineTo(pb2[0]-0.99*rB, pb2[1]);
      ctx.ellipse(pb2[0], pb2[1], 0.99*rB, 0.495*rB, 0, Math.PI, 0, true);
      ctx.closePath(); ctx.fill();
      if(b === 0){
        ctx.strokeStyle = PAL.trim; ctx.lineWidth = R*0.008;
        ctx.beginPath(); ctx.ellipse(pa[0], pa[1], 0.99*rA, 0.495*rA, 0, 0, Math.PI); ctx.stroke();
      }
    }
    const pTop = P(0,0,Ztop);
    ell(pTop, r(0.055), '#334155', '#facc15', R*0.007);
    disc([pTop[0], pTop[1]-r(0.025)], r(0.020), '#ef4444', '#ffffff', R*0.005);
  }
  else if(theme === 'classic'){
    // 1. CLASSIC MIDWAY: 1920s Art-Deco Airshow Control Tower Cab + Rotating Beacon + Giant Striped Windsock!
    cyl(r(0.125), Zc1, r(0.16), '#e11d48', '#f5c542', true);
    // Wrap-around 360-degree glass ATC observation deck cab
    const zCab0 = Zc1 + r(0.16), zCab1 = zCab0 + r(0.14);
    cyl(r(0.165), zCab0, r(0.025), '#1e3a8a', '#f5c542', true);
    cyl(r(0.145), zCab0+r(0.025), r(0.115), '#38bdf8', '#fef08a', true);
    // Window mullions around the ATC glass cab
    for(let i=0; i<5; i++){
      const a = -Math.PI*0.15 + i*Math.PI/4;
      line(g(r(0.146),a,zCab0+r(0.025)), g(r(0.146),a,zCab1), '#1e3a8a', R*0.009);
    }
    // Conical red-and-gold ATC roof + Rotating Airfield Searchlight + Billowing Orange/White Windsock!
    const ap = cone(r(0.175), zCab1, r(0.13), '#e11d48', '#f5c542');
    const mastTop = [ap[0], ap[1]-r(0.14)];
    line(ap, mastTop, '#f5c542', R*0.015);
    disc(ap, r(0.026), '#fef08a', '#e11d48', R*0.006);
    // Giant striped canvas Windsock blowing in the breeze
    const wsY = mastTop[1] + r(0.02), sway = Math.sin(rot*2)*r(0.018);
    for(let s=0; s<4; s++){
      const xA = mastTop[0] + s*r(0.042), xB = xA + r(0.042);
      const hA = r(0.032)*(1 - s*0.16), hB = r(0.032)*(1 - (s+1)*0.16);
      const yA = wsY + s*r(0.006) + sway*(s/3), yB = wsY + (s+1)*r(0.006) + sway*((s+1)/3);
      poly([[xA,yA-hA],[xB,yB-hB],[xB,yB+hB],[xA,yA+hA]], s%2===0 ? '#f97316' : '#ffffff', '#7c2d12', R*0.004);
    }
  }
  else if(theme === 'jungle'){
    // 2. JUNGLE: 3D Stepped Mayan Temple Sanctuary + Carved Kukulkan Serpent Heads + Rotating Golden Sun-Calendar Disk!
    // Tier 1 & Tier 2 stepped limestone pyramid blocks above the hub collar
    const zT1 = Zc1 + r(0.11), zT2 = zT1 + r(0.13);
    isoBox(-r(0.155), r(0.155), -r(0.155), r(0.155), Zc1, zT1, '#c7bfa4', '#8d856d', '#dfd8be', '#4a4737', R*0.008);
    // Jade & gold talud-tablero frieze band
    poly([P(-r(0.156),r(0.156),Zc1+r(0.03)), P(r(0.156),r(0.156),Zc1+r(0.03)), P(r(0.156),r(0.156),zT1-r(0.02)), P(-r(0.156),r(0.156),zT1-r(0.02))], '#137a70', '#eab308', R*0.006);

    // Upper Sanctuary Shrine Box with Corbel-Arched Jade Portal
    isoBox(-r(0.118), r(0.118), -r(0.118), r(0.118), zT1, zT2, '#d4cdb3', '#9a9279', '#ece6ce', '#4a4737', R*0.008);
    poly([
      P(-r(0.052), r(0.120), zT1),
      P( r(0.052), r(0.120), zT1),
      P( r(0.035), r(0.120), zT2-r(0.03)),
      P( 0,        r(0.120), zT2-r(0.01)),
      P(-r(0.035), r(0.120), zT2-r(0.03))
    ], '#0f172a', '#eab308', R*0.007);
    disc(P(0, r(0.122), zT1+r(0.055)), r(0.022), '#2fbf9a', '#fef08a', R*0.005);

    // Projecting 3D Carved Stone Feathered-Serpent Heads (Kukulkan) flanking the sanctuary
    [-1, 1].forEach(s => {
      const sx0 = s > 0 ? r(0.118) : -r(0.195), sx1 = s > 0 ? r(0.195) : -r(0.118);
      isoBox(sx0, sx1, -r(0.045), r(0.055), zT1+r(0.01), zT1+r(0.085), '#bab297', '#7d765f', '#e3dcc4', '#4a4737', R*0.006);
      const eyeP = P(s*r(0.16), r(0.058), zT1+r(0.055));
      disc(eyeP, r(0.012), '#2fbf9a');
    });

    // Stepped Stone Roof-Comb (Crestería) crowned with a Rotating Golden Mayan Sun-Calendar Wheel!
    isoBox(-r(0.085), r(0.085), -r(0.045), r(0.045), zT2, zT2+r(0.075), '#b5ad92', '#7d765f', '#eab308', '#4a4737', R*0.007);
    const sunC = P(0, 0, zT2 + r(0.165));
    for(let k=0; k<12; k++){
      const a = -rot*1.2 + k*TAU/12;
      poly([
        [sunC[0]+Math.cos(a-0.14)*r(0.065), sunC[1]+Math.sin(a-0.14)*r(0.065)],
        [sunC[0]+Math.cos(a)*r(0.125),      sunC[1]+Math.sin(a)*r(0.125)],
        [sunC[0]+Math.cos(a+0.14)*r(0.065), sunC[1]+Math.sin(a+0.14)*r(0.065)]
      ], k%2===0 ? '#eab308' : '#2fbf9a', '#451a03', R*0.005);
    }
    disc(sunC, r(0.072), '#facc15', '#78350f', R*0.009);
    disc(sunC, r(0.042), '#137a70', '#fef08a', R*0.006);
    disc([sunC[0]-r(0.015), sunC[1]-r(0.006)], r(0.008), '#fef08a');
    disc([sunC[0]+r(0.015), sunC[1]-r(0.006)], r(0.008), '#fef08a');
  }
  else if(theme === 'western'){
    // 3. WILD WEST: Timber Trestle + Cylindrical Wooden Railroad Water Tank ("DRY GULCH") + Spinning Farm Windmill!
    const zTank0 = Zc1 + r(0.11), zTank1 = zTank0 + r(0.20);
    // Open redwood timber trestle legs supporting the elevated water tank
    [[-0.08,-0.08],[0.08,-0.08],[-0.08,0.08],[0.08,0.08]].forEach(([dx,dy])=>{
      line(P(r(dx),r(dy),Zc1), P(r(dx),r(dy),zTank0), '#451a03', R*0.022);
    });
    // Cylindrical Redwood Water Tank with Iron Tension Hoops
    cyl(r(0.155), zTank0, r(0.20), '#9a6a3c', '#451a03', true);
    [0.25, 0.55, 0.82].forEach(f => {
      const pH = P(0, 0, zTank0 + r(0.20)*f);
      ctx.strokeStyle = '#27272a'; ctx.lineWidth = R*0.010;
      ctx.beginPath(); ctx.ellipse(pH[0], pH[1], 0.99*r(0.156), 0.495*r(0.156), 0, 0, Math.PI); ctx.stroke();
    });
    // Hinged sheet-metal water spout on the right side of the tank
    const spBase = P(r(0.14), 0, zTank0 + r(0.08));
    line(spBase, [spBase[0]+r(0.11), spBase[1]+r(0.05)], '#94a3b8', R*0.022);
    line([spBase[0]+r(0.04), spBase[1]-r(0.07)], [spBase[0]+r(0.09), spBase[1]+r(0.03)], '#451a03', R*0.008);
    // Conical shingle tank roof + Derrick + Spinning Galvanized Multi-Blade Windmill!
    const ap = cone(r(0.172), zTank1, r(0.10), '#78350f', '#451a03');
    const wHub = [ap[0], ap[1] - r(0.11)];
    line([ap[0]-r(0.04), ap[1]+r(0.01)], wHub, '#5a3b22', R*0.014);
    line([ap[0]+r(0.04), ap[1]+r(0.01)], wHub, '#5a3b22', R*0.014);
    // Red tail vane & 8 spinning galvanized windmill blades
    poly([wHub, [wHub[0]-r(0.11), wHub[1]-r(0.03)], [wHub[0]-r(0.10), wHub[1]+r(0.03)]], '#b91c1c', '#fef3c7', R*0.005);
    for(let b=0; b<8; b++){
      const ba = rot*2.2 + b*TAU/8;
      line(wHub, [wHub[0]+Math.cos(ba)*r(0.095), wHub[1]+Math.sin(ba)*r(0.095)], '#e2e8f0', R*0.012);
    }
    disc(wHub, r(0.020), '#b91c1c', '#f59e0b', R*0.005);
  }
  else if(theme === 'frontier'){
    // 4. FRONTIER: Timber Trestle + 360° Forest Service Firewatch Lookout Cabin + Perched Bald Eagle!
    const zDeck = Zc1 + r(0.12), zCabTop = zDeck + r(0.15);
    [[-0.08,-0.08],[0.08,-0.08],[-0.08,0.08],[0.08,0.08]].forEach(([dx,dy])=>{
      line(P(r(dx),r(dy),Zc1), P(r(dx),r(dy),zDeck), '#4a3320', R*0.022);
    });
    // Overhanging wooden catwalk deck around the Firewatch Cabin
    isoBox(-r(0.175), r(0.175), -r(0.175), r(0.175), zDeck, zDeck+r(0.03), '#8a5a33', '#5a3b22', '#b58350', '#3e2723', R*0.007);
    // Log-and-Glass Firewatch Cabin with warm glowing lantern windows
    isoBox(-r(0.13), r(0.13), -r(0.13), r(0.13), zDeck+r(0.03), zCabTop, '#6b4a2b', '#4a3320', null, '#2e1f14', R*0.008);
    poly([P(-r(0.10),r(0.132),zDeck+r(0.06)), P(r(0.10),r(0.132),zDeck+r(0.06)), P(r(0.10),r(0.132),zCabTop-r(0.02)), P(-r(0.10),r(0.132),zCabTop-r(0.02))], '#fde047', '#3e2723', R*0.006);
    poly([P(r(0.132),-r(0.10),zDeck+r(0.06)), P(r(0.132),r(0.10),zDeck+r(0.06)), P(r(0.132),r(0.10),zCabTop-r(0.02)), P(r(0.132),-r(0.10),zCabTop-r(0.02))], '#f59e0b', '#3e2723', R*0.006);
    // Forest-Green Hipped Shingle Roof + Giant Carved Outstretched Bald Eagle at the Peak!
    const ap = P(0, 0, zCabTop + r(0.13));
    poly([P(-r(0.165),-r(0.165),zCabTop), P(r(0.165),-r(0.165),zCabTop), ap], '#1e3f28', '#2e1f14', R*0.007);
    poly([P(r(0.165),-r(0.165),zCabTop), P(r(0.165),r(0.165),zCabTop), ap], '#244d30', '#2e1f14', R*0.007);
    poly([P(-r(0.165),r(0.165),zCabTop), P(r(0.165),r(0.165),zCabTop), ap], '#2f5f3a', '#eab308', R*0.008);
    // Outstretched Bald Eagle perched on the roof peak
    poly([ap, [ap[0]-r(0.14), ap[1]-r(0.08)], [ap[0]-r(0.04), ap[1]-r(0.02)]], '#4a3320', '#eab308', R*0.005);
    poly([ap, [ap[0]+r(0.14), ap[1]-r(0.08)], [ap[0]+r(0.04), ap[1]-r(0.02)]], '#4a3320', '#eab308', R*0.005);
    disc([ap[0], ap[1]-r(0.035)], r(0.026), '#4a3320');
    disc([ap[0], ap[1]-r(0.065)], r(0.020), '#f8fafc');
    disc([ap[0]+r(0.015), ap[1]-r(0.065)], r(0.009), '#f59e0b');
  }
  else if(theme === 'space'){
    // 5. SPACE: Glowing Cyan Plasma Containment Core + 3 Chrome Toroidal Tesla Coils + Rotating Deep-Space Radar Dish!
    const zTop = Zc1 + r(0.38);
    cyl(r(0.085), Zc1, r(0.34), '#22d3ee', '#0284c7', true);
    // 3 Chrome Toroidal Tesla Energy Rings floating around the plasma core
    [0.22, 0.50, 0.78].forEach((f, idx) => {
      const pR = P(0, 0, Zc1 + r(0.34)*f);
      const rad = r(0.155 - idx*0.018);
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = R*0.022;
      ctx.beginPath(); ctx.ellipse(pR[0], pR[1], 0.99*rad, 0.495*rad, 0, 0, TAU); ctx.stroke();
      ctx.strokeStyle = (idx%2===0) ? '#22d3ee' : '#e879f9'; ctx.lineWidth = R*0.009;
      ctx.beginPath(); ctx.ellipse(pR[0], pR[1], 0.99*rad, 0.495*rad, 0, 0, TAU); ctx.stroke();
    });
    // Rotating Parabolic Deep-Space Radar Dish at the summit
    const dCenter = P(0, 0, zTop + r(0.06));
    const dAng = Math.sin(rot) * 0.45;
    ctx.save(); ctx.translate(dCenter[0], dCenter[1]); ctx.rotate(dAng);
    ctx.fillStyle = '#cbd5e1'; ctx.strokeStyle = '#0284c7'; ctx.lineWidth = R*0.01;
    ctx.beginPath(); ctx.arc(0, 0, r(0.115), Math.PI*0.15, Math.PI*0.85); ctx.closePath(); ctx.fill(); ctx.stroke();
    line([0, 0], [0, -r(0.095)], '#22d3ee', R*0.014);
    disc([0, -r(0.095)], r(0.022), '#e879f9', '#ffffff', R*0.005);
    ctx.restore();
  }
  else if(theme === 'gothic'){
    // 6. GOTHIC: Pointed-Arch Stone Gargoyle Belfry + Swinging Bronze Bell + Crooked Bat Weathervane!
    const zBel0 = Zc1, zBel1 = Zc1 + r(0.32);
    isoBox(-r(0.125), r(0.125), -r(0.125), r(0.125), zBel0, zBel1, '#3f3f46', '#18181b', '#52525b', '#09090b', R*0.009);
    // Open pointed Gothic belfry arch showing a swinging bronze bell inside!
    poly([
      P(-r(0.075), r(0.128), zBel0+r(0.04)),
      P( r(0.075), r(0.128), zBel0+r(0.04)),
      P( r(0.075), r(0.128), zBel1-r(0.09)),
      P( 0,        r(0.128), zBel1-r(0.02)),
      P(-r(0.075), r(0.128), zBel1-r(0.09))
    ], '#09090b', '#dc2626', R*0.008);
    const bellP = P(Math.sin(rot*2)*r(0.025), r(0.128), zBel0+r(0.14));
    poly([[bellP[0]-r(0.042),bellP[1]+r(0.03)], [bellP[0]+r(0.042),bellP[1]+r(0.03)], [bellP[0]+r(0.025),bellP[1]-r(0.035)], [bellP[0]-r(0.025),bellP[1]-r(0.035)]], '#eab308', '#78350f', R*0.006);
    // Projecting Horned Stone Gargoyles on the left & right corners of the cornice
    const pCorn = P(0, 0, zBel1);
    [-1, 1].forEach(s => {
      poly([[pCorn[0]+s*r(0.09),pCorn[1]], [pCorn[0]+s*r(0.19),pCorn[1]-r(0.05)], [pCorn[0]+s*r(0.15),pCorn[1]+r(0.03)]], '#52525b', '#09090b', R*0.006);
      disc([pCorn[0]+s*r(0.16), pCorn[1]-r(0.02)], r(0.010), '#ef4444');
    });
    // Steep Witch-Hat Slate Spire & Crooked Iron Bat Finial
    const ap = P(0, 0, zBel1 + r(0.24));
    poly([P(-r(0.145),r(0.145),zBel1), P(r(0.145),r(0.145),zBel1), ap], '#18181b', '#dc2626', R*0.008);
    poly([P(r(0.145),-r(0.145),zBel1), P(r(0.145),r(0.145),zBel1), ap], '#09090b', '#dc2626', R*0.008);
    line(ap, [ap[0]+r(0.015), ap[1]-r(0.09)], '#a1a1aa', R*0.012);
    disc([ap[0]+r(0.015), ap[1]-r(0.09)], r(0.022), '#dc2626');
  }
  else if(theme === 'medieval'){
    // 7. MEDIEVAL: Castellated Wizard's Stone Turret + Giant Rotating Brass Armillary Sphere / Astrolabe!
    const zTur = Zc1 + r(0.22);
    cyl(r(0.135), Zc1, r(0.22), '#cbd5e1', '#475569', true);
    cyl(r(0.155), zTur-r(0.04), r(0.04), '#94a3b8', '#f5c542', true);
    // Giant Rotating Brass Celestial Armillary Sphere at the crown
    const cAst = P(0, 0, zTur + r(0.15));
    line(P(0,0,zTur), [cAst[0], cAst[1]-r(0.15)], '#f5c542', R*0.018);
    ctx.strokeStyle = '#f5c542'; ctx.lineWidth = R*0.018;
    ctx.beginPath(); ctx.arc(cAst[0], cAst[1], r(0.125), 0, TAU); ctx.stroke();
    ctx.strokeStyle = '#d97706'; ctx.lineWidth = R*0.014;
    ctx.beginPath(); ctx.ellipse(cAst[0], cAst[1], r(0.125)*Math.abs(Math.cos(rot)), r(0.125), 0.35, 0, TAU); ctx.stroke();
    ctx.strokeStyle = '#1d4ed8'; ctx.lineWidth = R*0.014;
    ctx.beginPath(); ctx.ellipse(cAst[0], cAst[1], r(0.125), r(0.055), -0.35, 0, TAU); ctx.stroke();
    // Blazing golden Sun & royal blue Moon inside the Astrolabe
    disc(cAst, r(0.045), '#facc15', '#b45309', R*0.008);
    disc([cAst[0]+Math.cos(rot*1.5)*r(0.095), cAst[1]+Math.sin(rot*1.5)*r(0.045)], r(0.022), '#38bdf8', '#ffffff', R*0.005);
  }
  else if(theme === 'alps'){
    // 8. ALPS: Jagged Snow-Capped Matterhorn Mountain Peak + Cliffside Timber Chalet Shrine + Swiss Cross!
    const pB = P(0, 0, Zc1);
    const pk = [pB[0] + r(0.02), pB[1] - r(0.46)];
    // Shaded rock crag & pure white snow-draped upper horn facets
    poly([[pB[0]-r(0.17),pB[1]], [pB[0]-r(0.11),pB[1]-r(0.24)], pk, [pB[0]+r(0.02),pB[1]+r(0.06)]], '#94a3b8', '#475569', R*0.008);
    poly([[pB[0]+r(0.02),pB[1]+r(0.06)], pk, [pB[0]+r(0.13),pB[1]-r(0.22)], [pB[0]+r(0.17),pB[1]]], '#64748b', '#334155', R*0.008);
    // Snow cap facets on the upper Matterhorn horn
    poly([[pB[0]-r(0.11),pB[1]-r(0.24)], pk, [pB[0]+r(0.01),pB[1]-r(0.19)]], '#ffffff', '#bae6fd', R*0.007);
    poly([[pB[0]+r(0.01),pB[1]-r(0.19)], pk, [pB[0]+r(0.13),pB[1]-r(0.22)]], '#dbeafe', '#93c5fd', R*0.007);
    // Miniature Timber Cuckoo-Clock Chalet Shrine nestled into the front cliff face!
    isoBox(-r(0.075), r(0.075), r(0.04), r(0.15), Zc1+r(0.03), Zc1+r(0.15), '#b45309', '#78350f', '#f8fafc', '#451a03', R*0.007);
    disc(P(0, r(0.155), Zc1+r(0.09)), r(0.026), '#fde047', '#dc2626', R*0.006);
    // Red-and-White Swiss Summit Pennant at the Horn Peak
    line(pk, [pk[0], pk[1]-r(0.09)], '#f59e0b', R*0.012);
    poly([[pk[0],pk[1]-r(0.09)], [pk[0]+r(0.085),pk[1]-r(0.065)], [pk[0],pk[1]-r(0.04)]], '#dc2626', '#ffffff', R*0.005);
  }
  else if(theme === 'fiesta'){
    // 9. FIESTA: Mexican "Castillo Pirotécnico" Fireworks Lattice Tower + Spinning Pinwheels + Blazing Sun Crown!
    const zTop = Zc1 + r(0.38);
    // Crisscrossing timber firework scaffold tower
    [[-0.08,-0.08],[0.08,-0.08],[-0.08,0.08],[0.08,0.08]].forEach(([dx,dy])=>{
      line(P(r(dx),r(dy),Zc1), P(r(dx*0.55),r(dy*0.55),zTop), '#9a3412', R*0.016);
    });
    // 2 Tiers of Spinning Catherine-Wheel Firework Frames (Ruedas Pirotécnicas) mounted on the tower!
    [Zc1 + r(0.12), Zc1 + r(0.26)].forEach((zw, idx) => {
      const wP = P(0, r(0.08), zw);
      const wRad = r(0.075 - idx*0.012);
      disc(wP, wRad, null, '#fde047', R*0.010);
      for(let s=0; s<8; s++){
        const a = rot*(idx===0 ? 2.5 : -2.5) + s*TAU/8;
        line(wP, [wP[0]+Math.cos(a)*wRad, wP[1]+Math.sin(a)*wRad], s%2 ? '#e11d48' : '#0d9488', R*0.010);
      }
      disc(wP, r(0.022), '#facc15');
    });
    // Blazing Golden Aztec Sunburst Effigy at the Summit
    const sTop = P(0, 0, zTop + r(0.06));
    for(let s=0; s<12; s++){
      const a = rot + s*TAU/12;
      line(sTop, [sTop[0]+Math.cos(a)*r(0.115), sTop[1]+Math.sin(a)*r(0.115)], s%2 ? '#facc15' : '#e11d48', R*0.016);
    }
    disc(sTop, r(0.058), '#facc15', '#b45309', R*0.01);
    disc(sTop, r(0.028), '#f97316');
  }
  else if(theme === 'nordic'){
    // 10. NORDIC: 2-Tiered Norwegian Stave-Church Belfry + Golden Dragon-Head Gable Prows + Rotating Mjölnir Hammer!
    const zS1 = Zc1 + r(0.11), zR1 = zS1 + r(0.10);
    // Tier 1: Dark tarred stave-wood tower body with gold Urnes knotwork trim
    isoBox(-r(0.135), r(0.135), -r(0.135), r(0.135), Zc1, zS1, '#451a03', '#290f02', null, '#d97706', R*0.008);
    // Glowing rune slit window on front stave wall
    poly([P(-r(0.03),r(0.138),Zc1+r(0.025)), P(r(0.03),r(0.138),Zc1+r(0.025)), P(r(0.03),r(0.138),zS1-r(0.02)), P(-r(0.03),r(0.138),zS1-r(0.02))], '#38bdf8', '#f59e0b', R*0.006);

    // Tier 1: Steep 4-Sided Dark-Shingled Stave Pyramid Roof Skirt
    const ap1 = P(0, 0, zR1 + r(0.04));
    const ov1 = r(0.175);
    poly([P(-ov1,-ov1,zS1), P(ov1,-ov1,zS1), ap1], '#0f172a', '#d97706', R*0.006);
    poly([P(-ov1,-ov1,zS1), P(-ov1,ov1,zS1), ap1], '#1e293b', '#d97706', R*0.006);
    poly([P(ov1,-ov1,zS1),  P(ov1,ov1,zS1),  ap1], '#1e293b', '#d97706', R*0.007);
    poly([P(-ov1,ov1,zS1),  P(ov1,ov1,zS1),  ap1], '#334155', '#f59e0b', R*0.008);

    // Projecting Golden Open-Jawed Dragon-Head Gable Prows (Drakhuvud) curling out from the stave eaves!
    [-1, 1].forEach(s => {
      const dB = P(s*r(0.14), 0, zS1 + r(0.04));
      line(dB, [dB[0]+s*r(0.075), dB[1]-r(0.055)], '#f59e0b', R*0.020);
      poly([
        [dB[0]+s*r(0.065), dB[1]-r(0.075)],
        [dB[0]+s*r(0.115), dB[1]-r(0.060)],
        [dB[0]+s*r(0.075), dB[1]-r(0.035)]
      ], '#fef08a', '#b45309', R*0.005);
    });

    // Tier 2: Upper Stave Belfry Turret (Takrytter) & Steep Shingled Spire
    const zS2 = zR1 + r(0.08), zR2 = zS2 + r(0.12);
    isoBox(-r(0.088), r(0.088), -r(0.088), r(0.088), zR1-r(0.01), zS2, '#451a03', '#290f02', null, '#f59e0b', R*0.007);
    const ap2 = P(0, 0, zR2);
    const ov2 = r(0.115);
    poly([P(ov2,-ov2,zS2), P(ov2,ov2,zS2), ap2], '#0f172a', '#f59e0b', R*0.007);
    poly([P(-ov2,ov2,zS2), P(ov2,ov2,zS2), ap2], '#1e293b', '#f59e0b', R*0.008);

    // Crown: Forged Iron & Gold Mjölnir (Thor's Hammer) & Glowing Bifrost Rune Ring at the Summit!
    const hCenter = [ap2[0], ap2[1] - r(0.065)];
    disc(hCenter, r(0.075), null, '#38bdf8', R*0.010);
    line(ap2, hCenter, '#f59e0b', R*0.020);
    poly([
      [hCenter[0]-r(0.068), hCenter[1]-r(0.028)],
      [hCenter[0]+r(0.068), hCenter[1]-r(0.028)],
      [hCenter[0]+r(0.055), hCenter[1]+r(0.022)],
      [hCenter[0]-r(0.055), hCenter[1]+r(0.022)]
    ], '#94a3b8', '#f59e0b', R*0.008);
    disc(hCenter, r(0.016), '#38bdf8');
  }
  else if(theme === 'bavarian'){
    // 11. BAVARIAN: Spiral Blue-and-White Maibaum + 2-Tier Cuckoo Glockenspiel Clockhouse & Copper Onion Dome!
    const zHouse0 = Zc1 + r(0.10), zHouse1 = zHouse0 + r(0.17);
    // Blue-and-White Spiral Maibaum pole rising from the collar
    cyl(r(0.055), Zc1, r(0.38), '#ffffff', '#2563eb', false);
    for(let s=0; s<4; s++){
      const zS = Zc1 + s*r(0.09);
      line(P(-r(0.05),r(0.02),zS), P(r(0.05),r(0.02),zS+r(0.05)), '#2563eb', R*0.018);
    }
    // Ornate 2-Tier Bavarian Glockenspiel Clockhouse & Figurine Balcony
    ell(P(0,0,zHouse0), r(0.175), '#b91c1c', '#f5c542', R*0.010);
    // Miniature dancing Oktoberfest figurines on the carousel balcony
    for(let f=0; f<6; f++){
      const fa = rot*1.5 + f*TAU/6;
      const fp = g(r(0.145), fa, zHouse0+r(0.02));
      disc(fp, r(0.018), f%2 ? '#2563eb' : '#ef4444', '#fde047', R*0.004);
    }
    isoBox(-r(0.115), r(0.115), -r(0.115), r(0.115), zHouse0, zHouse1, '#fef3c7', '#dfd9c8', '#b91c1c', '#78350f', R*0.008);
    // Golden Clock Face on front of the Glockenspiel house
    const ck = P(0, r(0.12), zHouse0+r(0.09));
    disc(ck, r(0.042), '#ffffff', '#f59e0b', R*0.009);
    line(ck, [ck[0], ck[1]-r(0.028)], '#1e293b', R*0.007);
    line(ck, [ck[0]+r(0.022), ck[1]], '#dc2626', R*0.007);
    // Verdigris Copper Onion Dome & Golden Pretzel/Sun Finial at the summit!
    const od = P(0, 0, zHouse1 + r(0.09));
    disc(od, r(0.085), '#0d9488', '#f5c542', R*0.010);
    line(od, [od[0], od[1]-r(0.13)], '#f5c542', R*0.014);
    disc([od[0], od[1]-r(0.13)], r(0.026), '#f5c542', '#78350f', R*0.006);
  }

  // PASS E: Front-half Radial Arms & Banking Aircraft (in front of central tower: key >= 0)
  arms.filter(A => A.key >= 0).sort((u,v) => u.key - v.key).forEach(drawArmAssembly);
}
/* ===== END SPRITE CODE ===== */
return drawAirRace;
})();
window.drawAirRace = AirRaceSkinPack;
