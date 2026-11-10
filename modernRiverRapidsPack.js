const MODERN_RIVER_RAPIDS_SPRITE = (() => {
/* ===== MODERN RIVER RAPIDS: course geometry (world units of R; X along the hex-pair axis, Y across, Z up) =====
   One wide river laid out as a ring through both hexes: station + conveyor lift on the front lane, an elevated trough, a steep chute with a waterfall
   curtain, then the rapids run (cascades, boulders) along the back lane, a whirlpool, and back to the station. */
const RP_SS=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
function rpHerm(K,x){let i=0;while(i<K.length-2&&x>K[i+1][0])i++;const a=K[i],b=K[i+1],dx=b[0]-a[0],t=Math.max(0,Math.min(1,(x-a[0])/dx)),t2=t*t,t3=t2*t;return(2*t3-3*t2+1)*a[1]+(t3-2*t2+t)*dx*a[2]+(-2*t3+3*t2)*b[1]+(t3-t2)*dx*b[2];}
const RP_A=u=>0.22+0.66*Math.exp(-Math.pow((Math.abs(u)-0.866)/0.5,2));
const RP_ZK=[[0,.02,0],[0.95,.02,0],[1.10,.03,.10],[1.90,.17,.17],[2.02,.175,0],[3.55,.175,0],[3.70,.165,-.4],[4.05,.03,-.5],[4.22,.02,0],[6.2832,.02,0]];
const RP_MK={stA:0.18,stB:0.62,liftA:1.10,liftB:1.90,chuteA:3.55,chuteB:4.12,casc1:4.65,casc2:5.20,whirlA:5.68,whirlB:6.22};
const RP_BOULDERS=[[4.40,0.55],[4.92,-0.5],[5.45,0.5],[4.28,-0.45]];
function rpPos(th){const u=1.28*Math.cos(th),w=RP_SS((th-4.1)/0.4)*(1-RP_SS((th-5.7)/0.4)),v=RP_A(u)*Math.sin(th)+0.055*w*Math.sin(5*th+1);return[u,v];}
function rpWidth(th){let w=0.07;w+=0.065*RP_SS((th-5.6)/0.25)*(1-RP_SS((th-6.1)/0.2));w-=0.012*RP_SS((th-3.55)/0.1)*(1-RP_SS((th-4.1)/0.1));w+=0.02*RP_SS((th-0.0)/0.05)*(1-RP_SS((th-0.7)/0.1));return w;}
function rpCourse(N){N=N||900;const P=[],W=[],TH=[];for(let i=0;i<N;i++){const th=2*Math.PI*i/N,p=rpPos(th);P.push([p[0],p[1],rpHerm(RP_ZK,th)]);W.push(rpWidth(th));TH.push(th);}
  const T=P.map((p,i)=>{const a=P[(i-1+N)%N],b=P[(i+1)%N],d=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],m=Math.hypot(d[0],d[1],d[2])||1;return[d[0]/m,d[1]/m,d[2]/m];});
  const L=T.map(t=>{const m=Math.hypot(t[0],t[1])||1;return[-t[1]/m,t[0]/m,0];});
  let tot=0;for(let i=0;i<N;i++){const a=P[i],b=P[(i+1)%N];tot+=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);}
  const mk={};for(const k in RP_MK)mk[k]=Math.round(RP_MK[k]/(2*Math.PI)*N)%N;
  return{N,ds:tot/N,P,T,L,W,TH,mk,total:tot};}
function rpHexMargin(u,v){let m=-1;for(const cu of [-0.866,0.866]){const dx=Math.abs(u-cu);if(dx<=0.866)m=Math.max(m,(1-0.5774*dx)-Math.abs(v));}return m;}


