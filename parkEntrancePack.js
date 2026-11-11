(function(){
const FT_SKIN={};
/* ===== FLYING THEATER SKINS: shared toolkit. Projection: I(X,Y,Z)=[cx+(X-Y)*0.7S, cy+(X+Y)*0.35S - Z*S]; +Y face = left-front, +X face = right-front ===== */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const FK={
  sh(hex,a){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=c=>Math.max(0,Math.min(255,Math.round(a<0?c*(1+a):c+(255-c)*a)));return '#'+((1<<24)+(f(r)<<16)+(f(g)<<8)+f(b)).toString(16).slice(1);},
  mix(a,b,t){const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16),f=(s)=>Math.round(((A>>s)&255)*(1-t)+((B>>s)&255)*t);return '#'+((1<<24)+(f(16)<<16)+(f(8)<<8)+f(0)).toString(16).slice(1);},
  poly(g,pts,fill,stroke,lw){g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();if(fill){g.fillStyle=fill;g.fill();g.strokeStyle=fill;g.lineWidth=0.6;g.lineJoin='round';g.stroke();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.lineJoin='round';g.stroke();}},
  ln(g,a,b,col,w){g.strokeStyle=col;g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();},
  ell(g,p,rx,ry,fill,stroke,lw){g.beginPath();g.ellipse(p[0],p[1],Math.max(0.4,rx),Math.max(0.4,ry),0,0,7);if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();}},
  curve(g,pts,col,w,close,fill){g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));if(close)g.closePath();if(fill){g.fillStyle=fill;g.fill();}if(col){g.strokeStyle=col;g.lineWidth=w||1;g.lineJoin='round';g.lineCap='round';g.stroke();}},
  /* three-face box: top, +Y face (left), +X face (right) */
  box(g,I,x0,x1,y0,y1,z0,z1,cT,cL,cR,stroke,lw){FK.poly(g,[I(x0,y0,z1),I(x1,y0,z1),I(x1,y1,z1),I(x0,y1,z1)],cT,stroke,lw);FK.poly(g,[I(x0,y1,z0),I(x1,y1,z0),I(x1,y1,z1),I(x0,y1,z1)],cL,stroke,lw);FK.poly(g,[I(x1,y0,z0),I(x1,y1,z0),I(x1,y1,z1),I(x1,y0,z1)],cR,stroke,lw);},
  /* art on a vertical plane, local units = tenths of a world unit, x toward screen-right, y up */
  art(g,I,S,O,dx,dy,W,H,fn,clipPts,dark){const p0=I(O[0],O[1],O[2]),p1=I(O[0]+dx/10,O[1]+dy/10,O[2]);g.save();if(clipPts){g.beginPath();clipPts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.clip();}g.transform(p1[0]-p0[0],p1[1]-p0[1],0,-S/10,p0[0],p0[1]);fn(g,W,H);if(dark){g.fillStyle='rgba(8,12,28,'+dark+')';g.fillRect(-5,-5,W+10,H+10);}g.restore();},
  /* +Y face (left-front): from x0..x1 at y, z0..z1; optional clip polygon in [X,Z] pairs */
  faceY(g,I,S,x0,x1,y,z0,z1,fn,o){o=o||{};const clip=o.clip?o.clip.map(([X,Z])=>I(X,y,Z)):[I(x0,y,z0),I(x1,y,z0),I(x1,y,z1),I(x0,y,z1)];FK.art(g,I,S,[x0,y,z0],1,0,(x1-x0)*10,(z1-z0)*10,fn,clip,o.dark||0);},
  /* +X face (right-front): from y0..y1 at x; local x runs from the front corner (y1) back to y0 */
  faceX(g,I,S,x,y0,y1,z0,z1,fn,o){o=o||{};const clip=o.clip?o.clip.map(([Y,Z])=>I(x,Y,Z)):[I(x,y1,z0),I(x,y0,z0),I(x,y0,z1),I(x,y1,z1)];FK.art(g,I,S,[x,y1,z0],0,-1,(y1-y0)*10,(z1-z0)*10,fn,clip,o.dark===undefined?0.22:o.dark);},
  /* ground-plane art, local (u,v) tenths along +X / +Y */
  ground(g,I,S,x0,x1,y0,y1,fn,clip){const p0=I(x0,y0,0),px=I(x0+0.1,y0,0),py=I(x0,y0+0.1,0);g.save();g.beginPath();(clip||[I(x0,y0,0),I(x1,y0,0),I(x1,y1,0),I(x0,y1,0)]).forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.clip();g.transform(px[0]-p0[0],px[1]-p0[1],py[0]-p0[0],py[1]-p0[1],p0[0],p0[1]);fn(g,(x1-x0)*10,(y1-y0)*10);g.restore();},
  /* bilinear grid of cells between four screen points (u along P00->P10, v along P00->P01) */
  grid(g,P00,P10,P11,P01,rows,cols,fn){const L=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],Q=(u,v)=>L(L(P00,P10,u),L(P01,P11,u),v);for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){const r=fn(i,j,rows,cols);if(!r)continue;const pts=[Q(j/cols,i/rows),Q((j+1)/cols,i/rows),Q((j+1)/cols,(i+1)/rows),Q(j/cols,(i+1)/rows)];FK.poly(g,pts,r.fill,r.stroke,r.lw);}return Q;},
  txt(g,str,x,y,size,col,maxW){g.save();g.scale(1,-1);g.font='bold '+size+'px Arial Black, Arial, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle=col;g.fillText(str,x,-y,maxW);g.restore();}
};
/* ---- flat texture painters for art(): (g,W,H,...) y up ---- */
const FT_TEX={
  stone(g,W,H,base,seed,ch,joint){const r=mulberry(seed||1);ch=ch||7;g.fillStyle=base;g.fillRect(0,0,W,H);let row=0;for(let y=0;y<H;y+=ch,row++){let x=-(row%2)*ch*0.9;while(x<W){const w=ch*(1.3+r()*1.6);g.fillStyle=FK.sh(base,(r()-0.5)*0.22);g.fillRect(x+0.4,y+0.4,w-0.8,ch-0.8);g.fillStyle='rgba(255,255,255,.07)';g.fillRect(x+0.4,y+ch-1.4,w-0.8,0.9);x+=w;}}g.strokeStyle=joint||'rgba(20,20,30,.35)';g.lineWidth=0.7;for(let y=0;y<=H;y+=ch){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();}},
  planks(g,W,H,base,seed,pw,gap){const r=mulberry(seed||1);pw=pw||4;g.fillStyle=base;g.fillRect(0,0,W,H);for(let x=0;x<W;x+=pw){g.fillStyle=FK.sh(base,(r()-0.5)*0.2);g.fillRect(x+0.3,0,pw-0.6,H);if(r()<0.5){g.strokeStyle='rgba(30,16,6,.18)';g.lineWidth=0.5;g.beginPath();g.moveTo(x+pw*0.4,r()*H);g.lineTo(x+pw*0.5,r()*H);g.stroke();}}g.strokeStyle=gap||'rgba(20,10,4,.45)';g.lineWidth=0.8;for(let x=0;x<=W;x+=pw){g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke();}},
  logs(g,W,H,base,seed,ld){const r=mulberry(seed||1);ld=ld||6;g.fillStyle=FK.sh(base,-0.4);g.fillRect(0,0,W,H);for(let y=0;y<H;y+=ld){const c=FK.sh(base,(r()-0.5)*0.14);const gr=g.createLinearGradient(0,y,0,y+ld);gr.addColorStop(0,FK.sh(c,0.2));gr.addColorStop(0.5,c);gr.addColorStop(1,FK.sh(c,-0.35));g.fillStyle=gr;g.fillRect(0,y,W,ld-0.4);g.strokeStyle='rgba(255,230,190,.12)';g.lineWidth=0.5;for(let k=0;k<3;k++){const yy=y+ld*(0.25+k*0.25);g.beginPath();g.moveTo(r()*W*0.3,yy);g.lineTo(W*(0.5+r()*0.5),yy);g.stroke();}}},
  stucco(g,W,H,base,seed){const r=mulberry(seed||1);g.fillStyle=base;g.fillRect(0,0,W,H);for(let k=0;k<Math.floor(W*H/18);k++){g.fillStyle=r()<0.5?'rgba(255,255,255,.08)':'rgba(60,30,10,.07)';g.fillRect(r()*W,r()*H,1+r()*3,1+r()*2);}for(let k=0;k<3;k++){const x=r()*W,y=r()*H*0.8;const gr=g.createRadialGradient(x,y,0,x,y,W*0.25);gr.addColorStop(0,'rgba(90,50,20,.1)');gr.addColorStop(1,'rgba(90,50,20,0)');g.fillStyle=gr;g.fillRect(0,0,W,H);}},
  panels(g,W,H,base,seed,pw,ph,gap){const r=mulberry(seed||1);g.fillStyle=base;g.fillRect(0,0,W,H);for(let y=0;y<H;y+=ph)for(let x=0;x<W;x+=pw){g.fillStyle=FK.sh(base,(r()-0.5)*0.07);g.fillRect(x+0.4,y+0.4,pw-0.8,ph-0.8);}g.strokeStyle=gap||'rgba(20,30,50,.32)';g.lineWidth=0.7;for(let x=0;x<=W;x+=pw){g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke();}for(let y=0;y<=H;y+=ph){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();}},
  /* pointed / round arch cut-outs for windows and doors: draws a filled arch shape at x..x+w, y..y+h (spring at y+h-rise) */
  arch(g,x,y,w,h,fill,kind,rise){rise=rise===undefined?w*0.5:rise;g.beginPath();g.moveTo(x,y);g.lineTo(x,y+h-rise);if(kind==='point'){g.quadraticCurveTo(x,y+h-rise*0.2,x+w/2,y+h);g.quadraticCurveTo(x+w,y+h-rise*0.2,x+w,y+h-rise);}else if(kind==='flat'){g.lineTo(x,y+h);g.lineTo(x+w,y+h);}else{g.arc(x+w/2,y+h-rise,w/2,Math.PI,0);}g.lineTo(x+w,y);g.closePath();g.fillStyle=fill;g.fill();}
};
/* ---- shared building blocks ---- */
const FB={
  /* gable roof, ridge along Y: right slope (+X side) is textured with a grid; gable end drawn by the caller; returns slope corner points */
  slopeRight(g,I,xm,x1,y0,y1,zr,ze,rows,cols,fn){return FK.grid(g,I(xm,y0,zr),I(xm,y1,zr),I(x1,y1,ze),I(x1,y0,ze),rows,cols,fn);},
  disc(g,p,rx,ry,col,rim,lw){FK.ell(g,p,rx,ry,col,rim,lw);},
  /* a vertical cylinder (screen gradient) */
  cyl(g,I,S,X,Y,r,z0,z1,col,topCol){const b=I(X,Y,z0),t=I(X,Y,z1),rx=0.99*r*S,ry=0.495*r*S;const gr=g.createLinearGradient(b[0]-rx,0,b[0]+rx,0);gr.addColorStop(0,FK.sh(col,0.22));gr.addColorStop(0.45,col);gr.addColorStop(1,FK.sh(col,-0.38));g.beginPath();g.moveTo(b[0]-rx,b[1]);g.lineTo(t[0]-rx,t[1]);g.lineTo(t[0]+rx,t[1]);g.lineTo(b[0]+rx,b[1]);g.ellipse(b[0],b[1],rx,ry,0,0,Math.PI);g.closePath();g.fillStyle=gr;g.fill();if(topCol)FK.ell(g,t,rx,ry,topCol);return t;},
  /* a cone roof over a cylinder-ish base: apex at z1 */
  cone(g,I,S,X,Y,r,z0,z1,col,courses){const b=I(X,Y,z0),t=I(X,Y,z1),rx=0.99*r*S,ry=0.495*r*S;const gr=g.createLinearGradient(b[0]-rx,0,b[0]+rx,0);gr.addColorStop(0,FK.sh(col,0.2));gr.addColorStop(0.45,col);gr.addColorStop(1,FK.sh(col,-0.4));g.beginPath();g.moveTo(b[0]-rx,b[1]);g.lineTo(t[0],t[1]);g.lineTo(b[0]+rx,b[1]);g.ellipse(b[0],b[1],rx,ry,0,0,Math.PI);g.closePath();g.fillStyle=gr;g.fill();if(courses){g.strokeStyle='rgba(0,0,0,.22)';g.lineWidth=S*0.05;for(let k=1;k<courses;k++){const f=k/courses,cy=b[1]+(t[1]-b[1])*f,rr=rx*(1-f);g.beginPath();g.ellipse(b[0],cy,rr,rr*0.5,0,0,Math.PI);g.stroke();}}return t;},
  /* hemisphere dome from a base ellipse; gores optional; returns apex */
  dome(g,I,S,X,Y,r,z0,h,colFn,n,rib){const c=I(X,Y,z0),rx=0.99*r*S,ryb=0.495*r*S,hh=h*S;const sil=()=>{g.beginPath();g.moveTo(c[0]-rx,c[1]);g.quadraticCurveTo(c[0]-rx*1.12,c[1]-hh*0.42,c[0],c[1]-hh);g.quadraticCurveTo(c[0]+rx*1.12,c[1]-hh*0.42,c[0]+rx,c[1]);g.ellipse(c[0],c[1],rx,ryb,0,0,Math.PI,false);g.closePath();};g.save();sil();g.clip();n=n||12;for(let k=0;k<n;k++){const t0=-1+2*k/n,t1=-1+2*(k+1)/n,b0=[c[0]+rx*t0,c[1]+ryb*Math.sqrt(Math.max(0,1-t0*t0))],b1=[c[0]+rx*t1,c[1]+ryb*Math.sqrt(Math.max(0,1-t1*t1))];g.beginPath();g.moveTo(c[0],c[1]-hh);g.quadraticCurveTo(c[0]+rx*t0*1.12,c[1]-hh*0.42,b0[0],b0[1]);g.lineTo(b1[0],b1[1]);g.quadraticCurveTo(c[0]+rx*t1*1.12,c[1]-hh*0.42,c[0],c[1]-hh);g.fillStyle=colFn(k);g.fill();if(rib){g.strokeStyle=rib;g.lineWidth=S*0.06;g.stroke();}}const gr=g.createLinearGradient(c[0]-rx,0,c[0]+rx,0);gr.addColorStop(0,'rgba(255,255,255,.24)');gr.addColorStop(0.5,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(10,15,30,.44)');g.fillStyle=gr;g.fillRect(c[0]-rx,c[1]-hh,rx*2,hh+ryb);g.restore();return [c[0],c[1]-hh];},
  glow(g,p,r,col){const gr=g.createRadialGradient(p[0],p[1],0,p[0],p[1],r);gr.addColorStop(0,col);gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.beginPath();g.arc(p[0],p[1],r,0,7);g.fill();},
  /* a ground apron (paving) under the building and in front: hex-safe diamond */
  apron(g,I,S,x0,x1,y0,y1,col,edge,texFn){const d=[I(x0,y0,0),I(x1,y0,0),I(x1,y1,0),I(x0,y1,0)];FK.poly(g,d,col,edge,S*0.12);if(texFn)FK.ground(g,I,S,x0,x1,y0,y1,texFn);},
  shadow(g,I,S,x0,x1,y0,y1){g.save();g.translate(S*0.8,S*0.5);g.globalAlpha=0.24;FK.poly(g,[I(x0,y0,0),I(x1,y0,0),I(x1,y1,0),I(x0,y1,0)],'#0c1218');g.restore();}
};


/* ===== PARK ENTRANCE PACK: shared helpers on top of the skin toolkit (FK / FT_TEX / FB) ===== */
const PE_SKIN={},PE_ANIM={};
const PH={
  tri(b){return[FK.sh(b,0.16),b,FK.sh(b,-0.32)];},
  paving(g,W,H,base,seed,cs,joint){const r=mulberry(seed||1);cs=cs||5;g.fillStyle=base;g.fillRect(0,0,W,H);for(let y=0;y<H;y+=cs){const off=(((y/cs)|0)%2)?cs*0.5:0;for(let x=-off;x<W;x+=cs){const w=cs*(0.8+r()*0.4);g.fillStyle=FK.sh(base,(r()-0.5)*0.2);g.fillRect(x+0.4,y+0.4,w-0.8,cs-0.8);}}g.strokeStyle=joint||'rgba(30,30,30,.25)';g.lineWidth=0.5;for(let y=0;y<=H;y+=cs){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();}},
  speckle(g,W,H,base,seed,n,spread){const r=mulberry(seed||1);g.fillStyle=base;g.fillRect(0,0,W,H);for(let k=0;k<(n||W*H/10);k++){g.fillStyle=FK.sh(base,(r()-0.5)*(spread||0.3));g.fillRect(r()*W,r()*H,1+r()*2.2,1+r()*1.5);}},
  guests(g,I,S,list){list.slice().sort((a,b)=>(a[0]+a[1])-(b[0]+b[1])).forEach(([X,Y,col,skin,hat])=>{const b=I(X,Y,0);g.fillStyle='rgba(10,16,24,.22)';g.beginPath();g.ellipse(b[0]+S*0.12,b[1]+S*0.04,S*0.28,S*0.11,0,0,7);g.fill();g.fillStyle='#2a2e3a';g.fillRect(b[0]-S*0.1,b[1]-S*0.4,S*0.2,S*0.4);g.fillStyle=col;g.fillRect(b[0]-S*0.16,b[1]-S*0.8,S*0.32,S*0.46);g.fillStyle=skin||'#efc79e';g.beginPath();g.arc(b[0],b[1]-S*0.93,S*0.17,0,7);g.fill();if(hat){g.fillStyle=hat;g.beginPath();g.arc(b[0],b[1]-S*0.97,S*0.18,Math.PI,0);g.fill();}});},
  pole(g,I,S,X,Y,Z0,h,col,w){FK.ln(g,I(X,Y,Z0),I(X,Y,Z0+h),col||'#8e98a8',S*(w||0.09));},
  /* a pennant on a pole: pole top at Z0+h, streaming to the right of the screen */
  pennant(g,I,S,X,Y,Z0,h,col,len,hgt,wave){const t=I(X,Y,Z0+h),L=S*(len||1.5),H=S*(hgt||0.7),w=(wave||0)*S*0.1;PH.pole(g,I,S,X,Y,Z0,h,'#6b7380',0.09);FK.poly(g,[[t[0],t[1]],[t[0]+L*0.5,t[1]+H*0.1+w],[t[0]+L,t[1]+H*0.5+w*1.4],[t[0]+L*0.5,t[1]+H*0.9+w],[t[0],t[1]+H]],col);FK.ln(g,[t[0],t[1]+H*0.5],[t[0]+L*0.9,t[1]+H*0.5+w*1.3],FK.sh(col,-0.25),S*0.04);},
  /* bunting between two 3D points with a sag */
  bunting(g,I,S,A,B,sag,cols,n,size){n=n||8;size=size||0.45;let prev=null;for(let k=0;k<=n;k++){const f=k/n,X=A[0]+(B[0]-A[0])*f,Y=A[1]+(B[1]-A[1])*f,Z=A[2]+(B[2]-A[2])*f-sag*4*f*(1-f),p=I(X,Y,Z);if(prev)FK.ln(g,prev,p,'rgba(40,30,20,.55)',S*0.035);prev=p;}for(let k=0;k<n;k++){const f=(k+0.5)/n,X=A[0]+(B[0]-A[0])*f,Y=A[1]+(B[1]-A[1])*f,Z=A[2]+(B[2]-A[2])*f-sag*4*f*(1-f),p=I(X,Y,Z);FK.poly(g,[[p[0]-S*size*0.5,p[1]],[p[0]+S*size*0.5,p[1]],[p[0],p[1]+S*size*1.1]],cols[k%cols.length]);}},
  /* stone course lines over a cylinder already drawn */
  courses(g,I,S,X,Y,r,z0,z1,step,col){for(let z=z0+step;z<z1-0.01;z+=step){const c=I(X,Y,z);g.strokeStyle=col||'rgba(0,0,0,.2)';g.lineWidth=S*0.035;g.beginPath();g.ellipse(c[0],c[1],0.99*r*S,0.495*r*S,0,0,Math.PI);g.stroke();}},
  /* an extruded arch band in the XZ plane at Y (front face at Y+d/2): outer radius rx,rz, thickness th */
  archBand(g,I,S,cx,y,d,rx,rz,z0,th,cTop,cFront,t0,t1,n){n=n||24;t0=t0===undefined?0:t0;t1=t1===undefined?Math.PI:t1;const pt=(a,k,yy)=>[cx+Math.cos(a)*(rx-k),yy,z0+Math.sin(a)*(rz-k*rz/rx)];for(let i=0;i<n;i++){const a0=t0+(t1-t0)*i/n,a1=t0+(t1-t0)*(i+1)/n;
      FK.poly(g,[I(...pt(a0,0,y-d/2)),I(...pt(a1,0,y-d/2)),I(...pt(a1,0,y+d/2)),I(...pt(a0,0,y+d/2))],cTop);}
    for(let i=0;i<n;i++){const a0=t0+(t1-t0)*i/n,a1=t0+(t1-t0)*(i+1)/n;FK.poly(g,[I(...pt(a0,0,y+d/2)),I(...pt(a1,0,y+d/2)),I(...pt(a1,th,y+d/2)),I(...pt(a0,th,y+d/2))],typeof cFront==='function'?cFront(i,n):cFront);}},
  glowDot(g,p,r,col){FB.glow(g,p,r,col);},
  hexStar(g,p,r,col){g.fillStyle=col;g.beginPath();for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,rr=k%2?r*0.45:r;g.lineTo(p[0]+Math.cos(a)*rr,p[1]+Math.sin(a)*rr);}g.closePath();g.fill();},
  leafFan(g,p,len,n,col,spread){for(let k=0;k<n;k++){const a=-Math.PI/2+(k-(n-1)/2)*(spread||0.5)/Math.max(1,(n-1))*2;g.strokeStyle=FK.sh(col,(k%2?0.12:-0.12));g.lineWidth=len*0.14;g.lineCap='round';g.beginPath();g.moveTo(p[0],p[1]);g.quadraticCurveTo(p[0]+Math.cos(a)*len*0.55,p[1]+Math.sin(a)*len*0.7,p[0]+Math.cos(a+0.5)*len,p[1]+Math.sin(a)*len*0.55+len*0.25);g.stroke();}}
};
/* shared plaza: apron + a central path (guests walk along +Y toward the gate) */
PH.plaza=function(g,I,S,o){o=o||{};const x0=o.x0===undefined?-7:o.x0,x1=o.x1===undefined?7:o.x1,y0=o.y0===undefined?-6.8:o.y0,y1=o.y1===undefined?7:o.y1;
  FB.apron(g,I,S,x0,x1,y0,y1,o.col||'#b9b4a4',o.edge||'#8d887a',o.tex||((g,W,H)=>PH.paving(g,W,H,o.col||'#b9b4a4',o.seed||3,o.cs||6)));
  if(o.pathCol||o.pathTex)FK.ground(g,I,S,-1.5,1.5,y0+0.2,y1-0.2,o.pathTex||((g,W,H)=>PH.paving(g,W,H,o.pathCol,o.seed?o.seed+4:7,o.cs?o.cs*0.8:4.5)));};

/* carved interlace band (vertical), a pair of braided sine strands */
PH.knot=function(g,W,H,c1,c2,amp,per){amp=amp||W*0.28;per=per||14;[[c1,0],[c2,Math.PI]].forEach(([col,ph])=>{g.strokeStyle=col;g.lineWidth=Math.max(1,W*0.1);g.lineCap='round';g.beginPath();for(let y=0;y<=H;y+=1){const x=W/2+Math.sin(y/per*Math.PI*2+ph)*amp;y?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();});};
/* a pointed arch / round arch path for clipping and cut-outs */
PH.archPath=function(g,x,y,w,h,rise,kind){g.beginPath();g.moveTo(x,y);g.lineTo(x,y+h-rise);if(kind==='point'){g.quadraticCurveTo(x,y+h-rise*0.25,x+w/2,y+h);g.quadraticCurveTo(x+w,y+h-rise*0.25,x+w,y+h-rise);}else g.arc(x+w/2,y+h-rise,w/2,Math.PI,0);g.lineTo(x+w,y);g.closePath();};
PH.flame=function(g,p,s,t,k){const fl=Math.sin((t||0)*9+(k||0))*0.08+Math.sin((t||0)*14+(k||0)*2.3)*0.05;FB.glow(g,[p[0],p[1]-s*0.4],s*2.6,'rgba(255,190,80,.5)');g.fillStyle='#e8601c';g.beginPath();g.moveTo(p[0]-s*0.42,p[1]);g.quadraticCurveTo(p[0]-s*0.5,p[1]-s*0.9,p[0]+fl*s,p[1]-s*(1.7+fl));g.quadraticCurveTo(p[0]+s*0.5,p[1]-s*0.9,p[0]+s*0.42,p[1]);g.closePath();g.fill();g.fillStyle='#ffb52e';g.beginPath();g.moveTo(p[0]-s*0.26,p[1]);g.quadraticCurveTo(p[0]-s*0.3,p[1]-s*0.7,p[0]+fl*s*0.6,p[1]-s*1.25);g.quadraticCurveTo(p[0]+s*0.3,p[1]-s*0.7,p[0]+s*0.26,p[1]);g.closePath();g.fill();g.fillStyle='#fff3b0';g.beginPath();g.ellipse(p[0],p[1]-s*0.3,s*0.12,s*0.26,0,0,7);g.fill();};
/* a carved glyph cartouche: seed picks a mask, spiral or step-fret; col is the inlay */
PH.glyph=function(g,x,y,sz,seed,col){const k=seed%3,s=sz/2;g.save();g.translate(x,y);g.fillStyle='rgba(40,38,26,.28)';g.beginPath();g.moveTo(-s,-s*0.8);g.lineTo(s,-s*0.8);g.lineTo(s,s*0.8);g.lineTo(-s,s*0.8);g.closePath();g.fill();g.strokeStyle='rgba(255,255,240,.18)';g.lineWidth=0.6;g.strokeRect(-s,-s*0.8,sz,sz*0.8);
  g.strokeStyle='rgba(30,28,18,.6)';g.fillStyle=col;g.lineWidth=Math.max(0.8,sz*0.07);
  if(k===0){g.beginPath();g.arc(-s*0.4,-s*0.15,s*0.22,0,7);g.arc(s*0.4,-s*0.15,s*0.22,0,7);g.fill();g.beginPath();g.moveTo(-s*0.5,s*0.35);g.lineTo(-s*0.2,s*0.5);g.lineTo(s*0.2,s*0.5);g.lineTo(s*0.5,s*0.35);g.stroke();}
  else if(k===1){g.beginPath();for(let a=0;a<9;a+=0.3){const rr=s*0.08*a*0.9;g.lineTo(Math.cos(a)*rr,Math.sin(a)*rr*0.8);}g.stroke();}
  else{g.beginPath();g.moveTo(-s*0.6,s*0.5);g.lineTo(-s*0.6,-s*0.5);g.lineTo(-s*0.1,-s*0.5);g.lineTo(-s*0.1,0);g.lineTo(s*0.3,0);g.lineTo(s*0.3,-s*0.5);g.lineTo(s*0.65,-s*0.5);g.stroke();g.beginPath();g.arc(s*0.3,s*0.35,s*0.15,0,7);g.fill();}
  g.restore();};
/* sandstone strata: wavy horizontal bands with erosion streaks and cracks */
PH.strata=function(g,W,H,seed,pal){const r=mulberry(seed||1);pal=pal||['#c4673a','#b5552f','#d98a4e','#e6b27a','#9a4a2a','#cc7442'];let y=0,k=0;g.fillStyle=pal[0];g.fillRect(0,0,W,H);while(y<H){const h=2.5+r()*6.5,c=pal[(k++)%pal.length],ph=r()*6,amp=0.5+r()*1.4;g.fillStyle=FK.sh(c,(r()-0.5)*0.1);g.beginPath();g.moveTo(0,y);for(let x=0;x<=W;x+=3)g.lineTo(x,y+Math.sin(x*0.22+ph)*amp);g.lineTo(W,y+h+2);g.lineTo(0,y+h+2);g.closePath();g.fill();g.strokeStyle='rgba(60,24,10,.22)';g.lineWidth=0.6;g.beginPath();for(let x=0;x<=W;x+=3){const yy=y+Math.sin(x*0.22+ph)*amp;x?g.lineTo(x,yy):g.moveTo(x,yy);}g.stroke();y+=h;}
  for(let q=0;q<Math.max(3,W/7);q++){const x=r()*W,len=H*(0.25+r()*0.5),y0=r()*H;g.strokeStyle='rgba(70,28,12,.16)';g.lineWidth=0.8+r();g.beginPath();g.moveTo(x,y0);g.lineTo(x+(r()-0.5)*3,y0-len);g.stroke();}
  for(let q=0;q<4;q++){const x=r()*W,y0=r()*H;g.strokeStyle='rgba(50,18,6,.35)';g.lineWidth=0.7;g.beginPath();g.moveTo(x,y0);g.lineTo(x+(r()-0.5)*8,y0+(r()-0.5)*6);g.lineTo(x+(r()-0.5)*14,y0+(r()-0.5)*5);g.stroke();}
  g.fillStyle='rgba(30,10,4,.08)';g.fillRect(0,H*0.82,W,H*0.18);};
/* a rounded boulder blob in screen space */
PH.boulder=function(g,p,w,h,base,seed){const r=mulberry(seed||1);const pts=[];const n=9;for(let k=0;k<n;k++){const a=Math.PI*2*k/n,rr=0.82+r()*0.3;pts.push([p[0]+Math.cos(a)*w*rr,p[1]+Math.sin(a)*h*rr]);}
  const gr=g.createLinearGradient(p[0]-w,p[1]-h,p[0]+w,p[1]+h);gr.addColorStop(0,FK.sh(base,0.2));gr.addColorStop(0.55,base);gr.addColorStop(1,FK.sh(base,-0.38));g.fillStyle=gr;g.beginPath();pts.forEach((q,i)=>{const nx=pts[(i+1)%n],mx=(q[0]+nx[0])/2,my=(q[1]+nx[1])/2;i?g.quadraticCurveTo(q[0],q[1],mx,my):g.moveTo(mx,my);});g.closePath();g.fill();g.strokeStyle='rgba(40,16,6,.18)';g.lineWidth=0.7;g.stroke();};
PH.cactus=function(g,I,S,X,Y,h,arms){const b=I(X,Y,0);FK.ell(g,[b[0]+S*0.15,b[1]+S*0.05],S*0.5,S*0.2,'rgba(10,16,10,.25)');const col='#4f8a4a';FB.cyl(g,I,S,X,Y,0.34,0,h,col,'#5a9a54');(arms||[]).forEach(([dx,dy,z,len])=>{const a=I(X,Y,z),c=I(X+dx*0.5,Y+dy*0.5,z+0.1),d=I(X+dx*0.65,Y+dy*0.65,z+len);g.strokeStyle='#3f7a3d';g.lineWidth=S*0.3;g.lineCap='round';g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(c[0],c[1]);g.lineTo(d[0],d[1]);g.stroke();g.strokeStyle='#5a9a54';g.lineWidth=S*0.16;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(c[0],c[1]);g.lineTo(d[0],d[1]);g.stroke();});};

/* soft ground shadow that follows the footprint (replaces the hard rectangle) */
FB.shadow=function(g,I,S,x0,x1,y0,y1){const cx=(x0+x1)/2,cy=(y0+y1)/2,p0=I(cx,cy,0),px=I(cx+1,cy,0),py=I(cx,cy+1,0);g.save();g.translate(S*0.7,S*0.45);g.transform(px[0]-p0[0],px[1]-p0[1],py[0]-p0[0],py[1]-p0[1],p0[0],p0[1]);g.scale((x1-x0)/2,(y1-y0)/2);const gr=g.createRadialGradient(0,0,0,0,0,1);gr.addColorStop(0,'rgba(12,18,26,.34)');gr.addColorStop(0.6,'rgba(12,18,26,.2)');gr.addColorStop(1,'rgba(12,18,26,0)');g.fillStyle=gr;g.fillRect(-1.1,-1.1,2.2,2.2);g.restore();};

/* ====================== MEDIEVAL: a gatehouse with the portcullis raised, round towers under cone roofs and pennants ====================== */
PE_SKIN.medieval=function(g,I,S,o){const A=o.A,stone='#aaa597',[sT,sL,sR]=PH.tri(stone),GY=-1.2,r=mulberry(5);
  FB.shadow(g,I,S,-6.8,6.8,GY-2.0,GY+2.0);
  /* moat strips either side of the bridge, with a stone kerb */
  [[-6.8,-1.85],[1.85,6.8]].forEach(([a,b])=>{FK.poly(g,[I(a,GY+1.5,0.02),I(b,GY+1.5,0.02),I(b,GY+3.3,0.02),I(a,GY+3.3,0.02)],'#4f7f95');FK.ground(g,I,S,a,b,GY+1.5,GY+3.3,(g,W,H)=>{g.fillStyle='rgba(255,255,255,.1)';for(let k=0;k<22;k++){g.fillRect(((k*37)%W),((k*53)%H),5,0.8);}});FK.ln(g,I(a,GY+3.3,0.02),I(b,GY+3.3,0.02),'#8c8979',S*0.2);FK.ln(g,I(b,GY+1.5,0.02),I(b,GY+3.3,0.02),'#8c8979',S*0.2);});
  const merlons=(x0,x1,y,z,n,dx)=>{for(let k=0;k<n;k++){const X=x0+(x1-x0)*(k+0.5)/n;FK.box(g,I,X-dx,X+dx,y-0.55,y,z,z+0.7,sT,sL,sR);}};
  const wing=(x0,x1)=>{FK.box(g,I,x0,x1,GY-0.9,GY+0.9,0,3.3,sT,sL,sR);FK.faceY(g,I,S,x0,x1,GY+0.9,0,3.3,(g,W,H)=>{FT_TEX.stone(g,W,H,stone,x0*7+11,6.5,'rgba(30,30,30,.4)');g.fillStyle='rgba(20,18,12,.55)';for(let k=0;k<3;k++)g.fillRect(W*(0.2+k*0.3),H*0.5,1.2,6);},{dark:0});FK.faceX(g,I,S,x1,GY-0.9,GY+0.9,0,3.3,(g,W,H)=>FT_TEX.stone(g,W,H,stone,x1*5+3,6.5),{});merlons(x0,x1,GY+0.9,3.3,3,0.36);};
  const tower=(X)=>{const Y=GY,rr=1.55,cap=stone;
    FB.cyl(g,I,S,X,Y,rr,0,6.4,'#a9a496');PH.courses(g,I,S,X,Y,rr,0,6.4,0.8,'rgba(20,20,20,.22)');
    /* block texture via vertical joints */g.save();g.globalAlpha=0.35;for(let z=0.4;z<6.2;z+=0.8)for(let a=0.1;a<Math.PI;a+=0.42){const aa=a+((Math.round(z/0.8))%2)*0.2,p=I(X+Math.cos(aa)*rr*0.99,Y+Math.sin(aa)*rr*0.99,z),q=I(X+Math.cos(aa)*rr*0.99,Y+Math.sin(aa)*rr*0.99,z+0.8);FK.ln(g,p,q,'rgba(20,20,20,.5)',S*0.03);}g.restore();
    [55,80,105,130].forEach((deg,i)=>{const a=deg*Math.PI/180,p=I(X+Math.cos(a)*rr,Y+Math.sin(a)*rr,2.4+((i%2)?1.6:0));g.fillStyle='#17110c';g.fillRect(p[0]-S*0.06,p[1]-S*0.34,S*0.12,S*0.68);});
    /* corbelled battlement ring */
    FB.cyl(g,I,S,X,Y,rr+0.22,6.4,7.0,'#8f8a7c','#9b9686');for(let k=0;k<9;k++){const a=(k/8)*Math.PI*1.04,p=I(X+Math.cos(a)*(rr+0.2),Y+Math.sin(a)*(rr+0.2),7.0);FK.box(g,I,X+Math.cos(a)*(rr+0.2)-0.25,X+Math.cos(a)*(rr+0.2)+0.25,Y+Math.sin(a)*(rr+0.2)-0.25,Y+Math.sin(a)*(rr+0.2)+0.25,7.0,7.5,sT,sL,sR);}
    /* the cone roof: land-colour tiles, flaring eave, a gilded finial and a pennant */
    const ap=FB.cone(g,I,S,X,Y,rr+0.55,7.0,11.4,A,6);FK.ell(g,I(X,Y,7.0),(rr+0.55)*0.99*S,(rr+0.55)*0.495*S,null,'rgba(0,0,0,.25)',S*0.08);
    g.save();g.globalAlpha=0.28;for(let k=0;k<14;k++){const a=Math.PI*(k/13),b=I(X+Math.cos(a)*(rr+0.55),Y+Math.sin(a)*(rr+0.55),7.0);FK.ln(g,b,ap,'#000',S*0.03);}g.restore();
    FK.ell(g,ap,S*0.14,S*0.14,'#e8c04a');PH.pole(g,I,S,X,Y,11.4,1.6,'#6b7380',0.09);};
  /* painter's order: left wing and tower, the gatehouse, right wing and tower, then the things in front */
  wing(-6.8,-5.5);tower(-4.0);
  FK.box(g,I,-2.7,2.7,GY-1.5,GY+1.5,0,6.0,sT,sL,sR);
  FK.faceY(g,I,S,-2.7,2.7,GY+1.5,0,6.0,(g,W,H)=>{FT_TEX.stone(g,W,H,stone,41,6.4,'rgba(30,28,24,.4)');
    /* the arch and the passage */const ax=11,aw=32,ah=40;PH.archPath(g,ax-2,0,aw+4,ah+3,16,'round');g.fillStyle='#7d7868';g.fill();PH.archPath(g,ax,0,aw,ah,16,'round');const gr=g.createLinearGradient(0,0,0,ah);gr.addColorStop(0,'#3d3326');gr.addColorStop(0.5,'#1a140e');gr.addColorStop(1,'#0c0907');g.fillStyle=gr;g.fill();
    g.fillStyle='rgba(255,226,160,.35)';g.fillRect(ax+aw*0.3,0,aw*0.4,4);
    /* the portcullis, raised into the arch: iron grid with spiked ends */g.save();PH.archPath(g,ax,0,aw,ah,16,'round');g.clip();g.strokeStyle='#4a4e57';g.lineWidth=1.5;for(let x=ax+2;x<ax+aw;x+=3.6){g.beginPath();g.moveTo(x,ah+2);g.lineTo(x,ah-17);g.stroke();g.fillStyle='#4a4e57';g.beginPath();g.moveTo(x-1.1,ah-17);g.lineTo(x+1.1,ah-17);g.lineTo(x,ah-21);g.closePath();g.fill();}for(let y=ah-15;y<ah+2;y+=4.5){g.beginPath();g.moveTo(ax,y);g.lineTo(ax+aw,y);g.stroke();}g.restore();
    /* arch moulding */g.strokeStyle='#6e6a5c';g.lineWidth=1.6;PH.archPath(g,ax-1,0,aw+2,ah+1.5,16.3,'round');g.stroke();
    /* shield plaque above the arch, a machicolation band and heraldic banners */
    g.fillStyle='#d9d3c0';g.beginPath();g.moveTo(W/2-4.4,ah+5.5);g.lineTo(W/2+4.4,ah+5.5);g.lineTo(W/2+4.4,ah+10);g.quadraticCurveTo(W/2+4.4,ah+14,W/2,ah+15.5);g.quadraticCurveTo(W/2-4.4,ah+14,W/2-4.4,ah+10);g.closePath();g.fill();g.fillStyle=A;g.beginPath();g.moveTo(W/2-3.4,ah+6.5);g.lineTo(W/2+3.4,ah+6.5);g.lineTo(W/2+3.4,ah+10);g.quadraticCurveTo(W/2+3.4,ah+13,W/2,ah+14.2);g.quadraticCurveTo(W/2-3.4,ah+13,W/2-3.4,ah+10);g.closePath();g.fill();g.fillStyle='#f4e7c0';g.fillRect(W/2-0.9,ah+6.5,1.8,8);g.fillRect(W/2-3.4,ah+9.6,6.8,1.7);
    g.fillStyle='#3a342a';for(let x=2;x<W-2;x+=5.2){g.beginPath();g.moveTo(x,H-9);g.lineTo(x+3.4,H-9);g.lineTo(x+3.4,H-5);g.quadraticCurveTo(x+1.7,H-2.5,x,H-5);g.closePath();g.fill();}g.fillStyle='rgba(0,0,0,.18)';g.fillRect(0,H-10,W,1.2);
    [ax-7.5,ax+aw+2.3].forEach(x=>{g.fillStyle=A;g.beginPath();g.moveTo(x,H-10);g.lineTo(x+5.2,H-10);g.lineTo(x+5.2,H-34);g.lineTo(x+2.6,H-30);g.lineTo(x,H-34);g.closePath();g.fill();g.fillStyle='#f4e7c0';g.beginPath();g.arc(x+2.6,H-21,1.5,0,7);g.fill();});},{dark:0});
  FK.faceX(g,I,S,2.7,GY-1.5,GY+1.5,0,6.0,(g,W,H)=>FT_TEX.stone(g,W,H,stone,13,6.4),{});
  merlons(-2.7,2.7,GY+1.5,6.0,6,0.36);
  wing(5.5,6.8);tower(4.0);
  /* the lowered drawbridge with its chains and iron-shod rail */
  FK.box(g,I,-1.6,1.6,GY+1.5,GY+3.8,0.05,0.28,'#9a7448','#7b5a36','#5f4528');FK.ground(g,I,S,-1.6,1.6,GY+1.5,GY+3.8,(g,W,H)=>{FT_TEX.planks(g,H,W,'#a07a4c',9,5);},[I(-1.6,GY+1.5,0.28),I(1.6,GY+1.5,0.28),I(1.6,GY+3.8,0.28),I(-1.6,GY+3.8,0.28)]);
  FK.faceY(g,I,S,-1.6,1.6,GY+3.8,0.05,0.28,(g,W,H)=>FT_TEX.planks(g,W,H,'#7b5a36',2,5),{dark:0});
  [-1.5,1.5].forEach(X=>{FK.ln(g,I(X,GY+3.8,0.3),I(X,GY+1.55,4.6),'#3b3f46',S*0.07);FK.ln(g,I(X,GY+3.75,0.3),I(X,GY+1.55,4.55),'#6b7078',S*0.03);});
  /* braziers either side of the bridge head */
  [[-2.6,GY+3.9],[2.6,GY+3.9]].forEach(([X,Y],i)=>{PH.pole(g,I,S,X,Y,0,1.7,'#3a3d44',0.14);const t=I(X,Y,1.8);FK.ell(g,t,S*0.42,S*0.2,'#2a2c32');FK.ell(g,[t[0],t[1]-S*0.04],S*0.32,S*0.15,'#6a2a14');});
  PH.guests(g,I,S,[[-0.3,GY+4.6,'#3b6ea8'],[0.5,GY+5.6,'#c9a227',null,'#7a2a22'],[-0.5,GY+6.5,'#7a2a22'],[0.2,GY+3.0,'#2e7d4f',null,'#5a3a22'],[-0.1,GY+0.2,'#9a6bb5']]);
};
PE_ANIM.medieval=function(g,I,S,o,t){const GY=-1.2;[-4.0,4.0].forEach((X,k)=>{const b=I(X,GY,11.4+1.6),w=Math.sin(t*3+k*1.7)*S*0.12;g.fillStyle=o.A;g.beginPath();g.moveTo(b[0],b[1]);g.quadraticCurveTo(b[0]+S*0.9,b[1]+S*0.05+w,b[0]+S*1.8,b[1]+S*0.42+w*1.5);g.quadraticCurveTo(b[0]+S*0.9,b[1]+S*0.55+w,b[0],b[1]+S*0.85);g.closePath();g.fill();g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=S*0.04;g.beginPath();g.moveTo(b[0],b[1]+S*0.42);g.quadraticCurveTo(b[0]+S*0.9,b[1]+S*0.3+w,b[0]+S*1.7,b[1]+S*0.42+w*1.4);g.stroke();});[-2.6,2.6].forEach((X,i)=>{const t0=I(X,GY+3.9,1.8);PH.flame(g,[t0[0],t0[1]-S*0.05],S*0.5,t,i);});};
/* ====================== NORDIC: a timber gate under a shingled roof with carved dragon heads at the gable ends ====================== */
PE_SKIN.nordic=function(g,I,S,o){const A=o.A,wood='#4b3628',woodL='#6a4c37',woodD='#2f2118',ochre='#c98a3a',GY=-0.8,r=mulberry(9);
  FB.shadow(g,I,S,-6.8,6.8,GY-1.8,GY+2.0);
  const post=(X)=>{FK.box(g,I,X-0.6,X+0.6,GY-0.6,GY+0.6,0,7.6,woodL,wood,woodD);
    FK.faceY(g,I,S,X-0.6,X+0.6,GY+0.6,0,7.6,(g,W,H)=>{FT_TEX.planks(g,W,H,wood,X*3+5,3,'rgba(10,6,4,.5)');for(let y=14;y<H-10;y+=22){g.save();g.translate(0,y);PH.knot(g,W,18,ochre,A,W*0.3,9);g.restore();}g.fillStyle=ochre;g.fillRect(0,H*0.5-1,W,2);},{dark:0});
    FK.faceX(g,I,S,X+0.6,GY-0.6,GY+0.6,0,7.6,(g,W,H)=>{FT_TEX.planks(g,W,H,wood,X*5+1,3);},{});
    /* stone footing */FK.box(g,I,X-0.72,X+0.72,GY-0.72,GY+0.72,0,0.45,'#7d7a70','#5f5c53','#48463f');};
  /* palisade wings */
  const palisade=(x0,x1)=>{for(let X=x0;X<x1;X+=0.46){const h=3.0+((X*7)%1)*0.5;FK.box(g,I,X,X+0.4,GY-0.3,GY+0.1,0,h,'#6a4c37','#4f382a','#382719');const t=I(X+0.2,GY+0.1,h);FK.poly(g,[I(X,GY+0.1,h),I(X+0.4,GY+0.1,h),I(X+0.2,GY+0.1,h+0.7)],'#4f382a');}FK.ln(g,I(x0,GY+0.12,2.0),I(x1,GY+0.12,2.0),woodD,S*0.1);};
  palisade(-6.8,-4.1);post(-3.2);
  /* crossbeam with hung round shields */
  FK.box(g,I,-3.9,3.9,GY-0.5,GY+0.5,5.3,6.4,woodL,wood,woodD);
  FK.faceY(g,I,S,-3.9,3.9,GY+0.5,5.3,6.4,(g,W,H)=>{FT_TEX.planks(g,W,H,wood,19,3.4,'rgba(10,6,4,.5)');g.save();g.translate(0,H-7);for(let x=3;x<W-3;x+=9){g.save();g.translate(x,0);g.fillStyle=ochre;g.beginPath();g.arc(0,3,1.2,0,7);g.fill();g.restore();}g.restore();[8,24,40,56,70].forEach((x,i)=>{g.fillStyle=[A,'#e9dfc4',ochre,A,'#e9dfc4'][i];g.beginPath();g.arc(x,H*0.4,4.2,0,7);g.fill();g.fillStyle='rgba(255,255,255,.3)';g.beginPath();g.arc(x-1,H*0.4+1,3,0,7);g.fill();g.fillStyle='#bcc0c8';g.beginPath();g.arc(x,H*0.4,1.3,0,7);g.fill();g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=0.6;g.beginPath();g.arc(x,H*0.4,4.2,0,7);g.stroke();});},{dark:0});
  FK.box(g,I,-3.9,3.9,GY-0.45,GY+0.45,3.9,4.3,woodL,wood,woodD);
  /* hanging banners */[[-1.5],[1.5]].forEach(([X])=>FK.faceY(g,I,S,X-0.4,X+0.4,GY+0.48,2.7,5.3,(g,W,H)=>{g.fillStyle=A;g.beginPath();g.moveTo(0,H);g.lineTo(W,H);g.lineTo(W,H*0.18);g.lineTo(W/2,0);g.lineTo(0,H*0.18);g.closePath();g.fill();g.strokeStyle='#e9dfc4';g.lineWidth=1.2;g.beginPath();g.moveTo(W/2,H*0.7);g.lineTo(W/2,H*0.2);g.moveTo(W*0.22,H*0.55);g.lineTo(W/2,H*0.7);g.lineTo(W*0.78,H*0.55);g.stroke();},{dark:0}));
  /* the shingled gable roof, ridge along X */
  const rz0=7.1,rz1=9.5,y0=GY-1.7,y1=GY+1.7,xa=-4.6,xb=4.6;
  FK.poly(g,[I(xb,y0,rz0),I(xb,y1,rz0),I(xb,GY,rz1)],'#3d2b1f');
  FK.grid(g,I(xa,y1,rz0),I(xb,y1,rz0),I(xb,GY,rz1),I(xa,GY,rz1),5,26,(i,j,R,C)=>({fill:FK.sh('#5b4331',((i*7+j*3)%5)*0.045-0.08+(i%2?0.03:0)),stroke:'rgba(20,10,4,.35)',lw:0.5}));
  FK.ln(g,I(xa,y1,rz0),I(xb,y1,rz0),woodD,S*0.18);FK.ln(g,I(xa,GY,rz1),I(xb,GY,rz1),'#6e5039',S*0.2);FK.ln(g,I(xb,y1,rz0),I(xb,GY,rz1),'#2c1f16',S*0.16);
  g.save();g.beginPath();[I(xb,y0,rz0),I(xb,y1,rz0),I(xb,GY,rz1)].forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.clip();g.strokeStyle=ochre;g.lineWidth=S*0.07;const q0=I(xb,GY,rz1-0.5);for(let k=0;k<4;k++){const a=I(xb,GY-1.2+k*0.8,rz0+0.2),b=I(xb,GY-0.5+k*0.8,rz0+1.2);FK.ln(g,a,b,'rgba(201,138,58,.65)',S*0.06);}g.restore();
  /* the dragon heads: carved prows rising from both ends of the ridge */
  const dragon=(p,s,dir)=>{const X=(x,y)=>[p[0]+dir*x*s,p[1]+y*s];const body=[[0,0],[0.3,-1.2],[0.15,-2.3],[0.5,-3.0],[1.25,-3.35],[2.35,-3.15],[2.9,-2.85],[2.5,-2.6],[2.9,-2.35],[2.2,-2.25],[1.7,-1.9],[1.35,-1.5],[1.15,-0.8],[1.3,0]];
    g.fillStyle=woodD;g.beginPath();body.forEach(([x,y],i)=>{const q=X(x+0.14,y+0.14);i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]);});g.closePath();g.fill();
    const gr=g.createLinearGradient(p[0],p[1]-3.4*s,p[0]+dir*3*s,p[1]);gr.addColorStop(0,'#7a5a42');gr.addColorStop(0.5,'#5a4231');gr.addColorStop(1,'#3b2a1f');g.fillStyle=gr;g.beginPath();body.forEach(([x,y],i)=>{const q=X(x,y);i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]);});g.closePath();g.fill();
    g.fillStyle=A;g.beginPath();[[1.35,-2.55],[2.4,-2.55],[2.0,-2.35],[1.5,-2.2]].forEach(([x,y],i)=>{const q=X(x,y);i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]);});g.closePath();g.fill();
    g.fillStyle='#f1e8cf';for(let k=0;k<3;k++){const q=X(1.65+k*0.28,-2.48),q2=X(1.72+k*0.28,-2.22);g.beginPath();g.moveTo(q[0],q[1]);g.lineTo(q2[0],q2[1]);g.lineTo(X(1.8+k*0.28,-2.45)[0],X(1.8+k*0.28,-2.45)[1]);g.closePath();g.fill();}
    g.strokeStyle=ochre;g.lineWidth=s*0.11;g.lineCap='round';g.beginPath();[[0.3,-0.4],[0.55,-0.9]].forEach(()=>{});for(let k=0;k<5;k++){const q=X(0.55,-0.4-k*0.45);g.beginPath();g.arc(q[0],q[1],s*0.2,Math.PI*(dir>0?0.1:0.9),Math.PI*(dir>0?0.9:0.1+1),dir<0);g.stroke();}
    g.fillStyle='#f4d58a';const e=X(1.35,-3.0);g.beginPath();g.arc(e[0],e[1],s*0.17,0,7);g.fill();g.fillStyle='#1a1008';g.beginPath();g.arc(e[0]+dir*s*0.04,e[1],s*0.08,0,7);g.fill();
    g.fillStyle=woodD;g.beginPath();g.moveTo(X(0.2,-3.0)[0],X(0.2,-3.0)[1]);g.lineTo(X(-0.55,-3.85)[0],X(-0.55,-3.85)[1]);g.lineTo(X(0.55,-3.25)[0],X(0.55,-3.25)[1]);g.closePath();g.fill();g.beginPath();g.moveTo(X(0.7,-3.3)[0],X(0.7,-3.3)[1]);g.lineTo(X(0.2,-4.2)[0],X(0.2,-4.2)[1]);g.lineTo(X(1.05,-3.45)[0],X(1.05,-3.45)[1]);g.closePath();g.fill();};
  dragon(I(xa,GY,rz1),S*0.92,-1);
  post(3.2);palisade(4.1,6.8);
  dragon(I(xb,GY,rz1),S*0.92,1);
  /* torches and a brazier either side of the path */
  [[-2.2,GY+2.7],[2.2,GY+2.7]].forEach(([X,Y],i)=>{PH.pole(g,I,S,X,Y,0,2.2,woodD,0.14);const t=I(X,Y,2.35);FK.ell(g,t,S*0.3,S*0.14,'#3a3d44');FK.ell(g,[t[0],t[1]-S*0.03],S*0.22,S*0.1,'#6a2a14');});
  [[-3.9,GY+2.4],[3.9,GY+2.4]].forEach(([X,Y],i)=>{[[-0.28,0],[0.28,0],[0,0.28]].forEach(([dx,dy])=>FK.ln(g,I(X+dx,Y+dy,0),I(X+dx*0.4,Y+dy*0.4,1.25),'#2e3036',S*0.09));const t=I(X,Y,1.3);FK.ell(g,t,S*0.45,S*0.22,'#3a3d44');FK.ell(g,[t[0],t[1]-S*0.04],S*0.34,S*0.16,'#6a2a14');});
  PH.guests(g,I,S,[[-0.3,GY+3.4,'#2f5f8a',null,'#6b6258'],[0.6,GY+4.3,'#7a2a22',null,'#8c8272'],[-0.5,GY+5.3,'#c9a227',null,'#6b6258'],[0.2,GY+2.0,'#3a6a4a'],[-0.2,GY+6.3,'#a14a2a',null,'#8c8272']]);
};
PE_ANIM.nordic=function(g,I,S,o,t){const GY=-0.8;[-2.2,2.2].forEach((X,i)=>{const p=I(X,GY+2.7,2.35);PH.flame(g,[p[0],p[1]-S*0.04],S*0.4,t,i);});[-3.9,3.9].forEach((X,i)=>{const p=I(X,GY+2.4,1.3);PH.flame(g,[p[0],p[1]-S*0.06],S*0.45,t,i+4);});};

