(function(){
/* ===== core (shared by every pack) ===== */
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


const JS=(c,x,y,rx)=>{c.fillStyle='rgba(12,40,22,.28)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const JBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.28),shade(col,0.16));
const MIR=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
const BP=(c,pts,fill,stroke,lw)=>TH.poly(c,pts,fill,stroke,lw);
const BF=(c,I,x0,x1,y1,z0,z1,col)=>BP(c,[I(x0,y1,z0),I(x1,y1,z0),I(x1,y1,z1),I(x0,y1,z1)],col);
const BR=(c,I,x1,y0,y1,z0,z1,col)=>BP(c,[I(x1,y0,z0),I(x1,y1,z0),I(x1,y1,z1),I(x1,y0,z1)],col);
const BT=(c,I,x0,x1,y0,y1,z,col)=>BP(c,[I(x0,y0,z),I(x1,y0,z),I(x1,y1,z),I(x0,y1,z)],col);
const WF=(c,I,y1,X,Z,w,h,col,fr)=>BP(c,[I(X-w/2,y1,Z-h/2),I(X+w/2,y1,Z-h/2),I(X+w/2,y1,Z+h/2),I(X-w/2,y1,Z+h/2)],col,fr,fr?0.9:0);
const WR=(c,I,x1,Y,Z,w,h,col,fr)=>BP(c,[I(x1,Y-w/2,Z-h/2),I(x1,Y+w/2,Z-h/2),I(x1,Y+w/2,Z+h/2),I(x1,Y-w/2,Z+h/2)],col,fr,fr?0.9:0);
const BFL=(c,I,x0,x1,y1,z0,z1,step,col,u)=>{for(let z=z0+step;z<z1-0.01;z+=step)TH.ln(c,I(x0,y1,z),I(x1,y1,z),col,u*0.05);};
const BRL=(c,I,x1,y0,y1,z0,z1,step,col,u)=>{for(let z=z0+step;z<z1-0.01;z+=step)TH.ln(c,I(x1,y0,z),I(x1,y1,z),col,u*0.05);};
function HIP(c,I,x0,x1,y0,y1,z,H,o,cf,cr,u,tex){const yc=(y0+y1)/2,xr0=x0+(y1-y0)/2,xr1=x1-(y1-y0)/2,A=I(x0-o,y1+o,z),B=I(x1+o,y1+o,z),R1=I(xr1,yc,z+H),R0=I(xr0,yc,z+H),C=I(x1+o,y0-o,z);
  BP(c,[B,C,R1],cr);BP(c,[A,B,R1,R0],cf);
  if(tex){for(let k=1;k<=tex;k++){const t=k/(tex+1),L=[A[0]+(R0[0]-A[0])*t,A[1]+(R0[1]-A[1])*t],Rr=[B[0]+(R1[0]-B[0])*t,B[1]+(R1[1]-B[1])*t];TH.ln(c,L,Rr,'rgba(0,0,0,.16)',u*0.07);TH.ln(c,[L[0],L[1]-u*0.07],[Rr[0],Rr[1]-u*0.07],'rgba(255,255,255,.14)',u*0.05);}}
  TH.ln(c,R0,R1,shade(cf,-0.3),u*0.16);}
function GAB(c,I,x0,x1,y0,y1,z,H,o,cf,cg,u,tex){const yc=(y0+y1)/2,A=I(x0-o,y1+o,z),B=I(x1+o,y1+o,z),R1=I(x1+o,yc,z+H),R0=I(x0-o,yc,z+H);
  BP(c,[I(x1,y0,z),I(x1,y1,z),I(x1,yc,z+H*0.86)],cg);BP(c,[A,B,R1,R0],cf);
  if(tex){for(let k=1;k<=tex;k++){const t=k/(tex+1),L=[A[0]+(R0[0]-A[0])*t,A[1]+(R0[1]-A[1])*t],Rr=[B[0]+(R1[0]-B[0])*t,B[1]+(R1[1]-B[1])*t];TH.ln(c,L,Rr,'rgba(0,0,0,.16)',u*0.07);TH.ln(c,[L[0],L[1]-u*0.07],[Rr[0],Rr[1]-u*0.07],'rgba(255,255,255,.14)',u*0.05);}}
  TH.ln(c,R0,R1,shade(cf,-0.3),u*0.16);TH.ln(c,A,B,shade(cf,-0.25),u*0.1);}
const GLOW=(c,x,y,r,rgb,a)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();};
function RCYL(c,x,y,rx,ry,wh,cols){cols=cols||['#ffffff','#e9eef3','#a9b6c6'];const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,cols[0]);g.addColorStop(0.5,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y-wh);c.lineTo(x-rx,y);c.ellipse(x,y,rx,ry,0,Math.PI,0,true);c.lineTo(x+rx,y-wh);c.ellipse(x,y-wh,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();}
function RGLASS(c,pts,alpha){const ys=pts.map(p=>p[1]),g=c.createLinearGradient(0,Math.min(...ys),0,Math.max(...ys));g.addColorStop(0,RW.glass[0]);g.addColorStop(0.5,RW.glass[1]);g.addColorStop(1,RW.glass[2]);c.save();c.globalAlpha=alpha||1;c.fillStyle=g;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();c.restore();}
function RSPHERE(c,x,y,r,cols){const g=c.createRadialGradient(x-r*0.35,y-r*0.4,r*0.1,x,y,r*1.05);g.addColorStop(0,cols[0]);g.addColorStop(0.55,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();}
function ACONE(c,x,y,rx,ry,h,col,u,scal){const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,shade(col,0.18));g.addColorStop(0.5,col);g.addColorStop(1,shade(col,-0.3));c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y);c.lineTo(x,y-h);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();
  if(scal){for(let k=0;k<scal;k++){const a0=Math.PI*k/scal,a1=Math.PI*(k+1)/scal;c.fillStyle=k%2?'#fbf6e8':shade(col,-0.1);c.beginPath();c.moveTo(x+Math.cos(a0)*rx,y+Math.sin(a0)*ry);c.lineTo(x+Math.cos((a0+a1)/2)*rx,y+Math.sin((a0+a1)/2)*ry+u*0.4);c.lineTo(x+Math.cos(a1)*rx,y+Math.sin(a1)*ry);c.closePath();c.fill();}}
  c.save();c.beginPath();c.moveTo(x-rx,y);c.lineTo(x,y-h);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.clip();for(let k=0;k<=14;k++){const a=Math.PI*k/14;TH.ln(c,[x,y-h],[x+Math.cos(a)*rx,y+Math.sin(a)*ry],'rgba(0,0,0,.12)',u*0.05);}c.restore();}
function AWN(c,I,X0,X1,y1,zTop,zBot,dY,col,u){const n=Math.max(4,Math.round((X1-X0)/0.5));for(let k=0;k<n;k++){const a=X0+(X1-X0)*k/n,b=X0+(X1-X0)*(k+1)/n,cc=k%2?col[1]:col[0];BP(c,[I(a,y1,zTop),I(b,y1,zTop),I(b,y1+dY,zBot),I(a,y1+dY,zBot)],cc);const p=I(a,y1+dY,zBot),q=I(b,y1+dY,zBot);BP(c,[p,q,[(p[0]+q[0])/2,(p[1]+q[1])/2+u*0.42]],cc);}}
const RW={w:'#f4f6f8',ws:'#b9c4d1',wl:'#ffffff',teal:'#2fb8c4',tealD:'#1f8a96',org:'#ff7a3c',yel:'#ffd23c',navy:'#2a3a52',leaf:['#8fd05a','#6ab83c','#4a9a30'],glass:['#cdeef8','#8ccfe4','#4f9fc0']};
/* ===== RESTAURANT ART, batch 1. Each draw(c, x, y, u, v): (x,y) = ground centre of the hex, u = 0.075*R, v = variant seed. Static, one hex, no ground. ===== */
const RSH_=(c,x,y,rx,ry,rgb)=>{c.fillStyle='rgba('+(rgb||'40,30,18')+',.24)';c.beginPath();c.ellipse(x+rx*0.1,y+ry*0.2,rx*0.88,(ry||rx*0.4)*0.9,0,0,7);c.fill();};
const RPOST=(c,I,X,Y,z0,z1,col,u,w)=>TH.ln(c,I(X,Y,z0),I(X,Y,z1),col,u*(w||0.22));
const RCLIP=(c,pts,fn)=>{c.save();c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.clip();fn();c.restore();};
const RFRONT=(c,I,y1,x0,x1,z0,z1)=>[I(x0,y1,z0),I(x1,y1,z0),I(x1,y1,z1),I(x0,y1,z1)];
const RIGHTF=(c,I,x1,y0,y1,z0,z1)=>[I(x1,y0,z0),I(x1,y1,z0),I(x1,y1,z1),I(x1,y0,z1)];
const RBARREL=(c,x,y,u,col)=>{TH.ell(c,x,y,u*0.55,u*0.22,'rgba(0,0,0,.2)');const g=c.createLinearGradient(x-u*0.5,0,x+u*0.5,0);g.addColorStop(0,shade(col||'#9a6a3a',0.2));g.addColorStop(0.6,col||'#9a6a3a');g.addColorStop(1,shade(col||'#9a6a3a',-0.35));c.fillStyle=g;c.beginPath();c.moveTo(x-u*0.42,y);c.quadraticCurveTo(x-u*0.62,y-u*0.55,x-u*0.42,y-u*1.1);c.lineTo(x+u*0.42,y-u*1.1);c.quadraticCurveTo(x+u*0.62,y-u*0.55,x+u*0.42,y);c.closePath();c.fill();TH.ell(c,x,y-u*1.1,u*0.42,u*0.17,shade(col||'#9a6a3a',0.22));TH.ln(c,[x-u*0.55,y-u*0.35],[x+u*0.55,y-u*0.35],'#3a2a1a',u*0.09);TH.ln(c,[x-u*0.55,y-u*0.75],[x+u*0.55,y-u*0.75],'#3a2a1a',u*0.09);};
const RLANTERN=(c,x,y,u,rgb)=>{GLOW(c,x,y,u*1.3,rgb||'255,200,90',0.5);TH.ln(c,[x,y-u*0.5],[x,y-u*0.15],'#2a2018',u*0.08);TH.poly(c,[[x-u*0.18,y-u*0.15],[x+u*0.18,y-u*0.15],[x+u*0.14,y+u*0.32],[x-u*0.14,y+u*0.32]],'#ffd36a');TH.ell(c,x,y-u*0.15,u*0.2,u*0.08,'#2a2018');};
const RWINDOW=(c,I,y1,X,Z,w,h,glow,frame)=>{BP(c,[I(X-w/2-0.08,y1,Z-h/2-0.08),I(X+w/2+0.08,y1,Z-h/2-0.08),I(X+w/2+0.08,y1,Z+h/2+0.08),I(X-w/2-0.08,y1,Z+h/2+0.08)],frame||'#f4ead2');BP(c,[I(X-w/2,y1,Z-h/2),I(X+w/2,y1,Z-h/2),I(X+w/2,y1,Z+h/2),I(X-w/2,y1,Z+h/2)],glow||'#ffd27a');};
const RESTAURANT_ART={};

/* ---- WESTERN: the saloon ---- */
RESTAURANT_ART.western={dy:0.05,k:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),wood='#c28b55',woodD='#9c6a3c',trim='#e8d3a6',red='#a83a28';RSH_(c,x,y+u*0.6,u*8.4,u*3.4);
  /* main two-storey block */
  JBOX(c,x,y,u,-5.2,5.2,-3,3,0,5.4,wood);BFL(c,I,-5.2,5.2,3,0,5.4,0.55,'rgba(80,44,18,.28)',u);BRL(c,I,5.2,-3,3,0,5.4,0.55,'rgba(60,30,12,.3)',u);
  /* stepped false front */
  [[-5.5,-2.6,6.6],[-2.6,2.6,8.2],[2.6,5.5,6.6]].forEach(([a,b,h],i)=>{JBOX(c,x,y,u,a,b,2.55,3.05,5.4,h,i===1?'#d29d62':'#c8935a');});
  BP(c,[I(-2.6,3.07,8.2),I(2.6,3.07,8.2),I(2.6,3.07,8.6),I(-2.6,3.07,8.6)],trim);BP(c,[I(-5.55,3.07,6.6),I(-2.55,3.07,6.6),I(-2.55,3.07,6.95),I(-5.55,3.07,6.95)],trim);BP(c,[I(2.55,3.07,6.6),I(5.55,3.07,6.6),I(5.55,3.07,6.95),I(2.55,3.07,6.95)],trim);
  BP(c,[I(-1.9,3.08,6.0),I(1.9,3.08,6.0),I(1.9,3.08,7.8),I(-1.9,3.08,7.8)],'#f0e2bf');BP(c,[I(-1.7,3.09,6.2),I(1.7,3.09,6.2),I(1.7,3.09,7.6),I(-1.7,3.09,7.6)],red);for(let k=0;k<5;k++)BP(c,[I(-1.5+k*0.62,3.1,6.35),I(-1.2+k*0.62,3.1,6.35),I(-1.2+k*0.62,3.1,7.45),I(-1.5+k*0.62,3.1,7.45)],'#f7ecd0');
  const st=I(0,3.12,8.9);TH.poly(c,[[st[0],st[1]-u*0.5],[st[0]+u*0.16,st[1]-u*0.12],[st[0]+u*0.52,st[1]-u*0.12],[st[0]+u*0.24,st[1]+u*0.12],[st[0]+u*0.34,st[1]+u*0.5],[st[0],st[1]+u*0.26],[st[0]-u*0.34,st[1]+u*0.5],[st[0]-u*0.24,st[1]+u*0.12],[st[0]-u*0.52,st[1]-u*0.12],[st[0]-u*0.16,st[1]-u*0.12]],'#f2c230');
  /* windows */
  [-4.1,-2.5,2.5,4.1].forEach(X=>{RWINDOW(c,I,3.02,X,1.55,0.95,1.5,'#ffd27a','#f4ead2');RWINDOW(c,I,3.02,X,4.2,0.95,1.5,'#ffcf70','#f4ead2');});
  RWINDOW(c,I,3.02,-0.0,4.3,1.1,1.7,'#ffcf70','#f4ead2');
  /* batwing doors */
  BP(c,[I(-1.0,3.04,0.22),I(1.0,3.04,0.22),I(1.0,3.04,2.4),I(-1.0,3.04,2.4)],'#2a1a10');[-1,1].forEach(sg=>{const a=sg>0?0:-0.98,b=sg>0?0.98:0;BP(c,[I(a,3.06,0.62),I(b,3.06,0.62),I(b,3.06,1.9),I(a,3.06,1.9)],'#a8703a');for(let k=0;k<4;k++)TH.ln(c,I(a+(b-a)*(k+0.5)/4,3.07,0.64),I(a+(b-a)*(k+0.5)/4,3.07,1.88),'rgba(50,24,8,.55)',u*0.06);});
  /* porch: deck, posts, roof/balcony and rail */
  BT(c,I,-5.3,5.3,3.02,5.4,0.22,'#a9743f');for(let k=0;k<12;k++)TH.ln(c,I(-5.3+k*0.97,3.02,0.22),I(-5.3+k*0.97,5.4,0.22),'rgba(60,30,10,.3)',u*0.05);
  BF(c,I,-5.3,5.3,5.4,0,0.22,'#7e5230');BR(c,I,5.3,3.02,5.4,0,0.22,'#6a4326');
  [-5.1,-2.6,0,2.6,5.1].forEach(X=>RPOST(c,I,X,5.3,0.22,3.0,'#8a5a30',u,0.3));
  JBOX(c,x,y,u,-5.5,5.5,3.0,5.6,3.0,3.3,'#b9824a');BT(c,I,-5.5,5.5,3.0,5.6,3.3,'#c8935a');
  [-5.2,-3.9,-2.6,-1.3,0,1.3,2.6,3.9,5.2].forEach(X=>RPOST(c,I,X,5.5,3.3,4.15,'#f1e2bf',u,0.14));TH.ln(c,I(-5.4,5.5,4.15),I(5.4,5.5,4.15),'#f1e2bf',u*0.16);TH.ln(c,I(-5.4,5.5,3.65),I(5.4,5.5,3.65),'#e6d3a8',u*0.1);TH.ln(c,I(5.4,3.0,4.15),I(5.4,5.5,4.15),'#f1e2bf',u*0.16);
  /* hitching rail, barrels, a trough and the sign post */
  TH.ln(c,I(-4.6,6.5,1.0),I(-1.6,6.5,1.0),'#6a4326',u*0.16);RPOST(c,I,-4.6,6.5,0,1.15,'#6a4326',u,0.2);RPOST(c,I,-1.6,6.5,0,1.15,'#6a4326',u,0.2);
  const b1=I(5.9,5.2,0),b2=I(6.5,4.4,0);RBARREL(c,b1[0],b1[1],u*1.1);RBARREL(c,b2[0],b2[1],u*1.1,'#8a5a30');
  const tb=I(2.6,6.6,0);BT(c,I,1.6,3.6,6.1,7.0,0.55,'#8a5a30');BF(c,I,1.6,3.6,7.0,0,0.55,'#6a4326');TH.ell(c,tb[0],tb[1]-u*0.25,u*0.9,u*0.22,'#5a8aa8');
  RLANTERN(c,I(-5.2,5.5,3.0)[0],I(-5.2,5.5,3.0)[1],u*1.0);RLANTERN(c,I(5.2,5.5,3.0)[0],I(5.2,5.5,3.0)[1],u*1.0);}};

