/* Imported landmark illustrations. */
const NEW_WEENIE_PACK = (() => {

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

/* ===== JUNGLE ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const JS=(c,x,y,rx)=>{c.fillStyle='rgba(12,40,22,.28)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const JPAL=[['#2f6b3a','#3f8a45','#58a04f','#2a5c35'],['#2b6a46','#3a8a58','#4fa56a','#25583b'],['#3d7a34','#58a03f','#76b84e','#336a2c'],['#2a6048','#37805e','#4c9c74','#234f3b']];
const JSTONE='#b5ae94',JSTONE_D='#8c866e',JSTONE_L='#cfc9b0',JMOSS='#5f8f3f';
const JFROND=(c,x,y,ang,len,u,col,mid,droop)=>{const ex=x+Math.cos(ang)*len,ey=y+Math.sin(ang)*len*0.6+len*(droop||0.35),mx=x+Math.cos(ang)*len*0.55,my=y+Math.sin(ang)*len*0.7-len*0.25;
  c.lineCap='round';c.strokeStyle=col;c.lineWidth=u*0.42;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(mx,my,ex,ey);c.stroke();c.strokeStyle=mid;c.lineWidth=u*0.1;c.stroke();
  for(let k=1;k<7;k++){const t=k/7,q=1-t,px=q*q*x+2*q*t*mx+t*t*ex,py=q*q*y+2*q*t*my+t*t*ey,s=len*0.2*(1-t*0.6);TH.ln(c,[px,py],[px+Math.sin(ang)*s*0.5-Math.cos(ang)*s*0.2,py+s*0.55],col,u*0.14);TH.ln(c,[px,py],[px-Math.sin(ang)*s*0.5-Math.cos(ang)*s*0.2,py+s*0.55],col,u*0.14);}};
const JBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.28),shade(col,0.16));
const JVINE=(c,x,y,u,r,n)=>{for(let k=0;k<n;k++){const vx=x+(r()-0.5)*u*2.4,vy=y-r()*u*1.2;TH.ell(c,vx,vy,u*(0.25+r()*0.3),u*(0.18+r()*0.2),r()<0.5?'#4d8a3a':'#3a7030');}};
/* ===== iso building helpers (shared by the Caribbean + Americana packs). I=(X,Y,Z)=>screen point. Front face = plane Y=y1 (faces lower-left), right face = plane X=x1 (faces lower-right). ===== */
const MIR=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
const BP=(c,pts,fill,stroke,lw)=>TH.poly(c,pts,fill,stroke,lw);
const BF=(c,I,x0,x1,y1,z0,z1,col)=>BP(c,[I(x0,y1,z0),I(x1,y1,z0),I(x1,y1,z1),I(x0,y1,z1)],col);
const BR=(c,I,x1,y0,y1,z0,z1,col)=>BP(c,[I(x1,y0,z0),I(x1,y1,z0),I(x1,y1,z1),I(x1,y0,z1)],col);
const BT=(c,I,x0,x1,y0,y1,z,col)=>BP(c,[I(x0,y0,z),I(x1,y0,z),I(x1,y1,z),I(x0,y1,z)],col);
const WF=(c,I,y1,X,Z,w,h,col,fr)=>BP(c,[I(X-w/2,y1,Z-h/2),I(X+w/2,y1,Z-h/2),I(X+w/2,y1,Z+h/2),I(X-w/2,y1,Z+h/2)],col,fr,fr?0.9:0);
const WR=(c,I,x1,Y,Z,w,h,col,fr)=>BP(c,[I(x1,Y-w/2,Z-h/2),I(x1,Y+w/2,Z-h/2),I(x1,Y+w/2,Z+h/2),I(x1,Y-w/2,Z+h/2)],col,fr,fr?0.9:0);
/* clapboard / brick courses on a face: n lines between z0 and z1 */
const BFL=(c,I,x0,x1,y1,z0,z1,step,col,u)=>{for(let z=z0+step;z<z1-0.01;z+=step)TH.ln(c,I(x0,y1,z),I(x1,y1,z),col,u*0.05);};
const BRL=(c,I,x1,y0,y1,z0,z1,step,col,u)=>{for(let z=z0+step;z<z1-0.01;z+=step)TH.ln(c,I(x1,y0,z),I(x1,y1,z),col,u*0.05);};
/* hip roof over a rectangle: ridge runs along X; front trapezoid + right triangle */
function HIP(c,I,x0,x1,y0,y1,z,H,o,cf,cr,u,tex){const yc=(y0+y1)/2,xr0=x0+(y1-y0)/2,xr1=x1-(y1-y0)/2,A=I(x0-o,y1+o,z),B=I(x1+o,y1+o,z),R1=I(xr1,yc,z+H),R0=I(xr0,yc,z+H),C=I(x1+o,y0-o,z);
  BP(c,[B,C,R1],cr);BP(c,[A,B,R1,R0],cf);
  if(tex){for(let k=1;k<=tex;k++){const t=k/(tex+1),L=[A[0]+(R0[0]-A[0])*t,A[1]+(R0[1]-A[1])*t],Rr=[B[0]+(R1[0]-B[0])*t,B[1]+(R1[1]-B[1])*t];TH.ln(c,L,Rr,'rgba(0,0,0,.16)',u*0.07);TH.ln(c,[L[0],L[1]-u*0.07],[Rr[0],Rr[1]-u*0.07],'rgba(255,255,255,.14)',u*0.05);}}
  TH.ln(c,R0,R1,shade(cf,-0.3),u*0.16);}
/* gable roof, ridge along X: front slope + right gable end */
function GAB(c,I,x0,x1,y0,y1,z,H,o,cf,cg,u,tex){const yc=(y0+y1)/2,A=I(x0-o,y1+o,z),B=I(x1+o,y1+o,z),R1=I(x1+o,yc,z+H),R0=I(x0-o,yc,z+H);
  BP(c,[I(x1,y0,z),I(x1,y1,z),I(x1,yc,z+H*0.86)],cg);BP(c,[A,B,R1,R0],cf);
  if(tex){for(let k=1;k<=tex;k++){const t=k/(tex+1),L=[A[0]+(R0[0]-A[0])*t,A[1]+(R0[1]-A[1])*t],Rr=[B[0]+(R1[0]-B[0])*t,B[1]+(R1[1]-B[1])*t];TH.ln(c,L,Rr,'rgba(0,0,0,.16)',u*0.07);TH.ln(c,[L[0],L[1]-u*0.07],[Rr[0],Rr[1]-u*0.07],'rgba(255,255,255,.14)',u*0.05);}}
  TH.ln(c,R0,R1,shade(cf,-0.3),u*0.16);TH.ln(c,A,B,shade(cf,-0.25),u*0.1);}
const GLOW=(c,x,y,r,rgb,a)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();};

/* ===== theme helpers ===== */
/* ===== RETRO-FUTURE ASSETS (Tomorrowland-style): white Jetsons/Googie architecture, teal glass, orange accents, trees in sleek planters. draw(c,x,y,u,v): (x,y)=base centre, u=0.075*R, v=variant seed ===== */
const RW={w:'#f4f6f8',ws:'#b9c4d1',wl:'#ffffff',teal:'#2fb8c4',tealD:'#1f8a96',org:'#ff7a3c',yel:'#ffd23c',navy:'#2a3a52',leaf:['#8fd05a','#6ab83c','#4a9a30'],glass:['#cdeef8','#8ccfe4','#4f9fc0']};
const RSH=(c,x,y,rx)=>{c.fillStyle='rgba(40,62,96,.22)';c.beginPath();c.ellipse(x+rx*0.22,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const RBOX=(c,x,y,u,a,b,d,e,f,g,col)=>col?TH.box(c,x,y,u,a,b,d,e,f,g,col,shade(col,-0.22),shade(col,0.1)):TH.box(c,x,y,u,a,b,d,e,f,g,RW.w,RW.ws,RW.wl);
function RCYL(c,x,y,rx,ry,wh,cols){cols=cols||['#ffffff','#e9eef3','#a9b6c6'];const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,cols[0]);g.addColorStop(0.5,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y-wh);c.lineTo(x-rx,y);c.ellipse(x,y,rx,ry,0,Math.PI,0,true);c.lineTo(x+rx,y-wh);c.ellipse(x,y-wh,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();}
function RGLASS(c,pts,alpha){const ys=pts.map(p=>p[1]),g=c.createLinearGradient(0,Math.min(...ys),0,Math.max(...ys));g.addColorStop(0,RW.glass[0]);g.addColorStop(0.5,RW.glass[1]);g.addColorStop(1,RW.glass[2]);c.save();c.globalAlpha=alpha||1;c.fillStyle=g;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();c.restore();}
function RSPHERE(c,x,y,r,cols){const g=c.createRadialGradient(x-r*0.35,y-r*0.4,r*0.1,x,y,r*1.05);g.addColorStop(0,cols[0]);g.addColorStop(0.55,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();}
function RGLOW(c,x,y,r,rgb,a){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();}

/* ===== CARIBBEAN ASSETS: 18th-century pirate port. Pastel creole houses, tavern, fort, wrecks, cannons, palms. draw(c,x,y,u,v): v bit3 = mirror, bits0-2 = house colour, bits4-5 = roof ===== */
const CBP=['#f28ab2','#4fc3c7','#f6c453','#f08a4b','#8ad06a','#6aa8e8','#b98ae0','#ef6a5a'],CBROOF=['#c4553a','#a8442e','#8a5a3a','#6e7e8c'],CBTRIM='#fbf6ea',CBSTONE=['#b4ab98','#8f8774','#cfc6b0'];
const CBSH=(c,x,y,rx)=>{c.fillStyle='rgba(40,50,30,.26)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};

/* ===== AMERICANA ASSETS: Main-Street-USA Victorian town. Storefronts with awnings + gingerbread, town hall, bandstand, gas lamps. draw(c,x,y,u,v): v bit3 = mirror (shopfront faces the street), bits0-2 = body colour, bits4-6 = awning ===== */
const AMBODY=['#e8c3b6','#c3d6b9','#efdfae','#b5cde2','#d8b699','#c0675a','#7fa08f','#d8c0e0'],AMTRIM='#fbf6e8',AMAWN=[['#c43a30','#fbf6e8'],['#2f6a8a','#fbf6e8'],['#2f7a4a','#fbf6e8'],['#e0a030','#fbf6e8'],['#7a3a8a','#fbf6e8'],['#d84a7a','#fbf6e8']],AMROOF=['#6a7a8a','#7a5a4a','#5a6a58','#8a4a3a'];
const ASH=(c,x,y,rx)=>{c.fillStyle='rgba(50,56,40,.25)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
function ACONE(c,x,y,rx,ry,h,col,u,scal){const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,shade(col,0.18));g.addColorStop(0.5,col);g.addColorStop(1,shade(col,-0.3));c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y);c.lineTo(x,y-h);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();
  if(scal){for(let k=0;k<scal;k++){const a0=Math.PI*k/scal,a1=Math.PI*(k+1)/scal;c.fillStyle=k%2?'#fbf6e8':shade(col,-0.1);c.beginPath();c.moveTo(x+Math.cos(a0)*rx,y+Math.sin(a0)*ry);c.lineTo(x+Math.cos((a0+a1)/2)*rx,y+Math.sin((a0+a1)/2)*ry+u*0.4);c.lineTo(x+Math.cos(a1)*rx,y+Math.sin(a1)*ry);c.closePath();c.fill();}}
  c.save();c.beginPath();c.moveTo(x-rx,y);c.lineTo(x,y-h);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.clip();for(let k=0;k<=14;k++){const a=Math.PI*k/14;TH.ln(c,[x,y-h],[x+Math.cos(a)*rx,y+Math.sin(a)*ry],'rgba(0,0,0,.12)',u*0.05);}c.restore();}
/* striped sloped awning projecting from the front wall at Y=y1 */
function AWN(c,I,X0,X1,y1,zTop,zBot,dY,col,u){const n=Math.max(4,Math.round((X1-X0)/0.5));for(let k=0;k<n;k++){const a=X0+(X1-X0)*k/n,b=X0+(X1-X0)*(k+1)/n,cc=k%2?col[1]:col[0];BP(c,[I(a,y1,zTop),I(b,y1,zTop),I(b,y1+dY,zBot),I(a,y1+dY,zBot)],cc);const p=I(a,y1+dY,zBot),q=I(b,y1+dY,zBot);BP(c,[p,q,[(p[0]+q[0])/2,(p[1]+q[1])/2+u*0.42]],cc);}}

const _AME={
  /* ---------- WEENIE: Hill Valley courthouse (Back to the Future): brick wings, white portico, clock tower stopped at 10:04, copper dome and a lightning rod ---------- */
  hillValleyHall:{cat:'struct',rho:0.18,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),brick='#bf7a5c',brickR=shade(brick,-0.24),W='#f4eede',WS='#c9c2b0';ASH(c,x,y,u*7.6);
    TH.box(c,x,y,u,-3.6,3.6,-2.6,4.6,0,0.2,'#d8d0bc','#b4ab98','#e6dfcd');TH.box(c,x,y,u,-2.7,2.7,2.4,4.1,0.2,0.4,'#e6dfcd','#b4ab98','#f4eede');
    BF(c,I,-4.4,4.4,2.4,0.2,4.2,brick);BR(c,I,4.4,-2.4,2.4,0.2,4.2,brickR);BFL(c,I,-4.4,4.4,2.4,0.2,4.2,0.26,'rgba(60,25,15,.2)',u);BRL(c,I,4.4,-2.4,2.4,0.2,4.2,0.26,'rgba(60,25,15,.26)',u);
    BF(c,I,-4.45,4.45,2.42,0.2,0.55,'#c9c2b0');BF(c,I,-4.45,4.45,2.42,2.15,2.35,W);
    [-3.7,-2.7,2.7,3.7].forEach(X=>{[1.4,3.3].forEach(Z=>{WF(c,I,2.4,X,Z,0.7,1.3,'#27394d',W);BP(c,[I(X-0.45,2.42,Z+0.65),I(X+0.45,2.42,Z+0.65),I(X+0.45,2.42,Z+0.85),I(X-0.45,2.42,Z+0.85)],W);TH.ln(c,I(X,2.4,Z-0.6),I(X,2.4,Z+0.6),W,u*0.05);});});
    [-1.2,0,1.2].forEach(Y=>{[1.4,3.3].forEach(Z=>WR(c,I,4.4,Y,Z,0.7,1.3,'#27394d',W));});
    TH.box(c,x,y,u,-4.6,4.6,-2.6,2.6,4.2,4.5,W,WS,'#ffffff');for(let k=0;k<16;k++){const X=-4.3+k*0.57;if(Math.abs(X)>2.3)TH.box(c,x,y,u,X-0.12,X+0.12,2.35,2.55,4.5,5.0,W,WS,W);}
    /* clock tower behind the portico */
    BF(c,I,-1.3,1.3,1.9,4.2,8.4,W);BR(c,I,1.3,-0.2,1.9,4.2,8.4,WS);[6.0,7.2].forEach(Z=>{TH.ln(c,I(-1.3,1.9,Z),I(1.3,1.9,Z),'rgba(150,140,120,.6)',u*0.1);TH.ln(c,I(1.3,-0.2,Z),I(1.3,1.9,Z),'rgba(110,100,85,.6)',u*0.1);});
    [-1.2,1.2].forEach(X=>TH.ln(c,I(X,1.92,4.2),I(X,1.92,8.4),'rgba(170,160,140,.55)',u*0.16));
    const clk=(face,Xc,Yc,Zc,rx,rz)=>{const pts=[];for(let k=0;k<28;k++){const a=k/28*6.283;pts.push(face==='F'?I(Xc+rx*Math.cos(a),Yc,Zc+rz*Math.sin(a)):I(Xc,Yc+rx*Math.cos(a),Zc+rz*Math.sin(a)));}BP(c,pts,'#2a2a30');const inn=[];for(let k=0;k<28;k++){const a=k/28*6.283;inn.push(face==='F'?I(Xc+rx*0.86*Math.cos(a),Yc,Zc+rz*0.86*Math.sin(a)):I(Xc,Yc+rx*0.86*Math.cos(a),Zc+rz*0.86*Math.sin(a)));}BP(c,inn,'#fbf6e8');
      const P=(dx,dz)=>face==='F'?I(Xc+dx*rx,Yc,Zc+dz*rz):I(Xc,Yc+dx*rx,Zc+dz*rz),C=P(0,0);for(let k=0;k<12;k++){const a=k/12*6.283,p1=P(0.7*Math.sin(a),0.7*Math.cos(a)),p2=P(0.82*Math.sin(a),0.82*Math.cos(a));TH.ln(c,p1,p2,'#2a2a30',u*0.06);}
      TH.ln(c,C,P(-0.5*0.87*1.0,0.5*0.87),'#2a2a30',u*0.12);TH.ln(c,C,P(0.74*0.41,0.74*0.91),'#2a2a30',u*0.08);TH.ell(c,C[0],C[1],u*0.08,u*0.08,'#2a2a30');};
    clk('F',0,1.92,6.9,0.95,0.95);clk('R',1.32,0.85,6.9,0.8,0.95);
    TH.box(c,x,y,u,-1.55,1.55,-0.45,2.15,8.4,8.75,W,WS,'#ffffff');
    [[-1.2,1.8],[1.2,1.8],[1.2,-0.1],[-1.2,-0.1]].forEach(([X,Y])=>TH.ln(c,I(X,Y,8.75),I(X,Y,10.0),W,u*0.28));
    BP(c,[I(-1.2,1.8,8.75),I(1.2,1.8,8.75),I(1.2,1.8,10.0),I(-1.2,1.8,10.0)],'#241c18');BP(c,[I(1.2,-0.1,8.75),I(1.2,1.8,8.75),I(1.2,1.8,10.0),I(1.2,-0.1,10.0)],'#3a2c24');[-0.6,0.6].forEach(X=>{const p=I(X,1.7,9.2);TH.ell(c,p[0],p[1],u*0.4,u*0.5,'#e8c46a');TH.ln(c,[p[0],p[1]-u*0.5],[p[0],p[1]-u*0.9],'#4a3a2a',u*0.08);});[-1.2,1.2].forEach(X=>TH.ln(c,I(X,1.82,8.75),I(X,1.82,10.0),W,u*0.28));
    TH.box(c,x,y,u,-1.5,1.5,-0.4,2.1,10.0,10.35,W,WS,'#ffffff');
    const dp=I(0,0.85,10.35),dr=u*1.6,dg=c.createRadialGradient(dp[0]-dr*0.4,dp[1]-u*2,u*0.2,dp[0],dp[1]-u*1,dr*1.3);dg.addColorStop(0,'#a8e0c8');dg.addColorStop(0.55,'#6fb8a0');dg.addColorStop(1,'#3f7a68');c.fillStyle=dg;c.beginPath();c.ellipse(dp[0],dp[1],dr,u*2.0,0,Math.PI,Math.PI*2);c.ellipse(dp[0],dp[1],dr,dr*0.5,0,0,Math.PI);c.closePath();c.fill();c.strokeStyle='rgba(20,80,60,.35)';c.lineWidth=u*0.07;for(let k=1;k<4;k++){c.beginPath();c.ellipse(dp[0],dp[1],dr*k/4,u*2.0,0,Math.PI,Math.PI*2);c.stroke();}
    TH.ell(c,dp[0],dp[1]-u*2.0,u*0.45,u*0.18,W);TH.ln(c,[dp[0],dp[1]-u*2.0],[dp[0],dp[1]-u*3.6],'#9aa4ae',u*0.14);TH.ell(c,dp[0],dp[1]-u*3.7,u*0.26,u*0.26,'#e8c46a');
    /* six-column portico and pediment (drawn last: it stands in front of the tower) */
    BF(c,I,-2.2,2.2,2.4,0.4,4.2,'#d9cfc0');WF(c,I,2.4,-0.8,1.5,0.9,2.3,'#2a1c14',W);WF(c,I,2.4,0.8,1.5,0.9,2.3,'#2a1c14',W);
    [-1.9,-1.14,-0.38,0.38,1.14,1.9].forEach(X=>{TH.ln(c,I(X,3.2,0.4),I(X,3.2,4.2),W,u*0.52);TH.ln(c,I(X+0.16,3.2,0.4),I(X+0.16,3.2,4.2),'rgba(160,150,130,.55)',u*0.16);TH.ell(c,I(X,3.2,4.2)[0],I(X,3.2,4.2)[1],u*0.36,u*0.18,'#ffffff');});
    TH.box(c,x,y,u,-2.3,2.3,2.2,3.6,4.2,4.65,W,WS,'#ffffff');BP(c,[I(2.3,3.6,4.65),I(2.3,2.2,4.65),I(0,2.2,5.9),I(0,3.6,5.9)],'#aaa498');BP(c,[I(-2.3,3.6,4.65),I(2.3,3.6,4.65),I(0,3.6,5.9)],W);BP(c,[I(-1.7,3.62,4.8),I(1.7,3.62,4.8),I(0,3.62,5.65)],'#e6dfcd');TH.ell(c,I(0,3.62,5.0)[0],I(0,3.62,5.0)[1],u*0.4,u*0.3,'#bf7a5c');}},
};
const _CARIB={
  /* ---------- WEENIE: Spanish colonial city hall (ayuntamiento): arcaded ground floor, balcony, baroque parapet and a terracotta-domed belltower ---------- */
  cityHall:{cat:'struct',rho:0.18,draw(c,x,y,u,v){MIR(c,x,v&8,()=>{const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),w='#f2c76a',wr=shade(w,-0.2),tr='#fbf6ea',stn='#c9b690',tile='#c4553a';CBSH(c,x,y,u*7.2);
    const ARCH=(Xc,wd,z0,rise,col)=>{const pts=[I(Xc-wd/2,2.42,z0)];const zs=z0+(rise>0?0.0:0);const top=[];for(let k=0;k<=10;k++){const a=Math.PI*(1-k/10);top.push(I(Xc+wd/2*Math.cos(a),2.42,z0+1.5+rise*Math.sin(a)));}BP(c,[I(Xc-wd/2,2.42,z0)].concat(top,[I(Xc+wd/2,2.42,z0)]),col);};
    TH.box(c,x,y,u,-4.5,4.5,-2.6,3.8,0,0.25,'#d8cfb6','#b4ab98','#e6dfcd');TH.box(c,x,y,u,-1.3,1.3,2.4,4.3,0.25,0.5,'#e6dfcd','#b4ab98','#f4eede');
    BF(c,I,-4.2,4.2,2.3,0.25,5.2,w);BR(c,I,4.2,-2.3,2.3,0.25,5.2,wr);BRL(c,I,4.2,-2.3,2.3,0.25,5.2,0.5,'rgba(120,80,20,.18)',u);BF(c,I,-4.25,4.25,2.32,0.25,0.7,stn);
    /* arcaded ground floor */
    [-3.2,-1.6,0,1.6,3.2].forEach((Xc,i)=>{ARCH(Xc,1.1,0.7,0.55,'#3a2a1e');BP(c,[I(Xc-0.5,2.3,0.7),I(Xc+0.5,2.3,0.7),I(Xc+0.5,2.3,2.0),I(Xc-0.5,2.3,2.0)],'rgba(0,0,0,0)');});
    [-4.0,-2.4,-0.8,0.8,2.4,4.0].forEach(X=>{TH.ln(c,I(X,2.45,0.25),I(X,2.45,2.3),tr,u*0.4);TH.ln(c,I(X+0.1,2.45,0.25),I(X+0.1,2.45,2.3),'rgba(170,150,110,.5)',u*0.12);});
    BF(c,I,-4.25,4.25,2.45,2.3,2.55,tr);
    /* upper floor: French windows with shutters, iron balcony */
    [-3.2,-1.6,0,1.6,3.2].forEach(X=>{WF(c,I,2.3,X,3.7,0.8,1.6,'#27394d',tr);WF(c,I,2.3,X-0.58,3.7,0.3,1.6,'#3f8a6a');WF(c,I,2.3,X+0.58,3.7,0.3,1.6,'#3f8a6a');BP(c,[I(X-0.5,2.32,4.55),I(X+0.5,2.32,4.55),I(X,2.32,4.95)],tr);});
    TH.box(c,x,y,u,-4.4,4.4,2.3,3.1,2.55,2.7,'#8f866e','#6a6250','#b4ab98');for(let k=0;k<22;k++){const X=-4.2+k*0.4;TH.ln(c,I(X,3.05,2.7),I(X,3.05,3.5),'#2a2a30',u*0.07);}TH.ln(c,I(-4.3,3.05,3.5),I(4.3,3.05,3.5),'#2a2a30',u*0.12);
    [-4.3,4.3].forEach(X=>TH.ln(c,I(X,3.05,2.7),I(X,3.05,3.5),'#2a2a30',u*0.16));
    [-0.9,0.9].forEach(X=>BP(c,[I(X-0.12,2.32,0.7),I(X+0.12,2.32,0.7),I(X+0.12,2.32,2.2),I(X-0.12,2.32,2.2)],'rgba(0,0,0,0)'));
    [-0.6,1.0].forEach(Y=>{WR(c,I,4.2,Y,1.6,0.9,1.6,'#27394d',tr);WR(c,I,4.2,Y,3.7,0.9,1.6,'#27394d',tr);});
    /* terracotta roof and baroque scalloped parapet */
    HIP(c,I,-4.2,4.2,-2.3,2.3,5.2,1.6,0.2,tile,shade(tile,-0.28),u,6);
    const par=[];for(let k=0;k<=24;k++){const X=-4.25+8.5*k/24,z=5.2+0.42+0.28*Math.abs(Math.sin(k*Math.PI/2));par.push(I(X,2.32,z));}BP(c,[I(-4.25,2.32,5.2)].concat(par,[I(4.25,2.32,5.2)]),w);TH.ln(c,I(-4.25,2.34,5.2),I(4.25,2.34,5.2),tr,u*0.16);
    [-3.2,-1.6,1.6].forEach(X=>{const p=I(X,2.3,5.75);TH.ell(c,p[0],p[1]-u*0.35,u*0.26,u*0.4,tr);TH.ell(c,p[0],p[1]-u*0.85,u*0.18,u*0.18,tr);});
    /* central doorway with scrolled pediment and coat of arms */
    WF(c,I,2.3,-0.0,1.4,1.5,2.6,tr);WF(c,I,2.3,0,1.35,1.2,2.4,'#3a2216');BP(c,[I(-0.9,2.32,2.7),I(0.9,2.32,2.7),I(0,2.32,3.4)],tr);const sh=I(0,2.34,3.05);BP(c,[[sh[0]-u*0.45,sh[1]-u*0.35],[sh[0]+u*0.45,sh[1]-u*0.35],[sh[0]+u*0.45,sh[1]+u*0.15],[sh[0],sh[1]+u*0.55],[sh[0]-u*0.45,sh[1]+u*0.15]],'#c43a30','#e8c46a',u*0.08);TH.ln(c,[sh[0],sh[1]-u*0.3],[sh[0],sh[1]+u*0.4],'#e8c46a',u*0.08);
    /* belltower at the right end, rising above the roofline */
    BF(c,I,2.3,4.3,1.7,4.6,10.4,'#f4ecd8');BR(c,I,4.3,-0.8,1.7,4.6,10.4,shade('#f4ecd8',-0.22));[6.6,8.0].forEach(Z=>{TH.ln(c,I(2.3,1.7,Z),I(4.3,1.7,Z),'rgba(150,130,90,.6)',u*0.1);TH.ln(c,I(4.3,-0.8,Z),I(4.3,1.7,Z),'rgba(110,95,60,.6)',u*0.1);});
    [2.35,4.25].forEach(X=>TH.ln(c,I(X,1.72,4.6),I(X,1.72,10.4),w,u*0.22));
    const ck=I(3.3,1.72,6.3),cr=u*0.78;TH.ell(c,ck[0],ck[1],cr,cr,'#2a2a30');TH.ell(c,ck[0],ck[1],cr*0.84,cr*0.84,'#fbf6e8');for(let k=0;k<12;k++){const a=k/12*6.283;TH.ln(c,[ck[0]+Math.cos(a)*cr*0.55,ck[1]+Math.sin(a)*cr*0.55],[ck[0]+Math.cos(a)*cr*0.7,ck[1]+Math.sin(a)*cr*0.7],'#2a2a30',u*0.05);}TH.ln(c,ck,[ck[0]-u*0.2,ck[1]-u*0.5],'#2a2a30',u*0.08);TH.ln(c,ck,[ck[0]+u*0.4,ck[1]+u*0.2],'#2a2a30',u*0.08);
    [2.85,3.75].forEach(Xc=>{const pts=[I(Xc-0.32,1.72,8.2)];const top=[];for(let k=0;k<=8;k++){const a=Math.PI*(1-k/8);top.push(I(Xc+0.32*Math.cos(a),1.72,9.3+0.35*Math.sin(a)));}BP(c,pts.concat(top,[I(Xc+0.32,1.72,8.2)]),'#2a1c14');const bp=I(Xc,1.7,8.8);TH.ell(c,bp[0],bp[1],u*0.3,u*0.38,'#e8c46a');});
    TH.box(c,x,y,u,2.2,4.4,-0.9,1.8,10.4,10.75,tr,shade(tr,-0.18),'#ffffff');
    const dp=I(3.3,0.45,10.75),dr=u*1.7,dg=c.createRadialGradient(dp[0]-dr*0.35,dp[1]-u*1.6,u*0.2,dp[0],dp[1]-u*0.8,dr*1.3);dg.addColorStop(0,'#e0866a');dg.addColorStop(0.55,tile);dg.addColorStop(1,shade(tile,-0.4));c.fillStyle=dg;c.beginPath();c.ellipse(dp[0],dp[1],dr,u*2.3,0,Math.PI,Math.PI*2);c.ellipse(dp[0],dp[1],dr,dr*0.5,0,0,Math.PI);c.closePath();c.fill();c.strokeStyle='rgba(80,20,10,.4)';c.lineWidth=u*0.07;for(let k=1;k<4;k++){c.beginPath();c.ellipse(dp[0],dp[1],dr*k/4,u*2.3,0,Math.PI,Math.PI*2);c.stroke();}
    TH.box(c,x,y,u,2.95,3.65,0.1,0.8,10.75,10.75,tr,tr,tr);const lp=[dp[0],dp[1]-u*2.3];TH.poly(c,[[lp[0]-u*0.5,lp[1]],[lp[0]+u*0.5,lp[1]],[lp[0]+u*0.4,lp[1]-u*1.1],[lp[0]-u*0.4,lp[1]-u*1.1]],tr);TH.poly(c,[[lp[0]-u*0.2,lp[1]-u*0.1],[lp[0]+u*0.2,lp[1]-u*0.1],[lp[0]+u*0.2,lp[1]-u*0.9],[lp[0]-u*0.2,lp[1]-u*0.9]],'#2a1c14');TH.ell(c,lp[0],lp[1]-u*1.15,u*0.5,u*0.2,tile);TH.ln(c,[lp[0],lp[1]-u*1.15],[lp[0],lp[1]-u*2.6],'#e8c46a',u*0.14);TH.ln(c,[lp[0]-u*0.4,lp[1]-u*2.0],[lp[0]+u*0.4,lp[1]-u*2.0],'#e8c46a',u*0.14);
    TH.ln(c,I(-3.9,0.4,5.7),I(-3.9,0.4,9.4),'#6a4a2c',u*0.16);BP(c,[I(-3.9,0.4,9.4),I(-2.5,0.4,9.4),I(-2.5,0.4,8.9),I(-3.9,0.4,8.9)],'#e8c46a');BP(c,[I(-3.9,0.4,9.1),I(-2.5,0.4,9.1),I(-2.5,0.4,8.7),I(-3.9,0.4,8.7)],'#c43a30');}) }},
};
const _RETRO={
  /* ---------- WEENIE: classic Space Mountain: a white hexagonal pyramid of fluted ribs on an arcaded base, with buttress fins, a glowing portal and an orbit-ring beacon ---------- */
  spaceMountain:{cat:'struct',rho:0.2,draw(c,x,y,u,v){const Rb=6.4*u,ry=0.52;RSH(c,x,y,Rb*1.25);
    const hx=(R,cy,k)=>[x+R*Math.cos(k*Math.PI/3),cy+R*ry*Math.sin(k*Math.PI/3)];
    /* hexagonal arcaded drum */
    const Rp=Rb*1.1,ph=2.8*u;
    for(let k=0;k<3;k++){const a=hx(Rp,y,k),b=hx(Rp,y,k+1),g=c.createLinearGradient(a[0],0,b[0],0);g.addColorStop(0,k===0?'#aeb9c6':k===1?'#cfd8e2':'#e4eaf0');g.addColorStop(1,k===0?'#9aa6b4':k===1?'#bcc6d2':'#d4dce6');c.fillStyle=g;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(b[0],b[1]-ph);c.lineTo(a[0],a[1]-ph);c.closePath();c.fill();
      for(let j=0;j<4;j++){const t0=(j+0.16)/4,t1=(j+0.84)/4,p0=[a[0]+(b[0]-a[0])*t0,a[1]+(b[1]-a[1])*t0],p1=[a[0]+(b[0]-a[0])*t1,a[1]+(b[1]-a[1])*t1];if(k===1&&(j===1||j===2))continue;c.fillStyle='rgba(30,50,80,.55)';c.beginPath();c.moveTo(p0[0],p0[1]);c.lineTo(p0[0],p0[1]-ph*0.5);c.quadraticCurveTo((p0[0]+p1[0])/2,(p0[1]+p1[1])/2-ph*0.9,p1[0],p1[1]-ph*0.5);c.lineTo(p1[0],p1[1]);c.closePath();c.fill();}
      c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=u*0.1;for(let j=0;j<=4;j++){const t=j/4;c.beginPath();c.moveTo(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t);c.lineTo(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t-ph);c.stroke();}}
    /* glowing portal in the middle of the front face */
    {const a=hx(Rp,y,1),b=hx(Rp,y,2),mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,pw=u*1.5,pH=ph*0.92;c.fillStyle='#16283a';c.beginPath();c.moveTo(mx-pw*1.12,my);c.lineTo(mx-pw*1.12,my-pH*0.62);c.quadraticCurveTo(mx,my-pH*1.35,mx+pw*1.12,my-pH*0.62);c.lineTo(mx+pw*1.12,my);c.closePath();c.fill();
      const gg=c.createLinearGradient(0,my-pH,0,my);gg.addColorStop(0,'#bff0ff');gg.addColorStop(1,'#2f9ec0');c.fillStyle=gg;c.beginPath();c.moveTo(mx-pw,my);c.lineTo(mx-pw,my-pH*0.62);c.quadraticCurveTo(mx,my-pH*1.22,mx+pw,my-pH*0.62);c.lineTo(mx+pw,my);c.closePath();c.fill();GLOW(c,mx,my-pH*0.45,u*4.2,'120,220,255',0.35);
      c.strokeStyle='rgba(255,255,255,.95)';c.lineWidth=u*0.13;[0.3,0.6].forEach(f=>{c.beginPath();c.moveTo(mx-pw*0.55,my-pH*f+u*0.3);c.lineTo(mx,my-pH*f-u*0.1);c.lineTo(mx+pw*0.55,my-pH*f+u*0.3);c.stroke();});}
    const dt=[];for(let k=0;k<6;k++)dt.push(hx(Rp,y-ph,k));c.strokeStyle=RW.teal;c.lineWidth=u*0.18;c.beginPath();dt.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.stroke();
    /* LOW-PITCHED ribbed hexagonal pyramid roof */
    const by=y-ph,Rr=Rp*1.03,Ht=3.0*u,Rt=2.3*u,B=k=>hx(Rr,by,k),T=k=>hx(Rt,by-Ht,k),shadeF=[['#cdd6e0','#aab6c4'],['#e9eef3','#cfd8e2'],['#fafcfd','#e2e9f0']];
    for(let k=0;k<3;k++){const b0=B(k),b1=B(k+1),t0=T(k),t1=T(k+1),g=c.createLinearGradient(b0[0],0,b1[0],0);g.addColorStop(0,shadeF[k][1]);g.addColorStop(1,shadeF[k][0]);c.fillStyle=g;c.beginPath();c.moveTo(b0[0],b0[1]);c.lineTo(b1[0],b1[1]);c.lineTo(t1[0],t1[1]);c.lineTo(t0[0],t0[1]);c.closePath();c.fill();
      for(let j=1;j<16;j++){const t=j/16,bp=[b0[0]+(b1[0]-b0[0])*t,b0[1]+(b1[1]-b0[1])*t],tp2=[t0[0]+(t1[0]-t0[0])*t,t0[1]+(t1[1]-t0[1])*t];c.strokeStyle=j%2?'rgba(95,115,145,.32)':'rgba(255,255,255,.75)';c.lineWidth=u*(j%2?0.09:0.07);c.beginPath();c.moveTo(bp[0],bp[1]);c.lineTo(tp2[0],tp2[1]);c.stroke();}
      [0.5].forEach(f=>{const p0=[b0[0]+(t0[0]-b0[0])*f,b0[1]+(t0[1]-b0[1])*f],p1=[b1[0]+(t1[0]-b1[0])*f,b1[1]+(t1[1]-b1[1])*f];c.strokeStyle='rgba(90,110,140,.34)';c.lineWidth=u*0.1;c.beginPath();c.moveTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1]);c.stroke();c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=u*0.06;c.beginPath();c.moveTo(p0[0],p0[1]+u*0.1);c.lineTo(p1[0],p1[1]+u*0.1);c.stroke();});}
    [1,2].forEach(k=>{const b=B(k),t=T(k);c.strokeStyle='#ffffff';c.lineWidth=u*0.2;c.beginPath();c.moveTo(b[0],b[1]);c.lineTo(t[0],t[1]);c.stroke();c.strokeStyle='rgba(120,140,170,.4)';c.lineWidth=u*0.07;c.beginPath();c.moveTo(b[0]+u*0.12,b[1]);c.lineTo(t[0]+u*0.04,t[1]);c.stroke();});
    const eb=[];for(let k=0;k<6;k++)eb.push(B(k));c.strokeStyle=RW.teal;c.lineWidth=u*0.2;c.beginPath();eb.slice(0,4).forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
    /* flat summit cap, short mast, orbit ring and a red beacon */
    const sp=[];for(let k=0;k<6;k++)sp.push(T(k));BP(c,sp,'#ffffff');c.strokeStyle=RW.teal;c.lineWidth=u*0.14;c.beginPath();sp.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.stroke();
    const ap=[x,by-Ht];TH.ln(c,ap,[ap[0],ap[1]-u*2.8],'#8a98a8',u*0.16);c.strokeStyle='rgba(47,184,196,.95)';c.lineWidth=u*0.15;c.beginPath();c.ellipse(ap[0],ap[1]-u*1.4,u*1.5,u*0.5,0,0,7);c.stroke();
    RSPHERE(c,ap[0],ap[1]-u*3.0,u*0.34,['#ffd0c0','#ff4a3a','#b0201a']);RGLOW(c,ap[0],ap[1]-u*3.0,u*1.7,'255,70,50',0.5);}},
};
const _TIKI={
  /* ---------- WEENIE: Polynesian pagoda: five upswept thatch tiers, carved tiki posts, masks, lanterns, torches and a flame-crowned finial ---------- */
  tikiPagoda:{cat:'struct',rho:0.2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);JS(c,x,y,u*7.2);
    const FACE=(px,py,s,col)=>{TH.poly(c,[[px-s*0.55,py-s*1.0],[px+s*0.55,py-s*1.0],[px+s*0.62,py+s*0.9],[px-s*0.62,py+s*0.9]],col,'#1a120a',s*0.08);TH.ln(c,[px-s*0.5,py-s*0.55],[px-s*0.1,py-s*0.65],'#1a120a',s*0.12);TH.ln(c,[px+s*0.5,py-s*0.55],[px+s*0.1,py-s*0.65],'#1a120a',s*0.12);[-1,1].forEach(q=>{TH.ell(c,px+q*s*0.3,py-s*0.35,s*0.2,s*0.18,'#f6efe0');TH.ell(c,px+q*s*0.3,py-s*0.35,s*0.08,s*0.08,'#1a120a');});TH.poly(c,[[px-s*0.12,py-s*0.2],[px+s*0.12,py-s*0.2],[px+s*0.18,py+s*0.25],[px-s*0.18,py+s*0.25]],shade(col,-0.25));c.fillStyle='#1a120a';c.fillRect(px-s*0.38,py+s*0.4,s*0.76,s*0.28);for(let t=0;t<4;t++){c.fillStyle='#f6efe0';c.fillRect(px-s*0.34+t*s*0.18,py+s*0.4,s*0.1,s*0.14);}};
    /* upswept thatch roof: raised corners, sagging eave line */
    const ROOF=(hw,hd,z,H,o,up,col)=>{const A=I(-hw-o,hd+o,z+up),B=I(hw+o,hd+o,z+up),C=I(hw+o,-hd-o,z+up),M1=I(0,hd+o,z),M2=I(hw+o,0,z),yc=0,R0=I(-hw*0.35,yc,z+H),R1=I(hw*0.35,yc,z+H),cf=[2*M1[0]-(A[0]+B[0])/2,2*M1[1]-(A[1]+B[1])/2],cr=[2*M2[0]-(B[0]+C[0])/2,2*M2[1]-(B[1]+C[1])/2];
      const g1=c.createLinearGradient(A[0],0,B[0],0);g1.addColorStop(0,shade(col,0.18));g1.addColorStop(1,col);c.fillStyle=shade(col,-0.28);c.beginPath();c.moveTo(B[0],B[1]);c.quadraticCurveTo(cr[0],cr[1],C[0],C[1]);c.lineTo(R1[0],R1[1]);c.closePath();c.fill();c.fillStyle=g1;c.beginPath();c.moveTo(A[0],A[1]);c.quadraticCurveTo(cf[0],cf[1],B[0],B[1]);c.lineTo(R1[0],R1[1]);c.lineTo(R0[0],R0[1]);c.closePath();c.fill();
      for(let k=1;k<=22;k++){const t=k/23,e=[A[0]+(B[0]-A[0])*t+(cf[0]-(A[0]+B[0])/2)*(2*t*(1-t)),A[1]+(B[1]-A[1])*t+(cf[1]-(A[1]+B[1])/2)*(2*t*(1-t))],r=[R0[0]+(R1[0]-R0[0])*t,R0[1]+(R1[1]-R0[1])*t];TH.ln(c,e,r,k%2?'rgba(60,36,10,.3)':'rgba(255,236,170,.18)',u*0.07);}
      for(let k=0;k<26;k++){const t=k/25,e=[A[0]+(B[0]-A[0])*t+(cf[0]-(A[0]+B[0])/2)*(2*t*(1-t)),A[1]+(B[1]-A[1])*t+(cf[1]-(A[1]+B[1])/2)*(2*t*(1-t))];c.fillStyle=k%2?'#8a6a30':'#a07a3a';c.beginPath();c.moveTo(e[0]-u*0.2,e[1]);c.lineTo(e[0],e[1]+u*(0.3+(k%3)*0.08));c.lineTo(e[0]+u*0.2,e[1]);c.closePath();c.fill();}
      TH.ln(c,A,M1,'#5a3a22',u*0.0);return{A,B,M1,R0,R1};};
    TH.box(c,x,y,u,-5.0,5.0,-3.6,5.2,0,0.45,'#a8a18a','#7a7560','#c0b9a2');TH.box(c,x,y,u,-3.0,3.0,3.4,6.2,0.45,0.9,'#b8b19a','#8a8570','#cdc6b0');TH.box(c,x,y,u,-2.2,2.2,3.4,5.0,0.9,1.3,'#c8c1aa','#9a9580','#dbd4be');
    const tiers=[{hw:3.9,hd:2.7,z0:0.45,wh:2.5,rh:1.7,col:'#8a2f22',rc:'#c9a65a'},{hw:3.0,hd:2.1,z0:4.45,wh:2.1,rh:1.5,col:'#1f7a78',rc:'#d0ac5e'},{hw:2.2,hd:1.6,z0:7.85,wh:1.9,rh:1.3,col:'#8a2f22',rc:'#c9a65a'},{hw:1.5,hd:1.1,z0:10.85,wh:1.7,rh:1.2,col:'#1f7a78',rc:'#d0ac5e'}];
    tiers.forEach((t,i)=>{const {hw,hd,z0,wh,col}=t;
      BF(c,I,-hw,hw,hd,z0,z0+wh,col);BR(c,I,hw,-hd,hd,z0,z0+wh,shade(col,-0.28));
      for(let k=1;k<9;k++){const X=-hw+2*hw*k/9;TH.ln(c,I(X,hd,z0),I(X,hd,z0+wh),'rgba(0,0,0,.15)',u*0.05);}
      /* carved corner and mid posts */
      const posts=i===0?[-hw,-hw/3,hw/3,hw]:[-hw,hw];posts.forEach(X=>{TH.box(c,x,y,u,X-0.3,X+0.3,hd-0.1,hd+0.5,z0,z0+wh,'#8a5a33','#5a3a22','#a8764a');const pp=I(X,hd+0.5,z0+wh*0.5);FACE(pp[0]-u*0.2,pp[1],u*0.82,['#c8402a','#2a9d8f','#f2b630'][(((i+Math.round(X*2))%3)+3)%3]);});
      if(i===0){WF(c,I,hd,0,z0+0.95,1.5,1.8,'#2a1810','#8a5a33');const mp=I(0,hd,z0+wh+0.2);FACE(mp[0],mp[1]-u*0.4,u*1.25,'#c8402a');for(let q=0;q<3;q++)TH.ell(c,mp[0]+(q-1)*u*1.7,mp[1]-u*0.2,u*0.3,u*0.3,'#f2b630');}
      /* hanging lanterns and a lei of flowers along the eave */
      const rf=ROOF(hw,hd,z0+wh,t.rh,0.6,0.45,t.rc);TH.box(c,x,y,u,-hw-0.6,hw+0.6,hd+0.45,hd+0.65,z0+wh-0.05,z0+wh+0.25,'#6a3a1e','#4a2814','#8a5a33');
      [-1,0,1].forEach(q=>{const lp=I(q*hw*0.8,hd+0.65,z0+wh);TH.ln(c,lp,[lp[0],lp[1]+u*0.7],'#3a2a18',u*0.05);GLOW(c,lp[0],lp[1]+u*1.1,u*1.5,'255,190,90',0.45);TH.ell(c,lp[0],lp[1]+u*1.05,u*0.34,u*0.46,'#f2a03a');TH.ell(c,lp[0],lp[1]+u*1.0,u*0.18,u*0.26,'#ffe27a');});
      for(let k=0;k<12;k++){const tt=(k+0.5)/12,px=rf.A[0]+(rf.B[0]-rf.A[0])*tt,py=rf.A[1]+(rf.B[1]-rf.A[1])*tt+Math.sin(tt*Math.PI)*u*0.9;TH.ell(c,px,py+u*0.3,u*0.17,u*0.15,['#f4a6cb','#f2b630','#c8402a','#fff0a0'][k%4]);}});
    /* spire, carved finial and flame */
    const top=I(0,0,10.85+1.7+1.2);TH.ln(c,top,[top[0],top[1]-u*2.4],'#6a3a1e',u*0.34);[0.7,1.5].forEach(f=>TH.ell(c,top[0],top[1]-u*f,u*(1.1-f*0.3),u*0.4,'#c9a65a'));FACE(top[0],top[1]-u*3.4,u*0.9,'#c8402a');TH.ln(c,[top[0],top[1]-u*4.4],[top[0],top[1]-u*5.3],'#6a3a1e',u*0.2);
    GLOW(c,top[0],top[1]-u*5.8,u*3.4,'255,170,70',0.5);TH.poly(c,[[top[0]-u*0.4,top[1]-u*5.2],[top[0]-u*0.25,top[1]-u*6.4],[top[0],top[1]-u*5.8],[top[0]+u*0.15,top[1]-u*7.2],[top[0]+u*0.4,top[1]-u*5.9],[top[0]+u*0.45,top[1]-u*5.2]],'#f08a24');TH.poly(c,[[top[0]-u*0.2,top[1]-u*5.2],[top[0],top[1]-u*6.0],[top[0]+u*0.25,top[1]-u*5.2]],'#ffe27a');
    /* big torches and carved guardian totems flanking the steps */
    [[-2.9,6.2],[2.9,6.2]].forEach(([X,Y],i)=>{const p=I(X,Y,0.45);TH.ln(c,p,[p[0],p[1]-u*3.4],'#6a3a1e',u*0.34);FACE(p[0],p[1]-u*2.2,u*0.7,['#2a9d8f','#f2b630'][i]);GLOW(c,p[0],p[1]-u*4.4,u*2.6,'255,170,70',0.5);TH.poly(c,[[p[0]-u*0.4,p[1]-u*3.5],[p[0]-u*0.2,p[1]-u*4.5],[p[0],p[1]-u*4.0],[p[0]+u*0.15,p[1]-u*5.0],[p[0]+u*0.4,p[1]-u*3.5]],'#f08a24');TH.poly(c,[[p[0]-u*0.2,p[1]-u*3.5],[p[0],p[1]-u*4.3],[p[0]+u*0.2,p[1]-u*3.5]],'#ffe27a');});}},
};

