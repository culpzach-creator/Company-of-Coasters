/* Depth-sliced Medieval, Gothic, and Bavarian Macro-Land packs. */
const medievalLandMacroPack = (() => {
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

/* ===== MEDIEVAL ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const MSH=(c,x,y,rx)=>{c.fillStyle='rgba(30,42,24,.26)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const MPAL={oak:[['#4f8a3f','#5f9a4a','#3f7a36','#6fa955'],['#5a8f3a','#6ba046','#4a7f32','#7cb054'],['#468a48','#58a055','#38773c','#68b063']],copper:['#7a4a56','#8a5a5a','#6a3f4a','#96666a'],birch:['#9cc060','#86ae4f','#b0d070','#78a444'],apple:['#5f9a4a','#6faa55','#4f8a3f','#80ba62'],willow:['#9bb858','#86a547','#b3c96a','#789a40']};
const MWOOD_D='#4a3220',MPLASTER='#efe6d2',MSTONE='#9a9a92',MSTONE_D='#74746e',MSTONE_L='#b8b8ae';
const MBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.28),shade(col,0.14));
/* half-timbered wall: plaster box with a dark timber frame on the two visible faces */
const MFRAME=(c,x,y,u,x0,x1,y0,y1,z0,z1,plaster,beam,seed)=>{const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(seed);MBOX(c,x,y,u,x0,x1,y0,y1,z0,z1,plaster);const w=u*0.1,n=Math.max(3,Math.round((x1-x0)/0.8)),m=Math.max(2,Math.round((y1-y0)/0.8));
  [z0+0.03,z1-0.03,(z0+z1)/2].forEach(z=>{TH.ln(c,I(x0,y1+0.01,z),I(x1,y1+0.01,z),beam,w);TH.ln(c,I(x1+0.01,y0,z),I(x1+0.01,y1,z),beam,w);});
  for(let k=0;k<=n;k++){const X=x0+(x1-x0)*k/n;TH.ln(c,I(X,y1+0.01,z0),I(X,y1+0.01,z1),beam,w);if(k<n&&r()<0.55){const X2=x0+(x1-x0)*(k+1)/n;TH.ln(c,I(X,y1+0.01,z0),I(X2,y1+0.01,(z0+z1)/2),beam,w*0.8);}}
  for(let k=0;k<=m;k++){const Y=y0+(y1-y0)*k/m;TH.ln(c,I(x1+0.01,Y,z0),I(x1+0.01,Y,z1),beam,w);if(k<m&&r()<0.5){const Y2=y0+(y1-y0)*(k+1)/m;TH.ln(c,I(x1+0.01,Y,z0),I(x1+0.01,Y2,(z0+z1)/2),beam,w*0.8);}}};
const MGABLE=(c,x,y,u,xa,xb,ya,yb,zb,zr,col,colD,ridgeX)=>{const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.poly(c,[I(xb,ya,zb),I(xb,yb,zb),I(ridgeX,yb,zr),I(ridgeX,ya,zr)],col);TH.poly(c,[I(xa,yb,zb),I(xb,yb,zb),I(ridgeX,yb,zr)],colD);};
const MWIN=(c,x,y,u,X,Y,Z,face)=>{const I=(a,b,d)=>TH.iso(x,y,u,a,b,d);if(face==='f'){TH.poly(c,[I(X-0.28,Y,Z),I(X+0.28,Y,Z),I(X+0.28,Y,Z+0.5),I(X-0.28,Y,Z+0.5)],'#31404f',MWOOD_D,u*0.05);TH.ln(c,I(X,Y,Z),I(X,Y,Z+0.5),MWOOD_D,u*0.04);TH.poly(c,[I(X-0.3,Y,Z+0.52),I(X+0.3,Y,Z+0.52),I(X+0.3,Y,Z+0.56),I(X-0.3,Y,Z+0.56)],'#5f3d20');for(let k=0;k<4;k++)TH.ell(c,...I(X-0.2+k*0.14,Y,Z+0.62),u*0.06,u*0.05,['#e86aa8','#f2c230','#d9433b','#f6efe0'][k]);}};
const MROOF=(c,x,y,u,col,colD,w,lines)=>{};
const MEDIEVAL_ASSETS={
  /* ---------- trees ---------- */
  oak:{cat:'tree',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*7+1),H=u*(4.4+r()*1.1),pal=MPAL.oak[v%3];MSH(c,x,y,u*2.3);c.lineCap='round';c.strokeStyle='#5a3f26';c.lineWidth=u*0.8;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.1,y-H*0.35,x+u*0.05,y-H*0.6);c.stroke();TH.poly(c,[[x-u*0.6,y],[x-u*0.25,y-u*0.8],[x+u*0.2,y-u*0.8],[x+u*0.65,y]],'#5a3f26');TH.ln(c,[x-u*0.15,y-H*0.1],[x-u*0.1,y-H*0.55],'#7b5a38',u*0.2);TH.ln(c,[x,y-H*0.5],[x-u*1.2,y-H*0.82],'#5a3f26',u*0.34);TH.ln(c,[x,y-H*0.55],[x+u*1.3,y-H*0.8],'#5a3f26',u*0.32);
    const cy=y-H*0.82;[[0,-0.3,2.0,1.2],[-1.6,-0.1,1.3,1.0],[1.6,-0.1,1.3,1.0],[-0.8,-1.15,1.5,1.0],[0.85,-1.15,1.5,1.0],[0,-1.7,1.2,0.85],[-1.2,0.5,0.9,0.6],[1.2,0.5,0.9,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[(i+(v>>2))%4],r,10));}},
  copperBeech:{cat:'tree',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*5+3),H=u*(4.6+r()*1.0);MSH(c,x,y,u*2.2);TH.ln(c,[x,y],[x,y-H*0.62],'#7a7468',u*0.7);TH.ln(c,[x-u*0.15,y],[x-u*0.1,y-H*0.55],'#9a948a',u*0.16);TH.ln(c,[x,y-H*0.5],[x-u*1.1,y-H*0.82],'#7a7468',u*0.3);TH.ln(c,[x,y-H*0.55],[x+u*1.2,y-H*0.8],'#7a7468',u*0.3);const cy=y-H*0.82;[[0,-0.3,1.9,1.15],[-1.5,-0.1,1.25,0.95],[1.5,-0.1,1.25,0.95],[-0.8,-1.1,1.4,0.95],[0.8,-1.1,1.4,0.95],[0,-1.6,1.1,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,MPAL.copper[i%4],r,10));}},
  elm:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*11+2),H=u*(5.8+r()*1.0),pal=MPAL.oak[(v+1)%3];MSH(c,x,y,u*2.0);TH.ln(c,[x,y],[x,y-H*0.5],'#6a5238',u*0.6);TH.ln(c,[x,y-H*0.4],[x-u*0.8,y-H*0.75],'#6a5238',u*0.3);TH.ln(c,[x,y-H*0.42],[x+u*0.8,y-H*0.78],'#6a5238',u*0.3);const cy=y-H*0.78;[[0,0.4,1.5,1.0],[-1.0,-0.3,1.1,1.1],[1.0,-0.3,1.1,1.1],[0,-1.2,1.5,1.15],[-0.6,-2.1,1.1,0.95],[0.6,-2.1,1.1,0.95],[0,-2.8,0.95,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,10));}},
  poplar:{cat:'tree',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*13+1),H=u*(7+r()*1.6);MSH(c,x,y,u*1.0);TH.ln(c,[x,y],[x,y-u*1.3],'#6a5238',u*0.34);const pal=['#5a8a45','#4a7a3a','#6a9a50','#3f7032'];for(let k=0;k<9;k++){const t=k/8,yy=y-u*1.2-t*(H-u*1.5),rx=u*(0.62+0.42*Math.sin(Math.min(1,t*1.15)*Math.PI*0.85)),ry=u*0.85;TH.blob(c,x+(r()-0.5)*u*0.2,yy,rx,ry,pal[k%4],r,9);}}},
  birch:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*17+4),H=u*(4.4+r()*1.0),pal=MPAL.birch;MSH(c,x,y,u*1.7);c.lineCap='round';c.strokeStyle='#ece8dc';c.lineWidth=u*0.46;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.12,y-H*0.4,x+u*0.05,y-H*0.7);c.stroke();for(let k=0;k<8;k++)TH.ln(c,[x-u*0.2,y-H*(0.06+k*0.08)],[x+u*0.1,y-H*(0.06+k*0.08)+u*0.05],'rgba(40,36,30,.55)',u*0.07);TH.ln(c,[x,y-H*0.55],[x-u*0.8,y-H*0.85],'#ece8dc',u*0.2);TH.ln(c,[x,y-H*0.6],[x+u*0.9,y-H*0.82],'#ece8dc',u*0.2);const cy=y-H*0.85;[[0,-0.5,1.3,1.0],[-1.0,-0.1,1.0,0.85],[1.0,-0.1,1.0,0.85],[-0.5,-1.15,1.0,0.8],[0.6,-1.1,1.0,0.8],[0,0.2,1.2,0.7]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,9));}},
  yew:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*19+2);MSH(c,x,y,u*1.6);TH.ln(c,[x,y],[x,y-u*1.0],'#8a4a30',u*0.55);const cols=['#2f5f4a','#3a6e55','#27523f','#447a5f'];[[0,-2.0,1.2,1.0],[-0.8,-1.3,1.1,0.9],[0.8,-1.3,1.1,0.9],[0,-1.0,1.4,0.85],[0,-2.8,0.8,0.7]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,cols[i%4],r,9));for(let k=0;k<5;k++)TH.ell(c,x+(r()-0.5)*u*1.8,y-u*(1.0+r()*1.6),u*0.07,u*0.07,'#c0392b');}},
  appleTree:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*23+1),H=u*(3.3+r()*0.6),pal=MPAL.apple;MSH(c,x,y,u*1.9);c.lineCap='round';c.strokeStyle='#5a3f26';c.lineWidth=u*0.5;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+u*0.1,y-H*0.4,x,y-H*0.6);c.stroke();TH.ln(c,[x,y-H*0.4],[x-u*0.8,y-H*0.7],'#5a3f26',u*0.22);TH.ln(c,[x,y-H*0.45],[x+u*0.8,y-H*0.72],'#5a3f26',u*0.22);const cy=y-H*0.8;[[0,-0.2,1.6,1.0],[-1.2,0.1,1.0,0.8],[1.2,0.1,1.0,0.8],[-0.5,-0.9,1.0,0.8],[0.6,-0.9,1.0,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,9));for(let k=0;k<9;k++){const ax=x+(r()-0.5)*u*2.6,ay=cy+u*(-0.9+r()*1.7);TH.ell(c,ax,ay,u*0.13,u*0.13,v%2?'#c0392b':'#e8b83a');}}},
  willow:{cat:'tree',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*29+3),H=u*(4.6+r()*0.8),pal=MPAL.willow;MSH(c,x,y,u*2.2);c.lineCap='round';c.strokeStyle='#5f4a30';c.lineWidth=u*0.65;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+u*0.3,y-H*0.4,x-u*0.1,y-H*0.7);c.stroke();const cy=y-H*0.78;[[0,-0.4,1.7,1.0],[-1.2,0,1.2,0.9],[1.2,0,1.2,0.9],[0,-1.0,1.2,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,9));for(let k=0;k<20;k++){const sx=x+(k/19-0.5)*u*3.4,sy=cy+u*0.5+Math.abs(k/19-0.5)*u*0.2,len=u*(1.4+r()*1.6);TH.ln(c,[sx,sy],[sx+(r()-0.5)*u*0.3,Math.min(y-u*0.2,sy+len)],k%2?'#8fb04e':'#a9c466',u*0.1);}}},
  pine:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*3+9),H=u*(5.6+r()*1.0);MSH(c,x,y,u*1.3);TH.ln(c,[x,y],[x,y-H*0.78],'#a8643a',u*0.42);TH.ln(c,[x-u*0.1,y],[x-u*0.1,y-H*0.7],'#c98050',u*0.14);const cols=['#3d6b43','#2f5a38','#4b7a50'];[[0,-0.2,1.4,0.75],[-0.6,-0.9,1.2,0.7],[0.6,-0.95,1.2,0.7],[0,-1.5,0.95,0.65],[-0.3,-2.0,0.7,0.55]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H*0.7+dy*u,u*rx,u*ry,cols[i%3],r,8));}},
  sapling:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*31+3),pal=MPAL.oak[v%3];MSH(c,x,y,u*1.2);TH.ln(c,[x,y],[x,y-u*1.4],'#6a5238',u*0.26);[[0,-2.0,0.95,0.8],[-0.55,-1.5,0.7,0.6],[0.55,-1.5,0.7,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,pal[i%4],r,8));}},
  /* ---------- undergrowth ---------- */
  hedge:{cat:'shrub',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*3+7),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.3,y+u*0.1,u*2.0,u*0.4,'rgba(30,42,24,.22)');const cols=['#4a7f38','#5a9246','#3f7030'];for(let k=0;k<6;k++){const X=-1.5+k*0.6;TH.blob(c,...I(X,0,0.5),u*0.55,u*0.5,cols[k%3],r,8);}for(let k=0;k<8;k++)TH.ell(c,...I(-1.6+r()*3.2,0.2,0.9+r()*0.3),u*0.08,u*0.07,v%2?'#f6efe0':'#e86a8a');}},
  hawthorn:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+9);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(30,42,24,.22)');[[-0.55,-0.45,0.8,0.55],[0.55,-0.45,0.8,0.55],[0,-0.85,0.85,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#5f8f45','#4f7f3a','#6f9f55'][i],r,8));for(let k=0;k<11;k++)TH.ell(c,x+(r()-0.5)*u*1.6,y-u*(0.3+r()*0.9),u*0.1,u*0.09,k%3?'#f6efe0':'#f4b6c6');}},
  roseBush:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*7+2),cols=[['#d9433b','#f06a60'],['#e86aa8','#f4a6cb'],['#f2c230','#fff0a0'],['#f6efe0','#fff8e8']][v%4];TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.28,'rgba(30,42,24,.2)');[[-0.4,-0.4,0.7,0.5],[0.45,-0.4,0.7,0.5],[0,-0.8,0.75,0.55]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#3f7a36','#4f8a42','#346e30'][i],r,8));for(let k=0;k<9;k++){const fx=x+(r()-0.5)*u*1.5,fy=y-u*(0.3+r()*0.9);TH.ell(c,fx,fy,u*0.14,u*0.12,cols[k%2]);}}},
  flowers:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.28,'rgba(30,42,24,.2)');for(let k=0;k<12;k++){const fx=x+(r()-0.5)*u*1.6,fy=y-r()*u*0.5;TH.ln(c,[fx,fy],[fx,fy-u*(0.4+r()*0.4)],'#5f8a45',u*0.06);}for(let k=0;k<13;k++){const fx=x+(r()-0.5)*u*1.6,fy=y-u*(0.5+r()*0.8);TH.ell(c,fx,fy,u*0.13,u*0.11,['#f2c230','#f6efe0','#d9433b','#6a8ae8','#f4a6cb'][k%5]);TH.ell(c,fx,fy,u*0.05,u*0.05,'#fff0a0');}}},
  grassTuft:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);for(let k=0;k<13;k++){const a=-1.1+k/12*2.2+(r()-0.5)*0.2,l=u*(0.7+r()*0.8);TH.ln(c,[x+(r()-0.5)*u*0.6,y],[x+Math.sin(a)*l*0.8+(r()-0.5)*u*0.3,y-l],['#6fa650','#5f9645','#85b85f'][k%3],u*0.09);}}},
  stones:{cat:'rock',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.8,'#9a9a92'],[0.7,0.2,0.8,0.7,'#a8a8a0'],[0,-0.35,0.7,0.6,'#8a8a82']].forEach(([dx,dy,rx,ry,col])=>{const px=x+dx*u,py=y+dy*u,sx=u*rx,sy=u*ry*(1+r()*0.2);TH.ell(c,px+sx*0.15,py+sy*0.3,sx*1.05,sy*0.45,'rgba(30,42,24,.25)');TH.poly(c,[[px-sx,py],[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px-sx*0.6,py+sy*0.2]],col);TH.poly(c,[[px+sx*0.25,py-sy*0.98],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px+sx*0.2,py+sy*0.05]],shade(col,-0.25));TH.poly(c,[[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.1,py-sy*0.5],[px-sx*0.5,py-sy*0.45]],'#6f9a4a');});}},
  stoneWall:{cat:'rock',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*7+2),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.5,y+u*0.12,u*2.4,u*0.4,'rgba(30,42,24,.24)');MBOX(c,x,y,u,-2.0,2.0,-0.3,0.3,0,0.8,'#a2a29a');for(let row=0;row<3;row++)for(let k=0;k<9;k++){const X=-1.9+k*0.44+(row%2)*0.22;TH.ln(c,I(X,0.31,0.1+row*0.26),I(X+0.38,0.31,0.1+row*0.26),'rgba(40,40,36,.35)',u*0.05);TH.ln(c,I(X,0.31,0.1+row*0.26),I(X,0.31,0.3+row*0.26),'rgba(40,40,36,.3)',u*0.05);}for(let k=0;k<6;k++)TH.blob(c,...I(-1.8+r()*3.6,0,0.85),u*0.3,u*0.2,'#6f9a4a',r,6);}},
  /* ---------- hills ---------- */
  rollingHill:{cat:'rock',rho:0.2,draw(c,x,y,u,v){const r=mulberry(v*7+8),H=u*(4.4+r()*1.8),w=u*(3.8+r()*0.9);TH.ell(c,x+u*0.8,y+u*0.25,w*1.3,u*0.7,'rgba(30,42,24,.22)');
    c.save();c.translate(x,y);c.beginPath();c.moveTo(-w*1.35,0);c.bezierCurveTo(-w*1.1,-H*0.85,-w*0.45,-H*1.1,0,-H);c.bezierCurveTo(w*0.45,-H*1.05,w*1.1,-H*0.8,w*1.35,0);c.closePath();c.fillStyle='#86ad5e';c.fill();c.clip();
    const cols=['#8fb665','#7ea556','#9bc070','#76a050'];for(let k=0;k<7;k++){const y0=-H*1.1+k*H*0.2;c.fillStyle=cols[k%4];c.globalAlpha=0.55;c.beginPath();c.moveTo(-w*1.5,y0+w*0.15);c.lineTo(w*1.5,y0-w*0.15);c.lineTo(w*1.5,y0+H*0.2-w*0.15);c.lineTo(-w*1.5,y0+H*0.2+w*0.15);c.closePath();c.fill();}c.globalAlpha=1;
    for(let k=0;k<5;k++){const y0=-H*(0.2+k*0.17);TH.ln(c,[-w*1.4,y0+w*0.15],[w*1.4,y0-w*0.15],'rgba(46,92,38,.55)',u*0.12);}
    const g=c.createLinearGradient(-w*1.3,0,w*1.3,0);g.addColorStop(0,'rgba(220,240,160,.2)');g.addColorStop(0.5,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(20,50,22,.38)');c.fillStyle=g;c.fillRect(-w*1.4,-H*1.2,w*2.8,H*1.3);
    for(let k=0;k<9;k++){const t=Math.pow(r(),0.7),yy=-H*(0.1+t*0.8),span=w*(1.2-t*0.9),xx=(r()*2-1)*span,rr=u*(0.32+r()*0.22);c.fillStyle=['#3f7a36','#4f8a42','#346e30'][k%3];c.beginPath();c.ellipse(xx,yy,rr,rr*0.8,0,0,7);c.fill();}c.restore();}},
  woodedHill:{cat:'rock',rho:0.2,draw(c,x,y,u,v){const r=mulberry(v*5+6),H=u*(4.8+r()*1.6),w=u*(3.5+r()*0.8);TH.ell(c,x+u*0.8,y+u*0.25,w*1.3,u*0.7,'rgba(30,42,24,.22)');
    c.save();c.translate(x,y);c.beginPath();c.moveTo(-w*1.3,0);c.bezierCurveTo(-w*1.1,-H*0.85,-w*0.45,-H*1.1,0,-H);c.bezierCurveTo(w*0.45,-H*1.05,w*1.1,-H*0.8,w*1.3,0);c.closePath();c.fillStyle='#4f8a42';c.fill();c.clip();
    const g=c.createLinearGradient(-w*1.3,0,w*1.3,0);g.addColorStop(0,'rgba(200,235,150,.18)');g.addColorStop(0.5,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,40,20,.45)');c.fillStyle=g;c.fillRect(-w*1.4,-H*1.2,w*2.8,H*1.3);
    for(let k=0;k<44;k++){const t=Math.pow(r(),0.85),yy=-H*(0.03+t*0.93),span=w*(1.3-Math.pow(t,1.4)*1.05),xx=(r()*2-1)*span,rr=u*(0.5+r()*0.4);c.fillStyle=['#3f7a36','#4f8a42','#5f9a4a','#346e30','#6fa955'][Math.floor(r()*5)];c.beginPath();c.ellipse(xx,yy,rr,rr*0.8,0,0,7);c.fill();if(r()<0.5){c.fillStyle='rgba(200,240,150,.3)';c.beginPath();c.ellipse(xx-rr*0.25,yy-rr*0.3,rr*0.5,rr*0.3,0,0,7);c.fill();}}c.restore();}},
  crag:{cat:'rock',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*9+2),H=u*(3.4+r()*1.4),w=u*(2.0+r()*0.5);TH.ell(c,x+u*0.7,y+u*0.2,w*1.4,u*0.5,'rgba(30,42,24,.25)');const bands=['#b4b2a2','#a4a294','#c0beae','#98978a'];for(let i=0;i<4;i++){const t0=i/4,t1=(i+1)/4,j0=(r()-0.5)*u*0.4,j1=(r()-0.5)*u*0.4;TH.poly(c,[[x-w+j0,y-H*t0],[x+w+j1,y-H*t0],[x+w*0.92+j1,y-H*t1],[x-w*0.92+j0,y-H*t1]],bands[i%4]);TH.poly(c,[[x+w*0.2,y-H*t0],[x+w+j1,y-H*t0],[x+w*0.92+j1,y-H*t1],[x+w*0.2,y-H*t1]],'rgba(40,40,30,.26)');}
    TH.poly(c,[[x-w*0.95,y-H],[x+w*0.9,y-H],[x+w*0.65,y-H-u*0.5],[x-w*0.65,y-H-u*0.5]],'#7aa855');for(let k=0;k<4;k++)TH.blob(c,x+(r()*2-1)*w*0.7,y-H-u*0.3,u*0.55,u*0.4,['#4f8a42','#5f9a4a'][k%2],r,7);for(let k=0;k<3;k++)TH.ln(c,[x+(r()*2-1)*w*0.8,y-H*0.98],[x+(r()*2-1)*w*0.8,y-H*(0.5+r()*0.3)],'#4f8a42',u*0.1);}},
  /* ---------- cottages and a single small tower (sprinkled) ---------- */
  timberHouse:{cat:'struct',rho:0.13,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),tile=v%2===0,rc=tile?'#b5553a':'#c9a85a',rd=tile?'#8a3f28':'#a2823a';
    MFRAME(c,x,y,u,-1.6,1.6,-1.1,1.1,0,1.4,MPLASTER,MWOOD_D,v+1);MFRAME(c,x,y,u,-1.75,1.75,-1.25,1.25,1.4,2.5,MPLASTER,MWOOD_D,v+4);
    TH.poly(c,[I(-0.35,1.12,0),I(0.35,1.12,0),I(0.35,1.12,1.2),I(-0.35,1.12,1.2)],'#4a2f18','#2a1a10',u*0.05);MWIN(c,x,y,u,-1.15,1.12,0.45,'f');MWIN(c,x,y,u,1.1,1.12,0.45,'f');MWIN(c,x,y,u,-0.7,1.27,1.7,'f');MWIN(c,x,y,u,0.7,1.27,1.7,'f');
    MGABLE(c,x,y,u,-1.95,1.95,-1.45,1.45,2.5,3.9,rc,rd,0);for(let k=1;k<7;k++)TH.ln(c,I(1.95-0.325*k,-1.45,2.5+0.2*k),I(1.95-0.325*k,1.45,2.5+0.2*k),'rgba(30,15,5,.3)',u*0.05);
    TH.ln(c,I(-1.95,1.46,2.5),I(0,1.46,3.9),MWOOD_D,u*0.12);TH.ln(c,I(1.95,1.46,2.5),I(0,1.46,3.9),MWOOD_D,u*0.12);MBOX(c,x,y,u,1.0,1.5,-0.9,-0.4,2.9,4.3,'#9a5a44');TH.ell(c,...I(1.25,-0.65,4.35),u*0.3,u*0.14,'#3a2a24');TH.ell(c,I(1.25,-0.65,4.9)[0],I(1.25,-0.65,4.9)[1],u*0.35,u*0.2,'rgba(235,235,240,.5)');}},
  stoneHouse:{cat:'struct',rho:0.13,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v*5+1);MBOX(c,x,y,u,-1.7,1.7,-1.2,1.2,0,2.2,'#a8a89c');
    for(let row=0;row<7;row++)for(let k=0;k<8;k++){const X=-1.65+k*0.43+(row%2)*0.2,Z=0.1+row*0.3;TH.ln(c,I(X,1.21,Z),I(X+0.38,1.21,Z),'rgba(40,40,32,.34)',u*0.05);TH.ln(c,I(X,1.21,Z),I(X,1.21,Z+0.3),'rgba(40,40,32,.28)',u*0.05);}for(let row=0;row<7;row++)for(let k=0;k<6;k++){const Y=-1.15+k*0.4+(row%2)*0.18,Z=0.1+row*0.3;TH.ln(c,I(1.71,Y,Z),I(1.71,Y+0.36,Z),'rgba(30,30,24,.3)',u*0.05);}
    c.beginPath();const d0=I(-0.4,1.22,0),d1=I(0.4,1.22,0),dt=I(0,1.22,1.5);c.moveTo(d0[0],d0[1]);c.lineTo(I(-0.4,1.22,1.0)[0],I(-0.4,1.22,1.0)[1]);c.quadraticCurveTo(dt[0],dt[1]-u*0.35,I(0.4,1.22,1.0)[0],I(0.4,1.22,1.0)[1]);c.lineTo(d1[0],d1[1]);c.closePath();c.fillStyle='#4a2f18';c.fill();c.strokeStyle='#6a6a62';c.lineWidth=u*0.1;c.stroke();
    [[-1.2,0.8],[1.0,0.8],[-0.1,1.55]].forEach(([X,Z],i)=>{if(i<2)TH.poly(c,[I(X-0.2,1.22,Z),I(X+0.2,1.22,Z),I(X+0.2,1.22,Z+0.55),I(X-0.2,1.22,Z+0.55)],'#26303c','#6a6a62',u*0.05);});
    TH.poly(c,[I(2.0,-1.5,2.2),I(2.0,1.5,2.2),I(0,1.5,3.5),I(0,-1.5,3.5)],'#6a7078');for(let k=1;k<8;k++)TH.ln(c,I(2.0-0.25*k,-1.5,2.2+0.16*k),I(2.0-0.25*k,1.5,2.2+0.16*k),'rgba(20,24,30,.35)',u*0.05);TH.poly(c,[I(-2.0,1.5,2.2),I(2.0,1.5,2.2),I(0,1.5,3.5)],'#a8a89c');MBOX(c,x,y,u,0.7,1.3,-0.9,-0.3,2.8,4.4,'#8d8d84');TH.ell(c,...I(1.0,-0.6,4.5),u*0.34,u*0.16,'#3a3a34');TH.ell(c,I(1.0,-0.6,5.0)[0],I(1.0,-0.6,5.0)[1],u*0.4,u*0.22,'rgba(235,235,240,.5)');}},
  thatchHouse:{cat:'struct',rho:0.12,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v*3+2);MFRAME(c,x,y,u,-1.5,1.5,-1.0,1.0,0,1.3,MPLASTER,MWOOD_D,v+7);
    TH.poly(c,[I(-0.3,1.02,0),I(0.3,1.02,0),I(0.3,1.02,1.05),I(-0.3,1.02,1.05)],'#4a2f18','#2a1a10',u*0.05);MWIN(c,x,y,u,-1.0,1.02,0.4,'f');MWIN(c,x,y,u,1.0,1.02,0.4,'f');
    const roof=[I(1.8,-1.3,1.15),I(1.8,1.3,1.15),I(0.9,1.3,2.5),I(-0.9,1.3,2.5),I(-1.8,1.3,1.15)];TH.poly(c,[I(1.8,-1.3,1.15),I(1.8,1.3,1.15),I(0,1.3,3.0),I(0,-1.3,3.0)],'#c9a85a');TH.poly(c,[I(-1.8,1.3,1.15),I(1.8,1.3,1.15),I(0,1.3,3.0)],'#a2823a');
    for(let k=1;k<9;k++)TH.ln(c,I(1.8-0.2*k,-1.3,1.15+0.23*k),I(1.8-0.2*k,1.3,1.15+0.23*k),'rgba(120,90,30,.45)',u*0.07);for(let k=0;k<9;k++){const t=k/8,p=I(-1.8+3.6*t,1.31,1.15+0*t);TH.ell(c,p[0],p[1]+u*0.05,u*0.22,u*0.12,'#b8943f');}TH.ln(c,I(0,1.31,3.0),I(0,-1.3,3.0),'#8a6a2a',u*0.14);MBOX(c,x,y,u,0.8,1.3,-0.8,-0.3,2.2,3.5,'#9a9a92');TH.ell(c,I(1.05,-0.55,3.6)[0],I(1.05,-0.55,3.6)[1],u*0.3,u*0.14,'#3a3a34');TH.ell(c,I(1.05,-0.55,4.1)[0],I(1.05,-0.55,4.1)[1],u*0.35,u*0.2,'rgba(235,235,240,.5)');}},
  bellTower:{cat:'struct',rho:0.07,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);MBOX(c,x,y,u,-1.15,1.15,-1.15,1.15,0,4.4,'#a8a89c');for(let row=0;row<14;row++){const Z=0.1+row*0.3;for(let k=0;k<5;k++){const X=-1.1+k*0.46+(row%2)*0.2;TH.ln(c,I(X,1.16,Z),I(X+0.4,1.16,Z),'rgba(40,40,32,.3)',u*0.05);}}
    TH.poly(c,[I(-0.2,1.17,0),I(0.2,1.17,0),I(0.2,1.17,0.9),I(-0.2,1.17,0.9)],'#4a2f18');TH.poly(c,[I(-0.12,1.17,2.0),I(0.12,1.17,2.0),I(0.12,1.17,2.7),I(-0.12,1.17,2.7)],'#26303c');
    MBOX(c,x,y,u,-1.3,1.3,-1.3,1.3,4.4,4.6,'#8d8d84');MBOX(c,x,y,u,-1.0,1.0,-1.0,1.0,4.6,6.0,'#b8b8ae');[-0.45,0.45].forEach(X=>TH.poly(c,[I(X-0.3,1.01,4.7),I(X+0.3,1.01,4.7),I(X+0.3,1.01,5.6),I(X,1.01,5.9),I(X-0.3,1.01,5.6)],'#2a2420'));TH.ell(c,...I(0,1.0,5.1),u*0.16,u*0.2,'#c9a640');
    const b=I(0,0,6.0),t=I(0,0,8.6);TH.poly(c,[[b[0]-u*1.55,b[1]+u*0.2],[b[0]+u*1.55,b[1]+u*0.2],[t[0]+u*0.1,t[1]]],'#6a7078');TH.poly(c,[[b[0]+u*0.1,b[1]+u*0.2],[b[0]+u*1.55,b[1]+u*0.2],[t[0]+u*0.1,t[1]]],'#4a5058');TH.ln(c,[t[0]+u*0.1,t[1]],[t[0]+u*0.1,t[1]-u*0.7],'#c9a640',u*0.1);TH.poly(c,[[t[0]+u*0.1,t[1]-u*0.7],[t[0]+u*0.7,t[1]-u*0.55],[t[0]+u*0.1,t[1]-u*0.4]],'#b5362b');}},
  well:{cat:'struct',rho:0.05,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.6,y+u*0.14,u*1.7,u*0.5,'rgba(30,42,24,.25)');const rx=u*0.95,ry=u*0.42;c.fillStyle='#8d8d84';c.beginPath();c.moveTo(x-rx,y);c.lineTo(x-rx,y-u*0.95);c.ellipse(x,y-u*0.95,rx,ry,0,Math.PI,0,true);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI);c.closePath();c.fill();c.fillStyle='#a8a89c';c.beginPath();c.moveTo(x-rx,y);c.lineTo(x-rx,y-u*0.95);c.lineTo(x-rx*0.1,y-u*0.95+ry*0.99);c.lineTo(x-rx*0.1,y+ry*0.99);c.closePath();c.fill();for(let k=0;k<5;k++)TH.ln(c,[x-rx+k*rx*0.4,y-u*0.1+Math.sin(k)*ry*0.3],[x-rx+k*rx*0.4,y-u*0.85],'rgba(40,40,32,.25)',u*0.05);TH.ell(c,x,y-u*0.95,rx,ry,'#74746e');TH.ell(c,x,y-u*0.95,rx*0.78,ry*0.7,'#2a5a78');
    [-1,1].forEach(s=>TH.ln(c,[x+s*rx*0.85,y-u*0.8],[x+s*rx*0.85,y-u*2.6],'#5f3d20',u*0.18));TH.ln(c,[x-rx*0.85,y-u*2.5],[x+rx*0.85,y-u*2.5],'#5f3d20',u*0.14);TH.poly(c,[[x-rx*1.2,y-u*2.5],[x+rx*1.2,y-u*2.5],[x,y-u*3.5]],'#b5553a');TH.ln(c,[x,y-u*2.5],[x,y-u*1.4],'#3a3a34',u*0.05);TH.poly(c,[[x-u*0.18,y-u*1.4],[x+u*0.18,y-u*1.4],[x+u*0.14,y-u*1.0],[x-u*0.14,y-u*1.0]],'#8a5a33');}},
  /* ---------- small props (lower tiers only) ---------- */
  haybale:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.3,u*0.4,'rgba(30,42,24,.2)');TH.box(c,x,y,u,-0.9,0.1,-0.6,0.6,0,0.9,'#e0c26a','#b89a45','#f0d77a');TH.box(c,x,y,u,0.2,1.2,-0.6,0.6,0,0.9,'#e0c26a','#b89a45','#f0d77a');TH.box(c,x,y,u,-0.4,0.7,-0.5,0.5,0.9,1.8,'#e0c26a','#b89a45','#f0d77a');[-0.4,0.4].forEach(X=>TH.ln(c,I(X,0.61,0.9),I(X,0.61,1.7),'#8a7030',u*0.05));}},
  barrels:{cat:'prop',rho:0.05,draw(c,x,y,u,v){const bar=(bx,by,s)=>{const w=u*0.5*s,h=u*0.95*s;TH.ell(c,bx+w*0.5,by+w*0.2,w*1.3,w*0.4,'rgba(30,42,24,.2)');TH.ell(c,bx,by,w,w*0.4,'#5a3b22');c.fillStyle='#8a5a33';c.beginPath();c.moveTo(bx-w,by);c.quadraticCurveTo(bx-w*1.12,by-h*0.5,bx-w,by-h);c.lineTo(bx+w,by-h);c.quadraticCurveTo(bx+w*1.12,by-h*0.5,bx+w,by);c.ellipse(bx,by,w,w*0.4,0,0,Math.PI);c.fill();[0.2,0.8].forEach(f=>TH.ln(c,[bx-w*1.04,by-h*f],[bx+w*1.04,by-h*f],'#3a3f4a',u*0.08));TH.ell(c,bx,by-h,w,w*0.4,'#a97d49');};bar(x-u*0.6,y,1);bar(x+u*0.55,y+u*0.1,0.95);bar(x,y-u*0.15,0.9);}},
  cart:{cat:'prop',rho:0.08,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.5,y+u*0.12,u*2.0,u*0.55,'rgba(30,42,24,.22)');TH.box(c,x,y,u,-1.3,1.0,-0.7,0.7,0.5,0.8,'#8a5a33','#6a4426','#a8764a');for(let k=0;k<2;k++){const Y=k?0.71:-0.71;TH.poly(c,[I(-1.3,Y,0.8),I(1.0,Y,0.8),I(1.0,Y,1.3),I(-1.3,Y,1.3)],k?'#8a5a33':'#6a4426');}TH.blob(c,...I(-0.15,0,1.55),u*1.3,u*0.6,'#e0c26a',mulberry(v+3),9);const wheel=(X,Y)=>{const p=I(X,Y,0.5);c.strokeStyle='#4a3220';c.lineWidth=u*0.14;c.beginPath();c.ellipse(p[0],p[1],u*0.55,u*0.55,0,0,7);c.stroke();for(let k=0;k<6;k++){const a=k/6*6.283;TH.ln(c,[p[0],p[1]],[p[0]+Math.cos(a)*u*0.5,p[1]+Math.sin(a)*u*0.5],'#4a3220',u*0.06);}};wheel(0.4,0.8);wheel(-0.7,0.8);TH.ln(c,I(1.0,0,0.7),I(2.0,0.1,0.55),'#5f3d20',u*0.16);}},
  bannerString:{cat:'prop',rho:0.12,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*2.4,u*0.4,'rgba(30,42,24,.14)');[-2.2,2.2].forEach(X=>TH.ln(c,I(X,0,0),I(X,0,3.4),'#6a4a2a',u*0.18));const cols=['#b5362b','#2a5aa8','#f2c230','#f6efe0','#2f7a3a'];let prev=null;for(let k=0;k<=10;k++){const X=-2.2+4.4*k/10,p=I(X,0,3.3-Math.sin(k/10*Math.PI)*0.7);if(prev)TH.ln(c,prev,p,'#d9d4c2',u*0.04);prev=p;if(k<10){const q=I(X+0.2,0,3.3-Math.sin((k+0.5)/10*Math.PI)*0.7);TH.poly(c,[[q[0]-u*0.22,q[1]],[q[0]+u*0.22,q[1]],[q[0]+u*0.22,q[1]+u*0.45],[q[0],q[1]+u*0.65],[q[0]-u*0.22,q[1]+u*0.45]],cols[k%5]);}}}},
  lanternPost:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(30,42,24,.25)');TH.ln(c,[x,y],[x,y-u*3.0],'#2a2d36',u*0.2);TH.ln(c,[x,y-u*2.85],[x+u*0.55,y-u*2.85],'#2a2d36',u*0.12);const lx=x+u*0.55,ly=y-u*2.8,g=c.createRadialGradient(lx,ly-u*0.3,0,lx,ly-u*0.3,u*1.4);g.addColorStop(0,'rgba(255,215,130,.5)');g.addColorStop(1,'rgba(255,215,130,0)');c.fillStyle=g;c.beginPath();c.arc(lx,ly-u*0.3,u*1.4,0,7);c.fill();TH.poly(c,[[lx-u*0.25,ly],[lx+u*0.25,ly],[lx+u*0.2,ly-u*0.6],[lx-u*0.2,ly-u*0.6]],'#ffe9a8','#2a2d36',u*0.06);TH.poly(c,[[lx-u*0.3,ly-u*0.6],[lx+u*0.3,ly-u*0.6],[lx,ly-u*0.9]],'#2a2d36');}},
  woodFence:{cat:'prop',rho:0.09,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.3,y+u*0.1,u*2.0,u*0.35,'rgba(30,42,24,.16)');for(let k=0;k<4;k++){const X=-1.8+k*1.2;TH.ln(c,I(X,0,0),I(X,0,1.3),'#5f3d20',u*0.2);}[0.45,0.95].forEach(z=>TH.ln(c,I(-1.8,0,z),I(1.8,0,z),'#a67a48',u*0.15));}}
};

