/* Depth-sliced Classic, Nordic, and Alpine Macro-Land packs. */
const classicLandMacroPack = (() => {
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

/* ===== CLASSIC MIDWAY / COUNTY FAIR ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const CSH=(c,x,y,rx)=>{c.fillStyle='rgba(60,44,20,.26)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const CSTR=[['#d8342b','#f8f4ea'],['#2a5aa8','#f2c230'],['#2aa8a0','#f8f4ea'],['#f06aa0','#f8f4ea'],['#f08a24','#f8f4ea'],['#7a4ab8','#f2c230']];
const CCOL=['#d8342b','#2a5aa8','#f2c230','#2aa8a0','#f06aa0','#f08a24','#7ac43a'];
const CWOOD='#9a6a3a',CWOOD_D='#5a3a1e',CCREAM='#f8f4ea';
const CBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.26),shade(col,0.12));
const CFLIP=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
const CFLAG=(c,x,y,u,s,col)=>{TH.ln(c,[x,y],[x,y-u*1.8*s],'#5a3a22',u*0.07*s);TH.poly(c,[[x,y-u*1.75*s],[x+u*0.9*s,y-u*1.62*s],[x+u*0.72*s,y-u*1.38*s],[x+u*0.9*s,y-u*1.15*s],[x,y-u*1.25*s]],col||'#d8342b');};
const CBALLOON=(c,x,y,r,col)=>{c.fillStyle=col;c.beginPath();c.ellipse(x,y,r,r*1.15,0,0,7);c.fill();c.fillStyle='rgba(255,255,255,.45)';c.beginPath();c.ellipse(x-r*0.3,y-r*0.4,r*0.25,r*0.35,0,0,7);c.fill();c.fillStyle=shade(col,-0.25);c.beginPath();c.moveTo(x,y+r*1.15);c.lineTo(x-r*0.18,y+r*1.4);c.lineTo(x+r*0.18,y+r*1.4);c.fill();};
const CPLUSH=(c,x,y,r,col)=>{TH.ell(c,x,y,r,r*0.95,col);TH.ell(c,x-r*0.6,y-r*0.8,r*0.38,r*0.38,col);TH.ell(c,x+r*0.6,y-r*0.8,r*0.38,r*0.38,col);TH.ell(c,x-r*0.3,y-r*0.1,r*0.12,r*0.12,'#222');TH.ell(c,x+r*0.3,y-r*0.1,r*0.12,r*0.12,'#222');TH.ell(c,x,y+r*0.25,r*0.22,r*0.16,shade(col,0.3));};
/* ---- fair booths: one parametric body (striped canvas roof, open counter), 4 orientations (gable/eave front x mirror) ---- */
const CBOOTH_T={
  gameBooth:{ha:1.2,hb:1.5,rise:0.95,kind:'game',sw:3.0,sh:0.95},
  foodStand:{ha:1.1,hb:1.4,rise:0.9,kind:'food',sw:2.8,sh:0.9},
  ticketBooth:{ha:0.8,hb:1.0,rise:0.8,kind:'ticket',sw:2.2,sh:0.8},
  smallBarn:{ha:1.5,hb:2.1,rise:1.7,kind:'barn',sw:3.9,sh:1.15}
};
function CBOOTH_BODY(c,x,y,u,s,eave,T){const r=mulberry(s*7+3),Iw=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),L=(a,b,z)=>eave?Iw(b,a,z):Iw(a,b,z),LBOX=(a0,a1,b0,b1,z0,z1,col)=>eave?CBOX(c,x,y,u,b0,b1,a0,a1,z0,z1,col):CBOX(c,x,y,u,a0,a1,b0,b1,z0,z1,col);
  const ha=T.ha,hb=T.hb,st=CSTR[s%6],faces=(aa,bb,o)=>[{J:(a,z)=>L(a,bb+o,z),p0:-aa,p1:aa},{J:(b,z)=>L(aa+o,b,z),p0:-bb,p1:bb}];
  const F1=faces(ha,hb,0.012)[0],F2=faces(ha,hb,0.012)[1],doorF=eave?F2:F1,otherF=eave?F1:F2;
  const quad=(F,p0,p1,z0,z1,col,stroke)=>TH.poly(c,[F.J(p0,z0),F.J(p1,z0),F.J(p1,z1),F.J(p0,z1)],col,stroke,stroke?u*0.05:0);
  if(T.kind==='barn'){const zw=2.3,zr=zw+T.rise,ov=0.4;LBOX(-ha,ha,-hb,hb,0,zw,'#b03a2a');[F1,F2].forEach(F=>{const n=Math.round((F.p1-F.p0)/0.28);for(let k=0;k<=n;k++){const p=F.p0+(F.p1-F.p0)*k/n;TH.ln(c,F.J(p,0),F.J(p,zw),'rgba(60,10,6,.35)',u*0.05);}TH.ln(c,F.J(F.p0,0),F.J(F.p0,zw),CCREAM,u*0.14);TH.ln(c,F.J(F.p1,0),F.J(F.p1,zw),CCREAM,u*0.14);TH.ln(c,F.J(F.p0,zw-0.04),F.J(F.p1,zw-0.04),CCREAM,u*0.12);TH.ln(c,F.J(F.p0,0.04),F.J(F.p1,0.04),CCREAM,u*0.12);});
    quad(doorF,-0.62,0.62,0,1.6,'#8a2a1c',CCREAM);TH.ln(c,doorF.J(0,0),doorF.J(0,1.6),CCREAM,u*0.08);[-1,1].forEach(sg=>{TH.ln(c,doorF.J(sg*0.62,0),doorF.J(sg*0.04,1.6),CCREAM,u*0.08);TH.ln(c,doorF.J(sg*0.04,0),doorF.J(sg*0.62,1.6),CCREAM,u*0.08);});
    [-0.9,0.9].forEach(p=>{if(Math.abs(p)<doorF.p1*0.95){quad(doorF,p-0.2,p+0.2,0.9,1.5,'#2a3a50',CCREAM);}});quad(otherF,-0.25,0.25,0.9,1.5,'#2a3a50',CCREAM);quad(otherF,-otherF.p1*0.6-0.25,-otherF.p1*0.6+0.25,0.9,1.5,'#2a3a50',CCREAM);
    const rA=L(ha+ov,-hb-ov,zw),rB=L(ha+ov,hb+ov,zw),rC=L(0,hb+ov,zr),rD=L(0,-hb-ov,zr);TH.poly(c,[rA,rB,rC,rD],'#5c6068');for(let k=1;k<6;k++)TH.ln(c,L(ha+ov-(ha+ov)*k/6,-hb-ov,zw+T.rise*k/6),L(ha+ov-(ha+ov)*k/6,hb+ov,zw+T.rise*k/6),'rgba(10,12,16,.35)',u*0.05);
    TH.poly(c,[L(-ha,hb+0.02,zw),L(ha,hb+0.02,zw),L(0,hb+0.02,zr-0.1)],'#b03a2a');const lq=[L(-0.45,hb+0.03,zw+0.35),L(0.45,hb+0.03,zw+0.35),L(0.45,hb+0.03,zw+0.95),L(-0.45,hb+0.03,zw+0.95)];TH.poly(c,lq,'#2a1a10',CCREAM,u*0.06);for(let k=0;k<5;k++){const q=L(-0.35+k*0.18,hb+0.04,zw+0.55);TH.blob(c,q[0],q[1],u*0.18,u*0.14,'#e0c060',r,6);}
    TH.ln(c,L(-ha-ov,hb+ov,zw),L(0,hb+ov,zr),CCREAM,u*0.12);TH.ln(c,L(ha+ov,hb+ov,zw),L(0,hb+ov,zr),CCREAM,u*0.12);const cp=L(0,0,zr);TH.poly(c,[[cp[0]-u*0.4,cp[1]],[cp[0]+u*0.4,cp[1]],[cp[0]+u*0.34,cp[1]-u*0.7],[cp[0]-u*0.34,cp[1]-u*0.7]],CCREAM);TH.poly(c,[[cp[0]-u*0.5,cp[1]-u*0.7],[cp[0]+u*0.5,cp[1]-u*0.7],[cp[0],cp[1]-u*1.25]],'#5c6068');CFLAG(c,cp[0],cp[1]-u*1.2,u,0.9);
    const rb=[doorF.J(-0.9,1.1),doorF.J(0.9,1.1)];rb.forEach((q,i)=>{TH.ell(c,q[0],q[1],u*0.2,u*0.2,i?'#d8342b':'#2a5aa8');TH.poly(c,[[q[0]-u*0.12,q[1]+u*0.1],[q[0]-u*0.2,q[1]+u*0.5],[q[0],q[1]+u*0.35]],i?'#d8342b':'#2a5aa8');TH.poly(c,[[q[0]+u*0.12,q[1]+u*0.1],[q[0]+u*0.2,q[1]+u*0.5],[q[0],q[1]+u*0.35]],i?'#a82820':'#1f4488');});return;}
  const zp=2.0,ov=0.4,zr=zp+T.rise;LBOX(-ha-0.1,ha+0.1,-hb-0.1,hb+0.1,0,0.12,'#a8834e');
  const n=Math.max(3,Math.round((otherF.p1-otherF.p0)/0.4));for(let k=0;k<n;k++){const p0=otherF.p0+(otherF.p1-otherF.p0)*k/n,p1=otherF.p0+(otherF.p1-otherF.p0)*(k+1)/n;quad(otherF,p0,p1,0.12,zp,st[k%2]);}
  const inset=eave?(a,z)=>L(ha-0.28,a,z):(a,z)=>L(a,hb-0.28,z),span=eave?hb:ha;
  TH.poly(c,[inset(-span,0.12),inset(span,0.12),inset(span,zp),inset(-span,zp)],'#3a2a22');
  if(T.kind==='game'||T.kind==='ticket'){const nr=T.kind==='game'?3:1;for(let row=0;row<nr;row++){const z=1.05+row*0.32;TH.ln(c,inset(-span*0.9,z),inset(span*0.9,z),'#6a4a2a',u*0.07);for(let k=0;k<5;k++){const q=inset(-span*0.8+k*span*0.4,z+0.18);if(T.kind==='game')CPLUSH(c,q[0],q[1],u*0.24,CCOL[(k+row+s)%7]);else TH.poly(c,[[q[0]-u*0.14,q[1]+u*0.1],[q[0]+u*0.14,q[1]+u*0.1],[q[0]+u*0.14,q[1]-u*0.14],[q[0]-u*0.14,q[1]-u*0.14]],'#f6d878');}}}
  else{for(let k=0;k<4;k++){const q=inset(-span*0.75+k*span*0.5,1.5+(k%2)*0.2);TH.ln(c,[q[0],q[1]-u*0.5],[q[0],q[1]],'#a8a8a0',u*0.04);if(s%4===2)TH.ell(c,q[0],q[1]+u*0.1,u*0.1,u*0.2,'#d8a040');else TH.ell(c,q[0],q[1]+u*0.05,u*0.16,u*0.16,CCOL[(k+s)%7]);}}
  /* counter with painted front */
  if(eave)LBOX(ha-0.12,ha+0.14,-hb,hb,0.12,0.95,'#e8e0cc');else LBOX(-ha,ha,hb-0.12,hb+0.14,0.12,0.95,'#e8e0cc');
  const cF=eave?{J:(b,z)=>L(ha+0.15,b,z),p0:-hb,p1:hb}:{J:(a,z)=>L(a,hb+0.15,z),p0:-ha,p1:ha};const nc=Math.round((cF.p1-cF.p0)/0.3);for(let k=0;k<nc;k++){const p0=cF.p0+(cF.p1-cF.p0)*k/nc,p1=cF.p0+(cF.p1-cF.p0)*(k+1)/nc;quad(cF,p0,p1,0.12,0.95,st[k%2]);}TH.poly(c,[cF.J(cF.p0-0.05,0.95),cF.J(cF.p1+0.05,0.95),cF.J(cF.p1+0.05,1.05),cF.J(cF.p0-0.05,1.05)],CWOOD);
  /* goods on the counter */
  const top=(p)=>cF.J(p,1.05);
  if(T.kind==='game'){const m=s%3;for(let k=0;k<5;k++){const q=top(-cF.p1*0.7+k*cF.p1*0.35);if(m===0){for(let j=0;j<3-Math.abs(k-2)%3;j++){c.fillStyle='#f8f4ea';c.fillRect(q[0]-u*0.07,q[1]-u*(0.4+j*0.4),u*0.14,u*0.38);TH.ell(c,q[0],q[1]-u*(0.42+j*0.4),u*0.07,u*0.04,'#d8342b');}}else if(m===1){CBALLOON(c,q[0],q[1]-u*0.55,u*0.2,CCOL[(k+s)%7]);}else{c.strokeStyle=CCOL[(k+s)%7];c.lineWidth=u*0.07;c.beginPath();c.ellipse(q[0],q[1]-u*0.1,u*0.2,u*0.08,0,0,7);c.stroke();TH.ln(c,[q[0],q[1]],[q[0],q[1]-u*0.55],'#8a8a82',u*0.05);}}}
  else if(T.kind==='food'){const m=s%4,q=top(0),q2=top(cF.p1*0.55),q3=top(-cF.p1*0.55);if(m===0){TH.ell(c,q[0],q[1]-u*0.1,u*0.55,u*0.2,'#e8e8f0');TH.blob(c,q[0],q[1]-u*0.5,u*0.45,u*0.4,'#f8a0c8',r,8);TH.poly(c,[[q[0]-u*0.3,q[1]-u*0.05],[q[0]+u*0.3,q[1]-u*0.05],[q[0]+u*0.15,q[1]-u*0.2],[q[0]-u*0.15,q[1]-u*0.2]],'#c8c8d0');}else if(m===1){CBOX(c,q[0],q[1],u,0,0,0,0,0,0,'#000');c.fillStyle='#d8342b';c.fillRect(q[0]-u*0.5,q[1]-u*0.45,u*1.0,u*0.45);c.fillStyle='rgba(230,245,250,.8)';c.fillRect(q[0]-u*0.45,q[1]-u*1.2,u*0.9,u*0.75);for(let k=0;k<12;k++)TH.ell(c,q[0]+(r()-0.5)*u*0.8,q[1]-u*(0.6+r()*0.55),u*0.09,u*0.07,'#fff2b0');TH.poly(c,[[q[0]-u*0.5,q[1]-u*1.2],[q[0]+u*0.5,q[1]-u*1.2],[q[0]+u*0.35,q[1]-u*1.45],[q[0]-u*0.35,q[1]-u*1.45]],'#d8342b');}else if(m===2){for(let k=0;k<5;k++){const px=q[0]+(k-2)*u*0.3;TH.ln(c,[px,q[1]-u*0.05],[px,q[1]-u*0.8],'#e8d8a8',u*0.06);TH.ell(c,px,q[1]-u*0.45,u*0.1,u*0.3,'#d8963a');}}else{for(let k=0;k<3;k++){const px=q[0]+(k-1)*u*0.5;c.fillStyle='rgba(250,240,160,.9)';c.fillRect(px-u*0.17,q[1]-u*0.7,u*0.34,u*0.7);TH.ell(c,px,q[1]-u*0.7,u*0.17,u*0.07,'#fff8c0');TH.ell(c,px+u*0.05,q[1]-u*0.35,u*0.08,u*0.08,'#f2d830');}}}
  else{const q=top(0);TH.poly(c,[[q[0]-u*0.5,q[1]],[q[0]+u*0.5,q[1]],[q[0]+u*0.4,q[1]-u*0.9],[q[0]-u*0.4,q[1]-u*0.9]],'rgba(30,24,20,.9)',CWOOD,u*0.07);for(let k=0;k<4;k++)TH.poly(c,[[q[0]-u*0.3+k*u*0.16,q[1]-u*0.1],[q[0]-u*0.2+k*u*0.16,q[1]-u*0.1],[q[0]-u*0.2+k*u*0.16,q[1]-u*0.3],[q[0]-u*0.3+k*u*0.16,q[1]-u*0.3]],CCOL[(k+s)%7]);}
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>TH.ln(c,L(a*(ha+0.04),b*(hb+0.04),0.12),L(a*(ha+0.04),b*(hb+0.04),zp),CWOOD_D,u*0.14));
  /* the sign board over the counter: a bold icon, no lettering */
  {const sp=cF.J(0,zp-0.62),bw=u*0.9,bh=u*0.46;TH.poly(c,[[sp[0]-bw,sp[1]-bh],[sp[0]+bw,sp[1]-bh],[sp[0]+bw,sp[1]+bh],[sp[0]-bw,sp[1]+bh]],'#f8f4ea',CWOOD_D,u*0.07);if(T.kind==='game'){[0.36,0.26,0.16,0.07].forEach((f,i)=>TH.ell(c,sp[0],sp[1],bh*f*3.2,bh*f*2.9,i%2?'#f8f4ea':'#d8342b'));}else if(T.kind==='food'){TH.ell(c,sp[0],sp[1]-bh*0.1,bh*0.9,bh*0.7,CCOL[s%7]);TH.ln(c,[sp[0]-bh*0.5,sp[1]+bh*0.1],[sp[0]+bh*0.5,sp[1]+bh*0.1],'#f8f4ea',u*0.1);}else{TH.poly(c,[[sp[0]-bw*0.7,sp[1]-bh*0.6],[sp[0]+bw*0.7,sp[1]-bh*0.6],[sp[0]+bw*0.7,sp[1]+bh*0.6],[sp[0]-bw*0.7,sp[1]+bh*0.6]],'#f2c230',CWOOD_D,u*0.04);TH.ell(c,sp[0]-bw*0.7,sp[1],bh*0.2,bh*0.2,'#f8f4ea');TH.ell(c,sp[0]+bw*0.7,sp[1],bh*0.2,bh*0.2,'#f8f4ea');}}
  /* striped canvas roof with a scalloped valance, bulbs under the eave, a little flag on top */
  const rA=L(ha+ov,-hb-ov,zp),rB=L(ha+ov,hb+ov,zp),rC=L(0,hb+ov,zr),rD=L(0,-hb-ov,zr),ns=8;
  for(let k=0;k<ns;k++){const b0=-hb-ov+(2*hb+2*ov)*k/ns,b1=-hb-ov+(2*hb+2*ov)*(k+1)/ns;TH.poly(c,[L(ha+ov,b0,zp),L(ha+ov,b1,zp),L(0,b1,zr),L(0,b0,zr)],st[k%2]);const e=L(ha+ov,(b0+b1)/2,zp);c.fillStyle=st[k%2];c.beginPath();c.ellipse(e[0],e[1],u*0.3,u*0.2,0,0,Math.PI);c.fill();}
  TH.poly(c,[L(-ha,hb+0.02,zp),L(ha,hb+0.02,zp),L(0,hb+0.02,zr-0.06)],'#f8f4ea');TH.ln(c,L(-ha-ov,hb+ov,zp),L(0,hb+ov,zr),st[0],u*0.12);TH.ln(c,L(ha+ov,hb+ov,zp),L(0,hb+ov,zr),st[0],u*0.12);
  for(let k=0;k<7;k++){const b=-hb-ov+(2*hb+2*ov)*(k+0.5)/7,q=L(ha+ov,b,zp-0.05);TH.ell(c,q[0],q[1]+u*0.28,u*0.08,u*0.08,'#fff2a0');}
  const fp=L(0,hb+ov-0.05,zr);CFLAG(c,fp[0],fp[1],u,0.9,st[0]);}