/* ===== WEENIE PACK: four landmark facilities, each a single-hex sprite that can be built on any tile ===== */
const WEENIE_ART={americana:_AME.hillValleyHall,caribbean:_CARIB.cityHall,retro:_RETRO.spaceMountain,tiki:_TIKI.tikiPagoda};
const WEENIE_THEMES={
  americana:{id:'americana',name:'Hill Valley Courthouse',blurb:'Brick-winged hall, white six-column portico, clock tower stopped at 10:04, copper dome and lightning rod.',dy:0.12,k:1.0},
  caribbean:{id:'caribbean',name:'Spanish Colonial City Hall',blurb:'Ochre arcaded ayuntamiento with an iron balcony, baroque parapet and a terracotta-domed belltower.',dy:0.12,k:1.08},
  retro:{id:'retro',name:'Retro-Future Space Mountain',blurb:'Hexagonal arcaded drum under a low-pitched, ribbed white pyramid roof, with a glowing portal and an orbit-ring beacon.',dy:0.1,k:0.92},
  tiki:{id:'tiki',name:'Polynesian Tiki Pagoda',blurb:'Four upswept thatch tiers with carved tiki posts, masks, lanterns, flower leis, torches and a flame-crowned finial.',dy:0.12,k:0.92}};
const WEENIE_ALIAS={bttf:'americana',hillvalley:'americana',courthouse:'americana',town:'americana',spanish:'caribbean',cityhall:'caribbean',pirate:'caribbean',colonial:'caribbean',space:'retro',spacemountain:'retro','retro-future':'retro',retrofuture:'retro',future:'retro',pagoda:'tiki',polynesian:'tiki'};
const WEENIE_U=0.1;                                                        /* sprite unit u = R*0.1*scale (a hex is 1.73R wide: each weenie fills about 70-80% of it) */
function weenieTheme(t){const k=String(t||'americana').toLowerCase();return WEENIE_ALIAS[k]||k;}
/* drawWeenie(ctx, cx, cy, R, {theme, flip, scale, dy}): (cx,cy) = centre of the hex tile it stands on; R = hex radius in px. No ground or base is drawn: the tile shows through. */
function drawWeenie(ctx,cx,cy,R,opts){opts=opts||{};const th=weenieTheme(opts.theme),T=WEENIE_THEMES[th];if(!T)throw new Error('unknown weenie theme: '+opts.theme);
  const S=opts.scale||1,u=R*WEENIE_U*S*(T.k||1),dy=(opts.dy===undefined?T.dy:opts.dy)*R;ctx.save();if(opts.flip){ctx.translate(cx,0);ctx.scale(-1,1);ctx.translate(-cx,0);}WEENIE_ART[th].draw(ctx,cx,cy+dy,u,opts.v===undefined?0:opts.v);ctx.restore();}
