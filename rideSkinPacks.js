/* Procedural ride skins and coaster/land sprites sourced from the supplied sprite packs. */

const dinerSkinPack = (() => {

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

/* ===== DINER / RESTAURANT THEME METADATA (UNTHEMED + 11 HEAVY/IMMERSIVE SKINS) ===== */
const DINER_SKINS = {
  unthemed: {id:'unthemed', label:'Unthemed (Tier 0–2)', name:'Standard Park Diner',     sub:'Baseline Modern Counter-Service Grill', hex:'#cbd5e1', border:'#ef4444'},
  classic:  {id:'classic',  label:'Classic Midway',      name:'Midway Burger Pavilion',  sub:'1950s Rooftop Burger & Malt Drive-In',  hex:'#cbb07c', border:'#d9342b'},
  jungle:   {id:'jungle',   label:'Jungle',              name:'Temple Tiki Feast Hall',  sub:'Mesoamerican Palapa & Ember Rotisserie',hex:'#587c48', border:'#2fbf9a'},
  western:  {id:'western',  label:'Wild West',           name:'Golden Nugget Saloon',    sub:'2-Story False-Front Saloon & BBQ Pit',  hex:'#c99a62', border:'#8a5a33'},
  frontier: {id:'frontier', label:'Frontier',            name:'Timber Smokehouse Lodge', sub:'Notched Pine Logs & River-Stone Hearth',hex:'#7d955d', border:'#566e42'},
  space:    {id:'space',    label:'Space',               name:'Orbital Hydro-Ring Cafe', sub:'Levitating Saucer Pod & Plasma Lounge', hex:'#334155', border:'#0ea5e9'},
  gothic:   {id:'gothic',   label:'Gothic',              name:'Gargoyle Crypt Tavern',   sub:'Rose Window Abbey & Candlelit Banquet', hex:'#3b3345', border:'#991b1b'},
  medieval: {id:'medieval', label:'Medieval',            name:'Royal Jousting Meadery',  sub:'Half-Timbered Tudor Hall & Stone Oven', hex:'#6c8c58', border:'#eab308'},
  alps:     {id:'alps',     label:'Alps',                name:'Matterhorn Fondue Chalet',sub:'Snow-Laden Eaves, Skis & Sun Deck',     hex:'#a8c5d6', border:'#0284c7'},
  fiesta:   {id:'fiesta',   label:'Fiesta',              name:'Hacienda Cantina Grill',  sub:'Talavera Arches, Bell Gable & Picado',  hex:'#d99b52', border:'#e11d48'},
  nordic:   {id:'nordic',   label:'Nordic',              name:'Dragon Longhouse Hall',   sub:'Stave-Church Tiers, Shields & Braziers',hex:'#4d6b63', border:'#d97706'},
  bavarian: {id:'bavarian', label:'Bavarian',            name:'Oktoberfest Bierhalle',   sub:'Lozenge Gable, Clock Tower & Barrels',  hex:'#769958', border:'#2563eb'}
};

/* ===== SPRITE CODE: copy this block into engine.js ===== */
/**
 * drawDiner(ctx, cx, cy, R, opts)
 *  opts.accent        : Land / chain accent color (default '#ef4444')
 *  opts.themeId       : 'classic'|'jungle'|'western'|'wildwest'|'frontier'|'space'|'gothic'|'medieval'|'alps'|'fiesta'|'nordic'|'bavarian'
 *  opts.rideThemeTier : 0..4 (<=2 draws Standard Unthemed; >=3 draws Heavy/Immersive Themed Architecture)
 *  opts.flip          : true when called under horizontal mirror
 *  opts.tile          : draw the hex tile background (default true)
 */
function drawDiner(ctx, cx, cy, R, o={}){
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTheme = String(o.themeId || o.theme || 'unthemed').toLowerCase();
  if(rawTheme === 'wildwest' || rawTheme === 'wild_west') rawTheme = 'western';
  const theme = (tier <= 2 || !DINER_SKINS[rawTheme]) ? 'unthemed' : rawTheme;
  const skin = DINER_SKINS[theme] || DINER_SKINS.unthemed;
  const accent = o.accent || skin.border || '#ef4444';
  const fl = o.flip ? -1 : 1;

  // Upscale building & outdoor dining props by ~22% while keeping the hex tile radius Hr unchanged
  const Hr = R;
  R = R * 1.22;

  const Q = (X,Y,Z) => [cx + (X - Y)*0.7, cy + (X + Y)*0.35 - Z];
  const poly = (pts,fill,stroke,lw) => {
    ctx.beginPath();
    pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.012;ctx.stroke();}
  };
  const line = (a,b,c,w) => {
    ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
  };
  const ell = (x,y,rx,ry,fill,stroke,lw) => {
    ctx.beginPath();ctx.ellipse(x,y,Math.max(0.5,rx),Math.max(0.5,ry),0,0,Math.PI*2);
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||1;ctx.stroke();}
  };
  const box = (x0,x1,y0,y1,z0,z1,cf,ce,ct,stroke,lw) => {
    poly([Q(x0,y1,z0),Q(x1,y1,z0),Q(x1,y1,z1),Q(x0,y1,z1)],cf,stroke,lw);
    poly([Q(x1,y0,z0),Q(x1,y1,z0),Q(x1,y1,z1),Q(x1,y0,z1)],ce,stroke,lw);
    if(ct) poly([Q(x0,y0,z1),Q(x1,y0,z1),Q(x1,y1,z1),Q(x0,y1,z1)],ct,stroke,lw);
  };
  const frontText = (xa, xb, y, zTop, zH, txt, fg, fontFam) => {
    const so = Q(xa, y, zTop);
    ctx.save();
    ctx.transform(0.7, 0.35, 0, 1, so[0], so[1]);
    ctx.fillStyle = fg || '#f8fafc';
    ctx.font = 'bold ' + Math.round(zH * 0.68) + 'px ' + (fontFam || 'Arial Black, Arial, sans-serif');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(txt, (xb - xa)/2, zH/2, (xb - xa)*0.95);
    ctx.restore();
  };
  const patioUmbrella = (X, Y, z0, tableCol, umbCol1, umbCol2, poleCol) => {
    const b = Q(X, Y, z0);
    ell(b[0]+fl*R*0.035, b[1]+R*0.01, R*0.085, R*0.038, 'rgba(15,23,42,.24)');
    [[-1,0],[1,0]].forEach(([s])=>{
      const c = Q(X+s*R*0.085, Y-s*R*0.085, z0);
      ctx.fillStyle = poleCol || '#64748b';
      ctx.fillRect(c[0]-R*0.014, c[1]-R*0.048, R*0.028, R*0.048);
    });
    line(b, [b[0], b[1]-R*0.165], poleCol || '#94a3b8', R*0.015);
    ell(b[0], b[1]-R*0.05, R*0.062, R*0.028, tableCol || '#e2e8f0', 'rgba(15,23,42,.3)', R*0.006);
    const u = [b[0], b[1]-R*0.19];
    ell(u[0], u[1], R*0.112, R*0.052, umbCol1, shade(umbCol1,-0.3), R*0.008);
    ell(u[0], u[1], R*0.062, R*0.028, umbCol2);
  };

  // 1. Optional Hex Tile Base (uses original unscaled Hr so hex size remains standard)
  if(o.tile !== false){
    hexPath(ctx, cx, cy, Hr);
    ctx.fillStyle = theme === 'unthemed' ? '#cbd5e1' : skin.hex;
    ctx.fill();
    ctx.lineWidth = Math.max(2, Hr*0.055);
    ctx.strokeStyle = accent;
    ctx.stroke();
  }

  const x0 = -R*0.42, x1 = R*0.42, y0 = -R*0.23, y1 = R*0.23, H = R*0.22, z0 = 0;

  // Soft ambient ground shadow directly beneath the building (NO rectangular concrete slab!)
  const drawBuildingShadow = (xa, xb, ya, yb) => {
    ctx.save();
    ctx.translate(fl*R*0.07, R*0.035);
    poly([Q(xa,ya,0),Q(xb,ya,0),Q(xb,yb,0),Q(xa,yb,0)], 'rgba(15,23,42,.25)');
    ctx.restore();
  };

  /* =====================================================================
   * VARIANT 1: UNTHEMED STANDARD (rideThemeTier <= 2: None, Light, Medium)
   * ===================================================================== */
  if(theme === 'unthemed'){
    drawBuildingShadow(x0-R*0.02, x1+R*0.02, y0-R*0.02, y1+R*0.03);
    // Subtle entrance threshold mat
    poly([Q(-R*0.10,y1,0),Q(R*0.12,y1,0),Q(R*0.12,y1+R*0.07,0),Q(-R*0.10,y1+R*0.07,0)], 'rgba(15,23,42,.16)');
    // Walls: front long face (+Y) and end face (+X)
    box(x0, x1, y0, y1, z0, H, '#f1f5f9', '#cbd5e1', null);
    // Accent band under the roofline
    poly([Q(x0,y1,R*0.155),Q(x1,y1,R*0.155),Q(x1,y1,H),Q(x0,y1,H)], accent);
    poly([Q(x1,y0,R*0.155),Q(x1,y1,R*0.155),Q(x1,y1,H),Q(x1,y0,H)], shade(accent,-0.25));
    // Glass windows + reflections
    const glass = (xa,xb,za,zb)=>{
      poly([Q(xa,y1,za),Q(xb,y1,za),Q(xb,y1,zb),Q(xa,y1,zb)],'#7dd3fc','#475569',R*0.01);
      poly([Q(xa+(xb-xa)*0.1,y1,zb),Q(xa+(xb-xa)*0.28,y1,zb),Q(xa+(xb-xa)*0.14,y1,za),Q(xa+(xb-xa)*0.04,y1,za)],'rgba(255,255,255,.45)');
      for(let k=1;k<3;k++){const x=xa+(xb-xa)*k/3;line(Q(x,y1,za),Q(x,y1,zb),'#475569',R*0.008);}
    };
    glass(-R*0.38, -R*0.08, R*0.04, R*0.125);
    glass( R*0.10,  R*0.38, R*0.04, R*0.125);
    // Center door + handle
    poly([Q(-R*0.05,y1,z0),Q(R*0.07,y1,z0),Q(R*0.07,y1,R*0.125),Q(-R*0.05,y1,R*0.125)], shade(accent,-0.55), '#e2e8f0', R*0.01);
    const h = Q(R*0.05, y1, R*0.07); ell(h[0], h[1], R*0.009, R*0.009, '#fde68a');
    // End window
    poly([Q(x1,-R*0.14,R*0.04),Q(x1,R*0.14,R*0.04),Q(x1,R*0.14,R*0.125),Q(x1,-R*0.14,R*0.125)],'#38bdf8','#475569',R*0.01);
    // Flat parapet roof + AC box
    poly([Q(x0,y0,H),Q(x1,y0,H),Q(x1,y1,H),Q(x0,y1,H)], shade(accent,-0.15));
    poly([Q(x0+R*0.04,y0+R*0.04,H),Q(x1-R*0.04,y0+R*0.04,H),Q(x1-R*0.04,y1-R*0.04,H),Q(x0+R*0.04,y1-R*0.04,H)], shade(accent,0.2));
    box(R*0.20, R*0.32, -R*0.10, R*0.02, H, H+R*0.045, '#64748b', '#475569', '#94a3b8');
    // Striped front awning
    const n=8, ax0=x0+R*0.02, ax1=x1-R*0.02;
    for(let i=0;i<n;i++){
      const a=ax0+(ax1-ax0)*i/n, b=ax0+(ax1-ax0)*(i+1)/n;
      poly([Q(a,y1,R*0.175),Q(b,y1,R*0.175),Q(b,y1+R*0.065,R*0.148),Q(a,y1+R*0.065,R*0.148)], i%2?'#f8fafc':accent);
    }
    // Rooftop "DINER" sign
    const sa=-R*0.28, sb=R*0.14, sz0=H+R*0.09, sz1=H+R*0.24, sy=-R*0.02;
    [sa+R*0.05, sb-R*0.05].forEach(x=>line(Q(x,sy,H),Q(x,sy,sz0),'#64748b',R*0.02));
    poly([Q(sa,sy,sz0),Q(sb,sy,sz0),Q(sb,sy,sz1),Q(sa,sy,sz1)], accent, '#f8fafc', R*0.014);
    frontText(sa, sb, sy, sz1, R*0.15, 'DINER', '#f8fafc');
    // Two foreground umbrella tables directly on the ground
    patioUmbrella(-R*0.20, R*0.41, z0, '#e2e8f0', accent, '#f8fafc', '#64748b');
    patioUmbrella( R*0.26, R*0.43, z0, '#e2e8f0', '#f8fafc', accent, '#64748b');
    return;
  }

  /* =====================================================================
   * VARIANT 2: CLASSIC MIDWAY (1950s Red-and-Cream Burger & Malt Pavilion)
   * ===================================================================== */
  if(theme === 'classic'){
    drawBuildingShadow(x0-R*0.03, x1+R*0.03, y0-R*0.02, y1+R*0.04);
    // Vertical red-and-cream carnival striped walls + chrome base trim
    box(x0, x1, y0, y1, z0, H, '#fff9ed', '#dfd3b8', '#d9342b');
    const stripes = 8;
    for(let i=0;i<stripes;i++){
      const xa = x0 + (x1-x0)*i/stripes, xb = x0 + (x1-x0)*(i+1)/stripes;
      poly([Q(xa,y1,z0),Q(xb,y1,z0),Q(xb,y1,H),Q(xa,y1,H)], i%2 ? '#fff9ed' : '#fca5a5');
    }
    // Glowing golden walk-up order windows with chrome counters
    [[-R*0.36,-R*0.06],[R*0.06,R*0.36]].forEach(([xa,xb])=>{
      poly([Q(xa,y1,R*0.05),Q(xb,y1,R*0.05),Q(xb,y1,R*0.145),Q(xa,y1,R*0.145)], '#fef08a', '#b91c1c', R*0.01);
      box(xa-R*0.01, xb+R*0.01, y1, y1+R*0.045, R*0.035, R*0.052, '#cbd5e1', '#94a3b8', '#f8fafc');
    });
    // Scalloped red & gold carnival awning + neon fascia
    poly([Q(x0,y1,R*0.16),Q(x1,y1,R*0.16),Q(x1,y1,H+R*0.03),Q(x0,y1,H+R*0.03)], '#b91c1c', '#f5c542', R*0.012);
    frontText(x0, x1, y1, H+R*0.028, R*0.085, 'MIDWAY BURGERS', '#fff3b0');
    for(let i=0;i<10;i++){
      const a = x0 + (x1-x0)*i/10, b = x0 + (x1-x0)*(i+1)/10;
      poly([Q(a,y1,R*0.16),Q(b,y1,R*0.16),Q(b,y1+R*0.065,R*0.132),Q(a,y1+R*0.065,R*0.132)], i%2 ? '#f5c542' : '#d9342b');
    }
    // GIANT 3D SCULPTED CHEESEBURGER & MILKSHAKE ROOFTOP PROP!
    const bgP = Q(-R*0.12, 0, H + R*0.04);
    ell(bgP[0], bgP[1], R*0.15, R*0.075, '#d97706', '#92400e', R*0.008); // bottom bun
    ell(bgP[0], bgP[1]-R*0.022, R*0.16, R*0.078, '#16a34a');             // lettuce frill
    ell(bgP[0], bgP[1]-R*0.042, R*0.155, R*0.075, '#451a03');            // beef patty
    poly([[bgP[0]-R*0.14,bgP[1]-R*0.055],[bgP[0],bgP[1]-R*0.01],[bgP[0]+R*0.14,bgP[1]-R*0.055],[bgP[0],bgP[1]-R*0.09]], '#facc15'); // melted cheese
    ell(bgP[0], bgP[1]-R*0.075, R*0.15, R*0.088, '#f59e0b', '#b45309', R*0.008); // sesame top bun
    [[-0.05,-0.09],[0.04,-0.08],[0,-0.11],[-0.02,-0.06]].forEach(([dx,dy])=>ell(bgP[0]+dx*R,bgP[1]+dy*R,R*0.012,R*0.006,'#fef3c7'));
    // Giant Frosted Strawberry Milkshake Cup with Red Striped Straw next to the burger
    const msB = Q(R*0.20, -R*0.02, H + R*0.03), msT = Q(R*0.20, -R*0.02, H + R*0.20);
    poly([[msB[0]-R*0.05,msB[1]],[msB[0]+R*0.05,msB[1]],[msT[0]+R*0.075,msT[1]],[msT[0]-R*0.075,msT[1]]], '#f472b6', '#f8fafc', R*0.008);
    ell(msT[0], msT[1], R*0.078, R*0.045, '#fff9ed'); // whipped cream dome
    line([msT[0]+R*0.02,msT[1]-R*0.02], [msT[0]+R*0.07,msT[1]-R*0.11], '#ef4444', R*0.018); // straw
    ell(msT[0], msT[1]-R*0.035, R*0.022, R*0.022, '#dc2626'); // cherry on top
    // Foreground checkered carnival umbrellas
    patioUmbrella(-R*0.22, R*0.41, z0, '#fff9ed', '#d9342b', '#f5c542', '#b8861b');
    patioUmbrella( R*0.25, R*0.43, z0, '#fff9ed', '#f5c542', '#d9342b', '#b8861b');
    return;
  }

  /* =====================================================================
   * VARIANT 3: JUNGLE (Mesoamerican Temple Tiki Palapa & Rotisserie Pit)
   * ===================================================================== */
  if(theme === 'jungle'){
    drawBuildingShadow(x0-R*0.04, x1+R*0.04, y0-R*0.02, y1+R*0.04);
    // Stepped mossy temple stone base + carved jade columns
    box(x0-R*0.03, x1+R*0.03, y0-R*0.02, y1+R*0.02, z0, R*0.045, '#8e8a72', '#6e6a56', '#bdb9a0');
    box(x0, x1, y0, y1, R*0.045, H, '#78350f', '#451a03', null);
    // Carved stone corner & center pillars with glowing jade masks
    [x0+R*0.04, 0, x1-R*0.04].forEach(px=>{
      box(px-R*0.035, px+R*0.035, y1-R*0.02, y1+R*0.02, R*0.045, H, '#bdb9a0', '#8e8a72', '#dad7c3');
      const mp = Q(px, y1+R*0.022, R*0.13);
      ell(mp[0]-R*0.012, mp[1], R*0.009, R*0.009, '#2fbf9a');
      ell(mp[0]+R*0.012, mp[1], R*0.009, R*0.009, '#2fbf9a');
    });
    // Open-air glowing fire-pit rotisserie & bamboo serving counter inside the bays
    [[-R*0.32,-R*0.06],[R*0.06,R*0.32]].forEach(([xa,xb],idx)=>{
      poly([Q(xa,y1,R*0.05),Q(xb,y1,R*0.05),Q(xb,y1,R*0.155),Q(xa,y1,R*0.155)], '#291509');
      const fp = Q((xa+xb)/2, y1, R*0.08);
      ell(fp[0], fp[1], R*0.06, R*0.025, '#f97316');
      ell(fp[0], fp[1]-R*0.01, R*0.035, R*0.015, '#fde047');
      box(xa, xb, y1, y1+R*0.04, R*0.045, R*0.085, '#a16207', '#78350f', '#d9b27a');
    });
    // Jade & gold carved stone lintel frieze
    poly([Q(x0-R*0.02,y1,R*0.16),Q(x1+R*0.02,y1,R*0.16),Q(x1+R*0.02,y1,H),Q(x0-R*0.02,y1,H)], '#137a70', '#eab308', R*0.01);
    frontText(x0, x1, y1, H, R*0.08, 'TIKI FEAST HALL', '#fef08a');
    // Towering 2-tier palm-thatch Palapa roof + carved Tiki idol crown
    const ov=R*0.06, rh=R*0.16;
    poly([Q(x1,y0,H),Q(x1,y1,H),Q(x1,0,H+rh)], '#8a6a30');
    poly([Q(x0-ov,y1+ov,H-R*0.015),Q(x1+ov,y1+ov,H-R*0.015),Q(x1*0.55,0,H+rh),Q(x0*0.55,0,H+rh)], '#b5893d', '#78520d', R*0.012);
    poly([Q(x0*0.65,y1*0.55,H+rh*0.55),Q(x1*0.65,y1*0.55,H+rh*0.55),Q(x1*0.25,0,H+rh*1.38),Q(x0*0.25,0,H+rh*1.38)], '#c99a49', '#78520d', R*0.012);
    // Flaming Tiki torches & palm-frond patio umbrellas
    [-R*0.42, R*0.42].forEach(tx=>{
      const b=Q(tx,R*0.30,z0), tp=Q(tx,R*0.30,R*0.17);
      line(b,tp,'#5a4028',R*0.018);
      poly([[tp[0]-R*0.022,tp[1]],[tp[0],tp[1]-R*0.06],[tp[0]+R*0.022,tp[1]]], '#f97316');
    });
    patioUmbrella(-R*0.20, R*0.42, z0, '#bdb9a0', '#4d7c0f', '#eab308', '#78350f');
    patioUmbrella( R*0.24, R*0.44, z0, '#bdb9a0', '#15803d', '#2fbf9a', '#78350f');
    return;
  }

  /* =====================================================================
   * VARIANT 4: WILD WEST (2-Story "Golden Nugget Saloon" & BBQ Smokehouse)
   * ===================================================================== */
  if(theme === 'western'){
    drawBuildingShadow(x0-R*0.03, x1+R*0.08, y0-R*0.02, y1+R*0.05);
    // Front timber boardwalk deck strip
    poly([Q(x0-R*0.02,y1,z0),Q(x1+R*0.02,y1,z0),Q(x1+R*0.02,y1+R*0.12,z0),Q(x0-R*0.02,y1+R*0.12,z0)], '#a8784a', '#5a3b22', R*0.01);
    // Tall 2-story weathered timber saloon body + stepped false-front parapet
    const H2 = R*0.27, Hpar = R*0.39;
    box(x0, x1, y0, y1, z0, H2, '#b8824c', '#8a5a33', '#78350f');
    poly([
      Q(x0,y1,H2), Q(x1,y1,H2),
      Q(x1,y1,H2+R*0.05), Q(x1-R*0.09,y1,H2+R*0.05),
      Q(x1-R*0.09,y1,Hpar), Q(x0+R*0.09,y1,Hpar),
      Q(x0+R*0.09,y1,H2+R*0.05), Q(x0,y1,H2+R*0.05)
    ], '#9a3412', '#451a03', R*0.012);
    // Gold-leaf "SALOON & BBQ" false-front sign board + Longhorn skull above it
    poly([Q(x0+R*0.10,y1,H2+R*0.01),Q(x1-R*0.10,y1,H2+R*0.01),Q(x1-R*0.10,y1,Hpar-R*0.02),Q(x0+R*0.10,y1,Hpar-R*0.02)], '#fef3c7', '#451a03', R*0.01);
    frontText(x0+R*0.10, x1-R*0.10, y1, Hpar-R*0.02, R*0.095, 'SALOON & BBQ', '#7c2d12', 'Georgia, serif');
    const sk = Q(0, y1, Hpar + R*0.015);
    line([sk[0]-R*0.08,sk[1]-R*0.025], [sk[0]+R*0.08,sk[1]-R*0.025], '#f8fafc', R*0.014);
    ell(sk[0], sk[1], R*0.024, R*0.018, '#f8fafc', '#451a03', R*0.005);
    // Ground floor batwing swinging saloon doors + warm golden saloon windows
    [[-R*0.36,-R*0.12],[R*0.12,R*0.36]].forEach(([xa,xb])=>{
      poly([Q(xa,y1,R*0.03),Q(xb,y1,R*0.03),Q(xb,y1,R*0.125),Q(xa,y1,R*0.125)], '#fde047', '#451a03', R*0.01);
    });
    poly([Q(-R*0.08,y1,R*0.02),Q(R*0.08,y1,R*0.02),Q(R*0.08,y1,R*0.115),Q(-R*0.08,y1,R*0.115)], '#78350f', '#451a03', R*0.01);
    // Second-story covered balcony & porch posts
    poly([Q(x0-R*0.02,y1+R*0.10,R*0.145),Q(x1+R*0.02,y1+R*0.10,R*0.145),Q(x1+R*0.02,y1,R*0.175),Q(x0-R*0.02,y1,R*0.175)], '#64748b', '#334155', R*0.01);
    [x0, -R*0.14, R*0.14, x1].forEach(px=>line(Q(px,y1+R*0.09,z0),Q(px,y1+R*0.09,R*0.145),'#5a3b22',R*0.014));
    // Side iron offset BBQ smoker barrel with stovepipe & smoke puffs on +X
    box(x1, x1+R*0.11, -R*0.06, R*0.12, z0, R*0.12, '#27272a', '#18181b', '#3f3f46');
    const sp = Q(x1+R*0.06, 0, R*0.24);
    line(Q(x1+R*0.06,0,R*0.12), sp, '#18181b', R*0.022);
    ell(sp[0]+R*0.02, sp[1]-R*0.03, R*0.03, R*0.02, 'rgba(226,232,240,.55)');
    ell(sp[0]+R*0.05, sp[1]-R*0.07, R*0.042, R*0.028, 'rgba(226,232,240,.4)');
    // Foreground whiskey-barrel patio tables
    patioUmbrella(-R*0.21, R*0.42, z0, '#b45309', '#9a3412', '#fef3c7', '#451a03');
    patioUmbrella( R*0.25, R*0.44, z0, '#b45309', '#fef3c7', '#9a3412', '#451a03');
    return;
  }

  /* =====================================================================
   * VARIANT 5: FRONTIER (Backwoods Timber Chuckwagon & Smokehouse Lodge)
   * ===================================================================== */
  if(theme === 'frontier'){
    drawBuildingShadow(x0-R*0.03, x1+R*0.09, y0-R*0.02, y1+R*0.04);
    // River-stone foundation + horizontal notched pine log walls
    box(x0, x1, y0, y1, z0, R*0.05, '#80858d', '#5f656c', null);
    box(x0, x1, y0, y1, R*0.05, H, '#8a5a33', '#6f4524', null);
    for(let z=R*0.075; z<H; z+=R*0.034){
      line(Q(x0,y1,z), Q(x1,y1,z), '#5a3b22', R*0.01);
      [x0, x1].forEach(xp=>{const lp=Q(xp,y1,z); ell(lp[0],lp[1],R*0.019,R*0.015,'#d9b27a','#5a3b22',R*0.005);});
    }
    // Massive river-stone hearth chimney on right (+X) with rising smoke
    box(x1-R*0.01, x1+R*0.09, -R*0.08, R*0.08, z0, H+R*0.20, '#8a8f96', '#5f656c', '#d8d3c2');
    const chTop = Q(x1+R*0.04, 0, H+R*0.22);
    ell(chTop[0]+R*0.02, chTop[1]-R*0.03, R*0.035, R*0.022, 'rgba(241,245,249,.55)');
    // Warm glowing lodge windows + heavy timber door
    [[-R*0.36,-R*0.10],[R*0.10,R*0.36]].forEach(([xa,xb])=>{
      poly([Q(xa,y1,R*0.055),Q(xb,y1,R*0.055),Q(xb,y1,R*0.145),Q(xa,y1,R*0.145)], '#fbbf24', '#4a3320', R*0.012);
      line(Q((xa+xb)/2,y1,R*0.055), Q((xa+xb)/2,y1,R*0.145), '#4a3320', R*0.01);
    });
    poly([Q(-R*0.06,y1,z0),Q(R*0.06,y1,z0),Q(R*0.06,y1,R*0.14),Q(-R*0.06,y1,R*0.14)], '#5a3b22', '#d9b27a', R*0.01);
    // Forest-green cedar-shake A-frame roof with central gable dormer & "SMOKEHOUSE" timber sign
    const ov=R*0.045, rh=R*0.14;
    poly([Q(x1,y0,H),Q(x1,y1,H),Q(x1,0,H+rh)], '#6f4524');
    poly([Q(x0-ov,y1+ov,H-R*0.01),Q(x1+ov,y1+ov,H-R*0.01),Q(x1+ov,0,H+rh),Q(x0-ov,0,H+rh)], '#2f5f3a', '#1e3f26', R*0.014);
    // Log sign beam across front eaves
    poly([Q(x0+R*0.06,y1+R*0.01,R*0.16),Q(x1-R*0.06,y1+R*0.01,R*0.16),Q(x1-R*0.06,y1+R*0.01,H+R*0.025),Q(x0+R*0.06,y1+R*0.01,H+R*0.025)], '#4a3320', '#d9b27a', R*0.01);
    frontText(x0+R*0.06, x1-R*0.06, y1+R*0.01, H+R*0.025, R*0.085, 'SMOKEHOUSE', '#fde68a');
    patioUmbrella(-R*0.21, R*0.42, z0, '#d9b27a', '#2f5f3a', '#d97706', '#5a3b22');
    patioUmbrella( R*0.25, R*0.44, z0, '#d9b27a', '#b91c1c', '#fde68a', '#5a3b22');
    return;
  }

  /* =====================================================================
   * VARIANT 6: SPACE (Futuristic Orbital Hydro-Ring Cafe & Saucer Pod)
   * ===================================================================== */
  if(theme === 'space'){
    const c0 = Q(0, 0, 0);
    // Glowing cyan antigravity ground ring shadow
    ell(c0[0], c0[1]+R*0.02, R*0.44, R*0.21, 'rgba(15,23,42,.38)', '#22d3ee', R*0.01);
    // Central dark-titanium reactor pedestal + panoramic saucer hull
    box(-R*0.22, R*0.22, -R*0.16, R*0.16, z0, R*0.09, '#0f172a', '#1e293b', '#38bdf8');
    // Main circular/elliptical saucer dining deck
    const sMid = Q(0, 0, R*0.15), sTop = Q(0, 0, R*0.23);
    ell(sMid[0], sMid[1], R*0.48, R*0.23, '#cbd5e1', '#94a3b8', R*0.012);
    // Panoramic wrap-around cobalt observation glass band
    ell(sMid[0], sMid[1]-R*0.032, R*0.45, R*0.20, '#0284c7', '#22d3ee', R*0.014);
    // Upper white titanium dome cap & neon cyan orbital halo ring
    ell(sTop[0], sTop[1], R*0.42, R*0.19, '#f8fafc', '#38bdf8', R*0.012);
    ell(sTop[0], sTop[1]-R*0.04, R*0.22, R*0.10, '#0f172a', '#c084fc', R*0.01);
    ell(sTop[0], sTop[1]-R*0.045, R*0.10, R*0.045, '#22d3ee');
    // Holographic neon "ORBIT CAFE" sign floating at front of saucer
    const sa=-R*0.30, sb=R*0.30, sy=R*0.18, sz1=R*0.29;
    poly([Q(sa,sy,sz1-R*0.075),Q(sb,sy,sz1-R*0.075),Q(sb,sy,sz1),Q(sa,sy,sz1)], 'rgba(15,23,42,.88)', '#22d3ee', R*0.012);
    frontText(sa, sb, sy, sz1, R*0.075, 'ORBITAL CAFE', '#22d3ee', 'monospace');
    // Levitating neon-ring plasma patio tables
    patioUmbrella(-R*0.22, R*0.42, z0, '#22d3ee', '#0f172a', '#22d3ee', '#cbd5e1');
    patioUmbrella( R*0.25, R*0.44, z0, '#22d3ee', '#0f172a', '#c084fc', '#cbd5e1');
    return;
  }

  /* =====================================================================
   * VARIANT 7: GOTHIC (Haunted Vampire Banquet Crypt & Gargoyle Tavern)
   * ===================================================================== */
  if(theme === 'gothic'){
    drawBuildingShadow(x0-R*0.03, x1+R*0.04, y0-R*0.02, y1+R*0.04);
    // Dark ashlar stone walls + heavy corner stone buttresses
    box(x0, x1, y0, y1, z0, H, '#3f3f46', '#27272a', null, '#18181b', R*0.01);
    [x0, -R*0.12, R*0.12, x1-R*0.03].forEach(xp=>{
      box(xp, xp+R*0.032, y1-R*0.01, y1+R*0.025, z0, H+R*0.02, '#52525b', '#27272a', '#71717a');
    });
    // Glowing crimson & violet stained-glass lancet windows
    [[-R*0.32,-R*0.16],[R*0.16,R*0.32]].forEach(([xa,xb])=>{
      const xm = (xa+xb)/2;
      poly([Q(xa,y1,R*0.04),Q(xb,y1,R*0.04),Q(xb,y1,R*0.12),Q(xm,y1,R*0.155),Q(xa,y1,R*0.12)], '#991b1b', '#18181b', R*0.01);
      ell(Q(xm,y1,R*0.10)[0], Q(xm,y1,R*0.10)[1], R*0.02, R*0.02, '#c084fc');
    });
    // Pointed gothic oak tavern doors
    poly([Q(-R*0.07,y1,z0),Q(R*0.07,y1,z0),Q(R*0.07,y1,R*0.115),Q(0,y1,R*0.145),Q(-R*0.07,y1,R*0.115)], '#18181b', '#71717a', R*0.01);
    // Steep verdigris-copper & slate mansard roof + central pointed belfry gable with Rose Window
    const ov=R*0.03, rh=R*0.165;
    poly([Q(x1,y0,H),Q(x1,y1,H),Q(x1,0,H+rh)], '#27272a');
    poly([Q(x0-ov,y1+ov,H-R*0.01),Q(x1+ov,y1+ov,H-R*0.01),Q(x1+ov,0,H+rh),Q(x0-ov,0,H+rh)], '#1e293b', '#0f172a', R*0.012);
    // Central front gable spire & glowing Rose Window
    poly([Q(-R*0.16,y1,H),Q(R*0.16,y1,H),Q(0,y1,H+rh+R*0.04)], '#3f3f46', '#18181b', R*0.01);
    const rw = Q(0, y1, H+R*0.055);
    ell(rw[0], rw[1], R*0.038, R*0.038, '#dc2626', '#fde047', R*0.007);
    // Wrought-iron ridge spikes
    line(Q(x0-ov,0,H+rh), Q(x1+ov,0,H+rh), '#18181b', R*0.018);
    for(let k=-4;k<=4;k++){const sp=Q(k*R*0.09,0,H+rh); line(sp,[sp[0],sp[1]-R*0.042],'#18181b',R*0.01);}
    // Crimson banner sign
    poly([Q(-R*0.32,y1,R*0.16),Q(R*0.32,y1,R*0.16),Q(R*0.32,y1,H),Q(-R*0.32,y1,H)], '#450a0a', '#991b1b', R*0.01);
    frontText(-R*0.32, R*0.32, y1, H, R*0.06, 'CRYPT TAVERN', '#fca5a5', 'Georgia, serif');
    patioUmbrella(-R*0.21, R*0.42, z0, '#52525b', '#18181b', '#991b1b', '#27272a');
    patioUmbrella( R*0.25, R*0.44, z0, '#52525b', '#450a0a', '#c084fc', '#27272a');
    return;
  }

  /* =====================================================================
   * VARIANT 8: MEDIEVAL (Royal Jousting Banquet Hall & Tudor Meadery)
   * ===================================================================== */
  if(theme === 'medieval'){
    drawBuildingShadow(x0-R*0.03, x1+R*0.08, y0-R*0.02, y1+R*0.04);
    // Cut-stone ground course + overhanging half-timbered cream plaster upper jetty
    box(x0, x1, y0, y1, z0, R*0.075, '#64748b', '#475569', null);
    box(x0-R*0.015, x1+R*0.015, y0, y1+R*0.015, R*0.075, H, '#fef3c7', '#dfd3b8', null, '#451a03', R*0.012);
    // Tudor oak cross-timbers
    [-R*0.42,-R*0.15,R*0.15,R*0.42].forEach(xp=>line(Q(xp,y1+R*0.015,R*0.075),Q(xp,y1+R*0.015,H),'#451a03',R*0.014));
    // Side stone bread/roast oven dome on +X
    box(x1, x1+R*0.08, -R*0.08, R*0.08, z0, H+R*0.16, '#64748b', '#475569', '#94a3b8');
    // Royal heraldic fascia & golden tankard sign
    poly([Q(x0,y1+R*0.015,R*0.155),Q(x1,y1+R*0.015,R*0.155),Q(x1,y1+R*0.015,H),Q(x0,y1+R*0.015,H)], '#b91c1c', '#f5c542', R*0.01);
    frontText(x0, x1, y1+R*0.015, H, R*0.068, 'ROYAL MEAD HALL', '#fef08a', 'Georgia, serif');
    // Leaded diamond-pane tavern windows + arched oak door
    [[-R*0.36,-R*0.12],[R*0.12,R*0.36]].forEach(([xa,xb])=>{
      poly([Q(xa,y1+R*0.015,R*0.085),Q(xb,y1+R*0.015,R*0.085),Q(xb,y1+R*0.015,R*0.148),Q(xa,y1+R*0.015,R*0.148)], '#fde047', '#451a03', R*0.01);
    });
    poly([Q(-R*0.07,y1,z0),Q(R*0.07,y1,z0),Q(R*0.07,y1,R*0.115),Q(0,y1,R*0.14),Q(-R*0.07,y1,R*0.115)], '#78350f', '#451a03', R*0.012);
    // Steep royal-blue & crimson slate roof + twin tournament pennants
    const ov=R*0.04, rh=R*0.15;
    poly([Q(x1,y0,H),Q(x1,y1,H),Q(x1,0,H+rh)], '#dfd3b8', '#451a03', R*0.01);
    poly([Q(x0-ov,y1+ov,H-R*0.01),Q(x1+ov,y1+ov,H-R*0.01),Q(x1+ov,0,H+rh),Q(x0-ov,0,H+rh)], '#1e3a8a', '#172554', R*0.012);
    [-R*0.22, R*0.22].forEach((tx,i)=>{
      const tp = Q(tx, 0, H+rh+R*0.01);
      line(tp, [tp[0], tp[1]-R*0.085], '#f5c542', R*0.012);
      poly([[tp[0],tp[1]-R*0.085],[tp[0]+R*0.08,tp[1]-R*0.065],[tp[0],tp[1]-R*0.045]], i?'#b91c1c':'#eab308');
    });
    // Jousting pavilion umbrella feast tables
    patioUmbrella(-R*0.21, R*0.42, z0, '#a16207', '#b91c1c', '#f5c542', '#451a03');
    patioUmbrella( R*0.25, R*0.44, z0, '#a16207', '#1d4ed8', '#f5c542', '#451a03');
    return;
  }

  /* =====================================================================
   * VARIANT 9: ALPS (Swiss Matterhorn Fondue Chalet & Apres-Ski Deck)
   * ===================================================================== */
  if(theme === 'alps'){
    drawBuildingShadow(x0-R*0.05, x1+R*0.05, y0-R*0.02, y1+R*0.05);
    // Whitewashed stone ground level + warm honey-larch timber upper chalet
    box(x0, x1, y0, y1, z0, R*0.12, '#f8fafc', '#cbd5e1', null);
    box(x0-R*0.02, x1+R*0.02, y0, y1+R*0.02, R*0.12, H, '#b45309', '#78350f', null);
    // Carved wooden balcony with red geranium flowerboxes
    line(Q(x0-R*0.025,y1+R*0.03,R*0.125), Q(x1+R*0.025,y1+R*0.03,R*0.125), '#451a03', R*0.02);
    [-R*0.26, 0, R*0.26].forEach(fx=>{
      const fp = Q(fx, y1+R*0.035, R*0.13);
      ell(fp[0], fp[1], R*0.05, R*0.018, '#15803d');
      ell(fp[0]-R*0.018, fp[1]-R*0.008, R*0.015, R*0.015, '#ef4444');
      ell(fp[0]+R*0.018, fp[1]-R*0.008, R*0.015, R*0.015, '#ef4444');
    });
    // Warm golden fondue dining windows & red shutters
    [[-R*0.34,-R*0.12],[R*0.12,R*0.34]].forEach(([xa,xb])=>{
      poly([Q(xa,y1,R*0.03),Q(xb,y1,R*0.03),Q(xb,y1,R*0.105),Q(xa,y1,R*0.105)], '#fde047', '#78350f', R*0.01);
    });
    poly([Q(-R*0.06,y1,z0),Q(R*0.06,y1,z0),Q(R*0.06,y1,R*0.11),Q(-R*0.06,y1,R*0.11)], '#991b1b', '#451a03', R*0.01);
    frontText(x0, x1, y1+R*0.02, H, R*0.075, 'FONDUE CHALET', '#fef3c7');
    // Wide-overhanging Alpine roof blanketed in thick white snow + stone chimney
    const ov=R*0.07, rh=R*0.11;
    poly([Q(x1,y0,H),Q(x1,y1,H),Q(x1,0,H+rh)], '#92400e');
    poly([Q(x0-ov,y1+ov,H-R*0.015),Q(x1+ov,y1+ov,H-R*0.015),Q(x1+ov,0,H+rh),Q(x0-ov,0,H+rh)], '#78350f', '#451a03', R*0.014);
    poly([Q(x0-ov*0.85,y1*0.7,H+rh*0.22),Q(x1+ov*0.85,y1*0.7,H+rh*0.22),Q(x1+ov,0,H+rh),Q(x0-ov,0,H+rh)], '#f8fafc', '#bae6fd', R*0.01);
    // Crossed red skis & brass cowbell emblem on the chalet gable
    const eg = Q(0, y1+R*0.02, H+R*0.045);
    line([eg[0]-R*0.06,eg[1]+R*0.03],[eg[0]+R*0.06,eg[1]-R*0.03],'#dc2626',R*0.012);
    line([eg[0]-R*0.06,eg[1]-R*0.03],[eg[0]+R*0.06,eg[1]+R*0.03],'#dc2626',R*0.012);
    ell(eg[0], eg[1], R*0.022, R*0.022, '#f5c542', '#78350f', R*0.006);
    patioUmbrella(-R*0.21, R*0.42, z0, '#fde68a', '#dc2626', '#f8fafc', '#78350f');
    patioUmbrella( R*0.25, R*0.44, z0, '#fde68a', '#0284c7', '#f8fafc', '#78350f');
    return;
  }

  /* =====================================================================
   * VARIANT 10: FIESTA (Mexican Hacienda Cantina, Bell Gable & Picado)
   * ===================================================================== */
  if(theme === 'fiesta'){
    drawBuildingShadow(x0-R*0.03, x1+R*0.03, y0-R*0.02, y1+R*0.04);
    // Warm ochre-terracotta stucco walls + colorful Talavera mosaic wainscot
    box(x0, x1, y0, y1, z0, H, '#fef3c7', '#fde68a', null);
    poly([Q(x0,y1,z0),Q(x1,y1,z0),Q(x1,y1,R*0.045),Q(x0,y1,R*0.045)], '#0d9488', '#f59e0b', R*0.008);
    // Triple arched Spanish colonial portal arcade across the front
    [-R*0.26, 0, R*0.26].forEach((ax, idx)=>{
      const w = R*0.105;
      poly([Q(ax-w,y1,z0),Q(ax+w,y1,z0),Q(ax+w,y1,R*0.105),Q(ax,y1,R*0.145),Q(ax-w,y1,R*0.105)], idx===1?'#78350f':'#fde047', '#c2410c', R*0.01);
    });
    // Cobalt & marigold Talavera frieze + "CANTINA" sign
    poly([Q(x0,y1,R*0.155),Q(x1,y1,R*0.155),Q(x1,y1,H),Q(x0,y1,H)], '#e11d48', '#f59e0b', R*0.01);
    frontText(x0, x1, y1, H, R*0.068, 'LA CANTINA', '#fef08a');
    // Red mission barrel-tile roof (tejas) + arched Mission Bell Espadaña with golden bell
    const ov=R*0.04, rh=R*0.105;
    poly([Q(x1,y0,H),Q(x1,y1,H),Q(x1,0,H+rh)], '#fde68a');
    poly([Q(x0-ov,y1+ov,H-R*0.01),Q(x1+ov,y1+ov,H-R*0.01),Q(x1+ov,0,H+rh),Q(x0-ov,0,H+rh)], '#c2410c', '#7c2d12', R*0.012);
    for(let k=-4;k<=4;k++){const bx=k*R*0.085; line(Q(bx,y1+ov,H-R*0.01),Q(bx,0,H+rh),'#ea580c',R*0.012);}
    // Mission bell arch & golden bell on roof ridge
    poly([Q(-R*0.12,0,H+rh*0.7),Q(R*0.12,0,H+rh*0.7),Q(R*0.10,0,H+rh+R*0.09),Q(0,0,H+rh+R*0.13),Q(-R*0.10,0,H+rh+R*0.09)], '#fef3c7', '#c2410c', R*0.01);
    const bl = Q(0, 0, H+rh+R*0.06);
    ell(bl[0], bl[1], R*0.025, R*0.028, '#f5c542', '#78350f', R*0.006);
    // Papel Picado festive banners & fiesta patio umbrellas
    const pL = Q(x0-R*0.12, y1+R*0.14, R*0.16), pR = Q(x1+R*0.12, y1+R*0.14, R*0.16);
    line(pL, pR, '#fef3c7', R*0.006);
    ['#e11d48','#10b981','#f59e0b','#3b82f6','#a855f7','#ec4899'].forEach((col,k)=>{
      const q=(k+1)/7, px=pL[0]+(pR[0]-pL[0])*q, py=pL[1]+(pR[1]-pL[1])*q+Math.sin(q*Math.PI)*R*0.025;
      poly([[px-R*0.02,py],[px+R*0.02,py],[px,py+R*0.042]], col);
    });
    patioUmbrella(-R*0.21, R*0.42, z0, '#fde047', '#e11d48', '#10b981', '#78350f');
    patioUmbrella( R*0.25, R*0.44, z0, '#fde047', '#0d9488', '#f59e0b', '#78350f');
    return;
  }

  /* =====================================================================
   * VARIANT 11: NORDIC (Viking Stave-Church Longhouse Mead & Feast Hall)
   * ===================================================================== */
  if(theme === 'nordic'){
    drawBuildingShadow(x0-R*0.04, x1+R*0.04, y0-R*0.02, y1+R*0.04);
    // Dark tarred stave timber walls + carved gold rune band
    box(x0, x1, y0, y1, z0, H, '#451a03', '#290f02', null, '#78350f', R*0.01);
    poly([Q(x0,y1,R*0.15),Q(x1,y1,R*0.15),Q(x1,y1,H),Q(x0,y1,H)], '#78350f', '#d97706', R*0.012);
    frontText(x0, x1, y1, H, R*0.068, 'VALHALLA FEAST', '#fde68a', 'Georgia, serif');
    // Warm hearth-lit windows + arched Viking hall portal
    [[-R*0.34,-R*0.14],[R*0.14,R*0.34]].forEach(([xa,xb])=>{
      poly([Q(xa,y1,R*0.045),Q(xb,y1,R*0.045),Q(xb,y1,R*0.125),Q(xa,y1,R*0.125)], '#f97316', '#d97706', R*0.01);
    });
    poly([Q(-R*0.08,y1,z0),Q(R*0.08,y1,z0),Q(R*0.08,y1,R*0.115),Q(0,y1,R*0.145),Q(-R*0.08,y1,R*0.115)], '#290f02', '#f59e0b', R*0.012);
    // Row of painted round Viking shields mounted along the front eaves
    [-R*0.32, -R*0.16, 0, R*0.16, R*0.32].forEach((sx, k)=>{
      const sp = Q(sx, y1+R*0.01, R*0.152);
      ell(sp[0], sp[1], R*0.028, R*0.028, k%2?'#991b1b':'#0284c7', '#f59e0b', R*0.007);
      ell(sp[0], sp[1], R*0.009, R*0.009, '#fde047');
    });
    // Multi-tiered dark slate stave roof + twin gilded Dragon-Prow gable finials
    const ov=R*0.04, rh=R*0.155;
    poly([Q(x1,y0,H),Q(x1,y1,H),Q(x1,0,H+rh)], '#290f02');
    poly([Q(x0-ov,y1+ov,H-R*0.01),Q(x1+ov,y1+ov,H-R*0.01),Q(x1+ov,0,H+rh),Q(x0-ov,0,H+rh)], '#334155', '#1e293b', R*0.012);
    poly([Q(x0*0.65,y1*0.5,H+rh*0.55),Q(x1*0.65,y1*0.5,H+rh*0.55),Q(x1*0.65,0,H+rh*1.32),Q(x0*0.65,0,H+rh*1.32)], '#1e293b', '#d97706', R*0.012);
    const dL = Q(x0*0.68, 0, H+rh*1.32), dR = Q(x1*0.68, 0, H+rh*1.32);
    line(dL, [dL[0]-R*0.06, dL[1]-R*0.06], '#f59e0b', R*0.022);
    line(dR, [dR[0]+R*0.06, dR[1]-R*0.06], '#f59e0b', R*0.022);
    patioUmbrella(-R*0.21, R*0.42, z0, '#78350f', '#991b1b', '#f59e0b', '#451a03');
    patioUmbrella( R*0.25, R*0.44, z0, '#78350f', '#0284c7', '#f59e0b', '#451a03');
    return;
  }

  /* =====================================================================
   * VARIANT 12: BAVARIAN (Oktoberfest Beer Hall & Glockenspiel Tower)
   * ===================================================================== */
  if(theme === 'bavarian'){
    drawBuildingShadow(x0-R*0.03, x1+R*0.04, y0-R*0.02, y1+R*0.04);
    // Crisp white stucco with Fachwerk timber beams + blue/white Bavarian lozenge band
    box(x0, x1, y0, y1, z0, H, '#f8fafc', '#e2e8f0', null, '#5a3b22', R*0.012);
    poly([Q(x0,y1,R*0.15),Q(x1,y1,R*0.15),Q(x1,y1,H),Q(x0,y1,H)], '#1d4ed8', '#f59e0b', R*0.01);
    for(let k=0;k<10;k++){
      const xa = x0 + (x1-x0)*k/10, xb = x0 + (x1-x0)*(k+1)/10, xm = (xa+xb)/2;
      poly([Q(xa,y1,R*0.165),Q(xm,y1,R*0.15),Q(xb,y1,R*0.165),Q(xm,y1,R*0.18)], '#f8fafc');
    }
    frontText(x0, x1, y1, H, R*0.068, 'BIERHALLE', '#ffffff');
    // Arched beer-hall windows showing gleaming copper brewing kettles inside
    [[-R*0.36,-R*0.12],[R*0.12,R*0.36]].forEach(([xa,xb])=>{
      poly([Q(xa,y1,R*0.035),Q(xb,y1,R*0.035),Q(xb,y1,R*0.12),Q(xa,y1,R*0.12)], '#fde047', '#5a3b22', R*0.01);
      const kp = Q((xa+xb)/2, y1, R*0.065);
      ell(kp[0], kp[1], R*0.035, R*0.025, '#d97706', '#78350f', R*0.006);
    });
    poly([Q(-R*0.07,y1,z0),Q(R*0.07,y1,z0),Q(R*0.07,y1,R*0.12),Q(0,y1,R*0.142),Q(-R*0.07,y1,R*0.12)], '#78350f', '#5a3b22', R*0.012);
    // Blue-and-white striped Oktoberfest awning
    for(let i=0;i<10;i++){
      const a = x0 + (x1-x0)*i/10, b = x0 + (x1-x0)*(i+1)/10;
      poly([Q(a,y1,R*0.15),Q(b,y1,R*0.15),Q(b,y1+R*0.055,R*0.125),Q(a,y1+R*0.055,R*0.125)], i%2 ? '#f8fafc' : '#2563eb');
    }
    // Red clay-tile roof + Glockenspiel clock turret with copper onion dome & golden pretzel crest
    const ov=R*0.035, rh=R*0.13;
    poly([Q(x1,y0,H),Q(x1,y1,H),Q(x1,0,H+rh)], '#e2e8f0', '#5a3b22', R*0.01);
    poly([Q(x0-ov,y1+ov,H-R*0.01),Q(x1+ov,y1+ov,H-R*0.01),Q(x1+ov,0,H+rh),Q(x0-ov,0,H+rh)], '#b91c1c', '#7f1d1d', R*0.012);
    box(-R*0.075, R*0.075, -R*0.065, R*0.065, H+rh*0.65, H+rh+R*0.08, '#fef3c7', '#dfd3b8', '#0d9488');
    const ck = Q(0, R*0.068, H+rh+R*0.035);
    ell(ck[0], ck[1], R*0.028, R*0.028, '#ffffff', '#f59e0b', R*0.007);
    const od = Q(0, 0, H+rh+R*0.12);
    ell(od[0], od[1], R*0.062, R*0.052, '#0d9488', '#f59e0b', R*0.008);
    line(od, [od[0], od[1]-R*0.06], '#f59e0b', R*0.012);
    // Biergarten umbrella tables
    patioUmbrella(-R*0.21, R*0.42, z0, '#d97706', '#2563eb', '#f8fafc', '#5a3b22');
    patioUmbrella( R*0.25, R*0.44, z0, '#d97706', '#f8fafc', '#2563eb', '#5a3b22');
  }
}
return drawDiner;
})();

const guestServicesSkinPack = (() => {

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

/* ===== GUEST SERVICES THEME METADATA (UNTHEMED + 11 HEAVY/IMMERSIVE SKINS) ===== */
const GUEST_SERVICES_SKINS = {
  unthemed: {id:'unthemed', label:'Unthemed (Tier 0–2)', name:'Guest Services Rotunda',   sub:'Modern Park Information & Concierge',      hex:'#cbd5e1', border:'#2563eb'},
  classic:  {id:'classic',  label:'Classic Midway',      name:'Main Street City Hall',    sub:'Victorian Mansard Hall & Brass Clock Dome',hex:'#cbb07c', border:'#d9342b'},
  jungle:   {id:'jungle',   label:'Jungle',              name:'Explorer Outpost HQ',      sub:'Carved Temple Stone, Jade Arch & Sundial', hex:'#587c48', border:'#2fbf9a'},
  western:  {id:'western',  label:'Wild West',           name:'Marshal & Telegraph HQ',   sub:'False-Front Timber Office & Sheriff Star', hex:'#c99a62', border:'#8a5a33'},
  frontier: {id:'frontier', label:'Frontier',            name:'Park Ranger Headquarters', sub:'Notched Pine Logs & Fire-Lookout Cupola',  hex:'#7d955d', border:'#566e42'},
  space:    {id:'space',    label:'Space',               name:'Galactic Telemetry Dome',  sub:'Titanium Command Pod & Holo-Array Spire',  hex:'#334155', border:'#0ea5e9'},
  gothic:   {id:'gothic',   label:'Gothic',              name:'Abbey Chancery Sanctum',   sub:'Buttressed Ashlar Stone & Belfry Spire',   hex:'#3b3345', border:'#991b1b'},
  medieval: {id:'medieval', label:'Medieval',            name:"Royal Herald's Guildhall", sub:'Half-Timbered Tudor Jetty & Bell Turret',  hex:'#6c8c58', border:'#eab308'},
  alps:     {id:'alps',     label:'Alps',                name:'Mountain Guides Chalet',   sub:'Snow-Capped Larch Roof & Swiss Cross Crest',hex:'#a8c5d6', border:'#0284c7'},
  fiesta:   {id:'fiesta',   label:'Fiesta',              name:'Palacio Municipal',        sub:'Colonial Arched Arcade & Bell Espadaña',   hex:'#d99b52', border:'#e11d48'},
  nordic:   {id:'nordic',   label:'Nordic',              name:"Jarl's Thingvellir Hall",  sub:'Multi-Tiered Stave Roof & Dragon Finials', hex:'#4d6b63', border:'#d97706'},
  bavarian: {id:'bavarian', label:'Bavarian',            name:'Altes Rathaus',            sub:'Stepped Renaissance Gable & Clock Onion Dome',hex:'#769958', border:'#2563eb'}
};

/* ===== SPRITE CODE: copy this block into engine.js ===== */
/**
 * drawGuestServices(ctx, cx, cy, R, opts)
 *  opts.accent        : Land / chain accent color (default '#2563eb')
 *  opts.themeId       : 'classic'|'jungle'|'western'|'wildwest'|'frontier'|'space'|'gothic'|'medieval'|'alps'|'fiesta'|'nordic'|'bavarian'
 *  opts.rideThemeTier : 0..4 (<=2 draws Standard Unthemed; >=3 draws Heavy/Immersive Themed Architecture)
 *  opts.flip          : true when called under horizontal mirror
 *  opts.tile          : draw the hex tile background (default true)
 */
function drawGuestServices(ctx, cx, cy, R, o={}){
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTheme = String(o.themeId || o.theme || 'unthemed').toLowerCase();
  if(rawTheme === 'wildwest' || rawTheme === 'wild_west') rawTheme = 'western';
  const theme = (tier <= 2 || !GUEST_SERVICES_SKINS[rawTheme]) ? 'unthemed' : rawTheme;
  const skin = GUEST_SERVICES_SKINS[theme] || GUEST_SERVICES_SKINS.unthemed;
  const accent = o.accent || skin.border || '#2563eb';
  const fl = o.flip ? -1 : 1;

  // Upscale building architecture by ~24% while keeping the hex tile radius Hr unchanged
  const Hr = R;
  R = R * 1.24;

  // Center the building footprint cleanly on the hex pad
  const cyB = cy + R * 0.04;
  const Q = (X,Y,Z) => [cx + (X - Y)*0.7, cyB + (X + Y)*0.35 - Z];

  const poly = (pts,fill,stroke,lw) => {
    ctx.beginPath();
    pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.011;ctx.lineJoin='round';ctx.stroke();}
  };
  const line = (a,b,c,w) => {
    ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
  };
  const ell = (x,y,rx,ry,fill,stroke,lw) => {
    ctx.beginPath();ctx.ellipse(x,y,Math.max(0.5,rx),Math.max(0.5,ry),0,0,Math.PI*2);
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||1;ctx.stroke();}
  };

  /**
   * Solid watertight isometric box helper:
   *  +Y face = Front-Left (South-West) camera-facing main facade
   *  +X face = Front-Right (South-East) camera-facing end wall
   *  +Z face = Top horizontal roof/terrace plane
   */
  const isoBox = (x0,x1,y0,y1,z0,z1,colFront,colEast,colTop,strokeCol,lw) => {
    if(colTop){
      poly([Q(x0,y0,z1),Q(x1,y0,z1),Q(x1,y1,z1),Q(x0,y1,z1)], colTop, strokeCol, lw);
    }
    poly([Q(x0,y1,z0),Q(x1,y1,z0),Q(x1,y1,z1),Q(x0,y1,z1)], colFront, strokeCol, lw);
    poly([Q(x1,y0,z0),Q(x1,y1,z0),Q(x1,y1,z1),Q(x1,y0,z1)], colEast, strokeCol, lw);
  };

  /**
   * Watertight 3D Gable Roof running along the X-axis (ridge at Y = 0, Z = z0 + rh):
   * Draws in strict back-to-front painter's order so no faces ever invert or clip.
   */
  const gableRoof = (x0,x1,y0,y1,z0,rh,ov,colSlope,colGableEnd,colTrim,courses) => {
    const xa = x0 - ov, xb = x1 + ov, ya = y0 - ov, yb = y1 + ov, zTop = z0 + rh;
    // 1. Back-Right slope (Y from ya to 0) — visible when roof pitch is shallow
    poly([Q(xa,ya,z0),Q(xb,ya,z0),Q(xb,0,zTop),Q(xa,0,zTop)], shade(colSlope,-0.28), colTrim, R*0.009);
    // 2. Front-Right triangular gable end wall at X = x1 (sits flush under the roof overhang)
    poly([Q(x1,y0,z0),Q(x1,y1,z0),Q(x1,0,zTop - rh*(ov/Math.max(0.01,y1+ov))*0.15)], colGableEnd, colTrim, R*0.009);
    // 3. Front-Left main camera-facing roof slope (Y from 0 to yb)
    poly([Q(xa,yb,z0),Q(xb,yb,z0),Q(xb,0,zTop),Q(xa,0,zTop)], colSlope, colTrim, R*0.011);
    // Optional horizontal shingle/tile course lines on front slope
    const nC = courses || 3;
    for(let k=1;k<=nC;k++){
      const t = k/(nC+1);
      const y = yb*(1-t), z = z0 + rh*t;
      line(Q(xa+R*0.01,y,z), Q(xb-R*0.01,y,z), shade(colSlope,-0.22), R*0.007);
    }
    // 4. Crisp eaves, ridge beam, and right gable rake trim
    line(Q(xa,yb,z0), Q(xb,yb,z0), colTrim || shade(colSlope,-0.35), R*0.014);
    line(Q(xb,ya,z0), Q(xb,0,zTop), colTrim || shade(colSlope,-0.35), R*0.013);
    line(Q(xb,yb,z0), Q(xb,0,zTop), colTrim || shade(colSlope,-0.35), R*0.014);
    line(Q(xa,0,zTop), Q(xb,0,zTop), shade(colSlope,0.28), R*0.015);
  };

  /**
   * Watertight 4-Sided Hip Roof over (x0..x1, y0..y1) at base z0 rising to ridge (rx0..rx1, 0, z0+rh):
   * Draws all 4 slopes in exact depth order so every corner meets cleanly.
   */
  const hipRoof = (x0,x1,y0,y1,z0,rh,ov,insetX,colSlope,colTrim,courses) => {
    const xa = x0 - ov, xb = x1 + ov, ya = y0 - ov, yb = y1 + ov, zTop = z0 + rh;
    const rx0 = xa + insetX, rx1 = xb - insetX;
    // 1. Back-West slope (y = ya)
    poly([Q(xa,ya,z0),Q(xb,ya,z0),Q(rx1,0,zTop),Q(rx0,0,zTop)], shade(colSlope,-0.30), colTrim, R*0.008);
    // 2. Back-North hip triangle (x = xa)
    poly([Q(xa,ya,z0),Q(xa,yb,z0),Q(rx0,0,zTop)], shade(colSlope,-0.18), colTrim, R*0.008);
    // 3. Front-East hip triangle (x = xb)
    poly([Q(xb,ya,z0),Q(xb,yb,z0),Q(rx1,0,zTop)], shade(colSlope,-0.22), colTrim, R*0.010);
    // 4. Front-South main slope (y = yb)
    poly([Q(xa,yb,z0),Q(xb,yb,z0),Q(rx1,0,zTop),Q(rx0,0,zTop)], colSlope, colTrim, R*0.011);
    const nC = courses || 0;
    for(let k=1;k<=nC;k++){
      const t = k/(nC+1);
      const y = yb*(1-t), z = z0 + rh*t;
      const lx = xa + (rx0-xa)*t, rx = xb + (rx1-xb)*t;
      line(Q(lx,y,z), Q(rx,y,z), shade(colSlope,-0.22), R*0.007);
    }
    line(Q(rx0,0,zTop), Q(rx1,0,zTop), colTrim || shade(colSlope,0.3), R*0.015);
  };

  /**
   * Watertight 4-Sided Pyramid Spire / Cupola Roof over (x0..x1, y0..y1) rising to apex (cx, cy, z0+rh)
   */
  const pyramidRoof = (x0,x1,y0,y1,z0,rh,ov,colSlope,colTrim) => {
    const xa = x0 - ov, xb = x1 + ov, ya = y0 - ov, yb = y1 + ov;
    const ap = Q((x0+x1)/2, (y0+y1)/2, z0 + rh);
    poly([Q(xa,ya,z0),Q(xb,ya,z0),ap], shade(colSlope,-0.32), colTrim, R*0.007);
    poly([Q(xa,ya,z0),Q(xa,yb,z0),ap], shade(colSlope,-0.18), colTrim, R*0.007);
    poly([Q(xb,ya,z0),Q(xb,yb,z0),ap], shade(colSlope,-0.22), colTrim, R*0.009);
    poly([Q(xa,yb,z0),Q(xb,yb,z0),ap], colSlope, colTrim, R*0.009);
    return ap;
  };

  const frontText = (xa, xb, y, zTop, zH, txt, fg, fontFam) => {
    const so = Q(xa, y, zTop);
    ctx.save();
    ctx.transform(0.7, 0.35, 0, 1, so[0], so[1]);
    ctx.fillStyle = fg || '#f8fafc';
    ctx.font = 'bold ' + Math.round(zH * 0.68) + 'px ' + (fontFam || 'Arial Black, Arial, sans-serif');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(txt, (xb - xa)/2, zH/2, (xb - xa)*0.95);
    ctx.restore();
  };

  const drawInfoMedallion = (x, y, z, rad, bgCol, rimCol, fgCol) => {
    const p = Q(x, y, z);
    ell(p[0], p[1], rad, rad, bgCol, rimCol, R*0.009);
    ctx.fillStyle = fgCol || '#ffffff';
    ctx.font = 'bold italic ' + Math.round(rad * 1.35) + 'px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('i', p[0], p[1] + rad*0.06);
  };

  const drawWindow = (xa, xb, y, za, zb, glassCol, frameCol, arched, mullions) => {
    if(arched){
      const xm = (xa+xb)/2;
      poly([Q(xa,y,za),Q(xb,y,za),Q(xb,y,zb-R*0.02),Q(xm,y,zb+R*0.015),Q(xa,y,zb-R*0.02)], glassCol, frameCol, R*0.01);
    } else {
      poly([Q(xa,y,za),Q(xb,y,za),Q(xb,y,zb),Q(xa,y,zb)], glassCol, frameCol, R*0.01);
    }
    // Subtle glass reflection streak
    poly([
      Q(xa+(xb-xa)*0.12,y,zb-R*0.015),
      Q(xa+(xb-xa)*0.30,y,zb-R*0.015),
      Q(xa+(xb-xa)*0.18,y,za+R*0.01),
      Q(xa+(xb-xa)*0.06,y,za+R*0.01)
    ], 'rgba(255,255,255,0.42)');
    const m = mullions || 1;
    for(let k=1;k<=m;k++){
      const xp = xa + (xb-xa)*k/(m+1);
      line(Q(xp,y,za), Q(xp,y,zb-(arched?R*0.01:0)), frameCol, R*0.007);
    }
  };

  const drawDoubleDoor = (xa, xb, y, z0, zTop, doorCol, frameCol, arched) => {
    const xm = (xa+xb)/2;
    if(arched){
      poly([Q(xa,y,z0),Q(xb,y,z0),Q(xb,y,zTop-R*0.022),Q(xm,y,zTop+R*0.015),Q(xa,y,zTop-R*0.022)], doorCol, frameCol, R*0.012);
    } else {
      poly([Q(xa,y,z0),Q(xb,y,z0),Q(xb,y,zTop),Q(xa,y,zTop)], doorCol, frameCol, R*0.012);
    }
    line(Q(xm,y,z0), Q(xm,y,zTop), frameCol, R*0.009);
    // Brass handles
    [-R*0.014, R*0.014].forEach(dx=>{
      const hp = Q(xm+dx, y, z0+(zTop-z0)*0.48);
      ell(hp[0], hp[1], R*0.006, R*0.006, '#fde047');
    });
  };

  // 1. Optional Hex Tile Base (uses original unscaled Hr so hex size remains standard)
  if(o.tile !== false){
    hexPath(ctx, cx, cy, Hr);
    ctx.fillStyle = theme === 'unthemed' ? '#cbd5e1' : skin.hex;
    ctx.fill();
    ctx.lineWidth = Math.max(2, Hr*0.055);
    ctx.strokeStyle = accent;
    ctx.stroke();
  }

  const x0 = -R*0.42, x1 = R*0.42, y0 = -R*0.25, y1 = R*0.25, H = R*0.23, z0 = 0;

  // Soft ambient ground shadow directly beneath the building footprint only (NO concrete slab!)
  const drawBuildingShadow = (xa, xb, ya, yb) => {
    ctx.save();
    ctx.translate(fl*R*0.06, R*0.03);
    poly([Q(xa,ya,0),Q(xb,ya,0),Q(xb,yb,0),Q(xa,yb,0)], 'rgba(15,23,42,.26)');
    ctx.restore();
  };

  /* =====================================================================
   * VARIANT 1: UNTHEMED STANDARD (rideThemeTier <= 2: None, Light, Medium)
   * Clean single-mass modern Guest Relations pavilion + centered rooftop skylight cube
   * ===================================================================== */
  if(theme === 'unthemed'){
    drawBuildingShadow(x0-R*0.02, x1+R*0.02, y0-R*0.02, y1+R*0.02);
    // 1. Solid main architectural volume (no split/clipping boxes!)
    isoBox(x0, x1, y0, y1, z0, H, '#f8fafc', '#cbd5e1', shade(accent,-0.15), '#94a3b8', R*0.008);
    // Recessed flat roof deck
    poly([Q(x0+R*0.04,y0+R*0.04,H),Q(x1-R*0.04,y0+R*0.04,H),Q(x1-R*0.04,y1-R*0.04,H),Q(x0+R*0.04,y1-R*0.04,H)], '#e2e8f0', '#94a3b8', R*0.007);
    // Wrap-around accent fascia band at roofline
    poly([Q(x0,y1,R*0.16),Q(x1,y1,R*0.16),Q(x1,y1,H),Q(x0,y1,H)], accent);
    poly([Q(x1,y0,R*0.16),Q(x1,y1,R*0.16),Q(x1,y1,H),Q(x1,y0,H)], shade(accent,-0.25));
    frontText(x0, x1, y1, H, R*0.072, 'GUEST SERVICES', '#ffffff');
    // Left & right service windows + end wall window
    drawWindow(-R*0.37, -R*0.14, y1, R*0.045, R*0.135, '#7dd3fc', '#475569', false, 1);
    drawWindow( R*0.14,  R*0.37, y1, R*0.045, R*0.135, '#7dd3fc', '#475569', false, 1);
    poly([Q(x1,-R*0.13,R*0.045),Q(x1,R*0.13,R*0.045),Q(x1,R*0.13,R*0.135),Q(x1,-R*0.13,R*0.135)], '#38bdf8', '#475569', R*0.009);
    // Central glass double entrance doors + cantilevered welcome canopy
    drawDoubleDoor(-R*0.10, R*0.10, y1, z0, R*0.14, '#0284c7', '#334155', false);
    isoBox(-R*0.14, R*0.14, y1, y1+R*0.055, R*0.14, R*0.16, shade(accent,-0.1), shade(accent,-0.3), '#f8fafc');
    // 2. Centered rooftop glass skylight lantern sitting cleanly on top of z = H
    const tx0 = -R*0.15, tx1 = R*0.15, ty0 = -R*0.11, ty1 = R*0.11, tH = H + R*0.085;
    isoBox(tx0, tx1, ty0, ty1, H, tH, '#bae6fd', '#38bdf8', '#f8fafc', '#475569', R*0.009);
    isoBox(tx0-R*0.015, tx1+R*0.015, ty0-R*0.015, ty1+R*0.015, tH, tH+R*0.022, accent, shade(accent,-0.25), '#ffffff');
    // Iconic "i" Information Medallion mounted on the rooftop lantern
    drawInfoMedallion(0, ty1+R*0.01, tH+R*0.045, R*0.048, accent, '#ffffff', '#ffffff');
    return;
  }

  /* =====================================================================
   * VARIANT 2: CLASSIC MIDWAY (Main Street Victorian "City Hall" Parlor)
   * ===================================================================== */
  if(theme === 'classic'){
    drawBuildingShadow(x0-R*0.03, x1+R*0.03, y0-R*0.02, y1+R*0.03);
    // 1. Stone foundation course + warm red-brick Victorian hall with cream corner pilasters
    isoBox(x0-R*0.01, x1+R*0.01, y0-R*0.01, y1+R*0.01, z0, R*0.04, '#d6ceba', '#a8997a', '#f5f0e1');
    isoBox(x0, x1, y0, y1, R*0.04, H, '#b91c1c', '#8a2620', '#fff9ed', '#7f1d1d', R*0.008);
    // Cream corner & center pilasters along +Y facade
    [x0, -R*0.13, R*0.10, x1-R*0.03].forEach(xp=>{
      poly([Q(xp,y1,R*0.04),Q(xp+R*0.03,y1,R*0.04),Q(xp+R*0.03,y1,H),Q(xp,y1,H)], '#fff9ed');
    });
    // Arched Victorian parlor windows + red/cream striped awnings
    [[-R*0.36,-R*0.16],[R*0.16,R*0.36]].forEach(([xa,xb])=>{
      drawWindow(xa, xb, y1, R*0.06, R*0.155, '#fde68a', '#fff9ed', true, 1);
      for(let i=0;i<4;i++){
        const a = xa+(xb-xa)*i/4, b = xa+(xb-xa)*(i+1)/4;
        poly([Q(a,y1,R*0.15),Q(b,y1,R*0.15),Q(b,y1+R*0.045,R*0.125),Q(a,y1+R*0.045,R*0.125)], i%2?'#fff9ed':'#d9342b');
      }
    });
    // Grand arched mahogany double doors + gold pediment sign ("CITY HALL")
    drawDoubleDoor(-R*0.09, R*0.09, y1, R*0.04, R*0.165, '#451a03', '#f5c542', true);
    poly([Q(x0,y1,R*0.175),Q(x1,y1,R*0.175),Q(x1,y1,H),Q(x0,y1,H)], '#1e3a8a', '#f5c542', R*0.01);
    frontText(x0, x1, y1, H, R*0.065, 'CITY HALL • INFO', '#fff3b0', 'Georgia, serif');
    // 2. Watertight 4-sided Second-Empire Slate Mansard Hip Roof
    const rH = R*0.10;
    hipRoof(x0, x1, y0, y1, H, rH, R*0.025, R*0.12, '#334155', '#f5c542', 2);
    // 3. Central Victorian Clock Cupola with gold dome & flagpole sitting on the roof ridge
    const cZ = H + rH - R*0.01;
    isoBox(-R*0.10, R*0.10, -R*0.08, R*0.08, cZ, cZ+R*0.095, '#fff9ed', '#dfd3b8', '#f5c542', '#b8861b', R*0.008);
    const ck = Q(0, R*0.082, cZ+R*0.05);
    ell(ck[0], ck[1], R*0.032, R*0.032, '#ffffff', '#b8861b', R*0.008);
    line(ck, [ck[0], ck[1]-R*0.018], '#1e293b', R*0.006);
    line(ck, [ck[0]+R*0.014, ck[1]], '#1e293b', R*0.006);
    const dm = Q(0, 0, cZ+R*0.13);
    ell(dm[0], dm[1], R*0.08, R*0.052, '#f5c542', '#b8861b', R*0.008);
    line(dm, [dm[0], dm[1]-R*0.085], '#f5c542', R*0.011);
    poly([[dm[0],dm[1]-R*0.085],[dm[0]+R*0.07,dm[1]-R*0.065],[dm[0],dm[1]-R*0.04]], '#d9342b');
    return;
  }

  /* =====================================================================
   * VARIANT 3: JUNGLE (Expedition Outpost & Temple Explorer Headquarters)
   * Watertight 4-sided 2-tier palm-thatch hip roof + carved stone sun crest
   * ===================================================================== */
  if(theme === 'jungle'){
    drawBuildingShadow(x0-R*0.04, x1+R*0.04, y0-R*0.02, y1+R*0.03);
    // 1. Stepped Mesoamerican temple stone plinth + carved limestone block walls
    isoBox(x0-R*0.025, x1+R*0.025, y0-R*0.02, y1+R*0.02, z0, R*0.045, '#8e8a72', '#6e6a56', '#bdb9a0');
    isoBox(x0, x1, y0, y1, R*0.045, H, '#bdb9a0', '#8e8a72', '#6e6a56', '#595443', R*0.008);
    // Bamboo-screened map windows + side window
    drawWindow(-R*0.36, -R*0.15, y1, R*0.065, R*0.155, '#fde68a', '#78350f', false, 2);
    drawWindow( R*0.15,  R*0.36, y1, R*0.065, R*0.155, '#fde68a', '#78350f', false, 2);
    poly([Q(x1,-R*0.12,R*0.065),Q(x1,R*0.12,R*0.065),Q(x1,R*0.12,R*0.155),Q(x1,-R*0.12,R*0.155)], '#eab308', '#78350f', R*0.009);
    // Corbel-arched central Explorer Portal with jade & gold trim
    poly([Q(-R*0.12,y1,R*0.045),Q(R*0.12,y1,R*0.045),Q(R*0.08,y1,R*0.17),Q(-R*0.08,y1,R*0.17)], '#137a70', '#eab308', R*0.011);
    poly([Q(-R*0.075,y1,R*0.045),Q(R*0.075,y1,R*0.045),Q(R*0.05,y1,R*0.15),Q(-R*0.05,y1,R*0.15)], '#291509');
    // Jade & gold glyph frieze band
    poly([Q(x0,y1,R*0.17),Q(x1,y1,R*0.17),Q(x1,y1,H),Q(x0,y1,H)], '#137a70', '#eab308', R*0.01);
    poly([Q(x1,y0,R*0.17),Q(x1,y1,R*0.17),Q(x1,y1,H),Q(x1,y0,H)], '#0f524b');
    frontText(x0, x1, y1, H, R*0.065, 'EXPLORER HQ', '#fef08a');
    // 2. Watertight Lower Tier Palm-Thatch Hip Roof
    const rH1 = R*0.095;
    hipRoof(x0, x1, y0, y1, H, rH1, R*0.04, R*0.14, '#b5893d', '#78520d', 2);
    // 3. Upper Temple Clerestory Box + Second Tier Thatch Hip Roof & Golden Sun-Compass Crest
    const z2 = H + rH1 - R*0.015;
    isoBox(-R*0.20, R*0.20, -R*0.11, R*0.11, z2, z2+R*0.055, '#bdb9a0', '#8e8a72', '#dad7c3', '#595443', R*0.008);
    hipRoof(-R*0.20, R*0.20, -R*0.11, R*0.11, z2+R*0.055, R*0.075, R*0.025, R*0.10, '#c99a49', '#78520d', 1);
    // Golden Sun-Compass Medallion mounted on front of the upper temple tier
    drawInfoMedallion(0, R*0.12, z2+R*0.035, R*0.042, '#137a70', '#eab308', '#fef08a');
    return;
  }

  /* =====================================================================
   * VARIANT 4: WILD WEST (Town Marshal, Assay & Telegraph Office)
   * ===================================================================== */
  if(theme === 'western'){
    drawBuildingShadow(x0-R*0.03, x1+R*0.03, y0-R*0.02, y1+R*0.04);
    // 1. Weathered horizontal clapboard timber body + watertight gable roof behind false-front
    const H2 = R*0.25, Hpar = R*0.37;
    isoBox(x0, x1, y0, y1, z0, H2, '#b8824c', '#8a5a33', '#78350f', '#451a03', R*0.009);
    gableRoof(x0, x1, y0, y1, H2, R*0.075, R*0.015, '#64748b', '#78350f', '#334155', 2);
    for(let z=R*0.04; z<H2; z+=R*0.035) line(Q(x0,y1,z), Q(x1,y1,z), 'rgba(69,26,3,.3)', R*0.006);
    // 2. Tall stepped Western False-Front Parapet rising flush from the +Y wall
    poly([
      Q(x0,y1,H2), Q(x1,y1,H2),
      Q(x1,y1,H2+R*0.045), Q(x1-R*0.08,y1,H2+R*0.045),
      Q(x1-R*0.08,y1,Hpar-R*0.025), Q(0,y1,Hpar+R*0.025),
      Q(x0+R*0.08,y1,Hpar-R*0.025), Q(x0+R*0.08,y1,H2+R*0.045),
      Q(x0,y1,H2+R*0.045)
    ], '#9a3412', '#451a03', R*0.012);
    // Cream signboard + Golden Sheriff Star badge on pediment
    poly([Q(x0+R*0.09,y1,H2+R*0.01),Q(x1-R*0.09,y1,H2+R*0.01),Q(x1-R*0.09,y1,Hpar-R*0.035),Q(x0+R*0.09,y1,Hpar-R*0.035)], '#fef3c7', '#451a03', R*0.01);
    frontText(x0+R*0.09, x1-R*0.09, y1, Hpar-R*0.035, R*0.075, 'MARSHAL & INFO', '#451a03', 'Georgia, serif');
    const st = Q(0, y1, Hpar - R*0.005);
    ell(st[0], st[1], R*0.034, R*0.034, '#f5c542', '#78350f', R*0.008);
    ell(st[0], st[1], R*0.013, R*0.013, '#b45309');
    // Barred Assay/Telegraph teller windows & double timber office doors
    drawWindow(-R*0.36, -R*0.14, y1, R*0.045, R*0.135, '#fde047', '#451a03', false, 2);
    drawWindow( R*0.14,  R*0.36, y1, R*0.045, R*0.135, '#fde047', '#451a03', false, 2);
    drawDoubleDoor(-R*0.085, R*0.085, y1, z0, R*0.14, '#5a3b22', '#451a03', false);
    // Attached corrugated-tin porch overhang + 4 cedar posts
    poly([Q(x0-R*0.015,y1+R*0.055,R*0.14),Q(x1+R*0.015,y1+R*0.055,R*0.14),Q(x1+R*0.015,y1,R*0.175),Q(x0-R*0.015,y1,R*0.175)], '#64748b', '#334155', R*0.01);
    [x0+R*0.01, -R*0.12, R*0.12, x1-R*0.01].forEach(px=>line(Q(px,y1+R*0.05,z0), Q(px,y1+R*0.05,R*0.14), '#5a3b22', R*0.013));
    return;
  }

  /* =====================================================================
   * VARIANT 5: FRONTIER (National Park Ranger Station & Lookout Lodge)
   * Watertight cedar-shake gable roof + centered fire-lookout cupola
   * ===================================================================== */
  if(theme === 'frontier'){
    drawBuildingShadow(x0-R*0.03, x1+R*0.03, y0-R*0.02, y1+R*0.03);
    // 1. River-stone wainscot base + notched whole-log cabin walls
    isoBox(x0, x1, y0, y1, z0, R*0.055, '#80858d', '#5f656c', null, '#475569', R*0.008);
    isoBox(x0, x1, y0, y1, R*0.055, H, '#8a5a33', '#6f4524', null, '#4a3320', R*0.009);
    for(let z=R*0.08; z<H; z+=R*0.034){
      line(Q(x0,y1,z), Q(x1,y1,z), '#5a3b22', R*0.01);
      [x0, x1].forEach(xp=>{const lp=Q(xp,y1,z); ell(lp[0],lp[1],R*0.018,R*0.014,'#d9b27a','#5a3b22',R*0.005);});
    }
    // Warm amber lodge windows & heavy timber ranger double doors
    drawWindow(-R*0.36, -R*0.14, y1, R*0.065, R*0.15, '#fde047', '#4a3320', false, 1);
    drawWindow( R*0.14,  R*0.36, y1, R*0.065, R*0.15, '#fde047', '#4a3320', false, 1);
    drawDoubleDoor(-R*0.085, R*0.085, y1, z0, R*0.155, '#4a3320', '#d9b27a', false);
    // 2. Watertight Forest-Green Cedar-Shake Gable Roof
    const rH = R*0.125;
    gableRoof(x0, x1, y0, y1, H, rH, R*0.035, '#2f5f3a', '#6f4524', '#1e3f26', 3);
    // Carved timber signboard mounted along the front eaves
    poly([Q(-R*0.25,y1+R*0.01,R*0.165),Q(R*0.25,y1+R*0.01,R*0.165),Q(R*0.25,y1+R*0.01,H+R*0.025),Q(-R*0.25,y1+R*0.01,H+R*0.025)], '#4a3320', '#d9b27a', R*0.01);
    frontText(-R*0.25, R*0.25, y1+R*0.01, H+R*0.025, R*0.075, 'RANGER STATION', '#fde68a');
    // 3. Rooftop Timber Fire-Lookout Cupola sitting cleanly on the ridge
    const cZ = H + rH - R*0.02;
    isoBox(-R*0.11, R*0.11, -R*0.09, R*0.09, cZ, cZ+R*0.08, '#9bd0e8', '#38bdf8', '#e0f2fe', '#4a3320', R*0.01);
    pyramidRoof(-R*0.11, R*0.11, -R*0.09, R*0.09, cZ+R*0.08, R*0.075, R*0.02, '#2f5f3a', '#1e3f26');
    return;
  }

  /* =====================================================================
   * VARIANT 6: SPACE (Galactic Command & Telemetry Concierge Dome)
   * ===================================================================== */
  if(theme === 'space'){
    const c0 = Q(0, 0, 0);
    ell(c0[0], c0[1]+R*0.02, R*0.46, R*0.23, 'rgba(15,23,42,.38)', '#22d3ee', R*0.01);
    // Brushed white-titanium command base + dark-slate wrap-around telemetry visor
    isoBox(x0*0.94, x1*0.94, y0*0.95, y1*0.95, z0, R*0.20, '#f8fafc', '#cbd5e1', '#e2e8f0', '#94a3b8', R*0.009);
    poly([Q(x0*0.94,y1*0.95,R*0.145),Q(x1*0.94,y1*0.95,R*0.145),Q(x1*0.94,y1*0.95,R*0.20),Q(x0*0.94,y1*0.95,R*0.20)], '#0f172a', '#22d3ee', R*0.011);
    poly([Q(x1*0.94,y0*0.95,R*0.145),Q(x1*0.94,y1*0.95,R*0.145),Q(x1*0.94,y1*0.95,R*0.20),Q(x1*0.94,y0*0.95,R*0.20)], '#090d16');
    frontText(x0*0.94, x1*0.94, y1*0.95, R*0.198, R*0.055, 'COMMAND NEXUS', '#22d3ee', 'monospace');
    // Panoramic cobalt observation windows & glowing cyan airlock doors
    drawWindow(-R*0.35, -R*0.14, y1*0.95, R*0.045, R*0.125, '#0284c7', '#22d3ee', false, 1);
    drawWindow( R*0.14,  R*0.35, y1*0.95, R*0.045, R*0.125, '#0284c7', '#22d3ee', false, 1);
    drawDoubleDoor(-R*0.09, R*0.09, y1*0.95, z0, R*0.13, '#0f172a', '#22d3ee', false);
    // Tiered metallic saucer roof dome + hovering holographic "i" globe
    const dBase = Q(0, 0, R*0.22);
    ell(dBase[0], dBase[1], R*0.31, R*0.145, '#0284c7', '#38bdf8', R*0.012);
    ell(dBase[0], dBase[1]-R*0.032, R*0.22, R*0.10, '#f8fafc', '#22d3ee', R*0.009);
    const spTop = Q(0, 0, R*0.38);
    line(dBase, spTop, '#cbd5e1', R*0.018);
    ell(spTop[0], spTop[1]+R*0.035, R*0.095, R*0.036, null, '#c084fc', R*0.01);
    drawInfoMedallion(0, 0, R*0.39, R*0.046, '#0f172a', '#22d3ee', '#22d3ee');
    return;
  }

  /* =====================================================================
   * VARIANT 7: GOTHIC (Victorian Haunted Abbey Chancery & Chapterhouse)
   * ===================================================================== */
  if(theme === 'gothic'){
    drawBuildingShadow(x0-R*0.03, x1+R*0.03, y0-R*0.02, y1+R*0.03);
    // 1. Dark ashlar stone walls + corner buttresses
    isoBox(x0, x1, y0, y1, z0, H, '#3f3f46', '#27272a', null, '#18181b', R*0.01);
    [x0, -R*0.13, R*0.11, x1-R*0.03].forEach(xp=>{
      isoBox(xp, xp+R*0.03, y1-R*0.01, y1+R*0.02, z0, H, '#52525b', '#27272a', '#71717a');
    });
    // Pointed lancet stained-glass windows + arched oak Chancery portal
    drawWindow(-R*0.35, -R*0.16, y1, R*0.045, R*0.145, '#991b1b', '#18181b', true, 1);
    drawWindow( R*0.16,  R*0.35, y1, R*0.045, R*0.145, '#991b1b', '#18181b', true, 1);
    drawDoubleDoor(-R*0.085, R*0.085, y1, z0, R*0.145, '#18181b', '#a1a1aa', true);
    // Crimson gothic frieze band
    poly([Q(x0,y1,R*0.17),Q(x1,y1,R*0.17),Q(x1,y1,H),Q(x0,y1,H)], '#450a0a', '#991b1b', R*0.01);
    frontText(x0, x1, y1, H, R*0.06, 'ABBEY CHANCERY', '#fca5a5', 'Georgia, serif');
    // 2. Watertight Steep Dark-Slate Gable Roof
    const rH = R*0.145;
    gableRoof(x0, x1, y0, y1, H, rH, R*0.025, '#1e293b', '#27272a', '#0f172a', 3);
    // 3. Central Gothic Stone Belfry Tower & Verdigris Copper Spire
    const tZ = H + rH - R*0.025;
    isoBox(-R*0.085, R*0.085, -R*0.075, R*0.075, tZ, tZ+R*0.075, '#52525b', '#27272a', '#3f3f46', '#18181b', R*0.008);
    drawInfoMedallion(0, R*0.08, tZ+R*0.038, R*0.032, '#450a0a', '#f5c542', '#fde047');
    const ap = pyramidRoof(-R*0.085, R*0.085, -R*0.075, R*0.075, tZ+R*0.075, R*0.12, R*0.015, '#2c5e54', '#134e4a');
    line(ap, [ap[0], ap[1]-R*0.05], '#18181b', R*0.012);
    return;
  }

  /* =====================================================================
   * VARIANT 8: MEDIEVAL (Royal Herald's Guildhall & Tudor Registry)
   * ===================================================================== */
  if(theme === 'medieval'){
    drawBuildingShadow(x0-R*0.03, x1+R*0.03, y0-R*0.02, y1+R*0.03);
    // 1. Cut-stone ground course + half-timbered cream plaster upper wall
    isoBox(x0, x1, y0, y1, z0, R*0.075, '#64748b', '#475569', null, '#334155', R*0.008);
    isoBox(x0, x1, y0, y1, R*0.075, H, '#fef3c7', '#dfd3b8', null, '#451a03', R*0.011);
    // Dark oak Tudor vertical posts & horizontal belt beam
    [-R*0.42,-R*0.14,R*0.14,R*0.42].forEach(xp=>line(Q(xp,y1,R*0.075), Q(xp,y1,H), '#451a03', R*0.014));
    line(Q(x0,y1,R*0.165), Q(x1,y1,R*0.165), '#451a03', R*0.013);
    // Leaded windows & arched oak Guildhall portal
    drawWindow(-R*0.36, -R*0.16, y1, R*0.09, R*0.155, '#fde047', '#451a03', false, 1);
    drawWindow( R*0.16,  R*0.36, y1, R*0.09, R*0.155, '#fde047', '#451a03', false, 1);
    drawDoubleDoor(-R*0.085, R*0.085, y1, z0, R*0.14, '#78350f', '#f5c542', true);
    // Royal blue & gold heraldic fascia band
    poly([Q(x0,y1,R*0.17),Q(x1,y1,R*0.17),Q(x1,y1,H),Q(x0,y1,H)], '#1d4ed8', '#f5c542', R*0.01);
    frontText(x0, x1, y1, H, R*0.06, 'ROYAL GUILDHALL', '#fef08a', 'Georgia, serif');
    // 2. Watertight Steep Terracotta/Slate Gable Roof
    const rH = R*0.135;
    gableRoof(x0, x1, y0, y1, H, rH, R*0.03, '#334155', '#dfd3b8', '#451a03', 3);
    // 3. Central Timber Bell Turret with Royal Crimson Spire & Pennant
    const tZ = H + rH - R*0.02;
    isoBox(-R*0.085, R*0.085, -R*0.075, R*0.075, tZ, tZ+R*0.07, '#fef3c7', '#dfd3b8', '#b91c1c', '#451a03', R*0.009);
    const ap = pyramidRoof(-R*0.085, R*0.085, -R*0.075, R*0.075, tZ+R*0.07, R*0.10, R*0.018, '#b91c1c', '#f5c542');
    line(ap, [ap[0], ap[1]-R*0.065], '#f5c542', R*0.012);
    poly([[ap[0],ap[1]-R*0.065],[ap[0]+R*0.07,ap[1]-R*0.048],[ap[0],ap[1]-R*0.028]], '#eab308');
    return;
  }

  /* =====================================================================
   * VARIANT 9: ALPS (Alpine Mountain Guides & Ski Patrol Chalet)
   * ===================================================================== */
  if(theme === 'alps'){
    drawBuildingShadow(x0-R*0.04, x1+R*0.04, y0-R*0.02, y1+R*0.03);
    // 1. Crisp whitewashed lower stucco + warm honey-larch timber upper chalet
    isoBox(x0, x1, y0, y1, z0, R*0.115, '#f8fafc', '#cbd5e1', null, '#94a3b8', R*0.008);
    isoBox(x0, x1, y0, y1, R*0.115, H, '#b45309', '#78350f', null, '#451a03', R*0.009);
    // Carved wooden balcony rail & red geranium flower boxes along the front belt course
    line(Q(x0-R*0.01,y1+R*0.01,R*0.12), Q(x1+R*0.01,y1+R*0.01,R*0.12), '#451a03', R*0.018);
    [-R*0.26, 0, R*0.26].forEach(fx=>{
      const fp = Q(fx, y1+R*0.015, R*0.125);
      ell(fp[0], fp[1], R*0.048, R*0.016, '#15803d');
      ell(fp[0]-R*0.015, fp[1]-R*0.007, R*0.013, R*0.013, '#ef4444');
      ell(fp[0]+R*0.015, fp[1]-R*0.007, R*0.013, R*0.013, '#ef4444');
    });
    // Chalet windows with red shutters & arched larch entrance door
    drawWindow(-R*0.35, -R*0.14, y1, R*0.03, R*0.105, '#7dd3fc', '#dc2626', false, 1);
    drawWindow( R*0.14,  R*0.35, y1, R*0.03, R*0.105, '#7dd3fc', '#dc2626', false, 1);
    drawDoubleDoor(-R*0.08, R*0.08, y1, z0, R*0.11, '#78350f', '#451a03', true);
    frontText(x0, x1, y1, H, R*0.068, 'ALPINE GUIDES', '#fef3c7');
    // 2. Watertight Wide-Eaved Alpine Chalet Gable Roof with snow blanket
    const rH = R*0.11;
    gableRoof(x0, x1, y0, y1, H, rH, R*0.05, '#78350f', '#92400e', '#451a03', 2);
    // Snow blanket cap along the upper roof slope
    const xa = x0 - R*0.045, xb = x1 + R*0.045, yb = y1 + R*0.045;
    poly([Q(xa,yb*0.55,H+rH*0.45),Q(xb,yb*0.55,H+rH*0.45),Q(xb,0,H+rH),Q(xa,0,H+rH)], '#f8fafc', '#bae6fd', R*0.008);
    // 3. Central Alpine Clock Turret with Red/White Swiss Cross Shield
    const cZ = H + rH - R*0.015;
    isoBox(-R*0.08, R*0.08, -R*0.07, R*0.07, cZ, cZ+R*0.07, '#f8fafc', '#cbd5e1', '#dc2626', '#451a03', R*0.008);
    const sc = Q(0, R*0.075, cZ+R*0.035);
    ell(sc[0], sc[1], R*0.028, R*0.028, '#dc2626', '#ffffff', R*0.006);
    line([sc[0]-R*0.014,sc[1]], [sc[0]+R*0.014,sc[1]], '#ffffff', R*0.009);
    line([sc[0],sc[1]-R*0.014], [sc[0],sc[1]+R*0.014], '#ffffff', R*0.009);
    pyramidRoof(-R*0.08, R*0.08, -R*0.07, R*0.07, cZ+R*0.07, R*0.075, R*0.015, '#0d9488', '#0f766e');
    return;
  }

  /* =====================================================================
   * VARIANT 10: FIESTA (Spanish Colonial Ayuntamiento / Town Hall)
   * ===================================================================== */
  if(theme === 'fiesta'){
    drawBuildingShadow(x0-R*0.03, x1+R*0.03, y0-R*0.02, y1+R*0.03);
    // 1. Warm cream adobe stucco walls + turquoise Talavera wainscot & rose-red upper frieze
    isoBox(x0, x1, y0, y1, z0, H, '#fef3c7', '#fde68a', null, '#d97706', R*0.008);
    poly([Q(x0,y1,z0),Q(x1,y1,z0),Q(x1,y1,R*0.042),Q(x0,y1,R*0.042)], '#0d9488', '#f59e0b', R*0.008);
    poly([Q(x0,y1,R*0.17),Q(x1,y1,R*0.17),Q(x1,y1,H),Q(x0,y1,H)], '#e11d48', '#f59e0b', R*0.01);
    frontText(x0, x1, y1, H, R*0.065, 'INFORMACIÓN', '#fef08a');
    // Triple Spanish Colonial arched loggia portal across the front
    [-R*0.26, 0, R*0.26].forEach((ax, idx)=>{
      const w = R*0.095;
      if(idx === 1){
        drawDoubleDoor(ax-w, ax+w, y1, z0, R*0.15, '#78350f', '#c2410c', true);
      } else {
        drawWindow(ax-w, ax+w, y1, R*0.045, R*0.15, '#0284c7', '#c2410c', true, 1);
      }
    });
    // 2. Watertight 4-Sided Red Terracotta Barrel-Tile (Tejas) Hip Roof
    const rH = R*0.10;
    hipRoof(x0, x1, y0, y1, H, rH, R*0.035, R*0.14, '#c2410c', '#7c2d12', 2);
    // 3. Central Spanish Colonial Bell-Gable (Espadaña) with Golden Bell sitting on the ridge
    const bZ = H + rH - R*0.015;
    isoBox(-R*0.13, R*0.13, -R*0.04, R*0.04, bZ, bZ+R*0.085, '#fef3c7', '#fde68a', '#c2410c', '#c2410c', R*0.01);
    const bl = Q(0, R*0.045, bZ+R*0.042);
    ell(bl[0], bl[1], R*0.028, R*0.032, '#f5c542', '#78350f', R*0.007);
    const topP = Q(0, 0, bZ+R*0.11);
    line(topP, [topP[0], topP[1]-R*0.045], '#f5c542', R*0.011);
    line([topP[0]-R*0.02, topP[1]-R*0.028], [topP[0]+R*0.02, topP[1]-R*0.028], '#f5c542', R*0.009);
    return;
  }

  /* =====================================================================
   * VARIANT 11: NORDIC (Viking Jarl's Law-House & Stave Council Hall)
   * Watertight 2-tier stave gable roof + crossed golden dragon finials
   * ===================================================================== */
  if(theme === 'nordic'){
    drawBuildingShadow(x0-R*0.03, x1+R*0.03, y0-R*0.02, y1+R*0.03);
    // 1. Stone foundation + dark tarred vertical pine stave walls & carved gold rune band
    isoBox(x0, x1, y0, y1, z0, R*0.04, '#475569', '#334155', null);
    isoBox(x0, x1, y0, y1, R*0.04, H, '#451a03', '#290f02', null, '#78350f', R*0.01);
    for(let x=x0+R*0.06; x<x1; x+=R*0.06) line(Q(x,y1,R*0.04), Q(x,y1,R*0.165), 'rgba(0,0,0,.35)', R*0.007);
    poly([Q(x0,y1,R*0.165),Q(x1,y1,R*0.165),Q(x1,y1,H),Q(x0,y1,H)], '#78350f', '#d97706', R*0.011);
    frontText(x0, x1, y1, H, R*0.065, 'JARL COUNCIL', '#fde68a', 'Georgia, serif');
    // Glowing rune windows, round Viking shields, & horseshoe-arched carved timber portal
    drawWindow(-R*0.35, -R*0.15, y1, R*0.055, R*0.14, '#38bdf8', '#d97706', false, 1);
    drawWindow( R*0.15,  R*0.35, y1, R*0.055, R*0.14, '#38bdf8', '#d97706', false, 1);
    drawDoubleDoor(-R*0.085, R*0.085, y1, R*0.04, R*0.155, '#290f02', '#f59e0b', true);
    // 2. Watertight Lower Tier Dark-Slate Stave Gable Roof
    const rH1 = R*0.115;
    gableRoof(x0, x1, y0, y1, H, rH1, R*0.035, '#334155', '#290f02', '#d97706', 3);
    // 3. Second Upper Stave Tier Box + Upper Gable Roof & Golden Dragon-Head Gable Finials
    const z2 = H + rH1 - R*0.02;
    isoBox(-R*0.22, R*0.22, -R*0.12, R*0.12, z2, z2+R*0.05, '#451a03', '#290f02', null, '#d97706', R*0.008);
    const rH2 = R*0.085;
    gableRoof(-R*0.22, R*0.22, -R*0.12, R*0.12, z2+R*0.05, rH2, R*0.02, '#1e293b', '#290f02', '#f59e0b', 2);
    const dL = Q(-R*0.24, 0, z2+R*0.05+rH2), dR = Q(R*0.24, 0, z2+R*0.05+rH2);
    line(dL, [dL[0]-R*0.055, dL[1]-R*0.055], '#f59e0b', R*0.02);
    line(dR, [dR[0]+R*0.055, dR[1]-R*0.055], '#f59e0b', R*0.02);
    drawInfoMedallion(0, R*0.13, z2+R*0.03, R*0.035, '#991b1b', '#f59e0b', '#fde047');
    return;
  }

  /* =====================================================================
   * VARIANT 12: BAVARIAN (Altes Rathaus / Bavarian Town Hall & Clock Tower)
   * ===================================================================== */
  if(theme === 'bavarian'){
    drawBuildingShadow(x0-R*0.03, x1+R*0.03, y0-R*0.02, y1+R*0.03);
    // 1. Crisp white stucco & timber framing + blue-and-white Bavarian lozenge frieze
    isoBox(x0, x1, y0, y1, z0, H, '#f8fafc', '#e2e8f0', null, '#5a3b22', R*0.011);
    poly([Q(x0,y1,R*0.165),Q(x1,y1,R*0.165),Q(x1,y1,H),Q(x0,y1,H)], '#1d4ed8', '#f59e0b', R*0.01);
    for(let k=0;k<10;k++){
      const xa = x0 + (x1-x0)*k/10, xb = x0 + (x1-x0)*(k+1)/10, xm = (xa+xb)/2;
      poly([Q(xa,y1,R*0.18),Q(xm,y1,R*0.165),Q(xb,y1,R*0.18),Q(xm,y1,R*0.195)], '#f8fafc');
    }
    frontText(x0, x1, y1, H, R*0.065, 'RATHAUS • INFO', '#ffffff');
    // Arched windows with blue shutters + central arched oak Rathaus portal
    drawWindow(-R*0.36, -R*0.14, y1, R*0.045, R*0.135, '#fde047', '#1d4ed8', false, 1);
    drawWindow( R*0.14,  R*0.36, y1, R*0.045, R*0.135, '#fde047', '#1d4ed8', false, 1);
    drawDoubleDoor(-R*0.085, R*0.085, y1, z0, R*0.145, '#78350f', '#5a3b22', true);
    // 2. Watertight Steep Red Clay-Tile Gable Roof
    const rH = R*0.125;
    gableRoof(x0, x1, y0, y1, H, rH, R*0.03, '#b91c1c', '#e2e8f0', '#7f1d1d', 3);
    // 3. Central Rathaus Clock Tower & Verdigris Copper Onion Dome
    const cZ = H + rH - R*0.02;
    isoBox(-R*0.09, R*0.09, -R*0.075, R*0.075, cZ, cZ+R*0.085, '#fef3c7', '#dfd3b8', '#0d9488', '#5a3b22', R*0.009);
    const ck = Q(0, R*0.078, cZ+R*0.042);
    ell(ck[0], ck[1], R*0.034, R*0.034, '#1e3a8a', '#f5c542', R*0.008);
    line(ck, [ck[0], ck[1]-R*0.018], '#fde047', R*0.006);
    line(ck, [ck[0]+R*0.014, ck[1]], '#fde047', R*0.006);
    const od = Q(0, 0, cZ+R*0.125);
    ell(od[0], od[1], R*0.07, R*0.052, '#0d9488', '#f59e0b', R*0.008);
    line(od, [od[0], od[1]-R*0.06], '#f59e0b', R*0.012);
  }
}
return drawGuestServices;
})();

const restroomsSkinPack = (() => {

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

/* ===== RESTROOMS THEME METADATA (UNTHEMED + 11 HEAVY/IMMERSIVE SKINS) ===== */
const RESTROOM_SKINS = {
  unthemed: {id:'unthemed', label:'Unthemed (Tier 0–2)', name:'Standard Restrooms',     sub:'Baseline Modern Park Facility',         hex:'#cbd5e1', border:'#38bdf8'},
  classic:  {id:'classic',  label:'Classic Midway',      name:'Boardwalk Comfort Sta.', sub:'1920s Victorian Pavilion & Cupola',      hex:'#cbb07c', border:'#d9342b'},
  jungle:   {id:'jungle',   label:'Jungle',              name:'Temple Bamboo Outpost',  sub:'Mossy Stone, Thatch Roof & Tiki Torches',hex:'#587c48', border:'#2fbf9a'},
  western:  {id:'western',  label:'Wild West',           name:'Bath House & Privy',     sub:'False-Front Timber & Crescent Doors',    hex:'#c99a62', border:'#8a5a33'},
  frontier: {id:'frontier', label:'Frontier',            name:'Rustic Log Station',     sub:'Notched Pine Logs & River-Stone Stack',  hex:'#7d955d', border:'#566e42'},
  space:    {id:'space',    label:'Space',               name:'Hydro-Sanitation Pod',   sub:'Titanium Hull, Scrubber Tanks & Neon',   hex:'#334155', border:'#0ea5e9'},
  gothic:   {id:'gothic',   label:'Gothic',              name:'Abbey Crypt Privy',      sub:'Lancet Arches, Copper Roof & Gargoyle',  hex:'#3b3345', border:'#991b1b'},
  medieval: {id:'medieval', label:'Medieval',            name:'Tudor Courtyard Privy',  sub:'Half-Timbered Plaster & Slate Turrets',  hex:'#6c8c58', border:'#eab308'},
  alps:     {id:'alps',     label:'Alps',                name:'Alpine Chalet Restroom', sub:'Larch Balcony, Snow Eaves & Geraniums',  hex:'#a8c5d6', border:'#0284c7'},
  fiesta:   {id:'fiesta',   label:'Fiesta',              name:'Adobe Casita Baños',     sub:'Terracotta Tejas, Talavera & Picado',    hex:'#d99b52', border:'#e11d48'},
  nordic:   {id:'nordic',   label:'Nordic',              name:'Stave Longhouse Hall',   sub:'Tarred Staves, Dragon Finials & Runes',  hex:'#4d6b63', border:'#d97706'},
  bavarian: {id:'bavarian', label:'Bavarian',            name:'Fachwerk Toiletten',     sub:'Lozenge Frieze, Onion Turret & Wreaths', hex:'#769958', border:'#2563eb'}
};

/* ===== SPRITE CODE: copy this block into engine.js ===== */
/**
 * drawRestrooms(ctx, cx, cy, R, opts)
 *  opts.accent        : Land / chain accent color (default '#38bdf8')
 *  opts.themeId       : 'classic'|'jungle'|'western'|'wildwest'|'frontier'|'space'|'gothic'|'medieval'|'alps'|'fiesta'|'nordic'|'bavarian'
 *  opts.rideThemeTier : 0..4 (<=2 draws Standard Unthemed; >=3 draws Heavy/Immersive Themed Architecture)
 *  opts.flip          : true when called under horizontal mirror
 *  opts.tile          : draw the hex tile background (default true)
 */
function drawRestrooms(ctx, cx, cy, R, o={}){
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTheme = String(o.themeId || o.theme || 'unthemed').toLowerCase();
  if(rawTheme === 'wildwest' || rawTheme === 'wild_west') rawTheme = 'western';
  const theme = (tier <= 2 || !RESTROOM_SKINS[rawTheme]) ? 'unthemed' : rawTheme;
  const skin = RESTROOM_SKINS[theme] || RESTROOM_SKINS.unthemed;
  const accent = o.accent || skin.border || '#38bdf8';
  const fl = o.flip ? -1 : 1;

  // Upscale building & site props by ~24% while keeping the hex tile radius R unchanged
  const Hr = R;
  R = R * 1.24;

  // Isometric 3D -> 2D projection & primitives matching engine.js
  const Q = (X,Y,Z) => [cx + (X - Y)*0.7, cy + (X + Y)*0.35 - Z];
  const poly = (pts,fill,stroke,lw) => {
    ctx.beginPath();
    pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.012;ctx.stroke();}
  };
  const line = (a,b,c,w) => {
    ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
  };
  const ell = (x,y,rx,ry,fill,stroke,lw) => {
    ctx.beginPath();ctx.ellipse(x,y,Math.max(0.5,rx),Math.max(0.5,ry),0,0,Math.PI*2);
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||1;ctx.stroke();}
  };
  const box = (x0,x1,y0,y1,z0,z1,cf,ce,ct,stroke,lw) => {
    poly([Q(x0,y1,z0),Q(x1,y1,z0),Q(x1,y1,z1),Q(x0,y1,z1)],cf,stroke,lw);
    poly([Q(x1,y0,z0),Q(x1,y1,z0),Q(x1,y1,z1),Q(x1,y0,z1)],ce,stroke,lw);
    if(ct) poly([Q(x0,y0,z1),Q(x1,y0,z1),Q(x1,y1,z1),Q(x0,y1,z1)],ct,stroke,lw);
  };
  // Skewed text helper on the front +Y wall
  const frontText = (xa, xb, y, zTop, zH, txt, fg, fontFam) => {
    const so = Q(xa, y, zTop);
    ctx.save();
    ctx.transform(0.7, 0.35, 0, 1, so[0], so[1]);
    ctx.fillStyle = fg || '#f8fafc';
    ctx.font = 'bold ' + Math.round(zH * 0.68) + 'px ' + (fontFam || 'Arial, sans-serif');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(txt, (xb - xa)/2, zH/2, (xb - xa)*0.95);
    ctx.restore();
  };
  // Male / Female pictogram helper on a door at Y = yDoor
  const drawPictogram = (xa, xb, yDoor, zTop, col) => {
    const so = Q(xa, yDoor, zTop);
    ctx.save();
    ctx.transform(0.7, 0.35, 0, 1, so[0], so[1]);
    ctx.scale(1.43, 1);
    const wl = (xb - xa)/1.43, m = wl/2;
    return {m, col: col||'#f8fafc'};
  };
  const finishPictogram = (p, kind) => {
    const m = p.m;
    ctx.fillStyle = p.col; ctx.strokeStyle = p.col;
    ctx.lineWidth = R*0.012; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(m, R*0.02, R*0.014, 0, 7); ctx.fill();
    if(kind === 'm'){
      ctx.fillRect(m - R*0.016, R*0.036, R*0.032, R*0.04);
      [-1,1].forEach(s=>{ctx.beginPath();ctx.moveTo(m+s*R*0.008,R*0.076);ctx.lineTo(m+s*R*0.008,R*0.1);ctx.stroke();});
    } else {
      ctx.beginPath();ctx.moveTo(m,R*0.036);ctx.lineTo(m-R*0.026,R*0.085);ctx.lineTo(m+R*0.026,R*0.085);ctx.fill();
      [-1,1].forEach(s=>{ctx.beginPath();ctx.moveTo(m+s*R*0.01,R*0.085);ctx.lineTo(m+s*R*0.01,R*0.1);ctx.stroke();});
    }
    ctx.restore();
  };
  const stdDoor = (xa, xb, yDoor, z0, frameCol, doorCol, iconCol, kind, arched) => {
    poly([Q(xa-R*0.015,yDoor,z0),Q(xb+R*0.015,yDoor,z0),Q(xb+R*0.015,yDoor,R*0.135),Q(xa-R*0.015,yDoor,R*0.135)], frameCol);
    if(arched){
      const xm = (xa+xb)/2;
      poly([Q(xa,yDoor,z0),Q(xb,yDoor,z0),Q(xb,yDoor,R*0.105),Q(xm,yDoor,R*0.132),Q(xa,yDoor,R*0.105)], doorCol);
    } else {
      poly([Q(xa,yDoor,z0),Q(xb,yDoor,z0),Q(xb,yDoor,R*0.125),Q(xa,yDoor,R*0.125)], doorCol);
    }
    const p = drawPictogram(xa, xb, yDoor, R*0.12, iconCol);
    finishPictogram(p, kind);
  };

  const x0 = -R*0.34, x1 = R*0.34, y0 = -R*0.20, y1 = R*0.20, H = R*0.25, z0 = 0;

  // 1. Optional Hex Tile Base (uses original unscaled Hr so hex size remains standard)
  if(o.tile !== false){
    hexPath(ctx, cx, cy, Hr);
    ctx.fillStyle = theme === 'unthemed' ? '#cbd5e1' : skin.hex;
    ctx.fill();
    ctx.lineWidth = Math.max(2, Hr*0.055);
    ctx.strokeStyle = accent;
    ctx.stroke();
  }

  // Soft ambient ground shadow directly beneath the building & front threshold (no rectangular slab!)
  const drawAmbientShadow = (col) => {
    ctx.save();
    ctx.translate(fl*R*0.06, R*0.03);
    poly([Q(x0-R*0.03,y0-R*0.02,0),Q(x1+R*0.03,y0-R*0.02,0),Q(x1+R*0.03,y1+R*0.03,0),Q(x0-R*0.03,y1+R*0.03,0)], col || 'rgba(15,23,42,.24)');
    ctx.restore();
    // Subtle natural stone/mat threshold step in front of the two doors only
    [-R*0.16, R*0.16].forEach(dx=>{
      poly([Q(dx-R*0.09,y1,0),Q(dx+R*0.09,y1,0),Q(dx+R*0.09,y1+R*0.08,0),Q(dx-R*0.09,y1+R*0.08,0)], 'rgba(15,23,42,.15)');
    });
  };
  drawAmbientShadow();

  /* =====================================================================
   * VARIANT 1: UNTHEMED STANDARD (rideThemeTier <= 2: None, Light, Medium)
   * ===================================================================== */
  if(theme === 'unthemed'){
    // walls
    poly([Q(x0,y1,z0),Q(x1,y1,z0),Q(x1,y1,H),Q(x0,y1,H)],'#f1f5f9');
    poly([Q(x1,y0,z0),Q(x1,y1,z0),Q(x1,y1,H),Q(x1,y0,H)],'#cbd5e1');
    // fascia band with lettering
    poly([Q(x0,y1,R*0.14),Q(x1,y1,R*0.14),Q(x1,y1,H),Q(x0,y1,H)],shade(accent,-0.25));
    poly([Q(x1,y0,R*0.14),Q(x1,y1,R*0.14),Q(x1,y1,H),Q(x1,y0,H)],shade(accent,-0.45));
    frontText(x0, x1, y1, H, R*0.11, 'RESTROOMS', '#f8fafc');
    // doors + louvre vent
    stdDoor(-R*0.24, -R*0.08, y1, z0, accent, '#334155', '#f8fafc', 'm', false);
    stdDoor( R*0.08,  R*0.24, y1, z0, accent, '#334155', '#f8fafc', 'w', false);
    for(let k=0;k<4;k++) line(Q(-R*0.035,y1,R*0.06+k*R*0.016),Q(R*0.035,y1,R*0.06+k*R*0.016),'#94a3b8',R*0.008);
    // pitched roof
    const ov=R*0.03, rh=R*0.1;
    poly([Q(x1,y0,H),Q(x1,y1,H),Q(x1,0,H+rh)],'#cbd5e1');
    poly([Q(x0-ov,y1+ov,H-R*0.01),Q(x1+ov,y1+ov,H-R*0.01),Q(x1+ov,0,H+rh),Q(x0-ov,0,H+rh)],accent);
    for(let t=0.25;t<1;t+=0.25){const y=(y1+ov)*(1-t),z=H-R*0.01+(rh+R*0.01)*t;
      line(Q(x0-ov,y,z),Q(x1+ov,y,z),shade(accent,-0.25),R*0.007);}
    line(Q(x0-ov,y1+ov,H-R*0.01),Q(x1+ov,y1+ov,H-R*0.01),shade(accent,-0.4),R*0.014);
    line(Q(x0-ov,0,H+rh),Q(x1+ov,0,H+rh),shade(accent,0.45),R*0.014);
    // site furniture: planters, fountain, bench, bin
    const bush=(X,Y)=>{const b=Q(X,Y,z0);ell(b[0]+fl*R*0.03,b[1]+R*0.01,R*0.07,R*0.03,'rgba(15,23,42,.2)');
      poly([Q(X-R*0.05,Y-R*0.05,z0),Q(X+R*0.05,Y-R*0.05,z0),Q(X+R*0.05,Y+R*0.05,z0),Q(X-R*0.05,Y+R*0.05,z0)],'#92400e');
      [[-0.03,0,'#2f7d4f'],[0.03,-0.01,'#3f9d5f'],[0,-0.04,'#256d44']].forEach(([dx,dy,c])=>{
        ctx.fillStyle=c;ctx.beginPath();ctx.arc(b[0]+dx*R,b[1]-R*0.05+dy*R,R*0.045,0,7);ctx.fill();});};
    bush(-R*0.42,R*0.3);
    const f=Q(-R*0.4,R*0.42,z0);ctx.fillStyle='#94a3b8';ctx.fillRect(f[0]-R*0.015,f[1]-R*0.07,R*0.03,R*0.07);
    ell(f[0],f[1]-R*0.07,R*0.035,R*0.016,'#e2e8f0');ell(f[0],f[1]-R*0.072,R*0.02,R*0.009,'#38bdf8');
    bush(R*0.44,R*0.3);
    const bx0=-R*0.12,bx1=R*0.2,by=R*0.4,sz=R*0.05;
    [bx0+R*0.02,bx1-R*0.02].forEach(x=>poly([Q(x,by-R*0.04,z0),Q(x+R*0.02,by-R*0.04,z0),Q(x+R*0.02,by-R*0.04,sz),Q(x,by-R*0.04,sz)],'#64748b'));
    poly([Q(bx0,by-R*0.04,sz),Q(bx1,by-R*0.04,sz),Q(bx1,by+R*0.04,sz),Q(bx0,by+R*0.04,sz)],shade(accent,-0.1),shade(accent,-0.4),R*0.008);
    poly([Q(bx0,by-R*0.04,sz),Q(bx1,by-R*0.04,sz),Q(bx1,by-R*0.04,sz+R*0.06),Q(bx0,by-R*0.04,sz+R*0.06)],shade(accent,-0.3));
    const t=Q(R*0.34,R*0.46,z0);ctx.fillStyle='#64748b';ctx.fillRect(t[0]-R*0.025,t[1]-R*0.07,R*0.05,R*0.07);
    ell(t[0],t[1]-R*0.07,R*0.03,R*0.013,accent);
    return;
  }

  /* =====================================================================
   * VARIANT 2: CLASSIC MIDWAY (1920s Coney Island Boardwalk Pavilion)
   * ===================================================================== */
  if(theme === 'classic'){
    // Cream clapboard walls + red corner pilasters
    box(x0,x1,y0,y1,z0,H,'#fff9ed','#dfd3b8',null);
    for(let z=z0+R*0.03;z<R*0.15;z+=R*0.028) line(Q(x0,y1,z),Q(x1,y1,z),'rgba(160,130,90,.3)',R*0.006);
    [x0, x1-R*0.03].forEach(xp=>poly([Q(xp,y1,z0),Q(xp+R*0.03,y1,z0),Q(xp+R*0.03,y1,H),Q(xp,y1,H)],'#d9342b'));
    // Red & gold carnival marquee fascia with chasing bulb dots
    poly([Q(x0,y1,R*0.15),Q(x1,y1,R*0.15),Q(x1,y1,H),Q(x0,y1,H)],'#b91c1c','#f5c542',R*0.012);
    poly([Q(x1,y0,R*0.15),Q(x1,y1,R*0.15),Q(x1,y1,H),Q(x1,y0,H)],'#7f1d1d');
    frontText(x0, x1, y1, H-R*0.005, R*0.095, 'COMFORT STATION', '#fff3b0', 'Georgia, serif');
    for(let k=0;k<=10;k++){
      const bp = Q(x0 + (x1-x0)*k/10, y1, R*0.155);
      ell(bp[0], bp[1], R*0.01, R*0.01, k%2?'#fff3b0':'#fbbf24');
    }
    // Arched Victorian doors + striped canvas awnings over each door
    stdDoor(-R*0.25, -R*0.08, y1, z0, '#f5c542', '#7f1d1d', '#fff3b0', 'm', true);
    stdDoor( R*0.08,  R*0.25, y1, z0, '#f5c542', '#7f1d1d', '#fff3b0', 'w', true);
    [[-R*0.26,-R*0.07],[R*0.07,R*0.26]].forEach(([xa,xb])=>{
      const n=4;
      for(let i=0;i<n;i++){
        const a=xa+(xb-xa)*i/n, b=xa+(xb-xa)*(i+1)/n;
        poly([Q(a,y1+R*0.055,R*0.115),Q(b,y1+R*0.055,R*0.115),Q(b,y1,R*0.148),Q(a,y1,R*0.148)], i%2?'#fff9ed':'#d9342b');
      }
    });
    // Center ornate brass ticket-style clock/emblem
    const em = Q(0, y1, R*0.095);
    ell(em[0], em[1], R*0.032, R*0.032, '#f5c542', '#78350f', R*0.008);
    ell(em[0], em[1], R*0.018, R*0.018, '#2a5fa8');
    // Pitched red & cream roof + Victorian brass cupola & weathervane
    const ov=R*0.035, rh=R*0.11;
    poly([Q(x1,y0,H),Q(x1,y1,H),Q(x1,0,H+rh)],'#dfd3b8');
    poly([Q(x0-ov,y1+ov,H-R*0.01),Q(x1+ov,y1+ov,H-R*0.01),Q(x1+ov,0,H+rh),Q(x0-ov,0,H+rh)],'#d9342b','#f5c542',R*0.01);
    box(-R*0.07,R*0.07,-R*0.06,R*0.06,H+rh*0.65,H+rh+R*0.07,'#fff9ed','#dfd3b8','#f5c542');
    const cupTop = Q(0,0,H+rh+R*0.11);
    ell(cupTop[0], cupTop[1]+R*0.025, R*0.065, R*0.04, '#d9342b', '#f5c542', R*0.008);
    line(cupTop, [cupTop[0], cupTop[1]-R*0.065], '#f5c542', R*0.012);
    line([cupTop[0]-R*0.04, cupTop[1]-R*0.045], [cupTop[0]+R*0.04, cupTop[1]-R*0.045], '#f5c542', R*0.01);
    // Foreground: Floral urn planters, brass drinking fountain, white iron bench, striped wastebin
    [[-R*0.44,R*0.30],[R*0.44,R*0.30]].forEach(([X,Y])=>{
      const p=Q(X,Y,z0);
      ell(p[0],p[1]-R*0.02,R*0.05,R*0.03,'#f5c542','#b8861b',R*0.007);
      ell(p[0],p[1]-R*0.06,R*0.06,R*0.04,'#2f7d4f');
      ell(p[0]-R*0.02,p[1]-R*0.07,R*0.02,R*0.02,'#ef4444');
      ell(p[0]+R*0.02,p[1]-R*0.06,R*0.02,R*0.02,'#facc15');
    });
    const f=Q(-R*0.40,R*0.43,z0);
    line(f,[f[0],f[1]-R*0.07],'#f5c542',R*0.025);
    ell(f[0],f[1]-R*0.075,R*0.04,R*0.018,'#fff9ed','#f5c542',R*0.006);
    ell(f[0],f[1]-R*0.077,R*0.022,R*0.009,'#38bdf8');
    box(-R*0.14,R*0.18,R*0.37,R*0.44,z0,z0+R*0.05,'#d9342b','#991b1b','#fff9ed');
    const tb=Q(R*0.35,R*0.45,z0);
    ctx.fillStyle='#d9342b';ctx.fillRect(tb[0]-R*0.028,tb[1]-R*0.072,R*0.056,R*0.072);
    ctx.fillStyle='#fff9ed';ctx.fillRect(tb[0]-R*0.01,tb[1]-R*0.072,R*0.02,R*0.072);
    ell(tb[0],tb[1]-R*0.072,R*0.032,R*0.014,'#f5c542');
    return;
  }

  /* =====================================================================
   * VARIANT 3: JUNGLE (Mesoamerican Temple & Bamboo Outpost)
   * ===================================================================== */
  if(theme === 'jungle'){
    // Mossy stepping stones in front of doors
    [[-0.36,0.34],[0.22,0.38],[-0.12,0.30]].forEach(([dx,dy])=>{
      const mp=Q(dx*R,dy*R,z0); ell(mp[0],mp[1],R*0.075,R*0.032,'rgba(74,122,58,.65)');
    });
    // Stepped Mayan stone block walls + jade frieze band
    box(x0-R*0.03,x1+R*0.03,y0-R*0.02,y1+R*0.02,z0,z0+R*0.04,'#8e8a72','#6e6a56','#bdb9a0');
    box(x0,x1,y0,y1,z0+R*0.04,H,'#bdb9a0','#8e8a72',null);
    poly([Q(x0,y1,R*0.145),Q(x1,y1,R*0.145),Q(x1,y1,H),Q(x0,y1,H)],'#137a70','#eab308',R*0.01);
    poly([Q(x1,y0,R*0.145),Q(x1,y1,R*0.145),Q(x1,y1,H),Q(x1,y0,H)],'#0f524ba0');
    frontText(x0, x1, y1, H-R*0.005, R*0.095, 'OUTPOST PRIVY', '#fef08a');
    // Woven bamboo mat doors + carved stone lintels
    stdDoor(-R*0.24, -R*0.08, y1, z0+R*0.04, '#78350f', '#a16207', '#fef08a', 'm', false);
    stdDoor( R*0.08,  R*0.24, y1, z0+R*0.04, '#78350f', '#a16207', '#fef08a', 'w', false);
    // Center carved stone mask relief between doors
    const mk = Q(0, y1, R*0.11);
    ell(mk[0], mk[1], R*0.038, R*0.042, '#8e8a72', '#4a3d2a', R*0.008);
    ell(mk[0]-R*0.014, mk[1]-R*0.008, R*0.009, R*0.009, '#2fbf9a');
    ell(mk[0]+R*0.014, mk[1]-R*0.008, R*0.009, R*0.009, '#2fbf9a');
    // Thick layered palm-thatch hip roof with bamboo ridge pole
    const ov=R*0.055, rh=R*0.135;
    poly([Q(x1,y0,H),Q(x1,y1,H),Q(x1,0,H+rh)],'#8a6a30');
    poly([Q(x0-ov,y1+ov,H-R*0.015),Q(x1+ov,y1+ov,H-R*0.015),Q(x1+ov*0.4,0,H+rh),Q(x0-ov*0.4,0,H+rh)],'#b5893d','#78520d',R*0.012);
    for(let t=0.28;t<0.95;t+=0.28){
      const y=(y1+ov)*(1-t), z=H-R*0.015+(rh+R*0.015)*t;
      line(Q(x0-ov*(1-t*0.5),y,z),Q(x1+ov*(1-t*0.5),y,z),'#78520d',R*0.01);
    }
    line(Q(x0-ov*0.4,0,H+rh),Q(x1+ov*0.4,0,H+rh),'#d9b27a',R*0.022);
    // Foreground: Flaming Tiki torches, carved stone frog fountain, bamboo bench & elephant-ear plants
    [-R*0.36, R*0.36].forEach(tx=>{
      const b=Q(tx,y1+R*0.06,z0), tp=Q(tx,y1+R*0.06,R*0.18);
      line(b,tp,'#5a4028',R*0.018);
      poly([[tp[0]-R*0.02,tp[1]],[tp[0],tp[1]-R*0.055],[tp[0]+R*0.02,tp[1]]],'#f97316');
      poly([[tp[0]-R*0.01,tp[1]],[tp[0],tp[1]-R*0.035],[tp[0]+R*0.01,tp[1]]],'#fde047');
    });
    const ff=Q(-R*0.40,R*0.42,z0);
    ell(ff[0],ff[1]-R*0.03,R*0.048,R*0.028,'#5f8a47','#35552c',R*0.008);
    ell(ff[0],ff[1]-R*0.035,R*0.032,R*0.014,'#2fbf9a');
    box(-R*0.12,R*0.18,R*0.38,R*0.45,z0,z0+R*0.045,'#a16207','#78350f','#d9b27a');
    const br=Q(R*0.36,R*0.44,z0);
    ctx.fillStyle='#78350f';ctx.fillRect(br[0]-R*0.028,br[1]-R*0.07,R*0.056,R*0.07);
    ell(br[0],br[1]-R*0.07,R*0.032,R*0.014,'#2fbf9a');
    return;
  }

  /* =====================================================================
   * VARIANT 4: WILD WEST (False-Front Timber Bathhouse & Outhouse Row)
   * ===================================================================== */
  if(theme === 'western'){
    // Narrow timber boardwalk porch strip along the front facade only
    poly([Q(x0-R*0.03,y1,z0),Q(x1+R*0.03,y1,z0),Q(x1+R*0.03,y1+R*0.14,z0),Q(x0-R*0.03,y1+R*0.14,z0)],'#a8784a','#5a3b22',R*0.01);
    // Weathered barn-wood walls + Tall Western Stepped False-Front Parapet on +Y face
    box(x0,x1,y0,y1,z0,H,'#9a6a3c','#6f4a28','#78350f');
    const Hpar = H + R*0.13;
    poly([
      Q(x0,y1,H), Q(x1,y1,H),
      Q(x1,y1,H+R*0.06), Q(x1-R*0.08,y1,H+R*0.06),
      Q(x1-R*0.08,y1,Hpar), Q(x0+R*0.08,y1,Hpar),
      Q(x0+R*0.08,y1,H+R*0.06), Q(x0,y1,H+R*0.06)
    ], '#8a5a33', '#451a03', R*0.012);
    // False-front sign board
    poly([Q(x0+R*0.09,y1,H+R*0.01),Q(x1-R*0.09,y1,H+R*0.01),Q(x1-R*0.09,y1,Hpar-R*0.02),Q(x0+R*0.09,y1,Hpar-R*0.02)],'#fef3c7','#451a03',R*0.01);
    frontText(x0+R*0.09, x1-R*0.09, y1, Hpar-R*0.02, R*0.10, 'BATH & PRIVY', '#451a03', 'Georgia, serif');
    // Twin rough-plank doors with classic outhouse Crescent Moon cutouts
    stdDoor(-R*0.24, -R*0.08, y1, z0, '#451a03', '#78350f', '#fef3c7', 'm', false);
    stdDoor( R*0.08,  R*0.24, y1, z0, '#451a03', '#78350f', '#fef3c7', 'w', false);
    [-R*0.16, R*0.16].forEach(dx=>{
      const mp = Q(dx, y1, R*0.155);
      ell(mp[0], mp[1], R*0.018, R*0.018, '#fbbf24');
    });
    // Slanted tin porch awning + wooden support posts
    poly([Q(x0-R*0.02,y1+R*0.12,R*0.13),Q(x1+R*0.02,y1+R*0.12,R*0.13),Q(x1+R*0.02,y1,R*0.18),Q(x0-R*0.02,y1,R*0.18)],'#64748b','#334155',R*0.01);
    [x0, 0, x1].forEach(px=>line(Q(px,y1+R*0.11,z0),Q(px,y1+R*0.11,R*0.13),'#5a3b22',R*0.016));
    // Foreground: Wooden rain barrel water station, hitching rail, & desert cactus planters
    const rb=Q(-R*0.40,R*0.40,z0);
    ctx.fillStyle='#78350f';ctx.fillRect(rb[0]-R*0.032,rb[1]-R*0.075,R*0.064,R*0.075);
    ell(rb[0],rb[1]-R*0.075,R*0.034,R*0.015,'#38bdf8','#451a03',R*0.008);
    // Hitching rail
    line(Q(-R*0.14,R*0.42,z0),Q(-R*0.14,R*0.42,R*0.07),'#5a3b22',R*0.016);
    line(Q( R*0.20,R*0.42,z0),Q( R*0.20,R*0.42,R*0.07),'#5a3b22',R*0.016);
    line(Q(-R*0.16,R*0.42,R*0.065),Q(R*0.22,R*0.42,R*0.065),'#8a5a33',R*0.014);
    // Saguaro cactus in whiskey half-barrel
    const cp=Q(R*0.42,R*0.34,z0);
    ell(cp[0],cp[1],R*0.045,R*0.022,'#78350f');
    line(cp,[cp[0],cp[1]-R*0.11],'#3f7d3a',R*0.026);
    line([cp[0]-R*0.035,cp[1]-R*0.05],[cp[0]-R*0.035,cp[1]-R*0.09],'#3f7d3a',R*0.016);
    line([cp[0]+R*0.035,cp[1]-R*0.06],[cp[0]+R*0.035,cp[1]-R*0.10],'#3f7d3a',R*0.016);
    return;
  }

  /* =====================================================================
   * VARIANT 5: FRONTIER (National Park Rustic Log Comfort Station)
   * ===================================================================== */
  if(theme === 'frontier'){
    // River-stone lower wainscot + stacked horizontal pine logs
    box(x0,x1,y0,y1,z0,z0+R*0.06,'#80858d','#5f656c',null);
    box(x0,x1,y0,y1,z0+R*0.06,H,'#8a5a33','#6f4524',null);
    for(let z=z0+R*0.08;z<H;z+=R*0.032){
      line(Q(x0,y1,z),Q(x1,y1,z),'#5a3b22',R*0.01);
      // Exposed notched log ends at corners
      [x0, x1].forEach(xp=>{
        const lp=Q(xp,y1,z); ell(lp[0],lp[1],R*0.018,R*0.015,'#d9b27a','#5a3b22',R*0.005);
      });
    }
    // River-stone chimney stack on right side (+X)
    box(x1-R*0.02,x1+R*0.07,-R*0.06,R*0.06,z0,H+R*0.16,'#8a8f96','#5f656c','#d8d3c2');
    // Carved timber slab sign
    poly([Q(x0+R*0.06,y1,R*0.155),Q(x1-R*0.06,y1,R*0.155),Q(x1-R*0.06,y1,H),Q(x0+R*0.06,y1,H)],'#4a3320','#d9b27a',R*0.01);
    frontText(x0+R*0.06, x1-R*0.06, y1, H, R*0.09, 'LOG COMFORT STA.', '#fde68a');
    stdDoor(-R*0.24, -R*0.08, y1, z0, '#4a3320', '#6b4a2b', '#fde68a', 'm', false);
    stdDoor( R*0.08,  R*0.24, y1, z0, '#4a3320', '#6b4a2b', '#fde68a', 'w', false);
    // Forest-green cedar-shake gable roof with log purlins
    const ov=R*0.04, rh=R*0.12;
    poly([Q(x1,y0,H),Q(x1,y1,H),Q(x1,0,H+rh)],'#6f4524');
    poly([Q(x0-ov,y1+ov,H-R*0.01),Q(x1+ov,y1+ov,H-R*0.01),Q(x1+ov,0,H+rh),Q(x0-ov,0,H+rh)],'#2f5f3a','#1e3f26',R*0.012);
    line(Q(x0-ov,0,H+rh),Q(x1+ov,0,H+rh),'#8a5a33',R*0.02);
    // Foreground: Mini pine trees, hollowed-log fountain, split-log bench
    [[-R*0.44,R*0.28],[R*0.44,R*0.28]].forEach(([X,Y])=>{
      const p=Q(X,Y,z0);
      line(p,[p[0],p[1]-R*0.12],'#4a3320',R*0.02);
      for(let k=0;k<3;k++){
        const by=p[1]-R*(0.04+k*0.035), w=R*(0.065-k*0.014);
        poly([[p[0]-w,by],[p[0],by-R*0.055],[p[0]+w,by]], k%2?'#2f5f3a':'#3d7348');
      }
    });
    const lf=Q(-R*0.38,R*0.42,z0);
    ctx.fillStyle='#6b4a2b';ctx.fillRect(lf[0]-R*0.022,lf[1]-R*0.07,R*0.044,R*0.07);
    ell(lf[0],lf[1]-R*0.07,R*0.032,R*0.015,'#d9b27a');
    ell(lf[0],lf[1]-R*0.07,R*0.02,R*0.009,'#4aa0c8');
    // Split-log bench
    line(Q(-R*0.12,R*0.41,z0+R*0.035),Q(R*0.20,R*0.41,z0+R*0.035),'#8a5a33',R*0.032);
    line(Q(-R*0.12,R*0.41,z0+R*0.045),Q(R*0.20,R*0.41,z0+R*0.045),'#d9b27a',R*0.014);
    return;
  }

  /* =====================================================================
   * VARIANT 6: SPACE (Sleek Lunar / Sci-Fi Hydro-Sanitation Pod)
   * ===================================================================== */
  if(theme === 'space'){
    // White titanium modular hull with dark slate tech bay
    box(x0,x1,y0,y1,z0,H,'#f8fafc','#cbd5e1','#e2e8f0','#94a3b8',R*0.008);
    // Glowing cyan & deep-navy futuristic fascia visor
    poly([Q(x0,y1,R*0.145),Q(x1,y1,R*0.145),Q(x1,y1,H-R*0.01),Q(x0,y1,H-R*0.01)],'#0f172a','#22d3ee',R*0.012);
    poly([Q(x1,y0,R*0.145),Q(x1,y1,R*0.145),Q(x1,y1,H-R*0.01),Q(x1,y0,H-R*0.01)],'#090d16');
    frontText(x0, x1, y1, H-R*0.01, R*0.095, 'BIO-SANITATION', '#22d3ee', 'monospace');
    // Airlock-style doors with glowing cyan/magenta neon hologram icons
    stdDoor(-R*0.24, -R*0.08, y1, z0, '#22d3ee', '#0f172a', '#22d3ee', 'm', false);
    stdDoor( R*0.08,  R*0.24, y1, z0, '#c084fc', '#0f172a', '#e879f9', 'w', false);
    // Center glowing plasma status core on front wall
    const pc = Q(0, y1, R*0.09);
    ell(pc[0], pc[1], R*0.028, R*0.028, '#0f172a', '#22d3ee', R*0.008);
    ell(pc[0], pc[1], R*0.014, R*0.014, '#22d3ee');
    // Roof: Twin cylindrical atmospheric water-recycler domes & solar fin
    [-R*0.15, R*0.15].forEach(dx=>{
      const dm = Q(dx, 0, H + R*0.03);
      ell(dm[0], dm[1], R*0.095, R*0.055, '#cbd5e1', '#38bdf8', R*0.008);
      ell(dm[0], dm[1]-R*0.02, R*0.065, R*0.035, '#22d3ee');
    });
    // Foreground: Chrome cryo-hydration pod, levitating bench & bioluminescent planters
    [[-R*0.43,R*0.30],[R*0.43,R*0.30]].forEach(([X,Y])=>{
      const p=Q(X,Y,z0);
      ell(p[0],p[1],R*0.055,R*0.026,'#0f172a','#22d3ee',R*0.008);
      ell(p[0],p[1]-R*0.035,R*0.038,R*0.038,'#a855f7');
      ell(p[0],p[1]-R*0.045,R*0.02,R*0.02,'#22d3ee');
    });
    const hf=Q(-R*0.40,R*0.43,z0);
    ell(hf[0],hf[1]-R*0.035,R*0.028,R*0.05,'#e2e8f0','#22d3ee',R*0.007);
    ell(hf[0],hf[1]-R*0.065,R*0.02,R*0.01,'#22d3ee');
    box(-R*0.12,R*0.18,R*0.38,R*0.44,z0+R*0.015,z0+R*0.05,'#e2e8f0','#94a3b8','#22d3ee');
    return;
  }

  /* =====================================================================
   * VARIANT 7: GOTHIC (Victorian Haunted Abbey Crypt / Mausoleum)
   * ===================================================================== */
  if(theme === 'gothic'){
    // Charcoal ashlar stone walls + corner buttresses
    box(x0,x1,y0,y1,z0,H,'#3f3f46','#27272a',null,'#18181b',R*0.008);
    [x0, x1-R*0.035].forEach(xp=>box(xp,xp+R*0.035,y1-R*0.01,y1+R*0.025,z0,H+R*0.02,'#52525b','#27272a','#71717a'));
    // Crimson & wrought-iron gothic frieze
    poly([Q(x0,y1,R*0.15),Q(x1,y1,R*0.15),Q(x1,y1,H),Q(x0,y1,H)],'#450a0a','#991b1b',R*0.01);
    frontText(x0, x1, y1, H, R*0.095, 'ABBEY SANCTUM', '#fca5a5', 'Georgia, serif');
    // Pointed Lancet Arch oak doors with wrought-iron hinges
    stdDoor(-R*0.24, -R*0.08, y1, z0, '#71717a', '#18181b', '#fca5a5', 'm', true);
    stdDoor( R*0.08,  R*0.24, y1, z0, '#71717a', '#18181b', '#fca5a5', 'w', true);
    // Rose window between doors
    const rw = Q(0, y1, R*0.105);
    ell(rw[0], rw[1], R*0.03, R*0.03, '#7f1d1d', '#a1a1aa', R*0.008);
    // Steeply pitched weathered verdigris-copper roof + wrought-iron ridge cresting
    const ov=R*0.03, rh=R*0.16;
    poly([Q(x1,y0,H),Q(x1,y1,H),Q(x1,0,H+rh)],'#27272a');
    poly([Q(x0-ov,y1+ov,H-R*0.01),Q(x1+ov,y1+ov,H-R*0.01),Q(x1+ov,0,H+rh),Q(x0-ov,0,H+rh)],'#2c5e54','#134e4a',R*0.012);
    line(Q(x0-ov,0,H+rh),Q(x1+ov,0,H+rh),'#18181b',R*0.018);
    for(let k=-3;k<=3;k++){
      const sp=Q(k*R*0.09,0,H+rh);
      line(sp,[sp[0],sp[1]-R*0.04],'#18181b',R*0.01);
    }
    // Foreground: Flickering Victorian gas streetlamps, stone gargoyle basin & iron bench
    [[-R*0.44,R*0.28],[R*0.44,R*0.28]].forEach(([X,Y])=>{
      const b=Q(X,Y,z0), tp=Q(X,Y,R*0.17);
      line(b,tp,'#18181b',R*0.016);
      ell(tp[0],tp[1],R*0.026,R*0.032,'#fde047','#18181b',R*0.006);
    });
    const gf=Q(-R*0.40,R*0.42,z0);
    ell(gf[0],gf[1]-R*0.03,R*0.042,R*0.022,'#52525b');
    ell(gf[0],gf[1]-R*0.035,R*0.025,R*0.011,'#38bdf8');
    box(-R*0.12,R*0.18,R*0.38,R*0.44,z0,z0+R*0.045,'#27272a','#18181b','#52525b');
    return;
  }

  /* =====================================================================
   * VARIANT 8: MEDIEVAL (Half-Timbered Tudor Courtyard Privy House)
   * ===================================================================== */
  if(theme === 'medieval'){
    // Stone base + cream plaster upper walls with dark oak half-timbering
    box(x0,x1,y0,y1,z0,z0+R*0.06,'#64748b','#475569',null);
    box(x0,x1,y0,y1,z0+R*0.06,H,'#fef3c7','#dfd3b8',null,'#451a03',R*0.012);
    // Oak timber beams & diagonal X-bracing on upper wall
    line(Q(x0,y1,R*0.145),Q(x1,y1,R*0.145),'#451a03',R*0.016);
    [-R*0.34,-R*0.05,R*0.05,R*0.34].forEach(xp=>line(Q(xp,y1,z0+R*0.06),Q(xp,y1,H),'#451a03',R*0.014));
    // Royal blue & gold heraldic banner fascia
    poly([Q(x0+R*0.04,y1,R*0.15),Q(x1-R*0.04,y1,R*0.15),Q(x1-R*0.04,y1,H-R*0.005),Q(x0+R*0.04,y1,H-R*0.005)],'#1d4ed8','#f5c542',R*0.01);
    frontText(x0+R*0.04, x1-R*0.04, y1, H-R*0.005, R*0.09, 'ROYAL PRIVY', '#fef08a', 'Georgia, serif');
    stdDoor(-R*0.24, -R*0.08, y1, z0, '#451a03', '#78350f', '#fef08a', 'm', true);
    stdDoor( R*0.08,  R*0.24, y1, z0, '#451a03', '#78350f', '#fef08a', 'w', true);
    // Steep slate roof + twin medieval cupola turrets with fluttering red/gold pennants
    const ov=R*0.035, rh=R*0.14;
    poly([Q(x1,y0,H),Q(x1,y1,H),Q(x1,0,H+rh)],'#dfd3b8','#451a03',R*0.01);
    poly([Q(x0-ov,y1+ov,H-R*0.01),Q(x1+ov,y1+ov,H-R*0.01),Q(x1+ov,0,H+rh),Q(x0-ov,0,H+rh)],'#334155','#1e293b',R*0.012);
    [-R*0.18, R*0.18].forEach((tx,i)=>{
      const tp = Q(tx, 0, H+rh+R*0.02);
      line(tp, [tp[0], tp[1]-R*0.08], '#f5c542', R*0.012);
      poly([[tp[0],tp[1]-R*0.08],[tp[0]+R*0.07,tp[1]-R*0.06],[tp[0],tp[1]-R*0.04]], i?'#b91c1c':'#2563eb');
    });
    // Foreground: Stone well fountain, heraldic shields & oak bench
    const wf=Q(-R*0.40,R*0.40,z0);
    ell(wf[0],wf[1]-R*0.02,R*0.05,R*0.026,'#64748b','#334155',R*0.01);
    ell(wf[0],wf[1]-R*0.025,R*0.034,R*0.016,'#38bdf8');
    box(-R*0.12,R*0.18,R*0.38,R*0.44,z0,z0+R*0.045,'#78350f','#451a03','#a16207');
    return;
  }

  /* =====================================================================
   * VARIANT 9: ALPS (Swiss Alpine Chalet Restroom)
   * ===================================================================== */
  if(theme === 'alps'){
    // Crisp whitewashed lower stucco + warm larch wood upper chalet level
    box(x0,x1,y0,y1,z0,R*0.14,'#f8fafc','#cbd5e1',null);
    box(x0-R*0.015,x1+R*0.015,y0,y1+R*0.02,R*0.14,H,'#b45309','#78350f',null);
    // Wooden chalet balcony railing & red geranium flower boxes along front
    line(Q(x0-R*0.02,y1+R*0.03,R*0.14),Q(x1+R*0.02,y1+R*0.03,R*0.14),'#451a03',R*0.018);
    [-R*0.22, 0, R*0.22].forEach(fx=>{
      const fp=Q(fx,y1+R*0.035,R*0.145);
      ell(fp[0],fp[1],R*0.045,R*0.018,'#15803d');
      ell(fp[0]-R*0.015,fp[1]-R*0.008,R*0.014,R*0.014,'#ef4444');
      ell(fp[0]+R*0.015,fp[1]-R*0.008,R*0.014,R*0.014,'#ef4444');
    });
    frontText(x0, x1, y1+R*0.02, H, R*0.09, 'CHALET WC', '#fef3c7');
    stdDoor(-R*0.24, -R*0.08, y1, z0, '#78350f', '#92400e', '#fef3c7', 'm', false);
    stdDoor( R*0.08,  R*0.24, y1, z0, '#78350f', '#92400e', '#fef3c7', 'w', false);
    // Wide-overhanging shallow chalet roof with snow blanket & river boulders on eaves
    const ov=R*0.065, rh=R*0.095;
    poly([Q(x1,y0,H),Q(x1,y1,H),Q(x1,0,H+rh)],'#92400e');
    poly([Q(x0-ov,y1+ov,H-R*0.015),Q(x1+ov,y1+ov,H-R*0.015),Q(x1+ov,0,H+rh),Q(x0-ov,0,H+rh)],'#78350f','#451a03',R*0.014);
    // Snow layer on upper roof slope
    poly([Q(x0-ov*0.8,y1*0.65,H+rh*0.3),Q(x1+ov*0.8,y1*0.65,H+rh*0.3),Q(x1+ov,0,H+rh),Q(x0-ov,0,H+rh)],'#f8fafc','#bae6fd',R*0.008);
    // Foreground: Carved wooden alpine trough water fountain with brass spigot
    box(-R*0.46,-R*0.24,R*0.35,R*0.45,z0,z0+R*0.05,'#78350f','#451a03','#38bdf8');
    box(-R*0.08,R*0.22,R*0.38,R*0.44,z0,z0+R*0.045,'#b45309','#78350f','#d97706');
    return;
  }

  /* =====================================================================
   * VARIANT 10: FIESTA (Spanish Colonial Adobe Casita & Talavera Tile)
   * ===================================================================== */
  if(theme === 'fiesta'){
    // Warm ochre-cream adobe stucco walls
    box(x0,x1,y0,y1,z0,H,'#fef3c7','#fde68a',null);
    // Colorful Talavera mosaic tile band (cobalt, turquoise, marigold, rose)
    poly([Q(x0,y1,R*0.145),Q(x1,y1,R*0.145),Q(x1,y1,H),Q(x0,y1,H)],'#1d4ed8','#f59e0b',R*0.01);
    frontText(x0, x1, y1, H, R*0.095, 'BAÑOS • CASITA', '#fef08a');
    // Arched carved wood doors with turquoise frames
    stdDoor(-R*0.24, -R*0.08, y1, z0, '#0d9488', '#78350f', '#fef3c7', 'm', true);
    stdDoor( R*0.08,  R*0.24, y1, z0, '#e11d48', '#78350f', '#fef3c7', 'w', true);
    // Red terracotta barrel-tile roof (tejas) with scalloped eaves
    const ov=R*0.04, rh=R*0.105;
    poly([Q(x1,y0,H),Q(x1,y1,H),Q(x1,0,H+rh)],'#fde68a');
    poly([Q(x0-ov,y1+ov,H-R*0.01),Q(x1+ov,y1+ov,H-R*0.01),Q(x1+ov,0,H+rh),Q(x0-ov,0,H+rh)],'#c2410c','#7c2d12',R*0.012);
    for(let k=-4;k<=4;k++){
      const bx = k*R*0.08;
      line(Q(bx,y1+ov,H-R*0.01),Q(bx,0,H+rh),'#ea580c',R*0.012);
    }
    // Festive Papel Picado banner garland strung across the front plaza
    const pL = Q(x0-R*0.1, y1+R*0.12, R*0.16), pR = Q(x1+R*0.1, y1+R*0.12, R*0.16);
    line(pL, pR, '#fef3c7', R*0.006);
    const pCols=['#e11d48','#10b981','#f59e0b','#3b82f6','#a855f7'];
    for(let k=1;k<8;k++){
      const q=k/8, px=pL[0]+(pR[0]-pL[0])*q, py=pL[1]+(pR[1]-pL[1])*q+Math.sin(q*Math.PI)*R*0.025;
      poly([[px-R*0.02,py],[px+R*0.02,py],[px,py+R*0.04]], pCols[k%5]);
    }
    // Foreground: Talavera tiled fountain & terracotta pots with agave/marigolds
    const tf=Q(-R*0.40,R*0.41,z0);
    ell(tf[0],tf[1]-R*0.03,R*0.045,R*0.022,'#1d4ed8','#f59e0b',R*0.008);
    ell(tf[0],tf[1]-R*0.035,R*0.028,R*0.012,'#38bdf8');
    [[-R*0.44,R*0.28],[R*0.44,R*0.28]].forEach(([X,Y])=>{
      const p=Q(X,Y,z0);
      ell(p[0],p[1]-R*0.015,R*0.045,R*0.028,'#c2410c');
      ell(p[0],p[1]-R*0.05,R*0.04,R*0.03,'#15803d');
      ell(p[0],p[1]-R*0.065,R*0.02,R*0.02,'#f59e0b');
    });
    box(-R*0.10,R*0.18,R*0.38,R*0.44,z0,z0+R*0.045,'#0d9488','#115e59','#fef3c7');
    return;
  }

  /* =====================================================================
   * VARIANT 11: NORDIC (Viking Stave-Church / Timber Longhouse Hall)
   * ===================================================================== */
  if(theme === 'nordic'){
    // Dark tarred vertical pine stave walls + carved gold rune frieze
    box(x0,x1,y0,y1,z0,H,'#451a03','#290f02',null,'#78350f',R*0.01);
    for(let x=x0+R*0.05;x<x1;x+=R*0.055) line(Q(x,y1,z0),Q(x,y1,R*0.145),'rgba(0,0,0,.35)',R*0.007);
    poly([Q(x0,y1,R*0.145),Q(x1,y1,R*0.145),Q(x1,y1,H),Q(x0,y1,H)],'#78350f','#d97706',R*0.012);
    frontText(x0, x1, y1, H, R*0.095, 'LONGHOUSE HALL', '#fde68a', 'Georgia, serif');
    stdDoor(-R*0.24, -R*0.08, y1, z0, '#d97706', '#290f02', '#fde68a', 'm', true);
    stdDoor( R*0.08,  R*0.24, y1, z0, '#d97706', '#290f02', '#fde68a', 'w', true);
    // Round painted Viking shield mounted between the doors
    const sh = Q(0, y1, R*0.095);
    ell(sh[0], sh[1], R*0.035, R*0.035, '#991b1b', '#f59e0b', R*0.008);
    ell(sh[0], sh[1], R*0.012, R*0.012, '#fde047');
    // Steep multi-tiered stave-church shingled roof + twin carved golden Dragon-Head gable finials
    const ov=R*0.035, rh=R*0.15;
    poly([Q(x1,y0,H),Q(x1,y1,H),Q(x1,0,H+rh)],'#290f02');
    poly([Q(x0-ov,y1+ov,H-R*0.01),Q(x1+ov,y1+ov,H-R*0.01),Q(x1+ov,0,H+rh),Q(x0-ov,0,H+rh)],'#334155','#1e293b',R*0.012);
    // Second upper stave roof tier
    poly([Q(x0*0.65,y1*0.5,H+rh*0.55),Q(x1*0.65,y1*0.5,H+rh*0.55),Q(x1*0.65,0,H+rh*1.32),Q(x0*0.65,0,H+rh*1.32)],'#1e293b','#d97706',R*0.01);
    // Carved gold dragon-head prows curling off both ends of the ridge
    const dL = Q(x0*0.68, 0, H+rh*1.32), dR = Q(x1*0.68, 0, H+rh*1.32);
    line(dL, [dL[0]-R*0.055, dL[1]-R*0.055], '#f59e0b', R*0.02);
    line(dR, [dR[0]+R*0.055, dR[1]-R*0.055], '#f59e0b', R*0.02);
    // Foreground: Iron fire braziers, runestone water basin, heavy timber bench
    const rf=Q(-R*0.40,R*0.41,z0);
    ell(rf[0],rf[1]-R*0.03,R*0.045,R*0.025,'#64748b');
    ell(rf[0],rf[1]-R*0.035,R*0.028,R*0.012,'#38bdf8');
    box(-R*0.12,R*0.18,R*0.38,R*0.44,z0,z0+R*0.045,'#78350f','#451a03','#d97706');
    return;
  }

  /* =====================================================================
   * VARIANT 12: BAVARIAN (Oktoberfest Fachwerk Pavilion & Onion Turret)
   * ===================================================================== */
  if(theme === 'bavarian'){
    // Crisp white stucco with rich brown Fachwerk timber framing
    box(x0,x1,y0,y1,z0,H,'#f8fafc','#e2e8f0',null,'#5a3b22',R*0.012);
    // Bavarian blue-and-white diamond lozenge frieze band
    poly([Q(x0,y1,R*0.145),Q(x1,y1,R*0.145),Q(x1,y1,H),Q(x0,y1,H)],'#1d4ed8','#f59e0b',R*0.01);
    for(let k=0;k<8;k++){
      const xa = x0 + (x1-x0)*k/8, xb = x0 + (x1-x0)*(k+1)/8, xm = (xa+xb)/2;
      poly([Q(xa,y1,R*0.16),Q(xm,y1,R*0.145),Q(xb,y1,R*0.16),Q(xm,y1,R*0.175)], '#f8fafc');
    }
    frontText(x0, x1, y1, H, R*0.095, 'TOILETTEN', '#ffffff');
    stdDoor(-R*0.24, -R*0.08, y1, z0, '#5a3b22', '#78350f', '#fde047', 'm', true);
    stdDoor( R*0.08,  R*0.24, y1, z0, '#5a3b22', '#78350f', '#fde047', 'w', true);
    // Green floral wreath with blue/white ribbons between the doors
    const wr = Q(0, y1, R*0.095);
    ell(wr[0], wr[1], R*0.032, R*0.032, null, '#15803d', R*0.014);
    ell(wr[0], wr[1]-R*0.025, R*0.012, R*0.012, '#ef4444');
    // Steep red clay tile roof + copper Onion-Domed clock/vent turret
    const ov=R*0.035, rh=R*0.125;
    poly([Q(x1,y0,H),Q(x1,y1,H),Q(x1,0,H+rh)],'#e2e8f0','#5a3b22',R*0.01);
    poly([Q(x0-ov,y1+ov,H-R*0.01),Q(x1+ov,y1+ov,H-R*0.01),Q(x1+ov,0,H+rh),Q(x0-ov,0,H+rh)],'#b91c1c','#7f1d1d',R*0.012);
    // Copper onion dome turret at center of ridge
    box(-R*0.055,R*0.055,-R*0.055,R*0.055,H+rh*0.7,H+rh+R*0.055,'#fef3c7','#dfd3b8','#2dd4bf');
    const od = Q(0,0,H+rh+R*0.095);
    ell(od[0], od[1], R*0.055, R*0.048, '#0d9488', '#f59e0b', R*0.007);
    line(od, [od[0], od[1]-R*0.055], '#f59e0b', R*0.01);
    // Foreground: Oak beer-barrel floral planters, brass fountain & Biergarten bench
    [[-R*0.44,R*0.28],[R*0.44,R*0.28]].forEach(([X,Y])=>{
      const p=Q(X,Y,z0);
      ell(p[0],p[1]-R*0.02,R*0.048,R*0.032,'#78350f','#f59e0b',R*0.007);
      ell(p[0],p[1]-R*0.055,R*0.045,R*0.03,'#15803d');
      ell(p[0],p[1]-R*0.065,R*0.02,R*0.02,'#facc15');
    });
    const bf=Q(-R*0.40,R*0.42,z0);
    ell(bf[0],bf[1]-R*0.035,R*0.04,R*0.02,'#94a3b8');
    ell(bf[0],bf[1]-R*0.038,R*0.024,R*0.011,'#38bdf8');
    box(-R*0.12,R*0.18,R*0.38,R*0.44,z0,z0+R*0.045,'#d97706','#92400e','#fef3c7');
  }
}
return drawRestrooms;
})();

const theaterSkinPack = (() => {

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

/* ===== THEATER / SHOW VENUE METADATA (UNTHEMED + 11 HEAVY/IMMERSIVE SKINS) ===== */
const THEATER_SKINS = {
  unthemed: {id:'unthemed', label:'Unthemed (Tier 0–2)', name:'Art-Deco Palace Theater',   sub:'Fly-Tower, Chasing Marquee & Red Carpet',     hex:'#cbd5e1', border:'#a855f7'},
  classic:  {id:'classic',  label:'Classic Midway',      name:'Midway Square Big-Top',     sub:'Striped Square Pavilion Tent & Bulb Marquee', hex:'#cbb07c', border:'#d9342b'},
  jungle:   {id:'jungle',   label:'Jungle',              name:'Sunken Temple Ruins',       sub:'Shattered Stone Facade, Rubble & Vines',      hex:'#587c48', border:'#2fbf9a'},
  western:  {id:'western',  label:'Wild West',           name:'Boomtown Opera House',      sub:'Clapboard Siding, Canopy Porch & False Front',hex:'#c99a62', border:'#b91c1c'},
  frontier: {id:'frontier', label:'Frontier',            name:'Timber-Frame Playhouse',    sub:'Heavy Post-and-Beam & Roof Dormer Windows',   hex:'#7d955d', border:'#566e42'},
  space:    {id:'space',    label:'Space',               name:'Geodesic Holodome',         sub:'Pure 3D Faceted Planetarium & Orbital Ring',  hex:'#334155', border:'#0ea5e9'},
  gothic:   {id:'gothic',   label:'Gothic',              name:'Ravenscroft Gothic Manor',  sub:'Mansard Roof, Gabled Dormers & Belfry Tower', hex:'#3b3345', border:'#991b1b'},
  medieval: {id:'medieval', label:'Medieval',            name:'Royal Jousting Lists Arena',sub:'Tournament Arena Wall, Bunting & Royal Box',  hex:'#6c8c58', border:'#eab308'},
  alps:     {id:'alps',     label:'Alps',                name:'Tyrolean Festspielhaus',    sub:'3D Sculpted Snowpack, Shutters & Flowerboxes',hex:'#a8c5d6', border:'#0284c7'},
  fiesta:   {id:'fiesta',   label:'Fiesta',              name:'Misión Barroca Teatro',     sub:'Rectangular Baroque Church & Twin Bell Towers',hex:'#d99b52', border:'#e11d48'},
  nordic:   {id:'nordic',   label:'Nordic',              name:'Borgund Stave-Church Hall', sub:'3-Tiered Tarred Stave Roofs & Dragon Prows',  hex:'#4d6b63', border:'#d97706'},
  bavarian: {id:'bavarian', label:'Bavarian',            name:'Residenz Glockenspiel Hall',sub:'Baroque Court Theater & Jousting Clock Tower',hex:'#769958', border:'#2563eb'}
};

/* ===== SPRITE CODE: copy this block into engine.js ===== */
/**
 * drawTheater(ctx, cx, cy, R, opts)
 *  opts.accent        : Land / chain accent color (default '#a855f7')
 *  opts.themeId       : 'classic'|'jungle'|'western'|'wildwest'|'frontier'|'space'|'gothic'|'medieval'|'alps'|'fiesta'|'nordic'|'bavarian'
 *  opts.rideThemeTier : 0..4 (<=2 draws Standard Unthemed; >=3 draws Heavy/Immersive Themed Venue)
 *  opts.t             : time in seconds (chasing marquee bulbs, torches, banners, pulsing rings)
 *  opts.flip          : true when called under horizontal mirror
 *  opts.tile          : draw the hex tile background (default true)
 */
function drawTheater(ctx, cx, cy, R, o={}){
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTheme = String(o.themeId || o.theme || 'unthemed').toLowerCase();
  if(rawTheme === 'wildwest' || rawTheme === 'wild_west') rawTheme = 'western';
  const theme = (tier <= 2 || !THEATER_SKINS[rawTheme]) ? 'unthemed' : rawTheme;
  const skin = THEATER_SKINS[theme] || THEATER_SKINS.unthemed;
  const accent = o.accent || skin.border || '#a855f7';
  const fl = o.flip ? -1 : 1;
  const tm = o.t == null ? 0 : o.t;

  // Upscale venue architecture by ~20% while keeping the hex tile radius Hr unchanged
  const Hr = R;
  R = R * 1.20;

  // Center the venue cleanly on the hex pad
  const cyB = cy + R * 0.04;
  const Q = (X,Y,Z) => [cx + (X - Y)*0.7, cyB + (X + Y)*0.35 - Z];
  const TAU = Math.PI * 2;

  const poly = (pts,fill,stroke,lw) => {
    ctx.beginPath();
    pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.01;ctx.lineJoin='round';ctx.stroke();}
  };
  const line = (a,b,c,w) => {
    ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
  };
  const disc = (p,r,c,stroke,lw) => {
    ctx.beginPath();ctx.arc(p[0],p[1],Math.max(0.5,r),0,TAU);
    if(c){ctx.fillStyle=c;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.stroke();}
  };
  const ell = (p,rx,ry,fill,stroke,lw) => {
    ctx.beginPath();ctx.ellipse(p[0],p[1],Math.max(0.5,rx),Math.max(0.5,ry),0,0,TAU);
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.009;ctx.stroke();}
  };

  /**
   * Solid watertight isometric box helper:
   *  +Y face = Front-Left (South-West) camera-facing main facade
   *  +X face = Front-Right (South-East) camera-facing end wall
   *  +Z face = Top horizontal roof/terrace plane
   */
  const isoBox = (xa,xb,ya,yb,za,zb,cf,ce,ct,stroke,lw) => {
    if(ct) poly([Q(xa,ya,zb),Q(xb,ya,zb),Q(xb,yb,zb),Q(xa,yb,zb)], ct, stroke, lw);
    poly([Q(xa,yb,za),Q(xb,yb,za),Q(xb,yb,zb),Q(xa,yb,zb)], cf, stroke, lw);
    poly([Q(xb,ya,za),Q(xb,yb,za),Q(xb,yb,zb),Q(xb,ya,zb)], ce, stroke, lw);
  };

  /**
   * Watertight 3D Gable Roof running along the X-axis (ridge at Y = (y0+y1)/2, Z = z0 + rh)
   */
  const gableRoof = (x0,x1,y0,y1,z0,rh,ov,colSlope,colGableEnd,colTrim,courses) => {
    const ym = (y0+y1)/2;
    const xa = x0 - ov, xb = x1 + ov, ya = y0 - ov, yb = y1 + ov, zTop = z0 + rh;
    // 1. Back-Right slope
    poly([Q(xa,ya,z0),Q(xb,ya,z0),Q(xb,ym,zTop),Q(xa,ym,zTop)], shade(colSlope,-0.28), colTrim, R*0.008);
    // 2. Front-Right triangular gable end wall at X = x1
    poly([Q(x1,y0,z0),Q(x1,y1,z0),Q(x1,ym,zTop - rh*0.08)], colGableEnd, colTrim, R*0.008);
    // 3. Front-Left main camera-facing roof slope
    poly([Q(xa,yb,z0),Q(xb,yb,z0),Q(xb,ym,zTop),Q(xa,ym,zTop)], colSlope, colTrim, R*0.01);
    const nC = courses || 0;
    for(let k=1;k<=nC;k++){
      const t = k/(nC+1), y = yb + (ym-yb)*t, z = z0 + rh*t;
      line(Q(xa+R*0.01,y,z), Q(xb-R*0.01,y,z), shade(colSlope,-0.22), R*0.007);
    }
    line(Q(xa,yb,z0), Q(xb,yb,z0), colTrim || shade(colSlope,-0.35), R*0.013);
    line(Q(xb,ya,z0), Q(xb,ym,zTop), colTrim || shade(colSlope,-0.35), R*0.012);
    line(Q(xb,yb,z0), Q(xb,ym,zTop), colTrim || shade(colSlope,-0.35), R*0.013);
    line(Q(xa,ym,zTop), Q(xb,ym,zTop), shade(colSlope,0.28), R*0.014);
  };

  /**
   * Watertight 4-Sided Hip Roof over (x0..x1, y0..y1) rising to ridge (rx0..rx1, ym, z0+rh)
   */
  const hipRoof = (x0,x1,y0,y1,z0,rh,ov,insetX,colSlope,colTrim,courses) => {
    const ym = (y0+y1)/2;
    const xa = x0 - ov, xb = x1 + ov, ya = y0 - ov, yb = y1 + ov, zTop = z0 + rh;
    const rx0 = xa + insetX, rx1 = xb - insetX;
    poly([Q(xa,ya,z0),Q(xb,ya,z0),Q(rx1,ym,zTop),Q(rx0,ym,zTop)], shade(colSlope,-0.30), colTrim, R*0.008);
    poly([Q(xa,ya,z0),Q(xa,yb,z0),Q(rx0,ym,zTop)], shade(colSlope,-0.18), colTrim, R*0.008);
    poly([Q(xb,ya,z0),Q(xb,yb,z0),Q(rx1,ym,zTop)], shade(colSlope,-0.22), colTrim, R*0.009);
    poly([Q(xa,yb,z0),Q(xb,yb,z0),Q(rx1,ym,zTop),Q(rx0,ym,zTop)], colSlope, colTrim, R*0.01);
    const nC = courses || 0;
    for(let k=1;k<=nC;k++){
      const t = k/(nC+1), y = yb + (ym-yb)*t, z = z0 + rh*t;
      const lx = xa + (rx0-xa)*t, rx = xb + (rx1-xb)*t;
      line(Q(lx,y,z), Q(rx,y,z), shade(colSlope,-0.22), R*0.007);
    }
    line(Q(rx0,ym,zTop), Q(rx1,ym,zTop), colTrim || shade(colSlope,0.3), R*0.014);
  };

  /**
   * Watertight 4-Sided Pyramid Roof over (x0..x1, y0..y1) rising to apex ((x0+x1)/2, (y0+y1)/2, z0+rh)
   */
  const pyramidRoof = (x0,x1,y0,y1,z0,rh,ov,colSlope,colTrim) => {
    const xa = x0 - ov, xb = x1 + ov, ya = y0 - ov, yb = y1 + ov;
    const ap = Q((x0+x1)/2, (y0+y1)/2, z0 + rh);
    poly([Q(xa,ya,z0),Q(xb,ya,z0),ap], shade(colSlope,-0.32), colTrim, R*0.007);
    poly([Q(xa,ya,z0),Q(xa,yb,z0),ap], shade(colSlope,-0.18), colTrim, R*0.007);
    poly([Q(xb,ya,z0),Q(xb,yb,z0),ap], shade(colSlope,-0.22), colTrim, R*0.009);
    poly([Q(xa,yb,z0),Q(xb,yb,z0),ap], colSlope, colTrim, R*0.009);
    return ap;
  };

  const frontText = (xa, xb, y, zTop, zH, txt, fg, fontFam) => {
    const p = Q(xa, y, zTop);
    ctx.save();
    ctx.transform(0.7, 0.35, 0, 1, p[0], p[1]);
    ctx.fillStyle = fg || '#f8fafc';
    ctx.font = 'bold ' + Math.round(zH * 0.68) + 'px ' + (fontFam || 'Arial Black, Arial, sans-serif');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(txt, (xb - xa)/2, zH/2, (xb - xa)*0.95);
    ctx.restore();
  };

  const drawArchPortal = (xa, xb, y, z0, zTop, frameCol, innerCol, curtainCol) => {
    const xm = (xa+xb)/2;
    // Outer stone/gold arch frame
    poly([
      Q(xa-R*0.018,y,z0), Q(xb+R*0.018,y,z0),
      Q(xb+R*0.018,y,zTop-R*0.025), Q(xm,y,zTop+R*0.022), Q(xa-R*0.018,y,zTop-R*0.025)
    ], frameCol);
    // Inner dark stage/lobby opening
    poly([
      Q(xa,y,z0), Q(xb,y,z0),
      Q(xb,y,zTop-R*0.03), Q(xm,y,zTop+R*0.008), Q(xa,y,zTop-R*0.03)
    ], innerCol);
    // Optional draped stage curtains inside the arch
    if(curtainCol){
      poly([Q(xa,y,z0), Q(xa+(xb-xa)*0.32,y,z0), Q(xm,y,zTop), Q(xa,y,zTop-R*0.03)], curtainCol);
      poly([Q(xb,y,z0), Q(xb-(xb-xa)*0.32,y,z0), Q(xm,y,zTop), Q(xb,y,zTop-R*0.03)], shade(curtainCol,-0.15));
    }
  };

  // Helper for rectangular framed windows on either the Front (+Y) or Side (+X) wall
  const drawWallWindow = (wall, a0, a1, fixedCoord, z0, z1, glassCol, frameCol, shutterCol, flowerCol) => {
    const P0 = wall==='Y' ? Q(a0,fixedCoord,z0) : Q(fixedCoord,a0,z0);
    const P1 = wall==='Y' ? Q(a1,fixedCoord,z0) : Q(fixedCoord,a1,z0);
    const P2 = wall==='Y' ? Q(a1,fixedCoord,z1) : Q(fixedCoord,a1,z1);
    const P3 = wall==='Y' ? Q(a0,fixedCoord,z1) : Q(fixedCoord,a0,z1);
    poly([P0,P1,P2,P3], glassCol, frameCol, R*0.009);
    // Mullion crossbars
    const am = (a0+a1)/2, zm = (z0+z1)/2;
    line(wall==='Y'?Q(am,fixedCoord,z0):Q(fixedCoord,am,z0), wall==='Y'?Q(am,fixedCoord,z1):Q(fixedCoord,am,z1), frameCol, R*0.006);
    line(wall==='Y'?Q(a0,fixedCoord,zm):Q(fixedCoord,a0,zm), wall==='Y'?Q(a1,fixedCoord,zm):Q(fixedCoord,a1,zm), frameCol, R*0.006);
    if(shutterCol){
      const sw = (a1-a0)*0.24;
      if(wall==='Y'){
        poly([Q(a0-sw,fixedCoord,z0),Q(a0,fixedCoord,z0),Q(a0,fixedCoord,z1),Q(a0-sw,fixedCoord,z1)], shutterCol, frameCol, R*0.005);
        poly([Q(a1,fixedCoord,z0),Q(a1+sw,fixedCoord,z0),Q(a1+sw,fixedCoord,z1),Q(a1,fixedCoord,z1)], shutterCol, frameCol, R*0.005);
      } else {
        poly([Q(fixedCoord,a0-sw,z0),Q(fixedCoord,a0,z0),Q(fixedCoord,a0,z1),Q(fixedCoord,a0-sw,z1)], shutterCol, frameCol, R*0.005);
        poly([Q(fixedCoord,a1,z0),Q(fixedCoord,a1+sw,z0),Q(fixedCoord,a1+sw,z1),Q(fixedCoord,a1,z1)], shutterCol, frameCol, R*0.005);
      }
    }
    if(flowerCol){
      const fp = wall==='Y' ? Q(am, fixedCoord+R*0.012, z0-R*0.005) : Q(fixedCoord+R*0.012, am, z0-R*0.005);
      ell(fp, R*0.042, R*0.015, '#15803d');
      disc([fp[0]-R*0.014, fp[1]-R*0.005], R*0.011, flowerCol);
      disc([fp[0]+R*0.014, fp[1]-R*0.005], R*0.011, flowerCol);
    }
  };

  // Helper for a 3D Gabled Dormer Window projecting out of the front (+Y) roof slope
  const drawRoofDormer = (xc, w, yFront, yBack, zBase, zTop, wallCol, sideCol, roofCol, trimCol, glassCol) => {
    const xa = xc - w, xb = xc + w, zPeak = zTop + R*0.048;
    // Dormer side cheek (+X face)
    poly([Q(xb,yBack,zBase), Q(xb,yFront,zBase), Q(xb,yFront,zTop), Q(xb,yBack,zTop)], sideCol, trimCol, R*0.007);
    // Dormer front rectangular face & triangular gable face (+Y face)
    poly([Q(xa,yFront,zBase), Q(xb,yFront,zBase), Q(xb,yFront,zTop), Q(xc,yFront,zPeak), Q(xa,yFront,zTop)], wallCol, trimCol, R*0.008);
    // Dormer window pane
    poly([Q(xa+w*0.32,yFront,zBase+R*0.012), Q(xb-w*0.32,yFront,zBase+R*0.012), Q(xb-w*0.32,yFront,zTop-R*0.005), Q(xa+w*0.32,yFront,zTop-R*0.005)], glassCol || '#fde047', trimCol, R*0.006);
    // Dormer pitched roof slopes (left & right of ridge)
    const ov = R*0.012;
    poly([Q(xa-ov,yBack,zTop), Q(xa-ov,yFront+ov,zTop), Q(xc,yFront+ov,zPeak), Q(xc,yBack,zPeak)], roofCol, trimCol, R*0.007);
    poly([Q(xb+ov,yBack,zTop), Q(xb+ov,yFront+ov,zTop), Q(xc,yFront+ov,zPeak), Q(xc,yBack,zPeak)], shade(roofCol,-0.22), trimCol, R*0.007);
  };

  const drawTorchBrazier = (X, Y, zBase, hPole, colPole) => {
    const b = Q(X, Y, zBase), tp = Q(X, Y, zBase + hPole);
    line(b, tp, colPole || '#451a03', R*0.02);
    ell(tp, R*0.028, R*0.014, '#27272a', '#d97706', R*0.006);
    const flk = Math.sin(tm*10 + X*12) * R * 0.012;
    poly([[tp[0]-R*0.024,tp[1]], [tp[0]+flk,tp[1]-R*0.065], [tp[0]+R*0.024,tp[1]]], '#f97316');
    poly([[tp[0]-R*0.012,tp[1]], [tp[0]+flk*0.5,tp[1]-R*0.042], [tp[0]+R*0.012,tp[1]]], '#fde047');
  };

  // 1. Optional Hex Tile Base (uses original unscaled Hr so hex size remains standard)
  if(o.tile !== false){
    hexPath(ctx, cx, cy, Hr);
    ctx.fillStyle = theme === 'unthemed' ? '#cbd5e1' : skin.hex;
    ctx.fill();
    ctx.lineWidth = Math.max(2, Hr*0.055);
    ctx.strokeStyle = accent;
    ctx.stroke();
  }

  const x0 = -R*0.42, x1 = R*0.42, y0 = -R*0.26, y1 = R*0.26, H = R*0.30, z0 = 0;

  // Soft ambient ground shadow directly beneath the venue (NO rectangular concrete slab!)
  const drawBuildingShadow = (xa, xb, ya, yb) => {
    ctx.save();
    ctx.translate(fl*R*0.07, R*0.035);
    poly([Q(xa,ya,0),Q(xb,ya,0),Q(xb,yb,0),Q(xa,yb,0)], 'rgba(15,23,42,.26)');
    ctx.restore();
  };

  /* =====================================================================
   * VARIANT 1: UNTHEMED STANDARD (rideThemeTier <= 2: Art-Deco Palace Theater)
   * ===================================================================== */
  if(theme === 'unthemed'){
    const cream = '#f3e4c4';
    drawBuildingShadow(x0-R*0.02, x1+R*0.02, y0-R*0.02, y1+R*0.04);
    // 1. Rear Stage Fly-Tower (sits behind the main auditorium hall)
    isoBox(-R*0.30, R*0.30, y0, 0, z0, R*0.46, cream, '#d6c4a0', shade(accent,-0.2));
    poly([Q(-R*0.30,0,R*0.41),Q(R*0.30,0,R*0.41),Q(R*0.30,0,R*0.46),Q(-R*0.30,0,R*0.46)], accent);
    poly([Q(R*0.30,y0,R*0.41),Q(R*0.30,0,R*0.41),Q(R*0.30,0,R*0.46),Q(R*0.30,y0,R*0.46)], shade(accent,-0.3));
    // 2. Main Auditorium Hall
    isoBox(x0, x1, y0, y1, z0, H, cream, '#d6c4a0', shade(accent,-0.2));
    poly([Q(x0+R*0.04,y0+R*0.04,H),Q(x1-R*0.04,y0+R*0.04,H),Q(x1-R*0.04,y1-R*0.04,H),Q(x0+R*0.04,y1-R*0.04,H)], shade(accent,-0.45));
    // Cornice band & vertical fluted pilasters
    poly([Q(x0,y1,R*0.265),Q(x1,y1,R*0.265),Q(x1,y1,H),Q(x0,y1,H)], accent);
    poly([Q(x1,y0,R*0.265),Q(x1,y1,R*0.265),Q(x1,y1,H),Q(x1,y0,H)], shade(accent,-0.3));
    [-0.38,-0.21,0.21,0.38].forEach(k=>{
      const a = R*k - R*0.018, b = R*k + R*0.018;
      poly([Q(a,y1,z0),Q(b,y1,z0),Q(b,y1,R*0.265),Q(a,y1,R*0.265)], '#fff7e6');
      poly([Q(a-R*0.01,y1,R*0.25),Q(b+R*0.01,y1,R*0.25),Q(b+R*0.01,y1,R*0.265),Q(a-R*0.01,y1,R*0.265)], '#fff7e6');
    });
    // Entrance double doors + glowing show poster lightboxes
    poly([Q(-R*0.10,y1,z0),Q(R*0.10,y1,z0),Q(R*0.10,y1,R*0.125),Q(-R*0.10,y1,R*0.125)], '#fff7e6');
    poly([Q(-R*0.085,y1,z0),Q(R*0.085,y1,z0),Q(R*0.085,y1,R*0.115),Q(-R*0.085,y1,R*0.115)], '#3b0a0a');
    line(Q(0,y1,z0), Q(0,y1,R*0.115), '#fde68a', R*0.008);
    [[-0.31,accent,'#fde047'],[0.31,'#fb7185','#38bdf8']].forEach(([k,c1,c2])=>{
      const a = R*k - R*0.05, b = R*k + R*0.05;
      poly([Q(a-R*0.01,y1,R*0.07),Q(b+R*0.01,y1,R*0.07),Q(b+R*0.01,y1,R*0.185),Q(a-R*0.01,y1,R*0.185)], '#1f2937');
      poly([Q(a,y1,R*0.08),Q(b,y1,R*0.08),Q(b,y1,R*0.175),Q(a,y1,R*0.175)], c1);
      poly([Q(a+R*0.015,y1,R*0.10),Q(b-R*0.015,y1,R*0.10),Q(b-R*0.015,y1,R*0.14),Q(a+R*0.015,y1,R*0.14)], c2);
    });
    // Red carpet runner + brass velvet-rope stanchions directly on the ground
    poly([Q(-R*0.075,y1,z0),Q(R*0.075,y1,z0),Q(R*0.075,y1+R*0.24,z0),Q(-R*0.075,y1+R*0.24,z0)], '#b91c1c', '#fde68a', R*0.006);
    [-1,1].forEach(s=>{
      let prev = null;
      for(let k=0;k<3;k++){
        const Y = y1 + R*(0.06 + k*0.08), b = Q(s*R*0.11,Y,z0), t = Q(s*R*0.11,Y,R*0.055);
        line(b, t, '#fde68a', R*0.01); disc(t, R*0.011, '#fde68a');
        if(prev) line(prev, [t[0],t[1]+R*0.006], '#b91c1c', R*0.007);
        prev = [t[0], t[1]+R*0.006];
      }
    });
    // Cantilevered Chasing-Bulb Marquee ("THEATER")
    const ma = -R*0.20, mb = R*0.20, mz0 = R*0.165, mz1 = R*0.255, my = y1 + R*0.10;
    isoBox(ma, mb, y1, my, mz0, mz1, accent, shade(accent,-0.3), shade(accent,0.25), '#fde68a', R*0.011);
    frontText(ma, mb, my, mz1, R*0.09, 'THEATER', '#f8fafc');
    for(let k=0;k<=8;k++){
      const X = ma + (mb-ma)*k/8;
      disc(Q(X,my,mz1), R*0.009, (Math.floor(tm*5)+k)%2 ? '#fef08a' : '#fb923c');
      disc(Q(X,my,mz0), R*0.009, (Math.floor(tm*5)+k+1)%2 ? '#fef08a' : '#fb923c');
    }
    return;
  }

  /* =====================================================================
   * VARIANT 2: CLASSIC MIDWAY — SQUARE CARNIVAL BIG-TOP PAVILION TENT
   * Bold red & cream striped square tent walls, 4-sided pyramid canvas roof,
   * scalloped gold-tassel valances, velvet stage curtains & bulb marquee
   * ===================================================================== */
  if(theme === 'classic'){
    const sx0 = -R*0.38, sx1 = R*0.38, sy0 = -R*0.34, sy1 = R*0.28, sH = R*0.24;
    drawBuildingShadow(sx0-R*0.03, sx1+R*0.03, sy0-R*0.03, sy1+R*0.05);

    // 1. Square Tent Walls with alternating Crimson Red & Cream vertical canvas stripes
    const nStripes = 10;
    for(let i=0; i<nStripes; i++){
      const xa = sx0 + (sx1-sx0)*i/nStripes, xb = sx0 + (sx1-sx0)*(i+1)/nStripes;
      poly([Q(xa,sy1,z0),Q(xb,sy1,z0),Q(xb,sy1,sH),Q(xa,sy1,sH)], i%2===0 ? '#d9342b' : '#fff9ed');
      const ya = sy0 + (sy1-sy0)*i/nStripes, yb = sy0 + (sy1-sy0)*(i+1)/nStripes;
      poly([Q(sx1,ya,z0),Q(sx1,yb,z0),Q(sx1,yb,sH),Q(sx1,ya,sH)], i%2===0 ? '#a8221c' : '#dfd3b8');
    }

    // 2. High-Peaked 4-Sided Square Pyramid Tent Roof with Striped Canvas Gores
    const ap = Q(0, (sy0+sy1)/2, sH + R*0.32);
    // Back-East & Back-North slopes
    poly([Q(sx0,sy0,sH),Q(sx1,sy0,sH),ap], '#8a1c17');
    poly([Q(sx0,sy0,sH),Q(sx0,sy1,sH),ap], '#a8221c');
    // Striped Front-Right (+X) & Front-Left (+Y) pyramid slopes
    for(let i=0; i<nStripes; i++){
      const ya = sy0 + (sy1-sy0)*i/nStripes, yb = sy0 + (sy1-sy0)*(i+1)/nStripes;
      poly([Q(sx1,ya,sH),Q(sx1,yb,sH),ap], i%2===0 ? '#b91c1c' : '#e8dec3');
      const xa = sx0 + (sx1-sx0)*i/nStripes, xb = sx0 + (sx1-sx0)*(i+1)/nStripes;
      poly([Q(xa,sy1,sH),Q(xb,sy1,sH),ap], i%2===0 ? '#d9342b' : '#fff9ed');
    }

    // 3. Scalloped Gold-and-Blue Valance Trim along the square tent eaves
    for(let i=0; i<nStripes; i++){
      const xa = sx0 + (sx1-sx0)*i/nStripes, xb = sx0 + (sx1-sx0)*(i+1)/nStripes, xm = (xa+xb)/2;
      poly([Q(xa,sy1,sH),Q(xb,sy1,sH),Q(xm,sy1+R*0.02,sH-R*0.048)], i%2===0 ? '#f5c542' : '#1d4ed8', '#b45309', R*0.006);
      const ya = sy0 + (sy1-sy0)*i/nStripes, yb = sy0 + (sy1-sy0)*(i+1)/nStripes, ym = (ya+yb)/2;
      poly([Q(sx1,ya,sH),Q(sx1,yb,sH),Q(sx1+R*0.02,ym,sH-R*0.048)], i%2===0 ? '#d97706' : '#1e3a8a');
    }

    // 4. Draped Velvet Stage Entry Curtain Arch + Red Carpet + Chasing-Bulb "BIG TOP" Marquee
    poly([Q(-R*0.09,sy1,z0),Q(R*0.09,sy1,z0),Q(R*0.09,sy1+R*0.18,z0),Q(-R*0.09,sy1+R*0.18,z0)], '#b91c1c', '#f5c542', R*0.008);
    drawArchPortal(-R*0.14, R*0.14, sy1, z0, R*0.185, '#f5c542', '#17132b', '#b91c1c');
    // Raised bulb marquee above the tent entrance
    const ma = -R*0.21, mb = R*0.21, my = sy1 + R*0.055;
    isoBox(ma, mb, sy1, my, R*0.18, R*0.255, '#1e3a8a', '#172554', '#f5c542', '#f5c542', R*0.011);
    frontText(ma, mb, my, R*0.252, R*0.072, 'BIG TOP SHOW', '#fff3b0');
    for(let k=0;k<=8;k++){
      const bp = Q(ma+(mb-ma)*k/8, my, R*0.255);
      disc(bp, R*0.009, (Math.floor(tm*6)+k)%2 ? '#fff3b0' : '#ef4444');
    }

    // 5. Center Brass King-Pole Finial & Fluttering Carnival Pennant
    const topFlag = [ap[0], ap[1] - R*0.13];
    line(ap, topFlag, '#f5c542', R*0.018);
    disc(ap, R*0.022, '#f5c542', '#b45309', R*0.007);
    const wave = Math.sin(tm*4.5) * R * 0.022;
    poly([topFlag, [topFlag[0]+R*0.14, topFlag[1]+R*0.03+wave], [topFlag[0], topFlag[1]+R*0.065]], '#d9342b', '#f5c542', R*0.007);
    return;
  }

  /* =====================================================================
   * VARIANT 3: JUNGLE — HEAVILY RUINED CARVED TEMPLE FACADE (NO Step Pyramid!)
   * Jagged collapsed upper roofline with missing stone blocks, deep structural
   * cracks, a toppled right-hand column stub with fallen rubble at the base,
   * thick hanging jungle vines draping over the lintel & glowing jade portal
   * ===================================================================== */
  if(theme === 'jungle'){
    drawBuildingShadow(x0-R*0.04, x1+R*0.04, y0-R*0.02, y1+R*0.05);

    // 1. Sunken Cracked Mossy Stone Amphitheater Plinth & Broken Temple Steps
    isoBox(x0-R*0.03, x1+R*0.03, y0, y1+R*0.04, z0, R*0.05, '#8e8a72', '#6e6a56', '#bdb9a0', '#4a4737', R*0.009);
    isoBox(-R*0.18, R*0.15, y1+R*0.04, y1+R*0.14, z0, R*0.03, '#a8a48c', '#7d7963', '#dad7c3');

    // 2. Ruined Sanctuary Wall with a Jagged, Collapsed Upper Skyline (Left side tall, right side partially caved-in!)
    const wH = R*0.30;
    // Lower intact wall body
    isoBox(x0, x1, y0, y1, R*0.05, R*0.21, '#bdb9a0', '#8e8a72', '#6e6a56', '#4a4737', R*0.01);
    // Left-hand standing upper ruin block (with jagged stepped stone teeth)
    isoBox(x0, -R*0.05, y0+R*0.02, y1, R*0.21, wH+R*0.05, '#bdb9a0', '#8e8a72', '#5f8a47', '#4a4737', R*0.009);
    isoBox(x0+R*0.03, -R*0.16, y0+R*0.04, y1, wH+R*0.05, wH+R*0.11, '#a8a48c', '#7d7963', '#3f6a38', '#4a4737', R*0.009);
    // Right-hand lower shattered wall section (collapsed inward, leaving a gap & jagged teeth)
    isoBox(R*0.08, x1-R*0.04, y0+R*0.03, y1, R*0.21, R*0.27, '#a8a48c', '#7d7963', '#5f8a47', '#4a4737', R*0.009);
    isoBox(R*0.16, R*0.31, y0+R*0.05, y1, R*0.27, R*0.32, '#bdb9a0', '#8e8a72', '#3f6a38', '#4a4737', R*0.008);

    // Central Cracked Stone Sun-God / Jaguar Lintel (tilted/weathered above the portal)
    isoBox(-R*0.15, R*0.15, y1-R*0.07, y1+R*0.02, R*0.22, R*0.35, '#d0ccb4', '#8e8a72', '#4d7c0f', '#4a4737', R*0.01);
    const maskP = Q(0, y1+R*0.022, R*0.285);
    ell(maskP, R*0.062, R*0.044, '#eab308', '#78350f', R*0.009);
    disc([maskP[0]-R*0.022, maskP[1]-R*0.005], R*0.012, '#2fbf9a');
    disc([maskP[0]+R*0.022, maskP[1]-R*0.005], R*0.012, '#2fbf9a');
    // Diagonal fracture crack across the stone mask & wall
    line(Q(-R*0.06,y1+R*0.023,R*0.35), Q(R*0.03,y1+R*0.023,R*0.24), '#292524', R*0.011);
    line(Q(-R*0.26,y1+R*0.01,R*0.34), Q(-R*0.19,y1+R*0.01,R*0.18), '#292524', R*0.010);
    line(Q(R*0.22,y1+R*0.01,R*0.26),  Q(R*0.29,y1+R*0.01,R*0.12),  '#292524', R*0.010);

    // 3. Left Intact Carved Serpent Pillar vs. Right Shattered/Broken Column Stub!
    // Left pillar (tall)
    isoBox(-R*0.36, -R*0.25, y1-R*0.01, y1+R*0.04, R*0.05, wH+R*0.04, '#d0ccb4', '#8e8a72', '#5f8a47', '#4a4737', R*0.009);
    // Right pillar (snapped off at half-height!)
    isoBox(R*0.25, R*0.36, y1-R*0.01, y1+R*0.04, R*0.05, R*0.18, '#d0ccb4', '#8e8a72', '#a8a48c', '#4a4737', R*0.009);
    // Fallen, toppled column drums & mossy rubble blocks lying on the ground at front-right
    isoBox(R*0.22, R*0.35, y1+R*0.06, y1+R*0.15, z0, R*0.055, '#bdb9a0', '#7d7963', '#4d7c0f', '#4a4737', R*0.008);
    isoBox(R*0.33, R*0.43, y1+R*0.01, y1+R*0.09, z0, R*0.045, '#a8a48c', '#6e6a56', '#dad7c3', '#4a4737', R*0.007);

    // 4. Deep Corbel-Arched Sunken Stage Portal with Glowing Mystic Jade Light inside
    poly([
      Q(-R*0.17,y1,R*0.05), Q(R*0.17,y1,R*0.05),
      Q(R*0.14,y1,R*0.18),  Q(0,y1,R*0.235), Q(-R*0.14,y1,R*0.18)
    ], '#137a70', '#eab308', R*0.011);
    const glowA = 0.65 + 0.25*Math.sin(tm*3.2);
    poly([
      Q(-R*0.13,y1,R*0.05), Q(R*0.13,y1,R*0.05),
      Q(R*0.10,y1,R*0.17),  Q(0,y1,R*0.215), Q(-R*0.10,y1,R*0.17)
    ], `rgba(16,185,129,${glowA*0.48})`, '#2fbf9a', R*0.008);

    // 5. Thick Hanging Jungle Vines Draping Down Over the Ruined Facade & Flickering Braziers
    [[-R*0.30, wH+R*0.08, R*0.16], [-R*0.12, R*0.35, R*0.14], [R*0.12, R*0.33, R*0.13], [R*0.24, R*0.27, R*0.11]].forEach(([vx, vz, vLen], idx) => {
      const vp = Q(vx, y1+R*0.025, vz);
      ell(vp, R*0.058, R*0.026, '#3f6a38');
      ell([vp[0]+R*0.015, vp[1]-R*0.01], R*0.042, R*0.020, '#15803d');
      // Hanging vine tendrils
      line(vp, [vp[0]-R*0.01, vp[1]+vLen], '#15803d', R*0.014);
      line([vp[0]+R*0.022, vp[1]], [vp[0]+R*0.018, vp[1]+vLen*0.78], '#4d7c0f', R*0.011);
    });
    drawTorchBrazier(-R*0.23, y1+R*0.11, R*0.03, R*0.11, '#595443');
    drawTorchBrazier( R*0.16, y1+R*0.11, R*0.03, R*0.11, '#595443');
    return;
  }

  /* =====================================================================
   * VARIANT 4: FIESTA — RECTANGULAR MEXICAN BAROQUE CHURCH / MISSION
   * Crisp rectangular nave with side buttresses/pilasters (no back dome!),
   * twin square 2-tier corner bell towers (campanarios) with pyramidal roofs,
   * and an ornate central Churrigueresque carved stone frontispiece & choir window
   * ===================================================================== */
  if(theme === 'fiesta'){
    drawBuildingShadow(x0-R*0.04, x1+R*0.04, y0-R*0.03, y1+R*0.05);

    // 1. Main Rectangular Church Nave Body (behind the twin front bell towers)
    const nH = R*0.27, rH = R*0.11;
    isoBox(x0, x1, y0, y1, z0, nH, '#fef3c7', '#f5deb3', null, '#b45309', R*0.01);
    // Rectangular Red Terracotta Barrel-Tile Gable Roof over the main nave (NO circular dome!)
    gableRoof(x0, x1, y0, y1, nH, rH, R*0.02, '#c2410c', '#f5deb3', '#7c2d12', 3);

    // Cantera-stone side buttress pilasters & arched stained-glass windows along the +X side wall
    [-R*0.16, R*0.04, R*0.22].forEach(py => {
      poly([Q(x1+R*0.005,py-R*0.018,z0), Q(x1+R*0.005,py+R*0.018,z0), Q(x1+R*0.005,py+R*0.018,nH), Q(x1+R*0.005,py-R*0.018,nH)], '#d97706');
    });
    [-R*0.06, R*0.13].forEach(wy => {
      drawWallWindow('X', wy-R*0.045, wy+R*0.045, x1+R*0.005, R*0.08, R*0.20, '#f59e0b', '#7c2d12', null, null);
    });

    // 2. Central Rectangular Tiered Churrigueresque Carved Cantera-Stone Frontispiece (Retablo Facade)
    const fx0 = -R*0.18, fx1 = R*0.18, fH = nH + R*0.11;
    isoBox(fx0, fx1, y1-R*0.04, y1+R*0.015, z0, fH, '#d97706', '#b45309', '#c2410c', '#7c2d12', R*0.011);
    // Rectangular Stepped Baroque Crown Pediment with Wrought-Iron Cross
    isoBox(-R*0.12, R*0.12, y1-R*0.03, y1+R*0.015, fH, fH+R*0.065, '#c2410c', '#9a3412', '#f59e0b', '#fde047', R*0.01);
    const crP = Q(0, y1+R*0.01, fH+R*0.065);
    line(crP, [crP[0], crP[1]-R*0.055], '#fde047', R*0.012);
    line([crP[0]-R*0.022, crP[1]-R*0.035], [crP[0]+R*0.022, crP[1]-R*0.035], '#fde047', R*0.01);

    // Carved Baroque Solomonic Columns & Talavera Tile Frieze on the central frontispiece
    [-R*0.15, -R*0.09, R*0.09, R*0.15].forEach(cxP => {
      line(Q(cxP, y1+R*0.018, z0), Q(cxP, y1+R*0.018, fH-R*0.02), '#fef3c7', R*0.016);
    });
    // Octagonal Gold-Rimmed Stained-Glass Choir Window above the portal
    const cwP = Q(0, y1+R*0.02, R*0.27);
    disc(cwP, R*0.046, '#0d9488', '#fde047', R*0.01);
    disc(cwP, R*0.026, '#f59e0b');
    // Heavy Studded Cedar Church Portal Doors
    drawArchPortal(-R*0.085, R*0.085, y1+R*0.018, z0, R*0.175, '#fef3c7', '#451a03', '#78350f');
    line(Q(0, y1+R*0.02, z0), Q(0, y1+R*0.02, R*0.175), '#fde047', R*0.008);

    // 3. Twin Square 2-Tier Corner Bell Towers (Campanarios) at Left (x0) and Right (x1) Front Corners!
    [x0+R*0.08, x1-R*0.08].forEach((tx, idx) => {
      const tw = R*0.085, ty0 = y1 - R*0.12, ty1 = y1 + R*0.025;
      // Tower Base Shaft (matches nave height + cornice)
      isoBox(tx-tw, tx+tw, ty0, ty1, z0, nH+R*0.03, '#fef3c7', '#e7d2a5', '#c2410c', '#b45309', R*0.01);
      // Talavera tile band at top of lower shaft
      poly([Q(tx-tw,ty1,nH-R*0.01),Q(tx+tw,ty1,nH-R*0.01),Q(tx+tw,ty1,nH+R*0.03),Q(tx-tw,ty1,nH+R*0.03)], '#0d9488', '#f59e0b', R*0.008);
      // Upper Square Belfry Tier (Campanario) with arched bell openings & bronze bells
      const bw = tw * 0.78, bZ0 = nH + R*0.03, bZ1 = bZ0 + R*0.115;
      isoBox(tx-bw, tx+bw, ty0+R*0.015, ty1-R*0.015, bZ0, bZ1, '#fef3c7', '#e7d2a5', '#c2410c', '#b45309', R*0.009);
      // Bell opening & golden bell on front face
      poly([Q(tx-bw*0.45,ty1-R*0.014,bZ0+R*0.015),Q(tx+bw*0.45,ty1-R*0.014,bZ0+R*0.015),Q(tx+bw*0.45,ty1-R*0.014,bZ1-R*0.02),Q(tx-bw*0.45,ty1-R*0.014,bZ1-R*0.02)], '#291509');
      disc(Q(tx, ty1-R*0.012, bZ0+R*0.048), R*0.018, '#f5c542');
      // Pyramidal Terracotta Tile Tower Roof + Cross Finial
      const ap = pyramidRoof(tx-bw, tx+bw, ty0+R*0.015, ty1-R*0.015, bZ1, R*0.085, R*0.015, '#c2410c', '#f59e0b');
      line(ap, [ap[0], ap[1]-R*0.04], '#fde047', R*0.01);
    });

    // 4. Festive Papel Picado Garland Strung Between the Twin Bell Towers
    const pL = Q(x0+R*0.08, y1+R*0.03, R*0.19), pR = Q(x1-R*0.08, y1+R*0.03, R*0.19);
    line(pL, pR, '#fef3c7', R*0.006);
    ['#e11d48','#10b981','#f59e0b','#0d9488','#a855f7'].forEach((col, k) => {
      const q = (k+1)/6, px = pL[0]+(pR[0]-pL[0])*q, py = pL[1]+(pR[1]-pL[1])*q + Math.sin(q*Math.PI)*R*0.02;
      poly([[px-R*0.018,py],[px+R*0.018,py],[px,py+R*0.036]], col);
    });
    return;
  }

  /* =====================================================================
   * VARIANT 5: MEDIEVAL — ROYAL JOUSTING TOURNAMENT ARENA EXTERIOR
   * Crenellated stone & timber arena enclosure, striped royal tournament bunting,
   * twin octagonal entry turrets with pennants, Royal Box canopy & crossed lances
   * ===================================================================== */
  if(theme === 'medieval'){
    drawBuildingShadow(x0-R*0.05, x1+R*0.05, y0-R*0.03, y1+R*0.06);

    // 1. Rear Tiered Timber Grandstand Roof & Arena Interior Banners peeking over the rim
    isoBox(-R*0.36, R*0.36, y0, -R*0.02, z0, R*0.36, '#78350f', '#451a03', '#1e3a8a', '#451a03', R*0.01);
    [-R*0.26, 0, R*0.26].forEach((bx, idx) => {
      const bp = Q(bx, y0+R*0.02, R*0.36);
      line(bp, [bp[0], bp[1]-R*0.11], '#f5c542', R*0.01);
      const wv = Math.sin(tm*4 + idx) * R * 0.015;
      poly([[bp[0],bp[1]-R*0.11],[bp[0]+R*0.08,bp[1]-R*0.085+wv],[bp[0],bp[1]-R*0.06]], idx%2 ? '#b91c1c' : '#2563eb');
    });

    // 2. Main Crenellated Stone & Timber Arena Exterior Wall
    const aH = R*0.26;
    isoBox(x0, x1, -R*0.06, y1, z0, aH, '#94a3b8', '#64748b', '#475569', '#334155', R*0.01);

    // Bold Striped Heraldic Tournament Bunting Skirt draped across the upper arena wall
    const nBunt = 12;
    for(let i=0; i<nBunt; i++){
      const xa = x0 + (x1-x0)*i/nBunt, xb = x0 + (x1-x0)*(i+1)/nBunt, xm = (xa+xb)/2;
      const col = i%3===0 ? '#b91c1c' : i%3===1 ? '#f5c542' : '#1d4ed8';
      poly([Q(xa,y1,R*0.16),Q(xb,y1,R*0.16),Q(xb,y1,aH),Q(xa,y1,aH)], col);
      poly([Q(xa,y1,R*0.16),Q(xb,y1,R*0.16),Q(xm,y1+R*0.015,R*0.125)], col, '#451a03', R*0.005);
    }

    // 3. Twin Flanking Crenellated Gatehouse Turrets with Conical Pavilion Roofs & Jousting Pennants
    [-R*0.35, R*0.35].forEach((tx, idx) => {
      const tw = R*0.085, tH = R*0.33;
      isoBox(tx-tw, tx+tw, y1-tw*0.8, y1+tw, z0, tH, '#cbd5e1', '#64748b', '#475569', '#334155', R*0.009);
      const ap = pyramidRoof(tx-tw, tx+tw, y1-tw*0.8, y1+tw, tH, R*0.13, R*0.018, idx===0 ? '#b91c1c' : '#1d4ed8', '#f5c542');
      line(ap, [ap[0], ap[1]-R*0.10], '#f5c542', R*0.012);
      const wv = Math.sin(tm*4.5 + idx*2) * R * 0.018;
      poly([[ap[0],ap[1]-R*0.10],[ap[0]+R*0.11,ap[1]-R*0.075+wv],[ap[0],ap[1]-R*0.045]], idx===0 ? '#f5c542' : '#b91c1c');
    });

    // 4. Central Royal Box Gallery Canopy above the Main Lists Archway + Crossed Jousting Lances
    drawArchPortal(-R*0.13, R*0.13, y1, z0, R*0.16, '#475569', '#1e1b18', '#b91c1c');
    // Royal Box draped balcony & striped canopy
    isoBox(-R*0.16, R*0.16, y1, y1+R*0.05, R*0.17, R*0.23, '#b91c1c', '#7f1d1d', '#f5c542', '#f5c542', R*0.01);
    hipRoof(-R*0.17, R*0.17, y1-R*0.02, y1+R*0.06, R*0.29, R*0.085, R*0.015, R*0.08, '#1d4ed8', '#f5c542', 1);
    line(Q(-R*0.15,y1+R*0.04,R*0.23), Q(-R*0.15,y1+R*0.04,R*0.29), '#f5c542', R*0.012);
    line(Q( R*0.15,y1+R*0.04,R*0.23), Q( R*0.15,y1+R*0.04,R*0.29), '#f5c542', R*0.012);
    // Crossed Jousting Lances & Golden Lion Shield mounted on the Royal Box front
    const shP = Q(0, y1+R*0.055, R*0.205);
    line([shP[0]-R*0.09,shP[1]+R*0.04], [shP[0]+R*0.09,shP[1]-R*0.04], '#fef3c7', R*0.011);
    line([shP[0]-R*0.09,shP[1]-R*0.04], [shP[0]+R*0.09,shP[1]+R*0.04], '#fef3c7', R*0.011);
    ell(shP, R*0.032, R*0.038, '#f5c542', '#78350f', R*0.008);
    return;
  }

  /* =====================================================================
   * VARIANT 6: NORDIC — MULTI-TIERED NORWEGIAN STAVE CHURCH (Borgund Stavkirke)
   * 3 cascading dark-tarred shingle roof tiers, upper bell-turret (takrytter),
   * projecting golden Dragon-Head gable prows, carved portal & Viking shields
   * ===================================================================== */
  if(theme === 'nordic'){
    drawBuildingShadow(x0-R*0.03, x1+R*0.03, y0-R*0.03, y1+R*0.04);

    // 1. Fjord-Stone Foundation Plinth
    isoBox(x0, x1, y0, y1, z0, R*0.045, '#64748b', '#475569', '#94a3b8', '#334155', R*0.008);

    // 2. Tier 1: Lower Stave Ambulatory Wall & First Steep Shingled Gable Roof
    const z1 = R*0.045, h1 = R*0.21, r1 = R*0.115;
    isoBox(x0*0.92, x1*0.92, y0*0.92, y1*0.92, z1, h1, '#451a03', '#290f02', null, '#78350f', R*0.01);
    for(let x=x0*0.85; x<=x1*0.85; x+=R*0.065) line(Q(x,y1*0.92,z1), Q(x,y1*0.92,h1), 'rgba(0,0,0,0.35)', R*0.007);
    gableRoof(x0*0.92, x1*0.92, y0*0.92, y1*0.92, h1, r1, R*0.035, '#27272a', '#290f02', '#d97706', 3);

    // 3. Tier 2: Raised Central Stave Nave & Second Steep Shingled Gable Roof + Dragon Prows
    const z2 = h1 + r1*0.65, h2 = z2 + R*0.095, r2 = R*0.115;
    isoBox(x0*0.62, x1*0.62, y0*0.65, y1*0.65, z2, h2, '#451a03', '#290f02', null, '#d97706', R*0.009);
    gableRoof(x0*0.62, x1*0.62, y0*0.65, y1*0.65, h2, r2, R*0.028, '#1e293b', '#290f02', '#f59e0b', 2);
    // Projecting Golden Open-Jawed Dragon Head Prows on Tier 2 ridge ends
    const d2L = Q(x0*0.64, 0, h2+r2), d2R = Q(x1*0.64, 0, h2+r2);
    line(d2L, [d2L[0]-R*0.075, d2L[1]-R*0.065], '#f59e0b', R*0.022);
    line(d2R, [d2R[0]+R*0.075, d2R[1]-R*0.065], '#f59e0b', R*0.022);

    // 4. Tier 3: Uppermost Stave Turret Rider (Takrytter) & Spire + Upper Dragon Prows
    const z3 = h2 + r2*0.68, h3 = z3 + R*0.07, r3 = R*0.11;
    isoBox(-R*0.11, R*0.11, -R*0.09, R*0.09, z3, h3, '#290f02', '#18181b', null, '#f59e0b', R*0.008);
    const ap = pyramidRoof(-R*0.11, R*0.11, -R*0.09, R*0.09, h3, r3, R*0.02, '#0f172a', '#f59e0b');
    line(ap, [ap[0], ap[1]-R*0.055], '#f59e0b', R*0.014);

    // 5. Projecting Front Porch Gable with Urnes Knotwork Horseshoe Portal, Shields & Fire Braziers
    const py = y1*0.92;
    drawArchPortal(-R*0.11, R*0.11, py, z1, R*0.175, '#d97706', '#090d16', '#991b1b');
    [-R*0.23, R*0.23].forEach((sx, idx) => {
      const sp = Q(sx, py+R*0.01, R*0.12);
      ell(sp, R*0.035, R*0.035, idx%2 ? '#991b1b' : '#0284c7', '#f59e0b', R*0.008);
      disc(sp, R*0.011, '#fde047');
    });
    drawTorchBrazier(-R*0.20, py+R*0.09, 0, R*0.10, '#451a03');
    drawTorchBrazier( R*0.20, py+R*0.09, 0, R*0.10, '#451a03');
    return;
  }

  /* =====================================================================
   * VARIANT 7: WILD WEST — BOOMTOWN GRAND OPERA HOUSE & VARIETY HALL
   * Horizontal clapboard siding texture on side wall, recessed double doors
   * drawn cleanly BEFORE the overhanging porch canopy & posts
   * ===================================================================== */
  if(theme === 'western'){
    drawBuildingShadow(x0-R*0.03, x1+R*0.03, y0-R*0.02, y1+R*0.06);
    const H2 = R*0.30, Hpar = R*0.42;

    // 1. Timber Boardwalk Porch Deck Strip along the front (+Y)
    poly([Q(x0-R*0.02,y1,z0),Q(x1+R*0.02,y1,z0),Q(x1+R*0.02,y1+R*0.13,z0),Q(x0-R*0.02,y1+R*0.13,z0)], '#a8784a', '#5a3b22', R*0.01);

    // 2. Main 2-Story Weathered Timber & Brick Opera House Body + Gable Roof behind false front
    isoBox(x0, x1, y0, y1, z0, H2, '#b45309', '#8a5a33', '#78350f', '#451a03', R*0.01);
    gableRoof(x0, x1, y0, y1, H2, R*0.08, R*0.015, '#64748b', '#78350f', '#334155', 2);

    // Horizontal Clapboard Wood-Siding Plank Texture & Vertical Corner Trim on the Side (+X) Wall!
    for(let z=R*0.032; z<H2; z+=R*0.032){
      line(Q(x1,y0,z), Q(x1,y1,z), '#5a3b22', R*0.008);
      line(Q(x0,y1,z), Q(x1,y1,z), 'rgba(69,26,3,0.35)', R*0.006);
    }
    // Vertical corner trim boards & side windows on the +X wall
    [y0+R*0.015, 0, y1-R*0.015].forEach(yp => line(Q(x1,yp,z0), Q(x1,yp,H2), '#451a03', R*0.014));
    [-R*0.13, R*0.11].forEach(wy => {
      drawWallWindow('X', wy-R*0.045, wy+R*0.045, x1+R*0.003, R*0.16, R*0.25, '#fde047', '#451a03', null, null);
      drawWallWindow('X', wy-R*0.045, wy+R*0.045, x1+R*0.003, R*0.04, R*0.12, '#fde047', '#451a03', null, null);
    });

    // 3. Tall Stepped Boomtown False-Front Parapet + "OPERA HOUSE" Signboard
    poly([
      Q(x0,y1,H2), Q(x1,y1,H2),
      Q(x1,y1,H2+R*0.05), Q(x1-R*0.08,y1,H2+R*0.05),
      Q(x1-R*0.08,y1,Hpar-R*0.02), Q(0,y1,Hpar+R*0.035),
      Q(x0+R*0.08,y1,Hpar-R*0.02), Q(x0+R*0.08,y1,H2+R*0.05),
      Q(x0,y1,H2+R*0.05)
    ], '#78350f', '#f59e0b', R*0.012);
    poly([Q(x0+R*0.09,y1,H2+R*0.01),Q(x1-R*0.09,y1,H2+R*0.01),Q(x1-R*0.09,y1,Hpar-R*0.03),Q(x0+R*0.09,y1,Hpar-R*0.03)], '#fef3c7', '#451a03', R*0.01);
    frontText(x0+R*0.09, x1-R*0.09, y1, Hpar-R*0.03, R*0.075, 'OPERA HOUSE', '#7c2d12', 'Georgia, serif');

    // Second-story arched gaslit windows above the porch roof
    [-R*0.26, 0, R*0.26].forEach(wx => {
      drawArchPortal(wx-R*0.058, wx+R*0.058, y1, R*0.175, R*0.268, '#f59e0b', '#fde047', null);
    });

    // 4. Ground-Floor Entrance Doors & Ticket Windows on y1 (Drawn BEFORE the overhanging porch canopy!)
    drawWallWindow('Y', -R*0.35, -R*0.17, y1, R*0.035, R*0.115, '#fde047', '#451a03', null, null);
    drawWallWindow('Y',  R*0.17,  R*0.35, y1, R*0.035, R*0.115, '#fde047', '#451a03', null, null);
    // Recessed double timber Opera House doors with warm golden fanlight & brass handles
    poly([Q(-R*0.11,y1,z0), Q(R*0.11,y1,z0), Q(R*0.11,y1,R*0.128), Q(-R*0.11,y1,R*0.128)], '#451a03', '#f59e0b', R*0.011);
    poly([Q(-R*0.095,y1,z0), Q(R*0.095,y1,z0), Q(R*0.095,y1,R*0.115), Q(-R*0.095,y1,R*0.115)], '#78350f');
    // Golden glass transoms in each door leaf
    poly([Q(-R*0.08,y1,R*0.065), Q(-R*0.012,y1,R*0.065), Q(-R*0.012,y1,R*0.105), Q(-R*0.08,y1,R*0.105)], '#fde047');
    poly([Q( R*0.012,y1,R*0.065), Q( R*0.08,y1,R*0.065), Q( R*0.08,y1,R*0.105), Q( R*0.012,y1,R*0.105)], '#fde047');
    line(Q(0,y1,z0), Q(0,y1,R*0.125), '#290f02', R*0.009);
    disc(Q(-R*0.018,y1,R*0.05), R*0.007, '#f5c542');
    disc(Q( R*0.018,y1,R*0.05), R*0.007, '#f5c542');

    // 5. Overhanging Slanted Timber & Tin Porch Canopy + 4 Posts (drawn AFTER doors so it overhangs naturally!)
    const pyFront = y1 + R*0.11, zCanFront = R*0.132, zCanBack = R*0.165;
    [x0+R*0.02, -R*0.14, R*0.14, x1-R*0.02].forEach(px => {
      line(Q(px,pyFront,z0), Q(px,pyFront,zCanFront), '#451a03', R*0.015);
      line(Q(px,pyFront,z0), Q(px,pyFront,zCanFront), '#a8784a', R*0.007);
    });
    // Canopy fascia lip & slanted corrugated roof
    poly([Q(x0-R*0.02,pyFront,zCanFront-R*0.018), Q(x1+R*0.02,pyFront,zCanFront-R*0.018), Q(x1+R*0.02,pyFront,zCanFront), Q(x0-R*0.02,pyFront,zCanFront)], '#78350f', '#451a03', R*0.008);
    poly([Q(x0-R*0.02,pyFront,zCanFront), Q(x1+R*0.02,pyFront,zCanFront), Q(x1+R*0.02,y1,zCanBack), Q(x0-R*0.02,y1,zCanBack)], '#64748b', '#334155', R*0.01);
    for(let k=-4; k<=4; k++){
      const sx = k*R*0.095;
      line(Q(sx,pyFront,zCanFront), Q(sx,y1,zCanBack), '#475569', R*0.007);
    }
    return;
  }

  /* =====================================================================
   * VARIANT 8: FRONTIER — HEAVY TIMBER-FRAMED PLAYHOUSE WITH ROOF DORMERS
   * Exposed cedar post-and-beam timber framing (vertical posts, horizontal girts,
   * diagonal corner braces) over warm wood/stone infill, projecting king-post
   * entrance gable truss, and two 3D gabled dormer windows on the roof slope
   * ===================================================================== */
  if(theme === 'frontier'){
    drawBuildingShadow(x0-R*0.04, x1+R*0.04, y0-R*0.02, y1+R*0.05);

    // 1. River-Stone Foundation Plinth
    isoBox(x0, x1, y0, y1, z0, R*0.055, '#80858d', '#5f656c', null, '#475569', R*0.008);

    // 2. Warm Ochre-Cedar Plank Infill Walls + Heavy Exposed Post-and-Beam Timber Framing!
    isoBox(x0, x1, y0, y1, R*0.055, H, '#c89d66', '#9a7142', null, '#4a3320', R*0.012);
    // Horizontal heavy timber girts on Front (+Y) and Side (+X) walls
    [R*0.058, R*0.175, H-R*0.005].forEach(zb => {
      line(Q(x0,y1,zb), Q(x1,y1,zb), '#4a3320', R*0.018);
      line(Q(x1,y0,zb), Q(x1,y1,zb), '#3e2723', R*0.018);
    });
    // Vertical heavy timber posts & diagonal timber knee-braces on Front (+Y) wall
    [x0+R*0.01, -R*0.20, R*0.20, x1-R*0.01].forEach(xp => {
      line(Q(xp,y1,R*0.055), Q(xp,y1,H), '#4a3320', R*0.018);
    });
    // Diagonal timber X/knee bracing in the outer bays
    line(Q(x0+R*0.01,y1,R*0.06), Q(-R*0.20,y1,R*0.175), '#5a3b22', R*0.013);
    line(Q(-R*0.20,y1,R*0.06),   Q(x0+R*0.01,y1,R*0.175), '#5a3b22', R*0.013);
    line(Q(R*0.20,y1,R*0.06),    Q(x1-R*0.01,y1,R*0.175), '#5a3b22', R*0.013);
    line(Q(x1-R*0.01,y1,R*0.06), Q(R*0.20,y1,R*0.175),    '#5a3b22', R*0.013);
    // Vertical timber posts & diagonal braces on Side (+X) wall
    [y0+R*0.01, 0, y1-R*0.01].forEach(yp => line(Q(x1,yp,R*0.055), Q(x1,yp,H), '#3e2723', R*0.016));
    line(Q(x1,y0+R*0.01,R*0.06), Q(x1,0,R*0.175), '#4a3320', R*0.012);
    line(Q(x1,0,R*0.06), Q(x1,y1-R*0.01,R*0.175), '#4a3320', R*0.012);
    // Warm glowing lodge windows in the timber bays
    drawWallWindow('Y', -R*0.37, -R*0.23, y1, R*0.185, R*0.275, '#fde047', '#4a3320', null, null);
    drawWallWindow('Y',  R*0.23,  R*0.37, y1, R*0.185, R*0.275, '#fde047', '#4a3320', null, null);
    drawWallWindow('X', -R*0.19, -R*0.05, x1+R*0.003, R*0.185, R*0.275, '#fde047', '#3e2723', null, null);
    drawWallWindow('X',  R*0.05,  R*0.19, x1+R*0.003, R*0.185, R*0.275, '#fde047', '#3e2723', null, null);

    // 3. Steep Forest-Green Cedar-Shake Gable Roof + TWO 3D GABLED DORMER WINDOWS!
    const rH = R*0.165;
    gableRoof(x0, x1, y0, y1, H, rH, R*0.04, '#2f5f3a', '#9a7142', '#4a3320', 3);
    // Exposed timber truss struts in the right-hand (+X) gable end
    line(Q(x1,0,H), Q(x1,0,H+rH-R*0.01), '#3e2723', R*0.015);
    // Two 3D Gabled Dormer Windows projecting out of the front cedar-shake roof slope
    [-R*0.24, R*0.24].forEach(dx => {
      drawRoofDormer(dx, R*0.068, y1*0.62, y1*0.18, H+rH*0.28, H+rH*0.65, '#c89d66', '#9a7142', '#2f5f3a', '#4a3320', '#fde047');
    });

    // 4. Projecting Center Heavy-Timber Entrance Gable & Exposed King-Post Truss
    const pY = y1 + R*0.05;
    drawArchPortal(-R*0.15, R*0.15, y1, z0, R*0.21, '#4a3320', '#291509', '#b91c1c');
    // Timber porch posts & heavy timber pediment truss overhanging the entrance
    line(Q(-R*0.17,pY,z0), Q(-R*0.17,pY,R*0.24), '#4a3320', R*0.02);
    line(Q( R*0.17,pY,z0), Q( R*0.17,pY,R*0.24), '#4a3320', R*0.02);
    const gTop = Q(0, pY, H+rH*0.72);
    poly([Q(-R*0.19,pY,R*0.23), Q(R*0.19,pY,R*0.23), gTop], '#5a3b22', '#d9b27a', R*0.014);
    line(Q(0,pY,R*0.23), gTop, '#d9b27a', R*0.014);
    line(Q(-R*0.09,pY,R*0.23), Q(0,pY,R*0.23+(H+rH*0.72-R*0.23)*0.55), '#d9b27a', R*0.011);
    line(Q( R*0.09,pY,R*0.23), Q(0,pY,R*0.23+(H+rH*0.72-R*0.23)*0.55), '#d9b27a', R*0.011);
    return;
  }

  /* =====================================================================
   * VARIANT 9: SPACE — PURE 3D GEODESIC HOLODOME (NO Rectangular Entrance!)
   * True 3D spherical geodesic dome built from latitude/longitude polygon
   * facets over a circular titanium ring base, with glowing cyan hexagonal
   * seams and a pulsing orbital holo-ring
   * ===================================================================== */
  if(theme === 'space'){
    const c0 = Q(0, 0, 0);
    // 1. Circular Titanium Ring Base & Glowing Antigravity Ground Halo (Zero rectangular boxes!)
    ell(c0, R*0.50, R*0.25, 'rgba(15,23,42,0.38)', '#22d3ee', R*0.01);
    const rBase = R*0.42, zCollar = R*0.055;
    // Stepped circular titanium base ring
    const ringPts = (rad, z) => Array.from({length:32}, (_,k) => {
      const a = k * TAU / 32;
      return Q(rad*Math.cos(a), rad*Math.sin(a), z);
    });
    poly(ringPts(rBase*1.05, 0), '#0f172a', '#22d3ee', R*0.01);
    poly(ringPts(rBase, zCollar), '#1e293b', '#38bdf8', R*0.01);

    // 2. True 3D Faceted Geodesic Hemisphere (5 Latitude Rings x 16 Longitude Sectors)
    const nLat = 5, nLon = 16, rDome = R*0.40, hDome = R*0.42;
    const facets = [];
    for(let i=0; i<nLat; i++){
      const th0 = (i / nLat) * (Math.PI * 0.48);
      const th1 = ((i + 1) / nLat) * (Math.PI * 0.48);
      const r0 = rDome * Math.cos(th0), zA = zCollar + hDome * Math.sin(th0);
      const r1 = rDome * Math.cos(th1), zB = zCollar + hDome * Math.sin(th1);
      for(let j=0; j<nLon; j++){
        const ph0 = j * TAU / nLon, ph1 = (j + 1) * TAU / nLon, phM = (ph0 + ph1) / 2;
        const nx = Math.cos(phM) * Math.cos((th0+th1)/2);
        const ny = Math.sin(phM) * Math.cos((th0+th1)/2);
        // Cull back-facing dome facets that are hidden behind the front hemisphere
        if(nx + ny < -0.55 && i < nLat - 1) continue;
        const P00 = Q(r0*Math.cos(ph0), r0*Math.sin(ph0), zA);
        const P10 = Q(r0*Math.cos(ph1), r0*Math.sin(ph1), zA);
        const P11 = Q(r1*Math.cos(ph1), r1*Math.sin(ph1), zB);
        const P01 = Q(r1*Math.cos(ph0), r1*Math.sin(ph0), zB);
        // Directional specular shading per geodesic triangle/quad facet
        const light = (ny - nx) * 0.25 + Math.sin((th0+th1)/2) * 0.22;
        const isGlassBand = (i === 1 && nx + ny > 0.25);
        const baseCol = isGlassBand ? '#0284c7' : ((i + j) % 2 === 0 ? '#e2e8f0' : '#cbd5e1');
        facets.push({
          depth: (nx + ny) + i * 0.15,
          pts: [P00, P10, P11, P01],
          fill: shade(baseCol, light),
          stroke: isGlassBand ? '#22d3ee' : '#38bdf8'
        });
      }
    }
    facets.sort((a,b) => a.depth - b.depth).forEach(f => {
      poly(f.pts, f.fill, f.stroke, R*0.007);
    });

    // 3. Flush Curved Neon-Cyan Portal Arch integrated directly into the front dome curvature (NO rectangular tunnel!)
    const archPts = [];
    for(let k=-4; k<=4; k++){
      const a = Math.PI*0.25 + k*0.095;
      const zAr = zCollar + R*0.14 * Math.cos(k/4 * Math.PI*0.5);
      archPts.push(Q(rBase*0.99*Math.cos(a), rBase*0.99*Math.sin(a), zAr));
    }
    for(let k=4; k>=-4; k--){
      const a = Math.PI*0.25 + k*0.095;
      archPts.push(Q(rBase*0.99*Math.cos(a), rBase*0.99*Math.sin(a), zCollar));
    }
    poly(archPts, '#020617', '#22d3ee', R*0.012);

    // 4. Pulsing Equatorial Orbital Ring & Floating Apex Energy Beacon
    const pulse = 0.5 + 0.5*Math.sin(tm*4);
    ctx.beginPath();
    for(let k=0; k<=24; k++){
      const a = -Math.PI*0.18 + (k/24)*Math.PI*0.86;
      const p = Q(rDome*1.08*Math.cos(a), rDome*1.08*Math.sin(a), zCollar + hDome*0.36);
      k ? ctx.lineTo(p[0],p[1]) : ctx.moveTo(p[0],p[1]);
    }
    ctx.strokeStyle = pulse > 0.5 ? '#22d3ee' : '#e879f9';
    ctx.lineWidth = R*0.016;
    ctx.stroke();

    // Apex plasma core orb at top of dome
    const topP = Q(0, 0, zCollar + hDome + R*0.025);
    disc(topP, R*0.045, '#0f172a', '#22d3ee', R*0.01);
    disc(topP, R*0.024, pulse > 0.5 ? '#22d3ee' : '#e879f9');
    return;
  }

  /* =====================================================================
   * VARIANT 10: GOTHIC — HAUNTED VICTORIAN SECOND-EMPIRE GOTHIC MANOR
   * Dark slate mansard roof with wrought-iron roof cresting, 3 gabled attic
   * dormers, asymmetrical tall corner belfry tower, columned entrance porch,
   * and warm candlelit gothic mullioned windows
   * ===================================================================== */
  if(theme === 'gothic'){
    drawBuildingShadow(x0-R*0.04, x1+R*0.04, y0-R*0.03, y1+R*0.05);

    // 1. Main 2-Story Haunted Manor Body (Dark Ashlar Stone & Deep Mulberry Brick with Stone Quoining)
    const mH = R*0.26, manH = R*0.125;
    isoBox(x0, x1, y0, y1, z0, R*0.05, '#27272a', '#18181b', null, '#09090b', R*0.008);
    isoBox(x0, x1, y0, y1, R*0.05, mH, '#3f2e3e', '#2a1d29', null, '#18181b', R*0.01);
    // Stone corner quoins & belt course
    line(Q(x0,y1,R*0.155), Q(x1,y1,R*0.155), '#71717a', R*0.011);
    line(Q(x1,y0,R*0.155), Q(x1,y1,R*0.155), '#52525b', R*0.011);

    // Warm candlelit Victorian gothic manor windows on Front (+Y) and Side (+X) walls
    [-R*0.31, R*0.28].forEach(wx => {
      drawWallWindow('Y', wx-R*0.055, wx+R*0.055, y1, R*0.17, R*0.245, '#f59e0b', '#18181b', '#27272a', null);
      drawWallWindow('Y', wx-R*0.055, wx+R*0.055, y1, R*0.065, R*0.14, '#fde047', '#18181b', '#27272a', null);
    });
    [-R*0.12, R*0.10].forEach(wy => {
      drawWallWindow('X', wy-R*0.05, wy+R*0.05, x1+R*0.003, R*0.17, R*0.245, '#f59e0b', '#18181b', null, null);
      drawWallWindow('X', wy-R*0.05, wy+R*0.05, x1+R*0.003, R*0.065, R*0.14, '#fde047', '#18181b', null, null);
    });

    // 2. Steep Dark-Slate Second-Empire Mansard Roof + Wrought-Iron Widow's Walk Cresting!
    hipRoof(x0, x1, y0, y1, mH, manH, R*0.025, R*0.08, '#1e293b', '#09090b', 3);
    // Flat upper mansard deck & wrought-iron fence spikes along the top rim
    const dx0 = x0+R*0.07, dx1 = x1-R*0.07, dy0 = y0+R*0.07, dy1 = y1-R*0.07, zTop = mH + manH;
    poly([Q(dx0,dy0,zTop),Q(dx1,dy0,zTop),Q(dx1,dy1,zTop),Q(dx0,dy1,zTop)], '#0f172a', '#52525b', R*0.009);
    for(let k=0; k<=8; k++){
      const kx = dx0 + (dx1-dx0)*k/8;
      const pF = Q(kx, dy1, zTop), pB = Q(kx, dy0, zTop);
      line(pF, [pF[0], pF[1]-R*0.032], '#18181b', R*0.008);
      line(pB, [pB[0], pB[1]-R*0.032], '#18181b', R*0.008);
    }
    // Gabled Attic Dormers projecting from the front mansard slope
    [-R*0.28, R*0.28].forEach(dx => {
      drawRoofDormer(dx, R*0.055, y1*0.82, y1*0.45, mH+manH*0.22, mH+manH*0.75, '#3f2e3e', '#27272a', '#1e293b', '#71717a', '#dc2626');
    });

    // 3. Tall Asymmetrical Victorian Manor Clock/Belfry Tower rising from the Center-Left Front!
    const tx0 = -R*0.13, tx1 = R*0.07, ty0 = y1 - R*0.14, ty1 = y1 + R*0.04, tH = mH + manH + R*0.10;
    isoBox(tx0, tx1, ty0, ty1, z0, tH, '#4a3548', '#2a1d29', '#1e293b', '#18181b', R*0.01);
    // Pointed lancet belfry window & glowing clock face on the tower
    drawArchPortal(tx0+R*0.035, tx1-R*0.035, ty1, tH-R*0.12, tH-R*0.025, '#a1a1aa', '#dc2626', null);
    // Steeply pitched 4-sided witch-hat tower spire + iron weathervane
    const ap = pyramidRoof(tx0, tx1, ty0, ty1, tH, R*0.175, R*0.022, '#0f172a', '#2c5e54');
    line(ap, [ap[0], ap[1]-R*0.065], '#a1a1aa', R*0.011);
    line([ap[0]-R*0.028, ap[1]-R*0.045], [ap[0]+R*0.028, ap[1]-R*0.045], '#a1a1aa', R*0.009);

    // 4. Projecting Stone Manor Entrance Portico & Candlelit Double Doors
    const px0 = -R*0.14, px1 = R*0.08, pyP = y1 + R*0.08;
    isoBox(px0, px1, y1, pyP, z0, R*0.16, '#52525b', '#27272a', '#1e293b', '#18181b', R*0.009);
    gableRoof(px0, px1, y1, pyP, R*0.16, R*0.055, R*0.012, '#2c5e54', '#27272a', '#18181b', 1);
    drawArchPortal(px0+R*0.035, px1-R*0.035, pyP, z0, R*0.135, '#a1a1aa', '#09090b', '#991b1b');
    return;
  }

  /* =====================================================================
   * VARIANT 11: ALPS — TYROLEAN CONCERT CHALET (Festspielhaus)
   * Full shuttered windows with flowerboxes on front & side walls, plus a
   * thick 3D sculpted snowpack with shaded drip-edges overhanging the eaves
   * ===================================================================== */
  if(theme === 'alps'){
    drawBuildingShadow(x0-R*0.05, x1+R*0.05, y0-R*0.03, y1+R*0.04);

    // 1. Rear Copper Onion-Domed Belfry Tower
    isoBox(R*0.15, R*0.33, y0, -R*0.04, z0, R*0.44, '#f8fafc', '#cbd5e1', '#0d9488', '#475569', R*0.009);
    const od = Q(R*0.24, -R*0.14, R*0.49);
    ell(od, R*0.075, R*0.058, '#0d9488', '#f59e0b', R*0.009);
    line(od, [od[0], od[1]-R*0.065], '#f59e0b', R*0.012);

    // 2. Crisp Whitewashed Lower Stucco Arcade + Honey-Larch Timber Upper Concert Hall
    isoBox(x0, x1, y0, y1, z0, R*0.145, '#f8fafc', '#cbd5e1', null, '#94a3b8', R*0.009);
    isoBox(x0-R*0.015, x1+R*0.015, y0, y1+R*0.015, R*0.145, H, '#b45309', '#78350f', null, '#451a03', R*0.01);

    // Ground-Floor & Upper-Floor Windows with Green Wooden Shutters & Red Geranium Flowerboxes on Front (+Y) AND Side (+X)!
    [-R*0.29, R*0.29].forEach(wx => {
      // Lower stucco floor windows
      drawWallWindow('Y', wx-R*0.055, wx+R*0.055, y1, R*0.04, R*0.12, '#fde047', '#451a03', '#15803d', '#ef4444');
      // Upper larch floor windows
      drawWallWindow('Y', wx-R*0.055, wx+R*0.055, y1+R*0.015, R*0.175, R*0.255, '#fde047', '#451a03', '#dc2626', '#ef4444');
    });
    // Side (+X) wall windows on both floors
    [-R*0.12, R*0.10].forEach(wy => {
      drawWallWindow('X', wy-R*0.05, wy+R*0.05, x1+R*0.003, R*0.04, R*0.12, '#fde047', '#451a03', '#15803d', '#ef4444');
      drawWallWindow('X', wy-R*0.05, wy+R*0.05, x1+R*0.016, R*0.175, R*0.255, '#fde047', '#451a03', '#dc2626', null);
    });

    // Carved wooden balcony rail across the front belt course & arched chalet portal
    line(Q(x0-R*0.02,y1+R*0.02,R*0.148), Q(x1+R*0.02,y1+R*0.02,R*0.148), '#451a03', R*0.018);
    drawArchPortal(-R*0.12, R*0.12, y1, z0, R*0.135, '#78350f', '#1e293b', '#dc2626');
    frontText(-R*0.18, R*0.18, y1+R*0.015, H, R*0.058, 'FESTSPIELHAUS', '#fef3c7');

    // 3. Wide Alpine Timber Gable Roof Topped with a THICK, SCULPTED 3D SNOWPACK!
    const rH = R*0.125, ov = R*0.055, ym = (y0+y1)/2;
    gableRoof(x0, x1, y0, y1, H, rH, ov, '#78350f', '#92400e', '#451a03', 2);

    // 3D Sculpted Snow Blanket: has vertical snow thickness (sThk), shaded snow drip-edges, and organic scalloped drifts!
    const sThk = R*0.032, xa = x0 - ov, xb = x1 + ov, ya = y0 - ov, yb = y1 + ov, zTop = H + rH;
    // Back-Right snow slope
    poly([Q(xa,ya,H+sThk), Q(xb,ya,H+sThk), Q(xb,ym,zTop+sThk), Q(xa,ym,zTop+sThk)], '#e2e8f0', '#94a3b8', R*0.007);
    // Right gable-end snow thickness band (along +X rake)
    poly([Q(xb,ya,H), Q(xb,ym,zTop), Q(xb,ym,zTop+sThk), Q(xb,ya,H+sThk)], '#cbd5e1');
    poly([Q(xb,yb,H), Q(xb,ym,zTop), Q(xb,ym,zTop+sThk), Q(xb,yb,H+sThk)], '#bae6fd');
    // Front-Left main sunlit snow slope
    poly([Q(xa,yb,H+sThk), Q(xb,yb,H+sThk), Q(xb,ym,zTop+sThk), Q(xa,ym,zTop+sThk)], '#ffffff', '#bae6fd', R*0.008);
    // Shaded 3D front snow drip-edge wall + scalloped overhanging snowdrifts along the front eaves
    poly([Q(xa,yb,H), Q(xb,yb,H), Q(xb,yb,H+sThk), Q(xa,yb,H+sThk)], '#dbeafe', '#93c5fd', R*0.007);
    for(let k=0; k<9; k++){
      const sx = xa + (xb-xa)*(k+0.5)/9;
      const sp = Q(sx, yb, H+sThk*0.4);
      ell(sp, R*0.052, R*0.018, '#ffffff');
    }
    return;
  }

  /* =====================================================================
   * VARIANT 12: BAVARIAN — ROYAL MUNICH RESIDENZ COURT THEATER & GLOCKENSPIEL
   * ===================================================================== */
  if(theme === 'bavarian'){
    drawBuildingShadow(x0-R*0.03, x1+R*0.03, y0-R*0.02, y1+R*0.04);
    // 1. Regal Pastel-Gold & Crisp White Baroque Facade + Blue/White Bavarian Lozenge Frieze
    isoBox(x0, x1, y0, y1, z0, H, '#fef3c7', '#dfd3b8', null, '#b45309', R*0.01);
    poly([Q(x0,y1,R*0.23),Q(x1,y1,R*0.23),Q(x1,y1,H),Q(x0,y1,H)], '#1d4ed8', '#f59e0b', R*0.01);
    for(let k=0;k<10;k++){
      const xa = x0 + (x1-x0)*k/10, xb = x0 + (x1-x0)*(k+1)/10, xm = (xa+xb)/2;
      poly([Q(xa,y1,R*0.245),Q(xm,y1,R*0.23),Q(xb,y1,R*0.245),Q(xm,y1,R*0.26)], '#f8fafc');
    }
    frontText(x0, x1, y1, H-R*0.005, R*0.06, 'HOFTHEATER', '#ffffff');

    // 2. Triple Arched Royal Loggia Entrance + Red Velvet Curtains
    [-R*0.26, 0, R*0.26].forEach((ax, idx) => {
      drawArchPortal(ax-R*0.08, ax+R*0.08, y1, z0, R*0.165, '#f59e0b', '#1e293b', idx===1 ? '#b91c1c' : '#2563eb');
    });

    // 3. Steep Red Clay-Tile Roof + Central Ornate Glockenspiel Mechanical Figurine Tower & Onion Dome
    const rH = R*0.13;
    gableRoof(x0, x1, y0, y1, H, rH, R*0.03, '#b91c1c', '#dfd3b8', '#7f1d1d', 3);
    const cZ = H + rH - R*0.02;
    isoBox(-R*0.12, R*0.12, -R*0.08, R*0.08, cZ, cZ+R*0.10, '#fef3c7', '#dfd3b8', '#0d9488', '#b45309', R*0.009);
    // Rotating mechanical jousting figurines carillon stage on the Glockenspiel tower
    poly([Q(-R*0.09,R*0.082,cZ+R*0.02),Q(R*0.09,R*0.082,cZ+R*0.02),Q(R*0.09,R*0.082,cZ+R*0.065),Q(-R*0.09,R*0.082,cZ+R*0.065)], '#1e3a8a', '#f59e0b', R*0.007);
    const figOff = Math.sin(tm*3) * R * 0.035;
    disc(Q(-R*0.03+figOff, R*0.085, cZ+R*0.04), R*0.012, '#fde047');
    disc(Q( R*0.03-figOff, R*0.085, cZ+R*0.04), R*0.012, '#ef4444');
    // Copper Onion Dome Crown
    const od = Q(0, 0, cZ+R*0.145);
    ell(od, R*0.085, R*0.062, '#0d9488', '#f59e0b', R*0.009);
    line(od, [od[0], od[1]-R*0.065], '#f59e0b', R*0.013);
  }
}
return drawTheater;
})();

const chairSwingSkinPack = (() => {

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

/* ===== CHAIR SWING SKIN METADATA (UNTHEMED + 11 HEAVY/IMMERSIVE SKINS) ===== */
const CHAIR_SWING_SKINS = {
  unthemed: {id:'unthemed', label:'Unthemed (Tier 0–2)', name:'Standard Chair Swing',     sub:'Compact Plinth & Striped Cone Canopy',       hex:'#cbd5e1', border:'#ef4444'},
  classic:  {id:'classic',  label:'Classic Midway',      name:'Grand Wellenflieger',      sub:'Baroque Gold Filigree Column & Pagoda Crown',hex:'#cbb07c', border:'#d9342b'},
  jungle:   {id:'jungle',   label:'Jungle',              name:'Kapok Tree Canopy Swing',  sub:'Gnarled Vine Trunk & Palm-Frond Umbrella',   hex:'#587c48', border:'#2fbf9a'},
  western:  {id:'western',  label:'Wild West',           name:'Prairie Windmill Swinger', sub:'Redwood Derricks & Galvanized Rotor Blades', hex:'#c99a62', border:'#b91c1c'},
  frontier: {id:'frontier', label:'Frontier',            name:'Tall Timber Totem Swing',  sub:'Carved Cedar Totem Pillar & Pine-Bough Cone',hex:'#7d955d', border:'#566e42'},
  space:    {id:'space',    label:'Space',               name:'Orbital UFO Mothership',   sub:'Plasma Reactor Core & Rotating Saucer Ring', hex:'#334155', border:'#0ea5e9'},
  gothic:   {id:'gothic',   label:'Gothic',              name:'Nightwing Bat Belfry',     sub:'Obsidian Gargoyle Spire & Scalloped Bat Wing',hex:'#3b3345', border:'#991b1b'},
  medieval: {id:'medieval', label:'Medieval',            name:'Royal Jousting Pavilion',  sub:'Heraldic Stone Column & Crowned Silk Tent',  hex:'#6c8c58', border:'#eab308'},
  alps:     {id:'alps',     label:'Alps',                name:'Edelweiss Parasol Swing',  sub:'Carved Larch Bell-Tower & Snow-Capped Roof', hex:'#a8c5d6', border:'#0284c7'},
  fiesta:   {id:'fiesta',   label:'Fiesta',              name:'Gran Sombrero Volador',    sub:'Talavera Mosaic Pillar & Giant Sombrero',    hex:'#d99b52', border:'#e11d48'},
  nordic:   {id:'nordic',   label:'Nordic',              name:'Yggdrasil Shield-Whirl',   sub:'Runic Stave Pillar, Viking Shields & Dragons',hex:'#4d6b63', border:'#d97706'},
  bavarian: {id:'bavarian', label:'Bavarian',            name:'Oktoberfest Maibaum',      sub:'Blue/White Spiral Maypole & Floral Wreath',  hex:'#769958', border:'#2563eb'}
};

/* ===== SPRITE CODE: copy this block into engine.js ===== */
/**
 * drawChairSwing(ctx, cx, cy, R, opts)
 *  opts.accent        : Land / chain accent color (default '#ef4444')
 *  opts.themeId       : 'classic'|'jungle'|'western'|'wildwest'|'frontier'|'space'|'gothic'|'medieval'|'alps'|'fiesta'|'nordic'|'bavarian'
 *  opts.rideThemeTier : 0..4 (<=2 draws Standard Unthemed; >=3 draws Heavy/Immersive Themed Pillar & Canopy)
 *  opts.t             : spin angle in radians (rotates canopy & seats)
 *  opts.fly           : 0..1 seat swing-out factor (0 = hanging at rest, 1 = full speed)
 *  opts.flip          : true when called under horizontal mirror
 *  opts.tile          : draw the hex tile background (default true)
 */
function drawChairSwing(ctx, cx, cy, R, o={}){
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTheme = String(o.themeId || o.theme || 'unthemed').toLowerCase();
  if(rawTheme === 'wildwest' || rawTheme === 'wild_west') rawTheme = 'western';
  const theme = (tier <= 2 || !CHAIR_SWING_SKINS[rawTheme]) ? 'unthemed' : rawTheme;
  const skin = CHAIR_SWING_SKINS[theme] || CHAIR_SWING_SKINS.unthemed;
  const accent = o.accent || skin.border || '#ef4444';
  const th = o.t == null ? 0.4 : o.t;
  const fly = o.fly == null ? 0.82 : o.fly;
  const fl = o.flip ? -1 : 1;

  const P = (X,Y,Z) => [cx + (X - Y)*0.7, cy + (X + Y)*0.35 - Z];
  const g = (r,a,Z) => P(r*Math.cos(a), r*Math.sin(a), Z);
  const Rc = R*0.48, Zt = R*0.64, Zr = Zt - R*0.048, N = 16, Lc = R*0.38, psi = 0.15 + 0.65*fly, z0 = R*0.02;
  const cream = '#fde8c0', gold = '#f5c542', goldD = '#b45309', TAU = Math.PI*2;

  const line = (a,b,c,w) => {
    ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
  };
  const poly = (pts,fill,stroke,lw) => {
    ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.lineJoin='round';ctx.stroke();}
  };
  const ell = (p,r,fill,stroke,lw) => {
    ctx.beginPath();ctx.ellipse(p[0],p[1],Math.max(0.5,0.99*r),Math.max(0.5,0.495*r),0,0,TAU);
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.01;ctx.stroke();}
  };
  const cyl = (r,Z,h,col,rimCol) => {
    const p = P(0,0,Z);
    ell(p, r, shade(col,-0.25), rimCol, R*0.008);
    ctx.fillStyle = col;
    ctx.fillRect(p[0]-0.99*r, p[1]-h, 1.98*r, h);
    // Subtle 3D cylindrical highlight & shadow gradient
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(p[0]-0.65*r, p[1]-h, 0.45*r, h);
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(p[0]+0.35*r, p[1]-h, 0.64*r, h);
    ell([p[0],p[1]-h], r, shade(col,0.15), rimCol, R*0.008);
  };
  const side = (r,Z,h,col) => {
    const p = P(0,0,Z);
    ell(p, r, shade(col,-0.15));
    ctx.fillStyle = col;
    ctx.fillRect(p[0]-0.99*r, p[1]-h, 1.98*r, h);
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

  // 2. Soft Ambient Ground Shadow + SMALL Baseplate ONLY Under the Central Pillar!
  const pb = P(0, 0, 0);
  // Soft overhead canopy shadow cast on the grass/ground below
  ell([pb[0]+fl*R*0.08, pb[1]+R*0.03], R*0.46, 'rgba(15,23,42,0.22)');

  // Compact Baseplate directly under the central pillar (radius R*0.24..0.27 instead of R*0.64!)
  const basePlateCols = {
    unthemed: ['#94a3b8', '#475569'],
    classic:  ['#f5c542', '#991b1b'],
    jungle:   ['#8e8a72', '#3f6212'],
    western:  ['#9a6a3c', '#451a03'],
    frontier: ['#80858d', '#4a3320'],
    space:    ['#0f172a', '#22d3ee'],
    gothic:   ['#27272a', '#991b1b'],
    medieval: ['#64748b', '#eab308'],
    alps:     ['#e2e8f0', '#78350f'],
    fiesta:   ['#c2410c', '#f59e0b'],
    nordic:   ['#475569', '#d97706'],
    bavarian: ['#e2e8f0', '#2563eb']
  }[theme] || ['#94a3b8', '#475569'];

  cyl(R*0.25, 0, z0, basePlateCols[0], basePlateCols[1]);
  ell(P(0,0,z0), R*0.21, shade(basePlateCols[0], 0.12), basePlateCols[1], R*0.008);

  // 3. Compute 16 Swinging Seats on Chains (split into back pass key < 0 and front pass key >= 0)
  const seats = [];
  for(let k=0; k<N; k++){
    const a = th + k*TAU/N;
    const r0 = Rc*0.92;
    const r1 = r0 + Lc*Math.sin(psi);
    const Zs = Zr - Lc*Math.cos(psi);
    seats.push({a, k, S: g(r1, a, Zs), key: Math.cos(a) + Math.sin(a), r0, r1, Zs});
  }

  const rc = ['#facc15','#3b82f6','#22c55e','#f97316','#ec4899','#a855f7'];
  const drawSeat = s => {
    const chainCol = theme==='space' ? 'rgba(34,211,238,0.85)'
                   : theme==='jungle'||theme==='western'||theme==='frontier' ? '#d9b27a'
                   : theme==='classic'||theme==='medieval'||theme==='fiesta' ? '#fde047'
                   : 'rgba(226,232,240,0.88)';
    [-1,1].forEach(d=>{
      const o1 = R*0.016*d, ca = Math.cos(s.a), sa = Math.sin(s.a);
      line(P(s.r0*ca - sa*o1, s.r0*sa + ca*o1, Zr), P(s.r1*ca - sa*o1, s.r1*sa + ca*o1, s.Zs), chainCol, R*0.011);
    });
    const S = s.S;
    // Rider torso & head
    ctx.fillStyle = rc[s.k % 6];
    ctx.fillRect(S[0]-R*0.024, S[1]-R*0.08, R*0.048, R*0.068);
    ctx.fillStyle = '#fde4c8';
    ctx.beginPath(); ctx.arc(S[0], S[1]-R*0.102, R*0.027, 0, TAU); ctx.fill();

    // Themed Chair / Seat Cradle
    if(theme === 'jungle'){
      // Woven rattan basket chair
      ell([S[0], S[1]-R*0.01], R*0.048, '#b45309', '#fef08a', R*0.006);
    } else if(theme === 'western'){
      // Western leather saddle seat
      ctx.fillStyle = '#78350f';
      ctx.fillRect(S[0]-R*0.042, S[1]-R*0.02, R*0.084, R*0.024);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(S[0]-R*0.012, S[1]-R*0.032, R*0.024, R*0.015);
    } else if(theme === 'space'){
      // Glowing cyan zero-G hover pod seat
      ell([S[0], S[1]-R*0.01], R*0.05, '#0f172a', '#22d3ee', R*0.009);
    } else if(theme === 'gothic'){
      // Wrought-iron crimson velvet cage chair
      ctx.fillStyle = '#18181b';
      ctx.fillRect(S[0]-R*0.042, S[1]-R*0.028, R*0.084, R*0.032);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(S[0]-R*0.034, S[1]-R*0.016, R*0.068, R*0.016);
    } else if(theme === 'nordic'){
      // Mini dragon-shield timber seat
      ctx.fillStyle = '#451a03';
      ctx.fillRect(S[0]-R*0.042, S[1]-R*0.018, R*0.084, R*0.022);
      ell([S[0], S[1]-R*0.008], R*0.022, '#f59e0b');
    } else {
      ctx.fillStyle = s.k%2 ? accent : '#f8fafc';
      ctx.fillRect(S[0]-R*0.04, S[1]-R*0.016, R*0.08, R*0.02);
    }
  };

  // Pass A: Back half of swinging seats (behind central pillar)
  seats.filter(s => s.key < 0).sort((u,v) => u.key - v.key).forEach(drawSeat);

  // Helper: Draw a 12-gore conical canopy from rim Zr/Zt to peak, with optional scalloped valance
  const drawConicalCanopy = (rCan, zRim, zPeak, nGores, colFn, strokeCol, scallopColFn) => {
    const pk = P(0, 0, zPeak);
    for(let i=0; i<nGores; i++){
      const a0 = th*0.5 + i*TAU/nGores, a1 = a0 + TAU/nGores;
      ctx.fillStyle = colFn(i);
      ctx.beginPath();
      ctx.moveTo(pk[0], pk[1]);
      for(let s=0; s<=4; s++){
        const p = g(rCan, a0 + (a1-a0)*s/4, zRim);
        ctx.lineTo(p[0], p[1]);
      }
      ctx.closePath();
      ctx.fill();
      if(strokeCol){
        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = R*0.006;
        ctx.stroke();
      }
      // Front-facing scalloped valance flaps around the rim
      const am = (a0+a1)/2;
      if(scallopColFn && (Math.cos(am) + Math.sin(am) > -0.25)){
        const p0 = g(rCan, a0, zRim), p1 = g(rCan, a1, zRim), pm = g(rCan*1.02, am, zRim - R*0.042);
        poly([p0, pm, p1], scallopColFn(i), strokeCol, R*0.006);
      }
    }
  };

  const tr = R*0.155, zb = z0 + R*0.04, zt = Zr - R*0.055;

  /* =====================================================================
   * VARIANT 1: UNTHEMED STANDARD (rideThemeTier <= 2: None, Light, Medium)
   * ===================================================================== */
  if(theme === 'unthemed'){
    cyl(R*0.21, z0, R*0.04, '#e2e8f0', '#94a3b8');
    cyl(tr, zb, zt-zb, cream);
    for(let i=0;i<8;i++){
      const a0 = -Math.PI/4 + i*Math.PI*0.225, a1 = a0 + Math.PI*0.225;
      poly([g(tr,a0,zb),g(tr,a1,zb),g(tr,a1,zt),g(tr,a0,zt)], i%2 ? cream : accent);
    }
    cyl(R*0.19, zt, R*0.05, accent);
    side(Rc, Zr, R*0.045, cream);
    for(let i=0;i<24;i++){
      const a = th*0.5 + i*TAU/24;
      if(Math.cos(a)+Math.sin(a) > 0){
        const p = g(Rc*0.995, a, Zr+R*0.015);
        ctx.fillStyle = '#fde68a'; ctx.beginPath(); ctx.arc(p[0], p[1], R*0.011, 0, TAU); ctx.fill();
      }
    }
    drawConicalCanopy(Rc, Zt, Zt+R*0.11, 12, i => i%2 ? cream : accent, 'rgba(120,53,15,.25)', null);
    const peak = P(0,0,Zt+R*0.11), sp = P(0,0,Zt+R*0.23);
    line(peak, sp, '#fde68a', R*0.016);
    ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(sp[0], sp[1], R*0.028, 0, TAU); ctx.fill();
  }

  /* =====================================================================
   * VARIANT 2: CLASSIC MIDWAY (Baroque Zierer Wellenflieger / Wave Swinger)
   * ===================================================================== */
  else if(theme === 'classic'){
    // Ornate Gold & Venetian Red stepped pedestal + fluted Baroque column with gold garlands
    cyl(R*0.22, z0, R*0.05, '#991b1b', gold);
    cyl(R*0.18, z0+R*0.05, R*0.04, gold, goldD);
    cyl(tr, zb+R*0.03, zt-zb-R*0.03, '#fffbeb', gold);
    for(let i=0;i<8;i++){
      const a0 = -Math.PI/4 + i*Math.PI*0.225, a1 = a0 + Math.PI*0.225;
      poly([g(tr,a0,zb+R*0.03),g(tr,a1,zb+R*0.03),g(tr,a1,zt),g(tr,a0,zt)], i%2 ? '#fef3c7' : '#d9342b', gold, R*0.005);
    }
    // Gold filigree rings along the central pillar
    [0.35, 0.68].forEach(f => cyl(tr*1.12, zb+(zt-zb)*f, R*0.025, gold, goldD));
    cyl(R*0.22, zt, R*0.055, '#991b1b', gold);

    // Scalloped Baroque Carousel Drum & Double-Tier Pagoda Canopy
    side(Rc, Zr, R*0.055, '#991b1b');
    // Painted cameo medallions & chaser lights around the drum
    for(let i=0;i<16;i++){
      const a = th*0.5 + i*TAU/16;
      if(Math.cos(a)+Math.sin(a) > -0.1){
        const p = g(Rc*1.0, a, Zr+R*0.025);
        ell(p, R*0.032, i%2 ? '#38bdf8' : '#fef08a', gold, R*0.007);
      }
    }
    drawConicalCanopy(Rc*1.02, Zt, Zt+R*0.10, 16, i => i%2 ? '#fffbeb' : '#d9342b', gold, i => i%2 ? gold : '#991b1b');
    // Upper Baroque Lantern Crown & Brass Finial Spire
    cyl(Rc*0.42, Zt+R*0.08, R*0.055, gold, goldD);
    drawConicalCanopy(Rc*0.45, Zt+R*0.135, Zt+R*0.22, 12, i => i%2 ? '#d9342b' : gold, goldD, null);
    const pk = P(0,0,Zt+R*0.22), sp = P(0,0,Zt+R*0.32);
    line(pk, sp, gold, R*0.02);
    ell(P(0,0,Zt+R*0.27), R*0.032, '#fffbeb', gold, R*0.008);
    ell(sp, R*0.04, gold, goldD, R*0.008);
  }

  /* =====================================================================
   * VARIANT 3: JUNGLE (Giant Kapok Tree Trunk & Tropical Palm-Frond Canopy)
   * ===================================================================== */
  else if(theme === 'jungle'){
    // Mossy Mayan carved stone plinth + gnarled Kapok tree trunk with buttress roots & vines
    cyl(R*0.23, z0, R*0.055, '#8e8a72', '#4d7c0f');
    // Flared tree roots
    for(let k=0;k<6;k++){
      const a = k*TAU/6 + 0.3;
      if(Math.cos(a)+Math.sin(a) > -0.3){
        poly([g(R*0.23,a,z0+R*0.04), g(tr*0.9,a,zb+R*0.14), g(R*0.20,a+0.25,z0+R*0.04)], '#5a4028', '#3e2723', R*0.006);
      }
    }
    cyl(tr*1.05, zb, zt-zb, '#6b4f35', '#3e2723');
    // Vertical bark ridges & spiralling emerald jungle vines
    for(let i=0;i<6;i++){
      const a = -0.5 + i*0.45;
      line(g(tr*1.02,a,zb), g(tr*0.98,a+0.2,zt), '#3e2723', R*0.012);
    }
    for(let z=zb+R*0.04; z<zt-R*0.04; z+=R*0.055){
      const va = (z/R)*8;
      const vp = g(tr*1.06, va, z);
      ell(vp, R*0.032, '#15803d', '#4ade80', R*0.005);
    }
    // Carved stone Tiki collar with glowing jade eyes
    cyl(R*0.21, zt-R*0.02, R*0.065, '#8e8a72', '#eab308');
    // Layered Palm-Frond & Bamboo Thatch Canopy + Golden Sun-Idol Finial
    side(Rc*0.96, Zr, R*0.04, '#78350f');
    // Lower thatch layer
    drawConicalCanopy(Rc*1.04, Zt-R*0.01, Zt+R*0.11, 14, i => i%2 ? '#b5893d' : '#926c29', '#5a4028', i => '#a16207');
    // Upper overlapping tropical palm-leaf star canopy
    drawConicalCanopy(Rc*0.88, Zt+R*0.03, Zt+R*0.16, 12, i => i%2 ? '#15803d' : '#166534', '#14532d', i => '#22c55e');
    // Golden Mayan Sun Idol Crown
    const pk = P(0,0,Zt+R*0.16);
    cyl(R*0.11, Zt+R*0.15, R*0.07, '#eab308', '#a16207');
    ell(P(0,0,Zt+R*0.26), R*0.065, '#facc15', '#a16207', R*0.01);
    ell(P(0,0,Zt+R*0.26), R*0.028, '#2fbf9a');
  }

  /* =====================================================================
   * VARIANT 4: WILD WEST (Prairie Timber Derrick & Giant Windmill Rotor)
   * ===================================================================== */
  else if(theme === 'western'){
    // Riveted iron-hooped redwood water-tank base + open timber lattice windmill tower
    cyl(R*0.23, z0, R*0.065, '#9a3412', '#451a03');
    // 4 tapered redwood derrick legs + X-bracing
    const legR0 = R*0.19, legR1 = R*0.12;
    for(let lv=0; lv<4; lv++){
      const zA = zb + (zt-zb)*(lv/4), zB = zb + (zt-zb)*((lv+1)/4);
      const rA = legR0 + (legR1-legR0)*(lv/4), rB = legR0 + (legR1-legR0)*((lv+1)/4);
      for(let k=0;k<4;k++){
        const a0 = k*TAU/4 + 0.35, a1 = (k+1)*TAU/4 + 0.35;
        line(g(rA,a0,zA), g(rB,a0,zB), '#78350f', R*0.022);
        line(g(rA,a0,zA), g(rA,a1,zA), '#92400e', R*0.012);
        line(g(rA,a0,zA), g(rB,a1,zB), '#b45309', R*0.009);
        line(g(rA,a1,zA), g(rB,a0,zB), '#b45309', R*0.009);
      }
    }
    // Cedar water-tank collar at top of derrick
    cyl(R*0.21, zt-R*0.01, R*0.06, '#b45309', '#451a03');

    // Canopy: Giant Galvanized-Steel & Red-Tipped Western Windmill Rotor + Wagon-Wheel Rim
    ctx.strokeStyle = '#451a03'; ctx.lineWidth = R*0.022;
    ctx.beginPath();
    for(let s=0;s<=48;s++){const p=g(Rc,s/48*TAU,Zr+R*0.01); s?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}
    ctx.stroke();
    // 18 pitched galvanized steel windmill blades with red painted tips
    const pk = P(0,0,Zt+R*0.09);
    for(let i=0;i<18;i++){
      const a0 = th*0.5 + i*TAU/18, a1 = a0 + TAU/18*0.78;
      const p0 = g(Rc*0.22, a0, Zt+R*0.06), p1 = g(Rc*1.02, a0, Zt), p2 = g(Rc*1.02, a1, Zt+R*0.025), p3 = g(Rc*0.22, a1, Zt+R*0.075);
      poly([p0, p1, p2, p3], i%2 ? '#cbd5e1' : '#94a3b8', '#475569', R*0.006);
      // Red tip stripe on outer blade edge
      const rTip = Rc*0.82;
      poly([g(rTip,a0,Zt+R*0.01), p1, p2, g(rTip,a1,Zt+R*0.03)], '#b91c1c');
    }
    // Cast-iron windmill hub cap & directional tail-vane finial
    cyl(R*0.14, Zt+R*0.05, R*0.06, '#451a03', '#f59e0b');
    const vn = P(0,0,Zt+R*0.22);
    line(P(0,0,Zt+R*0.11), vn, '#78350f', R*0.018);
    poly([[vn[0],vn[1]],[vn[0]+R*0.14,vn[1]-R*0.04],[vn[0]+R*0.14,vn[1]+R*0.03]], '#b91c1c', '#f59e0b', R*0.008);
  }

  /* =====================================================================
   * VARIANT 5: FRONTIER (Carved Cedar Totem Pillar & Pine-Bough Lodge Canopy)
   * ===================================================================== */
  else if(theme === 'frontier'){
    // River-stone octagon plinth + hand-carved cedar totem pole pillar
    cyl(R*0.23, z0, R*0.055, '#80858d', '#475569');
    cyl(tr*1.04, zb, zt-zb, '#8a5a33', '#4a3320');
    // Carved totem bands (Bear, Eagle, Salmon motifs in ochre, teal, crimson)
    const totemCols = ['#b91c1c', '#eab308', '#2fbf9a', '#8a5a33'];
    for(let lv=0; lv<4; lv++){
      const zBand = zb + (zt-zb)*(lv*0.24 + 0.06);
      cyl(tr*1.08, zBand, R*0.045, totemCols[lv], '#4a3320');
      // Totem eyes on front face
      const ep1 = g(tr*1.1, 0.45, zBand+R*0.02), ep2 = g(tr*1.1, 1.1, zBand+R*0.02);
      ell(ep1, R*0.018, '#fef08a', '#1e293b', R*0.005);
      ell(ep2, R*0.018, '#fef08a', '#1e293b', R*0.005);
    }
    // Outstretched carved wooden Eagle Wings just below the canopy
    const wZ = zt - R*0.02;
    [-1, 1].forEach(dir => {
      const a = 0.785 + dir*1.45 + th*0.5;
      poly([g(tr,a,wZ), g(Rc*0.72,a,wZ+R*0.05), g(Rc*0.58,a,wZ-R*0.03), g(tr,a,wZ-R*0.05)], '#d97706', '#4a3320', R*0.008);
    });
    // Cedar-Bark & Deep Pine-Bough Conical Canopy with glowing camp lanterns around rim
    side(Rc, Zr, R*0.045, '#5a3b22');
    for(let i=0;i<12;i++){
      const a = th*0.5 + i*TAU/12;
      if(Math.cos(a)+Math.sin(a) > 0){
        const lp = g(Rc*1.01, a, Zr);
        ell(lp, R*0.018, '#fbbf24', '#78350f', R*0.006);
      }
    }
    drawConicalCanopy(Rc*1.02, Zt, Zt+R*0.14, 12, i => i%2 ? '#2f5f3a' : '#8a5a33', '#3e2723', i => i%2 ? '#3d7348' : '#6b4a2b');
    // Carved Golden Thunderbird Finial at peak
    const pk = P(0,0,Zt+R*0.14), sp = P(0,0,Zt+R*0.25);
    line(pk, sp, '#5a3b22', R*0.02);
    poly([[sp[0]-R*0.09,sp[1]-R*0.01],[sp[0],sp[1]+R*0.03],[sp[0]+R*0.09,sp[1]-R*0.01],[sp[0],sp[1]-R*0.04]], '#eab308', '#4a3320', R*0.007);
  }

  /* =====================================================================
   * VARIANT 6: SPACE (Plasma Reactor Core & Rotating UFO Saucer Canopy)
   * ===================================================================== */
  else if(theme === 'space'){
    // Dark titanium magnetic pad + glowing cyan plasma core column with floating energy rings
    cyl(R*0.23, z0, R*0.05, '#0f172a', '#22d3ee');
    cyl(tr*0.95, zb, zt-zb, '#0284c7', '#38bdf8');
    // Inner glowing plasma core streak
    const pBot = P(0,0,zb), pTop = P(0,0,zt);
    line(pBot, pTop, '#e0f2fe', R*0.08);
    // 4 floating horizontal titanium & neon-cyan containment rings along the pillar
    [0.2, 0.45, 0.7, 0.9].forEach((f, idx) => {
      const rz = zb + (zt-zb)*f;
      cyl(tr*1.28, rz, R*0.022, '#1e293b', idx%2 ? '#22d3ee' : '#c084fc');
    });

    // Canopy: Sleek Rotating Flying-Saucer UFO Mothership with Glowing Tractor-Beam Rim Ports
    side(Rc*1.04, Zr, R*0.045, '#0f172a');
    drawConicalCanopy(Rc*1.05, Zt, Zt+R*0.08, 16, i => i%2 ? '#e2e8f0' : '#94a3b8', '#38bdf8', null);
    // Glowing neon cyan & magenta saucer rim lights
    for(let i=0;i<16;i++){
      const a = th*0.5 + i*TAU/16;
      if(Math.cos(a)+Math.sin(a) > -0.2){
        const p = g(Rc*1.02, a, Zr+R*0.02);
        ell(p, R*0.022, i%2 ? '#22d3ee' : '#e879f9');
      }
    }
    // Upper translucent cobalt glass command dome + pulsing telemetry needle
    const dm = P(0,0,Zt+R*0.09);
    ell(dm, Rc*0.46, '#0284c7', '#22d3ee', R*0.012);
    ell([dm[0],dm[1]-R*0.025], Rc*0.30, '#38bdf8');
    const sp = P(0,0,Zt+R*0.27);
    line(dm, sp, '#e2e8f0', R*0.016);
    ell(P(0,0,Zt+R*0.20), R*0.055, null, '#22d3ee', R*0.01);
    ell(sp, R*0.028, '#22d3ee', '#ffffff', R*0.007);
  }

  /* =====================================================================
   * VARIANT 7: GOTHIC (Obsidian Gargoyle Spire & Scalloped Bat-Wing Canopy)
   * ===================================================================== */
  else if(theme === 'gothic'){
    // Charcoal crypt base + dark obsidian fluted gothic pillar with crimson lancet windows
    cyl(R*0.23, z0, R*0.055, '#18181b', '#991b1b');
    cyl(tr, zb, zt-zb, '#27272a', '#09090b');
    for(let i=0;i<8;i++){
      const a0 = -Math.PI/4 + i*Math.PI*0.225, a1 = a0 + Math.PI*0.225;
      poly([g(tr,a0,zb),g(tr,a1,zb),g(tr,a1,zt),g(tr,a0,zt)], i%2 ? '#18181b' : '#3f3f46', '#09090b', R*0.006);
    }
    // Glowing crimson stained-glass lancet slits & wrought-iron collars
    cyl(tr*1.15, zb+(zt-zb)*0.5, R*0.03, '#09090b', '#dc2626');
    cyl(R*0.21, zt, R*0.055, '#450a0a', '#dc2626');

    // Canopy: Ribbed Black-Velvet & Blood-Crimson Bat-Wing Umbrella with Pointed Webbed Scallops
    side(Rc, Zr, R*0.04, '#09090b');
    const pk = P(0,0,Zt+R*0.15);
    for(let i=0;i<12;i++){
      const a0 = th*0.5 + i*TAU/12, a1 = a0 + TAU/12, am = (a0+a1)/2;
      const p0 = g(Rc*1.05, a0, Zt - R*0.02), p1 = g(Rc*1.05, a1, Zt - R*0.02);
      // Inwardly arched bat-wing web between rib points
      const pm = g(Rc*0.88, am, Zt + R*0.025);
      poly([pk, p0, pm, p1], i%2 ? '#18181b' : '#7f1d1d', '#09090b', R*0.008);
      // Wrought-iron rib spine & glowing amethyst candle at each rib tip
      line(pk, p0, '#52525b', R*0.01);
      if(Math.cos(a0)+Math.sin(a0) > -0.2){
        ell([p0[0], p0[1]-R*0.015], R*0.014, '#c084fc');
      }
    }
    // Wrought-iron belfry spire & bat finial
    const sp = P(0,0,Zt+R*0.28);
    line(pk, sp, '#18181b', R*0.018);
    poly([[sp[0]-R*0.075,sp[1]-R*0.02],[sp[0],sp[1]+R*0.02],[sp[0]+R*0.075,sp[1]-R*0.02],[sp[0],sp[1]-R*0.005]], '#09090b', '#dc2626', R*0.007);
  }

  /* =====================================================================
   * VARIANT 8: MEDIEVAL (Heraldic Castle Pillar & Royal Tournament Pavilion)
   * ===================================================================== */
  else if(theme === 'medieval'){
    // Cut-stone castle plinth + spiral-painted royal blue, crimson & gold tournament lance column
    cyl(R*0.23, z0, R*0.055, '#64748b', '#eab308');
    cyl(tr, zb, zt-zb, '#fef3c7', '#b45309');
    for(let i=0;i<8;i++){
      const a0 = -Math.PI/4 + i*Math.PI*0.225, a1 = a0 + Math.PI*0.225;
      poly([g(tr,a0,zb),g(tr,a1,zb),g(tr,a1,zt),g(tr,a0,zt)], i%3===0 ? '#b91c1c' : i%3===1 ? '#1d4ed8' : '#f5c542', '#78350f', R*0.005);
    }
    // Gold crenellated battlement collar under the canopy
    cyl(R*0.22, zt, R*0.055, '#f5c542', '#b45309');

    // Canopy: 12-Gore Royal Silk Tournament Tent with Dagged Valances & Heraldic Shields
    side(Rc, Zr, R*0.05, '#1e3a8a');
    for(let i=0;i<12;i++){
      const a = th*0.5 + i*TAU/12;
      if(Math.cos(a)+Math.sin(a) > 0){
        const p = g(Rc*1.0, a, Zr+R*0.02);
        ell(p, R*0.022, i%2 ? '#b91c1c' : '#f5c542', '#fef08a', R*0.006);
      }
    }
    const tentCols = ['#b91c1c', '#fef3c7', '#1d4ed8', '#f5c542'];
    drawConicalCanopy(Rc*1.02, Zt, Zt+R*0.145, 12, i => tentCols[i%4], '#b45309', i => tentCols[(i+1)%4]);
    // Golden Royal Crown around peak + fluttering King's Pennant Banner
    cyl(R*0.12, Zt+R*0.12, R*0.045, '#f5c542', '#b45309');
    const pk = P(0,0,Zt+R*0.165), sp = P(0,0,Zt+R*0.30);
    line(pk, sp, '#f5c542', R*0.016);
    poly([[sp[0],sp[1]],[sp[0]+R*0.14,sp[1]+R*0.025],[sp[0],sp[1]+R*0.055]], '#b91c1c', '#f5c542', R*0.006);
  }

  /* =====================================================================
   * VARIANT 9: ALPS (Carved Larch Bell-Tower & Snow-Capped Edelweiss Parasol)
   * ===================================================================== */
  else if(theme === 'alps'){
    // Alpine granite base + honey-larch carved timber pillar with Swiss Cross shields
    cyl(R*0.23, z0, R*0.05, '#cbd5e1', '#64748b');
    cyl(tr, zb, zt-zb, '#b45309', '#451a03');
    // Carved floral bands & Swiss shields on pillar
    [0.35, 0.70].forEach(f => {
      const bz = zb + (zt-zb)*f;
      cyl(tr*1.1, bz, R*0.032, '#dc2626', '#f8fafc');
    });
    cyl(R*0.21, zt, R*0.05, '#78350f', '#451a03');

    // Canopy: Red-and-White Checkered Alpine Parasol with Snow-Capped Crown & Hanging Brass Cowbells
    side(Rc, Zr, R*0.045, '#78350f');
    // Hanging brass cowbells along the rim
    for(let i=0;i<16;i++){
      const a = th*0.5 + i*TAU/16;
      if(Math.cos(a)+Math.sin(a) > 0){
        const p = g(Rc*1.0, a, Zr+R*0.005);
        ell(p, R*0.018, '#f5c542', '#78350f', R*0.006);
      }
    }
    drawConicalCanopy(Rc*1.03, Zt, Zt+R*0.13, 12, i => i%2 ? '#dc2626' : '#f8fafc', '#78350f', i => i%2 ? '#f8fafc' : '#dc2626');
    // Snow blanket cap over upper half of canopy + Ice-Crystal Edelweiss Finial
    drawConicalCanopy(Rc*0.56, Zt+R*0.06, Zt+R*0.14, 12, () => '#f8fafc', '#bae6fd', null);
    const pk = P(0,0,Zt+R*0.14), sp = P(0,0,Zt+R*0.25);
    line(pk, sp, '#bae6fd', R*0.018);
    ell(sp, R*0.038, '#ffffff', '#38bdf8', R*0.009);
  }

  /* =====================================================================
   * VARIANT 10: FIESTA (Talavera Mosaic Column & Giant Mexican Sombrero Canopy)
   * ===================================================================== */
  else if(theme === 'fiesta'){
    // Terracotta plinth + vibrant Talavera-tiled central column (cobalt, turquoise, rose, marigold)
    cyl(R*0.23, z0, R*0.05, '#c2410c', '#f59e0b');
    const talCols = ['#e11d48', '#0d9488', '#f59e0b', '#1d4ed8', '#fef3c7'];
    const nBands = 5;
    for(let b=0;b<nBands;b++){
      const bz = zb + (zt-zb)*(b/nBands), bh = (zt-zb)/nBands;
      cyl(tr*1.02, bz, bh, talCols[b%talCols.length], '#f59e0b');
    }

    // Canopy: GIANT FESTIVE MEXICAN SOMBRERO! (Wide upturned embroidered brim + tall tapered sombrero crown)
    // Upturned outer sombrero brim
    side(Rc*1.08, Zr, R*0.055, '#f59e0b');
    drawConicalCanopy(Rc*1.08, Zt+R*0.01, Zt+R*0.06, 16, i => ['#e11d48','#f59e0b','#0d9488','#1d4ed8'][i%4], '#fde047', null);
    // Dangling colorful pom-pom tassels around the sombrero brim
    for(let i=0;i<20;i++){
      const a = th*0.5 + i*TAU/20;
      if(Math.cos(a)+Math.sin(a) > -0.15){
        const p = g(Rc*1.07, a, Zr-R*0.005);
        ell(p, R*0.018, ['#fde047','#ec4899','#2dd4bf','#ffffff'][i%4]);
      }
    }
    // Tall tapered central Sombrero Crown rising above the brim
    cyl(Rc*0.44, Zt+R*0.04, R*0.04, '#0d9488', '#fde047');
    drawConicalCanopy(Rc*0.42, Zt+R*0.08, Zt+R*0.25, 12, i => i%2 ? '#f59e0b' : '#e11d48', '#fde047', null);
    ell(P(0,0,Zt+R*0.25), R*0.08, '#f59e0b', '#e11d48', R*0.01);
  }

  /* =====================================================================
   * VARIANT 11: NORDIC (Runic Stave Pillar, Viking Shield Rim & Dragon Crown)
   * ===================================================================== */
  else if(theme === 'nordic'){
    // Grey fjord-stone base + dark tarred stave-wood pillar with carved golden knotwork rings
    cyl(R*0.23, z0, R*0.055, '#475569', '#d97706');
    cyl(tr, zb, zt-zb, '#451a03', '#290f02');
    for(let i=0;i<8;i++){
      const a0 = -Math.PI/4 + i*Math.PI*0.225, a1 = a0 + Math.PI*0.225;
      poly([g(tr,a0,zb),g(tr,a1,zb),g(tr,a1,zt),g(tr,a0,zt)], i%2 ? '#451a03' : '#290f02', '#78350f', R*0.006);
    }
    [0.33, 0.66].forEach(f => cyl(tr*1.12, zb+(zt-zb)*f, R*0.028, '#d97706', '#78350f'));
    cyl(R*0.21, zt, R*0.05, '#78350f', '#f59e0b');

    // Canopy: Dark Stave-Shingle Conical Roof Rimmed with 16 Overlapping Painted Viking Round Shields!
    side(Rc, Zr, R*0.045, '#290f02');
    drawConicalCanopy(Rc*1.01, Zt, Zt+R*0.14, 12, i => i%2 ? '#334155' : '#1e293b', '#d97706', null);
    // 16 overlapping painted wooden Viking shields mounted around the canopy rim
    for(let i=0;i<16;i++){
      const a = th*0.5 + i*TAU/16;
      if(Math.cos(a)+Math.sin(a) > -0.15){
        const p = g(Rc*1.01, a, Zr+R*0.022);
        ell(p, R*0.038, i%2 ? '#991b1b' : '#0284c7', '#f59e0b', R*0.008);
        ell(p, R*0.012, '#fde047');
      }
    }
    // Crossed Golden Dragon-Head Prows crowning the stave peak
    const pk = P(0,0,Zt+R*0.14);
    cyl(R*0.11, Zt+R*0.12, R*0.055, '#451a03', '#f59e0b');
    [-1, 1].forEach(dir => {
      line(pk, [pk[0]+dir*R*0.11, pk[1]-R*0.08], '#f59e0b', R*0.022);
      ell([pk[0]+dir*R*0.12, pk[1]-R*0.085], R*0.022, '#dc2626', '#fde047', R*0.006);
    });
  }

  /* =====================================================================
   * VARIANT 12: BAVARIAN (Blue/White Spiral Maibaum Maypole & Wreath Canopy)
   * ===================================================================== */
  else if(theme === 'bavarian'){
    // Timber base + traditional Bavarian Blue-and-White Diagonal Spiral Maibaum (Maypole) Pillar!
    cyl(R*0.23, z0, R*0.05, '#78350f', '#f59e0b');
    const nSegs = 8;
    for(let s=0; s<nSegs; s++){
      const sz = zb + (zt-zb)*(s/nSegs), sh = (zt-zb)/nSegs + R*0.005;
      cyl(tr, sz, sh, s%2 ? '#2563eb' : '#f8fafc');
    }
    // Miniature golden guild plaques mounted on crossbars along the Maypole
    [0.38, 0.72].forEach((f, idx) => {
      const gz = zb + (zt-zb)*f;
      const pL = g(tr*1.65, -0.3, gz), pR = g(tr*1.65, 1.85, gz);
      line(pL, pR, '#78350f', R*0.014);
      ell(pL, R*0.028, '#f5c542', '#78350f', R*0.006);
      ell(pR, R*0.028, '#f5c542', '#78350f', R*0.006);
    });

    // Canopy: Lush Green Hopped Maypole Wreath Rim + Blue-and-White Bavarian Lozenge Canopy
    side(Rc, Zr, R*0.05, '#15803d');
    // Fluttering red, gold, blue & white Maypole ribbons hanging from the wreath rim
    for(let i=0;i<16;i++){
      const a = th*0.5 + i*TAU/16;
      if(Math.cos(a)+Math.sin(a) > -0.1){
        const p = g(Rc*1.01, a, Zr+R*0.01);
        ell(p, R*0.022, i%2 ? '#f59e0b' : '#ef4444', '#ffffff', R*0.005);
      }
    }
    drawConicalCanopy(Rc*1.02, Zt, Zt+R*0.13, 16, i => i%2 ? '#2563eb' : '#f8fafc', '#1d4ed8', i => i%2 ? '#f8fafc' : '#2563eb');
    // Copper Onion-Dome Crown & Golden Pretzel / Lion Finial
    const pk = P(0,0,Zt+R*0.13), sp = P(0,0,Zt+R*0.25);
    ell(P(0,0,Zt+R*0.16), R*0.075, '#0d9488', '#f59e0b', R*0.009);
    line(pk, sp, '#f59e0b', R*0.018);
    ell(sp, R*0.032, '#f59e0b', '#78350f', R*0.007);
  }

  // Pass B: Front half of swinging seats (drawn OVER the central pillar & canopy)
  seats.filter(s => s.key >= 0).sort((u,v) => u.key - v.key).forEach(drawSeat);
}
return drawChairSwing;
})();

const clawSkinPack = (() => {

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

/* ===== THE CLAW SKIN METADATA (UNTHEMED + 11 HEAVY/IMMERSIVE SKINS) ===== */
const CLAW_SKINS = {
  unthemed: {id:'unthemed', label:'Unthemed (Tier 0–2)', name:'Standard Gyro Claw',       sub:'Striped Steel A-Frame & 6-Talon Rotor',       hex:'#cbd5e1', border:'#38bdf8'},
  classic:  {id:'classic',  label:'Classic Midway',      name:'Midway Monster Claw',      sub:'KMG Fairground Starburst & Fiery Talons',     hex:'#cbb07c', border:'#e11d48'},
  jungle:   {id:'jungle',   label:'Jungle',              name:'Talon of Quetzalcoatl',    sub:'Mayan Stone Obelisks & Harpy Eagle Talons',   hex:'#587c48', border:'#2fbf9a'},
  western:  {id:'western',  label:'Wild West',           name:'Dynamite Mine Derrick',    sub:'Redwood Timber Derrick & Iron Grapple Hooks', hex:'#c99a62', border:'#b91c1c'},
  frontier: {id:'frontier', label:'Frontier',            name:'Grizzly Bear Paw',         sub:'Peeled Fir Log Frame & Giant Bear-Claw Hub',  hex:'#7d955d', border:'#566e42'},
  space:    {id:'space',    label:'Space',               name:'Cybernetic Mech Grapple',  sub:'Orbital Plasma Gantry & 6 Robotic Pincers',   hex:'#334155', border:'#0ea5e9'},
  gothic:   {id:'gothic',   label:'Gothic',              name:'Vampire Gargoyle Talon',   sub:'Cathedral Buttress & Skeletal Dragon Claws',  hex:'#3b3345', border:'#991b1b'},
  medieval: {id:'medieval', label:'Medieval',            name:'Siege Trebuchet Flail',    sub:'Oak Siege Timbers & Spiked Morning-Star',     hex:'#6c8c58', border:'#eab308'},
  alps:     {id:'alps',     label:'Alps',                name:'Glacier Ice-Axe Pendulum', sub:'Cable-Car Pylons & Crystalline Ice-Star',     hex:'#a8c5d6', border:'#0284c7'},
  fiesta:   {id:'fiesta',   label:'Fiesta',              name:'Aztec Sun Calendar Swing', sub:'Talavera Piers, Picado & Sun-Flame Talons',   hex:'#d99b52', border:'#e11d48'},
  nordic:   {id:'nordic',   label:'Nordic',              name:'Mjölnir Kraken Swing',     sub:'Runic Stave Frame & Curling Kraken Tentacles',hex:'#4d6b63', border:'#d97706'},
  bavarian: {id:'bavarian', label:'Bavarian',            name:'Glockenspiel Clockwork',   sub:'Lozenge Timber Frame & Brass Gearwheel Claw', hex:'#769958', border:'#2563eb'}
};

/* ===== SPRITE CODE: copy this block into engine.js ===== */
/**
 * drawClaw(ctx, cx, cy, R, opts)
 *  opts.accent        : Land / chain accent color (default '#38bdf8')
 *  opts.themeId       : 'classic'|'jungle'|'western'|'wildwest'|'frontier'|'space'|'gothic'|'medieval'|'alps'|'fiesta'|'nordic'|'bavarian'
 *  opts.rideThemeTier : 0..4 (<=2 draws Standard Unthemed; >=3 draws Heavy/Immersive Themed Skin)
 *  opts.t             : boom pendulum angle in radians (0 = hanging straight down, +-2.05 = high swing)
 *  opts.r             : 6-claw rotor spin angle in radians
 *  opts.flip          : true when called under horizontal mirror
 *  opts.tile          : draw the hex tile background (default true)
 */
function drawClaw(ctx, cx, cy, R, o={}){
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTheme = String(o.themeId || o.theme || 'unthemed').toLowerCase();
  if(rawTheme === 'wildwest' || rawTheme === 'wild_west') rawTheme = 'western';
  const theme = (tier <= 2 || !CLAW_SKINS[rawTheme]) ? 'unthemed' : rawTheme;
  const skin = CLAW_SKINS[theme] || CLAW_SKINS.unthemed;
  const accent = o.accent || skin.border || '#38bdf8';
  const ph = o.t == null ? 1.65 : o.t;
  const rot = o.r == null ? 0.5 : o.r;
  const fl = o.flip ? -1 : 1;

  // Center the base cleanly on the hex pad while leaving headroom for high swings
  const cyB = cy + R * 0.05;
  const P = (X,Y,Z) => [cx + (X - Y)*0.7, cyB + (X + Y)*0.35 - Z];
  const lerp = (a,b,t) => [a[0] + (b[0]-a[0])*t, a[1] + (b[1]-a[1])*t];
  const lerp3 = (A,B,t) => [A[0]+(B[0]-A[0])*t, A[1]+(B[1]-A[1])*t, A[2]+(B[2]-A[2])*t];
  const TAU = Math.PI * 2;

  const line = (a,b,c,w) => {
    ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
  };
  const poly = (pts,fill,stroke,lw) => {
    ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.01;ctx.lineJoin='round';ctx.stroke();}
  };
  const ell = (p,rx,ry,fill,stroke,lw) => {
    ctx.beginPath();ctx.ellipse(p[0],p[1],Math.max(0.5,rx),Math.max(0.5,ry),0,0,TAU);
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.01;ctx.stroke();}
  };

  // Structural dimensions matching KMG Freak Out / Afterburner proportions
  const Zp = R * 0.65;      // Overhead apex axle height
  const Lb = R * 0.50;      // Main pendulum boom length
  const Lcw = R * 0.135;    // Upper counterweight tail length above pivot
  const La = R * 0.255;     // 6-claw talon radial reach
  const ax = R * 0.30;      // Half-width between Back (-ax) and Front (+ax) A-frame pylons
  const leg = R * 0.33;     // Half-spread of A-frame legs along the swing axis (Y = +-leg)
  const z0 = R * 0.025;     // Compact footpad pier height

  // 1. Optional Hex Tile Base
  if(o.tile !== false){
    hexPath(ctx, cx, cy, R);
    ctx.fillStyle = theme === 'unthemed' ? '#cbd5e1' : skin.hex;
    ctx.fill();
    ctx.lineWidth = Math.max(2, R*0.055);
    ctx.strokeStyle = accent;
    ctx.stroke();
  }

  // Theme palette lookup for structure, striping, claw talons, and seats
  const PAL = {
    unthemed: {legBase:'#475569', s1:'#f8fafc', s2:accent,   trim:'#fde047', cw:'#ef4444', claw1:accent,    claw2:'#f8fafc', pod:'#1e293b', otsr:'#facc15', pad:'#64748b'},
    classic:  {legBase:'#7f1d1d', s1:'#fef08a', s2:'#e11d48', trim:'#f59e0b', cw:'#f59e0b', claw1:'#e11d48', claw2:'#facc15', pod:'#581c87', otsr:'#2dd4bf', pad:'#b91c1c'},
    jungle:   {legBase:'#595443', s1:'#bdb9a0', s2:'#8e8a72', trim:'#2fbf9a', cw:'#eab308', claw1:'#137a70', claw2:'#eab308', pod:'#78350f', otsr:'#fde047', pad:'#6e6a56'},
    western:  {legBase:'#451a03', s1:'#9a6a3c', s2:'#78350f', trim:'#f59e0b', cw:'#b91c1c', claw1:'#52525b', claw2:'#d97706', pod:'#78350f', otsr:'#ef4444', pad:'#78350f'},
    frontier: {legBase:'#3e2723', s1:'#8a5a33', s2:'#6b4a2b', trim:'#eab308', cw:'#2f5f3a', claw1:'#5a3b22', claw2:'#d9b27a', pod:'#4a3320', otsr:'#f97316', pad:'#6f747c'},
    space:    {legBase:'#0f172a', s1:'#f8fafc', s2:'#0284c7', trim:'#22d3ee', cw:'#a855f7', claw1:'#22d3ee', claw2:'#e2e8f0', pod:'#0f172a', otsr:'#22d3ee', pad:'#1e293b'},
    gothic:   {legBase:'#09090b', s1:'#27272a', s2:'#7f1d1d', trim:'#dc2626', cw:'#991b1b', claw1:'#18181b', claw2:'#dc2626', pod:'#450a0a', otsr:'#c084fc', pad:'#27272a'},
    medieval: {legBase:'#451a03', s1:'#78350f', s2:'#b91c1c', trim:'#f5c542', cw:'#64748b', claw1:'#475569', claw2:'#f5c542', pod:'#1e3a8a', otsr:'#fde047', pad:'#64748b'},
    alps:     {legBase:'#475569', s1:'#f8fafc', s2:'#dc2626', trim:'#38bdf8', cw:'#0284c7', claw1:'#bae6fd', claw2:'#0284c7', pod:'#b91c1c', otsr:'#f8fafc', pad:'#94a3b8'},
    fiesta:   {legBase:'#7c2d12', s1:'#f59e0b', s2:'#e11d48', trim:'#0d9488', cw:'#10b981', claw1:'#f59e0b', claw2:'#e11d48', pod:'#0d9488', otsr:'#fde047', pad:'#c2410c'},
    nordic:   {legBase:'#290f02', s1:'#451a03', s2:'#78350f', trim:'#f59e0b', cw:'#0284c7', claw1:'#0f766e', claw2:'#f59e0b', pod:'#451a03', otsr:'#38bdf8', pad:'#475569'},
    bavarian: {legBase:'#1e3a8a', s1:'#f8fafc', s2:'#2563eb', trim:'#f59e0b', cw:'#d97706', claw1:'#d97706', claw2:'#2563eb', pod:'#78350f', otsr:'#fde047', pad:'#64748b'}
  }[theme];

  // 2. Ground Features: Compact Central Loading Pad + 4 Individual Footpad Piers (NO Giant Rectangular Slab!)
  const pCenter = P(0, 0, 0);
  // Subtle circular boarding target pad directly under the resting claw at (0,0,0)
  ell(pCenter, R*0.23, R*0.115, 'rgba(15,23,42,0.22)', PAL.pad, R*0.008);
  ell(pCenter, R*0.18, R*0.09, PAL.pad, PAL.trim, R*0.007);
  ell(pCenter, R*0.10, R*0.05, shade(PAL.pad, -0.25));

  // Pendulum 3D kinematics: swings in the Y-Z plane
  const sp = Math.sin(ph), cp = Math.cos(ph);
  const bDir = [0, sp, -cp];                        // Unit vector along boom from pivot to claw hub
  const e2   = [0, cp,  sp];                        // Unit vector in rotor plane perpendicular to X
  const Hc   = [0, Lb*sp, Zp - Lb*cp];              // 3D Center of the 6-Claw Rotor Hub
  const CWc  = [0, -Lcw*sp, Zp + Lcw*cp];           // 3D Center of the Upper Counterweight Tail

  // Dynamic shadow cast on the ground directly below the swinging 6-claw hub
  const shY = Math.max(-R*0.48, Math.min(R*0.48, Hc[1]));
  const gs = P(0, shY, 0);
  ell([gs[0]+fl*R*0.04, gs[1]+R*0.015], R*0.22, R*0.10, 'rgba(15,23,42,0.28)');

  // Helper to draw a compact 3D footpad pier at (X, Y, 0)
  const drawFootPier = (X, Y) => {
    const fp = P(X, Y, 0), ft = P(X, Y, z0);
    ell([fp[0]+fl*R*0.02, fp[1]+R*0.01], R*0.095, R*0.048, 'rgba(15,23,42,0.28)');
    ell(fp, R*0.088, R*0.044, shade(PAL.pad, -0.3), PAL.legBase, R*0.008);
    ctx.fillStyle = PAL.pad;
    ctx.fillRect(fp[0]-R*0.088, ft[1], R*0.176, fp[1]-ft[1]);
    ell(ft, R*0.088, R*0.044, shade(PAL.pad, 0.15), PAL.trim, R*0.008);
  };

  // Helper to draw a themed A-frame pylon at X0 (-ax = back pylon, +ax = front pylon)
  const drawAFramePylon = (X0, isFront) => {
    // Top apex is slightly narrower in X than the base for a realistic inward-leaning A-frame stance
    const topX = X0 * 0.80;
    const top = P(topX, 0, Zp);
    const f0  = P(X0, -leg, z0);
    const f1  = P(X0,  leg, z0);

    // 1. Draw the two compact footpad piers first
    drawFootPier(X0, -leg);
    drawFootPier(X0,  leg);

    // 2. Horizontal tie-bar & themed portal bracing between the two legs (at 30% height)
    const m0 = lerp(f0, top, 0.30), m1 = lerp(f1, top, 0.30);
    line(m0, m1, PAL.legBase, R*0.028);
    line(m0, m1, PAL.trim, R*0.012);

    // Theme-specific cross-bracing between the legs
    if(theme === 'western' || theme === 'frontier' || theme === 'medieval'){
      // Heavy timber/iron X-bracing between legs
      const u0 = lerp(f0, top, 0.56), u1 = lerp(f1, top, 0.56);
      line(m0, u1, PAL.s2, R*0.016);
      line(m1, u0, PAL.s2, R*0.016);
      line(u0, u1, PAL.legBase, R*0.022);
    } else if(theme === 'fiesta'){
      // Papel picado festive flags strung between the legs
      const pCols = ['#e11d48','#10b981','#f59e0b','#3b82f6','#ec4899'];
      for(let k=1;k<=5;k++){
        const q = k/6, pt = lerp(m0, m1, q);
        poly([[pt[0]-R*0.016,pt[1]],[pt[0]+R*0.016,pt[1]],[pt[0],pt[1]+R*0.036]], pCols[k%5]);
      }
    } else if(theme === 'gothic'){
      // Pointed gothic lancet arch tracery under the tie-bar
      const archMid = [(m0[0]+m1[0])/2, (m0[1]+m1[1])/2 - R*0.06];
      line(m0, archMid, '#7f1d1d', R*0.015);
      line(m1, archMid, '#7f1d1d', R*0.015);
    }

    // 3. Draw the two main splayed A-frame legs with carnival striping / theme texture
    [f0, f1].forEach((f, legIdx) => {
      // Base structural shadow / outline
      line(f, top, PAL.legBase, R*0.068);
      // Segmented fairground color bands along each leg (like the KMG photo!)
      const nSeg = 7;
      for(let s=0; s<nSeg; s++){
        const a = lerp(f, top, s/nSeg + 0.01), b = lerp(f, top, (s+0.88)/nSeg);
        const col = (s % 2 === 0) ? PAL.s1 : PAL.s2;
        line(a, b, col, R*0.048);
      }
      // 3D specular edge highlight & chasing light dots along the front pylon legs
      line([f[0]-R*0.01, f[1]], [top[0]-R*0.01, top[1]], 'rgba(255,255,255,0.28)', R*0.012);
      if(isFront && (theme==='classic' || theme==='unthemed' || theme==='space' || theme==='fiesta')){
        for(let d=1; d<=6; d++){
          const lp = lerp(f, top, d/7);
          ell(lp, R*0.009, R*0.009, d%2 ? '#fff3b0' : PAL.trim);
        }
      }
      // Theme-specific leg embellishments (vines on Jungle, shields on Nordic, stone rings on Gothic)
      if(theme === 'jungle'){
        [0.35, 0.65].forEach(t => {
          const vp = lerp(f, top, t);
          ell(vp, R*0.026, R*0.016, '#15803d', '#4ade80', R*0.005);
        });
      } else if(theme === 'nordic' && isFront){
        [0.35, 0.65].forEach((t, idx) => {
          const sp = lerp(f, top, t);
          ell(sp, R*0.026, R*0.026, idx%2 ? '#991b1b' : '#0284c7', '#f59e0b', R*0.006);
        });
      }
    });

    // 4. Mid-Frame Diamond / Medallion Sign on the tie-bar (matching the reference photo's lower diamond signs)
    const mid = lerp(m0, m1, 0.5);
    if(isFront){
      poly([
        [mid[0], mid[1]-R*0.048],
        [mid[0]+R*0.042, mid[1]],
        [mid[0], mid[1]+R*0.048],
        [mid[0]-R*0.042, mid[1]]
      ], PAL.s2, PAL.trim, R*0.01);
      ell(mid, R*0.016, R*0.016, PAL.s1);
    }

    // 5. Apex Pivot Housing & Bespoke Themed Apex Shield / Crest!
    if(!isFront){
      // Back pylon apex bearing cap
      ell(top, R*0.055, R*0.055, PAL.legBase, PAL.trim, R*0.01);
      ell(top, R*0.028, R*0.028, PAL.s2);
    } else {
      drawApexCrest(top, R, theme, accent, PAL, rot);
    }
  };

  // Bespoke Apex Crest / Starburst Shield on the front pylon top (like the yellow/red starburst in the photo)
  function drawApexCrest(top, R, theme, accent, PAL, rot){
    const tx = top[0], ty = top[1];
    if(theme === 'classic' || theme === 'unthemed'){
      // Iconic KMG 12-Point Scalloped Starburst Shield ("THE CLAW")
      const pts = [];
      const nPts = 16;
      for(let i=0; i<nPts; i++){
        const a = i * TAU / nPts;
        const rad = (i % 2 === 0) ? R*0.092 : R*0.068;
        pts.push([tx + Math.cos(a)*rad*0.88, ty + Math.sin(a)*rad*1.05]);
      }
      poly(pts, theme==='classic' ? '#facc15' : accent, '#ef4444', R*0.014);
      ell([tx, ty-R*0.01], R*0.052, R*0.032, '#ef4444', '#fff3b0', R*0.007);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold ' + Math.round(R*0.034) + 'px Arial Black, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('CLAW', tx, ty);
    }
    else if(theme === 'jungle'){
      // Golden Mayan Sun-God Mask & Emerald Plumes
      for(let k=-2; k<=2; k++){
        const a = -Math.PI/2 + k*0.32;
        line([tx,ty], [tx+Math.cos(a)*R*0.10, ty+Math.sin(a)*R*0.10], '#10b981', R*0.022);
      }
      ell([tx, ty], R*0.068, R*0.068, '#eab308', '#78350f', R*0.01);
      ell([tx-R*0.022, ty-R*0.01], R*0.012, R*0.012, '#2fbf9a');
      ell([tx+R*0.022, ty-R*0.01], R*0.012, R*0.012, '#2fbf9a');
      poly([[tx-R*0.025,ty+R*0.02],[tx+R*0.025,ty+R*0.02],[tx,ty+R*0.045]], '#dc2626');
    }
    else if(theme === 'western'){
      // Iron Bull-Wheel Gear & Golden Sheriff Star Crest
      ell([tx, ty], R*0.075, R*0.075, '#451a03', '#d97706', R*0.014);
      for(let k=0;k<6;k++){
        const a = k*Math.PI/3;
        line([tx,ty], [tx+Math.cos(a)*R*0.07, ty+Math.sin(a)*R*0.07], '#9a3412', R*0.012);
      }
      ell([tx, ty], R*0.035, R*0.035, '#facc15', '#78350f', R*0.008);
    }
    else if(theme === 'frontier'){
      // Carved Grizzly Bear Totem Head & Pine Boughs
      ell([tx-R*0.045, ty-R*0.045], R*0.024, R*0.024, '#5a3b22', '#d9b27a', R*0.006);
      ell([tx+R*0.045, ty-R*0.045], R*0.024, R*0.024, '#5a3b22', '#d9b27a', R*0.006);
      ell([tx, ty], R*0.065, R*0.058, '#6b4a2b', '#eab308', R*0.01);
      ell([tx, ty+R*0.015], R*0.032, R*0.024, '#d9b27a');
      ell([tx, ty+R*0.008], R*0.012, R*0.010, '#18181b');
    }
    else if(theme === 'space'){
      // Pulsing Neon Cyan & Magenta Plasma Reactor Core
      ell([tx, ty], R*0.082, R*0.082, '#0f172a', '#22d3ee', R*0.012);
      ell([tx, ty], R*0.055, R*0.055, '#0284c7', '#e879f9', R*0.009);
      ell([tx, ty], R*0.028, R*0.028, '#22d3ee');
    }
    else if(theme === 'gothic'){
      // Bat-Wing Gargoyle & Blood-Crimson Rose Window
      poly([[tx,ty],[tx-R*0.11,ty-R*0.05],[tx-R*0.08,ty+R*0.03]], '#18181b', '#dc2626', R*0.008);
      poly([[tx,ty],[tx+R*0.11,ty-R*0.05],[tx+R*0.08,ty+R*0.03]], '#18181b', '#dc2626', R*0.008);
      ell([tx, ty], R*0.062, R*0.062, '#450a0a', '#a1a1aa', R*0.01);
      ell([tx, ty], R*0.032, R*0.032, '#dc2626', '#fde047', R*0.006);
    }
    else if(theme === 'medieval'){
      // Royal Heraldic Shield & Golden Crown
      poly([
        [tx-R*0.06, ty-R*0.055],
        [tx+R*0.06, ty-R*0.055],
        [tx+R*0.055, ty+R*0.02],
        [tx, ty+R*0.08],
        [tx-R*0.055, ty+R*0.02]
      ], '#b91c1c', '#f5c542', R*0.012);
      poly([[tx-R*0.045,ty-R*0.055],[tx-R*0.03,ty-R*0.09],[tx,ty-R*0.065],[tx+R*0.03,ty-R*0.09],[tx+R*0.045,ty-R*0.055]], '#f5c542');
      ell([tx, ty], R*0.024, R*0.024, '#f5c542');
    }
    else if(theme === 'alps'){
      // Alpine Edelweiss Star & Brass Cowbell Crest
      ell([tx, ty], R*0.068, R*0.068, '#dc2626', '#f8fafc', R*0.012);
      for(let k=0;k<6;k++){
        const a = k*Math.PI/3;
        ell([tx+Math.cos(a)*R*0.028, ty+Math.sin(a)*R*0.028], R*0.014, R*0.014, '#f8fafc');
      }
      ell([tx, ty], R*0.016, R*0.016, '#facc15');
    }
    else if(theme === 'fiesta'){
      // Radiant Golden Aztec Sun Medallion
      for(let k=0;k<12;k++){
        const a = k*TAU/12;
        poly([
          [tx+Math.cos(a-0.15)*R*0.05, ty+Math.sin(a-0.15)*R*0.05],
          [tx+Math.cos(a)*R*0.095, ty+Math.sin(a)*R*0.095],
          [tx+Math.cos(a+0.15)*R*0.05, ty+Math.sin(a+0.15)*R*0.05]
        ], k%2 ? '#f59e0b' : '#e11d48');
      }
      ell([tx, ty], R*0.055, R*0.055, '#fde047', '#0d9488', R*0.01);
    }
    else if(theme === 'nordic'){
      // Horned Viking Helm & Glowing Rune Boss
      line([tx-R*0.04,ty-R*0.02], [tx-R*0.095,ty-R*0.075], '#fef3c7', R*0.022);
      line([tx+R*0.04,ty-R*0.02], [tx+R*0.095,ty-R*0.075], '#fef3c7', R*0.022);
      ell([tx, ty], R*0.065, R*0.065, '#451a03', '#f59e0b', R*0.012);
      ell([tx, ty], R*0.028, R*0.028, '#38bdf8');
    }
    else if(theme === 'bavarian'){
      // Ornate Glockenspiel Clock Face & Bavarian Lozenge Shield
      ell([tx, ty], R*0.072, R*0.072, '#2563eb', '#f59e0b', R*0.012);
      ell([tx, ty], R*0.050, R*0.050, '#ffffff', '#1e3a8a', R*0.007);
      line([tx,ty], [tx+Math.cos(rot)*R*0.035, ty+Math.sin(rot)*R*0.035], '#1e293b', R*0.008);
      line([tx,ty], [tx, ty-R*0.038], '#dc2626', R*0.008);
    }
  }

  // ===== PASS 1: DRAW BACK A-FRAME PYLON (-ax) & OVERHEAD AXLE BEAM =====
  drawAFramePylon(-ax, false);

  // Heavy Overhead Cross-Axle Beam connecting Back Pylon (-ax*0.8) to Front Pylon (+ax*0.8)
  const axBack = P(-ax*0.80, 0, Zp), axFront = P(ax*0.80, 0, Zp);
  line(axBack, axFront, PAL.legBase, R*0.068);
  line(axBack, axFront, PAL.s1, R*0.038);

  // ===== PASS 2: COUNTERWEIGHTED PENDULUM BOOM & 6-CLAW TALON ROTOR =====
  const A0 = P(0, 0, Zp);
  const H  = P(Hc[0], Hc[1], Hc[2]);
  const CW = P(CWc[0], CWc[1], CWc[2]);

  // 2A. Upper Counterweight Arm & Heavy Counterweight Drum above the pivot (just like real KMG Freak Out!)
  line(A0, CW, PAL.legBase, R*0.065);
  line(A0, CW, PAL.s2, R*0.042);
  ell(CW, R*0.058, R*0.042, PAL.cw, PAL.trim, R*0.01);

  // 2B. Main Pendulum Boom (from Pivot A0 to Rotor Hub H) with candy-striped fairground bands
  line(A0, H, PAL.legBase, R*0.095);
  const nBoom = 8;
  for(let i=0; i<nBoom; i++){
    const a = lerp(A0, H, i/nBoom), b = lerp(A0, H, (i+0.85)/nBoom);
    line(a, b, (i % 2 === 0) ? PAL.s1 : PAL.s2, R*0.068);
  }
  // Specular highlight along boom
  line(A0, H, 'rgba(255,255,255,0.25)', R*0.015);

  // 2C. 6-Claw Angled Talon Rotor + 6 Floorless Gondolas + Riders with OTSR Harnesses & Dangling Legs
  // Notice how on the real KMG Claw photo, the 6 claw arms flare outward from the hub like a 3D talon crown
  // toward the riders! We model each talon with a mid-knuckle bend in 3D before reaching the gondola.
  const N_CLAWS = 6;
  const clawItems = [];
  const shirtCols = ['#ef4444','#38bdf8','#22c55e','#facc15','#ec4899','#a855f7'];

  for(let k=0; k<N_CLAWS; k++){
    const a = rot + k * TAU / N_CLAWS;
    // Radial unit vector in the rotor plane & tangent unit vector
    const rVec  = [Math.cos(a),  Math.sin(a)*e2[1],  Math.sin(a)*e2[2]];
    const tgVec = [-Math.sin(a), Math.cos(a)*e2[1],  Math.cos(a)*e2[2]];

    // 3D Knuckle point (flares outward + slightly up the boom, then hooks down to the gondola E)
    const K3 = [
      Hc[0] + rVec[0]*La*0.62 - bDir[0]*R*0.055,
      Hc[1] + rVec[1]*La*0.62 - bDir[1]*R*0.055,
      Hc[2] + rVec[2]*La*0.62 - bDir[2]*R*0.055
    ];
    // 3D Gondola attachment point E (curves forward in bDir like a grasping claw!)
    const E3 = [
      Hc[0] + rVec[0]*La + bDir[0]*R*0.055,
      Hc[1] + rVec[1]*La + bDir[1]*R*0.055,
      Hc[2] + rVec[2]*La + bDir[2]*R*0.055
    ];

    const depthKey = E3[0] + E3[1] + E3[2]*0.65;

    clawItems.push({
      key: depthKey,
      draw: () => {
        const pK = P(K3[0], K3[1], K3[2]);
        const pE = P(E3[0], E3[1], E3[2]);

        // 1. Curved 2-Segment 3D Talon Arm (Hub H -> Knuckle pK -> Gondola pE)
        line(H, pK, PAL.legBase, R*0.052);
        line(H, pK, (k%2===0) ? PAL.claw1 : PAL.claw2, R*0.034);
        line(pK, pE, PAL.legBase, R*0.040);
        line(pK, pE, (k%2===0) ? PAL.claw2 : PAL.claw1, R*0.024);
        // Knuckle joint cap / spike
        ell(pK, R*0.020, R*0.020, PAL.trim, PAL.legBase, R*0.005);

        // 2. Suspended 4-Seat Floorless Gondola Bar oriented along tangent tgVec
        const halfW = R * 0.082;
        const g0 = P(E3[0] - tgVec[0]*halfW, E3[1] - tgVec[1]*halfW, E3[2] - tgVec[2]*halfW);
        const g1 = P(E3[0] + tgVec[0]*halfW, E3[1] + tgVec[1]*halfW, E3[2] + tgVec[2]*halfW);

        // Overhead gondola steel frame & seat backs
        line(g0, g1, PAL.legBase, R*0.072);
        line(g0, g1, PAL.pod, R*0.052);
        line([g0[0],g0[1]-R*0.015], [g1[0],g1[1]-R*0.015], PAL.trim, R*0.016);

        // 3. 3 Riders per Gondola with Dangling Legs & Over-The-Shoulder Restraints (OTSR)
        [-0.65, 0, 0.65].forEach((sOff, rIdx) => {
          const rx = E3[0] + tgVec[0]*halfW*sOff + rVec[0]*R*0.02;
          const ry = E3[1] + tgVec[1]*halfW*sOff + rVec[1]*R*0.02;
          const rz = E3[2] + tgVec[2]*halfW*sOff + rVec[2]*R*0.02;
          const seatP = P(rx, ry, rz);

          // Dangling legs below the floorless seat!
          const legEnd = P(rx + bDir[0]*R*0.045, ry + bDir[1]*R*0.045, rz + bDir[2]*R*0.045 - R*0.025);
          line([seatP[0]-R*0.008, seatP[1]+R*0.01], [legEnd[0]-R*0.008, legEnd[1]], '#1e293b', R*0.011);
          line([seatP[0]+R*0.008, seatP[1]+R*0.01], [legEnd[0]+R*0.008, legEnd[1]], '#1e293b', R*0.011);

          // Rider torso
          ell(seatP, R*0.022, R*0.024, shirtCols[(k + rIdx) % 6]);
          // Over-The-Shoulder Harness (bright U-collar over torso)
          line([seatP[0]-R*0.012, seatP[1]-R*0.014], [seatP[0]-R*0.008, seatP[1]+R*0.008], PAL.otsr, R*0.008);
          line([seatP[0]+R*0.012, seatP[1]-R*0.014], [seatP[0]+R*0.008, seatP[1]+R*0.008], PAL.otsr, R*0.008);
          // Rider head
          ell([seatP[0], seatP[1]-R*0.026], R*0.015, R*0.015, '#fde4c8');
        });
      }
    });
  }

  // Draw back-half claw talons & gondolas, then the central rotor hub dome, then front-half claw talons
  clawItems.sort((u,v) => u.key - v.key);
  clawItems.filter(it => it.key < Hc[0]+Hc[1]+Hc[2]*0.65).forEach(it => it.draw());

  // Central Sculpted 6-Claw Rotor Hub Cap
  ell(H, R*0.062, R*0.062, PAL.legBase, PAL.trim, R*0.012);
  ell(H, R*0.040, R*0.040, PAL.claw1);
  ell([H[0]-R*0.014, H[1]-R*0.014], R*0.016, R*0.016, PAL.s1);

  clawItems.filter(it => it.key >= Hc[0]+Hc[1]+Hc[2]*0.65).forEach(it => it.draw());

  // ===== PASS 3: DRAW FRONT A-FRAME PYLON (+ax) & FRONT APEX SHIELD =====
  drawAFramePylon(ax, true);
}
return drawClaw;
})();

const scramblerSkinPack = (() => {

/* ===== SHARED COLOR & ISOMETRICFLAT RIDE CORE (FR) ===== */
function shade(hex,amt){
  if(!hex||hex[0]!=='#')return hex||'#888';
  const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;
  const f=c=>Math.max(0,Math.min(255,Math.round(amt<0?c*(1+amt):c+(255-c)*amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

const FR={
  proj(cx,cy,S){return(X,Y,Z)=>[cx+(X-Y)*0.7*S,cy+(X+Y)*0.35*S-Z*S];},
  poly(g,pts,fill,stroke,lw){
    g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();
    if(fill){g.fillStyle=fill;g.fill();g.strokeStyle=fill;g.lineWidth=0.55;g.stroke();}
    if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();}
  },
  ell(g,x,y,rx,ry,fill,stroke,lw){
    g.beginPath();g.ellipse(x,y,Math.max(0.1,rx),Math.max(0.1,ry),0,0,7);
    if(fill){g.fillStyle=fill;g.fill();}
    if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();}
  },
  ln(g,a,b,col,w){g.strokeStyle=col;g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();},
  rbox(g,Pj,x0,y0,z0,l,w,h,psi,col,o){
    o=o||{};const c=Math.cos(psi),s=Math.sin(psi),
    pts=[[-l/2,-w/2],[l/2,-w/2],[l/2,w/2],[-l/2,w/2]].map(([a,b])=>[x0+a*c-b*s,y0+a*s+b*c]),faces=[];
    for(let i=0;i<4;i++){
      const A=pts[i],B=pts[(i+1)%4],dx=B[0]-A[0],dy=B[1]-A[1],m=Math.hypot(dx,dy)||1,nx=dy/m,ny=-dx/m;
      if(nx+ny>0.01)faces.push({A,B,nx,ny,d:(A[0]+B[0]+A[1]+B[1])/2});
    }
    faces.sort((p,q)=>p.d-q.d).forEach(f=>{
      const amt=Math.max(-0.48,Math.min(0.28,-0.12+0.14*f.ny-0.22*f.nx));
      FR.poly(g,[Pj(f.A[0],f.A[1],z0),Pj(f.B[0],f.B[1],z0),Pj(f.B[0],f.B[1],z0+h),Pj(f.A[0],f.A[1],z0+h)],shade(col,amt),o.stroke,o.lw);
    });
    if(!o.noTop)FR.poly(g,pts.map(p=>Pj(p[0],p[1],z0+h)),o.top||shade(col,0.16),o.stroke,o.lw);
  },
  hex(g,cx,cy,R,fill,stroke){
    g.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);g[i?'lineTo':'moveTo'](cx+R*Math.cos(a),cy+R*Math.sin(a)*0.58);}
    g.closePath();g.fillStyle=fill;g.fill();g.lineWidth=Math.max(1.5,R*0.028);g.strokeStyle=stroke;g.stroke();
  },
  layers(key,R,Wf,Hf,oyf,draw){
    FR._c=FR._c||{};
    const sc=getBakeScale(),cacheKey=[key,Math.round(R*sc),sc].join('|');
    if(FR._c[cacheKey])return FR._c[cacheKey];
    const W=Math.ceil(Wf*R),H=Math.ceil(Hf*R),oy=oyf*R,S=R*0.066,res={w:W,h:H,ox:W/2,oy};
    ['back','front','still'].forEach(p=>{
      const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);
      const g=cv.getContext('2d');g.scale(sc,sc);const Pj=FR.proj(W/2,oy,S);
      if(p==='still'){draw(g,Pj,S,'back');draw(g,Pj,S,'live',0.35);draw(g,Pj,S,'front');}
      else draw(g,Pj,S,p,0);
      res[p]=cv;
    });
    return FR._c[cacheKey]=res;
  },
  render(ctx,cx,cy,R,key,Wf,Hf,oyf,draw,t){
    const L=FR.layers(key,R,Wf,Hf,oyf,draw);
    if(t==null){ctx.drawImage(L.still,cx-L.ox,cy-L.oy,L.w,L.h);return;}
    const S=R*0.066,Pj=FR.proj(cx,cy,S),bl=n=>ctx.drawImage(L[n],cx-L.ox,cy-L.oy,L.w,L.h);
    bl('back');draw(ctx,Pj,S,'live',t);bl('front');
  },
  atlas(S,w,h,ox,oy,n,fn){
    const sc=getBakeScale(),cache={};
    return function(i,psi){
      const k=Math.round((((psi%6.2832)+6.2832)%6.2832)/6.2832*n)%n,key=[i*1000+k,Math.round(S*sc)].join('|');
      let e=cache[key];
      if(!e){
        const cv=document.createElement('canvas');cv.width=Math.ceil(w*sc);cv.height=Math.ceil(h*sc);
        const g=cv.getContext('2d');g.scale(sc,sc);fn(g,FR.proj(ox,oy,S),i,k/n*6.2832);
        e=cache[key]={cv,w,h,ox,oy};
      }
      return e;
    };
  }
};
FR._d={};

/* ===== SCRAMBLER THEME DEFINITIONS (UNTHEMED + 11 HEAVY/IMMERSIVE SKINS) ===== */
const SCRAMBLER_SKINS = {
  unthemed: {
    id:'unthemed', label:'Unthemed (Tier 0–2)', rideName:'Standard Scrambler', sub:'None / Light / Medium Tier',
    hexFill:'#7a8b68', hexBorder:'#5a6b4c',
    padOuter:'#64748b', padInner:'#94a3b8', padRim:'#475569',
    sweepCol:'#e2e8f0', sweepTrim:'#3b82f6', spiderCol:'#cbd5e1',
    carCols:['#ef4444','#3b82f6','#eab308']
  },
  classic: {
    id:'classic', label:'Classic Midway', rideName:'Starlight Sizzler', sub:'1950s Neon Atomic Midway',
    hexFill:'#cbb07c', hexBorder:'#a07f48',
    padOuter:'#d9342b', padInner:'#1e1b4b', padRim:'#f5c542',
    sweepCol:'#fff3b0', sweepTrim:'#ef4444', spiderCol:'#f5c542',
    carCols:['#ef4444','#2fb5a8','#f59e0b']
  },
  jungle: {
    id:'jungle', label:'Jungle', rideName:'Temple Jaguar Vortex', sub:'Mesoamerican Idol & Totem',
    hexFill:'#587c48', hexBorder:'#35552c',
    padOuter:'#8e8a72', padInner:'#6e6a56', padRim:'#2fbf9a',
    sweepCol:'#7a5836', sweepTrim:'#2fbf9a', spiderCol:'#b5532f',
    carCols:['#b5532f','#2fbf9a','#d97706']
  },
  western: {
    id:'western', label:'Wild West', rideName:'Sidewinder Stampede', sub:'Dynamite Mill & Bucking Carts',
    hexFill:'#c99a62', hexBorder:'#8a5a33',
    padOuter:'#7a4d2b', padInner:'#a8784a', padRim:'#5a3b22',
    sweepCol:'#8a5a33', sweepTrim:'#b3342f', spiderCol:'#5a3b22',
    carCols:['#9a3412','#b45309','#78350f']
  },
  frontier: {
    id:'frontier', label:'Frontier', rideName:'Sawmill Whirlwind', sub:'Timber Truss & Birch Canoes',
    hexFill:'#7d955d', hexBorder:'#566e42',
    padOuter:'#6b4a2b', padInner:'#526845', padRim:'#8a5a33',
    sweepCol:'#9a6a3c', sweepTrim:'#3d7348', spiderCol:'#6b4a2b',
    carCols:['#c98f4a','#b3342f','#2f5f3a']
  },
  space: {
    id:'space', label:'Space', rideName:'Centrifuge X-9', sub:'Plasma Core & Orbital Pods',
    hexFill:'#334155', hexBorder:'#0ea5e9',
    padOuter:'#0f172a', padInner:'#1e293b', padRim:'#38bdf8',
    sweepCol:'#e2e8f0', sweepTrim:'#06b6d4', spiderCol:'#38bdf8',
    carCols:['#0284c7','#6366f1','#0d9488']
  },
  gothic: {
    id:'gothic', label:'Gothic', rideName:"Widow's Web", sub:'Crypt Obelisk & Hearse Carriages',
    hexFill:'#3b3345', hexBorder:'#1e1826',
    padOuter:'#1c1924', padInner:'#2d2638', padRim:'#991b1b',
    sweepCol:'#27272a', sweepTrim:'#dc2626', spiderCol:'#3f3f46',
    carCols:['#450a0a','#3b0764','#18181b']
  },
  medieval: {
    id:'medieval', label:'Medieval', rideName:'Jousting Maelstrom', sub:'Royal Pavilion & War Chariots',
    hexFill:'#6c8c58', hexBorder:'#486339',
    padOuter:'#94a3b8', padInner:'#64748b', padRim:'#eab308',
    sweepCol:'#f5c542', sweepTrim:'#1d4ed8', spiderCol:'#b91c1c',
    carCols:['#b91c1c','#1d4ed8','#7e22ce']
  },
  alps: {
    id:'alps', label:'Alps', rideName:'Glacier Avalanche', sub:'Ice Spire & Swiss Toboggans',
    hexFill:'#a8c5d6', hexBorder:'#6488a0',
    padOuter:'#e0f2fe', padInner:'#7dd3fc', padRim:'#0284c7',
    sweepCol:'#f8fafc', sweepTrim:'#38bdf8', spiderCol:'#bae6fd',
    carCols:['#dc2626','#0284c7','#16a34a']
  },
  fiesta: {
    id:'fiesta', label:'Fiesta', rideName:'Mariachi Maraca Spin', sub:'Talavera Plaza & Sombrero Crown',
    hexFill:'#d99b52', hexBorder:'#a66928',
    padOuter:'#e11d48', padInner:'#fef3c7', padRim:'#0d9488',
    sweepCol:'#f59e0b', sweepTrim:'#ec4899', spiderCol:'#10b981',
    carCols:['#e11d48','#0d9488','#d97706']
  },
  nordic: {
    id:'nordic', label:'Nordic', rideName:'Maelstrom of Jörmungandr', sub:'Stave Dragon & Longship Pods',
    hexFill:'#4d6b63', hexBorder:'#2d423d',
    padOuter:'#475569', padInner:'#2c4a52', padRim:'#d97706',
    sweepCol:'#78350f', sweepTrim:'#f59e0b', spiderCol:'#92400e',
    carCols:['#78350f','#7f1d1d','#1e3a8a']
  },
  bavarian: {
    id:'bavarian', label:'Bavarian', rideName:'Oktoberfest Bier-Wirbel', sub:'Maibaum Crown & Oak Beer Barrels',
    hexFill:'#769958', hexBorder:'#4d6b35',
    padOuter:'#8a5a33', padInner:'#f8fafc', padRim:'#1d4ed8',
    sweepCol:'#f8fafc', sweepTrim:'#2563eb', spiderCol:'#d97706',
    carCols:['#92400e','#78350f','#a16207']
  }
};

/* ===== SCRAMBLER PLANETARY KINEMATICS =====
 * Real Eli Bridge Scrambler geometry:
 * 3 primary sweep arms at 120 deg (R1 = 3.55) rotate clockwise (-w1).
 * 3 secondary 3-arm spider hubs at the ends of the primary arms rotate counter-clockwise (+w2),
 * carrying 9 tubs at radius R2 = 1.92 that interleave through the center without colliding.
 */
const SC_CFG = { R1: 3.55, R2: 1.92, zArm1: 2.38, zArm2: 1.88, zCar: 0.45 };

function scState(t){
  const w1 = -1.15 * t;
  const w2 =  2.65 * t; // opposite rotation creates the signature Scrambler whip
  const hubs = [], cars = [];
  for(let h=0; h<3; h++){
    const a1 = w1 + h * 2.094395; // 120 deg apart
    const hx = SC_CFG.R1 * Math.cos(a1);
    const hy = SC_CFG.R1 * Math.sin(a1);
    hubs.push({h, a1, hx, hy, d: hx + hy});
    for(let c=0; c<3; c++){
      const a2 = a1 + w2 + c * 2.094395 + h * 0.6981; // phase offset prevents inter-hub collisions
      const cx = hx + SC_CFG.R2 * Math.cos(a2);
      const cy = hy + SC_CFG.R2 * Math.sin(a2);
      // Tangent heading of the tub
      const vx = -SC_CFG.R1*1.15*Math.sin(a1) + SC_CFG.R2*1.5*Math.sin(a2);
      const vy =  SC_CFG.R1*1.15*Math.cos(a1) - SC_CFG.R2*1.5*Math.cos(a2);
      const psi = Math.atan2(vy, vx);
      cars.push({id: h*3+c, h, c, hx, hy, X: cx, Y: cy, psi, d: cx + cy});
    }
  }
  return {hubs, cars, w1, w2};
}

/* ===== THEMED TUB / GONDOLA DRAWER (Pre-baked across 48 angles via FR.atlas) ===== */
function drawScramblerTub(g, Pj, S, themeId, colorIdx, psi){
  const skin = SCRAMBLER_SKINS[themeId] || SCRAMBLER_SKINS.unthemed;
  const body = skin.carCols[colorIdx % 3];
  const Z = 0.08;
  const c = Math.cos(psi), s = Math.sin(psi);
  const L = (a,b) => [a*c - b*s, a*s + b*c];
  const part = (a,b,z,l,w,h,col,o)=>{const p=L(a,b); FR.rbox(g,Pj,p[0],p[1],Z+z,l,w,h,psi,col,o);};

  // Helper to draw two riders sitting side-by-side inside the tub
  const drawRiders = (zOff, shirt1, shirt2, hatCol)=>{
    [[-0.18,-0.22,shirt1],[-0.18,0.22,shirt2]].forEach(([a,b,sh],i)=>{
      const p = L(a,b), q = Pj(p[0],p[1],Z+zOff), hd = Pj(p[0],p[1],Z+zOff+0.36);
      FR.ell(g, q[0], q[1], S*0.21, S*0.24, sh);
      FR.ell(g, hd[0], hd[1], S*0.16, S*0.16, i?'#fde4c8':'#e8b890');
      if(hatCol) FR.ell(g, hd[0], hd[1]-S*0.11, S*0.19, S*0.08, hatCol);
    });
    // Lap bar
    const lbA = L(0.18,-0.42), lbB = L(0.18,0.42);
    FR.ln(g, Pj(lbA[0],lbA[1],Z+zOff+0.12), Pj(lbB[0],lbB[1],Z+zOff+0.12), '#cbd5e1', S*0.07);
  };

  if(themeId === 'unthemed'){
    // Standard unpainted steel hanger + simple fiberglass carnival tub
    part(0,0,0.05, 1.55,1.02,0.14, '#334155');
    part(0,0,0.18, 1.45,0.96,0.46, body);
    part(0.55,0,0.64, 0.35,0.88,0.12, '#e2e8f0');
    drawRiders(0.68, '#38bdf8', '#facc15', null);
  }
  else if(themeId === 'classic'){
    // 1950s Chrome & Candy-Red Streamlined Finned Cruiser Tub
    part(0,0,0.05, 1.75,1.08,0.15, '#e2e8f0');
    part(0,0,0.20, 1.62,1.00,0.48, body, {top:'#fef3c7'});
    // Twin 1950s tailfins at rear (-a)
    part(-0.62,-0.44,0.65, 0.55,0.12,0.32, '#f5c542');
    part(-0.62, 0.44,0.65, 0.55,0.12,0.32, '#f5c542');
    // Chrome nose headlight
    const np=L(0.84,0), nq=Pj(np[0],np[1],Z+0.45);
    FR.ell(g, nq[0], nq[1], S*0.14, S*0.12, '#fff3b0');
    drawRiders(0.70, '#ef4444', '#3b82f6', null);
  }
  else if(themeId === 'jungle'){
    // Carved Temple Idol / Ceremonial Canoe Pod with Jade Eyes & Gold Trim
    part(0,0,0.06, 1.78,1.04,0.16, '#5a4028');
    part(0,0,0.22, 1.58,0.98,0.48, body, {top:'#d97706'});
    // Carved stone/gold temple prow
    part(0.72,0,0.26, 0.32,0.82,0.56, '#bdb9a0', {top:'#2fbf9a'});
    [[0.86,-0.24],[0.86,0.24]].forEach(([a,b])=>{
      const p=L(a,b), q=Pj(p[0],p[1],Z+0.58);
      FR.ell(g, q[0], q[1], S*0.11, S*0.11, '#2fbf9a');
    });
    drawRiders(0.72, '#10b981', '#f59e0b', '#d9b27a');
  }
  else if(themeId === 'western'){
    // Iron-Banded Ore Mine Cart / Bucking Stagecoach Tub with Gold Nuggets
    part(0,0,0.04, 1.62,1.06,0.16, '#27272a');
    part(0,0,0.20, 1.52,1.00,0.54, body, {top:'#451a03'});
    // Iron straps & gold ore heap on nose
    part(0.62,0,0.72, 0.36,0.86,0.22, '#f59e0b', {top:'#fde047'});
    drawRiders(0.76, '#dc2626', '#2563eb', '#78350f');
  }
  else if(themeId === 'frontier'){
    // Hollowed Timber Log / Birch-Bark Voyager Canoe Pod
    part(0,0,0.06, 1.85,0.98,0.18, '#5a3b22');
    part(0,0,0.22, 1.68,0.94,0.46, body, {top:'#d9b27a'});
    // Upturned canoe bow & stern tips
    part( 0.82,0,0.35, 0.28,0.52,0.45, '#8a5a33');
    part(-0.82,0,0.35, 0.28,0.52,0.45, '#8a5a33');
    drawRiders(0.70, '#b91c1c', '#15803d', '#8a5a33');
  }
  else if(themeId === 'space'){
    // Sleek Gull-Wing Orbital Interceptor Pod with Glowing Cyan Thrusters
    part(0,0,0.08, 1.80,1.16,0.16, '#0f172a');
    part(0,0,0.24, 1.62,0.96,0.44, '#e2e8f0', {top:body});
    // Swept delta winglets
    part(-0.15,-0.62,0.32, 0.95,0.24,0.10, '#38bdf8');
    part(-0.15, 0.62,0.32, 0.95,0.24,0.10, '#38bdf8');
    // Rear cyan thruster glow
    const tp=L(-0.88,0), tq=Pj(tp[0],tp[1],Z+0.42);
    FR.ell(g, tq[0], tq[1], S*0.22, S*0.18, '#22d3ee');
    drawRiders(0.70, '#38bdf8', '#f8fafc', null);
  }
  else if(themeId === 'gothic'){
    // Bat-Winged Victorian Coffin / Hearse Carriage with Crimson Velvet
    part(0,0,0.06, 1.76,1.04,0.16, '#09090b');
    part(0,0,0.22, 1.60,0.96,0.52, '#18181b', {top:'#991b1b'});
    // Wrought-iron bat wing fins & gold candelabras
    part(-0.55,-0.54,0.45, 0.65,0.12,0.42, '#3f3f46', {top:'#dc2626'});
    part(-0.55, 0.54,0.45, 0.65,0.12,0.42, '#3f3f46', {top:'#dc2626'});
    drawRiders(0.74, '#a855f7', '#dc2626', '#18181b');
  }
  else if(themeId === 'medieval'){
    // Gilded Royal War-Chariot with Heraldic Shield & Gold Lion Prow
    part(0,0,0.06, 1.68,1.06,0.16, '#78350f');
    part(0,0,0.22, 1.54,0.98,0.52, body, {top:'#f5c542'});
    // Golden lion-crest prow
    part(0.72,0,0.35, 0.34,0.72,0.52, '#f5c542', {top:'#fff3b0'});
    drawRiders(0.74, '#facc15', '#3b82f6', '#94a3b8');
  }
  else if(themeId === 'alps'){
    // Carved Swiss Alpine Toboggan / Ice Bobsled with Steel Runners
    part(0,-0.44,0.02, 1.92,0.10,0.10, '#cbd5e1');
    part(0, 0.44,0.02, 1.92,0.10,0.10, '#cbd5e1');
    part(0,0,0.14, 1.72,0.96,0.48, body, {top:'#e0f2fe'});
    part(0.68,0,0.42, 0.38,0.88,0.38, '#f8fafc', {top:'#38bdf8'});
    drawRiders(0.68, '#ef4444', '#38bdf8', '#f8fafc');
  }
  else if(themeId === 'fiesta'){
    // Colorful Painted Fiesta Piñata / Talavera Carriage with Gold Trim
    part(0,0,0.06, 1.68,1.06,0.16, '#f59e0b');
    part(0,0,0.22, 1.54,1.00,0.50, body, {top:'#fde047'});
    part(-0.58,0,0.68, 0.38,0.94,0.24, '#10b981', {top:'#ec4899'});
    drawRiders(0.72, '#ec4899', '#10b981', '#f59e0b');
  }
  else if(themeId === 'nordic'){
    // Miniature Viking Drakkar Longship Pod with Round Shields & Dragon Prow
    part(0,0,0.06, 1.84,1.02,0.18, '#451a03');
    part(0,0,0.22, 1.66,0.96,0.46, body, {top:'#92400e'});
    // Dragon head prow at front (+a)
    part(0.84,0,0.40, 0.30,0.36,0.58, '#d97706', {top:'#fde047'});
    // Side Viking shields
    [[-0.35,-0.52],[0.25,-0.52],[-0.35,0.52],[0.25,0.52]].forEach(([a,b],k)=>{
      const p=L(a,b), q=Pj(p[0],p[1],Z+0.42);
      FR.ell(g, q[0], q[1], S*0.18, S*0.18, k%2?'#f59e0b':'#dc2626', '#fef3c7', S*0.03);
    });
    drawRiders(0.70, '#38bdf8', '#f59e0b', '#d97706');
  }
  else if(themeId === 'bavarian'){
    // Copper-Hooped Oak Oktoberfest Beer Barrel Tub
    part(0,0,0.06, 1.60,1.10,0.16, '#451a03');
    part(0,0,0.22, 1.48,1.04,0.52, '#92400e', {top:'#b45309'});
    // Brass/copper barrel hoops
    part( 0.48,0,0.20, 0.14,1.08,0.55, '#f59e0b');
    part(-0.48,0,0.20, 0.14,1.08,0.55, '#f59e0b');
    drawRiders(0.74, '#2563eb', '#f8fafc', '#15803d');
  }

  // Vertical overhead suspension yoke connecting the tub to the secondary spider arm above it
  const hitchP = L(-0.05, 0);
  const hBot = Pj(hitchP[0], hitchP[1], Z + 0.65);
  const hTop = Pj(hitchP[0], hitchP[1], SC_CFG.zArm2 - SC_CFG.zCar);
  FR.ln(g, hBot, hTop, skin.sweepTrim, S*0.13);
  FR.ln(g, hBot, hTop, skin.sweepCol, S*0.07);
}

/* ===== CENTRAL HUB & CROWN ARCHITECTURE PER THEME ===== */
function drawCenterColumn(g, Pj, S, themeId, w1){
  const skin = SCRAMBLER_SKINS[themeId] || SCRAMBLER_SKINS.unthemed;
  const ring = (r,z,n)=>Array.from({length:n||24},(_,k)=>Pj(r*Math.cos(k/(n||24)*6.2832),r*Math.sin(k/(n||24)*6.2832),z));

  if(themeId === 'unthemed'){
    // Standard unpainted industrial white/grey central drive column & motor cap
    FR.poly(g, ring(1.15, 0.45, 20), '#475569');
    FR.rbox(g, Pj, 0,0,0.45, 1.35,1.35, 2.25, 0.785, '#cbd5e1', {top:'#f8fafc'});
    FR.rbox(g, Pj, 0,0,2.70, 1.65,1.65, 0.45, w1, '#3b82f6', {top:'#e2e8f0'});
    const top = Pj(0,0,3.25);
    FR.ell(g, top[0], top[1], S*0.55, S*0.28, '#ef4444');
    return;
  }

  // Heavy / Immersive Themed Centerpieces (Tier 3–4)
  if(themeId === 'classic'){
    // 1950s Illuminated Atomic Starburst & Neon Marquee Tower
    FR.poly(g, ring(1.45, 0.50, 24), '#f5c542', '#b8861b', S*0.08);
    FR.rbox(g, Pj, 0,0,0.50, 1.45,1.45, 2.35, 0.785, '#d9342b', {top:'#f5c542'});
    FR.rbox(g, Pj, 0,0,2.85, 1.85,1.85, 0.65, w1, '#1e1b4b', {top:'#f5c542'});
    // Atomic neon starburst needles at crown
    const cr = Pj(0,0,4.35);
    for(let k=0;k<8;k++){
      const a = -w1*1.5 + k*0.7854;
      const tip = Pj(1.7*Math.cos(a), 1.7*Math.sin(a), 4.35 + (k%2?0.55:-0.25));
      FR.ln(g, cr, tip, '#f5c542', S*0.10);
      FR.ell(g, tip[0], tip[1], S*0.16, S*0.16, k%2?'#2dd4bf':'#f43f5e');
    }
    FR.ell(g, cr[0], cr[1], S*0.55, S*0.55, '#fff3b0', '#f59e0b', S*0.1);
  }
  else if(themeId === 'jungle'){
    // Stepped Mayan Stone Pedestal + Golden Jaguar Idol & Flaming Torch Braziers
    FR.rbox(g, Pj, 0,0,0.45, 2.1,2.1, 0.65, 0, '#8e8a72', {top:'#dad7c3'});
    FR.rbox(g, Pj, 0,0,1.10, 1.55,1.55, 1.75, 0, '#bdb9a0', {top:'#2fbf9a'});
    FR.rbox(g, Pj, 0,0,2.85, 1.75,1.75, 1.35, w1*0.3, '#eab308', {top:'#fef08a'});
    // Glowing jade eyes on idol
    const e1 = Pj(-0.35, 0.88, 3.65), e2 = Pj(0.35, 0.88, 3.65);
    FR.ell(g, e1[0], e1[1], S*0.18, S*0.18, '#10b981');
    FR.ell(g, e2[0], e2[1], S*0.18, S*0.18, '#10b981');
    // Crown fire bowl
    const fb = Pj(0,0,4.55);
    FR.ell(g, fb[0], fb[1], S*0.75, S*0.35, '#78350f');
    FR.poly(g, [[fb[0]-S*0.45,fb[1]],[fb[0],fb[1]-S*1.25],[fb[0]+S*0.45,fb[1]]], '#f97316');
    FR.poly(g, [[fb[0]-S*0.25,fb[1]],[fb[0],fb[1]-S*0.85],[fb[0]+S*0.25,fb[1]]], '#fde047');
  }
  else if(themeId === 'western'){
    // Timber Mine Derrick, Giant Red TNT Barrel & Spinning Wooden Windmill
    FR.rbox(g, Pj, 0,0,0.45, 1.85,1.85, 0.85, 0, '#78350f', {top:'#92400e'});
    FR.rbox(g, Pj, 0,0,1.30, 1.45,1.45, 1.85, 0.4, '#b91c1c', {top:'#f59e0b'});
    // Spinning wooden windmill blades on top
    const hub = Pj(0,0,4.25);
    FR.ln(g, Pj(0,0,3.15), hub, '#78350f', S*0.28);
    for(let k=0;k<6;k++){
      const a = -w1*2 + k*1.0472;
      const tip = Pj(1.75*Math.cos(a), 1.75*Math.sin(a), 4.25);
      FR.ln(g, hub, tip, '#d97706', S*0.16);
    }
    FR.ell(g, hub[0], hub[1], S*0.35, S*0.25, '#451a03');
  }
  else if(themeId === 'frontier'){
    // Carved Timber Totem Column & Spinning Pine-Cone / Waterwheel Crown
    FR.rbox(g, Pj, 0,0,0.45, 1.9,1.9, 0.7, 0, '#6b4a2b', {top:'#8a5a33'});
    FR.rbox(g, Pj, 0,0,1.15, 1.35,1.35, 2.35, 0, '#8a5a33', {top:'#d9b27a'});
    // Carved eagle wings on totem
    FR.rbox(g, Pj, 0,0,3.25, 2.8,0.55, 0.55, w1, '#b45309', {top:'#fde047'});
    const top = Pj(0,0,4.15);
    FR.ell(g, top[0], top[1], S*0.65, S*0.55, '#2f5f3a', '#eab308', S*0.08);
  }
  else if(themeId === 'space'){
    // Magnetic Plasma Core Reactor with Counter-Rotating Neon Cyan Rings
    FR.poly(g, ring(1.65, 0.50, 24), '#0f172a', '#38bdf8', S*0.10);
    FR.rbox(g, Pj, 0,0,0.50, 1.35,1.35, 2.65, w1*0.5, '#1e293b', {top:'#38bdf8'});
    const core = Pj(0,0,3.65);
    FR.ell(g, core[0], core[1], S*0.95, S*0.95, 'rgba(56,189,248,0.28)');
    FR.ell(g, core[0], core[1], S*0.58, S*0.58, '#22d3ee', '#ffffff', S*0.08);
    FR.poly(g, ring(1.85, 3.35, 24), null, '#38bdf8', S*0.11);
    FR.poly(g, ring(1.35, 4.15, 24), null, '#a855f7', S*0.09);
  }
  else if(themeId === 'gothic'){
    // Dark Wrought-Iron Crypt Obelisk & Giant Black Widow Spider Crown
    FR.rbox(g, Pj, 0,0,0.45, 1.85,1.85, 0.75, 0, '#27272a', {top:'#3f3f46'});
    FR.rbox(g, Pj, 0,0,1.20, 1.25,1.25, 2.25, 0.785, '#18181b', {top:'#991b1b'});
    const sp = Pj(0,0,3.75);
    FR.ell(g, sp[0], sp[1], S*0.78, S*0.62, '#09090b', '#dc2626', S*0.08);
    // Red hourglass mark & glowing eyes
    FR.ell(g, sp[0], sp[1]-S*0.1, S*0.22, S*0.28, '#dc2626');
  }
  else if(themeId === 'medieval'){
    // Royal Tournament Tent Spire with Gold Crown & fluttering Pennant
    FR.rbox(g, Pj, 0,0,0.45, 1.8,1.8, 0.75, 0, '#64748b', {top:'#94a3b8'});
    FR.rbox(g, Pj, 0,0,1.20, 1.35,1.35, 2.0, 0, '#1d4ed8', {top:'#f5c542'});
    // Conical striped pavilion roof cap
    const ap = Pj(0,0,4.75);
    for(let k=0;k<8;k++){
      const a0 = w1 + k/8*6.2832, a1 = w1 + (k+1)/8*6.2832;
      FR.poly(g, [ap, Pj(1.85*Math.cos(a0),1.85*Math.sin(a0),3.1), Pj(1.85*Math.cos(a1),1.85*Math.sin(a1),3.1)], k%2?'#b91c1c':'#fef3c7');
    }
    FR.ln(g, ap, [ap[0],ap[1]-S*0.95], '#f5c542', S*0.1);
    FR.poly(g, [[ap[0],ap[1]-S*0.95],[ap[0]+S*0.95,ap[1]-S*0.7],[ap[0],ap[1]-S*0.45]], '#f59e0b');
  }
  else if(themeId === 'alps'){
    // Translucent Matterhorn Ice Spire & Brass Alpine Horn / Snowflake Crown
    FR.poly(g, ring(1.75, 0.50, 18), '#bae6fd', '#0284c7', S*0.08);
    const ap = Pj(0,0,4.65);
    for(let k=0;k<6;k++){
      const a0 = k/6*6.2832, a1 = (k+1)/6*6.2832;
      FR.poly(g, [ap, Pj(1.45*Math.cos(a0),1.45*Math.sin(a0),0.5), Pj(1.45*Math.cos(a1),1.45*Math.sin(a1),0.5)], k%2?'#e0f2fe':'#7dd3fc', '#38bdf8', S*0.04);
    }
    FR.ell(g, ap[0], ap[1], S*0.38, S*0.38, '#ffffff', '#0284c7', S*0.08);
  }
  else if(themeId === 'fiesta'){
    // Talavera Pillar & Giant Rotating Fiesta Sombrero Crown
    FR.rbox(g, Pj, 0,0,0.45, 1.65,1.65, 2.35, 0, '#e11d48', {top:'#f59e0b'});
    // Giant Sombrero brim & crown
    FR.poly(g, ring(2.25, 3.10, 28), '#f59e0b', '#e11d48', S*0.12);
    FR.poly(g, ring(1.85, 3.22, 24), '#10b981', '#fde047', S*0.08);
    const top = Pj(0,0,3.95);
    FR.ell(g, top[0], top[1], S*0.85, S*0.72, '#f59e0b', '#e11d48', S*0.09);
  }
  else if(themeId === 'nordic'){
    // Carved Viking Stave-Church Dragon Mast & Glowing Runestone Pillar
    FR.rbox(g, Pj, 0,0,0.45, 1.85,1.85, 0.80, 0, '#475569', {top:'#64748b'});
    FR.rbox(g, Pj, 0,0,1.25, 1.35,1.35, 2.25, 0, '#78350f', {top:'#d97706'});
    // Crossed gold dragon prows at top
    const top = Pj(0,0,4.25);
    FR.rbox(g, Pj, 0,0,3.45, 2.4,0.5, 0.55, w1, '#451a03', {top:'#f59e0b'});
    FR.ell(g, top[0], top[1], S*0.48, S*0.48, '#38bdf8', '#fde047', S*0.09);
  }
  else if(themeId === 'bavarian'){
    // Traditional Blue-and-White Spiral Maibaum (Maypole) with Ribbon Wreath
    FR.rbox(g, Pj, 0,0,0.45, 1.75,1.75, 0.70, 0, '#78350f', {top:'#d97706'});
    // Spiral blue & white pole
    for(let z=1.1; z<4.2; z+=0.45){
      FR.rbox(g, Pj, 0,0,z, 0.95,0.95, 0.45, z*1.2, Math.round(z*2)%2?'#2563eb':'#f8fafc');
    }
    // Maypole floral & ribbon wreath ring
    FR.poly(g, ring(2.05, 3.65, 24), null, '#15803d', S*0.22);
    FR.poly(g, ring(2.05, 3.65, 24), null, '#f59e0b', S*0.08);
    const ap = Pj(0,0,4.65);
    FR.ell(g, ap[0], ap[1], S*0.35, S*0.35, '#f59e0b');
  }
}

/* ===== MAIN SCRAMBLER DRAWER FACTORY ===== */
function makeScramblerDrawer(themeId){
  const skin = SCRAMBLER_SKINS[themeId] || SCRAMBLER_SKINS.unthemed;
  const isUnthemed = (themeId === 'unthemed');
  const ats = {};

  return function(g, Pj, S, part, t){
    const at = ats[S] || (ats[S] = FR.atlas(S, 4.4*S, 4.4*S, 2.2*S, 2.9*S, 48, (g2, P2, i, psi)=>{
      drawScramblerTub(g2, P2, S, themeId, i, psi);
    }));
    const ring = (cx,cy,r,z,n)=>Array.from({length:n||48},(_,k)=>Pj(cx+r*Math.cos(k/(n||48)*6.2832),cy+r*Math.sin(k/(n||48)*6.2832),z));
    const R_PAD = 6.75;

    if(part === 'back'){
      // Soft ground shadow under platform
      const c0 = Pj(0,0,0);
      g.fillStyle = 'rgba(10,15,25,0.32)';
      g.beginPath(); g.ellipse(c0[0]+S*0.3, c0[1]+S*0.2, 7.3*S, 3.7*S, 0, 0, 7); g.fill();

      // Raised Octagonal / Circular Platform Base
      const N = isUnthemed ? 16 : 48;
      for(let k=0;k<N;k++){
        const a0=k/N*6.2832, a1=(k+1)/N*6.2832, m=(a0+a1)/2;
        if(Math.cos(m)+Math.sin(m) > 0){
          FR.poly(g,[
            Pj(R_PAD*Math.cos(a0),R_PAD*Math.sin(a0),0.42),
            Pj(R_PAD*Math.cos(a1),R_PAD*Math.sin(a1),0.42),
            Pj(R_PAD*Math.cos(a1),R_PAD*Math.sin(a1),0),
            Pj(R_PAD*Math.cos(a0),R_PAD*Math.sin(a0),0)
          ], shade(skin.padOuter, -0.22));
        }
      }
      FR.poly(g, ring(0,0,R_PAD,0.42,N), skin.padOuter, skin.padRim, S*0.09);
      FR.poly(g, ring(0,0,R_PAD-0.42,0.44,N), skin.padInner);

      // Theme-specific floor pattern on the deck
      if(!isUnthemed){
        const W = 12;
        for(let i=0;i<W;i++){
          const a0=i/W*6.2832, a1=(i+1)/W*6.2832;
          if(i%2===0){
            FR.poly(g,[
              Pj(0,0,0.45),
              Pj((R_PAD-0.5)*Math.cos(a0),(R_PAD-0.5)*Math.sin(a0),0.45),
              Pj((R_PAD-0.5)*Math.cos(a1),(R_PAD-0.5)*Math.sin(a1),0.45)
            ], shade(skin.padInner, 0.14));
          }
        }
        // Intersecting epicycloid floor track rings showing the Scrambler path
        g.beginPath();
        ring(0,0,SC_CFG.R1,0.46,48).forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));
        g.closePath();
        g.strokeStyle = skin.padRim; g.lineWidth = S*0.07; g.stroke();
      }

      // Operator Booth at back-left (-X, -Y)
      FR.rbox(g, Pj, -5.2, -3.5, 0, 1.5, 1.35, 1.85, 0, skin.padOuter, {top: skin.padRim});
      FR.rbox(g, Pj, -5.2, -3.5, 1.1, 1.56, 1.4, 0.55, 0, '#1e293b', {top: skin.sweepCol});

      // Back Perimeter Fence
      for(let k=0;k<32;k++){
        const a = k/32*6.2832;
        if(Math.cos(a)+Math.sin(a) >= 0) continue;
        const rx = (R_PAD-0.15)*Math.cos(a), ry = (R_PAD-0.15)*Math.sin(a);
        FR.ln(g, Pj(rx,ry,0.42), Pj(rx,ry,1.12), skin.padRim, S*0.07);
        const a2 = (k+1)/32*6.2832;
        if(Math.cos(a2)+Math.sin(a2) < 0.05){
          FR.ln(g, Pj(rx,ry,1.08), Pj((R_PAD-0.15)*Math.cos(a2),(R_PAD-0.15)*Math.sin(a2),1.08), skin.sweepCol, S*0.08);
        }
      }
    }

    if(part === 'live'){
      const st = scState(t||0);

      // 1. Contact shadows for all 9 tubs on the platform deck
      st.cars.forEach(c=>{
        const sp = Pj(c.X, c.Y, 0.46);
        FR.ell(g, sp[0]+S*0.1, sp[1]+S*0.08, S*1.05, S*0.52, 'rgba(10,14,22,0.34)');
      });

      // Helper to render a subset of tubs + their overhead secondary spider arms
      const renderCarsAndSpiders = (filterFn)=>{
        // Draw tubs sorted back-to-front
        st.cars.filter(filterFn).sort((a,b)=>a.d - b.d).forEach(c=>{
          const spr = at(c.c, c.psi);
          const pos = Pj(c.X, c.Y, SC_CFG.zCar);
          g.drawImage(spr.cv, pos[0]-spr.ox, pos[1]-spr.oy, spr.w, spr.h);
        });

        // Draw secondary 3-arm spider sweeps & primary sweep arms for hubs in this depth pass
        st.hubs.filter(h => filterFn({d: h.d})).sort((a,b)=>a.d - b.d).forEach(h=>{
          const hubCars = st.cars.filter(c=>c.h === h.h);
          const hBot = Pj(h.hx, h.hy, SC_CFG.zArm2);
          const hTop = Pj(h.hx, h.hy, SC_CFG.zArm1);
          // 3 Secondary Spider Arms radiating from sub-hub to its 3 tubs
          hubCars.forEach(c=>{
            const cTop = Pj(c.X, c.Y, SC_CFG.zArm2);
            FR.ln(g, hBot, cTop, skin.sweepTrim, S*0.18);
            FR.ln(g, hBot, cTop, skin.sweepCol,  S*0.10);
          });
          // Vertical drop-shaft from primary sweep arm to secondary spider hub
          FR.ln(g, hTop, hBot, skin.padRim, S*0.24);
          FR.ell(g, hBot[0], hBot[1], S*0.32, S*0.18, skin.spiderCol, skin.padRim, S*0.05);

          // Primary Sweep Arm from Central Column (0,0,zArm1) to (hx,hy,zArm1)
          const cPiv = Pj(0, 0, SC_CFG.zArm1 + 0.22);
          FR.ln(g, cPiv, hTop, skin.padRim,   S*0.32);
          FR.ln(g, cPiv, hTop, skin.sweepCol, S*0.18);
          FR.ell(g, hTop[0], hTop[1], S*0.36, S*0.20, skin.sweepTrim, skin.sweepCol, S*0.05);
        });
      };

      // Pass A: Back tubs & back sweep arms (behind central column: d < 0)
      renderCarsAndSpiders(item => item.d < 0);

      // Pass B: Central Column & Themed Crown at (0,0)
      drawCenterColumn(g, Pj, S, themeId, st.w1);

      // Pass C: Front tubs & front sweep arms (in front of central column: d >= 0)
      renderCarsAndSpiders(item => item.d >= 0);
    }

    if(part === 'front'){
      // Front Perimeter Fence & Entrance Steps
      for(let k=0;k<32;k++){
        const a = k/32*6.2832;
        if(Math.cos(a)+Math.sin(a) < 0) continue;
        if(Math.abs(a - 0.7854) < 0.25) continue; // Entrance gate gap
        const rx = (R_PAD-0.15)*Math.cos(a), ry = (R_PAD-0.15)*Math.sin(a);
        FR.ln(g, Pj(rx,ry,0.42), Pj(rx,ry,1.12), skin.padRim, S*0.08);
        const a2 = (k+1)/32*6.2832;
        if(Math.abs(a2 - 0.7854) >= 0.23){
          FR.ln(g, Pj(rx,ry,1.08), Pj((R_PAD-0.15)*Math.cos(a2),(R_PAD-0.15)*Math.sin(a2),1.08), skin.sweepCol, S*0.09);
        }
      }
      // Entrance steps at front-right (+X, +Y)
      const gx = (R_PAD+0.22)*Math.cos(0.7854), gy = (R_PAD+0.22)*Math.sin(0.7854);
      FR.rbox(g, Pj, gx, gy, 0, 1.45, 0.72, 0.28, 0.7854, skin.padOuter, {top: skin.padRim});
    }
  };
}

/**
 * PUBLIC ENGINE ENTRY POINT:
 * Automatically selects 'unthemed' when rideThemeTier <= 2 (None, Light, Medium),
 * or the bespoke themed skin when rideThemeTier >= 3 (Heavy, Immersive).
 */
function drawScrambler(ctx, cx, cy, R, opts){
  opts = opts || {};
  const tier = opts.rideThemeTier == null ? 3 : opts.rideThemeTier;
  const themeKey = (tier <= 2) ? 'unthemed' : (opts.theme || 'classic');
  const skin = SCRAMBLER_SKINS[themeKey] || SCRAMBLER_SKINS.unthemed;

  if(opts.tile){
    FR.hex(ctx, cx, cy, R, skin.hexFill, skin.hexBorder);
  }
  const fn = FR._d['scr_'+themeKey] || (FR._d['scr_'+themeKey] = makeScramblerDrawer(themeKey));
  FR.render(ctx, cx, cy, R, 'scr|'+themeKey+'|'+R, 1.5, 1.5, 1.0, fn, opts.t);
}
return drawScrambler;
})();

const modernWoodCoasterPack = (() => {

/* ===== THEME PACK CORE (shared by every theme pack; copy once into engine.js) ===== */
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
/* ===== FRONTIER PACK ===== */
const F={wood:'#8a5a33',woodD:'#5a3b22',woodL:'#b07a46',bark:'#6b4a2b',endc:'#d9b27a',pine:'#2f5f3a',pineL:'#3d7348',pineD:'#26503a',water:'#4aa0c8',waterD:'#2f7fa8',rock:'#8a8f96',rockD:'#5f656c',rockL:'#b4b9c0',snow:'#f4f8fc',canvas:'#eadfc4'};
const fsh=(c,x,y,rx,h)=>{c.fillStyle='rgba(12,34,14,.32)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
const logWall=(c,x,y,u,X0,X1,Y,Z0,Z1)=>{let k=0;for(let z=Z0+0.17;z<Z1;z+=0.34,k++){const a=TH.iso(x,y,u,X0,Y,z),b=TH.iso(x,y,u,X1,Y,z);TH.ln(c,a,b,k%2?F.wood:'#7d4f2b',u*0.36);TH.ln(c,[a[0],a[1]-u*0.09],[b[0],b[1]-u*0.09],'rgba(255,225,170,.28)',u*0.08);}};
const logWallE=(c,x,y,u,X,Y0,Y1,Z0,Z1)=>{let k=0;for(let z=Z0+0.17;z<Z1;z+=0.34,k++){const a=TH.iso(x,y,u,X,Y0,z),b=TH.iso(x,y,u,X,Y1,z);TH.ln(c,a,b,k%2?'#6f4524':'#5f3b1f',u*0.36);}};
const logEnds=(c,x,y,u,X,Y,Z0,Z1)=>{for(let z=Z0+0.17;z<Z1;z+=0.34){const p=TH.iso(x,y,u,X,Y,z);TH.ell(c,p[0],p[1],u*0.2,u*0.17,F.endc);TH.ell(c,p[0],p[1],u*0.09,u*0.07,'#b8884f');}};
function frFir(c,x,y,u,s,v){const H=u*6.2*s,tiers=6;fsh(c,x,y,u*1.6*s,H);TH.ln(c,[x,y],[x,y-u*1.2*s],'#4a3320',u*0.5*s);
  for(let k=0;k<tiers;k++){const t=k/(tiers-1),by=y-u*1.0*s-H*0.76*t,w=u*(1.75-1.2*t)*s,h=u*1.5*s;
    TH.poly(c,[[x-w,by+h*0.2],[x-w*0.35,by-h*0.3],[x,by-h*1.15],[x+w*0.35,by-h*0.3],[x+w,by+h*0.2],[x,by+h*0.55]],k%2?F.pine:F.pineL);
    TH.poly(c,[[x,by-h*1.15],[x+w*0.35,by-h*0.3],[x+w,by+h*0.2],[x+w*0.3,by+h*0.35]],'rgba(8,30,18,.4)');}}
const fcrag=(c,x,y,u,o)=>{const wt=o.wt,wb=o.wb,H=o.H,r=mulberry(o.seed),n=o.bands.length;TH.ell(c,x,y,wb*1.1,wb*0.47,'#6f7a62');c.save();c.beginPath();c.moveTo(x-wt,y-H);c.lineTo(x-wb,y);c.ellipse(x,y,wb,wb*0.42,0,Math.PI,0,true);c.lineTo(x+wt,y-H);c.ellipse(x,y-H,wt,wt*0.42,0,0,Math.PI);c.closePath();c.clip();
  const Hh=H+wb*0.42;for(let j=0;j<n;j++){c.fillStyle=o.bands[j];c.fillRect(x-wb-2,y-H+Hh*j/n,wb*2+4,Hh/n+1);}
  const g=c.createLinearGradient(x-wb,0,x+wb,0);g.addColorStop(0,'rgba(255,255,255,.22)');g.addColorStop(0.45,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,15,25,.5)');c.fillStyle=g;c.fillRect(x-wb-2,y-H-2,wb*2+4,Hh+4);
  for(let k=0;k<8;k++){const fx=x+(r()*2-1)*wt*0.9,bx=x+(fx-x)*wb/wt;c.strokeStyle='rgba(20,28,36,.3)';c.lineWidth=u*0.07;c.beginPath();c.moveTo(fx,y-H+wt*0.25);c.quadraticCurveTo((fx+bx)/2+u*0.12,y-H/2,bx,y+wb*0.3);c.stroke();}
  c.restore();TH.ell(c,x,y-H,wt,wt*0.42,o.top||'#6f8a5a');};
const FRONTIER_PACK={id:'frontier',name:'Frontier',ground:'#7d955d',groundDark:'#6b8350',border:'#566e42',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},
         3:{budget:11,decals:4,landmark:0.75,pool:['lookoutTower','waterfallCliff','mountainPeak']},
         4:{budget:15,decals:5,landmark:1,pool:['stockadeFort','sawmill','mountainPeak','waterfallCliff','lookoutTower'],second:0.45}},
  assets:{
  /* ---------- ground decals ---------- */
  riverBend:{cat:'decal',w:3.2,tier:1,weight:4,cost:0,draw(c,x,y,u,v,tm){const r=mulberry(v+3),f=v%2?-1:1,t=tm||0;const path=()=>{c.beginPath();c.moveTo(x-u*3.2,y-u*0.5*f);c.bezierCurveTo(x-u*1.6,y+u*0.7*f,x-u*0.1,y-u*0.9*f,x+u*3.2,y+u*0.5*f);};
    c.lineCap='round';path();c.strokeStyle='#6b5a3a';c.lineWidth=u*1.55;c.stroke();path();c.strokeStyle='#2f7fa8';c.lineWidth=u*1.2;c.stroke();path();c.strokeStyle='#4aa0c8';c.lineWidth=u*0.9;c.stroke();
    c.setLineDash([u*0.35,u*0.55]);c.lineDashOffset=-t*u*1.5;path();c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=u*0.08;c.stroke();c.setLineDash([]);
    for(let k=0;k<9;k++){const s=r(),b=(1-s)**3*(x-u*3.2)+3*(1-s)**2*s*(x-u*1.6)+3*(1-s)*s*s*(x-u*0.1)+s**3*(x+u*3.2),yy=(1-s)**3*(y-u*0.5*f)+3*(1-s)**2*s*(y+u*0.7*f)+3*(1-s)*s*s*(y-u*0.9*f)+s**3*(y+u*0.5*f);TH.ell(c,b,yy+(k%2?1:-1)*u*0.8,u*0.2,u*0.12,['#8a8f96','#a5a9ad','#6f747a'][k%3]);}}},
  pebbleBar:{cat:'decal',w:2.0,tier:1,weight:3,cost:0,draw(c,x,y,u,v){const r=mulberry(v+5);TH.ell(c,x,y,u*2.0,u*0.9,'#b9b4a2');for(let k=0;k<28;k++){const a=r()*6.283,rr=Math.sqrt(r());TH.ell(c,x+Math.cos(a)*u*1.8*rr,y+Math.sin(a)*u*0.8*rr,u*0.14,u*0.09,['#8a8f96','#a8a290','#c9c3b0','#6f747a'][k%4]);}}},
  pineNeedles:{cat:'decal',w:2.2,tier:1,weight:3.5,cost:0,draw(c,x,y,u,v){const r=mulberry(v+8);TH.ell(c,x,y,u*2.2,u*0.95,'#6b4f32');TH.ell(c,x-u*0.2,y-u*0.05,u*1.7,u*0.7,'#7b5c3a');for(let k=0;k<34;k++){const a=r()*6.283,rr=Math.sqrt(r()),px=x+Math.cos(a)*u*2.0*rr,py=y+Math.sin(a)*u*0.85*rr;TH.ln(c,[px,py],[px+u*0.28,py-u*0.1],k%3?'#4a3320':'#8a6a45',u*0.04);}}},
  wildMeadow:{cat:'decal',w:2.2,tier:1,weight:3.5,cost:0,draw(c,x,y,u,v){const r=mulberry(v+9);for(let k=0;k<30;k++){const a=r()*6.283,rr=Math.sqrt(r()),px=x+Math.cos(a)*u*2.0*rr,py=y+Math.sin(a)*u*0.9*rr;TH.ln(c,[px,py],[px+(r()-0.5)*u*0.2,py-u*(0.3+r()*0.3)],'#4a7a3c',u*0.05);if(k%3===0)TH.ell(c,px,py-u*0.5,u*0.09,u*0.12,['#8a5ad0','#f2d24a','#f8fafc','#d884e0'][k%4]);}}},
  /* ---------- trees and plants ---------- */
  pineTree:{cat:'tree',w:1.8,tier:2,weight:3.5,cost:2,max:2,draw(c,x,y,u,v){frFir(c,x,y,u,1.3+(v%3)*0.12,v);}},
  firGrove:{cat:'tree',w:2.3,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v){[[-1.1,0.2,0.8],[1.0,0.3,0.92],[0.0,-0.5,0.7]].sort((a,b)=>a[1]-b[1]).forEach(([dx,dy,s])=>frFir(c,x+dx*u,y+dy*u,u,s,v));}},
  aspenTree:{cat:'tree',w:1.7,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*5+2),H=u*(4.2+r()*0.8),t=tm||0;fsh(c,x,y,u*1.8,u*6);TH.ln(c,[x,y],[x+u*0.1,y-H],'#d8d3c2',u*0.5);TH.ln(c,[x+u*0.12,y],[x+u*0.2,y-H],'rgba(60,50,40,.25)',u*0.2);
    for(let k=0;k<9;k++){const ky=y-u*(0.4+k*0.45);TH.ln(c,[x-u*0.18,ky],[x+u*0.05,ky-u*0.05],'#3a3228',u*0.06);}
    const cols=['#c9b43a','#b2c040','#9ab838','#d6c046'];[[0,-0.9,1.9,1.5],[-1.2,0.1,1.4,1.1],[1.2,0.0,1.4,1.1],[0.1,0.1,1.7,1.2],[-0.5,-1.9,1.2,0.95]].forEach(([dx,dy,rx,ry],i)=>{const sw=Math.sin(t*1.4+i)*u*0.06;TH.blob(c,x+dx*u+sw,y-H+dy*u,u*rx,u*ry,cols[i%4],r,9);});}},
  berryBush:{cat:'plant',w:1.4,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*3+6);fsh(c,x,y,u*1.4,u);[[-0.7,-0.5,0.85,'#3f7a45'],[0.7,-0.5,0.8,'#4a8a4c'],[0,-0.95,0.95,'#559858'],[-0.1,-0.45,0.85,'#437f48']].forEach(([dx,dy,s,col])=>TH.blob(c,x+dx*u,y+dy*u,u*s,u*s*0.72,col,r,9));
    for(let k=0;k<9;k++)TH.ell(c,x+(r()-0.5)*u*1.8,y-u*(0.3+r()*1.0),u*0.1,u*0.1,['#3a5ad0','#d9342b','#5a3ad0'][k%3]);}},
  fernPatch:{cat:'plant',w:1.5,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*5+2),t=tm||0;fsh(c,x,y,u*1.5,u*1.5);for(let k=0;k<8;k++){const a=-3.1+k*0.48,l=u*(1.5+r()*0.7),sw=Math.sin(t*1.2+k)*u*0.05,ex=x+Math.cos(a)*l+sw,ey=y-Math.abs(Math.sin(a))*l*0.8-u*0.15;
      c.strokeStyle=k%2?'#2f6a3a':'#3a7a44';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(ex-x)*0.45,y-l*0.85,ex,ey);c.stroke();
      for(let q=1;q<7;q++){const f=q/7,px=x+(ex-x)*f*0.92,py=y+(ey-y)*f-Math.sin(f*3.0)*l*0.3;TH.ln(c,[px,py],[px-u*0.26,py+u*0.18],'#4a8e4e',u*0.05);TH.ln(c,[px,py],[px+u*0.26,py+u*0.18],'#4a8e4e',u*0.05);}}}},
  cattails:{cat:'plant',w:1.4,tier:1,weight:3,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*4+3),t=tm||0;TH.ell(c,x,y+u*0.1,u*1.6,u*0.6,'#3f8fb5');TH.ell(c,x-u*0.2,y,u*1.2,u*0.4,'#56a8cc');
    for(let k=0;k<8;k++){const bx=x+(k-3.5)*u*0.3,h=u*(2.4+r()*1.3),sw=Math.sin(t*1.3+k)*u*0.06;TH.ln(c,[bx,y],[bx+sw,y-h],'#5a8a3a',u*0.1);TH.ln(c,[bx,y-h*0.3],[bx-u*0.5+sw,y-h*0.95],'#4a7a32',u*0.06);if(k%2===0){TH.ell(c,bx+sw,y-h*0.82,u*0.13,u*0.38,'#6b4a2b');TH.ln(c,[bx+sw,y-h*0.6],[bx+sw,y-h*1.15],'#8a6a45',u*0.04);}}}},
  fallenLog:{cat:'plant',w:2.4,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+2);fsh(c,x,y,u*2.4,u*1.5);const a=I(-2.2,0,0.5),b=I(2.2,0,0.5);TH.ln(c,a,b,'#4a3320',u*1.2);TH.ln(c,a,b,F.bark,u*1.0);TH.ln(c,[a[0],a[1]-u*0.3],[b[0],b[1]-u*0.3],F.woodL,u*0.2);
    for(let k=0;k<7;k++){const p=I(-1.8+k*0.6,0,0.5);TH.ln(c,[p[0],p[1]-u*0.45],[p[0]+u*0.2,p[1]+u*0.4],'rgba(40,24,10,.35)',u*0.05);}TH.ell(c,b[0],b[1],u*0.5,u*0.62,F.endc);[0.16,0.3,0.44].forEach(s=>{c.strokeStyle='rgba(120,80,40,.5)';c.lineWidth=u*0.04;c.beginPath();c.ellipse(b[0],b[1],u*s*1.1,u*s*1.3,0,0,7);c.stroke();});
    TH.ln(c,I(0.5,0,0.8),I(1.2,-0.6,1.7),F.bark,u*0.16);TH.blob(c,...I(-1.0,0.1,1.1),u*0.7,u*0.2,'rgba(95,138,71,.95)',r,7);for(let k=0;k<3;k++){const p=I(-0.4+k*0.35,0.5,0.75);TH.ln(c,[p[0],p[1]],[p[0],p[1]-u*0.35],'#e8e0cc',u*0.06);TH.ell(c,p[0],p[1]-u*0.4,u*0.16,u*0.1,'#c9663a');}}},
  boulders:{cat:'rock',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*13+3);fsh(c,x,y,u*1.9,u*1.4);[[0.0,0.0,1.0,1.0,'#80858d'],[-1.0,0.2,0.65,0.6,'#6f747c'],[0.9,0.25,0.6,0.55,'#8f949b']].forEach(([dx,dy,sx,sy,col])=>TH.blob(c,x+dx*u,y-u*0.55*sy+dy*u,u*0.9*sx,u*0.75*sy,col,r,9));
    for(let k=0;k<4;k++)TH.ell(c,x+(r()-0.5)*u*1.4,y-u*(0.2+r()*0.7),u*0.2,u*0.1,k%2?'rgba(150,170,90,.8)':'rgba(95,138,71,.7)');}},
  /* ---------- props ---------- */
  campfire:{cat:'prop',w:1.7,tier:1,weight:3,cost:1,max:1,draw(c,x,y,u,v,tm){const t=tm||0;fsh(c,x,y,u*1.8,u*2);TH.ell(c,x,y+u*0.1,u*1.2,u*0.5,'#4a3a2a');for(let k=0;k<9;k++){const a=k/9*6.283;TH.ell(c,x+Math.cos(a)*u*0.95,y+u*0.1+Math.sin(a)*u*0.42,u*0.28,u*0.18,['#8a8f96','#6f747a'][k%2]);}
    TH.ln(c,[x-u*0.7,y+u*0.1],[x+u*0.6,y-u*0.3],'#4a3320',u*0.24);TH.ln(c,[x+u*0.7,y+u*0.15],[x-u*0.5,y-u*0.3],'#5a4028',u*0.24);
    [[-1.9,0.4],[1.9,0.5]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u-u*0.5,y+dy*u],[x+dx*u+u*0.5,y+dy*u-u*0.1],'#6b4a2b',u*0.5);TH.ell(c,x+dx*u+u*0.5,y+dy*u-u*0.1,u*0.22,u*0.25,F.endc);});
    [[-1.4,0.1],[1.4,0.1],[0,-0.7]].forEach(([dx,dy])=>TH.ln(c,[x+dx*u,y+dy*u+u*0.2],[x+dx*u*0.2,y-u*2.4],'#3b3f4a',u*0.09));TH.ell(c,x,y-u*1.4,u*0.45,u*0.34,'#2b2f3a');
    const g=c.createRadialGradient(x,y-u*0.6,0,x,y-u*0.6,u*2.6);g.addColorStop(0,'rgba(255,170,60,'+(0.45+0.1*Math.sin(t*9))+')');g.addColorStop(1,'rgba(255,170,60,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*0.6,u*2.6,0,7);c.fill();
    [[0,1.0,0.9],[-0.35,0.75,0.6],[0.35,0.8,0.65]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*11+i*2+v)*u*0.12;TH.poly(c,[[x+dx*u-u*0.38*w,y-u*0.05],[x+dx*u+f,y-u*(0.1+h*1.2)],[x+dx*u+u*0.38*w,y-u*0.05]],i?'#fbbf24':'#f97316');});
    for(let k=0;k<3;k++){const ph=(t*0.6+k*0.33)%1;c.fillStyle='rgba(120,120,126,'+(0.35*(1-ph))+')';c.beginPath();c.ellipse(x+Math.sin(ph*5+k)*u*0.3,y-u*(2.3+ph*2.2),u*(0.22+ph*0.45),u*(0.18+ph*0.35),0,0,7);c.fill();}}},
  canoe:{cat:'prop',w:2.5,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.7,u*1.5);const N=16,top=[];for(let k=0;k<=N;k++){const X=-2.6+5.2*k/N,q=Math.abs(X)/2.6;top.push([X,0.62*Math.pow(Math.max(0,1-q*q),0.55),0.28+0.95*Math.pow(q,3)]);}
    TH.poly(c,top.map(p=>I(p[0],-p[1],p[2])).concat(top.slice().reverse().map(p=>I(p[0],p[1],p[2]))),'#2f2012');
    TH.poly(c,top.map(p=>I(p[0],p[1],p[2])).concat(top.slice().reverse().map(p=>I(p[0],p[1]*0.35,0.03+p[2]*0.12))),'#c98f4a');
    for(let k=1;k<N;k+=2){const p=top[k];TH.ln(c,I(p[0],p[1],p[2]),I(p[0],p[1]*0.35,0.03+p[2]*0.12),'rgba(90,50,20,.35)',u*0.05);}
    c.strokeStyle='#7a4d2b';c.lineWidth=u*0.12;c.lineJoin='round';c.beginPath();top.forEach((p,i)=>{const q=I(p[0],p[1],p[2]);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.stroke();
    [-0.8,0.9].forEach(X=>TH.ln(c,I(X,-0.55,0.5),I(X,0.55,0.5),'#8a5a33',u*0.12));TH.ln(c,I(1.5,1.3,0),I(1.9,1.0,2.4),F.woodL,u*0.1);TH.ell(c,...I(1.95,0.98,2.7),u*0.14,u*0.3,F.woodL,-0.3);}},
  fishRack:{cat:'prop',w:2.2,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+4);fsh(c,x,y,u*2.3,u*3);[-1.9,1.9].forEach(X=>{TH.ln(c,I(X,-0.7,0),I(X,0,2.6),F.bark,u*0.18);TH.ln(c,I(X,0.7,0),I(X,0,2.6),F.bark,u*0.18);});
    TH.ln(c,I(-2.1,0,2.5),I(2.1,0,2.5),F.woodD,u*0.16);TH.ln(c,I(-1.9,0,1.5),I(1.9,0,1.5),F.woodD,u*0.12);
    for(let k=0;k<10;k++){const X=-1.7+k*0.38,L=0.5+r()*0.5,top=I(X,0,2.5),bot=[top[0],top[1]+u*L*1.2];TH.ln(c,top,bot,'#c9b98a',u*0.04);TH.ell(c,bot[0],bot[1]+u*0.28,u*0.12,u*0.34,'#b8c4cc');TH.poly(c,[[bot[0]-u*0.1,bot[1]+u*0.55],[bot[0]+u*0.1,bot[1]+u*0.55],[bot[0],bot[1]+u*0.4]],'#98a4ac');TH.ell(c,bot[0]+u*0.02,bot[1]+u*0.16,u*0.025,u*0.025,'#222');}
    for(let k=0;k<5;k++){const p=I(-1.5+k*0.75,0,1.5);TH.poly(c,[[p[0]-u*0.12,p[1]],[p[0]+u*0.12,p[1]],[p[0]+u*0.08,p[1]+u*0.9],[p[0]-u*0.08,p[1]+u*0.9]],'#b86a4a');}}},
  firewood:{cat:'prop',w:1.7,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+5);fsh(c,x,y,u*1.8,u*1.6);[-1.5,1.5].forEach(X=>TH.ln(c,I(X,0.5,0),I(X,0.5,1.6),F.woodD,u*0.18));
    TH.box(c,x,y,u,-1.4,1.4,-0.5,0.5,0,1.5,'#9a6a3c','#6f4a28','#b8884f');for(let row=0;row<4;row++)for(let col=0;col<7;col++){const p=I(-1.2+col*0.4+(row%2)*0.2,0.51,0.18+row*0.36);TH.ell(c,p[0],p[1],u*0.17,u*0.16,F.endc);TH.ell(c,p[0],p[1],u*0.07,u*0.06,'#a8783f');}
    TH.poly(c,[I(-1.6,0.8,1.5),I(1.6,0.8,1.5),I(1.6,-0.6,1.7),I(-1.6,-0.6,1.7)],'#5a3b22');TH.ell(c,x+u*2.0,y+u*0.3,u*0.35,u*0.28,F.endc);TH.ln(c,[x+u*2.0,y+u*0.3],[x+u*2.5,y-u*0.4],F.woodL,u*0.14);TH.poly(c,[[x+u*2.35,y-u*0.45],[x+u*2.75,y-u*0.55],[x+u*2.6,y-u*0.2]],'#9aa0a8');}},
  railFence:{cat:'prop',w:2.6,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.7,u);for(let seg=-2;seg<=1;seg++){const sx=seg*1.25,s=seg%2?1:-1;for(let lvl=0;lvl<4;lvl++){const z=0.25+lvl*0.4,k=(lvl+seg)%2?1:-1;TH.ln(c,I(sx,0.35*k*s,z),I(sx+1.45,-0.35*k*s,z+0.03),'#8a6a45',u*0.2);TH.ell(c,...I(sx+1.45,-0.35*k*s,z+0.03),u*0.1,u*0.1,'#c9a56a');}}
    if(v%2)TH.ln(c,I(1.8,0,0.2),I(2.6,0.5,0.9),'#8a6a45',u*0.2);}},
  footbridge:{cat:'prop',w:2.4,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.poly(c,[I(-1.6,-3.0,0),I(1.6,-3.0,0),I(1.6,3.0,0),I(-1.6,3.0,0)],'#6b5a3a');TH.poly(c,[I(-1.2,-3.0,0.02),I(1.2,-3.0,0.02),I(1.2,3.0,0.02),I(-1.2,3.0,0.02)],F.waterD);TH.poly(c,[I(-0.9,-3.0,0.04),I(0.9,-3.0,0.04),I(0.9,3.0,0.04),I(-0.9,3.0,0.04)],F.water);
    fsh(c,x,y,u*2.2,u*1.5);const deck=Y=>{const z=0.55+0.35*(1-Math.pow(Y/2.6,2));return z;};[-2.6,2.6].forEach(Y=>TH.ln(c,I(-0.7,Y,0),I(-0.7,Y,0.65),F.woodD,u*0.3));
    const pts=[];for(let k=0;k<=12;k++){const Y=-2.6+5.2*k/12;pts.push([Y,deck(Y)]);}TH.poly(c,pts.map(p=>I(-0.75,p[0],p[1])).concat(pts.slice().reverse().map(p=>I(0.75,p[0],p[1]))),'#a97d49');for(let k=1;k<12;k++){TH.ln(c,I(-0.75,pts[k][0],pts[k][1]),I(0.75,pts[k][0],pts[k][1]),'rgba(60,35,10,.4)',u*0.05);}
    [-0.8,0.8].forEach(X=>{c.strokeStyle=F.woodD;c.lineWidth=u*0.12;c.beginPath();pts.forEach((p,i)=>{const q=I(X,p[0],p[1]+0.8);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.stroke();for(let k=0;k<=12;k+=3)TH.ln(c,I(X,pts[k][0],pts[k][1]),I(X,pts[k][0],pts[k][1]+0.8),F.woodD,u*0.1);});}},
  trapperTent:{cat:'prop',w:2.4,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.5,u*3);TH.poly(c,[I(2.2,-1.5,0),I(2.2,1.5,0),I(2.2,0,2.6)],'#d6c7a4');TH.poly(c,[I(2.2,-0.6,0),I(2.2,0.6,0),I(2.2,0.05,1.7)],'#241c14');TH.poly(c,[I(2.2,-0.6,0),I(2.2,0.05,1.7),I(2.2,-0.2,0.0)],'#f0e6c8');
    TH.poly(c,[I(-2.2,1.5,0),I(2.2,1.5,0),I(2.2,0,2.6),I(-2.2,0,2.6)],F.canvas);TH.poly(c,[I(-2.2,0.4,0.9),I(2.2,0.4,0.9),I(2.2,0,2.6),I(-2.2,0,2.6)],'rgba(140,110,60,.18)');for(let k=1;k<5;k++)TH.ln(c,I(-2.2+k*0.9,1.5,0),I(-2.2+k*0.9,0,2.6),'rgba(110,85,50,.35)',u*0.04);TH.ln(c,I(-2.2,0,2.6),I(2.2,0,2.6),F.woodD,u*0.18);
    [-2.6,2.6].forEach(X=>TH.ln(c,I(X,0,2.8),I(X,0,0),F.bark,u*0.14));[[-2.6,2.2],[2.6,2.2],[-1,2.2]].forEach(([X,Y])=>{TH.ln(c,I(X*0.8,1.2,1.0),I(X,Y,0),'rgba(230,220,190,.7)',u*0.04);TH.ln(c,I(X,Y,0),I(X,Y,0.3),F.woodD,u*0.1);});
    TH.ell(c,...I(1.0,2.0,0.3),u*0.3,u*0.2,'#7a5a3a');TH.ell(c,...I(1.0,2.0,0.55),u*0.2,u*0.14,'#e0d6b8');TH.ln(c,I(2.8,1.6,0),I(2.8,1.6,1.5),F.bark,u*0.12);TH.ell(c,...I(2.8,1.6,1.6),u*0.18,u*0.22,'#fbbf24');}},
  bear:{cat:'prop',w:1.7,tier:2,weight:2,cost:1,max:1,draw(c,x,y,u,v,tm){const dk='#4a2f1e',md='#6b4630',lt='#8a6a4a';fsh(c,x,y,u*1.9,u*2.2);[[-0.6,-0.1],[1.1,-0.05]].forEach(([dx,dy])=>{TH.poly(c,[[x+dx*u-u*0.3,y-u*0.9],[x+dx*u+u*0.3,y-u*0.9],[x+dx*u+u*0.26,y+dy*u],[x+dx*u-u*0.26,y+dy*u]],'#3b2516');});
    TH.ell(c,x,y-u*1.4,u*1.75,u*0.95,md);TH.ell(c,x-u*0.55,y-u*1.95,u*0.85,u*0.6,md);TH.ell(c,x+u*0.1,y-u*1.0,u*1.4,u*0.5,'rgba(0,0,0,.2)');
    [[-1.0,0.3],[0.8,0.35]].forEach(([dx,dy])=>{TH.poly(c,[[x+dx*u-u*0.34,y-u*0.95],[x+dx*u+u*0.34,y-u*0.95],[x+dx*u+u*0.3,y+dy*u],[x+dx*u-u*0.3,y+dy*u]],dk);TH.ell(c,x+dx*u,y+dy*u,u*0.42,u*0.14,'#2f2015');for(let k=-1;k<=1;k++)TH.ln(c,[x+dx*u+k*u*0.15+u*0.2,y+dy*u+u*0.05],[x+dx*u+k*u*0.15+u*0.32,y+dy*u+u*0.1],'#e8e0cc',u*0.04);});
    const hy=y-u*1.55+Math.sin((tm||0)*1.2+v)*u*0.05;TH.ell(c,x+u*1.65,hy,u*0.62,u*0.56,md);TH.ell(c,x+u*2.1,hy+u*0.15,u*0.4,u*0.3,lt);TH.ell(c,x+u*2.38,hy+u*0.06,u*0.12,u*0.1,'#1a1410');TH.ell(c,x+u*1.4,hy-u*0.5,u*0.17,u*0.17,md);TH.ell(c,x+u*1.85,hy-u*0.42,u*0.15,u*0.15,dk);TH.ell(c,x+u*1.85,hy-u*0.1,u*0.06,u*0.06,'#111');
    if(v%2){TH.ell(c,x+u*2.35,hy+u*0.42,u*0.55,u*0.12,'#e0746a',-0.35);TH.poly(c,[[x+u*2.8,hy+u*0.3],[x+u*3.0,hy+u*0.1],[x+u*3.0,hy+u*0.5]],'#c9564a');}}},
  deer:{cat:'prop',w:1.5,tier:1,weight:2.5,cost:1,max:1,draw(c,x,y,u,v,tm){const tn='#b88a56',dk='#8a6238';fsh(c,x,y,u*1.7,u*2.5);[[-0.8,0.05],[0.9,0.05]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u+u*0.15,y-u*1.4],[x+dx*u+u*0.1,y+dy*u],dk,u*0.16);});
    TH.ell(c,x,y-u*1.65,u*1.25,u*0.55,tn);TH.ell(c,x-u*0.2,y-u*1.4,u*0.9,u*0.25,'#e6d6b4');[[-0.95,0.05],[0.65,0.1]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u,y-u*1.4],[x+dx*u-u*0.04,y+dy*u],tn,u*0.18);TH.ell(c,x+dx*u-u*0.04,y+dy*u,u*0.14,u*0.07,'#2b1f14');});
    TH.ln(c,[x+u*1.0,y-u*1.8],[x+u*1.5,y-u*3.0],tn,u*0.4);const hy=y-u*3.15+Math.sin((tm||0)*1.5+v)*u*0.04;TH.ell(c,x+u*1.65,hy,u*0.38,u*0.3,tn,0.3);TH.ell(c,x+u*2.0,hy+u*0.1,u*0.2,u*0.14,'#d9c4a0');TH.ell(c,x+u*2.15,hy+u*0.08,u*0.06,u*0.05,'#111');TH.ell(c,x+u*1.62,hy-u*0.35,u*0.1,u*0.2,tn,-0.3);
    c.strokeStyle='#6b4a2b';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x+u*1.6,hy-u*0.25);c.lineTo(x+u*1.3,hy-u*0.85);c.moveTo(x+u*1.45,hy-u*0.55);c.lineTo(x+u*1.1,hy-u*0.55);c.moveTo(x+u*1.35,hy-u*0.75);c.lineTo(x+u*1.65,hy-u*1.1);c.stroke();TH.poly(c,[[x-u*1.25,y-u*1.8],[x-u*1.6,y-u*1.95],[x-u*1.3,y-u*1.55]],'#f1ece0');}},
  beaverDam:{cat:'prop',w:2.4,tier:2,weight:2,cost:1,max:1,draw(c,x,y,u,v,tm){const r=mulberry(v+3),t=tm||0;TH.ell(c,x,y,u*2.6,u*1.1,'#6b5a3a');TH.ell(c,x,y,u*2.4,u*0.98,F.waterD);TH.ell(c,x-u*0.2,y-u*0.05,u*1.9,u*0.74,F.water);c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=u*0.05;const ph=(t*0.35)%1;c.beginPath();c.ellipse(x-u*1.0,y+u*0.2,u*(0.2+ph*0.6),u*(0.1+ph*0.26),0,0,7);c.stroke();
    for(let k=0;k<22;k++){const px=x+u*(1.0+(r()-0.5)*0.4)+k*0.0,py=y+u*(-0.9+k*0.085),L=u*(0.9+r()*0.6);TH.ln(c,[px-L*0.5,py+(r()-0.5)*u*0.1],[px+L*0.5,py+(r()-0.5)*u*0.1-u*0.05],['#6b4a2b','#8a6238','#5a3b22'][k%3],u*0.14);}
    c.beginPath();c.moveTo(x-u*1.9,y-u*0.1);c.quadraticCurveTo(x-u*1.6,y-u*2.2,x-u*0.5,y-u*2.0);c.quadraticCurveTo(x+u*0.3,y-u*1.4,x+u*0.4,y-u*0.1);c.closePath();c.fillStyle='#7a5a38';c.fill();
    for(let k=0;k<26;k++){const a=r()*6.283,rr=Math.sqrt(r());const px=x-u*0.75+Math.cos(a)*u*1.0*rr,py=y-u*0.9+Math.sin(a)*u*0.75*rr;TH.ln(c,[px,py],[px+(r()-0.5)*u*0.9,py+(r()-0.5)*u*0.4],['#5a3b22','#9a7a4a','#6b4a2b'][k%3],u*0.07);}
    TH.ell(c,x-u*0.7,y+u*0.35,u*0.25,u*0.14,'#4a3320');TH.ell(c,x-u*0.45,y+u*0.34,u*0.1,u*0.09,'#4a3320');TH.ell(c,x-u*1.0,y+u*0.42,u*0.2,u*0.07,'#3a2a1a');}},
  logCabin:{cat:'structure',w:2.8,tier:3,weight:3,cost:2,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0;fsh(c,x,y,u*3.2,u*4);
    TH.box(c,x,y,u,-2.2,2.2,-1.6,1.6,0,2.3,'#8a5a33','#6f4524','#a97d49');logWall(c,x,y,u,-2.2,2.2,1.61,0,2.3);logWallE(c,x,y,u,2.21,-1.6,1.6,0,2.3);logEnds(c,x,y,u,-2.2,1.61,0,2.3);logEnds(c,x,y,u,2.2,1.61,0,2.3);
    TH.poly(c,[I(-0.45,1.64,0),I(0.45,1.64,0),I(0.45,1.64,1.6),I(-0.45,1.64,1.6)],'#4a2f1c','#2b1b0e',u*0.05);TH.ell(c,...I(0.3,1.65,0.8),u*0.05,u*0.05,'#e0b53a');
    TH.poly(c,[I(1.0,1.64,0.9),I(1.8,1.64,0.9),I(1.8,1.64,1.7),I(1.0,1.64,1.7)],'#9bd0e8','#4a2f1c',u*0.07);TH.ln(c,I(1.4,1.65,0.9),I(1.4,1.65,1.7),'#4a2f1c',u*0.05);[[0.78,1.0],[2.02,1.8]].forEach(([X,x2])=>TH.poly(c,[I(X,1.65,0.9),I(X+(X<1?0.22:-0.22),1.65,0.9),I(X+(X<1?0.22:-0.22),1.65,1.7),I(X,1.65,1.7)],'#5a3b22'));
    TH.poly(c,[I(2.2,-1.6,2.3),I(2.2,1.6,2.3),I(2.2,0,3.9)],'#7a4d2b');for(let k=0;k<5;k++)TH.ln(c,I(2.21,-1.5+k*0.75,2.3),I(2.21,-0.7+k*0.4+(k%2)*0.0,3.4),'rgba(40,24,10,.0)',1);
    TH.poly(c,[I(-2.7,2.0,2.2),I(2.7,2.0,2.2),I(2.7,0,4.0),I(-2.7,0,4.0)],'#7a5a3a');for(let k=1;k<7;k++){TH.ln(c,I(-2.7,2.0-k*0.285,2.2+k*0.257),I(2.7,2.0-k*0.285,2.2+k*0.257),'rgba(40,24,10,.45)',u*0.06);}TH.ln(c,I(-2.7,2.0,2.2),I(2.7,2.0,2.2),'#4a3320',u*0.14);TH.ln(c,I(-2.7,0,4.0),I(2.7,0,4.0),'#9a7a4a',u*0.14);
    TH.box(c,x,y,u,-1.7,-1.0,-1.1,-0.5,2.0,4.8,'#9aa0a8','#6f747c','#c3c8cf');for(let k=0;k<4;k++){const ph=(t*0.5+k*0.25)%1,tp=I(-1.35,-0.8,4.8);c.fillStyle='rgba(200,200,205,'+(0.5*(1-ph))+')';c.beginPath();c.ellipse(tp[0]+Math.sin(ph*4+k)*u*0.3+ph*u*0.6,tp[1]-ph*u*3.0-u*0.2,u*(0.25+ph*0.5),u*(0.2+ph*0.4),0,0,7);c.fill();}
    TH.box(c,x,y,u,-2.0,2.0,1.7,2.5,0,0.2,'#a97d49','#7d5a34','#c49858');[-1.9,1.9].forEach(X=>TH.ln(c,I(X,2.4,0.2),I(X,2.4,2.1),F.bark,u*0.18));}},
  /* ---------- landmarks ---------- */
  lookoutTower:{cat:'landmark',w:2.3,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.4,u*9);const H=9.0;
    const legs=[[-1.9,-1.4],[1.9,-1.4],[-1.9,1.4],[1.9,1.4]],top=(X,Y)=>[X*0.55,Y*0.55];legs.slice(0,2).forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(top(X,Y)[0],top(X,Y)[1],H),F.woodD,u*0.3));
    for(let k=1;k<5;k++){const f=k/5,z=H*f,s=1-0.45*f;TH.ln(c,I(-1.9*s,1.4*s,z),I(1.9*s,1.4*s,z),F.woodD,u*0.14);TH.ln(c,I(1.9*s,-1.4*s,z),I(1.9*s,1.4*s,z),F.woodD,u*0.14);}
    for(let k=0;k<4;k++){const f0=k/5,f1=(k+1)/5,s0=1-0.45*f0,s1=1-0.45*f1;TH.ln(c,I(-1.9*s0,1.4*s0,H*f0),I(1.9*s1,1.4*s1,H*f1),F.wood,u*0.1);TH.ln(c,I(1.9*s0,1.4*s0,H*f0),I(-1.9*s1,1.4*s1,H*f1),F.wood,u*0.1);}
    legs.slice(2).forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(top(X,Y)[0],top(X,Y)[1],H),F.wood,u*0.34));
    for(let k=0;k<7;k++){const f=k/7;TH.ln(c,I(-1.2+f*0.2,1.5,H*f),I(-0.6+f*0.2,1.5,H*(f+0.15)),'#c9a56a',u*0.08);}
    const cs=1.5;TH.box(c,x,y,u,-cs-0.3,cs+0.3,-cs-0.3,cs+0.3,H,H+0.25,'#a97d49','#7d5a34','#c49858');TH.box(c,x,y,u,-cs,cs,-cs,cs,H+0.25,H+1.8,'#b88a56','#8a6238','#d6a86a');
    [[-1.1,-0.2],[0.2,1.1]].forEach(([a,b])=>TH.poly(c,[I(a,cs+0.01,H+0.7),I(b,cs+0.01,H+0.7),I(b,cs+0.01,H+1.5),I(a,cs+0.01,H+1.5)],'#9bd0e8','#4a2f1c',u*0.05));TH.poly(c,[I(cs+0.01,-1.1,H+0.7),I(cs+0.01,1.1,H+0.7),I(cs+0.01,1.1,H+1.5),I(cs+0.01,-1.1,H+1.5)],'#9bd0e8','#4a2f1c',u*0.05);
    const ap=I(0,0,H+3.3);TH.poly(c,[I(-cs-0.4,cs+0.4,H+1.8),I(cs+0.4,cs+0.4,H+1.8),ap],'#5a3b22');TH.poly(c,[I(cs+0.4,-cs-0.4,H+1.8),I(cs+0.4,cs+0.4,H+1.8),ap],'#3f2815');TH.ln(c,ap,[ap[0],ap[1]-u*1.0],'#d5dae6',u*0.08);
    TH.poly(c,[[ap[0],ap[1]-u*1.0],[ap[0]+u*1.1,ap[1]-u*0.8+Math.sin((tm||0)*3)*u*0.1],[ap[0],ap[1]-u*0.5]],'#d9342b');}},
  waterfallCliff:{cat:'landmark',w:3.2,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const r=mulberry(v+4),t=tm||0,H=u*6.0,wt=u*2.7,wb=u*3.4;fsh(c,x,y,u*3.4,u*7);
    fcrag(c,x,y,u,{wt:wt,wb:wb,H:H,seed:v+2,bands:['#8a8f96','#7a7f87','#9a9fa6','#6f747c','#858a92','#7a7f87'],top:'#6f8a5a'});
    const fx=x-u*0.3,top=y-H+wt*0.42*0.9,bot=y+wb*0.42*0.9;c.save();c.beginPath();c.moveTo(fx-u*0.55,top);c.lineTo(fx+u*0.55,top);c.lineTo(fx+u*0.8,bot);c.lineTo(fx-u*0.8,bot);c.closePath();const g=c.createLinearGradient(fx,top,fx,bot);g.addColorStop(0,'#eaf6ff');g.addColorStop(1,'#bfe3f5');c.fillStyle=g;c.fill();c.clip();
    for(let k=0;k<7;k++){const ph=(t*1.4+k*0.31)%1;c.strokeStyle='rgba(255,255,255,'+(0.35+0.3*(1-ph))+')';c.lineWidth=u*0.06;const sx=fx-u*0.45+k*u*0.15;c.beginPath();c.moveTo(sx,top+(bot-top)*ph*0.7);c.lineTo(sx+(k-3)*u*0.02,top+(bot-top)*(ph*0.7+0.3));c.stroke();}c.restore();
    TH.ell(c,fx,bot+u*0.35,u*2.2,u*0.8,'#2f7fa8');TH.ell(c,fx,bot+u*0.3,u*1.9,u*0.66,'#4aa0c8');for(let k=0;k<7;k++){const ph=(t*0.9+k*0.2)%1;c.fillStyle='rgba(255,255,255,'+(0.55*(1-ph))+')';c.beginPath();c.ellipse(fx+(r()-0.5)*u*1.4,bot+u*0.2+ph*u*0.2,u*(0.3+ph*0.4),u*(0.14+ph*0.18),0,0,7);c.fill();}
    for(let k=0;k<4;k++){const ph=(t*0.5+k*0.25)%1;c.fillStyle='rgba(235,245,250,'+(0.3*(1-ph))+')';c.beginPath();c.ellipse(fx+(k-1.5)*u*0.5,bot-ph*u*1.6,u*(0.5+ph*0.6),u*(0.3+ph*0.4),0,0,7);c.fill();}
    [[-1.5,0.1],[0.6,-0.1],[1.4,0.2]].forEach(([dx,dy],i)=>frFir(c,x+dx*u,y-H+dy*u+wt*0.1,u*0.55,0.7+i*0.05,v+i));for(let k=0;k<5;k++)TH.blob(c,x+(r()-0.5)*wb*2.1,y+wb*0.25+r()*u*0.5,u*(0.35+r()*0.3),u*0.2,'#6f747c',r,7);}},
  mountainPeak:{cat:'landmark',w:4.0,tier:3,weight:3,cost:4,draw(c,x,y,u,v){const r=mulberry(v+6);fsh(c,x,y,u*4.2,u*10);const peak=(px,base,hw,H,snowF)=>{const ap=[px,base-H],L=[px-hw,base],Rr=[px+hw,base],M=[px+hw*0.08,base+hw*0.16];
      TH.poly(c,[L,ap,M],'#8e949c');TH.poly(c,[M,ap,Rr],'#575d68');c.strokeStyle='rgba(25,32,44,.35)';c.lineWidth=u*0.07;c.beginPath();c.moveTo(ap[0],ap[1]);c.lineTo(px-hw*0.4,base-H*0.3);c.moveTo(ap[0],ap[1]);c.lineTo(px+hw*0.25,base-H*0.15);c.moveTo(px-hw*0.25,base-H*0.62);c.lineTo(px-hw*0.55,base-H*0.4);c.stroke();
      const sy=base-H*(1-snowF);const sw=(f)=>hw*(1-f);TH.poly(c,[ap,[px-hw*snowF*1.0,sy],[px-hw*snowF*0.6,sy+H*0.07],[px-hw*snowF*0.3,sy-H*0.02],[px+hw*0.05,sy+H*0.09],[px+hw*snowF*0.4,sy+H*0.02],[px+hw*snowF*0.8,sy+H*0.08],[px+hw*snowF*1.0,sy]],'#f4f8fc');
      TH.poly(c,[ap,[px+hw*0.08,sy+H*0.09],[px+hw*snowF*0.4,sy+H*0.02],[px+hw*snowF*0.8,sy+H*0.08],[px+hw*snowF*1.0,sy]],'#c9d6e4');};
    peak(x+u*3.0,y,u*3.0,u*6.5,0.4);peak(x-u*0.5,y,u*4.6,u*10,0.38);
    TH.ell(c,x,y,u*5.2,u*1.6,'#566e42');[[-4.2,0.5,1.5],[3.8,0.6,1.3],[-2.0,0.9,1.0],[1.6,1.0,1.1]].forEach(([dx,dy,s])=>TH.blob(c,x+dx*u,y+dy*u,u*s*1.4,u*s*0.6,'#4a6e48',r,8));[[-3.4,0.8],[-2.6,1.1],[2.7,0.9],[3.5,0.7],[0.4,1.2]].forEach(([dx,dy],i)=>frFir(c,x+dx*u,y+dy*u,u*0.5,0.8+(i%2)*0.15,v+i));}},
  sawmill:{cat:'landmark',w:3.7,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0,r=mulberry(v+3);fsh(c,x,y,u*3.8,u*6);
    TH.poly(c,[I(2.4,-2.6,0.12),I(5.2,-2.6,0.12),I(5.2,2.4,0.12),I(2.4,2.4,0.12)],'#3f7a9a');TH.poly(c,[I(2.7,-2.4,0.14),I(5.0,-2.4,0.14),I(5.0,2.2,0.14),I(2.7,2.2,0.14)],'#4aa0c8');
    TH.box(c,x,y,u,-3.0,2.4,-2.0,2.0,0,3.0,'#9a6a3c','#6f4a28','#b07a46');logWall(c,x,y,u,-3.0,2.4,2.01,0,3.0);logWallE(c,x,y,u,2.41,-2.0,2.0,0,3.0);
    TH.poly(c,[I(-2.2,2.03,0),I(0.2,2.03,0),I(0.2,2.03,2.2),I(-2.2,2.03,2.2)],'#1c130c');for(let k=0;k<3;k++)TH.ln(c,I(-2.0+k*0.9,2.04,0.4),I(-1.8+k*0.9,2.04,2.0),'rgba(200,200,205,.2)',u*0.05);
    TH.ln(c,I(-2.2,2.2,0.4),I(0.2,2.2,0.4),'#5a5f68',u*0.12);TH.box(c,x,y,u,-1.8,-0.2,2.1,2.6,0.4,0.8,'#7a7f87','#555a62','#9aa0a8');TH.ell(c,...I(-1.0,2.3,1.3),u*0.65,u*0.7,'#c9ced6');TH.ell(c,...I(-1.0,2.3,1.3),u*0.12,u*0.12,'#555a62');
    TH.poly(c,[I(-3.4,2.4,2.9),I(2.8,2.4,2.9),I(2.8,0,5.0),I(-3.4,0,5.0)],'#6b4a2b');for(let k=1;k<6;k++)TH.ln(c,I(-3.4,2.4-k*0.4,2.9+k*0.35),I(2.8,2.4-k*0.4,2.9+k*0.35),'rgba(30,18,6,.45)',u*0.06);TH.poly(c,[I(2.4,-2.0,3.0),I(2.4,2.0,3.0),I(2.4,0,4.9)],'#8a5a33');
    const wc=[2.9,0,2.6],R0=2.3,a0=t*0.8;const pt=(a,rr)=>I(wc[0],rr*Math.cos(a),wc[2]+rr*Math.sin(a));c.strokeStyle='#4a3320';c.lineWidth=u*0.3;c.beginPath();for(let k=0;k<=32;k++){const p=pt(k/32*6.283,R0);k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();c.strokeStyle='#8a5a33';c.lineWidth=u*0.16;c.stroke();
    for(let k=0;k<8;k++){const a=a0+k*0.7854;TH.ln(c,pt(a,0),pt(a,R0),'#6b4a2b',u*0.16);const p=pt(a,R0),q=pt(a+0.22,R0+0.45);TH.poly(c,[p,q,pt(a+0.46,R0)],'#a97d49','#4a3320',u*0.04);}TH.ell(c,...pt(0,0),u*0.28,u*0.28,'#2b1b0e');
    for(let k=0;k<3;k++){const ph=(t*0.7+k*0.33)%1;TH.ln(c,I(3.9+ph*0.6,-2.3+ph*0.4,5.2-ph*3.3),I(4.3+ph*0.6,-2.0+ph*0.4,5.0-ph*3.3),'rgba(235,248,255,.6)',u*0.1);}TH.poly(c,[I(3.5,-2.6,5.2),I(4.6,-2.6,5.2),I(4.6,-1.6,3.4),I(3.5,-1.6,3.4)],'rgba(160,110,60,.5)');
    for(let row=0;row<3;row++)for(let col=0;col<4-row;col++)TH.ln(c,I(-3.4+col*0.62+row*0.3,3.0-row*0.1,0.3+row*0.5),I(-1.9+col*0.62+row*0.3,3.0-row*0.1,0.3+row*0.5),['#9a6a3c','#8a5a33'][(row+col)%2],u*0.46);}},
  stockadeFort:{cat:'landmark',w:4.5,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0,S=3.6,wh=3.4;fsh(c,x,y,u*4.8,u*6);TH.poly(c,[I(-S,-S,0.03),I(S,-S,0.03),I(S,S,0.03),I(-S,S,0.03)],'#a98b62');
    const wallY=(Y,x0,x1,col)=>{for(let X=x0;X<=x1;X+=0.36){const b=I(X,Y,0),tp=I(X,Y,wh);TH.ln(c,b,tp,col,u*0.3);TH.poly(c,[[tp[0]-u*0.17,tp[1]],[tp[0]+u*0.17,tp[1]],[tp[0],tp[1]-u*0.45]],col);}};
    const wallX=(X,y0,y1,col)=>{for(let Y=y0;Y<=y1;Y+=0.36){const b=I(X,Y,0),tp=I(X,Y,wh);TH.ln(c,b,tp,col,u*0.3);TH.poly(c,[[tp[0]-u*0.17,tp[1]],[tp[0]+u*0.17,tp[1]],[tp[0],tp[1]-u*0.45]],col);}};
    const tower=(X,Y,col)=>{TH.box(c,x,y,u,X-0.8,X+0.8,Y-0.8,Y+0.8,0,4.6,'#9a6a3c','#6f4a28','#b07a46');logWall(c,x,y,u,X-0.8,X+0.8,Y+0.81,0,4.6);logWallE(c,x,y,u,X+0.81,Y-0.8,Y+0.8,0,4.6);TH.box(c,x,y,u,X-1.0,X+1.0,Y-1.0,Y+1.0,4.6,4.9,'#a97d49','#7d5a34','#c49858');const ap=I(X,Y,6.4);TH.poly(c,[I(X-1.1,Y+1.1,4.9),I(X+1.1,Y+1.1,4.9),ap],'#5a3b22');TH.poly(c,[I(X+1.1,Y-1.1,4.9),I(X+1.1,Y+1.1,4.9),ap],'#3f2815');TH.poly(c,[I(X-0.3,Y+0.82,3.4),I(X+0.3,Y+0.82,3.4),I(X+0.3,Y+0.82,4.2),I(X-0.3,Y+0.82,4.2)],'#161a22');};
    wallY(-S,-S,S,'#7d5a34');wallX(-S,-S,S,'#6f4a28');tower(-S,-S);
    TH.box(c,x,y,u,-2.3,-0.6,-2.2,-0.6,0,1.7,'#9a6a3c','#6f4a28','#b07a46');TH.poly(c,[I(-2.5,-0.4,1.6),I(-0.4,-0.4,1.6),I(-0.4,-1.4,2.8),I(-2.5,-1.4,2.8)],'#5a3b22');TH.poly(c,[I(-0.4,-2.4,1.6),I(-0.4,-0.4,1.6),I(-0.4,-1.4,2.8)],'#7a5a3a');
    TH.box(c,x,y,u,0.6,2.2,-2.3,-0.9,0,1.5,'#9a6a3c','#6f4a28','#b07a46');TH.poly(c,[I(0.4,-0.7,1.4),I(2.4,-0.7,1.4),I(2.4,-1.6,2.5),I(0.4,-1.6,2.5)],'#6b4a2b');
    const fp=I(0.6,0.2,0);TH.ln(c,fp,[fp[0],fp[1]-u*6.2],'#d5dae6',u*0.1);const wv=Math.sin(t*3)*u*0.12;TH.poly(c,[[fp[0],fp[1]-u*6.2],[fp[0]+u*1.6,fp[1]-u*6.0+wv],[fp[0]+u*1.2,fp[1]-u*5.6+wv*1.3],[fp[0]+u*1.6,fp[1]-u*5.2+wv],[fp[0],fp[1]-u*5.3]],'#2f4f8f');
    tower(S,-S);wallX(S,-S,S,'#7d5a34');tower(-S,S);
    wallY(S,-S,-1.0,'#8a6238');wallY(S,1.0,S,'#8a6238');TH.poly(c,[I(-1.0,S+0.01,0),I(1.0,S+0.01,0),I(1.0,S+0.01,2.8),I(-1.0,S+0.01,2.8)],'#140f0a');[-1,1].forEach(s=>{TH.poly(c,[I(s*1.0,S+0.02,0),I(s*0.45,S+0.5,0),I(s*0.45,S+0.5,2.7),I(s*1.0,S+0.02,2.7)],'#6b4a2b','#3b2616',u*0.05);});TH.ln(c,I(-1.0,S+0.05,2.9),I(1.0,S+0.05,2.9),F.woodD,u*0.3);
    tower(S,S);const f1=I(S,S,6.4);TH.ln(c,f1,[f1[0],f1[1]-u*1.2],'#d5dae6',u*0.08);TH.poly(c,[[f1[0],f1[1]-u*1.2],[f1[0]+u*1.1,f1[1]-u*1.0+Math.sin(t*3+1)*u*0.1],[f1[0],f1[1]-u*0.7]],'#b3342f');}}
  }};
const FRONTIER_HEIGHT={berryBush:'low',fernPatch:'low',cattails:'low',fallenLog:'low',boulders:'low',campfire:'low',canoe:'low',fishRack:'low',firewood:'low',railFence:'low',footbridge:'low',beaverDam:'low',deer:'low',
  pineTree:'mid',firGrove:'mid',aspenTree:'mid',trapperTent:'mid',bear:'mid',logCabin:'mid',lookoutTower:'tall',waterfallCliff:'tall',mountainPeak:'tall',sawmill:'tall',stockadeFort:'tall'};
Object.keys(FRONTIER_PACK.assets).forEach(id=>{FRONTIER_PACK.assets[id].h=FRONTIER_HEIGHT[id]||'low';});
/* ===== JUNGLE PACK ===== */
const J={st:'#bdb9a0',stD:'#8e8a72',stL:'#dad7c3',moss:'#5f8a47',mossD:'#3f6a38',jade:'#2fbf9a',ochre:'#b5532f',turq:'#1fb5a8',dark:'#10161a',clay:'#c4683a'};
const jbox=(c,x,y,u,x0,x1,y0,y1,z0,z1,k)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,k?shade(J.st,k):J.st,k?shade(J.stD,k):J.stD,k?shade(J.stL,k):J.stL);
const jsh=(c,x,y,rx,h)=>{c.fillStyle='rgba(8,26,10,.36)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
const jmoss=(c,x,y,u,r,n)=>{for(let k=0;k<(n||3);k++)TH.ell(c,x+(r()-0.5)*u*1.6,y-r()*u*0.3,u*(0.22+r()*0.25),u*0.11,k%2?'rgba(95,138,71,.85)':'rgba(63,106,56,.85)');};
const jglow=(c,x,y,r,rgb,a)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba('+rgb+','+a+')');g.addColorStop(1,'rgba('+rgb+',0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();};
const glyphs=(c,x,y,u,X0,X1,Y,Z0,Z1,r)=>{for(let z=Z0;z<Z1-0.2;z+=0.42)for(let X=X0;X<X1-0.2;X+=0.5){if(r()<0.25)continue;const a=TH.iso(x,y,u,X+0.05,Y,z),b=TH.iso(x,y,u,X+0.05+0.12+r()*0.2,Y,z+(r()<0.5?0:0.12));TH.ln(c,a,b,'rgba(40,38,26,.45)',u*0.07);TH.ln(c,a,TH.iso(x,y,u,X+0.05,Y,z+0.2),'rgba(40,38,26,.4)',u*0.06);}};
const jmask=(c,x,y,u,X,Y,Z,s)=>{const I=(a,b)=>TH.iso(x,y,u,X+a*s,Y,Z+b*s);TH.poly(c,[I(-0.6,-0.6),I(0.6,-0.6),I(0.6,0.6),I(-0.6,0.6)],'rgba(60,56,40,.3)');[-0.3,0.3].forEach(e=>TH.poly(c,[I(e-0.12,0.15),I(e+0.12,0.15),I(e+0.12,0.35),I(e-0.12,0.35)],'rgba(30,30,22,.7)'));TH.ln(c,I(0,0.1),I(0,-0.15),'rgba(30,30,22,.6)',u*0.08);TH.ln(c,I(-0.3,-0.35),I(0.3,-0.35),'rgba(30,30,22,.7)',u*0.1);[-0.2,0.2].forEach(e=>TH.ln(c,I(e,-0.35),I(e,-0.5),'#e8e4d0',u*0.06));};
const JUNGLE_PACK={id:'jungle',name:'Jungle',ground:'#587c48',groundDark:'#456a3a',border:'#35552c',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},
         3:{budget:11,decals:4,landmark:0.75,pool:['templeShrine','corbelArch','ballCourt']},
         4:{budget:15,decals:5,landmark:1,pool:['stepPyramid','templeShrine','corbelArch','ballCourt'],second:0.45}},
  assets:{
  /* ---------- ground decals ---------- */
  leafLitter:{cat:'decal',w:2.2,tier:1,weight:4,cost:0,draw(c,x,y,u,v){const r=mulberry(v+8);TH.ell(c,x,y,u*2.1,u*0.9,'#3f5f36');for(let k=0;k<26;k++){const a=r()*6.283,rr=Math.sqrt(r());TH.ell(c,x+Math.cos(a)*u*1.9*rr,y+Math.sin(a)*u*0.8*rr,u*0.17,u*0.08,['#6a5a2e','#4e7a3a','#8a6a30','#355a2e','#7a4a2a'][k%5],r()*3);}}},
  lilyPond:{cat:'decal',w:2.2,tier:1,weight:2.5,cost:0,draw(c,x,y,u,v,tm){const r=mulberry(v+4),t=tm||0;TH.ell(c,x,y,u*2.2,u*1.0,'#3a5a3a');TH.ell(c,x,y,u*1.95,u*0.86,'#2f7f78');TH.ell(c,x-u*0.2,y-u*0.05,u*1.5,u*0.6,'#3a9a8e');
    c.strokeStyle='rgba(200,245,235,.5)';c.lineWidth=u*0.05;const ph=(t*0.4+v*0.3)%1;c.beginPath();c.ellipse(x+u*0.5,y+u*0.1,u*(0.2+ph*0.7),u*(0.1+ph*0.32),0,0,7);c.stroke();
    for(let k=0;k<5;k++){const px=x+(r()-0.5)*u*2.8,py=y+(r()-0.5)*u*0.9;TH.ell(c,px,py,u*0.36,u*0.18,'#4aa04a');TH.poly(c,[[px,py],[px+u*0.3,py-u*0.05],[px+u*0.3,py+u*0.05]],'#3a7f4a');if(k%2)TH.ell(c,px,py-u*0.05,u*0.1,u*0.07,'#f9a8d4');}}},
  mossyPaving:{cat:'decal',w:2.4,tier:2,weight:3,cost:0,draw(c,x,y,u,v){const I=(X,Y)=>TH.iso(x,y,u,X,Y,0),r=mulberry(v+2);for(let i=-2;i<=1;i++)for(let j=-1;j<=0;j++){if(r()<0.2)continue;const ox=r()*0.1,oy=r()*0.1;TH.poly(c,[I(i*1.1+ox,j*1.1+oy),I(i*1.1+1.0+ox,j*1.1+oy),I(i*1.1+1.0+ox,j*1.1+1.0+oy),I(i*1.1+ox,j*1.1+1.0+oy)],['#a9a58c','#9a967e','#b4b098'][(i+j+3)%3],'rgba(30,40,25,.5)',u*0.05);}
    for(let k=0;k<8;k++){const p=I(-2.2+r()*4.2,-1+r()*2);TH.ell(c,p[0],p[1],u*(0.2+r()*0.3),u*0.12,'rgba(70,120,55,.8)');}}},
  rootCrawl:{cat:'decal',w:2.2,tier:2,weight:2,cost:0,draw(c,x,y,u,v){const r=mulberry(v+6);for(let k=0;k<7;k++){const a=-2.8+k*0.9+(r()-0.5)*0.4,l=u*(1.2+r()*1.2);c.strokeStyle='#4a3a28';c.lineWidth=u*(0.22-k*0.012);c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+Math.cos(a)*l*0.5,y+Math.sin(a)*l*0.25-u*0.2,x+Math.cos(a)*l,y+Math.sin(a)*l*0.4);c.stroke();}
    TH.ell(c,x,y,u*0.4,u*0.22,'#3a2e20');}},
  /* ---------- jungle flora ---------- */
  fernCluster:{cat:'flora',w:1.6,tier:1,weight:4,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*5+2),t=tm||0;jsh(c,x,y,u*1.6,u*1.5);
    for(let k=0;k<9;k++){const a=-3.1+k*0.42,l=u*(1.7+r()*0.8),sw=Math.sin(t*1.3+k)*u*0.06,ex=x+Math.cos(a)*l+sw,ey=y-Math.abs(Math.sin(a))*l*0.9-u*0.2;c.strokeStyle=k%2?'#3f8f45':'#4aa14e';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(ex-x)*0.45,y-l*0.95,ex,ey);c.stroke();
      for(let q=1;q<8;q++){const f=q/8,px=x+(ex-x)*f*0.9,py=y+(ey-y)*f-Math.sin(f*3.0)*l*0.35;TH.ln(c,[px,py],[px+(f<0.9?-u*0.28:0),py+u*0.2],'#58b85a',u*0.06);TH.ln(c,[px,py],[px+u*0.28,py+u*0.2],'#58b85a',u*0.06);}}}},
  elephantEar:{cat:'flora',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v,tm){const t=tm||0;jsh(c,x,y,u*1.6,u*2.5);[[-0.9,-1.5,0.5,'#2f7f3f'],[0.8,-1.8,-0.4,'#3a8f48'],[0.0,-2.4,0.05,'#4aa356']].forEach(([dx,dy,rot,col],i)=>{const sw=Math.sin(t*1.2+i)*u*0.05;TH.ln(c,[x+dx*u*0.3,y],[x+dx*u+sw,y+dy*u*0.55],'#2a6a34',u*0.12);
      c.save();c.translate(x+dx*u+sw,y+dy*u);c.rotate(rot);c.fillStyle=col;c.beginPath();c.moveTo(0,u*0.9);c.bezierCurveTo(-u*1.4,u*0.3,-u*1.0,-u*1.1,0,-u*1.0);c.bezierCurveTo(u*1.0,-u*1.1,u*1.4,u*0.3,0,u*0.9);c.fill();c.strokeStyle='rgba(20,70,30,.55)';c.lineWidth=u*0.06;c.beginPath();c.moveTo(0,u*0.9);c.lineTo(0,-u*0.9);for(let k=-2;k<=2;k++){if(k){c.moveTo(0,u*0.1);c.lineTo(k*u*0.4,-u*0.5);}}c.stroke();c.restore();});}},
  heliconia:{cat:'flora',w:1.3,tier:1,weight:3,cost:1,draw(c,x,y,u,v){const r=mulberry(v*3+7);jsh(c,x,y,u*1.3,u*2.5);for(let k=0;k<4;k++){const bx=x+(k-1.5)*u*0.45,h=u*(2.0+r()*1.2);TH.ln(c,[bx,y],[bx+(r()-0.5)*u*0.3,y-h],'#2f7a3a',u*0.1);
      TH.poly(c,[[bx-u*0.5,y-h*0.3],[bx-u*0.05,y-h*0.55],[bx-u*0.1,y-h*0.2]],'#3a8f48');const cx=bx+(k%2?0.1:-0.1)*u;for(let q=0;q<4;q++){const py=y-h*(0.7+q*0.1);TH.poly(c,[[cx,py+u*0.3],[cx+(q%2?1:-1)*u*0.55,py+u*0.05],[cx,py-u*0.05],[cx+(q%2?1:-1)*u*0.15,py+u*0.2]],['#e0382b','#f06a2a','#f2b22b','#e0382b'][q],'#8a1d14',u*0.03);}}}},
  bamboo:{cat:'flora',w:1.5,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*11+3),t=tm||0;jsh(c,x,y,u*1.5,u*5);for(let k=0;k<7;k++){const bx=x+(k-3)*u*0.32,h=u*(4.6+r()*1.6),sw=Math.sin(t*1.1+k)*u*0.1+(k-3)*u*0.06,col=['#7aa83a','#8ab944','#6a9a34'][k%3];
      TH.ln(c,[bx,y],[bx+sw,y-h],'#4a6a24',u*0.28);TH.ln(c,[bx,y],[bx+sw,y-h],col,u*0.2);for(let q=1;q<7;q++){const f=q/7;TH.ln(c,[bx+sw*f-u*0.15,y-h*f],[bx+sw*f+u*0.15,y-h*f],'#4a6a24',u*0.06);}
      for(let q=0;q<3;q++){const f=0.7+q*0.1;TH.poly(c,[[bx+sw*f,y-h*f],[bx+sw*f+(q%2?1:-1)*u*1.1,y-h*f-u*0.15],[bx+sw*f+(q%2?1:-1)*u*0.3,y-h*f+u*0.12]],'#9acd4a','#5a8a28',u*0.03);}}}},
  palmTree:{cat:'tree',w:1.8,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*9+4),t=tm||0,H=u*(6.4+r()*1.4),lean=(r()-0.5)*u*2.0;jsh(c,x,y,u*2.0,H);
    c.strokeStyle='#6a5236';c.lineWidth=u*0.55;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*0.2,y-H*0.5,x+lean,y-H);c.stroke();c.strokeStyle='#8a6e4a';c.lineWidth=u*0.3;c.stroke();
    for(let k=1;k<12;k++){const f=k/12,px=(1-f)*(1-f)*x+2*(1-f)*f*(x+lean*0.2)+f*f*(x+lean),py=(1-f)*(1-f)*y+2*(1-f)*f*(y-H*0.5)+f*f*(y-H);TH.ln(c,[px-u*0.25,py],[px+u*0.25,py],'rgba(50,34,18,.5)',u*0.06);}
    const tx=x+lean,ty=y-H;for(let k=0;k<9;k++){const a=-3.1+k*0.52,sw=Math.sin(t*1.5+k*0.8)*0.08,l=u*(2.6+(k%2)*0.5);const ex=tx+Math.cos(a+sw)*l,ey=ty+Math.sin(a+sw)*l*0.5+u*0.8;
      c.strokeStyle=k%2?'#2f7f3a':'#3f9a48';c.lineWidth=u*0.18;c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+(ex-tx)*0.55,ty-u*1.2-Math.abs(Math.sin(a))*u*0.6,ex,ey);c.stroke();
      for(let q=1;q<7;q++){const f=q/7,px=tx+(ex-tx)*f,py=ty+(ey-ty)*f-Math.sin(f*3.14)*u*1.0;TH.ln(c,[px,py],[px-(ey-ty)*0.12-u*0.1,py+u*0.5],'#48a852',u*0.07);TH.ln(c,[px,py],[px+(ey-ty)*0.1+u*0.1,py+u*0.5],'#48a852',u*0.07);}}
    [[-0.25,0.35],[0.25,0.4],[0,0.6]].forEach(([dx,dy])=>TH.ell(c,tx+dx*u,ty+dy*u,u*0.28,u*0.28,'#6a4a22'));}},
  kapokTree:{cat:'tree',w:2.6,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v,tm){const r=mulberry(v*7+5),t=tm||0,H=u*5.2;jsh(c,x,y,u*3.0,u*9);
    for(let k=0;k<5;k++){const a=-2.7+k*0.55,l=u*(1.5+r()*0.7);TH.poly(c,[[x+Math.cos(a)*u*0.2,y-u*2.4],[x+Math.cos(a)*l,y+Math.sin(a)*l*0.28+u*0.1],[x+Math.cos(a)*l*0.5+u*0.3,y+Math.sin(a)*l*0.15+u*0.2],[x+u*0.1,y-u*2.8]],k%2?'#6b5a48':'#7a6853');}
    TH.poly(c,[[x-u*0.7,y-u*0.2],[x-u*0.5,y-H],[x+u*0.5,y-H],[x+u*0.7,y-u*0.2]],'#8a7a66');TH.poly(c,[[x+u*0.1,y-H],[x+u*0.5,y-H],[x+u*0.7,y-u*0.2],[x+u*0.15,y-u*0.2]],'rgba(30,24,16,.35)');
    const cols=['#2f6a3a','#3a7a44','#2a5e34','#438a4c'];[[0,-2.4,3.0,2.1],[-2.3,-1.1,2.1,1.5],[2.3,-1.2,2.1,1.5],[0.1,-0.7,2.6,1.6],[-1.2,-3.4,1.9,1.4],[1.4,-3.2,1.8,1.3]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H+dy*u,u*rx,u*ry,cols[i%4],r,10));
    for(let k=0;k<7;k++){const vx=x+(r()-0.5)*u*5.0,vy=y-H+u*(0.0+r()*1.0),l=u*(1.8+r()*2.2),sw=Math.sin(t*0.9+k)*u*0.1;c.strokeStyle=k%2?'#3f6a3a':'#4a7a3a';c.lineWidth=u*0.07;c.beginPath();c.moveTo(vx,vy);c.quadraticCurveTo(vx+sw,vy+l*0.5,vx+sw*1.5,vy+l);c.stroke();}}},
  /* ---------- ruin props ---------- */
  mossBoulder:{cat:'rock',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*13+3);jsh(c,x,y,u*1.9,u*1.4);[[0.0,0.0,1.0,1.0,'#7d7f70'],[-1.0,0.2,0.65,0.6,'#6e7062'],[0.9,0.25,0.6,0.55,'#8a8c7c']].forEach(([dx,dy,sx,sy,col])=>TH.blob(c,x+dx*u,y-u*0.55*sy+dy*u,u*0.9*sx,u*0.75*sy,col,r,9));
    for(let k=0;k<5;k++)TH.ell(c,x+(r()-0.5)*u*1.5,y-u*(0.2+r()*0.8),u*0.3,u*0.14,'rgba(88,140,64,.85)');}},
  fallenColumn:{cat:'rock',w:2.4,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+2);jsh(c,x,y,u*2.4,u*2);
    [[-2.0,-0.9,0.7],[0.0,0.1,0.65],[1.7,-0.4,0.6]].forEach(([X,Y,rr],i)=>{const a=I(X-0.7,Y,rr),b=I(X+0.7,Y,rr);TH.ln(c,a,b,J.stD,u*rr*2.1);TH.ln(c,a,b,J.st,u*rr*1.7);TH.ln(c,[a[0],a[1]-u*rr*0.4],[b[0],b[1]-u*rr*0.4],J.stL,u*rr*0.5);TH.ell(c,a[0],a[1],u*rr*0.55,u*rr*0.9,J.stD);TH.ell(c,a[0],a[1],u*rr*0.3,u*rr*0.5,'#6e6a56');for(let k=0;k<3;k++){const p=I(X-0.4+k*0.4,Y,rr);TH.ln(c,[p[0],p[1]-u*rr*0.9],[p[0],p[1]+u*rr*0.9],'rgba(50,48,34,.3)',u*0.05);}});
    TH.ell(c,x-u*0.9,y-u*0.5,u*0.8,u*0.2,'rgba(80,130,60,.8)');TH.ell(c,x+u*1.6,y-u*0.35,u*0.6,u*0.16,'rgba(70,120,55,.8)');}},
  stela:{cat:'ruin',w:1.3,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+5);jsh(c,x,y,u*1.3,u*4);jbox(c,x,y,u,-0.9,0.9,-0.5,0.5,0,0.4,-0.1);
    TH.poly(c,[I(0.7,-0.2,0.4),I(0.7,0.2,0.4),I(0.7,0.2,4.0),I(0.7,-0.2,4.0)],J.stD);TH.poly(c,[I(-0.7,-0.2,4.0),I(0.7,-0.2,4.0),I(0.7,0.2,4.0),I(-0.7,0.2,4.0)],J.stL);TH.poly(c,[I(-0.7,0.2,0.4),I(0.7,0.2,0.4),I(0.7,0.2,4.0),I(-0.7,0.2,4.0)],J.st);
    jmask(c,x,y,u,0,0.21,3.0,0.9);glyphs(c,x,y,u,-0.6,0.6,0.21,0.7,2.2,r);jmoss(c,x-u*0.3,y+u*0.2,u,r,3);}},
  glyphBlock:{cat:'ruin',w:1.3,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v+3);jsh(c,x,y,u*1.4,u*2);jbox(c,x,y,u,-1.0,1.0,-0.8,0.8,0,1.6);jmask(c,x,y,u,0,0.81,0.85,0.9);jbox(c,x,y,u,-0.6,0.5,-0.5,0.4,1.6,2.1,-0.05);jmask(c,x,y,u,-0.05,0.41,1.85,0.4);jmoss(c,x,y+u*0.3,u,r,4);}},
  chacMool:{cat:'ruin',w:1.7,tier:3,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+8);jsh(c,x,y,u*1.8,u*2);jbox(c,x,y,u,-1.6,1.6,-0.9,0.9,0,0.6,-0.08);
    jbox(c,x,y,u,-1.0,1.1,-0.5,0.5,0.6,1.3);TH.poly(c,[I(-1.2,-0.4,0.6),I(-1.0,-0.4,0.6),I(-1.0,-0.4,1.1),I(-1.2,-0.4,1.1)],J.st);jbox(c,x,y,u,1.0,1.6,-0.3,0.6,0.9,1.5,0.05);TH.ell(c,...I(1.3,0.15,1.7),u*0.3,u*0.3,J.stL);
    TH.ell(c,...I(0.0,0.0,1.35),u*0.45,u*0.22,'#6e6a56');TH.ell(c,...I(0.0,0.0,1.38),u*0.34,u*0.16,'#2b2a22');[[-0.6,0.45],[-0.6,-0.45]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0.9),I(0.1,Y*0.4,1.25),J.st,u*0.22));jmoss(c,x,y+u*0.3,u,r,4);}},
  jaguarStatue:{cat:'ruin',w:1.5,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const r=mulberry(v+4);jsh(c,x,y,u*1.6,u*2);jbox(c,x,y,u,-1.3,1.3,-0.8,0.8,0,0.7,-0.06);const by=y-u*0.7;
    TH.poly(c,[[x-u*1.1,by],[x-u*1.0,by-u*0.9],[x-u*0.3,by-u*1.2],[x+u*0.5,by-u*1.0],[x+u*0.9,by-u*0.3],[x+u*1.0,by]],J.st);TH.poly(c,[[x+u*0.5,by-u*1.0],[x+u*0.9,by-u*0.3],[x+u*1.0,by],[x+u*0.2,by]],'rgba(40,40,28,.35)');
    TH.ln(c,[x-u*1.1,by-u*0.4],[x-u*1.5,by-u*0.9],J.st,u*0.22);TH.poly(c,[[x+u*0.2,by-u*1.1],[x+u*0.9,by-u*1.5],[x+u*1.4,by-u*1.3],[x+u*1.5,by-u*0.7],[x+u*0.9,by-u*0.4],[x+u*0.4,by-u*0.5]],J.stL);
    TH.poly(c,[[x+u*0.4,by-u*1.5],[x+u*0.5,by-u*1.9],[x+u*0.8,by-u*1.5]],J.stL);TH.ell(c,x+u*1.0,by-u*1.0,u*0.1,u*0.1,J.jade);for(let k=0;k<5;k++)TH.ell(c,x-u*0.7+k*u*0.3,by-u*(0.5+(k%2)*0.35),u*0.08,u*0.07,'rgba(40,40,28,.5)');jmoss(c,x,y+u*0.2,u,r,3);}},
  serpentHead:{cat:'ruin',w:1.9,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v){const r=mulberry(v+6);jsh(c,x,y,u*2.0,u*3);
    c.strokeStyle=J.stD;c.lineWidth=u*1.2;c.lineCap='round';c.beginPath();c.moveTo(x+u*2.6,y);c.quadraticCurveTo(x+u*2.2,y-u*1.8,x+u*0.9,y-u*1.4);c.stroke();c.strokeStyle=J.st;c.lineWidth=u*0.9;c.stroke();
    for(let k=0;k<5;k++){const f=k/5;TH.ln(c,[x+u*(2.6-f*1.5),y-u*(f*1.6)-u*0.2],[x+u*(2.6-f*1.5)+u*0.25,y-u*(f*1.6)-u*0.1],'rgba(50,48,34,.4)',u*0.07);}
    jbox(c,x,y,u,-1.4,0.9,-0.9,0.9,0,2.2);TH.poly(c,[[x-u*1.3,y-u*1.5],[x-u*0.4,y-u*2.9],[x+u*0.4,y-u*2.9],[x+u*1.3,y-u*1.5]],J.stL);
    jmask(c,x,y,u,-0.25,0.91,1.2,0.9);TH.ell(c,x-u*0.5,y-u*1.8,u*0.2,u*0.2,J.jade);TH.ell(c,x+u*0.15,y-u*1.8,u*0.2,u*0.2,J.jade);
    TH.poly(c,[[x-u*1.1,y-u*0.3],[x+u*0.7,y-u*0.3],[x+u*0.5,y+u*0.5],[x-u*0.9,y+u*0.5]],'#2b2a22');[[-0.9,0.5],[-0.3,0.5],[0.3,0.5]].forEach(([dx,dy])=>TH.poly(c,[[x+dx*u-u*0.15,y+dy*u-u*0.8],[x+dx*u+u*0.15,y+dy*u-u*0.8],[x+dx*u,y+dy*u-u*0.05]],'#f0ecd8'));TH.poly(c,[[x-u*0.2,y+u*0.1],[x+u*0.2,y+u*0.1],[x,y+u*0.9]],'#b3342f');
    for(let k=0;k<5;k++){const a=-0.4-k*0.35;TH.poly(c,[[x-u*0.4+k*u*0.25,y-u*2.9],[x-u*0.7+k*u*0.4,y-u*3.8-(k%2)*u*0.4],[x-u*0.1+k*u*0.3,y-u*2.9]],[J.turq,J.jade,'#e0382b','#f2b22b','#2f8fd0'][k]);}jmoss(c,x,y+u*0.3,u,r,4);}},
  stoneAltar:{cat:'ruin',w:1.6,tier:3,weight:2.5,cost:1,max:1,draw(c,x,y,u,v,tm){const r=mulberry(v+9),t=tm||0;jsh(c,x,y,u*1.7,u*2);jbox(c,x,y,u,-1.4,1.4,-1.0,1.0,0,0.5,-0.08);jbox(c,x,y,u,-1.1,1.1,-0.7,0.7,0.5,1.5);jmask(c,x,y,u,0,0.71,0.95,0.6);
    TH.ell(c,x,y-u*1.65,u*0.8,u*0.34,'#5e5b48');TH.ell(c,x,y-u*1.7,u*0.65,u*0.27,'#2b2a22');jglow(c,x,y-u*2.3,u*2.4,'255,160,60',0.4+0.1*Math.sin(t*9+v));
    [[0,1.1,0.8],[-0.3,0.75,0.55],[0.3,0.8,0.6]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*11+i*2+v)*u*0.1;TH.poly(c,[[x+dx*u-u*0.3*w,y-u*1.7],[x+dx*u+f,y-u*(1.7+h*1.2)],[x+dx*u+u*0.3*w,y-u*1.7]],i?'#fbbf24':'#f97316');});jmoss(c,x,y+u*0.3,u,r,3);}},
  /* ---------- props ---------- */
  torchPost:{cat:'prop',w:0.9,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v,tm){const t=tm||0;jsh(c,x,y,u,u*4);jbox(c,x,y,u,-0.5,0.5,-0.5,0.5,0,0.5,-0.06);TH.ln(c,[x,y-u*0.4],[x,y-u*2.6],'#6b5a3e',u*0.34);TH.ln(c,[x,y-u*1.2],[x,y-u*1.6],J.turq,u*0.4);
    TH.poly(c,[[x-u*0.5,y-u*2.5],[x+u*0.5,y-u*2.5],[x+u*0.35,y-u*3.0],[x-u*0.35,y-u*3.0]],'#4a3d2a');jglow(c,x,y-u*3.5,u*2.4,'255,160,60',0.4+0.1*Math.sin(t*10+v));
    [[0,1.1,0.8],[-0.25,0.75,0.55],[0.25,0.8,0.6]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*12+i*2+v)*u*0.1;TH.poly(c,[[x+dx*u-u*0.3*w,y-u*3.0],[x+dx*u+f,y-u*(3.0+h*1.2)],[x+dx*u+u*0.3*w,y-u*3.0]],i?'#fbbf24':'#f97316');});}},
  clayPots:{cat:'prop',w:1.4,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u,v){jsh(c,x,y,u*1.5,u*1.5);const pot=(px,py,s,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(px-u*0.45*s,py-u*1.1*s);c.bezierCurveTo(px-u*0.9*s,py-u*0.7*s,px-u*0.7*s,py,px-u*0.3*s,py);c.lineTo(px+u*0.3*s,py);c.bezierCurveTo(px+u*0.7*s,py,px+u*0.9*s,py-u*0.7*s,px+u*0.45*s,py-u*1.1*s);c.closePath();c.fill();
      c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.moveTo(px+u*0.1*s,py-u*1.1*s);c.bezierCurveTo(px+u*0.5*s,py-u*0.9*s,px+u*0.6*s,py-u*0.2*s,px+u*0.3*s,py);c.lineTo(px+u*0.1*s,py);c.fill();TH.ell(c,px,py-u*1.1*s,u*0.45*s,u*0.17*s,'#2a1c12');TH.ln(c,[px-u*0.7*s,py-u*0.55*s],[px+u*0.7*s,py-u*0.55*s],J.turq,u*0.1*s);TH.ln(c,[px-u*0.55*s,py-u*0.3*s],[px+u*0.55*s,py-u*0.3*s],'#f2d24a',u*0.07*s);};
    pot(x-u*0.9,y+u*0.1,0.9,'#c4683a');pot(x+u*0.5,y+u*0.2,1.15,'#b5532f');TH.ell(c,x-u*0.1,y+u*0.5,u*0.55,u*0.2,'#a5502f');TH.ell(c,x-u*0.1,y+u*0.38,u*0.4,u*0.13,'#e8b04a');[[-0.2,0.3],[0.05,0.28]].forEach(([dx,dy],i)=>TH.ell(c,x+dx*u,y+dy*u,u*0.18,u*0.18,['#f06a2a','#f2c230'][i]));}},
  macaw:{cat:'prop',w:0.9,tier:1,weight:3,cost:1,max:1,draw(c,x,y,u,v,tm){const t=tm||0,by=y-u*1.8;jsh(c,x,y,u*0.8,u*3);TH.ln(c,[x,y],[x,y-u*1.7],'#6b5a3e',u*0.2);TH.ln(c,[x-u*0.9,y-u*1.7],[x+u*0.9,y-u*1.7],'#6b5a3e',u*0.16);
    TH.poly(c,[[x-u*0.3,by-u*0.3],[x-u*0.9,by+u*1.1],[x-u*0.55,by+u*1.3],[x-u*0.2,by+u*0.2]],'#2f6fd0');TH.poly(c,[[x-u*0.4,by-u*0.3],[x-u*0.7,by+u*0.9],[x-u*0.5,by+u*1.0],[x-u*0.25,by+u*0.1]],'#e0382b');
    TH.ell(c,x,by-u*0.5,u*0.5,u*0.8,'#d9342b',-0.2);TH.ell(c,x+u*0.15,by-u*0.35,u*0.28,u*0.5,'#f2c230',-0.2);TH.poly(c,[[x-u*0.4,by-u*0.5],[x-u*0.1,by-u*0.9],[x+u*0.15,by-u*0.2]],'#2f6fd0');
    const hb=Math.sin(t*3+v)*u*0.04;TH.ell(c,x+u*0.2,by-u*1.35+hb,u*0.3,u*0.3,'#d9342b');TH.ell(c,x+u*0.3,by-u*1.35+hb,u*0.16,u*0.18,'#f8fafc');TH.ell(c,x+u*0.32,by-u*1.38+hb,u*0.05,u*0.05,'#161616');TH.poly(c,[[x+u*0.45,by-u*1.5+hb],[x+u*0.85,by-u*1.3+hb],[x+u*0.5,by-u*1.15+hb]],'#3a3a3a');TH.poly(c,[[x+u*0.45,by-u*1.5+hb],[x+u*0.8,by-u*1.38+hb],[x+u*0.5,by-u*1.32+hb]],'#f0e8d0');
    TH.ln(c,[x-u*0.1,by+u*0.1],[x-u*0.1,by+u*0.4],'#4a4a4a',u*0.06);TH.ln(c,[x+u*0.2,by+u*0.1],[x+u*0.2,by+u*0.4],'#4a4a4a',u*0.06);}},
  tikiTotem:{cat:'prop',w:1.0,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const r=mulberry(v+2);jsh(c,x,y,u,u*5);TH.ln(c,[x,y],[x,y-u*5.2],'#5a4028',u*1.1);TH.ln(c,[x-u*0.15,y],[x-u*0.15,y-u*5.1],'#7a5836',u*0.35);
    ['#b5532f','#1fb5a8','#e0b53a','#b5532f'].forEach((col,i)=>{const cy=y-u*(0.9+i*1.2);TH.poly(c,[[x-u*0.55,cy-u*0.5],[x+u*0.55,cy-u*0.5],[x+u*0.55,cy+u*0.5],[x-u*0.55,cy+u*0.5]],col,'#2a1c12',u*0.05);[-0.2,0.2].forEach(e=>{TH.ell(c,x+e*u,cy-u*0.1,u*0.13,u*0.13,'#f8fafc');TH.ell(c,x+e*u,cy-u*0.1,u*0.06,u*0.06,'#161616');});TH.ln(c,[x-u*0.25,cy+u*0.22],[x+u*0.25,cy+u*0.22],'#2a1c12',u*0.1);TH.ln(c,[x,cy],[x,cy+u*0.12],'#2a1c12',u*0.07);});
    TH.poly(c,[[x-u*0.4,y-u*5.15],[x,y-u*5.9],[x+u*0.4,y-u*5.15]],'#e0382b');TH.poly(c,[[x-u*1.1,y-u*3.5],[x-u*0.55,y-u*3.9],[x-u*0.55,y-u*3.1]],'#1fb5a8');TH.poly(c,[[x+u*1.1,y-u*3.5],[x+u*0.55,y-u*3.9],[x+u*0.55,y-u*3.1]],'#1fb5a8');}},
  smallShrine:{cat:'structure',w:2.3,tier:3,weight:3,cost:2,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+3);jsh(c,x,y,u*2.6,u*4);jbox(c,x,y,u,-2.2,2.2,-2.0,2.0,0,0.7,-0.06);jbox(c,x,y,u,-1.8,1.8,-1.6,1.6,0.7,1.3,-0.03);
    jbox(c,x,y,u,-1.3,1.3,-1.1,1.1,1.3,3.5);TH.poly(c,[I(-0.5,1.11,1.3),I(0.5,1.11,1.3),I(0.5,1.11,2.8),I(-0.5,1.11,2.8)],J.dark);TH.ln(c,I(-0.55,1.12,2.85),I(0.55,1.12,2.85),J.stL,u*0.14);glyphs(c,x,y,u,-1.2,-0.6,1.11,1.5,3.2,r);glyphs(c,x,y,u,0.6,1.2,1.11,1.5,3.2,r);
    jbox(c,x,y,u,-1.5,1.5,-1.3,1.3,3.5,3.9,0.05);jbox(c,x,y,u,-0.8,0.8,-0.4,0.4,3.9,5.3);[[-0.4,4.3],[0.3,4.7],[-0.2,5.0]].forEach(([X,Z])=>TH.poly(c,[I(X,0.41,Z),I(X+0.25,0.41,Z),I(X+0.25,0.41,Z+0.3),I(X,0.41,Z+0.3)],J.dark));
    for(let k=0;k<9;k++)TH.ln(c,I(-0.5,1.8+k*0.0,0),I(0.5,1.8,0),'rgba(0,0,0,0)',1);jmoss(c,x-u*1.3,y+u*0.9,u,r,4);jmoss(c,x+u*1.1,y+u*0.5,u,r,3);}},
  /* ---------- landmarks ---------- */
  stepPyramid:{cat:'landmark',w:4.6,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+3),n=6,th=1.15,top=n*th,t=tm||0;jsh(c,x,y,u*5.2,u*9);
    for(let i=0;i<n;i++){const s=4.4-i*0.62;jbox(c,x,y,u,-s,s,-s,s,i*th,(i+1)*th,i%2?-0.02:0.03);TH.ln(c,I(-s,s,(i+1)*th),I(s,s,(i+1)*th),'rgba(255,255,240,.22)',u*0.07);
      for(let k=-3;k<=3;k++){if(Math.abs(k*s*0.3)<1.2)continue;const X=k*s*0.3;TH.poly(c,[I(X-0.15,s+0.01,i*th+0.3),I(X+0.15,s+0.01,i*th+0.3),I(X+0.15,s+0.01,i*th+0.75),I(X-0.15,s+0.01,i*th+0.75)],'rgba(30,34,24,.5)');}
      if(i<4)glyphs(c,x,y,u,-s+0.3,-1.2,s+0.01,i*th+0.15,(i+1)*th-0.1,r);}
    const Ya=4.6,Yb=1.4;TH.poly(c,[I(-0.85,Ya,0),I(0.85,Ya,0),I(0.85,Yb,top),I(-0.85,Yb,top)],'#d0ccb4');for(let k=1;k<30;k++){const f=k/30;TH.ln(c,I(-0.85,Ya+(Yb-Ya)*f,top*f),I(0.85,Ya+(Yb-Ya)*f,top*f),'rgba(70,66,48,.4)',u*0.04);}
    [-1,1].forEach(s=>TH.ln(c,I(s*1.0,Ya,0.25),I(s*1.0,Yb,top+0.25),J.stL,u*0.34));TH.poly(c,[I(-1.0,Ya,0),I(-0.85,Ya,0),I(-0.85,Yb,top),I(-1.0,Yb,top)],'rgba(30,30,20,.22)');
    const ts=1.5;jbox(c,x,y,u,-ts,ts,-ts,ts,top,top+1.8);TH.poly(c,[I(-0.5,ts+0.01,top),I(0.5,ts+0.01,top),I(0.5,ts+0.01,top+1.35),I(-0.5,ts+0.01,top+1.35)],J.dark);jmask(c,x,y,u,-1.0,ts+0.01,top+0.9,0.5);jmask(c,x,y,u,1.0,ts+0.01,top+0.9,0.5);
    jbox(c,x,y,u,-ts-0.15,ts+0.15,-ts-0.15,ts+0.15,top+1.8,top+2.1,0.06);jbox(c,x,y,u,-0.95,0.95,-0.5,0.5,top+2.1,top+3.4);[[-0.5,2.5],[0.2,2.9],[-0.2,3.1]].forEach(([X,Z])=>TH.poly(c,[I(X,0.51,top+Z-0.1),I(X+0.3,0.51,top+Z-0.1),I(X+0.3,0.51,top+Z+0.2),I(X,0.51,top+Z+0.2)],J.dark));
    for(let k=0;k<10;k++){const s=4.3-r()*3.2,i=Math.floor(r()*4);TH.blob(c,...I(-s+r()*1.5,s+0.05,i*th+0.5),u*(0.4+r()*0.5),u*0.22,k%2?'#4a7a3a':'#5f8a47',r,7);}
    const f=I(0,0,top+3.4);jglow(c,f[0],f[1]-u*0.5,u*2.4,'255,160,60',0.25+0.08*Math.sin(t*6));}},
  templeShrine:{cat:'landmark',w:3.0,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+5),n=3,th=1.1,top=n*th;jsh(c,x,y,u*3.3,u*6);
    for(let i=0;i<n;i++){const s=3.0-i*0.6;jbox(c,x,y,u,-s,s,-s,s,i*th,(i+1)*th,i%2?-0.02:0.03);TH.ln(c,I(-s,s,(i+1)*th),I(s,s,(i+1)*th),'rgba(255,255,240,.22)',u*0.07);glyphs(c,x,y,u,-s+0.3,-0.8,s+0.01,i*th+0.15,(i+1)*th-0.1,r);}
    const Ya=3.2,Yb=1.3;TH.poly(c,[I(-0.7,Ya,0),I(0.7,Ya,0),I(0.7,Yb,top),I(-0.7,Yb,top)],'#d0ccb4');for(let k=1;k<18;k++){const f=k/18;TH.ln(c,I(-0.7,Ya+(Yb-Ya)*f,top*f),I(0.7,Ya+(Yb-Ya)*f,top*f),'rgba(70,66,48,.4)',u*0.04);}
    const ts=1.2;jbox(c,x,y,u,-ts,ts,-ts,ts,top,top+1.6);TH.poly(c,[I(-0.45,ts+0.01,top),I(0.45,ts+0.01,top),I(0.45,ts+0.01,top+1.2),I(-0.45,ts+0.01,top+1.2)],J.dark);jbox(c,x,y,u,-ts-0.12,ts+0.12,-ts-0.12,ts+0.12,top+1.6,top+1.9,0.06);jbox(c,x,y,u,-0.8,0.8,-0.4,0.4,top+1.9,top+3.0);
    [[-0.4,2.3],[0.2,2.6]].forEach(([X,Z])=>TH.poly(c,[I(X,0.41,top+Z-0.1),I(X+0.25,0.41,top+Z-0.1),I(X+0.25,0.41,top+Z+0.2),I(X,0.41,top+Z+0.2)],J.dark));
    for(let k=0;k<8;k++)TH.blob(c,...I(-2.6+r()*2.0,3.0+0.05,r()*2.2+0.4),u*(0.4+r()*0.5),u*0.22,k%2?'#4a7a3a':'#5f8a47',r,7);jmoss(c,x+u*1.8,y+u*0.8,u,r,4);}},
  ballCourt:{cat:'landmark',w:4.0,tier:3,weight:2.5,cost:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+7);jsh(c,x,y,u*4,u*5);TH.poly(c,[I(-3.4,-1.0,0),I(3.4,-1.0,0),I(3.4,1.0,0),I(-3.4,1.0,0)],'#c9b98a');for(let k=0;k<12;k++)TH.ln(c,I(-3.2+k*0.58,-0.9,0),I(-3.2+k*0.58,0.9,0),'rgba(100,80,40,.25)',u*0.05);TH.ln(c,I(-3.4,0,0),I(3.4,0,0),'rgba(100,80,40,.45)',u*0.07);
    jbox(c,x,y,u,-3.6,3.6,-3.2,-1.5,0,2.8);TH.poly(c,[I(-3.6,-1.5,2.8),I(3.6,-1.5,2.8),I(3.6,-0.9,0),I(-3.6,-0.9,0)],J.st);for(let k=1;k<7;k++){const f=k/7;TH.ln(c,I(-3.6,-1.5+0.6*f,2.8*(1-f)),I(3.6,-1.5+0.6*f,2.8*(1-f)),'rgba(60,56,40,.22)',u*0.05);}
    glyphs(c,x,y,u,-3.4,-1.2,-0.91,0.2,1.8,r);const rc=I(0,-1.5,3.9);c.strokeStyle='#8e8a72';c.lineWidth=u*0.55;c.beginPath();for(let a=0;a<=24;a++){const t=a/24*6.283,p=I(Math.cos(t)*0.9,-1.5,3.9+Math.sin(t)*0.9);a?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();c.strokeStyle=J.stL;c.lineWidth=u*0.2;c.stroke();jmask(c,x,y,u,1.9,-1.49,2.1,0.6);
    jbox(c,x,y,u,-3.6,3.6,1.5,3.2,0,1.9,-0.04);TH.poly(c,[I(-3.6,1.5,1.9),I(3.6,1.5,1.9),I(3.6,1.0,1.4),I(-3.6,1.0,1.4)],'#a9a58c');glyphs(c,x,y,u,-3.4,3.2,3.21,0.3,1.6,r);
    jbox(c,x,y,u,-3.9,-3.2,-0.6,0.6,0,1.4,0.04);jbox(c,x,y,u,3.2,3.9,-0.6,0.6,0,1.4,0.04);for(let k=0;k<9;k++)TH.blob(c,...I(-3.4+r()*6.8,r()<0.5?-2.4:2.5,2.8+r()*0.1),u*(0.3+r()*0.4),u*0.18,k%2?'#4a7a3a':'#5f8a47',r,7);}},
  corbelArch:{cat:'landmark',w:3.2,tier:3,weight:3,cost:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+4);jsh(c,x,y,u*3.2,u*6);TH.poly(c,[I(-1.8,0.0,0),I(1.8,0.0,0),I(0,0.0,5.0)],'#0f1514');
    for(let i=0;i<6;i++){const z0=i*0.95,z1=z0+0.95;jbox(c,x,y,u,-3.1,-1.8+0.42*i,-0.9,0.9,z0,z1,i%2?-0.03:0.02);if(i<4)jbox(c,x,y,u,1.8-0.42*i,3.1,-0.9,0.9,z0,z1,i%2?0.02:-0.03);}
    jbox(c,x,y,u,1.2,3.1,-0.9,0.9,3.8,4.2,-0.04);for(let k=0;k<5;k++)jbox(c,x,y,u,0.6+r()*2.2,1.0+r()*2.2,0.5+r()*0.9,0.8+r()*1.1,0,0.4+r()*0.5,-0.1+r()*0.15);
    jbox(c,x,y,u,-1.3,1.3,-0.7,0.7,5.7,6.2,0.04);jbox(c,x,y,u,-0.5,0.5,-0.3,0.3,6.2,7.5);[[-0.2,6.5],[0.1,6.9]].forEach(([X,Z])=>TH.poly(c,[I(X-0.1,0.31,Z),I(X+0.15,0.31,Z),I(X+0.15,0.31,Z+0.25),I(X-0.1,0.31,Z+0.25)],J.dark));
    glyphs(c,x,y,u,-3.0,-2.0,0.91,0.3,4.0,r);jmask(c,x,y,u,-2.45,0.91,4.2,0.55);
    for(let k=0;k<8;k++){const sx=-3.0+r()*6;TH.ln(c,I(sx,0.95,3.0+r()*2),I(sx+(r()-0.5)*0.3,0.95,1.0+r()*1.5),r()<0.5?'#3f6a3a':'#4a7a3a',u*0.07);}jmoss(c,x-u*2.2,y+u*0.8,u,r,4);jmoss(c,x+u*2.0,y+u*0.6,u,r,3);}}
  }};
const JUNGLE_HEIGHT={fernCluster:'low',elephantEar:'low',heliconia:'low',mossBoulder:'low',fallenColumn:'low',glyphBlock:'low',chacMool:'low',jaguarStatue:'low',serpentHead:'low',stoneAltar:'low',torchPost:'low',clayPots:'low',macaw:'low',
  bamboo:'mid',palmTree:'mid',kapokTree:'mid',stela:'mid',tikiTotem:'mid',smallShrine:'mid',stepPyramid:'tall',templeShrine:'tall',ballCourt:'tall',corbelArch:'tall'};
Object.keys(JUNGLE_PACK.assets).forEach(id=>{JUNGLE_PACK.assets[id].h=JUNGLE_HEIGHT[id]||'low';});
const KEEP_OUT={rx:0.52,ry:0.34};   // central ellipse (x R) reserved for the ride or building sprite
/* opts.avoid = [{x,y,r}] circles (tile-local px) to keep free, used instead of the central ellipse when the tile belongs to a two-tile ride */
function placeThemeAssets(pack,tier,R,seed,opts){
  opts=opts||{};const avoid=opts.avoid||null;
  const rnd=mulberry(seed*7919+tier*131), u=R*0.068, T=pack.tiers[tier], out=[], decals=[], TAU=Math.PI*2;
  if(!T)return {assets:out,decals,u};
  const inside=(x,y,k)=>{const X=Math.abs(x)/R,Y=Math.abs(y)/(0.58*R);return X<=0.866*k&&Y<=k-X/1.732;};
  const ids=Object.keys(pack.assets), cnt={};
  const free=(x,y,w)=>out.every(o=>Math.hypot(o.x-x,(o.y-y)*1.7)>(o.w+w)*u*0.8);
  const clearOfCenter=(x,y,w,h)=>{if(avoid){const kk=h==='tall'?0.75:0.85;for(const a of avoid){if(Math.hypot(x-a.x,(y-a.y)*1.7)<a.r+w*u*kk)return false;}return true;}const kx=h==='tall'?0.28:0.75,ky=h==='tall'?0.18:0.4,ex=R*KEEP_OUT.rx+w*u*kx,ey=R*KEEP_OUT.ry+w*u*ky;return x*x/(ex*ex)+y*y/(ey*ey)>1;};
  const zoneOK=(a,x,y)=>{const h=a.h||'low';if(h==='low')return true;const ax=Math.abs(x)/R;
    if(h==='tall')return y<R*0.12&&ax>(y>=-R*0.12?0.55:0.4);
    if(y>R*0.12)return h==='mid'&&ax>0.5;if(y>=-R*0.12)return h==='mid'||ax>0.55;return true;};
  const ringPoint=(tmax)=>{const th=rnd()*TAU,dx=Math.cos(th),dy=Math.sin(th);let lo=0,hi=R*1.2;
    for(let i=0;i<12;i++){const m=(lo+hi)/2;if(inside(dx*m,dy*m,0.9))lo=m;else hi=m;}const t=0.5+rnd()*((tmax||1)-0.5);return[dx*lo*t,dy*lo*t];};
  const spot=a=>{for(let i=0;i<120;i++){const p=ringPoint(a.h==='tall'?0.8:a.h==='mid'?0.92:1);if(clearOfCenter(p[0],p[1],a.w,a.h)&&zoneOK(a,p[0],p[1])&&free(p[0],p[1],a.w))return p;}return null;};
  const add=(id,x,y)=>{const a=pack.assets[id];out.push({id,x,y,v:Math.floor(rnd()*1000),w:a.w});cnt[id]=(cnt[id]||0)+1;};
  for(let i=0;i<Math.round(T.decals*(opts.decalScale==null?1:opts.decalScale));i++){const pool=ids.filter(id=>pack.assets[id].cat==='decal'&&pack.assets[id].tier<=tier),id=pool[Math.floor(rnd()*pool.length)];
    for(let t=0;t<40;t++){const p=ringPoint();if(clearOfCenter(p[0],p[1],pack.assets[id].w*0.5)){decals.push({id,x:p[0],y:p[1],v:Math.floor(rnd()*1000)});break;}}}
  let budget=Math.max(0,Math.round(T.budget*(opts.budgetScale==null?1:opts.budgetScale)));const maxW=opts.maxW==null?1e9:opts.maxW;
  const land=()=>{let id=T.pool[Math.floor(rnd()*T.pool.length)];for(let q=0;q<8&&cnt[id];q++)id=T.pool[Math.floor(rnd()*T.pool.length)];
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}};
  if(!opts.noLandmarks&&T.pool.length&&rnd()<T.landmark){land();if(T.second&&rnd()<T.second)land();}
  let guard=0;while(budget>0&&guard++<500){const pool=ids.filter(id=>{const a=pack.assets[id];return a.cat!=='decal'&&a.cat!=='landmark'&&a.tier<=tier&&a.cost<=budget&&a.w<=maxW&&(cnt[id]||0)<(a.max||3);});
    if(!pool.length)break;let tot=0;pool.forEach(id=>tot+=pack.assets[id].weight);let pick=rnd()*tot,id=pool[0];for(const q of pool){pick-=pack.assets[q].weight;if(pick<=0){id=q;break;}}
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}else{cnt[id]=99;}}
  return {assets:out,decals,u};
}
function drawThemeGround(ctx,cx,cy,R,pack,border){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);ctx[i?'lineTo':'moveTo'](cx+R*Math.cos(a),cy+R*Math.sin(a)*0.58);}ctx.closePath();
  ctx.fillStyle=pack.ground;ctx.fill();ctx.lineWidth=Math.max(1.5,R*0.03);ctx.strokeStyle=border||pack.border;ctx.stroke();}
function drawThemeDecals(ctx,cx,cy,pack,pl,tm){pl.decals.forEach(d=>pack.assets[d.id].draw(ctx,cx+d.x,cy+d.y,pl.u,d.v,tm||0));}
/* layer: 'back' (y<0, draw BEFORE the ride sprite), 'front' (y>=0, draw AFTER it) or omit for all, sorted by y */
function drawThemeAssets(ctx,cx,cy,pack,pl,tm,layer){pl.assets.filter(o=>layer==='back'?o.y<0:layer==='front'?o.y>=0:true).sort((a,b)=>a.y-b.y).forEach(o=>pack.assets[o.id].draw(ctx,cx+o.x,cy+o.y,pl.u,o.v,tm||0));}
function drawThemedTile(ctx,cx,cy,R,pack,tier,seed,tm,border,rideFn){drawThemeGround(ctx,cx,cy,R,pack,border);const pl=placeThemeAssets(pack,tier,R,seed);
  drawThemeDecals(ctx,cx,cy,pack,pl,tm);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'back');if(rideFn)rideFn(ctx,cx,cy,R);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'front');}
/* ===== END PACK CODE ===== */

/* ===== STATIC MODERN WOODEN COASTER (GCI style; two-hex sprites, baked once) =====
 * A twister layout: the circuit loops over and under itself three times (it is not an out-and-back). The look comes from the structure: a continuous lattice trestle (posts, ledgers, X-bracing) under the whole track, so the lift hill is a big
 * triangular wall. The track weaves low and twisty, banked from its own curvature, with a big banked turnaround and a run of airtime hills.
 *   drawModernWoodSide(ctx, cx, cy, R, {accent})                 two hexes side by side (E-W)
 *   drawModernWoodDiag(ctx, cx, cy, R, {accent, dir})            dir 'NW-SE' (default) or 'NE-SW' (mirrored)
 *   modernWoodFootprint(R, mode, dir) -> {tiles, circles};  footprintForTile(fp, i) -> circles for placeThemeAssets(..., {avoid})
 *   sceneryInFront(circles, x, y) -> true when the scenery item is in FRONT of the ride (draw it after the ride, everything else before)
 */
const MW_KNOTS=[[0,0.05,0],[0.03,0.05,0],[0.05,0.15,9],[0.12,0.9,9.5],[0.128,0.985,3],[0.139,0.985,-3],[0.15,0.8,-15],[0.17,0.35,-25],[0.19,0.07,-13],[0.205,0.045,0],
  [0.24,0.22,6],[0.275,0.34,0],[0.30,0.2,-6],[0.325,0.06,-5],[0.34,0.045,0],
  [0.37,0.25,7],[0.41,0.45,0],[0.45,0.28,-8],[0.475,0.06,-6],[0.49,0.045,0],
  [0.52,0.045,0],[0.55,0.08,2],[0.58,0.06,-1],[0.64,0.07,0],[0.68,0.28,6],[0.70,0.30,0],[0.73,0.2,-6],[0.755,0.08,-4],
  [0.78,0.08,0],[0.82,0.24,5],[0.85,0.30,0],[0.88,0.18,-6],[0.91,0.05,-3],[0.93,0.045,0],[1.0,0.05,0]];
function mwZ(f){const K=MW_KNOTS;let i=0;while(i<K.length-2&&f>K[i+1][0])i++;const a=K[i],b=K[i+1],dx=b[0]-a[0],t=Math.max(0,Math.min(1,(f-a[0])/dx)),t2=t*t,t3=t2*t;
  return(2*t3-3*t2+1)*a[1]+(t3-2*t2+t)*dx*a[2]+(-2*t3+3*t2)*b[1]+(t3-t2)*dx*b[2];}
/* plan waypoints (u along the long axis, v across), a closed circuit: station -> lift along the back -> crest -> far turn -> hill back along the middle ->
 * swoop UNDER the start of the lift -> low front run -> curl UNDER the crest -> centre hill OVER the back-side track -> sweep round the left end -> station */
const MW_PLAN=[[-0.90,-0.80],[-0.55,-0.82],[-0.10,-0.80],[0.38,-0.78],[0.70,-0.72],[0.95,-0.45],[0.98,-0.02],[0.80,0.32],[0.45,0.42],[0.10,0.32],[-0.22,0.06],[-0.38,-0.36],[-0.30,-0.80],[-0.05,-1.02],[0.30,-0.98],
  [0.62,-0.62],[0.62,-0.20],[0.30,0.02],[-0.05,0.02],[-0.38,0.30],[-0.70,0.62],[-0.95,0.40],[-1.02,0.0],[-0.98,-0.40]];
function mwLayout(R,mode){
  mwLayout._c=mwLayout._c||{};const key=mode+R;if(mwLayout._c[key])return mwLayout._c[key];
  const side=mode==='side',N=900,A=side?1.42*R:1.0*R,B=side?0.46*R:0.35*R,zsc=0.92*Math.min(1,A/(1.42*R)+0.1),k=side?1.0:0.9;
  const ax=side?[1,0]:[0.706,0.709],lt=side?[0,-1]:[0.706,-0.709],hexes=side?[[-0.866*R,0],[0.866*R,0]]:[[-0.433*R,-0.435*R],[0.433*R,0.435*R]];
  const W=MW_PLAN,m=W.length,dense=[];
  for(let i=0;i<m;i++){const p0=W[(i-1+m)%m],p1=W[i],p2=W[(i+1)%m],p3=W[(i+2)%m];for(let q=0;q<60;q++){const t=q/60,t2=t*t,t3=t2*t,f=d=>0.5*((2*p1[d])+(-p0[d]+p2[d])*t+(2*p0[d]-5*p1[d]+4*p2[d]-p3[d])*t2+(-p0[d]+3*p1[d]-3*p2[d]+p3[d])*t3);dense.push([f(0)*A,-(f(1)+0.2)*B]);}}
  const cum=[0];for(let i=1;i<dense.length;i++)cum.push(cum[i-1]+Math.hypot(dense[i][0]-dense[i-1][0],dense[i][1]-dense[i-1][1]));
  const last=dense[dense.length-1],Lt=cum[cum.length-1]+Math.hypot(dense[0][0]-last[0],dense[0][1]-last[1]);dense.push(dense[0]);cum.push(Lt);
  const g=[],z=[];let j=0;for(let i=0;i<N;i++){const d=i/N*Lt;while(j<cum.length-2&&cum[j+1]<d)j++;const t=(d-cum[j])/(cum[j+1]-cum[j]||1),s=dense[j][0]+(dense[j+1][0]-dense[j][0])*t,lat=dense[j][1]+(dense[j+1][1]-dense[j][1])*t;g.push([ax[0]*s+lt[0]*lat,ax[1]*s+lt[1]*lat]);z.push(zsc*mwZ(i/N)*R);}
  /* heading, smoothed curvature -> signed bank (the outer edge of every curve is raised); no manual banking anywhere */
  const psi=[];let prev=0;for(let i=0;i<N;i++){const p=g[(i+N-1)%N],q=g[(i+1)%N];let ps=Math.atan2(q[1]-p[1],q[0]-p[0]);while(ps-prev>Math.PI)ps-=2*Math.PI;while(ps-prev<-Math.PI)ps+=2*Math.PI;psi.push(ps);prev=ps;}
  const mm=9,kap=psi.map((_,i)=>{const i0=(i-mm+N)%N,i1=(i+mm)%N;let d=psi[i1]-psi[i0];while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return d/(2*mm*Lt/N);});
  const bank=kap.map(v=>Math.max(-1.05,Math.min(1.05,-v*R*0.17))),n=psi.map(p=>[-Math.sin(p),Math.cos(p)]);
  return mwLayout._c[key]={N,g,z,bank,n,hexes,Lt,k,ds:Lt/N,lt,ax};
}
function mwDraw(ctx,cx,cy,R,op,mode){
  const accent=op.accent||'#f8fafc',fl=op.flip?-1:1,L=mwLayout(R,mode),N=L.N,k=L.k,Rk=R*k,hw=R*0.0125*k,thk=R*0.009*k;ctx.save();ctx.translate(cx,cy);ctx.lineJoin='round';ctx.lineCap='round';
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=fill;ctx.lineWidth=0.7;ctx.stroke();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.006;ctx.stroke();}};
  const P=i=>{i=(i+N)%N;return[L.g[i][0],L.g[i][1]-L.z[i]];},G=i=>L.g[(i+N)%N];
  const ED=[];for(let i=0;i<N;i++){const p=P(i),n=L.n[i],b=L.bank[i],c=Math.cos(b),s=Math.sin(b);ED.push({p,E1:[p[0]+n[0]*hw*c,p[1]+n[1]*hw*c-hw*s],E2:[p[0]-n[0]*hw*c,p[1]-n[1]*hw*c+hw*s],
    R1:[p[0]+n[0]*hw*0.72*c,p[1]+n[1]*hw*0.72*c-hw*0.72*s-R*0.004],R2:[p[0]-n[0]*hw*0.72*c,p[1]-n[1]*hw*0.72*c+hw*0.72*s-R*0.004]});}
  ctx.save();ctx.translate(fl*R*0.035,R*0.025);ctx.beginPath();L.g.forEach((p,i)=>{const z=L.z[i],x=p[0]+fl*z*0.3,y=p[1]+z*0.15;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.strokeStyle='rgba(30,22,12,.16)';ctx.lineWidth=R*0.05*k;ctx.stroke();ctx.restore();
  const items=[],woodL='#c9ad82',woodD='#7a6244',woodM='#b39668',lev=R*0.05,step=Math.max(3,Math.round(R*0.042/L.ds)),CH=24;
  /* lattice trestle: ledgers (horizontal) in chunks so they depth-sort against the track, then posts and X-bracing per bay */
  const maxZ=Math.max(...L.z),Mlev=Math.floor(maxZ/lev);
  for(let c0=0;c0<N;c0+=CH){const c1=Math.min(N,c0+CH+1),kk=(()=>{let sy=0,sz=0,n=0;for(let i=c0;i<c1;i++){sy+=L.g[i%N][1];sz+=L.z[i%N];n++;}return sy/n+sz/n*0.02-0.012;})();
    items.push({k:kk-0.004,f:()=>{ctx.beginPath();for(let i=c0;i<c1;i++){const q=G(i);i===c0?ctx.moveTo(q[0],q[1]):ctx.lineTo(q[0],q[1]);}for(let i=c1-1;i>=c0;i--){const q=G(i);ctx.lineTo(q[0],q[1]-L.z[i%N]);}ctx.closePath();ctx.fillStyle='rgba(222,200,160,0.07)';ctx.fill();}});
    items.push({k:kk,f:()=>{for(let m=1;m<=Mlev;m++){const hz=m*lev;let pen=false;ctx.beginPath();for(let i=c0;i<c1;i++){const q=G(i),zi=L.z[i%N];if(zi>=hz){pen?ctx.lineTo(q[0],q[1]-hz):ctx.moveTo(q[0],q[1]-hz);pen=true;}else pen=false;}ctx.strokeStyle='rgba(110,86,56,.4)';ctx.lineWidth=R*0.0055;ctx.save();ctx.translate(R*0.002,R*0.0025);ctx.stroke();ctx.restore();ctx.strokeStyle='#d8bf94';ctx.lineWidth=R*0.0045;ctx.stroke();}}});}
  for(let i=0;i<N;i+=step){const j=(i+step)%N,zi=L.z[i],zj=L.z[j];if(Math.max(zi,zj)<R*0.045)continue;const gi=G(i),gj=G(j),kk=(gi[1]+gj[1])/2+(zi+zj)/2*0.02-0.01;
    items.push({k:kk,f:()=>{ctx.strokeStyle=woodD;ctx.globalAlpha=0.4;ctx.lineWidth=R*0.0065;ctx.beginPath();ctx.moveTo(gi[0]+R*0.002,gi[1]+R*0.002);ctx.lineTo(gi[0]+R*0.002,gi[1]-zi);ctx.stroke();ctx.globalAlpha=1;line(gi,[gi[0],gi[1]-zi],'#d3b98e',R*0.0048);
      const lo=Math.min(zi,zj),nm=Math.floor(lo/lev);for(let m=0;m<nm;m++){const za=m*lev,zb=(m+1)*lev;line([gi[0],gi[1]-za],[gj[0],gj[1]-zb],'#c9ae84',R*0.0034);line([gj[0],gj[1]-za],[gi[0],gi[1]-zb],'#c9ae84',R*0.0034);}
      const top=nm*lev;if(zi>top+R*0.01||zj>top+R*0.01){if(zj>top)line([gi[0],gi[1]-top],[gj[0],gj[1]-Math.min(zj,top+lev)],'#c9ae84',R*0.0034);if(zi>top)line([gj[0],gj[1]-top],[gi[0],gi[1]-Math.min(zi,top+lev)],'#c9ae84',R*0.0034);}}});}
  /* track: wooden deck, steel rails in the land colour */
  for(let i=0;i<N;i++){const j=(i+1)%N,ei=ED[i],ej=ED[j],key=L.g[i][1]+L.z[i]*0.05,f=i/N,lift=f>0.05&&f<0.135;
    items.push({k:key,f:()=>{const nearE1=(ei.E1[1]+ej.E1[1])>(ei.E2[1]+ej.E2[1]),ea=nearE1?ei.E1:ei.E2,eb=nearE1?ej.E1:ej.E2;
      poly([ea,eb,[eb[0],eb[1]+thk],[ea[0],ea[1]+thk]],'#3f2a1c');poly([ei.E1,ej.E1,ej.E2,ei.E2],'#7a5236');line(ei.R1,ej.R1,accent,R*0.0042*k);line(ei.R2,ej.R2,accent,R*0.0042*k);
      if(lift&&i%4===0)line([ei.p[0]+L.n[i][0]*hw*0.6,ei.p[1]+L.n[i][1]*hw*0.6],[ei.p[0]-L.n[i][0]*hw*0.6,ei.p[1]-L.n[i][1]*hw*0.6],'#2a1a10',R*0.0055);}});}
  /* station: wooden building with a land-colour roof beside the start of the outbound lane */
  const i0=Math.round(0.006*N),i1=Math.round(0.04*N),b=L.lt,g0=L.g[i0],g1=L.g[i1],pf=(g,off,up)=>[g[0]+b[0]*off,g[1]+b[1]*off-up];
  items.push({k:g0[1]-Rk*0.02,f:()=>{poly([pf(g0,Rk*0.04,Rk*0.02),pf(g1,Rk*0.04,Rk*0.02),pf(g1,Rk*0.14,Rk*0.02),pf(g0,Rk*0.14,Rk*0.02)],'#cdb892','#8f7650',Rk*0.006);poly([pf(g0,Rk*0.04,Rk*0.02),pf(g1,Rk*0.04,Rk*0.02),pf(g1,Rk*0.04,0),pf(g0,Rk*0.04,0)],'#8f7650');}});
  items.push({k:g1[1]+Rk*0.1,f:()=>{[0.12,0.06].forEach(off=>[g0,g1].forEach(g=>line(pf(g,Rk*off,Rk*0.02),pf(g,Rk*off,Rk*0.1),'#a88a63',Rk*0.008)));
    poly([pf(g0,Rk*0.035,Rk*0.1),pf(g1,Rk*0.035,Rk*0.1),pf(g1,Rk*0.15,Rk*0.1),pf(g0,Rk*0.15,Rk*0.1)],shade(accent,0.05),shade(accent,-0.35),Rk*0.006);line(pf(g0,Rk*0.15,Rk*0.1),pf(g1,Rk*0.15,Rk*0.1),shade(accent,-0.45),Rk*0.011);line(pf(g0,Rk*0.035,Rk*0.1),pf(g1,Rk*0.035,Rk*0.1),shade(accent,-0.45),Rk*0.011);}});
  /* two static trains: station and lift hill */
  const car=(i,lead)=>{const p=P(i),pn=P(i+2),pp=P(i-2);let tx=pn[0]-pp[0],ty=pn[1]-pp[1];const m=Math.hypot(tx,ty)||1;tx/=m;ty/=m;const n=[-ty,tx],c=[p[0],p[1]-Rk*0.012],lx=Rk*0.03,wy=Rk*0.019;
    const q=(a,bb,dz)=>[c[0]+tx*a+n[0]*bb,c[1]+ty*a+n[1]*bb+dz];items.push({k:L.g[(i+N)%N][1]+L.z[(i+N)%N]*0.05+0.01,f:()=>{
      poly([q(-lx,wy,0),q(lx,wy,0),q(lx,wy,Rk*0.012),q(-lx,wy,Rk*0.012)],shade(accent,-0.25));poly([q(-lx,-wy,0),q(lx,-wy,0),q(lx,wy,0),q(-lx,wy,0)],lead?shade(accent,0.1):accent);
      poly([q(-lx,-wy,0),q(-lx*0.35,-wy,0),q(-lx*0.35,wy,0),q(-lx,wy,0)],'#2a1a10');
      [-0.45,0.45].forEach(d=>{const h=q(-lx*0.1,d*wy,-Rk*0.02);ctx.fillStyle='#fde4c8';ctx.beginPath();ctx.arc(h[0],h[1],Rk*0.011,0,7);ctx.fill();ctx.fillStyle=['#3b82f6','#ef4444','#22c55e','#f59e0b'][(i+(d>0?1:0))%4];ctx.fillRect(h[0]-Rk*0.008,h[1]+Rk*0.009,Rk*0.016,Rk*0.012);});}});};
  const sp=Math.round(Rk*0.066/L.ds);[0.04,0.095].forEach(fh=>{const ih=Math.round(fh*N);for(let q=0;q<5;q++)car(ih-q*sp,q===0);});
  items.sort((a,b)=>a.k-b.k).forEach(it=>it.f());ctx.restore();
}
function modernWoodSprite(R,mode,dir,accent,scale){
  modernWoodSprite._c=modernWoodSprite._c||{};const sc=scale||getBakeScale(),key=[mode,dir,Math.round(R*sc),R,accent,sc].join('|');if(modernWoodSprite._c[key])return modernWoodSprite._c[key];
  const side=mode==='side',W=Math.ceil((side?3.5:2.6)*R),H=Math.ceil((side?2.2:2.8)*R),oy=(side?1.55:1.8)*R,cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);
  const g=cv.getContext('2d');g.scale(sc,sc);g.save();g.translate(W/2,oy);if(dir==='NE-SW')g.scale(-1,1);mwDraw(g,0,0,R,{accent:accent,flip:dir==='NE-SW'},mode);g.restore();
  return modernWoodSprite._c[key]={canvas:cv,ox:W/2,oy:oy,w:W,h:H};
}
function drawModernWoodSide(ctx,cx,cy,R,o){o=o||{};const s=modernWoodSprite(R,'side','NW-SE',o.accent||'#d9342b');ctx.drawImage(s.canvas,cx-s.ox,cy-s.oy,s.w,s.h);}
function drawModernWoodDiag(ctx,cx,cy,R,o){o=o||{};const d=o.dir==='NE-SW'?'NE-SW':'NW-SE',s=modernWoodSprite(R,'diag',d,o.accent||'#d9342b');ctx.drawImage(s.canvas,cx-s.ox,cy-s.oy,s.w,s.h);}
function modernWoodFootprint(R,mode,dir){
  const L=mwLayout(R,mode),m=dir==='NE-SW'?-1:1,c=[];for(let i=0;i<L.N;i+=5)c.push({x:L.g[i][0]*m,y:L.g[i][1],r:R*0.11*L.k});
  const i0=Math.round(0.006*L.N),i1=Math.round(0.04*L.N),mid=[(L.g[i0][0]+L.g[i1][0])/2+L.lt[0]*R*0.1*L.k,(L.g[i0][1]+L.g[i1][1])/2+L.lt[1]*R*0.1*L.k];c.push({x:mid[0]*m,y:mid[1],r:R*0.13*L.k});
  return{tiles:L.hexes.map(h=>[h[0]*m,h[1]]),circles:c};
}
window.footprintForTile=window.footprintForTile||function(fp,i){const t=fp.tiles[i];return fp.circles.map(c=>({x:c.x-t[0],y:c.y-t[1],r:c.r}));};
window.sceneryInFront=window.sceneryInFront||function(circles,x,y){let f=-Infinity;for(const c of circles){const dx=x-c.x;if(Math.abs(dx)<c.r)f=Math.max(f,c.y+Math.sqrt(c.r*c.r-dx*dx)/1.7);}return f>-Infinity&&y>f;};
const BIG_RIDE_SCENERY=window.BIG_RIDE_SCENERY||{maxW:2.0,budgetScale:0.45,decalScale:0.6,noLandmarks:true};
/* ===== END STATIC HYPER ===== */
return Object.freeze({ side: drawModernWoodSide, diag: drawModernWoodDiag });
})();

const gigaCoasterPack = (() => {

/* ===== THEME PACK CORE (shared by every theme pack; copy once into engine.js) ===== */
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
/* ===== FRONTIER PACK ===== */
const F={wood:'#8a5a33',woodD:'#5a3b22',woodL:'#b07a46',bark:'#6b4a2b',endc:'#d9b27a',pine:'#2f5f3a',pineL:'#3d7348',pineD:'#26503a',water:'#4aa0c8',waterD:'#2f7fa8',rock:'#8a8f96',rockD:'#5f656c',rockL:'#b4b9c0',snow:'#f4f8fc',canvas:'#eadfc4'};
const fsh=(c,x,y,rx,h)=>{c.fillStyle='rgba(12,34,14,.32)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
const logWall=(c,x,y,u,X0,X1,Y,Z0,Z1)=>{let k=0;for(let z=Z0+0.17;z<Z1;z+=0.34,k++){const a=TH.iso(x,y,u,X0,Y,z),b=TH.iso(x,y,u,X1,Y,z);TH.ln(c,a,b,k%2?F.wood:'#7d4f2b',u*0.36);TH.ln(c,[a[0],a[1]-u*0.09],[b[0],b[1]-u*0.09],'rgba(255,225,170,.28)',u*0.08);}};
const logWallE=(c,x,y,u,X,Y0,Y1,Z0,Z1)=>{let k=0;for(let z=Z0+0.17;z<Z1;z+=0.34,k++){const a=TH.iso(x,y,u,X,Y0,z),b=TH.iso(x,y,u,X,Y1,z);TH.ln(c,a,b,k%2?'#6f4524':'#5f3b1f',u*0.36);}};
const logEnds=(c,x,y,u,X,Y,Z0,Z1)=>{for(let z=Z0+0.17;z<Z1;z+=0.34){const p=TH.iso(x,y,u,X,Y,z);TH.ell(c,p[0],p[1],u*0.2,u*0.17,F.endc);TH.ell(c,p[0],p[1],u*0.09,u*0.07,'#b8884f');}};
function frFir(c,x,y,u,s,v){const H=u*6.2*s,tiers=6;fsh(c,x,y,u*1.6*s,H);TH.ln(c,[x,y],[x,y-u*1.2*s],'#4a3320',u*0.5*s);
  for(let k=0;k<tiers;k++){const t=k/(tiers-1),by=y-u*1.0*s-H*0.76*t,w=u*(1.75-1.2*t)*s,h=u*1.5*s;
    TH.poly(c,[[x-w,by+h*0.2],[x-w*0.35,by-h*0.3],[x,by-h*1.15],[x+w*0.35,by-h*0.3],[x+w,by+h*0.2],[x,by+h*0.55]],k%2?F.pine:F.pineL);
    TH.poly(c,[[x,by-h*1.15],[x+w*0.35,by-h*0.3],[x+w,by+h*0.2],[x+w*0.3,by+h*0.35]],'rgba(8,30,18,.4)');}}
const fcrag=(c,x,y,u,o)=>{const wt=o.wt,wb=o.wb,H=o.H,r=mulberry(o.seed),n=o.bands.length;TH.ell(c,x,y,wb*1.1,wb*0.47,'#6f7a62');c.save();c.beginPath();c.moveTo(x-wt,y-H);c.lineTo(x-wb,y);c.ellipse(x,y,wb,wb*0.42,0,Math.PI,0,true);c.lineTo(x+wt,y-H);c.ellipse(x,y-H,wt,wt*0.42,0,0,Math.PI);c.closePath();c.clip();
  const Hh=H+wb*0.42;for(let j=0;j<n;j++){c.fillStyle=o.bands[j];c.fillRect(x-wb-2,y-H+Hh*j/n,wb*2+4,Hh/n+1);}
  const g=c.createLinearGradient(x-wb,0,x+wb,0);g.addColorStop(0,'rgba(255,255,255,.22)');g.addColorStop(0.45,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,15,25,.5)');c.fillStyle=g;c.fillRect(x-wb-2,y-H-2,wb*2+4,Hh+4);
  for(let k=0;k<8;k++){const fx=x+(r()*2-1)*wt*0.9,bx=x+(fx-x)*wb/wt;c.strokeStyle='rgba(20,28,36,.3)';c.lineWidth=u*0.07;c.beginPath();c.moveTo(fx,y-H+wt*0.25);c.quadraticCurveTo((fx+bx)/2+u*0.12,y-H/2,bx,y+wb*0.3);c.stroke();}
  c.restore();TH.ell(c,x,y-H,wt,wt*0.42,o.top||'#6f8a5a');};
const FRONTIER_PACK={id:'frontier',name:'Frontier',ground:'#7d955d',groundDark:'#6b8350',border:'#566e42',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},
         3:{budget:11,decals:4,landmark:0.75,pool:['lookoutTower','waterfallCliff','mountainPeak']},
         4:{budget:15,decals:5,landmark:1,pool:['stockadeFort','sawmill','mountainPeak','waterfallCliff','lookoutTower'],second:0.45}},
  assets:{
  /* ---------- ground decals ---------- */
  riverBend:{cat:'decal',w:3.2,tier:1,weight:4,cost:0,draw(c,x,y,u,v,tm){const r=mulberry(v+3),f=v%2?-1:1,t=tm||0;const path=()=>{c.beginPath();c.moveTo(x-u*3.2,y-u*0.5*f);c.bezierCurveTo(x-u*1.6,y+u*0.7*f,x-u*0.1,y-u*0.9*f,x+u*3.2,y+u*0.5*f);};
    c.lineCap='round';path();c.strokeStyle='#6b5a3a';c.lineWidth=u*1.55;c.stroke();path();c.strokeStyle='#2f7fa8';c.lineWidth=u*1.2;c.stroke();path();c.strokeStyle='#4aa0c8';c.lineWidth=u*0.9;c.stroke();
    c.setLineDash([u*0.35,u*0.55]);c.lineDashOffset=-t*u*1.5;path();c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=u*0.08;c.stroke();c.setLineDash([]);
    for(let k=0;k<9;k++){const s=r(),b=(1-s)**3*(x-u*3.2)+3*(1-s)**2*s*(x-u*1.6)+3*(1-s)*s*s*(x-u*0.1)+s**3*(x+u*3.2),yy=(1-s)**3*(y-u*0.5*f)+3*(1-s)**2*s*(y+u*0.7*f)+3*(1-s)*s*s*(y-u*0.9*f)+s**3*(y+u*0.5*f);TH.ell(c,b,yy+(k%2?1:-1)*u*0.8,u*0.2,u*0.12,['#8a8f96','#a5a9ad','#6f747a'][k%3]);}}},
  pebbleBar:{cat:'decal',w:2.0,tier:1,weight:3,cost:0,draw(c,x,y,u,v){const r=mulberry(v+5);TH.ell(c,x,y,u*2.0,u*0.9,'#b9b4a2');for(let k=0;k<28;k++){const a=r()*6.283,rr=Math.sqrt(r());TH.ell(c,x+Math.cos(a)*u*1.8*rr,y+Math.sin(a)*u*0.8*rr,u*0.14,u*0.09,['#8a8f96','#a8a290','#c9c3b0','#6f747a'][k%4]);}}},
  pineNeedles:{cat:'decal',w:2.2,tier:1,weight:3.5,cost:0,draw(c,x,y,u,v){const r=mulberry(v+8);TH.ell(c,x,y,u*2.2,u*0.95,'#6b4f32');TH.ell(c,x-u*0.2,y-u*0.05,u*1.7,u*0.7,'#7b5c3a');for(let k=0;k<34;k++){const a=r()*6.283,rr=Math.sqrt(r()),px=x+Math.cos(a)*u*2.0*rr,py=y+Math.sin(a)*u*0.85*rr;TH.ln(c,[px,py],[px+u*0.28,py-u*0.1],k%3?'#4a3320':'#8a6a45',u*0.04);}}},
  wildMeadow:{cat:'decal',w:2.2,tier:1,weight:3.5,cost:0,draw(c,x,y,u,v){const r=mulberry(v+9);for(let k=0;k<30;k++){const a=r()*6.283,rr=Math.sqrt(r()),px=x+Math.cos(a)*u*2.0*rr,py=y+Math.sin(a)*u*0.9*rr;TH.ln(c,[px,py],[px+(r()-0.5)*u*0.2,py-u*(0.3+r()*0.3)],'#4a7a3c',u*0.05);if(k%3===0)TH.ell(c,px,py-u*0.5,u*0.09,u*0.12,['#8a5ad0','#f2d24a','#f8fafc','#d884e0'][k%4]);}}},
  /* ---------- trees and plants ---------- */
  pineTree:{cat:'tree',w:1.8,tier:2,weight:3.5,cost:2,max:2,draw(c,x,y,u,v){frFir(c,x,y,u,1.3+(v%3)*0.12,v);}},
  firGrove:{cat:'tree',w:2.3,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v){[[-1.1,0.2,0.8],[1.0,0.3,0.92],[0.0,-0.5,0.7]].sort((a,b)=>a[1]-b[1]).forEach(([dx,dy,s])=>frFir(c,x+dx*u,y+dy*u,u,s,v));}},
  aspenTree:{cat:'tree',w:1.7,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*5+2),H=u*(4.2+r()*0.8),t=tm||0;fsh(c,x,y,u*1.8,u*6);TH.ln(c,[x,y],[x+u*0.1,y-H],'#d8d3c2',u*0.5);TH.ln(c,[x+u*0.12,y],[x+u*0.2,y-H],'rgba(60,50,40,.25)',u*0.2);
    for(let k=0;k<9;k++){const ky=y-u*(0.4+k*0.45);TH.ln(c,[x-u*0.18,ky],[x+u*0.05,ky-u*0.05],'#3a3228',u*0.06);}
    const cols=['#c9b43a','#b2c040','#9ab838','#d6c046'];[[0,-0.9,1.9,1.5],[-1.2,0.1,1.4,1.1],[1.2,0.0,1.4,1.1],[0.1,0.1,1.7,1.2],[-0.5,-1.9,1.2,0.95]].forEach(([dx,dy,rx,ry],i)=>{const sw=Math.sin(t*1.4+i)*u*0.06;TH.blob(c,x+dx*u+sw,y-H+dy*u,u*rx,u*ry,cols[i%4],r,9);});}},
  berryBush:{cat:'plant',w:1.4,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*3+6);fsh(c,x,y,u*1.4,u);[[-0.7,-0.5,0.85,'#3f7a45'],[0.7,-0.5,0.8,'#4a8a4c'],[0,-0.95,0.95,'#559858'],[-0.1,-0.45,0.85,'#437f48']].forEach(([dx,dy,s,col])=>TH.blob(c,x+dx*u,y+dy*u,u*s,u*s*0.72,col,r,9));
    for(let k=0;k<9;k++)TH.ell(c,x+(r()-0.5)*u*1.8,y-u*(0.3+r()*1.0),u*0.1,u*0.1,['#3a5ad0','#d9342b','#5a3ad0'][k%3]);}},
  fernPatch:{cat:'plant',w:1.5,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*5+2),t=tm||0;fsh(c,x,y,u*1.5,u*1.5);for(let k=0;k<8;k++){const a=-3.1+k*0.48,l=u*(1.5+r()*0.7),sw=Math.sin(t*1.2+k)*u*0.05,ex=x+Math.cos(a)*l+sw,ey=y-Math.abs(Math.sin(a))*l*0.8-u*0.15;
      c.strokeStyle=k%2?'#2f6a3a':'#3a7a44';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(ex-x)*0.45,y-l*0.85,ex,ey);c.stroke();
      for(let q=1;q<7;q++){const f=q/7,px=x+(ex-x)*f*0.92,py=y+(ey-y)*f-Math.sin(f*3.0)*l*0.3;TH.ln(c,[px,py],[px-u*0.26,py+u*0.18],'#4a8e4e',u*0.05);TH.ln(c,[px,py],[px+u*0.26,py+u*0.18],'#4a8e4e',u*0.05);}}}},
  cattails:{cat:'plant',w:1.4,tier:1,weight:3,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*4+3),t=tm||0;TH.ell(c,x,y+u*0.1,u*1.6,u*0.6,'#3f8fb5');TH.ell(c,x-u*0.2,y,u*1.2,u*0.4,'#56a8cc');
    for(let k=0;k<8;k++){const bx=x+(k-3.5)*u*0.3,h=u*(2.4+r()*1.3),sw=Math.sin(t*1.3+k)*u*0.06;TH.ln(c,[bx,y],[bx+sw,y-h],'#5a8a3a',u*0.1);TH.ln(c,[bx,y-h*0.3],[bx-u*0.5+sw,y-h*0.95],'#4a7a32',u*0.06);if(k%2===0){TH.ell(c,bx+sw,y-h*0.82,u*0.13,u*0.38,'#6b4a2b');TH.ln(c,[bx+sw,y-h*0.6],[bx+sw,y-h*1.15],'#8a6a45',u*0.04);}}}},
  fallenLog:{cat:'plant',w:2.4,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+2);fsh(c,x,y,u*2.4,u*1.5);const a=I(-2.2,0,0.5),b=I(2.2,0,0.5);TH.ln(c,a,b,'#4a3320',u*1.2);TH.ln(c,a,b,F.bark,u*1.0);TH.ln(c,[a[0],a[1]-u*0.3],[b[0],b[1]-u*0.3],F.woodL,u*0.2);
    for(let k=0;k<7;k++){const p=I(-1.8+k*0.6,0,0.5);TH.ln(c,[p[0],p[1]-u*0.45],[p[0]+u*0.2,p[1]+u*0.4],'rgba(40,24,10,.35)',u*0.05);}TH.ell(c,b[0],b[1],u*0.5,u*0.62,F.endc);[0.16,0.3,0.44].forEach(s=>{c.strokeStyle='rgba(120,80,40,.5)';c.lineWidth=u*0.04;c.beginPath();c.ellipse(b[0],b[1],u*s*1.1,u*s*1.3,0,0,7);c.stroke();});
    TH.ln(c,I(0.5,0,0.8),I(1.2,-0.6,1.7),F.bark,u*0.16);TH.blob(c,...I(-1.0,0.1,1.1),u*0.7,u*0.2,'rgba(95,138,71,.95)',r,7);for(let k=0;k<3;k++){const p=I(-0.4+k*0.35,0.5,0.75);TH.ln(c,[p[0],p[1]],[p[0],p[1]-u*0.35],'#e8e0cc',u*0.06);TH.ell(c,p[0],p[1]-u*0.4,u*0.16,u*0.1,'#c9663a');}}},
  boulders:{cat:'rock',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*13+3);fsh(c,x,y,u*1.9,u*1.4);[[0.0,0.0,1.0,1.0,'#80858d'],[-1.0,0.2,0.65,0.6,'#6f747c'],[0.9,0.25,0.6,0.55,'#8f949b']].forEach(([dx,dy,sx,sy,col])=>TH.blob(c,x+dx*u,y-u*0.55*sy+dy*u,u*0.9*sx,u*0.75*sy,col,r,9));
    for(let k=0;k<4;k++)TH.ell(c,x+(r()-0.5)*u*1.4,y-u*(0.2+r()*0.7),u*0.2,u*0.1,k%2?'rgba(150,170,90,.8)':'rgba(95,138,71,.7)');}},
  /* ---------- props ---------- */
  campfire:{cat:'prop',w:1.7,tier:1,weight:3,cost:1,max:1,draw(c,x,y,u,v,tm){const t=tm||0;fsh(c,x,y,u*1.8,u*2);TH.ell(c,x,y+u*0.1,u*1.2,u*0.5,'#4a3a2a');for(let k=0;k<9;k++){const a=k/9*6.283;TH.ell(c,x+Math.cos(a)*u*0.95,y+u*0.1+Math.sin(a)*u*0.42,u*0.28,u*0.18,['#8a8f96','#6f747a'][k%2]);}
    TH.ln(c,[x-u*0.7,y+u*0.1],[x+u*0.6,y-u*0.3],'#4a3320',u*0.24);TH.ln(c,[x+u*0.7,y+u*0.15],[x-u*0.5,y-u*0.3],'#5a4028',u*0.24);
    [[-1.9,0.4],[1.9,0.5]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u-u*0.5,y+dy*u],[x+dx*u+u*0.5,y+dy*u-u*0.1],'#6b4a2b',u*0.5);TH.ell(c,x+dx*u+u*0.5,y+dy*u-u*0.1,u*0.22,u*0.25,F.endc);});
    [[-1.4,0.1],[1.4,0.1],[0,-0.7]].forEach(([dx,dy])=>TH.ln(c,[x+dx*u,y+dy*u+u*0.2],[x+dx*u*0.2,y-u*2.4],'#3b3f4a',u*0.09));TH.ell(c,x,y-u*1.4,u*0.45,u*0.34,'#2b2f3a');
    const g=c.createRadialGradient(x,y-u*0.6,0,x,y-u*0.6,u*2.6);g.addColorStop(0,'rgba(255,170,60,'+(0.45+0.1*Math.sin(t*9))+')');g.addColorStop(1,'rgba(255,170,60,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*0.6,u*2.6,0,7);c.fill();
    [[0,1.0,0.9],[-0.35,0.75,0.6],[0.35,0.8,0.65]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*11+i*2+v)*u*0.12;TH.poly(c,[[x+dx*u-u*0.38*w,y-u*0.05],[x+dx*u+f,y-u*(0.1+h*1.2)],[x+dx*u+u*0.38*w,y-u*0.05]],i?'#fbbf24':'#f97316');});
    for(let k=0;k<3;k++){const ph=(t*0.6+k*0.33)%1;c.fillStyle='rgba(120,120,126,'+(0.35*(1-ph))+')';c.beginPath();c.ellipse(x+Math.sin(ph*5+k)*u*0.3,y-u*(2.3+ph*2.2),u*(0.22+ph*0.45),u*(0.18+ph*0.35),0,0,7);c.fill();}}},
  canoe:{cat:'prop',w:2.5,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.7,u*1.5);const N=16,top=[];for(let k=0;k<=N;k++){const X=-2.6+5.2*k/N,q=Math.abs(X)/2.6;top.push([X,0.62*Math.pow(Math.max(0,1-q*q),0.55),0.28+0.95*Math.pow(q,3)]);}
    TH.poly(c,top.map(p=>I(p[0],-p[1],p[2])).concat(top.slice().reverse().map(p=>I(p[0],p[1],p[2]))),'#2f2012');
    TH.poly(c,top.map(p=>I(p[0],p[1],p[2])).concat(top.slice().reverse().map(p=>I(p[0],p[1]*0.35,0.03+p[2]*0.12))),'#c98f4a');
    for(let k=1;k<N;k+=2){const p=top[k];TH.ln(c,I(p[0],p[1],p[2]),I(p[0],p[1]*0.35,0.03+p[2]*0.12),'rgba(90,50,20,.35)',u*0.05);}
    c.strokeStyle='#7a4d2b';c.lineWidth=u*0.12;c.lineJoin='round';c.beginPath();top.forEach((p,i)=>{const q=I(p[0],p[1],p[2]);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.stroke();
    [-0.8,0.9].forEach(X=>TH.ln(c,I(X,-0.55,0.5),I(X,0.55,0.5),'#8a5a33',u*0.12));TH.ln(c,I(1.5,1.3,0),I(1.9,1.0,2.4),F.woodL,u*0.1);TH.ell(c,...I(1.95,0.98,2.7),u*0.14,u*0.3,F.woodL,-0.3);}},
  fishRack:{cat:'prop',w:2.2,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+4);fsh(c,x,y,u*2.3,u*3);[-1.9,1.9].forEach(X=>{TH.ln(c,I(X,-0.7,0),I(X,0,2.6),F.bark,u*0.18);TH.ln(c,I(X,0.7,0),I(X,0,2.6),F.bark,u*0.18);});
    TH.ln(c,I(-2.1,0,2.5),I(2.1,0,2.5),F.woodD,u*0.16);TH.ln(c,I(-1.9,0,1.5),I(1.9,0,1.5),F.woodD,u*0.12);
    for(let k=0;k<10;k++){const X=-1.7+k*0.38,L=0.5+r()*0.5,top=I(X,0,2.5),bot=[top[0],top[1]+u*L*1.2];TH.ln(c,top,bot,'#c9b98a',u*0.04);TH.ell(c,bot[0],bot[1]+u*0.28,u*0.12,u*0.34,'#b8c4cc');TH.poly(c,[[bot[0]-u*0.1,bot[1]+u*0.55],[bot[0]+u*0.1,bot[1]+u*0.55],[bot[0],bot[1]+u*0.4]],'#98a4ac');TH.ell(c,bot[0]+u*0.02,bot[1]+u*0.16,u*0.025,u*0.025,'#222');}
    for(let k=0;k<5;k++){const p=I(-1.5+k*0.75,0,1.5);TH.poly(c,[[p[0]-u*0.12,p[1]],[p[0]+u*0.12,p[1]],[p[0]+u*0.08,p[1]+u*0.9],[p[0]-u*0.08,p[1]+u*0.9]],'#b86a4a');}}},
  firewood:{cat:'prop',w:1.7,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+5);fsh(c,x,y,u*1.8,u*1.6);[-1.5,1.5].forEach(X=>TH.ln(c,I(X,0.5,0),I(X,0.5,1.6),F.woodD,u*0.18));
    TH.box(c,x,y,u,-1.4,1.4,-0.5,0.5,0,1.5,'#9a6a3c','#6f4a28','#b8884f');for(let row=0;row<4;row++)for(let col=0;col<7;col++){const p=I(-1.2+col*0.4+(row%2)*0.2,0.51,0.18+row*0.36);TH.ell(c,p[0],p[1],u*0.17,u*0.16,F.endc);TH.ell(c,p[0],p[1],u*0.07,u*0.06,'#a8783f');}
    TH.poly(c,[I(-1.6,0.8,1.5),I(1.6,0.8,1.5),I(1.6,-0.6,1.7),I(-1.6,-0.6,1.7)],'#5a3b22');TH.ell(c,x+u*2.0,y+u*0.3,u*0.35,u*0.28,F.endc);TH.ln(c,[x+u*2.0,y+u*0.3],[x+u*2.5,y-u*0.4],F.woodL,u*0.14);TH.poly(c,[[x+u*2.35,y-u*0.45],[x+u*2.75,y-u*0.55],[x+u*2.6,y-u*0.2]],'#9aa0a8');}},
  railFence:{cat:'prop',w:2.6,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.7,u);for(let seg=-2;seg<=1;seg++){const sx=seg*1.25,s=seg%2?1:-1;for(let lvl=0;lvl<4;lvl++){const z=0.25+lvl*0.4,k=(lvl+seg)%2?1:-1;TH.ln(c,I(sx,0.35*k*s,z),I(sx+1.45,-0.35*k*s,z+0.03),'#8a6a45',u*0.2);TH.ell(c,...I(sx+1.45,-0.35*k*s,z+0.03),u*0.1,u*0.1,'#c9a56a');}}
    if(v%2)TH.ln(c,I(1.8,0,0.2),I(2.6,0.5,0.9),'#8a6a45',u*0.2);}},
  footbridge:{cat:'prop',w:2.4,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.poly(c,[I(-1.6,-3.0,0),I(1.6,-3.0,0),I(1.6,3.0,0),I(-1.6,3.0,0)],'#6b5a3a');TH.poly(c,[I(-1.2,-3.0,0.02),I(1.2,-3.0,0.02),I(1.2,3.0,0.02),I(-1.2,3.0,0.02)],F.waterD);TH.poly(c,[I(-0.9,-3.0,0.04),I(0.9,-3.0,0.04),I(0.9,3.0,0.04),I(-0.9,3.0,0.04)],F.water);
    fsh(c,x,y,u*2.2,u*1.5);const deck=Y=>{const z=0.55+0.35*(1-Math.pow(Y/2.6,2));return z;};[-2.6,2.6].forEach(Y=>TH.ln(c,I(-0.7,Y,0),I(-0.7,Y,0.65),F.woodD,u*0.3));
    const pts=[];for(let k=0;k<=12;k++){const Y=-2.6+5.2*k/12;pts.push([Y,deck(Y)]);}TH.poly(c,pts.map(p=>I(-0.75,p[0],p[1])).concat(pts.slice().reverse().map(p=>I(0.75,p[0],p[1]))),'#a97d49');for(let k=1;k<12;k++){TH.ln(c,I(-0.75,pts[k][0],pts[k][1]),I(0.75,pts[k][0],pts[k][1]),'rgba(60,35,10,.4)',u*0.05);}
    [-0.8,0.8].forEach(X=>{c.strokeStyle=F.woodD;c.lineWidth=u*0.12;c.beginPath();pts.forEach((p,i)=>{const q=I(X,p[0],p[1]+0.8);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.stroke();for(let k=0;k<=12;k+=3)TH.ln(c,I(X,pts[k][0],pts[k][1]),I(X,pts[k][0],pts[k][1]+0.8),F.woodD,u*0.1);});}},
  trapperTent:{cat:'prop',w:2.4,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.5,u*3);TH.poly(c,[I(2.2,-1.5,0),I(2.2,1.5,0),I(2.2,0,2.6)],'#d6c7a4');TH.poly(c,[I(2.2,-0.6,0),I(2.2,0.6,0),I(2.2,0.05,1.7)],'#241c14');TH.poly(c,[I(2.2,-0.6,0),I(2.2,0.05,1.7),I(2.2,-0.2,0.0)],'#f0e6c8');
    TH.poly(c,[I(-2.2,1.5,0),I(2.2,1.5,0),I(2.2,0,2.6),I(-2.2,0,2.6)],F.canvas);TH.poly(c,[I(-2.2,0.4,0.9),I(2.2,0.4,0.9),I(2.2,0,2.6),I(-2.2,0,2.6)],'rgba(140,110,60,.18)');for(let k=1;k<5;k++)TH.ln(c,I(-2.2+k*0.9,1.5,0),I(-2.2+k*0.9,0,2.6),'rgba(110,85,50,.35)',u*0.04);TH.ln(c,I(-2.2,0,2.6),I(2.2,0,2.6),F.woodD,u*0.18);
    [-2.6,2.6].forEach(X=>TH.ln(c,I(X,0,2.8),I(X,0,0),F.bark,u*0.14));[[-2.6,2.2],[2.6,2.2],[-1,2.2]].forEach(([X,Y])=>{TH.ln(c,I(X*0.8,1.2,1.0),I(X,Y,0),'rgba(230,220,190,.7)',u*0.04);TH.ln(c,I(X,Y,0),I(X,Y,0.3),F.woodD,u*0.1);});
    TH.ell(c,...I(1.0,2.0,0.3),u*0.3,u*0.2,'#7a5a3a');TH.ell(c,...I(1.0,2.0,0.55),u*0.2,u*0.14,'#e0d6b8');TH.ln(c,I(2.8,1.6,0),I(2.8,1.6,1.5),F.bark,u*0.12);TH.ell(c,...I(2.8,1.6,1.6),u*0.18,u*0.22,'#fbbf24');}},
  bear:{cat:'prop',w:1.7,tier:2,weight:2,cost:1,max:1,draw(c,x,y,u,v,tm){const dk='#4a2f1e',md='#6b4630',lt='#8a6a4a';fsh(c,x,y,u*1.9,u*2.2);[[-0.6,-0.1],[1.1,-0.05]].forEach(([dx,dy])=>{TH.poly(c,[[x+dx*u-u*0.3,y-u*0.9],[x+dx*u+u*0.3,y-u*0.9],[x+dx*u+u*0.26,y+dy*u],[x+dx*u-u*0.26,y+dy*u]],'#3b2516');});
    TH.ell(c,x,y-u*1.4,u*1.75,u*0.95,md);TH.ell(c,x-u*0.55,y-u*1.95,u*0.85,u*0.6,md);TH.ell(c,x+u*0.1,y-u*1.0,u*1.4,u*0.5,'rgba(0,0,0,.2)');
    [[-1.0,0.3],[0.8,0.35]].forEach(([dx,dy])=>{TH.poly(c,[[x+dx*u-u*0.34,y-u*0.95],[x+dx*u+u*0.34,y-u*0.95],[x+dx*u+u*0.3,y+dy*u],[x+dx*u-u*0.3,y+dy*u]],dk);TH.ell(c,x+dx*u,y+dy*u,u*0.42,u*0.14,'#2f2015');for(let k=-1;k<=1;k++)TH.ln(c,[x+dx*u+k*u*0.15+u*0.2,y+dy*u+u*0.05],[x+dx*u+k*u*0.15+u*0.32,y+dy*u+u*0.1],'#e8e0cc',u*0.04);});
    const hy=y-u*1.55+Math.sin((tm||0)*1.2+v)*u*0.05;TH.ell(c,x+u*1.65,hy,u*0.62,u*0.56,md);TH.ell(c,x+u*2.1,hy+u*0.15,u*0.4,u*0.3,lt);TH.ell(c,x+u*2.38,hy+u*0.06,u*0.12,u*0.1,'#1a1410');TH.ell(c,x+u*1.4,hy-u*0.5,u*0.17,u*0.17,md);TH.ell(c,x+u*1.85,hy-u*0.42,u*0.15,u*0.15,dk);TH.ell(c,x+u*1.85,hy-u*0.1,u*0.06,u*0.06,'#111');
    if(v%2){TH.ell(c,x+u*2.35,hy+u*0.42,u*0.55,u*0.12,'#e0746a',-0.35);TH.poly(c,[[x+u*2.8,hy+u*0.3],[x+u*3.0,hy+u*0.1],[x+u*3.0,hy+u*0.5]],'#c9564a');}}},
  deer:{cat:'prop',w:1.5,tier:1,weight:2.5,cost:1,max:1,draw(c,x,y,u,v,tm){const tn='#b88a56',dk='#8a6238';fsh(c,x,y,u*1.7,u*2.5);[[-0.8,0.05],[0.9,0.05]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u+u*0.15,y-u*1.4],[x+dx*u+u*0.1,y+dy*u],dk,u*0.16);});
    TH.ell(c,x,y-u*1.65,u*1.25,u*0.55,tn);TH.ell(c,x-u*0.2,y-u*1.4,u*0.9,u*0.25,'#e6d6b4');[[-0.95,0.05],[0.65,0.1]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u,y-u*1.4],[x+dx*u-u*0.04,y+dy*u],tn,u*0.18);TH.ell(c,x+dx*u-u*0.04,y+dy*u,u*0.14,u*0.07,'#2b1f14');});
    TH.ln(c,[x+u*1.0,y-u*1.8],[x+u*1.5,y-u*3.0],tn,u*0.4);const hy=y-u*3.15+Math.sin((tm||0)*1.5+v)*u*0.04;TH.ell(c,x+u*1.65,hy,u*0.38,u*0.3,tn,0.3);TH.ell(c,x+u*2.0,hy+u*0.1,u*0.2,u*0.14,'#d9c4a0');TH.ell(c,x+u*2.15,hy+u*0.08,u*0.06,u*0.05,'#111');TH.ell(c,x+u*1.62,hy-u*0.35,u*0.1,u*0.2,tn,-0.3);
    c.strokeStyle='#6b4a2b';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x+u*1.6,hy-u*0.25);c.lineTo(x+u*1.3,hy-u*0.85);c.moveTo(x+u*1.45,hy-u*0.55);c.lineTo(x+u*1.1,hy-u*0.55);c.moveTo(x+u*1.35,hy-u*0.75);c.lineTo(x+u*1.65,hy-u*1.1);c.stroke();TH.poly(c,[[x-u*1.25,y-u*1.8],[x-u*1.6,y-u*1.95],[x-u*1.3,y-u*1.55]],'#f1ece0');}},
  beaverDam:{cat:'prop',w:2.4,tier:2,weight:2,cost:1,max:1,draw(c,x,y,u,v,tm){const r=mulberry(v+3),t=tm||0;TH.ell(c,x,y,u*2.6,u*1.1,'#6b5a3a');TH.ell(c,x,y,u*2.4,u*0.98,F.waterD);TH.ell(c,x-u*0.2,y-u*0.05,u*1.9,u*0.74,F.water);c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=u*0.05;const ph=(t*0.35)%1;c.beginPath();c.ellipse(x-u*1.0,y+u*0.2,u*(0.2+ph*0.6),u*(0.1+ph*0.26),0,0,7);c.stroke();
    for(let k=0;k<22;k++){const px=x+u*(1.0+(r()-0.5)*0.4)+k*0.0,py=y+u*(-0.9+k*0.085),L=u*(0.9+r()*0.6);TH.ln(c,[px-L*0.5,py+(r()-0.5)*u*0.1],[px+L*0.5,py+(r()-0.5)*u*0.1-u*0.05],['#6b4a2b','#8a6238','#5a3b22'][k%3],u*0.14);}
    c.beginPath();c.moveTo(x-u*1.9,y-u*0.1);c.quadraticCurveTo(x-u*1.6,y-u*2.2,x-u*0.5,y-u*2.0);c.quadraticCurveTo(x+u*0.3,y-u*1.4,x+u*0.4,y-u*0.1);c.closePath();c.fillStyle='#7a5a38';c.fill();
    for(let k=0;k<26;k++){const a=r()*6.283,rr=Math.sqrt(r());const px=x-u*0.75+Math.cos(a)*u*1.0*rr,py=y-u*0.9+Math.sin(a)*u*0.75*rr;TH.ln(c,[px,py],[px+(r()-0.5)*u*0.9,py+(r()-0.5)*u*0.4],['#5a3b22','#9a7a4a','#6b4a2b'][k%3],u*0.07);}
    TH.ell(c,x-u*0.7,y+u*0.35,u*0.25,u*0.14,'#4a3320');TH.ell(c,x-u*0.45,y+u*0.34,u*0.1,u*0.09,'#4a3320');TH.ell(c,x-u*1.0,y+u*0.42,u*0.2,u*0.07,'#3a2a1a');}},
  logCabin:{cat:'structure',w:2.8,tier:3,weight:3,cost:2,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0;fsh(c,x,y,u*3.2,u*4);
    TH.box(c,x,y,u,-2.2,2.2,-1.6,1.6,0,2.3,'#8a5a33','#6f4524','#a97d49');logWall(c,x,y,u,-2.2,2.2,1.61,0,2.3);logWallE(c,x,y,u,2.21,-1.6,1.6,0,2.3);logEnds(c,x,y,u,-2.2,1.61,0,2.3);logEnds(c,x,y,u,2.2,1.61,0,2.3);
    TH.poly(c,[I(-0.45,1.64,0),I(0.45,1.64,0),I(0.45,1.64,1.6),I(-0.45,1.64,1.6)],'#4a2f1c','#2b1b0e',u*0.05);TH.ell(c,...I(0.3,1.65,0.8),u*0.05,u*0.05,'#e0b53a');
    TH.poly(c,[I(1.0,1.64,0.9),I(1.8,1.64,0.9),I(1.8,1.64,1.7),I(1.0,1.64,1.7)],'#9bd0e8','#4a2f1c',u*0.07);TH.ln(c,I(1.4,1.65,0.9),I(1.4,1.65,1.7),'#4a2f1c',u*0.05);[[0.78,1.0],[2.02,1.8]].forEach(([X,x2])=>TH.poly(c,[I(X,1.65,0.9),I(X+(X<1?0.22:-0.22),1.65,0.9),I(X+(X<1?0.22:-0.22),1.65,1.7),I(X,1.65,1.7)],'#5a3b22'));
    TH.poly(c,[I(2.2,-1.6,2.3),I(2.2,1.6,2.3),I(2.2,0,3.9)],'#7a4d2b');for(let k=0;k<5;k++)TH.ln(c,I(2.21,-1.5+k*0.75,2.3),I(2.21,-0.7+k*0.4+(k%2)*0.0,3.4),'rgba(40,24,10,.0)',1);
    TH.poly(c,[I(-2.7,2.0,2.2),I(2.7,2.0,2.2),I(2.7,0,4.0),I(-2.7,0,4.0)],'#7a5a3a');for(let k=1;k<7;k++){TH.ln(c,I(-2.7,2.0-k*0.285,2.2+k*0.257),I(2.7,2.0-k*0.285,2.2+k*0.257),'rgba(40,24,10,.45)',u*0.06);}TH.ln(c,I(-2.7,2.0,2.2),I(2.7,2.0,2.2),'#4a3320',u*0.14);TH.ln(c,I(-2.7,0,4.0),I(2.7,0,4.0),'#9a7a4a',u*0.14);
    TH.box(c,x,y,u,-1.7,-1.0,-1.1,-0.5,2.0,4.8,'#9aa0a8','#6f747c','#c3c8cf');for(let k=0;k<4;k++){const ph=(t*0.5+k*0.25)%1,tp=I(-1.35,-0.8,4.8);c.fillStyle='rgba(200,200,205,'+(0.5*(1-ph))+')';c.beginPath();c.ellipse(tp[0]+Math.sin(ph*4+k)*u*0.3+ph*u*0.6,tp[1]-ph*u*3.0-u*0.2,u*(0.25+ph*0.5),u*(0.2+ph*0.4),0,0,7);c.fill();}
    TH.box(c,x,y,u,-2.0,2.0,1.7,2.5,0,0.2,'#a97d49','#7d5a34','#c49858');[-1.9,1.9].forEach(X=>TH.ln(c,I(X,2.4,0.2),I(X,2.4,2.1),F.bark,u*0.18));}},
  /* ---------- landmarks ---------- */
  lookoutTower:{cat:'landmark',w:2.3,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.4,u*9);const H=9.0;
    const legs=[[-1.9,-1.4],[1.9,-1.4],[-1.9,1.4],[1.9,1.4]],top=(X,Y)=>[X*0.55,Y*0.55];legs.slice(0,2).forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(top(X,Y)[0],top(X,Y)[1],H),F.woodD,u*0.3));
    for(let k=1;k<5;k++){const f=k/5,z=H*f,s=1-0.45*f;TH.ln(c,I(-1.9*s,1.4*s,z),I(1.9*s,1.4*s,z),F.woodD,u*0.14);TH.ln(c,I(1.9*s,-1.4*s,z),I(1.9*s,1.4*s,z),F.woodD,u*0.14);}
    for(let k=0;k<4;k++){const f0=k/5,f1=(k+1)/5,s0=1-0.45*f0,s1=1-0.45*f1;TH.ln(c,I(-1.9*s0,1.4*s0,H*f0),I(1.9*s1,1.4*s1,H*f1),F.wood,u*0.1);TH.ln(c,I(1.9*s0,1.4*s0,H*f0),I(-1.9*s1,1.4*s1,H*f1),F.wood,u*0.1);}
    legs.slice(2).forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(top(X,Y)[0],top(X,Y)[1],H),F.wood,u*0.34));
    for(let k=0;k<7;k++){const f=k/7;TH.ln(c,I(-1.2+f*0.2,1.5,H*f),I(-0.6+f*0.2,1.5,H*(f+0.15)),'#c9a56a',u*0.08);}
    const cs=1.5;TH.box(c,x,y,u,-cs-0.3,cs+0.3,-cs-0.3,cs+0.3,H,H+0.25,'#a97d49','#7d5a34','#c49858');TH.box(c,x,y,u,-cs,cs,-cs,cs,H+0.25,H+1.8,'#b88a56','#8a6238','#d6a86a');
    [[-1.1,-0.2],[0.2,1.1]].forEach(([a,b])=>TH.poly(c,[I(a,cs+0.01,H+0.7),I(b,cs+0.01,H+0.7),I(b,cs+0.01,H+1.5),I(a,cs+0.01,H+1.5)],'#9bd0e8','#4a2f1c',u*0.05));TH.poly(c,[I(cs+0.01,-1.1,H+0.7),I(cs+0.01,1.1,H+0.7),I(cs+0.01,1.1,H+1.5),I(cs+0.01,-1.1,H+1.5)],'#9bd0e8','#4a2f1c',u*0.05);
    const ap=I(0,0,H+3.3);TH.poly(c,[I(-cs-0.4,cs+0.4,H+1.8),I(cs+0.4,cs+0.4,H+1.8),ap],'#5a3b22');TH.poly(c,[I(cs+0.4,-cs-0.4,H+1.8),I(cs+0.4,cs+0.4,H+1.8),ap],'#3f2815');TH.ln(c,ap,[ap[0],ap[1]-u*1.0],'#d5dae6',u*0.08);
    TH.poly(c,[[ap[0],ap[1]-u*1.0],[ap[0]+u*1.1,ap[1]-u*0.8+Math.sin((tm||0)*3)*u*0.1],[ap[0],ap[1]-u*0.5]],'#d9342b');}},
  waterfallCliff:{cat:'landmark',w:3.2,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const r=mulberry(v+4),t=tm||0,H=u*6.0,wt=u*2.7,wb=u*3.4;fsh(c,x,y,u*3.4,u*7);
    fcrag(c,x,y,u,{wt:wt,wb:wb,H:H,seed:v+2,bands:['#8a8f96','#7a7f87','#9a9fa6','#6f747c','#858a92','#7a7f87'],top:'#6f8a5a'});
    const fx=x-u*0.3,top=y-H+wt*0.42*0.9,bot=y+wb*0.42*0.9;c.save();c.beginPath();c.moveTo(fx-u*0.55,top);c.lineTo(fx+u*0.55,top);c.lineTo(fx+u*0.8,bot);c.lineTo(fx-u*0.8,bot);c.closePath();const g=c.createLinearGradient(fx,top,fx,bot);g.addColorStop(0,'#eaf6ff');g.addColorStop(1,'#bfe3f5');c.fillStyle=g;c.fill();c.clip();
    for(let k=0;k<7;k++){const ph=(t*1.4+k*0.31)%1;c.strokeStyle='rgba(255,255,255,'+(0.35+0.3*(1-ph))+')';c.lineWidth=u*0.06;const sx=fx-u*0.45+k*u*0.15;c.beginPath();c.moveTo(sx,top+(bot-top)*ph*0.7);c.lineTo(sx+(k-3)*u*0.02,top+(bot-top)*(ph*0.7+0.3));c.stroke();}c.restore();
    TH.ell(c,fx,bot+u*0.35,u*2.2,u*0.8,'#2f7fa8');TH.ell(c,fx,bot+u*0.3,u*1.9,u*0.66,'#4aa0c8');for(let k=0;k<7;k++){const ph=(t*0.9+k*0.2)%1;c.fillStyle='rgba(255,255,255,'+(0.55*(1-ph))+')';c.beginPath();c.ellipse(fx+(r()-0.5)*u*1.4,bot+u*0.2+ph*u*0.2,u*(0.3+ph*0.4),u*(0.14+ph*0.18),0,0,7);c.fill();}
    for(let k=0;k<4;k++){const ph=(t*0.5+k*0.25)%1;c.fillStyle='rgba(235,245,250,'+(0.3*(1-ph))+')';c.beginPath();c.ellipse(fx+(k-1.5)*u*0.5,bot-ph*u*1.6,u*(0.5+ph*0.6),u*(0.3+ph*0.4),0,0,7);c.fill();}
    [[-1.5,0.1],[0.6,-0.1],[1.4,0.2]].forEach(([dx,dy],i)=>frFir(c,x+dx*u,y-H+dy*u+wt*0.1,u*0.55,0.7+i*0.05,v+i));for(let k=0;k<5;k++)TH.blob(c,x+(r()-0.5)*wb*2.1,y+wb*0.25+r()*u*0.5,u*(0.35+r()*0.3),u*0.2,'#6f747c',r,7);}},
  mountainPeak:{cat:'landmark',w:4.0,tier:3,weight:3,cost:4,draw(c,x,y,u,v){const r=mulberry(v+6);fsh(c,x,y,u*4.2,u*10);const peak=(px,base,hw,H,snowF)=>{const ap=[px,base-H],L=[px-hw,base],Rr=[px+hw,base],M=[px+hw*0.08,base+hw*0.16];
      TH.poly(c,[L,ap,M],'#8e949c');TH.poly(c,[M,ap,Rr],'#575d68');c.strokeStyle='rgba(25,32,44,.35)';c.lineWidth=u*0.07;c.beginPath();c.moveTo(ap[0],ap[1]);c.lineTo(px-hw*0.4,base-H*0.3);c.moveTo(ap[0],ap[1]);c.lineTo(px+hw*0.25,base-H*0.15);c.moveTo(px-hw*0.25,base-H*0.62);c.lineTo(px-hw*0.55,base-H*0.4);c.stroke();
      const sy=base-H*(1-snowF);const sw=(f)=>hw*(1-f);TH.poly(c,[ap,[px-hw*snowF*1.0,sy],[px-hw*snowF*0.6,sy+H*0.07],[px-hw*snowF*0.3,sy-H*0.02],[px+hw*0.05,sy+H*0.09],[px+hw*snowF*0.4,sy+H*0.02],[px+hw*snowF*0.8,sy+H*0.08],[px+hw*snowF*1.0,sy]],'#f4f8fc');
      TH.poly(c,[ap,[px+hw*0.08,sy+H*0.09],[px+hw*snowF*0.4,sy+H*0.02],[px+hw*snowF*0.8,sy+H*0.08],[px+hw*snowF*1.0,sy]],'#c9d6e4');};
    peak(x+u*3.0,y,u*3.0,u*6.5,0.4);peak(x-u*0.5,y,u*4.6,u*10,0.38);
    TH.ell(c,x,y,u*5.2,u*1.6,'#566e42');[[-4.2,0.5,1.5],[3.8,0.6,1.3],[-2.0,0.9,1.0],[1.6,1.0,1.1]].forEach(([dx,dy,s])=>TH.blob(c,x+dx*u,y+dy*u,u*s*1.4,u*s*0.6,'#4a6e48',r,8));[[-3.4,0.8],[-2.6,1.1],[2.7,0.9],[3.5,0.7],[0.4,1.2]].forEach(([dx,dy],i)=>frFir(c,x+dx*u,y+dy*u,u*0.5,0.8+(i%2)*0.15,v+i));}},
  sawmill:{cat:'landmark',w:3.7,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0,r=mulberry(v+3);fsh(c,x,y,u*3.8,u*6);
    TH.poly(c,[I(2.4,-2.6,0.12),I(5.2,-2.6,0.12),I(5.2,2.4,0.12),I(2.4,2.4,0.12)],'#3f7a9a');TH.poly(c,[I(2.7,-2.4,0.14),I(5.0,-2.4,0.14),I(5.0,2.2,0.14),I(2.7,2.2,0.14)],'#4aa0c8');
    TH.box(c,x,y,u,-3.0,2.4,-2.0,2.0,0,3.0,'#9a6a3c','#6f4a28','#b07a46');logWall(c,x,y,u,-3.0,2.4,2.01,0,3.0);logWallE(c,x,y,u,2.41,-2.0,2.0,0,3.0);
    TH.poly(c,[I(-2.2,2.03,0),I(0.2,2.03,0),I(0.2,2.03,2.2),I(-2.2,2.03,2.2)],'#1c130c');for(let k=0;k<3;k++)TH.ln(c,I(-2.0+k*0.9,2.04,0.4),I(-1.8+k*0.9,2.04,2.0),'rgba(200,200,205,.2)',u*0.05);
    TH.ln(c,I(-2.2,2.2,0.4),I(0.2,2.2,0.4),'#5a5f68',u*0.12);TH.box(c,x,y,u,-1.8,-0.2,2.1,2.6,0.4,0.8,'#7a7f87','#555a62','#9aa0a8');TH.ell(c,...I(-1.0,2.3,1.3),u*0.65,u*0.7,'#c9ced6');TH.ell(c,...I(-1.0,2.3,1.3),u*0.12,u*0.12,'#555a62');
    TH.poly(c,[I(-3.4,2.4,2.9),I(2.8,2.4,2.9),I(2.8,0,5.0),I(-3.4,0,5.0)],'#6b4a2b');for(let k=1;k<6;k++)TH.ln(c,I(-3.4,2.4-k*0.4,2.9+k*0.35),I(2.8,2.4-k*0.4,2.9+k*0.35),'rgba(30,18,6,.45)',u*0.06);TH.poly(c,[I(2.4,-2.0,3.0),I(2.4,2.0,3.0),I(2.4,0,4.9)],'#8a5a33');
    const wc=[2.9,0,2.6],R0=2.3,a0=t*0.8;const pt=(a,rr)=>I(wc[0],rr*Math.cos(a),wc[2]+rr*Math.sin(a));c.strokeStyle='#4a3320';c.lineWidth=u*0.3;c.beginPath();for(let k=0;k<=32;k++){const p=pt(k/32*6.283,R0);k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();c.strokeStyle='#8a5a33';c.lineWidth=u*0.16;c.stroke();
    for(let k=0;k<8;k++){const a=a0+k*0.7854;TH.ln(c,pt(a,0),pt(a,R0),'#6b4a2b',u*0.16);const p=pt(a,R0),q=pt(a+0.22,R0+0.45);TH.poly(c,[p,q,pt(a+0.46,R0)],'#a97d49','#4a3320',u*0.04);}TH.ell(c,...pt(0,0),u*0.28,u*0.28,'#2b1b0e');
    for(let k=0;k<3;k++){const ph=(t*0.7+k*0.33)%1;TH.ln(c,I(3.9+ph*0.6,-2.3+ph*0.4,5.2-ph*3.3),I(4.3+ph*0.6,-2.0+ph*0.4,5.0-ph*3.3),'rgba(235,248,255,.6)',u*0.1);}TH.poly(c,[I(3.5,-2.6,5.2),I(4.6,-2.6,5.2),I(4.6,-1.6,3.4),I(3.5,-1.6,3.4)],'rgba(160,110,60,.5)');
    for(let row=0;row<3;row++)for(let col=0;col<4-row;col++)TH.ln(c,I(-3.4+col*0.62+row*0.3,3.0-row*0.1,0.3+row*0.5),I(-1.9+col*0.62+row*0.3,3.0-row*0.1,0.3+row*0.5),['#9a6a3c','#8a5a33'][(row+col)%2],u*0.46);}},
  stockadeFort:{cat:'landmark',w:4.5,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0,S=3.6,wh=3.4;fsh(c,x,y,u*4.8,u*6);TH.poly(c,[I(-S,-S,0.03),I(S,-S,0.03),I(S,S,0.03),I(-S,S,0.03)],'#a98b62');
    const wallY=(Y,x0,x1,col)=>{for(let X=x0;X<=x1;X+=0.36){const b=I(X,Y,0),tp=I(X,Y,wh);TH.ln(c,b,tp,col,u*0.3);TH.poly(c,[[tp[0]-u*0.17,tp[1]],[tp[0]+u*0.17,tp[1]],[tp[0],tp[1]-u*0.45]],col);}};
    const wallX=(X,y0,y1,col)=>{for(let Y=y0;Y<=y1;Y+=0.36){const b=I(X,Y,0),tp=I(X,Y,wh);TH.ln(c,b,tp,col,u*0.3);TH.poly(c,[[tp[0]-u*0.17,tp[1]],[tp[0]+u*0.17,tp[1]],[tp[0],tp[1]-u*0.45]],col);}};
    const tower=(X,Y,col)=>{TH.box(c,x,y,u,X-0.8,X+0.8,Y-0.8,Y+0.8,0,4.6,'#9a6a3c','#6f4a28','#b07a46');logWall(c,x,y,u,X-0.8,X+0.8,Y+0.81,0,4.6);logWallE(c,x,y,u,X+0.81,Y-0.8,Y+0.8,0,4.6);TH.box(c,x,y,u,X-1.0,X+1.0,Y-1.0,Y+1.0,4.6,4.9,'#a97d49','#7d5a34','#c49858');const ap=I(X,Y,6.4);TH.poly(c,[I(X-1.1,Y+1.1,4.9),I(X+1.1,Y+1.1,4.9),ap],'#5a3b22');TH.poly(c,[I(X+1.1,Y-1.1,4.9),I(X+1.1,Y+1.1,4.9),ap],'#3f2815');TH.poly(c,[I(X-0.3,Y+0.82,3.4),I(X+0.3,Y+0.82,3.4),I(X+0.3,Y+0.82,4.2),I(X-0.3,Y+0.82,4.2)],'#161a22');};
    wallY(-S,-S,S,'#7d5a34');wallX(-S,-S,S,'#6f4a28');tower(-S,-S);
    TH.box(c,x,y,u,-2.3,-0.6,-2.2,-0.6,0,1.7,'#9a6a3c','#6f4a28','#b07a46');TH.poly(c,[I(-2.5,-0.4,1.6),I(-0.4,-0.4,1.6),I(-0.4,-1.4,2.8),I(-2.5,-1.4,2.8)],'#5a3b22');TH.poly(c,[I(-0.4,-2.4,1.6),I(-0.4,-0.4,1.6),I(-0.4,-1.4,2.8)],'#7a5a3a');
    TH.box(c,x,y,u,0.6,2.2,-2.3,-0.9,0,1.5,'#9a6a3c','#6f4a28','#b07a46');TH.poly(c,[I(0.4,-0.7,1.4),I(2.4,-0.7,1.4),I(2.4,-1.6,2.5),I(0.4,-1.6,2.5)],'#6b4a2b');
    const fp=I(0.6,0.2,0);TH.ln(c,fp,[fp[0],fp[1]-u*6.2],'#d5dae6',u*0.1);const wv=Math.sin(t*3)*u*0.12;TH.poly(c,[[fp[0],fp[1]-u*6.2],[fp[0]+u*1.6,fp[1]-u*6.0+wv],[fp[0]+u*1.2,fp[1]-u*5.6+wv*1.3],[fp[0]+u*1.6,fp[1]-u*5.2+wv],[fp[0],fp[1]-u*5.3]],'#2f4f8f');
    tower(S,-S);wallX(S,-S,S,'#7d5a34');tower(-S,S);
    wallY(S,-S,-1.0,'#8a6238');wallY(S,1.0,S,'#8a6238');TH.poly(c,[I(-1.0,S+0.01,0),I(1.0,S+0.01,0),I(1.0,S+0.01,2.8),I(-1.0,S+0.01,2.8)],'#140f0a');[-1,1].forEach(s=>{TH.poly(c,[I(s*1.0,S+0.02,0),I(s*0.45,S+0.5,0),I(s*0.45,S+0.5,2.7),I(s*1.0,S+0.02,2.7)],'#6b4a2b','#3b2616',u*0.05);});TH.ln(c,I(-1.0,S+0.05,2.9),I(1.0,S+0.05,2.9),F.woodD,u*0.3);
    tower(S,S);const f1=I(S,S,6.4);TH.ln(c,f1,[f1[0],f1[1]-u*1.2],'#d5dae6',u*0.08);TH.poly(c,[[f1[0],f1[1]-u*1.2],[f1[0]+u*1.1,f1[1]-u*1.0+Math.sin(t*3+1)*u*0.1],[f1[0],f1[1]-u*0.7]],'#b3342f');}}
  }};
const FRONTIER_HEIGHT={berryBush:'low',fernPatch:'low',cattails:'low',fallenLog:'low',boulders:'low',campfire:'low',canoe:'low',fishRack:'low',firewood:'low',railFence:'low',footbridge:'low',beaverDam:'low',deer:'low',
  pineTree:'mid',firGrove:'mid',aspenTree:'mid',trapperTent:'mid',bear:'mid',logCabin:'mid',lookoutTower:'tall',waterfallCliff:'tall',mountainPeak:'tall',sawmill:'tall',stockadeFort:'tall'};
Object.keys(FRONTIER_PACK.assets).forEach(id=>{FRONTIER_PACK.assets[id].h=FRONTIER_HEIGHT[id]||'low';});
/* ===== JUNGLE PACK ===== */
const J={st:'#bdb9a0',stD:'#8e8a72',stL:'#dad7c3',moss:'#5f8a47',mossD:'#3f6a38',jade:'#2fbf9a',ochre:'#b5532f',turq:'#1fb5a8',dark:'#10161a',clay:'#c4683a'};
const jbox=(c,x,y,u,x0,x1,y0,y1,z0,z1,k)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,k?shade(J.st,k):J.st,k?shade(J.stD,k):J.stD,k?shade(J.stL,k):J.stL);
const jsh=(c,x,y,rx,h)=>{c.fillStyle='rgba(8,26,10,.36)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
const jmoss=(c,x,y,u,r,n)=>{for(let k=0;k<(n||3);k++)TH.ell(c,x+(r()-0.5)*u*1.6,y-r()*u*0.3,u*(0.22+r()*0.25),u*0.11,k%2?'rgba(95,138,71,.85)':'rgba(63,106,56,.85)');};
const jglow=(c,x,y,r,rgb,a)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba('+rgb+','+a+')');g.addColorStop(1,'rgba('+rgb+',0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();};
const glyphs=(c,x,y,u,X0,X1,Y,Z0,Z1,r)=>{for(let z=Z0;z<Z1-0.2;z+=0.42)for(let X=X0;X<X1-0.2;X+=0.5){if(r()<0.25)continue;const a=TH.iso(x,y,u,X+0.05,Y,z),b=TH.iso(x,y,u,X+0.05+0.12+r()*0.2,Y,z+(r()<0.5?0:0.12));TH.ln(c,a,b,'rgba(40,38,26,.45)',u*0.07);TH.ln(c,a,TH.iso(x,y,u,X+0.05,Y,z+0.2),'rgba(40,38,26,.4)',u*0.06);}};
const jmask=(c,x,y,u,X,Y,Z,s)=>{const I=(a,b)=>TH.iso(x,y,u,X+a*s,Y,Z+b*s);TH.poly(c,[I(-0.6,-0.6),I(0.6,-0.6),I(0.6,0.6),I(-0.6,0.6)],'rgba(60,56,40,.3)');[-0.3,0.3].forEach(e=>TH.poly(c,[I(e-0.12,0.15),I(e+0.12,0.15),I(e+0.12,0.35),I(e-0.12,0.35)],'rgba(30,30,22,.7)'));TH.ln(c,I(0,0.1),I(0,-0.15),'rgba(30,30,22,.6)',u*0.08);TH.ln(c,I(-0.3,-0.35),I(0.3,-0.35),'rgba(30,30,22,.7)',u*0.1);[-0.2,0.2].forEach(e=>TH.ln(c,I(e,-0.35),I(e,-0.5),'#e8e4d0',u*0.06));};
const JUNGLE_PACK={id:'jungle',name:'Jungle',ground:'#587c48',groundDark:'#456a3a',border:'#35552c',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},
         3:{budget:11,decals:4,landmark:0.75,pool:['templeShrine','corbelArch','ballCourt']},
         4:{budget:15,decals:5,landmark:1,pool:['stepPyramid','templeShrine','corbelArch','ballCourt'],second:0.45}},
  assets:{
  /* ---------- ground decals ---------- */
  leafLitter:{cat:'decal',w:2.2,tier:1,weight:4,cost:0,draw(c,x,y,u,v){const r=mulberry(v+8);TH.ell(c,x,y,u*2.1,u*0.9,'#3f5f36');for(let k=0;k<26;k++){const a=r()*6.283,rr=Math.sqrt(r());TH.ell(c,x+Math.cos(a)*u*1.9*rr,y+Math.sin(a)*u*0.8*rr,u*0.17,u*0.08,['#6a5a2e','#4e7a3a','#8a6a30','#355a2e','#7a4a2a'][k%5],r()*3);}}},
  lilyPond:{cat:'decal',w:2.2,tier:1,weight:2.5,cost:0,draw(c,x,y,u,v,tm){const r=mulberry(v+4),t=tm||0;TH.ell(c,x,y,u*2.2,u*1.0,'#3a5a3a');TH.ell(c,x,y,u*1.95,u*0.86,'#2f7f78');TH.ell(c,x-u*0.2,y-u*0.05,u*1.5,u*0.6,'#3a9a8e');
    c.strokeStyle='rgba(200,245,235,.5)';c.lineWidth=u*0.05;const ph=(t*0.4+v*0.3)%1;c.beginPath();c.ellipse(x+u*0.5,y+u*0.1,u*(0.2+ph*0.7),u*(0.1+ph*0.32),0,0,7);c.stroke();
    for(let k=0;k<5;k++){const px=x+(r()-0.5)*u*2.8,py=y+(r()-0.5)*u*0.9;TH.ell(c,px,py,u*0.36,u*0.18,'#4aa04a');TH.poly(c,[[px,py],[px+u*0.3,py-u*0.05],[px+u*0.3,py+u*0.05]],'#3a7f4a');if(k%2)TH.ell(c,px,py-u*0.05,u*0.1,u*0.07,'#f9a8d4');}}},
  mossyPaving:{cat:'decal',w:2.4,tier:2,weight:3,cost:0,draw(c,x,y,u,v){const I=(X,Y)=>TH.iso(x,y,u,X,Y,0),r=mulberry(v+2);for(let i=-2;i<=1;i++)for(let j=-1;j<=0;j++){if(r()<0.2)continue;const ox=r()*0.1,oy=r()*0.1;TH.poly(c,[I(i*1.1+ox,j*1.1+oy),I(i*1.1+1.0+ox,j*1.1+oy),I(i*1.1+1.0+ox,j*1.1+1.0+oy),I(i*1.1+ox,j*1.1+1.0+oy)],['#a9a58c','#9a967e','#b4b098'][(i+j+3)%3],'rgba(30,40,25,.5)',u*0.05);}
    for(let k=0;k<8;k++){const p=I(-2.2+r()*4.2,-1+r()*2);TH.ell(c,p[0],p[1],u*(0.2+r()*0.3),u*0.12,'rgba(70,120,55,.8)');}}},
  rootCrawl:{cat:'decal',w:2.2,tier:2,weight:2,cost:0,draw(c,x,y,u,v){const r=mulberry(v+6);for(let k=0;k<7;k++){const a=-2.8+k*0.9+(r()-0.5)*0.4,l=u*(1.2+r()*1.2);c.strokeStyle='#4a3a28';c.lineWidth=u*(0.22-k*0.012);c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+Math.cos(a)*l*0.5,y+Math.sin(a)*l*0.25-u*0.2,x+Math.cos(a)*l,y+Math.sin(a)*l*0.4);c.stroke();}
    TH.ell(c,x,y,u*0.4,u*0.22,'#3a2e20');}},
  /* ---------- jungle flora ---------- */
  fernCluster:{cat:'flora',w:1.6,tier:1,weight:4,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*5+2),t=tm||0;jsh(c,x,y,u*1.6,u*1.5);
    for(let k=0;k<9;k++){const a=-3.1+k*0.42,l=u*(1.7+r()*0.8),sw=Math.sin(t*1.3+k)*u*0.06,ex=x+Math.cos(a)*l+sw,ey=y-Math.abs(Math.sin(a))*l*0.9-u*0.2;c.strokeStyle=k%2?'#3f8f45':'#4aa14e';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(ex-x)*0.45,y-l*0.95,ex,ey);c.stroke();
      for(let q=1;q<8;q++){const f=q/8,px=x+(ex-x)*f*0.9,py=y+(ey-y)*f-Math.sin(f*3.0)*l*0.35;TH.ln(c,[px,py],[px+(f<0.9?-u*0.28:0),py+u*0.2],'#58b85a',u*0.06);TH.ln(c,[px,py],[px+u*0.28,py+u*0.2],'#58b85a',u*0.06);}}}},
  elephantEar:{cat:'flora',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v,tm){const t=tm||0;jsh(c,x,y,u*1.6,u*2.5);[[-0.9,-1.5,0.5,'#2f7f3f'],[0.8,-1.8,-0.4,'#3a8f48'],[0.0,-2.4,0.05,'#4aa356']].forEach(([dx,dy,rot,col],i)=>{const sw=Math.sin(t*1.2+i)*u*0.05;TH.ln(c,[x+dx*u*0.3,y],[x+dx*u+sw,y+dy*u*0.55],'#2a6a34',u*0.12);
      c.save();c.translate(x+dx*u+sw,y+dy*u);c.rotate(rot);c.fillStyle=col;c.beginPath();c.moveTo(0,u*0.9);c.bezierCurveTo(-u*1.4,u*0.3,-u*1.0,-u*1.1,0,-u*1.0);c.bezierCurveTo(u*1.0,-u*1.1,u*1.4,u*0.3,0,u*0.9);c.fill();c.strokeStyle='rgba(20,70,30,.55)';c.lineWidth=u*0.06;c.beginPath();c.moveTo(0,u*0.9);c.lineTo(0,-u*0.9);for(let k=-2;k<=2;k++){if(k){c.moveTo(0,u*0.1);c.lineTo(k*u*0.4,-u*0.5);}}c.stroke();c.restore();});}},
  heliconia:{cat:'flora',w:1.3,tier:1,weight:3,cost:1,draw(c,x,y,u,v){const r=mulberry(v*3+7);jsh(c,x,y,u*1.3,u*2.5);for(let k=0;k<4;k++){const bx=x+(k-1.5)*u*0.45,h=u*(2.0+r()*1.2);TH.ln(c,[bx,y],[bx+(r()-0.5)*u*0.3,y-h],'#2f7a3a',u*0.1);
      TH.poly(c,[[bx-u*0.5,y-h*0.3],[bx-u*0.05,y-h*0.55],[bx-u*0.1,y-h*0.2]],'#3a8f48');const cx=bx+(k%2?0.1:-0.1)*u;for(let q=0;q<4;q++){const py=y-h*(0.7+q*0.1);TH.poly(c,[[cx,py+u*0.3],[cx+(q%2?1:-1)*u*0.55,py+u*0.05],[cx,py-u*0.05],[cx+(q%2?1:-1)*u*0.15,py+u*0.2]],['#e0382b','#f06a2a','#f2b22b','#e0382b'][q],'#8a1d14',u*0.03);}}}},
  bamboo:{cat:'flora',w:1.5,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*11+3),t=tm||0;jsh(c,x,y,u*1.5,u*5);for(let k=0;k<7;k++){const bx=x+(k-3)*u*0.32,h=u*(4.6+r()*1.6),sw=Math.sin(t*1.1+k)*u*0.1+(k-3)*u*0.06,col=['#7aa83a','#8ab944','#6a9a34'][k%3];
      TH.ln(c,[bx,y],[bx+sw,y-h],'#4a6a24',u*0.28);TH.ln(c,[bx,y],[bx+sw,y-h],col,u*0.2);for(let q=1;q<7;q++){const f=q/7;TH.ln(c,[bx+sw*f-u*0.15,y-h*f],[bx+sw*f+u*0.15,y-h*f],'#4a6a24',u*0.06);}
      for(let q=0;q<3;q++){const f=0.7+q*0.1;TH.poly(c,[[bx+sw*f,y-h*f],[bx+sw*f+(q%2?1:-1)*u*1.1,y-h*f-u*0.15],[bx+sw*f+(q%2?1:-1)*u*0.3,y-h*f+u*0.12]],'#9acd4a','#5a8a28',u*0.03);}}}},
  palmTree:{cat:'tree',w:1.8,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*9+4),t=tm||0,H=u*(6.4+r()*1.4),lean=(r()-0.5)*u*2.0;jsh(c,x,y,u*2.0,H);
    c.strokeStyle='#6a5236';c.lineWidth=u*0.55;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*0.2,y-H*0.5,x+lean,y-H);c.stroke();c.strokeStyle='#8a6e4a';c.lineWidth=u*0.3;c.stroke();
    for(let k=1;k<12;k++){const f=k/12,px=(1-f)*(1-f)*x+2*(1-f)*f*(x+lean*0.2)+f*f*(x+lean),py=(1-f)*(1-f)*y+2*(1-f)*f*(y-H*0.5)+f*f*(y-H);TH.ln(c,[px-u*0.25,py],[px+u*0.25,py],'rgba(50,34,18,.5)',u*0.06);}
    const tx=x+lean,ty=y-H;for(let k=0;k<9;k++){const a=-3.1+k*0.52,sw=Math.sin(t*1.5+k*0.8)*0.08,l=u*(2.6+(k%2)*0.5);const ex=tx+Math.cos(a+sw)*l,ey=ty+Math.sin(a+sw)*l*0.5+u*0.8;
      c.strokeStyle=k%2?'#2f7f3a':'#3f9a48';c.lineWidth=u*0.18;c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+(ex-tx)*0.55,ty-u*1.2-Math.abs(Math.sin(a))*u*0.6,ex,ey);c.stroke();
      for(let q=1;q<7;q++){const f=q/7,px=tx+(ex-tx)*f,py=ty+(ey-ty)*f-Math.sin(f*3.14)*u*1.0;TH.ln(c,[px,py],[px-(ey-ty)*0.12-u*0.1,py+u*0.5],'#48a852',u*0.07);TH.ln(c,[px,py],[px+(ey-ty)*0.1+u*0.1,py+u*0.5],'#48a852',u*0.07);}}
    [[-0.25,0.35],[0.25,0.4],[0,0.6]].forEach(([dx,dy])=>TH.ell(c,tx+dx*u,ty+dy*u,u*0.28,u*0.28,'#6a4a22'));}},
  kapokTree:{cat:'tree',w:2.6,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v,tm){const r=mulberry(v*7+5),t=tm||0,H=u*5.2;jsh(c,x,y,u*3.0,u*9);
    for(let k=0;k<5;k++){const a=-2.7+k*0.55,l=u*(1.5+r()*0.7);TH.poly(c,[[x+Math.cos(a)*u*0.2,y-u*2.4],[x+Math.cos(a)*l,y+Math.sin(a)*l*0.28+u*0.1],[x+Math.cos(a)*l*0.5+u*0.3,y+Math.sin(a)*l*0.15+u*0.2],[x+u*0.1,y-u*2.8]],k%2?'#6b5a48':'#7a6853');}
    TH.poly(c,[[x-u*0.7,y-u*0.2],[x-u*0.5,y-H],[x+u*0.5,y-H],[x+u*0.7,y-u*0.2]],'#8a7a66');TH.poly(c,[[x+u*0.1,y-H],[x+u*0.5,y-H],[x+u*0.7,y-u*0.2],[x+u*0.15,y-u*0.2]],'rgba(30,24,16,.35)');
    const cols=['#2f6a3a','#3a7a44','#2a5e34','#438a4c'];[[0,-2.4,3.0,2.1],[-2.3,-1.1,2.1,1.5],[2.3,-1.2,2.1,1.5],[0.1,-0.7,2.6,1.6],[-1.2,-3.4,1.9,1.4],[1.4,-3.2,1.8,1.3]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H+dy*u,u*rx,u*ry,cols[i%4],r,10));
    for(let k=0;k<7;k++){const vx=x+(r()-0.5)*u*5.0,vy=y-H+u*(0.0+r()*1.0),l=u*(1.8+r()*2.2),sw=Math.sin(t*0.9+k)*u*0.1;c.strokeStyle=k%2?'#3f6a3a':'#4a7a3a';c.lineWidth=u*0.07;c.beginPath();c.moveTo(vx,vy);c.quadraticCurveTo(vx+sw,vy+l*0.5,vx+sw*1.5,vy+l);c.stroke();}}},
  /* ---------- ruin props ---------- */
  mossBoulder:{cat:'rock',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*13+3);jsh(c,x,y,u*1.9,u*1.4);[[0.0,0.0,1.0,1.0,'#7d7f70'],[-1.0,0.2,0.65,0.6,'#6e7062'],[0.9,0.25,0.6,0.55,'#8a8c7c']].forEach(([dx,dy,sx,sy,col])=>TH.blob(c,x+dx*u,y-u*0.55*sy+dy*u,u*0.9*sx,u*0.75*sy,col,r,9));
    for(let k=0;k<5;k++)TH.ell(c,x+(r()-0.5)*u*1.5,y-u*(0.2+r()*0.8),u*0.3,u*0.14,'rgba(88,140,64,.85)');}},
  fallenColumn:{cat:'rock',w:2.4,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+2);jsh(c,x,y,u*2.4,u*2);
    [[-2.0,-0.9,0.7],[0.0,0.1,0.65],[1.7,-0.4,0.6]].forEach(([X,Y,rr],i)=>{const a=I(X-0.7,Y,rr),b=I(X+0.7,Y,rr);TH.ln(c,a,b,J.stD,u*rr*2.1);TH.ln(c,a,b,J.st,u*rr*1.7);TH.ln(c,[a[0],a[1]-u*rr*0.4],[b[0],b[1]-u*rr*0.4],J.stL,u*rr*0.5);TH.ell(c,a[0],a[1],u*rr*0.55,u*rr*0.9,J.stD);TH.ell(c,a[0],a[1],u*rr*0.3,u*rr*0.5,'#6e6a56');for(let k=0;k<3;k++){const p=I(X-0.4+k*0.4,Y,rr);TH.ln(c,[p[0],p[1]-u*rr*0.9],[p[0],p[1]+u*rr*0.9],'rgba(50,48,34,.3)',u*0.05);}});
    TH.ell(c,x-u*0.9,y-u*0.5,u*0.8,u*0.2,'rgba(80,130,60,.8)');TH.ell(c,x+u*1.6,y-u*0.35,u*0.6,u*0.16,'rgba(70,120,55,.8)');}},
  stela:{cat:'ruin',w:1.3,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+5);jsh(c,x,y,u*1.3,u*4);jbox(c,x,y,u,-0.9,0.9,-0.5,0.5,0,0.4,-0.1);
    TH.poly(c,[I(0.7,-0.2,0.4),I(0.7,0.2,0.4),I(0.7,0.2,4.0),I(0.7,-0.2,4.0)],J.stD);TH.poly(c,[I(-0.7,-0.2,4.0),I(0.7,-0.2,4.0),I(0.7,0.2,4.0),I(-0.7,0.2,4.0)],J.stL);TH.poly(c,[I(-0.7,0.2,0.4),I(0.7,0.2,0.4),I(0.7,0.2,4.0),I(-0.7,0.2,4.0)],J.st);
    jmask(c,x,y,u,0,0.21,3.0,0.9);glyphs(c,x,y,u,-0.6,0.6,0.21,0.7,2.2,r);jmoss(c,x-u*0.3,y+u*0.2,u,r,3);}},
  glyphBlock:{cat:'ruin',w:1.3,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v+3);jsh(c,x,y,u*1.4,u*2);jbox(c,x,y,u,-1.0,1.0,-0.8,0.8,0,1.6);jmask(c,x,y,u,0,0.81,0.85,0.9);jbox(c,x,y,u,-0.6,0.5,-0.5,0.4,1.6,2.1,-0.05);jmask(c,x,y,u,-0.05,0.41,1.85,0.4);jmoss(c,x,y+u*0.3,u,r,4);}},
  chacMool:{cat:'ruin',w:1.7,tier:3,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+8);jsh(c,x,y,u*1.8,u*2);jbox(c,x,y,u,-1.6,1.6,-0.9,0.9,0,0.6,-0.08);
    jbox(c,x,y,u,-1.0,1.1,-0.5,0.5,0.6,1.3);TH.poly(c,[I(-1.2,-0.4,0.6),I(-1.0,-0.4,0.6),I(-1.0,-0.4,1.1),I(-1.2,-0.4,1.1)],J.st);jbox(c,x,y,u,1.0,1.6,-0.3,0.6,0.9,1.5,0.05);TH.ell(c,...I(1.3,0.15,1.7),u*0.3,u*0.3,J.stL);
    TH.ell(c,...I(0.0,0.0,1.35),u*0.45,u*0.22,'#6e6a56');TH.ell(c,...I(0.0,0.0,1.38),u*0.34,u*0.16,'#2b2a22');[[-0.6,0.45],[-0.6,-0.45]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0.9),I(0.1,Y*0.4,1.25),J.st,u*0.22));jmoss(c,x,y+u*0.3,u,r,4);}},
  jaguarStatue:{cat:'ruin',w:1.5,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const r=mulberry(v+4);jsh(c,x,y,u*1.6,u*2);jbox(c,x,y,u,-1.3,1.3,-0.8,0.8,0,0.7,-0.06);const by=y-u*0.7;
    TH.poly(c,[[x-u*1.1,by],[x-u*1.0,by-u*0.9],[x-u*0.3,by-u*1.2],[x+u*0.5,by-u*1.0],[x+u*0.9,by-u*0.3],[x+u*1.0,by]],J.st);TH.poly(c,[[x+u*0.5,by-u*1.0],[x+u*0.9,by-u*0.3],[x+u*1.0,by],[x+u*0.2,by]],'rgba(40,40,28,.35)');
    TH.ln(c,[x-u*1.1,by-u*0.4],[x-u*1.5,by-u*0.9],J.st,u*0.22);TH.poly(c,[[x+u*0.2,by-u*1.1],[x+u*0.9,by-u*1.5],[x+u*1.4,by-u*1.3],[x+u*1.5,by-u*0.7],[x+u*0.9,by-u*0.4],[x+u*0.4,by-u*0.5]],J.stL);
    TH.poly(c,[[x+u*0.4,by-u*1.5],[x+u*0.5,by-u*1.9],[x+u*0.8,by-u*1.5]],J.stL);TH.ell(c,x+u*1.0,by-u*1.0,u*0.1,u*0.1,J.jade);for(let k=0;k<5;k++)TH.ell(c,x-u*0.7+k*u*0.3,by-u*(0.5+(k%2)*0.35),u*0.08,u*0.07,'rgba(40,40,28,.5)');jmoss(c,x,y+u*0.2,u,r,3);}},
  serpentHead:{cat:'ruin',w:1.9,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v){const r=mulberry(v+6);jsh(c,x,y,u*2.0,u*3);
    c.strokeStyle=J.stD;c.lineWidth=u*1.2;c.lineCap='round';c.beginPath();c.moveTo(x+u*2.6,y);c.quadraticCurveTo(x+u*2.2,y-u*1.8,x+u*0.9,y-u*1.4);c.stroke();c.strokeStyle=J.st;c.lineWidth=u*0.9;c.stroke();
    for(let k=0;k<5;k++){const f=k/5;TH.ln(c,[x+u*(2.6-f*1.5),y-u*(f*1.6)-u*0.2],[x+u*(2.6-f*1.5)+u*0.25,y-u*(f*1.6)-u*0.1],'rgba(50,48,34,.4)',u*0.07);}
    jbox(c,x,y,u,-1.4,0.9,-0.9,0.9,0,2.2);TH.poly(c,[[x-u*1.3,y-u*1.5],[x-u*0.4,y-u*2.9],[x+u*0.4,y-u*2.9],[x+u*1.3,y-u*1.5]],J.stL);
    jmask(c,x,y,u,-0.25,0.91,1.2,0.9);TH.ell(c,x-u*0.5,y-u*1.8,u*0.2,u*0.2,J.jade);TH.ell(c,x+u*0.15,y-u*1.8,u*0.2,u*0.2,J.jade);
    TH.poly(c,[[x-u*1.1,y-u*0.3],[x+u*0.7,y-u*0.3],[x+u*0.5,y+u*0.5],[x-u*0.9,y+u*0.5]],'#2b2a22');[[-0.9,0.5],[-0.3,0.5],[0.3,0.5]].forEach(([dx,dy])=>TH.poly(c,[[x+dx*u-u*0.15,y+dy*u-u*0.8],[x+dx*u+u*0.15,y+dy*u-u*0.8],[x+dx*u,y+dy*u-u*0.05]],'#f0ecd8'));TH.poly(c,[[x-u*0.2,y+u*0.1],[x+u*0.2,y+u*0.1],[x,y+u*0.9]],'#b3342f');
    for(let k=0;k<5;k++){const a=-0.4-k*0.35;TH.poly(c,[[x-u*0.4+k*u*0.25,y-u*2.9],[x-u*0.7+k*u*0.4,y-u*3.8-(k%2)*u*0.4],[x-u*0.1+k*u*0.3,y-u*2.9]],[J.turq,J.jade,'#e0382b','#f2b22b','#2f8fd0'][k]);}jmoss(c,x,y+u*0.3,u,r,4);}},
  stoneAltar:{cat:'ruin',w:1.6,tier:3,weight:2.5,cost:1,max:1,draw(c,x,y,u,v,tm){const r=mulberry(v+9),t=tm||0;jsh(c,x,y,u*1.7,u*2);jbox(c,x,y,u,-1.4,1.4,-1.0,1.0,0,0.5,-0.08);jbox(c,x,y,u,-1.1,1.1,-0.7,0.7,0.5,1.5);jmask(c,x,y,u,0,0.71,0.95,0.6);
    TH.ell(c,x,y-u*1.65,u*0.8,u*0.34,'#5e5b48');TH.ell(c,x,y-u*1.7,u*0.65,u*0.27,'#2b2a22');jglow(c,x,y-u*2.3,u*2.4,'255,160,60',0.4+0.1*Math.sin(t*9+v));
    [[0,1.1,0.8],[-0.3,0.75,0.55],[0.3,0.8,0.6]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*11+i*2+v)*u*0.1;TH.poly(c,[[x+dx*u-u*0.3*w,y-u*1.7],[x+dx*u+f,y-u*(1.7+h*1.2)],[x+dx*u+u*0.3*w,y-u*1.7]],i?'#fbbf24':'#f97316');});jmoss(c,x,y+u*0.3,u,r,3);}},
  /* ---------- props ---------- */
  torchPost:{cat:'prop',w:0.9,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v,tm){const t=tm||0;jsh(c,x,y,u,u*4);jbox(c,x,y,u,-0.5,0.5,-0.5,0.5,0,0.5,-0.06);TH.ln(c,[x,y-u*0.4],[x,y-u*2.6],'#6b5a3e',u*0.34);TH.ln(c,[x,y-u*1.2],[x,y-u*1.6],J.turq,u*0.4);
    TH.poly(c,[[x-u*0.5,y-u*2.5],[x+u*0.5,y-u*2.5],[x+u*0.35,y-u*3.0],[x-u*0.35,y-u*3.0]],'#4a3d2a');jglow(c,x,y-u*3.5,u*2.4,'255,160,60',0.4+0.1*Math.sin(t*10+v));
    [[0,1.1,0.8],[-0.25,0.75,0.55],[0.25,0.8,0.6]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*12+i*2+v)*u*0.1;TH.poly(c,[[x+dx*u-u*0.3*w,y-u*3.0],[x+dx*u+f,y-u*(3.0+h*1.2)],[x+dx*u+u*0.3*w,y-u*3.0]],i?'#fbbf24':'#f97316');});}},
  clayPots:{cat:'prop',w:1.4,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u,v){jsh(c,x,y,u*1.5,u*1.5);const pot=(px,py,s,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(px-u*0.45*s,py-u*1.1*s);c.bezierCurveTo(px-u*0.9*s,py-u*0.7*s,px-u*0.7*s,py,px-u*0.3*s,py);c.lineTo(px+u*0.3*s,py);c.bezierCurveTo(px+u*0.7*s,py,px+u*0.9*s,py-u*0.7*s,px+u*0.45*s,py-u*1.1*s);c.closePath();c.fill();
      c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.moveTo(px+u*0.1*s,py-u*1.1*s);c.bezierCurveTo(px+u*0.5*s,py-u*0.9*s,px+u*0.6*s,py-u*0.2*s,px+u*0.3*s,py);c.lineTo(px+u*0.1*s,py);c.fill();TH.ell(c,px,py-u*1.1*s,u*0.45*s,u*0.17*s,'#2a1c12');TH.ln(c,[px-u*0.7*s,py-u*0.55*s],[px+u*0.7*s,py-u*0.55*s],J.turq,u*0.1*s);TH.ln(c,[px-u*0.55*s,py-u*0.3*s],[px+u*0.55*s,py-u*0.3*s],'#f2d24a',u*0.07*s);};
    pot(x-u*0.9,y+u*0.1,0.9,'#c4683a');pot(x+u*0.5,y+u*0.2,1.15,'#b5532f');TH.ell(c,x-u*0.1,y+u*0.5,u*0.55,u*0.2,'#a5502f');TH.ell(c,x-u*0.1,y+u*0.38,u*0.4,u*0.13,'#e8b04a');[[-0.2,0.3],[0.05,0.28]].forEach(([dx,dy],i)=>TH.ell(c,x+dx*u,y+dy*u,u*0.18,u*0.18,['#f06a2a','#f2c230'][i]));}},
  macaw:{cat:'prop',w:0.9,tier:1,weight:3,cost:1,max:1,draw(c,x,y,u,v,tm){const t=tm||0,by=y-u*1.8;jsh(c,x,y,u*0.8,u*3);TH.ln(c,[x,y],[x,y-u*1.7],'#6b5a3e',u*0.2);TH.ln(c,[x-u*0.9,y-u*1.7],[x+u*0.9,y-u*1.7],'#6b5a3e',u*0.16);
    TH.poly(c,[[x-u*0.3,by-u*0.3],[x-u*0.9,by+u*1.1],[x-u*0.55,by+u*1.3],[x-u*0.2,by+u*0.2]],'#2f6fd0');TH.poly(c,[[x-u*0.4,by-u*0.3],[x-u*0.7,by+u*0.9],[x-u*0.5,by+u*1.0],[x-u*0.25,by+u*0.1]],'#e0382b');
    TH.ell(c,x,by-u*0.5,u*0.5,u*0.8,'#d9342b',-0.2);TH.ell(c,x+u*0.15,by-u*0.35,u*0.28,u*0.5,'#f2c230',-0.2);TH.poly(c,[[x-u*0.4,by-u*0.5],[x-u*0.1,by-u*0.9],[x+u*0.15,by-u*0.2]],'#2f6fd0');
    const hb=Math.sin(t*3+v)*u*0.04;TH.ell(c,x+u*0.2,by-u*1.35+hb,u*0.3,u*0.3,'#d9342b');TH.ell(c,x+u*0.3,by-u*1.35+hb,u*0.16,u*0.18,'#f8fafc');TH.ell(c,x+u*0.32,by-u*1.38+hb,u*0.05,u*0.05,'#161616');TH.poly(c,[[x+u*0.45,by-u*1.5+hb],[x+u*0.85,by-u*1.3+hb],[x+u*0.5,by-u*1.15+hb]],'#3a3a3a');TH.poly(c,[[x+u*0.45,by-u*1.5+hb],[x+u*0.8,by-u*1.38+hb],[x+u*0.5,by-u*1.32+hb]],'#f0e8d0');
    TH.ln(c,[x-u*0.1,by+u*0.1],[x-u*0.1,by+u*0.4],'#4a4a4a',u*0.06);TH.ln(c,[x+u*0.2,by+u*0.1],[x+u*0.2,by+u*0.4],'#4a4a4a',u*0.06);}},
  tikiTotem:{cat:'prop',w:1.0,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const r=mulberry(v+2);jsh(c,x,y,u,u*5);TH.ln(c,[x,y],[x,y-u*5.2],'#5a4028',u*1.1);TH.ln(c,[x-u*0.15,y],[x-u*0.15,y-u*5.1],'#7a5836',u*0.35);
    ['#b5532f','#1fb5a8','#e0b53a','#b5532f'].forEach((col,i)=>{const cy=y-u*(0.9+i*1.2);TH.poly(c,[[x-u*0.55,cy-u*0.5],[x+u*0.55,cy-u*0.5],[x+u*0.55,cy+u*0.5],[x-u*0.55,cy+u*0.5]],col,'#2a1c12',u*0.05);[-0.2,0.2].forEach(e=>{TH.ell(c,x+e*u,cy-u*0.1,u*0.13,u*0.13,'#f8fafc');TH.ell(c,x+e*u,cy-u*0.1,u*0.06,u*0.06,'#161616');});TH.ln(c,[x-u*0.25,cy+u*0.22],[x+u*0.25,cy+u*0.22],'#2a1c12',u*0.1);TH.ln(c,[x,cy],[x,cy+u*0.12],'#2a1c12',u*0.07);});
    TH.poly(c,[[x-u*0.4,y-u*5.15],[x,y-u*5.9],[x+u*0.4,y-u*5.15]],'#e0382b');TH.poly(c,[[x-u*1.1,y-u*3.5],[x-u*0.55,y-u*3.9],[x-u*0.55,y-u*3.1]],'#1fb5a8');TH.poly(c,[[x+u*1.1,y-u*3.5],[x+u*0.55,y-u*3.9],[x+u*0.55,y-u*3.1]],'#1fb5a8');}},
  smallShrine:{cat:'structure',w:2.3,tier:3,weight:3,cost:2,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+3);jsh(c,x,y,u*2.6,u*4);jbox(c,x,y,u,-2.2,2.2,-2.0,2.0,0,0.7,-0.06);jbox(c,x,y,u,-1.8,1.8,-1.6,1.6,0.7,1.3,-0.03);
    jbox(c,x,y,u,-1.3,1.3,-1.1,1.1,1.3,3.5);TH.poly(c,[I(-0.5,1.11,1.3),I(0.5,1.11,1.3),I(0.5,1.11,2.8),I(-0.5,1.11,2.8)],J.dark);TH.ln(c,I(-0.55,1.12,2.85),I(0.55,1.12,2.85),J.stL,u*0.14);glyphs(c,x,y,u,-1.2,-0.6,1.11,1.5,3.2,r);glyphs(c,x,y,u,0.6,1.2,1.11,1.5,3.2,r);
    jbox(c,x,y,u,-1.5,1.5,-1.3,1.3,3.5,3.9,0.05);jbox(c,x,y,u,-0.8,0.8,-0.4,0.4,3.9,5.3);[[-0.4,4.3],[0.3,4.7],[-0.2,5.0]].forEach(([X,Z])=>TH.poly(c,[I(X,0.41,Z),I(X+0.25,0.41,Z),I(X+0.25,0.41,Z+0.3),I(X,0.41,Z+0.3)],J.dark));
    for(let k=0;k<9;k++)TH.ln(c,I(-0.5,1.8+k*0.0,0),I(0.5,1.8,0),'rgba(0,0,0,0)',1);jmoss(c,x-u*1.3,y+u*0.9,u,r,4);jmoss(c,x+u*1.1,y+u*0.5,u,r,3);}},
  /* ---------- landmarks ---------- */
  stepPyramid:{cat:'landmark',w:4.6,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+3),n=6,th=1.15,top=n*th,t=tm||0;jsh(c,x,y,u*5.2,u*9);
    for(let i=0;i<n;i++){const s=4.4-i*0.62;jbox(c,x,y,u,-s,s,-s,s,i*th,(i+1)*th,i%2?-0.02:0.03);TH.ln(c,I(-s,s,(i+1)*th),I(s,s,(i+1)*th),'rgba(255,255,240,.22)',u*0.07);
      for(let k=-3;k<=3;k++){if(Math.abs(k*s*0.3)<1.2)continue;const X=k*s*0.3;TH.poly(c,[I(X-0.15,s+0.01,i*th+0.3),I(X+0.15,s+0.01,i*th+0.3),I(X+0.15,s+0.01,i*th+0.75),I(X-0.15,s+0.01,i*th+0.75)],'rgba(30,34,24,.5)');}
      if(i<4)glyphs(c,x,y,u,-s+0.3,-1.2,s+0.01,i*th+0.15,(i+1)*th-0.1,r);}
    const Ya=4.6,Yb=1.4;TH.poly(c,[I(-0.85,Ya,0),I(0.85,Ya,0),I(0.85,Yb,top),I(-0.85,Yb,top)],'#d0ccb4');for(let k=1;k<30;k++){const f=k/30;TH.ln(c,I(-0.85,Ya+(Yb-Ya)*f,top*f),I(0.85,Ya+(Yb-Ya)*f,top*f),'rgba(70,66,48,.4)',u*0.04);}
    [-1,1].forEach(s=>TH.ln(c,I(s*1.0,Ya,0.25),I(s*1.0,Yb,top+0.25),J.stL,u*0.34));TH.poly(c,[I(-1.0,Ya,0),I(-0.85,Ya,0),I(-0.85,Yb,top),I(-1.0,Yb,top)],'rgba(30,30,20,.22)');
    const ts=1.5;jbox(c,x,y,u,-ts,ts,-ts,ts,top,top+1.8);TH.poly(c,[I(-0.5,ts+0.01,top),I(0.5,ts+0.01,top),I(0.5,ts+0.01,top+1.35),I(-0.5,ts+0.01,top+1.35)],J.dark);jmask(c,x,y,u,-1.0,ts+0.01,top+0.9,0.5);jmask(c,x,y,u,1.0,ts+0.01,top+0.9,0.5);
    jbox(c,x,y,u,-ts-0.15,ts+0.15,-ts-0.15,ts+0.15,top+1.8,top+2.1,0.06);jbox(c,x,y,u,-0.95,0.95,-0.5,0.5,top+2.1,top+3.4);[[-0.5,2.5],[0.2,2.9],[-0.2,3.1]].forEach(([X,Z])=>TH.poly(c,[I(X,0.51,top+Z-0.1),I(X+0.3,0.51,top+Z-0.1),I(X+0.3,0.51,top+Z+0.2),I(X,0.51,top+Z+0.2)],J.dark));
    for(let k=0;k<10;k++){const s=4.3-r()*3.2,i=Math.floor(r()*4);TH.blob(c,...I(-s+r()*1.5,s+0.05,i*th+0.5),u*(0.4+r()*0.5),u*0.22,k%2?'#4a7a3a':'#5f8a47',r,7);}
    const f=I(0,0,top+3.4);jglow(c,f[0],f[1]-u*0.5,u*2.4,'255,160,60',0.25+0.08*Math.sin(t*6));}},
  templeShrine:{cat:'landmark',w:3.0,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+5),n=3,th=1.1,top=n*th;jsh(c,x,y,u*3.3,u*6);
    for(let i=0;i<n;i++){const s=3.0-i*0.6;jbox(c,x,y,u,-s,s,-s,s,i*th,(i+1)*th,i%2?-0.02:0.03);TH.ln(c,I(-s,s,(i+1)*th),I(s,s,(i+1)*th),'rgba(255,255,240,.22)',u*0.07);glyphs(c,x,y,u,-s+0.3,-0.8,s+0.01,i*th+0.15,(i+1)*th-0.1,r);}
    const Ya=3.2,Yb=1.3;TH.poly(c,[I(-0.7,Ya,0),I(0.7,Ya,0),I(0.7,Yb,top),I(-0.7,Yb,top)],'#d0ccb4');for(let k=1;k<18;k++){const f=k/18;TH.ln(c,I(-0.7,Ya+(Yb-Ya)*f,top*f),I(0.7,Ya+(Yb-Ya)*f,top*f),'rgba(70,66,48,.4)',u*0.04);}
    const ts=1.2;jbox(c,x,y,u,-ts,ts,-ts,ts,top,top+1.6);TH.poly(c,[I(-0.45,ts+0.01,top),I(0.45,ts+0.01,top),I(0.45,ts+0.01,top+1.2),I(-0.45,ts+0.01,top+1.2)],J.dark);jbox(c,x,y,u,-ts-0.12,ts+0.12,-ts-0.12,ts+0.12,top+1.6,top+1.9,0.06);jbox(c,x,y,u,-0.8,0.8,-0.4,0.4,top+1.9,top+3.0);
    [[-0.4,2.3],[0.2,2.6]].forEach(([X,Z])=>TH.poly(c,[I(X,0.41,top+Z-0.1),I(X+0.25,0.41,top+Z-0.1),I(X+0.25,0.41,top+Z+0.2),I(X,0.41,top+Z+0.2)],J.dark));
    for(let k=0;k<8;k++)TH.blob(c,...I(-2.6+r()*2.0,3.0+0.05,r()*2.2+0.4),u*(0.4+r()*0.5),u*0.22,k%2?'#4a7a3a':'#5f8a47',r,7);jmoss(c,x+u*1.8,y+u*0.8,u,r,4);}},
  ballCourt:{cat:'landmark',w:4.0,tier:3,weight:2.5,cost:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+7);jsh(c,x,y,u*4,u*5);TH.poly(c,[I(-3.4,-1.0,0),I(3.4,-1.0,0),I(3.4,1.0,0),I(-3.4,1.0,0)],'#c9b98a');for(let k=0;k<12;k++)TH.ln(c,I(-3.2+k*0.58,-0.9,0),I(-3.2+k*0.58,0.9,0),'rgba(100,80,40,.25)',u*0.05);TH.ln(c,I(-3.4,0,0),I(3.4,0,0),'rgba(100,80,40,.45)',u*0.07);
    jbox(c,x,y,u,-3.6,3.6,-3.2,-1.5,0,2.8);TH.poly(c,[I(-3.6,-1.5,2.8),I(3.6,-1.5,2.8),I(3.6,-0.9,0),I(-3.6,-0.9,0)],J.st);for(let k=1;k<7;k++){const f=k/7;TH.ln(c,I(-3.6,-1.5+0.6*f,2.8*(1-f)),I(3.6,-1.5+0.6*f,2.8*(1-f)),'rgba(60,56,40,.22)',u*0.05);}
    glyphs(c,x,y,u,-3.4,-1.2,-0.91,0.2,1.8,r);const rc=I(0,-1.5,3.9);c.strokeStyle='#8e8a72';c.lineWidth=u*0.55;c.beginPath();for(let a=0;a<=24;a++){const t=a/24*6.283,p=I(Math.cos(t)*0.9,-1.5,3.9+Math.sin(t)*0.9);a?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();c.strokeStyle=J.stL;c.lineWidth=u*0.2;c.stroke();jmask(c,x,y,u,1.9,-1.49,2.1,0.6);
    jbox(c,x,y,u,-3.6,3.6,1.5,3.2,0,1.9,-0.04);TH.poly(c,[I(-3.6,1.5,1.9),I(3.6,1.5,1.9),I(3.6,1.0,1.4),I(-3.6,1.0,1.4)],'#a9a58c');glyphs(c,x,y,u,-3.4,3.2,3.21,0.3,1.6,r);
    jbox(c,x,y,u,-3.9,-3.2,-0.6,0.6,0,1.4,0.04);jbox(c,x,y,u,3.2,3.9,-0.6,0.6,0,1.4,0.04);for(let k=0;k<9;k++)TH.blob(c,...I(-3.4+r()*6.8,r()<0.5?-2.4:2.5,2.8+r()*0.1),u*(0.3+r()*0.4),u*0.18,k%2?'#4a7a3a':'#5f8a47',r,7);}},
  corbelArch:{cat:'landmark',w:3.2,tier:3,weight:3,cost:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+4);jsh(c,x,y,u*3.2,u*6);TH.poly(c,[I(-1.8,0.0,0),I(1.8,0.0,0),I(0,0.0,5.0)],'#0f1514');
    for(let i=0;i<6;i++){const z0=i*0.95,z1=z0+0.95;jbox(c,x,y,u,-3.1,-1.8+0.42*i,-0.9,0.9,z0,z1,i%2?-0.03:0.02);if(i<4)jbox(c,x,y,u,1.8-0.42*i,3.1,-0.9,0.9,z0,z1,i%2?0.02:-0.03);}
    jbox(c,x,y,u,1.2,3.1,-0.9,0.9,3.8,4.2,-0.04);for(let k=0;k<5;k++)jbox(c,x,y,u,0.6+r()*2.2,1.0+r()*2.2,0.5+r()*0.9,0.8+r()*1.1,0,0.4+r()*0.5,-0.1+r()*0.15);
    jbox(c,x,y,u,-1.3,1.3,-0.7,0.7,5.7,6.2,0.04);jbox(c,x,y,u,-0.5,0.5,-0.3,0.3,6.2,7.5);[[-0.2,6.5],[0.1,6.9]].forEach(([X,Z])=>TH.poly(c,[I(X-0.1,0.31,Z),I(X+0.15,0.31,Z),I(X+0.15,0.31,Z+0.25),I(X-0.1,0.31,Z+0.25)],J.dark));
    glyphs(c,x,y,u,-3.0,-2.0,0.91,0.3,4.0,r);jmask(c,x,y,u,-2.45,0.91,4.2,0.55);
    for(let k=0;k<8;k++){const sx=-3.0+r()*6;TH.ln(c,I(sx,0.95,3.0+r()*2),I(sx+(r()-0.5)*0.3,0.95,1.0+r()*1.5),r()<0.5?'#3f6a3a':'#4a7a3a',u*0.07);}jmoss(c,x-u*2.2,y+u*0.8,u,r,4);jmoss(c,x+u*2.0,y+u*0.6,u,r,3);}}
  }};
const JUNGLE_HEIGHT={fernCluster:'low',elephantEar:'low',heliconia:'low',mossBoulder:'low',fallenColumn:'low',glyphBlock:'low',chacMool:'low',jaguarStatue:'low',serpentHead:'low',stoneAltar:'low',torchPost:'low',clayPots:'low',macaw:'low',
  bamboo:'mid',palmTree:'mid',kapokTree:'mid',stela:'mid',tikiTotem:'mid',smallShrine:'mid',stepPyramid:'tall',templeShrine:'tall',ballCourt:'tall',corbelArch:'tall'};
Object.keys(JUNGLE_PACK.assets).forEach(id=>{JUNGLE_PACK.assets[id].h=JUNGLE_HEIGHT[id]||'low';});
const KEEP_OUT={rx:0.52,ry:0.34};   // central ellipse (x R) reserved for the ride or building sprite
/* opts.avoid = [{x,y,r}] circles (tile-local px) to keep free, used instead of the central ellipse when the tile belongs to a two-tile ride */
function placeThemeAssets(pack,tier,R,seed,opts){
  opts=opts||{};const avoid=opts.avoid||null;
  const rnd=mulberry(seed*7919+tier*131), u=R*0.068, T=pack.tiers[tier], out=[], decals=[], TAU=Math.PI*2;
  if(!T)return {assets:out,decals,u};
  const inside=(x,y,k)=>{const X=Math.abs(x)/R,Y=Math.abs(y)/(0.58*R);return X<=0.866*k&&Y<=k-X/1.732;};
  const ids=Object.keys(pack.assets), cnt={};
  const free=(x,y,w)=>out.every(o=>Math.hypot(o.x-x,(o.y-y)*1.7)>(o.w+w)*u*0.8);
  const clearOfCenter=(x,y,w,h)=>{if(avoid){const kk=h==='tall'?0.75:0.85;for(const a of avoid){if(Math.hypot(x-a.x,(y-a.y)*1.7)<a.r+w*u*kk)return false;}return true;}const kx=h==='tall'?0.28:0.75,ky=h==='tall'?0.18:0.4,ex=R*KEEP_OUT.rx+w*u*kx,ey=R*KEEP_OUT.ry+w*u*ky;return x*x/(ex*ex)+y*y/(ey*ey)>1;};
  const zoneOK=(a,x,y)=>{const h=a.h||'low';if(h==='low')return true;const ax=Math.abs(x)/R;
    if(h==='tall')return y<R*0.12&&ax>(y>=-R*0.12?0.55:0.4);
    if(y>R*0.12)return h==='mid'&&ax>0.5;if(y>=-R*0.12)return h==='mid'||ax>0.55;return true;};
  const ringPoint=(tmax)=>{const th=rnd()*TAU,dx=Math.cos(th),dy=Math.sin(th);let lo=0,hi=R*1.2;
    for(let i=0;i<12;i++){const m=(lo+hi)/2;if(inside(dx*m,dy*m,0.9))lo=m;else hi=m;}const t=0.5+rnd()*((tmax||1)-0.5);return[dx*lo*t,dy*lo*t];};
  const spot=a=>{for(let i=0;i<120;i++){const p=ringPoint(a.h==='tall'?0.8:a.h==='mid'?0.92:1);if(clearOfCenter(p[0],p[1],a.w,a.h)&&zoneOK(a,p[0],p[1])&&free(p[0],p[1],a.w))return p;}return null;};
  const add=(id,x,y)=>{const a=pack.assets[id];out.push({id,x,y,v:Math.floor(rnd()*1000),w:a.w});cnt[id]=(cnt[id]||0)+1;};
  for(let i=0;i<Math.round(T.decals*(opts.decalScale==null?1:opts.decalScale));i++){const pool=ids.filter(id=>pack.assets[id].cat==='decal'&&pack.assets[id].tier<=tier),id=pool[Math.floor(rnd()*pool.length)];
    for(let t=0;t<40;t++){const p=ringPoint();if(clearOfCenter(p[0],p[1],pack.assets[id].w*0.5)){decals.push({id,x:p[0],y:p[1],v:Math.floor(rnd()*1000)});break;}}}
  let budget=Math.max(0,Math.round(T.budget*(opts.budgetScale==null?1:opts.budgetScale)));const maxW=opts.maxW==null?1e9:opts.maxW;
  const land=()=>{let id=T.pool[Math.floor(rnd()*T.pool.length)];for(let q=0;q<8&&cnt[id];q++)id=T.pool[Math.floor(rnd()*T.pool.length)];
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}};
  if(!opts.noLandmarks&&T.pool.length&&rnd()<T.landmark){land();if(T.second&&rnd()<T.second)land();}
  let guard=0;while(budget>0&&guard++<500){const pool=ids.filter(id=>{const a=pack.assets[id];return a.cat!=='decal'&&a.cat!=='landmark'&&a.tier<=tier&&a.cost<=budget&&a.w<=maxW&&(cnt[id]||0)<(a.max||3);});
    if(!pool.length)break;let tot=0;pool.forEach(id=>tot+=pack.assets[id].weight);let pick=rnd()*tot,id=pool[0];for(const q of pool){pick-=pack.assets[q].weight;if(pick<=0){id=q;break;}}
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}else{cnt[id]=99;}}
  return {assets:out,decals,u};
}
function drawThemeGround(ctx,cx,cy,R,pack,border){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);ctx[i?'lineTo':'moveTo'](cx+R*Math.cos(a),cy+R*Math.sin(a)*0.58);}ctx.closePath();
  ctx.fillStyle=pack.ground;ctx.fill();ctx.lineWidth=Math.max(1.5,R*0.03);ctx.strokeStyle=border||pack.border;ctx.stroke();}
function drawThemeDecals(ctx,cx,cy,pack,pl,tm){pl.decals.forEach(d=>pack.assets[d.id].draw(ctx,cx+d.x,cy+d.y,pl.u,d.v,tm||0));}
/* layer: 'back' (y<0, draw BEFORE the ride sprite), 'front' (y>=0, draw AFTER it) or omit for all, sorted by y */
function drawThemeAssets(ctx,cx,cy,pack,pl,tm,layer){pl.assets.filter(o=>layer==='back'?o.y<0:layer==='front'?o.y>=0:true).sort((a,b)=>a.y-b.y).forEach(o=>pack.assets[o.id].draw(ctx,cx+o.x,cy+o.y,pl.u,o.v,tm||0));}
function drawThemedTile(ctx,cx,cy,R,pack,tier,seed,tm,border,rideFn){drawThemeGround(ctx,cx,cy,R,pack,border);const pl=placeThemeAssets(pack,tier,R,seed);
  drawThemeDecals(ctx,cx,cy,pack,pl,tm);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'back');if(rideFn)rideFn(ctx,cx,cy,R);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'front');}
/* ===== END PACK CODE ===== */

/* ===== STATIC GIGA COASTER (two-hex sprites, out-and-back with a helix, baked once) =====
 * Same family as the hyper, but sleeker: slimmer track, thinner and sparser supports, a taller lift and a steeper first drop,
 * fewer hills (1 big airtime hill out, 2 back) and a banked, descending 1.5-turn HELIX at the far end instead of a hammerhead.
 *   drawGigaSide(ctx, cx, cy, R, {accent})                 two hexes side by side (E-W)
 *   drawGigaDiag(ctx, cx, cy, R, {accent, dir})            dir 'NW-SE' (default) or 'NE-SW' (mirrored)
 *   gigaFootprint(R, mode, dir) -> {tiles, circles};  footprintForTile(fp, i) -> circles for placeThemeAssets(..., {avoid})
 *   sceneryInFront(circles, x, y) -> true if the scenery item is in FRONT of the ride (draw it after the ride; everything else before)
 */
const GC_KNOTS=[[0,0.05,0],[0.03,0.05,0],[0.05,0.17,9],[0.11,0.88,9.5],[0.124,0.985,3.5],[0.135,0.985,-3.5],[0.146,0.84,-15],[0.155,0.45,-34],[0.163,0.08,-26],[0.17,0.045,0],
  [0.185,0.34,22],[0.2,0.62,14],[0.215,0.66,0],[0.235,0.52,-13],[0.255,0.09,-22],[0.27,0.045,0],[0.31,0.36,7],[0.344,0.60,3],[0.36,0.61,0],[0.45,0.38,-3.5],[0.52,0.20,-1.8],[0.579,0.10,-1.0],
  [0.60,0.09,0],[0.635,0.34,9],[0.665,0.42,0],[0.70,0.34,-9],[0.735,0.06,-8],[0.75,0.045,0],[0.78,0.22,7],[0.80,0.27,0],[0.82,0.22,-7],[0.845,0.05,-3],[0.86,0.045,0],[1.0,0.05,0]];
function gcZ(f){const K=GC_KNOTS;let i=0;while(i<K.length-2&&f>K[i+1][0])i++;const a=K[i],b=K[i+1],dx=b[0]-a[0],t=Math.max(0,Math.min(1,(f-a[0])/dx)),t2=t*t,t3=t2*t;
  return(2*t3-3*t2+1)*a[1]+(t3-2*t2+t)*dx*a[2]+(-2*t3+3*t2)*b[1]+(t3-t2)*dx*b[2];}
function gcLayout(R,mode){
  gcLayout._c=gcLayout._c||{};const key=mode+R;if(gcLayout._c[key])return gcLayout._c[key];
  const side=mode==='side',N=720,a=side?1.24*R:0.86*R,h=side?0.25*R:0.17*R,S=2*a,Lh=3*Math.PI*h*1.08,arc=Math.PI*h,Lt=2*S+Lh+arc,zsc=0.95*Math.min(1,Lt/(7.9*R)),k=side?1.05:0.92;
  const ax=side?[1,0]:[0.706,0.709],lt=side?[0,-1]:[0.706,-0.709];
  const hexes=side?[[-0.866*R,0],[0.866*R,0]]:[[-0.433*R,-0.435*R],[0.433*R,0.435*R]];
  const wv=s=>{const c=Math.cos(Math.PI*0.5*s/a);return R*0.02*Math.sin(s/a*Math.PI*1.5)*c*c;};
  const g=[],z=[],o=[],bank=[];
  for(let i=0;i<N;i++){const l=i/N*Lt;let s,lat,out,bk=0;
    if(l<S){s=-a+l;lat=h+wv(s);out=lt;}
    else if(l<S+Lh){const th=(l-S)/Lh*3*Math.PI,r=h*(1+0.16*Math.sin(th/3));s=a+r*Math.sin(th);lat=r*Math.cos(th);const v=[ax[0]*r*Math.sin(th)+lt[0]*r*Math.cos(th),ax[1]*r*Math.sin(th)+lt[1]*r*Math.cos(th)],m=Math.hypot(v[0],v[1])||1;out=[v[0]/m,v[1]/m];bk=0.95*Math.sqrt(Math.max(0,Math.sin(th/3)));}
    else if(l<2*S+Lh){s=a-(l-S-Lh);lat=-h+wv(s);out=[-lt[0],-lt[1]];}
    else{const th=(l-2*S-Lh)/h;s=-a-h*Math.sin(th);lat=-h*Math.cos(th);const v=[ax[0]*(s+a)+lt[0]*lat,ax[1]*(s+a)+lt[1]*lat],m=Math.hypot(v[0],v[1])||1;out=[v[0]/m,v[1]/m];bk=0.5*Math.sin(th);}
    g.push([ax[0]*s+lt[0]*lat,ax[1]*s+lt[1]*lat]);o.push(out);bank.push(bk);z.push(zsc*gcZ(i/N)*R);}
  return gcLayout._c[key]={N,g,z,o,bank,hexes,Lt,k,ds:Lt/N,lt,ax,fo:S/Lt,fh:(S+Lh)/Lt};
}
function gcDraw(ctx,cx,cy,R,op,mode){
  const accent=op.accent||'#f8fafc',fl=op.flip?-1:1,L=gcLayout(R,mode),N=L.N,k=L.k,Rk=R*k,hw=R*0.0145*k,thk=R*0.011*k;ctx.save();ctx.translate(cx,cy);ctx.lineJoin='round';ctx.lineCap='round';
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=fill;ctx.lineWidth=0.7;ctx.stroke();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.006;ctx.stroke();}};
  const P=i=>{i=(i+N)%N;return[L.g[i][0],L.g[i][1]-L.z[i]];};
  const ED=[];for(let i=0;i<N;i++){const p=P(i),o=L.o[i],b=L.bank[i],c=Math.cos(b),s=Math.sin(b);ED.push({p,E1:[p[0]+o[0]*hw*c,p[1]+o[1]*hw*c-hw*s],E2:[p[0]-o[0]*hw*c,p[1]-o[1]*hw*c+hw*s],
    R1:[p[0]+o[0]*hw*0.7*c,p[1]+o[1]*hw*0.7*c-hw*0.7*s-R*0.004],R2:[p[0]-o[0]*hw*0.7*c,p[1]-o[1]*hw*0.7*c+hw*0.7*s-R*0.004]});}
  ctx.save();ctx.translate(fl*R*0.04,R*0.03);ctx.beginPath();L.g.forEach((p,i)=>{const z=L.z[i],x=p[0]+fl*z*0.3,y=p[1]+z*0.15;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.strokeStyle='rgba(15,25,20,.15)';ctx.lineWidth=R*0.04*k;ctx.stroke();ctx.restore();
  const items=[];
  // track: slim box spine, two thin rails
  for(let i=0;i<N;i++){const j=(i+1)%N,ei=ED[i],ej=ED[j],key=L.g[i][1]+L.z[i]*0.05,f=i/N,lift=f>0.045&&f<0.13;
    items.push({k:key,f:()=>{const nearE1=(ei.E1[1]+ej.E1[1])>(ei.E2[1]+ej.E2[1]),ea=nearE1?ei.E1:ei.E2,eb=nearE1?ej.E1:ej.E2;
      poly([ea,eb,[eb[0],eb[1]+thk],[ea[0],ea[1]+thk]],shade(accent,-0.4));line([ei.p[0],ei.p[1]+thk*0.55],[ej.p[0],ej.p[1]+thk*0.55],shade(accent,-0.55),R*0.009*k);
      poly([ei.E1,ej.E1,ej.E2,ei.E2],accent);line(ei.R1,ej.R1,'#1f2636',R*0.0045*k);line(ei.R2,ej.R2,'#1f2636',R*0.0045*k);line(ei.p,ej.p,'rgba(255,255,255,.3)',R*0.005*k);
      if(lift&&i%4===0)line([ei.p[0]+L.o[i][0]*hw*0.6,ei.p[1]+L.o[i][1]*hw*0.6],[ei.p[0]-L.o[i][0]*hw*0.6,ei.p[1]-L.o[i][1]*hw*0.6],'#141a28',R*0.005);}});}
  // supports: slender tubes, sparse on the flat parts, closer under the lift, drops and helix; helix columns stand just outside the turn
  let acc=0;for(let i=0;i<N;i++){acc+=L.ds;const zi=L.z[i],sl=Math.abs(L.z[(i+1)%N]-L.z[(i+N-1)%N])/(2*L.ds),helix=i/N>L.fo&&i/N<L.fh,sp=(sl>0.7?R*0.11:helix?R*0.15:sl>0.3?R*0.17:R*0.3)*k;
    if(acc<sp||zi<R*0.07)continue;acc=0;const o=L.o[i],off=(L.bank[i]>0.45?R*0.03*k:0),G=[L.g[i][0]+o[0]*off,L.g[i][1]+o[1]*off],H=ED[i].p,top=[H[0],H[1]+thk*1.2],key=L.g[i][1]+zi*0.05-0.002;
    items.push({k:key,f:()=>{const tall=zi>R*0.42,foot=c=>{ctx.fillStyle='rgba(20,28,40,.3)';ctx.beginPath();ctx.ellipse(c[0],c[1]+R*0.003,R*0.03*k,R*0.012*k,0,0,7);ctx.fill();};
      const tube=(a,b,w)=>{line(a,b,'#98a2b6',w);line([a[0]-w*0.18,a[1]],[b[0]-w*0.18,b[1]],'#eef2f8',w*0.55);};
      if(!tall){foot(G);tube(G,[(G[0]+top[0])/2,(G[1]+top[1])/2],R*0.021*k);tube([(G[0]+top[0])/2,(G[1]+top[1])/2],top,R*0.014*k);}
      else{const sg=R*(0.035+0.03*Math.min(1,zi/(R*0.9)))*k,st=R*0.022*k;[-1,1].forEach(s=>{const b=[G[0]+o[0]*s*sg,G[1]+o[1]*s*sg],t=[top[0]+o[0]*s*st,top[1]+o[1]*s*st];foot(b);tube(b,[(b[0]+t[0])/2,(b[1]+t[1])/2],R*0.018*k);tube([(b[0]+t[0])/2,(b[1]+t[1])/2],t,R*0.012*k);});
        const y0=G[1]+(top[1]-G[1])*0.5,sx=sg+(st-sg)*0.5;line([G[0]-o[0]*sx,y0-o[1]*sx],[G[0]+o[0]*sx,y0+o[1]*sx],'#c2cad8',R*0.007*k);}
      line([top[0]-o[0]*R*0.04*k,top[1]-o[1]*R*0.04*k],[top[0]+o[0]*R*0.04*k,top[1]+o[1]*R*0.04*k],'#d3d9e5',R*0.009*k);}});}
  // station: slim platform + accent canopy beside the start of the outbound lane
  const i0=Math.round(0.006*N),i1=Math.round(0.04*N),b=L.lt,g0=L.g[i0],g1=L.g[i1],pf=(g,off,up)=>[g[0]+b[0]*off,g[1]+b[1]*off-up];
  items.push({k:g0[1]-Rk*0.02,f:()=>{poly([pf(g0,Rk*0.04,Rk*0.02),pf(g1,Rk*0.04,Rk*0.02),pf(g1,Rk*0.13,Rk*0.02),pf(g0,Rk*0.13,Rk*0.02)],'#e2e8f0','#94a3b8',Rk*0.006);poly([pf(g0,Rk*0.04,Rk*0.02),pf(g1,Rk*0.04,Rk*0.02),pf(g1,Rk*0.04,0),pf(g0,Rk*0.04,0)],'#94a3b8');}});
  items.push({k:g1[1]+Rk*0.1,f:()=>{[0.11,0.055].forEach(off=>[g0,g1].forEach(g=>line(pf(g,Rk*off,Rk*0.02),pf(g,Rk*off,Rk*0.1),'#eef1f7',Rk*0.007)));
    poly([pf(g0,Rk*0.035,Rk*0.1),pf(g1,Rk*0.035,Rk*0.1),pf(g1,Rk*0.14,Rk*0.1),pf(g0,Rk*0.14,Rk*0.1)],shade(accent,0.12),shade(accent,-0.3),Rk*0.006);line(pf(g0,Rk*0.14,Rk*0.1),pf(g1,Rk*0.14,Rk*0.1),shade(accent,-0.4),Rk*0.011);line(pf(g0,Rk*0.035,Rk*0.1),pf(g1,Rk*0.035,Rk*0.1),shade(accent,-0.4),Rk*0.011);}});
  // two static trains (one in the station, one on the lift): sleek white cars with land-colour noses
  const car=(i,lead)=>{const p=P(i),pn=P(i+2),pp=P(i-2);let tx=pn[0]-pp[0],ty=pn[1]-pp[1];const m=Math.hypot(tx,ty)||1;tx/=m;ty/=m;const o=L.o[(i+N)%N],c=[p[0],p[1]-Rk*0.012],lx=Rk*0.03,wy=Rk*0.018;
    const q=(a,bb,dz)=>[c[0]+tx*a+o[0]*bb,c[1]+ty*a+o[1]*bb+dz];items.push({k:L.g[(i+N)%N][1]+L.z[(i+N)%N]*0.05+0.01,f:()=>{
      poly([q(-lx,wy,0),q(lx,wy,0),q(lx,wy,Rk*0.012),q(-lx,wy,Rk*0.012)],'#c3cad8');poly([q(-lx,-wy,0),q(lx,-wy,0),q(lx,wy,0),q(-lx,wy,0)],'#f6f8fc');
      poly([q(-lx,-wy,0),q(-lx*0.35,-wy,0),q(-lx*0.35,wy,0),q(-lx,wy,0)],'#2a3144');poly([q(lx*0.4,-wy,0),q(lx,-wy,0),q(lx,wy,0),q(lx*0.4,wy,0)],lead?accent:shade(accent,0.3));
      [-0.45,0.45].forEach(d=>{const h=q(-lx*0.1,d*wy,-Rk*0.02);ctx.fillStyle='#fde4c8';ctx.beginPath();ctx.arc(h[0],h[1],Rk*0.011,0,7);ctx.fill();ctx.fillStyle=['#3b82f6','#ef4444','#22c55e','#f59e0b'][(i+(d>0?1:0))%4];ctx.fillRect(h[0]-Rk*0.008,h[1]+Rk*0.009,Rk*0.016,Rk*0.012);});}});};
  const sp=Math.round(Rk*0.066/L.ds);[0.04,0.095].forEach(fh=>{const ih=Math.round(fh*N);for(let q=0;q<7;q++)car(ih-q*sp,q===0);});
  items.sort((a,b)=>a.k-b.k).forEach(it=>it.f());ctx.restore();
}
function gigaSprite(R,mode,dir,accent,scale){
  gigaSprite._c=gigaSprite._c||{};const sc=scale||getBakeScale(),key=[mode,dir,Math.round(R*sc),R,accent,sc].join('|');if(gigaSprite._c[key])return gigaSprite._c[key];
  const side=mode==='side',W=Math.ceil((side?3.6:2.6)*R),H=Math.ceil((side?2.3:3.0)*R),oy=(side?1.65:2.0)*R,cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);
  const g=cv.getContext('2d');g.scale(sc,sc);g.save();g.translate(W/2,oy);if(dir==='NE-SW')g.scale(-1,1);gcDraw(g,0,0,R,{accent:accent,flip:dir==='NE-SW'},mode);g.restore();
  return gigaSprite._c[key]={canvas:cv,ox:W/2,oy:oy,w:W,h:H};
}
function drawGigaSide(ctx,cx,cy,R,o){o=o||{};const s=gigaSprite(R,'side','NW-SE',o.accent||'#f8fafc');ctx.drawImage(s.canvas,cx-s.ox,cy-s.oy,s.w,s.h);}
function drawGigaDiag(ctx,cx,cy,R,o){o=o||{};const d=o.dir==='NE-SW'?'NE-SW':'NW-SE',s=gigaSprite(R,'diag',d,o.accent||'#f8fafc');ctx.drawImage(s.canvas,cx-s.ox,cy-s.oy,s.w,s.h);}
function gigaFootprint(R,mode,dir){
  const L=gcLayout(R,mode),m=dir==='NE-SW'?-1:1,c=[];for(let i=0;i<L.N;i+=5)c.push({x:L.g[i][0]*m,y:L.g[i][1],r:R*0.105*L.k});
  const i0=Math.round(0.006*L.N),i1=Math.round(0.04*L.N),mid=[(L.g[i0][0]+L.g[i1][0])/2+L.lt[0]*R*0.09*L.k,(L.g[i0][1]+L.g[i1][1])/2+L.lt[1]*R*0.09*L.k];c.push({x:mid[0]*m,y:mid[1],r:R*0.13*L.k});
  return{tiles:L.hexes.map(h=>[h[0]*m,h[1]]),circles:c};
}
window.footprintForTile=window.footprintForTile||function(fp,i){const t=fp.tiles[i];return fp.circles.map(c=>({x:c.x-t[0],y:c.y-t[1],r:c.r}));};
/* DRAW ORDER: a ride paints OVER scenery that stands behind it. Draw scenery for which this is false BEFORE the ride, the rest AFTER. */
window.sceneryInFront=window.sceneryInFront||function(circles,x,y){let f=-Infinity;for(const c of circles){const dx=x-c.x;if(Math.abs(dx)<c.r)f=Math.max(f,c.y+Math.sqrt(c.r*c.r-dx*dx)/1.7);}return f>-Infinity&&y>f;};
const BIG_RIDE_SCENERY={maxW:2.0,budgetScale:0.45,decalScale:0.6,noLandmarks:true};
/* ===== END STATIC HYPER ===== */
return Object.freeze({ side: drawGigaSide, diag: drawGigaDiag });
})();

const hyperCoasterPack = (() => {

/* ===== THEME PACK CORE (shared by every theme pack; copy once into engine.js) ===== */
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
/* ===== FRONTIER PACK ===== */
const F={wood:'#8a5a33',woodD:'#5a3b22',woodL:'#b07a46',bark:'#6b4a2b',endc:'#d9b27a',pine:'#2f5f3a',pineL:'#3d7348',pineD:'#26503a',water:'#4aa0c8',waterD:'#2f7fa8',rock:'#8a8f96',rockD:'#5f656c',rockL:'#b4b9c0',snow:'#f4f8fc',canvas:'#eadfc4'};
const fsh=(c,x,y,rx,h)=>{c.fillStyle='rgba(12,34,14,.32)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
const logWall=(c,x,y,u,X0,X1,Y,Z0,Z1)=>{let k=0;for(let z=Z0+0.17;z<Z1;z+=0.34,k++){const a=TH.iso(x,y,u,X0,Y,z),b=TH.iso(x,y,u,X1,Y,z);TH.ln(c,a,b,k%2?F.wood:'#7d4f2b',u*0.36);TH.ln(c,[a[0],a[1]-u*0.09],[b[0],b[1]-u*0.09],'rgba(255,225,170,.28)',u*0.08);}};
const logWallE=(c,x,y,u,X,Y0,Y1,Z0,Z1)=>{let k=0;for(let z=Z0+0.17;z<Z1;z+=0.34,k++){const a=TH.iso(x,y,u,X,Y0,z),b=TH.iso(x,y,u,X,Y1,z);TH.ln(c,a,b,k%2?'#6f4524':'#5f3b1f',u*0.36);}};
const logEnds=(c,x,y,u,X,Y,Z0,Z1)=>{for(let z=Z0+0.17;z<Z1;z+=0.34){const p=TH.iso(x,y,u,X,Y,z);TH.ell(c,p[0],p[1],u*0.2,u*0.17,F.endc);TH.ell(c,p[0],p[1],u*0.09,u*0.07,'#b8884f');}};
function frFir(c,x,y,u,s,v){const H=u*6.2*s,tiers=6;fsh(c,x,y,u*1.6*s,H);TH.ln(c,[x,y],[x,y-u*1.2*s],'#4a3320',u*0.5*s);
  for(let k=0;k<tiers;k++){const t=k/(tiers-1),by=y-u*1.0*s-H*0.76*t,w=u*(1.75-1.2*t)*s,h=u*1.5*s;
    TH.poly(c,[[x-w,by+h*0.2],[x-w*0.35,by-h*0.3],[x,by-h*1.15],[x+w*0.35,by-h*0.3],[x+w,by+h*0.2],[x,by+h*0.55]],k%2?F.pine:F.pineL);
    TH.poly(c,[[x,by-h*1.15],[x+w*0.35,by-h*0.3],[x+w,by+h*0.2],[x+w*0.3,by+h*0.35]],'rgba(8,30,18,.4)');}}
const fcrag=(c,x,y,u,o)=>{const wt=o.wt,wb=o.wb,H=o.H,r=mulberry(o.seed),n=o.bands.length;TH.ell(c,x,y,wb*1.1,wb*0.47,'#6f7a62');c.save();c.beginPath();c.moveTo(x-wt,y-H);c.lineTo(x-wb,y);c.ellipse(x,y,wb,wb*0.42,0,Math.PI,0,true);c.lineTo(x+wt,y-H);c.ellipse(x,y-H,wt,wt*0.42,0,0,Math.PI);c.closePath();c.clip();
  const Hh=H+wb*0.42;for(let j=0;j<n;j++){c.fillStyle=o.bands[j];c.fillRect(x-wb-2,y-H+Hh*j/n,wb*2+4,Hh/n+1);}
  const g=c.createLinearGradient(x-wb,0,x+wb,0);g.addColorStop(0,'rgba(255,255,255,.22)');g.addColorStop(0.45,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,15,25,.5)');c.fillStyle=g;c.fillRect(x-wb-2,y-H-2,wb*2+4,Hh+4);
  for(let k=0;k<8;k++){const fx=x+(r()*2-1)*wt*0.9,bx=x+(fx-x)*wb/wt;c.strokeStyle='rgba(20,28,36,.3)';c.lineWidth=u*0.07;c.beginPath();c.moveTo(fx,y-H+wt*0.25);c.quadraticCurveTo((fx+bx)/2+u*0.12,y-H/2,bx,y+wb*0.3);c.stroke();}
  c.restore();TH.ell(c,x,y-H,wt,wt*0.42,o.top||'#6f8a5a');};
const FRONTIER_PACK={id:'frontier',name:'Frontier',ground:'#7d955d',groundDark:'#6b8350',border:'#566e42',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},
         3:{budget:11,decals:4,landmark:0.75,pool:['lookoutTower','waterfallCliff','mountainPeak']},
         4:{budget:15,decals:5,landmark:1,pool:['stockadeFort','sawmill','mountainPeak','waterfallCliff','lookoutTower'],second:0.45}},
  assets:{
  /* ---------- ground decals ---------- */
  riverBend:{cat:'decal',w:3.2,tier:1,weight:4,cost:0,draw(c,x,y,u,v,tm){const r=mulberry(v+3),f=v%2?-1:1,t=tm||0;const path=()=>{c.beginPath();c.moveTo(x-u*3.2,y-u*0.5*f);c.bezierCurveTo(x-u*1.6,y+u*0.7*f,x-u*0.1,y-u*0.9*f,x+u*3.2,y+u*0.5*f);};
    c.lineCap='round';path();c.strokeStyle='#6b5a3a';c.lineWidth=u*1.55;c.stroke();path();c.strokeStyle='#2f7fa8';c.lineWidth=u*1.2;c.stroke();path();c.strokeStyle='#4aa0c8';c.lineWidth=u*0.9;c.stroke();
    c.setLineDash([u*0.35,u*0.55]);c.lineDashOffset=-t*u*1.5;path();c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=u*0.08;c.stroke();c.setLineDash([]);
    for(let k=0;k<9;k++){const s=r(),b=(1-s)**3*(x-u*3.2)+3*(1-s)**2*s*(x-u*1.6)+3*(1-s)*s*s*(x-u*0.1)+s**3*(x+u*3.2),yy=(1-s)**3*(y-u*0.5*f)+3*(1-s)**2*s*(y+u*0.7*f)+3*(1-s)*s*s*(y-u*0.9*f)+s**3*(y+u*0.5*f);TH.ell(c,b,yy+(k%2?1:-1)*u*0.8,u*0.2,u*0.12,['#8a8f96','#a5a9ad','#6f747a'][k%3]);}}},
  pebbleBar:{cat:'decal',w:2.0,tier:1,weight:3,cost:0,draw(c,x,y,u,v){const r=mulberry(v+5);TH.ell(c,x,y,u*2.0,u*0.9,'#b9b4a2');for(let k=0;k<28;k++){const a=r()*6.283,rr=Math.sqrt(r());TH.ell(c,x+Math.cos(a)*u*1.8*rr,y+Math.sin(a)*u*0.8*rr,u*0.14,u*0.09,['#8a8f96','#a8a290','#c9c3b0','#6f747a'][k%4]);}}},
  pineNeedles:{cat:'decal',w:2.2,tier:1,weight:3.5,cost:0,draw(c,x,y,u,v){const r=mulberry(v+8);TH.ell(c,x,y,u*2.2,u*0.95,'#6b4f32');TH.ell(c,x-u*0.2,y-u*0.05,u*1.7,u*0.7,'#7b5c3a');for(let k=0;k<34;k++){const a=r()*6.283,rr=Math.sqrt(r()),px=x+Math.cos(a)*u*2.0*rr,py=y+Math.sin(a)*u*0.85*rr;TH.ln(c,[px,py],[px+u*0.28,py-u*0.1],k%3?'#4a3320':'#8a6a45',u*0.04);}}},
  wildMeadow:{cat:'decal',w:2.2,tier:1,weight:3.5,cost:0,draw(c,x,y,u,v){const r=mulberry(v+9);for(let k=0;k<30;k++){const a=r()*6.283,rr=Math.sqrt(r()),px=x+Math.cos(a)*u*2.0*rr,py=y+Math.sin(a)*u*0.9*rr;TH.ln(c,[px,py],[px+(r()-0.5)*u*0.2,py-u*(0.3+r()*0.3)],'#4a7a3c',u*0.05);if(k%3===0)TH.ell(c,px,py-u*0.5,u*0.09,u*0.12,['#8a5ad0','#f2d24a','#f8fafc','#d884e0'][k%4]);}}},
  /* ---------- trees and plants ---------- */
  pineTree:{cat:'tree',w:1.8,tier:2,weight:3.5,cost:2,max:2,draw(c,x,y,u,v){frFir(c,x,y,u,1.3+(v%3)*0.12,v);}},
  firGrove:{cat:'tree',w:2.3,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v){[[-1.1,0.2,0.8],[1.0,0.3,0.92],[0.0,-0.5,0.7]].sort((a,b)=>a[1]-b[1]).forEach(([dx,dy,s])=>frFir(c,x+dx*u,y+dy*u,u,s,v));}},
  aspenTree:{cat:'tree',w:1.7,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*5+2),H=u*(4.2+r()*0.8),t=tm||0;fsh(c,x,y,u*1.8,u*6);TH.ln(c,[x,y],[x+u*0.1,y-H],'#d8d3c2',u*0.5);TH.ln(c,[x+u*0.12,y],[x+u*0.2,y-H],'rgba(60,50,40,.25)',u*0.2);
    for(let k=0;k<9;k++){const ky=y-u*(0.4+k*0.45);TH.ln(c,[x-u*0.18,ky],[x+u*0.05,ky-u*0.05],'#3a3228',u*0.06);}
    const cols=['#c9b43a','#b2c040','#9ab838','#d6c046'];[[0,-0.9,1.9,1.5],[-1.2,0.1,1.4,1.1],[1.2,0.0,1.4,1.1],[0.1,0.1,1.7,1.2],[-0.5,-1.9,1.2,0.95]].forEach(([dx,dy,rx,ry],i)=>{const sw=Math.sin(t*1.4+i)*u*0.06;TH.blob(c,x+dx*u+sw,y-H+dy*u,u*rx,u*ry,cols[i%4],r,9);});}},
  berryBush:{cat:'plant',w:1.4,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*3+6);fsh(c,x,y,u*1.4,u);[[-0.7,-0.5,0.85,'#3f7a45'],[0.7,-0.5,0.8,'#4a8a4c'],[0,-0.95,0.95,'#559858'],[-0.1,-0.45,0.85,'#437f48']].forEach(([dx,dy,s,col])=>TH.blob(c,x+dx*u,y+dy*u,u*s,u*s*0.72,col,r,9));
    for(let k=0;k<9;k++)TH.ell(c,x+(r()-0.5)*u*1.8,y-u*(0.3+r()*1.0),u*0.1,u*0.1,['#3a5ad0','#d9342b','#5a3ad0'][k%3]);}},
  fernPatch:{cat:'plant',w:1.5,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*5+2),t=tm||0;fsh(c,x,y,u*1.5,u*1.5);for(let k=0;k<8;k++){const a=-3.1+k*0.48,l=u*(1.5+r()*0.7),sw=Math.sin(t*1.2+k)*u*0.05,ex=x+Math.cos(a)*l+sw,ey=y-Math.abs(Math.sin(a))*l*0.8-u*0.15;
      c.strokeStyle=k%2?'#2f6a3a':'#3a7a44';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(ex-x)*0.45,y-l*0.85,ex,ey);c.stroke();
      for(let q=1;q<7;q++){const f=q/7,px=x+(ex-x)*f*0.92,py=y+(ey-y)*f-Math.sin(f*3.0)*l*0.3;TH.ln(c,[px,py],[px-u*0.26,py+u*0.18],'#4a8e4e',u*0.05);TH.ln(c,[px,py],[px+u*0.26,py+u*0.18],'#4a8e4e',u*0.05);}}}},
  cattails:{cat:'plant',w:1.4,tier:1,weight:3,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*4+3),t=tm||0;TH.ell(c,x,y+u*0.1,u*1.6,u*0.6,'#3f8fb5');TH.ell(c,x-u*0.2,y,u*1.2,u*0.4,'#56a8cc');
    for(let k=0;k<8;k++){const bx=x+(k-3.5)*u*0.3,h=u*(2.4+r()*1.3),sw=Math.sin(t*1.3+k)*u*0.06;TH.ln(c,[bx,y],[bx+sw,y-h],'#5a8a3a',u*0.1);TH.ln(c,[bx,y-h*0.3],[bx-u*0.5+sw,y-h*0.95],'#4a7a32',u*0.06);if(k%2===0){TH.ell(c,bx+sw,y-h*0.82,u*0.13,u*0.38,'#6b4a2b');TH.ln(c,[bx+sw,y-h*0.6],[bx+sw,y-h*1.15],'#8a6a45',u*0.04);}}}},
  fallenLog:{cat:'plant',w:2.4,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+2);fsh(c,x,y,u*2.4,u*1.5);const a=I(-2.2,0,0.5),b=I(2.2,0,0.5);TH.ln(c,a,b,'#4a3320',u*1.2);TH.ln(c,a,b,F.bark,u*1.0);TH.ln(c,[a[0],a[1]-u*0.3],[b[0],b[1]-u*0.3],F.woodL,u*0.2);
    for(let k=0;k<7;k++){const p=I(-1.8+k*0.6,0,0.5);TH.ln(c,[p[0],p[1]-u*0.45],[p[0]+u*0.2,p[1]+u*0.4],'rgba(40,24,10,.35)',u*0.05);}TH.ell(c,b[0],b[1],u*0.5,u*0.62,F.endc);[0.16,0.3,0.44].forEach(s=>{c.strokeStyle='rgba(120,80,40,.5)';c.lineWidth=u*0.04;c.beginPath();c.ellipse(b[0],b[1],u*s*1.1,u*s*1.3,0,0,7);c.stroke();});
    TH.ln(c,I(0.5,0,0.8),I(1.2,-0.6,1.7),F.bark,u*0.16);TH.blob(c,...I(-1.0,0.1,1.1),u*0.7,u*0.2,'rgba(95,138,71,.95)',r,7);for(let k=0;k<3;k++){const p=I(-0.4+k*0.35,0.5,0.75);TH.ln(c,[p[0],p[1]],[p[0],p[1]-u*0.35],'#e8e0cc',u*0.06);TH.ell(c,p[0],p[1]-u*0.4,u*0.16,u*0.1,'#c9663a');}}},
  boulders:{cat:'rock',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*13+3);fsh(c,x,y,u*1.9,u*1.4);[[0.0,0.0,1.0,1.0,'#80858d'],[-1.0,0.2,0.65,0.6,'#6f747c'],[0.9,0.25,0.6,0.55,'#8f949b']].forEach(([dx,dy,sx,sy,col])=>TH.blob(c,x+dx*u,y-u*0.55*sy+dy*u,u*0.9*sx,u*0.75*sy,col,r,9));
    for(let k=0;k<4;k++)TH.ell(c,x+(r()-0.5)*u*1.4,y-u*(0.2+r()*0.7),u*0.2,u*0.1,k%2?'rgba(150,170,90,.8)':'rgba(95,138,71,.7)');}},
  /* ---------- props ---------- */
  campfire:{cat:'prop',w:1.7,tier:1,weight:3,cost:1,max:1,draw(c,x,y,u,v,tm){const t=tm||0;fsh(c,x,y,u*1.8,u*2);TH.ell(c,x,y+u*0.1,u*1.2,u*0.5,'#4a3a2a');for(let k=0;k<9;k++){const a=k/9*6.283;TH.ell(c,x+Math.cos(a)*u*0.95,y+u*0.1+Math.sin(a)*u*0.42,u*0.28,u*0.18,['#8a8f96','#6f747a'][k%2]);}
    TH.ln(c,[x-u*0.7,y+u*0.1],[x+u*0.6,y-u*0.3],'#4a3320',u*0.24);TH.ln(c,[x+u*0.7,y+u*0.15],[x-u*0.5,y-u*0.3],'#5a4028',u*0.24);
    [[-1.9,0.4],[1.9,0.5]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u-u*0.5,y+dy*u],[x+dx*u+u*0.5,y+dy*u-u*0.1],'#6b4a2b',u*0.5);TH.ell(c,x+dx*u+u*0.5,y+dy*u-u*0.1,u*0.22,u*0.25,F.endc);});
    [[-1.4,0.1],[1.4,0.1],[0,-0.7]].forEach(([dx,dy])=>TH.ln(c,[x+dx*u,y+dy*u+u*0.2],[x+dx*u*0.2,y-u*2.4],'#3b3f4a',u*0.09));TH.ell(c,x,y-u*1.4,u*0.45,u*0.34,'#2b2f3a');
    const g=c.createRadialGradient(x,y-u*0.6,0,x,y-u*0.6,u*2.6);g.addColorStop(0,'rgba(255,170,60,'+(0.45+0.1*Math.sin(t*9))+')');g.addColorStop(1,'rgba(255,170,60,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*0.6,u*2.6,0,7);c.fill();
    [[0,1.0,0.9],[-0.35,0.75,0.6],[0.35,0.8,0.65]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*11+i*2+v)*u*0.12;TH.poly(c,[[x+dx*u-u*0.38*w,y-u*0.05],[x+dx*u+f,y-u*(0.1+h*1.2)],[x+dx*u+u*0.38*w,y-u*0.05]],i?'#fbbf24':'#f97316');});
    for(let k=0;k<3;k++){const ph=(t*0.6+k*0.33)%1;c.fillStyle='rgba(120,120,126,'+(0.35*(1-ph))+')';c.beginPath();c.ellipse(x+Math.sin(ph*5+k)*u*0.3,y-u*(2.3+ph*2.2),u*(0.22+ph*0.45),u*(0.18+ph*0.35),0,0,7);c.fill();}}},
  canoe:{cat:'prop',w:2.5,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.7,u*1.5);const N=16,top=[];for(let k=0;k<=N;k++){const X=-2.6+5.2*k/N,q=Math.abs(X)/2.6;top.push([X,0.62*Math.pow(Math.max(0,1-q*q),0.55),0.28+0.95*Math.pow(q,3)]);}
    TH.poly(c,top.map(p=>I(p[0],-p[1],p[2])).concat(top.slice().reverse().map(p=>I(p[0],p[1],p[2]))),'#2f2012');
    TH.poly(c,top.map(p=>I(p[0],p[1],p[2])).concat(top.slice().reverse().map(p=>I(p[0],p[1]*0.35,0.03+p[2]*0.12))),'#c98f4a');
    for(let k=1;k<N;k+=2){const p=top[k];TH.ln(c,I(p[0],p[1],p[2]),I(p[0],p[1]*0.35,0.03+p[2]*0.12),'rgba(90,50,20,.35)',u*0.05);}
    c.strokeStyle='#7a4d2b';c.lineWidth=u*0.12;c.lineJoin='round';c.beginPath();top.forEach((p,i)=>{const q=I(p[0],p[1],p[2]);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.stroke();
    [-0.8,0.9].forEach(X=>TH.ln(c,I(X,-0.55,0.5),I(X,0.55,0.5),'#8a5a33',u*0.12));TH.ln(c,I(1.5,1.3,0),I(1.9,1.0,2.4),F.woodL,u*0.1);TH.ell(c,...I(1.95,0.98,2.7),u*0.14,u*0.3,F.woodL,-0.3);}},
  fishRack:{cat:'prop',w:2.2,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+4);fsh(c,x,y,u*2.3,u*3);[-1.9,1.9].forEach(X=>{TH.ln(c,I(X,-0.7,0),I(X,0,2.6),F.bark,u*0.18);TH.ln(c,I(X,0.7,0),I(X,0,2.6),F.bark,u*0.18);});
    TH.ln(c,I(-2.1,0,2.5),I(2.1,0,2.5),F.woodD,u*0.16);TH.ln(c,I(-1.9,0,1.5),I(1.9,0,1.5),F.woodD,u*0.12);
    for(let k=0;k<10;k++){const X=-1.7+k*0.38,L=0.5+r()*0.5,top=I(X,0,2.5),bot=[top[0],top[1]+u*L*1.2];TH.ln(c,top,bot,'#c9b98a',u*0.04);TH.ell(c,bot[0],bot[1]+u*0.28,u*0.12,u*0.34,'#b8c4cc');TH.poly(c,[[bot[0]-u*0.1,bot[1]+u*0.55],[bot[0]+u*0.1,bot[1]+u*0.55],[bot[0],bot[1]+u*0.4]],'#98a4ac');TH.ell(c,bot[0]+u*0.02,bot[1]+u*0.16,u*0.025,u*0.025,'#222');}
    for(let k=0;k<5;k++){const p=I(-1.5+k*0.75,0,1.5);TH.poly(c,[[p[0]-u*0.12,p[1]],[p[0]+u*0.12,p[1]],[p[0]+u*0.08,p[1]+u*0.9],[p[0]-u*0.08,p[1]+u*0.9]],'#b86a4a');}}},
  firewood:{cat:'prop',w:1.7,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+5);fsh(c,x,y,u*1.8,u*1.6);[-1.5,1.5].forEach(X=>TH.ln(c,I(X,0.5,0),I(X,0.5,1.6),F.woodD,u*0.18));
    TH.box(c,x,y,u,-1.4,1.4,-0.5,0.5,0,1.5,'#9a6a3c','#6f4a28','#b8884f');for(let row=0;row<4;row++)for(let col=0;col<7;col++){const p=I(-1.2+col*0.4+(row%2)*0.2,0.51,0.18+row*0.36);TH.ell(c,p[0],p[1],u*0.17,u*0.16,F.endc);TH.ell(c,p[0],p[1],u*0.07,u*0.06,'#a8783f');}
    TH.poly(c,[I(-1.6,0.8,1.5),I(1.6,0.8,1.5),I(1.6,-0.6,1.7),I(-1.6,-0.6,1.7)],'#5a3b22');TH.ell(c,x+u*2.0,y+u*0.3,u*0.35,u*0.28,F.endc);TH.ln(c,[x+u*2.0,y+u*0.3],[x+u*2.5,y-u*0.4],F.woodL,u*0.14);TH.poly(c,[[x+u*2.35,y-u*0.45],[x+u*2.75,y-u*0.55],[x+u*2.6,y-u*0.2]],'#9aa0a8');}},
  railFence:{cat:'prop',w:2.6,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.7,u);for(let seg=-2;seg<=1;seg++){const sx=seg*1.25,s=seg%2?1:-1;for(let lvl=0;lvl<4;lvl++){const z=0.25+lvl*0.4,k=(lvl+seg)%2?1:-1;TH.ln(c,I(sx,0.35*k*s,z),I(sx+1.45,-0.35*k*s,z+0.03),'#8a6a45',u*0.2);TH.ell(c,...I(sx+1.45,-0.35*k*s,z+0.03),u*0.1,u*0.1,'#c9a56a');}}
    if(v%2)TH.ln(c,I(1.8,0,0.2),I(2.6,0.5,0.9),'#8a6a45',u*0.2);}},
  footbridge:{cat:'prop',w:2.4,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.poly(c,[I(-1.6,-3.0,0),I(1.6,-3.0,0),I(1.6,3.0,0),I(-1.6,3.0,0)],'#6b5a3a');TH.poly(c,[I(-1.2,-3.0,0.02),I(1.2,-3.0,0.02),I(1.2,3.0,0.02),I(-1.2,3.0,0.02)],F.waterD);TH.poly(c,[I(-0.9,-3.0,0.04),I(0.9,-3.0,0.04),I(0.9,3.0,0.04),I(-0.9,3.0,0.04)],F.water);
    fsh(c,x,y,u*2.2,u*1.5);const deck=Y=>{const z=0.55+0.35*(1-Math.pow(Y/2.6,2));return z;};[-2.6,2.6].forEach(Y=>TH.ln(c,I(-0.7,Y,0),I(-0.7,Y,0.65),F.woodD,u*0.3));
    const pts=[];for(let k=0;k<=12;k++){const Y=-2.6+5.2*k/12;pts.push([Y,deck(Y)]);}TH.poly(c,pts.map(p=>I(-0.75,p[0],p[1])).concat(pts.slice().reverse().map(p=>I(0.75,p[0],p[1]))),'#a97d49');for(let k=1;k<12;k++){TH.ln(c,I(-0.75,pts[k][0],pts[k][1]),I(0.75,pts[k][0],pts[k][1]),'rgba(60,35,10,.4)',u*0.05);}
    [-0.8,0.8].forEach(X=>{c.strokeStyle=F.woodD;c.lineWidth=u*0.12;c.beginPath();pts.forEach((p,i)=>{const q=I(X,p[0],p[1]+0.8);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.stroke();for(let k=0;k<=12;k+=3)TH.ln(c,I(X,pts[k][0],pts[k][1]),I(X,pts[k][0],pts[k][1]+0.8),F.woodD,u*0.1);});}},
  trapperTent:{cat:'prop',w:2.4,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.5,u*3);TH.poly(c,[I(2.2,-1.5,0),I(2.2,1.5,0),I(2.2,0,2.6)],'#d6c7a4');TH.poly(c,[I(2.2,-0.6,0),I(2.2,0.6,0),I(2.2,0.05,1.7)],'#241c14');TH.poly(c,[I(2.2,-0.6,0),I(2.2,0.05,1.7),I(2.2,-0.2,0.0)],'#f0e6c8');
    TH.poly(c,[I(-2.2,1.5,0),I(2.2,1.5,0),I(2.2,0,2.6),I(-2.2,0,2.6)],F.canvas);TH.poly(c,[I(-2.2,0.4,0.9),I(2.2,0.4,0.9),I(2.2,0,2.6),I(-2.2,0,2.6)],'rgba(140,110,60,.18)');for(let k=1;k<5;k++)TH.ln(c,I(-2.2+k*0.9,1.5,0),I(-2.2+k*0.9,0,2.6),'rgba(110,85,50,.35)',u*0.04);TH.ln(c,I(-2.2,0,2.6),I(2.2,0,2.6),F.woodD,u*0.18);
    [-2.6,2.6].forEach(X=>TH.ln(c,I(X,0,2.8),I(X,0,0),F.bark,u*0.14));[[-2.6,2.2],[2.6,2.2],[-1,2.2]].forEach(([X,Y])=>{TH.ln(c,I(X*0.8,1.2,1.0),I(X,Y,0),'rgba(230,220,190,.7)',u*0.04);TH.ln(c,I(X,Y,0),I(X,Y,0.3),F.woodD,u*0.1);});
    TH.ell(c,...I(1.0,2.0,0.3),u*0.3,u*0.2,'#7a5a3a');TH.ell(c,...I(1.0,2.0,0.55),u*0.2,u*0.14,'#e0d6b8');TH.ln(c,I(2.8,1.6,0),I(2.8,1.6,1.5),F.bark,u*0.12);TH.ell(c,...I(2.8,1.6,1.6),u*0.18,u*0.22,'#fbbf24');}},
  bear:{cat:'prop',w:1.7,tier:2,weight:2,cost:1,max:1,draw(c,x,y,u,v,tm){const dk='#4a2f1e',md='#6b4630',lt='#8a6a4a';fsh(c,x,y,u*1.9,u*2.2);[[-0.6,-0.1],[1.1,-0.05]].forEach(([dx,dy])=>{TH.poly(c,[[x+dx*u-u*0.3,y-u*0.9],[x+dx*u+u*0.3,y-u*0.9],[x+dx*u+u*0.26,y+dy*u],[x+dx*u-u*0.26,y+dy*u]],'#3b2516');});
    TH.ell(c,x,y-u*1.4,u*1.75,u*0.95,md);TH.ell(c,x-u*0.55,y-u*1.95,u*0.85,u*0.6,md);TH.ell(c,x+u*0.1,y-u*1.0,u*1.4,u*0.5,'rgba(0,0,0,.2)');
    [[-1.0,0.3],[0.8,0.35]].forEach(([dx,dy])=>{TH.poly(c,[[x+dx*u-u*0.34,y-u*0.95],[x+dx*u+u*0.34,y-u*0.95],[x+dx*u+u*0.3,y+dy*u],[x+dx*u-u*0.3,y+dy*u]],dk);TH.ell(c,x+dx*u,y+dy*u,u*0.42,u*0.14,'#2f2015');for(let k=-1;k<=1;k++)TH.ln(c,[x+dx*u+k*u*0.15+u*0.2,y+dy*u+u*0.05],[x+dx*u+k*u*0.15+u*0.32,y+dy*u+u*0.1],'#e8e0cc',u*0.04);});
    const hy=y-u*1.55+Math.sin((tm||0)*1.2+v)*u*0.05;TH.ell(c,x+u*1.65,hy,u*0.62,u*0.56,md);TH.ell(c,x+u*2.1,hy+u*0.15,u*0.4,u*0.3,lt);TH.ell(c,x+u*2.38,hy+u*0.06,u*0.12,u*0.1,'#1a1410');TH.ell(c,x+u*1.4,hy-u*0.5,u*0.17,u*0.17,md);TH.ell(c,x+u*1.85,hy-u*0.42,u*0.15,u*0.15,dk);TH.ell(c,x+u*1.85,hy-u*0.1,u*0.06,u*0.06,'#111');
    if(v%2){TH.ell(c,x+u*2.35,hy+u*0.42,u*0.55,u*0.12,'#e0746a',-0.35);TH.poly(c,[[x+u*2.8,hy+u*0.3],[x+u*3.0,hy+u*0.1],[x+u*3.0,hy+u*0.5]],'#c9564a');}}},
  deer:{cat:'prop',w:1.5,tier:1,weight:2.5,cost:1,max:1,draw(c,x,y,u,v,tm){const tn='#b88a56',dk='#8a6238';fsh(c,x,y,u*1.7,u*2.5);[[-0.8,0.05],[0.9,0.05]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u+u*0.15,y-u*1.4],[x+dx*u+u*0.1,y+dy*u],dk,u*0.16);});
    TH.ell(c,x,y-u*1.65,u*1.25,u*0.55,tn);TH.ell(c,x-u*0.2,y-u*1.4,u*0.9,u*0.25,'#e6d6b4');[[-0.95,0.05],[0.65,0.1]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u,y-u*1.4],[x+dx*u-u*0.04,y+dy*u],tn,u*0.18);TH.ell(c,x+dx*u-u*0.04,y+dy*u,u*0.14,u*0.07,'#2b1f14');});
    TH.ln(c,[x+u*1.0,y-u*1.8],[x+u*1.5,y-u*3.0],tn,u*0.4);const hy=y-u*3.15+Math.sin((tm||0)*1.5+v)*u*0.04;TH.ell(c,x+u*1.65,hy,u*0.38,u*0.3,tn,0.3);TH.ell(c,x+u*2.0,hy+u*0.1,u*0.2,u*0.14,'#d9c4a0');TH.ell(c,x+u*2.15,hy+u*0.08,u*0.06,u*0.05,'#111');TH.ell(c,x+u*1.62,hy-u*0.35,u*0.1,u*0.2,tn,-0.3);
    c.strokeStyle='#6b4a2b';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x+u*1.6,hy-u*0.25);c.lineTo(x+u*1.3,hy-u*0.85);c.moveTo(x+u*1.45,hy-u*0.55);c.lineTo(x+u*1.1,hy-u*0.55);c.moveTo(x+u*1.35,hy-u*0.75);c.lineTo(x+u*1.65,hy-u*1.1);c.stroke();TH.poly(c,[[x-u*1.25,y-u*1.8],[x-u*1.6,y-u*1.95],[x-u*1.3,y-u*1.55]],'#f1ece0');}},
  beaverDam:{cat:'prop',w:2.4,tier:2,weight:2,cost:1,max:1,draw(c,x,y,u,v,tm){const r=mulberry(v+3),t=tm||0;TH.ell(c,x,y,u*2.6,u*1.1,'#6b5a3a');TH.ell(c,x,y,u*2.4,u*0.98,F.waterD);TH.ell(c,x-u*0.2,y-u*0.05,u*1.9,u*0.74,F.water);c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=u*0.05;const ph=(t*0.35)%1;c.beginPath();c.ellipse(x-u*1.0,y+u*0.2,u*(0.2+ph*0.6),u*(0.1+ph*0.26),0,0,7);c.stroke();
    for(let k=0;k<22;k++){const px=x+u*(1.0+(r()-0.5)*0.4)+k*0.0,py=y+u*(-0.9+k*0.085),L=u*(0.9+r()*0.6);TH.ln(c,[px-L*0.5,py+(r()-0.5)*u*0.1],[px+L*0.5,py+(r()-0.5)*u*0.1-u*0.05],['#6b4a2b','#8a6238','#5a3b22'][k%3],u*0.14);}
    c.beginPath();c.moveTo(x-u*1.9,y-u*0.1);c.quadraticCurveTo(x-u*1.6,y-u*2.2,x-u*0.5,y-u*2.0);c.quadraticCurveTo(x+u*0.3,y-u*1.4,x+u*0.4,y-u*0.1);c.closePath();c.fillStyle='#7a5a38';c.fill();
    for(let k=0;k<26;k++){const a=r()*6.283,rr=Math.sqrt(r());const px=x-u*0.75+Math.cos(a)*u*1.0*rr,py=y-u*0.9+Math.sin(a)*u*0.75*rr;TH.ln(c,[px,py],[px+(r()-0.5)*u*0.9,py+(r()-0.5)*u*0.4],['#5a3b22','#9a7a4a','#6b4a2b'][k%3],u*0.07);}
    TH.ell(c,x-u*0.7,y+u*0.35,u*0.25,u*0.14,'#4a3320');TH.ell(c,x-u*0.45,y+u*0.34,u*0.1,u*0.09,'#4a3320');TH.ell(c,x-u*1.0,y+u*0.42,u*0.2,u*0.07,'#3a2a1a');}},
  logCabin:{cat:'structure',w:2.8,tier:3,weight:3,cost:2,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0;fsh(c,x,y,u*3.2,u*4);
    TH.box(c,x,y,u,-2.2,2.2,-1.6,1.6,0,2.3,'#8a5a33','#6f4524','#a97d49');logWall(c,x,y,u,-2.2,2.2,1.61,0,2.3);logWallE(c,x,y,u,2.21,-1.6,1.6,0,2.3);logEnds(c,x,y,u,-2.2,1.61,0,2.3);logEnds(c,x,y,u,2.2,1.61,0,2.3);
    TH.poly(c,[I(-0.45,1.64,0),I(0.45,1.64,0),I(0.45,1.64,1.6),I(-0.45,1.64,1.6)],'#4a2f1c','#2b1b0e',u*0.05);TH.ell(c,...I(0.3,1.65,0.8),u*0.05,u*0.05,'#e0b53a');
    TH.poly(c,[I(1.0,1.64,0.9),I(1.8,1.64,0.9),I(1.8,1.64,1.7),I(1.0,1.64,1.7)],'#9bd0e8','#4a2f1c',u*0.07);TH.ln(c,I(1.4,1.65,0.9),I(1.4,1.65,1.7),'#4a2f1c',u*0.05);[[0.78,1.0],[2.02,1.8]].forEach(([X,x2])=>TH.poly(c,[I(X,1.65,0.9),I(X+(X<1?0.22:-0.22),1.65,0.9),I(X+(X<1?0.22:-0.22),1.65,1.7),I(X,1.65,1.7)],'#5a3b22'));
    TH.poly(c,[I(2.2,-1.6,2.3),I(2.2,1.6,2.3),I(2.2,0,3.9)],'#7a4d2b');for(let k=0;k<5;k++)TH.ln(c,I(2.21,-1.5+k*0.75,2.3),I(2.21,-0.7+k*0.4+(k%2)*0.0,3.4),'rgba(40,24,10,.0)',1);
    TH.poly(c,[I(-2.7,2.0,2.2),I(2.7,2.0,2.2),I(2.7,0,4.0),I(-2.7,0,4.0)],'#7a5a3a');for(let k=1;k<7;k++){TH.ln(c,I(-2.7,2.0-k*0.285,2.2+k*0.257),I(2.7,2.0-k*0.285,2.2+k*0.257),'rgba(40,24,10,.45)',u*0.06);}TH.ln(c,I(-2.7,2.0,2.2),I(2.7,2.0,2.2),'#4a3320',u*0.14);TH.ln(c,I(-2.7,0,4.0),I(2.7,0,4.0),'#9a7a4a',u*0.14);
    TH.box(c,x,y,u,-1.7,-1.0,-1.1,-0.5,2.0,4.8,'#9aa0a8','#6f747c','#c3c8cf');for(let k=0;k<4;k++){const ph=(t*0.5+k*0.25)%1,tp=I(-1.35,-0.8,4.8);c.fillStyle='rgba(200,200,205,'+(0.5*(1-ph))+')';c.beginPath();c.ellipse(tp[0]+Math.sin(ph*4+k)*u*0.3+ph*u*0.6,tp[1]-ph*u*3.0-u*0.2,u*(0.25+ph*0.5),u*(0.2+ph*0.4),0,0,7);c.fill();}
    TH.box(c,x,y,u,-2.0,2.0,1.7,2.5,0,0.2,'#a97d49','#7d5a34','#c49858');[-1.9,1.9].forEach(X=>TH.ln(c,I(X,2.4,0.2),I(X,2.4,2.1),F.bark,u*0.18));}},
  /* ---------- landmarks ---------- */
  lookoutTower:{cat:'landmark',w:2.3,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.4,u*9);const H=9.0;
    const legs=[[-1.9,-1.4],[1.9,-1.4],[-1.9,1.4],[1.9,1.4]],top=(X,Y)=>[X*0.55,Y*0.55];legs.slice(0,2).forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(top(X,Y)[0],top(X,Y)[1],H),F.woodD,u*0.3));
    for(let k=1;k<5;k++){const f=k/5,z=H*f,s=1-0.45*f;TH.ln(c,I(-1.9*s,1.4*s,z),I(1.9*s,1.4*s,z),F.woodD,u*0.14);TH.ln(c,I(1.9*s,-1.4*s,z),I(1.9*s,1.4*s,z),F.woodD,u*0.14);}
    for(let k=0;k<4;k++){const f0=k/5,f1=(k+1)/5,s0=1-0.45*f0,s1=1-0.45*f1;TH.ln(c,I(-1.9*s0,1.4*s0,H*f0),I(1.9*s1,1.4*s1,H*f1),F.wood,u*0.1);TH.ln(c,I(1.9*s0,1.4*s0,H*f0),I(-1.9*s1,1.4*s1,H*f1),F.wood,u*0.1);}
    legs.slice(2).forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(top(X,Y)[0],top(X,Y)[1],H),F.wood,u*0.34));
    for(let k=0;k<7;k++){const f=k/7;TH.ln(c,I(-1.2+f*0.2,1.5,H*f),I(-0.6+f*0.2,1.5,H*(f+0.15)),'#c9a56a',u*0.08);}
    const cs=1.5;TH.box(c,x,y,u,-cs-0.3,cs+0.3,-cs-0.3,cs+0.3,H,H+0.25,'#a97d49','#7d5a34','#c49858');TH.box(c,x,y,u,-cs,cs,-cs,cs,H+0.25,H+1.8,'#b88a56','#8a6238','#d6a86a');
    [[-1.1,-0.2],[0.2,1.1]].forEach(([a,b])=>TH.poly(c,[I(a,cs+0.01,H+0.7),I(b,cs+0.01,H+0.7),I(b,cs+0.01,H+1.5),I(a,cs+0.01,H+1.5)],'#9bd0e8','#4a2f1c',u*0.05));TH.poly(c,[I(cs+0.01,-1.1,H+0.7),I(cs+0.01,1.1,H+0.7),I(cs+0.01,1.1,H+1.5),I(cs+0.01,-1.1,H+1.5)],'#9bd0e8','#4a2f1c',u*0.05);
    const ap=I(0,0,H+3.3);TH.poly(c,[I(-cs-0.4,cs+0.4,H+1.8),I(cs+0.4,cs+0.4,H+1.8),ap],'#5a3b22');TH.poly(c,[I(cs+0.4,-cs-0.4,H+1.8),I(cs+0.4,cs+0.4,H+1.8),ap],'#3f2815');TH.ln(c,ap,[ap[0],ap[1]-u*1.0],'#d5dae6',u*0.08);
    TH.poly(c,[[ap[0],ap[1]-u*1.0],[ap[0]+u*1.1,ap[1]-u*0.8+Math.sin((tm||0)*3)*u*0.1],[ap[0],ap[1]-u*0.5]],'#d9342b');}},
  waterfallCliff:{cat:'landmark',w:3.2,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const r=mulberry(v+4),t=tm||0,H=u*6.0,wt=u*2.7,wb=u*3.4;fsh(c,x,y,u*3.4,u*7);
    fcrag(c,x,y,u,{wt:wt,wb:wb,H:H,seed:v+2,bands:['#8a8f96','#7a7f87','#9a9fa6','#6f747c','#858a92','#7a7f87'],top:'#6f8a5a'});
    const fx=x-u*0.3,top=y-H+wt*0.42*0.9,bot=y+wb*0.42*0.9;c.save();c.beginPath();c.moveTo(fx-u*0.55,top);c.lineTo(fx+u*0.55,top);c.lineTo(fx+u*0.8,bot);c.lineTo(fx-u*0.8,bot);c.closePath();const g=c.createLinearGradient(fx,top,fx,bot);g.addColorStop(0,'#eaf6ff');g.addColorStop(1,'#bfe3f5');c.fillStyle=g;c.fill();c.clip();
    for(let k=0;k<7;k++){const ph=(t*1.4+k*0.31)%1;c.strokeStyle='rgba(255,255,255,'+(0.35+0.3*(1-ph))+')';c.lineWidth=u*0.06;const sx=fx-u*0.45+k*u*0.15;c.beginPath();c.moveTo(sx,top+(bot-top)*ph*0.7);c.lineTo(sx+(k-3)*u*0.02,top+(bot-top)*(ph*0.7+0.3));c.stroke();}c.restore();
    TH.ell(c,fx,bot+u*0.35,u*2.2,u*0.8,'#2f7fa8');TH.ell(c,fx,bot+u*0.3,u*1.9,u*0.66,'#4aa0c8');for(let k=0;k<7;k++){const ph=(t*0.9+k*0.2)%1;c.fillStyle='rgba(255,255,255,'+(0.55*(1-ph))+')';c.beginPath();c.ellipse(fx+(r()-0.5)*u*1.4,bot+u*0.2+ph*u*0.2,u*(0.3+ph*0.4),u*(0.14+ph*0.18),0,0,7);c.fill();}
    for(let k=0;k<4;k++){const ph=(t*0.5+k*0.25)%1;c.fillStyle='rgba(235,245,250,'+(0.3*(1-ph))+')';c.beginPath();c.ellipse(fx+(k-1.5)*u*0.5,bot-ph*u*1.6,u*(0.5+ph*0.6),u*(0.3+ph*0.4),0,0,7);c.fill();}
    [[-1.5,0.1],[0.6,-0.1],[1.4,0.2]].forEach(([dx,dy],i)=>frFir(c,x+dx*u,y-H+dy*u+wt*0.1,u*0.55,0.7+i*0.05,v+i));for(let k=0;k<5;k++)TH.blob(c,x+(r()-0.5)*wb*2.1,y+wb*0.25+r()*u*0.5,u*(0.35+r()*0.3),u*0.2,'#6f747c',r,7);}},
  mountainPeak:{cat:'landmark',w:4.0,tier:3,weight:3,cost:4,draw(c,x,y,u,v){const r=mulberry(v+6);fsh(c,x,y,u*4.2,u*10);const peak=(px,base,hw,H,snowF)=>{const ap=[px,base-H],L=[px-hw,base],Rr=[px+hw,base],M=[px+hw*0.08,base+hw*0.16];
      TH.poly(c,[L,ap,M],'#8e949c');TH.poly(c,[M,ap,Rr],'#575d68');c.strokeStyle='rgba(25,32,44,.35)';c.lineWidth=u*0.07;c.beginPath();c.moveTo(ap[0],ap[1]);c.lineTo(px-hw*0.4,base-H*0.3);c.moveTo(ap[0],ap[1]);c.lineTo(px+hw*0.25,base-H*0.15);c.moveTo(px-hw*0.25,base-H*0.62);c.lineTo(px-hw*0.55,base-H*0.4);c.stroke();
      const sy=base-H*(1-snowF);const sw=(f)=>hw*(1-f);TH.poly(c,[ap,[px-hw*snowF*1.0,sy],[px-hw*snowF*0.6,sy+H*0.07],[px-hw*snowF*0.3,sy-H*0.02],[px+hw*0.05,sy+H*0.09],[px+hw*snowF*0.4,sy+H*0.02],[px+hw*snowF*0.8,sy+H*0.08],[px+hw*snowF*1.0,sy]],'#f4f8fc');
      TH.poly(c,[ap,[px+hw*0.08,sy+H*0.09],[px+hw*snowF*0.4,sy+H*0.02],[px+hw*snowF*0.8,sy+H*0.08],[px+hw*snowF*1.0,sy]],'#c9d6e4');};
    peak(x+u*3.0,y,u*3.0,u*6.5,0.4);peak(x-u*0.5,y,u*4.6,u*10,0.38);
    TH.ell(c,x,y,u*5.2,u*1.6,'#566e42');[[-4.2,0.5,1.5],[3.8,0.6,1.3],[-2.0,0.9,1.0],[1.6,1.0,1.1]].forEach(([dx,dy,s])=>TH.blob(c,x+dx*u,y+dy*u,u*s*1.4,u*s*0.6,'#4a6e48',r,8));[[-3.4,0.8],[-2.6,1.1],[2.7,0.9],[3.5,0.7],[0.4,1.2]].forEach(([dx,dy],i)=>frFir(c,x+dx*u,y+dy*u,u*0.5,0.8+(i%2)*0.15,v+i));}},
  sawmill:{cat:'landmark',w:3.7,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0,r=mulberry(v+3);fsh(c,x,y,u*3.8,u*6);
    TH.poly(c,[I(2.4,-2.6,0.12),I(5.2,-2.6,0.12),I(5.2,2.4,0.12),I(2.4,2.4,0.12)],'#3f7a9a');TH.poly(c,[I(2.7,-2.4,0.14),I(5.0,-2.4,0.14),I(5.0,2.2,0.14),I(2.7,2.2,0.14)],'#4aa0c8');
    TH.box(c,x,y,u,-3.0,2.4,-2.0,2.0,0,3.0,'#9a6a3c','#6f4a28','#b07a46');logWall(c,x,y,u,-3.0,2.4,2.01,0,3.0);logWallE(c,x,y,u,2.41,-2.0,2.0,0,3.0);
    TH.poly(c,[I(-2.2,2.03,0),I(0.2,2.03,0),I(0.2,2.03,2.2),I(-2.2,2.03,2.2)],'#1c130c');for(let k=0;k<3;k++)TH.ln(c,I(-2.0+k*0.9,2.04,0.4),I(-1.8+k*0.9,2.04,2.0),'rgba(200,200,205,.2)',u*0.05);
    TH.ln(c,I(-2.2,2.2,0.4),I(0.2,2.2,0.4),'#5a5f68',u*0.12);TH.box(c,x,y,u,-1.8,-0.2,2.1,2.6,0.4,0.8,'#7a7f87','#555a62','#9aa0a8');TH.ell(c,...I(-1.0,2.3,1.3),u*0.65,u*0.7,'#c9ced6');TH.ell(c,...I(-1.0,2.3,1.3),u*0.12,u*0.12,'#555a62');
    TH.poly(c,[I(-3.4,2.4,2.9),I(2.8,2.4,2.9),I(2.8,0,5.0),I(-3.4,0,5.0)],'#6b4a2b');for(let k=1;k<6;k++)TH.ln(c,I(-3.4,2.4-k*0.4,2.9+k*0.35),I(2.8,2.4-k*0.4,2.9+k*0.35),'rgba(30,18,6,.45)',u*0.06);TH.poly(c,[I(2.4,-2.0,3.0),I(2.4,2.0,3.0),I(2.4,0,4.9)],'#8a5a33');
    const wc=[2.9,0,2.6],R0=2.3,a0=t*0.8;const pt=(a,rr)=>I(wc[0],rr*Math.cos(a),wc[2]+rr*Math.sin(a));c.strokeStyle='#4a3320';c.lineWidth=u*0.3;c.beginPath();for(let k=0;k<=32;k++){const p=pt(k/32*6.283,R0);k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();c.strokeStyle='#8a5a33';c.lineWidth=u*0.16;c.stroke();
    for(let k=0;k<8;k++){const a=a0+k*0.7854;TH.ln(c,pt(a,0),pt(a,R0),'#6b4a2b',u*0.16);const p=pt(a,R0),q=pt(a+0.22,R0+0.45);TH.poly(c,[p,q,pt(a+0.46,R0)],'#a97d49','#4a3320',u*0.04);}TH.ell(c,...pt(0,0),u*0.28,u*0.28,'#2b1b0e');
    for(let k=0;k<3;k++){const ph=(t*0.7+k*0.33)%1;TH.ln(c,I(3.9+ph*0.6,-2.3+ph*0.4,5.2-ph*3.3),I(4.3+ph*0.6,-2.0+ph*0.4,5.0-ph*3.3),'rgba(235,248,255,.6)',u*0.1);}TH.poly(c,[I(3.5,-2.6,5.2),I(4.6,-2.6,5.2),I(4.6,-1.6,3.4),I(3.5,-1.6,3.4)],'rgba(160,110,60,.5)');
    for(let row=0;row<3;row++)for(let col=0;col<4-row;col++)TH.ln(c,I(-3.4+col*0.62+row*0.3,3.0-row*0.1,0.3+row*0.5),I(-1.9+col*0.62+row*0.3,3.0-row*0.1,0.3+row*0.5),['#9a6a3c','#8a5a33'][(row+col)%2],u*0.46);}},
  stockadeFort:{cat:'landmark',w:4.5,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0,S=3.6,wh=3.4;fsh(c,x,y,u*4.8,u*6);TH.poly(c,[I(-S,-S,0.03),I(S,-S,0.03),I(S,S,0.03),I(-S,S,0.03)],'#a98b62');
    const wallY=(Y,x0,x1,col)=>{for(let X=x0;X<=x1;X+=0.36){const b=I(X,Y,0),tp=I(X,Y,wh);TH.ln(c,b,tp,col,u*0.3);TH.poly(c,[[tp[0]-u*0.17,tp[1]],[tp[0]+u*0.17,tp[1]],[tp[0],tp[1]-u*0.45]],col);}};
    const wallX=(X,y0,y1,col)=>{for(let Y=y0;Y<=y1;Y+=0.36){const b=I(X,Y,0),tp=I(X,Y,wh);TH.ln(c,b,tp,col,u*0.3);TH.poly(c,[[tp[0]-u*0.17,tp[1]],[tp[0]+u*0.17,tp[1]],[tp[0],tp[1]-u*0.45]],col);}};
    const tower=(X,Y,col)=>{TH.box(c,x,y,u,X-0.8,X+0.8,Y-0.8,Y+0.8,0,4.6,'#9a6a3c','#6f4a28','#b07a46');logWall(c,x,y,u,X-0.8,X+0.8,Y+0.81,0,4.6);logWallE(c,x,y,u,X+0.81,Y-0.8,Y+0.8,0,4.6);TH.box(c,x,y,u,X-1.0,X+1.0,Y-1.0,Y+1.0,4.6,4.9,'#a97d49','#7d5a34','#c49858');const ap=I(X,Y,6.4);TH.poly(c,[I(X-1.1,Y+1.1,4.9),I(X+1.1,Y+1.1,4.9),ap],'#5a3b22');TH.poly(c,[I(X+1.1,Y-1.1,4.9),I(X+1.1,Y+1.1,4.9),ap],'#3f2815');TH.poly(c,[I(X-0.3,Y+0.82,3.4),I(X+0.3,Y+0.82,3.4),I(X+0.3,Y+0.82,4.2),I(X-0.3,Y+0.82,4.2)],'#161a22');};
    wallY(-S,-S,S,'#7d5a34');wallX(-S,-S,S,'#6f4a28');tower(-S,-S);
    TH.box(c,x,y,u,-2.3,-0.6,-2.2,-0.6,0,1.7,'#9a6a3c','#6f4a28','#b07a46');TH.poly(c,[I(-2.5,-0.4,1.6),I(-0.4,-0.4,1.6),I(-0.4,-1.4,2.8),I(-2.5,-1.4,2.8)],'#5a3b22');TH.poly(c,[I(-0.4,-2.4,1.6),I(-0.4,-0.4,1.6),I(-0.4,-1.4,2.8)],'#7a5a3a');
    TH.box(c,x,y,u,0.6,2.2,-2.3,-0.9,0,1.5,'#9a6a3c','#6f4a28','#b07a46');TH.poly(c,[I(0.4,-0.7,1.4),I(2.4,-0.7,1.4),I(2.4,-1.6,2.5),I(0.4,-1.6,2.5)],'#6b4a2b');
    const fp=I(0.6,0.2,0);TH.ln(c,fp,[fp[0],fp[1]-u*6.2],'#d5dae6',u*0.1);const wv=Math.sin(t*3)*u*0.12;TH.poly(c,[[fp[0],fp[1]-u*6.2],[fp[0]+u*1.6,fp[1]-u*6.0+wv],[fp[0]+u*1.2,fp[1]-u*5.6+wv*1.3],[fp[0]+u*1.6,fp[1]-u*5.2+wv],[fp[0],fp[1]-u*5.3]],'#2f4f8f');
    tower(S,-S);wallX(S,-S,S,'#7d5a34');tower(-S,S);
    wallY(S,-S,-1.0,'#8a6238');wallY(S,1.0,S,'#8a6238');TH.poly(c,[I(-1.0,S+0.01,0),I(1.0,S+0.01,0),I(1.0,S+0.01,2.8),I(-1.0,S+0.01,2.8)],'#140f0a');[-1,1].forEach(s=>{TH.poly(c,[I(s*1.0,S+0.02,0),I(s*0.45,S+0.5,0),I(s*0.45,S+0.5,2.7),I(s*1.0,S+0.02,2.7)],'#6b4a2b','#3b2616',u*0.05);});TH.ln(c,I(-1.0,S+0.05,2.9),I(1.0,S+0.05,2.9),F.woodD,u*0.3);
    tower(S,S);const f1=I(S,S,6.4);TH.ln(c,f1,[f1[0],f1[1]-u*1.2],'#d5dae6',u*0.08);TH.poly(c,[[f1[0],f1[1]-u*1.2],[f1[0]+u*1.1,f1[1]-u*1.0+Math.sin(t*3+1)*u*0.1],[f1[0],f1[1]-u*0.7]],'#b3342f');}}
  }};
const FRONTIER_HEIGHT={berryBush:'low',fernPatch:'low',cattails:'low',fallenLog:'low',boulders:'low',campfire:'low',canoe:'low',fishRack:'low',firewood:'low',railFence:'low',footbridge:'low',beaverDam:'low',deer:'low',
  pineTree:'mid',firGrove:'mid',aspenTree:'mid',trapperTent:'mid',bear:'mid',logCabin:'mid',lookoutTower:'tall',waterfallCliff:'tall',mountainPeak:'tall',sawmill:'tall',stockadeFort:'tall'};
Object.keys(FRONTIER_PACK.assets).forEach(id=>{FRONTIER_PACK.assets[id].h=FRONTIER_HEIGHT[id]||'low';});
/* ===== JUNGLE PACK ===== */
const J={st:'#bdb9a0',stD:'#8e8a72',stL:'#dad7c3',moss:'#5f8a47',mossD:'#3f6a38',jade:'#2fbf9a',ochre:'#b5532f',turq:'#1fb5a8',dark:'#10161a',clay:'#c4683a'};
const jbox=(c,x,y,u,x0,x1,y0,y1,z0,z1,k)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,k?shade(J.st,k):J.st,k?shade(J.stD,k):J.stD,k?shade(J.stL,k):J.stL);
const jsh=(c,x,y,rx,h)=>{c.fillStyle='rgba(8,26,10,.36)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
const jmoss=(c,x,y,u,r,n)=>{for(let k=0;k<(n||3);k++)TH.ell(c,x+(r()-0.5)*u*1.6,y-r()*u*0.3,u*(0.22+r()*0.25),u*0.11,k%2?'rgba(95,138,71,.85)':'rgba(63,106,56,.85)');};
const jglow=(c,x,y,r,rgb,a)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba('+rgb+','+a+')');g.addColorStop(1,'rgba('+rgb+',0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();};
const glyphs=(c,x,y,u,X0,X1,Y,Z0,Z1,r)=>{for(let z=Z0;z<Z1-0.2;z+=0.42)for(let X=X0;X<X1-0.2;X+=0.5){if(r()<0.25)continue;const a=TH.iso(x,y,u,X+0.05,Y,z),b=TH.iso(x,y,u,X+0.05+0.12+r()*0.2,Y,z+(r()<0.5?0:0.12));TH.ln(c,a,b,'rgba(40,38,26,.45)',u*0.07);TH.ln(c,a,TH.iso(x,y,u,X+0.05,Y,z+0.2),'rgba(40,38,26,.4)',u*0.06);}};
const jmask=(c,x,y,u,X,Y,Z,s)=>{const I=(a,b)=>TH.iso(x,y,u,X+a*s,Y,Z+b*s);TH.poly(c,[I(-0.6,-0.6),I(0.6,-0.6),I(0.6,0.6),I(-0.6,0.6)],'rgba(60,56,40,.3)');[-0.3,0.3].forEach(e=>TH.poly(c,[I(e-0.12,0.15),I(e+0.12,0.15),I(e+0.12,0.35),I(e-0.12,0.35)],'rgba(30,30,22,.7)'));TH.ln(c,I(0,0.1),I(0,-0.15),'rgba(30,30,22,.6)',u*0.08);TH.ln(c,I(-0.3,-0.35),I(0.3,-0.35),'rgba(30,30,22,.7)',u*0.1);[-0.2,0.2].forEach(e=>TH.ln(c,I(e,-0.35),I(e,-0.5),'#e8e4d0',u*0.06));};
const JUNGLE_PACK={id:'jungle',name:'Jungle',ground:'#587c48',groundDark:'#456a3a',border:'#35552c',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},
         3:{budget:11,decals:4,landmark:0.75,pool:['templeShrine','corbelArch','ballCourt']},
         4:{budget:15,decals:5,landmark:1,pool:['stepPyramid','templeShrine','corbelArch','ballCourt'],second:0.45}},
  assets:{
  /* ---------- ground decals ---------- */
  leafLitter:{cat:'decal',w:2.2,tier:1,weight:4,cost:0,draw(c,x,y,u,v){const r=mulberry(v+8);TH.ell(c,x,y,u*2.1,u*0.9,'#3f5f36');for(let k=0;k<26;k++){const a=r()*6.283,rr=Math.sqrt(r());TH.ell(c,x+Math.cos(a)*u*1.9*rr,y+Math.sin(a)*u*0.8*rr,u*0.17,u*0.08,['#6a5a2e','#4e7a3a','#8a6a30','#355a2e','#7a4a2a'][k%5],r()*3);}}},
  lilyPond:{cat:'decal',w:2.2,tier:1,weight:2.5,cost:0,draw(c,x,y,u,v,tm){const r=mulberry(v+4),t=tm||0;TH.ell(c,x,y,u*2.2,u*1.0,'#3a5a3a');TH.ell(c,x,y,u*1.95,u*0.86,'#2f7f78');TH.ell(c,x-u*0.2,y-u*0.05,u*1.5,u*0.6,'#3a9a8e');
    c.strokeStyle='rgba(200,245,235,.5)';c.lineWidth=u*0.05;const ph=(t*0.4+v*0.3)%1;c.beginPath();c.ellipse(x+u*0.5,y+u*0.1,u*(0.2+ph*0.7),u*(0.1+ph*0.32),0,0,7);c.stroke();
    for(let k=0;k<5;k++){const px=x+(r()-0.5)*u*2.8,py=y+(r()-0.5)*u*0.9;TH.ell(c,px,py,u*0.36,u*0.18,'#4aa04a');TH.poly(c,[[px,py],[px+u*0.3,py-u*0.05],[px+u*0.3,py+u*0.05]],'#3a7f4a');if(k%2)TH.ell(c,px,py-u*0.05,u*0.1,u*0.07,'#f9a8d4');}}},
  mossyPaving:{cat:'decal',w:2.4,tier:2,weight:3,cost:0,draw(c,x,y,u,v){const I=(X,Y)=>TH.iso(x,y,u,X,Y,0),r=mulberry(v+2);for(let i=-2;i<=1;i++)for(let j=-1;j<=0;j++){if(r()<0.2)continue;const ox=r()*0.1,oy=r()*0.1;TH.poly(c,[I(i*1.1+ox,j*1.1+oy),I(i*1.1+1.0+ox,j*1.1+oy),I(i*1.1+1.0+ox,j*1.1+1.0+oy),I(i*1.1+ox,j*1.1+1.0+oy)],['#a9a58c','#9a967e','#b4b098'][(i+j+3)%3],'rgba(30,40,25,.5)',u*0.05);}
    for(let k=0;k<8;k++){const p=I(-2.2+r()*4.2,-1+r()*2);TH.ell(c,p[0],p[1],u*(0.2+r()*0.3),u*0.12,'rgba(70,120,55,.8)');}}},
  rootCrawl:{cat:'decal',w:2.2,tier:2,weight:2,cost:0,draw(c,x,y,u,v){const r=mulberry(v+6);for(let k=0;k<7;k++){const a=-2.8+k*0.9+(r()-0.5)*0.4,l=u*(1.2+r()*1.2);c.strokeStyle='#4a3a28';c.lineWidth=u*(0.22-k*0.012);c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+Math.cos(a)*l*0.5,y+Math.sin(a)*l*0.25-u*0.2,x+Math.cos(a)*l,y+Math.sin(a)*l*0.4);c.stroke();}
    TH.ell(c,x,y,u*0.4,u*0.22,'#3a2e20');}},
  /* ---------- jungle flora ---------- */
  fernCluster:{cat:'flora',w:1.6,tier:1,weight:4,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*5+2),t=tm||0;jsh(c,x,y,u*1.6,u*1.5);
    for(let k=0;k<9;k++){const a=-3.1+k*0.42,l=u*(1.7+r()*0.8),sw=Math.sin(t*1.3+k)*u*0.06,ex=x+Math.cos(a)*l+sw,ey=y-Math.abs(Math.sin(a))*l*0.9-u*0.2;c.strokeStyle=k%2?'#3f8f45':'#4aa14e';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(ex-x)*0.45,y-l*0.95,ex,ey);c.stroke();
      for(let q=1;q<8;q++){const f=q/8,px=x+(ex-x)*f*0.9,py=y+(ey-y)*f-Math.sin(f*3.0)*l*0.35;TH.ln(c,[px,py],[px+(f<0.9?-u*0.28:0),py+u*0.2],'#58b85a',u*0.06);TH.ln(c,[px,py],[px+u*0.28,py+u*0.2],'#58b85a',u*0.06);}}}},
  elephantEar:{cat:'flora',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v,tm){const t=tm||0;jsh(c,x,y,u*1.6,u*2.5);[[-0.9,-1.5,0.5,'#2f7f3f'],[0.8,-1.8,-0.4,'#3a8f48'],[0.0,-2.4,0.05,'#4aa356']].forEach(([dx,dy,rot,col],i)=>{const sw=Math.sin(t*1.2+i)*u*0.05;TH.ln(c,[x+dx*u*0.3,y],[x+dx*u+sw,y+dy*u*0.55],'#2a6a34',u*0.12);
      c.save();c.translate(x+dx*u+sw,y+dy*u);c.rotate(rot);c.fillStyle=col;c.beginPath();c.moveTo(0,u*0.9);c.bezierCurveTo(-u*1.4,u*0.3,-u*1.0,-u*1.1,0,-u*1.0);c.bezierCurveTo(u*1.0,-u*1.1,u*1.4,u*0.3,0,u*0.9);c.fill();c.strokeStyle='rgba(20,70,30,.55)';c.lineWidth=u*0.06;c.beginPath();c.moveTo(0,u*0.9);c.lineTo(0,-u*0.9);for(let k=-2;k<=2;k++){if(k){c.moveTo(0,u*0.1);c.lineTo(k*u*0.4,-u*0.5);}}c.stroke();c.restore();});}},
  heliconia:{cat:'flora',w:1.3,tier:1,weight:3,cost:1,draw(c,x,y,u,v){const r=mulberry(v*3+7);jsh(c,x,y,u*1.3,u*2.5);for(let k=0;k<4;k++){const bx=x+(k-1.5)*u*0.45,h=u*(2.0+r()*1.2);TH.ln(c,[bx,y],[bx+(r()-0.5)*u*0.3,y-h],'#2f7a3a',u*0.1);
      TH.poly(c,[[bx-u*0.5,y-h*0.3],[bx-u*0.05,y-h*0.55],[bx-u*0.1,y-h*0.2]],'#3a8f48');const cx=bx+(k%2?0.1:-0.1)*u;for(let q=0;q<4;q++){const py=y-h*(0.7+q*0.1);TH.poly(c,[[cx,py+u*0.3],[cx+(q%2?1:-1)*u*0.55,py+u*0.05],[cx,py-u*0.05],[cx+(q%2?1:-1)*u*0.15,py+u*0.2]],['#e0382b','#f06a2a','#f2b22b','#e0382b'][q],'#8a1d14',u*0.03);}}}},
  bamboo:{cat:'flora',w:1.5,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*11+3),t=tm||0;jsh(c,x,y,u*1.5,u*5);for(let k=0;k<7;k++){const bx=x+(k-3)*u*0.32,h=u*(4.6+r()*1.6),sw=Math.sin(t*1.1+k)*u*0.1+(k-3)*u*0.06,col=['#7aa83a','#8ab944','#6a9a34'][k%3];
      TH.ln(c,[bx,y],[bx+sw,y-h],'#4a6a24',u*0.28);TH.ln(c,[bx,y],[bx+sw,y-h],col,u*0.2);for(let q=1;q<7;q++){const f=q/7;TH.ln(c,[bx+sw*f-u*0.15,y-h*f],[bx+sw*f+u*0.15,y-h*f],'#4a6a24',u*0.06);}
      for(let q=0;q<3;q++){const f=0.7+q*0.1;TH.poly(c,[[bx+sw*f,y-h*f],[bx+sw*f+(q%2?1:-1)*u*1.1,y-h*f-u*0.15],[bx+sw*f+(q%2?1:-1)*u*0.3,y-h*f+u*0.12]],'#9acd4a','#5a8a28',u*0.03);}}}},
  palmTree:{cat:'tree',w:1.8,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*9+4),t=tm||0,H=u*(6.4+r()*1.4),lean=(r()-0.5)*u*2.0;jsh(c,x,y,u*2.0,H);
    c.strokeStyle='#6a5236';c.lineWidth=u*0.55;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*0.2,y-H*0.5,x+lean,y-H);c.stroke();c.strokeStyle='#8a6e4a';c.lineWidth=u*0.3;c.stroke();
    for(let k=1;k<12;k++){const f=k/12,px=(1-f)*(1-f)*x+2*(1-f)*f*(x+lean*0.2)+f*f*(x+lean),py=(1-f)*(1-f)*y+2*(1-f)*f*(y-H*0.5)+f*f*(y-H);TH.ln(c,[px-u*0.25,py],[px+u*0.25,py],'rgba(50,34,18,.5)',u*0.06);}
    const tx=x+lean,ty=y-H;for(let k=0;k<9;k++){const a=-3.1+k*0.52,sw=Math.sin(t*1.5+k*0.8)*0.08,l=u*(2.6+(k%2)*0.5);const ex=tx+Math.cos(a+sw)*l,ey=ty+Math.sin(a+sw)*l*0.5+u*0.8;
      c.strokeStyle=k%2?'#2f7f3a':'#3f9a48';c.lineWidth=u*0.18;c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+(ex-tx)*0.55,ty-u*1.2-Math.abs(Math.sin(a))*u*0.6,ex,ey);c.stroke();
      for(let q=1;q<7;q++){const f=q/7,px=tx+(ex-tx)*f,py=ty+(ey-ty)*f-Math.sin(f*3.14)*u*1.0;TH.ln(c,[px,py],[px-(ey-ty)*0.12-u*0.1,py+u*0.5],'#48a852',u*0.07);TH.ln(c,[px,py],[px+(ey-ty)*0.1+u*0.1,py+u*0.5],'#48a852',u*0.07);}}
    [[-0.25,0.35],[0.25,0.4],[0,0.6]].forEach(([dx,dy])=>TH.ell(c,tx+dx*u,ty+dy*u,u*0.28,u*0.28,'#6a4a22'));}},
  kapokTree:{cat:'tree',w:2.6,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v,tm){const r=mulberry(v*7+5),t=tm||0,H=u*5.2;jsh(c,x,y,u*3.0,u*9);
    for(let k=0;k<5;k++){const a=-2.7+k*0.55,l=u*(1.5+r()*0.7);TH.poly(c,[[x+Math.cos(a)*u*0.2,y-u*2.4],[x+Math.cos(a)*l,y+Math.sin(a)*l*0.28+u*0.1],[x+Math.cos(a)*l*0.5+u*0.3,y+Math.sin(a)*l*0.15+u*0.2],[x+u*0.1,y-u*2.8]],k%2?'#6b5a48':'#7a6853');}
    TH.poly(c,[[x-u*0.7,y-u*0.2],[x-u*0.5,y-H],[x+u*0.5,y-H],[x+u*0.7,y-u*0.2]],'#8a7a66');TH.poly(c,[[x+u*0.1,y-H],[x+u*0.5,y-H],[x+u*0.7,y-u*0.2],[x+u*0.15,y-u*0.2]],'rgba(30,24,16,.35)');
    const cols=['#2f6a3a','#3a7a44','#2a5e34','#438a4c'];[[0,-2.4,3.0,2.1],[-2.3,-1.1,2.1,1.5],[2.3,-1.2,2.1,1.5],[0.1,-0.7,2.6,1.6],[-1.2,-3.4,1.9,1.4],[1.4,-3.2,1.8,1.3]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H+dy*u,u*rx,u*ry,cols[i%4],r,10));
    for(let k=0;k<7;k++){const vx=x+(r()-0.5)*u*5.0,vy=y-H+u*(0.0+r()*1.0),l=u*(1.8+r()*2.2),sw=Math.sin(t*0.9+k)*u*0.1;c.strokeStyle=k%2?'#3f6a3a':'#4a7a3a';c.lineWidth=u*0.07;c.beginPath();c.moveTo(vx,vy);c.quadraticCurveTo(vx+sw,vy+l*0.5,vx+sw*1.5,vy+l);c.stroke();}}},
  /* ---------- ruin props ---------- */
  mossBoulder:{cat:'rock',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*13+3);jsh(c,x,y,u*1.9,u*1.4);[[0.0,0.0,1.0,1.0,'#7d7f70'],[-1.0,0.2,0.65,0.6,'#6e7062'],[0.9,0.25,0.6,0.55,'#8a8c7c']].forEach(([dx,dy,sx,sy,col])=>TH.blob(c,x+dx*u,y-u*0.55*sy+dy*u,u*0.9*sx,u*0.75*sy,col,r,9));
    for(let k=0;k<5;k++)TH.ell(c,x+(r()-0.5)*u*1.5,y-u*(0.2+r()*0.8),u*0.3,u*0.14,'rgba(88,140,64,.85)');}},
  fallenColumn:{cat:'rock',w:2.4,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+2);jsh(c,x,y,u*2.4,u*2);
    [[-2.0,-0.9,0.7],[0.0,0.1,0.65],[1.7,-0.4,0.6]].forEach(([X,Y,rr],i)=>{const a=I(X-0.7,Y,rr),b=I(X+0.7,Y,rr);TH.ln(c,a,b,J.stD,u*rr*2.1);TH.ln(c,a,b,J.st,u*rr*1.7);TH.ln(c,[a[0],a[1]-u*rr*0.4],[b[0],b[1]-u*rr*0.4],J.stL,u*rr*0.5);TH.ell(c,a[0],a[1],u*rr*0.55,u*rr*0.9,J.stD);TH.ell(c,a[0],a[1],u*rr*0.3,u*rr*0.5,'#6e6a56');for(let k=0;k<3;k++){const p=I(X-0.4+k*0.4,Y,rr);TH.ln(c,[p[0],p[1]-u*rr*0.9],[p[0],p[1]+u*rr*0.9],'rgba(50,48,34,.3)',u*0.05);}});
    TH.ell(c,x-u*0.9,y-u*0.5,u*0.8,u*0.2,'rgba(80,130,60,.8)');TH.ell(c,x+u*1.6,y-u*0.35,u*0.6,u*0.16,'rgba(70,120,55,.8)');}},
  stela:{cat:'ruin',w:1.3,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+5);jsh(c,x,y,u*1.3,u*4);jbox(c,x,y,u,-0.9,0.9,-0.5,0.5,0,0.4,-0.1);
    TH.poly(c,[I(0.7,-0.2,0.4),I(0.7,0.2,0.4),I(0.7,0.2,4.0),I(0.7,-0.2,4.0)],J.stD);TH.poly(c,[I(-0.7,-0.2,4.0),I(0.7,-0.2,4.0),I(0.7,0.2,4.0),I(-0.7,0.2,4.0)],J.stL);TH.poly(c,[I(-0.7,0.2,0.4),I(0.7,0.2,0.4),I(0.7,0.2,4.0),I(-0.7,0.2,4.0)],J.st);
    jmask(c,x,y,u,0,0.21,3.0,0.9);glyphs(c,x,y,u,-0.6,0.6,0.21,0.7,2.2,r);jmoss(c,x-u*0.3,y+u*0.2,u,r,3);}},
  glyphBlock:{cat:'ruin',w:1.3,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v+3);jsh(c,x,y,u*1.4,u*2);jbox(c,x,y,u,-1.0,1.0,-0.8,0.8,0,1.6);jmask(c,x,y,u,0,0.81,0.85,0.9);jbox(c,x,y,u,-0.6,0.5,-0.5,0.4,1.6,2.1,-0.05);jmask(c,x,y,u,-0.05,0.41,1.85,0.4);jmoss(c,x,y+u*0.3,u,r,4);}},
  chacMool:{cat:'ruin',w:1.7,tier:3,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+8);jsh(c,x,y,u*1.8,u*2);jbox(c,x,y,u,-1.6,1.6,-0.9,0.9,0,0.6,-0.08);
    jbox(c,x,y,u,-1.0,1.1,-0.5,0.5,0.6,1.3);TH.poly(c,[I(-1.2,-0.4,0.6),I(-1.0,-0.4,0.6),I(-1.0,-0.4,1.1),I(-1.2,-0.4,1.1)],J.st);jbox(c,x,y,u,1.0,1.6,-0.3,0.6,0.9,1.5,0.05);TH.ell(c,...I(1.3,0.15,1.7),u*0.3,u*0.3,J.stL);
    TH.ell(c,...I(0.0,0.0,1.35),u*0.45,u*0.22,'#6e6a56');TH.ell(c,...I(0.0,0.0,1.38),u*0.34,u*0.16,'#2b2a22');[[-0.6,0.45],[-0.6,-0.45]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0.9),I(0.1,Y*0.4,1.25),J.st,u*0.22));jmoss(c,x,y+u*0.3,u,r,4);}},
  jaguarStatue:{cat:'ruin',w:1.5,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const r=mulberry(v+4);jsh(c,x,y,u*1.6,u*2);jbox(c,x,y,u,-1.3,1.3,-0.8,0.8,0,0.7,-0.06);const by=y-u*0.7;
    TH.poly(c,[[x-u*1.1,by],[x-u*1.0,by-u*0.9],[x-u*0.3,by-u*1.2],[x+u*0.5,by-u*1.0],[x+u*0.9,by-u*0.3],[x+u*1.0,by]],J.st);TH.poly(c,[[x+u*0.5,by-u*1.0],[x+u*0.9,by-u*0.3],[x+u*1.0,by],[x+u*0.2,by]],'rgba(40,40,28,.35)');
    TH.ln(c,[x-u*1.1,by-u*0.4],[x-u*1.5,by-u*0.9],J.st,u*0.22);TH.poly(c,[[x+u*0.2,by-u*1.1],[x+u*0.9,by-u*1.5],[x+u*1.4,by-u*1.3],[x+u*1.5,by-u*0.7],[x+u*0.9,by-u*0.4],[x+u*0.4,by-u*0.5]],J.stL);
    TH.poly(c,[[x+u*0.4,by-u*1.5],[x+u*0.5,by-u*1.9],[x+u*0.8,by-u*1.5]],J.stL);TH.ell(c,x+u*1.0,by-u*1.0,u*0.1,u*0.1,J.jade);for(let k=0;k<5;k++)TH.ell(c,x-u*0.7+k*u*0.3,by-u*(0.5+(k%2)*0.35),u*0.08,u*0.07,'rgba(40,40,28,.5)');jmoss(c,x,y+u*0.2,u,r,3);}},
  serpentHead:{cat:'ruin',w:1.9,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v){const r=mulberry(v+6);jsh(c,x,y,u*2.0,u*3);
    c.strokeStyle=J.stD;c.lineWidth=u*1.2;c.lineCap='round';c.beginPath();c.moveTo(x+u*2.6,y);c.quadraticCurveTo(x+u*2.2,y-u*1.8,x+u*0.9,y-u*1.4);c.stroke();c.strokeStyle=J.st;c.lineWidth=u*0.9;c.stroke();
    for(let k=0;k<5;k++){const f=k/5;TH.ln(c,[x+u*(2.6-f*1.5),y-u*(f*1.6)-u*0.2],[x+u*(2.6-f*1.5)+u*0.25,y-u*(f*1.6)-u*0.1],'rgba(50,48,34,.4)',u*0.07);}
    jbox(c,x,y,u,-1.4,0.9,-0.9,0.9,0,2.2);TH.poly(c,[[x-u*1.3,y-u*1.5],[x-u*0.4,y-u*2.9],[x+u*0.4,y-u*2.9],[x+u*1.3,y-u*1.5]],J.stL);
    jmask(c,x,y,u,-0.25,0.91,1.2,0.9);TH.ell(c,x-u*0.5,y-u*1.8,u*0.2,u*0.2,J.jade);TH.ell(c,x+u*0.15,y-u*1.8,u*0.2,u*0.2,J.jade);
    TH.poly(c,[[x-u*1.1,y-u*0.3],[x+u*0.7,y-u*0.3],[x+u*0.5,y+u*0.5],[x-u*0.9,y+u*0.5]],'#2b2a22');[[-0.9,0.5],[-0.3,0.5],[0.3,0.5]].forEach(([dx,dy])=>TH.poly(c,[[x+dx*u-u*0.15,y+dy*u-u*0.8],[x+dx*u+u*0.15,y+dy*u-u*0.8],[x+dx*u,y+dy*u-u*0.05]],'#f0ecd8'));TH.poly(c,[[x-u*0.2,y+u*0.1],[x+u*0.2,y+u*0.1],[x,y+u*0.9]],'#b3342f');
    for(let k=0;k<5;k++){const a=-0.4-k*0.35;TH.poly(c,[[x-u*0.4+k*u*0.25,y-u*2.9],[x-u*0.7+k*u*0.4,y-u*3.8-(k%2)*u*0.4],[x-u*0.1+k*u*0.3,y-u*2.9]],[J.turq,J.jade,'#e0382b','#f2b22b','#2f8fd0'][k]);}jmoss(c,x,y+u*0.3,u,r,4);}},
  stoneAltar:{cat:'ruin',w:1.6,tier:3,weight:2.5,cost:1,max:1,draw(c,x,y,u,v,tm){const r=mulberry(v+9),t=tm||0;jsh(c,x,y,u*1.7,u*2);jbox(c,x,y,u,-1.4,1.4,-1.0,1.0,0,0.5,-0.08);jbox(c,x,y,u,-1.1,1.1,-0.7,0.7,0.5,1.5);jmask(c,x,y,u,0,0.71,0.95,0.6);
    TH.ell(c,x,y-u*1.65,u*0.8,u*0.34,'#5e5b48');TH.ell(c,x,y-u*1.7,u*0.65,u*0.27,'#2b2a22');jglow(c,x,y-u*2.3,u*2.4,'255,160,60',0.4+0.1*Math.sin(t*9+v));
    [[0,1.1,0.8],[-0.3,0.75,0.55],[0.3,0.8,0.6]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*11+i*2+v)*u*0.1;TH.poly(c,[[x+dx*u-u*0.3*w,y-u*1.7],[x+dx*u+f,y-u*(1.7+h*1.2)],[x+dx*u+u*0.3*w,y-u*1.7]],i?'#fbbf24':'#f97316');});jmoss(c,x,y+u*0.3,u,r,3);}},
  /* ---------- props ---------- */
  torchPost:{cat:'prop',w:0.9,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v,tm){const t=tm||0;jsh(c,x,y,u,u*4);jbox(c,x,y,u,-0.5,0.5,-0.5,0.5,0,0.5,-0.06);TH.ln(c,[x,y-u*0.4],[x,y-u*2.6],'#6b5a3e',u*0.34);TH.ln(c,[x,y-u*1.2],[x,y-u*1.6],J.turq,u*0.4);
    TH.poly(c,[[x-u*0.5,y-u*2.5],[x+u*0.5,y-u*2.5],[x+u*0.35,y-u*3.0],[x-u*0.35,y-u*3.0]],'#4a3d2a');jglow(c,x,y-u*3.5,u*2.4,'255,160,60',0.4+0.1*Math.sin(t*10+v));
    [[0,1.1,0.8],[-0.25,0.75,0.55],[0.25,0.8,0.6]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*12+i*2+v)*u*0.1;TH.poly(c,[[x+dx*u-u*0.3*w,y-u*3.0],[x+dx*u+f,y-u*(3.0+h*1.2)],[x+dx*u+u*0.3*w,y-u*3.0]],i?'#fbbf24':'#f97316');});}},
  clayPots:{cat:'prop',w:1.4,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u,v){jsh(c,x,y,u*1.5,u*1.5);const pot=(px,py,s,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(px-u*0.45*s,py-u*1.1*s);c.bezierCurveTo(px-u*0.9*s,py-u*0.7*s,px-u*0.7*s,py,px-u*0.3*s,py);c.lineTo(px+u*0.3*s,py);c.bezierCurveTo(px+u*0.7*s,py,px+u*0.9*s,py-u*0.7*s,px+u*0.45*s,py-u*1.1*s);c.closePath();c.fill();
      c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.moveTo(px+u*0.1*s,py-u*1.1*s);c.bezierCurveTo(px+u*0.5*s,py-u*0.9*s,px+u*0.6*s,py-u*0.2*s,px+u*0.3*s,py);c.lineTo(px+u*0.1*s,py);c.fill();TH.ell(c,px,py-u*1.1*s,u*0.45*s,u*0.17*s,'#2a1c12');TH.ln(c,[px-u*0.7*s,py-u*0.55*s],[px+u*0.7*s,py-u*0.55*s],J.turq,u*0.1*s);TH.ln(c,[px-u*0.55*s,py-u*0.3*s],[px+u*0.55*s,py-u*0.3*s],'#f2d24a',u*0.07*s);};
    pot(x-u*0.9,y+u*0.1,0.9,'#c4683a');pot(x+u*0.5,y+u*0.2,1.15,'#b5532f');TH.ell(c,x-u*0.1,y+u*0.5,u*0.55,u*0.2,'#a5502f');TH.ell(c,x-u*0.1,y+u*0.38,u*0.4,u*0.13,'#e8b04a');[[-0.2,0.3],[0.05,0.28]].forEach(([dx,dy],i)=>TH.ell(c,x+dx*u,y+dy*u,u*0.18,u*0.18,['#f06a2a','#f2c230'][i]));}},
  macaw:{cat:'prop',w:0.9,tier:1,weight:3,cost:1,max:1,draw(c,x,y,u,v,tm){const t=tm||0,by=y-u*1.8;jsh(c,x,y,u*0.8,u*3);TH.ln(c,[x,y],[x,y-u*1.7],'#6b5a3e',u*0.2);TH.ln(c,[x-u*0.9,y-u*1.7],[x+u*0.9,y-u*1.7],'#6b5a3e',u*0.16);
    TH.poly(c,[[x-u*0.3,by-u*0.3],[x-u*0.9,by+u*1.1],[x-u*0.55,by+u*1.3],[x-u*0.2,by+u*0.2]],'#2f6fd0');TH.poly(c,[[x-u*0.4,by-u*0.3],[x-u*0.7,by+u*0.9],[x-u*0.5,by+u*1.0],[x-u*0.25,by+u*0.1]],'#e0382b');
    TH.ell(c,x,by-u*0.5,u*0.5,u*0.8,'#d9342b',-0.2);TH.ell(c,x+u*0.15,by-u*0.35,u*0.28,u*0.5,'#f2c230',-0.2);TH.poly(c,[[x-u*0.4,by-u*0.5],[x-u*0.1,by-u*0.9],[x+u*0.15,by-u*0.2]],'#2f6fd0');
    const hb=Math.sin(t*3+v)*u*0.04;TH.ell(c,x+u*0.2,by-u*1.35+hb,u*0.3,u*0.3,'#d9342b');TH.ell(c,x+u*0.3,by-u*1.35+hb,u*0.16,u*0.18,'#f8fafc');TH.ell(c,x+u*0.32,by-u*1.38+hb,u*0.05,u*0.05,'#161616');TH.poly(c,[[x+u*0.45,by-u*1.5+hb],[x+u*0.85,by-u*1.3+hb],[x+u*0.5,by-u*1.15+hb]],'#3a3a3a');TH.poly(c,[[x+u*0.45,by-u*1.5+hb],[x+u*0.8,by-u*1.38+hb],[x+u*0.5,by-u*1.32+hb]],'#f0e8d0');
    TH.ln(c,[x-u*0.1,by+u*0.1],[x-u*0.1,by+u*0.4],'#4a4a4a',u*0.06);TH.ln(c,[x+u*0.2,by+u*0.1],[x+u*0.2,by+u*0.4],'#4a4a4a',u*0.06);}},
  tikiTotem:{cat:'prop',w:1.0,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const r=mulberry(v+2);jsh(c,x,y,u,u*5);TH.ln(c,[x,y],[x,y-u*5.2],'#5a4028',u*1.1);TH.ln(c,[x-u*0.15,y],[x-u*0.15,y-u*5.1],'#7a5836',u*0.35);
    ['#b5532f','#1fb5a8','#e0b53a','#b5532f'].forEach((col,i)=>{const cy=y-u*(0.9+i*1.2);TH.poly(c,[[x-u*0.55,cy-u*0.5],[x+u*0.55,cy-u*0.5],[x+u*0.55,cy+u*0.5],[x-u*0.55,cy+u*0.5]],col,'#2a1c12',u*0.05);[-0.2,0.2].forEach(e=>{TH.ell(c,x+e*u,cy-u*0.1,u*0.13,u*0.13,'#f8fafc');TH.ell(c,x+e*u,cy-u*0.1,u*0.06,u*0.06,'#161616');});TH.ln(c,[x-u*0.25,cy+u*0.22],[x+u*0.25,cy+u*0.22],'#2a1c12',u*0.1);TH.ln(c,[x,cy],[x,cy+u*0.12],'#2a1c12',u*0.07);});
    TH.poly(c,[[x-u*0.4,y-u*5.15],[x,y-u*5.9],[x+u*0.4,y-u*5.15]],'#e0382b');TH.poly(c,[[x-u*1.1,y-u*3.5],[x-u*0.55,y-u*3.9],[x-u*0.55,y-u*3.1]],'#1fb5a8');TH.poly(c,[[x+u*1.1,y-u*3.5],[x+u*0.55,y-u*3.9],[x+u*0.55,y-u*3.1]],'#1fb5a8');}},
  smallShrine:{cat:'structure',w:2.3,tier:3,weight:3,cost:2,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+3);jsh(c,x,y,u*2.6,u*4);jbox(c,x,y,u,-2.2,2.2,-2.0,2.0,0,0.7,-0.06);jbox(c,x,y,u,-1.8,1.8,-1.6,1.6,0.7,1.3,-0.03);
    jbox(c,x,y,u,-1.3,1.3,-1.1,1.1,1.3,3.5);TH.poly(c,[I(-0.5,1.11,1.3),I(0.5,1.11,1.3),I(0.5,1.11,2.8),I(-0.5,1.11,2.8)],J.dark);TH.ln(c,I(-0.55,1.12,2.85),I(0.55,1.12,2.85),J.stL,u*0.14);glyphs(c,x,y,u,-1.2,-0.6,1.11,1.5,3.2,r);glyphs(c,x,y,u,0.6,1.2,1.11,1.5,3.2,r);
    jbox(c,x,y,u,-1.5,1.5,-1.3,1.3,3.5,3.9,0.05);jbox(c,x,y,u,-0.8,0.8,-0.4,0.4,3.9,5.3);[[-0.4,4.3],[0.3,4.7],[-0.2,5.0]].forEach(([X,Z])=>TH.poly(c,[I(X,0.41,Z),I(X+0.25,0.41,Z),I(X+0.25,0.41,Z+0.3),I(X,0.41,Z+0.3)],J.dark));
    for(let k=0;k<9;k++)TH.ln(c,I(-0.5,1.8+k*0.0,0),I(0.5,1.8,0),'rgba(0,0,0,0)',1);jmoss(c,x-u*1.3,y+u*0.9,u,r,4);jmoss(c,x+u*1.1,y+u*0.5,u,r,3);}},
  /* ---------- landmarks ---------- */
  stepPyramid:{cat:'landmark',w:4.6,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+3),n=6,th=1.15,top=n*th,t=tm||0;jsh(c,x,y,u*5.2,u*9);
    for(let i=0;i<n;i++){const s=4.4-i*0.62;jbox(c,x,y,u,-s,s,-s,s,i*th,(i+1)*th,i%2?-0.02:0.03);TH.ln(c,I(-s,s,(i+1)*th),I(s,s,(i+1)*th),'rgba(255,255,240,.22)',u*0.07);
      for(let k=-3;k<=3;k++){if(Math.abs(k*s*0.3)<1.2)continue;const X=k*s*0.3;TH.poly(c,[I(X-0.15,s+0.01,i*th+0.3),I(X+0.15,s+0.01,i*th+0.3),I(X+0.15,s+0.01,i*th+0.75),I(X-0.15,s+0.01,i*th+0.75)],'rgba(30,34,24,.5)');}
      if(i<4)glyphs(c,x,y,u,-s+0.3,-1.2,s+0.01,i*th+0.15,(i+1)*th-0.1,r);}
    const Ya=4.6,Yb=1.4;TH.poly(c,[I(-0.85,Ya,0),I(0.85,Ya,0),I(0.85,Yb,top),I(-0.85,Yb,top)],'#d0ccb4');for(let k=1;k<30;k++){const f=k/30;TH.ln(c,I(-0.85,Ya+(Yb-Ya)*f,top*f),I(0.85,Ya+(Yb-Ya)*f,top*f),'rgba(70,66,48,.4)',u*0.04);}
    [-1,1].forEach(s=>TH.ln(c,I(s*1.0,Ya,0.25),I(s*1.0,Yb,top+0.25),J.stL,u*0.34));TH.poly(c,[I(-1.0,Ya,0),I(-0.85,Ya,0),I(-0.85,Yb,top),I(-1.0,Yb,top)],'rgba(30,30,20,.22)');
    const ts=1.5;jbox(c,x,y,u,-ts,ts,-ts,ts,top,top+1.8);TH.poly(c,[I(-0.5,ts+0.01,top),I(0.5,ts+0.01,top),I(0.5,ts+0.01,top+1.35),I(-0.5,ts+0.01,top+1.35)],J.dark);jmask(c,x,y,u,-1.0,ts+0.01,top+0.9,0.5);jmask(c,x,y,u,1.0,ts+0.01,top+0.9,0.5);
    jbox(c,x,y,u,-ts-0.15,ts+0.15,-ts-0.15,ts+0.15,top+1.8,top+2.1,0.06);jbox(c,x,y,u,-0.95,0.95,-0.5,0.5,top+2.1,top+3.4);[[-0.5,2.5],[0.2,2.9],[-0.2,3.1]].forEach(([X,Z])=>TH.poly(c,[I(X,0.51,top+Z-0.1),I(X+0.3,0.51,top+Z-0.1),I(X+0.3,0.51,top+Z+0.2),I(X,0.51,top+Z+0.2)],J.dark));
    for(let k=0;k<10;k++){const s=4.3-r()*3.2,i=Math.floor(r()*4);TH.blob(c,...I(-s+r()*1.5,s+0.05,i*th+0.5),u*(0.4+r()*0.5),u*0.22,k%2?'#4a7a3a':'#5f8a47',r,7);}
    const f=I(0,0,top+3.4);jglow(c,f[0],f[1]-u*0.5,u*2.4,'255,160,60',0.25+0.08*Math.sin(t*6));}},
  templeShrine:{cat:'landmark',w:3.0,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+5),n=3,th=1.1,top=n*th;jsh(c,x,y,u*3.3,u*6);
    for(let i=0;i<n;i++){const s=3.0-i*0.6;jbox(c,x,y,u,-s,s,-s,s,i*th,(i+1)*th,i%2?-0.02:0.03);TH.ln(c,I(-s,s,(i+1)*th),I(s,s,(i+1)*th),'rgba(255,255,240,.22)',u*0.07);glyphs(c,x,y,u,-s+0.3,-0.8,s+0.01,i*th+0.15,(i+1)*th-0.1,r);}
    const Ya=3.2,Yb=1.3;TH.poly(c,[I(-0.7,Ya,0),I(0.7,Ya,0),I(0.7,Yb,top),I(-0.7,Yb,top)],'#d0ccb4');for(let k=1;k<18;k++){const f=k/18;TH.ln(c,I(-0.7,Ya+(Yb-Ya)*f,top*f),I(0.7,Ya+(Yb-Ya)*f,top*f),'rgba(70,66,48,.4)',u*0.04);}
    const ts=1.2;jbox(c,x,y,u,-ts,ts,-ts,ts,top,top+1.6);TH.poly(c,[I(-0.45,ts+0.01,top),I(0.45,ts+0.01,top),I(0.45,ts+0.01,top+1.2),I(-0.45,ts+0.01,top+1.2)],J.dark);jbox(c,x,y,u,-ts-0.12,ts+0.12,-ts-0.12,ts+0.12,top+1.6,top+1.9,0.06);jbox(c,x,y,u,-0.8,0.8,-0.4,0.4,top+1.9,top+3.0);
    [[-0.4,2.3],[0.2,2.6]].forEach(([X,Z])=>TH.poly(c,[I(X,0.41,top+Z-0.1),I(X+0.25,0.41,top+Z-0.1),I(X+0.25,0.41,top+Z+0.2),I(X,0.41,top+Z+0.2)],J.dark));
    for(let k=0;k<8;k++)TH.blob(c,...I(-2.6+r()*2.0,3.0+0.05,r()*2.2+0.4),u*(0.4+r()*0.5),u*0.22,k%2?'#4a7a3a':'#5f8a47',r,7);jmoss(c,x+u*1.8,y+u*0.8,u,r,4);}},
  ballCourt:{cat:'landmark',w:4.0,tier:3,weight:2.5,cost:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+7);jsh(c,x,y,u*4,u*5);TH.poly(c,[I(-3.4,-1.0,0),I(3.4,-1.0,0),I(3.4,1.0,0),I(-3.4,1.0,0)],'#c9b98a');for(let k=0;k<12;k++)TH.ln(c,I(-3.2+k*0.58,-0.9,0),I(-3.2+k*0.58,0.9,0),'rgba(100,80,40,.25)',u*0.05);TH.ln(c,I(-3.4,0,0),I(3.4,0,0),'rgba(100,80,40,.45)',u*0.07);
    jbox(c,x,y,u,-3.6,3.6,-3.2,-1.5,0,2.8);TH.poly(c,[I(-3.6,-1.5,2.8),I(3.6,-1.5,2.8),I(3.6,-0.9,0),I(-3.6,-0.9,0)],J.st);for(let k=1;k<7;k++){const f=k/7;TH.ln(c,I(-3.6,-1.5+0.6*f,2.8*(1-f)),I(3.6,-1.5+0.6*f,2.8*(1-f)),'rgba(60,56,40,.22)',u*0.05);}
    glyphs(c,x,y,u,-3.4,-1.2,-0.91,0.2,1.8,r);const rc=I(0,-1.5,3.9);c.strokeStyle='#8e8a72';c.lineWidth=u*0.55;c.beginPath();for(let a=0;a<=24;a++){const t=a/24*6.283,p=I(Math.cos(t)*0.9,-1.5,3.9+Math.sin(t)*0.9);a?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();c.strokeStyle=J.stL;c.lineWidth=u*0.2;c.stroke();jmask(c,x,y,u,1.9,-1.49,2.1,0.6);
    jbox(c,x,y,u,-3.6,3.6,1.5,3.2,0,1.9,-0.04);TH.poly(c,[I(-3.6,1.5,1.9),I(3.6,1.5,1.9),I(3.6,1.0,1.4),I(-3.6,1.0,1.4)],'#a9a58c');glyphs(c,x,y,u,-3.4,3.2,3.21,0.3,1.6,r);
    jbox(c,x,y,u,-3.9,-3.2,-0.6,0.6,0,1.4,0.04);jbox(c,x,y,u,3.2,3.9,-0.6,0.6,0,1.4,0.04);for(let k=0;k<9;k++)TH.blob(c,...I(-3.4+r()*6.8,r()<0.5?-2.4:2.5,2.8+r()*0.1),u*(0.3+r()*0.4),u*0.18,k%2?'#4a7a3a':'#5f8a47',r,7);}},
  corbelArch:{cat:'landmark',w:3.2,tier:3,weight:3,cost:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+4);jsh(c,x,y,u*3.2,u*6);TH.poly(c,[I(-1.8,0.0,0),I(1.8,0.0,0),I(0,0.0,5.0)],'#0f1514');
    for(let i=0;i<6;i++){const z0=i*0.95,z1=z0+0.95;jbox(c,x,y,u,-3.1,-1.8+0.42*i,-0.9,0.9,z0,z1,i%2?-0.03:0.02);if(i<4)jbox(c,x,y,u,1.8-0.42*i,3.1,-0.9,0.9,z0,z1,i%2?0.02:-0.03);}
    jbox(c,x,y,u,1.2,3.1,-0.9,0.9,3.8,4.2,-0.04);for(let k=0;k<5;k++)jbox(c,x,y,u,0.6+r()*2.2,1.0+r()*2.2,0.5+r()*0.9,0.8+r()*1.1,0,0.4+r()*0.5,-0.1+r()*0.15);
    jbox(c,x,y,u,-1.3,1.3,-0.7,0.7,5.7,6.2,0.04);jbox(c,x,y,u,-0.5,0.5,-0.3,0.3,6.2,7.5);[[-0.2,6.5],[0.1,6.9]].forEach(([X,Z])=>TH.poly(c,[I(X-0.1,0.31,Z),I(X+0.15,0.31,Z),I(X+0.15,0.31,Z+0.25),I(X-0.1,0.31,Z+0.25)],J.dark));
    glyphs(c,x,y,u,-3.0,-2.0,0.91,0.3,4.0,r);jmask(c,x,y,u,-2.45,0.91,4.2,0.55);
    for(let k=0;k<8;k++){const sx=-3.0+r()*6;TH.ln(c,I(sx,0.95,3.0+r()*2),I(sx+(r()-0.5)*0.3,0.95,1.0+r()*1.5),r()<0.5?'#3f6a3a':'#4a7a3a',u*0.07);}jmoss(c,x-u*2.2,y+u*0.8,u,r,4);jmoss(c,x+u*2.0,y+u*0.6,u,r,3);}}
  }};
const JUNGLE_HEIGHT={fernCluster:'low',elephantEar:'low',heliconia:'low',mossBoulder:'low',fallenColumn:'low',glyphBlock:'low',chacMool:'low',jaguarStatue:'low',serpentHead:'low',stoneAltar:'low',torchPost:'low',clayPots:'low',macaw:'low',
  bamboo:'mid',palmTree:'mid',kapokTree:'mid',stela:'mid',tikiTotem:'mid',smallShrine:'mid',stepPyramid:'tall',templeShrine:'tall',ballCourt:'tall',corbelArch:'tall'};
Object.keys(JUNGLE_PACK.assets).forEach(id=>{JUNGLE_PACK.assets[id].h=JUNGLE_HEIGHT[id]||'low';});
const KEEP_OUT={rx:0.52,ry:0.34};   // central ellipse (x R) reserved for the ride or building sprite
/* opts.avoid = [{x,y,r}] circles (tile-local px) to keep free, used instead of the central ellipse when the tile belongs to a two-tile ride */
function placeThemeAssets(pack,tier,R,seed,opts){
  opts=opts||{};const avoid=opts.avoid||null;
  const rnd=mulberry(seed*7919+tier*131), u=R*0.068, T=pack.tiers[tier], out=[], decals=[], TAU=Math.PI*2;
  if(!T)return {assets:out,decals,u};
  const inside=(x,y,k)=>{const X=Math.abs(x)/R,Y=Math.abs(y)/(0.58*R);return X<=0.866*k&&Y<=k-X/1.732;};
  const ids=Object.keys(pack.assets), cnt={};
  const free=(x,y,w)=>out.every(o=>Math.hypot(o.x-x,(o.y-y)*1.7)>(o.w+w)*u*0.8);
  const clearOfCenter=(x,y,w,h)=>{if(avoid){const kk=h==='tall'?0.75:0.85;for(const a of avoid){if(Math.hypot(x-a.x,(y-a.y)*1.7)<a.r+w*u*kk)return false;}return true;}const kx=h==='tall'?0.28:0.75,ky=h==='tall'?0.18:0.4,ex=R*KEEP_OUT.rx+w*u*kx,ey=R*KEEP_OUT.ry+w*u*ky;return x*x/(ex*ex)+y*y/(ey*ey)>1;};
  const zoneOK=(a,x,y)=>{const h=a.h||'low';if(h==='low')return true;const ax=Math.abs(x)/R;
    if(h==='tall')return y<R*0.12&&ax>(y>=-R*0.12?0.55:0.4);
    if(y>R*0.12)return h==='mid'&&ax>0.5;if(y>=-R*0.12)return h==='mid'||ax>0.55;return true;};
  const ringPoint=(tmax)=>{const th=rnd()*TAU,dx=Math.cos(th),dy=Math.sin(th);let lo=0,hi=R*1.2;
    for(let i=0;i<12;i++){const m=(lo+hi)/2;if(inside(dx*m,dy*m,0.9))lo=m;else hi=m;}const t=0.5+rnd()*((tmax||1)-0.5);return[dx*lo*t,dy*lo*t];};
  const spot=a=>{for(let i=0;i<120;i++){const p=ringPoint(a.h==='tall'?0.8:a.h==='mid'?0.92:1);if(clearOfCenter(p[0],p[1],a.w,a.h)&&zoneOK(a,p[0],p[1])&&free(p[0],p[1],a.w))return p;}return null;};
  const add=(id,x,y)=>{const a=pack.assets[id];out.push({id,x,y,v:Math.floor(rnd()*1000),w:a.w});cnt[id]=(cnt[id]||0)+1;};
  for(let i=0;i<Math.round(T.decals*(opts.decalScale==null?1:opts.decalScale));i++){const pool=ids.filter(id=>pack.assets[id].cat==='decal'&&pack.assets[id].tier<=tier),id=pool[Math.floor(rnd()*pool.length)];
    for(let t=0;t<40;t++){const p=ringPoint();if(clearOfCenter(p[0],p[1],pack.assets[id].w*0.5)){decals.push({id,x:p[0],y:p[1],v:Math.floor(rnd()*1000)});break;}}}
  let budget=Math.max(0,Math.round(T.budget*(opts.budgetScale==null?1:opts.budgetScale)));const maxW=opts.maxW==null?1e9:opts.maxW;
  const land=()=>{let id=T.pool[Math.floor(rnd()*T.pool.length)];for(let q=0;q<8&&cnt[id];q++)id=T.pool[Math.floor(rnd()*T.pool.length)];
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}};
  if(!opts.noLandmarks&&T.pool.length&&rnd()<T.landmark){land();if(T.second&&rnd()<T.second)land();}
  let guard=0;while(budget>0&&guard++<500){const pool=ids.filter(id=>{const a=pack.assets[id];return a.cat!=='decal'&&a.cat!=='landmark'&&a.tier<=tier&&a.cost<=budget&&a.w<=maxW&&(cnt[id]||0)<(a.max||3);});
    if(!pool.length)break;let tot=0;pool.forEach(id=>tot+=pack.assets[id].weight);let pick=rnd()*tot,id=pool[0];for(const q of pool){pick-=pack.assets[q].weight;if(pick<=0){id=q;break;}}
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}else{cnt[id]=99;}}
  return {assets:out,decals,u};
}
function drawThemeGround(ctx,cx,cy,R,pack,border){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);ctx[i?'lineTo':'moveTo'](cx+R*Math.cos(a),cy+R*Math.sin(a)*0.58);}ctx.closePath();
  ctx.fillStyle=pack.ground;ctx.fill();ctx.lineWidth=Math.max(1.5,R*0.03);ctx.strokeStyle=border||pack.border;ctx.stroke();}
function drawThemeDecals(ctx,cx,cy,pack,pl,tm){pl.decals.forEach(d=>pack.assets[d.id].draw(ctx,cx+d.x,cy+d.y,pl.u,d.v,tm||0));}
/* layer: 'back' (y<0, draw BEFORE the ride sprite), 'front' (y>=0, draw AFTER it) or omit for all, sorted by y */
function drawThemeAssets(ctx,cx,cy,pack,pl,tm,layer){pl.assets.filter(o=>layer==='back'?o.y<0:layer==='front'?o.y>=0:true).sort((a,b)=>a.y-b.y).forEach(o=>pack.assets[o.id].draw(ctx,cx+o.x,cy+o.y,pl.u,o.v,tm||0));}
function drawThemedTile(ctx,cx,cy,R,pack,tier,seed,tm,border,rideFn){drawThemeGround(ctx,cx,cy,R,pack,border);const pl=placeThemeAssets(pack,tier,R,seed);
  drawThemeDecals(ctx,cx,cy,pack,pl,tm);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'back');if(rideFn)rideFn(ctx,cx,cy,R);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'front');}
/* ===== END PACK CODE ===== */

/* ===== STATIC B&M-STYLE HYPER COASTER (two-hex sprites, out-and-back, baked once) ===== */
/**
 * Fills nearly both hexes (about 88% of the pair's width). Layout (travel order): station -> chain lift (straight ~54deg climb, rounded top hat) -> steep first drop (~62-68deg, no pre-drop)
 * -> airtime camelbacks that shrink (2 on the way out) -> long climb into a banked HAMMERHEAD turnaround at the far end (crest + ~60deg bank)
 * -> drop off the hammerhead -> four more shrinking airtime hills -> low brake run back into the station.
 * Track: B&M-style box spine in the Land colour with two rails; trains are white, open stadium seating, lap bars, Land-colour noses.
 * Supports: tubular steel; single columns with a cap beam where the track is low, A-frame pairs with cross-ties where it is high;
 * dense under the lift and drop, sparse on the hills and the flat run (that is how B&M structures look).
 *
 *  drawHyperSide(ctx, cx, cy, R, {accent})                  two hexes side by side (E-W)
 *  drawHyperDiag(ctx, cx, cy, R, {accent, dir})             dir 'NW-SE' (default) or 'NE-SW' (mirrored)
 *  hyperFootprint(R, mode, dir) -> {tiles:[[x,y],[x,y]], circles:[{x,y,r}]}     mode 'side' | 'diag'
 *  footprintForTile(fp, i)  -> circles in tile i's own coordinates for placeThemeAssets(..., {avoid})
 */
const HY_KNOTS=[[0,0.06,0],[0.26,0.06,0],[0.40,0.20,1.2],[0.58,0.48,1.5],[0.68,0.58,0],[0.78,0.40,-2.4],[0.88,0.12,-2.9],[0.96,0.04,0],
  [1.03,0.22,2.4],[1.12,0.42,0],[1.21,0.22,-2.4],[1.28,0.04,0],[1.35,0.20,2.1],[1.42,0.32,0],[1.49,0.20,-2.1],[1.56,0.04,0],
  [1.70,0.18,1.15],[1.84,0.35,1.1],[1.92,0.42,0],[2.00,0.40,-0.6],[2.08,0.33,-1.6],[2.20,0.12,-2.0],[2.30,0.04,0],
  [2.38,0.18,1.9],[2.46,0.28,0],[2.54,0.18,-1.9],[2.62,0.04,0],[2.69,0.16,1.8],[2.76,0.22,0],[2.83,0.16,-1.8],[2.90,0.04,0],
  [2.97,0.12,1.4],[3.04,0.17,0],[3.11,0.12,-1.4],[3.18,0.04,0],[3.24,0.10,1.0],[3.30,0.12,0],[3.36,0.10,-1.0],[3.42,0.04,0],[4.156,0.06,0]];
function hyZ(D){const K=HY_KNOTS;let i=0;while(i<K.length-2&&D>K[i+1][0])i++;const a=K[i],b=K[i+1],dx=b[0]-a[0],t=Math.max(0,Math.min(1,(D-a[0])/dx)),t2=t*t,t3=t2*t;
  return(2*t3-3*t2+1)*a[1]+(t3-2*t2+t)*dx*a[2]+(-2*t3+3*t2)*b[1]+(t3-t2)*dx*b[2];}
function hyLayout(R,mode){
  hyLayout._c=hyLayout._c||{};const key=mode+R;if(hyLayout._c[key])return hyLayout._c[key];
  const side=mode==='side',N=520,a=side?1.38*R:0.98*R,h=side?0.14*R:0.11*R,S=2*a,arc=Math.PI*h,Lt=2*S+2*arc,hs=Lt/(4.156*R),zsc=Math.min(hs,1.3),k=Math.max(1,1+0.5*(hs-1));
  const ax=side?[1,0]:[0.706,0.709],lt=side?[0,-1]:[0.706,-0.709];
  const hexes=side?[[-0.866*R,0],[0.866*R,0]]:[[-0.433*R,-0.435*R],[0.433*R,0.435*R]];
  const wv=s=>{const c=Math.cos(Math.PI*0.5*s/a);return R*0.032*Math.sin(s/a*Math.PI*1.5)*c*c;};
  const g=[],z=[],o=[],bank=[],ds=[];
  for(let i=0;i<N;i++){const l=i/N*Lt;let s,lat,out,bk=0;
    if(l<S){s=-a+l;lat=h+wv(s);out=lt;}
    else if(l<S+arc){const th=(l-S)/h;s=a+h*Math.sin(th);lat=h*Math.cos(th);const v=[ax[0]*(s-a)+lt[0]*lat,ax[1]*(s-a)+lt[1]*lat],m=Math.hypot(v[0],v[1])||1;out=[v[0]/m,v[1]/m];bk=1.25*Math.sin(th);}
    else if(l<2*S+arc){s=a-(l-S-arc);lat=-h+wv(s);out=[-lt[0],-lt[1]];}
    else{const th=(l-2*S-arc)/h;s=-a-h*Math.sin(th);lat=-h*Math.cos(th);const v=[ax[0]*(s+a)+lt[0]*lat,ax[1]*(s+a)+lt[1]*lat],m=Math.hypot(v[0],v[1])||1;out=[v[0]/m,v[1]/m];bk=0.55*Math.sin(th);}
    g.push([ax[0]*s+lt[0]*lat,ax[1]*s+lt[1]*lat]);o.push(out);bank.push(bk);z.push(zsc*hyZ(i/N*4.156)*R);}
  const T=g.map((_,i)=>{const p=g[(i+N-1)%N],q=g[(i+1)%N],dx=q[0]-p[0],dy=q[1]-p[1],m=Math.hypot(dx,dy)||1;return[dx/m,dy/m];});
  return hyLayout._c[key]={N,g,z,o,bank,T,hexes,Lt,hs,k,ds:Lt/N,lt,ax};
}
function hyDraw(ctx,cx,cy,R,op,mode){
  const accent=op.accent||'#f8fafc',fl=op.flip?-1:1,L=hyLayout(R,mode),N=L.N,k=L.k,Rk=R*k,hw=R*0.02*k,thk=R*0.016*k;ctx.save();ctx.translate(cx,cy);ctx.lineJoin='round';ctx.lineCap='round';
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=fill;ctx.lineWidth=0.7;ctx.stroke();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.006;ctx.stroke();}};
  const P=i=>{i=(i+N)%N;return[L.g[i][0],L.g[i][1]-L.z[i]];};
  const ED=[];for(let i=0;i<N;i++){const p=P(i),o=L.o[i],b=L.bank[i],c=Math.cos(b),s=Math.sin(b);ED.push({p,E1:[p[0]+o[0]*hw*c,p[1]+o[1]*hw*c-hw*s],E2:[p[0]-o[0]*hw*c,p[1]-o[1]*hw*c+hw*s],
    R1:[p[0]+o[0]*hw*0.7*c,p[1]+o[1]*hw*0.7*c-hw*0.7*s-R*0.005],R2:[p[0]-o[0]*hw*0.7*c,p[1]-o[1]*hw*0.7*c+hw*0.7*s-R*0.005]});}
  ctx.save();ctx.translate(fl*R*0.04,R*0.03);ctx.beginPath();L.g.forEach((p,i)=>{const z=L.z[i],x=p[0]+fl*z*0.3,y=p[1]+z*0.15;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.strokeStyle='rgba(15,25,20,.17)';ctx.lineWidth=R*0.05*k;ctx.stroke();ctx.restore();
  const items=[],D0=i=>i/N*4.156;
  // track
  for(let i=0;i<N;i++){const j=(i+1)%N,ei=ED[i],ej=ED[j],key=L.g[i][1]+L.z[i]*0.05,lift=D0(i)>0.3&&D0(i)<0.68;
    items.push({k:key,f:()=>{const nearE1=(ei.E1[1]+ej.E1[1])>(ei.E2[1]+ej.E2[1]),ea=nearE1?ei.E1:ei.E2,eb=nearE1?ej.E1:ej.E2;
      poly([ea,eb,[eb[0],eb[1]+thk],[ea[0],ea[1]+thk]],shade(accent,-0.38));line([ei.p[0],ei.p[1]+thk*0.55],[ej.p[0],ej.p[1]+thk*0.55],shade(accent,-0.55),R*0.014*k);
      poly([ei.E1,ej.E1,ej.E2,ei.E2],accent);line(ei.R1,ej.R1,'#232a3c',R*0.0055*k);line(ei.R2,ej.R2,'#232a3c',R*0.0055*k);line(ei.p,ej.p,'rgba(255,255,255,.28)',R*0.006*k);
      if(lift&&i%3===0)line([ei.p[0]+L.o[i][0]*hw*0.6,ei.p[1]+L.o[i][1]*hw*0.6],[ei.p[0]-L.o[i][0]*hw*0.6,ei.p[1]-L.o[i][1]*hw*0.6],'#141a28',R*0.006);}});}
  // supports: dense where the track is steep (lift, drops), sparse on hills and the flat run
  let acc=0;for(let i=0;i<N;i++){acc+=L.ds;const zi=L.z[i],sl=Math.abs(L.z[(i+1)%N]-L.z[(i+N-1)%N])/(2*L.ds),sp=(sl>0.7?R*0.07:sl>0.3?R*0.11:R*0.18)*k;
    if(acc<sp||zi<R*0.07)continue;acc=0;const o=L.o[i],G=L.g[i],H=ED[i].p,top=[H[0],H[1]+thk*1.2],key=G[1]+zi*0.05-0.002;
    items.push({k:key,f:()=>{const tall=zi>R*0.26,foot=(c)=>{ctx.fillStyle='rgba(20,28,40,.35)';ctx.beginPath();ctx.ellipse(c[0],c[1]+R*0.004,R*0.04*k,R*0.016*k,0,0,7);ctx.fill();};
      const tube=(a,b,w)=>{line(a,b,'#8f98ad',w);line([a[0]-w*0.18,a[1]],[b[0]-w*0.18,b[1]],'#e9edf5',w*0.55);};
      if(!tall){foot(G);tube([G[0],G[1]],[(G[0]+top[0])/2,(G[1]+top[1])/2],R*0.03*k);tube([(G[0]+top[0])/2,(G[1]+top[1])/2],top,R*0.021*k);}
      else{const sg=R*(0.045+0.04*Math.min(1,zi/(R*0.6)))*k,st=R*0.03*k;[-1,1].forEach(s=>{const b=[G[0]+o[0]*s*sg,G[1]+o[1]*s*sg],t=[top[0]+o[0]*s*st,top[1]+o[1]*s*st];foot(b);tube(b,[(b[0]+t[0])/2,(b[1]+t[1])/2],R*0.026*k);tube([(b[0]+t[0])/2,(b[1]+t[1])/2],t,R*0.019*k);});
        [0.33,0.66].forEach(f=>{const y0=G[1]+(top[1]-G[1])*f,sx=sg+(st-sg)*f;line([G[0]-o[0]*sx,y0-o[1]*sx],[G[0]+o[0]*sx,y0+o[1]*sx],'#b6bed0',R*0.01*k);});}
      line([top[0]-o[0]*R*0.052*k,top[1]-o[1]*R*0.052*k],[top[0]+o[0]*R*0.052*k,top[1]+o[1]*R*0.052*k],'#c9d0de',R*0.013*k);}});}
  // station: platform + accent canopy on the back side of the start of the outbound lane
  const i0=Math.round(0.03/4.156*N),i1=Math.round(0.25/4.156*N),b=L.lt,g0=L.g[i0],g1=L.g[i1],pf=(g,off,up)=>[g[0]+b[0]*off,g[1]+b[1]*off-up];
  items.push({k:g0[1]-Rk*0.02,f:()=>{poly([pf(g0,Rk*0.045,Rk*0.022),pf(g1,Rk*0.045,Rk*0.022),pf(g1,Rk*0.15,Rk*0.022),pf(g0,Rk*0.15,Rk*0.022)],'#e2e8f0','#94a3b8',Rk*0.007);poly([pf(g0,Rk*0.045,Rk*0.022),pf(g1,Rk*0.045,Rk*0.022),pf(g1,Rk*0.045,0),pf(g0,Rk*0.045,0)],'#94a3b8');}});
  items.push({k:g1[1]+Rk*0.1,f:()=>{[0.15,0.06].forEach(off=>[g0,g1].forEach(g=>line(pf(g,R*off,Rk*0.022),pf(g,R*off,Rk*0.115),'#eef1f7',Rk*0.009)));
    poly([pf(g0,Rk*0.04,Rk*0.115),pf(g1,Rk*0.04,Rk*0.115),pf(g1,Rk*0.165,Rk*0.115),pf(g0,Rk*0.165,Rk*0.115)],shade(accent,0.12),shade(accent,-0.3),Rk*0.007);
    line(pf(g0,Rk*0.165,Rk*0.115),pf(g1,Rk*0.165,Rk*0.115),shade(accent,-0.4),Rk*0.014);line(pf(g0,Rk*0.04,Rk*0.115),pf(g1,Rk*0.04,Rk*0.115),shade(accent,-0.4),Rk*0.014);}});
  // two static trains: one in the station, one on the lift
  const car=(i,lead)=>{const p=P(i),pn=P(i+2),pp=P(i-2);let tx=pn[0]-pp[0],ty=pn[1]-pp[1];const m=Math.hypot(tx,ty)||1;tx/=m;ty/=m;const o=L.o[(i+N)%N],c=[p[0],p[1]-Rk*0.014],lx=Rk*0.034,wy=Rk*0.022;
    const q=(a,bb,dz)=>[c[0]+tx*a+o[0]*bb,c[1]+ty*a+o[1]*bb+dz];items.push({k:L.g[(i+N)%N][1]+L.z[(i+N)%N]*0.05+0.01,f:()=>{
      poly([q(-lx,wy,0),q(lx,wy,0),q(lx,wy,Rk*0.014),q(-lx,wy,Rk*0.014)],'#bfc7d6');poly([q(-lx,-wy,0),q(lx,-wy,0),q(lx,wy,0),q(-lx,wy,0)],'#f4f6fb');
      poly([q(-lx,-wy,0),q(-lx*0.4,-wy,0),q(-lx*0.4,wy,0),q(-lx,wy,0)],'#2a3144');poly([q(lx*0.35,-wy,0),q(lx,-wy,0),q(lx,wy,0),q(lx*0.35,wy,0)],lead?accent:shade(accent,0.25));
      [-0.45,0.45].forEach(d=>{const h=q(-lx*0.1,d*wy,-Rk*0.024);ctx.fillStyle='#fde4c8';ctx.beginPath();ctx.arc(h[0],h[1],Rk*0.013,0,7);ctx.fill();ctx.fillStyle=['#3b82f6','#ef4444','#22c55e','#f59e0b'][(i+(d>0?1:0))%4];ctx.fillRect(h[0]-Rk*0.01,h[1]+Rk*0.011,Rk*0.02,Rk*0.014);});
      line(q(lx*0.25,-wy*0.9,-Rk*0.008),q(lx*0.25,wy*0.9,-Rk*0.008),'#2a3144',Rk*0.005);}});};
  const sp=Math.round(Rk*0.072/L.ds);[0.255,0.575].forEach(Dh=>{const ih=Math.round(Dh/4.156*N);for(let k=0;k<6;k++)car(ih-k*sp,k===0);});
  items.sort((a,b)=>a.k-b.k).forEach(it=>it.f());ctx.restore();
}
function hyperSprite(R,mode,dir,accent,scale){
  hyperSprite._c=hyperSprite._c||{};const sc=scale||getBakeScale(),key=[mode,dir,Math.round(R*sc),R,accent,sc].join('|');if(hyperSprite._c[key])return hyperSprite._c[key];
  const side=mode==='side',W=Math.ceil((side?3.5:2.5)*R),H=Math.ceil((side?2.0:2.9)*R),oy=(side?1.35:1.9)*R,cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);
  const g=cv.getContext('2d');g.scale(sc,sc);g.save();g.translate(W/2,oy);if(dir==='NE-SW')g.scale(-1,1);hyDraw(g,0,0,R,{accent:accent,flip:dir==='NE-SW'},mode);g.restore();
  return hyperSprite._c[key]={canvas:cv,ox:W/2,oy:oy,w:W,h:H};
}
function drawHyperSide(ctx,cx,cy,R,o){o=o||{};const s=hyperSprite(R,'side','NW-SE',o.accent||'#f8fafc');ctx.drawImage(s.canvas,cx-s.ox,cy-s.oy,s.w,s.h);}
function drawHyperDiag(ctx,cx,cy,R,o){o=o||{};const d=o.dir==='NE-SW'?'NE-SW':'NW-SE',s=hyperSprite(R,'diag',d,o.accent||'#f8fafc');ctx.drawImage(s.canvas,cx-s.ox,cy-s.oy,s.w,s.h);}
function hyperFootprint(R,mode,dir){
  const L=hyLayout(R,mode),m=dir==='NE-SW'?-1:1,c=[];for(let i=0;i<L.N;i+=4)c.push({x:L.g[i][0]*m,y:L.g[i][1],r:R*0.115*L.k});
  const i0=Math.round(0.03/4.156*L.N),i1=Math.round(0.25/4.156*L.N),mid=[(L.g[i0][0]+L.g[i1][0])/2+L.lt[0]*R*0.11*L.k,(L.g[i0][1]+L.g[i1][1])/2+L.lt[1]*R*0.11*L.k];c.push({x:mid[0]*m,y:mid[1],r:R*0.15*L.k});
  return{tiles:L.hexes.map(h=>[h[0]*m,h[1]]),circles:c};
}
window.footprintForTile=window.footprintForTile||function(fp,i){const t=fp.tiles[i];return fp.circles.map(c=>({x:c.x-t[0],y:c.y-t[1],r:c.r}));};
/** scenery options for any large ride: no landmarks, nothing wider than ~2 units, ~45% of the normal budget, fewer ground decals.
 *  Use:  placeThemeAssets(pack, tier, R, seed, Object.assign({avoid: footprintForTile(fp,i)}, BIG_RIDE_SCENERY)) */
const BIG_RIDE_SCENERY={maxW:2.0,budgetScale:0.45,decalScale:0.6,noLandmarks:true};
/* ===== END STATIC HYPER ===== */
return Object.freeze({ side: drawHyperSide, diag: drawHyperDiag });
})();

const classicHyperCoasterPack = (() => {

/* ===== THEME PACK CORE (shared by every theme pack; copy once into engine.js) ===== */
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
/* ===== FRONTIER PACK ===== */
const F={wood:'#8a5a33',woodD:'#5a3b22',woodL:'#b07a46',bark:'#6b4a2b',endc:'#d9b27a',pine:'#2f5f3a',pineL:'#3d7348',pineD:'#26503a',water:'#4aa0c8',waterD:'#2f7fa8',rock:'#8a8f96',rockD:'#5f656c',rockL:'#b4b9c0',snow:'#f4f8fc',canvas:'#eadfc4'};
const fsh=(c,x,y,rx,h)=>{c.fillStyle='rgba(12,34,14,.32)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
const logWall=(c,x,y,u,X0,X1,Y,Z0,Z1)=>{let k=0;for(let z=Z0+0.17;z<Z1;z+=0.34,k++){const a=TH.iso(x,y,u,X0,Y,z),b=TH.iso(x,y,u,X1,Y,z);TH.ln(c,a,b,k%2?F.wood:'#7d4f2b',u*0.36);TH.ln(c,[a[0],a[1]-u*0.09],[b[0],b[1]-u*0.09],'rgba(255,225,170,.28)',u*0.08);}};
const logWallE=(c,x,y,u,X,Y0,Y1,Z0,Z1)=>{let k=0;for(let z=Z0+0.17;z<Z1;z+=0.34,k++){const a=TH.iso(x,y,u,X,Y0,z),b=TH.iso(x,y,u,X,Y1,z);TH.ln(c,a,b,k%2?'#6f4524':'#5f3b1f',u*0.36);}};
const logEnds=(c,x,y,u,X,Y,Z0,Z1)=>{for(let z=Z0+0.17;z<Z1;z+=0.34){const p=TH.iso(x,y,u,X,Y,z);TH.ell(c,p[0],p[1],u*0.2,u*0.17,F.endc);TH.ell(c,p[0],p[1],u*0.09,u*0.07,'#b8884f');}};
function frFir(c,x,y,u,s,v){const H=u*6.2*s,tiers=6;fsh(c,x,y,u*1.6*s,H);TH.ln(c,[x,y],[x,y-u*1.2*s],'#4a3320',u*0.5*s);
  for(let k=0;k<tiers;k++){const t=k/(tiers-1),by=y-u*1.0*s-H*0.76*t,w=u*(1.75-1.2*t)*s,h=u*1.5*s;
    TH.poly(c,[[x-w,by+h*0.2],[x-w*0.35,by-h*0.3],[x,by-h*1.15],[x+w*0.35,by-h*0.3],[x+w,by+h*0.2],[x,by+h*0.55]],k%2?F.pine:F.pineL);
    TH.poly(c,[[x,by-h*1.15],[x+w*0.35,by-h*0.3],[x+w,by+h*0.2],[x+w*0.3,by+h*0.35]],'rgba(8,30,18,.4)');}}
const fcrag=(c,x,y,u,o)=>{const wt=o.wt,wb=o.wb,H=o.H,r=mulberry(o.seed),n=o.bands.length;TH.ell(c,x,y,wb*1.1,wb*0.47,'#6f7a62');c.save();c.beginPath();c.moveTo(x-wt,y-H);c.lineTo(x-wb,y);c.ellipse(x,y,wb,wb*0.42,0,Math.PI,0,true);c.lineTo(x+wt,y-H);c.ellipse(x,y-H,wt,wt*0.42,0,0,Math.PI);c.closePath();c.clip();
  const Hh=H+wb*0.42;for(let j=0;j<n;j++){c.fillStyle=o.bands[j];c.fillRect(x-wb-2,y-H+Hh*j/n,wb*2+4,Hh/n+1);}
  const g=c.createLinearGradient(x-wb,0,x+wb,0);g.addColorStop(0,'rgba(255,255,255,.22)');g.addColorStop(0.45,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,15,25,.5)');c.fillStyle=g;c.fillRect(x-wb-2,y-H-2,wb*2+4,Hh+4);
  for(let k=0;k<8;k++){const fx=x+(r()*2-1)*wt*0.9,bx=x+(fx-x)*wb/wt;c.strokeStyle='rgba(20,28,36,.3)';c.lineWidth=u*0.07;c.beginPath();c.moveTo(fx,y-H+wt*0.25);c.quadraticCurveTo((fx+bx)/2+u*0.12,y-H/2,bx,y+wb*0.3);c.stroke();}
  c.restore();TH.ell(c,x,y-H,wt,wt*0.42,o.top||'#6f8a5a');};
const FRONTIER_PACK={id:'frontier',name:'Frontier',ground:'#7d955d',groundDark:'#6b8350',border:'#566e42',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},
         3:{budget:11,decals:4,landmark:0.75,pool:['lookoutTower','waterfallCliff','mountainPeak']},
         4:{budget:15,decals:5,landmark:1,pool:['stockadeFort','sawmill','mountainPeak','waterfallCliff','lookoutTower'],second:0.45}},
  assets:{
  /* ---------- ground decals ---------- */
  riverBend:{cat:'decal',w:3.2,tier:1,weight:4,cost:0,draw(c,x,y,u,v,tm){const r=mulberry(v+3),f=v%2?-1:1,t=tm||0;const path=()=>{c.beginPath();c.moveTo(x-u*3.2,y-u*0.5*f);c.bezierCurveTo(x-u*1.6,y+u*0.7*f,x-u*0.1,y-u*0.9*f,x+u*3.2,y+u*0.5*f);};
    c.lineCap='round';path();c.strokeStyle='#6b5a3a';c.lineWidth=u*1.55;c.stroke();path();c.strokeStyle='#2f7fa8';c.lineWidth=u*1.2;c.stroke();path();c.strokeStyle='#4aa0c8';c.lineWidth=u*0.9;c.stroke();
    c.setLineDash([u*0.35,u*0.55]);c.lineDashOffset=-t*u*1.5;path();c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=u*0.08;c.stroke();c.setLineDash([]);
    for(let k=0;k<9;k++){const s=r(),b=(1-s)**3*(x-u*3.2)+3*(1-s)**2*s*(x-u*1.6)+3*(1-s)*s*s*(x-u*0.1)+s**3*(x+u*3.2),yy=(1-s)**3*(y-u*0.5*f)+3*(1-s)**2*s*(y+u*0.7*f)+3*(1-s)*s*s*(y-u*0.9*f)+s**3*(y+u*0.5*f);TH.ell(c,b,yy+(k%2?1:-1)*u*0.8,u*0.2,u*0.12,['#8a8f96','#a5a9ad','#6f747a'][k%3]);}}},
  pebbleBar:{cat:'decal',w:2.0,tier:1,weight:3,cost:0,draw(c,x,y,u,v){const r=mulberry(v+5);TH.ell(c,x,y,u*2.0,u*0.9,'#b9b4a2');for(let k=0;k<28;k++){const a=r()*6.283,rr=Math.sqrt(r());TH.ell(c,x+Math.cos(a)*u*1.8*rr,y+Math.sin(a)*u*0.8*rr,u*0.14,u*0.09,['#8a8f96','#a8a290','#c9c3b0','#6f747a'][k%4]);}}},
  pineNeedles:{cat:'decal',w:2.2,tier:1,weight:3.5,cost:0,draw(c,x,y,u,v){const r=mulberry(v+8);TH.ell(c,x,y,u*2.2,u*0.95,'#6b4f32');TH.ell(c,x-u*0.2,y-u*0.05,u*1.7,u*0.7,'#7b5c3a');for(let k=0;k<34;k++){const a=r()*6.283,rr=Math.sqrt(r()),px=x+Math.cos(a)*u*2.0*rr,py=y+Math.sin(a)*u*0.85*rr;TH.ln(c,[px,py],[px+u*0.28,py-u*0.1],k%3?'#4a3320':'#8a6a45',u*0.04);}}},
  wildMeadow:{cat:'decal',w:2.2,tier:1,weight:3.5,cost:0,draw(c,x,y,u,v){const r=mulberry(v+9);for(let k=0;k<30;k++){const a=r()*6.283,rr=Math.sqrt(r()),px=x+Math.cos(a)*u*2.0*rr,py=y+Math.sin(a)*u*0.9*rr;TH.ln(c,[px,py],[px+(r()-0.5)*u*0.2,py-u*(0.3+r()*0.3)],'#4a7a3c',u*0.05);if(k%3===0)TH.ell(c,px,py-u*0.5,u*0.09,u*0.12,['#8a5ad0','#f2d24a','#f8fafc','#d884e0'][k%4]);}}},
  /* ---------- trees and plants ---------- */
  pineTree:{cat:'tree',w:1.8,tier:2,weight:3.5,cost:2,max:2,draw(c,x,y,u,v){frFir(c,x,y,u,1.3+(v%3)*0.12,v);}},
  firGrove:{cat:'tree',w:2.3,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v){[[-1.1,0.2,0.8],[1.0,0.3,0.92],[0.0,-0.5,0.7]].sort((a,b)=>a[1]-b[1]).forEach(([dx,dy,s])=>frFir(c,x+dx*u,y+dy*u,u,s,v));}},
  aspenTree:{cat:'tree',w:1.7,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*5+2),H=u*(4.2+r()*0.8),t=tm||0;fsh(c,x,y,u*1.8,u*6);TH.ln(c,[x,y],[x+u*0.1,y-H],'#d8d3c2',u*0.5);TH.ln(c,[x+u*0.12,y],[x+u*0.2,y-H],'rgba(60,50,40,.25)',u*0.2);
    for(let k=0;k<9;k++){const ky=y-u*(0.4+k*0.45);TH.ln(c,[x-u*0.18,ky],[x+u*0.05,ky-u*0.05],'#3a3228',u*0.06);}
    const cols=['#c9b43a','#b2c040','#9ab838','#d6c046'];[[0,-0.9,1.9,1.5],[-1.2,0.1,1.4,1.1],[1.2,0.0,1.4,1.1],[0.1,0.1,1.7,1.2],[-0.5,-1.9,1.2,0.95]].forEach(([dx,dy,rx,ry],i)=>{const sw=Math.sin(t*1.4+i)*u*0.06;TH.blob(c,x+dx*u+sw,y-H+dy*u,u*rx,u*ry,cols[i%4],r,9);});}},
  berryBush:{cat:'plant',w:1.4,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*3+6);fsh(c,x,y,u*1.4,u);[[-0.7,-0.5,0.85,'#3f7a45'],[0.7,-0.5,0.8,'#4a8a4c'],[0,-0.95,0.95,'#559858'],[-0.1,-0.45,0.85,'#437f48']].forEach(([dx,dy,s,col])=>TH.blob(c,x+dx*u,y+dy*u,u*s,u*s*0.72,col,r,9));
    for(let k=0;k<9;k++)TH.ell(c,x+(r()-0.5)*u*1.8,y-u*(0.3+r()*1.0),u*0.1,u*0.1,['#3a5ad0','#d9342b','#5a3ad0'][k%3]);}},
  fernPatch:{cat:'plant',w:1.5,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*5+2),t=tm||0;fsh(c,x,y,u*1.5,u*1.5);for(let k=0;k<8;k++){const a=-3.1+k*0.48,l=u*(1.5+r()*0.7),sw=Math.sin(t*1.2+k)*u*0.05,ex=x+Math.cos(a)*l+sw,ey=y-Math.abs(Math.sin(a))*l*0.8-u*0.15;
      c.strokeStyle=k%2?'#2f6a3a':'#3a7a44';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(ex-x)*0.45,y-l*0.85,ex,ey);c.stroke();
      for(let q=1;q<7;q++){const f=q/7,px=x+(ex-x)*f*0.92,py=y+(ey-y)*f-Math.sin(f*3.0)*l*0.3;TH.ln(c,[px,py],[px-u*0.26,py+u*0.18],'#4a8e4e',u*0.05);TH.ln(c,[px,py],[px+u*0.26,py+u*0.18],'#4a8e4e',u*0.05);}}}},
  cattails:{cat:'plant',w:1.4,tier:1,weight:3,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*4+3),t=tm||0;TH.ell(c,x,y+u*0.1,u*1.6,u*0.6,'#3f8fb5');TH.ell(c,x-u*0.2,y,u*1.2,u*0.4,'#56a8cc');
    for(let k=0;k<8;k++){const bx=x+(k-3.5)*u*0.3,h=u*(2.4+r()*1.3),sw=Math.sin(t*1.3+k)*u*0.06;TH.ln(c,[bx,y],[bx+sw,y-h],'#5a8a3a',u*0.1);TH.ln(c,[bx,y-h*0.3],[bx-u*0.5+sw,y-h*0.95],'#4a7a32',u*0.06);if(k%2===0){TH.ell(c,bx+sw,y-h*0.82,u*0.13,u*0.38,'#6b4a2b');TH.ln(c,[bx+sw,y-h*0.6],[bx+sw,y-h*1.15],'#8a6a45',u*0.04);}}}},
  fallenLog:{cat:'plant',w:2.4,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+2);fsh(c,x,y,u*2.4,u*1.5);const a=I(-2.2,0,0.5),b=I(2.2,0,0.5);TH.ln(c,a,b,'#4a3320',u*1.2);TH.ln(c,a,b,F.bark,u*1.0);TH.ln(c,[a[0],a[1]-u*0.3],[b[0],b[1]-u*0.3],F.woodL,u*0.2);
    for(let k=0;k<7;k++){const p=I(-1.8+k*0.6,0,0.5);TH.ln(c,[p[0],p[1]-u*0.45],[p[0]+u*0.2,p[1]+u*0.4],'rgba(40,24,10,.35)',u*0.05);}TH.ell(c,b[0],b[1],u*0.5,u*0.62,F.endc);[0.16,0.3,0.44].forEach(s=>{c.strokeStyle='rgba(120,80,40,.5)';c.lineWidth=u*0.04;c.beginPath();c.ellipse(b[0],b[1],u*s*1.1,u*s*1.3,0,0,7);c.stroke();});
    TH.ln(c,I(0.5,0,0.8),I(1.2,-0.6,1.7),F.bark,u*0.16);TH.blob(c,...I(-1.0,0.1,1.1),u*0.7,u*0.2,'rgba(95,138,71,.95)',r,7);for(let k=0;k<3;k++){const p=I(-0.4+k*0.35,0.5,0.75);TH.ln(c,[p[0],p[1]],[p[0],p[1]-u*0.35],'#e8e0cc',u*0.06);TH.ell(c,p[0],p[1]-u*0.4,u*0.16,u*0.1,'#c9663a');}}},
  boulders:{cat:'rock',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*13+3);fsh(c,x,y,u*1.9,u*1.4);[[0.0,0.0,1.0,1.0,'#80858d'],[-1.0,0.2,0.65,0.6,'#6f747c'],[0.9,0.25,0.6,0.55,'#8f949b']].forEach(([dx,dy,sx,sy,col])=>TH.blob(c,x+dx*u,y-u*0.55*sy+dy*u,u*0.9*sx,u*0.75*sy,col,r,9));
    for(let k=0;k<4;k++)TH.ell(c,x+(r()-0.5)*u*1.4,y-u*(0.2+r()*0.7),u*0.2,u*0.1,k%2?'rgba(150,170,90,.8)':'rgba(95,138,71,.7)');}},
  /* ---------- props ---------- */
  campfire:{cat:'prop',w:1.7,tier:1,weight:3,cost:1,max:1,draw(c,x,y,u,v,tm){const t=tm||0;fsh(c,x,y,u*1.8,u*2);TH.ell(c,x,y+u*0.1,u*1.2,u*0.5,'#4a3a2a');for(let k=0;k<9;k++){const a=k/9*6.283;TH.ell(c,x+Math.cos(a)*u*0.95,y+u*0.1+Math.sin(a)*u*0.42,u*0.28,u*0.18,['#8a8f96','#6f747a'][k%2]);}
    TH.ln(c,[x-u*0.7,y+u*0.1],[x+u*0.6,y-u*0.3],'#4a3320',u*0.24);TH.ln(c,[x+u*0.7,y+u*0.15],[x-u*0.5,y-u*0.3],'#5a4028',u*0.24);
    [[-1.9,0.4],[1.9,0.5]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u-u*0.5,y+dy*u],[x+dx*u+u*0.5,y+dy*u-u*0.1],'#6b4a2b',u*0.5);TH.ell(c,x+dx*u+u*0.5,y+dy*u-u*0.1,u*0.22,u*0.25,F.endc);});
    [[-1.4,0.1],[1.4,0.1],[0,-0.7]].forEach(([dx,dy])=>TH.ln(c,[x+dx*u,y+dy*u+u*0.2],[x+dx*u*0.2,y-u*2.4],'#3b3f4a',u*0.09));TH.ell(c,x,y-u*1.4,u*0.45,u*0.34,'#2b2f3a');
    const g=c.createRadialGradient(x,y-u*0.6,0,x,y-u*0.6,u*2.6);g.addColorStop(0,'rgba(255,170,60,'+(0.45+0.1*Math.sin(t*9))+')');g.addColorStop(1,'rgba(255,170,60,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*0.6,u*2.6,0,7);c.fill();
    [[0,1.0,0.9],[-0.35,0.75,0.6],[0.35,0.8,0.65]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*11+i*2+v)*u*0.12;TH.poly(c,[[x+dx*u-u*0.38*w,y-u*0.05],[x+dx*u+f,y-u*(0.1+h*1.2)],[x+dx*u+u*0.38*w,y-u*0.05]],i?'#fbbf24':'#f97316');});
    for(let k=0;k<3;k++){const ph=(t*0.6+k*0.33)%1;c.fillStyle='rgba(120,120,126,'+(0.35*(1-ph))+')';c.beginPath();c.ellipse(x+Math.sin(ph*5+k)*u*0.3,y-u*(2.3+ph*2.2),u*(0.22+ph*0.45),u*(0.18+ph*0.35),0,0,7);c.fill();}}},
  canoe:{cat:'prop',w:2.5,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.7,u*1.5);const N=16,top=[];for(let k=0;k<=N;k++){const X=-2.6+5.2*k/N,q=Math.abs(X)/2.6;top.push([X,0.62*Math.pow(Math.max(0,1-q*q),0.55),0.28+0.95*Math.pow(q,3)]);}
    TH.poly(c,top.map(p=>I(p[0],-p[1],p[2])).concat(top.slice().reverse().map(p=>I(p[0],p[1],p[2]))),'#2f2012');
    TH.poly(c,top.map(p=>I(p[0],p[1],p[2])).concat(top.slice().reverse().map(p=>I(p[0],p[1]*0.35,0.03+p[2]*0.12))),'#c98f4a');
    for(let k=1;k<N;k+=2){const p=top[k];TH.ln(c,I(p[0],p[1],p[2]),I(p[0],p[1]*0.35,0.03+p[2]*0.12),'rgba(90,50,20,.35)',u*0.05);}
    c.strokeStyle='#7a4d2b';c.lineWidth=u*0.12;c.lineJoin='round';c.beginPath();top.forEach((p,i)=>{const q=I(p[0],p[1],p[2]);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.stroke();
    [-0.8,0.9].forEach(X=>TH.ln(c,I(X,-0.55,0.5),I(X,0.55,0.5),'#8a5a33',u*0.12));TH.ln(c,I(1.5,1.3,0),I(1.9,1.0,2.4),F.woodL,u*0.1);TH.ell(c,...I(1.95,0.98,2.7),u*0.14,u*0.3,F.woodL,-0.3);}},
  fishRack:{cat:'prop',w:2.2,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+4);fsh(c,x,y,u*2.3,u*3);[-1.9,1.9].forEach(X=>{TH.ln(c,I(X,-0.7,0),I(X,0,2.6),F.bark,u*0.18);TH.ln(c,I(X,0.7,0),I(X,0,2.6),F.bark,u*0.18);});
    TH.ln(c,I(-2.1,0,2.5),I(2.1,0,2.5),F.woodD,u*0.16);TH.ln(c,I(-1.9,0,1.5),I(1.9,0,1.5),F.woodD,u*0.12);
    for(let k=0;k<10;k++){const X=-1.7+k*0.38,L=0.5+r()*0.5,top=I(X,0,2.5),bot=[top[0],top[1]+u*L*1.2];TH.ln(c,top,bot,'#c9b98a',u*0.04);TH.ell(c,bot[0],bot[1]+u*0.28,u*0.12,u*0.34,'#b8c4cc');TH.poly(c,[[bot[0]-u*0.1,bot[1]+u*0.55],[bot[0]+u*0.1,bot[1]+u*0.55],[bot[0],bot[1]+u*0.4]],'#98a4ac');TH.ell(c,bot[0]+u*0.02,bot[1]+u*0.16,u*0.025,u*0.025,'#222');}
    for(let k=0;k<5;k++){const p=I(-1.5+k*0.75,0,1.5);TH.poly(c,[[p[0]-u*0.12,p[1]],[p[0]+u*0.12,p[1]],[p[0]+u*0.08,p[1]+u*0.9],[p[0]-u*0.08,p[1]+u*0.9]],'#b86a4a');}}},
  firewood:{cat:'prop',w:1.7,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+5);fsh(c,x,y,u*1.8,u*1.6);[-1.5,1.5].forEach(X=>TH.ln(c,I(X,0.5,0),I(X,0.5,1.6),F.woodD,u*0.18));
    TH.box(c,x,y,u,-1.4,1.4,-0.5,0.5,0,1.5,'#9a6a3c','#6f4a28','#b8884f');for(let row=0;row<4;row++)for(let col=0;col<7;col++){const p=I(-1.2+col*0.4+(row%2)*0.2,0.51,0.18+row*0.36);TH.ell(c,p[0],p[1],u*0.17,u*0.16,F.endc);TH.ell(c,p[0],p[1],u*0.07,u*0.06,'#a8783f');}
    TH.poly(c,[I(-1.6,0.8,1.5),I(1.6,0.8,1.5),I(1.6,-0.6,1.7),I(-1.6,-0.6,1.7)],'#5a3b22');TH.ell(c,x+u*2.0,y+u*0.3,u*0.35,u*0.28,F.endc);TH.ln(c,[x+u*2.0,y+u*0.3],[x+u*2.5,y-u*0.4],F.woodL,u*0.14);TH.poly(c,[[x+u*2.35,y-u*0.45],[x+u*2.75,y-u*0.55],[x+u*2.6,y-u*0.2]],'#9aa0a8');}},
  railFence:{cat:'prop',w:2.6,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.7,u);for(let seg=-2;seg<=1;seg++){const sx=seg*1.25,s=seg%2?1:-1;for(let lvl=0;lvl<4;lvl++){const z=0.25+lvl*0.4,k=(lvl+seg)%2?1:-1;TH.ln(c,I(sx,0.35*k*s,z),I(sx+1.45,-0.35*k*s,z+0.03),'#8a6a45',u*0.2);TH.ell(c,...I(sx+1.45,-0.35*k*s,z+0.03),u*0.1,u*0.1,'#c9a56a');}}
    if(v%2)TH.ln(c,I(1.8,0,0.2),I(2.6,0.5,0.9),'#8a6a45',u*0.2);}},
  footbridge:{cat:'prop',w:2.4,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.poly(c,[I(-1.6,-3.0,0),I(1.6,-3.0,0),I(1.6,3.0,0),I(-1.6,3.0,0)],'#6b5a3a');TH.poly(c,[I(-1.2,-3.0,0.02),I(1.2,-3.0,0.02),I(1.2,3.0,0.02),I(-1.2,3.0,0.02)],F.waterD);TH.poly(c,[I(-0.9,-3.0,0.04),I(0.9,-3.0,0.04),I(0.9,3.0,0.04),I(-0.9,3.0,0.04)],F.water);
    fsh(c,x,y,u*2.2,u*1.5);const deck=Y=>{const z=0.55+0.35*(1-Math.pow(Y/2.6,2));return z;};[-2.6,2.6].forEach(Y=>TH.ln(c,I(-0.7,Y,0),I(-0.7,Y,0.65),F.woodD,u*0.3));
    const pts=[];for(let k=0;k<=12;k++){const Y=-2.6+5.2*k/12;pts.push([Y,deck(Y)]);}TH.poly(c,pts.map(p=>I(-0.75,p[0],p[1])).concat(pts.slice().reverse().map(p=>I(0.75,p[0],p[1]))),'#a97d49');for(let k=1;k<12;k++){TH.ln(c,I(-0.75,pts[k][0],pts[k][1]),I(0.75,pts[k][0],pts[k][1]),'rgba(60,35,10,.4)',u*0.05);}
    [-0.8,0.8].forEach(X=>{c.strokeStyle=F.woodD;c.lineWidth=u*0.12;c.beginPath();pts.forEach((p,i)=>{const q=I(X,p[0],p[1]+0.8);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.stroke();for(let k=0;k<=12;k+=3)TH.ln(c,I(X,pts[k][0],pts[k][1]),I(X,pts[k][0],pts[k][1]+0.8),F.woodD,u*0.1);});}},
  trapperTent:{cat:'prop',w:2.4,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.5,u*3);TH.poly(c,[I(2.2,-1.5,0),I(2.2,1.5,0),I(2.2,0,2.6)],'#d6c7a4');TH.poly(c,[I(2.2,-0.6,0),I(2.2,0.6,0),I(2.2,0.05,1.7)],'#241c14');TH.poly(c,[I(2.2,-0.6,0),I(2.2,0.05,1.7),I(2.2,-0.2,0.0)],'#f0e6c8');
    TH.poly(c,[I(-2.2,1.5,0),I(2.2,1.5,0),I(2.2,0,2.6),I(-2.2,0,2.6)],F.canvas);TH.poly(c,[I(-2.2,0.4,0.9),I(2.2,0.4,0.9),I(2.2,0,2.6),I(-2.2,0,2.6)],'rgba(140,110,60,.18)');for(let k=1;k<5;k++)TH.ln(c,I(-2.2+k*0.9,1.5,0),I(-2.2+k*0.9,0,2.6),'rgba(110,85,50,.35)',u*0.04);TH.ln(c,I(-2.2,0,2.6),I(2.2,0,2.6),F.woodD,u*0.18);
    [-2.6,2.6].forEach(X=>TH.ln(c,I(X,0,2.8),I(X,0,0),F.bark,u*0.14));[[-2.6,2.2],[2.6,2.2],[-1,2.2]].forEach(([X,Y])=>{TH.ln(c,I(X*0.8,1.2,1.0),I(X,Y,0),'rgba(230,220,190,.7)',u*0.04);TH.ln(c,I(X,Y,0),I(X,Y,0.3),F.woodD,u*0.1);});
    TH.ell(c,...I(1.0,2.0,0.3),u*0.3,u*0.2,'#7a5a3a');TH.ell(c,...I(1.0,2.0,0.55),u*0.2,u*0.14,'#e0d6b8');TH.ln(c,I(2.8,1.6,0),I(2.8,1.6,1.5),F.bark,u*0.12);TH.ell(c,...I(2.8,1.6,1.6),u*0.18,u*0.22,'#fbbf24');}},
  bear:{cat:'prop',w:1.7,tier:2,weight:2,cost:1,max:1,draw(c,x,y,u,v,tm){const dk='#4a2f1e',md='#6b4630',lt='#8a6a4a';fsh(c,x,y,u*1.9,u*2.2);[[-0.6,-0.1],[1.1,-0.05]].forEach(([dx,dy])=>{TH.poly(c,[[x+dx*u-u*0.3,y-u*0.9],[x+dx*u+u*0.3,y-u*0.9],[x+dx*u+u*0.26,y+dy*u],[x+dx*u-u*0.26,y+dy*u]],'#3b2516');});
    TH.ell(c,x,y-u*1.4,u*1.75,u*0.95,md);TH.ell(c,x-u*0.55,y-u*1.95,u*0.85,u*0.6,md);TH.ell(c,x+u*0.1,y-u*1.0,u*1.4,u*0.5,'rgba(0,0,0,.2)');
    [[-1.0,0.3],[0.8,0.35]].forEach(([dx,dy])=>{TH.poly(c,[[x+dx*u-u*0.34,y-u*0.95],[x+dx*u+u*0.34,y-u*0.95],[x+dx*u+u*0.3,y+dy*u],[x+dx*u-u*0.3,y+dy*u]],dk);TH.ell(c,x+dx*u,y+dy*u,u*0.42,u*0.14,'#2f2015');for(let k=-1;k<=1;k++)TH.ln(c,[x+dx*u+k*u*0.15+u*0.2,y+dy*u+u*0.05],[x+dx*u+k*u*0.15+u*0.32,y+dy*u+u*0.1],'#e8e0cc',u*0.04);});
    const hy=y-u*1.55+Math.sin((tm||0)*1.2+v)*u*0.05;TH.ell(c,x+u*1.65,hy,u*0.62,u*0.56,md);TH.ell(c,x+u*2.1,hy+u*0.15,u*0.4,u*0.3,lt);TH.ell(c,x+u*2.38,hy+u*0.06,u*0.12,u*0.1,'#1a1410');TH.ell(c,x+u*1.4,hy-u*0.5,u*0.17,u*0.17,md);TH.ell(c,x+u*1.85,hy-u*0.42,u*0.15,u*0.15,dk);TH.ell(c,x+u*1.85,hy-u*0.1,u*0.06,u*0.06,'#111');
    if(v%2){TH.ell(c,x+u*2.35,hy+u*0.42,u*0.55,u*0.12,'#e0746a',-0.35);TH.poly(c,[[x+u*2.8,hy+u*0.3],[x+u*3.0,hy+u*0.1],[x+u*3.0,hy+u*0.5]],'#c9564a');}}},
  deer:{cat:'prop',w:1.5,tier:1,weight:2.5,cost:1,max:1,draw(c,x,y,u,v,tm){const tn='#b88a56',dk='#8a6238';fsh(c,x,y,u*1.7,u*2.5);[[-0.8,0.05],[0.9,0.05]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u+u*0.15,y-u*1.4],[x+dx*u+u*0.1,y+dy*u],dk,u*0.16);});
    TH.ell(c,x,y-u*1.65,u*1.25,u*0.55,tn);TH.ell(c,x-u*0.2,y-u*1.4,u*0.9,u*0.25,'#e6d6b4');[[-0.95,0.05],[0.65,0.1]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u,y-u*1.4],[x+dx*u-u*0.04,y+dy*u],tn,u*0.18);TH.ell(c,x+dx*u-u*0.04,y+dy*u,u*0.14,u*0.07,'#2b1f14');});
    TH.ln(c,[x+u*1.0,y-u*1.8],[x+u*1.5,y-u*3.0],tn,u*0.4);const hy=y-u*3.15+Math.sin((tm||0)*1.5+v)*u*0.04;TH.ell(c,x+u*1.65,hy,u*0.38,u*0.3,tn,0.3);TH.ell(c,x+u*2.0,hy+u*0.1,u*0.2,u*0.14,'#d9c4a0');TH.ell(c,x+u*2.15,hy+u*0.08,u*0.06,u*0.05,'#111');TH.ell(c,x+u*1.62,hy-u*0.35,u*0.1,u*0.2,tn,-0.3);
    c.strokeStyle='#6b4a2b';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x+u*1.6,hy-u*0.25);c.lineTo(x+u*1.3,hy-u*0.85);c.moveTo(x+u*1.45,hy-u*0.55);c.lineTo(x+u*1.1,hy-u*0.55);c.moveTo(x+u*1.35,hy-u*0.75);c.lineTo(x+u*1.65,hy-u*1.1);c.stroke();TH.poly(c,[[x-u*1.25,y-u*1.8],[x-u*1.6,y-u*1.95],[x-u*1.3,y-u*1.55]],'#f1ece0');}},
  beaverDam:{cat:'prop',w:2.4,tier:2,weight:2,cost:1,max:1,draw(c,x,y,u,v,tm){const r=mulberry(v+3),t=tm||0;TH.ell(c,x,y,u*2.6,u*1.1,'#6b5a3a');TH.ell(c,x,y,u*2.4,u*0.98,F.waterD);TH.ell(c,x-u*0.2,y-u*0.05,u*1.9,u*0.74,F.water);c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=u*0.05;const ph=(t*0.35)%1;c.beginPath();c.ellipse(x-u*1.0,y+u*0.2,u*(0.2+ph*0.6),u*(0.1+ph*0.26),0,0,7);c.stroke();
    for(let k=0;k<22;k++){const px=x+u*(1.0+(r()-0.5)*0.4)+k*0.0,py=y+u*(-0.9+k*0.085),L=u*(0.9+r()*0.6);TH.ln(c,[px-L*0.5,py+(r()-0.5)*u*0.1],[px+L*0.5,py+(r()-0.5)*u*0.1-u*0.05],['#6b4a2b','#8a6238','#5a3b22'][k%3],u*0.14);}
    c.beginPath();c.moveTo(x-u*1.9,y-u*0.1);c.quadraticCurveTo(x-u*1.6,y-u*2.2,x-u*0.5,y-u*2.0);c.quadraticCurveTo(x+u*0.3,y-u*1.4,x+u*0.4,y-u*0.1);c.closePath();c.fillStyle='#7a5a38';c.fill();
    for(let k=0;k<26;k++){const a=r()*6.283,rr=Math.sqrt(r());const px=x-u*0.75+Math.cos(a)*u*1.0*rr,py=y-u*0.9+Math.sin(a)*u*0.75*rr;TH.ln(c,[px,py],[px+(r()-0.5)*u*0.9,py+(r()-0.5)*u*0.4],['#5a3b22','#9a7a4a','#6b4a2b'][k%3],u*0.07);}
    TH.ell(c,x-u*0.7,y+u*0.35,u*0.25,u*0.14,'#4a3320');TH.ell(c,x-u*0.45,y+u*0.34,u*0.1,u*0.09,'#4a3320');TH.ell(c,x-u*1.0,y+u*0.42,u*0.2,u*0.07,'#3a2a1a');}},
  logCabin:{cat:'structure',w:2.8,tier:3,weight:3,cost:2,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0;fsh(c,x,y,u*3.2,u*4);
    TH.box(c,x,y,u,-2.2,2.2,-1.6,1.6,0,2.3,'#8a5a33','#6f4524','#a97d49');logWall(c,x,y,u,-2.2,2.2,1.61,0,2.3);logWallE(c,x,y,u,2.21,-1.6,1.6,0,2.3);logEnds(c,x,y,u,-2.2,1.61,0,2.3);logEnds(c,x,y,u,2.2,1.61,0,2.3);
    TH.poly(c,[I(-0.45,1.64,0),I(0.45,1.64,0),I(0.45,1.64,1.6),I(-0.45,1.64,1.6)],'#4a2f1c','#2b1b0e',u*0.05);TH.ell(c,...I(0.3,1.65,0.8),u*0.05,u*0.05,'#e0b53a');
    TH.poly(c,[I(1.0,1.64,0.9),I(1.8,1.64,0.9),I(1.8,1.64,1.7),I(1.0,1.64,1.7)],'#9bd0e8','#4a2f1c',u*0.07);TH.ln(c,I(1.4,1.65,0.9),I(1.4,1.65,1.7),'#4a2f1c',u*0.05);[[0.78,1.0],[2.02,1.8]].forEach(([X,x2])=>TH.poly(c,[I(X,1.65,0.9),I(X+(X<1?0.22:-0.22),1.65,0.9),I(X+(X<1?0.22:-0.22),1.65,1.7),I(X,1.65,1.7)],'#5a3b22'));
    TH.poly(c,[I(2.2,-1.6,2.3),I(2.2,1.6,2.3),I(2.2,0,3.9)],'#7a4d2b');for(let k=0;k<5;k++)TH.ln(c,I(2.21,-1.5+k*0.75,2.3),I(2.21,-0.7+k*0.4+(k%2)*0.0,3.4),'rgba(40,24,10,.0)',1);
    TH.poly(c,[I(-2.7,2.0,2.2),I(2.7,2.0,2.2),I(2.7,0,4.0),I(-2.7,0,4.0)],'#7a5a3a');for(let k=1;k<7;k++){TH.ln(c,I(-2.7,2.0-k*0.285,2.2+k*0.257),I(2.7,2.0-k*0.285,2.2+k*0.257),'rgba(40,24,10,.45)',u*0.06);}TH.ln(c,I(-2.7,2.0,2.2),I(2.7,2.0,2.2),'#4a3320',u*0.14);TH.ln(c,I(-2.7,0,4.0),I(2.7,0,4.0),'#9a7a4a',u*0.14);
    TH.box(c,x,y,u,-1.7,-1.0,-1.1,-0.5,2.0,4.8,'#9aa0a8','#6f747c','#c3c8cf');for(let k=0;k<4;k++){const ph=(t*0.5+k*0.25)%1,tp=I(-1.35,-0.8,4.8);c.fillStyle='rgba(200,200,205,'+(0.5*(1-ph))+')';c.beginPath();c.ellipse(tp[0]+Math.sin(ph*4+k)*u*0.3+ph*u*0.6,tp[1]-ph*u*3.0-u*0.2,u*(0.25+ph*0.5),u*(0.2+ph*0.4),0,0,7);c.fill();}
    TH.box(c,x,y,u,-2.0,2.0,1.7,2.5,0,0.2,'#a97d49','#7d5a34','#c49858');[-1.9,1.9].forEach(X=>TH.ln(c,I(X,2.4,0.2),I(X,2.4,2.1),F.bark,u*0.18));}},
  /* ---------- landmarks ---------- */
  lookoutTower:{cat:'landmark',w:2.3,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.4,u*9);const H=9.0;
    const legs=[[-1.9,-1.4],[1.9,-1.4],[-1.9,1.4],[1.9,1.4]],top=(X,Y)=>[X*0.55,Y*0.55];legs.slice(0,2).forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(top(X,Y)[0],top(X,Y)[1],H),F.woodD,u*0.3));
    for(let k=1;k<5;k++){const f=k/5,z=H*f,s=1-0.45*f;TH.ln(c,I(-1.9*s,1.4*s,z),I(1.9*s,1.4*s,z),F.woodD,u*0.14);TH.ln(c,I(1.9*s,-1.4*s,z),I(1.9*s,1.4*s,z),F.woodD,u*0.14);}
    for(let k=0;k<4;k++){const f0=k/5,f1=(k+1)/5,s0=1-0.45*f0,s1=1-0.45*f1;TH.ln(c,I(-1.9*s0,1.4*s0,H*f0),I(1.9*s1,1.4*s1,H*f1),F.wood,u*0.1);TH.ln(c,I(1.9*s0,1.4*s0,H*f0),I(-1.9*s1,1.4*s1,H*f1),F.wood,u*0.1);}
    legs.slice(2).forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(top(X,Y)[0],top(X,Y)[1],H),F.wood,u*0.34));
    for(let k=0;k<7;k++){const f=k/7;TH.ln(c,I(-1.2+f*0.2,1.5,H*f),I(-0.6+f*0.2,1.5,H*(f+0.15)),'#c9a56a',u*0.08);}
    const cs=1.5;TH.box(c,x,y,u,-cs-0.3,cs+0.3,-cs-0.3,cs+0.3,H,H+0.25,'#a97d49','#7d5a34','#c49858');TH.box(c,x,y,u,-cs,cs,-cs,cs,H+0.25,H+1.8,'#b88a56','#8a6238','#d6a86a');
    [[-1.1,-0.2],[0.2,1.1]].forEach(([a,b])=>TH.poly(c,[I(a,cs+0.01,H+0.7),I(b,cs+0.01,H+0.7),I(b,cs+0.01,H+1.5),I(a,cs+0.01,H+1.5)],'#9bd0e8','#4a2f1c',u*0.05));TH.poly(c,[I(cs+0.01,-1.1,H+0.7),I(cs+0.01,1.1,H+0.7),I(cs+0.01,1.1,H+1.5),I(cs+0.01,-1.1,H+1.5)],'#9bd0e8','#4a2f1c',u*0.05);
    const ap=I(0,0,H+3.3);TH.poly(c,[I(-cs-0.4,cs+0.4,H+1.8),I(cs+0.4,cs+0.4,H+1.8),ap],'#5a3b22');TH.poly(c,[I(cs+0.4,-cs-0.4,H+1.8),I(cs+0.4,cs+0.4,H+1.8),ap],'#3f2815');TH.ln(c,ap,[ap[0],ap[1]-u*1.0],'#d5dae6',u*0.08);
    TH.poly(c,[[ap[0],ap[1]-u*1.0],[ap[0]+u*1.1,ap[1]-u*0.8+Math.sin((tm||0)*3)*u*0.1],[ap[0],ap[1]-u*0.5]],'#d9342b');}},
  waterfallCliff:{cat:'landmark',w:3.2,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const r=mulberry(v+4),t=tm||0,H=u*6.0,wt=u*2.7,wb=u*3.4;fsh(c,x,y,u*3.4,u*7);
    fcrag(c,x,y,u,{wt:wt,wb:wb,H:H,seed:v+2,bands:['#8a8f96','#7a7f87','#9a9fa6','#6f747c','#858a92','#7a7f87'],top:'#6f8a5a'});
    const fx=x-u*0.3,top=y-H+wt*0.42*0.9,bot=y+wb*0.42*0.9;c.save();c.beginPath();c.moveTo(fx-u*0.55,top);c.lineTo(fx+u*0.55,top);c.lineTo(fx+u*0.8,bot);c.lineTo(fx-u*0.8,bot);c.closePath();const g=c.createLinearGradient(fx,top,fx,bot);g.addColorStop(0,'#eaf6ff');g.addColorStop(1,'#bfe3f5');c.fillStyle=g;c.fill();c.clip();
    for(let k=0;k<7;k++){const ph=(t*1.4+k*0.31)%1;c.strokeStyle='rgba(255,255,255,'+(0.35+0.3*(1-ph))+')';c.lineWidth=u*0.06;const sx=fx-u*0.45+k*u*0.15;c.beginPath();c.moveTo(sx,top+(bot-top)*ph*0.7);c.lineTo(sx+(k-3)*u*0.02,top+(bot-top)*(ph*0.7+0.3));c.stroke();}c.restore();
    TH.ell(c,fx,bot+u*0.35,u*2.2,u*0.8,'#2f7fa8');TH.ell(c,fx,bot+u*0.3,u*1.9,u*0.66,'#4aa0c8');for(let k=0;k<7;k++){const ph=(t*0.9+k*0.2)%1;c.fillStyle='rgba(255,255,255,'+(0.55*(1-ph))+')';c.beginPath();c.ellipse(fx+(r()-0.5)*u*1.4,bot+u*0.2+ph*u*0.2,u*(0.3+ph*0.4),u*(0.14+ph*0.18),0,0,7);c.fill();}
    for(let k=0;k<4;k++){const ph=(t*0.5+k*0.25)%1;c.fillStyle='rgba(235,245,250,'+(0.3*(1-ph))+')';c.beginPath();c.ellipse(fx+(k-1.5)*u*0.5,bot-ph*u*1.6,u*(0.5+ph*0.6),u*(0.3+ph*0.4),0,0,7);c.fill();}
    [[-1.5,0.1],[0.6,-0.1],[1.4,0.2]].forEach(([dx,dy],i)=>frFir(c,x+dx*u,y-H+dy*u+wt*0.1,u*0.55,0.7+i*0.05,v+i));for(let k=0;k<5;k++)TH.blob(c,x+(r()-0.5)*wb*2.1,y+wb*0.25+r()*u*0.5,u*(0.35+r()*0.3),u*0.2,'#6f747c',r,7);}},
  mountainPeak:{cat:'landmark',w:4.0,tier:3,weight:3,cost:4,draw(c,x,y,u,v){const r=mulberry(v+6);fsh(c,x,y,u*4.2,u*10);const peak=(px,base,hw,H,snowF)=>{const ap=[px,base-H],L=[px-hw,base],Rr=[px+hw,base],M=[px+hw*0.08,base+hw*0.16];
      TH.poly(c,[L,ap,M],'#8e949c');TH.poly(c,[M,ap,Rr],'#575d68');c.strokeStyle='rgba(25,32,44,.35)';c.lineWidth=u*0.07;c.beginPath();c.moveTo(ap[0],ap[1]);c.lineTo(px-hw*0.4,base-H*0.3);c.moveTo(ap[0],ap[1]);c.lineTo(px+hw*0.25,base-H*0.15);c.moveTo(px-hw*0.25,base-H*0.62);c.lineTo(px-hw*0.55,base-H*0.4);c.stroke();
      const sy=base-H*(1-snowF);const sw=(f)=>hw*(1-f);TH.poly(c,[ap,[px-hw*snowF*1.0,sy],[px-hw*snowF*0.6,sy+H*0.07],[px-hw*snowF*0.3,sy-H*0.02],[px+hw*0.05,sy+H*0.09],[px+hw*snowF*0.4,sy+H*0.02],[px+hw*snowF*0.8,sy+H*0.08],[px+hw*snowF*1.0,sy]],'#f4f8fc');
      TH.poly(c,[ap,[px+hw*0.08,sy+H*0.09],[px+hw*snowF*0.4,sy+H*0.02],[px+hw*snowF*0.8,sy+H*0.08],[px+hw*snowF*1.0,sy]],'#c9d6e4');};
    peak(x+u*3.0,y,u*3.0,u*6.5,0.4);peak(x-u*0.5,y,u*4.6,u*10,0.38);
    TH.ell(c,x,y,u*5.2,u*1.6,'#566e42');[[-4.2,0.5,1.5],[3.8,0.6,1.3],[-2.0,0.9,1.0],[1.6,1.0,1.1]].forEach(([dx,dy,s])=>TH.blob(c,x+dx*u,y+dy*u,u*s*1.4,u*s*0.6,'#4a6e48',r,8));[[-3.4,0.8],[-2.6,1.1],[2.7,0.9],[3.5,0.7],[0.4,1.2]].forEach(([dx,dy],i)=>frFir(c,x+dx*u,y+dy*u,u*0.5,0.8+(i%2)*0.15,v+i));}},
  sawmill:{cat:'landmark',w:3.7,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0,r=mulberry(v+3);fsh(c,x,y,u*3.8,u*6);
    TH.poly(c,[I(2.4,-2.6,0.12),I(5.2,-2.6,0.12),I(5.2,2.4,0.12),I(2.4,2.4,0.12)],'#3f7a9a');TH.poly(c,[I(2.7,-2.4,0.14),I(5.0,-2.4,0.14),I(5.0,2.2,0.14),I(2.7,2.2,0.14)],'#4aa0c8');
    TH.box(c,x,y,u,-3.0,2.4,-2.0,2.0,0,3.0,'#9a6a3c','#6f4a28','#b07a46');logWall(c,x,y,u,-3.0,2.4,2.01,0,3.0);logWallE(c,x,y,u,2.41,-2.0,2.0,0,3.0);
    TH.poly(c,[I(-2.2,2.03,0),I(0.2,2.03,0),I(0.2,2.03,2.2),I(-2.2,2.03,2.2)],'#1c130c');for(let k=0;k<3;k++)TH.ln(c,I(-2.0+k*0.9,2.04,0.4),I(-1.8+k*0.9,2.04,2.0),'rgba(200,200,205,.2)',u*0.05);
    TH.ln(c,I(-2.2,2.2,0.4),I(0.2,2.2,0.4),'#5a5f68',u*0.12);TH.box(c,x,y,u,-1.8,-0.2,2.1,2.6,0.4,0.8,'#7a7f87','#555a62','#9aa0a8');TH.ell(c,...I(-1.0,2.3,1.3),u*0.65,u*0.7,'#c9ced6');TH.ell(c,...I(-1.0,2.3,1.3),u*0.12,u*0.12,'#555a62');
    TH.poly(c,[I(-3.4,2.4,2.9),I(2.8,2.4,2.9),I(2.8,0,5.0),I(-3.4,0,5.0)],'#6b4a2b');for(let k=1;k<6;k++)TH.ln(c,I(-3.4,2.4-k*0.4,2.9+k*0.35),I(2.8,2.4-k*0.4,2.9+k*0.35),'rgba(30,18,6,.45)',u*0.06);TH.poly(c,[I(2.4,-2.0,3.0),I(2.4,2.0,3.0),I(2.4,0,4.9)],'#8a5a33');
    const wc=[2.9,0,2.6],R0=2.3,a0=t*0.8;const pt=(a,rr)=>I(wc[0],rr*Math.cos(a),wc[2]+rr*Math.sin(a));c.strokeStyle='#4a3320';c.lineWidth=u*0.3;c.beginPath();for(let k=0;k<=32;k++){const p=pt(k/32*6.283,R0);k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();c.strokeStyle='#8a5a33';c.lineWidth=u*0.16;c.stroke();
    for(let k=0;k<8;k++){const a=a0+k*0.7854;TH.ln(c,pt(a,0),pt(a,R0),'#6b4a2b',u*0.16);const p=pt(a,R0),q=pt(a+0.22,R0+0.45);TH.poly(c,[p,q,pt(a+0.46,R0)],'#a97d49','#4a3320',u*0.04);}TH.ell(c,...pt(0,0),u*0.28,u*0.28,'#2b1b0e');
    for(let k=0;k<3;k++){const ph=(t*0.7+k*0.33)%1;TH.ln(c,I(3.9+ph*0.6,-2.3+ph*0.4,5.2-ph*3.3),I(4.3+ph*0.6,-2.0+ph*0.4,5.0-ph*3.3),'rgba(235,248,255,.6)',u*0.1);}TH.poly(c,[I(3.5,-2.6,5.2),I(4.6,-2.6,5.2),I(4.6,-1.6,3.4),I(3.5,-1.6,3.4)],'rgba(160,110,60,.5)');
    for(let row=0;row<3;row++)for(let col=0;col<4-row;col++)TH.ln(c,I(-3.4+col*0.62+row*0.3,3.0-row*0.1,0.3+row*0.5),I(-1.9+col*0.62+row*0.3,3.0-row*0.1,0.3+row*0.5),['#9a6a3c','#8a5a33'][(row+col)%2],u*0.46);}},
  stockadeFort:{cat:'landmark',w:4.5,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0,S=3.6,wh=3.4;fsh(c,x,y,u*4.8,u*6);TH.poly(c,[I(-S,-S,0.03),I(S,-S,0.03),I(S,S,0.03),I(-S,S,0.03)],'#a98b62');
    const wallY=(Y,x0,x1,col)=>{for(let X=x0;X<=x1;X+=0.36){const b=I(X,Y,0),tp=I(X,Y,wh);TH.ln(c,b,tp,col,u*0.3);TH.poly(c,[[tp[0]-u*0.17,tp[1]],[tp[0]+u*0.17,tp[1]],[tp[0],tp[1]-u*0.45]],col);}};
    const wallX=(X,y0,y1,col)=>{for(let Y=y0;Y<=y1;Y+=0.36){const b=I(X,Y,0),tp=I(X,Y,wh);TH.ln(c,b,tp,col,u*0.3);TH.poly(c,[[tp[0]-u*0.17,tp[1]],[tp[0]+u*0.17,tp[1]],[tp[0],tp[1]-u*0.45]],col);}};
    const tower=(X,Y,col)=>{TH.box(c,x,y,u,X-0.8,X+0.8,Y-0.8,Y+0.8,0,4.6,'#9a6a3c','#6f4a28','#b07a46');logWall(c,x,y,u,X-0.8,X+0.8,Y+0.81,0,4.6);logWallE(c,x,y,u,X+0.81,Y-0.8,Y+0.8,0,4.6);TH.box(c,x,y,u,X-1.0,X+1.0,Y-1.0,Y+1.0,4.6,4.9,'#a97d49','#7d5a34','#c49858');const ap=I(X,Y,6.4);TH.poly(c,[I(X-1.1,Y+1.1,4.9),I(X+1.1,Y+1.1,4.9),ap],'#5a3b22');TH.poly(c,[I(X+1.1,Y-1.1,4.9),I(X+1.1,Y+1.1,4.9),ap],'#3f2815');TH.poly(c,[I(X-0.3,Y+0.82,3.4),I(X+0.3,Y+0.82,3.4),I(X+0.3,Y+0.82,4.2),I(X-0.3,Y+0.82,4.2)],'#161a22');};
    wallY(-S,-S,S,'#7d5a34');wallX(-S,-S,S,'#6f4a28');tower(-S,-S);
    TH.box(c,x,y,u,-2.3,-0.6,-2.2,-0.6,0,1.7,'#9a6a3c','#6f4a28','#b07a46');TH.poly(c,[I(-2.5,-0.4,1.6),I(-0.4,-0.4,1.6),I(-0.4,-1.4,2.8),I(-2.5,-1.4,2.8)],'#5a3b22');TH.poly(c,[I(-0.4,-2.4,1.6),I(-0.4,-0.4,1.6),I(-0.4,-1.4,2.8)],'#7a5a3a');
    TH.box(c,x,y,u,0.6,2.2,-2.3,-0.9,0,1.5,'#9a6a3c','#6f4a28','#b07a46');TH.poly(c,[I(0.4,-0.7,1.4),I(2.4,-0.7,1.4),I(2.4,-1.6,2.5),I(0.4,-1.6,2.5)],'#6b4a2b');
    const fp=I(0.6,0.2,0);TH.ln(c,fp,[fp[0],fp[1]-u*6.2],'#d5dae6',u*0.1);const wv=Math.sin(t*3)*u*0.12;TH.poly(c,[[fp[0],fp[1]-u*6.2],[fp[0]+u*1.6,fp[1]-u*6.0+wv],[fp[0]+u*1.2,fp[1]-u*5.6+wv*1.3],[fp[0]+u*1.6,fp[1]-u*5.2+wv],[fp[0],fp[1]-u*5.3]],'#2f4f8f');
    tower(S,-S);wallX(S,-S,S,'#7d5a34');tower(-S,S);
    wallY(S,-S,-1.0,'#8a6238');wallY(S,1.0,S,'#8a6238');TH.poly(c,[I(-1.0,S+0.01,0),I(1.0,S+0.01,0),I(1.0,S+0.01,2.8),I(-1.0,S+0.01,2.8)],'#140f0a');[-1,1].forEach(s=>{TH.poly(c,[I(s*1.0,S+0.02,0),I(s*0.45,S+0.5,0),I(s*0.45,S+0.5,2.7),I(s*1.0,S+0.02,2.7)],'#6b4a2b','#3b2616',u*0.05);});TH.ln(c,I(-1.0,S+0.05,2.9),I(1.0,S+0.05,2.9),F.woodD,u*0.3);
    tower(S,S);const f1=I(S,S,6.4);TH.ln(c,f1,[f1[0],f1[1]-u*1.2],'#d5dae6',u*0.08);TH.poly(c,[[f1[0],f1[1]-u*1.2],[f1[0]+u*1.1,f1[1]-u*1.0+Math.sin(t*3+1)*u*0.1],[f1[0],f1[1]-u*0.7]],'#b3342f');}}
  }};
const FRONTIER_HEIGHT={berryBush:'low',fernPatch:'low',cattails:'low',fallenLog:'low',boulders:'low',campfire:'low',canoe:'low',fishRack:'low',firewood:'low',railFence:'low',footbridge:'low',beaverDam:'low',deer:'low',
  pineTree:'mid',firGrove:'mid',aspenTree:'mid',trapperTent:'mid',bear:'mid',logCabin:'mid',lookoutTower:'tall',waterfallCliff:'tall',mountainPeak:'tall',sawmill:'tall',stockadeFort:'tall'};
Object.keys(FRONTIER_PACK.assets).forEach(id=>{FRONTIER_PACK.assets[id].h=FRONTIER_HEIGHT[id]||'low';});
/* ===== JUNGLE PACK ===== */
const J={st:'#bdb9a0',stD:'#8e8a72',stL:'#dad7c3',moss:'#5f8a47',mossD:'#3f6a38',jade:'#2fbf9a',ochre:'#b5532f',turq:'#1fb5a8',dark:'#10161a',clay:'#c4683a'};
const jbox=(c,x,y,u,x0,x1,y0,y1,z0,z1,k)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,k?shade(J.st,k):J.st,k?shade(J.stD,k):J.stD,k?shade(J.stL,k):J.stL);
const jsh=(c,x,y,rx,h)=>{c.fillStyle='rgba(8,26,10,.36)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
const jmoss=(c,x,y,u,r,n)=>{for(let k=0;k<(n||3);k++)TH.ell(c,x+(r()-0.5)*u*1.6,y-r()*u*0.3,u*(0.22+r()*0.25),u*0.11,k%2?'rgba(95,138,71,.85)':'rgba(63,106,56,.85)');};
const jglow=(c,x,y,r,rgb,a)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba('+rgb+','+a+')');g.addColorStop(1,'rgba('+rgb+',0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();};
const glyphs=(c,x,y,u,X0,X1,Y,Z0,Z1,r)=>{for(let z=Z0;z<Z1-0.2;z+=0.42)for(let X=X0;X<X1-0.2;X+=0.5){if(r()<0.25)continue;const a=TH.iso(x,y,u,X+0.05,Y,z),b=TH.iso(x,y,u,X+0.05+0.12+r()*0.2,Y,z+(r()<0.5?0:0.12));TH.ln(c,a,b,'rgba(40,38,26,.45)',u*0.07);TH.ln(c,a,TH.iso(x,y,u,X+0.05,Y,z+0.2),'rgba(40,38,26,.4)',u*0.06);}};
const jmask=(c,x,y,u,X,Y,Z,s)=>{const I=(a,b)=>TH.iso(x,y,u,X+a*s,Y,Z+b*s);TH.poly(c,[I(-0.6,-0.6),I(0.6,-0.6),I(0.6,0.6),I(-0.6,0.6)],'rgba(60,56,40,.3)');[-0.3,0.3].forEach(e=>TH.poly(c,[I(e-0.12,0.15),I(e+0.12,0.15),I(e+0.12,0.35),I(e-0.12,0.35)],'rgba(30,30,22,.7)'));TH.ln(c,I(0,0.1),I(0,-0.15),'rgba(30,30,22,.6)',u*0.08);TH.ln(c,I(-0.3,-0.35),I(0.3,-0.35),'rgba(30,30,22,.7)',u*0.1);[-0.2,0.2].forEach(e=>TH.ln(c,I(e,-0.35),I(e,-0.5),'#e8e4d0',u*0.06));};
const JUNGLE_PACK={id:'jungle',name:'Jungle',ground:'#587c48',groundDark:'#456a3a',border:'#35552c',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},
         3:{budget:11,decals:4,landmark:0.75,pool:['templeShrine','corbelArch','ballCourt']},
         4:{budget:15,decals:5,landmark:1,pool:['stepPyramid','templeShrine','corbelArch','ballCourt'],second:0.45}},
  assets:{
  /* ---------- ground decals ---------- */
  leafLitter:{cat:'decal',w:2.2,tier:1,weight:4,cost:0,draw(c,x,y,u,v){const r=mulberry(v+8);TH.ell(c,x,y,u*2.1,u*0.9,'#3f5f36');for(let k=0;k<26;k++){const a=r()*6.283,rr=Math.sqrt(r());TH.ell(c,x+Math.cos(a)*u*1.9*rr,y+Math.sin(a)*u*0.8*rr,u*0.17,u*0.08,['#6a5a2e','#4e7a3a','#8a6a30','#355a2e','#7a4a2a'][k%5],r()*3);}}},
  lilyPond:{cat:'decal',w:2.2,tier:1,weight:2.5,cost:0,draw(c,x,y,u,v,tm){const r=mulberry(v+4),t=tm||0;TH.ell(c,x,y,u*2.2,u*1.0,'#3a5a3a');TH.ell(c,x,y,u*1.95,u*0.86,'#2f7f78');TH.ell(c,x-u*0.2,y-u*0.05,u*1.5,u*0.6,'#3a9a8e');
    c.strokeStyle='rgba(200,245,235,.5)';c.lineWidth=u*0.05;const ph=(t*0.4+v*0.3)%1;c.beginPath();c.ellipse(x+u*0.5,y+u*0.1,u*(0.2+ph*0.7),u*(0.1+ph*0.32),0,0,7);c.stroke();
    for(let k=0;k<5;k++){const px=x+(r()-0.5)*u*2.8,py=y+(r()-0.5)*u*0.9;TH.ell(c,px,py,u*0.36,u*0.18,'#4aa04a');TH.poly(c,[[px,py],[px+u*0.3,py-u*0.05],[px+u*0.3,py+u*0.05]],'#3a7f4a');if(k%2)TH.ell(c,px,py-u*0.05,u*0.1,u*0.07,'#f9a8d4');}}},
  mossyPaving:{cat:'decal',w:2.4,tier:2,weight:3,cost:0,draw(c,x,y,u,v){const I=(X,Y)=>TH.iso(x,y,u,X,Y,0),r=mulberry(v+2);for(let i=-2;i<=1;i++)for(let j=-1;j<=0;j++){if(r()<0.2)continue;const ox=r()*0.1,oy=r()*0.1;TH.poly(c,[I(i*1.1+ox,j*1.1+oy),I(i*1.1+1.0+ox,j*1.1+oy),I(i*1.1+1.0+ox,j*1.1+1.0+oy),I(i*1.1+ox,j*1.1+1.0+oy)],['#a9a58c','#9a967e','#b4b098'][(i+j+3)%3],'rgba(30,40,25,.5)',u*0.05);}
    for(let k=0;k<8;k++){const p=I(-2.2+r()*4.2,-1+r()*2);TH.ell(c,p[0],p[1],u*(0.2+r()*0.3),u*0.12,'rgba(70,120,55,.8)');}}},
  rootCrawl:{cat:'decal',w:2.2,tier:2,weight:2,cost:0,draw(c,x,y,u,v){const r=mulberry(v+6);for(let k=0;k<7;k++){const a=-2.8+k*0.9+(r()-0.5)*0.4,l=u*(1.2+r()*1.2);c.strokeStyle='#4a3a28';c.lineWidth=u*(0.22-k*0.012);c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+Math.cos(a)*l*0.5,y+Math.sin(a)*l*0.25-u*0.2,x+Math.cos(a)*l,y+Math.sin(a)*l*0.4);c.stroke();}
    TH.ell(c,x,y,u*0.4,u*0.22,'#3a2e20');}},
  /* ---------- jungle flora ---------- */
  fernCluster:{cat:'flora',w:1.6,tier:1,weight:4,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*5+2),t=tm||0;jsh(c,x,y,u*1.6,u*1.5);
    for(let k=0;k<9;k++){const a=-3.1+k*0.42,l=u*(1.7+r()*0.8),sw=Math.sin(t*1.3+k)*u*0.06,ex=x+Math.cos(a)*l+sw,ey=y-Math.abs(Math.sin(a))*l*0.9-u*0.2;c.strokeStyle=k%2?'#3f8f45':'#4aa14e';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(ex-x)*0.45,y-l*0.95,ex,ey);c.stroke();
      for(let q=1;q<8;q++){const f=q/8,px=x+(ex-x)*f*0.9,py=y+(ey-y)*f-Math.sin(f*3.0)*l*0.35;TH.ln(c,[px,py],[px+(f<0.9?-u*0.28:0),py+u*0.2],'#58b85a',u*0.06);TH.ln(c,[px,py],[px+u*0.28,py+u*0.2],'#58b85a',u*0.06);}}}},
  elephantEar:{cat:'flora',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v,tm){const t=tm||0;jsh(c,x,y,u*1.6,u*2.5);[[-0.9,-1.5,0.5,'#2f7f3f'],[0.8,-1.8,-0.4,'#3a8f48'],[0.0,-2.4,0.05,'#4aa356']].forEach(([dx,dy,rot,col],i)=>{const sw=Math.sin(t*1.2+i)*u*0.05;TH.ln(c,[x+dx*u*0.3,y],[x+dx*u+sw,y+dy*u*0.55],'#2a6a34',u*0.12);
      c.save();c.translate(x+dx*u+sw,y+dy*u);c.rotate(rot);c.fillStyle=col;c.beginPath();c.moveTo(0,u*0.9);c.bezierCurveTo(-u*1.4,u*0.3,-u*1.0,-u*1.1,0,-u*1.0);c.bezierCurveTo(u*1.0,-u*1.1,u*1.4,u*0.3,0,u*0.9);c.fill();c.strokeStyle='rgba(20,70,30,.55)';c.lineWidth=u*0.06;c.beginPath();c.moveTo(0,u*0.9);c.lineTo(0,-u*0.9);for(let k=-2;k<=2;k++){if(k){c.moveTo(0,u*0.1);c.lineTo(k*u*0.4,-u*0.5);}}c.stroke();c.restore();});}},
  heliconia:{cat:'flora',w:1.3,tier:1,weight:3,cost:1,draw(c,x,y,u,v){const r=mulberry(v*3+7);jsh(c,x,y,u*1.3,u*2.5);for(let k=0;k<4;k++){const bx=x+(k-1.5)*u*0.45,h=u*(2.0+r()*1.2);TH.ln(c,[bx,y],[bx+(r()-0.5)*u*0.3,y-h],'#2f7a3a',u*0.1);
      TH.poly(c,[[bx-u*0.5,y-h*0.3],[bx-u*0.05,y-h*0.55],[bx-u*0.1,y-h*0.2]],'#3a8f48');const cx=bx+(k%2?0.1:-0.1)*u;for(let q=0;q<4;q++){const py=y-h*(0.7+q*0.1);TH.poly(c,[[cx,py+u*0.3],[cx+(q%2?1:-1)*u*0.55,py+u*0.05],[cx,py-u*0.05],[cx+(q%2?1:-1)*u*0.15,py+u*0.2]],['#e0382b','#f06a2a','#f2b22b','#e0382b'][q],'#8a1d14',u*0.03);}}}},
  bamboo:{cat:'flora',w:1.5,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*11+3),t=tm||0;jsh(c,x,y,u*1.5,u*5);for(let k=0;k<7;k++){const bx=x+(k-3)*u*0.32,h=u*(4.6+r()*1.6),sw=Math.sin(t*1.1+k)*u*0.1+(k-3)*u*0.06,col=['#7aa83a','#8ab944','#6a9a34'][k%3];
      TH.ln(c,[bx,y],[bx+sw,y-h],'#4a6a24',u*0.28);TH.ln(c,[bx,y],[bx+sw,y-h],col,u*0.2);for(let q=1;q<7;q++){const f=q/7;TH.ln(c,[bx+sw*f-u*0.15,y-h*f],[bx+sw*f+u*0.15,y-h*f],'#4a6a24',u*0.06);}
      for(let q=0;q<3;q++){const f=0.7+q*0.1;TH.poly(c,[[bx+sw*f,y-h*f],[bx+sw*f+(q%2?1:-1)*u*1.1,y-h*f-u*0.15],[bx+sw*f+(q%2?1:-1)*u*0.3,y-h*f+u*0.12]],'#9acd4a','#5a8a28',u*0.03);}}}},
  palmTree:{cat:'tree',w:1.8,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*9+4),t=tm||0,H=u*(6.4+r()*1.4),lean=(r()-0.5)*u*2.0;jsh(c,x,y,u*2.0,H);
    c.strokeStyle='#6a5236';c.lineWidth=u*0.55;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*0.2,y-H*0.5,x+lean,y-H);c.stroke();c.strokeStyle='#8a6e4a';c.lineWidth=u*0.3;c.stroke();
    for(let k=1;k<12;k++){const f=k/12,px=(1-f)*(1-f)*x+2*(1-f)*f*(x+lean*0.2)+f*f*(x+lean),py=(1-f)*(1-f)*y+2*(1-f)*f*(y-H*0.5)+f*f*(y-H);TH.ln(c,[px-u*0.25,py],[px+u*0.25,py],'rgba(50,34,18,.5)',u*0.06);}
    const tx=x+lean,ty=y-H;for(let k=0;k<9;k++){const a=-3.1+k*0.52,sw=Math.sin(t*1.5+k*0.8)*0.08,l=u*(2.6+(k%2)*0.5);const ex=tx+Math.cos(a+sw)*l,ey=ty+Math.sin(a+sw)*l*0.5+u*0.8;
      c.strokeStyle=k%2?'#2f7f3a':'#3f9a48';c.lineWidth=u*0.18;c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+(ex-tx)*0.55,ty-u*1.2-Math.abs(Math.sin(a))*u*0.6,ex,ey);c.stroke();
      for(let q=1;q<7;q++){const f=q/7,px=tx+(ex-tx)*f,py=ty+(ey-ty)*f-Math.sin(f*3.14)*u*1.0;TH.ln(c,[px,py],[px-(ey-ty)*0.12-u*0.1,py+u*0.5],'#48a852',u*0.07);TH.ln(c,[px,py],[px+(ey-ty)*0.1+u*0.1,py+u*0.5],'#48a852',u*0.07);}}
    [[-0.25,0.35],[0.25,0.4],[0,0.6]].forEach(([dx,dy])=>TH.ell(c,tx+dx*u,ty+dy*u,u*0.28,u*0.28,'#6a4a22'));}},
  kapokTree:{cat:'tree',w:2.6,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v,tm){const r=mulberry(v*7+5),t=tm||0,H=u*5.2;jsh(c,x,y,u*3.0,u*9);
    for(let k=0;k<5;k++){const a=-2.7+k*0.55,l=u*(1.5+r()*0.7);TH.poly(c,[[x+Math.cos(a)*u*0.2,y-u*2.4],[x+Math.cos(a)*l,y+Math.sin(a)*l*0.28+u*0.1],[x+Math.cos(a)*l*0.5+u*0.3,y+Math.sin(a)*l*0.15+u*0.2],[x+u*0.1,y-u*2.8]],k%2?'#6b5a48':'#7a6853');}
    TH.poly(c,[[x-u*0.7,y-u*0.2],[x-u*0.5,y-H],[x+u*0.5,y-H],[x+u*0.7,y-u*0.2]],'#8a7a66');TH.poly(c,[[x+u*0.1,y-H],[x+u*0.5,y-H],[x+u*0.7,y-u*0.2],[x+u*0.15,y-u*0.2]],'rgba(30,24,16,.35)');
    const cols=['#2f6a3a','#3a7a44','#2a5e34','#438a4c'];[[0,-2.4,3.0,2.1],[-2.3,-1.1,2.1,1.5],[2.3,-1.2,2.1,1.5],[0.1,-0.7,2.6,1.6],[-1.2,-3.4,1.9,1.4],[1.4,-3.2,1.8,1.3]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H+dy*u,u*rx,u*ry,cols[i%4],r,10));
    for(let k=0;k<7;k++){const vx=x+(r()-0.5)*u*5.0,vy=y-H+u*(0.0+r()*1.0),l=u*(1.8+r()*2.2),sw=Math.sin(t*0.9+k)*u*0.1;c.strokeStyle=k%2?'#3f6a3a':'#4a7a3a';c.lineWidth=u*0.07;c.beginPath();c.moveTo(vx,vy);c.quadraticCurveTo(vx+sw,vy+l*0.5,vx+sw*1.5,vy+l);c.stroke();}}},
  /* ---------- ruin props ---------- */
  mossBoulder:{cat:'rock',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*13+3);jsh(c,x,y,u*1.9,u*1.4);[[0.0,0.0,1.0,1.0,'#7d7f70'],[-1.0,0.2,0.65,0.6,'#6e7062'],[0.9,0.25,0.6,0.55,'#8a8c7c']].forEach(([dx,dy,sx,sy,col])=>TH.blob(c,x+dx*u,y-u*0.55*sy+dy*u,u*0.9*sx,u*0.75*sy,col,r,9));
    for(let k=0;k<5;k++)TH.ell(c,x+(r()-0.5)*u*1.5,y-u*(0.2+r()*0.8),u*0.3,u*0.14,'rgba(88,140,64,.85)');}},
  fallenColumn:{cat:'rock',w:2.4,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+2);jsh(c,x,y,u*2.4,u*2);
    [[-2.0,-0.9,0.7],[0.0,0.1,0.65],[1.7,-0.4,0.6]].forEach(([X,Y,rr],i)=>{const a=I(X-0.7,Y,rr),b=I(X+0.7,Y,rr);TH.ln(c,a,b,J.stD,u*rr*2.1);TH.ln(c,a,b,J.st,u*rr*1.7);TH.ln(c,[a[0],a[1]-u*rr*0.4],[b[0],b[1]-u*rr*0.4],J.stL,u*rr*0.5);TH.ell(c,a[0],a[1],u*rr*0.55,u*rr*0.9,J.stD);TH.ell(c,a[0],a[1],u*rr*0.3,u*rr*0.5,'#6e6a56');for(let k=0;k<3;k++){const p=I(X-0.4+k*0.4,Y,rr);TH.ln(c,[p[0],p[1]-u*rr*0.9],[p[0],p[1]+u*rr*0.9],'rgba(50,48,34,.3)',u*0.05);}});
    TH.ell(c,x-u*0.9,y-u*0.5,u*0.8,u*0.2,'rgba(80,130,60,.8)');TH.ell(c,x+u*1.6,y-u*0.35,u*0.6,u*0.16,'rgba(70,120,55,.8)');}},
  stela:{cat:'ruin',w:1.3,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+5);jsh(c,x,y,u*1.3,u*4);jbox(c,x,y,u,-0.9,0.9,-0.5,0.5,0,0.4,-0.1);
    TH.poly(c,[I(0.7,-0.2,0.4),I(0.7,0.2,0.4),I(0.7,0.2,4.0),I(0.7,-0.2,4.0)],J.stD);TH.poly(c,[I(-0.7,-0.2,4.0),I(0.7,-0.2,4.0),I(0.7,0.2,4.0),I(-0.7,0.2,4.0)],J.stL);TH.poly(c,[I(-0.7,0.2,0.4),I(0.7,0.2,0.4),I(0.7,0.2,4.0),I(-0.7,0.2,4.0)],J.st);
    jmask(c,x,y,u,0,0.21,3.0,0.9);glyphs(c,x,y,u,-0.6,0.6,0.21,0.7,2.2,r);jmoss(c,x-u*0.3,y+u*0.2,u,r,3);}},
  glyphBlock:{cat:'ruin',w:1.3,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v+3);jsh(c,x,y,u*1.4,u*2);jbox(c,x,y,u,-1.0,1.0,-0.8,0.8,0,1.6);jmask(c,x,y,u,0,0.81,0.85,0.9);jbox(c,x,y,u,-0.6,0.5,-0.5,0.4,1.6,2.1,-0.05);jmask(c,x,y,u,-0.05,0.41,1.85,0.4);jmoss(c,x,y+u*0.3,u,r,4);}},
  chacMool:{cat:'ruin',w:1.7,tier:3,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+8);jsh(c,x,y,u*1.8,u*2);jbox(c,x,y,u,-1.6,1.6,-0.9,0.9,0,0.6,-0.08);
    jbox(c,x,y,u,-1.0,1.1,-0.5,0.5,0.6,1.3);TH.poly(c,[I(-1.2,-0.4,0.6),I(-1.0,-0.4,0.6),I(-1.0,-0.4,1.1),I(-1.2,-0.4,1.1)],J.st);jbox(c,x,y,u,1.0,1.6,-0.3,0.6,0.9,1.5,0.05);TH.ell(c,...I(1.3,0.15,1.7),u*0.3,u*0.3,J.stL);
    TH.ell(c,...I(0.0,0.0,1.35),u*0.45,u*0.22,'#6e6a56');TH.ell(c,...I(0.0,0.0,1.38),u*0.34,u*0.16,'#2b2a22');[[-0.6,0.45],[-0.6,-0.45]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0.9),I(0.1,Y*0.4,1.25),J.st,u*0.22));jmoss(c,x,y+u*0.3,u,r,4);}},
  jaguarStatue:{cat:'ruin',w:1.5,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const r=mulberry(v+4);jsh(c,x,y,u*1.6,u*2);jbox(c,x,y,u,-1.3,1.3,-0.8,0.8,0,0.7,-0.06);const by=y-u*0.7;
    TH.poly(c,[[x-u*1.1,by],[x-u*1.0,by-u*0.9],[x-u*0.3,by-u*1.2],[x+u*0.5,by-u*1.0],[x+u*0.9,by-u*0.3],[x+u*1.0,by]],J.st);TH.poly(c,[[x+u*0.5,by-u*1.0],[x+u*0.9,by-u*0.3],[x+u*1.0,by],[x+u*0.2,by]],'rgba(40,40,28,.35)');
    TH.ln(c,[x-u*1.1,by-u*0.4],[x-u*1.5,by-u*0.9],J.st,u*0.22);TH.poly(c,[[x+u*0.2,by-u*1.1],[x+u*0.9,by-u*1.5],[x+u*1.4,by-u*1.3],[x+u*1.5,by-u*0.7],[x+u*0.9,by-u*0.4],[x+u*0.4,by-u*0.5]],J.stL);
    TH.poly(c,[[x+u*0.4,by-u*1.5],[x+u*0.5,by-u*1.9],[x+u*0.8,by-u*1.5]],J.stL);TH.ell(c,x+u*1.0,by-u*1.0,u*0.1,u*0.1,J.jade);for(let k=0;k<5;k++)TH.ell(c,x-u*0.7+k*u*0.3,by-u*(0.5+(k%2)*0.35),u*0.08,u*0.07,'rgba(40,40,28,.5)');jmoss(c,x,y+u*0.2,u,r,3);}},
  serpentHead:{cat:'ruin',w:1.9,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v){const r=mulberry(v+6);jsh(c,x,y,u*2.0,u*3);
    c.strokeStyle=J.stD;c.lineWidth=u*1.2;c.lineCap='round';c.beginPath();c.moveTo(x+u*2.6,y);c.quadraticCurveTo(x+u*2.2,y-u*1.8,x+u*0.9,y-u*1.4);c.stroke();c.strokeStyle=J.st;c.lineWidth=u*0.9;c.stroke();
    for(let k=0;k<5;k++){const f=k/5;TH.ln(c,[x+u*(2.6-f*1.5),y-u*(f*1.6)-u*0.2],[x+u*(2.6-f*1.5)+u*0.25,y-u*(f*1.6)-u*0.1],'rgba(50,48,34,.4)',u*0.07);}
    jbox(c,x,y,u,-1.4,0.9,-0.9,0.9,0,2.2);TH.poly(c,[[x-u*1.3,y-u*1.5],[x-u*0.4,y-u*2.9],[x+u*0.4,y-u*2.9],[x+u*1.3,y-u*1.5]],J.stL);
    jmask(c,x,y,u,-0.25,0.91,1.2,0.9);TH.ell(c,x-u*0.5,y-u*1.8,u*0.2,u*0.2,J.jade);TH.ell(c,x+u*0.15,y-u*1.8,u*0.2,u*0.2,J.jade);
    TH.poly(c,[[x-u*1.1,y-u*0.3],[x+u*0.7,y-u*0.3],[x+u*0.5,y+u*0.5],[x-u*0.9,y+u*0.5]],'#2b2a22');[[-0.9,0.5],[-0.3,0.5],[0.3,0.5]].forEach(([dx,dy])=>TH.poly(c,[[x+dx*u-u*0.15,y+dy*u-u*0.8],[x+dx*u+u*0.15,y+dy*u-u*0.8],[x+dx*u,y+dy*u-u*0.05]],'#f0ecd8'));TH.poly(c,[[x-u*0.2,y+u*0.1],[x+u*0.2,y+u*0.1],[x,y+u*0.9]],'#b3342f');
    for(let k=0;k<5;k++){const a=-0.4-k*0.35;TH.poly(c,[[x-u*0.4+k*u*0.25,y-u*2.9],[x-u*0.7+k*u*0.4,y-u*3.8-(k%2)*u*0.4],[x-u*0.1+k*u*0.3,y-u*2.9]],[J.turq,J.jade,'#e0382b','#f2b22b','#2f8fd0'][k]);}jmoss(c,x,y+u*0.3,u,r,4);}},
  stoneAltar:{cat:'ruin',w:1.6,tier:3,weight:2.5,cost:1,max:1,draw(c,x,y,u,v,tm){const r=mulberry(v+9),t=tm||0;jsh(c,x,y,u*1.7,u*2);jbox(c,x,y,u,-1.4,1.4,-1.0,1.0,0,0.5,-0.08);jbox(c,x,y,u,-1.1,1.1,-0.7,0.7,0.5,1.5);jmask(c,x,y,u,0,0.71,0.95,0.6);
    TH.ell(c,x,y-u*1.65,u*0.8,u*0.34,'#5e5b48');TH.ell(c,x,y-u*1.7,u*0.65,u*0.27,'#2b2a22');jglow(c,x,y-u*2.3,u*2.4,'255,160,60',0.4+0.1*Math.sin(t*9+v));
    [[0,1.1,0.8],[-0.3,0.75,0.55],[0.3,0.8,0.6]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*11+i*2+v)*u*0.1;TH.poly(c,[[x+dx*u-u*0.3*w,y-u*1.7],[x+dx*u+f,y-u*(1.7+h*1.2)],[x+dx*u+u*0.3*w,y-u*1.7]],i?'#fbbf24':'#f97316');});jmoss(c,x,y+u*0.3,u,r,3);}},
  /* ---------- props ---------- */
  torchPost:{cat:'prop',w:0.9,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v,tm){const t=tm||0;jsh(c,x,y,u,u*4);jbox(c,x,y,u,-0.5,0.5,-0.5,0.5,0,0.5,-0.06);TH.ln(c,[x,y-u*0.4],[x,y-u*2.6],'#6b5a3e',u*0.34);TH.ln(c,[x,y-u*1.2],[x,y-u*1.6],J.turq,u*0.4);
    TH.poly(c,[[x-u*0.5,y-u*2.5],[x+u*0.5,y-u*2.5],[x+u*0.35,y-u*3.0],[x-u*0.35,y-u*3.0]],'#4a3d2a');jglow(c,x,y-u*3.5,u*2.4,'255,160,60',0.4+0.1*Math.sin(t*10+v));
    [[0,1.1,0.8],[-0.25,0.75,0.55],[0.25,0.8,0.6]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*12+i*2+v)*u*0.1;TH.poly(c,[[x+dx*u-u*0.3*w,y-u*3.0],[x+dx*u+f,y-u*(3.0+h*1.2)],[x+dx*u+u*0.3*w,y-u*3.0]],i?'#fbbf24':'#f97316');});}},
  clayPots:{cat:'prop',w:1.4,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u,v){jsh(c,x,y,u*1.5,u*1.5);const pot=(px,py,s,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(px-u*0.45*s,py-u*1.1*s);c.bezierCurveTo(px-u*0.9*s,py-u*0.7*s,px-u*0.7*s,py,px-u*0.3*s,py);c.lineTo(px+u*0.3*s,py);c.bezierCurveTo(px+u*0.7*s,py,px+u*0.9*s,py-u*0.7*s,px+u*0.45*s,py-u*1.1*s);c.closePath();c.fill();
      c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.moveTo(px+u*0.1*s,py-u*1.1*s);c.bezierCurveTo(px+u*0.5*s,py-u*0.9*s,px+u*0.6*s,py-u*0.2*s,px+u*0.3*s,py);c.lineTo(px+u*0.1*s,py);c.fill();TH.ell(c,px,py-u*1.1*s,u*0.45*s,u*0.17*s,'#2a1c12');TH.ln(c,[px-u*0.7*s,py-u*0.55*s],[px+u*0.7*s,py-u*0.55*s],J.turq,u*0.1*s);TH.ln(c,[px-u*0.55*s,py-u*0.3*s],[px+u*0.55*s,py-u*0.3*s],'#f2d24a',u*0.07*s);};
    pot(x-u*0.9,y+u*0.1,0.9,'#c4683a');pot(x+u*0.5,y+u*0.2,1.15,'#b5532f');TH.ell(c,x-u*0.1,y+u*0.5,u*0.55,u*0.2,'#a5502f');TH.ell(c,x-u*0.1,y+u*0.38,u*0.4,u*0.13,'#e8b04a');[[-0.2,0.3],[0.05,0.28]].forEach(([dx,dy],i)=>TH.ell(c,x+dx*u,y+dy*u,u*0.18,u*0.18,['#f06a2a','#f2c230'][i]));}},
  macaw:{cat:'prop',w:0.9,tier:1,weight:3,cost:1,max:1,draw(c,x,y,u,v,tm){const t=tm||0,by=y-u*1.8;jsh(c,x,y,u*0.8,u*3);TH.ln(c,[x,y],[x,y-u*1.7],'#6b5a3e',u*0.2);TH.ln(c,[x-u*0.9,y-u*1.7],[x+u*0.9,y-u*1.7],'#6b5a3e',u*0.16);
    TH.poly(c,[[x-u*0.3,by-u*0.3],[x-u*0.9,by+u*1.1],[x-u*0.55,by+u*1.3],[x-u*0.2,by+u*0.2]],'#2f6fd0');TH.poly(c,[[x-u*0.4,by-u*0.3],[x-u*0.7,by+u*0.9],[x-u*0.5,by+u*1.0],[x-u*0.25,by+u*0.1]],'#e0382b');
    TH.ell(c,x,by-u*0.5,u*0.5,u*0.8,'#d9342b',-0.2);TH.ell(c,x+u*0.15,by-u*0.35,u*0.28,u*0.5,'#f2c230',-0.2);TH.poly(c,[[x-u*0.4,by-u*0.5],[x-u*0.1,by-u*0.9],[x+u*0.15,by-u*0.2]],'#2f6fd0');
    const hb=Math.sin(t*3+v)*u*0.04;TH.ell(c,x+u*0.2,by-u*1.35+hb,u*0.3,u*0.3,'#d9342b');TH.ell(c,x+u*0.3,by-u*1.35+hb,u*0.16,u*0.18,'#f8fafc');TH.ell(c,x+u*0.32,by-u*1.38+hb,u*0.05,u*0.05,'#161616');TH.poly(c,[[x+u*0.45,by-u*1.5+hb],[x+u*0.85,by-u*1.3+hb],[x+u*0.5,by-u*1.15+hb]],'#3a3a3a');TH.poly(c,[[x+u*0.45,by-u*1.5+hb],[x+u*0.8,by-u*1.38+hb],[x+u*0.5,by-u*1.32+hb]],'#f0e8d0');
    TH.ln(c,[x-u*0.1,by+u*0.1],[x-u*0.1,by+u*0.4],'#4a4a4a',u*0.06);TH.ln(c,[x+u*0.2,by+u*0.1],[x+u*0.2,by+u*0.4],'#4a4a4a',u*0.06);}},
  tikiTotem:{cat:'prop',w:1.0,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const r=mulberry(v+2);jsh(c,x,y,u,u*5);TH.ln(c,[x,y],[x,y-u*5.2],'#5a4028',u*1.1);TH.ln(c,[x-u*0.15,y],[x-u*0.15,y-u*5.1],'#7a5836',u*0.35);
    ['#b5532f','#1fb5a8','#e0b53a','#b5532f'].forEach((col,i)=>{const cy=y-u*(0.9+i*1.2);TH.poly(c,[[x-u*0.55,cy-u*0.5],[x+u*0.55,cy-u*0.5],[x+u*0.55,cy+u*0.5],[x-u*0.55,cy+u*0.5]],col,'#2a1c12',u*0.05);[-0.2,0.2].forEach(e=>{TH.ell(c,x+e*u,cy-u*0.1,u*0.13,u*0.13,'#f8fafc');TH.ell(c,x+e*u,cy-u*0.1,u*0.06,u*0.06,'#161616');});TH.ln(c,[x-u*0.25,cy+u*0.22],[x+u*0.25,cy+u*0.22],'#2a1c12',u*0.1);TH.ln(c,[x,cy],[x,cy+u*0.12],'#2a1c12',u*0.07);});
    TH.poly(c,[[x-u*0.4,y-u*5.15],[x,y-u*5.9],[x+u*0.4,y-u*5.15]],'#e0382b');TH.poly(c,[[x-u*1.1,y-u*3.5],[x-u*0.55,y-u*3.9],[x-u*0.55,y-u*3.1]],'#1fb5a8');TH.poly(c,[[x+u*1.1,y-u*3.5],[x+u*0.55,y-u*3.9],[x+u*0.55,y-u*3.1]],'#1fb5a8');}},
  smallShrine:{cat:'structure',w:2.3,tier:3,weight:3,cost:2,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+3);jsh(c,x,y,u*2.6,u*4);jbox(c,x,y,u,-2.2,2.2,-2.0,2.0,0,0.7,-0.06);jbox(c,x,y,u,-1.8,1.8,-1.6,1.6,0.7,1.3,-0.03);
    jbox(c,x,y,u,-1.3,1.3,-1.1,1.1,1.3,3.5);TH.poly(c,[I(-0.5,1.11,1.3),I(0.5,1.11,1.3),I(0.5,1.11,2.8),I(-0.5,1.11,2.8)],J.dark);TH.ln(c,I(-0.55,1.12,2.85),I(0.55,1.12,2.85),J.stL,u*0.14);glyphs(c,x,y,u,-1.2,-0.6,1.11,1.5,3.2,r);glyphs(c,x,y,u,0.6,1.2,1.11,1.5,3.2,r);
    jbox(c,x,y,u,-1.5,1.5,-1.3,1.3,3.5,3.9,0.05);jbox(c,x,y,u,-0.8,0.8,-0.4,0.4,3.9,5.3);[[-0.4,4.3],[0.3,4.7],[-0.2,5.0]].forEach(([X,Z])=>TH.poly(c,[I(X,0.41,Z),I(X+0.25,0.41,Z),I(X+0.25,0.41,Z+0.3),I(X,0.41,Z+0.3)],J.dark));
    for(let k=0;k<9;k++)TH.ln(c,I(-0.5,1.8+k*0.0,0),I(0.5,1.8,0),'rgba(0,0,0,0)',1);jmoss(c,x-u*1.3,y+u*0.9,u,r,4);jmoss(c,x+u*1.1,y+u*0.5,u,r,3);}},
  /* ---------- landmarks ---------- */
  stepPyramid:{cat:'landmark',w:4.6,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+3),n=6,th=1.15,top=n*th,t=tm||0;jsh(c,x,y,u*5.2,u*9);
    for(let i=0;i<n;i++){const s=4.4-i*0.62;jbox(c,x,y,u,-s,s,-s,s,i*th,(i+1)*th,i%2?-0.02:0.03);TH.ln(c,I(-s,s,(i+1)*th),I(s,s,(i+1)*th),'rgba(255,255,240,.22)',u*0.07);
      for(let k=-3;k<=3;k++){if(Math.abs(k*s*0.3)<1.2)continue;const X=k*s*0.3;TH.poly(c,[I(X-0.15,s+0.01,i*th+0.3),I(X+0.15,s+0.01,i*th+0.3),I(X+0.15,s+0.01,i*th+0.75),I(X-0.15,s+0.01,i*th+0.75)],'rgba(30,34,24,.5)');}
      if(i<4)glyphs(c,x,y,u,-s+0.3,-1.2,s+0.01,i*th+0.15,(i+1)*th-0.1,r);}
    const Ya=4.6,Yb=1.4;TH.poly(c,[I(-0.85,Ya,0),I(0.85,Ya,0),I(0.85,Yb,top),I(-0.85,Yb,top)],'#d0ccb4');for(let k=1;k<30;k++){const f=k/30;TH.ln(c,I(-0.85,Ya+(Yb-Ya)*f,top*f),I(0.85,Ya+(Yb-Ya)*f,top*f),'rgba(70,66,48,.4)',u*0.04);}
    [-1,1].forEach(s=>TH.ln(c,I(s*1.0,Ya,0.25),I(s*1.0,Yb,top+0.25),J.stL,u*0.34));TH.poly(c,[I(-1.0,Ya,0),I(-0.85,Ya,0),I(-0.85,Yb,top),I(-1.0,Yb,top)],'rgba(30,30,20,.22)');
    const ts=1.5;jbox(c,x,y,u,-ts,ts,-ts,ts,top,top+1.8);TH.poly(c,[I(-0.5,ts+0.01,top),I(0.5,ts+0.01,top),I(0.5,ts+0.01,top+1.35),I(-0.5,ts+0.01,top+1.35)],J.dark);jmask(c,x,y,u,-1.0,ts+0.01,top+0.9,0.5);jmask(c,x,y,u,1.0,ts+0.01,top+0.9,0.5);
    jbox(c,x,y,u,-ts-0.15,ts+0.15,-ts-0.15,ts+0.15,top+1.8,top+2.1,0.06);jbox(c,x,y,u,-0.95,0.95,-0.5,0.5,top+2.1,top+3.4);[[-0.5,2.5],[0.2,2.9],[-0.2,3.1]].forEach(([X,Z])=>TH.poly(c,[I(X,0.51,top+Z-0.1),I(X+0.3,0.51,top+Z-0.1),I(X+0.3,0.51,top+Z+0.2),I(X,0.51,top+Z+0.2)],J.dark));
    for(let k=0;k<10;k++){const s=4.3-r()*3.2,i=Math.floor(r()*4);TH.blob(c,...I(-s+r()*1.5,s+0.05,i*th+0.5),u*(0.4+r()*0.5),u*0.22,k%2?'#4a7a3a':'#5f8a47',r,7);}
    const f=I(0,0,top+3.4);jglow(c,f[0],f[1]-u*0.5,u*2.4,'255,160,60',0.25+0.08*Math.sin(t*6));}},
  templeShrine:{cat:'landmark',w:3.0,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+5),n=3,th=1.1,top=n*th;jsh(c,x,y,u*3.3,u*6);
    for(let i=0;i<n;i++){const s=3.0-i*0.6;jbox(c,x,y,u,-s,s,-s,s,i*th,(i+1)*th,i%2?-0.02:0.03);TH.ln(c,I(-s,s,(i+1)*th),I(s,s,(i+1)*th),'rgba(255,255,240,.22)',u*0.07);glyphs(c,x,y,u,-s+0.3,-0.8,s+0.01,i*th+0.15,(i+1)*th-0.1,r);}
    const Ya=3.2,Yb=1.3;TH.poly(c,[I(-0.7,Ya,0),I(0.7,Ya,0),I(0.7,Yb,top),I(-0.7,Yb,top)],'#d0ccb4');for(let k=1;k<18;k++){const f=k/18;TH.ln(c,I(-0.7,Ya+(Yb-Ya)*f,top*f),I(0.7,Ya+(Yb-Ya)*f,top*f),'rgba(70,66,48,.4)',u*0.04);}
    const ts=1.2;jbox(c,x,y,u,-ts,ts,-ts,ts,top,top+1.6);TH.poly(c,[I(-0.45,ts+0.01,top),I(0.45,ts+0.01,top),I(0.45,ts+0.01,top+1.2),I(-0.45,ts+0.01,top+1.2)],J.dark);jbox(c,x,y,u,-ts-0.12,ts+0.12,-ts-0.12,ts+0.12,top+1.6,top+1.9,0.06);jbox(c,x,y,u,-0.8,0.8,-0.4,0.4,top+1.9,top+3.0);
    [[-0.4,2.3],[0.2,2.6]].forEach(([X,Z])=>TH.poly(c,[I(X,0.41,top+Z-0.1),I(X+0.25,0.41,top+Z-0.1),I(X+0.25,0.41,top+Z+0.2),I(X,0.41,top+Z+0.2)],J.dark));
    for(let k=0;k<8;k++)TH.blob(c,...I(-2.6+r()*2.0,3.0+0.05,r()*2.2+0.4),u*(0.4+r()*0.5),u*0.22,k%2?'#4a7a3a':'#5f8a47',r,7);jmoss(c,x+u*1.8,y+u*0.8,u,r,4);}},
  ballCourt:{cat:'landmark',w:4.0,tier:3,weight:2.5,cost:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+7);jsh(c,x,y,u*4,u*5);TH.poly(c,[I(-3.4,-1.0,0),I(3.4,-1.0,0),I(3.4,1.0,0),I(-3.4,1.0,0)],'#c9b98a');for(let k=0;k<12;k++)TH.ln(c,I(-3.2+k*0.58,-0.9,0),I(-3.2+k*0.58,0.9,0),'rgba(100,80,40,.25)',u*0.05);TH.ln(c,I(-3.4,0,0),I(3.4,0,0),'rgba(100,80,40,.45)',u*0.07);
    jbox(c,x,y,u,-3.6,3.6,-3.2,-1.5,0,2.8);TH.poly(c,[I(-3.6,-1.5,2.8),I(3.6,-1.5,2.8),I(3.6,-0.9,0),I(-3.6,-0.9,0)],J.st);for(let k=1;k<7;k++){const f=k/7;TH.ln(c,I(-3.6,-1.5+0.6*f,2.8*(1-f)),I(3.6,-1.5+0.6*f,2.8*(1-f)),'rgba(60,56,40,.22)',u*0.05);}
    glyphs(c,x,y,u,-3.4,-1.2,-0.91,0.2,1.8,r);const rc=I(0,-1.5,3.9);c.strokeStyle='#8e8a72';c.lineWidth=u*0.55;c.beginPath();for(let a=0;a<=24;a++){const t=a/24*6.283,p=I(Math.cos(t)*0.9,-1.5,3.9+Math.sin(t)*0.9);a?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();c.strokeStyle=J.stL;c.lineWidth=u*0.2;c.stroke();jmask(c,x,y,u,1.9,-1.49,2.1,0.6);
    jbox(c,x,y,u,-3.6,3.6,1.5,3.2,0,1.9,-0.04);TH.poly(c,[I(-3.6,1.5,1.9),I(3.6,1.5,1.9),I(3.6,1.0,1.4),I(-3.6,1.0,1.4)],'#a9a58c');glyphs(c,x,y,u,-3.4,3.2,3.21,0.3,1.6,r);
    jbox(c,x,y,u,-3.9,-3.2,-0.6,0.6,0,1.4,0.04);jbox(c,x,y,u,3.2,3.9,-0.6,0.6,0,1.4,0.04);for(let k=0;k<9;k++)TH.blob(c,...I(-3.4+r()*6.8,r()<0.5?-2.4:2.5,2.8+r()*0.1),u*(0.3+r()*0.4),u*0.18,k%2?'#4a7a3a':'#5f8a47',r,7);}},
  corbelArch:{cat:'landmark',w:3.2,tier:3,weight:3,cost:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+4);jsh(c,x,y,u*3.2,u*6);TH.poly(c,[I(-1.8,0.0,0),I(1.8,0.0,0),I(0,0.0,5.0)],'#0f1514');
    for(let i=0;i<6;i++){const z0=i*0.95,z1=z0+0.95;jbox(c,x,y,u,-3.1,-1.8+0.42*i,-0.9,0.9,z0,z1,i%2?-0.03:0.02);if(i<4)jbox(c,x,y,u,1.8-0.42*i,3.1,-0.9,0.9,z0,z1,i%2?0.02:-0.03);}
    jbox(c,x,y,u,1.2,3.1,-0.9,0.9,3.8,4.2,-0.04);for(let k=0;k<5;k++)jbox(c,x,y,u,0.6+r()*2.2,1.0+r()*2.2,0.5+r()*0.9,0.8+r()*1.1,0,0.4+r()*0.5,-0.1+r()*0.15);
    jbox(c,x,y,u,-1.3,1.3,-0.7,0.7,5.7,6.2,0.04);jbox(c,x,y,u,-0.5,0.5,-0.3,0.3,6.2,7.5);[[-0.2,6.5],[0.1,6.9]].forEach(([X,Z])=>TH.poly(c,[I(X-0.1,0.31,Z),I(X+0.15,0.31,Z),I(X+0.15,0.31,Z+0.25),I(X-0.1,0.31,Z+0.25)],J.dark));
    glyphs(c,x,y,u,-3.0,-2.0,0.91,0.3,4.0,r);jmask(c,x,y,u,-2.45,0.91,4.2,0.55);
    for(let k=0;k<8;k++){const sx=-3.0+r()*6;TH.ln(c,I(sx,0.95,3.0+r()*2),I(sx+(r()-0.5)*0.3,0.95,1.0+r()*1.5),r()<0.5?'#3f6a3a':'#4a7a3a',u*0.07);}jmoss(c,x-u*2.2,y+u*0.8,u,r,4);jmoss(c,x+u*2.0,y+u*0.6,u,r,3);}}
  }};
const JUNGLE_HEIGHT={fernCluster:'low',elephantEar:'low',heliconia:'low',mossBoulder:'low',fallenColumn:'low',glyphBlock:'low',chacMool:'low',jaguarStatue:'low',serpentHead:'low',stoneAltar:'low',torchPost:'low',clayPots:'low',macaw:'low',
  bamboo:'mid',palmTree:'mid',kapokTree:'mid',stela:'mid',tikiTotem:'mid',smallShrine:'mid',stepPyramid:'tall',templeShrine:'tall',ballCourt:'tall',corbelArch:'tall'};
Object.keys(JUNGLE_PACK.assets).forEach(id=>{JUNGLE_PACK.assets[id].h=JUNGLE_HEIGHT[id]||'low';});
const KEEP_OUT={rx:0.52,ry:0.34};   // central ellipse (x R) reserved for the ride or building sprite
/* opts.avoid = [{x,y,r}] circles (tile-local px) to keep free, used instead of the central ellipse when the tile belongs to a two-tile ride */
function placeThemeAssets(pack,tier,R,seed,opts){
  opts=opts||{};const avoid=opts.avoid||null;
  const rnd=mulberry(seed*7919+tier*131), u=R*0.068, T=pack.tiers[tier], out=[], decals=[], TAU=Math.PI*2;
  if(!T)return {assets:out,decals,u};
  const inside=(x,y,k)=>{const X=Math.abs(x)/R,Y=Math.abs(y)/(0.58*R);return X<=0.866*k&&Y<=k-X/1.732;};
  const ids=Object.keys(pack.assets), cnt={};
  const free=(x,y,w)=>out.every(o=>Math.hypot(o.x-x,(o.y-y)*1.7)>(o.w+w)*u*0.8);
  const clearOfCenter=(x,y,w,h)=>{if(avoid){const kk=h==='tall'?0.75:0.85;for(const a of avoid){if(Math.hypot(x-a.x,(y-a.y)*1.7)<a.r+w*u*kk)return false;}return true;}const kx=h==='tall'?0.28:0.75,ky=h==='tall'?0.18:0.4,ex=R*KEEP_OUT.rx+w*u*kx,ey=R*KEEP_OUT.ry+w*u*ky;return x*x/(ex*ex)+y*y/(ey*ey)>1;};
  const zoneOK=(a,x,y)=>{const h=a.h||'low';if(h==='low')return true;const ax=Math.abs(x)/R;
    if(h==='tall')return y<R*0.12&&ax>(y>=-R*0.12?0.55:0.4);
    if(y>R*0.12)return h==='mid'&&ax>0.5;if(y>=-R*0.12)return h==='mid'||ax>0.55;return true;};
  const ringPoint=(tmax)=>{const th=rnd()*TAU,dx=Math.cos(th),dy=Math.sin(th);let lo=0,hi=R*1.2;
    for(let i=0;i<12;i++){const m=(lo+hi)/2;if(inside(dx*m,dy*m,0.9))lo=m;else hi=m;}const t=0.5+rnd()*((tmax||1)-0.5);return[dx*lo*t,dy*lo*t];};
  const spot=a=>{for(let i=0;i<120;i++){const p=ringPoint(a.h==='tall'?0.8:a.h==='mid'?0.92:1);if(clearOfCenter(p[0],p[1],a.w,a.h)&&zoneOK(a,p[0],p[1])&&free(p[0],p[1],a.w))return p;}return null;};
  const add=(id,x,y)=>{const a=pack.assets[id];out.push({id,x,y,v:Math.floor(rnd()*1000),w:a.w});cnt[id]=(cnt[id]||0)+1;};
  for(let i=0;i<Math.round(T.decals*(opts.decalScale==null?1:opts.decalScale));i++){const pool=ids.filter(id=>pack.assets[id].cat==='decal'&&pack.assets[id].tier<=tier),id=pool[Math.floor(rnd()*pool.length)];
    for(let t=0;t<40;t++){const p=ringPoint();if(clearOfCenter(p[0],p[1],pack.assets[id].w*0.5)){decals.push({id,x:p[0],y:p[1],v:Math.floor(rnd()*1000)});break;}}}
  let budget=Math.max(0,Math.round(T.budget*(opts.budgetScale==null?1:opts.budgetScale)));const maxW=opts.maxW==null?1e9:opts.maxW;
  const land=()=>{let id=T.pool[Math.floor(rnd()*T.pool.length)];for(let q=0;q<8&&cnt[id];q++)id=T.pool[Math.floor(rnd()*T.pool.length)];
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}};
  if(!opts.noLandmarks&&T.pool.length&&rnd()<T.landmark){land();if(T.second&&rnd()<T.second)land();}
  let guard=0;while(budget>0&&guard++<500){const pool=ids.filter(id=>{const a=pack.assets[id];return a.cat!=='decal'&&a.cat!=='landmark'&&a.tier<=tier&&a.cost<=budget&&a.w<=maxW&&(cnt[id]||0)<(a.max||3);});
    if(!pool.length)break;let tot=0;pool.forEach(id=>tot+=pack.assets[id].weight);let pick=rnd()*tot,id=pool[0];for(const q of pool){pick-=pack.assets[q].weight;if(pick<=0){id=q;break;}}
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}else{cnt[id]=99;}}
  return {assets:out,decals,u};
}
function drawThemeGround(ctx,cx,cy,R,pack,border){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);ctx[i?'lineTo':'moveTo'](cx+R*Math.cos(a),cy+R*Math.sin(a)*0.58);}ctx.closePath();
  ctx.fillStyle=pack.ground;ctx.fill();ctx.lineWidth=Math.max(1.5,R*0.03);ctx.strokeStyle=border||pack.border;ctx.stroke();}
function drawThemeDecals(ctx,cx,cy,pack,pl,tm){pl.decals.forEach(d=>pack.assets[d.id].draw(ctx,cx+d.x,cy+d.y,pl.u,d.v,tm||0));}
/* layer: 'back' (y<0, draw BEFORE the ride sprite), 'front' (y>=0, draw AFTER it) or omit for all, sorted by y */
function drawThemeAssets(ctx,cx,cy,pack,pl,tm,layer){pl.assets.filter(o=>layer==='back'?o.y<0:layer==='front'?o.y>=0:true).sort((a,b)=>a.y-b.y).forEach(o=>pack.assets[o.id].draw(ctx,cx+o.x,cy+o.y,pl.u,o.v,tm||0));}
function drawThemedTile(ctx,cx,cy,R,pack,tier,seed,tm,border,rideFn){drawThemeGround(ctx,cx,cy,R,pack,border);const pl=placeThemeAssets(pack,tier,R,seed);
  drawThemeDecals(ctx,cx,cy,pack,pl,tm);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'back');if(rideFn)rideFn(ctx,cx,cy,R);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'front');}
/* ===== END PACK CODE ===== */

/* ===== STATIC CLASSIC HYPER (two-hex sprites, out-and-back with steel LATTICE supports, baked once) =====
 * An Arrow/Intamin-style hyper: a long chain lift, a long first drop, wide gentle airtime hills (three out, three back), one wide banked turnaround.
 * The look is in the structure: every support is a steel lattice bent (legs, rungs, zigzag bracing); the tall lift and drop use four-leg lattice towers
 * that are cross-braced to each other, so the lift hill reads as a lattice wall rather than a row of columns.
 *   drawClassicHyperSide(ctx, cx, cy, R, {accent})              two hexes side by side (E-W)
 *   drawClassicHyperDiag(ctx, cx, cy, R, {accent, dir})         dir 'NW-SE' (default) or 'NE-SW' (mirrored)
 *   classicHyperFootprint(R, mode, dir) -> {tiles, circles};  footprintForTile(fp, i) -> circles for placeThemeAssets(..., {avoid})
 *   sceneryInFront(circles, x, y) -> true when the scenery item is in FRONT of the ride (draw it after the ride, everything else before)
 */
const CH_KNOTS=[[0,0.05,0],[0.03,0.05,0],[0.05,0.16,9],[0.115,0.9,9],[0.126,0.985,2.5],[0.136,0.985,-2.5],[0.145,0.85,-14],[0.165,0.4,-19],[0.185,0.09,-10],[0.198,0.05,0],
  [0.225,0.40,12],[0.255,0.62,0],[0.285,0.42,-11],[0.312,0.06,-8],[0.325,0.05,0],[0.345,0.28,10],[0.368,0.46,0],[0.39,0.3,-9],[0.41,0.12,-5],
  [0.418,0.12,0],[0.455,0.17,0],[0.499,0.11,-1],[0.52,0.09,0],[0.55,0.32,10],[0.572,0.44,0],[0.595,0.3,-9],[0.62,0.06,-6],[0.635,0.05,0],
  [0.66,0.24,8],[0.69,0.34,0],[0.715,0.22,-7],[0.74,0.05,-4],[0.755,0.045,0],[0.78,0.16,6],[0.81,0.24,0],[0.835,0.15,-6],[0.86,0.05,-3],[0.875,0.045,0],[1.0,0.05,0]];
function chZ(f){const K=CH_KNOTS;let i=0;while(i<K.length-2&&f>K[i+1][0])i++;const a=K[i],b=K[i+1],dx=b[0]-a[0],t=Math.max(0,Math.min(1,(f-a[0])/dx)),t2=t*t,t3=t2*t;
  return(2*t3-3*t2+1)*a[1]+(t3-2*t2+t)*dx*a[2]+(-2*t3+3*t2)*b[1]+(t3-t2)*dx*b[2];}
function chLayout(R,mode){
  chLayout._c=chLayout._c||{};const key=mode+R;if(chLayout._c[key])return chLayout._c[key];
  const side=mode==='side',N=800,a=side?1.38*R:0.98*R,h=side?0.17*R:0.12*R,S=2*a,arc=Math.PI*h,Lt=2*S+2*arc,zsc=0.85*Math.min(1,Lt/(6.6*R)),k=side?1.05:0.92,amp=(side?0.03:0.022)*R;
  const ax=side?[1,0]:[0.706,0.709],lt=side?[0,-1]:[0.706,-0.709],hexes=side?[[-0.866*R,0],[0.866*R,0]]:[[-0.433*R,-0.435*R],[0.433*R,0.435*R]];
  const wv=(s,ph)=>{const c=Math.cos(Math.PI*0.5*s/a);return amp*Math.sin(s/a*Math.PI*1.7+ph)*c*c;};
  const g=[],z=[];
  for(let i=0;i<N;i++){const l=i/N*Lt;let s,lat;
    if(l<S){s=-a+l;lat=h+wv(s,0);}else if(l<S+arc){const th=(l-S)/h;s=a+h*Math.sin(th);lat=h*Math.cos(th);}
    else if(l<2*S+arc){s=a-(l-S-arc);lat=-h+wv(s,1.3);}else{const th=(l-2*S-arc)/h;s=-a-h*Math.sin(th);lat=-h*Math.cos(th);}
    g.push([ax[0]*s+lt[0]*lat,ax[1]*s+lt[1]*lat]);z.push(zsc*chZ(i/N)*R);}
  const psi=[];let prev=0;for(let i=0;i<N;i++){const p=g[(i+N-1)%N],q=g[(i+1)%N];let ps=Math.atan2(q[1]-p[1],q[0]-p[0]);while(ps-prev>Math.PI)ps-=2*Math.PI;while(ps-prev<-Math.PI)ps+=2*Math.PI;psi.push(ps);prev=ps;}
  const mm=9,kap=psi.map((_,i)=>{const i0=(i-mm+N)%N,i1=(i+mm)%N;let d=psi[i1]-psi[i0];while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return d/(2*mm*Lt/N);});
  const bank=kap.map(v=>Math.max(-1.05,Math.min(1.05,-v*R*0.17))),n=psi.map(p=>[-Math.sin(p),Math.cos(p)]),tg=psi.map(p=>[Math.cos(p),Math.sin(p)]);
  return chLayout._c[key]={N,g,z,bank,n,tg,hexes,Lt,k,ds:Lt/N,lt,ax};
}
function chDraw(ctx,cx,cy,R,op,mode){
  const accent=op.accent||'#f8fafc',fl=op.flip?-1:1,L=chLayout(R,mode),N=L.N,k=L.k,Rk=R*k,hw=R*0.0165*k,thk=R*0.012*k;ctx.save();ctx.translate(cx,cy);ctx.lineJoin='round';ctx.lineCap='round';
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=fill;ctx.lineWidth=0.7;ctx.stroke();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.006;ctx.stroke();}};
  const P=i=>{i=(i+N)%N;return[L.g[i][0],L.g[i][1]-L.z[i]];};
  const ED=[];for(let i=0;i<N;i++){const p=P(i),n=L.n[i],b=L.bank[i],c=Math.cos(b),s=Math.sin(b);ED.push({p,E1:[p[0]+n[0]*hw*c,p[1]+n[1]*hw*c-hw*s],E2:[p[0]-n[0]*hw*c,p[1]-n[1]*hw*c+hw*s],
    R1:[p[0]+n[0]*hw*0.72*c,p[1]+n[1]*hw*0.72*c-hw*0.72*s-R*0.004],R2:[p[0]-n[0]*hw*0.72*c,p[1]-n[1]*hw*0.72*c+hw*0.72*s-R*0.004]});}
  ctx.save();ctx.translate(fl*R*0.04,R*0.03);ctx.beginPath();L.g.forEach((p,i)=>{const z=L.z[i],x=p[0]+fl*z*0.3,y=p[1]+z*0.15;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.strokeStyle='rgba(15,25,20,.15)';ctx.lineWidth=R*0.04*k;ctx.stroke();ctx.restore();
  const items=[],steel='#aeb7c8',steelD='#7d889d',steelL='#dfe5f0';
  /* track: tubular steel on a box spine, two rails, chain on the lift */
  for(let i=0;i<N;i++){const j=(i+1)%N,ei=ED[i],ej=ED[j],key=L.g[i][1]+L.z[i]*0.05,f=i/N,lift=f>0.045&&f<0.126;
    items.push({k:key,f:()=>{const nearE1=(ei.E1[1]+ej.E1[1])>(ei.E2[1]+ej.E2[1]),ea=nearE1?ei.E1:ei.E2,eb=nearE1?ej.E1:ej.E2;
      poly([ea,eb,[eb[0],eb[1]+thk],[ea[0],ea[1]+thk]],shade(accent,-0.4));line([ei.p[0],ei.p[1]+thk*0.55],[ej.p[0],ej.p[1]+thk*0.55],shade(accent,-0.55),R*0.011*k);
      poly([ei.E1,ej.E1,ej.E2,ei.E2],accent);line(ei.R1,ej.R1,'#1f2636',R*0.005*k);line(ei.R2,ej.R2,'#1f2636',R*0.005*k);line(ei.p,ej.p,'rgba(255,255,255,.28)',R*0.005*k);
      if(lift&&i%4===0)line([ei.p[0]+L.n[i][0]*hw*0.6,ei.p[1]+L.n[i][1]*hw*0.6],[ei.p[0]-L.n[i][0]*hw*0.6,ei.p[1]-L.n[i][1]*hw*0.6],'#141a28',R*0.005);}});}
  /* steel lattice supports. Low/medium bents: a lattice A-frame (two legs, rungs, zigzag). Tall bents (lift, drop, big hills): a four-leg lattice tower. Consecutive
     tall towers are cross-braced to each other. */
  const bents=[];let acc=0;
  for(let i=0;i<N;i++){acc+=L.ds;const zi=L.z[i],sl=Math.abs(L.z[(i+1)%N]-L.z[(i+N-1)%N])/(2*L.ds),sp=(sl>0.7?R*0.095:sl>0.3?R*0.14:R*0.21)*k;if(acc<sp||zi<R*0.07)continue;acc=0;
    const G=L.g[i],n=L.n[i],tg=L.tg[i],H=ED[i].p,top=[H[0],H[1]+thk*1.2],tall=zi>R*0.15,wg=R*(0.046+0.05*Math.min(1,zi/(R*0.7)))*k*(tall?1.1:1),wt=R*0.02*k,dg=tall?wg*0.62:0,dt=tall?R*0.011*k:0;
    const legs=tall?[[1,1],[-1,1],[-1,-1],[1,-1]]:[[1,0],[-1,0]],gl=legs.map(([a,b])=>[G[0]+n[0]*a*wg+tg[0]*b*dg,G[1]+n[1]*a*wg+tg[1]*b*dg]),tl=legs.map(([a,b])=>[top[0]+n[0]*a*wt+tg[0]*b*dt,top[1]+n[1]*a*wt+tg[1]*b*dt]);
    const lv=Math.max(2,Math.round(zi/(R*0.062)));bents.push({i,zi,gl,tl,lv,tall,key:G[1]+zi*0.05-0.002});}
  const pt=(b,li,t)=>[b.gl[li][0]+(b.tl[li][0]-b.gl[li][0])*t,b.gl[li][1]+(b.tl[li][1]-b.gl[li][1])*t];
  bents.forEach(b=>{items.push({k:b.key,f:()=>{const nl=b.gl.length,w=b.tall?R*0.0085*k:R*0.009*k;
    for(let li=0;li<nl;li++){ctx.save();ctx.globalAlpha=(b.tall&&b.gl[li][1]<b.gl[(li+2)%nl][1]&&nl===4)?0.6:1;line(b.gl[li],b.tl[li],steelD,w*1.5);line(b.gl[li],b.tl[li],steel,w);ctx.restore();ctx.fillStyle='rgba(20,28,40,.3)';ctx.beginPath();ctx.ellipse(b.gl[li][0],b.gl[li][1]+R*0.003,R*0.014*k,R*0.006*k,0,0,7);ctx.fill();}
    const faces=nl===4?[[0,1],[1,2],[2,3],[3,0]]:[[0,1]];for(let m=0;m<=b.lv;m++){const t=m/b.lv;faces.forEach(([p,q])=>{line(pt(b,p,t),pt(b,q,t),steel,R*0.0048*k);});}
    for(let m=0;m<b.lv;m++){const t0=m/b.lv,t1=(m+1)/b.lv;faces.forEach(([p,q],fi)=>{const dir=(m+fi)%2===0;line(pt(b,dir?p:q,t0),pt(b,dir?q:p,t1),steelL,R*0.0038*k);if(b.tall&&nl===4)line(pt(b,dir?q:p,t0),pt(b,dir?p:q,t1),steelL,R*0.0028*k);});}
    const A=b.tl[0],B2=b.tl[1];line(A,B2,'#c7cfdd',R*0.007*k);}});});
  for(let q=0;q<bents.length-1;q++){const A=bents[q],B=bents[q+1];if(A.zi<R*0.12||B.zi<R*0.12||A.gl.length!==B.gl.length)continue;const dG=Math.hypot(A.gl[0][0]-B.gl[0][0],A.gl[0][1]-B.gl[0][1]);if(dG>R*0.34)continue;const nlg=A.gl.length;
    items.push({k:(A.key+B.key)/2+0.003,f:()=>{const mz=Math.min(A.zi,B.zi),lvh=Math.min(R*0.085,mz/Math.max(1,Math.round(mz/(R*0.085))));for(let li=0;li<nlg;li++){for(let m=0;(m+1)*lvh<=mz;m++){const ta=m*lvh/A.zi,tb=m*lvh/B.zi,ta1=(m+1)*lvh/A.zi,tb1=(m+1)*lvh/B.zi,pa=pt(A,li,ta),pb=pt(B,li,tb);line(pa,pb,steel,R*0.0042*k);line(pa,pt(B,li,tb1),steelL,R*0.0032*k);line(pt(A,li,ta1),pb,steelL,R*0.0026*k);}}}});}
  /* station: slim platform + accent canopy beside the start of the outbound lane */
  const i0=Math.round(0.006*N),i1=Math.round(0.04*N),b=L.lt,g0=L.g[i0],g1=L.g[i1],pf=(g,off,up)=>[g[0]+b[0]*off,g[1]+b[1]*off-up];
  items.push({k:g0[1]-Rk*0.02,f:()=>{poly([pf(g0,Rk*0.04,Rk*0.02),pf(g1,Rk*0.04,Rk*0.02),pf(g1,Rk*0.14,Rk*0.02),pf(g0,Rk*0.14,Rk*0.02)],'#e2e8f0','#94a3b8',Rk*0.006);poly([pf(g0,Rk*0.04,Rk*0.02),pf(g1,Rk*0.04,Rk*0.02),pf(g1,Rk*0.04,0),pf(g0,Rk*0.04,0)],'#94a3b8');}});
  items.push({k:g1[1]+Rk*0.1,f:()=>{[0.12,0.06].forEach(off=>[g0,g1].forEach(g=>line(pf(g,Rk*off,Rk*0.02),pf(g,Rk*off,Rk*0.1),'#eef1f7',Rk*0.008)));
    poly([pf(g0,Rk*0.035,Rk*0.1),pf(g1,Rk*0.035,Rk*0.1),pf(g1,Rk*0.15,Rk*0.1),pf(g0,Rk*0.035,Rk*0.1)].slice(0,3).concat([pf(g0,Rk*0.15,Rk*0.1)]),shade(accent,0.1),shade(accent,-0.3),Rk*0.006);line(pf(g0,Rk*0.15,Rk*0.1),pf(g1,Rk*0.15,Rk*0.1),shade(accent,-0.4),Rk*0.011);line(pf(g0,Rk*0.035,Rk*0.1),pf(g1,Rk*0.035,Rk*0.1),shade(accent,-0.4),Rk*0.011);}});
  /* two static trains: station and lift */
  const car=(i,lead)=>{const p=P(i),pn=P(i+2),pp=P(i-2);let tx=pn[0]-pp[0],ty=pn[1]-pp[1];const m=Math.hypot(tx,ty)||1;tx/=m;ty/=m;const n=[-ty,tx],c=[p[0],p[1]-Rk*0.013],lx=Rk*0.032,wy=Rk*0.02;
    const q=(a,bb,dz)=>[c[0]+tx*a+n[0]*bb,c[1]+ty*a+n[1]*bb+dz];items.push({k:L.g[(i+N)%N][1]+L.z[(i+N)%N]*0.05+0.01,f:()=>{
      poly([q(-lx,wy,0),q(lx,wy,0),q(lx,wy,Rk*0.013),q(-lx,wy,Rk*0.013)],'#bfc7d6');poly([q(-lx,-wy,0),q(lx,-wy,0),q(lx,wy,0),q(-lx,wy,0)],'#f4f6fb');
      poly([q(-lx,-wy,0),q(-lx*0.4,-wy,0),q(-lx*0.4,wy,0),q(-lx,wy,0)],'#2a3144');poly([q(lx*0.35,-wy,0),q(lx,-wy,0),q(lx,wy,0),q(lx*0.35,wy,0)],lead?accent:shade(accent,0.25));
      [-0.45,0.45].forEach(d=>{const h=q(-lx*0.1,d*wy,-Rk*0.022);ctx.fillStyle='#fde4c8';ctx.beginPath();ctx.arc(h[0],h[1],Rk*0.012,0,7);ctx.fill();ctx.fillStyle=['#3b82f6','#ef4444','#22c55e','#f59e0b'][(i+(d>0?1:0))%4];ctx.fillRect(h[0]-Rk*0.009,h[1]+Rk*0.01,Rk*0.018,Rk*0.013);});}});};
  const sp=Math.round(Rk*0.07/L.ds);[0.04,0.092].forEach(fh=>{const ih=Math.round(fh*N);for(let q=0;q<6;q++)car(ih-q*sp,q===0);});
  items.sort((a,b)=>a.k-b.k).forEach(it=>it.f());ctx.restore();
}
function classicHyperSprite(R,mode,dir,accent,scale){
  classicHyperSprite._c=classicHyperSprite._c||{};const sc=scale||getBakeScale(),key=[mode,dir,Math.round(R*sc),R,accent,sc].join('|');if(classicHyperSprite._c[key])return classicHyperSprite._c[key];
  const side=mode==='side',W=Math.ceil((side?3.5:2.6)*R),H=Math.ceil((side?2.2:2.9)*R),oy=(side?1.55:1.9)*R,cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);
  const g=cv.getContext('2d');g.scale(sc,sc);g.save();g.translate(W/2,oy);if(dir==='NE-SW')g.scale(-1,1);chDraw(g,0,0,R,{accent:accent,flip:dir==='NE-SW'},mode);g.restore();
  return classicHyperSprite._c[key]={canvas:cv,ox:W/2,oy:oy,w:W,h:H};
}
function drawClassicHyperSide(ctx,cx,cy,R,o){o=o||{};const s=classicHyperSprite(R,'side','NW-SE',o.accent||'#f8fafc');ctx.drawImage(s.canvas,cx-s.ox,cy-s.oy,s.w,s.h);}
function drawClassicHyperDiag(ctx,cx,cy,R,o){o=o||{};const d=o.dir==='NE-SW'?'NE-SW':'NW-SE',s=classicHyperSprite(R,'diag',d,o.accent||'#f8fafc');ctx.drawImage(s.canvas,cx-s.ox,cy-s.oy,s.w,s.h);}
function classicHyperFootprint(R,mode,dir){
  const L=chLayout(R,mode),m=dir==='NE-SW'?-1:1,c=[];for(let i=0;i<L.N;i+=5)c.push({x:L.g[i][0]*m,y:L.g[i][1],r:R*0.11*L.k});
  const i0=Math.round(0.006*L.N),i1=Math.round(0.04*L.N),mid=[(L.g[i0][0]+L.g[i1][0])/2+L.lt[0]*R*0.1*L.k,(L.g[i0][1]+L.g[i1][1])/2+L.lt[1]*R*0.1*L.k];c.push({x:mid[0]*m,y:mid[1],r:R*0.13*L.k});
  return{tiles:L.hexes.map(h=>[h[0]*m,h[1]]),circles:c};
}
window.footprintForTile=window.footprintForTile||function(fp,i){const t=fp.tiles[i];return fp.circles.map(c=>({x:c.x-t[0],y:c.y-t[1],r:c.r}));};
window.sceneryInFront=window.sceneryInFront||function(circles,x,y){let f=-Infinity;for(const c of circles){const dx=x-c.x;if(Math.abs(dx)<c.r)f=Math.max(f,c.y+Math.sqrt(c.r*c.r-dx*dx)/1.7);}return f>-Infinity&&y>f;};
const BIG_RIDE_SCENERY=window.BIG_RIDE_SCENERY||{maxW:2.0,budgetScale:0.45,decalScale:0.6,noLandmarks:true};
/* ===== END STATIC HYPER ===== */
return Object.freeze({ side: drawClassicHyperSide, diag: drawClassicHyperDiag });
})();

const hydraulicLaunchCoasterPack = (() => {

/* ===== THEME PACK CORE (shared by every theme pack; copy once into engine.js) ===== */
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
/* ===== FRONTIER PACK ===== */
const F={wood:'#8a5a33',woodD:'#5a3b22',woodL:'#b07a46',bark:'#6b4a2b',endc:'#d9b27a',pine:'#2f5f3a',pineL:'#3d7348',pineD:'#26503a',water:'#4aa0c8',waterD:'#2f7fa8',rock:'#8a8f96',rockD:'#5f656c',rockL:'#b4b9c0',snow:'#f4f8fc',canvas:'#eadfc4'};
const fsh=(c,x,y,rx,h)=>{c.fillStyle='rgba(12,34,14,.32)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
const logWall=(c,x,y,u,X0,X1,Y,Z0,Z1)=>{let k=0;for(let z=Z0+0.17;z<Z1;z+=0.34,k++){const a=TH.iso(x,y,u,X0,Y,z),b=TH.iso(x,y,u,X1,Y,z);TH.ln(c,a,b,k%2?F.wood:'#7d4f2b',u*0.36);TH.ln(c,[a[0],a[1]-u*0.09],[b[0],b[1]-u*0.09],'rgba(255,225,170,.28)',u*0.08);}};
const logWallE=(c,x,y,u,X,Y0,Y1,Z0,Z1)=>{let k=0;for(let z=Z0+0.17;z<Z1;z+=0.34,k++){const a=TH.iso(x,y,u,X,Y0,z),b=TH.iso(x,y,u,X,Y1,z);TH.ln(c,a,b,k%2?'#6f4524':'#5f3b1f',u*0.36);}};
const logEnds=(c,x,y,u,X,Y,Z0,Z1)=>{for(let z=Z0+0.17;z<Z1;z+=0.34){const p=TH.iso(x,y,u,X,Y,z);TH.ell(c,p[0],p[1],u*0.2,u*0.17,F.endc);TH.ell(c,p[0],p[1],u*0.09,u*0.07,'#b8884f');}};
function frFir(c,x,y,u,s,v){const H=u*6.2*s,tiers=6;fsh(c,x,y,u*1.6*s,H);TH.ln(c,[x,y],[x,y-u*1.2*s],'#4a3320',u*0.5*s);
  for(let k=0;k<tiers;k++){const t=k/(tiers-1),by=y-u*1.0*s-H*0.76*t,w=u*(1.75-1.2*t)*s,h=u*1.5*s;
    TH.poly(c,[[x-w,by+h*0.2],[x-w*0.35,by-h*0.3],[x,by-h*1.15],[x+w*0.35,by-h*0.3],[x+w,by+h*0.2],[x,by+h*0.55]],k%2?F.pine:F.pineL);
    TH.poly(c,[[x,by-h*1.15],[x+w*0.35,by-h*0.3],[x+w,by+h*0.2],[x+w*0.3,by+h*0.35]],'rgba(8,30,18,.4)');}}
const fcrag=(c,x,y,u,o)=>{const wt=o.wt,wb=o.wb,H=o.H,r=mulberry(o.seed),n=o.bands.length;TH.ell(c,x,y,wb*1.1,wb*0.47,'#6f7a62');c.save();c.beginPath();c.moveTo(x-wt,y-H);c.lineTo(x-wb,y);c.ellipse(x,y,wb,wb*0.42,0,Math.PI,0,true);c.lineTo(x+wt,y-H);c.ellipse(x,y-H,wt,wt*0.42,0,0,Math.PI);c.closePath();c.clip();
  const Hh=H+wb*0.42;for(let j=0;j<n;j++){c.fillStyle=o.bands[j];c.fillRect(x-wb-2,y-H+Hh*j/n,wb*2+4,Hh/n+1);}
  const g=c.createLinearGradient(x-wb,0,x+wb,0);g.addColorStop(0,'rgba(255,255,255,.22)');g.addColorStop(0.45,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,15,25,.5)');c.fillStyle=g;c.fillRect(x-wb-2,y-H-2,wb*2+4,Hh+4);
  for(let k=0;k<8;k++){const fx=x+(r()*2-1)*wt*0.9,bx=x+(fx-x)*wb/wt;c.strokeStyle='rgba(20,28,36,.3)';c.lineWidth=u*0.07;c.beginPath();c.moveTo(fx,y-H+wt*0.25);c.quadraticCurveTo((fx+bx)/2+u*0.12,y-H/2,bx,y+wb*0.3);c.stroke();}
  c.restore();TH.ell(c,x,y-H,wt,wt*0.42,o.top||'#6f8a5a');};
const FRONTIER_PACK={id:'frontier',name:'Frontier',ground:'#7d955d',groundDark:'#6b8350',border:'#566e42',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},
         3:{budget:11,decals:4,landmark:0.75,pool:['lookoutTower','waterfallCliff','mountainPeak']},
         4:{budget:15,decals:5,landmark:1,pool:['stockadeFort','sawmill','mountainPeak','waterfallCliff','lookoutTower'],second:0.45}},
  assets:{
  /* ---------- ground decals ---------- */
  riverBend:{cat:'decal',w:3.2,tier:1,weight:4,cost:0,draw(c,x,y,u,v,tm){const r=mulberry(v+3),f=v%2?-1:1,t=tm||0;const path=()=>{c.beginPath();c.moveTo(x-u*3.2,y-u*0.5*f);c.bezierCurveTo(x-u*1.6,y+u*0.7*f,x-u*0.1,y-u*0.9*f,x+u*3.2,y+u*0.5*f);};
    c.lineCap='round';path();c.strokeStyle='#6b5a3a';c.lineWidth=u*1.55;c.stroke();path();c.strokeStyle='#2f7fa8';c.lineWidth=u*1.2;c.stroke();path();c.strokeStyle='#4aa0c8';c.lineWidth=u*0.9;c.stroke();
    c.setLineDash([u*0.35,u*0.55]);c.lineDashOffset=-t*u*1.5;path();c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=u*0.08;c.stroke();c.setLineDash([]);
    for(let k=0;k<9;k++){const s=r(),b=(1-s)**3*(x-u*3.2)+3*(1-s)**2*s*(x-u*1.6)+3*(1-s)*s*s*(x-u*0.1)+s**3*(x+u*3.2),yy=(1-s)**3*(y-u*0.5*f)+3*(1-s)**2*s*(y+u*0.7*f)+3*(1-s)*s*s*(y-u*0.9*f)+s**3*(y+u*0.5*f);TH.ell(c,b,yy+(k%2?1:-1)*u*0.8,u*0.2,u*0.12,['#8a8f96','#a5a9ad','#6f747a'][k%3]);}}},
  pebbleBar:{cat:'decal',w:2.0,tier:1,weight:3,cost:0,draw(c,x,y,u,v){const r=mulberry(v+5);TH.ell(c,x,y,u*2.0,u*0.9,'#b9b4a2');for(let k=0;k<28;k++){const a=r()*6.283,rr=Math.sqrt(r());TH.ell(c,x+Math.cos(a)*u*1.8*rr,y+Math.sin(a)*u*0.8*rr,u*0.14,u*0.09,['#8a8f96','#a8a290','#c9c3b0','#6f747a'][k%4]);}}},
  pineNeedles:{cat:'decal',w:2.2,tier:1,weight:3.5,cost:0,draw(c,x,y,u,v){const r=mulberry(v+8);TH.ell(c,x,y,u*2.2,u*0.95,'#6b4f32');TH.ell(c,x-u*0.2,y-u*0.05,u*1.7,u*0.7,'#7b5c3a');for(let k=0;k<34;k++){const a=r()*6.283,rr=Math.sqrt(r()),px=x+Math.cos(a)*u*2.0*rr,py=y+Math.sin(a)*u*0.85*rr;TH.ln(c,[px,py],[px+u*0.28,py-u*0.1],k%3?'#4a3320':'#8a6a45',u*0.04);}}},
  wildMeadow:{cat:'decal',w:2.2,tier:1,weight:3.5,cost:0,draw(c,x,y,u,v){const r=mulberry(v+9);for(let k=0;k<30;k++){const a=r()*6.283,rr=Math.sqrt(r()),px=x+Math.cos(a)*u*2.0*rr,py=y+Math.sin(a)*u*0.9*rr;TH.ln(c,[px,py],[px+(r()-0.5)*u*0.2,py-u*(0.3+r()*0.3)],'#4a7a3c',u*0.05);if(k%3===0)TH.ell(c,px,py-u*0.5,u*0.09,u*0.12,['#8a5ad0','#f2d24a','#f8fafc','#d884e0'][k%4]);}}},
  /* ---------- trees and plants ---------- */
  pineTree:{cat:'tree',w:1.8,tier:2,weight:3.5,cost:2,max:2,draw(c,x,y,u,v){frFir(c,x,y,u,1.3+(v%3)*0.12,v);}},
  firGrove:{cat:'tree',w:2.3,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v){[[-1.1,0.2,0.8],[1.0,0.3,0.92],[0.0,-0.5,0.7]].sort((a,b)=>a[1]-b[1]).forEach(([dx,dy,s])=>frFir(c,x+dx*u,y+dy*u,u,s,v));}},
  aspenTree:{cat:'tree',w:1.7,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*5+2),H=u*(4.2+r()*0.8),t=tm||0;fsh(c,x,y,u*1.8,u*6);TH.ln(c,[x,y],[x+u*0.1,y-H],'#d8d3c2',u*0.5);TH.ln(c,[x+u*0.12,y],[x+u*0.2,y-H],'rgba(60,50,40,.25)',u*0.2);
    for(let k=0;k<9;k++){const ky=y-u*(0.4+k*0.45);TH.ln(c,[x-u*0.18,ky],[x+u*0.05,ky-u*0.05],'#3a3228',u*0.06);}
    const cols=['#c9b43a','#b2c040','#9ab838','#d6c046'];[[0,-0.9,1.9,1.5],[-1.2,0.1,1.4,1.1],[1.2,0.0,1.4,1.1],[0.1,0.1,1.7,1.2],[-0.5,-1.9,1.2,0.95]].forEach(([dx,dy,rx,ry],i)=>{const sw=Math.sin(t*1.4+i)*u*0.06;TH.blob(c,x+dx*u+sw,y-H+dy*u,u*rx,u*ry,cols[i%4],r,9);});}},
  berryBush:{cat:'plant',w:1.4,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*3+6);fsh(c,x,y,u*1.4,u);[[-0.7,-0.5,0.85,'#3f7a45'],[0.7,-0.5,0.8,'#4a8a4c'],[0,-0.95,0.95,'#559858'],[-0.1,-0.45,0.85,'#437f48']].forEach(([dx,dy,s,col])=>TH.blob(c,x+dx*u,y+dy*u,u*s,u*s*0.72,col,r,9));
    for(let k=0;k<9;k++)TH.ell(c,x+(r()-0.5)*u*1.8,y-u*(0.3+r()*1.0),u*0.1,u*0.1,['#3a5ad0','#d9342b','#5a3ad0'][k%3]);}},
  fernPatch:{cat:'plant',w:1.5,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*5+2),t=tm||0;fsh(c,x,y,u*1.5,u*1.5);for(let k=0;k<8;k++){const a=-3.1+k*0.48,l=u*(1.5+r()*0.7),sw=Math.sin(t*1.2+k)*u*0.05,ex=x+Math.cos(a)*l+sw,ey=y-Math.abs(Math.sin(a))*l*0.8-u*0.15;
      c.strokeStyle=k%2?'#2f6a3a':'#3a7a44';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(ex-x)*0.45,y-l*0.85,ex,ey);c.stroke();
      for(let q=1;q<7;q++){const f=q/7,px=x+(ex-x)*f*0.92,py=y+(ey-y)*f-Math.sin(f*3.0)*l*0.3;TH.ln(c,[px,py],[px-u*0.26,py+u*0.18],'#4a8e4e',u*0.05);TH.ln(c,[px,py],[px+u*0.26,py+u*0.18],'#4a8e4e',u*0.05);}}}},
  cattails:{cat:'plant',w:1.4,tier:1,weight:3,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*4+3),t=tm||0;TH.ell(c,x,y+u*0.1,u*1.6,u*0.6,'#3f8fb5');TH.ell(c,x-u*0.2,y,u*1.2,u*0.4,'#56a8cc');
    for(let k=0;k<8;k++){const bx=x+(k-3.5)*u*0.3,h=u*(2.4+r()*1.3),sw=Math.sin(t*1.3+k)*u*0.06;TH.ln(c,[bx,y],[bx+sw,y-h],'#5a8a3a',u*0.1);TH.ln(c,[bx,y-h*0.3],[bx-u*0.5+sw,y-h*0.95],'#4a7a32',u*0.06);if(k%2===0){TH.ell(c,bx+sw,y-h*0.82,u*0.13,u*0.38,'#6b4a2b');TH.ln(c,[bx+sw,y-h*0.6],[bx+sw,y-h*1.15],'#8a6a45',u*0.04);}}}},
  fallenLog:{cat:'plant',w:2.4,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+2);fsh(c,x,y,u*2.4,u*1.5);const a=I(-2.2,0,0.5),b=I(2.2,0,0.5);TH.ln(c,a,b,'#4a3320',u*1.2);TH.ln(c,a,b,F.bark,u*1.0);TH.ln(c,[a[0],a[1]-u*0.3],[b[0],b[1]-u*0.3],F.woodL,u*0.2);
    for(let k=0;k<7;k++){const p=I(-1.8+k*0.6,0,0.5);TH.ln(c,[p[0],p[1]-u*0.45],[p[0]+u*0.2,p[1]+u*0.4],'rgba(40,24,10,.35)',u*0.05);}TH.ell(c,b[0],b[1],u*0.5,u*0.62,F.endc);[0.16,0.3,0.44].forEach(s=>{c.strokeStyle='rgba(120,80,40,.5)';c.lineWidth=u*0.04;c.beginPath();c.ellipse(b[0],b[1],u*s*1.1,u*s*1.3,0,0,7);c.stroke();});
    TH.ln(c,I(0.5,0,0.8),I(1.2,-0.6,1.7),F.bark,u*0.16);TH.blob(c,...I(-1.0,0.1,1.1),u*0.7,u*0.2,'rgba(95,138,71,.95)',r,7);for(let k=0;k<3;k++){const p=I(-0.4+k*0.35,0.5,0.75);TH.ln(c,[p[0],p[1]],[p[0],p[1]-u*0.35],'#e8e0cc',u*0.06);TH.ell(c,p[0],p[1]-u*0.4,u*0.16,u*0.1,'#c9663a');}}},
  boulders:{cat:'rock',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*13+3);fsh(c,x,y,u*1.9,u*1.4);[[0.0,0.0,1.0,1.0,'#80858d'],[-1.0,0.2,0.65,0.6,'#6f747c'],[0.9,0.25,0.6,0.55,'#8f949b']].forEach(([dx,dy,sx,sy,col])=>TH.blob(c,x+dx*u,y-u*0.55*sy+dy*u,u*0.9*sx,u*0.75*sy,col,r,9));
    for(let k=0;k<4;k++)TH.ell(c,x+(r()-0.5)*u*1.4,y-u*(0.2+r()*0.7),u*0.2,u*0.1,k%2?'rgba(150,170,90,.8)':'rgba(95,138,71,.7)');}},
  /* ---------- props ---------- */
  campfire:{cat:'prop',w:1.7,tier:1,weight:3,cost:1,max:1,draw(c,x,y,u,v,tm){const t=tm||0;fsh(c,x,y,u*1.8,u*2);TH.ell(c,x,y+u*0.1,u*1.2,u*0.5,'#4a3a2a');for(let k=0;k<9;k++){const a=k/9*6.283;TH.ell(c,x+Math.cos(a)*u*0.95,y+u*0.1+Math.sin(a)*u*0.42,u*0.28,u*0.18,['#8a8f96','#6f747a'][k%2]);}
    TH.ln(c,[x-u*0.7,y+u*0.1],[x+u*0.6,y-u*0.3],'#4a3320',u*0.24);TH.ln(c,[x+u*0.7,y+u*0.15],[x-u*0.5,y-u*0.3],'#5a4028',u*0.24);
    [[-1.9,0.4],[1.9,0.5]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u-u*0.5,y+dy*u],[x+dx*u+u*0.5,y+dy*u-u*0.1],'#6b4a2b',u*0.5);TH.ell(c,x+dx*u+u*0.5,y+dy*u-u*0.1,u*0.22,u*0.25,F.endc);});
    [[-1.4,0.1],[1.4,0.1],[0,-0.7]].forEach(([dx,dy])=>TH.ln(c,[x+dx*u,y+dy*u+u*0.2],[x+dx*u*0.2,y-u*2.4],'#3b3f4a',u*0.09));TH.ell(c,x,y-u*1.4,u*0.45,u*0.34,'#2b2f3a');
    const g=c.createRadialGradient(x,y-u*0.6,0,x,y-u*0.6,u*2.6);g.addColorStop(0,'rgba(255,170,60,'+(0.45+0.1*Math.sin(t*9))+')');g.addColorStop(1,'rgba(255,170,60,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*0.6,u*2.6,0,7);c.fill();
    [[0,1.0,0.9],[-0.35,0.75,0.6],[0.35,0.8,0.65]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*11+i*2+v)*u*0.12;TH.poly(c,[[x+dx*u-u*0.38*w,y-u*0.05],[x+dx*u+f,y-u*(0.1+h*1.2)],[x+dx*u+u*0.38*w,y-u*0.05]],i?'#fbbf24':'#f97316');});
    for(let k=0;k<3;k++){const ph=(t*0.6+k*0.33)%1;c.fillStyle='rgba(120,120,126,'+(0.35*(1-ph))+')';c.beginPath();c.ellipse(x+Math.sin(ph*5+k)*u*0.3,y-u*(2.3+ph*2.2),u*(0.22+ph*0.45),u*(0.18+ph*0.35),0,0,7);c.fill();}}},
  canoe:{cat:'prop',w:2.5,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.7,u*1.5);const N=16,top=[];for(let k=0;k<=N;k++){const X=-2.6+5.2*k/N,q=Math.abs(X)/2.6;top.push([X,0.62*Math.pow(Math.max(0,1-q*q),0.55),0.28+0.95*Math.pow(q,3)]);}
    TH.poly(c,top.map(p=>I(p[0],-p[1],p[2])).concat(top.slice().reverse().map(p=>I(p[0],p[1],p[2]))),'#2f2012');
    TH.poly(c,top.map(p=>I(p[0],p[1],p[2])).concat(top.slice().reverse().map(p=>I(p[0],p[1]*0.35,0.03+p[2]*0.12))),'#c98f4a');
    for(let k=1;k<N;k+=2){const p=top[k];TH.ln(c,I(p[0],p[1],p[2]),I(p[0],p[1]*0.35,0.03+p[2]*0.12),'rgba(90,50,20,.35)',u*0.05);}
    c.strokeStyle='#7a4d2b';c.lineWidth=u*0.12;c.lineJoin='round';c.beginPath();top.forEach((p,i)=>{const q=I(p[0],p[1],p[2]);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.stroke();
    [-0.8,0.9].forEach(X=>TH.ln(c,I(X,-0.55,0.5),I(X,0.55,0.5),'#8a5a33',u*0.12));TH.ln(c,I(1.5,1.3,0),I(1.9,1.0,2.4),F.woodL,u*0.1);TH.ell(c,...I(1.95,0.98,2.7),u*0.14,u*0.3,F.woodL,-0.3);}},
  fishRack:{cat:'prop',w:2.2,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+4);fsh(c,x,y,u*2.3,u*3);[-1.9,1.9].forEach(X=>{TH.ln(c,I(X,-0.7,0),I(X,0,2.6),F.bark,u*0.18);TH.ln(c,I(X,0.7,0),I(X,0,2.6),F.bark,u*0.18);});
    TH.ln(c,I(-2.1,0,2.5),I(2.1,0,2.5),F.woodD,u*0.16);TH.ln(c,I(-1.9,0,1.5),I(1.9,0,1.5),F.woodD,u*0.12);
    for(let k=0;k<10;k++){const X=-1.7+k*0.38,L=0.5+r()*0.5,top=I(X,0,2.5),bot=[top[0],top[1]+u*L*1.2];TH.ln(c,top,bot,'#c9b98a',u*0.04);TH.ell(c,bot[0],bot[1]+u*0.28,u*0.12,u*0.34,'#b8c4cc');TH.poly(c,[[bot[0]-u*0.1,bot[1]+u*0.55],[bot[0]+u*0.1,bot[1]+u*0.55],[bot[0],bot[1]+u*0.4]],'#98a4ac');TH.ell(c,bot[0]+u*0.02,bot[1]+u*0.16,u*0.025,u*0.025,'#222');}
    for(let k=0;k<5;k++){const p=I(-1.5+k*0.75,0,1.5);TH.poly(c,[[p[0]-u*0.12,p[1]],[p[0]+u*0.12,p[1]],[p[0]+u*0.08,p[1]+u*0.9],[p[0]-u*0.08,p[1]+u*0.9]],'#b86a4a');}}},
  firewood:{cat:'prop',w:1.7,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+5);fsh(c,x,y,u*1.8,u*1.6);[-1.5,1.5].forEach(X=>TH.ln(c,I(X,0.5,0),I(X,0.5,1.6),F.woodD,u*0.18));
    TH.box(c,x,y,u,-1.4,1.4,-0.5,0.5,0,1.5,'#9a6a3c','#6f4a28','#b8884f');for(let row=0;row<4;row++)for(let col=0;col<7;col++){const p=I(-1.2+col*0.4+(row%2)*0.2,0.51,0.18+row*0.36);TH.ell(c,p[0],p[1],u*0.17,u*0.16,F.endc);TH.ell(c,p[0],p[1],u*0.07,u*0.06,'#a8783f');}
    TH.poly(c,[I(-1.6,0.8,1.5),I(1.6,0.8,1.5),I(1.6,-0.6,1.7),I(-1.6,-0.6,1.7)],'#5a3b22');TH.ell(c,x+u*2.0,y+u*0.3,u*0.35,u*0.28,F.endc);TH.ln(c,[x+u*2.0,y+u*0.3],[x+u*2.5,y-u*0.4],F.woodL,u*0.14);TH.poly(c,[[x+u*2.35,y-u*0.45],[x+u*2.75,y-u*0.55],[x+u*2.6,y-u*0.2]],'#9aa0a8');}},
  railFence:{cat:'prop',w:2.6,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.7,u);for(let seg=-2;seg<=1;seg++){const sx=seg*1.25,s=seg%2?1:-1;for(let lvl=0;lvl<4;lvl++){const z=0.25+lvl*0.4,k=(lvl+seg)%2?1:-1;TH.ln(c,I(sx,0.35*k*s,z),I(sx+1.45,-0.35*k*s,z+0.03),'#8a6a45',u*0.2);TH.ell(c,...I(sx+1.45,-0.35*k*s,z+0.03),u*0.1,u*0.1,'#c9a56a');}}
    if(v%2)TH.ln(c,I(1.8,0,0.2),I(2.6,0.5,0.9),'#8a6a45',u*0.2);}},
  footbridge:{cat:'prop',w:2.4,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.poly(c,[I(-1.6,-3.0,0),I(1.6,-3.0,0),I(1.6,3.0,0),I(-1.6,3.0,0)],'#6b5a3a');TH.poly(c,[I(-1.2,-3.0,0.02),I(1.2,-3.0,0.02),I(1.2,3.0,0.02),I(-1.2,3.0,0.02)],F.waterD);TH.poly(c,[I(-0.9,-3.0,0.04),I(0.9,-3.0,0.04),I(0.9,3.0,0.04),I(-0.9,3.0,0.04)],F.water);
    fsh(c,x,y,u*2.2,u*1.5);const deck=Y=>{const z=0.55+0.35*(1-Math.pow(Y/2.6,2));return z;};[-2.6,2.6].forEach(Y=>TH.ln(c,I(-0.7,Y,0),I(-0.7,Y,0.65),F.woodD,u*0.3));
    const pts=[];for(let k=0;k<=12;k++){const Y=-2.6+5.2*k/12;pts.push([Y,deck(Y)]);}TH.poly(c,pts.map(p=>I(-0.75,p[0],p[1])).concat(pts.slice().reverse().map(p=>I(0.75,p[0],p[1]))),'#a97d49');for(let k=1;k<12;k++){TH.ln(c,I(-0.75,pts[k][0],pts[k][1]),I(0.75,pts[k][0],pts[k][1]),'rgba(60,35,10,.4)',u*0.05);}
    [-0.8,0.8].forEach(X=>{c.strokeStyle=F.woodD;c.lineWidth=u*0.12;c.beginPath();pts.forEach((p,i)=>{const q=I(X,p[0],p[1]+0.8);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.stroke();for(let k=0;k<=12;k+=3)TH.ln(c,I(X,pts[k][0],pts[k][1]),I(X,pts[k][0],pts[k][1]+0.8),F.woodD,u*0.1);});}},
  trapperTent:{cat:'prop',w:2.4,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.5,u*3);TH.poly(c,[I(2.2,-1.5,0),I(2.2,1.5,0),I(2.2,0,2.6)],'#d6c7a4');TH.poly(c,[I(2.2,-0.6,0),I(2.2,0.6,0),I(2.2,0.05,1.7)],'#241c14');TH.poly(c,[I(2.2,-0.6,0),I(2.2,0.05,1.7),I(2.2,-0.2,0.0)],'#f0e6c8');
    TH.poly(c,[I(-2.2,1.5,0),I(2.2,1.5,0),I(2.2,0,2.6),I(-2.2,0,2.6)],F.canvas);TH.poly(c,[I(-2.2,0.4,0.9),I(2.2,0.4,0.9),I(2.2,0,2.6),I(-2.2,0,2.6)],'rgba(140,110,60,.18)');for(let k=1;k<5;k++)TH.ln(c,I(-2.2+k*0.9,1.5,0),I(-2.2+k*0.9,0,2.6),'rgba(110,85,50,.35)',u*0.04);TH.ln(c,I(-2.2,0,2.6),I(2.2,0,2.6),F.woodD,u*0.18);
    [-2.6,2.6].forEach(X=>TH.ln(c,I(X,0,2.8),I(X,0,0),F.bark,u*0.14));[[-2.6,2.2],[2.6,2.2],[-1,2.2]].forEach(([X,Y])=>{TH.ln(c,I(X*0.8,1.2,1.0),I(X,Y,0),'rgba(230,220,190,.7)',u*0.04);TH.ln(c,I(X,Y,0),I(X,Y,0.3),F.woodD,u*0.1);});
    TH.ell(c,...I(1.0,2.0,0.3),u*0.3,u*0.2,'#7a5a3a');TH.ell(c,...I(1.0,2.0,0.55),u*0.2,u*0.14,'#e0d6b8');TH.ln(c,I(2.8,1.6,0),I(2.8,1.6,1.5),F.bark,u*0.12);TH.ell(c,...I(2.8,1.6,1.6),u*0.18,u*0.22,'#fbbf24');}},
  bear:{cat:'prop',w:1.7,tier:2,weight:2,cost:1,max:1,draw(c,x,y,u,v,tm){const dk='#4a2f1e',md='#6b4630',lt='#8a6a4a';fsh(c,x,y,u*1.9,u*2.2);[[-0.6,-0.1],[1.1,-0.05]].forEach(([dx,dy])=>{TH.poly(c,[[x+dx*u-u*0.3,y-u*0.9],[x+dx*u+u*0.3,y-u*0.9],[x+dx*u+u*0.26,y+dy*u],[x+dx*u-u*0.26,y+dy*u]],'#3b2516');});
    TH.ell(c,x,y-u*1.4,u*1.75,u*0.95,md);TH.ell(c,x-u*0.55,y-u*1.95,u*0.85,u*0.6,md);TH.ell(c,x+u*0.1,y-u*1.0,u*1.4,u*0.5,'rgba(0,0,0,.2)');
    [[-1.0,0.3],[0.8,0.35]].forEach(([dx,dy])=>{TH.poly(c,[[x+dx*u-u*0.34,y-u*0.95],[x+dx*u+u*0.34,y-u*0.95],[x+dx*u+u*0.3,y+dy*u],[x+dx*u-u*0.3,y+dy*u]],dk);TH.ell(c,x+dx*u,y+dy*u,u*0.42,u*0.14,'#2f2015');for(let k=-1;k<=1;k++)TH.ln(c,[x+dx*u+k*u*0.15+u*0.2,y+dy*u+u*0.05],[x+dx*u+k*u*0.15+u*0.32,y+dy*u+u*0.1],'#e8e0cc',u*0.04);});
    const hy=y-u*1.55+Math.sin((tm||0)*1.2+v)*u*0.05;TH.ell(c,x+u*1.65,hy,u*0.62,u*0.56,md);TH.ell(c,x+u*2.1,hy+u*0.15,u*0.4,u*0.3,lt);TH.ell(c,x+u*2.38,hy+u*0.06,u*0.12,u*0.1,'#1a1410');TH.ell(c,x+u*1.4,hy-u*0.5,u*0.17,u*0.17,md);TH.ell(c,x+u*1.85,hy-u*0.42,u*0.15,u*0.15,dk);TH.ell(c,x+u*1.85,hy-u*0.1,u*0.06,u*0.06,'#111');
    if(v%2){TH.ell(c,x+u*2.35,hy+u*0.42,u*0.55,u*0.12,'#e0746a',-0.35);TH.poly(c,[[x+u*2.8,hy+u*0.3],[x+u*3.0,hy+u*0.1],[x+u*3.0,hy+u*0.5]],'#c9564a');}}},
  deer:{cat:'prop',w:1.5,tier:1,weight:2.5,cost:1,max:1,draw(c,x,y,u,v,tm){const tn='#b88a56',dk='#8a6238';fsh(c,x,y,u*1.7,u*2.5);[[-0.8,0.05],[0.9,0.05]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u+u*0.15,y-u*1.4],[x+dx*u+u*0.1,y+dy*u],dk,u*0.16);});
    TH.ell(c,x,y-u*1.65,u*1.25,u*0.55,tn);TH.ell(c,x-u*0.2,y-u*1.4,u*0.9,u*0.25,'#e6d6b4');[[-0.95,0.05],[0.65,0.1]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u,y-u*1.4],[x+dx*u-u*0.04,y+dy*u],tn,u*0.18);TH.ell(c,x+dx*u-u*0.04,y+dy*u,u*0.14,u*0.07,'#2b1f14');});
    TH.ln(c,[x+u*1.0,y-u*1.8],[x+u*1.5,y-u*3.0],tn,u*0.4);const hy=y-u*3.15+Math.sin((tm||0)*1.5+v)*u*0.04;TH.ell(c,x+u*1.65,hy,u*0.38,u*0.3,tn,0.3);TH.ell(c,x+u*2.0,hy+u*0.1,u*0.2,u*0.14,'#d9c4a0');TH.ell(c,x+u*2.15,hy+u*0.08,u*0.06,u*0.05,'#111');TH.ell(c,x+u*1.62,hy-u*0.35,u*0.1,u*0.2,tn,-0.3);
    c.strokeStyle='#6b4a2b';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x+u*1.6,hy-u*0.25);c.lineTo(x+u*1.3,hy-u*0.85);c.moveTo(x+u*1.45,hy-u*0.55);c.lineTo(x+u*1.1,hy-u*0.55);c.moveTo(x+u*1.35,hy-u*0.75);c.lineTo(x+u*1.65,hy-u*1.1);c.stroke();TH.poly(c,[[x-u*1.25,y-u*1.8],[x-u*1.6,y-u*1.95],[x-u*1.3,y-u*1.55]],'#f1ece0');}},
  beaverDam:{cat:'prop',w:2.4,tier:2,weight:2,cost:1,max:1,draw(c,x,y,u,v,tm){const r=mulberry(v+3),t=tm||0;TH.ell(c,x,y,u*2.6,u*1.1,'#6b5a3a');TH.ell(c,x,y,u*2.4,u*0.98,F.waterD);TH.ell(c,x-u*0.2,y-u*0.05,u*1.9,u*0.74,F.water);c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=u*0.05;const ph=(t*0.35)%1;c.beginPath();c.ellipse(x-u*1.0,y+u*0.2,u*(0.2+ph*0.6),u*(0.1+ph*0.26),0,0,7);c.stroke();
    for(let k=0;k<22;k++){const px=x+u*(1.0+(r()-0.5)*0.4)+k*0.0,py=y+u*(-0.9+k*0.085),L=u*(0.9+r()*0.6);TH.ln(c,[px-L*0.5,py+(r()-0.5)*u*0.1],[px+L*0.5,py+(r()-0.5)*u*0.1-u*0.05],['#6b4a2b','#8a6238','#5a3b22'][k%3],u*0.14);}
    c.beginPath();c.moveTo(x-u*1.9,y-u*0.1);c.quadraticCurveTo(x-u*1.6,y-u*2.2,x-u*0.5,y-u*2.0);c.quadraticCurveTo(x+u*0.3,y-u*1.4,x+u*0.4,y-u*0.1);c.closePath();c.fillStyle='#7a5a38';c.fill();
    for(let k=0;k<26;k++){const a=r()*6.283,rr=Math.sqrt(r());const px=x-u*0.75+Math.cos(a)*u*1.0*rr,py=y-u*0.9+Math.sin(a)*u*0.75*rr;TH.ln(c,[px,py],[px+(r()-0.5)*u*0.9,py+(r()-0.5)*u*0.4],['#5a3b22','#9a7a4a','#6b4a2b'][k%3],u*0.07);}
    TH.ell(c,x-u*0.7,y+u*0.35,u*0.25,u*0.14,'#4a3320');TH.ell(c,x-u*0.45,y+u*0.34,u*0.1,u*0.09,'#4a3320');TH.ell(c,x-u*1.0,y+u*0.42,u*0.2,u*0.07,'#3a2a1a');}},
  logCabin:{cat:'structure',w:2.8,tier:3,weight:3,cost:2,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0;fsh(c,x,y,u*3.2,u*4);
    TH.box(c,x,y,u,-2.2,2.2,-1.6,1.6,0,2.3,'#8a5a33','#6f4524','#a97d49');logWall(c,x,y,u,-2.2,2.2,1.61,0,2.3);logWallE(c,x,y,u,2.21,-1.6,1.6,0,2.3);logEnds(c,x,y,u,-2.2,1.61,0,2.3);logEnds(c,x,y,u,2.2,1.61,0,2.3);
    TH.poly(c,[I(-0.45,1.64,0),I(0.45,1.64,0),I(0.45,1.64,1.6),I(-0.45,1.64,1.6)],'#4a2f1c','#2b1b0e',u*0.05);TH.ell(c,...I(0.3,1.65,0.8),u*0.05,u*0.05,'#e0b53a');
    TH.poly(c,[I(1.0,1.64,0.9),I(1.8,1.64,0.9),I(1.8,1.64,1.7),I(1.0,1.64,1.7)],'#9bd0e8','#4a2f1c',u*0.07);TH.ln(c,I(1.4,1.65,0.9),I(1.4,1.65,1.7),'#4a2f1c',u*0.05);[[0.78,1.0],[2.02,1.8]].forEach(([X,x2])=>TH.poly(c,[I(X,1.65,0.9),I(X+(X<1?0.22:-0.22),1.65,0.9),I(X+(X<1?0.22:-0.22),1.65,1.7),I(X,1.65,1.7)],'#5a3b22'));
    TH.poly(c,[I(2.2,-1.6,2.3),I(2.2,1.6,2.3),I(2.2,0,3.9)],'#7a4d2b');for(let k=0;k<5;k++)TH.ln(c,I(2.21,-1.5+k*0.75,2.3),I(2.21,-0.7+k*0.4+(k%2)*0.0,3.4),'rgba(40,24,10,.0)',1);
    TH.poly(c,[I(-2.7,2.0,2.2),I(2.7,2.0,2.2),I(2.7,0,4.0),I(-2.7,0,4.0)],'#7a5a3a');for(let k=1;k<7;k++){TH.ln(c,I(-2.7,2.0-k*0.285,2.2+k*0.257),I(2.7,2.0-k*0.285,2.2+k*0.257),'rgba(40,24,10,.45)',u*0.06);}TH.ln(c,I(-2.7,2.0,2.2),I(2.7,2.0,2.2),'#4a3320',u*0.14);TH.ln(c,I(-2.7,0,4.0),I(2.7,0,4.0),'#9a7a4a',u*0.14);
    TH.box(c,x,y,u,-1.7,-1.0,-1.1,-0.5,2.0,4.8,'#9aa0a8','#6f747c','#c3c8cf');for(let k=0;k<4;k++){const ph=(t*0.5+k*0.25)%1,tp=I(-1.35,-0.8,4.8);c.fillStyle='rgba(200,200,205,'+(0.5*(1-ph))+')';c.beginPath();c.ellipse(tp[0]+Math.sin(ph*4+k)*u*0.3+ph*u*0.6,tp[1]-ph*u*3.0-u*0.2,u*(0.25+ph*0.5),u*(0.2+ph*0.4),0,0,7);c.fill();}
    TH.box(c,x,y,u,-2.0,2.0,1.7,2.5,0,0.2,'#a97d49','#7d5a34','#c49858');[-1.9,1.9].forEach(X=>TH.ln(c,I(X,2.4,0.2),I(X,2.4,2.1),F.bark,u*0.18));}},
  /* ---------- landmarks ---------- */
  lookoutTower:{cat:'landmark',w:2.3,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.4,u*9);const H=9.0;
    const legs=[[-1.9,-1.4],[1.9,-1.4],[-1.9,1.4],[1.9,1.4]],top=(X,Y)=>[X*0.55,Y*0.55];legs.slice(0,2).forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(top(X,Y)[0],top(X,Y)[1],H),F.woodD,u*0.3));
    for(let k=1;k<5;k++){const f=k/5,z=H*f,s=1-0.45*f;TH.ln(c,I(-1.9*s,1.4*s,z),I(1.9*s,1.4*s,z),F.woodD,u*0.14);TH.ln(c,I(1.9*s,-1.4*s,z),I(1.9*s,1.4*s,z),F.woodD,u*0.14);}
    for(let k=0;k<4;k++){const f0=k/5,f1=(k+1)/5,s0=1-0.45*f0,s1=1-0.45*f1;TH.ln(c,I(-1.9*s0,1.4*s0,H*f0),I(1.9*s1,1.4*s1,H*f1),F.wood,u*0.1);TH.ln(c,I(1.9*s0,1.4*s0,H*f0),I(-1.9*s1,1.4*s1,H*f1),F.wood,u*0.1);}
    legs.slice(2).forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(top(X,Y)[0],top(X,Y)[1],H),F.wood,u*0.34));
    for(let k=0;k<7;k++){const f=k/7;TH.ln(c,I(-1.2+f*0.2,1.5,H*f),I(-0.6+f*0.2,1.5,H*(f+0.15)),'#c9a56a',u*0.08);}
    const cs=1.5;TH.box(c,x,y,u,-cs-0.3,cs+0.3,-cs-0.3,cs+0.3,H,H+0.25,'#a97d49','#7d5a34','#c49858');TH.box(c,x,y,u,-cs,cs,-cs,cs,H+0.25,H+1.8,'#b88a56','#8a6238','#d6a86a');
    [[-1.1,-0.2],[0.2,1.1]].forEach(([a,b])=>TH.poly(c,[I(a,cs+0.01,H+0.7),I(b,cs+0.01,H+0.7),I(b,cs+0.01,H+1.5),I(a,cs+0.01,H+1.5)],'#9bd0e8','#4a2f1c',u*0.05));TH.poly(c,[I(cs+0.01,-1.1,H+0.7),I(cs+0.01,1.1,H+0.7),I(cs+0.01,1.1,H+1.5),I(cs+0.01,-1.1,H+1.5)],'#9bd0e8','#4a2f1c',u*0.05);
    const ap=I(0,0,H+3.3);TH.poly(c,[I(-cs-0.4,cs+0.4,H+1.8),I(cs+0.4,cs+0.4,H+1.8),ap],'#5a3b22');TH.poly(c,[I(cs+0.4,-cs-0.4,H+1.8),I(cs+0.4,cs+0.4,H+1.8),ap],'#3f2815');TH.ln(c,ap,[ap[0],ap[1]-u*1.0],'#d5dae6',u*0.08);
    TH.poly(c,[[ap[0],ap[1]-u*1.0],[ap[0]+u*1.1,ap[1]-u*0.8+Math.sin((tm||0)*3)*u*0.1],[ap[0],ap[1]-u*0.5]],'#d9342b');}},
  waterfallCliff:{cat:'landmark',w:3.2,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const r=mulberry(v+4),t=tm||0,H=u*6.0,wt=u*2.7,wb=u*3.4;fsh(c,x,y,u*3.4,u*7);
    fcrag(c,x,y,u,{wt:wt,wb:wb,H:H,seed:v+2,bands:['#8a8f96','#7a7f87','#9a9fa6','#6f747c','#858a92','#7a7f87'],top:'#6f8a5a'});
    const fx=x-u*0.3,top=y-H+wt*0.42*0.9,bot=y+wb*0.42*0.9;c.save();c.beginPath();c.moveTo(fx-u*0.55,top);c.lineTo(fx+u*0.55,top);c.lineTo(fx+u*0.8,bot);c.lineTo(fx-u*0.8,bot);c.closePath();const g=c.createLinearGradient(fx,top,fx,bot);g.addColorStop(0,'#eaf6ff');g.addColorStop(1,'#bfe3f5');c.fillStyle=g;c.fill();c.clip();
    for(let k=0;k<7;k++){const ph=(t*1.4+k*0.31)%1;c.strokeStyle='rgba(255,255,255,'+(0.35+0.3*(1-ph))+')';c.lineWidth=u*0.06;const sx=fx-u*0.45+k*u*0.15;c.beginPath();c.moveTo(sx,top+(bot-top)*ph*0.7);c.lineTo(sx+(k-3)*u*0.02,top+(bot-top)*(ph*0.7+0.3));c.stroke();}c.restore();
    TH.ell(c,fx,bot+u*0.35,u*2.2,u*0.8,'#2f7fa8');TH.ell(c,fx,bot+u*0.3,u*1.9,u*0.66,'#4aa0c8');for(let k=0;k<7;k++){const ph=(t*0.9+k*0.2)%1;c.fillStyle='rgba(255,255,255,'+(0.55*(1-ph))+')';c.beginPath();c.ellipse(fx+(r()-0.5)*u*1.4,bot+u*0.2+ph*u*0.2,u*(0.3+ph*0.4),u*(0.14+ph*0.18),0,0,7);c.fill();}
    for(let k=0;k<4;k++){const ph=(t*0.5+k*0.25)%1;c.fillStyle='rgba(235,245,250,'+(0.3*(1-ph))+')';c.beginPath();c.ellipse(fx+(k-1.5)*u*0.5,bot-ph*u*1.6,u*(0.5+ph*0.6),u*(0.3+ph*0.4),0,0,7);c.fill();}
    [[-1.5,0.1],[0.6,-0.1],[1.4,0.2]].forEach(([dx,dy],i)=>frFir(c,x+dx*u,y-H+dy*u+wt*0.1,u*0.55,0.7+i*0.05,v+i));for(let k=0;k<5;k++)TH.blob(c,x+(r()-0.5)*wb*2.1,y+wb*0.25+r()*u*0.5,u*(0.35+r()*0.3),u*0.2,'#6f747c',r,7);}},
  mountainPeak:{cat:'landmark',w:4.0,tier:3,weight:3,cost:4,draw(c,x,y,u,v){const r=mulberry(v+6);fsh(c,x,y,u*4.2,u*10);const peak=(px,base,hw,H,snowF)=>{const ap=[px,base-H],L=[px-hw,base],Rr=[px+hw,base],M=[px+hw*0.08,base+hw*0.16];
      TH.poly(c,[L,ap,M],'#8e949c');TH.poly(c,[M,ap,Rr],'#575d68');c.strokeStyle='rgba(25,32,44,.35)';c.lineWidth=u*0.07;c.beginPath();c.moveTo(ap[0],ap[1]);c.lineTo(px-hw*0.4,base-H*0.3);c.moveTo(ap[0],ap[1]);c.lineTo(px+hw*0.25,base-H*0.15);c.moveTo(px-hw*0.25,base-H*0.62);c.lineTo(px-hw*0.55,base-H*0.4);c.stroke();
      const sy=base-H*(1-snowF);const sw=(f)=>hw*(1-f);TH.poly(c,[ap,[px-hw*snowF*1.0,sy],[px-hw*snowF*0.6,sy+H*0.07],[px-hw*snowF*0.3,sy-H*0.02],[px+hw*0.05,sy+H*0.09],[px+hw*snowF*0.4,sy+H*0.02],[px+hw*snowF*0.8,sy+H*0.08],[px+hw*snowF*1.0,sy]],'#f4f8fc');
      TH.poly(c,[ap,[px+hw*0.08,sy+H*0.09],[px+hw*snowF*0.4,sy+H*0.02],[px+hw*snowF*0.8,sy+H*0.08],[px+hw*snowF*1.0,sy]],'#c9d6e4');};
    peak(x+u*3.0,y,u*3.0,u*6.5,0.4);peak(x-u*0.5,y,u*4.6,u*10,0.38);
    TH.ell(c,x,y,u*5.2,u*1.6,'#566e42');[[-4.2,0.5,1.5],[3.8,0.6,1.3],[-2.0,0.9,1.0],[1.6,1.0,1.1]].forEach(([dx,dy,s])=>TH.blob(c,x+dx*u,y+dy*u,u*s*1.4,u*s*0.6,'#4a6e48',r,8));[[-3.4,0.8],[-2.6,1.1],[2.7,0.9],[3.5,0.7],[0.4,1.2]].forEach(([dx,dy],i)=>frFir(c,x+dx*u,y+dy*u,u*0.5,0.8+(i%2)*0.15,v+i));}},
  sawmill:{cat:'landmark',w:3.7,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0,r=mulberry(v+3);fsh(c,x,y,u*3.8,u*6);
    TH.poly(c,[I(2.4,-2.6,0.12),I(5.2,-2.6,0.12),I(5.2,2.4,0.12),I(2.4,2.4,0.12)],'#3f7a9a');TH.poly(c,[I(2.7,-2.4,0.14),I(5.0,-2.4,0.14),I(5.0,2.2,0.14),I(2.7,2.2,0.14)],'#4aa0c8');
    TH.box(c,x,y,u,-3.0,2.4,-2.0,2.0,0,3.0,'#9a6a3c','#6f4a28','#b07a46');logWall(c,x,y,u,-3.0,2.4,2.01,0,3.0);logWallE(c,x,y,u,2.41,-2.0,2.0,0,3.0);
    TH.poly(c,[I(-2.2,2.03,0),I(0.2,2.03,0),I(0.2,2.03,2.2),I(-2.2,2.03,2.2)],'#1c130c');for(let k=0;k<3;k++)TH.ln(c,I(-2.0+k*0.9,2.04,0.4),I(-1.8+k*0.9,2.04,2.0),'rgba(200,200,205,.2)',u*0.05);
    TH.ln(c,I(-2.2,2.2,0.4),I(0.2,2.2,0.4),'#5a5f68',u*0.12);TH.box(c,x,y,u,-1.8,-0.2,2.1,2.6,0.4,0.8,'#7a7f87','#555a62','#9aa0a8');TH.ell(c,...I(-1.0,2.3,1.3),u*0.65,u*0.7,'#c9ced6');TH.ell(c,...I(-1.0,2.3,1.3),u*0.12,u*0.12,'#555a62');
    TH.poly(c,[I(-3.4,2.4,2.9),I(2.8,2.4,2.9),I(2.8,0,5.0),I(-3.4,0,5.0)],'#6b4a2b');for(let k=1;k<6;k++)TH.ln(c,I(-3.4,2.4-k*0.4,2.9+k*0.35),I(2.8,2.4-k*0.4,2.9+k*0.35),'rgba(30,18,6,.45)',u*0.06);TH.poly(c,[I(2.4,-2.0,3.0),I(2.4,2.0,3.0),I(2.4,0,4.9)],'#8a5a33');
    const wc=[2.9,0,2.6],R0=2.3,a0=t*0.8;const pt=(a,rr)=>I(wc[0],rr*Math.cos(a),wc[2]+rr*Math.sin(a));c.strokeStyle='#4a3320';c.lineWidth=u*0.3;c.beginPath();for(let k=0;k<=32;k++){const p=pt(k/32*6.283,R0);k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();c.strokeStyle='#8a5a33';c.lineWidth=u*0.16;c.stroke();
    for(let k=0;k<8;k++){const a=a0+k*0.7854;TH.ln(c,pt(a,0),pt(a,R0),'#6b4a2b',u*0.16);const p=pt(a,R0),q=pt(a+0.22,R0+0.45);TH.poly(c,[p,q,pt(a+0.46,R0)],'#a97d49','#4a3320',u*0.04);}TH.ell(c,...pt(0,0),u*0.28,u*0.28,'#2b1b0e');
    for(let k=0;k<3;k++){const ph=(t*0.7+k*0.33)%1;TH.ln(c,I(3.9+ph*0.6,-2.3+ph*0.4,5.2-ph*3.3),I(4.3+ph*0.6,-2.0+ph*0.4,5.0-ph*3.3),'rgba(235,248,255,.6)',u*0.1);}TH.poly(c,[I(3.5,-2.6,5.2),I(4.6,-2.6,5.2),I(4.6,-1.6,3.4),I(3.5,-1.6,3.4)],'rgba(160,110,60,.5)');
    for(let row=0;row<3;row++)for(let col=0;col<4-row;col++)TH.ln(c,I(-3.4+col*0.62+row*0.3,3.0-row*0.1,0.3+row*0.5),I(-1.9+col*0.62+row*0.3,3.0-row*0.1,0.3+row*0.5),['#9a6a3c','#8a5a33'][(row+col)%2],u*0.46);}},
  stockadeFort:{cat:'landmark',w:4.5,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0,S=3.6,wh=3.4;fsh(c,x,y,u*4.8,u*6);TH.poly(c,[I(-S,-S,0.03),I(S,-S,0.03),I(S,S,0.03),I(-S,S,0.03)],'#a98b62');
    const wallY=(Y,x0,x1,col)=>{for(let X=x0;X<=x1;X+=0.36){const b=I(X,Y,0),tp=I(X,Y,wh);TH.ln(c,b,tp,col,u*0.3);TH.poly(c,[[tp[0]-u*0.17,tp[1]],[tp[0]+u*0.17,tp[1]],[tp[0],tp[1]-u*0.45]],col);}};
    const wallX=(X,y0,y1,col)=>{for(let Y=y0;Y<=y1;Y+=0.36){const b=I(X,Y,0),tp=I(X,Y,wh);TH.ln(c,b,tp,col,u*0.3);TH.poly(c,[[tp[0]-u*0.17,tp[1]],[tp[0]+u*0.17,tp[1]],[tp[0],tp[1]-u*0.45]],col);}};
    const tower=(X,Y,col)=>{TH.box(c,x,y,u,X-0.8,X+0.8,Y-0.8,Y+0.8,0,4.6,'#9a6a3c','#6f4a28','#b07a46');logWall(c,x,y,u,X-0.8,X+0.8,Y+0.81,0,4.6);logWallE(c,x,y,u,X+0.81,Y-0.8,Y+0.8,0,4.6);TH.box(c,x,y,u,X-1.0,X+1.0,Y-1.0,Y+1.0,4.6,4.9,'#a97d49','#7d5a34','#c49858');const ap=I(X,Y,6.4);TH.poly(c,[I(X-1.1,Y+1.1,4.9),I(X+1.1,Y+1.1,4.9),ap],'#5a3b22');TH.poly(c,[I(X+1.1,Y-1.1,4.9),I(X+1.1,Y+1.1,4.9),ap],'#3f2815');TH.poly(c,[I(X-0.3,Y+0.82,3.4),I(X+0.3,Y+0.82,3.4),I(X+0.3,Y+0.82,4.2),I(X-0.3,Y+0.82,4.2)],'#161a22');};
    wallY(-S,-S,S,'#7d5a34');wallX(-S,-S,S,'#6f4a28');tower(-S,-S);
    TH.box(c,x,y,u,-2.3,-0.6,-2.2,-0.6,0,1.7,'#9a6a3c','#6f4a28','#b07a46');TH.poly(c,[I(-2.5,-0.4,1.6),I(-0.4,-0.4,1.6),I(-0.4,-1.4,2.8),I(-2.5,-1.4,2.8)],'#5a3b22');TH.poly(c,[I(-0.4,-2.4,1.6),I(-0.4,-0.4,1.6),I(-0.4,-1.4,2.8)],'#7a5a3a');
    TH.box(c,x,y,u,0.6,2.2,-2.3,-0.9,0,1.5,'#9a6a3c','#6f4a28','#b07a46');TH.poly(c,[I(0.4,-0.7,1.4),I(2.4,-0.7,1.4),I(2.4,-1.6,2.5),I(0.4,-1.6,2.5)],'#6b4a2b');
    const fp=I(0.6,0.2,0);TH.ln(c,fp,[fp[0],fp[1]-u*6.2],'#d5dae6',u*0.1);const wv=Math.sin(t*3)*u*0.12;TH.poly(c,[[fp[0],fp[1]-u*6.2],[fp[0]+u*1.6,fp[1]-u*6.0+wv],[fp[0]+u*1.2,fp[1]-u*5.6+wv*1.3],[fp[0]+u*1.6,fp[1]-u*5.2+wv],[fp[0],fp[1]-u*5.3]],'#2f4f8f');
    tower(S,-S);wallX(S,-S,S,'#7d5a34');tower(-S,S);
    wallY(S,-S,-1.0,'#8a6238');wallY(S,1.0,S,'#8a6238');TH.poly(c,[I(-1.0,S+0.01,0),I(1.0,S+0.01,0),I(1.0,S+0.01,2.8),I(-1.0,S+0.01,2.8)],'#140f0a');[-1,1].forEach(s=>{TH.poly(c,[I(s*1.0,S+0.02,0),I(s*0.45,S+0.5,0),I(s*0.45,S+0.5,2.7),I(s*1.0,S+0.02,2.7)],'#6b4a2b','#3b2616',u*0.05);});TH.ln(c,I(-1.0,S+0.05,2.9),I(1.0,S+0.05,2.9),F.woodD,u*0.3);
    tower(S,S);const f1=I(S,S,6.4);TH.ln(c,f1,[f1[0],f1[1]-u*1.2],'#d5dae6',u*0.08);TH.poly(c,[[f1[0],f1[1]-u*1.2],[f1[0]+u*1.1,f1[1]-u*1.0+Math.sin(t*3+1)*u*0.1],[f1[0],f1[1]-u*0.7]],'#b3342f');}}
  }};
const FRONTIER_HEIGHT={berryBush:'low',fernPatch:'low',cattails:'low',fallenLog:'low',boulders:'low',campfire:'low',canoe:'low',fishRack:'low',firewood:'low',railFence:'low',footbridge:'low',beaverDam:'low',deer:'low',
  pineTree:'mid',firGrove:'mid',aspenTree:'mid',trapperTent:'mid',bear:'mid',logCabin:'mid',lookoutTower:'tall',waterfallCliff:'tall',mountainPeak:'tall',sawmill:'tall',stockadeFort:'tall'};
Object.keys(FRONTIER_PACK.assets).forEach(id=>{FRONTIER_PACK.assets[id].h=FRONTIER_HEIGHT[id]||'low';});
/* ===== JUNGLE PACK ===== */
const J={st:'#bdb9a0',stD:'#8e8a72',stL:'#dad7c3',moss:'#5f8a47',mossD:'#3f6a38',jade:'#2fbf9a',ochre:'#b5532f',turq:'#1fb5a8',dark:'#10161a',clay:'#c4683a'};
const jbox=(c,x,y,u,x0,x1,y0,y1,z0,z1,k)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,k?shade(J.st,k):J.st,k?shade(J.stD,k):J.stD,k?shade(J.stL,k):J.stL);
const jsh=(c,x,y,rx,h)=>{c.fillStyle='rgba(8,26,10,.36)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
const jmoss=(c,x,y,u,r,n)=>{for(let k=0;k<(n||3);k++)TH.ell(c,x+(r()-0.5)*u*1.6,y-r()*u*0.3,u*(0.22+r()*0.25),u*0.11,k%2?'rgba(95,138,71,.85)':'rgba(63,106,56,.85)');};
const jglow=(c,x,y,r,rgb,a)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba('+rgb+','+a+')');g.addColorStop(1,'rgba('+rgb+',0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();};
const glyphs=(c,x,y,u,X0,X1,Y,Z0,Z1,r)=>{for(let z=Z0;z<Z1-0.2;z+=0.42)for(let X=X0;X<X1-0.2;X+=0.5){if(r()<0.25)continue;const a=TH.iso(x,y,u,X+0.05,Y,z),b=TH.iso(x,y,u,X+0.05+0.12+r()*0.2,Y,z+(r()<0.5?0:0.12));TH.ln(c,a,b,'rgba(40,38,26,.45)',u*0.07);TH.ln(c,a,TH.iso(x,y,u,X+0.05,Y,z+0.2),'rgba(40,38,26,.4)',u*0.06);}};
const jmask=(c,x,y,u,X,Y,Z,s)=>{const I=(a,b)=>TH.iso(x,y,u,X+a*s,Y,Z+b*s);TH.poly(c,[I(-0.6,-0.6),I(0.6,-0.6),I(0.6,0.6),I(-0.6,0.6)],'rgba(60,56,40,.3)');[-0.3,0.3].forEach(e=>TH.poly(c,[I(e-0.12,0.15),I(e+0.12,0.15),I(e+0.12,0.35),I(e-0.12,0.35)],'rgba(30,30,22,.7)'));TH.ln(c,I(0,0.1),I(0,-0.15),'rgba(30,30,22,.6)',u*0.08);TH.ln(c,I(-0.3,-0.35),I(0.3,-0.35),'rgba(30,30,22,.7)',u*0.1);[-0.2,0.2].forEach(e=>TH.ln(c,I(e,-0.35),I(e,-0.5),'#e8e4d0',u*0.06));};
const JUNGLE_PACK={id:'jungle',name:'Jungle',ground:'#587c48',groundDark:'#456a3a',border:'#35552c',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},
         3:{budget:11,decals:4,landmark:0.75,pool:['templeShrine','corbelArch','ballCourt']},
         4:{budget:15,decals:5,landmark:1,pool:['stepPyramid','templeShrine','corbelArch','ballCourt'],second:0.45}},
  assets:{
  /* ---------- ground decals ---------- */
  leafLitter:{cat:'decal',w:2.2,tier:1,weight:4,cost:0,draw(c,x,y,u,v){const r=mulberry(v+8);TH.ell(c,x,y,u*2.1,u*0.9,'#3f5f36');for(let k=0;k<26;k++){const a=r()*6.283,rr=Math.sqrt(r());TH.ell(c,x+Math.cos(a)*u*1.9*rr,y+Math.sin(a)*u*0.8*rr,u*0.17,u*0.08,['#6a5a2e','#4e7a3a','#8a6a30','#355a2e','#7a4a2a'][k%5],r()*3);}}},
  lilyPond:{cat:'decal',w:2.2,tier:1,weight:2.5,cost:0,draw(c,x,y,u,v,tm){const r=mulberry(v+4),t=tm||0;TH.ell(c,x,y,u*2.2,u*1.0,'#3a5a3a');TH.ell(c,x,y,u*1.95,u*0.86,'#2f7f78');TH.ell(c,x-u*0.2,y-u*0.05,u*1.5,u*0.6,'#3a9a8e');
    c.strokeStyle='rgba(200,245,235,.5)';c.lineWidth=u*0.05;const ph=(t*0.4+v*0.3)%1;c.beginPath();c.ellipse(x+u*0.5,y+u*0.1,u*(0.2+ph*0.7),u*(0.1+ph*0.32),0,0,7);c.stroke();
    for(let k=0;k<5;k++){const px=x+(r()-0.5)*u*2.8,py=y+(r()-0.5)*u*0.9;TH.ell(c,px,py,u*0.36,u*0.18,'#4aa04a');TH.poly(c,[[px,py],[px+u*0.3,py-u*0.05],[px+u*0.3,py+u*0.05]],'#3a7f4a');if(k%2)TH.ell(c,px,py-u*0.05,u*0.1,u*0.07,'#f9a8d4');}}},
  mossyPaving:{cat:'decal',w:2.4,tier:2,weight:3,cost:0,draw(c,x,y,u,v){const I=(X,Y)=>TH.iso(x,y,u,X,Y,0),r=mulberry(v+2);for(let i=-2;i<=1;i++)for(let j=-1;j<=0;j++){if(r()<0.2)continue;const ox=r()*0.1,oy=r()*0.1;TH.poly(c,[I(i*1.1+ox,j*1.1+oy),I(i*1.1+1.0+ox,j*1.1+oy),I(i*1.1+1.0+ox,j*1.1+1.0+oy),I(i*1.1+ox,j*1.1+1.0+oy)],['#a9a58c','#9a967e','#b4b098'][(i+j+3)%3],'rgba(30,40,25,.5)',u*0.05);}
    for(let k=0;k<8;k++){const p=I(-2.2+r()*4.2,-1+r()*2);TH.ell(c,p[0],p[1],u*(0.2+r()*0.3),u*0.12,'rgba(70,120,55,.8)');}}},
  rootCrawl:{cat:'decal',w:2.2,tier:2,weight:2,cost:0,draw(c,x,y,u,v){const r=mulberry(v+6);for(let k=0;k<7;k++){const a=-2.8+k*0.9+(r()-0.5)*0.4,l=u*(1.2+r()*1.2);c.strokeStyle='#4a3a28';c.lineWidth=u*(0.22-k*0.012);c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+Math.cos(a)*l*0.5,y+Math.sin(a)*l*0.25-u*0.2,x+Math.cos(a)*l,y+Math.sin(a)*l*0.4);c.stroke();}
    TH.ell(c,x,y,u*0.4,u*0.22,'#3a2e20');}},
  /* ---------- jungle flora ---------- */
  fernCluster:{cat:'flora',w:1.6,tier:1,weight:4,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*5+2),t=tm||0;jsh(c,x,y,u*1.6,u*1.5);
    for(let k=0;k<9;k++){const a=-3.1+k*0.42,l=u*(1.7+r()*0.8),sw=Math.sin(t*1.3+k)*u*0.06,ex=x+Math.cos(a)*l+sw,ey=y-Math.abs(Math.sin(a))*l*0.9-u*0.2;c.strokeStyle=k%2?'#3f8f45':'#4aa14e';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(ex-x)*0.45,y-l*0.95,ex,ey);c.stroke();
      for(let q=1;q<8;q++){const f=q/8,px=x+(ex-x)*f*0.9,py=y+(ey-y)*f-Math.sin(f*3.0)*l*0.35;TH.ln(c,[px,py],[px+(f<0.9?-u*0.28:0),py+u*0.2],'#58b85a',u*0.06);TH.ln(c,[px,py],[px+u*0.28,py+u*0.2],'#58b85a',u*0.06);}}}},
  elephantEar:{cat:'flora',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v,tm){const t=tm||0;jsh(c,x,y,u*1.6,u*2.5);[[-0.9,-1.5,0.5,'#2f7f3f'],[0.8,-1.8,-0.4,'#3a8f48'],[0.0,-2.4,0.05,'#4aa356']].forEach(([dx,dy,rot,col],i)=>{const sw=Math.sin(t*1.2+i)*u*0.05;TH.ln(c,[x+dx*u*0.3,y],[x+dx*u+sw,y+dy*u*0.55],'#2a6a34',u*0.12);
      c.save();c.translate(x+dx*u+sw,y+dy*u);c.rotate(rot);c.fillStyle=col;c.beginPath();c.moveTo(0,u*0.9);c.bezierCurveTo(-u*1.4,u*0.3,-u*1.0,-u*1.1,0,-u*1.0);c.bezierCurveTo(u*1.0,-u*1.1,u*1.4,u*0.3,0,u*0.9);c.fill();c.strokeStyle='rgba(20,70,30,.55)';c.lineWidth=u*0.06;c.beginPath();c.moveTo(0,u*0.9);c.lineTo(0,-u*0.9);for(let k=-2;k<=2;k++){if(k){c.moveTo(0,u*0.1);c.lineTo(k*u*0.4,-u*0.5);}}c.stroke();c.restore();});}},
  heliconia:{cat:'flora',w:1.3,tier:1,weight:3,cost:1,draw(c,x,y,u,v){const r=mulberry(v*3+7);jsh(c,x,y,u*1.3,u*2.5);for(let k=0;k<4;k++){const bx=x+(k-1.5)*u*0.45,h=u*(2.0+r()*1.2);TH.ln(c,[bx,y],[bx+(r()-0.5)*u*0.3,y-h],'#2f7a3a',u*0.1);
      TH.poly(c,[[bx-u*0.5,y-h*0.3],[bx-u*0.05,y-h*0.55],[bx-u*0.1,y-h*0.2]],'#3a8f48');const cx=bx+(k%2?0.1:-0.1)*u;for(let q=0;q<4;q++){const py=y-h*(0.7+q*0.1);TH.poly(c,[[cx,py+u*0.3],[cx+(q%2?1:-1)*u*0.55,py+u*0.05],[cx,py-u*0.05],[cx+(q%2?1:-1)*u*0.15,py+u*0.2]],['#e0382b','#f06a2a','#f2b22b','#e0382b'][q],'#8a1d14',u*0.03);}}}},
  bamboo:{cat:'flora',w:1.5,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*11+3),t=tm||0;jsh(c,x,y,u*1.5,u*5);for(let k=0;k<7;k++){const bx=x+(k-3)*u*0.32,h=u*(4.6+r()*1.6),sw=Math.sin(t*1.1+k)*u*0.1+(k-3)*u*0.06,col=['#7aa83a','#8ab944','#6a9a34'][k%3];
      TH.ln(c,[bx,y],[bx+sw,y-h],'#4a6a24',u*0.28);TH.ln(c,[bx,y],[bx+sw,y-h],col,u*0.2);for(let q=1;q<7;q++){const f=q/7;TH.ln(c,[bx+sw*f-u*0.15,y-h*f],[bx+sw*f+u*0.15,y-h*f],'#4a6a24',u*0.06);}
      for(let q=0;q<3;q++){const f=0.7+q*0.1;TH.poly(c,[[bx+sw*f,y-h*f],[bx+sw*f+(q%2?1:-1)*u*1.1,y-h*f-u*0.15],[bx+sw*f+(q%2?1:-1)*u*0.3,y-h*f+u*0.12]],'#9acd4a','#5a8a28',u*0.03);}}}},
  palmTree:{cat:'tree',w:1.8,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*9+4),t=tm||0,H=u*(6.4+r()*1.4),lean=(r()-0.5)*u*2.0;jsh(c,x,y,u*2.0,H);
    c.strokeStyle='#6a5236';c.lineWidth=u*0.55;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*0.2,y-H*0.5,x+lean,y-H);c.stroke();c.strokeStyle='#8a6e4a';c.lineWidth=u*0.3;c.stroke();
    for(let k=1;k<12;k++){const f=k/12,px=(1-f)*(1-f)*x+2*(1-f)*f*(x+lean*0.2)+f*f*(x+lean),py=(1-f)*(1-f)*y+2*(1-f)*f*(y-H*0.5)+f*f*(y-H);TH.ln(c,[px-u*0.25,py],[px+u*0.25,py],'rgba(50,34,18,.5)',u*0.06);}
    const tx=x+lean,ty=y-H;for(let k=0;k<9;k++){const a=-3.1+k*0.52,sw=Math.sin(t*1.5+k*0.8)*0.08,l=u*(2.6+(k%2)*0.5);const ex=tx+Math.cos(a+sw)*l,ey=ty+Math.sin(a+sw)*l*0.5+u*0.8;
      c.strokeStyle=k%2?'#2f7f3a':'#3f9a48';c.lineWidth=u*0.18;c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+(ex-tx)*0.55,ty-u*1.2-Math.abs(Math.sin(a))*u*0.6,ex,ey);c.stroke();
      for(let q=1;q<7;q++){const f=q/7,px=tx+(ex-tx)*f,py=ty+(ey-ty)*f-Math.sin(f*3.14)*u*1.0;TH.ln(c,[px,py],[px-(ey-ty)*0.12-u*0.1,py+u*0.5],'#48a852',u*0.07);TH.ln(c,[px,py],[px+(ey-ty)*0.1+u*0.1,py+u*0.5],'#48a852',u*0.07);}}
    [[-0.25,0.35],[0.25,0.4],[0,0.6]].forEach(([dx,dy])=>TH.ell(c,tx+dx*u,ty+dy*u,u*0.28,u*0.28,'#6a4a22'));}},
  kapokTree:{cat:'tree',w:2.6,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v,tm){const r=mulberry(v*7+5),t=tm||0,H=u*5.2;jsh(c,x,y,u*3.0,u*9);
    for(let k=0;k<5;k++){const a=-2.7+k*0.55,l=u*(1.5+r()*0.7);TH.poly(c,[[x+Math.cos(a)*u*0.2,y-u*2.4],[x+Math.cos(a)*l,y+Math.sin(a)*l*0.28+u*0.1],[x+Math.cos(a)*l*0.5+u*0.3,y+Math.sin(a)*l*0.15+u*0.2],[x+u*0.1,y-u*2.8]],k%2?'#6b5a48':'#7a6853');}
    TH.poly(c,[[x-u*0.7,y-u*0.2],[x-u*0.5,y-H],[x+u*0.5,y-H],[x+u*0.7,y-u*0.2]],'#8a7a66');TH.poly(c,[[x+u*0.1,y-H],[x+u*0.5,y-H],[x+u*0.7,y-u*0.2],[x+u*0.15,y-u*0.2]],'rgba(30,24,16,.35)');
    const cols=['#2f6a3a','#3a7a44','#2a5e34','#438a4c'];[[0,-2.4,3.0,2.1],[-2.3,-1.1,2.1,1.5],[2.3,-1.2,2.1,1.5],[0.1,-0.7,2.6,1.6],[-1.2,-3.4,1.9,1.4],[1.4,-3.2,1.8,1.3]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H+dy*u,u*rx,u*ry,cols[i%4],r,10));
    for(let k=0;k<7;k++){const vx=x+(r()-0.5)*u*5.0,vy=y-H+u*(0.0+r()*1.0),l=u*(1.8+r()*2.2),sw=Math.sin(t*0.9+k)*u*0.1;c.strokeStyle=k%2?'#3f6a3a':'#4a7a3a';c.lineWidth=u*0.07;c.beginPath();c.moveTo(vx,vy);c.quadraticCurveTo(vx+sw,vy+l*0.5,vx+sw*1.5,vy+l);c.stroke();}}},
  /* ---------- ruin props ---------- */
  mossBoulder:{cat:'rock',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*13+3);jsh(c,x,y,u*1.9,u*1.4);[[0.0,0.0,1.0,1.0,'#7d7f70'],[-1.0,0.2,0.65,0.6,'#6e7062'],[0.9,0.25,0.6,0.55,'#8a8c7c']].forEach(([dx,dy,sx,sy,col])=>TH.blob(c,x+dx*u,y-u*0.55*sy+dy*u,u*0.9*sx,u*0.75*sy,col,r,9));
    for(let k=0;k<5;k++)TH.ell(c,x+(r()-0.5)*u*1.5,y-u*(0.2+r()*0.8),u*0.3,u*0.14,'rgba(88,140,64,.85)');}},
  fallenColumn:{cat:'rock',w:2.4,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+2);jsh(c,x,y,u*2.4,u*2);
    [[-2.0,-0.9,0.7],[0.0,0.1,0.65],[1.7,-0.4,0.6]].forEach(([X,Y,rr],i)=>{const a=I(X-0.7,Y,rr),b=I(X+0.7,Y,rr);TH.ln(c,a,b,J.stD,u*rr*2.1);TH.ln(c,a,b,J.st,u*rr*1.7);TH.ln(c,[a[0],a[1]-u*rr*0.4],[b[0],b[1]-u*rr*0.4],J.stL,u*rr*0.5);TH.ell(c,a[0],a[1],u*rr*0.55,u*rr*0.9,J.stD);TH.ell(c,a[0],a[1],u*rr*0.3,u*rr*0.5,'#6e6a56');for(let k=0;k<3;k++){const p=I(X-0.4+k*0.4,Y,rr);TH.ln(c,[p[0],p[1]-u*rr*0.9],[p[0],p[1]+u*rr*0.9],'rgba(50,48,34,.3)',u*0.05);}});
    TH.ell(c,x-u*0.9,y-u*0.5,u*0.8,u*0.2,'rgba(80,130,60,.8)');TH.ell(c,x+u*1.6,y-u*0.35,u*0.6,u*0.16,'rgba(70,120,55,.8)');}},
  stela:{cat:'ruin',w:1.3,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+5);jsh(c,x,y,u*1.3,u*4);jbox(c,x,y,u,-0.9,0.9,-0.5,0.5,0,0.4,-0.1);
    TH.poly(c,[I(0.7,-0.2,0.4),I(0.7,0.2,0.4),I(0.7,0.2,4.0),I(0.7,-0.2,4.0)],J.stD);TH.poly(c,[I(-0.7,-0.2,4.0),I(0.7,-0.2,4.0),I(0.7,0.2,4.0),I(-0.7,0.2,4.0)],J.stL);TH.poly(c,[I(-0.7,0.2,0.4),I(0.7,0.2,0.4),I(0.7,0.2,4.0),I(-0.7,0.2,4.0)],J.st);
    jmask(c,x,y,u,0,0.21,3.0,0.9);glyphs(c,x,y,u,-0.6,0.6,0.21,0.7,2.2,r);jmoss(c,x-u*0.3,y+u*0.2,u,r,3);}},
  glyphBlock:{cat:'ruin',w:1.3,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v+3);jsh(c,x,y,u*1.4,u*2);jbox(c,x,y,u,-1.0,1.0,-0.8,0.8,0,1.6);jmask(c,x,y,u,0,0.81,0.85,0.9);jbox(c,x,y,u,-0.6,0.5,-0.5,0.4,1.6,2.1,-0.05);jmask(c,x,y,u,-0.05,0.41,1.85,0.4);jmoss(c,x,y+u*0.3,u,r,4);}},
  chacMool:{cat:'ruin',w:1.7,tier:3,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+8);jsh(c,x,y,u*1.8,u*2);jbox(c,x,y,u,-1.6,1.6,-0.9,0.9,0,0.6,-0.08);
    jbox(c,x,y,u,-1.0,1.1,-0.5,0.5,0.6,1.3);TH.poly(c,[I(-1.2,-0.4,0.6),I(-1.0,-0.4,0.6),I(-1.0,-0.4,1.1),I(-1.2,-0.4,1.1)],J.st);jbox(c,x,y,u,1.0,1.6,-0.3,0.6,0.9,1.5,0.05);TH.ell(c,...I(1.3,0.15,1.7),u*0.3,u*0.3,J.stL);
    TH.ell(c,...I(0.0,0.0,1.35),u*0.45,u*0.22,'#6e6a56');TH.ell(c,...I(0.0,0.0,1.38),u*0.34,u*0.16,'#2b2a22');[[-0.6,0.45],[-0.6,-0.45]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0.9),I(0.1,Y*0.4,1.25),J.st,u*0.22));jmoss(c,x,y+u*0.3,u,r,4);}},
  jaguarStatue:{cat:'ruin',w:1.5,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const r=mulberry(v+4);jsh(c,x,y,u*1.6,u*2);jbox(c,x,y,u,-1.3,1.3,-0.8,0.8,0,0.7,-0.06);const by=y-u*0.7;
    TH.poly(c,[[x-u*1.1,by],[x-u*1.0,by-u*0.9],[x-u*0.3,by-u*1.2],[x+u*0.5,by-u*1.0],[x+u*0.9,by-u*0.3],[x+u*1.0,by]],J.st);TH.poly(c,[[x+u*0.5,by-u*1.0],[x+u*0.9,by-u*0.3],[x+u*1.0,by],[x+u*0.2,by]],'rgba(40,40,28,.35)');
    TH.ln(c,[x-u*1.1,by-u*0.4],[x-u*1.5,by-u*0.9],J.st,u*0.22);TH.poly(c,[[x+u*0.2,by-u*1.1],[x+u*0.9,by-u*1.5],[x+u*1.4,by-u*1.3],[x+u*1.5,by-u*0.7],[x+u*0.9,by-u*0.4],[x+u*0.4,by-u*0.5]],J.stL);
    TH.poly(c,[[x+u*0.4,by-u*1.5],[x+u*0.5,by-u*1.9],[x+u*0.8,by-u*1.5]],J.stL);TH.ell(c,x+u*1.0,by-u*1.0,u*0.1,u*0.1,J.jade);for(let k=0;k<5;k++)TH.ell(c,x-u*0.7+k*u*0.3,by-u*(0.5+(k%2)*0.35),u*0.08,u*0.07,'rgba(40,40,28,.5)');jmoss(c,x,y+u*0.2,u,r,3);}},
  serpentHead:{cat:'ruin',w:1.9,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v){const r=mulberry(v+6);jsh(c,x,y,u*2.0,u*3);
    c.strokeStyle=J.stD;c.lineWidth=u*1.2;c.lineCap='round';c.beginPath();c.moveTo(x+u*2.6,y);c.quadraticCurveTo(x+u*2.2,y-u*1.8,x+u*0.9,y-u*1.4);c.stroke();c.strokeStyle=J.st;c.lineWidth=u*0.9;c.stroke();
    for(let k=0;k<5;k++){const f=k/5;TH.ln(c,[x+u*(2.6-f*1.5),y-u*(f*1.6)-u*0.2],[x+u*(2.6-f*1.5)+u*0.25,y-u*(f*1.6)-u*0.1],'rgba(50,48,34,.4)',u*0.07);}
    jbox(c,x,y,u,-1.4,0.9,-0.9,0.9,0,2.2);TH.poly(c,[[x-u*1.3,y-u*1.5],[x-u*0.4,y-u*2.9],[x+u*0.4,y-u*2.9],[x+u*1.3,y-u*1.5]],J.stL);
    jmask(c,x,y,u,-0.25,0.91,1.2,0.9);TH.ell(c,x-u*0.5,y-u*1.8,u*0.2,u*0.2,J.jade);TH.ell(c,x+u*0.15,y-u*1.8,u*0.2,u*0.2,J.jade);
    TH.poly(c,[[x-u*1.1,y-u*0.3],[x+u*0.7,y-u*0.3],[x+u*0.5,y+u*0.5],[x-u*0.9,y+u*0.5]],'#2b2a22');[[-0.9,0.5],[-0.3,0.5],[0.3,0.5]].forEach(([dx,dy])=>TH.poly(c,[[x+dx*u-u*0.15,y+dy*u-u*0.8],[x+dx*u+u*0.15,y+dy*u-u*0.8],[x+dx*u,y+dy*u-u*0.05]],'#f0ecd8'));TH.poly(c,[[x-u*0.2,y+u*0.1],[x+u*0.2,y+u*0.1],[x,y+u*0.9]],'#b3342f');
    for(let k=0;k<5;k++){const a=-0.4-k*0.35;TH.poly(c,[[x-u*0.4+k*u*0.25,y-u*2.9],[x-u*0.7+k*u*0.4,y-u*3.8-(k%2)*u*0.4],[x-u*0.1+k*u*0.3,y-u*2.9]],[J.turq,J.jade,'#e0382b','#f2b22b','#2f8fd0'][k]);}jmoss(c,x,y+u*0.3,u,r,4);}},
  stoneAltar:{cat:'ruin',w:1.6,tier:3,weight:2.5,cost:1,max:1,draw(c,x,y,u,v,tm){const r=mulberry(v+9),t=tm||0;jsh(c,x,y,u*1.7,u*2);jbox(c,x,y,u,-1.4,1.4,-1.0,1.0,0,0.5,-0.08);jbox(c,x,y,u,-1.1,1.1,-0.7,0.7,0.5,1.5);jmask(c,x,y,u,0,0.71,0.95,0.6);
    TH.ell(c,x,y-u*1.65,u*0.8,u*0.34,'#5e5b48');TH.ell(c,x,y-u*1.7,u*0.65,u*0.27,'#2b2a22');jglow(c,x,y-u*2.3,u*2.4,'255,160,60',0.4+0.1*Math.sin(t*9+v));
    [[0,1.1,0.8],[-0.3,0.75,0.55],[0.3,0.8,0.6]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*11+i*2+v)*u*0.1;TH.poly(c,[[x+dx*u-u*0.3*w,y-u*1.7],[x+dx*u+f,y-u*(1.7+h*1.2)],[x+dx*u+u*0.3*w,y-u*1.7]],i?'#fbbf24':'#f97316');});jmoss(c,x,y+u*0.3,u,r,3);}},
  /* ---------- props ---------- */
  torchPost:{cat:'prop',w:0.9,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v,tm){const t=tm||0;jsh(c,x,y,u,u*4);jbox(c,x,y,u,-0.5,0.5,-0.5,0.5,0,0.5,-0.06);TH.ln(c,[x,y-u*0.4],[x,y-u*2.6],'#6b5a3e',u*0.34);TH.ln(c,[x,y-u*1.2],[x,y-u*1.6],J.turq,u*0.4);
    TH.poly(c,[[x-u*0.5,y-u*2.5],[x+u*0.5,y-u*2.5],[x+u*0.35,y-u*3.0],[x-u*0.35,y-u*3.0]],'#4a3d2a');jglow(c,x,y-u*3.5,u*2.4,'255,160,60',0.4+0.1*Math.sin(t*10+v));
    [[0,1.1,0.8],[-0.25,0.75,0.55],[0.25,0.8,0.6]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*12+i*2+v)*u*0.1;TH.poly(c,[[x+dx*u-u*0.3*w,y-u*3.0],[x+dx*u+f,y-u*(3.0+h*1.2)],[x+dx*u+u*0.3*w,y-u*3.0]],i?'#fbbf24':'#f97316');});}},
  clayPots:{cat:'prop',w:1.4,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u,v){jsh(c,x,y,u*1.5,u*1.5);const pot=(px,py,s,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(px-u*0.45*s,py-u*1.1*s);c.bezierCurveTo(px-u*0.9*s,py-u*0.7*s,px-u*0.7*s,py,px-u*0.3*s,py);c.lineTo(px+u*0.3*s,py);c.bezierCurveTo(px+u*0.7*s,py,px+u*0.9*s,py-u*0.7*s,px+u*0.45*s,py-u*1.1*s);c.closePath();c.fill();
      c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.moveTo(px+u*0.1*s,py-u*1.1*s);c.bezierCurveTo(px+u*0.5*s,py-u*0.9*s,px+u*0.6*s,py-u*0.2*s,px+u*0.3*s,py);c.lineTo(px+u*0.1*s,py);c.fill();TH.ell(c,px,py-u*1.1*s,u*0.45*s,u*0.17*s,'#2a1c12');TH.ln(c,[px-u*0.7*s,py-u*0.55*s],[px+u*0.7*s,py-u*0.55*s],J.turq,u*0.1*s);TH.ln(c,[px-u*0.55*s,py-u*0.3*s],[px+u*0.55*s,py-u*0.3*s],'#f2d24a',u*0.07*s);};
    pot(x-u*0.9,y+u*0.1,0.9,'#c4683a');pot(x+u*0.5,y+u*0.2,1.15,'#b5532f');TH.ell(c,x-u*0.1,y+u*0.5,u*0.55,u*0.2,'#a5502f');TH.ell(c,x-u*0.1,y+u*0.38,u*0.4,u*0.13,'#e8b04a');[[-0.2,0.3],[0.05,0.28]].forEach(([dx,dy],i)=>TH.ell(c,x+dx*u,y+dy*u,u*0.18,u*0.18,['#f06a2a','#f2c230'][i]));}},
  macaw:{cat:'prop',w:0.9,tier:1,weight:3,cost:1,max:1,draw(c,x,y,u,v,tm){const t=tm||0,by=y-u*1.8;jsh(c,x,y,u*0.8,u*3);TH.ln(c,[x,y],[x,y-u*1.7],'#6b5a3e',u*0.2);TH.ln(c,[x-u*0.9,y-u*1.7],[x+u*0.9,y-u*1.7],'#6b5a3e',u*0.16);
    TH.poly(c,[[x-u*0.3,by-u*0.3],[x-u*0.9,by+u*1.1],[x-u*0.55,by+u*1.3],[x-u*0.2,by+u*0.2]],'#2f6fd0');TH.poly(c,[[x-u*0.4,by-u*0.3],[x-u*0.7,by+u*0.9],[x-u*0.5,by+u*1.0],[x-u*0.25,by+u*0.1]],'#e0382b');
    TH.ell(c,x,by-u*0.5,u*0.5,u*0.8,'#d9342b',-0.2);TH.ell(c,x+u*0.15,by-u*0.35,u*0.28,u*0.5,'#f2c230',-0.2);TH.poly(c,[[x-u*0.4,by-u*0.5],[x-u*0.1,by-u*0.9],[x+u*0.15,by-u*0.2]],'#2f6fd0');
    const hb=Math.sin(t*3+v)*u*0.04;TH.ell(c,x+u*0.2,by-u*1.35+hb,u*0.3,u*0.3,'#d9342b');TH.ell(c,x+u*0.3,by-u*1.35+hb,u*0.16,u*0.18,'#f8fafc');TH.ell(c,x+u*0.32,by-u*1.38+hb,u*0.05,u*0.05,'#161616');TH.poly(c,[[x+u*0.45,by-u*1.5+hb],[x+u*0.85,by-u*1.3+hb],[x+u*0.5,by-u*1.15+hb]],'#3a3a3a');TH.poly(c,[[x+u*0.45,by-u*1.5+hb],[x+u*0.8,by-u*1.38+hb],[x+u*0.5,by-u*1.32+hb]],'#f0e8d0');
    TH.ln(c,[x-u*0.1,by+u*0.1],[x-u*0.1,by+u*0.4],'#4a4a4a',u*0.06);TH.ln(c,[x+u*0.2,by+u*0.1],[x+u*0.2,by+u*0.4],'#4a4a4a',u*0.06);}},
  tikiTotem:{cat:'prop',w:1.0,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const r=mulberry(v+2);jsh(c,x,y,u,u*5);TH.ln(c,[x,y],[x,y-u*5.2],'#5a4028',u*1.1);TH.ln(c,[x-u*0.15,y],[x-u*0.15,y-u*5.1],'#7a5836',u*0.35);
    ['#b5532f','#1fb5a8','#e0b53a','#b5532f'].forEach((col,i)=>{const cy=y-u*(0.9+i*1.2);TH.poly(c,[[x-u*0.55,cy-u*0.5],[x+u*0.55,cy-u*0.5],[x+u*0.55,cy+u*0.5],[x-u*0.55,cy+u*0.5]],col,'#2a1c12',u*0.05);[-0.2,0.2].forEach(e=>{TH.ell(c,x+e*u,cy-u*0.1,u*0.13,u*0.13,'#f8fafc');TH.ell(c,x+e*u,cy-u*0.1,u*0.06,u*0.06,'#161616');});TH.ln(c,[x-u*0.25,cy+u*0.22],[x+u*0.25,cy+u*0.22],'#2a1c12',u*0.1);TH.ln(c,[x,cy],[x,cy+u*0.12],'#2a1c12',u*0.07);});
    TH.poly(c,[[x-u*0.4,y-u*5.15],[x,y-u*5.9],[x+u*0.4,y-u*5.15]],'#e0382b');TH.poly(c,[[x-u*1.1,y-u*3.5],[x-u*0.55,y-u*3.9],[x-u*0.55,y-u*3.1]],'#1fb5a8');TH.poly(c,[[x+u*1.1,y-u*3.5],[x+u*0.55,y-u*3.9],[x+u*0.55,y-u*3.1]],'#1fb5a8');}},
  smallShrine:{cat:'structure',w:2.3,tier:3,weight:3,cost:2,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+3);jsh(c,x,y,u*2.6,u*4);jbox(c,x,y,u,-2.2,2.2,-2.0,2.0,0,0.7,-0.06);jbox(c,x,y,u,-1.8,1.8,-1.6,1.6,0.7,1.3,-0.03);
    jbox(c,x,y,u,-1.3,1.3,-1.1,1.1,1.3,3.5);TH.poly(c,[I(-0.5,1.11,1.3),I(0.5,1.11,1.3),I(0.5,1.11,2.8),I(-0.5,1.11,2.8)],J.dark);TH.ln(c,I(-0.55,1.12,2.85),I(0.55,1.12,2.85),J.stL,u*0.14);glyphs(c,x,y,u,-1.2,-0.6,1.11,1.5,3.2,r);glyphs(c,x,y,u,0.6,1.2,1.11,1.5,3.2,r);
    jbox(c,x,y,u,-1.5,1.5,-1.3,1.3,3.5,3.9,0.05);jbox(c,x,y,u,-0.8,0.8,-0.4,0.4,3.9,5.3);[[-0.4,4.3],[0.3,4.7],[-0.2,5.0]].forEach(([X,Z])=>TH.poly(c,[I(X,0.41,Z),I(X+0.25,0.41,Z),I(X+0.25,0.41,Z+0.3),I(X,0.41,Z+0.3)],J.dark));
    for(let k=0;k<9;k++)TH.ln(c,I(-0.5,1.8+k*0.0,0),I(0.5,1.8,0),'rgba(0,0,0,0)',1);jmoss(c,x-u*1.3,y+u*0.9,u,r,4);jmoss(c,x+u*1.1,y+u*0.5,u,r,3);}},
  /* ---------- landmarks ---------- */
  stepPyramid:{cat:'landmark',w:4.6,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+3),n=6,th=1.15,top=n*th,t=tm||0;jsh(c,x,y,u*5.2,u*9);
    for(let i=0;i<n;i++){const s=4.4-i*0.62;jbox(c,x,y,u,-s,s,-s,s,i*th,(i+1)*th,i%2?-0.02:0.03);TH.ln(c,I(-s,s,(i+1)*th),I(s,s,(i+1)*th),'rgba(255,255,240,.22)',u*0.07);
      for(let k=-3;k<=3;k++){if(Math.abs(k*s*0.3)<1.2)continue;const X=k*s*0.3;TH.poly(c,[I(X-0.15,s+0.01,i*th+0.3),I(X+0.15,s+0.01,i*th+0.3),I(X+0.15,s+0.01,i*th+0.75),I(X-0.15,s+0.01,i*th+0.75)],'rgba(30,34,24,.5)');}
      if(i<4)glyphs(c,x,y,u,-s+0.3,-1.2,s+0.01,i*th+0.15,(i+1)*th-0.1,r);}
    const Ya=4.6,Yb=1.4;TH.poly(c,[I(-0.85,Ya,0),I(0.85,Ya,0),I(0.85,Yb,top),I(-0.85,Yb,top)],'#d0ccb4');for(let k=1;k<30;k++){const f=k/30;TH.ln(c,I(-0.85,Ya+(Yb-Ya)*f,top*f),I(0.85,Ya+(Yb-Ya)*f,top*f),'rgba(70,66,48,.4)',u*0.04);}
    [-1,1].forEach(s=>TH.ln(c,I(s*1.0,Ya,0.25),I(s*1.0,Yb,top+0.25),J.stL,u*0.34));TH.poly(c,[I(-1.0,Ya,0),I(-0.85,Ya,0),I(-0.85,Yb,top),I(-1.0,Yb,top)],'rgba(30,30,20,.22)');
    const ts=1.5;jbox(c,x,y,u,-ts,ts,-ts,ts,top,top+1.8);TH.poly(c,[I(-0.5,ts+0.01,top),I(0.5,ts+0.01,top),I(0.5,ts+0.01,top+1.35),I(-0.5,ts+0.01,top+1.35)],J.dark);jmask(c,x,y,u,-1.0,ts+0.01,top+0.9,0.5);jmask(c,x,y,u,1.0,ts+0.01,top+0.9,0.5);
    jbox(c,x,y,u,-ts-0.15,ts+0.15,-ts-0.15,ts+0.15,top+1.8,top+2.1,0.06);jbox(c,x,y,u,-0.95,0.95,-0.5,0.5,top+2.1,top+3.4);[[-0.5,2.5],[0.2,2.9],[-0.2,3.1]].forEach(([X,Z])=>TH.poly(c,[I(X,0.51,top+Z-0.1),I(X+0.3,0.51,top+Z-0.1),I(X+0.3,0.51,top+Z+0.2),I(X,0.51,top+Z+0.2)],J.dark));
    for(let k=0;k<10;k++){const s=4.3-r()*3.2,i=Math.floor(r()*4);TH.blob(c,...I(-s+r()*1.5,s+0.05,i*th+0.5),u*(0.4+r()*0.5),u*0.22,k%2?'#4a7a3a':'#5f8a47',r,7);}
    const f=I(0,0,top+3.4);jglow(c,f[0],f[1]-u*0.5,u*2.4,'255,160,60',0.25+0.08*Math.sin(t*6));}},
  templeShrine:{cat:'landmark',w:3.0,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+5),n=3,th=1.1,top=n*th;jsh(c,x,y,u*3.3,u*6);
    for(let i=0;i<n;i++){const s=3.0-i*0.6;jbox(c,x,y,u,-s,s,-s,s,i*th,(i+1)*th,i%2?-0.02:0.03);TH.ln(c,I(-s,s,(i+1)*th),I(s,s,(i+1)*th),'rgba(255,255,240,.22)',u*0.07);glyphs(c,x,y,u,-s+0.3,-0.8,s+0.01,i*th+0.15,(i+1)*th-0.1,r);}
    const Ya=3.2,Yb=1.3;TH.poly(c,[I(-0.7,Ya,0),I(0.7,Ya,0),I(0.7,Yb,top),I(-0.7,Yb,top)],'#d0ccb4');for(let k=1;k<18;k++){const f=k/18;TH.ln(c,I(-0.7,Ya+(Yb-Ya)*f,top*f),I(0.7,Ya+(Yb-Ya)*f,top*f),'rgba(70,66,48,.4)',u*0.04);}
    const ts=1.2;jbox(c,x,y,u,-ts,ts,-ts,ts,top,top+1.6);TH.poly(c,[I(-0.45,ts+0.01,top),I(0.45,ts+0.01,top),I(0.45,ts+0.01,top+1.2),I(-0.45,ts+0.01,top+1.2)],J.dark);jbox(c,x,y,u,-ts-0.12,ts+0.12,-ts-0.12,ts+0.12,top+1.6,top+1.9,0.06);jbox(c,x,y,u,-0.8,0.8,-0.4,0.4,top+1.9,top+3.0);
    [[-0.4,2.3],[0.2,2.6]].forEach(([X,Z])=>TH.poly(c,[I(X,0.41,top+Z-0.1),I(X+0.25,0.41,top+Z-0.1),I(X+0.25,0.41,top+Z+0.2),I(X,0.41,top+Z+0.2)],J.dark));
    for(let k=0;k<8;k++)TH.blob(c,...I(-2.6+r()*2.0,3.0+0.05,r()*2.2+0.4),u*(0.4+r()*0.5),u*0.22,k%2?'#4a7a3a':'#5f8a47',r,7);jmoss(c,x+u*1.8,y+u*0.8,u,r,4);}},
  ballCourt:{cat:'landmark',w:4.0,tier:3,weight:2.5,cost:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+7);jsh(c,x,y,u*4,u*5);TH.poly(c,[I(-3.4,-1.0,0),I(3.4,-1.0,0),I(3.4,1.0,0),I(-3.4,1.0,0)],'#c9b98a');for(let k=0;k<12;k++)TH.ln(c,I(-3.2+k*0.58,-0.9,0),I(-3.2+k*0.58,0.9,0),'rgba(100,80,40,.25)',u*0.05);TH.ln(c,I(-3.4,0,0),I(3.4,0,0),'rgba(100,80,40,.45)',u*0.07);
    jbox(c,x,y,u,-3.6,3.6,-3.2,-1.5,0,2.8);TH.poly(c,[I(-3.6,-1.5,2.8),I(3.6,-1.5,2.8),I(3.6,-0.9,0),I(-3.6,-0.9,0)],J.st);for(let k=1;k<7;k++){const f=k/7;TH.ln(c,I(-3.6,-1.5+0.6*f,2.8*(1-f)),I(3.6,-1.5+0.6*f,2.8*(1-f)),'rgba(60,56,40,.22)',u*0.05);}
    glyphs(c,x,y,u,-3.4,-1.2,-0.91,0.2,1.8,r);const rc=I(0,-1.5,3.9);c.strokeStyle='#8e8a72';c.lineWidth=u*0.55;c.beginPath();for(let a=0;a<=24;a++){const t=a/24*6.283,p=I(Math.cos(t)*0.9,-1.5,3.9+Math.sin(t)*0.9);a?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();c.strokeStyle=J.stL;c.lineWidth=u*0.2;c.stroke();jmask(c,x,y,u,1.9,-1.49,2.1,0.6);
    jbox(c,x,y,u,-3.6,3.6,1.5,3.2,0,1.9,-0.04);TH.poly(c,[I(-3.6,1.5,1.9),I(3.6,1.5,1.9),I(3.6,1.0,1.4),I(-3.6,1.0,1.4)],'#a9a58c');glyphs(c,x,y,u,-3.4,3.2,3.21,0.3,1.6,r);
    jbox(c,x,y,u,-3.9,-3.2,-0.6,0.6,0,1.4,0.04);jbox(c,x,y,u,3.2,3.9,-0.6,0.6,0,1.4,0.04);for(let k=0;k<9;k++)TH.blob(c,...I(-3.4+r()*6.8,r()<0.5?-2.4:2.5,2.8+r()*0.1),u*(0.3+r()*0.4),u*0.18,k%2?'#4a7a3a':'#5f8a47',r,7);}},
  corbelArch:{cat:'landmark',w:3.2,tier:3,weight:3,cost:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+4);jsh(c,x,y,u*3.2,u*6);TH.poly(c,[I(-1.8,0.0,0),I(1.8,0.0,0),I(0,0.0,5.0)],'#0f1514');
    for(let i=0;i<6;i++){const z0=i*0.95,z1=z0+0.95;jbox(c,x,y,u,-3.1,-1.8+0.42*i,-0.9,0.9,z0,z1,i%2?-0.03:0.02);if(i<4)jbox(c,x,y,u,1.8-0.42*i,3.1,-0.9,0.9,z0,z1,i%2?0.02:-0.03);}
    jbox(c,x,y,u,1.2,3.1,-0.9,0.9,3.8,4.2,-0.04);for(let k=0;k<5;k++)jbox(c,x,y,u,0.6+r()*2.2,1.0+r()*2.2,0.5+r()*0.9,0.8+r()*1.1,0,0.4+r()*0.5,-0.1+r()*0.15);
    jbox(c,x,y,u,-1.3,1.3,-0.7,0.7,5.7,6.2,0.04);jbox(c,x,y,u,-0.5,0.5,-0.3,0.3,6.2,7.5);[[-0.2,6.5],[0.1,6.9]].forEach(([X,Z])=>TH.poly(c,[I(X-0.1,0.31,Z),I(X+0.15,0.31,Z),I(X+0.15,0.31,Z+0.25),I(X-0.1,0.31,Z+0.25)],J.dark));
    glyphs(c,x,y,u,-3.0,-2.0,0.91,0.3,4.0,r);jmask(c,x,y,u,-2.45,0.91,4.2,0.55);
    for(let k=0;k<8;k++){const sx=-3.0+r()*6;TH.ln(c,I(sx,0.95,3.0+r()*2),I(sx+(r()-0.5)*0.3,0.95,1.0+r()*1.5),r()<0.5?'#3f6a3a':'#4a7a3a',u*0.07);}jmoss(c,x-u*2.2,y+u*0.8,u,r,4);jmoss(c,x+u*2.0,y+u*0.6,u,r,3);}}
  }};
const JUNGLE_HEIGHT={fernCluster:'low',elephantEar:'low',heliconia:'low',mossBoulder:'low',fallenColumn:'low',glyphBlock:'low',chacMool:'low',jaguarStatue:'low',serpentHead:'low',stoneAltar:'low',torchPost:'low',clayPots:'low',macaw:'low',
  bamboo:'mid',palmTree:'mid',kapokTree:'mid',stela:'mid',tikiTotem:'mid',smallShrine:'mid',stepPyramid:'tall',templeShrine:'tall',ballCourt:'tall',corbelArch:'tall'};
Object.keys(JUNGLE_PACK.assets).forEach(id=>{JUNGLE_PACK.assets[id].h=JUNGLE_HEIGHT[id]||'low';});
const KEEP_OUT={rx:0.52,ry:0.34};   // central ellipse (x R) reserved for the ride or building sprite
/* opts.avoid = [{x,y,r}] circles (tile-local px) to keep free, used instead of the central ellipse when the tile belongs to a two-tile ride */
function placeThemeAssets(pack,tier,R,seed,opts){
  opts=opts||{};const avoid=opts.avoid||null;
  const rnd=mulberry(seed*7919+tier*131), u=R*0.068, T=pack.tiers[tier], out=[], decals=[], TAU=Math.PI*2;
  if(!T)return {assets:out,decals,u};
  const inside=(x,y,k)=>{const X=Math.abs(x)/R,Y=Math.abs(y)/(0.58*R);return X<=0.866*k&&Y<=k-X/1.732;};
  const ids=Object.keys(pack.assets), cnt={};
  const free=(x,y,w)=>out.every(o=>Math.hypot(o.x-x,(o.y-y)*1.7)>(o.w+w)*u*0.8);
  const clearOfCenter=(x,y,w,h)=>{if(avoid){const kk=h==='tall'?0.75:0.85;for(const a of avoid){if(Math.hypot(x-a.x,(y-a.y)*1.7)<a.r+w*u*kk)return false;}return true;}const kx=h==='tall'?0.28:0.75,ky=h==='tall'?0.18:0.4,ex=R*KEEP_OUT.rx+w*u*kx,ey=R*KEEP_OUT.ry+w*u*ky;return x*x/(ex*ex)+y*y/(ey*ey)>1;};
  const zoneOK=(a,x,y)=>{const h=a.h||'low';if(h==='low')return true;const ax=Math.abs(x)/R;
    if(h==='tall')return y<R*0.12&&ax>(y>=-R*0.12?0.55:0.4);
    if(y>R*0.12)return h==='mid'&&ax>0.5;if(y>=-R*0.12)return h==='mid'||ax>0.55;return true;};
  const ringPoint=(tmax)=>{const th=rnd()*TAU,dx=Math.cos(th),dy=Math.sin(th);let lo=0,hi=R*1.2;
    for(let i=0;i<12;i++){const m=(lo+hi)/2;if(inside(dx*m,dy*m,0.9))lo=m;else hi=m;}const t=0.5+rnd()*((tmax||1)-0.5);return[dx*lo*t,dy*lo*t];};
  const spot=a=>{for(let i=0;i<120;i++){const p=ringPoint(a.h==='tall'?0.8:a.h==='mid'?0.92:1);if(clearOfCenter(p[0],p[1],a.w,a.h)&&zoneOK(a,p[0],p[1])&&free(p[0],p[1],a.w))return p;}return null;};
  const add=(id,x,y)=>{const a=pack.assets[id];out.push({id,x,y,v:Math.floor(rnd()*1000),w:a.w});cnt[id]=(cnt[id]||0)+1;};
  for(let i=0;i<Math.round(T.decals*(opts.decalScale==null?1:opts.decalScale));i++){const pool=ids.filter(id=>pack.assets[id].cat==='decal'&&pack.assets[id].tier<=tier),id=pool[Math.floor(rnd()*pool.length)];
    for(let t=0;t<40;t++){const p=ringPoint();if(clearOfCenter(p[0],p[1],pack.assets[id].w*0.5)){decals.push({id,x:p[0],y:p[1],v:Math.floor(rnd()*1000)});break;}}}
  let budget=Math.max(0,Math.round(T.budget*(opts.budgetScale==null?1:opts.budgetScale)));const maxW=opts.maxW==null?1e9:opts.maxW;
  const land=()=>{let id=T.pool[Math.floor(rnd()*T.pool.length)];for(let q=0;q<8&&cnt[id];q++)id=T.pool[Math.floor(rnd()*T.pool.length)];
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}};
  if(!opts.noLandmarks&&T.pool.length&&rnd()<T.landmark){land();if(T.second&&rnd()<T.second)land();}
  let guard=0;while(budget>0&&guard++<500){const pool=ids.filter(id=>{const a=pack.assets[id];return a.cat!=='decal'&&a.cat!=='landmark'&&a.tier<=tier&&a.cost<=budget&&a.w<=maxW&&(cnt[id]||0)<(a.max||3);});
    if(!pool.length)break;let tot=0;pool.forEach(id=>tot+=pack.assets[id].weight);let pick=rnd()*tot,id=pool[0];for(const q of pool){pick-=pack.assets[q].weight;if(pick<=0){id=q;break;}}
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}else{cnt[id]=99;}}
  return {assets:out,decals,u};
}
function drawThemeGround(ctx,cx,cy,R,pack,border){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);ctx[i?'lineTo':'moveTo'](cx+R*Math.cos(a),cy+R*Math.sin(a)*0.58);}ctx.closePath();
  ctx.fillStyle=pack.ground;ctx.fill();ctx.lineWidth=Math.max(1.5,R*0.03);ctx.strokeStyle=border||pack.border;ctx.stroke();}
function drawThemeDecals(ctx,cx,cy,pack,pl,tm){pl.decals.forEach(d=>pack.assets[d.id].draw(ctx,cx+d.x,cy+d.y,pl.u,d.v,tm||0));}
/* layer: 'back' (y<0, draw BEFORE the ride sprite), 'front' (y>=0, draw AFTER it) or omit for all, sorted by y */
function drawThemeAssets(ctx,cx,cy,pack,pl,tm,layer){pl.assets.filter(o=>layer==='back'?o.y<0:layer==='front'?o.y>=0:true).sort((a,b)=>a.y-b.y).forEach(o=>pack.assets[o.id].draw(ctx,cx+o.x,cy+o.y,pl.u,o.v,tm||0));}
function drawThemedTile(ctx,cx,cy,R,pack,tier,seed,tm,border,rideFn){drawThemeGround(ctx,cx,cy,R,pack,border);const pl=placeThemeAssets(pack,tier,R,seed);
  drawThemeDecals(ctx,cx,cy,pack,pl,tm);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'back');if(rideFn)rideFn(ctx,cx,cy,R);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'front');}
/* ===== END PACK CODE ===== */

/* ===== STATIC HYDRAULIC LAUNCH COASTER (two-hex sprites, baked once) =====
 * Kingda Ka-style: a short station, a long straight launch track, a very tall lattice tower with a narrow top-hat loop (the track twists
 * from the launch lane to the return lane over the top), a low camelback hill on thin stilts and a brake run back to the station.
 *   drawLaunchSide(ctx, cx, cy, R, {accent})                  two hexes side by side (E-W)
 *   drawLaunchDiag(ctx, cx, cy, R, {accent, dir})             dir 'NW-SE' (default) or 'NE-SW' (mirrored)
 *   launchFootprint(R, mode, dir) -> {tiles, circles};  footprintForTile(fp, i) -> circles for placeThemeAssets(..., {avoid})
 *   sceneryInFront(circles, x, y) -> true when the scenery item is in FRONT of the ride (draw it after the ride, everything else before)
 */
function kaLayout(R,mode){
  kaLayout._c=kaLayout._c||{};const key=mode+R;if(kaLayout._c[key])return kaLayout._c[key];
  const side=mode==='side',N=900,a=side?1.2*R:0.8*R,sT=side?1.12*R:0.74*R,rv=(side?0.26:0.2)*R,rh=(side?0.14:0.1)*R,h=(side?0.08:0.06)*R,z0=0.06*R,Ht=(side?1.5:1.22)*R,Hh=(side?0.34:0.27)*R;
  const ax=side?[1,0]:[0.706,0.709],lt=side?[0,-1]:[0.706,-0.709],hexes=side?[[-0.866*R,0],[0.866*R,0]]:[[-0.433*R,-0.435*R],[0.433*R,0.435*R]];
  const pts=[],add=(s,lat,z,kind)=>pts.push([s,lat,z,kind]),st=R*0.02;
  const s1=sT-rv,zc0=z0+rv,zc1=Ht-rh,sC=sT-2*rh-rv;
  for(let s=-a;s<s1;s+=st)add(s,-h,z0,1);
  for(let q=0;q<=24;q++){const ph=q/24*Math.PI/2;add(s1+rv*Math.sin(ph),-h,z0+rv*(1-Math.cos(ph)),2);}
  for(let z=zc0;z<zc1;z+=st)add(sT,-h,z,3);
  for(let q=0;q<=48;q++){const ps=q/48*Math.PI;add(sT-rh*(1-Math.cos(ps)),-h,Ht-rh+rh*Math.sin(ps),4);}
  for(let z=zc1;z>zc0;z-=st)add(sT-2*rh,-h,z,5);
  for(let q=0;q<=24;q++){const ph=q/24*Math.PI/2,t=q/24,sm=t*t*(3-2*t);add(sC+rv*Math.cos(ph),-h+2*h*sm,z0+rv-rv*Math.sin(ph),6);}
  const sEnd=-a+0.3*(sC+a);for(let s=sC;s>-a;s-=st){const u=Math.max(0,Math.min(1,(sC-s)/(sC-sEnd))),bump=u<1?Math.pow(Math.sin(Math.PI*Math.pow(u,0.8)),1.3):0;add(s,h,z0+Hh*bump,7);}
  for(let q=0;q<=20;q++){const th=q/20*Math.PI;add(-a-h*Math.sin(th),h*Math.cos(th),z0,8);}
  const cum=[0];for(let i=1;i<pts.length;i++){const p=pts[i-1],q=pts[i];cum.push(cum[i-1]+Math.hypot(q[0]-p[0],q[1]-p[1],q[2]-p[2]));}
  const total=cum[cum.length-1]+Math.hypot(pts[0][0]-pts[pts.length-1][0],pts[0][1]-pts[pts.length-1][1],pts[0][2]-pts[pts.length-1][2]),Sa=[],La=[],Za=[],Ka=[];let j=0;
  for(let i=0;i<N;i++){const d=i/N*total;while(j<pts.length-2&&cum[j+1]<d)j++;const p=pts[j],q=pts[Math.min(pts.length-1,j+1)],t=cum[j+1]>cum[j]?Math.max(0,Math.min(1,(d-cum[j])/(cum[j+1]-cum[j]))):0;Sa.push(p[0]+(q[0]-p[0])*t);La.push(p[1]+(q[1]-p[1])*t);Za.push(p[2]+(q[2]-p[2])*t);Ka.push(p[3]);}
  const g=Sa.map((s,i)=>[ax[0]*s+lt[0]*La[i],ax[1]*s+lt[1]*La[i]]);
  return kaLayout._c[key]={N,g,z:Za,S:Sa,LA:La,K:Ka,hexes,ax,lt,ds:total/N,a,sT,sC,sEnd,rh,rv,h,Ht,Hh,z0,side,k:side?1.0:0.9,sMin:sT-2*rh-0.04*R,sMax:sT+0.04*R,lMin:-(h+0.03*R),lMax:h+0.03*R};
}
function kaDraw(ctx,cx,cy,R,op,mode){
  const accent=op.accent||'#f8fafc',fl=op.flip?-1:1,L=kaLayout(R,mode),N=L.N,k=L.k,Rk=R*k,hw=R*0.0145*k,thk=R*0.011*k;ctx.save();ctx.translate(cx,cy);ctx.lineJoin='round';ctx.lineCap='round';
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=fill;ctx.lineWidth=0.7;ctx.stroke();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.006;ctx.stroke();}};
  const P=i=>{i=(i+N)%N;return[L.g[i][0],L.g[i][1]-L.z[i]];},G=(s,l,z)=>[L.ax[0]*s+L.lt[0]*l,L.ax[1]*s+L.lt[1]*l-z];
  const tan=i=>{const a=P(i-2),b=P(i+2);let tx=b[0]-a[0],ty=b[1]-a[1];const m=Math.hypot(tx,ty)||1;return[tx/m,ty/m];};
  const dk=shade(accent,-0.3),mid=shade(accent,-0.12);
  /* soft ground shadow: only the low parts of the path, plus the tower foot */
  ctx.save();ctx.translate(fl*R*0.04,R*0.03);ctx.beginPath();let pen=false;L.g.forEach((p,i)=>{if(L.z[i]>R*0.5){pen=false;return;}const x=p[0]+fl*L.z[i]*0.3,y=p[1]+L.z[i]*0.15;pen?ctx.lineTo(x,y):ctx.moveTo(x,y);pen=true;});ctx.strokeStyle='rgba(15,25,20,.15)';ctx.lineWidth=R*0.04*k;ctx.stroke();ctx.restore();
  {const c0=G((L.sMin+L.sMax)/2,0,0);ctx.fillStyle='rgba(15,25,20,.2)';ctx.beginPath();ctx.ellipse(c0[0]+R*0.06,c0[1]+R*0.03,R*0.3,R*0.13,0,0,7);ctx.fill();}
  const items=[];
  /* track: slim ribbon; in the tower the ribbon width is taken perpendicular to the track on screen so it never collapses */
  for(let i=0;i<N;i++){const j=(i+1)%N,kd=L.K[i],vert=kd>=2&&kd<=6,key=L.g[i][1]+L.z[i]*0.05;
    const E=n=>{const p=P(n),t=tan(n),w=vert?[-t[1],t[0]]:L.lt;return{p,E1:[p[0]+w[0]*hw,p[1]+w[1]*hw],E2:[p[0]-w[0]*hw,p[1]-w[1]*hw]};};
    const ei=E(i),ej=E(j);items.push({k:key,f:()=>{
      if(vert){line(ei.p,ej.p,dk,hw*2.7);line(ei.p,ej.p,accent,hw*1.7);line(ei.E1,ej.E1,'#1f2636',R*0.0045*k);line(ei.E2,ej.E2,'#1f2636',R*0.0045*k);return;}
      const nearE1=(ei.E1[1]+ej.E1[1])>(ei.E2[1]+ej.E2[1]),ea=nearE1?ei.E1:ei.E2,eb=nearE1?ej.E1:ej.E2;
      poly([ea,eb,[eb[0],eb[1]+thk],[ea[0],ea[1]+thk]],shade(accent,-0.4));poly([ei.E1,ej.E1,ej.E2,ei.E2],accent);line(ei.E1,ej.E1,'#1f2636',R*0.0045*k);line(ei.E2,ej.E2,'#1f2636',R*0.0045*k);line(ei.p,ej.p,'rgba(255,255,255,.3)',R*0.005*k);
      if(kd===1&&i%6===0)line(ei.p,[ei.p[0],ei.p[1]+Rk*0.012],'#141a28',R*0.012);}});}
  /* supports: low trestle under the launch lane, thin tall stilts under the camelback hill, none in the tower (the tower is the support) */
  let accL=0,accR=0;for(let i=0;i<N;i++){const kd=L.K[i],zi=L.z[i];if(kd!==1&&kd!==7)continue;const G0=L.g[i],H=P(i);
    if(kd===1){accL+=L.ds;if(accL<R*0.2*k||zi<R*0.02)continue;accL=0;items.push({k:G0[1]+zi*0.05-0.002,f:()=>{line(G0,[H[0],H[1]+thk],'#98a2b6',R*0.014*k);line([H[0]-R*0.03*k,H[1]+thk],[H[0]+R*0.03*k,H[1]+thk],'#c2cad8',R*0.01*k);ctx.fillStyle='rgba(20,28,40,.3)';ctx.beginPath();ctx.ellipse(G0[0],G0[1]+R*0.003,R*0.02*k,R*0.008*k,0,0,7);ctx.fill();}});continue;}
    accR+=L.ds;if(accR<R*0.085*k||zi<R*0.1)continue;accR=0;items.push({k:G0[1]+zi*0.05-0.002,f:()=>{line(G0,[H[0],H[1]+thk],'#3a4660',R*0.0095*k);line([G0[0]-R*0.0025,G0[1]],[H[0]-R*0.0025,H[1]+thk],'#aab5cc',R*0.004*k);line([H[0]-R*0.02*k,H[1]+thk],[H[0]+R*0.02*k,H[1]+thk],'#5a6680',R*0.007*k);ctx.fillStyle='rgba(20,28,40,.28)';ctx.beginPath();ctx.ellipse(G0[0],G0[1]+R*0.003,R*0.016*k,R*0.006*k,0,0,7);ctx.fill();}});}
  /* the lattice tower: straight legs up to where the hat starts, then the legs, rings and bracing follow the arch to a rounded top */
  {const sc=(L.sMin+L.sMax)/2,hw0=(L.sMax-L.sMin)/2,zA=L.Ht-L.rh,Htop=zA+hw0,dz=R*0.13,wAt=z=>z<=zA?hw0:Math.sqrt(Math.max(0,hw0*hw0-(z-zA)*(z-zA)));
    const zs=[];for(let z=dz;z<Htop-R*0.03;z+=dz)zs.push(z);const KD=0.45,cp=(ci,z)=>{const w=wAt(z),sg=(ci===0||ci===3)?-1:1,l=(ci<2?L.lMin:L.lMax)*KD;return G(sc+sg*w,l,z);},gy=ci=>{const sg=(ci===0||ci===3)?-1:1,l=(ci<2?L.lMin:L.lMax)*KD;return L.ax[1]*(sc+sg*hw0)+L.lt[1]*l;};
    for(let ci=0;ci<4;ci++){items.push({k:gy(ci)+Htop*0.03,f:()=>{ctx.save();ctx.globalAlpha=ci>=2?0.5:1;ctx.beginPath();for(let z=0;z<=Htop;z+=Math.max(R*0.02,Htop/90)){const p=cp(ci,Math.min(z,Htop));z?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.strokeStyle=dk;ctx.lineWidth=R*0.024*k;ctx.stroke();ctx.beginPath();for(let z=0;z<=Htop;z+=Math.max(R*0.02,Htop/90)){const p=cp(ci,Math.min(z,Htop));z?ctx.lineTo(p[0]-R*0.005,p[1]):ctx.moveTo(p[0]-R*0.005,p[1]);}ctx.strokeStyle=shade(accent,0.25);ctx.lineWidth=R*0.008*k;ctx.stroke();ctx.restore();}});}
    zs.forEach(z=>{for(let e=0;e<4;e++){const c0=e,c1=(e+1)%4;items.push({k:(gy(c0)+gy(c1))/2+z*0.03,f:()=>{if(wAt(z)<R*0.02)return;ctx.save();ctx.globalAlpha=e===2?0.45:e===0?1:0.7;line(cp(c0,z),cp(c1,z),mid,R*0.009*k);ctx.restore();}});}});
    for(let m=0;m<zs.length-1;m++)for(let e=0;e<4;e++){const c0=e,c1=(e+1)%4,za=zs[m],zb=zs[m+1];if(e===0&&zb>zA-R*0.18)continue;items.push({k:(gy(c0)+gy(c1))/2+(za+zb)*0.015,f:()=>{ctx.save();ctx.globalAlpha=e===2?0.4:e===0?0.9:0.6;line(cp(c0,za),cp(c1,zb),shade(accent,0.05),R*0.006*k);line(cp(c1,za),cp(c0,zb),shade(accent,0.05),R*0.006*k);ctx.restore();}});}
    items.push({k:gy(1)+Htop*0.03+0.01,f:()=>{const t=G(sc,(L.lMin+L.lMax)/2,Htop),m2=[t[0],t[1]-R*0.1];line(t,m2,'#d5dae6',R*0.008*k);ctx.fillStyle='#ff4a4a';ctx.beginPath();ctx.arc(m2[0],m2[1],R*0.012*k,0,7);ctx.fill();}});}
  /* station: low building behind both lanes with an accent roof, a platform strip beside the launch lane */
  {const sA=-L.a,sB=-L.a+(L.side?0.5:0.4)*R,gp=(s,l,z)=>G(s,l,z),l0=L.h+0.04*R,l1=L.h+(L.side?0.15:0.12)*R,zh=0.085*R,zr=0.115*R;
    items.push({k:gp(sA,l0,0)[1]-0.02*R,f:()=>{poly([gp(sA,-L.h-0.075*R,0.012*R),gp(sB,-L.h-0.075*R,0.012*R),gp(sB,-L.h-0.025*R,0.012*R),gp(sA,-L.h-0.025*R,0.012*R)],'#dfe5ee','#94a3b8',R*0.004);}});
    items.push({k:gp(sB,l0,0)[1]+0.02*R,f:()=>{poly([gp(sA,l0,0),gp(sB,l0,0),gp(sB,l0,zh),gp(sA,l0,zh)],'#f1f4f8','#94a3b8',R*0.004);for(let q=1;q<6;q++){const s=sA+(sB-sA)*q/6;line(gp(s,l0,0),gp(s,l0,zh),'rgba(80,95,120,.4)',R*0.004);}
      poly([gp(sA-0.02*R,l0-0.03*R,zr),gp(sB+0.02*R,l0-0.03*R,zr),gp(sB+0.02*R,l1,zr),gp(sA-0.02*R,l1,zr)],shade(accent,0.1),dk,R*0.005);line(gp(sA-0.02*R,l0-0.03*R,zr),gp(sB+0.02*R,l0-0.03*R,zr),dk,R*0.012);}});}
  /* trains: two cars waiting in the station, three on the camelback, a short train climbing the tower */
  const car=(i,lead)=>{const p=P(i),t=tan(i),n=[-t[1],t[0]],c=[p[0],p[1]-Rk*0.012],lx=Rk*0.03,wy=Rk*0.016,q=(aa,bb,dz)=>[c[0]+t[0]*aa+n[0]*bb,c[1]+t[1]*aa+n[1]*bb+dz];
    items.push({k:L.g[i][1]+L.z[i]*0.05+0.01,f:()=>{poly([q(-lx,-wy,0),q(lx,-wy,0),q(lx,wy,0),q(-lx,wy,0)],'#f6f8fc','#aab3c5',Rk*0.003);poly([q(-lx,-wy,0),q(-lx*0.35,-wy,0),q(-lx*0.35,wy,0),q(-lx,wy,0)],'#2a3144');poly([q(lx*0.4,-wy,0),q(lx,-wy,0),q(lx,wy,0),q(lx*0.4,wy,0)],lead?accent:shade(accent,0.3));
      [-0.4,0.4].forEach(d=>{const h=q(-lx*0.1,d*wy,-Rk*0.014);ctx.fillStyle='#fde4c8';ctx.beginPath();ctx.arc(h[0],h[1],Rk*0.009,0,7);ctx.fill();});}});};
  const idxAt=(kind,s)=>{let b=0,bd=1e9;for(let i=0;i<N;i++)if(L.K[i]===kind){const d=Math.abs(L.S[i]-s);if(d<bd){bd=d;b=i;}}return b;},idxZ=(kind,z)=>{let b=0,bd=1e9;for(let i=0;i<N;i++)if(L.K[i]===kind){const d=Math.abs(L.z[i]-z);if(d<bd){bd=d;b=i;}}return b;};
  const sp=Math.max(2,Math.round(Rk*0.062/L.ds));
  {const ih=idxAt(1,-L.a+0.4*R);for(let q=0;q<5;q++)car(ih-q*sp,q===0);}
  {const ih=idxAt(7,(L.sC+L.sEnd)/2-0.03*R);for(let q=0;q<4;q++)car(ih-q*sp,q===0);}
  {const ih=idxZ(3,L.Ht*0.55);for(let q=0;q<3;q++)car(ih-q*sp,q===0);}
  items.sort((a,b)=>a.k-b.k).forEach(it=>it.f());ctx.restore();
}
function launchSprite(R,mode,dir,accent,scale){
  launchSprite._c=launchSprite._c||{};const sc=scale||getBakeScale(),key=[mode,dir,Math.round(R*sc),R,accent,sc].join('|');if(launchSprite._c[key])return launchSprite._c[key];
  const side=mode==='side',W=Math.ceil((side?3.4:2.6)*R),H=Math.ceil((side?2.6:2.5)*R),oy=(side?2.05:1.65)*R,cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);
  const g=cv.getContext('2d');g.scale(sc,sc);g.save();g.translate(W/2,oy);if(dir==='NE-SW')g.scale(-1,1);kaDraw(g,0,0,R,{accent:accent,flip:dir==='NE-SW'},mode);g.restore();
  return launchSprite._c[key]={canvas:cv,ox:W/2,oy:oy,w:W,h:H};
}
function drawLaunchSide(ctx,cx,cy,R,o){o=o||{};const s=launchSprite(R,'side','NW-SE',o.accent||'#f8fafc');ctx.drawImage(s.canvas,cx-s.ox,cy-s.oy,s.w,s.h);}
function drawLaunchDiag(ctx,cx,cy,R,o){o=o||{};const d=o.dir==='NE-SW'?'NE-SW':'NW-SE',s=launchSprite(R,'diag',d,o.accent||'#f8fafc');ctx.drawImage(s.canvas,cx-s.ox,cy-s.oy,s.w,s.h);}
function launchFootprint(R,mode,dir){
  const L=kaLayout(R,mode),m=dir==='NE-SW'?-1:1,c=[];for(let i=0;i<L.N;i+=6){if(L.K[i]>=2&&L.K[i]<=5)continue;c.push({x:L.g[i][0]*m,y:L.g[i][1],r:R*0.1*L.k});}
  const tc=[L.ax[0]*(L.sMin+L.sMax)/2,L.ax[1]*(L.sMin+L.sMax)/2];c.push({x:tc[0]*m,y:tc[1],r:R*0.2*L.k});
  const sm=-L.a+0.25*R,sp=[L.ax[0]*sm+L.lt[0]*(L.h+0.12*R),L.ax[1]*sm+L.lt[1]*(L.h+0.12*R)];c.push({x:sp[0]*m,y:sp[1],r:R*0.15*L.k});
  return{tiles:L.hexes.map(h=>[h[0]*m,h[1]]),circles:c};
}
window.footprintForTile=window.footprintForTile||function(fp,i){const t=fp.tiles[i];return fp.circles.map(c=>({x:c.x-t[0],y:c.y-t[1],r:c.r}));};
window.sceneryInFront=window.sceneryInFront||function(circles,x,y){let f=-Infinity;for(const c of circles){const dx=x-c.x;if(Math.abs(dx)<c.r)f=Math.max(f,c.y+Math.sqrt(c.r*c.r-dx*dx)/1.7);}return f>-Infinity&&y>f;};
const BIG_RIDE_SCENERY=window.BIG_RIDE_SCENERY||{maxW:2.0,budgetScale:0.45,decalScale:0.6,noLandmarks:true};
/* ===== END STATIC HYPER ===== */
return Object.freeze({ side: drawLaunchSide, diag: drawLaunchDiag });
})();

const wildWestLandPack = (() => {

/* ===== THEME PACK CORE (shared by every theme pack; copy once into engine.js) ===== */
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

/* ===== WILD WEST ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const WS=(c,x,y,rx)=>{c.fillStyle='rgba(70,45,20,.2)';c.beginPath();c.ellipse(x+rx*0.28,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const WRK=(c,x,y,rx,ry,col,snow)=>{TH.ell(c,x+rx*0.15,y+ry*0.3,rx*1.05,ry*0.45,'rgba(60,35,15,.22)');TH.poly(c,[[x-rx,y],[x-rx*0.9,y-ry*0.6],[x-rx*0.35,y-ry*1.05],[x+rx*0.4,y-ry*0.95],[x+rx*0.95,y-ry*0.35],[x+rx,y+ry*0.1],[x-rx*0.6,y+ry*0.2]],col);
  TH.poly(c,[[x+rx*0.25,y-ry*0.98],[x+rx*0.95,y-ry*0.35],[x+rx,y+ry*0.1],[x+rx*0.2,y+ry*0.05]],shade(col,-0.28));TH.poly(c,[[x-rx*0.9,y-ry*0.6],[x-rx*0.35,y-ry*1.05],[x+rx*0.1,y-ry*0.95],[x-rx*0.4,y-ry*0.55]],shade(col,0.18));
  TH.ln(c,[x-rx*0.85,y-ry*0.3],[x+rx*0.8,y-ry*0.15],'rgba(80,40,20,.22)',ry*0.07);};
const WCONIF=(c,x,y,u,o,r)=>{const h=u*o.h,w=u*o.w,n=o.tiers;TH.ln(c,[x,y],[x,y-h*0.25],'#5a3b22',u*0.38);for(let i=0;i<n;i++){const t=i/n,ww=w*(1-0.8*t)*(0.9+r()*0.2),yb=y-h*(0.1+0.78*t),tip=yb-h*0.4;
    const pts=[[x-ww,yb],[x-ww*0.55,yb-h*0.045],[x-ww*0.2,yb+h*0.012],[x+ww*0.25,yb-h*0.04],[x+ww*0.6,yb+h*0.01],[x+ww,yb]];TH.poly(c,pts.concat([[x,tip]]),o.c1);TH.poly(c,[[x,tip],[x+ww,yb],[x+ww*0.6,yb+h*0.01],[x+ww*0.25,yb-h*0.04],[x,yb]],o.c2);}};
const WEST_ASSETS={
  /* ---------- trees ---------- */
  cottonwood:{cat:'tree',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*7+1),H=u*(4.4+r()*1.1);WS(c,x,y,u*2.0);c.strokeStyle='#8a7c64';c.lineWidth=u*0.58;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.12,y-H*0.35,x+u*0.05,y-H*0.62);c.stroke();c.strokeStyle='#a99b82';c.lineWidth=u*0.2;c.beginPath();c.moveTo(x-u*0.12,y);c.quadraticCurveTo(x-u*0.22,y-H*0.35,x-u*0.05,y-H*0.6);c.stroke();
    TH.ln(c,[x+u*0.05,y-H*0.5],[x-u*0.95,y-H*0.86],'#8a7c64',u*0.3);TH.ln(c,[x+u*0.05,y-H*0.56],[x+u*1.05,y-H*0.82],'#8a7c64',u*0.28);const cols=['#9db551','#8aa545','#aec45f','#7b9a3d','#bccd6e'];
    [[0,-0.9,1.5,1.1],[-1.25,-0.65,1.1,0.9],[1.25,-0.65,1.1,0.9],[0.05,-0.3,1.7,1.0],[-0.65,-1.5,1.0,0.8],[0.75,-1.45,1.0,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H*0.8+dy*u,u*rx,u*ry,r()<0.12?'#d2c653':cols[i%5],r,9));}},
  mesquite:{cat:'tree',rho:0.15,draw(c,x,y,u,v){const r=mulberry(v*5+3),H=u*(2.6+r()*0.6);WS(c,x,y,u*2.1);c.strokeStyle='#4f3b28';c.lineCap='round';c.lineWidth=u*0.4;c.beginPath();c.moveTo(x-u*0.1,y);c.bezierCurveTo(x-u*0.5,y-H*0.35,x+u*0.5,y-H*0.5,x,y-H*0.78);c.stroke();c.lineWidth=u*0.25;c.beginPath();c.moveTo(x+u*0.1,y-H*0.25);c.bezierCurveTo(x+u*0.9,y-H*0.35,x+u*1.0,y-H*0.6,x+u*0.9,y-H*0.78);c.stroke();
    const cols=['#8a9a46','#7a8a3c','#96a652','#6f7f35'];[[-1.5,-0.25,1.0,0.7],[-0.5,-0.85,1.2,0.8],[0.8,-0.7,1.2,0.8],[1.7,-0.2,1.0,0.7],[0.2,-0.2,1.5,0.8],[-0.8,-0.2,1.1,0.7]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H*0.78+dy*u,u*rx,u*ry,cols[i%4],r,8));}},
  juniper:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*3+5);WS(c,x,y,u*1.5);TH.ln(c,[x,y],[x+u*0.1,y-u*0.9],'#6b5640',u*0.45);const cols=['#4e7a64','#436b57','#5d8a72','#3c6450'];[[0,-2.0,1.2,1.0],[-0.7,-1.3,1.0,0.9],[0.7,-1.3,1.0,0.9],[0,-0.9,1.3,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,cols[i],r,8));for(let k=0;k<5;k++)TH.ell(c,x+(r()-0.5)*u*1.8,y-u*(0.8+r()*1.8),u*0.07,u*0.07,'#4a5a9a');}},
  pinyon:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*11+2);WS(c,x,y,u*1.4);WCONIF(c,x,y,u,{h:4.0+r()*1.0,w:1.35,tiers:5,c1:'#3c6a45',c2:'#2c5236'},r);}},
  ponderosa:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*13+1),H=u*(5.8+r()*1.0);WS(c,x,y,u*1.3);TH.ln(c,[x,y],[x,y-H*0.78],'#9a5f3c',u*0.45);TH.ln(c,[x-u*0.1,y],[x-u*0.1,y-H*0.7],'#b97a50',u*0.15);
    const cols=['#3d6b43','#2f5a38','#4b7a50'];[[0,-0.2,1.5,0.8],[-0.6,-0.95,1.3,0.75],[0.6,-0.95,1.3,0.75],[0,-1.6,1.0,0.7],[-0.35,-2.2,0.7,0.6],[0.2,-2.65,0.5,0.5]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H*0.7+dy*u,u*rx,u*ry,cols[i%3],r,8));}},
  saguaro:{cat:'tree',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*17+4),H=u*(4.6+r()*1.4),w=u*0.46;WS(c,x,y,u*1.0);const col=(x0,yb,h,ww)=>{const g=c.createLinearGradient(x0-ww,0,x0+ww,0);g.addColorStop(0,'#78ad63');g.addColorStop(0.55,'#4f8a45');g.addColorStop(1,'#2e6030');c.beginPath();c.moveTo(x0-ww,yb);c.lineTo(x0-ww,yb-h+ww);c.arc(x0,yb-h+ww,ww,Math.PI,0);c.lineTo(x0+ww,yb);c.closePath();c.fillStyle=g;c.fill();for(let k=-1;k<=1;k++)TH.ln(c,[x0+k*ww*0.5,yb-h*0.02],[x0+k*ww*0.5,yb-h+ww*0.8],'rgba(20,60,30,.35)',u*0.05);};
    const arm=(s,yy,out,up)=>{c.lineCap='round';c.lineJoin='round';c.strokeStyle='#2e6030';c.lineWidth=u*0.62;c.beginPath();c.moveTo(x+s*w*0.5,y-yy);c.lineTo(x+s*(w+out),y-yy);c.lineTo(x+s*(w+out),y-yy-up);c.stroke();c.strokeStyle='#5a9a50';c.lineWidth=u*0.4;c.stroke();};
    arm(-1,H*0.42,u*0.75,u*1.5+r()*u*0.7);if(r()<0.85)arm(1,H*0.55,u*0.8,u*1.1+r()*u*0.8);col(x,y,H,w);TH.ell(c,x-w*0.1,y-H,w*0.35,w*0.25,'#f3e9d2');}},
  joshua:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*19+2),H=u*(3.2+r()*0.8);WS(c,x,y,u*1.3);TH.ln(c,[x,y],[x,y-H*0.55],'#7c6a50',u*0.5);for(let k=0;k<7;k++)TH.ln(c,[x-u*0.2,y-H*0.08*k],[x+u*0.2,y-H*0.08*k+u*0.1],'rgba(50,35,20,.35)',u*0.06);
    const tuft=(tx,ty)=>{for(let k=0;k<11;k++){const a=-Math.PI*0.95+k/10*Math.PI*0.9,l=u*(0.65+r()*0.35);TH.ln(c,[tx,ty],[tx+Math.cos(a)*l,ty+Math.sin(a)*l*0.9],k%2?'#7d8f4a':'#a3a35a',u*0.09);}};
    [[-1.0,0.78],[0.9,0.85],[0.1,1.0]].forEach(([dx,f],i)=>{const bx=x+dx*u,by=y-H*f;TH.ln(c,[x,y-H*0.5],[bx,by+u*0.2],'#7c6a50',u*0.3);tuft(bx,by);});}},
  deadTree:{cat:'tree',rho:0.04,draw(c,x,y,u,v){const r=mulberry(v*23+1),H=u*(3.0+r()*0.8);WS(c,x,y,u*0.9);c.lineCap='round';TH.ln(c,[x,y],[x+u*0.15,y-H],'#8d8577',u*0.4);TH.ln(c,[x+u*0.1,y-H*0.55],[x-u*1.0,y-H*0.9],'#8d8577',u*0.22);TH.ln(c,[x+u*0.12,y-H*0.7],[x+u*0.95,y-H*1.05],'#8d8577',u*0.2);TH.ln(c,[x-u*0.55,y-H*0.78],[x-u*0.9,y-H*1.15],'#8d8577',u*0.14);TH.ln(c,[x+u*0.15,y-H],[x,y-H*1.25],'#8d8577',u*0.15);}},
  /* ---------- shrubs ---------- */
  sage:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.2,y+u*0.1,u*1.1,u*0.35,'rgba(70,45,20,.18)');[[-0.55,-0.4,0.7,0.5],[0.5,-0.4,0.7,0.5],[0,-0.7,0.8,0.55]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#93a082','#a3ae92','#86967a'][i],r,7));}},
  pricklyPear:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+9);TH.ell(c,x+u*0.2,y+u*0.1,u*1.0,u*0.3,'rgba(70,45,20,.18)');const pad=(px,py,rx,ry,rot)=>{TH.ell(c,px,py,rx,ry,'#6f9a4e',rot);TH.ell(c,px-rx*0.2,py-ry*0.2,rx*0.55,ry*0.5,'rgba(255,255,255,.12)',rot);for(let k=0;k<5;k++)TH.ell(c,px+(r()-0.5)*rx,py+(r()-0.5)*ry,u*0.035,u*0.035,'#f3ead0');};pad(x,y-u*0.5,u*0.5,u*0.62,0);pad(x+u*0.55,y-u*1.05,u*0.4,u*0.5,0.5);pad(x-u*0.5,y-u*1.0,u*0.38,u*0.48,-0.5);[[0.85,-1.35],[-0.8,-1.3]].forEach(([dx,dy])=>TH.ell(c,x+dx*u,y+dy*u,u*0.14,u*0.11,'#c0392b'));}},
  yucca:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*7+2);TH.ell(c,x+u*0.15,y+u*0.08,u*0.8,u*0.25,'rgba(70,45,20,.18)');TH.ln(c,[x,y],[x,y-u*0.7],'#7c6a50',u*0.35);for(let k=0;k<13;k++){const a=-Math.PI*0.97+k/12*Math.PI*0.94,l=u*(0.9+r()*0.5);TH.ln(c,[x,y-u*0.7],[x+Math.cos(a)*l,y-u*0.7+Math.sin(a)*l],k%2?'#5f8a52':'#6f9a5a',u*0.12);}if(r()<0.5){TH.ln(c,[x,y-u*0.7],[x+u*0.1,y-u*2.6],'#e9dcc0',u*0.1);for(let k=0;k<5;k++)TH.ell(c,x+u*0.1,y-u*(1.6+k*0.22),u*0.14,u*0.1,'#f6efe0');}}},
  barrelCactus:{cat:'shrub',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.15,y+u*0.08,u*0.7,u*0.22,'rgba(70,45,20,.18)');const g=c.createRadialGradient(x-u*0.2,y-u*0.7,0,x,y-u*0.5,u*0.8);g.addColorStop(0,'#86b872');g.addColorStop(1,'#3f7a3a');c.fillStyle=g;c.beginPath();c.ellipse(x,y-u*0.5,u*0.55,u*0.6,0,0,7);c.fill();for(let k=-2;k<=2;k++)TH.ln(c,[x+k*u*0.2,y-u*0.05],[x+k*u*0.16,y-u*1.05],'rgba(20,60,30,.4)',u*0.05);TH.ell(c,x,y-u*1.08,u*0.2,u*0.1,'#f2c230');}},
  dryGrass:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);for(let k=0;k<12;k++){const a=-1.1+k/11*2.2+(r()-0.5)*0.2,l=u*(0.5+r()*0.55);TH.ln(c,[x+(r()-0.5)*u*0.6,y],[x+Math.sin(a)*l+(r()-0.5)*u*0.3,y-l],['#c9b46a','#b8a35a','#d8c77a'][k%3],u*0.07);}}},
  /* ---------- rockwork ---------- */
  boulders:{cat:'rock',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.8,'#b7714b'],[0.7,0.2,0.8,0.7,'#c28a5c'],[0,-0.35,0.7,0.6,'#a8633f']].forEach(([dx,dy,rx,ry,col],i)=>WRK(c,x+dx*u,y+dy*u,u*rx,u*ry*(1+r()*0.2),col));}},
  spire:{cat:'rock',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*9+2),H=u*(5.5+r()*3.2),w=u*(0.9+r()*0.4);TH.ell(c,x+u*0.5,y+u*0.1,w*1.5,u*0.4,'rgba(60,35,15,.22)');const bands=['#c07a50','#b86a42','#c98e62','#b0603a'];const n=5;for(let i=0;i<n;i++){const t0=i/n,t1=(i+1)/n,w0=w*(1-0.62*t0),w1=w*(1-0.62*t1);TH.poly(c,[[x-w0,y-H*t0],[x+w0,y-H*t0],[x+w1,y-H*t1],[x-w1,y-H*t1]],bands[i%4]);TH.poly(c,[[x+w0*0.15,y-H*t0],[x+w0,y-H*t0],[x+w1,y-H*t1],[x+w1*0.15,y-H*t1]],'rgba(60,25,10,.28)');}
    TH.poly(c,[[x-w*0.38,y-H],[x+w*0.38,y-H],[x+w*0.1,y-H-u*0.7],[x-w*0.1,y-H-u*0.7]],'#a8603a');TH.ln(c,[x-w*0.9,y-H*0.35],[x+w*0.9,y-H*0.35],'rgba(80,40,20,.25)',u*0.07);}},
  butte:{cat:'rock',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*7+8),H=u*(5.0+r()*1.6),w=u*(1.8+r()*0.5);TH.ell(c,x+u*0.8,y+u*0.15,w*1.5,u*0.5,'rgba(60,35,15,.22)');
    TH.poly(c,[[x-w*1.5,y],[x-w*0.95,y-H*0.35],[x+w*0.95,y-H*0.35],[x+w*1.5,y]],'#c9936a');TH.poly(c,[[x+w*0.4,y-H*0.35],[x+w*0.95,y-H*0.35],[x+w*1.5,y],[x+w*0.55,y]],'rgba(80,40,20,.25)');
    const cliff=['#b86a42','#c07a50','#a85f3a','#c98e62'];for(let i=0;i<4;i++){const t0=0.35+i*0.1625,t1=0.35+(i+1)*0.1625;TH.poly(c,[[x-w*0.95,y-H*t0],[x+w*0.95,y-H*t0],[x+w*0.9,y-H*t1],[x-w*0.9,y-H*t1]],cliff[i]);TH.poly(c,[[x+w*0.25,y-H*t0],[x+w*0.95,y-H*t0],[x+w*0.9,y-H*t1],[x+w*0.25,y-H*t1]],'rgba(60,25,10,.3)');}
    for(let k=-3;k<=3;k++)TH.ln(c,[x+k*w*0.27,y-H*0.4],[x+k*w*0.25,y-H*0.98],'rgba(60,25,10,.18)',u*0.06);TH.poly(c,[[x-w*0.95,y-H],[x+w*0.9,y-H],[x+w*0.6,y-H-u*0.4],[x-w*0.6,y-H-u*0.4]],'#d4a577');}},
  mesa:{cat:'rock',rho:0.2,draw(c,x,y,u,v){const r=mulberry(v*5+6),H=u*(5.5+r()*1.0),w=u*(3.0+r()*0.8);TH.ell(c,x+u*1.0,y+u*0.2,w*1.5,u*0.6,'rgba(60,35,15,.2)');
    TH.poly(c,[[x-w*1.4,y],[x-w*1.05,y-H*0.3],[x+w*1.0,y-H*0.3],[x+w*1.4,y]],'#c9936a');TH.poly(c,[[x+w*0.3,y-H*0.3],[x+w*1.0,y-H*0.3],[x+w*1.4,y],[x+w*0.5,y]],'rgba(80,40,20,.22)');
    const cliff=['#b86a42','#c07a50','#a85f3a','#c98e62','#b0603a'];for(let i=0;i<5;i++){const t0=0.3+i*0.14,t1=0.3+(i+1)*0.14;TH.poly(c,[[x-w*1.0,y-H*t0],[x+w*1.0,y-H*t0],[x+w*0.97,y-H*t1],[x-w*0.97,y-H*t1]],cliff[i]);TH.poly(c,[[x+w*0.3,y-H*t0],[x+w*1.0,y-H*t0],[x+w*0.97,y-H*t1],[x+w*0.3,y-H*t1]],'rgba(60,25,10,.28)');}
    for(let k=-5;k<=5;k++)TH.ln(c,[x+k*w*0.19,y-H*0.35],[x+k*w*0.18,y-H*1.0],'rgba(60,25,10,.16)',u*0.06);TH.poly(c,[[x-w*1.0,y-H],[x+w*0.97,y-H],[x+w*0.7,y-H-u*0.5],[x-w*0.7,y-H-u*0.5]],'#d4a577');for(let k=0;k<4;k++)WRK(c,x+(r()-0.5)*w*1.2,y-H-u*0.2,u*0.35,u*0.25,'#b7714b');}},
  ledge:{cat:'rock',rho:0.16,draw(c,x,y,u,v){const r=mulberry(v*3+3),w=u*(2.2+r()*0.8),H=u*(1.6+r()*0.6);TH.ell(c,x+u*0.5,y+u*0.1,w*1.1,u*0.35,'rgba(60,35,15,.2)');const bands=['#c07a50','#b86a42','#c98e62'];for(let i=0;i<3;i++){const t0=i/3,t1=(i+1)/3,j0=(r()-0.5)*u*0.5,j1=(r()-0.5)*u*0.5;TH.poly(c,[[x-w+j0,y-H*t0],[x+w+j1,y-H*t0],[x+w*0.9+j1,y-H*t1],[x-w*0.92+j0,y-H*t1]],bands[i]);TH.poly(c,[[x+w*0.2,y-H*t0],[x+w+j1,y-H*t0],[x+w*0.9+j1,y-H*t1],[x+w*0.2,y-H*t1]],'rgba(60,25,10,.26)');}
    TH.poly(c,[[x-w*0.92,y-H],[x+w*0.9,y-H],[x+w*0.7,y-H-u*0.3],[x-w*0.7,y-H-u*0.3]],'#d4a577');WRK(c,x-w*0.7,y,u*0.5,u*0.4,'#a8633f');WRK(c,x+w*0.85,y+u*0.05,u*0.45,u*0.35,'#b7714b');}},
  arch:{cat:'rock',rho:0.2,draw(c,x,y,u,v){const H=u*6.0,w=u*1.2;TH.ell(c,x+u*1.2,y+u*0.2,u*4.2,u*0.7,'rgba(60,35,15,.2)');[[-2.1],[2.1]].forEach(([dx],k)=>{const px=x+dx*u;const bands=['#c07a50','#b86a42','#c98e62','#b0603a'];for(let i=0;i<4;i++){const t0=i/4,t1=(i+1)/4,w0=w*(1-0.25*t0),w1=w*(1-0.25*t1);TH.poly(c,[[px-w0,y-H*0.9*t0],[px+w0,y-H*0.9*t0],[px+w1,y-H*0.9*t1],[px-w1,y-H*0.9*t1]],bands[(i+k)%4]);TH.poly(c,[[px+w0*0.2,y-H*0.9*t0],[px+w0,y-H*0.9*t0],[px+w1,y-H*0.9*t1],[px+w1*0.2,y-H*0.9*t1]],'rgba(60,25,10,.28)');}});
    c.beginPath();c.moveTo(x-u*3.3,y-H*0.78);c.quadraticCurveTo(x,y-H*1.28,x+u*3.3,y-H*0.78);c.lineTo(x+u*3.1,y-H*0.62);c.quadraticCurveTo(x,y-H*1.05,x-u*3.1,y-H*0.62);c.closePath();c.fillStyle='#b86a42';c.fill();c.strokeStyle='rgba(60,25,10,.3)';c.lineWidth=u*0.1;c.stroke();TH.ln(c,[x-u*3.0,y-H*0.7],[x+u*3.0,y-H*0.7],'rgba(255,220,170,.2)',u*0.1);}},
  /* ---------- small props (lower tiers only) ---------- */
  hay:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.3,u*0.4,'rgba(70,45,20,.2)');TH.box(c,x,y,u,-0.9,0.1,-0.6,0.6,0,0.9,'#e0c26a','#b89a45','#f0d77a');TH.box(c,x,y,u,0.2,1.2,-0.6,0.6,0,0.9,'#e0c26a','#b89a45','#f0d77a');TH.box(c,x,y,u,-0.4,0.7,-0.5,0.5,0.9,1.8,'#e0c26a','#b89a45','#f0d77a');[-0.4,0.4].forEach(X=>TH.ln(c,I(X,0.61,0.9),I(X,0.61,1.7),'#8a7030',u*0.05));}},
  barrel:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.25,'rgba(70,45,20,.2)');const w=u*0.5,h=u*0.95;TH.ell(c,x,y,w,w*0.4,'#5a3b22');c.fillStyle='#8a5a33';c.beginPath();c.moveTo(x-w,y);c.quadraticCurveTo(x-w*1.12,y-h*0.5,x-w,y-h);c.lineTo(x+w,y-h);c.quadraticCurveTo(x+w*1.12,y-h*0.5,x+w,y);c.ellipse(x,y,w,w*0.4,0,0,Math.PI);c.fill();[0.2,0.8].forEach(f=>TH.ln(c,[x-w*1.04,y-h*f],[x+w*1.04,y-h*f],'#3a3f4a',u*0.08));TH.ell(c,x,y-h,w,w*0.4,'#a97d49');}},
  wheel:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.1,u*0.9,u*0.25,'rgba(70,45,20,.2)');const cx=x,cy=y-u*0.95,r=u*0.95;c.strokeStyle='#6a4a2a';c.lineWidth=u*0.16;c.beginPath();c.ellipse(cx,cy,r*0.78,r,0.15,0,7);c.stroke();for(let k=0;k<8;k++){const a=k/8*6.283;TH.ln(c,[cx,cy],[cx+Math.cos(a)*r*0.78,cy+Math.sin(a)*r],'#6a4a2a',u*0.08);}TH.ell(c,cx,cy,u*0.14,u*0.16,'#3a3f4a');TH.ln(c,[x-u*0.3,y],[cx-u*0.3,cy+r*0.6],'#6a4a2a',u*0.12);}},
  trough:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.6,u*0.45,'rgba(70,45,20,.2)');TH.box(c,x,y,u,-1.3,1.3,-0.45,0.45,0.1,0.85,'#8a5a33','#6a4424','#a97d49');TH.poly(c,[I(-1.15,-0.32,0.86),I(1.15,-0.32,0.86),I(1.15,0.32,0.86),I(-1.15,0.32,0.86)],'#5a9ac0');[-1.2,1.2].forEach(X=>{TH.ln(c,I(X,-0.3,0),I(X,-0.3,0.2),'#5a3b22',u*0.14);TH.ln(c,I(X,0.3,0),I(X,0.3,0.2),'#5a3b22',u*0.14);});}},
  fence:{cat:'prop',rho:0.09,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.3,y+u*0.1,u*2.0,u*0.35,'rgba(70,45,20,.16)');for(let k=0;k<4;k++){const X=-1.8+k*1.2;TH.ln(c,I(X,0,0),I(X,0,1.4),'#6a4a2a',u*0.2);}[0.5,1.05].forEach(z=>TH.ln(c,I(-1.8,0,z),I(1.8,0,z),'#8a6a44',u*0.14));}},
  lamp:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(70,45,20,.2)');TH.ln(c,[x,y],[x,y-u*3.1],'#2a2d36',u*0.16);TH.ln(c,[x,y-u*2.95],[x+u*0.5,y-u*2.95],'#2a2d36',u*0.1);const lx=x+u*0.5,ly=y-u*2.9,g=c.createRadialGradient(lx,ly-u*0.3,0,lx,ly-u*0.3,u*1.4);g.addColorStop(0,'rgba(255,215,130,.5)');g.addColorStop(1,'rgba(255,215,130,0)');c.fillStyle=g;c.beginPath();c.arc(lx,ly-u*0.3,u*1.4,0,7);c.fill();TH.poly(c,[[lx-u*0.25,ly],[lx+u*0.25,ly],[lx+u*0.2,ly-u*0.6],[lx-u*0.2,ly-u*0.6]],'#ffe9a8','#2a2d36',u*0.06);TH.poly(c,[[lx-u*0.3,ly-u*0.6],[lx+u*0.3,ly-u*0.6],[lx,ly-u*0.9]],'#2a2d36');}},
  flags:{cat:'prop',rho:0.12,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*2.4,u*0.4,'rgba(70,45,20,.14)');[-2.2,2.2].forEach(X=>TH.ln(c,I(X,0,0),I(X,0,3.4),'#6a4a2a',u*0.18));const cols=['#c0392b','#f2c230','#2a6aa8','#f6efe0','#3f8a4a'];let prev=null;for(let k=0;k<=10;k++){const X=-2.2+4.4*k/10,p=I(X,0,3.3-Math.sin(k/10*Math.PI)*0.7);if(prev)TH.ln(c,prev,p,'#d9d4c2',u*0.04);prev=p;if(k<10){const q=I(X+0.2,0,3.3-Math.sin((k+0.5)/10*Math.PI)*0.7);TH.poly(c,[[q[0]-u*0.2,q[1]],[q[0]+u*0.2,q[1]],[q[0],q[1]+u*0.55]],cols[k%5]);}}}},
  /* ---------- structures (heavier tiers, one homestead only) ---------- */
  cabin:{cat:'struct',rho:0.17,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.8,y+u*0.2,u*3.0,u*0.9,'rgba(70,45,20,.22)');TH.box(c,x,y,u,-1.7,1.7,-1.2,1.2,0,2.2,'#a07a4e','#7a5a34','#b98c5a');for(let k=-3;k<=3;k++)TH.ln(c,I(k*0.46,1.21,0.05),I(k*0.46,1.21,2.15),'rgba(50,30,10,.35)',u*0.05);
    TH.poly(c,[I(-0.35,1.22,0),I(0.35,1.22,0),I(0.35,1.22,1.5),I(-0.35,1.22,1.5)],'#3a2615');TH.poly(c,[I(-1.3,1.22,1.2),I(-0.7,1.22,1.2),I(-0.7,1.22,1.8),I(-1.3,1.22,1.8)],'#2a1a10','#d9c9a0',u*0.05);
    TH.poly(c,[I(2.1,-1.6,2.2),I(2.1,1.6,2.2),I(0,1.6,3.5),I(0,-1.6,3.5)],'#9aa3a8');for(let k=1;k<7;k++)TH.ln(c,I(2.1-0.3*k,-1.6,2.2+0.185*k),I(2.1-0.3*k,1.6,2.2+0.185*k),'rgba(80,60,40,.3)',u*0.05);TH.poly(c,[I(-2.1,1.6,2.2),I(2.1,1.6,2.2),I(0,1.6,3.5)],'#7a5a34');TH.box(c,x,y,u,0.7,1.1,-0.9,-0.5,3.0,4.2,'#8d8478','#6d665a','#a39b8e');
    TH.box(c,x,y,u,-1.3,1.3,1.3,2.3,0,1.0,'#a07a4e','#7a5a34','#b98c5a');}},
  waterTower:{cat:'struct',rho:0.09,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.6,y+u*0.15,u*1.9,u*0.6,'rgba(70,45,20,.22)');[[-0.9,-0.9],[0.9,-0.9],[-0.9,0.9],[0.9,0.9]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(X*0.8,Y*0.8,4.4),'#6a4a2a',u*0.22));[1.4,3.0].forEach(z=>{const f=1-z*0.05;TH.ln(c,I(-f*0.9,f*0.9,z),I(f*0.9,f*0.9,z),'#6a4a2a',u*0.12);TH.ln(c,I(f*0.9,f*0.9,z),I(f*0.9,-f*0.9,z),'#6a4a2a',u*0.12);});TH.ln(c,I(-0.8,0.8,1.4),I(0.8,0.8,3.0),'#6a4a2a',u*0.08);TH.ln(c,I(0.8,0.8,1.4),I(-0.8,0.8,3.0),'#6a4a2a',u*0.08);
    const b=TH.iso(x,y,u,0,0,4.4),t=TH.iso(x,y,u,0,0,7.0),rx=u*1.25,ry=u*0.62,g=c.createLinearGradient(b[0]-rx,0,b[0]+rx,0);g.addColorStop(0,'#b0865a');g.addColorStop(0.5,'#8a6238');g.addColorStop(1,'#5a3f22');c.beginPath();c.moveTo(b[0]-rx,b[1]);c.lineTo(t[0]-rx,t[1]);c.lineTo(t[0]+rx,t[1]);c.lineTo(b[0]+rx,b[1]);c.ellipse(b[0],b[1],rx,ry,0,0,Math.PI);c.closePath();c.fillStyle=g;c.fill();for(let k=-3;k<=3;k++)TH.ln(c,[b[0]+k*rx*0.3,b[1]+ry*Math.sqrt(1-(k*0.3)**2)],[t[0]+k*rx*0.3,t[1]+ry*Math.sqrt(1-(k*0.3)**2)],'rgba(40,25,10,.3)',u*0.05);[0.3,0.7].forEach(f=>{c.strokeStyle='#3a3f4a';c.lineWidth=u*0.1;c.beginPath();c.ellipse(b[0],b[1]+(t[1]-b[1])*f,rx,ry,0,0,Math.PI);c.stroke();});TH.ell(c,t[0],t[1],rx,ry,'#7a5a34');TH.poly(c,[[t[0]-rx*1.05,t[1]],[t[0],t[1]-u*1.1],[t[0]+rx*1.05,t[1]]],'#6a4a2a');}}
};

/* ===== MACRO-LAND ENGINE (hex geometry, path network, planner, baker) ===== */
const W3=Math.sqrt(3),HX=W3/2,HV=[[HX,0.29],[0,0.58],[-HX,0.29],[-HX,-0.29],[0,-0.58],[HX,-0.29]];
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[-1,0,1],[-1.5,-0.5,0.5],[-2,-1,0],[-1.5,-0.5,0.5]]};
const LAND_KEEP={rx:0.52,ry:0.34};
const vkey=p=>p[0].toFixed(3)+','+p[1].toFixed(3);
function hexInside(dx,dy,s){const ax=Math.abs(dx)/s,ay=Math.abs(dy)/s;return ax<=HX&&ay<=0.58-0.3349*ax;}
/* geometry in units of R, origin = centre of the first hex of row 0 (A: the middle hex of row 0) */
function landGeometry(shape){
  const centers=[];LAND_ROWS[shape].forEach((row,r)=>row.forEach((u,i)=>centers.push({x:u*W3,y:r*0.87,row:r,col:i})));
  const edges=new Map(),verts=new Map();
  centers.forEach((c,ci)=>{for(let k=0;k<6;k++){const a=[c.x+HV[k][0],c.y+HV[k][1]],b=[c.x+HV[(k+1)%6][0],c.y+HV[(k+1)%6][1]],ka=vkey(a),kb=vkey(b),ek=ka<kb?ka+'|'+kb:kb+'|'+ka;let e=edges.get(ek);if(!e){e={a,b,ka,kb,hexes:[]};edges.set(ek,e);}e.hexes.push(ci);
    [[ka,a],[kb,b]].forEach(([kk,p])=>{let v=verts.get(kk);if(!v){v={k:kk,x:p[0],y:p[1],hexes:new Set()};verts.set(kk,v);}v.hexes.add(ci);});}});
  const E=[...edges.values()].map(e=>{const mid=[(e.a[0]+e.b[0])/2,(e.a[1]+e.b[1])/2],len=Math.hypot(e.b[0]-e.a[0],e.b[1]-e.a[1]),vertical=Math.abs(e.a[0]-e.b[0])<1e-6;let n=null,cls=null;
    if(e.hexes.length===1){const c=centers[e.hexes[0]];let nx=mid[0]-c.x,ny=mid[1]-c.y;const m=Math.hypot(nx,ny);n=[nx/m,ny/m];cls=n[1]<-0.4?'top':n[1]>0.4?'bottom':'side';}
    return Object.assign(e,{mid,len,vertical,outer:e.hexes.length===1,n,cls});});
  const V=[...verts.values()].map(v=>Object.assign(v,{junction:v.hexes.size>=3}));
  const xs=[],ys=[];centers.forEach(c=>{xs.push(c.x-HX,c.x+HX);ys.push(c.y-0.58,c.y+0.58);});
  return{centers,edges:E,verts:V,bbox:{minX:Math.min(...xs),maxX:Math.max(...xs),minY:Math.min(...ys),maxY:Math.max(...ys)}};
}
/* ---- corridor reservation (no paths are drawn; the corridors between the slots are kept clear of scenery so rides, queues and guest walkways have room): a spine through the corridors between the slots, then branches that appear on higher tiers ---- */
function planPaths(G,rng){
  const interior=G.edges.filter(e=>e.hexes.length===2),adj=new Map(),node=new Map();
  interior.forEach(e=>{e.w=e.len*(0.85+0.3*rng());[[e.ka,e.a],[e.kb,e.b]].forEach(([k,p])=>{node.set(k,p);if(!adj.has(k))adj.set(k,[]);});adj.get(e.ka).push({to:e.kb,e});adj.get(e.kb).push({to:e.ka,e});});
  const dijk=(sources,target)=>{const dist=new Map(),prev=new Map(),open=new Set(sources);sources.forEach(s=>dist.set(s,0));while(open.size){let cur=null,cd=1e9;open.forEach(k=>{if(dist.get(k)<cd){cd=dist.get(k);cur=k;}});open.delete(cur);if(cur===target)break;adj.get(cur).forEach(({to,e})=>{const nd=cd+e.w;if(!dist.has(to)||nd<dist.get(to)){dist.set(to,nd);prev.set(to,{from:cur,e});open.add(to);}});}
    const out=[];let k=target;while(prev.has(k)&&!sources.includes(k)){const p=prev.get(k);out.push(p.e);k=p.from;}return out;};
  const keys=[...node.keys()],pt=k=>node.get(k);
  const start=keys.reduce((b,k)=>pt(k)[1]>pt(b)[1]+1e-6||(Math.abs(pt(k)[1]-pt(b)[1])<1e-6&&Math.abs(pt(k)[0]-0.9)<Math.abs(pt(b)[0]-0.9))?k:b),end=keys.reduce((b,k)=>pt(k)[1]<pt(b)[1]-1e-6?k:b);
  const net=new Set(),netNodes=new Set([start]),tierOf=new Map();
  const add=(es,t)=>es.forEach(e=>{if(!tierOf.has(e)){tierOf.set(e,t);netNodes.add(e.ka);netNodes.add(e.kb);}});
  add(dijk([start],end),1);
  const farthest=()=>keys.filter(k=>!netNodes.has(k)).reduce((b,k)=>{const d=Math.min(...[...netNodes].map(n=>Math.hypot(pt(k)[0]-pt(n)[0],pt(k)[1]-pt(n)[1])));return !b||d>b.d?{k,d}:b;},null);
  const left=keys.reduce((b,k)=>pt(k)[0]<pt(b)[0]?k:b),right=keys.reduce((b,k)=>pt(k)[0]>pt(b)[0]?k:b);
  [left,right].forEach((tgt,i)=>{if(netNodes.has(tgt)){}else add(dijk([...netNodes],tgt),2+i);});
  const f=farthest();if(f)add(dijk([...netNodes],f.k),4);
  const jit=new Map();keys.forEach(k=>jit.set(k,[(rng()-0.5)*0.05,(rng()-0.5)*0.05]));
  const edgesT=[...tierOf.entries()].map(([e,t])=>({a:e.a,b:e.b,ka:e.ka,kb:e.kb,tier:t,vertical:e.vertical}));
  return{edges:edgesT,netNodes,jit,node};
}
/* waypoint chains for the edges visible at a tier (nodes of degree != 2 start/stop a chain) */
function pathChains(P,tier){
  const es=P.edges.filter(e=>e.tier<=tier),adj=new Map();es.forEach(e=>{[e.ka,e.kb].forEach(k=>{if(!adj.has(k))adj.set(k,[]);});adj.get(e.ka).push(e);adj.get(e.kb).push(e);});
  const used=new Set(),chains=[],pointOf=k=>P.node.get(k),other=(e,k)=>e.ka===k?e.kb:e.ka;
  const walk=(startK)=>{adj.get(startK).forEach(e0=>{if(used.has(e0))return;const chain=[startK];let k=startK,e=e0;while(e&&!used.has(e)){used.add(e);k=other(e,k);chain.push(k);const next=adj.get(k).filter(x=>!used.has(x));e=adj.get(k).length===2&&next.length===1?next[0]:null;}chains.push(chain);});};
  [...adj.keys()].filter(k=>adj.get(k).length!==2).forEach(walk);[...adj.keys()].forEach(k=>walk(k));
  return chains.map(ch=>ch.map(k=>{const p=pointOf(k),j=P.jit.get(k)||[0,0];return[p[0]+j[0],p[1]+j[1]];}));
}
function pathSamples(chains){const out=[];chains.forEach(ch=>{if(ch.length<2)return;let prev=ch[0];const mids=ch.slice(1).map((p,i)=>[(ch[i][0]+p[0])/2,(ch[i][1]+p[1])/2]);
  const seg=(p0,c,p1)=>{for(let t=0;t<=1.0001;t+=0.1){const q=1-t;out.push([q*q*p0[0]+2*q*t*c[0]+t*t*p1[0],q*q*p0[1]+2*q*t*c[1]+t*t*p1[1]]);}};
  const lin=(p0,p1)=>{for(let t=0;t<=1.0001;t+=0.2)out.push([p0[0]+(p1[0]-p0[0])*t,p0[1]+(p1[1]-p0[1])*t]);};
  lin(ch[0],mids[0]);for(let i=1;i<mids.length;i++)seg(mids[i-1],ch[i],mids[i]);lin(mids[mids.length-1],ch[ch.length-1]);});return out;}
/* ---- the planner: every object is placed once (clear of all slot ellipses and the path network) and given a tier range ---- */
const WEST_REGION={top:{pinyon:.28,ponderosa:.16,juniper:.24,cottonwood:.18,mesquite:.04,joshua:.05,deadTree:.05},mid:{cottonwood:.24,mesquite:.2,juniper:.2,pinyon:.12,saguaro:.07,joshua:.08,ponderosa:.05,deadTree:.04},bottom:{mesquite:.26,cottonwood:.2,juniper:.2,joshua:.12,saguaro:.1,pinyon:.07,deadTree:.05}};
const WEST_LOW=['mesquite','juniper','joshua','mesquite','juniper'];            /* short species only in the foreground (never hide a ride's base) */
const WEST_CAP={saguaro:4,joshua:4,deadTree:3,ponderosa:5};
const WEST_PLAN_CACHE={};
function getWestPlan(shape){
  if(WEST_PLAN_CACHE[shape])return WEST_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(shape==='A'?4401:8802),P=planPaths(G,rng),pathPts=pathSamples(pathChains(P,4)),placed=[],bb=G.bbox,used={};
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.9),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.5);return dx*dx+dy*dy>=1;});
  const pathClear=(x,y,rho)=>pathPts.every(p=>Math.hypot(x-p[0],(y-p[1])*1.4)>=0.075+rho*0.55);
  const clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.8);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'mesquite';};
  const capOk=k=>!(WEST_CAP[k]&&(used[k]||0)>=WEST_CAP[k]);
  const regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?WEST_REGION.top:n<0.68?WEST_REGION.mid:WEST_REGION.bottom;};
  const place=(kind,x,y,extra)=>{const A=WEST_ASSETS[kind],sc=(extra&&extra.scale)||(A.cat==='tree'?0.88+rng()*0.38:A.cat==='shrub'?0.9+rng()*0.3:1),rho=A.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!pathClear(px,py,rho)||!clearOthers(px,py,rho))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:A.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const tree=(x,y,extra,dom,low)=>{const ex=extra||{};const k=low?WEST_LOW[Math.floor(rng()*WEST_LOW.length)]:(dom&&rng()<0.55&&capOk(dom)?dom:pickFrom(regionOf(y),capOk));return place(k,x,y,ex);};
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side');
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. the single homestead (heavier tiers): a small cabin on a flank with a water tower beside it, given a clearing */
  {const cand=sides.filter(e=>e.mid[1]>bb.minY+0.9).sort((a,b)=>b.mid[1]-a.mid[1]);for(const e of cand){const p=onEdge(e,0.5,0.14),c=place('cabin',p[0],p[1],{minT:3,scale:1.15,clear:1.9});if(c){const tw=place('waterTower',p[0]+(e.n[0]>0?0.02:-0.02),p[1]-0.5,{minT:4,clear:1.4})||place('waterTower',p[0],p[1]+0.5,{minT:4,clear:1.4});break;}}}
  /* 2. rock backdrop on the upper rim: irregular outcrop clusters (massif / spires / ledge runs), two mesas and one arch */
  {const pts=[];top.forEach(e=>[0.2,0.5,0.8].forEach(t=>pts.push(onEdge(e,t,0.0))));pts.sort((a,b)=>a[0]-b[0]);const x0=pts[0][0],x1=pts[pts.length-1][0],nearest=x=>pts.reduce((b,p)=>Math.abs(p[0]-x)<Math.abs(b[0]-x)?p:b);
    let x=x0+0.15+rng()*0.2,idx=0;const kinds=[];while(x<x1-0.1){kinds.push(x);x+=0.75+rng()*0.65;}
    const mesaAt=[Math.floor(kinds.length*0.28),Math.floor(kinds.length*0.74)],archAt=Math.floor(kinds.length*0.52);
    kinds.forEach((cxp,i)=>{const p=nearest(cxp),bx=p[0],by=p[1];const t=rng(),mt=(a)=>a+(rng()<0.35?1:0);
      const at=(k,dx,dy,ex)=>place(k,bx+dx,by+dy,ex);
      if(mesaAt.includes(i)){at('mesa',0,-0.02,{minT:i===mesaAt[0]?3:4,scale:0.9});at('ledge',-0.5,0.03,{minT:2});at('ledge',0.5,0.02,{minT:3});at('boulders',0.05,0.1,{minT:1});}
      else if(i===archAt){at('arch',0,-0.01,{minT:4,scale:0.85});at('boulders',-0.45,0.06,{minT:2});at('boulders',0.5,0.05,{minT:3});}
      else if(t<0.34){at('butte',0,0,{minT:mt(2)});at('ledge',-0.4,0.04,{minT:2});at('ledge',0.42,0.02,{minT:mt(2)});at('boulders',0.02,0.1,{minT:1});}
      else if(t<0.66){at('spire',-0.22,0,{minT:mt(2)});at('spire',0.08,-0.01,{minT:mt(3),scale:1.15});at('spire',0.36,0.01,{minT:3,scale:0.7});at('boulders',0.06,0.09,{minT:1});at('ledge',-0.5,0.05,{minT:3});}
      else{at('ledge',-0.3,0.03,{minT:mt(1)});at('ledge',0.32,0.0,{minT:2});at('spire',0.02,-0.01,{minT:3,scale:0.6});at('boulders',-0.05,0.1,{minT:1});}});}
  /* 3. trees (the bulk). 3a: interior groves at the junction voids, corridor pairs along the wide vertical corridors */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=pickFrom(regionOf(v.y),capOk),n=1+Math.floor(rng()*2.4);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.13+rng()*0.06:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{const dom=pickFrom(regionOf(e.mid[1]),capOk);[-0.18,0.18].forEach(dy=>{if(rng()<0.62)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});});
  /* 3b: the rim, walked in order as groves / sparse stretches / open stretches so it never reads as a wall */
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.3));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(e.cls==='top'?-0.02:0)+(rng()-0.2)*0.1)});});
    let mode='grove',run=0,dom='mesquite';
    samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.5?'grove':r<0.78?'sparse':'open';run=2+Math.floor(rng()*4);dom=pickFrom(regionOf(s.p[1]),capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){if(e.cls==='top'&&rng()<0.4)return;tree(p[0],p[1],null,dom,low);if(rng()<0.42)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.1,null,dom,low);}
      else if(mode==='sparse'){if(rng()<0.4)tree(p[0],p[1],null,dom,low);else place(['sage','pricklyPear','yucca','dryGrass','barrelCactus'][Math.floor(rng()*5)],p[0],p[1]);}
      else if(rng()<0.5)place(['sage','dryGrass','boulders','yucca'][Math.floor(rng()*4)],p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.5)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  /* 4. low growth in the diagonal corridors */
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.7)place(['sage','pricklyPear','yucca','barrelCactus','dryGrass','boulders'][Math.floor(rng()*6)],e.mid[0]+(rng()-0.5)*0.18,e.mid[1]+(rng()-0.5)*0.1);});
  /* 5. small props: lower tiers only (first six may stay through tier 2, the rest exist only at tier 2) */
  [['flags',1],['hay',2],['barrel',2],['wheel',1],['trough',1],['fence',2],['lamp',2]].forEach(([k,n])=>{for(let i=0;i<n;i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<5?1:2;});
  /* tiers: each object appears at its tier and stays (props leave after tier 2); trees keep >= 60% of the scenery at every tier */
  const cuts={tree:[0.28,0.52,0.78,1],shrub:[0.0,0.35,0.7,1],rock:[0.34,0.58,0.82,1],prop:[1,1,1,1],struct:[0,0,0,1]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop')o.tier=o.minT;});
  const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
  for(let t=1;t<=4;t++){let guard=0;while(guard++<200){const c=count(t);if(c.tr/Math.max(1,c.n)>=0.63)break;const cand=placed.filter(o=>o.tier<=t&&t<=o.maxT&&(o.cat==='shrub'||o.prop)).sort((a,b)=>b.pri-a.pri)[0];if(!cand)break;cand.tier=Math.min(5,cand.tier+1);}}
  placed.sort((a,b)=>a.y-b.y);
  return WEST_PLAN_CACHE[shape]={G,objs:placed,P,rng};
}

/* ===== BAKER: bakeLandWest(shape, tier, R, {mirrorX, ground, scale}) -> depth-sliced land layers =====
 * The ground is drawn first; each scenery band is interleaved with rides by its row depth.
 * Local origin (ox, oy) = centre of the first hex of row 0 (shape A: middle hex of row 0). */
const WEST_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
function westGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed);
  const outer=G.edges.filter(e=>e.outer),P=(p)=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>{TH.poly(c,poly(i),col,col,2);});
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R];
  const pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<40;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'255,244,214':'176,138,84',r()<0.5?0.2:0.16);}
  for(let k=0;k<14;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'196,120,70',0.14);}
  for(let k=0;k<5;k++){const p=pt();for(let j=0;j<7;j++){const a=r()*6.283,l=R*(0.06+r()*0.1);TH.ln(c,[p[0],p[1]],[p[0]+Math.cos(a)*l,p[1]+Math.sin(a)*l*0.5],'rgba(120,85,50,.26)',R*0.012);}}
  for(let k=0;k<170;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.012,R*0.008,r()<0.5?'rgba(120,90,55,.32)':'rgba(255,245,220,.4)');}
  c.restore();c.restore();
}
const WEST_BAKE_CACHE={};
function bakeLandWest(shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||'#e5d2a3',key=[shape,tier,R,Math.round(R*sc),m,ground,sc].join('|');if(WEST_BAKE_CACHE[key])return WEST_BAKE_CACHE[key];
  const plan=getWestPlan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=0.75,top=1.25,bot=0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);return[cv,g];};
  const [back,cb]=mk();
  westGround(cb,G,R,ox,oy,m,ground,shape==='A'?11:22);
  const vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT);
  const rowYs=[...new Set(G.centers.map(c=>c.y))].sort((a,b)=>a-b);
  const objectsByBand=rowYs.map(()=>[]);
  vis.forEach(o=>{
    let band=0;
    while(band<rowYs.length-1&&o.y>=(rowYs[band]+rowYs[band+1])/2)band++;
    objectsByBand[band].push(o);
  });
  const bands=objectsByBand.map((objects,index)=>{
    let fx0=W,fy0=H,fx1=0,fy1=0;
    objects.forEach(o=>{const px=ox+m*o.x*R,py=oy+o.y*R,s=(o.scale||1)*u;fx0=Math.min(fx0,px-4*s);fx1=Math.max(fx1,px+4*s);fy0=Math.min(fy0,py-9*s);fy1=Math.max(fy1,py+2*s);});
    if(!objects.length)return{canvas:null,rect:{x:0,y:0,w:0,h:0},depth:oy+rowYs[index]*R};
    fx0=Math.max(0,Math.floor(fx0));fy0=Math.max(0,Math.floor(fy0));fx1=Math.min(W,Math.ceil(fx1));fy1=Math.min(H,Math.ceil(fy1));
    const fw=fx1-fx0,fh=fy1-fy0,canvas=document.createElement('canvas');
    canvas.width=Math.ceil(fw*sc);canvas.height=Math.ceil(fh*sc);
    const cg=canvas.getContext('2d');cg.scale(sc,sc);cg.translate(-fx0,-fy0);
    objects.sort((a,b)=>a.y-b.y).forEach(o=>WEST_ASSETS[o.kind].draw(cg,ox+m*o.x*R,oy+o.y*R,u*(o.scale||1),o.v));
    return{canvas,rect:{x:fx0,y:fy0,w:fw,h:fh},depth:oy+rowYs[index]*R};
  });
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return WEST_BAKE_CACHE[key]={back,bands,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0};
}
function drawLandWestBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandWestDepthBand(ctx,x,y,land,index){
  const band=land.bands[index];
  if(!band||!band.canvas)return;
  const r=band.rect;
  ctx.drawImage(band.canvas,x-land.ox+r.x,y-land.oy+r.y,r.w,r.h);
}
function drawLandWestFront(ctx,x,y,land){land.bands.forEach((_,index)=>drawLandWestDepthBand(ctx,x,y,land,index));}
/* the slot footprints a ride may occupy (keep-out ellipses), in canvas px of the baked land */
function landWestSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}

/* ===== DEMO HARNESS ===== */
const DEMO_R=56,DEMO_RIDES={A:{top:[0,1],circle:[5],diag:[4,8]},B:{top:[0,1],circle:[4],diag:[3,7]}};
function hull(pts){pts=pts.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);const lo=[];for(const p of pts){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p);}const up=[];for(const p of pts.slice().reverse()){while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p);}up.pop();lo.pop();return lo.concat(up);}
function mockRide(ctx,land,ids,h,col,R){const pts=[];ids.forEach(i=>{const c=land.centers[i];for(let k=0;k<40;k++){const a=k/40*6.283;pts.push([c.x+Math.cos(a)*LAND_KEEP.rx*R,c.y+Math.sin(a)*LAND_KEEP.ry*R]);}});const H=hull(pts),N=14;
  for(let k=0;k<=N;k++){ctx.save();ctx.translate(0,-h*k/N);ctx.beginPath();H.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=k===N?shade(col,0.25):shade(col,-0.1+0.12*k/N);ctx.fill();ctx.strokeStyle='rgba(8,30,45,.5)';ctx.lineWidth=1;if(k===0||k===N)ctx.stroke();ctx.restore();}}
return Object.freeze({ bake: bakeLandWest, drawBack: drawLandWestBack, drawDepthBand: drawLandWestDepthBand, drawFront: drawLandWestFront });
})();

const SPRITE_SKIN_PACKS = Object.freeze({
  rides: Object.freeze({
    restaurant: dinerSkinPack,
    toilets: restroomsSkinPack,
    guest_services: guestServicesSkinPack,
    stage_show: theaterSkinPack,
    chair_swings: chairSwingSkinPack,
    claw: clawSkinPack,
    scrambler: scramblerSkinPack
  }),
  coasters: Object.freeze({
    modern_wood: modernWoodCoasterPack,
    steel_hybrid: hybridCoasterPack,
    giga: gigaCoasterPack,
    hyper: hyperCoasterPack,
    classic_hyper: classicHyperCoasterPack,
    hydro_launch: hydraulicLaunchCoasterPack
  }),
  lands: Object.freeze({
    western: wildWestLandPack,
    frontier: frontierLandMacroPack,
    jungle: jungleLandMacroPack,
    medieval: medievalLandMacroPack,
    gothic: gothicLandMacroPack,
    german: bavarianLandMacroPack,
    bavarian: bavarianLandMacroPack,
    space: spaceLandMacroPack,
    fiesta: fiestaLandMacroPack,
    classic: classicLandMacroPack,
    nordic: nordicLandMacroPack,
    alps: alpineLandMacroPack
  })
});
