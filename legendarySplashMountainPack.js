(function () {
/* ===== LEGENDARY LOG-FLUME MOUNTAIN: terrain + flume path (local frame: u along the hex-pair axis, v across, z up; all in units of R) ===== */
function smMul(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function smRnd(i,j,s){let h=Math.imul((i*374761393+j*668265263+s*1442695041)|0,1274126177);h=(h^(h>>>13))>>>0;h=Math.imul(h,1103515245)>>>0;return(h&0xffffff)/0x1000000;}
function smVN(x,y,s){const xi=Math.floor(x),yi=Math.floor(y),fx=x-xi,fy=y-yi,ux=fx*fx*(3-2*fx),uy=fy*fy*(3-2*fy),a=smRnd(xi,yi,s),b=smRnd(xi+1,yi,s),c=smRnd(xi,yi+1,s),d=smRnd(xi+1,yi+1,s);return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy;}
function smFbm(x,y,s,o){let t=0,a=0.5,f=1;for(let k=0;k<o;k++){t+=a*smVN(x*f,y*f,s+k*17);a*=0.5;f*=2;}return t;}
const smSS=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const SM_S3=0.8660254;
const smW=(u,v)=>[u*0.5-v*SM_S3,u*SM_S3+v*0.5];
function smHerm(K,x){let i=0;while(i<K.length-2&&x>K[i+1][0])i++;const a=K[i],b=K[i+1],dx=b[0]-a[0],t=Math.max(0,Math.min(1,(x-a[0])/dx)),t2=t*t,t3=t2*t;return(2*t3-3*t2+1)*a[1]+(t3-2*t2+t)*dx*a[2]+(-2*t3+3*t2)*b[1]+(t3-t2)*dx*b[2];}
/* ---- the flume course: S-bend on the summit, the big 45° drop, a splash basin, a sweeping base curve, a tunnel into the rock ---- */
function smCatmull(P,n){const out=[];for(let i=0;i<P.length-1;i++){const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(P.length-1,i+2)];for(let k=0;k<n;k++){const t=k/n,t2=t*t,t3=t2*t;out.push([0.5*((2*p1[0])+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),0.5*((2*p1[1])+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)]);}}out.push(P[P.length-1].slice());return out;}
let SM_PATH=null;
function smPath(){if(SM_PATH)return SM_PATH;
  const pts=[];/* [u,v,z,w] */
  const top=smCatmull([[-0.08,0.36],[0.06,0.31],[0.20,0.21],[0.34,0.08],[0.42,0.02],[0.44,0.0]],24);top.forEach(p=>pts.push([p[0],p[1],0.80,0.05]));
  const dropK=[[0.44,0.80,0],[0.52,0.74,-1.1],[0.96,0.17,-1.2],[1.06,0.066,0]];
  for(let k=1;k<=60;k++){const u=0.44+0.62*k/60;pts.push([u,-0.075*smSS(0,1,k/60),smHerm(dropK,u),0.05+0.05*smSS(0.7,1,k/60)]);}
  /* splash basin, then a wide right-hand sweep around the base, then a straight into the rock */
  for(let k=1;k<=30;k++){const t=k/30;pts.push([1.06+0.12*t,-0.075-0.01*t,0.066-0.012*t,0.1]);}
  const cx=1.18,cy=-0.085-0.26,r=0.26;for(let k=1;k<=70;k++){const a=Math.PI*k/70;pts.push([cx+r*Math.sin(a)*0.92,cy+r*Math.cos(a),0.054,0.062+0.03*Math.sin(a)]);}
  const lastU=cx,lastV=cy-r;for(let k=1;k<=40;k++){pts.push([lastU-0.40*k/40,lastV,0.054,0.058]);}
  /* resample by arclength */
  const out=[];let acc=0;const ds=0.008;out.push(pts[0].slice());let carry=0;for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],d=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);let s=ds-carry;while(s<=d){const t=s/d;out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t,a[3]+(b[3]-a[3])*t]);s+=ds;}carry=d-(s-ds);}
  let iDrop=out.length-1;for(let i=1;i<out.length;i++){if(out[i][0]>=1.059&&out[i][2]<0.1){iDrop=i;break;}}
  let iTop=0;for(let i=1;i<out.length;i++){if(out[i][2]<0.795){iTop=i;break;}}
  return SM_PATH={P:out,iDrop:iDrop,iTop:iTop,ds};}
/* ---- the height field ---- */
const SM_U0=-1.76,SM_U1=1.50,SM_V0=-1.02,SM_V1=1.02,SM_D=0.02;
function smBump(u,v,cu,cv,ru,rv,h,pw){const du=(u-cu)/ru,dv=(v-cv)/rv,r2=du*du+dv*dv;if(r2>=1)return 0;return h*Math.pow(1-r2,pw||1);}
/* signed distance-ish margin inside the two-hex pair (pointy-top hexes of radius 1 at u=+-0.866) */
function smMargin(u,v){let m=-1;for(const cu of [-0.866,0.866]){const dx=Math.abs(u-cu);if(dx<=0.866)m=Math.max(m,(1-0.5774*dx)-Math.abs(v));}return m;}
function smBase(u,v){
  /* the summit massif; its front (+u) face is steeper, and it is the face the flume drops down */
  const ruU=u>0.28?0.50:0.62;let h=smBump(u,v,0.28,-0.02,ruU,0.48,0.98,1.25);
  /* stepped tiers around the summit so the flanks break into ledges instead of one sheer wall */
  h=Math.max(h,smBump(u,v,0.22,0.02,0.80,0.56,0.60,0.75));h=Math.max(h,smBump(u,v,0.30,0.0,0.96,0.70,0.30,0.6));
  /* the summit table the flume runs across */
  const tb=smBump(u,v,0.16,0.14,0.36,0.40,1,1);if(tb>0)h=Math.max(h,0.80+Math.min(0.05,tb*0.07));
  /* a tunnel lobe on the right (-v), a green knoll on the left (+v) */
  h=Math.max(h,smBump(u,v,0.62,-0.60,0.34,0.30,0.52,0.8));
  h=Math.max(h,smBump(u,v,0.62,0.58,0.26,0.26,0.40,0.8));
  /* the canyon wall: a tall, stratified ridge against the front of the show building */
  const wv=smSS(-0.52,-0.34,v)*(1-smSS(0.40,0.58,v)),wu=Math.exp(-Math.pow((u+0.50)/0.13,2));h=Math.max(h,0.52*wu*wv);
  h=Math.max(h,smBump(u,v,-0.12,0.0,0.34,0.46,0.74,0.8));
  return h*smSS(0.0,0.30,smMargin(u,v)+0.02);}
let SM_FIELD=null;
function smField(){if(SM_FIELD)return SM_FIELD;
  const nu=Math.round((SM_U1-SM_U0)/SM_D),nv=Math.round((SM_V1-SM_V0)/SM_D),H=new Float32Array((nu+1)*(nv+1)),PA=smPath(),P=PA.P;
  /* bucket the carved part of the flume (summit S-bend and the drop) */
  const B=new Map(),bs=0.1,key=(a,b)=>a*1000+b;for(let i=0;i<P.length;i++){const p=P[i],k=key(Math.floor(p[0]/bs),Math.floor(p[1]/bs));if(!B.has(k))B.set(k,[]);B.get(k).push(i);}
  for(let a=0;a<=nu;a++)for(let b=0;b<=nv;b++){const u=SM_U0+a*SM_D,v=SM_V0+b*SM_D;let h=smBase(u,v);if(h<0.004){H[a*(nv+1)+b]=0;continue;}
    /* terraces: stratified shelves with ramps between them */
    if(h>0.1){const n=smFbm(u*5+3,v*5+7,2,3),st=0.06,hh=h/st+n*0.9,f=hh-Math.floor(hh),q=(Math.floor(hh)+smSS(0.2,0.8,f))*st-n*0.9*st;h=h*0.5+q*0.5;}
    /* carve the channel and give it rock walls */
    const bi=Math.floor(u/bs),bj=Math.floor(v/bs);let best=1e9,bz=0,bw=0.05;for(let di=-2;di<=2;di++)for(let dj=-2;dj<=2;dj++){const L=B.get(key(bi+di,bj+dj));if(!L)continue;for(const i of L){const p=P[i],d=Math.hypot(u-p[0],v-p[1]);if(d<best){best=d;bz=p[2];bw=p[3];}}}
    if(best<0.3){const lift=bz+0.1*(1-smSS(0.05,0.28,best));if(h>0.5&&best<0.16)h=Math.max(h,lift);const cut=bz+0.012+0.95*Math.max(0,best-bw*0.9);if(h>cut)h=cut;}
    H[a*(nv+1)+b]=h;}
  return SM_FIELD={H,nu,nv};}

