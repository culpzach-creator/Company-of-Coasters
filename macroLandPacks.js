const frontierLandMacroPack = (() => {

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

/* ===== FRONTIER ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const FSH=(c,x,y,rx)=>{c.fillStyle='rgba(25,32,22,.26)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const FWOOD='#8a5a33',FWOOD_D='#5f3d20',FSTONE='#8f939a';
/* conifer: stacked jagged tiers; o = {h,w,tiers,bare,c1,c2,snow,tw} */
const FCON=(c,x,y,u,o,r)=>{const h=u*o.h,w=u*o.w,n=o.tiers,bare=o.bare===undefined?0.16:o.bare;TH.ln(c,[x,y],[x,y-h*(bare+0.1)],'#5a3b22',u*(o.tw||0.42));
  for(let i=0;i<n;i++){const t=i/n,ww=w*(1-0.8*t)*(0.92+r()*0.16),yb=y-h*(bare+(0.9-bare)*t),tip=yb-h*(o.layer||0.34),dy=yb-tip;
    TH.poly(c,[[x-ww,yb],[x-ww*0.55,yb-h*0.032],[x-ww*0.2,yb+h*0.012],[x+ww*0.25,yb-h*0.032],[x+ww*0.6,yb+h*0.01],[x+ww,yb],[x,tip]],o.c1);
    TH.poly(c,[[x,tip],[x+ww,yb],[x+ww*0.6,yb+h*0.01],[x+ww*0.25,yb-h*0.032],[x,yb]],o.c2);
    if(o.snow){TH.poly(c,[[x,tip],[x-ww*0.56,tip+dy*0.56],[x-ww*0.3,tip+dy*0.64],[x,tip+dy*0.5]],'#f4f8fb');TH.poly(c,[[x,tip],[x,tip+dy*0.5],[x+ww*0.3,tip+dy*0.62],[x+ww*0.56,tip+dy*0.56]],'#d3e0ea');}}};
const FTRI=(c,x,y,s,c1,c2)=>{TH.poly(c,[[x-s*0.55,y],[x,y-s*1.7],[x,y]],c1);TH.poly(c,[[x,y-s*1.7],[x+s*0.55,y],[x,y]],c2);};
const FSNOWCAP=(c,pts,col)=>TH.poly(c,pts,col);
const FRONTIER_ASSETS={
  /* ---------- trees ---------- */
  pine:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*11+2);FSH(c,x,y,u*1.6);FCON(c,x,y,u,{h:4.8+r()*1.3,w:1.45,tiers:6,c1:'#336b42',c2:'#25503a'},r);}},
  spruce:{cat:'tree',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*13+1);FSH(c,x,y,u*1.3);FCON(c,x,y,u,{h:6.0+r()*1.4,w:1.15,tiers:8,c1:'#2c6150',c2:'#1f4a3e',layer:0.3},r);}},
  fir:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*17+4);FSH(c,x,y,u*1.8);FCON(c,x,y,u,{h:3.9+r()*0.9,w:1.75,tiers:5,c1:'#3a7448',c2:'#2a5a3a',layer:0.4,bare:0.1},r);}},
  snowPine:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*19+2);FSH(c,x,y,u*1.6);FCON(c,x,y,u,{h:4.8+r()*1.4,w:1.5,tiers:6,c1:'#2e6040',c2:'#22483a',snow:true},r);}},
  bigPine:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*23+1),H=u*(8.4+r()*1.3);FSH(c,x,y,u*2.0);FCON(c,x,y,u,{h:8.4+r()*1.3,w:2.0,tiers:9,c1:'#326641',c2:'#234d37',bare:0.3,tw:0.7,layer:0.3},r);TH.ln(c,[x-u*0.1,y],[x-u*0.1,y-H*0.32],'#8a5a3a',u*0.16);}},
  aspen:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*5+3),H=u*(4.4+r()*1.0),pal=[['#c9c24a','#b2bf3f','#d9d05a','#9db538'],['#e0b64a','#d29a38','#e8c85a','#c8b040'],['#a9c04a','#8fae3d','#bfd05a','#7aa03a']][v%3];FSH(c,x,y,u*1.8);
    c.lineCap='round';c.strokeStyle='#e8e4d6';c.lineWidth=u*0.5;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.1,y-H*0.4,x+u*0.05,y-H*0.7);c.stroke();for(let k=0;k<8;k++)TH.ln(c,[x-u*0.2,y-H*(0.06+k*0.08)],[x+u*0.1,y-H*(0.06+k*0.08)+u*0.05],'rgba(40,36,30,.55)',u*0.07);TH.ln(c,[x,y-H*0.55],[x-u*0.8,y-H*0.85],'#e8e4d6',u*0.2);TH.ln(c,[x,y-H*0.6],[x+u*0.9,y-H*0.82],'#e8e4d6',u*0.2);
    const cy=y-H*0.85;[[0,-0.5,1.35,1.0],[-1.1,-0.1,1.0,0.85],[1.1,-0.1,1.0,0.85],[-0.5,-1.15,1.0,0.8],[0.6,-1.1,1.0,0.8],[0,0.2,1.2,0.7]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,9));}},
  deadSnag:{cat:'tree',rho:0.04,draw(c,x,y,u,v){const r=mulberry(v*23+1),H=u*(3.4+r()*1.0);FSH(c,x,y,u*0.9);c.lineCap='round';TH.ln(c,[x,y],[x+u*0.12,y-H],'#8a8478',u*0.42);TH.ln(c,[x+u*0.1,y-H*0.55],[x-u*1.0,y-H*0.88],'#8a8478',u*0.22);TH.ln(c,[x+u*0.12,y-H*0.7],[x+u*0.95,y-H*1.0],'#8a8478',u*0.2);TH.ln(c,[x+u*0.12,y-H],[x,y-H*1.2],'#8a8478',u*0.15);TH.ln(c,[x-u*0.1,y],[x-u*0.1,y-H*0.8],'#a8a296',u*0.1);}},
  youngFir:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*29+3);FSH(c,x,y,u*1.2);FCON(c,x,y,u,{h:2.7+r()*0.9,w:1.1,tiers:4,c1:'#3f7a4a',c2:'#2d5f3d',layer:0.42,bare:0.08,tw:0.3},r);}},
  /* ---------- undergrowth ---------- */
  berryBush:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(25,32,22,.22)');[[-0.55,-0.45,0.8,0.55],[0.55,-0.45,0.8,0.55],[0,-0.85,0.85,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#5f8a4a','#4f7a3f','#6f9a55'][i],r,8));for(let k=0;k<7;k++)TH.ell(c,x+(r()-0.5)*u*1.5,y-u*(0.3+r()*0.9),u*0.1,u*0.1,v%2?'#c0392b':'#4a4a9a');}},
  lupine:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*5+9),cols=[['#7a5ac8','#a58be0'],['#4a6ad0','#7f9af0'],['#d65a9a','#f090c0']][v%3];TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.28,'rgba(25,32,22,.2)');for(let k=0;k<4;k++){const bx=x+(k-1.5)*u*0.35;TH.ln(c,[bx,y],[bx+(r()-0.5)*u*0.2,y-u*(1.2+r()*0.8)],'#4f8a45',u*0.1);}for(let k=0;k<4;k++){const bx=x+(k-1.5)*u*0.35,h=1.4+r()*0.7;for(let j=0;j<6;j++)TH.ell(c,bx+(j%2?0.07:-0.07)*u,y-u*(h-j*0.16),u*0.13,u*0.1,cols[j%2]);}}},
  wildflowers:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*7+2);TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.28,'rgba(25,32,22,.2)');for(let k=0;k<12;k++){const fx=x+(r()-0.5)*u*1.6,fy=y-r()*u*0.5;TH.ln(c,[fx,fy],[fx,fy-u*(0.4+r()*0.4)],'#5f8a45',u*0.06);}for(let k=0;k<12;k++){const fx=x+(r()-0.5)*u*1.6,fy=y-u*(0.5+r()*0.8);TH.ell(c,fx,fy,u*0.13,u*0.11,['#f2c230','#f6efe0','#e86a3a','#8a5ac8','#f090c0'][k%5]);TH.ell(c,fx,fy,u*0.05,u*0.05,'#fff0a0');}}},
  grassTuft:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);for(let k=0;k<13;k++){const a=-1.1+k/12*2.2+(r()-0.5)*0.2,l=u*(0.7+r()*0.8);TH.ln(c,[x+(r()-0.5)*u*0.6,y],[x+Math.sin(a)*l*0.8+(r()-0.5)*u*0.3,y-l],['#a3a850','#8d9a46','#b8b660'][k%3],u*0.09);}}},
  fallenLog:{cat:'shrub',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*7+1);TH.ell(c,x+u*0.4,y+u*0.1,u*2.0,u*0.4,'rgba(25,32,22,.25)');const I=(X,Z)=>TH.iso(x,y,u,X,0,Z);const a=I(-1.7,0.4),b=I(1.7,0.4);c.lineCap='round';TH.ln(c,a,b,'#5f3d20',u*0.95);TH.ln(c,[a[0],a[1]-u*0.18],[b[0],b[1]-u*0.18],FWOOD,u*0.6);TH.ln(c,[a[0],a[1]-u*0.36],[b[0],b[1]-u*0.36],'#a67a48',u*0.18);TH.ell(c,b[0]+u*0.05,b[1],u*0.45,u*0.48,'#c9a066');TH.ell(c,b[0]+u*0.05,b[1],u*0.28,u*0.3,'#a67a48');TH.ell(c,b[0]+u*0.05,b[1],u*0.12,u*0.13,'#8a5a33');for(let k=0;k<3;k++)TH.blob(c,x+(r()-0.5)*u*2.2,y-u*0.8,u*0.45,u*0.25,'#5f8a3f',r,7);}},
  stump:{cat:'shrub',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.9,u*0.28,'rgba(25,32,22,.25)');c.fillStyle=FWOOD;c.beginPath();c.moveTo(x-u*0.55,y);c.lineTo(x-u*0.5,y-u*0.8);c.lineTo(x+u*0.5,y-u*0.8);c.lineTo(x+u*0.55,y);c.ellipse(x,y,u*0.55,u*0.2,0,0,Math.PI);c.fill();TH.ell(c,x,y-u*0.8,u*0.5,u*0.2,'#c9a066');TH.ell(c,x,y-u*0.8,u*0.32,u*0.12,'#a67a48');TH.ell(c,x,y-u*0.8,u*0.14,u*0.06,'#8a5a33');}},
  boulders:{cat:'rock',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.8,'#9a9ea6'],[0.7,0.2,0.8,0.7,'#a8acb2'],[0,-0.35,0.7,0.6,'#8a8e96']].forEach(([dx,dy,rx,ry,col])=>{const px=x+dx*u,py=y+dy*u,sx=u*rx,sy=u*ry*(1+r()*0.2);TH.ell(c,px+sx*0.15,py+sy*0.3,sx*1.05,sy*0.45,'rgba(25,32,22,.25)');TH.poly(c,[[px-sx,py],[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px-sx*0.6,py+sy*0.2]],col);TH.poly(c,[[px+sx*0.25,py-sy*0.98],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px+sx*0.2,py+sy*0.05]],shade(col,-0.25));TH.poly(c,[[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.1,py-sy*0.55],[px-sx*0.5,py-sy*0.5]],shade(col,0.16));});}},
  /* ---------- mountains ---------- */
  snowPeak:{cat:'rock',rho:0.22,draw(c,x,y,u,v){const r=mulberry(v*9+2),H=u*(10.8+r()*2.6),w=u*(4.8+r()*0.8);TH.ell(c,x+u*1.2,y+u*0.3,w*1.3,u*0.8,'rgba(25,32,22,.25)');
    const pts=[[-w*1.3,0]],n=10;for(let i=1;i<n;i++){const t=i/n,sh=1-Math.abs(t-0.5)*2;pts.push([-w*1.3+t*w*2.6+(r()-0.5)*w*0.1,-H*Math.pow(sh,0.9)*(0.9+r()*0.14)]);}pts[5]=[(r()-0.5)*w*0.15,-H];pts.push([w*1.3,0]);const sx=pts[5][0];
    c.save();c.translate(x,y);c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle='#8593a3';c.fill();c.clip();
    TH.poly(c,[[sx,-H],[w*1.4,0],[sx+w*0.05,0]].concat([]),'#5c6a7c');TH.poly(c,[[-w*1.4,0],[sx,0],[sx,-H]],'#9aa8b8');
    for(let k=0;k<9;k++){const t=r(),bx=sx+(r()*2-1)*w*0.9;TH.ln(c,[bx,-H*(0.9-t*0.5)],[bx+(r()-0.5)*w*0.2,-H*(0.25+r()*0.2)],r()<0.5?'rgba(40,52,68,.4)':'rgba(220,235,245,.35)',u*0.1);}
    const sl=[];const sn=14;for(let i=0;i<=sn;i++)sl.push([-w*1.4+i/sn*w*2.8,-H*(0.56+(r()-0.5)*0.1)]);
    c.beginPath();c.moveTo(-w*1.4,-H*1.1);sl.forEach(p=>c.lineTo(p[0],p[1]));c.lineTo(w*1.4,-H*1.1);c.closePath();c.save();c.clip();c.fillStyle='#f4f8fb';c.fillRect(-w*1.5,-H*1.2,sx+w*1.5,H*1.3);c.fillStyle='#cfdbe6';c.fillRect(sx,-H*1.2,w*1.6,H*1.3);c.restore();
    for(let k=0;k<5;k++){const bx=sx+(r()*2-1)*w*0.7;TH.ln(c,[bx,-H*(0.9-r()*0.2)],[bx+(r()-0.5)*w*0.15,-H*(0.6+r()*0.05)],'rgba(110,130,150,.45)',u*0.08);}
    for(let k=0;k<52;k++){const t=Math.pow(r(),0.7),yy=-H*0.02-t*H*0.3,span=w*(1.3-t*0.4),xx=(r()*2-1)*span;FTRI(c,xx,yy,u*(0.5+r()*0.35),k%2?'#2f6040':'#264f36',k%2?'#22483a':'#1c3f2e');}
    const g=c.createLinearGradient(0,-H*0.4,0,0);g.addColorStop(0,'rgba(225,238,245,0)');g.addColorStop(1,'rgba(215,232,242,.3)');c.fillStyle=g;c.fillRect(-w*1.4,-H*0.4,w*2.8,H*0.4);c.restore();}},
  pineHill:{cat:'rock',rho:0.2,draw(c,x,y,u,v){const r=mulberry(v*7+8),H=u*(4.8+r()*1.8),w=u*(3.5+r()*0.8);TH.ell(c,x+u*0.8,y+u*0.25,w*1.3,u*0.7,'rgba(25,32,22,.22)');
    c.save();c.translate(x,y);c.beginPath();c.moveTo(-w*1.3,0);c.bezierCurveTo(-w*1.1,-H*0.85,-w*0.45,-H*1.1,0,-H);c.bezierCurveTo(w*0.45,-H*1.05,w*1.1,-H*0.8,w*1.3,0);c.closePath();c.fillStyle='#5f7f4a';c.fill();c.clip();
    const g=c.createLinearGradient(-w*1.3,0,w*1.3,0);g.addColorStop(0,'rgba(200,230,150,.18)');g.addColorStop(0.5,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,30,22,.45)');c.fillStyle=g;c.fillRect(-w*1.4,-H*1.2,w*2.8,H*1.3);
    const trees=[];for(let k=0;k<48;k++){const t=Math.pow(r(),0.85),yy=-H*(0.03+t*0.93),span=w*(1.3-Math.pow(t,1.4)*1.05);trees.push([(r()*2-1)*span,yy,u*(0.5+r()*0.35),k%2]);}trees.sort((a,b)=>a[1]-b[1]).forEach(([tx,ty,s,k])=>FTRI(c,tx,ty,s,k?'#336b42':'#2a5a38',k?'#25503a':'#1e4430'));c.restore();}},
  graniteCliff:{cat:'rock',rho:0.16,draw(c,x,y,u,v){const r=mulberry(v*5+6),H=u*(5.6+r()*1.6),w=u*(2.3+r()*0.5);TH.ell(c,x+u*0.8,y+u*0.2,w*1.5,u*0.55,'rgba(25,32,22,.25)');
    const bands=['#9ea3ab','#8a8f98','#a8adb4','#939aa3'];for(let i=0;i<5;i++){const t0=i/5,t1=(i+1)/5,j0=(r()-0.5)*u*0.4,j1=(r()-0.5)*u*0.4;TH.poly(c,[[x-w+j0,y-H*t0],[x+w+j1,y-H*t0],[x+w*0.94+j1,y-H*t1],[x-w*0.94+j0,y-H*t1]],bands[i%4]);TH.poly(c,[[x+w*0.2,y-H*t0],[x+w+j1,y-H*t0],[x+w*0.94+j1,y-H*t1],[x+w*0.2,y-H*t1]],'rgba(25,32,44,.28)');}
    TH.poly(c,[[x-w*0.98,y-H],[x+w*0.95,y-H],[x+w*0.7,y-H-u*0.55],[x-w*0.7,y-H-u*0.55]],'#f2f6f9');TH.poly(c,[[x+w*0.1,y-H],[x+w*0.95,y-H],[x+w*0.7,y-H-u*0.55],[x+w*0.1,y-H-u*0.55]],'#cfdbe6');for(let k=0;k<3;k++)FTRI(c,x+(r()*2-1)*w*0.7,y-H-u*0.2,u*(0.55+r()*0.3),'#336b42','#25503a');}},
  /* ---------- homestead pieces (sprinkled) ---------- */
  logCabin:{cat:'struct',rho:0.15,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.8,y+u*0.2,u*3.0,u*0.9,'rgba(25,32,22,.25)');TH.box(c,x,y,u,-1.7,1.7,-1.2,1.2,0,2.1,'#93613a','#6a4426','#a8764a');for(let k=0;k<7;k++)TH.ln(c,I(-1.7,1.21,0.15+k*0.3),I(1.7,1.21,0.15+k*0.3),'rgba(45,25,10,.4)',u*0.07);for(let k=0;k<5;k++)TH.ln(c,I(1.71,-1.2+k*0.5,0.1),I(1.71,-1.2+k*0.5,2.0),'rgba(30,15,5,.25)',u*0.05);
    for(let k=0;k<7;k++){const z=0.15+k*0.3;TH.ell(c,...I(-1.72,1.21,z),u*0.12,u*0.09,'#b98a55');TH.ell(c,...I(1.72,1.21,z),u*0.12,u*0.09,'#b98a55');}
    TH.poly(c,[I(-0.4,1.22,0),I(0.4,1.22,0),I(0.4,1.22,1.5),I(-0.4,1.22,1.5)],'#3a2615');TH.poly(c,[I(-1.4,1.22,1.0),I(-0.8,1.22,1.0),I(-0.8,1.22,1.6),I(-1.4,1.22,1.6)],'#2a1a10','#d9c9a0',u*0.05);TH.poly(c,[I(0.9,1.22,1.0),I(1.5,1.22,1.0),I(1.5,1.22,1.6),I(0.9,1.22,1.6)],'#2a1a10','#d9c9a0',u*0.05);
    TH.poly(c,[I(2.0,-1.6,2.1),I(2.0,1.6,2.1),I(0,1.6,3.4),I(0,-1.6,3.4)],'#6a4a2a');for(let k=1;k<7;k++)TH.ln(c,I(2.0-0.285*k,-1.6,2.1+0.186*k),I(2.0-0.285*k,1.6,2.1+0.186*k),'rgba(30,15,5,.4)',u*0.05);TH.poly(c,[I(-2.0,1.6,2.1),I(2.0,1.6,2.1),I(0,1.6,3.4)],'#8a5a33');
    TH.poly(c,[I(1.98,-1.62,2.15),I(1.98,1.62,2.15),I(0.9,1.62,2.85),I(0.9,-1.62,2.85)],'rgba(246,250,252,.9)');TH.box(c,x,y,u,0.8,1.3,-0.9,-0.4,2.9,4.2,'#8d9098','#6d7078','#a3a6ae');TH.poly(c,[[...I(1.05,-0.65,4.35)],[...I(1.05,-0.65,4.35)].map((v,i)=>v+(i?-u*0.6:u*0.15)),[...I(1.05,-0.65,4.35)].map((v,i)=>v+(i?-u*1.1:-u*0.1))],'rgba(230,230,235,.0)');
    TH.ell(c,...I(1.05,-0.65,4.5),u*0.3,u*0.18,'rgba(235,235,240,.7)');TH.ell(c,I(1.05,-0.65,5.0)[0]-u*0.1,I(1.05,-0.65,5.0)[1],u*0.4,u*0.24,'rgba(235,235,240,.5)');}},
  teepee:{cat:'struct',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*7+3),H=u*5.0,w=u*1.9;TH.ell(c,x+u*0.7,y+u*0.18,w*1.5,u*0.55,'rgba(25,32,22,.25)');
    [[-0.5,-1.6],[0.4,-1.7],[-0.2,-1.9],[0.6,-1.5]].forEach(([a,b])=>TH.ln(c,[x+a*w*0.2,y-H*0.95],[x+a*w*0.2+b*u*0.6,y-H*1.28],'#6a4a2a',u*0.12));
    TH.poly(c,[[x-w,y],[x,y-H],[x,y]],'#ede1c4');TH.poly(c,[[x,y-H],[x+w,y],[x,y]],'#cdbf9f');c.beginPath();c.ellipse(x,y,w,w*0.28,0,0,Math.PI);c.fillStyle='#d9ccac';c.fill();
    for(let k=0;k<6;k++){const t=0.15+k*0.07,px=w*(1-t*0.0);}
    const band=(t0,t1,col)=>{const w0=w*(1-t0),w1=w*(1-t1);TH.poly(c,[[x-w0,y-H*t0],[x+w0,y-H*t0],[x+w1,y-H*t1],[x-w1,y-H*t1]],col);};band(0.28,0.38,'#b5362b');band(0.42,0.48,'#2a2a30');for(let k=-3;k<=3;k++){const t=0.33,ww=w*(1-t);TH.poly(c,[[x+k*ww*0.28-ww*0.1,y-H*0.38],[x+k*ww*0.28,y-H*0.28],[x+k*ww*0.28+ww*0.1,y-H*0.38]],'#f2c230');}
    TH.poly(c,[[x+w*0.5,y-H*0.0],[x+w*0.12,y-H*0.0],[x-w*0.05,y-H*0.42],[x+w*0.4,y-H*0.46]],'rgba(0,0,0,0)');TH.poly(c,[[x-w*0.28,y+u*0.05],[x+w*0.28,y+u*0.05],[x+w*0.12,y-H*0.34],[x-w*0.12,y-H*0.34]],'#3a2a1a');TH.poly(c,[[x-w*0.22,y+u*0.05],[x+w*0.0,y+u*0.05],[x-w*0.04,y-H*0.3],[x-w*0.1,y-H*0.3]],'#5a432a');
    TH.ln(c,[x,y-H*1.02],[x+u*0.15,y-H*1.1],'rgba(230,230,235,.0)',u*0.1);TH.ell(c,x+u*0.2,y-H*1.18,u*0.3,u*0.2,'rgba(235,235,240,.55)');TH.ell(c,x+u*0.45,y-H*1.4,u*0.4,u*0.26,'rgba(235,235,240,.38)');for(let k=0;k<5;k++)TH.ell(c,x+(k-2)*w*0.42,y+u*0.14,u*0.14,u*0.1,'#8f939a');}},
  totemPole:{cat:'struct',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*5+9),H=u*7.2,w=u*0.62;TH.ell(c,x+u*0.5,y+u*0.12,u*1.4,u*0.4,'rgba(25,32,22,.26)');TH.ell(c,x,y,u*0.9,u*0.3,'#6b6f52');
    const seg=(y0,y1,col,face)=>{const g=c.createLinearGradient(x-w,0,x+w,0);g.addColorStop(0,shade(col,0.2));g.addColorStop(0.55,col);g.addColorStop(1,shade(col,-0.35));c.fillStyle=g;c.fillRect(x-w,y-y1,w*2,y1-y0);if(face){const fy=y-(y0+y1)/2;TH.ell(c,x-w*0.45,fy-u*0.1,w*0.28,w*0.2,'#f6efe0');TH.ell(c,x+w*0.45,fy-u*0.1,w*0.28,w*0.2,'#f6efe0');TH.ell(c,x-w*0.45,fy-u*0.1,w*0.1,w*0.1,'#222');TH.ell(c,x+w*0.45,fy-u*0.1,w*0.1,w*0.1,'#222');TH.poly(c,[[x-w*0.18,fy-u*0.05],[x+w*0.18,fy-u*0.05],[x+w*0.1,fy+u*0.35],[x-w*0.1,fy+u*0.35]],'#e8a02a');TH.ell(c,x,fy+u*0.52,w*0.5,w*0.16,'#222');TH.ell(c,x,fy+u*0.52,w*0.35,w*0.07,'#b5362b');}};
    seg(0,u*2.1,'#b5362b',true);seg(u*2.1,u*4.0,'#2a8a8a',true);seg(u*4.0,u*5.6,'#e8dcc0',true);seg(u*5.6,H,'#2a2a30',false);
    [[0,1],[1,-1]].forEach(([k,s])=>{c.fillStyle=k?'#b5362b':'#2a8a8a';c.beginPath();c.moveTo(x+s*w*0.9,y-u*5.9);c.quadraticCurveTo(x+s*w*3.2,y-u*7.1,x+s*w*3.6,y-u*5.3);c.quadraticCurveTo(x+s*w*2.2,y-u*5.9,x+s*w*0.9,y-u*5.4);c.fill();c.strokeStyle='#e8dcc0';c.lineWidth=u*0.1;c.beginPath();c.moveTo(x+s*w*1.4,y-u*5.7);c.lineTo(x+s*w*2.9,y-u*6.0);c.stroke();});
    TH.poly(c,[[x-w*0.4,y-H],[x+w*0.4,y-H],[x+w*0.2,y-H-u*0.8],[x,y-H-u*1.1],[x-w*0.2,y-H-u*0.8]],'#e8dcc0');TH.poly(c,[[x-w*0.1,y-H-u*0.4],[x+w*0.5,y-H-u*0.5],[x+w*0.1,y-H-u*0.8]],'#e8a02a');TH.ell(c,x-w*0.12,y-H-u*0.6,w*0.1,w*0.1,'#222');}},
  /* ---------- small props (lower tiers only) ---------- */
  campfire:{cat:'prop',rho:0.06,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.1,u*1.6,u*0.5,'rgba(25,32,22,.25)');for(let k=0;k<8;k++){const a=k/8*6.283;TH.ell(c,x+Math.cos(a)*u*0.95,y+Math.sin(a)*u*0.4,u*0.3,u*0.22,k%2?'#8a8e96':'#a0a4ac');}TH.ln(c,[x-u*0.6,y+u*0.05],[x+u*0.5,y-u*0.2],'#5f3d20',u*0.3);TH.ln(c,[x+u*0.6,y+u*0.05],[x-u*0.5,y-u*0.2],'#4a2f18',u*0.28);const g=c.createRadialGradient(x,y-u*0.8,0,x,y-u*0.8,u*2.0);g.addColorStop(0,'rgba(255,190,90,.5)');g.addColorStop(1,'rgba(255,190,90,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*0.8,u*2.0,0,7);c.fill();TH.poly(c,[[x-u*0.5,y-u*0.15],[x+u*0.5,y-u*0.15],[x+u*0.25,y-u*1.2],[x,y-u*1.7],[x-u*0.2,y-u*1.0]],'#f08a24');TH.poly(c,[[x-u*0.25,y-u*0.15],[x+u*0.25,y-u*0.15],[x,y-u*0.95]],'#ffe27a');}},
  woodpile:{cat:'prop',rho:0.06,draw(c,x,y,u,v){TH.ell(c,x+u*0.4,y+u*0.1,u*1.6,u*0.45,'rgba(25,32,22,.25)');const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.box(c,x,y,u,-1.0,1.0,-0.6,0.6,0,1.1,'#7a4f2a','#5a3a1e','#93633a');for(let row=0;row<3;row++)for(let k=0;k<6;k++){const X=-0.85+k*0.34,Z=0.18+row*0.34;TH.ell(c,...I(X+0.15,0.61,Z),u*0.15,u*0.12,k%2?'#c9a066':'#b98a55');TH.ell(c,...I(X+0.15,0.61,Z),u*0.07,u*0.06,'#8a5a33');}}},
  railFence:{cat:'prop',rho:0.09,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.3,y+u*0.1,u*2.0,u*0.35,'rgba(25,32,22,.16)');for(let k=0;k<4;k++){const X=-1.8+k*1.2;TH.ln(c,I(X,0,0),I(X,0,1.3),FWOOD_D,u*0.2);}[0.45,0.95].forEach(z=>{TH.ln(c,I(-1.8,0,z),I(1.8,0,z),'#a67a48',u*0.15);});TH.ln(c,I(-1.8,0,0.75),I(-0.6,0,0.35),'#a67a48',u*0.1);}},
  lanternPost:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(25,32,22,.25)');TH.ln(c,[x,y],[x,y-u*3.0],FWOOD_D,u*0.28);TH.ln(c,[x,y-u*2.85],[x+u*0.55,y-u*2.85],FWOOD_D,u*0.14);const lx=x+u*0.55,ly=y-u*2.8,g=c.createRadialGradient(lx,ly-u*0.3,0,lx,ly-u*0.3,u*1.4);g.addColorStop(0,'rgba(255,215,130,.5)');g.addColorStop(1,'rgba(255,215,130,0)');c.fillStyle=g;c.beginPath();c.arc(lx,ly-u*0.3,u*1.4,0,7);c.fill();TH.poly(c,[[lx-u*0.25,ly],[lx+u*0.25,ly],[lx+u*0.2,ly-u*0.6],[lx-u*0.2,ly-u*0.6]],'#ffe9a8','#2a2d36',u*0.06);TH.poly(c,[[lx-u*0.3,ly-u*0.6],[lx+u*0.3,ly-u*0.6],[lx,ly-u*0.9]],'#2a2d36');}},
  signpost:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.25,'rgba(25,32,22,.25)');TH.ln(c,[x,y],[x,y-u*2.8],FWOOD_D,u*0.28);[[-1,-2.5,'#b98a55'],[1,-1.8,'#c9a066']].forEach(([d,h,col])=>{TH.poly(c,[[x,y+h*u-u*0.3],[x+d*u*1.5,y+h*u-u*0.3],[x+d*u*1.9,y+h*u],[x+d*u*1.5,y+h*u+u*0.3],[x,y+h*u+u*0.3]],col,FWOOD_D,u*0.05);TH.ln(c,[x+d*u*0.3,y+h*u],[x+d*u*1.2,y+h*u],'rgba(50,30,10,.45)',u*0.06);});}}
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

