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
const RSH_=(c,x,y,rx,ry,rgb)=>{c.fillStyle='rgba('+(rgb||'40,30,18')+',.24)';c.beginPath();c.ellipse(x+rx*0.1,y+ry*0.2,rx*0.88,(ry||rx*0.4)*0.9,0,0,7);c.fill();};
const RPOST=(c,I,X,Y,z0,z1,col,u,w)=>TH.ln(c,I(X,Y,z0),I(X,Y,z1),col,u*(w||0.22));
const RCLIP=(c,pts,fn)=>{c.save();c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.clip();fn();c.restore();};
const RBARREL=(c,x,y,u,col)=>{TH.ell(c,x,y,u*0.55,u*0.22,'rgba(0,0,0,.2)');const g=c.createLinearGradient(x-u*0.5,0,x+u*0.5,0);g.addColorStop(0,shade(col||'#9a6a3a',0.2));g.addColorStop(0.6,col||'#9a6a3a');g.addColorStop(1,shade(col||'#9a6a3a',-0.35));c.fillStyle=g;c.beginPath();c.moveTo(x-u*0.42,y);c.quadraticCurveTo(x-u*0.62,y-u*0.55,x-u*0.42,y-u*1.1);c.lineTo(x+u*0.42,y-u*1.1);c.quadraticCurveTo(x+u*0.62,y-u*0.55,x+u*0.42,y);c.closePath();c.fill();TH.ell(c,x,y-u*1.1,u*0.42,u*0.17,shade(col||'#9a6a3a',0.22));TH.ln(c,[x-u*0.55,y-u*0.35],[x+u*0.55,y-u*0.35],'#3a2a1a',u*0.09);TH.ln(c,[x-u*0.55,y-u*0.75],[x+u*0.55,y-u*0.75],'#3a2a1a',u*0.09);};
const RLANTERN=(c,x,y,u,rgb)=>{GLOW(c,x,y,u*1.3,rgb||'255,200,90',0.5);TH.ln(c,[x,y-u*0.5],[x,y-u*0.15],'#2a2018',u*0.08);TH.poly(c,[[x-u*0.18,y-u*0.15],[x+u*0.18,y-u*0.15],[x+u*0.14,y+u*0.32],[x-u*0.14,y+u*0.32]],'#ffd36a');TH.ell(c,x,y-u*0.15,u*0.2,u*0.08,'#2a2018');};
const RWINDOW=(c,I,y1,X,Z,w,h,glow,frame)=>{BP(c,[I(X-w/2-0.08,y1,Z-h/2-0.08),I(X+w/2+0.08,y1,Z-h/2-0.08),I(X+w/2+0.08,y1,Z+h/2+0.08),I(X-w/2-0.08,y1,Z+h/2+0.08)],frame||'#f4ead2');BP(c,[I(X-w/2,y1,Z-h/2),I(X+w/2,y1,Z-h/2),I(X+w/2,y1,Z+h/2),I(X-w/2,y1,Z+h/2)],glow||'#ffd27a');};
const SHDW_=(c,x,y,rx)=>{c.fillStyle='rgba(30,20,10,.22)';c.beginPath();c.ellipse(x+rx*0.2,y+rx*0.08,rx,rx*0.34,0,0,7);c.fill();};
const RTORCH=(c,x,y,u,h)=>{TH.ln(c,[x,y],[x,y-h],'#6a4a28',u*0.2);TH.ln(c,[x,y-h*0.7],[x,y-h*0.5],'#c8a050',u*0.2);GLOW(c,x,y-h-u*0.5,u*1.5,'255,160,50',0.5);c.fillStyle='#ff8a2a';c.beginPath();c.moveTo(x-u*0.3,y-h);c.quadraticCurveTo(x-u*0.4,y-h-u*0.9,x,y-h-u*1.5);c.quadraticCurveTo(x+u*0.4,y-h-u*0.8,x+u*0.3,y-h);c.closePath();c.fill();c.fillStyle='#ffd45a';c.beginPath();c.moveTo(x-u*0.14,y-h);c.quadraticCurveTo(x-u*0.14,y-h-u*0.6,x,y-h-u*0.95);c.quadraticCurveTo(x+u*0.14,y-h-u*0.5,x+u*0.14,y-h);c.closePath();c.fill();};
const RTHATCH=(c,pts,u,base,dark,n)=>{BP(c,pts,base);RCLIP(c,pts,()=>{const A=pts[0],B=pts[1],C2=pts[2],D=pts[3];for(let k=1;k<n;k++){const t=k/n,L=[A[0]+(D[0]-A[0])*t,A[1]+(D[1]-A[1])*t],Rr=[B[0]+(C2[0]-B[0])*t,B[1]+(C2[1]-B[1])*t];TH.ln(c,L,Rr,k%2?dark:'rgba(255,240,190,.25)',u*0.1);const m=(Rr[0]-L[0])/Math.round((Rr[0]-L[0])/(u*0.5)||1);for(let q=0;q<Math.round((Rr[0]-L[0])/(u*0.5));q++){const px=L[0]+q*m+(k%2)*m*0.5,py=L[1]+(Rr[1]-L[1])*(q*m/((Rr[0]-L[0])||1));TH.ln(c,[px,py],[px+m*0.12,py+u*0.45],dark,u*0.05);}}});};
const SOFT_=(c,x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
const RSTRIPE=(c,A,B,Cc,D,n,c1,c2)=>{BP(c,[A,B,Cc,D],c1);for(let k=0;k<n;k+=2){const t0=k/n,t1=(k+1)/n,P=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];BP(c,[P(A,B,t0),P(A,B,t1),P(D,Cc,t1),P(D,Cc,t0)],c2);}};
const RBULBS=(c,pts,u,col)=>pts.forEach(p=>{GLOW(c,p[0],p[1],u*0.6,'255,220,120',0.55);TH.ell(c,p[0],p[1],u*0.13,u*0.13,col||'#fff3c0');});
const RTABLE=(c,x,y,u,col)=>{TH.ell(c,x,y+u*0.1,u*0.9,u*0.3,'rgba(0,0,0,.18)');TH.ln(c,[x,y],[x,y-u*0.9],'#6a4a2a',u*0.14);TH.ell(c,x,y-u*0.9,u*0.75,u*0.28,col||'#f4efe0');TH.ell(c,x-u*0.2,y-u*1.0,u*0.18,u*0.07,'#d9433b');};
function EGCYL_(c,x,y,rx,ry,h,cols){const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,cols[0]);g.addColorStop(0.55,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y);c.lineTo(x-rx,y-h);c.ellipse(x,y-h,rx,ry,0,Math.PI,0,false);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();c.fillStyle=cols[0];c.beginPath();c.ellipse(x,y-h,rx,ry,0,0,7);c.fill();}
const RRPLANE=(c,x,y,u,plane)=>{c.translate(x,y);if(plane==='R')c.transform(-0.7*u,0.35*u,0,-u,0,0);else c.transform(0.7*u,0.35*u,0,-u,0,0);};

const RRSIDEWIN=(c,I,x1,Y,Z,w,h,glass,frame)=>{BP(c,[I(x1+0.01,Y-w/2-0.1,Z-h/2-0.1),I(x1+0.01,Y+w/2+0.1,Z-h/2-0.1),I(x1+0.01,Y+w/2+0.1,Z+h/2+0.1),I(x1+0.01,Y-w/2-0.1,Z+h/2+0.1)],frame||'#e4e0d6');BP(c,[I(x1+0.02,Y-w/2,Z-h/2),I(x1+0.02,Y+w/2,Z-h/2),I(x1+0.02,Y+w/2,Z+h/2),I(x1+0.02,Y-w/2,Z+h/2)],glass||'#cfe3ee');TH.ln(c,I(x1+0.03,Y,Z-h/2),I(x1+0.03,Y,Z+h/2),'rgba(255,255,255,.7)',1.2);};

/* ===== GUEST SERVICES HELPERS: service window + attendant, "i" information signs, park-map board, strollers ===== */
/* the information "i" on a plaque drawn on a wall plane or a free-standing sign; shape: round | shield | rect | arch */
const GSINFO=(c,x,y,u,bg,fg,rim,shape,plane,sc)=>{c.save();RRPLANE(c,x,y,u*(sc||1.5),plane||'F');
  if(shape==='round'){c.beginPath();c.arc(0,0,0.68,0,7);c.fillStyle=rim||fg;c.fill();c.beginPath();c.arc(0,0,0.58,0,7);c.fillStyle=bg;c.fill();}
  else if(shape==='shield'){c.beginPath();c.moveTo(-0.58,0.64);c.lineTo(0.58,0.64);c.lineTo(0.58,0.0);c.quadraticCurveTo(0.52,-0.52,0,-0.76);c.quadraticCurveTo(-0.52,-0.52,-0.58,0.0);c.closePath();c.fillStyle=rim||fg;c.fill();c.beginPath();c.moveTo(-0.49,0.55);c.lineTo(0.49,0.55);c.lineTo(0.49,0.0);c.quadraticCurveTo(0.45,-0.44,0,-0.65);c.quadraticCurveTo(-0.45,-0.44,-0.49,0.0);c.closePath();c.fillStyle=bg;c.fill();}
  else if(shape==='arch'){c.beginPath();c.moveTo(-0.55,-0.68);c.lineTo(-0.55,0.1);c.arc(0,0.1,0.55,Math.PI,0,false);c.lineTo(0.55,-0.68);c.closePath();c.fillStyle=rim||fg;c.fill();c.beginPath();c.moveTo(-0.46,-0.59);c.lineTo(-0.46,0.1);c.arc(0,0.1,0.46,Math.PI,0,false);c.lineTo(0.46,-0.59);c.closePath();c.fillStyle=bg;c.fill();}
  else{c.fillStyle=rim||fg;c.fillRect(-0.62,-0.68,1.24,1.36);c.fillStyle=bg;c.fillRect(-0.53,-0.59,1.06,1.18);}
  c.fillStyle=fg;c.beginPath();c.arc(0,0.34,0.115,0,7);c.fill();c.fillRect(-0.09,-0.3,0.18,0.5);c.fillRect(-0.21,-0.36,0.42,0.1);c.fillRect(-0.2,0.08,0.2,0.11);c.restore();};