/* ---- eave-front versions of the three cottages: the long wall (with the door) faces the viewer and the gable end shows at the side ---- */
const MEAVE={
  timberHouse(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),tile=v%2===0,rc=tile?'#b5553a':'#c9a85a',rd=tile?'#8a3f28':'#a2823a';
    MFRAME(c,x,y,u,-2.0,2.0,-1.1,1.1,0,1.4,MPLASTER,MWOOD_D,v+1);MFRAME(c,x,y,u,-2.15,2.15,-1.25,1.25,1.4,2.5,MPLASTER,MWOOD_D,v+4);
    TH.poly(c,[I(-0.35,1.12,0),I(0.35,1.12,0),I(0.35,1.12,1.2),I(-0.35,1.12,1.2)],'#4a2f18','#2a1a10',u*0.05);[-1.3,1.3].forEach(X=>MWIN(c,x,y,u,X,1.12,0.45,'f'));[-1.3,0,1.3].forEach(X=>MWIN(c,x,y,u,X,1.27,1.7,'f'));
    MBOX(c,x,y,u,-1.5,-1.0,-0.6,-0.1,3.0,4.6,'#9a5a44');TH.ell(c,...I(-1.25,-0.35,4.65),u*0.3,u*0.14,'#3a2a24');TH.ell(c,I(-1.25,-0.35,5.2)[0],I(-1.25,-0.35,5.2)[1],u*0.35,u*0.2,'rgba(235,235,240,.5)');
    TH.poly(c,[I(-2.45,1.65,2.5),I(2.45,1.65,2.5),I(2.45,0,3.9),I(-2.45,0,3.9)],rc);for(let k=1;k<7;k++)TH.ln(c,I(-2.45,1.65-0.2357*k,2.5+0.2*k),I(2.45,1.65-0.2357*k,2.5+0.2*k),'rgba(30,15,5,.3)',u*0.05);
    TH.poly(c,[I(2.45,-1.65,2.5),I(2.45,1.65,2.5),I(2.45,0,3.9)],rd);TH.ln(c,I(2.46,-1.65,2.5),I(2.46,0,3.9),MWOOD_D,u*0.12);TH.ln(c,I(2.46,1.65,2.5),I(2.46,0,3.9),MWOOD_D,u*0.12);TH.ln(c,I(-2.45,0,3.9),I(2.45,0,3.9),MWOOD_D,u*0.1);},
  stoneHouse(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);MBOX(c,x,y,u,-2.0,2.0,-1.2,1.2,0,2.2,'#a8a89c');
    for(let row=0;row<7;row++)for(let k=0;k<9;k++){const X=-1.95+k*0.45+(row%2)*0.2,Z=0.1+row*0.3;TH.ln(c,I(X,1.21,Z),I(X+0.4,1.21,Z),'rgba(40,40,32,.34)',u*0.05);TH.ln(c,I(X,1.21,Z),I(X,1.21,Z+0.3),'rgba(40,40,32,.28)',u*0.05);}
    for(let row=0;row<7;row++)for(let k=0;k<6;k++){const Y=-1.15+k*0.4+(row%2)*0.18,Z=0.1+row*0.3;TH.ln(c,I(2.01,Y,Z),I(2.01,Y+0.36,Z),'rgba(30,30,24,.3)',u*0.05);}
    c.beginPath();const d0=I(-0.4,1.22,0),d1=I(0.4,1.22,0),dt=I(0,1.22,1.5);c.moveTo(d0[0],d0[1]);c.lineTo(I(-0.4,1.22,1.0)[0],I(-0.4,1.22,1.0)[1]);c.quadraticCurveTo(dt[0],dt[1]-u*0.35,I(0.4,1.22,1.0)[0],I(0.4,1.22,1.0)[1]);c.lineTo(d1[0],d1[1]);c.closePath();c.fillStyle='#4a2f18';c.fill();c.strokeStyle='#6a6a62';c.lineWidth=u*0.1;c.stroke();
    [-1.3,1.3].forEach(X=>TH.poly(c,[I(X-0.2,1.22,0.8),I(X+0.2,1.22,0.8),I(X+0.2,1.22,1.4),I(X-0.2,1.22,1.4)],'#26303c','#6a6a62',u*0.05));[-1.3,1.3].forEach(X=>TH.poly(c,[I(X-0.2,1.22,1.55),I(X+0.2,1.22,1.55),I(X+0.2,1.22,2.0),I(X-0.2,1.22,2.0)],'#26303c','#6a6a62',u*0.05));
    MBOX(c,x,y,u,1.4,1.95,-0.3,0.3,2.4,4.3,'#8d8d84');TH.ell(c,...I(1.67,0,4.4),u*0.34,u*0.16,'#3a3a34');TH.ell(c,I(1.67,0,4.95)[0],I(1.67,0,4.95)[1],u*0.4,u*0.22,'rgba(235,235,240,.5)');
    TH.poly(c,[I(-2.3,1.6,2.2),I(2.3,1.6,2.2),I(2.3,0,3.5),I(-2.3,0,3.5)],'#6a7078');for(let k=1;k<8;k++)TH.ln(c,I(-2.3,1.6-0.2*k,2.2+0.1625*k),I(2.3,1.6-0.2*k,2.2+0.1625*k),'rgba(20,24,30,.35)',u*0.05);
    TH.poly(c,[I(2.0,-1.2,2.2),I(2.0,1.2,2.2),I(2.0,0,3.5)],'#a8a89c');for(let k=0;k<4;k++)TH.ln(c,I(2.01,-1.0+k*0.3,2.3+k*0.05),I(2.01,0.9-k*0.3,2.3+k*0.05),'rgba(40,40,32,.3)',u*0.05);TH.ln(c,I(2.31,-1.6,2.2),I(2.31,0,3.5),'#5a6068',u*0.1);TH.ln(c,I(2.31,1.6,2.2),I(2.31,0,3.5),'#5a6068',u*0.1);},
  thatchHouse(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);MFRAME(c,x,y,u,-2.0,2.0,-1.0,1.0,0,1.3,MPLASTER,MWOOD_D,v+7);
    TH.poly(c,[I(-0.3,1.02,0),I(0.3,1.02,0),I(0.3,1.02,1.05),I(-0.3,1.02,1.05)],'#4a2f18','#2a1a10',u*0.05);[-1.3,1.3].forEach(X=>MWIN(c,x,y,u,X,1.02,0.4,'f'));
    MBOX(c,x,y,u,-1.5,-1.0,-0.5,0.0,2.3,3.5,'#9a9a92');TH.ell(c,I(-1.25,-0.25,3.6)[0],I(-1.25,-0.25,3.6)[1],u*0.3,u*0.14,'#3a3a34');TH.ell(c,I(-1.25,-0.25,4.1)[0],I(-1.25,-0.25,4.1)[1],u*0.35,u*0.2,'rgba(235,235,240,.5)');
    TH.poly(c,[I(-2.3,1.5,1.15),I(2.3,1.5,1.15),I(2.3,0,3.0),I(-2.3,0,3.0)],'#c9a85a');for(let k=1;k<9;k++)TH.ln(c,I(-2.3,1.5-0.1667*k,1.15+0.2056*k),I(2.3,1.5-0.1667*k,1.15+0.2056*k),'rgba(120,90,30,.45)',u*0.07);for(let k=0;k<10;k++){const t=k/9,p=I(-2.3+4.6*t,1.51,1.15);TH.ell(c,p[0],p[1]+u*0.05,u*0.22,u*0.12,'#b8943f');}
    TH.poly(c,[I(2.3,-1.5,1.15),I(2.3,1.5,1.15),I(2.3,0,3.0)],'#a2823a');for(let k=1;k<6;k++)TH.ln(c,I(2.31,-1.5+0.25*k,1.2+0.1*k),I(2.31,1.5-0.25*k,1.2+0.1*k),'rgba(100,70,20,.4)',u*0.05);TH.ln(c,I(-2.3,0,3.0),I(2.3,0,3.0),'#8a6a2a',u*0.14);}
};
/* orientation: v&3 -> bit0 mirrors left/right, bit1 chooses gable-front (0) or eave-front (1); v>>2 stays the random seed for roofs and timbers */
(function(){const flipWrap=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
  const shadow=(c,x,y,u,w,h)=>TH.ell(c,x+u*0.8,y+u*0.2,u*w,u*h,'rgba(30,42,24,.25)');
  ['timberHouse','stoneHouse','thatchHouse'].forEach(k=>{const gable=MEDIEVAL_ASSETS[k].draw,eave=MEAVE[k],sw=k==='thatchHouse'?2.8:3.0,sh=k==='thatchHouse'?0.85:0.9;
    MEDIEVAL_ASSETS[k].draw=(c,x,y,u,v)=>{const o=v&3,s=v>>2,isEave=(o>>1)&1;shadow(c,x,y,u,isEave?sw*1.25:sw,isEave?sh*1.05:sh);flipWrap(c,x,o&1,()=>isEave?eave(c,x,y,u,s):gable(c,x,y,u,s));};});
  const tw=MEDIEVAL_ASSETS.bellTower.draw;MEDIEVAL_ASSETS.bellTower.draw=(c,x,y,u,v)=>{shadow(c,x,y,u,2.0,0.65);flipWrap(c,x,v&1,()=>tw(c,x,y,u,v));};})();

/* ===== MACRO-LAND ENGINE (hex geometry, path network, planner, baker) ===== */
const W3=Math.sqrt(3),HX=W3/2,HV=[[HX,0.29],[0,0.58],[-HX,0.29],[-HX,-0.29],[0,-0.58],[HX,-0.29]];
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[0,1,2],[-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5,1.5]]};
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