/* ---- shared depth-sliced baker ---- */
const LAND_BAKE_CACHE={};
function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol,clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]),key=[T.id,shape,tier,R,Math.round(R*sc),sc,m,ground,JSON.stringify(clr)].join('|');if(LAND_BAKE_CACHE[key])return LAND_BAKE_CACHE[key];
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=0.75,top=T.top||1.35,bot=0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const back=document.createElement('canvas');back.width=Math.ceil(W*sc);back.height=Math.ceil(H*sc);const cb=back.getContext('2d');cb.scale(sc,sc);T.ground(cb,G,R,ox,oy,m,ground,shape==='A'?11:22);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]),vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho)));
  const rowYs=[...new Set(G.centers.map(c=>c.y))].sort((a,b)=>a-b),objectsByBand=rowYs.map(()=>[]);
  vis.forEach(o=>{let band=0;while(band<rowYs.length-1&&o.y>=(rowYs[band]+rowYs[band+1])/2)band++;objectsByBand[band].push(o);});
  const bands=objectsByBand.map((objects,index)=>{
    let x0=W,y0=H,x1=0,y1=0;
    objects.forEach(o=>{const px=ox+m*o.x*R,py=oy+o.y*R,s=(o.scale||1)*u;x0=Math.min(x0,px-4*s);x1=Math.max(x1,px+4*s);y0=Math.min(y0,py-9*s);y1=Math.max(y1,py+2*s);});
    if(!objects.length)return{canvas:null,rect:{x:0,y:0,w:0,h:0},depth:oy+rowYs[index]*R};
    x0=Math.max(0,Math.floor(x0));y0=Math.max(0,Math.floor(y0));x1=Math.min(W,Math.ceil(x1));y1=Math.min(H,Math.ceil(y1));
    const w=x1-x0,h=y1-y0,canvas=document.createElement('canvas');canvas.width=Math.ceil(w*sc);canvas.height=Math.ceil(h*sc);
    const cg=canvas.getContext('2d');cg.scale(sc,sc);cg.translate(-x0,-y0);
    objects.sort((a,b)=>a.y-b.y).forEach(o=>T.assets[o.kind].draw(cg,ox+m*o.x*R,oy+o.y*R,u*(o.scale||1),o.v));
    return{canvas,rect:{x:x0,y:y0,w,h},depth:oy+rowYs[index]*R};
  });
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return LAND_BAKE_CACHE[key]={back,bands,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0};
}
function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}

