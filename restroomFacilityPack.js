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
/* ===== RESTROOM HELPERS: pictogram plaques, door pairs, drinking fountain, roof vents ===== */
/* A little person pictogram on a plaque drawn ON a wall plane: (x,y) = screen point of the plaque centre; plane 'F' = the front wall (along +X), 'R' = the right wall (along -Y). */
const RRPLANE=(c,x,y,u,plane)=>{c.translate(x,y);if(plane==='R')c.transform(-0.7*u,0.35*u,0,-u,0,0);else c.transform(0.7*u,0.35*u,0,-u,0,0);};
const RRPICTO=(c,x,y,u,kind,fg,bg,shape,plane,rim)=>{c.save();RRPLANE(c,x,y,u*1.15,plane||'F');
  if(shape==='round'){c.beginPath();c.arc(0,0,0.64,0,7);c.fillStyle=rim||fg;c.fill();c.beginPath();c.arc(0,0,0.55,0,7);c.fillStyle=bg;c.fill();}
  else if(shape==='shield'){c.beginPath();c.moveTo(-0.55,0.62);c.lineTo(0.55,0.62);c.lineTo(0.55,0.0);c.quadraticCurveTo(0.5,-0.5,0,-0.72);c.quadraticCurveTo(-0.5,-0.5,-0.55,0.0);c.closePath();c.fillStyle=rim||fg;c.fill();c.beginPath();c.moveTo(-0.47,0.54);c.lineTo(0.47,0.54);c.lineTo(0.47,0.0);c.quadraticCurveTo(0.43,-0.42,0,-0.62);c.quadraticCurveTo(-0.43,-0.42,-0.47,0.0);c.closePath();c.fillStyle=bg;c.fill();}
  else{c.fillStyle=rim||fg;c.fillRect(-0.58,-0.66,1.16,1.32);c.fillStyle=bg;c.fillRect(-0.5,-0.58,1.0,1.16);}
  c.fillStyle=fg;c.beginPath();c.arc(0,0.36,0.13,0,7);c.fill();
  if(kind==='m'){c.fillRect(-0.17,0.14,0.34,0.17);c.fillRect(-0.17,-0.04,0.07,0.3);c.fillRect(0.1,-0.04,0.07,0.3);c.fillRect(-0.1,-0.36,0.08,0.34);c.fillRect(0.02,-0.36,0.08,0.34);c.beginPath();c.moveTo(-0.12,0.31);c.lineTo(0.12,0.31);c.lineTo(0.1,0.0);c.lineTo(-0.1,0.0);c.closePath();c.fill();}
  else{c.beginPath();c.moveTo(-0.08,0.28);c.lineTo(0.08,0.28);c.lineTo(0.22,-0.14);c.lineTo(-0.22,-0.14);c.closePath();c.fill();c.fillRect(-0.15,0.1,0.07,0.17);c.fillRect(0.08,0.1,0.07,0.17);c.fillRect(-0.1,-0.4,0.07,0.28);c.fillRect(0.03,-0.4,0.07,0.28);}
  c.restore();};
/* two matching door recesses on the front wall (y1) at X = -dx and +dx, door height dh; paints the dark recess, the leaf and a pictogram plaque above. opts: leaf colours, plaque style */
const RRDOOR=(c,I,u,y1,X,w,dh,leaf,leafD,frame)=>{BP(c,[I(X-w/2-0.12,y1+0.01,0),I(X+w/2+0.12,y1+0.01,0),I(X+w/2+0.12,y1+0.01,dh+0.12),I(X-w/2-0.12,y1+0.01,dh+0.12)],frame||'#e4e0d6');BP(c,[I(X-w/2,y1+0.02,0),I(X+w/2,y1+0.02,0),I(X+w/2,y1+0.02,dh),I(X-w/2,y1+0.02,dh)],'#1c1a18');
  BP(c,[I(X-w/2+0.08,y1+0.06,0),I(X+w/2-0.08,y1+0.06,0),I(X+w/2-0.08,y1+0.06,dh-0.08),I(X-w/2+0.08,y1+0.06,dh-0.08)],leaf);BP(c,[I(X+w/2-0.45,y1+0.07,0.1),I(X+w/2-0.08,y1+0.07,0.1),I(X+w/2-0.08,y1+0.07,dh-0.16),I(X+w/2-0.45,y1+0.07,dh-0.16)],leafD||shade(leaf,-0.25));
  TH.ell(c,...I(X-w/2+0.3,y1+0.08,dh*0.5),u*0.07,u*0.07,'#c8cfd8');};
/* drinking fountain / wash-up post (pedestal, bowl, tap) */
const RRFOUNT=(c,x,y,u,col)=>{TH.ell(c,x,y+u*0.1,u*0.55,u*0.2,'rgba(0,0,0,.2)');EGCYL_(c,x,y,u*0.3,u*0.12,u*1.4,[shade(col||'#b8c2cc',0.2),col||'#b8c2cc',shade(col||'#b8c2cc',-0.35)]);TH.ell(c,x,y-u*1.5,u*0.62,u*0.24,shade(col||'#b8c2cc',0.15));TH.ell(c,x,y-u*1.55,u*0.46,u*0.17,'#6fa8c8');TH.ln(c,[x+u*0.1,y-u*1.5],[x+u*0.1,y-u*2.0],'#8a96a4',u*0.1);TH.ln(c,[x+u*0.1,y-u*2.0],[x+u*0.4,y-u*2.0],'#8a96a4',u*0.1);};
/* a small round roof turbine vent / chimney cowl */
const RRVENT=(c,x,y,u,col)=>{TH.ln(c,[x,y],[x,y-u*0.8],'#8a96a4',u*0.28);c.fillStyle=col||'#c8d0d8';c.beginPath();c.ellipse(x,y-u*1.5,u*0.6,u*0.72,0,0,7);c.fill();for(let k=-2;k<=2;k++)TH.ln(c,[x+k*u*0.22,y-u*2.1],[x+k*u*0.2,y-u*0.9],'rgba(60,70,84,.4)',u*0.07);TH.ell(c,x,y-u*2.12,u*0.55,u*0.14,shade(col||'#c8d0d8',0.2));};
/* louvre vents: a row of slats on a wall plane */
const RRLOUVER=(c,I,y1,x0,x1,z0,z1,n,col,dk)=>{BP(c,[I(x0,y1+0.01,z0),I(x1,y1+0.01,z0),I(x1,y1+0.01,z1),I(x0,y1+0.01,z1)],dk||'#2a3038');for(let k=0;k<n;k++){const z=z0+(z1-z0)*(k+0.5)/n;BP(c,[I(x0+0.04,y1+0.04,z-0.05),I(x1-0.04,y1+0.04,z-0.05),I(x1-0.04,y1+0.08,z+0.06),I(x0+0.04,y1+0.08,z+0.06)],col||'#dfe5ea');}};
/* a small frosted window on the right wall (x1 plane) */
const RRSIDEWIN=(c,I,x1,Y,Z,w,h,glass,frame)=>{BP(c,[I(x1+0.01,Y-w/2-0.1,Z-h/2-0.1),I(x1+0.01,Y+w/2+0.1,Z-h/2-0.1),I(x1+0.01,Y+w/2+0.1,Z+h/2+0.1),I(x1+0.01,Y-w/2-0.1,Z+h/2+0.1)],frame||'#e4e0d6');BP(c,[I(x1+0.02,Y-w/2,Z-h/2),I(x1+0.02,Y+w/2,Z-h/2),I(x1+0.02,Y+w/2,Z+h/2),I(x1+0.02,Y-w/2,Z+h/2)],glass||'#cfe3ee');TH.ln(c,I(x1+0.03,Y,Z-h/2),I(x1+0.03,Y,Z+h/2),'rgba(255,255,255,.7)',1.2);};
const RESTROOM_ART={};

/* ===== RESTROOM ART, batch 1. Compact utility buildings: two doors with pictogram plaques, high louvres / small frosted windows, roof vents, a fountain or wash post outside. ===== */
const RRI=(x,y,u)=>(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);
const RRPL=(c,I,u,X,kind,fg,bg,shape,rim,Z)=>RRPICTO(c,...I(X,2.62,Z===undefined?2.95:Z),u,kind,fg,bg,shape,'F',rim);

/* ---- STANDARD: a modern park restroom block in the accent colour ---- */
RESTROOM_ART.standard={dy:0.05,k:1.15,draw(c,x,y,u,v,acc){const I=RRI(x,y,u),A=acc||'#0ea5e9',D=shade(A,-0.28);RSH_(c,x,y+u*0.5,u*7.2,u*3.2,'30,34,40');
  JBOX(c,x,y,u,-4.3,4.3,-2.6,2.6,0,0.5,'#aab3bd');JBOX(c,x,y,u,-4.2,4.2,-2.5,2.5,0.5,4.0,'#eceff2');
  for(let z=1.0;z<4.0;z+=0.45){TH.ln(c,I(-4.2,2.5,z),I(4.2,2.5,z),'rgba(120,130,144,.18)',u*0.05);}
  JBOX(c,x,y,u,-4.3,4.3,-2.6,2.6,3.65,4.0,A);
  RRDOOR(c,I,u,2.5,-2.2,1.5,2.1,D,shade(D,-0.2),'#f4f6f8');RRDOOR(c,I,u,2.5,2.2,1.5,2.1,D,shade(D,-0.2),'#f4f6f8');
  RRPL(c,I,u,-2.2,'m','#ffffff',A,'round','#f4f6f8',2.95);RRPL(c,I,u,2.2,'f','#ffffff',A,'round','#f4f6f8',2.95);
  RRLOUVER(c,I,2.5,-0.7,0.7,0.8,2.7,7,'#dfe5ea');
  RRSIDEWIN(c,I,4.2,0,2.2,1.0,0.9,'#cfe3ee','#f4f6f8');
  GAB(c,I,-4.7,4.7,-3.0,3.0,4.0,1.1,0.45,A,D,u,5);RRVENT(c,...I(-2.6,0,5.2),u*0.62,'#c8d0d8');RRVENT(c,...I(2.6,0,5.2),u*0.62,'#c8d0d8');
  RRFOUNT(c,...I(-5.4,3.4,0),u,'#b8c2cc');
  const bn=I(5.6,3.2,0);TH.ell(c,bn[0],bn[1]+u*0.1,u*0.6,u*0.22,'rgba(0,0,0,.2)');EGCYL_(c,bn[0],bn[1],u*0.5,u*0.2,u*1.5,['#8fa0b0','#6f8090','#4a5a6a']);TH.ell(c,bn[0],bn[1]-u*1.5,u*0.5,u*0.18,'#38444f');
  const bc=I(0.0,3.6,0);JBOX(c,x,y,u,-1.4,1.4,3.3,3.9,0,0.55,'#b9a07a');JBOX(c,x,y,u,-1.4,1.4,3.75,3.85,0.55,1.1,'#b9a07a');RPOST(c,I,-1.3,3.5,0,1.1,'#6a5a46',u,0.14);RPOST(c,I,1.3,3.5,0,1.1,'#6a5a46',u,0.14);}};