/* ---- MEDIEVAL: the Sleepy Dragon Inn (stone base, overhanging half-timber floor, shingled gables, a dragon asleep on the ridge) ---- */
RESTAURANT_ART.medieval={dy:0.05,k:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),stone='#9c9a90',plas='#d9b98a',tim='#4a2e1a',roof='#6b1f2a',roofD='#4a1420';RSH_(c,x,y+u*0.5,u*8.6,u*3.5,'30,34,24');
  /* stone ground floor with coursing */
  JBOX(c,x,y,u,-4.7,4.7,-2.9,2.9,0,2.3,stone);for(let z=0.5;z<2.3;z+=0.5){TH.ln(c,I(-4.7,2.9,z),I(4.7,2.9,z),'rgba(40,40,34,.34)',u*0.06);TH.ln(c,I(4.7,-2.9,z),I(4.7,2.9,z),'rgba(30,30,26,.34)',u*0.06);}
  for(let k=0;k<9;k++)for(let r=0;r<4;r++)TH.ln(c,I(-4.5+k*1.05+(r%2)*0.5,2.91,0.05+r*0.5),I(-4.5+k*1.05+(r%2)*0.5,2.91,0.5+r*0.5),'rgba(40,40,34,.3)',u*0.05);
  /* overhanging plaster storey + timber framing */
  JBOX(c,x,y,u,-5.1,5.1,-3.3,3.3,2.3,4.7,plas);
  [-5.1,-3.4,-1.7,0,1.7,3.4,5.1].forEach(X=>TH.ln(c,I(X,3.3,2.3),I(X,3.3,4.7),tim,u*0.2));[-3.3,0,3.3].forEach(Y=>TH.ln(c,I(5.1,Y,2.3),I(5.1,Y,4.7),tim,u*0.2));
  TH.ln(c,I(-5.1,3.3,3.5),I(5.1,3.3,3.5),tim,u*0.18);TH.ln(c,I(-5.1,3.3,4.7),I(5.1,3.3,4.7),tim,u*0.26);TH.ln(c,I(-5.1,3.3,2.3),I(5.1,3.3,2.3),tim,u*0.26);TH.ln(c,I(5.1,-3.3,4.7),I(5.1,3.3,4.7),tim,u*0.26);TH.ln(c,I(5.1,-3.3,2.3),I(5.1,3.3,2.3),tim,u*0.26);
  [[-5.1,-3.4],[1.7,3.4],[3.4,5.1]].forEach(([a,b])=>{TH.ln(c,I(a,3.3,2.3),I(b,3.3,3.5),tim,u*0.14);TH.ln(c,I(a,3.3,3.5),I(b,3.3,4.7),tim,u*0.14);});
  [-4.25,-2.55,2.55,4.25].forEach(X=>{RWINDOW(c,I,3.34,X,3.7,0.9,0.95,'#ffd27a','#4a2e1a');TH.ln(c,I(X-0.55,3.38,3.1),I(X+0.55,3.38,3.1),'#4a2e1a',u*0.34);[-0.4,0,0.4].forEach(dx=>TH.ell(c,I(X+dx,3.45,3.18)[0],I(X+dx,3.45,3.18)[1],u*0.12,u*0.1,['#e86aa8','#f2c230','#e86aa8'][Math.abs(dx*10)%3]));});
  [-4.25,-2.55,2.55,4.25].forEach(X=>RWINDOW(c,I,2.92,X,1.4,0.8,0.95,'#ffd27a','#6a6a62'));
  /* main roof (ridge along X) + a front cross-gable wing */
  GAB(c,I,-5.1,5.1,-3.3,3.3,4.7,3.4,0.55,roof,roofD,u,6);
  for(let k=0;k<8;k++){const t=(k+0.5)/8,A=I(-5.65+11.3*t,3.85,4.7),B=I(-5.65+11.3*t,0,8.1);TH.ln(c,A,B,'rgba(0,0,0,.1)',u*0.06);}
  /* cross-gable entry wing */
  JBOX(c,x,y,u,-1.9,1.9,3.3,4.9,0,4.5,stone);JBOX(c,x,y,u,-2.2,2.2,3.3,5.2,2.3,4.5,plas);[-2.2,-1.1,0,1.1,2.2].forEach(X=>TH.ln(c,I(X,5.2,2.3),I(X,5.2,4.5),tim,u*0.2));TH.ln(c,I(-2.2,5.2,3.4),I(2.2,5.2,3.4),tim,u*0.18);
  BP(c,[I(-2.5,5.2,4.5),I(2.5,5.2,4.5),I(0,5.2,7.3)],'#d9b98a');TH.ln(c,I(-2.5,5.2,4.5),I(0,5.2,7.3),tim,u*0.26);TH.ln(c,I(2.5,5.2,4.5),I(0,5.2,7.3),tim,u*0.26);TH.ln(c,I(0,5.2,4.5),I(0,5.2,7.2),tim,u*0.18);TH.ln(c,I(-1.4,5.2,4.5),I(0,5.2,5.9),tim,u*0.14);TH.ln(c,I(1.4,5.2,4.5),I(0,5.2,5.9),tim,u*0.14);
  BP(c,[I(2.5,3.0,4.5),I(2.5,5.2,4.5),I(0,5.2,7.3),I(0,3.0,7.3)],roof);BP(c,[I(2.6,3.0,4.4),I(2.6,5.35,4.4),I(0,5.35,7.45),I(0,3.0,7.45)],null);
  for(let k=1;k<5;k++){const t=k/5,A=I(2.5-2.5*t,3.0,4.5+2.8*t),B=I(2.5-2.5*t,5.2,4.5+2.8*t);TH.ln(c,A,B,'rgba(0,0,0,.16)',u*0.07);}
  /* door, arch, lantern, hanging sign */
  BP(c,[I(-0.75,5.22,0),I(0.75,5.22,0),I(0.75,5.22,1.9),I(0,5.22,2.4),I(-0.75,5.22,1.9)],'#4a2e1a');BP(c,[I(-0.6,5.24,0),I(0.6,5.24,0),I(0.6,5.24,1.8),I(0,5.24,2.25),I(-0.6,5.24,1.8)],'#7a5230');TH.ln(c,I(0,5.25,0.1),I(0,5.25,2.2),'rgba(30,16,6,.6)',u*0.07);TH.ell(c,I(0.35,5.27,1.0)[0],I(0.35,5.27,1.0)[1],u*0.09,u*0.09,'#e8b82a');
  RWINDOW(c,I,5.24,-1.5,3.5,0.7,0.9,'#ffd27a','#4a2e1a');RWINDOW(c,I,5.24,1.5,3.5,0.7,0.9,'#ffd27a','#4a2e1a');
  const sg=I(2.6,5.3,3.9);TH.ln(c,I(2.3,5.3,4.1),I(3.4,5.3,4.1),'#2a2018',u*0.12);TH.ln(c,[sg[0]+u*0.4,sg[1]],[sg[0]+u*0.4,sg[1]+u*0.4],'#2a2018',u*0.06);TH.poly(c,[[sg[0]+u*0.1,sg[1]+u*0.4],[sg[0]+u*0.9,sg[1]+u*0.4],[sg[0]+u*0.9,sg[1]+u*1.3],[sg[0]+u*0.1,sg[1]+u*1.3]],'#7a3a1e','#2a1a10',u*0.06);TH.ell(c,sg[0]+u*0.5,sg[1]+u*0.85,u*0.22,u*0.18,'#4aa050');
  RLANTERN(c,...I(-0.95,5.3,3.4),u*1.0);
  /* chimney on the right gable */
  JBOX(c,x,y,u,3.4,4.6,-0.9,0.9,0,9.2,'#8a8a82');JBOX(c,x,y,u,3.3,4.7,-1.0,1.0,9.2,9.6,'#767670');for(let z=1;z<9.2;z+=0.55)TH.ln(c,I(4.6,-0.9,z),I(4.6,0.9,z),'rgba(30,30,26,.3)',u*0.05);
  const sm=I(4.0,0,10.2);for(let k=0;k<4;k++){TH.ell(c,sm[0]+k*u*0.35,sm[1]-k*u*0.75,u*(0.5+k*0.18),u*(0.34+k*0.12),'rgba(235,235,240,'+(0.55-k*0.11)+')');}
  /* barrels + cart wheel by the door */
  const b1=I(3.9,5.6,0);RBARREL(c,b1[0],b1[1],u*1.1);const b2=I(-3.3,5.4,0);RBARREL(c,b2[0],b2[1],u*1.0,'#8a5a30');}};

/* ---- BAVARIAN: an Oktoberfest beer tent ---- */
RESTAURANT_ART.bavarian={dy:0.05,k:1.12,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),blue='#2a6ab0',white='#f7f4ea';RSH_(c,x,y+u*0.6,u*8.8,u*3.6,'30,40,24');
  /* canvas walls + timber posts */
  JBOX(c,x,y,u,-5.2,5.2,-3.4,3.4,0,2.3,white);for(let k=0;k<9;k++){TH.ln(c,I(-5.2+k*1.3,3.4,0),I(-5.2+k*1.3,3.4,2.3),'rgba(42,106,176,.35)',u*0.12);}for(let k=0;k<6;k++)TH.ln(c,I(5.2,-3.4+k*1.36,0),I(5.2,-3.4+k*1.36,2.3),'rgba(42,106,176,.35)',u*0.12);
  TH.ln(c,I(-5.2,3.4,2.3),I(5.2,3.4,2.3),'#6a4a2a',u*0.22);TH.ln(c,I(5.2,-3.4,2.3),I(5.2,3.4,2.3),'#6a4a2a',u*0.22);
  /* big hip canvas roof with the white-and-blue lozenge pattern */
  const A=I(-5.9,4.1,2.3),B=I(5.9,4.1,2.3),R1=I(3.3,0,6.8),R0=I(-3.3,0,6.8),Cc=I(5.9,-4.1,2.3);
  const front=[A,B,R1,R0],right=[B,Cc,R1];
  BP(c,right,'#dfe3ea');BP(c,front,'#f5f6f8');
  [front,right].forEach((poly,pi)=>RCLIP(c,poly,()=>{c.fillStyle=pi?'rgba(42,106,176,.82)':blue;const ox=poly[0][0],oy=poly[0][1],n=14,w=u*1.05;for(let row=-2;row<10;row++)for(let col=-2;col<n;col++){const px=ox+col*w+(row%2)*w*0.5,py=oy-row*w*0.5-u*0.2;c.beginPath();c.moveTo(px,py-w*0.34);c.lineTo(px+w*0.34,py);c.lineTo(px,py+w*0.34);c.lineTo(px-w*0.34,py);c.closePath();c.fill();}c.fillStyle='rgba(0,0,0,'+(pi?0.16:0)+')';c.fillRect(ox-u*20,oy-u*20,u*60,u*40);}));
  TH.ln(c,R0,R1,'#c9ccd4',u*0.2);TH.ln(c,A,B,'#aeb2bd',u*0.14);
  /* little corner turrets with spires and flags */
  [[-4.9,3.0],[4.9,3.0],[4.9,-3.0],[-4.9,-3.0]].forEach(([X,Y],i)=>{if(Y<0&&X<0)return;const p=I(X,Y,2.3),h=u*(2.4);TH.ln(c,[p[0],p[1]],[p[0],p[1]-u*3.4],'#6a4a2a',u*0.16);TH.poly(c,[[p[0]-u*0.35,p[1]-u*1.8],[p[0]+u*0.35,p[1]-u*1.8],[p[0],p[1]-u*3.4]],i%2?blue:'#f7f4ea');TH.ln(c,[p[0],p[1]-u*3.4],[p[0],p[1]-u*4.2],'#6a4a2a',u*0.08);TH.poly(c,[[p[0],p[1]-u*4.2],[p[0]+u*0.9,p[1]-u*3.95],[p[0],p[1]-u*3.7]],i%2?'#f7f4ea':blue);});
  /* the timber entrance pavilion with a painted gable */
  JBOX(c,x,y,u,-2.4,2.4,3.4,4.7,0,4.4,'#e6d7b4');for(let X=-2.4;X<=2.4;X+=1.2)TH.ln(c,I(X,4.7,0),I(X,4.7,4.4),'#6a4a2a',u*0.22);TH.ln(c,I(-2.4,4.7,2.2),I(2.4,4.7,2.2),'#6a4a2a',u*0.2);TH.ln(c,I(2.4,3.4,4.4),I(2.4,4.7,4.4),'#6a4a2a',u*0.2);
  BP(c,[I(-2.9,4.7,4.4),I(2.9,4.7,4.4),I(0,4.7,7.2)],'#f0e4c6');TH.ln(c,I(-2.9,4.7,4.4),I(0,4.7,7.2),'#6a4a2a',u*0.28);TH.ln(c,I(2.9,4.7,4.4),I(0,4.7,7.2),'#6a4a2a',u*0.28);
  for(let k=0;k<7;k++){const t=(k+0.5)/7;BP(c,[I(-2.4+4.8*t,4.72,4.5+Math.min(t,1-t)*5.2),I(-2.4+4.8*t+0.3,4.72,4.5+Math.min(t,1-t)*5.2),I(-2.4+4.8*t+0.3,4.72,4.5),I(-2.4+4.8*t,4.72,4.5)],k%2?blue:'#f7f4ea');}
  BP(c,[I(2.9,3.2,4.4),I(2.9,4.7,4.4),I(0,4.7,7.2),I(0,3.2,7.2)],'#d6d9e0');RCLIP(c,[I(2.9,3.2,4.4),I(2.9,4.7,4.4),I(0,4.7,7.2),I(0,3.2,7.2)],()=>{c.fillStyle='rgba(42,106,176,.75)';for(let k=0;k<10;k++){const a=I(2.9-k*0.3,3.2,4.4+k*0.28),b=I(2.9-k*0.3,4.7,4.4+k*0.28);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(b[0],b[1]-u*0.28);c.lineTo(a[0],a[1]-u*0.28);c.closePath();if(k%2)c.fill();}});
  /* doors, pretzel and stein signs, garlands */
  BP(c,[I(-0.9,4.72,0),I(0.9,4.72,0),I(0.9,4.72,2.6),I(-0.9,4.72,2.6)],'#4a2e1a');BP(c,[I(-0.78,4.74,0),I(0.78,4.74,0),I(0.78,4.74,2.4),I(-0.78,4.74,2.4)],'#8a5a30');TH.ln(c,I(0,4.75,0),I(0,4.75,2.4),'rgba(30,16,6,.55)',u*0.08);
  const pr=I(0,4.78,3.4);c.strokeStyle='#c8842a';c.lineWidth=u*0.22;c.lineCap='round';c.beginPath();c.moveTo(pr[0]-u*0.55,pr[1]+u*0.28);c.bezierCurveTo(pr[0]-u*0.9,pr[1]-u*0.5,pr[0]-u*0.2,pr[1]-u*0.7,pr[0],pr[1]);c.bezierCurveTo(pr[0]+u*0.2,pr[1]-u*0.7,pr[0]+u*0.9,pr[1]-u*0.5,pr[0]+u*0.55,pr[1]+u*0.28);c.moveTo(pr[0]-u*0.55,pr[1]+u*0.28);c.lineTo(pr[0]+u*0.55,pr[1]+u*0.28);c.stroke();
  [[-1.8],[1.8]].forEach(([X])=>{const s=I(X,4.78,3.5);TH.poly(c,[[s[0]-u*0.3,s[1]+u*0.5],[s[0]+u*0.3,s[1]+u*0.5],[s[0]+u*0.26,s[1]-u*0.35],[s[0]-u*0.26,s[1]-u*0.35]],'#f2c230');TH.ell(c,s[0],s[1]-u*0.4,u*0.3,u*0.16,'#ffffff');TH.ln(c,[s[0]+u*0.3,s[1]-u*0.2],[s[0]+u*0.55,s[1]+u*0.1],'#f2c230',u*0.1);});
  for(let k=0;k<12;k++){const t=k/11,p=I(-5.1+t*10.2,3.45,2.0-Math.sin(t*Math.PI)*0.55);TH.poly(c,[[p[0]-u*0.22,p[1]],[p[0]+u*0.22,p[1]],[p[0],p[1]+u*0.5]],k%2?blue:'#f7f4ea');}
  /* beer garden: two benches and tables out front */
  [[-3.6,6.0],[3.6,6.2]].forEach(([X,Y],i)=>{BT(c,I,X-1.2,X+1.2,Y-0.45,Y+0.45,0.9,'#b88a50');BF(c,I,X-1.2,X+1.2,Y+0.45,0.88,0.9,'#7e5a30');BT(c,I,X-1.0,X+1.0,Y-0.45,Y+0.45,0.92,blue);RPOST(c,I,X-1.0,Y,0,0.9,'#6a4a2a',u,0.16);RPOST(c,I,X+1.0,Y,0,0.9,'#6a4a2a',u,0.16);BT(c,I,X-1.3,X+1.3,Y+0.75,Y+1.25,0.55,'#a8783e');const s=I(X-0.3,Y,0.92);TH.ell(c,s[0],s[1]-u*0.2,u*0.16,u*0.28,'#f2c230');TH.ell(c,s[0],s[1]-u*0.45,u*0.18,u*0.1,'#ffffff');});}};