/* ====================== JUNGLE: a stepped Mayan stone archway with a corbelled vault, roof comb, vines and torches ====================== */
PE_SKIN.jungle=function(g,I,S,o){const A=o.A,st='#b4ae93',[sT,sL,sR]=PH.tri(st),GY=-0.6,jade=A,gold='#d9b04a',r=mulberry(14);
  FB.shadow(g,I,S,-6.8,6.8,GY-2.2,GY+2.6);
  /* the platform and three steps */
  FK.box(g,I,-5.8,5.8,GY-1.9,GY+1.9,0,0.9,sT,sL,sR);FK.faceY(g,I,S,-5.8,5.8,GY+1.9,0,0.9,(g,W,H)=>{FT_TEX.stone(g,W,H,st,31,5.5,'rgba(30,30,20,.45)');g.fillStyle='rgba(80,120,50,.3)';for(let k=0;k<14;k++)g.fillRect(k*W/14+((k*7)%5),H-3,W/18,3);},{dark:0});
  FK.faceX(g,I,S,5.8,GY-1.9,GY+1.9,0,0.9,(g,W,H)=>FT_TEX.stone(g,W,H,st,33,5.5),{});
  for(let i=2;i>=0;i--){const ya=GY+1.9+0.55*(2-i),yb=ya+0.55,h=0.3*(i+1);FK.box(g,I,-2.0,2.0,ya,yb,0,h,'#c5bfa4','#a9a38a','#8a8470');FK.faceY(g,I,S,-2.0,2.0,yb,0,h,(g,W,H)=>FT_TEX.stone(g,W,H,'#aaa48a',50+i,4,'rgba(30,30,20,.4)'),{dark:0});}
  /* stepped pylons with carved panels */
  const pylon=(s)=>{[[2.0,5.5,1.65,0.9,3.1],[2.45,5.05,1.4,3.1,5.0],[2.85,4.65,1.15,5.0,6.7]].forEach(([xi,xo,hy,z0,z1],li)=>{const x0=s>0?xi:-xo,x1=s>0?xo:-xi;FK.box(g,I,x0,x1,GY-hy,GY+hy,z0,z1,sT,sL,sR);
      FK.faceY(g,I,S,x0,x1,GY+hy,z0,z1,(g,W,H)=>{FT_TEX.stone(g,W,H,st,li*9+(s>0?3:5),7,'rgba(30,30,20,.4)');const n=Math.max(1,Math.round(W/17));for(let k=0;k<n;k++)PH.glyph(g,W*(k+0.5)/n,H/2,Math.min(W/n*0.8,H*0.62),li+k+(s>0?1:0),jade);g.fillStyle='rgba(76,122,52,.4)';for(let k=0;k<22;k++){const x=(k*37+li*11)%W;g.fillRect(x,H-2-(k%3),3,2+(k%3));}g.fillStyle='rgba(76,122,52,.22)';g.fillRect(0,0,W,3);},{dark:0});
      FK.faceX(g,I,S,x1,GY-hy,GY+hy,z0,z1,(g,W,H)=>FT_TEX.stone(g,W,H,st,li*5+2,7),{});});
    const cx=s*3.75;FK.box(g,I,cx-0.8,cx+0.8,GY-0.7,GY+0.7,6.7,7.3,sT,sL,sR);FK.ell(g,I(cx,GY,7.3),S*0.5,S*0.25,gold);FK.ell(g,I(cx,GY,7.35),S*0.28,S*0.14,jade);};
  pylon(-1);
  /* the central block with its corbelled (Maya) arch */
  FK.box(g,I,-2.0,2.0,GY-1.5,GY+1.5,0.9,7.4,sT,sL,sR);
  FK.faceY(g,I,S,-2.0,2.0,GY+1.5,0.9,7.4,(g,W,H)=>{FT_TEX.stone(g,W,H,st,61,7,'rgba(30,30,20,.4)');
    const pts=[[7,0],[7,22],[11,22],[11,36],[15,36],[15,49],[18,49],[18,58],[22,58],[22,49],[25,49],[25,36],[29,36],[29,22],[33,22],[33,0]];
    g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();const gr=g.createLinearGradient(0,0,0,58);gr.addColorStop(0,'#4a4332');gr.addColorStop(0.45,'#1b160e');gr.addColorStop(1,'#0c0a06');g.fillStyle=gr;g.fill();
    g.fillStyle='rgba(255,230,170,.35)';g.fillRect(15,0,10,3.5);
    g.strokeStyle='rgba(235,230,200,.5)';g.lineWidth=0.9;[[7,22,11],[11,36,15],[15,49,18],[18,58,22]].forEach(([x,y,x2])=>{g.beginPath();g.moveTo(x,y);g.lineTo(x2,y);g.stroke();g.beginPath();g.moveTo(40-x,y);g.lineTo(40-x2,y);g.stroke();});
    g.fillStyle=jade;g.fillRect(14.5,48.2,11,1.7);g.fillStyle=gold;g.fillRect(19.2,48.2,1.6,1.7);
    /* frieze: step-fret band in jade and gold */g.fillStyle='rgba(30,28,18,.35)';g.fillRect(0,H-9,W,7);for(let x=1;x<W-3;x+=5.5){g.strokeStyle=(Math.round(x/5.5)%2)?jade:gold;g.lineWidth=0.9;g.beginPath();g.moveTo(x,H-3);g.lineTo(x,H-8);g.lineTo(x+3.6,H-8);g.lineTo(x+3.6,H-5.5);g.lineTo(x+1.8,H-5.5);g.stroke();}},{dark:0});
  FK.faceX(g,I,S,2.0,GY-1.5,GY+1.5,0.9,7.4,(g,W,H)=>FT_TEX.stone(g,W,H,st,71,7),{});
  /* roof comb: an open lattice crest with a sun disc */
  FK.box(g,I,-1.5,1.5,GY-0.7,GY+0.7,7.4,7.9,sT,sL,sR);
  FK.faceY(g,I,S,-1.3,1.3,GY+0.45,7.9,10.9,(g,W,H)=>{const pts=[[0,0],[0,9],[3,9],[3,17],[6,17],[6,25],[9,25],[9,30],[17,30],[17,25],[20,25],[20,17],[23,17],[23,9],[26,9],[26,0]];g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fillStyle=st;g.fill();g.strokeStyle='rgba(30,28,18,.5)';g.lineWidth=0.7;g.stroke();g.fillStyle='rgba(34,30,20,.55)';[[4.5,5],[21.5,5],[13,24],[8,13],[18,13]].forEach(([x,y])=>{g.beginPath();g.moveTo(x,y-2.4);g.lineTo(x+2,y);g.lineTo(x,y+2.4);g.lineTo(x-2,y);g.closePath();g.fill();});g.fillStyle=gold;g.beginPath();g.arc(13,15,5.6,0,7);g.fill();g.fillStyle=jade;g.beginPath();g.arc(13,15,3.6,0,7);g.fill();g.fillStyle=gold;g.beginPath();g.arc(13,15,1.4,0,7);g.fill();g.strokeStyle=gold;g.lineWidth=0.8;for(let k=0;k<12;k++){const a=k*Math.PI/6;g.beginPath();g.moveTo(13+Math.cos(a)*6,15+Math.sin(a)*6);g.lineTo(13+Math.cos(a)*8,15+Math.sin(a)*8);g.stroke();}},{dark:0});
  pylon(1);
  /* vines trailing down the pylons and the block */
  g.save();g.lineCap='round';const vine=(pts,w)=>{g.strokeStyle='#3d6b34';g.lineWidth=S*w;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();pts.forEach((p,i)=>{if(i%2){FK.ell(g,[p[0]+S*0.12,p[1]],S*0.2,S*0.11,'#4f8a3e');FK.ell(g,[p[0]-S*0.14,p[1]+S*0.1],S*0.18,S*0.1,'#3f7a35');}});};
  [[-5.0,GY+1.55,6.7],[-3.4,GY+1.2,5.0],[3.2,GY+1.2,5.0],[5.0,GY+1.55,6.7],[1.4,GY+1.55,7.3]].forEach(([X,Y,Z],k)=>{const pts=[];for(let q=0;q<7;q++)pts.push(I(X+Math.sin(q*1.3+k)*0.18,Y,Z-q*0.5-(k%2)*0.2));vine(pts,0.07);});g.restore();
  /* torch columns with carved bands, jungle plants */
  [-2.8,2.8].forEach((X,i)=>{FK.box(g,I,X-0.32,X+0.32,GY+3.2,GY+3.84,0,2.5,'#bdb79c','#a09a80','#7f7a64');FK.faceY(g,I,S,X-0.32,X+0.32,GY+3.84,0,2.5,(g,W,H)=>{FT_TEX.stone(g,W,H,'#a09a80',80+i,5);g.fillStyle=jade;g.fillRect(0,H*0.55,W,2);g.fillStyle=gold;g.fillRect(0,H*0.55+3,W,1);PH.glyph(g,W/2,H*0.3,W*0.8,i+1,jade);},{dark:0});const t=I(X,GY+3.52,2.5);FK.ell(g,t,S*0.5,S*0.25,'#8a8470');FK.ell(g,[t[0],t[1]-S*0.04],S*0.36,S*0.17,'#3a1a0a');});
  [[-5.9,GY+2.1],[5.9,GY+2.1],[-5.6,GY-1.6],[5.6,GY-1.6]].forEach(([X,Y],k)=>{const p=I(X,Y,k<2?0.9:0.5);PH.leafFan(g,p,S*2.0,7,'#3f7f3a',0.9);PH.leafFan(g,[p[0]+S*0.3,p[1]],S*1.4,5,'#55934a',0.8);});
  [[-2.1,GY+5.6],[2.3,GY+5.2],[-4.6,GY+4.4]].forEach(([X,Y],k)=>{const p=I(X,Y,0);PH.leafFan(g,p,S*1.0,5,'#4f8a3e',0.7);});
  PH.guests(g,I,S,[[-0.3,GY+4.6,'#c9a227',null,'#d8c9a0'],[0.5,GY+5.6,'#3a6a4a',null,'#c8b88a'],[-0.5,GY+6.4,'#a14a2a'],[0.2,GY+3.8,'#3b6ea8',null,'#d8c9a0'],[-0.1,GY+7.2,'#7a2a22']]);
};
PE_ANIM.jungle=function(g,I,S,o,t){const GY=-0.6;[-2.8,2.8].forEach((X,i)=>{const p=I(X,GY+3.52,2.5);PH.flame(g,[p[0],p[1]-S*0.06],S*0.55,t,i);});};
/* ====================== FRONTIER: a log fort gatehouse with blockhouse towers and a stockade ====================== */
PE_SKIN.frontier=function(g,I,S,o){const A=o.A,log='#8a5d36',logD='#5e3e24',roof='#4b3a2c',GY=-1.0;
  FB.shadow(g,I,S,-6.8,6.8,GY-2.2,GY+2.2);
  const palisade=(x0,x1)=>{for(let X=x0;X<x1-0.05;X+=0.5){const h=4.0+((Math.round(X*10)*7)%5)*0.12;FK.box(g,I,X,X+0.46,GY-0.3,GY+0.16,0,h,'#9a6c40','#7a5230','#573a22');FK.poly(g,[I(X,GY+0.16,h),I(X+0.46,GY+0.16,h),I(X+0.23,GY+0.16,h+0.8)],'#6a4528');FK.poly(g,[I(X+0.46,GY-0.3,h),I(X+0.46,GY+0.16,h),I(X+0.23,GY+0.16,h+0.8)],'#4a301c');}FK.ln(g,I(x0,GY+0.2,1.1),I(x1,GY+0.2,1.1),logD,S*0.15);FK.ln(g,I(x0,GY+0.2,2.9),I(x1,GY+0.2,2.9),logD,S*0.15);};
  const logFace=(x0,x1,y,z0,z1,seed,loop)=>FK.faceY(g,I,S,x0,x1,y,z0,z1,(g,W,H)=>{FT_TEX.logs(g,W,H,log,seed,6);if(loop)loop(g,W,H);},{dark:0});
  const logFaceX=(x,y0,y1,z0,z1,seed)=>FK.faceX(g,I,S,x,y0,y1,z0,z1,(g,W,H)=>FT_TEX.logs(g,W,H,log,seed,6),{});
  const blockhouse=(X)=>{const a=1.45,b=1.85;
    FK.box(g,I,X-a-0.15,X+a+0.15,GY-a-0.15,GY+a+0.15,0,0.5,'#a39c8d','#837c6e','#686254');FK.faceY(g,I,S,X-a-0.15,X+a+0.15,GY+a+0.15,0,0.5,(g,W,H)=>FT_TEX.stone(g,W,H,'#8d8678',X*3+1,3.5),{dark:0});
    FK.box(g,I,X-a,X+a,GY-a,GY+a,0.5,3.7,'#a97a4a',log,logD);logFace(X-a,X+a,GY+a,0.5,3.7,X*3+7,(g,W,H)=>{g.fillStyle='#1a1008';g.fillRect(W*0.2,H*0.52,2.2,7);g.fillRect(W*0.72,H*0.52,2.2,7);g.fillStyle='rgba(0,0,0,.2)';g.fillRect(0,0,W,3);});logFaceX(X+a,GY-a,GY+a,0.5,3.7,X*5+2);
    /* overhanging upper storey on log corbels */
    [[-1,1],[1,1],[1,-1]].forEach(([sx,sy])=>FK.box(g,I,X+sx*b-0.25,X+sx*b+0.25,GY+sy*b-0.25,GY+sy*b+0.25,3.4,3.8,'#6a4528','#583a22','#42301b'));
    FK.box(g,I,X-b,X+b,GY-b,GY+b,3.7,5.9,'#a97a4a',log,logD);logFace(X-b,X+b,GY+b,3.7,5.9,X*3+11,(g,W,H)=>{g.fillStyle='#1a1008';g.fillRect(W*0.12,H*0.4,2.4,8);g.fillRect(W*0.46,H*0.38,2.4,9);g.fillRect(W*0.8,H*0.4,2.4,8);});logFaceX(X+b,GY-b,GY+b,3.7,5.9,X*5+9);
    /* hip roof of split shingles */const rb=2.2,rz=5.9,az=8.7;
    FK.grid(g,I(X-rb,GY+rb,rz),I(X+rb,GY+rb,rz),I(X,GY,az),I(X,GY,az),6,10,(i,j)=>({fill:FK.sh('#5a4332',((i*3+j*5)%5)*0.04-0.06),stroke:'rgba(20,10,4,.35)',lw:0.5}));
    FK.grid(g,I(X+rb,GY+rb,rz),I(X+rb,GY-rb,rz),I(X,GY,az),I(X,GY,az),6,10,(i,j)=>({fill:FK.sh('#43331f',((i*3+j*5)%5)*0.04-0.1),stroke:'rgba(20,10,4,.35)',lw:0.5}));
    FK.ln(g,I(X-rb,GY+rb,rz),I(X+rb,GY+rb,rz),'#2a1c10',S*0.16);FK.ln(g,I(X+rb,GY+rb,rz),I(X+rb,GY-rb,rz),'#1e140b',S*0.16);PH.pole(g,I,S,X,GY,az,1.9,'#6b7380',0.09);};
  palisade(-6.9,-5.95);blockhouse(-4.3);
  /* the gate house: log posts, a bridge-house above, a hung plank sign and a lantern */
  [-2.3,2.3].forEach(X=>{FK.box(g,I,X-0.32,X+0.32,GY-0.6,GY+0.6,0,4.8,'#a97a4a',log,logD);logFace(X-0.32,X+0.32,GY+0.6,0,4.8,X*9+1);logFaceX(X+0.32,GY-0.6,GY+0.6,0,4.8,X*7+5);});
  FK.box(g,I,-2.9,2.9,GY-1.2,GY+1.2,4.8,6.7,'#a97a4a',log,logD);logFace(-2.9,2.9,GY+1.2,4.8,6.7,77,(g,W,H)=>{g.fillStyle='#1a1008';g.fillRect(W*0.18,H*0.3,2.4,8);g.fillRect(W*0.5-1.2,H*0.3,2.4,8);g.fillRect(W*0.8,H*0.3,2.4,8);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,0,W,3);});logFaceX(2.9,GY-1.2,GY+1.2,4.8,6.7,78);
  FK.grid(g,I(-3.3,GY+1.7,6.7),I(3.3,GY+1.7,6.7),I(3.3,GY,8.0),I(-3.3,GY,8.0),4,16,(i,j)=>({fill:FK.sh('#5a4332',((i*3+j*5)%5)*0.04-0.06),stroke:'rgba(20,10,4,.35)',lw:0.5}));FK.ln(g,I(-3.3,GY+1.7,6.7),I(3.3,GY+1.7,6.7),'#2a1c10',S*0.16);FK.poly(g,[I(3.3,GY-1.7,6.7),I(3.3,GY+1.7,6.7),I(3.3,GY,8.0)],'#3a2a1c');
  /* hung sign: a burnt-in antler emblem on a weathered plank */
  FK.faceY(g,I,S,-1.15,1.15,GY+0.62,3.15,4.3,(g,W,H)=>{FT_TEX.planks(g,W,H,'#9c7a4c',4,4.6);g.strokeStyle='#2a1a0e';g.lineWidth=1.3;g.lineCap='round';[-1,1].forEach(s=>{const c=W/2;g.beginPath();g.moveTo(c+s*1,H*0.28);g.quadraticCurveTo(c+s*5,H*0.45,c+s*7,H*0.8);g.moveTo(c+s*3.2,H*0.45);g.lineTo(c+s*3.6,H*0.7);g.moveTo(c+s*5,H*0.6);g.lineTo(c+s*7.4,H*0.55);g.stroke();});g.beginPath();g.moveTo(W/2,H*0.25);g.lineTo(W/2,H*0.5);g.stroke();g.strokeStyle='rgba(20,10,4,.6)';g.lineWidth=1;g.strokeRect(0.8,0.8,W-1.6,H-1.6);},{dark:0});
  [-0.95,0.95].forEach(X=>FK.ln(g,I(X,GY+0.62,4.3),I(X,GY+0.62,4.8),'#2f2f33',S*0.04));
  FK.ln(g,I(0,GY+0.7,4.78),I(0,GY+0.7,4.5),'#2f2f33',S*0.05);FK.box(g,I,-0.18,0.18,GY+0.55,GY+0.9,3.9,4.5,'#2a2a30','#25252b','#1c1c20');FB.glow(g,I(0,GY+0.72,4.2),S*1.2,'rgba(255,200,110,.55)');FK.ell(g,I(0,GY+0.72,4.2),S*0.12,S*0.16,'#ffd98a');
  palisade(5.95,6.9);blockhouse(4.3);
  /* hitching rail, barrels, a hay bale, a wagon wheel */
  [[-5.0,GY+2.6],[4.8,GY+2.6]].forEach(([X,Y])=>{[[-0.6],[0.6]].forEach(([d])=>FK.box(g,I,X+d-0.1,X+d+0.1,Y-0.1,Y+0.1,0,1.1,'#7a5230','#5e3e24','#44301c'));FK.ln(g,I(X-0.7,Y,0.95),I(X+0.7,Y,0.95),'#6a4528',S*0.14);});
  [[-5.4,GY+4.0,1],[-4.6,GY+4.4,0],[5.5,GY+3.9,0]].forEach(([X,Y,k])=>{FB.cyl(g,I,S,X,Y,0.5,0,1.0,'#8a5d36');FK.ln(g,I(X-0.5,Y+0.1,0.3),I(X+0.5,Y+0.1,0.3),'#3a3d44',S*0.05);FK.ln(g,I(X-0.5,Y+0.1,0.72),I(X+0.5,Y+0.1,0.72),'#3a3d44',S*0.05);FK.ell(g,I(X,Y,1.0),S*0.5,S*0.25,'#a67a4a');});
  FK.box(g,I,4.2,5.4,GY+4.4,GY+5.2,0,0.8,'#d8c17a','#bda85f','#9c8a48');
  PH.guests(g,I,S,[[-0.3,GY+3.4,'#3a5a8a',null,'#6b4a2a'],[0.6,GY+4.4,'#a14a2a',null,'#3a2a1c'],[-0.5,GY+5.4,'#4a7a4a',null,'#6b4a2a'],[0.2,GY+2.4,'#c9a227',null,'#3a2a1c'],[-0.2,GY+6.4,'#7a2a22',null,'#6b4a2a']]);
};
PE_ANIM.frontier=function(g,I,S,o,t){const GY=-1.0;[-4.3,4.3].forEach((X,k)=>{const b=I(X,GY,8.7+1.9),w=Math.sin(t*3+k*1.4)*S*0.12;g.fillStyle=o.A;g.beginPath();g.moveTo(b[0],b[1]);g.quadraticCurveTo(b[0]+S*0.9,b[1]+S*0.05+w,b[0]+S*1.7,b[1]+S*0.4+w*1.5);g.quadraticCurveTo(b[0]+S*0.9,b[1]+S*0.5+w,b[0],b[1]+S*0.8);g.closePath();g.fill();});const l=I(0,GY+0.72,4.2),f=0.85+Math.sin(t*6)*0.08+Math.sin(t*11)*0.05;FB.glow(g,l,S*1.2*f,'rgba(255,200,110,.45)');};
/* ====================== CLASSIC MIDWAY: a candy-striped arch with a bulb chase, bunting, balloons and flags ====================== */
PE_SKIN.classic=function(g,I,S,o){const A=o.A,cream='#f6eddc',gold='#e8b83a',blue='#2f5fa8',GY=-0.8;
  FB.shadow(g,I,S,-6.8,6.8,GY-1.6,GY+2.0);
  /* the two tapered, striped pylons */
  const pylon=(X)=>{FK.box(g,I,X-0.95,X+0.95,GY-0.95,GY+0.95,0,0.9,'#f1e8d2','#d9ceb4','#b3a98f');
    FK.box(g,I,X-0.7,X+0.7,GY-0.7,GY+0.7,0.9,6.8,cream,'#fbf3e0','#d8ccb2');
    FK.faceY(g,I,S,X-0.7,X+0.7,GY+0.7,0.9,6.8,(g,W,H)=>{g.fillStyle='#fbf3e0';g.fillRect(0,0,W,H);g.fillStyle=A;for(let x=0;x<W;x+=W/4){g.fillRect(x,0,W/8,H);}g.fillStyle='rgba(0,0,0,.08)';g.fillRect(0,0,W,H*0.04);g.fillStyle=gold;g.fillRect(0,H*0.6,W,1.6);},{dark:0});
    FK.faceX(g,I,S,X+0.7,GY-0.7,GY+0.7,0.9,6.8,(g,W,H)=>{g.fillStyle='#e3d8bf';g.fillRect(0,0,W,H);g.fillStyle=FK.sh(A,-0.25);for(let x=0;x<W;x+=W/4){g.fillRect(x,0,W/8,H);}},{});
    FK.box(g,I,X-0.9,X+0.9,GY-0.9,GY+0.9,6.8,7.3,'#f6e7c4',gold,'#b58a22');FB.disc(g,I(X,GY,7.3),S*0.55,S*0.27,gold);const b=I(X,GY,7.95);FK.ell(g,b,S*0.4,S*0.4,gold);FK.ell(g,[b[0]-S*0.1,b[1]-S*0.1],S*0.12,S*0.12,'rgba(255,255,255,.6)');PH.pole(g,I,S,X,GY,8.2,1.5,'#6b7380',0.08);};
  /* the arch: an extruded candy-striped band */
  const rx=4.85,rz=4.0,z0=6.4,th=1.25;PH.archBand(g,I,S,0,GY,1.0,rx,rz,z0,th,FK.sh(A,0.22),(i,n)=>Math.floor(i/3)%2?cream:A);
  /* scalloped trim round the outer edge */
  for(let k=0;k<=22;k++){const a=Math.PI*k/22,p=I(Math.cos(a)*(rx+0.12),GY+0.52,z0+Math.sin(a)*(rz+0.12*rz/rx));FK.ell(g,p,S*0.22,S*0.22,k%2?gold:cream);}
  /* the medallion at the crown: a gold star ringed with bulbs */
  const mc=I(0,GY+0.54,z0+rz-th*0.5);FK.ell(g,mc,S*1.3,S*1.3,'#f4e2a4');FK.ell(g,mc,S*1.08,S*1.08,A);PH.hexStar(g,mc,S*0.95,gold);PH.hexStar(g,mc,S*0.5,cream);
  pylon(-4.4);pylon(4.4);
  /* two ticket booths with striped awnings */
  [[-6.9,-5.6],[5.6,6.9]].forEach(([a,b])=>{FK.box(g,I,a,b,GY+1.2,GY+2.5,0,2.3,'#fbf3e0','#e5dac0','#bdb297');FK.faceY(g,I,S,a,b,GY+2.5,0,2.3,(g,W,H)=>{g.fillStyle='#fbf3e0';g.fillRect(0,0,W,H);g.fillStyle='#5a7f9a';g.fillRect(W*0.18,H*0.3,W*0.64,H*0.36);g.fillStyle='rgba(255,255,255,.35)';g.fillRect(W*0.2,H*0.55,W*0.2,H*0.08);g.fillStyle=gold;g.fillRect(0,0,W,3);},{dark:0});
    const z=2.3;FK.poly(g,[I(a-0.15,GY+1.2,z),I(b+0.15,GY+1.2,z),I(b+0.15,GY+3.0,z-0.7),I(a-0.15,GY+3.0,z-0.7)],A);for(let k=0;k<5;k++){const x0=a-0.15+(b-a+0.3)*k/5,x1=a-0.15+(b-a+0.3)*(k+1)/5;if(k%2===0)continue;FK.poly(g,[I(x0,GY+1.2,z),I(x1,GY+1.2,z),I(x1,GY+3.0,z-0.7),I(x0,GY+3.0,z-0.7)],cream);}FK.ln(g,I(a-0.15,GY+3.0,z-0.7),I(b+0.15,GY+3.0,z-0.7),FK.sh(A,-0.3),S*0.1);});
  PH.guests(g,I,S,[[-0.3,GY+3.4,'#2f5fa8',null,'#e8b83a'],[0.6,GY+4.4,'#e23b3b'],[-0.5,GY+5.4,'#3a9a5a',null,'#f6eddc'],[0.2,GY+2.3,'#e8b83a'],[-0.2,GY+6.4,'#a14a8a']]);
};
PE_ANIM.classic=function(g,I,S,o,t){const A=o.A,GY=-0.8,rx=4.85,rz=4.0,z0=6.4,th=1.25;
  /* the bulb chase along the arch face */
  for(let k=0;k<=26;k++){const a=Math.PI*k/26,p=I(Math.cos(a)*(rx-th*0.5),GY+0.53,z0+Math.sin(a)*(rz-th*0.5*rz/rx)),on=((k+Math.floor(t*5))%3===0);FB.glow(g,p,S*(on?0.95:0.5),on?'rgba(255,236,160,.8)':'rgba(255,236,160,.18)');FK.ell(g,p,S*0.13,S*0.13,on?'#fff6c8':'#e9dcae');}
  /* bunting strings and waving pennants */
  const cols=[A,'#f6eddc','#2f5fa8','#e8b83a'],sw=Math.sin(t*1.6)*0.12;
  PH.bunting(g,I,S,[-4.4,GY,8.3],[-6.8,GY+1.6,4.4],0.9+sw,cols,8,0.5);PH.bunting(g,I,S,[4.4,GY,8.3],[6.8,GY+1.6,4.4],0.9-sw,cols,8,0.5);PH.bunting(g,I,S,[-4.4,GY+0.9,6.6],[4.4,GY+0.9,6.6],1.0+sw,cols.slice().reverse(),14,0.5);
  [-4.4,4.4].forEach((X,k)=>{const b=I(X,GY,9.7),w=Math.sin(t*3.2+k)*S*0.12;g.fillStyle=A;g.beginPath();g.moveTo(b[0],b[1]);g.quadraticCurveTo(b[0]+S*0.9,b[1]+S*0.05+w,b[0]+S*1.7,b[1]+S*0.4+w*1.5);g.quadraticCurveTo(b[0]+S*0.9,b[1]+S*0.5+w,b[0],b[1]+S*0.85);g.closePath();g.fill();});
  /* balloon bunches tied to the pylon bases, bobbing */
  [[-6.0,GY+3.0],[6.1,GY+3.0],[-2.0,GY+4.8]].forEach(([X,Y],bi)=>{const anchor=I(X,Y,0.6),cols2=[A,'#f6eddc','#2f5fa8','#e8b83a','#3a9a5a','#e23b3b'];for(let k=0;k<6;k++){const ph=t*1.3+k*0.9+bi*2,bx=anchor[0]+(k-2.5)*S*0.38+Math.sin(ph)*S*0.18,by=anchor[1]-S*(5.2+((k*7+bi*3)%4)*0.55)+Math.sin(ph*0.8)*S*0.15;g.strokeStyle='rgba(60,50,40,.6)';g.lineWidth=S*0.03;g.beginPath();g.moveTo(anchor[0],anchor[1]);g.quadraticCurveTo(anchor[0]+(bx-anchor[0])*0.3,anchor[1]+(by-anchor[1])*0.6,bx,by+S*0.5);g.stroke();FK.ell(g,[bx,by],S*0.5,S*0.62,cols2[(k+bi)%6]);FK.ell(g,[bx-S*0.15,by-S*0.2],S*0.14,S*0.2,'rgba(255,255,255,.45)');FK.poly(g,[[bx-S*0.08,by+S*0.6],[bx+S*0.08,by+S*0.6],[bx,by+S*0.72]],cols2[(k+bi)%6]);}});};

