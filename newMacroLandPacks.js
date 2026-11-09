/* Depth-sliced Space and Fiesta Macro-Land packs. */
const spaceLandMacroPack = (() => {
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

/* ===== SPACE ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const SSH=(c,x,y,rx)=>{c.fillStyle='rgba(8,10,24,.34)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const SROCK=[['#6a6f7a','#8a90a0','#4e535e'],['#7a6a62','#9c8678','#5a4a44'],['#5e6a7a','#7e8ca0','#46525f'],['#74727a','#948f9c','#54525c']];
const SWHITE='#e6eaf0',SMETAL='#6a7280',SMETAL_D='#454c58',SGLOW='#7fe8ff',SBLUE='#3a7ad8',SORANGE='#f08a24';
const SBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.28),shade(col,0.12));
const SFLIP=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
const SPATH=(c,pts)=>{pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();};
/* a low boulder with three tones */
const SBOULDER=(c,x,y,rx,ry,pal,r)=>{TH.ell(c,x+rx*0.2,y+ry*0.32,rx*1.05,ry*0.42,'rgba(8,10,24,.3)');const j=()=>0.85+r()*0.3;TH.poly(c,[[x-rx,y],[x-rx*0.9*j(),y-ry*0.6],[x-rx*0.4,y-ry*1.05*j()],[x+rx*0.4,y-ry*0.98],[x+rx*0.95,y-ry*0.4*j()],[x+rx,y+ry*0.1],[x-rx*0.6,y+ry*0.22]],pal[0]);TH.poly(c,[[x+rx*0.22,y-ry*1.0],[x+rx*0.95,y-ry*0.4],[x+rx,y+ry*0.1],[x+rx*0.15,y+ry*0.06]],pal[2]);TH.poly(c,[[x-rx*0.9,y-ry*0.6],[x-rx*0.4,y-ry*1.05],[x+rx*0.12,y-ry*0.98],[x-rx*0.4,y-ry*0.5]],pal[1]);if(r()<0.5)TH.ln(c,[x-rx*0.6,y-ry*0.3],[x+rx*0.5,y-ry*0.2],'rgba(0,0,0,.22)',ry*0.07);};
/* capsule (cylinder seen obliquely) along an iso axis: ang = +0.4636 (X axis) or -0.4636 (Y axis) */
const SCAPSULE=(c,x,y,len,rad,ang,body,stripe,u)=>{c.save();c.translate(x,y);c.rotate(ang);const g=c.createLinearGradient(0,-rad,0,rad);g.addColorStop(0,shade(body,0.25));g.addColorStop(0.45,body);g.addColorStop(1,shade(body,-0.4));c.fillStyle=g;c.beginPath();c.moveTo(-len/2+rad*0.5,-rad);c.lineTo(len/2-rad*0.5,-rad);c.quadraticCurveTo(len/2+rad*0.2,-rad,len/2+rad*0.2,0);c.quadraticCurveTo(len/2+rad*0.2,rad,len/2-rad*0.5,rad);c.lineTo(-len/2+rad*0.5,rad);c.quadraticCurveTo(-len/2-rad*0.2,rad,-len/2-rad*0.2,0);c.quadraticCurveTo(-len/2-rad*0.2,-rad,-len/2+rad*0.5,-rad);c.closePath();c.fill();
  if(stripe){c.fillStyle=stripe;c.fillRect(-len*0.18,-rad,len*0.1,rad*2);c.fillRect(len*0.12,-rad,len*0.1,rad*2);}c.strokeStyle='rgba(0,0,0,.22)';c.lineWidth=u*0.05;for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(k*len*0.3,-rad);c.lineTo(k*len*0.3,rad);c.stroke();}c.restore();};
const SDISH=(c,x,y,r,tilt,u)=>{c.save();c.translate(x,y);c.rotate(tilt);const g=c.createRadialGradient(-r*0.2,-r*0.1,0,0,0,r);g.addColorStop(0,'#c8d0dc');g.addColorStop(1,'#7a8494');c.fillStyle=g;c.beginPath();c.ellipse(0,0,r,r*0.6,0,0,7);c.fill();c.strokeStyle='#e6eaf0';c.lineWidth=u*0.1;c.stroke();c.fillStyle='rgba(60,68,84,.5)';c.beginPath();c.ellipse(r*0.05,r*0.04,r*0.72,r*0.42,0,0,7);c.fill();TH.ln(c,[0,0],[r*0.5,-r*0.9],'#4a525e',u*0.07);TH.ell(c,r*0.5,-r*0.9,u*0.14,u*0.1,'#e6eaf0');c.restore();};
const SBEACON=(c,x,y,u,col)=>{const g=c.createRadialGradient(x,y,0,x,y,u*1.4);g.addColorStop(0,col.replace('1)','.6)'));g.addColorStop(1,col.replace('1)','0)'));c.fillStyle=g;c.beginPath();c.arc(x,y,u*1.4,0,7);c.fill();TH.ell(c,x,y,u*0.16,u*0.16,col.replace('rgba','rgb').replace(',1)',')'));};
const SCRATE=['#e8762a','#2a6ab0','#e6e8ee','#c0392b','#3a9a5a','#f2c230'];
/* ---- habitat modules: dome / pod / cube, 4 orientations (mirror x variant), glowing windows ---- */
const SHAB={
  domeHab(c,x,y,u,s,variant){const r=mulberry(s*7+3),acc=[SBLUE,SORANGE,'#3ab5a0','#c05ad8'][s%4],rx=u*2.0,rh=u*2.3,by=y-u*0.35;
    TH.ell(c,x,y,rx*1.18,rx*0.44,SMETAL_D);TH.ell(c,x,y-u*0.15,rx*1.12,rx*0.4,'#8a92a2');
    c.beginPath();c.moveTo(x-rx,by);c.bezierCurveTo(x-rx,by-rh*1.25,x+rx,by-rh*1.25,x+rx,by);c.ellipse(x,by,rx,rx*0.36,0,0,Math.PI);c.closePath();const g=c.createRadialGradient(x-rx*0.4,by-rh*0.75,rx*0.1,x,by-rh*0.4,rx*1.5);g.addColorStop(0,'#fafcff');g.addColorStop(0.55,'#d8dfea');g.addColorStop(1,'#8d97aa');c.fillStyle=g;c.fill();
    c.save();c.beginPath();c.moveTo(x-rx,by);c.bezierCurveTo(x-rx,by-rh*1.25,x+rx,by-rh*1.25,x+rx,by);c.ellipse(x,by,rx,rx*0.36,0,0,Math.PI);c.closePath();c.clip();c.strokeStyle='rgba(70,80,100,.45)';c.lineWidth=u*0.06;
    for(let k=-3;k<=3;k++){c.beginPath();c.moveTo(x+k*rx*0.32,by+rx*0.3);c.quadraticCurveTo(x+k*rx*0.18,by-rh*1.0,x,by-rh*0.95);c.stroke();}for(let k=1;k<=3;k++){c.beginPath();c.ellipse(x,by-rh*0.28*k+rx*0.05,rx*(1-k*0.22),rx*(0.36-k*0.05),0,0,Math.PI);c.stroke();}
    c.fillStyle=acc;c.fillRect(x-rx*1.1,by-rh*0.2,rx*2.2,u*0.28);for(let k=0;k<5;k++){const wx=x-rx*0.8+k*rx*0.4;c.fillStyle=r()<0.8?SGLOW:'#2a4a6a';c.fillRect(wx-u*0.2,by-rh*0.55,u*0.4,u*0.5);}c.restore();
    const tx=variant?-1:1,tb=[x+tx*rx*0.85,by+rx*0.12];c.save();c.fillStyle='#b8c0cc';c.beginPath();c.moveTo(tb[0],tb[1]-u*0.5);c.lineTo(tb[0]+tx*u*1.7,tb[1]+u*0.4-u*0.5);c.lineTo(tb[0]+tx*u*1.7,tb[1]+u*0.4+u*0.5);c.lineTo(tb[0],tb[1]+u*0.5);c.closePath();c.fill();c.strokeStyle='#6a7280';c.lineWidth=u*0.06;c.stroke();for(let k=1;k<4;k++)TH.ln(c,[tb[0]+tx*u*0.42*k,tb[1]-u*0.45+u*0.1*k],[tb[0]+tx*u*0.42*k,tb[1]+u*0.55+u*0.1*k],'rgba(60,68,84,.5)',u*0.05);TH.ell(c,tb[0]+tx*u*1.7,tb[1]+u*0.4,u*0.5,u*0.55,'#e6eaf0');TH.ell(c,tb[0]+tx*u*1.7,tb[1]+u*0.4,u*0.34,u*0.4,'#3a4a62');c.restore();
    TH.ln(c,[x,by-rh*0.98],[x,by-rh*1.45],'#454c58',u*0.08);SBEACON(c,x,by-rh*1.45,u,'rgba(255,60,60,1)');},
  podHab(c,x,y,u,s,variant){const r=mulberry(s*5+1),acc=[SBLUE,SORANGE,'#3ab5a0','#c05ad8'][s%4],ang=variant?-0.4636:0.4636,len=u*4.4,rad=u*1.05,cy=y-u*1.55;
    [[-0.32,0.0],[0.32,0.0]].forEach(([f])=>{const px=x+Math.cos(ang)*len*f,py=cy+Math.sin(ang)*len*f;TH.poly(c,[[px-u*0.25,py+rad*0.6],[px+u*0.25,py+rad*0.6],[px+u*0.5,y+u*0.1],[px-u*0.5,y+u*0.1]],SMETAL_D);TH.ell(c,px,y+u*0.1,u*0.7,u*0.24,'#55606e');});
    SCAPSULE(c,x,cy,len,rad,ang,SWHITE,acc,u);
    c.save();c.translate(x,cy);c.rotate(ang);for(let k=0;k<6;k++){const wx=-len*0.4+k*len*0.16;if(Math.abs(wx)<len*0.02+len*0.14*0&&false)continue;c.fillStyle=r()<0.8?SGLOW:'#2a4a6a';c.beginPath();c.ellipse(wx,-rad*0.2,u*0.16,u*0.22,0,0,7);c.fill();}
    c.fillStyle='#2a3444';c.beginPath();c.ellipse(len*0.5,0,rad*0.24,rad*0.62,0,0,7);c.fill();c.strokeStyle='#b8c0cc';c.lineWidth=u*0.08;c.stroke();c.fillStyle=SGLOW;c.beginPath();c.ellipse(len*0.5,-rad*0.1,rad*0.12,rad*0.26,0,0,7);c.fill();c.restore();
    const ax=x+Math.cos(ang)*len*0.2,ay=cy-rad*0.95;TH.ln(c,[ax,ay],[ax,ay-u*1.1],'#454c58',u*0.08);SDISH(c,ax,ay-u*1.25,u*0.5,-0.3,u);TH.poly(c,[[x-u*0.7,cy-rad*0.9],[x-u*0.1,cy-rad*0.9],[x-u*0.1+u*0.1,cy-rad*1.35],[x-u*0.6,cy-rad*1.35]].map(p=>[p[0]+Math.cos(ang)*u*1.0,p[1]+Math.sin(ang)*u*1.0]),'#2a4a8a');},
  cubeHab(c,x,y,u,s,variant){const r=mulberry(s*9+2),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),acc=[SBLUE,SORANGE,'#3ab5a0','#c05ad8'][s%4];SBOX(c,x,y,u,-1.3,1.3,-1.0,1.0,0,1.9,SWHITE);SBOX(c,x,y,u,-1.4,1.4,-1.1,1.1,1.9,2.05,'#b8c0cc');
    const faces=[{J:(a,z)=>I(a,1.01,z),p0:-1.3,p1:1.3},{J:(b,z)=>I(1.31,b,z),p0:-1.0,p1:1.0}];faces.forEach((F,fi)=>{TH.poly(c,[F.J(F.p0,0.75),F.J(F.p1,0.75),F.J(F.p1,0.98),F.J(F.p0,0.98)],acc);for(let k=0;k<5;k++){const p=F.p0+(F.p1-F.p0)*(k+0.5)/5;TH.ln(c,F.J(p,0.02),F.J(p,1.85),'rgba(70,80,100,.3)',u*0.04);}});
    const door=variant?faces[1]:faces[0],win=variant?faces[0]:faces[1];TH.poly(c,[door.J(-0.28,0),door.J(0.28,0),door.J(0.28,1.35),door.J(-0.28,1.35)],'#3a4658','#8a94a4',u*0.05);TH.ln(c,door.J(0,0.05),door.J(0,1.3),'rgba(255,255,255,.35)',u*0.04);const lp=door.J(0.4,1.5);TH.ell(c,lp[0],lp[1],u*0.07,u*0.07,'#7fff9a');[-0.75,0.75].forEach(p=>TH.poly(c,[door.J(p-0.2,1.0),door.J(p+0.2,1.0),door.J(p+0.2,1.5),door.J(p-0.2,1.5)],SGLOW,'#8a94a4',u*0.04));[-0.6,0.0,0.6].forEach(p=>TH.poly(c,[win.J(p-0.22,1.15),win.J(p+0.22,1.15),win.J(p+0.22,1.6),win.J(p-0.22,1.6)],r()<0.8?SGLOW:'#2a4a6a','#8a94a4',u*0.04));
    const rp=I(-0.4,-0.3,2.05);SBOX(c,x,y,u,-0.9,-0.3,-0.6,-0.1,2.05,2.4,'#b8c0cc');SDISH(c,I(0.5,0.2,2.9)[0],I(0.5,0.2,2.9)[1],u*0.55,-0.4,u);TH.ln(c,I(0.5,0.2,2.05),I(0.5,0.2,2.7),'#454c58',u*0.08);const ap=I(-1.0,0.6,2.05);TH.ln(c,ap,[ap[0],ap[1]-u*1.3],'#454c58',u*0.07);SBEACON(c,ap[0],ap[1]-u*1.3,u,'rgba(255,70,70,1)');
    const sp=I(1.4,-0.2,0.6);TH.poly(c,[I(1.4,-0.8,0.5),I(1.4,0.6,0.5),I(2.3,0.6,1.5),I(2.3,-0.8,1.5)],'#1f3f8f','#9ab4e8',u*0.04);for(let k=1;k<4;k++)TH.ln(c,I(1.4+0.225*k,-0.8,0.5+0.25*k),I(1.4+0.225*k,0.6,0.5+0.25*k),'rgba(150,180,240,.5)',u*0.03);}
};
function SHAB_DRAW(kind,pals){return(c,x,y,u,v)=>{const o=v&3,s=v>>2,flip=o&1,variant=(o>>1)&1;c.fillStyle='rgba(8,10,24,.34)';c.beginPath();c.ellipse(x+u*0.9,y+u*0.2,u*pals.sw,u*pals.sh,0,0,7);c.fill();SFLIP(c,x,flip,()=>SHAB[kind](c,x,y,u,s,variant));};}
const SPACE_ASSETS={
  /* ---------- low rock clusters (no tall mountains) ---------- */
  rockCluster:{cat:'rock',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*3+5),pal=SROCK[v%4],n=5+Math.floor(r()*4),it=[];for(let k=0;k<n;k++)it.push([(r()-0.5)*u*3.2,(r()-0.4)*u*1.1,u*(0.6+r()*1.0),u*(0.5+r()*0.8)]);it.sort((a,b)=>a[1]-b[1]).forEach(([dx,dy,rx,ry])=>SBOULDER(c,x+dx,y+dy,rx,ry,pal,r));}},
  rockMound:{cat:'rock',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*7+8),pal=SROCK[v%4],w=u*(2.9+r()*0.9),H=u*(2.0+r()*0.9);TH.ell(c,x+u*0.6,y+u*0.2,w*1.2,u*0.55,'rgba(8,10,24,.3)');c.save();c.translate(x,y);c.beginPath();c.moveTo(-w,0);c.bezierCurveTo(-w*0.9,-H*0.9,-w*0.3,-H*1.15,w*0.1,-H);c.bezierCurveTo(w*0.6,-H*0.9,w*1.0,-H*0.4,w,0);c.closePath();c.fillStyle=pal[0];c.fill();c.clip();const g=c.createLinearGradient(-w,0,w,0);g.addColorStop(0,'rgba(200,210,230,.25)');g.addColorStop(0.55,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,10,.5)');c.fillStyle=g;c.fillRect(-w*1.1,-H*1.2,w*2.2,H*1.3);for(let k=1;k<5;k++)TH.ln(c,[-w,-H*0.2*k+u*0.1],[w,-H*0.2*k-u*0.1],'rgba(0,0,0,.22)',u*0.06);c.restore();for(let k=0;k<4;k++)SBOULDER(c,x+(r()-0.5)*w*1.6,y+u*(0.1+r()*0.3),u*(0.3+r()*0.4),u*(0.25+r()*0.3),pal,r);}},
  rockSlabs:{cat:'rock',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*9+2),pal=SROCK[v%4];TH.ell(c,x+u*0.5,y+u*0.15,u*2.2,u*0.5,'rgba(8,10,24,.3)');const n=3+Math.floor(r()*2);for(let k=0;k<n;k++){const sx=x+(k-(n-1)/2)*u*0.9+(r()-0.5)*u*0.3,sh=u*(1.3+r()*1.5),sw=u*(0.6+r()*0.4),lean=(r()-0.5)*u*0.6;TH.poly(c,[[sx-sw,y],[sx-sw+lean,y-sh],[sx+sw*0.6+lean,y-sh-u*0.25],[sx+sw,y-u*0.1]],pal[0]);TH.poly(c,[[sx+sw*0.2,y-u*0.05],[sx+sw*0.6+lean,y-sh-u*0.25],[sx+sw,y-u*0.1],[sx+sw*0.9,y+u*0.1]],pal[2]);TH.poly(c,[[sx-sw+lean,y-sh],[sx+sw*0.6+lean,y-sh-u*0.25],[sx+sw*0.2+lean,y-sh-u*0.1]],pal[1]);TH.ln(c,[sx-sw*0.6,y-sh*0.4],[sx+sw*0.7,y-sh*0.45],'rgba(0,0,0,.22)',u*0.05);}}},
  crater:{cat:'rock',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*5+7),pal=SROCK[v%4],rx=u*(1.9+r()*0.8),ry=rx*0.42;TH.ell(c,x,y,rx*1.18,ry*1.2,'rgba(210,218,235,.28)');TH.ell(c,x,y,rx,ry,'rgba(40,46,64,.55)');const g=c.createRadialGradient(x+rx*0.2,y-ry*0.2,0,x,y,rx);g.addColorStop(0,'rgba(20,24,40,.0)');g.addColorStop(1,'rgba(10,12,26,.5)');c.fillStyle=g;c.beginPath();c.ellipse(x,y,rx*0.92,ry*0.9,0,0,7);c.fill();c.strokeStyle='rgba(230,236,248,.55)';c.lineWidth=u*0.13;c.beginPath();c.ellipse(x,y,rx,ry,0,Math.PI*0.95,Math.PI*2.1);c.stroke();c.strokeStyle='rgba(10,12,26,.45)';c.lineWidth=u*0.1;c.beginPath();c.ellipse(x,y,rx,ry,0,0.1,Math.PI*0.85);c.stroke();for(let k=0;k<4;k++){const a=r()*6.283;SBOULDER(c,x+Math.cos(a)*rx*1.15,y+Math.sin(a)*ry*1.2,u*(0.2+r()*0.3),u*(0.16+r()*0.22),pal,r);}}},
  crystals:{cat:'rock',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+9),pal=SROCK[v%4],cols=[['#5ff0e0','#2ab8b0'],['#c08aff','#8a4ad8'],['#7fd8ff','#3a98d8']][v%3];const g=c.createRadialGradient(x,y-u*0.8,0,x,y-u*0.8,u*2.4);g.addColorStop(0,cols[0].replace('#','rgba(')?'rgba(120,240,230,.35)':'');g.addColorStop(1,'rgba(120,240,230,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*0.8,u*2.4,0,7);c.fill();TH.ell(c,x+u*0.3,y+u*0.1,u*1.4,u*0.4,'rgba(8,10,24,.3)');SBOULDER(c,x-u*0.6,y+u*0.05,u*0.7,u*0.45,pal,r);SBOULDER(c,x+u*0.6,y+u*0.1,u*0.55,u*0.38,pal,r);
    const n=5+Math.floor(r()*2);for(let k=0;k<n;k++){const cx=x+(k-(n-1)/2)*u*0.34+(r()-0.5)*u*0.2,h=u*(0.9+r()*1.5),w=u*(0.2+r()*0.12),lean=(r()-0.5)*u*0.5;TH.poly(c,[[cx-w,y],[cx-w+lean*0.5,y-h*0.75],[cx+lean,y-h],[cx+w+lean*0.5,y-h*0.75],[cx+w,y]],cols[0]);TH.poly(c,[[cx,y],[cx+lean,y-h],[cx+w+lean*0.5,y-h*0.75],[cx+w,y]],cols[1]);TH.ln(c,[cx-w*0.4,y-h*0.2],[cx-w*0.2+lean*0.5,y-h*0.7],'rgba(255,255,255,.6)',u*0.04);}}},
  pebbles:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4),pal=SROCK[v%4];for(let k=0;k<7;k++)SBOULDER(c,x+(r()-0.5)*u*2.0,y+(r()-0.5)*u*0.6,u*(0.12+r()*0.18),u*(0.1+r()*0.14),pal,r);}},
  /* ---------- habitats ---------- */
  domeHab:{cat:'struct',rho:0.13,draw:SHAB_DRAW('domeHab',{sw:3.2,sh:1.0})},
  podHab:{cat:'struct',rho:0.13,draw:SHAB_DRAW('podHab',{sw:3.4,sh:1.0})},
  cubeHab:{cat:'struct',rho:0.12,draw:SHAB_DRAW('cubeHab',{sw:3.4,sh:1.0})},
  /* ---------- the one tower: a comm mast beside the habitats ---------- */
  commMast:{cat:'struct',rho:0.05,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),H=7.4;SFLIP(c,x,v&1,()=>{SSH(c,x,y,u*2.2);TH.ell(c,x,y,u*1.3,u*0.45,SMETAL_D);TH.ell(c,x,y-u*0.1,u*1.1,u*0.38,'#8a92a2');
      [[-0.8,-0.8],[0.8,-0.8],[-0.8,0.8],[0.8,0.8]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0.1),I(X*0.25,Y*0.25,H),'#c8d0dc',u*0.13));for(let k=0;k<9;k++){const z0=0.1+k*(H-0.1)/9,z1=0.1+(k+1)*(H-0.1)/9,f0=1-0.75*z0/H,f1=1-0.75*z1/H;TH.ln(c,I(-0.8*f0,0.8*f0,z0),I(0.8*f1,0.8*f1,z1),'#8a94a4',u*0.06);TH.ln(c,I(0.8*f0,0.8*f0,z0),I(-0.8*f1,0.8*f1,z1),'#8a94a4',u*0.06);TH.ln(c,I(0.8*f0,-0.8*f0,z0),I(0.8*f1,0.8*f1,z1),'#8a94a4',u*0.06);TH.ln(c,I(-0.8*f0,-0.8*f0,z0),I(-0.8*f1,0.8*f1,z1),'#8a94a4',u*0.05);TH.ln(c,I(-0.8*f1,0.8*f1,z1),I(0.8*f1,0.8*f1,z1),'#8a94a4',u*0.06);}
      const tp=I(0,0,H);SDISH(c,tp[0]+u*0.5,tp[1]+u*0.2,u*1.1,-0.5,u);TH.ln(c,tp,[tp[0],tp[1]-u*1.2],'#454c58',u*0.08);SBEACON(c,tp[0],tp[1]-u*1.2,u*1.3,'rgba(255,60,60,1)');const mp=I(0,0,H*0.55);SDISH(c,mp[0]-u*0.7,mp[1],u*0.55,0.3,u);
      [[-1.6,-0.8],[1.6,-0.4]].forEach(([X,Y])=>{const b=I(X*1.4,Y*1.4,0);TH.ln(c,tp.map((q,i)=>i?q+u*0.0:q),b,'rgba(190,200,220,.45)',u*0.03);});});}},
  /* ---------- station pieces ---------- */
  cargoStack:{cat:'ruin',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*5+9),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SFLIP(c,x,(v>>3)&1,()=>{SSH(c,x,y,u*3.0);
      const cont=(X,Y,Z,col,hz)=>{SBOX(c,x,y,u,X-0.85,X+0.85,Y-0.45,Y+0.45,Z,Z+0.85,col);for(let k=0;k<7;k++){const p=X-0.78+k*0.26;TH.ln(c,I(p,Y+0.46,Z+0.06),I(p,Y+0.46,Z+0.79),'rgba(0,0,0,.28)',u*0.04);}TH.poly(c,[I(X-0.5,Y+0.47,Z+0.3),I(X+0.2,Y+0.47,Z+0.3),I(X+0.2,Y+0.47,Z+0.55),I(X-0.5,Y+0.47,Z+0.55)],'rgba(255,255,255,.75)');if(hz){for(let k=0;k<4;k++)TH.poly(c,[I(X+0.35+k*0.12,Y+0.47,Z+0.08),I(X+0.43+k*0.12,Y+0.47,Z+0.08),I(X+0.5+k*0.12,Y+0.47,Z+0.22),I(X+0.42+k*0.12,Y+0.47,Z+0.22)],'#f2c230');}};
      const cols=[SCRATE[(v>>2)%6],SCRATE[(v+2)%6],SCRATE[(v+4)%6]];cont(-0.9,-0.3,0,cols[0],true);cont(0.95,-0.3,0,cols[1],false);cont(0.0,-0.3,0.85,cols[2],false);cont(-0.2,0.7,0,cols[(v+1)%3],false);
      [[1.5,0.9,0.5],[1.9,0.6,0.4]].forEach(([X,Y,s2],i)=>{SBOX(c,x,y,u,X-s2/2,X+s2/2,Y-s2/2,Y+s2/2,0,s2,['#c8a060','#a88050'][i]);const fp=I(X,Y+s2/2+0.01,s2*0.5);TH.ell(c,fp[0],fp[1],u*0.1,u*0.1,'#f6efe0');});});}},
  fuelTanks:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const ang=(v>>2)&1?-0.4636:0.4636;SFLIP(c,x,(v>>3)&1,()=>{SSH(c,x,y,u*2.8);[[-0.9],[0.9]].forEach(([off],i)=>{const cx=x+Math.cos(ang+Math.PI/2)*u*0.0+off*u*0.5,cy=y-u*1.25+off*u*0.5;SBOX(c,x,y,u,-0.5,0.5,-0.5,0.5,0,0.01,'#454c58');const px=x+(i?0.3:-0.3)*u*0.0;const bx=x+Math.cos(ang)*0,by=y-u*1.15;SCAPSULE(c,x+(i?u*0.5:-u*0.5),y-u*(1.0+(i?0.5:-0.0)*0.0)+(i?u*0.5:-u*0.1),u*3.0,u*0.78,ang,i?'#e8e8ee':'#f2c230',i?'#c0392b':'#2a2a30',u);});
      [[-1.1,0.55],[1.1,0.95]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u*0.8,y+dy*u*0.0-u*1.8],[x+dx*u*0.8,y-u*0.2],'#454c58',u*0.1);});TH.ln(c,[x-u*0.7,y-u*2.1],[x+u*0.7,y-u*1.6],'#8a94a4',u*0.14);TH.ell(c,x,y-u*2.0,u*0.22,u*0.12,'#c0392b');});}},
  solarArray:{cat:'ruin',rho:0.1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SFLIP(c,x,v&1,()=>{SSH(c,x,y,u*3.0);for(let row=0;row<2;row++)for(let k=0;k<3;k++){const X0=-2.0+k*1.4,X1=X0+1.25,Y0=-0.8+row*1.3,Y1=Y0+0.7,z0=0.5,z1=1.3;[X0+0.1,X1-0.1].forEach(X=>{TH.ln(c,I(X,Y1,0),I(X,Y1,z1-0.1),'#8a94a4',u*0.07);TH.ln(c,I(X,Y0,0),I(X,Y0,z0),'#8a94a4',u*0.07);});
        TH.poly(c,[I(X0,Y0,z0),I(X1,Y0,z0),I(X1,Y1,z1),I(X0,Y1,z1)],'#1d3a8a','#b8c0cc',u*0.06);for(let g=1;g<5;g++)TH.ln(c,I(X0+(X1-X0)*g/5,Y0,z0),I(X0+(X1-X0)*g/5,Y1,z1),'rgba(140,170,235,.55)',u*0.03);for(let g=1;g<3;g++)TH.ln(c,I(X0,Y0+(Y1-Y0)*g/3,z0+(z1-z0)*g/3),I(X1,Y0+(Y1-Y0)*g/3,z0+(z1-z0)*g/3),'rgba(140,170,235,.55)',u*0.03);TH.poly(c,[I(X0,Y0,z0),I(X1,Y0,z0),I(X1,Y0+0.05,z0+0.05),I(X0,Y0+0.05,z0+0.05)],'#e6eaf0');}
      SBOX(c,x,y,u,2.2,2.8,-0.3,0.3,0,0.7,SMETAL);const bp=I(2.5,0.31,0.9);TH.ell(c,bp[0],bp[1],u*0.07,u*0.07,'#7fff9a');});}},
  roverBuggy:{cat:'ruin',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SFLIP(c,x,v&1,()=>{SSH(c,x,y,u*2.2);
      const wheel=(X,Y)=>{const p=I(X,Y,0.45);c.fillStyle='#2a2e38';c.beginPath();c.ellipse(p[0],p[1],u*0.46,u*0.52,0,0,7);c.fill();c.strokeStyle='#8a94a4';c.lineWidth=u*0.1;c.stroke();for(let k=0;k<6;k++){const a=k/6*6.283;TH.ln(c,p,[p[0]+Math.cos(a)*u*0.38,p[1]+Math.sin(a)*u*0.42],'#6a7280',u*0.05);}};
      [[-1.2,-0.75],[0,-0.75],[1.2,-0.75]].forEach(([X,Y])=>wheel(X,Y));SBOX(c,x,y,u,-1.5,1.5,-0.6,0.6,0.5,1.0,'#e6eaf0');SBOX(c,x,y,u,0.2,1.4,-0.5,0.5,1.0,1.55,'#c8d0dc');TH.poly(c,[I(0.35,0.51,1.1),I(1.3,0.51,1.1),I(1.3,0.51,1.45),I(0.35,0.51,1.45)],SGLOW,'#454c58',u*0.05);SBOX(c,x,y,u,-1.3,-0.1,-0.5,0.5,1.0,1.2,SORANGE);
      [[-1.2,0.75],[0,0.75],[1.2,0.75]].forEach(([X,Y])=>wheel(X,Y));const ap=I(-1.2,-0.3,1.2);TH.ln(c,ap,[ap[0],ap[1]-u*1.3],'#454c58',u*0.06);SDISH(c,ap[0],ap[1]-u*1.4,u*0.38,-0.3,u);const hp=I(1.52,0.2,0.75);TH.ell(c,hp[0],hp[1],u*0.12,u*0.1,'#fff6c0');});}},
  landingPad:{cat:'ruin',rho:0.1,draw(c,x,y,u,v){const rx=u*2.4,ry=u*0.95;TH.ell(c,x+u*0.2,y+u*0.1,rx*1.06,ry*1.1,'rgba(8,10,24,.3)');TH.ell(c,x,y,rx,ry,'#3a404e');TH.ell(c,x,y-u*0.05,rx,ry,'#454c5c');c.strokeStyle='#e6eaf0';c.lineWidth=u*0.14;c.beginPath();c.ellipse(x,y-u*0.05,rx*0.88,ry*0.88,0,0,7);c.stroke();c.strokeStyle='#f2c230';c.lineWidth=u*0.1;c.setLineDash([u*0.5,u*0.4]);c.beginPath();c.ellipse(x,y-u*0.05,rx*0.7,ry*0.7,0,0,7);c.stroke();c.setLineDash([]);
      c.fillStyle='#e6eaf0';const hx=u*0.8,hy=ry*0.5;c.fillRect(x-hx*0.55,y-hy,u*0.22,hy*2);c.fillRect(x+hx*0.55-u*0.22,y-hy,u*0.22,hy*2);c.fillRect(x-hx*0.55,y-u*0.12,hx*1.1,u*0.22);for(let k=0;k<12;k++){const a=k/12*6.283,px=x+Math.cos(a)*rx*0.96,py=y-u*0.05+Math.sin(a)*ry*0.96;const col=k%2?'rgba(255,200,60,1)':'rgba(120,255,160,1)';SBEACON(c,px,py,u*0.5,col);}}},
  greenhouseDome:{cat:'ruin',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*5+9),rx=u*2.7,rh=u*2.9,by=y-u*0.3;SFLIP(c,x,v&1,()=>{SSH(c,x,y,u*3.2);TH.ell(c,x,y,rx*1.1,rx*0.42,SMETAL_D);TH.ell(c,x,y-u*0.12,rx*1.05,rx*0.38,'#8a92a2');
      TH.ell(c,x,by-u*0.2,rx*0.92,rx*0.32,'#4a7a3a');for(let k=0;k<14;k++){const px=x+(r()*2-1)*rx*0.8,py=by-u*0.1-r()*rh*0.4;TH.blob(c,px,py,u*(0.35+r()*0.3),u*(0.3+r()*0.3),['#3f9a46','#58b052','#2f8a3c','#7acc5a'][k%4],r,7);}
      c.beginPath();c.moveTo(x-rx,by);c.bezierCurveTo(x-rx,by-rh*1.25,x+rx,by-rh*1.25,x+rx,by);c.ellipse(x,by,rx,rx*0.36,0,0,Math.PI);c.closePath();const g=c.createRadialGradient(x-rx*0.4,by-rh*0.75,rx*0.1,x,by-rh*0.4,rx*1.5);g.addColorStop(0,'rgba(220,250,255,.5)');g.addColorStop(0.6,'rgba(160,220,235,.22)');g.addColorStop(1,'rgba(90,150,190,.38)');c.fillStyle=g;c.fill();c.strokeStyle='rgba(235,245,255,.75)';c.lineWidth=u*0.09;c.stroke();
      c.save();c.beginPath();c.moveTo(x-rx,by);c.bezierCurveTo(x-rx,by-rh*1.25,x+rx,by-rh*1.25,x+rx,by);c.ellipse(x,by,rx,rx*0.36,0,0,Math.PI);c.closePath();c.clip();c.strokeStyle='rgba(235,245,255,.6)';c.lineWidth=u*0.06;for(let k=-4;k<=4;k++){c.beginPath();c.moveTo(x+k*rx*0.25,by+rx*0.3);c.quadraticCurveTo(x+k*rx*0.14,by-rh*1.0,x,by-rh*0.97);c.stroke();}for(let k=1;k<=3;k++){c.beginPath();c.ellipse(x,by-rh*0.26*k,rx*(1-k*0.24),rx*(0.36-k*0.06),0,0,Math.PI);c.stroke();}c.restore();});}},
  drillRig:{cat:'ruin',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SFLIP(c,x,v&1,()=>{SSH(c,x,y,u*2.4);TH.ell(c,x,y,u*1.4,u*0.5,SMETAL_D);[[-0.9,-0.6],[0.9,-0.6],[0,0.9]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0.1),I(0,0,4.6),'#f2c230',u*0.14));[[-0.9,-0.6],[0.9,-0.6],[0,0.9]].forEach(([X,Y],i)=>{TH.ln(c,I(X*0.55,Y*0.55,2.2),I(X*0.55*0.0+X*0.3,Y*0.3,2.8),'#c0a020',u*0.06);});TH.ln(c,I(0,0,0.1),I(0,0,4.9),'#8a94a4',u*0.26);for(let k=0;k<7;k++){const p=I(0,0,0.5+k*0.6);TH.ln(c,[p[0]-u*0.16,p[1]],[p[0]+u*0.16,p[1]],'#454c58',u*0.05);}const hp=I(0,0,4.9);SBOX(c,x,y,u,-0.45,0.45,-0.45,0.45,4.7,5.4,SORANGE);TH.ell(c,hp[0],hp[1]-u*0.8,u*0.2,u*0.1,'#6a7280');
      TH.ln(c,I(0.3,0.9,0.5),I(2.4,1.4,0.4),'#6a7280',u*0.2);SBOX(c,x,y,u,1.6,2.6,0.4,1.2,0,0.8,'#e8762a');const lp=I(2.1,1.21,0.7);TH.ell(c,lp[0],lp[1],u*0.07,u*0.07,'#7fff9a');});}},
  dishArray:{cat:'ruin',rho:0.1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SFLIP(c,x,v&1,()=>{SSH(c,x,y,u*3.4);SBOX(c,x,y,u,-2.2,2.2,-1.0,1.0,0,0.35,SMETAL);SBOX(c,x,y,u,-2.0,2.0,-0.8,0.8,0.35,0.5,'#8a92a2');
      [[-1.3,0.2,1.55,-0.5],[0.1,-0.2,1.9,-0.3],[1.5,0.2,1.35,-0.6]].forEach(([X,Y,rr,tilt])=>{const b=I(X,Y,0.5),top=I(X,Y,2.3);TH.ln(c,b,top,'#b8c0cc',u*0.22);TH.poly(c,[[b[0]-u*0.4,b[1]],[b[0]+u*0.4,b[1]],[b[0]+u*0.15,b[1]-u*0.6],[b[0]-u*0.15,b[1]-u*0.6]],'#8a94a4');SDISH(c,top[0],top[1]-u*0.5,u*rr,tilt,u);});SBOX(c,x,y,u,-1.9,-1.1,-0.7,-0.1,0.5,1.1,'#e6eaf0');const lp=I(-1.5,-0.09,0.85);TH.ell(c,lp[0],lp[1],u*0.07,u*0.07,'#7fff9a');});}},
  astronaut:{cat:'ruin',rho:0.04,draw(c,x,y,u,v){SFLIP(c,x,v&1,()=>{SSH(c,x,y,u*1.4);TH.ell(c,x,y,u*0.8,u*0.28,'#6a7280');TH.ell(c,x,y-u*0.1,u*0.7,u*0.24,'#8a92a2');
      const by=y-u*0.35;TH.poly(c,[[x-u*0.55,by],[x-u*0.1,by],[x-u*0.1,by-u*1.1],[x-u*0.55,by-u*1.1]],'#f0f3f8','#9ab',u*0.04);TH.poly(c,[[x+u*0.1,by],[x+u*0.55,by],[x+u*0.55,by-u*1.1],[x+u*0.1,by-u*1.1]],'#e0e4ec','#9ab',u*0.04);
      TH.poly(c,[[x-u*0.7,by-u*1.1],[x+u*0.7,by-u*1.1],[x+u*0.65,by-u*2.3],[x-u*0.65,by-u*2.3]],'#f6f8fc','#9ab',u*0.04);TH.poly(c,[[x+u*0.5,by-u*1.3],[x+u*1.0,by-u*1.3],[x+u*1.0,by-u*2.2],[x+u*0.5,by-u*2.2]],'#c8d0dc');TH.ln(c,[x-u*0.65,by-u*1.5],[x+u*0.65,by-u*1.5],SORANGE,u*0.14);
      TH.ln(c,[x-u*0.65,by-u*2.1],[x-u*1.2,by-u*1.4],'#f0f3f8',u*0.34);TH.ln(c,[x+u*0.65,by-u*2.1],[x+u*1.15,by-u*2.9],'#f0f3f8',u*0.34);TH.ell(c,x+u*1.15,by-u*3.0,u*0.2,u*0.2,'#e6e8ee');
      TH.ell(c,x,by-u*2.9,u*0.72,u*0.76,'#f6f8fc','#9ab',u*0.05);TH.ell(c,x+u*0.06,by-u*2.85,u*0.5,u*0.48,'#c8a030');TH.ell(c,x+u*0.0,by-u*2.95,u*0.3,u*0.2,'rgba(255,240,180,.7)');TH.ell(c,x-u*0.15,by-u*3.2,u*0.18,u*0.1,'rgba(255,255,255,.6)');});}},
  crashedPod:{cat:'ruin',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*5+9);SFLIP(c,x,v&1,()=>{TH.ell(c,x+u*0.3,y+u*0.1,u*2.5,u*0.8,'rgba(8,10,24,.34)');TH.ell(c,x,y,u*2.2,u*0.78,'rgba(20,20,26,.55)');TH.ell(c,x,y,u*1.5,u*0.55,'rgba(10,10,14,.5)');
      c.save();c.translate(x,y-u*0.8);c.rotate(-0.35);const g=c.createLinearGradient(0,-u*1.2,0,u*1.2);g.addColorStop(0,'#dfe4ec');g.addColorStop(1,'#7a8494');c.fillStyle=g;c.beginPath();c.moveTo(-u*1.6,u*0.1);c.quadraticCurveTo(-u*1.4,-u*1.3,u*0.2,-u*1.25);c.quadraticCurveTo(u*1.5,-u*1.0,u*1.6,u*0.4);c.quadraticCurveTo(u*0.4,u*1.2,-u*1.6,u*0.1);c.fill();c.fillStyle='#3a2a28';c.beginPath();c.moveTo(u*0.9,-u*0.9);c.quadraticCurveTo(u*1.6,-u*0.3,u*1.6,u*0.4);c.quadraticCurveTo(u*1.0,u*0.2,u*0.9,-u*0.9);c.fill();c.fillStyle='#2a4a6a';c.beginPath();c.ellipse(-u*0.3,-u*0.3,u*0.5,u*0.4,0,0,7);c.fill();c.strokeStyle='#b8c0cc';c.lineWidth=u*0.08;c.stroke();TH.ln(c,[-u*1.4,-u*0.2],[u*0.9,-u*0.6],'rgba(0,0,0,.25)',u*0.05);c.restore();
      for(let k=0;k<4;k++){const sx=x+(r()-0.3)*u*1.2;c.fillStyle='rgba(60,60,70,'+(0.4-k*0.08)+')';c.beginPath();c.ellipse(sx+k*u*0.2,y-u*(1.6+k*0.7),u*(0.4+k*0.15),u*(0.3+k*0.1),0,0,7);c.fill();}for(let k=0;k<5;k++)SBOULDER(c,x+(r()-0.5)*u*3.4,y+(r()*0.5)*u*0.5,u*(0.18+r()*0.2),u*(0.14+r()*0.16),SROCK[0],r);});}},
  /* ---------- small props (lower tiers only) ---------- */
  flag:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.26,'rgba(8,10,24,.3)');TH.ln(c,[x,y],[x,y-u*3.2],'#c8d0dc',u*0.12);TH.ln(c,[x,y-u*3.2],[x+u*1.3,y-u*3.2],'#c8d0dc',u*0.07);const fx=x+u*0.05,fy=y-u*3.15,w=u*1.25,h=u*0.85;TH.poly(c,[[fx,fy],[fx+w,fy+u*0.04],[fx+w,fy+h+u*0.04],[fx,fy+h]],'#f6f8fc','#9ab',u*0.03);TH.poly(c,[[fx,fy],[fx+w*0.4,fy+u*0.02],[fx+w*0.4,fy+h+u*0.03],[fx,fy+h]],'#1f9aa8');TH.poly(c,[[fx+w*0.4,fy+u*0.02],[fx+w,fy+u*0.04],[fx+w,fy+h*0.5+u*0.04],[fx+w*0.4,fy+h*0.5+u*0.02]],'#f6f8fc');TH.poly(c,[[fx+w*0.4,fy+h*0.5+u*0.02],[fx+w,fy+h*0.5+u*0.04],[fx+w,fy+h+u*0.04],[fx+w*0.4,fy+h+u*0.03]],SORANGE);TH.ell(c,fx+w*0.2,fy+h*0.5,u*0.2,u*0.2,'#f6f8fc');for(let k=0;k<3;k++)SBOULDER(c,x+(k-1)*u*0.4,y+u*0.05,u*0.2,u*0.15,SROCK[0],mulberry(k+v));}},
  floodLight:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.26,'rgba(8,10,24,.3)');TH.ln(c,[x,y],[x,y-u*3.4],'#8a94a4',u*0.16);TH.ln(c,[x-u*0.55,y-u*3.4],[x+u*0.55,y-u*3.4],'#6a7280',u*0.14);[-0.5,0.5].forEach(d=>{const g=c.createRadialGradient(x+d*u,y-u*3.2,0,x+d*u,y-u*3.2,u*1.7);g.addColorStop(0,'rgba(220,240,255,.5)');g.addColorStop(1,'rgba(220,240,255,0)');c.fillStyle=g;c.beginPath();c.arc(x+d*u,y-u*3.2,u*1.7,0,7);c.fill();TH.poly(c,[[x+d*u-u*0.28,y-u*3.4],[x+d*u+u*0.28,y-u*3.4],[x+d*u+u*0.22,y-u*3.05],[x+d*u-u*0.22,y-u*3.05]],'#e8f6ff','#454c58',u*0.05);});}},
  beacon:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.2,y+u*0.06,u*0.6,u*0.2,'rgba(8,10,24,.3)');TH.ln(c,[x,y],[x,y-u*2.4],'#6a7280',u*0.14);for(let k=0;k<4;k++)TH.ln(c,[x-u*0.16,y-u*(0.4+k*0.5)],[x+u*0.16,y-u*(0.4+k*0.5)-u*0.12],'#c0392b',u*0.07);SBEACON(c,x,y-u*2.5,u*1.2,v%2?'rgba(255,60,60,1)':'rgba(255,190,60,1)');}},
  canisters:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*1.2,u*0.3,'rgba(8,10,24,.3)');[[-0.55,0,'#3a9a5a'],[0.0,0.12,'#2a6ab0'],[0.55,0,'#e8762a']].forEach(([dx,dy,col],i)=>{const px=x+dx*u,py=y+dy*u,w=u*0.3,h=u*(1.5+(i%2)*0.2);const g=c.createLinearGradient(px-w,0,px+w,0);g.addColorStop(0,shade(col,0.25));g.addColorStop(1,shade(col,-0.35));c.fillStyle=g;c.beginPath();c.moveTo(px-w,py);c.lineTo(px-w,py-h+w);c.arc(px,py-h+w,w,Math.PI,0);c.lineTo(px+w,py);c.ellipse(px,py,w,w*0.35,0,0,Math.PI);c.closePath();c.fill();TH.ln(c,[px-w,py-h*0.55],[px+w,py-h*0.55],'rgba(255,255,255,.7)',u*0.07);TH.ell(c,px,py-h-u*0.05,u*0.12,u*0.08,'#454c58');});}},
  smallCrates:{cat:'prop',rho:0.05,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.5,u*0.4,'rgba(8,10,24,.3)');SBOX(c,x,y,u,-0.9,0.1,-0.6,0.5,0,0.9,SCRATE[v%6]);SBOX(c,x,y,u,0.2,1.1,-0.5,0.5,0,0.7,SCRATE[(v+2)%6]);SBOX(c,x,y,u,-0.5,0.5,-0.45,0.4,0.9,1.6,SCRATE[(v+4)%6]);TH.poly(c,[I(-0.7,0.51,0.3),I(-0.1,0.51,0.3),I(-0.1,0.51,0.55),I(-0.7,0.51,0.55)],'rgba(255,255,255,.75)');}}
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

