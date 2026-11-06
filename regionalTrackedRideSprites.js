/* Static two-hex Dark Ride and one-hex Flying Theater illustrations. */
const REGIONAL_TRACKED_RIDE_SPRITES = (() => {
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
const FD={
  proj(cx,cy,S){return(X,Y,Z)=>[cx+(X-Y)*0.7*S,cy+(X+Y)*0.35*S-Z*S];},
  poly(g,pts,fill,stroke,lw){g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();if(fill){g.fillStyle=fill;g.fill();g.strokeStyle=fill;g.lineWidth=0.6;g.stroke();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();}},
  ell(g,x,y,rx,ry,fill){g.fillStyle=fill;g.beginPath();g.ellipse(x,y,rx,ry,0,0,7);g.fill();},
  ln(g,a,b,col,w){g.strokeStyle=col;g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();},
  /* art on a vertical plane: local units are TENTHS of a world unit, x along (ux,uy) to the screen-right, y up. clipPts = screen polygon */
  art(g,Pj,S,clipPts,O,ux,uy,z0,fn,Wt,Ht){const o=Pj(O[0],O[1],z0),o2=Pj(O[0]+ux/10,O[1]+uy/10,z0);g.save();g.beginPath();clipPts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.clip();g.transform(o2[0]-o[0],o2[1]-o[1],0,-S/10,o[0],o[1]);fn(g,Wt,Ht);g.restore();},
  txt(g,str,x,y,size,col,maxW,font){g.save();g.scale(1,-1);g.font='bold '+size+'px '+(font||'Arial Black, Arial, sans-serif');g.textAlign='center';g.textBaseline='middle';g.fillStyle=col;g.fillText(str,x,-y,maxW);g.restore();},
  /* box rotated by psi; draws visible faces, calls deco(face,kind) so the caller can paint on them; returns the faces */
  box(g,Pj,S,x0,y0,z0,l,w,h,psi,col,deco,o){o=o||{};const c=Math.cos(psi),s=Math.sin(psi),pts=[[-l/2,-w/2],[l/2,-w/2],[l/2,w/2],[-l/2,w/2]].map(([a,b])=>[x0+a*c-b*s,y0+a*s+b*c]),faces=[];
    for(let i=0;i<4;i++){const A=pts[i],B=pts[(i+1)%4],dx=B[0]-A[0],dy=B[1]-A[1],len=Math.hypot(dx,dy),nx=dy/len,ny=-dx/len;if(nx+ny>0.02){let ux=dx/len,uy=dy/len,O0=A;if(ux-uy<0){ux=-ux;uy=-uy;O0=B;}faces.push({i,kind:i%2===0?'long':'end',A,B,nx,ny,ux,uy,O:O0,W:len,d:(A[0]+B[0]+A[1]+B[1])/2});}}
    faces.sort((p,q)=>p.d-q.d).forEach(f=>{const amt=Math.max(-0.5,Math.min(0.3,-0.12+0.14*f.ny-0.22*f.nx)),poly=[Pj(f.A[0],f.A[1],z0),Pj(f.B[0],f.B[1],z0),Pj(f.B[0],f.B[1],z0+h),Pj(f.A[0],f.A[1],z0+h)];FD.poly(g,poly,shade(col,amt));
      if(deco)FD.art(g,Pj,S,poly,f.O,f.ux,f.uy,z0,(gg,W,H)=>deco(gg,f,W,H,amt),f.W*10,h*10);});
    if(!o.noTop)FD.poly(g,pts.map(p=>Pj(p[0],p[1],z0+h)),o.top||shade(col,0.16));return{pts,faces};}
};
/* ---------------- Dark ride ---------------- */
const DR_STYLES={haunted:{wall:'#3a3150',def:'GHOST HOUSE'},funhouse:{wall:'#f6efe0',def:'FUN HOUSE'},adventure:{wall:'#b6aa86',def:'TEMPLE RIDE'},space:{wall:'#2a3345',def:'STAR VOYAGE'}};
function drFacade(g,style,W,H,A,name){const cx=W/2;
  if(style==='haunted'){const wall='#3a3150',stone='#6a6285',dk='#0c0a14';g.fillStyle='#17122a';g.fillRect(0,0,W,H);g.fillStyle=wall;g.beginPath();g.moveTo(0,0);g.lineTo(W,0);g.lineTo(W,H*0.62);g.lineTo(W*0.78,H*0.66);g.lineTo(W*0.62,H*0.8);g.lineTo(W*0.54,H*0.82);g.lineTo(cx,H);g.lineTo(W*0.46,H*0.82);g.lineTo(W*0.38,H*0.8);g.lineTo(W*0.22,H*0.66);g.lineTo(0,H*0.62);g.closePath();g.fill();
    g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=1;for(let x=W*0.05;x<W;x+=W*0.07){g.beginPath();g.moveTo(x,0);g.lineTo(x,H*0.6);g.stroke();}
    const pw=Math.min(W*0.4,48),ph=H*0.5;g.beginPath();g.moveTo(cx-pw/2,0);g.lineTo(cx-pw/2,ph*0.6);g.quadraticCurveTo(cx-pw/2,ph*0.92,cx,ph);g.quadraticCurveTo(cx+pw/2,ph*0.92,cx+pw/2,ph*0.6);g.lineTo(cx+pw/2,0);g.closePath();g.fillStyle=dk;g.fill();
    const gr=g.createRadialGradient(cx,ph*0.35,0,cx,ph*0.35,pw*0.7);gr.addColorStop(0,A);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fill();g.strokeStyle=stone;g.lineWidth=3;g.stroke();
    [[W*0.17],[W*0.83]].forEach(([x])=>{g.beginPath();g.moveTo(x-5,H*0.26);g.lineTo(x+5,H*0.26);g.lineTo(x+5,H*0.44);g.lineTo(x,H*0.52);g.lineTo(x-5,H*0.44);g.closePath();g.fillStyle='#b6f07a';g.fill();g.strokeStyle=stone;g.lineWidth=2;g.stroke();g.beginPath();g.moveTo(x,H*0.26);g.lineTo(x,H*0.5);g.strokeStyle=dk;g.lineWidth=1;g.stroke();});
    g.fillStyle='#2a2036';g.fillRect(W*0.12,H*0.55,W*0.76,H*0.13);g.strokeStyle='#8a7a5a';g.lineWidth=2;g.strokeRect(W*0.12,H*0.55,W*0.76,H*0.13);FD.txt(g,name,cx,H*0.615,H*0.09,'#f0e6c8',W*0.72);
    g.beginPath();g.arc(cx,H*0.8,H*0.06,0,7);g.fillStyle='#b6f07a';g.fill();g.strokeStyle=stone;g.lineWidth=2;g.stroke();g.fillStyle='#0c0a14';[[-0.02],[0.02]].forEach(([d])=>{g.beginPath();g.arc(cx+d*W*1.6,H*0.81,H*0.012,0,7);g.fill();});
    g.strokeStyle='#14101e';g.lineWidth=1.5;for(let x=2;x<W;x+=6){g.beginPath();g.moveTo(x,0);g.lineTo(x,H*0.13);g.stroke();g.beginPath();g.moveTo(x-2,H*0.13);g.lineTo(x,H*0.17);g.lineTo(x+2,H*0.13);g.fillStyle='#14101e';g.fill();}
    g.strokeStyle='rgba(220,220,235,.35)';g.lineWidth=0.8;for(let k=1;k<5;k++){g.beginPath();g.moveTo(0,H*0.62);g.lineTo(W*0.2*k/4*1.4,H*(0.62-0.1*k));g.stroke();}}
  else if(style==='funhouse'){const N=Math.max(8,Math.round(W/9));for(let i=0;i<N;i++){g.fillStyle=i%2?'#f6efe0':A;g.fillRect(i*W/N,0,W/N+0.5,H);}
    g.fillStyle='#f2c230';g.fillRect(0,H*0.78,W,H*0.05);const M=Math.max(7,Math.round(W/10));for(let i=0;i<M;i++){g.beginPath();g.arc((i+0.5)*W/M,H*0.78,W/M/2,0,Math.PI);g.fillStyle=i%2?'#d9342b':'#f6efe0';g.fill();}
    [[-0.17],[0.17]].forEach(([d])=>{g.beginPath();g.arc(cx+d*W,H*0.6,H*0.075,0,7);g.fillStyle='#fff';g.fill();g.strokeStyle='#14141a';g.lineWidth=2;g.stroke();g.beginPath();g.arc(cx+d*W,H*0.6,H*0.035,0,7);g.fillStyle='#2a5fa8';g.fill();});
    g.beginPath();g.arc(cx,H*0.5,H*0.05,0,7);g.fillStyle='#d9342b';g.fill();
    const mw=Math.min(W*0.5,56),mh=H*0.42;g.beginPath();g.ellipse(cx,H*0.2,mw/2,mh/2,0,0,7);g.fillStyle='#14090c';g.fill();const gr=g.createRadialGradient(cx,H*0.2,0,cx,H*0.2,mw/2);gr.addColorStop(0,A);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fill();
    g.strokeStyle='#d9342b';g.lineWidth=5;g.beginPath();g.ellipse(cx,H*0.2,mw/2,mh/2,0,0,7);g.stroke();g.fillStyle='#fff';for(let k=-3;k<=3;k++){g.fillRect(cx+k*mw*0.13-2,H*0.2+mh/2-6,4,5);g.fillRect(cx+k*mw*0.13-2,H*0.2-mh/2+1,4,5);}
    for(let k=0;k<18;k++){const a=k/18*6.283;g.beginPath();g.arc(cx+Math.cos(a)*(mw/2+7),H*0.2+Math.sin(a)*(mh/2+7),1.8,0,7);g.fillStyle='#ffe08a';g.fill();}
    g.fillStyle='#14141a';g.fillRect(W*0.08,H*0.86,W*0.84,H*0.11);FD.txt(g,name,cx,H*0.915,H*0.08,'#ffe08a',W*0.8);
    for(let i=0;i<N;i+=2){g.beginPath();g.moveTo(i*W/N,H);g.lineTo((i+1)*W/N,H);g.lineTo((i+0.5)*W/N,H+8);g.fillStyle=i%4?'#f2c230':'#2fb5a8';g.fill();}}
  else if(style==='adventure'){const st='#b6aa86',dk='#1a140c';g.fillStyle='#7d7152';g.fillRect(0,0,W,H);g.fillStyle=st;g.beginPath();g.moveTo(0,0);g.lineTo(W,0);g.lineTo(W,H*0.7);g.lineTo(W*0.78,H*0.7);g.lineTo(W*0.78,H*0.84);g.lineTo(W*0.62,H*0.84);g.lineTo(W*0.62,H);g.lineTo(W*0.38,H);g.lineTo(W*0.38,H*0.84);g.lineTo(W*0.22,H*0.84);g.lineTo(W*0.22,H*0.7);g.lineTo(0,H*0.7);g.closePath();g.fill();
    g.strokeStyle='rgba(60,45,20,.35)';g.lineWidth=1;for(let y=H*0.1,r=0;y<H;y+=H*0.1,r++){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();for(let x=(r%2)*W*0.06;x<W;x+=W*0.12){g.beginPath();g.moveTo(x,y-H*0.1);g.lineTo(x,y);g.stroke();}}
    const pw=Math.min(W*0.36,40),ph=H*0.42;g.fillStyle=dk;g.fillRect(cx-pw/2,0,pw,ph);g.fillStyle='#8a7e5e';g.fillRect(cx-pw/2-4,ph,pw+8,H*0.06);const gr=g.createLinearGradient(0,0,0,ph);gr.addColorStop(0,A);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(cx-pw/2,0,pw,ph);
    g.beginPath();g.arc(cx,H*0.62,H*0.105,0,7);g.fillStyle='#8f845f';g.fill();g.strokeStyle='#5a4e30';g.lineWidth=2;g.stroke();[[-1],[1]].forEach(([d])=>{g.fillStyle=A;g.fillRect(cx+d*H*0.045-2.5,H*0.635,5,5);});g.fillStyle='#3a2e18';g.fillRect(cx-H*0.05,H*0.575,H*0.1,H*0.025);
    [W*0.12,W*0.88].forEach(x=>{g.fillStyle='#6a5e40';g.fillRect(x-4,0,8,H*0.5);g.beginPath();g.moveTo(x-5,H*0.5);g.lineTo(x,H*0.64);g.lineTo(x+5,H*0.5);g.closePath();g.fillStyle='#ff9a2a';g.fill();g.beginPath();g.moveTo(x-2.5,H*0.5);g.lineTo(x,H*0.58);g.lineTo(x+2.5,H*0.5);g.fillStyle='#ffe08a';g.fill();});
    g.fillStyle='#6f664a';g.fillRect(W*0.1,H*0.77,W*0.8,H*0.1);FD.txt(g,name,cx,H*0.82,H*0.07,'#e8dcae',W*0.76);g.strokeStyle='#3f7a38';g.lineWidth=2;[0.06,0.26,0.7,0.93].forEach(f=>{g.beginPath();g.moveTo(W*f,H);g.quadraticCurveTo(W*f+6,H*0.8,W*f-3,H*0.62);g.stroke();});}
  else {const wall='#2a3345';g.fillStyle=wall;g.fillRect(0,0,W,H);g.strokeStyle='rgba(120,160,200,.2)';g.lineWidth=1;for(let y=H*0.12;y<H;y+=H*0.12){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();}
    g.shadowColor=A;g.shadowBlur=8;g.strokeStyle=A;g.lineWidth=2.5;g.strokeRect(3,3,W-6,H-6);g.shadowBlur=0;
    const rr=Math.min(W*0.27,H*0.26),cy=H*0.42;g.beginPath();g.arc(cx,cy,rr,0,7);const gr=g.createRadialGradient(cx,cy,0,cx,cy,rr);gr.addColorStop(0,'#05070d');gr.addColorStop(0.7,'#0a1020');gr.addColorStop(1,A);g.fillStyle=gr;g.fill();g.shadowColor=A;g.shadowBlur=10;g.strokeStyle=A;g.lineWidth=4;g.stroke();g.shadowBlur=0;
    for(let k=0;k<40;k++){const a=k*2.4,d=Math.sqrt((k+1)/40)*rr*0.85;g.beginPath();g.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d,0.9,0,7);g.fillStyle='#fff';g.fill();}
    for(let k=0;k<12;k++){const a=k/12*6.283;g.beginPath();g.moveTo(cx+Math.cos(a)*(rr+3),cy+Math.sin(a)*(rr+3));g.lineTo(cx+Math.cos(a)*(rr+9),cy+Math.sin(a)*(rr+9));g.strokeStyle='#4fd8ff';g.lineWidth=2;g.stroke();}
    g.fillStyle='#0d1424';g.fillRect(W*0.08,H*0.8,W*0.84,H*0.13);g.strokeStyle='#4fd8ff';g.lineWidth=1.5;g.strokeRect(W*0.08,H*0.8,W*0.84,H*0.13);FD.txt(g,name,cx,H*0.865,H*0.08,'#8ff0ff',W*0.8);
    for(let i=0;i<5;i++){g.beginPath();g.arc(W*0.1+i*W*0.04,H*0.07,2.2,0,7);g.fillStyle=i%2?'#ff5a5a':'#5aff8a';g.fill();g.beginPath();g.arc(W*0.9-i*W*0.04,H*0.07,2.2,0,7);g.fill();}}}
function drSideFace(g,style,W,H,A){const col=DR_STYLES[style].wall;g.fillStyle=col;g.fillRect(0,0,W,H);
  if(style==='haunted'){g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=1;for(let x=4;x<W;x+=7){g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke();}[W*0.3,W*0.7].forEach(x=>{g.beginPath();g.moveTo(x-5,H*0.3);g.lineTo(x+5,H*0.3);g.lineTo(x+5,H*0.62);g.lineTo(x,H*0.76);g.lineTo(x-5,H*0.62);g.closePath();g.fillStyle='#b6f07a';g.fill();g.strokeStyle='#6a6285';g.lineWidth=2;g.stroke();});}
  else if(style==='funhouse'){const N=Math.max(6,Math.round(W/9));for(let i=0;i<N;i++){g.fillStyle=i%2?'#f6efe0':A;g.fillRect(i*W/N,0,W/N+0.5,H);}[W*0.3,W*0.7].forEach(x=>{g.beginPath();g.arc(x,H*0.55,H*0.14,0,7);g.fillStyle='#ffe08a';g.fill();g.strokeStyle='#14141a';g.lineWidth=2;g.stroke();});}
  else if(style==='adventure'){g.strokeStyle='rgba(60,45,20,.35)';g.lineWidth=1;for(let y=H*0.12,r=0;y<H;y+=H*0.12,r++){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();for(let x=(r%2)*8;x<W;x+=16){g.beginPath();g.moveTo(x,y-H*0.12);g.lineTo(x,y);g.stroke();}}[W*0.3,W*0.7].forEach(x=>{g.fillStyle='#2a2216';g.fillRect(x-5,H*0.3,10,H*0.4);g.fillStyle=A;g.fillRect(x-3,H*0.38,6,H*0.2);});}
  else{g.strokeStyle='rgba(120,160,200,.2)';g.lineWidth=1;for(let y=H*0.12;y<H;y+=H*0.12){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();}[W*0.25,W*0.5,W*0.75].forEach(x=>{g.beginPath();g.arc(x,H*0.55,H*0.12,0,7);g.fillStyle='#4fd8ff';g.fill();g.strokeStyle='#8aa0b8';g.lineWidth=2;g.stroke();});g.shadowColor=A;g.shadowBlur=6;g.strokeStyle=A;g.lineWidth=2;g.strokeRect(2,2,W-4,H-4);g.shadowBlur=0;}}
function drBigFace(g,W,H,A){g.fillStyle='#272b38';g.fillRect(0,0,W,H);g.strokeStyle='rgba(255,255,255,.07)';g.lineWidth=1;for(let x=0;x<W;x+=25){g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke();}g.fillStyle=A;g.fillRect(0,H*0.84,W,H*0.05);g.fillStyle='rgba(255,255,255,.18)';g.fillRect(0,H*0.89,W,1.5);
  const dx=W*0.72;g.fillStyle='#14161e';g.fillRect(dx,0,13,H*0.42);g.fillStyle='#34d058';g.beginPath();g.arc(dx+6.5,H*0.46,2,0,7);g.fill();}
function drLayout(R,mode,dir){const side=mode==='side',S=R*0.074,psi=side?Math.PI*0.75:(dir==='NE-SW'?1.2490:0.3217),c=Math.cos(psi),s=Math.sin(psi);
  const L1=side?11:9,L2=side?21:19,Wsm=side?8:8,Wbg=side?10:9.5,Ltot=L1+L2,endVis=(c+s)>0.3,bsign=(s-c>0)?-1:1,face=endVis?'end':'long',Hs=4.6,Hf=7.2,Hb=6.0;
  return{S,psi,c,s,L1,L2,Wsm,Wbg,Ltot,face,bsign,Hs,Hf,Hb};}
function drDraw(g,cx,cy,R,o,mode){const L=drLayout(R,mode,o.dir),S=L.S,Pj=FD.proj(cx,cy,S),A=o.accent||'#f8fafc',style=DR_STYLES[o.style]?o.style:'haunted',name=(o.name||DR_STYLES[style].def).toUpperCase(),wall=DR_STYLES[style].wall,{psi,c,s}=L;
  const W2=(a,b)=>[a*c-b*s,a*s+b*c];
  /* soft shadow */g.save();g.translate(S*0.9,S*0.5);g.globalAlpha=0.22;FD.poly(g,[[-L.Ltot/2,-L.Wbg/2],[L.Ltot/2,-L.Wbg/2],[L.Ltot/2,L.Wbg/2],[-L.Ltot/2,L.Wbg/2]].map(([a,b])=>{const w=W2(a,b);return Pj(w[0],w[1],0);}),'#0c1218');g.restore();
  const aBig=-L.Ltot/2+L.L2/2,aSm=L.Ltot/2-L.L1/2,wb=W2(aBig,0),ws=W2(aSm,0);
  /* big show building */
  const big=FD.box(g,Pj,S,wb[0],wb[1],0,L.L2,L.Wbg,L.Hb,psi,'#272b38',(gg,f,W,H)=>{drBigFace(gg,W,H,A);},{top:'#3a3f4e'});
  const rr=mulberry(7);for(let k=0;k<3;k++){const a=aBig+(k-1)*L.L2*0.28,b=(k%2?-1:1)*L.Wbg*0.18,w=W2(a,b);FD.box(g,Pj,S,w[0],w[1],L.Hb,2.4,1.7,0.9,psi,'#8a93a3',null);}
  { const w=W2(aBig+L.L2*0.3,L.Wbg*0.22);const p=Pj(w[0],w[1],L.Hb+0.9);FD.ell(g,p[0],p[1],S*0.55,S*0.27,'#5d6575');FD.ln(g,Pj(w[0],w[1],L.Hb+0.9),Pj(w[0],w[1],L.Hb+2.6),'#5d6575',S*0.25);const q=Pj(w[0],w[1],L.Hb+2.7);FD.ell(g,q[0],q[1],S*0.6,S*0.3,'#8a93a3'); }
  /* entrance building: body + false-front slab carrying the themed front */
  FD.box(g,Pj,S,ws[0],ws[1],0,L.L1,L.Wsm,L.Hs,psi,wall,(gg,f,W,H)=>drSideFace(gg,style,W,H,A),{top:shade(wall,-0.35)});
  const th=0.8;let slab;if(L.face==='end'){const w=W2(L.Ltot/2-th/2,0);slab=FD.box(g,Pj,S,w[0],w[1],0,th,L.Wsm+0.6,L.Hf,psi,wall,(gg,f,W,H)=>{if(f.kind==='end')drFacade(gg,style,W,H,A,name);},{top:shade(wall,-0.45)});}
  else{const w=W2(aSm,L.bsign*(L.Wsm/2-th/2));slab=FD.box(g,Pj,S,w[0],w[1],0,L.L1+0.6,th,L.Hf,psi,wall,(gg,f,W,H)=>{if(f.kind==='long')drFacade(gg,style,W,H,A,name);},{top:shade(wall,-0.45)});}
  /* queue posts in front of the facade */
  const fo=L.face==='end'?W2(L.Ltot/2+1.3,0):W2(aSm,L.bsign*(L.Wsm/2+1.3)),fu=L.face==='end'?[-s,c]:[c,s];let pts=[];for(let k=-2;k<=2;k++){const sp=L.face==='end'?L.Wsm*0.3:L.L1*0.28,x=fo[0]+fu[0]*k*sp*0.9,y=fo[1]+fu[1]*k*sp*0.9;pts.push([x,y]);}
  pts=pts.sort((p,q)=>(p[0]+p[1])-(q[0]+q[1]));pts.forEach((p,i)=>{const b=Pj(p[0],p[1],0),t=Pj(p[0],p[1],1.0);if(i)FD.ln(g,Pj(pts[i-1][0],pts[i-1][1],0.85),Pj(p[0],p[1],0.85),A,S*0.07);FD.ln(g,b,t,'#d9b44a',S*0.1);FD.ell(g,t[0],t[1],S*0.12,S*0.12,'#f0d27a');});}
function darkRideSprite(R,mode,dir,accent,style,name,scale){darkRideSprite._c=darkRideSprite._c||{};const sc=scale||Math.max(1,Math.min(2,(typeof devicePixelRatio==='number'?devicePixelRatio:1))),key=[mode,dir,R,accent,style,name,sc].join('|');if(darkRideSprite._c[key])return darkRideSprite._c[key];
  const side=mode==='side',W=Math.ceil((side?3.4:2.4)*R),H=Math.ceil((side?1.9:2.0)*R),oy=(side?1.15:1.25)*R,cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);
  drDraw(g,W/2,oy,R,{accent,style,name,dir},mode);return darkRideSprite._c[key]={canvas:cv,ox:W/2,oy,w:W,h:H};}
