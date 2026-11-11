/* Imported medium campus surroundings. */
const MEDIUM_CAMPUS_SCENERY = (() => {

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
const CAMPUS_GEO={"frame":{"x0":-13.222,"x1":31.97,"y0":-2.483,"y1":16.673},"hexes":[[0.5,0,"g"],[1.5,0,"g"],[2.5,0,"g"],[4.5,0,"w"],[5.5,0,"w"],[6.5,0,"w"],[1.0,1,"g"],[2.0,1,"g"],[3.0,1,"g"],[4.0,1,"w"],[5.0,1,"w"],[6.0,1,"w"],[7.0,1,"w"],[9.0,1,"w"],[1.5,2,"g"],[2.5,2,"g"],[3.5,2,"g"],[4.5,2,"w"],[5.5,2,"w"],[6.5,2,"w"],[7.5,2,"w"],[8.5,2,"w"],[9.5,2,"w"],[1.0,3,"g"],[2.0,3,"g"],[3.0,3,"g"],[5.0,3,"w"],[6.0,3,"w"],[8.0,3,"w"],[9.0,3,"w"],[10.0,3,"w"],[0.5,4,"g"],[1.5,4,"g"],[2.5,4,"g"],[4.5,4,"g"],[5.5,4,"g"],[6.5,4,"g"],[9.5,4,"w"],[0.0,5,"g"],[1.0,5,"g"],[2.0,5,"g"],[4.0,5,"g"],[5.0,5,"g"],[6.0,5,"g"],[7.0,5,"g"],[8.0,5,"g"],[9.0,5,"g"],[10.0,5,"g"],[0.5,6,"g"],[1.5,6,"g"],[2.5,6,"g"],[4.5,6,"g"],[5.5,6,"g"],[6.5,6,"g"],[7.5,6,"g"],[8.5,6,"g"],[9.5,6,"g"],[2.0,7,"g"],[3.0,7,"g"],[4.0,7,"g"],[5.0,7,"g"],[6.0,7,"g"],[7.0,7,"g"],[8.0,7,"g"],[9.0,7,"g"],[1.5,8,"g"],[2.5,8,"g"],[3.5,8,"g"],[5.5,8,"e"],[7.5,8,"g"],[8.5,8,"g"],[9.5,8,"g"],[2.0,9,"g"]],"lot":[[23.826,14.09],[23.641,13.444],[22.583,12.495],[18.193,9.306],[17.664,9.164],[16.739,9.225],[13.01,10.234],[11.371,10.557],[11.344,10.698],[7.351,10.719],[5.315,10.537],[4.337,10.315],[2.221,9.608],[1.164,9.427],[0.714,9.447],[0.026,9.75],[-0.661,10.254],[-3.12,12.576],[-3.94,13.161],[-4.363,13.746],[-4.363,13.968],[-4.178,14.211],[-3.279,14.816],[-1.296,15.503],[0.106,15.886],[2.644,16.27],[6.426,16.391],[15.84,16.229],[18.748,16.088],[20.573,15.906],[21.551,15.725],[22.503,15.361],[23.588,14.554]],"pond":[[7.219,2.442],[6.77,2.362],[6.479,2.442],[6.294,2.584],[6.346,2.685],[6.32,2.866],[5.58,3.492],[5.262,4.037],[4.945,4.4],[4.945,4.522],[5.342,4.865],[5.315,5.289],[5.659,5.49],[5.87,5.531],[6.029,5.49],[6.267,5.309],[6.32,5.188],[5.765,4.824],[5.606,4.501],[5.606,4.098],[5.685,3.997],[6.135,3.815],[6.399,3.633],[6.426,3.331],[6.584,3.189],[7.298,2.826],[7.536,2.644],[7.431,2.523]],"medians":[{"a":[2.04,11.055],"b":[-0.878,14.185]},{"a":[4.344,11.64],"b":[2.641,14.973]},{"a":[7.233,11.64],"b":[6.531,15.552]},{"a":[11.687,11.499],"b":[12.603,15.541]},{"a":[14.804,11.055],"b":[17.776,14.963]},{"a":[17.155,10.288],"b":[21.693,14.195]}],"entrance":[5.5,8],"plaza":{"cx":9.526,"cy":9.063,"rx":1.12,"ry":0.76},"walk":{"x":9.526,"y0":7.41,"y1":10.698,"w":0.72},"hub":[9.07,3.172],"tiling":[["Bm",[[2.5,0],[1.5,0],[0.5,0],[3.0,1],[2.0,1],[1.0,1],[3.5,2],[2.5,2],[1.5,2],[3.0,3],[2.0,3],[1.0,3]]],["A",[[4.5,0],[5.5,0],[6.5,0],[4.0,1],[5.0,1],[6.0,1],[7.0,1],[4.5,2],[5.5,2],[6.5,2],[5.0,3],[6.0,3]]],["Cm",[[9.0,1],[9.5,2],[8.5,2],[7.5,2],[10.0,3],[9.0,3],[8.0,3],[9.5,4]]],["D",[[0.5,4],[1.5,4],[2.5,4],[0.0,5],[1.0,5],[2.0,5],[0.5,6],[1.5,6]]],["A",[[4.5,4],[5.5,4],[6.5,4],[4.0,5],[5.0,5],[6.0,5],[7.0,5],[4.5,6],[5.5,6],[6.5,6],[5.0,7],[6.0,7]]],["B",[[8.0,5],[9.0,5],[10.0,5],[7.5,6],[8.5,6],[9.5,6],[7.0,7],[8.0,7],[9.0,7],[7.5,8],[8.5,8],[9.5,8]]],["C",[[2.5,6],[2.0,7],[3.0,7],[4.0,7],[1.5,8],[2.5,8],[3.5,8],[2.0,9]]]]};
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
  const hexes=G.hexes.map(([u,r,t])=>({u,r,x:u*CW3,y:r*0.87,tone:t==='g'?'gray':t==='w'?'white':'entrance'}));
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
  CAMPUS_MODEL={G,F,hexes,ent,plots,inPlot,lot,pond,P,W,med,medBlock,hexNear,inPlaza,inWalk,inLot,inPond,meadows,inMeadow,layerOf,FW:F.x1-F.x0,FH:F.y1-F.y0};
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

function campusObjectSprite(o,R){
  const unit=(o.fu||0.075*(o.s||1))*R;
  return {x:o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>{
    if(o.car){cmCar(ctx,v=>x+(v-o.x)*R,v=>y+(v-o.y)*R,R,o);return;}
    const asset=CAMPUS_ASSETS[o.k];
    if(!asset)throw new Error(`Missing campus scenery asset: ${o.k}`);
    asset.draw(ctx,x,y,unit,o.v);
  }};
}

/* ===== BAKE ===== */
let CAMPUS_CACHE={};
function bakeCampus(R,opts){
  opts=opts||{};const S=opts.scale||getBakeScale(),key=R+'|'+S;if(CAMPUS_CACHE[key]&&!opts.fresh)return CAMPUS_CACHE[key];
  const t0=performance.now(),M=campusModel(),F=M.F,RS=R*S,Wpx=Math.ceil(M.FW*RS),Hpx=Math.ceil(M.FH*RS);
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
    trees.push(add(cmPick(w,rng),x,y,bigS));
    if(rng()<0.5){const ux=x+(rng()-0.5)*0.5,uy=y+0.1+rng()*0.1;if(!M.inPlot(ux,uy))add(CAMPUS_UNDER[Math.floor(rng()*CAMPUS_UNDER.length)],ux,uy,0.85+rng()*0.4);}
  }
  /* meadow dressing */
  M.meadows.forEach(m=>{for(let k=0;k<34;k++){const a=rng()*6.283,rr=Math.sqrt(rng())*0.92,x=m[0]+Math.cos(a)*m[2]*rr,y=m[1]+Math.sin(a)*m[3]*rr;if(M.hexNear(x,y,1.1)||M.inPlot(x,y)||M.inLot(x,y,0.4))continue;add(['wildflowers','sunflowers','grassTuft','wildflowers','fern','geraniumBush'][k%6],x,y,0.85+rng()*0.5);}
    for(let k=0;k<3;k++){const a=rng()*6.283,rr=0.3+rng()*0.55;add(['appleTree','birch','appleTree'][k],m[0]+Math.cos(a)*m[2]*rr,m[1]+Math.sin(a)*m[3]*rr,1.1+rng()*0.3);}});
  /* lot: planted medians, lamps, north hedge line, cars */
  M.med.forEach((m,i)=>{let j=0;cmWalk([m.a,m.b],0.95,(x,y)=>{add(['youngSpruce','appleTree','birch'][(i+j++)%3],x,y,0.72,{layer:'front'});add(j%2?'hedge':'geraniumBush',x+0.02,y+0.45,0.55,{layer:'front'});});
    [m.a,m.b,[(m.a[0]+m.b[0])/2,(m.a[1]+m.b[1])/2]].forEach((q,qi)=>add('lampPost',q[0]+(qi===2?0:0),q[1]+(qi===0?-0.05:0.0),0.95,{layer:'front'}));});
  {let n=0;cmWalk(M.lot,0.5,(x,y,nx,ny)=>{if(cmInPoly(M.lot,x+nx*0.15,y+ny*0.15)){nx=-nx;ny=-ny;}if(ny>-0.25)return;const px=x+nx*0.34,py=y+ny*0.34;if(Math.abs(px-Wk.x)<0.95&&py>Wk.y0)return;if(M.hexNear(px,py,1.1))return;
    add('hedge',px,py,0.78+rng()*0.2);if(++n%5===0)add(['youngSpruce','birch','appleTree'][n%3],px+nx*0.28,py+ny*0.28,0.85);},true);}
  const lay=campusLotLayout(M,mulberry(99));lay.stalls.forEach(s=>{if(rng()<0.42)objs.push(Object.assign({car:true,layer:'front',len:0.34+rng()*0.06,wid:0.17,col:CAMPUS_CAR_COLS[Math.floor(rng()*CAMPUS_CAR_COLS.length)]},s)),tally.car=(tally.car||0)+1;});
  /* walk + circle */
  for(const sx of [-1,1]){for(let y=Wk.y0+0.4;y<P.cy-P.ry-0.12;y+=0.5)add('hedge',Wk.x+sx*0.52,y,0.55,{layer:'front'});for(let y=P.cy+P.ry+0.12;y<Wk.y1-0.04;y+=0.5)add('hedge',Wk.x+sx*0.52,y,0.55,{layer:'front'});
    add('lampPost',Wk.x+sx*0.66,8.05,1.0,{layer:'front'});add('lampPost',Wk.x+sx*0.66,10.25,1.0,{layer:'front'});}
  for(let k=0;k<10;k++){const a=k/10*6.283+0.3;add('geraniumBush',P.cx+Math.cos(a)*P.rx*0.69,P.cy+Math.sin(a)*P.ry*0.69,0.62,{layer:'front'});}
  add('fountainBig',P.cx,P.cy,1,{layer:'front',fu:0.58/7.2});
  const inlays=M.plots.map((p,i)=>campusBakePlot(M,p,RS,7000+i*31));
  const sprites=objs.concat(...inlays.map(inlay=>inlay.objects)).map(o=>campusObjectSprite(o,R));
  const camp={ground:gC,inlays,sprites,w:Wpx,h:Hpx,ox:X(0),oy:Y(0),R,scale:S,
    hexes:M.hexes.map(h=>({u:h.u,r:h.r,tone:h.tone,x:h.x*RS,y:h.y*RS})),            /* centres relative to the anchor (hex u=0,r=0) */
    entrance:{x:M.ent.x*RS,y:M.ent.y*RS,u:M.ent.u,r:M.ent.r},
    plaza:{x:P.cx*RS-0+0,y:P.cy*RS,rx:P.rx*RS,ry:P.ry*RS},walk:{x:Wk.x*RS,y0:Wk.y0*RS,y1:Wk.y1*RS,w:Wk.w*RS},
    landPlan:M.G.tiling.map(([n,cs])=>({shape:n.replace('m',''),mirror:/m$/.test(n),hexes:cs.map(c=>({u:c[0],r:c[1]}))})),
    stats:{inlays:inlays.map(q=>q.id+':'+q.count).join(', '),trees:trees.length,objects:objs.length,tally,ms:Math.round(performance.now()-t0),back:objs.filter(o=>o.layer==='back').length,front:objs.filter(o=>o.layer==='front').length}};
  CAMPUS_CACHE={[key]:camp};return camp;
}
/* anchor (ax,ay) = screen position of park hex (u=0,r=0); lands sit at ax+u*sqrt3*R, ay+r*0.87*R */
function drawCampusGround(ctx,ax,ay,c){ctx.drawImage(c.ground,ax-c.ox/c.scale,ay-c.oy/c.scale,c.w/c.scale,c.h/c.scale);}
function drawCampusInlays(ctx,ax,ay,c){c.inlays.forEach(q=>ctx.drawImage(q.canvas,ax-q.ox/c.scale,ay-q.oy/c.scale,q.w/c.scale,q.h/c.scale));}
function campusHexPos(c,u,r){return{x:u*CW3*c.R*c.scale,y:r*0.87*c.R*c.scale};}
function campusFootprint(){const F=CAMPUS_GEO.frame;return{w:F.x1-F.x0,h:F.y1-F.y0,x0:F.x0,y0:F.y0};}


return Object.freeze({bake: bakeCampus, drawGround: drawCampusGround, drawInlays: drawCampusInlays});
})();