/* ===== SPACE LAND: planner (no trees: low rock clusters, craters and crystals carry the land; little station habitats, cargo stacks and machinery sprinkled around) ===== */
const SPACE_KINDS={rockCluster:.42,rockMound:.14,rockSlabs:.16,crater:.14,crystals:.08,rockSlabs2:0};
const SPACE_LOW=[['rockMound',0.8],['rockCluster',0.6],['crater',0.9],['rockSlabs',0.6],['rockCluster',0.75],['rockMound',0.65]];
const SPACE_CAP={crystals:8,crater:14};
const SPACE_PLAN_CACHE={};
function getSpacePlan(shape){
  if(SPACE_PLAN_CACHE[shape])return SPACE_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(shape==='A'?9101:9302),placed=[],bb=G.bbox,used={},A=SPACE_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.66);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick='rockCluster';for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'rockCluster';};
  const capOk=k=>!(SPACE_CAP[k]&&(used[k]||0)>=SPACE_CAP[k]);
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='rock'?1.0+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;if((D.cat==='rock'||D.cat==='shrub'||D.cat==='prop')&&placed.some(o=>o.noSouth&&Math.abs(px-o.x)<0.3&&py-o.y>-0.05&&py-o.y<0.36))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const rock=(x,y,extra,low)=>{if(low){const L=SPACE_LOW[Math.floor(rng()*SPACE_LOW.length)];return place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return place(pickFrom(SPACE_KINDS,capOk),x,y,extra||{});};
  const pebbles=(x,y,extra)=>place('pebbles',x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. the back rim carries the dish array (no wall of rock there: the rocks along the top are the same density as everywhere else) */
  {const pts=[];top.forEach(e=>[0.3,0.5,0.7].forEach(t=>pts.push(onEdge(e,t,0.0))));const p=pts.reduce((b,q)=>Math.abs(q[0]-cx)<Math.abs(b[0]-cx)?q:b);for(const [dx,dy] of [[0,-0.02],[0.3,0],[-0.3,0],[0,0.04]]){const o=place('dishArray',p[0]+dx,p[1]+dy,{minT:1,scale:1.2,clear:2.4,noSouth:true});if(o)break;}}
  /* 2. station habitats: 4 on the rim (spread by farthest-point), 5 through the middle, then ONE comm mast beside a habitat */
  const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.filter(e=>e.vertical).forEach(e=>inn.push([e.mid[0],e.mid[1]]));
  const chosen=placed.filter(o=>o.cat==='ruin'||o.cat==='struct').map(o=>[o.x,o.y]),habs=[];
  const spread=(k,pool,extra)=>{const ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.22})).sort((a,b)=>b.d-a.d);for(let n=0;n<Math.min(12,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],extra);if(o){chosen.push([o.x,o.y]);if(/Hab$/.test(k))habs.push(o);return o;}}return null;};
  [['domeHab',1],['podHab',2],['cubeHab',3],['domeHab',4]].forEach(([k,mt])=>spread(k,rim,{minT:mt,scale:1.15,clear:2.5,noSouth:true}));
  [['podHab',2],['cubeHab',2],['domeHab',3],['podHab',4],['cubeHab',4]].forEach(([k,mt])=>spread(k,inn,{minT:mt,scale:1.0,clear:3.0,noSouth:true}));
  {const home=habs[habs.length-1]||placed.find(o=>o.cat==='struct');if(home){for(const [dx,dy] of [[0.36,-0.08],[-0.36,-0.08],[0.3,0.12],[-0.3,0.12],[0.44,0.0],[-0.44,0.0]]){const o=place('commMast',home.x+dx,home.y+dy,{minT:4,scale:1.0,clear:2.2,noSouth:true});if(o)break;}}}
  /* 2b. station machinery and cargo scattered through the land */
  [['cargoStack',1],['roverBuggy',2],['fuelTanks',2],['solarArray',2],['cargoStack',3],['landingPad',3],['greenhouseDome',3],['drillRig',3],['astronaut',4],['cargoStack',4],['solarArray',4],['crashedPod',4],['roverBuggy',4],['fuelTanks',4],['cargoStack',4]].forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,scale:k==='cargoStack'||k==='solarArray'?1.05:1.0,clear:1.8,noSouth:true}));
  /* 3. rock clusters (the heart of this land): junction voids, corridors, the rim, the corners */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.9){const n=1+Math.floor(rng()*1.9);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.09:0.02;rock(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8);}}});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{[-0.25,0.25].forEach(dy=>{if(rng()<0.6)rock(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy);});});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.6)rock(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.7+rng()*0.2},true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.3));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(rng()-0.2)*0.12)});});
    let mode='cluster',run=0;samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.62?'cluster':r<0.86?'sparse':'open';run=2+Math.floor(rng()*4);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='cluster'){rock(p[0],p[1],null,low);if(rng()<0.6)rock(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,low);if(rng()<0.3)rock(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,true);}
      else if(mode==='sparse'){if(rng()<0.5)rock(p[0],p[1],null,low);else pebbles(p[0],p[1]);}else if(rng()<0.5)pebbles(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.6)rock(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<10;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.2)rock(px,py,{scale:0.8+rng()*0.25},py>cy+0.35);}});
  /* 3b. the rock count must be even around the whole rim (top = sides = bottom), then pulled to the target total */
  {const dE=(x,y,e)=>{const dx=e.b[0]-e.a[0],dy=e.b[1]-e.a[1],t=Math.max(0,Math.min(1,((x-e.a[0])*dx+(y-e.a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-(e.a[0]+dx*t),(y-(e.a[1]+dy*t))*1.4);};
    const classes=['top','side','bottom'],len={top:0,side:0,bottom:0};outer.forEach(e=>len[e.cls]+=e.len);
    const members=()=>{const m={top:[],side:[],bottom:[]};placed.filter(o=>o.cat==='rock').forEach(o=>{let best=null,bd=1e9;outer.forEach(e=>{const d=dE(o.x,o.y,e);if(d<bd){bd=d;best=e;}});if(bd<0.32)m[best.cls].push(o);});return m;};
    let m=members();const mean=(m.top.length+m.side.length+m.bottom.length)/(len.top+len.side+len.bottom);
    classes.forEach(cl=>{const target=Math.round(len[cl]*mean);let list=m[cl];
      if(list.length>target+1){const drop=list.length-target;for(let i=0;i<drop;i++){const pick=list.splice(Math.floor(rng()*list.length),1)[0],ix=placed.indexOf(pick);if(ix>=0)placed.splice(ix,1);}}
      else if(list.length<target-1){const need=target-list.length,es=outer.filter(e=>e.cls===cl);let added=0,guard=0;while(added<need&&guard++<160){const e=es[Math.floor(rng()*es.length)],p=onEdge(e,rng(),(rng()-0.2)*0.12);if(rock(p[0],p[1],null,cl!=='top'))added++;}}});
    const TARGET=84,isRim=o=>outer.some(e=>dE(o.x,o.y,e)<0.32),rocks=()=>placed.filter(o=>o.cat==='rock');let n=rocks().length;
    if(n>TARGET){const inner=rocks().filter(o=>!isRim(o));let drop=Math.min(n-TARGET,inner.length);while(drop-->0){const o=inner.splice(Math.floor(rng()*inner.length),1)[0],ix=placed.indexOf(o);if(ix>=0)placed.splice(ix,1);}}
    else if(n<TARGET){let guard=0;while(rocks().length<TARGET&&guard++<900){const c=G.centers[Math.floor(rng()*G.centers.length)],px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;rock(px,py,{scale:0.8+rng()*0.25},py>cy+0.35);}}}
  /* 4. loose pebbles and debris */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.5)pebbles(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.4)pebbles(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.45)pebbles(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.35)pebbles(px,py);}});
  /* 5. small props: lower tiers only */
  [['flag',2],['floodLight',2],['beacon',2],['canisters',2],['smallCrates',3]].forEach(([k,n])=>{for(let i=0;i<n;i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  /* every habitat gets a facing (bit0 mirror, bit1 variant: tube side / pod axis / door wall); neighbours cycle through all four */
  {const hs=placed.filter(o=>/Hab$/.test(o.kind)).sort((a,b)=>a.x-b.x||a.y-b.y),cyc=[0,3,1,2];hs.forEach((o,i)=>{o.v=((o.v>>2)<<2)|cyc[i%4];});placed.filter(o=>o.kind==='commMast').forEach(o=>{o.v=((o.v>>2)<<2)|(rng()<0.5?1:0);});}
  const cuts={rock:[0.2,0.5,0.78,1],shrub:[0.08,0.4,0.7,1],prop:[1,1,1,1],struct:[0,0,0,0],ruin:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.rock;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='struct'||o.cat==='ruin')o.tier=o.minT;});
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.sort((a,b)=>a.y-b.y);
  return SPACE_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: grey-blue regolith with scattered small craters, dust drifts and pebbles (decals, not objects) ---- */
function spaceGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<46;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'205,214,235':'40,46,70',r()<0.5?0.22:0.24);}
  for(let k=0;k<10;k++){const p=pt(),w=R*(0.35+r()*0.6);soft(p[0],p[1],w,w*0.4,'150,110,100',0.12);}                  /* rusty dust */
  for(let k=0;k<8;k++){const p=pt(),w=R*(0.5+r()*0.8);for(let j=0;j<5;j++)TH.ln(c,[p[0]-w*0.5,p[1]+j*R*0.03],[p[0]+w*0.5,p[1]+j*R*0.03-R*0.02],'rgba(220,228,245,.12)',R*0.014);}   /* wind-swept dust streaks */
  for(let k=0;k<60;k++){const p=pt(),rx=R*(0.05+r()*0.16),ry=rx*0.42;c.fillStyle='rgba(30,36,58,.28)';c.beginPath();c.ellipse(p[0],p[1],rx,ry,0,0,7);c.fill();c.strokeStyle='rgba(225,232,248,.34)';c.lineWidth=Math.max(0.7,R*0.012);c.beginPath();c.ellipse(p[0],p[1],rx,ry,0,Math.PI*0.95,Math.PI*2.1);c.stroke();}   /* small craters */
  for(let k=0;k<170;k++){const p=pt();TH.ell(c,p[0],p[1],R*(0.008+r()*0.012),R*0.007,r()<0.5?'rgba(40,46,66,.5)':'rgba(220,228,245,.45)');}
  c.restore();c.restore();
}
const SPACE_THEME={id:'space',assets:SPACE_ASSETS,plan:getSpacePlan,ground:spaceGround,groundCol:'#8d95a7',top:1.45};
const SPACE_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
function bakeLandSpace(shape,tier,R,opts){return bakeLandTheme(SPACE_THEME,shape,tier,R,opts);}
function drawLandSpaceBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandSpaceDepthBand(ctx,x,y,land,index){const band=land.bands[index];if(!band||!band.canvas)return;const r=band.rect;ctx.drawImage(band.canvas,x-land.ox+r.x,y-land.oy+r.y,r.w,r.h);}
function drawLandSpaceFront(ctx,x,y,land){land.bands.forEach((_,index)=>drawLandSpaceDepthBand(ctx,x,y,land,index));}
return Object.freeze({bake:bakeLandSpace,drawBack:drawLandSpaceBack,drawDepthBand:drawLandSpaceDepthBand,drawFront:drawLandSpaceFront});
})();
const fiestaLandMacroPack = (() => {
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

/* ===== FIESTA / DAY OF THE DEAD ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed.
   Requires WEST_ASSETS (cacti, mesquite) to be loaded first. ===== */
const FSH=(c,x,y,rx)=>{c.fillStyle='rgba(70,40,20,.24)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const FPAL=[['#e8508a','#fbe4ec'],['#2ab5b0','#dcf4f2'],['#f2c230','#fdf2c8'],['#f08a24','#fde4c8'],['#8a4ab8','#eddff6'],['#7ac43a','#e6f4d4']];
const FCOL=['#e8508a','#2ab5b0','#f2c230','#f08a24','#8a4ab8','#7ac43a'];
const FADOBE='#d9b88e',FWOODD='#5a3a22',FTERRA='#c0603a',FMARI='#f08a24',FMARI2='#f6b83a';
const FBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.26),shade(col,0.12));
const FFLIP=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
const FPATH=(c,pts)=>{pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();};
/* round-arched opening outline for a face; J(a,z) maps a face coordinate to the screen */
const FARCH=(J,xc,w,z0,zs)=>{const pts=[J(xc-w,z0),J(xc-w,zs)];for(let k=1;k<7;k++){const a=Math.PI*(1-k/7);pts.push(J(xc+Math.cos(a)*w,zs+Math.sin(a)*w));}pts.push(J(xc+w,zs),J(xc+w,z0));return pts;};
/* a sugar skull (calavera) painted on a wall / held on a stall */
const FSKULL=(c,x,y,r,v)=>{const col=FCOL[v%6],col2=FCOL[(v+2)%6];c.fillStyle='#fbf3e0';c.beginPath();c.ellipse(x,y,r*0.9,r,0,0,7);c.fill();c.strokeStyle='rgba(70,40,30,.55)';c.lineWidth=Math.max(0.6,r*0.08);c.stroke();
  [-1,1].forEach(sx=>{c.fillStyle=col;c.beginPath();c.ellipse(x+sx*r*0.38,y-r*0.15,r*0.3,r*0.34,0,0,7);c.fill();c.fillStyle='#1a1a20';c.beginPath();c.ellipse(x+sx*r*0.38,y-r*0.12,r*0.16,r*0.2,0,0,7);c.fill();});
  c.fillStyle='#3a2a2a';c.beginPath();c.moveTo(x,y+r*0.05);c.lineTo(x-r*0.1,y+r*0.3);c.lineTo(x+r*0.1,y+r*0.3);c.fill();c.strokeStyle='#3a2a2a';c.lineWidth=Math.max(0.5,r*0.07);c.beginPath();c.moveTo(x-r*0.4,y+r*0.55);c.quadraticCurveTo(x,y+r*0.68,x+r*0.4,y+r*0.55);c.stroke();for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(x+k*r*0.17,y+r*0.58);c.lineTo(x+k*r*0.17,y+r*0.7);c.stroke();}
  [-0.4,0,0.4].forEach((d,i)=>{c.fillStyle=FCOL[(v+i+3)%6];c.beginPath();c.arc(x+d*r,y-r*0.72,r*0.12,0,7);c.fill();});c.fillStyle=col2;c.beginPath();c.arc(x,y+r*0.9,r*0.0,0,7);c.fill();};