/* ===== FRONTIER LAND: planner (jungle-level tree density, conifer-led), olive ground, snowy range on the back rim ===== */
const FRONTIER_REGION={top:{pine:.28,spruce:.26,snowPine:.16,fir:.1,aspen:.06,deadSnag:.03,youngFir:.06,bigPine:.0},mid:{pine:.3,spruce:.2,fir:.14,aspen:.22,deadSnag:.04,youngFir:.1},bottom:{aspen:.28,pine:.2,fir:.14,youngFir:.2,spruce:.12,deadSnag:.06}};
const FRONTIER_LOW=[['youngFir',1],['aspen',0.65],['fir',0.62],['youngFir',1.25],['pine',0.55],['aspen',0.75],['fir',0.7]];
const FRONTIER_CAP={bigPine:5,deadSnag:4,snowPine:10};
const FRONTIER_UNDER=['berryBush','lupine','wildflowers','grassTuft','fallenLog','berryBush','stump','grassTuft','boulders'];
const FRONTIER_PLAN_CACHE={};
function getFrontierPlan(shape){
  if(FRONTIER_PLAN_CACHE[shape])return FRONTIER_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(shape==='A'?8101:9202),placed=[],bb=G.bbox,used={},A=FRONTIER_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.66);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'pine';};
  const capOk=k=>!(FRONTIER_CAP[k]&&(used[k]||0)>=FRONTIER_CAP[k]);
  const regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?FRONTIER_REGION.top:n<0.68?FRONTIER_REGION.mid:FRONTIER_REGION.bottom;};
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='tree'?0.88+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const tree=(x,y,extra,dom,low)=>{if(low){const L=FRONTIER_LOW[Math.floor(rng()*FRONTIER_LOW.length)];return place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return place(dom&&rng()<0.55&&capOk(dom)?dom:pickFrom(regionOf(y),capOk),x,y,extra||{});};
  const under=(x,y,extra)=>place(FRONTIER_UNDER[Math.floor(rng()*FRONTIER_UNDER.length)],x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. the snowy range on the back rim: peaks, pine-covered hills and granite cliffs, plus tall emergent pines behind them */
  {const pts=[];top.forEach(e=>[0.2,0.5,0.8].forEach(t=>pts.push(onEdge(e,t,0.0))));pts.sort((a,b)=>a[0]-b[0]);const x0=pts[0][0],x1=pts[pts.length-1][0],nearest=x=>pts.reduce((b,p)=>Math.abs(p[0]-x)<Math.abs(b[0]-x)?p:b);
    const centers=[];let x=x0+0.12+rng()*0.2;while(x<x1-0.05){centers.push(x);x+=0.8+rng()*0.55;}
    centers.forEach((cxp,i)=>{const p=nearest(cxp),bx=p[0],by=p[1],t=rng(),mt=a=>a+(rng()<0.35?1:0),at=(k,dx,dy,ex)=>place(k,bx+dx,by+dy,ex),pk=i===Math.floor(centers.length/2)?1:mt(2);
      if(t<0.42){at('snowPeak',0,-0.02,{minT:pk,scale:0.92+rng()*0.2});at('pineHill',-0.5,0.03,{minT:mt(1)});at('pineHill',0.5,0.02,{minT:mt(2)});at('boulders',0.02,0.1,{minT:1});}
      else if(t<0.74){at('pineHill',-0.3,0.01,{minT:1});at('snowPeak',0.18,-0.02,{minT:mt(2),scale:0.78});at('graniteCliff',-0.6,0.04,{minT:3});at('boulders',0.1,0.1,{minT:2});}
      else{at('pineHill',-0.25,0.01,{minT:mt(1)});at('pineHill',0.3,0.0,{minT:2});at('graniteCliff',0.0,-0.02,{minT:3,scale:0.8});at('boulders',-0.05,0.1,{minT:1});}});
    {const gaps=[];for(let i=0;i+1<centers.length;i++)gaps.push(i);[gaps[0],gaps[gaps.length-1]].filter((g,i,a)=>g!==undefined&&a.indexOf(g)===i).forEach((gi,k)=>{const p=nearest((centers[gi]+centers[gi+1])/2);place('bigPine',p[0],p[1]-0.06,{minT:k?4:3,scale:0.95,clear:1.3});});}}
  /* 2. homestead pieces sprinkled across the whole land (farthest-point spacing): cabins on the rim, teepees and totems anywhere */
  {const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.forEach(e=>inn.push([e.mid[0],e.mid[1]]));
    const seq=[['teepee','a',1],['logCabin','r',2],['teepee','i',2],['totemPole','a',3],['logCabin','r',3],['teepee','a',3],['totemPole','a',4],['logCabin','r',4],['teepee','i',4]],chosen=[],sc={teepee:1.1,logCabin:1.2,totemPole:1.0};
    seq.forEach(([k,z,mt])=>{const pool=z==='r'?rim:z==='i'?inn:rim.concat(inn),ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.25})).sort((a,b)=>b.d-a.d);
      for(let n=0;n<Math.min(10,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],{minT:mt,scale:sc[k],clear:1.9});if(o){chosen.push([o.x,o.y]);return;}}});}
  /* 3. trees (conifer-led): junction groves, corridor trees, rim groves and a fill pass for the corners */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=pickFrom(regionOf(v.y),capOk),n=2+Math.floor(rng()*1.8);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.09:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{const dom=pickFrom(regionOf(e.mid[1]),capOk);[-0.27,0,0.27].forEach(dy=>{if(rng()<0.7)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.72)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.8+rng()*0.2},null,true);if(rng()<0.22)tree(e.mid[0]+(rng()-0.5)*0.34,e.mid[1]+(rng()-0.5)*0.14,{scale:0.78+rng()*0.2},null,true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.26));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(e.cls==='top'?-0.02:0)+(rng()-0.2)*0.12)});});
    let mode='grove',run=0,dom='pine';samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.74?'grove':r<0.92?'sparse':'open';run=2+Math.floor(rng()*4);dom=pickFrom(regionOf(s.p[1]),capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){if(e.cls==='top'&&rng()<0.2)return;tree(p[0],p[1],null,dom,low);if(rng()<0.55)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,dom,low);if(rng()<0.2)tree(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,dom,true);if(rng()<0.14)tree(p[0]+(rng()-0.5)*0.34,p[1]-0.2,null,dom,low);}
      else if(mode==='sparse'){if(rng()<0.5)tree(p[0],p[1],null,dom,low);else under(p[0],p[1]);}else if(rng()<0.6)under(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.8)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<14;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.3)tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);}});
  /* 4. undergrowth */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.45)under(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.35)under(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.38)under(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.3)under(px,py);}});
  /* 5. small props: lower tiers only */
  [['campfire',2],['woodpile',2],['railFence',2],['lanternPost',2],['signpost',1]].forEach(([k,n])=>{for(let i=0;i<n;i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  const cuts={tree:[0.2,0.52,0.8,1],shrub:[0.06,0.38,0.7,1],rock:[0.3,0.55,0.8,1],prop:[1,1,1,1],struct:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='struct')o.tier=o.minT;});
  const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
  for(let t=1;t<=4;t++){let guard=0;while(guard++<300){const c=count(t);if(c.tr/Math.max(1,c.n)>=0.74)break;const pool=placed.filter(o=>o.tier<=t&&t<=o.maxT),cand=(pool.filter(o=>o.cat==='shrub').sort((a,b)=>b.pri-a.pri)[0])||(pool.filter(o=>o.prop&&o.minT>1).sort((a,b)=>b.pri-a.pri)[0]);if(!cand)break;cand.tier=Math.min(5,cand.tier+1);}}
  placed.sort((a,b)=>a.y-b.y);
  return FRONTIER_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: olive forest floor with pine-needle litter, dry-grass tufts, wildflowers and a light frost near the mountains (decals, not objects) ---- */
function frontierGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<44;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'170,176,100':'60,78,44',r()<0.5?0.2:0.22);}
  for(let k=0;k<14;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'110,80,48',0.2);}               /* needle duff / bare earth */
  for(let k=0;k<10;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'215,200,120',0.16);}              /* sun-dried grass */
  for(let k=0;k<7;k++){const p=[bx[0]+r()*bx[2],bx[1]+r()*bx[3]*0.45],w=R*(0.35+r()*0.5);soft(p[0],p[1],w,w*0.4,'240,246,250',0.28);}   /* frost near the range */
  for(let k=0;k<90;k++){const p=pt(),a=r()*3.14,l=R*(0.03+r()*0.04);TH.ln(c,[p[0],p[1]],[p[0]+Math.cos(a)*l,p[1]+Math.sin(a)*l*0.5],r()<0.5?'rgba(104,70,40,.55)':'rgba(130,92,52,.5)',R*0.008);}   /* pine needles */
  for(let k=0;k<150;k++){const p=pt(),h=R*(0.05+r()*0.06);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#a3a850','#8d9a46','#b8b660'][(k+j)%3],R*0.011);}
  for(let k=0;k<40;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.011,R*0.009,['#f6efe0','#f2c230','#8a5ac8','#e86a3a','#7f9af0'][k%5]);}
  for(let k=0;k<26;k++){const p=pt();TH.ell(c,p[0],p[1],R*(0.015+r()*0.012),R*0.01,'rgba(150,154,160,.6)');}
  c.restore();c.restore();
}
const FRONTIER_THEME={id:'frontier',assets:FRONTIER_ASSETS,plan:getFrontierPlan,ground:frontierGround,groundCol:'#7f8b55',top:1.45};
const FRONTIER_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
function bakeLandFrontier(shape,tier,R,opts){return bakeLandTheme(FRONTIER_THEME,shape,tier,R,opts);}
function drawLandFrontierBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandFrontierDepthBand(ctx,x,y,land,index){const band=land.bands[index];if(!band||!band.canvas)return;const r=band.rect;ctx.drawImage(band.canvas,x-land.ox+r.x,y-land.oy+r.y,r.w,r.h);}
function drawLandFrontierFront(ctx,x,y,land){land.bands.forEach((_,index)=>drawLandFrontierDepthBand(ctx,x,y,land,index));}
function landFrontierSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}