const CBOOTH=(key)=>({cat:'struct',rho:key==='smallBarn'?0.16:0.12,draw(c,x,y,u,v){const T=CBOOTH_T[key],o=v&3,s=v>>2,eave=(o>>1)&1;c.fillStyle='rgba(60,44,20,.26)';c.beginPath();c.ellipse(x+u*0.8,y+u*0.2,u*T.sw*(eave?1.18:1),u*T.sh,0,0,7);c.fill();CFLIP(c,x,o&1,()=>CBOOTH_BODY(c,x,y,u,s,eave,T));}});
const CLASSIC_ASSETS={
  /* ---------- shade trees ---------- */
  oakC:{cat:'tree',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*7+1),H=u*(4.4+r()*1.1),pal=[['#5a9a44','#6aae52','#4a8a3a','#7cc062'],['#4f8f48','#62a456','#418038','#74b866']][v%2];CSH(c,x,y,u*2.3);c.lineCap='round';c.strokeStyle='#6a4a2a';c.lineWidth=u*0.8;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.1,y-H*0.35,x+u*0.05,y-H*0.6);c.stroke();TH.poly(c,[[x-u*0.6,y],[x-u*0.25,y-u*0.8],[x+u*0.2,y-u*0.8],[x+u*0.65,y]],'#6a4a2a');TH.ln(c,[x-u*0.15,y-H*0.1],[x-u*0.1,y-H*0.55],'#8a6a44',u*0.2);TH.ln(c,[x,y-H*0.5],[x-u*1.2,y-H*0.82],'#6a4a2a',u*0.34);TH.ln(c,[x,y-H*0.55],[x+u*1.3,y-H*0.8],'#6a4a2a',u*0.32);const cy=y-H*0.82;[[0,-0.3,2.0,1.2],[-1.6,-0.1,1.3,1.0],[1.6,-0.1,1.3,1.0],[-0.8,-1.15,1.5,1.0],[0.85,-1.15,1.5,1.0],[0,-1.7,1.2,0.85],[-1.2,0.5,0.9,0.6],[1.2,0.5,0.9,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,10));}},
  mapleC:{cat:'tree',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*5+3),H=u*(4.2+r()*1.0),pal=v%4===0?['#e8a838','#f0b848','#d8902a','#f6c860']:v%4===1?['#d86a2a','#e8803a','#c85a1e','#f09a52']:['#5fa048','#70b458','#4f9038','#82c868'];CSH(c,x,y,u*2.2);c.lineCap='round';c.strokeStyle='#6a5238';c.lineWidth=u*0.65;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.1,y-H*0.35,x+u*0.05,y-H*0.6);c.stroke();TH.ln(c,[x,y-H*0.5],[x-u*1.0,y-H*0.82],'#6a5238',u*0.28);TH.ln(c,[x,y-H*0.55],[x+u*1.1,y-H*0.8],'#6a5238',u*0.28);const cy=y-H*0.82;[[0,-0.3,1.8,1.1],[-1.5,-0.05,1.2,0.95],[1.5,-0.05,1.2,0.95],[-0.8,-1.05,1.3,0.9],[0.85,-1.05,1.3,0.9],[0,-1.55,1.0,0.75]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,10));}},
  elmC:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*11+2),H=u*(5.6+r()*1.0),pal=['#5a9a46','#6aaa54','#4a8a3c','#7cbc62'];CSH(c,x,y,u*2.0);TH.ln(c,[x,y],[x,y-H*0.5],'#6a5238',u*0.6);TH.ln(c,[x,y-H*0.4],[x-u*0.8,y-H*0.75],'#6a5238',u*0.3);TH.ln(c,[x,y-H*0.42],[x+u*0.8,y-H*0.78],'#6a5238',u*0.3);const cy=y-H*0.78;[[0,0.4,1.5,1.0],[-1.0,-0.3,1.1,1.1],[1.0,-0.3,1.1,1.1],[0,-1.2,1.5,1.15],[-0.6,-2.1,1.1,0.95],[0.6,-2.1,1.1,0.95],[0,-2.8,0.95,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,10));}},
  saplingC:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*31+3),pal=['#62a64e','#72b85c','#52963f'];CSH(c,x,y,u*1.2);TH.ln(c,[x,y],[x,y-u*1.4],'#6a5238',u*0.26);[[0,-2.0,0.95,0.8],[-0.55,-1.5,0.7,0.6],[0.55,-1.5,0.7,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,pal[i%3],r,8));}},
  /* ---------- undergrowth ---------- */
  flowerBed:{cat:'shrub',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*5+9),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.3,y+u*0.1,u*1.8,u*0.45,'rgba(60,44,20,.2)');TH.box(c,x,y,u,-1.3,1.3,-0.6,0.6,0,0.3,'#9a6a3a','#6a4426','#b4824a');TH.poly(c,[I(-1.2,-0.5,0.3),I(1.2,-0.5,0.3),I(1.2,0.5,0.3),I(-1.2,0.5,0.3)],'#5a3e24');const cols=[CCOL[v%7],CCOL[(v+3)%7],'#f8f4ea'];for(let k=0;k<22;k++){const q=I(-1.1+r()*2.2,-0.45+r()*0.9,0.3);TH.blob(c,q[0],q[1]-u*0.1,u*0.16,u*0.12,'#4f8a3a',r,6);TH.ell(c,q[0],q[1]-u*0.22,u*0.1,u*0.08,cols[k%3]);}}},
  hedgeC:{cat:'shrub',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*3+7),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.3,y+u*0.1,u*2.0,u*0.4,'rgba(60,44,20,.2)');const cols=['#4f9a44','#5fae52','#3f8a3a'];for(let k=0;k<6;k++){const X=-1.5+k*0.6;TH.blob(c,...I(X,0,0.5),u*0.55,u*0.5,cols[k%3],r,8);}}},
  bushC:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+2);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(60,44,20,.2)');[[-0.55,-0.45,0.8,0.55],[0.55,-0.45,0.8,0.55],[0,-0.85,0.85,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#56a048','#66b258','#469038'][i],r,8));}},
  grassC:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);for(let k=0;k<13;k++){const a=-1.1+k/12*2.2+(r()-0.5)*0.2,l=u*(0.7+r()*0.8);TH.ln(c,[x+(r()-0.5)*u*0.6,y],[x+Math.sin(a)*l*0.8+(r()-0.5)*u*0.3,y-l],['#a8b86a','#98a85a','#b8c87a'][k%3],u*0.09);}}},
  /* ---------- booths, stands and the exhibition barn ---------- */
  gameBooth:CBOOTH('gameBooth'),foodStand:CBOOTH('foodStand'),ticketBooth:CBOOTH('ticketBooth'),smallBarn:CBOOTH('smallBarn'),
  /* ---------- the one tower: the announcer's stand beside the booths ---------- */
  announcerTower:{cat:'struct',rho:0.05,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);CFLIP(c,x,v&1,()=>{CSH(c,x,y,u*2.0);[[-0.7,-0.7],[0.7,-0.7],[-0.7,0.7],[0.7,0.7]].forEach(([X,Y])=>TH.ln(c,I(X*1.2,Y*1.2,0),I(X*0.95,Y*0.95,4.6),CWOOD,u*0.24));for(let k=0;k<3;k++){const z=0.8+k*1.3,f=1.2-0.25*z/4.6;TH.ln(c,I(-0.7*f,0.7*f,z),I(0.7*f,0.7*f,z),CWOOD_D,u*0.1);TH.ln(c,I(0.7*f,0.7*f,z),I(0.7*f,-0.7*f,z),CWOOD_D,u*0.1);TH.ln(c,I(-0.7*f,0.7*f,z),I(0.7*f*0.9,0.7*f*0.9,z+1.3),CWOOD_D,u*0.07);}
      for(let k=0;k<8;k++)TH.ln(c,I(-0.4,1.3,0.2+k*0.55),I(0.4,1.3,0.2+k*0.55),CWOOD_D,u*0.07);TH.ln(c,I(-0.4,1.3,0.1),I(-0.4,0.9,4.6),CWOOD_D,u*0.07);TH.ln(c,I(0.4,1.3,0.1),I(0.4,0.9,4.6),CWOOD_D,u*0.07);
      CBOX(c,x,y,u,-1.1,1.1,-1.1,1.1,4.6,4.8,'#b08850');CBOX(c,x,y,u,-0.95,0.95,-0.95,0.95,4.8,5.9,'#f0e8d4');for(let k=0;k<6;k++){TH.ln(c,I(-0.9+k*0.36,0.96,4.85),I(-0.9+k*0.36,0.96,5.85),k%2?'#d8342b':'rgba(0,0,0,0)',u*0.12);}TH.poly(c,[I(-0.55,0.97,5.1),I(0.55,0.97,5.1),I(0.55,0.97,5.65),I(-0.55,0.97,5.65)],'#2a3a50','#b08850',u*0.06);
      const b=I(0,0,5.9),t=I(0,0,6.9);for(let k=0;k<8;k++){const a0=k/8,a1=(k+1)/8;TH.poly(c,[[b[0]-u*1.35+u*2.7*a0,b[1]+u*0.1],[b[0]-u*1.35+u*2.7*a1,b[1]+u*0.1],[t[0],t[1]]],k%2?'#f8f4ea':'#d8342b');}CFLAG(c,t[0],t[1],u,1.1,'#2a5aa8');
      [[-1.2,0.9],[1.2,0.9]].forEach(([X,Y])=>{const p=I(X,Y,5.2);c.fillStyle='#8a8a90';c.beginPath();c.moveTo(p[0]-u*0.18,p[1]-u*0.14);c.lineTo(p[0]+u*0.35,p[1]-u*0.34);c.lineTo(p[0]+u*0.35,p[1]+u*0.2);c.lineTo(p[0]-u*0.18,p[1]+u*0.14);c.closePath();c.fill();TH.ell(c,p[0]+u*0.35,p[1]-u*0.07,u*0.1,u*0.27,'#c8c8d0');});});}},
  /* ---------- fair pieces ---------- */
  livestockPen:{cat:'ruin',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*5+9),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),k=v%3;CFLIP(c,x,(v>>2)&1,()=>{CSH(c,x,y,u*3.0);TH.poly(c,[I(-1.8,-1.2,0.02),I(1.8,-1.2,0.02),I(1.8,1.2,0.02),I(-1.8,1.2,0.02)],'#d8c08a');for(let q=0;q<30;q++){const px=-1.7+r()*3.4,py=-1.1+r()*2.2,a=I(px,py,0.02);TH.ln(c,a,[a[0]+(r()-0.5)*u*0.4,a[1]+(r()-0.5)*u*0.12],'#e8d49a',u*0.04);}
      const animal=(cx,cy,kind)=>{const b=I(cx,cy,0);if(kind===0){c.fillStyle='#f6f2ea';c.beginPath();c.ellipse(b[0],b[1]-u*0.9,u*1.1,u*0.62,0,0,7);c.fill();c.fillStyle='#2a2a30';for(let q=0;q<3;q++){c.beginPath();c.ellipse(b[0]-u*0.6+q*u*0.55,b[1]-u*(1.0-(q%2)*0.3),u*0.28,u*0.2,0,0,7);c.fill();}[[-0.7],[-0.3],[0.5],[0.85]].forEach(([lx])=>TH.ln(c,[b[0]+lx*u,b[1]-u*0.5],[b[0]+lx*u,b[1]],'#e8e0d4',u*0.15));c.fillStyle='#f6f2ea';c.beginPath();c.ellipse(b[0]+u*1.15,b[1]-u*1.2,u*0.4,u*0.32,0.2,0,7);c.fill();TH.ell(c,b[0]+u*1.4,b[1]-u*1.1,u*0.2,u*0.16,'#e8b0a8');}
        else if(kind===1){c.fillStyle='#f4a0b0';c.beginPath();c.ellipse(b[0],b[1]-u*0.65,u*0.9,u*0.5,0,0,7);c.fill();[[-0.5],[-0.2],[0.3],[0.6]].forEach(([lx])=>TH.ln(c,[b[0]+lx*u,b[1]-u*0.3],[b[0]+lx*u,b[1]],'#e08a9a',u*0.13));c.beginPath();c.ellipse(b[0]+u*0.95,b[1]-u*0.75,u*0.34,u*0.3,0,0,7);c.fillStyle='#f4a0b0';c.fill();TH.ell(c,b[0]+u*1.2,b[1]-u*0.65,u*0.18,u*0.14,'#e08a9a');TH.poly(c,[[b[0]+u*0.85,b[1]-u*1.0],[b[0]+u*1.0,b[1]-u*1.25],[b[0]+u*1.05,b[1]-u*0.95]],'#e08a9a');TH.ln(c,[b[0]-u*0.85,b[1]-u*0.8],[b[0]-u*1.05,b[1]-u*1.0],'#e08a9a',u*0.07);}
        else{TH.ln(c,[b[0]-u*0.3,b[1]-u*0.4],[b[0]-u*0.3,b[1]],'#2a2a30',u*0.1);TH.ln(c,[b[0]+u*0.3,b[1]-u*0.4],[b[0]+u*0.3,b[1]],'#2a2a30',u*0.1);for(let q=0;q<6;q++)TH.blob(c,b[0]+(q%3-1)*u*0.4,b[1]-u*(0.7+(q>2?0.35:0)),u*0.36,u*0.3,'#f8f6f0',r,7);TH.ell(c,b[0]+u*0.8,b[1]-u*0.85,u*0.28,u*0.24,'#3a3a40');}};
      animal(-0.7,-0.2,k);animal(0.8,0.4,(k+(v>>3))%3);
      [[-1.8,1.2],[1.8,1.2],[1.8,-1.2],[-1.8,-1.2],[0,1.2],[0,-1.2],[1.8,0],[-1.8,0]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(X,Y,1.2),CWOOD_D,u*0.16));[0.5,1.0].forEach(z=>{TH.ln(c,I(-1.8,1.2,z),I(1.8,1.2,z),CWOOD,u*0.12);TH.ln(c,I(1.8,1.2,z),I(1.8,-1.2,z),CWOOD,u*0.12);});const rb=I(0,1.22,1.0);TH.ell(c,rb[0],rb[1],u*0.18,u*0.18,'#2a5aa8');TH.poly(c,[[rb[0]-u*0.1,rb[1]+u*0.1],[rb[0]-u*0.18,rb[1]+u*0.5],[rb[0],rb[1]+u*0.35]],'#2a5aa8');TH.poly(c,[[rb[0]+u*0.1,rb[1]+u*0.1],[rb[0]+u*0.18,rb[1]+u*0.5],[rb[0],rb[1]+u*0.35]],'#1f4488');TH.box(c,x,y,u,-1.5,-0.5,0.6,1.0,0,0.5,'#8a6a40','#6a4a28','#a8844e');TH.ell(c,...I(-1.0,0.8,0.5),u*0.4,u*0.12,'#6ab4d0');});}},
  bandstand:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*5+9),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);CFLIP(c,x,v&1,()=>{CSH(c,x,y,u*2.8);const hex=[];for(let k=0;k<6;k++){const a=k/6*6.283+0.52;hex.push([Math.cos(a)*1.5,Math.sin(a)*1.5]);}
      TH.poly(c,hex.map(([X,Y])=>I(X,Y,0.45)),'#c8b088');TH.poly(c,hex.map(([X,Y])=>I(X,Y,0.45)).concat(hex.slice().reverse().map(([X,Y])=>I(X,Y,0))).slice(0,0),'#a08860');for(let k=0;k<6;k++){const a=hex[k],b=hex[(k+1)%6];TH.poly(c,[I(a[0],a[1],0),I(b[0],b[1],0),I(b[0],b[1],0.45),I(a[0],a[1],0.45)],k%2?'#f8f4ea':'#d8342b');}
      /* the little brass band on the stage */
      [[-0.55,-0.1,'#d8342b'],[0.1,0.15,'#2a5aa8'],[0.65,-0.15,'#d8342b']].forEach(([X,Y,col],i)=>{const b=I(X,Y,0.45);TH.ln(c,[b[0]-u*0.12,b[1]],[b[0]-u*0.12,b[1]-u*0.55],'#2a2a30',u*0.12);TH.ln(c,[b[0]+u*0.12,b[1]],[b[0]+u*0.12,b[1]-u*0.55],'#2a2a30',u*0.12);TH.poly(c,[[b[0]-u*0.28,b[1]-u*0.5],[b[0]+u*0.28,b[1]-u*0.5],[b[0]+u*0.24,b[1]-u*1.05],[b[0]-u*0.24,b[1]-u*1.05]],col);TH.ell(c,b[0],b[1]-u*1.3,u*0.22,u*0.24,'#f4d0b0');TH.poly(c,[[b[0]-u*0.26,b[1]-u*1.4],[b[0]+u*0.26,b[1]-u*1.4],[b[0]+u*0.2,b[1]-u*1.72],[b[0]-u*0.2,b[1]-u*1.72]],'#f8f4ea');TH.ln(c,[b[0]+u*0.2,b[1]-u*0.8],[b[0]+u*0.7,b[1]-u*1.0],'#e8c84a',u*0.1);TH.ell(c,b[0]+u*0.75,b[1]-u*1.0,u*0.14,u*0.18,'#e8c84a');});
      for(let k=0;k<6;k++){const a=hex[k];TH.ln(c,I(a[0],a[1],0.45),I(a[0],a[1],2.5),k%2?'#f8f4ea':'#d8342b',u*0.14);}
      for(let k=0;k<6;k++){const a=hex[k],b=hex[(k+1)%6];TH.ln(c,I(a[0],a[1],1.0),I(b[0],b[1],1.0),'#f8f4ea',u*0.07);}
      const ord=hex.map((p,i)=>i).sort((a,b)=>(hex[a][0]+hex[a][1])-(hex[b][0]+hex[b][1]));const ap=I(0,0,3.7);ord.forEach(k=>{const a=hex[k],b=hex[(k+1)%6];TH.poly(c,[I(a[0]*1.1,a[1]*1.1,2.5),I(b[0]*1.1,b[1]*1.1,2.5),ap],k%2?'#f8f4ea':'#d8342b');});CFLAG(c,ap[0],ap[1],u,1.0,'#2a5aa8');});}},
  tractor:{cat:'ruin',rho:0.07,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);CFLIP(c,x,v&1,()=>{CSH(c,x,y,u*2.6);
      const wheel=(X,Y,R2,col)=>{const p=I(X,Y,R2*0.75);c.fillStyle='#2a2a30';c.beginPath();c.ellipse(p[0],p[1],R2*u*0.8,R2*u,0,0,7);c.fill();c.fillStyle=col;c.beginPath();c.ellipse(p[0],p[1],R2*u*0.45,R2*u*0.55,0,0,7);c.fill();for(let k=0;k<12;k++){const a=k/12*6.283;TH.ln(c,[p[0]+Math.cos(a)*R2*u*0.8,p[1]+Math.sin(a)*R2*u],[p[0]+Math.cos(a)*R2*u*0.95,p[1]+Math.sin(a)*R2*u*1.12],'#454c58',u*0.08);}TH.ell(c,p[0],p[1],R2*u*0.15,R2*u*0.18,'#c8c8d0');};
      wheel(-0.9,-0.75,1.05,'#d8342b');CBOX(c,x,y,u,-1.0,1.5,-0.5,0.5,0.5,1.3,'#d8342b');CBOX(c,x,y,u,0.2,1.8,-0.42,0.42,0.65,1.25,'#c02a22');TH.ln(c,I(1.7,0.43,0.75),I(1.7,0.43,1.2),'#2a2a30',u*0.08);TH.ln(c,I(1.3,0.43,0.75),I(1.3,0.43,1.2),'#2a2a30',u*0.06);
      const ex=I(1.4,-0.2,1.25);TH.ln(c,ex,[ex[0],ex[1]-u*1.1],'#454c58',u*0.12);TH.ell(c,ex[0],ex[1]-u*1.1,u*0.12,u*0.06,'#2a2a30');
      TH.ell(c,...I(-0.4,0,1.35),u*0.4,u*0.2,'#2a2a30');TH.ln(c,I(-0.4,0,1.35),I(-0.4,0,2.1),'#454c58',u*0.1);TH.ell(c,...I(-0.4,0.2,2.1),u*0.28,u*0.14,'#c8c8d0');
      wheel(-0.9,0.75,1.05,'#d8342b');wheel(1.4,0.55,0.62,'#d8342b');wheel(1.4,-0.55,0.62,'#d8342b');});}},
  picnicSet:{cat:'ruin',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),col=[['#d8342b','#f8f4ea'],['#2a5aa8','#f8f4ea'],['#f2c230','#f8f4ea']][v%3];CFLIP(c,x,(v>>2)&1,()=>{CSH(c,x,y,u*2.4);
      TH.box(c,x,y,u,-1.3,1.3,-0.4,0.4,0.6,0.72,'#c9a066','#8a6a40','#dcb878');for(let k=0;k<7;k++)for(let j=0;j<2;j++){if((k+j)%2)continue;const X0=-1.3+k*0.37,Y0=-0.4+j*0.4;TH.poly(c,[I(X0,Y0,0.73),I(X0+0.37,Y0,0.73),I(X0+0.37,Y0+0.4,0.73),I(X0,Y0+0.4,0.73)],col[0]);}
      [-1.1,1.1].forEach(X=>TH.ln(c,I(X,0,0),I(X,0,0.62),CWOOD_D,u*0.14));TH.box(c,x,y,u,-1.3,1.3,-0.95,-0.55,0.3,0.4,'#a67a48','#7a5a30','#b98a55');TH.box(c,x,y,u,-1.3,1.3,0.55,0.95,0.3,0.4,'#a67a48','#7a5a30','#b98a55');[-1.1,1.1].forEach(X=>{TH.ln(c,I(X,-0.75,0),I(X,-0.75,0.3),CWOOD_D,u*0.1);TH.ln(c,I(X,0.75,0),I(X,0.75,0.3),CWOOD_D,u*0.1);});
      const bp=I(0.4,0.0,0.73);c.fillStyle='#b08850';c.fillRect(bp[0]-u*0.3,bp[1]-u*0.3,u*0.6,u*0.3);c.strokeStyle='#6a4a2a';c.lineWidth=u*0.06;c.strokeRect(bp[0]-u*0.3,bp[1]-u*0.3,u*0.6,u*0.3);TH.ln(c,I(0,0,0.72),I(0,0,2.5),'#e8e0d0',u*0.1);const top=I(0,0,2.5);for(let i=0;i<8;i++){const a0=i/8*Math.PI*2,a1=(i+1)/8*Math.PI*2;TH.poly(c,[top,[top[0]+Math.cos(a0)*u*1.5,top[1]+u*0.55+Math.sin(a0)*u*0.25],[top[0]+Math.cos(a1)*u*1.5,top[1]+u*0.55+Math.sin(a1)*u*0.25]],i%2?col[1]:col[0]);}});}},
  pieTable:{cat:'ruin',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+9),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);CFLIP(c,x,v&1,()=>{CSH(c,x,y,u*2.6);TH.box(c,x,y,u,-1.6,1.6,-0.5,0.5,0.0,0.95,'#f8f4ea','#d8d0be','#fffaf0');for(let k=0;k<9;k++){const X=-1.5+k*0.36;TH.poly(c,[I(X,0.51,0.0),I(X+0.18,0.51,0.0),I(X+0.09,0.51,0.18)],'#e8e0cc');}TH.poly(c,[I(-1.65,-0.55,0.95),I(1.65,-0.55,0.95),I(1.65,0.55,0.95),I(-1.65,0.55,0.95)],'#d8342b');
      for(let k=0;k<6;k++){const p=I(-1.25+k*0.5,(k%2?0.12:-0.12),0.97);TH.ell(c,p[0],p[1],u*0.3,u*0.15,'#e8e4d8');TH.ell(c,p[0],p[1]-u*0.04,u*0.26,u*0.13,k%3===0?'#c8402a':'#d8963a');for(let j=-1;j<=1;j++)TH.ln(c,[p[0]+j*u*0.12,p[1]-u*0.12],[p[0]+j*u*0.12,p[1]+u*0.05],'rgba(120,70,20,.5)',u*0.04);}
      [[-1.3,'#2a5aa8'],[0.0,'#d8342b'],[1.3,'#f2c230']].forEach(([X,col])=>{const q=I(X,0.6,0.5);TH.ell(c,q[0],q[1],u*0.2,u*0.2,col);TH.poly(c,[[q[0]-u*0.1,q[1]+u*0.1],[q[0]-u*0.2,q[1]+u*0.5],[q[0],q[1]+u*0.35]],col);TH.poly(c,[[q[0]+u*0.1,q[1]+u*0.1],[q[0]+u*0.2,q[1]+u*0.5],[q[0],q[1]+u*0.35]],shade(col,-0.25));});});}},
  duckPond:{cat:'ruin',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*5+9);CFLIP(c,x,v&1,()=>{CSH(c,x,y,u*2.6);const rx=u*1.7,ry=u*0.7;c.fillStyle='#d8342b';c.beginPath();c.moveTo(x-rx,y);c.lineTo(x-rx,y-u*0.6);c.ellipse(x,y-u*0.6,rx,ry,0,Math.PI,0,true);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI);c.closePath();c.fill();c.fillStyle='#a82820';c.beginPath();c.moveTo(x-rx*0.1,y+ry*0.99);c.lineTo(x-rx*0.1,y-u*0.6+ry*0.99);c.lineTo(x+rx,y-u*0.6);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI);c.closePath();c.fill();TH.ell(c,x,y-u*0.6,rx,ry,'#f8f4ea');TH.ell(c,x,y-u*0.6,rx*0.9,ry*0.88,'#4aa8d0');TH.ell(c,x-rx*0.25,y-u*0.66,rx*0.5,ry*0.3,'rgba(220,245,255,.5)');
      for(let k=0;k<7;k++){const a=k/7*6.283+0.4,px=x+Math.cos(a)*rx*0.62,py=y-u*0.62+Math.sin(a)*ry*0.6;TH.ell(c,px,py,u*0.2,u*0.13,'#f2d230');TH.ell(c,px+u*0.14,py-u*0.14,u*0.1,u*0.1,'#f2d230');TH.poly(c,[[px+u*0.22,py-u*0.14],[px+u*0.36,py-u*0.1],[px+u*0.22,py-u*0.06]],'#f08a24');TH.ell(c,px,py+u*0.03,u*0.1,u*0.04,CCOL[k%7]);}
      TH.ln(c,[x+rx*0.9,y-u*0.4],[x+rx*0.9,y-u*3.0],CWOOD_D,u*0.14);TH.poly(c,[[x+rx*0.9-u*0.7,y-u*3.0],[x+rx*0.9+u*0.5,y-u*3.0],[x+rx*0.9+u*0.5,y-u*2.2],[x+rx*0.9-u*0.7,y-u*2.2]],'#f8f4ea',CWOOD_D,u*0.05);TH.ell(c,x+rx*0.9-u*0.1,y-u*2.6,u*0.28,u*0.2,'#f2d230');TH.ell(c,x+rx*0.9+u*0.06,y-u*2.72,u*0.14,u*0.14,'#f2d230');});}},
  /* ---------- small props (lower tiers only) ---------- */
  bunting:{cat:'prop',rho:0.12,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*2.4,u*0.4,'rgba(60,44,20,.14)');[-2.2,2.2].forEach(X=>TH.ln(c,I(X,0,0),I(X,0,3.4),'#6a4a2a',u*0.18));const cols=['#d8342b','#f8f4ea','#2a5aa8'];let prev=null;for(let k=0;k<=12;k++){const X=-2.2+4.4*k/12,p=I(X,0,3.3-Math.sin(k/12*Math.PI)*0.7);if(prev)TH.ln(c,prev,p,'#d9d4c2',u*0.04);prev=p;if(k<12){const q=I(X+0.18,0,3.3-Math.sin((k+0.5)/12*Math.PI)*0.7);TH.poly(c,[[q[0]-u*0.2,q[1]],[q[0]+u*0.2,q[1]],[q[0],q[1]+u*0.55]],cols[k%3],'rgba(0,0,0,.15)',u*0.03);}}}},
  hayBaleC:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.3,u*0.4,'rgba(60,44,20,.22)');TH.box(c,x,y,u,-0.9,0.1,-0.6,0.6,0,0.9,'#e8cc70','#c0a24a','#f6e088');TH.box(c,x,y,u,0.2,1.2,-0.6,0.6,0,0.9,'#e8cc70','#c0a24a','#f6e088');TH.box(c,x,y,u,-0.4,0.7,-0.5,0.5,0.9,1.8,'#e8cc70','#c0a24a','#f6e088');[-0.4,0.4].forEach(X=>TH.ln(c,I(X,0.61,0.9),I(X,0.61,1.7),'#8a7030',u*0.05));}},
  lightPole:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.26,'rgba(60,44,20,.24)');TH.ln(c,[x,y],[x,y-u*3.6],'#5a3a22',u*0.2);TH.ln(c,[x-u*1.2,y-u*3.4],[x+u*1.2,y-u*3.4],'#5a3a22',u*0.1);for(let k=0;k<=8;k++){const px=x-u*1.2+u*2.4*k/8,py=y-u*3.4+Math.sin(k/8*Math.PI)*u*0.5;const g=c.createRadialGradient(px,py,0,px,py,u*0.8);g.addColorStop(0,'rgba(255,230,140,.5)');g.addColorStop(1,'rgba(255,230,140,0)');c.fillStyle=g;c.beginPath();c.arc(px,py,u*0.8,0,7);c.fill();TH.ell(c,px,py,u*0.12,u*0.14,['#fff2a0','#ffd0a0','#ffa0a0'][k%3]);}}},
  balloons:{cat:'prop',rho:0.05,draw(c,x,y,u,v){TH.ell(c,x+u*0.2,y+u*0.06,u*0.5,u*0.18,'rgba(60,44,20,.24)');TH.ln(c,[x,y],[x,y-u*1.6],'#5a3a22',u*0.1);const bp=[x,y-u*1.6];[[-0.55,-1.4],[0.5,-1.5],[-0.2,-2.2],[0.35,-2.4],[-0.7,-2.3],[0.8,-2.1],[0.05,-3.0]].forEach(([dx,dy],i)=>{TH.ln(c,bp,[x+dx*u,y+dy*u*1.6+u*0.4],'#d8d4c8',u*0.025);CBALLOON(c,x+dx*u,y+dy*u*1.6,u*0.32,CCOL[(i+v)%7]);});}},
  ropeBarrier:{cat:'prop',rho:0.08,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.3,y+u*0.1,u*1.8,u*0.35,'rgba(60,44,20,.18)');const ps=[-1.6,0,1.6];ps.forEach(X=>{TH.ln(c,I(X,0,0),I(X,0,1.3),'#c8a050',u*0.16);TH.ell(c,...I(X,0,1.3),u*0.16,u*0.1,'#e8c860');});for(let k=0;k<2;k++){c.strokeStyle='#d8342b';c.lineWidth=u*0.09;c.beginPath();const a=I(ps[k],0,1.2),b=I(ps[k+1],0,1.2);c.moveTo(a[0],a[1]);c.quadraticCurveTo((a[0]+b[0])/2,(a[1]+b[1])/2+u*0.5,b[0],b[1]);c.stroke();}}},
  trashBarrel:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.26,'rgba(60,44,20,.24)');const w=u*0.5,h=u*1.2;TH.ell(c,x,y,w,w*0.4,'#3a3a44');c.fillStyle='#2a5aa8';c.beginPath();c.moveTo(x-w,y);c.lineTo(x-w,y-h);c.lineTo(x+w,y-h);c.lineTo(x+w,y);c.ellipse(x,y,w,w*0.4,0,0,Math.PI);c.fill();for(let k=0;k<3;k++){c.fillStyle=k%2?'#f8f4ea':'#2a5aa8';c.fillRect(x-w,y-h*(0.2+k*0.3),w*2,h*0.15);}TH.ell(c,x,y-h,w,w*0.4,'#c8c8d0');TH.ell(c,x,y-h,w*0.75,w*0.28,'#2a2a30');}}
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

