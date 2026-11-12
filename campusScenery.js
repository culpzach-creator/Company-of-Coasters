/* Supplied campus artwork, adapted for depth-sorted scenic rendering. */
const CAMPUS_SCENERY = (() => {
const small = (() => {

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
const CAMPUS_GEO={"frame":{"x0":-9.831,"x1":26.223,"y0":-3.909,"y1":17.001},"hexes":[[3.5,0,"g"],[2.0,1,"g"],[3.0,1,"g"],[4.0,1,"g"],[2.5,2,"g"],[3.5,2,"g"],[4.5,2,"g"],[1.0,3,"g"],[2.0,3,"g"],[3.0,3,"g"],[4.0,3,"g"],[0.5,4,"g"],[1.5,4,"g"],[2.5,4,"g"],[3.5,4,"g"],[4.5,4,"o"],[5.5,4,"o"],[6.5,4,"o"],[1.0,5,"g"],[2.0,5,"g"],[3.0,5,"g"],[4.0,5,"o"],[5.0,5,"o"],[6.0,5,"o"],[7.0,5,"g"],[8.0,5,"g"],[9.0,5,"g"],[1.5,6,"g"],[2.5,6,"g"],[3.5,6,"o"],[4.5,6,"o"],[5.5,6,"o"],[6.5,6,"g"],[7.5,6,"g"],[8.5,6,"g"],[4.0,7,"o"],[5.0,7,"o"],[6.0,7,"o"],[7.0,7,"g"],[8.0,7,"g"],[4.5,8,"e"],[7.5,8,"t"]],"lot":[[22.094,14.09],[21.909,13.444],[20.851,12.495],[16.461,9.306],[15.932,9.164],[15.007,9.225],[11.278,10.234],[9.639,10.557],[9.612,10.698],[5.619,10.719],[3.583,10.537],[2.605,10.315],[0.489,9.608],[-0.568,9.427],[-1.018,9.447],[-1.706,9.75],[-2.393,10.254],[-4.852,12.576],[-5.672,13.161],[-6.095,13.746],[-6.095,13.968],[-5.91,14.211],[-5.011,14.816],[-3.028,15.503],[-1.626,15.886],[0.912,16.27],[4.694,16.391],[14.108,16.229],[17.016,16.088],[18.841,15.906],[19.819,15.725],[20.771,15.361],[21.856,14.554]],"medians":[{"a":[0.308,11.055],"b":[-2.61,14.185]},{"a":[2.612,11.64],"b":[0.909,14.973]},{"a":[5.501,11.64],"b":[4.799,15.552]},{"a":[9.955,11.499],"b":[10.871,15.541]},{"a":[13.072,11.055],"b":[16.044,14.963]},{"a":[15.423,10.288],"b":[19.961,14.195]}],"entrance":[4.5,8],"plaza":{"cx":7.794,"cy":9.063,"rx":1.12,"ry":0.76},"walk":{"x":7.794,"y0":7.41,"y1":10.698,"w":0.72},"hub":[7.338,3.172],"lake":[[15.883,3.587],[14.665,3.499],[12.942,3.499],[12.493,3.296],[12.022,2.776],[11.678,2.688],[9.426,2.724],[8.553,2.812],[8.472,2.732],[8.518,2.433],[9.07,1.799],[9.024,1.305],[8.817,0.953],[8.61,0.759],[7.461,0.055],[7.231,-0.333],[7.3,-0.579],[7.541,-0.782],[7.84,-0.87],[8.346,-0.888],[10.207,-0.764],[10.759,-0.87],[11.563,-1.187],[12.436,-1.24],[13.815,-1.081],[13.964,-1.002],[14.251,-0.641],[14.734,-0.465],[15.125,-0.43],[15.837,-0.553],[16.113,-0.5],[16.285,-0.262],[16.377,0.231],[16.377,0.988],[16.216,1.781],[16.193,2.398],[16.492,3.19],[16.228,3.499]],"meadows":[[-6.9,6.4,2.3,1.15],[21.1,5.6,2.6,1.2],[-8.1,11.0,1.6,0.9],[20.9,13.2,2.5,1.1],[25.1,12.8,1.8,0.9],[3.0,-2.3,2.0,0.8],[22.0,-1.4,2.0,0.9]],"tiling":[["Cm",[[3.5,0],[4.0,1],[3.0,1],[2.0,1],[4.5,2],[3.5,2],[2.5,2],[4.0,3]]],["A",[[1.0,3],[2.0,3],[3.0,3],[0.5,4],[1.5,4],[2.5,4],[3.5,4],[1.0,5],[2.0,5],[3.0,5],[1.5,6],[2.5,6]]],["B",[[4.5,4],[5.5,4],[6.5,4],[4.0,5],[5.0,5],[6.0,5],[3.5,6],[4.5,6],[5.5,6],[4.0,7],[5.0,7],[6.0,7]]],["D",[[7.0,5],[8.0,5],[9.0,5],[6.5,6],[7.5,6],[8.5,6],[7.0,7],[8.0,7]]]]};
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
  /* meadows: open clearings that break up the forest (ellipses cx,cy,rx,ry) */
  const meadows=G.meadows||[[-5.2,6.4,2.3,1.15],[22.8,5.6,2.6,1.2],[-8.6,13.6,2.2,1.0],[22.6,13.2,2.5,1.1],[26.8,12.8,1.8,0.9],[14.6,-0.9,1.9,0.8]];
  const inMeadow=(x,y)=>meadows.some(m=>((x-m[0])/m[2])**2+((y-m[1])/m[3])**2<1);
  const inPlot=(x,y,s)=>plots.some(p=>p.has(x,y,s||1.04));
  /* layer rule: an object is FRONT (drawn after the park) only when it stands south of every park hex around it */
  const layerOf=(x,y)=>{let my=-1e9,any=false;for(const h of hexes){if(Math.abs(x-h.x)<1.5){any=true;if(h.y>my)my=h.y;}}return any?(y>my+0.12?'front':'back'):(y>8.35?'front':'back');};
  CAMPUS_MODEL={G,F,hexes,station,stationNear,ent,plots,inPlot,lot,pond,lake,inLake,P,W,med,medBlock,hexNear,inPlaza,inWalk,inLot,inPond,meadows,inMeadow,layerOf,FW:F.x1-F.x0,FH:F.y1-F.y0};
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
  return{id:plot.id,canvas:cv,ox:X(0),oy:Y(0),w,h,cells:cells.map(c=>({u:c.u,r:c.r})),count:objs.length,objects:objs};
}

const CAMPUS_VARIANT='plain';
function campusObjectSprite(o,R){
  const unit=(o.fu||0.075*(o.s||1))*R;
  return {x:o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>{
    if(o.tunnel){campusDrawTunnel(ctx, o.train, v=>x+(v-o.x)*R, v=>y+(v-o.y)*R, R);return;}
    if(o.car){cmCar(ctx,v=>x+(v-o.x)*R,v=>y+(v-o.y)*R,R,o);return;}
    const asset=CAMPUS_ASSETS[o.k];
    if(!asset)throw new Error(`Missing campus scenery asset: ${o.k}`);
    asset.draw(ctx,x,y,unit,o.v);
  }};
}

/* ===== BAKE ===== */
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
  if(M.lake){let n=0;cmWalk(M.lake,0.55,(x,y,nx,ny)=>{if(rng()<0.42)return;const ins=cmInPoly(M.lake,x+nx*0.1,y+ny*0.1)?1:-1,px=x-nx*ins*0.06+(rng()-0.5)*0.1,py=y-ny*ins*0.06;if(M.hexNear(px,py,1.02))return;if(n++%4===0)add('stones',x+nx*ins*-0.22,y+ny*ins*-0.22,0.6+rng()*0.25);else add('reeds',px,py,0.85+rng()*0.4);},true);
    for(let k=0;k<7;k++){let x,y,t=0;const bb=M.lake.reduce((a,p)=>[Math.min(a[0],p[0]),Math.max(a[1],p[0]),Math.min(a[2],p[1]),Math.max(a[3],p[1])],[1e9,-1e9,1e9,-1e9]);do{x=bb[0]+rng()*(bb[1]-bb[0]);y=bb[2]+rng()*(bb[3]-bb[2]);t++;}while((!cmInPoly(M.lake,x,y)||cmDistPoly(M.lake,x,y)<0.5)&&t<300);if(t<300)add('duck',x,y,1.0);}}
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
  {let removed=0;for(let i=objs.length-1;i>=0;i--){const o=objs[i];if(!o.nat)continue;if(M.stationNear(o.x,o.y,1.13)||(TR&&TR.clear(o.x,o.y))){tally[o.k]--;objs.splice(i,1);removed++;}}
   for(let i=trees.length-1;i>=0;i--)if(objs.indexOf(trees[i])<0)trees.splice(i,1);tally._cleared=removed;}
  if(TR&&TR.tun)objs.push({tunnel:true,train:TR,x:TR.tun.x,y:TR.tun.yc+0.5,k:'tunnel',fu:2});
  const inlays=M.plots.map((p,i)=>campusBakePlot(M,p,RS,7000+i*31));
  const sprites=objs.concat(...inlays.map(inlay=>inlay.objects)).map(o=>campusObjectSprite(o,R));
  const camp={ground:gC,inlays,sprites,w:Wpx,h:Hpx,ox:X(0),oy:Y(0),R,scale:S,
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


return {bake:bakeCampus,drawGround:drawCampusGround,drawInlays:drawCampusInlays,clear:()=>{CAMPUS_CACHE={};}};
})();
const smallTrain = (() => {

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
const CAMPUS_GEO={"frame":{"x0":-9.831,"x1":26.223,"y0":-3.909,"y1":17.001},"hexes":[[3.5,0,"g"],[2.0,1,"g"],[3.0,1,"g"],[4.0,1,"g"],[2.5,2,"g"],[3.5,2,"g"],[4.5,2,"g"],[1.0,3,"g"],[2.0,3,"g"],[3.0,3,"g"],[4.0,3,"g"],[0.5,4,"g"],[1.5,4,"g"],[2.5,4,"g"],[3.5,4,"g"],[4.5,4,"o"],[5.5,4,"o"],[6.5,4,"o"],[1.0,5,"g"],[2.0,5,"g"],[3.0,5,"g"],[4.0,5,"o"],[5.0,5,"o"],[6.0,5,"o"],[7.0,5,"g"],[8.0,5,"g"],[9.0,5,"g"],[1.5,6,"g"],[2.5,6,"g"],[3.5,6,"o"],[4.5,6,"o"],[5.5,6,"o"],[6.5,6,"g"],[7.5,6,"g"],[8.5,6,"g"],[4.0,7,"o"],[5.0,7,"o"],[6.0,7,"o"],[7.0,7,"g"],[8.0,7,"g"],[4.5,8,"e"],[7.5,8,"t"]],"lot":[[22.094,14.09],[21.909,13.444],[20.851,12.495],[16.461,9.306],[15.932,9.164],[15.007,9.225],[11.278,10.234],[9.639,10.557],[9.612,10.698],[5.619,10.719],[3.583,10.537],[2.605,10.315],[0.489,9.608],[-0.568,9.427],[-1.018,9.447],[-1.706,9.75],[-2.393,10.254],[-4.852,12.576],[-5.672,13.161],[-6.095,13.746],[-6.095,13.968],[-5.91,14.211],[-5.011,14.816],[-3.028,15.503],[-1.626,15.886],[0.912,16.27],[4.694,16.391],[14.108,16.229],[17.016,16.088],[18.841,15.906],[19.819,15.725],[20.771,15.361],[21.856,14.554]],"medians":[{"a":[0.308,11.055],"b":[-2.61,14.185]},{"a":[2.612,11.64],"b":[0.909,14.973]},{"a":[5.501,11.64],"b":[4.799,15.552]},{"a":[9.955,11.499],"b":[10.871,15.541]},{"a":[13.072,11.055],"b":[16.044,14.963]},{"a":[15.423,10.288],"b":[19.961,14.195]}],"entrance":[4.5,8],"plaza":{"cx":7.794,"cy":9.063,"rx":1.12,"ry":0.76},"walk":{"x":7.794,"y0":7.41,"y1":10.698,"w":0.72},"hub":[7.338,3.172],"lake":[[15.883,3.587],[14.665,3.499],[12.942,3.499],[12.493,3.296],[12.022,2.776],[11.678,2.688],[9.426,2.724],[8.553,2.812],[8.472,2.732],[8.518,2.433],[9.07,1.799],[9.024,1.305],[8.817,0.953],[8.61,0.759],[7.461,0.055],[7.231,-0.333],[7.3,-0.579],[7.541,-0.782],[7.84,-0.87],[8.346,-0.888],[10.207,-0.764],[10.759,-0.87],[11.563,-1.187],[12.436,-1.24],[13.815,-1.081],[13.964,-1.002],[14.251,-0.641],[14.734,-0.465],[15.125,-0.43],[15.837,-0.553],[16.113,-0.5],[16.285,-0.262],[16.377,0.231],[16.377,0.988],[16.216,1.781],[16.193,2.398],[16.492,3.19],[16.228,3.499]],"meadows":[[-6.9,6.4,2.3,1.15],[21.1,5.6,2.6,1.2],[-8.1,11.0,1.6,0.9],[20.9,13.2,2.5,1.1],[25.1,12.8,1.8,0.9],[3.0,-2.3,2.0,0.8],[22.0,-1.4,2.0,0.9]],"tiling":[["Cm",[[3.5,0],[4.0,1],[3.0,1],[2.0,1],[4.5,2],[3.5,2],[2.5,2],[4.0,3]]],["A",[[1.0,3],[2.0,3],[3.0,3],[0.5,4],[1.5,4],[2.5,4],[3.5,4],[1.0,5],[2.0,5],[3.0,5],[1.5,6],[2.5,6]]],["B",[[4.5,4],[5.5,4],[6.5,4],[4.0,5],[5.0,5],[6.0,5],[3.5,6],[4.5,6],[5.5,6],[4.0,7],[5.0,7],[6.0,7]]],["D",[[7.0,5],[8.0,5],[9.0,5],[6.5,6],[7.5,6],[8.5,6],[7.0,7],[8.0,7]]]]};
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
  /* meadows: open clearings that break up the forest (ellipses cx,cy,rx,ry) */
  const meadows=G.meadows||[[-5.2,6.4,2.3,1.15],[22.8,5.6,2.6,1.2],[-8.6,13.6,2.2,1.0],[22.6,13.2,2.5,1.1],[26.8,12.8,1.8,0.9],[14.6,-0.9,1.9,0.8]];
  const inMeadow=(x,y)=>meadows.some(m=>((x-m[0])/m[2])**2+((y-m[1])/m[3])**2<1);
  const inPlot=(x,y,s)=>plots.some(p=>p.has(x,y,s||1.04));
  /* layer rule: an object is FRONT (drawn after the park) only when it stands south of every park hex around it */
  const layerOf=(x,y)=>{let my=-1e9,any=false;for(const h of hexes){if(Math.abs(x-h.x)<1.5){any=true;if(h.y>my)my=h.y;}}return any?(y>my+0.12?'front':'back'):(y>8.35?'front':'back');};
  CAMPUS_MODEL={G,F,hexes,station,stationNear,ent,plots,inPlot,lot,pond,lake,inLake,P,W,med,medBlock,hexNear,inPlaza,inWalk,inLot,inPond,meadows,inMeadow,layerOf,FW:F.x1-F.x0,FH:F.y1-F.y0};
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
  return{id:plot.id,canvas:cv,ox:X(0),oy:Y(0),w,h,cells:cells.map(c=>({u:c.u,r:c.r})),count:objs.length,objects:objs};
}

const CAMPUS_VARIANT='train';
/* ===== TRAIN LOOP: the park railway's track + the tunnel that carries it under the entrance walk (TRACK ONLY, no train) ===== */
const CAMPUS_TRAIN_DATA={"pts":[[13.861,6.96],[13.905,6.96],[13.955,6.961],[14.005,6.962],[14.055,6.964],[14.1,6.965],[14.15,6.967],[14.2,6.969],[14.245,6.971],[14.295,6.973],[14.341,6.974],[14.39,6.977],[14.439,6.978],[14.488,6.979],[14.538,6.979],[14.587,6.98],[14.637,6.979],[14.686,6.979],[14.735,6.977],[14.784,6.975],[14.833,6.973],[14.883,6.969],[14.932,6.965],[14.981,6.96],[15.03,6.955],[15.078,6.948],[15.127,6.94],[15.176,6.932],[15.225,6.922],[15.273,6.912],[15.321,6.9],[15.37,6.888],[15.418,6.875],[15.466,6.86],[15.514,6.845],[15.562,6.829],[15.61,6.812],[15.657,6.795],[15.705,6.777],[15.752,6.758],[15.799,6.739],[15.846,6.72],[15.893,6.7],[15.939,6.681],[15.985,6.661],[16.031,6.642],[16.077,6.621],[16.123,6.601],[16.168,6.579],[16.213,6.558],[16.257,6.535],[16.302,6.512],[16.346,6.489],[16.39,6.465],[16.433,6.44],[16.477,6.415],[16.52,6.39],[16.563,6.364],[16.606,6.339],[16.649,6.313],[16.691,6.287],[16.734,6.26],[16.776,6.234],[16.818,6.207],[16.86,6.18],[16.903,6.153],[16.945,6.126],[16.986,6.099],[17.028,6.071],[17.07,6.043],[17.111,6.015],[17.152,5.986],[17.192,5.957],[17.233,5.927],[17.273,5.897],[17.312,5.866],[17.351,5.835],[17.389,5.803],[17.427,5.77],[17.464,5.736],[17.5,5.701],[17.535,5.666],[17.57,5.63],[17.603,5.593],[17.636,5.555],[17.668,5.517],[17.698,5.477],[17.728,5.437],[17.756,5.396],[17.784,5.354],[17.81,5.311],[17.835,5.268],[17.859,5.224],[17.881,5.179],[17.902,5.134],[17.922,5.088],[17.94,5.042],[17.958,4.995],[17.973,4.947],[17.988,4.899],[18.001,4.851],[18.013,4.803],[18.024,4.754],[18.034,4.705],[18.043,4.656],[18.05,4.606],[18.056,4.556],[18.061,4.507],[18.066,4.457],[18.069,4.407],[18.071,4.357],[18.072,4.307],[18.072,4.257],[18.071,4.207],[18.069,4.157],[18.067,4.107],[18.064,4.057],[18.06,4.007],[18.056,3.958],[18.052,3.908],[18.047,3.858],[18.041,3.808],[18.036,3.759],[18.03,3.709],[18.024,3.659],[18.017,3.61],[18.01,3.56],[18.003,3.511],[17.996,3.461],[17.988,3.412],[17.98,3.362],[17.972,3.313],[17.964,3.264],[17.955,3.215],[17.946,3.165],[17.937,3.116],[17.928,3.067],[17.918,3.018],[17.909,2.969],[17.899,2.92],[17.889,2.871],[17.879,2.822],[17.868,2.773],[17.858,2.724],[17.848,2.675],[17.837,2.626],[17.827,2.577],[17.816,2.529],[17.805,2.48],[17.794,2.431],[17.783,2.382],[17.772,2.334],[17.761,2.285],[17.749,2.236],[17.738,2.187],[17.726,2.139],[17.715,2.09],[17.703,2.042],[17.691,1.993],[17.679,1.945],[17.667,1.896],[17.654,1.848],[17.642,1.799],[17.629,1.751],[17.617,1.702],[17.604,1.654],[17.591,1.606],[17.578,1.557],[17.565,1.509],[17.552,1.461],[17.539,1.413],[17.525,1.365],[17.512,1.316],[17.499,1.268],[17.485,1.22],[17.472,1.172],[17.458,1.124],[17.444,1.076],[17.431,1.028],[17.417,0.98],[17.403,0.932],[17.389,0.884],[17.375,0.836],[17.361,0.788],[17.347,0.74],[17.332,0.692],[17.318,0.644],[17.304,0.596],[17.289,0.548],[17.275,0.5],[17.26,0.452],[17.246,0.404],[17.231,0.357],[17.216,0.309],[17.201,0.261],[17.187,0.213],[17.172,0.166],[17.157,0.118],[17.142,0.07],[17.127,0.023],[17.111,-0.025],[17.096,-0.073],[17.081,-0.12],[17.066,-0.168],[17.051,-0.216],[17.036,-0.263],[17.02,-0.311],[17.005,-0.359],[16.99,-0.406],[16.975,-0.454],[16.96,-0.501],[16.944,-0.549],[16.929,-0.596],[16.912,-0.644],[16.896,-0.691],[16.879,-0.738],[16.861,-0.785],[16.843,-0.831],[16.824,-0.877],[16.803,-0.923],[16.781,-0.968],[16.758,-1.012],[16.733,-1.056],[16.706,-1.098],[16.678,-1.139],[16.648,-1.179],[16.617,-1.218],[16.583,-1.255],[16.548,-1.291],[16.511,-1.325],[16.473,-1.357],[16.434,-1.388],[16.393,-1.417],[16.352,-1.445],[16.309,-1.471],[16.266,-1.496],[16.222,-1.52],[16.177,-1.543],[16.132,-1.564],[16.087,-1.585],[16.041,-1.604],[15.994,-1.623],[15.947,-1.64],[15.9,-1.657],[15.853,-1.673],[15.805,-1.688],[15.757,-1.702],[15.709,-1.715],[15.661,-1.728],[15.612,-1.74],[15.563,-1.751],[15.515,-1.762],[15.466,-1.772],[15.417,-1.782],[15.367,-1.791],[15.318,-1.799],[15.269,-1.807],[15.219,-1.814],[15.17,-1.821],[15.12,-1.828],[15.07,-1.834],[15.021,-1.84],[14.971,-1.845],[14.921,-1.85],[14.872,-1.855],[14.822,-1.859],[14.772,-1.863],[14.722,-1.867],[14.672,-1.871],[14.622,-1.874],[14.572,-1.877],[14.523,-1.88],[14.473,-1.883],[14.423,-1.886],[14.373,-1.888],[14.323,-1.89],[14.273,-1.892],[14.223,-1.894],[14.173,-1.895],[14.123,-1.897],[14.073,-1.898],[14.023,-1.9],[13.973,-1.901],[13.923,-1.902],[13.873,-1.903],[13.823,-1.904],[13.773,-1.906],[13.723,-1.907],[13.673,-1.908],[13.623,-1.91],[13.573,-1.911],[13.523,-1.912],[13.473,-1.913],[13.423,-1.914],[13.373,-1.915],[13.323,-1.916],[13.273,-1.917],[13.223,-1.917],[13.173,-1.917],[13.123,-1.918],[13.073,-1.918],[13.023,-1.918],[12.973,-1.918],[12.923,-1.918],[12.873,-1.918],[12.823,-1.918],[12.773,-1.918],[12.723,-1.918],[12.673,-1.918],[12.623,-1.918],[12.573,-1.918],[12.523,-1.918],[12.473,-1.918],[12.423,-1.918],[12.373,-1.918],[12.323,-1.918],[12.273,-1.918],[12.223,-1.918],[12.173,-1.918],[12.123,-1.918],[12.073,-1.918],[12.023,-1.918],[11.973,-1.918],[11.923,-1.918],[11.873,-1.918],[11.823,-1.918],[11.773,-1.918],[11.723,-1.918],[11.673,-1.918],[11.623,-1.918],[11.573,-1.917],[11.523,-1.917],[11.473,-1.916],[11.423,-1.916],[11.373,-1.915],[11.323,-1.914],[11.273,-1.913],[11.223,-1.912],[11.173,-1.911],[11.123,-1.909],[11.073,-1.908],[11.023,-1.906],[10.973,-1.905],[10.923,-1.903],[10.873,-1.902],[10.823,-1.9],[10.773,-1.898],[10.723,-1.897],[10.673,-1.895],[10.623,-1.893],[10.574,-1.892],[10.524,-1.89],[10.474,-1.888],[10.424,-1.886],[10.374,-1.885],[10.324,-1.883],[10.274,-1.881],[10.224,-1.879],[10.174,-1.877],[10.124,-1.875],[10.074,-1.873],[10.024,-1.871],[9.974,-1.869],[9.924,-1.867],[9.874,-1.865],[9.824,-1.863],[9.774,-1.861],[9.724,-1.859],[9.674,-1.857],[9.624,-1.854],[9.574,-1.852],[9.524,-1.85],[9.474,-1.848],[9.424,-1.845],[9.374,-1.843],[9.325,-1.841],[9.275,-1.839],[9.225,-1.836],[9.175,-1.834],[9.125,-1.832],[9.075,-1.83],[9.025,-1.827],[8.975,-1.825],[8.925,-1.823],[8.875,-1.82],[8.825,-1.818],[8.775,-1.816],[8.725,-1.813],[8.675,-1.811],[8.625,-1.809],[8.575,-1.806],[8.525,-1.804],[8.475,-1.802],[8.426,-1.799],[8.376,-1.797],[8.326,-1.794],[8.276,-1.792],[8.226,-1.79],[8.176,-1.787],[8.126,-1.785],[8.076,-1.782],[8.026,-1.78],[7.976,-1.778],[7.926,-1.775],[7.876,-1.773],[7.826,-1.771],[7.776,-1.768],[7.726,-1.766],[7.676,-1.764],[7.626,-1.761],[7.576,-1.759],[7.527,-1.757],[7.477,-1.755],[7.427,-1.753],[7.377,-1.75],[7.327,-1.748],[7.277,-1.746],[7.227,-1.744],[7.177,-1.742],[7.127,-1.74],[7.077,-1.738],[7.027,-1.736],[6.977,-1.734],[6.927,-1.732],[6.877,-1.73],[6.827,-1.728],[6.777,-1.726],[6.727,-1.724],[6.677,-1.722],[6.627,-1.721],[6.577,-1.719],[6.527,-1.717],[6.477,-1.716],[6.427,-1.714],[6.377,-1.713],[6.327,-1.711],[6.277,-1.71],[6.227,-1.709],[6.177,-1.708],[6.127,-1.708],[6.077,-1.707],[6.027,-1.706],[5.977,-1.705],[5.927,-1.704],[5.877,-1.704],[5.827,-1.702],[5.777,-1.701],[5.728,-1.7],[5.678,-1.699],[5.628,-1.697],[5.578,-1.696],[5.528,-1.695],[5.478,-1.694],[5.428,-1.693],[5.378,-1.692],[5.328,-1.691],[5.278,-1.691],[5.228,-1.69],[5.178,-1.69],[5.128,-1.69],[5.078,-1.689],[5.028,-1.689],[4.978,-1.689],[4.928,-1.689],[4.878,-1.689],[4.828,-1.689],[4.778,-1.689],[4.728,-1.688],[4.678,-1.688],[4.628,-1.687],[4.578,-1.687],[4.528,-1.686],[4.478,-1.685],[4.428,-1.684],[4.378,-1.683],[4.328,-1.681],[4.278,-1.68],[4.228,-1.679],[4.178,-1.677],[4.128,-1.676],[4.078,-1.675],[4.028,-1.674],[3.978,-1.673],[3.928,-1.673],[3.878,-1.672],[3.828,-1.671],[3.778,-1.671],[3.728,-1.67],[3.678,-1.669],[3.628,-1.668],[3.578,-1.667],[3.528,-1.666],[3.478,-1.665],[3.428,-1.663],[3.378,-1.662],[3.328,-1.66],[3.278,-1.659],[3.228,-1.657],[3.178,-1.655],[3.128,-1.654],[3.078,-1.652],[3.028,-1.65],[2.978,-1.648],[2.928,-1.646],[2.878,-1.644],[2.828,-1.642],[2.778,-1.64],[2.728,-1.638],[2.678,-1.635],[2.628,-1.633],[2.579,-1.63],[2.529,-1.627],[2.479,-1.624],[2.429,-1.621],[2.379,-1.618],[2.329,-1.615],[2.279,-1.612],[2.229,-1.608],[2.179,-1.604],[2.13,-1.6],[2.08,-1.596],[2.03,-1.592],[1.98,-1.588],[1.93,-1.583],[1.881,-1.578],[1.831,-1.573],[1.781,-1.568],[1.731,-1.563],[1.682,-1.557],[1.632,-1.551],[1.582,-1.544],[1.533,-1.538],[1.483,-1.531],[1.434,-1.523],[1.385,-1.515],[1.335,-1.507],[1.286,-1.498],[1.237,-1.489],[1.188,-1.48],[1.139,-1.47],[1.09,-1.459],[1.041,-1.448],[0.993,-1.436],[0.944,-1.424],[0.896,-1.412],[0.847,-1.399],[0.799,-1.385],[0.751,-1.371],[0.704,-1.356],[0.656,-1.34],[0.609,-1.324],[0.562,-1.307],[0.515,-1.29],[0.468,-1.272],[0.422,-1.253],[0.376,-1.233],[0.331,-1.212],[0.285,-1.191],[0.241,-1.168],[0.197,-1.145],[0.153,-1.121],[0.11,-1.095],[0.067,-1.069],[0.025,-1.042],[-0.016,-1.013],[-0.056,-0.984],[-0.096,-0.953],[-0.135,-0.922],[-0.173,-0.89],[-0.21,-0.856],[-0.247,-0.822],[-0.282,-0.787],[-0.317,-0.751],[-0.351,-0.714],[-0.384,-0.676],[-0.416,-0.638],[-0.447,-0.599],[-0.477,-0.559],[-0.506,-0.519],[-0.535,-0.477],[-0.562,-0.436],[-0.589,-0.394],[-0.616,-0.351],[-0.641,-0.308],[-0.667,-0.265],[-0.691,-0.222],[-0.715,-0.178],[-0.738,-0.133],[-0.761,-0.089],[-0.783,-0.044],[-0.803,0.002],[-0.823,0.047],[-0.842,0.094],[-0.86,0.14],[-0.877,0.188],[-0.893,0.235],[-0.907,0.283],[-0.92,0.331],[-0.932,0.38],[-0.943,0.429],[-0.952,0.478],[-0.961,0.527],[-0.968,0.576],[-0.975,0.626],[-0.981,0.676],[-0.986,0.725],[-0.99,0.775],[-0.994,0.825],[-0.997,0.875],[-0.999,0.925],[-1.001,0.975],[-1.002,1.025],[-1.003,1.075],[-1.004,1.125],[-1.004,1.175],[-1.004,1.225],[-1.004,1.275],[-1.003,1.325],[-1.002,1.375],[-1.001,1.425],[-0.999,1.475],[-0.997,1.525],[-0.996,1.575],[-0.994,1.625],[-0.992,1.675],[-0.99,1.725],[-0.988,1.775],[-0.986,1.824],[-0.984,1.874],[-0.983,1.924],[-0.981,1.974],[-0.98,2.024],[-0.979,2.074],[-0.978,2.124],[-0.978,2.174],[-0.978,2.224],[-0.978,2.274],[-0.979,2.324],[-0.98,2.374],[-0.981,2.424],[-0.983,2.474],[-0.985,2.524],[-0.987,2.574],[-0.989,2.624],[-0.991,2.674],[-0.993,2.724],[-0.995,2.774],[-0.997,2.824],[-0.998,2.874],[-0.999,2.924],[-0.999,2.974],[-0.999,3.024],[-0.998,3.074],[-0.996,3.124],[-0.993,3.174],[-0.99,3.224],[-0.984,3.273],[-0.978,3.323],[-0.97,3.372],[-0.961,3.422],[-0.951,3.47],[-0.938,3.519],[-0.924,3.567],[-0.909,3.615],[-0.892,3.662],[-0.874,3.708],[-0.854,3.754],[-0.833,3.799],[-0.811,3.844],[-0.787,3.888],[-0.763,3.932],[-0.737,3.975],[-0.71,4.017],[-0.683,4.059],[-0.654,4.1],[-0.625,4.141],[-0.595,4.181],[-0.565,4.22],[-0.534,4.26],[-0.503,4.299],[-0.471,4.337],[-0.439,4.375],[-0.406,4.413],[-0.374,4.451],[-0.341,4.489],[-0.307,4.526],[-0.274,4.563],[-0.24,4.6],[-0.206,4.637],[-0.172,4.674],[-0.138,4.71],[-0.104,4.746],[-0.069,4.782],[-0.034,4.818],[0.001,4.854],[0.036,4.89],[0.071,4.926],[0.106,4.961],[0.141,4.996],[0.177,5.032],[0.212,5.067],[0.248,5.102],[0.283,5.137],[0.319,5.172],[0.355,5.207],[0.391,5.242],[0.427,5.277],[0.463,5.311],[0.499,5.346],[0.535,5.381],[0.571,5.415],[0.607,5.45],[0.643,5.485],[0.679,5.52],[0.714,5.555],[0.75,5.589],[0.786,5.624],[0.822,5.66],[0.857,5.695],[0.893,5.73],[0.928,5.765],[0.963,5.801],[0.999,5.836],[1.034,5.872],[1.069,5.907],[1.104,5.943],[1.139,5.978],[1.175,6.013],[1.21,6.049],[1.246,6.084],[1.281,6.119],[1.317,6.154],[1.353,6.188],[1.39,6.222],[1.427,6.256],[1.464,6.289],[1.502,6.322],[1.541,6.354],[1.58,6.385],[1.619,6.416],[1.66,6.445],[1.7,6.474],[1.742,6.502],[1.784,6.529],[1.827,6.555],[1.87,6.58],[1.914,6.603],[1.959,6.626],[2.004,6.648],[2.049,6.669],[2.095,6.688],[2.142,6.707],[2.188,6.724],[2.236,6.741],[2.283,6.757],[2.331,6.772],[2.379,6.786],[2.427,6.799],[2.475,6.812],[2.524,6.823],[2.573,6.834],[2.622,6.845],[2.671,6.855],[2.72,6.864],[2.769,6.873],[2.818,6.881],[2.868,6.888],[2.917,6.896],[2.967,6.903],[3.016,6.909],[3.066,6.916],[3.116,6.921],[3.165,6.927],[3.215,6.932],[3.265,6.938],[3.314,6.942],[3.364,6.947],[3.414,6.951],[3.464,6.956],[3.514,6.959],[3.564,6.963],[3.613,6.967],[3.663,6.97],[3.713,6.974],[3.763,6.978],[3.813,6.983],[3.862,6.99],[3.912,6.997],[3.961,7.006],[4.01,7.015],[4.059,7.025],[4.108,7.035],[4.157,7.046],[4.205,7.058],[4.254,7.07],[4.302,7.083],[4.35,7.096],[4.399,7.11],[4.446,7.124],[4.494,7.139],[4.542,7.154],[4.589,7.17],[4.637,7.185],[4.684,7.202],[4.731,7.218],[4.778,7.235],[4.825,7.253],[4.872,7.271],[4.919,7.289],[4.965,7.307],[5.011,7.326],[5.058,7.345],[5.104,7.364],[5.15,7.383],[5.196,7.403],[5.242,7.422],[5.288,7.442],[5.334,7.462],[5.38,7.481],[5.426,7.501],[5.472,7.521],[5.518,7.54],[5.564,7.56],[5.61,7.579],[5.656,7.598],[5.703,7.616],[5.749,7.634],[5.796,7.652],[5.843,7.669],[5.89,7.686],[5.937,7.703],[5.985,7.719],[6.032,7.734],[6.08,7.748],[6.128,7.762],[6.177,7.775],[6.225,7.787],[6.274,7.799],[6.323,7.809],[6.372,7.818],[6.421,7.826],[6.471,7.833],[6.52,7.839],[6.57,7.843],[6.62,7.846],[6.67,7.848],[6.72,7.848],[6.77,7.848],[6.82,7.848],[6.87,7.848],[6.92,7.848],[6.97,7.848],[7.02,7.848],[7.07,7.848],[7.12,7.848],[7.17,7.848],[7.22,7.848],[7.27,7.848],[7.32,7.848],[7.37,7.848],[7.42,7.848],[7.47,7.848],[7.52,7.848],[7.57,7.848],[7.62,7.848],[7.67,7.848],[7.72,7.848],[7.77,7.848],[7.82,7.848],[7.87,7.848],[7.92,7.848],[7.97,7.848],[8.02,7.848],[8.07,7.848],[8.12,7.848],[8.17,7.848],[8.22,7.848],[8.27,7.848],[8.32,7.848],[8.37,7.848],[8.42,7.848],[8.47,7.848],[8.52,7.848],[8.57,7.848],[8.62,7.848],[8.67,7.848],[8.72,7.848],[8.77,7.848],[8.82,7.848],[8.87,7.848],[8.92,7.848],[8.97,7.846],[9.02,7.843],[9.07,7.839],[9.119,7.833],[9.169,7.826],[9.218,7.817],[9.267,7.808],[9.316,7.797],[9.365,7.785],[9.413,7.772],[9.461,7.759],[9.509,7.744],[9.557,7.729],[9.604,7.713],[9.651,7.696],[9.698,7.679],[9.745,7.661],[9.791,7.643],[9.837,7.624],[9.884,7.604],[9.93,7.585],[9.975,7.565],[10.021,7.545],[10.067,7.524],[10.113,7.501],[10.158,7.477],[10.204,7.452],[10.249,7.425],[10.294,7.398],[10.34,7.371],[10.385,7.344],[10.431,7.316],[10.476,7.289],[10.522,7.262],[10.567,7.235],[10.612,7.21],[10.658,7.185],[10.704,7.161],[10.749,7.138],[10.795,7.117],[10.841,7.097],[10.887,7.078],[10.934,7.061],[10.98,7.045],[11.027,7.031],[11.074,7.018],[11.122,7.007],[11.169,6.997],[11.217,6.989],[11.265,6.982],[11.314,6.976],[11.363,6.971],[11.411,6.968],[11.461,6.965],[11.51,6.963],[11.56,6.961],[11.609,6.961],[11.659,6.96],[11.708,6.959],[11.758,6.959],[11.806,6.96],[11.856,6.96],[11.906,6.96],[11.955,6.96],[12.003,6.96],[12.053,6.96],[12.101,6.96]],"yc":7.848,"Wx":7.794,"hexY":6.96};
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
  CAMPUS_TRAIN_MODEL={S,clear,tun,zone:tun?{y0:tun.yc-0.9,y1:tun.yc+0.82}:null,lampY:tun?tun.yc+0.55:null,hexY,runs:runs.length||!(D.hideHexes&&D.hideHexes.length)?(runs.length?runs:[[0,S.length-1]]):[[0,S.length-1]],underHex:underHex.length?underHex:null,
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
function campusDrawTrack(g,TR,X,Y,RS,rng){TR.runs.forEach(r=>campusDrawTrackRun(g,TR.S.slice(r[0],r[1]+1),X,Y,RS,rng));}
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

function campusObjectSprite(o,R){
  const unit=(o.fu||0.075*(o.s||1))*R;
  return {x:o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>{
    if(o.tunnel){campusDrawTunnel(ctx, o.train, v=>x+(v-o.x)*R, v=>y+(v-o.y)*R, R);return;}
    if(o.car){cmCar(ctx,v=>x+(v-o.x)*R,v=>y+(v-o.y)*R,R,o);return;}
    const asset=CAMPUS_ASSETS[o.k];
    if(!asset)throw new Error(`Missing campus scenery asset: ${o.k}`);
    asset.draw(ctx,x,y,unit,o.v);
  }};
}

/* ===== BAKE ===== */
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
  if(M.lake){let n=0;cmWalk(M.lake,0.55,(x,y,nx,ny)=>{if(rng()<0.42)return;const ins=cmInPoly(M.lake,x+nx*0.1,y+ny*0.1)?1:-1,px=x-nx*ins*0.06+(rng()-0.5)*0.1,py=y-ny*ins*0.06;if(M.hexNear(px,py,1.02))return;if(n++%4===0)add('stones',x+nx*ins*-0.22,y+ny*ins*-0.22,0.6+rng()*0.25);else add('reeds',px,py,0.85+rng()*0.4);},true);
    for(let k=0;k<7;k++){let x,y,t=0;const bb=M.lake.reduce((a,p)=>[Math.min(a[0],p[0]),Math.max(a[1],p[0]),Math.min(a[2],p[1]),Math.max(a[3],p[1])],[1e9,-1e9,1e9,-1e9]);do{x=bb[0]+rng()*(bb[1]-bb[0]);y=bb[2]+rng()*(bb[3]-bb[2]);t++;}while((!cmInPoly(M.lake,x,y)||cmDistPoly(M.lake,x,y)<0.5)&&t<300);if(t<300)add('duck',x,y,1.0);}}
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
  {let removed=0;for(let i=objs.length-1;i>=0;i--){const o=objs[i];if(!o.nat)continue;if(M.stationNear(o.x,o.y,1.13)||(TR&&TR.clear(o.x,o.y))){tally[o.k]--;objs.splice(i,1);removed++;}}
   for(let i=trees.length-1;i>=0;i--)if(objs.indexOf(trees[i])<0)trees.splice(i,1);tally._cleared=removed;}
  if(TR&&TR.tun)objs.push({tunnel:true,train:TR,x:TR.tun.x,y:TR.tun.yc+0.5,k:'tunnel',fu:2});
  const inlays=M.plots.map((p,i)=>campusBakePlot(M,p,RS,7000+i*31));
  const sprites=objs.concat(...inlays.map(inlay=>inlay.objects)).map(o=>campusObjectSprite(o,R));
  const camp={ground:gC,inlays,sprites,w:Wpx,h:Hpx,ox:X(0),oy:Y(0),R,scale:S,
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


return {bake:bakeCampus,drawGround:drawCampusGround,drawInlays:drawCampusInlays,clear:()=>{CAMPUS_CACHE={};}};
})();
const medium = (() => {

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
const CAMPUS_GEO={"frame":{"x0":-13.222,"x1":31.97,"y0":-2.483,"y1":16.673},"hexes":[[0.5,0,"g"],[1.5,0,"g"],[2.5,0,"g"],[4.5,0,"w"],[5.5,0,"w"],[6.5,0,"w"],[1.0,1,"g"],[2.0,1,"g"],[3.0,1,"g"],[4.0,1,"w"],[5.0,1,"w"],[6.0,1,"w"],[7.0,1,"w"],[9.0,1,"w"],[1.5,2,"g"],[2.5,2,"g"],[3.5,2,"g"],[4.5,2,"w"],[5.5,2,"w"],[6.5,2,"w"],[7.5,2,"w"],[8.5,2,"w"],[9.5,2,"w"],[1.0,3,"g"],[2.0,3,"g"],[3.0,3,"g"],[5.0,3,"w"],[6.0,3,"w"],[8.0,3,"w"],[9.0,3,"w"],[10.0,3,"w"],[0.5,4,"g"],[1.5,4,"g"],[2.5,4,"g"],[4.5,4,"g"],[5.5,4,"g"],[6.5,4,"g"],[9.5,4,"w"],[0.0,5,"g"],[1.0,5,"g"],[2.0,5,"g"],[4.0,5,"g"],[5.0,5,"g"],[6.0,5,"g"],[7.0,5,"g"],[8.0,5,"g"],[9.0,5,"g"],[10.0,5,"g"],[0.5,6,"g"],[1.5,6,"g"],[2.5,6,"g"],[4.5,6,"g"],[5.5,6,"g"],[6.5,6,"g"],[7.5,6,"g"],[8.5,6,"g"],[9.5,6,"g"],[2.0,7,"g"],[3.0,7,"g"],[4.0,7,"g"],[5.0,7,"g"],[6.0,7,"g"],[7.0,7,"g"],[8.0,7,"g"],[9.0,7,"g"],[1.5,8,"g"],[2.5,8,"g"],[3.5,8,"g"],[5.5,8,"e"],[7.5,8,"g"],[8.5,8,"g"],[9.5,8,"g"],[2.0,9,"g"],[4.0,9,"t"]],"lot":[[23.826,14.09],[23.641,13.444],[22.583,12.495],[18.193,9.306],[17.664,9.164],[16.739,9.225],[13.01,10.234],[11.371,10.557],[11.344,10.698],[7.351,10.719],[5.315,10.537],[4.337,10.315],[2.221,9.608],[1.164,9.427],[0.714,9.447],[0.026,9.75],[-0.661,10.254],[-3.12,12.576],[-3.94,13.161],[-4.363,13.746],[-4.363,13.968],[-4.178,14.211],[-3.279,14.816],[-1.296,15.503],[0.106,15.886],[2.644,16.27],[6.426,16.391],[15.84,16.229],[18.748,16.088],[20.573,15.906],[21.551,15.725],[22.503,15.361],[23.588,14.554]],"pond":[[7.219,2.442],[6.77,2.362],[6.479,2.442],[6.294,2.584],[6.346,2.685],[6.32,2.866],[5.58,3.492],[5.262,4.037],[4.945,4.4],[4.945,4.522],[5.342,4.865],[5.315,5.289],[5.659,5.49],[5.87,5.531],[6.029,5.49],[6.267,5.309],[6.32,5.188],[5.765,4.824],[5.606,4.501],[5.606,4.098],[5.685,3.997],[6.135,3.815],[6.399,3.633],[6.426,3.331],[6.584,3.189],[7.298,2.826],[7.536,2.644],[7.431,2.523]],"medians":[{"a":[2.04,11.055],"b":[-0.878,14.185]},{"a":[4.344,11.64],"b":[2.641,14.973]},{"a":[7.233,11.64],"b":[6.531,15.552]},{"a":[11.687,11.499],"b":[12.603,15.541]},{"a":[14.804,11.055],"b":[17.776,14.963]},{"a":[17.155,10.288],"b":[21.693,14.195]}],"entrance":[5.5,8],"plaza":{"cx":9.526,"cy":9.063,"rx":1.12,"ry":0.76},"walk":{"x":9.526,"y0":7.41,"y1":10.698,"w":0.72},"hub":[9.07,3.172],"tiling":[["Bm",[[2.5,0],[1.5,0],[0.5,0],[3.0,1],[2.0,1],[1.0,1],[3.5,2],[2.5,2],[1.5,2],[3.0,3],[2.0,3],[1.0,3]]],["A",[[4.5,0],[5.5,0],[6.5,0],[4.0,1],[5.0,1],[6.0,1],[7.0,1],[4.5,2],[5.5,2],[6.5,2],[5.0,3],[6.0,3]]],["Cm",[[9.0,1],[9.5,2],[8.5,2],[7.5,2],[10.0,3],[9.0,3],[8.0,3],[9.5,4]]],["D",[[0.5,4],[1.5,4],[2.5,4],[0.0,5],[1.0,5],[2.0,5],[0.5,6],[1.5,6]]],["A",[[4.5,4],[5.5,4],[6.5,4],[4.0,5],[5.0,5],[6.0,5],[7.0,5],[4.5,6],[5.5,6],[6.5,6],[5.0,7],[6.0,7]]],["B",[[8.0,5],[9.0,5],[10.0,5],[7.5,6],[8.5,6],[9.5,6],[7.0,7],[8.0,7],[9.0,7],[7.5,8],[8.5,8],[9.5,8]]],["C",[[2.5,6],[2.0,7],[3.0,7],[4.0,7],[1.5,8],[2.5,8],[3.5,8],[2.0,9]]]]};
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
  const hexes=G.hexes.filter(h=>h[2]!=='t').map(([u,r,t])=>({u,r,x:u*CW3,y:r*0.87,tone:t==='g'?'gray':t==='w'?'white':'entrance'}));
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
  const pcx=G.pond.reduce((a,p)=>a+p[0],0)/G.pond.length,pcy=G.pond.reduce((a,p)=>a+p[1],0)/G.pond.length;
  const pondPlot=plots.find(p=>p.has(pcx,pcy,1.3))||plots[0];plots.forEach(p=>{p.id=p===pondPlot?'pond':'grove';});
  /* keep the pond comfortably inside its plot (pull any vertex that sits too near a plot edge toward the nearest cell centre) */
  const pondFit=G.pond.map(p=>{let x=p[0],y=p[1],n=0;const ok=()=>pondPlot.has(x,y)&&pondPlot.edgeDist(x,y)>0.14;while(!ok()&&n++<60){let b=null,bd=1e9;pondPlot.cells.forEach(c=>{const d=Math.hypot(c.x-x,c.y-y);if(d<bd){bd=d;b=c;}});x+=(b.x-x)*0.07;y+=(b.y-y)*0.07;}return[x,y];});
  const lot=cmChaikin(G.lot,3),pond=cmChaikin(pondFit,3),P=G.plaza,W=G.walk,med=G.medians;
  const medBlock=(x,y,m)=>{for(const k of med)if(cmSeg(x,y,k.a,k.b)<m)return true;return false;};
  const hexNear=(x,y,s)=>{for(const h of hexes){const dx=x-h.x,dy=y-h.y;if(Math.abs(dx)>1.5||Math.abs(dy)>0.9)continue;if(cmHexIn(dx,dy,s))return true;}return false;};
  const inPlaza=(x,y,m)=>(((x-P.cx)/(P.rx+m))**2+((y-P.cy)/(P.ry+m*.7))**2)<1;
  const inWalk=(x,y,m)=>Math.abs(x-W.x)<W.w/2+m&&y>W.y0&&y<W.y1+0.02;
  const inLot=(x,y,m)=>cmInPoly(lot,x,y)||cmDistPoly(lot,x,y)<m;
  const inPond=(x,y,m)=>cmInPoly(pond,x,y)||cmDistPoly(pond,x,y)<m;
  /* meadows: open clearings that break up the forest (ellipses cx,cy,rx,ry) */
  const meadows=[[-5.2,6.4,2.3,1.15],[22.8,5.6,2.6,1.2],[-8.6,13.6,2.2,1.0],[22.6,13.2,2.5,1.1],[26.8,12.8,1.8,0.9],[14.6,-0.9,1.9,0.8]];
  const inMeadow=(x,y)=>meadows.some(m=>((x-m[0])/m[2])**2+((y-m[1])/m[3])**2<1);
  const inPlot=(x,y,s)=>plots.some(p=>p.has(x,y,s||1.04));
  /* layer rule: an object is FRONT (drawn after the park) only when it stands south of every park hex around it */
  const layerOf=(x,y)=>{let my=-1e9,any=false;for(const h of hexes){if(Math.abs(x-h.x)<1.5){any=true;if(h.y>my)my=h.y;}}return any?(y>my+0.12?'front':'back'):(y>8.35?'front':'back');};
  CAMPUS_MODEL={G,F,hexes,station,stationNear,ent,plots,inPlot,lot,pond,P,W,med,medBlock,hexNear,inPlaza,inWalk,inLot,inPond,meadows,inMeadow,layerOf,FW:F.x1-F.x0,FH:F.y1-F.y0};
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
function campusPaintPond(g,M,X,Y,RS,rng){const poly=(c,pts)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(X(p[0]),Y(p[1])):c.moveTo(X(p[0]),Y(p[1])));c.closePath();};
  g.save();g.lineJoin='round';
  poly(g,M.pond);g.strokeStyle='rgba(60,104,44,.36)';g.lineWidth=RS*0.5;g.stroke();
  poly(g,M.pond);g.strokeStyle='#b7a572';g.lineWidth=RS*0.26;g.stroke();
  poly(g,M.pond);g.strokeStyle='#dacd9f';g.lineWidth=RS*0.13;g.stroke();
  poly(g,M.pond);const bb=M.pond.reduce((a,p)=>[Math.min(a[0],p[0]),Math.max(a[1],p[0]),Math.min(a[2],p[1]),Math.max(a[3],p[1])],[1e9,-1e9,1e9,-1e9]);
  const pg=g.createRadialGradient(X((bb[0]+bb[1])/2),Y((bb[2]+bb[3])/2),0,X((bb[0]+bb[1])/2),Y((bb[2]+bb[3])/2),RS*1.7);pg.addColorStop(0,'#4f9cbe');pg.addColorStop(0.6,'#62b0d0');pg.addColorStop(1,'#7cc6e0');g.fillStyle=pg;g.fill();
  g.save();poly(g,M.pond);g.clip();g.strokeStyle='rgba(205,240,250,.5)';g.lineWidth=RS*0.2;poly(g,M.pond);g.stroke();
  for(let k=0;k<44;k++){const x=bb[0]+rng()*(bb[1]-bb[0]),y=bb[2]+rng()*(bb[3]-bb[2]);g.strokeStyle='rgba(255,255,255,'+(0.18+rng()*0.2)+')';g.lineWidth=Math.max(1,RS*0.012);const w=RS*(0.06+rng()*0.1);g.beginPath();g.moveTo(X(x)-w,Y(y));g.quadraticCurveTo(X(x),Y(y)-RS*0.025,X(x)+w,Y(y));g.stroke();}
  for(let k=0;k<9;k++){let x,y,t=0;do{x=bb[0]+rng()*(bb[1]-bb[0]);y=bb[2]+rng()*(bb[3]-bb[2]);t++;}while((!cmInPoly(M.pond,x,y)||cmDistPoly(M.pond,x,y)<0.22)&&t<60);if(t>=60)continue;
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
  return{id:plot.id,canvas:cv,ox:X(0),oy:Y(0),w,h,cells:cells.map(c=>({u:c.u,r:c.r})),count:objs.length,objects:objs};
}

const CAMPUS_VARIANT='plain';
function campusObjectSprite(o,R){
  const unit=(o.fu||0.075*(o.s||1))*R;
  return {x:o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>{
    if(o.tunnel){campusDrawTunnel(ctx, o.train, v=>x+(v-o.x)*R, v=>y+(v-o.y)*R, R);return;}
    if(o.car){cmCar(ctx,v=>x+(v-o.x)*R,v=>y+(v-o.y)*R,R,o);return;}
    const asset=CAMPUS_ASSETS[o.k];
    if(!asset)throw new Error(`Missing campus scenery asset: ${o.k}`);
    asset.draw(ctx,x,y,unit,o.v);
  }};
}

/* ===== BAKE ===== */
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
  /* ---------- 2. PARKING LOT ---------- */
  g.save();g.lineJoin='round';g.lineCap='round';
  poly(g,M.lot);g.strokeStyle='rgba(52,104,40,.30)';g.lineWidth=RS*0.62;g.stroke();              /* shaded verge */
  poly(g,M.lot);g.strokeStyle='rgba(30,40,26,.22)';g.lineWidth=RS*0.26;g.stroke();                /* curb shadow */
  poly(g,M.lot);g.strokeStyle='#cdd0cf';g.lineWidth=RS*0.15;g.stroke();                           /* concrete curb */
  poly(g,M.lot);g.strokeStyle='#e4e6e3';g.lineWidth=RS*0.05;g.stroke();
  poly(g,M.lot);const ag=g.createLinearGradient(0,Y(10.6),0,Y(F.y1));ag.addColorStop(0,'#8a9099');ag.addColorStop(1,'#767c85');g.fillStyle=ag;g.fill();
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
    if(M.hexNear(x,y,1.13)||M.inPlot(x,y)||M.inLot(x,y,0.5)||M.inPlaza(x,y,0.5)||M.inWalk(x,y,0.55)||M.inPond(x,y,0.5)||M.medBlock(x,y,0.4))continue;
    let dh=1e9;for(const h of M.hexes){const d=Math.hypot(x-h.x,(y-h.y)*1.4);if(d<dh)dh=d;}dh-=0.95;
    let p=1;if(dh<1.4)p*=0.5+0.5*Math.max(0,dh)/1.4;const dl=M.inLot(x,y,5)?cmDistPoly(M.lot,x,y):9;if(dl<1.5)p*=0.55+0.45*(dl-0.5)/1.0;
    if(M.inMeadow(x,y))p*=0.05;if(rng()>p)continue;if(!free(x,y))continue;
    const cx=Math.floor(x/cell),cy=Math.floor(y/cell),kk=hk(cx,cy);(hash.get(kk)||hash.set(kk,[]).get(kk)).push([x,y]);
    const ty=(y-F.y0)/M.FH,reg=ty<0.33?'top':ty<0.66?'mid':'bottom',w=Object.assign({},CAMPUS_REGION[reg]),cl=0.5+0.5*Math.sin(x*0.55+Math.cos(y*0.4)*1.8)*Math.cos(y*0.35-x*0.2);
    const far=Math.min(1,Math.max(0,(Math.hypot((x-9.0)/1.0,(y-3.9)*1.5)-7)/12));          /* 0 near the park -> 1 deep forest */
    ['spruce','fir','youngSpruce'].forEach(k=>w[k]*=(0.55+1.3*cl)*(1+1.6*far));['linden','appleTree','beech','birch','maple'].forEach(k=>w[k]*=(0.55+1.3*(1-cl))*(1-0.55*far)*(k==='maple'?1-0.7*far:1));
    const bigS=(1.2+rng()*0.55)*(0.86+0.14*Math.min(1,Math.max(0,dh)/1.5));
    trees.push(add(cmPick(w,rng),x,y,bigS,{nat:true}));
    if(rng()<0.5){const ux=x+(rng()-0.5)*0.5,uy=y+0.1+rng()*0.1;if(!M.inPlot(ux,uy))add(CAMPUS_UNDER[Math.floor(rng()*CAMPUS_UNDER.length)],ux,uy,0.85+rng()*0.4,{nat:true});}
  }
  /* meadow dressing */
  M.meadows.forEach(m=>{for(let k=0;k<34;k++){const a=rng()*6.283,rr=Math.sqrt(rng())*0.92,x=m[0]+Math.cos(a)*m[2]*rr,y=m[1]+Math.sin(a)*m[3]*rr;if(M.hexNear(x,y,1.1)||M.inPlot(x,y)||M.inLot(x,y,0.4))continue;add(['wildflowers','sunflowers','grassTuft','wildflowers','fern','geraniumBush'][k%6],x,y,0.85+rng()*0.5,{nat:true});}
    for(let k=0;k<3;k++){const a=rng()*6.283,rr=0.3+rng()*0.55;add(['appleTree','birch','appleTree'][k],m[0]+Math.cos(a)*m[2]*rr,m[1]+Math.sin(a)*m[3]*rr,1.1+rng()*0.3);}});
  /* lot: planted medians, lamps, north hedge line, cars */
  M.med.forEach((m,i)=>{let j=0;cmWalk([m.a,m.b],0.95,(x,y)=>{add(['youngSpruce','appleTree','birch'][(i+j++)%3],x,y,0.72,{layer:'front'});add(j%2?'hedge':'geraniumBush',x+0.02,y+0.45,0.55,{layer:'front'});});
    [m.a,m.b,[(m.a[0]+m.b[0])/2,(m.a[1]+m.b[1])/2]].forEach((q,qi)=>add('lampPost',q[0]+(qi===2?0:0),q[1]+(qi===0?-0.05:0.0),0.95,{layer:'front'}));});
  {let n=0;cmWalk(M.lot,0.5,(x,y,nx,ny)=>{if(cmInPoly(M.lot,x+nx*0.15,y+ny*0.15)){nx=-nx;ny=-ny;}if(ny>-0.25)return;const px=x+nx*0.34,py=y+ny*0.34;if(Math.abs(px-Wk.x)<0.95&&py>Wk.y0)return;if(M.hexNear(px,py,1.1))return;
    add('hedge',px,py,0.78+rng()*0.2);if(++n%5===0)add(['youngSpruce','birch','appleTree'][n%3],px+nx*0.28,py+ny*0.28,0.85);},true);}
  const lay=campusLotLayout(M,mulberry(99));lay.stalls.forEach(s=>{if(rng()<0.42)objs.push(Object.assign({car:true,layer:'front',len:0.34+rng()*0.06,wid:0.17,col:CAMPUS_CAR_COLS[Math.floor(rng()*CAMPUS_CAR_COLS.length)]},s)),tally.car=(tally.car||0)+1;});
  /* walk + circle */
  for(const sx of [-1,1]){for(let y=Wk.y0+0.4;y<P.cy-P.ry-0.12;y+=0.5)if(!(TR&&y>TR.zone.y0&&y<TR.zone.y1))add('hedge',Wk.x+sx*0.52,y,0.55,{layer:'front'});for(let y=P.cy+P.ry+0.12;y<Wk.y1-0.04;y+=0.5)add('hedge',Wk.x+sx*0.52,y,0.55,{layer:'front'});
    add('lampPost',Wk.x+sx*0.66,TR?TR.lampY:8.05,1.0,{layer:'front'});add('lampPost',Wk.x+sx*0.66,10.25,1.0,{layer:'front'});}
  for(let k=0;k<10;k++){const a=k/10*6.283+0.3;add('geraniumBush',P.cx+Math.cos(a)*P.rx*0.69,P.cy+Math.sin(a)*P.ry*0.69,0.62,{layer:'front'});}
  add('fountainBig',P.cx,P.cy,1,{layer:'front',fu:0.58/7.2});
  /* clearings, applied AFTER generation so the forest everywhere else is exactly the same: the added station hex (both maps) and the train corridor (train map) */
  {let removed=0;for(let i=objs.length-1;i>=0;i--){const o=objs[i];if(!o.nat)continue;if(M.stationNear(o.x,o.y,1.13)||(TR&&TR.clear(o.x,o.y))){tally[o.k]--;objs.splice(i,1);removed++;}}
   for(let i=trees.length-1;i>=0;i--)if(objs.indexOf(trees[i])<0)trees.splice(i,1);tally._cleared=removed;}
  if(TR)objs.push({tunnel:true,train:TR,x:TR.tun.x,y:TR.tun.yc+0.5,k:'tunnel',fu:2});
  const inlays=M.plots.map((p,i)=>campusBakePlot(M,p,RS,7000+i*31));
  const sprites=objs.concat(...inlays.map(inlay=>inlay.objects)).map(o=>campusObjectSprite(o,R));
  const camp={ground:gC,inlays,sprites,w:Wpx,h:Hpx,ox:X(0),oy:Y(0),R,scale:S,
    hexes:M.hexes.concat(M.station?[M.station]:[]).map(h=>({u:h.u,r:h.r,tone:h.tone,x:h.x*RS,y:h.y*RS})),            /* centres relative to the anchor (hex u=0,r=0) */
    entrance:{x:M.ent.x*RS,y:M.ent.y*RS,u:M.ent.u,r:M.ent.r},
    station:M.station?{u:M.station.u,r:M.station.r,x:M.station.x*RS,y:M.station.y*RS}:null,
    train:TR?{track:TR.S.map(s=>[Math.round(s.x*RS*10)/10,Math.round(s.y*RS*10)/10]),lengthR:TR.len,tunnel:{x:TR.tun.x*RS,y:TR.tun.yc*RS,portalHalfSpan:0.75*RS,deckHeight:TR.tun.h*RS}}:null,
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


return {bake:bakeCampus,drawGround:drawCampusGround,drawInlays:drawCampusInlays,clear:()=>{CAMPUS_CACHE={};}};
})();
const mediumTrain = (() => {

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
const CAMPUS_GEO={"frame":{"x0":-13.222,"x1":31.97,"y0":-2.483,"y1":16.673},"hexes":[[0.5,0,"g"],[1.5,0,"g"],[2.5,0,"g"],[4.5,0,"w"],[5.5,0,"w"],[6.5,0,"w"],[1.0,1,"g"],[2.0,1,"g"],[3.0,1,"g"],[4.0,1,"w"],[5.0,1,"w"],[6.0,1,"w"],[7.0,1,"w"],[9.0,1,"w"],[1.5,2,"g"],[2.5,2,"g"],[3.5,2,"g"],[4.5,2,"w"],[5.5,2,"w"],[6.5,2,"w"],[7.5,2,"w"],[8.5,2,"w"],[9.5,2,"w"],[1.0,3,"g"],[2.0,3,"g"],[3.0,3,"g"],[5.0,3,"w"],[6.0,3,"w"],[8.0,3,"w"],[9.0,3,"w"],[10.0,3,"w"],[0.5,4,"g"],[1.5,4,"g"],[2.5,4,"g"],[4.5,4,"g"],[5.5,4,"g"],[6.5,4,"g"],[9.5,4,"w"],[0.0,5,"g"],[1.0,5,"g"],[2.0,5,"g"],[4.0,5,"g"],[5.0,5,"g"],[6.0,5,"g"],[7.0,5,"g"],[8.0,5,"g"],[9.0,5,"g"],[10.0,5,"g"],[0.5,6,"g"],[1.5,6,"g"],[2.5,6,"g"],[4.5,6,"g"],[5.5,6,"g"],[6.5,6,"g"],[7.5,6,"g"],[8.5,6,"g"],[9.5,6,"g"],[2.0,7,"g"],[3.0,7,"g"],[4.0,7,"g"],[5.0,7,"g"],[6.0,7,"g"],[7.0,7,"g"],[8.0,7,"g"],[9.0,7,"g"],[1.5,8,"g"],[2.5,8,"g"],[3.5,8,"g"],[5.5,8,"e"],[7.5,8,"g"],[8.5,8,"g"],[9.5,8,"g"],[2.0,9,"g"],[4.0,9,"t"]],"lot":[[23.826,14.09],[23.641,13.444],[22.583,12.495],[18.193,9.306],[17.664,9.164],[16.739,9.225],[13.01,10.234],[11.371,10.557],[11.344,10.698],[7.351,10.719],[5.315,10.537],[4.337,10.315],[2.221,9.608],[1.164,9.427],[0.714,9.447],[0.026,9.75],[-0.661,10.254],[-3.12,12.576],[-3.94,13.161],[-4.363,13.746],[-4.363,13.968],[-4.178,14.211],[-3.279,14.816],[-1.296,15.503],[0.106,15.886],[2.644,16.27],[6.426,16.391],[15.84,16.229],[18.748,16.088],[20.573,15.906],[21.551,15.725],[22.503,15.361],[23.588,14.554]],"pond":[[7.219,2.442],[6.77,2.362],[6.479,2.442],[6.294,2.584],[6.346,2.685],[6.32,2.866],[5.58,3.492],[5.262,4.037],[4.945,4.4],[4.945,4.522],[5.342,4.865],[5.315,5.289],[5.659,5.49],[5.87,5.531],[6.029,5.49],[6.267,5.309],[6.32,5.188],[5.765,4.824],[5.606,4.501],[5.606,4.098],[5.685,3.997],[6.135,3.815],[6.399,3.633],[6.426,3.331],[6.584,3.189],[7.298,2.826],[7.536,2.644],[7.431,2.523]],"medians":[{"a":[2.04,11.055],"b":[-0.878,14.185]},{"a":[4.344,11.64],"b":[2.641,14.973]},{"a":[7.233,11.64],"b":[6.531,15.552]},{"a":[11.687,11.499],"b":[12.603,15.541]},{"a":[14.804,11.055],"b":[17.776,14.963]},{"a":[17.155,10.288],"b":[21.693,14.195]}],"entrance":[5.5,8],"plaza":{"cx":9.526,"cy":9.063,"rx":1.12,"ry":0.76},"walk":{"x":9.526,"y0":7.41,"y1":10.698,"w":0.72},"hub":[9.07,3.172],"tiling":[["Bm",[[2.5,0],[1.5,0],[0.5,0],[3.0,1],[2.0,1],[1.0,1],[3.5,2],[2.5,2],[1.5,2],[3.0,3],[2.0,3],[1.0,3]]],["A",[[4.5,0],[5.5,0],[6.5,0],[4.0,1],[5.0,1],[6.0,1],[7.0,1],[4.5,2],[5.5,2],[6.5,2],[5.0,3],[6.0,3]]],["Cm",[[9.0,1],[9.5,2],[8.5,2],[7.5,2],[10.0,3],[9.0,3],[8.0,3],[9.5,4]]],["D",[[0.5,4],[1.5,4],[2.5,4],[0.0,5],[1.0,5],[2.0,5],[0.5,6],[1.5,6]]],["A",[[4.5,4],[5.5,4],[6.5,4],[4.0,5],[5.0,5],[6.0,5],[7.0,5],[4.5,6],[5.5,6],[6.5,6],[5.0,7],[6.0,7]]],["B",[[8.0,5],[9.0,5],[10.0,5],[7.5,6],[8.5,6],[9.5,6],[7.0,7],[8.0,7],[9.0,7],[7.5,8],[8.5,8],[9.5,8]]],["C",[[2.5,6],[2.0,7],[3.0,7],[4.0,7],[1.5,8],[2.5,8],[3.5,8],[2.0,9]]]]};
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
  const hexes=G.hexes.filter(h=>h[2]!=='t').map(([u,r,t])=>({u,r,x:u*CW3,y:r*0.87,tone:t==='g'?'gray':t==='w'?'white':'entrance'}));
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
  const pcx=G.pond.reduce((a,p)=>a+p[0],0)/G.pond.length,pcy=G.pond.reduce((a,p)=>a+p[1],0)/G.pond.length;
  const pondPlot=plots.find(p=>p.has(pcx,pcy,1.3))||plots[0];plots.forEach(p=>{p.id=p===pondPlot?'pond':'grove';});
  /* keep the pond comfortably inside its plot (pull any vertex that sits too near a plot edge toward the nearest cell centre) */
  const pondFit=G.pond.map(p=>{let x=p[0],y=p[1],n=0;const ok=()=>pondPlot.has(x,y)&&pondPlot.edgeDist(x,y)>0.14;while(!ok()&&n++<60){let b=null,bd=1e9;pondPlot.cells.forEach(c=>{const d=Math.hypot(c.x-x,c.y-y);if(d<bd){bd=d;b=c;}});x+=(b.x-x)*0.07;y+=(b.y-y)*0.07;}return[x,y];});
  const lot=cmChaikin(G.lot,3),pond=cmChaikin(pondFit,3),P=G.plaza,W=G.walk,med=G.medians;
  const medBlock=(x,y,m)=>{for(const k of med)if(cmSeg(x,y,k.a,k.b)<m)return true;return false;};
  const hexNear=(x,y,s)=>{for(const h of hexes){const dx=x-h.x,dy=y-h.y;if(Math.abs(dx)>1.5||Math.abs(dy)>0.9)continue;if(cmHexIn(dx,dy,s))return true;}return false;};
  const inPlaza=(x,y,m)=>(((x-P.cx)/(P.rx+m))**2+((y-P.cy)/(P.ry+m*.7))**2)<1;
  const inWalk=(x,y,m)=>Math.abs(x-W.x)<W.w/2+m&&y>W.y0&&y<W.y1+0.02;
  const inLot=(x,y,m)=>cmInPoly(lot,x,y)||cmDistPoly(lot,x,y)<m;
  const inPond=(x,y,m)=>cmInPoly(pond,x,y)||cmDistPoly(pond,x,y)<m;
  /* meadows: open clearings that break up the forest (ellipses cx,cy,rx,ry) */
  const meadows=[[-5.2,6.4,2.3,1.15],[22.8,5.6,2.6,1.2],[-8.6,13.6,2.2,1.0],[22.6,13.2,2.5,1.1],[26.8,12.8,1.8,0.9],[14.6,-0.9,1.9,0.8]];
  const inMeadow=(x,y)=>meadows.some(m=>((x-m[0])/m[2])**2+((y-m[1])/m[3])**2<1);
  const inPlot=(x,y,s)=>plots.some(p=>p.has(x,y,s||1.04));
  /* layer rule: an object is FRONT (drawn after the park) only when it stands south of every park hex around it */
  const layerOf=(x,y)=>{let my=-1e9,any=false;for(const h of hexes){if(Math.abs(x-h.x)<1.5){any=true;if(h.y>my)my=h.y;}}return any?(y>my+0.12?'front':'back'):(y>8.35?'front':'back');};
  CAMPUS_MODEL={G,F,hexes,station,stationNear,ent,plots,inPlot,lot,pond,P,W,med,medBlock,hexNear,inPlaza,inWalk,inLot,inPond,meadows,inMeadow,layerOf,FW:F.x1-F.x0,FH:F.y1-F.y0};
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
function campusPaintPond(g,M,X,Y,RS,rng){const poly=(c,pts)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(X(p[0]),Y(p[1])):c.moveTo(X(p[0]),Y(p[1])));c.closePath();};
  g.save();g.lineJoin='round';
  poly(g,M.pond);g.strokeStyle='rgba(60,104,44,.36)';g.lineWidth=RS*0.5;g.stroke();
  poly(g,M.pond);g.strokeStyle='#b7a572';g.lineWidth=RS*0.26;g.stroke();
  poly(g,M.pond);g.strokeStyle='#dacd9f';g.lineWidth=RS*0.13;g.stroke();
  poly(g,M.pond);const bb=M.pond.reduce((a,p)=>[Math.min(a[0],p[0]),Math.max(a[1],p[0]),Math.min(a[2],p[1]),Math.max(a[3],p[1])],[1e9,-1e9,1e9,-1e9]);
  const pg=g.createRadialGradient(X((bb[0]+bb[1])/2),Y((bb[2]+bb[3])/2),0,X((bb[0]+bb[1])/2),Y((bb[2]+bb[3])/2),RS*1.7);pg.addColorStop(0,'#4f9cbe');pg.addColorStop(0.6,'#62b0d0');pg.addColorStop(1,'#7cc6e0');g.fillStyle=pg;g.fill();
  g.save();poly(g,M.pond);g.clip();g.strokeStyle='rgba(205,240,250,.5)';g.lineWidth=RS*0.2;poly(g,M.pond);g.stroke();
  for(let k=0;k<44;k++){const x=bb[0]+rng()*(bb[1]-bb[0]),y=bb[2]+rng()*(bb[3]-bb[2]);g.strokeStyle='rgba(255,255,255,'+(0.18+rng()*0.2)+')';g.lineWidth=Math.max(1,RS*0.012);const w=RS*(0.06+rng()*0.1);g.beginPath();g.moveTo(X(x)-w,Y(y));g.quadraticCurveTo(X(x),Y(y)-RS*0.025,X(x)+w,Y(y));g.stroke();}
  for(let k=0;k<9;k++){let x,y,t=0;do{x=bb[0]+rng()*(bb[1]-bb[0]);y=bb[2]+rng()*(bb[3]-bb[2]);t++;}while((!cmInPoly(M.pond,x,y)||cmDistPoly(M.pond,x,y)<0.22)&&t<60);if(t>=60)continue;
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
  return{id:plot.id,canvas:cv,ox:X(0),oy:Y(0),w,h,cells:cells.map(c=>({u:c.u,r:c.r})),count:objs.length,objects:objs};
}

const CAMPUS_VARIANT='train';
/* ===== TRAIN LOOP: the park railway's track + the tunnel that carries it under the entrance walk (TRACK ONLY, no train) ===== */
const CAMPUS_TRAIN_DATA={"pts":[[7.83,7.83],[7.88,7.83],[7.93,7.83],[7.98,7.83],[8.029,7.83],[8.079,7.83],[8.129,7.831],[8.179,7.831],[8.229,7.831],[8.279,7.832],[8.329,7.832],[8.379,7.833],[8.429,7.833],[8.479,7.834],[8.529,7.834],[8.579,7.835],[8.629,7.835],[8.679,7.836],[8.729,7.837],[8.779,7.837],[8.829,7.838],[8.879,7.838],[8.929,7.839],[8.979,7.84],[9.029,7.84],[9.079,7.841],[9.129,7.841],[9.179,7.842],[9.229,7.843],[9.279,7.843],[9.329,7.844],[9.379,7.844],[9.429,7.845],[9.479,7.845],[9.529,7.846],[9.579,7.846],[9.629,7.846],[9.679,7.847],[9.729,7.847],[9.779,7.847],[9.829,7.848],[9.879,7.848],[9.929,7.848],[9.979,7.848],[10.029,7.848],[10.079,7.848],[10.129,7.848],[10.179,7.848],[10.229,7.848],[10.279,7.848],[10.329,7.848],[10.379,7.848],[10.429,7.848],[10.479,7.848],[10.529,7.848],[10.579,7.848],[10.629,7.848],[10.679,7.848],[10.729,7.849],[10.779,7.849],[10.829,7.851],[10.879,7.852],[10.929,7.854],[10.979,7.857],[11.029,7.859],[11.079,7.862],[11.129,7.866],[11.179,7.869],[11.229,7.873],[11.278,7.878],[11.328,7.882],[11.378,7.887],[11.428,7.892],[11.477,7.897],[11.527,7.903],[11.577,7.908],[11.627,7.913],[11.676,7.918],[11.726,7.924],[11.776,7.929],[11.826,7.934],[11.875,7.938],[11.925,7.942],[11.975,7.946],[12.025,7.95],[12.075,7.952],[12.125,7.954],[12.175,7.956],[12.225,7.958],[12.275,7.96],[12.325,7.961],[12.375,7.963],[12.425,7.965],[12.475,7.966],[12.525,7.968],[12.574,7.97],[12.624,7.971],[12.674,7.973],[12.724,7.975],[12.774,7.976],[12.824,7.978],[12.874,7.979],[12.924,7.981],[12.974,7.982],[13.024,7.984],[13.074,7.985],[13.124,7.987],[13.174,7.988],[13.224,7.99],[13.274,7.991],[13.324,7.992],[13.374,7.994],[13.424,7.995],[13.474,7.996],[13.524,7.997],[13.574,7.999],[13.624,8.0],[13.674,8.002],[13.724,8.003],[13.774,8.005],[13.824,8.007],[13.874,8.008],[13.924,8.01],[13.974,8.012],[14.024,8.014],[14.074,8.016],[14.124,8.018],[14.174,8.02],[14.224,8.023],[14.274,8.025],[14.324,8.027],[14.373,8.03],[14.423,8.032],[14.473,8.034],[14.523,8.037],[14.573,8.04],[14.623,8.042],[14.673,8.045],[14.723,8.048],[14.773,8.05],[14.823,8.053],[14.873,8.056],[14.923,8.059],[14.973,8.061],[15.023,8.064],[15.072,8.067],[15.122,8.07],[15.172,8.073],[15.222,8.076],[15.272,8.078],[15.322,8.081],[15.372,8.084],[15.422,8.086],[15.472,8.089],[15.522,8.091],[15.572,8.094],[15.622,8.096],[15.672,8.098],[15.722,8.101],[15.772,8.103],[15.821,8.105],[15.871,8.106],[15.921,8.108],[15.971,8.109],[16.021,8.111],[16.071,8.112],[16.121,8.112],[16.171,8.113],[16.221,8.113],[16.271,8.112],[16.321,8.111],[16.371,8.11],[16.421,8.108],[16.471,8.106],[16.521,8.104],[16.571,8.101],[16.621,8.098],[16.671,8.094],[16.721,8.09],[16.77,8.085],[16.82,8.08],[16.87,8.074],[16.919,8.067],[16.969,8.06],[17.018,8.053],[17.068,8.044],[17.117,8.035],[17.166,8.026],[17.215,8.015],[17.263,8.003],[17.312,7.991],[17.36,7.977],[17.408,7.963],[17.455,7.948],[17.503,7.931],[17.55,7.914],[17.596,7.895],[17.642,7.876],[17.687,7.855],[17.732,7.833],[17.777,7.81],[17.821,7.786],[17.864,7.761],[17.906,7.734],[17.948,7.707],[17.989,7.678],[18.029,7.649],[18.069,7.618],[18.107,7.586],[18.145,7.553],[18.182,7.519],[18.218,7.485],[18.253,7.449],[18.287,7.412],[18.32,7.375],[18.352,7.337],[18.383,7.297],[18.413,7.258],[18.443,7.217],[18.471,7.176],[18.499,7.135],[18.526,7.092],[18.552,7.05],[18.577,7.006],[18.601,6.963],[18.625,6.919],[18.648,6.874],[18.671,6.83],[18.692,6.785],[18.714,6.739],[18.734,6.694],[18.754,6.648],[18.774,6.602],[18.793,6.556],[18.812,6.51],[18.83,6.463],[18.848,6.416],[18.865,6.369],[18.882,6.322],[18.899,6.275],[18.915,6.228],[18.931,6.18],[18.946,6.133],[18.961,6.085],[18.975,6.037],[18.989,5.989],[19.002,5.941],[19.015,5.893],[19.027,5.844],[19.039,5.796],[19.05,5.747],[19.061,5.698],[19.071,5.649],[19.08,5.6],[19.089,5.551],[19.098,5.501],[19.106,5.452],[19.113,5.403],[19.12,5.353],[19.127,5.304],[19.133,5.254],[19.139,5.204],[19.144,5.155],[19.149,5.105],[19.154,5.055],[19.158,5.005],[19.162,4.955],[19.165,4.905],[19.168,4.856],[19.171,4.806],[19.174,4.756],[19.177,4.706],[19.18,4.656],[19.182,4.606],[19.184,4.556],[19.186,4.506],[19.188,4.456],[19.189,4.406],[19.19,4.356],[19.191,4.306],[19.191,4.256],[19.19,4.206],[19.19,4.156],[19.189,4.106],[19.187,4.056],[19.185,4.006],[19.183,3.956],[19.181,3.906],[19.178,3.856],[19.176,3.806],[19.173,3.756],[19.17,3.706],[19.167,3.657],[19.164,3.607],[19.16,3.557],[19.156,3.507],[19.152,3.457],[19.148,3.407],[19.143,3.358],[19.138,3.308],[19.133,3.258],[19.127,3.208],[19.121,3.159],[19.114,3.109],[19.108,3.06],[19.1,3.01],[19.093,2.961],[19.085,2.911],[19.076,2.862],[19.067,2.813],[19.058,2.764],[19.048,2.715],[19.037,2.666],[19.026,2.617],[19.014,2.569],[19.001,2.52],[18.988,2.472],[18.973,2.424],[18.958,2.377],[18.942,2.329],[18.925,2.282],[18.907,2.236],[18.888,2.19],[18.867,2.144],[18.846,2.099],[18.824,2.054],[18.8,2.01],[18.776,1.966],[18.75,1.923],[18.724,1.881],[18.696,1.839],[18.668,1.798],[18.639,1.757],[18.609,1.717],[18.579,1.677],[18.548,1.638],[18.516,1.6],[18.483,1.562],[18.45,1.524],[18.417,1.487],[18.383,1.45],[18.348,1.414],[18.314,1.378],[18.279,1.342],[18.243,1.307],[18.207,1.272],[18.171,1.237],[18.135,1.203],[18.099,1.169],[18.062,1.135],[18.025,1.101],[17.987,1.068],[17.95,1.035],[17.912,1.002],[17.874,0.97],[17.836,0.938],[17.797,0.906],[17.759,0.874],[17.72,0.843],[17.681,0.811],[17.642,0.78],[17.602,0.75],[17.563,0.719],[17.523,0.689],[17.483,0.658],[17.443,0.628],[17.403,0.599],[17.363,0.569],[17.322,0.54],[17.282,0.51],[17.241,0.482],[17.2,0.453],[17.159,0.424],[17.117,0.396],[17.076,0.368],[17.034,0.341],[16.993,0.313],[16.951,0.286],[16.909,0.259],[16.866,0.232],[16.824,0.206],[16.781,0.179],[16.739,0.153],[16.696,0.127],[16.653,0.102],[16.61,0.077],[16.567,0.052],[16.523,0.027],[16.48,0.002],[16.436,-0.022],[16.392,-0.046],[16.348,-0.07],[16.304,-0.093],[16.26,-0.117],[16.215,-0.14],[16.171,-0.162],[16.126,-0.185],[16.081,-0.207],[16.036,-0.229],[15.991,-0.25],[15.946,-0.272],[15.901,-0.293],[15.855,-0.314],[15.81,-0.335],[15.764,-0.355],[15.718,-0.375],[15.673,-0.395],[15.627,-0.415],[15.581,-0.435],[15.535,-0.455],[15.489,-0.474],[15.442,-0.493],[15.396,-0.512],[15.35,-0.531],[15.303,-0.549],[15.257,-0.568],[15.21,-0.586],[15.164,-0.604],[15.117,-0.622],[15.07,-0.64],[15.024,-0.657],[14.977,-0.675],[14.93,-0.692],[14.883,-0.709],[14.836,-0.726],[14.788,-0.742],[14.741,-0.758],[14.694,-0.774],[14.646,-0.79],[14.599,-0.805],[14.551,-0.82],[14.503,-0.835],[14.455,-0.85],[14.407,-0.864],[14.359,-0.878],[14.311,-0.892],[14.263,-0.905],[14.215,-0.918],[14.167,-0.931],[14.118,-0.943],[14.07,-0.956],[14.021,-0.967],[13.972,-0.979],[13.924,-0.99],[13.875,-1.001],[13.826,-1.012],[13.777,-1.022],[13.728,-1.033],[13.679,-1.043],[13.63,-1.052],[13.581,-1.062],[13.532,-1.071],[13.483,-1.08],[13.434,-1.089],[13.384,-1.098],[13.335,-1.106],[13.286,-1.115],[13.236,-1.123],[13.187,-1.131],[13.138,-1.138],[13.088,-1.146],[13.039,-1.153],[12.989,-1.16],[12.94,-1.167],[12.89,-1.174],[12.841,-1.181],[12.791,-1.187],[12.741,-1.193],[12.692,-1.199],[12.642,-1.205],[12.592,-1.211],[12.543,-1.216],[12.493,-1.222],[12.443,-1.227],[12.394,-1.232],[12.344,-1.237],[12.294,-1.242],[12.244,-1.246],[12.195,-1.251],[12.145,-1.255],[12.095,-1.26],[12.045,-1.264],[11.995,-1.268],[11.945,-1.272],[11.896,-1.275],[11.846,-1.279],[11.796,-1.283],[11.746,-1.286],[11.696,-1.29],[11.646,-1.293],[11.596,-1.296],[11.546,-1.299],[11.496,-1.302],[11.447,-1.305],[11.397,-1.308],[11.347,-1.311],[11.297,-1.313],[11.247,-1.316],[11.197,-1.318],[11.147,-1.321],[11.097,-1.323],[11.047,-1.326],[10.997,-1.328],[10.947,-1.33],[10.897,-1.332],[10.847,-1.334],[10.797,-1.336],[10.747,-1.338],[10.697,-1.34],[10.647,-1.342],[10.597,-1.344],[10.547,-1.345],[10.497,-1.347],[10.447,-1.349],[10.398,-1.35],[10.348,-1.352],[10.298,-1.354],[10.248,-1.355],[10.198,-1.356],[10.148,-1.358],[10.098,-1.359],[10.048,-1.36],[9.998,-1.361],[9.948,-1.363],[9.898,-1.364],[9.848,-1.365],[9.798,-1.366],[9.748,-1.367],[9.698,-1.369],[9.648,-1.37],[9.598,-1.371],[9.548,-1.373],[9.498,-1.374],[9.448,-1.375],[9.398,-1.376],[9.348,-1.377],[9.298,-1.378],[9.248,-1.378],[9.198,-1.379],[9.148,-1.379],[9.098,-1.379],[9.048,-1.379],[8.998,-1.38],[8.948,-1.38],[8.898,-1.38],[8.848,-1.38],[8.798,-1.381],[8.748,-1.381],[8.698,-1.382],[8.648,-1.382],[8.598,-1.383],[8.548,-1.384],[8.498,-1.385],[8.448,-1.387],[8.398,-1.388],[8.348,-1.389],[8.298,-1.39],[8.248,-1.392],[8.198,-1.393],[8.148,-1.394],[8.098,-1.395],[8.048,-1.395],[7.998,-1.396],[7.948,-1.396],[7.898,-1.397],[7.848,-1.397],[7.798,-1.397],[7.748,-1.397],[7.698,-1.397],[7.648,-1.397],[7.598,-1.397],[7.548,-1.397],[7.498,-1.397],[7.448,-1.397],[7.398,-1.397],[7.348,-1.397],[7.298,-1.397],[7.248,-1.397],[7.198,-1.397],[7.148,-1.397],[7.098,-1.397],[7.048,-1.397],[6.998,-1.397],[6.948,-1.397],[6.898,-1.397],[6.848,-1.397],[6.798,-1.397],[6.748,-1.397],[6.698,-1.397],[6.648,-1.397],[6.598,-1.397],[6.548,-1.397],[6.498,-1.397],[6.448,-1.397],[6.398,-1.397],[6.348,-1.397],[6.298,-1.397],[6.248,-1.397],[6.198,-1.397],[6.148,-1.397],[6.098,-1.397],[6.048,-1.397],[5.998,-1.397],[5.948,-1.397],[5.898,-1.397],[5.848,-1.397],[5.798,-1.397],[5.748,-1.397],[5.698,-1.397],[5.648,-1.397],[5.598,-1.397],[5.548,-1.397],[5.498,-1.397],[5.448,-1.397],[5.398,-1.397],[5.348,-1.397],[5.298,-1.397],[5.248,-1.397],[5.198,-1.397],[5.148,-1.397],[5.098,-1.397],[5.048,-1.397],[4.998,-1.397],[4.948,-1.397],[4.898,-1.397],[4.848,-1.397],[4.798,-1.397],[4.748,-1.397],[4.698,-1.397],[4.648,-1.397],[4.598,-1.397],[4.548,-1.397],[4.498,-1.397],[4.448,-1.397],[4.398,-1.397],[4.348,-1.397],[4.298,-1.397],[4.248,-1.397],[4.198,-1.397],[4.148,-1.397],[4.098,-1.397],[4.048,-1.397],[3.998,-1.397],[3.948,-1.397],[3.898,-1.397],[3.848,-1.397],[3.798,-1.397],[3.748,-1.397],[3.698,-1.397],[3.648,-1.397],[3.598,-1.397],[3.548,-1.397],[3.498,-1.397],[3.448,-1.397],[3.398,-1.397],[3.348,-1.397],[3.298,-1.397],[3.248,-1.397],[3.198,-1.397],[3.148,-1.397],[3.098,-1.397],[3.048,-1.397],[2.998,-1.397],[2.948,-1.397],[2.898,-1.397],[2.848,-1.396],[2.798,-1.396],[2.748,-1.395],[2.698,-1.395],[2.648,-1.394],[2.598,-1.393],[2.548,-1.392],[2.498,-1.39],[2.448,-1.389],[2.398,-1.388],[2.348,-1.386],[2.298,-1.385],[2.248,-1.383],[2.198,-1.382],[2.148,-1.381],[2.098,-1.38],[2.048,-1.378],[1.998,-1.377],[1.948,-1.375],[1.898,-1.374],[1.848,-1.372],[1.798,-1.371],[1.748,-1.369],[1.698,-1.367],[1.648,-1.365],[1.599,-1.362],[1.549,-1.36],[1.499,-1.358],[1.449,-1.355],[1.399,-1.352],[1.349,-1.349],[1.299,-1.347],[1.249,-1.343],[1.199,-1.34],[1.149,-1.337],[1.099,-1.333],[1.05,-1.33],[1.0,-1.326],[0.95,-1.322],[0.9,-1.317],[0.85,-1.313],[0.801,-1.308],[0.751,-1.303],[0.701,-1.297],[0.651,-1.291],[0.602,-1.285],[0.552,-1.279],[0.503,-1.272],[0.453,-1.264],[0.404,-1.256],[0.355,-1.248],[0.305,-1.238],[0.256,-1.229],[0.208,-1.218],[0.159,-1.207],[0.11,-1.195],[0.062,-1.182],[0.014,-1.167],[-0.033,-1.152],[-0.08,-1.135],[-0.127,-1.117],[-0.173,-1.097],[-0.218,-1.075],[-0.261,-1.051],[-0.304,-1.025],[-0.345,-0.996],[-0.385,-0.966],[-0.423,-0.933],[-0.458,-0.898],[-0.492,-0.861],[-0.523,-0.822],[-0.553,-0.781],[-0.58,-0.739],[-0.605,-0.696],[-0.628,-0.652],[-0.65,-0.607],[-0.67,-0.561],[-0.689,-0.515],[-0.707,-0.468],[-0.724,-0.421],[-0.739,-0.374],[-0.753,-0.326],[-0.766,-0.277],[-0.777,-0.229],[-0.787,-0.18],[-0.796,-0.13],[-0.803,-0.081],[-0.808,-0.031],[-0.813,0.019],[-0.816,0.068],[-0.819,0.118],[-0.82,0.168],[-0.821,0.218],[-0.82,0.268],[-0.82,0.318],[-0.819,0.368],[-0.818,0.418],[-0.816,0.468],[-0.815,0.518],[-0.813,0.568],[-0.812,0.618],[-0.81,0.668],[-0.809,0.718],[-0.809,0.768],[-0.808,0.818],[-0.808,0.868],[-0.807,0.918],[-0.807,0.968],[-0.807,1.018],[-0.808,1.068],[-0.808,1.118],[-0.809,1.168],[-0.81,1.218],[-0.812,1.268],[-0.813,1.318],[-0.815,1.368],[-0.817,1.418],[-0.819,1.468],[-0.821,1.518],[-0.823,1.568],[-0.825,1.618],[-0.827,1.668],[-0.83,1.718],[-0.832,1.768],[-0.834,1.818],[-0.837,1.868],[-0.84,1.918],[-0.843,1.967],[-0.846,2.017],[-0.85,2.067],[-0.854,2.117],[-0.858,2.167],[-0.863,2.217],[-0.868,2.266],[-0.873,2.316],[-0.879,2.366],[-0.886,2.415],[-0.892,2.465],[-0.9,2.514],[-0.908,2.564],[-0.917,2.613],[-0.926,2.662],[-0.936,2.711],[-0.947,2.76],[-0.959,2.808],[-0.972,2.857],[-0.985,2.905],[-1.0,2.953],[-1.015,3.0],[-1.032,3.047],[-1.049,3.094],[-1.067,3.141],[-1.085,3.188],[-1.104,3.234],[-1.124,3.28],[-1.145,3.325],[-1.165,3.371],[-1.186,3.416],[-1.208,3.461],[-1.229,3.506],[-1.251,3.551],[-1.273,3.596],[-1.295,3.641],[-1.316,3.686],[-1.338,3.732],[-1.359,3.777],[-1.38,3.822],[-1.401,3.868],[-1.421,3.914],[-1.44,3.96],[-1.458,4.006],[-1.476,4.053],[-1.492,4.1],[-1.507,4.148],[-1.521,4.196],[-1.533,4.245],[-1.544,4.293],[-1.552,4.343],[-1.559,4.392],[-1.564,4.442],[-1.566,4.492],[-1.566,4.542],[-1.564,4.592],[-1.56,4.642],[-1.553,4.691],[-1.545,4.741],[-1.534,4.789],[-1.521,4.838],[-1.506,4.885],[-1.488,4.932],[-1.47,4.979],[-1.449,5.024],[-1.427,5.069],[-1.403,5.113],[-1.378,5.156],[-1.352,5.199],[-1.325,5.241],[-1.296,5.282],[-1.267,5.323],[-1.238,5.363],[-1.207,5.403],[-1.177,5.442],[-1.145,5.481],[-1.114,5.52],[-1.082,5.558],[-1.05,5.597],[-1.017,5.635],[-0.985,5.673],[-0.952,5.711],[-0.92,5.749],[-0.887,5.786],[-0.854,5.824],[-0.821,5.862],[-0.789,5.9],[-0.756,5.938],[-0.723,5.975],[-0.691,6.013],[-0.658,6.051],[-0.625,6.089],[-0.593,6.127],[-0.56,6.165],[-0.528,6.203],[-0.496,6.241],[-0.463,6.279],[-0.431,6.317],[-0.398,6.355],[-0.366,6.393],[-0.333,6.431],[-0.3,6.469],[-0.268,6.507],[-0.235,6.545],[-0.202,6.582],[-0.169,6.62],[-0.136,6.657],[-0.103,6.695],[-0.07,6.732],[-0.037,6.77],[-0.003,6.807],[0.03,6.844],[0.064,6.881],[0.097,6.919],[0.131,6.956],[0.164,6.993],[0.198,7.029],[0.232,7.066],[0.266,7.103],[0.3,7.14],[0.334,7.176],[0.368,7.213],[0.402,7.25],[0.436,7.286],[0.47,7.322],[0.505,7.359],[0.539,7.395],[0.574,7.431],[0.608,7.467],[0.643,7.503],[0.678,7.539],[0.713,7.575],[0.748,7.61],[0.783,7.646],[0.819,7.681],[0.854,7.716],[0.89,7.751],[0.926,7.786],[0.962,7.82],[0.999,7.855],[1.035,7.889],[1.072,7.922],[1.109,7.956],[1.146,7.989],[1.184,8.022],[1.222,8.055],[1.26,8.087],[1.299,8.119],[1.337,8.151],[1.377,8.182],[1.416,8.212],[1.456,8.242],[1.497,8.272],[1.537,8.3],[1.579,8.329],[1.62,8.356],[1.662,8.383],[1.705,8.41],[1.748,8.435],[1.791,8.46],[1.835,8.484],[1.879,8.508],[1.924,8.53],[1.969,8.552],[2.015,8.572],[2.06,8.592],[2.107,8.612],[2.153,8.63],[2.2,8.647],[2.247,8.664],[2.295,8.68],[2.342,8.694],[2.39,8.709],[2.438,8.722],[2.487,8.735],[2.535,8.747],[2.584,8.758],[2.633,8.769],[2.682,8.779],[2.731,8.789],[2.78,8.798],[2.829,8.807],[2.879,8.815],[2.928,8.823],[2.977,8.83],[3.027,8.837],[3.077,8.843],[3.126,8.849],[3.176,8.854],[3.226,8.859],[3.276,8.863],[3.325,8.867],[3.375,8.869],[3.425,8.871],[3.475,8.872],[3.525,8.872],[3.575,8.872],[3.625,8.87],[3.675,8.868],[3.725,8.865],[3.775,8.861],[3.825,8.856],[3.874,8.85],[3.924,8.843],[3.973,8.836],[4.023,8.827],[4.072,8.818],[4.121,8.807],[4.169,8.795],[4.217,8.781],[4.265,8.764],[4.312,8.743],[4.358,8.718],[4.404,8.689],[4.448,8.655],[4.492,8.619],[4.534,8.579],[4.575,8.537],[4.614,8.493],[4.652,8.448],[4.688,8.402],[4.723,8.354],[4.757,8.307],[4.79,8.262],[4.822,8.216],[4.854,8.173],[4.885,8.13],[4.916,8.091],[4.946,8.053],[4.977,8.019],[5.008,7.987],[5.04,7.957],[5.072,7.931],[5.105,7.908],[5.14,7.887],[5.176,7.87],[5.214,7.856],[5.255,7.844],[5.297,7.836],[5.34,7.829],[5.386,7.825],[5.432,7.822],[5.477,7.821],[5.512,7.817],[5.561,7.819],[5.611,7.821],[5.657,7.822],[5.707,7.824],[5.757,7.826],[5.807,7.827],[5.857,7.828],[5.907,7.829],[5.957,7.83],[6.007,7.83]],"yc":7.848,"Wx":9.526,"hexY":7.83};
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
  const clear=(x,y)=>{if(Math.abs(x-tunX)<1.15&&y>tunY-0.4&&y<tunY+0.66)return true;const cx=Math.floor(x/cell),cy=Math.floor(y/cell);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const L=hash.get(hk(cx+a,cy+b));if(!L)continue;for(const s of L){const dx=(x-s.x)/CX,dy=y-s.y,q=dy>0?dy/CS:dy/CN;if(dx*dx+q*q<1)return true;}}return false;};
  const tun={x:D.Wx,yc:D.yc,h:0.22,hw:0.36,ramp:0.5,mhw:0.26,gapW:0.11};
  const hexY=D.hexY;
  CAMPUS_TRAIN_MODEL={S,clear,tun,zone:{y0:tun.yc-0.9,y1:tun.yc+0.82},lampY:tun.yc+0.55,hexY,
    len:acc[acc.length-1],pts:src};
  return CAMPUS_TRAIN_MODEL;
}
/* ---- the track: gravel bed, sleepers and two steel rails, drawn flat on the ground layer ---- */
function campusDrawTrack(g,TR,X,Y,RS,rng){
  const S=TR.S,K=CT_K,off=o=>S.map(s=>[X(s.x+s.nx*o),Y((s.py+s.ny*o)*K)]);
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

function campusObjectSprite(o,R){
  const unit=(o.fu||0.075*(o.s||1))*R;
  return {x:o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>{
    if(o.tunnel){campusDrawTunnel(ctx, o.train, v=>x+(v-o.x)*R, v=>y+(v-o.y)*R, R);return;}
    if(o.car){cmCar(ctx,v=>x+(v-o.x)*R,v=>y+(v-o.y)*R,R,o);return;}
    const asset=CAMPUS_ASSETS[o.k];
    if(!asset)throw new Error(`Missing campus scenery asset: ${o.k}`);
    asset.draw(ctx,x,y,unit,o.v);
  }};
}

/* ===== BAKE ===== */
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
  /* ---------- 2. PARKING LOT ---------- */
  g.save();g.lineJoin='round';g.lineCap='round';
  poly(g,M.lot);g.strokeStyle='rgba(52,104,40,.30)';g.lineWidth=RS*0.62;g.stroke();              /* shaded verge */
  poly(g,M.lot);g.strokeStyle='rgba(30,40,26,.22)';g.lineWidth=RS*0.26;g.stroke();                /* curb shadow */
  poly(g,M.lot);g.strokeStyle='#cdd0cf';g.lineWidth=RS*0.15;g.stroke();                           /* concrete curb */
  poly(g,M.lot);g.strokeStyle='#e4e6e3';g.lineWidth=RS*0.05;g.stroke();
  poly(g,M.lot);const ag=g.createLinearGradient(0,Y(10.6),0,Y(F.y1));ag.addColorStop(0,'#8a9099');ag.addColorStop(1,'#767c85');g.fillStyle=ag;g.fill();
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
    if(M.hexNear(x,y,1.13)||M.inPlot(x,y)||M.inLot(x,y,0.5)||M.inPlaza(x,y,0.5)||M.inWalk(x,y,0.55)||M.inPond(x,y,0.5)||M.medBlock(x,y,0.4))continue;
    let dh=1e9;for(const h of M.hexes){const d=Math.hypot(x-h.x,(y-h.y)*1.4);if(d<dh)dh=d;}dh-=0.95;
    let p=1;if(dh<1.4)p*=0.5+0.5*Math.max(0,dh)/1.4;const dl=M.inLot(x,y,5)?cmDistPoly(M.lot,x,y):9;if(dl<1.5)p*=0.55+0.45*(dl-0.5)/1.0;
    if(M.inMeadow(x,y))p*=0.05;if(rng()>p)continue;if(!free(x,y))continue;
    const cx=Math.floor(x/cell),cy=Math.floor(y/cell),kk=hk(cx,cy);(hash.get(kk)||hash.set(kk,[]).get(kk)).push([x,y]);
    const ty=(y-F.y0)/M.FH,reg=ty<0.33?'top':ty<0.66?'mid':'bottom',w=Object.assign({},CAMPUS_REGION[reg]),cl=0.5+0.5*Math.sin(x*0.55+Math.cos(y*0.4)*1.8)*Math.cos(y*0.35-x*0.2);
    const far=Math.min(1,Math.max(0,(Math.hypot((x-9.0)/1.0,(y-3.9)*1.5)-7)/12));          /* 0 near the park -> 1 deep forest */
    ['spruce','fir','youngSpruce'].forEach(k=>w[k]*=(0.55+1.3*cl)*(1+1.6*far));['linden','appleTree','beech','birch','maple'].forEach(k=>w[k]*=(0.55+1.3*(1-cl))*(1-0.55*far)*(k==='maple'?1-0.7*far:1));
    const bigS=(1.2+rng()*0.55)*(0.86+0.14*Math.min(1,Math.max(0,dh)/1.5));
    trees.push(add(cmPick(w,rng),x,y,bigS,{nat:true}));
    if(rng()<0.5){const ux=x+(rng()-0.5)*0.5,uy=y+0.1+rng()*0.1;if(!M.inPlot(ux,uy))add(CAMPUS_UNDER[Math.floor(rng()*CAMPUS_UNDER.length)],ux,uy,0.85+rng()*0.4,{nat:true});}
  }
  /* meadow dressing */
  M.meadows.forEach(m=>{for(let k=0;k<34;k++){const a=rng()*6.283,rr=Math.sqrt(rng())*0.92,x=m[0]+Math.cos(a)*m[2]*rr,y=m[1]+Math.sin(a)*m[3]*rr;if(M.hexNear(x,y,1.1)||M.inPlot(x,y)||M.inLot(x,y,0.4))continue;add(['wildflowers','sunflowers','grassTuft','wildflowers','fern','geraniumBush'][k%6],x,y,0.85+rng()*0.5,{nat:true});}
    for(let k=0;k<3;k++){const a=rng()*6.283,rr=0.3+rng()*0.55;add(['appleTree','birch','appleTree'][k],m[0]+Math.cos(a)*m[2]*rr,m[1]+Math.sin(a)*m[3]*rr,1.1+rng()*0.3);}});
  /* lot: planted medians, lamps, north hedge line, cars */
  M.med.forEach((m,i)=>{let j=0;cmWalk([m.a,m.b],0.95,(x,y)=>{add(['youngSpruce','appleTree','birch'][(i+j++)%3],x,y,0.72,{layer:'front'});add(j%2?'hedge':'geraniumBush',x+0.02,y+0.45,0.55,{layer:'front'});});
    [m.a,m.b,[(m.a[0]+m.b[0])/2,(m.a[1]+m.b[1])/2]].forEach((q,qi)=>add('lampPost',q[0]+(qi===2?0:0),q[1]+(qi===0?-0.05:0.0),0.95,{layer:'front'}));});
  {let n=0;cmWalk(M.lot,0.5,(x,y,nx,ny)=>{if(cmInPoly(M.lot,x+nx*0.15,y+ny*0.15)){nx=-nx;ny=-ny;}if(ny>-0.25)return;const px=x+nx*0.34,py=y+ny*0.34;if(Math.abs(px-Wk.x)<0.95&&py>Wk.y0)return;if(M.hexNear(px,py,1.1))return;
    add('hedge',px,py,0.78+rng()*0.2);if(++n%5===0)add(['youngSpruce','birch','appleTree'][n%3],px+nx*0.28,py+ny*0.28,0.85);},true);}
  const lay=campusLotLayout(M,mulberry(99));lay.stalls.forEach(s=>{if(rng()<0.42)objs.push(Object.assign({car:true,layer:'front',len:0.34+rng()*0.06,wid:0.17,col:CAMPUS_CAR_COLS[Math.floor(rng()*CAMPUS_CAR_COLS.length)]},s)),tally.car=(tally.car||0)+1;});
  /* walk + circle */
  for(const sx of [-1,1]){for(let y=Wk.y0+0.4;y<P.cy-P.ry-0.12;y+=0.5)if(!(TR&&y>TR.zone.y0&&y<TR.zone.y1))add('hedge',Wk.x+sx*0.52,y,0.55,{layer:'front'});for(let y=P.cy+P.ry+0.12;y<Wk.y1-0.04;y+=0.5)add('hedge',Wk.x+sx*0.52,y,0.55,{layer:'front'});
    add('lampPost',Wk.x+sx*0.66,TR?TR.lampY:8.05,1.0,{layer:'front'});add('lampPost',Wk.x+sx*0.66,10.25,1.0,{layer:'front'});}
  for(let k=0;k<10;k++){const a=k/10*6.283+0.3;add('geraniumBush',P.cx+Math.cos(a)*P.rx*0.69,P.cy+Math.sin(a)*P.ry*0.69,0.62,{layer:'front'});}
  add('fountainBig',P.cx,P.cy,1,{layer:'front',fu:0.58/7.2});
  /* clearings, applied AFTER generation so the forest everywhere else is exactly the same: the added station hex (both maps) and the train corridor (train map) */
  {let removed=0;for(let i=objs.length-1;i>=0;i--){const o=objs[i];if(!o.nat)continue;if(M.stationNear(o.x,o.y,1.13)||(TR&&TR.clear(o.x,o.y))){tally[o.k]--;objs.splice(i,1);removed++;}}
   for(let i=trees.length-1;i>=0;i--)if(objs.indexOf(trees[i])<0)trees.splice(i,1);tally._cleared=removed;}
  if(TR)objs.push({tunnel:true,train:TR,x:TR.tun.x,y:TR.tun.yc+0.5,k:'tunnel',fu:2});
  const inlays=M.plots.map((p,i)=>campusBakePlot(M,p,RS,7000+i*31));
  const sprites=objs.concat(...inlays.map(inlay=>inlay.objects)).map(o=>campusObjectSprite(o,R));
  const camp={ground:gC,inlays,sprites,w:Wpx,h:Hpx,ox:X(0),oy:Y(0),R,scale:S,
    hexes:M.hexes.concat(M.station?[M.station]:[]).map(h=>({u:h.u,r:h.r,tone:h.tone,x:h.x*RS,y:h.y*RS})),            /* centres relative to the anchor (hex u=0,r=0) */
    entrance:{x:M.ent.x*RS,y:M.ent.y*RS,u:M.ent.u,r:M.ent.r},
    station:M.station?{u:M.station.u,r:M.station.r,x:M.station.x*RS,y:M.station.y*RS}:null,
    train:TR?{track:TR.S.map(s=>[Math.round(s.x*RS*10)/10,Math.round(s.y*RS*10)/10]),lengthR:TR.len,tunnel:{x:TR.tun.x*RS,y:TR.tun.yc*RS,portalHalfSpan:0.75*RS,deckHeight:TR.tun.h*RS}}:null,
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


return {bake:bakeCampus,drawGround:drawCampusGround,drawInlays:drawCampusInlays,clear:()=>{CAMPUS_CACHE={};}};
})();
const packs = {small, smallTrain, medium, mediumTrain};
let previous = null;
return { get(tier, train) { const key = tier + (train ? 'Train' : ''); const pack = packs[key]; if (!pack) throw new RangeError(`Unknown campus scenery: ${key}`); if (previous && previous !== pack) previous.clear(); previous = pack; return pack; } };
})();