/* ---- JUNGLE: a Skipper Canteen (salvaged riverside mess hall: weathered planks, rusted corrugated roof, bamboo veranda, a river boat at the dock) ---- */
RESTAURANT_ART.jungle={dy:0.05,k:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),plank='#8a6a46',roofC='#5f8f78';RSH_(c,x,y+u*0.6,u*8.6,u*3.6,'14,40,22');
  /* weathered two-storey body */
  JBOX(c,x,y,u,-4.7,4.7,-3,3,0,5.0,plank);for(let k=0;k<20;k++)TH.ln(c,I(-4.7+k*0.47,3,0),I(-4.7+k*0.47,3,5.0),'rgba(40,24,10,.28)',u*0.05);for(let k=0;k<13;k++)TH.ln(c,I(4.7,-3+k*0.47,0),I(4.7,-3+k*0.47,5.0),'rgba(30,18,8,.3)',u*0.05);
  [[-3.4,1.4],[0.9,1.4],[3.2,1.4],[-3.4,3.9],[0.0,3.9],[3.4,3.9]].forEach(([X,Z],i)=>{RWINDOW(c,I,3.02,X,Z,1.0,1.2,i<3?'#ffd27a':'#e0ca7a','#d7c8a4');TH.ln(c,I(X-0.78,3.04,Z+0.6),I(X-0.78,3.04,Z-0.6),'#5a8a44',u*0.28);TH.ln(c,I(X+0.78,3.04,Z+0.6),I(X+0.78,3.04,Z-0.6),'#5a8a44',u*0.28);});
  /* corrugated metal roof with rust */
  const roofP=(A,B,C2,D)=>{BP(c,[A,B,C2,D],roofC);RCLIP(c,[A,B,C2,D],()=>{for(let k=0;k<60;k++){const t=k/59,a=[A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t],b=[D[0]+(C2[0]-D[0])*t,D[1]+(C2[1]-D[1])*t];TH.ln(c,a,b,k%2?'rgba(20,50,40,.3)':'rgba(255,255,255,.12)',u*0.07);}for(let k=0;k<7;k++)TH.ell(c,A[0]+(B[0]-A[0])*((k*37)%100/100),A[1]+(D[1]-A[1])*((k*53)%100/100)+(B[1]-A[1])*((k*37)%100/100),u*(0.5+k%3*0.3),u*0.3,'rgba(150,80,40,.35)');});};
  const yc=0,H=3.0,o=0.7;BP(c,[I(5.0,-3,5.0),I(5.0,3,5.0),I(5.0,0,5.0+H*0.86)],'#4a6e5c');roofP(I(-5.4,3.7,5.0),I(5.4,3.7,5.0),I(5.4,0,5.0+H),I(-5.4,0,5.0+H));TH.ln(c,I(-5.4,0,5.0+H),I(5.4,0,5.0+H),'#3a5a48',u*0.16);
  /* the radio mast and a crooked flag */
  TH.ln(c,I(-3.2,0,8.0),I(-3.2,0,11.4),'#4a4a4e',u*0.14);TH.ln(c,I(-3.6,0,10.2),I(-2.8,0,10.2),'#4a4a4e',u*0.1);TH.ln(c,I(-3.4,0,9.2),I(-3.0,0,9.2),'#4a4a4e',u*0.1);TH.poly(c,[I(-3.2,0,11.4),I(-2.2,0,11.1),I(-3.2,0,10.7)],'#d9433b');
  /* bamboo veranda in front: deck, posts, shed roof, railing */
  BT(c,I,-5.4,5.4,3,5.8,0.25,'#b48a52');BF(c,I,-5.4,5.4,5.8,0,0.25,'#7e5e34');for(let k=0;k<18;k++)TH.ln(c,I(-5.4+k*0.6,3,0.25),I(-5.4+k*0.6,5.8,0.25),'rgba(60,34,10,.3)',u*0.05);
  BP(c,[I(-0.9,3.04,0.25),I(0.9,3.04,0.25),I(0.9,3.04,2.4),I(-0.9,3.04,2.4)],'#2a1c10');BP(c,[I(-0.75,3.06,0.25),I(0.75,3.06,0.25),I(0.75,3.06,2.2),I(-0.75,3.06,2.2)],'#6a4a2a');TH.ln(c,I(0,3.07,0.3),I(0,3.07,2.2),'rgba(30,16,6,.5)',u*0.06);
  [-5.2,-2.6,0,2.6,5.2].forEach(X=>{RPOST(c,I,X,5.6,0.25,4.4,'#c9b060',u,0.3);for(let z=0.8;z<4.4;z+=0.8)TH.ln(c,I(X-0.15,5.6,z),I(X+0.15,5.6,z),'#8a7a3a',u*0.1);});
  const sA=I(-5.7,6.0,4.4),sB=I(5.7,6.0,4.4),sC=I(5.7,3,5.0),sD=I(-5.7,3,5.0);roofP(sA,sB,sC,sD);TH.ln(c,sA,sB,'#3a5a48',u*0.14);
  TH.ln(c,I(-5.2,5.6,1.2),I(5.2,5.6,1.2),'#c9b060',u*0.14);TH.ln(c,I(5.2,3.4,1.2),I(5.2,5.6,1.2),'#c9b060',u*0.14);
  /* lanterns, crates, hanging ferns, vines on the corner */
  [-2.6,2.6].forEach(X=>{const p=I(X,5.6,3.8);RLANTERN(c,p[0],p[1]+u*0.2,u*1.0);});
  
  const cr=(X,Y,s)=>{JBOX(c,x,y,u,X-s,X+s,Y-s,Y+s,0,s*2,'#a8783e');TH.ln(c,I(X-s,Y+s,s),I(X+s,Y+s,s),'rgba(60,30,10,.4)',u*0.07);};cr(-4.0,6.4,0.5);cr(-3.0,6.6,0.4);
  for(let k=0;k<8;k++){const p=I(4.7,-2.6+k*0.5,5.0);TH.ln(c,p,[p[0]+(k%2?1:-1)*u*0.25,p[1]+u*(1.4+(k%3)*0.7)],'#3f8a45',u*0.14);}
  [[-4.6,3.2],[4.5,3.1],[-1.2,3.1]].forEach(([X,Y],i)=>{const p=I(X,Y,5.0);for(let j=0;j<5;j++){const a=-Math.PI*0.9+j/4*Math.PI*0.8;TH.ln(c,p,[p[0]+Math.cos(a)*u*1.5,p[1]+Math.sin(a)*u*0.8+u*0.7],j%2?'#3f8a45':'#58a04f',u*0.3);}});
}};

/* ===== RESTAURANT ART, batch 2 ===== */
const RTOTEM=(c,x,y,u,h,pal,v)=>{const w=u*0.72,n=Math.max(2,Math.round(h/(u*1.3)));SHDW_(c,x,y,u*0.9);for(let k=0;k<n;k++){const yy=y-k*(h/n),hh=h/n,col=pal[k%pal.length];TH.poly(c,[[x-w,yy],[x+w,yy],[x+w*0.95,yy-hh],[x-w*0.95,yy-hh]],col);TH.poly(c,[[x+w,yy],[x+w,yy-hh],[x+w*0.95,yy-hh]],'rgba(0,0,0,.28)');TH.ell(c,x-w*0.38,yy-hh*0.64,u*0.2,u*0.14,'#fff6dc');TH.ell(c,x+w*0.38,yy-hh*0.64,u*0.2,u*0.14,'#fff6dc');TH.ell(c,x-w*0.38,yy-hh*0.64,u*0.08,u*0.08,'#1a1008');TH.ell(c,x+w*0.38,yy-hh*0.64,u*0.08,u*0.08,'#1a1008');TH.poly(c,[[x-w*0.2,yy-hh*0.5],[x+w*0.2,yy-hh*0.5],[x,yy-hh*0.3]],'#2a1a10');TH.poly(c,[[x-w*0.55,yy-hh*0.22],[x+w*0.55,yy-hh*0.22],[x+w*0.4,yy-hh*0.08],[x-w*0.4,yy-hh*0.08]],'#1a1008');if(k%2===0)for(let t=-1;t<=1;t++)TH.poly(c,[[x+t*w*0.32-u*0.09,yy-hh*0.22],[x+t*w*0.32+u*0.09,yy-hh*0.22],[x+t*w*0.32,yy-hh*0.12]],'#fff6dc');}
  TH.poly(c,[[x-w*1.5,y-h],[x+w*1.5,y-h],[x+w*0.5,y-h-u*0.9],[x-w*0.5,y-h-u*0.9]],pal[0]);TH.ell(c,x,y-h-u*0.9,w*0.5,u*0.2,pal[1]);};
const SHDW_=(c,x,y,rx)=>{c.fillStyle='rgba(30,20,10,.22)';c.beginPath();c.ellipse(x+rx*0.2,y+rx*0.08,rx,rx*0.34,0,0,7);c.fill();};
const RTORCH=(c,x,y,u,h)=>{TH.ln(c,[x,y],[x,y-h],'#6a4a28',u*0.2);TH.ln(c,[x,y-h*0.7],[x,y-h*0.5],'#c8a050',u*0.2);GLOW(c,x,y-h-u*0.5,u*1.5,'255,160,50',0.5);c.fillStyle='#ff8a2a';c.beginPath();c.moveTo(x-u*0.3,y-h);c.quadraticCurveTo(x-u*0.4,y-h-u*0.9,x,y-h-u*1.5);c.quadraticCurveTo(x+u*0.4,y-h-u*0.8,x+u*0.3,y-h);c.closePath();c.fill();c.fillStyle='#ffd45a';c.beginPath();c.moveTo(x-u*0.14,y-h);c.quadraticCurveTo(x-u*0.14,y-h-u*0.6,x,y-h-u*0.95);c.quadraticCurveTo(x+u*0.14,y-h-u*0.5,x+u*0.14,y-h);c.closePath();c.fill();};
const RTHATCH=(c,pts,u,base,dark,n)=>{BP(c,pts,base);RCLIP(c,pts,()=>{const A=pts[0],B=pts[1],C2=pts[2],D=pts[3];for(let k=1;k<n;k++){const t=k/n,L=[A[0]+(D[0]-A[0])*t,A[1]+(D[1]-A[1])*t],Rr=[B[0]+(C2[0]-B[0])*t,B[1]+(C2[1]-B[1])*t];TH.ln(c,L,Rr,k%2?dark:'rgba(255,240,190,.25)',u*0.1);const m=(Rr[0]-L[0])/Math.round((Rr[0]-L[0])/(u*0.5)||1);for(let q=0;q<Math.round((Rr[0]-L[0])/(u*0.5));q++){const px=L[0]+q*m+(k%2)*m*0.5,py=L[1]+(Rr[1]-L[1])*(q*m/((Rr[0]-L[0])||1));TH.ln(c,[px,py],[px+m*0.12,py+u*0.45],dark,u*0.05);}}});};

/* ---- TIKI: a Polynesian feast hall (soaring thatch, carved totems, torches, an outrigger canoe) ---- */
RESTAURANT_ART.tiki={dy:0.05,k:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),wood='#6a4426',bam='#c9a860';RSH_(c,x,y+u*0.6,u*8.8,u*3.6,'20,40,16');
  /* raised timber deck and open bamboo walls */
  JBOX(c,x,y,u,-5.6,5.6,-3.6,4.6,0,0.5,'#8a5e34');for(let k=0;k<14;k++)TH.ln(c,I(-5.6+k*0.8,4.6,0.5),I(-5.6+k*0.8,-3.6,0.5),'rgba(40,20,6,.3)',u*0.05);
  JBOX(c,x,y,u,-4.8,4.8,-3.0,3.0,0.5,3.2,bam);for(let k=0;k<22;k++)TH.ln(c,I(-4.8+k*0.44,3.0,0.5),I(-4.8+k*0.44,3.0,3.2),'rgba(90,60,20,.4)',u*0.07);for(let k=0;k<13;k++)TH.ln(c,I(4.8,-3.0+k*0.5,0.5),I(4.8,-3.0+k*0.5,3.2),'rgba(70,46,14,.4)',u*0.07);
  TH.ln(c,I(-4.8,3.0,1.8),I(4.8,3.0,1.8),'#7a5a2a',u*0.12);TH.ln(c,I(4.8,-3.0,1.8),I(4.8,3.0,1.8),'#6a4a22',u*0.12);
  /* the big front opening with warm light and lanterns inside */
  BP(c,[I(-2.6,3.04,0.5),I(2.6,3.04,0.5),I(2.6,3.04,3.0),I(-2.6,3.04,3.0)],'#2a1a0c');GLOW(c,...I(0,3.1,1.8),u*3.2,'255,170,70',0.55);[-1.6,0,1.6].forEach(X=>{const p=I(X,3.08,2.4);TH.ln(c,[p[0],p[1]-u*0.8],p,'#3a2a1a',u*0.06);TH.ell(c,p[0],p[1]+u*0.2,u*0.28,u*0.34,'#ffcf6a');});
  [-2.6,2.6].forEach(X=>RPOST(c,I,X,3.1,0.5,3.2,'#4a2e18',u,0.5));
  /* soaring thatched A-frame roof */
  const z0=3.2,H=5.6,o=0.9,A=I(-5.9,4.6,z0),B=I(5.9,4.6,z0),R1=I(5.9,0,z0+H),R0=I(-5.9,0,z0+H);
  BP(c,[I(5.2,-3.6,z0),I(5.2,4.0,z0),I(5.2,0.2,z0+H*0.9)],'#a07c3a');
  RTHATCH(c,[A,B,R1,R0],u,'#caa55a','rgba(110,76,24,.5)',11);
  for(let k=0;k<26;k++){const t=k/25,p=[A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t];TH.poly(c,[[p[0]-u*0.24,p[1]],[p[0]+u*0.24,p[1]],[p[0],p[1]+u*0.55]],k%2?'#b8924a':'#caa55a');}
  TH.ln(c,R0,R1,'#6a4426',u*0.32);
  /* crossed barge-boards at the ridge ends, tall finials */
  const e1=I(5.9,0,z0+H);TH.ln(c,[e1[0]-u*0.9,e1[1]-u*1.6],[e1[0]+u*0.9,e1[1]+u*0.1],'#4a2e18',u*0.3);TH.ln(c,[e1[0]+u*0.9,e1[1]-u*1.6],[e1[0]-u*0.9,e1[1]+u*0.1],'#4a2e18',u*0.3);
  const e0=I(-5.9,0,z0+H);TH.ln(c,[e0[0]-u*0.9,e0[1]-u*1.6],[e0[0]+u*0.9,e0[1]+u*0.1],'#4a2e18',u*0.3);TH.ln(c,[e0[0]+u*0.9,e0[1]-u*1.6],[e0[0]-u*0.9,e0[1]+u*0.1],'#4a2e18',u*0.3);
  /* totems at the front corners and a pair of torches */
  const t1=I(-5.5,5.6,0.5),t2=I(5.5,5.6,0.5);RTOTEM(c,t1[0],t1[1],u,u*6.2,['#8a4a2a','#2f8a8a','#c8661e','#5a3a22']);RTOTEM(c,t2[0],t2[1],u,u*5.2,['#5a3a22','#c8661e','#2f8a8a','#8a4a2a']);
  [[-3.4,5.4],[3.4,5.4]].forEach(([X,Y])=>{const p=I(X,Y,0.5);RTORCH(c,p[0],p[1],u,u*3.2);});
  /* woven mats + low table by the door, and an outrigger canoe on the right */
  BT(c,I,-1.8,1.8,4.6,6.2,0.52,'#d9b25a');for(let k=0;k<6;k++)TH.ln(c,I(-1.8+k*0.72,4.6,0.52),I(-1.8+k*0.72,6.2,0.52),'rgba(120,60,20,.4)',u*0.07);JBOX(c,x,y,u,-0.9,0.9,5.0,5.8,0.52,1.0,'#5a3a22');
}};

/* ---- CARIBBEAN: a Nassau pirate tavern (coquina arches, pink clapboard upper floor, galleried balcony, shingled hip roof, Jolly Roger) ---- */
RESTAURANT_ART.caribbean={dy:0.05,k:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),coq='#e9dfc2',pink='#e6a08a',teal='#2f8f9a',roof='#7a5e48';RSH_(c,x,y+u*0.6,u*8.6,u*3.5,'30,34,34');
  JBOX(c,x,y,u,-4.8,4.8,-3.0,3.0,0,2.7,coq);for(let z=0.55;z<2.7;z+=0.55)TH.ln(c,I(-4.8,3.0,z),I(4.8,3.0,z),'rgba(120,100,60,.22)',u*0.05);
  /* three arched openings on the ground floor, lit from inside */
  [-3.1,0,3.1].forEach((X,i)=>{const p=[I(X-0.95,3.03,0),I(X+0.95,3.03,0),I(X+0.95,3.03,1.5)];c.beginPath();c.moveTo(p[0][0],p[0][1]);c.lineTo(p[1][0],p[1][1]);c.lineTo(p[2][0],p[2][1]);for(let k=0;k<=10;k++){const a=Math.PI*k/10,q=I(X+0.95*Math.cos(a),3.03,1.5+0.95*Math.sin(a));c.lineTo(q[0],q[1]);}c.closePath();c.fillStyle='#2a1a10';c.fill();GLOW(c,...I(X,3.1,1.1),u*1.8,'255,176,80',0.55);TH.ell(c,...I(X,3.05,0.9),u*0.4,u*0.5,'#ffc468');});
  /* pink clapboard upper floor with teal shutters */
  JBOX(c,x,y,u,-4.8,4.8,-3.0,3.0,2.7,5.2,pink);for(let z=2.95;z<5.2;z+=0.3){TH.ln(c,I(-4.8,3.0,z),I(4.8,3.0,z),'rgba(120,50,30,.16)',u*0.05);TH.ln(c,I(4.8,-3.0,z),I(4.8,3.0,z),'rgba(120,50,30,.18)',u*0.05);}
  [-3.6,-1.2,1.2,3.6].forEach(X=>{RWINDOW(c,I,3.02,X,3.95,0.85,1.3,'#ffd27a','#fff3e0');BP(c,[I(X-1.05,3.03,3.3),I(X-0.55,3.03,3.3),I(X-0.55,3.03,4.6),I(X-1.05,3.03,4.6)],teal);BP(c,[I(X+0.55,3.03,3.3),I(X+1.05,3.03,3.3),I(X+1.05,3.03,4.6),I(X+0.55,3.03,4.6)],teal);});
  /* wraparound gallery: floor, posts, railing */
  JBOX(c,x,y,u,-5.4,5.4,3.0,5.0,2.55,2.75,'#a8743e');[-5.2,-3.9,-2.6,-1.3,0,1.3,2.6,3.9,5.2].forEach(X=>{RPOST(c,I,X,4.9,2.75,3.8,'#fff3e0',u,0.14);});TH.ln(c,I(-5.3,4.9,3.8),I(5.3,4.9,3.8),'#fff3e0',u*0.16);TH.ln(c,I(5.3,3.0,3.8),I(5.3,4.9,3.8),'#fff3e0',u*0.16);[-5.2,5.2].forEach(X=>RPOST(c,I,X,4.9,0,2.6,'#8a5a30',u,0.26));[-1.8,1.8].forEach(X=>RPOST(c,I,X,4.9,0,2.6,'#8a5a30',u,0.26));
  /* hip shingle roof, front dormer, chimney */
  HIP(c,I,-5.2,5.2,-3.3,3.3,5.2,2.9,0.6,roof,'#5e4636',u,5);
  JBOX(c,x,y,u,3.2,4.1,-1.2,-0.3,5.4,8.6,'#b8a07a');JBOX(c,x,y,u,3.1,4.2,-1.3,-0.2,8.6,8.9,'#8a7656');
  BP(c,[I(-1.2,3.9,5.5),I(1.2,3.9,5.5),I(1.2,3.9,6.6),I(0,3.9,7.5),I(-1.2,3.9,6.6)],pink);RWINDOW(c,I,3.92,0,6.2,0.7,0.9,'#ffd27a','#fff3e0');BP(c,[I(1.3,2.6,5.5),I(1.3,3.95,5.5),I(0,3.95,7.5),I(0,2.6,7.0)],roof);BP(c,[I(-1.3,2.6,5.5),I(-1.3,3.95,5.5),I(0,3.95,7.5),I(0,2.6,7.0)],null);
  /* the Jolly Roger on a mast, a hanging skull-and-swords sign */
  TH.ln(c,I(-2.6,0,8.1),I(-2.6,0,12.0),'#4a3a28',u*0.16);BP(c,[I(-2.6,0,12.0),I(-0.4,0,11.6),I(-0.4,0,9.8),I(-2.6,0,10.2)],'#1c1c22');const fl=I(-1.5,0,11.0);TH.ell(c,fl[0],fl[1]-u*0.1,u*0.38,u*0.36,'#f4f4f0');TH.ell(c,fl[0]-u*0.14,fl[1]-u*0.1,u*0.08,u*0.1,'#1c1c22');TH.ell(c,fl[0]+u*0.14,fl[1]-u*0.1,u*0.08,u*0.1,'#1c1c22');TH.ln(c,[fl[0]-u*0.6,fl[1]+u*0.45],[fl[0]+u*0.6,fl[1]+u*0.0],'#f4f4f0',u*0.14);TH.ln(c,[fl[0]+u*0.6,fl[1]+u*0.45],[fl[0]-u*0.6,fl[1]+u*0.0],'#f4f4f0',u*0.14);
  const sg=I(5.4,5.2,3.6);TH.ln(c,[sg[0]-u*0.7,sg[1]-u*0.2],[sg[0]+u*0.2,sg[1]-u*0.2],'#2a2018',u*0.12);TH.poly(c,[[sg[0]-u*0.5,sg[1]-u*0.2],[sg[0]+u*0.2,sg[1]-u*0.2],[sg[0]+u*0.2,sg[1]+u*0.9],[sg[0]-u*0.5,sg[1]+u*0.9]],'#3a2a1c','#1a1008',u*0.05);TH.ell(c,sg[0]-u*0.15,sg[1]+u*0.4,u*0.2,u*0.2,'#f4f4f0');
  /* rum barrels, cannon, crates and a lantern on the quay */
  [[5.9,5.6],[6.6,4.8],[-5.9,5.6]].forEach(([X,Y],i)=>{const p=I(X,Y,0);RBARREL(c,p[0],p[1],u*1.1,i===1?'#7a5230':'#9a6a3a');});
  const cn=I(-3.6,6.4,0);TH.ell(c,cn[0]-u*0.5,cn[1]-u*0.2,u*0.7,u*0.7,'#3a3a40');TH.ell(c,cn[0]-u*0.5,cn[1]-u*0.2,u*0.5,u*0.5,'#5a5a60');TH.poly(c,[[cn[0]-u*0.2,cn[1]-u*0.9],[cn[0]+u*1.9,cn[1]-u*1.35],[cn[0]+u*1.9,cn[1]-u*0.75],[cn[0]-u*0.2,cn[1]-u*0.3]],'#2a2a30');TH.ell(c,cn[0]+u*1.9,cn[1]-u*1.05,u*0.3,u*0.3,'#14141a');TH.ell(c,cn[0]+u*0.2,cn[1],u*0.5,u*0.5,'#6a4a2a');}};