/* ===== MODERN RIVER RAPIDS: layout, renderer (back + front layers), sprite bake, footprint ===== */
function rpShade(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=c=>Math.max(0,Math.min(255,Math.round(amt<0?c*(1+amt):c+(255-c)*amt)));return '#'+((1<<24)+(f(r)<<16)+(f(g)<<8)+f(b)).toString(16).slice(1);}
function rpMul(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const rpPj=p=>[p[0],0.58*p[1]-p[2]],rpDep=p=>p[1]+0.58*p[2];
let RP_UNIT=null;
function rpLayout(R,mode){rpLayout._c=rpLayout._c||{};const key=mode+R;if(rpLayout._c[key])return rpLayout._c[key];
  const C0=RP_UNIT=RP_UNIT||rpCourse(900),N=C0.N,a=mode==='side'?0:Math.PI/3,ca=Math.cos(a),sa=Math.sin(a),rot=v=>[v[0]*ca-v[1]*sa,v[0]*sa+v[1]*ca,v[2]];
  const P=C0.P.map(p=>rot([p[0]*R,p[1]*R,p[2]*R])),T=C0.T.map(rot),L=C0.L.map(rot),W=C0.W.map(w=>w*R);
  const hexes=mode==='side'?[[-0.866*R,0],[0.866*R,0]]:[[-0.433*R,-0.435*R],[0.433*R,0.435*R]];
  return rpLayout._c[key]={N,ds:C0.ds*R,P,T,L,W,mk:C0.mk,hexes,mode,rot,total:C0.total,TH:C0.TH,a,ca,sa};}
/* the scenery (bank rocks, island rocks, boulders) is generated once in unit space, then rotated and scaled */
function rpRockPalette(r){return['#929dab','#7f8a98','#a4aebb','#707b8a','#9aa5b3','#868fa0'][Math.floor(r()*6)];}
function rpRock(c,x,y,s,base,r,h){h=h||0;c.fillStyle='rgba(18,28,40,.26)';c.beginPath();c.ellipse(x+s*0.35,y+s*0.15,s*1.15,s*0.5,0,0,7);c.fill();
  const n=7,pts=[];for(let k=0;k<n;k++){const a=k/n*6.283+r()*0.4,rr=0.78+r()*0.3;pts.push([x+Math.cos(a)*s*rr,y-h-s*0.35+Math.sin(a)*s*0.62*rr]);}
  const lo=pts.map(p=>[p[0],p[1]+s*0.55]);c.fillStyle=rpShade(base,-0.3);c.beginPath();c.moveTo(pts[0][0],pts[0][1]);pts.forEach(p=>c.lineTo(p[0],p[1]));for(let k=n-1;k>=0;k--)c.lineTo(lo[k][0],lo[k][1]);c.closePath();c.fill();
  c.fillStyle=rpShade(base,0.02);c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();
  c.fillStyle='rgba(255,255,255,.2)';c.beginPath();c.ellipse(x-s*0.25,y-h-s*0.5,s*0.45,s*0.22,0,0,7);c.fill();c.fillStyle='rgba(0,0,0,.14)';c.beginPath();c.ellipse(x+s*0.38,y-h-s*0.25,s*0.4,s*0.3,0,0,7);c.fill();}
function rpScenery(){if(rpScenery._s)return rpScenery._s;const C=RP_UNIT||(RP_UNIT=rpCourse(900)),N=C.N,P=C.P,W=C.W,r=rpMul(11),out={bank:[],island:[]},mk=C.mk;
  const nearest=(u,v)=>{let m=1e9,bi=0;for(let i=0;i<N;i+=2){const d=Math.hypot(u-P[i][0],v-P[i][1])-W[i];if(d<m){m=d;bi=i;}}return{d:m,i:bi};};
  const trough=i=>i>=mk.liftA-10&&i<=mk.chuteB+10;
  for(let i=0;i<N;i+=4){if(trough(i))continue;[-1,1].forEach(sg=>{if(r()<0.1)return;if(i>=mk.stA-8&&i<=mk.stB+8&&C.L[i][1]*sg<0)return;const o=C.W[i]+0.014+0.022+r()*0.03,u=P[i][0]+C.L[i][0]*o*sg,v=P[i][1]+C.L[i][1]*o*sg;if(rpHexMargin(u,v)<0.015)return;
    out.bank.push({u:u,v:v,s:0.02+r()*0.02+(r()<0.12?0.02:0),b:rpRockPalette(r),sd:Math.floor(r()*1e6),side:sg,i:i});});}
  /* the rock island in the middle of the ring: mounds of piled boulders, scattered stones */
  const inside=(u,v)=>{let c=false;for(let i=0,j=N-1;i<N;j=i++){const a=P[i],b=P[j];if((a[1]>v)!==(b[1]>v)&&u<(b[0]-a[0])*(v-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;};
  const seeds=[];for(let n=0;n<4000&&seeds.length<40;n++){const u=-1.2+r()*2.4,v=-0.8+r()*1.6;if(!inside(u,v))continue;const nr=nearest(u,v);if(nr.d<0.075||rpHexMargin(u,v)<0.05)continue;if(seeds.some(q=>Math.hypot(q[0]-u,q[1]-v)<0.15))continue;
    const st=nr.i>=mk.stA-10&&nr.i<=mk.stB+10;if(st&&nr.d<0.32)continue;seeds.push([u,v,nr.d]);}
  seeds.forEach(([u,v,d])=>{const big=d>0.22,n=big?4+Math.floor(r()*4):1+Math.floor(r()*2);for(let k=0;k<n;k++){const a=r()*6.283,rr=r()*(big?0.075:0.04),uu=u+Math.cos(a)*rr,vv=v+Math.sin(a)*rr,lift=big?(k>2?0.045:k>0?0.02:0):0;out.island.push({u:uu,v:vv,s:(big?0.04:0.028)+r()*0.03,b:rpRockPalette(r),sd:Math.floor(r()*1e6),lift:lift});}});
  return rpScenery._s=out;}
function rpDraw(cb,cf,R,mode,op){
  const accent=op.accent||'#f8fafc',supp=op.support||'#9aa3b0',suppL=rpShade(supp,0.3),suppD=rpShade(supp,-0.35),Ly=rpLayout(R,mode),{N,P,T,L,W,mk,rot}=Ly,ds=Ly.ds;
  const wOut=accent,wIn=rpShade(accent,-0.2),rim=rpShade(accent,0.28),slab=rpShade(accent,-0.5),tw=R*0.016,hwl=R*0.03,curb=R*0.016;
  [cb,cf].forEach(c=>{c.lineJoin='round';c.lineCap='round';});
  const poly=(c,pts,fill)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle=fill;c.fill();c.strokeStyle=fill;c.lineWidth=0.6;c.stroke();};
  const line=(c,a,b,col,w)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();};
  const E=(p,l,wd,sg,zz)=>rpPj([p[0]+l[0]*wd*sg,p[1]+l[1]*wd*sg,p[2]+zz]);
  const itemsB=[],itemsF=[];
  const inTrough=i=>i>=mk.liftA&&i<=mk.chuteB,inLift=i=>i>=mk.liftA&&i<=mk.liftB,inChute=i=>i>=mk.chuteA&&i<=mk.chuteB,inWhirl=i=>i>=mk.whirlA&&i<=mk.whirlB;
  /* ground shadow of the whole ring */
  cb.save();cb.translate(R*0.03,R*0.02);cb.beginPath();P.forEach((p,i)=>{const x=p[0]+p[2]*0.28,y=0.58*p[1]+p[2]*0.12;i?cb.lineTo(x,y):cb.moveTo(x,y);});cb.closePath();cb.strokeStyle='rgba(15,25,30,.10)';cb.lineWidth=R*0.2;cb.stroke();cb.restore();
  /* ---- the river and the trough, segment by segment ---- */
  for(let i=0;i<N;i++){const j=(i+1)%N,pi=P[i],pj=P[j],li=L[i],lj=L[j],wi=W[i],wj=W[j],near=li[1]>0?1:-1,far=-near,tr=inTrough(i),lift=inLift(i),chute=inChute(i),whirl=inWhirl(i),k=(rpDep(pi)+rpDep(pj))/2;
    if(tr){
      itemsB.push({k:k,f:()=>{poly(cb,[E(pi,li,wi+tw,1,-R*0.014),E(pj,lj,wj+tw,1,-R*0.014),E(pj,lj,wj+tw,-1,-R*0.014),E(pi,li,wi+tw,-1,-R*0.014)],slab);
        poly(cb,[E(pi,li,wi,far,0),E(pj,lj,wj,far,0),E(pj,lj,wj,far,hwl),E(pi,li,wi,far,hwl)],wIn);poly(cb,[E(pi,li,wi,far,hwl),E(pj,lj,wj,far,hwl),E(pj,lj,wj+tw,far,hwl),E(pi,li,wi+tw,far,hwl)],rim);
        if(lift){poly(cb,[E(pi,li,wi,1,R*0.006),E(pj,lj,wj,1,R*0.006),E(pj,lj,wj,-1,R*0.006),E(pi,li,wi,-1,R*0.006)],'#2f353e');line(cb,E(pi,li,wi*0.92,1,R*0.008),E(pj,lj,wj*0.92,1,R*0.008),'#444c57',R*0.005);line(cb,E(pi,li,wi*0.92,-1,R*0.008),E(pj,lj,wj*0.92,-1,R*0.008),'#444c57',R*0.005);if(i%3===0)line(cb,E(pi,li,wi*0.85,1,R*0.01),E(pi,li,wi*0.85,-1,R*0.01),'#6a7380',R*0.0045);}
        else{poly(cb,[E(pi,li,wi,1,R*0.006),E(pj,lj,wj,1,R*0.006),E(pj,lj,wj,-1,R*0.006),E(pi,li,wi,-1,R*0.006)],(i%9<4)?'#58b0de':'#46a2d2');if(chute&&i%4===0){for(let q=-2;q<=2;q++)line(cb,E(pi,li,wi*q*0.38,1,R*0.012),E(pj,lj,wj*q*0.38,1,R*0.012),'rgba(255,255,255,.75)',R*0.0045);}}}});
      itemsF.push({k:k,f:()=>{poly(cf,[E(pi,li,wi+tw,near,0),E(pj,lj,wj+tw,near,0),E(pj,lj,wj+tw,near,hwl),E(pi,li,wi+tw,near,hwl)],wOut);poly(cf,[E(pi,li,wi,near,hwl),E(pj,lj,wj,near,hwl),E(pj,lj,wj+tw,near,hwl),E(pi,li,wi+tw,near,hwl)],rim);}});
    }else{
      itemsB.push({k:k-0.002,f:()=>{const base=whirl?'#2f93cc':(i%11<4?'#4eaee0':'#3fa0d6');poly(cb,[E(pi,li,wi,1,R*0.004),E(pj,lj,wj,1,R*0.004),E(pj,lj,wj,-1,R*0.004),E(pi,li,wi,-1,R*0.004)],base);
        if(i%17===0)line(cb,E(pi,li,wi*0.6,1,R*0.006),E(pj,lj,wj*0.6,1,R*0.006),'rgba(255,255,255,.28)',R*0.003);
        poly(cb,[E(pi,li,wi,far,R*0.004),E(pj,lj,wj,far,R*0.004),E(pj,lj,wj+curb,far,R*0.012),E(pi,li,wi+curb,far,R*0.012)],accent);}});
      itemsF.push({k:k,f:()=>{poly(cf,[E(pi,li,wi,near,R*0.004),E(pj,lj,wj,near,R*0.004),E(pj,lj,wj+curb,near,R*0.012),E(pi,li,wi+curb,near,R*0.012)],accent);}});
    }}
  /* ---- cascades: rows of white standing waves across the channel; whirlpool spirals; the foot of the chute ---- */
  [mk.casc1,mk.casc2].forEach(c0=>{for(let q=-3;q<=3;q++){const i=(c0+q*5+N)%N,p=P[i],l=L[i],w=W[i];itemsB.push({k:rpDep(p)+0.003,f:()=>{cb.strokeStyle='rgba(255,255,255,.82)';cb.lineWidth=R*0.0055;cb.beginPath();for(let s=-1;s<=1.001;s+=0.25){const pt=E([p[0]+Math.abs(s)*0,p[1],p[2]],l,w*0.92*s,1,R*0.008+R*0.004*(1-Math.abs(s)));s===-1?cb.moveTo(pt[0],pt[1]):cb.lineTo(pt[0],pt[1]);}cb.stroke();cb.fillStyle='rgba(255,255,255,.55)';[-0.6,0,0.55].forEach(s=>{const pt=E(p,l,w*s,1,R*0.012);cb.beginPath();cb.ellipse(pt[0],pt[1],R*0.016,R*0.007,0,0,7);cb.fill();});}});}});
  {const mid=Math.round((mk.whirlA+mk.whirlB)/2),p=P[mid],c0=rpPj([p[0],p[1],p[2]+R*0.006]);itemsB.push({k:rpDep(p)+0.002,f:()=>{const rr=R*0.085;cb.fillStyle='rgba(20,80,130,.45)';cb.beginPath();cb.ellipse(c0[0],c0[1],rr*0.3,rr*0.17,0,0,7);cb.fill();cb.strokeStyle='rgba(255,255,255,.7)';cb.lineWidth=R*0.0055;for(let a=0;a<3;a++){cb.beginPath();for(let t=0;t<=1.001;t+=0.05){const ang=a*2.094+t*3.3,rad=rr*(0.25+0.75*t);const x=c0[0]+Math.cos(ang)*rad,y=c0[1]+Math.sin(ang)*rad*0.58;t===0?cb.moveTo(x,y):cb.lineTo(x,y);}cb.stroke();}}});}
  {const p=P[mk.chuteB],c0=rpPj([p[0],p[1],p[2]+R*0.01]);itemsB.push({k:rpDep(p)+0.004,f:()=>{const r=rpMul(5);for(let n=0;n<14;n++){const q=[c0[0]+(r()-0.5)*R*0.14,c0[1]-r()*R*0.07];cb.fillStyle='rgba(255,255,255,'+(0.55+r()*0.3)+')';cb.beginPath();cb.arc(q[0],q[1],R*(0.012+r()*0.018),0,7);cb.fill();}}});}
  /* ---- mid-river boulders, each with a foam collar and a wake ---- */
  RP_BOULDERS.forEach(([th,fr])=>{const i=Math.round(th/(2*Math.PI)*N)%N,p=P[i],l=L[i],w=W[i],q=[p[0]+l[0]*fr*w,p[1]+l[1]*fr*w,p[2]],r=rpMul(i+3),base=rpRockPalette(r),near=l[1]*fr>0;
    (near?itemsF:itemsB).push({k:rpDep(q)+0.01,f:()=>{const c=near?cf:cb,s=rpPj([q[0],q[1],q[2]+R*0.006]);c.fillStyle='rgba(255,255,255,.75)';c.beginPath();c.ellipse(s[0],s[1],R*0.062,R*0.032,0,0,7);c.fill();for(let n=0;n<3;n++){const d=rpPj([q[0]+T[i][0]*R*(0.05+n*0.035),q[1]+T[i][1]*R*(0.05+n*0.035),q[2]+R*0.008]);c.fillStyle='rgba(255,255,255,'+(0.55-n*0.14)+')';c.beginPath();c.ellipse(d[0],d[1],R*(0.03-n*0.005),R*0.012,0,0,7);c.fill();}rpRock(c,s[0],s[1],R*0.04,base,r,0);}});});
  /* ---- rocks: along both banks and on the island, classified by their place relative to the nearest stretch of river ---- */
  const S=rpScenery();const toW=(u,v)=>{const w=rot([u*R,v*R,0]);return w;};
  const nearestIdx=(x,y)=>{let m=1e18,bi=0;for(let i=0;i<N;i+=2){const d=(x-P[i][0])*(x-P[i][0])+(y-P[i][1])*(y-P[i][1]);if(d<m){m=d;bi=i;}}return bi;};
  const place=(o,isBank)=>{const w=toW(o.u,o.v),i=nearestIdx(w[0],w[1]),front=w[1]>P[i][1]+R*0.02,s=R*o.s,pt=rpPj([w[0],w[1],0]),r=rpMul(o.sd);(front?itemsF:itemsB).push({k:rpDep(w),f:()=>{rpRock(front?cf:cb,pt[0],pt[1],s,o.b,r,(o.lift||0)*R);}});};
  S.bank.forEach(o=>place(o,true));S.island.forEach(o=>place(o,false));
  /* ---- supports under the trough ---- */
  const tube=(c,a,b,w)=>{line(c,a,b,suppD,w*1.35);line(c,a,b,supp,w);line(c,[a[0]-w*0.2,a[1]],[b[0]-w*0.2,b[1]],suppL,w*0.25);};
  const bents=[];{let acc=0;for(let i=0;i<N;i++){acc+=ds;const z=P[i][2];if(!inTrough(i)||z<R*0.075)continue;const sl=Math.abs(P[(i+1)%N][2]-P[(i-1+N)%N][2])/(2*ds),spc=sl>0.2?R*0.12:R*0.22;if(acc<spc)continue;acc=0;
    const p=P[i],l=L[i],w=W[i]+tw*0.6,wg=w+tw+R*0.02,top=[[p[0]+l[0]*w,p[1]+l[1]*w,z-R*0.024],[p[0]-l[0]*w,p[1]-l[1]*w,z-R*0.024]],feet=[[p[0]+l[0]*wg,p[1]+l[1]*wg,0],[p[0]-l[0]*wg,p[1]-l[1]*wg,0]];bents.push({i,top,feet,z});}}
  bents.forEach(b=>{itemsB.push({k:(rpDep(b.feet[0])+rpDep(b.feet[1]))/2+0.29*b.z,f:()=>{const z=b.z,lv=Math.max(1,Math.round(z/(R*0.07))),F=b.feet,Tp=b.top,wd=R*0.011;for(let q=0;q<2;q++){cb.fillStyle='rgba(70,76,92,.4)';cb.beginPath();cb.ellipse(F[q][0],0.58*F[q][1],R*0.016,R*0.007,0,0,7);cb.fill();}
    const at=(q,t)=>rpPj([F[q][0]+(Tp[q][0]-F[q][0])*t,F[q][1]+(Tp[q][1]-F[q][1])*t,Tp[q][2]*t]);for(let q=0;q<2;q++)tube(cb,rpPj(F[q]),rpPj(Tp[q]),wd);
    for(let m=1;m<=lv;m++){const t=m/lv*0.97;line(cb,at(0,t),at(1,t),suppL,R*0.0042);}for(let m=0;m<lv;m++){const t0=m/lv*0.97,t1=(m+1)/lv*0.97,d=m%2===0;line(cb,at(d?0:1,t0),at(d?1:0,t1),suppL,R*0.0036);}
    line(cb,rpPj(Tp[0]),rpPj(Tp[1]),suppD,R*0.013);line(cb,rpPj(Tp[0]),rpPj(Tp[1]),supp,R*0.009);}});});
  /* ---- the station: a platform on the island side with an accent canopy, and a little house in front ---- */
  {const i0=mk.stA,i1=mk.stB,g0=P[i0],g1=P[i1],mid=Math.round((i0+i1)/2),l=L[mid],w=W[mid]+curb,sg=l[1]>0?-1:1;const pf=(g,off,z)=>rpPj([g[0]+l[0]*off*sg,g[1]+l[1]*off*sg,z]);
    itemsB.push({k:rpDep(g0)+R*0.05,f:()=>{poly(cb,[pf(g0,w,R*0.036),pf(g1,w,R*0.036),pf(g1,w+R*0.12,R*0.036),pf(g0,w+R*0.12,R*0.036)],'#e3e8ef');poly(cb,[pf(g0,w+R*0.12,R*0.036),pf(g1,w+R*0.12,R*0.036),pf(g1,w+R*0.12,0),pf(g0,w+R*0.12,0)],'#9aa6b8');for(let k=1;k<7;k++){const t=k/7,g=[g0[0]+(g1[0]-g0[0])*t,g0[1]+(g1[1]-g0[1])*t,g0[2]];line(cb,pf(g,w+R*0.004,R*0.0365),pf(g,w+R*0.116,R*0.0365),'rgba(120,130,150,.35)',R*0.002);}}});
    itemsB.push({k:rpDep(g1)+R*0.3,f:()=>{[0,0.5,1].forEach(t=>{const g=[g0[0]+(g1[0]-g0[0])*t,g0[1]+(g1[1]-g0[1])*t,g0[2]];line(cb,pf(g,w+R*0.105,R*0.036),pf(g,w+R*0.105,R*0.15),'#e8ecf2',R*0.006);});poly(cb,[pf(g0,w-R*0.01,R*0.15),pf(g1,w-R*0.01,R*0.15),pf(g1,w+R*0.15,R*0.15),pf(g0,w+R*0.15,R*0.15)],rpShade(accent,0.08));line(cb,pf(g0,w+R*0.15,R*0.15),pf(g1,w+R*0.15,R*0.15),rpShade(accent,-0.4),R*0.01);line(cb,pf(g0,w-R*0.01,R*0.15),pf(g1,w-R*0.01,R*0.15),rpShade(accent,-0.4),R*0.01);}});
    /* ticket house on the front bank */
    const p=P[mid],q=[p[0]-l[0]*sg*(W[mid]+R*0.2),p[1]-l[1]*sg*(W[mid]+R*0.2),0],hx=R*0.09,hy=R*0.055,hz=R*0.07,cs=Math.cos(Ly.a),sn=Math.sin(Ly.a),Q=(a,b,z)=>rpPj([q[0]+a*cs-b*sn,q[1]+a*sn+b*cs,z]);
    itemsF.push({k:rpDep(q)+0.02,f:()=>{poly(cf,[Q(-hx,hy,0),Q(hx,hy,0),Q(hx,hy,hz),Q(-hx,hy,hz)],'#d9dde4');poly(cf,[Q(hx,-hy,0),Q(hx,hy,0),Q(hx,hy,hz),Q(hx,-hy,hz)],'#aeb6c2');poly(cf,[Q(-hx,hy,0),Q(hx,hy,0),Q(hx,hy,hz),Q(-hx,hy,hz)].slice(0,0),'#fff');
      const ap=hz*1.7;poly(cf,[Q(-hx*1.15,-hy*1.2,hz),Q(hx*1.15,-hy*1.2,hz),Q(hx*1.15,hy*1.2,hz),Q(-hx*1.15,hy*1.2,hz)].map((p2,ii)=>p2),rpShade(accent,0.1));line(cf,Q(-hx*1.15,hy*1.2,hz),Q(hx*1.15,hy*1.2,hz),rpShade(accent,-0.4),R*0.008);line(cf,Q(hx*1.15,hy*1.2,hz),Q(hx*1.15,-hy*1.2,hz),rpShade(accent,-0.4),R*0.008);
      poly(cf,[Q(-hx*0.5,hy+0.001,0),Q(-hx*0.1,hy+0.001,0),Q(-hx*0.1,hy+0.001,hz*0.7),Q(-hx*0.5,hy+0.001,hz*0.7)],'#5d6a7a');poly(cf,[Q(hx*0.2,hy+0.001,hz*0.3),Q(hx*0.7,hy+0.001,hz*0.3),Q(hx*0.7,hy+0.001,hz*0.75),Q(hx*0.2,hy+0.001,hz*0.75)],'#9fd6f0');}});}
  itemsB.sort((a,b)=>a.k-b.k).forEach(it=>it.f());itemsF.sort((a,b)=>a.k-b.k).forEach(it=>it.f());}
function rpBounds(R,mode){const Ly=rpLayout(R,mode);let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;const add=(x,y)=>{x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);};Ly.P.forEach((p,i)=>{const s=rpPj(p),w=Ly.W[i]+R*0.12;add(s[0]-w,s[1]-w*0.6-R*0.14);add(s[0]+w,s[1]+w*0.6+R*0.1);});return[x0,x1,y0,y1];}
function rpSprite(R,mode,dir,opts,scale){opts=opts||{};rpSprite._c=rpSprite._c||{};const sc=scale||getBakeScale(),key=[mode,dir,Math.round(R*sc),R,opts.accent,opts.support,sc].join('|');if(rpSprite._c[key])return rpSprite._c[key];
  const[x0,x1,y0,y1]=rpBounds(R,mode),mg=R*0.12,W=Math.ceil(x1-x0+2*mg),H=Math.ceil(y1-y0+2*mg),ox=Math.ceil(-x0+mg),oy=Math.ceil(-y0+mg),mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);return cv;};
  const back=mk(),front=mk(),gb=back.getContext('2d'),gf=front.getContext('2d'),flip=dir==='NE-SW'||dir==='E-W';
  [gb,gf].forEach(g=>{g.scale(sc,sc);if(flip){g.translate(W,0);g.scale(-1,1);}g.translate(ox,oy);});
  rpDraw(gb,gf,R,mode,opts);
  return rpSprite._c[key]={back:back,front:front,ox:flip?W-ox:ox,oy:oy,w:W,h:H};}