/* a post-mounted information sign standing on the ground at (X,Y): plaque centre at height zTop */
const GSSIGN=(c,I,u,X,Y,zTop,bg,fg,rim,shape,postCol,sc,plane)=>{const p=I(X,Y,0),q=I(X,Y,zTop);TH.ell(c,p[0],p[1]+u*0.1,u*0.6,u*0.22,'rgba(0,0,0,.2)');TH.ln(c,p,q,postCol||'#6a7684',u*0.24);TH.ell(c,p[0],p[1],u*0.3,u*0.12,shade(postCol||'#6a7684',-0.2));GSINFO(c,q[0],q[1],u,bg,fg,rim,shape,plane||'F',sc||1.45);};
/* the park-map board: two posts and a framed panel with a little map (kind 'map') or pinned notices (kind 'posters') */
const GSMAP=(c,I,u,X,Y,frame,paper,kind,pal)=>{pal=Object.assign({g:'#8fcf88',w:'#7cc4e8',t:'#d9b27a',p:'#b8824a',d:'#d9433b',y:'#e8a030'},pal||{});const pL=I(X-0.95,Y,0),pR=I(X+0.95,Y,0);TH.ell(c,I(X,Y,0)[0],I(X,Y,0)[1]+u*0.1,u*1.5,u*0.3,'rgba(0,0,0,.18)');RPOST(c,I,X-0.95,Y,0,2.3,frame,u,0.22);RPOST(c,I,X+0.95,Y,0,2.3,frame,u,0.22);
  const p=I(X,Y+0.08,2.3);c.save();RRPLANE(c,p[0],p[1],u,'F');c.fillStyle=frame;c.fillRect(-1.12,-0.86,2.24,1.72);c.fillStyle=paper||'#efe6c8';c.fillRect(-1.0,-0.74,2.0,1.48);
  if(kind==='posters'){[[-0.72,0.28,0.55,0.7],[0.0,0.34,0.55,0.62],[0.7,0.26,0.5,0.7],[-0.4,-0.38,0.55,0.55],[0.35,-0.36,0.6,0.58]].forEach(([a,b,w,h],i)=>{c.fillStyle=['#f7f0dc','#efe0b8','#f2e8c8'][i%3];c.fillRect(a-w/2,b-h/2,w,h);c.fillStyle='rgba(60,30,12,.55)';c.fillRect(a-w*0.36,b+h*0.12,w*0.72,0.06);c.fillRect(a-w*0.36,b-h*0.08,w*0.5,0.05);c.fillStyle='#b83a2a';c.beginPath();c.arc(a,b-h*0.28,0.06,0,7);c.fill();});}
  else{c.fillStyle=pal.g;c.beginPath();c.ellipse(-0.45,0.2,0.5,0.34,0.3,0,7);c.fill();c.beginPath();c.ellipse(0.5,-0.2,0.42,0.3,-0.2,0,7);c.fill();c.fillStyle=pal.w;c.beginPath();c.ellipse(0.35,0.3,0.32,0.2,0.1,0,7);c.fill();c.fillStyle=pal.t;c.beginPath();c.ellipse(-0.45,-0.38,0.3,0.18,0,0,7);c.fill();c.strokeStyle=pal.p;c.lineWidth=0.06;c.beginPath();c.moveTo(-0.8,0.05);c.quadraticCurveTo(-0.1,0.4,0.2,0.0);c.quadraticCurveTo(0.5,-0.2,0.85,-0.5);c.stroke();c.fillStyle=pal.d;c.beginPath();c.arc(0.05,0.12,0.09,0,7);c.fill();[[0.62,0.42],[-0.7,-0.05],[0.1,-0.5]].forEach(([a,b])=>{c.fillStyle=pal.y;c.fillRect(a-0.07,b-0.07,0.14,0.14);});}
  c.restore();};
/* a parked stroller (side view): canopy, seat, push-bar and two wheels */
const GSSTROLLER=(c,x,y,u,col,dir)=>{const d=dir||1;c.save();c.translate(x,y);c.scale(d,1);TH.ell(c,0,u*0.1,u*0.85,u*0.2,'rgba(0,0,0,.2)');
  TH.ln(c,[u*0.5,-u*0.5],[u*0.95,-u*1.55],'#5a6674',u*0.1);TH.ln(c,[u*0.8,-u*1.55],[u*1.15,-u*1.55],'#3a4450',u*0.14);
  TH.poly(c,[[-u*0.6,-u*0.55],[u*0.55,-u*0.55],[u*0.45,-u*1.0],[-u*0.6,-u*1.05]],shade(col,-0.1));
  c.fillStyle=col;c.beginPath();c.moveTo(-u*0.6,-u*1.05);c.quadraticCurveTo(-u*0.55,-u*1.9,u*0.1,-u*1.7);c.lineTo(u*0.25,-u*1.0);c.closePath();c.fill();c.fillStyle='rgba(255,255,255,.22)';c.beginPath();c.moveTo(-u*0.5,-u*1.05);c.quadraticCurveTo(-u*0.45,-u*1.65,-u*0.05,-u*1.55);c.lineTo(-u*0.05,-u*1.05);c.closePath();c.fill();
  [-u*0.4,u*0.45].forEach(wx=>{TH.ell(c,wx,-u*0.28,u*0.26,u*0.26,'#2a3038');TH.ell(c,wx,-u*0.28,u*0.12,u*0.12,'#9aa6b4');});TH.ln(c,[-u*0.4,-u*0.3],[u*0.45,-u*0.3],'#5a6674',u*0.07);c.restore();};
/* the attendant seen through the service window */
const GSATT=(c,x,y,u,shirt,hat,skin,hatKind)=>{skin=skin||'#fde4c8';TH.poly(c,[[x-u*0.55,y],[x+u*0.55,y],[x+u*0.42,y-u*0.95],[x-u*0.42,y-u*0.95]],shirt);TH.poly(c,[[x-u*0.12,y-u*0.95],[x+u*0.12,y-u*0.95],[x,y-u*0.55]],'rgba(255,255,255,.5)');
  TH.ell(c,x,y-u*1.28,u*0.3,u*0.32,skin);TH.ell(c,x-u*0.1,y-u*1.3,u*0.04,u*0.04,'#2a1a10');TH.ell(c,x+u*0.1,y-u*1.3,u*0.04,u*0.04,'#2a1a10');
  if(hat){if(hatKind==='ranger'||hatKind==='wide'){TH.ell(c,x,y-u*1.52,u*0.62,u*0.16,hat);TH.poly(c,[[x-u*0.3,y-u*1.52],[x+u*0.3,y-u*1.52],[x+u*0.24,y-u*1.95],[x-u*0.24,y-u*1.95]],hat);}else{c.fillStyle=hat;c.beginPath();c.ellipse(x,y-u*1.45,u*0.34,u*0.3,0,Math.PI,0,false);c.fill();TH.ell(c,x,y-u*1.45,u*0.34,u*0.08,shade(hat,-0.25));}}};
/* the service window: frame, warm interior with an attendant, and a deep counter in front (the wall must already be drawn) */
const GSWIN=(c,x,y,u,I,X,y1,w,z0,h,o)=>{o=o||{};BP(c,[I(X-w/2-0.16,y1+0.01,z0-0.12),I(X+w/2+0.16,y1+0.01,z0-0.12),I(X+w/2+0.16,y1+0.01,z0+h+0.16),I(X-w/2-0.16,y1+0.01,z0+h+0.16)],o.frame||'#e8e2d4');
  BP(c,[I(X-w/2,y1+0.03,z0),I(X+w/2,y1+0.03,z0),I(X+w/2,y1+0.03,z0+h),I(X-w/2,y1+0.03,z0+h)],o.inside||'#3a2a1c');GLOW(c,...I(X,y1+0.1,z0+h*0.5),u*w*(o.glowR||0.75),o.glow||'255,200,120',o.glowA===undefined?0.4:o.glowA);
  const sh=z0+h*0.5;BP(c,[I(X-w/2+0.15,y1+0.07,sh),I(X+w/2-0.15,y1+0.07,sh),I(X+w/2-0.15,y1+0.07,sh+0.09),I(X-w/2+0.15,y1+0.07,sh+0.09)],o.shelf||'#8a6a46');
  [[-0.32,0.34,'#d9433b'],[-0.1,0.3,'#f2c230'],[0.12,0.4,'#4aa0d8'],[0.32,0.26,'#ffffff']].forEach(([k,hh,col])=>{const a=I(X+k*w*0.9,y1+0.07,sh+0.09),b=I(X+k*w*0.9+0.28,y1+0.07,sh+0.09),c2=I(X+k*w*0.9+0.28,y1+0.07,sh+0.09+hh),d=I(X+k*w*0.9,y1+0.07,sh+0.09+hh);BP(c,[a,b,c2,d],col);});
  BP(c,[I(X-w/2+0.15,y1+0.07,z0+0.15),I(X+w/2-0.15,y1+0.07,z0+0.15),I(X+w/2-0.15,y1+0.07,z0+0.24),I(X-w/2+0.15,y1+0.07,z0+0.24)],o.shelf||'#8a6a46');
  TH.ln(c,I(X-w*0.28,y1+0.08,z0+h),I(X-w*0.28,y1+0.08,z0+h-0.45),'#2a2018',u*0.05);TH.ell(c,...I(X-w*0.28,y1+0.1,z0+h-0.55),u*0.2,u*0.14,'#ffe9a8');GLOW(c,...I(X-w*0.28,y1+0.1,z0+h-0.55),u*1.4,'255,225,150',0.5);
  TH.ln(c,I(X,y1+0.08,z0+h),I(X,y1+0.08,z0+h*0.55),'rgba(255,255,255,.0)',1);
  if(o.glass!==false){BP(c,[I(X+w/2-0.9,y1+0.1,z0+0.15),I(X+w/2-0.1,y1+0.1,z0+0.15),I(X+w/2-0.1,y1+0.1,z0+h-0.15),I(X+w/2-0.9,y1+0.1,z0+h-0.15)],'rgba(180,225,250,.18)');}
  JBOX(c,x,y,u,X-w/2-0.35,X+w/2+0.35,y1,y1+0.8,0,z0+0.06,o.counter||'#c8c2b4');BT(c,I,X-w/2-0.35,X+w/2+0.35,y1,y1+0.8,z0+0.06,o.top||'#e8e2d4');
  [-0.5,0,0.5].forEach(k=>{TH.ln(c,I(X+k*w*0.6,y1+0.8,0.25),I(X+k*w*0.6,y1+0.8,z0-0.1),'rgba(0,0,0,.12)',u*0.05);});
  /* a service bell and a few leaflets on the counter */
  const b=I(X+w*0.28,y1+0.4,z0+0.06);TH.ell(c,b[0],b[1],u*0.22,u*0.09,'#c8a040');c.fillStyle='#e8c050';c.beginPath();c.ellipse(b[0],b[1]-u*0.12,u*0.17,u*0.14,0,Math.PI,0,false);c.fill();TH.ell(c,b[0],b[1]-u*0.3,u*0.04,u*0.04,'#8a6a20');
  const l=I(X-w*0.3,y1+0.42,z0+0.07);[0,1,2].forEach(k=>TH.poly(c,[[l[0]+k*u*0.28,l[1]],[l[0]+k*u*0.28+u*0.22,l[1]-u*0.08],[l[0]+k*u*0.28+u*0.22,l[1]-u*0.5],[l[0]+k*u*0.28,l[1]-u*0.42]],['#d9433b','#f2c230','#4aa0d8'][k]));};
const GUEST_ART={};

/* ===== GUEST SERVICES ART, batch 1: a front counter with an attendant, a post-mounted "i" sign, a park-map board and parked strollers ===== */
const GI=(x,y,u)=>(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);
const GSSTAR=(c,x,y,r,col,n)=>{n=n||5;const pts=[];for(let k=0;k<n*2;k++){const a=-Math.PI/2+k*Math.PI/n,rr=k%2?r*0.42:r;pts.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr]);}TH.poly(c,pts,col);};
const GSWHEEL=(c,x,y,r,col,spokes)=>{c.strokeStyle=col;c.lineWidth=r*0.16;c.beginPath();c.arc(x,y,r,0,7);c.stroke();c.lineWidth=r*0.1;for(let k=0;k<(spokes||8);k++){const a=k*Math.PI*2/(spokes||8);c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);c.stroke();}TH.ell(c,x,y,r*0.22,r*0.22,col);};

