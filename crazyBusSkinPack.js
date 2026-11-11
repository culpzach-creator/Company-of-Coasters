(function(){
/* ===== SHARED HELPERS & ISOMETRIC 3D ENGINE (FR) ===== */
function shade(hex, amt){
  if(!hex || hex[0]!=='#') return hex || '#888888';
  const n=parseInt(hex.slice(1),16); let r=n>>16, g=(n>>8)&255, b=n&255;
  const f=c=>Math.max(0,Math.min(255,Math.round(amt<0?c*(1+amt):c+(255-c)*amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

const FR={
  proj(cx,cy,S){return(X,Y,Z)=>[cx+(X-Y)*0.7*S,cy+(X+Y)*0.35*S-Z*S];},
  poly(g,pts,fill,stroke,lw){
    g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();
    if(fill){g.fillStyle=fill;g.fill();g.strokeStyle=fill;g.lineWidth=0.6;g.stroke();}
    if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.lineJoin='round';g.stroke();}
  },
  ell(g,x,y,rx,ry,fill,stroke,lw){
    g.beginPath();g.ellipse(x,y,Math.max(0.4,rx),Math.max(0.4,ry),0,0,7);
    if(fill){g.fillStyle=fill;g.fill();}
    if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();}
  },
  ln(g,a,b,col,w){g.strokeStyle=col;g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();},
  rbox(g,Pj,x0,y0,z0,l,w,h,psi,col,o){
    o=o||{};const c=Math.cos(psi),s=Math.sin(psi),pts=[[-l/2,-w/2],[l/2,-w/2],[l/2,w/2],[-l/2,w/2]].map(([a,b])=>[x0+a*c-b*s,y0+a*s+b*c]),faces=[];
    for(let i=0;i<4;i++){const A=pts[i],B=pts[(i+1)%4],dx=B[0]-A[0],dy=B[1]-A[1],m=Math.hypot(dx,dy)||1,nx=dy/m,ny=-dx/m;if(nx+ny>0.02)faces.push({A,B,nx,ny,d:(A[0]+B[0]+A[1]+B[1])/2});}
    faces.sort((p,q)=>p.d-q.d).forEach(f=>{const amt=Math.max(-0.5,Math.min(0.3,-0.12+0.14*f.ny-0.22*f.nx));FR.poly(g,[Pj(f.A[0],f.A[1],z0),Pj(f.B[0],f.B[1],z0),Pj(f.B[0],f.B[1],z0+h),Pj(f.A[0],f.A[1],z0+h)],shade(col,amt),o.stroke,o.lw);});
    if(!o.noTop)FR.poly(g,pts.map(p=>Pj(p[0],p[1],z0+h)),o.top||shade(col,0.16),o.stroke,o.lw);
  },
  hex(g,cx,cy,R,fill,stroke){
    g.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);g[i?'lineTo':'moveTo'](cx+R*Math.cos(a),cy+R*Math.sin(a)*0.58);}g.closePath();
    g.fillStyle=fill;g.fill();g.lineWidth=Math.max(1.5,R*0.03);g.strokeStyle=stroke;g.stroke();
  },
  layers(key,R,Wf,Hf,oyf,draw){
    FR._c=FR._c||{};if(FR._c[key])return FR._c[key];
    const dpr=(typeof devicePixelRatio==='number'&&devicePixelRatio>1)?devicePixelRatio:1;
    const sc=getBakeScale(),W=Math.ceil(Wf*R),H=Math.ceil(Hf*R),oy=oyf*R,S=R*0.066,res={w:W,h:H,ox:W/2,oy};
    ['back','hub','front','still'].forEach(p=>{
      const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);
      const g=cv.getContext('2d');g.scale(sc,sc);const Pj=FR.proj(W/2,oy,S);
      if(p==='still'){draw(g,Pj,S,'back');draw(g,Pj,S,'cars_back',0);draw(g,Pj,S,'hub');draw(g,Pj,S,'cars_front',0);draw(g,Pj,S,'front');}
      else draw(g,Pj,S,p);
      res[p]=cv;
    });
    return FR._c[key]=res;
  },
  render(ctx,cx,cy,R,key,Wf,Hf,oyf,draw,t){
    const L=FR.layers(key,R,Wf,Hf,oyf,draw);
    if(t==null){ctx.drawImage(L.still,cx-L.ox,cy-L.oy,L.w,L.h);return;}
    const S=R*0.066,Pj=FR.proj(cx,cy,S),bl=n=>ctx.drawImage(L[n],cx-L.ox,cy-L.oy,L.w,L.h);
    bl('back');draw(ctx,Pj,S,'cars_back',t);bl('hub');draw(ctx,Pj,S,'cars_front',t);bl('front');
  },
  atlas(S,w,h,ox,oy,n,fn){
    const dpr=(typeof devicePixelRatio==='number'&&devicePixelRatio>1)?devicePixelRatio:1;
    const sc=getBakeScale(),cache={};
    return function(i,psi){
      const k=Math.round((((psi%6.2832)+6.2832)%6.2832)/6.2832*n)%n,key=i*1000+k;
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

/* ===== CRAZY BUS / FLYING GONDOLA SKIN DEFINITIONS (UNTHEMED + 11 HEAVY/IMMERSIVE THEMES) ===== */
const CRAZY_BUS_SKINS = {
  unthemed: {
    id:'unthemed', label:'Unthemed (Tier 0–2)', name:'Zamperla Crazy Bus', sub:'Checkered Transit Plaza, Twin Towers & Cheerful 3D Bus',
    sign:'CRAZY BUS', hex:'#9bbf63', border:'#f59e0b',
    plinth:'#cbd5e1', floor1:'#475569', floor2:'#334155', trim:'#facc15',
    tow:'#f8fafc', band1:'#ef4444', band2:'#3b82f6', crown:'beacon',
    arm1:'#ef4444', arm2:'#facc15', cw:'#3b82f6'
  },
  western: {
    id:'western', label:'Wild West', name:'Pioneer Covered Wagon Flyer', sub:'Timber Depot Platform, Water-Tank Towers & Conestoga Covered Wagon',
    sign:'WAGON TRAIN', hex:'#c99a62', border:'#b45309',
    plinth:'#8a5a33', floor1:'#a8784a', floor2:'#78350f', trim:'#f59e0b',
    tow:'#9a6a3c', band1:'#78350f', band2:'#b45309', crown:'windmill',
    arm1:'#78350f', arm2:'#d97706', cw:'#27272a'
  },
  classic: {
    id:'classic', label:'Classic Midway', name:'Boardwalk Cable-Car Flyer', sub:'Victorian Mosaic Pavilion, Gilded Towers & 1920s San Francisco Trolley',
    sign:'TROLLEY FLYER', hex:'#cbb07c', border:'#e11d48',
    plinth:'#f8f1df', floor1:'#e8dec3', floor2:'#991b1b', trim:'#f5c542',
    tow:'#fffbeb', band1:'#e11d48', band2:'#1d4ed8', crown:'dome',
    arm1:'#f5c542', arm2:'#fff3b0', cw:'#e11d48'
  },
  jungle: {
    id:'jungle', label:'Jungle', name:'Temple Expedition Safari Bus', sub:'Mayan Limestone Courtyard, Serpent Pillars & 4x4 Croc-Prow Jungle Bus',
    sign:'SAFARI EXPED.', hex:'#587c48', border:'#2fbf9a',
    plinth:'#8e8a72', floor1:'#bdb9a0', floor2:'#137a70', trim:'#eab308',
    tow:'#c7bfa4', band1:'#137a70', band2:'#b45309', crown:'brazier',
    arm1:'#78350f', arm2:'#eab308', cw:'#2fbf9a'
  },
  frontier: {
    id:'frontier', label:'Frontier', name:'Yukon Voyageur War Canoe', sub:'Log Trading Post Deck, Totem Towers & Carved Birchbark War Canoe',
    sign:'YUKON CANOE', hex:'#7d955d', border:'#566e42',
    plinth:'#6b4a2b', floor1:'#8a5a33', floor2:'#2f5f3a', trim:'#eab308',
    tow:'#8a5a33', band1:'#2f5f3a', band2:'#5a3b22', crown:'pinecone',
    arm1:'#5a3b22', arm2:'#d9b27a', cw:'#2f5f3a'
  },
  space: {
    id:'space', label:'Space', name:'Orbital VTOL Dropship', sub:'Titanium Telemetry Pad, Plasma Pylons & Lunar Personnel Shuttle',
    sign:'STAR SHUTTLE', hex:'#334155', border:'#0ea5e9',
    plinth:'#0f172a', floor1:'#1e293b', floor2:'#0284c7', trim:'#22d3ee',
    tow:'#e2e8f0', band1:'#0284c7', band2:'#a855f7', crown:'orb',
    arm1:'#cbd5e1', arm2:'#22d3ee', cw:'#a855f7'
  },
  gothic: {
    id:'gothic', label:'Gothic', name:'River Styx Charon Ferry Boat', sub:'Crypt Cobblestone Dock, Gargoyle Belfries & Lantern-Lit Ferry Skiff',
    sign:'STYX FERRY', hex:'#3b3345', border:'#7e22ce',
    plinth:'#27272a', floor1:'#3f3f46', floor2:'#1e1b4b', trim:'#a855f7',
    tow:'#3f3f46', band1:'#18181b', band2:'#581c87', crown:'spire',
    arm1:'#18181b', arm2:'#a855f7', cw:'#4c1d95'
  },
  medieval: {
    id:'medieval', label:'Medieval', name:'Royal Sky-Galley Barge', sub:'Cut-Stone Castle Courtyard, Turret Bastions & Gilded Lion War-Galley',
    sign:'ROYAL GALLEY', hex:'#6c8c58', border:'#eab308',
    plinth:'#94a3b8', floor1:'#cbd5e1', floor2:'#1e3a8a', trim:'#f5c542',
    tow:'#e2dcd0', band1:'#1d4ed8', band2:'#b91c1c', crown:'turret',
    arm1:'#b45309', arm2:'#f5c542', cw:'#1d4ed8'
  },
  alps: {
    id:'alps', label:'Alps', name:'Glacier Express Panorama Car', sub:'Alpine Stone Terrace, Chalet Pylons & Red Swiss Panorama Cable-Car',
    sign:'GLACIER EXPR.', hex:'#a8c5d6', border:'#0284c7',
    plinth:'#cbd5e1', floor1:'#e2e8f0', floor2:'#0284c7', trim:'#dc2626',
    tow:'#b45309', band1:'#dc2626', band2:'#f8fafc', crown:'chalet',
    arm1:'#dc2626', arm2:'#f8fafc', cw:'#0284c7'
  },
  fiesta: {
    id:'fiesta', label:'Fiesta', name:'Xochimilco Fiesta Trajinera', sub:'Talavera Tile Courtyard, Mission Bell Towers & Flower-Crowned Gondola Boat',
    sign:'XOCHIMILCO', hex:'#d99b52', border:'#e11d48',
    plinth:'#fef3c7', floor1:'#fde68a', floor2:'#0d9488', trim:'#e11d48',
    tow:'#fef3c7', band1:'#0d9488', band2:'#e11d48', crown:'bell',
    arm1:'#f59e0b', arm2:'#ec4899', cw:'#0d9488'
  },
  nordic: {
    id:'nordic', label:'Nordic', name:'Asgardian Sky-Drakkar Ship', sub:'Fjord Flagstone Hall, Runic Stave Towers & Shield-Rimmed Viking Longship',
    sign:'SKY DRAKKAR', hex:'#4d6b63', border:'#d97706',
    plinth:'#475569', floor1:'#64748b', floor2:'#451a03', trim:'#f59e0b',
    tow:'#451a03', band1:'#0284c7', band2:'#d97706', crown:'dragon',
    arm1:'#78350f', arm2:'#f59e0b', cw:'#0284c7'
  },
  bavarian: {
    id:'bavarian', label:'Bavarian', name:'Oktoberfest Brewery Dray Wagon', sub:'Fachwerk Courtyard, Copper Kettle Towers & Barrel-Stacked Fest Wagon',
    sign:'FEST WAGON', hex:'#769958', border:'#2563eb',
    plinth:'#f8f5ec', floor1:'#dfd9c8', floor2:'#2563eb', trim:'#eab308',
    tow:'#f8f5ec', band1:'#2563eb', band2:'#b91c1c', crown:'onion',
    arm1:'#d97706', arm2:'#fef08a', cw:'#2563eb'
  }
};
CRAZY_BUS_SKINS.german = CRAZY_BUS_SKINS.bavarian;
CRAZY_BUS_SKINS.wildwest = CRAZY_BUS_SKINS.western;
CRAZY_BUS_SKINS.standard = CRAZY_BUS_SKINS.unthemed;

/* ===== SPRITE CODE: copy this block into engine.js ===== */
const CB_CFG = {
  pivX: [-1.85, 1.85],
  pivY: -1.42,
  pivZ:  3.75,
  armR:  1.95,
  cwR:   0.95,
  carY:  0.55
};

/**
 * Pre-baked 3D Isometric Vehicle Gondola (`cbGondola`) rendered into `FR.atlas`:
 *  - Every vehicle is built in true 3D isometric space `(X, Y, Z)` using `FR.rbox`, `FR.poly`, `FR.ln`, and `FR.ell`
 *    at the exact same scale and detail level as `fcCarpetGondola` in `flat_ride_crazy_bus.html`!
 *  - Includes 4 rows of 2 seated riders (8 riders total) with raised cheering arms and lap bars.
 */
function cbGondola(g, Pj, S, theme, A){
  const sk = CRAZY_BUS_SKINS[theme] || CRAZY_BUS_SKINS.unthemed;
  const Z = 0, fI = (X,Y,Zz) => Pj(X, Y, Z + Zz);
  const gold = '#f5c542', goldD = '#b8861b', goldL = '#fff3b0';

  // Helper: Draw 3D Wheel on the front (+Y) and back (-Y) flanks of wheeled vehicles
  const drawWheel3D = (wx, wy, wz, rad, tireCol, rimCol, spoked=false) => {
    const p = fI(wx, wy, wz);
    FR.ell(g, p[0], p[1], S*rad*0.92, S*rad*1.02, tireCol, '#0f172a', S*0.05);
    FR.ell(g, p[0], p[1], S*rad*0.58, S*rad*0.64, rimCol);
    if(spoked){
      for(let k=0; k<6; k++){
        const a = k * Math.PI / 3;
        FR.ln(g, [p[0]-Math.cos(a)*S*rad*0.8, p[1]-Math.sin(a)*S*rad*0.85], [p[0]+Math.cos(a)*S*rad*0.8, p[1]+Math.sin(a)*S*rad*0.85], rimCol, S*0.045);
      }
    }
    FR.ell(g, p[0], p[1], S*rad*0.18, S*rad*0.18, gold);
  };

  // Helper: Draw 4 Rows of 2 Riders (8 Riders Total) seated inside the vehicle at height `zSeat`
  const drawRiders4Rows = (rowsX, zSeat, benchCol) => {
    const shirts = ['#ef4444','#3b82f6','#10b981','#f59e0b','#ec4899','#8b5cf6'];
    const skins  = ['#fde4c8','#e8b890','#f5cba7','#d49b72'];
    rowsX.forEach((rx, rIdx) => {
      FR.rbox(g, Pj, rx, 0, Z+zSeat, 0.42, 1.52, 0.22, 0, benchCol || '#334155', {top: shade(benchCol||'#334155', 0.2)});
      [-0.42, 0.42].forEach((ry, sIdx) => {
        const idx = rIdx*2 + sIdx;
        const torso = fI(rx, ry, zSeat + 0.36);
        const head  = fI(rx, ry, zSeat + 0.74);
        FR.ell(g, torso[0], torso[1], S*0.23, S*0.27, shirts[idx % shirts.length]);
        FR.ell(g, head[0],  head[1],  S*0.17, S*0.17, theme==='space' ? '#ffffff' : skins[idx % skins.length]);
        if((rIdx===0 || rIdx===rowsX.length-1) && sIdx===1){
          FR.ln(g, torso, [head[0]+S*0.22, head[1]-S*0.24], skins[idx % skins.length], S*0.065);
        }
      });
      FR.ln(g, fI(rx+0.16, -0.76, zSeat+0.34), fI(rx+0.16, 0.76, zSeat+0.34), goldL, S*0.075);
    });
  };

  // Dark steel under-cradle beam connecting to the 4-bar linkage pins
  FR.rbox(g, Pj, 0, 0, Z+0.12, 4.2, 1.95, 0.16, 0, '#1e293b');

  // =========================================================================
  // 1. UNTHEMED STANDARD: Cheerful 3D Zamperla School / Tour Bus
  // =========================================================================
  if(theme === 'unthemed'){
    const busCol = A || '#f59e0b', busDark = shade(busCol, -0.25);
    // Back wheels (-Y) drawn behind chassis
    drawWheel3D(-1.35, -1.08, 0.42, 0.46, '#18181b', '#e2e8f0');
    drawWheel3D( 1.25, -1.08, 0.42, 0.46, '#18181b', '#e2e8f0');
    // Lower 3D Bus Chassis & Red/White Rub-Rail Bumper
    FR.rbox(g, Pj, -0.25, 0, Z+0.28, 4.3, 2.05, 0.72, 0, busCol, {top:'#fef3c7'});
    // Projecting Front Engine Hood (+X nose from +1.90 to +2.65) with Chrome Grille & Headlights!
    FR.rbox(g, Pj, 2.22, 0, Z+0.28, 0.85, 1.72, 0.66, 0, busCol, {top:shade(busCol,0.12)});
    FR.poly(g, [fI(2.66,-0.55,0.34),fI(2.66,0.55,0.34),fI(2.66,0.55,0.82),fI(2.66,-0.55,0.82)], '#e2e8f0', '#475569', S*0.05);
    [-0.68, 0.68].forEach(hy => FR.ell(g, ...fI(2.67, hy, 0.58), S*0.14, S*0.14, '#fef08a', '#d97706', S*0.04));
    // Red racing stripe & chrome bumper along the +Y front-facing side of the bus
    FR.poly(g, [fI(-2.40,1.04,0.48),fI(1.90,1.04,0.48),fI(1.90,1.04,0.66),fI(-2.40,1.04,0.66)], '#ef4444', '#ffffff', S*0.04);
    FR.ln(g, fI(-2.45,1.06,0.30), fI(2.68,1.06,0.30), '#e2e8f0', S*0.12);
    // 4 Rows of Cheering Riders inside the Open-Window Cabin
    drawRiders4Rows([-1.65, -0.65, 0.35, 1.30], 0.78, '#1e3a8a');
    // 3D Window Pillars & Domed Bus Roof with Rooftop Luggage Rack & Destination Sign!
    [-2.25, -1.15, -0.15, 0.85, 1.78].forEach(px => {
      FR.ln(g, fI(px, -0.98, 0.98), fI(px, -0.98, 1.72), busDark, S*0.11);
      FR.ln(g, fI(px,  0.98, 0.98), fI(px,  0.98, 1.72), busCol,  S*0.13);
    });
    // Slanted front windshield frame
    FR.poly(g, [fI(1.80,-0.96,0.98),fI(1.80,0.96,0.98),fI(1.62,0.96,1.72),fI(1.62,-0.96,1.72)], 'rgba(186,230,253,0.45)', '#e2e8f0', S*0.06);
    // Bus Roof & Chrome Roof-Rack with Destination Roller Sign
    FR.rbox(g, Pj, -0.32, 0, Z+1.72, 4.15, 2.02, 0.20, 0, '#f8fafc', {top:busCol});
    FR.rbox(g, Pj, 1.45, 0, Z+1.92, 0.55, 1.35, 0.24, 0, '#0f172a', {top:gold});
    // Near-side (+Y) 3D Bus Tires with Whitewall Rims
    drawWheel3D(-1.35, 1.08, 0.42, 0.48, '#18181b', '#f8fafc');
    drawWheel3D( 1.25, 1.08, 0.42, 0.48, '#18181b', '#f8fafc');
  }

  // =========================================================================
  // 2. WILD WEST (`western`): Conestoga Pioneer Covered Wagon with Hooped Canvas Bonnet!
  // =========================================================================
  else if(theme === 'western'){
    const wagonBed = '#8a5a33', trimG = '#f59e0b', woodD = '#451a03';
    // Far-side (-Y) Spoked Wooden Wagon Wheels (larger rear wheel, smaller front wheel)
    drawWheel3D(-1.38, -1.08, 0.48, 0.58, woodD, trimG, true);
    drawWheel3D( 1.32, -1.08, 0.42, 0.48, woodD, trimG, true);

    // Flared Conestoga Wooden Wagon Bed (-2.35 to +2.35) + Front Driver Buckboard Box
    FR.rbox(g, Pj, -0.10, 0, Z+0.34, 4.45, 2.02, 0.62, 0, wagonBed, {top:woodD});
    FR.rbox(g, Pj,  2.05, 0, Z+0.42, 0.72, 1.82, 0.65, 0, woodD, {top:trimG});
    FR.ln(g, fI(-2.30,1.03,0.62), fI(2.30,1.03,0.62), trimG, S*0.11);

    // 4 Rows of Cheering Riders (Front buckboard riders visible; rear riders under the arched canvas bonnet)
    drawRiders4Rows([-1.45, -0.45, 0.55, 1.65], 0.78, woodD);

    // Iconic Arched White/Cream Canvas Covered-Wagon Bonnet (4 Ribbed Canvas Bays from X = -2.30 to +1.25)
    // Open along the lower sides so passengers inside remain visible, with curved wooden hoop ribs!
    const bonnetBays = [-1.85, -0.95, -0.05, 0.80];
    bonnetBays.forEach((bx, bIdx) => {
      const colCanv = (bIdx % 2 === 0) ? '#f8f2e0' : '#efe6cc';
      // Arched top canvas canopy & upper side valance
      FR.rbox(g, Pj, bx, 0, Z+1.52, 0.90, 2.04, 0.42, 0, colCanv, {top:'#ffffff'});
      FR.rbox(g, Pj, bx, 0, Z+1.94, 0.86, 1.48, 0.20, 0, '#ffffff', {top:'#fdfbf5'});
      // Curved bent-hickory wagon hoop ribs descending to the wagon gunwale
      FR.ln(g, fI(bx-0.42,-1.00,0.95), fI(bx-0.42,-1.00,1.65), woodD, S*0.09);
      FR.ln(g, fI(bx-0.42, 1.00,0.95), fI(bx-0.42, 1.00,1.65), trimG, S*0.10);
    });
    // Rear canvas drawstring opening (-X) & front canvas hoop brow (+1.25)
    FR.ln(g, fI(1.22, -1.00, 0.95), fI(1.22, 1.00, 1.85), woodD, S*0.10);

    // Side-mounted oak water barrel & brass trail lantern on the +Y flank of the wagon bed
    const bPos = fI(-0.15, 1.12, 0.62);
    FR.ell(g, bPos[0], bPos[1], S*0.26, S*0.32, '#78350f', woodD, S*0.05);
    FR.ell(g, ...fI(1.95, 0.98, 1.22), S*0.14, S*0.17, '#fef08a', trimG, S*0.05);

    // Near-side (+Y) Spoked Wooden Wagon Wheels
    drawWheel3D(-1.38, 1.08, 0.48, 0.60, woodD, trimG, true);
    drawWheel3D( 1.32, 1.08, 0.42, 0.50, woodD, trimG, true);
  }

  // =========================================================================
  // 3. CLASSIC MIDWAY (`classic`): 1920s San Francisco Boardwalk Cable Car
  // =========================================================================
  else if(theme === 'classic'){
    const carCol = '#e11d48', cream = '#fffbeb';
    drawWheel3D(-1.30, -0.95, 0.34, 0.38, '#334155', gold);
    drawWheel3D( 1.30, -0.95, 0.34, 0.38, '#334155', gold);
    // Steel bogie underframe & wooden running boards
    FR.rbox(g, Pj, 0, 0, Z+0.26, 4.75, 2.15, 0.16, 0, '#78350f', {top:gold});
    FR.rbox(g, Pj, 0, 0, Z+0.42, 4.45, 1.98, 0.65, 0, carCol, {top:cream});
    // Ornate gold panel borders along the +Y side
    [-1.45, 0, 1.45].forEach(px => {
      FR.poly(g, [fI(px-0.55,1.00,0.50),fI(px+0.55,1.00,0.50),fI(px+0.55,1.00,0.96),fI(px-0.55,1.00,0.96)], cream, gold, S*0.05);
    });
    // Brass cowcatcher & glowing brass trolley headlamp at +X
    FR.poly(g, [fI(2.25,-0.85,0.22),fI(2.65,0,0.22),fI(2.25,0.85,0.22),fI(2.25,0,0.52)], goldD, goldL, S*0.05);
    FR.ell(g, ...fI(2.32, 0, 0.72), S*0.20, S*0.20, '#fef08a', goldD, S*0.06);
    drawRiders4Rows([-1.55, -0.52, 0.52, 1.55], 0.82, '#1e3a8a');
    // Brass stanchion poles & Double-Tiered Clerestory Trolley Roof!
    [-2.05, -1.02, 0, 1.02, 2.05].forEach(px => {
      FR.ln(g, fI(px,-0.94,1.05), fI(px,-0.94,1.76), goldD, S*0.09);
      FR.ln(g, fI(px, 0.94,1.05), fI(px, 0.94,1.76), goldL, S*0.11);
    });
    FR.rbox(g, Pj, 0, 0, Z+1.76, 4.55, 2.02, 0.16, 0, cream, {top:carCol});
    FR.rbox(g, Pj, 0, 0, Z+1.92, 3.10, 1.28, 0.24, 0, '#1e3a8a', {top:gold});
    drawWheel3D(-1.30, 0.95, 0.34, 0.38, '#334155', gold);
    drawWheel3D( 1.30, 0.95, 0.34, 0.38, '#334155', gold);
  }

  // =========================================================================
  // 4. JUNGLE, FRONTIER, FIESTA, NORDIC, MEDIEVAL, GOTHIC: Sculpted 3D Boat & Ship Hulls!
  //    (Uses a multi-point curved 3D hull profile just like `fcCarpetGondola`!)
  // =========================================================================
  else if(theme==='jungle' || theme==='frontier' || theme==='fiesta' || theme==='nordic' || theme==='medieval' || theme==='gothic'){
    const hullC = {
      jungle:   ['#78350f', '#15803d', '#eab308'],
      frontier: ['#d9b27a', '#8a5a33', '#2f5f3a'], // Zero red: birchbark, cedar & forest pine!
      fiesta:   ['#0d9488', '#e11d48', '#facc15'],
      nordic:   ['#5a361a', '#3e2410', '#f59e0b'], // Zero red: dark oak, tarred pine & gold!
      medieval: ['#1e3a8a', '#b91c1c', '#f5c542'],
      gothic:   ['#18181b', '#3b0764', '#a855f7']  // Gothic River Styx Charon Ferry Boat!
    }[theme];

    // Curved 3D boat/ship hull profile from X = -2.65 to +2.65 with upswept bow & stern
    const N = 24, prof = [];
    for(let i=0; i<=N; i++){
      const s = -1 + 2*i/N, X = s * 2.60;
      const edge = Math.max(0, Math.abs(s) - 0.55) / 0.45;
      const zBot = 0.22 + 0.38 * Math.pow(edge, 2.0);
      const zGun = 0.86 + 0.52 * Math.pow(edge, 1.85);
      prof.push([X, zBot, zGun]);
    }
    const W = 1.08;
    // 1. Interior deck floor & 4 rows of cheering riders
    FR.rbox(g, Pj, 0, 0, Z+0.32, 4.2, 1.85, 0.20, 0, hullC[1], {top: shade(hullC[0], -0.15)});
    drawRiders4Rows([-1.50, -0.50, 0.50, 1.50], 0.55, hullC[1]);

    // 2. Near-side (+Y) 3D Clinker/Carved Hull Wall & Gunwale Trim
    const frontTop = prof.map(([X,zb,zg]) => fI(X, W, zg));
    const frontBot = prof.slice().reverse().map(([X,zb,zg]) => fI(X, W*0.82, zb));
    FR.poly(g, frontTop.concat(frontBot), hullC[0], hullC[2], S*0.07);
    // Decorative gunwale stripe along +Y hull
    const stripeTop = prof.map(([X,zb,zg]) => fI(X, W+0.01, zg-0.06));
    const stripeBot = prof.slice().reverse().map(([X,zb,zg]) => fI(X, W+0.01, zg-0.22));
    FR.poly(g, stripeTop.concat(stripeBot), hullC[1]);

    // 3. Theme-Specific Bow/Stern Sculptures & Canopies!
    if(theme === 'nordic'){
      // Viking Drakkar: Towering Golden Dragon-Head Prow at +X, Curled Tail at -X & 6 Painted Shields (Zero Red)!
      const pBow = fI(2.65, 0, 1.35), pHead = fI(2.95, 0, 2.35);
      FR.ln(g, pBow, pHead, goldD, S*0.34);
      FR.ln(g, pBow, pHead, gold,  S*0.20);
      FR.poly(g, [pHead, [pHead[0]+S*0.55,pHead[1]-S*0.18], [pHead[0]+S*0.35,pHead[1]+S*0.15]], gold, goldL, S*0.05);
      const pStern = fI(-2.65, 0, 1.35), pTail = fI(-2.85, 0, 2.15);
      FR.ln(g, pStern, pTail, gold, S*0.24);
      FR.ell(g, pTail[0], pTail[1], S*0.22, S*0.22, goldL, goldD, S*0.05);
      // 6 Overlapping Viking Round Shields along the +Y gunwale (Fjord Blue & Dark Slate — no red!)
      [-1.8, -1.08, -0.36, 0.36, 1.08, 1.8].forEach((sx, si) => {
        const sp = fI(sx, W+0.04, 0.72);
        FR.ell(g, sp[0], sp[1], S*0.26, S*0.26, si%2 ? '#334155' : '#0284c7', gold, S*0.05);
        FR.ell(g, sp[0], sp[1], S*0.09, S*0.09, goldL);
      });
    }
    else if(theme === 'gothic'){
      // Gothic River Styx Charon Ferry Boat: Curved Wrought-Iron Bow Prow with Dangling Soul-Lantern,
      // Bone/Gargoyle Figurehead, Tattered Velvet Stern Baldachin & Oarlocks!
      const pBow = fI(2.62, 0, 1.38), pHook = fI(3.15, 0, 2.45), pLamp = fI(3.15, 0, 1.75);
      FR.ln(g, pBow, pHook, '#27272a', S*0.26);
      FR.ln(g, pBow, pHook, '#a1a1aa', S*0.12);
      // Dangling chain & flickering green/violet soul-lantern hanging from the iron bow hook
      FR.ln(g, pHook, pLamp, '#d4d4d8', S*0.06);
      FR.ell(g, pLamp[0], pLamp[1], S*0.24, S*0.28, '#10b981', '#fde047', S*0.06);
      FR.ell(g, pLamp[0], pLamp[1], S*0.12, S*0.14, '#ecfdf5');
      // Sculpted silver skull/gargoyle figurehead at the bow stem
      const pSkull = fI(2.78, 0, 1.25);
      FR.ell(g, pSkull[0], pSkull[1], S*0.22, S*0.22, '#e4e4e7', '#18181b', S*0.05);
      // Wrought-iron gothic ribs & dark velvet stern canopy (-X)
      [-2.15, -1.15].forEach(px => {
        FR.ln(g, fI(px,-W*0.88,0.95), fI(px,-W*0.88,1.82), '#27272a', S*0.09);
        FR.ln(g, fI(px, W*0.88,0.95), fI(px, W*0.88,1.82), '#71717a', S*0.11);
      });
      FR.rbox(g, Pj, -1.65, 0, Z+1.82, 1.35, 1.92, 0.20, 0, '#18181b', {top:'#581c87'});
      // Crossed ferryman's oars stowed along the +Y gunwale
      [-0.8, 0.6].forEach(ox => {
        FR.ln(g, fI(ox, W+0.04, 0.88), fI(ox-0.45, W+0.14, 0.24), '#52525b', S*0.09);
      });
    }
    else if(theme === 'fiesta'){
      // Xochimilco Trajinera: Arched Floral Roof Canopy & Marigold Garland Arch ("MARIA / FIESTA")
      [-1.75, 0, 1.75].forEach(px => {
        FR.ln(g, fI(px,-W*0.9,0.88), fI(px,-W*0.9,1.72), '#f59e0b', S*0.09);
        FR.ln(g, fI(px, W*0.9,0.88), fI(px, W*0.9,1.72), '#f59e0b', S*0.11);
      });
      FR.rbox(g, Pj, 0, 0, Z+1.72, 3.85, 2.05, 0.22, 0, '#e11d48', {top:'#facc15'});
      // Floral rainbow arch along the roof edge
      for(let k=-5; k<=5; k++){
        const fp = fI(k*0.34, W+0.02, 1.84);
        FR.ell(g, fp[0], fp[1], S*0.15, S*0.15, k%2 ? '#fde047' : '#10b981');
      }
    }
    else if(theme === 'jungle'){
      // Safari Expedition Boat: Carved Green Crocodile Snout at +X & Bamboo Thatch Sun Canopy!
      const pSnout = fI(2.60, 0, 0.75), pTip = fI(3.35, 0, 0.65);
      FR.poly(g, [fI(2.45,-0.65,0.95), pTip, fI(2.45,0.65,0.95), fI(2.45,0,0.45)], '#15803d', '#14532d', S*0.06);
      FR.ell(g, ...fI(2.65, 0.35, 0.98), S*0.13, S*0.13, '#facc15', '#0f172a', S*0.04);
      // Bamboo canopy posts & woven palm-thatch roof
      [-1.65, 1.65].forEach(px => {
        FR.ln(g, fI(px,-W*0.88,0.88), fI(px,-W*0.88,1.72), '#a16207', S*0.09);
        FR.ln(g, fI(px, W*0.88,0.88), fI(px, W*0.88,1.72), '#ca8a04', S*0.11);
      });
      FR.rbox(g, Pj, 0, 0, Z+1.72, 3.75, 1.98, 0.22, 0, '#b5893d', {top:'#d97706'});
    }
    else if(theme === 'frontier'){
      // Birchbark Voyageur War Canoe: High Curled Bark Tips, Red Totem Paint & Crossed Wooden Paddles!
      [-2.55, 2.55].forEach(ex => {
        const pTip = fI(ex, 0, 1.55);
        FR.ell(g, pTip[0], pTip[1], S*0.24, S*0.32, '#8a5a33', '#451a03', S*0.06);
      });
      [-1.2, 0.2, 1.4].forEach(px => {
        FR.ln(g, fI(px, W+0.03, 0.92), fI(px-0.35, W+0.12, 0.25), '#8a5a33', S*0.09);
      });
    }
    else if(theme === 'medieval'){
      // Royal Sky-Galley War Barge: Gilded Lion Figurehead at +X, Aft Quarterdeck & Heraldic Shields!
      const pLion = fI(2.75, 0, 1.15);
      FR.ell(g, pLion[0], pLion[1], S*0.34, S*0.30, gold, goldD, S*0.06);
      FR.ell(g, pLion[0]+S*0.12, pLion[1]-S*0.06, S*0.18, S*0.18, goldL);
      [-1.5, -0.5, 0.5, 1.5].forEach((sx, si) => {
        const sp = fI(sx, W+0.03, 0.72);
        FR.poly(g, [[sp[0]-S*0.18,sp[1]-S*0.18],[sp[0]+S*0.18,sp[1]-S*0.18],[sp[0]+S*0.18,sp[1]+S*0.08],[sp[0],sp[1]+S*0.26],[sp[0]-S*0.18,sp[1]+S*0.08]], si%2?'#b91c1c':gold, goldL, S*0.04);
      });
    }
  }

  // =========================================================================
  // 5. SPACE, GOTHIC, ALPS, BAVARIAN: Bespoke 3D Cabins & Wagons!
  // =========================================================================
  else if(theme === 'space'){
    // Lunar VTOL Dropship: Faceted Titanium Hull, Cyan Belly Thrusters, Swept Wings & Cockpit Canopy!
    [-1.45, 0, 1.45].forEach(tx => {
      const tp = fI(tx, 0, 0.22);
      FR.ell(g, tp[0], tp[1], S*0.45, S*0.22, '#22d3ee', '#ffffff', S*0.05);
    });
    FR.rbox(g, Pj, -0.15, 0, Z+0.32, 4.45, 2.08, 0.65, 0, '#e2e8f0', {top:'#0284c7'});
    // Angled nose cone (+X) with glowing cyan cockpit visor
    FR.poly(g, [fI(2.05,-0.92,0.35),fI(2.85,0,0.45),fI(2.05,0.92,0.35),fI(2.05,0,0.98)], '#0284c7', '#22d3ee', S*0.06);
    // Swept delta winglets on +Y side & rear twin tailfins at -X
    FR.poly(g, [fI(-0.8,1.06,0.55),fI(0.8,1.06,0.55),fI(0.2,1.65,0.45),fI(-1.1,1.65,0.45)], '#38bdf8', '#0f172a', S*0.05);
    drawRiders4Rows([-1.50, -0.50, 0.50, 1.45], 0.78, '#0f172a');
    FR.rbox(g, Pj, -2.15, 0, Z+0.95, 0.55, 1.85, 0.72, 0, '#0284c7', {top:'#22d3ee'});
  }
  else if(theme === 'alps'){
    // Red Swiss Glacier Express Panorama Cable-Car Cabin with Snow Roof & Swiss Crosses!
    FR.rbox(g, Pj, 0, 0, Z+0.28, 4.45, 2.02, 0.72, 0, '#dc2626', {top:'#f8fafc'});
    // White Swiss cross emblem on the red cabin side
    const sc = fI(0, 1.03, 0.62);
    FR.ln(g, [sc[0]-S*0.22,sc[1]], [sc[0]+S*0.22,sc[1]], '#ffffff', S*0.11);
    FR.ln(g, [sc[0],sc[1]-S*0.22], [sc[0],sc[1]+S*0.22], '#ffffff', S*0.11);
    drawRiders4Rows([-1.50, -0.50, 0.50, 1.50], 0.80, '#0284c7');
    [-2.05, -0.70, 0.70, 2.05].forEach(px => {
      FR.ln(g, fI(px,-0.96,0.98), fI(px,-0.96,1.74), '#991b1b', S*0.10);
      FR.ln(g, fI(px, 0.96,0.98), fI(px, 0.96,1.74), '#dc2626', S*0.12);
    });
    // Snow-blanketed cabin roof + overhead cable-car grip assembly
    FR.rbox(g, Pj, 0, 0, Z+1.74, 4.35, 1.98, 0.20, 0, '#f8fafc', {top:'#ffffff'});
    FR.rbox(g, Pj, 0, 0, Z+1.94, 1.45, 0.85, 0.25, 0, '#475569', {top:'#facc15'});
  }
  else if(theme === 'bavarian'){
    // Oktoberfest Brewery Dray Wagon Stacked with Brass-Hooped Oak Beer Barrels & Blue/White Bunting!
    drawWheel3D(-1.38, -1.08, 0.44, 0.54, '#451a03', gold, true);
    drawWheel3D( 1.38, -1.08, 0.44, 0.54, '#451a03', gold, true);
    FR.rbox(g, Pj, 0, 0, Z+0.36, 4.45, 2.05, 0.62, 0, '#78350f', {top:'#92400e'});
    // Bavarian blue-and-white diamond lozenge bunting along the +Y wagon side
    for(let k=-4; k<=4; k++){
      const dp = fI(k*0.46, 1.04, 0.68);
      FR.poly(g, [[dp[0],dp[1]-S*0.14],[dp[0]+S*0.14,dp[1]],[dp[0],dp[1]+S*0.14],[dp[0]-S*0.14,dp[1]]], k%2?'#2563eb':'#ffffff');
    }
    drawRiders4Rows([-1.25, -0.42, 0.42, 1.25], 0.78, '#1d4ed8');
    // Giant brass-hooped oak beer barrels mounted at both ends of the dray wagon (-2.05 and +2.05)
    [-2.02, 2.02].forEach(bx => {
      FR.rbox(g, Pj, bx, 0, Z+0.88, 0.68, 1.55, 0.65, 0, '#92400e', {top:gold});
    });
    drawWheel3D(-1.38, 1.08, 0.44, 0.54, '#451a03', gold, true);
    drawWheel3D( 1.38, 1.08, 0.44, 0.54, '#451a03', gold, true);
  }
}

/**
 * Corner Turret / Minaret / Pillar Helper for the 4 corners of the Raised Courtyard Platform
 */
function cbCornerPost(g, Pj, S, X, Y, Z0, H, sk, A){
  const gold = '#f5c542', goldL = '#fff3b0';
  FR.rbox(g, Pj, X, Y, Z0, 0.68, 0.68, 0.34, 0, sk.trim);
  FR.rbox(g, Pj, X, Y, Z0+0.34, 0.46, 0.46, H, 0, sk.tow, {top:'#ffffff'});
  FR.rbox(g, Pj, X, Y, Z0+0.34+H*0.45, 0.52, 0.52, 0.22, 0, sk.band1);
  const topZ = Z0 + 0.34 + H;
  FR.rbox(g, Pj, X, Y, topZ, 0.70, 0.70, 0.18, 0, sk.trim);
  const dp = Pj(X, Y, topZ + 0.48);
  if(sk.crown === 'orb'){
    FR.ell(g, dp[0], dp[1], S*0.42, S*0.42, '#22d3ee', '#ffffff', S*0.06);
  } else if(sk.crown === 'brazier'){
    FR.poly(g, [[dp[0]-S*0.28,dp[1]+S*0.15],[dp[0],dp[1]-S*0.65],[dp[0]+S*0.28,dp[1]+S*0.15]], '#f97316');
    FR.poly(g, [[dp[0]-S*0.14,dp[1]+S*0.15],[dp[0],dp[1]-S*0.42],[dp[0]+S*0.14,dp[1]+S*0.15]], '#fde047');
  } else {
    FR.ell(g, dp[0], dp[1], S*0.46, S*0.42, sk.band2, gold, S*0.05);
    FR.ell(g, dp[0]-S*0.10, dp[1]-S*0.10, S*0.16, S*0.14, goldL);
    FR.poly(g, [[dp[0]-S*0.16,dp[1]-S*0.30],[dp[0]+S*0.16,dp[1]-S*0.30],[dp[0],dp[1]-S*0.88]], gold);
  }
}

function makeCrazyBusDrawer(theme, A){
  const sk = CRAZY_BUS_SKINS[theme] || CRAZY_BUS_SKINS.unthemed;
  const gold = '#f5c542', goldD = '#b8861b', goldL = '#fff3b0';
  const carAt = {};

  return function(g, Pj, S, part, t){
    const getCar = carAt[S] || (carAt[S] = FR.atlas(S, 8.2*S, 5.8*S, 4.1*S, 3.8*S, 1, (g2, P2) => {
      cbGondola(g2, P2, S, theme, A);
    }));

    // Parallel 4-bar linkage orbital position for time `t`
    const omega = 1.65;
    const theta = (t || 0) * omega + 0.65;
    const dx = CB_CFG.armR * Math.cos(theta);
    const dz = CB_CFG.armR * Math.sin(theta);
    const carX = dx;
    const carY = CB_CFG.carY;
    const carZ = CB_CFG.pivZ + dz - 1.15;

    if(part === 'back'){
      // Soft ground shadow under entire 3D platform
      const c0 = Pj(0, 0, 0);
      g.fillStyle = 'rgba(15, 20, 28, 0.30)';
      g.beginPath(); g.ellipse(c0[0]+S*0.35, c0[1]+S*0.25, 7.4*S, 3.7*S, 0, 0, 7); g.fill();

      // Main Raised 3D Architectural Platform Base
      FR.rbox(g, Pj, 0, 0, 0, 9.2, 6.8, 0.48, 0, shade(sk.plinth,-0.15), {top: sk.plinth});

      // Decorative mosaic / hazard / stone border tiles along the +Y and +X platform skirts
      const N = 12;
      for(let i=0; i<N; i++){
        const x0 = -4.6 + 9.2*i/N, x1 = -4.6 + 9.2*(i+1)/N;
        FR.poly(g, [Pj(x0,3.41,0.06),Pj(x1,3.41,0.06),Pj(x1,3.41,0.42),Pj(x0,3.41,0.42)], i%3===0 ? sk.trim : i%3===1 ? sk.band1 : sk.band2);
      }
      for(let j=0; j<8; j++){
        const y0 = -3.4 + 6.8*j/8, y1 = -3.4 + 6.8*(j+1)/8;
        FR.poly(g, [Pj(4.61,y0,0.06),Pj(4.61,y1,0.06),Pj(4.61,y1,0.42),Pj(4.61,y0,0.42)], j%2 ? shade(sk.band1,-0.2) : shade(sk.band2,-0.2));
      }

      // Inner Courtyard Floor & Inlaid Center Runner
      FR.poly(g, [Pj(-4.15,-2.95,0.49),Pj(4.15,-2.95,0.49),Pj(4.15,2.95,0.49),Pj(-4.15,2.95,0.49)], sk.floor1, sk.trim, S*0.08);
      FR.poly(g, [Pj(-3.4,-2.2,0.50),Pj(3.4,-2.2,0.50),Pj(3.4,2.2,0.50),Pj(-3.4,2.2,0.50)], sk.floor2, sk.trim, S*0.06);
      for(let k=-2; k<=2; k++){
        const mx = k * 1.25;
        FR.poly(g, [Pj(mx-0.45,0,0.51),Pj(mx,-0.45,0.51),Pj(mx+0.45,0,0.51),Pj(mx,0.45,0.51)], k%2 ? sk.trim : sk.band1, goldL, S*0.03);
      }

      // 3D Operator Control Booth at back-left corner (-X, -Y)
      FR.rbox(g, Pj, -3.55, -2.05, 0.48, 1.5, 1.4, 1.75, 0, sk.tow, {top: sk.trim});
      FR.poly(g, [Pj(-3.55, -1.34, 1.15), Pj(-2.85, -1.34, 1.15), Pj(-2.85, -1.34, 1.95), Pj(-3.55, -1.34, 1.95)], '#38bdf8', sk.band1, S*0.05);
      const bDome = Pj(-3.55, -2.05, 2.65);
      FR.ell(g, bDome[0], bDome[1], S*0.62, S*0.52, sk.band2, sk.trim, S*0.06);
      FR.ell(g, bDome[0]-S*0.15, bDome[1]-S*0.12, S*0.22, S*0.18, goldL);

      // Two Rear Corner Architectural Pillars / Minarets
      cbCornerPost(g, Pj, S, -4.25, -3.05, 0.48, 1.85, sk, A);
      cbCornerPost(g, Pj, S,  4.25, -3.05, 0.48, 1.85, sk, A);

      // Back perimeter balustrade railing
      for(let k=-3; k<=3; k++){
        const X = k * 1.1;
        FR.ln(g, Pj(X,-3.15,0.48), Pj(X,-3.15,1.22), sk.trim, S*0.08);
      }
      FR.ln(g, Pj(-3.9,-3.15,1.20), Pj(3.9,-3.15,1.20), sk.band1, S*0.11);
      FR.ln(g, Pj(-3.9,-3.15,0.88), Pj(3.9,-3.15,0.88), sk.trim,  S*0.07);
    }

    if(part === 'hub'){
      // Twin Sculpted Support Towers at Y = CB_CFG.pivY (-1.42)
      CB_CFG.pivX.forEach(tx => {
        FR.rbox(g, Pj, tx, CB_CFG.pivY, 0.48, 1.22, 1.14, 0.38, 0, shade(sk.trim,-0.25), {top: sk.trim});
        FR.rbox(g, Pj, tx, CB_CFG.pivY, 0.86, 0.88, 0.84, 4.05, 0, sk.tow, {top: sk.trim});
        FR.rbox(g, Pj, tx, CB_CFG.pivY, 1.65, 0.92, 0.88, 0.38, 0, sk.band1);
        FR.rbox(g, Pj, tx, CB_CFG.pivY, 3.05, 0.92, 0.88, 0.38, 0, sk.band2);
        FR.ln(g, Pj(tx, CB_CFG.pivY+0.44, 1.0), Pj(tx, CB_CFG.pivY+0.44, 4.5), sk.trim, S*0.08);
      });

      // Ornate Illuminated Overhead Marquee Bridge spanning between the twin towers
      FR.rbox(g, Pj, 0, CB_CFG.pivY-0.08, 4.65, 5.35, 0.60, 1.38, 0, sk.band1, {top: sk.trim});
      const crown = Pj(0, CB_CFG.pivY+0.15, 6.45);
      FR.ell(g, crown[0], crown[1], S*1.18, S*0.62, sk.trim);
      FR.ell(g, crown[0], crown[1], S*0.85, S*0.44, sk.band2);
      FR.poly(g, [[crown[0]-S*0.2,crown[1]-S*0.5],[crown[0]+S*0.2,crown[1]-S*0.5],[crown[0],crown[1]-S*1.15]], goldL);

      // Recessed sign board & chasing marquee bulbs
      const sL = Pj(-2.38,CB_CFG.pivY+0.24,4.82), sR = Pj(2.38,CB_CFG.pivY+0.24,4.82), sTR = Pj(2.38,CB_CFG.pivY+0.24,5.88), sTL = Pj(-2.38,CB_CFG.pivY+0.24,5.88);
      FR.poly(g, [sL,sR,sTR,sTL], '#111827', sk.trim, S*0.13);
      for(let k=0; k<=12; k++){
        const bx = -2.25 + 4.5*k/12;
        [4.86, 5.84].forEach((bz, row) => {
          const bp = Pj(bx, CB_CFG.pivY+0.27, bz);
          FR.ell(g, bp[0], bp[1], S*0.08, S*0.08, (k+row)%2 ? goldL : '#38bdf8');
        });
      }

      // Isometric skewed Marquee Title
      const o = Pj(-2.38, CB_CFG.pivY+0.28, 5.85);
      g.save();
      g.transform(0.7, 0.35, 0, 1, o[0], o[1]);
      g.fillStyle = theme==='space' ? '#22d3ee' : goldL;
      g.font = 'bold ' + (0.58*S) + 'px Arial Black, Arial, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(sk.sign, 2.38*S, 0.52*S, 4.55*S);
      g.restore();

      // Tower Crowns atop both support towers
      CB_CFG.pivX.forEach(tx => {
        const dp = Pj(tx, CB_CFG.pivY, 6.35);
        FR.ell(g, dp[0], dp[1], S*0.55, S*0.48, sk.trim);
        FR.ell(g, dp[0]-S*0.12, dp[1]-S*0.10, S*0.18, S*0.15, goldL);
        FR.poly(g, [[dp[0]-S*0.15,dp[1]-S*0.38],[dp[0]+S*0.15,dp[1]-S*0.38],[dp[0],dp[1]-S*1.05]], sk.band2);
      });
    }

    if(part === 'cars_front'){
      // Dynamic shadow on the courtyard floor directly beneath the orbiting vehicle
      const shP = Pj(carX, carY, 0.52);
      const shScale = Math.max(0.50, 1.0 - (carZ - 0.5)*0.085);
      g.fillStyle = 'rgba(12, 16, 26, 0.34)';
      g.beginPath(); g.ellipse(shP[0], shP[1], S*2.85*shScale, S*1.28*shScale, 0, 0, 7); g.fill();

      // Draw the Four-Bar Parallel Linkage Arms & Counterweight Drums
      CB_CFG.pivX.forEach(px => {
        [0, -0.36].forEach((zOff, barIdx) => {
          const piv    = Pj(px, CB_CFG.pivY+0.35, CB_CFG.pivZ+zOff);
          const busPin = Pj(px + dx, carY-0.92, CB_CFG.pivZ+zOff + dz);
          if(barIdx === 0){
            const cwEnd = Pj(px - CB_CFG.cwR*Math.cos(theta), CB_CFG.pivY+0.35, CB_CFG.pivZ - CB_CFG.cwR*Math.sin(theta));
            FR.ln(g, piv, cwEnd, shade(sk.arm1,-0.35), S*0.30);
            FR.ln(g, piv, cwEnd, sk.arm2, S*0.15);
            FR.ell(g, cwEnd[0], cwEnd[1], S*0.42, S*0.42, sk.trim);
            FR.ell(g, cwEnd[0], cwEnd[1], S*0.26, S*0.26, sk.cw);
            FR.ell(g, cwEnd[0], cwEnd[1], S*0.12, S*0.12, goldL);
          }
          FR.ln(g, piv, busPin, barIdx===0 ? shade(sk.arm1,-0.35) : shade(sk.arm2,-0.3), S*(barIdx===0 ? 0.32 : 0.19));
          FR.ln(g, piv, busPin, barIdx===0 ? sk.arm1 : sk.arm2, S*(barIdx===0 ? 0.18 : 0.10));
        });

        // Ornate medallion pivot hub on tower face
        const pivTop = Pj(px, CB_CFG.pivY+0.36, CB_CFG.pivZ);
        FR.ell(g, pivTop[0], pivTop[1], S*0.38, S*0.38, sk.trim);
        FR.ell(g, pivTop[0], pivTop[1], S*0.22, S*0.22, sk.band1);
        FR.ell(g, pivTop[0], pivTop[1], S*0.10, S*0.10, goldL);
      });

      // Blit the pre-baked 3D horizontal vehicle at its orbital position
      const cSpr = getCar(0, 0);
      const cp = Pj(carX, carY, carZ);
      g.drawImage(cSpr.cv, cp[0]-cSpr.ox, cp[1]-cSpr.oy, cSpr.w, cSpr.h);
    }

    if(part === 'front'){
      // Front Grand Boarding Steps (+Y edge) with Red/Gold Runner
      FR.rbox(g, Pj, 0, 3.68, 0, 2.55, 0.62, 0.26, 0, shade(sk.plinth,-0.15), {top: sk.plinth});
      FR.rbox(g, Pj, 0, 3.68, 0.02, 1.55, 0.64, 0.26, 0, sk.band1, {top: sk.trim});

      // Front & Side Ornate Balustrade Railings (+Y and +X perimeter)
      const postX = [-3.8, -2.8, -1.9, -1.25, 1.25, 1.9, 2.8, 3.8];
      postX.forEach(X => {
        FR.ln(g, Pj(X,3.22,0.48), Pj(X,3.22,1.25), sk.trim, S*0.09);
        FR.ell(g, ...Pj(X,3.22,1.28), S*0.08, S*0.08, goldL);
      });
      [[-3.8,-1.25],[1.25,3.8]].forEach(([x0,x1]) => {
        FR.ln(g, Pj(x0,3.22,1.20), Pj(x1,3.22,1.20), sk.band1, S*0.11);
        FR.ln(g, Pj(x0,3.22,0.86), Pj(x1,3.22,0.86), sk.trim,  S*0.08);
      });
      for(let k=-2; k<=2; k++){
        FR.ln(g, Pj(4.25,k*1.1,0.48), Pj(4.25,k*1.1,1.22), sk.trim, S*0.08);
      }
      FR.ln(g, Pj(4.25,-2.8,1.20), Pj(4.25,2.8,1.20), sk.band1, S*0.10);

      // Two Front Corner Pillars / Minarets framing the entrance
      cbCornerPost(g, Pj, S, -4.25, 3.15, 0.48, 1.65, sk, A);
      cbCornerPost(g, Pj, S,  4.25, 3.15, 0.48, 1.65, sk, A);
    }
  };
}

/**
 * PUBLIC ENGINE ENTRY POINT:
 *  drawCrazyBus(ctx, cx, cy, R, { themeId, rideThemeTier, accent, t, tile })
 */
function drawCrazyBus(ctx, cx, cy, R, o){
  o = o || {};
  const tier = o.rideThemeTier != null ? o.rideThemeTier : (o.tier != null ? o.tier : (o.themeId || o.theme ? 3 : 0));
  let rawTheme = String(o.themeId || o.theme || 'unthemed').toLowerCase();
  if(rawTheme === 'wildwest' || rawTheme === 'wild_west') rawTheme = 'western';
  if(rawTheme === 'german') rawTheme = 'bavarian';
  if(rawTheme === 'standard') rawTheme = 'unthemed';
  const theme = (tier <= 2 || !CRAZY_BUS_SKINS[rawTheme]) ? 'unthemed' : rawTheme;
  const skin = CRAZY_BUS_SKINS[theme] || CRAZY_BUS_SKINS.unthemed;
  const A = o.accent || skin.border || '#f59e0b';

  if(o.tile){
    FR.hex(ctx, cx, cy, R, o.ground || skin.hex, A);
  }
  const cacheKey = 'cb|' + theme + '|' + R + '|' + A + '|' + Math.round(R * getBakeScale());
  const fn = FR._d[cacheKey] || (FR._d[cacheKey] = makeCrazyBusDrawer(theme, A));
  FR.render(ctx, cx, cy, R, cacheKey, 1.48, 1.65, 1.12, fn, o.t);
}
const drawFlyingCarpet = drawCrazyBus;
const drawMagicCarpet  = drawCrazyBus;
/* ===== END CRAZY BUS SPRITE CODE ===== */
window.drawCrazyBus = drawCrazyBus; window.drawFlyingCarpet = drawFlyingCarpet; window.drawMagicCarpet = drawMagicCarpet;
})();