/* ---- generic baker (any theme object {assets, plan, ground, groundCol, seeds}) ---- */
const LAND_BAKE_CACHE={};
function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};
  const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol;
  const clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]);
  const key=[T.id,shape,tier,R,Math.round(R*sc),sc,m,ground,JSON.stringify(clr)].join('|');
  if(LAND_BAKE_CACHE[key])return LAND_BAKE_CACHE[key];
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX;
  const mx=0.75,top=T.top||1.35,bot=0.85,W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R);
  const ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const back=document.createElement('canvas');back.width=Math.ceil(W*sc);back.height=Math.ceil(H*sc);
  const cb=back.getContext('2d');cb.scale(sc,sc);T.ground(cb,G,R,ox,oy,m,ground,shape==='A'?11:22);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]);
  const vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho)));
  const rowYs=[...new Set(G.centers.map(c=>c.y))].sort((a,b)=>a-b),objectsByBand=rowYs.map(()=>[]);
  vis.forEach(o=>{let band=0;while(band<rowYs.length-1&&o.y>=(rowYs[band]+rowYs[band+1])/2)band++;objectsByBand[band].push(o);});
  const bands=objectsByBand.map((objects,index)=>{
    let bx0=W,by0=H,bx1=0,by1=0;
    objects.forEach(o=>{const px=ox+m*o.x*R,py=oy+o.y*R,s=(o.scale||1)*u;bx0=Math.min(bx0,px-4*s);bx1=Math.max(bx1,px+4*s);by0=Math.min(by0,py-9*s);by1=Math.max(by1,py+2*s);});
    if(!objects.length)return{canvas:null,rect:{x:0,y:0,w:0,h:0},depth:oy+rowYs[index]*R};
    bx0=Math.max(0,Math.floor(bx0));by0=Math.max(0,Math.floor(by0));bx1=Math.min(W,Math.ceil(bx1));by1=Math.min(H,Math.ceil(by1));
    const w=bx1-bx0,h=by1-by0,canvas=document.createElement('canvas');canvas.width=Math.ceil(w*sc);canvas.height=Math.ceil(h*sc);
    const cg=canvas.getContext('2d');cg.scale(sc,sc);cg.translate(-bx0,-by0);
    objects.sort((a,b)=>a.y-b.y).forEach(o=>T.assets[o.kind].draw(cg,ox+m*o.x*R,oy+o.y*R,u*(o.scale||1),o.v));
    return{canvas,rect:{x:bx0,y:by0,w,h},depth:oy+rowYs[index]*R};
  });
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return LAND_BAKE_CACHE[key]={back,bands,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0};
}function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}

/* ===== MEDIEVAL LAND: planner (dense mixed woodland, rolling hills on the back rim, cottages sprinkled, one small tower beside homes) ===== */
const MEDIEVAL_REGION={top:{oak:.2,elm:.14,copperBeech:.04,poplar:.1,yew:.06,birch:.12,pine:.08,appleTree:.0,sapling:.06},mid:{oak:.26,birch:.12,elm:.1,appleTree:.16,copperBeech:.04,yew:.06,poplar:.06,pine:.04,willow:.04,sapling:.08},bottom:{appleTree:.24,oak:.18,birch:.16,sapling:.14,yew:.08,copperBeech:.04,willow:.04,elm:.08}};
const MEDIEVAL_LOW=[['sapling',1],['appleTree',0.75],['birch',0.65],['oak',0.55],['yew',0.62],['sapling',1.2],['appleTree',0.85]];
const MEDIEVAL_CAP={willow:3,poplar:8,yew:8,copperBeech:5,pine:6};
const MEDIEVAL_UNDER=['hedge','hawthorn','roseBush','flowers','grassTuft','hedge','flowers','grassTuft','stones'];
const MEDIEVAL_PLAN_CACHE={};
function getMedievalPlan(shape){
  if(MEDIEVAL_PLAN_CACHE[shape])return MEDIEVAL_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(shape==='A'?5101:6202),placed=[],bb=G.bbox,used={},A=MEDIEVAL_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.66);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'oak';};
  const capOk=k=>!(MEDIEVAL_CAP[k]&&(used[k]||0)>=MEDIEVAL_CAP[k]);
  const regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?MEDIEVAL_REGION.top:n<0.68?MEDIEVAL_REGION.mid:MEDIEVAL_REGION.bottom;};
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='tree'?0.88+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;if((D.cat==='tree'||D.cat==='shrub'||D.cat==='prop')&&placed.some(o=>o.noSouth&&Math.abs(px-o.x)<0.3&&py-o.y>-0.05&&py-o.y<0.36))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const tree=(x,y,extra,dom,low)=>{if(low){const L=MEDIEVAL_LOW[Math.floor(rng()*MEDIEVAL_LOW.length)];return place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return place(dom&&rng()<0.55&&capOk(dom)?dom:pickFrom(regionOf(y),capOk),x,y,extra||{});};
  const under=(x,y,extra)=>place(MEDIEVAL_UNDER[Math.floor(rng()*MEDIEVAL_UNDER.length)],x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. back rim: rolling and wooded hills (no mountain range), the odd small crag and a drystone wall, with tall elms / poplars behind */
  {const pts=[];top.forEach(e=>[0.2,0.5,0.8].forEach(t=>pts.push(onEdge(e,t,0.0))));pts.sort((a,b)=>a[0]-b[0]);const x0=pts[0][0],x1=pts[pts.length-1][0],nearest=x=>pts.reduce((b,p)=>Math.abs(p[0]-x)<Math.abs(b[0]-x)?p:b);
    const centers=[];let x=x0+0.12+rng()*0.2;while(x<x1-0.05){centers.push(x);x+=0.8+rng()*0.55;}
    centers.forEach((cxp,i)=>{const p=nearest(cxp),bx=p[0],by=p[1],mt=a=>a+(rng()<0.35?1:0),at=(k,dx,dy,ex)=>place(k,bx+dx,by+dy,ex);
      {['elm','oak','poplar','oak','birch','elm'].forEach((k,j)=>at(k,(j-2.5)*0.27+(rng()-0.5)*0.1,-0.02+(rng()-0.5)*0.06,{minT:j<2?1:j<4?mt(2):mt(3),scale:1.0+rng()*0.25}));at('stones',0.05,0.1,{minT:2});if(rng()<0.4)at('stoneWall',-0.6,0.06,{minT:2});}});
    {const gaps=[];for(let i=0;i+1<centers.length;i++)gaps.push(i);[gaps[0],gaps[gaps.length-1]].filter((g,i,a)=>g!==undefined&&a.indexOf(g)===i).forEach((gi,k)=>{const p=nearest((centers[gi]+centers[gi+1])/2);place(k?'poplar':'elm',p[0],p[1]-0.06,{minT:k?4:3,scale:1.15,clear:1.3});});}}
  /* 2. cottages sprinkled across the land (farthest-point spacing, on the rim where there is room), a well, and ONE small bell tower placed beside a cottage */
  {const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.forEach(e=>inn.push([e.mid[0],e.mid[1]]));
    const seq=[['timberHouse','r',1],['thatchHouse','r',2],['stoneHouse','r',3],['timberHouse','r',3],['well','a',3],['thatchHouse','r',4],['stoneHouse','r',4]],chosen=[],sc={timberHouse:1.2,thatchHouse:1.2,stoneHouse:1.2,well:1.2},stone=[];
    seq.forEach(([k,z,mt])=>{const pool=z==='r'?rim:z==='i'?inn:rim.concat(inn),ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.25})).sort((a,b)=>b.d-a.d);
      for(let n=0;n<Math.min(10,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],{minT:mt,scale:sc[k],clear:2.5,noSouth:true});if(o){chosen.push([o.x,o.y]);if(k==='stoneHouse')stone.push(o);return;}}});
    /* the tower: one instance, right next to a cottage */
    {const home=stone[stone.length-1]||placed.find(o=>o.cat==='struct');if(home){const offs=[[0.34,-0.08],[-0.34,-0.08],[0.3,0.12],[-0.3,0.12],[0.42,0.0],[-0.42,0.0]];for(const [dx,dy] of offs){const o=place('bellTower',home.x+dx,home.y+dy,{minT:4,scale:1.0,clear:2.4,noSouth:true});if(o)break;}}}}
  /* 2b. a village in the middle: smaller cottages in the interior voids and wide corridors (placed before the trees so the trees give way) */
  {const inn=[];G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.filter(e=>e.vertical).forEach(e=>inn.push([e.mid[0],e.mid[1]]));
    const chosen=placed.filter(o=>o.cat==='struct').map(o=>[o.x,o.y]),seq=[['thatchHouse',2],['stoneHouse',2],['timberHouse',3],['thatchHouse',3],['timberHouse',4],['stoneHouse',4],['thatchHouse',4]];
    seq.forEach(([k,mt])=>{const ranked=inn.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.2})).sort((a,b)=>b.d-a.d);
      for(let n=0;n<Math.min(12,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],{minT:mt,scale:1.05,clear:3.0,noSouth:true});if(o){chosen.push([o.x,o.y]);return;}}});}
  /* 3. trees: junction groves, corridor trees, rim groves, corner fill (dense, same as the approved frontier setting) */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=pickFrom(regionOf(v.y),capOk),n=1+Math.floor(rng()*2.0);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.09:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{const dom=pickFrom(regionOf(e.mid[1]),capOk);[-0.27,0,0.27].forEach(dy=>{if(rng()<0.5)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.72)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.8+rng()*0.2},null,true);if(rng()<0.22)tree(e.mid[0]+(rng()-0.5)*0.34,e.mid[1]+(rng()-0.5)*0.14,{scale:0.78+rng()*0.2},null,true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.26));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(e.cls==='top'?-0.02:0)+(rng()-0.2)*0.12)});});
    let mode='grove',run=0,dom='oak';samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.74?'grove':r<0.92?'sparse':'open';run=2+Math.floor(rng()*4);dom=pickFrom(regionOf(s.p[1]),capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){if(e.cls==='top'&&rng()<0.08)return;tree(p[0],p[1],null,dom,low);if(rng()<0.55)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,dom,low);if(rng()<0.2)tree(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,dom,true);if(rng()<0.14)tree(p[0]+(rng()-0.5)*0.34,p[1]-0.2,null,dom,low);}
      else if(mode==='sparse'){if(rng()<0.5)tree(p[0],p[1],null,dom,low);else under(p[0],p[1]);}else if(rng()<0.6)under(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.8)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<14;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.2)tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);}});
  /* 4. undergrowth: hedges, hawthorn, roses, flowers */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.45)under(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.35)under(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.38)under(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.3)under(px,py);}});
  /* 5. small props: lower tiers only (haybales, barrels, a cart, a banner string, lamp posts, fences) */
  [['haybale',3],['barrels',2],['cart',1],['bannerString',1],['lanternPost',2],['woodFence',2]].forEach(([k,n])=>{for(let i=0;i<n;i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  {const houses=placed.filter(o=>/House$/.test(o.kind)).sort((a,b)=>a.x-b.x||a.y-b.y),cyc=[0,3,1,2];houses.forEach((o,i)=>{o.v=((o.v>>2)<<2)|cyc[i%4];});placed.filter(o=>o.kind==='bellTower').forEach(o=>{o.v=((o.v>>2)<<2)|(rng()<0.5?1:0);});}
  const cuts={tree:[0.2,0.52,0.8,1],shrub:[0.06,0.38,0.7,1],rock:[0.3,0.55,0.8,1],prop:[1,1,1,1],struct:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='struct')o.tier=o.minT;});
  const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
  for(let t=1;t<=4;t++){let guard=0;while(guard++<300){const c=count(t);if(c.tr/Math.max(1,c.n)>=0.7)break;const pool=placed.filter(o=>o.tier<=t&&t<=o.maxT),cand=(pool.filter(o=>o.cat==='shrub').sort((a,b)=>b.pri-a.pri)[0])||(pool.filter(o=>o.prop&&o.minT>1).sort((a,b)=>b.pri-a.pri)[0]);if(!cand)break;cand.tier=Math.min(5,cand.tier+1);}}
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.sort((a,b)=>a.y-b.y);
  return MEDIEVAL_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: soft sage-green meadow, mown-stripe patches, buttercups and daisies, clover and small stones (decals, not objects) ---- */
function medievalGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<46;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'170,205,120':'70,110,56',r()<0.5?0.2:0.2);}
  for(let k=0;k<12;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'200,190,120',0.15);}              /* sun-bleached meadow */
  for(let k=0;k<8;k++){const p=pt(),w=R*(0.25+r()*0.4);soft(p[0],p[1],w,w*0.4,'120,96,62',0.14);}               /* worn earth */
  for(let k=0;k<160;k++){const p=pt(),h=R*(0.05+r()*0.06);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#6fa650','#5f9645','#85b85f'][(k+j)%3],R*0.011);}
  for(let k=0;k<60;k++){const p=pt();for(let j=0;j<3;j++)TH.ell(c,p[0]+(j-1)*R*0.016,p[1]+(j%2)*R*0.01,R*0.014,R*0.011,'#5f9a50');}     /* clover */
  for(let k=0;k<54;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.012,R*0.01,['#f2c230','#f6efe0','#f4a6cb','#fff0a0','#8aa8e8'][k%5]);}
  for(let k=0;k<22;k++){const p=pt();TH.ell(c,p[0],p[1],R*(0.014+r()*0.012),R*0.01,'rgba(150,152,146,.6)');}
  c.restore();c.restore();
}
const MEDIEVAL_THEME={id:'medieval',assets:MEDIEVAL_ASSETS,plan:getMedievalPlan,ground:medievalGround,groundCol:'#8aa66a',top:1.4};
const MEDIEVAL_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
function bakeLandMedieval(shape,tier,R,opts){return bakeLandTheme(MEDIEVAL_THEME,shape,tier,R,opts);}
function drawLandMedievalBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandMedievalDepthBand(ctx,x,y,land,index){const band=land.bands[index];if(!band||!band.canvas)return;const r=band.rect;ctx.drawImage(band.canvas,x-land.ox+r.x,y-land.oy+r.y,r.w,r.h);}
function drawLandMedievalFront(ctx,x,y,land){land.bands.forEach((_,index)=>drawLandMedievalDepthBand(ctx,x,y,land,index));}
return Object.freeze({bake:bakeLandMedieval,drawBack:drawLandMedievalBack,drawDepthBand:drawLandMedievalDepthBand,drawFront:drawLandMedievalFront});
})();
const gothicLandMacroPack = (() => {
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

/* ===== GOTHIC ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const GSH=(c,x,y,rx)=>{c.fillStyle='rgba(6,12,10,.36)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const GDARK=[['#102219','#16301f','#0c1a13','#1d3a28'],['#13261c','#1a3425','#0e1d16','#24402e'],['#0f1f18','#152b20','#0a1711','#1b3526']];
const GSTONE='#7a7e87',GSTONE_D='#555962',GSTONE_L='#9298a1',GMOSS='#3a5a3a',GIVY='#27452f',GWOODD='#17120d',GGLOW='#e8d36a';
const GBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.32),shade(col,0.1));
const GFLIP=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
/* lancet (pointed) outline for a face; J(a,z) maps a face coordinate to the screen */
const GLANCET=(J,xc,w,z0,zs,zt)=>{const L=[],R=[];for(let t=0;t<=8;t++){const s=t/8,q=1-s,X=q*q*(xc-w)+2*q*s*(xc-w*0.85)+s*s*xc,Z=q*q*zs+2*q*s*(zs+(zt-zs)*0.85)+s*s*zt;L.push(J(X,Z));R.push(J(2*xc-X,Z));}return [J(xc-w,z0)].concat(L,R.slice().reverse(),[J(xc+w,z0)]);};
const GPATH=(c,pts)=>{pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();};
/* a wall face with real holes (windows / arches show the dark interior) */
const GWALLHOLES=(c,outer,holes,fill,dark)=>{holes.forEach(h=>{c.beginPath();GPATH(c,h);c.fillStyle=dark||'#0b1210';c.fill();});c.beginPath();GPATH(c,outer);holes.forEach(h=>GPATH(c,h));c.fillStyle=fill;c.fill('evenodd');};
const GIVYBLOBS=(c,x,y,u,r,n,spread)=>{for(let k=0;k<n;k++)TH.blob(c,x+(r()-0.5)*u*spread,y-r()*u*1.6,u*(0.3+r()*0.3),u*(0.22+r()*0.2),r()<0.5?'#2a4a30':'#1f3a27',r,7);};
const GBAT=(c,x,y,u)=>{c.fillStyle='#0a0a0e';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.45,y-u*0.5,x-u*0.9,y-u*0.1);c.quadraticCurveTo(x-u*0.55,y,x-u*0.3,y+u*0.18);c.lineTo(x,y+u*0.08);c.lineTo(x+u*0.3,y+u*0.18);c.quadraticCurveTo(x+u*0.55,y,x+u*0.9,y-u*0.1);c.quadraticCurveTo(x+u*0.45,y-u*0.5,x,y);c.fill();};
/* ---- spooky cottages: one parametric body, drawn in 4 orientations (gable/eave front x mirror), leaning, with lit windows ---- */
const GHOUSE_T={
  hauntedManor:{ha:1.3,hb:1.95,h1:3.0,h2:0,jet:0,wall:'#6c7079',beam:null,roof:'#2a2e38',roofD:'#1c2028',rise:2.5,turret:true,crook:0.025,glow:0.65,style:'stone',sw:3.4,sh:1.0},
  crookedTimber:{ha:1.2,hb:1.8,h1:1.4,h2:1.3,jet:0.2,wall:'#575c64',beam:'#14110d',roof:'#363b46',roofD:'#252932',rise:2.2,turret:false,crook:0.075,glow:0.5,style:'timber',sw:3.2,sh:0.95},
  witchCottage:{ha:1.15,hb:1.65,h1:1.3,h2:0,jet:0,wall:'#454a45',beam:'#14110d',roof:'#3b3828',roofD:'#2a281c',rise:2.0,turret:false,crook:0.095,glow:0.9,style:'timber',moss:true,sw:2.9,sh:0.9}
};
function GHOUSE_BODY(c,x,y,u,s,eave,T){const r=mulberry(s*7+3),Iw=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),L=(a,b,z)=>eave?Iw(b,a,z):Iw(a,b,z),LBOX=(a0,a1,b0,b1,z0,z1,col)=>eave?GBOX(c,x,y,u,b0,b1,a0,a1,z0,z1,col):GBOX(c,x,y,u,a0,a1,b0,b1,z0,z1,col);
  const ha=T.ha,hb=T.hb,jet=T.jet,ha2=ha+jet,hb2=hb+jet,zw=T.h1+T.h2,zr=zw+T.rise,lean=T.crook*(s%2?1:-1);
  c.save();c.translate(x,y);c.transform(1,0,-lean,1,0,0);c.translate(-x,-y);
  const faces=(aa,bb,z0,z1)=>[{J:(a,z)=>L(a,bb+0.012,z),p0:-aa,p1:aa},{J:(b,z)=>L(aa+0.012,b,z),p0:-bb,p1:bb}];
  const frame=(F,z0,z1)=>{const n=Math.max(3,Math.round((F.p1-F.p0)/0.8)),w=u*0.11;[z0+0.03,z1-0.03,(z0+z1)/2].forEach(z=>TH.ln(c,F.J(F.p0,z),F.J(F.p1,z),T.beam,w));for(let k=0;k<=n;k++){const p=F.p0+(F.p1-F.p0)*k/n;TH.ln(c,F.J(p,z0),F.J(p,z1),T.beam,w);if(k<n&&r()<0.55)TH.ln(c,F.J(p,z0),F.J(F.p0+(F.p1-F.p0)*(k+1)/n,(z0+z1)/2),T.beam,w*0.8);}};
  const courses=(F,z0,z1)=>{for(let row=0;row<Math.round((z1-z0)/0.3);row++){const z=z0+0.1+row*0.3;for(let k=0;k<Math.round((F.p1-F.p0)/0.45);k++){const p=F.p0+0.05+k*0.45+(row%2)*0.2;TH.ln(c,F.J(p,z),F.J(Math.min(F.p1,p+0.4),z),'rgba(8,12,12,.4)',u*0.05);TH.ln(c,F.J(p,z),F.J(p,z+0.3),'rgba(8,12,12,.32)',u*0.05);}}};
  const window_=(F,p,z0,h,lit,boarded)=>{const w=0.2,pts=GLANCET(F.J,p,w,z0,z0+h*0.62,z0+h);c.beginPath();GPATH(c,pts);if(lit){const g=F.J(p,z0+h*0.5),gr=c.createRadialGradient(g[0],g[1],0,g[0],g[1],u*1.5);gr.addColorStop(0,'rgba(232,211,106,.32)');gr.addColorStop(1,'rgba(232,211,106,0)');c.save();c.fillStyle=gr;c.beginPath();c.arc(g[0],g[1],u*1.5,0,7);c.fill();c.restore();c.beginPath();GPATH(c,pts);c.fillStyle=r()<0.35?'#a8e07a':GGLOW;}else c.fillStyle='#0b1012';c.fill();c.strokeStyle=boarded?'#3a2c1c':'#2a2620';c.lineWidth=u*0.07;c.stroke();if(boarded){TH.ln(c,F.J(p-w,z0+h*0.25),F.J(p+w,z0+h*0.6),'#4a3a28',u*0.1);TH.ln(c,F.J(p-w,z0+h*0.55),F.J(p+w,z0+h*0.2),'#3a2c1c',u*0.1);}else TH.ln(c,F.J(p,z0),F.J(p,z0+h*0.9),'#2a2620',u*0.04);};
  const door=(F,p,hz)=>{const pts=GLANCET(F.J,p,0.34,0,hz*0.7,hz);c.beginPath();GPATH(c,pts);c.fillStyle='#120e0a';c.fill();c.strokeStyle='#3a3228';c.lineWidth=u*0.08;c.stroke();TH.ln(c,F.J(p,0.05),F.J(p,hz*0.88),'#2a2218',u*0.05);TH.ell(c,...F.J(p+0.18,hz*0.4),u*0.05,u*0.05,'#9a8a5a');};
  /* walls */
  LBOX(-ha,ha,-hb,hb,0,T.h1,T.wall);let top=T.h1;if(T.h2){LBOX(-ha2,ha2,-hb2,hb2,T.h1,zw,shade(T.wall,0.04));top=zw;}
  const F1=faces(ha,hb)[0],F2=faces(ha,hb)[1],G1=faces(ha2,hb2)[0],G2=faces(ha2,hb2)[1];
  if(T.style==='stone'){courses(F1,0,T.h1);courses(F2,0,T.h1);}else{frame(F1,0,T.h1);frame(F2,0,T.h1);if(T.h2){frame(G1,T.h1,zw);frame(G2,T.h1,zw);}}
  const doorF=eave?F2:F1,otherF=eave?F1:F2;door(doorF,0,1.3);
  const nlow=T.style==='stone'?2:1;for(let k=0;k<nlow;k++){const p=(k?0.95:-0.95)*(doorF.p1*0.6);if(Math.abs(p)>0.4)window_(doorF,p,0.6,0.85,r()<T.glow,r()<0.25);}
  window_(otherF,otherF.p1*0.0,0.7,0.9,r()<T.glow,r()<0.2);if(T.style==='stone'){window_(otherF,otherF.p1*0.5,0.7,0.9,r()<T.glow,false);window_(otherF,-otherF.p1*0.5,0.7,0.9,r()<T.glow,false);window_(doorF,doorF.p1*0.5,1.7,1.0,true,false);window_(doorF,-doorF.p1*0.5,1.7,1.0,r()<T.glow,false);window_(otherF,0,1.9,1.0,r()<T.glow,false);}
  else if(T.h2){const H1=eave?G2:G1,H2=eave?G1:G2;window_(H1,-0.7,T.h1+0.2,0.85,r()<T.glow,r()<0.3);window_(H1,0.7,T.h1+0.2,0.85,r()<T.glow,r()<0.3);window_(H2,0,T.h1+0.2,0.85,r()<T.glow,false);}
  if(T.moss)for(let k=0;k<7;k++){const f=r()<0.5?F1:F2,p=f.p0+(f.p1-f.p0)*r(),q=f.J(p,0.15+r()*0.5);TH.blob(c,q[0],q[1],u*(0.3+r()*0.35),u*(0.2+r()*0.2),r()<0.5?'#2f5a34':'#3a6a3c',r,7);}
  /* chimney behind the ridge, then the roof planes */
  const ch=T.style==='stone'?1.7:1.2;LBOX(-ha*0.7,-ha*0.7+0.5,-hb*0.7,-hb*0.7+0.5,zw+0.3,zr+0.9,shade(T.wall,-0.1));{const cp=L(-ha*0.7+0.25,-hb*0.7+0.25,zr+1.0);TH.ell(c,cp[0],cp[1],u*0.3,u*0.14,'#0a0c10');if(T.moss){c.fillStyle='rgba(150,230,110,.35)';for(let k=0;k<3;k++){c.beginPath();c.ellipse(cp[0]+k*u*0.12,cp[1]-u*(0.5+k*0.5),u*(0.3+k*0.12),u*0.22,0,0,7);c.fill();}}else{c.fillStyle='rgba(190,196,205,.35)';c.beginPath();c.ellipse(cp[0]+u*0.1,cp[1]-u*0.6,u*0.3,u*0.2,0,0,7);c.fill();}}
  const ov=0.3,rA=L(ha2+ov,-hb2-ov,zw),rB=L(ha2+ov,hb2+ov,zw),rC=L(0,hb2+ov,zr),rD=L(0,-hb2-ov,zr);TH.poly(c,[rA,rB,rC,rD],T.roof);
  const rows=Math.max(5,Math.round(T.rise/0.28));for(let k=1;k<rows;k++){const t=k/rows;TH.ln(c,L(ha2+ov-(ha2+ov)*t,-hb2-ov,zw+T.rise*t),L(ha2+ov-(ha2+ov)*t,hb2+ov,zw+T.rise*t),'rgba(0,0,0,.35)',u*0.05);}
  for(let k=0;k<9;k++){const t=0.12+r()*0.75,bb=-hb2+r()*hb2*2,p=L((ha2+ov)*(1-t),bb,zw+T.rise*t);TH.poly(c,[[p[0]-u*0.22,p[1]],[p[0]+u*0.22,p[1]],[p[0]+u*0.16,p[1]+u*0.2],[p[0]-u*0.16,p[1]+u*0.2]],'#07090c');}
  if(T.moss)for(let k=0;k<8;k++){const t=0.1+r()*0.8,bb=-hb2+r()*hb2*2,p=L((ha2+ov)*(1-t),bb,zw+T.rise*t);TH.blob(c,p[0],p[1],u*(0.3+r()*0.3),u*(0.18+r()*0.15),r()<0.5?'#2f5a34':'#3c6a3a',r,7);}
  const gA=L(-ha2,hb2+0.02,zw),gB=L(ha2,hb2+0.02,zw),gC=L(0,hb2+0.02,zr-0.1);TH.poly(c,[gA,gB,gC],T.style==='stone'?shade(T.wall,-0.05):'#3a3f48');if(T.beam){TH.ln(c,gA,gC,T.beam,u*0.12);TH.ln(c,gB,gC,T.beam,u*0.12);TH.ln(c,L(0,hb2+0.03,zw),gC,T.beam,u*0.1);}
  TH.ln(c,L(-ha2-ov,hb2+ov,zw),L(0,hb2+ov,zr),'#0a0c10',u*0.12);TH.ln(c,L(ha2+ov,hb2+ov,zw),L(0,hb2+ov,zr),'#0a0c10',u*0.12);TH.ln(c,rD,rC,'#0a0c10',u*0.1);
  window_({J:(a,z)=>L(a,hb2+0.03,z)},0,zw+0.15,Math.min(1.6,T.rise*0.55),r()<T.glow,false);
  if(T.turret){const tc=L(-ha+0.2,hb-0.2,0),tt=L(-ha+0.2,hb-0.2,zw+1.4),rr=u*0.78;const g=c.createLinearGradient(tc[0]-rr,0,tc[0]+rr,0);g.addColorStop(0,shade(T.wall,0.12));g.addColorStop(0.6,T.wall);g.addColorStop(1,shade(T.wall,-0.4));c.fillStyle=g;c.beginPath();c.moveTo(tc[0]-rr,tc[1]);c.lineTo(tt[0]-rr,tt[1]);c.lineTo(tt[0]+rr,tt[1]);c.lineTo(tc[0]+rr,tc[1]);c.ellipse(tc[0],tc[1],rr,rr*0.4,0,0,Math.PI);c.closePath();c.fill();
    for(let k=1;k<9;k++)TH.ln(c,[tc[0]-rr,tc[1]-(tc[1]-tt[1])*k/9],[tc[0]+rr,tc[1]-(tc[1]-tt[1])*k/9+u*0.04],'rgba(8,12,12,.3)',u*0.05);const wy=(tc[1]+tt[1])/2;c.beginPath();c.moveTo(tc[0]-u*0.14,wy+u*0.45);c.lineTo(tc[0]-u*0.14,wy-u*0.05);c.quadraticCurveTo(tc[0],wy-u*0.55,tc[0]+u*0.14,wy-u*0.05);c.lineTo(tc[0]+u*0.14,wy+u*0.45);c.closePath();c.fillStyle=GGLOW;c.fill();
    TH.poly(c,[[tt[0]-rr*1.15,tt[1]],[tt[0]+rr*1.15,tt[1]],[tt[0],tt[1]-u*2.4]],'#1c2028');TH.poly(c,[[tt[0],tt[1]-u*2.4],[tt[0]+rr*1.15,tt[1]],[tt[0]+u*0.1,tt[1]]],'#12151b');TH.ln(c,[tt[0],tt[1]-u*2.4],[tt[0],tt[1]-u*3.0],'#0a0c10',u*0.1);}
  const bp=L(0,0,zr+0.2);if(r()<0.8)GBAT(c,bp[0]-u*0.8+r()*u*1.4,bp[1]-u*(0.9+r()*0.8),u*0.8);if(r()<0.5)GBAT(c,bp[0]+u*0.5+r()*u*1.2,bp[1]-u*(1.4+r()*0.9),u*0.7);
  c.restore();}
