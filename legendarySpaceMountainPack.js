const LEGENDARY_SPACE_MOUNTAIN_SPRITE = (() => {
/* ===== LEGENDARY SPACE MOUNTAIN (Tokyo-style): the shape as a height field. World units of R; X along the pair axis, Y across (toward the viewer), Z up. ===== */
const MS_TAU=Math.PI*2;
function msHash(a,b){let h=Math.imul(a|0,374761393)^Math.imul(b|0,668265263);h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296;}
const msSmax=(a,b,k)=>{const h=Math.max(k-Math.abs(a-b),0)/k;return Math.max(a,b)+h*h*k*0.25;};
/* a tier: a rotated super-ellipse saucer with a domed top. The lip is a vertical glass-and-LED fascia; a groove of LED runs round the top edge. */
function msTier(o){const T=Object.assign({n:2.3,pw:2.2,q:0.85,led:true,led2:0,seam:true},o),r=T.rot*Math.PI/180;T.c=Math.cos(r);T.s=Math.sin(r);T.r2=Math.pow(Math.max(T.a,T.b)*1.03,2);const rr=Math.max(T.a,T.b)*1.03;
  T.f=(u,v,t)=>{const dx=u-T.cx,dy=v-T.cy;if(dx*dx+dy*dy>T.r2)return -1;const xr=(dx*T.c+dy*T.s)/T.a,yr=(-dx*T.s+dy*T.c)/T.b,n=T.n;const rho=n===2?Math.sqrt(xr*xr+yr*yr):Math.pow(Math.pow(Math.abs(xr),n)+Math.pow(Math.abs(yr),n),1/n);if(rho>1)return -1;
    t.m=T.id;t.ang=(Math.atan2(yr,xr)/MS_TAU+1)%1;t.e=0;t.aux=0;t.lip=rho>0.985?1:0;
    if(T.led&&rho>0.925&&rho<0.958){const k=1-Math.abs(rho-0.9415)/0.0165;t.e=Math.round(255*Math.sqrt(Math.max(0,k)));}
    else if(T.led2&&Math.abs(rho-T.led2)<0.011){t.e=Math.round(230*(1-Math.abs(rho-T.led2)/0.011));}
    if(T.seam){const a=t.ang*MS_TAU/(Math.PI/12);if(Math.abs(a-Math.round(a))<0.045&&rho>0.18&&rho<0.92)t.aux=1;}
    return T.h0+T.th*Math.pow(1-Math.pow(rho,T.pw),T.q)+(T.tilt?T.tilt*xr*(1-rho*rho):0);};
  T.f.bb=[T.cx-rr,T.cx+rr,T.cy-rr,T.cy+rr];return T;}
/* the crown: a hub, a turbine of radial fins and a cluster of spires */
function msCrown(cx,cy,z0,spec){const fins=spec.fins||14,sp=spec.spires;
  const F=(u,v,t)=>{const dx=u-cx,dy=v-cy,r2=dx*dx+dy*dy;if(r2>0.045)return -1;const r=Math.sqrt(r2);let best=-1;t.e=0;t.aux=0;
    if(r<0.17){best=z0+0.065*(1-(r/0.17)*(r/0.17));t.m=20;t.ang=0;}
    if(r>0.045&&r<0.2){const a=Math.atan2(dy,dx)+r*3.2,seg=MS_TAU/fins,d=((a%seg)+seg)%seg,dist=Math.min(d,seg-d)*r;if(dist<0.0105){const zf=z0+0.04+0.15*Math.pow(Math.max(0,1-(r-0.045)/0.16),1.2);if(zf>best){best=zf;t.m=21;t.e=(dist<0.0035&&r>0.07)?150:0;}}}
    for(let i=0;i<sp.length;i++){const s=sp[i],ex=u-(cx+s.x),ey=v-(cy+s.y),rr=Math.sqrt(ex*ex+ey*ey);if(rr<s.r){const f=1-rr/s.r,zs=z0+0.04+s.h*f;if(zs>best){best=zs;t.m=22;t.e=f>0.72?255:0;}}}
    return best;};F.bb=[cx-0.22,cx+0.22,cy-0.22,cy+0.22];return F;}
/* a cone / spire / jet */
function msCone(cx,cy,r,z0,h,m,emitTop){const F=(u,v,t)=>{const dx=u-cx,dy=v-cy,rr=Math.sqrt(dx*dx+dy*dy);if(rr>=r)return -1;const f=1-rr/r;t.m=m;t.e=emitTop&&f>0.7?255:0;t.aux=0;t.ang=0;return z0+h*f;};F.bb=[cx-r,cx+r,cy-r,cy+r];return F;}
function msDisc(cx,cy,r,z,m,auxF){const F=(u,v,t)=>{const dx=u-cx,dy=v-cy,rr=Math.sqrt(dx*dx+dy*dy);if(rr>=r)return -1;t.m=m;t.e=0;t.ang=0;t.aux=auxF?auxF(rr,dx,dy):0;return z;};F.bb=[cx-r,cx+r,cy-r,cy+r];return F;}
function msRing(cx,cy,r0,r1,z,m,auxF,eF){const F=(u,v,t)=>{const dx=u-cx,dy=v-cy,rr=Math.sqrt(dx*dx+dy*dy);if(rr<r0||rr>=r1)return -1;t.m=m;t.e=eF?eF(rr):0;t.ang=0;t.aux=auxF?auxF(rr,dx,dy):0;return typeof z==='function'?z(rr,dx,dy):z;};F.bb=[cx-r1,cx+r1,cy-r1,cy+r1];return F;}
/* a ribbon walkway following a polyline */
function msBand(pts,hw,z,m){const segs=[];let acc=0;for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],l=Math.hypot(b[0]-a[0],b[1]-a[1]);segs.push({a,b,l,s0:acc});acc+=l;}
  let u0=1e9,u1=-1e9,v0=1e9,v1=-1e9;pts.forEach(p=>{u0=Math.min(u0,p[0]);u1=Math.max(u1,p[0]);v0=Math.min(v0,p[1]);v1=Math.max(v1,p[1]);});u0-=hw+0.02;u1+=hw+0.02;v0-=hw+0.02;v1+=hw+0.02;
  const F=(u,v,t)=>{if(u<u0||u>u1||v<v0||v>v1)return -1;let bd=1e9,bs=0;for(let i=0;i<segs.length;i++){const S=segs[i],dx=S.b[0]-S.a[0],dy=S.b[1]-S.a[1],tt=Math.max(0,Math.min(1,((u-S.a[0])*dx+(v-S.a[1])*dy)/(S.l*S.l))),px=S.a[0]+dx*tt,py=S.a[1]+dy*tt,d=Math.hypot(u-px,v-py);if(d<bd){bd=d;bs=S.s0+tt*S.l;}}
    if(bd>=hw)return -1;t.m=m;t.e=0;t.ang=0;t.aux=Math.round(((bs*34)%1)*254)+1;const edge=bd>hw*0.78;return z+(edge?0.028:0);};F.bb=[u0,u1,v0,v1];return F;}
