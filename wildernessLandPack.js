(function() {
"use strict";
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

const W3=Math.sqrt(3),HX=W3/2,HV=[[HX,0.29],[0,0.58],[-HX,0.29],[-HX,-0.29],[0,-0.58],[HX,-0.29]];
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[0,1,2],[-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5,1.5]],C:[[0],[-0.5,0.5,1.5],[-1,0,1],[-0.5]],D:[[0,1,2],[-0.5,0.5,1.5],[0,1]]};
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


const NT=5;                                                         /* five scenery tiers in these packs */
const FLIP=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
const BX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.28),shade(col,0.16));
const SHD=(c,x,y,rx,rgb)=>{c.fillStyle='rgba('+(rgb||'70,44,18')+',.26)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const SOFT=(c,x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
const segDist=(x,y,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy;let t=l?((x-a[0])*dx+(y-a[1])*dy)/l:0;t=Math.max(0,Math.min(1,t));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);};
/* an irregular amoeba outline (closed polygon, game units) from a few random harmonics; rx, ry are the maximum half-extents */
function amoeba(cx,cy,rx,ry,seed,n,amp){amp=amp||1;const r=mulberry(seed),h=[[2,(0.2+r()*0.14)*amp,r()*6.28],[3,(0.14+r()*0.12)*amp,r()*6.28],[5,(0.07+r()*0.06)*amp,r()*6.28]],pts=[];n=n||28;let mx=0;const rad=[];for(let k=0;k<n;k++){const a=k/n*6.2832;let q=1;h.forEach(([f,amp,ph])=>q+=amp*Math.sin(f*a+ph));rad.push(q);mx=Math.max(mx,q);}
  for(let k=0;k<n;k++){const a=k/n*6.2832,q=rad[k]/mx;pts.push([cx+Math.cos(a)*rx*q,cy+Math.sin(a)*ry*q]);}return pts;}
function pathPoly(c,pts,close){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));if(close!==false)c.closePath();}
function smoothClosed(c,pts){const n=pts.length;c.beginPath();for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n],m=[(a[0]+b[0])/2,(a[1]+b[1])/2];if(i===0){const l=pts[n-1],m0=[(l[0]+a[0])/2,(l[1]+a[1])/2];c.moveTo(m0[0],m0[1]);}c.quadraticCurveTo(a[0],a[1],m[0],m[1]);}c.closePath();}
const inPoly=(p,x,y)=>{let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;};

/* ===== PLANNER TOOLKIT (shared by Egypt and Babylon): placement rules, tier assignment, layering ===== */

/* ===== WILDERNESS PACK: an expansion plot shown as wild forest, one sprite per land shape (A, B, C, D), NO tiers ===== */
function wcPick(w,r){let t=0;for(const k in w)t+=w[k];let q=r()*t;for(const k in w){q-=w[k];if(q<=0)return k;}return Object.keys(w)[0];}
const WILD_CACHE=new Map();
const WILD_CACHE_LIMIT=128*1024*1024;
let wildCacheBytes=0;
function cacheWilderness(key,land){
  const bytes=4*(land.back.width*land.back.height+land.front.width*land.front.height);
  if(bytes>WILD_CACHE_LIMIT)return land;
  while(wildCacheBytes+bytes>WILD_CACHE_LIMIT&&WILD_CACHE.size){
    const oldest=WILD_CACHE.keys().next().value,entry=WILD_CACHE.get(oldest);
    wildCacheBytes-=entry.bytes;
    WILD_CACHE.delete(oldest);
  }
  WILD_CACHE.set(key,{land,bytes});
  wildCacheBytes+=bytes;
  return land;
}
/* the campus-map forest recipe, applied inside one land shape:
   jittered candidates, a 0.43 x 0.26 separation ellipse, trees at 1.2-1.75 scale, region-weighted species (conifers deeper in, broadleaf toward the edges),
   a 50% chance of an understory plant at each tree's feet. Every trunk stays inside the shape (edge keep-out) so nothing grows off the land. */
