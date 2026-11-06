/* Procedural live sprites for Antique Cars and Demolition Derby. */
const REGIONAL_FLAT_RIDE_SPRITES = (() => {
/* ===== FLAT RIDES: Demolition Derby (Zamperla Crazy-Daisy style) + Antique Cars =====
 * One hex each. Transparent background (draw your own tile/theme ground), fits inside the centre keep-out ellipse.
 * Cheap by design: the platform/road/station are baked once to offscreen canvases; only the cars are drawn live.
 *   drawDemolitionDerby(ctx, cx, cy, R, {accent, t, tile})
 *   drawAntiqueCars(ctx, cx, cy, R, {accent, t, tile})
 *   t = seconds. Omit t for a fully baked still pose (a single drawImage).  tile:true draws a plain hex under the ride.
 */
function shade(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=c=>Math.round(amt<0?c*(1+amt):c+(255-c)*amt);return `rgb(${f(r)},${f(g)},${f(b)})`;}
const FR={
  proj(cx,cy,S){return(X,Y,Z)=>[cx+(X-Y)*0.7*S,cy+(X+Y)*0.35*S-Z*S];},
  poly(g,pts,fill,stroke,lw){g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();if(fill){g.fillStyle=fill;g.fill();g.strokeStyle=fill;g.lineWidth=0.6;g.stroke();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();}},
  ell(g,x,y,rx,ry,fill){g.fillStyle=fill;g.beginPath();g.ellipse(x,y,rx,ry,0,0,7);g.fill();},
  ln(g,a,b,col,w){g.strokeStyle=col;g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();},
  /* box rotated by psi about the vertical axis; draws only the faces that face the camera */
  rbox(g,Pj,x0,y0,z0,l,w,h,psi,col,o){o=o||{};const c=Math.cos(psi),s=Math.sin(psi),pts=[[-l/2,-w/2],[l/2,-w/2],[l/2,w/2],[-l/2,w/2]].map(([a,b])=>[x0+a*c-b*s,y0+a*s+b*c]),faces=[];
    for(let i=0;i<4;i++){const A=pts[i],B=pts[(i+1)%4],dx=B[0]-A[0],dy=B[1]-A[1],m=Math.hypot(dx,dy),nx=dy/m,ny=-dx/m;if(nx+ny>0.02)faces.push({A,B,nx,ny,d:(A[0]+B[0]+A[1]+B[1])/2});}
    faces.sort((p,q)=>p.d-q.d).forEach(f=>{const amt=Math.max(-0.5,Math.min(0.3,-0.12+0.14*f.ny-0.22*f.nx));FR.poly(g,[Pj(f.A[0],f.A[1],z0),Pj(f.B[0],f.B[1],z0),Pj(f.B[0],f.B[1],z0+h),Pj(f.A[0],f.A[1],z0+h)],shade(col,amt));});
    if(!o.noTop)FR.poly(g,pts.map(p=>Pj(p[0],p[1],z0+h)),o.top||shade(col,0.16));},
  hex(g,cx,cy,R,fill,stroke){g.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);g[i?'lineTo':'moveTo'](cx+R*Math.cos(a),cy+R*Math.sin(a)*0.58);}g.closePath();g.fillStyle=fill;g.fill();g.lineWidth=Math.max(1.5,R*0.03);g.strokeStyle=stroke;g.stroke();},
  /* bake each layer once per (ride, size, accent); draw(g,Pj,S,part,t) is the ride's own drawer */
  layers(key,R,Wf,Hf,oyf,draw){FR._c=FR._c||{};if(FR._c[key])return FR._c[key];const sc=Math.max(1,Math.min(2,(typeof devicePixelRatio==='number'?devicePixelRatio:1))),W=Math.ceil(Wf*R),H=Math.ceil(Hf*R),oy=oyf*R,S=R*0.066,res={w:W,h:H,ox:W/2,oy};
    ['back','hub','front','still'].forEach(p=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);const Pj=FR.proj(W/2,oy,S);
      if(p==='still'){draw(g,Pj,S,'back');draw(g,Pj,S,'cars_back',0);draw(g,Pj,S,'hub');draw(g,Pj,S,'cars_front',0);draw(g,Pj,S,'front');}else draw(g,Pj,S,p);res[p]=cv;});return FR._c[key]=res;},
  render(ctx,cx,cy,R,key,Wf,Hf,oyf,draw,t){const L=FR.layers(key,R,Wf,Hf,oyf,draw);if(t==null){ctx.drawImage(L.still,cx-L.ox,cy-L.oy,L.w,L.h);return;}
    const S=R*0.066,Pj=FR.proj(cx,cy,S),bl=n=>ctx.drawImage(L[n],cx-L.ox,cy-L.oy,L.w,L.h);bl('back');draw(ctx,Pj,S,'cars_back',t);bl('hub');draw(ctx,Pj,S,'cars_front',t);bl('front');}
};
/* car atlas: each (colour, heading) pose is drawn once, lazily; per frame a car is a single drawImage */
FR.atlas=function(S,w,h,ox,oy,n,fn){const sc=Math.max(1,Math.min(2,(typeof devicePixelRatio==='number'?devicePixelRatio:1))),cache={};return function(i,psi){const k=Math.round((((psi%6.2832)+6.2832)%6.2832)/6.2832*n)%n,key=i*1000+k;let e=cache[key];if(!e){const cv=document.createElement('canvas');cv.width=Math.ceil(w*sc);cv.height=Math.ceil(h*sc);const g=cv.getContext('2d');g.scale(sc,sc);fn(g,FR.proj(ox,oy,S),i,k/n*6.2832);e=cache[key]={cv,w,h,ox,oy};}return e;};};
FR._d={};
/* ---------------- Demolition Derby ---------------- */
const DD={rP:7.0,rIn:2.8,rOut:6.3,H:0.9,rc:4.55,N:6};
const ddH=phi=>DD.H*(0.5+0.5*Math.cos(3*phi));
function ddCar(g,Pj,S,X,Y,Z,psi,body,shirt1,shirt2){const c=Math.cos(psi),s=Math.sin(psi),L=(a,b)=>[X+a*c-b*s,Y+a*s+b*c];
  const part=(a,b,z,l,w,h,col,o)=>{const p=L(a,b);FR.rbox(g,Pj,p[0],p[1],Z+z,l,w,h,psi,col,o);};
  part(0,0,0.1,2.5,1.4,0.2,'#2a2a32');part(0,0,0.28,2.2,1.15,0.5,body);part(0.85,0,0.78,0.7,1.0,0.1,shade(body,-0.12));part(0.3,0,0.78,0.08,1.0,0.5,'#bfe3f2',{top:'#dff3fb'});part(-0.95,0,0.78,0.2,1.0,0.55,shade(body,-0.28));
  [[0.55,-0.55],[0.55,0.55]].forEach(([a,b])=>{const p=L(1.1,b*0.8),q=Pj(p[0],p[1],Z+0.62);FR.ell(g,q[0],q[1],S*0.1,S*0.08,'#fff3b0');});
  [[-0.3,-0.27,shirt1],[-0.3,0.27,shirt2]].forEach(([a,b,col])=>{const p=L(a,b),q=Pj(p[0],p[1],Z+1.1);FR.ell(g,q[0],q[1],S*0.2,S*0.24,col);const h=Pj(p[0],p[1],Z+1.55);FR.ell(g,h[0],h[1],S*0.17,S*0.17,'#e8b890');});
  const pp=L(-1.0,0),b0=Pj(pp[0],pp[1],Z+0.8),b1=Pj(pp[0],pp[1],Z+2.5);FR.ln(g,b0,b1,'#d5dae6',S*0.05);FR.poly(g,[b1,[b1[0]+S*0.5,b1[1]+S*0.12],[b1[0],b1[1]+S*0.3]],shade(body,0.1));}