const GHOUSE=(key)=>({cat:'struct',rho:0.14,draw(c,x,y,u,v){const T=GHOUSE_T[key],o=v&3,s=v>>2,eave=(o>>1)&1;c.fillStyle='rgba(6,12,10,.36)';c.beginPath();c.ellipse(x+u*0.8,y+u*0.2,u*T.sw*(eave?1.2:1),u*T.sh,0,0,7);c.fill();GFLIP(c,x,o&1,()=>GHOUSE_BODY(c,x,y,u,s,eave,T));}});
const GOTHIC_ASSETS={
  /* ---------- trees: very, very dark ---------- */
  gnarledOak:{cat:'tree',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*7+1),H=u*(4.4+r()*1.1),pal=GDARK[v%3];GSH(c,x,y,u*2.3);c.lineCap='round';c.strokeStyle='#1a1410';c.lineWidth=u*0.85;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x-u*0.9,y-H*0.25,x+u*0.9,y-H*0.45,x+u*0.1,y-H*0.62);c.stroke();TH.poly(c,[[x-u*0.7,y],[x-u*0.3,y-u*0.9],[x+u*0.25,y-u*0.9],[x+u*0.75,y]],'#1a1410');TH.ln(c,[x-u*0.2,y-H*0.1],[x+u*0.1,y-H*0.5],'#2c241a',u*0.18);
    [[-1.5,0.82],[1.6,0.78],[-0.9,0.95],[0.8,0.97]].forEach(([dx,f])=>TH.ln(c,[x+u*0.1,y-H*0.55],[x+dx*u,y-H*f],'#1a1410',u*0.3));const cy=y-H*0.82;
    [[0,-0.3,1.9,1.1],[-1.6,0.0,1.2,0.9],[1.6,0.0,1.2,0.9],[-0.8,-1.1,1.4,0.95],[0.85,-1.1,1.4,0.95],[0,-1.6,1.1,0.8]].forEach(([dx,dy,rx,ry],i)=>{if(i===4&&v%3===0)return;TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[(i+(v>>2))%4],r,10);});
    if(v%8===0){const ey=y-H*0.18;TH.ell(c,x-u*0.14,ey,u*0.07,u*0.05,'#e8d36a');TH.ell(c,x+u*0.14,ey,u*0.07,u*0.05,'#e8d36a');}}},
  blackPine:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*11+2),h=u*(5.0+r()*1.6),w=u*1.35,n=7;GSH(c,x,y,u*1.5);TH.ln(c,[x,y],[x,y-h*0.3],'#1a1410',u*0.4);const lean=(r()-0.5)*u*0.3;for(let i=0;i<n;i++){const t=i/n,ww=w*(1-0.82*t)*(0.88+r()*0.24),yb=y-h*(0.14+0.76*t),tip=yb-h*0.3,dy=yb-tip,lx=x+lean*t;
      TH.poly(c,[[lx-ww,yb],[lx-ww*0.6,yb-h*0.03],[lx-ww*0.25,yb+h*0.012],[lx+ww*0.2,yb-h*0.035],[lx+ww*0.62,yb+h*0.01],[lx+ww,yb],[lx,tip]],'#0f241a');TH.poly(c,[[lx,tip],[lx+ww,yb],[lx+ww*0.62,yb+h*0.01],[lx+ww*0.2,yb-h*0.035],[lx,yb]],'#08150f');}}},
  deadTree:{cat:'tree',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*23+1),H=u*(4.0+r()*1.3);GSH(c,x,y,u*1.0);c.lineCap='round';c.strokeStyle='#2a2826';c.lineWidth=u*0.5;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x-u*0.5,y-H*0.3,x+u*0.6,y-H*0.6,x+u*0.1,y-H);c.stroke();TH.ln(c,[x-u*0.15,y],[x-u*0.05,y-H*0.7],'#4a4642',u*0.1);
    const br=[[0.45,-1.2,0.9],[0.55,1.3,1.0],[0.75,-0.9,1.15],[0.85,0.8,1.2],[0.65,1.6,0.95]];br.forEach(([f,dx,fy])=>{const bx=x+(f<0.6?0:0)+dx*u*0.2,by=y-H*f,ex=x+dx*u,ey=y-H*fy;TH.ln(c,[bx,by],[ex,ey],'#2a2826',u*0.2);TH.ln(c,[ex,ey],[ex+dx*u*0.35,ey-u*0.5],'#2a2826',u*0.11);TH.ln(c,[(bx+ex)/2,(by+ey)/2],[(bx+ex)/2+dx*u*0.2,(by+ey)/2-u*0.6],'#2a2826',u*0.1);});
    if(v%4===0){[[0.9,-0.9],[1.1,0.7]].forEach(([dx,fy],i)=>{const cx=x+dx*u,cy2=y-H*(0.9+i*0.12);c.fillStyle='#07070a';c.beginPath();c.ellipse(cx,cy2,u*0.3,u*0.18,0.2,0,7);c.fill();TH.poly(c,[[cx+u*0.25,cy2-u*0.05],[cx+u*0.55,cy2+u*0.02],[cx+u*0.25,cy2+u*0.1]],'#07070a');});}}},
  darkPoplar:{cat:'tree',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*13+1),H=u*(6.4+r()*1.6);GSH(c,x,y,u*1.0);TH.ln(c,[x,y],[x,y-u*1.3],'#1a1410',u*0.34);const pal=['#0e1f16','#12281c','#0a1811','#173020'];for(let k=0;k<9;k++){const t=k/8,yy=y-u*1.2-t*(H-u*1.5),rx=u*(0.55+0.4*Math.sin(Math.min(1,t*1.15)*Math.PI*0.85)),ry=u*0.85;TH.blob(c,x+(r()-0.5)*u*0.25,yy,rx,ry,pal[k%4],r,9);}}},
  weepingDark:{cat:'tree',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*29+3),H=u*(4.6+r()*0.8),pal=GDARK[(v+1)%3];GSH(c,x,y,u*2.2);c.lineCap='round';c.strokeStyle='#1a1410';c.lineWidth=u*0.65;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+u*0.3,y-H*0.4,x-u*0.1,y-H*0.7);c.stroke();const cy=y-H*0.78;[[0,-0.4,1.7,1.0],[-1.2,0,1.2,0.9],[1.2,0,1.2,0.9],[0,-1.0,1.2,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,9));for(let k=0;k<24;k++){const sx=x+(k/23-0.5)*u*3.4,sy=cy+u*0.5+Math.abs(k/23-0.5)*u*0.2,len=u*(1.4+r()*1.8);TH.ln(c,[sx,sy],[sx+(r()-0.5)*u*0.3,Math.min(y-u*0.2,sy+len)],k%2?'#0f2218':'#16301f',u*0.1);}}},
  yewDark:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*19+2);GSH(c,x,y,u*1.7);TH.ln(c,[x,y],[x,y-u*1.0],'#2a1a14',u*0.55);const cols=['#0e1f17','#132a1d','#0a1912','#18331f'];[[0,-2.0,1.25,1.0],[-0.85,-1.3,1.15,0.9],[0.85,-1.3,1.15,0.9],[0,-1.0,1.45,0.85],[0,-2.8,0.85,0.7]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,cols[i%4],r,9));}},
  twistedSapling:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*31+3),pal=GDARK[v%3];GSH(c,x,y,u*1.2);c.lineCap='round';c.strokeStyle='#1a1410';c.lineWidth=u*0.3;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+u*0.5,y-u*0.8,x-u*0.1,y-u*1.6);c.stroke();[[0,-2.0,0.95,0.8],[-0.55,-1.5,0.7,0.6],[0.55,-1.4,0.7,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,pal[i%4],r,8));}},
  /* ---------- undergrowth ---------- */
  thornBush:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+9);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(6,12,10,.3)');[[-0.55,-0.45,0.8,0.55],[0.55,-0.45,0.8,0.55],[0,-0.85,0.85,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#16301f','#102419','#1d3a28'][i],r,8));for(let k=0;k<9;k++){const a=-Math.PI+k/8*Math.PI,l=u*(0.9+r()*0.4);TH.ln(c,[x+Math.cos(a)*u*0.5,y-u*0.5+Math.sin(a)*u*0.3],[x+Math.cos(a)*l,y-u*0.5+Math.sin(a)*l*0.8-u*0.1],'#2a2826',u*0.06);}for(let k=0;k<4;k++)TH.ell(c,x+(r()-0.5)*u*1.3,y-u*(0.3+r()*0.7),u*0.08,u*0.08,'#6a1a1a');}},
  deadBrush:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.26,'rgba(6,12,10,.28)');for(let k=0;k<12;k++){const a=-Math.PI*0.5+(r()-0.5)*2.2,l=u*(0.8+r()*0.9);const ex=x+Math.sin(a)*l,ey=y-Math.cos(a)*l;TH.ln(c,[x+(r()-0.5)*u*0.3,y],[ex,ey],'#3a3836',u*0.07);TH.ln(c,[(x+ex)/2,(y+ey)/2],[(x+ex)/2+(r()-0.5)*u*0.7,(y+ey)/2-u*0.4],'#3a3836',u*0.05);}}},
  mushrooms:{cat:'shrub',rho:0.04,draw(c,x,y,u,v){const r=mulberry(v*7+2);TH.ell(c,x+u*0.15,y+u*0.08,u*0.8,u*0.24,'rgba(6,12,10,.3)');const g=c.createRadialGradient(x,y-u*0.5,0,x,y-u*0.5,u*1.6);g.addColorStop(0,'rgba(160,240,140,.22)');g.addColorStop(1,'rgba(160,240,140,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*0.5,u*1.6,0,7);c.fill();for(let k=0;k<5;k++){const mx=x+(k-2)*u*0.35+(r()-0.5)*u*0.2,my=y-(r()*u*0.25),h=u*(0.5+r()*0.5);TH.ln(c,[mx,my],[mx,my-h],'#d8dcc0',u*0.14);TH.ell(c,mx,my-h,u*(0.28+r()*0.14),u*0.17,k%2?'#b8d890':'#c8e0a0');TH.ell(c,mx-u*0.06,my-h-u*0.04,u*0.08,u*0.05,'#f0f8d8');}}},
  fernDark:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(6,12,10,.28)');for(let k=0;k<9;k++){const a=-Math.PI+0.15+k/8*(Math.PI-0.3),len=u*(1.1+r()*0.45),ex=x+Math.cos(a)*len,ey=y-u*0.1+Math.sin(a)*len*0.6+len*0.4;c.lineCap='round';c.strokeStyle=k%2?'#183a24':'#10281a';c.lineWidth=u*0.4;c.beginPath();c.moveTo(x,y-u*0.1);c.quadraticCurveTo(x+Math.cos(a)*len*0.55,y-u*0.1+Math.sin(a)*len*0.7-len*0.25,ex,ey);c.stroke();}}},
  grassDead:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);for(let k=0;k<13;k++){const a=-1.1+k/12*2.2+(r()-0.5)*0.2,l=u*(0.7+r()*0.8);TH.ln(c,[x+(r()-0.5)*u*0.6,y],[x+Math.sin(a)*l*0.8+(r()-0.5)*u*0.3,y-l],['#4a5240','#3a4234','#5a6250'][k%3],u*0.09);}}},
  darkStones:{cat:'rock',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.8,'#5a5e66'],[0.7,0.2,0.8,0.7,'#666a72'],[0,-0.35,0.7,0.6,'#4c5058']].forEach(([dx,dy,rx,ry,col])=>{const px=x+dx*u,py=y+dy*u,sx=u*rx,sy=u*ry*(1+r()*0.2);TH.ell(c,px+sx*0.15,py+sy*0.3,sx*1.05,sy*0.45,'rgba(6,12,10,.3)');TH.poly(c,[[px-sx,py],[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px-sx*0.6,py+sy*0.2]],col);TH.poly(c,[[px+sx*0.25,py-sy*0.98],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px+sx*0.2,py+sy*0.05]],shade(col,-0.3));TH.poly(c,[[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.1,py-sy*0.5],[px-sx*0.5,py-sy*0.45]],'#2f4a32');});}},
  crumbledWall:{cat:'rock',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*7+2),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.5,y+u*0.12,u*2.4,u*0.4,'rgba(6,12,10,.3)');GBOX(c,x,y,u,-2.0,0.6,-0.3,0.3,0,0.9,'#5a5e66');GBOX(c,x,y,u,0.6,1.3,-0.3,0.3,0,0.5,'#666a72');GBOX(c,x,y,u,-2.0,-1.2,-0.3,0.3,0.9,1.4,'#6a6e76');for(let k=0;k<6;k++)TH.ln(c,I(-1.9+k*0.5,0.31,0.3),I(-1.6+k*0.5,0.31,0.3),'rgba(8,12,12,.4)',u*0.05);GBOX(c,x,y,u,1.5,2.1,0.5,1.0,0,0.3,'#4c5058');for(let k=0;k<5;k++)TH.blob(c,...I(-1.8+r()*3.6,0,0.95),u*0.3,u*0.2,'#2a4a30',r,6);}},
  /* ---------- church ruins (small pieces; the cathedral is the weenie) ---------- */
  chapelRuin:{cat:'ruin',rho:0.14,draw(c,x,y,u,v){const r=mulberry(v*5+3),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),JY=(a,z)=>I(a,1.31,z),JX=(a,z)=>I(1.61,a,z);GFLIP(c,x,v&1,()=>{
      GSH(c,x,y,u*3.4);
      /* collapsed left wall + rubble */
      GBOX(c,x,y,u,-1.6,-1.35,-2.0,0.4,0,0.9,GSTONE_D);GBOX(c,x,y,u,-1.6,-1.35,-2.0,-1.2,0.9,1.6,GSTONE_D);
      /* right (long) wall with three empty lancets and a stepped broken top */
      const xr=1.35,wall=[I(xr+0.25,-2.0,0),I(xr+0.25,1.3,0),I(xr+0.25,1.3,2.6),I(xr+0.25,0.8,2.9),I(xr+0.25,0.3,2.2),I(xr+0.25,-0.3,2.5),I(xr+0.25,-0.8,1.7),I(xr+0.25,-1.3,2.3),I(xr+0.25,-2.0,2.0)];
      const holes=[-1.45,-0.35,0.75].map(yc=>GLANCET((a,z)=>I(xr+0.25,a,z),yc,0.22,0.7,1.5,2.0));
      GBOX(c,x,y,u,xr,xr+0.25,-2.0,1.3,0,0.2,GSTONE_D);GWALLHOLES(c,wall,holes,GSTONE);for(let k=0;k<5;k++)TH.ln(c,I(xr+0.26,-2.0,0.3+k*0.45),I(xr+0.26,1.3,0.3+k*0.45),'rgba(8,12,12,.26)',u*0.05);
      [[-1.9,0.3],[-0.9,0.4],[0.1,0.3]].forEach(([yy,w])=>GBOX(c,x,y,u,xr+0.25,xr+0.55,yy,yy+w,0,1.7,GSTONE_L));
      /* gable end: tall, with a big lancet and a broken rose window */
      const gw=[I(-1.6,1.3,0),I(1.6,1.3,0),I(1.6,1.3,2.5),I(1.2,1.3,3.0),I(0.9,1.3,4.1),I(0.3,1.3,3.6),I(-0.15,1.3,4.5),I(-0.7,1.3,3.7),I(-1.1,1.3,3.2),I(-1.6,1.3,2.6)];
      const big=GLANCET(JY,0,0.5,0.7,2.0,3.2),rose=[];for(let k=0;k<16;k++){const a=k/16*6.283;rose.push(I(0+Math.cos(a)*0.42,1.3,3.45+Math.sin(a)*0.42));}
      GWALLHOLES(c,gw,[big],GSTONE_L);GBOX(c,x,y,u,1.6,1.85,0.5,1.3,0,2.5,GSTONE_D);
      c.beginPath();GPATH(c,rose);c.fillStyle='#0b1210';c.fill();c.strokeStyle='#4c5058';c.lineWidth=u*0.07;c.stroke();for(let k=0;k<5;k++){const a=k/5*6.283;TH.ln(c,I(0,1.31,3.45),I(Math.cos(a)*0.42,1.31,3.45+Math.sin(a)*0.42),'#4c5058',u*0.05);}
      for(let k=0;k<5;k++)TH.ln(c,I(-1.55,1.31,0.35+k*0.55),I(1.55,1.31,0.35+k*0.55),'rgba(8,12,12,.24)',u*0.05);
      /* fallen roof timbers, rubble, ivy */
      TH.ln(c,I(-0.8,-1.2,1.5),I(0.9,0.3,0.4),'#2a1f16',u*0.2);TH.ln(c,I(-0.4,-1.8,1.1),I(0.6,-0.5,0.3),'#1f1710',u*0.18);for(let k=0;k<9;k++)TH.poly(c,[[...I(-1.0+r()*2.2,-1.6+r()*3.0,0.1)].map((q,i)=>q+(i?0:0)),[...I(-1.0+r()*2.2,-1.6+r()*3.0,0.1)]].length?[I(-0.9+r()*2.0,-1.5+r()*2.8,0.05),I(-0.9+r()*2.0,-1.5+r()*2.8,0.05),I(-0.9+r()*2.0,-1.5+r()*2.8,0.05)]:[],r()<0.5?GSTONE:GSTONE_D);
      GIVYBLOBS(c,x+u*0.4,y-u*1.0,u,r,9,4.4);GIVYBLOBS(c,x-u*1.0,y-u*2.6,u,r,5,2.0);for(let k=0;k<5;k++)TH.ln(c,I(-1.4+r()*2.8,1.32,3.0),I(-1.4+r()*2.8,1.32,1.2+r()*1.0),'#27452f',u*0.1);});}},
  gothicArch:{cat:'ruin',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*9+4),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),JY=(a,z)=>I(a,0.31,z);GFLIP(c,x,v&1,()=>{GSH(c,x,y,u*2.0);
      const out=[I(-1.4,0.31,0),I(1.4,0.31,0),I(1.4,0.31,2.4),I(0.9,0.31,3.0),I(0.5,0.31,4.0),I(0,0.31,3.3),I(-0.7,0.31,3.7),I(-1.0,0.31,3.1),I(-1.4,0.31,2.6)];GBOX(c,x,y,u,-1.4,1.4,-0.3,0.3,0,0.25,GSTONE_D);GBOX(c,x,y,u,1.4,1.65,-0.3,0.3,0,2.4,GSTONE_D);
      GWALLHOLES(c,out,[GLANCET(JY,0,0.62,0.25,1.7,2.9)],GSTONE);for(let k=0;k<6;k++)TH.ln(c,I(-1.35,0.32,0.4+k*0.4),I(-0.8,0.32,0.4+k*0.4),'rgba(8,12,12,.26)',u*0.05);GIVYBLOBS(c,x+u*0.4,y-u*1.0,u,r,6,2.6);for(let k=0;k<4;k++)TH.poly(c,[I(1.5+r()*0.8,0.6+r()*0.6,0.05),I(1.5+r()*0.8,0.6+r()*0.6,0.05),I(1.5+r()*0.8,0.6+r()*0.6,0.05)],GSTONE_D);});}},
  ruinedWall:{cat:'ruin',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*7+2),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),JY=(a,z)=>I(a,0.41,z);GFLIP(c,x,v&1,()=>{GSH(c,x,y,u*2.8);
      const out=[I(-2.2,0.41,0),I(2.2,0.41,0),I(2.2,0.41,1.6),I(1.5,0.41,2.1),I(0.8,0.41,1.5),I(0.1,0.41,2.4),I(-0.6,0.41,1.9),I(-1.4,0.41,2.6),I(-2.2,0.41,2.0)];GBOX(c,x,y,u,-2.2,2.2,-0.4,0.4,0,0.2,GSTONE_D);
      GWALLHOLES(c,out,[GLANCET(JY,-1.4,0.28,0.5,1.4,1.9),GLANCET(JY,0.2,0.28,0.5,1.3,1.7),GLANCET(JY,1.5,0.28,0.5,1.2,1.5)],GSTONE);for(let k=0;k<6;k++)TH.ln(c,I(-2.1,0.42,0.3+k*0.4),I(2.1,0.42,0.3+k*0.4),'rgba(8,12,12,.24)',u*0.05);
      GBOX(c,x,y,u,2.2,2.5,-0.4,0.4,0,1.5,GSTONE_L);for(let k=0;k<6;k++)TH.poly(c,[I(-2.0+r()*4.2,0.7+r()*0.8,0.05),I(-2.0+r()*4.2,0.7+r()*0.8,0.05),I(-2.0+r()*4.2,0.7+r()*0.8,0.05)],r()<0.5?GSTONE:GSTONE_D);GIVYBLOBS(c,x,y-u*0.8,u,r,8,4.6);});}},
  brokenColumns:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*9+6);GSH(c,x,y,u*2.3);[[-1.2,0.2,2.8],[0.0,-0.1,1.7],[1.2,0.3,0.9]].forEach(([dx,dy,h],i)=>{const px=x+dx*u,py=y+dy*u,w=u*0.45,gr=c.createLinearGradient(px-w,0,px+w,0);gr.addColorStop(0,GSTONE_L);gr.addColorStop(1,GSTONE_D);c.fillStyle=gr;c.fillRect(px-w,py-h*u,w*2,h*u);TH.ell(c,px,py,w,w*0.4,GSTONE_D);TH.ell(c,px,py-h*u,w,w*0.4,i===2?GSTONE:GSTONE_L);for(let k=1;k<4;k++)TH.ln(c,[px-w,py-h*u*k/4],[px+w,py-h*u*k/4+u*0.04],'rgba(8,12,12,.3)',u*0.05);});
    c.save();c.translate(x+u*2.0,y+u*0.6);c.rotate(-0.05);c.fillStyle=GSTONE;c.fillRect(-u*1.0,-u*0.4,u*2.0,u*0.8);TH.ell(c,-u*1.0,0,u*0.2,u*0.4,GSTONE_D);TH.ell(c,u*1.0,0,u*0.2,u*0.4,GSTONE_L);c.restore();GIVYBLOBS(c,x,y,u,r,4,3.0);}},
  graveyard:{cat:'ruin',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*5+9),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);GSH(c,x,y,u*2.6);TH.blob(c,x,y+u*0.1,u*2.5,u*0.9,'rgba(40,52,40,.5)',r,10);
    const stone=(X,Y,h,kind)=>{const b=I(X,Y,0),w=u*0.42;c.fillStyle='rgba(6,12,10,.4)';c.beginPath();c.ellipse(b[0]+u*0.25,b[1]+u*0.05,w*1.1,w*0.4,0,0,7);c.fill();const gr=c.createLinearGradient(b[0]-w,0,b[0]+w,0);gr.addColorStop(0,GSTONE_L);gr.addColorStop(1,GSTONE_D);c.fillStyle=gr;
      if(kind===0){c.beginPath();c.moveTo(b[0]-w,b[1]);c.lineTo(b[0]-w,b[1]-h*u);c.arc(b[0],b[1]-h*u,w,Math.PI,0);c.lineTo(b[0]+w,b[1]);c.closePath();c.fill();TH.ln(c,[b[0],b[1]-h*u*0.8],[b[0],b[1]-h*u*0.4],'rgba(8,12,12,.5)',u*0.06);TH.ln(c,[b[0]-w*0.4,b[1]-h*u*0.62],[b[0]+w*0.4,b[1]-h*u*0.62],'rgba(8,12,12,.5)',u*0.06);}
      else if(kind===1){c.fillRect(b[0]-w*0.28,b[1]-h*u,w*0.56,h*u);c.fillRect(b[0]-w*0.85,b[1]-h*u*0.78,w*1.7,w*0.5);}
      else{c.beginPath();c.moveTo(b[0]-w,b[1]);c.lineTo(b[0]-w*0.8,b[1]-h*u);c.lineTo(b[0]+w*0.8,b[1]-h*u*0.9);c.lineTo(b[0]+w,b[1]);c.closePath();c.fill();}};
    [[-1.3,-0.2,1.5,0],[-0.5,0.5,1.1,1],[0.4,-0.4,1.6,0],[1.1,0.4,0.9,2],[-0.1,-1.0,1.3,1],[1.6,-0.6,1.2,0]].sort((a,b)=>a[1]-b[1]).forEach(([X,Y,h,k])=>stone(X,Y+0.4,h,k));GIVYBLOBS(c,x,y+u*0.2,u,r,5,3.4);for(let k=0;k<3;k++)TH.ell(c,x+(r()-0.5)*u*3,y+u*(0.1+r()*0.4),u*0.1,u*0.08,['#8a6ac8','#b0b0c0','#a84a4a'][k]);
    /* a little wrought-iron fence */
    [-2.0,-1.0,0,1.0,2.0].forEach(X=>{const b=I(X,1.4,0);TH.ln(c,b,[b[0],b[1]-u*1.1],'#14161a',u*0.1);TH.poly(c,[[b[0]-u*0.1,b[1]-u*1.1],[b[0]+u*0.1,b[1]-u*1.1],[b[0],b[1]-u*1.45]],'#14161a');});TH.ln(c,I(-2.0,1.4,0.8),I(2.0,1.4,0.8),'#14161a',u*0.08);}},
  mausoleum:{cat:'ruin',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*9+6),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);GFLIP(c,x,v&1,()=>{GSH(c,x,y,u*2.4);GBOX(c,x,y,u,-1.3,1.3,-1.2,1.2,0,0.4,GSTONE_D);GBOX(c,x,y,u,-1.1,1.1,-1.0,1.0,0.4,2.4,GSTONE);for(let row=0;row<6;row++)for(let k=0;k<5;k++){const X=-1.05+k*0.45+(row%2)*0.2,Z=0.45+row*0.32;TH.ln(c,I(X,1.01,Z),I(X+0.4,1.01,Z),'rgba(8,12,12,.34)',u*0.05);}
      const JY=(a,z)=>I(a,1.02,z);c.beginPath();GPATH(c,GLANCET(JY,0,0.38,0.4,1.5,1.9));c.fillStyle='#0b1210';c.fill();c.strokeStyle='#4c5058';c.lineWidth=u*0.09;c.stroke();TH.ln(c,I(-0.05,1.03,0.5),I(-0.05,1.03,1.6),'#14161a',u*0.07);TH.ln(c,I(0.12,1.03,0.5),I(0.12,1.03,1.6),'#14161a',u*0.07);
      TH.poly(c,[I(-1.3,1.15,2.4),I(1.3,1.15,2.4),I(0,1.15,3.3)],GSTONE_L);TH.poly(c,[I(1.3,-1.15,2.4),I(1.3,1.15,2.4),I(0,1.15,3.3),I(0,-1.15,3.3)],GSTONE_D);const t=I(0,1.15,3.3);TH.ln(c,t,[t[0],t[1]-u*0.8],'#14161a',u*0.1);TH.ln(c,[t[0]-u*0.3,t[1]-u*0.5],[t[0]+u*0.3,t[1]-u*0.5],'#14161a',u*0.1);for(let k=0;k<3;k++)TH.poly(c,[I(-1.3+k*1.0,1.2,0.4),I(-0.8+k*1.0,1.2,0.4),I(-1.05+k*1.0,1.2,0.9)],'#2a4a30');GIVYBLOBS(c,x,y-u*0.4,u,r,6,2.4);});}},
  ruinedBelfry:{cat:'struct',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*9+6),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);GFLIP(c,x,v&1,()=>{GSH(c,x,y,u*2.0);GBOX(c,x,y,u,-1.15,1.15,-1.15,1.15,0,5.0,GSTONE);for(let row=0;row<15;row++){const Z=0.1+row*0.32;for(let k=0;k<5;k++){const X=-1.1+k*0.46+(row%2)*0.2;TH.ln(c,I(X,1.16,Z),I(X+0.4,1.16,Z),'rgba(8,12,12,.3)',u*0.05);}}
      GBOX(c,x,y,u,-1.0,1.0,-1.0,1.0,5.0,6.2,GSTONE_L);const JY=(a,z)=>I(a,1.01,z),JX=(a,z)=>I(1.01,a,z);[-0.45,0.45].forEach(X=>{c.beginPath();GPATH(c,GLANCET(JY,X,0.26,5.1,5.8,6.2));c.fillStyle='#0b1210';c.fill();});c.beginPath();GPATH(c,GLANCET(JX,0.0,0.3,5.1,5.8,6.2));c.fillStyle='#0b1210';c.fill();
      TH.poly(c,[I(-1.0,1.01,6.2),I(-0.4,1.01,6.2),I(-0.55,1.01,6.8),I(-0.9,1.01,6.5)],GSTONE_L);TH.poly(c,[I(0.2,1.01,6.2),I(1.0,1.01,6.2),I(1.0,1.01,6.6),I(0.6,1.01,7.0)],GSTONE_L);TH.poly(c,[I(1.01,-1.0,6.2),I(1.01,-0.2,6.2),I(1.01,-0.5,6.7)],GSTONE_D);
      c.beginPath();GPATH(c,GLANCET((a,z)=>I(a,1.17,z),0,0.34,0,1.0,1.5));c.fillStyle='#0b1210';c.fill();c.strokeStyle='#4c5058';c.lineWidth=u*0.08;c.stroke();GIVYBLOBS(c,x,y-u*1.5,u,r,8,2.4);GIVYBLOBS(c,x,y-u*4.2,u,r,5,2.2);const bp=I(0,0,6.8);GBAT(c,bp[0]-u*0.4,bp[1]-u*0.9,u*0.9);GBAT(c,bp[0]+u*0.9,bp[1]-u*1.6,u*0.7);});}},
  /* ---------- spooky cottages (13 per land at Immersive) ---------- */
  hauntedManor:GHOUSE('hauntedManor'),crookedTimber:GHOUSE('crookedTimber'),witchCottage:GHOUSE('witchCottage'),
  /* ---------- small props (lower tiers only) ---------- */
  gothicLamp:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(6,12,10,.3)');TH.ln(c,[x,y],[x,y-u*3.1],'#0e1014',u*0.22);TH.poly(c,[[x-u*0.3,y],[x+u*0.3,y],[x+u*0.15,y-u*0.5],[x-u*0.15,y-u*0.5]],'#0e1014');TH.ln(c,[x,y-u*2.95],[x+u*0.55,y-u*2.95],'#0e1014',u*0.12);const lx=x+u*0.55,ly=y-u*2.9,g=c.createRadialGradient(lx,ly-u*0.3,0,lx,ly-u*0.3,u*1.7);g.addColorStop(0,'rgba(190,255,140,.5)');g.addColorStop(1,'rgba(190,255,140,0)');c.fillStyle=g;c.beginPath();c.arc(lx,ly-u*0.3,u*1.7,0,7);c.fill();TH.poly(c,[[lx-u*0.25,ly],[lx+u*0.25,ly],[lx+u*0.2,ly-u*0.6],[lx-u*0.2,ly-u*0.6]],'#cfe8a0','#0e1014',u*0.06);TH.poly(c,[[lx-u*0.3,ly-u*0.6],[lx+u*0.3,ly-u*0.6],[lx,ly-u*0.95]],'#0e1014');}},
  brokenCart:{cat:'prop',rho:0.08,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.5,y+u*0.12,u*2.0,u*0.55,'rgba(6,12,10,.3)');TH.box(c,x,y,u,-1.3,1.0,-0.7,0.7,0.4,0.7,'#3a2c20','#241a12','#4a3a2a');for(let k=0;k<2;k++){const Y=k?0.71:-0.71;TH.poly(c,[I(-1.3,Y,0.7),I(1.0,Y,0.7),I(1.0,Y,1.2),I(-1.3,Y,1.2)],k?'#3a2c20':'#241a12');}TH.ln(c,I(-1.0,-0.7,1.2),I(-1.3,-0.7,0.5),'#241a12',u*0.14);const wheel=(X,Y,tilt)=>{const p=I(X,Y,0.45);c.strokeStyle='#241a12';c.lineWidth=u*0.14;c.beginPath();c.ellipse(p[0],p[1],u*0.55,u*0.55,tilt,0,7);c.stroke();for(let k=0;k<6;k++){const a=k/6*6.283;TH.ln(c,[p[0],p[1]],[p[0]+Math.cos(a)*u*0.5,p[1]+Math.sin(a)*u*0.5],'#241a12',u*0.06);}};wheel(0.4,0.8,0);TH.ln(c,I(1.0,0,0.5),I(2.2,0.3,0.15),'#241a12',u*0.16);TH.ell(c,...I(-0.9,1.3,0.12),u*0.5,u*0.12,'#241a12');}},
  ironFence:{cat:'prop',rho:0.09,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.3,y+u*0.1,u*2.0,u*0.35,'rgba(6,12,10,.2)');for(let k=0;k<7;k++){const b=I(-1.8+k*0.6,0,0),h=1.3+(k===3?-0.5:0);TH.ln(c,b,[b[0],b[1]-u*h],'#0e1014',u*0.1);TH.poly(c,[[b[0]-u*0.12,b[1]-u*h],[b[0]+u*0.12,b[1]-u*h],[b[0],b[1]-u*(h+0.35)]],'#0e1014');}TH.ln(c,I(-1.8,0,0.45),I(1.8,0,0.45),'#0e1014',u*0.08);TH.ln(c,I(-1.8,0,1.05),I(1.8,0,1.05),'#0e1014',u*0.08);}},
  pumpkins:{cat:'prop',rho:0.05,draw(c,x,y,u,v){const pk=(px,py,s,face)=>{TH.ell(c,px+s*u*0.2,py+s*u*0.1,s*u*0.7,s*u*0.25,'rgba(6,12,10,.3)');const g=c.createRadialGradient(px-s*u*0.2,py-s*u*0.7,0,px,py-s*u*0.5,s*u*0.9);g.addColorStop(0,'#e8892a');g.addColorStop(1,'#9a4a14');c.fillStyle=g;c.beginPath();c.ellipse(px,py-s*u*0.45,s*u*0.62,s*u*0.5,0,0,7);c.fill();for(let k=-1;k<=1;k++)TH.ln(c,[px+k*s*u*0.28,py-s*u*0.05],[px+k*s*u*0.2,py-s*u*0.9],'rgba(90,40,10,.4)',s*u*0.06);TH.ln(c,[px,py-s*u*0.9],[px+s*u*0.1,py-s*u*1.15],'#4a3a1a',s*u*0.14);if(face){c.fillStyle='#ffd84a';TH.poly(c,[[px-s*u*0.3,py-s*u*0.62],[px-s*u*0.1,py-s*u*0.62],[px-s*u*0.2,py-s*u*0.8]],'#ffd84a');TH.poly(c,[[px+s*u*0.1,py-s*u*0.62],[px+s*u*0.3,py-s*u*0.62],[px+s*u*0.2,py-s*u*0.8]],'#ffd84a');c.beginPath();c.moveTo(px-s*u*0.32,py-s*u*0.32);c.quadraticCurveTo(px,py-s*u*0.15,px+s*u*0.32,py-s*u*0.32);c.lineTo(px+s*u*0.2,py-s*u*0.4);c.lineTo(px-s*u*0.2,py-s*u*0.4);c.closePath();c.fill();}};pk(x-u*0.7,y+u*0.1,0.8,false);pk(x+u*0.6,y+u*0.15,0.95,true);pk(x,y-u*0.15,0.75,false);}},
  scarecrow:{cat:'prop',rho:0.05,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.9,u*0.28,'rgba(6,12,10,.3)');TH.ln(c,[x,y],[x,y-u*3.2],'#3a2c1c',u*0.22);TH.ln(c,[x-u*1.3,y-u*2.3],[x+u*1.3,y-u*2.1],'#3a2c1c',u*0.2);TH.poly(c,[[x-u*0.5,y-u*2.4],[x+u*0.5,y-u*2.4],[x+u*0.45,y-u*1.0],[x-u*0.45,y-u*1.0]],'#2a2630');for(let k=0;k<4;k++)TH.ln(c,[x-u*0.4+k*u*0.27,y-u*1.0],[x-u*0.45+k*u*0.3,y-u*0.55],'#c9a85a',u*0.07);TH.ell(c,x,y-u*3.0,u*0.42,u*0.42,'#b8a070');TH.poly(c,[[x-u*0.55,y-u*3.25],[x+u*0.55,y-u*3.25],[x+u*0.3,y-u*3.5],[x,y-u*4.0],[x-u*0.3,y-u*3.5]],'#1a1620');TH.ell(c,x-u*0.14,y-u*3.02,u*0.07,u*0.07,'#1a1410');TH.ell(c,x+u*0.14,y-u*3.02,u*0.07,u*0.07,'#1a1410');for(let k=0;k<5;k++)TH.ln(c,[x+u*1.3,y-u*2.1],[x+u*1.3+(k-2)*u*0.12,y-u*1.6],'#c9a85a',u*0.06);const cx=x+u*1.5,cy2=y-u*2.9;c.fillStyle='#07070a';c.beginPath();c.ellipse(cx,cy2,u*0.28,u*0.17,0.2,0,7);c.fill();TH.poly(c,[[cx+u*0.24,cy2-u*0.05],[cx+u*0.5,cy2+u*0.02],[cx+u*0.24,cy2+u*0.1]],'#07070a');}}
};

