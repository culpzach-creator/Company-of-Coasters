(function () {
/* ===== MODERN LOG FLUME: course geometry (world units of R; X along the hex-pair axis, Y across, Z up) ===== */
function lfHerm(K,x){let i=0;while(i<K.length-2&&x>K[i+1][0])i++;const a=K[i],b=K[i+1],dx=b[0]-a[0],t=Math.max(0,Math.min(1,(x-a[0])/dx)),t2=t*t,t3=t2*t;return(2*t3-3*t2+1)*a[1]+(t3-2*t2+t)*dx*a[2]+(-2*t3+3*t2)*b[1]+(t3-t2)*dx*b[2];}
const LF_SS=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const LF_HW=0.05;                                   /* trough half-width (inner) */
/* out lane: station, long lift, short top run, the big drop, splash basin and run-out. Hairpin. Return lane: a meandering run with a smaller second drop. Hairpin. */
const LF_PIECES=[
  {t:'ramp',L:2.30,K:[[0,.07,0],[.34,.07,0],[.40,.10,.62],[1.12,.60,.62],[1.20,.62,0],[1.36,.62,0],[1.42,.58,-.9],[1.78,.10,-1.2],[1.88,.06,0],[2.30,.065,0]],
    wf:x=>LF_HW+0.04*LF_SS((x-1.84)/0.12)*(1-LF_SS((x-2.12)/0.16)),mk:{liftA:0.40,liftB:1.12,top:1.28,dropA:1.38,basin:1.88,stA:0.04,stB:0.32}},
  {t:'hair',r:.30,z0:.065,z1:.07},
  {t:'ramp',L:2.30,K:[[0,.07,0],[.25,.07,0],[.55,.21,.5],[.68,.22,0],[.80,.18,-.7],[.98,.07,0],[2.30,.07,0]],lat:(x,L)=>0.07*Math.sin(Math.PI*x/L*3)*Math.sin(Math.PI*x/L),
    wf:x=>LF_HW+0.025*LF_SS((x-0.92)/0.1)*(1-LF_SS((x-1.15)/0.15)),mk:{drop2:0.74,basin2:1.0}},
  {t:'hair',r:.30,z0:.07,z1:.07}
];
function lfBuild(){const raw=[],marks=[];let px=0,py=0,h=0,cum=0;
  const push=(lx,ly,z,w)=>{const c=Math.cos(h),s=Math.sin(h),x=px+lx*c-ly*s,y=py+lx*s+ly*c;if(raw.length){const q=raw[raw.length-1];cum+=Math.hypot(x-q[0],y-q[1],z-q[2]);}raw.push([x,y,z,w,cum]);};
  LF_PIECES.forEach(P=>{const n=500;let end;
    if(P.t==='ramp'){for(let k=0;k<=n;k++){const x=P.L*k/n,y=P.lat?P.lat(x,P.L):0;push(x,y,lfHerm(P.K,x),P.wf?P.wf(x):LF_HW);if(P.mk)for(const nm in P.mk)if(Math.abs(x-P.mk[nm])<P.L/n/2)marks.push({s:cum,k:nm});}end=[P.L,0];}
    else{for(let k=0;k<=n;k++){const a=Math.PI*k/n;push(P.r*Math.sin(a),P.r*(1-Math.cos(a)),P.z0+(P.z1-P.z0)*LF_SS(k/n),LF_HW);}end=[0,2*P.r];}
    const c=Math.cos(h),s=Math.sin(h);px+=end[0]*c-end[1]*s;py+=end[0]*s+end[1]*c;if(P.t==='hair')h+=Math.PI;});
  return{raw,marks,total:cum};}
function lfCourse(N){N=N||900;const B=lfBuild(),raw=B.raw,tot=B.total,ds=tot/N,P=[],W=[];let j=0;
  for(let i=0;i<N;i++){const s=i*ds;while(j<raw.length-2&&raw[j+1][4]<s)j++;const a=raw[j],b=raw[j+1],t=(s-a[4])/Math.max(1e-9,b[4]-a[4]);P.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]);W.push(a[3]+(b[3]-a[3])*t);}
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;P.forEach(p=>{x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);});const cx=(x0+x1)/2,cy=(y0+y1)/2;P.forEach(p=>{p[0]-=cx;p[1]-=cy;});
  const T=P.map((p,i)=>{const a=P[(i-1+N)%N],b=P[(i+1)%N],d=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],m=Math.hypot(d[0],d[1],d[2])||1;return[d[0]/m,d[1]/m,d[2]/m];});
  const L=T.map(t=>{const m=Math.hypot(t[0],t[1])||1;return[-t[1]/m,t[0]/m,0];});
  const mk={};B.marks.forEach(m=>{mk[m.k]=Math.round(m.s/ds)%N;});
  return{N,ds,P,T,L,W,mk,total:tot,box:{x0:x0-cx,x1:x1-cx,y0:y0-cy,y1:y1-cy}};}