/* ===== renderer ===== */
const SM_ROCK=[[214,146,92],[226,164,106],[198,124,76],[236,184,128],[180,108,68],[208,152,104]],SM_GREEN=[[88,146,62],[70,128,56],[112,158,66],[52,112,52],[126,170,80]];
const smDepth=(u,v,z)=>{const w=smW(u,v);return w[1]+0.58*z;};
const smHex=(c,k)=>{const f=x=>Math.max(0,Math.min(255,Math.round(x*k)));return '#'+((1<<24)+(f(c[0])<<16)+(f(c[1])<<8)+f(c[2])).toString(16).slice(1);};
const smMixC=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
let SM_CELLS=null;
function smCells(){if(SM_CELLS)return SM_CELLS;const F=smField(),{H,nu,nv}=F,D=SM_D,Lw=[-0.55,-0.2,0.81],ln=Math.hypot(...Lw),cells=new Array(nu*nv).fill(null);
  for(let a=0;a<nu;a++)for(let b=0;b<nv;b++){const h00=H[a*(nv+1)+b],h10=H[(a+1)*(nv+1)+b],h01=H[a*(nv+1)+b+1],h11=H[(a+1)*(nv+1)+b+1],mx=Math.max(h00,h10,h01,h11);if(mx<0.006)continue;
    const hm=(h00+h10+h01+h11)/4,gu=((h10-h00)+(h11-h01))/(2*D),gv=((h01-h00)+(h11-h10))/(2*D),s=Math.hypot(gu,gv),nl=Math.hypot(gu,gv,1),nu_=-gu/nl,nv_=-gv/nl,nz=1/nl,nx=nu_*0.5-nv_*SM_S3,ny=nu_*SM_S3+nv_*0.5,lam=Math.max(0,(nx*Lw[0]+ny*Lw[1]+nz*Lw[2])/ln),shade=0.58+0.62*lam;
    const u=SM_U0+(a+0.5)*D,v=SM_V0+(b+0.5)*D,n1=smFbm(u*4,v*4,11,2),n2=smFbm(u*6+5,v*6,23,2),n3=smVN(u*6,v*22,3);
    let idx=Math.floor(hm*17+n1*3);idx=((idx%6)+6)%6;let col=SM_ROCK[idx].slice();col=smMixC(col,[150,88,56],Math.max(0,0.55-n3)*0.22);
    const vp=Math.max(0,Math.min(1,(1.15-s)/0.7))*(0.22+1.0*n2)*(hm>0.04?1:0.2);if(vp>0.42){const g=SM_GREEN[Math.floor(n1*5)%5];col=smMixC(col,g,Math.min(1,(vp-0.42)/0.18));}if(hm<0.09){const g=SM_GREEN[Math.floor(n1*5)%5];col=smMixC(col,g,Math.min(1,(0.09-hm)/0.05));}
    /* wet dark streaks down steep faces */if(s>1.0&&n3>0.62)col=smMixC(col,[70,40,30],0.35);
    cells[a*nv+b]={c:smHex(col,shade),h:[h00,h10,h11,h01],hm:hm,s:s};}
  return SM_CELLS={cells,nu,nv};}