/* ===== MACRO-LAND ENGINE (hex geometry, path network, planner, baker) ===== */
const W3=Math.sqrt(3),HX=W3/2,HV=[[HX,0.29],[0,0.58],[-HX,0.29],[-HX,-0.29],[0,-0.58],[HX,-0.29]];
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[0,1,2],[-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5,1.5]]};
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

/* ---- generic baker (any theme object {assets, plan, ground, groundCol, seeds}) ---- */
const LAND_BAKE_CACHE={};
function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};
  const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol;
  const clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]);
  const key=[T.id,shape,tier,R,Math.round(R*sc),sc,m,ground,JSON.stringify(clr)].join('|');
  if(LAND_BAKE_CACHE[key])return LAND_BAKE_CACHE[key];
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX;
  const mx=0.75,top=T.top||1.35,bot=0.85,W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R);
  const ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const back=document.createElement('canvas');back.width=Math.ceil(W*sc);back.height=Math.ceil(H*sc);
  const cb=back.getContext('2d');cb.scale(sc,sc);T.ground(cb,G,R,ox,oy,m,ground,shape==='A'?11:22);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]);
  const vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho)));
  const rowYs=[...new Set(G.centers.map(c=>c.y))].sort((a,b)=>a-b),objectsByBand=rowYs.map(()=>[]);
  vis.forEach(o=>{let band=0;while(band<rowYs.length-1&&o.y>=(rowYs[band]+rowYs[band+1])/2)band++;objectsByBand[band].push(o);});
  const bands=objectsByBand.map((objects,index)=>{
    let bx0=W,by0=H,bx1=0,by1=0;
    objects.forEach(o=>{const px=ox+m*o.x*R,py=oy+o.y*R,s=(o.scale||1)*u;bx0=Math.min(bx0,px-4*s);bx1=Math.max(bx1,px+4*s);by0=Math.min(by0,py-9*s);by1=Math.max(by1,py+2*s);});
    if(!objects.length)return{canvas:null,rect:{x:0,y:0,w:0,h:0},depth:oy+rowYs[index]*R};
    bx0=Math.max(0,Math.floor(bx0));by0=Math.max(0,Math.floor(by0));bx1=Math.min(W,Math.ceil(bx1));by1=Math.min(H,Math.ceil(by1));
    const w=bx1-bx0,h=by1-by0,canvas=document.createElement('canvas');canvas.width=Math.ceil(w*sc);canvas.height=Math.ceil(h*sc);
    const cg=canvas.getContext('2d');cg.scale(sc,sc);cg.translate(-bx0,-by0);
    objects.sort((a,b)=>a.y-b.y).forEach(o=>T.assets[o.kind].draw(cg,ox+m*o.x*R,oy+o.y*R,u*(o.scale||1),o.v));
    return{canvas,rect:{x:bx0,y:by0,w,h},depth:oy+rowYs[index]*R};
  });
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return LAND_BAKE_CACHE[key]={back,bands,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0};
}function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}