function ddDrawer(A){const A2=shade(A,-0.32),cols=[A,'#2fb5a8','#f2c230','#d9467a','#7b4bb7','#f08a22'],shirts=['#3b82f6','#ef4444','#22c55e','#f59e0b','#a855f7','#e2e8f0'],ats={};
  return function(g,Pj,S,part,t){const at=ats[S]||(ats[S]=FR.atlas(S,4.6*S,5.6*S,2.3*S,4.4*S,48,(g2,P2,i,psi)=>ddCar(g2,P2,S,0,0,0,psi,cols[i%6],shirts[i%6],shirts[(i+2)%6])));const ring=(r,z,n)=>{n=n||64;return Array.from({length:n},(_,k)=>Pj(r*Math.cos(k/n*6.2832),r*Math.sin(k/n*6.2832),z));};
    if(part==='back'){const c0=Pj(0,0,0);g.fillStyle='rgba(20,25,30,.28)';g.beginPath();g.ellipse(c0[0]+S*0.4,c0[1]+S*0.3,7.9*0.99*S,7.9*0.495*S,0,0,7);g.fill();
      for(let k=0;k<64;k++){const a0=k/64*6.2832,a1=(k+1)/64*6.2832;if(Math.cos((a0+a1)/2)+Math.sin((a0+a1)/2)>0)FR.poly(g,[Pj(7*Math.cos(a0),7*Math.sin(a0),0.5),Pj(7*Math.cos(a1),7*Math.sin(a1),0.5),Pj(7*Math.cos(a1),7*Math.sin(a1),0),Pj(7*Math.cos(a0),7*Math.sin(a0),0)],'#2f3340');}
      FR.poly(g,ring(7.0,0.5),A);FR.poly(g,ring(6.55,0.5),'#4f5463');
      const N=96,secs=[];for(let k=0;k<N;k++){const a0=k/N*6.2832,a1=(k+1)/N*6.2832,m=(a0+a1)/2;secs.push({a0,a1,m,d:Math.cos(m)+Math.sin(m)});}secs.sort((p,q)=>p.d-q.d).forEach(sc=>{const h0=0.5+ddH(sc.a0),h1=0.5+ddH(sc.a1),ri=DD.rIn,ro=DD.rOut,c0=Math.cos(sc.a0),s0=Math.sin(sc.a0),c1=Math.cos(sc.a1),s1=Math.sin(sc.a1);
        if(sc.d>0)FR.poly(g,[Pj(ro*c0,ro*s0,h0),Pj(ro*c1,ro*s1,h1),Pj(ro*c1,ro*s1,0.5),Pj(ro*c0,ro*s0,0.5)],'#555b6c');else FR.poly(g,[Pj(ri*c0,ri*s0,h0),Pj(ri*c1,ri*s1,h1),Pj(ri*c1,ri*s1,0.5),Pj(ri*c0,ri*s0,0.5)],'#6a7084');
        const amt=Math.max(-0.22,Math.min(0.22,(h1-h0)*(Math.cos(sc.m)-Math.sin(sc.m))*-6));FR.poly(g,[Pj(ri*c0,ri*s0,h0),Pj(ro*c0,ro*s0,h0),Pj(ro*c1,ro*s1,h1),Pj(ri*c1,ri*s1,h1)],shade('#9298a9',amt));});
      [[DD.rOut-0.12,A],[DD.rIn+0.12,'#f6efe0']].forEach(([r,col])=>{g.beginPath();for(let k=0;k<=96;k++){const a=k/96*6.2832,p=Pj(r*Math.cos(a),r*Math.sin(a),0.5+ddH(a)+0.02);k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);}g.strokeStyle=col;g.lineWidth=S*0.14;g.stroke();});
      for(let k=0;k<32;k++){const a=k/32*6.2832;if(Math.cos(a)+Math.sin(a)>=0||Math.abs(a-0.785)<0.25)continue;ddTire(g,Pj,S,a,A);}}
    if(part==='front'){for(let k=0;k<32;k++){const a=k/32*6.2832;if(Math.cos(a)+Math.sin(a)<0||Math.abs(((a-0.785+9.42)%6.2832)-3.14159)<0.0&&false)continue;if(Math.abs(Math.atan2(Math.sin(a-0.785),Math.cos(a-0.785)))<0.26)continue;ddTire(g,Pj,S,a,A);}}
    if(part==='hub'){const z0=0.5,z1=2.7,r=2.1,N=18;for(let k=0;k<N;k++){const a0=-0.785+k/N*3.1416,a1=-0.785+(k+1)/N*3.1416,m=(a0+a1)/2;FR.poly(g,[Pj(r*Math.cos(a0),r*Math.sin(a0),z0),Pj(r*Math.cos(a1),r*Math.sin(a1),z0),Pj(r*Math.cos(a1),r*Math.sin(a1),z1),Pj(r*Math.cos(a0),r*Math.sin(a0),z1)],shade(k%2?'#f6efe0':A,-(Math.cos(m)-Math.sin(m))*0.2+0.02));}
      FR.poly(g,ring(r,z1),'#3a3f4e');FR.poly(g,ring(r*0.7,z1),A2);
      const top=Pj(0,0,z1);FR.ell(g,top[0],top[1],S*0.35,S*0.17,'#aeb4c4');const mt=Pj(0,0,7.4);FR.ln(g,top,mt,'#d5dae6',S*0.2);
      const bd=(X,Z)=>Pj(X,0.0,Z);FR.poly(g,[bd(-2.5,5.1),bd(2.5,5.1),bd(2.5,6.9),bd(-2.5,6.9)],'#17171f',A,S*0.16);const o=bd(-2.5,6.9);g.save();g.transform(0.7,0.35,0,1,o[0],o[1]);g.fillStyle='#f6d34a';g.font='bold '+(1.8*S*0.62)+'px Arial Black, Arial, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('DERBY',5.0*S/2,1.8*S/2,5.0*S*0.9);g.restore();
      for(let k=0;k<3;k++)for(let j=0;j<2;j++)FR.poly(g,[[mt[0]+k*S*0.22,mt[1]-S*0.9+j*S*0.22],[mt[0]+(k+1)*S*0.22,mt[1]-S*0.9+j*S*0.22],[mt[0]+(k+1)*S*0.22,mt[1]-S*0.9+(j+1)*S*0.22],[mt[0]+k*S*0.22,mt[1]-S*0.9+(j+1)*S*0.22]],(k+j)%2?'#f6efe0':'#14141a');FR.ln(g,[mt[0],mt[1]],[mt[0],mt[1]-S*1.0],'#d5dae6',S*0.07);
      const pc=['#f2c230','#d9467a','#2fb5a8','#f6efe0','#f08a22','#7b4bb7'];[3.45,3.93,4.4].forEach((a,i)=>{const e=Pj(6.7*Math.cos(a),6.7*Math.sin(a),0.9);for(let k=0;k<=9;k++){const q=k/9,x=mt[0]+(e[0]-mt[0])*q,y=mt[1]+(e[1]-mt[1])*q+Math.sin(q*Math.PI)*S*0.9;if(k){FR.ln(g,[x0,y0],[x,y],'#e6e0cc',S*0.04);}var x0=x,y0=y;if(k>0&&k<9)FR.poly(g,[[x-S*0.14,y],[x+S*0.14,y],[x,y+S*0.4]],pc[(k+i)%6]);}});}
    if(part==='cars_back'||part==='cars_front'){const cars=[];for(let i=0;i<DD.N;i++){const phi=i*6.2832/DD.N+0.5*t,X=DD.rc*Math.cos(phi),Y=DD.rc*Math.sin(phi);cars.push({i,phi,X,Y,d:X+Y});}
      cars.filter(c=>part==='cars_back'?c.d<0:c.d>=0).sort((p,q)=>p.d-q.d).forEach(c=>{const z=0.5+ddH(c.phi)+0.05,sp=c.i*1.1+1.9*t,P0=Pj(c.X,c.Y,z);g.fillStyle='rgba(15,20,25,.3)';g.beginPath();g.ellipse(P0[0]+S*0.15,P0[1]+S*0.12,1.9*0.99*S,1.9*0.495*S,0,0,7);g.fill();
        {const T=Pj(c.X,c.Y,z+0.12);FR.ell(g,T[0],T[1]+S*0.1,1.75*0.99*S,1.75*0.495*S,'#2a2f3d');FR.ell(g,T[0],T[1],1.75*0.99*S,1.75*0.495*S,'#3a4052');FR.ell(g,T[0],T[1]-S*0.02,1.62*0.99*S,1.62*0.495*S,'#c5cad6');}
        for(let k=0;k<4;k++){const a=-sp*1.6+k*1.5708;FR.ln(g,Pj(c.X,c.Y,z+0.16),Pj(c.X+1.5*Math.cos(a),c.Y+1.5*Math.sin(a),z+0.16),k%2?'#8a90a2':A,S*0.12);}
        {const e=at(c.i,sp),q=Pj(c.X,c.Y,z+0.14);g.drawImage(e.cv,q[0]-e.ox,q[1]-e.oy,e.w,e.h);}});}
  };}