/* the fountain: one size everywhere (the plaza paving is optional) */
const MS_FS=0.72;
function msFountain(comps,px,py,paving){const s=MS_FS,hs=Math.sqrt(s),sect=(rr,dx,dy,n)=>1+((Math.floor((Math.atan2(dy,dx)+Math.PI)/MS_TAU*n)+(rr>0.485*s?2:0))%5);
  if(paving){comps.push(msDisc(px,py,0.74*s,0.012,31,(rr)=>Math.round(((rr*11/s)%1)*254)+1));comps.push(msRing(px,py,0.68*s,0.74*s,0.034,32,null));}
  comps.push(msRing(px,py,0.43*s,0.54*s,(rr,dx,dy)=>0.046+0.01*Math.sin(Math.atan2(dy,dx)*9),33,(rr,dx,dy)=>sect(rr,dx,dy,10)));
  comps.push(msDisc(px,py,0.335*s,0.042,34,null));comps.push(msRing(px,py,0.325*s,0.34*s,0.05,32,null,()=>200));
  comps.push(msCone(px,py,0.19*s,0.05,0.12*hs,35,false));comps.push(msCone(px,py,0.032*hs,0.1,0.30*hs,35,true));
  for(let k=0;k<6;k++){const a=k*Math.PI/3+0.3;comps.push(msCone(px+Math.cos(a)*0.24*s,py+Math.sin(a)*0.24*s,0.026*hs,0.045,0.16*hs,35,true));}}