/* ===== GOTHIC LAND: planner (same tree + house counts as the medieval land, very dark trees, spooky homes, church ruins), murky ground ===== */
const GOTHIC_REGION={top:{gnarledOak:.28,blackPine:.22,deadTree:.1,darkPoplar:.08,weepingDark:.04,yewDark:.14,twistedSapling:.14},mid:{gnarledOak:.3,blackPine:.2,deadTree:.1,darkPoplar:.08,weepingDark:.05,yewDark:.14,twistedSapling:.13},bottom:{gnarledOak:.22,blackPine:.16,deadTree:.1,darkPoplar:.04,weepingDark:.05,yewDark:.18,twistedSapling:.25}};
const GOTHIC_LOW=[['twistedSapling',1],['yewDark',0.72],['twistedSapling',1.2],['blackPine',0.55],['yewDark',0.85],['twistedSapling',0.9],['deadTree',0.6]];
const GOTHIC_CAP={deadTree:12,weepingDark:4,darkPoplar:8,yewDark:12};
const GOTHIC_UNDER=['thornBush','deadBrush','mushrooms','fernDark','grassDead','thornBush','mushrooms','darkStones','grassDead'];
const GOTHIC_PLAN_CACHE={};
function getGothicPlan(shape){
  if(GOTHIC_PLAN_CACHE[shape])return GOTHIC_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(shape==='A'?7301:8402),placed=[],bb=G.bbox,used={},A=GOTHIC_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.66);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'gnarledOak';};
  const capOk=k=>!(GOTHIC_CAP[k]&&(used[k]||0)>=GOTHIC_CAP[k]);
  const regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?GOTHIC_REGION.top:n<0.68?GOTHIC_REGION.mid:GOTHIC_REGION.bottom;};
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='tree'?0.88+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;if((D.cat==='tree'||D.cat==='shrub'||D.cat==='prop')&&placed.some(o=>o.noSouth&&Math.abs(px-o.x)<0.3&&py-o.y>-0.05&&py-o.y<0.36))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const tree=(x,y,extra,dom,low)=>{if(low){const L=GOTHIC_LOW[Math.floor(rng()*GOTHIC_LOW.length)];return place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return place(dom&&rng()<0.55&&capOk(dom)?dom:pickFrom(regionOf(y),capOk),x,y,extra||{});};
  const under=(x,y,extra)=>place(GOTHIC_UNDER[Math.floor(rng()*GOTHIC_UNDER.length)],x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. the back rim carries just the ruined chapel (no tree backdrop: the trees there are the same density as everywhere else) */
  {const pts=[];top.forEach(e=>[0.3,0.5,0.7].forEach(t=>pts.push(onEdge(e,t,0.0))));const p=pts.reduce((b,q)=>Math.abs(q[0]-cx)<Math.abs(b[0]-cx)?q:b);for(const [dx,dy] of [[0,-0.02],[0.3,0],[-0.3,0],[0,0.04]]){const o=place('chapelRuin',p[0]+dx,p[1]+dy,{minT:1,scale:1.15,clear:2.4,noSouth:true});if(o)break;}}
  /* 2. spooky homes: 6 on the rim (spread by farthest-point), 7 through the middle, then ONE ruined belfry beside a manor */
  const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.filter(e=>e.vertical).forEach(e=>inn.push([e.mid[0],e.mid[1]]));
  const chosen=placed.filter(o=>o.cat==='ruin'||o.cat==='struct').map(o=>[o.x,o.y]),manors=[];
  const spread=(k,pool,extra)=>{const ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.22})).sort((a,b)=>b.d-a.d);for(let n=0;n<Math.min(12,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],extra);if(o){chosen.push([o.x,o.y]);if(k==='hauntedManor')manors.push(o);return o;}}return null;};
  [['crookedTimber',1],['witchCottage',2],['hauntedManor',3],['crookedTimber',3],['witchCottage',4],['hauntedManor',4]].forEach(([k,mt])=>spread(k,rim,{minT:mt,scale:1.15,clear:2.5,noSouth:true}));
  [['witchCottage',2],['hauntedManor',2],['crookedTimber',3],['witchCottage',3],['crookedTimber',4],['hauntedManor',4],['witchCottage',4]].forEach(([k,mt])=>spread(k,inn,{minT:mt,scale:1.0,clear:3.0,noSouth:true}));
  {const home=manors[manors.length-1]||placed.find(o=>o.cat==='struct');if(home){for(const [dx,dy] of [[0.36,-0.08],[-0.36,-0.08],[0.3,0.12],[-0.3,0.12],[0.44,0.0],[-0.44,0.0]]){const o=place('ruinedBelfry',home.x+dx,home.y+dy,{minT:4,scale:1.0,clear:2.4,noSouth:true});if(o)break;}}}
  /* 2b. church ruins scattered through the land (farthest-point spacing): arches, broken walls, graveyards, a mausoleum, fallen columns */
  [['gothicArch',1],['graveyard',2],['ruinedWall',2],['gothicArch',3],['mausoleum',3],['brokenColumns',3],['graveyard',4],['ruinedWall',4],['gothicArch',4]].forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,scale:k==='graveyard'||k==='mausoleum'?1.1:1.0,clear:1.6,noSouth:true}));
  /* 3. trees: very dark, same dense dials as the medieval land (and the top rim is treated exactly like every other edge) */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=pickFrom(regionOf(v.y),capOk),n=2+Math.floor(rng()*1.9);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.09:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{const dom=pickFrom(regionOf(e.mid[1]),capOk);[-0.27,0,0.27].forEach(dy=>{if(rng()<0.72)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.72)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.8+rng()*0.2},null,true);if(rng()<0.22)tree(e.mid[0]+(rng()-0.5)*0.34,e.mid[1]+(rng()-0.5)*0.14,{scale:0.78+rng()*0.2},null,true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.26));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(rng()-0.2)*0.12)});});
    let mode='grove',run=0,dom='gnarledOak';samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.74?'grove':r<0.92?'sparse':'open';run=2+Math.floor(rng()*4);dom=pickFrom(regionOf(s.p[1]),capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){tree(p[0],p[1],null,dom,low);if(rng()<0.55)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,dom,low);if(rng()<0.2)tree(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,dom,true);if(rng()<0.14)tree(p[0]+(rng()-0.5)*0.34,p[1]-0.2,null,dom,low);}
      else if(mode==='sparse'){if(rng()<0.5)tree(p[0],p[1],null,dom,low);else under(p[0],p[1]);}else if(rng()<0.6)under(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.8)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<14;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.38)tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);}});
  /* 3c. balance the rim: the top, the sides and the bottom must carry the same tree density per unit of boundary (thin the heavy edges, fill the light ones) */
  {const dEdge=(x,y,e)=>{const dx=e.b[0]-e.a[0],dy=e.b[1]-e.a[1],t=Math.max(0,Math.min(1,((x-e.a[0])*dx+(y-e.a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-(e.a[0]+dx*t),(y-(e.a[1]+dy*t))*1.4);};
    const classes=['top','side','bottom'],len={top:0,side:0,bottom:0};outer.forEach(e=>len[e.cls]+=e.len);
    const members=()=>{const m={top:[],side:[],bottom:[]};placed.filter(o=>o.cat==='tree').forEach(o=>{let best=null,bd=1e9;outer.forEach(e=>{const d=dEdge(o.x,o.y,e);if(d<bd){bd=d;best=e;}});if(bd<0.32)m[best.cls].push(o);});return m;};
    let m=members();const mean=(m.top.length+m.side.length+m.bottom.length)/(len.top+len.side+len.bottom);
    classes.forEach(cl=>{const target=Math.round(len[cl]*mean);let list=m[cl];
      if(list.length>target+1){const drop=list.length-target;for(let i=0;i<drop;i++){const pick=list.splice(Math.floor(rng()*list.length),1)[0],ix=placed.indexOf(pick);if(ix>=0)placed.splice(ix,1);}}
      else if(list.length<target-1){const need=target-list.length,es=outer.filter(e=>e.cls===cl);let added=0,guard=0;while(added<need&&guard++<160){const e=es[Math.floor(rng()*es.length)],p=onEdge(e,rng(),(rng()-0.2)*0.12);if(tree(p[0],p[1],null,null,cl!=='top'))added++;}}});}
  /* 4. undergrowth: thorn bushes, dead brush, glowing mushrooms, dark ferns */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.45)under(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.35)under(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.38)under(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.3)under(px,py);}});
  /* 5. small props: lower tiers only */
  [['gothicLamp',2],['brokenCart',1],['ironFence',2],['pumpkins',2],['scarecrow',1]].forEach(([k,n])=>{for(let i=0;i<n;i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  /* every house gets a facing (bit0 mirror, bit1 gable/eave); neighbours cycle through all four */
  {const houses=placed.filter(o=>/^(hauntedManor|crookedTimber|witchCottage)$/.test(o.kind)).sort((a,b)=>a.x-b.x||a.y-b.y),cyc=[0,3,1,2];houses.forEach((o,i)=>{o.v=((o.v>>2)<<2)|cyc[i%4];});placed.filter(o=>o.kind==='ruinedBelfry'||o.kind==='chapelRuin').forEach(o=>{o.v=((o.v>>2)<<2)|(rng()<0.5?1:0);});}
  const cuts={tree:[0.2,0.52,0.8,1],shrub:[0.06,0.38,0.7,1],rock:[0.3,0.55,0.8,1],prop:[1,1,1,1],struct:[0,0,0,0],ruin:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='struct'||o.cat==='ruin')o.tier=o.minT;});
  const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
  for(let t=1;t<=4;t++){let guard=0;while(guard++<300){const c=count(t);if(c.tr/Math.max(1,c.n)>=0.68)break;const pool=placed.filter(o=>o.tier<=t&&t<=o.maxT),cand=(pool.filter(o=>o.cat==='shrub').sort((a,b)=>b.pri-a.pri)[0])||(pool.filter(o=>o.prop&&o.minT>1).sort((a,b)=>b.pri-a.pri)[0]);if(!cand)break;cand.tier=Math.min(5,cand.tier+1);}}
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.sort((a,b)=>a.y-b.y);
  return GOTHIC_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: murky grey-green earth, drifting ground mist, moss, dead grass and fallen leaves, a few faint wisps (decals, not objects) ---- */
function gothicGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<46;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'120,140,118':'28,40,32',r()<0.5?0.22:0.26);}
  for(let k=0;k<12;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'60,44,34',0.2);}                    /* bare earth */
  for(let k=0;k<12;k++){const p=pt(),w=R*(0.5+r()*0.9);soft(p[0],p[1],w,w*0.36,'205,218,212',0.13);}              /* ground mist */
  for(let k=0;k<10;k++){const p=pt(),w=R*(0.25+r()*0.4);soft(p[0],p[1],w,w*0.4,'58,96,64',0.22);}                 /* moss */
  for(let k=0;k<110;k++){const p=pt(),a=r()*3.14,l=R*(0.025+r()*0.03);TH.ln(c,[p[0],p[1]],[p[0]+Math.cos(a)*l,p[1]+Math.sin(a)*l*0.5],r()<0.5?'rgba(60,40,26,.6)':'rgba(40,30,22,.55)',R*0.01);}   /* fallen leaves */
  for(let k=0;k<150;k++){const p=pt(),h=R*(0.05+r()*0.06);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#4a5240','#3a4234','#586048'][(k+j)%3],R*0.011);}
  for(let k=0;k<26;k++){const p=pt();TH.ell(c,p[0],p[1],R*(0.015+r()*0.012),R*0.01,'rgba(120,124,132,.55)');}
  for(let k=0;k<6;k++){const p=pt();soft(p[0],p[1],R*0.06,R*0.05,'170,255,150',0.35);}
  c.restore();c.restore();
}
const GOTHIC_THEME={id:'gothic',assets:GOTHIC_ASSETS,plan:getGothicPlan,ground:gothicGround,groundCol:'#5e6a5f',top:1.5};
const GOTHIC_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
function bakeLandGothic(shape,tier,R,opts){return bakeLandTheme(GOTHIC_THEME,shape,tier,R,opts);}
function drawLandGothicBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandGothicDepthBand(ctx,x,y,land,index){const band=land.bands[index];if(!band||!band.canvas)return;const r=band.rect;ctx.drawImage(band.canvas,x-land.ox+r.x,y-land.oy+r.y,r.w,r.h);}
function drawLandGothicFront(ctx,x,y,land){land.bands.forEach((_,index)=>drawLandGothicDepthBand(ctx,x,y,land,index));}
return Object.freeze({bake:bakeLandGothic,drawBack:drawLandGothicBack,drawDepthBand:drawLandGothicDepthBand,drawFront:drawLandGothicFront});
})();
const bavarianLandMacroPack = (() => {
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

/* ===== BAVARIAN ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const BSH=(c,x,y,rx)=>{c.fillStyle='rgba(40,56,24,.26)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const BBLUE='#2a6ab0',BWHITE='#f6f3ea',BWOOD='#8a5a33',BWOOD_D='#5a3a22',BCREAM='#f4ecd8';
const BBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.26),shade(col,0.12));
const BFLIP=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
const BPATH=(c,pts)=>{pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();};
/* a small blue-and-white chequered flag on a pole (the Bavarian lozenge look) */
const BFLAG=(c,x,y,u,s)=>{TH.ln(c,[x,y],[x,y-u*1.8*s],'#5a3a22',u*0.07*s);const fx=x+u*0.05*s,fy=y-u*1.75*s,w=u*0.9*s,h=u*0.55*s,n=4;for(let i=0;i<n;i++)for(let j=0;j<2;j++){TH.poly(c,[[fx+i*w/n,fy+j*h/2+Math.sin(i)*u*0.03],[fx+(i+1)*w/n,fy+j*h/2+Math.sin(i+1)*u*0.03],[fx+(i+1)*w/n,fy+(j+1)*h/2+Math.sin(i+1)*u*0.03],[fx+i*w/n,fy+(j+1)*h/2+Math.sin(i)*u*0.03]],(i+j)%2?BWHITE:BBLUE);}};
const BHEART=(c,x,y,r,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(x,y+r*0.9);c.bezierCurveTo(x-r*1.6,y-r*0.2,x-r*0.7,y-r*1.2,x,y-r*0.4);c.bezierCurveTo(x+r*0.7,y-r*1.2,x+r*1.6,y-r*0.2,x,y+r*0.9);c.fill();};
const BFCON=(c,x,y,u,o,r)=>{const h=u*o.h,w=u*o.w,n=o.tiers,bare=o.bare===undefined?0.16:o.bare;TH.ln(c,[x,y],[x,y-h*(bare+0.1)],'#5a3b22',u*(o.tw||0.42));for(let i=0;i<n;i++){const t=i/n,ww=w*(1-0.8*t)*(0.92+r()*0.16),yb=y-h*(bare+(0.9-bare)*t),tip=yb-h*(o.layer||0.34);TH.poly(c,[[x-ww,yb],[x-ww*0.55,yb-h*0.032],[x-ww*0.2,yb+h*0.012],[x+ww*0.25,yb-h*0.032],[x+ww*0.6,yb+h*0.01],[x+ww,yb],[x,tip]],o.c1);TH.poly(c,[[x,tip],[x+ww,yb],[x+ww*0.6,yb+h*0.01],[x+ww*0.25,yb-h*0.032],[x,yb]],o.c2);}};
/* ---- cheerful houses: one parametric body, 4 orientations (gable/eave front x mirror), balconies with geraniums, heart shutters ---- */
const BHOUSE_T={
  farmhouse:{ha:1.35,hb:1.95,h1:1.5,h2:1.2,jet:0.1,lower:'#f6efdc',upper:'#f6efdc',timber:'#6a4428',roof:'#8a5a3a',roofD:'#6a4028',rise:1.25,ov:0.6,style:'farm',sw:3.3,sh:1.0},
  chalet:{ha:1.25,hb:1.8,h1:1.4,h2:1.4,jet:0.18,lower:'#efe4cc',upper:'#9a6a40',timber:'#5a3a22',roof:'#7a5034',roofD:'#5a3822',rise:1.4,ov:0.7,style:'chalet',sw:3.0,sh:0.95},
  paintedHouse:{ha:1.3,hb:1.8,h1:1.5,h2:1.3,jet:0.0,lower:'PASTEL',upper:'PASTEL',timber:'#f6f3ea',roof:'#c0553a',roofD:'#9a3f2a',rise:1.9,ov:0.4,style:'painted',sw:3.0,sh:0.95}
};
const BPASTEL=['#f6dc8a','#f2b8b0','#b8d6ea','#cfe6bc','#f4c8a0','#e8d0ec'],BSHUT=['#2f7a4a','#2a6ab0','#b5362b','#2f7a4a'];
function BHOUSE_BODY(c,x,y,u,s,eave,T){const r=mulberry(s*7+3),Iw=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),L=(a,b,z)=>eave?Iw(b,a,z):Iw(a,b,z),LBOX=(a0,a1,b0,b1,z0,z1,col)=>eave?BBOX(c,x,y,u,b0,b1,a0,a1,z0,z1,col):BBOX(c,x,y,u,a0,a1,b0,b1,z0,z1,col);
  const pastel=BPASTEL[s%BPASTEL.length],lower=T.lower==='PASTEL'?pastel:T.lower,upper=T.upper==='PASTEL'?pastel:T.upper,shut=BSHUT[s%4];
  const ha=T.ha,hb=T.hb,jet=T.jet,ha2=ha+jet,hb2=hb+jet,zw=T.h1+T.h2,zr=zw+T.rise;
  const faces=(aa,bb)=>[{J:(a,z)=>L(a,bb+0.012,z),p0:-aa,p1:aa},{J:(b,z)=>L(aa+0.012,b,z),p0:-bb,p1:bb}];
  const F1=faces(ha,hb)[0],F2=faces(ha,hb)[1],G1=faces(ha2,hb2)[0],G2=faces(ha2,hb2)[1];
  LBOX(-ha,ha,-hb,hb,0,T.h1,lower);LBOX(-ha2,ha2,-hb2,hb2,T.h1,zw,upper);
  const quad=(F,p0,p1,z0,z1,col,stroke)=>TH.poly(c,[F.J(p0,z0),F.J(p1,z0),F.J(p1,z1),F.J(p0,z1)],col,stroke,stroke?u*0.05:0);
  /* trim: timber corner posts and a story band; boards on a chalet; a blue lozenge frieze under the eaves */
  [G1,G2].forEach(F=>{if(T.style==='chalet'){for(let k=0;k<12;k++){const p=F.p0+(F.p1-F.p0)*k/12;TH.ln(c,F.J(p,T.h1),F.J(p,zw),'rgba(40,24,12,.35)',u*0.05);}}
    quad(F,F.p0,F.p1,T.h1-0.05,T.h1+0.09,T.timber);TH.ln(c,F.J(F.p0,T.h1),F.J(F.p0,zw),T.timber,u*0.12);TH.ln(c,F.J(F.p1,T.h1),F.J(F.p1,zw),T.timber,u*0.12);
    const nL=Math.round((F.p1-F.p0)/0.28);for(let k=0;k<nL;k++){const p=F.p0+(F.p1-F.p0)*(k+0.5)/nL,w=(F.p1-F.p0)/nL*0.4;TH.poly(c,[F.J(p-w,zw-0.1),F.J(p,zw-0.2),F.J(p+w,zw-0.1),F.J(p,zw)],k%2?BBLUE:BWHITE);}});
  [F1,F2].forEach(F=>{TH.ln(c,F.J(F.p0,0),F.J(F.p0,T.h1),T.timber,u*0.12);TH.ln(c,F.J(F.p1,0),F.J(F.p1,T.h1),T.timber,u*0.12);});
  /* windows with coloured shutters (heart cut-outs) and geranium boxes */
  const win=(F,p,z0,h,lit)=>{const w=0.24;quad(F,p-w,p+w,z0,z0+h,lit?'#ffe9a0':'#86a8c0',BWHITE);TH.ln(c,F.J(p,z0),F.J(p,z0+h),BWHITE,u*0.05);TH.ln(c,F.J(p-w,z0+h*0.55),F.J(p+w,z0+h*0.55),BWHITE,u*0.05);quad(F,p-w-0.2,p-w,z0-0.02,z0+h+0.02,shut,'rgba(0,0,0,.25)');quad(F,p+w,p+w+0.2,z0-0.02,z0+h+0.02,shut,'rgba(0,0,0,.25)');
    [p-w-0.1,p+w+0.1].forEach(q=>{const hp=F.J(q,z0+h*0.62);BHEART(c,hp[0],hp[1],u*0.07,'#fdf3da');});quad(F,p-w-0.04,p+w+0.04,z0-0.2,z0-0.02,BWOOD);for(let k=0;k<5;k++){const gp=F.J(p-w+0.04+k*(2*w-0.08)/4,z0-0.12);TH.blob(c,gp[0],gp[1]-u*0.08,u*0.12,u*0.1,k%2?'#d9433b':'#e8607a',r,6);}};
  const doorF=eave?F2:F1,otherF=eave?F1:F2,doorG=eave?G2:G1,otherG=eave?G1:G2;
  quad(doorF,-0.34,0.34,0,1.15,BWOOD_D,T.timber);quad(doorF,-0.26,0.26,0.05,1.1,BWOOD);TH.ell(c,...doorF.J(0.18,0.6),u*0.05,u*0.05,'#e8c84a');TH.poly(c,[doorF.J(-0.45,1.15),doorF.J(0.45,1.15),doorF.J(0.35,1.35),doorF.J(-0.35,1.35)],T.roof);
  const sp=doorF.p1*0.62;win(doorF,-sp,0.55,0.7,r()<0.6);win(doorF,sp,0.55,0.7,r()<0.6);win(otherF,-otherF.p1*0.45,0.55,0.7,r()<0.6);win(otherF,otherF.p1*0.45,0.55,0.7,r()<0.6);
  win(otherG,0,T.h1+0.25,0.75,r()<0.6);if(T.style!=='farm'||true){win(otherG,-otherG.p1*0.55,T.h1+0.25,0.75,r()<0.5);win(otherG,otherG.p1*0.55,T.h1+0.25,0.75,r()<0.5);}
  /* balcony across the front of the upper floor, brimming with geraniums */
  {const bz=T.h1,bw=eave?hb2*0.8:ha2*0.8,ext=0.5;
    if(eave){LBOX(ha2,ha2+ext,-bw,bw,bz-0.1,bz+0.05,BWOOD);}else{LBOX(-bw,bw,hb2,hb2+ext,bz-0.1,bz+0.05,BWOOD);}
    const J=(a,z)=>eave?L(ha2+ext,a,z):L(a,hb2+ext,z);for(let k=0;k<=8;k++){const p=-bw+2*bw*k/8;TH.ln(c,J(p,bz+0.05),J(p,bz+0.55),BWOOD_D,u*0.07);}TH.ln(c,J(-bw,bz+0.55),J(bw,bz+0.55),BWOOD_D,u*0.09);TH.ln(c,J(-bw,bz+0.3),J(bw,bz+0.3),BWOOD_D,u*0.06);
    for(let k=0;k<12;k++){const p=-bw+2*bw*(k+0.5)/12,q=J(p,bz+0.62);TH.blob(c,q[0],q[1]-u*0.05,u*0.15,u*0.12,k%3?'#d9433b':'#f08aa0',r,6);}}
  /* low, wide roof with a deep overhang, shingle rows, gable boards and a little flag */
  const ch=T.style==='painted'?0.9:1.0;LBOX(-ha*0.6,-ha*0.6+0.5,-hb*0.6,-hb*0.6+0.5,zw+0.2,zr+0.8,'#f0e6d2');{const cp=L(-ha*0.6+0.25,-hb*0.6+0.25,zr+0.9);TH.ell(c,cp[0],cp[1],u*0.3,u*0.14,'#6a4028');c.fillStyle='rgba(240,240,246,.55)';for(let k=0;k<3;k++){c.beginPath();c.ellipse(cp[0]+k*u*0.14,cp[1]-u*(0.5+k*0.5),u*(0.3+k*0.1),u*0.2,0,0,7);c.fill();}}
  const ov=T.ov,rA=L(ha2+ov,-hb2-ov,zw),rB=L(ha2+ov,hb2+ov,zw),rC=L(0,hb2+ov,zr),rD=L(0,-hb2-ov,zr);TH.poly(c,[rA,rB,rC,rD],T.roof);
  const rows=Math.max(5,Math.round(T.rise/0.24));for(let k=1;k<rows;k++){const t=k/rows;TH.ln(c,L(ha2+ov-(ha2+ov)*t,-hb2-ov,zw+T.rise*t),L(ha2+ov-(ha2+ov)*t,hb2+ov,zw+T.rise*t),'rgba(30,14,6,.3)',u*0.05);}
  for(let k=0;k<12;k++){const t=0.1+r()*0.8,bb=-hb2-ov+r()*(hb2+ov)*2,p=L((ha2+ov)*(1-t),bb,zw+T.rise*t);TH.ell(c,p[0],p[1],u*0.16,u*0.08,r()<0.5?shade(T.roof,0.08):shade(T.roof,-0.1));}
  const gA=L(-ha2,hb2+0.02,zw),gB=L(ha2,hb2+0.02,zw),gC=L(0,hb2+0.02,zr-0.1);TH.poly(c,[gA,gB,gC],T.style==='painted'?shade(upper,0.04):(T.style==='chalet'?'#9a6a40':'#efe6d2'));
  for(let k=1;k<7;k++){const t=k/7;TH.ln(c,L(-ha2*(1-t)*0.98,hb2+0.03,zw+0.02),L(-ha2*(1-t)*0.98,hb2+0.03,zw+(zr-zw)*(1-t)*0.9),'rgba(60,36,16,.3)',u*0.05);TH.ln(c,L(ha2*(1-t)*0.98,hb2+0.03,zw+0.02),L(ha2*(1-t)*0.98,hb2+0.03,zw+(zr-zw)*(1-t)*0.9),'rgba(60,36,16,.3)',u*0.05);}
  const gcp=L(0,hb2+0.04,zw+(zr-zw)*0.42);TH.ell(c,gcp[0],gcp[1],u*0.24,u*0.26,'#ffe9a0','#fff',u*0.05);BHEART(c,gcp[0],gcp[1]+u*0.5,u*0.12,'#c0392b');
  TH.ln(c,L(-ha2-ov,hb2+ov,zw),L(0,hb2+ov,zr),T.timber,u*0.12);TH.ln(c,L(ha2+ov,hb2+ov,zw),L(0,hb2+ov,zr),T.timber,u*0.12);TH.ln(c,rD,rC,shade(T.roof,-0.2),u*0.1);
  const fp=L(0,hb2+ov-0.1,zr);BFLAG(c,fp[0],fp[1],u,1.0);}
const BHOUSE=(key)=>({cat:'struct',rho:0.14,draw(c,x,y,u,v){const T=BHOUSE_T[key],o=v&3,s=v>>2,eave=(o>>1)&1;c.fillStyle='rgba(40,56,24,.26)';c.beginPath();c.ellipse(x+u*0.8,y+u*0.2,u*T.sw*(eave?1.2:1),u*T.sh,0,0,7);c.fill();BFLIP(c,x,o&1,()=>BHOUSE_BODY(c,x,y,u,s,eave,T));}});
const BAV_AUTUMN=[['#e8892a','#f0a03a','#d46a1e','#f6b84a'],['#c8402a','#d9553a','#b0301e','#e86a4a'],['#e0b83a','#f0cc4a','#d0a42a','#f6dc6a'],['#8fbf4a','#a6d05a','#78ab3c','#bcdc72']];
const BAV_GREEN=[['#5fa844','#72bb52','#4f9638','#86cc62'],['#4f9a48','#62ae58','#438a3c','#78c26a'],['#6aae4a','#7ec25a','#5a9a3e','#92d46e']];
const BAVARIAN_ASSETS={
  /* ---------- trees: fresh greens with early-autumn colour ---------- */
  spruce:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*13+1);BSH(c,x,y,u*1.3);BFCON(c,x,y,u,{h:5.6+r()*1.4,w:1.25,tiers:8,c1:'#2f7048',c2:'#235a38',layer:0.3},r);}},
  fir:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*17+4);BSH(c,x,y,u*1.8);BFCON(c,x,y,u,{h:3.9+r()*0.9,w:1.75,tiers:5,c1:'#3a8050',c2:'#2a6640',layer:0.4,bare:0.1},r);}},
  youngSpruce:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*29+3);BSH(c,x,y,u*1.2);BFCON(c,x,y,u,{h:2.7+r()*0.9,w:1.1,tiers:4,c1:'#42905a',c2:'#307448',layer:0.42,bare:0.08,tw:0.3},r);}},
  beech:{cat:'tree',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*7+1),H=u*(4.4+r()*1.1),pal=v%4===0?BAV_AUTUMN[2]:v%4===1?BAV_AUTUMN[3]:BAV_GREEN[v%3];BSH(c,x,y,u*2.3);c.lineCap='round';c.strokeStyle='#7a7468';c.lineWidth=u*0.7;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.1,y-H*0.35,x+u*0.05,y-H*0.6);c.stroke();TH.ln(c,[x-u*0.15,y],[x-u*0.1,y-H*0.55],'#9a948a',u*0.14);TH.ln(c,[x,y-H*0.5],[x-u*1.1,y-H*0.82],'#7a7468',u*0.3);TH.ln(c,[x,y-H*0.55],[x+u*1.2,y-H*0.8],'#7a7468',u*0.3);const cy=y-H*0.82;[[0,-0.3,1.9,1.15],[-1.55,-0.1,1.25,0.95],[1.55,-0.1,1.25,0.95],[-0.8,-1.1,1.4,0.95],[0.85,-1.1,1.4,0.95],[0,-1.6,1.1,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,10));}},
  linden:{cat:'tree',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*5+3),H=u*(4.8+r()*0.9),pal=BAV_GREEN[(v+1)%3];BSH(c,x,y,u*2.4);TH.ln(c,[x,y],[x,y-H*0.55],'#6a5238',u*0.8);TH.ln(c,[x,y-H*0.4],[x-u*1.0,y-H*0.78],'#6a5238',u*0.3);TH.ln(c,[x,y-H*0.45],[x+u*1.1,y-H*0.8],'#6a5238',u*0.3);const cy=y-H*0.8;[[0,-0.3,2.1,1.25],[-1.7,0.05,1.3,1.0],[1.7,0.05,1.3,1.0],[-0.9,-1.15,1.5,1.0],[0.95,-1.15,1.5,1.0],[0,-1.7,1.2,0.85]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,10));for(let k=0;k<8;k++)TH.ell(c,x+(r()-0.5)*u*3.2,cy+(r()-0.5)*u*1.8,u*0.1,u*0.08,'#f6e88a');}},
  birch:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*17+4),H=u*(4.4+r()*1.0),pal=v%3===0?BAV_AUTUMN[2]:['#9cc060','#86ae4f','#b0d070','#78a444'];BSH(c,x,y,u*1.7);c.lineCap='round';c.strokeStyle='#ece8dc';c.lineWidth=u*0.46;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.12,y-H*0.4,x+u*0.05,y-H*0.7);c.stroke();for(let k=0;k<8;k++)TH.ln(c,[x-u*0.2,y-H*(0.06+k*0.08)],[x+u*0.1,y-H*(0.06+k*0.08)+u*0.05],'rgba(40,36,30,.55)',u*0.07);TH.ln(c,[x,y-H*0.55],[x-u*0.8,y-H*0.85],'#ece8dc',u*0.2);TH.ln(c,[x,y-H*0.6],[x+u*0.9,y-H*0.82],'#ece8dc',u*0.2);const cy=y-H*0.85;[[0,-0.5,1.3,1.0],[-1.0,-0.1,1.0,0.85],[1.0,-0.1,1.0,0.85],[-0.5,-1.15,1.0,0.8],[0.6,-1.1,1.0,0.8],[0,0.2,1.2,0.7]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,9));}},
  appleTree:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*23+1),H=u*(3.3+r()*0.6),pal=BAV_GREEN[v%3];BSH(c,x,y,u*1.9);c.lineCap='round';c.strokeStyle='#5a3f26';c.lineWidth=u*0.5;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+u*0.1,y-H*0.4,x,y-H*0.6);c.stroke();TH.ln(c,[x,y-H*0.4],[x-u*0.8,y-H*0.7],'#5a3f26',u*0.22);TH.ln(c,[x,y-H*0.45],[x+u*0.8,y-H*0.72],'#5a3f26',u*0.22);const cy=y-H*0.8;[[0,-0.2,1.6,1.0],[-1.2,0.1,1.0,0.8],[1.2,0.1,1.0,0.8],[-0.5,-0.9,1.0,0.8],[0.6,-0.9,1.0,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,9));for(let k=0;k<10;k++)TH.ell(c,x+(r()-0.5)*u*2.6,cy+u*(-0.9+r()*1.7),u*0.14,u*0.14,'#d9433b');}},
  maple:{cat:'tree',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*7+5),H=u*(4.2+r()*1.0),pal=BAV_AUTUMN[v%3];BSH(c,x,y,u*2.2);c.lineCap='round';c.strokeStyle='#6a5238';c.lineWidth=u*0.65;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.1,y-H*0.35,x+u*0.05,y-H*0.6);c.stroke();TH.ln(c,[x,y-H*0.5],[x-u*1.0,y-H*0.82],'#6a5238',u*0.28);TH.ln(c,[x,y-H*0.55],[x+u*1.1,y-H*0.8],'#6a5238',u*0.28);const cy=y-H*0.82;[[0,-0.3,1.8,1.1],[-1.5,-0.05,1.2,0.95],[1.5,-0.05,1.2,0.95],[-0.8,-1.05,1.3,0.9],[0.85,-1.05,1.3,0.9],[0,-1.55,1.0,0.75]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,10));}},
  /* ---------- undergrowth ---------- */
  geraniumBush:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+9);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(40,56,24,.2)');[[-0.55,-0.45,0.8,0.55],[0.55,-0.45,0.8,0.55],[0,-0.85,0.85,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#4f9a44','#5fae52','#3f8a3a'][i],r,8));for(let k=0;k<11;k++)TH.ell(c,x+(r()-0.5)*u*1.6,y-u*(0.3+r()*0.9),u*0.13,u*0.11,k%3?'#d9433b':'#f08aa0');}},
  wildflowers:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*7+2);TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.28,'rgba(40,56,24,.2)');for(let k=0;k<12;k++){const fx=x+(r()-0.5)*u*1.6,fy=y-r()*u*0.5;TH.ln(c,[fx,fy],[fx,fy-u*(0.4+r()*0.4)],'#5f9a45',u*0.06);}for(let k=0;k<13;k++){const fx=x+(r()-0.5)*u*1.6,fy=y-u*(0.5+r()*0.8);TH.ell(c,fx,fy,u*0.13,u*0.11,['#f2c230','#f6efe0','#6a8ae8','#d9433b','#f4a6cb'][k%5]);TH.ell(c,fx,fy,u*0.05,u*0.05,'#fff0a0');}}},
  sunflowers:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.28,'rgba(40,56,24,.2)');for(let k=0;k<4;k++){const fx=x+(k-1.5)*u*0.42,h=u*(1.6+r()*0.9);TH.ln(c,[fx,y],[fx+(r()-0.5)*u*0.2,y-h],'#4f8a3a',u*0.1);TH.ell(c,fx,y-u*0.7,u*0.35,u*0.18,'#4f8a3a',0.3);const hx=fx+(r()-0.5)*u*0.1,hy=y-h;for(let j=0;j<10;j++){const a=j/10*6.283;TH.ell(c,hx+Math.cos(a)*u*0.28,hy+Math.sin(a)*u*0.28,u*0.13,u*0.08,'#f2c230',a);}TH.ell(c,hx,hy,u*0.2,u*0.2,'#5a3a1a');}}},
  hedge:{cat:'shrub',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*3+7),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.3,y+u*0.1,u*2.0,u*0.4,'rgba(40,56,24,.2)');const cols=['#4f9a44','#5fae52','#3f8a3a'];for(let k=0;k<6;k++){const X=-1.5+k*0.6;TH.blob(c,...I(X,0,0.5),u*0.55,u*0.5,cols[k%3],r,8);}for(let k=0;k<8;k++)TH.ell(c,...I(-1.6+r()*3.2,0.2,0.9+r()*0.3),u*0.08,u*0.07,v%2?'#f6efe0':'#e86a8a');}},
  grassTuft:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);for(let k=0;k<13;k++){const a=-1.1+k/12*2.2+(r()-0.5)*0.2,l=u*(0.7+r()*0.8);TH.ln(c,[x+(r()-0.5)*u*0.6,y],[x+Math.sin(a)*l*0.8+(r()-0.5)*u*0.3,y-l],['#78b856','#68a84a','#92cc6a'][k%3],u*0.09);}}},
  fern:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(40,56,24,.2)');for(let k=0;k<9;k++){const a=-Math.PI+0.15+k/8*(Math.PI-0.3),len=u*(1.1+r()*0.45),ex=x+Math.cos(a)*len,ey=y-u*0.1+Math.sin(a)*len*0.6+len*0.4;c.lineCap='round';c.strokeStyle=k%2?'#4a9a44':'#3a8a38';c.lineWidth=u*0.4;c.beginPath();c.moveTo(x,y-u*0.1);c.quadraticCurveTo(x+Math.cos(a)*len*0.55,y-u*0.1+Math.sin(a)*len*0.7-len*0.25,ex,ey);c.stroke();}}},
  stones:{cat:'rock',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.8,'#a8a8a0'],[0.7,0.2,0.8,0.7,'#b6b6ae'],[0,-0.35,0.7,0.6,'#989890']].forEach(([dx,dy,rx,ry,col])=>{const px=x+dx*u,py=y+dy*u,sx=u*rx,sy=u*ry*(1+r()*0.2);TH.ell(c,px+sx*0.15,py+sy*0.3,sx*1.05,sy*0.45,'rgba(40,56,24,.25)');TH.poly(c,[[px-sx,py],[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px-sx*0.6,py+sy*0.2]],col);TH.poly(c,[[px+sx*0.25,py-sy*0.98],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px+sx*0.2,py+sy*0.05]],shade(col,-0.25));TH.poly(c,[[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.1,py-sy*0.5],[px-sx*0.5,py-sy*0.45]],'#7aaa52');});}},
  /* ---------- homes ---------- */
  farmhouse:BHOUSE('farmhouse'),chalet:BHOUSE('chalet'),paintedHouse:BHOUSE('paintedHouse'),
  /* ---------- the one tower: a small onion-dome chapel beside the homes ---------- */
  chapel:{cat:'struct',rho:0.12,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);c.fillStyle='rgba(40,56,24,.26)';c.beginPath();c.ellipse(x+u*0.9,y+u*0.2,u*3.2,u*1.0,0,0,7);c.fill();BFLIP(c,x,v&1,()=>{
      BBOX(c,x,y,u,-2.2,0.9,-1.0,1.0,0,1.9,'#f6f0e0');for(let k=0;k<3;k++){const X=-1.6+k*0.9;const pts=[I(X-0.2,1.01,0.6),I(X+0.2,1.01,0.6),I(X+0.2,1.01,1.3),I(X,1.01,1.55),I(X-0.2,1.01,1.3)];TH.poly(c,pts,'#86a8d0','#fff',u*0.05);}
      TH.poly(c,[I(1.5,-1.15,1.9),I(1.5,1.15,1.9),I(-2.4,1.15,1.9),I(-2.4,-1.15,1.9)].slice(0,0),'#c0553a');TH.poly(c,[I(-2.35,1.2,1.9),I(0.95,1.2,1.9),I(0.95,0,3.0),I(-2.35,0,3.0)],'#c0553a');for(let k=1;k<5;k++)TH.ln(c,I(-2.35,1.2-0.24*k,1.9+0.22*k),I(0.95,1.2-0.24*k,1.9+0.22*k),'rgba(60,20,10,.3)',u*0.05);
      BBOX(c,x,y,u,0.9,2.3,-0.75,0.75,0,4.3,'#f6f0e0');TH.poly(c,[I(1.4,0.76,0),I(1.8,0.76,0),I(1.8,0.76,1.2),I(1.6,0.76,1.4),I(1.4,0.76,1.2)].slice(0,5),BWOOD_D);
      const cf=I(1.6,0.76,3.0);c.fillStyle='#fff';c.beginPath();c.ellipse(cf[0],cf[1],u*0.42,u*0.5,0,0,7);c.fill();c.strokeStyle='#2a2a30';c.lineWidth=u*0.07;c.stroke();TH.ln(c,cf,[cf[0],cf[1]-u*0.3],'#2a2a30',u*0.06);TH.ln(c,cf,[cf[0]+u*0.22,cf[1]],'#2a2a30',u*0.06);
      BBOX(c,x,y,u,0.8,2.4,-0.85,0.85,4.3,4.5,'#d8d2c0');BBOX(c,x,y,u,0.95,2.25,-0.7,0.7,4.5,5.4,'#f6f0e0');[1.3,1.95].forEach(X=>{const pts=[I(X-0.22,0.71,4.55),I(X+0.22,0.71,4.55),I(X+0.22,0.71,5.0),I(X,0.71,5.3),I(X-0.22,0.71,5.0)];TH.poly(c,pts,'#2a2a30');});
      const b=I(1.6,0,5.4),t=I(1.6,0,8.4),rr=u*1.25;const g=c.createLinearGradient(b[0]-rr,0,b[0]+rr,0);g.addColorStop(0,'#5fc09a');g.addColorStop(0.55,'#3d8a6a');g.addColorStop(1,'#2a6650');c.fillStyle=g;c.beginPath();c.moveTo(b[0]-rr*0.9,b[1]);c.bezierCurveTo(b[0]-rr*1.5,b[1]-u*0.9,b[0]-rr*0.7,b[1]-u*1.6,b[0]-rr*0.2,b[1]-u*2.3);c.quadraticCurveTo(b[0],b[1]-u*2.7,t[0],t[1]);c.quadraticCurveTo(b[0],b[1]-u*2.7,b[0]+rr*0.2,b[1]-u*2.3);c.bezierCurveTo(b[0]+rr*0.7,b[1]-u*1.6,b[0]+rr*1.5,b[1]-u*0.9,b[0]+rr*0.9,b[1]);c.closePath();c.fill();
      TH.ell(c,t[0],t[1]+u*0.1,u*0.2,u*0.2,'#e8c84a');TH.ln(c,[t[0],t[1]],[t[0],t[1]-u*0.9],'#e8c84a',u*0.1);TH.ln(c,[t[0]-u*0.3,t[1]-u*0.55],[t[0]+u*0.3,t[1]-u*0.55],'#e8c84a',u*0.1);BFLAG(c,I(-1.0,0,3.0)[0],I(-1.0,0,3.0)[1],u,0.9);});}},
  /* ---------- Oktoberfest pieces ---------- */
  beerTent:{cat:'struct',rho:0.16,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);c.fillStyle='rgba(40,56,24,.26)';c.beginPath();c.ellipse(x+u*1.0,y+u*0.25,u*4.2,u*1.3,0,0,7);c.fill();BFLIP(c,x,v&1,()=>{
      BBOX(c,x,y,u,-2.7,2.7,-1.7,1.7,0,0.16,'#b08a5a');TH.poly(c,[I(-2.7,-1.7,0.16),I(2.7,-1.7,0.16),I(2.7,-1.7,2.1),I(-2.7,-1.7,2.1)],'#4a3424');
      [-0.6,0.9].forEach((Y,k)=>{BBOX(c,x,y,u,-2.3,2.3,Y-0.28,Y+0.28,0.16,0.78,'#a67a48');BBOX(c,x,y,u,-2.3,2.3,Y-0.75,Y-0.4,0.16,0.5,'#8a5a33');BBOX(c,x,y,u,-2.3,2.3,Y+0.4,Y+0.75,0.16,0.5,'#8a5a33');for(let s=0;s<9;s++){const X=-2.0+s*0.5,p=I(X,Y,0.78);TH.ell(c,p[0],p[1],u*0.09,u*0.07,'#f2c230');TH.ell(c,p[0],p[1]-u*0.08,u*0.09,u*0.04,'#fff6d8');}});
      [-2.7,-0.9,0.9,2.7].forEach(X=>{TH.ln(c,I(X,1.7,0.16),I(X,1.7,2.1),'#5a3a22',u*0.16);});
      const n=14,sw=5.6/n;for(let i=0;i<n;i++){const X0=-2.8+i*sw,X1=X0+sw;TH.poly(c,[I(X0,1.85,2.1),I(X1,1.85,2.1),I(X1,0,3.7),I(X0,0,3.7)],i%2?BWHITE:BBLUE);}
      TH.poly(c,[I(2.8,-1.85,2.1),I(2.8,1.85,2.1),I(2.8,0,3.7)],BWHITE);const rows=5;for(let rw=0;rw<rows;rw++){const zc=2.4+rw*0.25,half=(1.85)*(1-(zc-2.1)/1.6)*0.92;for(let k=-3;k<=3;k++){const Y=k*0.5;if(Math.abs(Y)>half)continue;TH.poly(c,[I(2.81,Y-0.2,zc),I(2.81,Y,zc+0.12),I(2.81,Y+0.2,zc),I(2.81,Y,zc-0.12)],(k+rw)%2?BBLUE:BWHITE);}}
      TH.ln(c,I(-2.8,0,3.7),I(2.8,0,3.7),BBLUE,u*0.14);TH.ln(c,I(-2.8,1.85,2.1),I(2.8,1.85,2.1),BWOOD_D,u*0.12);
      const cols=[BBLUE,BWHITE,'#d9433b','#f2c230'];let prev=null;for(let k=0;k<=16;k++){const X=-2.8+5.6*k/16,p=I(X,1.9,2.0-Math.sin(k/16*Math.PI)*0.0-0.05);if(prev)TH.ln(c,prev,p,'#d9d4c2',u*0.04);prev=p;if(k<16){const q=I(X+0.17,1.9,2.0);TH.poly(c,[[q[0]-u*0.2,q[1]],[q[0]+u*0.2,q[1]],[q[0],q[1]+u*0.55]],cols[k%4]);}}
      const f1=I(-2.6,0,3.7),f2=I(2.6,0,3.7);BFLAG(c,f1[0],f1[1],u,1.1);BFLAG(c,f2[0],f2[1],u,1.1);});}},
  marketStall:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*7+3),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),k=v%3,awn=k===1?['#c0392b',BWHITE]:[BBLUE,BWHITE];BFLIP(c,x,(v>>2)&1,()=>{BSH(c,x,y,u*2.2);
      TH.poly(c,[I(-1.5,-0.7,0),I(1.5,-0.7,0),I(1.5,-0.7,2.2),I(-1.5,-0.7,2.2)],'#6a4a30');for(let i=0;i<5;i++)TH.ln(c,I(-1.5+i*0.75,-0.69,0.2),I(-1.5+i*0.75,-0.69,2.1),'rgba(30,16,8,.3)',u*0.05);
      [-1.5,1.5].forEach(X=>[-0.7,0.7].forEach(Y=>TH.ln(c,I(X,Y,0),I(X,Y,2.2),BWOOD_D,u*0.14)));BBOX(c,x,y,u,-1.5,1.5,0.1,0.7,0.2,0.95,'#a67a48');BBOX(c,x,y,u,-1.55,1.55,0.05,0.75,0.95,1.05,'#c9a066');
      for(let i=0;i<6;i++){const p=I(-1.2+i*0.5,0.4,1.05);if(k===0){c.strokeStyle='#a8652a';c.lineWidth=u*0.1;c.beginPath();c.ellipse(p[0],p[1]-u*0.18,u*0.22,u*0.16,0,0,7);c.stroke();TH.ln(c,[p[0]-u*0.12,p[1]-u*0.1],[p[0]+u*0.12,p[1]-u*0.26],'#a8652a',u*0.09);}else if(k===1){BHEART(c,p[0],p[1]-u*0.25,u*0.2,'#c0392b');TH.ln(c,[p[0]-u*0.1,p[1]-u*0.3],[p[0]+u*0.1,p[1]-u*0.3],'#fdf3da',u*0.04);}else{TH.ln(c,[p[0]-u*0.2,p[1]-u*0.1],[p[0]+u*0.2,p[1]-u*0.2],'#b0583a',u*0.17);TH.ln(c,[p[0]-u*0.2,p[1]-u*0.3],[p[0]+u*0.2,p[1]-u*0.4],'#c96a4a',u*0.15);}}
      const n=10,aw=3.2/n;for(let i=0;i<n;i++){const X0=-1.6+i*aw,X1=X0+aw;TH.poly(c,[I(X0,1.0,2.0),I(X1,1.0,2.0),I(X1,-0.7,2.7),I(X0,-0.7,2.7)],awn[i%2]);const e=I(X0+aw/2,1.0,2.0);c.fillStyle=awn[i%2];c.beginPath();c.ellipse(e[0],e[1],u*0.22,u*0.16,0,0,Math.PI);c.fill();}
      TH.ln(c,I(-1.6,1.0,2.0),I(1.6,1.0,2.0),'rgba(30,16,8,.3)',u*0.05);BFLAG(c,I(-1.5,-0.7,2.7)[0],I(-1.5,-0.7,2.7)[1],u,0.8);});}},
  fountain:{cat:'ruin',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*5+9);BSH(c,x,y,u*2.2);const rx=u*1.6,ry=u*0.62;c.fillStyle='#a8a8a0';c.beginPath();c.moveTo(x-rx,y);c.lineTo(x-rx,y-u*0.7);c.ellipse(x,y-u*0.7,rx,ry,0,Math.PI,0,true);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI);c.closePath();c.fill();c.fillStyle='#8a8a82';c.beginPath();c.moveTo(x-rx*0.1,y+ry*0.99);c.lineTo(x-rx*0.1,y-u*0.7+ry*0.99);c.lineTo(x+rx,y-u*0.7);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI);c.closePath();c.fill();TH.ell(c,x,y-u*0.7,rx,ry,'#c0c0b8');TH.ell(c,x,y-u*0.7,rx*0.88,ry*0.82,'#6ab8d8');TH.ell(c,x-rx*0.2,y-u*0.74,rx*0.5,ry*0.35,'rgba(220,245,255,.5)');
      const gr=c.createLinearGradient(x-u*0.35,0,x+u*0.35,0);gr.addColorStop(0,'#c8c8c0');gr.addColorStop(1,'#8a8a82');c.fillStyle=gr;c.fillRect(x-u*0.28,y-u*2.7,u*0.56,u*2.0);TH.ell(c,x,y-u*2.0,u*0.9,u*0.34,'#c0c0b8');TH.ell(c,x,y-u*2.0,u*0.78,u*0.26,'#6ab8d8');TH.ell(c,x,y-u*2.75,u*0.42,u*0.16,'#c0c0b8');
      for(let k=0;k<6;k++){const a=k/6*6.283,ex=x+Math.cos(a)*u*1.1,ey=y-u*0.7+Math.sin(a)*u*0.4;c.strokeStyle='rgba(210,240,255,.85)';c.lineWidth=u*0.07;c.beginPath();c.moveTo(x,y-u*2.9);c.quadraticCurveTo(x+Math.cos(a)*u*0.7,y-u*3.3,ex,ey);c.stroke();}
      for(let k=0;k<4;k++){const a=k/4*6.283+0.4,px=x+Math.cos(a)*rx*0.98,py=y-u*0.7+Math.sin(a)*ry*0.98;TH.ell(c,px,py-u*0.15,u*0.2,u*0.12,'#b5553a');for(let j=0;j<3;j++)TH.ell(c,px+(j-1)*u*0.12,py-u*0.35,u*0.1,u*0.09,j%2?'#d9433b':'#f08aa0');}}},
  shrine:{cat:'ruin',rho:0.04,draw(c,x,y,u,v){const r=mulberry(v*5+9);BFLIP(c,x,v&1,()=>{BSH(c,x,y,u*1.0);TH.ln(c,[x,y],[x,y-u*3.2],BWOOD_D,u*0.34);TH.poly(c,[[x-u*0.7,y-u*2.9],[x+u*0.7,y-u*2.9],[x+u*0.7,y-u*2.0],[x-u*0.7,y-u*2.0]],'#d8c8a8',BWOOD_D,u*0.07);TH.poly(c,[[x-u*0.55,y-u*2.15],[x+u*0.55,y-u*2.15],[x,y-u*2.85]].slice(0,0),'#fff');TH.ln(c,[x,y-u*2.85],[x,y-u*2.15],'#6a4a30',u*0.1);TH.ln(c,[x-u*0.3,y-u*2.6],[x+u*0.3,y-u*2.6],'#6a4a30',u*0.1);
      TH.poly(c,[[x-u*0.95,y-u*2.9],[x+u*0.95,y-u*2.9],[x,y-u*3.8]],'#8a5a3a');TH.poly(c,[[x,y-u*3.8],[x+u*0.95,y-u*2.9],[x+u*0.1,y-u*2.9]],'#6a4028');for(let k=0;k<5;k++)TH.blob(c,x+(k-2)*u*0.28,y+u*0.02,u*0.18,u*0.14,['#d9433b','#f6efe0','#f2c230','#f08aa0','#6a8ae8'][k],r,6);const g=c.createRadialGradient(x,y-u*0.3,0,x,y-u*0.3,u*1.2);g.addColorStop(0,'rgba(255,200,110,.5)');g.addColorStop(1,'rgba(255,200,110,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*0.3,u*1.2,0,7);c.fill();TH.ell(c,x,y-u*0.3,u*0.12,u*0.16,'#ffd870');});}},
  woodshed:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*7+3),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);BFLIP(c,x,v&1,()=>{BSH(c,x,y,u*2.2);BBOX(c,x,y,u,-1.4,1.4,-0.9,0.9,0,0.1,'#8a6a40');TH.poly(c,[I(-1.4,-0.9,0.1),I(1.4,-0.9,0.1),I(1.4,-0.9,1.8),I(-1.4,-0.9,1.8)],'#5a3f26');
      for(let row=0;row<4;row++)for(let k=0;k<9;k++){const X=-1.25+k*0.31+(row%2)*0.12,Z=0.28+row*0.32;const p=I(X,-0.88,Z);TH.ell(c,p[0],p[1],u*0.15,u*0.14,k%2?'#c9a066':'#b98a55');TH.ell(c,p[0],p[1],u*0.07,u*0.06,'#8a5a33');}
      [-1.4,1.4].forEach(X=>[-0.9,0.9].forEach(Y=>TH.ln(c,I(X,Y,0.1),I(X,Y,1.9),BWOOD_D,u*0.16)));TH.poly(c,[I(1.7,-1.2,1.8),I(1.7,1.2,1.8),I(-1.7,1.2,2.4),I(-1.7,-1.2,2.4)].slice(0,0),'#8a5a3a');TH.poly(c,[I(-1.7,1.2,1.7),I(1.7,1.2,1.7),I(1.7,-1.2,2.5),I(-1.7,-1.2,2.5)],'#8a5a3a');for(let k=1;k<6;k++)TH.ln(c,I(-1.7,1.2-0.4*k,1.7+0.16*k),I(1.7,1.2-0.4*k,1.7+0.16*k),'rgba(30,14,6,.3)',u*0.05);
      BBOX(c,x,y,u,0.9,1.4,0.9,1.4,0,0.5,'#8a5a33');TH.ln(c,I(1.15,1.15,0.5),I(1.5,1.4,1.0),'#5a3a22',u*0.1);TH.poly(c,[I(1.45,1.35,1.0),I(1.7,1.4,1.1),I(1.55,1.45,0.85)],'#c0c4cc');});}},
  maypole:{cat:'struct',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*5+9),H=u*9.0;BSH(c,x,y,u*1.8);TH.ell(c,x,y,u*0.9,u*0.3,'#8a6a40');TH.ell(c,x,y-u*0.1,u*0.8,u*0.26,'#a8844a');
      const w=u*0.2;for(let i=0;i<24;i++){const t0=i/24,t1=(i+1)/24,y0=y-H*t0,y1=y-H*t1;TH.poly(c,[[x-w+(i%2?-1:0)*0,y0],[x+w,y0],[x+w,y1],[x-w,y1]],i%2?BWHITE:BBLUE);}
      c.save();c.globalAlpha=0.35;const gr=c.createLinearGradient(x-w,0,x+w,0);gr.addColorStop(0,'#fff');gr.addColorStop(1,'#000');c.fillStyle=gr;c.fillRect(x-w,y-H,w*2,H);c.restore();
      [[0.58,'#d9433b'],[0.76,'#f2c230']].forEach(([f,col],k)=>{const py=y-H*f;for(let s=-1;s<=1;s+=2){TH.ln(c,[x,py],[x+s*u*0.9,py+u*0.12],'#5a3a22',u*0.1);TH.poly(c,[[x+s*u*0.9-u*0.28,py+u*0.1],[x+s*u*0.9+u*0.28,py+u*0.1],[x+s*u*0.9+u*0.28,py+u*0.7],[x+s*u*0.9-u*0.28,py+u*0.7]],col,'#fff',u*0.04);TH.ell(c,x+s*u*0.9,py+u*0.4,u*0.1,u*0.1,'#fff');}});
      const ty=y-H*0.93;TH.ell(c,x,ty,u*1.5,u*0.5,'#3f8a3a');TH.ell(c,x,ty-u*0.1,u*1.3,u*0.36,'#5fae52');for(let k=0;k<12;k++){const a=k/12*6.283;TH.ell(c,x+Math.cos(a)*u*1.4,ty+Math.sin(a)*u*0.46,u*0.13,u*0.1,k%2?'#d9433b':'#f6efe0');}
      for(let k=0;k<8;k++){const a=k/8*6.283+0.3,sx=x+Math.cos(a)*u*1.3,sy=ty+Math.sin(a)*u*0.42,len=u*(3.2+(k%3)*0.8),col=[BBLUE,BWHITE,'#d9433b','#f2c230'][k%4];c.strokeStyle=col;c.lineWidth=u*0.14;c.lineCap='round';c.beginPath();c.moveTo(x,ty);c.quadraticCurveTo(sx,sy+len*0.4,sx+Math.sin(k)*u*0.3,sy+len);c.stroke();}
      TH.ln(c,[x,y-H],[x,y-H-u*0.7],'#5a3a22',u*0.12);BFLAG(c,x,y-H-u*0.5,u,0.9);for(let k=0;k<6;k++)TH.ell(c,x+(r()-0.5)*u*1.6,y+u*0.02,u*0.14,u*0.1,['#d9433b','#f6efe0','#f2c230','#f08aa0'][k%4]);}},
  /* ---------- small props (lower tiers only) ---------- */
  bunting:{cat:'prop',rho:0.12,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*2.4,u*0.4,'rgba(40,56,24,.14)');[-2.2,2.2].forEach(X=>TH.ln(c,I(X,0,0),I(X,0,3.4),'#6a4a2a',u*0.18));let prev=null;for(let k=0;k<=12;k++){const X=-2.2+4.4*k/12,p=I(X,0,3.3-Math.sin(k/12*Math.PI)*0.7);if(prev)TH.ln(c,prev,p,'#d9d4c2',u*0.04);prev=p;if(k<12){const q=I(X+0.18,0,3.3-Math.sin((k+0.5)/12*Math.PI)*0.7);TH.poly(c,[[q[0]-u*0.2,q[1]],[q[0]+u*0.2,q[1]],[q[0],q[1]+u*0.55]],k%2?BWHITE:BBLUE,'rgba(0,0,0,.15)',u*0.03);}}}},
  beerBarrels:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const bar=(bx,by,s,band)=>{const w=u*0.55*s,h=u*1.0*s;TH.ell(c,bx+w*0.5,by+w*0.2,w*1.3,w*0.4,'rgba(40,56,24,.22)');TH.ell(c,bx,by,w,w*0.4,'#5a3b22');c.fillStyle='#a87a44';c.beginPath();c.moveTo(bx-w,by);c.quadraticCurveTo(bx-w*1.14,by-h*0.5,bx-w,by-h);c.lineTo(bx+w,by-h);c.quadraticCurveTo(bx+w*1.14,by-h*0.5,bx+w,by);c.ellipse(bx,by,w,w*0.4,0,0,Math.PI);c.fill();[0.2,0.8].forEach(f=>TH.ln(c,[bx-w*1.04,by-h*f],[bx+w*1.04,by-h*f],'#3a3f4a',u*0.08));if(band)TH.ln(c,[bx-w*1.08,by-h*0.5],[bx+w*1.08,by-h*0.5],BBLUE,u*0.2);TH.ell(c,bx,by-h,w,w*0.4,'#c9a066');TH.ell(c,bx,by-h,w*0.2,w*0.08,'#8a5a33');};bar(x-u*0.65,y,1,true);bar(x+u*0.6,y+u*0.1,0.95,true);bar(x,y-u*0.2,0.9,false);}},
  haybale:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.3,u*0.4,'rgba(40,56,24,.2)');TH.box(c,x,y,u,-0.9,0.1,-0.6,0.6,0,0.9,'#e8cc70','#c0a24a','#f6e088');TH.box(c,x,y,u,0.2,1.2,-0.6,0.6,0,0.9,'#e8cc70','#c0a24a','#f6e088');TH.box(c,x,y,u,-0.4,0.7,-0.5,0.5,0.9,1.8,'#e8cc70','#c0a24a','#f6e088');[-0.4,0.4].forEach(X=>TH.ln(c,I(X,0.61,0.9),I(X,0.61,1.7),'#8a7030',u*0.05));}},
  lampPost:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(40,56,24,.22)');TH.ln(c,[x,y],[x,y-u*3.1],'#2a2d36',u*0.2);TH.ln(c,[x,y-u*2.95],[x+u*0.55,y-u*2.95],'#2a2d36',u*0.12);const lx=x+u*0.55,ly=y-u*2.9,g=c.createRadialGradient(lx,ly-u*0.3,0,lx,ly-u*0.3,u*1.5);g.addColorStop(0,'rgba(255,215,130,.5)');g.addColorStop(1,'rgba(255,215,130,0)');c.fillStyle=g;c.beginPath();c.arc(lx,ly-u*0.3,u*1.5,0,7);c.fill();TH.poly(c,[[lx-u*0.25,ly],[lx+u*0.25,ly],[lx+u*0.2,ly-u*0.6],[lx-u*0.2,ly-u*0.6]],'#ffe9a8','#2a2d36',u*0.06);TH.poly(c,[[lx-u*0.3,ly-u*0.6],[lx+u*0.3,ly-u*0.6],[lx,ly-u*0.95]],'#2a2d36');BFLAG(c,x,y-u*2.0,u,0.55);}},
  beerTable:{cat:'prop',rho:0.07,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*2.0,u*0.5,'rgba(40,56,24,.2)');TH.box(c,x,y,u,-1.3,1.3,-0.4,0.4,0.6,0.72,'#c9a066','#8a6a40','#dcb878');[-1.1,1.1].forEach(X=>TH.ln(c,I(X,0,0),I(X,0,0.62),BWOOD_D,u*0.14));TH.box(c,x,y,u,-1.3,1.3,-0.95,-0.55,0.3,0.4,'#a67a48','#7a5a30','#b98a55');TH.box(c,x,y,u,-1.3,1.3,0.55,0.95,0.3,0.4,'#a67a48','#7a5a30','#b98a55');[-1.1,1.1].forEach(X=>{TH.ln(c,I(X,-0.75,0),I(X,-0.75,0.3),BWOOD_D,u*0.1);TH.ln(c,I(X,0.75,0),I(X,0.75,0.3),BWOOD_D,u*0.1);});for(let k=0;k<4;k++){const p=I(-0.9+k*0.6,0.1*(k%2?1:-1),0.72);TH.poly(c,[[p[0]-u*0.11,p[1]],[p[0]+u*0.11,p[1]],[p[0]+u*0.1,p[1]-u*0.3],[p[0]-u*0.1,p[1]-u*0.3]],'#f2c230');TH.ell(c,p[0],p[1]-u*0.3,u*0.1,u*0.05,'#fff6d8');}
    TH.ln(c,I(0,0,0.72),I(0,0,2.4),'#5a3a22',u*0.1);TH.poly(c,[I(-1.3,-1.0,1.9),I(1.3,-1.0,1.9),I(0,0,2.6)].slice(0,0),'#fff');const top=I(0,0,2.6),ucols=[BBLUE,BWHITE];for(let i=0;i<6;i++){const a0=i/6*Math.PI,a1=(i+1)/6*Math.PI;TH.poly(c,[top,[top[0]+Math.cos(a0)*u*1.5,top[1]+u*0.7-Math.sin(a0)*u*0.0],[top[0]+Math.cos(a1)*u*1.5,top[1]+u*0.7]],ucols[i%2]);}}}
};

