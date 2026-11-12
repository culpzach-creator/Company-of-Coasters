/* Supplied large campus maps, adapted for depth-sorted scenery. */
const LARGE_CAMPUS_SCENERY = (() => {
const plain = (() => {
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
const BAV_AUTUMN=[['#e8892a','#f0a03a','#d46a1e','#f6b84a'],['#c8402a','#d9553a','#b0301e','#e86a4a'],['#e0b83a','#f0cc4a','#d0a42a','#f6dc6a'],['#8fbf4a','#a6d05a','#78ab3c','#bcdc72']];
const BAV_GREEN=[['#5fa844','#72bb52','#4f9638','#86cc62'],['#4f9a48','#62ae58','#438a3c','#78c26a'],['#6aae4a','#7ec25a','#5a9a3e','#92d46e']];
const CAMPUS_ASSETS={
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
  lampPost:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(40,56,24,.22)');TH.ln(c,[x,y],[x,y-u*3.1],'#2a2d36',u*0.2);TH.ln(c,[x,y-u*2.95],[x+u*0.55,y-u*2.95],'#2a2d36',u*0.12);const lx=x+u*0.55,ly=y-u*2.9,g=c.createRadialGradient(lx,ly-u*0.3,0,lx,ly-u*0.3,u*1.5);g.addColorStop(0,'rgba(255,215,130,.5)');g.addColorStop(1,'rgba(255,215,130,0)');c.fillStyle=g;c.beginPath();c.arc(lx,ly-u*0.3,u*1.5,0,7);c.fill();TH.poly(c,[[lx-u*0.25,ly],[lx+u*0.25,ly],[lx+u*0.2,ly-u*0.6],[lx-u*0.2,ly-u*0.6]],'#ffe9a8','#2a2d36',u*0.06);TH.poly(c,[[lx-u*0.3,ly-u*0.6],[lx+u*0.3,ly-u*0.6],[lx,ly-u*0.95]],'#2a2d36');BFLAG(c,x,y-u*2.0,u,0.55);}},
};

/* ===== CAMPUS SCENIC MAP: geometry (all in game units: 1 unit = R, x = u*sqrt3, y = row*0.87) ===== */
const CAMPUS_GEO={"frame":{"x0":-13.332,"x1":32.407,"y0":-3.685,"y1":23.849},"hexes":[[7.5,0,"g"],[1.0,1,"w"],[2.0,1,"w"],[3.0,1,"w"],[6.0,1,"g"],[7.0,1,"g"],[8.0,1,"g"],[1.5,2,"w"],[2.5,2,"w"],[3.5,2,"w"],[6.5,2,"g"],[7.5,2,"g"],[8.5,2,"g"],[2.0,3,"w"],[3.0,3,"w"],[4.0,3,"w"],[5.0,3,"g"],[6.0,3,"g"],[7.0,3,"g"],[8.0,3,"g"],[9.0,3,"g"],[1.5,4,"w"],[2.5,4,"w"],[3.5,4,"w"],[4.5,4,"g"],[5.5,4,"g"],[6.5,4,"g"],[7.5,4,"g"],[8.5,4,"g"],[9.5,4,"g"],[10.5,4,"g"],[2.0,5,"g"],[3.0,5,"g"],[4.0,5,"g"],[5.0,5,"g"],[6.0,5,"g"],[7.0,5,"g"],[8.0,5,"g"],[9.0,5,"g"],[10.0,5,"g"],[1.5,6,"g"],[2.5,6,"g"],[3.5,6,"g"],[5.5,6,"g"],[6.5,6,"g"],[8.5,6,"g"],[9.5,6,"g"],[10.5,6,"g"],[11.5,6,"g"],[1.0,7,"g"],[2.0,7,"g"],[3.0,7,"g"],[9.0,7,"g"],[10.0,7,"g"],[11.0,7,"g"],[1.5,8,"g"],[2.5,8,"g"],[3.5,8,"g"],[9.5,8,"g"],[10.5,8,"g"],[2.5,10,"g"],[8.5,10,"g"],[9.5,10,"g"],[10.5,10,"g"],[1.0,11,"g"],[2.0,11,"g"],[3.0,11,"g"],[8.0,11,"g"],[9.0,11,"g"],[10.0,11,"g"],[1.5,12,"g"],[2.5,12,"g"],[3.5,12,"g"],[4.5,12,"o"],[5.5,12,"o"],[6.5,12,"o"],[7.5,12,"g"],[8.5,12,"g"],[9.5,12,"g"],[3.0,13,"g"],[4.0,13,"o"],[5.0,13,"o"],[6.0,13,"o"],[7.0,13,"o"],[8.0,13,"g"],[9.0,13,"g"],[10.0,13,"g"],[4.5,14,"o"],[5.5,14,"o"],[6.5,14,"o"],[9.5,14,"t"],[5.0,15,"o"],[6.0,15,"o"],[5.5,16,"e"]],"lot":[[23.826,21.05],[23.641,20.404],[22.583,19.455],[18.193,16.266],[17.664,16.124],[16.739,16.185],[13.01,17.194],[11.371,17.517],[11.344,17.658],[7.351,17.679],[5.315,17.497],[4.337,17.275],[2.221,16.568],[1.164,16.387],[0.714,16.407],[0.026,16.71],[-0.661,17.214],[-3.12,19.536],[-3.94,20.121],[-4.363,20.706],[-4.363,20.928],[-4.178,21.171],[-3.279,21.776],[-1.296,22.463],[0.106,22.846],[2.644,23.23],[6.426,23.351],[15.84,23.189],[18.748,23.048],[20.573,22.866],[21.551,22.685],[22.503,22.321],[23.588,21.514]],"medians":[{"a":[2.04,18.015],"b":[-0.878,21.145]},{"a":[4.344,18.6],"b":[2.641,21.933]},{"a":[7.233,18.6],"b":[6.531,22.512]},{"a":[11.687,18.459],"b":[12.603,22.501]},{"a":[14.804,18.015],"b":[17.776,21.923]},{"a":[17.155,17.248],"b":[21.693,21.155]}],"entrance":[5.5,16],"plaza":{"cx":9.526,"cy":16.023,"rx":1.12,"ry":0.76},"walk":{"x":9.526,"y0":14.37,"y1":17.658,"w":0.72,"lamp0":15.01,"lamp1":17.21},"hub":[9.07,10.132],"lotGradY":17.56,"center":[10.132,6.258],"lake":[[9.07,9.943],[7.38,9.839],[6.763,9.701],[6.501,9.467],[5.861,8.652],[5.37,8.262],[5.005,8.124],[3.955,8.159],[3.829,8.237],[3.943,8.41],[3.566,8.574],[3.292,8.297],[2.767,8.696],[2.493,8.8],[0.484,9.042],[0.415,9.146],[0.278,9.06],[-1.138,9.112],[-1.617,9.025],[-1.903,8.722],[-1.903,8.185],[-1.697,7.803],[-1.32,7.604],[-0.521,7.569],[0.255,7.621],[0.392,7.535],[0.529,7.656],[1.054,7.673],[2.082,7.847],[3.018,7.864],[3.098,7.803],[2.938,7.491],[3.292,7.344],[3.681,7.864],[4.48,7.829],[5.439,7.691],[6.352,7.968],[6.923,7.933],[7.163,7.751],[7.254,7.024],[7.072,6.486],[6.706,6.192],[6.706,6.071],[7.722,5.178],[7.859,5.178],[8.031,5.291],[8.601,6.001],[8.955,6.2],[9.252,6.2],[9.983,6.062],[10.828,6.149],[11.581,6.097],[11.947,5.975],[12.563,5.386],[12.906,5.282],[13.203,5.282],[13.351,5.377],[13.602,5.828],[14.15,6.14],[14.402,6.608],[14.835,6.85],[15.109,7.335],[15.486,7.569],[16.126,7.76],[16.993,7.864],[17.45,7.379],[17.781,7.543],[17.598,7.803],[17.678,7.864],[17.884,7.864],[18.523,7.743],[19.734,7.257],[19.871,7.257],[19.996,7.405],[20.042,8.063],[19.939,8.366],[18.797,8.089],[17.404,8.089],[16.971,8.557],[16.617,8.375],[16.776,8.185],[16.696,8.124],[15.669,8.089],[14.596,7.899],[14.093,7.899],[13.454,8.124],[13.009,8.462],[12.643,8.964],[12.529,9.484],[12.358,9.666],[11.513,9.805]],"bridges":[{"a":[3.149,7.447],"b":[3.712,8.469],"w":0.342},{"a":[17.58,7.489],"b":[16.836,8.442],"w":0.343}],"meadows":[[-7.0,8.5,2.4,1.2],[27.0,8.0,2.6,1.2],[-9.6,19.0,2.0,1.0],[27.6,19.6,2.2,1.0],[-10.0,2.0,2.2,1.0],[28.0,2.0,2.4,1.0],[-3.0,-2.7,2.0,0.6],[21.5,-2.7,2.0,0.6]],"tiling":[["Cm",[[7.5,0],[8.0,1],[7.0,1],[6.0,1],[8.5,2],[7.5,2],[6.5,2],[8.0,3]]],["Bm",[[3.0,1],[2.0,1],[1.0,1],[3.5,2],[2.5,2],[1.5,2],[4.0,3],[3.0,3],[2.0,3],[3.5,4],[2.5,4],[1.5,4]]],["A",[[5.0,3],[6.0,3],[7.0,3],[4.5,4],[5.5,4],[6.5,4],[7.5,4],[5.0,5],[6.0,5],[7.0,5],[5.5,6],[6.5,6]]],["C",[[9.0,3],[8.5,4],[9.5,4],[10.5,4],[8.0,5],[9.0,5],[10.0,5],[8.5,6]]],["B",[[2.0,5],[3.0,5],[4.0,5],[1.5,6],[2.5,6],[3.5,6],[1.0,7],[2.0,7],[3.0,7],[1.5,8],[2.5,8],[3.5,8]]],["D",[[9.5,6],[10.5,6],[11.5,6],[9.0,7],[10.0,7],[11.0,7],[9.5,8],[10.5,8]]],["Cm",[[2.5,10],[3.0,11],[2.0,11],[1.0,11],[3.5,12],[2.5,12],[1.5,12],[3.0,13]]],["B",[[8.5,10],[9.5,10],[10.5,10],[8.0,11],[9.0,11],[10.0,11],[7.5,12],[8.5,12],[9.5,12],[8.0,13],[9.0,13],[10.0,13]]],["A",[[4.5,12],[5.5,12],[6.5,12],[4.0,13],[5.0,13],[6.0,13],[7.0,13],[4.5,14],[5.5,14],[6.5,14],[5.0,15],[6.0,15]]]]};
const CW3=Math.sqrt(3),CHX=CW3/2;
/* Bavarian species mix, re-weighted for a surrounding forest: mostly evergreens + green broadleaf, a sprinkle of autumn colour */
const CAMPUS_REGION={top:{spruce:.27,fir:.15,youngSpruce:.07,linden:.17,appleTree:.1,beech:.1,birch:.08,maple:.06},mid:{spruce:.24,fir:.13,youngSpruce:.07,linden:.17,appleTree:.13,beech:.1,birch:.09,maple:.07},bottom:{spruce:.2,fir:.1,youngSpruce:.1,linden:.15,appleTree:.18,beech:.1,birch:.09,maple:.08}};
const CAMPUS_UNDER=['geraniumBush','wildflowers','sunflowers','hedge','grassTuft','fern','grassTuft','fern','wildflowers','stones'];
const CAMPUS_CAR_COLS=['#e9e9ea','#c43a30','#2f4d7a','#4a505a','#d8a63a','#3c7a52','#f6dc8a','#b8d6ea','#f2b8b0','#9aa0a8','#f4f1ea'];
function cmChaikin(pts,n){for(let k=0;k<n;k++){const o=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];o.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25],[a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75]);}pts=o;}return pts;}
function cmInPoly(p,x,y){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;}
function cmSeg(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy;let t=l?((x-a[0])*dx+(y-a[1])*dy)/l:0;t=Math.max(0,Math.min(1,t));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);}
function cmDistPoly(p,x,y){let d=1e9;for(let i=0;i<p.length;i++)d=Math.min(d,cmSeg(x,y,p[i],p[(i+1)%p.length]));return d;}
function cmHexIn(dx,dy,s){const ax=Math.abs(dx)/s,ay=Math.abs(dy)/s;return ax<=CHX&&ay<=0.58-0.3349*ax;}
function cmPick(w,r){let t=0;for(const k in w)t+=w[k];let q=r()*t;for(const k in w){q-=w[k];if(q<=0)return k;}return Object.keys(w)[0];}
function cmWalk(poly,step,fn,closed){ /* walk a polyline at even spacing; fn(x,y,nx,ny,i) with the left normal */
  let acc=0,i=0;const n=poly.length,m=closed?n:n-1;for(let s=0;s<m;s++){const a=poly[s],b=poly[(s+1)%n],L=Math.hypot(b[0]-a[0],b[1]-a[1]),tx=(b[0]-a[0])/L,ty=(b[1]-a[1])/L;let d=step-acc;while(d<=L){fn(a[0]+tx*d,a[1]+ty*d,ty,-tx,i++);d+=step;}acc=L-(d-step);}}

let CAMPUS_MODEL=null;
function campusModel(){
  if(CAMPUS_MODEL)return CAMPUS_MODEL;
  const G=CAMPUS_GEO,F=G.frame;
  const hexes=G.hexes.filter(h=>h[2]!=='t').map(([u,r,t])=>({u,r,x:u*CW3,y:r*0.87,tone:t==='g'?'gray':t==='w'?'white':t==='o'?'orange':'entrance'}));
  const station=G.hexes.filter(h=>h[2]==='t').map(([u,r])=>({u,r,x:u*CW3,y:r*0.87,tone:'station'}))[0]||null;   /* the added train-station hex: kept out of the forest generation so the forest is unchanged; trees are removed from it afterwards */
  const stationNear=(x,y,s)=>station?cmHexIn(x-station.x,y-station.y,s):false;
  const ent=hexes.find(h=>h.tone==='entrance');
  /* ---- enclosed gaps in the hex footprint ("plots"): baked as separate inlay sprites that sit ON TOP of the park ---- */
  const CHV=[[CHX,0.29],[0,0.58],[-CHX,0.29],[-CHX,-0.29],[0,-0.58],[CHX,-0.29]];
  const occ=new Set(hexes.map(h=>h.u+','+h.r)),nbr=(u,r)=>[[u+.5,r+1],[u-.5,r+1],[u-1,r],[u-.5,r-1],[u+.5,r-1],[u+1,r]];
  const eu=hexes.map(h=>h.u),er=hexes.map(h=>h.r),U0=Math.min(...eu)-2,U1=Math.max(...eu)+2,R0=Math.min(...er)-2,R1=Math.max(...er)+2,emp=new Map();
  for(let r=R0;r<=R1;r++){const off=(((r%2)+2)%2===0)?0.5:0;for(let u=Math.ceil(U0)-1+off;u<=U1;u+=1){if(!occ.has(u+','+r))emp.set(u+','+r,[u,r]);}}
  const seen=new Set(),stack=[];emp.forEach((c,k)=>{if(c[0]<=U0+1||c[0]>=U1-1||c[1]<=R0||c[1]>=R1){seen.add(k);stack.push(c);}});
  while(stack.length){const c=stack.pop();nbr(c[0],c[1]).forEach(n=>{const k=n[0]+','+n[1];if(emp.has(k)&&!seen.has(k)){seen.add(k);stack.push(n);}});}
  const encl=new Map();emp.forEach((c,k)=>{if(!seen.has(k))encl.set(k,c);});
  const plots=[];{const left=new Map(encl);while(left.size){const [k0,c0]=left.entries().next().value;left.delete(k0);const grp=[c0],st=[c0];
    while(st.length){const c=st.pop();nbr(c[0],c[1]).forEach(n=>{const k=n[0]+','+n[1];if(left.has(k)){left.delete(k);grp.push(n);st.push(n);}});}
    const keys=new Set(grp.map(c=>c[0]+','+c[1])),cells=grp.sort((a,b)=>a[1]-b[1]||a[0]-b[0]).map(c=>({u:c[0],r:c[1],x:c[0]*CW3,y:c[1]*0.87})),edges=[];
    cells.forEach(c=>{const nn=nbr(c.u,c.r);for(let k=0;k<6;k++){if(!keys.has(nn[k][0]+','+nn[k][1]))edges.push([[c.x+CHV[k][0],c.y+CHV[k][1]],[c.x+CHV[(k+1)%6][0],c.y+CHV[(k+1)%6][1]]]);}});
    plots.push({cells,edges,has:(x,y,s)=>cells.some(c=>cmHexIn(x-c.x,y-c.y,s||1.015)),edgeDist:(x,y)=>{let d=1e9;for(const e of edges)d=Math.min(d,cmSeg(x,y,e[0],e[1]));return d;}});}}
  const hasPond=!!(G.pond&&G.pond.length>2);
  let pondPlot=null;if(hasPond){const pcx=G.pond.reduce((a,p)=>a+p[0],0)/G.pond.length,pcy=G.pond.reduce((a,p)=>a+p[1],0)/G.pond.length;pondPlot=plots.find(p=>p.has(pcx,pcy,1.3))||plots[0];}
  plots.forEach(p=>{p.id=(pondPlot&&p===pondPlot)?'pond':'grove';});
  /* keep the pond comfortably inside its plot (pull any vertex that sits too near a plot edge toward the nearest cell centre) */
  const pondFit=!hasPond?[]:G.pond.map(p=>{let x=p[0],y=p[1],n=0;const ok=()=>pondPlot.has(x,y)&&pondPlot.edgeDist(x,y)>0.14;while(!ok()&&n++<60){let b=null,bd=1e9;pondPlot.cells.forEach(c=>{const d=Math.hypot(c.x-x,c.y-y);if(d<bd){bd=d;b=c;}});x+=(b.x-x)*0.07;y+=(b.y-y)*0.07;}return[x,y];});
  const lot=cmChaikin(G.lot,3),pond=hasPond?cmChaikin(pondFit,3):[],lake=(G.lake&&G.lake.length>2)?cmChaikin(G.lake,3):null,P=G.plaza,W=G.walk,med=G.medians;
  const medBlock=(x,y,m)=>{for(const k of med)if(cmSeg(x,y,k.a,k.b)<m)return true;return false;};
  const hexNear=(x,y,s)=>{for(const h of hexes){const dx=x-h.x,dy=y-h.y;if(Math.abs(dx)>1.5||Math.abs(dy)>0.9)continue;if(cmHexIn(dx,dy,s))return true;}return false;};
  const inPlaza=(x,y,m)=>(((x-P.cx)/(P.rx+m))**2+((y-P.cy)/(P.ry+m*.7))**2)<1;
  const inWalk=(x,y,m)=>Math.abs(x-W.x)<W.w/2+m&&y>W.y0&&y<W.y1+0.02;
  const inLot=(x,y,m)=>cmInPoly(lot,x,y)||cmDistPoly(lot,x,y)<m;
  const inPond=(x,y,m)=>hasPond&&(cmInPoly(pond,x,y)||cmDistPoly(pond,x,y)<m);
  const inLake=(x,y,m)=>!!lake&&(cmInPoly(lake,x,y)||cmDistPoly(lake,x,y)<m);
  const bridges=(G.bridges||[]).map(b=>({a:b.a,b:b.b,w:b.w||0.34}));const nearBridge=(x,y,m)=>bridges.some(b=>{const dx=b.b[0]-b.a[0],dy=b.b[1]-b.a[1],l=dx*dx+dy*dy;let t=((x-b.a[0])*dx+(y-b.a[1])*dy)/l;t=Math.max(0,Math.min(1,t));return Math.hypot(x-b.a[0]-t*dx,y-b.a[1]-t*dy)<m;});
  /* meadows: open clearings that break up the forest (ellipses cx,cy,rx,ry) */
  const meadows=G.meadows||[[-5.2,6.4,2.3,1.15],[22.8,5.6,2.6,1.2],[-8.6,13.6,2.2,1.0],[22.6,13.2,2.5,1.1],[26.8,12.8,1.8,0.9],[14.6,-0.9,1.9,0.8]];
  const inMeadow=(x,y)=>meadows.some(m=>((x-m[0])/m[2])**2+((y-m[1])/m[3])**2<1);
  const inPlot=(x,y,s)=>plots.some(p=>p.has(x,y,s||1.04));
  /* layer rule: an object is FRONT (drawn after the park) only when it stands south of every park hex around it */
  const layerOf=(x,y)=>{let my=-1e9,any=false;for(const h of hexes){if(Math.abs(x-h.x)<1.5){any=true;if(h.y>my)my=h.y;}}return any?(y>my+0.12?'front':'back'):(y>8.35?'front':'back');};
  CAMPUS_MODEL={G,F,hexes,station,stationNear,ent,plots,inPlot,lot,pond,lake,inLake,bridges,nearBridge,P,W,med,medBlock,hexNear,inPlaza,inWalk,inLot,inPond,meadows,inMeadow,layerOf,FW:F.x1-F.x0,FH:F.y1-F.y0};
  return CAMPUS_MODEL;
}

/* ===== parking layout: stalls in parallel bands inside each wedge of the median fan ===== */
function campusLotLayout(M,rng){
  const hub=M.G.hub,lot=M.lot,Wk=M.W;
  const unit=(dx,dy)=>{const l=Math.hypot(dx,dy);return[dx/l,dy/l];};
  const lt=lot.reduce((a,p)=>p[0]<a[0]?p:a),rt=lot.reduce((a,p)=>p[0]>a[0]?p:a);
  const rays=[unit(lt[0]-hub[0],lt[1]-hub[1]),...M.med.map(m=>unit(m.b[0]-hub[0],m.b[1]-hub[1])),unit(rt[0]-hub[0],rt[1]-hub[1])];
  const side=(d,x,y)=>d[0]*(y-hub[1])-d[1]*(x-hub[0]);     /* perpendicular distance, signed */
  const topY=x=>{let best=1e9;for(let i=0;i<lot.length;i++){const a=lot[i],b=lot[(i+1)%lot.length];if((a[0]<=x)!==(b[0]<=x)){const t=(x-a[0])/(b[0]-a[0]),y=a[1]+t*(b[1]-a[1]);if(y<best)best=y;}}return best;};
  const stalls=[],lines=[],DT=0.22,BD=0.40,AI=0.62,MOD=BD*2+AI;
  for(let w=0;w<rays.length-1;w++){
    const dL=rays[w],dR=rays[w+1],dC=unit(dL[0]+dR[0],dL[1]+dR[1]),n=[-dC[1],dC[0]];
    const edgeM=(d,isMed)=>isMed?0.36:0.05;                  /* clearance from a median curb / the lot rim */
    const sgnL=Math.sign(side(dL,hub[0]+dC[0]*10,hub[1]+dC[1]*10))||1,sgnR=Math.sign(side(dR,hub[0]+dC[0]*10,hub[1]+dC[1]*10))||1;
    for(let k=-9;k<=9;k++){
      for(const [bo,dir] of [[0.20,1],[1.22,-1]]){
        const o=k*MOD+bo-0.1;
        for(let tau=5;tau<22;tau+=DT){
          const cx=hub[0]+dC[0]*tau+n[0]*o,cy=hub[1]+dC[1]*tau+n[1]*o;
          if(cy<topY(cx)+0.95||cy>M.F.y1)continue;
          if(!cmInPoly(lot,cx,cy)||cmDistPoly(lot,cx,cy)<0.34)continue;
          if(sgnL*side(dL,cx,cy)<edgeM(dL,w>0)||sgnR*side(dR,cx,cy)<edgeM(dR,w<rays.length-2))continue;
          if(M.medBlock(cx,cy,0.36))continue;
          if(M.inPlaza(cx,cy,0.3)||(Math.abs(cx-Wk.x)<0.85&&cy<Wk.y1+1.15))continue;
          lines.push([cx-dC[0]*DT/2-n[0]*BD/2,cy-dC[1]*DT/2-n[1]*BD/2,cx-dC[0]*DT/2+n[0]*BD/2,cy-dC[1]*DT/2+n[1]*BD/2]);
          lines.push([cx+dC[0]*DT/2-n[0]*BD/2,cy+dC[1]*DT/2-n[1]*BD/2,cx+dC[0]*DT/2+n[0]*BD/2,cy+dC[1]*DT/2+n[1]*BD/2]);
          stalls.push({x:cx,y:cy,n:[n[0]*dir,n[1]*dir],d:dC});
        }
      }
    }
  }
  return {stalls,lines};
}