/* ---- ALPS: a snug winter lodge (granite base, larch timber, a deep snow roof, carved balcony, smoking chimney) ---- */
RESTAURANT_ART.alps={dy:0.05,k:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),tim='#a8683a',stone='#8d9198';RSH_(c,x,y+u*0.6,u*8.6,u*3.6,'40,50,70');
  JBOX(c,x,y,u,-4.9,4.9,-3.0,3.0,0,2.0,stone);for(let z=0.5;z<2.0;z+=0.5)TH.ln(c,I(-4.9,3.0,z),I(4.9,3.0,z),'rgba(30,34,44,.35)',u*0.06);for(let k=0;k<10;k++)TH.ln(c,I(-4.9+k*1.0,3.01,0),I(-4.9+k*1.0,3.01,2.0),'rgba(30,34,44,.28)',u*0.05);
  JBOX(c,x,y,u,-4.9,4.9,-3.0,3.0,2.0,4.9,tim);for(let z=2.3;z<4.9;z+=0.3){TH.ln(c,I(-4.9,3.0,z),I(4.9,3.0,z),'rgba(50,24,8,.25)',u*0.05);TH.ln(c,I(4.9,-3.0,z),I(4.9,3.0,z),'rgba(40,18,6,.28)',u*0.05);}
  [-3.6,-1.4,1.4,3.6].forEach(X=>{RWINDOW(c,I,3.02,X,3.55,0.95,1.3,'#ffd27a','#f6efe0');BP(c,[I(X-1.08,3.03,2.9),I(X-0.6,3.03,2.9),I(X-0.6,3.03,4.2),I(X-1.08,3.03,4.2)],'#b83a2a');BP(c,[I(X+0.6,3.03,2.9),I(X+1.08,3.03,2.9),I(X+1.08,3.03,4.2),I(X+0.6,3.03,4.2)],'#b83a2a');const h=I(X-0.84,3.04,3.55);TH.ell(c,h[0],h[1],u*0.1,u*0.12,'#f6efe0');});
  [-3.0,0,3.0].forEach(X=>{RWINDOW(c,I,3.02,X,1.1,0.9,0.9,'#ffd27a','#e8e8ee');});
  BP(c,[I(-0.75,3.04,0),I(0.75,3.04,0),I(0.75,3.04,1.7),I(-0.75,3.04,1.7)],'#4a2e1a');BP(c,[I(-0.62,3.06,0),I(0.62,3.06,0),I(0.62,3.06,1.6),I(-0.62,3.06,1.6)],'#7a4a26');
  /* carved balcony on the front and right */
  JBOX(c,x,y,u,-5.4,5.4,3.0,5.0,2.0,2.25,'#9a5e30');[-5.2,-4.2,-3.2,-2.2,-1.2,-0.2,0.8,1.8,2.8,3.8,4.8,5.2].forEach(X=>RPOST(c,I,X,4.9,2.25,3.2,'#d9a868',u,0.13));TH.ln(c,I(-5.3,4.9,3.2),I(5.3,4.9,3.2),'#d9a868',u*0.16);TH.ln(c,I(5.3,3.0,3.2),I(5.3,4.9,3.2),'#d9a868',u*0.16);[-5.2,5.2].forEach(X=>RPOST(c,I,X,4.9,0,2.1,'#8a5230',u,0.3));
  /* deep snow roof, low gable, big overhang, icicles */
  const z0=4.9,H=3.3,o=0.8,A=I(-5.7,3.8,z0),B=I(5.7,3.8,z0),R1=I(5.7,0,z0+H),R0=I(-5.7,0,z0+H);BP(c,[I(5.2,-3.3,z0),I(5.2,3.3,z0),I(5.2,0,z0+H*0.85)],'#eaf1fb');BP(c,[A,B,R1,R0],'#f7faff');
  RCLIP(c,[A,B,R1,R0],()=>{for(let k=0;k<4;k++){const t=(k+1)/5;TH.ln(c,[A[0]+(R0[0]-A[0])*t,A[1]+(R0[1]-A[1])*t],[B[0]+(R1[0]-B[0])*t,B[1]+(R1[1]-B[1])*t],'rgba(150,176,214,.35)',u*0.16);}c.fillStyle='rgba(120,150,196,.35)';c.beginPath();c.moveTo(R1[0],R1[1]);c.lineTo(B[0],B[1]);c.lineTo(B[0]-u*3,B[1]);c.closePath();c.fill();});
  TH.ln(c,A,B,'#7a5a3a',u*0.22);TH.ln(c,B,I(5.7,-3.8,z0),'#7a5a3a',u*0.2);TH.ln(c,R0,R1,'#dfe9f7',u*0.3);
  for(let k=0;k<18;k++){const t=k/17,p=[A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t];TH.poly(c,[[p[0]-u*0.12,p[1]],[p[0]+u*0.12,p[1]],[p[0],p[1]+u*(0.35+((k*7)%5)*0.18)]],'rgba(214,232,252,.9)');}
  /* cross-gable dormer + stone chimney with smoke */
  BP(c,[I(-1.4,3.8,z0+0.6),I(1.4,3.8,z0+0.6),I(0,3.8,z0+2.8)],'#a8683a');BP(c,[I(1.4,2.0,z0+0.6),I(1.4,3.9,z0+0.6),I(0,3.9,z0+2.8),I(0,2.0,z0+2.8)],'#f2f7fe');RWINDOW(c,I,3.84,0,z0+1.2,0.6,0.7,'#ffd27a','#f6efe0');
  JBOX(c,x,y,u,2.6,3.7,-2.6,-1.5,0,9.2,stone);JBOX(c,x,y,u,2.5,3.8,-2.7,-1.4,9.2,9.6,'#767a82');TH.poly(c,[I(2.5,-2.7,9.6),I(3.8,-2.7,9.6),I(3.8,-1.4,9.6),I(2.5,-1.4,9.6)],'#f1f6fd');
  const sm=I(3.15,-2.0,10.4);for(let k=0;k<4;k++)TH.ell(c,sm[0]+k*u*0.4,sm[1]-k*u*0.8,u*(0.5+k*0.2),u*(0.34+k*0.13),'rgba(235,238,245,'+(0.6-k*0.12)+')');
  /* snow drifts, two little pines, skis by the door, a lantern */
  [[-4.6,6.0,1.7],[4.6,6.3,1.5],[0.4,6.6,2.2]].forEach(([X,Y,s])=>{const p=I(X,Y,0);TH.ell(c,p[0],p[1],u*s,u*s*0.34,'#eef4fc');TH.ell(c,p[0]-u*s*0.2,p[1]-u*s*0.1,u*s*0.6,u*s*0.2,'#ffffff');});
  [[-6.0,3.4],[6.1,1.2]].forEach(([X,Y],i)=>{const p=I(X,Y,0);for(let k=0;k<3;k++)TH.poly(c,[[p[0]-u*(1.3-k*0.3),p[1]-u*k*1.1],[p[0]+u*(1.3-k*0.3),p[1]-u*k*1.1],[p[0],p[1]-u*(k*1.1+1.8)]],k%2?'#2f6a46':'#3a7a52');TH.poly(c,[[p[0]-u*0.8,p[1]-u*1.0],[p[0]+u*0.8,p[1]-u*1.0],[p[0],p[1]-u*1.9]],'rgba(255,255,255,.55)');});
  const sk=I(2.8,5.6,0);TH.ln(c,[sk[0]-u*0.2,sk[1]-u*0.2],[sk[0]+u*0.5,sk[1]-u*3.0],'#2a6ab0',u*0.14);TH.ln(c,[sk[0]+u*0.3,sk[1]-u*0.1],[sk[0]+u*1.0,sk[1]-u*2.9],'#b83a2a',u*0.14);RLANTERN(c,...I(1.2,5.0,2.7),u*1.0);}};

/* ---- GOTHIC: a spooky tavern (blackened timber and stone, steep slate roofs, a leaning tower, windows glowing yellow in the gloom) ---- */
RESTAURANT_ART.gothic={dy:0.05,k:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),stone='#3b3a48',stoneL='#4a4960',tim='#2a2230',slate='#2f2d3f';RSH_(c,x,y+u*0.6,u*8.6,u*3.6,'10,8,20');
  /* fog at the base */
  [[-4.8,5.0,2.6],[4.6,5.6,2.2],[0.5,6.4,3.0],[-1.5,-2.4,2.4],[5.6,0.0,2.0]].forEach(([X,Y,s])=>{const p=I(X,Y,0.2);SOFT_(c,p[0],p[1],u*s*1.6,u*s*0.5,'150,150,180',0.3);});
  /* chimney at the far left end, well clear of the front gable */
  JBOX(c,x,y,u,-6.4,-5.4,0.9,1.9,0,9.9,'#34323f');JBOX(c,x,y,u,-6.5,-5.3,0.8,2.0,9.9,10.3,'#2a2834');for(let z=1.0;z<9.9;z+=0.6)TH.ln(c,I(-5.4,0.9,z),I(-5.4,1.9,z),'rgba(10,10,20,.35)',u*0.05);{const sm=I(-5.9,1.4,10.9);for(let k=0;k<4;k++)TH.ell(c,sm[0]+k*u*0.3,sm[1]-k*u*0.8,u*(0.5+k*0.2),u*(0.34+k*0.12),'rgba(120,120,140,'+(0.5-k*0.1)+')');}
  JBOX(c,x,y,u,-4.6,4.6,-2.9,2.9,0,2.5,stone);for(let z=0.5;z<2.5;z+=0.5)TH.ln(c,I(-4.6,2.9,z),I(4.6,2.9,z),'rgba(10,10,20,.4)',u*0.06);
  JBOX(c,x,y,u,-4.9,4.9,-3.2,3.2,2.5,4.9,tim);[-4.9,-3.3,-1.7,-0.1,1.5,3.1,4.7].forEach(X=>TH.ln(c,I(X,3.2,2.5),I(X,3.2,4.9),'#18121f',u*0.24));[-3.2,0,3.2].forEach(Y=>TH.ln(c,I(4.9,Y,2.5),I(4.9,Y,4.9),'#18121f',u*0.24));TH.ln(c,I(-4.9,3.2,3.7),I(4.9,3.2,3.7),'#18121f',u*0.2);
  [[-4.9,-3.3],[1.5,3.1],[3.1,4.7]].forEach(([a,b])=>{TH.ln(c,I(a,3.2,2.5),I(b,3.2,3.7),'#18121f',u*0.15);TH.ln(c,I(a,3.2,3.7),I(b,3.2,4.9),'#18121f',u*0.15);});
  /* glowing pointed windows */
  const pw=(X,Z,w,h,Y)=>{const pts=TH.arch(x,y,u,Y,X,w/2,Z,Z+h*0.55,Z+h);BP(c,pts,'#ffcf5a');GLOW(c,...I(X,Y+0.05,Z+h*0.5),u*2.4,'255,190,70',0.55);const m=I(X,Y+0.02,Z+h*0.5),t=I(X,Y+0.02,Z+h*0.95),b=I(X,Y+0.02,Z+0.02);TH.ln(c,t,b,'#3a2a1a',u*0.08);TH.ln(c,[m[0]-u*w*0.55,m[1]],[m[0]+u*w*0.55,m[1]],'#3a2a1a',u*0.07);};
  [-3.6,-1.2,1.2].forEach(X=>{pw(X,0.7,1.0,1.4,2.93);});[-3.7,-1.9,0.0,1.9,3.7].forEach(X=>{pw(X,3.15,0.9,1.3,3.23);});
  BP(c,[I(2.5,3.0,0),I(3.7,3.0,0),I(3.7,3.0,1.6),I(3.1,3.0,2.1),I(2.5,3.0,1.6)],'#14101c');
  /* side-facade windows (right wall, upper floor): a pointed arch in the X plane */
  [-2.0,-0.7].forEach(Y=>{const w=0.8,z0=2.9,zs=3.9,zt=4.5,pts=[I(4.93,Y-w/2,z0),I(4.93,Y+w/2,z0)];for(let k=0;k<=8;k++){const s=k/8,q=1-s;pts.push(I(4.93,q*q*(Y+w/2)+2*q*s*(Y+w/2*0.85)+s*s*Y,q*q*zs+2*q*s*(zs+(zt-zs)*0.85)+s*s*zt));}for(let k=7;k>=0;k--){const s=k/8,q=1-s;pts.push(I(4.93,q*q*(Y-w/2)+2*q*s*(Y-w/2*0.85)+s*s*Y,q*q*zs+2*q*s*(zs+(zt-zs)*0.85)+s*s*zt));}BP(c,pts,'#ffcf5a');GLOW(c,...I(4.95,Y,3.7),u*2.4,'255,190,70',0.55);TH.ln(c,I(4.95,Y,2.95),I(4.95,Y,4.45),'#3a2a1a',u*0.08);TH.ln(c,I(4.95,Y-w*0.5,3.7),I(4.95,Y+w*0.5,3.7),'#3a2a1a',u*0.07);});
  /* steep slate roof with a front gable */
  const z0=4.9,H=4.4;GAB(c,I,-5.2,5.2,-3.5,3.5,z0,H,0.5,slate,'#25233a',u,7);
  RCLIP(c,[I(-5.7,4.0,z0),I(5.7,4.0,z0),I(5.7,0,z0+H),I(-5.7,0,z0+H)],()=>{for(let k=0;k<5;k++){const p=I(-4.5+k*2.1,2.0,z0+1.6);TH.blob(c,p[0],p[1],u*0.7,u*0.35,'rgba(60,88,60,.35)',mulberry(k+3),6);}});
  BP(c,[I(-1.6,3.5,z0+0.5),I(1.6,3.5,z0+0.5),I(0,3.5,z0+3.6)],'#241c2c');TH.ln(c,I(-1.6,3.5,z0+0.5),I(0,3.5,z0+3.6),'#12101a',u*0.2);TH.ln(c,I(1.6,3.5,z0+0.5),I(0,3.5,z0+3.6),'#12101a',u*0.2);BP(c,[I(1.6,2.0,z0+0.5),I(1.6,3.6,z0+0.5),I(0,3.6,z0+3.6),I(0,2.0,z0+3.6)],'#2c2a3e');pw(0,z0+0.9,0.9,1.5,3.55);
  /* the leaning tower on the right with a conical roof, bat weathervane */
  const tx=4.8,ty=1.6,tb=I(tx,ty,0),lean=u*0.7;const th=u*8.2;c.save();c.translate(tb[0],tb[1]);EGT_(c,u,th,lean);c.restore();
  /* finials */
  [[-5.2,3.5],[5.2,3.5]].forEach(([X,Y])=>{const p=I(X,Y,4.9);TH.poly(c,[[p[0]-u*0.2,p[1]],[p[0]+u*0.2,p[1]],[p[0],p[1]-u*1.6]],'#14101c');});
  /* wrought-iron lantern, a crooked sign, barrels, bats against the moon-grey air */
  const lp=I(-1.0,4.2,3.0);TH.ln(c,[lp[0],lp[1]-u*1.2],[lp[0]+u*0.8,lp[1]-u*1.2],'#14101c',u*0.1);RLANTERN(c,lp[0]+u*0.8,lp[1]-u*0.5,u*1.1,'255,190,70');
  const sg=I(3.2,3.9,3.4);TH.ln(c,[sg[0],sg[1]-u*0.4],[sg[0],sg[1]+u*0.2],'#14101c',u*0.08);TH.poly(c,[[sg[0]-u*0.7,sg[1]+u*0.2],[sg[0]+u*0.7,sg[1]+u*0.0],[sg[0]+u*0.7,sg[1]+u*0.9],[sg[0]-u*0.7,sg[1]+u*1.0]],'#3a2a22','#14101c',u*0.05);TH.ell(c,sg[0],sg[1]+u*0.55,u*0.22,u*0.22,'#e8e0d0');
  [[-5.4,5.0],[5.4,5.8]].forEach(([X,Y],i)=>{const p=I(X,Y,0);RBARREL(c,p[0],p[1],u*1.1,'#4a3a32');});
}};
const SOFT_=(c,x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
function EGT_(c,u,h,lean){const r=u*1.35,g=c.createLinearGradient(-r,0,r,0);g.addColorStop(0,'#55546c');g.addColorStop(0.55,'#3b3a4c');g.addColorStop(1,'#25243a');c.fillStyle=g;c.beginPath();c.moveTo(-r,0);c.lineTo(-r+lean*0.3,-h);c.lineTo(r+lean*0.3,-h);c.lineTo(r,0);c.ellipse(0,0,r,r*0.4,0,0,Math.PI,false);c.closePath();c.fill();
  for(let z=0.6;z<8;z+=0.7){c.strokeStyle='rgba(10,10,20,.35)';c.lineWidth=u*0.06;c.beginPath();c.ellipse(lean*0.3*z*u/h*8,-z*u,r*(1-0.03*z),r*0.38,0,0.05,Math.PI-0.05);c.stroke();}
  c.fillStyle='#2b2a3d';c.beginPath();c.moveTo(-r*1.25+lean*0.3,-h+u*0.2);c.lineTo(r*1.25+lean*0.3,-h+u*0.2);c.lineTo(lean*0.3+u*0.15,-h-u*4.6);c.closePath();c.fill();c.fillStyle='rgba(255,255,255,.07)';c.beginPath();c.moveTo(-r*1.25+lean*0.3,-h+u*0.2);c.lineTo(lean*0.3,-h-u*4.6);c.lineTo(lean*0.3-u*0.3,-h+u*0.2);c.closePath();c.fill();
  const tx=lean*0.3+u*0.15,ty=-h-u*4.6;TH.ln(c,[tx,ty],[tx,ty-u*1.4],'#14101c',u*0.1);TH.poly(c,[[tx,ty-u*1.4],[tx+u*0.9,ty-u*1.15],[tx+u*0.4,ty-u*0.7],[tx,ty-u*0.95]],'#14101c');}

/* ===== RESTAURANT ART, batch 3 ===== */
const RSTRIPE=(c,A,B,Cc,D,n,c1,c2)=>{BP(c,[A,B,Cc,D],c1);for(let k=0;k<n;k+=2){const t0=k/n,t1=(k+1)/n,P=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];BP(c,[P(A,B,t0),P(A,B,t1),P(D,Cc,t1),P(D,Cc,t0)],c2);}};
const RBULBS=(c,pts,u,col)=>pts.forEach(p=>{GLOW(c,p[0],p[1],u*0.6,'255,220,120',0.55);TH.ell(c,p[0],p[1],u*0.13,u*0.13,col||'#fff3c0');});
const RUMBRELLA=(c,x,y,u,c1,c2)=>{TH.ln(c,[x,y],[x,y-u*2.8],'#6a4a2a',u*0.14);const r=u*1.55,cy=y-u*2.4,ap=[x,y-u*3.5];for(let k=0;k<8;k++){const a0=Math.PI*k/8,a1=Math.PI*(k+1)/8;TH.poly(c,[ap,[x+Math.cos(a0)*r,cy+Math.sin(a0)*r*0.45],[x+Math.cos(a1)*r,cy+Math.sin(a1)*r*0.45]],k%2?c2:c1);}for(let k=0;k<8;k++){const a0=Math.PI+Math.PI*k/8,a1=Math.PI+Math.PI*(k+1)/8;TH.poly(c,[ap,[x+Math.cos(a0)*r,cy+Math.sin(a0)*r*0.45],[x+Math.cos(a1)*r,cy+Math.sin(a1)*r*0.45]],k%2?c1:c2);}};
const RTABLE=(c,x,y,u,col)=>{TH.ell(c,x,y+u*0.1,u*0.9,u*0.3,'rgba(0,0,0,.18)');TH.ln(c,[x,y],[x,y-u*0.9],'#6a4a2a',u*0.14);TH.ell(c,x,y-u*0.9,u*0.75,u*0.28,col||'#f4efe0');TH.ell(c,x-u*0.2,y-u*1.0,u*0.18,u*0.07,'#d9433b');};