/* ===== MODERN LOG FLUME: layout, renderer, sprite bake, footprint ===== */
function lfShade(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=c=>Math.max(0,Math.min(255,Math.round(amt<0?c*(1+amt):c+(255-c)*amt)));return '#'+((1<<24)+(f(r)<<16)+(f(g)<<8)+f(b)).toString(16).slice(1);}
const lfPj=p=>[p[0],0.58*p[1]-p[2]],lfDep=p=>p[1]+0.58*p[2];
let LF_UNIT=null;
function lfLayout(R,mode){lfLayout._c=lfLayout._c||{};const key=mode+R;if(lfLayout._c[key])return lfLayout._c[key];
  const C0=LF_UNIT=LF_UNIT||lfCourse(900),N=C0.N,a=mode==='side'?0:Math.PI/3,ca=Math.cos(a),sa=Math.sin(a),rot=v=>[v[0]*ca-v[1]*sa,v[0]*sa+v[1]*ca,v[2]];
  const P=C0.P.map(p=>rot([p[0]*R,p[1]*R,p[2]*R])),T=C0.T.map(rot),L=C0.L.map(rot),W=C0.W.map(w=>w*R);
  const hexes=mode==='side'?[[-0.866*R,0],[0.866*R,0]]:[[-0.433*R,-0.435*R],[0.433*R,0.435*R]];
  return lfLayout._c[key]={N,ds:C0.ds*R,P,T,L,W,mk:C0.mk,hexes,mode,total:C0.total};}