/* ===== extra assets (same drawing conventions as the Bavarian pack: draw(c,x,y,u,v), (x,y)=base centre) ===== */
CAMPUS_ASSETS.reeds={cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*7+1);c.strokeStyle='rgba(255,255,255,.32)';c.lineWidth=u*0.08;c.beginPath();c.ellipse(x,y+u*0.1,u*1.3,u*0.42,0,0,7);c.stroke();
  const n=6+Math.floor(r()*3),cols=['#5f8f3a','#7aa648','#8fb858','#6c9c42'];
  for(let k=0;k<n;k++){const a=(k/(n-1)-0.5)*1.05+(r()-0.5)*0.2,h=u*(2.4+r()*1.8),bx=x+(r()-0.5)*u*0.5,tx=bx+Math.sin(a)*h*0.55,ty=y-Math.cos(a)*h;
    c.strokeStyle=cols[k%4];c.lineWidth=u*0.1;c.lineCap='round';c.beginPath();c.moveTo(bx,y);c.quadraticCurveTo(bx+Math.sin(a)*h*0.2,y-h*0.55,tx,ty);c.stroke();
    if(k%3===1){TH.ln(c,[tx,ty+u*0.1],[tx+Math.sin(a)*u*0.12,ty-u*0.75],'#6a4a2a',u*0.3);TH.ln(c,[tx+Math.sin(a)*u*0.12,ty-u*0.7],[tx+Math.sin(a)*u*0.15,ty-u*1.15],'#8a6a40',u*0.07);}}}};
CAMPUS_ASSETS.duck={cat:'prop',rho:0.04,draw(c,x,y,u,v){const f=v&1?-1:1;c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=u*0.07;c.beginPath();c.ellipse(x,y+u*0.12,u*1.5,u*0.5,0,0,7);c.stroke();c.beginPath();c.ellipse(x,y+u*0.12,u*2.1,u*0.7,0,0,7);c.globalAlpha=0.5;c.stroke();c.globalAlpha=1;
  TH.ell(c,x,y,u*0.95,u*0.5,v%3===0?'#f6f3ea':'#b08a5a');TH.ell(c,x-f*u*0.2,y-u*0.08,u*0.55,u*0.26,v%3===0?'#dcd8cc':'#8a6a40');
  TH.ell(c,x+f*u*0.75,y-u*0.55,u*0.34,u*0.32,v%3===0?'#f6f3ea':'#2f6a4a');c.fillStyle='#e8a030';c.beginPath();c.moveTo(x+f*u*1.0,y-u*0.55);c.lineTo(x+f*u*1.5,y-u*0.45);c.lineTo(x+f*u*1.0,y-u*0.4);c.fill();TH.ell(c,x+f*u*0.85,y-u*0.62,u*0.06,u*0.06,'#1a1a1a');}};
CAMPUS_ASSETS.fountainBig={cat:'ruin',rho:0.3,draw(c,x,y,u,v){
  const TOP='#d6d3c6',WAT='#6ab8d8',WATD='#4f9cbe';
  TH.ell(c,x+u*1.4,y+u*0.9,u*8.8,u*5.6,'rgba(40,56,24,.22)');
  const basin=(cx,cy,rx,ry,wh,wd)=>{const g=c.createLinearGradient(cx-rx,0,cx+rx,0);g.addColorStop(0,'#cbc8bb');g.addColorStop(0.5,'#b4b1a3');g.addColorStop(1,'#85826f');
    c.fillStyle=g;c.beginPath();c.moveTo(cx-rx,cy-wh);c.lineTo(cx-rx,cy);c.ellipse(cx,cy,rx,ry,0,Math.PI,0,true);c.lineTo(cx+rx,cy-wh);c.ellipse(cx,cy-wh,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();
    TH.ell(c,cx,cy-wh,rx,ry,TOP);TH.ell(c,cx,cy-wh,rx*0.9,ry*0.86,'#8f8c7e');TH.ell(c,cx,cy-wh+wd,rx*0.88,ry*0.82,WAT);
    TH.ell(c,cx,cy-wh+wd+ry*0.1,rx*0.62,ry*0.5,WATD);TH.ell(c,cx-rx*0.28,cy-wh+wd-ry*0.15,rx*0.4,ry*0.2,'rgba(225,247,255,.55)');
    c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=u*0.06;c.beginPath();c.ellipse(cx,cy-wh+wd,rx*0.5,ry*0.42,0,0.2,Math.PI-0.2);c.stroke();};
  const col=(cx,y0,y1,w)=>{const g=c.createLinearGradient(cx-w,0,cx+w,0);g.addColorStop(0,'#c9c6b9');g.addColorStop(1,'#8a8776');c.fillStyle=g;c.fillRect(cx-w,y1,w*2,y0-y1);};
  const b1y=y,b1h=1.5*u;basin(x,b1y,7.2*u,4.6*u,b1h,0.55*u);
  const c1=b1y-b1h-0.3*u,c1t=c1-2.6*u;col(x,c1,c1t,1.15*u);TH.ell(c,x,c1,1.15*u,0.5*u,'#9e9b8c');
  const b2y=c1t,b2h=0.85*u;basin(x,b2y,3.9*u,2.5*u,b2h,0.4*u);
  const c2=b2y-b2h-0.2*u,c2t=c2-2.0*u;col(x,c2,c2t,0.7*u);
  const b3y=c2t,b3h=0.6*u;basin(x,b3y,2.0*u,1.3*u,b3h,0.3*u);
  const top=b3y-b3h-0.1*u;TH.ell(c,x,top,0.4*u,0.2*u,'#cfcdc0');
  /* jets + cascades */
  c.lineCap='round';
  const jets=[[0,-4.3],[-0.55,-3.4],[0.55,-3.4],[-1.1,-2.4],[1.1,-2.4]];
  jets.forEach(([dx,dh],i)=>{c.strokeStyle=i===0?'rgba(235,250,255,.95)':'rgba(205,238,252,.8)';c.lineWidth=u*(i===0?0.2:0.13);c.beginPath();c.moveTo(x,top);c.quadraticCurveTo(x+dx*u*0.9,top+dh*u,x+dx*u*2.3,top+u*(0.2+(i>2?0.5:0)));c.stroke();});
  for(const sx of [-1,1])for(let k=0;k<4;k++){const px=x+sx*(1.1+k*0.62)*u;c.strokeStyle='rgba(200,236,252,.75)';c.lineWidth=u*0.1;c.beginPath();c.moveTo(px,b3y-b3h+u*0.5);c.lineTo(px+sx*u*0.12,b3y+1.3*u*0.55+u*0.2);c.stroke();}
  for(const sx of [-1,1])for(let k=0;k<6;k++){const px=x+sx*(1.2+k*0.55)*u,py0=b2y-b2h+u*0.5;c.strokeStyle='rgba(200,236,252,.7)';c.lineWidth=u*0.09;c.beginPath();c.moveTo(px,py0+u*0.4);c.lineTo(px+sx*u*0.1,b1y-b1h+u*0.9+(k%2)*u*0.2);c.stroke();}
  [[-1.6,-3.9],[1.9,-3.1],[-2.4,-1.7],[2.7,-1.4],[0.5,-4.6],[-0.8,-4.9],[1.3,-4.2]].forEach(([dx,dy])=>TH.ell(c,x+dx*u,top+dy*u*0.9,u*0.11,u*0.11,'rgba(230,248,255,.85)'));
}};
/* extruded box in screen space: poly = ground footprint in px, z0/h in px */
function cmExt(c,poly,z0,h,col,topCol,sideCol){let ar=0;for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];ar+=a[0]*b[1]-b[0]*a[1];}const sg=ar>0?1:-1;
  for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],ex=b[0]-a[0],ey=b[1]-a[1],nx=ey*sg,ny=-ex*sg,L=Math.hypot(nx,ny)||1;
    if(ny/L>0.05){c.fillStyle=sideCol||shade(col,-0.1-0.14*(nx/L));c.beginPath();c.moveTo(a[0],a[1]-z0);c.lineTo(b[0],b[1]-z0);c.lineTo(b[0],b[1]-z0-h);c.lineTo(a[0],a[1]-z0-h);c.closePath();c.fill();}}
  c.fillStyle=topCol||shade(col,0.1);c.beginPath();poly.forEach((p,i)=>i?c.lineTo(p[0],p[1]-z0-h):c.moveTo(p[0],p[1]-z0-h));c.closePath();c.fill();}
function cmCar(c,X,Y,RS,s){const n=s.n,t=[-n[1],n[0]],len=s.len,wid=s.wid;
  const corner=(a,b)=>[s.x+n[0]*a*len/2+t[0]*b*wid/2,s.y+n[1]*a*len/2+t[1]*b*wid/2];
  const fp=(a,b)=>[corner(-a,-b),corner(a,-b),corner(a,b),corner(-a,b)].map(p=>[X(p[0]),Y(p[1])]);
  const cx=X(s.x),cy=Y(s.y);TH.ell(c,cx+RS*0.015,cy+RS*0.012,len*RS*0.55,wid*RS*0.5,'rgba(30,34,40,.28)');
  cmExt(c,fp(1,1),0,RS*0.07,s.col);
  /* cabin: shifted toward the rear a little */
  const sh=0.06,cab=[corner(-0.5+sh,-0.84),corner(0.42+sh,-0.84),corner(0.42+sh,0.84),corner(-0.5+sh,0.84)].map(p=>[X(p[0]),Y(p[1])]);
  cmExt(c,cab,RS*0.07,RS*0.052,s.col,shade(s.col,0.18),'#4a6074');}

/* ===== INLAY PLOTS: the enclosed gaps inside the park footprint, each baked as its own sprite that goes ON TOP of the lands ===== */
const CAMPUS_HV=[[CHX,0.29],[0,0.58],[-CHX,0.29],[-CHX,-0.29],[0,-0.58],[CHX,-0.29]];
function campusPaintPond(g,M,X,Y,RS,rng,poly0){const PP=poly0||PP;let am=1;if(poly0){let ar=0;for(let i=0;i<PP.length;i++){const p=PP[i],q=PP[(i+1)%PP.length];ar+=p[0]*q[1]-q[0]*p[1];}am=Math.max(1,Math.sqrt(Math.abs(ar)/2)/1.7);}const poly=(c,pts)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(X(p[0]),Y(p[1])):c.moveTo(X(p[0]),Y(p[1])));c.closePath();};
  g.save();g.lineJoin='round';
  poly(g,PP);g.strokeStyle='rgba(60,104,44,.36)';g.lineWidth=RS*0.5;g.stroke();
  poly(g,PP);g.strokeStyle='#b7a572';g.lineWidth=RS*0.26;g.stroke();
  poly(g,PP);g.strokeStyle='#dacd9f';g.lineWidth=RS*0.13;g.stroke();
  poly(g,PP);const bb=PP.reduce((a,p)=>[Math.min(a[0],p[0]),Math.max(a[1],p[0]),Math.min(a[2],p[1]),Math.max(a[3],p[1])],[1e9,-1e9,1e9,-1e9]);
  const pg=g.createRadialGradient(X((bb[0]+bb[1])/2),Y((bb[2]+bb[3])/2),0,X((bb[0]+bb[1])/2),Y((bb[2]+bb[3])/2),RS*1.7*am);pg.addColorStop(0,'#4f9cbe');pg.addColorStop(0.6,'#62b0d0');pg.addColorStop(1,'#7cc6e0');g.fillStyle=pg;g.fill();
  g.save();poly(g,PP);g.clip();g.strokeStyle='rgba(205,240,250,.5)';g.lineWidth=RS*0.2;poly(g,PP);g.stroke();
  for(let k=0;k<Math.round(44*am);k++){const x=bb[0]+rng()*(bb[1]-bb[0]),y=bb[2]+rng()*(bb[3]-bb[2]);g.strokeStyle='rgba(255,255,255,'+(0.18+rng()*0.2)+')';g.lineWidth=Math.max(1,RS*0.012);const w=RS*(0.06+rng()*0.1);g.beginPath();g.moveTo(X(x)-w,Y(y));g.quadraticCurveTo(X(x),Y(y)-RS*0.025,X(x)+w,Y(y));g.stroke();}
  for(let k=0;k<Math.round(9*am*0.8);k++){let x,y,t=0;do{x=bb[0]+rng()*(bb[1]-bb[0]);y=bb[2]+rng()*(bb[3]-bb[2]);t++;}while((!cmInPoly(PP,x,y)||cmDistPoly(PP,x,y)<0.22)&&t<60);if(t>=60)continue;
    const rx=RS*(0.09+rng()*0.06),ry=rx*0.58,a=rng()*6;g.fillStyle='#5f9a44';g.beginPath();g.moveTo(X(x),Y(y));g.ellipse(X(x),Y(y),rx,ry,a,0.35,6.283-0.35);g.closePath();g.fill();g.fillStyle='#78b256';g.beginPath();g.ellipse(X(x)-rx*0.15,Y(y)-ry*0.2,rx*0.6,ry*0.5,a,0,7);g.fill();
    if(k%4===1){TH.ell(g,X(x),Y(y)-ry*0.3,rx*0.3,ry*0.34,'#f4a6cb');TH.ell(g,X(x),Y(y)-ry*0.4,rx*0.14,ry*0.16,'#fff0a0');}}
  g.restore();g.restore();
}

CAMPUS_ASSETS.bench={cat:'prop',rho:0.05,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.15,u*1.9,u*0.5,'rgba(40,56,24,.22)');[-1.2,1.2].forEach(dx=>{TH.box(c,x+dx*u*0.6,y,u,-0.12,0.12,-0.3,0.3,0,0.8,'#4a4a52','#34343c','#5a5a64');});
  TH.box(c,x,y,u,-1.5,1.5,-0.38,0.38,0.8,1.02,'#9a6a3c','#6a4426','#b88250');TH.box(c,x,y,u,-1.5,1.5,-0.38,-0.24,1.02,2.0,'#8a5a33','#5a3a22','#a8773f');}};
function campusBakePlot(M,plot,RS,seed){
  const rng=mulberry(seed),cells=plot.cells,u0=0.075*RS;
  const minX=Math.min(...cells.map(c=>c.x-CHX)),maxX=Math.max(...cells.map(c=>c.x+CHX)),minY=Math.min(...cells.map(c=>c.y-0.58)),maxY=Math.max(...cells.map(c=>c.y+0.58));
  const gx0=minX-0.6,gy0=minY-1.3,w=Math.ceil((maxX-minX+1.2)*RS),h=Math.ceil((maxY-minY+1.3+0.45)*RS);
  const X=x=>(x-gx0)*RS,Y=y=>(y-gy0)*RS,cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d');g.imageSmoothingQuality='high';
  const unionPath=k=>{g.beginPath();cells.forEach(c=>{CAMPUS_HV.forEach((v,i)=>{const px=X(c.x+v[0]*k),py=Y(c.y+v[1]*k);i?g.lineTo(px,py):g.moveTo(px,py);});g.closePath();});};
  const soft=(x,y,rx,ry,rgb,a)=>{g.save();g.translate(x,y);g.scale(1,ry/rx);const q=g.createRadialGradient(0,0,0,0,0,rx);q.addColorStop(0,`rgba(${rgb},${a})`);q.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);q.addColorStop(1,`rgba(${rgb},0)`);g.fillStyle=q;g.beginPath();g.arc(0,0,rx,0,7);g.fill();g.restore();};
  const pt=()=>[X(minX)+rng()*(X(maxX)-X(minX)),Y(minY)+rng()*(Y(maxY)-Y(minY))],AK=cells.length*2.6/31;
  /* path for the grove: through the cell centres, left to right */
  const path=plot.id==='grove'?cells.slice().sort((a,b)=>a.x-b.x).map(c=>[c.x,c.y+0.04]):null;
  const pathD=(x,y)=>{if(!path)return 9;let d=1e9;for(let i=0;i<path.length-1;i++)d=Math.min(d,cmSeg(x,y,path[i],path[i+1]));return d;};
  /* ---- ground (clipped to the plot's hex cells) ---- */
  g.save();unionPath(1.012);g.clip();
  g.fillStyle='#8fbf68';g.fillRect(0,0,w,h);
  for(let k=0;k<46*AK;k++){const p=pt(),r=RS*(0.45+rng()*0.9);soft(p[0],p[1],r,r*0.4,rng()<0.5?'190,230,130':'80,140,60',0.2);}
  for(let k=0;k<12*AK;k++){const p=pt(),r=RS*(0.3+rng()*0.5);soft(p[0],p[1],r,r*0.4,'236,224,140',0.15);}
  for(let k=0;k<12*AK;k++){const p=pt(),r=RS*(0.3+rng()*0.5);soft(p[0],p[1],r,r*0.4,'255,255,210',0.14);}
  for(let k=0;k<160*AK;k++){const p=pt(),hh=RS*(0.05+rng()*0.06);for(let j=0;j<3;j++)TH.ln(g,[p[0],p[1]],[p[0]+(j-1)*hh*0.5,p[1]-hh],['#78b856','#68a84a','#92cc6a'][(k+j)%3],RS*0.011);}
  for(let k=0;k<70*AK;k++){const p=pt(),a=rng()*3.14,l=RS*(0.03+rng()*0.035);TH.ell(g,p[0],p[1],l,l*0.55,['#e8892a','#f0b83a','#c8402a','#e0a030'][k%4],a);}
  for(let k=0;k<70*AK;k++){const p=pt();TH.ell(g,p[0],p[1],RS*0.012,RS*0.01,['#f6efe0','#f2c230','#6a8ae8','#f4a6cb','#fff0a0'][k%5]);}
  if(plot.id==='pond')campusPaintPond(g,M,X,Y,RS,rng);
  if(path){g.lineCap='round';g.lineJoin='round';const pp=()=>{g.beginPath();path.forEach((p,i)=>i?g.lineTo(X(p[0]),Y(p[1])):g.moveTo(X(p[0]),Y(p[1])));};
    pp();g.strokeStyle='rgba(60,70,40,.28)';g.lineWidth=RS*0.24;g.stroke();pp();g.strokeStyle='#c9bd98';g.lineWidth=RS*0.2;g.stroke();pp();g.strokeStyle='#ded3b0';g.lineWidth=RS*0.15;g.stroke();
    for(let k=0;k<90;k++){const i=Math.floor(rng()*(path.length-1)),t=rng(),p=[path[i][0]+(path[i+1][0]-path[i][0])*t,path[i][1]+(path[i+1][1]-path[i][1])*t];TH.ell(g,X(p[0])+(rng()-0.5)*RS*0.12,Y(p[1])+(rng()-0.5)*RS*0.07,RS*0.012,RS*0.008,rng()<0.5?'#b8ac86':'#efe6c8');}}
  /* soft plot edge so it reads as a planted inlay rather than a flat decal */
  g.strokeStyle='rgba(50,92,38,.30)';g.lineWidth=RS*0.07;plot.edges.forEach(e=>{g.beginPath();g.moveTo(X(e[0][0]),Y(e[0][1]));g.lineTo(X(e[1][0]),Y(e[1][1]));g.stroke();});
  g.restore();
  /* ---- upright objects (their canopies may overlap the neighbouring lands: that is the point) ---- */
  const objs=[],add=(k,x,y,s,ex)=>objs.push(Object.assign({k,x,y,s:s||1,v:Math.floor(rng()*1000)},ex||{}));
  const inPond=(x,y,m)=>cmInPoly(M.pond,x,y)||cmDistPoly(M.pond,x,y)<m;
  if(plot.id==='pond'){let n=0;cmWalk(M.pond,0.5,(x,y,nx,ny)=>{if(rng()<0.35)return;const ins=cmInPoly(M.pond,x+nx*0.1,y+ny*0.1)?1:-1,px=x-nx*ins*0.06+(rng()-0.5)*0.08,py=y-ny*ins*0.06;
      if(n++%4===0)add('stones',x+nx*ins*-0.2,y+ny*ins*-0.2,0.6+rng()*0.25);else add('reeds',px,py,0.85+rng()*0.4);},true);
    for(let k=0;k<3;k++){let x,y,t=0;do{x=M.pond[0][0]+(rng()-0.5)*2.4;y=M.pond[0][1]+(rng()-0.2)*3;t++;}while((!cmInPoly(M.pond,x,y)||cmDistPoly(M.pond,x,y)<0.28)&&t<200);if(t<200)add('duck',x,y,1.0);}}
  /* trees + landscaping inside the plot */
  const wts=plot.id==='grove'?{linden:.2,appleTree:.18,birch:.15,beech:.12,maple:.12,spruce:.1,youngSpruce:.08,fir:.05}:{linden:.22,appleTree:.2,birch:.18,beech:.1,maple:.08,youngSpruce:.14,spruce:.08};
  const keep=plot.id==='grove'?0.13:0.15,sepX=plot.id==='grove'?0.34:0.38,sepY=plot.id==='grove'?0.2:0.22,placed=[];
  const cand=[];cells.forEach(c=>{for(let k=0;k<120;k++)cand.push([c.x+(rng()-0.5)*CHX*2,c.y+(rng()-0.5)*1.16]);});
  for(const [x,y] of cand){if(!plot.has(x,y,1)||plot.edgeDist(x,y)<keep)continue;if(plot.id==='pond'&&inPond(x,y,0.34))continue;if(pathD(x,y)<0.26)continue;
    if(placed.some(q=>((x-q[0])/sepX)**2+((y-q[1])/sepY)**2<1))continue;placed.push([x,y]);add(cmPick(wts,rng),x,y,1.05+rng()*0.4);
    if(rng()<0.6&&plot.has(x+0.2,y+0.14,1)&&!(plot.id==='pond'&&inPond(x+0.2,y+0.14,0.3)))add(CAMPUS_UNDER[Math.floor(rng()*CAMPUS_UNDER.length)],x+(rng()-0.5)*0.4,y+0.12,0.8+rng()*0.4);}
  if(path){for(let i=0;i<path.length-1;i++){const a=path[i],b=path[i+1],m=[(a[0]+b[0])/2,(a[1]+b[1])/2],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L,sg=i%2?-1:1;
      add('bench',m[0]+nx*0.3*sg,m[1]+ny*0.3*sg,1.0);}
    add('lampPost',path[1][0]+0.05,path[1][1]-0.25,0.95);
    for(let i=0;i<path.length-1;i++){for(let k=0;k<6;k++){const tt=(k+0.5)/6,x=path[i][0]+(path[i+1][0]-path[i][0])*tt,y=path[i][1]+(path[i+1][1]-path[i][1])*tt,sg=k%2?1:-1;const px=x,py=y+sg*0.2;if(plot.has(px,py,1)&&plot.edgeDist(px,py)>0.12)add(['geraniumBush','wildflowers','sunflowers'][k%3],px+(rng()-0.5)*0.1,py,0.7);}}}
  objs.sort((a,b)=>a.y-b.y).forEach(o=>{const A=CAMPUS_ASSETS[o.k];if(A)A.draw(g,X(o.x),Y(o.y),u0*o.s,o.v);});
  return{id:plot.id,canvas:cv,ox:X(0),oy:Y(0),w,h,cells:cells.map(c=>({u:c.u,r:c.r})),count:objs.length};
}