/* ---- CLASSIC MIDWAY: a festive 1920s food hall (striped awnings, bulb-lit sign tower, corner cupolas, bunting, umbrella tables) ---- */
RESTAURANT_ART.classic={dy:0.05,k:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),cream='#f4e8c8',red='#d9433b',teal='#2f9a9a',yel='#f2c230';RSH_(c,x,y+u*0.6,u*8.8,u*3.6,'40,30,30');
  JBOX(c,x,y,u,-5.0,5.0,-3.0,3.0,0,4.6,cream);for(let z=0.6;z<4.6;z+=0.6)TH.ln(c,I(-5.0,3.0,z),I(5.0,3.0,z),'rgba(120,90,40,.15)',u*0.05);
  /* ground-floor service bays with colourful menu boards and warm light */
  [-3.6,-1.2,1.2,3.6].forEach((X,i)=>{BP(c,[I(X-0.95,3.02,0.35),I(X+0.95,3.02,0.35),I(X+0.95,3.02,2.5),I(X-0.95,3.02,2.5)],'#3a2418');GLOW(c,...I(X,3.1,1.5),u*2.0,'255,180,80',0.5);BP(c,[I(X-0.8,3.04,1.9),I(X+0.8,3.04,1.9),I(X+0.8,3.04,2.4),I(X-0.8,3.04,2.4)],[red,yel,teal,'#e86aa8'][i]);BP(c,[I(X-0.8,3.04,0.35),I(X+0.8,3.04,0.35),I(X+0.8,3.04,1.0),I(X-0.8,3.04,1.0)],'#a8743e');});
  /* big striped scalloped awning */
  RSTRIPE(c,I(-5.4,3.0,2.9),I(5.4,3.0,2.9),I(5.4,4.6,2.2),I(-5.4,4.6,2.2),14,'#f7f2e4',red);RSTRIPE(c,I(5.4,3.0,2.9),I(5.4,4.6,2.2),I(5.4,4.6,1.9),I(5.4,3.0,2.6),4,'#d8d0bc','#a83228');
  for(let k=0;k<14;k++){const a=I(-5.4+k*0.77,4.6,2.2),b=I(-4.63+k*0.77,4.6,2.2);TH.poly(c,[a,b,[(a[0]+b[0])/2,(a[1]+b[1])/2+u*0.55]],k%2?red:'#f7f2e4');}
  [-5.2,-2.6,0,2.6,5.2].forEach(X=>RPOST(c,I,X,4.5,0,2.3,'#f7f2e4',u,0.18));
  /* upper floor with round windows + a scalloped red cornice */
  [-3.8,-1.9,0,1.9,3.8].forEach(X=>{const p=I(X,3.02,3.9);TH.ell(c,p[0],p[1],u*0.62,u*0.58,'#f2ead2');TH.ell(c,p[0],p[1],u*0.5,u*0.46,'#ffd27a');TH.ln(c,[p[0]-u*0.5,p[1]],[p[0]+u*0.5,p[1]],'#f2ead2',u*0.07);TH.ln(c,[p[0],p[1]-u*0.46],[p[0],p[1]+u*0.46],'#f2ead2',u*0.07);});
  JBOX(c,x,y,u,-5.2,5.2,-3.2,3.2,4.6,5.0,red);for(let k=0;k<13;k++){const a=I(-5.2+k*0.8,3.2,4.6),b=I(-4.4+k*0.8,3.2,4.6);TH.poly(c,[a,b,[(a[0]+b[0])/2,(a[1]+b[1])/2+u*0.45]],yel);}
  /* the bulb-lit sign tower and a fat banner (no lettering: stripes and a star) */
  JBOX(c,x,y,u,-2.6,2.6,0.6,1.6,5.0,9.6,'#f2e2b4');BP(c,[I(-2.6,1.65,5.0),I(2.6,1.65,5.0),I(2.6,1.65,9.6),I(-2.6,1.65,9.6)],'#f4e8c8');BP(c,[I(-2.3,1.66,5.6),I(2.3,1.66,5.6),I(2.3,1.66,8.6),I(-2.3,1.66,8.6)],teal);BP(c,[I(-2.0,1.67,6.0),I(2.0,1.67,6.0),I(2.0,1.67,8.2),I(-2.0,1.67,8.2)],red);for(let k=0;k<5;k++)BP(c,[I(-1.8+k*0.72,1.68,6.2),I(-1.45+k*0.72,1.68,6.2),I(-1.45+k*0.72,1.68,8.0),I(-1.8+k*0.72,1.68,8.0)],k%2?yel:'#f7f2e4');
  const sp=I(0,1.7,9.9);TH.poly(c,[[sp[0],sp[1]-u*0.9],[sp[0]+u*0.25,sp[1]-u*0.25],[sp[0]+u*0.95,sp[1]-u*0.25],[sp[0]+u*0.4,sp[1]+u*0.15],[sp[0]+u*0.6,sp[1]+u*0.9],[sp[0],sp[1]+u*0.45],[sp[0]-u*0.6,sp[1]+u*0.9],[sp[0]-u*0.4,sp[1]+u*0.15],[sp[0]-u*0.95,sp[1]-u*0.25],[sp[0]-u*0.25,sp[1]-u*0.25]],yel);
  const bl=[];for(let k=0;k<12;k++){bl.push(I(-2.6+k*0.47,1.7,5.1));bl.push(I(-2.6+k*0.47,1.7,9.5));}for(let k=0;k<9;k++){bl.push(I(-2.6,1.7,5.2+k*0.5));bl.push(I(2.6,1.7,5.2+k*0.5));}RBULBS(c,bl,u);
  /* bunting along the front, umbrella tables, a popcorn cart */
  for(let k=0;k<16;k++){const t=k/15,p=I(-5.2+t*10.4,4.6,2.2+(1-Math.pow(2*t-1,2))*0.0);const q=I(-5.2+t*10.4,5.6,3.4-Math.sin(t*Math.PI)*0.7);TH.poly(c,[[q[0]-u*0.2,q[1]],[q[0]+u*0.2,q[1]],[q[0],q[1]+u*0.5]],[red,yel,teal,'#f7f2e4'][k%4]);}
  [[-3.4,6.5],[1.0,6.8]].forEach(([X,Y],i)=>{const p=I(X,Y,0);RTABLE(c,p[0],p[1],u,'#f7f2e4');RUMBRELLA(c,p[0],p[1],u,red,'#f7f2e4');});
  const pc=I(5.6,6.0,0);TH.ell(c,pc[0],pc[1]+u*0.1,u*1.3,u*0.4,'rgba(0,0,0,.2)');TH.poly(c,[[pc[0]-u*1.0,pc[1]],[pc[0]+u*1.0,pc[1]],[pc[0]+u*1.0,pc[1]-u*1.3],[pc[0]-u*1.0,pc[1]-u*1.3]],red);TH.poly(c,[[pc[0]-u*0.9,pc[1]-u*1.3],[pc[0]+u*0.9,pc[1]-u*1.3],[pc[0]+u*0.7,pc[1]-u*2.5],[pc[0]-u*0.7,pc[1]-u*2.5]],'#f7f2e4','#c8c0a8',u*0.05);TH.ell(c,pc[0]-u*0.9,pc[1]+u*0.1,u*0.34,u*0.34,'#3a3a3e');TH.ell(c,pc[0]+u*0.9,pc[1]+u*0.1,u*0.34,u*0.34,'#3a3a3e');TH.poly(c,[[pc[0]-u*0.8,pc[1]-u*2.5],[pc[0]+u*0.8,pc[1]-u*2.5],[pc[0]+u*0.5,pc[1]-u*2.9],[pc[0]-u*0.5,pc[1]-u*2.9]],yel);}};
function EGCYL_(c,x,y,rx,ry,h,cols){const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,cols[0]);g.addColorStop(0.55,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y);c.lineTo(x-rx,y-h);c.ellipse(x,y-h,rx,ry,0,Math.PI,0,false);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();c.fillStyle=cols[0];c.beginPath();c.ellipse(x,y-h,rx,ry,0,0,7);c.fill();}

/* ---- AMERICANA: a Victorian (Main Street style): brick shopfront, striped awning, trimmed upper windows, bracketed cornice, a clean slate hip roof with two dormers, a corner turret and a flag ---- */
RESTAURANT_ART.americana={dy:0.05,k:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),body='#f2dca4',trim='#fff8e8',rose='#b84a52',slate='#566472',brick='#cf9470';RSH_(c,x,y+u*0.6,u*8.6,u*3.6,'40,34,28');
  /* brick ground floor, painted clapboard upper floor */
  JBOX(c,x,y,u,-4.8,4.8,-3.0,3.0,0,3.2,brick);for(let z=0.45;z<3.2;z+=0.45){TH.ln(c,I(-4.8,3.0,z),I(4.8,3.0,z),'rgba(90,40,20,.22)',u*0.05);TH.ln(c,I(4.8,-3.0,z),I(4.8,3.0,z),'rgba(80,36,18,.25)',u*0.05);}
  JBOX(c,x,y,u,-5.0,5.0,-3.2,3.2,3.05,3.4,trim);
  JBOX(c,x,y,u,-4.8,4.8,-3.0,3.0,3.2,6.2,body);for(let z=3.5;z<6.2;z+=0.3){TH.ln(c,I(-4.8,3.0,z),I(4.8,3.0,z),'rgba(140,100,40,.16)',u*0.05);TH.ln(c,I(4.8,-3.0,z),I(4.8,3.0,z),'rgba(120,84,32,.2)',u*0.05);}
  /* shopfront: two big glazed windows and a centre door */
  [-2.2,3.2].forEach(X=>{BP(c,[I(X-1.15,3.02,0.45),I(X+1.15,3.02,0.45),I(X+1.15,3.02,2.5),I(X-1.15,3.02,2.5)],trim);BP(c,[I(X-1.0,3.03,0.6),I(X+1.0,3.03,0.6),I(X+1.0,3.03,2.35),I(X-1.0,3.03,2.35)],'#ffd8a0');TH.ln(c,I(X,3.04,0.6),I(X,3.04,2.35),trim,u*0.07);GLOW(c,...I(X,3.1,1.4),u*1.8,'255,190,90',0.4);});
  BP(c,[I(0.2,3.02,0),I(1.4,3.02,0),I(1.4,3.02,2.5),I(0.2,3.02,2.5)],trim);BP(c,[I(0.32,3.03,0),I(1.28,3.03,0),I(1.28,3.03,2.35),I(0.32,3.03,2.35)],'#8a2e32');BP(c,[I(0.48,3.04,1.1),I(1.12,3.04,1.1),I(1.12,3.04,2.2),I(0.48,3.04,2.2)],'#ffd8a0');
  RSTRIPE(c,I(-3.3,3.0,3.0),I(5.1,3.0,3.0),I(5.1,4.3,2.45),I(-3.3,4.3,2.45),10,'#f7f1e0',rose);for(let k=0;k<10;k++){const a=I(-3.3+k*0.84,4.3,2.45),b=I(-2.46+k*0.84,4.3,2.45);TH.poly(c,[a,b,[(a[0]+b[0])/2,(a[1]+b[1])/2+u*0.42]],k%2?rose:'#f7f1e0');}
  [-3.2,5.0].forEach(X=>RPOST(c,I,X,4.2,0,2.5,'#f7f1e0',u,0.18));
  /* four evenly spaced upper windows, each with a sill and a little pediment */
  [-2.0,0.0,2.0,4.0].forEach(X=>{RWINDOW(c,I,3.03,X,4.7,0.95,1.7,'#ffd27a','#fff8e8');TH.ln(c,I(X,3.05,3.85),I(X,3.05,5.55),trim,u*0.07);TH.ln(c,I(X-0.45,3.05,4.7),I(X+0.45,3.05,4.7),trim,u*0.06);BP(c,[I(X-0.7,3.04,5.7),I(X+0.7,3.04,5.7),I(X,3.04,6.1)],rose);JBOX(c,x,y,u,X-0.65,X+0.65,3.0,3.3,3.7,3.85,trim);});
  /* bracketed cornice */
  JBOX(c,x,y,u,-5.1,5.1,-3.3,3.3,6.2,6.55,trim);for(let k=0;k<15;k++)TH.poly(c,[I(-5.0+k*0.7,3.31,6.2),I(-4.6+k*0.7,3.31,6.2),I(-4.8+k*0.7,3.31,5.75)],'#e8d8b0');
  /* clean slate hip roof + two dormers on the front slope + a brick chimney */
  const z0=6.55,H=2.7;HIP(c,I,-5.1,5.1,-3.3,3.3,z0,H,0.5,slate,shade(slate,-0.3),u,6);
  const sl=(t)=>({Y:3.8*(1-t),Z:z0+H*t});[-1.4,2.4].forEach(X=>{const d=sl(0.34),w=0.8,h=1.2,zb=d.Z,yb=d.Y;BP(c,[I(X-w,yb,zb),I(X+w,yb,zb),I(X+w,yb,zb+h),I(X-w,yb,zb+h)],body);BP(c,[I(X-w+0.12,yb+0.01,zb+0.25),I(X+w-0.12,yb+0.01,zb+0.25),I(X+w-0.12,yb+0.01,zb+h-0.2),I(X-w+0.12,yb+0.01,zb+h-0.2)],'#ffd27a');TH.ln(c,I(X,yb+0.02,zb+0.25),I(X,yb+0.02,zb+h-0.2),trim,u*0.06);BP(c,[I(X-w-0.15,yb+0.04,zb+h),I(X+w+0.15,yb+0.04,zb+h),I(X,yb+0.04,zb+h+0.95)],rose);BP(c,[I(X+w+0.15,yb-0.9,zb+h+0.2),I(X+w+0.15,yb+0.04,zb+h),I(X,yb+0.04,zb+h+0.95),I(X,yb-0.9,zb+h+0.95)],shade(rose,-0.25));BP(c,[I(X+w,yb-0.9,zb),I(X+w,yb,zb),I(X+w,yb,zb+h),I(X+w,yb-0.9,zb+h)],shade(body,-0.18));});
  JBOX(c,x,y,u,3.4,4.4,-1.8,-0.8,6.0,9.6,'#a8553a');JBOX(c,x,y,u,3.3,4.5,-1.9,-0.7,9.6,9.95,'#8a4430');const sm=I(3.9,-1.3,10.7);for(let k=0;k<4;k++)TH.ell(c,sm[0]+k*u*0.3,sm[1]-k*u*0.8,u*(0.5+k*0.18),u*(0.34+k*0.12),'rgba(235,235,240,'+(0.55-k*0.11)+')');
  /* the corner turret: round body, windows, conical slate roof, flag */
  const tb=I(-4.9,2.9,0),tr=u*1.5;EGCYL_(c,tb[0],tb[1],tr,tr*0.4,u*7.4,[body,'#e2c78a','#b8985a']);for(let z=3.4;z<7.4;z+=0.6){c.strokeStyle='rgba(140,100,40,.16)';c.lineWidth=u*0.06;c.beginPath();c.ellipse(tb[0],tb[1]-z*u,tr,tr*0.4,0,0.05,Math.PI-0.05);c.stroke();}
  [2.2,5.0].forEach(z=>{const p=[tb[0]+u*0.25,tb[1]-z*u];c.fillStyle='#ffd27a';c.beginPath();c.moveTo(p[0]-u*0.4,p[1]+u*0.35);c.lineTo(p[0]-u*0.4,p[1]-u*0.7);c.quadraticCurveTo(p[0],p[1]-u*1.3,p[0]+u*0.4,p[1]-u*0.7);c.lineTo(p[0]+u*0.4,p[1]+u*0.35);c.closePath();c.fill();});
  const tt=[tb[0],tb[1]-u*7.4];c.fillStyle=slate;c.beginPath();c.moveTo(tt[0]-tr*1.25,tt[1]+u*0.2);c.lineTo(tt[0]+tr*1.25,tt[1]+u*0.2);c.lineTo(tt[0],tt[1]-u*3.2);c.closePath();c.fill();c.fillStyle='rgba(255,255,255,.1)';c.beginPath();c.moveTo(tt[0]-tr*1.25,tt[1]+u*0.2);c.lineTo(tt[0],tt[1]-u*3.2);c.lineTo(tt[0]-tr*0.2,tt[1]+u*0.2);c.fill();TH.ln(c,[tt[0],tt[1]-u*3.2],[tt[0],tt[1]-u*5.0],'#6a4a2a',u*0.1);TH.poly(c,[[tt[0],tt[1]-u*5.0],[tt[0]+u*1.5,tt[1]-u*4.6],[tt[0],tt[1]-u*4.1]],'#d9433b');TH.poly(c,[[tt[0],tt[1]-u*5.0],[tt[0]+u*0.5,tt[1]-u*4.8],[tt[0],tt[1]-u*4.55]],'#2a4a9a');
  /* gas lamp, planter and a bench out front */
  const gl=I(5.6,5.0,0);TH.ln(c,gl,[gl[0],gl[1]-u*3.4],'#2a2a30',u*0.16);TH.ell(c,gl[0],gl[1]-u*0.1,u*0.4,u*0.16,'#2a2a30');RLANTERN(c,gl[0],gl[1]-u*3.4,u*1.1);
  JBOX(c,x,y,u,-2.6,-1.0,4.7,5.6,0,0.7,'#8a5a30');for(let k=0;k<6;k++)TH.ell(c,I(-2.5+k*0.3,5.15,0.8)[0],I(-2.5+k*0.3,5.15,0.8)[1]-u*0.2,u*0.28,u*0.3,['#d9433b','#f2c230','#e86aa8','#4aa050','#d9433b','#f2c230'][k]);
  JBOX(c,x,y,u,1.4,3.6,5.0,5.5,0.6,0.8,'#8a5a30');JBOX(c,x,y,u,1.4,3.6,5.45,5.55,0.8,1.6,'#8a5a30');RPOST(c,I,1.5,5.2,0,0.6,'#2a2a30',u,0.14);RPOST(c,I,3.5,5.2,0,0.6,'#2a2a30',u,0.14);}};