function lfDraw(ctx,R,mode,op){
  const accent=op.accent||'#f8fafc',supp=op.support||'#8b6b45',suppL=lfShade(supp,0.3),suppD=lfShade(supp,-0.35),Ly=lfLayout(R,mode),{N,P,T,L,W,mk}=Ly,ds=Ly.ds;
  const wOut=accent,wIn=lfShade(accent,-0.2),rim=lfShade(accent,0.28),slab=lfShade(accent,-0.52),tw=R*0.016,hwl=R*0.03;
  ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  const poly=(pts,fill)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=fill;ctx.lineWidth=0.6;ctx.stroke();};
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const E=(p,l,wd,sg,zz)=>lfPj([p[0]+l[0]*wd*sg,p[1]+l[1]*wd*sg,p[2]+zz]);
  const items=[];
  ctx.save();ctx.translate(R*0.04,R*0.02);ctx.beginPath();P.forEach((p,i)=>{const x=p[0]+p[2]*0.28,y=0.58*p[1]+p[2]*0.12;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.strokeStyle='rgba(15,25,30,.085)';ctx.lineWidth=R*0.04;ctx.stroke();ctx.restore();
  const inLift=i=>i>=mk.liftA&&i<=mk.liftB,inBasin=i=>i>=mk.basin&&i<=mk.basin+70;
  /* ---- the trough, segment by segment ---- */
  for(let i=0;i<N;i++){const j=(i+1)%N,pi=P[i],pj=P[j],li=L[i],lj=L[j],wi=W[i],wj=W[j],near=li[1]>0?1:-1,far=-near,lift=inLift(i),drop=i>=mk.dropA&&i<mk.basin,wet=i>=mk.drop2&&i<mk.basin2;
    items.push({k:(lfDep(pi)+lfDep(pj))/2,f:()=>{
      poly([E(pi,li,wi+tw,1,-R*0.014),E(pj,lj,wj+tw,1,-R*0.014),E(pj,lj,wj+tw,-1,-R*0.014),E(pi,li,wi+tw,-1,-R*0.014)],slab);
      poly([E(pi,li,wi,far,0),E(pj,lj,wj,far,0),E(pj,lj,wj,far,hwl),E(pi,li,wi,far,hwl)],wIn);poly([E(pi,li,wi,far,hwl),E(pj,lj,wj,far,hwl),E(pj,lj,wj+tw,far,hwl),E(pi,li,wi+tw,far,hwl)],rim);
      if(lift){poly([E(pi,li,wi,1,R*0.006),E(pj,lj,wj,1,R*0.006),E(pj,lj,wj,-1,R*0.006),E(pi,li,wi,-1,R*0.006)],'#2f353e');line(E(pi,li,wi*0.9,1,R*0.008),E(pj,lj,wj*0.9,1,R*0.008),'#444c57',R*0.004);line(E(pi,li,wi*0.9,-1,R*0.008),E(pj,lj,wj*0.9,-1,R*0.008),'#444c57',R*0.004);if(i%3===0)line(E(pi,li,wi*0.85,1,R*0.01),E(pi,li,wi*0.85,-1,R*0.01),'#6a7380',R*0.0045);}
      else{poly([E(pi,li,wi,1,R*0.006),E(pj,lj,wj,1,R*0.006),E(pj,lj,wj,-1,R*0.006),E(pi,li,wi,-1,R*0.006)],(i%9<4)?'#58b0de':'#46a2d2');if(i%13===0)line(E(pi,li,wi*0.5,1,R*0.009),E(pj,lj,wj*0.5,1,R*0.009),'rgba(255,255,255,.5)',R*0.0035);
        if((drop||wet)&&i%5===0)line(E(pi,li,wi*0.8,1,R*0.012),E(pi,li,wi*0.8,-1,R*0.012),'rgba(255,255,255,.6)',R*0.004);}
      if(inBasin(i)&&i%3===0){const f=((i*53)%11-5)/5*wi*0.6,sz=R*(0.013+((i*17)%5)*0.003),q=lfPj([pi[0]+li[0]*f,pi[1]+li[1]*f,pi[2]+R*0.011]);ctx.fillStyle='rgba(255,255,255,'+(0.6+((i*7)%4)*0.1)+')';ctx.beginPath();ctx.ellipse(q[0],q[1],sz*1.3,sz*0.7,0,0,7);ctx.fill();}
      poly([E(pi,li,wi+tw,near,0),E(pj,lj,wj+tw,near,0),E(pj,lj,wj+tw,near,hwl),E(pi,li,wi+tw,near,hwl)],wOut);poly([E(pi,li,wi,near,hwl),E(pj,lj,wj,near,hwl),E(pj,lj,wj+tw,near,hwl),E(pi,li,wi+tw,near,hwl)],rim);
      /* the maintenance catwalk along the lift: a grated strip with a handrail on the near side */
      if(lift){const o0=wi+tw+R*0.004,o1=wi+tw+R*0.044,q0=wj+tw+R*0.004,q1=wj+tw+R*0.044,zz=-R*0.006;poly([E(pi,li,o0,near,zz),E(pj,lj,q0,near,zz),E(pj,lj,q1,near,zz),E(pi,li,o1,near,zz)],'#aeb6c2');line(E(pi,li,o1,near,zz),E(pj,lj,q1,near,zz),'#7f8896',R*0.004);
        line(E(pi,li,o1,near,R*0.04),E(pj,lj,q1,near,R*0.04),'#dfe4ec',R*0.0035);if(i%7===0)line(E(pi,li,o1,near,zz),E(pi,li,o1,near,R*0.04),'#dfe4ec',R*0.0035);}
    }});}
  /* ---- trestle supports: wooden bents with rungs and a zig-zag ---- */
  const tube=(a,b,w)=>{line(a,b,suppD,w*1.35);line(a,b,supp,w);line([a[0]-w*0.2,a[1]],[b[0]-w*0.2,b[1]],suppL,w*0.25);};
  const bents=[];{let acc=0;for(let i=0;i<N;i++){acc+=ds;const z=P[i][2];if(z<R*0.085)continue;const sl=Math.abs(P[(i+1)%N][2]-P[(i-1+N)%N][2])/(2*ds),spc=sl>0.7?R*0.15:sl>0.3?R*0.17:R*0.26;if(acc<spc)continue;acc=0;
    const p=P[i],l=L[i],w=W[i]+tw*0.6,wg=w+tw+R*0.02+R*0.05*Math.min(1,z/(R*0.55)),top=[[p[0]+l[0]*w,p[1]+l[1]*w,z-R*0.024],[p[0]-l[0]*w,p[1]-l[1]*w,z-R*0.024]],feet=[[p[0]+l[0]*wg,p[1]+l[1]*wg,0],[p[0]-l[0]*wg,p[1]-l[1]*wg,0]];bents.push({i,top,feet,z});}}
  bents.forEach(b=>{items.push({k:(lfDep(b.feet[0])+lfDep(b.feet[1]))/2+0.29*b.z,f:()=>{const z=b.z,lv=Math.max(1,Math.round(z/(R*0.12))),F=b.feet,Tp=b.top,wd=R*0.0125;
    for(let q=0;q<2;q++){ctx.fillStyle='rgba(70,76,92,.45)';ctx.beginPath();ctx.ellipse(F[q][0],0.58*F[q][1],R*0.017,R*0.0075,0,0,7);ctx.fill();}
    const at=(q,t)=>lfPj([F[q][0]+(Tp[q][0]-F[q][0])*t,F[q][1]+(Tp[q][1]-F[q][1])*t,Tp[q][2]*t]);
    for(let q=0;q<2;q++)tube(lfPj(F[q]),lfPj(Tp[q]),wd);
    for(let m=1;m<=lv;m++){const t=m/lv*0.97;line(at(0,t),at(1,t),suppL,R*0.0046);}
    for(let m=0;m<lv;m++){const t0=m/lv*0.97,t1=(m+1)/lv*0.97,d=m%2===0;line(at(d?0:1,t0),at(d?1:0,t1),suppL,R*0.0038);}
    line(lfPj(Tp[0]),lfPj(Tp[1]),suppD,R*0.014);line(lfPj(Tp[0]),lfPj(Tp[1]),supp,R*0.01);}});});
  for(let q=0;q<bents.length-1;q+=2){const A=bents[q],B=bents[q+1];if(A.z<R*0.2||B.z<R*0.2)continue;const dG=Math.hypot(A.feet[0][0]-B.feet[0][0],A.feet[0][1]-B.feet[0][1]);if(dG>R*0.2)continue;
    items.push({k:(lfDep(A.feet[0])+lfDep(B.feet[0]))/2+0.29*Math.min(A.z,B.z),f:()=>{const mz=Math.min(A.z,B.z),n=Math.max(1,Math.round(mz/(R*0.13)));for(let li=0;li<2;li++){const pa=t=>lfPj([A.feet[li][0]+(A.top[li][0]-A.feet[li][0])*t,A.feet[li][1]+(A.top[li][1]-A.feet[li][1])*t,A.top[li][2]*t]),pb=t=>lfPj([B.feet[li][0]+(B.top[li][0]-B.feet[li][0])*t,B.feet[li][1]+(B.top[li][1]-B.feet[li][1])*t,B.top[li][2]*t]);for(let m=0;m<n;m++){const t0=m/n*(mz/A.z)*0.95,t1=(m+1)/n*(mz/A.z)*0.95,u0=m/n*(mz/B.z)*0.95,u1=(m+1)/n*(mz/B.z)*0.95;line(pa(t0),pb(u1),suppL,R*0.0036);line(pb(u0),pa(t1),suppL,R*0.0036);}}}});}
  /* ---- the station: a platform on the near side with an accent canopy ---- */
  {const i0=mk.stA,i1=mk.stB,g0=P[i0],g1=P[i1],mid=Math.round((i0+i1)/2),l=L[mid],w=W[mid]+tw,sg=l[1]>0?1:-1;
    const pf=(g,off,z)=>lfPj([g[0]-l[0]*off*sg,g[1]-l[1]*off*sg,z]);
    items.push({k:lfDep(g0)+R*0.07,f:()=>{poly([pf(g0,w,R*0.036),pf(g1,w,R*0.036),pf(g1,w+R*0.12,R*0.036),pf(g0,w+R*0.12,R*0.036)],'#e3e8ef');poly([pf(g0,w+R*0.12,R*0.036),pf(g1,w+R*0.12,R*0.036),pf(g1,w+R*0.12,0),pf(g0,w+R*0.12,0)],'#9aa6b8');line(pf(g0,w,R*0.036),pf(g1,w,R*0.036),'#9aa6b8',R*0.004);for(let k=1;k<7;k++){const t=k/7,g=[g0[0]+(g1[0]-g0[0])*t,g0[1]+(g1[1]-g0[1])*t,g0[2]];line(pf(g,w+R*0.004,R*0.0365),pf(g,w+R*0.116,R*0.0365),'rgba(120,130,150,.35)',R*0.002);}}});
    items.push({k:lfDep(g1)+R*0.4,f:()=>{[0.0,0.5,1.0].forEach(t=>{const g=[g0[0]+(g1[0]-g0[0])*t,g0[1]+(g1[1]-g0[1])*t,g0[2]];line(pf(g,w+R*0.105,R*0.036),pf(g,w+R*0.105,R*0.15),'#e8ecf2',R*0.006);});
      poly([pf(g0,w-R*0.01,R*0.15),pf(g1,w-R*0.01,R*0.15),pf(g1,w+R*0.15,R*0.15),pf(g0,w+R*0.15,R*0.15)],lfShade(accent,0.08));line(pf(g0,w+R*0.15,R*0.15),pf(g1,w+R*0.15,R*0.15),lfShade(accent,-0.4),R*0.01);line(pf(g0,w-R*0.01,R*0.15),pf(g1,w-R*0.01,R*0.15),lfShade(accent,-0.4),R*0.01);line(pf(g0,w-R*0.01,R*0.15),pf(g0,w+R*0.15,R*0.15),lfShade(accent,-0.3),R*0.007);}});}
  items.sort((a,b)=>a.k-b.k).forEach(it=>it.f());ctx.restore();}
function lfBounds(R,mode){const Ly=lfLayout(R,mode);let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;Ly.P.forEach(p=>{const s=lfPj(p);x0=Math.min(x0,s[0]);x1=Math.max(x1,s[0]);y0=Math.min(y0,s[1]);y1=Math.max(y1,s[1]);});return[x0,x1,y0,y1];}
function lfSprite(R,mode,dir,opts,scale){opts=opts||{};lfSprite._c=lfSprite._c||{};const sc=scale||getBakeScale(),key=[mode,dir,Math.round(R*sc),R,opts.accent,opts.support,sc].join('|');if(lfSprite._c[key])return lfSprite._c[key];
  const[x0,x1,y0,y1]=lfBounds(R,mode),mg=R*0.3,W=Math.ceil(x1-x0+2*mg),H=Math.ceil(y1-y0+2*mg+R*0.1),ox=Math.ceil(-x0+mg),oy=Math.ceil(-y0+mg),cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);g.save();
  const flip=dir==='NE-SW'||dir==='E-W';if(flip){g.translate(W,0);g.scale(-1,1);}g.translate(ox,oy);lfDraw(g,R,mode,opts);g.restore();
  return lfSprite._c[key]={canvas:cv,ox:flip?W-ox:ox,oy:oy,w:W,h:H};}