const CAMPUS_VARIANT='plain';
/* ===== BAKE ===== */
function campusObjectSprite(o,R){
  const unit=(o.bridge||o.tunnel?2:(o.fu||0.075*(o.s||1)))*R;
  return {x:o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>{
    const X=v=>x+(v-o.x)*R, Y=v=>y+(v-o.y)*R;
    if(o.tunnel){campusDrawTunnel(ctx,o.train,X,Y,R);return;}
    if(o.bridge){campusDrawBridge(ctx,o.b,X,Y,R);return;}
    if(o.car){cmCar(ctx,X,Y,R,o);return;}
    const asset=CAMPUS_ASSETS[o.k];
    if(!asset)throw new Error(`Missing campus scenery asset: ${o.k}`);
    asset.draw(ctx,x,y,unit,o.v);
  }};
}
let CAMPUS_CACHE={};
function bakeCampus(R,opts){
  opts=opts||{};const S=opts.scale||getBakeScale(),key=R+'|'+S+'|'+(typeof CAMPUS_VARIANT!=='undefined'?CAMPUS_VARIANT:'plain');if(CAMPUS_CACHE[key]&&!opts.fresh)return CAMPUS_CACHE[key];
  const t0=performance.now(),M=campusModel(),F=M.F,RS=R*S,Wpx=Math.ceil(M.FW*RS),Hpx=Math.ceil(M.FH*RS);
  const TR=(typeof CAMPUS_VARIANT!=='undefined'&&CAMPUS_VARIANT==='train'&&typeof campusTrain==='function')?campusTrain(M):null;
  const mk=()=>{const c=document.createElement('canvas');c.width=Wpx;c.height=Hpx;return c;};
  const gC=mk(),g=gC.getContext('2d');g.imageSmoothingQuality='high';
  const X=x=>(x-F.x0)*RS,Y=y=>(y-F.y0)*RS,u0=0.075*RS,rng=mulberry(opts.seed||5107);
  const poly=(c,pts)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(X(p[0]),Y(p[1])):c.moveTo(X(p[0]),Y(p[1])));c.closePath();};
  const soft=(x,y,rx,ry,rgb,a)=>{g.save();g.translate(x,y);g.scale(1,ry/rx);const q=g.createRadialGradient(0,0,0,0,0,rx);q.addColorStop(0,`rgba(${rgb},${a})`);q.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);q.addColorStop(1,`rgba(${rgb},0)`);g.fillStyle=q;g.beginPath();g.arc(0,0,rx,0,7);g.fill();g.restore();};
  const pt=()=>[rng()*Wpx,rng()*Hpx],AK=M.FW*M.FH/31;                      /* Bavarian land detail density x frame area */
  /* ---------- 1. GROUND: Bavarian grass + its soft patches / tufts / leaves / flowers ---------- */
  g.fillStyle='#8fbf68';g.fillRect(0,0,Wpx,Hpx);
  for(let k=0;k<46*AK;k++){const p=pt(),w=RS*(0.45+rng()*0.9);soft(p[0],p[1],w,w*0.4,rng()<0.5?'190,230,130':'80,140,60',0.2);}
  for(let k=0;k<320;k++){const p=pt(),w=RS*(0.7+rng()*1.3);soft(p[0],p[1],w,w*0.42,'58,112,48',0.2);}            /* deeper forest-floor shade */
  for(let k=0;k<12*AK;k++){const p=pt(),w=RS*(0.3+rng()*0.5);soft(p[0],p[1],w,w*0.4,'236,224,140',0.15);}
  for(let k=0;k<8*AK;k++){const p=pt(),w=RS*(0.25+rng()*0.4);soft(p[0],p[1],w,w*0.4,'150,116,70',0.14);}
  for(let k=0;k<12*AK;k++){const p=pt(),w=RS*(0.3+rng()*0.5);soft(p[0],p[1],w,w*0.4,'255,255,210',0.14);}
  for(let k=0;k<160*AK;k++){const p=pt(),h=RS*(0.05+rng()*0.06);for(let j=0;j<3;j++)TH.ln(g,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#78b856','#68a84a','#92cc6a'][(k+j)%3],RS*0.011);}
  for(let k=0;k<70*AK;k++){const p=pt(),a=rng()*3.14,l=RS*(0.03+rng()*0.035);TH.ell(g,p[0],p[1],l,l*0.55,['#e8892a','#f0b83a','#c8402a','#e0a030'][k%4],a);}
  for(let k=0;k<70*AK;k++){const p=pt();TH.ell(g,p[0],p[1],RS*0.012,RS*0.01,['#f6efe0','#f2c230','#6a8ae8','#f4a6cb','#fff0a0'][k%5]);}
  /* meadows get a lighter, flower-rich sward */
  M.meadows.forEach(m=>{for(let k=0;k<14;k++){const a=rng()*6.283,rr=Math.sqrt(rng());soft(X(m[0]+Math.cos(a)*m[2]*rr*0.9),Y(m[1]+Math.sin(a)*m[3]*rr*0.9),RS*(0.5+rng()*0.6),RS*0.22,'206,238,150',0.2);}});
  if(M.lake)campusPaintPond(g,M,X,Y,RS,mulberry(4411),M.lake);                                        /* the lake (small park) */
  /* ---------- 2. PARKING LOT ---------- */
  g.save();g.lineJoin='round';g.lineCap='round';
  poly(g,M.lot);g.strokeStyle='rgba(52,104,40,.30)';g.lineWidth=RS*0.62;g.stroke();              /* shaded verge */
  poly(g,M.lot);g.strokeStyle='rgba(30,40,26,.22)';g.lineWidth=RS*0.26;g.stroke();                /* curb shadow */
  poly(g,M.lot);g.strokeStyle='#cdd0cf';g.lineWidth=RS*0.15;g.stroke();                           /* concrete curb */
  poly(g,M.lot);g.strokeStyle='#e4e6e3';g.lineWidth=RS*0.05;g.stroke();
  poly(g,M.lot);const ag=g.createLinearGradient(0,Y(M.G.lotGradY||10.6),0,Y(F.y1));ag.addColorStop(0,'#8a9099');ag.addColorStop(1,'#767c85');g.fillStyle=ag;g.fill();
  g.save();poly(g,M.lot);g.clip();
  for(let k=0;k<26;k++){const p=pt(),w=RS*(0.8+rng()*1.6);soft(p[0],p[1],w,w*0.36,rng()<0.5?'255,255,255':'40,44,52',rng()<0.5?0.06:0.07);}
  for(let k=0;k<5200;k++){const p=pt();g.fillStyle=rng()<0.5?'rgba(255,255,255,.07)':'rgba(0,0,0,.09)';g.fillRect(p[0],p[1],Math.max(1,RS*0.012),Math.max(1,RS*0.012));}
  const L=campusLotLayout(M,rng);
  g.strokeStyle='rgba(246,244,234,.92)';g.lineWidth=Math.max(1,RS*0.022);g.lineCap='butt';g.beginPath();L.lines.forEach(l=>{g.moveTo(X(l[0]),Y(l[1]));g.lineTo(X(l[2]),Y(l[3]));});g.stroke();
  g.restore();
  /* medians: curbed planting islands */
  M.med.forEach(m=>{g.lineCap='round';g.strokeStyle='rgba(20,26,22,.28)';g.lineWidth=RS*0.44;g.beginPath();g.moveTo(X(m.a[0]),Y(m.a[1])+RS*0.03);g.lineTo(X(m.b[0]),Y(m.b[1])+RS*0.03);g.stroke();
    g.strokeStyle='#d3d5d4';g.lineWidth=RS*0.38;g.beginPath();g.moveTo(X(m.a[0]),Y(m.a[1]));g.lineTo(X(m.b[0]),Y(m.b[1]));g.stroke();
    g.strokeStyle='#8fbf68';g.lineWidth=RS*0.30;g.beginPath();g.moveTo(X(m.a[0]),Y(m.a[1]));g.lineTo(X(m.b[0]),Y(m.b[1]));g.stroke();
    g.strokeStyle='rgba(80,140,60,.35)';g.lineWidth=RS*0.14;g.stroke();});
  g.restore();
  /* ---------- 3. ENTRANCE WALK + CIRCLE ---------- */
  const Wk=M.W,P=M.P;
  const walkP=()=>{g.beginPath();g.rect(X(Wk.x-Wk.w/2),Y(Wk.y0),Wk.w*RS,(Wk.y1+0.02-Wk.y0)*RS);};
  const plazaP=(k)=>{g.beginPath();g.ellipse(X(P.cx),Y(P.cy),P.rx*RS*(k||1),P.ry*RS*(k||1),0,0,7);};
  g.save();g.fillStyle='rgba(30,40,26,.26)';walkP();g.save();g.translate(0,RS*0.03);g.fill();g.restore();plazaP(1.03);g.save();g.translate(0,RS*0.035);g.fill();g.restore();g.restore();
  g.save();g.fillStyle='#e3d9c0';walkP();g.fill();plazaP();g.fill();
  g.beginPath();g.rect(X(Wk.x-Wk.w/2),Y(Wk.y0),Wk.w*RS,(Wk.y1+0.02-Wk.y0)*RS);g.ellipse(X(P.cx),Y(P.cy),P.rx*RS,P.ry*RS,0,0,7);g.clip();
  g.strokeStyle='rgba(150,134,98,.38)';g.lineWidth=Math.max(1,RS*0.012);
  {const cw=0.2,ch=0.12;let row=0;for(let y=Wk.y0;y<Wk.y1+0.1;y+=ch,row++){g.beginPath();g.moveTo(X(Wk.x-Wk.w/2),Y(y));g.lineTo(X(Wk.x+Wk.w/2),Y(y));g.stroke();for(let x=Wk.x-Wk.w/2+(row%2?cw/2:0);x<Wk.x+Wk.w/2;x+=cw){g.beginPath();g.moveTo(X(x),Y(y));g.lineTo(X(x),Y(y+ch));g.stroke();}}}
  for(const k of [0.9,0.82]){plazaP(k);g.stroke();}
  for(let a=0;a<6.283;a+=0.2){g.beginPath();g.moveTo(X(P.cx+Math.cos(a)*P.rx*0.82),Y(P.cy+Math.sin(a)*P.ry*0.82));g.lineTo(X(P.cx+Math.cos(a)*P.rx*1.0),Y(P.cy+Math.sin(a)*P.ry*1.0));g.stroke();}
  for(let k=0;k<50;k++){const p=pt();g.fillStyle=rng()<0.5?'rgba(255,255,255,.12)':'rgba(120,100,60,.10)';g.fillRect(p[0],p[1],RS*0.05,RS*0.03);}
  g.restore();
  g.save();g.strokeStyle='#b6aa8a';g.lineWidth=Math.max(1.5,RS*0.04);walkP();g.stroke();plazaP();g.stroke();g.restore();
  /* flower bed ring inside the circle */
  g.save();g.beginPath();g.ellipse(X(P.cx),Y(P.cy),P.rx*0.74*RS,P.ry*0.74*RS,0,0,7);g.fillStyle='#7fae58';g.fill();g.strokeStyle='#bdb8a6';g.lineWidth=Math.max(1.5,RS*0.05);g.stroke();
  g.save();g.clip();for(let k=0;k<26;k++){const a=rng()*6.283,rr=0.3+rng()*0.7;soft(X(P.cx+Math.cos(a)*P.rx*0.7*rr),Y(P.cy+Math.sin(a)*P.ry*0.7*rr),RS*0.3,RS*0.12,rng()<0.5?'176,222,120':'70,130,56',0.3);}
  for(let k=0;k<150;k++){const a=rng()*6.283,rr=Math.sqrt(rng())*0.7;TH.ell(g,X(P.cx+Math.cos(a)*P.rx*rr),Y(P.cy+Math.sin(a)*P.ry*rr),RS*0.014,RS*0.011,['#f4a6cb','#e0483a','#f6efe0','#f2c230','#b070d8'][k%5]);}g.restore();g.restore();
  /* zebra crossing where the walk meets the lot's drive lane */
  g.fillStyle='rgba(246,244,234,.95)';for(let i=0;i<7;i++){const bx=Wk.x-Wk.w/2+0.05+i*(Wk.w-0.1)/7;g.fillRect(X(bx),Y(Wk.y1+0.06),RS*(Wk.w-0.1)/7*0.58,RS*0.62);}
  if(TR)campusDrawTrack(g,TR,X,Y,RS,mulberry(8123));                                                          /* train loop: track only */
  /* ---------- 5. OBJECTS ---------- */
  const objs=[],tally={};const add=(k,x,y,s,extra)=>{const o=Object.assign({k,x,y,s:s||1,v:Math.floor(rng()*1000)},extra||{});o.layer=o.layer||M.layerOf(x,y);objs.push(o);tally[k]=(tally[k]||0)+1;return o;};
  /* forest */
  const cand=[];for(let gy=F.y0-0.9;gy<F.y1+0.9;gy+=0.2)for(let gx=F.x0-0.9;gx<F.x1+0.9;gx+=0.31)cand.push([gx+(rng()-0.5)*0.4,gy+(rng()-0.5)*0.26]);
  for(let i=cand.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[cand[i],cand[j]]=[cand[j],cand[i]];}
  const cell=0.55,hash=new Map(),hk=(a,b)=>a+','+b,sepX=0.43,sepY=0.26;
  const free=(x,y)=>{const cx=Math.floor(x/cell),cy=Math.floor(y/cell);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const a=hash.get(hk(cx+i,cy+j));if(a)for(const q of a){const dx=(x-q[0])/sepX,dy=(y-q[1])/sepY;if(dx*dx+dy*dy<1)return false;}}return true;};
  const trees=[];
  for(const [x,y] of cand){
    if(M.hexNear(x,y,1.13)||M.inPlot(x,y)||M.inLot(x,y,0.5)||M.inPlaza(x,y,0.5)||M.inWalk(x,y,0.55)||M.inPond(x,y,0.5)||M.inLake(x,y,0.5)||M.medBlock(x,y,0.4))continue;
    let dh=1e9;for(const h of M.hexes){const d=Math.hypot(x-h.x,(y-h.y)*1.4);if(d<dh)dh=d;}dh-=0.95;
    let p=1;if(dh<1.4)p*=0.5+0.5*Math.max(0,dh)/1.4;const dl=M.inLot(x,y,5)?cmDistPoly(M.lot,x,y):9;if(dl<1.5)p*=0.55+0.45*(dl-0.5)/1.0;
    if(M.inMeadow(x,y))p*=0.05;if(rng()>p)continue;if(!free(x,y))continue;
    const cx=Math.floor(x/cell),cy=Math.floor(y/cell),kk=hk(cx,cy);(hash.get(kk)||hash.set(kk,[]).get(kk)).push([x,y]);
    const ty=(y-F.y0)/M.FH,reg=ty<0.33?'top':ty<0.66?'mid':'bottom',w=Object.assign({},CAMPUS_REGION[reg]),cl=0.5+0.5*Math.sin(x*0.55+Math.cos(y*0.4)*1.8)*Math.cos(y*0.35-x*0.2);
    const far=Math.min(1,Math.max(0,(Math.hypot((x-(M.G.center?M.G.center[0]:9.0))/1.0,(y-(M.G.center?M.G.center[1]:3.9))*1.5)-7)/12));          /* 0 near the park -> 1 deep forest */
    ['spruce','fir','youngSpruce'].forEach(k=>w[k]*=(0.55+1.3*cl)*(1+1.6*far));['linden','appleTree','beech','birch','maple'].forEach(k=>w[k]*=(0.55+1.3*(1-cl))*(1-0.55*far)*(k==='maple'?1-0.7*far:1));
    const bigS=(1.2+rng()*0.55)*(0.86+0.14*Math.min(1,Math.max(0,dh)/1.5));
    trees.push(add(cmPick(w,rng),x,y,bigS,{nat:true}));
    if(rng()<0.5){const ux=x+(rng()-0.5)*0.5,uy=y+0.1+rng()*0.1;if(!M.inPlot(ux,uy))add(CAMPUS_UNDER[Math.floor(rng()*CAMPUS_UNDER.length)],ux,uy,0.85+rng()*0.4,{nat:true});}
  }
  /* meadow dressing */
  M.meadows.forEach(m=>{for(let k=0;k<34;k++){const a=rng()*6.283,rr=Math.sqrt(rng())*0.92,x=m[0]+Math.cos(a)*m[2]*rr,y=m[1]+Math.sin(a)*m[3]*rr;if(M.hexNear(x,y,1.1)||M.inPlot(x,y)||M.inLot(x,y,0.4))continue;add(['wildflowers','sunflowers','grassTuft','wildflowers','fern','geraniumBush'][k%6],x,y,0.85+rng()*0.5,{nat:true});}
    for(let k=0;k<3;k++){const a=rng()*6.283,rr=0.3+rng()*0.55;add(['appleTree','birch','appleTree'][k],m[0]+Math.cos(a)*m[2]*rr,m[1]+Math.sin(a)*m[3]*rr,1.1+rng()*0.3);}});
  /* lake dressing: reeds + stones round the shore, ducks on the water */
  if(M.lake){let n=0;cmWalk(M.lake,0.55,(x,y,nx,ny)=>{if(rng()<0.42)return;const ins=cmInPoly(M.lake,x+nx*0.1,y+ny*0.1)?1:-1,px=x-nx*ins*0.06+(rng()-0.5)*0.1,py=y-ny*ins*0.06;if(M.hexNear(px,py,1.02)||M.nearBridge(px,py,0.5))return;if(n++%4===0)add('stones',x+nx*ins*-0.22,y+ny*ins*-0.22,0.6+rng()*0.25);else add('reeds',px,py,0.85+rng()*0.4);},true);
    for(let k=0;k<7;k++){let x,y,t=0;const bb=M.lake.reduce((a,p)=>[Math.min(a[0],p[0]),Math.max(a[1],p[0]),Math.min(a[2],p[1]),Math.max(a[3],p[1])],[1e9,-1e9,1e9,-1e9]);do{x=bb[0]+rng()*(bb[1]-bb[0]);y=bb[2]+rng()*(bb[3]-bb[2]);t++;}while((!cmInPoly(M.lake,x,y)||cmDistPoly(M.lake,x,y)<0.5||M.nearBridge(x,y,0.7))&&t<300);if(t<300)add('duck',x,y,1.0);}}
  /* lot: planted medians, lamps, north hedge line, cars */
  M.med.forEach((m,i)=>{let j=0;cmWalk([m.a,m.b],0.95,(x,y)=>{add(['youngSpruce','appleTree','birch'][(i+j++)%3],x,y,0.72,{layer:'front'});add(j%2?'hedge':'geraniumBush',x+0.02,y+0.45,0.55,{layer:'front'});});
    [m.a,m.b,[(m.a[0]+m.b[0])/2,(m.a[1]+m.b[1])/2]].forEach((q,qi)=>add('lampPost',q[0]+(qi===2?0:0),q[1]+(qi===0?-0.05:0.0),0.95,{layer:'front'}));});
  {let n=0;cmWalk(M.lot,0.5,(x,y,nx,ny)=>{if(cmInPoly(M.lot,x+nx*0.15,y+ny*0.15)){nx=-nx;ny=-ny;}if(ny>-0.25)return;const px=x+nx*0.34,py=y+ny*0.34;if(Math.abs(px-Wk.x)<0.95&&py>Wk.y0)return;if(M.hexNear(px,py,1.1))return;
    add('hedge',px,py,0.78+rng()*0.2);if(++n%5===0)add(['youngSpruce','birch','appleTree'][n%3],px+nx*0.28,py+ny*0.28,0.85);},true);}
  const lay=campusLotLayout(M,mulberry(99));lay.stalls.forEach(s=>{if(rng()<0.42)objs.push(Object.assign({car:true,layer:'front',len:0.34+rng()*0.06,wid:0.17,col:CAMPUS_CAR_COLS[Math.floor(rng()*CAMPUS_CAR_COLS.length)]},s)),tally.car=(tally.car||0)+1;});
  /* walk + circle */
  for(const sx of [-1,1]){for(let y=Wk.y0+0.4;y<P.cy-P.ry-0.12;y+=0.5)if(!(TR&&TR.zone&&y>TR.zone.y0&&y<TR.zone.y1))add('hedge',Wk.x+sx*0.52,y,0.55,{layer:'front'});for(let y=P.cy+P.ry+0.12;y<Wk.y1-0.04;y+=0.5)add('hedge',Wk.x+sx*0.52,y,0.55,{layer:'front'});
    add('lampPost',Wk.x+sx*0.66,(TR&&TR.lampY)?TR.lampY:(Wk.lamp0||8.05),1.0,{layer:'front'});add('lampPost',Wk.x+sx*0.66,Wk.lamp1||10.25,1.0,{layer:'front'});}
  for(let k=0;k<10;k++){const a=k/10*6.283+0.3;add('geraniumBush',P.cx+Math.cos(a)*P.rx*0.69,P.cy+Math.sin(a)*P.ry*0.69,0.62,{layer:'front'});}
  add('fountainBig',P.cx,P.cy,1,{layer:'front',fu:0.58/7.2});
  /* clearings, applied AFTER generation so the forest everywhere else is exactly the same: the added station hex (both maps) and the train corridor (train map) */
  {let removed=0;for(let i=objs.length-1;i>=0;i--){const o=objs[i];if(!o.nat)continue;if(M.stationNear(o.x,o.y,1.13)||(TR&&TR.clear(o.x,o.y))||M.nearBridge(o.x,o.y,0.55)){tally[o.k]--;objs.splice(i,1);removed++;}}
   for(let i=trees.length-1;i>=0;i--)if(objs.indexOf(trees[i])<0)trees.splice(i,1);tally._cleared=removed;}
  M.bridges.forEach(b=>objs.push({bridge:true,b,x:(b.a[0]+b.b[0])/2,y:(b.a[1]+b.b[1])/2+0.05,k:'bridge'}));
  if(TR&&TR.tun)objs.push({tunnel:true,train:TR,x:TR.tun.x,y:TR.tun.yc+0.5,k:'tunnel'});
  const inlays=M.plots.map((p,i)=>campusBakePlot(M,p,RS,7000+i*31));
  const sprites=objs.map(o=>campusObjectSprite(o,R));
  const camp={ground:gC,sprites,inlays,w:Wpx,h:Hpx,ox:X(0),oy:Y(0),R,scale:S,
    hexes:M.hexes.concat(M.station?[M.station]:[]).map(h=>({u:h.u,r:h.r,tone:h.tone,x:h.x*RS,y:h.y*RS})),            /* centres relative to the anchor (hex u=0,r=0) */
    entrance:{x:M.ent.x*RS,y:M.ent.y*RS,u:M.ent.u,r:M.ent.r},
    station:M.station?{u:M.station.u,r:M.station.r,x:M.station.x*RS,y:M.station.y*RS}:null,
    train:TR?{track:TR.S.map(s=>[Math.round(s.x*RS*10)/10,Math.round(s.y*RS*10)/10]),lengthR:TR.len,tunnel:TR.tun?{x:TR.tun.x*RS,y:TR.tun.yc*RS,portalHalfSpan:0.75*RS,deckHeight:TR.tun.h*RS}:null,underHex:TR.underHex||null}:null,
    plaza:{x:P.cx*RS-0+0,y:P.cy*RS,rx:P.rx*RS,ry:P.ry*RS},walk:{x:Wk.x*RS,y0:Wk.y0*RS,y1:Wk.y1*RS,w:Wk.w*RS},
    landPlan:M.G.tiling.map(([n,cs])=>({shape:n.replace('m',''),mirror:/m$/.test(n),hexes:cs.map(c=>({u:c[0],r:c[1]}))})),
    stats:{inlays:inlays.map(q=>q.id+':'+q.count).join(', '),trees:trees.length,objects:objs.length,tally,ms:Math.round(performance.now()-t0),back:objs.filter(o=>o.layer==='back').length,front:objs.filter(o=>o.layer==='front').length}};
  CAMPUS_CACHE={[key]:camp};return camp;
}
/* anchor (ax,ay) = screen position of park hex (u=0,r=0); lands sit at ax+u*sqrt3*R, ay+r*0.87*R */
function drawCampusGround(ctx,ax,ay,c){ctx.drawImage(c.ground,ax-c.ox/c.scale,ay-c.oy/c.scale,c.w/c.scale,c.h/c.scale);}
function drawCampusBack(ctx,ax,ay,c){ctx.drawImage(c.back,ax-c.ox,ay-c.oy);}
function drawCampusInlays(ctx,ax,ay,c){c.inlays.forEach(q=>ctx.drawImage(q.canvas,ax-q.ox/c.scale,ay-q.oy/c.scale,q.w/c.scale,q.h/c.scale));}
function drawCampusFront(ctx,ax,ay,c){ctx.drawImage(c.front,ax-c.ox,ay-c.oy);}
function campusHexPos(c,u,r){return{x:u*CW3*c.R*c.scale,y:r*0.87*c.R*c.scale};}
function campusFootprint(){const F=CAMPUS_GEO.frame;return{w:F.x1-F.x0,h:F.y1-F.y0,x0:F.x0,y0:F.y0};}

/* ---- a wooden footbridge across the water: raised plank deck on piles, with handrails (drawn on the back layer; the ends tuck under the lands) ---- */
function campusDrawBridge(c,B,X,Y,RS){
  const K=0.58,w=B.w,h=0.075,ax=B.a[0],ay=B.a[1]/K,bx=B.b[0],by=B.b[1]/K,L=Math.hypot(bx-ax,by-ay),dx=(bx-ax)/L,dy=(by-ay)/L,nx=-dy,ny=dx;
  const P=(s,t,z)=>[X(ax+dx*s+nx*t),Y((ay+dy*s+ny*t)*K-z)],s0=-0.12,s1=L+0.12;
  const poly=(pts,fill,stroke,lw)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}};
  const line=(a,b,col,lw)=>{c.strokeStyle=col;c.lineWidth=lw;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();};
  c.save();c.lineJoin='round';c.lineCap='round';
  poly([P(s0,-w/2-0.05,0),P(s1,-w/2-0.05,0),P(s1,w/2+0.05,0),P(s0,w/2+0.05,0)].map(p=>[p[0]+RS*0.012,p[1]+RS*0.03]),'rgba(10,40,60,.32)');
  const nP=Math.max(3,Math.round(L/0.55));for(let k=0;k<=nP;k++){const s=0.1+(L-0.2)*k/nP;[-1,1].forEach(sg=>{line(P(s,sg*w*0.38,h),P(s,sg*w*0.38,-0.02),'#4a3018',Math.max(1.4,RS*0.032));});}
  poly([P(s0,-w/2,h-0.035),P(s1,-w/2,h-0.035),P(s1,w/2,h-0.035),P(s0,w/2,h-0.035)],'#5a3a20');
  poly([P(s0,-w/2,h),P(s1,-w/2,h),P(s1,w/2,h),P(s0,w/2,h)],'#a8723e','#6a4424',Math.max(1,RS*0.01));
  const np=Math.round((s1-s0)/0.065);for(let k=1;k<np;k++){const s=s0+(s1-s0)*k/np;line(P(s,-w/2,h),P(s,w/2,h),k%2?'rgba(70,42,18,.45)':'rgba(255,230,180,.22)',Math.max(0.8,RS*0.008));}
  line(P(s0,-w*0.17,h),P(s1,-w*0.17,h),'rgba(255,236,190,.18)',Math.max(1,RS*0.016));
  [-1,1].forEach(sg=>{const t=sg*(w/2-0.015),np2=Math.max(2,Math.round((s1-s0)/0.2));for(let k=0;k<=np2;k++){const s=s0+(s1-s0)*k/np2;line(P(s,t,h),P(s,t,h+0.1),'#6a4424',Math.max(1.2,RS*0.022));}
    line(P(s0,t,h+0.1),P(s1,t,h+0.1),'#7c5230',Math.max(1.3,RS*0.026));line(P(s0,t,h+0.05),P(s1,t,h+0.05),'#6a4424',Math.max(1,RS*0.014));});
  c.restore();
}