/* ---- SPACE: a giant glass-domed habitat (aluminium ring, geodesic dome over gardens and dining, airlock tunnel, dish and solar wing) ---- */
RESTAURANT_ART.space={dy:0.06,k:1,draw(c,x,y,u,v){const ring='#e6ecf2',ringD='#9aa6b6',blue='#4ac8ff';RSH_(c,x,y+u*0.5,u*8.6,u*3.6,'20,30,50');
  /* base ring */
  const RH=u*2.5,bx=x,by=y,rx=u*6.6,ry=u*3.3;const g1=c.createLinearGradient(bx-rx,0,bx+rx,0);g1.addColorStop(0,'#f4f8fc');g1.addColorStop(0.5,ring);g1.addColorStop(1,ringD);c.fillStyle=g1;c.beginPath();c.moveTo(bx-rx,by-RH);c.lineTo(bx-rx,by);c.ellipse(bx,by,rx,ry,0,Math.PI,0,true);c.lineTo(bx+rx,by-RH);c.ellipse(bx,by-RH,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();
  c.fillStyle='#cfd8e2';c.beginPath();c.ellipse(bx,by-RH,rx,ry,0,0,7);c.fill();
  for(let k=0;k<26;k++){const a=Math.PI*(0.05+0.9*k/25),px=bx+Math.cos(a)*rx*0.985,py=by+Math.sin(a)*ry*0.985-RH*0.5;GLOW(c,px,py,u*0.7,'74,200,255',0.7);TH.ell(c,px,py,u*0.13,u*0.08,'#bff0ff');}
  c.strokeStyle='rgba(120,134,152,.5)';c.lineWidth=u*0.07;for(let k=0;k<14;k++){const a=Math.PI*(0.04+0.92*k/13);c.beginPath();c.moveTo(bx+Math.cos(a)*rx,by+Math.sin(a)*ry);c.lineTo(bx+Math.cos(a)*rx,by+Math.sin(a)*ry-RH);c.stroke();}
  /* the garden and the dining floor inside */
  const fy=by-RH;c.save();c.beginPath();c.ellipse(bx,fy,rx*0.97,ry*0.97,0,0,7);c.clip();const fg=c.createRadialGradient(bx,fy,0,bx,fy,rx);fg.addColorStop(0,'#cfe9d0');fg.addColorStop(1,'#8fcf98');c.fillStyle=fg;c.fillRect(bx-rx,fy-ry,rx*2,ry*2);c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=u*0.16;c.beginPath();c.ellipse(bx,fy,rx*0.6,ry*0.6,0,0,7);c.stroke();c.restore();
  [[-3.3,0.6],[3.2,0.9],[0,-1.2],[-1.8,-2.1],[2.2,-2.0]].forEach(([dx,dy],i)=>{const px=bx+dx*u,py=fy+dy*u*0.9;TH.ln(c,[px,py],[px,py-u*1.5],'#8a6a3a',u*0.14);for(let j=0;j<5;j++){const a=-Math.PI*0.9+j/4*Math.PI*0.8;TH.ln(c,[px,py-u*1.5],[px+Math.cos(a)*u*1.1,py-u*1.5+Math.sin(a)*u*0.7],j%2?'#3f9a55':'#5ab868',u*0.28);}});
  [[-1.0,1.8],[1.6,1.6],[-2.8,-0.4],[2.6,-0.6]].forEach(([dx,dy])=>{const px=bx+dx*u,py=fy+dy*u*0.9;TH.ell(c,px,py,u*0.55,u*0.2,'#ffffff');TH.ell(c,px,py-u*0.15,u*0.4,u*0.14,'#e8f2f8');TH.ln(c,[px,py],[px,py+u*0.3],'#9aa6b6',u*0.1);});
  /* the geodesic glass dome */
  const dh=u*7.4,dg=c.createLinearGradient(0,fy-dh,0,fy);dg.addColorStop(0,'rgba(190,236,255,.55)');dg.addColorStop(0.6,'rgba(140,214,246,.32)');dg.addColorStop(1,'rgba(120,200,238,.18)');
  c.fillStyle=dg;c.beginPath();c.moveTo(bx-rx*0.97,fy);c.bezierCurveTo(bx-rx*0.97,fy-dh*1.32,bx+rx*0.97,fy-dh*1.32,bx+rx*0.97,fy);c.ellipse(bx,fy,rx*0.97,ry*0.97,0,0,Math.PI,false);c.closePath();c.fill();
  c.save();c.beginPath();c.moveTo(bx-rx*0.97,fy);c.bezierCurveTo(bx-rx*0.97,fy-dh*1.32,bx+rx*0.97,fy-dh*1.32,bx+rx*0.97,fy);c.ellipse(bx,fy,rx*0.97,ry*0.97,0,0,Math.PI,false);c.closePath();c.clip();
  c.strokeStyle='rgba(235,245,252,.85)';c.lineWidth=u*0.1;for(let k=-4;k<=4;k++){c.beginPath();c.moveTo(bx+k*rx*0.24,fy+ry*Math.sqrt(Math.max(0,1-(k*0.24/0.97)**2))*0.97);c.bezierCurveTo(bx+k*rx*0.26,fy-dh*0.7,bx+k*rx*0.14,fy-dh,bx,fy-dh*0.98);c.stroke();}
  for(let k=1;k<=4;k++){const t=k/5,hh=dh*0.98*t,w=rx*0.97*Math.sqrt(Math.max(0,1-Math.pow(t,1.6)));c.beginPath();c.ellipse(bx,fy-hh*0.95,w,w*0.34*(1-t*0.2),0,0,Math.PI);c.stroke();}
  const hl=c.createLinearGradient(bx-rx,fy-dh,bx,fy);hl.addColorStop(0,'rgba(255,255,255,.55)');hl.addColorStop(0.5,'rgba(255,255,255,0)');c.fillStyle=hl;c.beginPath();c.ellipse(bx-rx*0.3,fy-dh*0.62,rx*0.22,dh*0.3,-0.5,0,7);c.fill();c.restore();
  c.strokeStyle='rgba(235,245,252,.9)';c.lineWidth=u*0.14;c.beginPath();c.moveTo(bx-rx*0.97,fy);c.bezierCurveTo(bx-rx*0.97,fy-dh*1.32,bx+rx*0.97,fy-dh*1.32,bx+rx*0.97,fy);c.stroke();
  TH.ln(c,[bx,fy-dh*0.99],[bx,fy-dh*0.99-u*2.6],'#cfd8e2',u*0.14);TH.ell(c,bx,fy-dh*0.99-u*2.6,u*0.3,u*0.3,'#ff5a4a');GLOW(c,bx,fy-dh*0.99-u*2.6,u*1.6,'255,90,70',0.55);
  /* a round door set into the LEFT side of the ring: a circle on a wall that faces left-front, so it is drawn sheared to follow the wall */
  {const ea=Math.PI*0.72,dxx=bx+Math.cos(ea)*rx,dyy=by+Math.sin(ea)*ry-RH*0.5,dr=RH*0.4,tx=-Math.sin(ea),ty=Math.cos(ea);
   const Q=(s,z)=>[dxx+tx*s,dyy+ty*s*0.5-z],ring=(r,col,w)=>{c.beginPath();for(let k=0;k<=36;k++){const t=k/36*Math.PI*2,q=Q(Math.cos(t)*r,Math.sin(t)*r);k?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);}c.closePath();if(col){c.fillStyle=col;c.fill();}};
   ring(dr*1.22,'#8d99aa');ring(dr*1.06,'#e6ecf2');ring(dr*0.9,'#4a6a88');const q0=Q(0,0);const dgr=c.createRadialGradient(q0[0]-dr*0.25,q0[1]-dr*0.3,0,q0[0],q0[1],dr*0.9);dgr.addColorStop(0,'#e8fbff');dgr.addColorStop(1,'#59b7dc');ring(dr*0.8,dgr);GLOW(c,q0[0],q0[1],dr*2.4,'120,220,255',0.45);
   for(let k=0;k<3;k++){const a=k*Math.PI/3+0.3,p1=Q(-Math.cos(a)*dr*0.8,-Math.sin(a)*dr*0.8),p2=Q(Math.cos(a)*dr*0.8,Math.sin(a)*dr*0.8);TH.ln(c,p1,p2,'#cfd8e2',u*0.12);}TH.ell(c,q0[0],q0[1],dr*0.2,dr*0.2,'#cfd8e2');for(let k=0;k<8;k++){const t=k*Math.PI/4,q=Q(Math.cos(t)*dr*1.14,Math.sin(t)*dr*1.14);TH.ell(c,q[0],q[1],u*0.09,u*0.09,k%2?'#bfe6ff':'#7ad0ff');}}
}};

/* ---- RETRO FUTURE: an octagonal Space Mountain (a windowed podium, a tapered white tower with strong vertical ribs, a low pyramid roof and a spire) ---- */
RESTAURANT_ART.retro={dy:0.05,k:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),R0=6.5,R1=5.4,R2=4.4,ZP=2.3,ZT=5.7,ZA=6.55;RSH_(c,x,y+u*0.5,u*8.4,u*3.6,'30,50,70');
  const ang=k=>(k+0.5)*Math.PI/4,V=(k,r,z)=>I(Math.cos(ang(k))*r,Math.sin(ang(k))*r,z);
  const P=(k,s,z,r)=>{const a0=ang(k),a1=ang(k+1);return I(Math.cos(a0)*r*(1-s)+Math.cos(a1)*r*s,Math.sin(a0)*r*(1-s)+Math.sin(a1)*r*s,z);};
  const dep=k=>Math.cos((k+1)*Math.PI/4)+Math.sin((k+1)*Math.PI/4),all=[0,1,2,3,4,5,6,7].sort((a,b)=>dep(a)-dep(b)),vis=all.filter(k=>dep(k)>0.05),visV=[0,1,2,3,4,5,6,7].filter(k=>Math.cos(ang(k))+Math.sin(ang(k))>-0.25);
  const rr=z=>R1+(R2-R1)*(z-ZP)/(ZT-ZP);
  const shd=['#ffffff','#f1f5f8','#dde5ec','#cfd9e2','#c4cfd9','#d9e1e8','#eaf0f4','#f6f9fb'];
  /* podium: white octagon with a continuous band of windows on the bottom level, an orange lintel and a ledge */
  vis.forEach(k=>{BP(c,[V(k,R0,0),V(k+1,R0,0),V(k+1,R0,ZP),V(k,R0,ZP)],shd[k%8]);
    for(let j=0;j<3;j++){const s0=0.1+0.29*j,s1=s0+0.24,z0=0.45,z1=1.75;BP(c,[P(k,s0,z0,R0),P(k,s1,z0,R0),P(k,s1,z1,R0),P(k,s0,z1,R0)],'#2a3a52');const gp=[P(k,s0+0.015,z0+0.1,R0),P(k,s1-0.015,z0+0.1,R0),P(k,s1-0.015,z1-0.1,R0),P(k,s0+0.015,z1-0.1,R0)],ys=gp.map(p=>p[1]),gg=c.createLinearGradient(0,Math.min(...ys),0,Math.max(...ys));gg.addColorStop(0,'#bfeaf6');gg.addColorStop(0.5,'#7fcbe2');gg.addColorStop(1,'#3fa2c4');BP(c,gp,gg);GLOW(c,...P(k,(s0+s1)/2,1.1,R0),u*1.3,'170,222,255',0.3);TH.ln(c,P(k,(s0+s1)/2,z0+0.1,R0),P(k,(s0+s1)/2,z1-0.1,R0),'#f4f8fb',u*0.07);}
    BP(c,[P(k,0,1.85,R0),P(k,1,1.85,R0),P(k,1,ZP,R0),P(k,0,ZP,R0)],'#2f7fd8');});
  /* the doorway (front face) with a small canopy */
  {const kf=3;BP(c,[P(kf,0.36,0,R0),P(kf,0.64,0,R0),P(kf,0.64,1.7,R0),P(kf,0.36,1.7,R0)],'#1c2a3e');GLOW(c,...P(kf,0.5,0.9,R0),u*1.6,'170,222,255',0.5);BP(c,[P(kf,0.28,1.85,R0),P(kf,0.72,1.85,R0),P(kf,0.76,1.65,R0+0.9),P(kf,0.24,1.65,R0+0.9)],'#4a95e8');}
  /* ledge between podium and tower */
  BP(c,[0,1,2,3,4,5,6,7].map(k=>V(k,R0,ZP)),'#e8eef3');
  /* tapered tower faces */
  vis.forEach(k=>{BP(c,[V(k,R1,ZP),V(k+1,R1,ZP),V(k+1,R2,ZT),V(k,R2,ZT)],shd[k%8]);
    [[3.4,3.7,'#2f7fd8'],[5.3,5.5,'#3aa8e8']].forEach(([za,zb,col])=>BP(c,[P(k,0,za,rr(za)),P(k,1,za,rr(za)),P(k,1,zb,rr(zb)),P(k,0,zb,rr(zb))],col));
    for(let j=0;j<3;j++){const s=0.2+0.3*j,p=P(k,s,4.5,rr(4.5));GLOW(c,p[0],p[1],u*0.5,'170,222,255',0.5);TH.ell(c,p[0],p[1],u*0.1,u*0.1,'#d8efff');}});
  /* the strong vertical ribs, one on every visible edge of the tower, each ending in a pointed fin */
  visV.forEach(k=>{const a=V(k,R1+0.05,ZP),b=V(k,R2+0.05,ZT);TH.ln(c,a,b,'#aeb9c6',u*0.62);TH.ln(c,[a[0]-u*0.08,a[1]],[b[0]-u*0.08,b[1]],'#ffffff',u*0.44);TH.poly(c,[[b[0]-u*0.28,b[1]],[b[0]+u*0.28,b[1]],[b[0],b[1]-u*0.9]],'#ffffff');});
  /* thin cap ring, then the low pyramid roof with ribs running up to the apex */
  const ro=R2+0.5,rz=ZT+0.3;all.forEach(k=>{if(!vis.includes(k))return;BP(c,[V(k,ro,ZT),V(k+1,ro,ZT),V(k+1,ro,rz),V(k,ro,rz)],'#2f7fd8');});BP(c,[0,1,2,3,4,5,6,7].map(k=>V(k,ro,rz)),'#eaf4ff');
  const apex=I(0,0,ZA);all.forEach(k=>{BP(c,[V(k,ro-0.15,rz),V(k+1,ro-0.15,rz),apex],shd[k%8]);});visV.forEach(k=>TH.ln(c,V(k,ro-0.15,rz),apex,'#ffffff',u*0.3));all.forEach(k=>TH.ln(c,V(k,ro-0.15,rz),apex,'rgba(110,130,152,.25)',u*0.05));
  /* spire with rings and a glowing tip */
  TH.ln(c,apex,I(0,0,ZA+2.2),'#cfd8e2',u*0.18);[0.7,1.4].forEach(h=>TH.ell(c,...I(0,0,ZA+h),u*(0.5-h*0.12),u*0.2,'#2f7fd8'));const sp=I(0,0,ZA+2.5);TH.ell(c,sp[0],sp[1],u*0.24,u*0.24,'#2f7fd8');GLOW(c,sp[0],sp[1],u*1.9,'120,190,255',0.55);
  /* a couple of sleek planters by the door */
  [[-5.8,5.0],[5.6,5.6]].forEach(([X,Y])=>{const p=I(X,Y,0);TH.ell(c,p[0],p[1],u*0.95,u*0.36,'#f6f9fb');TH.ell(c,p[0],p[1]-u*0.35,u*0.8,u*0.3,'#ffffff');TH.ell(c,p[0],p[1]-u*0.9,u*0.5,u*0.5,'#7ad05a');TH.ell(c,p[0],p[1]-u*0.9,u*0.5,u*0.2,'#9ae070');});}};

