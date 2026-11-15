/* Imported classic coaster artwork. */
const CLASSIC_COASTER_PACKS = Object.freeze({
  mine_train: (() => {
/* ===== THEME PACK CORE (shared by every theme pack; copy once into engine.js) ===== */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shade(hex, amt){
  if(!hex || hex[0]!=='#') return hex || '#888888';
  const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;
  const f=c=>Math.max(0,Math.min(255,Math.round(amt<0?c*(1+amt):c+(255-c)*amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
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
    ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x+rx*0.35,y+ry*0.25,rx*0.4,ry*0.5,0,0,7);ctx.fill();}
};

/* ===== FRONTIER PACK ===== */
const F={wood:'#8a5a33',woodD:'#5a3b22',woodL:'#b07a46',bark:'#6b4a2b',endc:'#d9b27a',pine:'#2f5f3a',pineL:'#3d7348',pineD:'#26503a'};
const fsh=(c,x,y,rx,h)=>{c.fillStyle='rgba(12,34,14,.32)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
function frFir(c,x,y,u,s){const H=u*6.2*s,tiers=6;fsh(c,x,y,u*1.6*s,H);TH.ln(c,[x,y],[x,y-u*1.2*s],'#4a3320',u*0.5*s);
  for(let k=0;k<tiers;k++){const t=k/(tiers-1),by=y-u*1.0*s-H*0.76*t,w=u*(1.75-1.2*t)*s,h=u*1.5*s;
    TH.poly(c,[[x-w,by+h*0.2],[x-w*0.35,by-h*0.3],[x,by-h*1.15],[x+w*0.35,by-h*0.3],[x+w,by+h*0.2],[x,by+h*0.55]],k%2?F.pine:F.pineL);
    TH.poly(c,[[x,by-h*1.15],[x+w*0.35,by-h*0.3],[x+w,by+h*0.2],[x+w*0.3,by+h*0.35]],'rgba(8,30,18,.4)');}}
const FRONTIER_PACK={id:'frontier',name:'Frontier',ground:'#7d955d',groundDark:'#6b8350',border:'#566e42',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},3:{budget:11,decals:4,landmark:0,pool:[]},4:{budget:15,decals:5,landmark:0,pool:[]}},
  assets:{
  pebbleBar:{cat:'decal',w:2.0,tier:1,weight:3,cost:0,draw(c,x,y,u,v){const r=mulberry(v+5);TH.ell(c,x,y,u*2.0,u*0.9,'#b9b4a2');for(let k=0;k<22;k++){const a=r()*6.283,rr=Math.sqrt(r());TH.ell(c,x+Math.cos(a)*u*1.8*rr,y+Math.sin(a)*u*0.8*rr,u*0.14,u*0.09,['#8a8f96','#a8a290','#c9c3b0','#6f747a'][k%4]);}}},
  pineNeedles:{cat:'decal',w:2.2,tier:1,weight:3.5,cost:0,draw(c,x,y,u,v){const r=mulberry(v+8);TH.ell(c,x,y,u*2.2,u*0.95,'#6b4f32');for(let k=0;k<26;k++){const a=r()*6.283,rr=Math.sqrt(r()),px=x+Math.cos(a)*u*2.0*rr,py=y+Math.sin(a)*u*0.85*rr;TH.ln(c,[px,py],[px+u*0.28,py-u*0.1],k%3?'#4a3320':'#8a6a45',u*0.04);}}},
  pineTree:{cat:'tree',w:1.8,tier:2,weight:3.5,cost:2,max:2,draw(c,x,y,u,v){frFir(c,x,y,u,1.3+(v%3)*0.12);}},
  firGrove:{cat:'tree',w:2.3,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v){[[-1.1,0.2,0.8],[1.0,0.3,0.92],[0.0,-0.5,0.7]].sort((a,b)=>a[1]-b[1]).forEach(([dx,dy,s])=>frFir(c,x+dx*u,y+dy*u,u,s));}},
  berryBush:{cat:'plant',w:1.4,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*3+6);fsh(c,x,y,u*1.4,u);[[-0.7,-0.5,0.85,'#3f7a45'],[0.7,-0.5,0.8,'#4a8a4c'],[0,-0.95,0.95,'#559858']].forEach(([dx,dy,s,col])=>TH.blob(c,x+dx*u,y+dy*u,u*s,u*s*0.72,col,r,9));}},
  boulders:{cat:'rock',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*13+3);fsh(c,x,y,u*1.9,u*1.4);[[0.0,0.0,1.0,1.0,'#80858d'],[-1.0,0.2,0.65,0.6,'#6f747c'],[0.9,0.25,0.6,0.55,'#8f949b']].forEach(([dx,dy,sx,sy,col])=>TH.blob(c,x+dx*u,y-u*0.55*sy+dy*u,u*0.9*sx,u*0.75*sy,col,r,9));}},
  fallenLog:{cat:'plant',w:2.2,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.2,u*1.4);const a=I(-2.0,0,0.45),b=I(2.0,0,0.45);TH.ln(c,a,b,'#4a3320',u*1.1);TH.ln(c,a,b,F.bark,u*0.9);TH.ell(c,b[0],b[1],u*0.45,u*0.55,F.endc);}},
  firewood:{cat:'prop',w:1.7,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u){fsh(c,x,y,u*1.8,u*1.6);TH.box(c,x,y,u,-1.4,1.4,-0.5,0.5,0,1.5,'#9a6a3c','#6f4a28','#b8884f');}}
  }};
const FRONTIER_HEIGHT={berryBush:'low',fallenLog:'low',boulders:'low',firewood:'low',pineTree:'mid',firGrove:'mid'};
Object.keys(FRONTIER_PACK.assets).forEach(id=>{FRONTIER_PACK.assets[id].h=FRONTIER_HEIGHT[id]||'low';});

/* ===== JUNGLE PACK ===== */
const J={st:'#bdb9a0',stD:'#8e8a72',stL:'#dad7c3'};
const jbox=(c,x,y,u,x0,x1,y0,y1,z0,z1)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,J.st,J.stD,J.stL);
const jsh=(c,x,y,rx,h)=>{c.fillStyle='rgba(8,26,10,.36)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
const JUNGLE_PACK={id:'jungle',name:'Jungle',ground:'#587c48',groundDark:'#456a3a',border:'#35552c',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},3:{budget:11,decals:4,landmark:0,pool:[]},4:{budget:15,decals:5,landmark:0,pool:[]}},
  assets:{
  leafLitter:{cat:'decal',w:2.2,tier:1,weight:4,cost:0,draw(c,x,y,u,v){const r=mulberry(v+8);TH.ell(c,x,y,u*2.1,u*0.9,'#3f5f36');for(let k=0;k<22;k++){const a=r()*6.283,rr=Math.sqrt(r());TH.ell(c,x+Math.cos(a)*u*1.9*rr,y+Math.sin(a)*u*0.8*rr,u*0.17,u*0.08,['#6a5a2e','#4e7a3a','#8a6a30'][k%3],r()*3);}}},
  lilyPond:{cat:'decal',w:2.2,tier:1,weight:2.5,cost:0,draw(c,x,y,u){TH.ell(c,x,y,u*2.2,u*1.0,'#3a5a3a');TH.ell(c,x,y,u*1.95,u*0.86,'#2f7f78');TH.ell(c,x-u*0.2,y-u*0.05,u*1.5,u*0.6,'#3a9a8e');}},
  fernCluster:{cat:'flora',w:1.6,tier:1,weight:4,cost:1,draw(c,x,y,u,v){const r=mulberry(v*5+2);jsh(c,x,y,u*1.6,u*1.5);for(let k=0;k<8;k++){const a=-3.1+k*0.45,l=u*(1.7+r()*0.7),ex=x+Math.cos(a)*l,ey=y-Math.abs(Math.sin(a))*l*0.9-u*0.2;c.strokeStyle=k%2?'#3f8f45':'#4aa14e';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(ex-x)*0.45,y-l*0.95,ex,ey);c.stroke();}}},
  palmTree:{cat:'tree',w:1.8,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v){const r=mulberry(v*9+4),H=u*(6.2+r()*1.2),lean=(r()-0.5)*u*1.8;jsh(c,x,y,u*2.0,H);c.strokeStyle='#6a5236';c.lineWidth=u*0.52;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*0.2,y-H*0.5,x+lean,y-H);c.stroke();
    const tx=x+lean,ty=y-H;for(let k=0;k<8;k++){const a=-3.1+k*0.55,l=u*2.6,ex=tx+Math.cos(a)*l,ey=ty+Math.sin(a)*l*0.5+u*0.8;c.strokeStyle=k%2?'#2f7f3a':'#3f9a48';c.lineWidth=u*0.18;c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+(ex-tx)*0.55,ty-u*1.1,ex,ey);c.stroke();}}},
  mossBoulder:{cat:'rock',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*13+3);jsh(c,x,y,u*1.9,u*1.4);[[0.0,0.0,1.0,1.0,'#7d7f70'],[-1.0,0.2,0.65,0.6,'#6e7062'],[0.9,0.25,0.6,0.55,'#8a8c7c']].forEach(([dx,dy,sx,sy,col])=>TH.blob(c,x+dx*u,y-u*0.55*sy+dy*u,u*0.9*sx,u*0.75*sy,col,r,9));}},
  glyphBlock:{cat:'ruin',w:1.3,tier:1,weight:3.5,cost:1,draw(c,x,y,u){jsh(c,x,y,u*1.4,u*2);jbox(c,x,y,u,-1.0,1.0,-0.8,0.8,0,1.6);}}
  }};
const JUNGLE_HEIGHT={fernCluster:'low',mossBoulder:'low',glyphBlock:'low',palmTree:'mid'};
Object.keys(JUNGLE_PACK.assets).forEach(id=>{JUNGLE_PACK.assets[id].h=JUNGLE_HEIGHT[id]||'low';});