return {bake:bakeCampus,drawGround:drawCampusGround,drawInlays:drawCampusInlays,clear:()=>{CAMPUS_CACHE={};}};
})();
const train = (() => {
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
const BAV_AUTUMN=[['#e8892a','#f0a03a','#d46a1e','#f6b84a'],['#c8402a','#d9553a','#b0301e','#e86a4a'],['#e0b83a','#f0cc4a','#d0a42a','#f6dc6a'],['#8fbf4a','#a6d05a','#78ab3c','#bcdc72']];
const BAV_GREEN=[['#5fa844','#72bb52','#4f9638','#86cc62'],['#4f9a48','#62ae58','#438a3c','#78c26a'],['#6aae4a','#7ec25a','#5a9a3e','#92d46e']];
const CAMPUS_ASSETS={
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
  lampPost:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(40,56,24,.22)');TH.ln(c,[x,y],[x,y-u*3.1],'#2a2d36',u*0.2);TH.ln(c,[x,y-u*2.95],[x+u*0.55,y-u*2.95],'#2a2d36',u*0.12);const lx=x+u*0.55,ly=y-u*2.9,g=c.createRadialGradient(lx,ly-u*0.3,0,lx,ly-u*0.3,u*1.5);g.addColorStop(0,'rgba(255,215,130,.5)');g.addColorStop(1,'rgba(255,215,130,0)');c.fillStyle=g;c.beginPath();c.arc(lx,ly-u*0.3,u*1.5,0,7);c.fill();TH.poly(c,[[lx-u*0.25,ly],[lx+u*0.25,ly],[lx+u*0.2,ly-u*0.6],[lx-u*0.2,ly-u*0.6]],'#ffe9a8','#2a2d36',u*0.06);TH.poly(c,[[lx-u*0.3,ly-u*0.6],[lx+u*0.3,ly-u*0.6],[lx,ly-u*0.95]],'#2a2d36');BFLAG(c,x,y-u*2.0,u,0.55);}},
};

/* ===== CAMPUS SCENIC MAP: geometry (all in game units: 1 unit = R, x = u*sqrt3, y = row*0.87) ===== */
const CAMPUS_GEO={"frame":{"x0":-13.332,"x1":32.407,"y0":-3.685,"y1":23.849},"hexes":[[7.5,0,"g"],[1.0,1,"w"],[2.0,1,"w"],[3.0,1,"w"],[6.0,1,"g"],[7.0,1,"g"],[8.0,1,"g"],[1.5,2,"w"],[2.5,2,"w"],[3.5,2,"w"],[6.5,2,"g"],[7.5,2,"g"],[8.5,2,"g"],[2.0,3,"w"],[3.0,3,"w"],[4.0,3,"w"],[5.0,3,"g"],[6.0,3,"g"],[7.0,3,"g"],[8.0,3,"g"],[9.0,3,"g"],[1.5,4,"w"],[2.5,4,"w"],[3.5,4,"w"],[4.5,4,"g"],[5.5,4,"g"],[6.5,4,"g"],[7.5,4,"g"],[8.5,4,"g"],[9.5,4,"g"],[10.5,4,"g"],[2.0,5,"g"],[3.0,5,"g"],[4.0,5,"g"],[5.0,5,"g"],[6.0,5,"g"],[7.0,5,"g"],[8.0,5,"g"],[9.0,5,"g"],[10.0,5,"g"],[1.5,6,"g"],[2.5,6,"g"],[3.5,6,"g"],[5.5,6,"g"],[6.5,6,"g"],[8.5,6,"g"],[9.5,6,"g"],[10.5,6,"g"],[11.5,6,"g"],[1.0,7,"g"],[2.0,7,"g"],[3.0,7,"g"],[9.0,7,"g"],[10.0,7,"g"],[11.0,7,"g"],[1.5,8,"g"],[2.5,8,"g"],[3.5,8,"g"],[9.5,8,"g"],[10.5,8,"g"],[2.5,10,"g"],[8.5,10,"g"],[9.5,10,"g"],[10.5,10,"g"],[1.0,11,"g"],[2.0,11,"g"],[3.0,11,"g"],[8.0,11,"g"],[9.0,11,"g"],[10.0,11,"g"],[1.5,12,"g"],[2.5,12,"g"],[3.5,12,"g"],[4.5,12,"o"],[5.5,12,"o"],[6.5,12,"o"],[7.5,12,"g"],[8.5,12,"g"],[9.5,12,"g"],[3.0,13,"g"],[4.0,13,"o"],[5.0,13,"o"],[6.0,13,"o"],[7.0,13,"o"],[8.0,13,"g"],[9.0,13,"g"],[10.0,13,"g"],[4.5,14,"o"],[5.5,14,"o"],[6.5,14,"o"],[9.5,14,"t"],[5.0,15,"o"],[6.0,15,"o"],[5.5,16,"e"]],"lot":[[23.826,21.05],[23.641,20.404],[22.583,19.455],[18.193,16.266],[17.664,16.124],[16.739,16.185],[13.01,17.194],[11.371,17.517],[11.344,17.658],[7.351,17.679],[5.315,17.497],[4.337,17.275],[2.221,16.568],[1.164,16.387],[0.714,16.407],[0.026,16.71],[-0.661,17.214],[-3.12,19.536],[-3.94,20.121],[-4.363,20.706],[-4.363,20.928],[-4.178,21.171],[-3.279,21.776],[-1.296,22.463],[0.106,22.846],[2.644,23.23],[6.426,23.351],[15.84,23.189],[18.748,23.048],[20.573,22.866],[21.551,22.685],[22.503,22.321],[23.588,21.514]],"medians":[{"a":[2.04,18.015],"b":[-0.878,21.145]},{"a":[4.344,18.6],"b":[2.641,21.933]},{"a":[7.233,18.6],"b":[6.531,22.512]},{"a":[11.687,18.459],"b":[12.603,22.501]},{"a":[14.804,18.015],"b":[17.776,21.923]},{"a":[17.155,17.248],"b":[21.693,21.155]}],"entrance":[5.5,16],"plaza":{"cx":9.526,"cy":16.023,"rx":1.12,"ry":0.76},"walk":{"x":9.526,"y0":14.37,"y1":17.658,"w":0.72,"lamp0":15.01,"lamp1":17.21},"hub":[9.07,10.132],"lotGradY":17.56,"center":[10.132,6.258],"lake":[[9.07,9.943],[7.38,9.839],[6.763,9.701],[6.501,9.467],[5.861,8.652],[5.37,8.262],[5.005,8.124],[3.955,8.159],[3.829,8.237],[3.943,8.41],[3.566,8.574],[3.292,8.297],[2.767,8.696],[2.493,8.8],[0.484,9.042],[0.415,9.146],[0.278,9.06],[-1.138,9.112],[-1.617,9.025],[-1.903,8.722],[-1.903,8.185],[-1.697,7.803],[-1.32,7.604],[-0.521,7.569],[0.255,7.621],[0.392,7.535],[0.529,7.656],[1.054,7.673],[2.082,7.847],[3.018,7.864],[3.098,7.803],[2.938,7.491],[3.292,7.344],[3.681,7.864],[4.48,7.829],[5.439,7.691],[6.352,7.968],[6.923,7.933],[7.163,7.751],[7.254,7.024],[7.072,6.486],[6.706,6.192],[6.706,6.071],[7.722,5.178],[7.859,5.178],[8.031,5.291],[8.601,6.001],[8.955,6.2],[9.252,6.2],[9.983,6.062],[10.828,6.149],[11.581,6.097],[11.947,5.975],[12.563,5.386],[12.906,5.282],[13.203,5.282],[13.351,5.377],[13.602,5.828],[14.15,6.14],[14.402,6.608],[14.835,6.85],[15.109,7.335],[15.486,7.569],[16.126,7.76],[16.993,7.864],[17.45,7.379],[17.781,7.543],[17.598,7.803],[17.678,7.864],[17.884,7.864],[18.523,7.743],[19.734,7.257],[19.871,7.257],[19.996,7.405],[20.042,8.063],[19.939,8.366],[18.797,8.089],[17.404,8.089],[16.971,8.557],[16.617,8.375],[16.776,8.185],[16.696,8.124],[15.669,8.089],[14.596,7.899],[14.093,7.899],[13.454,8.124],[13.009,8.462],[12.643,8.964],[12.529,9.484],[12.358,9.666],[11.513,9.805]],"bridges":[{"a":[3.149,7.447],"b":[3.712,8.469],"w":0.342},{"a":[17.58,7.489],"b":[16.836,8.442],"w":0.343}],"meadows":[[-7.0,8.5,2.4,1.2],[27.0,8.0,2.6,1.2],[-9.6,19.0,2.0,1.0],[27.6,19.6,2.2,1.0],[-10.0,2.0,2.2,1.0],[28.0,2.0,2.4,1.0],[-3.0,-2.7,2.0,0.6],[21.5,-2.7,2.0,0.6]],"tiling":[["Cm",[[7.5,0],[8.0,1],[7.0,1],[6.0,1],[8.5,2],[7.5,2],[6.5,2],[8.0,3]]],["Bm",[[3.0,1],[2.0,1],[1.0,1],[3.5,2],[2.5,2],[1.5,2],[4.0,3],[3.0,3],[2.0,3],[3.5,4],[2.5,4],[1.5,4]]],["A",[[5.0,3],[6.0,3],[7.0,3],[4.5,4],[5.5,4],[6.5,4],[7.5,4],[5.0,5],[6.0,5],[7.0,5],[5.5,6],[6.5,6]]],["C",[[9.0,3],[8.5,4],[9.5,4],[10.5,4],[8.0,5],[9.0,5],[10.0,5],[8.5,6]]],["B",[[2.0,5],[3.0,5],[4.0,5],[1.5,6],[2.5,6],[3.5,6],[1.0,7],[2.0,7],[3.0,7],[1.5,8],[2.5,8],[3.5,8]]],["D",[[9.5,6],[10.5,6],[11.5,6],[9.0,7],[10.0,7],[11.0,7],[9.5,8],[10.5,8]]],["Cm",[[2.5,10],[3.0,11],[2.0,11],[1.0,11],[3.5,12],[2.5,12],[1.5,12],[3.0,13]]],["B",[[8.5,10],[9.5,10],[10.5,10],[8.0,11],[9.0,11],[10.0,11],[7.5,12],[8.5,12],[9.5,12],[8.0,13],[9.0,13],[10.0,13]]],["A",[[4.5,12],[5.5,12],[6.5,12],[4.0,13],[5.0,13],[6.0,13],[7.0,13],[4.5,14],[5.5,14],[6.5,14],[5.0,15],[6.0,15]]]]};
const CW3=Math.sqrt(3),CHX=CW3/2;
/* Bavarian species mix, re-weighted for a surrounding forest: mostly evergreens + green broadleaf, a sprinkle of autumn colour */
const CAMPUS_REGION={top:{spruce:.27,fir:.15,youngSpruce:.07,linden:.17,appleTree:.1,beech:.1,birch:.08,maple:.06},mid:{spruce:.24,fir:.13,youngSpruce:.07,linden:.17,appleTree:.13,beech:.1,birch:.09,maple:.07},bottom:{spruce:.2,fir:.1,youngSpruce:.1,linden:.15,appleTree:.18,beech:.1,birch:.09,maple:.08}};
const CAMPUS_UNDER=['geraniumBush','wildflowers','sunflowers','hedge','grassTuft','fern','grassTuft','fern','wildflowers','stones'];
const CAMPUS_CAR_COLS=['#e9e9ea','#c43a30','#2f4d7a','#4a505a','#d8a63a','#3c7a52','#f6dc8a','#b8d6ea','#f2b8b0','#9aa0a8','#f4f1ea'];
function cmChaikin(pts,n){for(let k=0;k<n;k++){const o=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];o.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25],[a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75]);}pts=o;}return pts;}
function cmInPoly(p,x,y){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;}
function cmSeg(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy;let t=l?((x-a[0])*dx+(y-a[1])*dy)/l:0;t=Math.max(0,Math.min(1,t));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);}
function cmDistPoly(p,x,y){let d=1e9;for(let i=0;i<p.length;i++)d=Math.min(d,cmSeg(x,y,p[i],p[(i+1)%p.length]));return d;}
function cmHexIn(dx,dy,s){const ax=Math.abs(dx)/s,ay=Math.abs(dy)/s;return ax<=CHX&&ay<=0.58-0.3349*ax;}
function cmPick(w,r){let t=0;for(const k in w)t+=w[k];let q=r()*t;for(const k in w){q-=w[k];if(q<=0)return k;}return Object.keys(w)[0];}
function cmWalk(poly,step,fn,closed){ /* walk a polyline at even spacing; fn(x,y,nx,ny,i) with the left normal */
  let acc=0,i=0;const n=poly.length,m=closed?n:n-1;for(let s=0;s<m;s++){const a=poly[s],b=poly[(s+1)%n],L=Math.hypot(b[0]-a[0],b[1]-a[1]),tx=(b[0]-a[0])/L,ty=(b[1]-a[1])/L;let d=step-acc;while(d<=L){fn(a[0]+tx*d,a[1]+ty*d,ty,-tx,i++);d+=step;}acc=L-(d-step);}}

let CAMPUS_MODEL=null;
function campusModel(){
  if(CAMPUS_MODEL)return CAMPUS_MODEL;
  const G=CAMPUS_GEO,F=G.frame;
  const hexes=G.hexes.filter(h=>h[2]!=='t').map(([u,r,t])=>({u,r,x:u*CW3,y:r*0.87,tone:t==='g'?'gray':t==='w'?'white':t==='o'?'orange':'entrance'}));
  const station=G.hexes.filter(h=>h[2]==='t').map(([u,r])=>({u,r,x:u*CW3,y:r*0.87,tone:'station'}))[0]||null;   /* the added train-station hex: kept out of the forest generation so the forest is unchanged; trees are removed from it afterwards */
  const stationNear=(x,y,s)=>station?cmHexIn(x-station.x,y-station.y,s):false;
  const ent=hexes.find(h=>h.tone==='entrance');
  /* ---- enclosed gaps in the hex footprint ("plots"): baked as separate inlay sprites that sit ON TOP of the park ---- */
  const CHV=[[CHX,0.29],[0,0.58],[-CHX,0.29],[-CHX,-0.29],[0,-0.58],[CHX,-0.29]];
  const occ=new Set(hexes.map(h=>h.u+','+h.r)),nbr=(u,r)=>[[u+.5,r+1],[u-.5,r+1],[u-1,r],[u-.5,r-1],[u+.5,r-1],[u+1,r]];
  const eu=hexes.map(h=>h.u),er=hexes.map(h=>h.r),U0=Math.min(...eu)-2,U1=Math.max(...eu)+2,R0=Math.min(...er)-2,R1=Math.max(...er)+2,emp=new Map();
  for(let r=R0;r<=R1;r++){const off=(((r%2)+2)%2===0)?0.5:0;for(let u=Math.ceil(U0)-1+off;u<=U1;u+=1){if(!occ.has(u+','+r))emp.set(u+','+r,[u,r]);}}
  const seen=new Set(),stack=[];emp.forEach((c,k)=>{if(c[0]<=U0+1||c[0]>=U1-1||c[1]<=R0||c[1]>=R1){seen.add(k);stack.push(c);}});
  while(stack.length){const c=stack.pop();nbr(c[0],c[1]).forEach(n=>{const k=n[0]+','+n[1];if(emp.has(k)&&!seen.has(k)){seen.add(k);stack.push(n);}});}
  const encl=new Map();emp.forEach((c,k)=>{if(!seen.has(k))encl.set(k,c);});
  const plots=[];{const left=new Map(encl);while(left.size){const [k0,c0]=left.entries().next().value;left.delete(k0);const grp=[c0],st=[c0];
    while(st.length){const c=st.pop();nbr(c[0],c[1]).forEach(n=>{const k=n[0]+','+n[1];if(left.has(k)){left.delete(k);grp.push(n);st.push(n);}});}
    const keys=new Set(grp.map(c=>c[0]+','+c[1])),cells=grp.sort((a,b)=>a[1]-b[1]||a[0]-b[0]).map(c=>({u:c[0],r:c[1],x:c[0]*CW3,y:c[1]*0.87})),edges=[];
    cells.forEach(c=>{const nn=nbr(c.u,c.r);for(let k=0;k<6;k++){if(!keys.has(nn[k][0]+','+nn[k][1]))edges.push([[c.x+CHV[k][0],c.y+CHV[k][1]],[c.x+CHV[(k+1)%6][0],c.y+CHV[(k+1)%6][1]]]);}});
    plots.push({cells,edges,has:(x,y,s)=>cells.some(c=>cmHexIn(x-c.x,y-c.y,s||1.015)),edgeDist:(x,y)=>{let d=1e9;for(const e of edges)d=Math.min(d,cmSeg(x,y,e[0],e[1]));return d;}});}}
  const hasPond=!!(G.pond&&G.pond.length>2);
  let pondPlot=null;if(hasPond){const pcx=G.pond.reduce((a,p)=>a+p[0],0)/G.pond.length,pcy=G.pond.reduce((a,p)=>a+p[1],0)/G.pond.length;pondPlot=plots.find(p=>p.has(pcx,pcy,1.3))||plots[0];}
  plots.forEach(p=>{p.id=(pondPlot&&p===pondPlot)?'pond':'grove';});
  /* keep the pond comfortably inside its plot (pull any vertex that sits too near a plot edge toward the nearest cell centre) */
  const pondFit=!hasPond?[]:G.pond.map(p=>{let x=p[0],y=p[1],n=0;const ok=()=>pondPlot.has(x,y)&&pondPlot.edgeDist(x,y)>0.14;while(!ok()&&n++<60){let b=null,bd=1e9;pondPlot.cells.forEach(c=>{const d=Math.hypot(c.x-x,c.y-y);if(d<bd){bd=d;b=c;}});x+=(b.x-x)*0.07;y+=(b.y-y)*0.07;}return[x,y];});
  const lot=cmChaikin(G.lot,3),pond=hasPond?cmChaikin(pondFit,3):[],lake=(G.lake&&G.lake.length>2)?cmChaikin(G.lake,3):null,P=G.plaza,W=G.walk,med=G.medians;
  const medBlock=(x,y,m)=>{for(const k of med)if(cmSeg(x,y,k.a,k.b)<m)return true;return false;};
  const hexNear=(x,y,s)=>{for(const h of hexes){const dx=x-h.x,dy=y-h.y;if(Math.abs(dx)>1.5||Math.abs(dy)>0.9)continue;if(cmHexIn(dx,dy,s))return true;}return false;};
  const inPlaza=(x,y,m)=>(((x-P.cx)/(P.rx+m))**2+((y-P.cy)/(P.ry+m*.7))**2)<1;
  const inWalk=(x,y,m)=>Math.abs(x-W.x)<W.w/2+m&&y>W.y0&&y<W.y1+0.02;
  const inLot=(x,y,m)=>cmInPoly(lot,x,y)||cmDistPoly(lot,x,y)<m;
  const inPond=(x,y,m)=>hasPond&&(cmInPoly(pond,x,y)||cmDistPoly(pond,x,y)<m);
  const inLake=(x,y,m)=>!!lake&&(cmInPoly(lake,x,y)||cmDistPoly(lake,x,y)<m);
  const bridges=(G.bridges||[]).map(b=>({a:b.a,b:b.b,w:b.w||0.34}));const nearBridge=(x,y,m)=>bridges.some(b=>{const dx=b.b[0]-b.a[0],dy=b.b[1]-b.a[1],l=dx*dx+dy*dy;let t=((x-b.a[0])*dx+(y-b.a[1])*dy)/l;t=Math.max(0,Math.min(1,t));return Math.hypot(x-b.a[0]-t*dx,y-b.a[1]-t*dy)<m;});
  /* meadows: open clearings that break up the forest (ellipses cx,cy,rx,ry) */
  const meadows=G.meadows||[[-5.2,6.4,2.3,1.15],[22.8,5.6,2.6,1.2],[-8.6,13.6,2.2,1.0],[22.6,13.2,2.5,1.1],[26.8,12.8,1.8,0.9],[14.6,-0.9,1.9,0.8]];
  const inMeadow=(x,y)=>meadows.some(m=>((x-m[0])/m[2])**2+((y-m[1])/m[3])**2<1);
  const inPlot=(x,y,s)=>plots.some(p=>p.has(x,y,s||1.04));
  /* layer rule: an object is FRONT (drawn after the park) only when it stands south of every park hex around it */
  const layerOf=(x,y)=>{let my=-1e9,any=false;for(const h of hexes){if(Math.abs(x-h.x)<1.5){any=true;if(h.y>my)my=h.y;}}return any?(y>my+0.12?'front':'back'):(y>8.35?'front':'back');};
  CAMPUS_MODEL={G,F,hexes,station,stationNear,ent,plots,inPlot,lot,pond,lake,inLake,bridges,nearBridge,P,W,med,medBlock,hexNear,inPlaza,inWalk,inLot,inPond,meadows,inMeadow,layerOf,FW:F.x1-F.x0,FH:F.y1-F.y0};
  return CAMPUS_MODEL;
}

/* ===== parking layout: stalls in parallel bands inside each wedge of the median fan ===== */
function campusLotLayout(M,rng){
  const hub=M.G.hub,lot=M.lot,Wk=M.W;
  const unit=(dx,dy)=>{const l=Math.hypot(dx,dy);return[dx/l,dy/l];};
  const lt=lot.reduce((a,p)=>p[0]<a[0]?p:a),rt=lot.reduce((a,p)=>p[0]>a[0]?p:a);
  const rays=[unit(lt[0]-hub[0],lt[1]-hub[1]),...M.med.map(m=>unit(m.b[0]-hub[0],m.b[1]-hub[1])),unit(rt[0]-hub[0],rt[1]-hub[1])];
  const side=(d,x,y)=>d[0]*(y-hub[1])-d[1]*(x-hub[0]);     /* perpendicular distance, signed */
  const topY=x=>{let best=1e9;for(let i=0;i<lot.length;i++){const a=lot[i],b=lot[(i+1)%lot.length];if((a[0]<=x)!==(b[0]<=x)){const t=(x-a[0])/(b[0]-a[0]),y=a[1]+t*(b[1]-a[1]);if(y<best)best=y;}}return best;};
  const stalls=[],lines=[],DT=0.22,BD=0.40,AI=0.62,MOD=BD*2+AI;
  for(let w=0;w<rays.length-1;w++){
    const dL=rays[w],dR=rays[w+1],dC=unit(dL[0]+dR[0],dL[1]+dR[1]),n=[-dC[1],dC[0]];
    const edgeM=(d,isMed)=>isMed?0.36:0.05;                  /* clearance from a median curb / the lot rim */
    const sgnL=Math.sign(side(dL,hub[0]+dC[0]*10,hub[1]+dC[1]*10))||1,sgnR=Math.sign(side(dR,hub[0]+dC[0]*10,hub[1]+dC[1]*10))||1;
    for(let k=-9;k<=9;k++){
      for(const [bo,dir] of [[0.20,1],[1.22,-1]]){
        const o=k*MOD+bo-0.1;
        for(let tau=5;tau<22;tau+=DT){
          const cx=hub[0]+dC[0]*tau+n[0]*o,cy=hub[1]+dC[1]*tau+n[1]*o;
          if(cy<topY(cx)+0.95||cy>M.F.y1)continue;
          if(!cmInPoly(lot,cx,cy)||cmDistPoly(lot,cx,cy)<0.34)continue;
          if(sgnL*side(dL,cx,cy)<edgeM(dL,w>0)||sgnR*side(dR,cx,cy)<edgeM(dR,w<rays.length-2))continue;
          if(M.medBlock(cx,cy,0.36))continue;
          if(M.inPlaza(cx,cy,0.3)||(Math.abs(cx-Wk.x)<0.85&&cy<Wk.y1+1.15))continue;
          lines.push([cx-dC[0]*DT/2-n[0]*BD/2,cy-dC[1]*DT/2-n[1]*BD/2,cx-dC[0]*DT/2+n[0]*BD/2,cy-dC[1]*DT/2+n[1]*BD/2]);
          lines.push([cx+dC[0]*DT/2-n[0]*BD/2,cy+dC[1]*DT/2-n[1]*BD/2,cx+dC[0]*DT/2+n[0]*BD/2,cy+dC[1]*DT/2+n[1]*BD/2]);
          stalls.push({x:cx,y:cy,n:[n[0]*dir,n[1]*dir],d:dC});
        }
      }
    }
  }
  return {stalls,lines};
}