function planWilderness(shape,seed,opts){opts=opts||{};const G=landGeometry(shape),rng=mulberry(seed||({A:5101,B:5202,C:5303,D:5404})[shape]||5107),bb=G.bbox;
  const keep=opts.keep===undefined?0.12:opts.keep,sepX=0.43,sepY=0.26,hexIn=(x,y,s)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,s));
  const outer=G.edges.filter(e=>e.outer),edgeDist=(x,y)=>{let d=1e9;for(const e of outer)d=Math.min(d,segDist(x,y,e.a,e.b));return d;};
  const inLand=(x,y,k)=>hexIn(x,y,1.0)&&(k===undefined||edgeDist(x,y)>=k);
  /* the campus generator's own candidate grid (0.31 x 0.2, jittered), so the density comes out the same as the campus forest (about 6.4 trees per hex of ground) */
  const cand=[];for(let gy=bb.minY-0.2;gy<bb.maxY+0.2;gy+=0.2)for(let gx=bb.minX-0.3;gx<bb.maxX+0.3;gx+=0.31)cand.push([gx+(rng()-0.5)*0.4,gy+(rng()-0.5)*0.26]);
  for(let i=cand.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[cand[i],cand[j]]=[cand[j],cand[i]];}
  const placed=[],objs=[],cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const lastRowY={};G.centers.forEach(c=>{});
  for(const [x,y] of cand){if(!inLand(x,y,keep))continue;if(placed.some(q=>((x-q[0])/sepX)**2+((y-q[1])/sepY)**2<1))continue;placed.push([x,y]);
    const ty=(y-bb.minY)/(bb.maxY-bb.minY),reg=ty<0.33?'top':ty<0.66?'mid':'bottom',w=Object.assign({},CAMPUS_REGION[reg]),cl=0.5+0.5*Math.sin(x*0.55+Math.cos(y*0.4)*1.8)*Math.cos(y*0.35-x*0.2);
    const far=Math.min(1,Math.max(0,(Math.hypot((x-cx)/1.0,(y-cy)*1.5)-0.2)/2.0))*0.5+0.18;                 /* a touch more conifer toward the middle of the plot, more broadleaf at the rim */
    ['spruce','fir','youngSpruce'].forEach(k=>w[k]*=(0.55+1.3*cl)*(1+1.6*(0.5-far*0.6)));['linden','appleTree','beech','birch','maple'].forEach(k=>w[k]*=(0.55+1.3*(1-cl))*(1-0.55*(0.5-far*0.6)));
    const ed=edgeDist(x,y),s=(1.2+rng()*0.55)*(0.88+0.12*Math.min(1,ed/0.45));
    objs.push({k:wcPick(w,rng),x,y,s,v:Math.floor(rng()*1000),tree:true});
    if(rng()<0.5){const ux=x+(rng()-0.5)*0.5,uy=y+0.1+rng()*0.1;if(inLand(ux,uy,0.07))objs.push({k:CAMPUS_UNDER[Math.floor(rng()*CAMPUS_UNDER.length)],x:ux,y:uy,s:0.85+rng()*0.4,v:Math.floor(rng()*1000)});}}
  /* layering as on the campus map: an object is FRONT only when it stands south of every hex of the shape around it */
  objs.forEach(o=>{let my=-1e9;G.centers.forEach(c=>{if(Math.abs(o.x-c.x)<1.5&&c.y>my)my=c.y;});o.layer=o.y>my+0.12?'front':'back';});
  return{G,objs,inLand,edgeDist,trees:objs.filter(o=>o.tree).length};}
function wildGround(c,G,R,ox,oy,m,rng){const P=(x,y)=>[ox+m*x*R,oy+y*R],bb=G.bbox,xs=[m*bb.minX,m*bb.maxX],x0=Math.min(...xs),x1=Math.max(...xs),bw=(x1-x0)*R,bh=(bb.maxY-bb.minY)*R,bx=ox+x0*R,by=oy+bb.minY*R;
  const hexPath=(k)=>{G.centers.forEach(cc=>{HV.forEach((v,i)=>{const p=P(cc.x+v[0]*k,cc.y+v[1]*k);i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);});c.closePath();});};
  const pt=()=>[bx+rng()*bw,by+rng()*bh],AK=G.centers.length*2.6/31,soft=(x,y,rx,ry,rgb,a)=>SOFT(c,x,y,rx,ry,rgb,a);
  /* a faint soft skirt outside the plot so the edge blends into the campus grass, then the grass itself */
  c.save();c.lineJoin='round';c.lineCap='round';const outer=G.edges.filter(e=>e.outer);for(let i=1;i<=5;i++){c.globalAlpha=0.10-i*0.015;c.strokeStyle='#8fbf68';c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a[0],e.a[1]),b=P(e.b[0],e.b[1]);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}c.globalAlpha=1;
  c.beginPath();hexPath(1.012);c.fillStyle='#8fbf68';c.fill();c.save();c.beginPath();hexPath(1.012);c.clip();
  for(let k=0;k<46*AK;k++){const p=pt(),w=R*(0.45+rng()*0.9);soft(p[0],p[1],w,w*0.4,rng()<0.5?'190,230,130':'80,140,60',0.2);}
  for(let k=0;k<40*AK*3;k++){const p=pt(),w=R*(0.7+rng()*1.3);soft(p[0],p[1],w,w*0.42,'58,112,48',0.2);}               /* the deeper forest-floor shade of the campus ground */
  for(let k=0;k<12*AK;k++){const p=pt(),w=R*(0.3+rng()*0.5);soft(p[0],p[1],w,w*0.4,'236,224,140',0.15);}
  for(let k=0;k<8*AK;k++){const p=pt(),w=R*(0.25+rng()*0.4);soft(p[0],p[1],w,w*0.4,'150,116,70',0.14);}
  for(let k=0;k<12*AK;k++){const p=pt(),w=R*(0.3+rng()*0.5);soft(p[0],p[1],w,w*0.4,'255,255,210',0.14);}
  for(let k=0;k<160*AK;k++){const p=pt(),h=R*(0.05+rng()*0.06);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#78b856','#68a84a','#92cc6a'][(k+j)%3],R*0.011);}
  for(let k=0;k<70*AK;k++){const p=pt(),a=rng()*3.14,l=R*(0.03+rng()*0.035);TH.ell(c,p[0],p[1],l,l*0.55,['#e8892a','#f0b83a','#c8402a','#e0a030'][k%4],a);}
  for(let k=0;k<70*AK;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.012,R*0.01,['#f6efe0','#f2c230','#6a8ae8','#f4a6cb','#fff0a0'][k%5]);}
  c.restore();
  c.strokeStyle='rgba(50,92,38,.30)';c.lineWidth=R*0.07;outer.forEach(e=>{const a=P(e.a[0],e.a[1]),b=P(e.b[0],e.b[1]);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();});
  c.restore();}