/* two compositions, following the sketches */
function msLayout(mode){const comps=[],tiers=[];const T=o=>{const t=msTier(o);tiers.push(t);return t;};
  if(mode==='diag'){
    const mx=-0.866,my=0.02;
    const t1=T({id:1,cx:mx,cy:my,a:0.86,b:0.76,rot:-12,h0:0.115,th:0.12,n:2.4,led2:0.60});
    const t2=T({id:2,cx:mx+0.03,cy:my-0.02,a:0.73,b:0.60,rot:-25,h0:0.23,th:0.12,led2:0.55,tilt:0.035});
    const t3=T({id:3,cx:mx+0.05,cy:my-0.03,a:0.52,b:0.43,rot:-38,h0:0.335,th:0.10,tilt:0.04});
    const t4=T({id:4,cx:mx+0.07,cy:my-0.04,a:0.32,b:0.27,rot:-50,h0:0.425,th:0.075,tilt:0.03});
    const pod=T({id:5,cx:0.12,cy:0.12,a:0.23,b:0.23,rot:0,h0:0.075,th:0.19,n:2,pw:2.0,seam:false});
    [t1,t2,t3,t4,pod].forEach(t=>comps.push(t.f));
    comps.push(msCrown(mx+0.07,my-0.04,0.50,{spires:[{x:0,y:0,h:0.40,r:0.026},{x:0.05,y:0.02,h:0.30,r:0.02},{x:-0.05,y:0.03,h:0.27,r:0.02},{x:0.02,y:-0.06,h:0.33,r:0.021},{x:-0.03,y:-0.04,h:0.22,r:0.018},{x:0.07,y:-0.03,h:0.2,r:0.017},{x:-0.07,y:0.0,h:0.18,r:0.016},{x:0.0,y:0.07,h:0.24,r:0.018}]}));
    comps.push(msCone(0.12,0.12,0.03,0.265,0.42,22,true));
    /* the pod stands on a clean light plinth */
    comps.push(msDisc(0.12,0.12,0.31,0.014,31,(rr)=>Math.round(((rr*11)%1)*254)+1));comps.push(msRing(0.12,0.12,0.275,0.31,0.032,32,null));
    /* the fountain plaza, centred on the front hex */
    msFountain(comps,0.866,0.0,true);
    return{comps,tiers,bounds:{x0:-1.5,x1:1.5,y0:-1.8,y1:1.8},entr:{tier:1,a0:0.15,a1:0.255},rot:Math.PI/3};
  }
  /* side by side: one long streamlined mass: a domed body over the right hex, a low swooping tail over the left, a small pod on the tail */
  const t1=T({id:1,cx:0.52,cy:-0.04,a:1.0,b:0.76,rot:6,h0:0.14,th:0.115,n:2.5,led2:0.60});
  const t1b=T({id:6,cx:-0.50,cy:-0.02,a:0.36,b:0.30,rot:-8,h0:0.095,th:0.09,n:2.3,led2:0.55});
  const t2=T({id:2,cx:0.58,cy:-0.07,a:0.80,b:0.58,rot:-8,h0:0.24,th:0.12,led2:0.55,tilt:0.035});
  const t2b=T({id:7,cx:-0.52,cy:-0.03,a:0.24,b:0.17,rot:-12,h0:0.155,th:0.07,seam:false});
  const t3=T({id:3,cx:0.63,cy:-0.09,a:0.56,b:0.42,rot:-20,h0:0.345,th:0.10,tilt:0.04});
  const t4=T({id:4,cx:0.67,cy:-0.11,a:0.35,b:0.27,rot:-32,h0:0.435,th:0.075});
  const pod=T({id:5,cx:-0.66,cy:-0.03,a:0.15,b:0.15,rot:0,h0:0.15,th:0.15,n:2,pw:2.0,seam:false});
  const U=(u,v,t)=>{const a={m:0,e:0,ang:0,aux:0,lip:0},z1=t1.f(u,v,a),b={m:0,e:0,ang:0,aux:0,lip:0},z2=t1b.f(u,v,b);if(z1<0&&z2<0)return -1;let z,src;if(z1>=0&&z2>=0){z=msSmax(z1,z2,0.12);src=z1>=z2?a:b;}else if(z1>=0){z=z1;src=a;}else{z=z2;src=b;}t.m=src.m;t.e=src.e;t.ang=src.ang;t.aux=src.aux;t.lip=src.lip;return z;};U.bb=[Math.min(t1.f.bb[0],t1b.f.bb[0]),Math.max(t1.f.bb[1],t1b.f.bb[1]),Math.min(t1.f.bb[2],t1b.f.bb[2]),Math.max(t1.f.bb[3],t1b.f.bb[3])];comps.push(U);
  [t2,t2b,t3,t4,pod].forEach(t=>comps.push(t.f));
  comps.push(msCrown(0.69,-0.14,0.51,{spires:[{x:0,y:0,h:0.40,r:0.026},{x:0.05,y:0.02,h:0.30,r:0.02},{x:-0.05,y:0.03,h:0.27,r:0.02},{x:0.02,y:-0.06,h:0.33,r:0.021},{x:-0.03,y:-0.04,h:0.22,r:0.018},{x:0.07,y:-0.03,h:0.2,r:0.017},{x:-0.07,y:0.0,h:0.18,r:0.016},{x:0.0,y:0.07,h:0.24,r:0.018}]}));
  comps.push(msCone(-0.66,-0.03,0.028,0.30,0.34,22,true));
  /* the fountain stands in the left hex, to the left of the small volume */
  msFountain(comps,-1.26,0.04,false);
  return{comps,tiers,bounds:{x0:-1.8,x1:1.8,y0:-1.1,y1:1.1},entr:{tier:1,a0:0.21,a1:0.285},rot:0};
}