/* ===== extra assets (same drawing conventions as the Bavarian pack: draw(c,x,y,u,v), (x,y)=base centre) ===== */
CAMPUS_ASSETS.reeds={cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*7+1);c.strokeStyle='rgba(255,255,255,.32)';c.lineWidth=u*0.08;c.beginPath();c.ellipse(x,y+u*0.1,u*1.3,u*0.42,0,0,7);c.stroke();
  const n=6+Math.floor(r()*3),cols=['#5f8f3a','#7aa648','#8fb858','#6c9c42'];
  for(let k=0;k<n;k++){const a=(k/(n-1)-0.5)*1.05+(r()-0.5)*0.2,h=u*(2.4+r()*1.8),bx=x+(r()-0.5)*u*0.5,tx=bx+Math.sin(a)*h*0.55,ty=y-Math.cos(a)*h;
    c.strokeStyle=cols[k%4];c.lineWidth=u*0.1;c.lineCap='round';c.beginPath();c.moveTo(bx,y);c.quadraticCurveTo(bx+Math.sin(a)*h*0.2,y-h*0.55,tx,ty);c.stroke();
    if(k%3===1){TH.ln(c,[tx,ty+u*0.1],[tx+Math.sin(a)*u*0.12,ty-u*0.75],'#6a4a2a',u*0.3);TH.ln(c,[tx+Math.sin(a)*u*0.12,ty-u*0.7],[tx+Math.sin(a)*u*0.15,ty-u*1.15],'#8a6a40',u*0.07);}}}};
CAMPUS_ASSETS.duck={cat:'prop',rho:0.04,draw(c,x,y,u,v){const f=v&1?-1:1;c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=u*0.07;c.beginPath();c.ellipse(x,y+u*0.12,u*1.5,u*0.5,0,0,7);c.stroke();c.beginPath();c.ellipse(x,y+u*0.12,u*2.1,u*0.7,0,0,7);c.globalAlpha=0.5;c.stroke();c.globalAlpha=1;
  TH.ell(c,x,y,u*0.95,u*0.5,v%3===0?'#f6f3ea':'#b08a5a');TH.ell(c,x-f*u*0.2,y-u*0.08,u*0.55,u*0.26,v%3===0?'#dcd8cc':'#8a6a40');
  TH.ell(c,x+f*u*0.75,y-u*0.55,u*0.34,u*0.32,v%3===0?'#f6f3ea':'#2f6a4a');c.fillStyle='#e8a030';c.beginPath();c.moveTo(x+f*u*1.0,y-u*0.55);c.lineTo(x+f*u*1.5,y-u*0.45);c.lineTo(x+f*u*1.0,y-u*0.4);c.fill();TH.ell(c,x+f*u*0.85,y-u*0.62,u*0.06,u*0.06,'#1a1a1a');}};
CAMPUS_ASSETS.fountainBig={cat:'ruin',rho:0.3,draw(c,x,y,u,v){
  const TOP='#d6d3c6',WAT='#6ab8d8',WATD='#4f9cbe';
  TH.ell(c,x+u*1.4,y+u*0.9,u*8.8,u*5.6,'rgba(40,56,24,.22)');
  const basin=(cx,cy,rx,ry,wh,wd)=>{const g=c.createLinearGradient(cx-rx,0,cx+rx,0);g.addColorStop(0,'#cbc8bb');g.addColorStop(0.5,'#b4b1a3');g.addColorStop(1,'#85826f');
    c.fillStyle=g;c.beginPath();c.moveTo(cx-rx,cy-wh);c.lineTo(cx-rx,cy);c.ellipse(cx,cy,rx,ry,0,Math.PI,0,true);c.lineTo(cx+rx,cy-wh);c.ellipse(cx,cy-wh,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();
    TH.ell(c,cx,cy-wh,rx,ry,TOP);TH.ell(c,cx,cy-wh,rx*0.9,ry*0.86,'#8f8c7e');TH.ell(c,cx,cy-wh+wd,rx*0.88,ry*0.82,WAT);
    TH.ell(c,cx,cy-wh+wd+ry*0.1,rx*0.62,ry*0.5,WATD);TH.ell(c,cx-rx*0.28,cy-wh+wd-ry*0.15,rx*0.4,ry*0.2,'rgba(225,247,255,.55)');
    c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=u*0.06;c.beginPath();c.ellipse(cx,cy-wh+wd,rx*0.5,ry*0.42,0,0.2,Math.PI-0.2);c.stroke();};
  const col=(cx,y0,y1,w)=>{const g=c.createLinearGradient(cx-w,0,cx+w,0);g.addColorStop(0,'#c9c6b9');g.addColorStop(1,'#8a8776');c.fillStyle=g;c.fillRect(cx-w,y1,w*2,y0-y1);};
  const b1y=y,b1h=1.5*u;basin(x,b1y,7.2*u,4.6*u,b1h,0.55*u);
  const c1=b1y-b1h-0.3*u,c1t=c1-2.6*u;col(x,c1,c1t,1.15*u);TH.ell(c,x,c1,1.15*u,0.5*u,'#9e9b8c');
  const b2y=c1t,b2h=0.85*u;basin(x,b2y,3.9*u,2.5*u,b2h,0.4*u);
  const c2=b2y-b2h-0.2*u,c2t=c2-2.0*u;col(x,c2,c2t,0.7*u);
  const b3y=c2t,b3h=0.6*u;basin(x,b3y,2.0*u,1.3*u,b3h,0.3*u);
  const top=b3y-b3h-0.1*u;TH.ell(c,x,top,0.4*u,0.2*u,'#cfcdc0');
  /* jets + cascades */
  c.lineCap='round';
  const jets=[[0,-4.3],[-0.55,-3.4],[0.55,-3.4],[-1.1,-2.4],[1.1,-2.4]];
  jets.forEach(([dx,dh],i)=>{c.strokeStyle=i===0?'rgba(235,250,255,.95)':'rgba(205,238,252,.8)';c.lineWidth=u*(i===0?0.2:0.13);c.beginPath();c.moveTo(x,top);c.quadraticCurveTo(x+dx*u*0.9,top+dh*u,x+dx*u*2.3,top+u*(0.2+(i>2?0.5:0)));c.stroke();});
  for(const sx of [-1,1])for(let k=0;k<4;k++){const px=x+sx*(1.1+k*0.62)*u;c.strokeStyle='rgba(200,236,252,.75)';c.lineWidth=u*0.1;c.beginPath();c.moveTo(px,b3y-b3h+u*0.5);c.lineTo(px+sx*u*0.12,b3y+1.3*u*0.55+u*0.2);c.stroke();}
  for(const sx of [-1,1])for(let k=0;k<6;k++){const px=x+sx*(1.2+k*0.55)*u,py0=b2y-b2h+u*0.5;c.strokeStyle='rgba(200,236,252,.7)';c.lineWidth=u*0.09;c.beginPath();c.moveTo(px,py0+u*0.4);c.lineTo(px+sx*u*0.1,b1y-b1h+u*0.9+(k%2)*u*0.2);c.stroke();}
  [[-1.6,-3.9],[1.9,-3.1],[-2.4,-1.7],[2.7,-1.4],[0.5,-4.6],[-0.8,-4.9],[1.3,-4.2]].forEach(([dx,dy])=>TH.ell(c,x+dx*u,top+dy*u*0.9,u*0.11,u*0.11,'rgba(230,248,255,.85)'));
}};
/* extruded box in screen space: poly = ground footprint in px, z0/h in px */
function cmExt(c,poly,z0,h,col,topCol,sideCol){let ar=0;for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];ar+=a[0]*b[1]-b[0]*a[1];}const sg=ar>0?1:-1;
  for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],ex=b[0]-a[0],ey=b[1]-a[1],nx=ey*sg,ny=-ex*sg,L=Math.hypot(nx,ny)||1;
    if(ny/L>0.05){c.fillStyle=sideCol||shade(col,-0.1-0.14*(nx/L));c.beginPath();c.moveTo(a[0],a[1]-z0);c.lineTo(b[0],b[1]-z0);c.lineTo(b[0],b[1]-z0-h);c.lineTo(a[0],a[1]-z0-h);c.closePath();c.fill();}}
  c.fillStyle=topCol||shade(col,0.1);c.beginPath();poly.forEach((p,i)=>i?c.lineTo(p[0],p[1]-z0-h):c.moveTo(p[0],p[1]-z0-h));c.closePath();c.fill();}
function cmCar(c,X,Y,RS,s){const n=s.n,t=[-n[1],n[0]],len=s.len,wid=s.wid;
  const corner=(a,b)=>[s.x+n[0]*a*len/2+t[0]*b*wid/2,s.y+n[1]*a*len/2+t[1]*b*wid/2];
  const fp=(a,b)=>[corner(-a,-b),corner(a,-b),corner(a,b),corner(-a,b)].map(p=>[X(p[0]),Y(p[1])]);
  const cx=X(s.x),cy=Y(s.y);TH.ell(c,cx+RS*0.015,cy+RS*0.012,len*RS*0.55,wid*RS*0.5,'rgba(30,34,40,.28)');
  cmExt(c,fp(1,1),0,RS*0.07,s.col);
  /* cabin: shifted toward the rear a little */
  const sh=0.06,cab=[corner(-0.5+sh,-0.84),corner(0.42+sh,-0.84),corner(0.42+sh,0.84),corner(-0.5+sh,0.84)].map(p=>[X(p[0]),Y(p[1])]);
  cmExt(c,cab,RS*0.07,RS*0.052,s.col,shade(s.col,0.18),'#4a6074');}

/* ===== INLAY PLOTS: the enclosed gaps inside the park footprint, each baked as its own sprite that goes ON TOP of the lands ===== */
const CAMPUS_HV=[[CHX,0.29],[0,0.58],[-CHX,0.29],[-CHX,-0.29],[0,-0.58],[CHX,-0.29]];
function campusPaintPond(g,M,X,Y,RS,rng,poly0){const PP=poly0||PP;let am=1;if(poly0){let ar=0;for(let i=0;i<PP.length;i++){const p=PP[i],q=PP[(i+1)%PP.length];ar+=p[0]*q[1]-q[0]*p[1];}am=Math.max(1,Math.sqrt(Math.abs(ar)/2)/1.7);}const poly=(c,pts)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(X(p[0]),Y(p[1])):c.moveTo(X(p[0]),Y(p[1])));c.closePath();};
  g.save();g.lineJoin='round';
  poly(g,PP);g.strokeStyle='rgba(60,104,44,.36)';g.lineWidth=RS*0.5;g.stroke();
  poly(g,PP);g.strokeStyle='#b7a572';g.lineWidth=RS*0.26;g.stroke();
  poly(g,PP);g.strokeStyle='#dacd9f';g.lineWidth=RS*0.13;g.stroke();
  poly(g,PP);const bb=PP.reduce((a,p)=>[Math.min(a[0],p[0]),Math.max(a[1],p[0]),Math.min(a[2],p[1]),Math.max(a[3],p[1])],[1e9,-1e9,1e9,-1e9]);
  const pg=g.createRadialGradient(X((bb[0]+bb[1])/2),Y((bb[2]+bb[3])/2),0,X((bb[0]+bb[1])/2),Y((bb[2]+bb[3])/2),RS*1.7*am);pg.addColorStop(0,'#4f9cbe');pg.addColorStop(0.6,'#62b0d0');pg.addColorStop(1,'#7cc6e0');g.fillStyle=pg;g.fill();
  g.save();poly(g,PP);g.clip();g.strokeStyle='rgba(205,240,250,.5)';g.lineWidth=RS*0.2;poly(g,PP);g.stroke();
  for(let k=0;k<Math.round(44*am);k++){const x=bb[0]+rng()*(bb[1]-bb[0]),y=bb[2]+rng()*(bb[3]-bb[2]);g.strokeStyle='rgba(255,255,255,'+(0.18+rng()*0.2)+')';g.lineWidth=Math.max(1,RS*0.012);const w=RS*(0.06+rng()*0.1);g.beginPath();g.moveTo(X(x)-w,Y(y));g.quadraticCurveTo(X(x),Y(y)-RS*0.025,X(x)+w,Y(y));g.stroke();}
  for(let k=0;k<Math.round(9*am*0.8);k++){let x,y,t=0;do{x=bb[0]+rng()*(bb[1]-bb[0]);y=bb[2]+rng()*(bb[3]-bb[2]);t++;}while((!cmInPoly(PP,x,y)||cmDistPoly(PP,x,y)<0.22)&&t<60);if(t>=60)continue;
    const rx=RS*(0.09+rng()*0.06),ry=rx*0.58,a=rng()*6;g.fillStyle='#5f9a44';g.beginPath();g.moveTo(X(x),Y(y));g.ellipse(X(x),Y(y),rx,ry,a,0.35,6.283-0.35);g.closePath();g.fill();g.fillStyle='#78b256';g.beginPath();g.ellipse(X(x)-rx*0.15,Y(y)-ry*0.2,rx*0.6,ry*0.5,a,0,7);g.fill();
    if(k%4===1){TH.ell(g,X(x),Y(y)-ry*0.3,rx*0.3,ry*0.34,'#f4a6cb');TH.ell(g,X(x),Y(y)-ry*0.4,rx*0.14,ry*0.16,'#fff0a0');}}
  g.restore();g.restore();
}

CAMPUS_ASSETS.bench={cat:'prop',rho:0.05,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.15,u*1.9,u*0.5,'rgba(40,56,24,.22)');[-1.2,1.2].forEach(dx=>{TH.box(c,x+dx*u*0.6,y,u,-0.12,0.12,-0.3,0.3,0,0.8,'#4a4a52','#34343c','#5a5a64');});
  TH.box(c,x,y,u,-1.5,1.5,-0.38,0.38,0.8,1.02,'#9a6a3c','#6a4426','#b88250');TH.box(c,x,y,u,-1.5,1.5,-0.38,-0.24,1.02,2.0,'#8a5a33','#5a3a22','#a8773f');}};
function campusBakePlot(M,plot,RS,seed){
  const rng=mulberry(seed),cells=plot.cells,u0=0.075*RS;
  const minX=Math.min(...cells.map(c=>c.x-CHX)),maxX=Math.max(...cells.map(c=>c.x+CHX)),minY=Math.min(...cells.map(c=>c.y-0.58)),maxY=Math.max(...cells.map(c=>c.y+0.58));
  const gx0=minX-0.6,gy0=minY-1.3,w=Math.ceil((maxX-minX+1.2)*RS),h=Math.ceil((maxY-minY+1.3+0.45)*RS);
  const X=x=>(x-gx0)*RS,Y=y=>(y-gy0)*RS,cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d');g.imageSmoothingQuality='high';
  const unionPath=k=>{g.beginPath();cells.forEach(c=>{CAMPUS_HV.forEach((v,i)=>{const px=X(c.x+v[0]*k),py=Y(c.y+v[1]*k);i?g.lineTo(px,py):g.moveTo(px,py);});g.closePath();});};
  const soft=(x,y,rx,ry,rgb,a)=>{g.save();g.translate(x,y);g.scale(1,ry/rx);const q=g.createRadialGradient(0,0,0,0,0,rx);q.addColorStop(0,`rgba(${rgb},${a})`);q.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);q.addColorStop(1,`rgba(${rgb},0)`);g.fillStyle=q;g.beginPath();g.arc(0,0,rx,0,7);g.fill();g.restore();};
  const pt=()=>[X(minX)+rng()*(X(maxX)-X(minX)),Y(minY)+rng()*(Y(maxY)-Y(minY))],AK=cells.length*2.6/31;
  /* path for the grove: through the cell centres, left to right */
  const path=plot.id==='grove'?cells.slice().sort((a,b)=>a.x-b.x).map(c=>[c.x,c.y+0.04]):null;
  const pathD=(x,y)=>{if(!path)return 9;let d=1e9;for(let i=0;i<path.length-1;i++)d=Math.min(d,cmSeg(x,y,path[i],path[i+1]));return d;};
  /* ---- ground (clipped to the plot's hex cells) ---- */
  g.save();unionPath(1.012);g.clip();
  g.fillStyle='#8fbf68';g.fillRect(0,0,w,h);
  for(let k=0;k<46*AK;k++){const p=pt(),r=RS*(0.45+rng()*0.9);soft(p[0],p[1],r,r*0.4,rng()<0.5?'190,230,130':'80,140,60',0.2);}
  for(let k=0;k<12*AK;k++){const p=pt(),r=RS*(0.3+rng()*0.5);soft(p[0],p[1],r,r*0.4,'236,224,140',0.15);}
  for(let k=0;k<12*AK;k++){const p=pt(),r=RS*(0.3+rng()*0.5);soft(p[0],p[1],r,r*0.4,'255,255,210',0.14);}
  for(let k=0;k<160*AK;k++){const p=pt(),hh=RS*(0.05+rng()*0.06);for(let j=0;j<3;j++)TH.ln(g,[p[0],p[1]],[p[0]+(j-1)*hh*0.5,p[1]-hh],['#78b856','#68a84a','#92cc6a'][(k+j)%3],RS*0.011);}
  for(let k=0;k<70*AK;k++){const p=pt(),a=rng()*3.14,l=RS*(0.03+rng()*0.035);TH.ell(g,p[0],p[1],l,l*0.55,['#e8892a','#f0b83a','#c8402a','#e0a030'][k%4],a);}
  for(let k=0;k<70*AK;k++){const p=pt();TH.ell(g,p[0],p[1],RS*0.012,RS*0.01,['#f6efe0','#f2c230','#6a8ae8','#f4a6cb','#fff0a0'][k%5]);}
  if(plot.id==='pond')campusPaintPond(g,M,X,Y,RS,rng);
  if(path){g.lineCap='round';g.lineJoin='round';const pp=()=>{g.beginPath();path.forEach((p,i)=>i?g.lineTo(X(p[0]),Y(p[1])):g.moveTo(X(p[0]),Y(p[1])));};
    pp();g.strokeStyle='rgba(60,70,40,.28)';g.lineWidth=RS*0.24;g.stroke();pp();g.strokeStyle='#c9bd98';g.lineWidth=RS*0.2;g.stroke();pp();g.strokeStyle='#ded3b0';g.lineWidth=RS*0.15;g.stroke();
    for(let k=0;k<90;k++){const i=Math.floor(rng()*(path.length-1)),t=rng(),p=[path[i][0]+(path[i+1][0]-path[i][0])*t,path[i][1]+(path[i+1][1]-path[i][1])*t];TH.ell(g,X(p[0])+(rng()-0.5)*RS*0.12,Y(p[1])+(rng()-0.5)*RS*0.07,RS*0.012,RS*0.008,rng()<0.5?'#b8ac86':'#efe6c8');}}
  /* soft plot edge so it reads as a planted inlay rather than a flat decal */
  g.strokeStyle='rgba(50,92,38,.30)';g.lineWidth=RS*0.07;plot.edges.forEach(e=>{g.beginPath();g.moveTo(X(e[0][0]),Y(e[0][1]));g.lineTo(X(e[1][0]),Y(e[1][1]));g.stroke();});
  g.restore();
  /* ---- upright objects (their canopies may overlap the neighbouring lands: that is the point) ---- */
  const objs=[],add=(k,x,y,s,ex)=>objs.push(Object.assign({k,x,y,s:s||1,v:Math.floor(rng()*1000)},ex||{}));
  const inPond=(x,y,m)=>cmInPoly(M.pond,x,y)||cmDistPoly(M.pond,x,y)<m;
  if(plot.id==='pond'){let n=0;cmWalk(M.pond,0.5,(x,y,nx,ny)=>{if(rng()<0.35)return;const ins=cmInPoly(M.pond,x+nx*0.1,y+ny*0.1)?1:-1,px=x-nx*ins*0.06+(rng()-0.5)*0.08,py=y-ny*ins*0.06;
      if(n++%4===0)add('stones',x+nx*ins*-0.2,y+ny*ins*-0.2,0.6+rng()*0.25);else add('reeds',px,py,0.85+rng()*0.4);},true);
    for(let k=0;k<3;k++){let x,y,t=0;do{x=M.pond[0][0]+(rng()-0.5)*2.4;y=M.pond[0][1]+(rng()-0.2)*3;t++;}while((!cmInPoly(M.pond,x,y)||cmDistPoly(M.pond,x,y)<0.28)&&t<200);if(t<200)add('duck',x,y,1.0);}}
  /* trees + landscaping inside the plot */
  const wts=plot.id==='grove'?{linden:.2,appleTree:.18,birch:.15,beech:.12,maple:.12,spruce:.1,youngSpruce:.08,fir:.05}:{linden:.22,appleTree:.2,birch:.18,beech:.1,maple:.08,youngSpruce:.14,spruce:.08};
  const keep=plot.id==='grove'?0.13:0.15,sepX=plot.id==='grove'?0.34:0.38,sepY=plot.id==='grove'?0.2:0.22,placed=[];
  const cand=[];cells.forEach(c=>{for(let k=0;k<120;k++)cand.push([c.x+(rng()-0.5)*CHX*2,c.y+(rng()-0.5)*1.16]);});
  for(const [x,y] of cand){if(!plot.has(x,y,1)||plot.edgeDist(x,y)<keep)continue;if(plot.id==='pond'&&inPond(x,y,0.34))continue;if(pathD(x,y)<0.26)continue;
    if(placed.some(q=>((x-q[0])/sepX)**2+((y-q[1])/sepY)**2<1))continue;placed.push([x,y]);add(cmPick(wts,rng),x,y,1.05+rng()*0.4);
    if(rng()<0.6&&plot.has(x+0.2,y+0.14,1)&&!(plot.id==='pond'&&inPond(x+0.2,y+0.14,0.3)))add(CAMPUS_UNDER[Math.floor(rng()*CAMPUS_UNDER.length)],x+(rng()-0.5)*0.4,y+0.12,0.8+rng()*0.4);}
  if(path){for(let i=0;i<path.length-1;i++){const a=path[i],b=path[i+1],m=[(a[0]+b[0])/2,(a[1]+b[1])/2],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L,sg=i%2?-1:1;
      add('bench',m[0]+nx*0.3*sg,m[1]+ny*0.3*sg,1.0);}
    add('lampPost',path[1][0]+0.05,path[1][1]-0.25,0.95);
    for(let i=0;i<path.length-1;i++){for(let k=0;k<6;k++){const tt=(k+0.5)/6,x=path[i][0]+(path[i+1][0]-path[i][0])*tt,y=path[i][1]+(path[i+1][1]-path[i][1])*tt,sg=k%2?1:-1;const px=x,py=y+sg*0.2;if(plot.has(px,py,1)&&plot.edgeDist(px,py)>0.12)add(['geraniumBush','wildflowers','sunflowers'][k%3],px+(rng()-0.5)*0.1,py,0.7);}}}
  objs.sort((a,b)=>a.y-b.y).forEach(o=>{const A=CAMPUS_ASSETS[o.k];if(A)A.draw(g,X(o.x),Y(o.y),u0*o.s,o.v);});
  return{id:plot.id,canvas:cv,ox:X(0),oy:Y(0),w,h,cells:cells.map(c=>({u:c.u,r:c.r})),count:objs.length};
}