/* ---- WESTERN: a board-and-batten privy house (two plank doors with crescent-moon cut-outs, hand-painted signs, a pump) ---- */
RESTROOM_ART.western={dy:0.05,k:1.2,draw(c,x,y,u,v){const I=RRI(x,y,u),wood='#b8895a',woodD='#8a5f38';RSH_(c,x,y+u*0.5,u*7.0,u*3.0,'50,36,20');
  JBOX(c,x,y,u,-3.9,3.9,-2.4,2.4,0,4.0,wood);for(let k=0;k<17;k++){TH.ln(c,I(-3.9+k*0.49,2.4,0),I(-3.9+k*0.49,2.4,4.0),'rgba(60,34,12,.45)',u*0.09);}for(let k=0;k<10;k++)TH.ln(c,I(3.9,-2.4+k*0.52,0),I(3.9,-2.4+k*0.52,4.0),'rgba(50,28,10,.45)',u*0.08);
  for(let k=0;k<17;k++){TH.ln(c,I(-3.7+k*0.49,2.41,0),I(-3.7+k*0.49,2.41,4.0),'rgba(255,225,170,.14)',u*0.05);}
  [-1.9,1.9].forEach((X,i)=>{BP(c,[I(X-0.8,2.42,0),I(X+0.8,2.42,0),I(X+0.8,2.42,2.5),I(X-0.8,2.42,2.5)],'#4a2e18');BP(c,[I(X-0.7,2.44,0),I(X+0.7,2.44,0),I(X+0.7,2.44,2.4),I(X-0.7,2.44,2.4)],'#9a6a3a');for(let k=0;k<4;k++)TH.ln(c,I(X-0.7+k*0.47,2.45,0),I(X-0.7+k*0.47,2.45,2.4),'rgba(40,20,6,.5)',u*0.07);TH.ln(c,I(X-0.7,2.46,0.5),I(X+0.7,2.46,0.5),'#5a3a1e',u*0.14);TH.ln(c,I(X-0.7,2.46,1.9),I(X+0.7,2.46,1.9),'#5a3a1e',u*0.14);
    const m=I(X,2.47,2.0);c.fillStyle='#14100c';c.beginPath();c.arc(m[0]+u*0.0,m[1]-u*0.0,u*0.2,Math.PI*0.35,Math.PI*1.75,false);c.arc(m[0]+u*0.1,m[1]+u*0.0,u*0.16,Math.PI*1.7,Math.PI*0.4,true);c.fill();
    RRPICTO(c,...I(X,2.5,3.05),u,i?'f':'m','#4a2e18','#f2e2bf','rect','F','#6a4a2a');TH.ell(c,...I(X+0.45,2.46,0.9),u*0.07,u*0.07,'#2a1a10');});
  const z0=4.0;BP(c,[I(4.3,-2.4,z0),I(4.3,2.4,z0),I(4.3,2.4,z0+0.0)],'#7a5a3a');
  GAB(c,I,-4.4,4.4,-2.9,2.9,z0,1.5,0.4,'#6a4a30','#4a3220',u,6);
  JBOX(c,x,y,u,-3.0,-2.2,-1.6,-0.8,4.2,6.0,'#8a8078');JBOX(c,x,y,u,-3.1,-2.1,-1.7,-0.7,6.0,6.2,'#6f6760');
  RLANTERN(c,...I(0,2.7,3.1),u*1.0);
  const pm=I(5.3,3.4,0);TH.ell(c,pm[0],pm[1]+u*0.1,u*0.8,u*0.3,'rgba(0,0,0,.2)');EGCYL_(c,pm[0],pm[1],u*0.45,u*0.18,u*0.9,['#6a6a70','#4a4a52','#2e2e34']);TH.ln(c,[pm[0],pm[1]-u*0.9],[pm[0],pm[1]-u*2.6],'#4a4a52',u*0.34);TH.ln(c,[pm[0],pm[1]-u*2.5],[pm[0]-u*0.9,pm[1]-u*2.2],'#3a3a40',u*0.2);TH.ln(c,[pm[0]+u*0.5,pm[1]-u*2.8],[pm[0]+u*1.2,pm[1]-u*3.5],'#3a3a40',u*0.2);TH.ell(c,pm[0]-u*0.9,pm[1]-u*1.1,u*0.2,u*0.2,'#6fa8c8');
  const tr=I(-5.2,3.6,0);BT(c,I,-6.5,-3.9,3.0,4.0,0.6,'#8a5a30');BF(c,I,-6.5,-3.9,4.0,0,0.6,'#6a4326');TH.ell(c,...I(-5.2,3.5,0.62),u*1.2,u*0.3,'#5a8aa8');
  [[5.0,-2.9],[6.3,-2.6]].forEach(([X,Y])=>{});}};

/* ---- MEDIEVAL: a stone privy house with arched oak doors and heraldic shield signs ---- */
RESTROOM_ART.medieval={dy:0.05,k:1.18,draw(c,x,y,u,v){const I=RRI(x,y,u),stone='#9c9a90';RSH_(c,x,y+u*0.5,u*7.0,u*3.0,'30,34,24');
  JBOX(c,x,y,u,-4.1,4.1,-2.5,2.5,0,4.0,stone);for(let z=0.5;z<4.0;z+=0.5){TH.ln(c,I(-4.1,2.5,z),I(4.1,2.5,z),'rgba(40,40,34,.34)',u*0.06);TH.ln(c,I(4.1,-2.5,z),I(4.1,2.5,z),'rgba(30,30,26,.34)',u*0.06);}for(let k=0;k<9;k++)for(let r=0;r<7;r++)TH.ln(c,I(-3.9+k*0.95+(r%2)*0.47,2.51,0.03+r*0.5),I(-3.9+k*0.95+(r%2)*0.47,2.51,0.47+r*0.5),'rgba(40,40,34,.28)',u*0.05);
  /* a timber beam course and two arched oak doors with iron straps */
  TH.ln(c,I(-4.1,2.5,3.9),I(4.1,2.5,3.9),'#4a2e1a',u*0.3);TH.ln(c,I(4.1,-2.5,3.9),I(4.1,2.5,3.9),'#4a2e1a',u*0.3);
  [-1.9,1.9].forEach((X,i)=>{const w=0.85;BP(c,[I(X-w-0.1,2.52,0),I(X+w+0.1,2.52,0),I(X+w+0.1,2.52,1.9)].concat([0.2,0.4,0.6,0.8,1.0].map(t=>{const a=Math.PI*t;return I(X+(w+0.1)*Math.cos(a),2.52,1.9+(w+0.1)*Math.sin(a));})).concat([I(X-w-0.1,2.52,1.9)]),'#6a665e');BP(c,[I(X-w,2.54,0),I(X+w,2.54,0),I(X+w,2.54,1.9)].concat([0.2,0.4,0.6,0.8,1.0].map(t=>{const a=Math.PI*t;return I(X+w*Math.cos(a),2.54,1.9+w*Math.sin(a));})).concat([I(X-w,2.54,1.9)]),'#6a4426');
    for(let k=1;k<4;k++)TH.ln(c,I(X-w+k*w*0.5,2.55,0),I(X-w+k*w*0.5,2.55,2.6),'rgba(30,16,6,.5)',u*0.06);TH.ln(c,I(X-w,2.56,0.6),I(X+w,2.56,0.6),'#2a2a30',u*0.14);TH.ln(c,I(X-w,2.56,1.4),I(X+w,2.56,1.4),'#2a2a30',u*0.14);TH.ell(c,...I(X+0.45,2.57,1.0),u*0.09,u*0.09,'#2a2a30');
    RRPL(c,I,u,X,i?'f':'m','#f2c230','#1f3a7a','shield','#c8a040',2.95);});
  /* arrow slits on the right wall, a shingled hip roof in the inn's maroon */
  [-1.2,1.2].forEach(Y=>{BP(c,[I(4.12,Y-0.1,1.4),I(4.12,Y+0.1,1.4),I(4.12,Y+0.1,2.8),I(4.12,Y-0.1,2.8)],'#14100c');});
  HIP(c,I,-4.4,4.4,-2.8,2.8,4.0,2.5,0.45,'#6b1f2a','#4a1420',u,5);
  JBOX(c,x,y,u,2.4,3.4,-1.2,-0.2,5.2,7.6,'#8a8a82');JBOX(c,x,y,u,2.3,3.5,-1.3,-0.1,7.6,7.9,'#767670');
  /* well and bucket */
  const wl=I(5.4,3.4,0);EGCYL_(c,wl[0],wl[1],u*0.95,u*0.38,u*1.1,['#b0aea4','#9c9a90','#6a6a62']);TH.ell(c,wl[0],wl[1]-u*1.1,u*0.8,u*0.3,'#35506a');RPOST(c,I,5.0,3.4,1.1,2.9,'#6a4a2a',u,0.18);RPOST(c,I,5.8,3.4,1.1,2.9,'#6a4a2a',u,0.18);TH.ln(c,I(4.95,3.4,2.9),I(5.85,3.4,2.9),'#6a4a2a',u*0.16);TH.ln(c,I(5.4,3.4,2.9),I(5.4,3.4,2.0),'#4a3a2a',u*0.06);EGCYL_(c,...I(5.4,3.4,2.0),u*0.25,u*0.1,u*0.4,['#8a5a30','#6a4326','#4a2e18']);
  RBARREL(c,...I(-5.3,3.4,0),u*1.0,'#8a5a30');}};