return Object.freeze({ bake: bakeLandFrontier, drawBack: drawLandFrontierBack, drawDepthBand: drawLandFrontierDepthBand, drawFront: drawLandFrontierFront });
})();

const jungleLandMacroPack = (() => {

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

/* ===== JUNGLE ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const JS=(c,x,y,rx)=>{c.fillStyle='rgba(12,40,22,.28)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const JPAL=[['#2f6b3a','#3f8a45','#58a04f','#2a5c35'],['#2b6a46','#3a8a58','#4fa56a','#25583b'],['#3d7a34','#58a03f','#76b84e','#336a2c'],['#2a6048','#37805e','#4c9c74','#234f3b']];
const JSTONE='#b5ae94',JSTONE_D='#8c866e',JSTONE_L='#cfc9b0',JMOSS='#5f8f3f';
const JFROND=(c,x,y,ang,len,u,col,mid,droop)=>{const ex=x+Math.cos(ang)*len,ey=y+Math.sin(ang)*len*0.6+len*(droop||0.35),mx=x+Math.cos(ang)*len*0.55,my=y+Math.sin(ang)*len*0.7-len*0.25;
  c.lineCap='round';c.strokeStyle=col;c.lineWidth=u*0.42;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(mx,my,ex,ey);c.stroke();c.strokeStyle=mid;c.lineWidth=u*0.1;c.stroke();
  for(let k=1;k<7;k++){const t=k/7,q=1-t,px=q*q*x+2*q*t*mx+t*t*ex,py=q*q*y+2*q*t*my+t*t*ey,s=len*0.2*(1-t*0.6);TH.ln(c,[px,py],[px+Math.sin(ang)*s*0.5-Math.cos(ang)*s*0.2,py+s*0.55],col,u*0.14);TH.ln(c,[px,py],[px-Math.sin(ang)*s*0.5-Math.cos(ang)*s*0.2,py+s*0.55],col,u*0.14);}};
const JBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.28),shade(col,0.16));
const JVINE=(c,x,y,u,r,n)=>{for(let k=0;k<n;k++){const vx=x+(r()-0.5)*u*2.4,vy=y-r()*u*1.2;TH.ell(c,vx,vy,u*(0.25+r()*0.3),u*(0.18+r()*0.2),r()<0.5?'#4d8a3a':'#3a7030');}};
const JUNGLE_ASSETS={
  /* ---------- trees ---------- */
  broadleaf:{cat:'tree',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*7+1),H=u*(4.6+r()*1.3),pal=JPAL[v%4];JS(c,x,y,u*2.3);c.lineCap='round';c.strokeStyle='#5f4228';c.lineWidth=u*0.7;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.1,y-H*0.35,x+u*0.05,y-H*0.62);c.stroke();TH.poly(c,[[x-u*0.55,y],[x-u*0.2,y-u*0.9],[x+u*0.15,y-u*0.9],[x+u*0.6,y]],'#5f4228');TH.ln(c,[x-u*0.1,y-H*0.1],[x-u*0.05,y-H*0.55],'#7b5a38',u*0.18);
    TH.ln(c,[x,y-H*0.5],[x-u*1.1,y-H*0.85],'#5f4228',u*0.32);TH.ln(c,[x,y-H*0.55],[x+u*1.2,y-H*0.82],'#5f4228',u*0.3);
    const cy=y-H*0.82;[[0,-0.3,1.9,1.15],[-1.55,-0.1,1.3,1.0],[1.55,-0.1,1.3,1.0],[-0.8,-1.15,1.45,1.0],[0.85,-1.15,1.45,1.0],[0,-1.7,1.2,0.85],[-1.1,0.5,0.9,0.6],[1.1,0.5,0.9,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[(i+(v>>2))%4],r,10));
    for(let k=0;k<4;k++){const vx=x+(r()-0.5)*u*2.6,vy=cy+u*(0.4+r()*0.5);TH.ln(c,[vx,vy],[vx+(r()-0.5)*u*0.3,vy+u*(0.8+r()*0.8)],'#3a7030',u*0.08);}}},
  ceiba:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*5+3),H=u*(8.4+r()*1.6);JS(c,x,y,u*2.6);const t='#8a7d68',td='#6d6150';
    TH.poly(c,[[x-u*1.5,y+u*0.1],[x-u*0.55,y-u*2.2],[x-u*0.45,y-u*0.2]],td);TH.poly(c,[[x+u*1.5,y+u*0.1],[x+u*0.55,y-u*2.2],[x+u*0.45,y-u*0.2]],td);TH.poly(c,[[x-u*0.7,y],[x-u*0.5,y-H*0.78],[x+u*0.5,y-H*0.78],[x+u*0.7,y]],t);TH.poly(c,[[x+u*0.1,y],[x+u*0.1,y-H*0.78],[x+u*0.5,y-H*0.78],[x+u*0.7,y]],'rgba(40,28,18,.25)');
    for(let k=0;k<6;k++)TH.ln(c,[x-u*0.45,y-H*(0.1+k*0.12)],[x+u*0.45,y-H*(0.1+k*0.12)-u*0.1],'rgba(40,28,18,.14)',u*0.07);
    [[-1,0.9],[0,1.0],[1,0.88]].forEach(([d,f])=>TH.ln(c,[x,y-H*0.7],[x+d*u*2.2,y-H*f*0.95],t,u*0.4));const pal=JPAL[v%4],cy=y-H*0.93;
    [[-3.0,0.4,1.7,0.7],[3.0,0.4,1.7,0.7],[-1.7,-0.1,2.0,0.9],[1.7,-0.1,2.0,0.9],[0,-0.35,2.3,0.95],[-0.8,0.5,1.7,0.6],[0.9,0.5,1.7,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,10));}},
  palm:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*11+2),H=u*(5.2+r()*1.6),lean=(r()-0.5)*u*2.0;JS(c,x,y,u*1.3);c.lineCap='round';c.strokeStyle='#a08c68';c.lineWidth=u*0.62;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*0.1,y-H*0.5,x+lean,y-H);c.stroke();c.strokeStyle='#bba67e';c.lineWidth=u*0.2;c.beginPath();c.moveTo(x-u*0.15,y);c.quadraticCurveTo(x+lean*0.1-u*0.15,y-H*0.5,x+lean-u*0.1,y-H);c.stroke();
    for(let k=1;k<9;k++){const t=k/9,q=1-t,px=q*q*x+2*q*t*(x+lean*0.1)+t*t*(x+lean),py=q*q*y+2*q*t*(y-H*0.5)+t*t*(y-H);TH.ln(c,[px-u*0.32,py],[px+u*0.32,py+u*0.05],'rgba(60,40,20,.35)',u*0.06);}
    const cx=x+lean,cy=y-H;[-2.9,-2.35,-1.85,-1.3,-0.7,-0.2].forEach((a,i)=>{JFROND(c,cx,cy,a,u*(2.5+r()*0.5),u,i%2?'#2f7a3a':'#3a8a42','#8fcf6a',0.3);JFROND(c,cx,cy,Math.PI-a-Math.PI*1.0+Math.PI,u*(2.3+r()*0.5),u,i%2?'#3a8a42':'#2f7a3a','#8fcf6a',0.3);});[[-0.25,0.2],[0.25,0.25],[0,0.35]].forEach(([dx,dy])=>TH.ell(c,cx+dx*u,cy+dy*u,u*0.24,u*0.26,'#6b4a22'));}},
  fanPalm:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*3+9);JS(c,x,y,u*1.4);TH.ln(c,[x,y],[x,y-u*1.4],'#6b4a2e',u*0.5);const cy=y-u*1.5;for(let k=0;k<9;k++){const a=-Math.PI+0.15+k/8*(Math.PI-0.3),l=u*(1.7+r()*0.4);c.save();c.translate(x,cy);c.rotate(a+Math.PI/2);TH.ell(c,0,-l*0.62,u*0.62,l*0.62,k%2?'#3a8a45':'#2f7a3a');TH.ln(c,[0,0],[0,-l*1.2],'#8fcf6a',u*0.07);c.restore();}}},
  bamboo:{cat:'tree',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*13+1);JS(c,x,y,u*1.6);const n=6+Math.floor(r()*3);for(let k=0;k<n;k++){const bx=x+(k-n/2)*u*0.36+(r()-0.5)*u*0.2,H=u*(4.8+r()*2.4),lean=(r()-0.5)*u*0.9,col=k%2?'#9bb54a':'#b4c862';c.lineCap='round';c.strokeStyle=col;c.lineWidth=u*0.3;c.beginPath();c.moveTo(bx,y+u*(r()-0.5)*0.3);c.quadraticCurveTo(bx+lean*0.3,y-H*0.5,bx+lean,y-H);c.stroke();
      for(let j=1;j<7;j++){const t=j/7;TH.ln(c,[bx+lean*t*t-u*0.17,y-H*t],[bx+lean*t*t+u*0.17,y-H*t],'#5f7a2a',u*0.06);}
      for(let j=0;j<5;j++){const a=-Math.PI*0.9+j/4*Math.PI*0.8,l=u*(0.9+r()*0.5);TH.ln(c,[bx+lean,y-H],[bx+lean+Math.cos(a)*l,y-H+Math.sin(a)*l*0.7+u*0.25],r()<0.5?'#4f9a3f':'#6fb34a',u*0.16);}}}},
  treeFern:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*17+4),H=u*(2.0+r()*0.8);JS(c,x,y,u*1.4);TH.ln(c,[x,y],[x+u*0.1,y-H],'#4a3a2a',u*0.5);for(let k=0;k<5;k++)TH.ln(c,[x-u*0.2,y-H*(0.15+k*0.17)],[x+u*0.25,y-H*(0.15+k*0.17)],'#6b5238',u*0.07);for(let k=0;k<10;k++){const a=-Math.PI+0.2+k/9*(Math.PI-0.4);JFROND(c,x+u*0.1,y-H,a,u*(1.9+r()*0.5),u,k%2?'#4a9a3f':'#3a8a35','#a8e07a',0.4);}}},
  cecropia:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*19+2),H=u*(5.2+r()*1.2);JS(c,x,y,u*1.4);TH.ln(c,[x,y],[x,y-H*0.7],'#b9ad94',u*0.4);for(let k=1;k<9;k++)TH.ln(c,[x-u*0.2,y-H*0.08*k],[x+u*0.2,y-H*0.08*k],'rgba(70,55,35,.35)',u*0.06);
    [[-1.3,0.95],[0,1.05],[1.3,0.92]].forEach(([dx,f])=>{const bx=x+dx*u,by=y-H*f;TH.ln(c,[x,y-H*0.6],[bx,by+u*0.4],'#a99b82',u*0.22);const lc=['#6fb35a','#8cc66a','#5a9f4a'];for(let k=0;k<7;k++){const a=-Math.PI*0.95+k/6*Math.PI*0.9,l=u*(1.5+r()*0.3);TH.poly(c,[[bx,by],[bx+Math.cos(a-0.22)*l*0.8,by+Math.sin(a-0.22)*l*0.5],[bx+Math.cos(a)*l,by+Math.sin(a)*l*0.55],[bx+Math.cos(a+0.22)*l*0.8,by+Math.sin(a+0.22)*l*0.5]],lc[k%3]);}}) ;}},
  strangler:{cat:'tree',rho:0.15,draw(c,x,y,u,v){const r=mulberry(v*23+1),H=u*(5.4+r()*0.8),pal=JPAL[(v+1)%4];JS(c,x,y,u*2.6);const root=(x0,w)=>{c.lineCap='round';c.strokeStyle='#6a5236';c.lineWidth=u*0.4;c.beginPath();c.moveTo(x+x0*1.5,y);c.bezierCurveTo(x+x0*0.6,y-H*0.2,x+x0*0.1-w,y-H*0.4,x+w*0.3,y-H*0.7);c.stroke();c.strokeStyle='#8a6e48';c.lineWidth=u*0.12;c.stroke();};
    [-1.0,-0.4,0.4,1.0].forEach((x0,i)=>root(x0*u,(i%2?0.3:-0.3)*u));TH.ln(c,[x,y-H*0.55],[x-u*1.5,y-H*0.9],'#6a5236',u*0.4);TH.ln(c,[x,y-H*0.6],[x+u*1.6,y-H*0.88],'#6a5236',u*0.4);const cy=y-H*0.88;
    [[0,-0.2,2.3,1.25],[-2.0,0.1,1.5,1.0],[2.0,0.1,1.5,1.0],[-1.0,-1.1,1.6,1.0],[1.0,-1.1,1.6,1.0],[0,-1.6,1.3,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,10));for(let k=0;k<7;k++){const ax=x+(r()-0.5)*u*4.2,ay=cy+u*0.5;TH.ln(c,[ax,ay],[ax+(r()-0.5)*u*0.3,Math.min(y-u*0.2,ay+u*(1.5+r()*2.2))],'#6a5236',u*0.1);}}},
  jungleBush:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*29+3),pal=[['#3f8a45','#58a04f','#6fb35a','#2f7a3a'],['#4a9a3f','#6fb34a','#8cc66a','#3a8a35'],['#2f7a3a','#3f8a45','#58a04f','#2a6a38']][v%3];JS(c,x,y,u*1.6);TH.ln(c,[x,y],[x,y-u*0.9],'#5f4228',u*0.4);[[0,-1.9,1.2,0.9],[-0.9,-1.2,1.0,0.8],[0.9,-1.2,1.0,0.8],[0,-1.0,1.4,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,pal[i%4],r,9));}},
  /* ---------- undergrowth ---------- */
  fern:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(12,40,22,.22)');for(let k=0;k<9;k++){const a=-Math.PI+0.15+k/8*(Math.PI-0.3);JFROND(c,x,y-u*0.1,a,u*(1.2+r()*0.45),u,k%2?'#4a9a3f':'#3a8a35','#a8e07a',0.5);}}},
  elephantEar:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+9);TH.ell(c,x+u*0.2,y+u*0.08,u*1.0,u*0.3,'rgba(12,40,22,.22)');[[-0.7,-1.0,-0.5],[0.7,-1.1,0.5],[0,-1.5,0],[-0.2,-0.6,-0.2]].forEach(([dx,dy,rot],i)=>{const px=x+dx*u,py=y+dy*u;TH.ln(c,[x,y],[px,py+u*0.2],'#5f8a3a',u*0.14);c.save();c.translate(px,py);c.rotate(rot);c.fillStyle=i%2?'#3f8a45':'#2f7a3a';c.beginPath();c.moveTo(0,u*0.5);c.bezierCurveTo(-u*0.95,u*0.1,-u*0.8,-u*1.1,0,-u*0.95);c.bezierCurveTo(u*0.8,-u*1.1,u*0.95,u*0.1,0,u*0.5);c.fill();TH.ln(c,[0,u*0.4],[0,-u*0.8],'#8fcf6a',u*0.06);c.restore();});}},
  heliconia:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*7+2);TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.28,'rgba(12,40,22,.22)');[[-0.7,-1.5],[0.7,-1.6],[0,-2.0]].forEach(([dx,dy],i)=>{c.save();c.translate(x+dx*u*0.4,y);c.rotate(dx*0.35);c.fillStyle=i%2?'#3a8a42':'#2f7a3a';c.beginPath();c.ellipse(0,dy*u*0.5,u*0.38,u*0.85,0,0,7);c.fill();TH.ln(c,[0,0],[0,dy*u*0.9],'#8fcf6a',u*0.05);c.restore();});
    [[0.25,-1.8,'#d9433b'],[-0.35,-1.5,'#f08a24']].forEach(([dx,dy,col])=>{for(let k=0;k<4;k++)TH.poly(c,[[x+dx*u+k*u*0.12,y+dy*u+k*u*0.28],[x+dx*u+u*0.35+k*u*0.12,y+dy*u+k*u*0.28+u*0.15],[x+dx*u+u*0.1+k*u*0.12,y+dy*u+k*u*0.28+u*0.4]],col);});}},
  flowerBush:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*11+4),cols=[['#e86aa8','#f4a6cb'],['#d9433b','#f08a24'],['#f2c230','#fff0a0'],['#8a5ac8','#c9a6f0']][v%4];TH.ell(c,x+u*0.2,y+u*0.08,u*1.0,u*0.3,'rgba(12,40,22,.22)');[[-0.55,-0.5,0.8,0.55],[0.55,-0.5,0.8,0.55],[0,-0.9,0.85,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#3a8a45','#2f7a3a','#4a9a3f'][i],r,8));for(let k=0;k<11;k++){const fx=x+(r()-0.5)*u*1.7,fy=y-u*(0.3+r()*1.0);TH.ell(c,fx,fy,u*0.17,u*0.15,cols[k%2]);TH.ell(c,fx,fy,u*0.06,u*0.06,'#fff6c0');}}},
  jungleGrass:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);for(let k=0;k<13;k++){const a=-1.1+k/12*2.2+(r()-0.5)*0.2,l=u*(0.7+r()*0.8);TH.ln(c,[x+(r()-0.5)*u*0.6,y],[x+Math.sin(a)*l*0.8+(r()-0.5)*u*0.3,y-l],['#4f9a3f','#6fb34a','#3a8a35'][k%3],u*0.09);}}},
  banana:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*13+5);JS(c,x,y,u*1.3);TH.ln(c,[x,y],[x,y-u*1.8],'#8fa55a',u*0.5);for(let k=0;k<6;k++){const a=-Math.PI+0.2+k/5*(Math.PI-0.4);const ex=x+Math.cos(a)*u*2.0,ey=y-u*1.8+Math.sin(a)*u*0.8+u*0.9;c.fillStyle=k%2?'#4a9a3f':'#3a8a35';c.beginPath();c.moveTo(x,y-u*1.8);c.quadraticCurveTo(x+Math.cos(a)*u*1.1,y-u*2.8,ex,ey);c.quadraticCurveTo(x+Math.cos(a)*u*1.0,y-u*1.6,x,y-u*1.8);c.fill();TH.ln(c,[x,y-u*1.8],[ex,ey],'#a8e07a',u*0.05);}
    TH.ln(c,[x,y-u*1.7],[x+u*0.4,y-u*1.0],'#6b8a3a',u*0.1);for(let k=0;k<5;k++)TH.ell(c,x+u*0.4+(k%2)*u*0.15,y-u*(0.7+k*0.1),u*0.14,u*0.09,'#e8c83a');}},
  /* ---------- mountains, cliffs, waterfalls ---------- */
  mossBoulders:{cat:'rock',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.8,'#8d9086'],[0.7,0.2,0.8,0.7,'#9a9d92'],[0,-0.35,0.7,0.6,'#80847a']].forEach(([dx,dy,rx,ry,col])=>{const px=x+dx*u,py=y+dy*u,sx=u*rx,sy=u*ry*(1+r()*0.2);TH.ell(c,px+sx*0.15,py+sy*0.3,sx*1.05,sy*0.45,'rgba(12,40,22,.25)');TH.poly(c,[[px-sx,py],[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px-sx*0.6,py+sy*0.2]],col);TH.poly(c,[[px+sx*0.25,py-sy*0.98],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px+sx*0.2,py+sy*0.05]],shade(col,-0.25));TH.poly(c,[[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.1,py-sy*0.5],[px-sx*0.5,py-sy*0.45]],JMOSS);TH.ell(c,px-sx*0.3,py-sy*0.7,sx*0.3,sy*0.15,'rgba(180,230,120,.35)');});}},
  peak:{cat:'rock',rho:0.22,draw(c,x,y,u,v){const r=mulberry(v*9+2),H=u*(9.5+r()*2.5),w=u*(4.3+r()*0.8),tx=(r()-0.5)*w*0.25;TH.ell(c,x+u*1.2,y+u*0.3,w*1.3,u*0.8,'rgba(12,40,22,.25)');
    const sil=()=>{c.beginPath();c.moveTo(-w*1.3,0);c.bezierCurveTo(-w*1.2,-H*0.35,-w*0.9,-H*0.62,-w*0.5+tx,-H*0.84);c.bezierCurveTo(-w*0.3+tx,-H*1.0,-w*0.05+tx,-H*1.05,w*0.22+tx,-H*0.98);c.bezierCurveTo(w*0.5,-H*0.92,w*0.72,-H*0.7,w*0.92,-H*0.42);c.bezierCurveTo(w*1.12,-H*0.2,w*1.22,-H*0.08,w*1.3,0);c.closePath();};
    c.save();c.translate(x,y);sil();c.fillStyle='#46874a';c.fill();c.clip();
    let g=c.createLinearGradient(-w*1.3,0,w*1.3,0);g.addColorStop(0,'rgba(190,240,150,.22)');g.addColorStop(0.45,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(8,34,22,.55)');c.fillStyle=g;c.fillRect(-w*1.4,-H*1.1,w*2.8,H*1.2);
    const rock=[[w*0.12,-H*0.97],[w*0.5,-H*0.9],[w*0.74,-H*0.66],[w*0.62,-H*0.34],[w*0.34,-H*0.3],[w*0.16,-H*0.55]];TH.poly(c,rock,'#8c8d7e');TH.poly(c,[[w*0.4,-H*0.93],[w*0.74,-H*0.66],[w*0.62,-H*0.34],[w*0.42,-H*0.32]],'rgba(30,34,26,.35)');
    for(let k=0;k<9;k++){const sx=w*(0.17+k*0.06);TH.ln(c,[sx,-H*(0.93-k*0.012)],[sx+w*0.04,-H*(0.36+r()*0.14)],'rgba(40,44,34,.35)',u*0.09);}for(let k=0;k<6;k++)TH.ln(c,[w*0.2+r()*w*0.4,-H*0.9],[w*0.2+r()*w*0.4,-H*(0.45+r()*0.2)],'#4f9a45',u*0.12);
    for(let k=0;k<125;k++){const t=Math.pow(r(),0.8),yy=-H*(0.04+t*0.94),span=w*(1.28-Math.pow(t,1.6)*1.0),xx=(r()*2-1)*span;if(xx>w*0.1&&yy<-H*0.28&&yy>-H*0.97&&xx<w*0.78)continue;const rr=u*(0.5+r()*0.5);c.fillStyle=['#2f6b3a','#3f8a45','#58a04f','#2a5c35','#6fb35a'][Math.floor(r()*5)];c.beginPath();c.ellipse(x*0+xx,yy,rr,rr*0.78,0,0,7);c.fill();if(r()<0.5){c.fillStyle='rgba(190,240,140,.3)';c.beginPath();c.ellipse(xx-rr*0.25,yy-rr*0.3,rr*0.5,rr*0.3,0,0,7);c.fill();}}
    g=c.createLinearGradient(0,-H*0.5,0,0);g.addColorStop(0,'rgba(215,238,228,0)');g.addColorStop(1,'rgba(205,232,222,.3)');c.fillStyle=g;c.fillRect(-w*1.4,-H*0.5,w*2.8,H*0.5);c.restore();}},
  hill:{cat:'rock',rho:0.2,draw(c,x,y,u,v){const r=mulberry(v*7+8),H=u*(4.6+r()*1.8),w=u*(3.4+r()*0.8);TH.ell(c,x+u*0.8,y+u*0.25,w*1.3,u*0.7,'rgba(12,40,22,.22)');
    c.save();c.translate(x,y);c.beginPath();c.moveTo(-w*1.3,0);c.bezierCurveTo(-w*1.1,-H*0.85,-w*0.45,-H*1.12,0,-H);c.bezierCurveTo(w*0.45,-H*1.05,w*1.1,-H*0.8,w*1.3,0);c.closePath();c.fillStyle='#4a8f4c';c.fill();c.clip();
    const g=c.createLinearGradient(-w*1.3,0,w*1.3,0);g.addColorStop(0,'rgba(190,240,150,.2)');g.addColorStop(0.5,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(8,34,22,.5)');c.fillStyle=g;c.fillRect(-w*1.4,-H*1.2,w*2.8,H*1.3);
    for(let k=0;k<70;k++){const t=Math.pow(r(),0.8),yy=-H*(0.03+t*0.95),span=w*(1.3-Math.pow(t,1.5)*1.05),xx=(r()*2-1)*span,rr=u*(0.45+r()*0.45);c.fillStyle=['#2f6b3a','#3f8a45','#58a04f','#2a5c35','#6fb35a'][Math.floor(r()*5)];c.beginPath();c.ellipse(xx,yy,rr,rr*0.78,0,0,7);c.fill();if(r()<0.5){c.fillStyle='rgba(190,240,140,.3)';c.beginPath();c.ellipse(xx-rr*0.25,yy-rr*0.3,rr*0.5,rr*0.3,0,0,7);c.fill();}}c.restore();}},
  cliff:{cat:'rock',rho:0.16,draw(c,x,y,u,v){const r=mulberry(v*5+6),H=u*(5.6+r()*1.6),w=u*(2.2+r()*0.5);TH.ell(c,x+u*0.8,y+u*0.2,w*1.5,u*0.55,'rgba(12,40,22,.25)');
    const bands=['#8a8c80','#7a7d72','#96988c','#80837a'];for(let i=0;i<5;i++){const t0=i/5,t1=(i+1)/5,j0=(r()-0.5)*u*0.4,j1=(r()-0.5)*u*0.4;TH.poly(c,[[x-w+j0,y-H*t0],[x+w+j1,y-H*t0],[x+w*0.94+j1,y-H*t1],[x-w*0.94+j0,y-H*t1]],bands[i%4]);TH.poly(c,[[x+w*0.2,y-H*t0],[x+w+j1,y-H*t0],[x+w*0.94+j1,y-H*t1],[x+w*0.2,y-H*t1]],'rgba(20,30,20,.28)');}
    for(let k=0;k<5;k++){const vx=x+(r()*2-1)*w*0.8;TH.ln(c,[vx,y-H*0.95],[vx+(r()-0.5)*u*0.4,y-H*(0.35+r()*0.5)],'#3f8a45',u*0.14);}TH.poly(c,[[x-w*0.98,y-H],[x+w*0.95,y-H],[x+w*0.7,y-H-u*0.5],[x-w*0.7,y-H-u*0.5]],'#4f9250');for(let k=0;k<5;k++)TH.blob(c,x+(r()*2-1)*w*0.8,y-H-u*0.3,u*0.6,u*0.45,['#2f6b3a','#3f8a45','#58a04f'][k%3],r,7);}},
  waterfall:{cat:'rock',rho:0.22,draw(c,x,y,u,v){const r=mulberry(v*3+1),H=u*9.0,w=u*3.4;TH.ell(c,x+u*0.6,y+u*0.3,w*1.6,u*0.9,'rgba(12,40,22,.25)');
    const wall=(x0,x1,col)=>{for(let i=0;i<6;i++){const t0=i/6,t1=(i+1)/6;TH.poly(c,[[x0,y-H*t0],[x1,y-H*t0],[x1,y-H*t1],[x0,y-H*t1]],shade(col,(i%2?-0.06:0.04)));}};wall(x-w*1.5,x-w*0.28,'#85887c');wall(x+w*0.28,x+w*1.5,'#6f7268');TH.poly(c,[[x+w*0.2,y],[x+w*1.5,y],[x+w*1.5,y-H],[x+w*0.2,y-H]],'rgba(20,30,20,.18)');
    TH.poly(c,[[x-w*0.3,y-H],[x+w*0.3,y-H],[x+w*0.3,y-H*0.35],[x-w*0.3,y-H*0.35]],'#5a5e55');
    const g=c.createLinearGradient(x,y-H,x,y);g.addColorStop(0,'rgba(235,248,255,.95)');g.addColorStop(0.5,'rgba(190,228,245,.9)');g.addColorStop(1,'rgba(235,248,255,.95)');c.fillStyle=g;c.beginPath();c.moveTo(x-w*0.3,y-H*0.98);c.lineTo(x+w*0.3,y-H*0.98);c.lineTo(x+w*0.34,y-u*0.1);c.lineTo(x-w*0.34,y-u*0.1);c.closePath();c.fill();
    for(let k=-3;k<=3;k++){const sx=x+k*w*0.08;TH.ln(c,[sx,y-H*0.95],[sx+(r()-0.5)*u*0.1,y-u*0.3],k%2?'rgba(255,255,255,.75)':'rgba(120,190,225,.5)',u*0.1);}
    TH.poly(c,[[x-w*1.55,y-H],[x+w*1.55,y-H],[x+w*1.2,y-H-u*0.7],[x-w*1.2,y-H-u*0.7]],'#4f9250');for(let k=0;k<8;k++)TH.blob(c,x+(k-3.5)*w*0.4,y-H-u*0.35,u*0.7,u*0.55,['#2f6b3a','#3f8a45','#58a04f','#2a5c35'][k%4],r,8);
    [[-1.2,0.55],[1.1,0.6]].forEach(([dx,f])=>{for(let k=0;k<5;k++)TH.ln(c,[x+dx*w+(r()-0.5)*u,y-H*(0.95-k*0.04)],[x+dx*w+(r()-0.5)*u*0.5,y-H*(f*0.4+r()*0.3)],'#3f8a45',u*0.13);});
    const py=y+u*0.55;TH.ell(c,x,py,w*1.45,u*0.95,'#2f8798');TH.ell(c,x,py,w*1.3,u*0.8,'#4fb3c4');TH.ell(c,x-w*0.2,py-u*0.08,w*0.8,u*0.4,'rgba(200,240,250,.45)');[[0.3,0.9],[0.62,0.85],[0.95,0.7]].forEach(([s,a])=>{c.strokeStyle='rgba(255,255,255,'+a*0.5+')';c.lineWidth=u*0.08;c.beginPath();c.ellipse(x,py,w*1.2*s+w*0.15,u*0.7*s+u*0.08,0,0,7);c.stroke();});
    for(let k=0;k<7;k++)TH.ell(c,x+(r()-0.5)*w*0.9,y+u*0.05+(r()-0.5)*u*0.4,u*(0.5+r()*0.4),u*(0.4+r()*0.3),'rgba(255,255,255,.55)');c.save();c.globalAlpha=0.35;TH.ell(c,x,y-u*0.8,w*0.9,u*1.4,'#e8f6fb');c.restore();
    [[-1.5,0.7],[1.6,0.75]].forEach(([dx,dy])=>WRKJ(c,x+dx*w,y+u*dy,u*0.6,u*0.45));}},
  /* ---------- Mayan ruins (small, overgrown) ---------- */
  smallPyramid:{cat:'ruin',rho:0.14,draw(c,x,y,u,v){const r=mulberry(v*7+3),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.9,y+u*0.25,u*3.6,u*1.0,'rgba(12,40,22,.28)');
    const tiers=[[-2.2,2.2,0,0.95],[-1.75,1.75,0.95,1.9],[-1.3,1.3,1.9,2.85]];tiers.forEach(([a,b,z0,z1],i)=>{JBOX(c,x,y,u,a,b,a,b,z0,z1,i%2?JSTONE:'#bdb69c');for(let k=-2;k<=2;k++)TH.ln(c,I(k*Math.abs(b)*0.4,b+0.01,z0+0.08),I(k*Math.abs(b)*0.4,b+0.01,z1-0.08),'rgba(50,45,30,.16)',u*0.05);});
    TH.poly(c,[I(-0.45,2.21,0),I(0.45,2.21,0),I(0.45,1.31,2.85),I(-0.45,1.31,2.85)],JSTONE_L);for(let k=1;k<9;k++)TH.ln(c,I(-0.45+0.01,2.21-k*0.1,k*0.32),I(0.45,2.21-k*0.1,k*0.32),'rgba(80,70,50,.35)',u*0.05);
    JBOX(c,x,y,u,-0.75,0.75,-0.75,0.75,2.85,3.8,'#c4bda3');TH.poly(c,[I(-0.3,0.76,2.85),I(0.3,0.76,2.85),I(0.3,0.76,3.5),I(-0.3,0.76,3.5)],'#3a3426');JBOX(c,x,y,u,-0.95,0.95,-0.95,0.95,3.8,4.15,'#a9a38a');
    JVINE(c,x-u*1.2,y-u*1.0,u,r,6);JVINE(c,x+u*1.4,y-u*0.8,u,r,6);TH.blob(c,x-u*1.5,y-u*1.9,u*0.9,u*0.6,'#3f8a45',r,8);TH.blob(c,x+u*1.8,y-u*1.3,u*0.8,u*0.55,'#58a04f',r,8);TH.blob(c,x+u*0.1,y-u*4.4,u*0.7,u*0.5,'#2f6b3a',r,8);}},
  stela:{cat:'ruin',rho:0.04,draw(c,x,y,u,v){const r=mulberry(v*5+9),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.5,y+u*0.12,u*1.4,u*0.4,'rgba(12,40,22,.25)');JBOX(c,x,y,u,-0.9,0.9,-0.9,0.9,0,0.35,JSTONE_D);JBOX(c,x,y,u,-0.4,0.4,-0.18,0.18,0.35,3.7,JSTONE);
    for(let k=0;k<5;k++){const z=0.7+k*0.55;TH.poly(c,[I(-0.3,0.19,z),I(0.3,0.19,z),I(0.3,0.19,z+0.38),I(-0.3,0.19,z+0.38)],'rgba(60,52,36,.3)');TH.ell(c,...I(-0.12+(k%2)*0.2,0.2,z+0.19),u*0.07,u*0.07,'rgba(40,34,22,.5)');}
    TH.poly(c,[I(-0.4,-0.18,3.7),I(0.4,-0.18,3.7),I(0.4,0.18,3.7),I(-0.4,0.18,3.7)],JSTONE_L);JVINE(c,x,y-u*0.8,u,r,2);if(r()<0.6)TH.blob(c,x+u*0.5,y-u*0.2,u*0.5,u*0.35,'#58a04f',r,7);}},
  brokenWall:{cat:'ruin',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*7+2),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.6,y+u*0.15,u*2.6,u*0.5,'rgba(12,40,22,.25)');JBOX(c,x,y,u,-2.0,1.0,-0.45,0.45,0,1.05,JSTONE);JBOX(c,x,y,u,1.0,2.0,-0.45,0.45,0,0.55,'#a9a38a');JBOX(c,x,y,u,-2.0,-0.6,-0.45,0.45,1.05,1.7,JSTONE_L);
    for(let k=0;k<7;k++){const X=-1.8+k*0.5;TH.ln(c,I(X,0.46,0.5),I(X+0.2,0.46,0.5),'rgba(50,45,30,.4)',u*0.07);TH.ln(c,I(X+0.2,0.46,0.5),I(X+0.2,0.46,0.75),'rgba(50,45,30,.4)',u*0.07);TH.ln(c,I(X+0.2,0.46,0.75),I(X+0.4,0.46,0.75),'rgba(50,45,30,.4)',u*0.07);}
    JBOX(c,x,y,u,1.5,2.2,0.7,1.3,0,0.4,JSTONE_D);JBOX(c,x,y,u,-0.2,0.5,0.8,1.4,0,0.3,'#a9a38a');JVINE(c,x,y-u*0.5,u,r,6);TH.blob(c,x+u*1.2,y-u*0.9,u*0.9,u*0.5,'#3f8a45',r,8);}},
  stoneHead:{cat:'ruin',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.5,y+u*0.14,u*1.7,u*0.5,'rgba(12,40,22,.28)');const cx=x,cy=y-u*1.15;
    const g=c.createRadialGradient(cx-u*0.5,cy-u*0.6,u*0.2,cx,cy,u*1.5);g.addColorStop(0,'#c9c3aa');g.addColorStop(1,'#8c866e');c.fillStyle=g;c.beginPath();c.ellipse(cx,cy,u*1.25,u*1.15,0,0,7);c.fill();TH.poly(c,[[cx-u*1.3,cy-u*0.3],[cx+u*1.3,cy-u*0.3],[cx+u*1.1,cy-u*0.95],[cx-u*1.1,cy-u*0.95]],'#9a947c');
    TH.ell(c,cx-u*0.45,cy-u*0.1,u*0.3,u*0.18,'#3a3426');TH.ell(c,cx+u*0.45,cy-u*0.1,u*0.3,u*0.18,'#3a3426');TH.poly(c,[[cx-u*0.2,cy],[cx+u*0.2,cy],[cx+u*0.3,cy+u*0.5],[cx-u*0.3,cy+u*0.5]],'#a39d86');TH.ell(c,cx,cy+u*0.62,u*0.58,u*0.2,'#6d6853');TH.ell(c,cx,cy+u*0.62,u*0.45,u*0.1,'#3a3426');
    TH.poly(c,[[x-u*1.5,y],[x-u*1.0,y-u*0.7],[x+u*1.1,y-u*0.7],[x+u*1.6,y]],'#5f8f3f');for(let k=0;k<5;k++)TH.blob(c,x+(r()-0.5)*u*2.4,y-u*(0.1+r()*0.5),u*0.5,u*0.3,['#3f8a45','#58a04f'][k%2],r,7);JVINE(c,cx,cy-u*0.9,u,r,4);}},
  stairRuin:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*11+1),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.6,y+u*0.15,u*2.2,u*0.5,'rgba(12,40,22,.25)');for(let k=0;k<5;k++){const w=1.2-(k>3?0.35:0);JBOX(c,x,y,u,-w,w,-1.1+k*0.42,1.1,0,0.3+k*0.3,k%2?JSTONE:'#bdb69c');}
    JBOX(c,x,y,u,-1.6,-1.2,-1.1,1.1,0,1.2,JSTONE_D);JBOX(c,x,y,u,1.2,1.6,-1.1,1.1,0,0.7,JSTONE_D);JVINE(c,x,y-u*0.6,u,r,7);TH.blob(c,x-u*1.6,y-u*1.5,u*0.7,u*0.5,'#3f8a45',r,8);TH.blob(c,x+u*0.4,y-u*1.8,u*0.9,u*0.6,'#58a04f',r,8);}},
  altar:{cat:'ruin',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*13+4),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.5,y+u*0.12,u*1.8,u*0.5,'rgba(12,40,22,.25)');JBOX(c,x,y,u,-1.2,1.2,-1.2,1.2,0,0.4,JSTONE_D);[[-0.7,-0.5],[0.7,-0.5],[-0.7,0.5],[0.7,0.5]].forEach(([X,Y])=>JBOX(c,x,y,u,X-0.18,X+0.18,Y-0.18,Y+0.18,0.4,1.1,JSTONE));JBOX(c,x,y,u,-1.0,1.0,-0.85,0.85,1.1,1.5,JSTONE_L);
    [-0.5,-0.15,0.2,0.55].forEach((X,i)=>TH.ell(c,...I(X,0.86,1.3),u*0.09,u*0.07,'rgba(40,34,22,.55)'));const f=I(0,0,1.5);TH.ell(c,f[0],f[1],u*0.6,u*0.25,'#3a3426');TH.ell(c,f[0],f[1]-u*0.35,u*0.35,u*0.35,'#d9433b');TH.ell(c,f[0],f[1]-u*0.55,u*0.2,u*0.28,'#f2c230');JVINE(c,x,y-u*0.3,u,r,3);}},
  ruinedArch:{cat:'ruin',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*7+8),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.7,y+u*0.18,u*2.6,u*0.6,'rgba(12,40,22,.25)');JBOX(c,x,y,u,-2.0,-0.2,-0.6,0.6,0,3.4,JSTONE);JBOX(c,x,y,u,0.2,1.2,-0.6,0.6,0,1.9,'#a9a38a');
    [[0,-0.2,3.4,0.2],[0.3,-0.2,3.0,0.1]].forEach(()=>0);TH.poly(c,[I(-0.2,-0.6,2.2),I(0.2,-0.6,2.2),I(0.2,0.6,2.2),I(-0.2,0.6,2.2)],'#b5ae94');JBOX(c,x,y,u,-0.2,0.45,-0.6,0.6,2.2,2.6,JSTONE);
    TH.poly(c,[I(-0.2,0.61,0),I(0.2,0.61,0),I(0.2,0.61,2.2),I(-0.2,0.61,2.2)],'#3a3426');for(let k=0;k<6;k++)TH.ln(c,I(-1.8,0.61,0.4+k*0.5),I(-0.4,0.61,0.4+k*0.5),'rgba(50,45,30,.2)',u*0.05);JVINE(c,x-u*1.0,y-u*1.5,u,r,7);TH.blob(c,x-u*1.4,y-u*4.3,u*1.0,u*0.65,'#3f8a45',r,8);TH.blob(c,x+u*0.9,y-u*2.4,u*0.7,u*0.5,'#58a04f',r,8);}},
  columns:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*9+6);TH.ell(c,x+u*0.5,y+u*0.14,u*2.3,u*0.5,'rgba(12,40,22,.25)');[[-1.1,0.2,2.6],[0.1,-0.1,1.7],[1.2,0.3,1.0]].forEach(([dx,dy,h],i)=>{const px=x+dx*u,py=y+dy*u,w=u*0.42;const gr=c.createLinearGradient(px-w,0,px+w,0);gr.addColorStop(0,'#cfc9b0');gr.addColorStop(1,'#8c866e');c.fillStyle=gr;c.fillRect(px-w,py-h*u,w*2,h*u);TH.ell(c,px,py,w,w*0.4,'#8c866e');TH.ell(c,px,py-h*u,w,w*0.4,i===2?'#a9a38a':'#cfc9b0');for(let k=1;k<4;k++)TH.ln(c,[px-w,py-h*u*k/4],[px+w,py-h*u*k/4+u*0.04],'rgba(50,45,30,.25)',u*0.05);});
    TH.ell(c,x+u*2.0,y+u*0.5,u*0.55,u*0.3,'#a9a38a');TH.ell(c,x-u*2.0,y+u*0.4,u*0.5,u*0.28,'#8c866e');JVINE(c,x,y-u*0.4,u,r,5);}},
  /* ---------- small props (lower tiers only) ---------- */
  tikiTorch:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(12,40,22,.25)');TH.ln(c,[x,y],[x,y-u*3.0],'#9a8a4a',u*0.3);[0.3,0.55,0.8].forEach(f=>TH.ln(c,[x-u*0.18,y-u*3*f],[x+u*0.18,y-u*3*f],'#5f5a2a',u*0.07));const g=c.createRadialGradient(x,y-u*3.4,0,x,y-u*3.4,u*1.5);g.addColorStop(0,'rgba(255,190,90,.55)');g.addColorStop(1,'rgba(255,190,90,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*3.4,u*1.5,0,7);c.fill();TH.poly(c,[[x-u*0.3,y-u*3.0],[x+u*0.3,y-u*3.0],[x+u*0.1,y-u*3.9],[x,y-u*4.1],[x-u*0.1,y-u*3.8]],'#f08a24');TH.poly(c,[[x-u*0.15,y-u*3.0],[x+u*0.15,y-u*3.0],[x,y-u*3.6]],'#ffe27a');}},
  crates:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.4,u*0.4,'rgba(12,40,22,.25)');const w='#b0884e';TH.box(c,x,y,u,-0.9,0.1,-0.6,0.5,0,0.9,w,shade(w,-0.28),shade(w,0.16));TH.box(c,x,y,u,0.2,1.2,-0.5,0.5,0,0.8,'#9a7440',shade('#9a7440',-0.28),shade('#9a7440',0.16));TH.box(c,x,y,u,-0.6,0.4,-0.5,0.4,0.9,1.7,'#c19a5c',shade('#c19a5c',-0.28),shade('#c19a5c',0.16));
    [[-0.4,0.51,0.1],[-0.4,0.51,0.8]].forEach(([X,Y,Z])=>0);TH.ln(c,I(-0.9,0.51,0.45),I(0.1,0.51,0.45),'rgba(50,30,10,.4)',u*0.07);TH.ln(c,I(-0.1,0.41,1.3),I(0.4,0.41,1.3),'rgba(50,30,10,.4)',u*0.07);}},
  signpost:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.25,'rgba(12,40,22,.25)');TH.ln(c,[x,y],[x,y-u*2.8],'#6a4a2a',u*0.28);[[-1,-2.5,'#b0884e'],[1,-1.8,'#c19a5c']].forEach(([d,h,col])=>{TH.poly(c,[[x,y+h*u-u*0.3],[x+d*u*1.5,y+h*u-u*0.3],[x+d*u*1.9,y+h*u],[x+d*u*1.5,y+h*u+u*0.3],[x,y+h*u+u*0.3]],col,'#6a4a2a',u*0.05);TH.ln(c,[x+d*u*0.3,y+h*u],[x+d*u*1.2,y+h*u],'rgba(50,30,10,.45)',u*0.06);});}}
};
function WRKJ(c,x,y,rx,ry){TH.ell(c,x+rx*0.15,y+ry*0.3,rx*1.05,ry*0.45,'rgba(12,40,22,.25)');TH.poly(c,[[x-rx,y],[x-rx*0.9,y-ry*0.6],[x-rx*0.35,y-ry*1.05],[x+rx*0.4,y-ry*0.95],[x+rx*0.95,y-ry*0.35],[x+rx,y+ry*0.1],[x-rx*0.6,y+ry*0.2]],'#8d9086');TH.poly(c,[[x-rx*0.9,y-ry*0.6],[x-rx*0.35,y-ry*1.05],[x+rx*0.4,y-ry*0.95],[x+rx*0.1,y-ry*0.5],[x-rx*0.5,y-ry*0.45]],JMOSS);}

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