const KEEP_OUT={rx:0.52,ry:0.34};
function placeThemeAssets(pack,tier,R,seed,opts){
  opts=opts||{};const avoid=opts.avoid||null;
  const rnd=mulberry(seed*7919+tier*131), u=R*0.068, T=pack.tiers[tier], out=[], decals=[], TAU=Math.PI*2;
  if(!T)return {assets:out,decals,u};
  const inside=(x,y,k)=>{const X=Math.abs(x)/R,Y=Math.abs(y)/(0.58*R);return X<=0.866*k&&Y<=k-X/1.732;};
  const ids=Object.keys(pack.assets), cnt={};
  const free=(x,y,w)=>out.every(o=>Math.hypot(o.x-x,(o.y-y)*1.7)>(o.w+w)*u*0.8);
  const clearOfCenter=(x,y,w,h)=>{if(avoid){const kk=h==='tall'?0.75:0.85;for(const a of avoid){if(Math.hypot(x-a.x,(y-a.y)*1.7)<a.r+w*u*kk)return false;}return true;}const kx=h==='tall'?0.28:0.75,ky=h==='tall'?0.18:0.4,ex=R*KEEP_OUT.rx+w*u*kx,ey=R*KEEP_OUT.ry+w*u*ky;return x*x/(ex*ex)+y*y/(ey*ey)>1;};
  const zoneOK=(a,x,y)=>{const h=a.h||'low';if(h==='low')return true;const ax=Math.abs(x)/R;if(y>R*0.12)return h==='mid'&&ax>0.5;if(y>=-R*0.12)return h==='mid'||ax>0.55;return true;};
  const ringPoint=(tmax)=>{const th=rnd()*TAU,dx=Math.cos(th),dy=Math.sin(th);let lo=0,hi=R*1.2;for(let i=0;i<12;i++){const m=(lo+hi)/2;if(inside(dx*m,dy*m,0.9))lo=m;else hi=m;}const t=0.5+rnd()*((tmax||1)-0.5);return[dx*lo*t,dy*lo*t];};
  const spot=a=>{for(let i=0;i<120;i++){const p=ringPoint(a.h==='mid'?0.92:1);if(clearOfCenter(p[0],p[1],a.w,a.h)&&zoneOK(a,p[0],p[1])&&free(p[0],p[1],a.w))return p;}return null;};
  const add=(id,x,y)=>{const a=pack.assets[id];out.push({id,x,y,v:Math.floor(rnd()*1000),w:a.w});cnt[id]=(cnt[id]||0)+1;};
  for(let i=0;i<Math.round(T.decals*(opts.decalScale==null?1:opts.decalScale));i++){const pool=ids.filter(id=>pack.assets[id].cat==='decal'&&pack.assets[id].tier<=tier),id=pool[Math.floor(rnd()*pool.length)];
    for(let t=0;t<40;t++){const p=ringPoint();if(clearOfCenter(p[0],p[1],pack.assets[id].w*0.5)){decals.push({id,x:p[0],y:p[1],v:Math.floor(rnd()*1000)});break;}}}
  let budget=Math.max(0,Math.round(T.budget*(opts.budgetScale==null?1:opts.budgetScale)));const maxW=opts.maxW==null?1e9:opts.maxW;
  let guard=0;while(budget>0&&guard++<500){const pool=ids.filter(id=>{const a=pack.assets[id];return a.cat!=='decal'&&a.cat!=='landmark'&&a.tier<=tier&&a.cost<=budget&&a.w<=maxW&&(cnt[id]||0)<(a.max||3);});
    if(!pool.length)break;let tot=0;pool.forEach(id=>tot+=pack.assets[id].weight);let pick=rnd()*tot,id=pool[0];for(const q of pool){pick-=pack.assets[q].weight;if(pick<=0){id=q;break;}}
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}else{cnt[id]=99;}}
  return {assets:out,decals,u};
}
function drawThemeGround(ctx,cx,cy,R,pack,border){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);ctx[i?'lineTo':'moveTo'](cx+R*Math.cos(a),cy+R*Math.sin(a)*0.58);}ctx.closePath();
  ctx.fillStyle=pack.ground;ctx.fill();ctx.lineWidth=Math.max(1.5,R*0.03);ctx.strokeStyle=border||pack.border;ctx.stroke();}
function drawThemeDecals(ctx,cx,cy,pack,pl,tm){pl.decals.forEach(d=>pack.assets[d.id].draw(ctx,cx+d.x,cy+d.y,pl.u,d.v,tm||0));}
function drawThemeAssets(ctx,cx,cy,pack,pl,tm,layer){pl.assets.filter(o=>layer==='back'?o.y<0:layer==='front'?o.y>=0:true).sort((a,b)=>a.y-b.y).forEach(o=>pack.assets[o.id].draw(ctx,cx+o.x,cy+o.y,pl.u,o.v,tm||0));}
/* ===== END PACK CODE ===== */

/* ===== STATIC CLASSIC ARROW MINE TRAIN COASTER (2-Hex, Cedar Creek / Adventure Express Style) ===== */
function buildMineTrainWaypoints() {
  const W = [];
  // Flags: 0 = normal trestle track, 1 = wooden catwalk chain lift hill, 2 = spiraling wooden helix, 3 = brake run
  const add = (s, v, z, bank, flag = 0) => W.push([s, v, z, bank, flag]);

  // 0..2: Wooden Mine-Shed Station (front-center, traveling right-to-left: s = +0.20 -> -0.22 along v = +0.46)
  add( 0.20,  0.46, 0.09,  0.00, 0);
  add(-0.01,  0.46, 0.09,  0.00, 0);
  add(-0.22,  0.46, 0.09,  0.00, 0);

  // 3..4: Pre-Lift Curve around front-left
  add(-0.56,  0.44, 0.08,  0.22, 0);
  add(-0.78,  0.22, 0.11,  0.26, 0);

  // 5..8: PRIMARY CHAIN LIFT HILL climbing diagonally from left to upper-back-left (with wooden catwalk!)
  add(-0.84, -0.06, 0.24,  0.00, 1);
  add(-0.74, -0.34, 0.44,  0.00, 1);
  add(-0.60, -0.56, 0.64,  0.00, 1);
  add(-0.42, -0.66, 0.76,  0.00, 1); // Lift #1 Summit Crest

  // 9..13: Upper-Left Sweeping Wooden Trestle Turnaround & Dipping Airtime Hills
  add(-0.16, -0.66, 0.64,  0.34, 0);
  add( 0.10, -0.56, 0.42,  0.26, 0);
  add( 0.34, -0.58, 0.54, -0.20, 0); // Mid-back airtime crest
  add( 0.62, -0.52, 0.34,  0.32, 0);
  add( 0.86, -0.32, 0.24,  0.38, 0);

  // 14..20: SIGNATURE 360°+ SPIRALING WOODEN-TRESTLE HELIX #1 (Lower-Right Hex, descending & banked)
  const hxS = 0.64, hxV = 0.14, rS = 0.25, rV = 0.24;
  add(hxS + rS * 0.92, hxV - rV * 0.45, 0.28, 0.48, 2); // Helix entry
  add(hxS + rS * 0.40, hxV + rV * 0.90, 0.36, 0.54, 2); // Helix outer front-right
  add(hxS - rS * 0.82, hxV + rV * 0.72, 0.32, 0.52, 2); // Helix inner front-left
  add(hxS - rS * 0.92, hxV - rV * 0.55, 0.25, 0.46, 2); // Helix inner back
  add(hxS + rS * 0.22, hxV - rV * 0.95, 0.20, 0.42, 2); // Helix outer back-right
  add(hxS + rS * 0.88, hxV + rV * 0.15, 0.15, 0.36, 2); // Helix lower front-right
  add(hxS + rS * 0.25, hxV + rV * 0.86, 0.11, 0.28, 2); // Helix exit curve

  // 21..24: Low Terrain-Hugging S-Curves across Center & SECONDARY ARROW LIFT HILL #2
  add( 0.22,  0.20, 0.10, -0.22, 0);
  add(-0.08,  0.04, 0.16,  0.18, 0);
  add(-0.34, -0.02, 0.26,  0.00, 1); // Lift #2 Base
  add(-0.52, -0.08, 0.44,  0.00, 1); // Lift #2 Crest

  // 25..31: UPPER-LEFT 360°+ SPIRALING WOODEN-TRESTLE HELIX #2
  //         Sweeps continuously counterclockwise around (-0.64, +0.08) so there is zero knifing!
  const hx2S = -0.64, hx2V = 0.08, r2S = 0.21, r2V = 0.24;
  add(hx2S - r2S * 0.35, hx2V - r2V * 0.92, 0.42, -0.44, 2); // Top-back entry from Lift #2
  add(hx2S - r2S * 0.98, hx2V - r2V * 0.12, 0.36, -0.50, 2); // Outer far-left arc
  add(hx2S - r2S * 0.45, hx2V + r2V * 0.86, 0.30, -0.48, 2); // Outer front-left arc
  add(hx2S + r2S * 0.78, hx2V + r2V * 0.78, 0.25, -0.44, 2); // Inner front-right arc
  add(hx2S + r2S * 0.92, hx2V - r2V * 0.35, 0.21, -0.40, 2); // Inner back arc
  add(hx2S - r2S * 0.15, hx2V - r2V * 0.90, 0.17, -0.34, 2); // Second turn top-left
  add(hx2S - r2S * 0.72, hx2V + r2V * 0.35, 0.14, -0.26, 2); // Second turn exit sweep

  // 32..35: Smooth Sweeping Front-Loop & Wooden Brake Run feeding collinearly into Station #0!
  add(-0.36,  0.30, 0.12, -0.18, 0);
  add( 0.12,  0.34, 0.11,  0.22, 0);
  add( 0.46,  0.44, 0.10,  0.18, 3); // Final Brake Curve
  add( 0.34,  0.46, 0.09,  0.00, 3); // Straight Brake Run -> Station #0 [0.20, 0.46, 0.09]

  return W;
}

const MINE_ANCHORS = buildMineTrainWaypoints();

function mtLayout(R, mode) {
  mtLayout._c = mtLayout._c || {};
  const key = mode + '|' + R;
  if (mtLayout._c[key]) return mtLayout._c[key];

  const side = mode === 'side';
  const N = 1040;
  const A = side ? 1.44 * R : 1.02 * R;
  const B = side ? 0.48 * R : 0.36 * R;
  const zsc = 0.92 * Math.min(1.05, A / (1.44 * R) + 0.08);
  const k = side ? 1.0 : 0.90;
  const ax = side ? [1, 0] : [0.706, 0.709];
  const lt = side ? [0, -1] : [0.706, -0.709];
  const hexes = side ? [[-0.866 * R, 0], [0.866 * R, 0]] : [[-0.433 * R, -0.435 * R], [0.433 * R, 0.435 * R]];

  const W = MINE_ANCHORS, m = W.length, dense = [];
  const getPt = idx => W[((idx % m) + m) % m];

  for (let i = 0; i < m; i++) {
    const p0 = getPt(i - 1), p1 = getPt(i), p2 = getPt(i + 1), p3 = getPt(i + 2);
    const subSteps = 30;
    for (let q = 0; q < subSteps; q++) {
      const t = q / subSteps, t2 = t * t, t3 = t2 * t;
      const cr = (v0, v1, v2, v3) => 0.5 * ((2 * v1) + (-v0 + v2) * t + (2 * v0 - 5 * v1 + 4 * v2 - v3) * t2 + (-v0 + 3 * v1 - 3 * v2 + v3) * t3);
      const uVal = cr(p0[0], p1[0], p2[0], p3[0]) * A;
      const vVal = -cr(p0[1], p1[1], p2[1], p3[1]) * B;
      const zVal = Math.max(0.055, cr(p0[2], p1[2], p2[2], p3[2])) * zsc * R;
      const bkVal = cr(p0[3], p1[3], p2[3], p3[3]);
      dense.push({
        gx: ax[0] * uVal + lt[0] * vVal,
        gy: ax[1] * uVal + lt[1] * vVal,
        z: zVal,
        bk: bkVal,
        flag: p1[4],
        seg: i + t
      });
    }
  }

  const cum = [0];
  for (let i = 1; i < dense.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(dense[i].gx - dense[i - 1].gx, dense[i].gy - dense[i - 1].gy, (dense[i].z - dense[i - 1].z) * 0.55));
  }
  const last = dense[dense.length - 1];
  const Lt = cum[cum.length - 1] + Math.hypot(dense[0].gx - last.gx, dense[0].gy - last.gy, (dense[0].z - last.z) * 0.55);
  dense.push({ gx: dense[0].gx, gy: dense[0].gy, z: dense[0].z, bk: dense[0].bk, flag: dense[0].flag, seg: m });
  cum.push(Lt);

  const g = [], z = [], bank = [], flagArr = [], segIdx = [];
  let j = 0;
  for (let i = 0; i < N; i++) {
    const d = (i / N) * Lt;
    while (j < cum.length - 2 && cum[j + 1] < d) j++;
    const t = (d - cum[j]) / ((cum[j + 1] - cum[j]) || 1);
    const A0 = dense[j], A1 = dense[j + 1];
    g.push([A0.gx + (A1.gx - A0.gx) * t, A0.gy + (A1.gy - A0.gy) * t]);
    z.push(A0.z + (A1.z - A0.z) * t);
    bank.push(A0.bk + (A1.bk - A0.bk) * t);
    flagArr.push(A0.flag);
    segIdx.push(A0.seg + (A1.seg - A0.seg) * t);
  }

  const n = [];
  for (let i = 0; i < N; i++) {
    const p = g[(i + N - 1) % N], q = g[(i + 1) % N];
    const dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy) || 1;
    n.push([-dy / len, dx / len]);
  }

  return (mtLayout._c[key] = { N, g, z, bank, n, flagArr, segIdx, hexes, Lt, k, ds: Lt / N, lt, ax });
}