const CAMPUS_VARIANT='train';
/* ===== TRAIN LOOP: the park railway's track + the tunnel that carries it under the entrance walk (TRACK ONLY, no train) ===== */
const CAMPUS_TRAIN_DATA={"pts":[[17.427,12.18],[17.477,12.18],[17.527,12.181],[17.577,12.181],[17.627,12.182],[17.677,12.183],[17.727,12.185],[17.777,12.186],[17.827,12.188],[17.874,12.188],[17.924,12.19],[17.972,12.19],[18.013,12.187],[18.061,12.185],[18.109,12.183],[18.157,12.179],[18.204,12.173],[18.25,12.166],[18.296,12.158],[18.34,12.147],[18.384,12.133],[18.427,12.118],[18.469,12.1],[18.51,12.079],[18.55,12.056],[18.589,12.03],[18.628,12.001],[18.665,11.969],[18.701,11.935],[18.736,11.898],[18.77,11.859],[18.804,11.817],[18.836,11.773],[18.868,11.728],[18.899,11.681],[18.93,11.632],[18.96,11.583],[18.99,11.533],[19.019,11.482],[19.048,11.432],[19.076,11.382],[19.104,11.332],[19.131,11.285],[19.158,11.239],[19.185,11.195],[19.211,11.153],[19.238,11.11],[19.264,11.067],[19.289,11.024],[19.315,10.981],[19.34,10.938],[19.366,10.895],[19.39,10.852],[19.415,10.808],[19.44,10.765],[19.464,10.721],[19.488,10.677],[19.512,10.634],[19.536,10.59],[19.56,10.546],[19.584,10.502],[19.607,10.458],[19.631,10.413],[19.654,10.369],[19.677,10.325],[19.7,10.28],[19.723,10.236],[19.745,10.191],[19.768,10.147],[19.791,10.102],[19.813,10.057],[19.835,10.012],[19.857,9.968],[19.879,9.923],[19.901,9.878],[19.923,9.833],[19.945,9.788],[19.966,9.743],[19.988,9.698],[20.01,9.653],[20.031,9.607],[20.053,9.562],[20.074,9.517],[20.096,9.472],[20.117,9.427],[20.138,9.382],[20.16,9.336],[20.181,9.291],[20.202,9.246],[20.223,9.2],[20.244,9.155],[20.265,9.11],[20.286,9.064],[20.307,9.019],[20.328,8.973],[20.348,8.928],[20.369,8.882],[20.39,8.837],[20.41,8.791],[20.431,8.746],[20.451,8.7],[20.472,8.654],[20.492,8.609],[20.513,8.563],[20.533,8.518],[20.554,8.472],[20.575,8.427],[20.595,8.381],[20.616,8.335],[20.637,8.29],[20.657,8.244],[20.678,8.199],[20.698,8.153],[20.718,8.107],[20.739,8.062],[20.759,8.016],[20.779,7.97],[20.799,7.924],[20.819,7.878],[20.839,7.833],[20.859,7.787],[20.878,7.741],[20.898,7.695],[20.917,7.649],[20.936,7.602],[20.955,7.556],[20.974,7.51],[20.992,7.463],[21.01,7.417],[21.028,7.37],[21.046,7.323],[21.063,7.276],[21.08,7.229],[21.097,7.182],[21.114,7.135],[21.13,7.088],[21.146,7.04],[21.162,6.993],[21.177,6.945],[21.192,6.898],[21.207,6.85],[21.222,6.802],[21.236,6.754],[21.25,6.706],[21.264,6.658],[21.277,6.61],[21.29,6.562],[21.303,6.513],[21.315,6.465],[21.328,6.416],[21.34,6.368],[21.351,6.319],[21.363,6.271],[21.374,6.222],[21.385,6.173],[21.395,6.124],[21.406,6.075],[21.416,6.026],[21.426,5.977],[21.435,5.928],[21.445,5.879],[21.454,5.83],[21.463,5.781],[21.472,5.732],[21.481,5.682],[21.489,5.633],[21.496,5.584],[21.504,5.534],[21.51,5.485],[21.516,5.435],[21.521,5.385],[21.525,5.335],[21.528,5.285],[21.53,5.235],[21.529,5.186],[21.528,5.136],[21.524,5.086],[21.518,5.036],[21.511,4.987],[21.501,4.938],[21.489,4.889],[21.475,4.841],[21.459,4.794],[21.44,4.747],[21.419,4.702],[21.397,4.657],[21.372,4.614],[21.345,4.572],[21.316,4.531],[21.286,4.491],[21.253,4.453],[21.219,4.416],[21.184,4.381],[21.148,4.347],[21.11,4.314],[21.072,4.281],[21.033,4.25],[20.994,4.219],[20.954,4.189],[20.914,4.159],[20.873,4.13],[20.833,4.1],[20.792,4.071],[20.752,4.042],[20.711,4.013],[20.67,3.984],[20.63,3.954],[20.589,3.925],[20.549,3.896],[20.508,3.866],[20.468,3.837],[20.427,3.808],[20.387,3.778],[20.347,3.749],[20.306,3.719],[20.266,3.69],[20.225,3.661],[20.185,3.632],[20.144,3.602],[20.104,3.573],[20.063,3.544],[20.022,3.514],[19.982,3.485],[19.941,3.456],[19.901,3.426],[19.86,3.397],[19.82,3.368],[19.779,3.339],[19.739,3.309],[19.698,3.28],[19.658,3.251],[19.617,3.222],[19.576,3.193],[19.536,3.163],[19.495,3.134],[19.455,3.105],[19.414,3.076],[19.374,3.047],[19.333,3.017],[19.292,2.988],[19.252,2.959],[19.211,2.93],[19.17,2.901],[19.13,2.872],[19.089,2.843],[19.048,2.814],[19.008,2.785],[18.967,2.756],[18.926,2.727],[18.886,2.698],[18.845,2.668],[18.804,2.639],[18.763,2.61],[18.723,2.581],[18.682,2.552],[18.641,2.523],[18.601,2.494],[18.56,2.465],[18.519,2.436],[18.479,2.407],[18.438,2.378],[18.397,2.349],[18.356,2.32],[18.316,2.291],[18.275,2.262],[18.234,2.233],[18.193,2.204],[18.153,2.175],[18.112,2.146],[18.071,2.117],[18.03,2.088],[17.99,2.059],[17.949,2.03],[17.908,2.001],[17.868,1.972],[17.827,1.943],[17.786,1.914],[17.745,1.885],[17.705,1.856],[17.664,1.827],[17.623,1.798],[17.582,1.769],[17.542,1.74],[17.501,1.711],[17.46,1.682],[17.419,1.653],[17.379,1.624],[17.338,1.596],[17.297,1.567],[17.256,1.538],[17.215,1.509],[17.175,1.48],[17.134,1.451],[17.093,1.422],[17.052,1.393],[17.011,1.364],[16.971,1.335],[16.93,1.307],[16.889,1.278],[16.848,1.249],[16.807,1.22],[16.766,1.191],[16.726,1.162],[16.685,1.133],[16.644,1.104],[16.603,1.075],[16.562,1.047],[16.522,1.018],[16.481,0.989],[16.44,0.96],[16.399,0.931],[16.358,0.902],[16.318,0.873],[16.277,0.844],[16.236,0.815],[16.195,0.786],[16.154,0.758],[16.114,0.729],[16.073,0.7],[16.032,0.671],[15.991,0.642],[15.95,0.613],[15.909,0.584],[15.869,0.556],[15.828,0.527],[15.787,0.498],[15.746,0.469],[15.705,0.44],[15.664,0.411],[15.624,0.382],[15.583,0.353],[15.542,0.324],[15.501,0.295],[15.461,0.266],[15.42,0.237],[15.379,0.208],[15.339,0.179],[15.298,0.15],[15.257,0.121],[15.216,0.093],[15.175,0.064],[15.134,0.035],[15.093,0.007],[15.052,-0.021],[15.01,-0.049],[14.968,-0.077],[14.926,-0.104],[14.884,-0.13],[14.841,-0.156],[14.798,-0.182],[14.755,-0.207],[14.712,-0.232],[14.668,-0.256],[14.625,-0.281],[14.581,-0.305],[14.537,-0.33],[14.494,-0.354],[14.45,-0.379],[14.407,-0.404],[14.364,-0.429],[14.32,-0.454],[14.277,-0.478],[14.233,-0.503],[14.19,-0.528],[14.146,-0.552],[14.102,-0.576],[14.058,-0.599],[14.013,-0.622],[13.968,-0.644],[13.923,-0.665],[13.877,-0.685],[13.831,-0.704],[13.785,-0.723],[13.738,-0.74],[13.69,-0.756],[13.643,-0.771],[13.595,-0.785],[13.547,-0.798],[13.498,-0.81],[13.449,-0.821],[13.4,-0.831],[13.351,-0.84],[13.302,-0.848],[13.252,-0.856],[13.203,-0.862],[13.153,-0.868],[13.103,-0.873],[13.054,-0.878],[13.004,-0.881],[12.954,-0.884],[12.904,-0.887],[12.854,-0.889],[12.804,-0.891],[12.754,-0.892],[12.704,-0.893],[12.654,-0.893],[12.604,-0.894],[12.554,-0.894],[12.504,-0.894],[12.454,-0.894],[12.404,-0.893],[12.354,-0.893],[12.304,-0.892],[12.254,-0.891],[12.204,-0.89],[12.154,-0.888],[12.104,-0.887],[12.054,-0.885],[12.004,-0.883],[11.954,-0.881],[11.904,-0.878],[11.854,-0.876],[11.804,-0.873],[11.754,-0.871],[11.704,-0.868],[11.655,-0.865],[11.605,-0.862],[11.555,-0.859],[11.505,-0.856],[11.455,-0.852],[11.405,-0.849],[11.355,-0.846],[11.305,-0.842],[11.255,-0.839],[11.206,-0.835],[11.156,-0.831],[11.106,-0.828],[11.056,-0.824],[11.006,-0.82],[10.956,-0.816],[10.906,-0.812],[10.857,-0.808],[10.807,-0.804],[10.757,-0.801],[10.707,-0.797],[10.657,-0.793],[10.607,-0.789],[10.557,-0.785],[10.508,-0.781],[10.458,-0.777],[10.408,-0.773],[10.358,-0.769],[10.308,-0.765],[10.258,-0.761],[10.209,-0.757],[10.159,-0.753],[10.109,-0.749],[10.059,-0.745],[10.009,-0.741],[9.959,-0.737],[9.91,-0.733],[9.86,-0.729],[9.81,-0.725],[9.76,-0.721],[9.71,-0.717],[9.66,-0.713],[9.61,-0.709],[9.561,-0.705],[9.511,-0.702],[9.461,-0.698],[9.411,-0.694],[9.361,-0.691],[9.311,-0.687],[9.261,-0.683],[9.212,-0.68],[9.162,-0.676],[9.112,-0.673],[9.062,-0.669],[9.012,-0.665],[8.962,-0.662],[8.912,-0.658],[8.862,-0.655],[8.813,-0.651],[8.763,-0.648],[8.713,-0.645],[8.663,-0.641],[8.613,-0.638],[8.563,-0.635],[8.513,-0.632],[8.463,-0.629],[8.413,-0.626],[8.363,-0.623],[8.314,-0.62],[8.264,-0.617],[8.214,-0.613],[8.164,-0.61],[8.114,-0.607],[8.064,-0.604],[8.014,-0.601],[7.964,-0.598],[7.914,-0.595],[7.864,-0.592],[7.815,-0.588],[7.765,-0.585],[7.715,-0.582],[7.665,-0.579],[7.615,-0.576],[7.565,-0.573],[7.515,-0.569],[7.465,-0.566],[7.415,-0.563],[7.365,-0.56],[7.316,-0.556],[7.266,-0.553],[7.216,-0.55],[7.166,-0.547],[7.116,-0.543],[7.066,-0.54],[7.016,-0.537],[6.966,-0.534],[6.916,-0.53],[6.867,-0.527],[6.817,-0.524],[6.767,-0.521],[6.717,-0.518],[6.667,-0.514],[6.617,-0.511],[6.567,-0.508],[6.517,-0.505],[6.467,-0.502],[6.417,-0.498],[6.368,-0.495],[6.318,-0.492],[6.268,-0.489],[6.218,-0.486],[6.168,-0.482],[6.118,-0.479],[6.068,-0.476],[6.018,-0.472],[5.968,-0.469],[5.919,-0.466],[5.869,-0.463],[5.819,-0.459],[5.769,-0.456],[5.719,-0.453],[5.669,-0.45],[5.619,-0.447],[5.569,-0.443],[5.519,-0.44],[5.469,-0.437],[5.42,-0.434],[5.37,-0.43],[5.32,-0.427],[5.27,-0.424],[5.22,-0.42],[5.17,-0.417],[5.12,-0.414],[5.07,-0.411],[5.02,-0.407],[4.971,-0.404],[4.921,-0.401],[4.871,-0.397],[4.821,-0.394],[4.771,-0.391],[4.721,-0.387],[4.671,-0.384],[4.621,-0.38],[4.571,-0.377],[4.522,-0.374],[4.472,-0.37],[4.422,-0.367],[4.372,-0.363],[4.322,-0.36],[4.272,-0.356],[4.222,-0.353],[4.172,-0.349],[4.123,-0.346],[4.073,-0.343],[4.023,-0.339],[3.973,-0.336],[3.923,-0.332],[3.873,-0.329],[3.823,-0.325],[3.773,-0.322],[3.723,-0.318],[3.674,-0.315],[3.624,-0.311],[3.574,-0.308],[3.524,-0.304],[3.474,-0.301],[3.424,-0.297],[3.374,-0.294],[3.324,-0.29],[3.275,-0.286],[3.225,-0.283],[3.175,-0.279],[3.125,-0.275],[3.075,-0.271],[3.025,-0.268],[2.975,-0.264],[2.926,-0.26],[2.876,-0.257],[2.826,-0.253],[2.776,-0.25],[2.726,-0.246],[2.676,-0.243],[2.626,-0.24],[2.576,-0.236],[2.526,-0.233],[2.477,-0.23],[2.427,-0.227],[2.377,-0.224],[2.327,-0.221],[2.277,-0.219],[2.227,-0.216],[2.177,-0.213],[2.127,-0.21],[2.077,-0.208],[2.027,-0.205],[1.977,-0.202],[1.927,-0.199],[1.878,-0.196],[1.828,-0.192],[1.778,-0.188],[1.728,-0.184],[1.678,-0.18],[1.628,-0.175],[1.579,-0.169],[1.529,-0.163],[1.48,-0.156],[1.43,-0.148],[1.381,-0.139],[1.332,-0.129],[1.283,-0.118],[1.235,-0.105],[1.187,-0.091],[1.139,-0.076],[1.092,-0.059],[1.046,-0.041],[1.0,-0.021],[0.955,0.0],[0.91,0.024],[0.867,0.048],[0.825,0.075],[0.784,0.104],[0.744,0.134],[0.705,0.166],[0.669,0.199],[0.633,0.235],[0.6,0.272],[0.569,0.311],[0.54,0.352],[0.513,0.394],[0.488,0.437],[0.465,0.482],[0.445,0.528],[0.426,0.574],[0.409,0.621],[0.394,0.669],[0.381,0.717],[0.369,0.765],[0.358,0.814],[0.348,0.863],[0.34,0.913],[0.333,0.962],[0.326,1.012],[0.321,1.061],[0.317,1.111],[0.314,1.161],[0.312,1.211],[0.31,1.261],[0.31,1.311],[0.31,1.361],[0.311,1.411],[0.313,1.461],[0.316,1.511],[0.319,1.561],[0.323,1.611],[0.327,1.661],[0.332,1.71],[0.337,1.76],[0.342,1.81],[0.347,1.86],[0.352,1.909],[0.358,1.959],[0.363,2.009],[0.369,2.058],[0.374,2.108],[0.379,2.158],[0.384,2.208],[0.388,2.257],[0.392,2.307],[0.396,2.357],[0.4,2.407],[0.403,2.457],[0.405,2.507],[0.407,2.557],[0.409,2.607],[0.411,2.657],[0.412,2.707],[0.413,2.757],[0.414,2.807],[0.414,2.857],[0.414,2.907],[0.415,2.957],[0.415,3.007],[0.415,3.057],[0.415,3.107],[0.415,3.157],[0.415,3.207],[0.415,3.257],[0.415,3.307],[0.415,3.357],[0.415,3.407],[0.415,3.457],[0.415,3.507],[0.415,3.557],[0.415,3.607],[0.415,3.657],[0.415,3.707],[0.415,3.757],[0.415,3.807],[0.415,3.857],[0.415,3.907],[0.415,3.957],[0.415,4.007],[0.415,4.057],[0.414,4.107],[0.414,4.157],[0.413,4.207],[0.413,4.257],[0.412,4.307],[0.411,4.357],[0.409,4.407],[0.408,4.457],[0.406,4.507],[0.405,4.557],[0.403,4.606],[0.401,4.656],[0.4,4.706],[0.398,4.756],[0.397,4.806],[0.396,4.856],[0.395,4.906],[0.394,4.956],[0.394,5.006],[0.393,5.056],[0.393,5.106],[0.393,5.156],[0.392,5.206],[0.392,5.256],[0.392,5.306],[0.392,5.356],[0.392,5.406],[0.392,5.456],[0.392,5.506],[0.392,5.556],[0.392,5.606],[0.392,5.656],[0.392,5.706],[0.392,5.756],[0.392,5.806],[0.392,5.856],[0.392,5.906],[0.392,5.956],[0.392,6.006],[0.392,6.056],[0.392,6.106],[0.392,6.156],[0.392,6.206],[0.392,6.256],[0.391,6.306],[0.391,6.356],[0.39,6.406],[0.389,6.456],[0.388,6.506],[0.387,6.556],[0.386,6.606],[0.384,6.656],[0.383,6.706],[0.381,6.756],[0.379,6.806],[0.377,6.856],[0.376,6.906],[0.375,6.956],[0.373,7.006],[0.372,7.056],[0.371,7.106],[0.371,7.156],[0.37,7.206],[0.369,7.256],[0.369,7.306],[0.368,7.356],[0.367,7.406],[0.366,7.456],[0.365,7.506],[0.363,7.556],[0.362,7.606],[0.36,7.656],[0.359,7.706],[0.357,7.756],[0.355,7.806],[0.354,7.856],[0.352,7.906],[0.351,7.956],[0.35,8.006],[0.349,8.056],[0.349,8.106],[0.348,8.156],[0.348,8.206],[0.348,8.256],[0.348,8.306],[0.349,8.356],[0.35,8.406],[0.351,8.456],[0.352,8.506],[0.353,8.556],[0.355,8.606],[0.357,8.656],[0.359,8.706],[0.362,8.756],[0.364,8.806],[0.367,8.855],[0.37,8.905],[0.373,8.955],[0.376,9.005],[0.38,9.055],[0.383,9.105],[0.388,9.155],[0.392,9.204],[0.397,9.254],[0.402,9.304],[0.408,9.354],[0.414,9.403],[0.421,9.453],[0.428,9.502],[0.436,9.552],[0.444,9.601],[0.453,9.65],[0.462,9.699],[0.472,9.748],[0.482,9.797],[0.493,9.846],[0.504,9.895],[0.516,9.943],[0.528,9.992],[0.541,10.04],[0.555,10.088],[0.569,10.136],[0.583,10.184],[0.599,10.232],[0.615,10.279],[0.632,10.326],[0.649,10.373],[0.668,10.419],[0.688,10.465],[0.708,10.511],[0.729,10.556],[0.752,10.601],[0.775,10.645],[0.8,10.689],[0.825,10.732],[0.852,10.774],[0.879,10.816],[0.907,10.857],[0.937,10.898],[0.967,10.937],[0.998,10.977],[1.03,11.015],[1.063,11.053],[1.096,11.09],[1.13,11.126],[1.165,11.162],[1.201,11.198],[1.237,11.232],[1.273,11.266],[1.31,11.3],[1.348,11.333],[1.386,11.365],[1.424,11.397],[1.463,11.429],[1.503,11.46],[1.542,11.49],[1.582,11.52],[1.623,11.549],[1.664,11.578],[1.705,11.606],[1.747,11.634],[1.788,11.661],[1.831,11.688],[1.873,11.715],[1.916,11.741],[1.959,11.766],[2.002,11.791],[2.045,11.816],[2.089,11.841],[2.133,11.865],[2.177,11.888],[2.221,11.912],[2.265,11.935],[2.31,11.958],[2.354,11.98],[2.399,12.003],[2.444,12.025],[2.489,12.047],[2.534,12.068],[2.579,12.09],[2.624,12.111],[2.67,12.132],[2.715,12.153],[2.761,12.174],[2.806,12.194],[2.852,12.215],[2.897,12.235],[2.943,12.256],[2.989,12.276],[3.035,12.296],[3.08,12.316],[3.126,12.336],[3.172,12.356],[3.218,12.376],[3.264,12.396],[3.31,12.415],[3.356,12.435],[3.402,12.454],[3.448,12.474],[3.494,12.493],[3.54,12.512],[3.586,12.532],[3.633,12.551],[3.679,12.57],[3.725,12.589],[3.771,12.608],[3.817,12.627],[3.864,12.646],[3.91,12.665],[3.956,12.684],[4.002,12.703],[4.049,12.723],[4.095,12.742],[4.141,12.761],[4.187,12.78],[4.233,12.799],[4.279,12.818],[4.326,12.838],[4.372,12.857],[4.418,12.876],[4.464,12.896],[4.51,12.915],[4.556,12.934],[4.602,12.954],[4.648,12.973],[4.694,12.993],[4.74,13.012],[4.786,13.032],[4.832,13.051],[4.878,13.071],[4.925,13.09],[4.971,13.109],[5.017,13.129],[5.063,13.148],[5.109,13.167],[5.156,13.186],[5.202,13.205],[5.248,13.223],[5.295,13.242],[5.341,13.26],[5.388,13.279],[5.434,13.297],[5.48,13.316],[5.526,13.337],[5.57,13.36],[5.615,13.383],[5.658,13.407],[5.701,13.433],[5.744,13.459],[5.786,13.486],[5.828,13.514],[5.869,13.542],[5.91,13.57],[5.951,13.599],[5.991,13.628],[6.032,13.658],[6.072,13.688],[6.112,13.717],[6.152,13.748],[6.192,13.778],[6.232,13.808],[6.271,13.838],[6.311,13.869],[6.351,13.899],[6.39,13.93],[6.43,13.96],[6.47,13.99],[6.51,14.02],[6.55,14.05],[6.59,14.08],[6.631,14.109],[6.671,14.139],[6.712,14.168],[6.753,14.197],[6.794,14.225],[6.835,14.253],[6.877,14.28],[6.919,14.307],[6.962,14.334],[7.004,14.36],[7.047,14.385],[7.091,14.41],[7.134,14.434],[7.179,14.458],[7.223,14.481],[7.268,14.503],[7.313,14.525],[7.358,14.545],[7.404,14.566],[7.45,14.585],[7.496,14.604],[7.543,14.623],[7.59,14.64],[7.637,14.657],[7.684,14.674],[7.731,14.689],[7.779,14.704],[7.827,14.718],[7.875,14.731],[7.924,14.743],[7.973,14.755],[8.021,14.765],[8.071,14.775],[8.12,14.783],[8.169,14.79],[8.219,14.796],[8.269,14.801],[8.319,14.805],[8.369,14.807],[8.419,14.808],[8.469,14.808],[8.519,14.808],[8.569,14.808],[8.619,14.808],[8.669,14.808],[8.719,14.808],[8.769,14.808],[8.819,14.808],[8.869,14.808],[8.919,14.808],[8.969,14.808],[9.019,14.808],[9.069,14.808],[9.119,14.808],[9.169,14.808],[9.219,14.808],[9.269,14.808],[9.319,14.808],[9.369,14.808],[9.419,14.808],[9.469,14.808],[9.519,14.808],[9.569,14.808],[9.619,14.808],[9.669,14.808],[9.719,14.808],[9.769,14.808],[9.819,14.808],[9.869,14.808],[9.919,14.808],[9.969,14.808],[10.019,14.808],[10.069,14.808],[10.119,14.808],[10.169,14.808],[10.219,14.808],[10.269,14.808],[10.319,14.808],[10.369,14.808],[10.419,14.808],[10.469,14.808],[10.519,14.808],[10.569,14.808],[10.619,14.808],[10.669,14.807],[10.718,14.805],[10.768,14.802],[10.818,14.797],[10.868,14.791],[10.917,14.783],[10.966,14.775],[11.015,14.765],[11.064,14.754],[11.113,14.742],[11.161,14.729],[11.209,14.715],[11.257,14.7],[11.304,14.684],[11.351,14.668],[11.398,14.65],[11.445,14.632],[11.491,14.614],[11.537,14.594],[11.583,14.574],[11.629,14.554],[11.674,14.532],[11.719,14.511],[11.764,14.489],[11.808,14.466],[11.853,14.443],[11.897,14.419],[11.94,14.395],[11.984,14.37],[12.027,14.344],[12.07,14.319],[12.112,14.292],[12.154,14.265],[12.196,14.238],[12.238,14.21],[12.278,14.181],[12.319,14.152],[12.359,14.122],[12.398,14.091],[12.437,14.06],[12.476,14.028],[12.514,13.995],[12.551,13.962],[12.588,13.929],[12.625,13.894],[12.661,13.859],[12.696,13.824],[12.731,13.788],[12.765,13.751],[12.798,13.714],[12.831,13.677],[12.863,13.638],[12.895,13.6],[12.926,13.56],[12.956,13.521],[12.986,13.481],[13.016,13.44],[13.045,13.4],[13.073,13.358],[13.101,13.317],[13.129,13.276],[13.157,13.234],[13.185,13.193],[13.213,13.151],[13.24,13.11],[13.269,13.068],[13.297,13.027],[13.326,12.986],[13.355,12.945],[13.384,12.905],[13.415,12.865],[13.446,12.826],[13.478,12.788],[13.511,12.75],[13.542,12.711],[13.579,12.676],[13.617,12.641],[13.655,12.606],[13.694,12.571],[13.734,12.537],[13.775,12.504],[13.817,12.472],[13.859,12.442],[13.902,12.413],[13.947,12.387],[13.991,12.362],[14.037,12.34],[14.083,12.32],[14.13,12.301],[14.178,12.285],[14.226,12.271],[14.274,12.258],[14.323,12.247],[14.372,12.238],[14.421,12.229],[14.47,12.222],[14.52,12.216],[14.57,12.211],[14.619,12.207],[14.669,12.203],[14.719,12.2],[14.769,12.197],[14.819,12.195],[14.869,12.193],[14.919,12.191],[14.969,12.19],[15.019,12.188],[15.068,12.186],[15.118,12.185],[15.168,12.184],[15.218,12.183],[15.267,12.183],[15.316,12.183],[15.366,12.182],[15.416,12.181],[15.466,12.181],[15.516,12.18],[15.566,12.18]],"yc":14.808,"Wx":9.526,"hexY":12.18};
const CT_K=0.58;                                           /* ground foreshortening: screen y = plan y * 0.58 (row 0.87 / true hex row 1.5) */
let CAMPUS_TRAIN_MODEL=null;
function campusTrain(M){
  if(CAMPUS_TRAIN_MODEL)return CAMPUS_TRAIN_MODEL;
  const D=CAMPUS_TRAIN_DATA,K=CT_K,src=D.pts;
  /* resample at an even spacing in PLAN metric so ties are evenly spaced whichever way the track runs */
  const pl=src.map(p=>[p[0],p[1]/K]);let acc=[0];for(let i=1;i<pl.length;i++)acc.push(acc[i-1]+Math.hypot(pl[i][0]-pl[i-1][0],pl[i][1]-pl[i-1][1]));
  const ds=0.046,n=Math.floor(acc[acc.length-1]/ds),S=[];let j=0;
  for(let i=0;i<=n;i++){const d=i*ds;while(j<acc.length-2&&acc[j+1]<d)j++;const t=(d-acc[j])/((acc[j+1]-acc[j])||1);S.push({px:pl[j][0]+(pl[j+1][0]-pl[j][0])*t,py:pl[j][1]+(pl[j+1][1]-pl[j][1])*t});}
  for(let i=0;i<S.length;i++){const a=S[Math.max(0,i-2)],b=S[Math.min(S.length-1,i+2)],dx=b.px-a.px,dy=b.py-a.py,l=Math.hypot(dx,dy)||1;S[i].tx=dx/l;S[i].ty=dy/l;S[i].nx=-dy/l;S[i].ny=dx/l;S[i].x=S[i].px;S[i].y=S[i].py*K;}
  /* tree clearing corridor: elliptical clearance around every sample (wider to the south, where canopies would hide the track) */
  const hash=new Map(),cell=0.8,hk=(a,b)=>a+','+b;S.forEach(s=>{const k=hk(Math.floor(s.x/cell),Math.floor(s.y/cell));(hash.get(k)||hash.set(k,[]).get(k)).push(s);});
  const CX=0.2,CN=0.13,CS=0.13;                                  /* only trunks that would stand on the track bed; canopies are free to overhang it */
  const tunX=D.Wx,tunY=D.yc;
  const clear=(x,y)=>{if(tun&&Math.abs(x-tunX)<1.15&&y>tunY-0.4&&y<tunY+0.66)return true;const cx=Math.floor(x/cell),cy=Math.floor(y/cell);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const L=hash.get(hk(cx+a,cy+b));if(!L)continue;for(const s of L){const dx=(x-s.x)/CX,dy=y-s.y,q=dy>0?dy/CS:dy/CN;if(dx*dx+q*q<1)return true;}}return false;};
  const tun=(D.Wx!==undefined)?{x:D.Wx,yc:D.yc,h:0.22,hw:0.36,ramp:0.5,mhw:0.26,gapW:0.11}:null;
  const hexY=D.hexY;
  /* stretches that run through a hex tile (station / entrance) are hidden under the tile: not drawn, but kept in the data */
  const hid=S.map(s=>(D.hideHexes||[]).some(h=>Math.abs(s.x-h[0])<0.866-0.08&&Math.abs(s.y-h[1])<0.35));
  const runs=[];{let a=-1;for(let i=0;i<=S.length;i++){const h=i===S.length?true:hid[i];if(!h&&a<0)a=i;if(h&&a>=0){if(i-1-a>=2)runs.push([a,i-1]);a=-1;}}}
  const underHex=(D.hideHexes||[]).map(h=>{const idx=[];S.forEach((s,i)=>{if(Math.abs(s.x-h[0])<0.866&&Math.abs(s.y-h[1])<0.35)idx.push(i);});return idx.length?{name:h[2],from:idx[0],to:idx[idx.length-1]}:null;}).filter(Boolean);
  /* where the track crosses water it runs on a trestle: split the runs at the shore */
  const wet=S.map(s=>!!(M&&M.lake&&M.inLake(s.x,s.y,0.1)));
  const runs2=[];runs.forEach(([a,b])=>{let i0=a;for(let i=a+1;i<=b+1;i++){if(i===b+1||wet[i]!==wet[i0]){runs2.push([Math.max(a,i0-(i0>a?1:0)),Math.min(b,i),wet[i0]]);i0=i;}}});
  S.forEach((s,i)=>s.wet=wet[i]);
  CAMPUS_TRAIN_MODEL={S,clear,tun,zone:tun?{y0:tun.yc-0.9,y1:tun.yc+0.82}:null,lampY:tun?tun.yc+0.55:null,hexY,runs:(runs.length||!(D.hideHexes&&D.hideHexes.length))?(runs.length?runs2:[[0,S.length-1,false]]):[[0,S.length-1,false]],underHex:underHex.length?underHex:null,
    len:acc[acc.length-1],pts:src};
  return CAMPUS_TRAIN_MODEL;
}
/* ---- the track: gravel bed, sleepers and two steel rails, drawn flat on the ground layer ---- */
function campusDrawTrackRun(g,S,X,Y,RS,rng){
  const K=CT_K,off=o=>S.map(s=>[X(s.x+s.nx*o),Y((s.py+s.ny*o)*K)]);
  const trace=pts=>{g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));};
  const band=(o1,o2,fill,stroke,lw,dy)=>{const a=off(o1),b=off(o2).reverse();g.beginPath();a.forEach((p,i)=>{const y=p[1]+(dy||0);i?g.lineTo(p[0],y):g.moveTo(p[0],y);});b.forEach(p=>g.lineTo(p[0],p[1]+(dy||0)));g.closePath();if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.stroke();}};
  g.save();g.lineJoin='round';g.lineCap='butt';
  band(-0.27,0.27,'rgba(58,92,40,.16)');band(-0.19,0.19,'rgba(58,92,40,.2)');                  /* worn verge */
  band(-0.125,0.125,'rgba(30,38,24,.34)',null,0,RS*0.014);                                        /* bed shadow */
  band(-0.115,0.115,'#bab4a1','#8e8873',Math.max(1,RS*0.012));                                    /* gravel bed */
  band(-0.085,0.085,'rgba(224,219,200,.35)');
  for(let i=0;i<S.length;i+=1){const s=S[i];for(let k=0;k<3;k++){const o=(rng()*2-1)*0.108,p=[X(s.x+s.nx*o),Y((s.py+s.ny*o)*K)];g.fillStyle=rng()<0.5?'rgba(255,255,255,.28)':'rgba(70,64,48,.32)';g.fillRect(p[0],p[1],Math.max(1,RS*0.009),Math.max(1,RS*0.007));}}
  /* sleepers */
  for(let i=0;i<S.length;i++){const s=S[i],a=[X(s.x-s.nx*0.088),Y((s.py-s.ny*0.088)*K)],b=[X(s.x+s.nx*0.088),Y((s.py+s.ny*0.088)*K)];
    g.strokeStyle='rgba(30,24,16,.35)';g.lineWidth=Math.max(1.4,RS*0.021);g.beginPath();g.moveTo(a[0],a[1]+RS*0.004);g.lineTo(b[0],b[1]+RS*0.004);g.stroke();
    g.strokeStyle=i%3===0?'#76533a':i%3===1?'#6a4a2f':'#7c5a3e';g.lineWidth=Math.max(1,RS*0.016);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();}
  /* rails */
  [-1,1].forEach(sg=>{const r=off(sg*0.044);
    trace(r.map(p=>[p[0],p[1]+RS*0.006]));g.strokeStyle='rgba(30,34,40,.55)';g.lineWidth=Math.max(1.3,RS*0.014);g.stroke();
    trace(r);g.strokeStyle='#7e858e';g.lineWidth=Math.max(1.1,RS*0.0115);g.stroke();
    trace(r.map(p=>[p[0],p[1]-RS*0.0025]));g.strokeStyle='#d3d8dd';g.lineWidth=Math.max(0.6,RS*0.0042);g.stroke();});
  g.restore();
}
function campusDrawTrackBridge(g,S,X,Y,RS,rng){
  const K=CT_K,lift=RS*0.055,off=(o,l)=>S.map(s=>[X(s.x+s.nx*o),Y((s.py+s.ny*o)*K)-(l||0)]);
  const trace=pts=>{g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));};
  const band=(o1,o2,l,fill,stroke,lw)=>{const a=off(o1,l),b=off(o2,l).reverse();g.beginPath();a.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));b.forEach(p=>g.lineTo(p[0],p[1]));g.closePath();if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.stroke();}};
  g.save();g.lineJoin='round';g.lineCap='round';
  band(-0.16,0.16,-RS*0.03,'rgba(10,40,60,.3)');
  for(let i=2;i<S.length-2;i+=7){const s=S[i];[-1,1].forEach(sg=>{const t=[X(s.x+s.nx*sg*0.1),Y((s.py+s.ny*sg*0.1)*K)];g.strokeStyle='#3e2a16';g.lineWidth=Math.max(1.6,RS*0.034);g.beginPath();g.moveTo(t[0],t[1]-lift);g.lineTo(t[0],t[1]+RS*0.03);g.stroke();});}
  band(-0.14,0.14,lift-RS*0.035,'#4a3118');band(-0.14,0.14,lift,'#8a5e34','#5a3a1c',Math.max(1,RS*0.01));
  for(let i=0;i<S.length;i++){const s=S[i],a=[X(s.x-s.nx*0.12),Y((s.py-s.ny*0.12)*K)-lift],b=[X(s.x+s.nx*0.12),Y((s.py+s.ny*0.12)*K)-lift];g.strokeStyle=i%2?'#76503a':'#6a4a2f';g.lineWidth=Math.max(1,RS*0.016);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();}
  [-1,1].forEach(sg=>{const r=off(sg*0.044,lift);trace(r.map(p=>[p[0],p[1]+RS*0.006]));g.strokeStyle='rgba(30,34,40,.55)';g.lineWidth=Math.max(1.3,RS*0.014);g.stroke();trace(r);g.strokeStyle='#7e858e';g.lineWidth=Math.max(1.1,RS*0.0115);g.stroke();trace(r.map(p=>[p[0],p[1]-RS*0.0025]));g.strokeStyle='#d3d8dd';g.lineWidth=Math.max(0.6,RS*0.0042);g.stroke();});
  [-1,1].forEach(sg=>{const r=off(sg*0.135,lift);trace(r.map(p=>[p[0],p[1]-RS*0.07]));g.strokeStyle='#5a3a1c';g.lineWidth=Math.max(1.1,RS*0.016);g.stroke();for(let i=0;i<r.length;i+=6){g.strokeStyle='#4a3018';g.lineWidth=Math.max(1,RS*0.016);g.beginPath();g.moveTo(r[i][0],r[i][1]);g.lineTo(r[i][0],r[i][1]-RS*0.07);g.stroke();}});
  g.restore();
}
function campusDrawTrack(g,TR,X,Y,RS,rng){TR.runs.forEach(r=>{const sl=TR.S.slice(r[0],r[1]+1);if(r[2])campusDrawTrackBridge(g,sl,X,Y,RS,rng);else campusDrawTrackRun(g,sl,X,Y,RS,rng);});}
/* ---- the tunnel: a short stone overpass carries the walk over the track; each end is a skewed portal with a voussoir arch ---- */
function campusDrawTunnel(c,TR,X,Y,RS){
  const T=TR.tun,K=CT_K,H=T.h,hw=T.hw,MW=T.mhw,RP=T.ramp;
  const S=(px,py,z)=>[X(T.x+px),Y(T.yc+py*K-z)];
  const poly=(pts,fill,stroke,lw)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw||1;c.stroke();}};
  const line=(a,b,col,lw)=>{c.strokeStyle=col;c.lineWidth=lw;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();};
  const lwk=Math.max(1,RS*0.012);
  c.save();c.lineJoin='round';
  /* soft ground shadow */
  poly([S(-1.04,-MW-0.04,0),S(1.04,-MW-0.04,0),S(0.56,MW+0.1,0),S(-0.56,MW+0.1,0)].map(p=>[p[0]+RS*0.02,p[1]+RS*0.02]),'rgba(26,34,22,.28)');
  /* north ramp (seen almost edge-on) */
  const rampQ=(py0,z0,py1,z1)=>[S(-hw,py0,z0),S(hw,py0,z0),S(hw,py1,z1),S(-hw,py1,z1)];
  poly(rampQ(-MW-RP,0,-MW,H),'#d9cfb4','#b6aa8a',lwk);
  /* mound faces: west + east skewed portals, south face */
  const faceCols={W:['#cdc7b2','#b7b19c'],E:['#a8a28d','#8f8975'],S:['#bcb6a1','#a39d89']};
  const face=(A,B,key)=>{const q=[S(A[0],A[1],0),S(B[0],B[1],0),S(B[0],B[1],H),S(A[0],A[1],H)],g=c.createLinearGradient(0,q[3][1],0,q[0][1]);g.addColorStop(0,faceCols[key][0]);g.addColorStop(1,faceCols[key][1]);poly(q,g,'#6f6a58',lwk);
    /* masonry: courses along the face + staggered joints */
    const nC=Math.round(H/0.055),ln=Math.hypot(B[0]-A[0],(B[1]-A[1])),nJ=Math.max(3,Math.round(ln/0.15));
    for(let k=1;k<nC;k++){const z=H*k/nC;line(S(A[0],A[1],z),S(B[0],B[1],z),'rgba(60,54,40,.34)',Math.max(0.7,RS*0.007));
      for(let m=0;m<nJ;m++){const t=(m+(k%2?0.5:0))/nJ;if(t<=0||t>=1)continue;const px=A[0]+(B[0]-A[0])*t,py=A[1]+(B[1]-A[1])*t;line(S(px,py,z-H/nC),S(px,py,z),'rgba(60,54,40,.28)',Math.max(0.7,RS*0.006));}}
    return q;};
  const WA=[-1.0,-MW],WB=[-0.5,MW],EA=[1.0,-MW],EB=[0.5,MW];
  face(WA,WB,'W');face(EA,EB,'E');face([-0.5,MW],[0.5,MW],'S');
  /* arches on the two portals (track axis py=0 hits the middle of each face) */
  const arch=(A,B,pad)=>{const dt=T.gapW/(2*MW)+pad,zs=0.06+pad*0.5,r=T.gapW+pad*MW*2,pts=[];const P=(t,z)=>S(A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,z);
    pts.push(P(0.5-dt,0));pts.push(P(0.5-dt,zs));for(let a=0;a<=24;a++){const th=Math.PI*a/24;pts.push(P(0.5-dt*Math.cos(th),zs+(T.gapW+pad*MW)*Math.sin(th)));}pts.push(P(0.5+dt,0));return pts;};
  [[WA,WB],[EA,EB]].forEach(([A,B],fi)=>{
    poly(arch(A,B,0.052),fi?'#bdb7a2':'#e2dcc8','#6f6a58',lwk);                                    /* voussoir ring */
    {const P=(t,z)=>S(A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,z);for(let a=1;a<24;a+=3){const th=Math.PI*a/24,dtI=T.gapW/(2*MW),dtO=dtI+0.052,zI=0.06+T.gapW*Math.sin(th),zO=0.06+0.026*0+(T.gapW+0.052*MW)*Math.sin(th);line(P(0.5-dtI*Math.cos(th),zI),P(0.5-dtO*Math.cos(th),zO),'rgba(60,54,40,.5)',Math.max(0.7,RS*0.007));}}
    const ap=arch(A,B,0),gy=c.createLinearGradient(0,Math.min(...ap.map(p=>p[1])),0,Math.max(...ap.map(p=>p[1])));gy.addColorStop(0,'#05070a');gy.addColorStop(1,'#1c2028');poly(ap,gy,'#0a0c10',lwk);
    /* a hint of the track running away into the dark */
    {const P=(t,z)=>S(A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,z),dir=fi?-1:1;[-0.044,0.044].forEach(o=>{const t0=0.5+o/(2*MW)*1.0;const a=P(t0,0),b=[a[0]+dir*RS*0.07,a[1]-RS*0.012*dir*0];line(a,b,'rgba(150,158,168,.55)',Math.max(0.7,RS*0.006));});}
    /* keystone */
    {const P=(t,z)=>S(A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,z),zt=0.06+T.gapW+0.052*MW+0.002,ks=[P(0.5-0.045,zt-0.012),P(0.5+0.045,zt-0.012),P(0.5+0.045,zt+0.03),P(0.5-0.045,zt+0.03)];poly(ks,'#efe9d6','#6f6a58',lwk);}
  });
  /* top: grass roof of the mound with a stone coping */
  const top=[S(-1.0,-MW,H),S(1.0,-MW,H),S(0.5,MW,H),S(-0.5,MW,H)];
  {const g=c.createLinearGradient(0,top[0][1],0,top[3][1]);g.addColorStop(0,'#7fae58');g.addColorStop(1,'#93c26b');poly(top,g,'#d8d2bd',Math.max(1.4,RS*0.03));poly(top,null,'rgba(70,64,48,.5)',Math.max(0.7,RS*0.006));}
  /* the walk deck over the tunnel + paving */
  const deck=[S(-hw,-MW,H),S(hw,-MW,H),S(hw,MW,H),S(-hw,MW,H)];poly(deck,'#e3d9c0');
  c.save();poly(deck,null);c.clip();for(let py=-MW;py<=MW+0.01;py+=0.12){line(S(-hw,py,H),S(hw,py,H),'rgba(150,134,98,.38)',Math.max(1,RS*0.012));}c.restore();
  /* south ramp (the big visible slope) */
  {const q=rampQ(MW,H,MW+RP,0),g=c.createLinearGradient(0,q[0][1],0,q[2][1]);g.addColorStop(0,'#e8dfc6');g.addColorStop(1,'#d9cfb4');poly(q,g);
    c.save();poly(q,null);c.clip();const nR=Math.round(RP/0.12);for(let k=0;k<=nR;k++){const t=k/nR,py=MW+RP*t,z=H*(1-t);line(S(-hw,py,z),S(hw,py,z),'rgba(150,134,98,.38)',Math.max(1,RS*0.012));
      for(let m=0;m<4;m++){const px=-hw+(m+(k%2?0.5:0.0)+0.5)*(2*hw/4)-0.0;if(k<nR)line(S(px,py,z),S(px,py+RP/nR,H*(1-(k+1)/nR)),'rgba(150,134,98,.3)',Math.max(0.8,RS*0.009));}}c.restore();}
  /* kerbs along both sides of the whole raised walk + a little parapet cap at the south end */
  [-1,1].forEach(sg=>{const pts=[S(sg*hw,-MW-RP,0),S(sg*hw,-MW,H),S(sg*hw,MW,H),S(sg*hw,MW+RP,0)];c.strokeStyle='#b0a484';c.lineWidth=Math.max(1.6,RS*0.04);c.lineCap='round';c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
    c.strokeStyle='#d6ceb6';c.lineWidth=Math.max(0.8,RS*0.016);c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]-RS*0.008):c.moveTo(p[0],p[1]-RS*0.008));c.stroke();});
  /* planting on the mound either side of the deck */
  if(typeof CAMPUS_ASSETS!=='undefined'){const u=0.075*RS;[[-0.64,-0.04],[-0.64,0.14],[0.64,-0.04],[0.64,0.14],[-0.82,-0.18],[0.82,-0.18]].forEach(([px,py],i)=>{const A=CAMPUS_ASSETS[i<4?'hedge':'geraniumBush'];if(!A)return;const p=S(px,py,H);A.draw(c,p[0],p[1],u*0.62,i*37+5);});}
  c.restore();
}