/* ===== MACRO-LAND ENGINE (hex geometry, path network, planner, baker) ===== */
const W3=Math.sqrt(3),HX=W3/2,HV=[[HX,0.29],[0,0.58],[-HX,0.29],[-HX,-0.29],[0,-0.58],[HX,-0.29]];
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[0,1,2],[-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5,1.5]]};
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

/* ---- generic baker (any theme object {assets, plan, ground, groundCol, seeds}) ---- */
const LAND_BAKE_CACHE={};
function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};
  const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol;
  const clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]);
  const key=[T.id,shape,tier,R,Math.round(R*sc),sc,m,ground,JSON.stringify(clr)].join('|');
  if(LAND_BAKE_CACHE[key])return LAND_BAKE_CACHE[key];
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX;
  const mx=0.75,top=T.top||1.35,bot=0.85,W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R);
  const ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const back=document.createElement('canvas');back.width=Math.ceil(W*sc);back.height=Math.ceil(H*sc);
  const cb=back.getContext('2d');cb.scale(sc,sc);T.ground(cb,G,R,ox,oy,m,ground,shape==='A'?11:22);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]);
  const vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho)));
  const rowYs=[...new Set(G.centers.map(c=>c.y))].sort((a,b)=>a-b),objectsByBand=rowYs.map(()=>[]);
  vis.forEach(o=>{let band=0;while(band<rowYs.length-1&&o.y>=(rowYs[band]+rowYs[band+1])/2)band++;objectsByBand[band].push(o);});
  const bands=objectsByBand.map((objects,index)=>{
    let bx0=W,by0=H,bx1=0,by1=0;
    objects.forEach(o=>{const px=ox+m*o.x*R,py=oy+o.y*R,s=(o.scale||1)*u;bx0=Math.min(bx0,px-4*s);bx1=Math.max(bx1,px+4*s);by0=Math.min(by0,py-9*s);by1=Math.max(by1,py+2*s);});
    if(!objects.length)return{canvas:null,rect:{x:0,y:0,w:0,h:0},depth:oy+rowYs[index]*R};
    bx0=Math.max(0,Math.floor(bx0));by0=Math.max(0,Math.floor(by0));bx1=Math.min(W,Math.ceil(bx1));by1=Math.min(H,Math.ceil(by1));
    const w=bx1-bx0,h=by1-by0,canvas=document.createElement('canvas');canvas.width=Math.ceil(w*sc);canvas.height=Math.ceil(h*sc);
    const cg=canvas.getContext('2d');cg.scale(sc,sc);cg.translate(-bx0,-by0);
    objects.sort((a,b)=>a.y-b.y).forEach(o=>T.assets[o.kind].draw(cg,ox+m*o.x*R,oy+o.y*R,u*(o.scale||1),o.v));
    return{canvas,rect:{x:bx0,y:by0,w,h},depth:oy+rowYs[index]*R};
  });
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return LAND_BAKE_CACHE[key]={back,bands,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0};
}function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}