function mtDraw(ctx, cx, cy, R, op, mode) {
  const accent = op.accent || '#b45309';
  const fl     = op.flip ? -1 : 1;
  const L      = mtLayout(R, mode), N = L.N, k = L.k, Rk = R * k;
  const hw     = R * 0.0155 * k;   // Half-width between twin tubular steel running rails
  const tieW   = R * 0.0235 * k;   // Wide heavy wooden crosstie beam overhang
  const spD    = R * 0.0125 * k;   // Depth of Arrow tubular steel backbone spine

  ctx.save();
  ctx.translate(cx, cy);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const line = (a, b, c, w) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); };
  const poly = (pts, fill, stroke, lw) => {
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = fill; ctx.lineWidth = 0.55; ctx.stroke(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || R * 0.006; ctx.stroke(); }
  };
  const P = i => { i = (i + N) % N; return [L.g[i][0], L.g[i][1] - L.z[i]]; };

  // Precompute 3D banked Arrow track, timber crosstie deck, and steel spine geometry
  const ED = [];
  for (let i = 0; i < N; i++) {
    const p = P(i), n = L.n[i], b = L.bank[i], cb = Math.cos(b), sb = Math.sin(b);
    const lx = n[0] * cb, ly = n[1] * cb - sb;
    const dx = n[0] * sb, dy = n[1] * sb + cb;
    const R1 = [p[0] + lx * hw, p[1] + ly * hw];
    const R2 = [p[0] - lx * hw, p[1] - ly * hw];
    const T1 = [p[0] + lx * tieW + dx * R * 0.004 * k, p[1] + ly * tieW + dy * R * 0.004 * k];
    const T2 = [p[0] - lx * tieW + dx * R * 0.004 * k, p[1] - ly * tieW + dy * R * 0.004 * k];
    const SP = [p[0] + dx * spD, p[1] + dy * spD];
    ED.push({ p, R1, R2, T1, T2, SP, lx, ly, dx, dy });
  }

  // 1. Soft Continuous Ground Shadow
  ctx.save();
  ctx.translate(fl * R * 0.042, R * 0.028);
  ctx.beginPath();
  L.g.forEach((p, i) => { const z = L.z[i], x = p[0] + fl * z * 0.28, y = p[1] + z * 0.14; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
  ctx.closePath();
  ctx.strokeStyle = 'rgba(18, 14, 8, 0.20)';
  ctx.lineWidth = R * 0.046 * k;
  ctx.stroke();
  ctx.restore();

  const items = [];
  // Authentic weathered creosote-timber & rusted Arrow steel palette
  const timDark  = '#3b2413';
  const timMid   = '#5c3a1e';
  const timLight = '#855832';
  const timHi    = '#a87444';
  const railDark = '#1c1917';
  const railMid  = '#44403c';
  const railHi   = '#a8a29e';

  // =========================================================================
  // 2. DENSE X-BRACED WOODEN TRESTLE BENTS & LONGITUDINAL WOODEN STRINGERS
  // =========================================================================
  const bentIndices = [];
  let acc = 0;
  for (let i = 0; i < N; i++) {
    acc += L.ds;
    const zi = L.z[i];
    const flg = L.flagArr[i];
    const sp = (flg === 2 ? R * 0.078 : flg === 1 ? R * 0.088 : R * 0.095) * k;
    if (acc >= sp && zi >= R * 0.065) {
      acc = 0;
      bentIndices.push(i);
    }
  }

  bentIndices.forEach((idx, bPos) => {
    const ei = ED[idx];
    const gPt = L.g[idx];
    const nVec = L.n[idx];
    const zi = L.z[idx];
    const key = gPt[1] + zi * 0.05 - 0.008;

    // Battered (slightly splayed) wooden trestle bent posts
    const topHalfW = tieW * 0.92;
    const botHalfW = topHalfW + zi * 0.065;
    const bL = [gPt[0] - nVec[0] * botHalfW, gPt[1] - nVec[1] * botHalfW];
    const bR = [gPt[0] + nVec[0] * botHalfW, gPt[1] + nVec[1] * botHalfW];
    const tL = [ei.T2[0], ei.T2[1] + R * 0.003 * k];
    const tR = [ei.T1[0], ei.T1[1] + R * 0.003 * k];

    // Check if there is an adjacent bent along the track to connect longitudinal X-bracing
    const nextIdx = bentIndices[(bPos + 1) % bentIndices.length];
    const dAlong = Math.hypot(L.g[nextIdx][0] - gPt[0], L.g[nextIdx][1] - gPt[1]);
    const hasNext = dAlong < R * 0.16 * k && Math.abs(L.z[nextIdx] - zi) < R * 0.14;

    items.push({ k: key, f: () => {
      // Footing mudsill shadow
      line(
        [bL[0] - nVec[0] * R * 0.008 * k, bL[1] - nVec[1] * R * 0.008 * k],
        [bR[0] + nVec[0] * R * 0.008 * k, bR[1] + nVec[1] * R * 0.008 * k],
        'rgba(24, 16, 8, 0.42)', R * 0.011 * k
      );

      // Left & Right battered timber posts
      line(bL, tL, timDark,  R * 0.0115 * k);
      line([bL[0] - R * 0.002, bL[1]], [tL[0] - R * 0.002, tL[1]], timLight, R * 0.0045 * k);
      line(bR, tR, timDark,  R * 0.0115 * k);
      line([bR[0] - R * 0.002, bR[1]], [tR[0] - R * 0.002, tR[1]], timLight, R * 0.0045 * k);

      // Top timber cap beam under the track ties
      line(tL, tR, timMid, R * 0.011 * k);

      // Multi-tier horizontal wooden ledgers & diagonal X-bracing within the bent
      const nTiers = Math.max(1, Math.floor(zi / (R * 0.15 * k)));
      for (let tr = 0; tr < nTiers; tr++) {
        const f0 = tr / nTiers;
        const f1 = (tr + 1) / nTiers;
        const l0 = [bL[0] + (tL[0] - bL[0]) * f0, bL[1] + (tL[1] - bL[1]) * f0];
        const r0 = [bR[0] + (tR[0] - bR[0]) * f0, bR[1] + (tR[1] - bR[1]) * f0];
        const l1 = [bL[0] + (tL[0] - bL[0]) * f1, bL[1] + (tL[1] - bL[1]) * f1];
        const r1 = [bR[0] + (tR[0] - bR[0]) * f1, bR[1] + (tR[1] - bR[1]) * f1];

        if (tr > 0) line(l0, r0, timMid, R * 0.007 * k);
        line(l0, r1, timLight, R * 0.0048 * k);
        line(r0, l1, timMid,   R * 0.0048 * k);
      }

      // Longitudinal wooden ledger & diagonal X-bracing to the next bent
      if (hasNext) {
        const ej = ED[nextIdx];
        const gj = L.g[nextIdx];
        const nj = L.n[nextIdx];
        const zj = L.z[nextIdx];
        const botHalfWj = topHalfW + zj * 0.065;
        const bRj = [gj[0] + nj[0] * botHalfWj, gj[1] + nj[1] * botHalfWj];
        const tRj = [ej.T1[0], ej.T1[1] + R * 0.003 * k];

        const m0 = [bR[0] + (tR[0] - bR[0]) * 0.5, bR[1] + (tR[1] - bR[1]) * 0.5];
        const m1 = [bRj[0] + (tRj[0] - bRj[0]) * 0.5, bRj[1] + (tRj[1] - bRj[1]) * 0.5];
        line(m0, m1,  timMid,   R * 0.0065 * k);
        line(m0, tRj, timLight, R * 0.0045 * k);
        line(tR, m1,  timDark,  R * 0.0045 * k);
      }
    }});
  });

  // =========================================================================
  // 3. ARROW TUBULAR STEEL RAILS & SPINE MOUNTED ON HEAVY TIMBER CROSSTIES
  // =========================================================================
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N, ei = ED[i], ej = ED[j];
    const flg = L.flagArr[i];
    const key = L.g[i][1] + L.z[i] * 0.05;

    items.push({ k: key, f: () => {
      // A. Longitudinal Wooden Ledger Stringers underneath the crossties
      line([ei.T1[0], ei.T1[1] + R * 0.004 * k], [ej.T1[0], ej.T1[1] + R * 0.004 * k], timDark, R * 0.0075 * k);
      line([ei.T2[0], ei.T2[1] + R * 0.004 * k], [ej.T2[0], ej.T2[1] + R * 0.004 * k], timDark, R * 0.0075 * k);

      // B. Arrow Tubular Steel Spine Pipe
      line(ei.SP, ej.SP, railDark, R * 0.0115 * k);
      line([ei.SP[0] - R * 0.0015, ei.SP[1] - R * 0.0015], [ej.SP[0] - R * 0.0015, ej.SP[1] - R * 0.0015], railHi, R * 0.0040 * k);

      // C. Heavy Timber Crosstie Beams + Steel Tie-Plate Brackets
      if (i % 2 === 0) {
        line(ei.T1, ei.T2, timDark, R * 0.0085 * k);
        line([ei.T1[0], ei.T1[1] - R * 0.0015], [ei.T2[0], ei.T2[1] - R * 0.0015], timLight, R * 0.0045 * k);
        line(ei.R1, ei.R2, railMid, R * 0.0045 * k);
      }

      // D. Twin Tubular Steel Running Rails with Metallic Specular Highlight
      line(ei.R1, ej.R1, railDark, R * 0.0068 * k);
      line(ei.R2, ej.R2, railDark, R * 0.0068 * k);
      line(ei.R1, ej.R1, railMid,  R * 0.0046 * k);
      line(ei.R2, ej.R2, railMid,  R * 0.0046 * k);
      line(ei.R1, ej.R1, railHi,   R * 0.0018 * k);
      line(ei.R2, ej.R2, railHi,   R * 0.0018 * k);

      // E. Slatted Wooden Lift-Hill Catwalk, Chain Trough & Timber Handrail
      if (flg === 1) {
        line(ei.p, ej.p, '#1c1917', R * 0.0065 * k);
        const cwOff = R * 0.025 * k;
        const cw1 = [ei.R1[0] + ei.lx * cwOff, ei.R1[1] + ei.ly * cwOff];
        const cw2 = [ej.R1[0] + ej.lx * cwOff, ej.R1[1] + ej.ly * cwOff];
        poly([ei.R1, ej.R1, cw2, cw1], timHi);
        if (i % 2 === 0) {
          line(ei.R1, cw1, timDark, R * 0.0035 * k);
        }
        if (i % 3 === 0) {
          const hr1 = [cw1[0], cw1[1] - R * 0.017 * k];
          const hr2 = [cw2[0], cw2[1] - R * 0.017 * k];
          line(cw1, hr1, timMid, R * 0.0040 * k);
          line(hr1, hr2, timHi,  R * 0.0045 * k);
        }
      }

      // F. Wooden Brake Catwalk & Brass/Steel Skid Brakes on Final Brake Run
      if (flg === 3) {
        const cwOff = R * 0.020 * k;
        const cw1 = [ei.R2[0] - ei.lx * cwOff, ei.R2[1] - ei.ly * cwOff];
        const cw2 = [ej.R2[0] - ei.lx * cwOff, ej.R2[1] - ej.ly * cwOff];
        poly([ei.R2, ej.R2, cw2, cw1], timLight);
        if (i % 2 === 0) {
          line(ei.p, ej.p, '#d97706', R * 0.0065 * k);
        }
      }
    }});
  }

  // =========================================================================
  // 4. RUSTIC TIMBER MINE-SHED BOARDING STATION (Split Deck Below + Roof Above)
  // =========================================================================
  let stI0 = 0, stI1 = Math.round(0.055 * N);
  for (let i = 0; i < N; i++) {
    if (Math.abs(L.segIdx[i] - 0.15) < 0.08) stI0 = i;
    if (Math.abs(L.segIdx[i] - 1.95) < 0.08) stI1 = i;
  }
  const b = L.lt, g0 = L.g[stI0], g1 = L.g[stI1];
  const stMaxY = Math.max(g0[1], g1[1]), stMinY = Math.min(g0[1], g1[1]);
  const pf = (gx, off, up) => [gx[0] + b[0] * off, gx[1] + b[1] * off - up];
  const wBack = Rk * 0.072, wFront = -Rk * 0.076;
  const zDeck = Rk * 0.024, zEave = Rk * 0.125, zPeak = Rk * 0.175;

  // Pass 1 (Below Track): Planked Timber Platform & Back Timber Posts
  items.push({ k: stMinY - Rk * 0.08, f: () => {
    const dB0 = pf(g0, wBack, zDeck), dB1 = pf(g1, wBack, zDeck);
    const dF1 = pf(g1, wFront, zDeck), dF0 = pf(g0, wFront, zDeck);
    poly([dF0, dF1, [dF1[0], dF1[1] + zDeck], [dF0[0], dF0[1] + zDeck]], timDark);
    poly([dB0, dB1, dF1, dF0], timHi, timDark, Rk * 0.006);
    [0.1, 0.5, 0.9].forEach(t => {
      const gx = [g0[0] + (g1[0] - g0[0]) * t, g0[1] + (g1[1] - g0[1]) * t];
      line(pf(gx, wBack * 0.9, zDeck), pf(gx, wBack * 0.9, zEave), timDark, Rk * 0.012);
    });
  }});

  // Pass 2 (Above Track): Front Timber Posts, Pitched Shake Roof & Mine-Shaft Cupola Tower
  items.push({ k: stMaxY + Rk * 0.25, f: () => {
    [0.1, 0.5, 0.9].forEach(t => {
      const gx = [g0[0] + (g1[0] - g0[0]) * t, g0[1] + (g1[1] - g0[1]) * t];
      line(pf(gx, wFront * 0.9, zDeck), pf(gx, wFront * 0.9, zEave), timMid, Rk * 0.012);
    });
    const rB0 = pf(g0, wBack * 1.08, zEave),  rB1 = pf(g1, wBack * 1.08, zEave);
    const rF0 = pf(g0, wFront * 1.08, zEave), rF1 = pf(g1, wFront * 1.08, zEave);
    const rM0 = pf(g0, 0, zPeak),             rM1 = pf(g1, 0, zPeak);

    // Weathered cedar-shake / corrugated tin mine shed roof
    poly([rB0, rB1, rM1, rM0], '#57534e', '#292524', Rk * 0.006);
    poly([rB0, rF0, rM0], timDark);
    poly([rB1, rF1, rM1], timMid);
    poly([rM0, rM1, rF1, rF0], '#78716c', '#292524', Rk * 0.007);
    line(rF0, rF1, timDark, Rk * 0.011);
    line(rM0, rM1, accent,  Rk * 0.009);

    // Signature Mine-Headframe Cupola Tower rising from the center of the station roof
    const c0 = [g0[0] + (g1[0] - g0[0]) * 0.34, g0[1] + (g1[1] - g0[1]) * 0.34];
    const c1 = [g0[0] + (g1[0] - g0[0]) * 0.66, g0[1] + (g1[1] - g0[1]) * 0.66];
    const cw = Rk * 0.036;
    const zCup0 = zPeak - Rk * 0.01, zCup1 = zPeak + Rk * 0.065, zCupTop = zPeak + Rk * 0.105;
    poly([pf(c0, -cw, zCup0), pf(c1, -cw, zCup0), pf(c1, -cw, zCup1), pf(c0, -cw, zCup1)], timMid, timDark, Rk * 0.005);
    poly([pf(c0, -cw, zCup1), pf(c1, -cw, zCup1), pf(c1, 0, zCupTop), pf(c0, 0, zCupTop)], '#57534e', '#292524', Rk * 0.005);
  }});

  // =========================================================================
  // 5. TWO 6-CAR RIVETED ORE-CART MINE TRAINS (Locomotive Nose + Slatted Ore Cars)
  // =========================================================================
  const drawOreCar = (i, isLoco) => {
    const idx = (i + N) % N;
    const p = P(idx), pn = P(idx + 2), pp = P(idx - 2);
    let tx = pn[0] - pp[0], ty = pn[1] - pp[1];
    const m = Math.hypot(tx, ty) || 1; tx /= m; ty /= m;
    const ei = ED[idx];
    const c = [p[0] - ei.dx * Rk * 0.011, p[1] - ei.dy * Rk * 0.011];
    const lx = Rk * 0.027, wy = Rk * 0.020;
    const q = (a, bb, dz) => [c[0] + tx * a + ei.lx * bb, c[1] + ty * a + ei.ly * bb + dz];

    const cartBodyCol = accent;
    const cartRimCol  = '#292524';

    items.push({ k: L.g[idx][1] + L.z[idx] * 0.05 + 0.016, f: () => {
      // Heavy iron chassis undercarriage
      poly([q(-lx, wy, 0), q(lx, wy, 0), q(lx, wy, Rk * 0.013), q(-lx, wy, Rk * 0.013)], cartRimCol);
      // Slatted wooden/painted ore-cart tub
      poly([q(-lx, -wy, 0), q(lx, -wy, 0), q(lx, wy, 0), q(-lx, wy, 0)], cartBodyCol, cartRimCol, Rk * 0.004);
      // Diagonal iron reinforcement straps on the ore car sides
      line(q(-lx * 0.6, wy, 0), q(lx * 0.6, wy, Rk * 0.012), '#d6d3d1', Rk * 0.0035);

      if (isLoco) {
        // Classic Arrow Mine-Train Steam Locomotive Boiler Nose, Cowcatcher & Brass Headlamp!
        poly([q(lx * 0.25, -wy * 0.85, 0), q(lx * 1.38, -wy * 0.65, Rk * 0.002), q(lx * 1.38, wy * 0.65, Rk * 0.002), q(lx * 0.25, wy * 0.85, 0)], '#1c1917', '#78716c', Rk * 0.004);
        const pLamp = q(lx * 1.38, 0, -Rk * 0.004);
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(pLamp[0], pLamp[1], Rk * 0.008, 0, 7); ctx.fill();
      }

      // 2-across riders inside the ore tub
      [-0.44, 0.44].forEach((d, rIdx) => {
        const h = q(-lx * 0.14, d * wy, -Rk * 0.018);
        ctx.fillStyle = ['#ef4444', '#38bdf8', '#22c55e', '#facc15'][(idx + rIdx) % 4];
        ctx.fillRect(h[0] - Rk * 0.008, h[1] + Rk * 0.006, Rk * 0.016, Rk * 0.010);
        ctx.fillStyle = '#fde4c8';
        ctx.beginPath(); ctx.arc(h[0], h[1], Rk * 0.0095, 0, 7); ctx.fill();
      });
    }});
  };

  const sp = Math.round(Rk * 0.052 / L.ds);
  [0.185, 0.565].forEach(fh => {
    const ih = Math.round(fh * N);
    for (let cIdx = 0; cIdx < 6; cIdx++) drawOreCar(ih - cIdx * sp, cIdx === 0);
  });

  items.sort((a, b) => a.k - b.k).forEach(it => it.f());
  ctx.restore();
}