/* ---- STANDARD: a modern guest-services pavilion in the accent colour ---- */
GUEST_ART.standard={dy:0.05,k:1.15,draw(c,x,y,u,v,acc){const I=GI(x,y,u),A=acc||'#0ea5e9',D=shade(A,-0.28);RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'30,34,40');
  JBOX(c,x,y,u,-4.6,4.6,-2.7,2.7,0,0.5,'#aab3bd');JBOX(c,x,y,u,-4.5,4.5,-2.6,2.6,0.5,3.8,'#eceff2');for(let z=1.0;z<3.8;z+=0.45)TH.ln(c,I(-4.5,2.6,z),I(4.5,2.6,z),'rgba(120,130,144,.18)',u*0.05);JBOX(c,x,y,u,-4.6,4.6,-2.7,2.7,3.45,3.8,A);
  GSWIN(c,x,y,u,I,0,2.6,3.8,1.3,2.0,{frame:'#f4f6f8',shirt:A,hat:D,counter:'#cfd6dd',top:'#f4f6f8'});
  [-3.4,3.4].forEach(X=>RWINDOW(c,I,2.62,X,2.2,1.0,1.1,'#cfe3ee','#f4f6f8'));RRSIDEWIN(c,I,4.5,0,2.2,1.2,1.0,'#cfe3ee','#f4f6f8');
  RSTRIPE(c,I(-2.7,2.6,3.55),I(2.7,2.6,3.55),I(2.7,3.9,3.05),I(-2.7,3.9,3.05),9,'#ffffff',A);for(let k=0;k<9;k++){const a=I(-2.7+k*0.6,3.9,3.05),b=I(-2.1+k*0.6,3.9,3.05);TH.poly(c,[a,b,[(a[0]+b[0])/2,(a[1]+b[1])/2+u*0.3]],k%2?'#ffffff':A);}
  GAB(c,I,-4.9,4.9,-3.0,3.0,3.8,1.0,0.4,A,D,u,5);
  GSSIGN(c,I,u,5.7,3.8,3.5,A,'#ffffff','#f4f6f8','round','#8a96a4');GSMAP(c,I,u,-5.6,3.6,'#6a7684','#f4f1e6','map');
  GSSTROLLER(c,...I(-3.0,5.2,0),u,'#f59e0b');GSSTROLLER(c,...I(-1.6,5.6,0),u,A);GSSTROLLER(c,...I(2.6,5.4,0),u,'#ef4444',-1);}};

/* ---- WESTERN: the stage-line and sheriff's office (teller bars, a star badge on the false front, a wanted-poster board) ---- */
GUEST_ART.western={dy:0.05,k:1.15,draw(c,x,y,u,v){const I=GI(x,y,u),wood='#b8895a';RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'50,36,20');
  JBOX(c,x,y,u,-4.5,4.5,-2.6,2.6,0,3.8,wood);for(let k=0;k<19;k++)TH.ln(c,I(-4.5+k*0.5,2.6,0),I(-4.5+k*0.5,2.6,3.8),'rgba(60,34,12,.42)',u*0.08);for(let k=0;k<11;k++)TH.ln(c,I(4.5,-2.6+k*0.52,0),I(4.5,-2.6+k*0.52,3.8),'rgba(50,28,10,.42)',u*0.08);
  [[-4.7,-2.6,4.6],[2.6,4.7,4.6]].forEach(([a,b,h])=>JBOX(c,x,y,u,a,b,2.3,2.75,3.8,h,'#c8935a'));JBOX(c,x,y,u,-2.7,2.7,2.25,2.8,3.8,5.6,'#d29d62');BP(c,[I(-1.9,2.82,4.2),I(1.9,2.82,4.2),I(1.9,2.82,5.3),I(-1.9,2.82,5.3)],'#f0e2bf');BP(c,[I(-1.7,2.83,4.4),I(1.7,2.83,4.4),I(1.7,2.83,5.1),I(-1.7,2.83,5.1)],'#8a2e32');const st=I(0,2.84,4.75);GSSTAR(c,st[0],st[1],u*0.58,'#f2c230');
  GSWIN(c,x,y,u,I,0,2.6,3.6,1.3,2.0,{frame:'#5a3a1e',shirt:'#8a2e32',hat:'#5a4028',hatKind:'wide',counter:'#9a6a3a',top:'#c8935a',inside:'#2a1a10'});
  for(let k=-3;k<=3;k++)TH.ln(c,I(k*0.5,2.72,1.36),I(k*0.5,2.72,3.3),'#2a1a10',u*0.11);TH.ln(c,I(-1.9,2.72,2.3),I(1.9,2.72,2.3),'#2a1a10',u*0.08);
  const pA=I(-3.2,2.6,3.65),pB=I(3.2,2.6,3.65),pC=I(3.2,4.5,3.15),pD=I(-3.2,4.5,3.15);BP(c,[pA,pB,pC,pD],'#6a4a30');for(let k=0;k<12;k++){const t=k/11;TH.ln(c,[pD[0]+(pC[0]-pD[0])*t,pD[1]+(pC[1]-pD[1])*t],[pA[0]+(pB[0]-pA[0])*t,pA[1]+(pB[1]-pA[1])*t],'rgba(0,0,0,.18)',u*0.06);}TH.ln(c,pD,pC,'#4a3220',u*0.14);[-3.0,3.0].forEach(X=>RPOST(c,I,X,4.4,0,3.1,'#8a5a30',u,0.3));
  GSSIGN(c,I,u,5.7,3.9,3.5,'#f0e2bf','#4a2e18','#6a4a2a','rect','#6a4a2a');GSMAP(c,I,u,-5.7,3.7,'#6a4326','#efe0b8','posters');
  TH.ln(c,I(-3.4,6.6,1.0),I(-0.6,6.6,1.0),'#6a4326',u*0.16);RPOST(c,I,-3.4,6.6,0,1.15,'#6a4326',u,0.2);RPOST(c,I,-0.6,6.6,0,1.15,'#6a4326',u,0.2);
  RBARREL(c,...I(5.9,5.4,0),u*1.1);const wp=I(4.4,6.0,0);GSWHEEL(c,wp[0],wp[1]-u*1.2,u*1.15,'#6a4326',10);
  GSSTROLLER(c,...I(-2.6,5.2,0),u,'#b84a32');GSSTROLLER(c,...I(-0.6,5.9,0),u,'#6a4326');}};

/* ---- MEDIEVAL: a guild hall stall (stone base, tan plaster and timber, open shutters, a bell post, a parchment map) ---- */
GUEST_ART.medieval={dy:0.05,k:1.15,draw(c,x,y,u,v){const I=GI(x,y,u),stone='#9c9a90',tan='#d9b98a',tim='#4a2e1a';RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'30,34,24');
  JBOX(c,x,y,u,-4.5,4.5,-2.6,2.6,0,1.6,stone);for(let z=0.5;z<1.6;z+=0.5){TH.ln(c,I(-4.5,2.6,z),I(4.5,2.6,z),'rgba(40,40,34,.34)',u*0.06);TH.ln(c,I(4.5,-2.6,z),I(4.5,2.6,z),'rgba(30,30,26,.34)',u*0.06);}for(let k=0;k<10;k++)for(let r=0;r<3;r++)TH.ln(c,I(-4.3+k*0.95+(r%2)*0.47,2.61,0.03+r*0.5),I(-4.3+k*0.95+(r%2)*0.47,2.61,0.47+r*0.5),'rgba(40,40,34,.28)',u*0.05);
  JBOX(c,x,y,u,-4.7,4.7,-2.8,2.8,1.6,4.1,tan);[-4.7,-3.1,-1.5,1.5,3.1,4.7].forEach(X=>TH.ln(c,I(X,2.8,1.6),I(X,2.8,4.1),tim,u*0.2));[-2.8,0,2.8].forEach(Y=>TH.ln(c,I(4.7,Y,1.6),I(4.7,Y,4.1),tim,u*0.2));TH.ln(c,I(-4.7,2.8,1.6),I(4.7,2.8,1.6),tim,u*0.24);TH.ln(c,I(-4.7,2.8,4.1),I(4.7,2.8,4.1),tim,u*0.24);TH.ln(c,I(4.7,-2.8,4.1),I(4.7,2.8,4.1),tim,u*0.24);
  GSWIN(c,x,y,u,I,0,2.6,3.2,1.25,2.0,{frame:tim,shirt:'#7a1f2a',hat:'#2a4a9a',counter:'#8d8b82',top:'#6a4a2a',inside:'#2a1c10'});
  [-1,1].forEach(sg=>{BP(c,[I(sg*1.75,2.64,1.2),I(sg*2.35,2.64,1.2),I(sg*2.35,2.64,3.4),I(sg*1.75,2.64,3.4)],'#6a4426');BP(c,[I(sg*1.82,2.66,1.4),I(sg*2.28,2.66,1.4),I(sg*2.28,2.66,3.2),I(sg*1.82,2.66,3.2)],'#7a5230');});
  HIP(c,I,-5.1,5.1,-3.2,3.2,4.1,2.4,0.4,'#6b1f2a','#4a1420',u,5);
  GSSIGN(c,I,u,5.7,3.9,3.6,'#1f3a7a','#f2c230','#c8a040','shield','#4a2e1a');GSMAP(c,I,u,-5.7,3.7,'#4a2e1a','#e8d8b0','map');
  const bp=I(4.2,4.4,0);RPOST(c,I,4.2,4.4,0,3.0,'#4a2e1a',u,0.26);TH.ln(c,I(4.2,4.4,3.0),I(5.3,4.4,3.0),'#4a2e1a',u*0.2);const bl=I(5.2,4.4,2.9);c.fillStyle='#c8a040';c.beginPath();c.moveTo(bl[0]-u*0.4,bl[1]+u*0.5);c.quadraticCurveTo(bl[0]-u*0.4,bl[1]-u*0.5,bl[0],bl[1]-u*0.5);c.quadraticCurveTo(bl[0]+u*0.4,bl[1]-u*0.5,bl[0]+u*0.4,bl[1]+u*0.5);c.closePath();c.fill();TH.ell(c,bl[0],bl[1]+u*0.5,u*0.4,u*0.12,'#8a6a20');TH.ell(c,bl[0],bl[1]+u*0.62,u*0.1,u*0.1,'#4a3a10');
  JBOX(c,x,y,u,-5.2,-4.0,5.0,6.0,0,0.85,'#d9b860');for(let k=0;k<4;k++)TH.ln(c,I(-5.2,5.2+k*0.24,0.0),I(-5.2,5.2+k*0.24,0.85),'rgba(120,90,20,.4)',u*0.06);
  RBARREL(c,...I(6.1,5.6,0),u*1.0,'#8a5a30');GSSTROLLER(c,...I(-2.6,5.2,0),u,'#7a1f2a');GSSTROLLER(c,...I(-0.6,5.9,0),u,'#2a4a9a');}};

/* ---- BAVARIAN: a painted chalet kiosk (heart shutters, flower boxes, scalloped gable boards, a lozenge-band sign) ---- */
GUEST_ART.bavarian={dy:0.05,k:1.15,draw(c,x,y,u,v){const I=GI(x,y,u),blue='#2a6ab0';RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'30,40,24');
  JBOX(c,x,y,u,-4.5,4.5,-2.6,2.6,0,1.2,'#b88a50');JBOX(c,x,y,u,-4.5,4.5,-2.6,2.6,1.2,4.0,'#f4ede0');for(let k=0;k<19;k++)TH.ln(c,I(-4.5+k*0.5,2.6,0),I(-4.5+k*0.5,2.6,1.2),'rgba(60,34,12,.35)',u*0.07);[-4.5,-2.25,0,2.25,4.5].forEach(X=>TH.ln(c,I(X,2.6,1.2),I(X,2.6,4.0),'#6a4a2a',u*0.2));TH.ln(c,I(-4.5,2.6,1.2),I(4.5,2.6,1.2),'#6a4a2a',u*0.2);TH.ln(c,I(4.5,-2.6,1.2),I(4.5,2.6,1.2),'#6a4a2a',u*0.2);
  GSWIN(c,x,y,u,I,0,2.6,3.2,1.25,2.0,{frame:'#6a4a2a',shirt:blue,hat:'#2a5a3a',counter:'#b88a50',top:'#e8d8b0'});
  [-1,1].forEach(sg=>{BP(c,[I(sg*1.75,2.64,1.15),I(sg*2.4,2.64,1.15),I(sg*2.4,2.64,3.35),I(sg*1.75,2.64,3.35)],blue);for(let r=0;r<3;r++){const p=I(sg*2.08,2.66,1.7+r*0.65);TH.poly(c,[[p[0],p[1]-u*0.2],[p[0]+u*0.2,p[1]],[p[0],p[1]+u*0.2],[p[0]-u*0.2,p[1]]],'#f7f4ea');}const h=I(sg*2.08,2.66,3.0);c.fillStyle='#d9433b';c.beginPath();c.moveTo(h[0],h[1]+u*0.2);c.bezierCurveTo(h[0]-u*0.45,h[1]-u*0.1,h[0]-u*0.15,h[1]-u*0.35,h[0],h[1]-u*0.12);c.bezierCurveTo(h[0]+u*0.15,h[1]-u*0.35,h[0]+u*0.45,h[1]-u*0.1,h[0],h[1]+u*0.2);c.fill();});
  JBOX(c,x,y,u,-2.0,2.0,2.6,3.2,0.7,1.1,'#8a5a30');for(let k=0;k<8;k++)TH.ell(c,...I(-1.8+k*0.5,3.1,1.2),u*0.17,u*0.2,['#d9433b','#e86aa8','#d9433b','#f2c230'][k%4]);
  const gz=4.0;GAB(c,I,-4.9,4.9,-3.0,3.0,gz,1.9,0.5,'#8a4a2a','#6a3a22',u,6);for(let k=0;k<13;k++){const a=I(-4.9+k*0.75,3.0,gz),b=I(-4.15+k*0.75,3.0,gz);TH.poly(c,[a,b,[(a[0]+b[0])/2,(a[1]+b[1])/2+u*0.45]],k%2?blue:'#f7f4ea');}
  GSSIGN(c,I,u,5.7,3.9,3.5,'#f7f4ea',blue,'#c8842a','round','#6a4a2a');GSMAP(c,I,u,-5.7,3.7,blue,'#f4f1e6','map');
  RBARREL(c,...I(6.1,5.6,0),u*1.1,'#8a5a30');GSSTROLLER(c,...I(-2.6,5.3,0),u,'#d9433b');GSSTROLLER(c,...I(-0.6,6.0,0),u,blue);}};