/* ===== CLASSIC MIDWAY LAND (county fair): planner (a few shade trees, striped-awning booths and food stands, an exhibition barn on the back rim, livestock pens / bandstand / tractor / picnic tables, no terrain) ===== */
const CLASSIC_REGION={top:{oakC:.34,mapleC:.3,elmC:.2,saplingC:.16},mid:{oakC:.34,mapleC:.3,elmC:.2,saplingC:.16},bottom:{oakC:.3,mapleC:.3,elmC:.18,saplingC:.22}};
const CLASSIC_LOW=[['saplingC',1],['mapleC',0.6],['oakC',0.55],['saplingC',1.2],['mapleC',0.7],['elmC',0.5]];
const CLASSIC_CAP={};
const CLASSIC_UNDER=['flowerBed','flowerBed','hedgeC','bushC','grassC','flowerBed','grassC','bushC'];
const CLASSIC_PLAN_CACHE={};
function getClassicPlan(shape){
  if(CLASSIC_PLAN_CACHE[shape])return CLASSIC_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(shape==='A'?7301:8402),placed=[],bb=G.bbox,used={},A=CLASSIC_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.66);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'oakC';};
  const capOk=k=>!(CLASSIC_CAP[k]&&(used[k]||0)>=CLASSIC_CAP[k]);
  const regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?CLASSIC_REGION.top:n<0.68?CLASSIC_REGION.mid:CLASSIC_REGION.bottom;};
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='tree'?0.72+rng()*0.32:D.cat==='shrub'?0.9+rng()*0.3:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;if((D.cat==='tree'||D.cat==='shrub'||D.cat==='prop')&&placed.some(o=>o.noSouth&&Math.abs(px-o.x)<0.3&&py-o.y>-0.05&&py-o.y<(o.sz||0.36)))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const tree=(x,y,extra,dom,low)=>{if(low){const L=CLASSIC_LOW[Math.floor(rng()*CLASSIC_LOW.length)];return place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return place(dom&&rng()<0.55&&capOk(dom)?dom:pickFrom(regionOf(y),capOk),x,y,extra||{});};
  const under=(x,y,extra)=>place(CLASSIC_UNDER[Math.floor(rng()*CLASSIC_UNDER.length)],x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. the back rim carries the red exhibition barn (no tree backdrop: the trees there are the same density as everywhere else) */
  {const pts=[];top.forEach(e=>[0.3,0.5,0.7].forEach(t=>pts.push(onEdge(e,t,0.0))));const p=pts.reduce((b,q)=>Math.abs(q[0]-cx)<Math.abs(b[0]-cx)?q:b);for(const [dx,dy] of [[0,-0.02],[0.3,0],[-0.3,0],[0,0.04]]){const o=place('smallBarn',p[0]+dx,p[1]+dy,{minT:1,scale:1.2,clear:2.4,noSouth:true});if(o)break;}}
  /* 2. fair booths and food stands: 4 on the rim (spread by farthest-point), 5 through the middle, then ONE announcer's tower beside a booth */
  const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.filter(e=>e.vertical).forEach(e=>inn.push([e.mid[0],e.mid[1]]));
  const chosen=placed.filter(o=>o.cat==='ruin'||o.cat==='struct').map(o=>[o.x,o.y]),manors=[];
  const spread=(k,pool,extra)=>{const ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.22})).sort((a,b)=>b.d-a.d);for(let n=0;n<Math.min(12,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],extra);if(o){chosen.push([o.x,o.y]);if(/^(gameBooth|foodStand|ticketBooth)$/.test(k))manors.push(o);return o;}}return null;};
  [['gameBooth',1],['foodStand',1],['ticketBooth',3],['gameBooth',4]].forEach(([k,mt])=>spread(k,rim,{minT:mt,scale:1.15,clear:2.5,noSouth:true}));
  [['foodStand',2],['gameBooth',2],['foodStand',3],['foodStand',4],['gameBooth',4]].forEach(([k,mt])=>spread(k,inn,{minT:mt,scale:1.0,clear:3.0,noSouth:true}));
  {const home=manors[manors.length-1]||placed.find(o=>o.cat==='struct');if(home){for(const [dx,dy] of [[0.36,-0.08],[-0.36,-0.08],[0.3,0.12],[-0.3,0.12],[0.44,0.0],[-0.44,0.0]]){const o=place('announcerTower',home.x+dx,home.y+dy,{minT:4,scale:1.0,clear:2.4,noSouth:true});if(o)break;}}}
  /* 2b. fair pieces scattered through the land (farthest-point spacing): livestock pens, picnic tables, a pie-judging table, the bandstand, a duck-pond game, a vintage tractor */
  [['livestockPen',1],['picnicSet',1],['pieTable',2],['livestockPen',2],['bandstand',3],['duckPond',3],['tractor',3],['picnicSet',4],['livestockPen',4],['picnicSet',4]].forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,scale:k==='livestockPen'||k==='duckPond'?1.1:1.0,clear:1.8,noSouth:true,sz:0.62}));
  /* 3. a few shade trees (Western-level count; the top rim is treated exactly like every other edge) */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=pickFrom(regionOf(v.y),capOk),n=rng()<0.6?1+Math.floor(rng()*1.5):0;for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.09:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{const dom=pickFrom(regionOf(e.mid[1]),capOk);[-0.2,0.2].forEach(dy=>{if(rng()<0.3)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.3)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.8+rng()*0.2},null,true);if(rng()<0.0)tree(e.mid[0]+(rng()-0.5)*0.34,e.mid[1]+(rng()-0.5)*0.14,{scale:0.78+rng()*0.2},null,true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.36));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(rng()-0.2)*0.12)});});
    let mode='grove',run=0,dom='oakC';samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.5?'grove':r<0.8?'sparse':'open';run=2+Math.floor(rng()*4);dom=pickFrom(regionOf(s.p[1]),capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){tree(p[0],p[1],null,dom,low);if(rng()<0.3)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,dom,low);if(rng()<0.08)tree(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,dom,true);if(rng()<0.04)tree(p[0]+(rng()-0.5)*0.34,p[1]-0.2,null,dom,low);}
      else if(mode==='sparse'){if(rng()<0.5)tree(p[0],p[1],null,dom,low);else under(p[0],p[1]);}else if(rng()<0.6)under(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.5)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<8;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.1)tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);}});
  /* 3c. sparse lands vary a lot with random placement, so first pull the tree total to the Western-level target (add or thin interior trees) ... */
  {const TARGET=92,dE=(x,y,e)=>{const dx=e.b[0]-e.a[0],dy=e.b[1]-e.a[1],t=Math.max(0,Math.min(1,((x-e.a[0])*dx+(y-e.a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-(e.a[0]+dx*t),(y-(e.a[1]+dy*t))*1.4);};
    const isRim=o=>outer.some(e=>dE(o.x,o.y,e)<0.32),trees=()=>placed.filter(o=>o.cat==='tree');
    let n=trees().length;
    if(n>TARGET){const inner=trees().filter(o=>!isRim(o));let drop=Math.min(n-TARGET,inner.length);while(drop-->0){const o=inner.splice(Math.floor(rng()*inner.length),1)[0],ix=placed.indexOf(o);if(ix>=0)placed.splice(ix,1);}}
    else if(n<TARGET){let guard=0;while(trees().length<TARGET&&guard++<900){const c=G.centers[Math.floor(rng()*G.centers.length)],px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);}}}
  /* 3d. ... then balance the rim last: the top, the sides and the bottom must carry the same tree density per unit of boundary (thin the heavy edges, fill the light ones) */
  {const dEdge=(x,y,e)=>{const dx=e.b[0]-e.a[0],dy=e.b[1]-e.a[1],t=Math.max(0,Math.min(1,((x-e.a[0])*dx+(y-e.a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-(e.a[0]+dx*t),(y-(e.a[1]+dy*t))*1.4);};
    const classes=['top','side','bottom'],len={top:0,side:0,bottom:0};outer.forEach(e=>len[e.cls]+=e.len);
    const members=()=>{const m={top:[],side:[],bottom:[]};placed.filter(o=>o.cat==='tree').forEach(o=>{let best=null,bd=1e9;outer.forEach(e=>{const d=dEdge(o.x,o.y,e);if(d<bd){bd=d;best=e;}});if(bd<0.32)m[best.cls].push(o);});return m;};
    let m=members();const mean=(m.top.length+m.side.length+m.bottom.length)/(len.top+len.side+len.bottom);
    classes.forEach(cl=>{const target=Math.round(len[cl]*mean);let list=m[cl];
      if(list.length>target+1){const drop=list.length-target;for(let i=0;i<drop;i++){const pick=list.splice(Math.floor(rng()*list.length),1)[0],ix=placed.indexOf(pick);if(ix>=0)placed.splice(ix,1);}}
      else if(list.length<target-1){const need=target-list.length,es=outer.filter(e=>e.cls===cl);let added=0,guard=0;while(added<need&&guard++<160){const e=es[Math.floor(rng()*es.length)],p=onEdge(e,rng(),(rng()-0.2)*0.12);if(tree(p[0],p[1],null,null,cl!=='top'))added++;}}});}
  /* 4. undergrowth: flower beds, hedges, bushes */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.65)under(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.5)under(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.5)under(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.4)under(px,py);}});
  /* 5. small props: lower tiers only */
  [['bunting',3],['hayBaleC',2],['lightPole',3],['balloons',2],['ropeBarrier',2],['trashBarrel',2]].forEach(([k,n])=>{for(let i=0;i<n;i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  /* every house gets a facing (bit0 mirror, bit1 gable/eave); neighbours cycle through all four */
  {const houses=placed.filter(o=>/^(gameBooth|foodStand|ticketBooth)$/.test(o.kind)).sort((a,b)=>a.x-b.x||a.y-b.y),cyc=[0,3,1,2];houses.forEach((o,i)=>{o.v=((o.v>>2)<<2)|cyc[i%4];});placed.filter(o=>o.kind==='announcerTower'||o.kind==='smallBarn').forEach(o=>{o.v=((o.v>>2)<<2)|(rng()<0.5?1:0);});}
  const cuts={tree:[0.2,0.52,0.8,1],shrub:[0.06,0.38,0.7,1],rock:[0.3,0.55,0.8,1],prop:[1,1,1,1],struct:[0,0,0,0],ruin:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='struct'||o.cat==='ruin')o.tier=o.minT;});
  const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
  for(let t=1;t<=4;t++){let guard=0;while(guard++<300){const c=count(t);if(c.tr/Math.max(1,c.n)>=0.5)break;const pool=placed.filter(o=>o.tier<=t&&t<=o.maxT),cand=(pool.filter(o=>o.cat==='shrub').sort((a,b)=>b.pri-a.pri)[0])||(pool.filter(o=>o.prop&&o.minT>1).sort((a,b)=>b.pri-a.pri)[0]);if(!cand)break;cand.tier=Math.min(5,cand.tier+1);}}
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.sort((a,b)=>a.y-b.y);
  return CLASSIC_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: trampled straw and sawdust, a little worn grass, popcorn, ticket stubs and confetti (decals, not objects) ---- */
function classicGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<44;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'246,232,178':'190,160,100',r()<0.5?0.22:0.2);}
  for(let k=0;k<14;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'150,118,70',0.17);}
  for(let k=0;k<10;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'236,214,150',0.2);}
  for(let k=0;k<9;k++){const p=pt(),w=R*(0.25+r()*0.4);soft(p[0],p[1],w,w*0.4,'138,160,88',0.17);}
  for(let k=0;k<150;k++){const p=pt(),a=r()*3.14,l=R*(0.04+r()*0.06);TH.ln(c,[p[0],p[1]],[p[0]+Math.cos(a)*l,p[1]+Math.sin(a)*l*0.5],r()<0.5?'rgba(226,196,110,.8)':'rgba(206,170,90,.75)',R*0.009);}
  for(let k=0;k<26;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.011,R*0.009,'rgba(252,250,240,.9)');TH.ell(c,p[0]+R*0.008,p[1]+R*0.004,R*0.008,R*0.007,'rgba(244,216,120,.9)');}
  for(let k=0;k<20;k++){const p=pt(),a=r()*3.14,w=R*0.022,h=R*0.012;c.save();c.translate(p[0],p[1]);c.rotate(a);c.fillStyle=['#f06aa0','#2a5aa8','#f2c230','#d8342b'][k%4];c.fillRect(-w/2,-h/2,w,h);c.restore();}
  for(let k=0;k<50;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.007,R*0.006,['#d8342b','#2a5aa8','#f2c230','#2aa8a0','#f06aa0'][k%5]);}
  for(let k=0;k<70;k++){const p=pt(),h=R*(0.04+r()*0.05);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#b8b872','#a8a862','#c8c882'][(k+j)%3],R*0.01);}
  for(let k=0;k<22;k++){const p=pt();TH.ell(c,p[0],p[1],R*(0.014+r()*0.012),R*0.01,'rgba(170,150,120,.5)');}
  c.restore();c.restore();
}
const CLASSIC_THEME={id:'classic',assets:CLASSIC_ASSETS,plan:getClassicPlan,ground:classicGround,groundCol:'#d8c394',top:1.45};
const CLASSIC_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
function bakeLandClassic(shape,tier,R,opts){return bakeLandTheme(CLASSIC_THEME,shape,tier,R,opts);}
function drawLandClassicBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandClassicDepthBand(ctx,x,y,land,index){const band=land.bands[index];if(!band||!band.canvas)return;const r=band.rect;ctx.drawImage(band.canvas,x-land.ox+r.x,y-land.oy+r.y,r.w,r.h);}
function drawLandClassicFront(ctx,x,y,land){land.bands.forEach((_,index)=>drawLandClassicDepthBand(ctx,x,y,land,index));}
return Object.freeze({bake:bakeLandClassic,drawBack:drawLandClassicBack,drawDepthBand:drawLandClassicDepthBand,drawFront:drawLandClassicFront});
})();
const nordicLandMacroPack = (() => {
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

/* ===== NORDIC ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const NSH=(c,x,y,rx)=>{c.fillStyle='rgba(14,26,28,.3)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const NWOOD='#8a5a33',NWOOD_D='#4a2f1c',NRED='#a8322a',NSNOW='#f2f6fa';
const NROCKP=[['#5f6a78','#7e8a9a','#434c58'],['#6a6d78','#868b98','#4a4d58'],['#566470','#74869a','#3e4a56']];
const NBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.28),shade(col,0.12));
const NFLIP=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
const NCON=(c,x,y,u,o,r)=>{const h=u*o.h,w=u*o.w,n=o.tiers,bare=o.bare===undefined?0.16:o.bare;TH.ln(c,[x,y],[x,y-h*(bare+0.1)],'#3a2818',u*(o.tw||0.42));for(let i=0;i<n;i++){const t=i/n,ww=w*(1-0.8*t)*(0.92+r()*0.16),yb=y-h*(bare+(0.9-bare)*t),tip=yb-h*(o.layer||0.34),dy=yb-tip;TH.poly(c,[[x-ww,yb],[x-ww*0.55,yb-h*0.032],[x-ww*0.2,yb+h*0.012],[x+ww*0.25,yb-h*0.032],[x+ww*0.6,yb+h*0.01],[x+ww,yb],[x,tip]],o.c1);TH.poly(c,[[x,tip],[x+ww,yb],[x+ww*0.6,yb+h*0.01],[x+ww*0.25,yb-h*0.032],[x,yb]],o.c2);if(o.snow){TH.poly(c,[[x,tip],[x-ww*0.56,tip+dy*0.56],[x-ww*0.3,tip+dy*0.64],[x,tip+dy*0.5]],NSNOW);TH.poly(c,[[x,tip],[x,tip+dy*0.5],[x+ww*0.3,tip+dy*0.62],[x+ww*0.56,tip+dy*0.56]],'#d3e0ea');}}};
const NTRI=(c,x,y,s,c1,c2)=>{TH.poly(c,[[x-s*0.55,y],[x,y-s*1.7],[x,y]],c1);TH.poly(c,[[x,y-s*1.7],[x+s*0.55,y],[x,y]],c2);};
/* dragon-head finial (carved ridge end) */
const NDRAGON=(c,x,y,u,dir)=>{c.save();c.translate(x,y);c.scale(dir,1);c.fillStyle=NWOOD_D;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(u*0.15,-u*0.7,u*0.45,-u*0.95);c.quadraticCurveTo(u*0.9,-u*1.15,u*1.05,-u*0.85);c.quadraticCurveTo(u*0.85,-u*0.82,u*0.7,-u*0.7);c.quadraticCurveTo(u*0.9,-u*0.55,u*0.75,-u*0.5);c.quadraticCurveTo(u*0.5,-u*0.55,u*0.35,-u*0.45);c.quadraticCurveTo(u*0.2,-u*0.2,u*0.22,0);c.closePath();c.fill();c.fillStyle='#e8c84a';c.beginPath();c.arc(u*0.55,-u*0.88,u*0.06,0,7);c.fill();c.restore();};
const NSHIELD=(c,x,y,r,col,col2)=>{c.fillStyle=col;c.beginPath();c.ellipse(x,y,r,r*1.0,0,0,7);c.fill();c.strokeStyle='#2a2a30';c.lineWidth=Math.max(0.6,r*0.16);c.stroke();c.fillStyle=col2;c.beginPath();c.ellipse(x,y,r*0.4,r*0.4,0,0,7);c.fill();c.fillStyle='#c8c8d0';c.beginPath();c.arc(x,y,r*0.16,0,7);c.fill();};
/* ---- little Viking huts: one parametric body, 4 orientations (gable/eave front x mirror) ---- */
const NHUT_T={
  turfHut:{ha:1.2,hb:1.9,h1:1.3,roof:'turf',rise:1.3,ov:0.4,wall:'#8a5a33',sw:3.3,sh:1.0},
  plankHut:{ha:1.15,hb:1.7,h1:1.5,roof:'shingle',rise:2.0,ov:0.45,wall:'#7a4e2a',sw:3.0,sh:0.95},
  boatHouse:{ha:1.3,hb:1.9,h1:0.9,roof:'shingle',rise:2.5,ov:0.5,wall:'#6a4426',sw:3.4,sh:1.0,boat:true}
};
function NHUT_BODY(c,x,y,u,s,eave,T){const r=mulberry(s*7+3),Iw=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),L=(a,b,z)=>eave?Iw(b,a,z):Iw(a,b,z),LBOX=(a0,a1,b0,b1,z0,z1,col)=>eave?NBOX(c,x,y,u,b0,b1,a0,a1,z0,z1,col):NBOX(c,x,y,u,a0,a1,b0,b1,z0,z1,col);
  const ha=T.ha,hb=T.hb,h1=T.h1,zr=h1+T.rise,ov=T.ov,faces=(aa,bb)=>[{J:(a,z)=>L(a,bb+0.012,z),p0:-aa,p1:aa},{J:(b,z)=>L(aa+0.012,b,z),p0:-bb,p1:bb}];
  LBOX(-ha,ha,-hb,hb,0,h1,T.wall);const F1=faces(ha,hb)[0],F2=faces(ha,hb)[1];
  [F1,F2].forEach(F=>{const n=Math.round((F.p1-F.p0)/0.28);for(let k=0;k<=n;k++){const p=F.p0+(F.p1-F.p0)*k/n;TH.ln(c,F.J(p,0),F.J(p,h1),'rgba(30,16,8,.4)',u*0.05);}TH.poly(c,[F.J(F.p0,h1-0.16),F.J(F.p1,h1-0.16),F.J(F.p1,h1),F.J(F.p0,h1)],NRED);for(let k=0;k<Math.round((F.p1-F.p0)/0.3);k++){const p=F.p0+0.15+k*0.3;TH.poly(c,[F.J(p-0.08,h1-0.14),F.J(p,h1-0.02),F.J(p+0.08,h1-0.14)],'#f4e8c8');}});
  const doorF=eave?F2:F1,otherF=eave?F1:F2;
  if(T.boat){const pts=[doorF.J(-0.7,0),doorF.J(0.7,0),doorF.J(0.7,h1-0.2),doorF.J(0,h1+0.3),doorF.J(-0.7,h1-0.2)];c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle='#1a120a';c.fill();c.strokeStyle=NRED;c.lineWidth=u*0.1;c.stroke();const b0=doorF.J(-0.1,0.3),b1=doorF.J(0.8,0.55);c.fillStyle='#8a5a33';c.beginPath();c.moveTo(b0[0]-u*0.5,b0[1]+u*0.1);c.quadraticCurveTo(b0[0],b0[1]+u*0.5,b1[0]+u*0.6,b1[1]-u*0.2);c.quadraticCurveTo(b1[0]+u*0.2,b1[1]-u*0.5,b0[0]-u*0.5,b0[1]-u*0.3);c.fill();}
  else{const dp=[doorF.J(-0.34,0),doorF.J(0.34,0),doorF.J(0.34,1.05),doorF.J(0,1.3),doorF.J(-0.34,1.05)];c.beginPath();dp.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle=NRED;c.fill();c.strokeStyle='#2a1a10';c.lineWidth=u*0.08;c.stroke();TH.ln(c,doorF.J(0,0.02),doorF.J(0,1.2),'rgba(0,0,0,.35)',u*0.05);TH.ell(c,...doorF.J(0.18,0.55),u*0.05,u*0.05,'#d8c060');}
  const sc=[NRED,'#e8c84a','#2a5a9a','#f4e8c8'];for(let k=0;k<4;k++){const p=otherF.p0+(otherF.p1-otherF.p0)*(k+0.5)/4,q=otherF.J(p,h1*0.55);NSHIELD(c,q[0],q[1],u*0.28,sc[(k+s)%4],sc[(k+s+2)%4]);}
  if(!T.boat){const wf=doorF,wp=wf.J(-wf.p1*0.62,0.7);c.fillStyle='#2a1a10';c.fillRect(wp[0]-u*0.14,wp[1]-u*0.28,u*0.28,u*0.4);}
  /* roof */
  const rA=L(ha+ov,-hb-ov,h1),rB=L(ha+ov,hb+ov,h1),rC=L(0,hb+ov,zr),rD=L(0,-hb-ov,zr);
  if(T.roof==='turf'){TH.poly(c,[rA,rB,rC,rD],'#4f7a3a');for(let k=1;k<5;k++)TH.ln(c,L(ha+ov-(ha+ov)*k/5,-hb-ov,h1+T.rise*k/5),L(ha+ov-(ha+ov)*k/5,hb+ov,h1+T.rise*k/5),'rgba(20,50,20,.35)',u*0.06);for(let k=0;k<22;k++){const t=0.1+r()*0.85,bb=-hb-ov+(2*hb+2*ov)*r(),p=L((ha+ov)*(1-t),bb,h1+T.rise*t);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*u*0.14,p[1]-u*0.3],['#78b058','#5f9a46','#8cc468'][(k+j)%3],u*0.05);}for(let k=0;k<5;k++){const t=0.2+r()*0.6,bb=-hb+2*hb*r(),p=L((ha+ov)*(1-t),bb,h1+T.rise*t);TH.ell(c,p[0],p[1],u*0.1,u*0.08,['#f2c230','#f4a6cb','#f6efe0'][k%3]);}
    TH.poly(c,[L(-ha,hb+0.02,h1),L(ha,hb+0.02,h1),L(0,hb+0.02,zr-0.08)],T.wall);for(let k=-3;k<=3;k++)TH.ln(c,L(k*ha/3.5,hb+0.03,h1+0.02),L(k*ha/3.5*0.3,hb+0.03,zr-0.2),'rgba(30,16,8,.35)',u*0.05);}
  else{TH.poly(c,[rA,rB,rC,rD],'#5a4a3c');const rows=Math.round(T.rise/0.26);for(let k=1;k<rows;k++){const t=k/rows;TH.ln(c,L(ha+ov-(ha+ov)*t,-hb-ov,h1+T.rise*t),L(ha+ov-(ha+ov)*t,hb+ov,h1+T.rise*t),'rgba(10,6,2,.4)',u*0.05);}for(let k=0;k<20;k++){const t=0.1+r()*0.8,bb=-hb-ov+(2*hb+2*ov)*r(),p=L((ha+ov)*(1-t),bb,h1+T.rise*t);TH.ell(c,p[0],p[1],u*0.18,u*0.09,r()<0.5?'#6a5a4a':'#4a3a2c');}
    TH.poly(c,[L(-ha,hb+0.02,h1),L(ha,hb+0.02,h1),L(0,hb+0.02,zr-0.08)],T.wall);for(let k=-3;k<=3;k++)TH.ln(c,L(k*ha/3.5,hb+0.03,h1+0.02),L(k*ha/3.5*0.3,hb+0.03,zr-0.2),'rgba(30,16,8,.35)',u*0.05);}
  TH.ln(c,L(-ha-ov,hb+ov,h1),L(0,hb+ov,zr),NWOOD_D,u*0.14);TH.ln(c,L(ha+ov,hb+ov,h1),L(0,hb+ov,zr),NWOOD_D,u*0.14);TH.ln(c,rD,rC,NWOOD_D,u*0.12);
  const gc=L(0,hb+0.04,h1+T.rise*0.4);TH.ell(c,gc[0],gc[1],u*0.18,u*0.2,'#1a120a');TH.ln(c,L(-ha*0.6,hb+0.04,h1+0.28),L(ha*0.6,hb+0.04,h1+0.28),NRED,u*0.07);
  const ap=L(0,hb+ov,zr);NDRAGON(c,ap[0],ap[1],u*1.15,1);const bp=L(0,-hb-ov,zr);NDRAGON(c,bp[0],bp[1],u*1.0,-1);
  const sp=L(0,-hb*0.3,zr);c.fillStyle='rgba(235,235,240,.5)';for(let k=0;k<3;k++){c.beginPath();c.ellipse(sp[0]+k*u*0.14,sp[1]-u*(0.45+k*0.5),u*(0.28+k*0.1),u*0.2,0,0,7);c.fill();}}