/**
 * 4x HiDPI Supersampled Offscreen Baker for the 2-Hex Classic Arrow Mine Train Coaster
 */
function mineTrainSprite(R, mode, dir, accent, scale) {
  mineTrainSprite._c = mineTrainSprite._c || {};
  const dpr = (typeof devicePixelRatio === 'number' && devicePixelRatio > 1) ? devicePixelRatio : 1;
  const sc = scale || Math.max(3.5, Math.min(4.5, dpr * 2.5));
  const key = [mode, dir, R, accent, sc].join('|');
  if (mineTrainSprite._c[key]) return mineTrainSprite._c[key];

  const side = mode === 'side';
  const W = Math.ceil((side ? 3.65 : 2.75) * R);
  const H = Math.ceil((side ? 2.35 : 3.05) * R);
  const oy = (side ? 1.65 : 2.00) * R;
  const cv = document.createElement('canvas');
  cv.width = Math.ceil(W * sc);
  cv.height = Math.ceil(H * sc);
  const g = cv.getContext('2d');
  g.scale(sc, sc);
  g.save();
  g.translate(W / 2, oy);
  if (dir === 'NE-SW') g.scale(-1, 1);
  mtDraw(g, 0, 0, R, { accent, flip: dir === 'NE-SW' }, mode);
  g.restore();
  return (mineTrainSprite._c[key] = { canvas: cv, ox: W / 2, oy, w: W, h: H });
}

function drawMineTrainSide(ctx, cx, cy, R, o) {
  o = o || {};
  const s = mineTrainSprite(R, 'side', 'NW-SE', o.accent || '#b45309', o.scale);
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(s.canvas, cx - s.ox, cy - s.oy, s.w, s.h);
  ctx.restore();
}