/* ---- JUNGLE: the expedition field office (planked hut, corrugated roof, bamboo awning, radio mast, a pinned expedition map) ---- */
GUEST_ART.jungle={dy:0.05,k:1.15,draw(c,x,y,u,v){const I=GI(x,y,u),plank='#8a6a46';RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'14,40,22');
  JBOX(c,x,y,u,-4.5,4.5,-2.6,2.6,0,4.2,plank);for(let k=0;k<18;k++)TH.ln(c,I(-4.5+k*0.5,2.6,0),I(-4.5+k*0.5,2.6,4.2),'rgba(40,24,10,.32)',u*0.06);for(let k=0;k<11;k++)TH.ln(c,I(4.5,-2.6+k*0.5,0),I(4.5,-2.6+k*0.5,4.2),'rgba(30,18,8,.34)',u*0.06);
  GSWIN(c,x,y,u,I,0,2.6,3.4,1.25,1.9,{frame:'#5a3a1e',shirt:'#5a8a44',hat:'#c8b070',hatKind:'wide',counter:'#7a5a36',top:'#c9b060'});
  /* bamboo awning over the window */
  const aA=I(-2.6,2.6,3.5),aB=I(2.6,2.6,3.5),aC=I(2.6,4.0,3.0),aD=I(-2.6,4.0,3.0);BP(c,[aA,aB,aC,aD],'#c9b060');for(let k=0;k<14;k++){const t=k/13;TH.ln(c,[aD[0]+(aC[0]-aD[0])*t,aD[1]+(aC[1]-aD[1])*t],[aA[0]+(aB[0]-aA[0])*t,aA[1]+(aB[1]-aA[1])*t],k%2?'#a8883a':'#d8c070',u*0.14);}TH.ln(c,aD,aC,'#8a7a3a',u*0.14);[-2.4,2.4].forEach(X=>RPOST(c,I,X,3.9,0,3.0,'#c9b060',u,0.24));
  const A=I(-4.9,3.2,4.2),B=I(4.9,3.2,4.2),C2=I(4.9,-2.8,5.4),D=I(-4.9,-2.8,5.4);BP(c,[A,B,C2,D],'#5f8f78');RCLIP(c,[A,B,C2,D],()=>{for(let k=0;k<50;k++){const t=k/49,a=[A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t],b=[D[0]+(C2[0]-D[0])*t,D[1]+(C2[1]-D[1])*t];TH.ln(c,a,b,k%2?'rgba(20,50,40,.3)':'rgba(255,255,255,.12)',u*0.07);}[[0.3,0.5],[0.7,0.3],[0.5,0.8]].forEach(([s,t])=>TH.ell(c,A[0]+(B[0]-A[0])*s+(D[0]-A[0])*t,A[1]+(B[1]-A[1])*s+(D[1]-A[1])*t,u*0.7,u*0.35,'rgba(150,80,40,.35)'));});BP(c,[I(4.9,-2.8,4.1),I(4.9,3.2,4.2),I(4.9,-2.8,5.4)],'#4a6e5c');TH.ln(c,A,B,'#3a5a48',u*0.14);
  TH.ln(c,I(-3.0,0,5.4),I(-3.0,0,8.4),'#4a4a4e',u*0.14);TH.ln(c,I(-3.4,0,7.4),I(-2.6,0,7.4),'#4a4a4e',u*0.1);TH.ln(c,I(-3.2,0,6.6),I(-2.8,0,6.6),'#4a4a4e',u*0.1);
  for(let k=0;k<7;k++){const p=I(-4.4+k*1.4,2.7,4.2);TH.ln(c,p,[p[0]+(k%2?1:-1)*u*0.2,p[1]+u*(1.1+(k%3)*0.6)],'#3f8a45',u*0.13);}
  GSSIGN(c,I,u,5.7,3.9,3.5,'#5a3a1e','#fff3d0','#2e4a30','rect','#7a5a36');GSMAP(c,I,u,-5.7,3.7,'#c9b060','#e8d8a8','map');
  [[-5.5,5.2],[6.0,4.8]].forEach(([X,Y])=>{const p=I(X,Y,0);for(let j=0;j<6;j++){const a=-Math.PI*0.95+j/5*Math.PI*0.9;TH.ln(c,[p[0],p[1]],[p[0]+Math.cos(a)*u*1.5,p[1]+Math.sin(a)*u*1.1-u*0.4],j%2?'#3f8a45':'#58a04f',u*0.34);}});
  [[5.0,5.6],[5.8,6.0]].forEach(([X,Y],i)=>{JBOX(c,x,y,u,X-0.5,X+0.5,Y-0.5,Y+0.5,i*0.9,0.9+i*0.9,i?'#9a6a3a':'#a8783e');});
  GSSTROLLER(c,...I(-2.6,5.4,0),u,'#b8a060');GSSTROLLER(c,...I(-0.6,6.0,0),u,'#5a8a44');}};

/* ---- TIKI: a thatched open-air info hut (carved totems flanking the window, a bamboo map board, torches) ---- */
GUEST_ART.tiki={dy:0.05,k:1.15,draw(c,x,y,u,v){const I=GI(x,y,u),bam='#c9a860';RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'20,40,16');
  JBOX(c,x,y,u,-4.7,4.7,-2.8,2.8,0,0.4,'#8a5e34');JBOX(c,x,y,u,-4.4,4.4,-2.5,2.5,0.4,4.3,bam);for(let k=0;k<20;k++)TH.ln(c,I(-4.4+k*0.46,2.5,0.4),I(-4.4+k*0.46,2.5,4.3),'rgba(90,60,20,.4)',u*0.07);for(let k=0;k<11;k++)TH.ln(c,I(4.4,-2.5+k*0.5,0.4),I(4.4,-2.5+k*0.5,4.3),'rgba(70,46,14,.4)',u*0.07);
  GSWIN(c,x,y,u,I,0,2.5,3.2,1.35,2.0,{frame:'#4a2e18',shirt:'#2f8a8a',hat:'#d9433b',counter:'#6a4426',top:'#c8a060',inside:'#2a1a0c'});
  [-1,1].forEach((sg,i)=>{const p=I(sg*2.35,2.62,0.4);TH.ln(c,[p[0],p[1]],[p[0],p[1]-u*3.4],['#6a4426','#4a2e18'][i],u*0.62);for(let k=0;k<3;k++){const yy=p[1]-u*(0.9+k*1.0);TH.ell(c,p[0]-u*0.14,yy,u*0.2,u*0.13,'#fff6dc');TH.ell(c,p[0]+u*0.14,yy,u*0.2,u*0.13,'#fff6dc');TH.ell(c,p[0]-u*0.14,yy,u*0.08,u*0.08,'#1a1008');TH.ell(c,p[0]+u*0.14,yy,u*0.08,u*0.08,'#1a1008');TH.poly(c,[[p[0]-u*0.14,yy+u*0.28],[p[0]+u*0.14,yy+u*0.28],[p[0],yy+u*0.46]],'#2a1a10');}});
  const z0=4.3,H=3.0,A=I(-5.0,3.4,z0),B=I(5.0,3.4,z0),R1=I(5.0,0,z0+H),R0=I(-5.0,0,z0+H);BP(c,[I(4.6,-2.8,z0),I(4.6,3.0,z0),I(4.6,0.1,z0+H*0.9)],'#a07c3a');RTHATCH(c,[A,B,R1,R0],u,'#caa55a','rgba(110,76,24,.5)',9);for(let k=0;k<22;k++){const t=k/21,p=[A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t];TH.poly(c,[[p[0]-u*0.24,p[1]],[p[0]+u*0.24,p[1]],[p[0],p[1]+u*0.5]],k%2?'#b8924a':'#caa55a');}TH.ln(c,R0,R1,'#6a4426',u*0.3);
  GSSIGN(c,I,u,5.8,3.9,3.5,'#6a4426','#fff6dc','#c8661e','round','#5a3a22');GSMAP(c,I,u,-5.8,3.7,'#8a6a2a','#e8d8a8','map');
  [[-3.6,4.4],[3.6,4.4]].forEach(([X,Y])=>{const p=I(X,Y,0);RTORCH(c,p[0],p[1],u,u*2.8);});
  const bq=I(6.2,5.4,0);for(let k=0;k<3;k++)TH.ln(c,[bq[0]+(k-1)*u*0.3,bq[1]],[bq[0]+(k-1)*u*0.4,bq[1]-u*1.6-k*u*0.3],'#5aa84a',u*0.2);
  GSSTROLLER(c,...I(-2.0,5.6,0),u,'#ea580c');GSSTROLLER(c,...I(0.4,6.2,0),u,'#2f8a8a');}};