/* ===== animated rafts + current: drawn between the baked back and front layers ===== */
let RP_TIME=null;
function rpTiming(){if(RP_TIME)return RP_TIME;const C=RP_UNIT||(RP_UNIT=rpCourse(900)),N=C.N,ds=C.ds,mk=C.mk,T=[0];
  for(let i=1;i<N;i++){const z=C.P[i][2];let v;
    if(i>=mk.stA&&i<mk.liftA)v=0.2;else if(i>=mk.liftA&&i<=mk.liftB)v=0.17;else if(i>mk.liftB&&i<mk.chuteA)v=0.3;
    else if(i>=mk.chuteA&&i<mk.chuteB+40){const s=(i-mk.chuteA)*ds;v=0.3+1.0*Math.sqrt(Math.max(0,(0.175-z)/0.16))*(i<mk.chuteB?1:Math.exp(-(i-mk.chuteB)*ds*6));}
    else if(i>=mk.whirlA&&i<=mk.whirlB)v=0.22;else v=0.36+0.06*Math.sin(i*0.09);
    T.push(T[i-1]+ds/Math.max(0.2,v));}
  const total=T[N-1]+ds/0.3;return RP_TIME={T,total,N};}
function rpIdxAt(tt){const S=rpTiming(),T=S.T;tt=((tt%S.total)+S.total)%S.total;let lo=0,hi=T.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(T[m]<=tt)lo=m;else hi=m;}return lo+(tt-T[lo])/Math.max(1e-6,T[hi]-T[lo]);}
function rpAnimDraw(ctx,cx,cy,R,mode,dir,o){o=o||{};const Ly=rpLayout(R,mode),{N,P,L,W,mk}=Ly,S=rpTiming(),fl=(dir==='NE-SW'||dir==='E-W')?-1:1,t=((o.t===undefined||o.t===null)?3.0:o.t)*(o.speed||1);
  const Pt=(p,dz)=>[cx+fl*p[0],cy+0.58*p[1]-(p[2]+(dz||0))];
  const inLift=i=>i>=mk.liftA&&i<=mk.liftB;
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  /* the current: dashes riding the water at the same speeds as the rafts (fast down the chute, slow in the whirlpool) */
  if(o.current!==false){ctx.strokeStyle='rgba(255,255,255,.72)';ctx.lineWidth=R*0.0052;const nd=26;for(let lane=0;lane<3;lane++)for(let m=0;m<nd;m++){const fi=rpIdxAt(t*0.9+(m+lane*0.37)*S.total/nd),i=Math.floor(fi)%N;if(inLift(i)||inLift((i+4)%N))continue;const off=(lane-1)*0.55,j=(i+3)%N,a=Pt([P[i][0]+L[i][0]*off*W[i],P[i][1]+L[i][1]*off*W[i],P[i][2]],R*0.008),b=Pt([P[j][0]+L[j][0]*off*W[j],P[j][1]+L[j][1]*off*W[j],P[j][2]],R*0.008);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}}
  /* the rafts */
  if(o.rafts!==false){const nr=o.count||6,list=[];
    for(let k=0;k<nr;k++){const tt=t+k*S.total/nr,fi=rpIdxAt(tt),i=Math.floor(fi)%N,fr=fi-Math.floor(fi),j=(i+1)%N,p=[P[i][0]+(P[j][0]-P[i][0])*fr,P[i][1]+(P[j][1]-P[i][1])*fr,P[i][2]+(P[j][2]-P[i][2])*fr],wet=(i>=mk.casc1-22&&i<=mk.casc1+22)||(i>=mk.casc2-22&&i<=mk.casc2+22)||(i>=mk.chuteB-6&&i<=mk.chuteB+30),lifted=inLift(i);
      const bob=wet?0.006*R*Math.sin(tt*9+k):0.002*R*Math.sin(tt*2+k),spin=(lifted?0.1:0.7)*tt+k*1.3+(wet?0.5*Math.sin(tt*3+k):0);
      list.push({k,p,i,wet,bob,spin,y:P[i][1]});}
    list.sort((a,b)=>a.y-b.y);
    list.forEach(rf=>{const c=Pt(rf.p,R*0.016+rf.bob),rr=R*0.05;
      ctx.fillStyle='rgba(15,30,45,.3)';ctx.beginPath();ctx.ellipse(c[0]+R*0.006,c[1]+R*0.016,rr*1.1,rr*0.62,0,0,7);ctx.fill();
      if(rf.wet){ctx.fillStyle='rgba(255,255,255,.7)';ctx.beginPath();ctx.ellipse(c[0],c[1]+R*0.012,rr*1.28,rr*0.74,0,0,7);ctx.fill();}
      ctx.fillStyle='#232c3a';ctx.beginPath();ctx.ellipse(c[0],c[1],rr,rr*0.58,0,0,7);ctx.fill();
      ctx.fillStyle='#3a4658';ctx.beginPath();ctx.ellipse(c[0],c[1]-rr*0.1,rr*0.93,rr*0.5,0,0,7);ctx.fill();
      ctx.fillStyle='#566781';ctx.beginPath();ctx.ellipse(c[0],c[1]-rr*0.12,rr*0.66,rr*0.34,0,0,7);ctx.fill();
      const riders=[];for(let q=0;q<6;q++){const a=rf.spin+q*Math.PI/3;riders.push({x:c[0]+Math.cos(a)*rr*0.66,y:c[1]+Math.sin(a)*rr*0.38-R*0.004,s:Math.sin(a),q});}
      riders.sort((a,b)=>a.s-b.s).forEach(r=>{ctx.fillStyle=['#3b82f6','#ef4444','#22c55e','#f59e0b','#a855f7','#14b8a6'][(r.q+rf.k)%6];ctx.fillRect(r.x-R*0.0075,r.y-R*0.012,R*0.015,R*0.014);ctx.fillStyle='#fde4c8';ctx.beginPath();ctx.arc(r.x,r.y-R*0.017,R*0.0085,0,7);ctx.fill();ctx.fillStyle=['#2a1a10','#6a3a1a','#e8c84a','#3a2418'][(r.q+rf.k)%4];ctx.beginPath();ctx.arc(r.x,r.y-R*0.0195,R*0.0078,Math.PI,0);ctx.fill();});
      ctx.fillStyle='#c8d0dc';ctx.beginPath();ctx.ellipse(c[0],c[1]-rr*0.1,rr*0.12,rr*0.07,0,0,7);ctx.fill();});}
  ctx.restore();}


