(function(){
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
    const sc=getBakeScale(),W=Math.ceil(Wf*R),H=Math.ceil(Hf*R),oy=oyf*R,S=R*0.066,res={w:W,h:H,ox:W/2,oy};
    ['back','hub','front','still'].forEach(p=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);const Pj=FR.proj(W/2,oy,S);
      if(p==='still'){draw(g,Pj,S,'back');draw(g,Pj,S,'cars_back',0);draw(g,Pj,S,'hub');draw(g,Pj,S,'cars_front',0);draw(g,Pj,S,'front');}else draw(g,Pj,S,p);res[p]=cv;});return FR._c[key]=res;},
  render(ctx,cx,cy,R,key,Wf,Hf,oyf,draw,t){const L=FR.layers(key,R,Wf,Hf,oyf,draw);if(t==null){ctx.drawImage(L.still,cx-L.ox,cy-L.oy,L.w,L.h);return;}
    const S=R*0.066,Pj=FR.proj(cx,cy,S),bl=n=>ctx.drawImage(L[n],cx-L.ox,cy-L.oy,L.w,L.h);bl('back');draw(ctx,Pj,S,'cars_back',t);bl('hub');draw(ctx,Pj,S,'cars_front',t);bl('front');}
};
FR.atlas=function(S,w,h,ox,oy,n,fn){
  const dpr=(typeof devicePixelRatio==='number'&&devicePixelRatio>1)?devicePixelRatio:1;
  const sc=getBakeScale(),cache={};
  return function(i,psi){const k=Math.round((((psi%6.2832)+6.2832)%6.2832)/6.2832*n)%n,key=i*1000+k;let e=cache[key];
    if(!e){const cv=document.createElement('canvas');cv.width=Math.ceil(w*sc);cv.height=Math.ceil(h*sc);const g=cv.getContext('2d');g.scale(sc,sc);fn(g,FR.proj(ox,oy,S),i,k/n*6.2832);e=cache[key]={cv,w,h,ox,oy};}return e;};
};
FR._d={};