function smDraw(ctx,R,op){
  op=op||{};const part={mountain:'m',building:'b'}[op.part]||'all',F=smField(),{H,nu,nv}=F,{cells}=smCells(),D=SM_D,PA=smPath(),P=PA.P;ctx.save();if(op.tx||op.ty)ctx.translate(op.tx||0,op.ty||0);ctx.lineJoin='round';ctx.lineCap='round';
  const pj=(u,v,z)=>{const w=smW(u,v);return[w[0]*R,(0.58*w[1]-z)*R];};
  const poly=(pts,fill,stroke,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=fill;ctx.lineWidth=0.7;ctx.stroke();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.004;ctx.stroke();}};
  const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const sh=(hex,k)=>{const n=parseInt(hex.slice(1),16),f=x=>Math.max(0,Math.min(255,Math.round(x*k)));return '#'+((1<<24)+(f(n>>16)<<16)+(f((n>>8)&255)<<8)+f(n&255)).toString(16).slice(1);};
  /* box helper: top, +u face (shaded) and +v face (lit) */
  const box=(u0,u1,v0,v1,z0,z1,cT,cU,cV,seam)=>{poly([pj(u0,v0,z1),pj(u1,v0,z1),pj(u1,v1,z1),pj(u0,v1,z1)],cT);poly([pj(u1,v0,z0),pj(u1,v1,z0),pj(u1,v1,z1),pj(u1,v0,z1)],cU);poly([pj(u0,v1,z0),pj(u1,v1,z0),pj(u1,v1,z1),pj(u0,v1,z1)],cV);
    if(seam){for(let v=v0+seam;v<v1-0.001;v+=seam)line(pj(u1,v,z0),pj(u1,v,z1),'rgba(40,50,30,.28)',R*0.0025);for(let u=u0+seam;u<u1-0.001;u+=seam)line(pj(u,v1,z0),pj(u,v1,z1),'rgba(40,50,30,.22)',R*0.0025);}};
  /* ---- the show building (rear hex): three blocks, depth-sorted into the grid pass at their front corners ---- */
  const wallU='#8f9a82',wallV='#bcc6ab',roof='#e8eae2',blocks=[];
  const roofTop=(u0,u1,v0,v1,z,vents)=>{const q=[pj(u0+0.02,v0+0.02,z),pj(u1-0.02,v0+0.02,z),pj(u1-0.02,v1-0.02,z),pj(u0+0.02,v1-0.02,z)];ctx.strokeStyle='rgba(120,128,112,.6)';ctx.lineWidth=R*0.006;ctx.beginPath();q.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.stroke();vents.forEach(([u,v])=>box(u,u+0.1,v,v+0.1,z,z+0.05,'#b9bdb2','#8a8f84','#a9aea2'));};
  blocks.push([-1.02,0.56,()=>{box(-1.52,-1.02,-0.60,0.56,0,0.50,roof,wallU,wallV,0.1);[0.07,0.36].forEach(z=>{line(pj(-1.019,-0.60,z),pj(-1.019,0.56,z),'rgba(60,70,50,.4)',R*0.004);line(pj(-1.52,0.561,z),pj(-1.02,0.561,z),'rgba(60,70,50,.3)',R*0.004);});[-0.5,0.4].forEach(v=>poly([pj(-1.018,v,0.5),pj(-1.018,v+0.05,0.5),pj(-1.018,v+0.07,0.12),pj(-1.018,v+0.02,0.12)],'rgba(150,100,70,.35)'));roofTop(-1.52,-1.02,-0.60,0.56,0.50,[[-1.40,-0.45],[-1.30,0.2],[-1.18,-0.1]]);
    /* roll-up service doors and a pipe run on the long face */[0.05,0.3].forEach(v=>poly([pj(-1.019,v,0),pj(-1.019,v+0.14,0),pj(-1.019,v+0.14,0.14),pj(-1.019,v,0.14)],'#6d7664'));}]);
  blocks.push([-1.02,0.68,()=>{box(-1.40,-1.02,0.56,0.68,0,0.20,'#dfe2d8','#868f7a','#b2bca2',0.09);poly([pj(-1.40,0.68,0.17),pj(-1.02,0.68,0.17),pj(-1.0,0.74,0.145),pj(-1.42,0.74,0.145)],'#c9ccc2','#8a8f84',R*0.003);[-1.3,-1.12].forEach(u=>poly([pj(u,0.681,0),pj(u+0.07,0.681,0),pj(u+0.07,0.681,0.12),pj(u,0.681,0.12)],'#5d6658'));}]);
  blocks.push([-0.62,0.56,()=>{box(-1.02,-0.62,-0.50,0.56,0,0.36,roof,sh(wallU,0.95),sh(wallV,0.97),0.1);roofTop(-1.02,-0.62,-0.50,0.56,0.36,[[-0.88,0.15]]);}]);
  /* ---- the flume trough, assigned to the cells it crosses so it is depth-sorted with the terrain ---- */
  const woodD='#6a4426',woodM='#8a5a33',woodL='#b07a46',conc='#7c776b';
  const trough=i=>{const p=P[i],q=P[i+1];let du=q[0]-p[0],dv=q[1]-p[1];const m=Math.hypot(du,dv)||1;du/=m;dv/=m;const nu_=-dv,nv_=du,w1=p[3],w2=q[3],tw=0.017,hw=0.034,E=(pp,w,sg,zz)=>pj(pp[0]+nu_*w*sg,pp[1]+nv_*w*sg,pp[2]+zz),near=(nu_*SM_S3+nv_*0.5)>0?1:-1,far=-near;
    poly([E(p,w1+tw,1,-0.012),E(q,w2+tw,1,-0.012),E(q,w2+tw,-1,-0.012),E(p,w1+tw,-1,-0.012)],conc);
    poly([E(p,w1,far,0),E(q,w2,far,0),E(q,w2,far,hw),E(p,w1,far,hw)],woodD);poly([E(p,w1,far,hw),E(q,w2,far,hw),E(q,w2+tw,far,hw),E(p,w1+tw,far,hw)],woodL);
    poly([E(p,w1,1,0.006),E(q,w2,1,0.006),E(q,w2,-1,0.006),E(p,w1,-1,0.006)],i%7<3?'#4aa3d4':'#3f98cb');
    poly([E(p,w1+tw,near,0),E(q,w2+tw,near,0),E(q,w2+tw,near,hw),E(p,w1+tw,near,hw)],woodM);poly([E(p,w1,near,hw),E(q,w2,near,hw),E(q,w2+tw,near,hw),E(p,w1+tw,near,hw)],woodL);
    if(i>=PA.iTop&&i<PA.iDrop&&i%6===0)line(E(p,w1*0.8,1,0.012),E(p,w1*0.8,-1,0.012),'rgba(255,255,255,.55)',R*0.004);};
  const bucket=new Map();const addB=(u,v,fn,key,grp)=>{const a=Math.max(0,Math.min(nu-1,Math.floor((u-SM_U0)/D))),b=Math.max(0,Math.min(nv-1,Math.floor((v-SM_V0)/D))),k=a*nv+b;if(!bucket.has(k))bucket.set(k,[]);bucket.get(k).push({fn,key,grp:grp||'m'});};
  /* things that live behind the cell grid's range (the rear hex) are drawn straight away, right after the building */
  const rnd=smMul(77);
  const hAt=(u,v)=>{const fa=(u-SM_U0)/D,fb=(v-SM_V0)/D,a=Math.floor(fa),b=Math.floor(fb);if(a<0||b<0||a>=nu||b>=nv)return 0;const x=fa-a,y=fb-b,h00=H[a*(nv+1)+b],h10=H[(a+1)*(nv+1)+b],h01=H[a*(nv+1)+b+1],h11=H[(a+1)*(nv+1)+b+1];return h00*(1-x)*(1-y)+h10*x*(1-y)+h01*(1-x)*y+h11*x*y;};
  const slopeAt=(u,v)=>{const a=Math.floor((u-SM_U0)/D),b=Math.floor((v-SM_V0)/D);if(a<0||b<0||a>=nu||b>=nv)return 0;const c=cells[a*nv+b];return c?c.s:0;};
  const dPath=(u,v)=>{let m=9;for(let i=0;i<P.length;i+=3){const d2=Math.hypot(u-P[i][0],v-P[i][1]);if(d2<m)m=d2;}return m;};
  const SHACK={u0:1.10,u1:1.36,v0:0.02,v1:0.26},POND={u:1.32,v:0.52,r:0.14};
  const inBuilding=(u,v,pad)=>u>-1.58-pad&&u<-0.58+pad&&v>-0.64-pad&&v<0.72+pad;
  const inShack=(u,v,pad)=>u>SHACK.u0-pad&&u<SHACK.u1+pad&&v>SHACK.v0-pad&&v<SHACK.v1+pad;
  const inPond=(u,v,pad)=>Math.hypot(u-POND.u,v-POND.v)<POND.r+pad;
  /* -- pond (bayou), drawn flat before everything that stands on it -- */
  if(part!=='b'){const pts=[];for(let k=0;k<28;k++){const a=k/28*6.283,rr=1+0.1*Math.sin(a*3+1)+0.05*Math.sin(a*5);pts.push(pj(POND.u+Math.cos(a)*POND.r*rr,POND.v+Math.sin(a)*POND.r*rr,0.006));}
    poly(pts.map((p,i)=>{const a=i/28*6.283,rr=1.12+0.1*Math.sin(a*3+1);return pj(POND.u+Math.cos(a)*POND.r*rr,POND.v+Math.sin(a)*POND.r*rr,0.003);}),'#5d6a3a');poly(pts,'#3f6f6a');
    const c0=pj(POND.u,POND.v,0.006);ctx.fillStyle='rgba(120,170,160,.35)';ctx.beginPath();ctx.ellipse(c0[0]-R*0.03,c0[1]-R*0.01,R*0.1,R*0.035,0,0,7);ctx.fill();
    for(let k=0;k<9;k++){const a=rnd()*6.283,rr=rnd()*POND.r*0.8,p=pj(POND.u+Math.cos(a)*rr,POND.v+Math.sin(a)*rr,0.008);ctx.fillStyle='#5a9a40';ctx.beginPath();ctx.ellipse(p[0],p[1],R*0.014,R*0.0065,0,0,7);ctx.fill();if(k%3===0){ctx.fillStyle='#f6efe0';ctx.beginPath();ctx.ellipse(p[0]+R*0.003,p[1]-R*0.002,R*0.004,R*0.003,0,0,7);ctx.fill();}}}
  blocks.forEach(([u,v,fn])=>addB(u,v,fn,-100+u,'b'));
  /* -- the flume trough, with spray at the foot of the drop -- */
  for(let i=0;i<P.length-1;i++)addB(P[i][0],P[i][1],()=>trough(i),i);
  {const i0=PA.iDrop-4;for(let k=0;k<26;k++){const i=Math.min(P.length-1,i0+Math.floor(k*0.9)),p=P[i],jx=(rnd()-0.5)*0.12,jy=(rnd()-0.5)*0.1,hgt=0.01+rnd()*0.1*(1-k/30),sz=R*(0.014+rnd()*0.018);addB(p[0],p[1],()=>{const q=pj(p[0]+jx,p[1]+jy,p[2]+hgt);ctx.fillStyle='rgba(255,255,255,'+(0.55+rnd()*0.3)+')';ctx.beginPath();ctx.arc(q[0],q[1],sz,0,7);ctx.fill();},i+1000);}
    const sp=P[PA.iDrop+4];addB(sp[0],sp[1],()=>{for(let k=0;k<10;k++){const q=pj(sp[0]+(rnd()-0.5)*0.12,sp[1]+(rnd()-0.5)*0.1,sp[2]+0.02+rnd()*0.07);ctx.fillStyle='rgba(235,247,255,.8)';ctx.beginPath();ctx.arc(q[0],q[1],R*(0.012+rnd()*0.016),0,7);ctx.fill();}},PA.iDrop+1200);}
  /* -- the tunnel mouth where the flume dives back into the rock -- */
  {const e=P[P.length-1],ut=e[0]-0.02;addB(e[0],e[1],()=>{const w=0.085,h0=e[2],hh=0.13;const arch=[];arch.push(pj(ut,e[1]-w,h0));for(let k=0;k<=10;k++){const a=Math.PI*(1-k/10);arch.push(pj(ut,e[1]-w*Math.cos(Math.PI*k/10)*1,h0+hh*Math.sin(Math.PI*k/10)+0.01));}arch.push(pj(ut,e[1]+w,h0));
      poly(arch,'#1d1410');const rim=arch.slice(1,-1);ctx.strokeStyle='#7a4a2c';ctx.lineWidth=R*0.012;ctx.beginPath();rim.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();const g2=ctx.createRadialGradient(...pj(ut,e[1],h0+0.04),0,...pj(ut,e[1],h0+0.04),R*0.1);g2.addColorStop(0,'rgba(255,190,110,.35)');g2.addColorStop(1,'rgba(255,190,110,0)');ctx.fillStyle=g2;ctx.beginPath();ctx.arc(...pj(ut,e[1],h0+0.04),R*0.1,0,7);ctx.fill();},P.length+5);}
  /* -- the entrance shack: weathered planks, a tin roof, a plank sign, lanterns -- */
  {const s=SHACK,vm=(s.v0+s.v1)/2,ze=0.105,zr=0.19;addB((s.u0+s.u1)/2,(s.v0+s.v1)/2,()=>{
      poly([pj(s.u0,s.v0,0),pj(s.u1,s.v0,0),pj(s.u1,s.v1,0),pj(s.u0,s.v1,0)].map(p=>[p[0]+R*0.006,p[1]+R*0.01]),'rgba(20,34,16,.3)');
      const wall=(pts,c)=>{poly(pts,c);};wall([pj(s.u1,s.v0,0),pj(s.u1,s.v1,0),pj(s.u1,s.v1,ze),pj(s.u1,vm,zr),pj(s.u1,s.v0,ze)],'#8f6a40');wall([pj(s.u0,s.v1,0),pj(s.u1,s.v1,0),pj(s.u1,s.v1,ze),pj(s.u0,s.v1,ze)],'#b08650');
      for(let v=s.v0+0.012;v<s.v1;v+=0.016)line(pj(s.u1,v,0.002),pj(s.u1,v,v>vm-0.001&&false?zr:ze),'rgba(40,24,10,.35)',R*0.0022);for(let u=s.u0+0.016;u<s.u1;u+=0.016)line(pj(u,s.v1,0.002),pj(u,s.v1,ze),'rgba(40,24,10,.3)',R*0.0022);
      /* door + sign on the gable end, shuttered window on the long side */
      poly([pj(s.u1+0.001,vm-0.028,0),pj(s.u1+0.001,vm+0.028,0),pj(s.u1+0.001,vm+0.032,0.075),pj(s.u1+0.001,vm-0.032,0.075)],'#3a2616','#e8d8b8',R*0.003);poly([pj(s.u1+0.002,vm-0.06,0.1),pj(s.u1+0.002,vm+0.06,0.1),pj(s.u1+0.002,vm+0.06,0.126),pj(s.u1+0.002,vm-0.06,0.126)],'#d8c090','#4a2e18',R*0.003);
      [s.u0+0.06,s.u0+0.16].forEach((u,i)=>{poly([pj(u,s.v1+0.001,0.03),pj(u+0.034,s.v1+0.001,0.03),pj(u+0.034,s.v1+0.001,0.066),pj(u,s.v1+0.001,0.066)],'#ffe29a','#5a3a22',R*0.003);poly([pj(u-0.012,s.v1+0.002,0.03),pj(u,s.v1+0.002,0.03),pj(u,s.v1+0.002,0.066),pj(u-0.012,s.v1+0.002,0.066)],'#5a7a4a');poly([pj(u+0.034,s.v1+0.002,0.03),pj(u+0.046,s.v1+0.002,0.03),pj(u+0.046,s.v1+0.002,0.066),pj(u+0.034,s.v1+0.002,0.066)],'#5a7a4a');});
      /* the tin roof: the slope we see faces +v; the gable overhangs */
      poly([pj(s.u0-0.02,vm,zr),pj(s.u1+0.025,vm,zr),pj(s.u1+0.025,s.v1+0.035,ze-0.01),pj(s.u0-0.02,s.v1+0.035,ze-0.01)],'#8d9399','#4a4f55',R*0.003);
      for(let u=s.u0;u<s.u1+0.02;u+=0.02)line(pj(u,vm,zr),pj(u,s.v1+0.035,ze-0.01),'rgba(40,46,52,.35)',R*0.0024);[[s.u0+0.03,0.4],[s.u0+0.1,0.6]].forEach(([u,t])=>{poly([pj(u,vm+0.01,zr-0.005),pj(u+0.05,vm+0.01,zr-0.005),pj(u+0.05,vm+0.01+(s.v1+0.035-vm-0.01)*t,zr-0.005-(zr-ze+0.01)*t),pj(u,vm+0.01+(s.v1+0.035-vm-0.01)*t,zr-0.005-(zr-ze+0.01)*t)],'rgba(150,84,50,.6)');});
      line(pj(s.u0-0.02,vm,zr),pj(s.u1+0.025,vm,zr),'#5a5f66',R*0.006);line(pj(s.u1+0.025,vm,zr),pj(s.u1+0.025,s.v1+0.035,ze-0.01),'#5a3a22',R*0.005);
      /* lantern post + barrels beside the door */
      const lp=pj(s.u1+0.05,s.v0-0.03,0),lt=pj(s.u1+0.05,s.v0-0.03,0.11);line(lp,lt,'#4a3320',R*0.006);const gg=ctx.createRadialGradient(lt[0],lt[1],0,lt[0],lt[1],R*0.05);gg.addColorStop(0,'rgba(255,200,110,.55)');gg.addColorStop(1,'rgba(255,200,110,0)');ctx.fillStyle=gg;ctx.beginPath();ctx.arc(lt[0],lt[1],R*0.05,0,7);ctx.fill();poly([[lt[0]-R*0.007,lt[1]-R*0.008],[lt[0]+R*0.007,lt[1]-R*0.008],[lt[0]+R*0.006,lt[1]+R*0.008],[lt[0]-R*0.006,lt[1]+R*0.008]],'#ffe9a8','#2a2a30',R*0.002);
      [[s.u1+0.03,s.v1-0.03],[s.u1+0.05,s.v1-0.01]].forEach(([u,v])=>{const b=pj(u,v,0),t=pj(u,v,0.04);ctx.fillStyle='#7a5230';ctx.beginPath();ctx.moveTo(b[0]-R*0.013,b[1]);ctx.lineTo(t[0]-R*0.013,t[1]);ctx.lineTo(t[0]+R*0.013,t[1]);ctx.lineTo(b[0]+R*0.013,b[1]);ctx.ellipse(b[0],b[1],R*0.013,R*0.006,0,0,Math.PI);ctx.fill();ctx.fillStyle='#a07a4a';ctx.beginPath();ctx.ellipse(t[0],t[1],R*0.013,R*0.006,0,0,7);ctx.fill();});
    },smDepth(s.u1,s.v1,0.05)+0.3);}
  /* -- foliage: oaks, cypresses, pines and palmettos on the ground; bushes, ferns and small pines on every ledge of the rock -- */
  const placed=[];const near=(u,v,d)=>placed.some(q=>Math.hypot(q[0]-u,q[1]-v)<d);
  const addTree=(u,v,kind,sz)=>{if(op.avoid){const g0=pj(u,v,0),x=g0[0]+(op.tx||0),y=g0[1]+(op.ty||0),av=op.avoid;if(x>av[0]&&x<av[1]&&y>av[2]&&y<av[3])return;}const h=hAt(u,v),r2=smMul(Math.floor(u*977+v*131)+5);addB(u,v,()=>{const p=pj(u,v,h);({oak:smOak,cyp:smCypress,pine:smPine,palm:smPalm,bush:smBush,fern:smFern,reed:smReeds,rock:smBoulder})[kind](ctx,p[0],p[1],R*sz,r2);},smDepth(u,v,h)+0.001,u<-0.58?'b':'m');};
  /* trees on the flat ground, in both hexes */
  for(let n=0;n<900&&placed.length<66;n++){const u=-1.66+rnd()*3.2,v=-0.95+rnd()*1.9;if(smMargin(u,v)<0.07||inBuilding(u,v,0.07)||inShack(u,v,0.09)||inPond(u,v,0.05))continue;const h=hAt(u,v);if(h>0.05)continue;if(dPath(u,v)<0.15||near(u,v,0.105))continue;if(u>SHACK.u0-0.02&&u<SHACK.u1+0.3&&v>SHACK.v0-0.14&&v<SHACK.v1+0.14)continue;
    const r=rnd(),kind=r<0.34?'oak':r<0.6?'cyp':r<0.86?'pine':'palm',sz=kind==='oak'?0.036+rnd()*0.012:kind==='palm'?0.026+rnd()*0.008:0.03+rnd()*0.012;placed.push([u,v]);addTree(u,v,kind,sz);}
  /* cypresses ringing the pond, reeds along its edge */
  for(let k=0;k<6;k++){const a=-0.4+k*0.95,u=POND.u+Math.cos(a)*(POND.r+0.03),v=POND.v+Math.sin(a)*(POND.r+0.03);if(smMargin(u,v)>0.06){addTree(u,v,'cyp',0.027);placed.push([u,v]);}}
  for(let k=0;k<7;k++){const a=rnd()*6.283,u=POND.u+Math.cos(a)*POND.r*0.95,v=POND.v+Math.sin(a)*POND.r*0.95;addTree(u,v,'reed',0.02);}
  /* the rock: bushes and ferns on the terraces, small pines on the high ledges */
  let nb=0,np=0;for(let n=0;n<4200&&nb<340;n++){const u=-0.6+rnd()*2.0,v=-0.9+rnd()*1.8;const h=hAt(u,v);if(h<0.07)continue;const s=slopeAt(u,v);if(s>1.5||smMargin(u,v)<0.02)continue;const dp=dPath(u,v);if(dp<0.085)continue;if(u<-0.56)continue;
    if(h>0.4&&s<0.55&&np<16&&rnd()<0.5&&!near(u,v,0.09)){np++;placed.push([u,v]);addTree(u,v,'pine',0.02+rnd()*0.01);continue;}
    const k=rnd()<0.78?'bush':'fern';nb++;addTree(u,v,k,k==='bush'?0.016+rnd()*0.018:0.017+rnd()*0.01);}
  /* hanging vines on the sheer faces */
  for(let n=0,nv_=0;n<3000&&nv_<140;n++){const u=-0.5+rnd()*1.6,v=-0.8+rnd()*1.6;const h=hAt(u,v);if(h<0.25)continue;const s=slopeAt(u,v);if(s<1.4||smMargin(u,v)<0.02||dPath(u,v)<0.08)continue;nv_++;const L=R*(0.035+rnd()*0.05),r2=smMul(n+9);addB(u,v,()=>{const p=pj(u,v,h);ctx.lineCap='round';for(let k=0;k<4;k++){const x=p[0]+(k-1.5)*R*0.006+(r2()-0.5)*R*0.004,l=L*(0.5+r2()*0.7);ctx.strokeStyle=k%2?'#3f7a38':'#2f6a30';ctx.lineWidth=R*0.0045;ctx.beginPath();ctx.moveTo(x,p[1]);ctx.quadraticCurveTo(x+R*0.004,p[1]+l*0.5,x-R*0.002,p[1]+l);ctx.stroke();ctx.fillStyle='#5fa04a';ctx.beginPath();ctx.ellipse(x,p[1]+l,R*0.006,R*0.004,0,0,7);ctx.fill();}},smDepth(u,v,h)+0.002);}
  /* boulders along the base of the rock, and by the splash */
  for(let n=0;n<600&&placed.length<85;n++){const u=-0.5+rnd()*1.9,v=-0.9+rnd()*1.8;const h=hAt(u,v);if(h>0.1||h<0.012)continue;if(smMargin(u,v)<0.05||dPath(u,v)<0.1||inShack(u,v,0.06)||inPond(u,v,0.05))continue;placed.push([u,v]);addTree(u,v,'rock',0.014+rnd()*0.01);}
  for(let a=0;a<nu;a++)for(let b=0;b<nv;b++){const c=cells[a*nv+b],k=a*nv+b;if(c&&part!=='b'){const u=SM_U0+a*D,v=SM_V0+b*D,h=c.h;poly([pj(u,v,h[0]),pj(u+D,v,h[1]),pj(u+D,v+D,h[2]),pj(u,v+D,h[3])],c.c);}
    const ex=bucket.get(k);if(ex){ex.sort((x,y)=>x.key-y.key);ex.forEach(e=>{if(part==='all'||e.grp===part)e.fn();});}}
  ctx.restore();}