/* ===== RESTAURANT ART, batch 4 ===== */
/* ---- FRONTIER: a national-park style log lodge (peeled logs, river-stone chimney, wide covered porch, green roof, antlers in the gable) ---- */
RESTAURANT_ART.frontier={dy:0.05,k:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),log='#a5683a',logD='#7a4a26';RSH_(c,x,y+u*0.6,u*8.6,u*3.6,'30,36,20');
  /* stacked-log walls with round ends at the corners */
  JBOX(c,x,y,u,-5.0,5.0,-3.0,3.0,0,4.4,log);for(let z=0.0;z<4.4;z+=0.55){TH.ln(c,I(-5.0,3.0,z),I(5.0,3.0,z),logD,u*0.08);TH.ln(c,I(5.0,-3.0,z),I(5.0,3.0,z),logD,u*0.08);TH.ln(c,I(-5.0,3.0,z+0.27),I(5.0,3.0,z+0.27),'rgba(255,220,160,.18)',u*0.07);}
  for(let z=0.27;z<4.4;z+=0.55){const p=I(5.0,3.0,z);TH.ell(c,p[0],p[1],u*0.22,u*0.24,'#c88a52');TH.ell(c,p[0],p[1],u*0.1,u*0.11,logD);const q=I(-5.0,3.0,z);TH.ell(c,q[0],q[1],u*0.22,u*0.24,'#c88a52');TH.ell(c,q[0],q[1],u*0.1,u*0.11,logD);}
  [-3.5,-1.6,1.6,3.5].forEach(X=>{RWINDOW(c,I,3.03,X,2.4,1.0,1.3,'#ffd27a','#6a3e1e');TH.ln(c,I(X,3.05,1.75),I(X,3.05,3.05),'#6a3e1e',u*0.07);});
  BP(c,[I(-0.9,3.04,0),I(0.9,3.04,0),I(0.9,3.04,2.6),I(-0.9,3.04,2.6)],'#5a321a');BP(c,[I(-0.72,3.06,0),I(0.72,3.06,0),I(0.72,3.06,2.4),I(-0.72,3.06,2.4)],'#8a5230');for(let k=0;k<4;k++)TH.ln(c,I(-0.72,3.07,0.4+k*0.55),I(0.72,3.07,0.4+k*0.55),'rgba(40,20,8,.4)',u*0.06);
  /* green metal roof with a big central gable and a timber truss face */
  const z0=4.4,H=3.7,GR='#3f6a4e',GRD='#2e4f3a';GAB(c,I,-5.5,5.5,-3.5,3.5,z0,H,0.6,GR,'#3a4a3a',u,0);
  RCLIP(c,[I(-6.1,4.1,z0),I(6.1,4.1,z0),I(6.1,0,z0+H),I(-6.1,0,z0+H)],()=>{for(let k=0;k<22;k++){const t=k/21,a=I(-6.1+12.2*t,4.1,z0),b=I(-6.1+12.2*t,0,z0+H);TH.ln(c,a,b,k%2?'rgba(20,50,34,.4)':'rgba(255,255,255,.1)',u*0.09);}});
  BP(c,[I(-2.2,3.5,z0+0.4),I(2.2,3.5,z0+0.4),I(0,3.5,z0+3.1)],'#b87c48');TH.ln(c,I(-2.2,3.5,z0+0.4),I(0,3.5,z0+3.1),logD,u*0.24);TH.ln(c,I(2.2,3.5,z0+0.4),I(0,3.5,z0+3.1),logD,u*0.24);TH.ln(c,I(-2.2,3.5,z0+0.4),I(2.2,3.5,z0+0.4),logD,u*0.24);TH.ln(c,I(0,3.5,z0+0.4),I(0,3.5,z0+3.0),logD,u*0.18);TH.ln(c,I(-1.1,3.5,z0+0.4),I(0,3.5,z0+1.8),logD,u*0.14);TH.ln(c,I(1.1,3.5,z0+0.4),I(0,3.5,z0+1.8),logD,u*0.14);
  BP(c,[I(2.2,2.0,z0+0.4),I(2.2,3.6,z0+0.4),I(0,3.6,z0+3.1),I(0,2.0,z0+3.1)],GR);
  const at=I(0,3.6,z0+1.4);TH.ln(c,[at[0],at[1]+u*0.2],[at[0]-u*0.8,at[1]-u*0.5],'#e8dcc0',u*0.12);TH.ln(c,[at[0],at[1]+u*0.2],[at[0]+u*0.8,at[1]-u*0.5],'#e8dcc0',u*0.12);TH.ln(c,[at[0]-u*0.5,at[1]-u*0.2],[at[0]-u*0.7,at[1]-u*1.0],'#e8dcc0',u*0.09);TH.ln(c,[at[0]+u*0.5,at[1]-u*0.2],[at[0]+u*0.7,at[1]-u*1.0],'#e8dcc0',u*0.09);TH.ell(c,at[0],at[1]+u*0.25,u*0.3,u*0.22,'#e8dcc0');
  /* covered porch with log posts, a railing, rocking chairs and firewood */
  BT(c,I,-5.4,5.4,3.0,5.6,0.3,'#8a5a30');for(let k=0;k<12;k++)TH.ln(c,I(-5.4+k*0.98,3.0,0.3),I(-5.4+k*0.98,5.6,0.3),'rgba(40,20,8,.3)',u*0.05);BF(c,I,-5.4,5.4,5.6,0,0.3,'#6a4326');
  [-5.2,-2.6,0,2.6,5.2].forEach(X=>RPOST(c,I,X,5.4,0.3,3.6,'#8a5a30',u,0.38));TH.ln(c,I(-5.4,5.4,1.4),I(5.4,5.4,1.4),'#8a5a30',u*0.2);TH.ln(c,I(5.4,3.0,1.4),I(5.4,5.4,1.4),'#8a5a30',u*0.2);for(let k=0;k<9;k++)RPOST(c,I,-4.8+k*1.2,5.4,0.3,1.4,'#7a4a26',u,0.12);
  const pA=I(-5.8,6.0,3.6),pB=I(5.8,6.0,3.6),pC=I(5.8,3.0,4.3),pD=I(-5.8,3.0,4.3);BP(c,[pA,pB,pC,pD],GR);TH.ln(c,pA,pB,GRD,u*0.18);for(let k=0;k<18;k++){const t=k/17;TH.ln(c,[pA[0]+(pB[0]-pA[0])*t,pA[1]+(pB[1]-pA[1])*t],[pD[0]+(pC[0]-pD[0])*t,pD[1]+(pC[1]-pD[1])*t],k%2?'rgba(20,50,34,.3)':'rgba(255,255,255,.1)',u*0.08);}
  [-3.6,3.2].forEach((X,i)=>{const p=I(X,4.5,0.3);TH.ln(c,[p[0]-u*0.5,p[1]],[p[0]-u*0.4,p[1]-u*1.0],'#7a4a26',u*0.12);TH.ln(c,[p[0]+u*0.5,p[1]],[p[0]+u*0.4,p[1]-u*1.0],'#7a4a26',u*0.12);TH.poly(c,[[p[0]-u*0.5,p[1]-u*0.5],[p[0]+u*0.5,p[1]-u*0.5],[p[0]+u*0.45,p[1]-u*1.8],[p[0]-u*0.45,p[1]-u*1.8]],'#b84a32');TH.ell(c,p[0],p[1]-u*0.6,u*0.5,u*0.18,'#6a2a1a');TH.ln(c,[p[0]-u*0.7,p[1]+u*0.3],[p[0]+u*0.7,p[1]+u*0.1],'#5a3a1e',u*0.1);});
  JBOX(c,x,y,u,4.0,5.0,3.4,4.6,0.3,1.3,'#b88a52');for(let k=0;k<5;k++)TH.ell(c,I(4.4,3.38,0.5+k*0.2)[0],I(4.4,3.38,0.5+k*0.2)[1],u*0.18,u*0.12,'#d8a870');
  /* river-stone chimney up the right end */
  JBOX(c,x,y,u,4.9,6.3,-1.0,1.0,0,9.6,'#8d8e88');for(let k=0;k<26;k++){const z=0.3+((k*0.37)%9),Y=-0.8+((k*0.53)%1.6);TH.ell(c,...I(6.3,Y,z),u*0.34,u*0.26,['#9a9a94','#7f807a','#a8a8a0','#6f706a'][k%4],0.3);}JBOX(c,x,y,u,4.8,6.4,-1.1,1.1,9.6,10.1,'#707068');
  const sm=I(5.6,0,10.9);for(let k=0;k<4;k++)TH.ell(c,sm[0]+k*u*0.35,sm[1]-k*u*0.8,u*(0.5+k*0.18),u*(0.34+k*0.12),'rgba(235,235,240,'+(0.58-k*0.12)+')');
  RLANTERN(c,...I(-5.2,5.4,3.4),u*1.0);RLANTERN(c,...I(5.2,5.4,3.4),u*1.0);}};

/* ---- FIESTA: a colourful casita (bright plaster, barrel-tile awning, shuttered windows, papel picado, marigolds, a little sugar skull) ---- */
RESTAURANT_ART.fiesta={dy:0.05,k:1.12,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),pink='#e0468e',turq='#2ab0b8',yel='#f2c230',orange='#f08a30';RSH_(c,x,y+u*0.6,u*8.4,u*3.5,'50,30,30');
  /* main casita (hot pink) with a turquoise side wing and a courtyard wall */
  JBOX(c,x,y,u,-4.6,2.4,-3.0,2.6,0,4.2,pink);JBOX(c,x,y,u,2.4,5.2,-2.4,2.4,0,3.0,turq);
  BF(c,I,-4.6,2.4,2.6,3.4,4.2,'#ffffff');for(let k=0;k<14;k++)TH.poly(c,[I(-4.6+k*0.5,2.61,3.4),I(-4.35+k*0.5,2.61,3.4),I(-4.475+k*0.5,2.61,3.12)],k%2?yel:turq);
  BT(c,I,-4.6,2.4,-3.0,2.6,4.2,'#d9a06a');JBOX(c,x,y,u,-4.8,-4.4,-3.2,2.4,4.2,4.8,'#ffe9f2');JBOX(c,x,y,u,-4.8,2.6,2.4,2.8,4.2,4.8,'#ffe9f2');JBOX(c,x,y,u,2.2,2.6,-3.2,2.4,4.2,4.8,'#ffe9f2');BT(c,I,2.4,5.2,-2.4,2.4,3.0,'#d9a06a');JBOX(c,x,y,u,2.2,5.4,2.2,2.6,3.0,3.55,'#e6fbfb');JBOX(c,x,y,u,5.0,5.4,-2.6,2.4,3.0,3.55,'#e6fbfb');
  /* arched doorway with a blue door, framed in yellow */
  const door=(X)=>{const w=0.95;const pts=[I(X-w,2.64,0),I(X+w,2.64,0),I(X+w,2.64,2.0)];c.beginPath();c.moveTo(pts[0][0],pts[0][1]);c.lineTo(pts[1][0],pts[1][1]);c.lineTo(pts[2][0],pts[2][1]);for(let k=0;k<=10;k++){const a=Math.PI*k/10,q=I(X+w*Math.cos(a),2.64,2.0+w*Math.sin(a));c.lineTo(q[0],q[1]);}c.closePath();c.fillStyle=yel;c.fill();const w2=0.75;c.beginPath();c.moveTo(...I(X-w2,2.66,0));c.lineTo(...I(X+w2,2.66,0));c.lineTo(...I(X+w2,2.66,1.95));for(let k=0;k<=10;k++){const a=Math.PI*k/10,q=I(X+w2*Math.cos(a),2.66,1.95+w2*Math.sin(a));c.lineTo(q[0],q[1]);}c.closePath();c.fillStyle='#2a5ab8';c.fill();TH.ln(c,I(X,2.68,0.05),I(X,2.68,2.6),'rgba(10,20,60,.5)',u*0.07);TH.ell(c,...I(X+0.35,2.68,1.1),u*0.1,u*0.1,yel);};door(-1.0);
  /* shuttered windows with flower boxes */
  [[-3.4,2.2],[0.9,2.2]].forEach(([X,Z],i)=>{RWINDOW(c,I,2.63,X,Z,0.9,1.2,'#ffd27a','#fff3d0');BP(c,[I(X-1.15,2.64,Z-0.65),I(X-0.55,2.64,Z-0.65),I(X-0.55,2.64,Z+0.65),I(X-1.15,2.64,Z+0.65)],yel);BP(c,[I(X+0.55,2.64,Z-0.65),I(X+1.15,2.64,Z-0.65),I(X+1.15,2.64,Z+0.65),I(X+0.55,2.64,Z+0.65)],yel);JBOX(c,x,y,u,X-0.65,X+0.65,2.64,3.1,Z-1.0,Z-0.65,'#8a5a30');for(let k=0;k<4;k++)TH.ell(c,...I(X-0.45+k*0.3,2.9,Z-0.5),u*0.16,u*0.18,[orange,'#d9433b',yel,orange][k]);});
  RWINDOW(c,I,2.43,3.2,1.6,0.9,1.2,'#ffd27a','#e6fbfb');RWINDOW(c,I,2.43,4.4,1.6,0.8,1.2,'#ffd27a','#e6fbfb');
  /* a sugar skull painted on the pink wall above the door */
  const sk=I(-1.0,2.67,3.25);TH.ell(c,sk[0],sk[1],u*0.55,u*0.55,'#fff6e6');TH.ell(c,sk[0],sk[1]+u*0.45,u*0.35,u*0.3,'#fff6e6');[-1,1].forEach(s=>{TH.ell(c,sk[0]+s*u*0.2,sk[1]-u*0.05,u*0.17,u*0.17,'#2a1a40');TH.ell(c,sk[0]+s*u*0.2,sk[1]-u*0.05,u*0.08,u*0.08,orange);});TH.poly(c,[[sk[0]-u*0.07,sk[1]+u*0.15],[sk[0]+u*0.07,sk[1]+u*0.15],[sk[0],sk[1]+u*0.28]],'#2a1a40');for(let k=0;k<5;k++)TH.ln(c,[sk[0]-u*0.2+k*u*0.1,sk[1]+u*0.5],[sk[0]-u*0.2+k*u*0.1,sk[1]+u*0.68],'#2a1a40',u*0.05);for(let k=0;k<5;k++)TH.ell(c,sk[0]+Math.cos(k*1.256)*u*0.55,sk[1]-u*0.2+Math.sin(k*1.256)*u*0.45,u*0.12,u*0.12,[orange,yel,'#e0468e',turq,yel][k]);
  /* barrel-tile awning over the door and a terracotta tile eave on the wing */
  const tA=I(-2.6,4.0,2.8),tB=I(0.6,4.0,2.8),tC=I(0.6,2.6,3.5),tD=I(-2.6,2.6,3.5);BP(c,[tA,tB,tC,tD],'#c2603a');for(let k=0;k<14;k++){const t=k/13;TH.ln(c,[tD[0]+(tC[0]-tD[0])*t,tD[1]+(tC[1]-tD[1])*t],[tA[0]+(tB[0]-tA[0])*t,tA[1]+(tB[1]-tA[1])*t],k%2?'#e07a4a':'#a24a2a',u*0.22);}TH.ln(c,tA,tB,'#8a3a1e',u*0.14);[-2.4,0.4].forEach(X=>RPOST(c,I,X,3.9,0,2.8,'#8a5a30',u,0.2));
  const eA=I(1.8,2.8,3.3),eB=I(5.8,2.8,3.3),eC=I(5.8,2.0,3.9),eD=I(1.8,2.0,3.9);BP(c,[eA,eB,eC,eD],'#c2603a');for(let k=0;k<9;k++){const t=k/8;TH.ln(c,[eD[0]+(eC[0]-eD[0])*t,eD[1]+(eC[1]-eD[1])*t],[eA[0]+(eB[0]-eA[0])*t,eA[1]+(eB[1]-eA[1])*t],k%2?'#e07a4a':'#a24a2a',u*0.2);}
  /* marigold garland round the door, pots, a cactus, a small fountain-less patio bench */
  for(let k=0;k<22;k++){const a=Math.PI*(k/21),p=I(-1.0+Math.cos(a)*1.3,2.7,2.0+Math.sin(a)*1.3);TH.ell(c,p[0],p[1],u*0.16,u*0.16,k%2?orange:yel);}
  [[-3.8,4.6,1],[-3.2,5.3,0.8],[5.8,3.8,0.9]].forEach(([X,Y,s],i)=>{const p=I(X,Y,0);EGCYL_(c,p[0],p[1],u*0.55*s,u*0.22*s,u*1.0*s,['#e07a4a','#c2603a','#8a3a1e']);for(let j=0;j<4;j++)TH.ell(c,p[0]+(j-1.5)*u*0.2*s,p[1]-u*1.3*s,u*0.2,u*0.2,[orange,'#d9433b',yel,pink][j]);});
  const cc=I(6.0,5.2,0);TH.ln(c,[cc[0],cc[1]],[cc[0],cc[1]-u*2.6],'#3f8a45',u*0.5);TH.ln(c,[cc[0]-u*0.5,cc[1]-u*1.4],[cc[0]-u*0.5,cc[1]-u*2.2],'#3f8a45',u*0.36);TH.ln(c,[cc[0]-u*0.5,cc[1]-u*1.4],[cc[0],cc[1]-u*1.4],'#3f8a45',u*0.3);TH.ln(c,[cc[0]+u*0.5,cc[1]-u*1.8],[cc[0]+u*0.5,cc[1]-u*2.6],'#3f8a45',u*0.36);TH.ln(c,[cc[0]+u*0.5,cc[1]-u*1.8],[cc[0],cc[1]-u*1.8],'#3f8a45',u*0.3);TH.ell(c,cc[0],cc[1]-u*2.7,u*0.2,u*0.2,'#e0468e');}};