/* ===== animated logs: a string of hollow logs circulating the whole course, drawn over the baked sprite ===== */
let LF_TIME=null;
function lfTiming(){if(LF_TIME)return LF_TIME;const C=LF_UNIT||(LF_UNIT=lfCourse(900)),N=C.N,ds=C.ds,mk=C.mk,T=[0];
  for(let i=1;i<N;i++){const z=C.P[i][2];let v;
    if(i<mk.liftA)v=0.22;else if(i<=mk.liftB)v=0.2;else if(i<mk.dropA)v=0.28;
    else if(i<mk.basin+70){v=i<mk.basin?0.28+0.95*Math.sqrt(Math.max(0,(0.62-z)/0.56)):Math.max(0.3,0.9*Math.exp(-(i-mk.basin)*ds*3.2));}
    else if(i>=mk.drop2-60&&i<mk.basin2+50)v=0.3+0.55*Math.sqrt(Math.max(0,(0.22-z)/0.16));else v=0.3;
    T.push(T[i-1]+ds/v);}
  const total=T[N-1]+ds/0.25;return LF_TIME={T,total,N};}
function lfIdxAt(tt){const S=lfTiming(),T=S.T;tt=((tt%S.total)+S.total)%S.total;let lo=0,hi=T.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(T[m]<=tt)lo=m;else hi=m;}return lo+(tt-T[lo])/Math.max(1e-6,T[hi]-T[lo]);}
function lfAnimDraw(ctx,cx,cy,R,mode,dir,o){o=o||{};if(o.logs===false)return;const Ly=lfLayout(R,mode),{N,P,L,W,mk}=Ly,S=lfTiming(),fl=(dir==='NE-SW'||dir==='E-W')?-1:1,accent=o.accent||'#f8fafc',nlogs=o.count||5,t=(o.t===undefined||o.t===null)?3.0:o.t*(o.speed||1);
  const rim=lfShade(accent,0.28),tw=R*0.016,hwl=R*0.03;
  const Pt=(p,dz)=>[cx+fl*p[0],cy+0.58*p[1]-(p[2]+(dz||0))];
  ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  const poly=(pts,f)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=f;ctx.fill();};
  for(let k=0;k<nlogs;k++){const tt=t+k*S.total/nlogs,tm=((tt%S.total)+S.total)%S.total,fi=lfIdxAt(tt),i=Math.floor(fi)%N,fr=fi-Math.floor(fi),j=(i+1)%N,p=[P[i][0]+(P[j][0]-P[i][0])*fr,P[i][1]+(P[j][1]-P[i][1])*fr,P[i][2]+(P[j][2]-P[i][2])*fr];
    /* splash burst as it enters the basin */
    const tau=tm-S.T[mk.basin];if(tau>-0.05&&tau<1.0){const p0=P[mk.basin+4],b=Pt(p0,R*0.012),kk=Math.max(0,tau);ctx.fillStyle='rgba(255,255,255,'+(0.5*(1-kk)).toFixed(3)+')';ctx.beginPath();ctx.ellipse(b[0],b[1],R*(0.05+0.17*kk),R*(0.022+0.07*kk),0,0,7);ctx.fill();
      for(let n=0;n<14;n++){const vy=0.3+0.26*((n*5)%7)/7,vx=(((n*3)%9)-4)*0.05,gx=1.5,x=b[0]+fl*vx*R*kk,y=b[1]-(vy*kk-0.5*gx*kk*kk)*R,r=R*0.013*(1-0.6*kk);if(y>b[1]+R*0.02)continue;ctx.fillStyle='rgba(240,250,255,'+(0.9*(1-kk)).toFixed(3)+')';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();}}
    /* the log: sinks a little in the basin, rocks as it recovers */
    const dq=Math.max(0,Math.min(1,(fi-(mk.basin-8))/48)),dip=-0.014*R*Math.sin(Math.PI*dq)+0.003*R*Math.sin(tm*5)*(fi>mk.basin?1:0);
    const c=Pt(p,R*0.026+dip),a=Pt(P[(i-7+N)%N],R*0.026),b2=Pt(P[(i+7)%N],R*0.026);let dx=fl*(b2[0]-a[0])*fl,dy=b2[1]-a[1];dx=b2[0]-a[0];const m=Math.hypot(dx,dy)||1;dx/=m;dy/=m;const Ll=R*0.085,Wl=R*0.036,nx=-dy,ny=dx;
    ctx.fillStyle='rgba(20,40,60,.28)';ctx.beginPath();ctx.ellipse(c[0]+R*0.004,c[1]+R*0.012,Ll*0.9,Wl*0.55,Math.atan2(dy,dx),0,7);ctx.fill();
    poly([[c[0]-dx*Ll+nx*Wl,c[1]-dy*Ll+ny*Wl],[c[0]+dx*Ll+nx*Wl,c[1]+dy*Ll+ny*Wl],[c[0]+dx*Ll-nx*Wl,c[1]+dy*Ll-ny*Wl],[c[0]-dx*Ll-nx*Wl,c[1]-dy*Ll-ny*Wl]],'#8a5a33');
    poly([[c[0]-dx*Ll+nx*Wl*0.2,c[1]-dy*Ll+ny*Wl*0.2],[c[0]+dx*Ll+nx*Wl*0.2,c[1]+dy*Ll+ny*Wl*0.2],[c[0]+dx*Ll-nx*Wl*0.55,c[1]+dy*Ll-ny*Wl*0.55],[c[0]-dx*Ll-nx*Wl*0.55,c[1]-dy*Ll-ny*Wl*0.55]],'#b07a46');
    ctx.fillStyle='#3a2616';ctx.beginPath();ctx.ellipse(c[0]+dx*Ll,c[1]+dy*Ll,Wl*0.55,Wl*0.9,Math.atan2(dy,dx),0,7);ctx.fill();
    for(let q=0;q<4;q++){const tq=(q-1.5)*0.42,hx=c[0]+dx*Ll*tq,hy=c[1]+dy*Ll*tq-R*0.02;ctx.fillStyle=['#3b82f6','#ef4444','#22c55e','#f59e0b'][(q+k)%4];ctx.fillRect(hx-R*0.008,hy,R*0.016,R*0.016);ctx.fillStyle='#fde4c8';ctx.beginPath();ctx.arc(hx,hy-R*0.005,R*0.0085,0,7);ctx.fill();ctx.fillStyle=['#2a1a10','#6a3a1a','#e8c84a','#3a2418'][(q+k)%4];ctx.beginPath();ctx.arc(hx,hy-R*0.008,R*0.0075,Math.PI,0);ctx.fill();}
    /* redraw the near trough wall over the log, so it sits inside the channel */
    for(let jj=-14;jj<14;jj++){const a1=(i+jj+N)%N,a2=(a1+1)%N,pi=P[a1],pj=P[a2],li=L[a1],lj=L[a2],wi=W[a1],wj=W[a2],near=li[1]>0?1:-1;const E=(pp,l,wd,sg,zz)=>Pt([pp[0]+l[0]*wd*sg,pp[1]+l[1]*wd*sg,pp[2]],zz);
      poly([E(pi,li,wi+tw,near,0),E(pj,lj,wj+tw,near,0),E(pj,lj,wj+tw,near,hwl),E(pi,li,wi+tw,near,hwl)],accent);poly([E(pi,li,wi,near,hwl),E(pj,lj,wj,near,hwl),E(pj,lj,wj+tw,near,hwl),E(pi,li,wi+tw,near,hwl)],rim);}
  }
  ctx.restore();}


