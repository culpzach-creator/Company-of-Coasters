const MODERN_INVERTED_COASTER_SPRITE = (() => {
/* ===== B&M-style INVERTED coaster: forward-kinematics track generator (world units of R) =====
   State frame (T forward, L left, U track-normal). Pitch about L, yaw about world Z, roll about T. */
const IV_D=Math.PI/180;
function ivRotAbout(v,ax,a){const c=Math.cos(a),s=Math.sin(a),d=v[0]*ax[0]+v[1]*ax[1]+v[2]*ax[2],cr=[ax[1]*v[2]-ax[2]*v[1],ax[2]*v[0]-ax[0]*v[2],ax[0]*v[1]-ax[1]*v[0]];return[v[0]*c+cr[0]*s+ax[0]*d*(1-c),v[1]*c+cr[1]*s+ax[1]*d*(1-c),v[2]*c+cr[2]*s+ax[2]*d*(1-c)];}
const ivNorm=v=>{const m=Math.hypot(v[0],v[1],v[2])||1;return[v[0]/m,v[1]/m,v[2]/m];};
const IV_S=t=>t*t*(3-2*t);
class IvTrack{
  constructor(p0,heading){this.p=p0.slice();this.T=[Math.cos(heading),Math.sin(heading),0];this.L=[-Math.sin(heading),Math.cos(heading),0];this.U=[0,0,1];this.pts=[];this.marks=[];this.cum=0;this.push();}
  push(){this.pts.push({p:this.p.slice(),T:this.T.slice(),L:this.L.slice(),U:this.U.slice()});}
  step(ds,dth,dps,dph){ /* roll about T, pitch about L, yaw about Z */
    if(dph){this.L=ivRotAbout(this.L,this.T,-dph);this.U=ivRotAbout(this.U,this.T,-dph);}
    if(dth){this.T=ivRotAbout(this.T,this.L,-dth);this.U=ivRotAbout(this.U,this.L,-dth);}
    if(dps){const Z=[0,0,1];this.T=ivRotAbout(this.T,Z,dps);this.L=ivRotAbout(this.L,Z,dps);this.U=ivRotAbout(this.U,Z,dps);}
    this.T=ivNorm(this.T);this.L=ivNorm(this.L);this.U=ivNorm(this.U);
    this.p=[this.p[0]+this.T[0]*ds,this.p[1]+this.T[1]*ds,this.p[2]+this.T[2]*ds];this.cum+=ds;this.push();}
  mark(k){this.marks.push({k:k,i:this.pts.length-1});}
  /* a run of length Len with total pitch th, yaw ps (about world Z), roll ph (degrees); each eased by its own profile */
  seg(Len,th,ps,ph,o){o=o||{};const n=Math.max(2,Math.ceil(Len/0.004)),ds=Len/n,f=o.f||IV_S;for(let k=0;k<n;k++){const a=f(k/n),b=f((k+1)/n);const g=o.g||f,ga=g(k/n),gb=g((k+1)/n),h=o.h||f,ha=h(k/n),hb=h((k+1)/n);this.step(ds,(th||0)*IV_D*(b-a),(ps||0)*IV_D*(gb-ga),(ph||0)*IV_D*(hb-ha));}}
  /* a pitch loop with curvature that tightens toward the apex (teardrop); yaw spread evenly over the angle */
  loop(angDeg,rb,rt,yawDeg,rollDeg){const nst=Math.round(angDeg/0.6),dth=angDeg*IV_D/nst;let th=0;for(let k=0;k<nst;k++){const thm=th+dth/2,kap=(1/rb)+(1/rt-1/rb)*(1-Math.cos(thm))/2*(angDeg>200?1:1),ds=dth/kap;this.step(ds,dth,(yawDeg||0)*IV_D/nst,(rollDeg||0)*IV_D/nst);th+=dth;}}
}

IvTrack.prototype.halfLoop=function(rb,rt,yawDeg){this.loop(180,rb,rt,yawDeg||0,0);};
/* a B&M cobra roll: half loop up (with a half twist at the top), then a half twist and a half loop down; ends upright, heading unchanged, shifted sideways */
IvTrack.prototype.cobra=function(rb,rt,yaw1,yaw2,ell){this.halfLoop(rb,rt,yaw1);this.seg(ell,0,0,180);this.seg(ell,0,0,180);this.halfLoop(rb,rt,yaw2);};

function ivResample(pts,ds){const out=[];let acc=0,j=0;out.push(pts[0]);let cum=[0];for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i].p[0]-pts[i-1].p[0],pts[i].p[1]-pts[i-1].p[1],pts[i].p[2]-pts[i-1].p[2]));const tot=cum[cum.length-1],n=Math.round(tot/ds);for(let k=1;k<=n;k++){const s=k*tot/n;while(j<pts.length-2&&cum[j+1]<s)j++;const a=pts[j],b=pts[j+1],t=(s-cum[j])/Math.max(1e-9,cum[j+1]-cum[j]),L=(x,y)=>x+(y-x)*t,P=(x,y)=>[L(x[0],y[0]),L(x[1],y[1]),L(x[2],y[2])];out.push({p:P(a.p,b.p),T:ivNorm(P(a.T,b.T)),L:ivNorm(P(a.L,b.L)),U:ivNorm(P(a.U,b.U))});}return{pts:out,total:tot,idxMap:cum.map(c=>c/tot*n)};}