/* ===== LEGENDARY SPACE MOUNTAIN: rasteriser, lighting, LED layers, sprite bake ===== */
const MS_BASE={1:[122,138,168],2:[136,152,182],3:[150,165,193],4:[164,178,204],5:[142,157,186],6:[126,142,172],7:[138,154,183],20:[190,202,224],21:[212,222,238],22:[226,233,245],30:[30,38,60],31:[150,162,182],32:[128,140,162],34:[70,150,208],35:[196,208,226]};
const MS_FLOWER=[[0,0,0],[150,92,214],[214,84,150],[236,134,70],[150,92,214],[214,84,150],[236,134,70]];
const MS_METAL={1:1,2:1,3:1,4:1,5:1,6:1,7:1,20:1,21:1,22:1,35:0.6,32:0.3};
const MS_LIGHT=(()=>{const v=[-0.45,-0.35,0.82],m=Math.hypot(...v);return[v[0]/m,v[1]/m,v[2]/m];})();
const MS_HALF=(()=>{const v=[MS_LIGHT[0],MS_LIGHT[1]+0.865,MS_LIGHT[2]+0.5],m=Math.hypot(...v);return[v[0]/m,v[1]/m,v[2]/m];})();
function msGrid(L,mirror,dens){const B=L.bounds,dX=1/dens,dY=0.862/dens,nx=Math.ceil((B.x1-B.x0)/dX),ny=Math.ceil((B.y1-B.y0)/dY),n=nx*ny;
  const Z=new Float32Array(n).fill(-1),M=new Uint8Array(n),E=new Uint8Array(n),A=new Uint8Array(n),X=new Uint8Array(n),t={m:0,e:0,ang:0,aux:0,lip:0},LP=new Uint8Array(n),ca=Math.cos(L.rot),sa=Math.sin(L.rot),comps=L.comps,nc=comps.length,bb=comps.map(c=>c.bb||[-9,9,-9,9]);
  for(let iy=0;iy<ny;iy++){const Y=B.y0+iy*dY;for(let ix=0;ix<nx;ix++){const Xw=B.x0+ix*dX,xm=mirror?-Xw:Xw,u=xm*ca+Y*sa,v=-xm*sa+Y*ca;let best=-1,bm=0,be=0,ba=0,bx=0,bl=0;
    for(let c=0;c<nc;c++){const b=bb[c];if(u<b[0]||u>b[1]||v<b[2]||v>b[3])continue;t.e=0;t.aux=0;t.ang=0;t.lip=0;const z=comps[c](u,v,t);if(z>=0&&z>=best){best=z;bm=t.m;be=t.e;ba=t.ang;bx=t.aux;bl=t.lip;}}
    if(best>=0){const k=iy*nx+ix;Z[k]=best;M[k]=bm;E[k]=be;A[k]=Math.min(255,Math.floor(ba*255));X[k]=bx;LP[k]=bl;}}}
  return{nx,ny,dX,dY,Z,M,E,A,X,LP,B};}