function drawRideActivity(ctx,cx,cy,R,options,span,yOffset){
  if(options.t==null)return;
  const phase=(options.t%2.8)/2.8,x=cx+(phase*2-1)*R*span,y=cy+R*yOffset,accent=options.accent||'#f8fafc';
  ctx.save();ctx.globalAlpha=0.78;ctx.shadowColor=accent;ctx.shadowBlur=R*0.12;ctx.fillStyle=accent;
  ctx.beginPath();ctx.ellipse(x,y,R*0.055,R*0.028,0,0,7);ctx.fill();ctx.restore();
}
function drawDarkRideSide(ctx,cx,cy,R,o){o=o||{};const s=darkRideSprite(R,'side','',o.accent||'#d9342b',o.style||'haunted',o.name||'');ctx.drawImage(s.canvas,cx-s.ox,cy-s.oy,s.w,s.h);drawRideActivity(ctx,cx,cy,R,o,0.55,0.12);}
function drawDarkRideDiag(ctx,cx,cy,R,o){o=o||{};const d=o.dir==='NE-SW'?'NE-SW':'NW-SE',s=darkRideSprite(R,'diag',d,o.accent||'#d9342b',o.style||'haunted',o.name||'');ctx.drawImage(s.canvas,cx-s.ox,cy-s.oy,s.w,s.h);drawRideActivity(ctx,cx,cy,R,o,0.35,0.12);}
function darkRideFootprint(R,mode,dir){const L=drLayout(R,mode,dir),m=dir==='NE-SW'?-1:1,c=[],S=L.S,{c:cs,s:sn}=L;const proj=(a,b)=>{const X=a*cs-b*sn,Y=a*sn+b*cs;return[(X-Y)*0.7*S,(X+Y)*0.35*S];};
  for(let a=-L.Ltot/2;a<=L.Ltot/2+0.01;a+=2.2){const b=a<-L.Ltot/2+L.L2?L.Wbg:L.Wsm,p=proj(a,0);c.push({x:p[0],y:p[1],r:S*(b*0.5+(mode==='side'?1.2:1.6))*(mode==='side'?0.75:0.8)});}
  const q=proj(L.Ltot/2+1.6,0);c.push({x:q[0],y:q[1],r:S*4.2});return{tiles:(mode==='side'?[[-0.866*R,0],[0.866*R,0]]:[[-0.433*R,-0.435*R],[0.433*R,0.435*R]]).map(h=>[h[0]*m,h[1]]),circles:c.map(k=>({x:k.x,y:k.y,r:k.r}))};}