const D2R=Math.PI/180;
function body(P){const t=new IvTrack([P.sx,P.sy,0.14],0);
  t.seg(0.30,0,0,0);t.mark('stEnd');
  t.seg(0.16,P.liftPitch,0,0);t.mark('liftA');t.seg(P.liftLen,0,0,0);t.mark('liftB');t.seg(P.crestLen,-P.liftPitch,0,0);t.mark('crest');t.seg(0.06,0,0,0);
  t.seg(0.25,-P.divePitch,0,0);t.mark('diveA');
  t.seg(P.diveLen,0,P.diveYaw,P.diveBank,{h:x=>Math.sin(Math.PI*x)**0.8});
  t.seg(0.30,P.divePitch,0,0);t.mark('diveB');
  t.seg(P.s1,0,0,0);
  t.mark('loopA');t.loop(360,P.lrb,P.lrt,P.lyaw,0);t.mark('loopB');
  t.seg(P.s2,0,0,0);
  if(P.t3L>0){t.mark('turn3A');t.seg(P.t3L,0,P.t3,P.t3Bank,{h:x=>Math.sin(Math.PI*x)**0.8});t.mark('turn3B');}
  t.seg(P.s3,0,0,0);
  t.mark('cobraA');t.cobra(P.crb,P.crt,P.cy1,P.cy2,P.cell);t.mark('cobraB');
  t.seg(P.s4,0,0,0);
  return t;}