/* ===== ANTIQUE CARS SKIN METADATA (GENERIC + 11 HEAVY/IMMERSIVE VARIANTS) ===== */
const ANTIQUE_CARS_SKINS = {
  unthemed: {
    id:'unthemed', label:'Generic (Tier 0–2)', name:'Antique Cars',
    sub:'Brass-Radiator Vintage Roadsters & Gazebo Station', sign:'ANTIQUE CARS',
    hex:'#9bbf63', border:'#d9342b', curb:'#bfb7a6', road:'#4c515c', lawn:'#76ad58', line:'#f2c230',
    stWall:'#f2e3c8', stRoof:null,
    cars:['#1c2029','#8a1f26',null,'#e8dcc0','#1f5a3a'], hats:['#1a1a22','#8a6a3a','#e8dcc0','#3a3a46','#5a3b22']
  },
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
ANTIQUE_CARS_SKINS.german = ANTIQUE_CARS_SKINS.bavarian;
ANTIQUE_CARS_SKINS.wildwest = ANTIQUE_CARS_SKINS.western;
ANTIQUE_CARS_SKINS.standard = ANTIQUE_CARS_SKINS.unthemed;

/* ===== SPRITE CODE: copy this block into engine.js ===== */
const AC = {A: 5.8, B: 5.0, w: 1.15, N: 5};
const acPos = (A,B,s) => [(A*Math.cos(s) + B*Math.sin(s))/Math.SQRT2, (-A*Math.cos(s) + B*Math.sin(s))/Math.SQRT2];

/**
 * Draws any of the 12 themed vehicle archetypes at local origin (X,Y) and heading `psi`:
 *  - `unthemed` / `bavarian`: Classic Brass-Era Antique Roadster with folded soft-top
 *  - `classic` / `alps`     : Tall Boxy 1914 Ford Model T ("Tin Lizzie") with flat canopy roof
 *  - `fiesta`               : Open-Top Convertible Antique Cruiser with whitewalls & chrome windshield
 *  - `frontier`             : 1930s Antique Flatbed Pickup Truck with rounded cab & timber stake bed
 *  - `jungle`               : Rugged 4x4 Safari Offroad Expedition Truck with roll cage, roof lamps & spare tire
 *  - `space`                : 6-Wheel Lunar Exploration Rover with gold foil, high-gain dish & astronauts
 *  - `gothic`               : 1890s Victorian Horseless Carriage Brougham with tiller steering & coach lamps
 *  - `western`              : Conestoga Covered Wagon with hooped canvas bonnet & spoked wooden wheels
 *  - `medieval`             : Gilded Royal Horse-Drawn Carriage pulled by a caparisoned steed
 *  - `nordic`               : Viking Horse-Drawn Timber Wagon with painted round shields
 */
function acVehicle(g, Pj, S, X, Y, psi, theme, body, hat, idx){
  const c = Math.cos(psi), s = Math.sin(psi);
  const L = (a,b) => [X + a*c - b*s, Y + a*s + b*c];
  const Z = 0.12;
  const part = (a,b,z,l,w,h,col,o) => { const p=L(a,b); FR.rbox(g,Pj,p[0],p[1],Z+z,l,w,h,psi,col,o); };

  // Wheel helper supporting Vintage Whitewalls, Spoked Wooden Wagon Wheels, Offroad Knobby Tires, or Lunar Mesh Wheels
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
    const outerCol = (style==='wagon') ? '#451a03' : (style==='lunar') ? '#475569' : '#16161b';
    const innerCol = (style==='wagon') ? '#b4824c' : (style==='lunar') ? '#22d3ee' : (style==='offroad') ? '#64748b' : '#f8f2dc';
    FR.poly(g, rimPts(r), outerCol);
    FR.poly(g, rimPts(r*0.64), innerCol);
    if(style === 'wagon'){
      // Wooden wagon wheel spokes
      for(let k=0;k<6;k++){
        const th = k/6*3.1416;
        const p1=[q[0]+r*0.85*(Math.cos(th)*dx), q[1]+r*0.85*(Math.cos(th)*dy-Math.sin(th)*S)];
        const p2=[q[0]-r*0.85*(Math.cos(th)*dx), q[1]-r*0.85*(Math.cos(th)*dy-Math.sin(th)*S)];
        FR.ln(g, p1, p2, '#5a3b22', S*0.045);
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
        // Blue visor on space helmet
        FR.ell(g, h[0]+c*S*0.05, h[1]+s*S*0.03, S*0.10, S*0.08, '#0284c7');
      } else if(hat){
        FR.ell(g, h[0], h[1]-S*0.10, S*(i?0.20:0.22), S*0.08, hat);
        FR.ell(g, h[0], h[1]-S*0.13, S*0.13, S*0.10, hat);
      }
    });
  };

  // Helper to draw a Draft Horse in front of Horse-Drawn Carriages & Wagons (`medieval` & `nordic`)
  const drawDraftHorse = (hX, horseCol, maneCol, bardingCol) => {
    // Twin wooden hitch shafts connecting carriage to horse
    [-0.32, 0.32].forEach(sy => {
      const p0 = L(0.55, sy), p1 = L(hX+0.15, sy);
      FR.ln(g, Pj(p0[0],p0[1],Z+0.55), Pj(p1[0],p1[1],Z+0.68), '#5a3b22', S*0.065);
    });
    // Horse legs
    [[hX-0.32,-0.22],[hX-0.32,0.22],[hX+0.32,-0.22],[hX+0.32,0.22]].forEach(([lx,ly]) => {
      const p = L(lx,ly);
      FR.ln(g, Pj(p[0],p[1],Z+0.05), Pj(p[0],p[1],Z+0.65), shade(horseCol,-0.3), S*0.085);
    });
    // Horse body & optional royal barding blanket
    part(hX, 0, 0.55, 0.98, 0.52, 0.42, horseCol);
    if(bardingCol){
      part(hX-0.05, 0, 0.62, 0.68, 0.58, 0.36, bardingCol, {top:'#facc15'});
    }
    // Horse neck, head, mane & golden bridle
    part(hX+0.42, 0, 0.82, 0.32, 0.28, 0.45, horseCol, {top:maneCol});
    part(hX+0.62, 0, 1.05, 0.36, 0.24, 0.24, horseCol);
    // Tail
    const t0 = L(hX-0.52, 0);
    FR.ln(g, Pj(t0[0],t0[1],Z+0.88), Pj(t0[0],t0[1],Z+0.42), maneCol, S*0.09);
  };

  // Standard 4-wheel coordinates (or 6 wheels for Space Rover)
  const wList = (theme === 'space')
    ? [[0.98,-0.75],[0.98,0.75],[0,-0.75],[0,0.75],[-0.98,-0.75],[-0.98,0.75]]
    : [[0.95,-0.72],[0.95,0.72],[-0.95,-0.72],[-0.95,0.72]];
  const wStyle = (theme==='western'||theme==='medieval'||theme==='nordic'||theme==='gothic') ? 'wagon'
               : (theme==='space') ? 'lunar' : (theme==='jungle') ? 'offroad' : 'vintage';
  const ws = wList.map(([a,b]) => ({a, b, d: L(a,b)[0] + L(a,b)[1]})).sort((p,q) => p.d - q.d);
  const cd = X + Y;

  // 1. Far-side wheels
  ws.filter(w => w.d < cd).forEach(w => drawWheel(w.a, w.b, wStyle==='wagon'&&w.a<0 ? 1.15 : 1.0, wStyle));

  // 2. Theme-Specific Vehicle Bodywork
  if(theme === 'western'){
    // WILD WEST: Conestoga Covered Wagon with Flared Wooden Bed, Front Driver Bench & Hooped Canvas Bonnet!
    part(0, 0, 0.38, 2.55, 1.18, 0.48, body, {top:'#451a03'});
    // Driver & passenger on front buckboard bench (+0.82)
    part(0.82, 0, 0.72, 0.42, 1.12, 0.22, '#5a3b22');
    drawPassengers(0.76, 0.96, '#dc2626', '#2563eb');
    // Curved white canvas bonnet over rear wagon bed (-1.15 .. +0.42) with wooden ribs
    [-0.95, -0.50, -0.05, 0.38].forEach((rx, rIdx) => {
      part(rx, 0, 0.85, 0.44, 1.16, 0.82, rIdx%2 ? '#f5efe0' : '#fdfbf5', {top:'#ffffff'});
    });
    // Side water barrel strapped to wagon
    const bp = L(-0.2, 0.68), bq = Pj(bp[0],bp[1],Z+0.62);
    FR.ell(g, bq[0], bq[1], S*0.18, S*0.22, '#78350f');
  }
  else if(theme === 'medieval'){
    // MEDIEVAL: Royal Gilded Horse-Drawn Carriage pulled by a Barded Warhorse!
    drawDraftHorse(1.38, '#f8fafc', '#f5c542', body);
    // Ornate carriage chassis & gilded coach cabin (-1.25 .. +0.35)
    part(-0.45, 0, 0.35, 1.85, 1.12, 0.16, '#f5c542');
    part(-0.45, 0, 0.50, 1.55, 1.06, 0.58, body, {top:'#f5c542'});
    drawPassengers(-0.45, 1.05, '#eab308', '#3b82f6');
    // Royal four-poster carriage roof with gold crown finial
    [[-1.05,-0.45],[-1.05,0.45],[0.15,-0.45],[0.15,0.45]].forEach(([px,py]) => {
      const p = L(px,py);
      FR.ln(g, Pj(p[0],p[1],Z+1.05), Pj(p[0],p[1],Z+1.62), '#f5c542', S*0.07);
    });
    part(-0.45, 0, 1.60, 1.48, 1.10, 0.18, body, {top:'#f5c542'});
    const crP = L(-0.45, 0), crQ = Pj(crP[0],crP[1],Z+1.88);
    FR.ell(g, crQ[0], crQ[1], S*0.20, S*0.16, '#facc15');
  }
  else if(theme === 'nordic'){
    // NORDIC: Viking Horse-Drawn Timber Wagon with Carved Dragon Prow & Painted Round Shields!
    drawDraftHorse(1.35, '#92400e', '#fde68a', null);
    // Heavy stave-plank wagon bed (-1.25 .. +0.42)
    part(-0.42, 0, 0.38, 1.85, 1.14, 0.52, '#5a361a', {top:'#3e2410'});
    drawPassengers(-0.45, 0.95, '#b91c1c', '#0284c7');
    // Carved golden dragon-head prow on front of wagon & painted shields along sides
    const dp = L(0.45, 0);
    FR.ln(g, Pj(dp[0],dp[1],Z+0.85), Pj(dp[0],dp[1],Z+1.45), '#f59e0b', S*0.12);
    [[-0.85,-0.62],[-0.15,-0.62],[-0.85,0.62],[-0.15,0.62]].forEach(([sx,sy], si) => {
      const sp = L(sx,sy), sq = Pj(sp[0],sp[1],Z+0.65);
      FR.ell(g, sq[0], sq[1], S*0.20, S*0.20, si%2 ? '#b91c1c' : '#0284c7');
      FR.ell(g, sq[0], sq[1], S*0.07, S*0.07, '#fde047');
    });
  }
  else if(theme === 'gothic'){
    // GOTHIC: 1890s Victorian Horseless Carriage (High-Wheeled Curved-Dash Brougham, Tiller & Brass Coach Lamps!)
    part(0, 0, 0.34, 2.35, 1.25, 0.12, '#09090b');
    // Curved Victorian carriage body & scrolled front dash (NO engine hood—true horseless carriage!)
    part(-0.15, 0, 0.45, 1.45, 1.04, 0.56, body, {top:'#7f1d1d'});
    part(0.78, 0, 0.45, 0.22, 1.04, 0.68, '#18181b', {top:'#d97706'}); // Scrolled dashboard
    // Steering tiller lever curving back from dashboard to driver
    const tA = L(0.75, 0), tB = L(0.15, -0.22);
    FR.ln(g, Pj(tA[0],tA[1],Z+1.12), Pj(tB[0],tB[1],Z+1.18), '#f5c542', S*0.06);
    drawPassengers(-0.20, 1.08, '#991b1b', '#6b21a8');
    // High Victorian pleated calash hood over the rear of the seat
    part(-0.82, 0, 0.95, 0.65, 1.08, 0.72, '#09090b', {top:'#27272a'});
    part(-0.62, 0, 1.55, 0.85, 1.08, 0.16, '#18181b');
    // Flickering brass coach lanterns flanking the dashboard
    [[0.78,-0.62],[0.78,0.62]].forEach(([lx,ly]) => {
      const lp = L(lx,ly), lq = Pj(lp[0],lp[1],Z+1.05);
      FR.ell(g, lq[0], lq[1], S*0.13, S*0.16, '#fbbf24');
    });
  }
  else if(theme === 'space'){
    // SPACE: 6-Wheel Lunar Exploration Rover with Gold Kapton Foil, High-Gain Dish & Astronauts!
    part(0, 0, 0.32, 2.65, 1.38, 0.18, '#e2e8f0', {top:'#0f172a'});
    // Gold Mylar thermal battery bay at front (+0.95) & RTG power pack at rear (-1.05)
    part(0.92, 0, 0.48, 0.72, 1.12, 0.36, '#eab308', {top:'#fde047'});
    part(-1.02, 0, 0.48, 0.55, 1.15, 0.45, body, {top:'#22d3ee'});
    // Angled cyan telemetry console & astronauts
    part(0.35, 0, 0.48, 0.16, 1.18, 0.52, '#22d3ee', {top:'#e0f2fe'});
    drawPassengers(-0.22, 0.98, '#f8fafc', '#e2e8f0');
    // Overhead roll-bar & high-gain gold parabolic dish antenna at front-left
    const dBase = L(0.85, -0.45), dTop = Pj(dBase[0],dBase[1],Z+1.65);
    FR.ln(g, Pj(dBase[0],dBase[1],Z+0.82), dTop, '#cbd5e1', S*0.07);
    FR.ell(g, dTop[0], dTop[1], S*0.36, S*0.22, '#facc15');
    FR.ell(g, dTop[0], dTop[1]-S*0.08, S*0.10, S*0.10, '#22d3ee');
  }
  else if(theme === 'jungle'){
    // JUNGLE: Rugged 4x4 Safari Offroad Expedition Truck with Roll Cage, Roof Spotlights & Rear Spare Tire!
    part(0, 0, 0.34, 2.65, 1.48, 0.16, '#1c1917');
    // Boxy offroad jeep tub, zebra/khaki stripes & long square hood with winch bumper
    part(-0.35, 0, 0.48, 1.55, 1.22, 0.56, body);
    part(0.88, 0, 0.48, 0.95, 1.12, 0.54, body, {top:shade(body,0.15)});
    part(1.42, 0, 0.42, 0.16, 1.24, 0.24, '#27272a'); // Front bull-bar & winch
    drawPassengers(-0.25, 1.10, '#ca8a04', '#15803d');
    // Tubular steel safari roll-cage & canvas sun canopy overhead + 4 roof spotlights
    [[-1.05,-0.54],[-1.05,0.54],[0.32,-0.54],[0.32,0.54]].forEach(([px,py]) => {
      const p = L(px,py);
      FR.ln(g, Pj(p[0],p[1],Z+1.02), Pj(p[0],p[1],Z+1.65), '#1c1917', S*0.07);
    });
    part(-0.36, 0, 1.62, 1.48, 1.18, 0.12, '#d9b27a', {top:'#f5efe0'});
    // Roof rack spotlights & rear-mounted spare tire
    [-0.35, 0, 0.35].forEach(ly => {
      const lp = L(0.38, ly), lq = Pj(lp[0],lp[1],Z+1.78);
      FR.ell(g, lq[0], lq[1], S*0.10, S*0.10, '#fef08a');
    });
    drawWheel(-1.22, 0, 0.78, 'offroad'); // Rear door spare tire!
  }
  else if(theme === 'frontier'){
    // FRONTIER: 1930s Antique Flatbed Stake-Side Pickup Truck with Rounded Cab & Timber Cargo Bed!
    part(0, 0, 0.30, 2.65, 1.45, 0.12, '#1f2937');
    // Swept fenders, engine hood (+0.95), brass grille &enclosed rounded pickup cab (0.05)
    part(0.98, 0, 0.42, 0.88, 0.68, 0.52, body);
    part(1.45, 0, 0.44, 0.10, 0.62, 0.48, '#d97706');
    // Enclosed 1930s pickup cab with roof & windshield
    part(0.18, 0, 0.42, 0.78, 1.06, 0.62, body);
    part(0.55, 0, 1.02, 0.08, 0.98, 0.52, '#bae6fd');
    part(0.15, 0, 1.52, 0.82, 1.08, 0.14, shade(body,-0.22), {top:body});
    drawPassengers(0.15, 1.05, '#b91c1c', '#d97706');
    // Rear wooden stake-side pickup bed (-0.82) carrying a wooden crate / barrel
    part(-0.78, 0, 0.42, 1.12, 1.12, 0.38, '#8a5a33', {top:'#5a3b22'});
    part(-0.78, -0.52, 0.80, 1.08, 0.08, 0.32, '#a97d49');
    part(-0.78,  0.52, 0.80, 1.08, 0.08, 0.32, '#a97d49');
    part(-0.75, 0, 0.78, 0.55, 0.65, 0.35, '#d9b27a'); // Cargo crate in truck bed
  }
  else if(theme === 'classic' || theme === 'alps'){
    // CLASSIC MIDWAY & ALPS: 1914 Ford Model T ("Tin Lizzie" / Alpine Postbus) with Tall Flat Canopy Roof & Brass Radiator!
    part(0, 0, 0.30, 2.55, 1.48, 0.10, '#18181b');
    // Running boards & fenders
    [[0,-0.62],[0,0.62]].forEach(([a,b]) => part(a, b, 0.36, 2.35, 0.24, 0.08, '#111827'));
    // Boxy Model T passenger tub, narrow hood & tall brass radiator neck
    part(-0.32, 0, 0.40, 1.35, 1.04, 0.62, body);
    part(0.92, 0, 0.42, 0.92, 0.58, 0.50, body);
    part(1.42, 0, 0.44, 0.12, 0.56, 0.54, '#f59e0b'); // Tall brass Model T radiator
    part(0.34, 0, 1.00, 0.07, 0.98, 0.62, '#bae6fd'); // Upright split windshield
    drawPassengers(-0.32, 1.10, '#dc2626', '#2563eb');
    // Signature Tall Flat-Topped Model T Canopy Roof on 4 thin brass stanchions!
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
    // FIESTA: Open-Top Convertible Antique Cruiser with Two-Tone Scallop Trim, Chrome Windshield & Whitewalls!
    part(0, 0, 0.30, 2.60, 1.52, 0.10, '#1f2937');
    part(-0.30, 0, 0.40, 1.40, 1.08, 0.54, body, {top:'#fde047'});
    part(0.92, 0, 0.42, 0.98, 0.72, 0.48, body, {top:'#ffffff'});
    part(1.44, 0, 0.44, 0.12, 0.68, 0.46, '#e2e8f0'); // Gleaming chrome V-grille
    part(0.32, 0, 0.94, 0.08, 1.02, 0.46, '#bae6fd', {top:'#ffffff'});
    // Rolled-down cream convertible boot cover at the rear (100% open top!)
    part(-0.98, 0, 0.92, 0.36, 1.06, 0.22, '#fef3c7', {top:'#fde047'});
    drawPassengers(-0.30, 1.08, '#10b981', '#f97316');
    [[1.40,-0.50],[1.40,0.50]].forEach(([a,b]) => {
      const p = L(a,b), q = Pj(p[0],p[1],Z+0.82);
      FR.ell(g, q[0], q[1], S*0.13, S*0.13, '#fef08a');
    });
  }
  else {
    // UNTHEMED (Generic) & BAVARIAN: Classic Brass-Era Antique Roadster with Folded Soft-Top
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
  ws.filter(w => w.d >= cd).forEach(w => drawWheel(w.a, w.b, wStyle==='wagon'&&w.a<0 ? 1.15 : 1.0, wStyle));
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
    const postCol = (theme==='western'||theme==='frontier'||theme==='jungle'||theme==='nordic') ? '#5a3b22' : '#2a2a33';
    FR.ln(g, b, t, postCol, S*0.14);
    const glowCol = (theme==='space') ? '56,189,248' : (theme==='gothic') ? '192,132,252' : '255,225,140';
    const gl = g.createRadialGradient(t[0], t[1]-S*0.3, 0, t[0], t[1]-S*0.3, S*1.1);
    gl.addColorStop(0, `rgba(${glowCol},0.48)`);
    gl.addColorStop(1, `rgba(${glowCol},0)`);
    g.fillStyle = gl; g.beginPath(); g.arc(t[0], t[1]-S*0.3, S*1.1, 0, 7); g.fill();
    FR.poly(g, [[t[0]-S*0.28,t[1]],[t[0]+S*0.28,t[1]],[t[0]+S*0.22,t[1]-S*0.52],[t[0]-S*0.22,t[1]-S*0.52]], theme==='space'?'#22d3ee':'#fff0b0', postCol, S*0.06);
    FR.poly(g, [[t[0]-S*0.36,t[1]-S*0.52],[t[0]+S*0.36,t[1]-S*0.52],[t[0],t[1]-S*0.86]], postCol);
  };

  return function(g, Pj, S, part, t){
    // Expand atlas canvas slightly so horse-drawn carriages & long rovers never clip!
    const at = ats[S] || (ats[S] = FR.atlas(S, 6.2*S, 6.2*S, 3.1*S, 4.6*S, 48, (g2, P2, i, psi) => {
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

      // Infield flower/stone border dots
      for(let k=0; k<22; k++){
        const s = k/22*6.2832, p = acPos(AC.A-ig-0.45, AC.B-ig-0.45, s), q = Pj(p[0],p[1],0.3);
        const fCols = theme==='space' ? ['#22d3ee','#a855f7','#38bdf8']
                    : theme==='gothic' ? ['#dc2626','#71717a','#991b1b']
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

      if(theme === 'space'){
        // Space: Domed Titanium & Cyan Telemetry Outpost
        const dm = Pj(0, 0, z+2.5);
        FR.ell(g, dm[0], dm[1], S*1.55, S*0.85, roofCol);
        FR.ell(g, dm[0], dm[1]-S*0.2, S*0.95, S*0.48, '#22d3ee');
      } else {
        // Hip/Gable Station Roof + Striped Awning
        FR.poly(g, [Pj(-1.7,1.2,z+2.2),Pj(1.7,1.2,z+2.2),Pj(1.7,-1.2,z+2.2),Pj(0,0,z+3.6)], roofCol);
        FR.poly(g, [Pj(1.7,1.2,z+2.2),Pj(1.7,-1.2,z+2.2),Pj(0,0,z+3.6)], roofDark);
        FR.poly(g, [Pj(-1.7,1.2,z+2.2),Pj(1.7,1.2,z+2.2),Pj(0,0,z+3.6)], shade(roofCol,0.12), 'rgba(0,0,0,.2)', S*0.05);
      }

      if(theme === 'medieval' || theme === 'nordic'){
        // Pennant or Dragon Finial on Station Peak
        const pk = Pj(0, 0, z+3.6);
        FR.ln(g, pk, [pk[0], pk[1]-S*0.85], '#facc15', S*0.09);
        FR.poly(g, [[pk[0],pk[1]-S*0.85],[pk[0]+S*0.75,pk[1]-S*0.6],[pk[0],pk[1]-S*0.35]], '#b91c1c');
      }

      for(let k=0; k<6; k++){
        const a = -1.5 + k*0.5;
        FR.poly(g, [Pj(a,1.55,z+1.4),Pj(a+0.5,1.55,z+1.4),Pj(a+0.5,1.05,z+2.0),Pj(a,1.05,z+2.0)], k%2 ? '#f6efe0' : roofDark);
      }
      FR.poly(g, [Pj(-0.6,1.01,z),Pj(0.6,1.01,z),Pj(0.6,1.01,z+1.3),Pj(-0.6,1.01,z+1.3)], '#291d12');

      const o = Pj(-1.3, 1.02, z+2.15);
      g.save();
      g.transform(0.7, 0.35, 0, 1, o[0], o[1]);
      g.fillStyle = '#17171f';
      g.fillRect(0, 0, 2.6*S, 0.5*S);
      g.fillStyle = theme==='space' ? '#22d3ee' : '#f6d34a';
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
  let rawTheme = String(o.themeId || o.theme || 'unthemed').toLowerCase();
  if(rawTheme === 'wildwest' || rawTheme === 'wild_west') rawTheme = 'western';
  if(rawTheme === 'german') rawTheme = 'bavarian';
  if(rawTheme === 'standard') rawTheme = 'unthemed';
  const theme = (tier <= 2 || !ANTIQUE_CARS_SKINS[rawTheme]) ? 'unthemed' : rawTheme;
  const skin = ANTIQUE_CARS_SKINS[theme] || ANTIQUE_CARS_SKINS.unthemed;
  const A = o.accent || skin.border || '#d9342b';

  if(o.tile){
    FR.hex(ctx, cx, cy, R, o.ground || skin.hex, A);
  }
  const cacheKey = 'ac|' + theme + '|' + R + '|' + A + '|' + Math.round(R * getBakeScale());
  const fn = FR._d[cacheKey] || (FR._d[cacheKey] = acDrawer(theme, A));
  FR.render(ctx, cx, cy, R, cacheKey, 1.55, 1.45, 0.96, fn, o.t);
}
/* ===== END ANTIQUE CARS SPRITE CODE ===== */
window.drawAntiqueCars = drawAntiqueCars;
})();