/* ===== JUNGLE LAND: planner (stretched sweet spots, tree-heavy), lush ground, generic baker ===== */
const JUNGLE_REGION={top:{broadleaf:.38,bamboo:.14,treeFern:.1,palm:.1,cecropia:.08,strangler:.05,jungleBush:.12},mid:{broadleaf:.3,palm:.18,cecropia:.1,bamboo:.1,treeFern:.1,strangler:.04,jungleBush:.1,fanPalm:.08},bottom:{palm:.2,broadleaf:.22,jungleBush:.2,fanPalm:.16,treeFern:.14,bamboo:.08}};
const JUNGLE_LOW=[['jungleBush',1],['fanPalm',1],['treeFern',1.05],['broadleaf',0.62],['palm',0.6],['jungleBush',1.2],['fanPalm',1.15],['broadleaf',0.7]];            /* short species only in the foreground so a ride's base is never hidden */
const JUNGLE_CAP={ceiba:5,strangler:3,bamboo:9,cecropia:7};
const JUNGLE_UNDER=['fern','fern','elephantEar','heliconia','flowerBush','jungleGrass','banana'];
const JUNGLE_PLAN_CACHE={};
function getJunglePlan(shape){
  if(JUNGLE_PLAN_CACHE[shape])return JUNGLE_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(shape==='A'?6101:7202),placed=[],bb=G.bbox,used={},A=JUNGLE_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  /* stretched sweet spots: the slot ellipse itself is still sacred, but scenery may now creep right up to it (West kept a much wider margin) */
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.5),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.3);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho,o2)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.72);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'broadleaf';};
  const capOk=k=>!(JUNGLE_CAP[k]&&(used[k]||0)>=JUNGLE_CAP[k]);
  const regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?JUNGLE_REGION.top:n<0.68?JUNGLE_REGION.mid:JUNGLE_REGION.bottom;};
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='tree'?0.88+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const tree=(x,y,extra,dom,low)=>{if(low){const L=JUNGLE_LOW[Math.floor(rng()*JUNGLE_LOW.length)];return place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return place(dom&&rng()<0.55&&capOk(dom)?dom:pickFrom(regionOf(y),capOk),x,y,extra||{});};
  const under=(x,y,extra)=>place(JUNGLE_UNDER[Math.floor(rng()*JUNGLE_UNDER.length)],x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. the back rim: forested massifs, hills and cliffs, with two waterfalls (each flanked by cliffs) */
  {const pts=[];top.forEach(e=>[0.2,0.5,0.8].forEach(t=>pts.push(onEdge(e,t,0.0))));pts.sort((a,b)=>a[0]-b[0]);const x0=pts[0][0],x1=pts[pts.length-1][0],nearest=x=>pts.reduce((b,p)=>Math.abs(p[0]-x)<Math.abs(b[0]-x)?p:b);
    const centers=[];let x=x0+0.12+rng()*0.2;while(x<x1-0.05){centers.push(x);x+=0.8+rng()*0.55;}
    const wf=[Math.floor(centers.length*0.3),Math.floor(centers.length*0.74)];
    centers.forEach((cxp,i)=>{const p=nearest(cxp),bx=p[0],by=p[1],t=rng(),mt=a=>a+(rng()<0.35?1:0),at=(k,dx,dy,ex)=>place(k,bx+dx,by+dy,ex);
      if(wf.includes(i)){const first=i===wf[0];at('waterfall',0,-0.02,{minT:first?3:4,scale:0.95,clear:1.9});at('cliff',-0.5,0.0,{minT:first?3:4,scale:0.85,clear:1.3});at('cliff',0.5,0.0,{minT:first?3:4,scale:0.8,clear:1.3});at('peak',0.0,-0.18,{minT:first?3:4,scale:0.85});at('mossBoulders',-0.2,0.1,{minT:1});at('mossBoulders',0.25,0.1,{minT:2});}
      else if(t<0.4){at('peak',0,-0.02,{minT:mt(2),scale:0.9+rng()*0.2});at('hill',-0.5,0.03,{minT:mt(1)});at('hill',0.5,0.02,{minT:mt(2)});at('mossBoulders',0.02,0.1,{minT:1});}
      else if(t<0.72){at('hill',-0.3,0.01,{minT:1});at('peak',0.18,-0.02,{minT:mt(2),scale:0.75});at('cliff',-0.6,0.04,{minT:3});at('mossBoulders',0.1,0.1,{minT:2});}
      else{at('hill',-0.25,0.01,{minT:mt(1)});at('hill',0.3,0.0,{minT:2});at('cliff',0.0,-0.02,{minT:3,scale:0.8});at('mossBoulders',-0.05,0.1,{minT:1});}});
    {const gaps=[];for(let i=0;i+1<centers.length;i++)if(!wf.includes(i)&&!wf.includes(i+1))gaps.push(i);if(!gaps.length)for(let i=0;i+1<centers.length;i++)gaps.push(i);
      [gaps[0],gaps[gaps.length-1]].filter((g,i,a)=>g!==undefined&&a.indexOf(g)===i).forEach((gi,k)=>{const p=nearest((centers[gi]+centers[gi+1])/2);place('ceiba',p[0],p[1]-0.06,{minT:k?4:3,scale:0.95,clear:1.3});});}}
  /* 2. Mayan ruins scattered across the whole land (farthest-point spacing so they never clump): big-ish pieces on the rim, small ones in the voids */
  {const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.forEach(e=>inn.push([e.mid[0],e.mid[1]]));
    const seq=[['stoneHead','i'],['stela','i'],['smallPyramid','r'],['stela','i'],['brokenWall','i'],['ruinedArch','r'],['stairRuin','i'],['altar','i'],['columns','i'],['smallPyramid','r'],['stela','i'],['brokenWall','i']],chosen=[];
    seq.forEach(([k,z],idx)=>{const pool=z==='r'?rim:inn;let best=null,bd=-1;pool.forEach(p=>{const d=Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.25;if(d>bd){bd=d;best=p;}});if(!best)return;const o=place(k,best[0],best[1],{minT:idx<2?1:idx<5?2:idx<9?3:4,scale:k==='smallPyramid'?1.2:1.4,clear:1.15});if(o)chosen.push([o.x,o.y]);else chosen.push(best);});}
  /* 3. trees: interior groves at every junction void, three-tree corridors, one-or-two in the diagonal corridors, then the rim and a fill pass for the corners */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=pickFrom(regionOf(v.y),capOk),n=1+Math.floor(rng()*2.3);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.08:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{const dom=pickFrom(regionOf(e.mid[1]),capOk);[-0.2,0.2].forEach(dy=>{if(rng()<0.7)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.55)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.8+rng()*0.2},null,true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.3));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(e.cls==='top'?-0.02:0)+(rng()-0.2)*0.12)});});
    let mode='grove',run=0,dom='broadleaf';samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.66?'grove':r<0.9?'sparse':'open';run=2+Math.floor(rng()*4);dom=pickFrom(regionOf(s.p[1]),capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){if(e.cls==='top'&&rng()<0.3)return;tree(p[0],p[1],null,dom,low);if(rng()<0.45)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,dom,low);if(rng()<0.12)tree(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,dom,true);}
      else if(mode==='sparse'){if(rng()<0.5)tree(p[0],p[1],null,dom,low);else under(p[0],p[1]);}else if(rng()<0.6)under(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.7)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<10;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.22)tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);}});
  /* 4. undergrowth: ferns, elephant ears, heliconia, flowers, banana plants */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.45)under(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.35)under(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.38)under(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.3)under(px,py);}});
  /* 5. small props: lower tiers only */
  [['tikiTorch',3],['crates',2],['signpost',1]].forEach(([k,n])=>{for(let i=0;i<n;i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  /* tiers: each object appears at its tier and stays (props leave after tier 2); trees stay >= 68% of the scenery at every tier */
  const cuts={tree:[0.26,0.5,0.77,1],shrub:[0.06,0.38,0.7,1],rock:[0.3,0.55,0.8,1],prop:[1,1,1,1],ruin:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='ruin')o.tier=o.minT;});
  const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
  for(let t=1;t<=4;t++){let guard=0;while(guard++<300){const c=count(t);if(c.tr/Math.max(1,c.n)>=0.68)break;const pool=placed.filter(o=>o.tier<=t&&t<=o.maxT),cand=(pool.filter(o=>o.cat==='shrub').sort((a,b)=>b.pri-a.pri)[0])||(pool.filter(o=>o.prop&&o.minT>1).sort((a,b)=>b.pri-a.pri)[0]);if(!cand)break;cand.tier=Math.min(5,cand.tier+1);}}
  placed.sort((a,b)=>a.y-b.y);
  return JUNGLE_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: deep jungle floor with moss, mud and leaf litter, plus lush ground cover painted into the ground (decals, not objects) ---- */
function jungleGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<44;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'120,190,90':'20,60,34',r()<0.5?0.2:0.22);}
  for(let k=0;k<12;k++){const p=pt(),w=R*(0.25+r()*0.4);soft(p[0],p[1],w,w*0.4,'110,80,48',0.2);}                 /* mud */
  for(let k=0;k<10;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'190,230,110',0.16);}               /* sun dapples */
  for(let k=0;k<70;k++){const p=pt();TH.ell(c,p[0],p[1],R*(0.02+r()*0.02),R*0.012,r()<0.5?'rgba(120,80,40,.5)':'rgba(170,120,50,.45)',r()*3);}   /* leaf litter */
  for(let k=0;k<150;k++){const p=pt(),h=R*(0.05+r()*0.06);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#4f9a3f','#6fb34a','#3a8a35'][(k+j)%3],R*0.011);}      /* grass tufts */
  for(let k=0;k<70;k++){const p=pt(),s=R*(0.05+r()*0.05);for(let j=0;j<6;j++){const a=-Math.PI+0.2+j/5*(Math.PI-0.4);TH.ln(c,[p[0],p[1]],[p[0]+Math.cos(a)*s,p[1]+Math.sin(a)*s*0.55],'#3f8a45',R*0.011);}}   /* tiny ferns */
  for(let k=0;k<46;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.011,R*0.009,['#f6efe0','#f2c230','#e86aa8','#d9433b','#fff6c0'][k%5]);}  /* flower specks */
  c.restore();c.restore();
}
/* ---- shared depth-sliced baker ---- */
const LAND_BAKE_CACHE={};
function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol,clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]),key=[T.id,shape,tier,R,Math.round(R*sc),sc,m,ground,JSON.stringify(clr)].join('|');if(LAND_BAKE_CACHE[key])return LAND_BAKE_CACHE[key];
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=0.75,top=T.top||1.35,bot=0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const back=document.createElement('canvas');back.width=Math.ceil(W*sc);back.height=Math.ceil(H*sc);const cb=back.getContext('2d');cb.scale(sc,sc);T.ground(cb,G,R,ox,oy,m,ground,shape==='A'?11:22);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]),vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho)));
  const rowYs=[...new Set(G.centers.map(c=>c.y))].sort((a,b)=>a-b),objectsByBand=rowYs.map(()=>[]);
  vis.forEach(o=>{let band=0;while(band<rowYs.length-1&&o.y>=(rowYs[band]+rowYs[band+1])/2)band++;objectsByBand[band].push(o);});
  const bands=objectsByBand.map((objects,index)=>{
    let x0=W,y0=H,x1=0,y1=0;
    objects.forEach(o=>{const px=ox+m*o.x*R,py=oy+o.y*R,s=(o.scale||1)*u;x0=Math.min(x0,px-4*s);x1=Math.max(x1,px+4*s);y0=Math.min(y0,py-9*s);y1=Math.max(y1,py+2*s);});
    if(!objects.length)return{canvas:null,rect:{x:0,y:0,w:0,h:0},depth:oy+rowYs[index]*R};
    x0=Math.max(0,Math.floor(x0));y0=Math.max(0,Math.floor(y0));x1=Math.min(W,Math.ceil(x1));y1=Math.min(H,Math.ceil(y1));
    const w=x1-x0,h=y1-y0,canvas=document.createElement('canvas');canvas.width=Math.ceil(w*sc);canvas.height=Math.ceil(h*sc);
    const cg=canvas.getContext('2d');cg.scale(sc,sc);cg.translate(-x0,-y0);
    objects.sort((a,b)=>a.y-b.y).forEach(o=>T.assets[o.kind].draw(cg,ox+m*o.x*R,oy+o.y*R,u*(o.scale||1),o.v));
    return{canvas,rect:{x:x0,y:y0,w,h},depth:oy+rowYs[index]*R};
  });
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return LAND_BAKE_CACHE[key]={back,bands,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0};
}
function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}
const JUNGLE_THEME={id:'jungle',assets:JUNGLE_ASSETS,plan:getJunglePlan,ground:jungleGround,groundCol:'#4e7d3c',top:1.35};
const JUNGLE_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
/* public API: same shape as the Western pack */
function bakeLandJungle(shape,tier,R,opts){return bakeLandTheme(JUNGLE_THEME,shape,tier,R,opts);}
function drawLandJungleBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandJungleDepthBand(ctx,x,y,land,index){const band=land.bands[index];if(!band||!band.canvas)return;const r=band.rect;ctx.drawImage(band.canvas,x-land.ox+r.x,y-land.oy+r.y,r.w,r.h);}
function drawLandJungleFront(ctx,x,y,land){land.bands.forEach((_,index)=>drawLandJungleDepthBand(ctx,x,y,land,index));}
function landJungleSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}


return Object.freeze({ bake: bakeLandJungle, drawBack: drawLandJungleBack, drawDepthBand: drawLandJungleDepthBand, drawFront: drawLandJungleFront });
})();