/* planar tail: left turn a1 (radius r), straight s5, left turn a2, straight s6 */
function tailEnd(x,y,psi,r,a1,s5,a2,s6){let X=x,Y=y,ps=psi;const arc=(a)=>{const sg=a<0?-1:1;X+=sg*r*(-Math.sin(ps)+Math.sin(ps+a));Y+=sg*r*(Math.cos(ps)-Math.cos(ps+a));ps+=a;};const st=(s)=>{X+=Math.cos(ps)*s;Y+=Math.sin(ps)*s;};arc(a1);st(s5);arc(a2);st(s6);return[X,Y,ps];}
function solveTail(x,y,psi,r,target,guess,s6){let a1=guess[0],s5=guess[1],a2=guess[2];const f=(a1,s5,a2)=>{const e=tailEnd(x,y,psi,r,a1,s5,a2,s6);let dpsi=e[2]-target[2];dpsi=Math.atan2(Math.sin(dpsi),Math.cos(dpsi));return[e[0]-target[0],e[1]-target[1],dpsi];};
  for(let it=0;it<80;it++){const F=f(a1,s5,a2);const err=Math.hypot(F[0],F[1],F[2]);if(err<1e-7)break;const h=1e-5,J=[];const v=[a1,s5,a2];for(let k=0;k<3;k++){const w=v.slice();w[k]+=h;const G=f(...w);J.push([(G[0]-F[0])/h,(G[1]-F[1])/h,(G[2]-F[2])/h]);}
    /* solve J^T dx = -F (3x3) */const M=[[J[0][0],J[1][0],J[2][0]],[J[0][1],J[1][1],J[2][1]],[J[0][2],J[1][2],J[2][2]]];const b=[-F[0],-F[1],-F[2]];
    const det=M[0][0]*(M[1][1]*M[2][2]-M[1][2]*M[2][1])-M[0][1]*(M[1][0]*M[2][2]-M[1][2]*M[2][0])+M[0][2]*(M[1][0]*M[2][1]-M[1][1]*M[2][0]);if(Math.abs(det)<1e-12)break;
    const inv=(A)=>{const d=det;return[[(A[1][1]*A[2][2]-A[1][2]*A[2][1])/d,(A[0][2]*A[2][1]-A[0][1]*A[2][2])/d,(A[0][1]*A[1][2]-A[0][2]*A[1][1])/d],[(A[1][2]*A[2][0]-A[1][0]*A[2][2])/d,(A[0][0]*A[2][2]-A[0][2]*A[2][0])/d,(A[0][2]*A[1][0]-A[0][0]*A[1][2])/d],[(A[1][0]*A[2][1]-A[1][1]*A[2][0])/d,(A[0][1]*A[2][0]-A[0][0]*A[2][1])/d,(A[0][0]*A[1][1]-A[0][1]*A[1][0])/d]];};
    const Mi=inv(M);const dx=[Mi[0][0]*b[0]+Mi[0][1]*b[1]+Mi[0][2]*b[2],Mi[1][0]*b[0]+Mi[1][1]*b[1]+Mi[1][2]*b[2],Mi[2][0]*b[0]+Mi[2][1]*b[1]+Mi[2][2]*b[2]];const lim=0.5;a1+=Math.max(-lim,Math.min(lim,dx[0]));s5+=Math.max(-0.4,Math.min(0.4,dx[1]));a2+=Math.max(-lim,Math.min(lim,dx[2]));}
  const F=f(a1,s5,a2);return{a1,s5,a2,err:Math.hypot(F[0],F[1],F[2])};}
function zAt(P,key){const t=body(P);const m=t.marks.find(q=>q.k===key);return t.pts[m.i].p[2];}
function tune(P){if(P.tuned)return P;let lo=0.2,hi=2.5;for(let k=0;k<40;k++){P.liftLen=(lo+hi)/2;if(zAt(P,'crest')<0.80)lo=P.liftLen;else hi=P.liftLen;}
  lo=8;hi=55;for(let k=0;k<40;k++){P.divePitch=(lo+hi)/2;if(zAt(P,'diveB')>0.14)lo=P.divePitch;else hi=P.divePitch;}return P;}
function full(P){tune(P);const t=body(P);const x=t.p[0],y=t.p[1],psi=Math.atan2(t.T[1],t.T[0]);
  const target=[P.sx,P.sy,2*Math.PI*Math.round((psi+P.tailTurn*D2R)/(2*Math.PI))];
  let best=null;for(const g of P.guesses){const r=solveTail(x,y,psi,P.tr,target,g,P.s6);if(r.err<1e-5&&r.s5>0.02&&Math.abs(r.a1)<5.5&&Math.abs(r.a2)<5.5){r.len=P.tr*(Math.abs(r.a1)+Math.abs(r.a2))+r.s5;if(!best||r.len<best.len)best=r;}}
  if(!best)return{t,err:'no tail solution',x,y,psi};
  t.mark('tailA');t.seg(0.0001,0,0,0);
  const lin=x=>x;t.seg(Math.abs(best.a1)*P.tr,0,best.a1/D2R,P.tBank*Math.sign(best.a1),{g:lin,h:x=>Math.sin(Math.PI*x)**0.8});t.seg(best.s5,0,0,0);t.seg(Math.abs(best.a2)*P.tr,0,best.a2/D2R,P.tBank*Math.sign(best.a2),{g:lin,h:x=>Math.sin(Math.PI*x)**0.8});t.seg(P.s6,0,0,0);
  return{t,best};}