/* bakeWeenie(theme, R, {scale, flip, pixelRatio}) -> {canvas, ox, oy, w, h, bbox}: a transparent sprite cropped to its painted pixels; (ox,oy) = where the hex centre sits inside the canvas */
const WEENIE_BAKE_CACHE={};
function bakeWeenie(theme,R,opts){opts=opts||{};const th=weenieTheme(theme),pr=opts.pixelRatio||1,S=opts.scale||1,key=[th,R,S,!!opts.flip,pr].join('|');if(WEENIE_BAKE_CACHE[key])return WEENIE_BAKE_CACHE[key];
  const W=Math.ceil(R*4.2*pr),H=Math.ceil(R*5.0*pr),ax=W/2,ay=H*0.76,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');c.scale(pr,pr);drawWeenie(c,ax/pr,ay/pr,R,{theme:th,scale:S,flip:opts.flip});
  const d=c.getImageData?cv.getContext('2d').getImageData(0,0,W,H).data:null;let x0=W,y0=H,x1=0,y1=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(d[(y*W+x)*4+3]>8){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}}
  const pad=2,bx=Math.max(0,x0-pad),by=Math.max(0,y0-pad),bw=Math.min(W,x1+pad+1)-bx,bh=Math.min(H,y1+pad+1)-by,out=document.createElement('canvas');out.width=bw;out.height=bh;out.getContext('2d').drawImage(cv,bx,by,bw,bh,0,0,bw,bh);
  return WEENIE_BAKE_CACHE[key]={canvas:out,ox:(ax-bx)/pr,oy:(ay-by)/pr,w:bw/pr,h:bh/pr,pixelRatio:pr,bbox:{left:-(ax-bx)/pr,top:-(ay-by)/pr,right:(bx+bw-ax)/pr,bottom:(by+bh-ay)/pr}};}
function drawWeenieBaked(ctx,cx,cy,sprite){ctx.drawImage(sprite.canvas,cx-sprite.ox,cy-sprite.oy,sprite.w,sprite.h);}
/* footprint (px, relative to the hex centre) of the painted sprite at radius R: use it to keep neighbouring scenery or UI clear */
function weenieFootprint(R,theme,opts){return bakeWeenie(theme,R,opts).bbox;}


return Object.freeze({draw: drawWeenie});
})();