const msMin=(a,b)=>Math.abs(a)<Math.abs(b)?a:b;
function msBake(mode,dir,R,scale){msBake._c=msBake._c||{};const key=[mode,dir,Math.round(R*scale),R,scale].join('|');if(msBake._c[key])return msBake._c[key];
  const L=msLayout(mode),mirror=dir==='NE-SW'||dir==='E-W',dens=R*scale,G=msGrid(L,mirror,dens),{nx,ny,dX,dY,Z,M,E,A,X,LP,B}=G;
  /* extents */
  let syMin=1e9,syMax=-1e9,ixMin=1e9,ixMax=-1e9;for(let iy=0;iy<ny;iy++){const Y=B.y0+iy*dY;for(let ix=0;ix<nx;ix++){const z=Z[iy*nx+ix];if(z<0)continue;syMin=Math.min(syMin,0.58*Y-z);syMax=Math.max(syMax,0.58*Y);ixMin=Math.min(ixMin,ix);ixMax=Math.max(ixMax,ix);}}
  const padU=0.08,yTop=syMin-padU,x0w=B.x0+ixMin*dX-padU,W=Math.ceil((ixMax-ixMin)*1+padU*2*dens)+2,H=Math.ceil((syMax+0.12-yTop)*dens)+2,ox0=Math.round(-(x0w-B.x0)/dX)+0;
  const px0=ixMin-Math.round(padU*dens);
  const img=new Uint8ClampedArray(W*H*4),led=new Uint8ClampedArray(W*H*4),warm=new Uint8ClampedArray(W*H*4),ymin=new Int32Array(W).fill(H);
  const FH={1:0.115,2:0.23,3:0.335,4:0.425,5:0.075,6:0.095,7:0.16};if(mode==='side'){FH[1]=0.155;FH[2]=0.24;FH[3]=0.345;FH[4]=0.435;FH[5]=0.17;FH[7]=0.16;}
  const entr=L.entr;
  for(let iy=ny-1;iy>=0;iy--){const Y=B.y0+iy*dY,syg=(0.58*Y-yTop)*dens;
    for(let ix=ixMin;ix<=ixMax;ix++){const k=iy*nx+ix,z=Z[k];if(z<0)continue;const col=ix-px0;if(col<0||col>=W)continue;
      const syt=syg-z*dens,py0=Math.ceil(syt);if(py0>=ymin[col])continue;let py1=Math.min(Math.ceil(syg),ymin[col]);if(py1<=py0)continue;
      /* surface normal from the height field (min-mod differences so tier steps don't spike) */
      const zl=ix>0?Z[k-1]:-1,zr=ix<nx-1?Z[k+1]:-1,zu=iy>0?Z[k-nx]:-1,zd=iy<ny-1?Z[k+nx]:-1;
      const gl=zl>=0?(z-zl)/dX:1e9,gr=zr>=0?(zr-z)/dX:1e9,gu=zu>=0?(z-zu)/dY:1e9,gd=zd>=0?(zd-z)/dY:1e9;
      let zx=0,zy=0;if(gl<1e8&&gr<1e8)zx=Math.abs(gl-gr)<0.9?(gl+gr)/2:msMin(gl,gr);else if(gl<1e8)zx=gl;else if(gr<1e8)zx=gr;if(gu<1e8&&gd<1e8)zy=Math.abs(gu-gd)<0.9?(gu+gd)/2:msMin(gu,gd);else if(gu<1e8)zy=gu;else if(gd<1e8)zy=gd;
      zx=Math.max(-2.2,Math.min(2.2,zx));zy=Math.max(-2.2,Math.min(2.2,zy));
      const nl=Math.hypot(zx,zy,1),nxn=-zx/nl,nyn=-zy/nl,nzn=1/nl,m=M[k],e=E[k],aux=X[k];
      let base=MS_BASE[m]||[200,200,200];
      if(m===33){base=MS_FLOWER[Math.min(6,aux)]||[236,72,153];}
      else if(m===31){base=(aux>0&&aux<38)?[128,139,160]:base;}
      else if(m===30){base=(aux>0&&aux<90)?[62,76,112]:base;}
      let ndl=Math.max(0,nxn*MS_LIGHT[0]+nyn*MS_LIGHT[1]+nzn*MS_LIGHT[2]),amb=0.40+0.22*nzn,spec=0;const met=MS_METAL[m];if(met){const nh=Math.max(0,nxn*MS_HALF[0]+nyn*MS_HALF[1]+nzn*MS_HALF[2]);spec=Math.pow(nh,36)*0.5*met;}
      let sm=1;if(aux===1&&m<=7)sm=0.9;
      let r=base[0]*(amb*0.9+ndl*0.78)*sm+spec*210,g=base[1]*(amb*0.96+ndl*0.78)*sm+spec*215,b=base[2]*(amb*1.06+ndl*0.78)*sm+spec*230;
      let ed=0;if(e>0){ed=e/255;r=r*(1-ed)+120*ed;g=g*(1-ed)+245*ed;b=b*(1-ed)+255*ed;}
      const wallBelow=(zd<0)||(z-zd>0.014);
      for(let py=py0;py<py1;py++){const o=(py*W+col)*4;let cr,cg,cb,le=0,we=0;
        const lipWall=(m<=7&&LP[k]===1),oWall=(m>7&&wallBelow);if(!(lipWall||oWall)||py-syt<(lipWall?1.0:1.5)){cr=r;cg=g;cb=b;le=ed;}
        else{const zz=(syg-py)/dens,h0=FH[m];
          if(h0!==undefined&&m<=7){const top=h0-zz;let wr,wg,wb;const fl=zz<0.011&&m===1;
            if(top<0.011){wr=206;wg=214;wb=228;}
            else if(top<0.017){wr=104;wg=114;wb=140;}
            else if(top<0.026){wr=120;wg=245;wb=255;le=1;}
            else if(top<0.031){wr=70;wg=82;wb=112;}
            else if(fl){wr=150;wg=160;wb=178;}
            else{const ang=A[k]/255,mull=((ang*144)%1)<0.1,gt=Math.min(1,(top-0.031)/Math.max(0.02,h0-0.031));
              if(entr&&m===entr.tier&&ang>=entr.a0&&ang<=entr.a1&&top>0.036&&zz>0.016){const q=Math.min(1,zz/(h0*0.8)),f=1-q;wr=255*(0.92-0.12*f);wg=(165-90*f)*(0.75+0.45*q);wb=(46+18*q)*0.6;we=0.95;const cc=(ang-entr.a0)/(entr.a1-entr.a0);if(Math.abs(cc*6-Math.round(cc*6))<0.05){wr*=0.3;wg*=0.3;wb*=0.35;we=0.15;}}
              else if(entr&&m===entr.tier&&ang>=entr.a0-0.006&&ang<=entr.a1+0.006&&top<0.044){wr=120;wg=245;wb=255;le=1;}
              else{const gg=1-0.5*gt;wr=(mull?32:20)*gg+4;wg=(mull?48:34)*gg+7;wb=(mull?94:70)*gg+16;}}
            cr=wr*0.92;cg=wg*0.95;cb=wb*1.0;}
          else{cr=r*0.78;cg=g*0.78;cb=b*0.8;}}
        img[o]=cr;img[o+1]=cg;img[o+2]=cb;img[o+3]=255;
        if(le>0){led[o]=110;led[o+1]=240;led[o+2]=255;led[o+3]=Math.min(255,le*255);}
        if(we>0){warm[o]=255;warm[o+1]=140;warm[o+2]=40;warm[o+3]=Math.min(255,we*255);}}
      ymin[col]=py0;}}
  /* cast shadow on the ground, then assemble the canvases */
  const sh=new Uint8ClampedArray(W*H);for(let iy=0;iy<ny;iy+=1){const Y=B.y0+iy*dY;for(let ix=ixMin;ix<=ixMax;ix+=1){const z=Z[iy*nx+ix];if(z<0.04)continue;const Xs=B.x0+ix*dX+0.62*z,Ys=Y+0.5*z,sx=Math.round((Xs-B.x0)*dens)-px0-0,sy=Math.round((0.58*Ys-yTop)*dens);if(sx>=1&&sx<W-1&&sy>=1&&sy<H-1){const o=sy*W+sx;sh[o]=70;sh[o+1]=70;sh[o+W]=70;sh[o+W+1]=70;}}}
  const mk=(data)=>{const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.putImageData(new ImageData(data,W,H),0,0);return c;};
  const body=mk(img),ledC=mk(led),warmC=mk(warm),shRGBA=new Uint8ClampedArray(W*H*4);for(let i=0;i<W*H;i++){shRGBA[i*4]=14;shRGBA[i*4+1]=24;shRGBA[i*4+2]=40;shRGBA[i*4+3]=sh[i];}
  const shC=mk(shRGBA),out=document.createElement('canvas');out.width=W;out.height=H;const og=out.getContext('2d');
  og.save();if('filter' in og)og.filter='blur('+Math.max(1.5,dens*0.014).toFixed(1)+'px)';og.drawImage(shC,0,0);og.restore();og.drawImage(body,0,0);
  const glow=(src,col,blur)=>{const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.shadowColor=col;g.shadowBlur=blur;g.shadowOffsetX=W;g.drawImage(src,-W,0);g.drawImage(src,-W,0);return c;};
  const glowC=glow(ledC,'rgba(70,225,255,1)',Math.max(4,dens*0.045)),glowW=glow(warmC,'rgba(255,130,40,1)',Math.max(5,dens*0.06));
  /* sprite origin: where world (0,0), the midpoint of the two hex centres, falls */
  const ox=((0-x0w)*dens)/scale,oy=((0-yTop)*dens)/scale;
  return msBake._c[key]={body:out,led:ledC,glow:glowC,warm:warmC,glowW:glowW,w:W/scale,h:H/scale,ox:ox,oy:oy,scale:scale};}