/* ===== BAKE ===== */
function campusObjectSprite(o,R){
  const unit=(o.bridge||o.tunnel?2:(o.fu||0.075*(o.s||1)))*R;
  return {x:o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>{
    const X=v=>x+(v-o.x)*R, Y=v=>y+(v-o.y)*R;
    if(o.tunnel){campusDrawTunnel(ctx,o.train,X,Y,R);return;}
    if(o.bridge){campusDrawBridge(ctx,o.b,X,Y,R);return;}
    if(o.car){cmCar(ctx,X,Y,R,o);return;}
    const asset=CAMPUS_ASSETS[o.k];
    if(!asset)throw new Error(`Missing campus scenery asset: ${o.k}`);
    asset.draw(ctx,x,y,unit,o.v);
  }};
}
let CAMPUS_CACHE={};
function bakeCampus(R,opts){
  opts=opts||{};const S=opts.scale||getBakeScale(),key=R+'|'+S+'|'+(typeof CAMPUS_VARIANT!=='undefined'?CAMPUS_VARIANT:'plain');if(CAMPUS_CACHE[key]&&!opts.fresh)return CAMPUS_CACHE[key];
  const t0=performance.now(),M=campusModel(),F=M.F,RS=R*S,Wpx=Math.ceil(M.FW*RS),Hpx=Math.ceil(M.FH*RS);
  const TR=(typeof CAMPUS_VARIANT!=='undefined'&&CAMPUS_VARIANT==='train'&&typeof campusTrain==='function')?campusTrain(M):null;
  const mk=()=>{const c=document.createElement('canvas');c.width=Wpx;c.height=Hpx;return c;};
  const gC=mk(),g=gC.getContext('2d');g.imageSmoothingQuality='high';
  const X=x=>(x-F.x0)*RS,Y=y=>(y-F.y0)*RS,u0=0.075*RS,rng=mulberry(opts.seed||5107);
  const poly=(c,pts)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(X(p[0]),Y(p[1])):c.moveTo(X(p[0]),Y(p[1])));c.closePath();};
  const soft=(x,y,rx,ry,rgb,a)=>{g.save();g.translate(x,y);g.scale(1,ry/rx);const q=g.createRadialGradient(0,0,0,0,0,rx);q.addColorStop(0,`rgba(${rgb},${a})`);q.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);q.addColorStop(1,`rgba(${rgb},0)`);g.fillStyle=q;g.beginPath();g.arc(0,0,rx,0,7);g.fill();g.restore();};
  const pt=()=>[rng()*Wpx,rng()*Hpx],AK=M.FW*M.FH/31;                      /* Bavarian land detail density x frame area */
  /* ---------- 1. GROUND: Bavarian grass + its soft patches / tufts / leaves / flowers ---------- */
  g.fillStyle='#8fbf68';g.fillRect(0,0,Wpx,Hpx);
  for(let k=0;k<46*AK;k++){const p=pt(),w=RS*(0.45+rng()*0.9);soft(p[0],p[1],w,w*0.4,rng()<0.5?'190,230,130':'80,140,60',0.2);}
  for(let k=0;k<320;k++){const p=pt(),w=RS*(0.7+rng()*1.3);soft(p[0],p[1],w,w*0.42,'58,112,48',0.2);}            /* deeper forest-floor shade */
  for(let k=0;k<12*AK;k++){const p=pt(),w=RS*(0.3+rng()*0.5);soft(p[0],p[1],w,w*0.4,'236,224,140',0.15);}
  for(let k=0;k<8*AK;k++){const p=pt(),w=RS*(0.25+rng()*0.4);soft(p[0],p[1],w,w*0.4,'150,116,70',0.14);}
  for(let k=0;k<12*AK;k++){const p=pt(),w=RS*(0.3+rng()*0.5);soft(p[0],p[1],w,w*0.4,'255,255,210',0.14);}
  for(let k=0;k<160*AK;k++){const p=pt(),h=RS*(0.05+rng()*0.06);for(let j=0;j<3;j++)TH.ln(g,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#78b856','#68a84a','#92cc6a'][(k+j)%3],RS*0.011);}
  for(let k=0;k<70*AK;k++){const p=pt(),a=rng()*3.14,l=RS*(0.03+rng()*0.035);TH.ell(g,p[0],p[1],l,l*0.55,['#e8892a','#f0b83a','#c8402a','#e0a030'][k%4],a);}
  for(let k=0;k<70*AK;k++){const p=pt();TH.ell(g,p[0],p[1],RS*0.012,RS*0.01,['#f6efe0','#f2c230','#6a8ae8','#f4a6cb','#fff0a0'][k%5]);}
  /* meadows get a lighter, flower-rich sward */
  M.meadows.forEach(m=>{for(let k=0;k<14;k++){const a=rng()*6.283,rr=Math.sqrt(rng());soft(X(m[0]+Math.cos(a)*m[2]*rr*0.9),Y(m[1]+Math.sin(a)*m[3]*rr*0.9),RS*(0.5+rng()*0.6),RS*0.22,'206,238,150',0.2);}});
  if(M.lake)campusPaintPond(g,M,X,Y,RS,mulberry(4411),M.lake);                                        /* the lake (small park) */
  /* ---------- 2. PARKING LOT ---------- */
  g.save();g.lineJoin='round';g.lineCap='round';
  poly(g,M.lot);g.strokeStyle='rgba(52,104,40,.30)';g.lineWidth=RS*0.62;g.stroke();              /* shaded verge */
  poly(g,M.lot);g.strokeStyle='rgba(30,40,26,.22)';g.lineWidth=RS*0.26;g.stroke();                /* curb shadow */
  poly(g,M.lot);g.strokeStyle='#cdd0cf';g.lineWidth=RS*0.15;g.stroke();                           /* concrete curb */
  poly(g,M.lot);g.strokeStyle='#e4e6e3';g.lineWidth=RS*0.05;g.stroke();
  poly(g,M.lot);const ag=g.createLinearGradient(0,Y(M.G.lotGradY||10.6),0,Y(F.y1));ag.addColorStop(0,'#8a9099');ag.addColorStop(1,'#767c85');g.fillStyle=ag;g.fill();
  g.save();poly(g,M.lot);g.clip();
  for(let k=0;k<26;k++){const p=pt(),w=RS*(0.8+rng()*1.6);soft(p[0],p[1],w,w*0.36,rng()<0.5?'255,255,255':'40,44,52',rng()<0.5?0.06:0.07);}
  for(let k=0;k<5200;k++){const p=pt();g.fillStyle=rng()<0.5?'rgba(255,255,255,.07)':'rgba(0,0,0,.09)';g.fillRect(p[0],p[1],Math.max(1,RS*0.012),Math.max(1,RS*0.012));}
  const L=campusLotLayout(M,rng);
  g.strokeStyle='rgba(246,244,234,.92)';g.lineWidth=Math.max(1,RS*0.022);g.lineCap='butt';g.beginPath();L.lines.forEach(l=>{g.moveTo(X(l[0]),Y(l[1]));g.lineTo(X(l[2]),Y(l[3]));});g.stroke();
  g.restore();
  /* medians: curbed planting islands */
  M.med.forEach(m=>{g.lineCap='round';g.strokeStyle='rgba(20,26,22,.28)';g.lineWidth=RS*0.44;g.beginPath();g.moveTo(X(m.a[0]),Y(m.a[1])+RS*0.03);g.lineTo(X(m.b[0]),Y(m.b[1])+RS*0.03);g.stroke();
    g.strokeStyle='#d3d5d4';g.lineWidth=RS*0.38;g.beginPath();g.moveTo(X(m.a[0]),Y(m.a[1]));g.lineTo(X(m.b[0]),Y(m.b[1]));g.stroke();
    g.strokeStyle='#8fbf68';g.lineWidth=RS*0.30;g.beginPath();g.moveTo(X(m.a[0]),Y(m.a[1]));g.lineTo(X(m.b[0]),Y(m.b[1]));g.stroke();
    g.strokeStyle='rgba(80,140,60,.35)';g.lineWidth=RS*0.14;g.stroke();});
  g.restore();
  /* ---------- 3. ENTRANCE WALK + CIRCLE ---------- */
  const Wk=M.W,P=M.P;
  const walkP=()=>{g.beginPath();g.rect(X(Wk.x-Wk.w/2),Y(Wk.y0),Wk.w*RS,(Wk.y1+0.02-Wk.y0)*RS);};
  const plazaP=(k)=>{g.beginPath();g.ellipse(X(P.cx),Y(P.cy),P.rx*RS*(k||1),P.ry*RS*(k||1),0,0,7);};
  g.save();g.fillStyle='rgba(30,40,26,.26)';walkP();g.save();g.translate(0,RS*0.03);g.fill();g.restore();plazaP(1.03);g.save();g.translate(0,RS*0.035);g.fill();g.restore();g.restore();
  g.save();g.fillStyle='#e3d9c0';walkP();g.fill();plazaP();g.fill();
  g.beginPath();g.rect(X(Wk.x-Wk.w/2),Y(Wk.y0),Wk.w*RS,(Wk.y1+0.02-Wk.y0)*RS);g.ellipse(X(P.cx),Y(P.cy),P.rx*RS,P.ry*RS,0,0,7);g.clip();
  g.strokeStyle='rgba(150,134,98,.38)';g.lineWidth=Math.max(1,RS*0.012);
  {const cw=0.2,ch=0.12;let row=0;for(let y=Wk.y0;y<Wk.y1+0.1;y+=ch,row++){g.beginPath();g.moveTo(X(Wk.x-Wk.w/2),Y(y));g.lineTo(X(Wk.x+Wk.w/2),Y(y));g.stroke();for(let x=Wk.x-Wk.w/2+(row%2?cw/2:0);x<Wk.x+Wk.w/2;x+=cw){g.beginPath();g.moveTo(X(x),Y(y));g.lineTo(X(x),Y(y+ch));g.stroke();}}}
  for(const k of [0.9,0.82]){plazaP(k);g.stroke();}
  for(let a=0;a<6.283;a+=0.2){g.beginPath();g.moveTo(X(P.cx+Math.cos(a)*P.rx*0.82),Y(P.cy+Math.sin(a)*P.ry*0.82));g.lineTo(X(P.cx+Math.cos(a)*P.rx*1.0),Y(P.cy+Math.sin(a)*P.ry*1.0));g.stroke();}
  for(let k=0;k<50;k++){const p=pt();g.fillStyle=rng()<0.5?'rgba(255,255,255,.12)':'rgba(120,100,60,.10)';g.fillRect(p[0],p[1],RS*0.05,RS*0.03);}
  g.restore();
  g.save();g.strokeStyle='#b6aa8a';g.lineWidth=Math.max(1.5,RS*0.04);walkP();g.stroke();plazaP();g.stroke();g.restore();
  /* flower bed ring inside the circle */
  g.save();g.beginPath();g.ellipse(X(P.cx),Y(P.cy),P.rx*0.74*RS,P.ry*0.74*RS,0,0,7);g.fillStyle='#7fae58';g.fill();g.strokeStyle='#bdb8a6';g.lineWidth=Math.max(1.5,RS*0.05);g.stroke();
  g.save();g.clip();for(let k=0;k<26;k++){const a=rng()*6.283,rr=0.3+rng()*0.7;soft(X(P.cx+Math.cos(a)*P.rx*0.7*rr),Y(P.cy+Math.sin(a)*P.ry*0.7*rr),RS*0.3,RS*0.12,rng()<0.5?'176,222,120':'70,130,56',0.3);}
  for(let k=0;k<150;k++){const a=rng()*6.283,rr=Math.sqrt(rng())*0.7;TH.ell(g,X(P.cx+Math.cos(a)*P.rx*rr),Y(P.cy+Math.sin(a)*P.ry*rr),RS*0.014,RS*0.011,['#f4a6cb','#e0483a','#f6efe0','#f2c230','#b070d8'][k%5]);}g.restore();g.restore();
  /* zebra crossing where the walk meets the lot's drive lane */
  g.fillStyle='rgba(246,244,234,.95)';for(let i=0;i<7;i++){const bx=Wk.x-Wk.w/2+0.05+i*(Wk.w-0.1)/7;g.fillRect(X(bx),Y(Wk.y1+0.06),RS*(Wk.w-0.1)/7*0.58,RS*0.62);}
  if(TR)campusDrawTrack(g,TR,X,Y,RS,mulberry(8123));                                                          /* train loop: track only */
  /* ---------- 5. OBJECTS ---------- */
  const objs=[],tally={};const add=(k,x,y,s,extra)=>{const o=Object.assign({k,x,y,s:s||1,v:Math.floor(rng()*1000)},extra||{});o.layer=o.layer||M.layerOf(x,y);objs.push(o);tally[k]=(tally[k]||0)+1;return o;};
  /* forest */
  const cand=[];for(let gy=F.y0-0.9;gy<F.y1+0.9;gy+=0.2)for(let gx=F.x0-0.9;gx<F.x1+0.9;gx+=0.31)cand.push([gx+(rng()-0.5)*0.4,gy+(rng()-0.5)*0.26]);
  for(let i=cand.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[cand[i],cand[j]]=[cand[j],cand[i]];}
  const cell=0.55,hash=new Map(),hk=(a,b)=>a+','+b,sepX=0.43,sepY=0.26;
  const free=(x,y)=>{const cx=Math.floor(x/cell),cy=Math.floor(y/cell);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const a=hash.get(hk(cx+i,cy+j));if(a)for(const q of a){const dx=(x-q[0])/sepX,dy=(y-q[1])/sepY;if(dx*dx+dy*dy<1)return false;}}return true;};
  const trees=[];
  for(const [x,y] of cand){
    if(M.hexNear(x,y,1.13)||M.inPlot(x,y)||M.inLot(x,y,0.5)||M.inPlaza(x,y,0.5)||M.inWalk(x,y,0.55)||M.inPond(x,y,0.5)||M.inLake(x,y,0.5)||M.medBlock(x,y,0.4))continue;
    let dh=1e9;for(const h of M.hexes){const d=Math.hypot(x-h.x,(y-h.y)*1.4);if(d<dh)dh=d;}dh-=0.95;
    let p=1;if(dh<1.4)p*=0.5+0.5*Math.max(0,dh)/1.4;const dl=M.inLot(x,y,5)?cmDistPoly(M.lot,x,y):9;if(dl<1.5)p*=0.55+0.45*(dl-0.5)/1.0;
    if(M.inMeadow(x,y))p*=0.05;if(rng()>p)continue;if(!free(x,y))continue;
    const cx=Math.floor(x/cell),cy=Math.floor(y/cell),kk=hk(cx,cy);(hash.get(kk)||hash.set(kk,[]).get(kk)).push([x,y]);
    const ty=(y-F.y0)/M.FH,reg=ty<0.33?'top':ty<0.66?'mid':'bottom',w=Object.assign({},CAMPUS_REGION[reg]),cl=0.5+0.5*Math.sin(x*0.55+Math.cos(y*0.4)*1.8)*Math.cos(y*0.35-x*0.2);
    const far=Math.min(1,Math.max(0,(Math.hypot((x-(M.G.center?M.G.center[0]:9.0))/1.0,(y-(M.G.center?M.G.center[1]:3.9))*1.5)-7)/12));          /* 0 near the park -> 1 deep forest */
    ['spruce','fir','youngSpruce'].forEach(k=>w[k]*=(0.55+1.3*cl)*(1+1.6*far));['linden','appleTree','beech','birch','maple'].forEach(k=>w[k]*=(0.55+1.3*(1-cl))*(1-0.55*far)*(k==='maple'?1-0.7*far:1));
    const bigS=(1.2+rng()*0.55)*(0.86+0.14*Math.min(1,Math.max(0,dh)/1.5));
    trees.push(add(cmPick(w,rng),x,y,bigS,{nat:true}));
    if(rng()<0.5){const ux=x+(rng()-0.5)*0.5,uy=y+0.1+rng()*0.1;if(!M.inPlot(ux,uy))add(CAMPUS_UNDER[Math.floor(rng()*CAMPUS_UNDER.length)],ux,uy,0.85+rng()*0.4,{nat:true});}
  }
  /* meadow dressing */
  M.meadows.forEach(m=>{for(let k=0;k<34;k++){const a=rng()*6.283,rr=Math.sqrt(rng())*0.92,x=m[0]+Math.cos(a)*m[2]*rr,y=m[1]+Math.sin(a)*m[3]*rr;if(M.hexNear(x,y,1.1)||M.inPlot(x,y)||M.inLot(x,y,0.4))continue;add(['wildflowers','sunflowers','grassTuft','wildflowers','fern','geraniumBush'][k%6],x,y,0.85+rng()*0.5,{nat:true});}
    for(let k=0;k<3;k++){const a=rng()*6.283,rr=0.3+rng()*0.55;add(['appleTree','birch','appleTree'][k],m[0]+Math.cos(a)*m[2]*rr,m[1]+Math.sin(a)*m[3]*rr,1.1+rng()*0.3);}});
  /* lake dressing: reeds + stones round the shore, ducks on the water */
  if(M.lake){let n=0;cmWalk(M.lake,0.55,(x,y,nx,ny)=>{if(rng()<0.42)return;const ins=cmInPoly(M.lake,x+nx*0.1,y+ny*0.1)?1:-1,px=x-nx*ins*0.06+(rng()-0.5)*0.1,py=y-ny*ins*0.06;if(M.hexNear(px,py,1.02)||M.nearBridge(px,py,0.5))return;if(n++%4===0)add('stones',x+nx*ins*-0.22,y+ny*ins*-0.22,0.6+rng()*0.25);else add('reeds',px,py,0.85+rng()*0.4);},true);
    for(let k=0;k<7;k++){let x,y,t=0;const bb=M.lake.reduce((a,p)=>[Math.min(a[0],p[0]),Math.max(a[1],p[0]),Math.min(a[2],p[1]),Math.max(a[3],p[1])],[1e9,-1e9,1e9,-1e9]);do{x=bb[0]+rng()*(bb[1]-bb[0]);y=bb[2]+rng()*(bb[3]-bb[2]);t++;}while((!cmInPoly(M.lake,x,y)||cmDistPoly(M.lake,x,y)<0.5||M.nearBridge(x,y,0.7))&&t<300);if(t<300)add('duck',x,y,1.0);}}
  /* lot: planted medians, lamps, north hedge line, cars */
  M.med.forEach((m,i)=>{let j=0;cmWalk([m.a,m.b],0.95,(x,y)=>{add(['youngSpruce','appleTree','birch'][(i+j++)%3],x,y,0.72,{layer:'front'});add(j%2?'hedge':'geraniumBush',x+0.02,y+0.45,0.55,{layer:'front'});});
    [m.a,m.b,[(m.a[0]+m.b[0])/2,(m.a[1]+m.b[1])/2]].forEach((q,qi)=>add('lampPost',q[0]+(qi===2?0:0),q[1]+(qi===0?-0.05:0.0),0.95,{layer:'front'}));});
  {let n=0;cmWalk(M.lot,0.5,(x,y,nx,ny)=>{if(cmInPoly(M.lot,x+nx*0.15,y+ny*0.15)){nx=-nx;ny=-ny;}if(ny>-0.25)return;const px=x+nx*0.34,py=y+ny*0.34;if(Math.abs(px-Wk.x)<0.95&&py>Wk.y0)return;if(M.hexNear(px,py,1.1))return;
    add('hedge',px,py,0.78+rng()*0.2);if(++n%5===0)add(['youngSpruce','birch','appleTree'][n%3],px+nx*0.28,py+ny*0.28,0.85);},true);}
  const lay=campusLotLayout(M,mulberry(99));lay.stalls.forEach(s=>{if(rng()<0.42)objs.push(Object.assign({car:true,layer:'front',len:0.34+rng()*0.06,wid:0.17,col:CAMPUS_CAR_COLS[Math.floor(rng()*CAMPUS_CAR_COLS.length)]},s)),tally.car=(tally.car||0)+1;});
  /* walk + circle */
  for(const sx of [-1,1]){for(let y=Wk.y0+0.4;y<P.cy-P.ry-0.12;y+=0.5)if(!(TR&&TR.zone&&y>TR.zone.y0&&y<TR.zone.y1))add('hedge',Wk.x+sx*0.52,y,0.55,{layer:'front'});for(let y=P.cy+P.ry+0.12;y<Wk.y1-0.04;y+=0.5)add('hedge',Wk.x+sx*0.52,y,0.55,{layer:'front'});
    add('lampPost',Wk.x+sx*0.66,(TR&&TR.lampY)?TR.lampY:(Wk.lamp0||8.05),1.0,{layer:'front'});add('lampPost',Wk.x+sx*0.66,Wk.lamp1||10.25,1.0,{layer:'front'});}
  for(let k=0;k<10;k++){const a=k/10*6.283+0.3;add('geraniumBush',P.cx+Math.cos(a)*P.rx*0.69,P.cy+Math.sin(a)*P.ry*0.69,0.62,{layer:'front'});}
  add('fountainBig',P.cx,P.cy,1,{layer:'front',fu:0.58/7.2});
  /* clearings, applied AFTER generation so the forest everywhere else is exactly the same: the added station hex (both maps) and the train corridor (train map) */
  {let removed=0;for(let i=objs.length-1;i>=0;i--){const o=objs[i];if(!o.nat)continue;if(M.stationNear(o.x,o.y,1.13)||(TR&&TR.clear(o.x,o.y))||M.nearBridge(o.x,o.y,0.55)){tally[o.k]--;objs.splice(i,1);removed++;}}
   for(let i=trees.length-1;i>=0;i--)if(objs.indexOf(trees[i])<0)trees.splice(i,1);tally._cleared=removed;}
  M.bridges.forEach(b=>objs.push({bridge:true,b,x:(b.a[0]+b.b[0])/2,y:(b.a[1]+b.b[1])/2+0.05,k:'bridge'}));
  if(TR&&TR.tun)objs.push({tunnel:true,train:TR,x:TR.tun.x,y:TR.tun.yc+0.5,k:'tunnel'});
  const inlays=M.plots.map((p,i)=>campusBakePlot(M,p,RS,7000+i*31));
  const sprites=objs.map(o=>campusObjectSprite(o,R));
  const camp={ground:gC,sprites,inlays,w:Wpx,h:Hpx,ox:X(0),oy:Y(0),R,scale:S,
    hexes:M.hexes.concat(M.station?[M.station]:[]).map(h=>({u:h.u,r:h.r,tone:h.tone,x:h.x*RS,y:h.y*RS})),            /* centres relative to the anchor (hex u=0,r=0) */
    entrance:{x:M.ent.x*RS,y:M.ent.y*RS,u:M.ent.u,r:M.ent.r},
    station:M.station?{u:M.station.u,r:M.station.r,x:M.station.x*RS,y:M.station.y*RS}:null,
    train:TR?{track:TR.S.map(s=>[Math.round(s.x*RS*10)/10,Math.round(s.y*RS*10)/10]),lengthR:TR.len,tunnel:TR.tun?{x:TR.tun.x*RS,y:TR.tun.yc*RS,portalHalfSpan:0.75*RS,deckHeight:TR.tun.h*RS}:null,underHex:TR.underHex||null}:null,
    plaza:{x:P.cx*RS-0+0,y:P.cy*RS,rx:P.rx*RS,ry:P.ry*RS},walk:{x:Wk.x*RS,y0:Wk.y0*RS,y1:Wk.y1*RS,w:Wk.w*RS},
    landPlan:M.G.tiling.map(([n,cs])=>({shape:n.replace('m',''),mirror:/m$/.test(n),hexes:cs.map(c=>({u:c[0],r:c[1]}))})),
    stats:{inlays:inlays.map(q=>q.id+':'+q.count).join(', '),trees:trees.length,objects:objs.length,tally,ms:Math.round(performance.now()-t0),back:objs.filter(o=>o.layer==='back').length,front:objs.filter(o=>o.layer==='front').length}};
  CAMPUS_CACHE={[key]:camp};return camp;
}
/* anchor (ax,ay) = screen position of park hex (u=0,r=0); lands sit at ax+u*sqrt3*R, ay+r*0.87*R */
function drawCampusGround(ctx,ax,ay,c){ctx.drawImage(c.ground,ax-c.ox/c.scale,ay-c.oy/c.scale,c.w/c.scale,c.h/c.scale);}
function drawCampusBack(ctx,ax,ay,c){ctx.drawImage(c.back,ax-c.ox,ay-c.oy);}
function drawCampusInlays(ctx,ax,ay,c){c.inlays.forEach(q=>ctx.drawImage(q.canvas,ax-q.ox/c.scale,ay-q.oy/c.scale,q.w/c.scale,q.h/c.scale));}
function drawCampusFront(ctx,ax,ay,c){ctx.drawImage(c.front,ax-c.ox,ay-c.oy);}
function campusHexPos(c,u,r){return{x:u*CW3*c.R*c.scale,y:r*0.87*c.R*c.scale};}
function campusFootprint(){const F=CAMPUS_GEO.frame;return{w:F.x1-F.x0,h:F.y1-F.y0,x0:F.x0,y0:F.y0};}