/* ===== API ===== */
function drawLogFlumeSide(ctx,cx,cy,R,o){o=o||{};const d=o.flip?'E-W':'W-E',s=lfSprite(R,'side',d,o,o.scale);ctx.drawImage(s.canvas,cx-s.ox,cy-s.oy,s.w,s.h);lfAnimDraw(ctx,cx,cy,R,'side',d,o);}
function drawLogFlumeDiag(ctx,cx,cy,R,o){o=o||{};const d=o.dir==='NE-SW'?'NE-SW':'NW-SE',s=lfSprite(R,'diag',d,o,o.scale);ctx.drawImage(s.canvas,cx-s.ox,cy-s.oy,s.w,s.h);lfAnimDraw(ctx,cx,cy,R,'diag',d,o);}
function logFlumeCycle(){return lfTiming().total;}
/* footprint: the two tiles and ground circles along the course, for keeping land scenery off the ride (and sceneryInFront for what stands in front of it) */
function logFlumeFootprint(R,mode,dir){const Ly=lfLayout(R,mode),m=(dir==='NE-SW'||dir==='E-W')?-1:1,c=[];for(let i=0;i<Ly.N;i+=5)c.push({x:Ly.P[i][0]*m,y:0.58*Ly.P[i][1],r:R*0.11});return{tiles:Ly.hexes.map(h=>[h[0]*m,h[1]]),circles:c};}
window.footprintForTile=window.footprintForTile||function(fp,i){const t=fp.tiles[i];return fp.circles.map(c=>({x:c.x-t[0],y:c.y-t[1],r:c.r}));};
window.sceneryInFront=window.sceneryInFront||function(circles,x,y){let f=-Infinity;for(const c of circles){const dx=x-c.x;if(Math.abs(dx)<c.r)f=Math.max(f,c.y+Math.sqrt(c.r*c.r-dx*dx)/1.7);}return f>-Infinity&&y>f;};



window.MODERN_LOG_FLUME_SPRITE = { side: drawLogFlumeSide, diag: drawLogFlumeDiag, footprint: logFlumeFootprint, cycle: logFlumeCycle };
})();