/* ---- BAVARIAN: a painted timber Häuschen (blue-and-white doors with heart cut-outs, scalloped gable boards, flower boxes) ---- */
RESTROOM_ART.bavarian={dy:0.05,k:1.2,draw(c,x,y,u,v){const I=RRI(x,y,u),blue='#2a6ab0';RSH_(c,x,y+u*0.5,u*7.0,u*3.0,'30,40,24');
  JBOX(c,x,y,u,-4.0,4.0,-2.4,2.4,0,1.2,'#b88a50');JBOX(c,x,y,u,-4.0,4.0,-2.4,2.4,1.2,4.0,'#f4ede0');for(let k=0;k<17;k++)TH.ln(c,I(-4.0+k*0.5,2.4,0),I(-4.0+k*0.5,2.4,1.2),'rgba(60,34,12,.35)',u*0.07);
  TH.ln(c,I(-4.0,2.4,1.2),I(4.0,2.4,1.2),'#6a4a2a',u*0.2);TH.ln(c,I(4.0,-2.4,1.2),I(4.0,2.4,1.2),'#6a4a2a',u*0.2);[-4.0,-2.0,0,2.0,4.0].forEach(X=>TH.ln(c,I(X,2.4,1.2),I(X,2.4,4.0),'#6a4a2a',u*0.2));
  [-1.0,1.0].forEach((X,i)=>{const cx=X*2.0;BP(c,[I(cx-0.8,2.42,0),I(cx+0.8,2.42,0),I(cx+0.8,2.42,2.4),I(cx-0.8,2.42,2.4)],'#3a2412');BP(c,[I(cx-0.7,2.44,0),I(cx+0.7,2.44,0),I(cx+0.7,2.44,2.3),I(cx-0.7,2.44,2.3)],blue);for(let k=0;k<3;k++)for(let r=0;r<3;r++){const p=I(cx-0.4+k*0.4,2.45,0.5+r*0.6);TH.poly(c,[[p[0],p[1]-u*0.22],[p[0]+u*0.22,p[1]],[p[0],p[1]+u*0.22],[p[0]-u*0.22,p[1]]],'#f7f4ea');}
    const h=I(cx,2.46,1.9);c.fillStyle='#d9433b';c.beginPath();c.moveTo(h[0],h[1]+u*0.28);c.bezierCurveTo(h[0]-u*0.6,h[1]-u*0.15,h[0]-u*0.2,h[1]-u*0.5,h[0],h[1]-u*0.2);c.bezierCurveTo(h[0]+u*0.2,h[1]-u*0.5,h[0]+u*0.6,h[1]-u*0.15,h[0],h[1]+u*0.28);c.fill();
    RRPICTO(c,...I(cx,2.5,2.95),u,i?'f':'m',blue,'#f7f4ea','round','F','#c8842a');});
  /* flower boxes under little shuttered windows on the ends */
  const gz=4.0;GAB(c,I,-4.4,4.4,-2.8,2.8,gz,1.8,0.5,'#8a4a2a','#6a3a22',u,6);
  for(let k=0;k<12;k++){const a=I(-4.4+k*0.74,2.8,gz),b=I(-3.66+k*0.74,2.8,gz);TH.poly(c,[a,b,[(a[0]+b[0])/2,(a[1]+b[1])/2+u*0.45]],k%2?blue:'#f7f4ea');}
  JBOX(c,x,y,u,3.2,4.0,-0.2,0.4,0,0.0,'#b88a50');
  JBOX(c,x,y,u,-3.7,-2.3,2.5,3.0,0.5,1.0,'#8a5a30');for(let k=0;k<5;k++)TH.ell(c,...I(-3.6+k*0.28,2.9,1.1),u*0.17,u*0.2,['#d9433b','#e86aa8','#d9433b','#f2c230','#d9433b'][k]);
  JBOX(c,x,y,u,2.3,3.7,2.5,3.0,0.5,1.0,'#8a5a30');for(let k=0;k<5;k++)TH.ell(c,...I(2.4+k*0.28,2.9,1.1),u*0.17,u*0.2,['#d9433b','#e86aa8','#d9433b','#f2c230','#d9433b'][k]);
  const bn=I(5.2,3.4,0);RBARREL(c,bn[0],bn[1],u*1.1,'#8a5a30');RRFOUNT(c,...I(-5.2,3.4,0),u,'#b88a50');}};

/* ---- JUNGLE: a salvaged outpost latrine (planked walls, corrugated lean-to roof, carved wooden plaques, a rain barrel) ---- */
RESTROOM_ART.jungle={dy:0.05,k:1.2,draw(c,x,y,u,v){const I=RRI(x,y,u),plank='#8a6a46';RSH_(c,x,y+u*0.5,u*7.0,u*3.0,'14,40,22');
  JBOX(c,x,y,u,-4.0,4.0,-2.4,2.4,0,4.3,plank);for(let k=0;k<16;k++)TH.ln(c,I(-4.0+k*0.5,2.4,0),I(-4.0+k*0.5,2.4,4.3),'rgba(40,24,10,.32)',u*0.06);for(let k=0;k<10;k++)TH.ln(c,I(4.0,-2.4+k*0.5,0),I(4.0,-2.4+k*0.5,4.3),'rgba(30,18,8,.34)',u*0.06);
  [-1.9,1.9].forEach((X,i)=>{BP(c,[I(X-0.85,2.42,0),I(X+0.85,2.42,0),I(X+0.85,2.42,2.5),I(X-0.85,2.42,2.5)],'#2a1c10');for(let k=0;k<5;k++)TH.ln(c,I(X-0.75+k*0.375,2.44,0.05),I(X-0.75+k*0.375,2.44,2.4),k%2?'#c9b060':'#b49a48',u*0.3);TH.ln(c,I(X-0.8,2.46,0.8),I(X+0.8,2.46,0.8),'#5a4a1e',u*0.1);TH.ln(c,I(X-0.8,2.46,1.7),I(X+0.8,2.46,1.7),'#5a4a1e',u*0.1);
    RRPICTO(c,...I(X,2.5,3.05),u,i?'f':'m','#fff3d0','#5a3a1e','rect','F','#2e4a30');});
  /* corrugated lean-to roof, a little rust */
  const A=I(-4.5,3.0,4.5),B=I(4.5,3.0,4.5),C2=I(4.5,-2.6,5.6),D=I(-4.5,-2.6,5.6);BP(c,[A,B,C2,D],'#5f8f78');RCLIP(c,[A,B,C2,D],()=>{for(let k=0;k<44;k++){const t=k/43,a=[A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t],b=[D[0]+(C2[0]-D[0])*t,D[1]+(C2[1]-D[1])*t];TH.ln(c,a,b,k%2?'rgba(20,50,40,.3)':'rgba(255,255,255,.12)',u*0.07);}[[0.3,0.5],[0.7,0.3],[0.5,0.8]].forEach(([s,t])=>TH.ell(c,A[0]+(B[0]-A[0])*s+(D[0]-A[0])*t,A[1]+(B[1]-A[1])*s+(D[1]-A[1])*t,u*0.7,u*0.35,'rgba(150,80,40,.35)'));});BP(c,[I(4.5,-2.6,4.3),I(4.5,3.0,4.5),I(4.5,-2.6,5.6)],'#4a6e5c');TH.ln(c,A,B,'#3a5a48',u*0.14);
  RRLOUVER(c,I,2.4,-0.6,0.6,1.0,2.6,6,'#c9b060','#3a2a14');
  /* hanging vines, big leaves, a rain barrel with a funnel, lantern */
  for(let k=0;k<7;k++){const p=I(-3.9+k*1.3,2.6,3.9);TH.ln(c,p,[p[0]+(k%2?1:-1)*u*0.2,p[1]+u*(1.2+(k%3)*0.6)],'#3f8a45',u*0.13);}
  [[-4.6,3.0],[4.7,3.0]].forEach(([X,Y],i)=>{const p=I(X,Y,0);for(let j=0;j<6;j++){const a=-Math.PI*0.95+j/5*Math.PI*0.9;TH.ln(c,[p[0],p[1]],[p[0]+Math.cos(a)*u*1.6,p[1]+Math.sin(a)*u*1.2-u*0.4],j%2?'#3f8a45':'#58a04f',u*0.36);}});
  const rb=I(5.6,0.6,0);RBARREL(c,rb[0],rb[1],u*1.4,'#7a5a3a');TH.poly(c,[[rb[0]-u*0.5,rb[1]-u*1.55],[rb[0]+u*0.5,rb[1]-u*1.55],[rb[0]+u*0.15,rb[1]-u*2.2],[rb[0]-u*0.15,rb[1]-u*2.2]],'#c8d0d8');
  RLANTERN(c,...I(0,2.7,3.0),u*0.9);RRFOUNT(c,...I(-5.4,3.4,0),u,'#9a8a60');}};

/* ---- TIKI: a thatched Polynesian hut with carved tiki door posts and bamboo plaques ---- */
RESTROOM_ART.tiki={dy:0.05,k:1.2,draw(c,x,y,u,v){const I=RRI(x,y,u),bam='#c9a860';RSH_(c,x,y+u*0.5,u*7.0,u*3.0,'20,40,16');
  JBOX(c,x,y,u,-4.2,4.2,-2.6,2.6,0,0.4,'#8a5e34');JBOX(c,x,y,u,-3.9,3.9,-2.3,2.3,0.4,4.4,bam);for(let k=0;k<18;k++)TH.ln(c,I(-3.9+k*0.46,2.3,0.4),I(-3.9+k*0.46,2.3,4.4),'rgba(90,60,20,.4)',u*0.07);for(let k=0;k<10;k++)TH.ln(c,I(3.9,-2.3+k*0.5,0.4),I(3.9,-2.3+k*0.5,4.4),'rgba(70,46,14,.4)',u*0.07);
  [-1.9,1.9].forEach((X,i)=>{BP(c,[I(X-0.8,2.32,0.4),I(X+0.8,2.32,0.4),I(X+0.8,2.32,2.5),I(X-0.8,2.32,2.5)],'#2a1a0c');BP(c,[I(X-0.65,2.34,0.4),I(X+0.65,2.34,0.4),I(X+0.65,2.34,2.4),I(X-0.65,2.34,2.4)],'#7a5a2a');for(let k=0;k<5;k++)TH.ln(c,I(X-0.6,2.35,0.7+k*0.38),I(X+0.6,2.35,0.7+k*0.38),'rgba(40,24,6,.5)',u*0.07);
    [-1,1].forEach(sg=>{const p=I(X+sg*1.15,2.4,0.4);TH.ln(c,[p[0],p[1]],[p[0],p[1]-u*2.5],['#6a4426','#4a2e18'][i],u*0.5);TH.ell(c,p[0],p[1]-u*1.5,u*0.2,u*0.13,'#fff6dc');TH.ell(c,p[0],p[1]-u*1.95,u*0.2,u*0.13,'#fff6dc');TH.ell(c,p[0],p[1]-u*1.5,u*0.08,u*0.08,'#1a1008');TH.ell(c,p[0],p[1]-u*1.95,u*0.08,u*0.08,'#1a1008');TH.poly(c,[[p[0]-u*0.16,p[1]-u*1.15],[p[0]+u*0.16,p[1]-u*1.15],[p[0],p[1]-u*0.9]],'#2a1a10');});
    RRPICTO(c,...I(X,2.4,3.22),u,i?'f':'m','#fff6dc','#6a4426','rect','F','#c8661e');});
  const z0=4.4,H=2.7,A=I(-4.6,3.1,z0),B=I(4.6,3.1,z0),R1=I(4.6,0,z0+H),R0=I(-4.6,0,z0+H);BP(c,[I(4.2,-2.6,z0),I(4.2,2.8,z0),I(4.2,0.1,z0+H*0.9)],'#a07c3a');RTHATCH(c,[A,B,R1,R0],u,'#caa55a','rgba(110,76,24,.5)',8);for(let k=0;k<20;k++){const t=k/19,p=[A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t];TH.poly(c,[[p[0]-u*0.24,p[1]],[p[0]+u*0.24,p[1]],[p[0],p[1]+u*0.5]],k%2?'#b8924a':'#caa55a');}TH.ln(c,R0,R1,'#6a4426',u*0.3);
  [[-3.4,3.5],[3.4,3.5]].forEach(([X,Y])=>{const p=I(X,Y,0);RTORCH(c,p[0],p[1],u,u*2.8);});
  const bw=I(-5.2,3.4,0);TH.ell(c,bw[0],bw[1]+u*0.1,u*0.9,u*0.3,'rgba(0,0,0,.2)');TH.poly(c,[[bw[0]-u*0.9,bw[1]-u*1.0],[bw[0]+u*0.9,bw[1]-u*1.0],[bw[0]+u*0.6,bw[1]],[bw[0]-u*0.6,bw[1]]],'#8a5a30');TH.ell(c,bw[0],bw[1]-u*1.0,u*0.9,u*0.3,'#6fa8c8');TH.ell(c,bw[0],bw[1]-u*0.98,u*0.7,u*0.2,'#9cc8e0');
  const bq=I(5.4,3.2,0);for(let k=0;k<3;k++)TH.ln(c,[bq[0]+(k-1)*u*0.3,bq[1]],[bq[0]+(k-1)*u*0.4,bq[1]-u*1.6-k*u*0.3],'#5aa84a',u*0.2);}};