/* ===== foliage, water, props ===== */
function smBlob(c,x,y,rx,ry,col,rnd,n){const pts=[];n=n||9;for(let k=0;k<n;k++){const a=k/n*6.283,rr=0.8+rnd()*0.28;pts.push([x+Math.cos(a)*rx*rr,y+Math.sin(a)*ry*rr]);}c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle=col;c.fill();c.fillStyle='rgba(255,255,255,.13)';c.beginPath();c.ellipse(x-rx*0.28,y-ry*0.32,rx*0.45,ry*0.34,0,0,7);c.fill();c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.ellipse(x+rx*0.35,y+ry*0.3,rx*0.42,ry*0.46,0,0,7);c.fill();}
function smShadow(c,x,y,rx){c.fillStyle='rgba(18,34,16,.28)';c.beginPath();c.ellipse(x+rx*0.25,y+rx*0.08,rx,rx*0.34,0,0,7);c.fill();}
const SM_GR=['#3f7a38','#4f8f42','#2f6a30','#5fa04a','#6aa84e'];
function smOak(c,x,y,u,r){smShadow(c,x,y,u*2.1);c.lineCap='round';c.strokeStyle='#5a4128';c.lineWidth=u*0.8;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.2,y-u*1.4,x+u*0.1,y-u*2.2);c.stroke();c.lineWidth=u*0.4;c.beginPath();c.moveTo(x,y-u*1.6);c.lineTo(x-u*1.3,y-u*2.5);c.moveTo(x,y-u*1.7);c.lineTo(x+u*1.4,y-u*2.4);c.stroke();
  const cy=y-u*2.9;[[0,-0.1,2.0,1.1],[-1.5,0.2,1.2,0.9],[1.5,0.2,1.2,0.9],[-0.8,-0.8,1.3,0.9],[0.9,-0.8,1.3,0.9],[0,0.5,1.5,0.7]].forEach(([dx,dy,rx,ry],i)=>smBlob(c,x+dx*u,cy+dy*u,u*rx,u*ry,SM_GR[i%4],r,9));
  c.strokeStyle='rgba(170,186,150,.8)';c.lineCap='round';for(let k=0;k<9;k++){const sx=x+(r()-0.5)*u*3.2,sy=cy+u*(0.2+r()*0.5),l=u*(0.7+r()*1.1);c.lineWidth=u*(0.09+r()*0.07);c.beginPath();c.moveTo(sx,sy);c.quadraticCurveTo(sx+u*0.1,sy+l*0.5,sx-u*0.05,sy+l);c.stroke();}}