/* ---- CARIBBEAN: the harbourmaster's office (aqua clapboard, coral shutters, a ship's wheel, a treasure-map board) ---- */
GUEST_ART.caribbean={dy:0.05,k:1.15,draw(c,x,y,u,v){const I=GI(x,y,u),aqua='#7fd0c8';RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'30,34,34');
  JBOX(c,x,y,u,-4.5,4.5,-2.6,2.6,0,0.6,'#e9dfc2');JBOX(c,x,y,u,-4.5,4.5,-2.6,2.6,0.6,4.0,aqua);for(let z=0.85;z<4.0;z+=0.3){TH.ln(c,I(-4.5,2.6,z),I(4.5,2.6,z),'rgba(30,100,100,.2)',u*0.05);TH.ln(c,I(4.5,-2.6,z),I(4.5,2.6,z),'rgba(30,100,100,.22)',u*0.05);}
  GSWIN(c,x,y,u,I,0,2.6,3.2,1.3,1.9,{frame:'#fff3e0',shirt:'#1f2f5a',hat:'#1f2f5a',counter:'#e9dfc2',top:'#c8a070'});
  [-1,1].forEach(sg=>{BP(c,[I(sg*1.75,2.64,1.2),I(sg*2.4,2.64,1.2),I(sg*2.4,2.64,3.4),I(sg*1.75,2.64,3.4)],'#e86a5a');for(let k=0;k<6;k++)TH.ln(c,I(sg*1.75,2.65,1.4+k*0.35),I(sg*2.4,2.65,1.5+k*0.35),'rgba(90,20,10,.45)',u*0.06);});
  const wp=I(-3.45,2.66,2.3);GSWHEEL(c,wp[0],wp[1],u*0.85,'#6a4326',8);
  HIP(c,I,-4.9,4.9,-3.0,3.0,4.0,2.0,0.5,'#7a5e48','#5e4636',u,5);JBOX(c,x,y,u,2.8,3.7,-1.3,-0.4,5.6,7.6,'#b8a07a');JBOX(c,x,y,u,2.7,3.8,-1.4,-0.3,7.6,7.9,'#8a7656');
  GSSIGN(c,I,u,5.7,3.9,3.5,'#1f2f5a','#f2c230','#c8a040','round','#5a4a38');GSMAP(c,I,u,-5.7,3.7,'#6a4326','#e8d8a8','map');
  const mp=I(-5.7,3.78,2.3);c.save();RRPLANE(c,mp[0],mp[1],u,'F');c.fillStyle='#d9433b';c.fillRect(0.1,-0.05,0.1,0.42);c.restore();
  [[6.1,5.4],[6.9,4.6],[-5.2,6.4]].forEach(([X,Y],i)=>{const p=I(X,Y,0);RBARREL(c,p[0],p[1],u*1.1,i===1?'#7a5230':'#9a6a3a');});
  const rc=I(5.0,6.2,0);TH.ell(c,rc[0],rc[1],u*0.7,u*0.26,'#c8a070');TH.ell(c,rc[0],rc[1]-u*0.25,u*0.55,u*0.2,'#d8b888');
  GSSTROLLER(c,...I(-2.6,5.3,0),u,'#e86a5a');GSSTROLLER(c,...I(-0.6,6.0,0),u,'#1f2f5a');}};

/* ---- ALPS: a visitor hut (log and stone, snow roof, red shutters, a trail-map board, skis in the rack) ---- */
GUEST_ART.alps={dy:0.05,k:1.15,draw(c,x,y,u,v){const I=GI(x,y,u),log='#a5683a';RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'40,50,70');
  JBOX(c,x,y,u,-4.5,4.5,-2.6,2.6,0,0.9,'#8d9198');JBOX(c,x,y,u,-4.5,4.5,-2.6,2.6,0.9,4.0,log);for(let z=1.1;z<4.0;z+=0.4){TH.ln(c,I(-4.5,2.6,z),I(4.5,2.6,z),'rgba(60,30,10,.4)',u*0.07);TH.ln(c,I(4.5,-2.6,z),I(4.5,2.6,z),'rgba(50,24,8,.42)',u*0.07);}for(let z=1.1;z<4.0;z+=0.4){const q=I(-4.5,2.6,z);TH.ell(c,q[0],q[1],u*0.18,u*0.2,'#c88a52');}
  GSWIN(c,x,y,u,I,0,2.6,3.2,1.4,1.9,{frame:'#f6efe0',shirt:'#2f6a46',hat:'#b83a2a',counter:'#8d9198',top:'#a5683a'});
  [-1,1].forEach(sg=>{BP(c,[I(sg*1.75,2.64,1.3),I(sg*2.4,2.64,1.3),I(sg*2.4,2.64,3.5),I(sg*1.75,2.64,3.5)],'#b83a2a');const h=I(sg*2.08,2.66,2.5);c.fillStyle='#f6efe0';c.beginPath();c.moveTo(h[0],h[1]+u*0.2);c.bezierCurveTo(h[0]-u*0.45,h[1]-u*0.1,h[0]-u*0.15,h[1]-u*0.35,h[0],h[1]-u*0.12);c.bezierCurveTo(h[0]+u*0.15,h[1]-u*0.35,h[0]+u*0.45,h[1]-u*0.1,h[0],h[1]+u*0.2);c.fill();});
  const z0=4.0,H=2.0,A=I(-4.9,3.4,z0),B=I(4.9,3.4,z0),R1=I(4.9,0,z0+H),R0=I(-4.9,0,z0+H);BP(c,[I(4.5,-2.6,z0),I(4.5,2.6,z0),I(4.5,0,z0+H*0.85)],'#eaf1fb');BP(c,[A,B,R1,R0],'#f7faff');RCLIP(c,[A,B,R1,R0],()=>{for(let k=0;k<3;k++){const t=(k+1)/4;TH.ln(c,[A[0]+(R0[0]-A[0])*t,A[1]+(R0[1]-A[1])*t],[B[0]+(R1[0]-B[0])*t,B[1]+(R1[1]-B[1])*t],'rgba(150,176,214,.35)',u*0.14);}});TH.ln(c,A,B,'#7a5a3a',u*0.2);TH.ln(c,R0,R1,'#dfe9f7',u*0.26);
  for(let k=0;k<15;k++){const t=k/14,p=[A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t];TH.poly(c,[[p[0]-u*0.12,p[1]],[p[0]+u*0.12,p[1]],[p[0],p[1]+u*(0.3+((k*7)%5)*0.16)]],'rgba(214,232,252,.9)');}
  JBOX(c,x,y,u,2.2,3.2,-2.2,-1.2,4.6,8.0,'#8d9198');JBOX(c,x,y,u,2.1,3.3,-2.3,-1.1,8.0,8.3,'#767a82');TH.poly(c,[I(2.1,-2.3,8.3),I(3.3,-2.3,8.3),I(3.3,-1.1,8.3),I(2.1,-1.1,8.3)],'#f1f6fd');const sm=I(2.7,-1.7,9.0);for(let k=0;k<4;k++)TH.ell(c,sm[0]+k*u*0.4,sm[1]-k*u*0.8,u*(0.5+k*0.2),u*(0.34+k*0.13),'rgba(235,238,245,'+(0.6-k*0.12)+')');
  GSSIGN(c,I,u,5.7,3.9,3.5,'#2f6a46','#ffffff','#f6efe0','round','#7a5a3a');GSMAP(c,I,u,-5.7,3.7,'#7a5a3a','#f1f6fd','map');
  const sk=I(4.8,5.6,0);[[-0.4,'#2a6ab0'],[0.3,'#b83a2a']].forEach(([dx,col])=>TH.ln(c,[sk[0]+dx*u,sk[1]-u*0.1],[sk[0]+dx*u+u*0.6,sk[1]-u*3.2],col,u*0.16));
  [[-3.6,6.4,1.6],[1.6,6.6,1.8]].forEach(([X,Y,s])=>{const p=I(X,Y,0);TH.ell(c,p[0],p[1],u*s,u*s*0.34,'#eef4fc');TH.ell(c,p[0]-u*s*0.2,p[1]-u*s*0.1,u*s*0.6,u*s*0.2,'#ffffff');});
  GSSTROLLER(c,...I(-2.6,5.3,0),u,'#b83a2a');GSSTROLLER(c,...I(-0.6,6.0,0),u,'#2f6a46');}};

/* ===== GUEST SERVICES ART, batch 2 ===== */
/* ---- GOTHIC: a gatehouse booth (dark stone, lantern-lit window with a raised grille, finials, iron-post sign, tattered map) ---- */
GUEST_ART.gothic={dy:0.05,k:1.15,draw(c,x,y,u,v){const I=GI(x,y,u),stone='#3b3a48';RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'10,8,20');
  [[-4.8,4.4,2.2],[4.6,5.0,1.8],[0.4,5.6,2.4]].forEach(([X,Y,s])=>{const p=I(X,Y,0.2);SOFT_(c,p[0],p[1],u*s*1.6,u*s*0.5,'150,150,180',0.28);});
  JBOX(c,x,y,u,-4.6,4.6,-2.7,2.7,0,0.45,'#2a2936');JBOX(c,x,y,u,-4.5,4.5,-2.6,2.6,0.45,4.2,stone);for(let z=0.9;z<4.2;z+=0.5){TH.ln(c,I(-4.5,2.6,z),I(4.5,2.6,z),'rgba(10,10,20,.4)',u*0.06);TH.ln(c,I(4.5,-2.6,z),I(4.5,2.6,z),'rgba(10,10,20,.4)',u*0.06);}for(let k=0;k<10;k++)for(let r=0;r<8;r++)TH.ln(c,I(-4.3+k*0.95+(r%2)*0.47,2.61,0.5+r*0.5),I(-4.3+k*0.95+(r%2)*0.47,2.61,0.9+r*0.5),'rgba(10,10,20,.3)',u*0.05);
  [-4.5,4.5].forEach(X=>{JBOX(c,x,y,u,X-0.3,X+0.3,2.4,3.0,0,4.6,'#46455a');TH.poly(c,[I(X-0.36,3.06,4.6),I(X+0.36,3.06,4.6),I(X,3.06,5.5)],'#14101c');});
  GSWIN(c,x,y,u,I,0,2.6,3.2,1.25,2.0,{frame:'#6a6a7e',shirt:'#6a2a4a',hat:'#14101c',hatKind:'wide',counter:'#4a4960',top:'#2a2936',inside:'#1c1410',glow:'255,190,70'});
  /* pointed stone surround and a half-raised iron grille */
  const pa=[I(-1.8,2.66,3.4),I(1.8,2.66,3.4),I(0,2.66,4.4)];BP(c,pa,'#6a6a7e');BP(c,[I(-1.5,2.68,3.5),I(1.5,2.68,3.5),I(0,2.68,4.2)],'#14101c');GLOW(c,...I(0,2.7,3.7),u*1.6,'255,190,70',0.35);
  for(let k=-3;k<=3;k++)TH.ln(c,I(k*0.45,2.7,3.2),I(k*0.45,2.7,2.6),'#14101c',u*0.09);TH.ln(c,I(-1.6,2.7,3.2),I(1.6,2.7,3.2),'#14101c',u*0.12);
  GAB(c,I,-4.9,4.9,-3.0,3.0,4.2,3.0,0.4,'#2f2d3f','#25233a',u,6);BP(c,[I(4.5,-2.6,4.2),I(4.5,2.6,4.2),I(4.5,0,6.4)],'#25233a');
  const cr=I(4.9,0,7.1);TH.ln(c,[cr[0],cr[1]],[cr[0],cr[1]-u*1.6],'#14101c',u*0.18);TH.ln(c,[cr[0]-u*0.5,cr[1]-u*1.1],[cr[0]+u*0.5,cr[1]-u*1.1],'#14101c',u*0.18);
  const lp=I(-2.6,3.5,3.5);TH.ln(c,[lp[0],lp[1]-u*1.1],[lp[0],lp[1]],'#14101c',u*0.08);RLANTERN(c,lp[0],lp[1]+u*0.3,u*1.1,'255,190,70');
  GSSIGN(c,I,u,5.7,3.9,3.5,'#1c1a26','#ffcf5a','#7a7a90','arch','#2a2936');GSMAP(c,I,u,-5.7,3.7,'#2a2936','#cdbf9a','map',{g:'#7a8a6a',w:'#5a7a8a',t:'#8a7a5a',p:'#4a3a2a',d:'#8a2a2a',y:'#c8a040'});
  RBARREL(c,...I(6.1,5.6,0),u*1.0,'#4a3a32');GSSTROLLER(c,...I(-2.6,5.3,0),u,'#4a4960');GSSTROLLER(c,...I(-0.6,6.0,0),u,'#6a2a4a');}};