/* ---- CARIBBEAN: an aqua clapboard cottage with louvred coral doors, ornate plaques and rum barrels ---- */
RESTROOM_ART.caribbean={dy:0.05,k:1.2,draw(c,x,y,u,v){const I=RRI(x,y,u),aqua='#7fd0c8';RSH_(c,x,y+u*0.5,u*7.0,u*3.0,'30,34,34');
  JBOX(c,x,y,u,-4.0,4.0,-2.4,2.4,0,0.6,'#e9dfc2');JBOX(c,x,y,u,-4.0,4.0,-2.4,2.4,0.6,4.0,aqua);for(let z=0.85;z<4.0;z+=0.3){TH.ln(c,I(-4.0,2.4,z),I(4.0,2.4,z),'rgba(30,100,100,.2)',u*0.05);TH.ln(c,I(4.0,-2.4,z),I(4.0,2.4,z),'rgba(30,100,100,.22)',u*0.05);}
  [-1.9,1.9].forEach((X,i)=>{BP(c,[I(X-0.9,2.42,0.6),I(X+0.9,2.42,0.6),I(X+0.9,2.42,2.7),I(X-0.9,2.42,2.7)],'#fff3e0');BP(c,[I(X-0.75,2.44,0.6),I(X+0.75,2.44,0.6),I(X+0.75,2.44,2.6),I(X-0.75,2.44,2.6)],'#e86a5a');for(let k=0;k<8;k++)TH.ln(c,I(X-0.75,2.45,0.8+k*0.22),I(X+0.75,2.45,0.9+k*0.22),'rgba(90,20,10,.45)',u*0.07);
    RRPICTO(c,...I(X,2.5,3.0),u,i?'f':'m','#f2c230','#1f2f5a','round','F','#c8a040');});
  const gz=4.0;HIP(c,I,-4.4,4.4,-2.8,2.8,gz,2.0,0.5,'#7a5e48','#5e4636',u,5);JBOX(c,x,y,u,2.6,3.5,-1.2,-0.3,5.6,7.6,'#b8a07a');JBOX(c,x,y,u,2.5,3.6,-1.3,-0.2,7.6,7.9,'#8a7656');
  RRSIDEWIN(c,I,4.0,0.0,2.2,1.0,0.9,'#cfe3ee','#fff3e0');
  [[5.2,3.2],[6.0,2.4],[-5.2,3.4]].forEach(([X,Y],i)=>{const p=I(X,Y,0);RBARREL(c,p[0],p[1],u*1.1,i===1?'#7a5230':'#9a6a3a');});
  const rp=I(-4.2,3.6,0);const cl=I(-4.6,4.0,0);TH.ell(c,cl[0],cl[1],u*0.7,u*0.26,'#c8a070');TH.ell(c,cl[0],cl[1]-u*0.25,u*0.55,u*0.2,'#d8b888');
  TH.ln(c,I(4.6,3.0,0),I(4.6,3.0,3.8),'#5a4a38',u*0.14);TH.poly(c,[I(4.6,3.0,3.8),I(5.8,3.0,3.5),I(5.8,3.0,2.5),I(4.6,3.0,2.8)],'#1c1c22');const fl=I(5.2,3.0,3.1);TH.ell(c,fl[0],fl[1],u*0.22,u*0.22,'#f4f4f0');TH.ln(c,[fl[0]-u*0.3,fl[1]+u*0.3],[fl[0]+u*0.3,fl[1]-u*0.1],'#f4f4f0',u*0.08);}};

/* ---- ALPS: a log cabin with heart cut-outs, a snow roof, icicles and a woodpile ---- */
RESTROOM_ART.alps={dy:0.05,k:1.2,draw(c,x,y,u,v){const I=RRI(x,y,u),log='#a5683a';RSH_(c,x,y+u*0.5,u*7.0,u*3.0,'40,50,70');
  JBOX(c,x,y,u,-4.0,4.0,-2.4,2.4,0,0.8,'#8d9198');JBOX(c,x,y,u,-4.0,4.0,-2.4,2.4,0.8,3.8,log);for(let z=1.0;z<3.8;z+=0.4){TH.ln(c,I(-4.0,2.4,z),I(4.0,2.4,z),'rgba(60,30,10,.4)',u*0.07);TH.ln(c,I(4.0,-2.4,z),I(4.0,2.4,z),'rgba(50,24,8,.42)',u*0.07);}for(let z=1.0;z<3.8;z+=0.4){const q=I(-4.0,2.4,z);TH.ell(c,q[0],q[1],u*0.18,u*0.2,'#c88a52');}
  [-1.9,1.9].forEach((X,i)=>{BP(c,[I(X-0.85,2.42,0.8),I(X+0.85,2.42,0.8),I(X+0.85,2.42,2.7),I(X-0.85,2.42,2.7)],'#3a2412');BP(c,[I(X-0.72,2.44,0.8),I(X+0.72,2.44,0.8),I(X+0.72,2.44,2.6),I(X-0.72,2.44,2.6)],'#7a4a26');for(let k=1;k<3;k++)TH.ln(c,I(X-0.72+k*0.48,2.45,0.8),I(X-0.72+k*0.48,2.45,2.6),'rgba(30,16,6,.5)',u*0.06);const h=I(X,2.46,2.15);c.fillStyle='#14100c';c.beginPath();c.moveTo(h[0],h[1]+u*0.22);c.bezierCurveTo(h[0]-u*0.5,h[1]-u*0.1,h[0]-u*0.15,h[1]-u*0.4,h[0],h[1]-u*0.15);c.bezierCurveTo(h[0]+u*0.15,h[1]-u*0.4,h[0]+u*0.5,h[1]-u*0.1,h[0],h[1]+u*0.22);c.fill();
    RRPICTO(c,...I(X,2.5,2.85),u,i?'f':'m','#ffffff','#b83a2a','round','F','#f6efe0');});
  const z0=3.8,H=1.9,A=I(-4.5,3.2,z0),B=I(4.5,3.2,z0),R1=I(4.5,0,z0+H),R0=I(-4.5,0,z0+H);BP(c,[I(4.1,-2.5,z0),I(4.1,2.5,z0),I(4.1,0,z0+H*0.85)],'#eaf1fb');BP(c,[A,B,R1,R0],'#f7faff');RCLIP(c,[A,B,R1,R0],()=>{for(let k=0;k<3;k++){const t=(k+1)/4;TH.ln(c,[A[0]+(R0[0]-A[0])*t,A[1]+(R0[1]-A[1])*t],[B[0]+(R1[0]-B[0])*t,B[1]+(R1[1]-B[1])*t],'rgba(150,176,214,.35)',u*0.14);}});TH.ln(c,A,B,'#7a5a3a',u*0.2);TH.ln(c,R0,R1,'#dfe9f7',u*0.26);
  for(let k=0;k<14;k++){const t=k/13,p=[A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t];TH.poly(c,[[p[0]-u*0.12,p[1]],[p[0]+u*0.12,p[1]],[p[0],p[1]+u*(0.3+((k*7)%5)*0.16)]],'rgba(214,232,252,.9)');}
  RRVENT(c,...I(2.0,0.2,5.6),u*0.9,'#c8d0d8');
  /* woodpile, snow drifts and a pine, a lantern */
  [[5.0,0.6],[5.0,-0.4]].forEach(([X,Y],i)=>{});JBOX(c,x,y,u,4.4,6.0,-0.8,0.8,0,1.2,'#9a5e30');for(let k=0;k<6;k++)TH.ell(c,...I(6.01,-0.6+k*0.26,0.3+(k%2)*0.4),u*0.16,u*0.18,'#d8a870');TH.poly(c,[I(4.3,-0.9,1.2),I(6.1,-0.9,1.2),I(6.1,0.9,1.2),I(4.3,0.9,1.2)],'#f1f6fd');
  [[-4.4,3.9,1.7],[0.8,4.2,2.0]].forEach(([X,Y,s])=>{const p=I(X,Y,0);TH.ell(c,p[0],p[1],u*s,u*s*0.34,'#eef4fc');TH.ell(c,p[0]-u*s*0.2,p[1]-u*s*0.1,u*s*0.6,u*s*0.2,'#ffffff');});
  const pn=I(-5.3,1.8,0);for(let k=0;k<3;k++)TH.poly(c,[[pn[0]-u*(1.2-k*0.28),pn[1]-u*k*1.0],[pn[0]+u*(1.2-k*0.28),pn[1]-u*k*1.0],[pn[0],pn[1]-u*(k*1.0+1.7)]],k%2?'#2f6a46':'#3a7a52');TH.poly(c,[[pn[0]-u*0.7,pn[1]-u*0.9],[pn[0]+u*0.7,pn[1]-u*0.9],[pn[0],pn[1]-u*1.7]],'rgba(255,255,255,.55)');
  RLANTERN(c,...I(0,2.7,3.2),u*0.9);RRFOUNT(c,...I(-5.4,3.6,0),u,'#9aa6b4');}};