function drawMineTrainDiag(ctx, cx, cy, R, o) {
  o = o || {};
  const d = o.dir === 'NE-SW' ? 'NE-SW' : 'NW-SE';
  const s = mineTrainSprite(R, 'diag', d, o.accent || '#b45309', o.scale);
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(s.canvas, cx - s.ox, cy - s.oy, s.w, s.h);
  ctx.restore();
}
return Object.freeze({ side: drawMineTrainSide, diag: drawMineTrainDiag });
})(),
  classic_looper: (() => {
/* ===== THEME PACK CORE (shared by every theme pack; copy once into engine.js) ===== */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shade(hex, amt){
  if(!hex || hex[0]!=='#') return hex || '#888888';
  const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;
  const f=c=>Math.max(0,Math.min(255,Math.round(amt<0?c*(1+amt):c+(255-c)*amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
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
    ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x+rx*0.35,y+ry*0.25,rx*0.4,ry*0.5,0,0,7);ctx.fill();}
};

/* ===== FRONTIER PACK ===== */
const F={wood:'#8a5a33',woodD:'#5a3b22',woodL:'#b07a46',bark:'#6b4a2b',endc:'#d9b27a',pine:'#2f5f3a',pineL:'#3d7348',pineD:'#26503a'};
const fsh=(c,x,y,rx,h)=>{c.fillStyle='rgba(12,34,14,.32)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
function frFir(c,x,y,u,s){const H=u*6.2*s,tiers=6;fsh(c,x,y,u*1.6*s,H);TH.ln(c,[x,y],[x,y-u*1.2*s],'#4a3320',u*0.5*s);
  for(let k=0;k<tiers;k++){const t=k/(tiers-1),by=y-u*1.0*s-H*0.76*t,w=u*(1.75-1.2*t)*s,h=u*1.5*s;
    TH.poly(c,[[x-w,by+h*0.2],[x-w*0.35,by-h*0.3],[x,by-h*1.15],[x+w*0.35,by-h*0.3],[x+w,by+h*0.2],[x,by+h*0.55]],k%2?F.pine:F.pineL);
    TH.poly(c,[[x,by-h*1.15],[x+w*0.35,by-h*0.3],[x+w,by+h*0.2],[x+w*0.3,by+h*0.35]],'rgba(8,30,18,.4)');}}
const FRONTIER_PACK={id:'frontier',name:'Frontier',ground:'#7d955d',groundDark:'#6b8350',border:'#566e42',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},3:{budget:11,decals:4,landmark:0,pool:[]},4:{budget:15,decals:5,landmark:0,pool:[]}},
  assets:{
  pebbleBar:{cat:'decal',w:2.0,tier:1,weight:3,cost:0,draw(c,x,y,u,v){const r=mulberry(v+5);TH.ell(c,x,y,u*2.0,u*0.9,'#b9b4a2');for(let k=0;k<22;k++){const a=r()*6.283,rr=Math.sqrt(r());TH.ell(c,x+Math.cos(a)*u*1.8*rr,y+Math.sin(a)*u*0.8*rr,u*0.14,u*0.09,['#8a8f96','#a8a290','#c9c3b0','#6f747a'][k%4]);}}},
  pineNeedles:{cat:'decal',w:2.2,tier:1,weight:3.5,cost:0,draw(c,x,y,u,v){const r=mulberry(v+8);TH.ell(c,x,y,u*2.2,u*0.95,'#6b4f32');for(let k=0;k<26;k++){const a=r()*6.283,rr=Math.sqrt(r()),px=x+Math.cos(a)*u*2.0*rr,py=y+Math.sin(a)*u*0.85*rr;TH.ln(c,[px,py],[px+u*0.28,py-u*0.1],k%3?'#4a3320':'#8a6a45',u*0.04);}}},
  pineTree:{cat:'tree',w:1.8,tier:2,weight:3.5,cost:2,max:2,draw(c,x,y,u,v){frFir(c,x,y,u,1.3+(v%3)*0.12);}},
  firGrove:{cat:'tree',w:2.3,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v){[[-1.1,0.2,0.8],[1.0,0.3,0.92],[0.0,-0.5,0.7]].sort((a,b)=>a[1]-b[1]).forEach(([dx,dy,s])=>frFir(c,x+dx*u,y+dy*u,u,s));}},
  berryBush:{cat:'plant',w:1.4,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*3+6);fsh(c,x,y,u*1.4,u);[[-0.7,-0.5,0.85,'#3f7a45'],[0.7,-0.5,0.8,'#4a8a4c'],[0,-0.95,0.95,'#559858']].forEach(([dx,dy,s,col])=>TH.blob(c,x+dx*u,y+dy*u,u*s,u*s*0.72,col,r,9));}},
  boulders:{cat:'rock',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*13+3);fsh(c,x,y,u*1.9,u*1.4);[[0.0,0.0,1.0,1.0,'#80858d'],[-1.0,0.2,0.65,0.6,'#6f747c'],[0.9,0.25,0.6,0.55,'#8f949b']].forEach(([dx,dy,sx,sy,col])=>TH.blob(c,x+dx*u,y-u*0.55*sy+dy*u,u*0.9*sx,u*0.75*sy,col,r,9));}},
  fallenLog:{cat:'plant',w:2.2,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.2,u*1.4);const a=I(-2.0,0,0.45),b=I(2.0,0,0.45);TH.ln(c,a,b,'#4a3320',u*1.1);TH.ln(c,a,b,F.bark,u*0.9);TH.ell(c,b[0],b[1],u*0.45,u*0.55,F.endc);}}
  }};
const FRONTIER_HEIGHT={berryBush:'low',fallenLog:'low',boulders:'low',pineTree:'mid',firGrove:'mid'};
Object.keys(FRONTIER_PACK.assets).forEach(id=>{FRONTIER_PACK.assets[id].h=FRONTIER_HEIGHT[id]||'low';});

/* ===== JUNGLE PACK ===== */
const J={st:'#bdb9a0',stD:'#8e8a72',stL:'#dad7c3'};
const jbox=(c,x,y,u,x0,x1,y0,y1,z0,z1)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,J.st,J.stD,J.stL);
const jsh=(c,x,y,rx,h)=>{c.fillStyle='rgba(8,26,10,.36)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
const JUNGLE_PACK={id:'jungle',name:'Jungle',ground:'#587c48',groundDark:'#456a3a',border:'#35552c',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},3:{budget:11,decals:4,landmark:0,pool:[]},4:{budget:15,decals:5,landmark:0,pool:[]}},
  assets:{
  leafLitter:{cat:'decal',w:2.2,tier:1,weight:4,cost:0,draw(c,x,y,u,v){const r=mulberry(v+8);TH.ell(c,x,y,u*2.1,u*0.9,'#3f5f36');for(let k=0;k<22;k++){const a=r()*6.283,rr=Math.sqrt(r());TH.ell(c,x+Math.cos(a)*u*1.9*rr,y+Math.sin(a)*u*0.8*rr,u*0.17,u*0.08,['#6a5a2e','#4e7a3a','#8a6a30'][k%3],r()*3);}}},
  lilyPond:{cat:'decal',w:2.2,tier:1,weight:2.5,cost:0,draw(c,x,y,u){TH.ell(c,x,y,u*2.2,u*1.0,'#3a5a3a');TH.ell(c,x,y,u*1.95,u*0.86,'#2f7f78');TH.ell(c,x-u*0.2,y-u*0.05,u*1.5,u*0.6,'#3a9a8e');}},
  fernCluster:{cat:'flora',w:1.6,tier:1,weight:4,cost:1,draw(c,x,y,u,v){const r=mulberry(v*5+2);jsh(c,x,y,u*1.6,u*1.5);for(let k=0;k<8;k++){const a=-3.1+k*0.45,l=u*(1.7+r()*0.7),ex=x+Math.cos(a)*l,ey=y-Math.abs(Math.sin(a))*l*0.9-u*0.2;c.strokeStyle=k%2?'#3f8f45':'#4aa14e';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(ex-x)*0.45,y-l*0.95,ex,ey);c.stroke();}}},
  palmTree:{cat:'tree',w:1.8,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v){const r=mulberry(v*9+4),H=u*(6.2+r()*1.2),lean=(r()-0.5)*u*1.8;jsh(c,x,y,u*2.0,H);c.strokeStyle='#6a5236';c.lineWidth=u*0.52;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*0.2,y-H*0.5,x+lean,y-H);c.stroke();
    const tx=x+lean,ty=y-H;for(let k=0;k<8;k++){const a=-3.1+k*0.55,l=u*2.6,ex=tx+Math.cos(a)*l,ey=ty+Math.sin(a)*l*0.5+u*0.8;c.strokeStyle=k%2?'#2f7f3a':'#3f9a48';c.lineWidth=u*0.18;c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+(ex-tx)*0.55,ty-u*1.1,ex,ey);c.stroke();}}},
  mossBoulder:{cat:'rock',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*13+3);jsh(c,x,y,u*1.9,u*1.4);[[0.0,0.0,1.0,1.0,'#7d7f70'],[-1.0,0.2,0.65,0.6,'#6e7062'],[0.9,0.25,0.6,0.55,'#8a8c7c']].forEach(([dx,dy,sx,sy,col])=>TH.blob(c,x+dx*u,y-u*0.55*sy+dy*u,u*0.9*sx,u*0.75*sy,col,r,9));}},
  glyphBlock:{cat:'ruin',w:1.3,tier:1,weight:3.5,cost:1,draw(c,x,y,u){jsh(c,x,y,u*1.4,u*2);jbox(c,x,y,u,-1.0,1.0,-0.8,0.8,0,1.6);}}
  }};
const JUNGLE_HEIGHT={fernCluster:'low',mossBoulder:'low',glyphBlock:'low',palmTree:'mid'};
Object.keys(JUNGLE_PACK.assets).forEach(id=>{JUNGLE_PACK.assets[id].h=JUNGLE_HEIGHT[id]||'low';});

const KEEP_OUT={rx:0.52,ry:0.34};
function placeThemeAssets(pack,tier,R,seed,opts){
  opts=opts||{};const avoid=opts.avoid||null;
  const rnd=mulberry(seed*7919+tier*131), u=R*0.068, T=pack.tiers[tier], out=[], decals=[], TAU=Math.PI*2;
  if(!T)return {assets:out,decals,u};
  const inside=(x,y,k)=>{const X=Math.abs(x)/R,Y=Math.abs(y)/(0.58*R);return X<=0.866*k&&Y<=k-X/1.732;};
  const ids=Object.keys(pack.assets), cnt={};
  const free=(x,y,w)=>out.every(o=>Math.hypot(o.x-x,(o.y-y)*1.7)>(o.w+w)*u*0.8);
  const clearOfCenter=(x,y,w,h)=>{if(avoid){const kk=h==='tall'?0.75:0.85;for(const a of avoid){if(Math.hypot(x-a.x,(y-a.y)*1.7)<a.r+w*u*kk)return false;}return true;}const kx=h==='tall'?0.28:0.75,ky=h==='tall'?0.18:0.4,ex=R*KEEP_OUT.rx+w*u*kx,ey=R*KEEP_OUT.ry+w*u*ky;return x*x/(ex*ex)+y*y/(ey*ey)>1;};
  const zoneOK=(a,x,y)=>{const h=a.h||'low';if(h==='low')return true;const ax=Math.abs(x)/R;if(y>R*0.12)return h==='mid'&&ax>0.5;if(y>=-R*0.12)return h==='mid'||ax>0.55;return true;};
  const ringPoint=(tmax)=>{const th=rnd()*TAU,dx=Math.cos(th),dy=Math.sin(th);let lo=0,hi=R*1.2;for(let i=0;i<12;i++){const m=(lo+hi)/2;if(inside(dx*m,dy*m,0.9))lo=m;else hi=m;}const t=0.5+rnd()*((tmax||1)-0.5);return[dx*lo*t,dy*lo*t];};
  const spot=a=>{for(let i=0;i<120;i++){const p=ringPoint(a.h==='mid'?0.92:1);if(clearOfCenter(p[0],p[1],a.w,a.h)&&zoneOK(a,p[0],p[1])&&free(p[0],p[1],a.w))return p;}return null;};
  const add=(id,x,y)=>{const a=pack.assets[id];out.push({id,x,y,v:Math.floor(rnd()*1000),w:a.w});cnt[id]=(cnt[id]||0)+1;};
  for(let i=0;i<Math.round(T.decals*(opts.decalScale==null?1:opts.decalScale));i++){const pool=ids.filter(id=>pack.assets[id].cat==='decal'&&pack.assets[id].tier<=tier),id=pool[Math.floor(rnd()*pool.length)];
    for(let t=0;t<40;t++){const p=ringPoint();if(clearOfCenter(p[0],p[1],pack.assets[id].w*0.5)){decals.push({id,x:p[0],y:p[1],v:Math.floor(rnd()*1000)});break;}}}
  let budget=Math.max(0,Math.round(T.budget*(opts.budgetScale==null?1:opts.budgetScale)));const maxW=opts.maxW==null?1e9:opts.maxW;
  let guard=0;while(budget>0&&guard++<500){const pool=ids.filter(id=>{const a=pack.assets[id];return a.cat!=='decal'&&a.cat!=='landmark'&&a.tier<=tier&&a.cost<=budget&&a.w<=maxW&&(cnt[id]||0)<(a.max||3);});
    if(!pool.length)break;let tot=0;pool.forEach(id=>tot+=pack.assets[id].weight);let pick=rnd()*tot,id=pool[0];for(const q of pool){pick-=pack.assets[q].weight;if(pick<=0){id=q;break;}}
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}else{cnt[id]=99;}}
  return {assets:out,decals,u};
}
function drawThemeGround(ctx,cx,cy,R,pack,border){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);ctx[i?'lineTo':'moveTo'](cx+R*Math.cos(a),cy+R*Math.sin(a)*0.58);}ctx.closePath();
  ctx.fillStyle=pack.ground;ctx.fill();ctx.lineWidth=Math.max(1.5,R*0.03);ctx.strokeStyle=border||pack.border;ctx.stroke();}