function smCypress(c,x,y,u,r){smShadow(c,x,y,u*1.3);c.fillStyle='#6a4e32';c.beginPath();c.moveTo(x-u*0.9,y);c.quadraticCurveTo(x-u*0.3,y-u*0.6,x-u*0.35,y-u*2);c.lineTo(x+u*0.35,y-u*2);c.quadraticCurveTo(x+u*0.3,y-u*0.6,x+u*0.9,y);c.closePath();c.fill();
  const cols=['#5f8f3a','#4a7a32','#78a048','#6a9a40'];for(let k=0;k<7;k++){const yy=y-u*(1.6+k*1.05),w=u*(1.7-k*0.2);c.fillStyle=cols[k%4];c.beginPath();c.moveTo(x-w,yy+u*0.9);for(let q=0;q<=6;q++)c.lineTo(x-w+q*w/3,yy+u*(0.9+(q%2?0.15:0)));c.lineTo(x+w*0.1,yy-u*0.3);c.closePath();c.fill();}
  c.strokeStyle='rgba(170,186,150,.7)';c.lineWidth=u*0.07;for(let k=0;k<5;k++){const sx=x+(r()-0.5)*u*2.4,sy=y-u*(2.4+r()*3);c.beginPath();c.moveTo(sx,sy);c.lineTo(sx-u*0.05,sy+u*(0.8+r()*0.9));c.stroke();}}