/* ===== RESTROOM ART, batch 2 ===== */
/* ---- GOTHIC: a low crypt-style convenience (dark stone, lancet arches, iron-strapped doors, glowing slit windows, finials) ---- */
RESTROOM_ART.gothic={dy:0.05,k:1.2,draw(c,x,y,u,v){const I=RRI(x,y,u),stone='#3b3a48';RSH_(c,x,y+u*0.5,u*7.0,u*3.0,'10,8,20');
  [[-4.6,3.8,2.2],[4.4,4.2,1.8],[0.6,4.6,2.4]].forEach(([X,Y,s])=>{const p=I(X,Y,0.2);SOFT_(c,p[0],p[1],u*s*1.6,u*s*0.5,'150,150,180',0.28);});
  JBOX(c,x,y,u,-4.1,4.1,-2.5,2.5,0,4.0,stone);for(let z=0.5;z<4.0;z+=0.5){TH.ln(c,I(-4.1,2.5,z),I(4.1,2.5,z),'rgba(10,10,20,.4)',u*0.06);TH.ln(c,I(4.1,-2.5,z),I(4.1,2.5,z),'rgba(10,10,20,.4)',u*0.06);}for(let k=0;k<9;k++)for(let r=0;r<8;r++)TH.ln(c,I(-3.9+k*0.95+(r%2)*0.47,2.51,0.03+r*0.5),I(-3.9+k*0.95+(r%2)*0.47,2.51,0.47+r*0.5),'rgba(10,10,20,.3)',u*0.05);
  JBOX(c,x,y,u,-4.3,4.3,-2.7,2.7,0,0.45,'#2a2936');
  [-4.1,4.1].forEach(X=>{JBOX(c,x,y,u,X-0.25,X+0.25,2.3,2.8,0,4.3,'#46455a');TH.poly(c,[I(X-0.3,2.85,4.3),I(X+0.3,2.85,4.3),I(X,2.85,5.1)],'#14101c');});
  [-1.9,1.9].forEach((X,i)=>{const pts=(w,dz,Y)=>{const a=[I(X-w,Y,0),I(X+w,Y,0),I(X+w,Y,1.9)];for(let k=1;k<=8;k++){const s=k/8,q=1-s;a.push(I(X+w*(q*q*1+2*q*s*0.85),Y,1.9+dz*(2*q*s*0.85+s*s)));}return a;};
    const o=[I(X-0.95,2.52,0),I(X+0.95,2.52,0),I(X+0.95,2.52,2.0)],pt=(w,Y)=>{const L=[I(X-w,Y,0),I(X+w,Y,0),I(X+w,Y,1.9)];for(let k=1;k<=8;k++){const s=k/8,q=1-s;L.push(I(X+w*(q*q+2*q*s*0.78),Y,1.9+(q*q*0+2*q*s*0.9+s*s)*1.0*0+ (2*q*s*0.9+s*s)*1.0));}for(let k=7;k>=1;k--){const s=k/8,q=1-s;L.push(I(X-w*(q*q+2*q*s*0.78),Y,1.9+(2*q*s*0.9+s*s)*1.0));}L.push(I(X-w,Y,1.9));return L;};
    BP(c,pt(0.95,2.52),'#6a6a7e');BP(c,pt(0.8,2.54),'#1c1a26');BP(c,pt(0.7,2.56),'#2e2a38');TH.ln(c,I(X,2.58,0),I(X,2.58,2.5),'#14101c',u*0.07);TH.ln(c,I(X-0.7,2.58,0.6),I(X+0.7,2.58,0.6),'#14101c',u*0.14);TH.ln(c,I(X-0.7,2.58,1.4),I(X+0.7,2.58,1.4),'#14101c',u*0.14);TH.ell(c,...I(X+0.4,2.59,1.0),u*0.09,u*0.09,'#8a8a98');
    RRPICTO(c,...I(X,2.6,3.05),u,i?'f':'m','#ffcf5a','#1c1a26','shield','#7a7a90');GLOW(c,...I(X,2.7,3.2),u*1.8,'255,190,70',0.35);});
  [-1.2,1.2].forEach(Y=>{const w=0.4,pts=[I(4.12,Y-w/2,1.2),I(4.12,Y+w/2,1.2),I(4.12,Y+w/2,2.6),I(4.12,Y,3.0),I(4.12,Y-w/2,2.6)];BP(c,pts,'#ffcf5a');GLOW(c,...I(4.15,Y,2.2),u*2.0,'255,190,70',0.5);});
  GAB(c,I,-4.5,4.5,-2.9,2.9,4.0,3.0,0.4,'#2f2d3f','#25233a',u,6);BP(c,[I(4.1,-2.5,4.0),I(4.1,2.5,4.0),I(4.1,0,6.4)],'#25233a');
  const cr=I(4.4,0,7.0);TH.ln(c,[cr[0],cr[1]],[cr[0],cr[1]-u*1.8],'#14101c',u*0.18);TH.ln(c,[cr[0]-u*0.5,cr[1]-u*1.2],[cr[0]+u*0.5,cr[1]-u*1.2],'#14101c',u*0.18);
  const cr2=I(-4.4,0,7.0);TH.poly(c,[[cr2[0]-u*0.25,cr2[1]],[cr2[0]+u*0.25,cr2[1]],[cr2[0],cr2[1]-u*1.6]],'#14101c');
  RRFOUNT(c,...I(-5.4,3.8,0),u,'#4a4960');[[5.2,3.6]].forEach(([X,Y])=>{const p=I(X,Y,0);RBARREL(c,p[0],p[1],u*1.0,'#4a3a32');});
  const lp=I(0,2.8,3.6);RLANTERN(c,lp[0],lp[1],u*1.0,'255,190,70');}};

/* ---- CLASSIC MIDWAY: a candy-striped comfort-station booth with scalloped awnings and a bulb-lit marquee ---- */
RESTROOM_ART.classic={dy:0.05,k:1.2,draw(c,x,y,u,v){const I=RRI(x,y,u),red='#d9433b',cream='#f7f0dc',teal='#2f9a9a',yel='#f2c230';RSH_(c,x,y+u*0.5,u*7.0,u*3.0,'40,30,30');
  JBOX(c,x,y,u,-4.1,4.1,-2.5,2.5,0,4.0,cream);for(let k=0;k<16;k+=2){BP(c,[I(-4.1+k*0.5,2.5,0),I(-3.6+k*0.5,2.5,0),I(-3.6+k*0.5,2.5,4.0),I(-4.1+k*0.5,2.5,4.0)],red);}for(let k=0;k<10;k+=2){BP(c,[I(4.1,-2.5+k*0.5,0),I(4.1,-2.0+k*0.5,0),I(4.1,-2.0+k*0.5,4.0),I(4.1,-2.5+k*0.5,4.0)],'#a83228');}
  [-1.9,1.9].forEach((X,i)=>{BP(c,[I(X-0.95,2.52,0),I(X+0.95,2.52,0),I(X+0.95,2.52,2.3),I(X-0.95,2.52,2.3)],'#fff8e8');BP(c,[I(X-0.8,2.54,0),I(X+0.8,2.54,0),I(X+0.8,2.54,2.2),I(X-0.8,2.54,2.2)],i?teal:'#2a6ab0');TH.ln(c,I(X,2.56,0),I(X,2.56,2.2),'rgba(255,255,255,.5)',u*0.07);TH.ell(c,...I(X+0.45,2.57,1.0),u*0.09,u*0.09,yel);
    RSTRIPE(c,I(X-1.25,2.5,2.9),I(X+1.25,2.5,2.9),I(X+1.25,3.5,2.35),I(X-1.25,3.5,2.35),6,cream,i?teal:'#2a6ab0');for(let k=0;k<6;k++){const a=I(X-1.25+k*0.417,3.5,2.35),b=I(X-0.833+k*0.417,3.5,2.35);TH.poly(c,[a,b,[(a[0]+b[0])/2,(a[1]+b[1])/2+u*0.34]],k%2?cream:(i?teal:'#2a6ab0'));}
    RRPICTO(c,...I(X,2.55,3.55),u,i?'f':'m','#ffffff',i?'#c0392b':'#1f4a9a','round','F',yel);});
  JBOX(c,x,y,u,-4.4,4.4,-2.8,2.8,4.0,4.4,red);for(let k=0;k<11;k++){const a=I(-4.4+k*0.8,2.8,4.0),b=I(-3.6+k*0.8,2.8,4.0);TH.poly(c,[a,b,[(a[0]+b[0])/2,(a[1]+b[1])/2+u*0.4]],yel);}
  /* a flat roof with a bulb-lit marquee board (stripes and a star, no lettering) */
  BT(c,I,-4.4,4.4,-2.8,2.8,4.4,'#e8dcbc');JBOX(c,x,y,u,-2.2,2.2,0.5,1.4,4.4,7.4,'#f2e2b4');BP(c,[I(-2.2,1.45,4.4),I(2.2,1.45,4.4),I(2.2,1.45,7.4),I(-2.2,1.45,7.4)],cream);BP(c,[I(-1.9,1.46,4.8),I(1.9,1.46,4.8),I(1.9,1.46,7.0),I(-1.9,1.46,7.0)],teal);for(let k=0;k<5;k++)BP(c,[I(-1.6+k*0.64,1.47,5.0),I(-1.3+k*0.64,1.47,5.0),I(-1.3+k*0.64,1.47,6.8),I(-1.6+k*0.64,1.47,6.8)],k%2?yel:red);
  const sp=I(0,1.5,7.7);TH.poly(c,[[sp[0],sp[1]-u*0.8],[sp[0]+u*0.22,sp[1]-u*0.22],[sp[0]+u*0.85,sp[1]-u*0.22],[sp[0]+u*0.36,sp[1]+u*0.14],[sp[0]+u*0.54,sp[1]+u*0.8],[sp[0],sp[1]+u*0.4],[sp[0]-u*0.54,sp[1]+u*0.8],[sp[0]-u*0.36,sp[1]+u*0.14],[sp[0]-u*0.85,sp[1]-u*0.22],[sp[0]-u*0.22,sp[1]-u*0.22]],yel);
  const bl=[];for(let k=0;k<10;k++){bl.push(I(-2.2+k*0.49,1.5,4.5));bl.push(I(-2.2+k*0.49,1.5,7.3));}for(let k=0;k<7;k++){bl.push(I(-2.2,1.5,4.6+k*0.45));bl.push(I(2.2,1.5,4.6+k*0.45));}RBULBS(c,bl,u);
  RRFOUNT(c,...I(-5.4,3.6,0),u,'#d8c8a0');RRVENT(c,...I(3.4,-0.6,4.4),u*0.6,'#d8c8a0');}};