/* ===== API ===== */
function rpDrawAll(ctx,cx,cy,R,mode,dir,o){const s=rpSprite(R,mode,dir,o,o.scale);ctx.drawImage(s.back,cx-s.ox,cy-s.oy,s.w,s.h);rpAnimDraw(ctx,cx,cy,R,mode,dir,o);ctx.drawImage(s.front,cx-s.ox,cy-s.oy,s.w,s.h);}
function drawRapidsSide(ctx,cx,cy,R,o){o=o||{};rpDrawAll(ctx,cx,cy,R,'side',o.flip?'E-W':'W-E',o);}
function drawRapidsDiag(ctx,cx,cy,R,o){o=o||{};rpDrawAll(ctx,cx,cy,R,'diag',o.dir==='NE-SW'?'NE-SW':'NW-SE',o);}
function rapidsCycle(){return rpTiming().total;}
/* footprint: the two tiles and ground circles along the river and the island, for keeping land scenery off the ride (and sceneryInFront for what stands in front) */
function rapidsFootprint(R,mode,dir){const Ly=rpLayout(R,mode),m=(dir==='NE-SW'||dir==='E-W')?-1:1,c=[];for(let i=0;i<Ly.N;i+=5)c.push({x:Ly.P[i][0]*m,y:0.58*Ly.P[i][1],r:R*0.14});return{tiles:Ly.hexes.map(h=>[h[0]*m,h[1]]),circles:c};}
return Object.freeze({ side: drawRapidsSide, diag: drawRapidsDiag, footprint: rapidsFootprint });
})();