function drawThemeDecals(ctx,cx,cy,pack,pl,tm){pl.decals.forEach(d=>pack.assets[d.id].draw(ctx,cx+d.x,cy+d.y,pl.u,d.v,tm||0));}
/* ===== END PACK CODE ===== */

/* ===== STATIC CLASSIC LOOPING COASTER (Arrow Dynamics / Schwarzkopf 2-Hex) =====
 * Modeled directly after Loch Ness Monster, Olympia Looping, and Arrow Corkscrews:
 *   1. Open-Web Steel Lattice Lift Hill: Steep diagonal chain lift supported by classic
 *      vertical & diagonal X-braced steel lattice trestle towers (just like Loch Ness Monster!).
 *   2. Arrow Tubular Steel Spine & Angled C-Channel Crosstie Ribs: Round tubular central
 *      spine pipe with closely spaced angled crossties cradling twin tubular rails.
 *   3. Twin / Interlocking Vertical Clothoid Loops + Slanted A-Frame Loop Cradles:
 *      Two towering vertical loops (Loop #1 at center-right, Loop #2 at left-center) braced
 *      by diagonal steel A-frame loop cradles anchoring the mid-height of each loop!
 *   4. Double Corkscrew Inversion Barrel with External White Curved Truss Hoops:
 *      A double barrel-roll corkscrew along the front-left flanked by external curved white
 *      structural truss rings wrapping around the corkscrew barrel (just like Arrow Corkscrews!).
 *   5. Two 6-Car Arrow / Schwarzkopf Lap-Bar & Over-The-Shoulder Trains.
 *
 * Public API:
 *   drawClassicLooperSide(ctx, cx, cy, R, {accent, support})
 *   drawClassicLooperDiag(ctx, cx, cy, R, {accent, support, dir})
 *   classicLooperFootprint(R, mode, dir)
 *   footprintForTile(fp, i)
 *   sceneryInFront(circles, x, y)
 */

// Build the full 3D loop + double-corkscrew spline in normalized `(s, v, z, bank, flag)` coordinates
function buildClassicLooperWaypoints() {
  const W = [];
  // Flags: 0 = normal, 1 = lattice lift hill, 2 = vertical loop, 3 = corkscrew hoop barrel, 4 = brake run
  const add = (s, v, z, bank, flag = 0) => W.push([s, v, z, bank, flag]);

  // 0..2: Gabled Boarding Station (front-center-right, traveling left-to-right: s = -0.08 -> +0.34 along v = +0.52)
  add(-0.08,  0.52, 0.08,  0.00, 0);
  add( 0.13,  0.52, 0.08,  0.00, 0);
  add( 0.34,  0.52, 0.08,  0.00, 0);

  // 3..4: Pre-Lift Turnaround on front-right
  add( 0.62,  0.46, 0.07, -0.35, 0);
  add( 0.72,  0.12, 0.09, -0.40, 0);

  // 5..8: CLASSIC STEEL LATTICE LIFT HILL climbing diagonally from right to back-left!
  add( 0.56, -0.18, 0.22,  0.00, 1);
  add( 0.26, -0.34, 0.50,  0.00, 1);
  add(-0.04, -0.50, 0.78,  0.00, 1);
  add(-0.32, -0.64, 0.98,  0.00, 1); // Lift Summit Crest (z = 0.98!)

  // 9..11: Plunging First Drop & Sweeping Turnaround on far left
  add(-0.62, -0.66, 0.72,  0.55, 0);
  add(-0.90, -0.44, 0.34,  0.75, 0);
  add(-0.92, -0.10, 0.08,  0.30, 0);

  // 12..19: VERTICAL CLOTHOID LOOP #1 (Center-Left, z = 0.08 -> 0.74 -> 0.08, bank = 0 -> PI -> 2*PI!)
  //         Note: Slight lateral offset (`v` shifts from -0.06 to +0.06 across loop) prevents rail self-collision!
  const L1_s = -0.42, L1_rS = 0.15, L1_z0 = 0.08, L1_zTop = 0.76;
  add(L1_s - 0.24, -0.08, L1_z0, 0.00, 0);
  for (let k = 0; k <= 8; k++) {
    const th = (k / 8) * Math.PI * 2; // 0 (bottom) -> PI (top inverted) -> 2*PI (bottom exit)
    const clothoidW = Math.sin(th) * (1 - 0.24 * (1 - Math.cos(th)) * 0.5);
    const zH = L1_z0 + (L1_zTop - L1_z0) * (1 - Math.cos(th)) * 0.5;
    const vShift = -0.07 + (k / 8) * 0.14;
    add(L1_s + clothoidW * L1_rS, vShift, zH, th, 2);
  }
  add(L1_s + 0.24,  0.09, L1_z0, Math.PI * 2, 0);

  // 20..22: Mid-Course Airtime Hill & Swooping Transition to Loop #2
  add(-0.02,  0.08, 0.36,  Math.PI * 2, 0);
  add( 0.18, -0.04, 0.10,  Math.PI * 2, 0);

  // 23..31: VERTICAL CLOTHOID LOOP #2 (Center-Right, interlocking visual silhouette, z = 0.09 -> 0.70 -> 0.09!)
  const L2_s = 0.44, L2_rS = 0.14, L2_z0 = 0.09, L2_zTop = 0.70;
  for (let k = 0; k <= 8; k++) {
    const th = (k / 8) * Math.PI * 2;
    const clothoidW = Math.sin(th) * (1 - 0.24 * (1 - Math.cos(th)) * 0.5);
    const zH = L2_z0 + (L2_zTop - L2_z0) * (1 - Math.cos(th)) * 0.5;
    const vShift = -0.05 + (k / 8) * 0.14;
    add(L2_s + clothoidW * L2_rS, vShift, zH, Math.PI * 2 + th, 2);
  }
  add(L2_s + 0.24,  0.11, L2_z0, Math.PI * 4, 0);

  // 32..34: High-Speed Turnaround on Far Right feeding into the Front-Left Double Corkscrew
  add( 0.88,  0.04, 0.34,  Math.PI * 4 + 0.85, 0);
  add( 0.94,  0.34, 0.38,  Math.PI * 4 + 0.90, 0);
  add( 0.68,  0.40, 0.18,  Math.PI * 4 + 0.30, 0);

  // 35..44: ICONIC ARROW DOUBLE CORKSCREW BARREL (Front-Left along v = +0.34, s = +0.35 -> -0.58)
  //         Two continuous 360° corkscrew barrel rolls framed by external white steel truss hoops!
  const csStart = 0.34, csEnd = -0.56, csBaseV = 0.34, csRadV = 0.11, csZ0 = 0.14, csZTop = 0.48;
  const csSteps = 12;
  for (let k = 0; k <= csSteps; k++) {
    const f = k / csSteps;
    const phi = f * Math.PI * 4; // 2 full 360-degree corkscrew inversions (720 degrees!)
    const sPos = csStart + (csEnd - csStart) * f;
    const vPos = csBaseV + Math.sin(phi) * csRadV;
    const zPos = csZ0 + (csZTop - csZ0) * (1 - Math.cos(phi)) * 0.5;
    add(sPos, vPos, zPos, Math.PI * 4 + phi, 3);
  }

  // 45..47: Far-Left Turnaround & Final Straight Magnetic Brake Run feeding into Station #0!
  add(-0.88,  0.34, 0.16,  Math.PI * 8 - 0.55, 0);
  add(-0.84,  0.54, 0.12,  Math.PI * 8 - 0.45, 0);
  add(-0.46,  0.54, 0.10,  Math.PI * 8, 4); // Brake Run -> collinear with Station #0 [-0.08, 0.52, 0.08]

  return W;
}

const LOOPER_ANCHORS = buildClassicLooperWaypoints();

function clLayout(R, mode) {
  clLayout._c = clLayout._c || {};
  const key = mode + '|' + R;
  if (clLayout._c[key]) return clLayout._c[key];

  const side = mode === 'side';
  const N = 1120;
  const A = side ? 1.44 * R : 1.02 * R;
  const B = side ? 0.48 * R : 0.36 * R;
  const zsc = 0.94 * Math.min(1.05, A / (1.44 * R) + 0.08);
  const k = side ? 1.0 : 0.90;
  const ax = side ? [1, 0] : [0.706, 0.709];
  const lt = side ? [0, -1] : [0.706, -0.709];
  const hexes = side ? [[-0.866 * R, 0], [0.866 * R, 0]] : [[-0.433 * R, -0.435 * R], [0.433 * R, 0.435 * R]];

  const W = LOOPER_ANCHORS, m = W.length, dense = [];
  const totalBankTurn = Math.PI * 8; // 4 net 360-degree inversions (2 vertical loops + 2 corkscrews)
  const getPt = idx => {
    const wraps = Math.floor(idx / m);
    const baseIdx = ((idx % m) + m) % m;
    const pt = W[baseIdx];
    return [pt[0], pt[1], pt[2], pt[3] + wraps * totalBankTurn, pt[4]];
  };

  for (let i = 0; i < m; i++) {
    const p0 = getPt(i - 1), p1 = getPt(i), p2 = getPt(i + 1), p3 = getPt(i + 2);
    const subSteps = 26;
    for (let q = 0; q < subSteps; q++) {
      const t = q / subSteps, t2 = t * t, t3 = t2 * t;
      const cr = (v0, v1, v2, v3) => 0.5 * ((2 * v1) + (-v0 + v2) * t + (2 * v0 - 5 * v1 + 4 * v2 - v3) * t2 + (-v0 + 3 * v1 - 3 * v2 + v3) * t3);
      const uVal = cr(p0[0], p1[0], p2[0], p3[0]) * A;
      const vVal = -cr(p0[1], p1[1], p2[1], p3[1]) * B;
      const zVal = Math.max(0.05, cr(p0[2], p1[2], p2[2], p3[2])) * zsc * R;
      const bkVal = cr(p0[3], p1[3], p2[3], p3[3]);
      dense.push({
        gx: ax[0] * uVal + lt[0] * vVal,
        gy: ax[1] * uVal + lt[1] * vVal,
        z: zVal,
        bk: bkVal,
        flag: p1[4],
        seg: i + t
      });
    }
  }

  const cum = [0];
  for (let i = 1; i < dense.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(dense[i].gx - dense[i - 1].gx, dense[i].gy - dense[i - 1].gy, (dense[i].z - dense[i - 1].z) * 0.72));
  }
  const last = dense[dense.length - 1];
  const Lt = cum[cum.length - 1] + Math.hypot(dense[0].gx - last.gx, dense[0].gy - last.gy, (dense[0].z - last.z) * 0.72);
  dense.push({
    gx: dense[0].gx,
    gy: dense[0].gy,
    z: dense[0].z,
    bk: dense[0].bk + totalBankTurn,
    flag: dense[0].flag,
    seg: m
  });
  cum.push(Lt);

  const g = [], z = [], bank = [], flagArr = [], segIdx = [];
  let j = 0;
  for (let i = 0; i < N; i++) {
    const d = (i / N) * Lt;
    while (j < cum.length - 2 && cum[j + 1] < d) j++;
    const t = (d - cum[j]) / ((cum[j + 1] - cum[j]) || 1);
    const A0 = dense[j], A1 = dense[j + 1];
    g.push([A0.gx + (A1.gx - A0.gx) * t, A0.gy + (A1.gy - A0.gy) * t]);
    z.push(A0.z + (A1.z - A0.z) * t);
    bank.push(A0.bk + (A1.bk - A0.bk) * t);
    flagArr.push(A0.flag);
    segIdx.push(A0.seg + (A1.seg - A0.seg) * t);
  }

  // Smooth 3D forward tangent & right-hand normal vector
  const n = [];
  for (let i = 0; i < N; i++) {
    const p = g[(i + N - 2) % N], q = g[(i + 2) % N];
    let dx = q[0] - p[0], dy = q[1] - p[1];
    const len = Math.hypot(dx, dy);
    if (len < 1e-4) {
      // At vertical loop apex/nadir where ground projection momentarily pauses, borrow normal from adjacent points
      const pW = g[(i + N - 14) % N], qW = g[(i + 14) % N];
      dx = qW[0] - pW[0];
      dy = qW[1] - pW[1];
    }
    const mLen = Math.hypot(dx, dy) || 1;
    n.push([-dy / mLen, dx / mLen]);
  }

  return (clLayout._c[key] = { N, g, z, bank, n, flagArr, segIdx, hexes, Lt, k, ds: Lt / N, lt, ax, A, B, zsc });
}