/* ---- AMERICANA: a Victorian cast-iron convenience kiosk (brick base, iron panels, gold-leaf pictograms, a little cupola, a gas lamp) ---- */
RESTROOM_ART.americana={dy:0.05,k:1.18,draw(c,x,y,u,v){const I=RRI(x,y,u),brick='#cf9470',iron='#2f5a46';RSH_(c,x,y+u*0.5,u*7.0,u*3.0,'40,34,28');
  JBOX(c,x,y,u,-4.1,4.1,-2.5,2.5,0,1.2,brick);for(let z=0.4;z<1.2;z+=0.4){TH.ln(c,I(-4.1,2.5,z),I(4.1,2.5,z),'rgba(90,40,20,.25)',u*0.05);}
  JBOX(c,x,y,u,-4.3,4.3,-2.7,2.7,1.05,1.3,'#e8e0c8');JBOX(c,x,y,u,-4.1,4.1,-2.5,2.5,1.2,4.1,iron);
  [-1.9,1.9].forEach((X,i)=>{BP(c,[I(X-0.95,2.52,1.2),I(X+0.95,2.52,1.2),I(X+0.95,2.52,3.5),I(X-0.95,2.52,3.5)],'#e8e0c8');BP(c,[I(X-0.8,2.54,1.2),I(X+0.8,2.54,1.2),I(X+0.8,2.54,3.35),I(X-0.8,2.54,3.35)],'#8a2e32');BP(c,[I(X-0.55,2.55,1.9),I(X+0.55,2.55,1.9),I(X+0.55,2.55,3.1),I(X-0.55,2.55,3.1)],'#2e2018');TH.ln(c,I(X,2.56,1.9),I(X,2.56,3.1),'#c8a040',u*0.06);TH.ell(c,...I(X+0.5,2.57,2.4),u*0.08,u*0.08,'#e8c050');RRPICTO(c,...I(X,2.5,1.62),u*0.0+u,i?'f':'m','#c8a040','#2e2018','round','F','#c8a040');});
  /* tall plaque panels between and beside the doors: gold-leaf pictograms */
  [-1.9,1.9].forEach((X,i)=>RRPICTO(c,...I(X,2.5,3.9),u*0.0+u*0.9,i?'f':'m','#e8c050','#24463a','rect','F','#e8c050'));
  for(let k=0;k<9;k++)TH.ln(c,I(-4.0+k*1.0,2.5,1.3),I(-4.0+k*1.0,2.5,4.0),'rgba(255,255,255,.06)',u*0.1);
  JBOX(c,x,y,u,-4.3,4.3,-2.7,2.7,4.1,4.5,'#e8e0c8');for(let k=0;k<12;k++)TH.poly(c,[I(-4.3+k*0.72,2.71,4.1),I(-3.9+k*0.72,2.71,4.1),I(-4.1+k*0.72,2.71,3.7)],'#c8a040');
  HIP(c,I,-4.4,4.4,-2.8,2.8,4.5,2.2,0.4,'#566472','#3e4a56',u,5);
  const cp=I(0,0,6.7);JBOX(c,x,y,u,-0.9,0.9,-0.9,0.9,6.5,7.5,'#e8e0c8');BP(c,[I(0,0.95,7.5),I(0.95,0.95,7.5),I(0.95,0.95,6.7),I(0,0.95,6.7)],'#ffd27a');const ap=I(0,0,9.4);TH.poly(c,[I(-1.1,1.1,7.5),I(1.1,1.1,7.5),ap],'#566472');TH.poly(c,[I(1.1,1.1,7.5),I(1.1,-1.1,7.5),ap],'#3e4a56');TH.ln(c,ap,[ap[0],ap[1]-u*1.0],'#c8a040',u*0.1);TH.ell(c,ap[0],ap[1]-u*1.1,u*0.16,u*0.16,'#c8a040');
  const gl=I(5.2,3.4,0);TH.ln(c,gl,[gl[0],gl[1]-u*3.2],'#2a2a30',u*0.16);TH.ell(c,gl[0],gl[1]-u*0.1,u*0.4,u*0.16,'#2a2a30');RLANTERN(c,gl[0],gl[1]-u*3.2,u*1.1);
  const bn=I(-5.2,3.4,0);TH.ell(c,bn[0],bn[1]+u*0.1,u*0.5,u*0.2,'rgba(0,0,0,.2)');EGCYL_(c,bn[0],bn[1],u*0.42,u*0.17,u*1.3,['#4a5a6a','#2f3a44','#1c242c']);TH.ell(c,bn[0],bn[1]-u*1.3,u*0.42,u*0.16,'#55616e');
  RRFOUNT(c,...I(-3.6,4.0,0),u,'#5a6a7a');}};