function footprintForTile(fp,i){const t=fp.tiles[i];return fp.circles.map(c=>({x:c.x-t[0],y:c.y-t[1],r:c.r}));};
/* DRAW ORDER: a ride must paint OVER any scenery that stands behind it.
 * circles = the ride's footprint (darkRideFootprint(...).circles, or flyingTheaterFootprint(R)); (x,y) = the scenery item's ground point,
 * both in the same px space (relative to the sprite centre). Returns true only for scenery IN FRONT of the ride: draw those AFTER the ride sprite.
 * Everything else (behind or beside it) is drawn BEFORE the ride, in y order. Do not sort the ride against scenery by its centre line. */
function sceneryInFront(circles,x,y){let f=-Infinity;for(const c of circles){const dx=x-c.x;if(Math.abs(dx)<c.r)f=Math.max(f,c.y+Math.sqrt(c.r*c.r-dx*dx)/1.7);}return f>-Infinity&&y>f;};
/* ---------------- Flying theater: wide curved-roof hangar (generic, theme it with the land colour) ---------------- */
function ftDraw(g,cx,cy,R,A,name){const S=R*0.08,Pj=FD.proj(cx,cy,S),I=Pj,hx=4.8,y0=-3.2,y1=2.4,wh=2.8,ab=3.3,N=28,A2=shade(A,-0.28),wallC='#aebacb';
  g.save();g.translate(S*0.7,S*0.45);g.globalAlpha=0.22;FD.poly(g,[I(-hx-0.4,y0-0.4,0),I(hx+0.4,y0-0.4,0),I(hx+0.4,3.7,0),I(-hx-0.4,3.7,0)],'#0c1218');g.restore();
  /* forecourt: plain paving with land-colour borders */
  FD.poly(g,[I(-hx-0.4,y1,0.02),I(hx+0.4,y1,0.02),I(hx+0.4,3.6,0.02),I(-hx-0.4,3.6,0.02)],'#b9c0cc');FD.poly(g,[I(-hx-0.4,3.3,0.03),I(hx+0.4,3.3,0.03),I(hx+0.4,3.6,0.03),I(-hx-0.4,3.6,0.03)],A);FD.poly(g,[I(-3.4,y1+0.25,0.03),I(3.4,y1+0.25,0.03),I(3.4,y1+0.55,0.03),I(-3.4,y1+0.55,0.03)],A2);
  /* +X side wall */
  const sideP=[I(hx,y1,0),I(hx,y0,0),I(hx,y0,wh),I(hx,y1,wh)];FD.poly(g,sideP,wallC);FD.art(g,Pj,S,sideP,[hx,y1],0,-1,0,(gg,W,H)=>{gg.fillStyle=wallC;gg.fillRect(0,0,W,H);gg.strokeStyle='rgba(40,55,80,.26)';gg.lineWidth=1;for(let x=0;x<W;x+=3){gg.beginPath();gg.moveTo(x,0);gg.lineTo(x,H);gg.stroke();}
    gg.fillStyle=A;gg.fillRect(0,0,W,6);gg.fillStyle=A2;gg.fillRect(0,H-4,W,4);for(let k=0;k<5;k++){const x=19+k*7.4;gg.fillStyle='#cfe9ff';gg.fillRect(x,12,5,6);gg.strokeStyle='#44546a';gg.lineWidth=1;gg.strokeRect(x,12,5,6);}gg.fillStyle='#3d4a5e';gg.fillRect(5,6,8,14);gg.fillStyle=A;gg.fillRect(4,20,10,1.6);},(y1-y0)*10,wh*10);
  /* barrel roof, far side first; a wide land-colour band runs along the crown */
  const ring=t=>[hx*Math.cos(t),wh+ab*Math.sin(t)];for(let k=0;k<N;k++){const t0=Math.PI-k/N*Math.PI,t1=Math.PI-(k+1)/N*Math.PI,p0=ring(t0),p1=ring(t1),tm=(t0+t1)/2,amt=0.2*Math.sin(tm)-0.28*Math.max(0,Math.cos(tm))+0.02,band=(k>=10&&k<=17)||k===4||k===23;
    FD.poly(g,[I(p0[0],y0,p0[1]),I(p0[0],y1,p0[1]),I(p1[0],y1,p1[1]),I(p1[0],y0,p1[1])],shade(band?(k>=10&&k<=17?A:A2.startsWith('#')?A2:A):'#8f9db2',band?amt:amt));}
  for(let y=y0+0.4;y<y1;y+=0.8){g.beginPath();for(let k=0;k<=N;k++){const q=ring(Math.PI-k/N*Math.PI),pt=I(q[0],y,q[1]);k?g.lineTo(pt[0],pt[1]):g.moveTo(pt[0],pt[1]);}g.strokeStyle='rgba(30,45,70,.3)';g.lineWidth=S*0.05;g.stroke();}
  g.beginPath();for(let k=0;k<=N;k++){const q=ring(Math.PI-k/N*Math.PI),pt=I(q[0],y1,q[1]);k?g.lineTo(pt[0],pt[1]):g.moveTo(pt[0],pt[1]);}g.strokeStyle=A2;g.lineWidth=S*0.26;g.stroke();
  for(let k=0;k<3;k++){const v=I(0.2,y0+1.2+k*1.9,wh+ab+0.05);FD.ell(g,v[0],v[1],S*0.45,S*0.22,'#5d6a80');FD.ell(g,v[0],v[1]-S*0.18,S*0.34,S*0.16,'#7d8aa0');}
  /* front arched face: big land-colour tympanum, wide door with land-colour sliding leaves, a blank sign (or your text) */
  const arch=[I(-hx,y1,0),I(hx,y1,0),I(hx,y1,wh)];for(let k=0;k<=N;k++){const q=ring(k/N*Math.PI);arch.push(I(q[0],y1,q[1]));}arch.push(I(-hx,y1,wh));
  FD.poly(g,arch,wallC);FD.art(g,Pj,S,arch,[-hx,y1],1,0,0,(gg,W,H)=>{gg.fillStyle=wallC;gg.fillRect(0,0,W,H);
    gg.fillStyle=A;gg.beginPath();gg.moveTo(5,36);gg.lineTo(W-5,36);for(let k=0;k<=24;k++){const t=k/24*Math.PI;gg.lineTo(W/2+(W/2-5)*Math.cos(t),wh*10+(H-wh*10-5)*Math.sin(t));}gg.closePath();gg.fill();
    gg.fillStyle=A2;gg.beginPath();gg.moveTo(W/2-15,36);gg.lineTo(W/2+15,36);gg.lineTo(W/2+10,H-14);gg.lineTo(W/2-10,H-14);gg.closePath();gg.fill();
    gg.strokeStyle='rgba(30,45,70,.22)';gg.lineWidth=1;for(let x=0;x<W;x+=3){gg.beginPath();gg.moveTo(x,0);gg.lineTo(x,H);gg.stroke();}
    const dw=56,dx=(W-dw)/2,dh=33;gg.fillStyle='#0c1118';gg.fillRect(dx,0,dw,dh);const gr=gg.createLinearGradient(0,0,0,dh);gr.addColorStop(0,A);gr.addColorStop(1,'rgba(0,0,0,0)');gg.fillStyle=gr;gg.fillRect(dx,0,dw,dh);gg.fillStyle='rgba(255,255,255,.14)';gg.beginPath();gg.ellipse(W/2,dh*0.55,dw*0.34,dh*0.3,0,0,7);gg.fill();
    gg.fillStyle=A;gg.fillRect(dx-14,0,14,dh+1);gg.fillRect(dx+dw,0,14,dh+1);gg.strokeStyle=A2;gg.lineWidth=1.2;for(let k=1;k<7;k++){gg.beginPath();gg.moveTo(dx-14+k*2,0);gg.lineTo(dx-14+k*2,dh);gg.stroke();gg.beginPath();gg.moveTo(dx+dw+k*2,0);gg.lineTo(dx+dw+k*2,dh);gg.stroke();}
    for(let x=dx;x<dx+dw;x+=7){gg.fillStyle=((x-dx)/7)%2?'#14141a':'#f6efe0';gg.beginPath();gg.moveTo(x,0);gg.lineTo(x+7,0);gg.lineTo(x+10,3);gg.lineTo(x+3,3);gg.closePath();gg.fill();}
    const pw=dw*0.86,px=(W-pw)/2;gg.fillStyle='#121a26';gg.fillRect(px,38.5,pw,10);gg.strokeStyle='#f6efe0';gg.lineWidth=1.2;gg.strokeRect(px,38.5,pw,10);
    if(name)FD.txt(gg,name,W/2,43.5,5.6,'#f2f6fb',pw*0.92);else{for(let k=0;k<9;k++){gg.fillStyle=k%2?'#f6efe0':A;gg.fillRect(px+3+k*(pw-6)/9,41,(pw-6)/9-1.6,5);}}
    for(let k=0;k<=22;k++){const t=k/22*Math.PI,x=W/2+(W/2-2.4)*Math.cos(t),y=wh*10+(H-wh*10-2.4)*Math.sin(t);if(y<8)continue;gg.beginPath();gg.arc(x,y,1.25,0,7);gg.fillStyle='#fff3b0';gg.fill();}},hx*20,(wh+ab)*10);}