function clDraw(ctx, cx, cy, R, op, mode) {
  const accent  = op.accent || '#eab308';
  const supCol  = op.support || '#1e293b';
  const fl      = op.flip ? -1 : 1;
  const L       = clLayout(R, mode), N = L.N, k = L.k, Rk = R * k;
  const hw      = R * 0.0155 * k;   // Half-width of Arrow twin running rails
  const spD     = R * 0.0145 * k;   // Depth of Arrow tubular steel spine pipe

  ctx.save();
  ctx.translate(cx, cy);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const line = (a, b, c, w) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); };
  const poly = (pts, fill, stroke, lw) => {
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = fill; ctx.lineWidth = 0.55; ctx.stroke(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || R * 0.006; ctx.stroke(); }
  };
  const P = i => { i = (i + N) % N; return [L.g[i][0], L.g[i][1] - L.z[i]]; };

  // Precompute 3D banked Arrow track & tubular spine geometry
  const ED = [];
  for (let i = 0; i < N; i++) {
    const p = P(i), n = L.n[i], b = L.bank[i], cb = Math.cos(b), sb = Math.sin(b);
    const lx = n[0] * cb, ly = n[1] * cb - sb;
    const dx = n[0] * sb, dy = n[1] * sb + cb;
    const R1 = [p[0] + lx * hw, p[1] + ly * hw];
    const R2 = [p[0] - lx * hw, p[1] - ly * hw];
    const SP = [p[0] + dx * spD, p[1] + dy * spD];
    ED.push({ p, R1, R2, SP, lx, ly, dx, dy });
  }

  // 1. Soft Continuous Ground Shadow
  ctx.save();
  ctx.translate(fl * R * 0.042, R * 0.030);
  ctx.beginPath();
  L.g.forEach((p, i) => { const z = L.z[i], x = p[0] + fl * z * 0.28, y = p[1] + z * 0.14; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
  ctx.closePath();
  ctx.strokeStyle = 'rgba(12, 20, 32, 0.18)';
  ctx.lineWidth = R * 0.044 * k;
  ctx.stroke();
  ctx.restore();

  const items = [];
  const supHi   = shade(supCol, 0.28);
  const supMid  = supCol;
  const supDark = shade(supCol, -0.35);
  const spDark  = shade(accent, -0.45);
  const spLight = shade(accent, 0.32);

  // =========================================================================
  // 2. CLASSIC ARROW LIFT HILL STEEL LATTICE TRESTLE (Like Loch Ness Monster!)
  // =========================================================================
  const liftPts = [];
  for (let i = 0; i < N; i++) {
    if (L.flagArr[i] === 1 && L.z[i] > R * 0.08) liftPts.push(i);
  }
  const liftStep = Math.max(4, Math.round(R * 0.085 / L.ds));
  for (let idx = 0; idx < liftPts.length - liftStep; idx += liftStep) {
    const i0 = liftPts[idx], i1 = liftPts[idx + liftStep];
    const g0 = L.g[i0], g1 = L.g[i1], n0 = L.n[i0], n1 = L.n[i1];
    const t0 = [ED[i0].SP[0], ED[i0].SP[1]], t1 = [ED[i1].SP[0], ED[i1].SP[1]];
    const wBent = R * 0.032 * k;
    const key = (g0[1] + g1[1]) * 0.5 + (L.z[i0] + L.z[i1]) * 0.5 * 0.05 - 0.012;

    items.push({ k: key, f: () => {
      // Twin-leg steel lattice bent columns at i0
      const bL = [g0[0] - n0[0] * wBent, g0[1] - n0[1] * wBent];
      const bR = [g0[0] + n0[0] * wBent, g0[1] + n0[1] * wBent];
      const pL = [t0[0] - n0[0] * wBent * 0.7, t0[1] - n0[1] * wBent * 0.7];
      const pR = [t0[0] + n0[0] * wBent * 0.7, t0[1] + n0[1] * wBent * 0.7];

      line(bL, pL, supMid, R * 0.014 * k);
      line(bR, pR, supHi,  R * 0.014 * k);
      line(pL, pR, supHi,  R * 0.012 * k);

      // Horizontal & diagonal X-bracing tiers inside the lift bent and between bents
      const nTiers = Math.max(2, Math.floor(L.z[i0] / (R * 0.16 * k)));
      for (let tr = 0; tr < nTiers; tr++) {
        const fA = tr / nTiers, fB = (tr + 1) / nTiers;
        const lA = [bL[0] + (pL[0] - bL[0]) * fA, bL[1] + (pL[1] - bL[1]) * fA];
        const rA = [bR[0] + (pR[0] - bR[0]) * fA, bR[1] + (pR[1] - bR[1]) * fA];
        const lB = [bL[0] + (pL[0] - bL[0]) * fB, bL[1] + (pL[1] - bL[1]) * fB];
        const rB = [bR[0] + (pR[0] - bR[0]) * fB, bR[1] + (pR[1] - bR[1]) * fB];
        line(lB, rB, supMid, R * 0.007 * k);
        line(lA, rB, supHi,  R * 0.005 * k);
        line(rA, lB, supMid, R * 0.005 * k);
      }

      // Longitudinal diagonal lattice struts connecting bent i0 to bent i1
      const mid0 = [g0[0] + (t0[0] - g0[0]) * 0.5, g0[1] + (t0[1] - g0[1]) * 0.5];
      const mid1 = [g1[0] + (t1[0] - g1[0]) * 0.5, g1[1] + (t1[1] - g1[1]) * 0.5];
      line(mid0, mid1, supMid, R * 0.008 * k);
      line(mid0, t1,   supHi,  R * 0.006 * k);
      line(t0,   mid1, supMid, R * 0.006 * k);
    }});
  }

  // =========================================================================
  // 3. SIGNATURE SLANTED A-FRAME LOOP CRADLES (Bracing Vertical Loops #1 & #2)
  // =========================================================================
  [-0.42, 0.44].forEach((loopS, lIdx) => {
    const zTopLoop = (lIdx === 0 ? 0.76 : 0.70) * L.zsc * R;
    const zBrace   = zTopLoop * 0.64;
    const uCenter  = loopS * L.A;
    const vCenter  = (lIdx === 0 ? 0.00 : 0.02) * L.B;

    // Left & Right mid-loop anchor points on the clothoid loop
    const rLoopS = (lIdx === 0 ? 0.14 : 0.13) * L.A;
    const pCradleL = [L.ax[0] * (uCenter - rLoopS) + L.lt[0] * (-vCenter), L.ax[1] * (uCenter - rLoopS) + L.lt[1] * (-vCenter) - zBrace];
    const pCradleR = [L.ax[0] * (uCenter + rLoopS) + L.lt[0] * (-vCenter), L.ax[1] * (uCenter + rLoopS) + L.lt[1] * (-vCenter) - zBrace];

    // Splayed concrete & steel leg footings
    const fSpread = R * 0.24 * k;
    const fDepth  = R * 0.11 * k;
    const gBase   = [L.ax[0] * uCenter + L.lt[0] * (-vCenter), L.ax[1] * uCenter + L.lt[1] * (-vCenter)];
    const footLL  = [gBase[0] - L.ax[0] * fSpread - L.lt[0] * fDepth, gBase[1] - L.ax[1] * fSpread - L.lt[1] * fDepth];
    const footLR  = [gBase[0] - L.ax[0] * fSpread + L.lt[0] * fDepth, gBase[1] - L.ax[1] * fSpread + L.lt[1] * fDepth];
    const footRL  = [gBase[0] + L.ax[0] * fSpread - L.lt[0] * fDepth, gBase[1] + L.ax[1] * fSpread - L.lt[1] * fDepth];
    const footRR  = [gBase[0] + L.ax[0] * fSpread + L.lt[0] * fDepth, gBase[1] + L.ax[1] * fSpread + L.lt[1] * fDepth];

    items.push({ k: gBase[1] + zBrace * 0.05 - 0.006, f: () => {
      [footLL, footLR, footRL, footRR].forEach(ft => {
        ctx.fillStyle = 'rgba(15,23,42,0.32)';
        ctx.beginPath(); ctx.ellipse(ft[0], ft[1] + R * 0.004, R * 0.028 * k, R * 0.012 * k, 0, 0, 7); ctx.fill();
      });
      // Thick slanted Arrow tubular A-frame loop cradle legs!
      line(footLL, pCradleL, supDark, R * 0.024 * k);
      line(footLR, pCradleL, supHi,   R * 0.024 * k);
      line(footRL, pCradleR, supDark, R * 0.024 * k);
      line(footRR, pCradleR, supHi,   R * 0.024 * k);
      // Horizontal tie-beam between the slanted legs
      line(
        [footLR[0] + (pCradleL[0] - footLR[0]) * 0.45, footLR[1] + (pCradleL[1] - footLR[1]) * 0.45],
        [footLL[0] + (pCradleL[0] - footLL[0]) * 0.45, footLL[1] + (pCradleL[1] - footLL[1]) * 0.45],
        supMid, R * 0.012 * k
      );
      line(
        [footRR[0] + (pCradleR[0] - footRR[0]) * 0.45, footRR[1] + (pCradleR[1] - footRR[1]) * 0.45],
        [footRL[0] + (pCradleR[0] - footRL[0]) * 0.45, footRL[1] + (pCradleR[1] - footRL[1]) * 0.45],
        supMid, R * 0.012 * k
      );
    }});
  });

  // =========================================================================
  // 4. STANDARD TUBULAR STEEL COLUMNS FOR CURVES, AIRTIME HILLS & CORKSCREW VALLEYS
  // =========================================================================
  let acc = 0;
  for (let i = 0; i < N; i++) {
    acc += L.ds;
    const flg = L.flagArr[i];
    const zi  = L.z[i];
    // Skip lift hill (handled by lattice trestle), vertical loops, and upper corkscrew arches
    if (flg === 1 || flg === 2 || (flg === 3 && zi > R * 0.22)) continue;
    const sp = (flg === 3 ? R * 0.14 : zi > R * 0.35 ? R * 0.18 : R * 0.25) * k;
    if (acc < sp || zi < R * 0.075) continue;
    acc = 0;

    const gPt = L.g[i], nVec = L.n[i], spPt = ED[i].SP;
    const key = gPt[1] + zi * 0.05 - 0.004;

    items.push({ k: key, f: () => {
      const foot = [gPt[0] + nVec[0] * R * 0.015 * k, gPt[1] + nVec[1] * R * 0.015 * k];
      ctx.fillStyle = 'rgba(15,23,42,0.30)';
      ctx.beginPath(); ctx.ellipse(foot[0], foot[1] + R * 0.003, R * 0.025 * k, R * 0.010 * k, 0, 0, 7); ctx.fill();
      line(foot, spPt, supDark, R * 0.020 * k);
      line([foot[0] - R * 0.003, foot[1]], [spPt[0] - R * 0.003, spPt[1]], supHi, R * 0.009 * k);
    }});
  }

  // =========================================================================
  // 6. ARROW TUBULAR STEEL SPINE, ANGLED CROSSTIE RIBS & TWIN RAILS
  // =========================================================================
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N, ei = ED[i], ej = ED[j];
    const flg = L.flagArr[i];
    const key = L.g[i][1] + L.z[i] * 0.05;

    items.push({ k: key, f: () => {
      // A. Arrow Tubular Steel Spine Pipe (Round shaded backbone underneath rails)
      line(ei.SP, ej.SP, spDark,  R * 0.0145 * k);
      line([ei.SP[0] - R * 0.002, ei.SP[1] - R * 0.002], [ej.SP[0] - R * 0.002, ej.SP[1] - R * 0.002], spLight, R * 0.0055 * k);

      // B. Signature Arrow Angled C-Channel Crosstie Ribs (V-ribs from spine out to R1 & R2!)
      if (i % 2 === 0) {
        line(ei.SP, ei.R1, spDark,  R * 0.0062 * k);
        line(ei.SP, ei.R2, spDark,  R * 0.0062 * k);
        line(ei.SP, ei.R1, accent,  R * 0.0042 * k);
        line(ei.SP, ei.R2, spLight, R * 0.0042 * k);
      }

      // C. Twin Tubular Steel Running Rails with Bright Top Highlight
      line(ei.R1, ej.R1, spDark,  R * 0.0068 * k);
      line(ei.R2, ej.R2, spDark,  R * 0.0068 * k);
      line(ei.R1, ej.R1, accent,  R * 0.0048 * k);
      line(ei.R2, ej.R2, accent,  R * 0.0048 * k);
      line(ei.R1, ej.R1, spLight, R * 0.0020 * k);
      line(ei.R2, ej.R2, spLight, R * 0.0020 * k);

      // D. Lift Hill Chain Trough & Right-Side Steel Catwalk + Handrail
      if (flg === 1) {
        line(ei.p, ej.p, '#0f172a', R * 0.006 * k);
        const cwOff = R * 0.022 * k;
        const cw1 = [ei.R2[0] - ei.lx * cwOff, ei.R2[1] - ei.ly * cwOff];
        const cw2 = [ej.R2[0] - ej.lx * cwOff, ej.R2[1] - ej.ly * cwOff];
        poly([ei.R2, ej.R2, cw2, cw1], '#64748b');
        if (i % 3 === 0) {
          const hr1 = [cw1[0], cw1[1] - R * 0.016 * k];
          const hr2 = [cw2[0], cw2[1] - R * 0.016 * k];
          line(cw1, hr1, '#94a3b8', R * 0.0035 * k);
          line(hr1, hr2, '#cbd5e1', R * 0.0040 * k);
        }
      }

      // E. Brass Magnetic / Skid Brake Fins on Final Brake Run
      if (flg === 4 && i % 2 === 0) {
        line(ei.p, ej.p, '#facc15', R * 0.0065 * k);
      }
    }});
  }

  // =========================================================================
  // 7. CLASSIC BOARDING STATION (Split into Platform below track + Canopy above)
  // =========================================================================
  let stI0 = 0, stI1 = Math.round(0.055 * N);
  for (let i = 0; i < N; i++) {
    if (Math.abs(L.segIdx[i] - 0.15) < 0.08) stI0 = i;
    if (Math.abs(L.segIdx[i] - 1.95) < 0.08) stI1 = i;
  }
  const b = L.lt, g0 = L.g[stI0], g1 = L.g[stI1];
  const stMaxY = Math.max(g0[1], g1[1]), stMinY = Math.min(g0[1], g1[1]);
  const pf = (gx, off, up) => [gx[0] + b[0] * off, gx[1] + b[1] * off - up];
  const wBack = Rk * 0.068, wFront = -Rk * 0.072;
  const zDeck = Rk * 0.022, zEave = Rk * 0.125, zPeak = Rk * 0.165;

  items.push({ k: stMinY - Rk * 0.08, f: () => {
    const dB0 = pf(g0, wBack, zDeck), dB1 = pf(g1, wBack, zDeck);
    const dF1 = pf(g1, wFront, zDeck), dF0 = pf(g0, wFront, zDeck);
    poly([dF0, dF1, [dF1[0], dF1[1] + zDeck], [dF0[0], dF0[1] + zDeck]], '#475569');
    poly([dB0, dB1, dF1, dF0], '#e2e8f0', '#64748b', Rk * 0.006);
    [0.1, 0.5, 0.9].forEach(t => {
      const gx = [g0[0] + (g1[0] - g0[0]) * t, g0[1] + (g1[1] - g0[1]) * t];
      line(pf(gx, wBack * 0.9, zDeck), pf(gx, wBack * 0.9, zEave), '#94a3b8', Rk * 0.011);
    });
  }});

  items.push({ k: stMaxY + Rk * 0.24, f: () => {
    [0.1, 0.5, 0.9].forEach(t => {
      const gx = [g0[0] + (g1[0] - g0[0]) * t, g0[1] + (g1[1] - g0[1]) * t];
      line(pf(gx, wFront * 0.9, zDeck), pf(gx, wFront * 0.9, zEave), '#cbd5e1', Rk * 0.011);
    });
    const rB0 = pf(g0, wBack * 1.05, zEave),  rB1 = pf(g1, wBack * 1.05, zEave);
    const rF0 = pf(g0, wFront * 1.05, zEave), rF1 = pf(g1, wFront * 1.05, zEave);
    const rM0 = pf(g0, 0, zPeak),             rM1 = pf(g1, 0, zPeak);

    poly([rB0, rB1, rM1, rM0], '#cbd5e1', '#64748b', Rk * 0.006);
    poly([rB0, rF0, rM0], '#64748b');
    poly([rB1, rF1, rM1], '#94a3b8');
    poly([rM0, rM1, rF1, rF0], '#f8fafc', '#64748b', Rk * 0.007);
    line(rF0, rF1, accent, Rk * 0.011);
    line(rM0, rM1, accent, Rk * 0.009);
  }});

  // =========================================================================
  // 8. TWO 6-CAR CLASSIC ARROW / SCHWARZKOPF TRAINS (1 on Lift, 1 exiting Loop!)
  // =========================================================================
  const drawClassicCar = (i, isLead) => {
    const idx = (i + N) % N;
    const p = P(idx), pn = P(idx + 2), pp = P(idx - 2);
    let tx = pn[0] - pp[0], ty = pn[1] - pp[1];
    const m = Math.hypot(tx, ty) || 1; tx /= m; ty /= m;
    const ei = ED[idx];
    const c = [p[0] - ei.dx * Rk * 0.011, p[1] - ei.dy * Rk * 0.011];
    const lx = Rk * 0.028, wy = Rk * 0.020;
    const q = (a, bb, dz) => [c[0] + tx * a + ei.lx * bb, c[1] + ty * a + ei.ly * bb + dz];

    items.push({ k: L.g[idx][1] + L.z[idx] * 0.05 + 0.016, f: () => {
      poly([q(-lx, wy, 0), q(lx, wy, 0), q(lx, wy, Rk * 0.012), q(-lx, wy, Rk * 0.012)], '#1e293b');
      poly([q(-lx, -wy, 0), q(lx, -wy, 0), q(lx, wy, 0), q(-lx, wy, 0)], '#f8fafc');
      // Classic Arrow striped racing hood & nose
      poly([q(lx * 0.25, -wy, 0), q(lx, -wy, 0), q(lx, wy, 0), q(lx * 0.25, wy, 0)], isLead ? '#dc2626' : shade(accent, -0.15));
      line(q(-lx * 0.8, 0, -Rk * 0.002), q(lx * 0.9, 0, -Rk * 0.002), '#0284c7', Rk * 0.007);
      // 2-across riders with Over-The-Shoulder restraints
      [-0.45, 0.45].forEach((d, rIdx) => {
        const h = q(-lx * 0.12, d * wy, -Rk * 0.019);
        ctx.fillStyle = ['#ef4444', '#38bdf8', '#22c55e', '#facc15'][(idx + rIdx) % 4];
        ctx.fillRect(h[0] - Rk * 0.008, h[1] + Rk * 0.007, Rk * 0.016, Rk * 0.011);
        ctx.fillStyle = '#fde4c8';
        ctx.beginPath(); ctx.arc(h[0], h[1], Rk * 0.010, 0, 7); ctx.fill();
      });
    }});
  };

  const sp = Math.round(Rk * 0.052 / L.ds);
  [0.145, 0.545].forEach(fh => {
    const ih = Math.round(fh * N);
    for (let cIdx = 0; cIdx < 6; cIdx++) drawClassicCar(ih - cIdx * sp, cIdx === 0);
  });

  items.sort((a, b) => a.k - b.k).forEach(it => it.f());
  ctx.restore();
}