const NHUT=(key)=>({cat:'struct',rho:0.13,draw(c,x,y,u,v){const T=NHUT_T[key],o=v&3,s=v>>2,eave=(o>>1)&1;c.fillStyle='rgba(14,26,28,.3)';c.beginPath();c.ellipse(x+u*0.8,y+u*0.2,u*T.sw*(eave?1.18:1),u*T.sh,0,0,7);c.fill();NFLIP(c,x,o&1,()=>NHUT_BODY(c,x,y,u,s,eave,T));}});
const NORDIC_ASSETS={
  /* ---------- trees: dark green pines, white birches ---------- */
  pineN:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*11+2);NSH(c,x,y,u*1.6);NCON(c,x,y,u,{h:4.9+r()*1.4,w:1.45,tiers:7,c1:'#1f4d3c',c2:'#153a2c'},r);}},
  spruceN:{cat:'tree',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*13+1);NSH(c,x,y,u*1.3);NCON(c,x,y,u,{h:6.2+r()*1.5,w:1.15,tiers:9,c1:'#1a463a',c2:'#12352b',layer:0.3},r);}},
  firN:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*17+4);NSH(c,x,y,u*1.8);NCON(c,x,y,u,{h:3.9+r()*0.9,w:1.75,tiers:5,c1:'#245a46',c2:'#18402f',layer:0.4,bare:0.1},r);}},
  snowPineN:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*19+2);NSH(c,x,y,u*1.6);NCON(c,x,y,u,{h:4.9+r()*1.4,w:1.5,tiers:7,c1:'#1f4d3c',c2:'#153a2c',snow:true},r);}},
  youngPineN:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*29+3);NSH(c,x,y,u*1.2);NCON(c,x,y,u,{h:2.7+r()*0.9,w:1.1,tiers:4,c1:'#28604c',c2:'#1a4434',layer:0.42,bare:0.08,tw:0.3},r);}},
  birchN:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*5+3),H=u*(4.2+r()*1.0),pal=v%3===0?['#e0c050','#d0a838','#e8d068','#c8a030']:['#a8c060','#90ae4c','#bcd070','#7a9a3c'];NSH(c,x,y,u*1.7);c.lineCap='round';c.strokeStyle='#ece8dc';c.lineWidth=u*0.46;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.12,y-H*0.4,x+u*0.05,y-H*0.7);c.stroke();for(let k=0;k<8;k++)TH.ln(c,[x-u*0.2,y-H*(0.06+k*0.08)],[x+u*0.1,y-H*(0.06+k*0.08)+u*0.05],'rgba(40,36,30,.55)',u*0.07);TH.ln(c,[x,y-H*0.55],[x-u*0.8,y-H*0.85],'#ece8dc',u*0.2);TH.ln(c,[x,y-H*0.6],[x+u*0.9,y-H*0.82],'#ece8dc',u*0.2);const cy=y-H*0.85;[[0,-0.5,1.3,1.0],[-1.0,-0.1,1.0,0.85],[1.0,-0.1,1.0,0.85],[-0.5,-1.15,1.0,0.8],[0.6,-1.1,1.0,0.8],[0,0.2,1.2,0.7]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,9));}},
  rowan:{cat:'tree',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*23+1),H=u*(3.2+r()*0.6),pal=['#5f8a46','#6f9a52','#4f7a3c'];NSH(c,x,y,u*1.6);TH.ln(c,[x,y],[x,y-H*0.55],'#6a5a48',u*0.4);const cy=y-H*0.8;[[0,-0.2,1.4,0.95],[-1.0,0.1,0.95,0.75],[1.0,0.1,0.95,0.75],[0,-0.8,1.0,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%3],r,9));for(let k=0;k<11;k++)TH.ell(c,x+(r()-0.5)*u*2.2,cy+u*(-0.8+r()*1.5),u*0.1,u*0.1,'#d9433b');}},
  juniperN:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*3+5);NSH(c,x,y,u*1.3);TH.ln(c,[x,y],[x+u*0.1,y-u*0.8],'#5f4a38',u*0.4);[[0,-1.8,1.0,0.9],[-0.6,-1.2,0.85,0.8],[0.6,-1.2,0.85,0.8],[0,-0.9,1.1,0.7]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#2f5a4e','#38685a','#264a40','#42766a'][i],r,8));for(let k=0;k<4;k++)TH.ell(c,x+(r()-0.5)*u*1.6,y-u*(0.8+r()*1.4),u*0.07,u*0.07,'#4a5a9a');}},
  /* ---------- undergrowth ---------- */
  heather:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+9);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(14,26,28,.22)');[[-0.55,-0.4,0.85,0.55],[0.55,-0.4,0.85,0.55],[0,-0.8,0.9,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#7a5a98','#8a6aa8','#6a4a88'][i],r,8));for(let k=0;k<14;k++)TH.ell(c,x+(r()-0.5)*u*1.8,y-u*(0.3+r()*0.9),u*0.06,u*0.06,k%2?'#c8a0e0':'#a878c8');}},
  bilberry:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*7+2);TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.28,'rgba(14,26,28,.2)');[[-0.45,-0.35,0.7,0.5],[0.45,-0.35,0.7,0.5],[0,-0.7,0.75,0.55]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#4a7a48','#5a8a54','#3f6a3e'][i],r,8));for(let k=0;k<8;k++)TH.ell(c,x+(r()-0.5)*u*1.4,y-u*(0.25+r()*0.7),u*0.08,u*0.08,'#2a3a8a');}},
  fernN:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(14,26,28,.2)');for(let k=0;k<9;k++){const a=-Math.PI+0.15+k/8*(Math.PI-0.3),len=u*(1.1+r()*0.45),ex=x+Math.cos(a)*len,ey=y-u*0.1+Math.sin(a)*len*0.6+len*0.4;c.lineCap='round';c.strokeStyle=k%2?'#3f7a4a':'#2f6a3e';c.lineWidth=u*0.4;c.beginPath();c.moveTo(x,y-u*0.1);c.quadraticCurveTo(x+Math.cos(a)*len*0.55,y-u*0.1+Math.sin(a)*len*0.7-len*0.25,ex,ey);c.stroke();}}},
  grassN:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);for(let k=0;k<13;k++){const a=-1.1+k/12*2.2+(r()-0.5)*0.2,l=u*(0.7+r()*0.8);TH.ln(c,[x+(r()-0.5)*u*0.6,y],[x+Math.sin(a)*l*0.8+(r()-0.5)*u*0.3,y-l],['#6a9a62','#5a8a54','#82aa72'][k%3],u*0.09);}}},
  reeds:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*13+2);for(let k=0;k<9;k++){const bx=x+(k-4)*u*0.18+(r()-0.5)*u*0.1,h=u*(1.6+r()*1.4),lean=(r()-0.5)*u*0.5;TH.ln(c,[bx,y],[bx+lean,y-h],k%2?'#8a9a5a':'#6a8a4a',u*0.07);if(k%3===0){TH.ell(c,bx+lean,y-h,u*0.09,u*0.28,'#6a4a2a');}}}},
  /* ---------- hills, mountains and sharp spikes ---------- */
  nordicPeak:{cat:'rock',rho:0.2,draw(c,x,y,u,v){const r=mulberry(v*9+2),H=u*(9.0+r()*2.2),w=u*(4.4+r()*0.8);TH.ell(c,x+u*1.2,y+u*0.3,w*1.3,u*0.8,'rgba(14,26,28,.28)');
    const pts=[[-w*1.3,0]],n=9;for(let i=1;i<n;i++){const t=i/n,sh=1-Math.abs(t-0.5)*2;pts.push([-w*1.3+t*w*2.6+(r()-0.5)*w*0.12,-H*Math.pow(sh,0.85)*(0.88+r()*0.16)]);}pts[4]=[(r()-0.5)*w*0.15,-H];pts.push([w*1.3,0]);const sx=pts[4][0];
    c.save();c.translate(x,y);c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle='#667282';c.fill();c.clip();
    TH.poly(c,[[-w*1.4,0],[sx,0],[sx,-H]],'#7c8898');TH.poly(c,[[sx,-H],[w*1.4,0],[sx+w*0.05,0]],'#454e5c');
    for(let k=0;k<11;k++){const bx=sx+(r()*2-1)*w*0.95;TH.ln(c,[bx,-H*(0.95-r()*0.3)],[bx+(r()-0.5)*w*0.25,-H*(0.15+r()*0.35)],r()<0.55?'rgba(30,38,50,.45)':'rgba(230,238,246,.4)',u*0.1);}
    for(let k=0;k<7;k++){const bx=sx+(r()*2-1)*w*0.5,by=-H*(0.5+r()*0.45);TH.poly(c,[[bx-w*0.12,by],[bx,by-H*0.12],[bx+w*0.12,by],[bx+w*0.05,by+H*0.08],[bx-w*0.05,by+H*0.07]],NSNOW);}
    TH.poly(c,[[sx-w*0.22,-H*0.86],[sx,-H],[sx+w*0.2,-H*0.84],[sx+w*0.08,-H*0.74],[sx-w*0.06,-H*0.78]],NSNOW);
    for(let k=0;k<40;k++){const t=Math.pow(r(),0.7),yy=-H*0.02-t*H*0.28,span=w*(1.3-t*0.4),xx=(r()*2-1)*span;NTRI(c,xx,yy,u*(0.5+r()*0.35),k%2?'#1f4d3c':'#173d2f',k%2?'#153a2c':'#0f2e22');}
    const g=c.createLinearGradient(0,-H*0.4,0,0);g.addColorStop(0,'rgba(215,230,238,0)');g.addColorStop(1,'rgba(205,224,234,.28)');c.fillStyle=g;c.fillRect(-w*1.4,-H*0.4,w*2.8,H*0.4);c.restore();}},
  heatherHill:{cat:'rock',rho:0.2,draw(c,x,y,u,v){const r=mulberry(v*7+8),H=u*(4.2+r()*1.6),w=u*(3.6+r()*0.9);TH.ell(c,x+u*0.8,y+u*0.25,w*1.3,u*0.7,'rgba(14,26,28,.24)');
    c.save();c.translate(x,y);c.beginPath();c.moveTo(-w*1.35,0);c.bezierCurveTo(-w*1.1,-H*0.85,-w*0.45,-H*1.1,0,-H);c.bezierCurveTo(w*0.45,-H*1.05,w*1.1,-H*0.8,w*1.35,0);c.closePath();c.fillStyle='#6f8a6c';c.fill();c.clip();
    const g=c.createLinearGradient(-w*1.3,0,w*1.3,0);g.addColorStop(0,'rgba(200,225,190,.2)');g.addColorStop(0.5,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,30,30,.42)');c.fillStyle=g;c.fillRect(-w*1.4,-H*1.2,w*2.8,H*1.3);
    for(let k=0;k<5;k++){const p=[(r()*2-1)*w*0.9,-H*(0.2+r()*0.6)],rr=w*(0.25+r()*0.3);c.fillStyle=k%2?'rgba(122,90,152,.28)':'rgba(150,120,170,.24)';c.beginPath();c.ellipse(p[0],p[1],rr,rr*0.4,0,0,7);c.fill();}
    for(let k=0;k<5;k++){const bx=(r()*2-1)*w*0.8,by=-H*(0.15+r()*0.7);SBLOCKN(c,bx,by,u*(0.4+r()*0.4),u*(0.3+r()*0.3),r);}
    const trees=[];for(let k=0;k<26;k++){const t=Math.pow(r(),0.85),yy=-H*(0.03+t*0.93),span=w*(1.3-Math.pow(t,1.4)*1.05);trees.push([(r()*2-1)*span,yy,u*(0.45+r()*0.3),k%2]);}trees.sort((a,b)=>a[1]-b[1]).forEach(([tx,ty,s,k])=>NTRI(c,tx,ty,s,k?'#1f4d3c':'#173d2f',k?'#153a2c':'#0f2e22'));c.restore();}},
  rockSpike:{cat:'rock',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*9+5),pal=NROCKP[v%3],n=2+Math.floor(r()*3);TH.ell(c,x+u*0.6,y+u*0.15,u*(0.9+n*0.45),u*0.42,'rgba(14,26,28,.28)');const sp=[];for(let k=0;k<n;k++)sp.push([(k-(n-1)/2)*u*0.75+(r()-0.5)*u*0.3,u*(2.2+r()*3.6),u*(0.4+r()*0.35),(r()-0.5)*u*0.5]);sp.sort((a,b)=>a[0]-b[0]).forEach(([dx,h,w,lean],k)=>{const bx=x+dx;TH.poly(c,[[bx-w,y],[bx-w*0.5+lean*0.5,y-h*0.55],[bx+lean,y-h],[bx+w*0.45+lean*0.5,y-h*0.5],[bx+w,y]],pal[0]);TH.poly(c,[[bx+w*0.1,y],[bx+lean,y-h],[bx+w*0.45+lean*0.5,y-h*0.5],[bx+w,y]],pal[2]);TH.poly(c,[[bx-w*0.5+lean*0.5,y-h*0.55],[bx+lean,y-h],[bx+w*0.1+lean*0.4,y-h*0.55]],pal[1]);for(let q=1;q<4;q++)TH.ln(c,[bx-w*0.8,y-h*0.2*q],[bx+w*0.8,y-h*0.2*q-u*0.05],'rgba(0,0,0,.2)',u*0.05);if(h>u*3.4)TH.poly(c,[[bx+lean-w*0.18,y-h*0.88],[bx+lean,y-h],[bx+lean+w*0.18,y-h*0.86],[bx+lean,y-h*0.8]],NSNOW);});}},
  boulderN:{cat:'rock',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+5),pal=NROCKP[v%3];[[-0.9,0.1,0.9,0.8],[0.7,0.2,0.8,0.7],[0,-0.35,0.7,0.6]].forEach(([dx,dy,rx,ry])=>{const px=x+dx*u,py=y+dy*u,sx=u*rx,sy=u*ry*(1+r()*0.2);TH.ell(c,px+sx*0.15,py+sy*0.3,sx*1.05,sy*0.45,'rgba(14,26,28,.28)');TH.poly(c,[[px-sx,py],[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px-sx*0.6,py+sy*0.2]],pal[0]);TH.poly(c,[[px+sx*0.25,py-sy*0.98],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px+sx*0.2,py+sy*0.05]],pal[2]);TH.poly(c,[[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.1,py-sy*0.5],[px-sx*0.5,py-sy*0.45]],'#5f8a5a');});}},
  /* ---------- ponds (set in the corridors between tiles) ---------- */
  pond:{cat:'water',rho:0.17,draw(c,x,y,u,v){const r=mulberry(v*5+3),rx=u*3.7,ry=u*1.7;TH.ell(c,x,y,rx*1.1,ry*1.15,'rgba(70,60,44,.55)');TH.ell(c,x,y,rx*1.04,ry*1.06,'#8a8a78');const g=c.createRadialGradient(x-rx*0.2,y-ry*0.2,0,x,y,rx);g.addColorStop(0,'#5fb0c0');g.addColorStop(0.55,'#3f90a8');g.addColorStop(1,'#2a6a84');c.fillStyle=g;c.beginPath();c.ellipse(x,y,rx,ry,0,0,7);c.fill();
    c.strokeStyle='rgba(235,248,255,.5)';c.lineWidth=u*0.08;c.beginPath();c.ellipse(x,y,rx*0.9,ry*0.88,0,Math.PI*0.9,Math.PI*1.75);c.stroke();TH.ell(c,x-rx*0.3,y-ry*0.25,rx*0.35,ry*0.14,'rgba(255,255,255,.35)');for(let k=0;k<3;k++){const px=x+(r()-0.5)*rx*1.0,py=y+(r()-0.5)*ry*0.8,rr=u*(0.25+k*0.18);c.strokeStyle='rgba(235,248,255,.35)';c.lineWidth=u*0.05;c.beginPath();c.ellipse(px,py,rr,rr*0.42,0,0,7);c.stroke();}
    for(let k=0;k<4;k++){const px=x+(r()-0.5)*rx*1.3,py=y+(r()-0.3)*ry*0.8;TH.ell(c,px,py,u*0.3,u*0.14,'#4f8a46');TH.ell(c,px+u*0.05,py-u*0.02,u*0.1,u*0.05,'#f6efe0');}
    for(let k=0;k<9;k++){const a=-0.3+k/8*(Math.PI*1.3)+Math.PI*0.0,px=x+Math.cos(a+Math.PI*0.6)*rx*1.02,py=y+Math.sin(a+Math.PI*0.6)*ry*1.02;SBLOCKN(c,px,py+u*0.05,u*(0.22+r()*0.3),u*(0.16+r()*0.2),r);}
    for(let k=0;k<4;k++){const px=x+(k-1.5)*rx*0.55,py=y-ry*0.95+(k%2)*u*0.2;for(let j=0;j<6;j++){const bx=px+(j-2.5)*u*0.12,h=u*(1.0+r()*1.3);TH.ln(c,[bx,py],[bx+(r()-0.5)*u*0.4,py-h],j%2?'#8a9a5a':'#6a8a4a',u*0.06);if(j%3===0)TH.ell(c,bx,py-h,u*0.08,u*0.24,'#6a4a2a');}}}},
  /* ---------- the huts ---------- */
  turfHut:NHUT('turfHut'),plankHut:NHUT('plankHut'),boatHouse:NHUT('boatHouse'),
  /* ---------- the one tower: a timber lookout beside the huts ---------- */
  lookoutTower:{cat:'struct',rho:0.05,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);NFLIP(c,x,v&1,()=>{NSH(c,x,y,u*2.0);[[-0.7,-0.7],[0.7,-0.7],[-0.7,0.7],[0.7,0.7]].forEach(([X,Y])=>TH.ln(c,I(X*1.25,Y*1.25,0),I(X*0.9,Y*0.9,5.0),NWOOD,u*0.24));for(let k=0;k<4;k++){const z=0.9+k*1.0,f=1.25-0.35*z/5;TH.ln(c,I(-0.7*f,0.7*f,z),I(0.7*f,0.7*f,z),NWOOD_D,u*0.1);TH.ln(c,I(0.7*f,0.7*f,z),I(0.7*f,-0.7*f,z),NWOOD_D,u*0.1);TH.ln(c,I(-0.7*f,0.7*f,z),I(0.7*f*0.9,0.7*f*0.9,z+1.0),NWOOD_D,u*0.07);}
      for(let k=0;k<8;k++)TH.ln(c,I(-0.45,1.4,0.2+k*0.6),I(0.45,1.4,0.2+k*0.6),NWOOD_D,u*0.07);TH.ln(c,I(-0.45,1.4,0.1),I(-0.45,0.9,5.0),NWOOD_D,u*0.07);TH.ln(c,I(0.45,1.4,0.1),I(0.45,0.9,5.0),NWOOD_D,u*0.07);
      NBOX(c,x,y,u,-1.15,1.15,-1.15,1.15,5.0,5.2,'#9a6a3a');NBOX(c,x,y,u,-1.0,1.0,-1.0,1.0,5.2,6.3,NWOOD);for(let k=0;k<6;k++)TH.ln(c,I(-0.95+k*0.38,1.01,5.25),I(-0.95+k*0.38,1.01,6.25),'rgba(30,16,8,.35)',u*0.05);TH.poly(c,[I(-0.5,1.02,5.5),I(0.5,1.02,5.5),I(0.5,1.02,6.0),I(-0.5,1.02,6.0)],'#1a120a');
      [-0.7,0.0,0.7].forEach((X,i)=>{const q=I(X,1.2,5.55);NSHIELD(c,q[0],q[1],u*0.3,[NRED,'#e8c84a',NRED][i],['#f4e8c8',NRED,'#f4e8c8'][i]);});
      const b=I(0,0,6.3),t=I(0,0,8.4);TH.poly(c,[[b[0]-u*1.55,b[1]+u*0.1],[b[0]+u*1.55,b[1]+u*0.1],[t[0],t[1]]],'#5a4a3c');TH.poly(c,[[b[0]+u*0.1,b[1]+u*0.1],[b[0]+u*1.55,b[1]+u*0.1],[t[0],t[1]]],'#3f342a');for(let k=1;k<4;k++)TH.ln(c,[b[0]-u*1.4*(1-k/4),b[1]+u*0.05-(b[1]-t[1])*k/4],[b[0]+u*1.4*(1-k/4),b[1]+u*0.05-(b[1]-t[1])*k/4],'rgba(10,6,2,.35)',u*0.05);
      NDRAGON(c,t[0],t[1]+u*0.1,u*1.0,1);TH.ln(c,[t[0]-u*0.1,t[1]],[t[0]-u*0.1,t[1]-u*1.0],'#4a2f1c',u*0.07);TH.poly(c,[[t[0]-u*0.1,t[1]-u*1.0],[t[0]+u*0.8,t[1]-u*0.85],[t[0]+u*0.5,t[1]-u*0.7],[t[0]+u*0.8,t[1]-u*0.5],[t[0]-u*0.1,t[1]-u*0.6]],NRED);});}},
  /* ---------- Viking pieces ---------- */
  runestone:{cat:'ruin',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*5+9),pal=NROCKP[v%3];NFLIP(c,x,v&1,()=>{NSH(c,x,y,u*1.6);[[-0.9,0.15,0.5,0.35],[0.8,0.2,0.45,0.3]].forEach(([dx,dy,rx,ry])=>SBLOCKN(c,x+dx*u,y+dy*u,u*rx,u*ry,r));const h=u*(3.6+r()*0.8),w=u*0.75;TH.poly(c,[[x-w,y],[x-w*0.85,y-h*0.8],[x-w*0.2,y-h],[x+w*0.6,y-h*0.95],[x+w,y-h*0.7],[x+w*0.9,y]],pal[0]);TH.poly(c,[[x+w*0.25,y],[x+w*0.4,y-h*0.98],[x+w*0.6,y-h*0.95],[x+w,y-h*0.7],[x+w*0.9,y]],pal[2]);
      for(let k=0;k<5;k++){const yy=y-h*(0.2+k*0.14),cx=x+(r()-0.5)*w*0.5;TH.ln(c,[cx,yy],[cx,yy-h*0.1],NRED,u*0.1);TH.ln(c,[cx,yy-h*0.05],[cx+w*0.28,yy-h*0.12],NRED,u*0.08);TH.ln(c,[cx,yy-h*0.05],[cx-w*0.25,yy-h*0.1],NRED,u*0.08);}c.strokeStyle=NRED;c.lineWidth=u*0.08;c.beginPath();c.moveTo(x-w*0.7,y-h*0.88);c.bezierCurveTo(x-w*0.2,y-h*0.98,x+w*0.3,y-h*0.9,x+w*0.5,y-h*0.82);c.stroke();for(let k=0;k<4;k++)TH.blob(c,x+(r()-0.5)*u*2,y+u*0.1,u*0.3,u*0.18,'#5f8a5a',r,6);});}},
  longship:{cat:'ruin',rho:0.1,draw(c,x,y,u,v){const ang=(v>>2)&1?-0.4636:0.4636;NFLIP(c,x,(v>>3)&1,()=>{c.fillStyle='rgba(14,26,28,.3)';c.beginPath();c.ellipse(x+u*0.6,y+u*0.2,u*3.8,u*1.0,0,0,7);c.fill();
      [[-1.6,0.35],[0.0,0.15],[1.6,0.35]].forEach(([dx,dy])=>{TH.ln(c,[x+Math.cos(ang)*dx*u*0.9,y+Math.sin(ang)*dx*u*0.9+u*0.1],[x+Math.cos(ang)*dx*u*0.9,y+Math.sin(ang)*dx*u*0.9+u*0.45],'#3a2818',u*0.3);});
      c.save();c.translate(x,y-u*1.1);c.rotate(ang);const len=u*5.4,hh=u*0.9;const g=c.createLinearGradient(0,-hh,0,hh);g.addColorStop(0,'#a8744a');g.addColorStop(1,'#5a3a22');c.fillStyle=g;c.beginPath();c.moveTo(-len/2,-hh*1.3);c.quadraticCurveTo(-len*0.3,hh*0.2,-len*0.12,hh);c.lineTo(len*0.12,hh);c.quadraticCurveTo(len*0.3,hh*0.2,len/2,-hh*1.5);c.quadraticCurveTo(len*0.3,-hh*0.4,0,-hh*0.4);c.quadraticCurveTo(-len*0.3,-hh*0.4,-len/2,-hh*1.3);c.closePath();c.fill();c.strokeStyle='rgba(30,16,8,.4)';c.lineWidth=u*0.06;for(let k=1;k<3;k++){c.beginPath();c.moveTo(-len*0.45,-hh*(0.9-k*0.25));c.quadraticCurveTo(0,hh*(k*0.2-0.1),len*0.45,-hh*(1.1-k*0.25));c.stroke();}
      const sc=[NRED,'#e8c84a','#2a5a9a','#f4e8c8'];for(let k=0;k<9;k++){const sx=-len*0.38+k*len*0.095,sy=-hh*(0.55-Math.abs(k-4)*0.05);NSHIELD(c,sx,sy,u*0.2,sc[k%4],sc[(k+2)%4]);}c.restore();
      const px=x+Math.cos(ang)*len*0.5*0+u*0,mx=x,my=y-u*1.6;TH.ln(c,[mx,my],[mx,my-u*3.6],'#4a2f1c',u*0.14);const sy0=my-u*3.4;TH.poly(c,[[mx-u*1.1,sy0],[mx+u*1.1,sy0+u*0.1],[mx+u*0.9,sy0+u*1.8],[mx-u*0.9,sy0+u*1.7]],'#f4e8c8');for(let k=0;k<4;k++)TH.poly(c,[[mx-u*1.1+k*u*0.55,sy0+u*0.02*k],[mx-u*0.82+k*u*0.55,sy0+u*0.02*k],[mx-u*0.7+k*u*0.55,sy0+u*1.7],[mx-u*0.98+k*u*0.55,sy0+u*1.72]],k%2?NRED:'#f4e8c8');TH.ln(c,[mx-u*1.1,sy0],[mx+u*1.1,sy0+u*0.1],'#4a2f1c',u*0.1);
      const bow=[x+Math.cos(ang)*len*0.5,y-u*1.1+Math.sin(ang)*len*0.5-hh*1.5];NDRAGON(c,bow[0],bow[1]+u*0.2,u*1.3,ang>0?1:-1);});}},
  dryingRack:{cat:'ruin',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*7+3),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);NFLIP(c,x,v&1,()=>{NSH(c,x,y,u*2.2);[[-1.6],[1.6]].forEach(([X])=>{TH.ln(c,I(X,-0.3,0),I(X,0,2.6),NWOOD,u*0.16);TH.ln(c,I(X,0.3,0),I(X,0,2.6),NWOOD,u*0.16);});TH.ln(c,I(-1.6,0,2.5),I(1.6,0,2.5),'#6a4a2a',u*0.14);TH.ln(c,I(-1.6,0,1.6),I(1.6,0,1.6),'#6a4a2a',u*0.12);for(let k=0;k<9;k++){const X=-1.4+k*0.35,p=I(X,0,2.45),q=I(X,0,1.55);[p,q].forEach((pp,j)=>{TH.ln(c,pp,[pp[0],pp[1]+u*0.2],'#c8c8c0',u*0.04);const fy=pp[1]+u*0.2;c.fillStyle=j?'#c8a070':'#b8c0c8';c.beginPath();c.ellipse(pp[0],fy+u*0.4,u*0.1,u*0.4,0,0,7);c.fill();TH.poly(c,[[pp[0],fy+u*0.75],[pp[0]-u*0.1,fy+u*0.95],[pp[0]+u*0.1,fy+u*0.95]],j?'#c8a070':'#b8c0c8');});}});}},
  forge:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);NFLIP(c,x,v&1,()=>{NSH(c,x,y,u*2.4);NBOX(c,x,y,u,-1.2,1.2,-0.9,0.9,0,0.15,'#8a8a82');[[-1.2,-0.9],[1.2,-0.9],[-1.2,0.9],[1.2,0.9]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0.15),I(X,Y,2.3),NWOOD,u*0.2));
      NBOX(c,x,y,u,-1.0,-0.2,-0.8,-0.1,0.15,1.2,'#7a7a74');const fp=I(-0.6,-0.45,1.2);TH.ell(c,fp[0],fp[1],u*0.36,u*0.18,'#ff7a2a');const gg=c.createRadialGradient(fp[0],fp[1],0,fp[0],fp[1],u*1.4);gg.addColorStop(0,'rgba(255,140,50,.55)');gg.addColorStop(1,'rgba(255,140,50,0)');c.fillStyle=gg;c.beginPath();c.arc(fp[0],fp[1],u*1.4,0,7);c.fill();NBOX(c,x,y,u,-0.9,-0.3,-0.7,-0.3,1.2,2.6,'#6a6a64');
      const ap=I(0.5,0.3,0.15);NBOX(c,x,y,u,0.2,0.8,0.1,0.5,0.15,0.55,'#3a3a42');TH.poly(c,[[ap[0]-u*0.45,ap[1]-u*0.55],[ap[0]+u*0.6,ap[1]-u*0.55],[ap[0]+u*0.35,ap[1]-u*0.8],[ap[0]-u*0.3,ap[1]-u*0.8]],'#5a5a66');
      TH.poly(c,[I(1.6,-1.3,2.3),I(1.6,1.3,2.3),I(-1.6,1.3,2.9),I(-1.6,-1.3,2.9)],'#5a4a3c');for(let k=1;k<5;k++)TH.ln(c,I(1.6-0.64*k,-1.3,2.3+0.12*k),I(1.6-0.64*k,1.3,2.3+0.12*k),'rgba(10,6,2,.35)',u*0.05);const sp=I(-0.6,-0.5,2.7);c.fillStyle='rgba(60,60,66,.5)';for(let k=0;k<3;k++){c.beginPath();c.ellipse(sp[0]+k*u*0.2,sp[1]-u*(0.5+k*0.55),u*(0.3+k*0.12),u*0.22,0,0,7);c.fill();}});}},
  longfire:{cat:'ruin',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*5+9);NSH(c,x,y,u*2.4);for(let k=0;k<4;k++){const a=k/4*6.283+0.6,lx=x+Math.cos(a)*u*1.9,ly=y+Math.sin(a)*u*0.75;c.save();c.translate(lx,ly);c.rotate(a+Math.PI/2+0.0);c.fillStyle='#6a4a2a';c.fillRect(-u*0.9,-u*0.18,u*1.8,u*0.36);c.fillStyle='#8a6a40';c.fillRect(-u*0.9,-u*0.18,u*1.8,u*0.1);c.restore();}
    for(let k=0;k<9;k++){const a=k/9*6.283;TH.ell(c,x+Math.cos(a)*u*0.9,y+Math.sin(a)*u*0.38,u*0.24,u*0.16,k%2?'#8a8a82':'#a0a098');}TH.ln(c,[x-u*0.5,y+u*0.05],[x+u*0.4,y-u*0.2],'#3a2818',u*0.26);TH.ln(c,[x+u*0.5,y+u*0.05],[x-u*0.4,y-u*0.2],'#2a1c10',u*0.24);const g=c.createRadialGradient(x,y-u*0.8,0,x,y-u*0.8,u*2.2);g.addColorStop(0,'rgba(255,190,90,.5)');g.addColorStop(1,'rgba(255,190,90,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*0.8,u*2.2,0,7);c.fill();TH.poly(c,[[x-u*0.5,y-u*0.15],[x+u*0.5,y-u*0.15],[x+u*0.25,y-u*1.2],[x,y-u*1.8],[x-u*0.2,y-u*1.0]],'#f08a24');TH.poly(c,[[x-u*0.25,y-u*0.15],[x+u*0.25,y-u*0.15],[x,y-u*0.95]],'#ffe27a');}},
  /* ---------- small props (lower tiers only) ---------- */
  vikingBanner:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.26,'rgba(14,26,28,.26)');TH.ln(c,[x,y],[x,y-u*4.0],NWOOD_D,u*0.18);TH.ln(c,[x-u*0.4,y-u*3.8],[x+u*0.4,y-u*3.8],NWOOD_D,u*0.1);TH.poly(c,[[x,y-u*3.8],[x+u*1.6,y-u*3.7],[x+u*1.2,y-u*3.0],[x+u*1.6,y-u*2.2],[x,y-u*2.3]],NRED);c.fillStyle='#f4e8c8';c.beginPath();c.moveTo(x+u*0.35,y-u*3.2);c.quadraticCurveTo(x+u*0.6,y-u*3.6,x+u*0.95,y-u*3.3);c.quadraticCurveTo(x+u*0.8,y-u*3.1,x+u*0.9,y-u*2.8);c.quadraticCurveTo(x+u*0.6,y-u*2.9,x+u*0.35,y-u*2.7);c.closePath();c.fill();}},
  torchPost:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(14,26,28,.26)');TH.ln(c,[x,y],[x,y-u*3.0],NWOOD_D,u*0.2);TH.poly(c,[[x-u*0.4,y-u*3.0],[x+u*0.4,y-u*3.0],[x+u*0.28,y-u*3.3],[x-u*0.28,y-u*3.3]],'#3a3a42');const g=c.createRadialGradient(x,y-u*3.6,0,x,y-u*3.6,u*1.7);g.addColorStop(0,'rgba(255,170,70,.55)');g.addColorStop(1,'rgba(255,170,70,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*3.6,u*1.7,0,7);c.fill();TH.poly(c,[[x-u*0.3,y-u*3.3],[x+u*0.3,y-u*3.3],[x+u*0.15,y-u*4.0],[x,y-u*4.4],[x-u*0.1,y-u*3.9]],'#f08a24');TH.poly(c,[[x-u*0.15,y-u*3.3],[x+u*0.15,y-u*3.3],[x,y-u*3.9]],'#ffe27a');}},
  shieldRack:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*2.0,u*0.4,'rgba(14,26,28,.22)');[-1.5,1.5].forEach(X=>TH.ln(c,I(X,0,0),I(X,0,2.2),NWOOD,u*0.18));TH.ln(c,I(-1.5,0,2.1),I(1.5,0,2.1),NWOOD_D,u*0.14);TH.ln(c,I(-1.5,0,0.5),I(1.5,0,0.5),NWOOD_D,u*0.12);const sc=[NRED,'#e8c84a','#2a5a9a','#f4e8c8',NRED];for(let k=0;k<5;k++){const q=I(-1.2+k*0.6,0.05,1.3);NSHIELD(c,q[0],q[1],u*0.42,sc[k],sc[(k+2)%5]);}}},
  barrelsN:{cat:'prop',rho:0.05,draw(c,x,y,u,v){const bar=(bx,by,s)=>{const w=u*0.5*s,h=u*1.0*s;TH.ell(c,bx+w*0.5,by+w*0.2,w*1.3,w*0.4,'rgba(14,26,28,.24)');TH.ell(c,bx,by,w,w*0.4,'#4a2f1c');c.fillStyle='#7a5230';c.beginPath();c.moveTo(bx-w,by);c.quadraticCurveTo(bx-w*1.14,by-h*0.5,bx-w,by-h);c.lineTo(bx+w,by-h);c.quadraticCurveTo(bx+w*1.14,by-h*0.5,bx+w,by);c.ellipse(bx,by,w,w*0.4,0,0,Math.PI);c.fill();[0.2,0.8].forEach(f=>TH.ln(c,[bx-w*1.04,by-h*f],[bx+w*1.04,by-h*f],'#3a3f4a',u*0.08));TH.ell(c,bx,by-h,w,w*0.4,'#a07a4a');};bar(x-u*0.6,y,1);bar(x+u*0.6,y+u*0.1,0.95);bar(x,y-u*0.2,0.9);}},
  woodPile:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.6,u*0.45,'rgba(14,26,28,.24)');TH.box(c,x,y,u,-1.0,1.0,-0.6,0.6,0,1.1,'#6a4428','#4a2f1c','#84583a');for(let row=0;row<3;row++)for(let k=0;k<6;k++){const X=-0.85+k*0.34,Z=0.18+row*0.34;TH.ell(c,...I(X+0.15,0.61,Z),u*0.15,u*0.12,k%2?'#c9a066':'#b98a55');TH.ell(c,...I(X+0.15,0.61,Z),u*0.07,u*0.06,'#8a5a33');}}}
};
function SBLOCKN(c,x,y,rx,ry,r){const pal=NROCKP[Math.floor(r()*3)];TH.poly(c,[[x-rx,y],[x-rx*0.8,y-ry*0.7],[x-rx*0.2,y-ry*1.05],[x+rx*0.5,y-ry*0.9],[x+rx,y-ry*0.2],[x+rx*0.8,y+ry*0.2],[x-rx*0.5,y+ry*0.25]],pal[0]);TH.poly(c,[[x+rx*0.3,y-ry*0.95],[x+rx,y-ry*0.2],[x+rx*0.8,y+ry*0.2],[x+rx*0.2,y+ry*0.1]],pal[2]);TH.poly(c,[[x-rx*0.8,y-ry*0.7],[x-rx*0.2,y-ry*1.05],[x+rx*0.2,y-ry*0.9],[x-rx*0.3,y-ry*0.5]],pal[1]);}

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