/* ---- SPACE: a pair of white habitat pods linked by a corridor, with round airlock doors and glowing pictograms ---- */
RESTROOM_ART.space={dy:0.05,k:1.4,draw(c,x,y,u,v){RSH_(c,x,y+u*0.5,u*7.0,u*3.0,'20,30,50');
  const pod=(px,py,col)=>{const rx=u*2.5,ry=u*1.25,h=u*3.0;const g=c.createLinearGradient(px-rx,0,px+rx,0);g.addColorStop(0,'#f4f8fc');g.addColorStop(0.55,'#e6ecf2');g.addColorStop(1,'#9aa6b6');c.fillStyle=g;c.beginPath();c.moveTo(px-rx,py-h);c.lineTo(px-rx,py);c.ellipse(px,py,rx,ry,0,Math.PI,0,true);c.lineTo(px+rx,py-h);c.ellipse(px,py-h,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();
    const tg=c.createRadialGradient(px,py-h,0,px,py-h,rx);tg.addColorStop(0,'#f8fbfe');tg.addColorStop(1,'#cfd8e2');c.fillStyle=tg;c.beginPath();c.ellipse(px,py-h,rx,ry,0,0,7);c.fill();
    c.fillStyle='#cfd8e2';c.beginPath();c.ellipse(px,py-h,rx*0.62,ry*0.62,0,0,7);c.fill();c.strokeStyle='rgba(120,134,152,.5)';c.lineWidth=u*0.08;c.beginPath();c.ellipse(px,py-h,rx*0.62,ry*0.62,0,0,7);c.stroke();
    for(let k=0;k<18;k++){const a=Math.PI*(0.06+0.88*k/17),qx=px+Math.cos(a)*rx*0.985,qy=py+Math.sin(a)*ry*0.985-h*0.2;GLOW(c,qx,qy,u*0.55,'74,200,255',0.7);TH.ell(c,qx,qy,u*0.11,u*0.07,'#bff0ff');}
    TH.ell(c,px,py-h-u*0.15,u*0.18,u*0.12,'#ff5a4a');
    /* arched sliding door on the front of the pod: metal frame, glowing glass, centre seam */
    const wd=u*1.5,hd=u*1.75,y0=py+ry-u*0.12,x0=px,yt=y0-hd,dxx=px,dyy=yt,dr=u;
    const archP=(w,yb,ytop)=>{c.beginPath();c.moveTo(x0-w/2,yb);c.lineTo(x0-w/2,ytop+w/2);c.arc(x0,ytop+w/2,w/2,Math.PI,0,false);c.lineTo(x0+w/2,yb);c.closePath();};
    GLOW(c,x0,y0-hd*0.5,u*2.6,'120,220,255',0.4);archP(wd+u*0.34,y0+u*0.04,yt-u*0.17);c.fillStyle='#8d99aa';c.fill();archP(wd+u*0.16,y0+u*0.02,yt-u*0.08);c.fillStyle='#e6ecf2';c.fill();
    archP(wd,y0,yt);const dg=c.createLinearGradient(0,yt,0,y0);dg.addColorStop(0,'#e8fbff');dg.addColorStop(0.55,'#7cc9e8');dg.addColorStop(1,'#3a86b8');c.fillStyle=dg;c.fill();
    TH.ln(c,[x0,yt+wd*0.1],[x0,y0],'#cfd8e2',u*0.12);TH.ln(c,[x0-wd/2+u*0.12,y0-hd*0.34],[x0-u*0.12,y0-hd*0.34],'rgba(255,255,255,.45)',u*0.06);TH.ln(c,[x0+u*0.12,y0-hd*0.34],[x0+wd/2-u*0.12,y0-hd*0.34],'rgba(255,255,255,.45)',u*0.06);
    TH.ell(c,x0-u*0.28,y0-hd*0.45,u*0.07,u*0.07,'#7ad0ff');TH.ell(c,x0+u*0.28,y0-hd*0.45,u*0.07,u*0.07,'#7ad0ff');
    return {dxx,dyy,dr,py,ry,h};};
  const A=pod(x-u*2.8,y+u*0.9),B=pod(x+u*2.8,y-u*0.6);
  /* the plaques are drawn over the pods: lit blue discs with white pictograms */
  [[A,'m'],[B,'f']].forEach(([P,k])=>{const px=P.dxx,py=P.dyy-u*1.15;TH.ell(c,px,py,u*0.95,u*0.95,'#8d99aa');TH.ell(c,px,py,u*0.82,u*0.82,'#1f4a9a');GLOW(c,px,py,u*1.9,'74,200,255',0.4);
    c.save();c.translate(px,py);c.scale(u*0.62,-u*0.62);c.fillStyle='#ffffff';c.beginPath();c.arc(0,0.36,0.13,0,7);c.fill();if(k==='m'){c.fillRect(-0.17,0.14,0.34,0.17);c.fillRect(-0.17,-0.04,0.07,0.3);c.fillRect(0.1,-0.04,0.07,0.3);c.fillRect(-0.1,-0.36,0.08,0.34);c.fillRect(0.02,-0.36,0.08,0.34);c.fillRect(-0.12,0.0,0.24,0.31);}else{c.beginPath();c.moveTo(-0.08,0.28);c.lineTo(0.08,0.28);c.lineTo(0.22,-0.14);c.lineTo(-0.22,-0.14);c.closePath();c.fill();c.fillRect(-0.15,0.1,0.07,0.17);c.fillRect(0.08,0.1,0.07,0.17);c.fillRect(-0.1,-0.4,0.07,0.28);c.fillRect(0.03,-0.4,0.07,0.28);}c.restore();});
  /* a short corridor tube between the pods and a vent stack */
  const cx0=x-u*0.4,cy0=y+u*0.1;c.fillStyle='#cfd8e2';c.fillRect(cx0-u*0.9,cy0-u*1.4,u*1.8,u*0.9);TH.ln(c,[cx0-u*0.9,cy0-u*0.95],[cx0+u*0.9,cy0-u*0.95],'#9aa6b6',u*0.1);
  const vt=[x+u*3.0,y-u*3.8];TH.ln(c,vt,[vt[0],vt[1]-u*1.4],'#9aa6b6',u*0.3);TH.ell(c,vt[0],vt[1]-u*1.45,u*0.4,u*0.14,'#cfd8e2');
  RRFOUNT(c,x-u*5.2,y+u*3.0,u,'#b8c2cc');}};

/* ---- RETRO FUTURE: a small octagonal kiosk in white and blue (flat roof ring, blue-glass bands, glowing blue pictogram discs) ---- */
RESTROOM_ART.retro={dy:0.05,k:1.38,draw(c,x,y,u,v){const I=RRI(x,y,u),Rr=3.9,ZH=3.8;RSH_(c,x,y+u*0.5,u*7.0,u*3.0,'30,50,70');
  const ang=k=>(k+0.5)*Math.PI/4,V=(k,r,z)=>I(Math.cos(ang(k))*r,Math.sin(ang(k))*r,z),P=(k,s,z,r)=>{const a0=ang(k),a1=ang(k+1);return I(Math.cos(a0)*r*(1-s)+Math.cos(a1)*r*s,Math.sin(a0)*r*(1-s)+Math.sin(a1)*r*s,z);};
  const dep=k=>Math.cos((k+1)*Math.PI/4)+Math.sin((k+1)*Math.PI/4),all=[0,1,2,3,4,5,6,7].sort((a,b)=>dep(a)-dep(b)),vis=all.filter(k=>dep(k)>0.05);
  const shd=['#ffffff','#f1f5f8','#dde5ec','#cfd9e2','#c4cfd9','#d9e1e8','#eaf0f4','#f6f9fb'];
  vis.forEach(k=>{BP(c,[V(k,Rr,0),V(k+1,Rr,0),V(k+1,Rr,ZH),V(k,Rr,ZH)],shd[k%8]);
    BP(c,[P(k,0,0,Rr),P(k,1,0,Rr),P(k,1,0.5,Rr),P(k,0,0.5,Rr)],'#2f7fd8');
    /* high blue-glass clerestory band: light without windows at eye level */
    const gp=[P(k,0.1,2.7,Rr),P(k,0.9,2.7,Rr),P(k,0.9,3.5,Rr),P(k,0.1,3.5,Rr)],ys=gp.map(p=>p[1]),gg=c.createLinearGradient(0,Math.min(...ys),0,Math.max(...ys));gg.addColorStop(0,'#bfe2fb');gg.addColorStop(1,'#4a95e8');BP(c,gp,gg);for(let m=1;m<5;m++)TH.ln(c,P(k,0.1+0.8*m/5,2.7,Rr),P(k,0.1+0.8*m/5,3.5,Rr),'#f4f8fb',u*0.07);});
  /* two doors on the two front-facing faces, each with a glowing blue pictogram disc */
  [[3,'m'],[4,'f']].forEach(([k,kind],i)=>{});
  const fk=vis.filter(k=>k===1||k===0||k===7);
  /* doors: the two largest visible faces (normals 90deg and 0deg) */
  [[1,'m'],[7,'f']].forEach(([k,kind])=>{const door=[P(k,0.3,0,Rr),P(k,0.7,0,Rr),P(k,0.7,2.2,Rr),P(k,0.3,2.2,Rr)];BP(c,door,'#e8f2fc');BP(c,[P(k,0.34,0,Rr),P(k,0.66,0,Rr),P(k,0.66,2.12,Rr),P(k,0.34,2.12,Rr)],'#2f7fd8');TH.ln(c,P(k,0.5,0,Rr),P(k,0.5,2.12,Rr),'rgba(255,255,255,.55)',u*0.07);
    const pc=P(k,0.5,2.45,Rr+0.02);TH.ell(c,pc[0],pc[1],u*0.0,u*0.0,'#fff');});
  /* the pictogram discs sit on the same two faces, above the doors */
  [[1,'m'],[7,'f']].forEach(([k,kind])=>{const a0=ang(k),a1=ang(k+1),mx=(Math.cos(a0)+Math.cos(a1))/2*Rr,my=(Math.sin(a0)+Math.sin(a1))/2*Rr;const plane=(k===1)?'F':'R';RRPICTO(c,...I(mx*1.0+(k===1?0:0.02),my*1.0+(k===1?0.02:0),2.78),u,kind,'#ffffff','#2f7fd8','round',plane,'#dfe9f4');});
  /* flat roof ring with a blue rim, a low cap and a short blue-tipped mast */
  BP(c,[0,1,2,3,4,5,6,7].map(k=>V(k,Rr+0.5,ZH)),'#e8eef3');all.forEach(k=>{if(!vis.includes(k))return;BP(c,[V(k,Rr+0.5,ZH),V(k+1,Rr+0.5,ZH),V(k+1,Rr+0.5,ZH+0.4),V(k,Rr+0.5,ZH+0.4)],'#2f7fd8');});BP(c,[0,1,2,3,4,5,6,7].map(k=>V(k,Rr+0.5,ZH+0.4)),'#f4f8fc');
  const apex=I(0,0,ZH+1.2);all.forEach(k=>{BP(c,[V(k,Rr-0.3,ZH+0.4),V(k+1,Rr-0.3,ZH+0.4),apex],shd[k%8]);});TH.ln(c,apex,I(0,0,ZH+2.8),'#cfd8e2',u*0.16);const sp=I(0,0,ZH+3.1);TH.ell(c,sp[0],sp[1],u*0.22,u*0.22,'#2f7fd8');GLOW(c,sp[0],sp[1],u*1.5,'120,190,255',0.5);
  RRFOUNT(c,...I(-5.4,4.4,0),u,'#cfd8e2');}};

/* ---- FRONTIER: a log privy lodge (peeled logs, green metal roof, plank doors with plaques, a rain barrel and firewood) ---- */
RESTROOM_ART.frontier={dy:0.05,k:1.2,draw(c,x,y,u,v){const I=RRI(x,y,u),log='#a5683a',logD='#7a4a26';RSH_(c,x,y+u*0.5,u*7.0,u*3.0,'30,36,20');
  JBOX(c,x,y,u,-4.0,4.0,-2.4,2.4,0,4.1,log);for(let z=0;z<4.1;z+=0.5){TH.ln(c,I(-4.0,2.4,z),I(4.0,2.4,z),logD,u*0.08);TH.ln(c,I(4.0,-2.4,z),I(4.0,2.4,z),logD,u*0.08);}for(let z=0.25;z<4.1;z+=0.5){const p=I(4.0,2.4,z);TH.ell(c,p[0],p[1],u*0.2,u*0.22,'#c88a52');TH.ell(c,p[0],p[1],u*0.09,u*0.1,logD);const q=I(-4.0,2.4,z);TH.ell(c,q[0],q[1],u*0.2,u*0.22,'#c88a52');TH.ell(c,q[0],q[1],u*0.09,u*0.1,logD);}
  [-1.9,1.9].forEach((X,i)=>{BP(c,[I(X-0.85,2.42,0),I(X+0.85,2.42,0),I(X+0.85,2.42,2.4),I(X-0.85,2.42,2.4)],'#3a2412');BP(c,[I(X-0.72,2.44,0),I(X+0.72,2.44,0),I(X+0.72,2.44,2.3),I(X-0.72,2.44,2.3)],'#8a5230');for(let k=0;k<4;k++)TH.ln(c,I(X-0.72,2.45,0.4+k*0.55),I(X+0.72,2.45,0.4+k*0.55),'rgba(40,20,8,.4)',u*0.06);TH.ell(c,...I(X+0.45,2.46,1.1),u*0.09,u*0.09,'#2a2018');
    RRPICTO(c,...I(X,2.5,3.05),u,i?'f':'m','#f2e2bf','#3f6a4e','rect','F','#6a3e1e');});
  const z0=4.1,H=2.0,GR='#3f6a4e';GAB(c,I,-4.5,4.5,-2.9,2.9,z0,H,0.5,GR,'#3a4a3a',u,0);RCLIP(c,[I(-5.0,3.4,z0),I(5.0,3.4,z0),I(5.0,0,z0+H),I(-5.0,0,z0+H)],()=>{for(let k=0;k<20;k++){const t=k/19,a=I(-5.0+10*t,3.4,z0),b=I(-5.0+10*t,0,z0+H);TH.ln(c,a,b,k%2?'rgba(20,50,34,.4)':'rgba(255,255,255,.1)',u*0.09);}});
  RRVENT(c,...I(2.2,0,6.0),u*0.7,'#c8d0d8');
  /* a small stone stack, firewood, a rain barrel under the eave */
  JBOX(c,x,y,u,4.4,6.0,-1.0,0.6,0,1.3,'#9a5e30');for(let k=0;k<7;k++)TH.ell(c,...I(6.01,-0.8+k*0.22,0.3+(k%2)*0.45),u*0.15,u*0.17,'#d8a870');
  RBARREL(c,...I(-5.2,3.2,0),u*1.2,'#7a5a3a');RRFOUNT(c,...I(5.2,3.8,0),u,'#8a8a82');RLANTERN(c,...I(0,2.7,3.2),u*0.9);}};

/* ---- FIESTA: a little talavera-tiled casita block (hot pink and turquoise, barrel-tile awnings, marigolds, a sugar skull) ---- */
RESTROOM_ART.fiesta={dy:0.05,k:1.22,draw(c,x,y,u,v){const I=RRI(x,y,u),pink='#e0468e',turq='#2ab0b8',yel='#f2c230',orange='#f08a30';RSH_(c,x,y+u*0.5,u*7.0,u*3.0,'50,30,30');
  JBOX(c,x,y,u,-4.0,0.0,-2.4,2.4,0,4.0,pink);JBOX(c,x,y,u,0.0,4.0,-2.4,2.4,0,4.0,turq);
  BT(c,I,-4.0,4.0,-2.4,2.4,4.0,'#d9a06a');[[-4.2,-3.8],[-4.2,4.2]].forEach(()=>{});JBOX(c,x,y,u,-4.2,4.2,2.2,2.6,4.0,4.5,'#ffe9f2');JBOX(c,x,y,u,3.8,4.2,-2.6,2.2,4.0,4.5,'#e6fbfb');JBOX(c,x,y,u,-4.2,-3.8,-2.6,2.2,4.0,4.5,'#ffe9f2');
  for(let k=0;k<16;k++)TH.poly(c,[I(-4.0+k*0.5,2.45,3.4),I(-3.75+k*0.5,2.45,3.4),I(-3.875+k*0.5,2.45,3.15)],k%2?yel:(k<8?turq:pink));
  [-2.0,2.0].forEach((X,i)=>{const w=0.85,arch=(ww,Y,z0)=>{const L=[I(X-ww,Y,0),I(X+ww,Y,0),I(X+ww,Y,z0)];for(let k=1;k<=10;k++){const a=Math.PI*k/10;L.push(I(X+ww*Math.cos(a),Y,z0+ww*Math.sin(a)));}return L;};
    BP(c,arch(w+0.15,2.46,1.8),yel);BP(c,arch(w,2.48,1.8),i?'#e0468e':'#2a5ab8');TH.ln(c,I(X,2.5,0.05),I(X,2.5,2.5),'rgba(10,20,60,.5)',u*0.07);TH.ell(c,...I(X+0.4,2.5,1.0),u*0.1,u*0.1,yel);
    RRPICTO(c,...I(X,2.56,3.1),u,i?'f':'m','#2a1a40','#fff6e6','round','F',orange);
    const tA=I(X-1.2,3.5,2.6),tB=I(X+1.2,3.5,2.6),tC=I(X+1.2,2.5,3.1),tD=I(X-1.2,2.5,3.1);BP(c,[tA,tB,tC,tD],'#c2603a');for(let k=0;k<7;k++){const t=k/6;TH.ln(c,[tD[0]+(tC[0]-tD[0])*t,tD[1]+(tC[1]-tD[1])*t],[tA[0]+(tB[0]-tA[0])*t,tA[1]+(tB[1]-tA[1])*t],k%2?'#e07a4a':'#a24a2a',u*0.2);}TH.ln(c,tA,tB,'#8a3a1e',u*0.12);RPOST(c,I,X-1.1,3.4,0,2.6,'#8a5a30',u,0.16);RPOST(c,I,X+1.1,3.4,0,2.6,'#8a5a30',u,0.16);});
  for(let k=0;k<14;k++){const a=Math.PI*(k/13),p=I(0+Math.cos(a)*0.55,2.5,1.2+Math.sin(a)*0.0);}
  [-4.4,4.4].forEach((X,i)=>{const p=I(X,3.6,0);EGCYL_(c,p[0],p[1],u*0.55,u*0.22,u*1.0,['#e07a4a','#c2603a','#8a3a1e']);for(let j=0;j<4;j++)TH.ell(c,p[0]+(j-1.5)*u*0.2,p[1]-u*1.3,u*0.2,u*0.2,[orange,'#d9433b',yel,pink][j]);});
  RRFOUNT(c,...I(5.3,3.0,0),u,'#d8a070');
  const cc=I(-5.5,2.4,0);TH.ln(c,[cc[0],cc[1]],[cc[0],cc[1]-u*2.4],'#3f8a45',u*0.46);TH.ln(c,[cc[0]-u*0.45,cc[1]-u*1.3],[cc[0]-u*0.45,cc[1]-u*2.0],'#3f8a45',u*0.32);TH.ln(c,[cc[0]-u*0.45,cc[1]-u*1.3],[cc[0],cc[1]-u*1.3],'#3f8a45',u*0.28);TH.ell(c,cc[0],cc[1]-u*2.5,u*0.18,u*0.18,'#e0468e');}};

/* ---- NORDIC: a viking privy hall (dark timber, turf roof, carved door posts, rune-shield plaques, a small dragon finial) ---- */
RESTROOM_ART.nordic={dy:0.05,k:1.2,draw(c,x,y,u,v){const I=RRI(x,y,u),wood='#5e4128',woodL='#7a5634';RSH_(c,x,y+u*0.5,u*7.0,u*3.0,'20,30,24');
  JBOX(c,x,y,u,-4.2,4.2,-2.5,2.5,0,3.9,wood);for(let k=0;k<17;k++)TH.ln(c,I(-4.2+k*0.5,2.5,0),I(-4.2+k*0.5,2.5,3.9),'rgba(20,10,4,.45)',u*0.08);for(let k=0;k<10;k++)TH.ln(c,I(4.2,-2.5+k*0.5,0),I(4.2,-2.5+k*0.5,3.9),'rgba(20,10,4,.45)',u*0.07);
  [-1.9,1.9].forEach((X,i)=>{BP(c,[I(X-0.85,2.52,0),I(X+0.85,2.52,0),I(X+0.85,2.52,2.4),I(X-0.85,2.52,2.4)],'#1c1208');BP(c,[I(X-0.72,2.54,0),I(X+0.72,2.54,0),I(X+0.72,2.54,2.3),I(X-0.72,2.54,2.3)],'#8a6238');for(let k=1;k<3;k++)TH.ln(c,I(X-0.72+k*0.48,2.55,0),I(X-0.72+k*0.48,2.55,2.3),'rgba(30,16,6,.5)',u*0.06);TH.ln(c,I(X-0.72,2.56,0.6),I(X+0.72,2.56,0.6),'#2a2a30',u*0.12);TH.ln(c,I(X-0.72,2.56,1.7),I(X+0.72,2.56,1.7),'#2a2a30',u*0.12);
    [-1,1].forEach(sg=>{RPOST(c,I,X+sg*1.0,2.6,0,2.7,'#7a5634',u,0.34);for(let z=0.4;z<2.6;z+=0.6)TH.ell(c,...I(X+sg*1.0,2.62,z),u*0.16,u*0.14,'#c8a060');});
    RRPICTO(c,...I(X,2.6,3.05),u,i?'f':'m','#e8dcc0',i?'#2a5ab8':'#b83a2a','round','F','#c8c8d0');});
  const z0=3.9,H=1.7,A=I(-4.7,3.2,z0),B=I(4.7,3.2,z0),R1=I(4.7,0,z0+H),R0=I(-4.7,0,z0+H);BP(c,[I(4.2,-2.5,z0),I(4.2,2.5,z0),I(4.2,0,z0+H*0.85)],'#4a3220');BP(c,[A,B,R1,R0],'#5a3e26');RCLIP(c,[A,B,R1,R0],()=>{for(let r=0;r<4;r++){const t=(r+0.5)/4;for(let k=0;k<22;k++){const px=A[0]+(B[0]-A[0])*(k/22+(r%2)*0.02)+(R0[0]-A[0])*t,py=A[1]+(B[1]-A[1])*(k/22)+(R0[1]-A[1])*t;c.fillStyle=(k+r)%2?'rgba(0,0,0,.14)':'rgba(255,230,180,.1)';c.beginPath();c.ellipse(px+u*0.2,py,u*0.2,u*0.3,0,0,Math.PI);c.fill();}}c.fillStyle='#4f7a3a';c.beginPath();c.moveTo(R0[0],R0[1]);c.lineTo(R1[0],R1[1]);c.lineTo(R1[0],R1[1]+u*0.9);c.lineTo(R0[0],R0[1]+u*0.9);c.closePath();c.fill();for(let k=0;k<44;k++)TH.ln(c,[R0[0]+(R1[0]-R0[0])*k/43,R0[1]+(R1[1]-R0[1])*k/43+u*0.5],[R0[0]+(R1[0]-R0[0])*k/43+u*0.05,R0[1]+(R1[1]-R0[1])*k/43-u*0.15],k%2?'#6a9a48':'#3f6a2e',u*0.12);});TH.ln(c,A,B,'#3a2410',u*0.2);TH.ln(c,R0,R1,'#3a2410',u*0.18);
  const drg=(p,dir)=>{c.save();c.translate(p[0],p[1]);c.scale(dir,1);c.strokeStyle='#4a2e18';c.lineWidth=u*0.28;c.lineCap='round';c.beginPath();c.moveTo(0,u*0.3);c.quadraticCurveTo(u*0.7,-u*0.5,u*0.5,-u*1.5);c.quadraticCurveTo(u*0.4,-u*2.0,u*1.0,-u*2.1);c.stroke();TH.ell(c,u*1.15,-u*2.15,u*0.4,u*0.24,'#5a3a20',-0.3);TH.poly(c,[[u*0.95,-u*2.3],[u*0.8,-u*2.8],[u*1.2,-u*2.35]],'#5a3a20');TH.ell(c,u*1.2,-u*2.2,u*0.06,u*0.06,'#f2c230');c.restore();};drg(I(4.7,0,z0+H),1);drg(I(-4.7,0,z0+H),-1);
  RRVENT(c,...I(1.8,0.2,5.2),u*0.6,'#c8d0d8');
  [[-5.0,3.2],[5.0,3.4]].forEach(([X,Y])=>{const p=I(X,Y,0);RTORCH(c,p[0],p[1],u,u*2.8);});RBARREL(c,...I(5.9,2.2,0),u*1.1,'#8a5a30');RRFOUNT(c,...I(-5.6,3.4,0),u,'#8a7a60');}};

/* ===== RESTROOM PACK API (same shape as the restaurant and weenie packs) ===== */
const RESTROOM_U=0.0975;
const RESTROOM_DX={standard: 0.09, western: 0.14, medieval: 0.065, bavarian: 0.1, jungle: 0.13, tiki: 0.13, caribbean: 0.065, alps: 0.16, gothic: 0.115, classic: 0.115, americana: 0.055, space: 0.025, retro: 0.1, frontier: 0.09, fiesta: 0.085, nordic: 0.13};   /* horizontal nudge (in R) that centres each building on the hex, filled in after measuring */
const RESTROOM_ALIAS={wild_west:'western',classic_midway:'classic',classicmidway:'classic',retro_future:'retro',retrofuture:'retro',alpine:'alps',unthemed:'standard',default:'standard',german:'bavarian',viking:'nordic',latin:'fiesta',mexican:'fiesta',pirate:'caribbean'};
function restroomTheme(t){t=String(t||'standard').toLowerCase();return RESTROOM_ALIAS[t]||t;}
/* drawRestroom(ctx, cx, cy, R, {theme, flip, scale, dy, dx, accent}): (cx,cy) = centre of the hex tile, R = hex radius in px. Static, one hex, no ground. */
function drawRestroom(ctx,cx,cy,R,opts){opts=opts||{};const th=restroomTheme(opts.theme),T=RESTROOM_ART[th];if(!T)throw new Error('unknown restroom theme: '+opts.theme);
  const S=opts.scale||1,u=R*RESTROOM_U*S*(T.k||1),dy=(opts.dy===undefined?T.dy:opts.dy)*R;ctx.save();if(opts.flip){ctx.translate(cx,0);ctx.scale(-1,1);ctx.translate(-cx,0);}T.draw(ctx,cx+(opts.dx===undefined?(RESTROOM_DX[th]||0):opts.dx)*R,cy+dy,u,opts.v===undefined?0:opts.v,opts.accent);ctx.restore();}
const RESTROOM_BAKE_CACHE={};
/* bakeRestroom(theme, R, {scale, flip, pixelRatio, accent}) -> {canvas, ox, oy, w, h, bbox}: a transparent sprite cropped to its painted pixels; (ox,oy) = where the hex centre sits inside the canvas */
function bakeRestroom(theme,R,opts){opts=opts||{};const th=restroomTheme(theme),pr=opts.pixelRatio||1,S=opts.scale||1,key=[th,R,S,!!opts.flip,pr,opts.accent||''].join('|');if(RESTROOM_BAKE_CACHE[key])return RESTROOM_BAKE_CACHE[key];
  const W=Math.ceil(R*4.2*pr),H=Math.ceil(R*5.0*pr),ax=W/2,ay=H*0.76,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');c.scale(pr,pr);drawRestroom(c,ax/pr,ay/pr,R,{theme:th,scale:S,flip:opts.flip,accent:opts.accent});
  const d=cv.getContext('2d').getImageData(0,0,W,H).data;let x0=W,y0=H,x1=0,y1=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(d[(y*W+x)*4+3]>8){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}}
  const pad=2,bx=Math.max(0,x0-pad),by=Math.max(0,y0-pad),bw=Math.min(W,x1+pad+1)-bx,bh=Math.min(H,y1+pad+1)-by,out=document.createElement('canvas');out.width=bw;out.height=bh;out.getContext('2d').drawImage(cv,bx,by,bw,bh,0,0,bw,bh);
  return RESTROOM_BAKE_CACHE[key]={canvas:out,ox:(ax-bx)/pr,oy:(ay-by)/pr,w:bw/pr,h:bh/pr,pixelRatio:pr,bbox:{left:-(ax-bx)/pr,top:-(ay-by)/pr,right:(bx+bw-ax)/pr,bottom:(by+bh-ay)/pr}};}
function drawRestroomBaked(ctx,cx,cy,sprite){ctx.drawImage(sprite.canvas,cx-sprite.ox,cy-sprite.oy,sprite.w,sprite.h);}
function restroomFootprint(R,theme,opts){return bakeRestroom(theme,R,opts).bbox;}
window.RESTROOM_FACILITY_ART={draw:drawRestroom,drawBaked:drawRestroomBaked,bake:bakeRestroom};
})();