/**
 * 4x HiDPI Supersampled Offscreen Baker for the 2-Hex Classic Looping Coaster
 */
function classicLooperSprite(R, mode, dir, accent, support, scale) {
  classicLooperSprite._c = classicLooperSprite._c || {};
  const dpr = (typeof devicePixelRatio === 'number' && devicePixelRatio > 1) ? devicePixelRatio : 1;
  const sc = scale || Math.max(3.5, Math.min(4.5, dpr * 2.5));
  const sup = support || '#1e293b';
  const key = [mode, dir, R, accent, sup, sc].join('|');
  if (classicLooperSprite._c[key]) return classicLooperSprite._c[key];

  const side = mode === 'side';
  const W = Math.ceil((side ? 3.65 : 2.75) * R);
  const H = Math.ceil((side ? 2.40 : 3.10) * R);
  const oy = (side ? 1.70 : 2.05) * R;
  const cv = document.createElement('canvas');
  cv.width = Math.ceil(W * sc);
  cv.height = Math.ceil(H * sc);
  const g = cv.getContext('2d');
  g.scale(sc, sc);
  g.save();
  g.translate(W / 2, oy);
  if (dir === 'NE-SW') g.scale(-1, 1);
  clDraw(g, 0, 0, R, { accent, support: sup, flip: dir === 'NE-SW' }, mode);
  g.restore();
  return (classicLooperSprite._c[key] = { canvas: cv, ox: W / 2, oy, w: W, h: H });
}

function drawClassicLooperSide(ctx, cx, cy, R, o) {
  o = o || {};
  const s = classicLooperSprite(R, 'side', 'NW-SE', o.accent || '#eab308', o.support || '#1e293b', o.scale);
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(s.canvas, cx - s.ox, cy - s.oy, s.w, s.h);
  ctx.restore();
}

function drawClassicLooperDiag(ctx, cx, cy, R, o) {
  o = o || {};
  const d = o.dir === 'NE-SW' ? 'NE-SW' : 'NW-SE';
  const s = classicLooperSprite(R, 'diag', d, o.accent || '#eab308', o.support || '#1e293b', o.scale);
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(s.canvas, cx - s.ox, cy - s.oy, s.w, s.h);
  ctx.restore();
}
return Object.freeze({ side: drawClassicLooperSide, diag: drawClassicLooperDiag });
})()
});