/* ---- NORDIC: a viking mead hall (long timber hall, turf-and-shingle roof, crossed dragon heads, round shields, carved doorway, torches) ---- */
RESTAURANT_ART.nordic={dy:0.05,k:1.12,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),wood='#5e4128',woodL='#7a5634';RSH_(c,x,y+u*0.6,u*9.0,u*3.4,'20,30,24');
  JBOX(c,x,y,u,-6.0,6.0,-2.8,2.8,0,3.0,wood);for(let k=0;k<26;k++){TH.ln(c,I(-6.0+k*0.46,2.8,0),I(-6.0+k*0.46,2.8,3.0),'rgba(20,10,4,.45)',u*0.08);}for(let k=0;k<12;k++)TH.ln(c,I(6.0,-2.8+k*0.5,0),I(6.0,-2.8+k*0.5,3.0),'rgba(20,10,4,.45)',u*0.07);
  /* round shields hung along the eaves */
  ['#b83a2a','#e8dcc0','#2a5ab8','#d8a020','#b83a2a','#e8dcc0','#2a5ab8','#d8a020','#b83a2a','#e8dcc0'].forEach((col,i)=>{const p=I(-5.4+i*1.2,2.84,2.1);TH.ell(c,p[0],p[1],u*0.55,u*0.55,'#2a2018');TH.ell(c,p[0],p[1],u*0.46,u*0.46,col);TH.ell(c,p[0],p[1],u*0.16,u*0.16,'#c8c8d0');TH.ln(c,[p[0]-u*0.4,p[1]],[p[0]+u*0.4,p[1]],'rgba(0,0,0,.3)',u*0.06);TH.ln(c,[p[0],p[1]-u*0.4],[p[0],p[1]+u*0.4],'rgba(0,0,0,.3)',u*0.06);});
  [-4.0,0.0,4.0].forEach(X=>{RWINDOW(c,I,2.82,X,1.0,0.7,0.6,'#ffcf70','#3a2a18');});
  /* the carved gable porch with knotwork posts */
  JBOX(c,x,y,u,-1.8,1.8,2.8,4.0,0,3.4,woodL);BP(c,[I(-1.2,4.02,0),I(1.2,4.02,0),I(1.2,4.02,2.4),I(0,4.02,3.0),I(-1.2,4.02,2.4)],'#1c1208');GLOW(c,...I(0,4.1,1.4),u*2.6,'255,170,70',0.55);TH.ln(c,I(0,4.05,0),I(0,4.05,2.9),'rgba(90,50,16,.6)',u*0.08);
  [-1.6,1.6].forEach(X=>{RPOST(c,I,X,4.1,0,3.4,'#8a6238',u,0.4);for(let z=0.4;z<3.2;z+=0.8){TH.ell(c,...I(X,4.12,z),u*0.22,u*0.18,'#c8a060');TH.ell(c,...I(X,4.12,z),u*0.1,u*0.08,'#3a2a14');}});
  BP(c,[I(-2.4,4.05,3.4),I(2.4,4.05,3.4),I(0,4.05,5.6)],woodL);TH.ln(c,I(-2.4,4.05,3.4),I(0,4.05,5.6),'#3a2410',u*0.3);TH.ln(c,I(2.4,4.05,3.4),I(0,4.05,5.6),'#3a2410',u*0.3);for(let k=0;k<6;k++){const p=I(-1.5+k*0.6,4.07,3.5+Math.min(k,5-k)*0.45);TH.ell(c,p[0],p[1],u*0.12,u*0.12,'#c8a060');}
  BP(c,[I(2.4,2.8,3.4),I(2.4,4.1,3.4),I(0,4.1,5.6),I(0,2.8,5.6)],'#3e5a3e');
  /* the long roof: shingles below, a turf ridge above, curved eaves */
  const z0=3.0,H=3.4,A=I(-6.6,3.6,z0),B=I(6.6,3.6,z0),R1=I(6.6,0,z0+H),R0=I(-6.6,0,z0+H);BP(c,[I(6.0,-2.8,z0),I(6.0,2.8,z0),I(6.0,0,z0+H*0.9)],'#4a3220');BP(c,[A,B,R1,R0],'#5a3e26');
  RCLIP(c,[A,B,R1,R0],()=>{for(let r=0;r<6;r++){const t=(r+0.5)/6;for(let k=0;k<30;k++){const px=A[0]+(B[0]-A[0])*(k/30+(r%2)*0.016)+(R0[0]-A[0])*t,py=A[1]+(B[1]-A[1])*(k/30)+(R0[1]-A[1])*t;c.fillStyle=(k+r)%2?'rgba(0,0,0,.14)':'rgba(255,230,180,.1)';c.beginPath();c.ellipse(px+u*0.2,py,u*0.2,u*0.3,0,0,Math.PI);c.fill();}}c.fillStyle='#4f7a3a';c.beginPath();c.moveTo(R0[0],R0[1]);c.lineTo(R1[0],R1[1]);c.lineTo(R1[0],R1[1]+u*0.9);c.lineTo(R0[0],R0[1]+u*0.9);c.closePath();c.fill();for(let k=0;k<60;k++)TH.ln(c,[R0[0]+(R1[0]-R0[0])*k/59,R0[1]+(R1[1]-R0[1])*k/59+u*0.5],[R0[0]+(R1[0]-R0[0])*k/59+u*0.05,R0[1]+(R1[1]-R0[1])*k/59-u*0.15],k%2?'#6a9a48':'#3f6a2e',u*0.12);});
  TH.ln(c,A,B,'#3a2410',u*0.22);TH.ln(c,R0,R1,'#3a2410',u*0.2);
  /* a smoke hole and a dragon head at each ridge end (crossed finials) */
  const smk=I(2.0,0,z0+H*0.98);TH.ell(c,smk[0],smk[1],u*0.5,u*0.22,'#1c1208');for(let k=0;k<4;k++)TH.ell(c,smk[0]+k*u*0.3,smk[1]-u*0.5-k*u*0.8,u*(0.5+k*0.2),u*(0.34+k*0.13),'rgba(230,230,236,'+(0.6-k*0.13)+')');
  const drg=(p,dir)=>{c.save();c.translate(p[0],p[1]);c.scale(dir,1);c.strokeStyle='#4a2e18';c.lineWidth=u*0.34;c.lineCap='round';c.beginPath();c.moveTo(0,u*0.4);c.quadraticCurveTo(u*0.9,-u*0.6,u*0.6,-u*1.9);c.quadraticCurveTo(u*0.5,-u*2.6,u*1.3,-u*2.7);c.stroke();TH.ell(c,u*1.45,-u*2.75,u*0.5,u*0.3,'#5a3a20',-0.3);TH.poly(c,[[u*1.2,-u*2.95],[u*1.0,-u*3.6],[u*1.5,-u*3.0]],'#5a3a20');TH.ell(c,u*1.5,-u*2.8,u*0.07,u*0.07,'#f2c230');c.strokeStyle='#8a6238';c.lineWidth=u*0.1;c.beginPath();c.moveTo(0,u*0.2);c.quadraticCurveTo(u*0.8,-u*0.7,u*0.5,-u*1.8);c.stroke();c.restore();};drg(I(6.6,0,z0+H),1);drg(I(-6.6,0,z0+H),-1);
  /* torches, barrels, a chopping block with an axe, a drinking horn sign */
  [[-2.8,5.0],[2.8,5.0]].forEach(([X,Y])=>{const p=I(X,Y,0);RTORCH(c,p[0],p[1],u,u*3.0);});
  [[5.6,4.6],[6.4,3.8],[-5.9,4.4]].forEach(([X,Y],i)=>{const p=I(X,Y,0);RBARREL(c,p[0],p[1],u*1.1,i===1?'#7a5230':'#8a5a30');});
  const ax=I(-4.4,5.6,0);TH.ell(c,ax[0],ax[1],u*0.6,u*0.22,'#4a3220');JBOX(c,x,y,u,-4.9,-3.9,5.1,6.1,0,0.7,'#7a5634');TH.ln(c,[ax[0],ax[1]-u*0.5],[ax[0]+u*0.5,ax[1]-u*1.8],'#6a4a28',u*0.12);TH.poly(c,[[ax[0]+u*0.3,ax[1]-u*1.8],[ax[0]+u*1.0,ax[1]-u*1.9],[ax[0]+u*0.9,ax[1]-u*1.2],[ax[0]+u*0.4,ax[1]-u*1.3]],'#b8bcc8');
  const hs=I(3.2,4.2,3.6);TH.ln(c,[hs[0],hs[1]-u*0.3],[hs[0],hs[1]],'#2a1a10',u*0.08);c.fillStyle='#e8dcc0';c.beginPath();c.moveTo(hs[0]-u*0.5,hs[1]+u*0.1);c.quadraticCurveTo(hs[0]-u*0.3,hs[1]+u*1.3,hs[0]+u*0.5,hs[1]+u*0.8);c.quadraticCurveTo(hs[0]+u*0.1,hs[1]+u*0.5,hs[0]+u*0.5,hs[1]+u*0.1);c.closePath();c.fill();TH.ln(c,[hs[0]-u*0.5,hs[1]+u*0.1],[hs[0]+u*0.5,hs[1]+u*0.1],'#c8a020',u*0.14);}};

/* ---- STANDARD (unthemed): a bright park pavilion with a glazed front, gabled roof, awning and umbrella tables ---- */
RESTAURANT_ART.standard={dy:0.05,k:1,draw(c,x,y,u,v,acc){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),A=acc||'#f59e0b';RSH_(c,x,y+u*0.6,u*8.4,u*3.5,'30,34,40');
  JBOX(c,x,y,u,-5.0,5.0,-3.0,3.0,0,3.6,'#f0eee6');BP(c,[I(-4.6,3.02,0.4),I(4.6,3.02,0.4),I(4.6,3.02,3.0),I(-4.6,3.02,3.0)],'#2a3a52');const gp=[I(-4.4,3.04,0.55),I(4.4,3.04,0.55),I(4.4,3.04,2.85),I(-4.4,3.04,2.85)];const ys=gp.map(p=>p[1]),gg=c.createLinearGradient(0,Math.min(...ys),0,Math.max(...ys));gg.addColorStop(0,'#cfeaf4');gg.addColorStop(1,'#7fbdd6');BP(c,gp,gg);GLOW(c,...I(0,3.1,1.7),u*3.5,'255,226,150',0.3);for(let k=1;k<8;k++)TH.ln(c,I(-4.4+k*1.1,3.05,0.55),I(-4.4+k*1.1,3.05,2.85),'#f8f8f4',u*0.1);TH.ln(c,I(-4.4,3.05,1.7),I(4.4,3.05,1.7),'#f8f8f4',u*0.08);
  const z0=3.6,H=2.3;GAB(c,I,-5.4,5.4,-3.4,3.4,z0,H,0.5,A,shade(A,-0.25),u,5);
  RSTRIPE(c,I(-5.2,3.0,3.1),I(5.2,3.0,3.1),I(5.2,4.5,2.4),I(-5.2,4.5,2.4),12,'#fffaf0',A);[-5.0,-1.7,1.7,5.0].forEach(X=>RPOST(c,I,X,4.4,0,2.5,'#f8f6ee',u,0.2));
  [[-3.2,6.0],[0.8,6.4],[4.2,5.9]].forEach(([X,Y],i)=>{const p=I(X,Y,0);RTABLE(c,p[0],p[1],u,'#ffffff');RUMBRELLA(c,p[0],p[1],u,A,'#fffaf0');});
  [[-5.8,5.0],[5.8,4.6]].forEach(([X,Y])=>{const p=I(X,Y,0);TH.ell(c,p[0],p[1],u*0.8,u*0.3,'#8a6a46');TH.ell(c,p[0],p[1]-u*0.8,u*0.7,u*0.6,'#5aa84a');TH.ell(c,p[0]-u*0.2,p[1]-u*1.0,u*0.35,u*0.3,'#7acb60');});}};

/* ===== RESTAURANT PACK API (same shape as the weenie pack) ===== */
const RESTAURANT_U=0.0975;
const RESTAURANT_DX={standard:0.11,western:0.10,medieval:0.03,bavarian:0.09,jungle:0.11,tiki:0.11,caribbean:0.095,alps:0.12,gothic:0.05,classic:0.11,americana:0.04,space:0,retro:0.13,frontier:0.10,fiesta:0.085,nordic:0.07};   /* horizontal nudge (in R) that centres each building on the hex */
const RESTAURANT_ALIAS={wild_west:'western',classic_midway:'classic',classicmidway:'classic',retro_future:'retro',retrofuture:'retro',alpine:'alps',unthemed:'standard',default:'standard',german:'bavarian',viking:'nordic',latin:'fiesta',mexican:'fiesta',pirate:'caribbean'};
function restaurantTheme(t){t=String(t||'standard').toLowerCase();return RESTAURANT_ALIAS[t]||t;}
/* drawRestaurant(ctx, cx, cy, R, {theme, flip, scale, dy}): (cx,cy) = centre of the hex tile, R = hex radius in px. Static, one hex, no ground. */
function drawRestaurant(ctx,cx,cy,R,opts){opts=opts||{};const th=restaurantTheme(opts.theme),T=RESTAURANT_ART[th];if(!T)throw new Error('unknown restaurant theme: '+opts.theme);
  const S=opts.scale||1,u=R*RESTAURANT_U*S*(T.k||1),dy=(opts.dy===undefined?T.dy:opts.dy)*R;ctx.save();if(opts.flip){ctx.translate(cx,0);ctx.scale(-1,1);ctx.translate(-cx,0);}T.draw(ctx,cx+(opts.dx===undefined?(RESTAURANT_DX[th]||0):opts.dx)*R,cy+dy,u,opts.v===undefined?0:opts.v,opts.accent);ctx.restore();}
const RESTAURANT_BAKE_CACHE={};
/* bakeRestaurant(theme, R, {scale, flip, pixelRatio}) -> {canvas, ox, oy, w, h, bbox}: a transparent sprite cropped to its painted pixels; (ox,oy) = where the hex centre sits inside the canvas */
function bakeRestaurant(theme,R,opts){opts=opts||{};const th=restaurantTheme(theme),pr=opts.pixelRatio||1,S=opts.scale||1,key=[th,R,S,!!opts.flip,pr,opts.accent||''].join('|');if(RESTAURANT_BAKE_CACHE[key])return RESTAURANT_BAKE_CACHE[key];
  const W=Math.ceil(R*4.2*pr),H=Math.ceil(R*5.0*pr),ax=W/2,ay=H*0.76,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');c.scale(pr,pr);drawRestaurant(c,ax/pr,ay/pr,R,{theme:th,scale:S,flip:opts.flip,accent:opts.accent});
  const d=cv.getContext('2d').getImageData(0,0,W,H).data;let x0=W,y0=H,x1=0,y1=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(d[(y*W+x)*4+3]>8){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}}
  const pad=2,bx=Math.max(0,x0-pad),by=Math.max(0,y0-pad),bw=Math.min(W,x1+pad+1)-bx,bh=Math.min(H,y1+pad+1)-by,out=document.createElement('canvas');out.width=bw;out.height=bh;out.getContext('2d').drawImage(cv,bx,by,bw,bh,0,0,bw,bh);
  return RESTAURANT_BAKE_CACHE[key]={canvas:out,ox:(ax-bx)/pr,oy:(ay-by)/pr,w:bw/pr,h:bh/pr,pixelRatio:pr,bbox:{left:-(ax-bx)/pr,top:-(ay-by)/pr,right:(bx+bw-ax)/pr,bottom:(by+bh-ay)/pr}};}
function drawRestaurantBaked(ctx,cx,cy,sprite){ctx.drawImage(sprite.canvas,cx-sprite.ox,cy-sprite.oy,sprite.w,sprite.h);}
function restaurantFootprint(R,theme,opts){return bakeRestaurant(theme,R,opts).bbox;}
window.RESTAURANT_FACILITY_ART={draw:drawRestaurant,drawBaked:drawRestaurantBaked,bake:bakeRestaurant};
})();