/* ground circles (tile-local px) for placeThemeAssets(..., {avoid: flyingTheaterFootprint(R)}) */
function flyingTheaterFootprint(R){const u=R*0.08,P=(X,Y)=>[(X-Y)*0.7*u,(X+Y)*0.35*u],c=[];for(let Y=-2.8;Y<=2.2;Y+=1.5)[-3.6,-1.2,1.2,3.6].forEach(X=>{const p=P(X,Y);c.push({x:p[0],y:p[1],r:2.3*u});});[-4,-1.4,1.4,4].forEach(X=>{const p=P(X,3.1);c.push({x:p[0],y:p[1],r:1.9*u});});return c;}
function flyingTheaterSprite(R,accent,name,scale){flyingTheaterSprite._c=flyingTheaterSprite._c||{};const sc=scale||Math.max(1,Math.min(2,(typeof devicePixelRatio==='number'?devicePixelRatio:1))),key=[R,accent,name,sc].join('|');if(flyingTheaterSprite._c[key])return flyingTheaterSprite._c[key];
  const W=Math.ceil(1.8*R),H=Math.ceil(1.6*R),oy=1.05*R,cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);ftDraw(g,W/2,oy,R,accent,name);return flyingTheaterSprite._c[key]={canvas:cv,ox:W/2,oy,w:W,h:H};}
function drawFlyingTheater(ctx,cx,cy,R,o){o=o||{};const s=flyingTheaterSprite(R,o.accent||'#38bdf8',o.name||'');ctx.drawImage(s.canvas,cx-s.ox,cy-s.oy,s.w,s.h);drawRideActivity(ctx,cx,cy,R,o,0.24,0.16);}
/* ===== END FLYING THEATER + DARK RIDE ===== */


return { drawDarkRideSide, drawDarkRideDiag, drawFlyingTheater, darkRideFootprint, flyingTheaterFootprint, sceneryInFront, footprintForTile };
})();
window.drawDarkRideSide = REGIONAL_TRACKED_RIDE_SPRITES.drawDarkRideSide;
window.drawDarkRideDiag = REGIONAL_TRACKED_RIDE_SPRITES.drawDarkRideDiag;
window.drawFlyingTheater = REGIONAL_TRACKED_RIDE_SPRITES.drawFlyingTheater;