/* ====================== ALPINE: a stone-and-timber lodge under a snow-laden roof, with a stone tower attached ====================== */
PE_SKIN.alpine=function(g,I,S,o){const A=o.A,stone='#9a9d9f',[sT,sL,sR]=PH.tri(stone),timber='#6e4d33',timD='#4c3322',plaster='#ece3cf',snow='#f4f8fc',snowS='#c9d6e6',GY=-0.6,r=mulberry(23);
  FB.shadow(g,I,S,-6.8,6.8,GY-2.8,GY+2.6);
  /* the lodge: stone ground floor, timber upper floor */
  const x0=-5.4,x1=2.2,y0=GY-2.2,y1=GY+1.4;
  FK.box(g,I,x0,x1,y0,y1,0,2.9,sT,sL,sR);
  FK.faceY(g,I,S,x0,x1,y1,0,2.9,(g,W,H)=>{FT_TEX.stone(g,W,H,stone,23,7.5,'rgba(30,34,40,.4)');const px=(-1.3-x0)*10,pw=26;PH.archPath(g,px-2,0,pw+4,H-1,14,'round');g.fillStyle='#6f7479';g.fill();PH.archPath(g,px,0,pw,H-3,13,'round');const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#3a2c20');gr.addColorStop(1,'#14100c');g.fillStyle=gr;g.fill();g.fillStyle='rgba(255,226,160,.4)';g.fillRect(px+pw*0.3,0,pw*0.4,3);
    [[8,10],[W-36,10]].forEach(([wx])=>{g.fillStyle='#f0e4c4';g.fillRect(wx-1.5,6,12,15);g.fillStyle='#2c3a4a';g.fillRect(wx,7.5,9,12);g.fillStyle=A;g.fillRect(wx-5,6,4,15);g.fillRect(wx+10.5,6,4,15);g.fillStyle='rgba(255,220,150,.5)';g.fillRect(wx+1,8.5,7,5);});[[W*0.78],[W*0.92]].forEach(([wx])=>{g.fillStyle='#2c3a4a';g.fillRect(wx-3,7,6,12);g.fillStyle=A;g.fillRect(wx-6.5,7,3,12);g.fillRect(wx+3.5,7,3,12);});},{dark:0});
  FK.faceX(g,I,S,x1,y0,y1,0,2.9,(g,W,H)=>FT_TEX.stone(g,W,H,stone,29,7.5),{});
  FK.box(g,I,x0,x1,y0,y1,2.9,5.7,timber,'#7d593b',timD);
  FK.faceY(g,I,S,x0,x1,y1,2.9,5.7,(g,W,H)=>{FT_TEX.planks(g,W,H,'#6e4d33',5,3.6,'rgba(15,8,4,.5)');g.fillStyle='#3d2a1b';g.fillRect(0,0,W,3);[[0.1],[0.34],[0.58],[0.82]].forEach(([f],i)=>{const wx=W*f;g.fillStyle='#e9dfc9';g.fillRect(wx-1.5,8,13,17);g.fillStyle='#2a3342';g.fillRect(wx,9.4,10,14.2);g.fillStyle='rgba(255,215,140,.5)';g.fillRect(wx+1,10.4,8,6);g.fillStyle=A;g.fillRect(wx-5.5,8,4,17);g.fillRect(wx+11.5,8,4,17);g.strokeStyle='#e9dfc9';g.lineWidth=0.8;g.beginPath();g.moveTo(wx+5,9.4);g.lineTo(wx+5,23.6);g.stroke();});},{dark:0});
  FK.faceX(g,I,S,x1,y0,y1,2.9,5.7,(g,W,H)=>{FT_TEX.planks(g,W,H,'#6e4d33',8,3.6);g.fillStyle='#e9dfc9';g.fillRect(W*0.35,9,13,17);g.fillStyle='#2a3342';g.fillRect(W*0.35+1.5,10.4,10,14.2);},{});
  /* carved balcony along the first floor */
  FK.box(g,I,x0+0.4,x1-0.4,y1,y1+0.9,2.9,3.1,'#8a6444','#6e4d33','#523a27');
  for(let X=x0+0.6;X<x1-0.4;X+=0.7){const p=I(X,y1+0.85,3.1),q=I(X,y1+0.85,3.9);FK.ln(g,p,q,'#e9dfc9',S*0.1);FK.poly(g,[[q[0]-S*0.14,q[1]],[q[0]+S*0.14,q[1]],[q[0],q[1]-S*0.18]],A);}
  FK.ln(g,I(x0+0.4,y1+0.85,3.9),I(x1-0.4,y1+0.85,3.9),'#e9dfc9',S*0.12);
  for(let X=x0+1.2;X<x1-0.8;X+=2.2){FK.box(g,I,X,X+1.1,y1+0.5,y1+0.95,3.95,4.35,'#7a4a30','#6a3e28','#4a2c1c');for(let k=0;k<4;k++)FK.ell(g,I(X+0.2+k*0.24,y1+0.75,4.45),S*0.13,S*0.1,['#d9342b','#f2f2f2','#d9342b','#e86a8a'][k]);}
  /* the big overhanging roof, ridge along X, with a thick snow blanket */
  const rz0=5.7,rz1=8.5,ya=GY-3.0,yb=GY+3.0,xa=-5.9,xb=2.6;
  FK.poly(g,[I(xb,ya,rz0),I(xb,yb,rz0),I(xb,GY,rz1)],'#5a4636');
  FK.grid(g,I(xa,yb,rz0),I(xb,yb,rz0),I(xb,GY,rz1),I(xa,GY,rz1),4,22,(i,j)=>({fill:FK.sh('#4a3a2c',((i*3+j*7)%5)*0.04-0.06),stroke:'rgba(20,10,4,.35)',lw:0.5}));
  /* snow on the slope: a lumpy layer thicker toward the ridge */
  const sn=[];for(let k=0;k<=22;k++){const f=k/22,X=xa+(xb-xa)*f;sn.push(I(X,GY+0.15,rz1-0.05));}for(let k=22;k>=0;k--){const f=k/22,X=xa+(xb-xa)*f,Y=GY+3.0*(0.62+0.18*Math.sin(f*17+1)*Math.cos(f*7)),Z=rz0+(rz1-rz0)*(1-(Y-GY)/3.0);sn.push(I(X,Y,Z+0.05));}
  FK.poly(g,sn,snow);const eaves=[];for(let k=0;k<=22;k++){const f=k/22,X=xa+(xb-xa)*f,Y=GY+3.0*(0.62+0.18*Math.sin(f*17+1)*Math.cos(f*7)),Z=rz0+(rz1-rz0)*(1-(Y-GY)/3.0);eaves.push(I(X,Y,Z+0.05));}FK.curve(g,eaves,snowS,S*0.12);
  [[-4.2],[-1.9],[0.4]].forEach(([X])=>{const p=I(X,GY+2.0,6.7);for(let k=0;k<3;k++){const q=I(X+0.3*k,GY+2.05,6.6);FK.ell(g,q,S*0.3,S*0.17,'#8a8f96');}});
  FK.ln(g,I(xa,yb,rz0),I(xb,yb,rz0),'#3a2a1c',S*0.2);FK.ln(g,I(xb,yb,rz0),I(xb,GY,rz1),'#3a2a1c',S*0.16);
  for(let k=0;k<14;k++){const X=xa+0.4+k*0.6,p=I(X,yb,rz0-0.05);FK.poly(g,[[p[0]-S*0.06,p[1]],[p[0]+S*0.06,p[1]],[p[0],p[1]+S*(0.25+((k*7)%4)*0.18)]],'#dce9f6');}
  /* chimney */FK.box(g,I,-3.6,-2.8,GY-1.6,GY-0.8,6.6,9.2,'#9a9d9f','#7e8184','#62656a');FK.box(g,I,-3.7,-2.7,GY-1.7,GY-0.7,9.2,9.5,snow,'#dfe9f3','#b9c9da');
  /* the attached stone tower under a steep pyramid roof */
  const tx0=2.2,tx1=5.2,ty0=GY-1.9,ty1=GY+1.0;
  FK.box(g,I,tx0,tx1,ty0,ty1,0,8.4,sT,sL,sR);
  FK.faceY(g,I,S,tx0,tx1,ty1,0,8.4,(g,W,H)=>{FT_TEX.stone(g,W,H,stone,41,7.5,'rgba(30,34,40,.4)');g.fillStyle='#15191f';[[0.5,22],[0.5,48],[0.5,70]].forEach(([f,y])=>{g.fillRect(W*f-1.2,y,2.4,9);});g.fillStyle='#e9dfc9';g.fillRect(W*0.5-5.5,H*0.5-4,11,13);g.fillStyle='#2a3342';g.fillRect(W*0.5-4,H*0.5-2.6,8,10.2);g.fillStyle=A;g.fillRect(W*0.5-8.2,H*0.5-4,2.4,13);g.fillRect(W*0.5+5.8,H*0.5-4,2.4,13);g.fillStyle=snowS;g.fillRect(0,H-2.2,W,2.2);},{dark:0});
  FK.faceX(g,I,S,tx1,ty0,ty1,0,8.4,(g,W,H)=>{FT_TEX.stone(g,W,H,stone,43,7.5);g.fillStyle='#15191f';g.fillRect(W*0.5-1.2,24,2.4,10);g.fillRect(W*0.5-1.2,52,2.4,10);},{});
  /* timber belfry stage and the roof */
  FK.box(g,I,tx0-0.25,tx1+0.25,ty0-0.25,ty1+0.25,8.4,9.6,timber,'#7d593b',timD);FK.faceY(g,I,S,tx0-0.25,tx1+0.25,ty1+0.25,8.4,9.6,(g,W,H)=>{FT_TEX.planks(g,W,H,'#6e4d33',3,3.4);g.fillStyle='#15191f';g.fillRect(W*0.5-4,H*0.2,8,H*0.62);g.fillStyle='#2a3342';g.fillRect(W*0.5-3,H*0.26,6,H*0.5);},{dark:0});FK.faceX(g,I,S,tx1+0.25,ty0-0.25,ty1+0.25,8.4,9.6,(g,W,H)=>{FT_TEX.planks(g,W,H,'#6e4d33',4,3.4);g.fillStyle='#15191f';g.fillRect(W*0.5-3.5,H*0.2,7,H*0.62);},{});
  const cxm=(tx0+tx1)/2,cym=(ty0+ty1)/2,rb=2.05,az=13.2;
  FK.grid(g,I(cxm-rb,cym+rb,9.6),I(cxm+rb,cym+rb,9.6),I(cxm,cym,az),I(cxm,cym,az),7,8,(i,j)=>({fill:FK.sh('#4f3d2f',((i*3+j*5)%5)*0.04-0.04),stroke:'rgba(20,10,4,.3)',lw:0.5}));
  FK.grid(g,I(cxm+rb,cym+rb,9.6),I(cxm+rb,cym-rb,9.6),I(cxm,cym,az),I(cxm,cym,az),7,8,(i,j)=>({fill:FK.sh('#3d2f23',((i*3+j*5)%5)*0.04-0.08),stroke:'rgba(20,10,4,.3)',lw:0.5}));
  FK.poly(g,[I(cxm-rb,cym+rb,9.6),I(cxm+rb,cym+rb,9.6),I(cxm+rb*0.55,cym+rb*0.55,10.9),I(cxm-rb*0.55,cym+rb*0.55,10.9)],snow);FK.poly(g,[I(cxm+rb,cym+rb,9.6),I(cxm+rb,cym-rb,9.6),I(cxm+rb*0.55,cym-rb*0.55,10.9),I(cxm+rb*0.55,cym+rb*0.55,10.9)],snowS);
  FK.poly(g,[I(cxm-0.55,cym+0.55,12.2),I(cxm+0.55,cym+0.55,12.2),I(cxm,cym,az)],snow);FK.ln(g,I(cxm,cym,az),I(cxm,cym,az+1.4),'#6b7380',S*0.08);
  /* firs with snow, firewood, a sled */
  const fir=(X,Y,h)=>{const b=I(X,Y,0);FK.ln(g,b,[b[0],b[1]-S*0.7],'#4a3322',S*0.22);for(let k=0;k<4;k++){const w=S*(1.15-k*0.24),y=b[1]-S*(0.6+k*h*0.32);FK.poly(g,[[b[0]-w,y],[b[0]+w,y],[b[0],y-S*h*0.55]],'#2f5a42');FK.poly(g,[[b[0]-w*0.7,y-S*0.1],[b[0]+w*0.2,y-S*0.1],[b[0],y-S*h*0.55]],'#3f7a58');FK.poly(g,[[b[0]-w*0.82,y-S*0.05],[b[0]+w*0.82,y-S*0.05],[b[0]+w*0.45,y-S*0.28],[b[0]-w*0.45,y-S*0.28]],snow);}};
  fir(-6.0,GY+4.2,1.5);fir(6.0,GY+3.2,1.4);fir(5.3,GY+5.6,1.2);
  for(let k=0;k<5;k++){const p=I(-5.5+k*0.34,GY+2.2,0.25);FK.ell(g,p,S*0.2,S*0.14,'#a8794a');}for(let k=0;k<4;k++){const p=I(-5.35+k*0.34,GY+2.2,0.58);FK.ell(g,p,S*0.2,S*0.14,'#b9895a');}
  PH.guests(g,I,S,[[-0.3,GY+3.4,'#c8442f',null,'#f1f1f1'],[0.6,GY+4.4,'#2f6f9f',null,'#c8442f'],[-0.5,GY+5.4,'#e8c040',null,'#2f6f9f'],[0.2,GY+2.4,'#3a6a4a',null,'#f1f1f1'],[-0.2,GY+6.4,'#7a2a22',null,'#e8c040']]);
};
PE_ANIM.alpine=function(g,I,S,o,t){const A=o.A;const b=I(-3.2,-2.2,9.5);for(let k=0;k<8;k++){const age=(t*0.35+k/8)%1,x=b[0]+age*S*1.6+Math.sin(age*5+k)*S*0.25,y=b[1]-age*S*3.2,r=S*(0.22+age*0.55);const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(235,238,242,'+(0.55*(1-age))+')');gr.addColorStop(1,'rgba(235,238,242,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill();}
  const tx=(2.2+5.2)/2,ty=(-0.6-1.9-0.6+1.0)/2*0+(-0.6-1.9+(-0.6+1.0))/2,tip=I(tx,ty,13.2+1.4),w=Math.sin(t*3)*S*0.12;g.fillStyle=A;g.beginPath();g.moveTo(tip[0],tip[1]);g.quadraticCurveTo(tip[0]+S*0.8,tip[1]+S*0.04+w,tip[0]+S*1.5,tip[1]+S*0.36+w*1.5);g.quadraticCurveTo(tip[0]+S*0.8,tip[1]+S*0.46+w,tip[0],tip[1]+S*0.76);g.closePath();g.fill();};
/* ====================== BAVARIAN: a festive half-timbered gatehouse with a clock tower and onion dome ====================== */
PE_SKIN.bavarian=function(g,I,S,o){const A=o.A,blue='#2f7fc4',plaster='#f1e9d6',timber='#4a3426',roofR='#b5472b',GY=-0.8,r=mulberry(31);
  FB.shadow(g,I,S,-6.8,6.8,GY-2.2,GY+2.4);
  const beams=(g,W,H,cols,rows)=>{g.strokeStyle=timber;g.lineWidth=1.7;for(let i=0;i<=cols;i++){const x=W*i/cols;g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke();}for(let j=0;j<=rows;j++){const y=H*j/rows;g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();}g.lineWidth=1.2;for(let i=0;i<cols;i++){const x=W*i/cols,w=W/cols;g.beginPath();g.moveTo(x,0);g.lineTo(x+w,H*0.5);g.moveTo(x+w,H);g.lineTo(x,H*0.5);g.stroke();}};
  /* wings: half-timbered, red-tile gables with a blue-white lozenge band */
  const wing=(x0,x1,seed)=>{FK.box(g,I,x0,x1,GY-1.6,GY+1.6,0,4.2,'#f6efdc',plaster,'#cfc5ad');
    FK.faceY(g,I,S,x0,x1,GY+1.6,0,4.2,(g,W,H)=>{FT_TEX.stucco(g,W,H,plaster,seed);g.fillStyle='rgba(0,0,0,.05)';g.fillRect(0,0,W,H);beams(g,W,H,Math.round(W/9),2);g.fillStyle=timber;g.fillRect(0,0,W,3);
      for(let k=0;k<Math.round(W/18);k++){const wx=W*(k+0.5)/Math.round(W/18);g.fillStyle='#cfe2f2';g.fillRect(wx-3.2,H*0.52,6.4,9);g.fillStyle='rgba(40,60,90,.5)';g.fillRect(wx-0.4,H*0.52,0.8,9);g.fillStyle=A;g.fillRect(wx-5.2,H*0.52,2,9);g.fillRect(wx+3.2,H*0.52,2,9);g.fillStyle='#5a3a24';g.fillRect(wx-4,H*0.52-1.5,8,2);for(let q=0;q<4;q++){g.fillStyle=['#d9342b','#e8607a','#d9342b','#f2f2f2'][q];g.beginPath();g.arc(wx-3+q*2,H*0.52-2.6,1.1,0,7);g.fill();}}},{dark:0});
    FK.faceX(g,I,S,x1,GY-1.6,GY+1.6,0,4.2,(g,W,H)=>{FT_TEX.stucco(g,W,H,plaster,seed+3);beams(g,W,H,3,2);},{});
    const rz0=4.2,rz1=6.6,xa=x0-0.3,xb=x1+0.3,yb=GY+2.2;FK.poly(g,[I(xb,GY-2.2,rz0),I(xb,yb,rz0),I(xb,GY,rz1)],plaster);
    FK.grid(g,I(xa,yb,rz0),I(xb,yb,rz0),I(xb,GY,rz1),I(xa,GY,rz1),5,Math.round((xb-xa)*3.2),(i,j)=>({fill:i===1?(j%2?blue:'#f2f2f2'):FK.sh(roofR,((i*3+j*7)%5)*0.04-0.08),stroke:'rgba(40,10,4,.3)',lw:0.5}));
    FK.ln(g,I(xa,yb,rz0),I(xb,yb,rz0),'#3a2418',S*0.14);FK.ln(g,I(xa,GY,rz1),I(xb,GY,rz1),'#7a2c18',S*0.16);
    /* a dormer */const dX=(x0+x1)/2;FK.box(g,I,dX-0.5,dX+0.5,GY+0.7,GY+1.4,rz0+0.6,rz0+1.5,plaster,'#f6efdc','#cfc5ad');FK.poly(g,[I(dX-0.6,GY+1.5,rz0+1.5),I(dX+0.6,GY+1.5,rz0+1.5),I(dX,GY+1.5,rz0+2.2)],roofR);};
  wing(-6.4,-2.4,5);
  /* the central clock tower */
  FK.box(g,I,-2.2,2.2,GY-1.9,GY+1.9,0,5.2,'#f6efdc',plaster,'#cfc5ad');
  FK.faceY(g,I,S,-2.2,2.2,GY+1.9,0,5.2,(g,W,H)=>{FT_TEX.stucco(g,W,H,plaster,9);beams(g,W,H,4,3);g.fillStyle=timber;g.fillRect(0,0,W,3);const ax=W/2-12,aw=24;PH.archPath(g,ax-1.5,0,aw+3,32,12,'round');g.fillStyle='#8a6a48';g.fill();PH.archPath(g,ax,0,aw,30,12,'round');const gr=g.createLinearGradient(0,0,0,30);gr.addColorStop(0,'#3a2a1c');gr.addColorStop(1,'#14100c');g.fillStyle=gr;g.fill();g.fillStyle='rgba(255,226,160,.4)';g.fillRect(ax+aw*0.3,0,aw*0.4,3);
    g.fillStyle=blue;g.beginPath();g.moveTo(W/2-5,H-6);g.lineTo(W/2+5,H-6);g.lineTo(W/2,H-13);g.closePath();g.fill();g.fillStyle='#f2f2f2';g.beginPath();g.moveTo(W/2-2.4,H-6);g.lineTo(W/2+2.4,H-6);g.lineTo(W/2,H-9.6);g.closePath();g.fill();[[5],[W-5-8]].forEach(([wx])=>{g.fillStyle='#cfe2f2';g.fillRect(wx,28,8,11);g.fillStyle=A;g.fillRect(wx-3,28,2.4,11);g.fillRect(wx+8.6,28,2.4,11);});},{dark:0});
  FK.faceX(g,I,S,2.2,GY-1.9,GY+1.9,0,5.2,(g,W,H)=>{FT_TEX.stucco(g,W,H,plaster,12);beams(g,W,H,3,3);},{});
  /* clock stage with a painted lozenge frieze */
  FK.box(g,I,-1.9,1.9,GY-1.6,GY+1.6,5.2,8.2,'#f6efdc',plaster,'#cfc5ad');
  const clockFace=(g,W,H)=>{FT_TEX.stucco(g,W,H,plaster,15);g.fillStyle=blue;g.fillRect(0,H-7,W,7);for(let x=0;x<W;x+=5){g.fillStyle='#f2f2f2';g.beginPath();g.moveTo(x+2.5,H-6.2);g.lineTo(x+4.6,H-3.5);g.lineTo(x+2.5,H-0.8);g.lineTo(x+0.4,H-3.5);g.closePath();g.fill();}g.fillStyle=timber;g.fillRect(0,0,W,2.4);g.fillRect(0,0,2,H);g.fillRect(W-2,0,2,H);const cx=W/2,cy=H*0.47,R=Math.min(W,H)*0.33;g.fillStyle=gold0;g.beginPath();g.arc(cx,cy,R+1.6,0,7);g.fill();g.fillStyle='#fbf6e8';g.beginPath();g.arc(cx,cy,R,0,7);g.fill();g.strokeStyle='#2a1c10';g.lineWidth=0.8;for(let k=0;k<12;k++){const a=k*Math.PI/6;g.beginPath();g.moveTo(cx+Math.cos(a)*R*0.82,cy+Math.sin(a)*R*0.82);g.lineTo(cx+Math.cos(a)*R*0.95,cy+Math.sin(a)*R*0.95);g.stroke();}};
  const gold0='#d4a83a';
  FK.faceY(g,I,S,-1.9,1.9,GY+1.6,5.2,8.2,(g,W,H)=>clockFace(g,W,H),{dark:0});
  FK.faceX(g,I,S,1.9,GY-1.6,GY+1.6,5.2,8.2,(g,W,H)=>clockFace(g,W,H),{});
  /* belfry and the onion dome */
  FK.box(g,I,-1.5,1.5,GY-1.2,GY+1.2,8.2,9.6,'#efe6cf','#f6efdc','#cfc5ad');FK.faceY(g,I,S,-1.5,1.5,GY+1.2,8.2,9.6,(g,W,H)=>{g.fillStyle='#e8dfc9';g.fillRect(0,0,W,H);PH.archPath(g,W*0.5-5,2,10,H-5,5,'round');g.fillStyle='#2a1c14';g.fill();g.fillStyle='#d4a83a';g.beginPath();g.arc(W/2,H*0.4,2.4,0,7);g.fill();g.fillStyle=timber;g.fillRect(0,0,W,2.2);},{dark:0});FK.faceX(g,I,S,1.5,GY-1.2,GY+1.2,8.2,9.6,(g,W,H)=>{g.fillStyle='#d9cfb8';g.fillRect(0,0,W,H);PH.archPath(g,W*0.5-4,2,8,H-5,4,'round');g.fillStyle='#2a1c14';g.fill();},{});
  FK.ell(g,I(0,GY,9.6),S*1.85,S*0.92,'#b9b19c');const ap=FB.dome(g,I,S,0,GY,1.65,9.6,3.0,k=>k%2?'#f4f6fa':blue,10,'rgba(20,40,80,.3)');FK.ell(g,[ap[0],ap[1]+S*0.1],S*0.3,S*0.15,gold0);PH.pole(g,I,S,0,GY,12.7,1.5,'#d4a83a',0.1);FK.ell(g,I(0,GY,12.9),S*0.3,S*0.3,gold0);
  wing(2.4,6.4,18);
  /* a maypole near the front, flower tubs, beer barrels */
  const mp=I(5.4,GY+4.2,0);FK.ln(g,mp,[mp[0],mp[1]-S*7.4],'#8a6a48',S*0.22);[[1.2,blue],[2.4,'#f2f2f2'],[3.6,A],[4.8,blue],[6.0,'#f2f2f2']].forEach(([z,c],k)=>{const p=[mp[0],mp[1]-S*z];FK.ell(g,p,S*0.55,S*0.2,c);FK.ln(g,[p[0]-S*0.5,p[1]],[p[0]-S*0.7,p[1]+S*0.5],'#3a9a5a',S*0.05);FK.ln(g,[p[0]+S*0.5,p[1]],[p[0]+S*0.7,p[1]+S*0.5],'#3a9a5a',S*0.05);});FK.ell(g,[mp[0],mp[1]-S*7.5],S*0.28,S*0.28,'#d4a83a');
  [[-5.4,GY+3.4],[-4.6,GY+3.9],[4.2,GY+3.0]].forEach(([X,Y],k)=>{FB.cyl(g,I,S,X,Y,0.5,0,0.95,'#8a5d36');FK.ln(g,I(X-0.5,Y+0.1,0.25),I(X+0.5,Y+0.1,0.25),'#3a3d44',S*0.05);FK.ln(g,I(X-0.5,Y+0.1,0.7),I(X+0.5,Y+0.1,0.7),'#3a3d44',S*0.05);FK.ell(g,I(X,Y,0.95),S*0.5,S*0.25,'#a67a4a');});
  PH.guests(g,I,S,[[-0.3,GY+3.4,'#2f7fc4',null,'#3a6a4a'],[0.6,GY+4.4,'#c8442f'],[-0.5,GY+5.4,'#f1f1f1',null,'#3a6a4a'],[0.2,GY+2.4,'#3a6a4a'],[-0.2,GY+6.4,'#a14a8a']]);
};
PE_ANIM.bavarian=function(g,I,S,o,t){const A=o.A,blue='#2f7fc4',GY=-0.8;
  /* clock hands on both faces */
  const hand=(face,ang,len,w,col)=>{const c=face==='y'?I(0,GY+1.61,6.7):I(1.91,GY,6.7),ux=face==='y'?I(1,GY+1.61,6.7)[0]-c[0]:I(1.91,GY-1,6.7)[0]-c[0],uy=face==='y'?I(1,GY+1.61,6.7)[1]-c[1]:I(1.91,GY-1,6.7)[1]-c[1];const dx=Math.sin(ang),dz=Math.cos(ang),px=c[0]+(ux*dx*len),py=c[1]+(uy*dx*len)-S*dz*len;g.strokeStyle=col;g.lineWidth=S*w;g.lineCap='round';g.beginPath();g.moveTo(c[0],c[1]);g.lineTo(px,py);g.stroke();};
  [['y'],['x']].forEach(([f])=>{hand(f,Math.PI/3,0.78,0.09,'#2a1c10');hand(f,5.32,0.55,0.12,'#2a1c10');const c=f==='y'?I(0,GY+1.61,6.7):I(1.91,GY,6.7);FK.ell(g,c,S*0.1,S*0.1,'#2a1c10');});
  /* lozenge flags and bunting */
  const cols=[blue,'#f2f2f2'],sw=Math.sin(t*1.5)*0.1;PH.bunting(g,I,S,[-2.2,GY+1.95,4.7],[-6.4,GY+1.8,3.6],0.7+sw,cols,7,0.34);PH.bunting(g,I,S,[2.2,GY+1.95,4.7],[6.4,GY+1.8,3.6],0.7-sw,cols,7,0.34);
  [[-6.2],[6.2]].forEach(([X],k)=>{const b=I(X,GY,6.6+0.2),top=I(X,GY,6.6+2.2);FK.ln(g,b,top,'#6b7380',S*0.08);const w=Math.sin(t*3+k*1.3)*S*0.1;g.save();g.beginPath();g.moveTo(top[0],top[1]);g.quadraticCurveTo(top[0]+S*0.7,top[1]+S*0.05+w,top[0]+S*1.3,top[1]+S*0.2+w*1.4);g.lineTo(top[0]+S*1.3,top[1]+S*0.95+w*1.4);g.quadraticCurveTo(top[0]+S*0.7,top[1]+S*0.8+w,top[0],top[1]+S*0.9);g.closePath();g.clip();g.fillStyle='#f2f2f2';g.fillRect(top[0],top[1]-S,S*2,S*3);g.fillStyle=blue;for(let q=0;q<4;q++)for(let w2=0;w2<3;w2++){const cx=top[0]+S*(0.25+q*0.35),cy=top[1]+S*(0.15+w2*0.35);if((q+w2)%2===0){g.beginPath();g.moveTo(cx,cy-S*0.17);g.lineTo(cx+S*0.17,cy);g.lineTo(cx,cy+S*0.17);g.lineTo(cx-S*0.17,cy);g.closePath();g.fill();}}g.restore();});};

/* ====================== GOTHIC: a graveyard crypt with a central Gothic spire, iron fences and a violet-lit portal ====================== */
PE_SKIN.gothic=function(g,I,S,o){const A=o.A,stone='#4e525c',[sT,sL,sR]=PH.tri(stone),GY=-0.8,slate='#3a3e48',r=mulberry(41);
  FB.shadow(g,I,S,-6.8,6.8,GY-2.2,GY+2.2);
  /* the crypt: a long dark facade with pointed blind arcades and buttresses */
  const x0=-4.6,x1=4.6,y0=GY-1.9,y1=GY+1.3;FK.box(g,I,x0,x1,y0,y1,0,4.4,sT,sL,sR);
  FK.faceY(g,I,S,x0,x1,y1,0,4.4,(g,W,H)=>{FT_TEX.stone(g,W,H,stone,43,7,'rgba(10,12,18,.5)');const cx=W/2,pw=28;
    PH.archPath(g,cx-pw/2-2,0,pw+4,H-6,17,'point');g.fillStyle='#363a44';g.fill();PH.archPath(g,cx-pw/2,0,pw,H-8,16,'point');const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#2a1a44');gr.addColorStop(0.5,'#1a1030');gr.addColorStop(1,'#0c0818');g.fillStyle=gr;g.fill();g.fillStyle=A;g.globalAlpha=0.5;PH.archPath(g,cx-pw/2+4,0,pw-8,H-14,13,'point');g.fill();g.globalAlpha=1;
    /* iron gates swung open: bars on both sides */g.strokeStyle='#15171c';g.lineWidth=1.3;[[cx-pw/2,1],[cx+pw/2,-1]].forEach(([x,s])=>{for(let k=0;k<4;k++){const bx=x+s*k*2.2;g.beginPath();g.moveTo(bx,0);g.lineTo(bx,H-16-k*1.5);g.stroke();}g.beginPath();g.moveTo(x,8);g.lineTo(x+s*7,8);g.moveTo(x,24);g.lineTo(x+s*7,24);g.stroke();});
    g.strokeStyle='#8a8f9a';g.lineWidth=1.5;PH.archPath(g,cx-pw/2-1,0,pw+2,H-7,16.5,'point');g.stroke();
    /* blind lancets in pairs either side */[[W*0.13],[W*0.25],[W*0.75],[W*0.87]].forEach(([lx])=>{PH.archPath(g,lx-4.2,8,8.4,H*0.62,11,'point');g.fillStyle='#262a34';g.fill();g.strokeStyle='#7a7f8a';g.lineWidth=0.9;g.stroke();g.strokeStyle='rgba(122,127,138,.7)';g.lineWidth=0.7;g.beginPath();g.moveTo(lx,8);g.lineTo(lx,8+H*0.62-11);g.stroke();g.fillStyle=A;g.globalAlpha=0.35;g.fillRect(lx-2.8,10,5.6,H*0.62-18);g.globalAlpha=1;});
    g.fillStyle='#2a2e38';g.fillRect(0,H-5,W,5);g.fillStyle='#3c404a';for(let x=2;x<W;x+=5.4){g.beginPath();g.moveTo(x,H-5);g.lineTo(x+3,H-5);g.lineTo(x+1.5,H-2.4);g.closePath();g.fill();}},{dark:0});
  FK.faceX(g,I,S,x1,y0,y1,0,4.4,(g,W,H)=>{FT_TEX.stone(g,W,H,stone,47,7,'rgba(10,12,18,.5)');PH.archPath(g,W*0.5-4,6,8,H*0.55,11,'point');g.fillStyle='#262a34';g.fill();g.fillStyle=A;g.globalAlpha=0.3;g.fillRect(W*0.5-2.6,9,5.2,H*0.55-12);g.globalAlpha=1;},{});
  /* corner and mid buttresses with pinnacles */
  [-4.55,-2.2,2.2,4.55].forEach(X=>{FK.box(g,I,X-0.32,X+0.32,y1,y1+0.55,0,4.9,sT,sL,sR);FK.poly(g,[I(X-0.32,y1+0.55,4.9),I(X+0.32,y1+0.55,4.9),I(X,y1+0.3,5.9)],'#5a5f6a');FK.poly(g,[I(X+0.32,y1,4.9),I(X+0.32,y1+0.55,4.9),I(X,y1+0.3,5.9)],'#3a3e48');});
  /* the slate roof with an iron ridge crest */
  const rz0=4.4,rz1=5.8;FK.poly(g,[I(x1+0.3,y0-0.3,rz0),I(x1+0.3,y1+0.3,rz0),I(x1+0.3,GY-0.3,rz1)],'#2c2f38');FK.grid(g,I(x0-0.3,y1+0.4,rz0),I(x1+0.3,y1+0.4,rz0),I(x1+0.3,GY-0.3,rz1),I(x0-0.3,GY-0.3,rz1),4,24,(i,j)=>({fill:FK.sh(slate,((i*3+j*7)%5)*0.04-0.08),stroke:'rgba(0,0,0,.3)',lw:0.5}));FK.ln(g,I(x0-0.3,GY-0.3,rz1+0.05),I(x1+0.3,GY-0.3,rz1+0.05),'#15171c',S*0.1);
  for(let X=x0;X<=x1;X+=0.9){const p=I(X,GY-0.3,rz1+0.05);FK.poly(g,[[p[0]-S*0.08,p[1]],[p[0]+S*0.08,p[1]],[p[0],p[1]-S*0.3]],'#15171c');}
  /* the central tower and the tall stone spire with crockets */
  FK.box(g,I,-1.6,1.6,GY-1.6,GY+1.6,4.4,8.8,sT,sL,sR);
  FK.faceY(g,I,S,-1.6,1.6,GY+1.6,4.4,8.8,(g,W,H)=>{FT_TEX.stone(g,W,H,stone,53,7,'rgba(10,12,18,.5)');[[W*0.28],[W*0.72]].forEach(([lx])=>{PH.archPath(g,lx-3.6,10,7.2,H*0.58,11,'point');g.fillStyle='#1c1830';g.fill();g.fillStyle=A;g.globalAlpha=0.6;PH.archPath(g,lx-2.4,12,4.8,H*0.58-4,9,'point');g.fill();g.globalAlpha=1;g.strokeStyle='#8a8f9a';g.lineWidth=0.8;PH.archPath(g,lx-3.6,10,7.2,H*0.58,11,'point');g.stroke();});g.fillStyle='#2a2e38';g.fillRect(0,H-4,W,4);},{dark:0});
  FK.faceX(g,I,S,1.6,GY-1.6,GY+1.6,4.4,8.8,(g,W,H)=>{FT_TEX.stone(g,W,H,stone,57,7,'rgba(10,12,18,.5)');PH.archPath(g,W*0.5-3.6,10,7.2,H*0.58,11,'point');g.fillStyle='#1c1830';g.fill();g.fillStyle=A;g.globalAlpha=0.5;g.fillRect(W*0.5-2.2,14,4.4,H*0.58-12);g.globalAlpha=1;},{});
  /* back pinnacles, the spire, then the front pinnacles */
  const pin=(X,Y)=>{FK.box(g,I,X-0.28,X+0.28,Y-0.28,Y+0.28,8.8,9.6,sT,sL,sR);const t=I(X,Y,11.0),a=I(X-0.4,Y+0.4,9.6),b=I(X+0.4,Y+0.4,9.6),c=I(X+0.4,Y-0.4,9.6);FK.poly(g,[a,b,t],'#5a5f6a');FK.poly(g,[b,c,t],'#3a3e48');};
  pin(-1.45,-0.8-1.45);pin(1.45,-0.8-1.45);
  const bs=1.35,az=15.2,ap=I(0,GY,az),sa=I(-bs,GY+bs,8.8),sb=I(bs,GY+bs,8.8),sc2=I(bs,GY-bs,8.8);
  FK.poly(g,[sa,sb,ap],'#656a76');FK.poly(g,[sb,sc2,ap],'#3d414c');
  g.save();g.beginPath();[sa,sb,ap].forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.clip();g.strokeStyle='rgba(10,12,18,.35)';g.lineWidth=S*0.04;for(let k=1;k<13;k++){const f=k/13,l=[sa[0]+(ap[0]-sa[0])*f,sa[1]+(ap[1]-sa[1])*f],rr=[sb[0]+(ap[0]-sb[0])*f,sb[1]+(ap[1]-sb[1])*f];g.beginPath();g.moveTo(l[0],l[1]);g.lineTo(rr[0],rr[1]);g.stroke();}g.fillStyle=A;g.globalAlpha=0.55;for(let k=0;k<3;k++){const f=0.18+k*0.2,c=[sa[0]+(ap[0]-sa[0])*f+(sb[0]-sa[0])*(1-f)*0.5,sa[1]+(ap[1]-sa[1])*f+(sb[1]-sa[1])*(1-f)*0.5];PH.archPath(g,c[0]-S*0.14,c[1]-S*0.45,S*0.28,S*0.5,S*0.16,'point');g.fill();}g.globalAlpha=1;g.restore();
  g.strokeStyle='#4a4f5a';g.lineWidth=S*0.1;g.beginPath();g.moveTo(sb[0],sb[1]);g.lineTo(ap[0],ap[1]);g.stroke();
  for(let k=1;k<10;k++){const f=k/10,p=[sb[0]+(ap[0]-sb[0])*f,sb[1]+(ap[1]-sb[1])*f];const s=S*(0.22-f*0.12);FK.poly(g,[[p[0],p[1]-s*0.4],[p[0]+s*1.2,p[1]+s*0.2],[p[0]+s*0.5,p[1]+s*0.9]],'#7a7f8a');}
  FK.ln(g,ap,[ap[0],ap[1]-S*1.3],'#9aa0ac',S*0.09);FK.ln(g,[ap[0]-S*0.3,ap[1]-S*0.9],[ap[0]+S*0.3,ap[1]-S*0.9],'#9aa0ac',S*0.08);
  pin(-1.45,GY+1.45);pin(1.45,GY+1.45);
  /* gargoyles on the cornice */
  [-4.4,-1.8,1.8,4.4].forEach((X,k)=>{const b=I(X,y1+0.6,4.2);g.fillStyle='#2e323c';g.beginPath();g.moveTo(b[0]-S*0.2,b[1]);g.lineTo(b[0]+S*0.2,b[1]);g.lineTo(b[0]+S*0.3,b[1]+S*0.4);g.lineTo(b[0]+S*0.05,b[1]+S*0.7);g.lineTo(b[0]-S*0.25,b[1]+S*0.4);g.closePath();g.fill();g.fillStyle='#d8e6c0';g.fillRect(b[0]-S*0.1,b[1]+S*0.3,S*0.06,S*0.06);g.fillRect(b[0]+S*0.05,b[1]+S*0.3,S*0.06,S*0.06);});
  /* the graveyard: tombstones, crosses and iron fences with spiked finials */
  const tomb=(X,Y,k)=>{if(k===0){FK.box(g,I,X-0.38,X+0.38,Y-0.12,Y+0.12,0,0.95,'#7a7f88','#666b74','#4c5058');FK.ell(g,I(X,Y+0.1,0.95),S*0.38,S*0.13,'#8a8f98');}else if(k===1){FK.box(g,I,X-0.1,X+0.1,Y-0.1,Y+0.1,0,1.1,'#7a7f88','#666b74','#4c5058');FK.box(g,I,X-0.4,X+0.4,Y-0.1,Y+0.1,0.6,0.85,'#7a7f88','#666b74','#4c5058');}else{FK.box(g,I,X-0.5,X+0.5,Y-0.3,Y+0.3,0,0.3,'#6a6f78','#585d66','#44474f');FK.box(g,I,X-0.32,X+0.32,Y-0.2,Y+0.2,0.3,0.55,'#757a84','#626771','#4a4d56');}};
  [[-5.4,GY+2.8,0],[-3.8,GY+3.6,1],[-5.2,GY+4.8,2],[-3.2,GY+5.6,0],[4.0,GY+2.9,1],[5.4,GY+3.8,0],[3.6,GY+5.0,0],[5.2,GY+5.4,1]].forEach(([X,Y,k])=>tomb(X,Y,k));
  const fence=(X0,X1,Y)=>{for(let X=X0;X<=X1+0.01;X+=0.5){FK.ln(g,I(X,Y,0),I(X,Y,1.45),'#15171c',S*0.08);FK.poly(g,[[I(X,Y,1.45)[0]-S*0.1,I(X,Y,1.45)[1]],[I(X,Y,1.45)[0]+S*0.1,I(X,Y,1.45)[1]],[I(X,Y,1.45)[0],I(X,Y,1.45)[1]-S*0.34]],'#15171c');}FK.ln(g,I(X0,Y,1.15),I(X1,Y,1.15),'#15171c',S*0.07);FK.ln(g,I(X0,Y,0.35),I(X1,Y,0.35),'#15171c',S*0.07);};
  fence(-6.8,-2.0,GY+6.4);fence(2.0,6.8,GY+6.4);
  /* a dead tree, mist, lamps */
  const tb=I(-6.0,GY+1.2,0);g.strokeStyle='#1d1b1a';g.lineCap='round';g.lineWidth=S*0.3;g.beginPath();g.moveTo(tb[0],tb[1]);g.lineTo(tb[0]+S*0.1,tb[1]-S*2.6);g.stroke();[[0.1,-2.6,-1.1,-1.5],[0.1,-2.6,1.0,-1.7],[0.0,-1.9,-0.9,-0.8],[0.05,-2.0,0.9,-1.1]].forEach(([a,b,c,d],k)=>{g.lineWidth=S*0.13;g.beginPath();g.moveTo(tb[0]+S*a,tb[1]+S*b*0.85);g.lineTo(tb[0]+S*(a+c*0.5),tb[1]+S*(b+d*0.45));g.lineTo(tb[0]+S*(a+c),tb[1]+S*(b+d));g.stroke();});
  [[-2.4,GY+4.2],[2.4,GY+4.2]].forEach(([X,Y],i)=>{PH.pole(g,I,S,X,Y,0,2.3,'#15171c',0.12);const t=I(X,Y,2.4);FK.ell(g,t,S*0.3,S*0.14,'#22252c');});
  PH.guests(g,I,S,[[-0.3,GY+3.2,'#2a2a38',null,'#15171c'],[0.5,GY+4.4,'#5a3a6a'],[-0.5,GY+5.3,'#3a3a44'],[0.2,GY+2.3,'#6a2a3a'],[-0.1,GY+6.6,'#3a4a5a']]);
};
PE_ANIM.gothic=function(g,I,S,o,t){const A=o.A,GY=-0.8;[-2.4,2.4].forEach((X,i)=>{const p=I(X,GY+4.2,2.4);FB.glow(g,p,S*(1.6+Math.sin(t*5+i)*0.15),'rgba(130,255,170,.4)');g.fillStyle='#8fffb0';g.beginPath();g.moveTo(p[0]-S*0.2,p[1]);g.quadraticCurveTo(p[0],p[1]-S*(1.0+Math.sin(t*7+i)*0.12),p[0]+S*0.2,p[1]);g.closePath();g.fill();});
  const pc=I(0,GY+1.3,1.9);FB.glow(g,pc,S*(2.4+Math.sin(t*2)*0.25),'rgba(160,110,255,.35)');
  /* drifting mist */for(let k=0;k<7;k++){const p=I(-5+((k*2.1+t*0.35)%10),GY+2.2+((k*3.7)%4.5),0.3);const gr=g.createRadialGradient(p[0],p[1],0,p[0],p[1],S*1.8);gr.addColorStop(0,'rgba(215,225,232,.22)');gr.addColorStop(1,'rgba(215,225,232,0)');g.fillStyle=gr;g.beginPath();g.ellipse(p[0],p[1],S*2.4,S*0.9,0,0,7);g.fill();}
  /* bats */for(let k=0;k<3;k++){const a=t*0.7+k*2.1,p=I(Math.cos(a)*3.4,GY-0.8+Math.sin(a*1.3)*2.0,11+Math.sin(a*2+k)*1.2),f=Math.sin(t*14+k)*0.5;g.fillStyle='#14121a';g.beginPath();g.moveTo(p[0],p[1]);g.quadraticCurveTo(p[0]-S*0.5,p[1]-S*(0.3+f*0.4),p[0]-S*0.9,p[1]+S*0.05);g.quadraticCurveTo(p[0]-S*0.4,p[1]+S*0.1,p[0],p[1]+S*0.15);g.quadraticCurveTo(p[0]+S*0.4,p[1]+S*0.1,p[0]+S*0.9,p[1]+S*0.05);g.quadraticCurveTo(p[0]+S*0.5,p[1]-S*(0.3+f*0.4),p[0],p[1]);g.fill();}};
/* ====================== FIESTA: a festive stucco gate with an arcade either side and a belltower in the middle ====================== */
PE_SKIN.fiesta=function(g,I,S,o){const A=o.A,pink='#e46f8a',yel='#f0c24a',tur='#3fbfae',terr='#c8643c',cream='#f6ecd6',GY=-0.8,r=mulberry(47);
  FB.shadow(g,I,S,-6.8,6.8,GY-2.0,GY+2.2);
  const wing=(x0,x1,col,seed)=>{FK.box(g,I,x0,x1,GY-1.6,GY+1.6,0,3.7,FK.sh(col,0.15),col,FK.sh(col,-0.3));
    FK.faceY(g,I,S,x0,x1,GY+1.6,0,3.7,(g,W,H)=>{FT_TEX.stucco(g,W,H,col,seed);const n=Math.round(W/11),aw=W/n;for(let k=0;k<n;k++){const ax=k*aw+aw*0.16,w=aw*0.68;PH.archPath(g,ax-1,0,w+2,H-9,w/2+1,'round');g.fillStyle='rgba(255,246,226,.9)';g.fill();PH.archPath(g,ax,0,w,H-10,w/2,'round');const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#5a2a20');gr.addColorStop(1,'#2a120c');g.fillStyle=gr;g.fill();g.fillStyle='rgba(255,210,140,.25)';g.fillRect(ax+w*0.2,0,w*0.6,3);g.fillStyle=cream;g.fillRect(k*aw-0.7,0,1.4,H-9);}
      g.fillStyle=tur;g.fillRect(0,H-9,W,2.2);g.fillStyle=cream;g.fillRect(0,H-6.8,W,1.2);g.fillStyle=A;for(let x=0;x<W;x+=3){g.beginPath();g.moveTo(x,H-5.6);g.lineTo(x+1.5,H-3);g.lineTo(x+3,H-5.6);g.closePath();g.fill();}},{dark:0});
    FK.faceX(g,I,S,x1,GY-1.6,GY+1.6,0,3.7,(g,W,H)=>{FT_TEX.stucco(g,W,H,col,seed+2);},{});
    /* clay-tile eave and a scalloped crest */FK.box(g,I,x0-0.2,x1+0.2,GY-1.6,GY+2.1,3.7,4.0,'#d8794a',terr,'#9a4a28');FK.faceY(g,I,S,x0-0.2,x1+0.2,GY+2.1,3.7,4.0,(g,W,H)=>{g.fillStyle=terr;g.fillRect(0,0,W,H);g.fillStyle='rgba(0,0,0,.22)';for(let x=0;x<W;x+=3){g.fillRect(x,0,0.7,H);}},{dark:0});
    for(let X=x0+0.1;X<x1;X+=0.7){const p=I(X+0.3,GY+1.5,4.0);FK.ell(g,[p[0],p[1]-S*0.12],S*0.24,S*0.16,cream);}
    /* marigold garland swags across the arcade front */
    for(let k=0;k<Math.round((x1-x0)/1.1);k++){const a=x0+k*1.1+0.1,b=a+1.1;let prev=null;for(let q=0;q<=6;q++){const f=q/6,X=a+(b-a)*f,Z=3.45-Math.sin(f*Math.PI)*0.35,p=I(X,GY+1.72,Z);FK.ell(g,p,S*0.12,S*0.12,q%2?'#f08a1c':'#f5b73a');}}};
  wing(-6.4,-1.8,yel,3);
  /* the bell tower */
  FK.box(g,I,-1.8,1.8,GY-1.8,GY+1.8,0,6.6,FK.sh(pink,0.15),pink,FK.sh(pink,-0.3));
  FK.faceY(g,I,S,-1.8,1.8,GY+1.8,0,6.6,(g,W,H)=>{FT_TEX.stucco(g,W,H,pink,11);const ax=W/2-11,aw=22;PH.archPath(g,ax-1.6,0,aw+3.2,34,12.6,'round');g.fillStyle=cream;g.fill();PH.archPath(g,ax,0,aw,32,11,'round');const gr=g.createLinearGradient(0,0,0,32);gr.addColorStop(0,'#5a2a20');gr.addColorStop(1,'#241008');g.fillStyle=gr;g.fill();g.fillStyle='rgba(255,210,140,.3)';g.fillRect(ax+aw*0.3,0,aw*0.4,3);
    /* talavera tile panel */const py=H*0.58;for(let y=0;y<3;y++)for(let x=0;x<7;x++){g.fillStyle=((x+y)%2)?'#2f6fb5':cream;g.fillRect(4+x*4.1,py+y*4.1,3.9,3.9);g.fillStyle=((x+y)%2)?cream:tur;g.beginPath();g.arc(4+x*4.1+1.95,py+y*4.1+1.95,1.1,0,7);g.fill();}g.fillStyle=yel;g.fillRect(0,H-6,W,2);g.fillStyle=cream;g.fillRect(0,H-4,W,4);for(let x=2;x<W;x+=6){g.fillStyle=A;g.beginPath();g.arc(x+1.5,H-2,1.5,0,7);g.fill();}},{dark:0});
  FK.faceX(g,I,S,1.8,GY-1.8,GY+1.8,0,6.6,(g,W,H)=>{FT_TEX.stucco(g,W,H,pink,13);g.fillStyle=cream;g.fillRect(0,H-4,W,4);},{});
  FK.box(g,I,-1.55,1.55,GY-1.55,GY+1.55,6.6,8.6,FK.sh(pink,0.2),FK.sh(pink,0.05),FK.sh(pink,-0.3));
  const belfry=(g,W,H,dark)=>{g.fillStyle=dark?FK.sh(pink,-0.25):FK.sh(pink,0.05);g.fillRect(0,0,W,H);PH.archPath(g,W*0.5-7,3,14,H-9,7,'round');g.fillStyle='#2a1208';g.fill();g.fillStyle=cream;g.fillRect(0,H-3,W,3);};
  FK.faceY(g,I,S,-1.55,1.55,GY+1.55,6.6,8.6,(g,W,H)=>belfry(g,W,H,false),{dark:0});FK.faceX(g,I,S,1.55,GY-1.55,GY+1.55,6.6,8.6,(g,W,H)=>belfry(g,W,H,true),{});
  FK.box(g,I,-1.8,1.8,GY-1.8,GY+1.8,8.6,8.9,cream,'#e6dcc4','#c4b99e');
  const ap=FB.dome(g,I,S,0,GY,1.45,8.9,2.5,k=>['#2f6fb5',cream,yel,cream,tur,cream][k%6],12,'rgba(20,30,60,.28)');
  FK.ell(g,[ap[0],ap[1]+S*0.1],S*0.26,S*0.13,yel);PH.pole(g,I,S,0,GY,11.2,0.9,yel,0.1);PH.hexStar(g,[I(0,GY,12.3)[0],I(0,GY,12.3)[1]],S*0.45,yel);
  wing(1.8,6.4,tur,8);
  /* potted agaves, marigold planters, a fountain-less front court */
  const agave=(X,Y)=>{const b=I(X,Y,0.4);FB.cyl(g,I,S,X,Y,0.45,0,0.45,terr,'#5a2a14');for(let k=0;k<9;k++){const a=-Math.PI/2+(k-4)*0.32;g.strokeStyle=FK.sh('#4f8a6a',(k%2?0.1:-0.12));g.lineWidth=S*0.18;g.lineCap='round';g.beginPath();g.moveTo(b[0],b[1]);g.lineTo(b[0]+Math.cos(a)*S*1.1,b[1]+Math.sin(a)*S*1.0);g.stroke();}};
  [[-5.4,GY+3.4],[5.2,GY+3.2],[-4.4,GY+5.2],[4.2,GY+5.4]].forEach(([X,Y],k)=>{if(k%2===0)agave(X,Y);else{FB.cyl(g,I,S,X,Y,0.5,0,0.7,terr,'#4a2a14');for(let q=0;q<7;q++){FK.ell(g,[I(X,Y,0.7)[0]+(q-3)*S*0.15,I(X,Y,0.7)[1]-S*0.16-((q*5)%3)*S*0.1],S*0.2,S*0.16,q%2?'#f08a1c':'#f5b73a');}}});
  PH.guests(g,I,S,[[-0.3,GY+3.4,'#e8447a',null,'#d9b24a'],[0.6,GY+4.4,'#2f6fb5',null,'#d9b24a'],[-0.5,GY+5.4,'#f0c24a'],[0.2,GY+2.4,'#3fbfae',null,'#d9b24a'],[-0.2,GY+6.4,'#c8442f']]);
};
PE_ANIM.fiesta=function(g,I,S,o,t){const A=o.A,GY=-0.8,cols=['#e8447a','#f0c24a','#3fbfae','#2f6fb5','#f08a1c','#8a5ad0'];
  /* the bell, swinging in the arch */const bc=I(0,GY+1.56,7.6),sw=Math.sin(t*2.2)*0.28;g.save();g.translate(bc[0],bc[1]-S*0.55);g.rotate(sw);g.fillStyle='#e2b24a';g.beginPath();g.moveTo(-S*0.45,S*0.7);g.quadraticCurveTo(-S*0.55,S*0.15,0,-S*0.05);g.quadraticCurveTo(S*0.55,S*0.15,S*0.45,S*0.7);g.closePath();g.fill();g.fillStyle='rgba(255,255,255,.35)';g.fillRect(-S*0.25,S*0.05,S*0.1,S*0.55);g.fillStyle='#8a5a1a';g.beginPath();g.arc(0,S*0.75,S*0.12,0,7);g.fill();g.restore();
  /* papel picado strings */
  const pap=(A0,B0,sag,ph)=>{let prev=null;for(let k=0;k<=12;k++){const f=k/12,X=A0[0]+(B0[0]-A0[0])*f,Y=A0[1]+(B0[1]-A0[1])*f,Z=A0[2]+(B0[2]-A0[2])*f-sag*4*f*(1-f),p=I(X,Y,Z);if(prev)FK.ln(g,prev,p,'rgba(60,40,30,.5)',S*0.035);prev=p;}for(let k=0;k<12;k++){const f=(k+0.5)/12,X=A0[0]+(B0[0]-A0[0])*f,Y=A0[1]+(B0[1]-A0[1])*f,Z=A0[2]+(B0[2]-A0[2])*f-sag*4*f*(1-f),p=I(X,Y,Z),w=Math.sin(t*2.4+k*0.7+ph)*S*0.08;g.fillStyle=cols[(k+Math.round(ph))%6];g.beginPath();g.moveTo(p[0]-S*0.3,p[1]);g.lineTo(p[0]+S*0.3,p[1]);g.lineTo(p[0]+S*0.3+w,p[1]+S*0.7);g.lineTo(p[0]-S*0.3+w,p[1]+S*0.7);g.closePath();g.fill();g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.moveTo(p[0],p[1]+S*0.18);g.lineTo(p[0]+S*0.12+w*0.5,p[1]+S*0.36);g.lineTo(p[0]+w*0.5,p[1]+S*0.54);g.lineTo(p[0]-S*0.12+w*0.5,p[1]+S*0.36);g.closePath();g.fill();}};
  pap([-1.8,GY+1.9,6.2],[-6.4,GY+1.8,3.9],0.9,0);pap([1.8,GY+1.9,6.2],[6.4,GY+1.8,3.9],0.9,2);pap([-6.4,GY+1.9,5.0],[6.4,GY+1.9,5.0],1.6,1);};

/* ====================== SPACE: an obsidian arch around a starless void, lit along its inner edge ====================== */
PE_SKIN.space=function(g,I,S,o){const A=o.A,GY=-0.4,r=mulberry(53);
  FB.shadow(g,I,S,-6.8,6.8,GY-2.0,GY+2.2);
  /* a lit docking ring in the plaza */
  const rc=I(0,GY+5.2,0.02);g.strokeStyle=A;g.globalAlpha=0.6;g.lineWidth=S*0.08;g.beginPath();g.ellipse(rc[0],rc[1],S*3.1,S*1.55,0,0,7);g.stroke();g.globalAlpha=0.3;g.beginPath();g.ellipse(rc[0],rc[1],S*2.2,S*1.1,0,0,7);g.stroke();g.globalAlpha=1;
  const rx=4.5,rz=7.6,z0=0.5,th=1.45,d=1.8,yv=GY-0.35,rxi=rx-th,rzi=rz-th*rz/rx;
  /* the void behind the frame */
  const vp=[];for(let k=0;k<=40;k++){const a=Math.PI*k/40;vp.push(I(Math.cos(a)*rxi,yv,z0+Math.sin(a)*rzi));}vp.push(I(rxi,yv,z0));vp.push(I(-rxi,yv,z0));
  g.save();g.beginPath();vp.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.clip();const vc=I(0,yv,z0+rzi*0.55);const gr=g.createRadialGradient(vc[0],vc[1],0,vc[0],vc[1],S*rxi*1.5);gr.addColorStop(0,'#010003');gr.addColorStop(0.55,'#08031a');gr.addColorStop(1,'#1c0d3e');g.fillStyle=gr;g.fillRect(vc[0]-S*8,vc[1]-S*12,S*16,S*24);
  for(let k=0;k<90;k++){const p=[vc[0]+(r()-0.5)*S*rxi*2,vc[1]+(r()-0.5)*S*rzi*1.9];g.fillStyle='rgba(220,230,255,'+(0.25+r()*0.6)+')';g.fillRect(p[0],p[1],S*(0.04+r()*0.06),S*(0.04+r()*0.06));}
  for(let arm=0;arm<3;arm++){g.strokeStyle='rgba(150,120,255,.5)';g.lineWidth=S*0.16;g.beginPath();for(let a=0;a<4.5;a+=0.1){const rr=S*(0.1+a*0.32),ang=a+arm*2.094;const x=vc[0]+Math.cos(ang)*rr,y=vc[1]-S*0.6+Math.sin(ang)*rr*0.55;a?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}
  FB.glow(g,[vc[0],vc[1]-S*0.6],S*1.6,'rgba(200,170,255,.5)');g.restore();
  /* the obsidian frame */
  PH.archBand(g,I,S,0,GY,d,rx,rz,z0,th,'#2c3552',(i,n)=>{const f=i/n;return FK.sh('#161c30',0.12-Math.abs(f-0.3)*0.45);},0,Math.PI,36);
  /* lit inner edge and a faint outer rim */
  const edge=(off,col,w)=>{g.strokeStyle=col;g.lineWidth=w;g.lineJoin='round';g.beginPath();for(let k=0;k<=40;k++){const a=Math.PI*k/40,p=I(Math.cos(a)*(rx-off),GY+d/2+0.01,z0+Math.sin(a)*(rz-off*rz/rx));k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);}g.stroke();};
  g.save();g.globalAlpha=0.35;edge(th,A,S*0.34);g.restore();edge(th,A,S*0.1);edge(th-0.05,'#ffffff',S*0.03);g.save();g.globalAlpha=0.45;edge(0.04,A,S*0.05);g.restore();
  /* light seams crossing the frame */
  [0.2,0.5,0.8].forEach(f=>{const a=Math.PI*f,p=I(Math.cos(a)*(rx-th*0.15),GY+d/2+0.01,z0+Math.sin(a)*(rz-th*0.15*rz/rx)),q=I(Math.cos(a)*(rx-th*0.85),GY+d/2+0.01,z0+Math.sin(a)*(rz-th*0.85*rz/rx));FK.ln(g,p,q,'rgba(130,210,255,.35)',S*0.05);});
  /* plinths at the feet, with light strips */
  [-1,1].forEach(s=>{const X=s*(rx-th/2);FK.box(g,I,X-1.1,X+1.1,GY-1.1,GY+1.1,0,0.5,'#2a3350','#1c2338','#12172a');FK.ln(g,I(X-1.05,GY+1.1,0.25),I(X+1.05,GY+1.1,0.25),A,S*0.07);FK.ln(g,I(X+1.1,GY-1.05,0.25),I(X+1.1,GY+1.05,0.25),FK.sh(A,-0.4),S*0.07);});
  /* cold mist hugging the base */
  for(let k=0;k<7;k++){const p=I(-4.5+k*1.5,GY+1.0+((k*2.3)%2.4),0.25);const gr=g.createRadialGradient(p[0],p[1],0,p[0],p[1],S*2);gr.addColorStop(0,'rgba(150,190,255,.2)');gr.addColorStop(1,'rgba(150,190,255,0)');g.fillStyle=gr;g.beginPath();g.ellipse(p[0],p[1],S*2.4,S*0.8,0,0,7);g.fill();}
  PH.guests(g,I,S,[[-0.3,GY+3.2,'#e8eef6','#7fd6ff'],[0.6,GY+4.2,'#c8d4e6','#7fd6ff'],[-0.5,GY+5.0,'#e8eef6','#7fd6ff'],[0.3,GY+6.0,'#aab8d0','#7fd6ff'],[-0.2,GY+6.9,'#e8eef6','#7fd6ff']]);
};
PE_ANIM.space=function(g,I,S,o,t){const A=o.A,GY=-0.4,rx=4.5,rz=7.6,z0=0.5,th=1.45,yv=GY-0.35,rxi=rx-th,rzi=rz-th*rz/rx;
  const vp=[];for(let k=0;k<=40;k++){const a=Math.PI*k/40;vp.push(I(Math.cos(a)*rxi,yv,z0+Math.sin(a)*rzi));}vp.push(I(rxi,yv,z0));vp.push(I(-rxi,yv,z0));
  g.save();g.beginPath();vp.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.clip();const vc=I(0,yv,z0+rzi*0.55),r=mulberry(9);
  for(let k=0;k<44;k++){const p=[vc[0]+(r()-0.5)*S*rxi*2,vc[1]+(r()-0.5)*S*rzi*1.9],tw=0.5+0.5*Math.sin(t*(1.5+r()*3)+k);g.fillStyle='rgba(255,255,255,'+(tw*0.9)+')';g.fillRect(p[0]-S*0.03,p[1]-S*0.03,S*0.09,S*0.09);}
  g.globalCompositeOperation='lighter';for(let arm=0;arm<3;arm++){g.strokeStyle='rgba(170,140,255,.28)';g.lineWidth=S*0.12;g.beginPath();for(let a=0;a<4.5;a+=0.1){const rr=S*(0.1+a*0.32),ang=a+arm*2.094+t*0.35;const x=vc[0]+Math.cos(ang)*rr,y=vc[1]-S*0.6+Math.sin(ang)*rr*0.55;a?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}FB.glow(g,[vc[0],vc[1]-S*0.6],S*(1.5+Math.sin(t*1.6)*0.2),'rgba(200,170,255,.3)');g.restore();
  /* a pulse running up the lit edge */const f=((t*0.35)%1);if(!o.stat)for(let k=0;k<10;k++){const a=Math.PI*(f+k*0.012)%Math.PI,p=I(Math.cos(a)*(rx-th),GY+0.91,z0+Math.sin(a)*(rz-th*rz/rx));FB.glow(g,p,S*(0.55-k*0.035),'rgba(150,225,255,'+(0.3-k*0.025)+')');}
  /* orbit ring with two moons, and drifting shards */
  const oc=I(0,GY,z0+rz*0.72);g.save();g.translate(oc[0],oc[1]);g.rotate(-0.2);g.strokeStyle='rgba(130,210,255,.38)';g.lineWidth=S*0.05;g.beginPath();g.ellipse(0,0,S*6.2,S*1.9,0,0,7);g.stroke();[0,Math.PI].forEach((ph,k)=>{const a=t*0.5+ph,x=Math.cos(a)*S*6.2,y=Math.sin(a)*S*1.9,front=Math.sin(a)>0;FB.glow(g,[x,y],S*0.8,'rgba(130,210,255,.4)');FK.ell(g,[x,y],S*0.24,S*0.24,front?'#e8f6ff':'#8aa0b8');});g.restore();
  [[-6.1,GY+0.6,0],[6.1,GY+0.4,1.7]].forEach(([X,Y,ph],k)=>{const z=3.4+Math.sin(t*0.9+ph)*0.35,b=I(X,Y,z),h=S*2.6;g.fillStyle='rgba(8,12,26,.3)';g.beginPath();g.ellipse(I(X,Y,0.05)[0],I(X,Y,0.05)[1],S*0.55,S*0.25,0,0,7);g.fill();const gr=g.createLinearGradient(b[0]-S*0.5,0,b[0]+S*0.5,0);gr.addColorStop(0,'#2a3350');gr.addColorStop(1,'#0e1322');g.fillStyle=gr;g.beginPath();g.moveTo(b[0],b[1]-h*0.5);g.lineTo(b[0]+S*0.5,b[1]);g.lineTo(b[0],b[1]+h*0.5);g.lineTo(b[0]-S*0.5,b[1]);g.closePath();g.fill();g.strokeStyle=A;g.lineWidth=S*0.06;g.stroke();FB.glow(g,b,S*1.4,'rgba(120,210,255,.28)');});};
/* ====================== WILD WEST: a big sandstone rock arch spanning the trail ====================== */
PE_SKIN.western=function(g,I,S,o){const A=o.A,GY=-0.6,r=mulberry(59),sand=['#c4673a','#b5552f','#d98a4e','#e6b27a','#9a4a2a','#cc7442'];
  FB.shadow(g,I,S,-6.8,6.8,GY-4.8,GY+2.4);
  /* the butte behind */
  FK.box(g,I,-4.2,3.8,GY-4.8,GY-2.6,0,6.4,'#e3a868','#c4673a','#8a3e22');FK.faceY(g,I,S,-4.2,3.8,GY-2.6,0,6.4,(g,W,H)=>PH.strata(g,W,H,71,sand),{dark:0.05});FK.faceX(g,I,S,3.8,GY-4.8,GY-2.6,0,6.4,(g,W,H)=>PH.strata(g,W,H,73,sand),{});
  PH.boulder(g,I(-1.5,GY-3.7,6.5),S*1.4,S*0.6,'#d98a4e',3);PH.boulder(g,I(1.6,GY-3.7,6.5),S*1.1,S*0.5,'#cc7442',4);
  /* pillars */
  const pillar=(x0,x1,seed)=>{FK.box(g,I,x0,x1,GY-1.9,GY+1.9,0,3.6,'#e3a868','#c4673a','#8a3e22');FK.faceY(g,I,S,x0,x1,GY+1.9,0,3.6,(g,W,H)=>PH.strata(g,W,H,seed,sand),{dark:0});FK.faceX(g,I,S,x1,GY-1.9,GY+1.9,0,3.6,(g,W,H)=>PH.strata(g,W,H,seed+2,sand),{});
    const cx=(x0+x1)/2;PH.boulder(g,I(cx,GY+1.9,0.2),S*1.5,S*0.5,'#b5552f',seed);PH.boulder(g,I(x0+0.3,GY+1.9,3.6),S*0.9,S*0.5,'#d98a4e',seed+1);PH.boulder(g,I(x1-0.3,GY+1.2,3.6),S*0.8,S*0.45,'#cc7442',seed+2);};
  pillar(-5.5,-2.7,81);
  /* the arch: a thick strata-banded span */
  const rx=4.95,rz=4.7,z0=3.4,th=1.95,d=3.4;PH.archBand(g,I,S,0,GY,d,rx,rz,z0,th,'#e9b27a',(i,n)=>{const c=sand[(Math.floor(i/2)+Math.floor(i*i%5/4))%6],f=i/n;return FK.sh(c,0.14-0.34*f+(i%3)*0.03);},0,Math.PI,30);
  /* weathering: pits, streaks and a roughened crown of boulders */
  for(let k=0;k<26;k++){const a=Math.PI*(0.06+0.88*r()),rr=rx-th*(0.15+0.7*r()),p=I(Math.cos(a)*rr,GY+d/2+0.01,z0+Math.sin(a)*(rz-(rx-rr)*rz/rx));g.fillStyle='rgba(60,24,10,.2)';g.beginPath();g.ellipse(p[0],p[1],S*(0.1+r()*0.18),S*(0.05+r()*0.08),0,0,7);g.fill();}
  [0.12,0.3,0.5,0.7,0.88].forEach((f,k)=>{const a=Math.PI*f,p=I(Math.cos(a)*(rx+0.05),GY+d/2-0.4,z0+Math.sin(a)*(rz+0.05));PH.boulder(g,p,S*(0.55+(k%2)*0.2),S*0.32,sand[(k+1)%6],90+k);});
  pillar(2.7,5.5,91);
  /* a plank sign hung from the crown by chains, burnt with a horseshoe and star */
  FK.faceY(g,I,S,-1.3,1.3,GY+0.3,3.7,4.9,(g,W,H)=>{FT_TEX.planks(g,W,H,'#9c7a4c',4,4.4);g.strokeStyle='#2a1a0e';g.lineWidth=1.3;g.lineCap='round';g.beginPath();g.arc(W/2,H*0.55,H*0.3,Math.PI*0.15,Math.PI*0.85,true);g.stroke();for(let k=-2;k<=2;k++){g.fillStyle='#2a1a0e';g.beginPath();g.arc(W/2+k*H*0.15,H*0.55-Math.sqrt(Math.max(0,(H*0.3)**2-(k*H*0.15)**2))+0.2,0.8,0,7);g.fill();}PH.hexStar(g,[W/2,H*0.5],H*0.18,'#2a1a0e');g.strokeStyle='rgba(30,16,8,.6)';g.lineWidth=1;g.strokeRect(0.8,0.8,W-1.6,H-1.6);},{dark:0});
  [-1.05,1.05].forEach(X=>{FK.ln(g,I(X,GY+0.3,4.9),I(X*0.5,GY+0.3,5.95),'#3a3d44',S*0.05);});
  /* cacti, a wagon wheel, a skull on a post, hitching rail, boulders */
  PH.cactus(g,I,S,-6.1,GY+3.4,3.4,[[-1,0,1.8,1.2],[1,0,2.3,1.0]]);PH.cactus(g,I,S,6.0,GY+4.4,2.7,[[1,0,1.5,1.0]]);PH.cactus(g,I,S,-4.7,GY+5.6,0.9,[]);
  [[-4.4,GY+3.0],[3.9,GY+2.9]].forEach(([X,Y],k)=>{[[-0.7],[0.7]].forEach(([d])=>FK.box(g,I,X+d-0.1,X+d+0.1,Y-0.1,Y+0.1,0,1.1,'#7a5230','#5e3e24','#44301c'));FK.ln(g,I(X-0.8,Y,0.95),I(X+0.8,Y,0.95),'#6a4528',S*0.14);});
  const wc=I(5.0,GY+2.2,0.9);g.strokeStyle='#6a4528';g.lineWidth=S*0.12;g.beginPath();g.ellipse(wc[0],wc[1],S*0.9,S*1.05,-0.2,0,7);g.stroke();for(let k=0;k<6;k++){const a=k*Math.PI/3;FK.ln(g,wc,[wc[0]+Math.cos(a)*S*0.9,wc[1]+Math.sin(a)*S*1.05],'#6a4528',S*0.07);}
  PH.pole(g,I,S,-3.3,GY+4.5,0,1.5,'#6a4528',0.14);const sk=I(-3.3,GY+4.5,1.65);FK.ell(g,sk,S*0.3,S*0.26,'#efe6d2');FK.ell(g,[sk[0]-S*0.1,sk[1]],S*0.07,S*0.08,'#2a1a10');FK.ell(g,[sk[0]+S*0.1,sk[1]],S*0.07,S*0.08,'#2a1a10');
  [[5.6,GY-1.2,1.2],[-5.9,GY-1.0,1.0],[6.3,GY+1.4,0.8]].forEach(([X,Y,k],i)=>PH.boulder(g,I(X,Y,0.3),S*k,S*k*0.5,sand[(i*2)%6],120+i));
  PH.guests(g,I,S,[[-0.3,GY+3.4,'#7a3a2a',null,'#6b4a2a'],[0.6,GY+4.4,'#3a5a8a',null,'#3a2a1c'],[-0.5,GY+5.4,'#c9a227',null,'#8a6a42'],[0.2,GY+2.4,'#a14a2a',null,'#3a2a1c'],[-0.2,GY+6.4,'#4a7a4a',null,'#6b4a2a']]);
};
PE_ANIM.western=function(g,I,S,o,t){const GY=-0.6;
  /* a tumbleweed rolling across the front of the plaza */
  const f=((t*0.09)%1),X=-6.4+f*12.8,Y=GY+5.4-0.5*Math.abs(Math.sin(f*20)),b=I(X,Y,0.45+Math.abs(Math.sin(t*5))*0.15),R=S*0.55;g.save();g.translate(b[0],b[1]);g.rotate(t*2.5);g.strokeStyle='#9a7a48';g.lineWidth=S*0.05;g.lineCap='round';const rr=mulberry(5);for(let k=0;k<14;k++){const a=rr()*Math.PI*2,r2=R*(0.5+rr()*0.5);g.beginPath();g.ellipse(0,0,r2,r2*(0.5+rr()*0.5),a,0,Math.PI*(1+rr()));g.stroke();}g.restore();
  /* a little dust drifting off the plaza */if(!o.stat)for(let k=0;k<5;k++){const age=(t*0.2+k/5)%1,p=I(-4+k*2.1,GY+5.5-age*1.2,0.3+age*0.8);const gr=g.createRadialGradient(p[0],p[1],0,p[0],p[1],S*1.2);gr.addColorStop(0,'rgba(226,190,130,'+(0.22*(1-age))+')');gr.addColorStop(1,'rgba(226,190,130,0)');g.fillStyle=gr;g.beginPath();g.ellipse(p[0],p[1],S*1.8,S*0.7,0,0,7);g.fill();}};

/* ===== per-land info: used by the demo and as defaults (accent = land colour, ground = the tile colour under the sprite) ===== */
const PE_INFO={
  medieval:{land:'Medieval',title:'The Raised Portcullis Gatehouse',accent:'#c0392b',ground:'#8aa66a',desc:'Stone gatehouse with the portcullis hauled up into the arch, a lowered drawbridge over a moat, round towers under cone roofs with pennants, a machicolated parapet and heraldic banners.'},
  nordic:{land:'Nordic',title:'The Dragon Gate',accent:'#2f6f9f',ground:'#7f9a8c',desc:'A timber gate of two knotwork-carved posts under a shingled gable, with a carved dragon head rising from each end of the ridge, hung round shields and banners, palisade wings and braziers.'},
  jungle:{land:'Jungle',title:'The Corbel-Arch Gateway',accent:'#2fb59a',ground:'#4e7d3c',desc:'A Mayan stone archway: stepped pylons with carved glyph panels, a corbelled (stepped-vault) opening, a fret frieze and a roof comb with a sun disc, vines, ferns and flaming torch columns.'},
  frontier:{land:'Frontier',title:'The Log Fort Gatehouse',accent:'#b5482a',ground:'#7f8b55',desc:'Two overhanging log blockhouses with shingled hip roofs and pennants, a bridge-house over the gate, a hung plank sign, a lantern, pointed-log stockade wings, a hitching rail and barrels.'},
  classic:{land:'Classic Midway',title:'The Candy-Stripe Arch',accent:'#e23b3b',ground:'#d8c394',desc:'Striped pylons carrying a candy-striped arch with a gold star medallion and a bulb-lined edge; bunting, pennants, balloon bunches and two striped-awning ticket booths on a checkered path.'},
  alpine:{land:'Alpine',title:'The Lodge with the Tower',accent:'#c8442f',ground:'#7f9a8c',desc:'A stone-and-timber lodge with a carved balcony and a snow-laden roof weighted with stones, an attached stone tower under a steep shingled roof, a chimney with smoke, snowy firs and stacked firewood.'},
  bavarian:{land:'Bavarian',title:'The Clock-Tower Gate',accent:'#2f7fc4',ground:'#8fbf68',desc:'A half-timbered gatehouse: a central clock tower with a blue-and-white onion dome and a clock face reading ten past ten, red-tile gabled wings with a lozenge band, lozenge flags and bunting, a maypole and barrels.'},
  gothic:{land:'Gothic',title:'The Crypt Gate',accent:'#8b5cf6',ground:'#5e6a5f',desc:'A crypt facade with a violet-lit pointed portal and open iron gates, blind lancet arcades and buttresses, a tall crocketed stone spire at the centre, gargoyles, a graveyard, spiked fences, mist and bats.'},
  fiesta:{land:'Fiesta',title:'La Puerta de la Fiesta',accent:'#e8447a',ground:'#e0c097',desc:'A pink stucco bell tower with a bell in its arch and a talavera-tile dome, flanked by yellow and turquoise round-arch arcades with marigold garlands, papel picado strings and a tiled path.'},
  space:{land:'Space',title:'The Void Arch',accent:'#38d6ff',ground:'#8d95a7',desc:'A tall obsidian arch edged with a lit seam around a starfield void with a spiral galaxy, an orbit ring with two moons, floating monolith shards, a lit docking ring and low cold mist.'},
  western:{land:'Wild West',title:'The Great Rock Arch',accent:'#c9602e',ground:'#e5d2a3',desc:'A sandstone rock arch of banded strata spanning the trail between two rock pillars, a butte behind, a hung plank sign, saguaro cacti, a wagon wheel, a skull on a post and a tumbleweed in the foreground.'}
};

/* ===== API ===== */
const PE_ORDER=['medieval','nordic','jungle','frontier','classic','alpine','bavarian','gothic','fiesta','space','western'];
const PE_ALIAS={wildwest:'western',wild_west:'western',alps:'alpine',german:'bavarian',midway:'classic',moon:'space'};
/* each skin was drawn with its gate at Y=GY; this shifts the whole entrance so the gate sits at the centre of the hex slot (a hair behind it, so the front props stay inside) */
const PE_GY={medieval:-1.2,nordic:-0.8,jungle:-0.6,frontier:-1.0,classic:-0.8,alpine:-0.6,bavarian:-0.8,gothic:-0.8,fiesta:-0.8,space:-0.4,western:-0.6};
const PE_TFIX={medieval:1.3,nordic:0.5,jungle:0.5,frontier:1.3,classic:1.0,alpine:0.8,bavarian:1.0,gothic:0.6,fiesta:1.1,space:1.0,western:6.6};
const PE_K=0.09; /* sprite scale: S = R * PE_K (was 0.08) */
function parkEntranceResolve(theme){const t=PE_ALIAS[theme]||theme;return PE_SKIN[t]?t:'classic';}
function parkEntranceSprite(R,theme,accent,scale){const C=parkEntranceSprite._c=parkEntranceSprite._c||{};const sc=scale||getBakeScale(),A=accent||PE_INFO[theme].accent,key=[R,theme,A,sc].join('|');if(C[key])return C[key];
  const W=Math.ceil(2.1*R),H=Math.ceil(2.34*R),oy=Math.ceil(1.74*R),cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);const S=R*PE_K,cx=W/2,sy=-PE_GY[theme]-0.4,I=(X,Y,Z)=>[cx+(X-(Y+sy))*0.7*S,oy+(X+(Y+sy))*0.35*S-Z*S];
  PE_SKIN[theme](g,I,S,{A:A});if(PE_ANIM[theme])PE_ANIM[theme](g,I,S,{A:A,stat:true},PE_TFIX[theme]);return C[key]={canvas:cv,ox:W/2,oy,w:W,h:H};}
/* drawParkEntrance(ctx, cx, cy, R, {theme, accent, flip, tile, scale}): (cx,cy) = centre of the hex slot on the ground. Static: baked once and blitted. */
function drawParkEntrance(ctx,cx,cy,R,o){o=o||{};const th=parkEntranceResolve(o.theme||o.themeId),A=o.accent||PE_INFO[th].accent,s=parkEntranceSprite(R,th,A,o.scale);
  ctx.save();ctx.translate(cx,cy);if(o.flip)ctx.scale(-1,1);
  if(o.tile){ctx.beginPath();for(let k=0;k<6;k++){const a=Math.PI/180*(60*k+30);ctx[k?'lineTo':'moveTo'](R*Math.cos(a),R*Math.sin(a)*0.58);}ctx.closePath();ctx.fillStyle=typeof o.tile==='string'?o.tile:PE_INFO[th].ground;ctx.fill();}
  ctx.drawImage(s.canvas,-s.ox,-s.oy,s.w,s.h);ctx.restore();}
/* ground circles (tile-local px) the entrance covers, to keep scenery out of its way */
function parkEntranceFootprint(R){const S=R*PE_K,P=(X,Y)=>[(X-Y)*0.7*S,(X+Y)*0.35*S],c=[];for(let Y=-3;Y<=6.1;Y+=2)for(let X=-6.4;X<=6.5;X+=2.1){const p=P(X,Y);c.push({x:p[0],y:p[1],r:2.0*S});}return c;}
window.drawParkEntrance = drawParkEntrance; window.parkEntranceFootprint = parkEntranceFootprint;
})();