/* ===== API ===== */
function msDrawSprite(ctx,cx,cy,R,mode,dir,o){o=o||{};const sc=o.scale||getBakeScale(),s=msBake(mode,dir,R,sc);
  ctx.drawImage(s.body,cx-s.ox,cy-s.oy,s.w,s.h);
  if(o.glow!==false){const t=o.t,k=(o.glowStrength===undefined?1:o.glowStrength),pulse=(t===undefined||t===null)?0.5:0.5+0.2*Math.sin(t*1.7)+0.07*Math.sin(t*4.3),pa=ctx.globalAlpha,pc=ctx.globalCompositeOperation;
    ctx.globalCompositeOperation='lighter';ctx.globalAlpha=pa*k*Math.min(1,pulse);ctx.drawImage(s.glow,cx-s.ox,cy-s.oy,s.w,s.h);
    ctx.globalAlpha=pa*k*0.55*Math.min(1,pulse+0.12);ctx.drawImage(s.glowW,cx-s.ox,cy-s.oy,s.w,s.h);
    ctx.globalAlpha=pa*k*0.28*Math.min(1,pulse);ctx.drawImage(s.led,cx-s.ox,cy-s.oy,s.w,s.h);
    ctx.globalAlpha=pa;ctx.globalCompositeOperation=pc;}}