const IV_P={"sx": 0, "sy": 0, "liftPitch": 36, "liftLen": 0.8867841158312333, "crestLen": 0.3, "divePitch": 26.506084276127694, "diveLen": 1.2, "diveYaw": 205, "diveBank": 55, "s1": 1.1, "lrb": 0.42, "lrt": 0.18, "lyaw": -20, "s2": 0.1, "t3": 150, "t3L": 0, "t3Bank": 50, "s3": 0.9, "crb": 0.26, "crt": 0.16, "cy1": 10, "cy2": -10, "cell": 0.14, "s4": 0.12, "tr": 0.34, "tBank": 48, "s6": 0.1, "tailTurn": 0, "guesses": [[-2, 0.3, -1.5], [-3, 0.3, -2], [-2.5, 0.6, -3], [-1.2, 0.5, 2], [2, 0.5, -1.2], [-2.2, 1, 1.5], [3.14, 0.3, 3.14], [2.6, 0.5, 3.5], [3.8, 0.3, 2.6], [3.14, 0.8, 3.14], [2, 0.4, 4], [4.2, 0.4, 2.2], [2.2, 1, 3], [3, 0.2, 4.5]], "tuned": true};const IV_SHIFT=[-0.37999999999999967, -0.019999999999999605];
function ivHexMargin(u,v){let m=-1;for(const cu of [-0.866,0.866]){const dx=Math.abs(u-cu);if(dx<=0.866)m=Math.max(m,(1-0.5774*dx)-Math.abs(v));}return m;}
let IV_UNIT=null;
function ivCourse(){if(IV_UNIT)return IV_UNIT;const R=full(JSON.parse(JSON.stringify(IV_P)));const t=R.t,pts=t.pts;
  const sh=IV_SHIFT;
  const RS=ivResample(pts,0.008),n=RS.pts.length-1,mk={},best=0.166;t.marks.forEach(m=>{mk[m.k]=Math.round(RS.idxMap[m.i]);});
  const out=RS.pts.slice(0,n).map(q=>({p:[q.p[0]+sh[0],q.p[1]+sh[1],q.p[2]],T:q.T,L:q.L,U:q.U}));
  return IV_UNIT={N:out.length,ds:RS.total/out.length,pts:out,mk:mk,total:RS.total,margin:best};}

/* ===== INVERTED COASTER: layout, renderer, sprite bake, footprint ===== */
function ivShade(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=c=>Math.max(0,Math.min(255,Math.round(amt<0?c*(1+amt):c+(255-c)*amt)));return '#'+((1<<24)+(f(r)<<16)+(f(g)<<8)+f(b)).toString(16).slice(1);}
const ivPj=p=>[p[0],0.58*p[1]-p[2]],ivDep=p=>p[1]+0.58*p[2],IV_VIEW=[0,1,0.58],IV_LIGHT=(()=>{const v=[-0.4,0.5,0.77],m=Math.hypot(...v);return[v[0]/m,v[1]/m,v[2]/m];})();
const ivDot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],ivAdd=(a,b,k)=>[a[0]+b[0]*k,a[1]+b[1]*k,a[2]+b[2]*k];
function ivLayout(R,mode){ivLayout._c=ivLayout._c||{};const key=mode+R;if(ivLayout._c[key])return ivLayout._c[key];
  const C=ivCourse(),a=mode==='side'?0:Math.PI/3,ca=Math.cos(a),sa=Math.sin(a),rot=v=>[v[0]*ca-v[1]*sa,v[0]*sa+v[1]*ca,v[2]];
  const pts=C.pts.map(q=>({p:rot([q.p[0]*R,q.p[1]*R,q.p[2]*R]),T:rot(q.T),L:rot(q.L),U:rot(q.U)})),hexes=mode==='side'?[[-0.866*R,0],[0.866*R,0]]:[[-0.433*R,-0.435*R],[0.433*R,0.435*R]];
  return ivLayout._c[key]={N:C.N,ds:C.ds*R,pts,mk:C.mk,hexes,mode,total:C.total};}
