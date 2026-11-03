function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const channel = value => Math.round(amt < 0 ? value * (1 + amt) : value + (255 - value) * amt);
  return `rgb(${channel(r)},${channel(g)},${channel(b)})`;
}

function hexPath(ctx, cx, cy, radius) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 180 * (60 * i + 30);
    ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle) * 0.58);
  }
  ctx.closePath();
}

/**
 * drawAirRace(ctx, cx, cy, R, opts)
 *  opts.accent : Land color (default Generic white) -> hex border, checkered base, spire stripes, gondola wings, pole feet, fence rail
 *  opts.t      : spin angle in radians (the four-armed rotor); also spins the propellers
 *  opts.fly    : 0..1 how far the pole-mounted planes tilt up and down (0 = hanging level, 1 = full swing)
 *  opts.flip   : true when called under ctx.scale(-1,1) (keeps shadows on the same screen side)
 *  opts.tile   : draw the hex tile (default true)
 */
function drawAirRace(ctx,cx,cy,R,o={}){
  const accent=o.accent||'#f8fafc', rot=o.t==null?0.5:o.t, fly=o.fly==null?0.8:o.fly, fl=o.flip?-1:1, r=v=>R*v, TAU=Math.PI*2;
  const P=(X,Y,Z)=>[cx+(X-Y)*0.7, cy+(X+Y)*0.35-Z];
  const g=(rr,a,Z)=>P(rr*Math.cos(a),rr*Math.sin(a),Z);
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.stroke();}};
  const disc=(p,rr,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(p[0],p[1],rr,0,7);ctx.fill();};
  const ell=(p,rr,fill)=>{ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(p[0],p[1],0.99*rr,0.495*rr,0,0,7);ctx.fill();};
  const z0=r(0.03), Zh=r(0.38), tr=r(0.19), La=r(0.44), Lg=r(0.32), Lf=r(0.22);
  if(o.tile!==false){hexPath(ctx,cx,cy,R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();}
  const pb=P(0,0,z0);ell(pb,r(0.8),'#e2e8f0');ctx.strokeStyle='#94a3b8';ctx.lineWidth=R*0.012;ctx.beginPath();ctx.ellipse(pb[0],pb[1],0.99*r(0.8),0.495*r(0.8),0,0,7);ctx.stroke();
  ell([pb[0]+fl*r(0.16),pb[1]+r(0.05)],r(0.42),'rgba(15,23,42,.17)');
  // fence: back half first
  const fence=(a0,a1)=>{for(let a=a0;a<a1;a+=TAU/44){const b=g(r(0.75),a,z0),t=g(r(0.75),a,z0+r(0.07));line(b,t,'#475569',R*0.01);}};
  fence(-Math.PI*0.75,Math.PI*0.25+0.0);
  // arms with planes, poles and gondolas; collected so we can sort around the tower
  const arms=[];
  for(let k=0;k<4;k++){const a=rot+k*Math.PI/2, ca=Math.cos(a), sa=Math.sin(a);
    const E=[La*ca,La*sa,Zh+r(0.03)], gam=fly*1.15*Math.sin(rot*1.3+k*1.7);
    arms.push({k,a,E,key:E[0]+E[1],gam});}
  const drawArm=A=>{const ca=Math.cos(A.a), sa=Math.sin(A.a), E=A.E, H=P(0,0,Zh+r(0.03)), Ep=P(E[0],E[1],E[2]);
    line(H,Ep,'#7f1d1d',r(0.05));line(H,Ep,'#ef4444',r(0.038));line([H[0],H[1]-r(0.012)],[Ep[0],Ep[1]-r(0.012)],'#fca5a5',r(0.01));      // red arm
    const sg=Math.sin(A.gam), cg=Math.cos(A.gam);
    const d=[sg*ca,sg*sa,cg], G=[E[0]+d[0]*Lg,E[1]+d[1]*Lg,E[2]+d[2]*Lg], F=[E[0]-d[0]*Lf,E[1]-d[1]*Lf,E[2]-d[2]*Lf];
    const Gp=P(G[0],G[1],G[2]), Fp=P(F[0],F[1],F[2]);
    line(Fp,Gp,'#0c4a6e',r(0.036));line(Fp,Gp,'#38bdf8',r(0.026));                                                                    // blue pole
    // foot at the low end of the pole
    const fu=[(Fp[0]-Gp[0]),(Fp[1]-Gp[1])],fl2=Math.hypot(fu[0],fu[1])||1;fu[0]/=fl2;fu[1]/=fl2;
    poly([[Fp[0]-fu[1]*r(0.035),Fp[1]+fu[0]*r(0.035)],[Fp[0]+fu[1]*r(0.035),Fp[1]-fu[0]*r(0.035)],[Fp[0]+fu[0]*r(0.045),Fp[1]+fu[1]*r(0.045)]],accent,shade(accent,-0.35),r(0.008));
    // little plane fuselage at the arm end, propeller at the nose
    const tx=-sa,ty=ca,n1=P(E[0]+tx*r(0.1),E[1]+ty*r(0.12),E[2]),n0=P(E[0]-tx*r(0.12),E[1]-ty*r(0.12),E[2]);
    line(n0,n1,'#0369a1',r(0.088));line(n0,n1,'#0ea5e9',r(0.07));line([n0[0],n0[1]-r(0.01)],[n1[0],n1[1]-r(0.01)],'#7dd3fc',r(0.014));
    const sp=rot*14+A.k*1.3;[0,1].forEach(j=>{const aa=sp+j*Math.PI/2;line([n1[0]-Math.cos(aa)*r(0.034),n1[1]-Math.sin(aa)*r(0.034)*1.0],[n1[0]+Math.cos(aa)*r(0.034),n1[1]+Math.sin(aa)*r(0.034)],'#facc15',r(0.012));});
    disc(n1,r(0.012),'#f59e0b');
    // gondola: biplane seat with a Land-colored wing and riders
    const wa=P(G[0]+tx*r(0.125),G[1]+ty*r(0.125),G[2]),wb=P(G[0]-tx*r(0.125),G[1]-ty*r(0.125),G[2]);
    const wo=[Gp[0]-(Fp[0]-Gp[0])*0.0,Gp[1]];const up=[(Gp[0]-Fp[0])/(Math.hypot(Gp[0]-Fp[0],Gp[1]-Fp[1])||1),(Gp[1]-Fp[1])/(Math.hypot(Gp[0]-Fp[0],Gp[1]-Fp[1])||1)];
    const wl=r(0.052);
    poly([[wa[0]+up[0]*wl,wa[1]+up[1]*wl],[wb[0]+up[0]*wl,wb[1]+up[1]*wl],[wb[0]+up[0]*wl*0.2,wb[1]+up[1]*wl*0.2],[wa[0]+up[0]*wl*0.2,wa[1]+up[1]*wl*0.2]],accent,shade(accent,-0.35),r(0.008));
    ctx.fillStyle='#dc2626';ctx.beginPath();ctx.ellipse(Gp[0],Gp[1],r(0.08),r(0.043),Math.atan2(wb[1]-wa[1],wb[0]-wa[0]),0,7);ctx.fill();
    for(let j=-1;j<=1;j++)disc([Gp[0]+(wb[0]-wa[0])*0.2*j/2*1.0*2+up[0]*r(0.012),Gp[1]+(wb[1]-wa[1])*0.2*j/2*1.0*2+up[1]*r(0.012)],r(0.021),['#fde4c8','#fbbf24','#fde4c8'][j+1]);
  };
  arms.filter(A=>A.key<0).sort((u,v)=>u.key-v.key).forEach(drawArm);
  // tower: checkered base, red hub, striped spire
  ell(P(0,0,z0),tr,shade('#cbd5e1',-0.1));
  const base=P(0,0,z0);ctx.fillStyle='#f1f5f9';ctx.fillRect(base[0]-0.99*tr,base[1]-(Zh-z0),1.98*tr,Zh-z0);
  for(let i=0;i<8;i++){const a0=-Math.PI/4+i*Math.PI/8,a1=a0+Math.PI/8;
    for(let j=0;j<3;j++){const zA=z0+(Zh-z0)*j/3,zB=z0+(Zh-z0)*(j+1)/3;
      poly([g(tr,a0,zA),g(tr,a1,zA),g(tr,a1,zB),g(tr,a0,zB)],(i+j)%2?'#f8fafc':accent);}}
  ctx.strokeStyle='rgba(15,23,42,.25)';ctx.lineWidth=R*0.008;ctx.beginPath();ctx.ellipse(base[0],base[1]-(Zh-z0),0.99*tr,0.495*tr,0,0,Math.PI);ctx.stroke();
  const hubp=P(0,0,Zh);ell(hubp,r(0.14),'#b91c1c');ctx.fillStyle='#ef4444';ctx.fillRect(hubp[0]-0.99*r(0.14),hubp[1]-r(0.045),1.98*r(0.14),r(0.045));ell([hubp[0],hubp[1]-r(0.045)],r(0.14),'#f87171');
  const rc0=r(0.115),zc0=Zh+r(0.045),zc1=r(0.98),bands=7;                                             // spire: striped rings
  for(let b=0;b<bands;b++){const t0=b/bands,t1=(b+1)/bands,rA=rc0*(1-t0),rB=rc0*(1-t1),zA=zc0+(zc1-zc0)*t0,zB=zc0+(zc1-zc0)*t1;
    const pa=P(0,0,zA),pb2=P(0,0,zB);ctx.fillStyle=b%2?shade(accent,-0.15):'#f8fafc';ctx.beginPath();
    ctx.ellipse(pa[0],pa[1],0.99*rA,0.495*rA,0,0,Math.PI);ctx.lineTo(pb2[0]-0.99*rB,pb2[1]);ctx.ellipse(pb2[0],pb2[1],0.99*rB,0.495*rB,0,Math.PI,0,true);ctx.closePath();ctx.fill();}
  disc(P(0,0,zc1),r(0.014),accent);
  arms.filter(A=>A.key>=0).sort((u,v)=>u.key-v.key).forEach(drawArm);
  fence(Math.PI*0.25,Math.PI*1.25);
  ctx.strokeStyle=accent;ctx.lineWidth=R*0.012;ctx.beginPath();
  for(let s=0;s<=60;s++){const a=Math.PI*0.25+Math.PI*s/60,p=g(r(0.75),a,z0+r(0.07));s?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();
}

/**
 * drawBumperCars(ctx, cx, cy, R, opts)
 *  opts.accent : Land color (default Generic white) -> hex border, roof strips, wall + rail stripes, sign, centre island, two cars
 *  opts.t      : time in seconds (drives the cars, the pole sparks and the string lights); omit for a static sprite
 *  opts.flip   : true when called under ctx.scale(-1,1) (keeps shadows on the same screen side)
 *  opts.tile   : draw the hex tile (default true)
 */
function drawBumperCars(ctx,cx,cy,R,o={}){
  const accent=o.accent||'#f8fafc', fl=o.flip?-1:1, tm=o.t==null?0:o.t, r=v=>R*v, TAU=Math.PI*2;
  const Q=(X,Y,Z)=>[cx+(X-Y)*0.7, cy+(X+Y)*0.35-Z];
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.stroke();}};
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const disc=(p,rr,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(p[0],p[1],rr,0,7);ctx.fill();};
  const plane=(X,Y,Z,fn)=>{const p=Q(X,Y,Z);ctx.save();ctx.transform(0.7,0.35,0,1,p[0],p[1]);fn();ctx.restore();};
  const hx=r(0.42), hy=r(0.3), zf=r(0.05), zt=r(0.3), z0=r(0.03);
  if(o.tile!==false){hexPath(ctx,cx,cy,R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();}
  poly([Q(r(-0.62),r(-0.5),z0),Q(r(0.62),r(-0.5),z0),Q(r(0.62),r(0.54),z0),Q(r(-0.62),r(0.54),z0)],'#e2e8f0','#94a3b8',R*0.012);
  ctx.save();ctx.translate(fl*r(0.14),r(0.07));
  poly([Q(-hx,-hy,z0),Q(hx,-hy,z0),Q(hx,hy,z0),Q(-hx,hy,z0)],'rgba(15,23,42,.22)');ctx.restore();
  // raised arena platform sides, then the polished floor
  poly([Q(-hx,hy,z0),Q(hx,hy,z0),Q(hx,hy,zf),Q(-hx,hy,zf)],'#94a3b8');
  poly([Q(hx,-hy,z0),Q(hx,hy,z0),Q(hx,hy,zf),Q(hx,-hy,zf)],'#64748b');
  poly([Q(-hx,-hy,zf),Q(hx,-hy,zf),Q(hx,hy,zf),Q(-hx,hy,zf)],'#56657d');
  for(let X=-0.35;X<=0.36;X+=0.14)line(Q(r(X),-hy,zf),Q(r(X),hy,zf),'rgba(226,232,240,.2)',R*0.006);
  for(let Y=-0.2;Y<=0.21;Y+=0.1)line(Q(-hx,r(Y),zf),Q(hx,r(Y),zf),'rgba(226,232,240,.2)',R*0.006);
  poly([Q(r(-0.3),-hy,zf),Q(r(-0.1),-hy,zf),Q(r(0.1),hy,zf),Q(r(-0.1),hy,zf)],'rgba(255,255,255,.07)');
  // back + left walls with accent stripe and little stars, lean-to roof strips
  poly([Q(-hx,-hy,zf),Q(hx,-hy,zf),Q(hx,-hy,zt),Q(-hx,-hy,zt)],'#334155');
  poly([Q(-hx,-hy,zf),Q(-hx,hy,zf),Q(-hx,hy,zt),Q(-hx,-hy,zt)],'#3b4a63');
  poly([Q(-hx,-hy,r(0.21)),Q(hx,-hy,r(0.21)),Q(hx,-hy,r(0.245)),Q(-hx,-hy,r(0.245))],accent);
  poly([Q(-hx,-hy,r(0.21)),Q(-hx,hy,r(0.21)),Q(-hx,hy,r(0.245)),Q(-hx,-hy,r(0.245))],shade(accent,-0.25));
  [[-0.34,-0.3,0.14],[-0.2,-0.3,0.12],[-0.05,-0.3,0.15],[0.1,-0.3,0.11],[0.25,-0.3,0.14],[0.35,-0.3,0.12]].forEach(([X,Y,Z],i)=>disc(Q(r(X),r(Y),r(Z)),R*0.01,(Math.floor(tm*2)+i)%2?'#fde047':'#fef9c3'));
  [[-0.42,-0.2,0.14],[-0.42,-0.05,0.12],[-0.42,0.1,0.15],[-0.42,0.22,0.11]].forEach(([X,Y,Z],i)=>disc(Q(r(X),r(Y),r(Z)),R*0.01,(Math.floor(tm*2)+i)%2?'#fef9c3':'#fde047'));
  poly([Q(-hx-r(0.03),-hy-r(0.03),zt),Q(hx+r(0.03),-hy-r(0.03),zt),Q(hx+r(0.03),-hy+r(0.13),zt-r(0.04)),Q(-hx-r(0.03),-hy+r(0.13),zt-r(0.04))],accent,shade(accent,-0.3));
  poly([Q(-hx-r(0.03),-hy-r(0.03),zt),Q(-hx+r(0.13),-hy-r(0.03),zt-r(0.04)),Q(-hx+r(0.13),hy+r(0.03),zt-r(0.04)),Q(-hx-r(0.03),hy+r(0.03),zt)],shade(accent,-0.2),shade(accent,-0.4));
  // roof sign above the back wall
  const sa=r(-0.3),sb=r(0.3),sy=-hy,sz0=zt+r(0.02),sz1=zt+r(0.15);
  [sa+r(0.04),sb-r(0.04)].forEach(x=>line(Q(x,sy,zt),Q(x,sy,sz0),'#64748b',R*0.014));
  poly([Q(sa,sy,sz0),Q(sb,sy,sz0),Q(sb,sy,sz1),Q(sa,sy,sz1)],accent,'#fde68a',R*0.012);
  plane(sa,sy,sz1,()=>{ctx.fillStyle='#f8fafc';ctx.font='bold '+r(0.063)+'px Arial Black, Arial, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('BUMPER CARS',(sb-sa)/2,r(0.065));});
  for(let k=0;k<=12;k++){const X=sa+(sb-sa)*k/12;[sz0,sz1].forEach((Z,j)=>disc(Q(X,sy,Z),R*0.007,(Math.floor(tm*4)+k+j)%2?'#fef08a':'#fb923c'));}
  // centre island
  poly([Q(r(-0.1),r(-0.07),zf),Q(r(0.1),r(-0.07),zf),Q(r(0.1),r(0.07),zf),Q(r(-0.1),r(0.07),zf)],'#475569');
  const iz=zf+r(0.03);
  poly([Q(r(-0.1),r(0.07),zf),Q(r(0.1),r(0.07),zf),Q(r(0.1),r(0.07),iz),Q(r(-0.1),r(0.07),iz)],'#94a3b8');
  poly([Q(r(0.1),r(-0.07),zf),Q(r(0.1),r(0.07),zf),Q(r(0.1),r(0.07),iz),Q(r(0.1),r(-0.07),iz)],'#64748b');
  poly([Q(r(-0.1),r(-0.07),iz),Q(r(0.1),r(-0.07),iz),Q(r(0.1),r(0.07),iz),Q(r(-0.1),r(0.07),iz)],accent,shade(accent,-0.3),R*0.008);
  { const b=Q(0,0,iz),t=Q(0,0,iz+r(0.13));line(b,t,'#94a3b8',R*0.012);disc(t,R*0.02,'#fef9c3'); }
  // cars: seven, circling in both directions at different radii; sorted back to front
  const pal=[accent,'#3b82f6','#22c55e','#f97316',shade(accent,-0.0)==='x'?accent:'#a855f7','#ef4444','#06b6d4'];
  const cars=[];
  for(let k=0;k<7;k++){const dir=k%2?-1:1,sp=(0.35+0.07*(k%3))*dir,a=k*TAU/7+tm*sp,m=[1,0.78,0.92,0.66,1.05,0.85,0.72][k];
    const X=r(0.31)*m*Math.cos(a),Y=r(0.18)*m*Math.sin(a);
    const hd=Math.atan2(dir*r(0.18)*Math.cos(a),-dir*r(0.31)*Math.sin(a))+0.5*Math.sin(tm*1.7+k*2);
    cars.push({X,Y,hd,col:pal[k],k});}
  const drawCar=c=>{const cs=Math.cos(c.hd),sn=Math.sin(c.hd),W=(u,v,z)=>Q(c.X+u*cs-v*sn,c.Y+u*sn+v*cs,z);
    const bu=r(0.062),bv=r(0.045),ru=r(0.078),rv=r(0.06),zb=zf+r(0.012),zc=zf+r(0.04);
    ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(W(0,0,zf)[0]+fl*r(0.015),W(0,0,zf)[1]+r(0.006),r(0.07),r(0.028),0,0,7);ctx.fill();
    const ring=[[-ru,-rv],[ru,-rv],[ru,rv],[-ru,rv]].map(([u,v])=>W(u,v,zb));
    poly(ring,'#111827');poly([[-ru*0.88,-rv*0.78],[ru*0.88,-rv*0.78],[ru*0.88,rv*0.78],[-ru*0.88,rv*0.78]].map(([u,v])=>W(u,v,zb+r(0.004))),'#374151');
    const cn=[[-bu,-bv],[bu,-bv],[bu,bv],[-bu,bv]], faces=[];
    for(let i=0;i<4;i++){const a=cn[i],b=cn[(i+1)%4],A=W(a[0],a[1],zb),B=W(b[0],b[1],zb),C=W(b[0],b[1],zc),D=W(a[0],a[1],zc);
      const mx=c.X+(a[0]+b[0])/2*cs-(a[1]+b[1])/2*sn,my=c.Y+(a[0]+b[0])/2*sn+(a[1]+b[1])/2*cs;
      const nx=(b[1]-a[1])*cs+(b[0]-a[0])*sn*0,ny=0;faces.push({pts:[A,B,C,D],d:mx+my,e:i});}
    faces.sort((p,q)=>p.d-q.d).forEach(f=>poly(f.pts,shade(c.col,-0.12-0.12*(f.e%2)-0.12*((f.d>0)?0:1))));
    poly(cn.map(([u,v])=>W(u,v,zc)),shade(c.col,0.12));
    poly([[bu*0.1,-bv*0.7],[bu*0.9,-bv*0.55],[bu*0.9,bv*0.55],[bu*0.1,bv*0.7]].map(([u,v])=>W(u,v,zc+r(0.002))),shade(c.col,0.32));        // hood
    const hl=W(bu,0,zc-r(0.008));disc(hl,R*0.008,'#fde047');
    const seat=W(-bu*0.3,0,zc);const head=[seat[0],seat[1]-r(0.045)];
    ctx.fillStyle='#f8fafc';ctx.fillRect(seat[0]-r(0.013),seat[1]-r(0.03),r(0.026),r(0.03));disc(head,r(0.02),'#fde4c8');
    const wh=W(bu*0.35,0,zc);line(wh,[wh[0],wh[1]-r(0.012)],'#111827',R*0.01);
    const pb=W(-bu*0.85,0,zc),pt=Q(c.X-bu*0.85*cs,c.Y-bu*0.85*sn,zt);line(pb,pt,'#94a3b8',R*0.006);                                         // contact pole
    const on=(Math.floor(tm*8)+c.k)%3!==0;disc(pt,on?R*0.014:R*0.007,on?'#fef08a':'#fb923c');};
  cars.sort((p,q)=>(p.X+p.Y)-(q.X+q.Y)).forEach(drawCar);
  // front + right rails, with a gate gap on the front
  const rail=(a,b,Y,xmode)=>{const P=(u,z)=>xmode?Q(u,Y,z):Q(Y,u,z);
    poly([P(a,zf),P(b,zf),P(b,zf+r(0.055)),P(a,zf+r(0.055))],xmode?'#f1f5f9':'#cbd5e1');
    poly([P(a,zf+r(0.025)),P(b,zf+r(0.025)),P(b,zf+r(0.04)),P(a,zf+r(0.04))],accent);
    poly([P(a,zf+r(0.055)),P(b,zf+r(0.055)),P(b,zf+r(0.065)),P(a,zf+r(0.065))],'#111827');};
  rail(-hx,r(-0.07),hy,true);rail(r(0.07),hx,hy,true);rail(-hy,hy,hx,false);
  // corner posts, front/right roof beams and a sagging string of lights
  [[hx,hy],[hx,-hy],[-hx,hy]].forEach(([X,Y])=>line(Q(X,Y,zf),Q(X,Y,zt),'#94a3b8',R*0.016));
  line(Q(-hx,hy,zt),Q(hx,hy,zt),accent,R*0.016);line(Q(hx,-hy,zt),Q(hx,hy,zt),shade(accent,-0.2),R*0.016);
  [[[-hx,hy],[hx,hy]],[[hx,-hy],[hx,hy]]].forEach(([A,B])=>{ctx.strokeStyle='rgba(30,41,59,.7)';ctx.lineWidth=R*0.006;ctx.beginPath();
    for(let s=0;s<=16;s++){const t=s/16,sag=Math.sin(t*Math.PI)*r(0.045),p=Q(A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,zt-sag);s?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}
    ctx.stroke();
    for(let s=1;s<16;s++){const t=s/16,sag=Math.sin(t*Math.PI)*r(0.045),p=Q(A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,zt-sag);
      disc(p,R*0.0095,(Math.floor(tm*3)+s)%2?'#fef08a':'#fda4af');}});
  // lamp posts, queue ropes and three waiting guests
  [-0.55,0.55].forEach(X=>{const b=Q(r(X),r(0.43),z0),t=Q(r(X),r(0.43),r(0.19));line(b,t,'#334155',R*0.014);disc(t,R*0.02,'#fde68a');});
  [-0.12,0.12].forEach(X=>{let prev=null;for(let k=0;k<3;k++){const b=Q(r(X),r(0.38+k*0.07),z0),t=Q(r(X),r(0.38+k*0.07),z0+r(0.05));
    line(b,t,'#fde68a',R*0.009);disc(t,R*0.01,'#fde68a');if(prev)line(prev,t,accent,R*0.006);prev=t;}});
  [[-0.05,0.44,'#3b82f6'],[0.04,0.5,'#22c55e'],[-0.02,0.54,'#f97316']].forEach(([X,Y,c])=>{const b=Q(r(X),r(Y),z0);
    ctx.fillStyle='#1f2937';ctx.fillRect(b[0]-r(0.011),b[1]-r(0.028),r(0.022),r(0.028));ctx.fillStyle=c;ctx.fillRect(b[0]-r(0.015),b[1]-r(0.06),r(0.03),r(0.036));disc([b[0],b[1]-r(0.074)],r(0.016),'#fde4c8');});
}

/**
 * drawCarousel(ctx, cx, cy, R, opts)
 *  opts.accent : Land color (default Generic white) -> hex border, platform trim, roof stripes, scallops, saddle blankets, flag
 *  opts.t      : rotation angle in radians (the horses and the platform turn; the roof stays still)
 *  opts.tm     : time in seconds for the bulbs and the flag (defaults to 0)
 *  opts.flip   : true when called under ctx.scale(-1,1) (keeps shadows on the same screen side)
 *  opts.tile   : draw the hex tile (default true)
 */
function drawCarousel(ctx,cx,cy,R,o={}){
  const accent=o.accent||'#f8fafc', rot=o.t==null?0.4:o.t, tm=o.tm==null?0:o.tm, fl=o.flip?-1:1, r=v=>R*v, TAU=Math.PI*2;
  const P=(X,Y,Z)=>[cx+(X-Y)*0.7, cy+(X+Y)*0.35-Z];
  const g=(rr,a,Z)=>P(rr*Math.cos(a),rr*Math.sin(a),Z);
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.stroke();}};
  const disc=(p,rr,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(p[0],p[1],rr,0,7);ctx.fill();};
  const ell=(p,rr,fill)=>{ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(p[0],p[1],0.99*rr,0.495*rr,0,0,7);ctx.fill();};
  const cyl=(rr,Z,h,col,topc)=>{const p=P(0,0,Z);ell(p,rr,shade(col,-0.2));ctx.fillStyle=shade(col,-0.1);ctx.fillRect(p[0]-0.99*rr,p[1]-h,1.98*rr,h);ell([p[0],p[1]-h],rr,topc||shade(col,0.15));};
  const z0=r(0.03), zd=r(0.06), zr=r(0.47), Rr=r(0.62), cream='#fde8c0', gold='#fbbf24';
  if(o.tile!==false){hexPath(ctx,cx,cy,R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();}
  const gp=P(0,0,z0);ell(gp,r(0.8),'#e2e8f0');ctx.strokeStyle='#94a3b8';ctx.lineWidth=R*0.012;ctx.beginPath();ctx.ellipse(gp[0],gp[1],0.99*r(0.8),0.495*r(0.8),0,0,7);ctx.stroke();
  ell([gp[0]+fl*r(0.16),gp[1]+r(0.06)],r(0.55),'rgba(15,23,42,.17)');
  // platform: step ring, painted deck, accent edge
  cyl(r(0.68),z0,r(0.022),'#cbd5e1');
  cyl(r(0.6),z0+r(0.022),zd-z0-r(0.022)+r(0.008),accent,cream);
  const dp=P(0,0,zd+r(0.008));
  ctx.strokeStyle=shade(accent,-0.1);ctx.lineWidth=R*0.012;[0.52,0.34,0.17].forEach(rr=>{ctx.beginPath();ctx.ellipse(dp[0],dp[1],0.99*r(rr),0.495*r(rr),0,0,7);ctx.stroke();});
  // horses, two rings; poles are brass, blankets are the Land color
  const horses=[], cols=['#f8fafc','#92400e','#1f2937','#fcd34d','#cbd5e1','#7c2d12'];
  [[r(0.46),12,0],[r(0.29),8,0.5]].forEach(([rad,n,ph])=>{for(let i=0;i<n;i++){const a=rot+(i+ph)*TAU/n,bob=r(0.035)*Math.sin(rot*3+(i%2?Math.PI:0)+rad/R*5);
    horses.push({a,rad,z:r(0.17)+bob,key:Math.cos(a)+Math.sin(a),col:cols[(i+(rad>r(0.4)?0:2))%6],i});}});
  const drawHorse=h=>{const C=g(h.rad,h.a,h.z),top=g(h.rad,h.a,zr),bot=g(h.rad,h.a,zd+r(0.01));
    line(bot,top,'#92400e',R*0.012);line(bot,top,gold,R*0.008);
    const tx=(-Math.sin(h.a)-Math.cos(h.a))*0.7,ty=(-Math.sin(h.a)+Math.cos(h.a))*0.35,tl=Math.hypot(tx,ty),sc=Math.max(0.5,tl/0.99);
    const ux=tx/tl,uy=ty/tl,dark=shade(h.col.startsWith('#')?h.col:'#888888',-0.35);
    // legs
    [[0.03,0],[-0.035,0]].forEach(([d,_],j)=>{line([C[0]+ux*d*R*sc,C[1]+uy*d*R*sc+r(0.012)],[C[0]+ux*(d+0.01*(j?-1:1))*R*sc,C[1]+uy*d*R*sc+r(0.058)],dark,R*0.014);});
    // tail, body, blanket
    line([C[0]-ux*r(0.06)*sc,C[1]-uy*r(0.06)*sc],[C[0]-ux*r(0.075)*sc,C[1]-uy*r(0.075)*sc+r(0.05)],dark,R*0.016);
    ctx.save();ctx.translate(C[0],C[1]);ctx.rotate(Math.atan2(uy,ux));
    ctx.fillStyle=h.col;ctx.beginPath();ctx.ellipse(0,0,r(0.066)*sc,r(0.034),0,0,7);ctx.fill();
    ctx.fillStyle=accent;ctx.beginPath();ctx.ellipse(-r(0.004)*sc,-r(0.005),r(0.032)*sc,r(0.026),0,0,7);ctx.fill();
    ctx.restore();
    // neck, head, mane
    const nb=[C[0]+ux*r(0.05)*sc,C[1]+uy*r(0.05)*sc-r(0.006)],nt=[C[0]+ux*r(0.075)*sc,C[1]+uy*r(0.075)*sc-r(0.05)];
    line(nb,nt,h.col,R*0.03);line([nb[0]-ux*r(0.012),nb[1]-r(0.012)],[nt[0]-ux*r(0.012),nt[1]-r(0.004)],dark,R*0.012);
    ctx.save();ctx.translate(nt[0]+ux*r(0.02)*sc,nt[1]-r(0.003));ctx.rotate(0.45);ctx.fillStyle=h.col;ctx.beginPath();ctx.ellipse(0,0,r(0.03)*Math.max(0.6,sc),r(0.016),0,0,7);ctx.fill();ctx.restore();
    if(h.i%3===0){ctx.fillStyle=['#3b82f6','#22c55e','#f97316','#a855f7'][h.i%4];ctx.fillRect(C[0]-r(0.013)-ux*r(0.004),C[1]-r(0.065),r(0.026),r(0.04));disc([C[0],C[1]-r(0.08)],r(0.017),'#fde4c8');}};
  horses.filter(h=>h.key<0).sort((u,v)=>u.key-v.key).forEach(drawHorse);
  // centre column with mirror panels
  const ctr=r(0.11),cb=P(0,0,zd),ch=zr-zd;
  ctx.fillStyle=cream;ctx.fillRect(cb[0]-0.99*ctr,cb[1]-ch,1.98*ctr,ch);ell(cb,ctr,shade(cream,-0.15));
  for(let i=0;i<8;i++){const a0=-Math.PI/4+i*Math.PI/8+rot*0.0,a1=a0+Math.PI/8;poly([g(ctr,a0,zd),g(ctr,a1,zd),g(ctr,a1,zr),g(ctr,a0,zr)],i%2?'#bae6fd':accent);
    if(i%2)poly([g(ctr,a0+0.05,zd+ch*0.15),g(ctr,a0+0.12,zd+ch*0.15),g(ctr,a0+0.07,zd+ch*0.8),g(ctr,a0+0.02,zd+ch*0.8)],'rgba(255,255,255,.55)');}
  // roof: rim band, bulbs, scalloped valance, striped cone, finial
  const rb=P(0,0,zr);ell(rb,Rr,shade(cream,-0.3));ctx.fillStyle=cream;ctx.fillRect(rb[0]-0.99*Rr,rb[1]-r(0.06),1.98*Rr,r(0.06));
  ctx.fillStyle=accent;ctx.fillRect(rb[0]-0.99*Rr,rb[1]-r(0.04),1.98*Rr,r(0.015));
  for(let i=0;i<30;i++){const a=i*TAU/30;if(Math.cos(a)+Math.sin(a)>0){const p=g(Rr,a,zr+r(0.03));disc(p,R*0.0085,(Math.floor(tm*3)+i)%2?'#fef08a':'#fdba74');}}
  for(let i=0;i<24;i++){const a0=-Math.PI/4+i*Math.PI/24,a1=a0+Math.PI/24,m=g(Rr,(a0+a1)/2,zr);
    const p0=g(Rr,a0,zr),p1=g(Rr,a1,zr),sx=(p1[0]-p0[0])/2;poly([p0,p1,[(p0[0]+p1[0])/2,(p0[1]+p1[1])/2+r(0.045)]],i%2?'#f8fafc':accent,shade(accent,-0.3),R*0.006);}
  const apex=P(0,0,r(0.8)),rim=zr+r(0.06);
  for(let i=0;i<16;i++){const a0=i*TAU/16,a1=a0+TAU/16;ctx.fillStyle=i%2?cream:accent;ctx.beginPath();ctx.moveTo(apex[0],apex[1]);
    for(let s=0;s<=3;s++){const p=g(Rr,a0+(a1-a0)*s/3,rim);ctx.lineTo(p[0],p[1]);}ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(120,53,15,.2)';ctx.lineWidth=R*0.005;ctx.stroke();}
  ctx.strokeStyle=shade(accent,-0.3);ctx.lineWidth=R*0.01;ctx.beginPath();for(let s=0;s<=48;s++){const p=g(Rr,s/48*TAU,rim);s?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();
  const fp=P(0,0,r(0.93));line(apex,fp,gold,R*0.014);disc(fp,R*0.022,gold);
  const ft=P(0,0,r(0.97));poly([ft,[ft[0]+r(0.1),ft[1]+r(0.012)+Math.sin(tm*3)*r(0.01)],[ft[0]+r(0.08),ft[1]+r(0.035)+Math.sin(tm*3+1)*r(0.01)],[ft[0]+r(0.1),ft[1]+r(0.058)+Math.sin(tm*3+2)*r(0.01)],[ft[0],ft[1]+r(0.045)]],accent,shade(accent,-0.3),R*0.006);
  horses.filter(h=>h.key>=0).sort((u,v)=>u.key-v.key).forEach(drawHorse);
  [-0.62,0.62].forEach(X=>{const b=P(r(X),r(0.52),z0),t=P(r(X),r(0.52),r(0.18));line(b,t,'#334155',R*0.014);disc(t,R*0.02,'#fde68a');});
}

/**
 * drawChairSwing(ctx, cx, cy, R, opts)
 *  opts.accent : Land color (default Generic white) -> hex border, canopy stripes, tower stripes, collar, some seats
 *  opts.t      : spin angle in radians (the canopy and the seats rotate)
 *  opts.fly    : 0..1 how far the seats swing outward (0 = hanging at rest, 1 = full speed)
 *  opts.flip   : true when called under ctx.scale(-1,1) (keeps shadows on the same screen side)
 */
function drawChairSwing(ctx,cx,cy,R,o={}){
  const accent=o.accent||'#f8fafc', th=o.t==null?0.4:o.t, fly=o.fly==null?0.8:o.fly, fl=o.flip?-1:1;
  const P=(X,Y,Z)=>[cx+(X-Y)*0.7, cy+(X+Y)*0.35-Z];
  const g=(r,a,Z)=>P(r*Math.cos(a),r*Math.sin(a),Z);                         // point on a circle around the tower
  const Rc=R*0.46, Zt=R*0.62, Zr=Zt-R*0.045, N=16, Lc=R*0.38, psi=0.15+0.65*fly, z0=R*0.03;
  const cream='#fde8c0', TAU=Math.PI*2;
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const ell=(p,r,fill)=>{ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(p[0],p[1],0.99*r,0.495*r,0,0,7);ctx.fill();};
  const cyl=(r,Z,h,col)=>{const p=P(0,0,Z);ell(p,r,shade(col,-0.25));
    ctx.fillRect(p[0]-0.99*r,p[1]-h,1.98*r,h);ell([p[0],p[1]-h],r,shade(col,0.15));};
  const side=(r,Z,h,col)=>{const p=P(0,0,Z);ctx.fillStyle=shade(col,-0.1);ell(p,r,shade(col,-0.1));
    ctx.fillRect(p[0]-0.99*r,p[1]-h,1.98*r,h);};
  if(o.tile!==false){hexPath(ctx,cx,cy,R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();}
  const pb=P(0,0,z0);                                                        // round platform + shadow
  ell(pb,R*0.64,'#94a3b8');ctx.strokeStyle='#64748b';ctx.lineWidth=R*0.012;ctx.beginPath();ctx.ellipse(pb[0],pb[1],0.99*R*0.64,0.495*R*0.64,0,0,7);ctx.stroke();
  ell([pb[0]+fl*R*0.14,pb[1]+R*0.05],R*0.5,'rgba(15,23,42,.18)');
  // seats on chains
  const seats=[];
  for(let k=0;k<N;k++){const a=th+k*TAU/N,r0=Rc*0.92,r1=r0+Lc*Math.sin(psi);
    seats.push({a,k,S:g(r1,a,Zr-Lc*Math.cos(psi)),key:Math.cos(a)+Math.sin(a),r0,r1,Zs:Zr-Lc*Math.cos(psi)});}
  const rc=['#facc15','#3b82f6','#22c55e','#f97316','#e2e8f0','#a855f7'];
  const drawSeat=s=>{
    [-1,1].forEach(d=>{const o1=R*0.016*d,ca=Math.cos(s.a),sa=Math.sin(s.a);
      line(P(s.r0*ca-sa*o1,s.r0*sa+ca*o1,Zr),P(s.r1*ca-sa*o1,s.r1*sa+ca*o1,s.Zs),'rgba(226,232,240,.85)',R*0.011);});
    const S=s.S;
    ctx.fillStyle=rc[s.k%6];ctx.fillRect(S[0]-R*0.024,S[1]-R*0.08,R*0.048,R*0.068);                       // rider
    ctx.fillStyle='#fde4c8';ctx.beginPath();ctx.arc(S[0],S[1]-R*0.102,R*0.027,0,7);ctx.fill();
    ctx.fillStyle=s.k%2?accent:'#f8fafc';ctx.fillRect(S[0]-R*0.04,S[1]-R*0.016,R*0.08,R*0.02);};         // seat
  seats.filter(s=>s.key<0).sort((u,v)=>u.key-v.key).forEach(drawSeat);
  // tower: plinth, striped column, collar
  cyl(R*0.26,z0,R*0.05,'#e2e8f0');
  const tr=R*0.16, zb=z0+R*0.05, zt=Zr-R*0.06;
  cyl(tr,zb,zt-zb,cream);
  for(let i=0;i<8;i++){const a0=-Math.PI/4+i*Math.PI*0.25*0.9*1.0,a1=a0+Math.PI*0.25*0.9;
    ctx.fillStyle=i%2?cream:accent;ctx.beginPath();
    [g(tr,a0,zb),g(tr,a1,zb),g(tr,a1,zt),g(tr,a0,zt)].forEach((p,j)=>j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.fill();
    if(i%2===0){ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();
      [g(tr,a0+0.1,zb+(zt-zb)*0.3),g(tr,a1-0.1,zb+(zt-zb)*0.3),g(tr,a1-0.1,zb+(zt-zb)*0.7),g(tr,a0+0.1,zb+(zt-zb)*0.7)]
        .forEach((p,j)=>j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.fill();}}
  cyl(R*0.2,zt,R*0.05,accent);
  // canopy: rim band, striped cone roof, rim lights, spire
  ctx.fillStyle=cream;side(Rc,Zr,R*0.045,cream);
  ctx.strokeStyle=shade(cream,-0.3);ctx.lineWidth=R*0.008;
  for(let i=0;i<24;i++){const a=th*0.5+i*TAU/24;if(Math.cos(a)+Math.sin(a)>0){
    const p=g(Rc*0.995,a,Zr+R*0.015);ctx.fillStyle='#fde68a';ctx.beginPath();ctx.arc(p[0],p[1],R*0.011,0,7);ctx.fill();}}
  const peak=P(0,0,Zt+R*0.11);
  for(let i=0;i<12;i++){const a0=th*0.5+i*TAU/12,a1=a0+TAU/12;
    ctx.fillStyle=i%2?cream:accent;ctx.beginPath();ctx.moveTo(peak[0],peak[1]);
    for(let s=0;s<=3;s++){const p=g(Rc,a0+(a1-a0)*s/3,Zt);ctx.lineTo(p[0],p[1]);}
    ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(120,53,15,.25)';ctx.lineWidth=R*0.006;ctx.stroke();}
  ctx.strokeStyle=shade(accent,-0.3);ctx.lineWidth=R*0.012;ctx.beginPath();
  for(let s=0;s<=48;s++){const p=g(Rc,s/48*TAU,Zt);s?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();
  const sp=P(0,0,Zt+R*0.24);line(peak,sp,'#fde68a',R*0.016);
  ctx.fillStyle=accent;ctx.beginPath();ctx.arc(sp[0],sp[1],R*0.03,0,7);ctx.fill();
  seats.filter(s=>s.key>=0).sort((u,v)=>u.key-v.key).forEach(drawSeat);       // front seats over the canopy
}

/**
 * drawClaw(ctx, cx, cy, R, opts)
 *  opts.accent : Land color (default Generic white) -> hex border, boom stripes, pylon stripes + diamonds, hub, pods
 *  opts.t      : boom angle in radians (0 = hanging straight down, ~+-2.1 = swung high either side)
 *  opts.r      : rotor spin angle in radians (the four-armed claw at the end of the boom)
 *  opts.flip   : true when called under ctx.scale(-1,1) (keeps shadows on the same screen side)
 */
function drawClaw(ctx,cx,cy,R,o={}){
  const accent=o.accent||'#f8fafc', ph=o.t==null?1.7:o.t, rot=o.r==null?0.5:o.r, fl=o.flip?-1:1;
  const P=(X,Y,Z)=>[cx+(X-Y)*0.7, cy+(X+Y)*0.35-Z];
  const Zp=R*0.62, Lb=R*0.5, La=R*0.29, ax=R*0.3, leg=R*0.28, z0=R*0.035;
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.01;ctx.stroke();}};
  const sp=Math.sin(ph), cp=Math.cos(ph);
  const b3=[0,sp,-cp], e2=[0,cp,sp], Hc=[0,Lb*sp,Zp-Lb*cp];                  // boom direction, rotor plane axis, hub
  if(o.tile!==false){hexPath(ctx,cx,cy,R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();}
  const sx=R*0.62,sy=R*0.42;ctx.beginPath();
  [[-sx,-sy],[sx,-sy],[sx,sy],[-sx,sy]].forEach(([X,Y],i)=>{const p=P(X,Y,z0);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});
  ctx.closePath();ctx.fillStyle='#94a3b8';ctx.fill();ctx.strokeStyle='#64748b';ctx.lineWidth=R*0.012;ctx.stroke();
  const gs=P(0,Hc[1],z0);ctx.fillStyle='rgba(15,23,42,.2)';ctx.beginPath();ctx.ellipse(gs[0]+fl*R*0.05,gs[1]+R*0.02,R*0.24,R*0.1,0,0,7);ctx.fill();
  const pylon=X0=>{const top=P(X0,0,Zp),f0=P(X0,-leg,z0),f1=P(X0,leg,z0);
    [f0,f1].forEach(f=>{line(f,top,'#64748b',R*0.065);line([f[0]-R*0.012,f[1]],[top[0]-R*0.012,top[1]],'#94a3b8',R*0.016);
      line(lerp(f,top,0.7),lerp(f,top,0.92),accent,R*0.07);});
    line(lerp(f0,top,0.28),lerp(f1,top,0.28),'#64748b',R*0.03);
    const d=lerp(lerp(f0,top,0.5),lerp(f1,top,0.5),0.5);                     // diamond sign between the legs
    poly([[d[0],d[1]-R*0.06],[d[0]+R*0.05,d[1]],[d[0],d[1]+R*0.06],[d[0]-R*0.05,d[1]]],accent,'#f8fafc',R*0.012);
    ctx.fillStyle=accent;ctx.beginPath();ctx.arc(top[0],top[1],R*0.06,0,7);ctx.fill();
    ctx.fillStyle=shade(accent,0.45);ctx.beginPath();ctx.arc(top[0]-R*0.018,top[1]-R*0.018,R*0.018,0,7);ctx.fill();};
  pylon(-ax);                                                                  // far pylon
  line(P(-ax,0,Zp),P(ax,0,Zp),'#94a3b8',R*0.045);                              // pivot axle
  // boom: striped beam from the pivot to the rotor hub
  const A0=P(0,0,Zp), H=P(Hc[0],Hc[1],Hc[2]);
  line(A0,H,'#334155',R*0.1);
  for(let i=0;i<9;i++){const a=lerp(A0,H,i/9),b=lerp(A0,H,(i+0.85)/9);line(a,b,i%2?'#f8fafc':accent,R*0.075);}
  // rotor: four arms with pods, sorted back to front
  const items=[], rc=['#ef4444','#facc15','#22c55e','#3b82f6','#f97316','#e2e8f0','#a855f7','#fde047'];
  for(let k=0;k<4;k++){
    const a=rot+k*Math.PI/2, r=[Math.cos(a),Math.sin(a)*e2[1],Math.sin(a)*e2[2]], tg=[-Math.sin(a),Math.cos(a)*e2[1],Math.cos(a)*e2[2]];
    const E=[Hc[0]+r[0]*La,Hc[1]+r[1]*La,Hc[2]+r[2]*La];
    items.push({key:E[0]+E[1]+E[2]*0.9,f:()=>{
      line(H,P(E[0],E[1],E[2]),'#64748b',R*0.04);
      const p0=P(E[0]-tg[0]*R*0.1,E[1]-tg[1]*R*0.1,E[2]-tg[2]*R*0.1),p1=P(E[0]+tg[0]*R*0.1,E[1]+tg[1]*R*0.1,E[2]+tg[2]*R*0.1);
      line(p0,p1,shade(accent,-0.3),R*0.1);line(p0,p1,k%2?accent:'#f8fafc',R*0.075);          // pod bench
      [-1,1].forEach((s,j)=>{const q=P(E[0]+r[0]*R*0.06+tg[0]*s*R*0.05,E[1]+r[1]*R*0.06+tg[1]*s*R*0.05,E[2]+r[2]*R*0.06+tg[2]*s*R*0.05);
        ctx.fillStyle=rc[(k*2+j)%8];ctx.beginPath();ctx.arc(q[0],q[1],R*0.034,0,7);ctx.fill();});}});
  }
  items.sort((u,v)=>u.key-v.key).forEach(it=>it.f());
  ctx.fillStyle=accent;ctx.beginPath();ctx.arc(H[0],H[1],R*0.055,0,7);ctx.fill();                  // rotor hub cap
  ctx.fillStyle=shade(accent,0.45);ctx.beginPath();ctx.arc(H[0]-R*0.016,H[1]-R*0.016,R*0.016,0,7);ctx.fill();
  pylon(ax);                                                                   // near pylon
}

/**
 * drawDiner(ctx, cx, cy, R, opts)
 *  opts.accent : Land color (default Generic white)  -> border, awning stripes, roof, sign
 *  opts.flip   : true when called under ctx.scale(-1,1) (keeps shadows on the same screen side)
 *  opts.tile   : draw the hex tile (default true)
 */
function drawDiner(ctx,cx,cy,R,o={}){
  const accent=o.accent||'#f8fafc', fl=o.flip?-1:1;
  const Q=(X,Y,Z)=>[cx+(X-Y)*0.7, cy+(X+Y)*0.35-Z];
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.012;ctx.stroke();}};
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const x0=-R*0.44,x1=R*0.44,y0=-R*0.24,y1=R*0.24,H=R*0.2,z0=R*0.03;
  if(o.tile!==false){hexPath(ctx,cx,cy,R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();}
  // sidewalk slab + shadow
  poly([Q(-R*0.62,-R*0.5,z0),Q(R*0.62,-R*0.5,z0),Q(R*0.62,R*0.5,z0),Q(-R*0.62,R*0.5,z0)],'#e2e8f0','#94a3b8');
  ctx.save();ctx.translate(fl*R*0.12,R*0.06);
  poly([Q(x0,y0,z0),Q(x1,y0,z0),Q(x1,y1,z0),Q(x0,y1,z0)],'rgba(15,23,42,.22)');ctx.restore();
  // walls: front long face (+Y) and end face (+X)
  poly([Q(x0,y1,z0),Q(x1,y1,z0),Q(x1,y1,H),Q(x0,y1,H)],'#f1f5f9');
  poly([Q(x1,y0,z0),Q(x1,y1,z0),Q(x1,y1,H),Q(x1,y0,H)],'#cbd5e1');
  // accent band under the roofline (front + end)
  poly([Q(x0,y1,R*0.15),Q(x1,y1,R*0.15),Q(x1,y1,H),Q(x0,y1,H)],accent);
  poly([Q(x1,y0,R*0.15),Q(x1,y1,R*0.15),Q(x1,y1,H),Q(x1,y0,H)],shade(accent,-0.25));
  // glass: two front windows, a door, one end window
  const glass=(xa,xb,za,zb)=>{poly([Q(xa,y1,za),Q(xb,y1,za),Q(xb,y1,zb),Q(xa,y1,zb)],'#7dd3fc','#475569',R*0.01);
    poly([Q(xa+(xb-xa)*0.1,y1,zb),Q(xa+(xb-xa)*0.28,y1,zb),Q(xa+(xb-xa)*0.14,y1,za),Q(xa+(xb-xa)*0.04,y1,za)],'rgba(255,255,255,.45)');
    for(let k=1;k<3;k++){const x=xa+(xb-xa)*k/3;line(Q(x,y1,za),Q(x,y1,zb),'#475569',R*0.008);}};
  glass(-R*0.4,-R*0.08,R*0.04,R*0.12);glass(R*0.1,R*0.4,R*0.04,R*0.12);
  poly([Q(-R*0.05,y1,z0),Q(R*0.07,y1,z0),Q(R*0.07,y1,R*0.12),Q(-R*0.05,y1,R*0.12)],shade(accent,-0.55),'#e2e8f0',R*0.01);
  ctx.fillStyle='#fde68a';{const h=Q(R*0.05,y1,R*0.07);ctx.beginPath();ctx.arc(h[0],h[1],R*0.008,0,7);ctx.fill();}
  poly([Q(x1,-R*0.14,R*0.04),Q(x1,R*0.14,R*0.04),Q(x1,R*0.14,R*0.12),Q(x1,-R*0.14,R*0.12)],'#38bdf8','#475569',R*0.01);
  // roof with parapet
  poly([Q(x0,y0,H),Q(x1,y0,H),Q(x1,y1,H),Q(x0,y1,H)],shade(accent,-0.15));
  poly([Q(x0+R*0.04,y0+R*0.04,H),Q(x1-R*0.04,y0+R*0.04,H),Q(x1-R*0.04,y1-R*0.04,H),Q(x0+R*0.04,y1-R*0.04,H)],shade(accent,0.2));
  poly([Q(R*0.22,-R*0.1,H),Q(R*0.32,-R*0.1,H),Q(R*0.32,R*0.0,H),Q(R*0.22,R*0.0,H)],'#94a3b8');          // AC box
  poly([Q(R*0.22,R*0.0,H),Q(R*0.32,R*0.0,H),Q(R*0.32,R*0.0,H+R*0.04),Q(R*0.22,R*0.0,H+R*0.04)],'#64748b');
  // striped awning over the windows
  const n=8,ax0=x0+R*0.02,ax1=x1-R*0.02;
  for(let i=0;i<n;i++){const a=ax0+(ax1-ax0)*i/n,b=ax0+(ax1-ax0)*(i+1)/n;
    poly([Q(a,y1,R*0.17),Q(b,y1,R*0.17),Q(b,y1+R*0.065,R*0.145),Q(a,y1+R*0.065,R*0.145)],i%2?'#f8fafc':accent);}
  // roof sign with "DINER"
  const sa=-R*0.3,sb=R*0.14,sz0=H+R*0.1,sz1=H+R*0.25,sy=-R*0.02;
  [sa+R*0.05,sb-R*0.05].forEach(x=>line(Q(x,sy,H),Q(x,sy,sz0),'#64748b',R*0.02));
  poly([Q(sa,sy,sz0),Q(sb,sy,sz0),Q(sb,sy,sz1),Q(sa,sy,sz1)],accent,'#f8fafc',R*0.014);
  const so=Q(sa,sy,sz1);ctx.save();ctx.transform(0.7,0.35,0,1,so[0],so[1]);
  ctx.fillStyle='#f8fafc';ctx.font='bold '+(R*0.1)+'px Arial Black, Arial, sans-serif';
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('DINER',(sb-sa)/2,R*0.075);ctx.restore();
  // two patio tables with umbrellas (nearer to the viewer, drawn last)
  [[-R*0.2,R*0.42],[R*0.27,R*0.45]].forEach(([X,Y],k)=>{
    const b=Q(X,Y,z0);
    ctx.fillStyle='rgba(15,23,42,.2)';ctx.beginPath();ctx.ellipse(b[0]+fl*R*0.04,b[1]+R*0.01,R*0.08,R*0.035,0,0,7);ctx.fill();
    [[-1,0],[1,0]].forEach(([s])=>{const c=Q(X+s*R*0.09,Y-s*R*0.09,z0);ctx.fillStyle='#64748b';
      ctx.fillRect(c[0]-R*0.012,c[1]-R*0.05,R*0.024,R*0.05);});
    line(b,[b[0],b[1]-R*0.16],'#94a3b8',R*0.014);
    ctx.fillStyle='#e2e8f0';ctx.beginPath();ctx.ellipse(b[0],b[1]-R*0.05,R*0.06,R*0.027,0,0,7);ctx.fill();
    const u=[b[0],b[1]-R*0.19];
    ctx.fillStyle=k?'#f8fafc':accent;ctx.beginPath();ctx.ellipse(u[0],u[1],R*0.11,R*0.05,0,0,7);ctx.fill();
    ctx.fillStyle=k?accent:'#f8fafc';ctx.beginPath();ctx.ellipse(u[0],u[1],R*0.06,R*0.027,0,0,7);ctx.fill();
    ctx.strokeStyle=shade(accent,-0.3);ctx.lineWidth=R*0.008;ctx.beginPath();ctx.ellipse(u[0],u[1],R*0.11,R*0.05,0,0,7);ctx.stroke();
  });
}

/**
 * drawDiskO(ctx, cx, cy, R, opts)  -- the small Zamperla Disk'O: a spinning disc of outward-facing riders rocking along a short half-pipe
 *  opts.accent : Land color (default Generic white) -> hex border, tower caps, rail trim, disc rings, seats, fence rail
 *  opts.s      : disc position along the half-pipe, -1 (far end) .. +1 (near end)
 *  opts.r      : disc spin angle in radians
 *  opts.flip   : true when called under ctx.scale(-1,1) (keeps shadows on the same screen side)
 *  opts.tile   : draw the hex tile (default true)
 */
function drawDiskO(ctx,cx,cy,R,o={}){
  const accent=o.accent||'#f8fafc', sd=o.s==null?-0.45:o.s, rot=o.r==null?0.4:o.r, fl=o.flip?-1:1, r=v=>R*v, TAU=Math.PI*2;
  const P=(X,Y,Z)=>[cx+(X-Y)*0.7, cy+(X+Y)*0.35-Z];
  const P3=v=>P(v[0],v[1],v[2]);
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=fill;ctx.lineWidth=0.8;ctx.stroke();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.stroke();}};
  const disc=(p,rr,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(p[0],p[1],rr,0,7);ctx.fill();};
  const z0=r(0.035), xe=r(0.5), zl=r(0.09), zh=r(0.6), hw=r(0.1);
  const zf=x=>zl+(zh-zl)*Math.pow(Math.min(1,Math.abs(x)/xe),2.3);
  const slope=x=>{const e=r(0.004);return Math.atan2(zf(x+e)-zf(x-e),2*e);};
  if(o.tile!==false){hexPath(ctx,cx,cy,R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();}
  const sx=r(0.62),sy=r(0.42);poly([P(-sx,-sy,z0),P(sx,-sy,z0),P(sx,sy,z0),P(-sx,sy,z0)],'#e2e8f0','#94a3b8',R*0.012);
  // loading platform beside the low point, with an accent edge
  poly([P(-r(0.22),r(0.13),z0),P(r(0.22),r(0.13),z0),P(r(0.22),r(0.3),z0),P(-r(0.22),r(0.3),z0)],'#cbd5e1','#94a3b8',R*0.01);
  poly([P(-r(0.22),r(0.13),z0),P(r(0.22),r(0.13),z0),P(r(0.22),r(0.13),z0+r(0.02)),P(-r(0.22),r(0.13),z0+r(0.02))],accent);
  const items=[];
  const tower=(X0,k)=>{const top=zh+r(0.2);items.push({k:k,f:()=>{
    [-1,1].forEach(s=>{const b=P(X0,s*hw*0.9,z0),t=P(X0,s*hw*0.9,top);line(b,t,'#1f2937',r(0.04));line([b[0]-r(0.008),b[1]],[t[0]-r(0.008),t[1]],'#475569',r(0.01));});
    for(let m=1;m<=9;m++){const z=z0+(top-z0)*m/10;line(P(X0,-hw*0.9,z),P(X0,hw*0.9,z),'#374151',r(0.014));}
    for(let m=0;m<8;m++){const z0b=z0+(top-z0)*m/10,z1b=z0+(top-z0)*(m+1)/10;line(P(X0,m%2?-hw*0.9:hw*0.9,z0b),P(X0,m%2?hw*0.9:-hw*0.9,z1b),'#374151',r(0.01));}
    const bk=P(X0+Math.sign(X0)*r(0.26),0,z0);line(P(X0,0,top-r(0.02)),bk,'#1f2937',r(0.026));
    const t0=P(X0,-hw*1.1,top),t1=P(X0,hw*1.1,top);poly([t0,t1,[t1[0],t1[1]-r(0.05)],[t0[0],t0[1]-r(0.05)]],accent,'#f8fafc',R*0.01);
    disc([P(X0,0,top)[0],P(X0,0,top)[1]-r(0.075)],r(0.016),'#fde68a');}});};
  tower(-xe-r(0.05),-9);
  // the half-pipe trough in segments, with timber-free steel bents underneath
  const n=70;for(let i=0;i<n;i++){const xa=-xe+2*xe*i/n,xb=-xe+2*xe*(i+1)/n,za=zf(xa),zb=zf(xb);
    items.push({k:xa,f:()=>{
      if(i%11===5&&za>r(0.14)){[-1,1].forEach(s=>{line(P(xa,s*hw*0.85,z0),P(xa,s*hw*0.85,za-r(0.03)),'#475569',r(0.03));});
        line(P(xa,-hw*0.85,z0+r(0.04)),P(xa,hw*0.85,(za-r(0.03))*0.6+z0*0.4),'#64748b',r(0.012));line(P(xa,hw*0.85,z0+r(0.04)),P(xa,-hw*0.85,(za-r(0.03))*0.6+z0*0.4),'#64748b',r(0.012));}
      const th=r(0.03);
      poly([P(xa,hw,za),P(xb,hw,zb),[P(xb,hw,zb)[0],P(xb,hw,zb)[1]+th],[P(xa,hw,za)[0],P(xa,hw,za)[1]+th]],'#475569');   // near wall
      poly([P(xa,-hw,za),P(xb,-hw,zb),P(xb,hw,zb),P(xa,hw,za)],i%2?'#64748b':'#6b7a90');                                   // deck
      line(P(xa,0,za),P(xb,0,zb),accent,r(0.012));
      line(P(xa,hw,za),P(xb,hw,zb),'#cbd5e1',r(0.01));line(P(xa,-hw,za),P(xb,-hw,zb),'#cbd5e1',r(0.01));
    }});}
  // the disc, tilted to follow the pipe
  const xd=sd*xe*0.96, g=slope(xd), Tn=[Math.cos(g),0,Math.sin(g)], Nn=[-Math.sin(g),0,Math.cos(g)], Rd=r(0.235);
  const Cd=[xd+Nn[0]*r(0.075),0+Nn[1]*r(0.075),zf(xd)+Nn[2]*r(0.075)], e1=[0,1,0], e2=Tn;
  const ptd=(rad,a)=>P3([Cd[0]+rad*(Math.cos(a)*e1[0]+Math.sin(a)*e2[0]),Cd[1]+rad*(Math.cos(a)*e1[1]+Math.sin(a)*e2[1]),Cd[2]+rad*(Math.cos(a)*e1[2]+Math.sin(a)*e2[2])]);
  const circ=rad=>{const p=[];for(let s=0;s<=36;s++)p.push(ptd(rad,s/36*TAU));return p;};
  items.push({k:xd+r(0.02),f:()=>{
    const under=P3([Cd[0]-Nn[0]*r(0.035),Cd[1]-Nn[1]*r(0.035),Cd[2]-Nn[2]*r(0.035)]),top=P3(Cd),off=[top[0]-under[0],top[1]-under[1]];
    const sh=P(xd,0,z0);ctx.fillStyle='rgba(15,23,42,.18)';ctx.beginPath();ctx.ellipse(sh[0]+fl*zf(xd)*0.25,sh[1]+zf(xd)*0.12,r(0.25),r(0.1),0,0,7);ctx.fill();
    poly(circ(Rd).map(p=>[p[0]-off[0],p[1]-off[1]]),'#1f2937');
    poly(circ(Rd),'#334155');poly(circ(Rd*0.93),'#e2e8f0');poly(circ(Rd*0.66),accent);poly(circ(Rd*0.4),'#f8fafc');poly(circ(Rd*0.2),shade(accent,-0.4));
    const seats=[],rc=['#ef4444','#facc15','#3b82f6','#f97316','#22c55e','#e2e8f0'];
    for(let k=0;k<24;k++){const a=rot+k*TAU/24,rad=[Math.cos(a)*e1[0]+Math.sin(a)*e2[0],Math.cos(a)*e1[1]+Math.sin(a)*e2[1],Math.cos(a)*e1[2]+Math.sin(a)*e2[2]];
      const S=[Cd[0]+rad[0]*Rd*0.78,Cd[1]+rad[1]*Rd*0.78,Cd[2]+rad[2]*Rd*0.78];seats.push({k,S,key:S[0]+S[1]+S[2]*0.9,rad});}
    const up=(v,m)=>[v[0]+Nn[0]*m,v[1]+Nn[1]*m,v[2]+Nn[2]*m];
    seats.sort((a,b)=>a.key-b.key).forEach(s=>{const b0=P3(up(s.S,r(0.01))),b1=P3(up(s.S,r(0.03))),t0=P3(up(s.S,r(0.075))),h=P3(up(s.S,r(0.1)));
      line(b0,b1,s.k%2?accent:'#f8fafc',r(0.044));line(b1,t0,rc[s.k%6],r(0.042));disc(h,r(0.026),'#fde4c8');});
    disc(P3(up(Cd,r(0.015))),r(0.06),'#475569');disc(P3(up(Cd,r(0.022))),r(0.044),accent);}});
  tower(xe+r(0.05),9);
  items.sort((a,b)=>a.k-b.k).forEach(it=>it.f());
  [[-sx,sy,sx,sy],[sx,-sy,sx,sy]].forEach(([x0,y0,x1,y1])=>{const m=14;for(let k=0;k<=m;k++){const t=k/m,X=x0+(x1-x0)*t,Y=y0+(y1-y0)*t;line(P(X,Y,z0),P(X,Y,z0+r(0.07)),'#334155',R*0.01);}
    line(P(x0,y0,z0+r(0.07)),P(x1,y1,z0+r(0.07)),accent,R*0.014);});
  [[-0.56,0.4],[0.56,0.4]].forEach(([X,Y])=>{const b=P(r(X),r(Y),z0),t=P(r(X),r(Y),r(0.18));line(b,t,'#334155',R*0.014);disc(t,R*0.02,'#fde68a');});
}

function prism(ctx,cx,by,w,d,h,col){ // iso box, base-center (cx,by), half-width w, depth d, height h
  const ty=by-h;
  ctx.fillStyle=shade(col,-0.35); ctx.beginPath(); // left face
  ctx.moveTo(cx-w,by);ctx.lineTo(cx,by+d);ctx.lineTo(cx,ty+d);ctx.lineTo(cx-w,ty);ctx.fill();
  ctx.fillStyle=shade(col,-0.1); ctx.beginPath(); // right face
  ctx.moveTo(cx+w,by);ctx.lineTo(cx,by+d);ctx.lineTo(cx,ty+d);ctx.lineTo(cx+w,ty);ctx.fill();
  ctx.fillStyle=shade(col,0.2); ctx.beginPath(); // top
  ctx.moveTo(cx-w,ty);ctx.lineTo(cx,ty-d);ctx.lineTo(cx+w,ty);ctx.lineTo(cx,ty+d);ctx.fill();
}
/**
 * drawDropTower(ctx, cx, cy, R, opts)
 *  cx,cy : hex center   R : hex radius in px
 *  opts.accent : Land color (default white #f8fafc for Generic)
 *  opts.levels : tower height 1-10     opts.t : gondola position 0 (bottom) .. 1 (top)
 *  opts.tile   : draw the hex tile (default true)
 */
function drawDropTower(ctx,cx,cy,R,opts={}){
  const accent=opts.accent||'#f8fafc', levels=opts.levels||5, t=opts.t==null?1:opts.t;
  const steel='#94a3b8', w=R*0.2, d=w*0.5, seg=R*0.24, plinth=R*0.1;
  const H=seg*(levels+1);                       // mast height
  const baseY=cy+d;                             // mast foot
  if(opts.tile!==false){
    hexPath(ctx,cx,cy,R); ctx.fillStyle='#cbd5e1'; ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06); ctx.strokeStyle=accent; ctx.stroke();
    ctx.save(); hexPath(ctx,cx,cy,R*0.97); ctx.clip();       // shadow, clipped to tile
    ctx.fillStyle='rgba(15,23,42,.28)'; ctx.beginPath();
    const sx=Math.min(H*0.45,R*0.95), sy=sx*0.35;
    ctx.moveTo(cx-w,baseY-d);ctx.lineTo(cx,baseY);ctx.lineTo(cx+w,baseY-d);
    ctx.lineTo(cx+w+sx,baseY-d+sy);ctx.lineTo(cx+sx,baseY+sy);ctx.lineTo(cx-w+sx,baseY-d+sy);ctx.fill();
    ctx.restore();
  }
  prism(ctx,cx,baseY+d*0.4,w*1.8,d*1.8,plinth,'#64748b');   // plinth
  const y0=baseY-plinth+d*0.4, top=y0-H;
  // gondola geometry + BACK half of the ring (drawn behind the mast so it wraps)
  const gy=y0-seg*0.2-t*(H-seg*1.4), gw=w*1.75, gd=d*1.75, bh=R*0.1;
  ctx.fillStyle=shade(accent,-0.55); ctx.beginPath();
  ctx.moveTo(cx-gw,gy);ctx.lineTo(cx,gy-gd);ctx.lineTo(cx,gy-gd-bh);ctx.lineTo(cx-gw,gy-bh);ctx.fill();
  ctx.fillStyle=shade(accent,-0.4); ctx.beginPath();
  ctx.moveTo(cx+gw,gy);ctx.lineTo(cx,gy-gd);ctx.lineTo(cx,gy-gd-bh);ctx.lineTo(cx+gw,gy-bh);ctx.fill();
  // mast faces: steel panels + X-bracing
  ctx.fillStyle='#475569'; ctx.beginPath();
  ctx.moveTo(cx-w,y0);ctx.lineTo(cx,y0+d);ctx.lineTo(cx,top+d);ctx.lineTo(cx-w,top);ctx.fill();
  ctx.fillStyle='#64748b'; ctx.beginPath();
  ctx.moveTo(cx+w,y0);ctx.lineTo(cx,y0+d);ctx.lineTo(cx,top+d);ctx.lineTo(cx+w,top);ctx.fill();
  ctx.strokeStyle=steel; ctx.lineWidth=Math.max(1,R*0.022);
  for(let i=0;i<=levels;i++){
    const a=y0-i*seg, b=a-seg;
    [[-1,0],[1,0]].forEach(([s])=>{
      const x0=cx, x1=cx+s*w, ya0=a+d, ya1=a, yb0=b+d, yb1=b;
      ctx.beginPath();ctx.moveTo(x0,ya0);ctx.lineTo(x1,yb1);ctx.moveTo(x1,ya1);ctx.lineTo(x0,yb0);ctx.stroke();
      ctx.beginPath();ctx.moveTo(x0,yb0);ctx.lineTo(x1,yb1);ctx.stroke();
    });
  }
  ctx.lineWidth=Math.max(2,R*0.045);               // corner posts
  [[cx-w,0],[cx,d],[cx+w,0]].forEach(([x,o])=>{ctx.beginPath();ctx.moveTo(x,y0+o);ctx.lineTo(x,top+o);ctx.stroke();});
  // accent stripes: one band per ~3 levels, in Land color
  for(let i=2;i<=levels;i+=3){
    const a=y0-i*seg; ctx.fillStyle=accent;
    ctx.fillRect(cx-w,a-seg*0.18-0,w,seg*0.18); ctx.fillRect(cx,a-seg*0.18+d*0.0,w,seg*0.18);
    ctx.fillStyle=shade(accent,-0.25); ctx.beginPath();
    ctx.moveTo(cx-w,a);ctx.lineTo(cx,a+d);ctx.lineTo(cx,a+d-seg*0.18);ctx.lineTo(cx-w,a-seg*0.18);ctx.fill();
  }
  // gondola FRONT half: extruded V band wrapping the mast, riders hanging on the outside
  ctx.fillStyle=shade(accent,-0.3); ctx.beginPath();
  ctx.moveTo(cx-gw,gy);ctx.lineTo(cx,gy+gd);ctx.lineTo(cx,gy+gd-bh);ctx.lineTo(cx-gw,gy-bh);ctx.fill();
  ctx.fillStyle=shade(accent,-0.05); ctx.beginPath();
  ctx.moveTo(cx+gw,gy);ctx.lineTo(cx,gy+gd);ctx.lineTo(cx,gy+gd-bh);ctx.lineTo(cx+gw,gy-bh);ctx.fill();
  ctx.strokeStyle=shade(accent,0.45); ctx.lineWidth=Math.max(1,R*0.022); ctx.beginPath();
  ctx.moveTo(cx-gw,gy-bh);ctx.lineTo(cx,gy+gd-bh);ctx.lineTo(cx+gw,gy-bh);ctx.stroke();
  const rc=['#ef4444','#facc15','#22c55e','#3b82f6','#a855f7'];
  [-0.9,0.9,-0.45,0.45,0].forEach((u,i)=>{          // outer riders first, front rider last
    const x=cx+u*gw, yb=gy+gd*(1-Math.abs(u)), r=R*0.035;
    ctx.fillStyle='#1e293b'; ctx.fillRect(x-r*0.9,yb+R*0.13,r*0.8,R*0.07); ctx.fillRect(x+r*0.1,yb+R*0.13,r*0.8,R*0.07);
    ctx.fillStyle=rc[i]; ctx.fillRect(x-r,yb+R*0.045,r*2,R*0.09);
    ctx.fillStyle='#fde4c8'; ctx.beginPath(); ctx.arc(x,yb+R*0.03,r,0,7); ctx.fill();
  });
  // roof cap + spire
  prism(ctx,cx,top+d*0.2,w*1.35,d*1.35,R*0.1,accent);
  ctx.strokeStyle=steel; ctx.lineWidth=Math.max(1.5,R*0.03);
  ctx.beginPath();ctx.moveTo(cx,top-R*0.1);ctx.lineTo(cx,top-R*0.1-R*0.28);ctx.stroke();
  ctx.fillStyle=shade(accent,0.35); ctx.beginPath();ctx.arc(cx,top-R*0.1-R*0.3,R*0.045,0,7);ctx.fill();
}

/**
 * drawEnterprise(ctx, cx, cy, R, opts)
 *  opts.accent : Land color (default Generic white)
 *  opts.t      : wheel spin angle in radians
 *  opts.tilt   : wheel tilt, 0 = lying flat (loading), ~1.35 = nearly vertical (full ride)
 *  opts.flip   : true when called under ctx.scale(-1,1) (keeps shadows on the same screen side)
 */
function drawEnterprise(ctx,cx,cy,R,opts={}){
  const accent=opts.accent||'#f8fafc', spin=opts.t==null?0.5:opts.t, al=opts.tilt==null?1.15:opts.tilt;
  const fl=opts.flip?-1:1, sa=Math.sin(al), ca=Math.cos(al);
  const P=(X,Y,Z)=>[cx+(X-Y)*0.7, cy+(X+Y)*0.35-Z];
  const Rw=R*0.52, Zh=R*0.17+Rw*sa, N=10;
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const rim=th=>[Rw*Math.cos(th),Rw*Math.sin(th)*ca,Zh+Rw*Math.sin(th)*sa];     // 3D point on the rim
  if(opts.tile!==false){
    hexPath(ctx,cx,cy,R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();
  }
  // concrete slab + wheel shadow
  const sx=R*0.64, sy=R*0.4, z0=R*0.035;
  ctx.beginPath();[[-sx,-sy],[sx,-sy],[sx,sy],[-sx,sy]].forEach(([X,Y],i)=>{const p=P(X,Y,z0);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});
  ctx.closePath();ctx.fillStyle='#94a3b8';ctx.fill();ctx.strokeStyle='#64748b';ctx.lineWidth=R*0.012;ctx.stroke();
  ctx.fillStyle='rgba(15,23,42,.2)';ctx.beginPath();
  for(let i=0;i<=48;i++){const q=rim(i/48*2*Math.PI),p=P(q[0],q[1],z0);
    const x=p[0]+fl*q[2]*0.32,y=p[1]+q[2]*0.16;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
  ctx.fill();
  // base block + lift arm (hidden mostly behind the wheel)
  const bb=P(0,-R*0.5,z0);
  prism(ctx,bb[0],bb[1],R*0.1,R*0.05,R*0.2,'#64748b');
  const hub=P(0,0,Zh), top=P(0,-R*0.5,R*0.2);
  line(top,hub,'#475569',R*0.075);line([top[0]-R*0.012,top[1]],[hub[0]-R*0.012,hub[1]],'#94a3b8',R*0.02);
  // rim ring
  ctx.strokeStyle='#94a3b8';ctx.lineWidth=R*0.035;ctx.lineJoin='round';ctx.beginPath();
  for(let i=0;i<=64;i++){const q=rim(i/64*2*Math.PI),p=P(q[0],q[1],q[2]);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}
  ctx.stroke();
  // spokes + gondolas, sorted back to front
  const items=[], rc=['#ef4444','#facc15','#22c55e','#3b82f6','#f97316','#e2e8f0'];
  for(let k=0;k<N;k++){
    const th=spin+k*2*Math.PI/N, r=[Math.cos(th),Math.sin(th)*ca,Math.sin(th)*sa];
    const G=P(r[0]*(Rw+R*0.06),r[1]*(Rw+R*0.06),Zh+r[2]*(Rw+R*0.06)), H=P(0,0,Zh);
    const ang=Math.atan2(G[1]-H[1],G[0]-H[0]);
    items.push({key:r[0]*Rw+r[1]*Rw+(Zh+r[2]*Rw)*0.9,f:()=>{
      line(H,P(r[0]*Rw,r[1]*Rw,Zh+r[2]*Rw),'#64748b',R*0.032);
      ctx.save();ctx.translate(G[0],G[1]);ctx.rotate(ang);
      ctx.fillStyle=k%2?shade(accent,-0.25):accent;ctx.fillRect(-R*0.075,-R*0.05,R*0.15,R*0.1);
      ctx.fillStyle=shade(accent,-0.6);ctx.fillRect(-R*0.057,-R*0.034,R*0.114,R*0.068);
      [-1,1].forEach((s,j)=>{ctx.fillStyle=rc[(k+j*3)%6];ctx.beginPath();ctx.arc(s*R*0.026,0,R*0.028,0,7);ctx.fill();});
      ctx.restore();}});
  }
  items.sort((a,b)=>a.key-b.key).forEach(it=>it.f());
  // hub on top
  const nw=[0,-sa,ca];
  line(P(-nw[0]*R*0.1,-nw[1]*R*0.1,Zh-nw[2]*R*0.1),P(nw[0]*R*0.1,nw[1]*R*0.1,Zh+nw[2]*R*0.1),'#64748b',R*0.05);
  ctx.fillStyle=accent;ctx.beginPath();ctx.arc(hub[0],hub[1],R*0.07,0,7);ctx.fill();
  ctx.fillStyle=shade(accent,0.45);ctx.beginPath();ctx.arc(hub[0]-R*0.02,hub[1]-R*0.02,R*0.022,0,7);ctx.fill();
}

/**
 * drawFerrisWheel(ctx, cx, cy, R, opts)
 *  opts.accent : Land color (default Generic white) -> hex border, rim stripe, hub cap, leg stripes, cabins
 *  opts.t      : wheel rotation in radians (cabins always hang upright)
 *  opts.flip   : true when called under ctx.scale(-1,1) (keeps shadows on the same screen side)
 */
function drawFerrisWheel(ctx,cx,cy,R,o={}){
  const accent=o.accent||'#f8fafc', th=o.t==null?0.3:o.t, fl=o.flip?-1:1;
  const P=(X,Y,Z)=>[cx+(X-Y)*0.7, cy+(X+Y)*0.35-Z];
  const Zh=R*0.62, Rw=R*0.5, yw=R*0.07, ya=R*0.15, N=12, z0=R*0.035;
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
  const rim=(a,Y)=>P(Rw*Math.cos(a),Y,Zh+Rw*Math.sin(a));
  if(o.tile!==false){hexPath(ctx,cx,cy,R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();}
  // slab + wheel shadow
  const sx=R*0.58,sy=R*0.34;ctx.beginPath();
  [[-sx,-sy],[sx,-sy],[sx,sy],[-sx,sy]].forEach(([X,Y],i)=>{const p=P(X,Y,z0);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});
  ctx.closePath();ctx.fillStyle='#94a3b8';ctx.fill();ctx.strokeStyle='#64748b';ctx.lineWidth=R*0.012;ctx.stroke();
  ctx.fillStyle='rgba(15,23,42,.2)';ctx.beginPath();
  for(let i=0;i<=48;i++){const a=i/48*2*Math.PI,Z=Zh+Rw*Math.sin(a),p=P(Rw*Math.cos(a),0,z0);
    const x=p[0]+fl*Z*0.3,y=p[1]+Z*0.15;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
  ctx.fill();
  // A-frame support at depth Y
  const aframe=Y=>{const top=P(0,Y,Zh),f0=P(-R*0.38,Y,z0),f1=P(R*0.38,Y,z0);
    [f0,f1].forEach(f=>{line(f,top,'#64748b',R*0.05);line([f[0]-R*0.01,f[1]],[top[0]-R*0.01,top[1]],'#94a3b8',R*0.014);
      line(lerp(f,top,0.7),lerp(f,top,0.92),accent,R*0.054);
      ctx.fillStyle='#475569';ctx.beginPath();ctx.ellipse(f[0],f[1],R*0.05,R*0.022,0,0,7);ctx.fill();});
    line(lerp(f0,top,0.28),lerp(f1,top,0.28),'#64748b',R*0.028);};
  // wheel layer: rim ring, spokes, tie rods
  const ring=(Y,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineJoin='round';ctx.beginPath();
    for(let i=0;i<=64;i++){const p=rim(i/64*2*Math.PI,Y);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();};
  const spokes=(Y,c)=>{for(let k=0;k<N;k++)line(P(0,Y,Zh),rim(th+k*2*Math.PI/N,Y),c,R*0.012);};
  aframe(-ya);                                                    // back support
  line(P(0,-ya,Zh),P(0,ya,Zh),'#94a3b8',R*0.05);                  // axle
  ring(-yw,'#64748b',R*0.03);spokes(-yw,'#64748b');
  for(let k=0;k<N;k++)line(rim(th+k*2*Math.PI/N,-yw),rim(th+k*2*Math.PI/N,yw),'#94a3b8',R*0.01);
  // cabins hang upright from the rim at mid-depth
  const cols=[accent,'#f8fafc','#facc15'];
  const cab=[];for(let k=0;k<N;k++){const a=th+k*2*Math.PI/N,c=rim(a,0);cab.push({c,k});}
  cab.sort((u,v)=>u.c[1]-v.c[1]).forEach(({c,k})=>{
    line(c,[c[0],c[1]+R*0.03],'#475569',R*0.01);
    prism(ctx,c[0],c[1]+R*0.09,R*0.036,R*0.018,R*0.055,cols[k%3]);
    ctx.fillStyle='#7dd3fc';ctx.fillRect(c[0]-R*0.014,c[1]+R*0.05,R*0.028,R*0.018);});
  spokes(yw,'#cbd5e1');
  ring(yw,'#cbd5e1',R*0.034);ring(yw,accent,R*0.014);
  for(let i=0;i<24;i++){const p=rim(th+i*Math.PI/12,yw);                       // rim lights
    ctx.fillStyle=(i+Math.floor(th*3))%2?'#fef08a':'#fb923c';ctx.beginPath();ctx.arc(p[0],p[1],R*0.011,0,7);ctx.fill();}
  aframe(ya);                                                      // front support
  const h=P(0,ya,Zh);ctx.fillStyle=accent;ctx.beginPath();ctx.arc(h[0],h[1],R*0.065,0,7);ctx.fill();
  ctx.fillStyle=shade(accent,0.45);ctx.beginPath();ctx.arc(h[0]-R*0.02,h[1]-R*0.02,R*0.02,0,7);ctx.fill();
}

/**
 * drawFlyerRide(ctx, cx, cy, R, opts)  -- generic "hanging pods on lifting arms" ride (Dumbo / magic carpet style)
 *  opts.accent : Land color (default Generic white) -> hex border, tower stripes, canopy, arm stripes, pods, fence rail
 *  opts.t      : spin angle in radians (the pods circle the tower)
 *  opts.fly    : 0..1 how high the arms lift the pods (0 = low to the ground, 1 = fully raised)
 *  opts.tm     : time in seconds for the flag (defaults to 0)
 *  opts.flip   : true when called under ctx.scale(-1,1) (keeps shadows on the same screen side)
 *  opts.tile   : draw the hex tile (default true)
 */
function drawFlyerRide(ctx,cx,cy,R,o={}){
  const accent=o.accent||'#f8fafc', rot=o.t==null?0.4:o.t, fly=o.fly==null?0.55:o.fly, tm=o.tm==null?0:o.tm, fl=o.flip?-1:1, r=v=>R*v, TAU=Math.PI*2;
  const P=(X,Y,Z)=>[cx+(X-Y)*0.7, cy+(X+Y)*0.35-Z];
  const g=(rr,a,Z)=>P(rr*Math.cos(a),rr*Math.sin(a),Z);
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.stroke();}};
  const disc=(p,rr,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(p[0],p[1],rr,0,7);ctx.fill();};
  const ell=(p,rr,fill)=>{ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(p[0],p[1],0.99*rr,0.495*rr,0,0,7);ctx.fill();};
  const cyl=(rr,Z,h,col)=>{const p=P(0,0,Z);ell(p,rr,shade(col,-0.25));ctx.fillStyle=shade(col,-0.08);ctx.fillRect(p[0]-0.99*rr,p[1]-h,1.98*rr,h);ell([p[0],p[1]-h],rr,shade(col,0.15));};
  const z0=r(0.03), Zh=r(0.46), La=r(0.5), rod=r(0.13), N=6, cream='#fde8c0';
  if(o.tile!==false){hexPath(ctx,cx,cy,R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();}
  const gp=P(0,0,z0);ell(gp,r(0.8),'#e2e8f0');ctx.strokeStyle='#94a3b8';ctx.lineWidth=R*0.012;ctx.beginPath();ctx.ellipse(gp[0],gp[1],0.99*r(0.8),0.495*r(0.8),0,0,7);ctx.stroke();
  // fence, back half first
  const post=a=>{const b=g(r(0.74),a,z0),t=g(r(0.74),a,z0+r(0.07));line(b,t,'#475569',R*0.01);};
  for(let a=-Math.PI*0.75;a<Math.PI*0.25;a+=TAU/46)post(a);
  // pods: each hangs from the end of an arm; arm elevation follows the fly amount
  const pods=[],pal=[accent,'#f8fafc','#facc15'];
  for(let k=0;k<N;k++){const a=rot+k*TAU/N,el=-0.36+fly*(0.74+0.1*Math.sin(rot*2+k*1.3))-0.1*(1-fly)*0,ce=Math.cos(el),se=Math.sin(el);
    const E=[La*ce*Math.cos(a),La*ce*Math.sin(a),Zh+La*se],D=[E[0],E[1],E[2]-rod];
    pods.push({k,a,E,D,key:E[0]+E[1],col:pal[k%3]});}
  // shadows on the ground, always behind everything else
  pods.forEach(p=>{const s=P(p.D[0],p.D[1],z0);ctx.fillStyle='rgba(15,23,42,.12)';ctx.beginPath();ctx.ellipse(s[0]+fl*(p.D[2])*0.2,s[1]+p.D[2]*0.1,r(0.12),r(0.05),0,0,7);ctx.fill();});
  const H=P(0,0,Zh);
  const drawPod=p=>{const Ep=P(p.E[0],p.E[1],p.E[2]),C=P(p.D[0],p.D[1],p.D[2]),a=p.a;
    line(H,Ep,'#475569',r(0.062));line(H,Ep,'#94a3b8',r(0.046));line(lerp(H,Ep,0.15),lerp(H,Ep,0.4),accent,r(0.05));
    function lerp(u,v,t){return[u[0]+(v[0]-u[0])*t,u[1]+(v[1]-u[1])*t];}
    line(Ep,[C[0],C[1]-r(0.03)],'#64748b',r(0.014));disc(Ep,r(0.016),'#334155');                                     // arm end + hanger
    const tx=(-Math.sin(a)-Math.cos(a))*0.7,ty=(-Math.sin(a)+Math.cos(a))*0.35,tl=Math.hypot(tx,ty),sc=Math.max(0.55,tl/0.99),ux=tx/tl,uy=ty/tl;
    // tail fin, body, cockpit, two riders
    poly([[C[0]-ux*r(0.1)*sc,C[1]-uy*r(0.1)*sc],[C[0]-ux*r(0.165)*sc,C[1]-uy*r(0.165)*sc-r(0.06)],[C[0]-ux*r(0.13)*sc,C[1]-uy*r(0.13)*sc+r(0.016)]],shade(p.col,-0.2),shade(p.col,-0.4),R*0.006);
    ctx.save();ctx.translate(C[0],C[1]);ctx.rotate(Math.atan2(uy,ux));
    ctx.fillStyle=shade(p.col,-0.3);ctx.beginPath();ctx.ellipse(0,r(0.012),r(0.115)*sc,r(0.058),0,0,7);ctx.fill();
    ctx.fillStyle=p.col;ctx.beginPath();ctx.ellipse(0,0,r(0.115)*sc,r(0.058),0,0,7);ctx.fill();
    ctx.fillStyle=shade(p.col,-0.55);ctx.beginPath();ctx.ellipse(r(0.005)*sc,-r(0.005),r(0.074)*sc,r(0.036),0,0,7);ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=R*0.007;ctx.beginPath();ctx.ellipse(0,-r(0.003),r(0.108)*sc,r(0.052),0,Math.PI*1.1,Math.PI*1.7);ctx.stroke();
    ctx.restore();
    [-1,1].forEach(s=>{const hx=C[0]+ux*s*r(0.032)*sc,hy=C[1]+uy*s*r(0.032)*sc-r(0.034);
      ctx.fillStyle=['#3b82f6','#ef4444','#22c55e','#f97316','#a855f7','#e2e8f0'][(p.k*2+(s>0?1:0))%6];ctx.fillRect(hx-r(0.016),hy,r(0.032),r(0.034));disc([hx,hy-r(0.008)],r(0.024),'#fde4c8');});};
  pods.filter(p=>p.key<0).sort((u,v)=>u.key-v.key).forEach(drawPod);
  // central tower: wide base, striped column, hub with a striped canopy
  cyl(r(0.22),z0,r(0.05),'#cbd5e1');
  const tr=r(0.13),tb=P(0,0,z0+r(0.05)),th=Zh-z0-r(0.05);
  ctx.fillStyle=cream;ctx.fillRect(tb[0]-0.99*tr,tb[1]-th,1.98*tr,th);ell(tb,tr,shade(cream,-0.2));
  for(let i=0;i<8;i++){const a0=-Math.PI/4+i*Math.PI/8,a1=a0+Math.PI/8;poly([g(tr,a0,z0+r(0.05)),g(tr,a1,z0+r(0.05)),g(tr,a1,Zh),g(tr,a0,Zh)],i%2?cream:accent);}
  cyl(r(0.17),Zh-r(0.02),r(0.05),accent);
  const apex=P(0,0,Zh+r(0.2));
  for(let i=0;i<12;i++){const a0=i*TAU/12,a1=a0+TAU/12;ctx.fillStyle=i%2?'#f8fafc':accent;ctx.beginPath();ctx.moveTo(apex[0],apex[1]);
    for(let s=0;s<=3;s++){const q=g(r(0.2),a0+(a1-a0)*s/3,Zh+r(0.03));ctx.lineTo(q[0],q[1]);}ctx.closePath();ctx.fill();}
  ctx.strokeStyle=shade(accent,-0.3);ctx.lineWidth=R*0.008;ctx.beginPath();for(let s=0;s<=40;s++){const q=g(r(0.2),s/40*TAU,Zh+r(0.03));s?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();
  const ft=P(0,0,Zh+r(0.3));line(apex,ft,'#fbbf24',R*0.012);
  poly([ft,[ft[0]+r(0.09),ft[1]+r(0.012)+Math.sin(tm*3)*r(0.008)],[ft[0]+r(0.07),ft[1]+r(0.032)+Math.sin(tm*3+1)*r(0.008)],[ft[0]+r(0.09),ft[1]+r(0.052)+Math.sin(tm*3+2)*r(0.008)],[ft[0],ft[1]+r(0.04)]],accent,shade(accent,-0.3),R*0.006);
  pods.filter(p=>p.key>=0).sort((u,v)=>u.key-v.key).forEach(drawPod);
  for(let a=Math.PI*0.25;a<=Math.PI*1.25;a+=TAU/46)post(a);
  ctx.strokeStyle=accent;ctx.lineWidth=R*0.012;ctx.beginPath();for(let s=0;s<=60;s++){const a=Math.PI*0.25+Math.PI*s/60,q=g(r(0.74),a,z0+r(0.07));s?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();
}

/**
 * drawGiantDiscovery(ctx, cx, cy, R, opts)  -- pendulum arm between two towers, carrying a big round disc with riders seated around its edge
 *  opts.accent : Land color (default Generic white) -> hex border, tower stripes + signs + caps, boom stripes, disc rings, seats, fence rail
 *  opts.t      : boom (pendulum) angle in radians (0 = hanging straight down, about +-2 = swung high either side)
 *  opts.r      : disc spin angle in radians
 *  opts.flip   : true when called under ctx.scale(-1,1) (keeps shadows on the same screen side)
 *  opts.tile   : draw the hex tile (default true)
 */
function drawGiantDiscovery(ctx,cx,cy,R,o={}){
  const accent=o.accent||'#f8fafc', ph=o.t==null?1.5:o.t, rot=o.r==null?0.4:o.r, fl=o.flip?-1:1, r=v=>R*v, TAU=Math.PI*2;
  const P=(X,Y,Z)=>[cx+(X-Y)*0.7, cy+(X+Y)*0.35-Z];
  const P3=v=>P(v[0],v[1],v[2]);
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.stroke();}};
  const disc=(p,rr,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(p[0],p[1],rr,0,7);ctx.fill();};
  const Zp=r(0.8), Lb=r(0.64), Rd=r(0.3), ax=r(0.34), leg=r(0.3), z0=r(0.035);
  const sp=Math.sin(ph), cp=Math.cos(ph), b3=[0,sp,-cp], e1=[1,0,0], e2=[0,cp,sp];
  const Hc=[0,Lb*sp,Zp-Lb*cp];
  if(o.tile!==false){hexPath(ctx,cx,cy,R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();}
  const sx=r(0.62),sy=r(0.44);poly([P(-sx,-sy,z0),P(sx,-sy,z0),P(sx,sy,z0),P(-sx,sy,z0)],'#94a3b8','#64748b',R*0.012);
  const gs=P(0,Hc[1],z0);ctx.fillStyle='rgba(15,23,42,.2)';ctx.beginPath();ctx.ellipse(gs[0]+fl*Hc[2]*0.2,gs[1]+Hc[2]*0.1,r(0.26),r(0.11),0,0,7);ctx.fill();
  // tall A-frame towers with rungs, accent stripes, diamond signs
  const pylon=X0=>{const top=P(X0,0,Zp),f0=P(X0,-leg,z0),f1=P(X0,leg,z0);
    [f0,f1].forEach(f=>{line(f,top,'#475569',r(0.07));line([f[0]-r(0.012),f[1]],[top[0]-r(0.012),top[1]],'#94a3b8',r(0.018));
      line(lerp(f,top,0.72),lerp(f,top,0.94),accent,r(0.074));});
    for(let k=1;k<7;k++){const t=k/7;line(lerp(f0,top,t),lerp(f1,top,t),'#64748b',r(0.016));}
    for(let k=0;k<6;k++){const t0=k/7,t1=(k+1)/7;line(k%2?lerp(f0,top,t0):lerp(f1,top,t0),k%2?lerp(f1,top,t1):lerp(f0,top,t1),'#64748b',r(0.012));}
    const d=lerp(lerp(f0,top,0.5),lerp(f1,top,0.5),0.5);
    poly([[d[0],d[1]-r(0.07)],[d[0]+r(0.06),d[1]],[d[0],d[1]+r(0.07)],[d[0]-r(0.06),d[1]]],accent,'#f8fafc',R*0.012);
    disc(top,r(0.068),accent);disc([top[0]-r(0.02),top[1]-r(0.02)],r(0.02),shade(accent,0.5));};
  pylon(-ax);
  line(P(-ax,0,Zp),P(ax,0,Zp),'#94a3b8',r(0.05));
  // boom: striped beam from the pivot to the disc hub
  const A0=P(0,0,Zp),H=P3(Hc);
  line(A0,H,'#334155',r(0.11));
  for(let i=0;i<10;i++){const a=lerp(A0,H,i/10),b=lerp(A0,H,(i+0.85)/10);line(a,b,i%2?'#f8fafc':accent,r(0.082));}
  disc(A0,r(0.07),'#334155');disc(A0,r(0.05),accent);
  // the disc: concentric painted rings, rim, riders on the face that looks at the viewer
  const ptd=(rad,a)=>P3([Hc[0]+rad*(Math.cos(a)*e1[0]+Math.sin(a)*e2[0]),Hc[1]+rad*(Math.cos(a)*e1[1]+Math.sin(a)*e2[1]),Hc[2]+rad*(Math.cos(a)*e1[2]+Math.sin(a)*e2[2])]);
  const circle=rad=>{const pts=[];for(let s=0;s<=40;s++)pts.push(ptd(rad,s/40*TAU));return pts;};
  let nf=b3;if(nf[0]+nf[1]+1.4*nf[2]<0)nf=[-b3[0],-b3[1],-b3[2]];
  const lift=(v,k)=>[v[0]+nf[0]*k,v[1]+nf[1]*k,v[2]+nf[2]*k];
  const back=P3([Hc[0]-nf[0]*r(0.03),Hc[1]-nf[1]*r(0.03),Hc[2]-nf[2]*r(0.03)]),face=P3(Hc),off=[face[0]-back[0],face[1]-back[1]];
  poly(circle(Rd).map(p=>[p[0]-off[0],p[1]-off[1]]),'#1f2937');                    // disc edge
  poly(circle(Rd),'#334155');poly(circle(Rd*0.94),'#e2e8f0');poly(circle(Rd*0.66),accent);poly(circle(Rd*0.4),'#f8fafc');poly(circle(Rd*0.22),shade(accent,-0.4));
  for(let k=0;k<20;k+=2){const a=rot+k*TAU/20;line(ptd(Rd*0.7,a),ptd(Rd*0.9,a+TAU/20),shade(accent,-0.25),r(0.008));}
  const seats=[],rc=['#ef4444','#facc15','#3b82f6','#f97316','#e2e8f0','#a855f7'];
  for(let k=0;k<20;k++){const a=rot+k*TAU/20,rad=[Math.cos(a)*e1[0]+Math.sin(a)*e2[0],Math.cos(a)*e1[1]+Math.sin(a)*e2[1],Math.cos(a)*e1[2]+Math.sin(a)*e2[2]];
    const S=[Hc[0]+rad[0]*Rd*0.8,Hc[1]+rad[1]*Rd*0.8,Hc[2]+rad[2]*Rd*0.8];seats.push({k,S,key:S[0]+S[1]+S[2]*0.9,rad});}
  seats.sort((u,v)=>u.key-v.key).forEach(s=>{const base=P3(lift(s.S,r(0.012))),mid=P3(lift(s.S,r(0.07))),head=P3(lift(s.S,r(0.105)));
    const out=P3(lift([s.S[0]+s.rad[0]*r(0.06),s.S[1]+s.rad[1]*r(0.06),s.S[2]+s.rad[2]*r(0.06)],r(0.02)));
    line(base,out,s.k%2?accent:'#f8fafc',r(0.044));                                  // seat block
    line(base,mid,rc[s.k%6],r(0.042));disc(head,r(0.026),'#fde4c8');});
  disc(P3(lift(Hc,r(0.02))),r(0.05),'#475569');disc(P3(lift(Hc,r(0.026))),r(0.036),accent);
  pylon(ax);
  [[-sx,sy,sx,sy],[sx,-sy,sx,sy]].forEach(([x0,y0,x1,y1])=>{const n=14;for(let k=0;k<=n;k++){const t=k/n,X=x0+(x1-x0)*t,Y=y0+(y1-y0)*t;line(P(X,Y,z0),P(X,Y,z0+r(0.07)),'#334155',R*0.01);}
    line(P(x0,y0,z0+r(0.07)),P(x1,y1,z0+r(0.07)),accent,R*0.014);});
}

/**
 * drawGuestServices(ctx, cx, cy, R, opts)
 *  opts.accent : Land color (default Generic white) -> border, roof, fascia, sign, flag, strollers
 *  opts.flip   : true when called under ctx.scale(-1,1) (keeps shadows on the same screen side)
 *  opts.tile   : draw the hex tile (default true)
 */
function drawGuestServices(ctx,cx,cy,R,o={}){
  const accent=o.accent||'#f8fafc', fl=o.flip?-1:1;
  const Q=(X,Y,Z)=>[cx+(X-Y)*0.7, cy+(X+Y)*0.35-Z];
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.012;ctx.stroke();}};
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const disc=(p,r,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(p[0],p[1],r,0,7);ctx.fill();};
  const shadow=(p,rx)=>{ctx.fillStyle='rgba(15,23,42,.2)';ctx.beginPath();ctx.ellipse(p[0]+fl*rx*0.4,p[1]+rx*0.12,rx,rx*0.4,0,0,7);ctx.fill();};
  const plane=(X,Y,Z,fn)=>{const p=Q(X,Y,Z);ctx.save();ctx.transform(0.7,0.35,0,1,p[0],p[1]);ctx.scale(1.43,1);fn();ctx.restore();};
  const x0=-R*0.3,x1=R*0.3,y0=-R*0.24,y1=R*0.24,H=R*0.25,z0=R*0.03;
  if(o.tile!==false){hexPath(ctx,cx,cy,R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();}
  poly([Q(-R*0.62,-R*0.5,z0),Q(R*0.62,-R*0.5,z0),Q(R*0.62,R*0.5,z0),Q(-R*0.62,R*0.5,z0)],'#e2e8f0','#94a3b8');
  ctx.save();ctx.translate(fl*R*0.1,R*0.05);
  poly([Q(x0,y0,z0),Q(x1,y0,z0),Q(x1,y1,z0),Q(x0,y1,z0)],'rgba(15,23,42,.22)');ctx.restore();
  // walls + fascia band with lettering
  poly([Q(x0,y1,z0),Q(x1,y1,z0),Q(x1,y1,H),Q(x0,y1,H)],'#f1f5f9');
  poly([Q(x1,y0,z0),Q(x1,y1,z0),Q(x1,y1,H),Q(x1,y0,H)],'#cbd5e1');
  poly([Q(x0,y1,R*0.14),Q(x1,y1,R*0.14),Q(x1,y1,H),Q(x0,y1,H)],shade(accent,-0.25));
  poly([Q(x1,y0,R*0.14),Q(x1,y1,R*0.14),Q(x1,y1,H),Q(x1,y0,H)],shade(accent,-0.45));
  plane(x0,y1,H,()=>{ctx.fillStyle='#f8fafc';ctx.font='bold '+(R*0.043)+'px Arial, sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('GUEST SERVICES',(x1-x0)/1.43/2,R*0.085);});
  // service window: dark interior, cast member, counter ledge
  const wa=-R*0.15,wb=R*0.15,wz=R*0.04,wt=R*0.115;
  poly([Q(wa-R*0.012,y1,wz-R*0.01),Q(wb+R*0.012,y1,wz-R*0.01),Q(wb+R*0.012,y1,wt+R*0.012),Q(wa-R*0.012,y1,wt+R*0.012)],accent);
  poly([Q(wa,y1,wz),Q(wb,y1,wz),Q(wb,y1,wt),Q(wa,y1,wt)],'#1e293b');
  {const t=Q(R*0.01,y1,R*0.07);ctx.fillStyle=accent;ctx.fillRect(t[0]-R*0.022,t[1]-R*0.005,R*0.044,R*0.05);   // torso
   disc([t[0],t[1]-R*0.025],R*0.017,'#fde4c8');}                                                         // head
  poly([Q(wa-R*0.02,y1,wz),Q(wb+R*0.02,y1,wz),Q(wb+R*0.02,y1+R*0.05,wz),Q(wa-R*0.02,y1+R*0.05,wz)],'#e2e8f0','#94a3b8',R*0.008);
  poly([Q(wa-R*0.02,y1+R*0.05,wz),Q(wb+R*0.02,y1+R*0.05,wz),Q(wb+R*0.02,y1+R*0.05,wz-R*0.012),Q(wa-R*0.02,y1+R*0.05,wz-R*0.012)],'#94a3b8');
  [[-R*0.27,-R*0.19],[R*0.19,R*0.27]].forEach(([a,b])=>{                                                  // side windows
    poly([Q(a,y1,R*0.05),Q(b,y1,R*0.05),Q(b,y1,R*0.12),Q(a,y1,R*0.12)],'#7dd3fc','#475569',R*0.01);
    poly([Q(a+(b-a)*0.12,y1,R*0.12),Q(a+(b-a)*0.4,y1,R*0.12),Q(a+(b-a)*0.2,y1,R*0.05),Q(a+(b-a)*0.05,y1,R*0.05)],'rgba(255,255,255,.45)');});
  { const n=7,a0=wa-R*0.03,a1=wb+R*0.03;                                                                 // striped canopy
    for(let i=0;i<n;i++){const a=a0+(a1-a0)*i/n,b=a0+(a1-a0)*(i+1)/n;
      poly([Q(a,y1,R*0.14),Q(b,y1,R*0.14),Q(b,y1+R*0.06,R*0.12),Q(a,y1+R*0.06,R*0.12)],i%2?'#f8fafc':accent);}}
  // hip roof: end slope, then front slope, shingle lines and ridge
  const ov=R*0.035, rh=R*0.1, d=R*0.1;
  poly([Q(x1+ov,y1+ov,H-R*0.01),Q(x1+ov,-(y1+ov),H-R*0.01),Q(x1-d,0,H+rh)],shade(accent,-0.3));
  poly([Q(x0-ov,y1+ov,H-R*0.01),Q(x1+ov,y1+ov,H-R*0.01),Q(x1-d,0,H+rh),Q(x0+d,0,H+rh)],accent);
  [0.33,0.66].forEach(t=>{const y=(y1+ov)*(1-t),z=H-R*0.01+(rh+R*0.01)*t,k=(d+ov)*t;
    line(Q(x0-ov+k,y,z),Q(x1+ov-k,y,z),shade(accent,-0.25),R*0.007);});
  line(Q(x0-ov,y1+ov,H-R*0.01),Q(x1+ov,y1+ov,H-R*0.01),shade(accent,-0.4),R*0.014);
  line(Q(x0+d,0,H+rh),Q(x1-d,0,H+rh),shade(accent,0.45),R*0.014);
  // round "i" sign on a post over the ridge
  line(Q(0,0,H+rh),Q(0,0,H+rh+R*0.12),'#64748b',R*0.02);
  plane(0,0,H+rh+R*0.19,()=>{ctx.fillStyle=accent;ctx.beginPath();ctx.arc(0,0,R*0.078,0,7);ctx.fill();
    ctx.strokeStyle='#f8fafc';ctx.lineWidth=R*0.014;ctx.stroke();ctx.fillStyle='#f8fafc';
    ctx.beginPath();ctx.arc(0,-R*0.036,R*0.013,0,7);ctx.fill();ctx.fillRect(-R*0.011,-R*0.016,R*0.022,R*0.05);});
  // flagpole (front-left corner)
  { const b=Q(-R*0.46,R*0.22,z0),t=Q(-R*0.46,R*0.22,R*0.46);shadow(b,R*0.04);line(b,t,'#cbd5e1',R*0.014);
    poly([t,[t[0]+R*0.12,t[1]+R*0.02],[t[0]+R*0.09,t[1]+R*0.055],[t[0]+R*0.12,t[1]+R*0.085],[t[0],t[1]+R*0.07]],accent,shade(accent,-0.3),R*0.008);
    disc([t[0],t[1]-R*0.005],R*0.012,'#fde68a'); }
  // stroller rental: two little strollers
  [[-R*0.34,R*0.42,accent],[-R*0.19,R*0.42,'#f8fafc']].forEach(([X,Y,c])=>{
    const w=R*0.05,l=R*0.04,zb=R*0.045,zt=R*0.075; shadow(Q(X,Y,z0),R*0.07);
    poly([Q(X-l,Y-w,zb),Q(X+l,Y-w,zb),Q(X+l,Y-w,zt),Q(X-l,Y-w,zt)],shade(c==='#f8fafc'?'#cbd5e1':c,-0.3));
    poly([Q(X-l,Y+w,zb),Q(X+l,Y+w,zb),Q(X+l,Y+w,zt),Q(X-l,Y+w,zt)],shade(c==='#f8fafc'?'#cbd5e1':c,-0.1));
    poly([Q(X-l,Y-w,zt),Q(X+l,Y-w,zt),Q(X+l,Y+w,zt),Q(X-l,Y+w,zt)],c,'#94a3b8',R*0.006);
    const h=Q(X-l,Y+w,zt+R*0.05);ctx.fillStyle=shade(c==='#f8fafc'?'#cbd5e1':c,-0.2);ctx.beginPath();           // canopy
    ctx.ellipse(Q(X+l*0.4,Y,zt)[0],Q(X+l*0.4,Y,zt)[1]-R*0.01,R*0.05,R*0.03,0,Math.PI,0);ctx.fill();
    [[X-l,Y+w],[X+l,Y+w]].forEach(([a,b])=>disc(Q(a,b,R*0.035),R*0.014,'#334155'));
    line(Q(X-l,Y+w,zt),Q(X-l-R*0.04,Y+w,zt+R*0.04),'#64748b',R*0.01);});
  // park map board (front-right)
  { const xa=R*0.3,xb=R*0.54,Y=R*0.47,za=R*0.07,zb=R*0.18;
    [xa+R*0.02,xb-R*0.02].forEach(x=>line(Q(x,Y,z0),Q(x,Y,za),'#64748b',R*0.018));
    shadow(Q((xa+xb)/2,Y,z0),R*0.11);
    poly([Q(xa-R*0.01,Y,za-R*0.01),Q(xb+R*0.01,Y,za-R*0.01),Q(xb+R*0.01,Y,zb+R*0.01),Q(xa-R*0.01,Y,zb+R*0.01)],'#475569');
    poly([Q(xa,Y,za),Q(xb,Y,za),Q(xb,Y,zb),Q(xa,Y,zb)],'#fef3c7');
    plane(xa,Y,zb,()=>{const w=(xb-xa)/1.43,h=zb-za;
      ctx.fillStyle=accent;ctx.fillRect(0,0,w,h*0.2);
      ctx.fillStyle='#7dd3fc';ctx.beginPath();ctx.ellipse(w*0.3,h*0.55,w*0.18,h*0.14,0,0,7);ctx.fill();
      ctx.fillStyle='#86efac';ctx.beginPath();ctx.ellipse(w*0.72,h*0.7,w*0.16,h*0.12,0,0,7);ctx.fill();
      ctx.strokeStyle='#a16207';ctx.lineWidth=R*0.008;ctx.beginPath();ctx.moveTo(w*0.1,h*0.85);ctx.lineTo(w*0.45,h*0.75);ctx.lineTo(w*0.6,h*0.45);ctx.lineTo(w*0.9,h*0.4);ctx.stroke();
      ctx.fillStyle='#ef4444';ctx.beginPath();ctx.arc(w*0.45,h*0.75,R*0.011,0,7);ctx.fill();}); }
}

/**
 * drawParkEntrance(ctx, cx, cy, R, opts)
 *  opts.accent : Land color (default Generic white) -> hex border, tower roofs + bands, banners, sign, booth roofs, flags
 *  opts.t      : time in seconds (waves the flags, floats the balloon, chases the sign lights); omit for a static sprite
 *  opts.flip   : true when called under ctx.scale(-1,1) (keeps shadows on the same screen side)
 *  opts.tile   : draw the hex tile (default true)
 */
function drawParkEntrance(ctx,cx,cy,R,o={}){
  const accent=o.accent||'#f8fafc', fl=o.flip?-1:1, tm=o.t==null?0:o.t, r=v=>R*v;
  const Q=(X,Y,Z)=>[cx+(X-Y)*0.7, cy+(X+Y)*0.35-Z];
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.stroke();}};
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const disc=(p,rr,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(p[0],p[1],rr,0,7);ctx.fill();};
  const plane=(X,Y,Z,fn)=>{const p=Q(X,Y,Z);ctx.save();ctx.transform(0.7,0.35,0,1,p[0],p[1]);fn();ctx.restore();};
  const box=(xa,xb,ya,yb,za,zb,cf,ce,ct)=>{
    poly([Q(xa,yb,za),Q(xb,yb,za),Q(xb,yb,zb),Q(xa,yb,zb)],cf);
    poly([Q(xb,ya,za),Q(xb,yb,za),Q(xb,yb,zb),Q(xb,ya,zb)],ce);
    poly([Q(xa,ya,zb),Q(xb,ya,zb),Q(xb,yb,zb),Q(xa,yb,zb)],ct);};
  const z0=r(0.03), cream='#f3e4c4', cream2='#d6c4a0';
  if(o.tile!==false){hexPath(ctx,cx,cy,R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();}
  // plaza slab and the central path
  poly([Q(r(-0.64),r(-0.22),z0),Q(r(0.64),r(-0.22),z0),Q(r(0.64),r(0.5),z0),Q(r(-0.64),r(0.5),z0)],'#e2e8f0','#94a3b8',R*0.012);
  poly([Q(r(-0.17),r(0.0),z0),Q(r(0.17),r(0.0),z0),Q(r(0.17),r(0.5),z0),Q(r(-0.17),r(0.5),z0)],'#e7d9b8');
  for(let Y=0.05;Y<0.5;Y+=0.07)line(Q(r(-0.17),r(Y),z0),Q(r(0.17),r(Y),z0),'rgba(120,53,15,.12)',R*0.006);
  // shadow of the gateway
  ctx.save();ctx.translate(fl*r(0.16),r(0.08));
  [[-0.42,-0.28],[0.28,0.42]].forEach(([a,b])=>poly([Q(r(a),r(-0.07),z0),Q(r(b),r(-0.07),z0),Q(r(b),r(0.07),z0),Q(r(a),r(0.07),z0)],'rgba(15,23,42,.22)'));
  poly([Q(r(-0.28),r(-0.05),z0),Q(r(0.28),r(-0.05),z0),Q(r(0.28),r(0.05),z0),Q(r(-0.28),r(0.05),z0)],'rgba(15,23,42,.1)');ctx.restore();
  // wrought-iron fences leading away from the towers
  [[-0.64,-0.42],[0.42,0.64]].forEach(([a,b])=>{
    for(let X=a;X<=b+0.001;X+=0.03)line(Q(r(X),r(0.0),z0),Q(r(X),r(0.0),z0+r(0.08)),'#1f2937',R*0.01);
    line(Q(r(a),r(0.0),z0+r(0.075)),Q(r(b),r(0.0),z0+r(0.075)),'#1f2937',R*0.012);
    line(Q(r(a),r(0.0),z0+r(0.02)),Q(r(b),r(0.0),z0+r(0.02)),'#1f2937',R*0.01);});
  // towers with pyramid roofs, accent bands, windows, banners, flags
  const flagWave=k=>Math.sin(tm*3+k)*r(0.012);
  const tower=(xa,xb,k)=>{const ya=r(-0.07),yb=r(0.07),zt=r(0.5),ov=r(0.025),ap=r(0.64);
    box(xa,xb,ya,yb,z0,zt,cream,cream2,accent);
    poly([Q(xa,yb,r(0.43)),Q(xb,yb,r(0.43)),Q(xb,yb,r(0.46)),Q(xa,yb,r(0.46))],accent);
    poly([Q(xb,ya,r(0.43)),Q(xb,yb,r(0.43)),Q(xb,yb,r(0.46)),Q(xb,ya,r(0.46))],shade(accent,-0.3));
    const apex=Q((xa+xb)/2,0,ap), cxm=(xa+xb)/2;
    poly([Q(xa-ov,yb+ov,zt),Q(xb+ov,yb+ov,zt),apex],accent,shade(accent,-0.35));
    poly([Q(xb+ov,ya-ov,zt),Q(xb+ov,yb+ov,zt),apex],shade(accent,-0.3),shade(accent,-0.45));
    poly([Q(cxm-r(0.015),yb,r(0.49)),Q(cxm+r(0.015),yb,r(0.49)),Q(cxm+r(0.015),yb,r(0.52)),Q(cxm-r(0.015),yb,r(0.52))],'#fde68a');
    poly([Q(cxm-r(0.022),yb,r(0.34)),Q(cxm+r(0.022),yb,r(0.34)),Q(cxm+r(0.022),yb,r(0.42)),Q(cxm-r(0.022),yb,r(0.42))],'#7dd3fc','#475569');
    poly([Q(cxm-r(0.03),yb,r(0.14)),Q(cxm+r(0.03),yb,r(0.14)),Q(cxm+r(0.03),yb,r(0.31)),Q(cxm-r(0.03),yb,r(0.31))],accent,'#f8fafc',R*0.008);   // banner
    plane(cxm-r(0.03),yb,r(0.28),()=>{ctx.fillStyle='#f8fafc';ctx.beginPath();ctx.arc(r(0.03)*1.0,r(0.045),r(0.014),0,7);ctx.fill();});
    const tip=[apex[0],apex[1]-r(0.08)];line(apex,tip,'#e2e8f0',R*0.01);                                             // flag
    poly([tip,[tip[0]+r(0.09),tip[1]+r(0.015)+flagWave(k)],[tip[0]+r(0.07),tip[1]+r(0.04)+flagWave(k+1)],[tip[0]+r(0.09),tip[1]+r(0.065)+flagWave(k+2)],[tip[0],tip[1]+r(0.05)]],accent,shade(accent,-0.3),R*0.006);};
  tower(r(-0.42),r(-0.28),0);
  // bridge between the towers + the WELCOME sign above it
  box(r(-0.28),r(0.28),r(-0.05),r(0.05),r(0.3),r(0.38),cream,cream2,shade(accent,-0.25));
  poly([Q(r(-0.28),r(0.05),r(0.3)),Q(r(0.28),r(0.05),r(0.3)),Q(r(0.28),r(0.05),r(0.315)),Q(r(-0.28),r(0.05),r(0.315))],accent);
  const sa=r(-0.27),sb=r(0.27),sy=r(0.07),sz0=r(0.385),sz1=r(0.49);
  [sa+r(0.03),sb-r(0.03)].forEach(x=>line(Q(x,sy,r(0.38)),Q(x,sy,sz0),'#64748b',R*0.014));
  poly([Q(sa,sy,sz0),Q(sb,sy,sz0),Q(sb,sy,sz1),Q(sa,sy,sz1)],accent,'#fde68a',R*0.014);
  plane(sa,sy,sz1,()=>{ctx.fillStyle='#f8fafc';ctx.font='bold '+r(0.07)+'px Arial Black, Arial, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('WELCOME',(sb-sa)/2,r(0.052));});
  for(let k=0;k<=12;k++){const X=sa+(sb-sa)*k/12;[sz0,sz1].forEach((Z,j)=>disc(Q(X,sy,Z),R*0.008,(Math.floor(tm*4)+k+j)%2?'#fef08a':'#fb923c'));}
  tower(r(0.28),r(0.42),3);
  // ticket booths with striped awnings (one each side)
  [[-0.63,-0.47],[0.47,0.63]].forEach(([a,b])=>{box(r(a),r(b),r(0.02),r(0.16),z0,r(0.13),'#f1f5f9','#cbd5e1','#94a3b8');
    poly([Q(r(a+0.03),r(0.16),r(0.05)),Q(r(b-0.03),r(0.16),r(0.05)),Q(r(b-0.03),r(0.16),r(0.1)),Q(r(a+0.03),r(0.16),r(0.1))],'#7dd3fc','#475569');
    poly([Q(r(a-0.015),r(0.0),r(0.13)),Q(r(b+0.015),r(0.0),r(0.13)),Q(r(b+0.015),r(0.18),r(0.13)),Q(r(a-0.015),r(0.18),r(0.13))],accent,shade(accent,-0.3));
    for(let k=0;k<4;k++){const xa=a-0.015+(b-a+0.03)*k/4,xb=a-0.015+(b-a+0.03)*(k+1)/4;
      poly([Q(r(xa),r(0.18),r(0.13)),Q(r(xb),r(0.18),r(0.13)),Q(r(xb),r(0.18),r(0.115)),Q(r(xa),r(0.18),r(0.115))],k%2?'#f8fafc':accent);}});
  // turnstiles under the gate
  for(let k=0;k<5;k++){const X=r(-0.2+k*0.1),b=Q(X,r(0.15),z0),t=Q(X,r(0.15),z0+r(0.055));
    line(b,t,'#334155',R*0.016);disc(t,R*0.014,accent);
    [[-1,-0.3],[1,-0.3],[0,0.6]].forEach(([dx,dz])=>line(t,[t[0]+dx*r(0.022),t[1]+r(0.02)+dz*r(0.01)],'#475569',R*0.007));}
  // flower beds with brick borders
  [[-0.5,-0.3],[0.3,0.5]].forEach(([a,b],bi)=>{const ya=r(0.24),yb=r(0.44),zb=z0+r(0.025);
    box(r(a),r(b),ya,yb,z0,zb,'#9a3412','#7c2d12','#4d7c0f');
    for(let k=0;k<9;k++){const X=r(a+0.02+((k*37)%17)/17*(b-a-0.04)),Y=ya+r(0.02)+((k*53)%11)/11*(yb-ya-r(0.04)),p=Q(X,Y,zb);
      disc([p[0],p[1]-R*0.012],R*0.014,[accent,'#fde047','#f9a8d4','#f8fafc'][k%4]);}});
  // lamps by the path
  [-0.22,0.22].forEach(X=>{const b=Q(r(X),r(0.46),z0),t=Q(r(X),r(0.46),r(0.2));line(b,t,'#334155',R*0.016);disc(t,R*0.022,'#fde68a');});
  // guests on the path, back to front (one has a balloon)
  const gs=[[-0.07,0.2,'#3b82f6'],[0.09,0.27,'#facc15'],[-0.1,0.34,'#22c55e'],[0.06,0.4,'#f97316'],[-0.02,0.47,'#a855f7']];
  gs.forEach(([X,Y,c],i)=>{const b=Q(r(X),r(Y),z0);ctx.fillStyle='rgba(15,23,42,.2)';ctx.beginPath();ctx.ellipse(b[0]+fl*r(0.012),b[1]+r(0.004),r(0.025),r(0.01),0,0,7);ctx.fill();
    ctx.fillStyle='#1f2937';ctx.fillRect(b[0]-r(0.012),b[1]-r(0.03),r(0.024),r(0.03));
    ctx.fillStyle=c;ctx.fillRect(b[0]-r(0.016),b[1]-r(0.065),r(0.032),r(0.04));disc([b[0],b[1]-r(0.08)],r(0.017),'#fde4c8');
    if(i===3){const bx=b[0]+r(0.035)+Math.sin(tm*1.6)*r(0.01),by=b[1]-r(0.2)+Math.sin(tm*2)*r(0.008);
      line([b[0]+r(0.012),b[1]-r(0.06)],[bx,by+r(0.025)],'#e2e8f0',R*0.005);ctx.fillStyle=accent;ctx.beginPath();ctx.ellipse(bx,by,r(0.025),r(0.032),0,0,7);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,.4)';ctx.beginPath();ctx.ellipse(bx-r(0.008),by-r(0.01),r(0.007),r(0.011),0,0,7);ctx.fill();}});
}

/**
 * drawPirateShip(ctx, cx, cy, R, opts)
 *  opts.accent : Land color (default Generic white) -> hex border, pylon stripes + caps, gunwale trim, bow/stern ornaments
 *  opts.t      : swing angle in radians (0 = hanging straight down, keep within about +-1.4)
 *  opts.flip   : true when called under ctx.scale(-1,1) (keeps shadows on the same screen side)
 */
function drawPirateShip(ctx,cx,cy,R,o={}){
  const accent=o.accent||'#f8fafc', ph=o.t==null?0.6:o.t, fl=o.flip?-1:1;
  const P=(X,Y,Z)=>[cx+(X-Y)*0.7, cy+(X+Y)*0.35-Z];
  const Zp=R*0.92, La=R*0.6, ax=R*0.46, leg=R*0.26, Lh=R*0.4, W=R*0.28, z0=R*0.035;
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.01;ctx.stroke();}};
  const sp=Math.sin(ph), cp=Math.cos(ph);
  const C=[0,La*sp,Zp-La*cp], u=[0,-sp,cp], w=[0,cp,sp];
  if(o.tile!==false){hexPath(ctx,cx,cy,R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();}
  const sx=R*0.64,sy=R*0.42;ctx.beginPath();
  [[-sx,-sy],[sx,-sy],[sx,sy],[-sx,sy]].forEach(([X,Y],i)=>{const p=P(X,Y,z0);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});
  ctx.closePath();ctx.fillStyle='#94a3b8';ctx.fill();ctx.strokeStyle='#64748b';ctx.lineWidth=R*0.012;ctx.stroke();
  const gs=P(0,C[1],z0);ctx.fillStyle='rgba(15,23,42,.22)';ctx.beginPath();ctx.ellipse(gs[0]+fl*R*0.05,gs[1]+R*0.02,R*0.26,R*0.1,0,0,7);ctx.fill();
  const pylon=X0=>{const top=P(X0,0,Zp),f0=P(X0,-leg,z0),f1=P(X0,leg,z0);
    [f0,f1].forEach(f=>{line(f,top,'#64748b',R*0.05);line([f[0]-R*0.012,f[1]],[top[0]-R*0.012,top[1]],'#94a3b8',R*0.016);
      line(lerp(f,top,0.66),lerp(f,top,0.9),accent,R*0.054);});
    line(lerp(f0,top,0.3),lerp(f1,top,0.3),'#64748b',R*0.03);
    ctx.fillStyle=accent;ctx.beginPath();ctx.arc(top[0],top[1],R*0.065,0,7);ctx.fill();
    ctx.fillStyle=shade(accent,0.45);ctx.beginPath();ctx.arc(top[0]-R*0.02,top[1]-R*0.02,R*0.02,0,7);ctx.fill();};
  // hull runs ALONG the swing direction: l = along the swing, s = across (toward the pylons), h = along the arm
  const sw=l=>W/2*(1-0.85*Math.pow(Math.abs(l)/Lh,3));
  const ht=l=>R*0.12*Math.pow(Math.abs(l)/Lh,2.2);                    // bow and stern both curve up
  const hb=l=>-R*0.09*Math.pow(Math.max(0,1-(l/Lh)*(l/Lh)),0.55);
  const pos=(l,h,s)=>P(s,C[1]+u[1]*h+w[1]*l,C[2]+u[2]*h+w[2]*l);
  const ls=[];for(let i=0;i<=16;i++)ls.push(-Lh+2*Lh*i/16);
  const panel=(side,col)=>{
    const top=ls.map(l=>pos(l,ht(l),side*sw(l))), bot=ls.map(l=>pos(l,hb(l),side*sw(l)));
    poly(top.concat(bot.slice().reverse()),col,shade('#8b4513',-0.5),R*0.008);
    [0.33,0.66].forEach(f=>{ctx.strokeStyle='rgba(0,0,0,.22)';ctx.lineWidth=R*0.007;ctx.beginPath();
      top.forEach((t,i)=>{const q=lerp(t,bot[i],f);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);});ctx.stroke();});
    ctx.strokeStyle=accent;ctx.lineWidth=R*0.026;ctx.lineJoin='round';ctx.beginPath();            // gunwale trim
    top.forEach((t,i)=>i?ctx.lineTo(t[0],t[1]):ctx.moveTo(t[0],t[1]));ctx.stroke();};
  const rc=['#ef4444','#facc15','#22c55e','#3b82f6','#f97316','#e2e8f0'];
  const riders=side=>[-0.26,-0.13,0,0.13,0.26].forEach((k,j)=>{const l=k*R, s=side*W*0.26;
    const a=pos(l,-R*0.045,s), b=pos(l,R*0.035,s), h=pos(l,R*0.068,s);
    line(a,b,rc[(j+(side>0?3:0))%6],R*0.048);ctx.fillStyle='#fde4c8';ctx.beginPath();ctx.arc(h[0],h[1],R*0.027,0,7);ctx.fill();});
  pylon(-ax);                                                                 // far pylon
  line(P(-ax,0,Zp),P(ax,0,Zp),'#94a3b8',R*0.045);                              // axle
  panel(-1,'#5c2d0c');                                                         // far side of the hull
  poly(ls.map(l=>pos(l,-R*0.05,sw(l))).concat(ls.slice().reverse().map(l=>pos(l,-R*0.05,-sw(l)))),'#3b2210');   // deck
  riders(-1);
  const arm0=P(0,0,Zp),arm1=pos(0,-R*0.02,0);                                  // arm / mast through the middle
  line(arm0,arm1,'#475569',R*0.055);line(lerp(arm0,arm1,0.55),lerp(arm0,arm1,0.85),accent,R*0.058);
  line([arm0[0]-R*0.012,arm0[1]],[arm1[0]-R*0.012,arm1[1]],'#94a3b8',R*0.014);
  riders(1);
  panel(1,'#8b4513');                                                          // near side of the hull
  [-1,1].forEach(e=>{                                                          // curled bow + stern ornaments
    const b=pos(e*Lh,ht(Lh),0),m=pos(e*(Lh+R*0.07),ht(Lh)+R*0.07,0),t=pos(e*(Lh+R*0.03),ht(Lh)+R*0.17,0);
    ctx.strokeStyle=accent;ctx.lineWidth=R*0.032;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(b[0],b[1]);ctx.quadraticCurveTo(m[0],m[1],t[0],t[1]);ctx.stroke();
    ctx.fillStyle=shade(accent,0.3);ctx.beginPath();ctx.arc(t[0],t[1],R*0.03,0,7);ctx.fill();});
  pylon(ax);                                                                   // near pylon
}

/**
 * drawRapidsSide(ctx, cx, cy, R, opts)  -- two hexes side by side (E-W). cx,cy = midpoint of the two hex centers.
 * drawRapidsDiag(ctx, cx, cy, R, opts)  -- two hexes diagonal, NW-SE ("\"). cx,cy = midpoint of the two hex centers.
 * drawRapidsDiagDir(ctx, cx, cy, R, opts, dir) -- dir 'NW-SE' or 'NE-SW' (mirrors the diagonal sprite)
 *  opts.accent : Land color (default Generic white) -> hex border, rafts, station canopy
 *  opts.t      : raft position 0..1 around the loop (also drives the current)
 *  opts.flip   : true when called under ctx.scale(-1,1)
 */
function drawRapidsSide(ctx,cx,cy,R,o){return rapidsCore(ctx,cx,cy,R,o||{},'side');}
function drawRapidsDiag(ctx,cx,cy,R,o){return rapidsCore(ctx,cx,cy,R,o||{},'diag');}
function drawRapidsDiagDir(ctx,cx,cy,R,o,dir){
  if(dir!=='NE-SW') return drawRapidsDiag(ctx,cx,cy,R,o);
  ctx.save(); ctx.translate(cx,cy); ctx.scale(-1,1);
  drawRapidsDiag(ctx,0,0,R,Object.assign({},o,{flip:true})); ctx.restore();
}
function rapidsLayout(R,mode){                      // built once per size + mode, then cached
  rapidsLayout._c=rapidsLayout._c||{}; const key=mode+R; if(rapidsLayout._c[key]) return rapidsLayout._c[key];
  let seed=mode==='side'?777:12345; const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);
    t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
  const side=mode==='side', N=120, hw=R*(side?0.062:0.07), path=[];
  const hexes=side?[[-0.866*R,0],[0.866*R,0]]:[[-0.433*R,-0.435*R],[0.433*R,0.435*R]];
  if(side){                                         // a peanut-shaped loop that follows the two hexes
    for(let i=0;i<N;i++){const th=2*Math.PI*i/N,x=1.3*R*Math.cos(th),ax=Math.abs(x);
      const amp=R*(0.14+0.2*Math.exp(-Math.pow((ax-0.866*R)/(0.5*R),2)));
      path.push([x,amp*Math.sin(th)+R*0.03*Math.sin(3*th+1)]);}
  }else{
    const d=[0.866*R,0.87*R],nv=[0.706,-0.709];
    for(let i=0;i<N;i++){const th=2*Math.PI*i/N,al=0.74*Math.cos(th),sd=R*(0.36*Math.sin(th)+0.06*Math.sin(3*th+1));
      path.push([d[0]*al+nv[0]*sd,d[1]*al+nv[1]*sd]);}
  }
  const frame=i=>{const a=path[(i+N-1)%N],b=path[(i+1)%N],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy);
    const T=[dx/l,dy/l];let n=[-T[1],T[0]];const p=path[i];if(n[0]*p[0]+n[1]*p[1]<0)n=[-n[0],-n[1]];return{p,T,n};};
  const k0=0.9, inHex=(x,y,h)=>{const X=Math.abs(x-h[0])/R,Y=Math.abs(y-h[1])/(0.58*R);return X<=0.866*k0&&Y<=k0-X/1.732;};
  const inside=(x,y)=>inHex(x,y,hexes[0])||inHex(x,y,hexes[1]);
  const dist=(x,y)=>{let m=1e9;for(const p of path)m=Math.min(m,Math.hypot(x-p[0],y-p[1]));return m;};
  const st=frame(Math.round(N*(side?0.1:0.9))), wf=frame(Math.round(N*0.5)), out=side?[-1,0]:[-0.705,-0.709];
  const M0=[wf.p[0]+out[0]*R*0.14, wf.p[1]+out[1]*R*0.14];
  const blob=(x,y,s,col)=>{const pts=[];for(let k=0;k<7;k++){const a=k/7*6.283+rnd()*0.5,r=s*(0.75+rnd()*0.4);
      pts.push([Math.cos(a)*r,Math.sin(a)*r*0.8]);}return {x,y,s,pts,col};};
  const rocks=[], nearSt=(x,y)=>Math.hypot(x-st.p[0],y-st.p[1])<R*0.24, nearM=(x,y)=>Math.hypot(x-M0[0],y-M0[1])<R*0.2;
  for(let i=0;i<N;i+=2)[-1,1].forEach(sd=>{if(rnd()<0.6){const f=frame(i),o=hw+R*0.05+rnd()*R*0.035;
    const x=f.p[0]+f.n[0]*sd*o,y=f.p[1]+f.n[1]*sd*o;
    if(inside(x,y)&&dist(x,y)>hw+R*0.045&&!nearM(x,y)&&!nearSt(x,y))
      rocks.push(blob(x,y,R*(0.032+rnd()*0.04),shade('#94a3b8',-0.25+rnd()*0.35)));}});
  const mound=[[0,0,0.1],[-0.07,0.06,0.07],[0.07,-0.05,0.07],[0,-0.1,0.07],[0.1,0.06,0.05]]
    .map(([a,b,s])=>blob(M0[0]+a*R,M0[1]+b*R,R*s,shade('#94a3b8',-0.3+rnd()*0.25)));
  const stream=[0.18,0.38,0.64,0.82].map(f=>{const fr=frame(Math.round(N*f)),o=(rnd()-0.5)*hw*0.7;     // boulders in the water
    return {x:fr.p[0]+fr.n[0]*o,y:fr.p[1]+fr.n[1]*o,rock:blob(fr.p[0]+fr.n[0]*o,fr.p[1]+fr.n[1]*o,R*0.03,shade('#94a3b8',-0.1+rnd()*0.2))};});
  const trees=[],bushes=[],step=R*0.17,span=side?2.3:1.25;
  for(let gx=-span*R;gx<=span*R;gx+=step)for(let gy=-1.2*R;gy<=1.2*R;gy+=step){
    const x=gx+(rnd()-0.5)*R*0.1,y=gy+(rnd()-0.5)*R*0.1;
    if(rnd()<0.9&&inside(x,y)&&dist(x,y)>hw+R*0.12&&!nearM(x,y)&&Math.hypot(x-st.p[0],y-st.p[1])>R*0.27&&
       trees.every(t=>Math.hypot(t.x-x,t.y-y)>R*0.12))
      trees.push({x,y,h:R*(0.17+rnd()*0.11),pine:rnd()<0.4,g:['#2f7d4f','#3f9d5f','#256d44'][Math.floor(rnd()*3)]});}
  for(let gx=-span*R;gx<=span*R;gx+=R*0.1)for(let gy=-1.2*R;gy<=1.2*R;gy+=R*0.1){
    const x=gx+(rnd()-0.5)*R*0.06,y=gy+(rnd()-0.5)*R*0.06;
    if(rnd()<0.28&&inside(x,y)&&dist(x,y)>hw+R*0.075&&!nearM(x,y)&&!nearSt(x,y)&&
       trees.every(t=>Math.hypot(t.x-x,t.y-y)>R*0.09)&&bushes.every(b=>Math.hypot(b.x-x,b.y-y)>R*0.07))
      bushes.push({x,y,r:R*(0.028+rnd()*0.02),c:['#3f9d5f','#4aa86a','#2f7d4f'][Math.floor(rnd()*3)]});}
  return rapidsLayout._c[key]={hexes,path,N,hw,frame,st,wf,M0,rocks,mound,stream,trees,bushes};
}
function rapidsCore(ctx,cx,cy,R,o,mode){
  const accent=o.accent||'#f8fafc', fl=o.flip?-1:1, ph=o.t==null?0.1:o.t, L=rapidsLayout(R,mode);
  ctx.save(); ctx.translate(cx,cy);
  const addHex=(x,y,r)=>{for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);
    ctx[i?'lineTo':'moveTo'](x+r*Math.cos(a),y+r*Math.sin(a)*0.58);}ctx.closePath();};
  L.hexes.forEach(h=>{ctx.beginPath();addHex(h[0],h[1],R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();
    ctx.beginPath();addHex(h[0],h[1],R*0.9);ctx.fillStyle='#a8c99b';ctx.fill();});
  const trace=off=>{ctx.beginPath();L.path.forEach((p,i)=>{const f=L.frame(i),x=p[0]+f.n[0]*off,y=p[1]+f.n[1]*off;
      i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();};
  ctx.lineJoin='round';ctx.lineCap='round';
  ctx.save();ctx.translate(0,R*0.03);trace(0);ctx.strokeStyle='#64748b';ctx.lineWidth=L.hw*2+R*0.09;ctx.stroke();ctx.restore();
  trace(0);ctx.strokeStyle='#94a3b8';ctx.lineWidth=L.hw*2+R*0.09;ctx.stroke();
  trace(0);ctx.strokeStyle='#38bdf8';ctx.lineWidth=L.hw*2;ctx.stroke();
  trace(0);ctx.strokeStyle='#0ea5e9';ctx.lineWidth=L.hw*1.05;ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=R*0.013;ctx.setLineDash([R*0.05,R*0.11]);
  ctx.lineDashOffset=-ph*R*9;trace(L.hw*0.55);ctx.stroke();
  ctx.lineDashOffset=-ph*R*7+R*0.06;trace(-L.hw*0.5);ctx.stroke();ctx.setLineDash([]);
  const items=[], W=['#ef4444','#facc15','#22c55e','#3b82f6','#e2e8f0','#a855f7'];
  const rock=r=>{ctx.fillStyle='rgba(15,23,42,.2)';ctx.beginPath();ctx.ellipse(r.x+fl*r.s*0.3,r.y+r.s*0.5,r.s*1.1,r.s*0.5,0,0,7);ctx.fill();
    ctx.fillStyle=r.col;ctx.beginPath();r.pts.forEach((p,i)=>i?ctx.lineTo(r.x+p[0],r.y+p[1]):ctx.moveTo(r.x+p[0],r.y+p[1]));ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.22)';ctx.beginPath();
    r.pts.slice(0,4).forEach((p,i)=>{const x=r.x+p[0]*0.6,y=r.y+p[1]*0.6-r.s*0.2;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.fill();};
  L.rocks.forEach(r=>items.push({k:r.y,f:()=>rock(r)}));
  L.mound.forEach(r=>items.push({k:r.y-R*0.02,f:()=>rock(r)}));
  L.stream.forEach(s=>items.push({k:s.y,f:()=>{ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();
    ctx.ellipse(s.x,s.y+R*0.012,R*0.065,R*0.03,0,0,7);ctx.fill();rock(s.rock);
    ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=R*0.01;ctx.beginPath();ctx.ellipse(s.x,s.y+R*0.014,R*0.05,R*0.022,0,0,Math.PI);ctx.stroke();}}));
  L.bushes.forEach(b=>items.push({k:b.y,f:()=>{ctx.fillStyle='rgba(15,23,42,.18)';ctx.beginPath();ctx.ellipse(b.x+fl*b.r*0.3,b.y+b.r*0.35,b.r*1.1,b.r*0.45,0,0,7);ctx.fill();
    ctx.fillStyle=b.c;ctx.beginPath();ctx.arc(b.x,b.y-b.r*0.4,b.r,0,7);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.18)';ctx.beginPath();ctx.arc(b.x-b.r*0.3,b.y-b.r*0.7,b.r*0.45,0,7);ctx.fill();}}));
  L.trees.forEach(t=>items.push({k:t.y,f:()=>{
    ctx.fillStyle='rgba(15,23,42,.22)';ctx.beginPath();ctx.ellipse(t.x+fl*t.h*0.18,t.y+t.h*0.03,t.h*0.32,t.h*0.12,0,0,7);ctx.fill();
    ctx.fillStyle='#78350f';ctx.fillRect(t.x-t.h*0.04,t.y-t.h*0.3,t.h*0.08,t.h*0.3);
    if(t.pine){[[0.95,0.3],[0.72,0.23],[0.5,0.16]].forEach(([top,w],i)=>{ctx.fillStyle=shade('#1f6b46',i*0.1);
      ctx.beginPath();ctx.moveTo(t.x,t.y-t.h*top-t.h*0.25);ctx.lineTo(t.x+t.h*w,t.y-t.h*(top-0.4));ctx.lineTo(t.x-t.h*w,t.y-t.h*(top-0.4));ctx.fill();});}
    else{[[-0.12,0.55,0.26,-0.25],[0.13,0.52,0.25,-0.1],[0,0.8,0.27,0.1]].forEach(([dx,y,r,s])=>{
      ctx.fillStyle=shade(t.g,s);ctx.beginPath();ctx.arc(t.x+dx*t.h,t.y-y*t.h,r*t.h,0,7);ctx.fill();});}}}));
  items.push({k:L.M0[1]+R*0.01,f:()=>{                                         // waterfall into the channel
    const top=[L.M0[0]+(L.wf.p[0]-L.M0[0])*0.35,L.M0[1]-R*0.13];
    for(let i=-1;i<=1;i++){ctx.strokeStyle=i?'rgba(186,230,253,.9)':'rgba(255,255,255,.95)';ctx.lineWidth=R*0.03;
      ctx.beginPath();ctx.moveTo(top[0]+i*R*0.03,top[1]);ctx.lineTo(L.wf.p[0]+i*R*0.03,L.wf.p[1]);ctx.stroke();}
    ctx.fillStyle='rgba(255,255,255,.8)';ctx.beginPath();ctx.ellipse(L.wf.p[0],L.wf.p[1]+R*0.01,R*0.1,R*0.045,0,0,7);ctx.fill();}});
  const s=L.st,Q=[s.p[0]+s.n[0]*(L.hw+R*0.12),s.p[1]+s.n[1]*(L.hw+R*0.12)];     // station with accent canopy
  const q=(a,b,up)=>[Q[0]+s.T[0]*a+s.n[0]*b,Q[1]+s.T[1]*a+s.n[1]*b-up];
  items.push({k:Q[1],f:()=>{
    const poly=(pts,fill,stroke)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
      ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=R*0.012;ctx.stroke();}};
    const A=R*0.17,B=R*0.085;
    poly([q(-A,-B,0),q(A,-B,0),q(A,B,0),q(-A,B,0)],'#e2e8f0','#94a3b8');
    ctx.strokeStyle='#94a3b8';ctx.lineWidth=R*0.016;
    [[-A,B],[A,B],[A,-B],[-A,-B]].forEach(([a,b])=>{const p=q(a,b,0),t=q(a,b,R*0.16);ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(t[0],t[1]);ctx.stroke();});
    poly([q(-A*1.1,-B*1.15,R*0.16),q(A*1.1,-B*1.15,R*0.16),q(A*1.1,B*1.15,R*0.16),q(-A*1.1,B*1.15,R*0.16)],accent,shade(accent,-0.3));}});
  for(let k=0;k<4;k++){                                                          // rafts
    const i=Math.floor(((ph+k/4)%1)*L.N), p=L.path[i], rx=R*0.085, ry=rx*0.58, spin=ph*14+k*1.7;
    items.push({k:p[1],f:()=>{
      ctx.fillStyle=accent;ctx.beginPath();ctx.ellipse(p[0],p[1],rx,ry,0,0,7);ctx.fill();
      ctx.fillStyle=shade(accent,-0.5);ctx.beginPath();ctx.ellipse(p[0],p[1],rx*0.62,ry*0.62,0,0,7);ctx.fill();
      [0,1,2,3].map(j=>spin+j*Math.PI/2).sort((a,b)=>Math.sin(a)-Math.sin(b)).forEach((a,j)=>{
        const x=p[0]+rx*0.7*Math.cos(a),y=p[1]+ry*0.7*Math.sin(a);
        ctx.fillStyle=W[(k*2+j)%6];ctx.fillRect(x-R*0.016,y-R*0.05,R*0.032,R*0.05);
        ctx.fillStyle='#fde4c8';ctx.beginPath();ctx.arc(x,y-R*0.065,R*0.02,0,7);ctx.fill();});}});
  }
  items.sort((a,b)=>a.k-b.k).forEach(it=>it.f());
  ctx.restore();
}
/**
 * Cyclone-style wooden twister: a station, a tall lift hill + steep first drop at one end, then seven decreasing
 * hills as the track weaves back and forth across a compact footprint and crosses over itself, all on a brown timber trestle.
 * drawWoodCoasterSide(ctx, cx, cy, R, opts)  -- two hexes side by side (E-W). cx,cy = midpoint of the two hex centers.
 * drawWoodCoasterDiag(ctx, cx, cy, R, opts)  -- two hexes diagonal, NW-SE ("\"). cx,cy = midpoint of the two hex centers.
 * drawWoodCoasterDiagDir(ctx, cx, cy, R, opts, dir) -- dir 'NW-SE' or 'NE-SW' (mirrors the diagonal sprite)
 *  opts.accent : Land color -> the cars and the station roof (plus the hex border)
 *  opts.t      : train position 0..1 around the circuit
 *  opts.flip   : true when called under ctx.scale(-1,1)
 */
function drawWoodCoasterSide(ctx,cx,cy,R,o){return woodCoasterCore(ctx,cx,cy,R,o||{},'side');}
function drawWoodCoasterDiag(ctx,cx,cy,R,o){return woodCoasterCore(ctx,cx,cy,R,o||{},'diag');}
function drawWoodCoasterDiagDir(ctx,cx,cy,R,o,dir){
  if(dir!=='NE-SW') return drawWoodCoasterDiag(ctx,cx,cy,R,o);
  ctx.save(); ctx.translate(cx,cy); ctx.scale(-1,1);
  drawWoodCoasterDiag(ctx,0,0,R,Object.assign({},o,{flip:true})); ctx.restore();
}
function woodCoasterLayout(R,mode){
  woodCoasterLayout._c=woodCoasterLayout._c||{}; const key=mode+R; if(woodCoasterLayout._c[key]) return woodCoasterLayout._c[key];
  const side=mode==='side', N=420, TAU=Math.PI*2, Ph=3/7, phi=1.0;
  const hexes=side?[[-0.866*R,0],[0.866*R,0]]:[[-0.433*R,-0.435*R],[0.433*R,0.435*R]];
  const axis=side?[1,0]:[0.706,0.709], lat=side?[0,1]:[-0.706,0.709], a=side?1.3*R:0.9*R;
  const ampF=ax=>side?R*(0.12+0.22*Math.exp(-Math.pow((Math.abs(ax)-0.866*R)/(0.5*R),2))):0.36*R*Math.pow(Math.max(0,1-Math.pow(ax/(0.95*R),2)),0.5);
  const pk=[0.78,0.52,0.44,0.38,0.32,0.27,0.22];
  const zF=p=>{const m=Math.min(6,Math.floor(p/Ph)),q=(p-m*Ph)/Ph;let w=0.5-0.5*Math.cos(TAU*q);
    if(m===0&&q<0.5)w=0.5*w+0.5*(q/0.5);                                         // the lift hill climbs more steadily
    const t=p/Ph-0.5,i0=Math.max(0,Math.min(5,Math.floor(t))),fr=Math.max(0,Math.min(1,t-i0));
    const env=t<0?pk[0]:pk[i0]*(1-fr)+pk[i0+1]*fr;return R*(0.07+env*w);};
  const path=[],zs=[];
  for(let i=0;i<N;i++){const p=3*i/N,ax=a*Math.sin(TAU*p),ly=ampF(ax)*Math.sin(TAU*(2/3)*p+phi);
    path.push([axis[0]*ax+lat[0]*ly,axis[1]*ax+lat[1]*ly]);zs.push(zF(p));}
  const frames=path.map((_,i)=>{const A=path[(i+N-1)%N],B=path[(i+1)%N],dx=B[0]-A[0],dy=B[1]-A[1],l=Math.hypot(dx,dy)||1;
    return{T:[dx/l,dy/l],n:[-dy/l,dx/l]};});
  return woodCoasterLayout._c[key]={hexes,path,zs,frames,N};
}
function woodCoasterCore(ctx,cx,cy,R,o,mode){
  const accent=o.accent||'#f8fafc', fl=o.flip?-1:1, ph=o.t==null?0:o.t, L=woodCoasterLayout(R,mode), N=L.N;
  ctx.save(); ctx.translate(cx,cy);
  const addHex=(x,y,r)=>{for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);
    ctx[i?'lineTo':'moveTo'](x+r*Math.cos(a),y+r*Math.sin(a)*0.58);}ctx.closePath();};
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const poly=(pts,fill)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
    ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=fill;ctx.lineWidth=0.8;ctx.stroke();};
  const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
  L.hexes.forEach(h=>{ctx.beginPath();addHex(h[0],h[1],R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();
    ctx.beginPath();addHex(h[0],h[1],R*0.9);ctx.fillStyle='#d8cfb8';ctx.fill();});
  // soft shadow of the whole structure, clipped to the tiles
  ctx.save();ctx.beginPath();L.hexes.forEach(h=>addHex(h[0],h[1],R*0.92));ctx.clip();
  ctx.strokeStyle='rgba(60,40,20,.16)';ctx.lineWidth=R*0.07;ctx.lineJoin='round';ctx.beginPath();
  for(let i=0;i<=N;i++){const g=L.path[i%N],z=L.zs[i%N],x=g[0]+fl*z*0.3,y=g[1]+z*0.15;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
  ctx.stroke();ctx.restore();
  const elev=i=>{i=(i+N)%N;const g=L.path[i];return[g[0],g[1]-L.zs[i]];};
  const items=[], hwd=R*0.042, T0=R*0.03;
  for(let i=0;i<N;i++){
    const j=(i+1)%N,fa=L.frames[i],fb=L.frames[j],pa=elev(i),pb=elev(j),za=L.zs[i],key=L.path[i][1]+za*0.05;
    const e=(p,f,w,s)=>[p[0]+f.n[0]*w*s,p[1]+f.n[1]*w*s];
    const sg=fa.n[1]>=0?1:-1, lift=i<N*3/N*0&&false;
    if(i%5===0&&za>R*0.1){                                                       // timber bent: two posts, ties and X-bracing
      const g=L.path[i],f1=e(g,fa,R*0.05,1),f2=e(g,fa,R*0.05,-1),h1=[pa[0]+fa.n[0]*R*0.05,pa[1]+fa.n[1]*R*0.05+T0],h2=[pa[0]-fa.n[0]*R*0.05,pa[1]-fa.n[1]*R*0.05+T0];
      const lv=Math.max(1,Math.round(za/(R*0.16)));
      items.push({k:key-0.001,f:()=>{
        [[f1,h1],[f2,h2]].forEach(([f,h])=>{line(f,h,'#5a3414',R*0.02);line([f[0]-R*0.005,f[1]],[h[0]-R*0.005,h[1]],'#a16a3a',R*0.006);});
        for(let k=0;k<lv;k++){const t0=k/lv,t1=(k+1)/lv,A=lerp(f1,h1,t0),B=lerp(f2,h2,t0),C=lerp(f1,h1,t1),D=lerp(f2,h2,t1);
          line(A,B,'#6b3e1a',R*0.011);if(k%2)line(A,D,'#8b5a2b',R*0.008);else line(B,C,'#8b5a2b',R*0.008);}
        line(h1,h2,'#4a2a10',R*0.016);}});
    }
    const ea=[e(pa,fa,hwd,1),e(pa,fa,hwd,-1)],eb=[e(pb,fb,hwd,1),e(pb,fb,hwd,-1)], th=R*0.026;
    items.push({k:key,f:()=>{
      const s=sg>0?0:1;
      poly([ea[s],eb[s],[eb[s][0],eb[s][1]+th],[ea[s][0],ea[s][1]+th]],'#5a3414');           // deck side
      poly([ea[0],eb[0],eb[1],ea[1]],'#a0693a');                                              // wooden deck
      if(i%3===0)line(e(pa,fa,hwd,1),e(pa,fa,hwd,-1),'#6b3e1a',R*0.008);                     // ties
      [0.45,-0.45].forEach(s2=>line(e(pa,fa,hwd,s2),e(pb,fb,hwd,s2),'#cbd5e1',R*0.012));    // steel rails
      if(i<N*0.0714)line(pa,pb,'#1f2937',R*0.01);                                             // lift chain
    }});
  }
  // station: platform + roof beside the track at the start/finish
  const f0=L.frames[0],g0=L.path[0],s0=f0.n[1]>=0?1:-1,pz=R*0.03;
  const sp=(u,v,z)=>[g0[0]+f0.T[0]*u+f0.n[0]*v*s0,g0[1]+f0.T[1]*u+f0.n[1]*v*s0-z];
  items.push({k:g0[1]-R*0.02,f:()=>{
    poly([sp(-R*0.26,R*0.07,pz),sp(R*0.26,R*0.07,pz),sp(R*0.26,R*0.22,pz),sp(-R*0.26,R*0.22,pz)],'#e2e8f0');
    poly([sp(-R*0.26,R*0.2,pz),sp(R*0.26,R*0.2,pz),sp(R*0.26,R*0.2,0),sp(-R*0.26,R*0.2,0)],'#94a3b8');}});
  items.push({k:g0[1]+R*0.3,f:()=>{
    [[-0.22,0.2],[0.22,0.2],[-0.22,0.1],[0.22,0.1]].forEach(([u,v])=>line(sp(R*u,R*v,pz),sp(R*u,R*v,R*0.15),'#6b3e1a',R*0.014));
    poly([sp(-R*0.25,R*0.08,R*0.15),sp(R*0.25,R*0.08,R*0.15),sp(R*0.25,R*0.23,R*0.15),sp(-R*0.25,R*0.23,R*0.15)],accent);
    line(sp(-R*0.25,R*0.23,R*0.15),sp(R*0.25,R*0.23,R*0.15),shade(accent,-0.35),R*0.014);
    for(let k=1;k<4;k++)line(sp(-R*0.25+k*R*0.125,R*0.08,R*0.15),sp(-R*0.25+k*R*0.125,R*0.23,R*0.15),shade(accent,-0.2),R*0.006);}});
  // two trains of three cars in the Land color
  const heads=[Math.floor(((ph%1)+1)%1*N),Math.floor((((ph+0.5)%1)+1)%1*N)];
  heads.forEach((h0,ti)=>{for(let c=0;c<3;c++){const i=((h0-c*5)%N+N)%N,p=elev(i),pn=elev(i+2),pp=elev(i-2),f=L.frames[i];
    let tx=pn[0]-pp[0],ty=pn[1]-pp[1];const tl=Math.hypot(tx,ty)||1;tx/=tl;ty/=tl;
    const ctr=[p[0],p[1]-R*0.022],lx=R*0.042,ly=R*0.024,sg=f.n[1]>=0?1:-1;
    const q=(a,b,dz)=>[ctr[0]+tx*a+f.n[0]*b*sg,ctr[1]+ty*a+f.n[1]*b*sg+dz];
    items.push({k:L.path[i][1]+L.zs[i]*0.05+0.01,f:()=>{
      poly([q(-lx,ly,0),q(lx,ly,0),q(lx,ly,R*0.028),q(-lx,ly,R*0.028)],shade(accent,-0.35));       // near side
      poly([q(-lx,-ly,0),q(lx,-ly,0),q(lx,ly,0),q(-lx,ly,0)],accent);                              // top
      poly([q(lx*0.55,-ly,-R*0.012),q(lx,-ly,-R*0.012),q(lx,ly,-R*0.012),q(lx*0.55,ly,-R*0.012)],shade(accent,0.3));   // front hood
      [-0.4,0.4].forEach(d=>{const h=q(-lx*0.15+d*lx*0.9*0,d*ly*0.9,-R*0.03);ctx.fillStyle='#fde4c8';ctx.beginPath();ctx.arc(h[0],h[1],R*0.017,0,7);ctx.fill();
        ctx.fillStyle='#f8fafc';ctx.fillRect(h[0]-R*0.01,h[1]+R*0.012,R*0.02,R*0.014);});}});}});
  items.sort((a,b)=>a.k-b.k).forEach(it=>it.f());
  ctx.restore();
}
/**
 * drawFlumeSide(ctx, cx, cy, R, opts)  -- two hexes side by side (E-W). cx,cy = midpoint of the two hex centers.
 * drawFlumeDiag(ctx, cx, cy, R, opts)  -- two hexes diagonal, NW-SE ("\"). cx,cy = midpoint of the two hex centers.
 * drawFlumeDiagDir(ctx, cx, cy, R, opts, dir) -- dir 'NW-SE' or 'NE-SW' (mirrors the diagonal sprite)
 *  opts.accent : Land color (default Generic white) -> hex border, lift-hill trim, log bands, station canopy
 *  opts.t      : log position 0..1 around the circuit (also drives the current and the splash)
 *  opts.flip   : true when called under ctx.scale(-1,1)
 */
function drawFlumeSide(ctx,cx,cy,R,o){return flumeCore(ctx,cx,cy,R,o||{},'side');}
function drawFlumeDiag(ctx,cx,cy,R,o){return flumeCore(ctx,cx,cy,R,o||{},'diag');}
function drawFlumeDiagDir(ctx,cx,cy,R,o,dir){
  if(dir!=='NE-SW') return drawFlumeDiag(ctx,cx,cy,R,o);
  ctx.save(); ctx.translate(cx,cy); ctx.scale(-1,1);
  drawFlumeDiag(ctx,0,0,R,Object.assign({},o,{flip:true})); ctx.restore();
}
function flumeProfile(u){                           // trough height (x R) along the circuit; u=0 is the station
  const sm=t=>t*t*(3-2*t);
  if(u<0.07) return 0.07;
  if(u<0.5){const t=(u-0.07)/0.43;return 0.07+0.57*(0.35*sm(t)+0.65*t);}           // lift hill
  if(u<0.72) return 0.64;                                                          // top run
  if(u<0.8) return 0.64-0.58*sm((u-0.72)/0.08);                                    // the drop
  return 0.06+0.01*Math.max(0,(u-0.88)/0.12);                                      // splash basin + run-out
}
function flumeLayout(R,mode){                       // built once per size + mode, then cached
  flumeLayout._c=flumeLayout._c||{}; const key=mode+R; if(flumeLayout._c[key]) return flumeLayout._c[key];
  let seed=mode==='side'?4242:9091; const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);
    t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
  const side=mode==='side', N=200, hw=R*(side?0.05:0.056), wall=R*0.028, shift=side?0:0.5, path=[];
  const hexes=side?[[-0.866*R,0],[0.866*R,0]]:[[-0.433*R,-0.435*R],[0.433*R,0.435*R]];
  if(side){
    for(let i=0;i<N;i++){const th=2*Math.PI*i/N,x=1.3*R*Math.cos(th),ax=Math.abs(x);
      const amp=R*(0.14+0.2*Math.exp(-Math.pow((ax-0.866*R)/(0.5*R),2)));
      path.push([x,amp*Math.sin(th)+R*0.03*Math.sin(3*th+1)]);}
  }else{
    const d=[0.866*R,0.87*R],nv=[0.706,-0.709];
    for(let i=0;i<N;i++){const th=2*Math.PI*i/N,al=0.74*Math.cos(th),sd=R*(0.36*Math.sin(th)+0.06*Math.sin(3*th+1));
      path.push([d[0]*al+nv[0]*sd,d[1]*al+nv[1]*sd]);}
  }
  const frame=i=>{i=(i+N)%N;const a=path[(i+N-1)%N],b=path[(i+1)%N],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy);
    const T=[dx/l,dy/l];let n=[-T[1],T[0]];const p=path[i];if(n[0]*p[0]+n[1]*p[1]<0)n=[-n[0],-n[1]];return{p,T,n};};
  const frames=path.map((_,i)=>frame(i)), iu=u=>Math.round(((u+shift)%1)*N)%N;
  const zs=[],ws=[];for(let i=0;i<N;i++){const u=((i/N-shift)+1)%1;zs.push(flumeProfile(u)*R);
    ws.push(1+0.85*Math.exp(-Math.pow((u-0.84)/0.03,2)));}
  const k0=0.9, inHex=(x,y,h)=>{const X=Math.abs(x-h[0])/R,Y=Math.abs(y-h[1])/(0.58*R);return X<=0.866*k0&&Y<=k0-X/1.732;};
  const inside=(x,y)=>inHex(x,y,hexes[0])||inHex(x,y,hexes[1]);
  const dist=(x,y)=>{let m=1e9;for(const p of path)m=Math.min(m,Math.hypot(x-p[0],y-p[1]));return m;};
  const stF=frames[iu(0.03)], mF=frames[iu(0.5)], basinF=frames[iu(0.84)];
  const M0=[mF.p[0]+mF.n[0]*R*0.17, mF.p[1]+mF.n[1]*R*0.17];
  const blob=(x,y,s,col)=>{const pts=[];for(let k=0;k<7;k++){const a=k/7*6.283+rnd()*0.5,r=s*(0.75+rnd()*0.4);
      pts.push([Math.cos(a)*r,Math.sin(a)*r*0.8]);}return {x,y,s,pts,col};};
  const nearSt=(x,y)=>Math.hypot(x-stF.p[0],y-stF.p[1])<R*0.27, nearM=(x,y)=>Math.hypot(x-M0[0],y-M0[1])<R*0.2;
  const rocks=[];
  for(let i=0;i<N;i+=3)[-1,1].forEach(sd=>{if(rnd()<0.5){const f=frames[i],o=hw+wall+R*0.04+rnd()*R*0.03;
    const x=f.p[0]+f.n[0]*sd*o,y=f.p[1]+f.n[1]*sd*o;
    if(inside(x,y)&&dist(x,y)>hw+R*0.06&&!nearM(x,y)&&!nearSt(x,y))
      rocks.push(blob(x,y,R*(0.03+rnd()*0.035),shade('#94a3b8',-0.25+rnd()*0.35)));}});
  [iu(0.8),iu(0.84),iu(0.88)].forEach(i=>[-1,1].forEach(sd=>{const f=frames[i],o=hw*1.9+wall+R*0.05;                  // basin boulders
    const x=f.p[0]+f.n[0]*sd*o+(rnd()-0.5)*R*0.03,y=f.p[1]+f.n[1]*sd*o;
    if(inside(x,y))rocks.push(blob(x,y,R*(0.04+rnd()*0.03),shade('#94a3b8',-0.3+rnd()*0.3)));}));
  const mound=[[0,0,0.1],[-0.07,0.06,0.075],[0.07,-0.05,0.075],[0,-0.1,0.075],[0.1,0.06,0.055],[-0.1,-0.04,0.06]]
    .map(([a,b,s])=>blob(M0[0]+a*R,M0[1]+b*R,R*s,shade('#94a3b8',-0.3+rnd()*0.25)));
  const trees=[],bushes=[],step=R*0.17,span=side?2.3:1.25;
  for(let gx=-span*R;gx<=span*R;gx+=step)for(let gy=-1.2*R;gy<=1.2*R;gy+=step){
    const x=gx+(rnd()-0.5)*R*0.1,y=gy+(rnd()-0.5)*R*0.1;
    if(rnd()<0.9&&inside(x,y)&&dist(x,y)>hw+R*0.13&&!nearM(x,y)&&Math.hypot(x-stF.p[0],y-stF.p[1])>R*0.3&&
       trees.every(t=>Math.hypot(t.x-x,t.y-y)>R*0.12))
      trees.push({x,y,h:R*(0.17+rnd()*0.11),pine:rnd()<0.4,g:['#2f7d4f','#3f9d5f','#256d44'][Math.floor(rnd()*3)]});}
  for(let gx=-span*R;gx<=span*R;gx+=R*0.1)for(let gy=-1.2*R;gy<=1.2*R;gy+=R*0.1){
    const x=gx+(rnd()-0.5)*R*0.06,y=gy+(rnd()-0.5)*R*0.06;
    if(rnd()<0.28&&inside(x,y)&&dist(x,y)>hw+R*0.08&&!nearM(x,y)&&!nearSt(x,y)&&
       trees.every(t=>Math.hypot(t.x-x,t.y-y)>R*0.09)&&bushes.every(b=>Math.hypot(b.x-x,b.y-y)>R*0.07))
      bushes.push({x,y,r:R*(0.028+rnd()*0.02),c:['#3f9d5f','#4aa86a','#2f7d4f'][Math.floor(rnd()*3)]});}
  return flumeLayout._c[key]={hexes,path,N,hw,wall,frames,zs,ws,iu,shift,stF,basinF,M0,rocks,mound,trees,bushes};
}
function flumeCore(ctx,cx,cy,R,o,mode){
  const accent=o.accent||'#f8fafc', fl=o.flip?-1:1, ph=o.t==null?0.12:o.t, L=flumeLayout(R,mode), N=L.N;
  ctx.save(); ctx.translate(cx,cy);
  const addHex=(x,y,r)=>{for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);
    ctx[i?'lineTo':'moveTo'](x+r*Math.cos(a),y+r*Math.sin(a)*0.58);}ctx.closePath();};
  L.hexes.forEach(h=>{ctx.beginPath();addHex(h[0],h[1],R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();
    ctx.beginPath();addHex(h[0],h[1],R*0.9);ctx.fillStyle='#a8c99b';ctx.fill();});
  const poly=(pts,fill,stroke)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=fill;ctx.lineWidth=0.8;ctx.stroke();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=R*0.012;ctx.stroke();}};
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const items=[], W=['#ef4444','#facc15','#3b82f6','#e2e8f0','#f97316','#a855f7'], flow=Math.floor(ph*90);
  const elev=i=>{const g=L.path[i];return [g[0],g[1]-L.zs[i]];};
  // trough segments (with supports), sorted into the scene by ground depth
  for(let i=0;i<N;i++){const a=i,b=(i+1)%N,fa=L.frames[a],fb=L.frames[b],ha=L.hw*L.ws[a],hb=L.hw*L.ws[b],wl=L.wall;
    const pa=elev(a),pb=elev(b),u=((i/N-L.shift)+1)%1,lift=u>0.07&&u<0.5;
    const edge=(p,f,w)=>[[p[0]+f.n[0]*w,p[1]+f.n[1]*w],[p[0]-f.n[0]*w,p[1]-f.n[1]*w]];
    const ea=edge(pa,fa,ha+wl),eb=edge(pb,fb,hb+wl), wa=edge(pa,fa,ha),wb=edge(pb,fb,hb), ca=edge(pa,fa,ha*0.5),cb=edge(pb,fb,hb*0.5);
    const sg=fa.n[1]>=0?0:1, T=R*0.05;
    items.push({k:(L.path[a][1]+L.path[b][1])/2,f:()=>{
      if(i%9===0&&L.zs[a]>R*0.1){const g=L.path[a],z=L.zs[a];
        ctx.fillStyle='rgba(15,23,42,.25)';ctx.beginPath();ctx.ellipse(g[0],g[1]+R*0.005,R*0.045,R*0.02,0,0,7);ctx.fill();
        [-1,1].forEach(s=>line([pa[0]+fa.n[0]*s*ha*0.75,pa[1]+fa.n[1]*s*ha*0.75+T],[g[0]+fa.n[0]*s*ha*0.75,g[1]+fa.n[1]*s*ha*0.75],'#64748b',R*0.026));
        if(z>R*0.28)line([pa[0]-fa.n[0]*ha*0.75,pa[1]-fa.n[1]*ha*0.75+z*0.5],[pa[0]+fa.n[0]*ha*0.75,pa[1]+fa.n[1]*ha*0.75+z*0.5],'#64748b',R*0.014);
        line([pa[0]-fa.n[0]*ha*0.95,pa[1]-fa.n[1]*ha*0.95+T],[pa[0]+fa.n[0]*ha*0.95,pa[1]+fa.n[1]*ha*0.95+T],'#475569',R*0.02);}
      poly([ea[sg],eb[sg],[eb[sg][0],eb[sg][1]+T],[ea[sg][0],ea[sg][1]+T]],'#64748b');            // trough side wall
      poly([ea[0],eb[0],eb[1],ea[1]],'#94a3b8');                                                  // wall tops
      if(lift){[0,1].forEach(s=>poly([ea[s],eb[s],[(eb[s][0]*0.55+wb[s][0]*0.45),(eb[s][1]*0.55+wb[s][1]*0.45)],[(ea[s][0]*0.55+wa[s][0]*0.45),(ea[s][1]*0.55+wa[s][1]*0.45)]],accent));}
      poly([wa[0],wb[0],wb[1],wa[1]],'#38bdf8');                                                  // water
      poly([ca[0],cb[0],cb[1],ca[1]],'#0ea5e9');
      if((((i-flow)%10)+10)%10<3){[-0.5,0.5].forEach(s=>line([pa[0]+fa.n[0]*s*ha,pa[1]+fa.n[1]*s*ha],[pb[0]+fb.n[0]*s*hb,pb[1]+fb.n[1]*s*hb],'rgba(255,255,255,.7)',R*0.012));}
    }});
  }
  // the splash where a log hits the basin
  const bi=L.iu(0.84), bp=elev(bi), logs=[0,1,2].map(k=>(ph+k/3+0.05)%1);
  const hit=Math.max(...logs.map(u=>Math.exp(-Math.pow((u-0.83)/0.03,2))));
  items.push({k:L.path[bi][1]+R*0.02,f:()=>{ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.ellipse(bp[0],bp[1]+R*0.01,R*0.12,R*0.05,0,0,7);ctx.fill();
    [[-0.07,0.9],[0.0,1.2],[0.07,0.8],[-0.03,0.6],[0.04,1.0]].forEach(([dx,h],j)=>{const r=R*(0.02+0.016*hit*h);
      ctx.fillStyle='rgba(255,255,255,'+(0.55+0.4*hit)+')';ctx.beginPath();ctx.arc(bp[0]+dx*R,bp[1]-R*(0.02+0.11*hit*h)-j*R*0.004,r,0,7);ctx.fill();});}});
  // logs: hollow-log boats with four riders and an accent band
  logs.forEach((u,k)=>{const i=L.iu(u),p=elev(i),f=L.frames[i],pn=elev((i+2)%N),pp=elev((i+N-2)%N);
    let tx=pn[0]-pp[0],ty=pn[1]-pp[1];const tl=Math.hypot(tx,ty)||1;tx/=tl;ty/=tl;
    items.push({k:L.path[i][1]+R*0.015,f:()=>{
      const a=[p[0]-tx*R*0.105,p[1]-ty*R*0.105],b=[p[0]+tx*R*0.105,p[1]+ty*R*0.105];
      line(a,b,'#4a2a10',R*0.085);line(a,b,'#7c4a21',R*0.068);line([a[0],a[1]-R*0.012],[b[0],b[1]-R*0.012],'#a16207',R*0.02);
      line([b[0]-tx*R*0.02,b[1]-ty*R*0.02],b,accent,R*0.07);
      for(let j=0;j<4;j++){const q=[p[0]+tx*(j-1.5)*R*0.05,p[1]+ty*(j-1.5)*R*0.05-R*0.02];
        ctx.fillStyle=W[(k*3+j)%6];ctx.fillRect(q[0]-R*0.016,q[1]-R*0.05,R*0.032,R*0.052);
        ctx.fillStyle='#fde4c8';ctx.beginPath();ctx.arc(q[0],q[1]-R*0.064,R*0.02,0,7);ctx.fill();}}});
  });
  // scenery
  const rock=r=>{ctx.fillStyle='rgba(15,23,42,.2)';ctx.beginPath();ctx.ellipse(r.x+fl*r.s*0.3,r.y+r.s*0.5,r.s*1.1,r.s*0.5,0,0,7);ctx.fill();
    ctx.fillStyle=r.col;ctx.beginPath();r.pts.forEach((p,i)=>i?ctx.lineTo(r.x+p[0],r.y+p[1]):ctx.moveTo(r.x+p[0],r.y+p[1]));ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.22)';ctx.beginPath();
    r.pts.slice(0,4).forEach((p,i)=>{const x=r.x+p[0]*0.6,y=r.y+p[1]*0.6-r.s*0.2;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.fill();};
  L.rocks.forEach(r=>items.push({k:r.y,f:()=>rock(r)}));
  L.mound.forEach(r=>items.push({k:r.y,f:()=>rock(r)}));
  L.bushes.forEach(b=>items.push({k:b.y,f:()=>{ctx.fillStyle='rgba(15,23,42,.18)';ctx.beginPath();ctx.ellipse(b.x+fl*b.r*0.3,b.y+b.r*0.35,b.r*1.1,b.r*0.45,0,0,7);ctx.fill();
    ctx.fillStyle=b.c;ctx.beginPath();ctx.arc(b.x,b.y-b.r*0.4,b.r,0,7);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.18)';ctx.beginPath();ctx.arc(b.x-b.r*0.3,b.y-b.r*0.7,b.r*0.45,0,7);ctx.fill();}}));
  L.trees.forEach(t=>items.push({k:t.y,f:()=>{
    ctx.fillStyle='rgba(15,23,42,.22)';ctx.beginPath();ctx.ellipse(t.x+fl*t.h*0.18,t.y+t.h*0.03,t.h*0.32,t.h*0.12,0,0,7);ctx.fill();
    ctx.fillStyle='#78350f';ctx.fillRect(t.x-t.h*0.04,t.y-t.h*0.3,t.h*0.08,t.h*0.3);
    if(t.pine){[[0.95,0.3],[0.72,0.23],[0.5,0.16]].forEach(([top,w],i)=>{ctx.fillStyle=shade('#1f6b46',i*0.1);
      ctx.beginPath();ctx.moveTo(t.x,t.y-t.h*top-t.h*0.25);ctx.lineTo(t.x+t.h*w,t.y-t.h*(top-0.4));ctx.lineTo(t.x-t.h*w,t.y-t.h*(top-0.4));ctx.fill();});}
    else{[[-0.12,0.55,0.26,-0.25],[0.13,0.52,0.25,-0.1],[0,0.8,0.27,0.1]].forEach(([dx,y,r,s])=>{
      ctx.fillStyle=shade(t.g,s);ctx.beginPath();ctx.arc(t.x+dx*t.h,t.y-y*t.h,r*t.h,0,7);ctx.fill();});}}}));
  // station: platform + accent canopy beside the trough
  const s=L.stF,Q=[s.p[0]+s.n[0]*(L.hw+L.wall+R*0.075),s.p[1]+s.n[1]*(L.hw+L.wall+R*0.075)];
  const q=(a,b,up)=>[Q[0]+s.T[0]*a+s.n[0]*b,Q[1]+s.T[1]*a+s.n[1]*b-up];
  items.push({k:Q[1],f:()=>{const A=R*0.13,B=R*0.062;
    poly([q(-A,-B,0),q(A,-B,0),q(A,B,0),q(-A,B,0)],'#e2e8f0','#94a3b8');
    ctx.strokeStyle='#94a3b8';ctx.lineWidth=R*0.016;
    [[-A,B],[A,B],[A,-B],[-A,-B]].forEach(([a,b])=>{const p=q(a,b,0),t=q(a,b,R*0.14);ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(t[0],t[1]);ctx.stroke();});
    poly([q(-A*1.1,-B*1.15,R*0.14),q(A*1.1,-B*1.15,R*0.14),q(A*1.1,B*1.15,R*0.14),q(-A*1.1,B*1.15,R*0.14)],accent,shade(accent,-0.3));}});
  items.sort((a,b)=>a.k-b.k).forEach(it=>it.f());
  ctx.restore();
}

/**
 * drawRestrooms(ctx, cx, cy, R, opts)
 *  opts.accent : Land color (default Generic white) -> border, roof, door frames, planter ribbon
 *  opts.flip   : true when called under ctx.scale(-1,1) (keeps shadows on the same screen side)
 *  opts.tile   : draw the hex tile (default true)
 */
function drawRestrooms(ctx,cx,cy,R,o={}){
  const accent=o.accent||'#f8fafc', fl=o.flip?-1:1;
  const Q=(X,Y,Z)=>[cx+(X-Y)*0.7, cy+(X+Y)*0.35-Z];
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.012;ctx.stroke();}};
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const x0=-R*0.34,x1=R*0.34,y0=-R*0.2,y1=R*0.2,H=R*0.25,z0=R*0.03;
  if(o.tile!==false){hexPath(ctx,cx,cy,R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();}
  poly([Q(-R*0.62,-R*0.5,z0),Q(R*0.62,-R*0.5,z0),Q(R*0.62,R*0.5,z0),Q(-R*0.62,R*0.5,z0)],'#e2e8f0','#94a3b8');
  ctx.save();ctx.translate(fl*R*0.1,R*0.05);
  poly([Q(x0,y0,z0),Q(x1,y0,z0),Q(x1,y1,z0),Q(x0,y1,z0)],'rgba(15,23,42,.22)');ctx.restore();
  // walls
  poly([Q(x0,y1,z0),Q(x1,y1,z0),Q(x1,y1,H),Q(x0,y1,H)],'#f1f5f9');
  poly([Q(x1,y0,z0),Q(x1,y1,z0),Q(x1,y1,H),Q(x1,y0,H)],'#cbd5e1');
  // fascia band with lettering
  poly([Q(x0,y1,R*0.14),Q(x1,y1,R*0.14),Q(x1,y1,H),Q(x0,y1,H)],shade(accent,-0.25));
  poly([Q(x1,y0,R*0.14),Q(x1,y1,R*0.14),Q(x1,y1,H),Q(x1,y0,H)],shade(accent,-0.45));
  { const so=Q(x0,y1,H);ctx.save();ctx.transform(0.7,0.35,0,1,so[0],so[1]);
    ctx.fillStyle='#f8fafc';ctx.font='bold '+(R*0.05)+'px Arial, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('RESTROOMS',(x1-x0)/2,R*0.085);ctx.restore(); }
  // two doors with pictograms, a louvre vent between them
  const door=(xa,xb,kind)=>{
    poly([Q(xa-R*0.015,y1,z0),Q(xb+R*0.015,y1,z0),Q(xb+R*0.015,y1,R*0.135),Q(xa-R*0.015,y1,R*0.135)],accent);
    poly([Q(xa,y1,z0),Q(xb,y1,z0),Q(xb,y1,R*0.125),Q(xa,y1,R*0.125)],'#334155');
    const so=Q(xa,y1,R*0.12);ctx.save();ctx.transform(0.7,0.35,0,1,so[0],so[1]);ctx.scale(1.43,1);
    const wl=(xb-xa)/1.43, m=wl/2;ctx.fillStyle='#f8fafc';ctx.strokeStyle='#f8fafc';ctx.lineWidth=R*0.012;ctx.lineCap='round';
    ctx.beginPath();ctx.arc(m,R*0.02,R*0.014,0,7);ctx.fill();
    if(kind==='m'){ctx.fillRect(m-R*0.016,R*0.036,R*0.032,R*0.04);
      [-1,1].forEach(s=>{ctx.beginPath();ctx.moveTo(m+s*R*0.008,R*0.076);ctx.lineTo(m+s*R*0.008,R*0.1);ctx.stroke();});}
    else{ctx.beginPath();ctx.moveTo(m,R*0.036);ctx.lineTo(m-R*0.026,R*0.085);ctx.lineTo(m+R*0.026,R*0.085);ctx.fill();
      [-1,1].forEach(s=>{ctx.beginPath();ctx.moveTo(m+s*R*0.01,R*0.085);ctx.lineTo(m+s*R*0.01,R*0.1);ctx.stroke();});}
    ctx.restore();};
  door(-R*0.24,-R*0.08,'m');door(R*0.08,R*0.24,'w');
  for(let k=0;k<4;k++)line(Q(-R*0.035,y1,R*0.06+k*R*0.016),Q(R*0.035,y1,R*0.06+k*R*0.016),'#94a3b8',R*0.008);
  // pitched roof: gable end + front slope with shingle lines
  const ov=R*0.03, rh=R*0.1;
  poly([Q(x1,y0,H),Q(x1,y1,H),Q(x1,0,H+rh)],'#cbd5e1');
  poly([Q(x0-ov,y1+ov,H-R*0.01),Q(x1+ov,y1+ov,H-R*0.01),Q(x1+ov,0,H+rh),Q(x0-ov,0,H+rh)],accent);
  for(let t=0.25;t<1;t+=0.25){const y=(y1+ov)*(1-t),z=H-R*0.01+(rh+R*0.01)*t;
    line(Q(x0-ov,y,z),Q(x1+ov,y,z),shade(accent,-0.25),R*0.007);}
  line(Q(x0-ov,y1+ov,H-R*0.01),Q(x1+ov,y1+ov,H-R*0.01),shade(accent,-0.4),R*0.014);
  line(Q(x0-ov,0,H+rh),Q(x1+ov,0,H+rh),shade(accent,0.45),R*0.014);
  // site furniture: drinking fountain, planters, bench, bin (back to front)
  const bush=(X,Y)=>{const b=Q(X,Y,z0);ctx.fillStyle='rgba(15,23,42,.2)';ctx.beginPath();ctx.ellipse(b[0]+fl*R*0.03,b[1]+R*0.01,R*0.07,R*0.03,0,0,7);ctx.fill();
    poly([Q(X-R*0.05,Y-R*0.05,z0),Q(X+R*0.05,Y-R*0.05,z0),Q(X+R*0.05,Y+R*0.05,z0),Q(X-R*0.05,Y+R*0.05,z0)],'#92400e');
    [[-0.03,0,'#2f7d4f'],[0.03,-0.01,'#3f9d5f'],[0,-0.04,'#256d44']].forEach(([dx,dy,c])=>{ctx.fillStyle=c;ctx.beginPath();
      ctx.arc(b[0]+dx*R,b[1]-R*0.05+dy*R,R*0.045,0,7);ctx.fill();});};
  bush(-R*0.42,R*0.3);
  const f=Q(-R*0.4,R*0.42,z0);ctx.fillStyle='#94a3b8';ctx.fillRect(f[0]-R*0.015,f[1]-R*0.07,R*0.03,R*0.07);
  ctx.fillStyle='#e2e8f0';ctx.beginPath();ctx.ellipse(f[0],f[1]-R*0.07,R*0.035,R*0.016,0,0,7);ctx.fill();
  ctx.fillStyle='#38bdf8';ctx.beginPath();ctx.ellipse(f[0],f[1]-R*0.072,R*0.02,R*0.009,0,0,7);ctx.fill();
  bush(R*0.44,R*0.3);
  { const bx0=-R*0.12,bx1=R*0.2,by=R*0.4,sz=R*0.05;                              // bench
    [bx0+R*0.02,bx1-R*0.02].forEach(x=>poly([Q(x,by-R*0.04,z0),Q(x+R*0.02,by-R*0.04,z0),Q(x+R*0.02,by-R*0.04,sz),Q(x,by-R*0.04,sz)],'#64748b'));
    poly([Q(bx0,by-R*0.04,sz),Q(bx1,by-R*0.04,sz),Q(bx1,by+R*0.04,sz),Q(bx0,by+R*0.04,sz)],shade(accent,-0.1),shade(accent,-0.4),R*0.008);
    poly([Q(bx0,by-R*0.04,sz),Q(bx1,by-R*0.04,sz),Q(bx1,by-R*0.04,sz+R*0.06),Q(bx0,by-R*0.04,sz+R*0.06)],shade(accent,-0.3)); }
  const t=Q(R*0.34,R*0.46,z0);ctx.fillStyle='#64748b';ctx.fillRect(t[0]-R*0.025,t[1]-R*0.07,R*0.05,R*0.07);   // bin
  ctx.fillStyle=accent;ctx.beginPath();ctx.ellipse(t[0],t[1]-R*0.07,R*0.03,R*0.013,0,0,7);ctx.fill();
}

function cyl(ctx,x,y,rx,h,col){ // iso cylinder, ground-center (x,y), radius rx, height h
  const ry=rx*0.58;
  ctx.fillStyle=shade(col,-0.25); ctx.beginPath(); ctx.ellipse(x,y,rx,ry,0,0,7); ctx.fill();
  ctx.fillRect(x-rx,y-h,rx*2,h);
  ctx.fillStyle=shade(col,0.2); ctx.beginPath(); ctx.ellipse(x,y-h,rx,ry,0,0,7); ctx.fill();
}
/**
 * drawScrambler(ctx, cx, cy, R, opts)
 *  opts.accent : Land color (default Generic white)
 *  opts.t      : rotation angle in radians (arms turn at t, pods counter-spin faster)
 *  opts.tile   : draw the hex tile (default true)
 */
function drawScrambler(ctx,cx,cy,R,opts={}){
  const accent=opts.accent||'#f8fafc', th=opts.t==null?0.6:opts.t, sq=0.58;
  const L=R*0.5, pr=R*0.21, hz=R*0.13, riders=['#ef4444','#facc15','#22c55e','#3b82f6'];
  if(opts.tile!==false){
    hexPath(ctx,cx,cy,R); ctx.fillStyle='#cbd5e1'; ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06); ctx.strokeStyle=accent; ctx.stroke();
  }
  const arms=[0,1,2].map(k=>{const a=th+k*2*Math.PI/3;
    return {k,s:Math.sin(a),x:cx+L*Math.cos(a),y:cy+L*Math.sin(a)*sq};}).sort((p,q)=>p.s-q.s);
  ctx.fillStyle='rgba(15,23,42,.25)';                       // ground shadows
  ctx.beginPath();ctx.ellipse(cx+R*0.04,cy+R*0.03,R*0.2,R*0.2*sq,0,0,7);ctx.fill();
  arms.forEach(p=>{ctx.beginPath();ctx.ellipse(p.x+R*0.05,p.y+R*0.05,pr*1.05,pr*sq*1.05,0,0,7);ctx.fill();});
  cyl(ctx,cx,cy+R*0.02,R*0.17,R*0.07,'#64748b');            // base plinth

  function pod(p){
    const py=p.y-hz;
    ctx.lineCap='round'; ctx.strokeStyle='#475569'; ctx.lineWidth=R*0.055;       // arm
    ctx.beginPath();ctx.moveTo(cx,cy-hz);ctx.lineTo(p.x,py);ctx.stroke();
    ctx.strokeStyle='#94a3b8'; ctx.lineWidth=R*0.024;
    ctx.beginPath();ctx.moveTo(cx,cy-hz-R*0.012);ctx.lineTo(p.x,py-R*0.012);ctx.stroke();
    cyl(ctx,p.x,py+R*0.03,pr,R*0.03,'#475569');                                   // turntable
    ctx.strokeStyle=accent; ctx.lineWidth=Math.max(1.5,R*0.025);
    ctx.beginPath();ctx.ellipse(p.x,py,pr,pr*sq,0,0,7);ctx.stroke();
    const cars=[0,1,2,3].map(j=>{const b=-2.2*th+j*Math.PI/2+p.k;
      return {j,s:Math.sin(b),x:p.x+pr*0.72*Math.cos(b),y:py+pr*0.72*Math.sin(b)*sq};})
      .sort((u,v)=>u.s-v.s);
    cars.forEach(c=>{                                                            // 4 cars, back to front
      cyl(ctx,c.x,c.y,R*0.06,R*0.075,accent);
      ctx.fillStyle=riders[c.j]; ctx.beginPath();ctx.arc(c.x,c.y-R*0.1,R*0.026,0,7);ctx.fill();
    });
  }
  arms.filter(p=>p.s<0).forEach(pod);                        // arms behind the hub
  cyl(ctx,cx,cy,R*0.08,hz+R*0.1,'#94a3b8');                  // hub column
  arms.filter(p=>p.s>=0).forEach(pod);                       // arms in front
  cyl(ctx,cx,cy-hz-R*0.1,R*0.1,R*0.05,accent);              // hub cap
  ctx.fillStyle=shade(accent,0.4); ctx.beginPath();ctx.arc(cx,cy-hz-R*0.17,R*0.03,0,7);ctx.fill();
}

/**
 * drawSkyFly(ctx, cx, cy, R, opts)  -- tilted-boom flat ride: one boom swings round a leaning column and carries a ring of 12 winged seats
 *  opts.accent : Land color (default Generic white) -> hex border, column bands, boom stripe, counterweight, wings/seats, fence rail
 *  opts.t      : boom angle in radians (0 = boom pointing toward the viewer, +-PI/2 = lowest / highest)
 *  opts.r      : seat-ring roll angle in radians (riders spin the ring with their wings)
 *  opts.flip   : true when called under ctx.scale(-1,1) (keeps shadows on the same screen side)
 *  opts.tile   : draw the hex tile (default true)
 */
function drawSkyFly(ctx,cx,cy,R,o={}){
  const accent=o.accent||'#f8fafc', psi=o.t==null?-0.9:o.t, roll=o.r==null?0.4:o.r, fl=o.flip?-1:1, r=v=>R*v, TAU=Math.PI*2;
  const P=(X,Y,Z)=>[cx+(X-Y)*0.7, cy+(X+Y)*0.35-Z];
  const P3=v=>P(v[0],v[1],v[2]);
  const add=(a,b,k=1)=>[a[0]+b[0]*k,a[1]+b[1]*k,a[2]+b[2]*k];
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.stroke();}};
  const disc=(p,rr,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(p[0],p[1],rr,0,7);ctx.fill();};
  const z0=r(0.03), s2=Math.SQRT1_2;
  const A=[-0.5,0.5,s2], e1=[s2,s2,0], e2=[-0.5,0.5,-s2];                    // column axis + the plane the boom sweeps
  const G=[r(0.24),r(-0.24),z0], Lc=r(0.74), La=r(0.46), Rr=r(0.22);
  const Pv=add(G,A,Lc), u=[Math.cos(psi)*e1[0]+Math.sin(psi)*e2[0],Math.cos(psi)*e1[1]+Math.sin(psi)*e2[1],Math.cos(psi)*e1[2]+Math.sin(psi)*e2[2]];
  const E=add(Pv,u,La), Cw=add(Pv,u,-r(0.2));
  const w1=A, w2=[u[1]*A[2]-u[2]*A[1],u[2]*A[0]-u[0]*A[2],u[0]*A[1]-u[1]*A[0]];
  if(o.tile!==false){hexPath(ctx,cx,cy,R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();}
  // ground: slab, shadow of the ring, pedestal
  const sx=r(0.64),sy=r(0.5);poly([P(-sx,-sy,z0),P(sx,-sy,z0),P(sx,sy,z0),P(-sx,sy,z0)],'#e2e8f0','#94a3b8',R*0.012);
  const sh=P(E[0],E[1],z0);ctx.fillStyle='rgba(15,23,42,.17)';ctx.beginPath();ctx.ellipse(sh[0]+fl*E[2]*0.25,sh[1]+E[2]*0.12,r(0.2),r(0.08),0,0,7);ctx.fill();
  const bx=r(0.13),bz=z0+r(0.05);
  poly([P(G[0]-bx,G[1]+bx,z0),P(G[0]+bx,G[1]+bx,z0),P(G[0]+bx,G[1]+bx,bz),P(G[0]-bx,G[1]+bx,bz)],'#94a3b8');
  poly([P(G[0]+bx,G[1]-bx,z0),P(G[0]+bx,G[1]+bx,z0),P(G[0]+bx,G[1]+bx,bz),P(G[0]+bx,G[1]-bx,bz)],'#64748b');
  poly([P(G[0]-bx,G[1]-bx,bz),P(G[0]+bx,G[1]-bx,bz),P(G[0]+bx,G[1]+bx,bz),P(G[0]-bx,G[1]+bx,bz)],'#cbd5e1');
  [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([a,b])=>disc(P(G[0]+a*bx*0.7,G[1]+b*bx*0.7,bz),R*0.008,'#475569'));
  // the column, the boom (with counterweight) and the seat ring
  const Gp=P3([G[0],G[1],bz]),Pp=P3(Pv),Ep=P3(E),Cp=P3(Cw);
  const column=()=>{line(Gp,Pp,'#64748b',r(0.12));line(Gp,Pp,'#e2e8f0',r(0.095));line([Gp[0]-r(0.02),Gp[1]],[Pp[0]-r(0.02),Pp[1]],'#f8fafc',r(0.02));
    [[0.25,0.38],[0.62,0.75]].forEach(([a,b])=>line([Gp[0]+(Pp[0]-Gp[0])*a,Gp[1]+(Pp[1]-Gp[1])*a],[Gp[0]+(Pp[0]-Gp[0])*b,Gp[1]+(Pp[1]-Gp[1])*b],accent,r(0.1)));
    disc(Pp,r(0.075),'#475569');disc(Pp,r(0.058),accent);disc([Pp[0]-r(0.018),Pp[1]-r(0.018)],r(0.016),shade(accent,0.5));};
  const boom=()=>{line(Pp,Cp,'#334155',r(0.07));line(Pp,Cp,'#94a3b8',r(0.05));disc(Cp,r(0.06),'#334155');disc(Cp,r(0.045),accent);
    line(Pp,Ep,'#334155',r(0.085));line(Pp,Ep,'#cbd5e1',r(0.063));
    line([Pp[0]+(Ep[0]-Pp[0])*0.2,Pp[1]+(Ep[1]-Pp[1])*0.2],[Pp[0]+(Ep[0]-Pp[0])*0.55,Pp[1]+(Ep[1]-Pp[1])*0.55],accent,r(0.065));};
  const ring=()=>{ctx.strokeStyle='#64748b';ctx.lineWidth=R*0.014;ctx.beginPath();
    for(let t=0;t<=48;t++){const a=t/48*TAU,p=P3(add(add(E,w1,Rr*Math.cos(a)),w2,Rr*Math.sin(a)));t?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();
    for(let k=0;k<12;k+=2){const a=roll+k*TAU/12,p=P3(add(add(E,w1,Rr*Math.cos(a)),w2,Rr*Math.sin(a)));line(Ep,p,'#94a3b8',R*0.012);}
    const seats=[];for(let k=0;k<12;k++){const a=roll+k*TAU/12,rad=add([0,0,0],w1,Math.cos(a)),rad2=add(rad,w2,Math.sin(a)),S=add(E,rad2,Rr),tg=add(add([0,0,0],w1,-Math.sin(a)),w2,Math.cos(a));
      seats.push({k,S,rad:rad2,tg,key:S[0]+S[1]+S[2]*0.9});}
    seats.sort((a,b)=>a.key-b.key).forEach(s=>{const Sp=P3(s.S),wa=P3(add(s.S,s.tg,r(0.11))),wb=P3(add(s.S,s.tg,-r(0.11))),hp=P3(add(s.S,s.rad,r(0.065)));
      line(wa,wb,shade(accent,-0.3),r(0.034));line(wa,wb,s.k%2?'#f8fafc':accent,r(0.024));
      disc(Sp,r(0.045),'#334155');disc(Sp,r(0.034),s.k%2?accent:'#f8fafc');
      disc(hp,r(0.026),'#fde4c8');});
    disc(Ep,r(0.055),'#475569');disc(Ep,r(0.038),accent);};
  const keyE=E[0]+E[1]+E[2]*0.9, keyP=Pv[0]+Pv[1]+Pv[2]*0.9;
  if(keyE<keyP){boom();ring();column();}else{column();boom();ring();}
  // front + right fence with a Land-colored rail
  [[-sx,sy,sx,sy],[sx,-sy,sx,sy]].forEach(([x0,y0,x1,y1])=>{const n=14;for(let k=0;k<=n;k++){const t=k/n,X=x0+(x1-x0)*t,Y=y0+(y1-y0)*t;line(P(X,Y,z0),P(X,Y,z0+r(0.07)),'#475569',R*0.01);}
    line(P(x0,y0,z0+r(0.07)),P(x1,y1,z0+r(0.07)),accent,R*0.014);});
  [[-0.58,0.46],[0.58,0.46]].forEach(([X,Y])=>{const b=P(r(X),r(Y),z0),t=P(r(X),r(Y),r(0.17));line(b,t,'#334155',R*0.014);disc(t,R*0.02,'#fde68a');});
}

/**
 * drawTheater(ctx, cx, cy, R, opts)
 *  opts.accent : Land color (default Generic white) -> hex border, marquee, cornice, ticket-booth roof, poster
 *  opts.t      : time in seconds (chases the marquee bulbs and sweeps the spotlights); omit for a static sprite
 *  opts.flip   : true when called under ctx.scale(-1,1) (keeps shadows on the same screen side)
 *  opts.tile   : draw the hex tile (default true)
 */
function drawTheater(ctx,cx,cy,R,o={}){
  const accent=o.accent||'#f8fafc', fl=o.flip?-1:1, tm=o.t==null?0:o.t;
  const Q=(X,Y,Z)=>[cx+(X-Y)*0.7, cy+(X+Y)*0.35-Z];
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.01;ctx.stroke();}};
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const disc=(p,r,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(p[0],p[1],r,0,7);ctx.fill();};
  const plane=(X,Y,Z,fn)=>{const p=Q(X,Y,Z);ctx.save();ctx.transform(0.7,0.35,0,1,p[0],p[1]);fn();ctx.restore();};
  const box=(xa,xb,ya,yb,za,zb,cf,ce,ct)=>{                         // front (+Y) face, end (+X) face, top
    poly([Q(xa,yb,za),Q(xb,yb,za),Q(xb,yb,zb),Q(xa,yb,zb)],cf);
    poly([Q(xb,ya,za),Q(xb,yb,za),Q(xb,yb,zb),Q(xb,ya,zb)],ce);
    poly([Q(xa,ya,zb),Q(xb,ya,zb),Q(xb,yb,zb),Q(xa,yb,zb)],ct);};
  const x0=-R*0.42,x1=R*0.42,y0=-R*0.26,y1=R*0.26,H=R*0.3,z0=R*0.03, cream='#f3e4c4';
  if(o.tile!==false){hexPath(ctx,cx,cy,R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();}
  poly([Q(-R*0.66,-R*0.52,z0),Q(R*0.66,-R*0.52,z0),Q(R*0.66,R*0.56,z0),Q(-R*0.66,R*0.56,z0)],'#e2e8f0','#94a3b8',R*0.012);
  ctx.save();ctx.translate(fl*R*0.14,R*0.07);
  poly([Q(x0,y0,z0),Q(x1,y0,z0),Q(x1,y1,z0),Q(x0,y1,z0)],'rgba(15,23,42,.22)');ctx.restore();
  // fly tower behind the main hall, then the hall itself
  box(-R*0.3,R*0.3,y0,-R*0.0,z0,R*0.46,cream,'#d6c4a0',shade(accent,-0.2));
  poly([Q(-R*0.3,0,R*0.41),Q(R*0.3,0,R*0.41),Q(R*0.3,0,R*0.46),Q(-R*0.3,0,R*0.46)],accent);
  poly([Q(R*0.3,y0,R*0.41),Q(R*0.3,0,R*0.41),Q(R*0.3,0,R*0.46),Q(R*0.3,y0,R*0.46)],shade(accent,-0.3));
  box(x0,x1,y0,y1,z0,H,cream,'#d6c4a0',shade(accent,-0.2));
  poly([Q(x0+R*0.04,y0+R*0.04,H),Q(x1-R*0.04,y0+R*0.04,H),Q(x1-R*0.04,y1-R*0.04,H),Q(x0+R*0.04,y1-R*0.04,H)],shade(accent,-0.45));
  // cornice, pilasters, arched window
  poly([Q(x0,y1,R*0.265),Q(x1,y1,R*0.265),Q(x1,y1,H),Q(x0,y1,H)],accent);
  poly([Q(x1,y0,R*0.265),Q(x1,y1,R*0.265),Q(x1,y1,H),Q(x1,y0,H)],shade(accent,-0.3));
  [-0.38,-0.21,0.21,0.38].forEach(k=>{const a=R*k-R*0.018,b=R*k+R*0.018;
    poly([Q(a,y1,z0),Q(b,y1,z0),Q(b,y1,R*0.265),Q(a,y1,R*0.265)],'#fff7e6');
    poly([Q(a-R*0.01,y1,R*0.25),Q(b+R*0.01,y1,R*0.25),Q(b+R*0.01,y1,R*0.265),Q(a-R*0.01,y1,R*0.265)],'#fff7e6');});
  plane(0,y1,R*0.245,()=>{ctx.fillStyle=shade(accent,-0.55);ctx.beginPath();ctx.ellipse(0,0,R*0.075,R*0.075,0,Math.PI,0);ctx.lineTo(R*0.075,R*0.06);ctx.lineTo(-R*0.075,R*0.06);ctx.fill();
    ctx.strokeStyle='#fff7e6';ctx.lineWidth=R*0.012;ctx.stroke();ctx.fillStyle='rgba(253,230,138,.55)';ctx.beginPath();ctx.ellipse(0,0,R*0.04,R*0.04,0,Math.PI,0);ctx.fill();});
  // entrance: double doors + poster frames
  poly([Q(-R*0.1,y1,z0),Q(R*0.1,y1,z0),Q(R*0.1,y1,R*0.12),Q(-R*0.1,y1,R*0.12)],'#fff7e6');
  poly([Q(-R*0.085,y1,z0),Q(R*0.085,y1,z0),Q(R*0.085,y1,R*0.11),Q(-R*0.085,y1,R*0.11)],'#3b0a0a');
  line(Q(0,y1,z0),Q(0,y1,R*0.11),'#fde68a',R*0.008);disc(Q(-R*0.015,y1,R*0.055),R*0.007,'#fde68a');disc(Q(R*0.015,y1,R*0.055),R*0.007,'#fde68a');
  [[-0.335,accent,'#fde047'],[0.335,'#fb7185','#38bdf8']].forEach(([k,c1,c2])=>{const a=R*k-R*0.05,b=R*k+R*0.05;
    poly([Q(a-R*0.01,y1,R*0.07),Q(b+R*0.01,y1,R*0.07),Q(b+R*0.01,y1,R*0.185),Q(a-R*0.01,y1,R*0.185)],'#1f2937');
    poly([Q(a,y1,R*0.08),Q(b,y1,R*0.08),Q(b,y1,R*0.175),Q(a,y1,R*0.175)],c1);
    poly([Q(a+R*0.015,y1,R*0.1),Q(b-R*0.015,y1,R*0.1),Q(b-R*0.015,y1,R*0.14),Q(a+R*0.015,y1,R*0.14)],c2);});
  // red carpet + rope stanchions
  poly([Q(-R*0.07,y1,z0),Q(R*0.07,y1,z0),Q(R*0.07,y1+R*0.26,z0),Q(-R*0.07,y1+R*0.26,z0)],'#b91c1c');
  [-1,1].forEach(s=>line(Q(s*R*0.07,y1,z0),Q(s*R*0.07,y1+R*0.26,z0),'#fde68a',R*0.006));
  [-1,1].forEach(s=>{let prev=null;for(let k=0;k<3;k++){const Y=y1+R*(0.07+k*0.085),b=Q(s*R*0.11,Y,z0),t=Q(s*R*0.11,Y,R*0.055);
    line(b,t,'#fde68a',R*0.01);disc(t,R*0.011,'#fde68a');if(prev)line(prev,[t[0],t[1]+R*0.006],'#b91c1c',R*0.007);prev=[t[0],t[1]+R*0.006];}});
  // marquee with chasing bulbs
  const ma=-R*0.19,mb=R*0.19,mz0=R*0.165,mz1=R*0.255,my=y1+R*0.1;
  poly([Q(ma,y1,mz1),Q(mb,y1,mz1),Q(mb,my,mz1),Q(ma,my,mz1)],shade(accent,0.25));
  poly([Q(mb,y1,mz0),Q(mb,my,mz0),Q(mb,my,mz1),Q(mb,y1,mz1)],shade(accent,-0.3));
  poly([Q(ma,my,mz0),Q(mb,my,mz0),Q(mb,my,mz1),Q(ma,my,mz1)],accent,'#fde68a',R*0.012);
  plane(ma,my,mz1,()=>{ctx.fillStyle='#f8fafc';ctx.font='bold '+(R*0.058)+'px Arial Black, Arial, sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('THEATER',(mb-ma)/2,R*0.046);});
  const bulbs=[];for(let k=0;k<=9;k++){const X=ma+(mb-ma)*k/9;bulbs.push(Q(X,my,mz1),Q(X,my,mz0));}
  for(let k=0;k<=4;k++){const Z=mz0+(mz1-mz0)*k/4;bulbs.push(Q(mb,my,Z));bulbs.push(Q(ma,my,Z));}
  bulbs.forEach((p,i)=>disc(p,R*0.009,(Math.floor(tm*5)+i)%2?'#fef08a':'#fb923c'));
  // ticket booth (front-left)
  box(-R*0.54,-R*0.4,R*0.36,R*0.48,z0,R*0.1,'#f1f5f9','#cbd5e1','#94a3b8');
  poly([Q(-R*0.5,R*0.48,R*0.045),Q(-R*0.44,R*0.48,R*0.045),Q(-R*0.44,R*0.48,R*0.085),Q(-R*0.5,R*0.48,R*0.085)],'#7dd3fc','#475569',R*0.008);
  poly([Q(-R*0.57,R*0.33,R*0.1),Q(-R*0.37,R*0.33,R*0.1),Q(-R*0.37,R*0.51,R*0.1),Q(-R*0.57,R*0.51,R*0.1)],accent,shade(accent,-0.3),R*0.008);
  poly([Q(-R*0.57,R*0.51,R*0.1),Q(-R*0.37,R*0.51,R*0.1),Q(-R*0.37,R*0.51,R*0.085),Q(-R*0.57,R*0.51,R*0.085)],shade(accent,-0.25));
  // planters with small trees (front-right)
  [[R*0.5,R*0.4],[R*0.5,R*0.04]].forEach(([X,Y],i)=>{const b=Q(X,Y,z0);
    ctx.fillStyle='rgba(15,23,42,.2)';ctx.beginPath();ctx.ellipse(b[0]+fl*R*0.04,b[1]+R*0.01,R*0.07,R*0.03,0,0,7);ctx.fill();
    box(X-R*0.04,X+R*0.04,Y-R*0.04,Y+R*0.04,z0,R*0.05,'#92400e','#78350f','#a16207');
    ctx.fillStyle='#78350f';ctx.fillRect(b[0]-R*0.008,b[1]-R*0.13,R*0.016,R*0.09);
    [[-0.03,0.15,'#2f7d4f'],[0.03,0.14,'#3f9d5f'],[0,0.19,'#256d44']].forEach(([dx,dy,c])=>{disc([b[0]+dx*R,b[1]-dy*R-R*0.06],R*0.05,c);});});
  // spotlight beams sweeping from the roof corners (soft fade)
  [[-1,0],[1,1]].forEach(([s,k])=>{const b=Q(s*R*0.38,R*0.2,H+R*0.01),sw=Math.sin(tm*0.9+k*2)*R*0.1,
      tx=b[0]-s*R*0.26+sw,ty=b[1]-R*0.55,g=ctx.createLinearGradient(b[0],b[1],tx,ty);
    g.addColorStop(0,'rgba(254,249,195,.42)');g.addColorStop(1,'rgba(254,249,195,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(b[0]-R*0.012,b[1]);ctx.lineTo(b[0]+R*0.012,b[1]);
    ctx.lineTo(tx+R*0.06,ty);ctx.lineTo(tx-R*0.06,ty);ctx.fill();disc(b,R*0.014,'#fef9c3');});
}

/**
 * drawTopSpin(ctx, cx, cy, R, opts)
 *  opts.accent : Land color (default Generic white)
 *  opts.t      : gondola swing angle in radians (0 = hanging straight down, +-PI = inverted)
 *  opts.tile   : draw the hex tile (default true)
 */
function drawTopSpin(ctx,cx,cy,R,opts={}){
  const accent=opts.accent||'#f8fafc', ph=opts.t==null?0.9:opts.t;
  const P=(X,Y,Z)=>[cx+(X-Y)*0.7, cy+(X+Y)*0.35-Z];            // simple oblique projection
  const Zp=R*0.85, L=R*0.46, ax=R*0.5, g=R*0.36, W=R*0.32, leg=R*0.28;
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}};
  if(opts.tile!==false){
    hexPath(ctx,cx,cy,R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();
  }
  // ground slab under the ride
  const sx=R*0.62, sy=R*0.36;
  poly([P(-sx,-sy,R*0.035),P(sx,-sy,R*0.035),P(sx,sy,R*0.035),P(-sx,sy,R*0.035)],'#94a3b8','#64748b',R*0.012);
  // gondola geometry
  const sp=Math.sin(ph), cp=Math.cos(ph);
  const C=[0,L*sp,Zp-L*cp], u=[0,-sp,cp], w=[0,cp,sp];
  ctx.fillStyle='rgba(15,23,42,.22)';ctx.beginPath();                  // gondola ground shadow
  const gs=P(0,C[1],R*0.035);ctx.ellipse(gs[0],gs[1],R*0.24,R*0.1,0,0,7);ctx.fill();

  function pylon(X0){
    const top=P(X0,0,Zp), f0=P(X0,-leg,R*0.035), f1=P(X0,leg,R*0.035);
    [f0,f1].forEach(f=>{
      line(f,top,'#64748b',R*0.05);
      line([f[0]-R*0.012,f[1]],[top[0]-R*0.012,top[1]],'#94a3b8',R*0.016);
      line(lerp(f,top,0.62),lerp(f,top,0.88),accent,R*0.054);          // accent stripe near the top
    });
    line(lerp(f0,top,0.3),lerp(f1,top,0.3),'#64748b',R*0.03);          // cross brace
    ctx.fillStyle=accent;ctx.beginPath();ctx.arc(top[0],top[1],R*0.065,0,7);ctx.fill();   // hub cap
    ctx.fillStyle=shade(accent,0.45);ctx.beginPath();ctx.arc(top[0]-R*0.02,top[1]-R*0.02,R*0.02,0,7);ctx.fill();
  }
  pylon(-ax);                                                          // far pylon
  line(P(-ax,0,Zp),P(ax,0,Zp),'#94a3b8',R*0.045);                      // axle
  const arm=X=>line(P(X,0,Zp),P(X,C[1],C[2]),'#94a3b8',R*0.042);
  arm(-g);                                                             // far arm
  // deck: slab thickness, then top face with accent edge
  const dk=(k,off)=>[[-g-R*0.03,-1],[g+R*0.03,-1],[g+R*0.03,1],[-g-R*0.03,1]].map(([X,s])=>
    P(X,C[1]+w[1]*s*W/2-u[1]*off,C[2]+w[2]*s*W/2-u[2]*off));
  poly(dk(0,R*0.035),'#334155');
  poly(dk(0,0),'#475569',accent,R*0.026);
  // riders: two back-to-back rows of four, heads toward the axle
  const rc=['#ef4444','#facc15','#22c55e','#3b82f6','#f97316','#e2e8f0','#a855f7','#fde047'], rs=[];
  [-1,1].forEach((s,i)=>[-0.27,-0.09,0.09,0.27].forEach((k,j)=>{
    const X=k*R*1.0, Y=C[1]+w[1]*s*W*0.28, Z=C[2]+w[2]*s*W*0.28;
    rs.push({X,Y,Z,key:X+Y,c:rc[i*4+j]});}));
  rs.sort((a,b)=>a.key-b.key).forEach(r=>{
    const at=h=>P(r.X,r.Y+u[1]*h,r.Z+u[2]*h);
    line(at(0),at(R*0.035),accent,R*0.075);                            // seat
    line(at(R*0.035),at(R*0.11),r.c,R*0.058);                           // torso
    const h=at(R*0.14);ctx.fillStyle='#fde4c8';ctx.beginPath();ctx.arc(h[0],h[1],R*0.033,0,7);ctx.fill();
  });
  arm(g);                                                              // near arm
  pylon(ax);                                                           // near pylon
}

/**
 * drawTrainStation(ctx, cx, cy, R, opts)
 *  opts.accent : Land color of the hex the station sits in (default Generic white) -> hex border, roof, fascia, shelter
 *  opts.train  : #hex color of the train waiting at the platform (its home Land); omit for an empty platform
 *  opts.flip   : true when called under ctx.scale(-1,1) (keeps shadows on the same screen side)
 *  opts.tile   : draw the hex tile (default true)
 */
function drawTrainStation(ctx,cx,cy,R,o={}){
  const accent=o.accent||'#f8fafc', tc=o.train||null, fl=o.flip?-1:1;
  const Q=(X,Y,Z)=>[cx+(X-Y)*0.7, cy+(X+Y)*0.35-Z];
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.008;ctx.stroke();}};
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const disc=(p,r,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(p[0],p[1],r,0,7);ctx.fill();};
  const plane=(X,Y,Z,fn)=>{const p=Q(X,Y,Z);ctx.save();ctx.transform(0.7,0.35,0,1,p[0],p[1]);fn();ctx.restore();};
  const box=(xa,xb,ya,yb,za,zb,cf,ce,ct)=>{
    poly([Q(xa,yb,za),Q(xb,yb,za),Q(xb,yb,zb),Q(xa,yb,zb)],cf);
    poly([Q(xb,ya,za),Q(xb,yb,za),Q(xb,yb,zb),Q(xb,ya,zb)],ce);
    poly([Q(xa,ya,zb),Q(xb,ya,zb),Q(xb,yb,zb),Q(xa,yb,zb)],ct);};
  const z0=R*0.03, cream='#f3e4c4', r=v=>R*v;
  if(o.tile!==false){hexPath(ctx,cx,cy,R);ctx.fillStyle='#cbd5e1';ctx.fill();
    ctx.lineWidth=Math.max(2,R*0.06);ctx.strokeStyle=accent;ctx.stroke();}
  poly([Q(r(-0.6),r(-0.52),z0),Q(r(0.6),r(-0.52),z0),Q(r(0.6),r(0.3),z0),Q(r(-0.6),r(0.3),z0)],'#e2e8f0','#94a3b8',R*0.012);
  const tree=(X,Y,h)=>{const b=Q(X,Y,z0);ctx.fillStyle='rgba(15,23,42,.2)';ctx.beginPath();ctx.ellipse(b[0]+fl*h*0.2,b[1]+h*0.03,h*0.3,h*0.11,0,0,7);ctx.fill();
    ctx.fillStyle='#78350f';ctx.fillRect(b[0]-h*0.04,b[1]-h*0.3,h*0.08,h*0.3);
    [[-0.12,0.55,0.26,-0.25],[0.13,0.52,0.25,-0.1],[0,0.8,0.27,0.1]].forEach(([dx,y,rr,s])=>disc([b[0]+dx*h,b[1]-y*h],rr*h,shade('#2f7d4f',s)));};
  tree(r(-0.5),r(-0.5),r(0.26));tree(r(0.42),r(-0.5),r(0.22));
  // depot: pitched roof, clock cupola, fascia lettering
  const bx0=r(-0.4),bx1=r(0.3),by0=r(-0.46),by1=r(-0.24),H=r(0.18);
  ctx.save();ctx.translate(fl*r(0.1),r(0.05));poly([Q(bx0,by0,z0),Q(bx1,by0,z0),Q(bx1,by1,z0),Q(bx0,by1,z0)],'rgba(15,23,42,.2)');ctx.restore();
  box(bx0,bx1,by0,by1,z0,H,cream,'#d6c4a0',shade(accent,-0.3));
  poly([Q(bx0,by1,r(0.125)),Q(bx1,by1,r(0.125)),Q(bx1,by1,H),Q(bx0,by1,H)],accent);
  poly([Q(bx1,by0,r(0.125)),Q(bx1,by1,r(0.125)),Q(bx1,by1,H),Q(bx1,by0,H)],shade(accent,-0.3));
  plane(bx0,by1,H,()=>{ctx.fillStyle='#f8fafc';ctx.font='bold '+r(0.04)+'px Arial, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('STATION',(bx1-bx0)/2,r(0.028));});
  poly([Q(r(-0.06),by1,z0),Q(r(0.06),by1,z0),Q(r(0.06),by1,r(0.11)),Q(r(-0.06),by1,r(0.11))],'#3b2214','#fff7e6',R*0.01);
  [[-0.34,-0.16],[0.14,0.26]].forEach(([a,b])=>poly([Q(r(a),by1,r(0.04)),Q(r(b),by1,r(0.04)),Q(r(b),by1,r(0.105)),Q(r(a),by1,r(0.105))],'#7dd3fc','#475569'));
  const ov=r(0.03),rh=r(0.1),ridge=(by0+by1)/2;
  poly([Q(bx1,by0,H),Q(bx1,by1,H),Q(bx1,ridge,H+rh)],'#d6c4a0');
  poly([Q(bx0-ov,by1+ov,H-r(0.01)),Q(bx1+ov,by1+ov,H-r(0.01)),Q(bx1+ov,ridge,H+rh),Q(bx0-ov,ridge,H+rh)],accent);
  line(Q(bx0-ov,by1+ov,H-r(0.01)),Q(bx1+ov,by1+ov,H-r(0.01)),shade(accent,-0.4),R*0.014);
  line(Q(bx0-ov,ridge,H+rh),Q(bx1+ov,ridge,H+rh),shade(accent,0.45),R*0.014);
  box(r(-0.12),r(-0.02),ridge-r(0.045),ridge+r(0.045),H+rh-r(0.02),H+rh+r(0.07),cream,'#d6c4a0',accent);   // clock cupola
  plane(r(-0.12),ridge+r(0.045),H+rh+r(0.065),()=>{const cxl=r(0.05);ctx.fillStyle='#f8fafc';ctx.beginPath();ctx.ellipse(cxl,r(0.035),r(0.028),r(0.028),0,0,7);ctx.fill();
    ctx.strokeStyle='#1f2937';ctx.lineWidth=R*0.006;ctx.beginPath();ctx.moveTo(cxl,r(0.035));ctx.lineTo(cxl,r(0.016));ctx.moveTo(cxl,r(0.035));ctx.lineTo(cxl+r(0.014),r(0.04));ctx.stroke();});
  // platform (between the depot and the track) with safety stripe, lamps, bench
  const py0=r(-0.24),py1=r(0.0),pz=r(0.05);
  poly([Q(r(-0.5),py1,z0),Q(r(0.5),py1,z0),Q(r(0.5),py1,pz),Q(r(-0.5),py1,pz)],'#94a3b8');
  poly([Q(r(0.5),py0,z0),Q(r(0.5),py1,z0),Q(r(0.5),py1,pz),Q(r(0.5),py0,pz)],'#64748b');
  poly([Q(r(-0.5),py0,pz),Q(r(0.5),py0,pz),Q(r(0.5),py1,pz),Q(r(-0.5),py1,pz)],'#e2e8f0');
  poly([Q(r(-0.5),py1-r(0.025),pz),Q(r(0.5),py1-r(0.025),pz),Q(r(0.5),py1,pz),Q(r(-0.5),py1,pz)],accent);
  [-0.4,0.4].forEach(X=>{const b=Q(r(X),r(-0.04),pz),t=Q(r(X),r(-0.04),pz+r(0.15));line(b,t,'#334155',R*0.014);disc(t,R*0.02,'#fde68a');});
  { const bz=pz+r(0.035); poly([Q(r(-0.22),r(-0.1),bz),Q(r(-0.04),r(-0.1),bz),Q(r(-0.04),r(-0.06),bz),Q(r(-0.22),r(-0.06),bz)],'#92400e','#78350f');
    poly([Q(r(-0.22),r(-0.1),bz),Q(r(-0.04),r(-0.1),bz),Q(r(-0.04),r(-0.1),bz+r(0.04)),Q(r(-0.22),r(-0.1),bz+r(0.04))],'#78350f');
    [-0.21,-0.05].forEach(X=>line(Q(r(X),r(-0.06),pz),Q(r(X),r(-0.06),bz),'#334155',R*0.01)); }
  // small shelter at the end of the platform
  [[0.34,-0.2],[0.34,-0.02],[0.5,-0.2],[0.5,-0.02]].forEach(([X,Y])=>line(Q(r(X),r(Y),pz),Q(r(X),r(Y),r(0.18)),'#94a3b8',R*0.012));
  poly([Q(r(0.32),r(-0.22),r(0.18)),Q(r(0.52),r(-0.22),r(0.18)),Q(r(0.52),r(0.0),r(0.18)),Q(r(0.32),r(0.0),r(0.18))],accent,shade(accent,-0.3));
  // track: ballast, sleepers, rails
  poly([Q(r(-0.74),r(0.02),z0),Q(r(0.74),r(0.02),z0),Q(r(0.74),r(0.2),z0),Q(r(-0.74),r(0.2),z0)],'#a3a3a3');
  for(let X=-0.7;X<=0.71;X+=0.06)line(Q(r(X),r(0.035),z0),Q(r(X),r(0.185),z0),'#78350f',R*0.016);
  [0.07,0.15].forEach(Y=>{line(Q(r(-0.74),r(Y),z0+r(0.012)),Q(r(0.74),r(Y),z0+r(0.012)),'#475569',R*0.016);
    line(Q(r(-0.74),r(Y),z0+r(0.02)),Q(r(0.74),r(Y),z0+r(0.02)),'#e2e8f0',R*0.007);});
  // the train: two coaches and a little steam engine, in its home color
  if(tc){
    const ya=r(0.04),yb=r(0.18),za=z0+r(0.02),zb=za+r(0.12);
    const coach=(xa,xb)=>{box(xa,xb,ya,yb,za,zb,tc,shade(tc,-0.3),shade(tc,0.3));
      const n=4;for(let k=0;k<n;k++){const a=xa+(xb-xa)*(k+0.2)/n,b=xa+(xb-xa)*(k+0.8)/n;
        poly([Q(a,yb,za+r(0.05)),Q(b,yb,za+r(0.05)),Q(b,yb,za+r(0.105)),Q(a,yb,za+r(0.105))],'#bae6fd','#1f2937',R*0.006);}
      poly([Q(xa,yb,za+r(0.012)),Q(xb,yb,za+r(0.012)),Q(xb,yb,za+r(0.03)),Q(xa,yb,za+r(0.03))],'#1f2937');
      [0.22,0.78].forEach(f=>disc(Q(xa+(xb-xa)*f,yb,za),r(0.014),'#0f172a'));};
    coach(r(-0.62),r(-0.2));coach(r(-0.18),r(0.24));
    // engine: boiler, cab, stack, headlamp
    const ex0=r(0.26),ex1=r(0.62);
    box(ex0+r(0.12),ex1,r(0.07),r(0.15),za+r(0.01),za+r(0.085),'#1f2937','#111827','#374151');
    poly([Q(ex0+r(0.12),r(0.15),za+r(0.04)),Q(ex1,r(0.15),za+r(0.04)),Q(ex1,r(0.15),za+r(0.055)),Q(ex0+r(0.12),r(0.15),za+r(0.055))],tc);
    box(ex0,ex0+r(0.14),ya,yb,za,za+r(0.14),tc,shade(tc,-0.3),shade(tc,-0.15));
    poly([Q(ex0+r(0.02),yb,za+r(0.07),),Q(ex0+r(0.12),yb,za+r(0.07)),Q(ex0+r(0.12),yb,za+r(0.12)),Q(ex0+r(0.02),yb,za+r(0.12))],'#bae6fd','#1f2937',R*0.006);
    const sk=Q(ex1-r(0.07),r(0.11),za+r(0.085));line(sk,[sk[0],sk[1]-r(0.06)],'#111827',R*0.03);
    poly([[sk[0]-r(0.025),sk[1]-r(0.06)],[sk[0]+r(0.025),sk[1]-r(0.06)],[sk[0]+r(0.015),sk[1]-r(0.045)],[sk[0]-r(0.015),sk[1]-r(0.045)]],'#374151');
    disc(Q(ex1,r(0.11),za+r(0.05)),R*0.012,'#fde68a');
    [0.18,0.34,0.52,0.7].forEach(f=>disc(Q(ex0+(ex1-ex0)*f,yb-r(0.03),za),r(0.016),'#0f172a'));
    line(Q(r(-0.2),r(0.11),za+r(0.02)),Q(r(-0.18),r(0.11),za+r(0.02)),'#1f2937',R*0.01);
    ctx.fillStyle='rgba(226,232,240,.8)';[[0,0],[0.03,-0.03],[0.07,-0.06]].forEach(([dx,dy],i)=>{ctx.beginPath();ctx.arc(sk[0]+r(dx),sk[1]-r(0.07+dy*0)-r(0.03*i),r(0.025+0.008*i),0,7);ctx.fill();});
  }
}