const FMARIGOLD=(c,x,y,r)=>{for(let k=0;k<8;k++){const a=k/8*6.283;c.fillStyle=k%2?FMARI:FMARI2;c.beginPath();c.ellipse(x+Math.cos(a)*r*0.45,y+Math.sin(a)*r*0.4,r*0.4,r*0.32,a,0,7);c.fill();}c.fillStyle='#d9701a';c.beginPath();c.arc(x,y,r*0.28,0,7);c.fill();};
const FFLAME=(c,x,y,u)=>{const g=c.createRadialGradient(x,y-u*0.3,0,x,y-u*0.3,u*1.2);g.addColorStop(0,'rgba(255,200,100,.5)');g.addColorStop(1,'rgba(255,200,100,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*0.3,u*1.2,0,7);c.fill();TH.poly(c,[[x-u*0.1,y],[x+u*0.1,y],[x,y-u*0.4]],'#ffb030');TH.poly(c,[[x-u*0.05,y],[x+u*0.05,y],[x,y-u*0.22]],'#fff0a0');};
const FFROND=(c,x,y,ang,len,u,col,mid)=>{const ex=x+Math.cos(ang)*len,ey=y+Math.sin(ang)*len*0.6+len*0.33,mx=x+Math.cos(ang)*len*0.55,my=y+Math.sin(ang)*len*0.7-len*0.25;c.lineCap='round';c.strokeStyle=col;c.lineWidth=u*0.42;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(mx,my,ex,ey);c.stroke();c.strokeStyle=mid;c.lineWidth=u*0.1;c.stroke();for(let k=1;k<7;k++){const t=k/7,q=1-t,px=q*q*x+2*q*t*mx+t*t*ex,py=q*q*y+2*q*t*my+t*t*ey,sl=len*0.2*(1-t*0.6);TH.ln(c,[px,py],[px+Math.sin(ang)*sl*0.5-Math.cos(ang)*sl*0.2,py+sl*0.55],col,u*0.14);TH.ln(c,[px,py],[px-Math.sin(ang)*sl*0.5-Math.cos(ang)*sl*0.2,py+sl*0.55],col,u*0.14);}};
/* ---- little adobe houses: one parametric body, 4 orientations (door on the short or long wall x mirror) ---- */
const FHOUSE_T={casita:{ha:1.2,hb:1.55,h1:1.9,h2:0,roof:'flat',sw:3.0,sh:0.95},casaTile:{ha:1.15,hb:1.6,h1:1.55,h2:0,roof:'tile',rise:1.0,sw:3.0,sh:0.95},casaAlta:{ha:1.15,hb:1.4,h1:1.55,h2:1.3,roof:'flat',balcony:true,sw:2.8,sh:0.9}};
function FHOUSE_BODY(c,x,y,u,s,eave,T){const r=mulberry(s*7+3),Iw=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),L=(a,b,z)=>eave?Iw(b,a,z):Iw(a,b,z),LBOX=(a0,a1,b0,b1,z0,z1,col)=>eave?FBOX(c,x,y,u,b0,b1,a0,a1,z0,z1,col):FBOX(c,x,y,u,a0,a1,b0,b1,z0,z1,col);
  const pal=FPAL[s%6],wall=pal[0],trim=pal[1],acc=FCOL[(s+2)%6],acc2=FCOL[(s+4)%6],ha=T.ha,hb=T.hb,h1=T.h1,zw=h1+(T.h2||0);
  const faces=(aa,bb)=>[{J:(a,z)=>L(a,bb+0.012,z),p0:-aa,p1:aa},{J:(b,z)=>L(aa+0.012,b,z),p0:-bb,p1:bb}];
  LBOX(-ha,ha,-hb,hb,0,h1,wall);if(T.h2)LBOX(-ha*0.97,ha*0.97,-hb*0.97,hb*0.97,h1,zw,shade(wall,0.07));
  const F1=faces(ha,hb)[0],F2=faces(ha,hb)[1],U1=faces(ha*0.97,hb*0.97)[0],U2=faces(ha*0.97,hb*0.97)[1];
  const quad=(F,p0,p1,z0,z1,col,stroke)=>TH.poly(c,[F.J(p0,z0),F.J(p1,z0),F.J(p1,z1),F.J(p0,z1)],col,stroke,stroke?u*0.05:0);
  [F1,F2].forEach(F=>{quad(F,F.p0,F.p1,0,0.42,acc);TH.ln(c,F.J(F.p0,0.43),F.J(F.p1,0.43),trim,u*0.06);});
  const arched=(F,p,z0,w,zs,fill,frame)=>{const pts=FARCH(F.J,p,w,z0,zs);c.beginPath();FPATH(c,pts);c.fillStyle=fill;c.fill();c.strokeStyle=frame;c.lineWidth=u*0.1;c.stroke();};
  const win=(F,p,z0,lit)=>{arched(F,p,z0,0.24,z0+0.55,lit?'#ffe9a0':'#3a5a7a',trim);[-0.12,0,0.12].forEach(d=>TH.ln(c,F.J(p+d,z0+0.02),F.J(p+d,z0+0.62),'rgba(30,20,20,.7)',u*0.035));quad(F,p-0.24-0.18,p-0.24,z0,z0+0.6,acc2,'rgba(0,0,0,.2)');quad(F,p+0.24,p+0.24+0.18,z0,z0+0.6,acc2,'rgba(0,0,0,.2)');
    for(let k=0;k<4;k++){const q=F.J(p-0.2+k*0.13,z0-0.1);TH.ell(c,q[0],q[1],u*0.09,u*0.08,k%2?'#f08a24':'#f2c230');}};
  const doorF=eave?F2:F1,otherF=eave?F1:F2,doorU=eave?U2:U1,otherU=eave?U1:U2;
  arched(doorF,0,0,0.36,1.05,FCOL[(s+1)%6],trim);TH.ln(c,doorF.J(0,0.02),doorF.J(0,1.3),'rgba(0,0,0,.3)',u*0.05);TH.ell(c,...doorF.J(0.2,0.6),u*0.05,u*0.05,'#e8c84a');
  /* marigold garland over the door */
  for(let k=0;k<9;k++){const t=k/8,p=-0.5+t,z=1.5+Math.sin(t*Math.PI)*0.0-Math.sin(t*Math.PI)*0.22,q=doorF.J(p,z);FMARIGOLD(c,q[0],q[1],u*0.17);}
  const sp=doorF.p1*0.68;win(doorF,-sp,0.62,r()<0.7);win(doorF,sp,0.62,r()<0.7);win(otherF,-otherF.p1*0.45,0.62,r()<0.7);win(otherF,otherF.p1*0.45,0.62,r()<0.7);
  if(T.h2){const U=doorU;win(U,-U.p1*0.55,h1+0.3,r()<0.7);win(U,0,h1+0.3,r()<0.7);win(U,U.p1*0.55,h1+0.3,r()<0.7);win(otherU,0,h1+0.3,r()<0.7);}
  else{const q=otherF.J(0,1.35);FSKULL(c,q[0],q[1],u*0.42,s);}
  /* vigas (beam ends) under the roofline */
  [F1,F2].forEach(F=>{const n=Math.round((F.p1-F.p0)/0.55);for(let k=0;k<=n;k++){const q=F.J(F.p0+(F.p1-F.p0)*k/n,zw-0.2);TH.ell(c,q[0],q[1],u*0.07,u*0.07,'#7a5230');}});
  /* papel picado strung along the front */
  {const F=doorF,zt=zw-0.5,cols=FCOL;let prev=null;for(let k=0;k<=10;k++){const p=F.p0+(F.p1-F.p0)*k/10,q=F.J(p,zt-Math.sin(k/10*Math.PI)*0.18);if(prev)TH.ln(c,prev,q,'#e8e0d0',u*0.03);prev=q;if(k<10){const q2=F.J(p+(F.p1-F.p0)/20,zt-Math.sin((k+0.5)/10*Math.PI)*0.18);TH.poly(c,[[q2[0]-u*0.17,q2[1]],[q2[0]+u*0.17,q2[1]],[q2[0]+u*0.17,q2[1]+u*0.38],[q2[0],q2[1]+u*0.28],[q2[0]-u*0.17,q2[1]+u*0.38]],cols[(k+s)%6],'rgba(255,255,255,.5)',u*0.02);}}}
  if(T.roof==='flat'){
    const inset=0.22,roofPts=[L(-ha+inset,-hb+inset,zw+0.02),L(ha-inset,-hb+inset,zw+0.02),L(ha-inset,hb-inset,zw+0.02),L(-ha+inset,hb-inset,zw+0.02)];TH.poly(c,roofPts,'#b87858');
    const pw=0.26,pc=trim;LBOX(-ha,ha,-hb,-hb+0.18,zw,zw+pw,pc);LBOX(-ha,-ha+0.18,-hb,hb,zw,zw+pw,pc);LBOX(-ha,ha,hb-0.18,hb,zw,zw+pw,pc);LBOX(ha-0.18,ha,-hb,hb,zw,zw+pw,pc);
    for(let k=0;k<4;k++){const q=L(-ha*0.6+k*ha*0.4,hb-0.09,zw+pw+0.12);TH.blob(c,q[0],q[1],u*0.3,u*0.22,['#e8508a','#d9367a','#f06aa0','#c02a6a'][k%4],r,7);}
    if(T.balcony){const dF=doorF,Jb=eave?(a,z)=>L(ha*0.97+0.5,a,z):(a,z)=>L(a,hb*0.97+0.5,z),bw=(eave?hb:ha)*0.8;if(eave)LBOX(ha*0.97,ha*0.97+0.5,-bw,bw,h1-0.1,h1+0.05,'#4a3a30');else LBOX(-bw,bw,hb*0.97,hb*0.97+0.5,h1-0.1,h1+0.05,'#4a3a30');for(let k=0;k<=8;k++){const p=-bw+2*bw*k/8;TH.ln(c,Jb(p,h1+0.05),Jb(p,h1+0.55),'#1a1618',u*0.05);}TH.ln(c,Jb(-bw,h1+0.55),Jb(bw,h1+0.55),'#1a1618',u*0.07);for(let k=0;k<7;k++){const q=Jb(-bw+2*bw*(k+0.5)/7,h1+0.62);TH.blob(c,q[0],q[1]-u*0.05,u*0.15,u*0.12,k%2?'#d9367a':'#f08a24',r,6);}}
  }else{
    const ov=0.45,rise=T.rise,rA=L(ha+ov,-hb-ov,zw),rB=L(ha+ov,hb+ov,zw),rC=L(0,hb+ov,zw+rise),rD=L(0,-hb-ov,zw+rise);
    TH.poly(c,[L(-ha,hb+0.02,zw),L(ha,hb+0.02,zw),L(0,hb+0.02,zw+rise-0.08)],wall);TH.poly(c,[rA,rB,rC,rD],FTERRA);
    for(let k=1;k<5;k++)TH.ln(c,L(ha+ov-(ha+ov)*k/5,-hb-ov,zw+rise*k/5),L(ha+ov-(ha+ov)*k/5,hb+ov,zw+rise*k/5),'rgba(80,30,10,.35)',u*0.05);for(let k=0;k<14;k++){const bb=-hb-ov+(2*hb+2*ov)*k/13,p=L(ha+ov,bb,zw);TH.ell(c,p[0],p[1],u*0.12,u*0.08,'#a84a28');}
    TH.ln(c,L(-ha-ov,hb+ov,zw),L(0,hb+ov,zw+rise),'#8a3a20',u*0.1);TH.ln(c,L(ha+ov,hb+ov,zw),L(0,hb+ov,zw+rise),'#8a3a20',u*0.1);const gq=L(0,hb+0.03,zw+rise*0.4);TH.ell(c,gq[0],gq[1],u*0.2,u*0.22,'#fbf3e0');FSKULL(c,gq[0],gq[1],u*0.18,s);}
}
const FHOUSE=(key)=>({cat:'struct',rho:0.12,draw(c,x,y,u,v){const T=FHOUSE_T[key],o=v&3,s=v>>2,eave=(o>>1)&1;c.fillStyle='rgba(70,40,20,.24)';c.beginPath();c.ellipse(x+u*0.8,y+u*0.2,u*T.sw*(eave?1.15:1),u*T.sh,0,0,7);c.fill();FFLIP(c,x,o&1,()=>FHOUSE_BODY(c,x,y,u,s,eave,T));}});
const FIESTA_ASSETS={
  /* ---------- trees: a sparse desert garden ---------- */
  palm:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*11+2),H=u*(5.2+r()*1.6),lean=(r()-0.5)*u*2.0;FSH(c,x,y,u*1.3);c.lineCap='round';c.strokeStyle='#b09068';c.lineWidth=u*0.62;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*0.1,y-H*0.5,x+lean,y-H);c.stroke();c.strokeStyle='#cbb088';c.lineWidth=u*0.2;c.beginPath();c.moveTo(x-u*0.15,y);c.quadraticCurveTo(x+lean*0.1-u*0.15,y-H*0.5,x+lean-u*0.1,y-H);c.stroke();for(let k=1;k<9;k++){const t=k/9,q=1-t,px=q*q*x+2*q*t*(x+lean*0.1)+t*t*(x+lean),py=q*q*y+2*q*t*(y-H*0.5)+t*t*(y-H);TH.ln(c,[px-u*0.3,py],[px+u*0.3,py+u*0.05],'rgba(80,50,20,.35)',u*0.06);}
    const cx=x+lean,cy=y-H;[-2.9,-2.35,-1.85,-1.3,-0.7,-0.2].forEach((a,i)=>{FFROND(c,cx,cy,a,u*(2.5+r()*0.5),u,i%2?'#4a9a3a':'#5aaa44','#a8dc7a');FFROND(c,cx,cy,Math.PI-a,u*(2.3+r()*0.5),u,i%2?'#5aaa44':'#4a9a3a','#a8dc7a');});[[-0.25,0.2],[0.25,0.25]].forEach(([dx,dy])=>TH.ell(c,cx+dx*u,cy+dy*u,u*0.24,u*0.26,'#8a5a22'));}},
  jacaranda:{cat:'tree',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*7+1),H=u*(4.2+r()*1.0),pal=['#a68ad4','#b89ae0','#8f72c4','#c9b0ec'];FSH(c,x,y,u*2.2);c.lineCap='round';c.strokeStyle='#7a6a58';c.lineWidth=u*0.6;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.2,y-H*0.35,x+u*0.1,y-H*0.62);c.stroke();TH.ln(c,[x,y-H*0.5],[x-u*1.1,y-H*0.82],'#7a6a58',u*0.26);TH.ln(c,[x,y-H*0.55],[x+u*1.2,y-H*0.8],'#7a6a58',u*0.26);const cy=y-H*0.82;[[0,-0.3,1.9,1.1],[-1.5,0,1.2,0.95],[1.5,0,1.2,0.95],[-0.8,-1.05,1.3,0.9],[0.85,-1.05,1.3,0.9]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,10));for(let k=0;k<10;k++)TH.ell(c,x+(r()-0.5)*u*3.4,cy+(r()-0.5)*u*2,u*0.1,u*0.08,'#e0d0f6');}},
  orangeTree:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*23+1),H=u*(3.4+r()*0.6),pal=['#4f8a3a','#5f9a46','#3f7a32','#6faa52'];FSH(c,x,y,u*1.9);TH.ln(c,[x,y],[x,y-H*0.55],'#6a4a30',u*0.45);const cy=y-H*0.78;[[0,-0.2,1.5,1.0],[-1.1,0.1,1.0,0.8],[1.1,0.1,1.0,0.8],[-0.5,-0.9,1.0,0.8],[0.6,-0.9,1.0,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,9));for(let k=0;k<9;k++)TH.ell(c,x+(r()-0.5)*u*2.4,cy+u*(-0.9+r()*1.7),u*0.14,u*0.14,'#f08a24');}},
  cypress:{cat:'tree',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*13+1),H=u*(5.8+r()*1.6);FSH(c,x,y,u*1.0);TH.ln(c,[x,y],[x,y-u*1.0],'#5a3a22',u*0.3);const pal=['#2f6a3e','#3a7a48','#255a34','#448a52'];for(let k=0;k<8;k++){const t=k/7,yy=y-u*0.9-t*(H-u*1.2),rx=u*(0.5+0.3*Math.sin(Math.min(1,t*1.2)*Math.PI*0.85)),ry=u*0.8;TH.blob(c,x+(r()-0.5)*u*0.15,yy,rx,ry,pal[k%4],r,9);}}},
  mesquite:WEST_ASSETS.mesquite,
  saguaro:WEST_ASSETS.saguaro,
  /* ---------- undergrowth: marigolds everywhere ---------- */
  marigolds:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+9);TH.ell(c,x+u*0.2,y+u*0.08,u*1.2,u*0.34,'rgba(70,40,20,.2)');[[-0.6,-0.4,0.8,0.55],[0.6,-0.4,0.8,0.55],[0,-0.8,0.85,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#4f8a3a','#5f9a46','#3f7a32'][i],r,8));for(let k=0;k<16;k++){const fx=x+(r()-0.5)*u*1.8,fy=y-u*(0.3+r()*1.0);FMARIGOLD(c,fx,fy,u*0.28);}}},
  marigoldPatch:{cat:'shrub',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*3+2);TH.ell(c,x+u*0.2,y+u*0.1,u*1.6,u*0.45,'rgba(70,40,20,.18)');TH.ell(c,x,y,u*1.5,u*0.5,'#5a8a3a');for(let k=0;k<22;k++){const a=r()*6.283,rr=Math.sqrt(r()),fx=x+Math.cos(a)*rr*u*1.3,fy=y+Math.sin(a)*rr*u*0.42-u*0.2;FMARIGOLD(c,fx,fy,u*0.26);}}},
  bougainvillea:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*7+2),cols=[['#d9367a','#f06aa0'],['#a02a8a','#d060b8'],['#e8508a','#f4a0c0']][v%3];TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(70,40,20,.2)');[[-0.55,-0.45,0.85,0.6],[0.55,-0.45,0.85,0.6],[0,-0.9,0.9,0.65]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,cols[i%2],r,8));for(let k=0;k<16;k++)TH.ell(c,x+(r()-0.5)*u*1.9,y-u*(0.2+r()*1.1),u*0.1,u*0.08,k%2?cols[1]:'#fff0f6');}},
  agave:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*7+2);TH.ell(c,x+u*0.15,y+u*0.08,u*0.9,u*0.26,'rgba(70,40,20,.2)');for(let k=0;k<12;k++){const a=-Math.PI*0.97+k/11*Math.PI*0.94,l=u*(1.0+r()*0.5);TH.poly(c,[[x,y-u*0.15],[x+Math.cos(a-0.2)*l*0.5,y-u*0.15+Math.sin(a-0.2)*l*0.5],[x+Math.cos(a)*l,y-u*0.15+Math.sin(a)*l],[x+Math.cos(a+0.2)*l*0.5,y-u*0.15+Math.sin(a+0.2)*l*0.5]],k%2?'#6aa89a':'#7fbaa8');}}},
  pricklyPear:WEST_ASSETS.pricklyPear,
  barrelCactus:WEST_ASSETS.barrelCactus,
  dryGrass:WEST_ASSETS.dryGrass,
  stones:{cat:'rock',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.8,'#c8a888'],[0.7,0.2,0.8,0.7,'#d6b898'],[0,-0.35,0.7,0.6,'#b89878']].forEach(([dx,dy,rx,ry,col])=>{const px=x+dx*u,py=y+dy*u,sx=u*rx,sy=u*ry*(1+r()*0.2);TH.ell(c,px+sx*0.15,py+sy*0.3,sx*1.05,sy*0.45,'rgba(70,40,20,.25)');TH.poly(c,[[px-sx,py],[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px-sx*0.6,py+sy*0.2]],col);TH.poly(c,[[px+sx*0.25,py-sy*0.98],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px+sx*0.2,py+sy*0.05]],shade(col,-0.25));TH.poly(c,[[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.1,py-sy*0.5],[px-sx*0.5,py-sy*0.45]],shade(col,0.16));});}},
  lowWall:{cat:'rock',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*7+2),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),pal=FPAL[v%6];TH.ell(c,x+u*0.5,y+u*0.12,u*2.4,u*0.4,'rgba(70,40,20,.24)');FBOX(c,x,y,u,-2.0,2.0,-0.3,0.3,0,0.9,pal[0]);FBOX(c,x,y,u,-2.05,2.05,-0.34,0.34,0.9,1.0,pal[1]);for(let k=0;k<5;k++){const X=-1.6+k*0.8;const pts=FARCH((a,z)=>I(a,0.31,z),X,0.22,0.15,0.5);c.beginPath();FPATH(c,pts);c.fillStyle='rgba(60,30,20,.35)';c.fill();}for(let k=0;k<4;k++)TH.ell(c,...I(-1.4+k*0.9,0,1.15),u*0.18,u*0.14,FCOL[(v+k)%6]);}},
  /* ---------- little houses ---------- */
  casita:FHOUSE('casita'),casaTile:FHOUSE('casaTile'),casaAlta:FHOUSE('casaAlta'),
  /* ---------- the one tower: a small bell wall (espadaña) beside the houses ---------- */
  bellWall:{cat:'struct',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),pal=FPAL[(v>>2)%6];c.fillStyle='rgba(70,40,20,.26)';c.beginPath();c.ellipse(x+u*0.8,y+u*0.2,u*2.0,u*0.65,0,0,7);c.fill();FFLIP(c,x,v&1,()=>{
      FBOX(c,x,y,u,-1.4,1.4,-0.4,0.4,0,0.5,'#c8a888');FBOX(c,x,y,u,-1.2,1.2,-0.35,0.35,0.5,3.0,pal[1]);FBOX(c,x,y,u,-0.9,0.9,-0.32,0.32,3.0,4.4,pal[1]);
      const JY=(a,z)=>I(a,0.4,z);[[-0.5,2.6],[0.5,2.6]].forEach(([xc,zs])=>{const pts=FARCH((a,z)=>I(a,0.36,z),xc,0.3,1.6,zs);c.beginPath();FPATH(c,pts);c.fillStyle='#3a2a2a';c.fill();c.strokeStyle=pal[0];c.lineWidth=u*0.09;c.stroke();const bp=I(xc,0.36,2.1);c.fillStyle='#c89a3a';c.beginPath();c.moveTo(bp[0]-u*0.2,bp[1]+u*0.2);c.quadraticCurveTo(bp[0]-u*0.22,bp[1]-u*0.3,bp[0],bp[1]-u*0.32);c.quadraticCurveTo(bp[0]+u*0.22,bp[1]-u*0.3,bp[0]+u*0.2,bp[1]+u*0.2);c.fill();TH.ell(c,bp[0],bp[1]+u*0.22,u*0.07,u*0.07,'#5a3a22');});
      const ab=FARCH((a,z)=>I(a,0.33,z),0,0.28,3.4,3.9);c.beginPath();FPATH(c,ab);c.fillStyle='#3a2a2a';c.fill();c.strokeStyle=pal[0];c.lineWidth=u*0.08;c.stroke();
      const tp=I(0,0,4.4);TH.poly(c,[[tp[0]-u*1.0,tp[1]],[tp[0]+u*1.0,tp[1]],[tp[0],tp[1]-u*0.8]],pal[0]);TH.ln(c,[tp[0],tp[1]-u*0.8],[tp[0],tp[1]-u*1.6],'#e8c84a',u*0.1);TH.ln(c,[tp[0]-u*0.3,tp[1]-u*1.25],[tp[0]+u*0.3,tp[1]-u*1.25],'#e8c84a',u*0.1);
      FMARIGOLD(c,I(-1.0,0.4,0.9)[0],I(-1.0,0.4,0.9)[1],u*0.2);FMARIGOLD(c,I(1.0,0.4,0.9)[0],I(1.0,0.4,0.9)[1],u*0.2);for(let k=0;k<5;k++){const q=I(-0.9+k*0.45,0.4,0.55);TH.ell(c,q[0],q[1],u*0.12,u*0.1,FCOL[k%6]);}});}},
  /* ---------- Day of the Dead pieces ---------- */
  ofrenda:{cat:'ruin',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*5+9),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);FFLIP(c,x,v&1,()=>{FSH(c,x,y,u*3.0);
      [[-1.5,1.5,-0.9,0.9,0,0.9,'#6a3a8a'],[-1.15,1.15,-0.7,0.7,0.9,1.7,'#d9367a'],[-0.8,0.8,-0.5,0.5,1.7,2.4,'#f08a24']].forEach(([a,b,c0,c1,z0,z1,col])=>{FBOX(c,x,y,u,a,b,c0,c1,z0,z1,col);const n=Math.round((b-a)/0.3);for(let k=0;k<=n;k++){const q=I(a+(b-a)*k/n,c1+0.01,z1-0.12);TH.poly(c,[[q[0]-u*0.14,q[1]],[q[0]+u*0.14,q[1]],[q[0],q[1]+u*0.3]],k%2?'#fbf3e0':FCOL[k%6]);}});
      [[-0.9,2.4],[-0.3,2.4],[0.3,2.4],[0.9,2.4]].forEach(([X,Z],i)=>{});
      for(let k=0;k<7;k++){const q=I(-1.3+k*0.43,0.91,0.9);FMARIGOLD(c,q[0],q[1],u*0.22);}for(let k=0;k<5;k++){const q=I(-0.95+k*0.48,0.71,1.7);FMARIGOLD(c,q[0],q[1],u*0.2);}
      [[-0.9,1.7],[-0.35,1.7],[0.25,1.7],[0.85,1.7]].forEach(([X,Z],i)=>{const q=I(X,0.55,Z);TH.poly(c,[[q[0]-u*0.14,q[1]],[q[0]+u*0.14,q[1]],[q[0]+u*0.12,q[1]-u*0.5],[q[0]-u*0.12,q[1]-u*0.5]],'#fbf3e0','#6a4a30',u*0.04);FFLAME(c,q[0]+u*0.0,q[1]-u*0.5,u*0.6);});
      [-0.8,0.1,0.9].forEach((X,i)=>{const q=I(X,0.35,2.4);FSKULL(c,q[0],q[1]-u*0.3,u*0.28,i+v);});const fr=I(0,0.2,2.4);TH.poly(c,[[fr[0]-u*0.4,fr[1]-u*0.2],[fr[0]+u*0.4,fr[1]-u*0.2],[fr[0]+u*0.4,fr[1]-u*1.2],[fr[0]-u*0.4,fr[1]-u*1.2]],'#e8d8b8','#6a3a1a',u*0.08);TH.ell(c,fr[0],fr[1]-u*0.8,u*0.2,u*0.25,'#a88a6a');
      const top=I(0,0,2.4);c.strokeStyle='#e8d8b8';c.lineWidth=u*0.1;c.beginPath();c.moveTo(top[0]-u*1.5,top[1]+u*0.3);c.quadraticCurveTo(top[0],top[1]-u*3.0,top[0]+u*1.5,top[1]+u*0.3);c.stroke();for(let k=0;k<11;k++){const t=k/10,bx=(1-t)*(1-t)*(top[0]-u*1.5)+2*(1-t)*t*top[0]+t*t*(top[0]+u*1.5),by=(1-t)*(1-t)*(top[1]+u*0.3)+2*(1-t)*t*(top[1]-u*3.0)+t*t*(top[1]+u*0.3);FMARIGOLD(c,bx,by,u*0.2);}
      const py=top[1]-u*2.1;for(let k=0;k<7;k++){const px=top[0]-u*1.2+k*u*0.4;TH.poly(c,[[px-u*0.18,py+(k%2)*u*0.1],[px+u*0.18,py+(k%2)*u*0.1],[px+u*0.18,py+u*0.9],[px,py+u*0.7],[px-u*0.18,py+u*0.9]],FCOL[(k+v)%6],'rgba(255,255,255,.4)',u*0.02);}});}},
  marigoldArch:{cat:'ruin',rho:0.07,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);FFLIP(c,x,v&1,()=>{FSH(c,x,y,u*2.2);[-1.6,1.6].forEach(X=>{TH.ln(c,I(X,0,0),I(X,0,3.2),FWOODD,u*0.3);for(let k=0;k<7;k++){const q=I(X,0,0.3+k*0.45);FMARIGOLD(c,q[0],q[1],u*0.26);}});
      for(let k=0;k<=16;k++){const t=k/16,X=-1.6+3.2*t,Z=3.2+Math.sin(t*Math.PI)*0.9,q=I(X,0,Z);FMARIGOLD(c,q[0],q[1],u*0.28);}for(let k=0;k<8;k++){const t=(k+0.5)/8,X=-1.5+3.0*t,Z=3.1+Math.sin(t*Math.PI)*0.8,q=I(X,0,Z);TH.poly(c,[[q[0]-u*0.2,q[1]+u*0.2],[q[0]+u*0.2,q[1]+u*0.2],[q[0]+u*0.2,q[1]+u*0.9],[q[0],q[1]+u*0.7],[q[0]-u*0.2,q[1]+u*0.9]],FCOL[(k+v)%6],'rgba(255,255,255,.4)',u*0.02);}
      const top=I(0,0,4.15);FSKULL(c,top[0],top[1]-u*0.15,u*0.36,v);});}},
  catrinaStatue:{cat:'ruin',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*7+3);FFLIP(c,x,v&1,()=>{FSH(c,x,y,u*1.6);c.fillStyle='#c8a888';c.fillRect(x-u*0.8,y-u*0.8,u*1.6,u*0.8);TH.ell(c,x,y-u*0.8,u*0.8,u*0.28,'#d6b898');TH.ell(c,x,y,u*0.8,u*0.28,'#b89878');
      const by=y-u*0.8;c.fillStyle='#4a2a6a';c.beginPath();c.moveTo(x-u*1.0,by);c.quadraticCurveTo(x-u*0.9,by-u*1.8,x-u*0.4,by-u*3.0);c.lineTo(x+u*0.4,by-u*3.0);c.quadraticCurveTo(x+u*0.9,by-u*1.8,x+u*1.0,by);c.closePath();c.fill();for(let k=0;k<4;k++){c.fillStyle=FCOL[k+1];c.beginPath();c.ellipse(x-u*0.6+k*u*0.4,by-u*0.3,u*0.18,u*0.12,0,0,7);c.fill();}TH.ln(c,[x-u*0.5,by-u*1.4],[x+u*0.5,by-u*1.4],'#e8508a',u*0.12);
      TH.ln(c,[x-u*0.4,by-u*2.9],[x-u*1.0,by-u*2.0],'#fbf3e0',u*0.26);TH.ln(c,[x+u*0.4,by-u*2.9],[x+u*1.0,by-u*2.1],'#fbf3e0',u*0.26);const hy=by-u*3.7;FSKULL(c,x,hy,u*0.62,v);
      c.fillStyle='#2a1a3a';c.beginPath();c.ellipse(x,hy-u*0.85,u*1.5,u*0.32,0,0,7);c.fill();c.beginPath();c.ellipse(x,hy-u*1.05,u*0.7,u*0.4,0,0,7);c.fill();for(let k=0;k<6;k++){const a=k/6*6.283;FMARIGOLD(c,x+Math.cos(a)*u*1.3,hy-u*0.9+Math.sin(a)*u*0.25,u*0.18);}[[-0.5,-1.5],[0.5,-1.7],[0,-1.9]].forEach(([dx,dy],i)=>TH.ell(c,x+dx*u,hy+dy*u,u*0.12,u*0.3,FCOL[(i+3)%6],0.3*(i-1)));});}},
  skeletonBand:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*5+9),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);FFLIP(c,x,v&1,()=>{FSH(c,x,y,u*3.0);FBOX(c,x,y,u,-2.0,2.0,-0.9,0.9,0,0.35,'#a8784a');
      const skel=(X,kind,col)=>{const b=I(X,0.1,0.35),bx=b[0],by=b[1];TH.ln(c,[bx-u*0.18,by],[bx-u*0.18,by-u*0.9],'#2a2a30',u*0.2);TH.ln(c,[bx+u*0.18,by],[bx+u*0.18,by-u*0.9],'#2a2a30',u*0.2);TH.poly(c,[[bx-u*0.4,by-u*0.9],[bx+u*0.4,by-u*0.9],[bx+u*0.32,by-u*2.0],[bx-u*0.32,by-u*2.0]],'#1a1a20');TH.ln(c,[bx,by-u*0.95],[bx,by-u*1.95],'#c0c4cc',u*0.07);for(let k=0;k<4;k++)TH.ell(c,bx,by-u*(1.1+k*0.22),u*0.07,u*0.07,'#d0d4dc');
        TH.ln(c,[bx-u*0.3,by-u*1.9],[bx-u*0.75,by-u*1.3],'#fbf3e0',u*0.13);TH.ln(c,[bx+u*0.3,by-u*1.9],[bx+u*0.75,by-u*1.4],'#fbf3e0',u*0.13);FSKULL(c,bx,by-u*2.45,u*0.4,v+X);TH.ell(c,bx,by-u*2.85,u*0.85,u*0.2,'#1a1a20');TH.poly(c,[[bx-u*0.4,by-u*2.85],[bx+u*0.4,by-u*2.85],[bx+u*0.25,by-u*3.4],[bx-u*0.25,by-u*3.4]],'#1a1a20');TH.ln(c,[bx-u*0.4,by-u*2.9],[bx+u*0.4,by-u*2.9],col,u*0.09);
        if(kind===0){c.fillStyle='#a8652a';c.beginPath();c.ellipse(bx-u*0.7,by-u*1.35,u*0.38,u*0.3,0.6,0,7);c.fill();TH.ln(c,[bx-u*0.55,by-u*1.55],[bx-u*1.5,by-u*2.4],'#6a4a2a',u*0.1);}else if(kind===1){TH.ln(c,[bx+u*0.7,by-u*1.45],[bx+u*1.5,by-u*1.9],'#e8c84a',u*0.14);TH.poly(c,[[bx+u*1.5,by-u*1.8],[bx+u*1.85,by-u*2.0],[bx+u*1.5,by-u*2.1]],'#e8c84a');}else{TH.ln(c,[bx-u*0.5,by-u*1.6],[bx+u*0.7,by-u*1.2],'#a8652a',u*0.1);TH.ln(c,[bx-u*0.6,by-u*1.1],[bx+u*0.9,by-u*1.9],'#6a4a2a',u*0.05);}};
      skel(-1.2,0,'#e8508a');skel(0,1,'#2ab5b0');skel(1.2,2,'#f2c230');
      const top=I(0,-0.9,3.4);const cols=FCOL;for(let k=0;k<9;k++){const q=I(-1.8+k*0.45,-0.9,3.2);TH.poly(c,[[q[0]-u*0.2,q[1]],[q[0]+u*0.2,q[1]],[q[0]+u*0.2,q[1]+u*0.9],[q[0],q[1]+u*0.7],[q[0]-u*0.2,q[1]+u*0.9]],cols[(k+v)%6],'rgba(255,255,255,.4)',u*0.02);}TH.ln(c,I(-2.0,-0.9,3.3),I(2.0,-0.9,3.3),'#e8e0d0',u*0.05);[-2.0,2.0].forEach(X=>TH.ln(c,I(X,-0.9,0.35),I(X,-0.9,3.3),FWOODD,u*0.16));});}},
  panteon:{cat:'ruin',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*5+9),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);FSH(c,x,y,u*2.6);TH.blob(c,x,y+u*0.1,u*2.4,u*0.9,'#b89878',r,10);
      const grave=(X,Y,kind,col)=>{const b=I(X,Y,0);c.fillStyle='rgba(60,30,20,.3)';c.beginPath();c.ellipse(b[0]+u*0.25,b[1]+u*0.05,u*0.5,u*0.18,0,0,7);c.fill();TH.blob(c,b[0],b[1]-u*0.05,u*0.8,u*0.3,col,r,9);for(let k=0;k<8;k++)FMARIGOLD(c,b[0]+(r()-0.5)*u*1.2,b[1]-u*0.15+(r()-0.5)*u*0.3,u*0.16);
        if(kind===0){c.fillStyle='#fbf3e0';c.fillRect(b[0]-u*0.12,b[1]-u*1.7,u*0.24,u*1.6);c.fillRect(b[0]-u*0.5,b[1]-u*1.35,u*1.0,u*0.22);TH.ln(c,[b[0],b[1]-u*1.7],[b[0],b[1]-u*0.1],FCOL[(v+X)%6|0],u*0.05);}else{c.fillStyle='#fbf3e0';c.beginPath();c.moveTo(b[0]-u*0.45,b[1]-u*0.1);c.lineTo(b[0]-u*0.45,b[1]-u*1.3);c.arc(b[0],b[1]-u*1.3,u*0.45,Math.PI,0);c.lineTo(b[0]+u*0.45,b[1]-u*0.1);c.closePath();c.fill();c.strokeStyle='#6a4a3a';c.lineWidth=u*0.05;c.stroke();FSKULL(c,b[0],b[1]-u*1.15,u*0.22,v+Y);}
        [[-0.7,0.25],[0.7,0.2]].forEach(([dx,dy])=>{const cp=[b[0]+dx*u,b[1]+dy*u];c.fillStyle='#fbf3e0';c.fillRect(cp[0]-u*0.08,cp[1]-u*0.55,u*0.16,u*0.55);FFLAME(c,cp[0],cp[1]-u*0.55,u*0.6);});};
      grave(-1.0,-0.5,0,'#6a3a8a');grave(0.6,-0.3,1,'#d9367a');grave(1.6,0.3,0,'#f08a24');}},
  marketStall:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*7+3),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),k=v%3,awn=k===0?['#e8508a','#f6e0e8']:k===1?['#2ab5b0','#fbf3e0']:['#f08a24','#f2c230'];FFLIP(c,x,(v>>2)&1,()=>{FSH(c,x,y,u*2.2);
      TH.poly(c,[I(-1.5,-0.7,0),I(1.5,-0.7,0),I(1.5,-0.7,2.2),I(-1.5,-0.7,2.2)],'#7a4a30');[-1.5,1.5].forEach(X=>[-0.7,0.7].forEach(Y=>TH.ln(c,I(X,Y,0),I(X,Y,2.2),FWOODD,u*0.14)));FBOX(c,x,y,u,-1.5,1.5,0.1,0.7,0.2,0.95,'#d9a8c0');FBOX(c,x,y,u,-1.55,1.55,0.05,0.75,0.95,1.05,'#f6e0e8');
      for(let i=0;i<6;i++){const p=I(-1.2+i*0.5,0.4,1.05);if(k===0)FSKULL(c,p[0],p[1]-u*0.28,u*0.26,i+v);else if(k===1){c.fillStyle='#c8803a';c.beginPath();c.ellipse(p[0],p[1]-u*0.2,u*0.28,u*0.2,0,0,7);c.fill();TH.ln(c,[p[0]-u*0.2,p[1]-u*0.22],[p[0]+u*0.2,p[1]-u*0.22],'#fbf3e0',u*0.06);TH.ln(c,[p[0],p[1]-u*0.38],[p[0],p[1]-u*0.05],'#fbf3e0',u*0.06);}else{for(let j=0;j<3;j++)FMARIGOLD(c,p[0]+(j-1)*u*0.14,p[1]-u*(0.25+j*0.08),u*0.2);}}
      const n=10,aw=3.2/n;for(let i=0;i<n;i++){const X0=-1.6+i*aw,X1=X0+aw;TH.poly(c,[I(X0,1.0,2.0),I(X1,1.0,2.0),I(X1,-0.7,2.7),I(X0,-0.7,2.7)],awn[i%2]);const e=I(X0+aw/2,1.0,2.0);c.fillStyle=awn[i%2];c.beginPath();c.ellipse(e[0],e[1],u*0.22,u*0.16,0,0,Math.PI);c.fill();}
      for(let i=0;i<8;i++){const q=I(-1.4+i*0.4,1.0,1.95);TH.poly(c,[[q[0]-u*0.14,q[1]],[q[0]+u*0.14,q[1]],[q[0],q[1]+u*0.5]],FCOL[(i+v)%6]);}});}},
  calaveraStatue:{cat:'ruin',rho:0.05,draw(c,x,y,u,v){FFLIP(c,x,v&1,()=>{FSH(c,x,y,u*1.6);c.fillStyle='#c8a888';c.fillRect(x-u*0.9,y-u*1.0,u*1.8,u*1.0);TH.ell(c,x,y-u*1.0,u*0.9,u*0.3,'#d6b898');TH.ell(c,x,y,u*0.9,u*0.3,'#b89878');FSKULL(c,x,y-u*2.4,u*1.35,v);for(let k=0;k<6;k++){const a=k/6*6.283;FMARIGOLD(c,x+Math.cos(a)*u*1.1,y-u*0.95+Math.sin(a)*u*0.3,u*0.2);}});}},
  /* ---------- small props (lower tiers only) ---------- */
  papelPicado:{cat:'prop',rho:0.12,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*2.4,u*0.4,'rgba(70,40,20,.14)');[-2.2,2.2].forEach(X=>TH.ln(c,I(X,0,0),I(X,0,3.4),'#6a4a2a',u*0.18));let prev=null;for(let k=0;k<=12;k++){const X=-2.2+4.4*k/12,p=I(X,0,3.3-Math.sin(k/12*Math.PI)*0.7);if(prev)TH.ln(c,prev,p,'#e8e0d0',u*0.04);prev=p;if(k<12){const q=I(X+0.18,0,3.3-Math.sin((k+0.5)/12*Math.PI)*0.7);TH.poly(c,[[q[0]-u*0.22,q[1]],[q[0]+u*0.22,q[1]],[q[0]+u*0.22,q[1]+u*0.45],[q[0]+u*0.11,q[1]+u*0.36],[q[0],q[1]+u*0.5],[q[0]-u*0.11,q[1]+u*0.36],[q[0]-u*0.22,q[1]+u*0.45]],FCOL[(k+v)%6],'rgba(255,255,255,.5)',u*0.03);}}}},
  farol:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(70,40,20,.24)');TH.ln(c,[x,y],[x,y-u*3.1],'#2a2d36',u*0.2);TH.ln(c,[x,y-u*2.95],[x+u*0.55,y-u*2.95],'#2a2d36',u*0.12);const lx=x+u*0.55,ly=y-u*2.9,g=c.createRadialGradient(lx,ly-u*0.3,0,lx,ly-u*0.3,u*1.6);g.addColorStop(0,'rgba(255,190,90,.55)');g.addColorStop(1,'rgba(255,190,90,0)');c.fillStyle=g;c.beginPath();c.arc(lx,ly-u*0.3,u*1.6,0,7);c.fill();TH.poly(c,[[lx-u*0.28,ly],[lx+u*0.28,ly],[lx+u*0.2,ly-u*0.65],[lx-u*0.2,ly-u*0.65]],FCOL[v%6],'#2a2d36',u*0.06);TH.poly(c,[[lx-u*0.3,ly-u*0.65],[lx+u*0.3,ly-u*0.65],[lx,ly-u*1.0]],'#2a2d36');TH.ell(c,lx,ly-u*0.3,u*0.1,u*0.16,'#ffe9a0');}},
  ollas:{cat:'prop',rho:0.05,draw(c,x,y,u,v){const pot=(px,py,s,col,flowers)=>{TH.ell(c,px+s*u*0.3,py+s*u*0.1,s*u*0.8,s*u*0.26,'rgba(70,40,20,.24)');const w=s*u*0.6,h=s*u*1.1;c.fillStyle=col;c.beginPath();c.moveTo(px-w*0.55,py);c.bezierCurveTo(px-w*1.3,py-h*0.4,px-w*0.8,py-h*0.9,px-w*0.5,py-h);c.lineTo(px+w*0.5,py-h);c.bezierCurveTo(px+w*0.8,py-h*0.9,px+w*1.3,py-h*0.4,px+w*0.55,py);c.ellipse(px,py,w*0.55,w*0.2,0,0,Math.PI);c.fill();TH.ln(c,[px-w*0.9,py-h*0.55],[px+w*0.9,py-h*0.55],'rgba(255,255,255,.6)',s*u*0.08);for(let k=0;k<5;k++)TH.ell(c,px+(k-2)*w*0.3,py-h*0.55,s*u*0.06,s*u*0.06,FCOL[k%6]);TH.ell(c,px,py-h,w*0.5,w*0.18,'#7a3a20');if(flowers)for(let k=0;k<4;k++)FMARIGOLD(c,px+(k-1.5)*w*0.3,py-h-s*u*0.15,s*u*0.2);};pot(x-u*0.7,y,1.0,'#c0603a',true);pot(x+u*0.6,y+u*0.1,0.85,'#d9703a',false);pot(x,y-u*0.2,0.8,'#a84a28',true);}},
  veladoras:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*1.2,u*0.3,'rgba(70,40,20,.22)');[[-0.5,0,1.5],[0.1,0.1,1.9],[0.6,-0.05,1.3],[-0.15,-0.2,1.6]].forEach(([dx,dy,h],i)=>{const px=x+dx*u,py=y+dy*u;c.fillStyle=['rgba(232,80,138,.9)','rgba(240,160,40,.9)','rgba(42,181,176,.9)','rgba(250,240,200,.95)'][i];c.fillRect(px-u*0.22,py-h*u*0.8,u*0.44,h*u*0.8);TH.ell(c,px,py,u*0.22,u*0.09,'rgba(0,0,0,.25)');TH.ell(c,px,py-h*u*0.8,u*0.22,u*0.09,'rgba(255,240,200,.6)');FFLAME(c,px,py-h*u*0.8,u*0.7);});}},
  pinata:{cat:'prop',rho:0.05,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.26,'rgba(70,40,20,.24)');TH.ln(c,[x,y],[x,y-u*4.0],'#6a4a2a',u*0.2);TH.ln(c,[x,y-u*3.9],[x+u*1.2,y-u*3.9],'#6a4a2a',u*0.14);TH.ln(c,[x+u*1.2,y-u*3.9],[x+u*1.2,y-u*3.2],'#e8e0d0',u*0.04);const px=x+u*1.2,py=y-u*2.7;for(let k=0;k<8;k++){const a=k/8*6.283,rr=u*0.95;TH.poly(c,[[px+Math.cos(a-0.3)*u*0.5,py+Math.sin(a-0.3)*u*0.5],[px+Math.cos(a)*rr,py+Math.sin(a)*rr],[px+Math.cos(a+0.3)*u*0.5,py+Math.sin(a+0.3)*u*0.5]],FCOL[k%6]);}TH.ell(c,px,py,u*0.62,u*0.62,'#f2c230');TH.ell(c,px,py,u*0.4,u*0.4,'#e8508a');for(let k=0;k<6;k++){const a=k/6*6.283;TH.ln(c,[px+Math.cos(a)*u*0.9,py+Math.sin(a)*u*0.9],[px+Math.cos(a)*u*1.2,py+Math.sin(a)*u*1.2+u*0.2],FCOL[(k+2)%6],u*0.08);}}}
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