function ivDraw(ctx,R,mode,op){
  const accent=op.accent||'#7c3aed',supp=op.support||'#1f2430',trainC=op.train||'#12151c',Ly=ivLayout(R,mode),{N,pts,mk}=Ly,ds=Ly.ds;
  const suppL=ivShade(supp,0.35),suppD=ivShade(supp,-0.3),at=(i)=>pts[((i%N)+N)%N];
  ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  const poly=(P,f)=>{ctx.beginPath();P.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=f;ctx.fill();ctx.strokeStyle=f;ctx.lineWidth=0.5;ctx.stroke();};
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const items=[];
  /* ground shadow of the structure */
  ctx.save();ctx.translate(R*0.03,R*0.02);ctx.beginPath();pts.forEach((q,i)=>{const x=q.p[0]+q.p[2]*0.25,y=0.58*q.p[1]+q.p[2]*0.1;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.strokeStyle='rgba(15,25,30,.07)';ctx.lineWidth=R*0.05;ctx.stroke();ctx.restore();
  /* ---- the track: a spine beam with silver rails and ties; faces lit by their world normals ---- */
  const bw=R*0.0145,bh=R*0.0105,bc=R*0.017,faceCol=n=>{const k=ivDot(n,IV_LIGHT);return ivShade(accent,-0.5+0.72*(k+1)/2);};
  for(let i=0;i<N;i++){const a=at(i),b=at(i+1),k=(ivDep(a.p)+ivDep(b.p))/2;
    items.push({k:k,f:()=>{const ca=ivAdd(a.p,a.U,bc),cb=ivAdd(b.p,b.U,bc);
      const C=(c,q,sl,su)=>ivPj(ivAdd(ivAdd(c,q.L,bw*sl),q.U,bh*su));
      const faces=[{n:[(a.U[0]+b.U[0])/2,(a.U[1]+b.U[1])/2,(a.U[2]+b.U[2])/2],P:[C(ca,a,1,1),C(ca,a,-1,1),C(cb,b,-1,1),C(cb,b,1,1)]},
        {n:[-(a.U[0]+b.U[0])/2,-(a.U[1]+b.U[1])/2,-(a.U[2]+b.U[2])/2],P:[C(ca,a,1,-1),C(ca,a,-1,-1),C(cb,b,-1,-1),C(cb,b,1,-1)]},
        {n:[(a.L[0]+b.L[0])/2,(a.L[1]+b.L[1])/2,(a.L[2]+b.L[2])/2],P:[C(ca,a,1,1),C(ca,a,1,-1),C(cb,b,1,-1),C(cb,b,1,1)]},
        {n:[-(a.L[0]+b.L[0])/2,-(a.L[1]+b.L[1])/2,-(a.L[2]+b.L[2])/2],P:[C(ca,a,-1,1),C(ca,a,-1,-1),C(cb,b,-1,-1),C(cb,b,-1,1)]}];
      faces.forEach(f=>{f.v=ivDot(f.n,IV_VIEW);});faces.filter(f=>f.v>0).sort((x,y)=>x.v-y.v).forEach(f=>poly(f.P,faceCol(f.n)));
      [1,-1].forEach(s=>line(ivPj(ivAdd(ivAdd(ca,a.L,(bw+R*0.003)*s),a.U,-bh*0.4)),ivPj(ivAdd(ivAdd(cb,b.L,(bw+R*0.003)*s),b.U,-bh*0.4)),'#cfd5df',R*0.0048));
      if(i%9===0)line(ivPj(ivAdd(ivAdd(ca,a.L,bw+R*0.004),a.U,-bh*0.4)),ivPj(ivAdd(ivAdd(ca,a.L,-(bw+R*0.004)),a.U,-bh*0.4)),'rgba(25,28,38,.7)',R*0.0035);}});}
  /* ---- supports: black tubular bents beside the train, with rungs and braces; lateral towers at the loop and the cobra ---- */
  const lat=q=>{const m=Math.hypot(q.T[0],q.T[1]);return m>0.3?[-q.T[1]/m,q.T[0]/m,0]:[q.L[0],q.L[1],0];};
  const bents=[];{let acc=0;for(let i=0;i<N;i++){acc+=ds;const q=pts[i],top=ivAdd(q.p,q.U,R*0.034),z=top[2];if(z<R*0.07)continue;const sl=Math.abs(at(i+1).p[2]-at(i-1).p[2])/(2*ds),spc=sl>0.5?R*0.27:sl>0.15?R*0.3:R*0.36;if(acc<spc)continue;acc=0;bents.push({i,wide:false});}}
  const addTower=(i0,i1,fr)=>{fr.forEach(f=>{const i=Math.round(i0+(i1-i0)*f);bents.push({i,wide:true});});};
  addTower(mk.loopA,mk.loopB,[0.2,0.5,0.8]);addTower(mk.cobraA,mk.cobraB,[0.2,0.5,0.8]);
  const tube=(a,b,w)=>{line(a,b,suppD,w*1.35);line(a,b,supp,w);line([a[0]-w*0.22,a[1]],[b[0]-w*0.22,b[1]],suppL,w*0.26);};
  bents.forEach(bt=>{const q=pts[bt.i],lh=lat(q),top=ivAdd(q.p,q.U,R*0.034),z=top[2];if(z<R*0.07)return;const wb=bt.wide?R*0.12:R*0.075;
    const topL=ivAdd(top,lh,wb),topR=ivAdd(top,lh,-wb),footL=[topL[0],topL[1],0],footR=[topR[0],topR[1],0];
    items.push({k:ivDep(footL)/2+ivDep(footR)/2+0.29*z-0.0005,f:()=>{
      [footL,footR].forEach(ft=>{ctx.fillStyle='rgba(60,66,82,.4)';ctx.beginPath();ctx.ellipse(ft[0],0.58*ft[1],R*0.02,R*0.009,0,0,7);ctx.fill();});
      const lv=Math.max(1,Math.round(z/(R*0.13))),wd=bt.wide?R*0.013:R*0.0115,atf=(ft,tp,t)=>ivPj([ft[0]+(tp[0]-ft[0])*t,ft[1]+(tp[1]-ft[1])*t,tp[2]*t]);
      tube(ivPj(footL),ivPj(topL),wd);tube(ivPj(footR),ivPj(topR),wd);
      for(let m=1;m<=lv;m++){const t=m/lv*0.98;line(atf(footL,topL,t),atf(footR,topR,t),suppL,R*0.0045);}
      if(z>R*0.2)for(let m=0;m<lv;m++){const t0=m/lv*0.98,t1=(m+1)/lv*0.98,d=m%2===0;line(atf(d?footL:footR,d?topL:topR,t0),atf(d?footR:footL,d?topR:topL,t1),suppL,R*0.0038);}
      line(ivPj(topL),ivPj(topR),suppD,R*0.014);line(ivPj(topL),ivPj(topR),supp,R*0.0095);
      line(ivPj(top),ivPj(ivAdd(q.p,q.U,R*0.012)),supp,R*0.008);}});});
  /* ---- trains: cars hang on the -U side of the track, so in the loop they ride the outside of the circle ---- */
  const car=(ci,col,sh)=>{const q=pts[((ci%N)+N)%N],T=q.T,L=q.L,U=q.U,P0=q.p,len=R*0.052;
    items.push({k:ivDep(P0)+0.004,f:()=>{
      const sg=(dz)=>ivAdd(P0,U,-dz);
      /* carriage (dark) straddling the rails, then the seat bar and the shell */
      const cA=ivPj(ivAdd(sg(R*0.004),T,-len*0.42)),cB=ivPj(ivAdd(sg(R*0.004),T,len*0.42));line(cA,cB,'#0b0d12',R*0.03);line(cA,cB,'#2a2f3b',R*0.02);
      const bA=ivPj(ivAdd(sg(R*0.03),L,R*0.044)),bB=ivPj(ivAdd(sg(R*0.03),L,-R*0.044));line(ivPj(sg(R*0.01)),ivPj(sg(R*0.03)),'#0b0d12',R*0.012);line(bA,bB,col,R*0.012);line(bA,bB,ivShade(col,0.25),R*0.004);
      const cols=['#3b82f6','#ef4444','#f59e0b','#22c55e','#e879f9','#fbbf24'],hair=['#2a1a10','#6a3a1a','#e8c84a','#3a2418'];
      [-0.027,-0.009,0.009,0.027].forEach((o,k)=>{const base=ivAdd(sg(R*0.035),L,R*o),head=ivAdd(sg(R*0.03),L,R*o),hip=ivAdd(sg(R*0.056),L,R*o),knee=ivAdd(ivAdd(sg(R*0.072),L,R*o),T,R*0.012),foot=ivAdd(ivAdd(sg(R*0.09),L,R*o),T,R*0.004);
        const sh=cols[(ci+k+sh_off(ci))%cols.length],hp=ivPj(hip);line(ivPj(base),hp,sh,R*0.0105);
        line(hp,ivPj(knee),'#1e293b',R*0.0065);line(ivPj(knee),ivPj(foot),'#1e293b',R*0.0065);
        const hd=ivPj(ivAdd(head,U,R*0.002));ctx.fillStyle='#fde4c8';ctx.beginPath();ctx.arc(hd[0],hd[1],R*0.0085,0,7);ctx.fill();ctx.fillStyle=hair[(ci+k)%4];ctx.beginPath();ctx.arc(hd[0],hd[1]+(U[2]>0?-R*0.002:R*0.002),R*0.0075,U[2]>0?Math.PI:0,U[2]>0?0:Math.PI);ctx.fill();});}});};
  const sh_off=ci=>0;
  const place=(headIdx,ncars,col)=>{const step=Math.round(R*0.056/ds)||1;for(let c=0;c<ncars;c++)car(headIdx-c*step,col,0);};
  place(mk.stEnd-4,6,trainC);place(Math.round((mk.liftA+mk.liftB)/2)+8,6,trainC);place(Math.round(mk.loopA+(mk.loopB-mk.loopA)*0.5)+20,5,trainC);
  /* ---- the station: a low platform with a canopy beside the track ---- */
  {const i0=4,i1=mk.stEnd-2,g0=pts[i0],g1=pts[i1],mid=pts[Math.round((i0+i1)/2)],lh=lat(mid),sgn=-1,pf=(g,off,z)=>ivPj([g.p[0]+lh[0]*off*sgn,g.p[1]+lh[1]*off*sgn,z]);
    items.push({k:ivDep(g0.p)+R*0.12,f:()=>{const o0=R*0.075,o1=R*0.2;poly([pf(g0,o0,R*0.03),pf(g1,o0,R*0.03),pf(g1,o1,R*0.03),pf(g0,o1,R*0.03)],'#d5dbe4');poly([pf(g0,o1,R*0.03),pf(g1,o1,R*0.03),pf(g1,o1,0),pf(g0,o1,0)],'#8f9bad');poly([pf(g0,o0,R*0.03),pf(g1,o0,R*0.03),pf(g1,o0,0),pf(g0,o0,0)],'#aab4c4');
      [0,0.5,1].forEach(t=>{const g={p:[g0.p[0]+(g1.p[0]-g0.p[0])*t,g0.p[1]+(g1.p[1]-g0.p[1])*t,g0.p[2]]};line(pf(g,o1-R*0.01,R*0.03),pf(g,o1-R*0.01,R*0.2),'#e8ecf2',R*0.006);});
      poly([pf(g0,o0,R*0.2),pf(g1,o0,R*0.2),pf(g1,o1+R*0.02,R*0.2),pf(g0,o1+R*0.02,R*0.2)],ivShade(accent,0.1));line(pf(g0,o1+R*0.02,R*0.2),pf(g1,o1+R*0.02,R*0.2),ivShade(accent,-0.4),R*0.01);line(pf(g0,o0,R*0.2),pf(g1,o0,R*0.2),ivShade(accent,-0.4),R*0.008);}});}
  items.sort((a,b)=>a.k-b.k).forEach(it=>it.f());ctx.restore();}
function ivBounds(R,mode){const Ly=ivLayout(R,mode);let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;Ly.pts.forEach(q=>{const s=ivPj(q.p);x0=Math.min(x0,s[0]-R*0.15);x1=Math.max(x1,s[0]+R*0.15);y0=Math.min(y0,s[1]-R*0.1);y1=Math.max(y1,s[1]+R*0.13);const g=ivPj([q.p[0],q.p[1],0]);y1=Math.max(y1,g[1]+R*0.06);});return[x0,x1,y0,y1];}
function ivSprite(R,mode,dir,opts,scale){opts=opts||{};ivSprite._c=ivSprite._c||{};const sc=scale||getBakeScale(),key=[mode,dir,Math.round(R*sc),R,opts.accent,opts.support,opts.train,sc].join('|');if(ivSprite._c[key])return ivSprite._c[key];
  const[x0,x1,y0,y1]=ivBounds(R,mode),mg=R*0.1,W=Math.ceil(x1-x0+2*mg),H=Math.ceil(y1-y0+2*mg),ox=Math.ceil(-x0+mg),oy=Math.ceil(-y0+mg),cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);g.save();
  const flip=dir==='NE-SW'||dir==='E-W';if(flip){g.translate(W,0);g.scale(-1,1);}g.translate(ox,oy);ivDraw(g,R,mode,opts);g.restore();
  return ivSprite._c[key]={canvas:cv,ox:flip?W-ox:ox,oy:oy,w:W,h:H};}

/* ===== API ===== */
function drawInvertedCoasterSide(ctx,cx,cy,R,o){o=o||{};const s=ivSprite(R,'side',o.flip?'E-W':'W-E',o,o.scale);ctx.drawImage(s.canvas,cx-s.ox,cy-s.oy,s.w,s.h);}
function drawInvertedCoasterDiag(ctx,cx,cy,R,o){o=o||{};const s=ivSprite(R,'diag',o.dir==='NE-SW'?'NE-SW':'NW-SE',o,o.scale);ctx.drawImage(s.canvas,cx-s.ox,cy-s.oy,s.w,s.h);}
/* footprint: the two tiles and ground circles under the track, loop and cobra, for keeping land scenery off the ride (and sceneryInFront for what stands in front of it) */
function invertedCoasterFootprint(R,mode,dir){const Ly=ivLayout(R,mode),m=(dir==='NE-SW'||dir==='E-W')?-1:1,c=[];for(let i=0;i<Ly.N;i+=6)c.push({x:Ly.pts[i].p[0]*m,y:0.58*Ly.pts[i].p[1],r:R*0.12});return{tiles:Ly.hexes.map(h=>[h[0]*m,h[1]]),circles:c};}
return Object.freeze({ side: drawInvertedCoasterSide, diag: drawInvertedCoasterDiag, footprint: invertedCoasterFootprint });
})();