/* bakeLandWilderness(shape, R, {scale, mirrorX, seed}) -> {back, front, frontRect, w, h, ox, oy, centers, sc, shape, trees}: same fields and anchors as the other land packs (back = ground + trees, front = the southern trees to draw after anything standing on neighbouring hexes) */
function bakeLandWilderness(shape,R,opts){opts=opts||{};const sc=opts.scale||Math.max(1,Math.min(2,(typeof devicePixelRatio==='number'?devicePixelRatio:1))),m=opts.mirrorX?-1:1,key=[shape,R,m,sc,opts.seed||''].join('|'),cached=WILD_CACHE.get(key);if(cached){WILD_CACHE.delete(key);WILD_CACHE.set(key,cached);return cached.land;}
  const plan=planWilderness(shape,opts.seed),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=0.75,top=1.7,bot=0.9;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);g.imageSmoothingQuality='high';return[cv,g];};
  const [back,cb]=mk(),[fullFront,cf0]=mk();wildGround(cb,G,R,ox,oy,m,mulberry(({A:11,B:22,C:33,D:44})[shape]||9));
  const draw=(cx,o)=>{const A=CAMPUS_ASSETS[o.k];if(A)A.draw(cx,ox+m*o.x*R,oy+o.y*R,u*o.s,o.v);};
  plan.objs.slice().sort((a,b)=>a.y-b.y).forEach(o=>{if(o.layer==='back')draw(cb,o);else draw(cf0,o);});
  /* crop the front layer to what is actually painted */
  const d=fullFront.getContext('2d').getImageData(0,0,fullFront.width,fullFront.height).data;let a0=fullFront.width,b0=fullFront.height,a1=0,b1=0;for(let y=0;y<fullFront.height;y++)for(let x=0;x<fullFront.width;x++){if(d[(y*fullFront.width+x)*4+3]>6){if(x<a0)a0=x;if(x>a1)a1=x;if(y<b0)b0=y;if(y>b1)b1=y;}}
  let fx0=0,fy0=0,fw=2,fh=2,front=document.createElement('canvas');front.width=2;front.height=2;
  if(a1>a0){fx0=Math.floor(a0/sc);fy0=Math.floor(b0/sc);fw=Math.ceil((a1+1)/sc)-fx0;fh=Math.ceil((b1+1)/sc)-fy0;front=document.createElement('canvas');front.width=Math.ceil(fw*sc);front.height=Math.ceil(fh*sc);front.getContext('2d').drawImage(fullFront,fx0*sc,fy0*sc,fw*sc,fh*sc,0,0,front.width,front.height);}
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return cacheWilderness(key,{back,front,frontRect:{x:fx0,y:fy0,w:fw,h:fh},w:W,h:H,ox,oy,centers,sc,shape,mirrorX:m<0,trees:plan.trees});}
function drawLandWildernessBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandWildernessFront(ctx,x,y,land){const r=land.frontRect;ctx.drawImage(land.front,x-land.ox+r.x,y-land.oy+r.y,r.w,r.h);}
function landWildernessSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}

function hexPath(c,x,y,R){c.beginPath();[[0.866,0.29],[0,0.58],[-0.866,0.29],[-0.866,-0.29],[0,-0.58],[0.866,-0.29]].forEach((v,i)=>{const px=x+v[0]*R,py=y+v[1]*R;i?c.lineTo(px,py):c.moveTo(px,py);});c.closePath();}
const $=id=>document.getElementById(id);
window.LAND_WILDERNESS_ART = { bake: bakeLandWilderness, drawBack: drawLandWildernessBack, drawFront: drawLandWildernessFront, slots: landWildernessSlots };
})();