/* ---- CLASSIC MIDWAY: a candy-striped information booth (scalloped awning, a bulb-lit "i" marquee, balloons) ---- */
GUEST_ART.classic={dy:0.05,k:1.15,draw(c,x,y,u,v){const I=GI(x,y,u),red='#d9433b',cream='#f7f0dc',teal='#2f9a9a',yel='#f2c230';RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'40,30,30');
  JBOX(c,x,y,u,-4.5,4.5,-2.6,2.6,0,4.0,cream);for(let k=0;k<18;k+=2)BP(c,[I(-4.5+k*0.5,2.6,0),I(-4.0+k*0.5,2.6,0),I(-4.0+k*0.5,2.6,4.0),I(-4.5+k*0.5,2.6,4.0)],red);for(let k=0;k<10;k+=2)BP(c,[I(4.5,-2.6+k*0.52,0),I(4.5,-2.08+k*0.52,0),I(4.5,-2.08+k*0.52,4.0),I(4.5,-2.6+k*0.52,4.0)],'#a83228');
  GSWIN(c,x,y,u,I,0,2.6,3.4,1.2,2.0,{frame:'#fff8e8',shirt:red,hat:yel,counter:'#e8c050',top:'#fff8e8'});
  RSTRIPE(c,I(-2.7,2.6,3.5),I(2.7,2.6,3.5),I(2.7,4.0,3.0),I(-2.7,4.0,3.0),9,cream,red);for(let k=0;k<9;k++){const a=I(-2.7+k*0.6,4.0,3.0),b=I(-2.1+k*0.6,4.0,3.0);TH.poly(c,[a,b,[(a[0]+b[0])/2,(a[1]+b[1])/2+u*0.32]],k%2?cream:red);}
  JBOX(c,x,y,u,-4.8,4.8,-2.9,2.9,4.0,4.4,red);for(let k=0;k<12;k++){const a=I(-4.8+k*0.8,2.9,4.0),b=I(-4.0+k*0.8,2.9,4.0);TH.poly(c,[a,b,[(a[0]+b[0])/2,(a[1]+b[1])/2+u*0.4]],yel);}
  BT(c,I,-4.8,4.8,-2.9,2.9,4.4,'#e8dcbc');
  /* the roof marquee: a big bulb-ringed information roundel */
  const mc=I(0,0.4,6.8);JBOX(c,x,y,u,-0.5,0.5,0.0,0.8,4.4,5.4,'#8a6a40');TH.ell(c,mc[0],mc[1],u*2.0,u*2.0,'#8a6a40');TH.ell(c,mc[0],mc[1],u*1.82,u*1.82,'#fff8e8');TH.ell(c,mc[0],mc[1],u*1.55,u*1.55,teal);GSINFO(c,mc[0],mc[1],u,teal,'#ffffff',null,'round','F',1.6);
  const bl=[];for(let k=0;k<20;k++){const a=k*Math.PI*2/20;bl.push([mc[0]+Math.cos(a)*u*1.9,mc[1]+Math.sin(a)*u*1.9]);}RBULBS(c,bl,u);
  /* balloons tied to the corner post */
  const bp=I(5.0,3.4,0);TH.ln(c,bp,[bp[0],bp[1]-u*1.6],'#6a4a2a',u*0.12);[[0,'#d9433b'],[-0.6,'#f2c230'],[0.6,'#2f9a9a']].forEach(([dx,col],i)=>{const b=[bp[0]+dx*u,bp[1]-u*(3.0+i%2*0.6)];TH.ln(c,[bp[0],bp[1]-u*1.6],b,'rgba(60,40,30,.6)',u*0.05);TH.ell(c,b[0],b[1],u*0.55,u*0.68,col);TH.ell(c,b[0]-u*0.16,b[1]-u*0.2,u*0.14,u*0.2,'rgba(255,255,255,.5)');});
  GSSIGN(c,I,u,5.8,4.0,3.4,red,'#ffffff','#fff8e8','round','#8a6a40');GSMAP(c,I,u,-5.7,3.7,red,'#fff8e8','map');
  GSSTROLLER(c,...I(-2.8,5.3,0),u,yel);GSSTROLLER(c,...I(-0.8,6.0,0),u,teal);GSSTROLLER(c,...I(2.8,5.6,0),u,red,-1);}};

/* ---- AMERICANA: a Victorian information pavilion (green iron panels, brick base, a clock tower, brass bell, gas lamp) ---- */
GUEST_ART.americana={dy:0.05,k:1.12,draw(c,x,y,u,v){const I=GI(x,y,u),brick='#cf9470',iron='#2f5a46';RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'40,34,28');
  JBOX(c,x,y,u,-4.5,4.5,-2.6,2.6,0,1.2,brick);for(let z=0.4;z<1.2;z+=0.4)TH.ln(c,I(-4.5,2.6,z),I(4.5,2.6,z),'rgba(90,40,20,.25)',u*0.05);
  JBOX(c,x,y,u,-4.7,4.7,-2.8,2.8,1.05,1.3,'#e8e0c8');
  JBOX(c,x,y,u,-4.5,4.5,-2.6,2.6,1.2,4.2,iron);for(let k=0;k<10;k++)TH.ln(c,I(-4.4+k*1.0,2.6,1.3),I(-4.4+k*1.0,2.6,4.2),'rgba(255,255,255,.07)',u*0.1);
  GSWIN(c,x,y,u,I,0,2.6,3.4,1.5,1.9,{frame:'#e8e0c8',shirt:'#8a2e32',hat:'#14201a',counter:'#e8e0c8',top:'#c8a040',inside:'#2e2018'});
  [-3.4,3.4].forEach(X=>{RWINDOW(c,I,2.62,X,2.7,0.95,1.5,'#ffd27a','#e8e0c8');});
  JBOX(c,x,y,u,-4.7,4.7,-2.8,2.8,4.2,4.55,'#e8e0c8');for(let k=0;k<13;k++)TH.poly(c,[I(-4.7+k*0.73,2.81,4.2),I(-4.3+k*0.73,2.81,4.2),I(-4.5+k*0.73,2.81,3.8)],'#c8a040');
  HIP(c,I,-4.9,4.9,-3.0,3.0,4.55,2.0,0.4,'#566472','#3e4a56',u,5);
  /* a clock tower on the roof */
  JBOX(c,x,y,u,-1.0,1.0,-1.0,1.0,6.0,8.2,'#e8e0c8');const ck=I(0,1.02,7.1);TH.ell(c,ck[0],ck[1],u*0.82,u*0.82,'#c8a040');TH.ell(c,ck[0],ck[1],u*0.7,u*0.7,'#fff8e8');for(let k=0;k<12;k++){const a=k*Math.PI/6;TH.ln(c,[ck[0]+Math.cos(a)*u*0.55,ck[1]+Math.sin(a)*u*0.55],[ck[0]+Math.cos(a)*u*0.66,ck[1]+Math.sin(a)*u*0.66],'#2a2a30',u*0.05);}TH.ln(c,ck,[ck[0],ck[1]-u*0.5],'#2a2a30',u*0.08);TH.ln(c,ck,[ck[0]+u*0.35,ck[1]+u*0.1],'#2a2a30',u*0.08);
  const ap=I(0,0,10.3);TH.poly(c,[I(-1.2,1.2,8.2),I(1.2,1.2,8.2),ap],'#566472');TH.poly(c,[I(1.2,1.2,8.2),I(1.2,-1.2,8.2),ap],'#3e4a56');TH.ln(c,ap,[ap[0],ap[1]-u*1.0],'#c8a040',u*0.1);TH.ell(c,ap[0],ap[1]-u*1.1,u*0.16,u*0.16,'#c8a040');
  const gl=I(5.4,4.2,0);TH.ln(c,gl,[gl[0],gl[1]-u*3.2],'#2a2a30',u*0.16);TH.ell(c,gl[0],gl[1]-u*0.1,u*0.4,u*0.16,'#2a2a30');RLANTERN(c,gl[0],gl[1]-u*3.2,u*1.1);
  GSSIGN(c,I,u,5.7,3.0,3.5,'#2f5a46','#e8c050','#e8e0c8','round','#2a2a30');GSMAP(c,I,u,-5.7,3.7,'#2f5a46','#efe6c8','map');
  GSSTROLLER(c,...I(-2.8,5.3,0),u,'#8a2e32');GSSTROLLER(c,...I(-0.8,6.0,0),u,'#2a2a30');}};

/* ---- SPACE: a modular information pod (white module with a dome cap, a wide glowing window, a holographic map and a lit sign disc) ---- */
GUEST_ART.space={dy:0.05,k:1.15,draw(c,x,y,u,v){const E=0.95,I=GI(x,y,u),yy=y-u*E,L=GI(x,yy,u);RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'20,30,50');GLOW(c,x,y+u*0.3,u*4.6,'74,200,255',0.14);
  /* short stilts under the module: back legs first, then an under-frame beam */
  [[-4.0,-2.2],[0,-2.2],[4.0,-2.2],[-4.0,0],[4.0,0],[-4.0,2.2],[0,2.2],[4.0,2.2]].sort((p,q)=>(p[0]+p[1])-(q[0]+q[1])).forEach(([X,Y])=>{JBOX(c,x,y,u,X-0.3,X+0.3,Y-0.3,Y+0.3,0,0.12,'#7a8696');JBOX(c,x,y,u,X-0.2,X+0.2,Y-0.2,Y+0.2,0.12,E+0.05,'#aab6c4');});
  JBOX(c,x,y,u,-4.5,4.5,-2.55,2.55,E-0.3,E+0.02,'#8d99aa');
  /* the module itself: a plain white box with a blue band and a flat roof */
  JBOX(c,x,yy,u,-4.5,4.5,-2.6,2.6,0,3.7,'#eef3f8');for(let z=0.6;z<3.2;z+=0.55)TH.ln(c,L(-4.5,2.6,z),L(4.5,2.6,z),'rgba(120,134,152,.15)',u*0.05);BF(c,L,-4.55,4.55,2.64,3.15,3.45,'#2f7fd8');BR(c,L,4.55,-2.65,2.64,3.15,3.45,'#1f5fb8');BF(c,L,-4.55,4.55,2.64,0,0.2,'#2f7fd8');BR(c,L,4.55,-2.65,2.64,0,0.2,'#1f5fb8');
  for(let k=0;k<22;k++){const p=L(-4.3+k*0.41,2.66,0.1);GLOW(c,p[0],p[1],u*0.5,'74,200,255',0.7);TH.ell(c,p[0],p[1],u*0.1,u*0.06,'#bff0ff');}
  GSWIN(c,x,yy,u,L,0,2.6,3.6,0.55,1.9,{frame:'#cfd8e2',counter:'#cfd8e2',top:'#f4f8fc',inside:'#14283e',glow:'120,200,255',glowA:0.12,glowR:0.5,shelf:'#9aa6b6'});
  [-3.5,3.5].forEach(X=>{const p=L(X,2.63,1.7);TH.ell(c,p[0],p[1],u*0.62,u*0.62,'#8d99aa');TH.ell(c,p[0],p[1],u*0.5,u*0.5,'#4a6a88');TH.ell(c,p[0],p[1],u*0.42,u*0.42,'#7cc9e8');GLOW(c,p[0],p[1],u*1.4,'120,220,255',0.35);});
  RRSIDEWIN(c,L,4.5,0,1.9,1.5,1.0,'#7cc9e8','#cfd8e2');
  JBOX(c,x,yy,u,-4.7,4.7,-2.8,2.8,3.7,3.95,'#dfe7ef');BT(c,L,-4.5,4.5,-2.6,2.6,3.95,'#f4f8fc');JBOX(c,x,yy,u,1.6,3.2,-1.6,-0.4,3.95,4.45,'#cfd8e2');for(let k=0;k<4;k++)TH.ln(c,L(1.7,-0.38,4.05+k*0.1),L(3.1,-0.38,4.05+k*0.1),'rgba(80,96,116,.4)',u*0.04);
  GSSIGN(c,I,u,5.7,3.9,3.6,'#1f4a9a','#ffffff','#cfd8e2','round','#cfd8e2');GLOW(c,...I(5.7,4.0,3.6),u*2.2,'74,200,255',0.35);
  const hp=I(-5.7,3.8,2.4);RPOST(c,I,-5.7,3.8,0,2.0,'#cfd8e2',u,0.2);c.save();RRPLANE(c,hp[0],hp[1],u,'F');const hg=c.createLinearGradient(0,-0.8,0,0.8);hg.addColorStop(0,'rgba(120,220,255,.85)');hg.addColorStop(1,'rgba(40,120,220,.85)');c.fillStyle='#9aa6b6';c.fillRect(-1.1,-0.84,2.2,1.68);c.fillStyle=hg;c.fillRect(-1.0,-0.74,2.0,1.48);c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=0.04;for(let k=-3;k<=3;k++){c.beginPath();c.moveTo(k*0.28,-0.7);c.lineTo(k*0.28,0.7);c.stroke();c.beginPath();c.moveTo(-0.95,k*0.22);c.lineTo(0.95,k*0.22);c.stroke();}c.fillStyle='#ffffff';[[-0.4,0.2],[0.3,-0.3],[0.55,0.35]].forEach(([a,b])=>{c.beginPath();c.arc(a,b,0.09,0,7);c.fill();});c.restore();GLOW(c,hp[0],hp[1],u*2.4,'120,220,255',0.3);
  GSSTROLLER(c,...I(-2.6,5.3,0),u,'#2f7fd8');GSSTROLLER(c,...I(-0.6,6.0,0),u,'#e6ecf2');}};