/* ---- a wooden footbridge across the water: raised plank deck on piles, with handrails (drawn on the back layer; the ends tuck under the lands) ---- */
function campusDrawBridge(c,B,X,Y,RS){
  const K=0.58,w=B.w,h=0.075,ax=B.a[0],ay=B.a[1]/K,bx=B.b[0],by=B.b[1]/K,L=Math.hypot(bx-ax,by-ay),dx=(bx-ax)/L,dy=(by-ay)/L,nx=-dy,ny=dx;
  const P=(s,t,z)=>[X(ax+dx*s+nx*t),Y((ay+dy*s+ny*t)*K-z)],s0=-0.12,s1=L+0.12;
  const poly=(pts,fill,stroke,lw)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}};
  const line=(a,b,col,lw)=>{c.strokeStyle=col;c.lineWidth=lw;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();};
  c.save();c.lineJoin='round';c.lineCap='round';
  poly([P(s0,-w/2-0.05,0),P(s1,-w/2-0.05,0),P(s1,w/2+0.05,0),P(s0,w/2+0.05,0)].map(p=>[p[0]+RS*0.012,p[1]+RS*0.03]),'rgba(10,40,60,.32)');
  const nP=Math.max(3,Math.round(L/0.55));for(let k=0;k<=nP;k++){const s=0.1+(L-0.2)*k/nP;[-1,1].forEach(sg=>{line(P(s,sg*w*0.38,h),P(s,sg*w*0.38,-0.02),'#4a3018',Math.max(1.4,RS*0.032));});}
  poly([P(s0,-w/2,h-0.035),P(s1,-w/2,h-0.035),P(s1,w/2,h-0.035),P(s0,w/2,h-0.035)],'#5a3a20');
  poly([P(s0,-w/2,h),P(s1,-w/2,h),P(s1,w/2,h),P(s0,w/2,h)],'#a8723e','#6a4424',Math.max(1,RS*0.01));
  const np=Math.round((s1-s0)/0.065);for(let k=1;k<np;k++){const s=s0+(s1-s0)*k/np;line(P(s,-w/2,h),P(s,w/2,h),k%2?'rgba(70,42,18,.45)':'rgba(255,230,180,.22)',Math.max(0.8,RS*0.008));}
  line(P(s0,-w*0.17,h),P(s1,-w*0.17,h),'rgba(255,236,190,.18)',Math.max(1,RS*0.016));
  [-1,1].forEach(sg=>{const t=sg*(w/2-0.015),np2=Math.max(2,Math.round((s1-s0)/0.2));for(let k=0;k<=np2;k++){const s=s0+(s1-s0)*k/np2;line(P(s,t,h),P(s,t,h+0.1),'#6a4424',Math.max(1.2,RS*0.022));}
    line(P(s0,t,h+0.1),P(s1,t,h+0.1),'#7c5230',Math.max(1.3,RS*0.026));line(P(s0,t,h+0.05),P(s1,t,h+0.05),'#6a4424',Math.max(1,RS*0.014));});
  c.restore();
}


return {bake:bakeCampus,drawGround:drawCampusGround,drawInlays:drawCampusInlays,clear:()=>{CAMPUS_CACHE={};}};
})();
let previous = null;
return { get(hasTrain) { const pack = hasTrain ? train : plain; if (previous && previous !== pack) previous.clear(); previous = pack; return pack; } };
})();