function smPine(c,x,y,u,r){smShadow(c,x,y,u*1.1);c.strokeStyle='#4a3320';c.lineWidth=u*0.4;c.beginPath();c.moveTo(x,y);c.lineTo(x,y-u*1.5);c.stroke();const cs=['#2f6a3a','#25562f','#3a7a44'];for(let k=0;k<6;k++){const yy=y-u*(1.2+k*0.95),w=u*(1.55-k*0.22);c.fillStyle=cs[k%3];c.beginPath();c.moveTo(x-w,yy+u*0.8);c.lineTo(x,yy-u*0.9);c.lineTo(x+w,yy+u*0.8);c.closePath();c.fill();c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.moveTo(x,yy-u*0.9);c.lineTo(x+w,yy+u*0.8);c.lineTo(x,yy+u*0.8);c.closePath();c.fill();}}
function smPalm(c,x,y,u,r){smShadow(c,x,y,u*1.3);c.strokeStyle='#6a5236';c.lineWidth=u*0.5;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+u*0.5,y-u*1.4,x+u*0.2,y-u*2.6);c.stroke();const cx=x+u*0.2,cy=y-u*2.7;for(let k=0;k<9;k++){const a=-Math.PI*0.95+k*Math.PI*1.9/8,len=u*(1.7+(k%2)*0.4);c.fillStyle=k%2?'#4a8a3a':'#3a7a30';c.beginPath();c.moveTo(cx,cy);c.quadraticCurveTo(cx+Math.cos(a)*len*0.5,cy+Math.sin(a)*len*0.5-u*0.7,cx+Math.cos(a)*len,cy+Math.sin(a)*len*0.55+u*0.3);c.quadraticCurveTo(cx+Math.cos(a)*len*0.5,cy+Math.sin(a)*len*0.5-u*0.1,cx,cy);c.fill();}}
function smBush(c,x,y,u,r){c.fillStyle='rgba(18,34,16,.22)';c.beginPath();c.ellipse(x+u*0.2,y+u*0.1,u*1.1,u*0.4,0,0,7);c.fill();[[-0.55,-0.35,0.8,0.55],[0.55,-0.35,0.8,0.55],[0,-0.75,0.85,0.6]].forEach(([dx,dy,rx,ry],i)=>smBlob(c,x+dx*u,y+dy*u,u*rx,u*ry,SM_GR[(i+Math.floor(r()*3))%5],r,8));}
function smFern(c,x,y,u,r){c.lineCap='round';for(let k=0;k<8;k++){const a=-Math.PI+0.2+k/7*(Math.PI-0.4),len=u*(1.0+r()*0.5);c.strokeStyle=k%2?'#4f9a4a':'#3f8a3e';c.lineWidth=u*0.32;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+Math.cos(a)*len*0.5,y+Math.sin(a)*len*0.7-len*0.25,x+Math.cos(a)*len,y+Math.sin(a)*len*0.5+len*0.3);c.stroke();}}
function smReeds(c,x,y,u,r){for(let k=0;k<8;k++){const bx=x+(k-3.5)*u*0.22,h=u*(1.4+r()*1.4);c.strokeStyle=k%2?'#8a9a5a':'#6a8a4a';c.lineWidth=u*0.1;c.beginPath();c.moveTo(bx,y);c.lineTo(bx+(r()-0.5)*u*0.5,y-h);c.stroke();if(k%3===0){c.fillStyle='#6a4a2a';c.beginPath();c.ellipse(bx,y-h,u*0.1,u*0.3,0,0,7);c.fill();}}}
function smBoulder(c,x,y,u,r){c.fillStyle='rgba(18,34,16,.25)';c.beginPath();c.ellipse(x+u*0.3,y+u*0.1,u*1.2,u*0.4,0,0,7);c.fill();const pal=['#b87a4c','#a8683e','#c88a58'];[[-0.4,0,0.8,0.7],[0.5,0.1,0.7,0.6],[0,-0.4,0.6,0.5]].forEach(([dx,dy,rx,ry],i)=>{const px=x+dx*u,py=y+dy*u;c.fillStyle=pal[i%3];c.beginPath();c.moveTo(px-u*rx,py);c.lineTo(px-u*rx*0.8,py-u*ry*0.8);c.lineTo(px,py-u*ry*1.2);c.lineTo(px+u*rx*0.9,py-u*ry*0.6);c.lineTo(px+u*rx,py);c.closePath();c.fill();c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.moveTo(px+u*rx*0.2,py-u*ry);c.lineTo(px+u*rx*0.9,py-u*ry*0.6);c.lineTo(px+u*rx,py);c.lineTo(px+u*rx*0.1,py);c.closePath();c.fill();});}