function ddTire(g,Pj,S,a,A){const x=7.45*Math.cos(a),y=7.45*Math.sin(a);[[0.12,'#23232b'],[0.46,Math.round(a*5)%2?A:'#f6efe0']].forEach(([z,col],lv)=>{const p=Pj(x,y,z+0.22);g.fillStyle='#14141a';g.beginPath();g.ellipse(p[0],p[1]+S*0.12,0.46*0.99*S,0.46*0.495*S,0,0,7);g.fill();FR.ell(g,p[0],p[1],0.46*0.99*S,0.46*0.495*S,lv?col:'#23232b');FR.ell(g,p[0],p[1],0.22*0.99*S,0.22*0.495*S,'#0e0e12');});}
/* ---------------- Antique Cars ---------------- */
const AC={A:5.8,B:5.0,w:1.15,N:5};
const acPos=(A,B,s)=>[(A*Math.cos(s)+B*Math.sin(s))/Math.SQRT2,(-A*Math.cos(s)+B*Math.sin(s))/Math.SQRT2];
function acCar(g,Pj,S,X,Y,psi,body,hat){const c=Math.cos(psi),s=Math.sin(psi),L=(a,b)=>[X+a*c-b*s,Y+a*s+b*c],Z=0.12;
  const part=(a,b,z,l,w,h,col,o)=>{const p=L(a,b);FR.rbox(g,Pj,p[0],p[1],Z+z,l,w,h,psi,col,o);};
  const wheel=(a,b)=>{const p=L(a,b),q=Pj(p[0],p[1],Z+0.36),hx=c,hy=s,dx=(hx-hy)*0.7*S,dy=(hx+hy)*0.35*S,r=0.36;g.beginPath();for(let k=0;k<=10;k++){const th=k/10*6.2832;const px=q[0]+r*(Math.cos(th)*dx*1.0),py=q[1]+r*(Math.cos(th)*dy-Math.sin(th)*S);k?g.lineTo(px,py):g.moveTo(px,py);}g.closePath();g.fillStyle='#16161b';g.fill();
    g.beginPath();for(let k=0;k<=10;k++){const th=k/10*6.2832;const px=q[0]+r*0.62*(Math.cos(th)*dx),py=q[1]+r*0.62*(Math.cos(th)*dy-Math.sin(th)*S);k?g.lineTo(px,py):g.moveTo(px,py);}g.closePath();g.fillStyle='#e3d6b4';g.fill();FR.ell(g,q[0],q[1],S*0.06,S*0.06,'#9a7a2a');};
  const ws=[[0.95,-0.72],[0.95,0.72],[-0.95,-0.72],[-0.95,0.72]].map(([a,b])=>({a,b,d:L(a,b)[0]+L(a,b)[1]})).sort((p,q)=>p.d-q.d),cd=X+Y;
  ws.filter(w=>w.d<cd).forEach(w=>wheel(w.a,w.b));
  part(0,0,0.3,2.55,1.5,0.1,'#22222a');part(-0.35,0,0.4,1.2,1.0,0.6,body);part(0.3,0,0.4,0.28,1.02,0.45,body);part(0.95,0,0.42,0.95,0.58,0.5,body);part(1.46,0,0.45,0.1,0.56,0.46,'#d9a63a');part(0.28,0,1.0,0.07,0.96,0.5,'#cfe8f2',{top:'#e8f6fb'});part(-1.0,0,0.95,0.3,0.96,0.5,shade(body,-0.3));part(-1.05,0,1.42,0.55,0.96,0.2,'#352a22');
  [[0.95,-0.5],[0.95,0.5],[-0.95,-0.5],[-0.95,0.5]].forEach(([a,b])=>part(a,b*1.12,0.72,0.7,0.2,0.08,'#1b1b22'));
  [[1.4,-0.5],[1.4,0.5]].forEach(([a,b])=>{const p=L(a,b),q=Pj(p[0],p[1],Z+0.85);FR.ell(g,q[0],q[1],S*0.12,S*0.12,'#ffe9a0');});
  [[-0.35,-0.26,'#8b3a2e'],[-0.35,0.26,'#2e4a8b']].forEach(([a,b,col],i)=>{const p=L(a,b),q=Pj(p[0],p[1],Z+1.1),h=Pj(p[0],p[1],Z+1.6);FR.ell(g,q[0],q[1],S*0.2,S*0.24,col);FR.ell(g,h[0],h[1],S*0.16,S*0.16,'#e8b890');FR.ell(g,h[0],h[1]-S*0.1,S*(i?0.2:0.22),S*0.08,hat);FR.ell(g,h[0],h[1]-S*0.13,S*0.13,S*0.1,hat);});
  ws.filter(w=>w.d>=cd).forEach(w=>wheel(w.a,w.b));}