/* ---- RETRO FUTURE: an octagonal information kiosk in white and blue (service window on the front face, blue-glass clerestory, low roof) ---- */
GUEST_ART.retro={dy:0.05,k:1.3,draw(c,x,y,u,v){const I=GI(x,y,u),Rr=4.5,ZH=3.9;RSH_(c,x,y+u*0.5,u*7.4,u*3.2,'30,50,70');
  const ang=k=>(k+0.5)*Math.PI/4,V=(k,r,z)=>I(Math.cos(ang(k))*r,Math.sin(ang(k))*r,z),P=(k,s,z,r)=>{const a0=ang(k),a1=ang(k+1);return I(Math.cos(a0)*r*(1-s)+Math.cos(a1)*r*s,Math.sin(a0)*r*(1-s)+Math.sin(a1)*r*s,z);};
  const dep=k=>Math.cos((k+1)*Math.PI/4)+Math.sin((k+1)*Math.PI/4),all=[0,1,2,3,4,5,6,7].sort((a,b)=>dep(a)-dep(b)),vis=all.filter(k=>dep(k)>0.05);
  const shd=['#ffffff','#f1f5f8','#dde5ec','#cfd9e2','#c4cfd9','#d9e1e8','#eaf0f4','#f6f9fb'];
  vis.forEach(k=>{BP(c,[V(k,Rr,0),V(k+1,Rr,0),V(k+1,Rr,ZH),V(k,Rr,ZH)],shd[k%8]);BP(c,[P(k,0,0,Rr),P(k,1,0,Rr),P(k,1,0.5,Rr),P(k,0,0.5,Rr)],'#2f7fd8');
    const gp=[P(k,0.1,3.0,Rr),P(k,0.9,3.0,Rr),P(k,0.9,3.7,Rr),P(k,0.1,3.7,Rr)],ys=gp.map(p=>p[1]),gg=c.createLinearGradient(0,Math.min(...ys),0,Math.max(...ys));gg.addColorStop(0,'#bfe2fb');gg.addColorStop(1,'#4a95e8');BP(c,gp,gg);for(let m=1;m<5;m++)TH.ln(c,P(k,0.1+0.8*m/5,3.0,Rr),P(k,0.1+0.8*m/5,3.7,Rr),'#f4f8fb',u*0.07);});
  /* the service window sits on the front face (a plane at Y = Rr*cos(22.5deg)), counter projecting out */
  const yf=Rr*Math.cos(Math.PI/8);GSWIN(c,x,y,u,I,0,yf,2.5,1.1,1.7,{frame:'#e8f2fc',shirt:'#2f7fd8',hat:'#e8f2fc',counter:'#dfe9f4',top:'#ffffff',inside:'#14283e',glow:'170,222,255'});
  BP(c,all.length?[0,1,2,3,4,5,6,7].map(k=>V(k,Rr+0.5,ZH)):[],'#e8eef3');vis.forEach(k=>BP(c,[V(k,Rr+0.5,ZH),V(k+1,Rr+0.5,ZH),V(k+1,Rr+0.5,ZH+0.4),V(k,Rr+0.5,ZH+0.4)],'#2f7fd8'));BP(c,[0,1,2,3,4,5,6,7].map(k=>V(k,Rr+0.5,ZH+0.4)),'#f4f8fc');
  const apex=I(0,0,ZH+1.3);all.forEach(k=>BP(c,[V(k,Rr-0.3,ZH+0.4),V(k+1,Rr-0.3,ZH+0.4),apex],shd[k%8]));TH.ln(c,apex,I(0,0,ZH+3.0),'#cfd8e2',u*0.16);const sp=I(0,0,ZH+3.3);TH.ell(c,sp[0],sp[1],u*0.22,u*0.22,'#2f7fd8');GLOW(c,sp[0],sp[1],u*1.5,'120,190,255',0.5);
  GSSIGN(c,I,u,5.8,4.0,3.5,'#2f7fd8','#ffffff','#dfe9f4','round','#cfd8e2');GSMAP(c,I,u,-5.0,4.1,'#2f7fd8','#eaf4ff','map',{g:'#a8d0f5',w:'#4a95e8',t:'#cfe3f8',p:'#2f7fd8',d:'#1f4a9a',y:'#7ab8f0'});
  GSSTROLLER(c,...I(-2.6,5.7,0),u,'#2f7fd8');GSSTROLLER(c,...I(-0.6,6.3,0),u,'#e8f2fc');}};

/* ---- FRONTIER: a ranger station (peeled logs, green metal roof, a big trail-map board, a ranger behind the counter) ---- */
GUEST_ART.frontier={dy:0.05,k:1.15,draw(c,x,y,u,v){const I=GI(x,y,u),log='#a5683a',logD='#7a4a26';RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'30,36,20');
  JBOX(c,x,y,u,-4.5,4.5,-2.6,2.6,0,4.2,log);for(let z=0;z<4.2;z+=0.5){TH.ln(c,I(-4.5,2.6,z),I(4.5,2.6,z),logD,u*0.08);TH.ln(c,I(4.5,-2.6,z),I(4.5,2.6,z),logD,u*0.08);}for(let z=0.25;z<4.2;z+=0.5){const p=I(4.5,2.6,z);TH.ell(c,p[0],p[1],u*0.2,u*0.22,'#c88a52');TH.ell(c,p[0],p[1],u*0.09,u*0.1,logD);const q=I(-4.5,2.6,z);TH.ell(c,q[0],q[1],u*0.2,u*0.22,'#c88a52');TH.ell(c,q[0],q[1],u*0.09,u*0.1,logD);}
  GSWIN(c,x,y,u,I,0,2.6,3.2,1.35,1.9,{frame:'#6a3e1e',shirt:'#6a8a4a',hat:'#7a5a30',hatKind:'ranger',counter:'#8a5230',top:'#c88a52',inside:'#2a1a10'});
  [-3.3,3.3].forEach(X=>RWINDOW(c,I,2.62,X,2.4,1.0,1.3,'#ffd27a','#6a3e1e'));
  const z0=4.2,H=2.0,GR='#3f6a4e';GAB(c,I,-4.8,4.8,-2.9,2.9,z0,H,0.35,GR,'#3a4a3a',u,0);RCLIP(c,[I(-5.15,3.25,z0),I(5.15,3.25,z0),I(5.15,0,z0+H),I(-5.15,0,z0+H)],()=>{for(let k=0;k<20;k++){const t=k/19,a=I(-5.15+10.3*t,3.25,z0),b=I(-5.15+10.3*t,0,z0+H);TH.ln(c,a,b,k%2?'rgba(20,50,34,.4)':'rgba(255,255,255,.1)',u*0.09);}});
  BT(c,I,-2.9,2.9,2.6,4.3,0.3,'#8a5a30');BF(c,I,-2.9,2.9,4.3,0,0.3,'#6a4326');[-2.7,2.7].forEach(X=>RPOST(c,I,X,4.2,0.3,3.3,'#8a5a30',u,0.34));
  {const pA=I(-3.1,4.4,3.3),pB=I(3.1,4.4,3.3),pC=I(3.1,2.6,3.85),pD=I(-3.1,2.6,3.85);BP(c,[pA,pB,pC,pD],'#4a7a5a');for(let k=0;k<9;k++){const t=k/8;TH.ln(c,[pD[0]+(pC[0]-pD[0])*t,pD[1]+(pC[1]-pD[1])*t],[pA[0]+(pB[0]-pA[0])*t,pA[1]+(pB[1]-pA[1])*t],'rgba(20,50,34,.35)',u*0.08);}TH.ln(c,pA,pB,'#2e4f3a',u*0.16);}
  JBOX(c,x,y,u,4.6,6.0,-0.8,0.8,0,1.3,'#9a5e30');for(let k=0;k<7;k++)TH.ell(c,...I(6.01,-0.6+k*0.22,0.3+(k%2)*0.45),u*0.15,u*0.17,'#d8a870');
  GSSIGN(c,I,u,5.9,4.9,3.5,'#f2e2bf','#3f6a4e','#6a3e1e','rect','#6a3e1e');GSMAP(c,I,u,-5.9,3.9,'#6a3e1e','#efe6c8','map');
  GSSTROLLER(c,...I(-2.6,5.9,0),u,'#6a8a4a');GSSTROLLER(c,...I(-0.4,6.4,0),u,'#8a5230');}};

/* ---- FIESTA: a talavera-tiled casita booth (hot pink and turquoise plaster, a barrel-tile awning, a tiled counter, marigold pots) ---- */
GUEST_ART.fiesta={dy:0.05,k:1.17,draw(c,x,y,u,v){const I=GI(x,y,u),pink='#e0468e',turq='#2ab0b8',yel='#f2c230',orange='#f08a30';RSH_(c,x,y+u*0.5,u*7.6,u*3.2,'50,30,30');
  JBOX(c,x,y,u,-4.5,0.0,-2.6,2.6,0,3.7,pink);JBOX(c,x,y,u,0.0,4.5,-2.6,2.6,0,3.7,turq);
  /* cream cornice band, then a clay roof deck with a low parapet standing exactly on the walls */
  JBOX(c,x,y,u,-4.65,4.65,-2.75,2.75,3.7,4.05,'#ffe9f2');for(let k=0;k<18;k++){const a0=I(-4.65+k*0.52,2.76,3.7),b0=I(-4.13+k*0.52,2.76,3.7);TH.poly(c,[a0,b0,[(a0[0]+b0[0])/2,(a0[1]+b0[1])/2+u*0.3]],k%2?yel:(k<9?turq:pink));}
  BT(c,I,-4.5,4.5,-2.6,2.6,4.05,'#d9a06a');JBOX(c,x,y,u,-4.65,4.65,-2.75,-2.5,4.05,4.55,'#ffe9f2');JBOX(c,x,y,u,-4.65,-4.4,-2.5,2.5,4.05,4.55,'#ffe9f2');JBOX(c,x,y,u,-4.65,4.65,2.5,2.75,4.05,4.55,'#ffe9f2');JBOX(c,x,y,u,4.4,4.65,-2.5,2.5,4.05,4.55,'#e6fbfb');
  GSWIN(c,x,y,u,I,0,2.6,3.4,1.3,1.9,{frame:yel,shirt:'#2a5ab8',hat:orange,counter:'#2a5ab8',top:'#fff6e6',inside:'#2a1a30'});
  for(let k=0;k<7;k++){const p=I(-1.6+k*0.55,3.4,0.8);TH.poly(c,[[p[0],p[1]-u*0.22],[p[0]+u*0.22,p[1]],[p[0],p[1]+u*0.22],[p[0]-u*0.22,p[1]]],k%2?yel:'#fff6e6');}
  const tA=I(-2.8,3.6,3.0),tB=I(2.8,3.6,3.0),tC=I(2.8,2.6,3.65),tD=I(-2.8,2.6,3.65);BP(c,[tA,tB,tC,tD],'#c2603a');for(let k=0;k<15;k++){const t=k/14;TH.ln(c,[tD[0]+(tC[0]-tD[0])*t,tD[1]+(tC[1]-tD[1])*t],[tA[0]+(tB[0]-tA[0])*t,tA[1]+(tB[1]-tA[1])*t],k%2?'#e07a4a':'#a24a2a',u*0.2);}TH.ln(c,tA,tB,'#8a3a1e',u*0.12);[-2.6,2.6].forEach(X=>RPOST(c,I,X,3.5,0,3.0,'#8a5a30',u,0.2));
  [-3.7,3.7].forEach(X=>{BP(c,[I(X-0.45,2.66,1.4),I(X+0.45,2.66,1.4),I(X+0.45,2.66,2.9),I(X-0.45,2.66,2.9)],'#fff6e6');TH.ell(c,...I(X,2.67,2.15),u*0.3,u*0.3,orange);TH.ell(c,...I(X,2.68,2.15),u*0.14,u*0.14,'#2a5ab8');});
  GSSIGN(c,I,u,5.7,3.9,3.5,'#fff6e6','#2a5ab8',yel,'round','#8a5a30');GSMAP(c,I,u,-5.7,3.7,orange,'#fff6e6','map');
  [[-4.8,4.6],[5.0,5.4]].forEach(([X,Y],i)=>{const p=I(X,Y,0);EGCYL_(c,p[0],p[1],u*0.55,u*0.22,u*1.0,['#e07a4a','#c2603a','#8a3a1e']);for(let j=0;j<4;j++)TH.ell(c,p[0]+(j-1.5)*u*0.2,p[1]-u*1.3,u*0.2,u*0.2,[orange,'#d9433b',yel,pink][j]);});
  GSSTROLLER(c,...I(-2.6,5.6,0),u,pink);GSSTROLLER(c,...I(-0.4,6.2,0),u,turq);}};