/* ===== layouts (diagonal pair / side-by-side pair), the connecting building, sprite bake ===== */
const SM_SIZE=0.9;                                    /* overall size: 10% smaller than the first version */
const SM_MC=[0.72,0.0],SM_BC=[-1.07,0.0];             /* local centres of the mountain group and the show-building group */
function smLayout(R,mode){smLayout._c=smLayout._c||{};const key=mode+'|'+R;if(smLayout._c[key])return smLayout._c[key];
  const Re=R*SM_SIZE;let L;
  if(mode==='diag'){L={mode,Re,groups:[{part:'all',R:Re,tx:0,ty:0}],Rm:Re,mapM:(u,v,z)=>{const w=smW(u,v);return[w[0]*Re,(0.58*w[1]-z)*Re];}};}
  else{const Rm=Re*0.74,Rb=Re*0.93,wm=smW(SM_MC[0],SM_MC[1]),wb=smW(SM_BC[0],SM_BC[1]),tm=[0.866*R-wm[0]*Rm,-0.58*wm[1]*Rm],tb=[-0.866*R-wb[0]*Rb,-0.58*wb[1]*Rb];
    L={mode,Re,Rm,Rb,groups:[{part:'building',R:Rb,tx:tb[0],ty:tb[1]},{part:'mountain',R:Rm,tx:tm[0],ty:tm[1]}],mapM:(u,v,z)=>{const w=smW(u,v);return[w[0]*Rm+tm[0],(0.58*w[1]-z)*Rm+tm[1]];}};}
  return smLayout._c[key]=L;}
/* the connecting building: ONE plain low volume in the show building's materials (sage panel walls, a band, white roof with a parapet). It is drawn first, so both ends tuck behind the show building's long face and into the mountain's rock. */
function smLink(ctx,R){const pw=(X,Y,z)=>[X*R,(0.58*Y-z)*R];const line=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const poly=(pts,f)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=f;ctx.fill();ctx.strokeStyle=f;ctx.lineWidth=0.6;ctx.lineJoin='round';ctx.stroke();};
  const X0=-0.86,X1=0.36,Y0=-0.13,Y1=0.13,Z=0.17;ctx.save();
  ctx.fillStyle='rgba(20,34,16,.2)';ctx.beginPath();ctx.ellipse((X0+X1)/2*R+R*0.04,R*0.012,(X1-X0)/2*R,R*0.08,0,0,7);ctx.fill();
  poly([pw(X0,Y1,0),pw(X1,Y1,0),pw(X1,Y1,Z),pw(X0,Y1,Z)],'#a9b497');poly([pw(X1,Y0,0),pw(X1,Y1,0),pw(X1,Y1,Z),pw(X1,Y0,Z)],'#8f9a82');poly([pw(X0,Y0,Z),pw(X1,Y0,Z),pw(X1,Y1,Z),pw(X0,Y1,Z)],'#e8eae2');
  for(let X=X0+0.1;X<X1-0.001;X+=0.1)line(pw(X,Y1+0.0005,0),pw(X,Y1+0.0005,Z),'rgba(40,50,30,.24)',R*0.0025);line(pw(X0,Y1+0.0005,0.07),pw(X1,Y1+0.0005,0.07),'rgba(60,70,50,.4)',R*0.004);
  const q=[pw(X0+0.015,Y0+0.015,Z),pw(X1-0.015,Y0+0.015,Z),pw(X1-0.015,Y1-0.015,Z),pw(X0+0.015,Y1-0.015,Z)];ctx.strokeStyle='rgba(120,128,112,.6)';ctx.lineWidth=R*0.005;ctx.beginPath();q.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.stroke();
  ctx.restore();}
function smBounds(L,R){let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;const add=(x,y)=>{x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);};
  if(L.mode==='diag'){[-1.72,1.55].forEach(u=>[-1.0,1.0].forEach(v=>[0,1.15].forEach(z=>{const p=L.mapM(u,v,z);add(p[0],p[1]);})));}
  else{L.groups.forEach(g=>{const bb=g.part==='building'?[-1.72,-0.5,-0.75,0.85,0.62]:[-0.7,1.55,-1.0,1.0,1.18];[bb[0],bb[1]].forEach(u=>[bb[2],bb[3]].forEach(v=>[0,bb[4]].forEach(z=>{const w=smW(u,v);add(w[0]*g.R+g.tx,(0.58*w[1]-z)*g.R+g.ty);})));});[-0.9,0.4].forEach(X=>[-0.18,0.18].forEach(Y=>[0,0.25].forEach(z=>add(X*L.Re,(0.58*Y-z)*L.Re))));}
  return[x0,x1,y0,y1];}
function smSprite(R,mode,dir,scale){smSprite._c=smSprite._c||{};const sc=scale||getBakeScale(),key=[Math.round(R*sc),R,mode,dir,sc].join('|');if(smSprite._c[key])return smSprite._c[key];
  const L=smLayout(R,mode),[x0,x1,y0,y1]=smBounds(L,R),mg=R*0.2,W=Math.ceil(x1-x0+2*mg),H=Math.ceil(y1-y0+2*mg),ox=Math.ceil(-x0+mg),oy=Math.ceil(-y0+mg),cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);g.save();
  const flip=dir==='NE-SW'||dir==='E-W';if(flip){g.translate(W,0);g.scale(-1,1);}g.translate(ox,oy);
  if(L.mode==='side')smLink(g,L.Re);const avoid=L.mode==='side'?[-0.92*L.Re,0.42*L.Re,-0.13*L.Re,0.13*L.Re]:null;L.groups.forEach(gr=>smDraw(g,gr.R,{part:gr.part,tx:gr.tx,ty:gr.ty,avoid:avoid}));
  g.restore();return smSprite._c[key]={canvas:cv,ox:flip?W-ox:ox,oy:oy,w:W,h:H};}

/* ===== animated log: one hollow log at a time, drawn over the baked sprite ===== */
let SM_TIME=null;
function smTiming(){if(SM_TIME)return SM_TIME;const PA=smPath(),P=PA.P,ds=PA.ds,T=[0];
  for(let i=1;i<P.length;i++){const z=P[i][2];let v;if(i<=PA.iDrop)v=0.15+0.95*Math.sqrt(Math.max(0,(0.80-z)/0.74));else{const s=(i-PA.iDrop)*ds;v=Math.max(0.17,0.62*Math.exp(-s*2.6));}T.push(T[i-1]+ds/v);}
  const total=T[T.length-1];return SM_TIME={T,total,cycle:total+1.4};}