/* ===== FIESTA LAND (Day of the Dead): planner (Western-level sparse trees, little adobe houses sprinkled around, ofrendas / skeleton band / cemetery plots / marigold arch, no terrain) ===== */
const FIESTA_REGION={top:{palm:.22,jacaranda:.16,mesquite:.22,orangeTree:.16,cypress:.12,saguaro:.12},mid:{palm:.22,jacaranda:.16,mesquite:.22,orangeTree:.16,cypress:.12,saguaro:.12},bottom:{palm:.2,jacaranda:.14,mesquite:.24,orangeTree:.22,cypress:.08,saguaro:.12}};
const FIESTA_LOW=[['orangeTree',0.75],['jacaranda',0.6],['mesquite',0.8],['palm',0.55],['orangeTree',0.85],['mesquite',0.65]];
const FIESTA_CAP={saguaro:6,cypress:8};
const FIESTA_UNDER=['marigolds','marigolds','bougainvillea','agave','marigoldPatch','pricklyPear','marigolds','barrelCactus','dryGrass','stones'];
const FIESTA_PLAN_CACHE={};
function getFiestaPlan(shape){
  if(FIESTA_PLAN_CACHE[shape])return FIESTA_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(shape==='A'?7301:8402),placed=[],bb=G.bbox,used={},A=FIESTA_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.66);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'mesquite';};
  const capOk=k=>!(FIESTA_CAP[k]&&(used[k]||0)>=FIESTA_CAP[k]);
  const regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?FIESTA_REGION.top:n<0.68?FIESTA_REGION.mid:FIESTA_REGION.bottom;};
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='tree'?0.88+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;if((D.cat==='tree'||D.cat==='shrub'||D.cat==='prop')&&placed.some(o=>o.noSouth&&Math.abs(px-o.x)<0.3&&py-o.y>-0.05&&py-o.y<0.36))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const tree=(x,y,extra,dom,low)=>{if(low){const L=FIESTA_LOW[Math.floor(rng()*FIESTA_LOW.length)];return place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return place(dom&&rng()<0.55&&capOk(dom)?dom:pickFrom(regionOf(y),capOk),x,y,extra||{});};
  const under=(x,y,extra)=>place(FIESTA_UNDER[Math.floor(rng()*FIESTA_UNDER.length)],x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. the back rim carries the grand ofrenda altar (no tree backdrop: the trees there are the same density as everywhere else) */
  {const pts=[];top.forEach(e=>[0.3,0.5,0.7].forEach(t=>pts.push(onEdge(e,t,0.0))));const p=pts.reduce((b,q)=>Math.abs(q[0]-cx)<Math.abs(b[0]-cx)?q:b);for(const [dx,dy] of [[0,-0.02],[0.3,0],[-0.3,0],[0,0.04]]){const o=place('ofrenda',p[0]+dx,p[1]+dy,{minT:1,scale:1.3,clear:2.4,noSouth:true});if(o)break;}}
  /* 2. little adobe houses sprinkled around: 4 on the rim (spread by farthest-point), 4 through the middle, then ONE bell wall beside a house */
  const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.filter(e=>e.vertical).forEach(e=>inn.push([e.mid[0],e.mid[1]]));
  const chosen=placed.filter(o=>o.cat==='ruin'||o.cat==='struct').map(o=>[o.x,o.y]),manors=[];
  const spread=(k,pool,extra)=>{const ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.22})).sort((a,b)=>b.d-a.d);for(let n=0;n<Math.min(12,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],extra);if(o){chosen.push([o.x,o.y]);if(/^(casita|casaTile|casaAlta)$/.test(k))manors.push(o);return o;}}return null;};
  [['casita',1],['casaTile',2],['casaAlta',3],['casita',4]].forEach(([k,mt])=>spread(k,rim,{minT:mt,scale:1.15,clear:2.5,noSouth:true}));
  [['casaTile',2],['casita',3],['casaAlta',4],['casaTile',4]].forEach(([k,mt])=>spread(k,inn,{minT:mt,scale:1.0,clear:3.0,noSouth:true}));
  {const home=manors[manors.length-1]||placed.find(o=>o.cat==='struct');if(home){for(const [dx,dy] of [[0.36,-0.08],[-0.36,-0.08],[0.3,0.12],[-0.3,0.12],[0.44,0.0],[-0.44,0.0]]){const o=place('bellWall',home.x+dx,home.y+dy,{minT:4,scale:1.1,clear:2.4,noSouth:true});if(o)break;}}}
  /* 2b. Day of the Dead pieces scattered through the land (farthest-point spacing): stalls, cemetery plots, a marigold arch, a second ofrenda, the skeleton band, a Catrina and a calavera statue */
  [['marketStall',1],['panteon',2],['marigoldArch',2],['ofrenda',3],['skeletonBand',3],['catrinaStatue',3],['marketStall',4],['panteon',4],['calaveraStatue',4]].forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,scale:k==='marketStall'||k==='panteon'?1.1:1.0,clear:1.8,noSouth:true}));
  /* 3. trees: very dark, same dense dials as the medieval land (and the top rim is treated exactly like every other edge) */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=pickFrom(regionOf(v.y),capOk),n=rng()<0.6?1+Math.floor(rng()*1.5):0;for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.09:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{const dom=pickFrom(regionOf(e.mid[1]),capOk);[-0.2,0.2].forEach(dy=>{if(rng()<0.3)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.3)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.8+rng()*0.2},null,true);if(rng()<0.0)tree(e.mid[0]+(rng()-0.5)*0.34,e.mid[1]+(rng()-0.5)*0.14,{scale:0.78+rng()*0.2},null,true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.36));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(rng()-0.2)*0.12)});});
    let mode='grove',run=0,dom='mesquite';samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.5?'grove':r<0.8?'sparse':'open';run=2+Math.floor(rng()*4);dom=pickFrom(regionOf(s.p[1]),capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){tree(p[0],p[1],null,dom,low);if(rng()<0.3)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,dom,low);if(rng()<0.08)tree(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,dom,true);if(rng()<0.04)tree(p[0]+(rng()-0.5)*0.34,p[1]-0.2,null,dom,low);}
      else if(mode==='sparse'){if(rng()<0.5)tree(p[0],p[1],null,dom,low);else under(p[0],p[1]);}else if(rng()<0.6)under(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.5)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<8;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.1)tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);}});
  /* 3c. balance the rim: the top, the sides and the bottom must carry the same tree density per unit of boundary (thin the heavy edges, fill the light ones) */
  {const dEdge=(x,y,e)=>{const dx=e.b[0]-e.a[0],dy=e.b[1]-e.a[1],t=Math.max(0,Math.min(1,((x-e.a[0])*dx+(y-e.a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-(e.a[0]+dx*t),(y-(e.a[1]+dy*t))*1.4);};
    const classes=['top','side','bottom'],len={top:0,side:0,bottom:0};outer.forEach(e=>len[e.cls]+=e.len);
    const members=()=>{const m={top:[],side:[],bottom:[]};placed.filter(o=>o.cat==='tree').forEach(o=>{let best=null,bd=1e9;outer.forEach(e=>{const d=dEdge(o.x,o.y,e);if(d<bd){bd=d;best=e;}});if(bd<0.32)m[best.cls].push(o);});return m;};
    let m=members();const mean=(m.top.length+m.side.length+m.bottom.length)/(len.top+len.side+len.bottom);
    classes.forEach(cl=>{const target=Math.round(len[cl]*mean);let list=m[cl];
      if(list.length>target+1){const drop=list.length-target;for(let i=0;i<drop;i++){const pick=list.splice(Math.floor(rng()*list.length),1)[0],ix=placed.indexOf(pick);if(ix>=0)placed.splice(ix,1);}}
      else if(list.length<target-1){const need=target-list.length,es=outer.filter(e=>e.cls===cl);let added=0,guard=0;while(added<need&&guard++<160){const e=es[Math.floor(rng()*es.length)],p=onEdge(e,rng(),(rng()-0.2)*0.12);if(tree(p[0],p[1],null,null,cl!=='top'))added++;}}});}
  /* 3d. sparse lands vary a lot with random placement, so pull the tree total to the Western-level target (add or thin interior trees; the balanced rim is left alone) */
  {const TARGET=88,dE=(x,y,e)=>{const dx=e.b[0]-e.a[0],dy=e.b[1]-e.a[1],t=Math.max(0,Math.min(1,((x-e.a[0])*dx+(y-e.a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-(e.a[0]+dx*t),(y-(e.a[1]+dy*t))*1.4);};
    const isRim=o=>outer.some(e=>dE(o.x,o.y,e)<0.32),trees=()=>placed.filter(o=>o.cat==='tree');
    let n=trees().length;
    if(n>TARGET){const inner=trees().filter(o=>!isRim(o));let drop=Math.min(n-TARGET,inner.length);while(drop-->0){const o=inner.splice(Math.floor(rng()*inner.length),1)[0],ix=placed.indexOf(o);if(ix>=0)placed.splice(ix,1);}}
    else if(n<TARGET){let guard=0;while(trees().length<TARGET&&guard++<900){const c=G.centers[Math.floor(rng()*G.centers.length)],px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);}}}
  /* 4. undergrowth: marigolds above all, bougainvillea, agave, cacti */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.65)under(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.5)under(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.5)under(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.4)under(px,py);}});
  /* 5. small props: lower tiers only */
  [['papelPicado',3],['farol',2],['ollas',2],['veladoras',2],['pinata',1]].forEach(([k,n])=>{for(let i=0;i<n;i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  /* every house gets a facing (bit0 mirror, bit1 gable/eave); neighbours cycle through all four */
  {const houses=placed.filter(o=>/^(casita|casaTile|casaAlta)$/.test(o.kind)).sort((a,b)=>a.x-b.x||a.y-b.y),cyc=[0,3,1,2];houses.forEach((o,i)=>{o.v=((o.v>>2)<<2)|cyc[i%4];});placed.filter(o=>o.kind==='bellWall'||o.kind==='ofrenda').forEach(o=>{o.v=((o.v>>2)<<2)|(rng()<0.5?1:0);});}
  const cuts={tree:[0.2,0.52,0.8,1],shrub:[0.06,0.38,0.7,1],rock:[0.3,0.55,0.8,1],prop:[1,1,1,1],struct:[0,0,0,0],ruin:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='struct'||o.cat==='ruin')o.tier=o.minT;});
  const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
  for(let t=1;t<=4;t++){let guard=0;while(guard++<300){const c=count(t);if(c.tr/Math.max(1,c.n)>=0.5)break;const pool=placed.filter(o=>o.tier<=t&&t<=o.maxT),cand=(pool.filter(o=>o.cat==='shrub').sort((a,b)=>b.pri-a.pri)[0])||(pool.filter(o=>o.prop&&o.minT>1).sort((a,b)=>b.pri-a.pri)[0]);if(!cand)break;cand.tier=Math.min(5,cand.tier+1);}}
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.sort((a,b)=>a.y-b.y);
  return FIESTA_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: warm adobe sand with scattered marigold petals and a little papel-picado confetti (decals, not objects) ---- */
function fiestaGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<46;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'255,240,205':'196,150,100',r()<0.5?0.26:0.2);}
  for(let k=0;k<12;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'205,120,80',0.14);}                 /* terracotta dust */
  for(let k=0;k<10;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'255,255,225',0.16);}                /* sun-bleached */
  for(let k=0;k<5;k++){const p=pt();for(let j=0;j<7;j++){const a=r()*6.283,l=R*(0.06+r()*0.1);TH.ln(c,[p[0],p[1]],[p[0]+Math.cos(a)*l,p[1]+Math.sin(a)*l*0.5],'rgba(120,80,50,.28)',R*0.012);}}
  for(let k=0;k<90;k++){const p=pt(),a=r()*3.14,l=R*(0.025+r()*0.03);TH.ell(c,p[0],p[1],l,l*0.6,r()<0.5?'#f08a24':'#f6b83a',a);}   /* marigold petals */
  for(let k=0;k<50;k++){const p=pt(),sz=R*(0.014+r()*0.01);c.save();c.translate(p[0],p[1]);c.rotate(r()*3);c.fillStyle=['#e8508a','#2ab5b0','#f2c230','#8a4ab8','#7ac43a'][k%5];c.fillRect(-sz,-sz,sz*2,sz*2);c.restore();}   /* confetti */
  for(let k=0;k<110;k++){const p=pt(),h=R*(0.04+r()*0.05);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#b8a860','#a89850','#c8b870'][(k+j)%3],R*0.01);}
  for(let k=0;k<26;k++){const p=pt();TH.ell(c,p[0],p[1],R*(0.014+r()*0.012),R*0.01,'rgba(150,120,90,.55)');}
  c.restore();c.restore();
}
const FIESTA_THEME={id:'fiesta',assets:FIESTA_ASSETS,plan:getFiestaPlan,ground:fiestaGround,groundCol:'#e0c097',top:1.45};
const FIESTA_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
function bakeLandFiesta(shape,tier,R,opts){return bakeLandTheme(FIESTA_THEME,shape,tier,R,opts);}
function drawLandFiestaBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandFiestaDepthBand(ctx,x,y,land,index){const band=land.bands[index];if(!band||!band.canvas)return;const r=band.rect;ctx.drawImage(band.canvas,x-land.ox+r.x,y-land.oy+r.y,r.w,r.h);}
function drawLandFiestaFront(ctx,x,y,land){land.bands.forEach((_,index)=>drawLandFiestaDepthBand(ctx,x,y,land,index));}
return Object.freeze({bake:bakeLandFiesta,drawBack:drawLandFiestaBack,drawDepthBand:drawLandFiestaDepthBand,drawFront:drawLandFiestaFront});
})();