/* ===== NORDIC LAND: planner (dark-green pines with sharp rock spikes, a few modest peaks and hills spread around the rim, ponds in the corridors between tiles, little Viking huts) ===== */
const NORDIC_REGION={top:{pineN:.28,spruceN:.22,firN:.1,snowPineN:.06,birchN:.14,rowan:.06,juniperN:.06,youngPineN:.08},mid:{pineN:.28,spruceN:.2,firN:.12,birchN:.16,rowan:.08,juniperN:.06,youngPineN:.1},bottom:{pineN:.2,spruceN:.14,firN:.12,birchN:.18,rowan:.1,juniperN:.1,youngPineN:.16}};
const NORDIC_LOW=[['youngPineN',1],['juniperN',0.9],['birchN',0.6],['rowan',0.7],['youngPineN',1.25],['pineN',0.55],['firN',0.62]];
const NORDIC_CAP={snowPineN:8};
const NORDIC_UNDER=['heather','bilberry','fernN','grassN','heather','fernN','bilberry','grassN','boulderN'];
const NORDIC_PLAN_CACHE={};
function getNordicPlan(shape){
  if(NORDIC_PLAN_CACHE[shape])return NORDIC_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(shape==='A'?7301:8402),placed=[],bb=G.bbox,used={},A=NORDIC_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.66);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'pineN';};
  const capOk=k=>!(NORDIC_CAP[k]&&(used[k]||0)>=NORDIC_CAP[k]);
  const regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?NORDIC_REGION.top:n<0.68?NORDIC_REGION.mid:NORDIC_REGION.bottom;};
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='tree'?0.88+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;if((D.cat==='tree'||D.cat==='shrub'||D.cat==='prop'||(D.cat==='rock'&&!extra))&&placed.some(o=>o.noSouth&&Math.abs(px-o.x)<0.3&&py-o.y>-0.05&&py-o.y<0.36))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const tree=(x,y,extra,dom,low)=>{if(low){const L=NORDIC_LOW[Math.floor(rng()*NORDIC_LOW.length)];return place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return place(dom&&rng()<0.55&&capOk(dom)?dom:pickFrom(regionOf(y),capOk),x,y,extra||{});};
  const spike=(x,y,extra)=>place('rockSpike',x,y,Object.assign({scale:0.9+rng()*0.45},extra||{}));
  const under=(x,y,extra)=>place(NORDIC_UNDER[Math.floor(rng()*NORDIC_UNDER.length)],x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1a. two or three ponds in the wide corridors BETWEEN horizontally adjacent tiles (spread apart; they appear one per tier) */
  {const vc=interior.filter(e=>e.vertical).map(e=>e.mid),picks=[],pool=vc.slice();while(picks.length<3&&pool.length){let best=0,bd=-1;pool.forEach((p,i)=>{const d=picks.length?Math.min(...picks.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4))):rng();if(d>bd){bd=d;best=i;}});const p=pool.splice(best,1)[0],o=place('pond',p[0],p[1],{minT:picks.length+1,scale:1,clear:3.4,noSouth:true,fixed:true});if(o)picks.push([o.x,o.y]);}}
  /* 1b. a few modest peaks and hills spread around the rim, NOT stacked along the back (about a third at the top, the rest on the sides and lower corners) */
  {const sideL=sides.filter(e=>e.mid[0]<cx).sort((a,b)=>a.mid[0]-b.mid[0]),sideR=sides.filter(e=>e.mid[0]>=cx).sort((a,b)=>b.mid[0]-a.mid[0]),bots=outer.filter(e=>e.cls==='bottom').sort((a,b)=>a.mid[0]-b.mid[0]),topS=top.slice().sort((a,b)=>a.mid[0]-b.mid[0]);
    const at=(e,t,off,kind,extra)=>{if(!e)return null;const p=onEdge(e,t,off);return place(kind,p[0],p[1],Object.assign({fixed:true},extra));};
    at(topS[Math.floor(topS.length*0.3)],0.5,0.0,'nordicPeak',{minT:2,scale:1.0,clear:1.6});at(topS[Math.floor(topS.length*0.78)],0.5,0.0,'heatherHill',{minT:1,clear:1.5});
    at(sideL[0],0.5,0.05,'nordicPeak',{minT:3,scale:0.95,clear:1.6});at(sideR[0],0.5,0.05,'nordicPeak',{minT:4,scale:0.95,clear:1.6});
    if(sideL.length>1)at(sideL[sideL.length-1],0.5,0.05,'heatherHill',{minT:1,scale:0.9,clear:1.5});if(sideR.length>1)at(sideR[sideR.length-1],0.5,0.05,'heatherHill',{minT:2,scale:0.9,clear:1.5});
    if(bots.length){at(bots[0],0.3,0.05,'heatherHill',{minT:2,scale:0.7,clear:1.4});at(bots[bots.length-1],0.7,0.05,'heatherHill',{minT:3,scale:0.7,clear:1.4});}}
  /* 2. little Viking huts: 4 on the rim (spread by farthest-point), 4 through the middle, then ONE lookout tower beside a hut */
  const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.filter(e=>e.vertical).forEach(e=>inn.push([e.mid[0],e.mid[1]]));
  const chosen=placed.filter(o=>o.cat==='ruin'||o.cat==='struct').map(o=>[o.x,o.y]),manors=[];
  const spread=(k,pool,extra)=>{const ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.22})).sort((a,b)=>b.d-a.d);for(let n=0;n<Math.min(12,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],extra);if(o){chosen.push([o.x,o.y]);if(/^(turfHut|plankHut|boatHouse)$/.test(k))manors.push(o);return o;}}return null;};
  [['turfHut',1],['plankHut',2],['boatHouse',3],['turfHut',4]].forEach(([k,mt])=>spread(k,rim,{minT:mt,scale:1.15,clear:2.5,noSouth:true}));
  [['plankHut',2],['turfHut',3],['boatHouse',4],['plankHut',4]].forEach(([k,mt])=>spread(k,inn,{minT:mt,scale:1.0,clear:3.0,noSouth:true}));
  {const home=manors[manors.length-1]||placed.find(o=>o.cat==='struct');if(home){for(const [dx,dy] of [[0.36,-0.08],[-0.36,-0.08],[0.3,0.12],[-0.3,0.12],[0.44,0.0],[-0.44,0.0]]){const o=place('lookoutTower',home.x+dx,home.y+dy,{minT:4,scale:1.0,clear:2.4,noSouth:true});if(o)break;}}}
  /* 2b. Viking pieces scattered through the land (farthest-point spacing): runestones, a beached longship, drying racks, a forge, a longfire */
  [['runestone',1],['longship',2],['dryingRack',2],['runestone',3],['forge',3],['longfire',3],['dryingRack',4],['runestone',4]].forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,scale:k==='longship'?1.1:1.0,clear:1.8,noSouth:true}));
  /* 3. dark pines with sharp rock spikes mixed in (the top rim is treated exactly like every other edge) */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=pickFrom(regionOf(v.y),capOk),n=2+Math.floor(rng()*1.9);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.09:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}if(rng()<0.35)spike(v.x+(rng()-0.5)*0.24,v.y+(rng()-0.5)*0.14);});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{const dom=pickFrom(regionOf(e.mid[1]),capOk);[-0.27,0,0.27].forEach(dy=>{if(rng()<0.82)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});if(rng()<0.2)spike(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.3);});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.72)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.8+rng()*0.2},null,true);if(rng()<0.22)tree(e.mid[0]+(rng()-0.5)*0.34,e.mid[1]+(rng()-0.5)*0.14,{scale:0.78+rng()*0.2},null,true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.26));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(rng()-0.2)*0.12)});});
    let mode='grove',run=0,dom='pineN';samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.74?'grove':r<0.92?'sparse':'open';run=2+Math.floor(rng()*4);dom=pickFrom(regionOf(s.p[1]),capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){tree(p[0],p[1],null,dom,low);if(rng()<0.55)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,dom,low);if(rng()<0.2)tree(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,dom,true);if(rng()<0.14)tree(p[0]+(rng()-0.5)*0.34,p[1]-0.2,null,dom,low);if(rng()<0.3)spike(p[0]+(rng()-0.5)*0.3,p[1]+(rng()-0.5)*0.1);}
      else if(mode==='sparse'){if(rng()<0.5)tree(p[0],p[1],null,dom,low);else under(p[0],p[1]);}else if(rng()<0.6)under(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.8)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<14;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.46)tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);else if(rng()<0.06)spike(px,py);}});
  /* 3c. balance the rim: the top, the sides and the bottom must carry the same tree density per unit of boundary (thin the heavy edges, fill the light ones) */
  {const dEdge=(x,y,e)=>{const dx=e.b[0]-e.a[0],dy=e.b[1]-e.a[1],t=Math.max(0,Math.min(1,((x-e.a[0])*dx+(y-e.a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-(e.a[0]+dx*t),(y-(e.a[1]+dy*t))*1.4);};
    const classes=['top','side','bottom'],len={top:0,side:0,bottom:0};outer.forEach(e=>len[e.cls]+=e.len);
    const members=()=>{const m={top:[],side:[],bottom:[]};placed.filter(o=>o.cat==='tree').forEach(o=>{let best=null,bd=1e9;outer.forEach(e=>{const d=dEdge(o.x,o.y,e);if(d<bd){bd=d;best=e;}});if(bd<0.32)m[best.cls].push(o);});return m;};
    let m=members();const mean=(m.top.length+m.side.length+m.bottom.length)/(len.top+len.side+len.bottom);
    classes.forEach(cl=>{const target=Math.round(len[cl]*mean);let list=m[cl];
      if(list.length>target+1){const drop=list.length-target;for(let i=0;i<drop;i++){const pick=list.splice(Math.floor(rng()*list.length),1)[0],ix=placed.indexOf(pick);if(ix>=0)placed.splice(ix,1);}}
      else if(list.length<target-1){const need=target-list.length,es=outer.filter(e=>e.cls===cl);let added=0,guard=0;while(added<need&&guard++<160){const e=es[Math.floor(rng()*es.length)],p=onEdge(e,rng(),(rng()-0.2)*0.12);if(tree(p[0],p[1],null,null,cl!=='top'))added++;}}});}
  /* 4. undergrowth: heather, bilberry, ferns */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.45)under(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.35)under(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.38)under(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.3)under(px,py);}});
  /* 5. small props: lower tiers only */
  [['vikingBanner',2],['torchPost',2],['shieldRack',2],['barrelsN',2],['woodPile',2]].forEach(([k,n])=>{for(let i=0;i<n;i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  /* every house gets a facing (bit0 mirror, bit1 gable/eave); neighbours cycle through all four */
  {const houses=placed.filter(o=>/^(turfHut|plankHut|boatHouse)$/.test(o.kind)).sort((a,b)=>a.x-b.x||a.y-b.y),cyc=[0,3,1,2];houses.forEach((o,i)=>{o.v=((o.v>>2)<<2)|cyc[i%4];});placed.filter(o=>o.kind==='lookoutTower'||o.kind==='longship'||o.kind==='forge').forEach(o=>{o.v=((o.v>>2)<<2)|(rng()<0.5?1:0);});}
  const cuts={tree:[0.2,0.52,0.8,1],shrub:[0.06,0.38,0.7,1],rock:[0.3,0.55,0.8,1],prop:[1,1,1,1],struct:[0,0,0,0],ruin:[0,0,0,0],water:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='struct'||o.cat==='ruin'||o.cat==='water'||o.fixed)o.tier=o.minT;});
  const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
  for(let t=1;t<=4;t++){let guard=0;while(guard++<300){const c=count(t);if(c.tr/Math.max(1,c.n)>=0.6)break;const pool=placed.filter(o=>o.tier<=t&&t<=o.maxT),cand=(pool.filter(o=>o.cat==='shrub').sort((a,b)=>b.pri-a.pri)[0])||(pool.filter(o=>o.prop&&o.minT>1).sort((a,b)=>b.pri-a.pri)[0]);if(!cand)break;cand.tier=Math.min(5,cand.tier+1);}}
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.filter(o=>o.cat==='water').forEach(o=>{o.layer='back';});
  placed.sort((a,b)=>a.y-b.y);
  return NORDIC_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: muted teal-grey earth with moss, lichen, heather speckle and pine-needle litter, a few pale frost patches (decals, not objects) ---- */
function nordicGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<46;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'170,205,185':'40,66,62',r()<0.5?0.2:0.22);}
  for(let k=0;k<12;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'90,140,96',0.2);}                    /* moss */
  for(let k=0;k<8;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'110,84,60',0.15);}                   /* peaty earth */
  for(let k=0;k<7;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'236,244,248',0.22);}                 /* frost */
  for(let k=0;k<90;k++){const p=pt(),a=r()*3.14,l=R*(0.03+r()*0.04);TH.ln(c,[p[0],p[1]],[p[0]+Math.cos(a)*l,p[1]+Math.sin(a)*l*0.5],r()<0.5?'rgba(96,66,40,.55)':'rgba(120,86,50,.5)',R*0.008);}   /* pine needles */
  for(let k=0;k<130;k++){const p=pt(),h=R*(0.05+r()*0.05);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#6a9a62','#5a8a54','#82aa72'][(k+j)%3],R*0.01);}
  for(let k=0;k<50;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.011,R*0.009,['#a878c8','#c8a0e0','#f6efe0','#f2c230'][k%4]);}   /* heather and wild flowers */
  for(let k=0;k<34;k++){const p=pt();TH.ell(c,p[0],p[1],R*(0.016+r()*0.014),R*0.011,r()<0.4?'rgba(150,170,130,.6)':'rgba(130,140,150,.55)');}   /* lichen-covered stones */
  c.restore();c.restore();
}
const NORDIC_THEME={id:'nordic',assets:NORDIC_ASSETS,plan:getNordicPlan,ground:nordicGround,groundCol:'#7f9a8c',top:1.5};
const NORDIC_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
function bakeLandNordic(shape,tier,R,opts){return bakeLandTheme(NORDIC_THEME,shape,tier,R,opts);}
function drawLandNordicBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandNordicDepthBand(ctx,x,y,land,index){const band=land.bands[index];if(!band||!band.canvas)return;const r=band.rect;ctx.drawImage(band.canvas,x-land.ox+r.x,y-land.oy+r.y,r.w,r.h);}
function drawLandNordicFront(ctx,x,y,land){land.bands.forEach((_,index)=>drawLandNordicDepthBand(ctx,x,y,land,index));}
return Object.freeze({bake:bakeLandNordic,drawBack:drawLandNordicBack,drawDepthBand:drawLandNordicDepthBand,drawFront:drawLandNordicFront});
})();
const alpineLandMacroPack = (() => {
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

/* ===== ALPINE ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const ASH=(c,x,y,rx)=>{c.fillStyle='rgba(16,30,34,.28)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const AWOOD='#8a5a33',AWOOD_D='#4a2f1c',ASNOW='#f4f8fb',ASNOW_D='#d3e0ea';
const AROCKP=[['#6a7684','#8896a6','#4a5562'],['#707482','#8e92a2','#4e5260'],['#627080','#8294a8','#46525f']];
const ABOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.28),shade(col,0.12));
const AFLIP=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
const ACON=(c,x,y,u,o,r)=>{const h=u*o.h,w=u*o.w,n=o.tiers,bare=o.bare===undefined?0.16:o.bare;TH.ln(c,[x,y],[x,y-h*(bare+0.1)],'#4a3220',u*(o.tw||0.42));for(let i=0;i<n;i++){const t=i/n,ww=w*(1-0.8*t)*(0.92+r()*0.16),yb=y-h*(bare+(0.9-bare)*t),tip=yb-h*(o.layer||0.34),dy=yb-tip;TH.poly(c,[[x-ww,yb],[x-ww*0.55,yb-h*0.032],[x-ww*0.2,yb+h*0.012],[x+ww*0.25,yb-h*0.032],[x+ww*0.6,yb+h*0.01],[x+ww,yb],[x,tip]],o.c1);TH.poly(c,[[x,tip],[x+ww,yb],[x+ww*0.6,yb+h*0.01],[x+ww*0.25,yb-h*0.032],[x,yb]],o.c2);if(o.snow){TH.poly(c,[[x,tip],[x-ww*0.56,tip+dy*0.56],[x-ww*0.3,tip+dy*0.64],[x,tip+dy*0.5]],ASNOW);TH.poly(c,[[x,tip],[x,tip+dy*0.5],[x+ww*0.3,tip+dy*0.62],[x+ww*0.56,tip+dy*0.56]],ASNOW_D);}}};
const ATRI=(c,x,y,s,c1,c2)=>{TH.poly(c,[[x-s*0.55,y],[x,y-s*1.7],[x,y]],c1);TH.poly(c,[[x,y-s*1.7],[x+s*0.55,y],[x,y]],c2);};
const ABLOCK=(c,x,y,rx,ry,r,snow)=>{const pal=AROCKP[Math.floor(r()*3)];TH.poly(c,[[x-rx,y],[x-rx*0.8,y-ry*0.7],[x-rx*0.2,y-ry*1.05],[x+rx*0.5,y-ry*0.9],[x+rx,y-ry*0.2],[x+rx*0.8,y+ry*0.2],[x-rx*0.5,y+ry*0.25]],pal[0]);TH.poly(c,[[x+rx*0.3,y-ry*0.95],[x+rx,y-ry*0.2],[x+rx*0.8,y+ry*0.2],[x+rx*0.2,y+ry*0.1]],pal[2]);TH.poly(c,[[x-rx*0.8,y-ry*0.7],[x-rx*0.2,y-ry*1.05],[x+rx*0.2,y-ry*0.9],[x-rx*0.3,y-ry*0.5]],pal[1]);if(snow)TH.poly(c,[[x-rx*0.75,y-ry*0.68],[x-rx*0.2,y-ry*1.07],[x+rx*0.45,y-ry*0.92],[x+rx*0.6,y-ry*0.55],[x+rx*0.1,y-ry*0.62],[x-rx*0.35,y-ry*0.5]],ASNOW);};
const AFLAG=(c,x,y,u,s)=>{TH.ln(c,[x,y],[x,y-u*1.8*s],'#5a3a22',u*0.07*s);TH.poly(c,[[x,y-u*1.75*s],[x+u*0.9*s,y-u*1.65*s],[x+u*0.75*s,y-u*1.4*s],[x+u*0.9*s,y-u*1.15*s],[x,y-u*1.25*s]],'#c0392b');};
/* ---- alpine huts: one parametric body, 4 orientations (gable/eave front x mirror): chalet / alm hut / hay barn ---- */
const AHUT_T={
  chalet:{ha:1.25,hb:1.85,h1:1.4,h2:1.3,jet:0.15,lower:'#efe6d4',upper:'#7a4e2a',rise:1.15,ov:0.8,balcony:true,sw:3.3,sh:1.0},
  almHut:{ha:1.15,hb:1.6,h1:1.25,h2:0,jet:0,lower:'#9a9890',upper:'#9a9890',rise:1.1,ov:0.7,sw:3.0,sh:0.95,stone:true},
  hayBarn:{ha:1.3,hb:1.9,h1:1.5,h2:0,jet:0,lower:'#7a4e2a',upper:'#7a4e2a',rise:1.4,ov:0.75,sw:3.4,sh:1.0,barn:true}
};
function AHUT_BODY(c,x,y,u,s,eave,T){const r=mulberry(s*7+3),Iw=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),L=(a,b,z)=>eave?Iw(b,a,z):Iw(a,b,z),LBOX=(a0,a1,b0,b1,z0,z1,col)=>eave?ABOX(c,x,y,u,b0,b1,a0,a1,z0,z1,col):ABOX(c,x,y,u,a0,a1,b0,b1,z0,z1,col);
  const ha=T.ha,hb=T.hb,jet=T.jet||0,h1=T.h1,h2=T.h2||0,zw=h1+h2,rise=T.rise,ov=T.ov,zr=zw+rise,ha2=ha+jet,hb2=hb+jet,shut=['#b5362b','#2f7a4a','#2a5a9a','#b5362b'][s%4];
  const faces=(aa,bb)=>[{J:(a,z)=>L(a,bb+0.012,z),p0:-aa,p1:aa},{J:(b,z)=>L(aa+0.012,b,z),p0:-bb,p1:bb}];
  LBOX(-ha,ha,-hb,hb,0,h1,T.lower);if(h2)LBOX(-ha2,ha2,-hb2,hb2,h1,zw,T.upper);
  const F1=faces(ha,hb)[0],F2=faces(ha,hb)[1],G1=faces(ha2,hb2)[0],G2=faces(ha2,hb2)[1],doorF=eave?F2:F1,otherF=eave?F1:F2,doorG=eave?G2:G1,otherG=eave?G1:G2;
  const quad=(F,p0,p1,z0,z1,col,stroke)=>TH.poly(c,[F.J(p0,z0),F.J(p1,z0),F.J(p1,z1),F.J(p0,z1)],col,stroke,stroke?u*0.05:0);
  if(T.stone){[F1,F2].forEach(F=>{for(let row=0;row<4;row++){const z=0.1+row*0.3;for(let k=0;k<7;k++){const p=F.p0+0.05+k*0.42+(row%2)*0.2;TH.ln(c,F.J(p,z),F.J(Math.min(F.p1,p+0.38),z),'rgba(20,24,28,.38)',u*0.05);TH.ln(c,F.J(p,z),F.J(p,z+0.3),'rgba(20,24,28,.3)',u*0.05);}}});}
  else if(T.barn){[F1,F2].forEach(F=>{const n=Math.round((F.p1-F.p0)/0.3);for(let k=0;k<=n;k++){const p=F.p0+(F.p1-F.p0)*k/n;TH.ln(c,F.J(p,0),F.J(p,h1),'rgba(20,10,4,.4)',u*0.05);}});}
  else{[G1,G2].forEach(F=>{for(let k=0;k<10;k++){const p=F.p0+(F.p1-F.p0)*k/10;TH.ln(c,F.J(p,h1),F.J(p,zw),'rgba(20,10,4,.38)',u*0.05);}});[F1,F2].forEach(F=>{TH.ln(c,F.J(F.p0,0),F.J(F.p0,h1),AWOOD_D,u*0.1);TH.ln(c,F.J(F.p1,0),F.J(F.p1,h1),AWOOD_D,u*0.1);});}
  const win=(F,p,z0,w)=>{quad(F,p-w,p+w,z0,z0+0.55,'#ffe9a0','#f4f0e4');TH.ln(c,F.J(p,z0),F.J(p,z0+0.55),'#f4f0e4',u*0.04);quad(F,p-w-0.17,p-w,z0-0.02,z0+0.57,shut,'rgba(0,0,0,.2)');quad(F,p+w,p+w+0.17,z0-0.02,z0+0.57,shut,'rgba(0,0,0,.2)');quad(F,p-w-0.03,p+w+0.03,z0-0.18,z0-0.02,AWOOD);for(let k=0;k<4;k++){const q=F.J(p-w+0.03+k*(2*w-0.06)/3,z0-0.1);TH.blob(c,q[0],q[1]-u*0.06,u*0.11,u*0.09,k%2?'#d9367a':'#e03a2a',r,6);}};
  if(T.barn){const a=doorF;quad(a,-a.p1*0.72,a.p1*0.72,0.05,h1-0.15,'#2a1a10',AWOOD_D);for(let k=0;k<7;k++){const q=a.J(-a.p1*0.6+k*a.p1*0.2,0.45+(k%2)*0.3);TH.blob(c,q[0],q[1],u*0.38,u*0.26,['#e0c060','#d0aa48','#f0d478'][k%3],r,7);}[-a.p1*0.72,a.p1*0.72].forEach(p=>TH.ln(c,a.J(p,0),a.J(p,h1-0.1),AWOOD_D,u*0.18));win(otherF,0,0.7,0.25);}
  else{const dp=[doorF.J(-0.3,0),doorF.J(0.3,0),doorF.J(0.3,0.95),doorF.J(0,1.18),doorF.J(-0.3,0.95)];c.beginPath();dp.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle='#5a3a22';c.fill();c.strokeStyle='#2a1a10';c.lineWidth=u*0.08;c.stroke();TH.ell(c,...doorF.J(0.17,0.5),u*0.05,u*0.05,'#d8c060');const sp=doorF.p1*0.65;win(doorF,-sp,0.55,0.22);win(doorF,sp,0.55,0.22);win(otherF,-otherF.p1*0.4,0.55,0.22);win(otherF,otherF.p1*0.4,0.55,0.22);
    if(T.balcony){win(doorG,-doorG.p1*0.55,h1+0.3,0.22);win(doorG,0,h1+0.3,0.22);win(doorG,doorG.p1*0.55,h1+0.3,0.22);win(otherG,0,h1+0.3,0.22);const bz=h1,bw=(eave?hb2:ha2)*0.82,ext=0.55;if(eave)LBOX(ha2,ha2+ext,-bw,bw,bz-0.1,bz+0.05,AWOOD);else LBOX(-bw,bw,hb2,hb2+ext,bz-0.1,bz+0.05,AWOOD);const J=eave?(a,z)=>L(ha2+ext,a,z):(a,z)=>L(a,hb2+ext,z);for(let k=0;k<=9;k++){const p=-bw+2*bw*k/9;TH.ln(c,J(p,bz+0.05),J(p,bz+0.55),AWOOD_D,u*0.07);if(k%2===0){const q=J(p+bw/9,bz+0.35);TH.ell(c,q[0],q[1],u*0.07,u*0.12,'#c0392b');}}TH.ln(c,J(-bw,bz+0.55),J(bw,bz+0.55),AWOOD_D,u*0.09);for(let k=0;k<12;k++){const q=J(-bw+2*bw*(k+0.5)/12,bz+0.62);TH.blob(c,q[0],q[1]-u*0.05,u*0.15,u*0.12,k%3?'#e03a2a':'#f08aa0',r,6);}}}
  /* stone chimney, then the broad low roof weighed down with stones and covered in snow */
  LBOX(-ha*0.6,-ha*0.6+0.5,-hb*0.6,-hb*0.6+0.5,zw+0.2,zr+0.8,'#8d9098');{const cp=L(-ha*0.6+0.25,-hb*0.6+0.25,zr+0.9);TH.ell(c,cp[0],cp[1],u*0.3,u*0.14,ASNOW);c.fillStyle='rgba(240,240,246,.55)';for(let k=0;k<3;k++){c.beginPath();c.ellipse(cp[0]+k*u*0.14,cp[1]-u*(0.5+k*0.5),u*(0.3+k*0.1),u*0.2,0,0,7);c.fill();}}
  const rA=L(ha2+ov,-hb2-ov,zw),rB=L(ha2+ov,hb2+ov,zw),rC=L(0,hb2+ov,zr),rD=L(0,-hb2-ov,zr);TH.poly(c,[rA,rB,rC,rD],'#5a4332');
  const rows=Math.max(4,Math.round(rise/0.24));for(let k=1;k<rows;k++){const t=k/rows;TH.ln(c,L(ha2+ov-(ha2+ov)*t,-hb2-ov,zw+rise*t),L(ha2+ov-(ha2+ov)*t,hb2+ov,zw+rise*t),'rgba(10,6,2,.38)',u*0.05);}
  for(let k=0;k<12;k++){const t=0.15+r()*0.7,bb=-hb2-ov+(2*hb2+2*ov)*(k+0.5)/12,p=L((ha2+ov)*(1-t),bb,zw+rise*t);ABLOCK(c,p[0],p[1]+u*0.08,u*(0.2+r()*0.12),u*(0.14+r()*0.08),r,true);}
  const sn=[];for(let k=0;k<=14;k++){const bb=-hb2-ov+(2*hb2+2*ov)*k/14,t=0.5+0.18*Math.sin(k*1.7+s)+0.08*Math.sin(k*3.1);sn.push(L((ha2+ov)*(1-t),bb,zw+rise*t));}c.beginPath();c.moveTo(rD[0],rD[1]);sn.slice().reverse().forEach(p=>c.lineTo(p[0],p[1]));c.lineTo(rC[0],rC[1]);c.closePath();c.fillStyle=ASNOW;c.globalAlpha=0.96;c.fill();c.globalAlpha=1;c.strokeStyle=ASNOW_D;c.lineWidth=u*0.07;c.stroke();
  const gA=L(-ha2,hb2+0.02,zw),gB=L(ha2,hb2+0.02,zw),gC=L(0,hb2+0.02,zr-0.08);TH.poly(c,[gA,gB,gC],T.upper==='#9a9890'?'#a8a6a0':'#8a5a33');for(let k=-3;k<=3;k++)TH.ln(c,L(k*ha2/3.5,hb2+0.03,zw+0.02),L(k*ha2/3.5*0.35,hb2+0.03,zr-0.2),'rgba(30,16,8,.35)',u*0.05);const sp2=L(0,hb2+0.04,zw+rise*0.42);TH.ell(c,sp2[0],sp2[1],u*0.2,u*0.2,'#e8c84a');for(let k=0;k<8;k++){const a=k/8*6.283;TH.ln(c,sp2,[sp2[0]+Math.cos(a)*u*0.34,sp2[1]+Math.sin(a)*u*0.34],'#e8c84a',u*0.04);}
  TH.ln(c,L(-ha2-ov,hb2+ov,zw),L(0,hb2+ov,zr),AWOOD_D,u*0.12);TH.ln(c,L(ha2+ov,hb2+ov,zw),L(0,hb2+ov,zr),AWOOD_D,u*0.12);
  if(T.barn){const fp=L(0,hb2+ov-0.1,zr);AFLAG(c,fp[0],fp[1],u,0.0);}else{const fp=L(0,hb2+ov-0.1,zr);AFLAG(c,fp[0],fp[1],u,0.9);}}
const AHUT=(key)=>({cat:'struct',rho:0.13,draw(c,x,y,u,v){const T=AHUT_T[key],o=v&3,s=v>>2,eave=(o>>1)&1;c.fillStyle='rgba(16,30,34,.28)';c.beginPath();c.ellipse(x+u*0.8,y+u*0.2,u*T.sw*(eave?1.18:1),u*T.sh,0,0,7);c.fill();AFLIP(c,x,o&1,()=>AHUT_BODY(c,x,y,u,s,eave,T));}});
const ALPINE_ASSETS={
  /* ---------- trees: conifer-led, with golden larches and white birches ---------- */
  spruceA:{cat:'tree',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*13+1);ASH(c,x,y,u*1.3);ACON(c,x,y,u,{h:6.0+r()*1.5,w:1.2,tiers:8,c1:'#2c7550',c2:'#215c3f',layer:0.3},r);}},
  firA:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*17+4);ASH(c,x,y,u*1.8);ACON(c,x,y,u,{h:3.9+r()*0.9,w:1.75,tiers:5,c1:'#37875a',c2:'#276a46',layer:0.4,bare:0.1},r);}},
  pineA:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*11+2);ASH(c,x,y,u*1.6);ACON(c,x,y,u,{h:4.8+r()*1.3,w:1.45,tiers:6,c1:'#2a6c4a',c2:'#1f5439'},r);}},
  snowSpruceA:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*19+2);ASH(c,x,y,u*1.4);ACON(c,x,y,u,{h:5.2+r()*1.3,w:1.3,tiers:7,c1:'#2c7550',c2:'#215c3f',snow:true,layer:0.32},r);}},
  larch:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*23+1),gold=v%3===0;ASH(c,x,y,u*1.5);ACON(c,x,y,u,{h:5.0+r()*1.2,w:1.4,tiers:7,c1:gold?'#d4b440':'#8fbc58',c2:gold?'#b0942e':'#6f9c44',layer:0.33},r);}},
  youngSpruceA:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*29+3);ASH(c,x,y,u*1.2);ACON(c,x,y,u,{h:2.7+r()*0.9,w:1.1,tiers:4,c1:'#3f9060',c2:'#2c7650',layer:0.42,bare:0.08,tw:0.3},r);}},
  birchA:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*5+3),H=u*(4.2+r()*1.0),pal=v%3===0?['#e0c050','#d0a838','#e8d068','#c8a030']:['#a8c060','#90ae4c','#bcd070','#7a9a3c'];ASH(c,x,y,u*1.7);c.lineCap='round';c.strokeStyle='#ece8dc';c.lineWidth=u*0.46;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.12,y-H*0.4,x+u*0.05,y-H*0.7);c.stroke();for(let k=0;k<8;k++)TH.ln(c,[x-u*0.2,y-H*(0.06+k*0.08)],[x+u*0.1,y-H*(0.06+k*0.08)+u*0.05],'rgba(40,36,30,.55)',u*0.07);TH.ln(c,[x,y-H*0.55],[x-u*0.8,y-H*0.85],'#ece8dc',u*0.2);TH.ln(c,[x,y-H*0.6],[x+u*0.9,y-H*0.82],'#ece8dc',u*0.2);const cy=y-H*0.85;[[0,-0.5,1.3,1.0],[-1.0,-0.1,1.0,0.85],[1.0,-0.1,1.0,0.85],[-0.5,-1.15,1.0,0.8],[0.6,-1.1,1.0,0.8],[0,0.2,1.2,0.7]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,9));}},
  rowanA:{cat:'tree',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*23+1),H=u*(3.2+r()*0.6),pal=['#5f8a46','#6f9a52','#4f7a3c'];ASH(c,x,y,u*1.6);TH.ln(c,[x,y],[x,y-H*0.55],'#6a5a48',u*0.4);const cy=y-H*0.8;[[0,-0.2,1.4,0.95],[-1.0,0.1,0.95,0.75],[1.0,0.1,0.95,0.75],[0,-0.8,1.0,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%3],r,9));for(let k=0;k<11;k++)TH.ell(c,x+(r()-0.5)*u*2.2,cy+u*(-0.8+r()*1.5),u*0.1,u*0.1,'#d9433b');}},
  /* ---------- undergrowth ---------- */
  alpenrose:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+9);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(16,30,34,.22)');[[-0.55,-0.4,0.85,0.55],[0.55,-0.4,0.85,0.55],[0,-0.8,0.9,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#2f6a46','#3a7a52','#27593c'][i],r,8));for(let k=0;k<14;k++)TH.ell(c,x+(r()-0.5)*u*1.8,y-u*(0.3+r()*0.9),u*0.12,u*0.1,k%2?'#e8508a':'#f08aa8');}},
  gentian:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*7+2);TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.28,'rgba(16,30,34,.2)');for(let k=0;k<10;k++){const fx=x+(r()-0.5)*u*1.5,fy=y-r()*u*0.4;TH.ln(c,[fx,fy],[fx,fy-u*(0.4+r()*0.3)],'#4f8a4a',u*0.06);}for(let k=0;k<10;k++){const fx=x+(r()-0.5)*u*1.5,fy=y-u*(0.45+r()*0.6);for(let j=0;j<5;j++){const a=j/5*6.283;TH.ell(c,fx+Math.cos(a)*u*0.09,fy+Math.sin(a)*u*0.08,u*0.07,u*0.05,'#2a4ad0',a);}TH.ell(c,fx,fy,u*0.04,u*0.04,'#f6efe0');}}},
  edelweiss:{cat:'shrub',rho:0.04,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.2,y+u*0.08,u*0.8,u*0.24,'rgba(16,30,34,.2)');for(let k=0;k<5;k++){const fx=x+(k-2)*u*0.3+(r()-0.5)*u*0.1,fy=y-u*(0.5+r()*0.4);TH.ln(c,[fx,y],[fx,fy],'#8aa070',u*0.07);for(let j=0;j<8;j++){const a=j/8*6.283;TH.ell(c,fx+Math.cos(a)*u*0.12,fy+Math.sin(a)*u*0.1,u*0.08,u*0.05,'#f4f2ea',a);}TH.ell(c,fx,fy,u*0.07,u*0.07,'#e8d870');}}},
  krummholz:{cat:'shrub',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*11+3);TH.ell(c,x+u*0.3,y+u*0.1,u*1.5,u*0.4,'rgba(16,30,34,.24)');for(let k=0;k<6;k++){const a=-Math.PI+k/5*Math.PI,l=u*(1.0+r()*0.7);TH.poly(c,[[x,y-u*0.1],[x+Math.cos(a-0.25)*l*0.6,y-u*0.1+Math.sin(a-0.25)*l*0.45],[x+Math.cos(a)*l,y-u*0.1+Math.sin(a)*l*0.5],[x+Math.cos(a+0.25)*l*0.6,y-u*0.1+Math.sin(a+0.25)*l*0.45]],k%2?'#27593c':'#1f4a32');}for(let k=0;k<3;k++)TH.poly(c,[[x-u*0.5+k*u*0.5,y-u*0.55],[x-u*0.25+k*u*0.5,y-u*0.75],[x+k*u*0.5,y-u*0.55]],ASNOW);}},
  grassA:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);for(let k=0;k<13;k++){const a=-1.1+k/12*2.2+(r()-0.5)*0.2,l=u*(0.7+r()*0.8);TH.ln(c,[x+(r()-0.5)*u*0.6,y],[x+Math.sin(a)*l*0.8+(r()-0.5)*u*0.3,y-l],['#7aaa62','#6a9a54','#8cba72'][k%3],u*0.09);}}},
  fernA:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(16,30,34,.2)');for(let k=0;k<9;k++){const a=-Math.PI+0.15+k/8*(Math.PI-0.3),len=u*(1.1+r()*0.45),ex=x+Math.cos(a)*len,ey=y-u*0.1+Math.sin(a)*len*0.6+len*0.4;c.lineCap='round';c.strokeStyle=k%2?'#4a8a52':'#3a7a46';c.lineWidth=u*0.4;c.beginPath();c.moveTo(x,y-u*0.1);c.quadraticCurveTo(x+Math.cos(a)*len*0.55,y-u*0.1+Math.sin(a)*len*0.7-len*0.25,ex,ey);c.stroke();}}},
  /* ---------- snowy mountains, snowy hills, boulders ---------- */
  alpPeak:{cat:'rock',rho:0.2,draw(c,x,y,u,v){const r=mulberry(v*9+2),H=u*(9.4+r()*2.2),w=u*(4.2+r()*0.8);TH.ell(c,x+u*1.2,y+u*0.3,w*1.3,u*0.8,'rgba(16,30,34,.28)');
    const sx=(r()-0.5)*w*0.18,pts=[[-w*1.3,0],[-w*1.0,-H*0.18],[-w*0.72,-H*0.4],[-w*0.5,-H*0.38],[-w*0.3,-H*0.66],[-w*0.12,-H*0.7],[sx,-H],[w*0.18,-H*0.7],[w*0.38,-H*0.74],[w*0.6,-H*0.42],[w*0.85,-H*0.34],[w*1.05,-H*0.16],[w*1.3,0]];
    c.save();c.translate(x,y);c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle='#7c8a9c';c.fill();c.clip();
    TH.poly(c,[[-w*1.4,0],[sx,0],[sx,-H]],'#8f9fb2');TH.poly(c,[[sx,-H],[w*1.4,0],[sx+w*0.05,0]],'#4c586a');
    /* facets */
    for(let k=0;k<7;k++){const bx=sx+(r()*2-1)*w*0.9,by=-H*(0.25+r()*0.6);TH.poly(c,[[bx,by],[bx-w*0.2,by+H*0.2],[bx+w*0.14,by+H*0.22]],r()<0.5?'rgba(40,52,70,.32)':'rgba(225,235,246,.3)');}
    /* snow: a big cap with a jagged lower edge, plus a glacier tongue down the shaded side */
    const sl=[];const sn=12;for(let i=0;i<=sn;i++)sl.push([-w*1.4+i/sn*w*2.8,-H*(0.5+(r()-0.5)*0.12)]);c.beginPath();c.moveTo(-w*1.4,-H*1.1);sl.forEach(p=>c.lineTo(p[0],p[1]));c.lineTo(w*1.4,-H*1.1);c.closePath();c.save();c.clip();c.fillStyle=ASNOW;c.fillRect(-w*1.5,-H*1.2,sx+w*1.5,H*1.3);c.fillStyle=ASNOW_D;c.fillRect(sx,-H*1.2,w*1.6,H*1.3);c.restore();
    TH.poly(c,[[sx+w*0.12,-H*0.52],[sx+w*0.34,-H*0.5],[sx+w*0.3,-H*0.22],[sx+w*0.2,-H*0.1],[sx+w*0.1,-H*0.26]],'#c4dcec');
    for(let k=0;k<5;k++){const bx=sx+(r()*2-1)*w*0.6;TH.ln(c,[bx,-H*(0.9-r()*0.2)],[bx+(r()-0.5)*w*0.12,-H*(0.6+r()*0.05)],'rgba(110,130,152,.45)',u*0.08);}
    for(let k=0;k<44;k++){const t=Math.pow(r(),0.7),yy=-H*0.02-t*H*0.3,span=w*(1.3-t*0.4),xx=(r()*2-1)*span;ATRI(c,xx,yy,u*(0.5+r()*0.35),k%2?'#2c7550':'#235f42',k%2?'#215c3f':'#194a33');}
    const g=c.createLinearGradient(0,-H*0.4,0,0);g.addColorStop(0,'rgba(225,238,245,0)');g.addColorStop(1,'rgba(215,232,242,.3)');c.fillStyle=g;c.fillRect(-w*1.4,-H*0.4,w*2.8,H*0.4);c.restore();}},
  snowHill:{cat:'rock',rho:0.2,draw(c,x,y,u,v){const r=mulberry(v*7+8),H=u*(4.4+r()*1.6),w=u*(3.6+r()*0.9);TH.ell(c,x+u*0.8,y+u*0.25,w*1.3,u*0.7,'rgba(16,30,34,.24)');
    c.save();c.translate(x,y);c.beginPath();c.moveTo(-w*1.35,0);c.bezierCurveTo(-w*1.1,-H*0.85,-w*0.45,-H*1.1,0,-H);c.bezierCurveTo(w*0.45,-H*1.05,w*1.1,-H*0.8,w*1.35,0);c.closePath();c.fillStyle='#78947a';c.fill();c.clip();
    const g=c.createLinearGradient(-w*1.3,0,w*1.3,0);g.addColorStop(0,'rgba(210,235,200,.2)');g.addColorStop(0.5,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,30,34,.42)');c.fillStyle=g;c.fillRect(-w*1.4,-H*1.2,w*2.8,H*1.3);
    c.fillStyle=ASNOW;c.beginPath();c.moveTo(-w*0.5,-H*0.82);c.bezierCurveTo(-w*0.3,-H*1.08,w*0.3,-H*1.08,w*0.55,-H*0.8);c.bezierCurveTo(w*0.35,-H*0.68,w*0.1,-H*0.75,-w*0.1,-H*0.66);c.bezierCurveTo(-w*0.3,-H*0.78,-w*0.4,-H*0.7,-w*0.5,-H*0.82);c.fill();
    for(let k=0;k<4;k++){const bx=(r()*2-1)*w*0.8,by=-H*(0.15+r()*0.6);ABLOCK(c,bx,by,u*(0.4+r()*0.4),u*(0.3+r()*0.3),r,true);}
    const trees=[];for(let k=0;k<26;k++){const t=Math.pow(r(),0.85),yy=-H*(0.03+t*0.8),span=w*(1.3-Math.pow(t,1.4)*1.05);trees.push([(r()*2-1)*span,yy,u*(0.45+r()*0.3),k%2]);}trees.sort((a,b)=>a[1]-b[1]).forEach(([tx,ty,s,k])=>ATRI(c,tx,ty,s,k?'#2c7550':'#235f42',k?'#215c3f':'#194a33'));c.restore();}},
  snowBoulders:{cat:'rock',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.8],[0.7,0.2,0.8,0.7],[0,-0.35,0.7,0.6]].forEach(([dx,dy,rx,ry])=>{const px=x+dx*u,py=y+dy*u;TH.ell(c,px+rx*u*0.15,py+ry*u*0.3,rx*u*1.05,ry*u*0.45,'rgba(16,30,34,.26)');ABLOCK(c,px,py,u*rx,u*ry*(1+r()*0.2),r,r()<0.7);});}},
  /* ---------- alpine huts ---------- */
  chalet:AHUT('chalet'),almHut:AHUT('almHut'),hayBarn:AHUT('hayBarn'),
  /* ---------- the one tower: a small alpine chapel with a shingled spire ---------- */
  alpChapel:{cat:'struct',rho:0.1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);c.fillStyle='rgba(16,30,34,.28)';c.beginPath();c.ellipse(x+u*0.9,y+u*0.2,u*3.0,u*0.95,0,0,7);c.fill();AFLIP(c,x,v&1,()=>{
      ABOX(c,x,y,u,-2.1,0.9,-0.95,0.95,0,1.8,'#f2ece0');for(let k=0;k<3;k++){const X=-1.6+k*0.85,pts=[I(X-0.2,0.96,0.6),I(X+0.2,0.96,0.6),I(X+0.2,0.96,1.2),I(X,0.96,1.45),I(X-0.2,0.96,1.2)];TH.poly(c,pts,'#86a8d0','#f4f0e4',u*0.05);}
      TH.poly(c,[I(-2.3,1.15,1.8),I(0.95,1.15,1.8),I(0.95,0,2.9),I(-2.3,0,2.9)],'#7a4a30');for(let k=1;k<5;k++)TH.ln(c,I(-2.3,1.15-0.23*k,1.8+0.22*k),I(0.95,1.15-0.23*k,1.8+0.22*k),'rgba(10,6,2,.35)',u*0.05);
      const sn=[];for(let k=0;k<=10;k++){const X=-2.3+3.25*k/10,t=0.55+0.15*Math.sin(k*1.6);sn.push(I(X,1.15*(1-t),1.8+1.1*t));}c.beginPath();c.moveTo(I(-2.3,0,2.9)[0],I(-2.3,0,2.9)[1]);sn.forEach(p=>c.lineTo(p[0],p[1]));c.lineTo(I(0.95,0,2.9)[0],I(0.95,0,2.9)[1]);c.closePath();c.fillStyle=ASNOW;c.fill();
      ABOX(c,x,y,u,0.9,2.2,-0.7,0.7,0,3.4,'#f2ece0');TH.poly(c,[I(1.4,0.71,0),I(1.8,0.71,0),I(1.8,0.71,1.1),I(1.6,0.71,1.3),I(1.4,0.71,1.1)],'#5a3a22');
      ABOX(c,x,y,u,0.8,2.3,-0.8,0.8,3.4,3.55,'#8a5a33');ABOX(c,x,y,u,1.0,2.1,-0.6,0.6,3.55,4.6,'#f2ece0');[1.35,1.75].forEach(X=>{const pts=[I(X-0.2,0.61,3.65),I(X+0.2,0.61,3.65),I(X+0.2,0.61,4.1),I(X,0.61,4.35),I(X-0.2,0.61,4.1)];TH.poly(c,pts,'#2a2a30');});
      const b=I(1.55,0,4.6),t=I(1.55,0,9.2);TH.poly(c,[[b[0]-u*1.3,b[1]+u*0.1],[b[0]+u*1.3,b[1]+u*0.1],[t[0],t[1]]],'#6a4a38');TH.poly(c,[[b[0]+u*0.05,b[1]+u*0.1],[b[0]+u*1.3,b[1]+u*0.1],[t[0],t[1]]],'#4a3226');for(let k=1;k<7;k++){const f=k/7;TH.ln(c,[b[0]-u*1.25*(1-f),b[1]+u*0.05-(b[1]-t[1])*f],[b[0]+u*1.25*(1-f),b[1]+u*0.05-(b[1]-t[1])*f],'rgba(10,6,2,.32)',u*0.05);}
      TH.poly(c,[[b[0]-u*1.3,b[1]+u*0.1],[b[0]-u*0.4,b[1]-(b[1]-t[1])*0.28],[b[0]+u*0.4,b[1]-(b[1]-t[1])*0.26],[b[0]+u*1.3,b[1]+u*0.1]].slice(0,0),ASNOW);TH.ln(c,[t[0],t[1]],[t[0],t[1]-u*1.1],'#e8c84a',u*0.1);TH.ln(c,[t[0]-u*0.3,t[1]-u*0.65],[t[0]+u*0.3,t[1]-u*0.65],'#e8c84a',u*0.1);const cf=I(1.55,0.61,2.5);c.fillStyle='#fff';c.beginPath();c.ellipse(cf[0],cf[1],u*0.4,u*0.45,0,0,7);c.fill();c.strokeStyle='#2a2a30';c.lineWidth=u*0.07;c.stroke();TH.ln(c,cf,[cf[0],cf[1]-u*0.28],'#2a2a30',u*0.06);TH.ln(c,cf,[cf[0]+u*0.2,cf[1]],'#2a2a30',u*0.06);});}},
  /* ---------- alpine pieces ---------- */
  cows:{cat:'ruin',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*5+9);const cow=(cx,cy,s,graze,flip,kind)=>{c.save();c.translate(cx,cy);c.scale(flip*s,s);TH.ell(c,u*0.3,u*0.12,u*1.5,u*0.4,'rgba(16,30,34,.26)');
      [[-0.9,0.0],[-0.5,0.2],[0.6,0.0],[0.95,0.2]].forEach(([lx,ly])=>TH.ln(c,[lx*u,-u*0.7],[lx*u,u*ly],kind?'#e8e0d4':'#f0ece4',u*0.18));c.fillStyle=kind?'#f0ece4':'#f6f2ea';c.beginPath();c.ellipse(0,-u*1.0,u*1.3,u*0.72,0,0,7);c.fill();c.fillStyle=kind?'#4a3228':'#1a1a1e';for(let k=0;k<3;k++){c.beginPath();c.ellipse(-u*0.7+k*u*0.6+(r()-0.5)*u*0.2,-u*(1.15-(k%2)*0.35),u*(0.3+r()*0.2),u*(0.22+r()*0.12),0,0,7);c.fill();}
      TH.ell(c,-u*0.3,-u*0.38,u*0.3,u*0.2,'#e8a0a0');const hx=u*1.35,hy=graze?-u*0.45:-u*1.5;c.fillStyle=kind?'#f0ece4':'#f6f2ea';c.beginPath();c.ellipse(hx,hy,u*0.5,u*0.38,graze?0.5:0.1,0,7);c.fill();TH.ell(c,hx+u*0.3,hy+u*0.12,u*0.24,u*0.2,'#e8b0a8');TH.ell(c,hx-u*0.05,hy-u*0.12,u*0.05,u*0.05,'#1a1a1e');TH.ln(c,[hx-u*0.15,hy-u*0.3],[hx-u*0.25,hy-u*0.5],'#c8b890',u*0.08);TH.ln(c,[u*1.05,-u*1.3],[hx-u*0.1,hy],kind?'#e8e0d4':'#f0ece4',u*0.4);
      TH.ell(c,u*1.15,-u*0.95,u*0.1,u*0.13,'#e8c84a');TH.ln(c,[-u*1.25,-u*1.2],[-u*1.55,-u*0.5],'#8a8a90',u*0.09);c.restore();};
      cow(x-u*0.9,y+u*0.1,1.0,true,1,0);cow(x+u*1.0,y-u*0.15,0.88,false,-1,1);}},
  goats:{cat:'ruin',rho:0.05,draw(c,x,y,u,v){const goat=(cx,cy,s,flip)=>{c.save();c.translate(cx,cy);c.scale(flip*s,s);TH.ell(c,u*0.2,u*0.1,u*0.9,u*0.26,'rgba(16,30,34,.26)');[[-0.5,0],[-0.2,0.1],[0.35,0],[0.6,0.1]].forEach(([lx,ly])=>TH.ln(c,[lx*u,-u*0.45],[lx*u,u*ly],'#e8e4da',u*0.1));c.fillStyle='#f2eee4';c.beginPath();c.ellipse(0,-u*0.7,u*0.85,u*0.42,0,0,7);c.fill();c.beginPath();c.ellipse(u*0.95,-u*1.0,u*0.3,u*0.25,0.2,0,7);c.fill();TH.poly(c,[[u*0.85,-u*0.75],[u*1.15,-u*0.8],[u*1.05,-u*0.45]],'#eae6dc');TH.ln(c,[u*0.85,-u*1.2],[u*0.55,-u*1.7],'#8a7a60',u*0.07);TH.ln(c,[u*1.0,-u*1.2],[u*0.8,-u*1.75],'#8a7a60',u*0.07);TH.ell(c,u*1.05,-u*1.0,u*0.04,u*0.04,'#1a1a1e');TH.ln(c,[-u*0.8,-u*0.85],[-u*0.95,-u*1.1],'#e8e4da',u*0.1);c.restore();};goat(x-u*0.6,y+u*0.1,1.0,1);goat(x+u*0.7,y-u*0.1,0.8,-1);}},
  wayShrine:{cat:'ruin',rho:0.04,draw(c,x,y,u,v){const r=mulberry(v*5+9);AFLIP(c,x,v&1,()=>{ASH(c,x,y,u*1.0);TH.ln(c,[x,y],[x,y-u*3.4],AWOOD_D,u*0.34);TH.poly(c,[[x-u*0.7,y-u*3.0],[x+u*0.7,y-u*3.0],[x+u*0.7,y-u*2.1],[x-u*0.7,y-u*2.1]],'#d8c8a8',AWOOD_D,u*0.07);TH.ln(c,[x,y-u*2.95],[x,y-u*2.2],'#6a4a30',u*0.1);TH.ln(c,[x-u*0.3,y-u*2.7],[x+u*0.3,y-u*2.7],'#6a4a30',u*0.1);TH.poly(c,[[x-u*1.0,y-u*3.0],[x+u*1.0,y-u*3.0],[x,y-u*3.9]],'#8a5a3a');TH.poly(c,[[x-u*0.95,y-u*3.02],[x+u*0.95,y-u*3.02],[x+u*0.5,y-u*3.5],[x-u*0.5,y-u*3.5]].slice(0,0),ASNOW);TH.poly(c,[[x-u*0.55,y-u*3.55],[x+u*0.55,y-u*3.55],[x,y-u*3.88]],ASNOW);for(let k=0;k<5;k++)TH.blob(c,x+(k-2)*u*0.28,y+u*0.02,u*0.18,u*0.14,['#d9433b','#f6efe0','#f2c230','#f08aa0','#6a8ae8'][k],r,6);const g=c.createRadialGradient(x,y-u*0.3,0,x,y-u*0.3,u*1.2);g.addColorStop(0,'rgba(255,200,110,.5)');g.addColorStop(1,'rgba(255,200,110,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*0.3,u*1.2,0,7);c.fill();TH.ell(c,x,y-u*0.3,u*0.12,u*0.16,'#ffd870');});}},
  logShed:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);AFLIP(c,x,v&1,()=>{ASH(c,x,y,u*2.2);ABOX(c,x,y,u,-1.4,1.4,-0.9,0.9,0,0.1,'#8a7a60');TH.poly(c,[I(-1.4,-0.9,0.1),I(1.4,-0.9,0.1),I(1.4,-0.9,1.8),I(-1.4,-0.9,1.8)],'#4a3220');
      for(let row=0;row<4;row++)for(let k=0;k<9;k++){const X=-1.25+k*0.31+(row%2)*0.12,Z=0.28+row*0.32,p=I(X,-0.88,Z);TH.ell(c,p[0],p[1],u*0.15,u*0.14,k%2?'#c9a066':'#b98a55');TH.ell(c,p[0],p[1],u*0.07,u*0.06,'#8a5a33');}
      [-1.4,1.4].forEach(X=>[-0.9,0.9].forEach(Y=>TH.ln(c,I(X,Y,0.1),I(X,Y,1.9),AWOOD_D,u*0.16)));TH.poly(c,[I(-1.7,1.2,1.7),I(1.7,1.2,1.7),I(1.7,-1.2,2.5),I(-1.7,-1.2,2.5)],'#5a4332');for(let k=0;k<6;k++)ABLOCK(c,I(-1.4+k*0.55,0.6-k*0.0,2.0)[0],I(-1.4+k*0.55,0.6,2.0)[1]+u*0.1,u*0.26,u*0.18,mulberry(k+v),true);TH.poly(c,[I(-1.7,1.2,1.7),I(1.7,1.2,1.7),I(1.7,-0.2,2.3),I(-1.7,-0.2,2.3)].slice(0,0),ASNOW);const sn=[];for(let k=0;k<=8;k++){const X=-1.7+3.4*k/8,t=0.5+0.18*Math.sin(k*1.9);sn.push(I(X,1.2-2.4*t,1.7+0.8*t));}c.beginPath();c.moveTo(I(-1.7,-1.2,2.5)[0],I(-1.7,-1.2,2.5)[1]);sn.forEach(p=>c.lineTo(p[0],p[1]));c.lineTo(I(1.7,-1.2,2.5)[0],I(1.7,-1.2,2.5)[1]);c.closePath();c.fillStyle=ASNOW;c.globalAlpha=0.95;c.fill();c.globalAlpha=1;});}},
  trough:{cat:'ruin',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);AFLIP(c,x,v&1,()=>{ASH(c,x,y,u*2.0);TH.ln(c,I(-1.5,0,0),I(-1.5,0,2.0),AWOOD_D,u*0.22);TH.ln(c,I(-1.5,0,2.0),I(-0.4,0,2.0),AWOOD,u*0.3);TH.poly(c,[[...I(-0.4,0,2.0)],[...I(-0.4,0,2.0)].map((q,i)=>q+(i?u*0.15:0)),[...I(-0.4,0,1.2)].map((q,i)=>q+(i?0:0))].slice(0,0),'#8ad0e8');TH.ln(c,I(-0.5,0,1.95),I(-0.5,0,1.1),'rgba(180,225,245,.8)',u*0.1);
      ABOX(c,x,y,u,-0.6,1.7,-0.5,0.5,0.1,0.9,'#7a5230');TH.poly(c,[I(-0.5,-0.4,0.9),I(1.6,-0.4,0.9),I(1.6,0.4,0.9),I(-0.5,0.4,0.9)],'#6ab4d0');TH.poly(c,[I(-0.4,-0.3,0.92),I(0.8,-0.3,0.92),I(0.8,0.3,0.92),I(-0.4,0.3,0.92)],'rgba(220,245,255,.4)');ABLOCK(c,I(1.9,0.9,0.2)[0],I(1.9,0.9,0.2)[1],u*0.5,u*0.35,mulberry(v),true);});}},
  cairn:{cat:'ruin',rho:0.04,draw(c,x,y,u,v){const r=mulberry(v*7+3);ASH(c,x,y,u*1.2);const st=[[0,0,1.0,0.5],[0.05,-0.5,0.8,0.42],[-0.05,-0.95,0.62,0.36],[0.02,-1.3,0.45,0.3],[0,-1.6,0.3,0.24]];st.forEach(([dx,dy,rx,ry],i)=>ABLOCK(c,x+dx*u,y+dy*u,u*rx,u*ry,r,i>=3));TH.ln(c,[x,y-u*1.7],[x,y-u*2.6],'#8a5a33',u*0.08);TH.poly(c,[[x,y-u*2.6],[x+u*0.7,y-u*2.45],[x,y-u*2.25]],'#c0392b');}},
  /* ---------- small props (lower tiers only) ---------- */
  pennants:{cat:'prop',rho:0.12,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*2.4,u*0.4,'rgba(16,30,34,.14)');[-2.2,2.2].forEach(X=>TH.ln(c,I(X,0,0),I(X,0,3.4),'#6a4a2a',u*0.18));const cols=['#c0392b','#f4f0e4','#2f7a4a','#e8c84a','#2a5a9a'];let prev=null;for(let k=0;k<=12;k++){const X=-2.2+4.4*k/12,p=I(X,0,3.3-Math.sin(k/12*Math.PI)*0.7);if(prev)TH.ln(c,prev,p,'#d9d4c2',u*0.04);prev=p;if(k<12){const q=I(X+0.18,0,3.3-Math.sin((k+0.5)/12*Math.PI)*0.7);TH.poly(c,[[q[0]-u*0.2,q[1]],[q[0]+u*0.2,q[1]],[q[0],q[1]+u*0.55]],cols[k%5],'rgba(0,0,0,.15)',u*0.03);}}}},
  lanternA:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(16,30,34,.26)');TH.ln(c,[x,y],[x,y-u*3.0],AWOOD_D,u*0.2);TH.ln(c,[x,y-u*2.85],[x+u*0.55,y-u*2.85],AWOOD_D,u*0.12);const lx=x+u*0.55,ly=y-u*2.8,g=c.createRadialGradient(lx,ly-u*0.3,0,lx,ly-u*0.3,u*1.5);g.addColorStop(0,'rgba(255,215,130,.5)');g.addColorStop(1,'rgba(255,215,130,0)');c.fillStyle=g;c.beginPath();c.arc(lx,ly-u*0.3,u*1.5,0,7);c.fill();TH.poly(c,[[lx-u*0.25,ly],[lx+u*0.25,ly],[lx+u*0.2,ly-u*0.6],[lx-u*0.2,ly-u*0.6]],'#ffe9a8','#2a2d36',u*0.06);TH.poly(c,[[lx-u*0.3,ly-u*0.6],[lx+u*0.3,ly-u*0.6],[lx,ly-u*0.95]],'#2a2d36');TH.poly(c,[[lx-u*0.26,ly-u*0.62],[lx+u*0.26,ly-u*0.62],[lx,ly-u*0.82]],ASNOW);}},
  zigzagFence:{cat:'prop',rho:0.09,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.3,y+u*0.1,u*2.0,u*0.35,'rgba(16,30,34,.18)');for(let k=0;k<4;k++){const X=-1.8+k*1.2;TH.ln(c,I(X,0,0),I(X,0,1.3),AWOOD_D,u*0.2);}[0.45,0.95].forEach(z=>TH.ln(c,I(-1.8,0,z),I(1.8,0,z),'#a67a48',u*0.15));for(let k=0;k<3;k++){const p=I(-1.2+k*1.2,0,1.33);TH.ell(c,p[0],p[1],u*0.36,u*0.12,ASNOW);}}},
  milkCans:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*1.2,u*0.3,'rgba(16,30,34,.26)');[[-0.55,0,1.0],[0.05,0.12,1.12],[0.6,0,0.95]].forEach(([dx,dy,s],i)=>{const px=x+dx*u,py=y+dy*u,w=u*0.34*s,h=u*1.3*s;const g=c.createLinearGradient(px-w,0,px+w,0);g.addColorStop(0,'#e8ecf0');g.addColorStop(1,'#8a949e');c.fillStyle=g;c.beginPath();c.moveTo(px-w,py);c.lineTo(px-w*0.8,py-h*0.75);c.lineTo(px-w*0.45,py-h*0.88);c.lineTo(px+w*0.45,py-h*0.88);c.lineTo(px+w*0.8,py-h*0.75);c.lineTo(px+w,py);c.ellipse(px,py,w,w*0.3,0,0,Math.PI);c.closePath();c.fill();TH.ln(c,[px-w*0.9,py-h*0.3],[px+w*0.9,py-h*0.3],'#c0392b',u*0.1);TH.ell(c,px,py-h*0.9,w*0.5,w*0.18,'#454c58');});}},
  firewood:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.6,u*0.45,'rgba(16,30,34,.24)');TH.box(c,x,y,u,-1.0,1.0,-0.6,0.6,0,1.1,'#6a4428','#4a2f1c','#84583a');for(let row=0;row<3;row++)for(let k=0;k<6;k++){const X=-0.85+k*0.34,Z=0.18+row*0.34;TH.ell(c,...I(X+0.15,0.61,Z),u*0.15,u*0.12,k%2?'#c9a066':'#b98a55');TH.ell(c,...I(X+0.15,0.61,Z),u*0.07,u*0.06,'#8a5a33');}TH.poly(c,[I(-1.05,-0.65,1.1),I(1.05,-0.65,1.1),I(1.05,0.65,1.1),I(-1.05,0.65,1.1)],ASNOW);}},
  hayBaleA:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.3,u*0.4,'rgba(16,30,34,.22)');TH.box(c,x,y,u,-0.9,0.1,-0.6,0.6,0,0.9,'#e0c26a','#b89a45','#f0d77a');TH.box(c,x,y,u,0.2,1.2,-0.6,0.6,0,0.9,'#e0c26a','#b89a45','#f0d77a');TH.box(c,x,y,u,-0.4,0.7,-0.5,0.5,0.9,1.8,'#e0c26a','#b89a45','#f0d77a');[-0.4,0.4].forEach(X=>TH.ln(c,I(X,0.61,0.9),I(X,0.61,1.7),'#8a7030',u*0.05));TH.poly(c,[I(-0.4,-0.5,1.8),I(0.7,-0.5,1.8),I(0.7,0.5,1.8),I(-0.4,0.5,1.8)],ASNOW);}},
  trailSign:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.26,'rgba(16,30,34,.26)');TH.ln(c,[x,y],[x,y-u*3.0],AWOOD_D,u*0.24);[[-1,-2.6,'#e8c84a'],[1,-1.9,'#e8c84a']].forEach(([d,h,col])=>{TH.poly(c,[[x,y+h*u-u*0.3],[x+d*u*1.4,y+h*u-u*0.3],[x+d*u*1.8,y+h*u],[x+d*u*1.4,y+h*u+u*0.3],[x,y+h*u+u*0.3]],col,AWOOD_D,u*0.05);TH.ln(c,[x+d*u*0.25,y+h*u],[x+d*u*1.1,y+h*u],'#8a1a10',u*0.07);});TH.poly(c,[[x-u*0.3,y-u*3.0],[x+u*0.3,y-u*3.0],[x,y-u*3.35]],ASNOW);}}
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