function smLogAt(tt){const S=smTiming(),T=S.T;if(tt<0||tt>S.total)return null;let lo=0,hi=T.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(T[m]<=tt)lo=m;else hi=m;}return lo+(tt-T[lo])/Math.max(1e-6,T[hi]-T[lo]);}
/* map(u,v,z) -> [x,y] relative to the pair centre (unflipped); fl = mirrored sprite; (cx,cy) = pair centre; Rm = mountain-group scale */
function smDrawLog(ctx,cx,cy,Rm,map,fl,t,o){o=o||{};const S=smTiming(),PA=smPath(),P=PA.P,tt=(((t*(o.speed||1))%S.cycle)+S.cycle)%S.cycle,fi=smLogAt(tt);const sg=fl?-1:1;
  const M=(u,v,z)=>{const p=map(u,v,z);return[cx+sg*p[0],cy+p[1]];};
  const poly=(pts,f,s,lw)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=f;ctx.fill();if(s){ctx.strokeStyle=s;ctx.lineWidth=lw;ctx.stroke();}};
  ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  /* splash burst: spray, a ripple, and a short bow wave, timed to the log hitting the basin */
  const tsp=S.T[PA.iDrop],tau=tt-tsp;if(tau>-0.04&&tau<1.0){const p0=P[PA.iDrop+3],b=M(p0[0],p0[1],p0[2]+0.01),k=Math.max(0,tau);
    ctx.fillStyle='rgba(255,255,255,'+(0.55*(1-k)).toFixed(3)+')';ctx.beginPath();ctx.ellipse(b[0],b[1],Rm*(0.05+0.17*k),Rm*(0.022+0.07*k),0,0,7);ctx.fill();
    for(let n=0;n<16;n++){const vy=0.30+0.26*((n*5)%7)/7,vx=(((n*3)%9)-4)*0.05,gx=1.5,x=b[0]+sg*vx*Rm*k,y=b[1]-(vy*k-0.5*gx*k*k)*Rm,r=Rm*0.013*(1-0.6*k);if(y>b[1]+Rm*0.02)continue;ctx.fillStyle='rgba(240,250,255,'+(0.9*(1-k)).toFixed(3)+')';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();}}
  if(fi!==null){const i=Math.max(7,Math.min(P.length-8,Math.floor(fi))),fr=fi-Math.floor(fi),lerp=(a,b)=>a+(b-a)*fr,pa=P[i],pb=P[i+1],p=[lerp(pa[0],pb[0]),lerp(pa[1],pb[1]),lerp(pa[2],pb[2])];
    /* bob and dip: the log sinks into the basin and rocks as it recovers */
    const dq=Math.max(0,Math.min(1,(fi-(PA.iDrop-4))/46)),dip=-0.016*Math.sin(Math.PI*Math.min(1,dq*1.4))*(dq<1?1:0)+0.003*Math.sin(tt*5)*(fi>PA.iDrop?1:0);
    const c=M(p[0],p[1],p[2]+0.024+dip),a=M(P[i-7][0],P[i-7][1],P[i-7][2]+0.024),b=M(P[i+7][0],P[i+7][1],P[i+7][2]+0.024);let dx=b[0]-a[0],dy=b[1]-a[1];const m=Math.hypot(dx,dy)||1;dx/=m;dy/=m;const L=Rm*0.075,W=Rm*0.034,nx=-dy,ny=dx;
    ctx.save();
    /* it disappears into the rock: only the part outside the tunnel face is drawn */
    if(fi>P.length-46){const e=P[P.length-1],ut=e[0]-0.02,q=[M(ut,-1.3,0.054),M(ut,1.3,0.054),M(ut+3,1.3,0.054),M(ut+3,-1.3,0.054)];ctx.beginPath();q.forEach((pt,k)=>k?ctx.lineTo(pt[0],pt[1]):ctx.moveTo(pt[0],pt[1]));ctx.closePath();ctx.clip();}
    ctx.globalAlpha=Math.min(1,fi/16);
    ctx.fillStyle='rgba(20,40,60,.28)';ctx.beginPath();ctx.ellipse(c[0]+Rm*0.004,c[1]+Rm*0.012,L*0.9,W*0.55,Math.atan2(dy,dx),0,7);ctx.fill();
    poly([[c[0]-dx*L+nx*W,c[1]-dy*L+ny*W],[c[0]+dx*L+nx*W,c[1]+dy*L+ny*W],[c[0]+dx*L-nx*W,c[1]+dy*L-ny*W],[c[0]-dx*L-nx*W,c[1]-dy*L-ny*W]],'#8a5a33','#4a2e18',Rm*0.004);
    poly([[c[0]-dx*L+nx*W*0.2,c[1]-dy*L+ny*W*0.2],[c[0]+dx*L+nx*W*0.2,c[1]+dy*L+ny*W*0.2],[c[0]+dx*L-nx*W*0.55,c[1]+dy*L-ny*W*0.55],[c[0]-dx*L-nx*W*0.55,c[1]-dy*L-ny*W*0.55]],'#b07a46');
    ctx.fillStyle='#3a2616';ctx.beginPath();ctx.ellipse(c[0]+dx*L,c[1]+dy*L,W*0.55,W*0.9,Math.atan2(dy,dx),0,7);ctx.fill();
    for(let k=0;k<4;k++){const tq=(k-1.5)*0.42,hx=c[0]+dx*L*tq,hy=c[1]+dy*L*tq-Rm*0.018;ctx.fillStyle=['#3b82f6','#ef4444','#22c55e','#f59e0b'][k];ctx.fillRect(hx-Rm*0.008,hy,Rm*0.016,Rm*0.016);ctx.fillStyle='#fde4c8';ctx.beginPath();ctx.arc(hx,hy-Rm*0.005,Rm*0.0085,0,7);ctx.fill();ctx.fillStyle=['#2a1a10','#6a3a1a','#e8c84a','#3a2418'][k];ctx.beginPath();ctx.arc(hx,hy-Rm*0.008,Rm*0.0075,Math.PI,0);ctx.fill();}
    /* redraw the near trough wall over the log, so it sits inside the channel */
    ctx.globalAlpha=1;for(let j=Math.max(0,i-16);j<Math.min(P.length-1,i+16);j++){const p1=P[j],p2=P[j+1];let du=p2[0]-p1[0],dv=p2[1]-p1[1];const mm=Math.hypot(du,dv)||1;du/=mm;dv/=mm;const nu_=-dv,nv_=du,w1=p1[3],w2=p2[3],tw=0.017,hw=0.034,E=(pp,w,sg2,zz)=>M(pp[0]+nu_*w*sg2,pp[1]+nv_*w*sg2,pp[2]+zz),near=(nu_*SM_S3+nv_*0.5)>0?1:-1;
      poly([E(p1,w1+tw,near,0),E(p2,w2+tw,near,0),E(p2,w2+tw,near,hw),E(p1,w1+tw,near,hw)],'#8a5a33');poly([E(p1,w1,near,hw),E(p2,w2,near,hw),E(p2,w2+tw,near,hw),E(p1,w1+tw,near,hw)],'#b07a46');}
    ctx.restore();}
  ctx.restore();}

/* ===== API ===== */
function drawSplashMountainDiag(ctx,cx,cy,R,o){o=o||{};const d=o.dir==='NE-SW'?'NE-SW':'NW-SE',s=smSprite(R,'diag',d,o.scale);ctx.drawImage(s.canvas,cx-s.ox,cy-s.oy,s.w,s.h);if(o.t!==undefined&&o.t!==null){const L=smLayout(R,'diag');smDrawLog(ctx,cx,cy,L.Rm,L.mapM,d==='NE-SW',o.t,o);}}
function drawSplashMountainSide(ctx,cx,cy,R,o){o=o||{};const d=o.flip?'E-W':'W-E',s=smSprite(R,'side',d,o.scale);ctx.drawImage(s.canvas,cx-s.ox,cy-s.oy,s.w,s.h);if(o.t!==undefined&&o.t!==null){const L=smLayout(R,'side');smDrawLog(ctx,cx,cy,L.Rm,L.mapM,!!o.flip,o.t,o);}}
function splashMountainCycle(){return smTiming().cycle;}
/* footprints: the two tiles and ground circles covering the occupied ground, for keeping land scenery clear */
function splashMountainFootprint(R,mode,dir){const Re=R*SM_SIZE,c=[];
  if(mode==='side'){const m=dir==='E-W'?-1:1;[-1,1].forEach(s=>{for(let a=-0.62;a<=0.62;a+=0.2)for(let b=-0.5;b<=0.5;b+=0.2){if(Math.hypot(a,b*1.6)>0.7)continue;c.push({x:(s*0.866+a)*R*m,y:b*R*0.58*1.6,r:R*0.15});}});return{tiles:[[-0.866*R*m,0],[0.866*R*m,0]],circles:c};}
  const m=dir==='NE-SW'?-1:1;for(let u=-1.55;u<=1.55;u+=0.17)for(let v=-0.9;v<=0.9;v+=0.17){if(smMargin(u,v)<0.1)continue;const w=smW(u,v);c.push({x:w[0]*Re*m,y:0.58*w[1]*Re,r:Re*0.13});}
  return{tiles:[[-0.433*R*m,-0.435*R],[0.433*R*m,0.435*R]],circles:c};}


window.LEGENDARY_SPLASH_MOUNTAIN_SPRITE = { side: drawSplashMountainSide, diag: drawSplashMountainDiag, footprint: splashMountainFootprint, cycle: splashMountainCycle };
})();
