/* Themed Drop Tower sprite implementation from the supplied skin pack. */
const DropTowerSkinPack = (() => {
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
function prism(ctx,cx,by,w,d,h,col,strokeCol,lw){
  const ty=by-h;
  ctx.fillStyle=shade(col,-0.35); ctx.beginPath();
  ctx.moveTo(cx-w,by);ctx.lineTo(cx,by+d);ctx.lineTo(cx,ty+d);ctx.lineTo(cx-w,ty);ctx.closePath();ctx.fill();
  if(strokeCol){ctx.strokeStyle=strokeCol;ctx.lineWidth=lw||1;ctx.stroke();}
  ctx.fillStyle=shade(col,-0.1); ctx.beginPath();
  ctx.moveTo(cx+w,by);ctx.lineTo(cx,by+d);ctx.lineTo(cx,ty+d);ctx.lineTo(cx+w,ty);ctx.closePath();ctx.fill();
  if(strokeCol){ctx.strokeStyle=strokeCol;ctx.lineWidth=lw||1;ctx.stroke();}
  ctx.fillStyle=shade(col,0.2); ctx.beginPath();
  ctx.moveTo(cx-w,ty);ctx.lineTo(cx,ty-d);ctx.lineTo(cx+w,ty);ctx.lineTo(cx,ty+d);ctx.closePath();ctx.fill();
  if(strokeCol){ctx.strokeStyle=strokeCol;ctx.lineWidth=lw||1;ctx.stroke();}
}

/* ===== DROP TOWER SKIN METADATA & STEEL PALETTES ===== */
const DROP_TOWER_SKINS = {
  unthemed: {id:'unthemed', label:'Unthemed (Tier 0–2)', name:'Intamin Gyro-Drop Tower',       sub:'Steel Mast, Hoist Cap & Aviation Strobe',          hex:'#cbd5e1', border:'#38bdf8', pL:'#475569', pR:'#64748b', br:'#94a3b8', post:'#cbd5e1', band:null,      plinth:'#64748b'},
  fiesta:   {id:'fiesta',   label:'Fiesta',              name:'Campanario Mission Belltower',  sub:'Bronze Bell Arches, Talavera Dome & Papel Picado', hex:'#d99b52', border:'#e11d48', pL:'#7c2d12', pR:'#9a3412', br:'#f59e0b', post:'#fde047', band:'#0d9488', plinth:'#c2410c'},
  bavarian: {id:'bavarian', label:'Bavarian',            name:'Rathaus Glockenspiel Clocktower',sub:'Fachwerk Clock Bourse, Figurines & Onion Dome',    hex:'#769958', border:'#2563eb', pL:'#1e3a8a', pR:'#2563eb', br:'#f8fafc', post:'#f5c542', band:'#b91c1c', plinth:'#78350f'},
  jungle:   {id:'jungle',   label:'Jungle',              name:'Mayan Spiritual Altar Tower',   sub:'Chaac Mask Sanctuary, Serpent Heads & Fire Bowl',  hex:'#587c48', border:'#2fbf9a', pL:'#3f4d34', pR:'#536444', br:'#a8a084', post:'#8e8a72', band:'#2fbf9a', plinth:'#6e6a56'},
  western:  {id:'western',  label:'Wild West',           name:'Spindletop Oil Rig & Gusher',   sub:'Timber Crown-Block, Sheave Wheels & Oil Plume',    hex:'#c99a62', border:'#b91c1c', pL:'#3b2313', pR:'#52321b', br:'#8a5a33', post:'#6b4423', band:'#b91c1c', plinth:'#78350f'},
  classic:  {id:'classic',  label:'Classic Midway',      name:'Boardwalk Lighthouse Lantern',  sub:'Gilded Gallery, Fresnel Lens & Striped Cupola',    hex:'#cbb07c', border:'#e11d48', pL:'#7f1d1d', pR:'#991b1b', br:'#fef08a', post:'#f5c542', band:'#2563eb', plinth:'#991b1b'},
  frontier: {id:'frontier', label:'Frontier',            name:'Redwood Fire-Lookout Cabin',    sub:'Log Catwalk, Glass Ranger Cabin & Perched Eagle',  hex:'#7d955d', border:'#566e42', pL:'#3e2723', pR:'#4e342e', br:'#8a5a33', post:'#5a3b22', band:'#2f5f3a', plinth:'#575c63'},
  space:    {id:'space',    label:'Space',               name:'Orbital Telemetry & Plasma Core',sub:'3 Dish Antennas, Toroid Coils & Singularity Orb', hex:'#334155', border:'#0ea5e9', pL:'#090d16', pR:'#111827', br:'#38bdf8', post:'#cbd5e1', band:'#a855f7', plinth:'#0f172a'},
  gothic:   {id:'gothic',   label:'Gothic',              name:'Cathedral Gargoyle Belfry',     sub:'Rose Window, 4 Winged Gargoyles & Witch Spire',    hex:'#3b3345', border:'#991b1b', pL:'#18181b', pR:'#27272a', br:'#71717a', post:'#3f3f46', band:'#991b1b', plinth:'#18181b'},
  medieval: {id:'medieval', label:'Medieval',            name:'Royal Siege Keep Watchtower',   sub:'Machicolated Battlements, Shields & 4 Pennants',   hex:'#6c8c58', border:'#eab308', pL:'#334155', pR:'#475569', br:'#cbd5e1', post:'#94a3b8', band:'#b91c1c', plinth:'#64748b'},
  alps:     {id:'alps',     label:'Alps',                name:'Alpine Chalet & Bullwheel Top', sub:'Snow-Capped Eaves, Icicles & Red Haul Bullwheel',  hex:'#a8c5d6', border:'#0284c7', pL:'#075985', pR:'#0284c7', br:'#e0f2fe', post:'#f8fafc', band:'#dc2626', plinth:'#64748b'},
  nordic:   {id:'nordic',   label:'Nordic',              name:'Stave Dragon Roof & Mjölnir',   sub:'Crossed Dragon Prows, Shield Rim & Bifrost Hammer',hex:'#4d6b63', border:'#d97706', pL:'#290f02', pR:'#451a03', br:'#d97706', post:'#92400e', band:'#0284c7', plinth:'#334155'}
};
DROP_TOWER_SKINS.german = DROP_TOWER_SKINS.bavarian;

/* ===== SPRITE CODE: copy this block into engine.js ===== */
function dropTowerCycle(msOrSec){
  const s = (msOrSec > 100 ? msOrSec / 1000 : msOrSec) % 6.5;
  if(s < 3.0) return (1 - Math.cos(Math.PI * s / 3.0)) / 2 * 0.999; // Smooth lift
  if(s < 4.1) return 1.0;                                            // Summit hold
  if(s < 4.85){ const u = (s - 4.1) / 0.75; return Math.max(0, 1 - u * u); } // Freefall plunge
  if(s < 5.65){ const u = (s - 4.85) / 0.80; return 0.12 * Math.sin(u * Math.PI) * (1 - u * 0.4); } // Brake bounce
  return 0;
}

/**
 * drawDropTower(ctx, cx, cy, R, opts)
 *  cx, cy             : hex center
 *  R                  : hex radius in px
 *  opts.accent        : Land color (default '#f8fafc')
 *  opts.levels        : tower height 1..10 (default 6)
 *  opts.t             : gondola position 0 (bottom) .. 1 (top), OR time in seconds if > 1.05
 *  opts.lift          : optional explicit 0..1 gondola height override
 *  opts.themeId/theme : 'classic'|'jungle'|'western'|'frontier'|'space'|'gothic'|'medieval'|'alps'|'fiesta'|'nordic'|'bavarian'
 *  opts.rideThemeTier : 0..4 (<=2 draws Unthemed Standard; >=3 draws Heavy/Immersive themed cap & mast)
 *  opts.tile          : draw the hex tile (default true)
 */
function drawDropTower(ctx, cx, cy, R, opts={}){
  const tier = opts.rideThemeTier != null ? opts.rideThemeTier : (opts.tier != null ? opts.tier : (opts.themeId || opts.theme ? 3 : 0));
  let rawTheme = String(opts.themeId || opts.theme || 'unthemed').toLowerCase();
  if(rawTheme === 'wildwest' || rawTheme === 'wild_west') rawTheme = 'western';
  if(rawTheme === 'german') rawTheme = 'bavarian';
  const theme = (tier <= 2 || !DROP_TOWER_SKINS[rawTheme]) ? 'unthemed' : rawTheme;
  const skin = DROP_TOWER_SKINS[theme] || DROP_TOWER_SKINS.unthemed;

  const accent = opts.accent || skin.border || '#f8fafc';
  const levels = opts.levels || 6;
  const clockSec = (opts.tm != null) ? opts.tm : (typeof performance !== 'undefined' ? performance.now()/1000 : 0);
  const t = (opts.lift != null) ? opts.lift : (opts.t == null ? 1 : (opts.t > 1.05 ? dropTowerCycle(opts.t) : opts.t));

  const w = R * 0.20, d = w * 0.50, seg = R * 0.22, plinth = R * 0.10;
  const H = seg * (levels + 1); // Total steel mast height
  const baseY = cy + d;         // Mast foot Y
  const TAU = Math.PI * 2;

  const line = (a,b,c,lw) => {
    ctx.strokeStyle=c; ctx.lineWidth=lw; ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b[0],b[1]); ctx.stroke();
  };
  const poly = (pts,fill,stroke,lw) => {
    ctx.beginPath(); pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();
    if(fill){ ctx.fillStyle=fill; ctx.fill(); }
    if(stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=lw||1; ctx.lineJoin='round'; ctx.stroke(); }
  };
  const disc = (x,y,rad,fill,stroke,lw) => {
    ctx.beginPath(); ctx.arc(x,y,Math.max(0.5,rad),0,TAU);
    if(fill){ ctx.fillStyle=fill; ctx.fill(); }
    if(stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=lw||1; ctx.stroke(); }
  };
  const ell = (x,y,rx,ry,fill,stroke,lw) => {
    ctx.beginPath(); ctx.ellipse(x,y,Math.max(0.5,rx),Math.max(0.5,ry),0,0,TAU);
    if(fill){ ctx.fillStyle=fill; ctx.fill(); }
    if(stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=lw||1; ctx.stroke(); }
  };
  const cyl = (x,by,rx,ry,h,col,rimCol) => {
    const ty = by - h;
    const gr = ctx.createLinearGradient(x-rx,0,x+rx,0);
    gr.addColorStop(0, shade(col,0.25)); gr.addColorStop(0.45, col); gr.addColorStop(1, shade(col,-0.38));
    ctx.beginPath();
    ctx.moveTo(x-rx,by); ctx.lineTo(x-rx,ty); ctx.lineTo(x+rx,ty); ctx.lineTo(x+rx,by);
    ctx.ellipse(x,by,rx,ry,0,0,Math.PI); ctx.closePath();
    ctx.fillStyle = gr; ctx.fill();
    if(rimCol){ ctx.strokeStyle=rimCol; ctx.lineWidth=Math.max(1,R*0.008); ctx.stroke(); }
    ell(x,ty,rx,ry,shade(col,0.22),rimCol,Math.max(1,R*0.008));
  };
  const pyrRoof = (x,by,wR,dR,hR,col,trimCol) => {
    const apex = [x, by - hR];
    poly([[x-wR,by],[x,by+dR],apex], shade(col,-0.15), trimCol, Math.max(1,R*0.008));
    poly([[x+wR,by],[x,by+dR],apex], shade(col,-0.32), trimCol, Math.max(1,R*0.008));
    return apex;
  };
  const drawFlame = (fx,fy,fw,fh,cOut,cIn) => {
    const sw = Math.sin(clockSec*11 + fx)*fw*0.25;
    poly([[fx-fw,fy],[fx-fw*0.5,fy-fh*0.55],[fx+sw,fy-fh],[fx+fw*0.5,fy-fh*0.55],[fx+fw,fy]], cOut||'#f97316');
    poly([[fx-fw*0.5,fy],[fx+sw*0.5,fy-fh*0.65],[fx+fw*0.5,fy]], cIn||'#fde047');
  };

  // 1. Optional Hex Tile + Clipped Tower Shadow
  if(opts.tile !== false){
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = theme === 'unthemed' ? '#cbd5e1' : skin.hex;
    ctx.fill();
    ctx.lineWidth = Math.max(2, R*0.055);
    ctx.strokeStyle = accent;
    ctx.stroke();

    ctx.save();
    hexPath(ctx, cx, cy, R*0.97);
    ctx.clip();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
    ctx.beginPath();
    const sx = Math.min(H*0.45, R*0.95), sy = sx*0.35;
    ctx.moveTo(cx-w, baseY-d); ctx.lineTo(cx, baseY); ctx.lineTo(cx+w, baseY-d);
    ctx.lineTo(cx+w+sx, baseY-d+sy); ctx.lineTo(cx+sx, baseY+sy); ctx.lineTo(cx-w+sx, baseY-d+sy);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  // 2. Stepped Circular / Octagonal Plinth Base (Zero Rectangular Concrete Slabs)
  const pyBase = baseY + d*0.4;
  ell(cx, pyBase + R*0.02, w*2.15, d*2.15, 'rgba(15,23,42,0.28)');
  if(theme === 'jungle' || theme === 'fiesta' || theme === 'gothic' || theme === 'medieval'){
    // Stepped 2-tier stone pedestal
    prism(ctx, cx, pyBase + d*0.2, w*2.0, d*2.0, plinth*0.55, shade(skin.plinth,-0.15), 'rgba(0,0,0,0.35)', R*0.008);
    prism(ctx, cx, pyBase - plinth*0.45 + d*0.2, w*1.65, d*1.65, plinth*0.60, skin.plinth, skin.br, R*0.008);
  } else {
    // Circular stepped drum plinth + hydraulic bumper stops
    cyl(cx, pyBase, w*1.95, d*1.95, plinth*0.55, shade(skin.plinth,-0.2), skin.br);
    cyl(cx, pyBase - plinth*0.50, w*1.60, d*1.60, plinth*0.55, skin.plinth, accent);
  }

  const y0 = baseY - plinth + d*0.4;
  const top = y0 - H;

  // 3. Gondola Geometry & BACK Half of the Ring (Drawn BEHIND the steel mast so it wraps!)
  const gy = y0 - seg*0.2 - t*(H - seg*1.4);
  const gw = w * 1.75, gd = d * 1.75, bh = R * 0.10;
  const carCol = skin.band || accent;

  ctx.fillStyle = shade(carCol, -0.55);
  ctx.beginPath();
  ctx.moveTo(cx-gw, gy); ctx.lineTo(cx, gy-gd); ctx.lineTo(cx, gy-gd-bh); ctx.lineTo(cx-gw, gy-bh);
  ctx.closePath(); ctx.fill();

  ctx.fillStyle = shade(carCol, -0.40);
  ctx.beginPath();
  ctx.moveTo(cx+gw, gy); ctx.lineTo(cx, gy-gd); ctx.lineTo(cx, gy-gd-bh); ctx.lineTo(cx+gw, gy-bh);
  ctx.closePath(); ctx.fill();

  // 4. Steel Lattice Mast (Theme-Colored Inner Core Panels + X-Bracing + Corner Chords + Accent Bands)
  ctx.fillStyle = skin.pL;
  ctx.beginPath();
  ctx.moveTo(cx-w, y0); ctx.lineTo(cx, y0+d); ctx.lineTo(cx, top+d); ctx.lineTo(cx-w, top);
  ctx.closePath(); ctx.fill();

  ctx.fillStyle = skin.pR;
  ctx.beginPath();
  ctx.moveTo(cx+w, y0); ctx.lineTo(cx, y0+d); ctx.lineTo(cx, top+d); ctx.lineTo(cx+w, top);
  ctx.closePath(); ctx.fill();

  // X-Bracing & Horizontal Girts along all levels
  ctx.strokeStyle = skin.br;
  ctx.lineWidth = Math.max(1, R*0.022);
  for(let i=0; i<=levels; i++){
    const a = y0 - i*seg, b = a - seg;
    [[-1,0],[1,0]].forEach(([s]) => {
      const x0 = cx, x1 = cx + s*w, ya0 = a + d, ya1 = a, yb0 = b + d, yb1 = b;
      ctx.beginPath(); ctx.moveTo(x0,ya0); ctx.lineTo(x1,yb1); ctx.moveTo(x1,ya1); ctx.lineTo(x0,yb0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x0,yb0); ctx.lineTo(x1,yb1); ctx.stroke();
    });
  }

  // Vertical Corner Chords
  ctx.strokeStyle = skin.post;
  ctx.lineWidth = Math.max(2, R*0.044);
  [[cx-w, 0], [cx, d], [cx+w, 0]].forEach(([x, o]) => {
    ctx.beginPath(); ctx.moveTo(x, y0+o); ctx.lineTo(x, top+o); ctx.stroke();
  });

  // Periodic Accent Stripes every 3 levels
  const bandCol = skin.band || accent;
  for(let i=2; i<=levels; i+=3){
    const a = y0 - i*seg;
    poly([[cx-w, a], [cx, a+d], [cx, a+d-seg*0.18], [cx-w, a-seg*0.18]], shade(bandCol, -0.22));
    poly([[cx+w, a], [cx, a+d], [cx, a+d-seg*0.18], [cx+w, a-seg*0.18]], bandCol);
  }

  // 5. Gondola FRONT Half & Outward-Facing Dangling Riders (Occludes the front of the steel mast!)
  ctx.fillStyle = shade(carCol, -0.28);
  ctx.beginPath();
  ctx.moveTo(cx-gw, gy); ctx.lineTo(cx, gy+gd); ctx.lineTo(cx, gy+gd-bh); ctx.lineTo(cx-gw, gy-bh);
  ctx.closePath(); ctx.fill();

  ctx.fillStyle = shade(carCol, -0.05);
  ctx.beginPath();
  ctx.moveTo(cx+gw, gy); ctx.lineTo(cx, gy+gd); ctx.lineTo(cx, gy+gd-bh); ctx.lineTo(cx+gw, gy-bh);
  ctx.closePath(); ctx.fill();

  ctx.strokeStyle = shade(carCol, 0.45);
  ctx.lineWidth = Math.max(1, R*0.022);
  ctx.beginPath();
  ctx.moveTo(cx-gw, gy-bh); ctx.lineTo(cx, gy+gd-bh); ctx.lineTo(cx+gw, gy-bh);
  ctx.stroke();

  // Outward-facing riders with dangling legs & over-the-shoulder harnesses
  const rc = ['#ef4444','#facc15','#22c55e','#3b82f6','#a855f7'];
  [-0.9, 0.9, -0.45, 0.45, 0].forEach((u, i) => {
    const x = cx + u*gw, yb = gy + gd*(1 - Math.abs(u)), r = R*0.035;
    // Dangling legs
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - r*0.9, yb + R*0.13, r*0.8, R*0.07);
    ctx.fillRect(x + r*0.1, yb + R*0.13, r*0.8, R*0.07);
    // Rider torso & OTSR harness
    ctx.fillStyle = rc[i];
    ctx.fillRect(x - r, yb + R*0.045, r*2, R*0.09);
    ctx.strokeStyle = '#facc15'; ctx.lineWidth = Math.max(1, R*0.012);
    ctx.strokeRect(x - r*0.7, yb + R*0.045, r*1.4, R*0.055);
    // Rider head
    disc(x, yb + R*0.03, r, '#fde4c8', '#1e293b', R*0.005);
  });

  // =========================================================================
  // 6. BESPOKE ARCHITECTURAL CAP TOPS (`drawCapTop` at `cBase = top + d*0.2`)
  //    Every theme crowns the steel mast with a distinct multi-story set piece!
  // =========================================================================
  const cBase = top + d*0.2;

  if(theme === 'unthemed'){
    // Standard Intamin Flared Hoist Machine Room Cap + Twin Cable Drums & Strobe Spire
    prism(ctx, cx, cBase, w*1.45, d*1.45, R*0.11, accent, '#f8fafc', R*0.008);
    prism(ctx, cx, cBase - R*0.11, w*1.10, d*1.10, R*0.06, '#334155', '#94a3b8', R*0.007);
    line([cx, cBase - R*0.17], [cx, cBase - R*0.42], '#cbd5e1', Math.max(1.5, R*0.028));
    disc(cx, cBase - R*0.43, R*0.042, Math.sin(clockSec*8)>0 ? '#ef4444' : '#fca5a5', '#ffffff', R*0.008);
  }
  else if(theme === 'fiesta'){
    // FIESTA: Spanish Colonial Mission Belltower (Campanario) with Double Bell Arches, Swinging Bronze Bells, Papel Picado & Talavera Dome!
    const cw = w * 1.68, cd = d * 1.68, bH = R * 0.28;
    // 1. Terracotta & Gold Corbelled Cornice Ledge + Papel Picado Pennants
    prism(ctx, cx, cBase, cw*1.12, cd*1.12, R*0.065, '#c2410c', '#fde047', R*0.008);
    const pCols = ['#e11d48','#facc15','#0d9488','#a855f7'];
    for(let k=0; k<4; k++){
      const fx = cx - cw + (k+0.5)*(cw*0.5), fy = cBase + cd*(1 - (k+0.5)*0.25);
      poly([[fx-R*0.025,fy],[fx+R*0.025,fy],[fx,fy+R*0.05]], pCols[k]);
    }
    // 2. Whitewashed Stucco Mission Belfry Cube (Espadaña)
    const yBel = cBase - R*0.065;
    prism(ctx, cx, yBel, cw, cd, bH, '#fffbeb', '#d97706', R*0.009);
    // Double arched bell openings on both visible isometric faces + swinging cast-bronze bells!
    const swing = Math.sin(clockSec*4.5) * R * 0.015;
    [-1, 1].forEach(side => {
      const ax = cx + side * cw * 0.48;
      const ay = yBel + cd * 0.52 - R*0.04;
      // Dark arched belfry niche
      poly([
        [ax - R*0.052, ay],
        [ax + R*0.052, ay],
        [ax + R*0.052, ay - R*0.14],
        [ax,           ay - R*0.19],
        [ax - R*0.052, ay - R*0.14]
      ], '#1c1917', '#c2410c', R*0.008);
      // Swinging Golden-Bronze Mission Bell & Clapper inside the arch
      const bx = ax + swing * side, by = ay - R*0.055;
      poly([[bx-R*0.038,by],[bx+R*0.038,by],[bx+R*0.022,by-R*0.065],[bx-R*0.022,by-R*0.065]], '#f59e0b', '#78350f', R*0.006);
      disc(bx, by+R*0.008, R*0.011, '#fef08a');
    });
    // 3. Polychrome Talavera-Tiled Cupola Drum + Ribbed Ceramic Dome & Wrought-Iron Sun-Cross Finial
    const yRoof = yBel - bH;
    prism(ctx, cx, yRoof, cw*1.08, cd*1.08, R*0.045, '#0d9488', '#fde047', R*0.008);
    const yDome = yRoof - R*0.045;
    // Ribbed Talavera Dome (Turquoise, Gold, Crimson)
    ctx.beginPath();
    ctx.arc(cx, yDome, cw*0.82, Math.PI, 0);
    ctx.closePath();
    ctx.fillStyle = '#f59e0b'; ctx.fill();
    ctx.strokeStyle = '#e11d48'; ctx.lineWidth = R*0.012; ctx.stroke();
    // Ceramic tile ribs on dome
    [-0.45, 0, 0.45].forEach(rx => {
      ctx.beginPath();
      ctx.moveTo(cx + rx*cw*0.8, yDome);
      ctx.quadraticCurveTo(cx + rx*cw*0.5, yDome - cw*0.65, cx, yDome - cw*0.82);
      ctx.strokeStyle = rx===0 ? '#fde047' : '#0d9488'; ctx.lineWidth = R*0.014; ctx.stroke();
    });
    // Golden lantern & Wrought-Iron Mission Cross at the apex
    const topCross = yDome - cw*0.82;
    disc(cx, topCross, R*0.032, '#facc15', '#78350f', R*0.007);
    line([cx, topCross], [cx, topCross - R*0.16], '#facc15', R*0.018);
    line([cx - R*0.055, topCross - R*0.10], [cx + R*0.055, topCross - R*0.10], '#facc15', R*0.016);
  }
  else if(theme === 'bavarian'){
    // BAVARIAN: Munich Rathaus Glockenspiel Clocktower with Dancing Figurine Balcony, Half-Timbered Gables, 2 Giant Clock Faces & Copper Onion Dome!
    const cw = w * 1.72, cd = d * 1.72, cH = R * 0.28;
    // 1. Cantilevered Carousel Balcony with Blue-and-White Lozenge Frieze & Dancing Glockenspiel Figurines!
    prism(ctx, cx, cBase, cw*1.18, cd*1.18, R*0.065, '#2563eb', '#f5c542', R*0.009);
    prism(ctx, cx, cBase - R*0.065, cw*1.05, cd*1.05, R*0.075, '#78350f', '#f5c542', R*0.007);
    // Rotating miniature jousting knights & dancers on the Glockenspiel balcony
    for(let f=0; f<5; f++){
      const ang = (clockSec*1.8 + f*TAU/5) % TAU;
      if(Math.sin(ang) > -0.2){
        const fx = cx + Math.cos(ang)*cw*0.75, fy = cBase - R*0.08 + Math.sin(ang)*cd*0.45;
        disc(fx, fy, R*0.020, f%2 ? '#ef4444' : '#fde047', '#ffffff', R*0.005);
      }
    }
    // 2. Half-Timbered (Fachwerk) Cream Stucco Clocktower Belfry + Twin Ornate Gold Astronomical Clock Faces!
    const yClk = cBase - R*0.14;
    prism(ctx, cx, yClk, cw, cd, cH, '#fffbeb', '#451a03', R*0.010);
    // Timber cross-framing on both faces
    line([cx-cw, yClk], [cx, yClk+cd-cH], '#451a03', R*0.012);
    line([cx+cw, yClk], [cx, yClk+cd-cH], '#451a03', R*0.012);
    // Left & Right Isometric Clock Faces with Roman Ring & Rotating Hands
    [-0.52, 0.52].forEach(side => {
      const kx = cx + side * cw, ky = yClk + cd*0.48 - cH*0.52;
      ell(kx, ky, R*0.065, R*0.078, '#1e3a8a', '#f5c542', R*0.014);
      ell(kx, ky, R*0.042, R*0.050, '#fffbeb', '#d97706', R*0.006);
      const hAng = clockSec * 1.5;
      line([kx, ky], [kx + Math.cos(hAng)*R*0.035, ky + Math.sin(hAng)*R*0.042], '#f5c542', R*0.010);
      line([kx, ky], [kx, ky - R*0.048], '#ef4444', R*0.008);
      disc(kx, ky, R*0.010, '#f5c542');
    });
    // 3. Steep Red-Tile Gable Pediments + Verdigris Copper Onion Dome (Zwiebelturm) & Golden Sun Spire!
    const yGable = yClk - cH;
    pyrRoof(cx, yGable, cw*1.12, cd*1.12, R*0.12, '#b91c1c', '#f5c542');
    // Bulbous Copper-Green Onion Dome rising out of the gable peak
    const yOnion = yGable - R*0.13;
    const rOn = R * 0.125;
    ctx.beginPath();
    ctx.moveTo(cx - rOn*0.55, yOnion + R*0.04);
    ctx.bezierCurveTo(cx - rOn*1.35, yOnion - rOn*0.3, cx - rOn*0.9, yOnion - rOn*1.3, cx, yOnion - rOn*2.1);
    ctx.bezierCurveTo(cx + rOn*0.9, yOnion - rOn*1.3, cx + rOn*1.35, yOnion - rOn*0.3, cx + rOn*0.55, yOnion + R*0.04);
    ctx.closePath();
    const gOn = ctx.createLinearGradient(cx-rOn, 0, cx+rOn, 0);
    gOn.addColorStop(0, '#2dd4bf'); gOn.addColorStop(0.5, '#0d9488'); gOn.addColorStop(1, '#115e59');
    ctx.fillStyle = gOn; ctx.fill();
    ctx.strokeStyle = '#f5c542'; ctx.lineWidth = R*0.010; ctx.stroke();
    line([cx, yOnion - rOn*2.1], [cx, yOnion - rOn*2.9], '#f5c542', R*0.016);
    disc(cx, yOnion - rOn*2.4, R*0.022, '#f5c542', '#78350f', R*0.005);
  }
  else if(theme === 'jungle'){
    // JUNGLE: Mayan Spiritual Sacrificial Altar & Stepped Temple Sanctuary with Chaac Mask, Serpent Heads & Roaring Fire Cauldron!
    const cw = w * 1.75, cd = d * 1.75;
    // 1. Corbelled 2-tier limestone overhangs with Turquoise/Gold Talud-Tablero Frieze
    prism(ctx, cx, cBase, cw*1.05, cd*1.05, R*0.06, '#8e8a72', '#4a4737', R*0.008);
    prism(ctx, cx, cBase - R*0.06, cw*1.22, cd*1.22, R*0.075, '#137a70', '#eab308', R*0.009);
    // 2. Upper Temple Sanctuary Shrine + Projecting Carved Feathered-Serpent Heads on Left & Right!
    const yShr = cBase - R*0.135, sH = R * 0.24;
    prism(ctx, cx, yShr, cw*0.95, cd*0.95, sH, '#c7bfa4', '#4a4737', R*0.009);
    // Projecting Kukulkan Serpent Heads with Jade Eyes & White Fangs on both flanks
    [-1, 1].forEach(s => {
      const sx = cx + s * cw * 1.28, sy = yShr - R*0.05;
      poly([[sx-s*R*0.08,sy],[sx+s*R*0.06,sy-R*0.06],[sx+s*R*0.06,sy+R*0.04],[sx-s*R*0.08,sy+R*0.05]], '#a8a084', '#4a4737', R*0.007);
      disc(sx, sy-R*0.02, R*0.015, '#2fbf9a');
      poly([[sx,sy+R*0.04],[sx+s*R*0.02,sy+R*0.085],[sx+s*R*0.04,sy+R*0.04]], '#ffffff');
    });
    // Giant Carved Chaac Rain-God Mask & Glowing Jade Idol Portal on front of sanctuary
    const mx = cx, my = yShr + cd*0.45 - sH*0.48;
    poly([[mx-R*0.065,my+R*0.08],[mx+R*0.065,my+R*0.08],[mx+R*0.045,my-R*0.06],[mx-R*0.045,my-R*0.06]], '#0f172a', '#eab308', R*0.009);
    disc(mx - R*0.028, my - R*0.01, R*0.016, '#2fbf9a', '#fef08a', R*0.004);
    disc(mx + R*0.028, my - R*0.01, R*0.016, '#2fbf9a', '#fef08a', R*0.004);
    // 3. Stepped Roof-Comb (Crestería) + Sacrificial Stone Fire-Altar Cauldron (erupts higher when car is near top!)
    const yComb = yShr - sH;
    prism(ctx, cx, yComb, cw*0.72, cd*0.72, R*0.09, '#a8a084', '#eab308', R*0.008);
    const yBowl = yComb - R*0.09;
    ell(cx, yBowl, R*0.12, R*0.05, '#451a03', '#eab308', R*0.010);
    const boost = (t > 0.80) ? 1.55 : 1.0;
    drawFlame(cx, yBowl, R*0.095*boost, R*0.26*boost, '#f97316', '#fef08a');
  }
  else if(theme === 'western'){
    // WILD WEST: Spindletop Timber Oil-Rig Crown-Block Platform, Side Water Tank, Twin Iron Sheave Pulleys & Erupting Black-Gold Oil Gusher!
    const cw = w * 1.78, cd = d * 1.78;
    // 1. Diagonal Timber Knee-Braces supporting the cantilevered Crown-Block Deck
    line([cx-w, cBase+R*0.12], [cx-cw, cBase], '#5a3b22', R*0.024);
    line([cx+w, cBase+R*0.12], [cx+cw, cBase], '#5a3b22', R*0.024);
    prism(ctx, cx, cBase, cw, cd, R*0.065, '#8a5a33', '#451a03', R*0.009);
    // Wooden safety railings & "GUSHER No. 7" sign board around the platform
    const yDeck = cBase - R*0.065;
    line([cx-cw, yDeck], [cx-cw, yDeck-R*0.09], '#5a3b22', R*0.014);
    line([cx, yDeck+cd], [cx, yDeck+cd-R*0.09], '#5a3b22', R*0.014);
    line([cx+cw, yDeck], [cx+cw, yDeck-R*0.09], '#5a3b22', R*0.014);
    line([cx-cw, yDeck-R*0.08], [cx, yDeck+cd-R*0.08], '#9a6a3c', R*0.012);
    line([cx, yDeck+cd-R*0.08], [cx+cw, yDeck-R*0.08], '#9a6a3c', R*0.012);
    // 2. Cantilevered Redwood Water Barrel Tank on the left side of the rig top
    cyl(cx - cw*0.72, yDeck - R*0.01, R*0.075, R*0.038, R*0.14, '#9a3412', '#27272a');
    // 3. Heavy Timber A-Frame Gin-Pole & Twin Spinning Cast-Iron Crown-Block Sheave Wheels!
    const yFrame = yDeck - R*0.18;
    line([cx-w*0.8, yDeck], [cx-w*0.35, yFrame], '#451a03', R*0.028);
    line([cx+w*0.8, yDeck], [cx+w*0.35, yFrame], '#451a03', R*0.028);
    line([cx-w*0.5, yFrame], [cx+w*0.5, yFrame], '#b91c1c', R*0.026);
    [-0.28, 0.28].forEach(sx => {
      const wx = cx + sx*w, wy = yFrame;
      disc(wx, wy, R*0.062, '#27272a', '#f59e0b', R*0.010);
      for(let k=0; k<6; k++){
        const a = t*8 + k*TAU/6;
        line([wx,wy], [wx+Math.cos(a)*R*0.055, wy+Math.sin(a)*R*0.055], '#f59e0b', R*0.008);
      }
      disc(wx, wy, R*0.018, '#b91c1c');
    });
    // 4. Massive Erupting Black-Gold Crude Oil Gusher Plume shooting out of the wellhead pipe!
    const gushBoost = (t > 0.78) ? 1.45 : 1.0;
    const gH = R * (0.28 * gushBoost + 0.04 * Math.sin(clockSec*12));
    const gyTop = yFrame - R*0.02;
    poly([
      [cx - R*0.035, gyTop],
      [cx - R*0.16*gushBoost, gyTop - gH*0.85],
      [cx,                    gyTop - gH*1.12],
      [cx + R*0.16*gushBoost, gyTop - gH*0.85],
      [cx + R*0.035, gyTop]
    ], '#0f172a', '#334155', R*0.008);
    // Falling black-gold oil droplets & foam crest
    [-1, 0, 1].forEach(s => {
      disc(cx + s*R*0.12*gushBoost, gyTop - gH*(0.82 - Math.abs(s)*0.12), R*0.038, '#1e293b', '#f59e0b', R*0.005);
    });
  }
  else if(theme === 'classic'){
    // CLASSIC MIDWAY: Victorian Helter-Skelter Lighthouse Lantern Room, Rotating Searchlight Beam & Striped Big-Top Cupola!
    const cw = w * 1.65, cd = d * 1.65;
    cyl(cx, cBase, cw*1.08, cd*1.08, R*0.06, '#b91c1c', '#f5c542');
    // White Victorian Balustrade Gallery
    const yGal = cBase - R*0.06;
    ell(cx, yGal - R*0.04, cw*1.05, cd*1.05, null, '#ffffff', R*0.010);
    // Glowing Crystal Fresnel Lens Lantern Drum + Sweeping Searchlight Beam!
    const yLan = yGal - R*0.20;
    cyl(cx, yGal, cw*0.78, cd*0.78, R*0.20, '#fef08a', '#f59e0b');
    const beamX = Math.cos(clockSec*2.4) * R * 0.48;
    const beamY = Math.sin(clockSec*2.4) * R * 0.16;
    poly([[cx, yGal-R*0.10], [cx+beamX, yGal-R*0.18+beamY], [cx+beamX, yGal-R*0.02+beamY]], 'rgba(254, 240, 138, 0.42)');
    // Red & Cream Striped Conical Cupola + Fluttering Carnival Pennant
    const apex = pyrRoof(cx, yLan, cw*1.05, cd*1.05, R*0.20, '#e11d48', '#f5c542');
    line(apex, [apex[0], apex[1]-R*0.14], '#f5c542', R*0.014);
    poly([[apex[0],apex[1]-R*0.14], [apex[0]+R*0.13,apex[1]-R*0.10], [apex[0],apex[1]-R*0.06]], '#2563eb', '#f5c542', R*0.006);
  }
  else if(theme === 'frontier'){
    // FRONTIER: National Park Log Fire-Lookout Cabin, Wrap-Around Catwalk, Stone Chimney & Perched Bald Eagle!
    const cw = w * 1.75, cd = d * 1.75;
    // Log knee braces & cantilevered timber catwalk deck
    line([cx-w, cBase+R*0.12], [cx-cw, cBase], '#4a3320', R*0.024);
    line([cx+w, cBase+R*0.12], [cx+cw, cBase], '#4a3320', R*0.024);
    prism(ctx, cx, cBase, cw, cd, R*0.055, '#8a5a33', '#3e2723', R*0.009);
    // Rustic Log & Glass Fire-Watch Cabin
    const yCab = cBase - R*0.055, cabH = R * 0.22;
    prism(ctx, cx, yCab, cw*0.82, cd*0.82, cabH, '#6b4a2b', '#2e1f14', R*0.009);
    // Warm glowing lantern windows on both faces
    poly([[cx-cw*0.68, yCab-R*0.05], [cx-R*0.02, yCab+cd*0.65-R*0.05], [cx-R*0.02, yCab+cd*0.65-cabH+R*0.03], [cx-cw*0.68, yCab-cabH+R*0.03]], '#fde047', '#3e2723', R*0.007);
    poly([[cx+R*0.02, yCab+cd*0.65-R*0.05], [cx+cw*0.68, yCab-R*0.05], [cx+cw*0.68, yCab-cabH+R*0.03], [cx+R*0.02, yCab+cd*0.65-cabH+R*0.03]], '#f59e0b', '#3e2723', R*0.007);
    // Forest-Green Shingle Hip Roof + River-Stone Chimney + Giant Outstretched Bald Eagle at Peak!
    const yRoof = yCab - cabH;
    prism(ctx, cx + cw*0.55, yRoof + R*0.04, R*0.045, R*0.025, R*0.14, '#787d85', '#334155', R*0.006);
    const apex = pyrRoof(cx, yRoof, cw*1.08, cd*1.08, R*0.18, '#2f5f3a', '#eab308');
    // Perched Bald Eagle with Outstretched Wings
    poly([apex, [apex[0]-R*0.16, apex[1]-R*0.09], [apex[0]-R*0.04, apex[1]-R*0.02]], '#4a3320', '#eab308', R*0.005);
    poly([apex, [apex[0]+R*0.16, apex[1]-R*0.09], [apex[0]+R*0.04, apex[1]-R*0.02]], '#4a3320', '#eab308', R*0.005);
    disc(apex[0], apex[1]-R*0.06, R*0.024, '#f8fafc', '#4a3320', R*0.005);
    disc(apex[0]+R*0.015, apex[1]-R*0.06, R*0.010, '#f59e0b');
  }
  else if(theme === 'space'){
    // SPACE: Orbital Mass-Driver Telemetry Array, 3 Parabolic Dishes, Toroidal Coils & Levitating Plasma Singularity Core!
    const cw = w * 1.70, cd = d * 1.70;
    cyl(cx, cBase, cw, cd, R*0.07, '#0f172a', '#38bdf8');
    // 2 Floating Chrome & Cyan Toroidal Accelerator Rings
    [R*0.13, R*0.23].forEach((zOff, idx) => {
      ell(cx, cBase - zOff, cw*(0.92 - idx*0.15), cd*(0.92 - idx*0.15), '#1e293b', idx%2 ? '#a855f7' : '#38bdf8', R*0.014);
    });
    // Left & Right Cantilevered Parabolic Deep-Space Telemetry Dishes
    [-1, 1].forEach(s => {
      const dx = cx + s * cw * 1.18, dy = cBase - R*0.14;
      line([cx + s*cw*0.5, cBase - R*0.10], [dx, dy], '#cbd5e1', R*0.016);
      ell(dx, dy, R*0.045, R*0.068, '#e2e8f0', '#0284c7', R*0.008);
      disc(dx + s*R*0.02, dy, R*0.014, '#38bdf8');
    });
    // Levitating Plasma Singularity Sphere & Orbital Gyro-Rings at the Apex!
    const orbY = cBase - R*0.38;
    ell(cx, orbY, R*0.16, R*0.055, null, '#38bdf8', R*0.012);
    ell(cx, orbY, R*0.055, R*0.14, null, '#a855f7', R*0.010);
    disc(cx, orbY, R*0.072, '#090d16', '#38bdf8', R*0.012);
    disc(cx, orbY, R*0.042, t > 0.8 ? '#f43f5e' : '#38bdf8');
    disc(cx - R*0.015, orbY - R*0.015, R*0.016, '#ffffff');
  }
  else if(theme === 'gothic'){
    // GOTHIC: Haunted Cathedral Gargoyle Belfry, Crimson Rose-Clock Window, 4 Winged Gargoyles & Crooked Witch-Hat Spire!
    const cw = w * 1.62, cd = d * 1.62, bH = R * 0.28;
    prism(ctx, cx, cBase, cw*1.12, cd*1.12, R*0.06, '#27272a', '#991b1b', R*0.008);
    const yBel = cBase - R*0.06;
    prism(ctx, cx, yBel, cw, cd, bH, '#18181b', '#52525b', R*0.010);
    // Glowing Crimson Stained-Glass Rose Window on front-right face & Pointed Lancet on front-left face
    const rx = cx + cw*0.48, ry = yBel + cd*0.48 - bH*0.52;
    disc(rx, ry, R*0.065, '#991b1b', '#facc15', R*0.010);
    disc(rx, ry, R*0.032, '#ef4444');
    const lx = cx - cw*0.48, ly = yBel + cd*0.48 - bH*0.52;
    poly([[lx-R*0.04,ly+R*0.07],[lx+R*0.04,ly+R*0.07],[lx,ly-R*0.08]], '#c084fc', '#52525b', R*0.007);
    // 4 Projecting Winged Stone Gargoyles perched on the belfry cornice!
    const yCorn = yBel - bH;
    [-1, 1].forEach(s => {
      const gx = cx + s*cw, gy = yCorn;
      poly([[gx,gy], [gx+s*R*0.15,gy-R*0.08], [gx+s*R*0.09,gy+R*0.03]], '#52525b', '#09090b', R*0.007);
      disc(gx+s*R*0.11, gy-R*0.03, R*0.011, '#ef4444');
    });
    // Steep Crooked Slate Witch-Hat Spire & Wrought-Iron Cross Finial
    const apex = pyrRoof(cx, yCorn, cw*1.10, cd*1.10, R*0.30, '#09090b', '#991b1b');
    line(apex, [apex[0], apex[1]-R*0.14], '#a1a1aa', R*0.014);
    line([apex[0]-R*0.045, apex[1]-R*0.09], [apex[0]+R*0.045, apex[1]-R*0.09], '#a1a1aa', R*0.012);
  }
  else if(theme === 'medieval'){
    // MEDIEVAL: Royal Crenellated Siege Keep Watchtower, Heraldic Shields, Conical Turret Roof & 4 Swallowtail Pennants!
    const cw = w * 1.72, cd = d * 1.72, kH = R * 0.24;
    // Corbelled stone machicolation gallery
    prism(ctx, cx, cBase, cw*1.15, cd*1.15, R*0.07, '#64748b', '#1e293b', R*0.008);
    const yKeep = cBase - R*0.07;
    prism(ctx, cx, yKeep, cw, cd, kH, '#cbd5e1', '#475569', R*0.009);
    // Crenellated Battlement Merlons & Heraldic Lion Shields along the parapet
    const yMer = yKeep - kH;
    [-0.65, 0, 0.65].forEach((u, idx) => {
      const mx = cx + u*cw, my = yKeep + (1 - Math.abs(u))*cd - kH*0.5;
      poly([[mx-R*0.035,my-R*0.04],[mx+R*0.035,my-R*0.04],[mx+R*0.035,my+R*0.02],[mx,my+R*0.05],[mx-R*0.035,my+R*0.02]], idx%2 ? '#b91c1c' : '#1d4ed8', '#eab308', R*0.007);
    });
    // Steep Royal-Blue Conical Slate Turret Roof + Golden Crown Finial & Fluttering Pennant!
    const apex = pyrRoof(cx, yMer, cw*1.08, cd*1.08, R*0.26, '#1d4ed8', '#eab308');
    const fTop = [apex[0], apex[1] - R*0.15];
    line(apex, fTop, '#eab308', R*0.016);
    const wv = Math.sin(clockSec*5)*R*0.015;
    poly([fTop, [fTop[0]+R*0.15,fTop[1]+R*0.02+wv], [fTop[0]+R*0.10,fTop[1]+R*0.05+wv], [fTop[0]+R*0.15,fTop[1]+R*0.08+wv], [fTop[0],fTop[1]+R*0.07]], '#b91c1c', '#eab308', R*0.006);
  }
  else if(theme === 'alps'){
    // ALPS: Snow-Capped Swiss Chalet Cuckoo-Clock House, Hanging Ice Icicles & Spinning Red Cable-Car Bullwheel!
    const cw = w * 1.75, cd = d * 1.75, cH = R * 0.22;
    // 1. Horizontal Spinning Red Funicular Haul-Rope Bullwheel mounted directly under the chalet deck!
    ell(cx, cBase + R*0.02, cw*1.18, cd*1.18, '#dc2626', '#facc15', R*0.014);
    prism(ctx, cx, cBase, cw, cd, cH, '#9a6a3c', '#451a03', R*0.009);
    // Red-and-white painted Swiss chalet window shutters & flower boxes
    [-0.5, 0.5].forEach(s => {
      const wx = cx + s*cw*0.9, wy = cBase + cd*0.45 - cH*0.5;
      disc(wx, wy, R*0.032, '#fde047', '#dc2626', R*0.008);
    });
    // 2. Deep Overhanging Snow-Blanketed Chalet Roof with Hanging Blue-Ice Icicles!
    const yRoof = cBase - cH;
    const apex = pyrRoof(cx, yRoof, cw*1.28, cd*1.28, R*0.20, '#f8fafc', '#93c5fd');
    for(let k=-3; k<=3; k++){
      const ix = cx + k*cw*0.34, iy = yRoof + (1 - Math.abs(k)/3.5)*cd*1.15;
      poly([[ix-R*0.015,iy],[ix+R*0.015,iy],[ix,iy+R*0.065]], '#bae6fd');
    }
    // Swiss Cross Summit Pennant
    line(apex, [apex[0], apex[1]-R*0.12], '#facc15', R*0.014);
    poly([[apex[0],apex[1]-R*0.12],[apex[0]+R*0.10,apex[1]-R*0.08],[apex[0],apex[1]-R*0.04]], '#dc2626', '#ffffff', R*0.006);
  }
  else if(theme === 'nordic'){
    // NORDIC: 2-Tiered Norwegian Stave-Church Belfry, Shield-Rimmed Gallery, 4 Golden Dragon-Head Prows & Crackling Mjölnir Hammer!
    const cw = w * 1.72, cd = d * 1.72, sH = R * 0.22;
    prism(ctx, cx, cBase, cw*1.12, cd*1.12, R*0.06, '#451a03', '#d97706', R*0.009);
    // Viking Round Shields mounted around the gallery rim
    [-0.7, -0.25, 0.25, 0.7].forEach((u, idx) => {
      const sx = cx + u*cw*1.1, sy = cBase + (1 - Math.abs(u))*cd*1.1 - R*0.03;
      disc(sx, sy, R*0.032, idx%2 ? '#991b1b' : '#0284c7', '#f59e0b', R*0.006);
      disc(sx, sy, R*0.010, '#fde047');
    });
    // Dark-Tarred Stave Belfry & Steep Shingled Pyramid Roof
    const yStave = cBase - R*0.06;
    prism(ctx, cx, yStave, cw*0.88, cd*0.88, sH, '#290f02', '#d97706', R*0.009);
    const yRoof = yStave - sH;
    const apex = pyrRoof(cx, yRoof, cw*1.15, cd*1.15, R*0.22, '#1e293b', '#f59e0b');
    // 2 Projecting Golden Open-Jawed Viking Dragon-Head Gable Prows (Drakhuvud)
    [-1, 1].forEach(s => {
      const dx = cx + s*cw*1.05, dy = yRoof - R*0.04;
      line([dx, dy], [dx + s*R*0.11, dy - R*0.09], '#f59e0b', R*0.022);
      disc(dx + s*R*0.12, dy - R*0.10, R*0.022, '#dc2626', '#fde047', R*0.006);
    });
    // Forged Iron & Gold Mjölnir (Thor's Hammer) Crackling with Bifrost Lightning at the Apex!
    const hY = apex[1] - R*0.08;
    disc(cx, hY, R*0.085, null, '#38bdf8', R*0.010);
    line(apex, [cx, hY], '#f59e0b', R*0.022);
    poly([[cx-R*0.075,hY-R*0.03],[cx+R*0.075,hY-R*0.03],[cx+R*0.06,hY+R*0.025],[cx-R*0.06,hY+R*0.025]], '#94a3b8', '#f59e0b', R*0.008);
    disc(cx, hY, R*0.018, '#38bdf8');
  }
}
/* ===== END SPRITE CODE ===== */
return drawDropTower;
})();
window.drawDropTower = DropTowerSkinPack;