function acDrawer(A){const A2=shade(A,-0.3),cols=['#1c2029','#8a1f26',A,'#e8dcc0','#1f5a3a'],hats=['#1a1a22','#8a6a3a','#e8dcc0','#3a3a46','#5a3b22'];
  const lamp=(g,Pj,S,s)=>{const p=acPos(AC.A+AC.w+0.55,AC.B+AC.w+0.55,s),b=Pj(p[0],p[1],0.2),t=Pj(p[0],p[1],3.6);g.fillStyle='rgba(20,25,30,.3)';g.beginPath();g.ellipse(b[0]+S*0.1,b[1],S*0.35,S*0.17,0,0,7);g.fill();FR.ln(g,b,t,'#2a2a33',S*0.13);FR.poly(g,[[t[0]-S*0.3,t[1]],[t[0]+S*0.3,t[1]],[t[0]+S*0.22,t[1]-S*0.55],[t[0]-S*0.22,t[1]-S*0.55]],'#fff0b0','#2a2a33',S*0.07);FR.poly(g,[[t[0]-S*0.38,t[1]-S*0.55],[t[0]+S*0.38,t[1]-S*0.55],[t[0],t[1]-S*0.9]],'#2a2a33');
    const gl=g.createRadialGradient(t[0],t[1]-S*0.3,0,t[0],t[1]-S*0.3,S*1.1);gl.addColorStop(0,'rgba(255,225,140,.45)');gl.addColorStop(1,'rgba(255,225,140,0)');g.fillStyle=gl;g.beginPath();g.arc(t[0],t[1]-S*0.3,S*1.1,0,7);g.fill();};
  const lampS=[0.55,2.1,3.7,5.3],ats={};
  return function(g,Pj,S,part,t){const at=ats[S]||(ats[S]=FR.atlas(S,4.8*S,5.6*S,2.4*S,4.4*S,48,(g2,P2,i,psi)=>acCar(g2,P2,S,0,0,psi,cols[i%5],hats[i%5])));const N=120,path=(a,b,z,n)=>{n=n||N;return Array.from({length:n},(_,k)=>{const p=acPos(a,b,k/n*6.2832);return Pj(p[0],p[1],z);});};
    if(part==='back'){const c0=Pj(0,0,0);g.fillStyle='rgba(20,25,30,.26)';g.beginPath();g.ellipse(c0[0]+S*0.4,c0[1]+S*0.3,(AC.A+AC.w+0.9)*0.99*S,(AC.B+AC.w+0.9)*0.495*S,0,0,7);g.fill();
      const ow=AC.w+0.3;for(let k=0;k<N;k++){const s0=k/N*6.2832,s1=(k+1)/N*6.2832,m=(s0+s1)/2,a0=acPos(AC.A+ow,AC.B+ow,s0),a1=acPos(AC.A+ow,AC.B+ow,s1),n=acPos(1,1,m);const vis=(Math.cos(m)*(-1)+Math.sin(m)*1)*0+((acPos(AC.A+ow,AC.B+ow,m)[0]+acPos(AC.A+ow,AC.B+ow,m)[1])>0);if(vis)FR.poly(g,[Pj(a0[0],a0[1],0.2),Pj(a1[0],a1[1],0.2),Pj(a1[0],a1[1],0),Pj(a0[0],a0[1],0)],'#9d9585');}
      FR.poly(g,path(AC.A+ow,AC.B+ow,0.2),'#bfb7a6');FR.poly(g,path(AC.A+AC.w,AC.B+AC.w,0.2),'#4c515c');
      FR.poly(g,path(AC.A-AC.w+0.0,AC.B-AC.w+0.0,0.2),'#bfb7a6');const ig=AC.w+0.3;FR.poly(g,path(AC.A-ig,AC.B-ig,0.28),'#76ad58');
      const edge=(a,b,col,wd)=>{g.beginPath();path(a,b,0.22).forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.strokeStyle=col;g.lineWidth=wd;g.stroke();};edge(AC.A+AC.w-0.18,AC.B+AC.w-0.18,'#f6efe0',S*0.1);edge(AC.A-AC.w+0.18,AC.B-AC.w+0.18,'#f6efe0',S*0.1);
      g.save();g.setLineDash([S*0.5,S*0.45]);edge(AC.A,AC.B,'#f2c230',S*0.1);g.restore();g.beginPath();path(AC.A,AC.B,0.3).forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.strokeStyle='rgba(30,30,40,.55)';g.lineWidth=S*0.07;g.stroke();
      for(let k=0;k<22;k++){const s=k/22*6.2832,p=acPos(AC.A-ig-0.45,AC.B-ig-0.45,s),q=Pj(p[0],p[1],0.3);FR.ell(g,q[0],q[1],S*0.1,S*0.08,['#d9467a','#f2c230','#f6efe0','#f08a22'][k%4]);}
      lampS.filter(s=>{const p=acPos(AC.A+AC.w+0.55,AC.B+AC.w+0.55,s);return p[0]+p[1]<0;}).forEach(s=>lamp(g,Pj,S,s));}
    if(part==='front')lampS.filter(s=>{const p=acPos(AC.A+AC.w+0.55,AC.B+AC.w+0.55,s);return p[0]+p[1]>=0;}).forEach(s=>lamp(g,Pj,S,s));
    if(part==='hub'){const z=0.28;FR.rbox(g,Pj,0,0,z,3.0,2.0,2.2,0,'#f2e3c8');FR.poly(g,[Pj(-1.7,1.2,z+2.2),Pj(1.7,1.2,z+2.2),Pj(1.7,-1.2,z+2.2),Pj(0,0,z+3.6)],A);FR.poly(g,[Pj(1.7,1.2,z+2.2),Pj(1.7,-1.2,z+2.2),Pj(0,0,z+3.6)],A2);FR.poly(g,[Pj(-1.7,1.2,z+2.2),Pj(1.7,1.2,z+2.2),Pj(0,0,z+3.6)],shade(A,0.12),'rgba(0,0,0,.2)',S*0.05);
      for(let k=0;k<6;k++){const a=-1.5+k*0.5;FR.poly(g,[Pj(a,1.55,z+1.4),Pj(a+0.5,1.55,z+1.4),Pj(a+0.5,1.05,z+2.0),Pj(a,1.05,z+2.0)],k%2?'#f6efe0':A2);}
      FR.poly(g,[Pj(-0.6,1.01,z+0.0),Pj(0.6,1.01,z+0.0),Pj(0.6,1.01,z+1.3),Pj(-0.6,1.01,z+1.3)],'#3a2615');
      const o=Pj(-1.3,1.02,z+2.15);g.save();g.transform(0.7,0.35,0,1,o[0],o[1]);g.fillStyle='#17171f';g.fillRect(0,0,2.6*S,0.5*S);g.fillStyle='#f6d34a';g.font='bold '+(0.36*S)+'px Arial Black, Arial, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('ANTIQUE CARS',1.3*S,0.27*S,2.5*S);g.restore();}
    if(part==='cars_back'||part==='cars_front'){const cars=[];for(let i=0;i<AC.N;i++){const s=i*6.2832/AC.N+0.3*t,p=acPos(AC.A,AC.B,s),q=acPos(AC.A,AC.B,s+0.03),r=acPos(AC.A,AC.B,s-0.03);cars.push({i,X:p[0],Y:p[1],psi:Math.atan2(q[1]-r[1],q[0]-r[0]),d:p[0]+p[1]});}
      cars.filter(c=>part==='cars_back'?c.d<0:c.d>=0).sort((p,q)=>p.d-q.d).forEach(c=>{const b=Pj(c.X,c.Y,0.1);g.fillStyle='rgba(15,20,25,.3)';g.beginPath();g.ellipse(b[0]+S*0.15,b[1]+S*0.08,1.5*0.99*S,1.5*0.495*S,0,0,7);g.fill();{const e=at(c.i,c.psi),q=Pj(c.X,c.Y,0);g.drawImage(e.cv,q[0]-e.ox,q[1]-e.oy,e.w,e.h);}});}
  };}
function drawDemolitionDerby(ctx,cx,cy,R,o){o=o||{};const A=o.accent||'#f8fafc';if(o.tile)FR.hex(ctx,cx,cy,R,o.ground||'#9bbf63',A);FR.render(ctx,cx,cy,R,'dd|'+R+'|'+A,1.4,1.6,1.1,FR._d['dd'+A]||(FR._d['dd'+A]=ddDrawer(A)),o.t);}
function drawAntiqueCars(ctx,cx,cy,R,o){o=o||{};const A=o.accent||'#f8fafc';if(o.tile)FR.hex(ctx,cx,cy,R,o.ground||'#9bbf63',A);FR.render(ctx,cx,cy,R,'ac|'+R+'|'+A,1.5,1.4,0.95,FR._d['ac'+A]||(FR._d['ac'+A]=acDrawer(A)),o.t);}
/* ===== END FLAT RIDES ===== */


return { drawDemolitionDerby, drawAntiqueCars };
})();
window.drawDemolitionDerby = REGIONAL_FLAT_RIDE_SPRITES.drawDemolitionDerby;
window.drawAntiqueCars = REGIONAL_FLAT_RIDE_SPRITES.drawAntiqueCars;