/* ===== BAVARIAN LAND: planner (same tree + house counts as the medieval/gothic lands; cheerful painted houses, Oktoberfest pieces, autumn-tinged woods), sunny meadow ground ===== */
const BAVARIAN_REGION={top:{spruce:.18,fir:.08,beech:.2,linden:.1,birch:.1,appleTree:.12,maple:.16,youngSpruce:.06},mid:{spruce:.16,fir:.08,beech:.2,linden:.1,birch:.1,appleTree:.14,maple:.16,youngSpruce:.06},bottom:{spruce:.12,fir:.06,beech:.16,linden:.08,birch:.1,appleTree:.2,maple:.14,youngSpruce:.14}};
const BAVARIAN_LOW=[['youngSpruce',1],['appleTree',0.75],['birch',0.65],['maple',0.55],['beech',0.55],['youngSpruce',1.2],['appleTree',0.85]];
const BAVARIAN_CAP={linden:8};
const BAVARIAN_UNDER=['geraniumBush','wildflowers','sunflowers','hedge','grassTuft','fern','geraniumBush','wildflowers','stones'];
const BAVARIAN_PLAN_CACHE={};
function getBavarianPlan(shape){
  if(BAVARIAN_PLAN_CACHE[shape])return BAVARIAN_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(shape==='A'?7301:8402),placed=[],bb=G.bbox,used={},A=BAVARIAN_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.66);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'beech';};
  const capOk=k=>!(BAVARIAN_CAP[k]&&(used[k]||0)>=BAVARIAN_CAP[k]);
  const regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?BAVARIAN_REGION.top:n<0.68?BAVARIAN_REGION.mid:BAVARIAN_REGION.bottom;};
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='tree'?0.88+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;if((D.cat==='tree'||D.cat==='shrub'||D.cat==='prop')&&placed.some(o=>o.noSouth&&Math.abs(px-o.x)<0.3&&py-o.y>-0.05&&py-o.y<0.36))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const tree=(x,y,extra,dom,low)=>{if(low){const L=BAVARIAN_LOW[Math.floor(rng()*BAVARIAN_LOW.length)];return place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return place(dom&&rng()<0.55&&capOk(dom)?dom:pickFrom(regionOf(y),capOk),x,y,extra||{});};
  const under=(x,y,extra)=>place(BAVARIAN_UNDER[Math.floor(rng()*BAVARIAN_UNDER.length)],x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. the back rim carries the striped beer tent (no tree backdrop: the trees there are the same density as everywhere else) */
  {const pts=[];top.forEach(e=>[0.3,0.5,0.7].forEach(t=>pts.push(onEdge(e,t,0.0))));const p=pts.reduce((b,q)=>Math.abs(q[0]-cx)<Math.abs(b[0]-cx)?q:b);for(const [dx,dy] of [[0,-0.02],[0.3,0],[-0.3,0],[0,0.04]]){const o=place('beerTent',p[0]+dx,p[1]+dy,{minT:2,scale:1.1,clear:2.4,noSouth:true});if(o)break;}}
  /* 2. cheerful homes: 6 on the rim (spread by farthest-point), 7 through the middle, then ONE onion-dome chapel beside a house */
  const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.filter(e=>e.vertical).forEach(e=>inn.push([e.mid[0],e.mid[1]]));
  const chosen=placed.filter(o=>o.cat==='ruin'||o.cat==='struct').map(o=>[o.x,o.y]),manors=[];
  const spread=(k,pool,extra)=>{const ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.22})).sort((a,b)=>b.d-a.d);for(let n=0;n<Math.min(12,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],extra);if(o){chosen.push([o.x,o.y]);if(/^(farmhouse|chalet|paintedHouse)$/.test(k))manors.push(o);return o;}}return null;};
  [['paintedHouse',1],['farmhouse',2],['chalet',3],['paintedHouse',3],['farmhouse',4],['chalet',4]].forEach(([k,mt])=>spread(k,rim,{minT:mt,scale:1.15,clear:2.5,noSouth:true}));
  [['farmhouse',2],['chalet',2],['paintedHouse',3],['farmhouse',3],['paintedHouse',4],['chalet',4],['farmhouse',4]].forEach(([k,mt])=>spread(k,inn,{minT:mt,scale:1.0,clear:3.0,noSouth:true}));
  {const home=manors[manors.length-1]||placed.find(o=>o.cat==='struct');if(home){for(const [dx,dy] of [[0.36,-0.08],[-0.36,-0.08],[0.3,0.12],[-0.3,0.12],[0.44,0.0],[-0.44,0.0]]){const o=place('chapel',home.x+dx,home.y+dy,{minT:4,scale:1.0,clear:2.4,noSouth:true});if(o)break;}}}
  /* 2b. village and Oktoberfest pieces scattered through the land (farthest-point spacing): market stalls, a fountain, wayside shrines, a woodshed and ONE maypole */
  [['marketStall',1],['fountain',2],['marketStall',2],['shrine',2],['marketStall',3],['woodshed',3],['shrine',3],['maypole',4]].forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,scale:k==='marketStall'?1.1:1.0,clear:1.8,noSouth:true}));
  /* 3. trees: very dark, same dense dials as the medieval land (and the top rim is treated exactly like every other edge) */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=pickFrom(regionOf(v.y),capOk),n=2+Math.floor(rng()*1.9);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.09:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{const dom=pickFrom(regionOf(e.mid[1]),capOk);[-0.27,0,0.27].forEach(dy=>{if(rng()<0.82)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.72)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.8+rng()*0.2},null,true);if(rng()<0.22)tree(e.mid[0]+(rng()-0.5)*0.34,e.mid[1]+(rng()-0.5)*0.14,{scale:0.78+rng()*0.2},null,true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.26));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(rng()-0.2)*0.12)});});
    let mode='grove',run=0,dom='beech';samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.74?'grove':r<0.92?'sparse':'open';run=2+Math.floor(rng()*4);dom=pickFrom(regionOf(s.p[1]),capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){tree(p[0],p[1],null,dom,low);if(rng()<0.55)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,dom,low);if(rng()<0.2)tree(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,dom,true);if(rng()<0.14)tree(p[0]+(rng()-0.5)*0.34,p[1]-0.2,null,dom,low);}
      else if(mode==='sparse'){if(rng()<0.5)tree(p[0],p[1],null,dom,low);else under(p[0],p[1]);}else if(rng()<0.6)under(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.8)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<14;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.46)tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);}});
  /* 3c. balance the rim: the top, the sides and the bottom must carry the same tree density per unit of boundary (thin the heavy edges, fill the light ones) */
  {const dEdge=(x,y,e)=>{const dx=e.b[0]-e.a[0],dy=e.b[1]-e.a[1],t=Math.max(0,Math.min(1,((x-e.a[0])*dx+(y-e.a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-(e.a[0]+dx*t),(y-(e.a[1]+dy*t))*1.4);};
    const classes=['top','side','bottom'],len={top:0,side:0,bottom:0};outer.forEach(e=>len[e.cls]+=e.len);
    const members=()=>{const m={top:[],side:[],bottom:[]};placed.filter(o=>o.cat==='tree').forEach(o=>{let best=null,bd=1e9;outer.forEach(e=>{const d=dEdge(o.x,o.y,e);if(d<bd){bd=d;best=e;}});if(bd<0.32)m[best.cls].push(o);});return m;};
    let m=members();const mean=(m.top.length+m.side.length+m.bottom.length)/(len.top+len.side+len.bottom);
    classes.forEach(cl=>{const target=Math.round(len[cl]*mean);let list=m[cl];
      if(list.length>target+1){const drop=list.length-target;for(let i=0;i<drop;i++){const pick=list.splice(Math.floor(rng()*list.length),1)[0],ix=placed.indexOf(pick);if(ix>=0)placed.splice(ix,1);}}
      else if(list.length<target-1){const need=target-list.length,es=outer.filter(e=>e.cls===cl);let added=0,guard=0;while(added<need&&guard++<160){const e=es[Math.floor(rng()*es.length)],p=onEdge(e,rng(),(rng()-0.2)*0.12);if(tree(p[0],p[1],null,null,cl!=='top'))added++;}}});}
  /* 4. undergrowth: geraniums, wildflowers, sunflowers, hedges */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.45)under(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.35)under(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.38)under(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.3)under(px,py);}});
  /* 5. small props: lower tiers only */
  [['bunting',2],['beerBarrels',2],['haybale',2],['lampPost',2],['beerTable',2]].forEach(([k,n])=>{for(let i=0;i<n;i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  /* every house gets a facing (bit0 mirror, bit1 gable/eave); neighbours cycle through all four */
  {const houses=placed.filter(o=>/^(farmhouse|chalet|paintedHouse)$/.test(o.kind)).sort((a,b)=>a.x-b.x||a.y-b.y),cyc=[0,3,1,2];houses.forEach((o,i)=>{o.v=((o.v>>2)<<2)|cyc[i%4];});placed.filter(o=>o.kind==='chapel'||o.kind==='beerTent').forEach(o=>{o.v=((o.v>>2)<<2)|(rng()<0.5?1:0);});}
  const cuts={tree:[0.2,0.52,0.8,1],shrub:[0.06,0.38,0.7,1],rock:[0.3,0.55,0.8,1],prop:[1,1,1,1],struct:[0,0,0,0],ruin:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='struct'||o.cat==='ruin')o.tier=o.minT;});
  const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
  for(let t=1;t<=4;t++){let guard=0;while(guard++<300){const c=count(t);if(c.tr/Math.max(1,c.n)>=0.68)break;const pool=placed.filter(o=>o.tier<=t&&t<=o.maxT),cand=(pool.filter(o=>o.cat==='shrub').sort((a,b)=>b.pri-a.pri)[0])||(pool.filter(o=>o.prop&&o.minT>1).sort((a,b)=>b.pri-a.pri)[0]);if(!cand)break;cand.tier=Math.min(5,cand.tier+1);}}
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.sort((a,b)=>a.y-b.y);
  return BAVARIAN_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: a sunny, fresh meadow with fallen autumn leaves, daisies and cornflowers (decals, not objects) ---- */
function bavarianGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<46;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'190,230,130':'80,140,60',r()<0.5?0.2:0.2);}
  for(let k=0;k<12;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'236,224,140',0.15);}              /* sun-dried grass */
  for(let k=0;k<8;k++){const p=pt(),w=R*(0.25+r()*0.4);soft(p[0],p[1],w,w*0.4,'150,116,70',0.14);}               /* worn earth */
  for(let k=0;k<12;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'255,255,210',0.14);}              /* sun dapples */
  for(let k=0;k<160;k++){const p=pt(),h=R*(0.05+r()*0.06);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#78b856','#68a84a','#92cc6a'][(k+j)%3],R*0.011);}
  for(let k=0;k<70;k++){const p=pt(),a=r()*3.14,l=R*(0.03+r()*0.035);TH.ell(c,p[0],p[1],l,l*0.55,['#e8892a','#f0b83a','#c8402a','#e0a030'][k%4],a);}   /* fallen autumn leaves */
  for(let k=0;k<70;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.012,R*0.01,['#f6efe0','#f2c230','#6a8ae8','#f4a6cb','#fff0a0'][k%5]);}
  for(let k=0;k<22;k++){const p=pt();TH.ell(c,p[0],p[1],R*(0.014+r()*0.012),R*0.01,'rgba(160,160,152,.55)');}
  c.restore();c.restore();
}
const BAVARIAN_THEME={id:'bavarian',assets:BAVARIAN_ASSETS,plan:getBavarianPlan,ground:bavarianGround,groundCol:'#8fbf68',top:1.45};
const BAVARIAN_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
function bakeLandBavarian(shape,tier,R,opts){return bakeLandTheme(BAVARIAN_THEME,shape,tier,R,opts);}
function drawLandBavarianBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandBavarianDepthBand(ctx,x,y,land,index){const band=land.bands[index];if(!band||!band.canvas)return;const r=band.rect;ctx.drawImage(band.canvas,x-land.ox+r.x,y-land.oy+r.y,r.w,r.h);}
function drawLandBavarianFront(ctx,x,y,land){land.bands.forEach((_,index)=>drawLandBavarianDepthBand(ctx,x,y,land,index));}
return Object.freeze({bake:bakeLandBavarian,drawBack:drawLandBavarianBack,drawDepthBand:drawLandBavarianDepthBand,drawFront:drawLandBavarianFront});
})();