/* ===== ALPINE LAND: planner (Frontier-style dense conifer forest, snowy mountains spread around the rim, alpine chalets / alm huts / hay barns, cows and goats; ground identical to the Nordic land so they blend) ===== */
const ALPINE_REGION={top:{spruceA:.28,firA:.1,pineA:.14,snowSpruceA:.08,larch:.14,youngSpruceA:.08,birchA:.1,rowanA:.08},mid:{spruceA:.3,firA:.12,pineA:.14,larch:.16,youngSpruceA:.1,birchA:.1,rowanA:.08},bottom:{spruceA:.22,firA:.12,pineA:.12,larch:.14,youngSpruceA:.16,birchA:.12,rowanA:.12}};
const ALPINE_LOW=[['youngSpruceA',1],['rowanA',0.7],['birchA',0.6],['firA',0.62],['youngSpruceA',1.25],['larch',0.6],['pineA',0.55]];
const ALPINE_CAP={snowSpruceA:10,larch:22};
const ALPINE_UNDER=['alpenrose','gentian','edelweiss','krummholz','grassA','fernA','alpenrose','gentian','snowBoulders'];
const ALPINE_PLAN_CACHE={};
function getAlpinePlan(shape){
  if(ALPINE_PLAN_CACHE[shape])return ALPINE_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(shape==='A'?7301:8402),placed=[],bb=G.bbox,used={},A=ALPINE_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.66);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'spruceA';};
  const capOk=k=>!(ALPINE_CAP[k]&&(used[k]||0)>=ALPINE_CAP[k]);
  const regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?ALPINE_REGION.top:n<0.68?ALPINE_REGION.mid:ALPINE_REGION.bottom;};
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='tree'?0.88+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;if((D.cat==='tree'||D.cat==='shrub'||D.cat==='prop'||(D.cat==='rock'&&!extra))&&placed.some(o=>o.noSouth&&Math.abs(px-o.x)<0.3&&py-o.y>-0.05&&py-o.y<0.36))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const tree=(x,y,extra,dom,low)=>{if(low){const L=ALPINE_LOW[Math.floor(rng()*ALPINE_LOW.length)];return place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return place(dom&&rng()<0.55&&capOk(dom)?dom:pickFrom(regionOf(y),capOk),x,y,extra||{});};
  const spike=(x,y,extra)=>rng()<0.45?place('snowBoulders',x,y,Object.assign({scale:0.9+rng()*0.4},extra||{})):null;
  const under=(x,y,extra)=>place(ALPINE_UNDER[Math.floor(rng()*ALPINE_UNDER.length)],x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1b. snowy mountains spread around the rim, NOT stacked along the back (two modest peaks at the top, one on each side), snowy hills on the lower sides and corners */
  {const sideL=sides.filter(e=>e.mid[0]<cx).sort((a,b)=>a.mid[0]-b.mid[0]),sideR=sides.filter(e=>e.mid[0]>=cx).sort((a,b)=>b.mid[0]-a.mid[0]),bots=outer.filter(e=>e.cls==='bottom').sort((a,b)=>a.mid[0]-b.mid[0]),topS=top.slice().sort((a,b)=>a.mid[0]-b.mid[0]);
    const at=(e,t,off,kind,extra)=>{if(!e)return null;const p=onEdge(e,t,off);return place(kind,p[0],p[1],Object.assign({fixed:true},extra));};
    at(topS[Math.floor(topS.length*0.28)],0.5,0.0,'alpPeak',{minT:2,scale:1.0,clear:1.6});at(topS[Math.floor(topS.length*0.82)],0.5,0.0,'alpPeak',{minT:3,scale:0.78,clear:1.6});
    at(sideL[0],0.5,0.05,'alpPeak',{minT:3,scale:0.95,clear:1.6});at(sideR[0],0.5,0.05,'alpPeak',{minT:4,scale:0.95,clear:1.6});
    if(sideL.length>1)at(sideL[sideL.length-1],0.5,0.05,'snowHill',{minT:1,scale:0.9,clear:1.5});if(sideR.length>1)at(sideR[sideR.length-1],0.5,0.05,'snowHill',{minT:2,scale:0.9,clear:1.5});
    if(bots.length){at(bots[0],0.3,0.05,'snowHill',{minT:2,scale:0.7,clear:1.4});at(bots[bots.length-1],0.7,0.05,'snowHill',{minT:3,scale:0.7,clear:1.4});}}
  /* 2. alpine huts: 4 on the rim (spread by farthest-point), 4 through the middle, then ONE small chapel beside a hut */
  const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.filter(e=>e.vertical).forEach(e=>inn.push([e.mid[0],e.mid[1]]));
  const chosen=placed.filter(o=>o.cat==='ruin'||o.cat==='struct').map(o=>[o.x,o.y]),manors=[];
  const spread=(k,pool,extra)=>{const ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.22})).sort((a,b)=>b.d-a.d);for(let n=0;n<Math.min(12,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],extra);if(o){chosen.push([o.x,o.y]);if(/^(chalet|almHut|hayBarn)$/.test(k))manors.push(o);return o;}}return null;};
  [['chalet',1],['almHut',2],['hayBarn',3],['chalet',4]].forEach(([k,mt])=>spread(k,rim,{minT:mt,scale:1.15,clear:2.5,noSouth:true}));
  [['almHut',2],['chalet',3],['hayBarn',4],['almHut',4]].forEach(([k,mt])=>spread(k,inn,{minT:mt,scale:1.0,clear:3.0,noSouth:true}));
  {const home=manors[manors.length-1]||placed.find(o=>o.cat==='struct');if(home){for(const [dx,dy] of [[0.36,-0.08],[-0.36,-0.08],[0.3,0.12],[-0.3,0.12],[0.44,0.0],[-0.44,0.0]]){const o=place('alpChapel',home.x+dx,home.y+dy,{minT:4,scale:1.0,clear:2.4,noSouth:true});if(o)break;}}}
  /* 2b. alpine pieces scattered through the land (farthest-point spacing): cows, goats, wayside shrines, a log shed, a trough, cairns */
  [['cows',1],['wayShrine',2],['cows',2],['cairn',2],['logShed',3],['trough',3],['goats',3],['wayShrine',4],['cows',4],['cairn',4]].forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,scale:k==='cows'||k==='goats'?1.15:1.0,clear:1.8,noSouth:true}));
  /* 3. conifer-led forest at the approved Frontier density (the top rim is treated exactly like every other edge) */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=pickFrom(regionOf(v.y),capOk),n=2+Math.floor(rng()*1.9);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.09:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}if(rng()<0.35)spike(v.x+(rng()-0.5)*0.24,v.y+(rng()-0.5)*0.14);});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{const dom=pickFrom(regionOf(e.mid[1]),capOk);[-0.27,0,0.27].forEach(dy=>{if(rng()<0.82)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});if(rng()<0.2)spike(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.3);});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.72)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.8+rng()*0.2},null,true);if(rng()<0.22)tree(e.mid[0]+(rng()-0.5)*0.34,e.mid[1]+(rng()-0.5)*0.14,{scale:0.78+rng()*0.2},null,true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.26));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(rng()-0.2)*0.12)});});
    let mode='grove',run=0,dom='spruceA';samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.74?'grove':r<0.92?'sparse':'open';run=2+Math.floor(rng()*4);dom=pickFrom(regionOf(s.p[1]),capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){tree(p[0],p[1],null,dom,low);if(rng()<0.55)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,dom,low);if(rng()<0.2)tree(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,dom,true);if(rng()<0.14)tree(p[0]+(rng()-0.5)*0.34,p[1]-0.2,null,dom,low);if(rng()<0.3)spike(p[0]+(rng()-0.5)*0.3,p[1]+(rng()-0.5)*0.1);}
      else if(mode==='sparse'){if(rng()<0.5)tree(p[0],p[1],null,dom,low);else under(p[0],p[1]);}else if(rng()<0.6)under(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.8)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<14;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.46)tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);else if(rng()<0.06)spike(px,py);}});
  /* 3c. balance the rim: the top, the sides and the bottom must carry the same tree density per unit of boundary (thin the heavy edges, fill the light ones) */
  {const dEdge=(x,y,e)=>{const dx=e.b[0]-e.a[0],dy=e.b[1]-e.a[1],t=Math.max(0,Math.min(1,((x-e.a[0])*dx+(y-e.a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-(e.a[0]+dx*t),(y-(e.a[1]+dy*t))*1.4);};
    const classes=['top','side','bottom'],len={top:0,side:0,bottom:0};outer.forEach(e=>len[e.cls]+=e.len);
    const members=()=>{const m={top:[],side:[],bottom:[]};placed.filter(o=>o.cat==='tree').forEach(o=>{let best=null,bd=1e9;outer.forEach(e=>{const d=dEdge(o.x,o.y,e);if(d<bd){bd=d;best=e;}});if(bd<0.32)m[best.cls].push(o);});return m;};
    let m=members();const mean=(m.top.length+m.side.length+m.bottom.length)/(len.top+len.side+len.bottom);
    classes.forEach(cl=>{const target=Math.round(len[cl]*mean);let list=m[cl];
      if(list.length>target+1){const drop=list.length-target;for(let i=0;i<drop;i++){const pick=list.splice(Math.floor(rng()*list.length),1)[0],ix=placed.indexOf(pick);if(ix>=0)placed.splice(ix,1);}}
      else if(list.length<target-1){const need=target-list.length,es=outer.filter(e=>e.cls===cl);let added=0,guard=0;while(added<need&&guard++<160){const e=es[Math.floor(rng()*es.length)],p=onEdge(e,rng(),(rng()-0.2)*0.12);if(tree(p[0],p[1],null,null,cl!=='top'))added++;}}});}
  /* 4. undergrowth: alpenrose, gentian, edelweiss, krummholz */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.45)under(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.35)under(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.38)under(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.3)under(px,py);}});
  /* 5. small props: lower tiers only */
  [['pennants',2],['lanternA',2],['zigzagFence',2],['milkCans',2],['firewood',2],['hayBaleA',2],['trailSign',2]].forEach(([k,n])=>{for(let i=0;i<n;i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  /* every house gets a facing (bit0 mirror, bit1 gable/eave); neighbours cycle through all four */
  {const houses=placed.filter(o=>/^(chalet|almHut|hayBarn)$/.test(o.kind)).sort((a,b)=>a.x-b.x||a.y-b.y),cyc=[0,3,1,2];houses.forEach((o,i)=>{o.v=((o.v>>2)<<2)|cyc[i%4];});placed.filter(o=>o.kind==='alpChapel'||o.kind==='logShed'||o.kind==='trough'||o.kind==='wayShrine').forEach(o=>{o.v=((o.v>>2)<<2)|(rng()<0.5?1:0);});}
  const cuts={tree:[0.2,0.52,0.8,1],shrub:[0.06,0.38,0.7,1],rock:[0.3,0.55,0.8,1],prop:[1,1,1,1],struct:[0,0,0,0],ruin:[0,0,0,0],water:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='struct'||o.cat==='ruin'||o.cat==='water'||o.fixed)o.tier=o.minT;});
  const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
  for(let t=1;t<=4;t++){let guard=0;while(guard++<300){const c=count(t);if(c.tr/Math.max(1,c.n)>=0.6)break;const pool=placed.filter(o=>o.tier<=t&&t<=o.maxT),cand=(pool.filter(o=>o.cat==='shrub').sort((a,b)=>b.pri-a.pri)[0])||(pool.filter(o=>o.prop&&o.minT>1).sort((a,b)=>b.pri-a.pri)[0]);if(!cand)break;cand.tier=Math.min(5,cand.tier+1);}}
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.filter(o=>o.cat==='water').forEach(o=>{o.layer='back';});
  placed.sort((a,b)=>a.y-b.y);
  return ALPINE_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: IDENTICAL to the Nordic land's (same colour, same moss / frost / needle litter) so the two blend; muted teal-grey earth with moss, lichen, heather speckle and pine-needle litter, a few pale frost patches (decals, not objects) ---- */
function alpineGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<46;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'170,205,185':'40,66,62',r()<0.5?0.2:0.22);}
  for(let k=0;k<12;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'90,140,96',0.2);}                    /* moss */
  for(let k=0;k<8;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'110,84,60',0.15);}                   /* peaty earth */
  for(let k=0;k<7;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'236,244,248',0.22);}                 /* frost */
  for(let k=0;k<90;k++){const p=pt(),a=r()*3.14,l=R*(0.03+r()*0.04);TH.ln(c,[p[0],p[1]],[p[0]+Math.cos(a)*l,p[1]+Math.sin(a)*l*0.5],r()<0.5?'rgba(96,66,40,.55)':'rgba(120,86,50,.5)',R*0.008);}   /* pine needles */
  for(let k=0;k<130;k++){const p=pt(),h=R*(0.05+r()*0.05);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#6a9a62','#5a8a54','#82aa72'][(k+j)%3],R*0.01);}
  for(let k=0;k<50;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.011,R*0.009,['#a878c8','#c8a0e0','#f6efe0','#f2c230'][k%4]);}   /* heather and wild flowers */
  for(let k=0;k<34;k++){const p=pt();TH.ell(c,p[0],p[1],R*(0.016+r()*0.014),R*0.011,r()<0.4?'rgba(150,170,130,.6)':'rgba(130,140,150,.55)');}   /* lichen-covered stones */
  c.restore();c.restore();
}
const ALPINE_THEME={id:'alpine',assets:ALPINE_ASSETS,plan:getAlpinePlan,ground:alpineGround,groundCol:'#7f9a8c',top:1.5};
const ALPINE_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
function bakeLandAlpine(shape,tier,R,opts){return bakeLandTheme(ALPINE_THEME,shape,tier,R,opts);}
function drawLandAlpineBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandAlpineDepthBand(ctx,x,y,land,index){const band=land.bands[index];if(!band||!band.canvas)return;const r=band.rect;ctx.drawImage(band.canvas,x-land.ox+r.x,y-land.oy+r.y,r.w,r.h);}
function drawLandAlpineFront(ctx,x,y,land){land.bands.forEach((_,index)=>drawLandAlpineDepthBand(ctx,x,y,land,index));}
return Object.freeze({bake:bakeLandAlpine,drawBack:drawLandAlpineBack,drawDepthBand:drawLandAlpineDepthBand,drawFront:drawLandAlpineFront});
})();