/* ---- NORDIC: a viking longhouse office (dark timber, a turf roof, a rune-shield "i", a carved map board, small dragon finials) ---- */
GUEST_ART.nordic={dy:0.05,k:1.15,draw(c,x,y,u,v){const I=GI(x,y,u),wood='#5e4128',woodL='#7a5634';RSH_(c,x,y+u*0.5,u*7.8,u*3.2,'20,30,24');
  JBOX(c,x,y,u,-4.7,4.7,-2.6,2.6,0,3.9,wood);for(let k=0;k<19;k++)TH.ln(c,I(-4.7+k*0.5,2.6,0),I(-4.7+k*0.5,2.6,3.9),'rgba(20,10,4,.45)',u*0.08);for(let k=0;k<11;k++)TH.ln(c,I(4.7,-2.6+k*0.52,0),I(4.7,-2.6+k*0.52,3.9),'rgba(20,10,4,.45)',u*0.07);
  GSWIN(c,x,y,u,I,0,2.6,3.2,1.3,1.9,{frame:'#3a2410',shirt:'#2a5ab8',hat:'#8a8a98',counter:'#7a5634',top:'#c8a060',inside:'#1c1208',glow:'255,170,70'});
  [-1,1].forEach(sg=>{RPOST(c,I,sg*2.1,2.7,0,3.4,'#7a5634',u,0.34);for(let z=0.4;z<3.2;z+=0.6)TH.ell(c,...I(sg*2.1,2.72,z),u*0.16,u*0.14,'#c8a060');});
  ['#b83a2a','#e8dcc0','#2a5ab8','#d8a020','#b83a2a','#e8dcc0'].forEach((col,i)=>{const p=I(-4.2+i*1.7,2.64,3.3);if(Math.abs(-4.2+i*1.7)<2.4)return;TH.ell(c,p[0],p[1],u*0.5,u*0.5,'#2a2018');TH.ell(c,p[0],p[1],u*0.42,u*0.42,col);TH.ell(c,p[0],p[1],u*0.14,u*0.14,'#c8c8d0');});
  const z0=3.9,H=1.8,A=I(-5.2,3.3,z0),B=I(5.2,3.3,z0),R1=I(5.2,0,z0+H),R0=I(-5.2,0,z0+H);BP(c,[I(4.7,-2.6,z0),I(4.7,2.6,z0),I(4.7,0,z0+H*0.85)],'#4a3220');BP(c,[A,B,R1,R0],'#5a3e26');RCLIP(c,[A,B,R1,R0],()=>{for(let r=0;r<4;r++){const t=(r+0.5)/4;for(let k=0;k<24;k++){const px=A[0]+(B[0]-A[0])*(k/24+(r%2)*0.02)+(R0[0]-A[0])*t,py=A[1]+(B[1]-A[1])*(k/24)+(R0[1]-A[1])*t;c.fillStyle=(k+r)%2?'rgba(0,0,0,.14)':'rgba(255,230,180,.1)';c.beginPath();c.ellipse(px+u*0.2,py,u*0.2,u*0.3,0,0,Math.PI);c.fill();}}c.fillStyle='#4f7a3a';c.beginPath();c.moveTo(R0[0],R0[1]);c.lineTo(R1[0],R1[1]);c.lineTo(R1[0],R1[1]+u*0.9);c.lineTo(R0[0],R0[1]+u*0.9);c.closePath();c.fill();for(let k=0;k<48;k++)TH.ln(c,[R0[0]+(R1[0]-R0[0])*k/47,R0[1]+(R1[1]-R0[1])*k/47+u*0.5],[R0[0]+(R1[0]-R0[0])*k/47+u*0.05,R0[1]+(R1[1]-R0[1])*k/47-u*0.15],k%2?'#6a9a48':'#3f6a2e',u*0.12);});TH.ln(c,A,B,'#3a2410',u*0.2);TH.ln(c,R0,R1,'#3a2410',u*0.18);
  const drg=(p,dir)=>{c.save();c.translate(p[0],p[1]);c.scale(dir,1);c.strokeStyle='#4a2e18';c.lineWidth=u*0.28;c.lineCap='round';c.beginPath();c.moveTo(0,u*0.3);c.quadraticCurveTo(u*0.7,-u*0.5,u*0.5,-u*1.5);c.quadraticCurveTo(u*0.4,-u*2.0,u*1.0,-u*2.1);c.stroke();TH.ell(c,u*1.15,-u*2.15,u*0.4,u*0.24,'#5a3a20',-0.3);TH.poly(c,[[u*0.95,-u*2.3],[u*0.8,-u*2.8],[u*1.2,-u*2.35]],'#5a3a20');TH.ell(c,u*1.2,-u*2.2,u*0.06,u*0.06,'#f2c230');c.restore();};drg(I(5.2,0,z0+H),1);drg(I(-5.2,0,z0+H),-1);
  GSSIGN(c,I,u,5.8,3.9,3.5,'#2a5ab8','#e8dcc0','#c8c8d0','round','#6a4a2a');GSMAP(c,I,u,-5.8,3.7,'#5e4128','#d8c8a0','map',{g:'#7a9a5a',w:'#5a8aa8',t:'#b8986a',p:'#6a4a2a',d:'#b83a2a',y:'#c8a040'});
  [[-3.4,4.6],[3.4,4.6]].forEach(([X,Y])=>{const p=I(X,Y,0);RTORCH(c,p[0],p[1],u,u*2.8);});RBARREL(c,...I(6.0,5.8,0),u*1.1,'#8a5a30');
  GSSTROLLER(c,...I(-2.4,5.8,0),u,'#b83a2a');GSSTROLLER(c,...I(-0.4,6.4,0),u,'#2a5ab8');}};

/* ===== GUEST SERVICES PACK API (same shape as the restaurant / restroom packs) ===== */
const GS_U=0.0975;
const GS_DX={standard: 0.11, western: 0.14, medieval: 0.09, bavarian: 0.115, jungle: 0.215, tiki: 0.13, caribbean: 0.15, alps: 0.205, gothic: 0.115, classic: 0.12, americana: 0.08, space: 0.125, retro: 0.17, frontier: 0.135, fiesta: 0.135, nordic: 0.135};   /* horizontal nudge (in R) that centres each building on the hex, filled in after measuring */
const GS_ALIAS={wild_west:'western',classic_midway:'classic',classicmidway:'classic',retro_future:'retro',retrofuture:'retro',alpine:'alps',unthemed:'standard',default:'standard',german:'bavarian',viking:'nordic',latin:'fiesta',mexican:'fiesta',pirate:'caribbean'};
function guestServicesTheme(t){t=String(t||'standard').toLowerCase();return GS_ALIAS[t]||t;}
/* drawGuestServices(ctx, cx, cy, R, {theme, flip, scale, dy, dx, accent}): (cx,cy) = centre of the hex tile, R = hex radius in px. Static, one hex, no ground. */
function drawGuestServices(ctx,cx,cy,R,opts){opts=opts||{};const th=guestServicesTheme(opts.theme),T=GUEST_ART[th];if(!T)throw new Error('unknown guest services theme: '+opts.theme);
  const S=opts.scale||1,u=R*GS_U*S*(T.k||1),dy=(opts.dy===undefined?T.dy:opts.dy)*R;ctx.save();if(opts.flip){ctx.translate(cx,0);ctx.scale(-1,1);ctx.translate(-cx,0);}T.draw(ctx,cx+(opts.dx===undefined?(GS_DX[th]||0):opts.dx)*R,cy+dy,u,opts.v===undefined?0:opts.v,opts.accent);ctx.restore();}
const GS_BAKE_CACHE={};
/* bakeGuestServices(theme, R, {scale, flip, pixelRatio, accent}) -> {canvas, ox, oy, w, h, bbox}: a transparent sprite cropped to its painted pixels; (ox,oy) = where the hex centre sits inside the canvas */
function bakeGuestServices(theme,R,opts){opts=opts||{};const th=guestServicesTheme(theme),pr=opts.pixelRatio||1,S=opts.scale||1,key=[th,R,S,!!opts.flip,pr,opts.accent||''].join('|');if(GS_BAKE_CACHE[key])return GS_BAKE_CACHE[key];
  const W=Math.ceil(R*4.2*pr),H=Math.ceil(R*5.0*pr),ax=W/2,ay=H*0.76,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');c.scale(pr,pr);drawGuestServices(c,ax/pr,ay/pr,R,{theme:th,scale:S,flip:opts.flip,accent:opts.accent});
  const d=cv.getContext('2d').getImageData(0,0,W,H).data;let x0=W,y0=H,x1=0,y1=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(d[(y*W+x)*4+3]>8){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}}
  const pad=2,bx=Math.max(0,x0-pad),by=Math.max(0,y0-pad),bw=Math.min(W,x1+pad+1)-bx,bh=Math.min(H,y1+pad+1)-by,out=document.createElement('canvas');out.width=bw;out.height=bh;out.getContext('2d').drawImage(cv,bx,by,bw,bh,0,0,bw,bh);
  return GS_BAKE_CACHE[key]={canvas:out,ox:(ax-bx)/pr,oy:(ay-by)/pr,w:bw/pr,h:bh/pr,pixelRatio:pr,bbox:{left:-(ax-bx)/pr,top:-(ay-by)/pr,right:(bx+bw-ax)/pr,bottom:(by+bh-ay)/pr}};}
function drawGuestServicesBaked(ctx,cx,cy,sprite){ctx.drawImage(sprite.canvas,cx-sprite.ox,cy-sprite.oy,sprite.w,sprite.h);}
function guestServicesFootprint(R,theme,opts){return bakeGuestServices(theme,R,opts).bbox;}
window.GUEST_SERVICES_FACILITY_ART = { draw: drawGuestServices, drawBaked: drawGuestServicesBaked, bake: bakeGuestServices, footprint: guestServicesFootprint };
})();