function drawSpaceMountainDiag(ctx,cx,cy,R,o){o=o||{};msDrawSprite(ctx,cx,cy,R,'diag',o.dir==='NE-SW'?'NE-SW':'NW-SE',o);}
function drawSpaceMountainSide(ctx,cx,cy,R,o){o=o||{};msDrawSprite(ctx,cx,cy,R,'side',o.flip?'E-W':'W-E',o);}
/* optional: bake all three up front (about 150 ms each at R=100) so nothing hitches mid-game */
function prebakeSpaceMountain(R,scale){const sc=scale||getBakeScale();msBake('side','W-E',R,sc);msBake('diag','NW-SE',R,sc);msBake('diag','NE-SW',R,sc);}
/* footprint: the two tiles plus ground circles over everything the building and plaza cover, for keeping land scenery clear */
function spaceMountainFootprint(R,mode,dir){const L=msLayout(mode),m=(dir==='NE-SW'||dir==='E-W')?-1:1,ca=Math.cos(L.rot),sa=Math.sin(L.rot),B=L.bounds,t={m:0,e:0,ang:0,aux:0},c=[];
  for(let Y=B.y0;Y<=B.y1;Y+=0.17)for(let X=B.x0;X<=B.x1;X+=0.1){const xm=m*X,u=xm*ca+Y*sa,v=-xm*sa+Y*ca;let ok=false;for(const f of L.comps){const b=f.bb;if(b&&(u<b[0]||u>b[1]||v<b[2]||v>b[3]))continue;if(f(u,v,t)>=0){ok=true;break;}}if(ok)c.push({x:X*R,y:0.58*Y*R,r:R*0.11});}
  const hexes=mode==='side'?[[-0.866*R,0],[0.866*R,0]]:[[-0.433*R*m,-0.435*R],[0.433*R*m,0.435*R]];return{tiles:hexes,circles:c};}
window.footprintForTile=window.footprintForTile||function(fp,i){const t=fp.tiles[i];return fp.circles.map(c=>({x:c.x-t[0],y:c.y-t[1],r:c.r}));};
window.sceneryInFront=window.sceneryInFront||function(circles,x,y){let f=-Infinity;for(const c of circles){const dx=x-c.x;if(Math.abs(dx)<c.r)f=Math.max(f,c.y+Math.sqrt(c.r*c.r-dx*dx)/1.7);}return f>-Infinity&&y>f;};
return Object.freeze({ side: drawSpaceMountainSide, diag: drawSpaceMountainDiag, footprint: spaceMountainFootprint, prebake: prebakeSpaceMountain });
})();
