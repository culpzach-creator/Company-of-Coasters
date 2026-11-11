/* Imported layered land artwork; each source pack has an isolated canvas namespace. */
const revisedLandCache = (() => {
  const entries = new Map();
  const limit = 128 * 1024 * 1024;
  let bytes = 0;
  const size = land => 4 * (land.back.width * land.back.height + land.front.width * land.front.height);
  return {
    get(key) {
      const land = entries.get(key);
      if (land) {
        entries.delete(key);
        entries.set(key, land);
      }
      return land;
    },
    set(key, land) {
      const cost = size(land);
      if (cost > limit) return land;
      while (bytes + cost > limit && entries.size) {
        const oldest = entries.keys().next().value;
        bytes -= size(entries.get(oldest));
        entries.delete(oldest);
      }
      entries.set(key, land);
      bytes += cost;
      return land;
    }
  };
})();
const REVISED_LAND_PACKS = Object.freeze({
  jungle: (() => {

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

/* ===== JUNGLE ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const JS=(c,x,y,rx)=>{c.fillStyle='rgba(12,40,22,.28)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const JPAL=[['#2f6b3a','#3f8a45','#58a04f','#2a5c35'],['#2b6a46','#3a8a58','#4fa56a','#25583b'],['#3d7a34','#58a03f','#76b84e','#336a2c'],['#2a6048','#37805e','#4c9c74','#234f3b']];
const JSTONE='#b5ae94',JSTONE_D='#8c866e',JSTONE_L='#cfc9b0',JMOSS='#5f8f3f';
const JFROND=(c,x,y,ang,len,u,col,mid,droop)=>{const ex=x+Math.cos(ang)*len,ey=y+Math.sin(ang)*len*0.6+len*(droop||0.35),mx=x+Math.cos(ang)*len*0.55,my=y+Math.sin(ang)*len*0.7-len*0.25;
  c.lineCap='round';c.strokeStyle=col;c.lineWidth=u*0.42;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(mx,my,ex,ey);c.stroke();c.strokeStyle=mid;c.lineWidth=u*0.1;c.stroke();
  for(let k=1;k<7;k++){const t=k/7,q=1-t,px=q*q*x+2*q*t*mx+t*t*ex,py=q*q*y+2*q*t*my+t*t*ey,s=len*0.2*(1-t*0.6);TH.ln(c,[px,py],[px+Math.sin(ang)*s*0.5-Math.cos(ang)*s*0.2,py+s*0.55],col,u*0.14);TH.ln(c,[px,py],[px-Math.sin(ang)*s*0.5-Math.cos(ang)*s*0.2,py+s*0.55],col,u*0.14);}};
const JBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.28),shade(col,0.16));
const JVINE=(c,x,y,u,r,n)=>{for(let k=0;k<n;k++){const vx=x+(r()-0.5)*u*2.4,vy=y-r()*u*1.2;TH.ell(c,vx,vy,u*(0.25+r()*0.3),u*(0.18+r()*0.2),r()<0.5?'#4d8a3a':'#3a7030');}};
const JUNGLE_ASSETS={
  /* ---------- trees ---------- */
  broadleaf:{cat:'tree',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*7+1),H=u*(4.6+r()*1.3),pal=JPAL[v%4];JS(c,x,y,u*2.3);c.lineCap='round';c.strokeStyle='#5f4228';c.lineWidth=u*0.7;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.1,y-H*0.35,x+u*0.05,y-H*0.62);c.stroke();TH.poly(c,[[x-u*0.55,y],[x-u*0.2,y-u*0.9],[x+u*0.15,y-u*0.9],[x+u*0.6,y]],'#5f4228');TH.ln(c,[x-u*0.1,y-H*0.1],[x-u*0.05,y-H*0.55],'#7b5a38',u*0.18);
    TH.ln(c,[x,y-H*0.5],[x-u*1.1,y-H*0.85],'#5f4228',u*0.32);TH.ln(c,[x,y-H*0.55],[x+u*1.2,y-H*0.82],'#5f4228',u*0.3);
    const cy=y-H*0.82;[[0,-0.3,1.9,1.15],[-1.55,-0.1,1.3,1.0],[1.55,-0.1,1.3,1.0],[-0.8,-1.15,1.45,1.0],[0.85,-1.15,1.45,1.0],[0,-1.7,1.2,0.85],[-1.1,0.5,0.9,0.6],[1.1,0.5,0.9,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[(i+(v>>2))%4],r,10));
    for(let k=0;k<4;k++){const vx=x+(r()-0.5)*u*2.6,vy=cy+u*(0.4+r()*0.5);TH.ln(c,[vx,vy],[vx+(r()-0.5)*u*0.3,vy+u*(0.8+r()*0.8)],'#3a7030',u*0.08);}}},
  ceiba:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*5+3),H=u*(8.4+r()*1.6);JS(c,x,y,u*2.6);const t='#8a7d68',td='#6d6150';
    TH.poly(c,[[x-u*1.5,y+u*0.1],[x-u*0.55,y-u*2.2],[x-u*0.45,y-u*0.2]],td);TH.poly(c,[[x+u*1.5,y+u*0.1],[x+u*0.55,y-u*2.2],[x+u*0.45,y-u*0.2]],td);TH.poly(c,[[x-u*0.7,y],[x-u*0.5,y-H*0.78],[x+u*0.5,y-H*0.78],[x+u*0.7,y]],t);TH.poly(c,[[x+u*0.1,y],[x+u*0.1,y-H*0.78],[x+u*0.5,y-H*0.78],[x+u*0.7,y]],'rgba(40,28,18,.25)');
    for(let k=0;k<6;k++)TH.ln(c,[x-u*0.45,y-H*(0.1+k*0.12)],[x+u*0.45,y-H*(0.1+k*0.12)-u*0.1],'rgba(40,28,18,.14)',u*0.07);
    [[-1,0.9],[0,1.0],[1,0.88]].forEach(([d,f])=>TH.ln(c,[x,y-H*0.7],[x+d*u*2.2,y-H*f*0.95],t,u*0.4));const pal=JPAL[v%4],cy=y-H*0.93;
    [[-3.0,0.4,1.7,0.7],[3.0,0.4,1.7,0.7],[-1.7,-0.1,2.0,0.9],[1.7,-0.1,2.0,0.9],[0,-0.35,2.3,0.95],[-0.8,0.5,1.7,0.6],[0.9,0.5,1.7,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,10));}},
  palm:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*11+2),H=u*(5.2+r()*1.6),lean=(r()-0.5)*u*2.0;JS(c,x,y,u*1.3);c.lineCap='round';c.strokeStyle='#a08c68';c.lineWidth=u*0.62;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*0.1,y-H*0.5,x+lean,y-H);c.stroke();c.strokeStyle='#bba67e';c.lineWidth=u*0.2;c.beginPath();c.moveTo(x-u*0.15,y);c.quadraticCurveTo(x+lean*0.1-u*0.15,y-H*0.5,x+lean-u*0.1,y-H);c.stroke();
    for(let k=1;k<9;k++){const t=k/9,q=1-t,px=q*q*x+2*q*t*(x+lean*0.1)+t*t*(x+lean),py=q*q*y+2*q*t*(y-H*0.5)+t*t*(y-H);TH.ln(c,[px-u*0.32,py],[px+u*0.32,py+u*0.05],'rgba(60,40,20,.35)',u*0.06);}
    const cx=x+lean,cy=y-H;[-2.9,-2.35,-1.85,-1.3,-0.7,-0.2].forEach((a,i)=>{JFROND(c,cx,cy,a,u*(2.5+r()*0.5),u,i%2?'#2f7a3a':'#3a8a42','#8fcf6a',0.3);JFROND(c,cx,cy,Math.PI-a-Math.PI*1.0+Math.PI,u*(2.3+r()*0.5),u,i%2?'#3a8a42':'#2f7a3a','#8fcf6a',0.3);});[[-0.25,0.2],[0.25,0.25],[0,0.35]].forEach(([dx,dy])=>TH.ell(c,cx+dx*u,cy+dy*u,u*0.24,u*0.26,'#6b4a22'));}},
  fanPalm:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*3+9);JS(c,x,y,u*1.4);TH.ln(c,[x,y],[x,y-u*1.4],'#6b4a2e',u*0.5);const cy=y-u*1.5;for(let k=0;k<9;k++){const a=-Math.PI+0.15+k/8*(Math.PI-0.3),l=u*(1.7+r()*0.4);c.save();c.translate(x,cy);c.rotate(a+Math.PI/2);TH.ell(c,0,-l*0.62,u*0.62,l*0.62,k%2?'#3a8a45':'#2f7a3a');TH.ln(c,[0,0],[0,-l*1.2],'#8fcf6a',u*0.07);c.restore();}}},
  bamboo:{cat:'tree',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*13+1);JS(c,x,y,u*1.6);const n=6+Math.floor(r()*3);for(let k=0;k<n;k++){const bx=x+(k-n/2)*u*0.36+(r()-0.5)*u*0.2,H=u*(4.8+r()*2.4),lean=(r()-0.5)*u*0.9,col=k%2?'#9bb54a':'#b4c862';c.lineCap='round';c.strokeStyle=col;c.lineWidth=u*0.3;c.beginPath();c.moveTo(bx,y+u*(r()-0.5)*0.3);c.quadraticCurveTo(bx+lean*0.3,y-H*0.5,bx+lean,y-H);c.stroke();
      for(let j=1;j<7;j++){const t=j/7;TH.ln(c,[bx+lean*t*t-u*0.17,y-H*t],[bx+lean*t*t+u*0.17,y-H*t],'#5f7a2a',u*0.06);}
      for(let j=0;j<5;j++){const a=-Math.PI*0.9+j/4*Math.PI*0.8,l=u*(0.9+r()*0.5);TH.ln(c,[bx+lean,y-H],[bx+lean+Math.cos(a)*l,y-H+Math.sin(a)*l*0.7+u*0.25],r()<0.5?'#4f9a3f':'#6fb34a',u*0.16);}}}},
  treeFern:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*17+4),H=u*(2.0+r()*0.8);JS(c,x,y,u*1.4);TH.ln(c,[x,y],[x+u*0.1,y-H],'#4a3a2a',u*0.5);for(let k=0;k<5;k++)TH.ln(c,[x-u*0.2,y-H*(0.15+k*0.17)],[x+u*0.25,y-H*(0.15+k*0.17)],'#6b5238',u*0.07);for(let k=0;k<10;k++){const a=-Math.PI+0.2+k/9*(Math.PI-0.4);JFROND(c,x+u*0.1,y-H,a,u*(1.9+r()*0.5),u,k%2?'#4a9a3f':'#3a8a35','#a8e07a',0.4);}}},
  cecropia:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*19+2),H=u*(5.2+r()*1.2);JS(c,x,y,u*1.4);TH.ln(c,[x,y],[x,y-H*0.7],'#b9ad94',u*0.4);for(let k=1;k<9;k++)TH.ln(c,[x-u*0.2,y-H*0.08*k],[x+u*0.2,y-H*0.08*k],'rgba(70,55,35,.35)',u*0.06);
    [[-1.3,0.95],[0,1.05],[1.3,0.92]].forEach(([dx,f])=>{const bx=x+dx*u,by=y-H*f;TH.ln(c,[x,y-H*0.6],[bx,by+u*0.4],'#a99b82',u*0.22);const lc=['#6fb35a','#8cc66a','#5a9f4a'];for(let k=0;k<7;k++){const a=-Math.PI*0.95+k/6*Math.PI*0.9,l=u*(1.5+r()*0.3);TH.poly(c,[[bx,by],[bx+Math.cos(a-0.22)*l*0.8,by+Math.sin(a-0.22)*l*0.5],[bx+Math.cos(a)*l,by+Math.sin(a)*l*0.55],[bx+Math.cos(a+0.22)*l*0.8,by+Math.sin(a+0.22)*l*0.5]],lc[k%3]);}}) ;}},
  strangler:{cat:'tree',rho:0.15,draw(c,x,y,u,v){const r=mulberry(v*23+1),H=u*(5.4+r()*0.8),pal=JPAL[(v+1)%4];JS(c,x,y,u*2.6);const root=(x0,w)=>{c.lineCap='round';c.strokeStyle='#6a5236';c.lineWidth=u*0.4;c.beginPath();c.moveTo(x+x0*1.5,y);c.bezierCurveTo(x+x0*0.6,y-H*0.2,x+x0*0.1-w,y-H*0.4,x+w*0.3,y-H*0.7);c.stroke();c.strokeStyle='#8a6e48';c.lineWidth=u*0.12;c.stroke();};
    [-1.0,-0.4,0.4,1.0].forEach((x0,i)=>root(x0*u,(i%2?0.3:-0.3)*u));TH.ln(c,[x,y-H*0.55],[x-u*1.5,y-H*0.9],'#6a5236',u*0.4);TH.ln(c,[x,y-H*0.6],[x+u*1.6,y-H*0.88],'#6a5236',u*0.4);const cy=y-H*0.88;
    [[0,-0.2,2.3,1.25],[-2.0,0.1,1.5,1.0],[2.0,0.1,1.5,1.0],[-1.0,-1.1,1.6,1.0],[1.0,-1.1,1.6,1.0],[0,-1.6,1.3,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,10));for(let k=0;k<7;k++){const ax=x+(r()-0.5)*u*4.2,ay=cy+u*0.5;TH.ln(c,[ax,ay],[ax+(r()-0.5)*u*0.3,Math.min(y-u*0.2,ay+u*(1.5+r()*2.2))],'#6a5236',u*0.1);}}},
  jungleBush:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*29+3),pal=[['#3f8a45','#58a04f','#6fb35a','#2f7a3a'],['#4a9a3f','#6fb34a','#8cc66a','#3a8a35'],['#2f7a3a','#3f8a45','#58a04f','#2a6a38']][v%3];JS(c,x,y,u*1.6);TH.ln(c,[x,y],[x,y-u*0.9],'#5f4228',u*0.4);[[0,-1.9,1.2,0.9],[-0.9,-1.2,1.0,0.8],[0.9,-1.2,1.0,0.8],[0,-1.0,1.4,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,pal[i%4],r,9));}},
  /* ---------- undergrowth ---------- */
  fern:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(12,40,22,.22)');for(let k=0;k<9;k++){const a=-Math.PI+0.15+k/8*(Math.PI-0.3);JFROND(c,x,y-u*0.1,a,u*(1.2+r()*0.45),u,k%2?'#4a9a3f':'#3a8a35','#a8e07a',0.5);}}},
  elephantEar:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+9);TH.ell(c,x+u*0.2,y+u*0.08,u*1.0,u*0.3,'rgba(12,40,22,.22)');[[-0.7,-1.0,-0.5],[0.7,-1.1,0.5],[0,-1.5,0],[-0.2,-0.6,-0.2]].forEach(([dx,dy,rot],i)=>{const px=x+dx*u,py=y+dy*u;TH.ln(c,[x,y],[px,py+u*0.2],'#5f8a3a',u*0.14);c.save();c.translate(px,py);c.rotate(rot);c.fillStyle=i%2?'#3f8a45':'#2f7a3a';c.beginPath();c.moveTo(0,u*0.5);c.bezierCurveTo(-u*0.95,u*0.1,-u*0.8,-u*1.1,0,-u*0.95);c.bezierCurveTo(u*0.8,-u*1.1,u*0.95,u*0.1,0,u*0.5);c.fill();TH.ln(c,[0,u*0.4],[0,-u*0.8],'#8fcf6a',u*0.06);c.restore();});}},
  heliconia:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*7+2);TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.28,'rgba(12,40,22,.22)');[[-0.7,-1.5],[0.7,-1.6],[0,-2.0]].forEach(([dx,dy],i)=>{c.save();c.translate(x+dx*u*0.4,y);c.rotate(dx*0.35);c.fillStyle=i%2?'#3a8a42':'#2f7a3a';c.beginPath();c.ellipse(0,dy*u*0.5,u*0.38,u*0.85,0,0,7);c.fill();TH.ln(c,[0,0],[0,dy*u*0.9],'#8fcf6a',u*0.05);c.restore();});
    [[0.25,-1.8,'#d9433b'],[-0.35,-1.5,'#f08a24']].forEach(([dx,dy,col])=>{for(let k=0;k<4;k++)TH.poly(c,[[x+dx*u+k*u*0.12,y+dy*u+k*u*0.28],[x+dx*u+u*0.35+k*u*0.12,y+dy*u+k*u*0.28+u*0.15],[x+dx*u+u*0.1+k*u*0.12,y+dy*u+k*u*0.28+u*0.4]],col);});}},
  flowerBush:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*11+4),cols=[['#e86aa8','#f4a6cb'],['#d9433b','#f08a24'],['#f2c230','#fff0a0'],['#8a5ac8','#c9a6f0']][v%4];TH.ell(c,x+u*0.2,y+u*0.08,u*1.0,u*0.3,'rgba(12,40,22,.22)');[[-0.55,-0.5,0.8,0.55],[0.55,-0.5,0.8,0.55],[0,-0.9,0.85,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#3a8a45','#2f7a3a','#4a9a3f'][i],r,8));for(let k=0;k<11;k++){const fx=x+(r()-0.5)*u*1.7,fy=y-u*(0.3+r()*1.0);TH.ell(c,fx,fy,u*0.17,u*0.15,cols[k%2]);TH.ell(c,fx,fy,u*0.06,u*0.06,'#fff6c0');}}},
  jungleGrass:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);for(let k=0;k<13;k++){const a=-1.1+k/12*2.2+(r()-0.5)*0.2,l=u*(0.7+r()*0.8);TH.ln(c,[x+(r()-0.5)*u*0.6,y],[x+Math.sin(a)*l*0.8+(r()-0.5)*u*0.3,y-l],['#4f9a3f','#6fb34a','#3a8a35'][k%3],u*0.09);}}},
  banana:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*13+5);JS(c,x,y,u*1.3);TH.ln(c,[x,y],[x,y-u*1.8],'#8fa55a',u*0.5);for(let k=0;k<6;k++){const a=-Math.PI+0.2+k/5*(Math.PI-0.4);const ex=x+Math.cos(a)*u*2.0,ey=y-u*1.8+Math.sin(a)*u*0.8+u*0.9;c.fillStyle=k%2?'#4a9a3f':'#3a8a35';c.beginPath();c.moveTo(x,y-u*1.8);c.quadraticCurveTo(x+Math.cos(a)*u*1.1,y-u*2.8,ex,ey);c.quadraticCurveTo(x+Math.cos(a)*u*1.0,y-u*1.6,x,y-u*1.8);c.fill();TH.ln(c,[x,y-u*1.8],[ex,ey],'#a8e07a',u*0.05);}
    TH.ln(c,[x,y-u*1.7],[x+u*0.4,y-u*1.0],'#6b8a3a',u*0.1);for(let k=0;k<5;k++)TH.ell(c,x+u*0.4+(k%2)*u*0.15,y-u*(0.7+k*0.1),u*0.14,u*0.09,'#e8c83a');}},
  /* ---------- mountains, cliffs, waterfalls ---------- */
  mossBoulders:{cat:'rock',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.8,'#8d9086'],[0.7,0.2,0.8,0.7,'#9a9d92'],[0,-0.35,0.7,0.6,'#80847a']].forEach(([dx,dy,rx,ry,col])=>{const px=x+dx*u,py=y+dy*u,sx=u*rx,sy=u*ry*(1+r()*0.2);TH.ell(c,px+sx*0.15,py+sy*0.3,sx*1.05,sy*0.45,'rgba(12,40,22,.25)');TH.poly(c,[[px-sx,py],[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px-sx*0.6,py+sy*0.2]],col);TH.poly(c,[[px+sx*0.25,py-sy*0.98],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px+sx*0.2,py+sy*0.05]],shade(col,-0.25));TH.poly(c,[[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.1,py-sy*0.5],[px-sx*0.5,py-sy*0.45]],JMOSS);TH.ell(c,px-sx*0.3,py-sy*0.7,sx*0.3,sy*0.15,'rgba(180,230,120,.35)');});}},
  peak:{cat:'rock',rho:0.22,draw(c,x,y,u,v){const r=mulberry(v*9+2),H=u*(9.5+r()*2.5),w=u*(4.3+r()*0.8),tx=(r()-0.5)*w*0.25;TH.ell(c,x+u*1.2,y+u*0.3,w*1.3,u*0.8,'rgba(12,40,22,.25)');
    const sil=()=>{c.beginPath();c.moveTo(-w*1.3,0);c.bezierCurveTo(-w*1.2,-H*0.35,-w*0.9,-H*0.62,-w*0.5+tx,-H*0.84);c.bezierCurveTo(-w*0.3+tx,-H*1.0,-w*0.05+tx,-H*1.05,w*0.22+tx,-H*0.98);c.bezierCurveTo(w*0.5,-H*0.92,w*0.72,-H*0.7,w*0.92,-H*0.42);c.bezierCurveTo(w*1.12,-H*0.2,w*1.22,-H*0.08,w*1.3,0);c.closePath();};
    c.save();c.translate(x,y);sil();c.fillStyle='#46874a';c.fill();c.clip();
    let g=c.createLinearGradient(-w*1.3,0,w*1.3,0);g.addColorStop(0,'rgba(190,240,150,.22)');g.addColorStop(0.45,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(8,34,22,.55)');c.fillStyle=g;c.fillRect(-w*1.4,-H*1.1,w*2.8,H*1.2);
    const rock=[[w*0.12,-H*0.97],[w*0.5,-H*0.9],[w*0.74,-H*0.66],[w*0.62,-H*0.34],[w*0.34,-H*0.3],[w*0.16,-H*0.55]];TH.poly(c,rock,'#8c8d7e');TH.poly(c,[[w*0.4,-H*0.93],[w*0.74,-H*0.66],[w*0.62,-H*0.34],[w*0.42,-H*0.32]],'rgba(30,34,26,.35)');
    for(let k=0;k<9;k++){const sx=w*(0.17+k*0.06);TH.ln(c,[sx,-H*(0.93-k*0.012)],[sx+w*0.04,-H*(0.36+r()*0.14)],'rgba(40,44,34,.35)',u*0.09);}for(let k=0;k<6;k++)TH.ln(c,[w*0.2+r()*w*0.4,-H*0.9],[w*0.2+r()*w*0.4,-H*(0.45+r()*0.2)],'#4f9a45',u*0.12);
    for(let k=0;k<125;k++){const t=Math.pow(r(),0.8),yy=-H*(0.04+t*0.94),span=w*(1.28-Math.pow(t,1.6)*1.0),xx=(r()*2-1)*span;if(xx>w*0.1&&yy<-H*0.28&&yy>-H*0.97&&xx<w*0.78)continue;const rr=u*(0.5+r()*0.5);c.fillStyle=['#2f6b3a','#3f8a45','#58a04f','#2a5c35','#6fb35a'][Math.floor(r()*5)];c.beginPath();c.ellipse(x*0+xx,yy,rr,rr*0.78,0,0,7);c.fill();if(r()<0.5){c.fillStyle='rgba(190,240,140,.3)';c.beginPath();c.ellipse(xx-rr*0.25,yy-rr*0.3,rr*0.5,rr*0.3,0,0,7);c.fill();}}
    g=c.createLinearGradient(0,-H*0.5,0,0);g.addColorStop(0,'rgba(215,238,228,0)');g.addColorStop(1,'rgba(205,232,222,.3)');c.fillStyle=g;c.fillRect(-w*1.4,-H*0.5,w*2.8,H*0.5);c.restore();}},
  hill:{cat:'rock',rho:0.2,draw(c,x,y,u,v){const r=mulberry(v*7+8),H=u*(4.6+r()*1.8),w=u*(3.4+r()*0.8);TH.ell(c,x+u*0.8,y+u*0.25,w*1.3,u*0.7,'rgba(12,40,22,.22)');
    c.save();c.translate(x,y);c.beginPath();c.moveTo(-w*1.3,0);c.bezierCurveTo(-w*1.1,-H*0.85,-w*0.45,-H*1.12,0,-H);c.bezierCurveTo(w*0.45,-H*1.05,w*1.1,-H*0.8,w*1.3,0);c.closePath();c.fillStyle='#4a8f4c';c.fill();c.clip();
    const g=c.createLinearGradient(-w*1.3,0,w*1.3,0);g.addColorStop(0,'rgba(190,240,150,.2)');g.addColorStop(0.5,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(8,34,22,.5)');c.fillStyle=g;c.fillRect(-w*1.4,-H*1.2,w*2.8,H*1.3);
    for(let k=0;k<70;k++){const t=Math.pow(r(),0.8),yy=-H*(0.03+t*0.95),span=w*(1.3-Math.pow(t,1.5)*1.05),xx=(r()*2-1)*span,rr=u*(0.45+r()*0.45);c.fillStyle=['#2f6b3a','#3f8a45','#58a04f','#2a5c35','#6fb35a'][Math.floor(r()*5)];c.beginPath();c.ellipse(xx,yy,rr,rr*0.78,0,0,7);c.fill();if(r()<0.5){c.fillStyle='rgba(190,240,140,.3)';c.beginPath();c.ellipse(xx-rr*0.25,yy-rr*0.3,rr*0.5,rr*0.3,0,0,7);c.fill();}}c.restore();}},
  cliff:{cat:'rock',rho:0.16,draw(c,x,y,u,v){const r=mulberry(v*5+6),H=u*(5.6+r()*1.6),w=u*(2.2+r()*0.5);TH.ell(c,x+u*0.8,y+u*0.2,w*1.5,u*0.55,'rgba(12,40,22,.25)');
    const bands=['#8a8c80','#7a7d72','#96988c','#80837a'];for(let i=0;i<5;i++){const t0=i/5,t1=(i+1)/5,j0=(r()-0.5)*u*0.4,j1=(r()-0.5)*u*0.4;TH.poly(c,[[x-w+j0,y-H*t0],[x+w+j1,y-H*t0],[x+w*0.94+j1,y-H*t1],[x-w*0.94+j0,y-H*t1]],bands[i%4]);TH.poly(c,[[x+w*0.2,y-H*t0],[x+w+j1,y-H*t0],[x+w*0.94+j1,y-H*t1],[x+w*0.2,y-H*t1]],'rgba(20,30,20,.28)');}
    for(let k=0;k<5;k++){const vx=x+(r()*2-1)*w*0.8;TH.ln(c,[vx,y-H*0.95],[vx+(r()-0.5)*u*0.4,y-H*(0.35+r()*0.5)],'#3f8a45',u*0.14);}TH.poly(c,[[x-w*0.98,y-H],[x+w*0.95,y-H],[x+w*0.7,y-H-u*0.5],[x-w*0.7,y-H-u*0.5]],'#4f9250');for(let k=0;k<5;k++)TH.blob(c,x+(r()*2-1)*w*0.8,y-H-u*0.3,u*0.6,u*0.45,['#2f6b3a','#3f8a45','#58a04f'][k%3],r,7);}},
  waterfall:{cat:'rock',rho:0.22,draw(c,x,y,u,v){const r=mulberry(v*3+1),H=u*9.0,w=u*3.4;TH.ell(c,x+u*0.6,y+u*0.3,w*1.6,u*0.9,'rgba(12,40,22,.25)');
    const wall=(x0,x1,col)=>{for(let i=0;i<6;i++){const t0=i/6,t1=(i+1)/6;TH.poly(c,[[x0,y-H*t0],[x1,y-H*t0],[x1,y-H*t1],[x0,y-H*t1]],shade(col,(i%2?-0.06:0.04)));}};wall(x-w*1.5,x-w*0.28,'#85887c');wall(x+w*0.28,x+w*1.5,'#6f7268');TH.poly(c,[[x+w*0.2,y],[x+w*1.5,y],[x+w*1.5,y-H],[x+w*0.2,y-H]],'rgba(20,30,20,.18)');
    TH.poly(c,[[x-w*0.3,y-H],[x+w*0.3,y-H],[x+w*0.3,y-H*0.35],[x-w*0.3,y-H*0.35]],'#5a5e55');
    const g=c.createLinearGradient(x,y-H,x,y);g.addColorStop(0,'rgba(235,248,255,.95)');g.addColorStop(0.5,'rgba(190,228,245,.9)');g.addColorStop(1,'rgba(235,248,255,.95)');c.fillStyle=g;c.beginPath();c.moveTo(x-w*0.3,y-H*0.98);c.lineTo(x+w*0.3,y-H*0.98);c.lineTo(x+w*0.34,y-u*0.1);c.lineTo(x-w*0.34,y-u*0.1);c.closePath();c.fill();
    for(let k=-3;k<=3;k++){const sx=x+k*w*0.08;TH.ln(c,[sx,y-H*0.95],[sx+(r()-0.5)*u*0.1,y-u*0.3],k%2?'rgba(255,255,255,.75)':'rgba(120,190,225,.5)',u*0.1);}
    TH.poly(c,[[x-w*1.55,y-H],[x+w*1.55,y-H],[x+w*1.2,y-H-u*0.7],[x-w*1.2,y-H-u*0.7]],'#4f9250');for(let k=0;k<8;k++)TH.blob(c,x+(k-3.5)*w*0.4,y-H-u*0.35,u*0.7,u*0.55,['#2f6b3a','#3f8a45','#58a04f','#2a5c35'][k%4],r,8);
    [[-1.2,0.55],[1.1,0.6]].forEach(([dx,f])=>{for(let k=0;k<5;k++)TH.ln(c,[x+dx*w+(r()-0.5)*u,y-H*(0.95-k*0.04)],[x+dx*w+(r()-0.5)*u*0.5,y-H*(f*0.4+r()*0.3)],'#3f8a45',u*0.13);});
    const py=y+u*0.55;TH.ell(c,x,py,w*1.45,u*0.95,'#2f8798');TH.ell(c,x,py,w*1.3,u*0.8,'#4fb3c4');TH.ell(c,x-w*0.2,py-u*0.08,w*0.8,u*0.4,'rgba(200,240,250,.45)');[[0.3,0.9],[0.62,0.85],[0.95,0.7]].forEach(([s,a])=>{c.strokeStyle='rgba(255,255,255,'+a*0.5+')';c.lineWidth=u*0.08;c.beginPath();c.ellipse(x,py,w*1.2*s+w*0.15,u*0.7*s+u*0.08,0,0,7);c.stroke();});
    for(let k=0;k<7;k++)TH.ell(c,x+(r()-0.5)*w*0.9,y+u*0.05+(r()-0.5)*u*0.4,u*(0.5+r()*0.4),u*(0.4+r()*0.3),'rgba(255,255,255,.55)');c.save();c.globalAlpha=0.35;TH.ell(c,x,y-u*0.8,w*0.9,u*1.4,'#e8f6fb');c.restore();
    [[-1.5,0.7],[1.6,0.75]].forEach(([dx,dy])=>WRKJ(c,x+dx*w,y+u*dy,u*0.6,u*0.45));}},
  /* ---------- Mayan ruins (small, overgrown) ---------- */
  smallPyramid:{cat:'ruin',rho:0.14,draw(c,x,y,u,v){const r=mulberry(v*7+3),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.9,y+u*0.25,u*3.6,u*1.0,'rgba(12,40,22,.28)');
    const tiers=[[-2.2,2.2,0,0.95],[-1.75,1.75,0.95,1.9],[-1.3,1.3,1.9,2.85]];tiers.forEach(([a,b,z0,z1],i)=>{JBOX(c,x,y,u,a,b,a,b,z0,z1,i%2?JSTONE:'#bdb69c');for(let k=-2;k<=2;k++)TH.ln(c,I(k*Math.abs(b)*0.4,b+0.01,z0+0.08),I(k*Math.abs(b)*0.4,b+0.01,z1-0.08),'rgba(50,45,30,.16)',u*0.05);});
    TH.poly(c,[I(-0.45,2.21,0),I(0.45,2.21,0),I(0.45,1.31,2.85),I(-0.45,1.31,2.85)],JSTONE_L);for(let k=1;k<9;k++)TH.ln(c,I(-0.45+0.01,2.21-k*0.1,k*0.32),I(0.45,2.21-k*0.1,k*0.32),'rgba(80,70,50,.35)',u*0.05);
    JBOX(c,x,y,u,-0.75,0.75,-0.75,0.75,2.85,3.8,'#c4bda3');TH.poly(c,[I(-0.3,0.76,2.85),I(0.3,0.76,2.85),I(0.3,0.76,3.5),I(-0.3,0.76,3.5)],'#3a3426');JBOX(c,x,y,u,-0.95,0.95,-0.95,0.95,3.8,4.15,'#a9a38a');
    JVINE(c,x-u*1.2,y-u*1.0,u,r,6);JVINE(c,x+u*1.4,y-u*0.8,u,r,6);TH.blob(c,x-u*1.5,y-u*1.9,u*0.9,u*0.6,'#3f8a45',r,8);TH.blob(c,x+u*1.8,y-u*1.3,u*0.8,u*0.55,'#58a04f',r,8);TH.blob(c,x+u*0.1,y-u*4.4,u*0.7,u*0.5,'#2f6b3a',r,8);}},
  stela:{cat:'ruin',rho:0.04,draw(c,x,y,u,v){const r=mulberry(v*5+9),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.5,y+u*0.12,u*1.4,u*0.4,'rgba(12,40,22,.25)');JBOX(c,x,y,u,-0.9,0.9,-0.9,0.9,0,0.35,JSTONE_D);JBOX(c,x,y,u,-0.4,0.4,-0.18,0.18,0.35,3.7,JSTONE);
    for(let k=0;k<5;k++){const z=0.7+k*0.55;TH.poly(c,[I(-0.3,0.19,z),I(0.3,0.19,z),I(0.3,0.19,z+0.38),I(-0.3,0.19,z+0.38)],'rgba(60,52,36,.3)');TH.ell(c,...I(-0.12+(k%2)*0.2,0.2,z+0.19),u*0.07,u*0.07,'rgba(40,34,22,.5)');}
    TH.poly(c,[I(-0.4,-0.18,3.7),I(0.4,-0.18,3.7),I(0.4,0.18,3.7),I(-0.4,0.18,3.7)],JSTONE_L);JVINE(c,x,y-u*0.8,u,r,2);if(r()<0.6)TH.blob(c,x+u*0.5,y-u*0.2,u*0.5,u*0.35,'#58a04f',r,7);}},
  brokenWall:{cat:'ruin',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*7+2),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.6,y+u*0.15,u*2.6,u*0.5,'rgba(12,40,22,.25)');JBOX(c,x,y,u,-2.0,1.0,-0.45,0.45,0,1.05,JSTONE);JBOX(c,x,y,u,1.0,2.0,-0.45,0.45,0,0.55,'#a9a38a');JBOX(c,x,y,u,-2.0,-0.6,-0.45,0.45,1.05,1.7,JSTONE_L);
    for(let k=0;k<7;k++){const X=-1.8+k*0.5;TH.ln(c,I(X,0.46,0.5),I(X+0.2,0.46,0.5),'rgba(50,45,30,.4)',u*0.07);TH.ln(c,I(X+0.2,0.46,0.5),I(X+0.2,0.46,0.75),'rgba(50,45,30,.4)',u*0.07);TH.ln(c,I(X+0.2,0.46,0.75),I(X+0.4,0.46,0.75),'rgba(50,45,30,.4)',u*0.07);}
    JBOX(c,x,y,u,1.5,2.2,0.7,1.3,0,0.4,JSTONE_D);JBOX(c,x,y,u,-0.2,0.5,0.8,1.4,0,0.3,'#a9a38a');JVINE(c,x,y-u*0.5,u,r,6);TH.blob(c,x+u*1.2,y-u*0.9,u*0.9,u*0.5,'#3f8a45',r,8);}},
  stoneHead:{cat:'ruin',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.5,y+u*0.14,u*1.7,u*0.5,'rgba(12,40,22,.28)');const cx=x,cy=y-u*1.15;
    const g=c.createRadialGradient(cx-u*0.5,cy-u*0.6,u*0.2,cx,cy,u*1.5);g.addColorStop(0,'#c9c3aa');g.addColorStop(1,'#8c866e');c.fillStyle=g;c.beginPath();c.ellipse(cx,cy,u*1.25,u*1.15,0,0,7);c.fill();TH.poly(c,[[cx-u*1.3,cy-u*0.3],[cx+u*1.3,cy-u*0.3],[cx+u*1.1,cy-u*0.95],[cx-u*1.1,cy-u*0.95]],'#9a947c');
    TH.ell(c,cx-u*0.45,cy-u*0.1,u*0.3,u*0.18,'#3a3426');TH.ell(c,cx+u*0.45,cy-u*0.1,u*0.3,u*0.18,'#3a3426');TH.poly(c,[[cx-u*0.2,cy],[cx+u*0.2,cy],[cx+u*0.3,cy+u*0.5],[cx-u*0.3,cy+u*0.5]],'#a39d86');TH.ell(c,cx,cy+u*0.62,u*0.58,u*0.2,'#6d6853');TH.ell(c,cx,cy+u*0.62,u*0.45,u*0.1,'#3a3426');
    TH.poly(c,[[x-u*1.5,y],[x-u*1.0,y-u*0.7],[x+u*1.1,y-u*0.7],[x+u*1.6,y]],'#5f8f3f');for(let k=0;k<5;k++)TH.blob(c,x+(r()-0.5)*u*2.4,y-u*(0.1+r()*0.5),u*0.5,u*0.3,['#3f8a45','#58a04f'][k%2],r,7);JVINE(c,cx,cy-u*0.9,u,r,4);}},
  stairRuin:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*11+1),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.6,y+u*0.15,u*2.2,u*0.5,'rgba(12,40,22,.25)');for(let k=0;k<5;k++){const w=1.2-(k>3?0.35:0);JBOX(c,x,y,u,-w,w,-1.1+k*0.42,1.1,0,0.3+k*0.3,k%2?JSTONE:'#bdb69c');}
    JBOX(c,x,y,u,-1.6,-1.2,-1.1,1.1,0,1.2,JSTONE_D);JBOX(c,x,y,u,1.2,1.6,-1.1,1.1,0,0.7,JSTONE_D);JVINE(c,x,y-u*0.6,u,r,7);TH.blob(c,x-u*1.6,y-u*1.5,u*0.7,u*0.5,'#3f8a45',r,8);TH.blob(c,x+u*0.4,y-u*1.8,u*0.9,u*0.6,'#58a04f',r,8);}},
  altar:{cat:'ruin',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*13+4),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.5,y+u*0.12,u*1.8,u*0.5,'rgba(12,40,22,.25)');JBOX(c,x,y,u,-1.2,1.2,-1.2,1.2,0,0.4,JSTONE_D);[[-0.7,-0.5],[0.7,-0.5],[-0.7,0.5],[0.7,0.5]].forEach(([X,Y])=>JBOX(c,x,y,u,X-0.18,X+0.18,Y-0.18,Y+0.18,0.4,1.1,JSTONE));JBOX(c,x,y,u,-1.0,1.0,-0.85,0.85,1.1,1.5,JSTONE_L);
    [-0.5,-0.15,0.2,0.55].forEach((X,i)=>TH.ell(c,...I(X,0.86,1.3),u*0.09,u*0.07,'rgba(40,34,22,.55)'));const f=I(0,0,1.5);TH.ell(c,f[0],f[1],u*0.6,u*0.25,'#3a3426');TH.ell(c,f[0],f[1]-u*0.35,u*0.35,u*0.35,'#d9433b');TH.ell(c,f[0],f[1]-u*0.55,u*0.2,u*0.28,'#f2c230');JVINE(c,x,y-u*0.3,u,r,3);}},
  ruinedArch:{cat:'ruin',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*7+8),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.7,y+u*0.18,u*2.6,u*0.6,'rgba(12,40,22,.25)');JBOX(c,x,y,u,-2.0,-0.2,-0.6,0.6,0,3.4,JSTONE);JBOX(c,x,y,u,0.2,1.2,-0.6,0.6,0,1.9,'#a9a38a');
    [[0,-0.2,3.4,0.2],[0.3,-0.2,3.0,0.1]].forEach(()=>0);TH.poly(c,[I(-0.2,-0.6,2.2),I(0.2,-0.6,2.2),I(0.2,0.6,2.2),I(-0.2,0.6,2.2)],'#b5ae94');JBOX(c,x,y,u,-0.2,0.45,-0.6,0.6,2.2,2.6,JSTONE);
    TH.poly(c,[I(-0.2,0.61,0),I(0.2,0.61,0),I(0.2,0.61,2.2),I(-0.2,0.61,2.2)],'#3a3426');for(let k=0;k<6;k++)TH.ln(c,I(-1.8,0.61,0.4+k*0.5),I(-0.4,0.61,0.4+k*0.5),'rgba(50,45,30,.2)',u*0.05);JVINE(c,x-u*1.0,y-u*1.5,u,r,7);TH.blob(c,x-u*1.4,y-u*4.3,u*1.0,u*0.65,'#3f8a45',r,8);TH.blob(c,x+u*0.9,y-u*2.4,u*0.7,u*0.5,'#58a04f',r,8);}},
  columns:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*9+6);TH.ell(c,x+u*0.5,y+u*0.14,u*2.3,u*0.5,'rgba(12,40,22,.25)');[[-1.1,0.2,2.6],[0.1,-0.1,1.7],[1.2,0.3,1.0]].forEach(([dx,dy,h],i)=>{const px=x+dx*u,py=y+dy*u,w=u*0.42;const gr=c.createLinearGradient(px-w,0,px+w,0);gr.addColorStop(0,'#cfc9b0');gr.addColorStop(1,'#8c866e');c.fillStyle=gr;c.fillRect(px-w,py-h*u,w*2,h*u);TH.ell(c,px,py,w,w*0.4,'#8c866e');TH.ell(c,px,py-h*u,w,w*0.4,i===2?'#a9a38a':'#cfc9b0');for(let k=1;k<4;k++)TH.ln(c,[px-w,py-h*u*k/4],[px+w,py-h*u*k/4+u*0.04],'rgba(50,45,30,.25)',u*0.05);});
    TH.ell(c,x+u*2.0,y+u*0.5,u*0.55,u*0.3,'#a9a38a');TH.ell(c,x-u*2.0,y+u*0.4,u*0.5,u*0.28,'#8c866e');JVINE(c,x,y-u*0.4,u,r,5);}},
  /* ---------- small props (lower tiers only) ---------- */
  tikiTorch:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(12,40,22,.25)');TH.ln(c,[x,y],[x,y-u*3.0],'#9a8a4a',u*0.3);[0.3,0.55,0.8].forEach(f=>TH.ln(c,[x-u*0.18,y-u*3*f],[x+u*0.18,y-u*3*f],'#5f5a2a',u*0.07));const g=c.createRadialGradient(x,y-u*3.4,0,x,y-u*3.4,u*1.5);g.addColorStop(0,'rgba(255,190,90,.55)');g.addColorStop(1,'rgba(255,190,90,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*3.4,u*1.5,0,7);c.fill();TH.poly(c,[[x-u*0.3,y-u*3.0],[x+u*0.3,y-u*3.0],[x+u*0.1,y-u*3.9],[x,y-u*4.1],[x-u*0.1,y-u*3.8]],'#f08a24');TH.poly(c,[[x-u*0.15,y-u*3.0],[x+u*0.15,y-u*3.0],[x,y-u*3.6]],'#ffe27a');}},
  crates:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.4,u*0.4,'rgba(12,40,22,.25)');const w='#b0884e';TH.box(c,x,y,u,-0.9,0.1,-0.6,0.5,0,0.9,w,shade(w,-0.28),shade(w,0.16));TH.box(c,x,y,u,0.2,1.2,-0.5,0.5,0,0.8,'#9a7440',shade('#9a7440',-0.28),shade('#9a7440',0.16));TH.box(c,x,y,u,-0.6,0.4,-0.5,0.4,0.9,1.7,'#c19a5c',shade('#c19a5c',-0.28),shade('#c19a5c',0.16));
    [[-0.4,0.51,0.1],[-0.4,0.51,0.8]].forEach(([X,Y,Z])=>0);TH.ln(c,I(-0.9,0.51,0.45),I(0.1,0.51,0.45),'rgba(50,30,10,.4)',u*0.07);TH.ln(c,I(-0.1,0.41,1.3),I(0.4,0.41,1.3),'rgba(50,30,10,.4)',u*0.07);}},
  signpost:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.25,'rgba(12,40,22,.25)');TH.ln(c,[x,y],[x,y-u*2.8],'#6a4a2a',u*0.28);[[-1,-2.5,'#b0884e'],[1,-1.8,'#c19a5c']].forEach(([d,h,col])=>{TH.poly(c,[[x,y+h*u-u*0.3],[x+d*u*1.5,y+h*u-u*0.3],[x+d*u*1.9,y+h*u],[x+d*u*1.5,y+h*u+u*0.3],[x,y+h*u+u*0.3]],col,'#6a4a2a',u*0.05);TH.ln(c,[x+d*u*0.3,y+h*u],[x+d*u*1.2,y+h*u],'rgba(50,30,10,.45)',u*0.06);});}}
};
function WRKJ(c,x,y,rx,ry){TH.ell(c,x+rx*0.15,y+ry*0.3,rx*1.05,ry*0.45,'rgba(12,40,22,.25)');TH.poly(c,[[x-rx,y],[x-rx*0.9,y-ry*0.6],[x-rx*0.35,y-ry*1.05],[x+rx*0.4,y-ry*0.95],[x+rx*0.95,y-ry*0.35],[x+rx,y+ry*0.1],[x-rx*0.6,y+ry*0.2]],'#8d9086');TH.poly(c,[[x-rx*0.9,y-ry*0.6],[x-rx*0.35,y-ry*1.05],[x+rx*0.4,y-ry*0.95],[x+rx*0.1,y-ry*0.5],[x-rx*0.5,y-ry*0.45]],JMOSS);}

/* ===== MACRO-LAND ENGINE (hex geometry, path network, planner, baker) ===== */
const W3=Math.sqrt(3),HX=W3/2,HV=[[HX,0.29],[0,0.58],[-HX,0.29],[-HX,-0.29],[0,-0.58],[HX,-0.29]];
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[0,1,2],[-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5,1.5]],C:[[0],[-0.5,0.5,1.5],[-1,0,1],[-0.5]],D:[[0,1,2],[-0.5,0.5,1.5],[0,1]]};
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

/* ===== JUNGLE LAND: planner (stretched sweet spots, tree-heavy), lush ground, generic baker ===== */
const JUNGLE_REGION={top:{broadleaf:.38,bamboo:.14,treeFern:.1,palm:.1,cecropia:.08,strangler:.05,jungleBush:.12},mid:{broadleaf:.3,palm:.18,cecropia:.1,bamboo:.1,treeFern:.1,strangler:.04,jungleBush:.1,fanPalm:.08},bottom:{palm:.2,broadleaf:.22,jungleBush:.2,fanPalm:.16,treeFern:.14,bamboo:.08}};
const JUNGLE_LOW=[['jungleBush',1],['fanPalm',1],['treeFern',1.05],['broadleaf',0.62],['palm',0.6],['jungleBush',1.2],['fanPalm',1.15],['broadleaf',0.7]];            /* short species only in the foreground so a ride's base is never hidden */
const JUNGLE_CAP={ceiba:5,strangler:3,bamboo:9,cecropia:7};
const JUNGLE_UNDER=['fern','fern','elephantEar','heliconia','flowerBush','jungleGrass','banana'];
const JUNGLE_PLAN_CACHE={};
function getJunglePlan(shape){
  if(JUNGLE_PLAN_CACHE[shape])return JUNGLE_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(({A:6101,B:7202,C:8316,D:9417})[shape]),placed=[],bb=G.bbox,used={},A=JUNGLE_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  /* stretched sweet spots: the slot ellipse itself is still sacred, but scenery may now creep right up to it (West kept a much wider margin) */
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.5),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.3);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho,o2)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.72);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'broadleaf';};
  const capOk=k=>!(JUNGLE_CAP[k]&&(used[k]||0)>=JUNGLE_CAP[k]);
  const regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?JUNGLE_REGION.top:n<0.68?JUNGLE_REGION.mid:JUNGLE_REGION.bottom;};
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='tree'?0.88+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const tree=(x,y,extra,dom,low)=>{if(low){const L=JUNGLE_LOW[Math.floor(rng()*JUNGLE_LOW.length)];return place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return place(dom&&rng()<0.55&&capOk(dom)?dom:pickFrom(regionOf(y),capOk),x,y,extra||{});};
  const under=(x,y,extra)=>place(JUNGLE_UNDER[Math.floor(rng()*JUNGLE_UNDER.length)],x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const LKS=G.centers.length/12,landThin=l=>{const n=Math.max(1,Math.round(l.length*LKS));return Array.from({length:n},(_,i)=>l[Math.floor((i+0.5)*l.length/n)]);},landCnt=n=>Math.max(1,Math.round(n*LKS));
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. the back rim: forested massifs, hills and cliffs, with two waterfalls (each flanked by cliffs) */
  {const pts=[];top.forEach(e=>[0.2,0.5,0.8].forEach(t=>pts.push(onEdge(e,t,0.0))));pts.sort((a,b)=>a[0]-b[0]);const x0=pts[0][0],x1=pts[pts.length-1][0],nearest=x=>pts.reduce((b,p)=>Math.abs(p[0]-x)<Math.abs(b[0]-x)?p:b);
    const centers=[];let x=x0+0.12+rng()*0.2;while(x<x1-0.05){centers.push(x);x+=0.8+rng()*0.55;}
    const wf=[Math.floor(centers.length*0.3),Math.floor(centers.length*0.74)];
    centers.forEach((cxp,i)=>{const p=nearest(cxp),bx=p[0],by=p[1],t=rng(),mt=a=>a+(rng()<0.35?1:0),at=(k,dx,dy,ex)=>place(k,bx+dx,by+dy,ex);
      if(wf.includes(i)){const first=i===wf[0];at('waterfall',0,-0.02,{minT:first?3:4,scale:0.95,clear:1.9});at('cliff',-0.5,0.0,{minT:first?3:4,scale:0.85,clear:1.3});at('cliff',0.5,0.0,{minT:first?3:4,scale:0.8,clear:1.3});at('peak',0.0,-0.18,{minT:first?3:4,scale:0.85});at('mossBoulders',-0.2,0.1,{minT:1});at('mossBoulders',0.25,0.1,{minT:2});}
      else if(t<0.4){at('peak',0,-0.02,{minT:mt(2),scale:0.9+rng()*0.2});at('hill',-0.5,0.03,{minT:mt(1)});at('hill',0.5,0.02,{minT:mt(2)});at('mossBoulders',0.02,0.1,{minT:1});}
      else if(t<0.72){at('hill',-0.3,0.01,{minT:1});at('peak',0.18,-0.02,{minT:mt(2),scale:0.75});at('cliff',-0.6,0.04,{minT:3});at('mossBoulders',0.1,0.1,{minT:2});}
      else{at('hill',-0.25,0.01,{minT:mt(1)});at('hill',0.3,0.0,{minT:2});at('cliff',0.0,-0.02,{minT:3,scale:0.8});at('mossBoulders',-0.05,0.1,{minT:1});}});
    {const gaps=[];for(let i=0;i+1<centers.length;i++)if(!wf.includes(i)&&!wf.includes(i+1))gaps.push(i);if(!gaps.length)for(let i=0;i+1<centers.length;i++)gaps.push(i);
      [gaps[0],gaps[gaps.length-1]].filter((g,i,a)=>g!==undefined&&a.indexOf(g)===i).forEach((gi,k)=>{const p=nearest((centers[gi]+centers[gi+1])/2);place('ceiba',p[0],p[1]-0.06,{minT:k?4:3,scale:0.95,clear:1.3});});}}
  /* 2. Mayan ruins scattered across the whole land (farthest-point spacing so they never clump): big-ish pieces on the rim, small ones in the voids */
  {const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.forEach(e=>inn.push([e.mid[0],e.mid[1]]));
    const seq=landThin([['stoneHead','i'],['stela','i'],['smallPyramid','r'],['stela','i'],['brokenWall','i'],['ruinedArch','r'],['stairRuin','i'],['altar','i'],['columns','i'],['smallPyramid','r'],['stela','i'],['brokenWall','i']]),chosen=[];
    seq.forEach(([k,z],idx)=>{const pool=z==='r'?rim:inn;let best=null,bd=-1;pool.forEach(p=>{const d=Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.25;if(d>bd){bd=d;best=p;}});if(!best)return;const o=place(k,best[0],best[1],{minT:(idx*12/seq.length)<2?1:(idx*12/seq.length)<5?2:(idx*12/seq.length)<9?3:4,scale:k==='smallPyramid'?1.2:1.4,clear:1.15});if(o)chosen.push([o.x,o.y]);else chosen.push(best);});}
  /* 3. trees: interior groves at every junction void, three-tree corridors, one-or-two in the diagonal corridors, then the rim and a fill pass for the corners */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=pickFrom(regionOf(v.y),capOk),n=1+Math.floor(rng()*2.3);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.08:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{const dom=pickFrom(regionOf(e.mid[1]),capOk);[-0.2,0.2].forEach(dy=>{if(rng()<0.7)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.55)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.8+rng()*0.2},null,true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.3));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(e.cls==='top'?-0.02:0)+(rng()-0.2)*0.12)});});
    let mode='grove',run=0,dom='broadleaf';samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.66?'grove':r<0.9?'sparse':'open';run=2+Math.floor(rng()*4);dom=pickFrom(regionOf(s.p[1]),capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){if(e.cls==='top'&&rng()<0.3)return;tree(p[0],p[1],null,dom,low);if(rng()<0.45)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,dom,low);if(rng()<0.12)tree(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,dom,true);}
      else if(mode==='sparse'){if(rng()<0.5)tree(p[0],p[1],null,dom,low);else under(p[0],p[1]);}else if(rng()<0.6)under(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.7)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<10;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.22)tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);}});
  /* 4. undergrowth: ferns, elephant ears, heliconia, flowers, banana plants */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.45)under(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.35)under(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.38)under(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.3)under(px,py);}});
  /* 5. small props: lower tiers only */
  [['tikiTorch',3],['crates',2],['signpost',1]].forEach(([k,n])=>{for(let i=0;i<landCnt(n);i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  /* tiers: each object appears at its tier and stays (props leave after tier 2); trees stay >= 68% of the scenery at every tier */
  const cuts={tree:[0.26,0.5,0.77,1],shrub:[0.06,0.38,0.7,1],rock:[0.3,0.55,0.8,1],prop:[1,1,1,1],ruin:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='ruin')o.tier=o.minT;});
  const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
  for(let t=1;t<=4;t++){let guard=0;while(guard++<300){const c=count(t);if(c.tr/Math.max(1,c.n)>=0.68)break;const pool=placed.filter(o=>o.tier<=t&&t<=o.maxT),cand=(pool.filter(o=>o.cat==='shrub').sort((a,b)=>b.pri-a.pri)[0])||(pool.filter(o=>o.prop&&o.minT>1).sort((a,b)=>b.pri-a.pri)[0]);if(!cand)break;cand.tier=Math.min(5,cand.tier+1);}}
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.sort((a,b)=>a.y-b.y);
  return JUNGLE_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: deep jungle floor with moss, mud and leaf litter, plus lush ground cover painted into the ground (decals, not objects) ---- */
function jungleGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<44;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'120,190,90':'20,60,34',r()<0.5?0.2:0.22);}
  for(let k=0;k<12;k++){const p=pt(),w=R*(0.25+r()*0.4);soft(p[0],p[1],w,w*0.4,'110,80,48',0.2);}                 /* mud */
  for(let k=0;k<10;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'190,230,110',0.16);}               /* sun dapples */
  for(let k=0;k<70;k++){const p=pt();TH.ell(c,p[0],p[1],R*(0.02+r()*0.02),R*0.012,r()<0.5?'rgba(120,80,40,.5)':'rgba(170,120,50,.45)',r()*3);}   /* leaf litter */
  for(let k=0;k<150;k++){const p=pt(),h=R*(0.05+r()*0.06);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#4f9a3f','#6fb34a','#3a8a35'][(k+j)%3],R*0.011);}      /* grass tufts */
  for(let k=0;k<70;k++){const p=pt(),s=R*(0.05+r()*0.05);for(let j=0;j<6;j++){const a=-Math.PI+0.2+j/5*(Math.PI-0.4);TH.ln(c,[p[0],p[1]],[p[0]+Math.cos(a)*s,p[1]+Math.sin(a)*s*0.55],'#3f8a45',R*0.011);}}   /* tiny ferns */
  for(let k=0;k<46;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.011,R*0.009,['#f6efe0','#f2c230','#e86aa8','#d9433b','#fff6c0'][k%5]);}  /* flower specks */
  c.restore();c.restore();
}
/* ---- generic baker (any theme object {assets, plan, ground, groundCol, seeds}) ---- */

function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol,clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]),key=[T.id,shape,tier,R,m,ground,sc,JSON.stringify(clr),JSON.stringify(opts.clearTiles||[])].join('|');const cached=revisedLandCache.get(key);if(cached)return cached;
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=0.75,top=T.top||1.35,bot=0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);return[cv,g];};
  const [back,cb]=mk();T.ground(cb,G,R,ox,oy,m,ground,({A:11,B:22,C:33,D:44})[shape]);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]),vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho))&&!(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));
  const sprites=vis.map(o=>{const unit=u*(o.scale||1);return {x:m*o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>T.assets[o.kind].draw(ctx,x,y,unit,o.v)};});
  const front=document.createElement('canvas'),frontRect={x:0,y:0,w:1,h:1};front.width=front.height=1;
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return revisedLandCache.set(key,{back,front,frontRect,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0,sprites});
}
function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}
const JUNGLE_THEME={id:'jungle',assets:JUNGLE_ASSETS,plan:getJunglePlan,ground:jungleGround,groundCol:'#4e7d3c',top:1.35};
const JUNGLE_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
/* public API: same shape as the Western pack */
function bakeLandJungle(shape,tier,R,opts){return bakeLandTheme(JUNGLE_THEME,shape,tier,R,opts);}
function drawLandJungleBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandJungleFront(ctx,x,y,land){land.sprites.slice().sort((a,b)=>a.y-b.y).forEach(s=>drawScenicSprite(ctx,s,x+s.x,y+s.y));}
function landJungleSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}


return Object.freeze({bake: bakeLandJungle, drawBack: drawLandJungleBack, drawFront: drawLandJungleFront});
})(),
  frontier: (() => {

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

/* ===== FRONTIER ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const FSH=(c,x,y,rx)=>{c.fillStyle='rgba(25,32,22,.26)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const FWOOD='#8a5a33',FWOOD_D='#5f3d20',FSTONE='#8f939a';
/* conifer: stacked jagged tiers; o = {h,w,tiers,bare,c1,c2,snow,tw} */
const FCON=(c,x,y,u,o,r)=>{const h=u*o.h,w=u*o.w,n=o.tiers,bare=o.bare===undefined?0.16:o.bare;TH.ln(c,[x,y],[x,y-h*(bare+0.1)],'#5a3b22',u*(o.tw||0.42));
  for(let i=0;i<n;i++){const t=i/n,ww=w*(1-0.8*t)*(0.92+r()*0.16),yb=y-h*(bare+(0.9-bare)*t),tip=yb-h*(o.layer||0.34),dy=yb-tip;
    TH.poly(c,[[x-ww,yb],[x-ww*0.55,yb-h*0.032],[x-ww*0.2,yb+h*0.012],[x+ww*0.25,yb-h*0.032],[x+ww*0.6,yb+h*0.01],[x+ww,yb],[x,tip]],o.c1);
    TH.poly(c,[[x,tip],[x+ww,yb],[x+ww*0.6,yb+h*0.01],[x+ww*0.25,yb-h*0.032],[x,yb]],o.c2);
    if(o.snow){TH.poly(c,[[x,tip],[x-ww*0.56,tip+dy*0.56],[x-ww*0.3,tip+dy*0.64],[x,tip+dy*0.5]],'#f4f8fb');TH.poly(c,[[x,tip],[x,tip+dy*0.5],[x+ww*0.3,tip+dy*0.62],[x+ww*0.56,tip+dy*0.56]],'#d3e0ea');}}};
const FTRI=(c,x,y,s,c1,c2)=>{TH.poly(c,[[x-s*0.55,y],[x,y-s*1.7],[x,y]],c1);TH.poly(c,[[x,y-s*1.7],[x+s*0.55,y],[x,y]],c2);};
const FSNOWCAP=(c,pts,col)=>TH.poly(c,pts,col);
const FRONTIER_ASSETS={
  /* ---------- trees ---------- */
  pine:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*11+2);FSH(c,x,y,u*1.6);FCON(c,x,y,u,{h:4.8+r()*1.3,w:1.45,tiers:6,c1:'#336b42',c2:'#25503a'},r);}},
  spruce:{cat:'tree',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*13+1);FSH(c,x,y,u*1.3);FCON(c,x,y,u,{h:6.0+r()*1.4,w:1.15,tiers:8,c1:'#2c6150',c2:'#1f4a3e',layer:0.3},r);}},
  fir:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*17+4);FSH(c,x,y,u*1.8);FCON(c,x,y,u,{h:3.9+r()*0.9,w:1.75,tiers:5,c1:'#3a7448',c2:'#2a5a3a',layer:0.4,bare:0.1},r);}},
  snowPine:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*19+2);FSH(c,x,y,u*1.6);FCON(c,x,y,u,{h:4.8+r()*1.4,w:1.5,tiers:6,c1:'#2e6040',c2:'#22483a',snow:true},r);}},
  bigPine:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*23+1),H=u*(8.4+r()*1.3);FSH(c,x,y,u*2.0);FCON(c,x,y,u,{h:8.4+r()*1.3,w:2.0,tiers:9,c1:'#326641',c2:'#234d37',bare:0.3,tw:0.7,layer:0.3},r);TH.ln(c,[x-u*0.1,y],[x-u*0.1,y-H*0.32],'#8a5a3a',u*0.16);}},
  aspen:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*5+3),H=u*(4.4+r()*1.0),pal=[['#c9c24a','#b2bf3f','#d9d05a','#9db538'],['#e0b64a','#d29a38','#e8c85a','#c8b040'],['#a9c04a','#8fae3d','#bfd05a','#7aa03a']][v%3];FSH(c,x,y,u*1.8);
    c.lineCap='round';c.strokeStyle='#e8e4d6';c.lineWidth=u*0.5;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.1,y-H*0.4,x+u*0.05,y-H*0.7);c.stroke();for(let k=0;k<8;k++)TH.ln(c,[x-u*0.2,y-H*(0.06+k*0.08)],[x+u*0.1,y-H*(0.06+k*0.08)+u*0.05],'rgba(40,36,30,.55)',u*0.07);TH.ln(c,[x,y-H*0.55],[x-u*0.8,y-H*0.85],'#e8e4d6',u*0.2);TH.ln(c,[x,y-H*0.6],[x+u*0.9,y-H*0.82],'#e8e4d6',u*0.2);
    const cy=y-H*0.85;[[0,-0.5,1.35,1.0],[-1.1,-0.1,1.0,0.85],[1.1,-0.1,1.0,0.85],[-0.5,-1.15,1.0,0.8],[0.6,-1.1,1.0,0.8],[0,0.2,1.2,0.7]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,9));}},
  deadSnag:{cat:'tree',rho:0.04,draw(c,x,y,u,v){const r=mulberry(v*23+1),H=u*(3.4+r()*1.0);FSH(c,x,y,u*0.9);c.lineCap='round';TH.ln(c,[x,y],[x+u*0.12,y-H],'#8a8478',u*0.42);TH.ln(c,[x+u*0.1,y-H*0.55],[x-u*1.0,y-H*0.88],'#8a8478',u*0.22);TH.ln(c,[x+u*0.12,y-H*0.7],[x+u*0.95,y-H*1.0],'#8a8478',u*0.2);TH.ln(c,[x+u*0.12,y-H],[x,y-H*1.2],'#8a8478',u*0.15);TH.ln(c,[x-u*0.1,y],[x-u*0.1,y-H*0.8],'#a8a296',u*0.1);}},
  youngFir:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*29+3);FSH(c,x,y,u*1.2);FCON(c,x,y,u,{h:2.7+r()*0.9,w:1.1,tiers:4,c1:'#3f7a4a',c2:'#2d5f3d',layer:0.42,bare:0.08,tw:0.3},r);}},
  /* ---------- undergrowth ---------- */
  berryBush:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(25,32,22,.22)');[[-0.55,-0.45,0.8,0.55],[0.55,-0.45,0.8,0.55],[0,-0.85,0.85,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#5f8a4a','#4f7a3f','#6f9a55'][i],r,8));for(let k=0;k<7;k++)TH.ell(c,x+(r()-0.5)*u*1.5,y-u*(0.3+r()*0.9),u*0.1,u*0.1,v%2?'#c0392b':'#4a4a9a');}},
  lupine:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*5+9),cols=[['#7a5ac8','#a58be0'],['#4a6ad0','#7f9af0'],['#d65a9a','#f090c0']][v%3];TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.28,'rgba(25,32,22,.2)');for(let k=0;k<4;k++){const bx=x+(k-1.5)*u*0.35;TH.ln(c,[bx,y],[bx+(r()-0.5)*u*0.2,y-u*(1.2+r()*0.8)],'#4f8a45',u*0.1);}for(let k=0;k<4;k++){const bx=x+(k-1.5)*u*0.35,h=1.4+r()*0.7;for(let j=0;j<6;j++)TH.ell(c,bx+(j%2?0.07:-0.07)*u,y-u*(h-j*0.16),u*0.13,u*0.1,cols[j%2]);}}},
  wildflowers:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*7+2);TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.28,'rgba(25,32,22,.2)');for(let k=0;k<12;k++){const fx=x+(r()-0.5)*u*1.6,fy=y-r()*u*0.5;TH.ln(c,[fx,fy],[fx,fy-u*(0.4+r()*0.4)],'#5f8a45',u*0.06);}for(let k=0;k<12;k++){const fx=x+(r()-0.5)*u*1.6,fy=y-u*(0.5+r()*0.8);TH.ell(c,fx,fy,u*0.13,u*0.11,['#f2c230','#f6efe0','#e86a3a','#8a5ac8','#f090c0'][k%5]);TH.ell(c,fx,fy,u*0.05,u*0.05,'#fff0a0');}}},
  grassTuft:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);for(let k=0;k<13;k++){const a=-1.1+k/12*2.2+(r()-0.5)*0.2,l=u*(0.7+r()*0.8);TH.ln(c,[x+(r()-0.5)*u*0.6,y],[x+Math.sin(a)*l*0.8+(r()-0.5)*u*0.3,y-l],['#a3a850','#8d9a46','#b8b660'][k%3],u*0.09);}}},
  fallenLog:{cat:'shrub',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*7+1);TH.ell(c,x+u*0.4,y+u*0.1,u*2.0,u*0.4,'rgba(25,32,22,.25)');const I=(X,Z)=>TH.iso(x,y,u,X,0,Z);const a=I(-1.7,0.4),b=I(1.7,0.4);c.lineCap='round';TH.ln(c,a,b,'#5f3d20',u*0.95);TH.ln(c,[a[0],a[1]-u*0.18],[b[0],b[1]-u*0.18],FWOOD,u*0.6);TH.ln(c,[a[0],a[1]-u*0.36],[b[0],b[1]-u*0.36],'#a67a48',u*0.18);TH.ell(c,b[0]+u*0.05,b[1],u*0.45,u*0.48,'#c9a066');TH.ell(c,b[0]+u*0.05,b[1],u*0.28,u*0.3,'#a67a48');TH.ell(c,b[0]+u*0.05,b[1],u*0.12,u*0.13,'#8a5a33');for(let k=0;k<3;k++)TH.blob(c,x+(r()-0.5)*u*2.2,y-u*0.8,u*0.45,u*0.25,'#5f8a3f',r,7);}},
  stump:{cat:'shrub',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.9,u*0.28,'rgba(25,32,22,.25)');c.fillStyle=FWOOD;c.beginPath();c.moveTo(x-u*0.55,y);c.lineTo(x-u*0.5,y-u*0.8);c.lineTo(x+u*0.5,y-u*0.8);c.lineTo(x+u*0.55,y);c.ellipse(x,y,u*0.55,u*0.2,0,0,Math.PI);c.fill();TH.ell(c,x,y-u*0.8,u*0.5,u*0.2,'#c9a066');TH.ell(c,x,y-u*0.8,u*0.32,u*0.12,'#a67a48');TH.ell(c,x,y-u*0.8,u*0.14,u*0.06,'#8a5a33');}},
  boulders:{cat:'rock',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.8,'#9a9ea6'],[0.7,0.2,0.8,0.7,'#a8acb2'],[0,-0.35,0.7,0.6,'#8a8e96']].forEach(([dx,dy,rx,ry,col])=>{const px=x+dx*u,py=y+dy*u,sx=u*rx,sy=u*ry*(1+r()*0.2);TH.ell(c,px+sx*0.15,py+sy*0.3,sx*1.05,sy*0.45,'rgba(25,32,22,.25)');TH.poly(c,[[px-sx,py],[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px-sx*0.6,py+sy*0.2]],col);TH.poly(c,[[px+sx*0.25,py-sy*0.98],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px+sx*0.2,py+sy*0.05]],shade(col,-0.25));TH.poly(c,[[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.1,py-sy*0.55],[px-sx*0.5,py-sy*0.5]],shade(col,0.16));});}},
  /* ---------- mountains ---------- */
  snowPeak:{cat:'rock',rho:0.22,draw(c,x,y,u,v){const r=mulberry(v*9+2),H=u*(10.8+r()*2.6),w=u*(4.8+r()*0.8);TH.ell(c,x+u*1.2,y+u*0.3,w*1.3,u*0.8,'rgba(25,32,22,.25)');
    const pts=[[-w*1.3,0]],n=10;for(let i=1;i<n;i++){const t=i/n,sh=1-Math.abs(t-0.5)*2;pts.push([-w*1.3+t*w*2.6+(r()-0.5)*w*0.1,-H*Math.pow(sh,0.9)*(0.9+r()*0.14)]);}pts[5]=[(r()-0.5)*w*0.15,-H];pts.push([w*1.3,0]);const sx=pts[5][0];
    c.save();c.translate(x,y);c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle='#8593a3';c.fill();c.clip();
    TH.poly(c,[[sx,-H],[w*1.4,0],[sx+w*0.05,0]].concat([]),'#5c6a7c');TH.poly(c,[[-w*1.4,0],[sx,0],[sx,-H]],'#9aa8b8');
    for(let k=0;k<9;k++){const t=r(),bx=sx+(r()*2-1)*w*0.9;TH.ln(c,[bx,-H*(0.9-t*0.5)],[bx+(r()-0.5)*w*0.2,-H*(0.25+r()*0.2)],r()<0.5?'rgba(40,52,68,.4)':'rgba(220,235,245,.35)',u*0.1);}
    const sl=[];const sn=14;for(let i=0;i<=sn;i++)sl.push([-w*1.4+i/sn*w*2.8,-H*(0.56+(r()-0.5)*0.1)]);
    c.beginPath();c.moveTo(-w*1.4,-H*1.1);sl.forEach(p=>c.lineTo(p[0],p[1]));c.lineTo(w*1.4,-H*1.1);c.closePath();c.save();c.clip();c.fillStyle='#f4f8fb';c.fillRect(-w*1.5,-H*1.2,sx+w*1.5,H*1.3);c.fillStyle='#cfdbe6';c.fillRect(sx,-H*1.2,w*1.6,H*1.3);c.restore();
    for(let k=0;k<5;k++){const bx=sx+(r()*2-1)*w*0.7;TH.ln(c,[bx,-H*(0.9-r()*0.2)],[bx+(r()-0.5)*w*0.15,-H*(0.6+r()*0.05)],'rgba(110,130,150,.45)',u*0.08);}
    for(let k=0;k<52;k++){const t=Math.pow(r(),0.7),yy=-H*0.02-t*H*0.3,span=w*(1.3-t*0.4),xx=(r()*2-1)*span;FTRI(c,xx,yy,u*(0.5+r()*0.35),k%2?'#2f6040':'#264f36',k%2?'#22483a':'#1c3f2e');}
    const g=c.createLinearGradient(0,-H*0.4,0,0);g.addColorStop(0,'rgba(225,238,245,0)');g.addColorStop(1,'rgba(215,232,242,.3)');c.fillStyle=g;c.fillRect(-w*1.4,-H*0.4,w*2.8,H*0.4);c.restore();}},
  pineHill:{cat:'rock',rho:0.2,draw(c,x,y,u,v){const r=mulberry(v*7+8),H=u*(4.8+r()*1.8),w=u*(3.5+r()*0.8);TH.ell(c,x+u*0.8,y+u*0.25,w*1.3,u*0.7,'rgba(25,32,22,.22)');
    c.save();c.translate(x,y);c.beginPath();c.moveTo(-w*1.3,0);c.bezierCurveTo(-w*1.1,-H*0.85,-w*0.45,-H*1.1,0,-H);c.bezierCurveTo(w*0.45,-H*1.05,w*1.1,-H*0.8,w*1.3,0);c.closePath();c.fillStyle='#5f7f4a';c.fill();c.clip();
    const g=c.createLinearGradient(-w*1.3,0,w*1.3,0);g.addColorStop(0,'rgba(200,230,150,.18)');g.addColorStop(0.5,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,30,22,.45)');c.fillStyle=g;c.fillRect(-w*1.4,-H*1.2,w*2.8,H*1.3);
    const trees=[];for(let k=0;k<48;k++){const t=Math.pow(r(),0.85),yy=-H*(0.03+t*0.93),span=w*(1.3-Math.pow(t,1.4)*1.05);trees.push([(r()*2-1)*span,yy,u*(0.5+r()*0.35),k%2]);}trees.sort((a,b)=>a[1]-b[1]).forEach(([tx,ty,s,k])=>FTRI(c,tx,ty,s,k?'#336b42':'#2a5a38',k?'#25503a':'#1e4430'));c.restore();}},
  graniteCliff:{cat:'rock',rho:0.16,draw(c,x,y,u,v){const r=mulberry(v*5+6),H=u*(5.6+r()*1.6),w=u*(2.3+r()*0.5);TH.ell(c,x+u*0.8,y+u*0.2,w*1.5,u*0.55,'rgba(25,32,22,.25)');
    const bands=['#9ea3ab','#8a8f98','#a8adb4','#939aa3'];for(let i=0;i<5;i++){const t0=i/5,t1=(i+1)/5,j0=(r()-0.5)*u*0.4,j1=(r()-0.5)*u*0.4;TH.poly(c,[[x-w+j0,y-H*t0],[x+w+j1,y-H*t0],[x+w*0.94+j1,y-H*t1],[x-w*0.94+j0,y-H*t1]],bands[i%4]);TH.poly(c,[[x+w*0.2,y-H*t0],[x+w+j1,y-H*t0],[x+w*0.94+j1,y-H*t1],[x+w*0.2,y-H*t1]],'rgba(25,32,44,.28)');}
    TH.poly(c,[[x-w*0.98,y-H],[x+w*0.95,y-H],[x+w*0.7,y-H-u*0.55],[x-w*0.7,y-H-u*0.55]],'#f2f6f9');TH.poly(c,[[x+w*0.1,y-H],[x+w*0.95,y-H],[x+w*0.7,y-H-u*0.55],[x+w*0.1,y-H-u*0.55]],'#cfdbe6');for(let k=0;k<3;k++)FTRI(c,x+(r()*2-1)*w*0.7,y-H-u*0.2,u*(0.55+r()*0.3),'#336b42','#25503a');}},
  /* ---------- homestead pieces (sprinkled) ---------- */
  logCabin:{cat:'struct',rho:0.15,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.8,y+u*0.2,u*3.0,u*0.9,'rgba(25,32,22,.25)');TH.box(c,x,y,u,-1.7,1.7,-1.2,1.2,0,2.1,'#93613a','#6a4426','#a8764a');for(let k=0;k<7;k++)TH.ln(c,I(-1.7,1.21,0.15+k*0.3),I(1.7,1.21,0.15+k*0.3),'rgba(45,25,10,.4)',u*0.07);for(let k=0;k<5;k++)TH.ln(c,I(1.71,-1.2+k*0.5,0.1),I(1.71,-1.2+k*0.5,2.0),'rgba(30,15,5,.25)',u*0.05);
    for(let k=0;k<7;k++){const z=0.15+k*0.3;TH.ell(c,...I(-1.72,1.21,z),u*0.12,u*0.09,'#b98a55');TH.ell(c,...I(1.72,1.21,z),u*0.12,u*0.09,'#b98a55');}
    TH.poly(c,[I(-0.4,1.22,0),I(0.4,1.22,0),I(0.4,1.22,1.5),I(-0.4,1.22,1.5)],'#3a2615');TH.poly(c,[I(-1.4,1.22,1.0),I(-0.8,1.22,1.0),I(-0.8,1.22,1.6),I(-1.4,1.22,1.6)],'#2a1a10','#d9c9a0',u*0.05);TH.poly(c,[I(0.9,1.22,1.0),I(1.5,1.22,1.0),I(1.5,1.22,1.6),I(0.9,1.22,1.6)],'#2a1a10','#d9c9a0',u*0.05);
    TH.poly(c,[I(2.0,-1.6,2.1),I(2.0,1.6,2.1),I(0,1.6,3.4),I(0,-1.6,3.4)],'#6a4a2a');for(let k=1;k<7;k++)TH.ln(c,I(2.0-0.285*k,-1.6,2.1+0.186*k),I(2.0-0.285*k,1.6,2.1+0.186*k),'rgba(30,15,5,.4)',u*0.05);TH.poly(c,[I(-2.0,1.6,2.1),I(2.0,1.6,2.1),I(0,1.6,3.4)],'#8a5a33');
    TH.poly(c,[I(1.98,-1.62,2.15),I(1.98,1.62,2.15),I(0.9,1.62,2.85),I(0.9,-1.62,2.85)],'rgba(246,250,252,.9)');TH.box(c,x,y,u,0.8,1.3,-0.9,-0.4,2.9,4.2,'#8d9098','#6d7078','#a3a6ae');TH.poly(c,[[...I(1.05,-0.65,4.35)],[...I(1.05,-0.65,4.35)].map((v,i)=>v+(i?-u*0.6:u*0.15)),[...I(1.05,-0.65,4.35)].map((v,i)=>v+(i?-u*1.1:-u*0.1))],'rgba(230,230,235,.0)');
    TH.ell(c,...I(1.05,-0.65,4.5),u*0.3,u*0.18,'rgba(235,235,240,.7)');TH.ell(c,I(1.05,-0.65,5.0)[0]-u*0.1,I(1.05,-0.65,5.0)[1],u*0.4,u*0.24,'rgba(235,235,240,.5)');}},
  teepee:{cat:'struct',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*7+3),H=u*5.0,w=u*1.9;TH.ell(c,x+u*0.7,y+u*0.18,w*1.5,u*0.55,'rgba(25,32,22,.25)');
    [[-0.5,-1.6],[0.4,-1.7],[-0.2,-1.9],[0.6,-1.5]].forEach(([a,b])=>TH.ln(c,[x+a*w*0.2,y-H*0.95],[x+a*w*0.2+b*u*0.6,y-H*1.28],'#6a4a2a',u*0.12));
    TH.poly(c,[[x-w,y],[x,y-H],[x,y]],'#ede1c4');TH.poly(c,[[x,y-H],[x+w,y],[x,y]],'#cdbf9f');c.beginPath();c.ellipse(x,y,w,w*0.28,0,0,Math.PI);c.fillStyle='#d9ccac';c.fill();
    for(let k=0;k<6;k++){const t=0.15+k*0.07,px=w*(1-t*0.0);}
    const band=(t0,t1,col)=>{const w0=w*(1-t0),w1=w*(1-t1);TH.poly(c,[[x-w0,y-H*t0],[x+w0,y-H*t0],[x+w1,y-H*t1],[x-w1,y-H*t1]],col);};band(0.28,0.38,'#b5362b');band(0.42,0.48,'#2a2a30');for(let k=-3;k<=3;k++){const t=0.33,ww=w*(1-t);TH.poly(c,[[x+k*ww*0.28-ww*0.1,y-H*0.38],[x+k*ww*0.28,y-H*0.28],[x+k*ww*0.28+ww*0.1,y-H*0.38]],'#f2c230');}
    TH.poly(c,[[x+w*0.5,y-H*0.0],[x+w*0.12,y-H*0.0],[x-w*0.05,y-H*0.42],[x+w*0.4,y-H*0.46]],'rgba(0,0,0,0)');TH.poly(c,[[x-w*0.28,y+u*0.05],[x+w*0.28,y+u*0.05],[x+w*0.12,y-H*0.34],[x-w*0.12,y-H*0.34]],'#3a2a1a');TH.poly(c,[[x-w*0.22,y+u*0.05],[x+w*0.0,y+u*0.05],[x-w*0.04,y-H*0.3],[x-w*0.1,y-H*0.3]],'#5a432a');
    TH.ln(c,[x,y-H*1.02],[x+u*0.15,y-H*1.1],'rgba(230,230,235,.0)',u*0.1);TH.ell(c,x+u*0.2,y-H*1.18,u*0.3,u*0.2,'rgba(235,235,240,.55)');TH.ell(c,x+u*0.45,y-H*1.4,u*0.4,u*0.26,'rgba(235,235,240,.38)');for(let k=0;k<5;k++)TH.ell(c,x+(k-2)*w*0.42,y+u*0.14,u*0.14,u*0.1,'#8f939a');}},
  totemPole:{cat:'struct',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*5+9),H=u*7.2,w=u*0.62;TH.ell(c,x+u*0.5,y+u*0.12,u*1.4,u*0.4,'rgba(25,32,22,.26)');TH.ell(c,x,y,u*0.9,u*0.3,'#6b6f52');
    const seg=(y0,y1,col,face)=>{const g=c.createLinearGradient(x-w,0,x+w,0);g.addColorStop(0,shade(col,0.2));g.addColorStop(0.55,col);g.addColorStop(1,shade(col,-0.35));c.fillStyle=g;c.fillRect(x-w,y-y1,w*2,y1-y0);if(face){const fy=y-(y0+y1)/2;TH.ell(c,x-w*0.45,fy-u*0.1,w*0.28,w*0.2,'#f6efe0');TH.ell(c,x+w*0.45,fy-u*0.1,w*0.28,w*0.2,'#f6efe0');TH.ell(c,x-w*0.45,fy-u*0.1,w*0.1,w*0.1,'#222');TH.ell(c,x+w*0.45,fy-u*0.1,w*0.1,w*0.1,'#222');TH.poly(c,[[x-w*0.18,fy-u*0.05],[x+w*0.18,fy-u*0.05],[x+w*0.1,fy+u*0.35],[x-w*0.1,fy+u*0.35]],'#e8a02a');TH.ell(c,x,fy+u*0.52,w*0.5,w*0.16,'#222');TH.ell(c,x,fy+u*0.52,w*0.35,w*0.07,'#b5362b');}};
    seg(0,u*2.1,'#b5362b',true);seg(u*2.1,u*4.0,'#2a8a8a',true);seg(u*4.0,u*5.6,'#e8dcc0',true);seg(u*5.6,H,'#2a2a30',false);
    [[0,1],[1,-1]].forEach(([k,s])=>{c.fillStyle=k?'#b5362b':'#2a8a8a';c.beginPath();c.moveTo(x+s*w*0.9,y-u*5.9);c.quadraticCurveTo(x+s*w*3.2,y-u*7.1,x+s*w*3.6,y-u*5.3);c.quadraticCurveTo(x+s*w*2.2,y-u*5.9,x+s*w*0.9,y-u*5.4);c.fill();c.strokeStyle='#e8dcc0';c.lineWidth=u*0.1;c.beginPath();c.moveTo(x+s*w*1.4,y-u*5.7);c.lineTo(x+s*w*2.9,y-u*6.0);c.stroke();});
    TH.poly(c,[[x-w*0.4,y-H],[x+w*0.4,y-H],[x+w*0.2,y-H-u*0.8],[x,y-H-u*1.1],[x-w*0.2,y-H-u*0.8]],'#e8dcc0');TH.poly(c,[[x-w*0.1,y-H-u*0.4],[x+w*0.5,y-H-u*0.5],[x+w*0.1,y-H-u*0.8]],'#e8a02a');TH.ell(c,x-w*0.12,y-H-u*0.6,w*0.1,w*0.1,'#222');}},
  /* ---------- small props (lower tiers only) ---------- */
  campfire:{cat:'prop',rho:0.06,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.1,u*1.6,u*0.5,'rgba(25,32,22,.25)');for(let k=0;k<8;k++){const a=k/8*6.283;TH.ell(c,x+Math.cos(a)*u*0.95,y+Math.sin(a)*u*0.4,u*0.3,u*0.22,k%2?'#8a8e96':'#a0a4ac');}TH.ln(c,[x-u*0.6,y+u*0.05],[x+u*0.5,y-u*0.2],'#5f3d20',u*0.3);TH.ln(c,[x+u*0.6,y+u*0.05],[x-u*0.5,y-u*0.2],'#4a2f18',u*0.28);const g=c.createRadialGradient(x,y-u*0.8,0,x,y-u*0.8,u*2.0);g.addColorStop(0,'rgba(255,190,90,.5)');g.addColorStop(1,'rgba(255,190,90,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*0.8,u*2.0,0,7);c.fill();TH.poly(c,[[x-u*0.5,y-u*0.15],[x+u*0.5,y-u*0.15],[x+u*0.25,y-u*1.2],[x,y-u*1.7],[x-u*0.2,y-u*1.0]],'#f08a24');TH.poly(c,[[x-u*0.25,y-u*0.15],[x+u*0.25,y-u*0.15],[x,y-u*0.95]],'#ffe27a');}},
  woodpile:{cat:'prop',rho:0.06,draw(c,x,y,u,v){TH.ell(c,x+u*0.4,y+u*0.1,u*1.6,u*0.45,'rgba(25,32,22,.25)');const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.box(c,x,y,u,-1.0,1.0,-0.6,0.6,0,1.1,'#7a4f2a','#5a3a1e','#93633a');for(let row=0;row<3;row++)for(let k=0;k<6;k++){const X=-0.85+k*0.34,Z=0.18+row*0.34;TH.ell(c,...I(X+0.15,0.61,Z),u*0.15,u*0.12,k%2?'#c9a066':'#b98a55');TH.ell(c,...I(X+0.15,0.61,Z),u*0.07,u*0.06,'#8a5a33');}}},
  railFence:{cat:'prop',rho:0.09,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.3,y+u*0.1,u*2.0,u*0.35,'rgba(25,32,22,.16)');for(let k=0;k<4;k++){const X=-1.8+k*1.2;TH.ln(c,I(X,0,0),I(X,0,1.3),FWOOD_D,u*0.2);}[0.45,0.95].forEach(z=>{TH.ln(c,I(-1.8,0,z),I(1.8,0,z),'#a67a48',u*0.15);});TH.ln(c,I(-1.8,0,0.75),I(-0.6,0,0.35),'#a67a48',u*0.1);}},
  lanternPost:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(25,32,22,.25)');TH.ln(c,[x,y],[x,y-u*3.0],FWOOD_D,u*0.28);TH.ln(c,[x,y-u*2.85],[x+u*0.55,y-u*2.85],FWOOD_D,u*0.14);const lx=x+u*0.55,ly=y-u*2.8,g=c.createRadialGradient(lx,ly-u*0.3,0,lx,ly-u*0.3,u*1.4);g.addColorStop(0,'rgba(255,215,130,.5)');g.addColorStop(1,'rgba(255,215,130,0)');c.fillStyle=g;c.beginPath();c.arc(lx,ly-u*0.3,u*1.4,0,7);c.fill();TH.poly(c,[[lx-u*0.25,ly],[lx+u*0.25,ly],[lx+u*0.2,ly-u*0.6],[lx-u*0.2,ly-u*0.6]],'#ffe9a8','#2a2d36',u*0.06);TH.poly(c,[[lx-u*0.3,ly-u*0.6],[lx+u*0.3,ly-u*0.6],[lx,ly-u*0.9]],'#2a2d36');}},
  signpost:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.25,'rgba(25,32,22,.25)');TH.ln(c,[x,y],[x,y-u*2.8],FWOOD_D,u*0.28);[[-1,-2.5,'#b98a55'],[1,-1.8,'#c9a066']].forEach(([d,h,col])=>{TH.poly(c,[[x,y+h*u-u*0.3],[x+d*u*1.5,y+h*u-u*0.3],[x+d*u*1.9,y+h*u],[x+d*u*1.5,y+h*u+u*0.3],[x,y+h*u+u*0.3]],col,FWOOD_D,u*0.05);TH.ln(c,[x+d*u*0.3,y+h*u],[x+d*u*1.2,y+h*u],'rgba(50,30,10,.45)',u*0.06);});}}
};

/* ===== MACRO-LAND ENGINE (hex geometry, path network, planner, baker) ===== */
const W3=Math.sqrt(3),HX=W3/2,HV=[[HX,0.29],[0,0.58],[-HX,0.29],[-HX,-0.29],[0,-0.58],[HX,-0.29]];
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[0,1,2],[-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5,1.5]],C:[[0],[-0.5,0.5,1.5],[-1,0,1],[-0.5]],D:[[0,1,2],[-0.5,0.5,1.5],[0,1]]};
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

function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol,clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]),key=[T.id,shape,tier,R,m,ground,sc,JSON.stringify(clr),JSON.stringify(opts.clearTiles||[])].join('|');const cached=revisedLandCache.get(key);if(cached)return cached;
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=0.75,top=T.top||1.35,bot=0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);return[cv,g];};
  const [back,cb]=mk();T.ground(cb,G,R,ox,oy,m,ground,({A:11,B:22,C:33,D:44})[shape]);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]),vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho))&&!(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));
  const sprites=vis.map(o=>{const unit=u*(o.scale||1);return {x:m*o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>T.assets[o.kind].draw(ctx,x,y,unit,o.v)};});
  const front=document.createElement('canvas'),frontRect={x:0,y:0,w:1,h:1};front.width=front.height=1;
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return revisedLandCache.set(key,{back,front,frontRect,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0,sprites});
}
function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}

/* ===== FRONTIER LAND: planner (jungle-level tree density, conifer-led), olive ground, snowy range on the back rim ===== */
const FRONTIER_REGION={top:{pine:.28,spruce:.26,snowPine:.16,fir:.1,aspen:.06,deadSnag:.03,youngFir:.06,bigPine:.0},mid:{pine:.3,spruce:.2,fir:.14,aspen:.22,deadSnag:.04,youngFir:.1},bottom:{aspen:.28,pine:.2,fir:.14,youngFir:.2,spruce:.12,deadSnag:.06}};
const FRONTIER_LOW=[['youngFir',1],['aspen',0.65],['fir',0.62],['youngFir',1.25],['pine',0.55],['aspen',0.75],['fir',0.7]];
const FRONTIER_CAP={bigPine:5,deadSnag:4,snowPine:10};
const FRONTIER_UNDER=['berryBush','lupine','wildflowers','grassTuft','fallenLog','berryBush','stump','grassTuft','boulders'];
const FRONTIER_PLAN_CACHE={};
function getFrontierPlan(shape){
  if(FRONTIER_PLAN_CACHE[shape])return FRONTIER_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(({A:8101,B:9202,C:10329,D:11430})[shape]),placed=[],bb=G.bbox,used={},A=FRONTIER_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.66);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'pine';};
  const capOk=k=>!(FRONTIER_CAP[k]&&(used[k]||0)>=FRONTIER_CAP[k]);
  const regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?FRONTIER_REGION.top:n<0.68?FRONTIER_REGION.mid:FRONTIER_REGION.bottom;};
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='tree'?0.88+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const tree=(x,y,extra,dom,low)=>{if(low){const L=FRONTIER_LOW[Math.floor(rng()*FRONTIER_LOW.length)];return place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return place(dom&&rng()<0.55&&capOk(dom)?dom:pickFrom(regionOf(y),capOk),x,y,extra||{});};
  const under=(x,y,extra)=>place(FRONTIER_UNDER[Math.floor(rng()*FRONTIER_UNDER.length)],x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const LKS=G.centers.length/12,landThin=l=>{const n=Math.max(1,Math.round(l.length*LKS));return Array.from({length:n},(_,i)=>l[Math.floor((i+0.5)*l.length/n)]);},landCnt=n=>Math.max(1,Math.round(n*LKS));
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. the snowy range on the back rim: peaks, pine-covered hills and granite cliffs, plus tall emergent pines behind them */
  {const pts=[];top.forEach(e=>[0.2,0.5,0.8].forEach(t=>pts.push(onEdge(e,t,0.0))));pts.sort((a,b)=>a[0]-b[0]);const x0=pts[0][0],x1=pts[pts.length-1][0],nearest=x=>pts.reduce((b,p)=>Math.abs(p[0]-x)<Math.abs(b[0]-x)?p:b);
    const centers=[];let x=x0+0.12+rng()*0.2;while(x<x1-0.05){centers.push(x);x+=0.8+rng()*0.55;}
    centers.forEach((cxp,i)=>{const p=nearest(cxp),bx=p[0],by=p[1],t=rng(),mt=a=>a+(rng()<0.35?1:0),at=(k,dx,dy,ex)=>place(k,bx+dx,by+dy,ex),pk=i===Math.floor(centers.length/2)?1:mt(2);
      if(t<0.42){at('snowPeak',0,-0.02,{minT:pk,scale:0.92+rng()*0.2});at('pineHill',-0.5,0.03,{minT:mt(1)});at('pineHill',0.5,0.02,{minT:mt(2)});at('boulders',0.02,0.1,{minT:1});}
      else if(t<0.74){at('pineHill',-0.3,0.01,{minT:1});at('snowPeak',0.18,-0.02,{minT:mt(2),scale:0.78});at('graniteCliff',-0.6,0.04,{minT:3});at('boulders',0.1,0.1,{minT:2});}
      else{at('pineHill',-0.25,0.01,{minT:mt(1)});at('pineHill',0.3,0.0,{minT:2});at('graniteCliff',0.0,-0.02,{minT:3,scale:0.8});at('boulders',-0.05,0.1,{minT:1});}});
    {const gaps=[];for(let i=0;i+1<centers.length;i++)gaps.push(i);[gaps[0],gaps[gaps.length-1]].filter((g,i,a)=>g!==undefined&&a.indexOf(g)===i).forEach((gi,k)=>{const p=nearest((centers[gi]+centers[gi+1])/2);place('bigPine',p[0],p[1]-0.06,{minT:k?4:3,scale:0.95,clear:1.3});});}}
  /* 2. homestead pieces sprinkled across the whole land (farthest-point spacing): cabins on the rim, teepees and totems anywhere */
  {const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.forEach(e=>inn.push([e.mid[0],e.mid[1]]));
    const seq=landThin([['teepee','a',1],['logCabin','r',2],['teepee','i',2],['totemPole','a',3],['logCabin','r',3],['teepee','a',3],['totemPole','a',4],['logCabin','r',4],['teepee','i',4]]),chosen=[],sc={teepee:1.1,logCabin:1.2,totemPole:1.0};
    seq.forEach(([k,z,mt])=>{const pool=z==='r'?rim:z==='i'?inn:rim.concat(inn),ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.25})).sort((a,b)=>b.d-a.d);
      for(let n=0;n<Math.min(10,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],{minT:mt,scale:sc[k],clear:1.9});if(o){chosen.push([o.x,o.y]);return;}}});}
  /* 3. trees (conifer-led): junction groves, corridor trees, rim groves and a fill pass for the corners */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=pickFrom(regionOf(v.y),capOk),n=2+Math.floor(rng()*1.8);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.09:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{const dom=pickFrom(regionOf(e.mid[1]),capOk);[-0.27,0,0.27].forEach(dy=>{if(rng()<0.7)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.72)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.8+rng()*0.2},null,true);if(rng()<0.22)tree(e.mid[0]+(rng()-0.5)*0.34,e.mid[1]+(rng()-0.5)*0.14,{scale:0.78+rng()*0.2},null,true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.26));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(e.cls==='top'?-0.02:0)+(rng()-0.2)*0.12)});});
    let mode='grove',run=0,dom='pine';samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.74?'grove':r<0.92?'sparse':'open';run=2+Math.floor(rng()*4);dom=pickFrom(regionOf(s.p[1]),capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){if(e.cls==='top'&&rng()<0.2)return;tree(p[0],p[1],null,dom,low);if(rng()<0.55)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,dom,low);if(rng()<0.2)tree(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,dom,true);if(rng()<0.14)tree(p[0]+(rng()-0.5)*0.34,p[1]-0.2,null,dom,low);}
      else if(mode==='sparse'){if(rng()<0.5)tree(p[0],p[1],null,dom,low);else under(p[0],p[1]);}else if(rng()<0.6)under(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.8)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<14;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.3)tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);}});
  /* 4. undergrowth */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.45)under(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.35)under(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.38)under(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.3)under(px,py);}});
  /* 5. small props: lower tiers only */
  [['campfire',2],['woodpile',2],['railFence',2],['lanternPost',2],['signpost',1]].forEach(([k,n])=>{for(let i=0;i<landCnt(n);i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  const cuts={tree:[0.2,0.52,0.8,1],shrub:[0.06,0.38,0.7,1],rock:[0.3,0.55,0.8,1],prop:[1,1,1,1],struct:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='struct')o.tier=o.minT;});
  const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
  for(let t=1;t<=4;t++){let guard=0;while(guard++<300){const c=count(t);if(c.tr/Math.max(1,c.n)>=0.74)break;const pool=placed.filter(o=>o.tier<=t&&t<=o.maxT),cand=(pool.filter(o=>o.cat==='shrub').sort((a,b)=>b.pri-a.pri)[0])||(pool.filter(o=>o.prop&&o.minT>1).sort((a,b)=>b.pri-a.pri)[0]);if(!cand)break;cand.tier=Math.min(5,cand.tier+1);}}
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.sort((a,b)=>a.y-b.y);
  return FRONTIER_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: olive forest floor with pine-needle litter, dry-grass tufts, wildflowers and a light frost near the mountains (decals, not objects) ---- */
function frontierGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<44;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'170,176,100':'60,78,44',r()<0.5?0.2:0.22);}
  for(let k=0;k<14;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'110,80,48',0.2);}               /* needle duff / bare earth */
  for(let k=0;k<10;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'215,200,120',0.16);}              /* sun-dried grass */
  for(let k=0;k<7;k++){const p=[bx[0]+r()*bx[2],bx[1]+r()*bx[3]*0.45],w=R*(0.35+r()*0.5);soft(p[0],p[1],w,w*0.4,'240,246,250',0.28);}   /* frost near the range */
  for(let k=0;k<90;k++){const p=pt(),a=r()*3.14,l=R*(0.03+r()*0.04);TH.ln(c,[p[0],p[1]],[p[0]+Math.cos(a)*l,p[1]+Math.sin(a)*l*0.5],r()<0.5?'rgba(104,70,40,.55)':'rgba(130,92,52,.5)',R*0.008);}   /* pine needles */
  for(let k=0;k<150;k++){const p=pt(),h=R*(0.05+r()*0.06);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#a3a850','#8d9a46','#b8b660'][(k+j)%3],R*0.011);}
  for(let k=0;k<40;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.011,R*0.009,['#f6efe0','#f2c230','#8a5ac8','#e86a3a','#7f9af0'][k%5]);}
  for(let k=0;k<26;k++){const p=pt();TH.ell(c,p[0],p[1],R*(0.015+r()*0.012),R*0.01,'rgba(150,154,160,.6)');}
  c.restore();c.restore();
}
const FRONTIER_THEME={id:'frontier',assets:FRONTIER_ASSETS,plan:getFrontierPlan,ground:frontierGround,groundCol:'#7f8b55',top:1.45};
const FRONTIER_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
function bakeLandFrontier(shape,tier,R,opts){return bakeLandTheme(FRONTIER_THEME,shape,tier,R,opts);}
function drawLandFrontierBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandFrontierFront(ctx,x,y,land){land.sprites.slice().sort((a,b)=>a.y-b.y).forEach(s=>drawScenicSprite(ctx,s,x+s.x,y+s.y));}
function landFrontierSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}


return Object.freeze({bake: bakeLandFrontier, drawBack: drawLandFrontierBack, drawFront: drawLandFrontierFront});
})(),
  german: (() => {

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

/* ===== BAVARIAN ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const BSH=(c,x,y,rx)=>{c.fillStyle='rgba(40,56,24,.26)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const BBLUE='#2a6ab0',BWHITE='#f6f3ea',BWOOD='#8a5a33',BWOOD_D='#5a3a22',BCREAM='#f4ecd8';
const BBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.26),shade(col,0.12));
const BFLIP=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
const BPATH=(c,pts)=>{pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();};
/* a small blue-and-white chequered flag on a pole (the Bavarian lozenge look) */
const BFLAG=(c,x,y,u,s)=>{TH.ln(c,[x,y],[x,y-u*1.8*s],'#5a3a22',u*0.07*s);const fx=x+u*0.05*s,fy=y-u*1.75*s,w=u*0.9*s,h=u*0.55*s,n=4;for(let i=0;i<n;i++)for(let j=0;j<2;j++){TH.poly(c,[[fx+i*w/n,fy+j*h/2+Math.sin(i)*u*0.03],[fx+(i+1)*w/n,fy+j*h/2+Math.sin(i+1)*u*0.03],[fx+(i+1)*w/n,fy+(j+1)*h/2+Math.sin(i+1)*u*0.03],[fx+i*w/n,fy+(j+1)*h/2+Math.sin(i)*u*0.03]],(i+j)%2?BWHITE:BBLUE);}};
const BHEART=(c,x,y,r,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(x,y+r*0.9);c.bezierCurveTo(x-r*1.6,y-r*0.2,x-r*0.7,y-r*1.2,x,y-r*0.4);c.bezierCurveTo(x+r*0.7,y-r*1.2,x+r*1.6,y-r*0.2,x,y+r*0.9);c.fill();};
const BFCON=(c,x,y,u,o,r)=>{const h=u*o.h,w=u*o.w,n=o.tiers,bare=o.bare===undefined?0.16:o.bare;TH.ln(c,[x,y],[x,y-h*(bare+0.1)],'#5a3b22',u*(o.tw||0.42));for(let i=0;i<n;i++){const t=i/n,ww=w*(1-0.8*t)*(0.92+r()*0.16),yb=y-h*(bare+(0.9-bare)*t),tip=yb-h*(o.layer||0.34);TH.poly(c,[[x-ww,yb],[x-ww*0.55,yb-h*0.032],[x-ww*0.2,yb+h*0.012],[x+ww*0.25,yb-h*0.032],[x+ww*0.6,yb+h*0.01],[x+ww,yb],[x,tip]],o.c1);TH.poly(c,[[x,tip],[x+ww,yb],[x+ww*0.6,yb+h*0.01],[x+ww*0.25,yb-h*0.032],[x,yb]],o.c2);}};
/* ---- cheerful houses: one parametric body, 4 orientations (gable/eave front x mirror), balconies with geraniums, heart shutters ---- */
const BHOUSE_T={
  farmhouse:{ha:1.35,hb:1.95,h1:1.5,h2:1.2,jet:0.1,lower:'#f6efdc',upper:'#f6efdc',timber:'#6a4428',roof:'#8a5a3a',roofD:'#6a4028',rise:1.25,ov:0.6,style:'farm',sw:3.3,sh:1.0},
  chalet:{ha:1.25,hb:1.8,h1:1.4,h2:1.4,jet:0.18,lower:'#efe4cc',upper:'#9a6a40',timber:'#5a3a22',roof:'#7a5034',roofD:'#5a3822',rise:1.4,ov:0.7,style:'chalet',sw:3.0,sh:0.95},
  paintedHouse:{ha:1.3,hb:1.8,h1:1.5,h2:1.3,jet:0.0,lower:'PASTEL',upper:'PASTEL',timber:'#f6f3ea',roof:'#c0553a',roofD:'#9a3f2a',rise:1.9,ov:0.4,style:'painted',sw:3.0,sh:0.95}
};
const BPASTEL=['#f6dc8a','#f2b8b0','#b8d6ea','#cfe6bc','#f4c8a0','#e8d0ec'],BSHUT=['#2f7a4a','#2a6ab0','#b5362b','#2f7a4a'];
function BHOUSE_BODY(c,x,y,u,s,eave,T){const r=mulberry(s*7+3),Iw=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),L=(a,b,z)=>eave?Iw(b,a,z):Iw(a,b,z),LBOX=(a0,a1,b0,b1,z0,z1,col)=>eave?BBOX(c,x,y,u,b0,b1,a0,a1,z0,z1,col):BBOX(c,x,y,u,a0,a1,b0,b1,z0,z1,col);
  const pastel=BPASTEL[s%BPASTEL.length],lower=T.lower==='PASTEL'?pastel:T.lower,upper=T.upper==='PASTEL'?pastel:T.upper,shut=BSHUT[s%4];
  const ha=T.ha,hb=T.hb,jet=T.jet,ha2=ha+jet,hb2=hb+jet,zw=T.h1+T.h2,zr=zw+T.rise;
  const faces=(aa,bb)=>[{J:(a,z)=>L(a,bb+0.012,z),p0:-aa,p1:aa},{J:(b,z)=>L(aa+0.012,b,z),p0:-bb,p1:bb}];
  const F1=faces(ha,hb)[0],F2=faces(ha,hb)[1],G1=faces(ha2,hb2)[0],G2=faces(ha2,hb2)[1];
  LBOX(-ha,ha,-hb,hb,0,T.h1,lower);LBOX(-ha2,ha2,-hb2,hb2,T.h1,zw,upper);
  const quad=(F,p0,p1,z0,z1,col,stroke)=>TH.poly(c,[F.J(p0,z0),F.J(p1,z0),F.J(p1,z1),F.J(p0,z1)],col,stroke,stroke?u*0.05:0);
  /* trim: timber corner posts and a story band; boards on a chalet; a blue lozenge frieze under the eaves */
  [G1,G2].forEach(F=>{if(T.style==='chalet'){for(let k=0;k<12;k++){const p=F.p0+(F.p1-F.p0)*k/12;TH.ln(c,F.J(p,T.h1),F.J(p,zw),'rgba(40,24,12,.35)',u*0.05);}}
    quad(F,F.p0,F.p1,T.h1-0.05,T.h1+0.09,T.timber);TH.ln(c,F.J(F.p0,T.h1),F.J(F.p0,zw),T.timber,u*0.12);TH.ln(c,F.J(F.p1,T.h1),F.J(F.p1,zw),T.timber,u*0.12);
    const nL=Math.round((F.p1-F.p0)/0.28);for(let k=0;k<nL;k++){const p=F.p0+(F.p1-F.p0)*(k+0.5)/nL,w=(F.p1-F.p0)/nL*0.4;TH.poly(c,[F.J(p-w,zw-0.1),F.J(p,zw-0.2),F.J(p+w,zw-0.1),F.J(p,zw)],k%2?BBLUE:BWHITE);}});
  [F1,F2].forEach(F=>{TH.ln(c,F.J(F.p0,0),F.J(F.p0,T.h1),T.timber,u*0.12);TH.ln(c,F.J(F.p1,0),F.J(F.p1,T.h1),T.timber,u*0.12);});
  /* windows with coloured shutters (heart cut-outs) and geranium boxes */
  const win=(F,p,z0,h,lit)=>{const w=0.24;quad(F,p-w,p+w,z0,z0+h,lit?'#ffe9a0':'#86a8c0',BWHITE);TH.ln(c,F.J(p,z0),F.J(p,z0+h),BWHITE,u*0.05);TH.ln(c,F.J(p-w,z0+h*0.55),F.J(p+w,z0+h*0.55),BWHITE,u*0.05);quad(F,p-w-0.2,p-w,z0-0.02,z0+h+0.02,shut,'rgba(0,0,0,.25)');quad(F,p+w,p+w+0.2,z0-0.02,z0+h+0.02,shut,'rgba(0,0,0,.25)');
    [p-w-0.1,p+w+0.1].forEach(q=>{const hp=F.J(q,z0+h*0.62);BHEART(c,hp[0],hp[1],u*0.07,'#fdf3da');});quad(F,p-w-0.04,p+w+0.04,z0-0.2,z0-0.02,BWOOD);for(let k=0;k<5;k++){const gp=F.J(p-w+0.04+k*(2*w-0.08)/4,z0-0.12);TH.blob(c,gp[0],gp[1]-u*0.08,u*0.12,u*0.1,k%2?'#d9433b':'#e8607a',r,6);}};
  const doorF=eave?F2:F1,otherF=eave?F1:F2,doorG=eave?G2:G1,otherG=eave?G1:G2;
  quad(doorF,-0.34,0.34,0,1.15,BWOOD_D,T.timber);quad(doorF,-0.26,0.26,0.05,1.1,BWOOD);TH.ell(c,...doorF.J(0.18,0.6),u*0.05,u*0.05,'#e8c84a');TH.poly(c,[doorF.J(-0.45,1.15),doorF.J(0.45,1.15),doorF.J(0.35,1.35),doorF.J(-0.35,1.35)],T.roof);
  const sp=doorF.p1*0.62;win(doorF,-sp,0.55,0.7,r()<0.6);win(doorF,sp,0.55,0.7,r()<0.6);win(otherF,-otherF.p1*0.45,0.55,0.7,r()<0.6);win(otherF,otherF.p1*0.45,0.55,0.7,r()<0.6);
  win(otherG,0,T.h1+0.25,0.75,r()<0.6);if(T.style!=='farm'||true){win(otherG,-otherG.p1*0.55,T.h1+0.25,0.75,r()<0.5);win(otherG,otherG.p1*0.55,T.h1+0.25,0.75,r()<0.5);}
  /* balcony across the front of the upper floor, brimming with geraniums */
  {const bz=T.h1,bw=eave?hb2*0.8:ha2*0.8,ext=0.5;
    if(eave){LBOX(ha2,ha2+ext,-bw,bw,bz-0.1,bz+0.05,BWOOD);}else{LBOX(-bw,bw,hb2,hb2+ext,bz-0.1,bz+0.05,BWOOD);}
    const J=(a,z)=>eave?L(ha2+ext,a,z):L(a,hb2+ext,z);for(let k=0;k<=8;k++){const p=-bw+2*bw*k/8;TH.ln(c,J(p,bz+0.05),J(p,bz+0.55),BWOOD_D,u*0.07);}TH.ln(c,J(-bw,bz+0.55),J(bw,bz+0.55),BWOOD_D,u*0.09);TH.ln(c,J(-bw,bz+0.3),J(bw,bz+0.3),BWOOD_D,u*0.06);
    for(let k=0;k<12;k++){const p=-bw+2*bw*(k+0.5)/12,q=J(p,bz+0.62);TH.blob(c,q[0],q[1]-u*0.05,u*0.15,u*0.12,k%3?'#d9433b':'#f08aa0',r,6);}}
  /* low, wide roof with a deep overhang, shingle rows, gable boards and a little flag */
  const ch=T.style==='painted'?0.9:1.0;LBOX(-ha*0.6,-ha*0.6+0.5,-hb*0.6,-hb*0.6+0.5,zw+0.2,zr+0.8,'#f0e6d2');{const cp=L(-ha*0.6+0.25,-hb*0.6+0.25,zr+0.9);TH.ell(c,cp[0],cp[1],u*0.3,u*0.14,'#6a4028');c.fillStyle='rgba(240,240,246,.55)';for(let k=0;k<3;k++){c.beginPath();c.ellipse(cp[0]+k*u*0.14,cp[1]-u*(0.5+k*0.5),u*(0.3+k*0.1),u*0.2,0,0,7);c.fill();}}
  const ov=T.ov,rA=L(ha2+ov,-hb2-ov,zw),rB=L(ha2+ov,hb2+ov,zw),rC=L(0,hb2+ov,zr),rD=L(0,-hb2-ov,zr);TH.poly(c,[rA,rB,rC,rD],T.roof);
  const rows=Math.max(5,Math.round(T.rise/0.24));for(let k=1;k<rows;k++){const t=k/rows;TH.ln(c,L(ha2+ov-(ha2+ov)*t,-hb2-ov,zw+T.rise*t),L(ha2+ov-(ha2+ov)*t,hb2+ov,zw+T.rise*t),'rgba(30,14,6,.3)',u*0.05);}
  for(let k=0;k<12;k++){const t=0.1+r()*0.8,bb=-hb2-ov+r()*(hb2+ov)*2,p=L((ha2+ov)*(1-t),bb,zw+T.rise*t);TH.ell(c,p[0],p[1],u*0.16,u*0.08,r()<0.5?shade(T.roof,0.08):shade(T.roof,-0.1));}
  const gA=L(-ha2,hb2+0.02,zw),gB=L(ha2,hb2+0.02,zw),gC=L(0,hb2+0.02,zr-0.1);TH.poly(c,[gA,gB,gC],T.style==='painted'?shade(upper,0.04):(T.style==='chalet'?'#9a6a40':'#efe6d2'));
  for(let k=1;k<7;k++){const t=k/7;TH.ln(c,L(-ha2*(1-t)*0.98,hb2+0.03,zw+0.02),L(-ha2*(1-t)*0.98,hb2+0.03,zw+(zr-zw)*(1-t)*0.9),'rgba(60,36,16,.3)',u*0.05);TH.ln(c,L(ha2*(1-t)*0.98,hb2+0.03,zw+0.02),L(ha2*(1-t)*0.98,hb2+0.03,zw+(zr-zw)*(1-t)*0.9),'rgba(60,36,16,.3)',u*0.05);}
  const gcp=L(0,hb2+0.04,zw+(zr-zw)*0.42);TH.ell(c,gcp[0],gcp[1],u*0.24,u*0.26,'#ffe9a0','#fff',u*0.05);BHEART(c,gcp[0],gcp[1]+u*0.5,u*0.12,'#c0392b');
  TH.ln(c,L(-ha2-ov,hb2+ov,zw),L(0,hb2+ov,zr),T.timber,u*0.12);TH.ln(c,L(ha2+ov,hb2+ov,zw),L(0,hb2+ov,zr),T.timber,u*0.12);TH.ln(c,rD,rC,shade(T.roof,-0.2),u*0.1);
  const fp=L(0,hb2+ov-0.1,zr);BFLAG(c,fp[0],fp[1],u,1.0);}
const BHOUSE=(key)=>({cat:'struct',rho:0.14,draw(c,x,y,u,v){const T=BHOUSE_T[key],o=v&3,s=v>>2,eave=(o>>1)&1;c.fillStyle='rgba(40,56,24,.26)';c.beginPath();c.ellipse(x+u*0.8,y+u*0.2,u*T.sw*(eave?1.2:1),u*T.sh,0,0,7);c.fill();BFLIP(c,x,o&1,()=>BHOUSE_BODY(c,x,y,u,s,eave,T));}});
const BAV_AUTUMN=[['#e8892a','#f0a03a','#d46a1e','#f6b84a'],['#c8402a','#d9553a','#b0301e','#e86a4a'],['#e0b83a','#f0cc4a','#d0a42a','#f6dc6a'],['#8fbf4a','#a6d05a','#78ab3c','#bcdc72']];
const BAV_GREEN=[['#5fa844','#72bb52','#4f9638','#86cc62'],['#4f9a48','#62ae58','#438a3c','#78c26a'],['#6aae4a','#7ec25a','#5a9a3e','#92d46e']];
const BAVARIAN_ASSETS={
  /* ---------- trees: fresh greens with early-autumn colour ---------- */
  spruce:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*13+1);BSH(c,x,y,u*1.3);BFCON(c,x,y,u,{h:5.6+r()*1.4,w:1.25,tiers:8,c1:'#2f7048',c2:'#235a38',layer:0.3},r);}},
  fir:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*17+4);BSH(c,x,y,u*1.8);BFCON(c,x,y,u,{h:3.9+r()*0.9,w:1.75,tiers:5,c1:'#3a8050',c2:'#2a6640',layer:0.4,bare:0.1},r);}},
  youngSpruce:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*29+3);BSH(c,x,y,u*1.2);BFCON(c,x,y,u,{h:2.7+r()*0.9,w:1.1,tiers:4,c1:'#42905a',c2:'#307448',layer:0.42,bare:0.08,tw:0.3},r);}},
  beech:{cat:'tree',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*7+1),H=u*(4.4+r()*1.1),pal=v%4===0?BAV_AUTUMN[2]:v%4===1?BAV_AUTUMN[3]:BAV_GREEN[v%3];BSH(c,x,y,u*2.3);c.lineCap='round';c.strokeStyle='#7a7468';c.lineWidth=u*0.7;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.1,y-H*0.35,x+u*0.05,y-H*0.6);c.stroke();TH.ln(c,[x-u*0.15,y],[x-u*0.1,y-H*0.55],'#9a948a',u*0.14);TH.ln(c,[x,y-H*0.5],[x-u*1.1,y-H*0.82],'#7a7468',u*0.3);TH.ln(c,[x,y-H*0.55],[x+u*1.2,y-H*0.8],'#7a7468',u*0.3);const cy=y-H*0.82;[[0,-0.3,1.9,1.15],[-1.55,-0.1,1.25,0.95],[1.55,-0.1,1.25,0.95],[-0.8,-1.1,1.4,0.95],[0.85,-1.1,1.4,0.95],[0,-1.6,1.1,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,10));}},
  linden:{cat:'tree',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*5+3),H=u*(4.8+r()*0.9),pal=BAV_GREEN[(v+1)%3];BSH(c,x,y,u*2.4);TH.ln(c,[x,y],[x,y-H*0.55],'#6a5238',u*0.8);TH.ln(c,[x,y-H*0.4],[x-u*1.0,y-H*0.78],'#6a5238',u*0.3);TH.ln(c,[x,y-H*0.45],[x+u*1.1,y-H*0.8],'#6a5238',u*0.3);const cy=y-H*0.8;[[0,-0.3,2.1,1.25],[-1.7,0.05,1.3,1.0],[1.7,0.05,1.3,1.0],[-0.9,-1.15,1.5,1.0],[0.95,-1.15,1.5,1.0],[0,-1.7,1.2,0.85]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,10));for(let k=0;k<8;k++)TH.ell(c,x+(r()-0.5)*u*3.2,cy+(r()-0.5)*u*1.8,u*0.1,u*0.08,'#f6e88a');}},
  birch:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*17+4),H=u*(4.4+r()*1.0),pal=v%3===0?BAV_AUTUMN[2]:['#9cc060','#86ae4f','#b0d070','#78a444'];BSH(c,x,y,u*1.7);c.lineCap='round';c.strokeStyle='#ece8dc';c.lineWidth=u*0.46;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.12,y-H*0.4,x+u*0.05,y-H*0.7);c.stroke();for(let k=0;k<8;k++)TH.ln(c,[x-u*0.2,y-H*(0.06+k*0.08)],[x+u*0.1,y-H*(0.06+k*0.08)+u*0.05],'rgba(40,36,30,.55)',u*0.07);TH.ln(c,[x,y-H*0.55],[x-u*0.8,y-H*0.85],'#ece8dc',u*0.2);TH.ln(c,[x,y-H*0.6],[x+u*0.9,y-H*0.82],'#ece8dc',u*0.2);const cy=y-H*0.85;[[0,-0.5,1.3,1.0],[-1.0,-0.1,1.0,0.85],[1.0,-0.1,1.0,0.85],[-0.5,-1.15,1.0,0.8],[0.6,-1.1,1.0,0.8],[0,0.2,1.2,0.7]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,9));}},
  appleTree:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*23+1),H=u*(3.3+r()*0.6),pal=BAV_GREEN[v%3];BSH(c,x,y,u*1.9);c.lineCap='round';c.strokeStyle='#5a3f26';c.lineWidth=u*0.5;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+u*0.1,y-H*0.4,x,y-H*0.6);c.stroke();TH.ln(c,[x,y-H*0.4],[x-u*0.8,y-H*0.7],'#5a3f26',u*0.22);TH.ln(c,[x,y-H*0.45],[x+u*0.8,y-H*0.72],'#5a3f26',u*0.22);const cy=y-H*0.8;[[0,-0.2,1.6,1.0],[-1.2,0.1,1.0,0.8],[1.2,0.1,1.0,0.8],[-0.5,-0.9,1.0,0.8],[0.6,-0.9,1.0,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,9));for(let k=0;k<10;k++)TH.ell(c,x+(r()-0.5)*u*2.6,cy+u*(-0.9+r()*1.7),u*0.14,u*0.14,'#d9433b');}},
  maple:{cat:'tree',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*7+5),H=u*(4.2+r()*1.0),pal=BAV_AUTUMN[v%3];BSH(c,x,y,u*2.2);c.lineCap='round';c.strokeStyle='#6a5238';c.lineWidth=u*0.65;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.1,y-H*0.35,x+u*0.05,y-H*0.6);c.stroke();TH.ln(c,[x,y-H*0.5],[x-u*1.0,y-H*0.82],'#6a5238',u*0.28);TH.ln(c,[x,y-H*0.55],[x+u*1.1,y-H*0.8],'#6a5238',u*0.28);const cy=y-H*0.82;[[0,-0.3,1.8,1.1],[-1.5,-0.05,1.2,0.95],[1.5,-0.05,1.2,0.95],[-0.8,-1.05,1.3,0.9],[0.85,-1.05,1.3,0.9],[0,-1.55,1.0,0.75]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,10));}},
  /* ---------- undergrowth ---------- */
  geraniumBush:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+9);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(40,56,24,.2)');[[-0.55,-0.45,0.8,0.55],[0.55,-0.45,0.8,0.55],[0,-0.85,0.85,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#4f9a44','#5fae52','#3f8a3a'][i],r,8));for(let k=0;k<11;k++)TH.ell(c,x+(r()-0.5)*u*1.6,y-u*(0.3+r()*0.9),u*0.13,u*0.11,k%3?'#d9433b':'#f08aa0');}},
  wildflowers:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*7+2);TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.28,'rgba(40,56,24,.2)');for(let k=0;k<12;k++){const fx=x+(r()-0.5)*u*1.6,fy=y-r()*u*0.5;TH.ln(c,[fx,fy],[fx,fy-u*(0.4+r()*0.4)],'#5f9a45',u*0.06);}for(let k=0;k<13;k++){const fx=x+(r()-0.5)*u*1.6,fy=y-u*(0.5+r()*0.8);TH.ell(c,fx,fy,u*0.13,u*0.11,['#f2c230','#f6efe0','#6a8ae8','#d9433b','#f4a6cb'][k%5]);TH.ell(c,fx,fy,u*0.05,u*0.05,'#fff0a0');}}},
  sunflowers:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.28,'rgba(40,56,24,.2)');for(let k=0;k<4;k++){const fx=x+(k-1.5)*u*0.42,h=u*(1.6+r()*0.9);TH.ln(c,[fx,y],[fx+(r()-0.5)*u*0.2,y-h],'#4f8a3a',u*0.1);TH.ell(c,fx,y-u*0.7,u*0.35,u*0.18,'#4f8a3a',0.3);const hx=fx+(r()-0.5)*u*0.1,hy=y-h;for(let j=0;j<10;j++){const a=j/10*6.283;TH.ell(c,hx+Math.cos(a)*u*0.28,hy+Math.sin(a)*u*0.28,u*0.13,u*0.08,'#f2c230',a);}TH.ell(c,hx,hy,u*0.2,u*0.2,'#5a3a1a');}}},
  hedge:{cat:'shrub',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*3+7),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.3,y+u*0.1,u*2.0,u*0.4,'rgba(40,56,24,.2)');const cols=['#4f9a44','#5fae52','#3f8a3a'];for(let k=0;k<6;k++){const X=-1.5+k*0.6;TH.blob(c,...I(X,0,0.5),u*0.55,u*0.5,cols[k%3],r,8);}for(let k=0;k<8;k++)TH.ell(c,...I(-1.6+r()*3.2,0.2,0.9+r()*0.3),u*0.08,u*0.07,v%2?'#f6efe0':'#e86a8a');}},
  grassTuft:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);for(let k=0;k<13;k++){const a=-1.1+k/12*2.2+(r()-0.5)*0.2,l=u*(0.7+r()*0.8);TH.ln(c,[x+(r()-0.5)*u*0.6,y],[x+Math.sin(a)*l*0.8+(r()-0.5)*u*0.3,y-l],['#78b856','#68a84a','#92cc6a'][k%3],u*0.09);}}},
  fern:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(40,56,24,.2)');for(let k=0;k<9;k++){const a=-Math.PI+0.15+k/8*(Math.PI-0.3),len=u*(1.1+r()*0.45),ex=x+Math.cos(a)*len,ey=y-u*0.1+Math.sin(a)*len*0.6+len*0.4;c.lineCap='round';c.strokeStyle=k%2?'#4a9a44':'#3a8a38';c.lineWidth=u*0.4;c.beginPath();c.moveTo(x,y-u*0.1);c.quadraticCurveTo(x+Math.cos(a)*len*0.55,y-u*0.1+Math.sin(a)*len*0.7-len*0.25,ex,ey);c.stroke();}}},
  stones:{cat:'rock',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.8,'#a8a8a0'],[0.7,0.2,0.8,0.7,'#b6b6ae'],[0,-0.35,0.7,0.6,'#989890']].forEach(([dx,dy,rx,ry,col])=>{const px=x+dx*u,py=y+dy*u,sx=u*rx,sy=u*ry*(1+r()*0.2);TH.ell(c,px+sx*0.15,py+sy*0.3,sx*1.05,sy*0.45,'rgba(40,56,24,.25)');TH.poly(c,[[px-sx,py],[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px-sx*0.6,py+sy*0.2]],col);TH.poly(c,[[px+sx*0.25,py-sy*0.98],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px+sx*0.2,py+sy*0.05]],shade(col,-0.25));TH.poly(c,[[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.1,py-sy*0.5],[px-sx*0.5,py-sy*0.45]],'#7aaa52');});}},
  /* ---------- homes ---------- */
  farmhouse:BHOUSE('farmhouse'),chalet:BHOUSE('chalet'),paintedHouse:BHOUSE('paintedHouse'),
  /* ---------- the one tower: a small onion-dome chapel beside the homes ---------- */
  chapel:{cat:'struct',rho:0.12,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);c.fillStyle='rgba(40,56,24,.26)';c.beginPath();c.ellipse(x+u*0.9,y+u*0.2,u*3.2,u*1.0,0,0,7);c.fill();BFLIP(c,x,v&1,()=>{
      BBOX(c,x,y,u,-2.2,0.9,-1.0,1.0,0,1.9,'#f6f0e0');for(let k=0;k<3;k++){const X=-1.6+k*0.9;const pts=[I(X-0.2,1.01,0.6),I(X+0.2,1.01,0.6),I(X+0.2,1.01,1.3),I(X,1.01,1.55),I(X-0.2,1.01,1.3)];TH.poly(c,pts,'#86a8d0','#fff',u*0.05);}
      TH.poly(c,[I(1.5,-1.15,1.9),I(1.5,1.15,1.9),I(-2.4,1.15,1.9),I(-2.4,-1.15,1.9)].slice(0,0),'#c0553a');TH.poly(c,[I(-2.35,1.2,1.9),I(0.95,1.2,1.9),I(0.95,0,3.0),I(-2.35,0,3.0)],'#c0553a');for(let k=1;k<5;k++)TH.ln(c,I(-2.35,1.2-0.24*k,1.9+0.22*k),I(0.95,1.2-0.24*k,1.9+0.22*k),'rgba(60,20,10,.3)',u*0.05);
      BBOX(c,x,y,u,0.9,2.3,-0.75,0.75,0,4.3,'#f6f0e0');TH.poly(c,[I(1.4,0.76,0),I(1.8,0.76,0),I(1.8,0.76,1.2),I(1.6,0.76,1.4),I(1.4,0.76,1.2)].slice(0,5),BWOOD_D);
      const cf=I(1.6,0.76,3.0);c.fillStyle='#fff';c.beginPath();c.ellipse(cf[0],cf[1],u*0.42,u*0.5,0,0,7);c.fill();c.strokeStyle='#2a2a30';c.lineWidth=u*0.07;c.stroke();TH.ln(c,cf,[cf[0],cf[1]-u*0.3],'#2a2a30',u*0.06);TH.ln(c,cf,[cf[0]+u*0.22,cf[1]],'#2a2a30',u*0.06);
      BBOX(c,x,y,u,0.8,2.4,-0.85,0.85,4.3,4.5,'#d8d2c0');BBOX(c,x,y,u,0.95,2.25,-0.7,0.7,4.5,5.4,'#f6f0e0');[1.3,1.95].forEach(X=>{const pts=[I(X-0.22,0.71,4.55),I(X+0.22,0.71,4.55),I(X+0.22,0.71,5.0),I(X,0.71,5.3),I(X-0.22,0.71,5.0)];TH.poly(c,pts,'#2a2a30');});
      const b=I(1.6,0,5.4),t=I(1.6,0,8.4),rr=u*1.25;const g=c.createLinearGradient(b[0]-rr,0,b[0]+rr,0);g.addColorStop(0,'#5fc09a');g.addColorStop(0.55,'#3d8a6a');g.addColorStop(1,'#2a6650');c.fillStyle=g;c.beginPath();c.moveTo(b[0]-rr*0.9,b[1]);c.bezierCurveTo(b[0]-rr*1.5,b[1]-u*0.9,b[0]-rr*0.7,b[1]-u*1.6,b[0]-rr*0.2,b[1]-u*2.3);c.quadraticCurveTo(b[0],b[1]-u*2.7,t[0],t[1]);c.quadraticCurveTo(b[0],b[1]-u*2.7,b[0]+rr*0.2,b[1]-u*2.3);c.bezierCurveTo(b[0]+rr*0.7,b[1]-u*1.6,b[0]+rr*1.5,b[1]-u*0.9,b[0]+rr*0.9,b[1]);c.closePath();c.fill();
      TH.ell(c,t[0],t[1]+u*0.1,u*0.2,u*0.2,'#e8c84a');TH.ln(c,[t[0],t[1]],[t[0],t[1]-u*0.9],'#e8c84a',u*0.1);TH.ln(c,[t[0]-u*0.3,t[1]-u*0.55],[t[0]+u*0.3,t[1]-u*0.55],'#e8c84a',u*0.1);BFLAG(c,I(-1.0,0,3.0)[0],I(-1.0,0,3.0)[1],u,0.9);});}},
  /* ---------- Oktoberfest pieces ---------- */
  beerTent:{cat:'struct',rho:0.16,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);c.fillStyle='rgba(40,56,24,.26)';c.beginPath();c.ellipse(x+u*1.0,y+u*0.25,u*4.2,u*1.3,0,0,7);c.fill();BFLIP(c,x,v&1,()=>{
      BBOX(c,x,y,u,-2.7,2.7,-1.7,1.7,0,0.16,'#b08a5a');TH.poly(c,[I(-2.7,-1.7,0.16),I(2.7,-1.7,0.16),I(2.7,-1.7,2.1),I(-2.7,-1.7,2.1)],'#4a3424');
      [-0.6,0.9].forEach((Y,k)=>{BBOX(c,x,y,u,-2.3,2.3,Y-0.28,Y+0.28,0.16,0.78,'#a67a48');BBOX(c,x,y,u,-2.3,2.3,Y-0.75,Y-0.4,0.16,0.5,'#8a5a33');BBOX(c,x,y,u,-2.3,2.3,Y+0.4,Y+0.75,0.16,0.5,'#8a5a33');for(let s=0;s<9;s++){const X=-2.0+s*0.5,p=I(X,Y,0.78);TH.ell(c,p[0],p[1],u*0.09,u*0.07,'#f2c230');TH.ell(c,p[0],p[1]-u*0.08,u*0.09,u*0.04,'#fff6d8');}});
      [-2.7,-0.9,0.9,2.7].forEach(X=>{TH.ln(c,I(X,1.7,0.16),I(X,1.7,2.1),'#5a3a22',u*0.16);});
      const n=14,sw=5.6/n;for(let i=0;i<n;i++){const X0=-2.8+i*sw,X1=X0+sw;TH.poly(c,[I(X0,1.85,2.1),I(X1,1.85,2.1),I(X1,0,3.7),I(X0,0,3.7)],i%2?BWHITE:BBLUE);}
      TH.poly(c,[I(2.8,-1.85,2.1),I(2.8,1.85,2.1),I(2.8,0,3.7)],BWHITE);const rows=5;for(let rw=0;rw<rows;rw++){const zc=2.4+rw*0.25,half=(1.85)*(1-(zc-2.1)/1.6)*0.92;for(let k=-3;k<=3;k++){const Y=k*0.5;if(Math.abs(Y)>half)continue;TH.poly(c,[I(2.81,Y-0.2,zc),I(2.81,Y,zc+0.12),I(2.81,Y+0.2,zc),I(2.81,Y,zc-0.12)],(k+rw)%2?BBLUE:BWHITE);}}
      TH.ln(c,I(-2.8,0,3.7),I(2.8,0,3.7),BBLUE,u*0.14);TH.ln(c,I(-2.8,1.85,2.1),I(2.8,1.85,2.1),BWOOD_D,u*0.12);
      const cols=[BBLUE,BWHITE,'#d9433b','#f2c230'];let prev=null;for(let k=0;k<=16;k++){const X=-2.8+5.6*k/16,p=I(X,1.9,2.0-Math.sin(k/16*Math.PI)*0.0-0.05);if(prev)TH.ln(c,prev,p,'#d9d4c2',u*0.04);prev=p;if(k<16){const q=I(X+0.17,1.9,2.0);TH.poly(c,[[q[0]-u*0.2,q[1]],[q[0]+u*0.2,q[1]],[q[0],q[1]+u*0.55]],cols[k%4]);}}
      const f1=I(-2.6,0,3.7),f2=I(2.6,0,3.7);BFLAG(c,f1[0],f1[1],u,1.1);BFLAG(c,f2[0],f2[1],u,1.1);});}},
  marketStall:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*7+3),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),k=v%3,awn=k===1?['#c0392b',BWHITE]:[BBLUE,BWHITE];BFLIP(c,x,(v>>2)&1,()=>{BSH(c,x,y,u*2.2);
      TH.poly(c,[I(-1.5,-0.7,0),I(1.5,-0.7,0),I(1.5,-0.7,2.2),I(-1.5,-0.7,2.2)],'#6a4a30');for(let i=0;i<5;i++)TH.ln(c,I(-1.5+i*0.75,-0.69,0.2),I(-1.5+i*0.75,-0.69,2.1),'rgba(30,16,8,.3)',u*0.05);
      [-1.5,1.5].forEach(X=>[-0.7,0.7].forEach(Y=>TH.ln(c,I(X,Y,0),I(X,Y,2.2),BWOOD_D,u*0.14)));BBOX(c,x,y,u,-1.5,1.5,0.1,0.7,0.2,0.95,'#a67a48');BBOX(c,x,y,u,-1.55,1.55,0.05,0.75,0.95,1.05,'#c9a066');
      for(let i=0;i<6;i++){const p=I(-1.2+i*0.5,0.4,1.05);if(k===0){c.strokeStyle='#a8652a';c.lineWidth=u*0.1;c.beginPath();c.ellipse(p[0],p[1]-u*0.18,u*0.22,u*0.16,0,0,7);c.stroke();TH.ln(c,[p[0]-u*0.12,p[1]-u*0.1],[p[0]+u*0.12,p[1]-u*0.26],'#a8652a',u*0.09);}else if(k===1){BHEART(c,p[0],p[1]-u*0.25,u*0.2,'#c0392b');TH.ln(c,[p[0]-u*0.1,p[1]-u*0.3],[p[0]+u*0.1,p[1]-u*0.3],'#fdf3da',u*0.04);}else{TH.ln(c,[p[0]-u*0.2,p[1]-u*0.1],[p[0]+u*0.2,p[1]-u*0.2],'#b0583a',u*0.17);TH.ln(c,[p[0]-u*0.2,p[1]-u*0.3],[p[0]+u*0.2,p[1]-u*0.4],'#c96a4a',u*0.15);}}
      const n=10,aw=3.2/n;for(let i=0;i<n;i++){const X0=-1.6+i*aw,X1=X0+aw;TH.poly(c,[I(X0,1.0,2.0),I(X1,1.0,2.0),I(X1,-0.7,2.7),I(X0,-0.7,2.7)],awn[i%2]);const e=I(X0+aw/2,1.0,2.0);c.fillStyle=awn[i%2];c.beginPath();c.ellipse(e[0],e[1],u*0.22,u*0.16,0,0,Math.PI);c.fill();}
      TH.ln(c,I(-1.6,1.0,2.0),I(1.6,1.0,2.0),'rgba(30,16,8,.3)',u*0.05);BFLAG(c,I(-1.5,-0.7,2.7)[0],I(-1.5,-0.7,2.7)[1],u,0.8);});}},
  fountain:{cat:'ruin',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*5+9);BSH(c,x,y,u*2.2);const rx=u*1.6,ry=u*0.62;c.fillStyle='#a8a8a0';c.beginPath();c.moveTo(x-rx,y);c.lineTo(x-rx,y-u*0.7);c.ellipse(x,y-u*0.7,rx,ry,0,Math.PI,0,true);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI);c.closePath();c.fill();c.fillStyle='#8a8a82';c.beginPath();c.moveTo(x-rx*0.1,y+ry*0.99);c.lineTo(x-rx*0.1,y-u*0.7+ry*0.99);c.lineTo(x+rx,y-u*0.7);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI);c.closePath();c.fill();TH.ell(c,x,y-u*0.7,rx,ry,'#c0c0b8');TH.ell(c,x,y-u*0.7,rx*0.88,ry*0.82,'#6ab8d8');TH.ell(c,x-rx*0.2,y-u*0.74,rx*0.5,ry*0.35,'rgba(220,245,255,.5)');
      const gr=c.createLinearGradient(x-u*0.35,0,x+u*0.35,0);gr.addColorStop(0,'#c8c8c0');gr.addColorStop(1,'#8a8a82');c.fillStyle=gr;c.fillRect(x-u*0.28,y-u*2.7,u*0.56,u*2.0);TH.ell(c,x,y-u*2.0,u*0.9,u*0.34,'#c0c0b8');TH.ell(c,x,y-u*2.0,u*0.78,u*0.26,'#6ab8d8');TH.ell(c,x,y-u*2.75,u*0.42,u*0.16,'#c0c0b8');
      for(let k=0;k<6;k++){const a=k/6*6.283,ex=x+Math.cos(a)*u*1.1,ey=y-u*0.7+Math.sin(a)*u*0.4;c.strokeStyle='rgba(210,240,255,.85)';c.lineWidth=u*0.07;c.beginPath();c.moveTo(x,y-u*2.9);c.quadraticCurveTo(x+Math.cos(a)*u*0.7,y-u*3.3,ex,ey);c.stroke();}
      for(let k=0;k<4;k++){const a=k/4*6.283+0.4,px=x+Math.cos(a)*rx*0.98,py=y-u*0.7+Math.sin(a)*ry*0.98;TH.ell(c,px,py-u*0.15,u*0.2,u*0.12,'#b5553a');for(let j=0;j<3;j++)TH.ell(c,px+(j-1)*u*0.12,py-u*0.35,u*0.1,u*0.09,j%2?'#d9433b':'#f08aa0');}}},
  shrine:{cat:'ruin',rho:0.04,draw(c,x,y,u,v){const r=mulberry(v*5+9);BFLIP(c,x,v&1,()=>{BSH(c,x,y,u*1.0);TH.ln(c,[x,y],[x,y-u*3.2],BWOOD_D,u*0.34);TH.poly(c,[[x-u*0.7,y-u*2.9],[x+u*0.7,y-u*2.9],[x+u*0.7,y-u*2.0],[x-u*0.7,y-u*2.0]],'#d8c8a8',BWOOD_D,u*0.07);TH.poly(c,[[x-u*0.55,y-u*2.15],[x+u*0.55,y-u*2.15],[x,y-u*2.85]].slice(0,0),'#fff');TH.ln(c,[x,y-u*2.85],[x,y-u*2.15],'#6a4a30',u*0.1);TH.ln(c,[x-u*0.3,y-u*2.6],[x+u*0.3,y-u*2.6],'#6a4a30',u*0.1);
      TH.poly(c,[[x-u*0.95,y-u*2.9],[x+u*0.95,y-u*2.9],[x,y-u*3.8]],'#8a5a3a');TH.poly(c,[[x,y-u*3.8],[x+u*0.95,y-u*2.9],[x+u*0.1,y-u*2.9]],'#6a4028');for(let k=0;k<5;k++)TH.blob(c,x+(k-2)*u*0.28,y+u*0.02,u*0.18,u*0.14,['#d9433b','#f6efe0','#f2c230','#f08aa0','#6a8ae8'][k],r,6);const g=c.createRadialGradient(x,y-u*0.3,0,x,y-u*0.3,u*1.2);g.addColorStop(0,'rgba(255,200,110,.5)');g.addColorStop(1,'rgba(255,200,110,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*0.3,u*1.2,0,7);c.fill();TH.ell(c,x,y-u*0.3,u*0.12,u*0.16,'#ffd870');});}},
  woodshed:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*7+3),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);BFLIP(c,x,v&1,()=>{BSH(c,x,y,u*2.2);BBOX(c,x,y,u,-1.4,1.4,-0.9,0.9,0,0.1,'#8a6a40');TH.poly(c,[I(-1.4,-0.9,0.1),I(1.4,-0.9,0.1),I(1.4,-0.9,1.8),I(-1.4,-0.9,1.8)],'#5a3f26');
      for(let row=0;row<4;row++)for(let k=0;k<9;k++){const X=-1.25+k*0.31+(row%2)*0.12,Z=0.28+row*0.32;const p=I(X,-0.88,Z);TH.ell(c,p[0],p[1],u*0.15,u*0.14,k%2?'#c9a066':'#b98a55');TH.ell(c,p[0],p[1],u*0.07,u*0.06,'#8a5a33');}
      [-1.4,1.4].forEach(X=>[-0.9,0.9].forEach(Y=>TH.ln(c,I(X,Y,0.1),I(X,Y,1.9),BWOOD_D,u*0.16)));TH.poly(c,[I(1.7,-1.2,1.8),I(1.7,1.2,1.8),I(-1.7,1.2,2.4),I(-1.7,-1.2,2.4)].slice(0,0),'#8a5a3a');TH.poly(c,[I(-1.7,1.2,1.7),I(1.7,1.2,1.7),I(1.7,-1.2,2.5),I(-1.7,-1.2,2.5)],'#8a5a3a');for(let k=1;k<6;k++)TH.ln(c,I(-1.7,1.2-0.4*k,1.7+0.16*k),I(1.7,1.2-0.4*k,1.7+0.16*k),'rgba(30,14,6,.3)',u*0.05);
      BBOX(c,x,y,u,0.9,1.4,0.9,1.4,0,0.5,'#8a5a33');TH.ln(c,I(1.15,1.15,0.5),I(1.5,1.4,1.0),'#5a3a22',u*0.1);TH.poly(c,[I(1.45,1.35,1.0),I(1.7,1.4,1.1),I(1.55,1.45,0.85)],'#c0c4cc');});}},
  maypole:{cat:'struct',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*5+9),H=u*9.0;BSH(c,x,y,u*1.8);TH.ell(c,x,y,u*0.9,u*0.3,'#8a6a40');TH.ell(c,x,y-u*0.1,u*0.8,u*0.26,'#a8844a');
      const w=u*0.2;for(let i=0;i<24;i++){const t0=i/24,t1=(i+1)/24,y0=y-H*t0,y1=y-H*t1;TH.poly(c,[[x-w+(i%2?-1:0)*0,y0],[x+w,y0],[x+w,y1],[x-w,y1]],i%2?BWHITE:BBLUE);}
      c.save();c.globalAlpha=0.35;const gr=c.createLinearGradient(x-w,0,x+w,0);gr.addColorStop(0,'#fff');gr.addColorStop(1,'#000');c.fillStyle=gr;c.fillRect(x-w,y-H,w*2,H);c.restore();
      [[0.58,'#d9433b'],[0.76,'#f2c230']].forEach(([f,col],k)=>{const py=y-H*f;for(let s=-1;s<=1;s+=2){TH.ln(c,[x,py],[x+s*u*0.9,py+u*0.12],'#5a3a22',u*0.1);TH.poly(c,[[x+s*u*0.9-u*0.28,py+u*0.1],[x+s*u*0.9+u*0.28,py+u*0.1],[x+s*u*0.9+u*0.28,py+u*0.7],[x+s*u*0.9-u*0.28,py+u*0.7]],col,'#fff',u*0.04);TH.ell(c,x+s*u*0.9,py+u*0.4,u*0.1,u*0.1,'#fff');}});
      const ty=y-H*0.93;TH.ell(c,x,ty,u*1.5,u*0.5,'#3f8a3a');TH.ell(c,x,ty-u*0.1,u*1.3,u*0.36,'#5fae52');for(let k=0;k<12;k++){const a=k/12*6.283;TH.ell(c,x+Math.cos(a)*u*1.4,ty+Math.sin(a)*u*0.46,u*0.13,u*0.1,k%2?'#d9433b':'#f6efe0');}
      for(let k=0;k<8;k++){const a=k/8*6.283+0.3,sx=x+Math.cos(a)*u*1.3,sy=ty+Math.sin(a)*u*0.42,len=u*(3.2+(k%3)*0.8),col=[BBLUE,BWHITE,'#d9433b','#f2c230'][k%4];c.strokeStyle=col;c.lineWidth=u*0.14;c.lineCap='round';c.beginPath();c.moveTo(x,ty);c.quadraticCurveTo(sx,sy+len*0.4,sx+Math.sin(k)*u*0.3,sy+len);c.stroke();}
      TH.ln(c,[x,y-H],[x,y-H-u*0.7],'#5a3a22',u*0.12);BFLAG(c,x,y-H-u*0.5,u,0.9);for(let k=0;k<6;k++)TH.ell(c,x+(r()-0.5)*u*1.6,y+u*0.02,u*0.14,u*0.1,['#d9433b','#f6efe0','#f2c230','#f08aa0'][k%4]);}},
  /* ---------- small props (lower tiers only) ---------- */
  bunting:{cat:'prop',rho:0.12,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*2.4,u*0.4,'rgba(40,56,24,.14)');[-2.2,2.2].forEach(X=>TH.ln(c,I(X,0,0),I(X,0,3.4),'#6a4a2a',u*0.18));let prev=null;for(let k=0;k<=12;k++){const X=-2.2+4.4*k/12,p=I(X,0,3.3-Math.sin(k/12*Math.PI)*0.7);if(prev)TH.ln(c,prev,p,'#d9d4c2',u*0.04);prev=p;if(k<12){const q=I(X+0.18,0,3.3-Math.sin((k+0.5)/12*Math.PI)*0.7);TH.poly(c,[[q[0]-u*0.2,q[1]],[q[0]+u*0.2,q[1]],[q[0],q[1]+u*0.55]],k%2?BWHITE:BBLUE,'rgba(0,0,0,.15)',u*0.03);}}}},
  beerBarrels:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const bar=(bx,by,s,band)=>{const w=u*0.55*s,h=u*1.0*s;TH.ell(c,bx+w*0.5,by+w*0.2,w*1.3,w*0.4,'rgba(40,56,24,.22)');TH.ell(c,bx,by,w,w*0.4,'#5a3b22');c.fillStyle='#a87a44';c.beginPath();c.moveTo(bx-w,by);c.quadraticCurveTo(bx-w*1.14,by-h*0.5,bx-w,by-h);c.lineTo(bx+w,by-h);c.quadraticCurveTo(bx+w*1.14,by-h*0.5,bx+w,by);c.ellipse(bx,by,w,w*0.4,0,0,Math.PI);c.fill();[0.2,0.8].forEach(f=>TH.ln(c,[bx-w*1.04,by-h*f],[bx+w*1.04,by-h*f],'#3a3f4a',u*0.08));if(band)TH.ln(c,[bx-w*1.08,by-h*0.5],[bx+w*1.08,by-h*0.5],BBLUE,u*0.2);TH.ell(c,bx,by-h,w,w*0.4,'#c9a066');TH.ell(c,bx,by-h,w*0.2,w*0.08,'#8a5a33');};bar(x-u*0.65,y,1,true);bar(x+u*0.6,y+u*0.1,0.95,true);bar(x,y-u*0.2,0.9,false);}},
  haybale:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.3,u*0.4,'rgba(40,56,24,.2)');TH.box(c,x,y,u,-0.9,0.1,-0.6,0.6,0,0.9,'#e8cc70','#c0a24a','#f6e088');TH.box(c,x,y,u,0.2,1.2,-0.6,0.6,0,0.9,'#e8cc70','#c0a24a','#f6e088');TH.box(c,x,y,u,-0.4,0.7,-0.5,0.5,0.9,1.8,'#e8cc70','#c0a24a','#f6e088');[-0.4,0.4].forEach(X=>TH.ln(c,I(X,0.61,0.9),I(X,0.61,1.7),'#8a7030',u*0.05));}},
  lampPost:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(40,56,24,.22)');TH.ln(c,[x,y],[x,y-u*3.1],'#2a2d36',u*0.2);TH.ln(c,[x,y-u*2.95],[x+u*0.55,y-u*2.95],'#2a2d36',u*0.12);const lx=x+u*0.55,ly=y-u*2.9,g=c.createRadialGradient(lx,ly-u*0.3,0,lx,ly-u*0.3,u*1.5);g.addColorStop(0,'rgba(255,215,130,.5)');g.addColorStop(1,'rgba(255,215,130,0)');c.fillStyle=g;c.beginPath();c.arc(lx,ly-u*0.3,u*1.5,0,7);c.fill();TH.poly(c,[[lx-u*0.25,ly],[lx+u*0.25,ly],[lx+u*0.2,ly-u*0.6],[lx-u*0.2,ly-u*0.6]],'#ffe9a8','#2a2d36',u*0.06);TH.poly(c,[[lx-u*0.3,ly-u*0.6],[lx+u*0.3,ly-u*0.6],[lx,ly-u*0.95]],'#2a2d36');BFLAG(c,x,y-u*2.0,u,0.55);}},
  beerTable:{cat:'prop',rho:0.07,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*2.0,u*0.5,'rgba(40,56,24,.2)');TH.box(c,x,y,u,-1.3,1.3,-0.4,0.4,0.6,0.72,'#c9a066','#8a6a40','#dcb878');[-1.1,1.1].forEach(X=>TH.ln(c,I(X,0,0),I(X,0,0.62),BWOOD_D,u*0.14));TH.box(c,x,y,u,-1.3,1.3,-0.95,-0.55,0.3,0.4,'#a67a48','#7a5a30','#b98a55');TH.box(c,x,y,u,-1.3,1.3,0.55,0.95,0.3,0.4,'#a67a48','#7a5a30','#b98a55');[-1.1,1.1].forEach(X=>{TH.ln(c,I(X,-0.75,0),I(X,-0.75,0.3),BWOOD_D,u*0.1);TH.ln(c,I(X,0.75,0),I(X,0.75,0.3),BWOOD_D,u*0.1);});for(let k=0;k<4;k++){const p=I(-0.9+k*0.6,0.1*(k%2?1:-1),0.72);TH.poly(c,[[p[0]-u*0.11,p[1]],[p[0]+u*0.11,p[1]],[p[0]+u*0.1,p[1]-u*0.3],[p[0]-u*0.1,p[1]-u*0.3]],'#f2c230');TH.ell(c,p[0],p[1]-u*0.3,u*0.1,u*0.05,'#fff6d8');}
    TH.ln(c,I(0,0,0.72),I(0,0,2.4),'#5a3a22',u*0.1);TH.poly(c,[I(-1.3,-1.0,1.9),I(1.3,-1.0,1.9),I(0,0,2.6)].slice(0,0),'#fff');const top=I(0,0,2.6),ucols=[BBLUE,BWHITE];for(let i=0;i<6;i++){const a0=i/6*Math.PI,a1=(i+1)/6*Math.PI;TH.poly(c,[top,[top[0]+Math.cos(a0)*u*1.5,top[1]+u*0.7-Math.sin(a0)*u*0.0],[top[0]+Math.cos(a1)*u*1.5,top[1]+u*0.7]],ucols[i%2]);}}}
};

/* ===== MACRO-LAND ENGINE (hex geometry, path network, planner, baker) ===== */
const W3=Math.sqrt(3),HX=W3/2,HV=[[HX,0.29],[0,0.58],[-HX,0.29],[-HX,-0.29],[0,-0.58],[HX,-0.29]];
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[0,1,2],[-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5,1.5]],C:[[0],[-0.5,0.5,1.5],[-1,0,1],[-0.5]],D:[[0,1,2],[-0.5,0.5,1.5],[0,1]]};
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

function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol,clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]),key=[T.id,shape,tier,R,m,ground,sc,JSON.stringify(clr),JSON.stringify(opts.clearTiles||[])].join('|');const cached=revisedLandCache.get(key);if(cached)return cached;
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=0.75,top=T.top||1.35,bot=0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);return[cv,g];};
  const [back,cb]=mk();T.ground(cb,G,R,ox,oy,m,ground,({A:11,B:22,C:33,D:44})[shape]);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]),vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho))&&!(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));
  const sprites=vis.map(o=>{const unit=u*(o.scale||1);return {x:m*o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>T.assets[o.kind].draw(ctx,x,y,unit,o.v)};});
  const front=document.createElement('canvas'),frontRect={x:0,y:0,w:1,h:1};front.width=front.height=1;
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return revisedLandCache.set(key,{back,front,frontRect,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0,sprites});
}
function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}

/* ===== BAVARIAN LAND: planner (same tree + house counts as the medieval/gothic lands; cheerful painted houses, Oktoberfest pieces, autumn-tinged woods), sunny meadow ground ===== */
const BAVARIAN_REGION={top:{spruce:.18,fir:.08,beech:.2,linden:.1,birch:.1,appleTree:.12,maple:.16,youngSpruce:.06},mid:{spruce:.16,fir:.08,beech:.2,linden:.1,birch:.1,appleTree:.14,maple:.16,youngSpruce:.06},bottom:{spruce:.12,fir:.06,beech:.16,linden:.08,birch:.1,appleTree:.2,maple:.14,youngSpruce:.14}};
const BAVARIAN_LOW=[['youngSpruce',1],['appleTree',0.75],['birch',0.65],['maple',0.55],['beech',0.55],['youngSpruce',1.2],['appleTree',0.85]];
const BAVARIAN_CAP={linden:8};
const BAVARIAN_UNDER=['geraniumBush','wildflowers','sunflowers','hedge','grassTuft','fern','geraniumBush','wildflowers','stones'];
const BAVARIAN_PLAN_CACHE={};
function getBavarianPlan(shape){
  if(BAVARIAN_PLAN_CACHE[shape])return BAVARIAN_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(({A:7301,B:8402,C:9542,D:10643})[shape]),placed=[],bb=G.bbox,used={},A=BAVARIAN_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.66);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'beech';};
  const capOk=k=>!(BAVARIAN_CAP[k]&&(used[k]||0)>=BAVARIAN_CAP[k]);
  const regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?BAVARIAN_REGION.top:n<0.68?BAVARIAN_REGION.mid:BAVARIAN_REGION.bottom;};
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='tree'?0.88+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;if((D.cat==='tree'||D.cat==='shrub'||D.cat==='prop')&&placed.some(o=>o.noSouth&&Math.abs(px-o.x)<0.3&&py-o.y>-0.05&&py-o.y<0.36))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const tree=(x,y,extra,dom,low)=>{if(low){const L=BAVARIAN_LOW[Math.floor(rng()*BAVARIAN_LOW.length)];return place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return place(dom&&rng()<0.55&&capOk(dom)?dom:pickFrom(regionOf(y),capOk),x,y,extra||{});};
  const under=(x,y,extra)=>place(BAVARIAN_UNDER[Math.floor(rng()*BAVARIAN_UNDER.length)],x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const LKS=G.centers.length/12,landThin=l=>{const n=Math.max(1,Math.round(l.length*LKS));return Array.from({length:n},(_,i)=>l[Math.floor((i+0.5)*l.length/n)]);},landCnt=n=>Math.max(1,Math.round(n*LKS));
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. the back rim carries the striped beer tent (no tree backdrop: the trees there are the same density as everywhere else) */
  {const pts=[];top.forEach(e=>[0.3,0.5,0.7].forEach(t=>pts.push(onEdge(e,t,0.0))));const p=pts.reduce((b,q)=>Math.abs(q[0]-cx)<Math.abs(b[0]-cx)?q:b);for(const [dx,dy] of [[0,-0.02],[0.3,0],[-0.3,0],[0,0.04]]){const o=place('beerTent',p[0]+dx,p[1]+dy,{minT:2,scale:1.1,clear:2.4,noSouth:true});if(o)break;}}
  /* 2. cheerful homes: 6 on the rim (spread by farthest-point), 7 through the middle, then ONE onion-dome chapel beside a house */
  const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.filter(e=>e.vertical).forEach(e=>inn.push([e.mid[0],e.mid[1]]));
  const chosen=placed.filter(o=>o.cat==='ruin'||o.cat==='struct').map(o=>[o.x,o.y]),manors=[];
  const spread=(k,pool,extra)=>{const ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.22})).sort((a,b)=>b.d-a.d);for(let n=0;n<Math.min(12,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],extra);if(o){chosen.push([o.x,o.y]);if(/^(farmhouse|chalet|paintedHouse)$/.test(k))manors.push(o);return o;}}return null;};
  landThin([['paintedHouse',1],['farmhouse',2],['chalet',3],['paintedHouse',3],['farmhouse',4],['chalet',4]]).forEach(([k,mt])=>spread(k,rim,{minT:mt,scale:1.15,clear:2.5,noSouth:true}));
  landThin([['farmhouse',2],['chalet',2],['paintedHouse',3],['farmhouse',3],['paintedHouse',4],['chalet',4],['farmhouse',4]]).forEach(([k,mt])=>spread(k,inn,{minT:mt,scale:1.0,clear:3.0,noSouth:true}));
  {const home=manors[manors.length-1]||placed.find(o=>o.cat==='struct');if(home){for(const [dx,dy] of [[0.36,-0.08],[-0.36,-0.08],[0.3,0.12],[-0.3,0.12],[0.44,0.0],[-0.44,0.0]]){const o=place('chapel',home.x+dx,home.y+dy,{minT:4,scale:1.0,clear:2.4,noSouth:true});if(o)break;}}}
  /* 2b. village and Oktoberfest pieces scattered through the land (farthest-point spacing): market stalls, a fountain, wayside shrines, a woodshed and ONE maypole */
  landThin([['marketStall',1],['fountain',2],['marketStall',2],['shrine',2],['marketStall',3],['woodshed',3],['shrine',3],['maypole',4]]).forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,scale:k==='marketStall'?1.1:1.0,clear:1.8,noSouth:true}));
  /* 3. trees: very dark, same dense dials as the medieval land (and the top rim is treated exactly like every other edge) */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=pickFrom(regionOf(v.y),capOk),n=2+Math.floor(rng()*1.9);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.09:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{const dom=pickFrom(regionOf(e.mid[1]),capOk);[-0.27,0,0.27].forEach(dy=>{if(rng()<0.82)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.72)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.8+rng()*0.2},null,true);if(rng()<0.22)tree(e.mid[0]+(rng()-0.5)*0.34,e.mid[1]+(rng()-0.5)*0.14,{scale:0.78+rng()*0.2},null,true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.26));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(rng()-0.2)*0.12)});});
    let mode='grove',run=0,dom='beech';samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.74?'grove':r<0.92?'sparse':'open';run=2+Math.floor(rng()*4);dom=pickFrom(regionOf(s.p[1]),capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){tree(p[0],p[1],null,dom,low);if(rng()<0.55)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,dom,low);if(rng()<0.2)tree(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,dom,true);if(rng()<0.14)tree(p[0]+(rng()-0.5)*0.34,p[1]-0.2,null,dom,low);}
      else if(mode==='sparse'){if(rng()<0.5)tree(p[0],p[1],null,dom,low);else under(p[0],p[1]);}else if(rng()<0.6)under(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.8)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<14;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.46)tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);}});
  /* 3c. balance the rim: the top, the sides and the bottom must carry the same tree density per unit of boundary (thin the heavy edges, fill the light ones) */
  {const dEdge=(x,y,e)=>{const dx=e.b[0]-e.a[0],dy=e.b[1]-e.a[1],t=Math.max(0,Math.min(1,((x-e.a[0])*dx+(y-e.a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-(e.a[0]+dx*t),(y-(e.a[1]+dy*t))*1.4);};
    const classes=['top','side','bottom'],len={top:0,side:0,bottom:0};outer.forEach(e=>len[e.cls]+=e.len);
    const members=()=>{const m={top:[],side:[],bottom:[]};placed.filter(o=>o.cat==='tree').forEach(o=>{let best=null,bd=1e9;outer.forEach(e=>{const d=dEdge(o.x,o.y,e);if(d<bd){bd=d;best=e;}});if(bd<0.32)m[best.cls].push(o);});return m;};
    let m=members();const mean=(m.top.length+m.side.length+m.bottom.length)/(len.top+len.side+len.bottom);
    classes.forEach(cl=>{const target=Math.round(len[cl]*mean);let list=m[cl];
      if(list.length>target+1){const drop=list.length-target;for(let i=0;i<drop;i++){const pick=list.splice(Math.floor(rng()*list.length),1)[0],ix=placed.indexOf(pick);if(ix>=0)placed.splice(ix,1);}}
      else if(list.length<target-1){const need=target-list.length,es=outer.filter(e=>e.cls===cl);let added=0,guard=0;while(added<need&&guard++<160){const e=es[Math.floor(rng()*es.length)],p=onEdge(e,rng(),(rng()-0.2)*0.12);if(tree(p[0],p[1],null,null,cl!=='top'))added++;}}});}
  /* 4. undergrowth: geraniums, wildflowers, sunflowers, hedges */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.45)under(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.35)under(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.38)under(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.3)under(px,py);}});
  /* 5. small props: lower tiers only */
  [['bunting',2],['beerBarrels',2],['haybale',2],['lampPost',2],['beerTable',2]].forEach(([k,n])=>{for(let i=0;i<landCnt(n);i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  /* every house gets a facing (bit0 mirror, bit1 gable/eave); neighbours cycle through all four */
  {const houses=placed.filter(o=>/^(farmhouse|chalet|paintedHouse)$/.test(o.kind)).sort((a,b)=>a.x-b.x||a.y-b.y),cyc=[0,3,1,2];houses.forEach((o,i)=>{o.v=((o.v>>2)<<2)|cyc[i%4];});placed.filter(o=>o.kind==='chapel'||o.kind==='beerTent').forEach(o=>{o.v=((o.v>>2)<<2)|(rng()<0.5?1:0);});}
  const cuts={tree:[0.2,0.52,0.8,1],shrub:[0.06,0.38,0.7,1],rock:[0.3,0.55,0.8,1],prop:[1,1,1,1],struct:[0,0,0,0],ruin:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='struct'||o.cat==='ruin')o.tier=o.minT;});
  const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
  for(let t=1;t<=4;t++){let guard=0;while(guard++<300){const c=count(t);if(c.tr/Math.max(1,c.n)>=0.68)break;const pool=placed.filter(o=>o.tier<=t&&t<=o.maxT),cand=(pool.filter(o=>o.cat==='shrub').sort((a,b)=>b.pri-a.pri)[0])||(pool.filter(o=>o.prop&&o.minT>1).sort((a,b)=>b.pri-a.pri)[0]);if(!cand)break;cand.tier=Math.min(5,cand.tier+1);}}
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.sort((a,b)=>a.y-b.y);
  return BAVARIAN_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: a sunny, fresh meadow with fallen autumn leaves, daisies and cornflowers (decals, not objects) ---- */
function bavarianGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<46;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'190,230,130':'80,140,60',r()<0.5?0.2:0.2);}
  for(let k=0;k<12;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'236,224,140',0.15);}              /* sun-dried grass */
  for(let k=0;k<8;k++){const p=pt(),w=R*(0.25+r()*0.4);soft(p[0],p[1],w,w*0.4,'150,116,70',0.14);}               /* worn earth */
  for(let k=0;k<12;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'255,255,210',0.14);}              /* sun dapples */
  for(let k=0;k<160;k++){const p=pt(),h=R*(0.05+r()*0.06);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#78b856','#68a84a','#92cc6a'][(k+j)%3],R*0.011);}
  for(let k=0;k<70;k++){const p=pt(),a=r()*3.14,l=R*(0.03+r()*0.035);TH.ell(c,p[0],p[1],l,l*0.55,['#e8892a','#f0b83a','#c8402a','#e0a030'][k%4],a);}   /* fallen autumn leaves */
  for(let k=0;k<70;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.012,R*0.01,['#f6efe0','#f2c230','#6a8ae8','#f4a6cb','#fff0a0'][k%5]);}
  for(let k=0;k<22;k++){const p=pt();TH.ell(c,p[0],p[1],R*(0.014+r()*0.012),R*0.01,'rgba(160,160,152,.55)');}
  c.restore();c.restore();
}
const BAVARIAN_THEME={id:'bavarian',assets:BAVARIAN_ASSETS,plan:getBavarianPlan,ground:bavarianGround,groundCol:'#8fbf68',top:1.45};
const BAVARIAN_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
function bakeLandBavarian(shape,tier,R,opts){return bakeLandTheme(BAVARIAN_THEME,shape,tier,R,opts);}
function drawLandBavarianBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandBavarianFront(ctx,x,y,land){land.sprites.slice().sort((a,b)=>a.y-b.y).forEach(s=>drawScenicSprite(ctx,s,x+s.x,y+s.y));}
function landBavarianSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}


return Object.freeze({bake: bakeLandBavarian, drawBack: drawLandBavarianBack, drawFront: drawLandBavarianFront});
})(),
  fiesta: (() => {

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

/* ===== WILD WEST ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const WS=(c,x,y,rx)=>{c.fillStyle='rgba(70,45,20,.2)';c.beginPath();c.ellipse(x+rx*0.28,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const WRK=(c,x,y,rx,ry,col,snow)=>{TH.ell(c,x+rx*0.15,y+ry*0.3,rx*1.05,ry*0.45,'rgba(60,35,15,.22)');TH.poly(c,[[x-rx,y],[x-rx*0.9,y-ry*0.6],[x-rx*0.35,y-ry*1.05],[x+rx*0.4,y-ry*0.95],[x+rx*0.95,y-ry*0.35],[x+rx,y+ry*0.1],[x-rx*0.6,y+ry*0.2]],col);
  TH.poly(c,[[x+rx*0.25,y-ry*0.98],[x+rx*0.95,y-ry*0.35],[x+rx,y+ry*0.1],[x+rx*0.2,y+ry*0.05]],shade(col,-0.28));TH.poly(c,[[x-rx*0.9,y-ry*0.6],[x-rx*0.35,y-ry*1.05],[x+rx*0.1,y-ry*0.95],[x-rx*0.4,y-ry*0.55]],shade(col,0.18));
  TH.ln(c,[x-rx*0.85,y-ry*0.3],[x+rx*0.8,y-ry*0.15],'rgba(80,40,20,.22)',ry*0.07);};
const WCONIF=(c,x,y,u,o,r)=>{const h=u*o.h,w=u*o.w,n=o.tiers;TH.ln(c,[x,y],[x,y-h*0.25],'#5a3b22',u*0.38);for(let i=0;i<n;i++){const t=i/n,ww=w*(1-0.8*t)*(0.9+r()*0.2),yb=y-h*(0.1+0.78*t),tip=yb-h*0.4;
    const pts=[[x-ww,yb],[x-ww*0.55,yb-h*0.045],[x-ww*0.2,yb+h*0.012],[x+ww*0.25,yb-h*0.04],[x+ww*0.6,yb+h*0.01],[x+ww,yb]];TH.poly(c,pts.concat([[x,tip]]),o.c1);TH.poly(c,[[x,tip],[x+ww,yb],[x+ww*0.6,yb+h*0.01],[x+ww*0.25,yb-h*0.04],[x,yb]],o.c2);}};
const WEST_ASSETS={
  /* ---------- trees ---------- */
  cottonwood:{cat:'tree',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*7+1),H=u*(4.4+r()*1.1);WS(c,x,y,u*2.0);c.strokeStyle='#8a7c64';c.lineWidth=u*0.58;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.12,y-H*0.35,x+u*0.05,y-H*0.62);c.stroke();c.strokeStyle='#a99b82';c.lineWidth=u*0.2;c.beginPath();c.moveTo(x-u*0.12,y);c.quadraticCurveTo(x-u*0.22,y-H*0.35,x-u*0.05,y-H*0.6);c.stroke();
    TH.ln(c,[x+u*0.05,y-H*0.5],[x-u*0.95,y-H*0.86],'#8a7c64',u*0.3);TH.ln(c,[x+u*0.05,y-H*0.56],[x+u*1.05,y-H*0.82],'#8a7c64',u*0.28);const cols=['#9db551','#8aa545','#aec45f','#7b9a3d','#bccd6e'];
    [[0,-0.9,1.5,1.1],[-1.25,-0.65,1.1,0.9],[1.25,-0.65,1.1,0.9],[0.05,-0.3,1.7,1.0],[-0.65,-1.5,1.0,0.8],[0.75,-1.45,1.0,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H*0.8+dy*u,u*rx,u*ry,r()<0.12?'#d2c653':cols[i%5],r,9));}},
  mesquite:{cat:'tree',rho:0.15,draw(c,x,y,u,v){const r=mulberry(v*5+3),H=u*(2.6+r()*0.6);WS(c,x,y,u*2.1);c.strokeStyle='#4f3b28';c.lineCap='round';c.lineWidth=u*0.4;c.beginPath();c.moveTo(x-u*0.1,y);c.bezierCurveTo(x-u*0.5,y-H*0.35,x+u*0.5,y-H*0.5,x,y-H*0.78);c.stroke();c.lineWidth=u*0.25;c.beginPath();c.moveTo(x+u*0.1,y-H*0.25);c.bezierCurveTo(x+u*0.9,y-H*0.35,x+u*1.0,y-H*0.6,x+u*0.9,y-H*0.78);c.stroke();
    const cols=['#8a9a46','#7a8a3c','#96a652','#6f7f35'];[[-1.5,-0.25,1.0,0.7],[-0.5,-0.85,1.2,0.8],[0.8,-0.7,1.2,0.8],[1.7,-0.2,1.0,0.7],[0.2,-0.2,1.5,0.8],[-0.8,-0.2,1.1,0.7]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H*0.78+dy*u,u*rx,u*ry,cols[i%4],r,8));}},
  juniper:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*3+5);WS(c,x,y,u*1.5);TH.ln(c,[x,y],[x+u*0.1,y-u*0.9],'#6b5640',u*0.45);const cols=['#4e7a64','#436b57','#5d8a72','#3c6450'];[[0,-2.0,1.2,1.0],[-0.7,-1.3,1.0,0.9],[0.7,-1.3,1.0,0.9],[0,-0.9,1.3,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,cols[i],r,8));for(let k=0;k<5;k++)TH.ell(c,x+(r()-0.5)*u*1.8,y-u*(0.8+r()*1.8),u*0.07,u*0.07,'#4a5a9a');}},
  pinyon:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*11+2);WS(c,x,y,u*1.4);WCONIF(c,x,y,u,{h:4.0+r()*1.0,w:1.35,tiers:5,c1:'#3c6a45',c2:'#2c5236'},r);}},
  ponderosa:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*13+1),H=u*(5.8+r()*1.0);WS(c,x,y,u*1.3);TH.ln(c,[x,y],[x,y-H*0.78],'#9a5f3c',u*0.45);TH.ln(c,[x-u*0.1,y],[x-u*0.1,y-H*0.7],'#b97a50',u*0.15);
    const cols=['#3d6b43','#2f5a38','#4b7a50'];[[0,-0.2,1.5,0.8],[-0.6,-0.95,1.3,0.75],[0.6,-0.95,1.3,0.75],[0,-1.6,1.0,0.7],[-0.35,-2.2,0.7,0.6],[0.2,-2.65,0.5,0.5]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H*0.7+dy*u,u*rx,u*ry,cols[i%3],r,8));}},
  saguaro:{cat:'tree',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*17+4),H=u*(4.6+r()*1.4),w=u*0.46;WS(c,x,y,u*1.0);const col=(x0,yb,h,ww)=>{const g=c.createLinearGradient(x0-ww,0,x0+ww,0);g.addColorStop(0,'#78ad63');g.addColorStop(0.55,'#4f8a45');g.addColorStop(1,'#2e6030');c.beginPath();c.moveTo(x0-ww,yb);c.lineTo(x0-ww,yb-h+ww);c.arc(x0,yb-h+ww,ww,Math.PI,0);c.lineTo(x0+ww,yb);c.closePath();c.fillStyle=g;c.fill();for(let k=-1;k<=1;k++)TH.ln(c,[x0+k*ww*0.5,yb-h*0.02],[x0+k*ww*0.5,yb-h+ww*0.8],'rgba(20,60,30,.35)',u*0.05);};
    const arm=(s,yy,out,up)=>{c.lineCap='round';c.lineJoin='round';c.strokeStyle='#2e6030';c.lineWidth=u*0.62;c.beginPath();c.moveTo(x+s*w*0.5,y-yy);c.lineTo(x+s*(w+out),y-yy);c.lineTo(x+s*(w+out),y-yy-up);c.stroke();c.strokeStyle='#5a9a50';c.lineWidth=u*0.4;c.stroke();};
    arm(-1,H*0.42,u*0.75,u*1.5+r()*u*0.7);if(r()<0.85)arm(1,H*0.55,u*0.8,u*1.1+r()*u*0.8);col(x,y,H,w);TH.ell(c,x-w*0.1,y-H,w*0.35,w*0.25,'#f3e9d2');}},
  joshua:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*19+2),H=u*(3.2+r()*0.8);WS(c,x,y,u*1.3);TH.ln(c,[x,y],[x,y-H*0.55],'#7c6a50',u*0.5);for(let k=0;k<7;k++)TH.ln(c,[x-u*0.2,y-H*0.08*k],[x+u*0.2,y-H*0.08*k+u*0.1],'rgba(50,35,20,.35)',u*0.06);
    const tuft=(tx,ty)=>{for(let k=0;k<11;k++){const a=-Math.PI*0.95+k/10*Math.PI*0.9,l=u*(0.65+r()*0.35);TH.ln(c,[tx,ty],[tx+Math.cos(a)*l,ty+Math.sin(a)*l*0.9],k%2?'#7d8f4a':'#a3a35a',u*0.09);}};
    [[-1.0,0.78],[0.9,0.85],[0.1,1.0]].forEach(([dx,f],i)=>{const bx=x+dx*u,by=y-H*f;TH.ln(c,[x,y-H*0.5],[bx,by+u*0.2],'#7c6a50',u*0.3);tuft(bx,by);});}},
  deadTree:{cat:'tree',rho:0.04,draw(c,x,y,u,v){const r=mulberry(v*23+1),H=u*(3.0+r()*0.8);WS(c,x,y,u*0.9);c.lineCap='round';TH.ln(c,[x,y],[x+u*0.15,y-H],'#8d8577',u*0.4);TH.ln(c,[x+u*0.1,y-H*0.55],[x-u*1.0,y-H*0.9],'#8d8577',u*0.22);TH.ln(c,[x+u*0.12,y-H*0.7],[x+u*0.95,y-H*1.05],'#8d8577',u*0.2);TH.ln(c,[x-u*0.55,y-H*0.78],[x-u*0.9,y-H*1.15],'#8d8577',u*0.14);TH.ln(c,[x+u*0.15,y-H],[x,y-H*1.25],'#8d8577',u*0.15);}},
  /* ---------- shrubs ---------- */
  sage:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.2,y+u*0.1,u*1.1,u*0.35,'rgba(70,45,20,.18)');[[-0.55,-0.4,0.7,0.5],[0.5,-0.4,0.7,0.5],[0,-0.7,0.8,0.55]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#93a082','#a3ae92','#86967a'][i],r,7));}},
  pricklyPear:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+9);TH.ell(c,x+u*0.2,y+u*0.1,u*1.0,u*0.3,'rgba(70,45,20,.18)');const pad=(px,py,rx,ry,rot)=>{TH.ell(c,px,py,rx,ry,'#6f9a4e',rot);TH.ell(c,px-rx*0.2,py-ry*0.2,rx*0.55,ry*0.5,'rgba(255,255,255,.12)',rot);for(let k=0;k<5;k++)TH.ell(c,px+(r()-0.5)*rx,py+(r()-0.5)*ry,u*0.035,u*0.035,'#f3ead0');};pad(x,y-u*0.5,u*0.5,u*0.62,0);pad(x+u*0.55,y-u*1.05,u*0.4,u*0.5,0.5);pad(x-u*0.5,y-u*1.0,u*0.38,u*0.48,-0.5);[[0.85,-1.35],[-0.8,-1.3]].forEach(([dx,dy])=>TH.ell(c,x+dx*u,y+dy*u,u*0.14,u*0.11,'#c0392b'));}},
  yucca:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*7+2);TH.ell(c,x+u*0.15,y+u*0.08,u*0.8,u*0.25,'rgba(70,45,20,.18)');TH.ln(c,[x,y],[x,y-u*0.7],'#7c6a50',u*0.35);for(let k=0;k<13;k++){const a=-Math.PI*0.97+k/12*Math.PI*0.94,l=u*(0.9+r()*0.5);TH.ln(c,[x,y-u*0.7],[x+Math.cos(a)*l,y-u*0.7+Math.sin(a)*l],k%2?'#5f8a52':'#6f9a5a',u*0.12);}if(r()<0.5){TH.ln(c,[x,y-u*0.7],[x+u*0.1,y-u*2.6],'#e9dcc0',u*0.1);for(let k=0;k<5;k++)TH.ell(c,x+u*0.1,y-u*(1.6+k*0.22),u*0.14,u*0.1,'#f6efe0');}}},
  barrelCactus:{cat:'shrub',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.15,y+u*0.08,u*0.7,u*0.22,'rgba(70,45,20,.18)');const g=c.createRadialGradient(x-u*0.2,y-u*0.7,0,x,y-u*0.5,u*0.8);g.addColorStop(0,'#86b872');g.addColorStop(1,'#3f7a3a');c.fillStyle=g;c.beginPath();c.ellipse(x,y-u*0.5,u*0.55,u*0.6,0,0,7);c.fill();for(let k=-2;k<=2;k++)TH.ln(c,[x+k*u*0.2,y-u*0.05],[x+k*u*0.16,y-u*1.05],'rgba(20,60,30,.4)',u*0.05);TH.ell(c,x,y-u*1.08,u*0.2,u*0.1,'#f2c230');}},
  dryGrass:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);for(let k=0;k<12;k++){const a=-1.1+k/11*2.2+(r()-0.5)*0.2,l=u*(0.5+r()*0.55);TH.ln(c,[x+(r()-0.5)*u*0.6,y],[x+Math.sin(a)*l+(r()-0.5)*u*0.3,y-l],['#c9b46a','#b8a35a','#d8c77a'][k%3],u*0.07);}}},
  /* ---------- rockwork ---------- */
  boulders:{cat:'rock',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.8,'#b7714b'],[0.7,0.2,0.8,0.7,'#c28a5c'],[0,-0.35,0.7,0.6,'#a8633f']].forEach(([dx,dy,rx,ry,col],i)=>WRK(c,x+dx*u,y+dy*u,u*rx,u*ry*(1+r()*0.2),col));}},
  spire:{cat:'rock',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*9+2),H=u*(5.5+r()*3.2),w=u*(0.9+r()*0.4);TH.ell(c,x+u*0.5,y+u*0.1,w*1.5,u*0.4,'rgba(60,35,15,.22)');const bands=['#c07a50','#b86a42','#c98e62','#b0603a'];const n=5;for(let i=0;i<n;i++){const t0=i/n,t1=(i+1)/n,w0=w*(1-0.62*t0),w1=w*(1-0.62*t1);TH.poly(c,[[x-w0,y-H*t0],[x+w0,y-H*t0],[x+w1,y-H*t1],[x-w1,y-H*t1]],bands[i%4]);TH.poly(c,[[x+w0*0.15,y-H*t0],[x+w0,y-H*t0],[x+w1,y-H*t1],[x+w1*0.15,y-H*t1]],'rgba(60,25,10,.28)');}
    TH.poly(c,[[x-w*0.38,y-H],[x+w*0.38,y-H],[x+w*0.1,y-H-u*0.7],[x-w*0.1,y-H-u*0.7]],'#a8603a');TH.ln(c,[x-w*0.9,y-H*0.35],[x+w*0.9,y-H*0.35],'rgba(80,40,20,.25)',u*0.07);}},
  butte:{cat:'rock',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*7+8),H=u*(5.0+r()*1.6),w=u*(1.8+r()*0.5);TH.ell(c,x+u*0.8,y+u*0.15,w*1.5,u*0.5,'rgba(60,35,15,.22)');
    TH.poly(c,[[x-w*1.5,y],[x-w*0.95,y-H*0.35],[x+w*0.95,y-H*0.35],[x+w*1.5,y]],'#c9936a');TH.poly(c,[[x+w*0.4,y-H*0.35],[x+w*0.95,y-H*0.35],[x+w*1.5,y],[x+w*0.55,y]],'rgba(80,40,20,.25)');
    const cliff=['#b86a42','#c07a50','#a85f3a','#c98e62'];for(let i=0;i<4;i++){const t0=0.35+i*0.1625,t1=0.35+(i+1)*0.1625;TH.poly(c,[[x-w*0.95,y-H*t0],[x+w*0.95,y-H*t0],[x+w*0.9,y-H*t1],[x-w*0.9,y-H*t1]],cliff[i]);TH.poly(c,[[x+w*0.25,y-H*t0],[x+w*0.95,y-H*t0],[x+w*0.9,y-H*t1],[x+w*0.25,y-H*t1]],'rgba(60,25,10,.3)');}
    for(let k=-3;k<=3;k++)TH.ln(c,[x+k*w*0.27,y-H*0.4],[x+k*w*0.25,y-H*0.98],'rgba(60,25,10,.18)',u*0.06);TH.poly(c,[[x-w*0.95,y-H],[x+w*0.9,y-H],[x+w*0.6,y-H-u*0.4],[x-w*0.6,y-H-u*0.4]],'#d4a577');}},
  mesa:{cat:'rock',rho:0.2,draw(c,x,y,u,v){const r=mulberry(v*5+6),H=u*(5.5+r()*1.0),w=u*(3.0+r()*0.8);TH.ell(c,x+u*1.0,y+u*0.2,w*1.5,u*0.6,'rgba(60,35,15,.2)');
    TH.poly(c,[[x-w*1.4,y],[x-w*1.05,y-H*0.3],[x+w*1.0,y-H*0.3],[x+w*1.4,y]],'#c9936a');TH.poly(c,[[x+w*0.3,y-H*0.3],[x+w*1.0,y-H*0.3],[x+w*1.4,y],[x+w*0.5,y]],'rgba(80,40,20,.22)');
    const cliff=['#b86a42','#c07a50','#a85f3a','#c98e62','#b0603a'];for(let i=0;i<5;i++){const t0=0.3+i*0.14,t1=0.3+(i+1)*0.14;TH.poly(c,[[x-w*1.0,y-H*t0],[x+w*1.0,y-H*t0],[x+w*0.97,y-H*t1],[x-w*0.97,y-H*t1]],cliff[i]);TH.poly(c,[[x+w*0.3,y-H*t0],[x+w*1.0,y-H*t0],[x+w*0.97,y-H*t1],[x+w*0.3,y-H*t1]],'rgba(60,25,10,.28)');}
    for(let k=-5;k<=5;k++)TH.ln(c,[x+k*w*0.19,y-H*0.35],[x+k*w*0.18,y-H*1.0],'rgba(60,25,10,.16)',u*0.06);TH.poly(c,[[x-w*1.0,y-H],[x+w*0.97,y-H],[x+w*0.7,y-H-u*0.5],[x-w*0.7,y-H-u*0.5]],'#d4a577');for(let k=0;k<4;k++)WRK(c,x+(r()-0.5)*w*1.2,y-H-u*0.2,u*0.35,u*0.25,'#b7714b');}},
  ledge:{cat:'rock',rho:0.16,draw(c,x,y,u,v){const r=mulberry(v*3+3),w=u*(2.2+r()*0.8),H=u*(1.6+r()*0.6);TH.ell(c,x+u*0.5,y+u*0.1,w*1.1,u*0.35,'rgba(60,35,15,.2)');const bands=['#c07a50','#b86a42','#c98e62'];for(let i=0;i<3;i++){const t0=i/3,t1=(i+1)/3,j0=(r()-0.5)*u*0.5,j1=(r()-0.5)*u*0.5;TH.poly(c,[[x-w+j0,y-H*t0],[x+w+j1,y-H*t0],[x+w*0.9+j1,y-H*t1],[x-w*0.92+j0,y-H*t1]],bands[i]);TH.poly(c,[[x+w*0.2,y-H*t0],[x+w+j1,y-H*t0],[x+w*0.9+j1,y-H*t1],[x+w*0.2,y-H*t1]],'rgba(60,25,10,.26)');}
    TH.poly(c,[[x-w*0.92,y-H],[x+w*0.9,y-H],[x+w*0.7,y-H-u*0.3],[x-w*0.7,y-H-u*0.3]],'#d4a577');WRK(c,x-w*0.7,y,u*0.5,u*0.4,'#a8633f');WRK(c,x+w*0.85,y+u*0.05,u*0.45,u*0.35,'#b7714b');}},
  arch:{cat:'rock',rho:0.2,draw(c,x,y,u,v){const H=u*6.0,w=u*1.2;TH.ell(c,x+u*1.2,y+u*0.2,u*4.2,u*0.7,'rgba(60,35,15,.2)');[[-2.1],[2.1]].forEach(([dx],k)=>{const px=x+dx*u;const bands=['#c07a50','#b86a42','#c98e62','#b0603a'];for(let i=0;i<4;i++){const t0=i/4,t1=(i+1)/4,w0=w*(1-0.25*t0),w1=w*(1-0.25*t1);TH.poly(c,[[px-w0,y-H*0.9*t0],[px+w0,y-H*0.9*t0],[px+w1,y-H*0.9*t1],[px-w1,y-H*0.9*t1]],bands[(i+k)%4]);TH.poly(c,[[px+w0*0.2,y-H*0.9*t0],[px+w0,y-H*0.9*t0],[px+w1,y-H*0.9*t1],[px+w1*0.2,y-H*0.9*t1]],'rgba(60,25,10,.28)');}});
    c.beginPath();c.moveTo(x-u*3.3,y-H*0.78);c.quadraticCurveTo(x,y-H*1.28,x+u*3.3,y-H*0.78);c.lineTo(x+u*3.1,y-H*0.62);c.quadraticCurveTo(x,y-H*1.05,x-u*3.1,y-H*0.62);c.closePath();c.fillStyle='#b86a42';c.fill();c.strokeStyle='rgba(60,25,10,.3)';c.lineWidth=u*0.1;c.stroke();TH.ln(c,[x-u*3.0,y-H*0.7],[x+u*3.0,y-H*0.7],'rgba(255,220,170,.2)',u*0.1);}},
  /* ---------- small props (lower tiers only) ---------- */
  hay:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.3,u*0.4,'rgba(70,45,20,.2)');TH.box(c,x,y,u,-0.9,0.1,-0.6,0.6,0,0.9,'#e0c26a','#b89a45','#f0d77a');TH.box(c,x,y,u,0.2,1.2,-0.6,0.6,0,0.9,'#e0c26a','#b89a45','#f0d77a');TH.box(c,x,y,u,-0.4,0.7,-0.5,0.5,0.9,1.8,'#e0c26a','#b89a45','#f0d77a');[-0.4,0.4].forEach(X=>TH.ln(c,I(X,0.61,0.9),I(X,0.61,1.7),'#8a7030',u*0.05));}},
  barrel:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.25,'rgba(70,45,20,.2)');const w=u*0.5,h=u*0.95;TH.ell(c,x,y,w,w*0.4,'#5a3b22');c.fillStyle='#8a5a33';c.beginPath();c.moveTo(x-w,y);c.quadraticCurveTo(x-w*1.12,y-h*0.5,x-w,y-h);c.lineTo(x+w,y-h);c.quadraticCurveTo(x+w*1.12,y-h*0.5,x+w,y);c.ellipse(x,y,w,w*0.4,0,0,Math.PI);c.fill();[0.2,0.8].forEach(f=>TH.ln(c,[x-w*1.04,y-h*f],[x+w*1.04,y-h*f],'#3a3f4a',u*0.08));TH.ell(c,x,y-h,w,w*0.4,'#a97d49');}},
  wheel:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.1,u*0.9,u*0.25,'rgba(70,45,20,.2)');const cx=x,cy=y-u*0.95,r=u*0.95;c.strokeStyle='#6a4a2a';c.lineWidth=u*0.16;c.beginPath();c.ellipse(cx,cy,r*0.78,r,0.15,0,7);c.stroke();for(let k=0;k<8;k++){const a=k/8*6.283;TH.ln(c,[cx,cy],[cx+Math.cos(a)*r*0.78,cy+Math.sin(a)*r],'#6a4a2a',u*0.08);}TH.ell(c,cx,cy,u*0.14,u*0.16,'#3a3f4a');TH.ln(c,[x-u*0.3,y],[cx-u*0.3,cy+r*0.6],'#6a4a2a',u*0.12);}},
  trough:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.6,u*0.45,'rgba(70,45,20,.2)');TH.box(c,x,y,u,-1.3,1.3,-0.45,0.45,0.1,0.85,'#8a5a33','#6a4424','#a97d49');TH.poly(c,[I(-1.15,-0.32,0.86),I(1.15,-0.32,0.86),I(1.15,0.32,0.86),I(-1.15,0.32,0.86)],'#5a9ac0');[-1.2,1.2].forEach(X=>{TH.ln(c,I(X,-0.3,0),I(X,-0.3,0.2),'#5a3b22',u*0.14);TH.ln(c,I(X,0.3,0),I(X,0.3,0.2),'#5a3b22',u*0.14);});}},
  fence:{cat:'prop',rho:0.09,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.3,y+u*0.1,u*2.0,u*0.35,'rgba(70,45,20,.16)');for(let k=0;k<4;k++){const X=-1.8+k*1.2;TH.ln(c,I(X,0,0),I(X,0,1.4),'#6a4a2a',u*0.2);}[0.5,1.05].forEach(z=>TH.ln(c,I(-1.8,0,z),I(1.8,0,z),'#8a6a44',u*0.14));}},
  lamp:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(70,45,20,.2)');TH.ln(c,[x,y],[x,y-u*3.1],'#2a2d36',u*0.16);TH.ln(c,[x,y-u*2.95],[x+u*0.5,y-u*2.95],'#2a2d36',u*0.1);const lx=x+u*0.5,ly=y-u*2.9,g=c.createRadialGradient(lx,ly-u*0.3,0,lx,ly-u*0.3,u*1.4);g.addColorStop(0,'rgba(255,215,130,.5)');g.addColorStop(1,'rgba(255,215,130,0)');c.fillStyle=g;c.beginPath();c.arc(lx,ly-u*0.3,u*1.4,0,7);c.fill();TH.poly(c,[[lx-u*0.25,ly],[lx+u*0.25,ly],[lx+u*0.2,ly-u*0.6],[lx-u*0.2,ly-u*0.6]],'#ffe9a8','#2a2d36',u*0.06);TH.poly(c,[[lx-u*0.3,ly-u*0.6],[lx+u*0.3,ly-u*0.6],[lx,ly-u*0.9]],'#2a2d36');}},
  flags:{cat:'prop',rho:0.12,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*2.4,u*0.4,'rgba(70,45,20,.14)');[-2.2,2.2].forEach(X=>TH.ln(c,I(X,0,0),I(X,0,3.4),'#6a4a2a',u*0.18));const cols=['#c0392b','#f2c230','#2a6aa8','#f6efe0','#3f8a4a'];let prev=null;for(let k=0;k<=10;k++){const X=-2.2+4.4*k/10,p=I(X,0,3.3-Math.sin(k/10*Math.PI)*0.7);if(prev)TH.ln(c,prev,p,'#d9d4c2',u*0.04);prev=p;if(k<10){const q=I(X+0.2,0,3.3-Math.sin((k+0.5)/10*Math.PI)*0.7);TH.poly(c,[[q[0]-u*0.2,q[1]],[q[0]+u*0.2,q[1]],[q[0],q[1]+u*0.55]],cols[k%5]);}}}},
  /* ---------- structures (heavier tiers, one homestead only) ---------- */
  cabin:{cat:'struct',rho:0.17,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.8,y+u*0.2,u*3.0,u*0.9,'rgba(70,45,20,.22)');TH.box(c,x,y,u,-1.7,1.7,-1.2,1.2,0,2.2,'#a07a4e','#7a5a34','#b98c5a');for(let k=-3;k<=3;k++)TH.ln(c,I(k*0.46,1.21,0.05),I(k*0.46,1.21,2.15),'rgba(50,30,10,.35)',u*0.05);
    TH.poly(c,[I(-0.35,1.22,0),I(0.35,1.22,0),I(0.35,1.22,1.5),I(-0.35,1.22,1.5)],'#3a2615');TH.poly(c,[I(-1.3,1.22,1.2),I(-0.7,1.22,1.2),I(-0.7,1.22,1.8),I(-1.3,1.22,1.8)],'#2a1a10','#d9c9a0',u*0.05);
    TH.poly(c,[I(2.1,-1.6,2.2),I(2.1,1.6,2.2),I(0,1.6,3.5),I(0,-1.6,3.5)],'#9aa3a8');for(let k=1;k<7;k++)TH.ln(c,I(2.1-0.3*k,-1.6,2.2+0.185*k),I(2.1-0.3*k,1.6,2.2+0.185*k),'rgba(80,60,40,.3)',u*0.05);TH.poly(c,[I(-2.1,1.6,2.2),I(2.1,1.6,2.2),I(0,1.6,3.5)],'#7a5a34');TH.box(c,x,y,u,0.7,1.1,-0.9,-0.5,3.0,4.2,'#8d8478','#6d665a','#a39b8e');
    TH.box(c,x,y,u,-1.3,1.3,1.3,2.3,0,1.0,'#a07a4e','#7a5a34','#b98c5a');}},
  waterTower:{cat:'struct',rho:0.09,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.6,y+u*0.15,u*1.9,u*0.6,'rgba(70,45,20,.22)');[[-0.9,-0.9],[0.9,-0.9],[-0.9,0.9],[0.9,0.9]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(X*0.8,Y*0.8,4.4),'#6a4a2a',u*0.22));[1.4,3.0].forEach(z=>{const f=1-z*0.05;TH.ln(c,I(-f*0.9,f*0.9,z),I(f*0.9,f*0.9,z),'#6a4a2a',u*0.12);TH.ln(c,I(f*0.9,f*0.9,z),I(f*0.9,-f*0.9,z),'#6a4a2a',u*0.12);});TH.ln(c,I(-0.8,0.8,1.4),I(0.8,0.8,3.0),'#6a4a2a',u*0.08);TH.ln(c,I(0.8,0.8,1.4),I(-0.8,0.8,3.0),'#6a4a2a',u*0.08);
    const b=TH.iso(x,y,u,0,0,4.4),t=TH.iso(x,y,u,0,0,7.0),rx=u*1.25,ry=u*0.62,g=c.createLinearGradient(b[0]-rx,0,b[0]+rx,0);g.addColorStop(0,'#b0865a');g.addColorStop(0.5,'#8a6238');g.addColorStop(1,'#5a3f22');c.beginPath();c.moveTo(b[0]-rx,b[1]);c.lineTo(t[0]-rx,t[1]);c.lineTo(t[0]+rx,t[1]);c.lineTo(b[0]+rx,b[1]);c.ellipse(b[0],b[1],rx,ry,0,0,Math.PI);c.closePath();c.fillStyle=g;c.fill();for(let k=-3;k<=3;k++)TH.ln(c,[b[0]+k*rx*0.3,b[1]+ry*Math.sqrt(1-(k*0.3)**2)],[t[0]+k*rx*0.3,t[1]+ry*Math.sqrt(1-(k*0.3)**2)],'rgba(40,25,10,.3)',u*0.05);[0.3,0.7].forEach(f=>{c.strokeStyle='#3a3f4a';c.lineWidth=u*0.1;c.beginPath();c.ellipse(b[0],b[1]+(t[1]-b[1])*f,rx,ry,0,0,Math.PI);c.stroke();});TH.ell(c,t[0],t[1],rx,ry,'#7a5a34');TH.poly(c,[[t[0]-rx*1.05,t[1]],[t[0],t[1]-u*1.1],[t[0]+rx*1.05,t[1]]],'#6a4a2a');}}
};

/* ===== FIESTA / DAY OF THE DEAD ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed.
   Requires WEST_ASSETS (cacti, mesquite) to be loaded first. ===== */
const FSH=(c,x,y,rx)=>{c.fillStyle='rgba(70,40,20,.24)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const FPAL=[['#e8508a','#fbe4ec'],['#2ab5b0','#dcf4f2'],['#f2c230','#fdf2c8'],['#f08a24','#fde4c8'],['#8a4ab8','#eddff6'],['#7ac43a','#e6f4d4']];
const FCOL=['#e8508a','#2ab5b0','#f2c230','#f08a24','#8a4ab8','#7ac43a'];
const FADOBE='#d9b88e',FWOODD='#5a3a22',FTERRA='#c0603a',FMARI='#f08a24',FMARI2='#f6b83a';
const FBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.26),shade(col,0.12));
const FFLIP=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
const FPATH=(c,pts)=>{pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();};
/* round-arched opening outline for a face; J(a,z) maps a face coordinate to the screen */
const FARCH=(J,xc,w,z0,zs)=>{const pts=[J(xc-w,z0),J(xc-w,zs)];for(let k=1;k<7;k++){const a=Math.PI*(1-k/7);pts.push(J(xc+Math.cos(a)*w,zs+Math.sin(a)*w));}pts.push(J(xc+w,zs),J(xc+w,z0));return pts;};
/* a sugar skull (calavera) painted on a wall / held on a stall */
const FSKULL=(c,x,y,r,v)=>{const col=FCOL[v%6],col2=FCOL[(v+2)%6];c.fillStyle='#fbf3e0';c.beginPath();c.ellipse(x,y,r*0.9,r,0,0,7);c.fill();c.strokeStyle='rgba(70,40,30,.55)';c.lineWidth=Math.max(0.6,r*0.08);c.stroke();
  [-1,1].forEach(sx=>{c.fillStyle=col;c.beginPath();c.ellipse(x+sx*r*0.38,y-r*0.15,r*0.3,r*0.34,0,0,7);c.fill();c.fillStyle='#1a1a20';c.beginPath();c.ellipse(x+sx*r*0.38,y-r*0.12,r*0.16,r*0.2,0,0,7);c.fill();});
  c.fillStyle='#3a2a2a';c.beginPath();c.moveTo(x,y+r*0.05);c.lineTo(x-r*0.1,y+r*0.3);c.lineTo(x+r*0.1,y+r*0.3);c.fill();c.strokeStyle='#3a2a2a';c.lineWidth=Math.max(0.5,r*0.07);c.beginPath();c.moveTo(x-r*0.4,y+r*0.55);c.quadraticCurveTo(x,y+r*0.68,x+r*0.4,y+r*0.55);c.stroke();for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(x+k*r*0.17,y+r*0.58);c.lineTo(x+k*r*0.17,y+r*0.7);c.stroke();}
  [-0.4,0,0.4].forEach((d,i)=>{c.fillStyle=FCOL[(v+i+3)%6];c.beginPath();c.arc(x+d*r,y-r*0.72,r*0.12,0,7);c.fill();});c.fillStyle=col2;c.beginPath();c.arc(x,y+r*0.9,r*0.0,0,7);c.fill();};
const FMARIGOLD=(c,x,y,r)=>{for(let k=0;k<8;k++){const a=k/8*6.283;c.fillStyle=k%2?FMARI:FMARI2;c.beginPath();c.ellipse(x+Math.cos(a)*r*0.45,y+Math.sin(a)*r*0.4,r*0.4,r*0.32,a,0,7);c.fill();}c.fillStyle='#d9701a';c.beginPath();c.arc(x,y,r*0.28,0,7);c.fill();};
const FFLAME=(c,x,y,u)=>{const g=c.createRadialGradient(x,y-u*0.3,0,x,y-u*0.3,u*1.2);g.addColorStop(0,'rgba(255,200,100,.5)');g.addColorStop(1,'rgba(255,200,100,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*0.3,u*1.2,0,7);c.fill();TH.poly(c,[[x-u*0.1,y],[x+u*0.1,y],[x,y-u*0.4]],'#ffb030');TH.poly(c,[[x-u*0.05,y],[x+u*0.05,y],[x,y-u*0.22]],'#fff0a0');};
const FFROND=(c,x,y,ang,len,u,col,mid)=>{const ex=x+Math.cos(ang)*len,ey=y+Math.sin(ang)*len*0.6+len*0.33,mx=x+Math.cos(ang)*len*0.55,my=y+Math.sin(ang)*len*0.7-len*0.25;c.lineCap='round';c.strokeStyle=col;c.lineWidth=u*0.42;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(mx,my,ex,ey);c.stroke();c.strokeStyle=mid;c.lineWidth=u*0.1;c.stroke();for(let k=1;k<7;k++){const t=k/7,q=1-t,px=q*q*x+2*q*t*mx+t*t*ex,py=q*q*y+2*q*t*my+t*t*ey,sl=len*0.2*(1-t*0.6);TH.ln(c,[px,py],[px+Math.sin(ang)*sl*0.5-Math.cos(ang)*sl*0.2,py+sl*0.55],col,u*0.14);TH.ln(c,[px,py],[px-Math.sin(ang)*sl*0.5-Math.cos(ang)*sl*0.2,py+sl*0.55],col,u*0.14);}};
/* ---- little adobe houses: one parametric body, 4 orientations (door on the short or long wall x mirror) ---- */
const FHOUSE_T={casita:{ha:1.2,hb:1.55,h1:1.9,h2:0,roof:'flat',sw:3.0,sh:0.95},casaTile:{ha:1.15,hb:1.6,h1:1.55,h2:0,roof:'tile',rise:1.0,sw:3.0,sh:0.95},casaAlta:{ha:1.15,hb:1.4,h1:1.55,h2:1.3,roof:'flat',balcony:true,sw:2.8,sh:0.9}};
function FHOUSE_BODY(c,x,y,u,s,eave,T){const r=mulberry(s*7+3),Iw=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),L=(a,b,z)=>eave?Iw(b,a,z):Iw(a,b,z),LBOX=(a0,a1,b0,b1,z0,z1,col)=>eave?FBOX(c,x,y,u,b0,b1,a0,a1,z0,z1,col):FBOX(c,x,y,u,a0,a1,b0,b1,z0,z1,col);
  const pal=FPAL[s%6],wall=pal[0],trim=pal[1],acc=FCOL[(s+2)%6],acc2=FCOL[(s+4)%6],ha=T.ha,hb=T.hb,h1=T.h1,zw=h1+(T.h2||0);
  const faces=(aa,bb)=>[{J:(a,z)=>L(a,bb+0.012,z),p0:-aa,p1:aa},{J:(b,z)=>L(aa+0.012,b,z),p0:-bb,p1:bb}];
  LBOX(-ha,ha,-hb,hb,0,h1,wall);if(T.h2)LBOX(-ha*0.97,ha*0.97,-hb*0.97,hb*0.97,h1,zw,shade(wall,0.07));
  const F1=faces(ha,hb)[0],F2=faces(ha,hb)[1],U1=faces(ha*0.97,hb*0.97)[0],U2=faces(ha*0.97,hb*0.97)[1];
  const quad=(F,p0,p1,z0,z1,col,stroke)=>TH.poly(c,[F.J(p0,z0),F.J(p1,z0),F.J(p1,z1),F.J(p0,z1)],col,stroke,stroke?u*0.05:0);
  [F1,F2].forEach(F=>{quad(F,F.p0,F.p1,0,0.42,acc);TH.ln(c,F.J(F.p0,0.43),F.J(F.p1,0.43),trim,u*0.06);});
  const arched=(F,p,z0,w,zs,fill,frame)=>{const pts=FARCH(F.J,p,w,z0,zs);c.beginPath();FPATH(c,pts);c.fillStyle=fill;c.fill();c.strokeStyle=frame;c.lineWidth=u*0.1;c.stroke();};
  const win=(F,p,z0,lit)=>{arched(F,p,z0,0.24,z0+0.55,lit?'#ffe9a0':'#3a5a7a',trim);[-0.12,0,0.12].forEach(d=>TH.ln(c,F.J(p+d,z0+0.02),F.J(p+d,z0+0.62),'rgba(30,20,20,.7)',u*0.035));quad(F,p-0.24-0.18,p-0.24,z0,z0+0.6,acc2,'rgba(0,0,0,.2)');quad(F,p+0.24,p+0.24+0.18,z0,z0+0.6,acc2,'rgba(0,0,0,.2)');
    for(let k=0;k<4;k++){const q=F.J(p-0.2+k*0.13,z0-0.1);TH.ell(c,q[0],q[1],u*0.09,u*0.08,k%2?'#f08a24':'#f2c230');}};
  const doorF=eave?F2:F1,otherF=eave?F1:F2,doorU=eave?U2:U1,otherU=eave?U1:U2;
  arched(doorF,0,0,0.36,1.05,FCOL[(s+1)%6],trim);TH.ln(c,doorF.J(0,0.02),doorF.J(0,1.3),'rgba(0,0,0,.3)',u*0.05);TH.ell(c,...doorF.J(0.2,0.6),u*0.05,u*0.05,'#e8c84a');
  /* marigold garland over the door */
  for(let k=0;k<9;k++){const t=k/8,p=-0.5+t,z=1.5+Math.sin(t*Math.PI)*0.0-Math.sin(t*Math.PI)*0.22,q=doorF.J(p,z);FMARIGOLD(c,q[0],q[1],u*0.17);}
  const sp=doorF.p1*0.68;win(doorF,-sp,0.62,r()<0.7);win(doorF,sp,0.62,r()<0.7);win(otherF,-otherF.p1*0.45,0.62,r()<0.7);win(otherF,otherF.p1*0.45,0.62,r()<0.7);
  if(T.h2){const U=doorU;win(U,-U.p1*0.55,h1+0.3,r()<0.7);win(U,0,h1+0.3,r()<0.7);win(U,U.p1*0.55,h1+0.3,r()<0.7);win(otherU,0,h1+0.3,r()<0.7);}
  else{const q=otherF.J(0,1.35);FSKULL(c,q[0],q[1],u*0.42,s);}
  /* vigas (beam ends) under the roofline */
  [F1,F2].forEach(F=>{const n=Math.round((F.p1-F.p0)/0.55);for(let k=0;k<=n;k++){const q=F.J(F.p0+(F.p1-F.p0)*k/n,zw-0.2);TH.ell(c,q[0],q[1],u*0.07,u*0.07,'#7a5230');}});
  /* papel picado strung along the front */
  {const F=doorF,zt=zw-0.5,cols=FCOL;let prev=null;for(let k=0;k<=10;k++){const p=F.p0+(F.p1-F.p0)*k/10,q=F.J(p,zt-Math.sin(k/10*Math.PI)*0.18);if(prev)TH.ln(c,prev,q,'#e8e0d0',u*0.03);prev=q;if(k<10){const q2=F.J(p+(F.p1-F.p0)/20,zt-Math.sin((k+0.5)/10*Math.PI)*0.18);TH.poly(c,[[q2[0]-u*0.17,q2[1]],[q2[0]+u*0.17,q2[1]],[q2[0]+u*0.17,q2[1]+u*0.38],[q2[0],q2[1]+u*0.28],[q2[0]-u*0.17,q2[1]+u*0.38]],cols[(k+s)%6],'rgba(255,255,255,.5)',u*0.02);}}}
  if(T.roof==='flat'){
    const inset=0.22,roofPts=[L(-ha+inset,-hb+inset,zw+0.02),L(ha-inset,-hb+inset,zw+0.02),L(ha-inset,hb-inset,zw+0.02),L(-ha+inset,hb-inset,zw+0.02)];TH.poly(c,roofPts,'#b87858');
    const pw=0.26,pc=trim;LBOX(-ha,ha,-hb,-hb+0.18,zw,zw+pw,pc);LBOX(-ha,-ha+0.18,-hb,hb,zw,zw+pw,pc);LBOX(-ha,ha,hb-0.18,hb,zw,zw+pw,pc);LBOX(ha-0.18,ha,-hb,hb,zw,zw+pw,pc);
    for(let k=0;k<4;k++){const q=L(-ha*0.6+k*ha*0.4,hb-0.09,zw+pw+0.12);TH.blob(c,q[0],q[1],u*0.3,u*0.22,['#e8508a','#d9367a','#f06aa0','#c02a6a'][k%4],r,7);}
    if(T.balcony){const dF=doorF,Jb=eave?(a,z)=>L(ha*0.97+0.5,a,z):(a,z)=>L(a,hb*0.97+0.5,z),bw=(eave?hb:ha)*0.8;if(eave)LBOX(ha*0.97,ha*0.97+0.5,-bw,bw,h1-0.1,h1+0.05,'#4a3a30');else LBOX(-bw,bw,hb*0.97,hb*0.97+0.5,h1-0.1,h1+0.05,'#4a3a30');for(let k=0;k<=8;k++){const p=-bw+2*bw*k/8;TH.ln(c,Jb(p,h1+0.05),Jb(p,h1+0.55),'#1a1618',u*0.05);}TH.ln(c,Jb(-bw,h1+0.55),Jb(bw,h1+0.55),'#1a1618',u*0.07);for(let k=0;k<7;k++){const q=Jb(-bw+2*bw*(k+0.5)/7,h1+0.62);TH.blob(c,q[0],q[1]-u*0.05,u*0.15,u*0.12,k%2?'#d9367a':'#f08a24',r,6);}}
  }else{
    const ov=0.45,rise=T.rise,rA=L(ha+ov,-hb-ov,zw),rB=L(ha+ov,hb+ov,zw),rC=L(0,hb+ov,zw+rise),rD=L(0,-hb-ov,zw+rise);
    TH.poly(c,[L(-ha,hb+0.02,zw),L(ha,hb+0.02,zw),L(0,hb+0.02,zw+rise-0.08)],wall);TH.poly(c,[rA,rB,rC,rD],FTERRA);
    for(let k=1;k<5;k++)TH.ln(c,L(ha+ov-(ha+ov)*k/5,-hb-ov,zw+rise*k/5),L(ha+ov-(ha+ov)*k/5,hb+ov,zw+rise*k/5),'rgba(80,30,10,.35)',u*0.05);for(let k=0;k<14;k++){const bb=-hb-ov+(2*hb+2*ov)*k/13,p=L(ha+ov,bb,zw);TH.ell(c,p[0],p[1],u*0.12,u*0.08,'#a84a28');}
    TH.ln(c,L(-ha-ov,hb+ov,zw),L(0,hb+ov,zw+rise),'#8a3a20',u*0.1);TH.ln(c,L(ha+ov,hb+ov,zw),L(0,hb+ov,zw+rise),'#8a3a20',u*0.1);const gq=L(0,hb+0.03,zw+rise*0.4);TH.ell(c,gq[0],gq[1],u*0.2,u*0.22,'#fbf3e0');FSKULL(c,gq[0],gq[1],u*0.18,s);}
}
const FHOUSE=(key)=>({cat:'struct',rho:0.12,draw(c,x,y,u,v){const T=FHOUSE_T[key],o=v&3,s=v>>2,eave=(o>>1)&1;c.fillStyle='rgba(70,40,20,.24)';c.beginPath();c.ellipse(x+u*0.8,y+u*0.2,u*T.sw*(eave?1.15:1),u*T.sh,0,0,7);c.fill();FFLIP(c,x,o&1,()=>FHOUSE_BODY(c,x,y,u,s,eave,T));}});
const FIESTA_ASSETS={
  /* ---------- trees: a sparse desert garden ---------- */
  palm:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*11+2),H=u*(5.2+r()*1.6),lean=(r()-0.5)*u*2.0;FSH(c,x,y,u*1.3);c.lineCap='round';c.strokeStyle='#b09068';c.lineWidth=u*0.62;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*0.1,y-H*0.5,x+lean,y-H);c.stroke();c.strokeStyle='#cbb088';c.lineWidth=u*0.2;c.beginPath();c.moveTo(x-u*0.15,y);c.quadraticCurveTo(x+lean*0.1-u*0.15,y-H*0.5,x+lean-u*0.1,y-H);c.stroke();for(let k=1;k<9;k++){const t=k/9,q=1-t,px=q*q*x+2*q*t*(x+lean*0.1)+t*t*(x+lean),py=q*q*y+2*q*t*(y-H*0.5)+t*t*(y-H);TH.ln(c,[px-u*0.3,py],[px+u*0.3,py+u*0.05],'rgba(80,50,20,.35)',u*0.06);}
    const cx=x+lean,cy=y-H;[-2.9,-2.35,-1.85,-1.3,-0.7,-0.2].forEach((a,i)=>{FFROND(c,cx,cy,a,u*(2.5+r()*0.5),u,i%2?'#4a9a3a':'#5aaa44','#a8dc7a');FFROND(c,cx,cy,Math.PI-a,u*(2.3+r()*0.5),u,i%2?'#5aaa44':'#4a9a3a','#a8dc7a');});[[-0.25,0.2],[0.25,0.25]].forEach(([dx,dy])=>TH.ell(c,cx+dx*u,cy+dy*u,u*0.24,u*0.26,'#8a5a22'));}},
  jacaranda:{cat:'tree',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*7+1),H=u*(4.2+r()*1.0),pal=['#a68ad4','#b89ae0','#8f72c4','#c9b0ec'];FSH(c,x,y,u*2.2);c.lineCap='round';c.strokeStyle='#7a6a58';c.lineWidth=u*0.6;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.2,y-H*0.35,x+u*0.1,y-H*0.62);c.stroke();TH.ln(c,[x,y-H*0.5],[x-u*1.1,y-H*0.82],'#7a6a58',u*0.26);TH.ln(c,[x,y-H*0.55],[x+u*1.2,y-H*0.8],'#7a6a58',u*0.26);const cy=y-H*0.82;[[0,-0.3,1.9,1.1],[-1.5,0,1.2,0.95],[1.5,0,1.2,0.95],[-0.8,-1.05,1.3,0.9],[0.85,-1.05,1.3,0.9]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,10));for(let k=0;k<10;k++)TH.ell(c,x+(r()-0.5)*u*3.4,cy+(r()-0.5)*u*2,u*0.1,u*0.08,'#e0d0f6');}},
  orangeTree:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*23+1),H=u*(3.4+r()*0.6),pal=['#4f8a3a','#5f9a46','#3f7a32','#6faa52'];FSH(c,x,y,u*1.9);TH.ln(c,[x,y],[x,y-H*0.55],'#6a4a30',u*0.45);const cy=y-H*0.78;[[0,-0.2,1.5,1.0],[-1.1,0.1,1.0,0.8],[1.1,0.1,1.0,0.8],[-0.5,-0.9,1.0,0.8],[0.6,-0.9,1.0,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,9));for(let k=0;k<9;k++)TH.ell(c,x+(r()-0.5)*u*2.4,cy+u*(-0.9+r()*1.7),u*0.14,u*0.14,'#f08a24');}},
  cypress:{cat:'tree',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*13+1),H=u*(5.8+r()*1.6);FSH(c,x,y,u*1.0);TH.ln(c,[x,y],[x,y-u*1.0],'#5a3a22',u*0.3);const pal=['#2f6a3e','#3a7a48','#255a34','#448a52'];for(let k=0;k<8;k++){const t=k/7,yy=y-u*0.9-t*(H-u*1.2),rx=u*(0.5+0.3*Math.sin(Math.min(1,t*1.2)*Math.PI*0.85)),ry=u*0.8;TH.blob(c,x+(r()-0.5)*u*0.15,yy,rx,ry,pal[k%4],r,9);}}},
  mesquite:WEST_ASSETS.mesquite,
  saguaro:WEST_ASSETS.saguaro,
  /* ---------- undergrowth: marigolds everywhere ---------- */
  marigolds:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+9);TH.ell(c,x+u*0.2,y+u*0.08,u*1.2,u*0.34,'rgba(70,40,20,.2)');[[-0.6,-0.4,0.8,0.55],[0.6,-0.4,0.8,0.55],[0,-0.8,0.85,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#4f8a3a','#5f9a46','#3f7a32'][i],r,8));for(let k=0;k<16;k++){const fx=x+(r()-0.5)*u*1.8,fy=y-u*(0.3+r()*1.0);FMARIGOLD(c,fx,fy,u*0.28);}}},
  marigoldPatch:{cat:'shrub',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*3+2);TH.ell(c,x+u*0.2,y+u*0.1,u*1.6,u*0.45,'rgba(70,40,20,.18)');TH.ell(c,x,y,u*1.5,u*0.5,'#5a8a3a');for(let k=0;k<22;k++){const a=r()*6.283,rr=Math.sqrt(r()),fx=x+Math.cos(a)*rr*u*1.3,fy=y+Math.sin(a)*rr*u*0.42-u*0.2;FMARIGOLD(c,fx,fy,u*0.26);}}},
  bougainvillea:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*7+2),cols=[['#d9367a','#f06aa0'],['#a02a8a','#d060b8'],['#e8508a','#f4a0c0']][v%3];TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(70,40,20,.2)');[[-0.55,-0.45,0.85,0.6],[0.55,-0.45,0.85,0.6],[0,-0.9,0.9,0.65]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,cols[i%2],r,8));for(let k=0;k<16;k++)TH.ell(c,x+(r()-0.5)*u*1.9,y-u*(0.2+r()*1.1),u*0.1,u*0.08,k%2?cols[1]:'#fff0f6');}},
  agave:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*7+2);TH.ell(c,x+u*0.15,y+u*0.08,u*0.9,u*0.26,'rgba(70,40,20,.2)');for(let k=0;k<12;k++){const a=-Math.PI*0.97+k/11*Math.PI*0.94,l=u*(1.0+r()*0.5);TH.poly(c,[[x,y-u*0.15],[x+Math.cos(a-0.2)*l*0.5,y-u*0.15+Math.sin(a-0.2)*l*0.5],[x+Math.cos(a)*l,y-u*0.15+Math.sin(a)*l],[x+Math.cos(a+0.2)*l*0.5,y-u*0.15+Math.sin(a+0.2)*l*0.5]],k%2?'#6aa89a':'#7fbaa8');}}},
  pricklyPear:WEST_ASSETS.pricklyPear,
  barrelCactus:WEST_ASSETS.barrelCactus,
  dryGrass:WEST_ASSETS.dryGrass,
  stones:{cat:'rock',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.8,'#c8a888'],[0.7,0.2,0.8,0.7,'#d6b898'],[0,-0.35,0.7,0.6,'#b89878']].forEach(([dx,dy,rx,ry,col])=>{const px=x+dx*u,py=y+dy*u,sx=u*rx,sy=u*ry*(1+r()*0.2);TH.ell(c,px+sx*0.15,py+sy*0.3,sx*1.05,sy*0.45,'rgba(70,40,20,.25)');TH.poly(c,[[px-sx,py],[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px-sx*0.6,py+sy*0.2]],col);TH.poly(c,[[px+sx*0.25,py-sy*0.98],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px+sx*0.2,py+sy*0.05]],shade(col,-0.25));TH.poly(c,[[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.1,py-sy*0.5],[px-sx*0.5,py-sy*0.45]],shade(col,0.16));});}},
  lowWall:{cat:'rock',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*7+2),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),pal=FPAL[v%6];TH.ell(c,x+u*0.5,y+u*0.12,u*2.4,u*0.4,'rgba(70,40,20,.24)');FBOX(c,x,y,u,-2.0,2.0,-0.3,0.3,0,0.9,pal[0]);FBOX(c,x,y,u,-2.05,2.05,-0.34,0.34,0.9,1.0,pal[1]);for(let k=0;k<5;k++){const X=-1.6+k*0.8;const pts=FARCH((a,z)=>I(a,0.31,z),X,0.22,0.15,0.5);c.beginPath();FPATH(c,pts);c.fillStyle='rgba(60,30,20,.35)';c.fill();}for(let k=0;k<4;k++)TH.ell(c,...I(-1.4+k*0.9,0,1.15),u*0.18,u*0.14,FCOL[(v+k)%6]);}},
  /* ---------- little houses ---------- */
  casita:FHOUSE('casita'),casaTile:FHOUSE('casaTile'),casaAlta:FHOUSE('casaAlta'),
  /* ---------- the one tower: a small bell wall (espadaña) beside the houses ---------- */
  bellWall:{cat:'struct',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),pal=FPAL[(v>>2)%6];c.fillStyle='rgba(70,40,20,.26)';c.beginPath();c.ellipse(x+u*0.8,y+u*0.2,u*2.0,u*0.65,0,0,7);c.fill();FFLIP(c,x,v&1,()=>{
      FBOX(c,x,y,u,-1.4,1.4,-0.4,0.4,0,0.5,'#c8a888');FBOX(c,x,y,u,-1.2,1.2,-0.35,0.35,0.5,3.0,pal[1]);FBOX(c,x,y,u,-0.9,0.9,-0.32,0.32,3.0,4.4,pal[1]);
      const JY=(a,z)=>I(a,0.4,z);[[-0.5,2.6],[0.5,2.6]].forEach(([xc,zs])=>{const pts=FARCH((a,z)=>I(a,0.36,z),xc,0.3,1.6,zs);c.beginPath();FPATH(c,pts);c.fillStyle='#3a2a2a';c.fill();c.strokeStyle=pal[0];c.lineWidth=u*0.09;c.stroke();const bp=I(xc,0.36,2.1);c.fillStyle='#c89a3a';c.beginPath();c.moveTo(bp[0]-u*0.2,bp[1]+u*0.2);c.quadraticCurveTo(bp[0]-u*0.22,bp[1]-u*0.3,bp[0],bp[1]-u*0.32);c.quadraticCurveTo(bp[0]+u*0.22,bp[1]-u*0.3,bp[0]+u*0.2,bp[1]+u*0.2);c.fill();TH.ell(c,bp[0],bp[1]+u*0.22,u*0.07,u*0.07,'#5a3a22');});
      const ab=FARCH((a,z)=>I(a,0.33,z),0,0.28,3.4,3.9);c.beginPath();FPATH(c,ab);c.fillStyle='#3a2a2a';c.fill();c.strokeStyle=pal[0];c.lineWidth=u*0.08;c.stroke();
      const tp=I(0,0,4.4);TH.poly(c,[[tp[0]-u*1.0,tp[1]],[tp[0]+u*1.0,tp[1]],[tp[0],tp[1]-u*0.8]],pal[0]);TH.ln(c,[tp[0],tp[1]-u*0.8],[tp[0],tp[1]-u*1.6],'#e8c84a',u*0.1);TH.ln(c,[tp[0]-u*0.3,tp[1]-u*1.25],[tp[0]+u*0.3,tp[1]-u*1.25],'#e8c84a',u*0.1);
      FMARIGOLD(c,I(-1.0,0.4,0.9)[0],I(-1.0,0.4,0.9)[1],u*0.2);FMARIGOLD(c,I(1.0,0.4,0.9)[0],I(1.0,0.4,0.9)[1],u*0.2);for(let k=0;k<5;k++){const q=I(-0.9+k*0.45,0.4,0.55);TH.ell(c,q[0],q[1],u*0.12,u*0.1,FCOL[k%6]);}});}},
  /* ---------- Day of the Dead pieces ---------- */
  ofrenda:{cat:'ruin',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*5+9),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);FFLIP(c,x,v&1,()=>{FSH(c,x,y,u*3.0);
      [[-1.5,1.5,-0.9,0.9,0,0.9,'#6a3a8a'],[-1.15,1.15,-0.7,0.7,0.9,1.7,'#d9367a'],[-0.8,0.8,-0.5,0.5,1.7,2.4,'#f08a24']].forEach(([a,b,c0,c1,z0,z1,col])=>{FBOX(c,x,y,u,a,b,c0,c1,z0,z1,col);const n=Math.round((b-a)/0.3);for(let k=0;k<=n;k++){const q=I(a+(b-a)*k/n,c1+0.01,z1-0.12);TH.poly(c,[[q[0]-u*0.14,q[1]],[q[0]+u*0.14,q[1]],[q[0],q[1]+u*0.3]],k%2?'#fbf3e0':FCOL[k%6]);}});
      [[-0.9,2.4],[-0.3,2.4],[0.3,2.4],[0.9,2.4]].forEach(([X,Z],i)=>{});
      for(let k=0;k<7;k++){const q=I(-1.3+k*0.43,0.91,0.9);FMARIGOLD(c,q[0],q[1],u*0.22);}for(let k=0;k<5;k++){const q=I(-0.95+k*0.48,0.71,1.7);FMARIGOLD(c,q[0],q[1],u*0.2);}
      [[-0.9,1.7],[-0.35,1.7],[0.25,1.7],[0.85,1.7]].forEach(([X,Z],i)=>{const q=I(X,0.55,Z);TH.poly(c,[[q[0]-u*0.14,q[1]],[q[0]+u*0.14,q[1]],[q[0]+u*0.12,q[1]-u*0.5],[q[0]-u*0.12,q[1]-u*0.5]],'#fbf3e0','#6a4a30',u*0.04);FFLAME(c,q[0]+u*0.0,q[1]-u*0.5,u*0.6);});
      [-0.8,0.1,0.9].forEach((X,i)=>{const q=I(X,0.35,2.4);FSKULL(c,q[0],q[1]-u*0.3,u*0.28,i+v);});const fr=I(0,0.2,2.4);TH.poly(c,[[fr[0]-u*0.4,fr[1]-u*0.2],[fr[0]+u*0.4,fr[1]-u*0.2],[fr[0]+u*0.4,fr[1]-u*1.2],[fr[0]-u*0.4,fr[1]-u*1.2]],'#e8d8b8','#6a3a1a',u*0.08);TH.ell(c,fr[0],fr[1]-u*0.8,u*0.2,u*0.25,'#a88a6a');
      const top=I(0,0,2.4);c.strokeStyle='#e8d8b8';c.lineWidth=u*0.1;c.beginPath();c.moveTo(top[0]-u*1.5,top[1]+u*0.3);c.quadraticCurveTo(top[0],top[1]-u*3.0,top[0]+u*1.5,top[1]+u*0.3);c.stroke();for(let k=0;k<11;k++){const t=k/10,bx=(1-t)*(1-t)*(top[0]-u*1.5)+2*(1-t)*t*top[0]+t*t*(top[0]+u*1.5),by=(1-t)*(1-t)*(top[1]+u*0.3)+2*(1-t)*t*(top[1]-u*3.0)+t*t*(top[1]+u*0.3);FMARIGOLD(c,bx,by,u*0.2);}
      const py=top[1]-u*2.1;for(let k=0;k<7;k++){const px=top[0]-u*1.2+k*u*0.4;TH.poly(c,[[px-u*0.18,py+(k%2)*u*0.1],[px+u*0.18,py+(k%2)*u*0.1],[px+u*0.18,py+u*0.9],[px,py+u*0.7],[px-u*0.18,py+u*0.9]],FCOL[(k+v)%6],'rgba(255,255,255,.4)',u*0.02);}});}},
  marigoldArch:{cat:'ruin',rho:0.07,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);FFLIP(c,x,v&1,()=>{FSH(c,x,y,u*2.2);[-1.6,1.6].forEach(X=>{TH.ln(c,I(X,0,0),I(X,0,3.2),FWOODD,u*0.3);for(let k=0;k<7;k++){const q=I(X,0,0.3+k*0.45);FMARIGOLD(c,q[0],q[1],u*0.26);}});
      for(let k=0;k<=16;k++){const t=k/16,X=-1.6+3.2*t,Z=3.2+Math.sin(t*Math.PI)*0.9,q=I(X,0,Z);FMARIGOLD(c,q[0],q[1],u*0.28);}for(let k=0;k<8;k++){const t=(k+0.5)/8,X=-1.5+3.0*t,Z=3.1+Math.sin(t*Math.PI)*0.8,q=I(X,0,Z);TH.poly(c,[[q[0]-u*0.2,q[1]+u*0.2],[q[0]+u*0.2,q[1]+u*0.2],[q[0]+u*0.2,q[1]+u*0.9],[q[0],q[1]+u*0.7],[q[0]-u*0.2,q[1]+u*0.9]],FCOL[(k+v)%6],'rgba(255,255,255,.4)',u*0.02);}
      const top=I(0,0,4.15);FSKULL(c,top[0],top[1]-u*0.15,u*0.36,v);});}},
  catrinaStatue:{cat:'ruin',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*7+3);FFLIP(c,x,v&1,()=>{FSH(c,x,y,u*1.6);c.fillStyle='#c8a888';c.fillRect(x-u*0.8,y-u*0.8,u*1.6,u*0.8);TH.ell(c,x,y-u*0.8,u*0.8,u*0.28,'#d6b898');TH.ell(c,x,y,u*0.8,u*0.28,'#b89878');
      const by=y-u*0.8;c.fillStyle='#4a2a6a';c.beginPath();c.moveTo(x-u*1.0,by);c.quadraticCurveTo(x-u*0.9,by-u*1.8,x-u*0.4,by-u*3.0);c.lineTo(x+u*0.4,by-u*3.0);c.quadraticCurveTo(x+u*0.9,by-u*1.8,x+u*1.0,by);c.closePath();c.fill();for(let k=0;k<4;k++){c.fillStyle=FCOL[k+1];c.beginPath();c.ellipse(x-u*0.6+k*u*0.4,by-u*0.3,u*0.18,u*0.12,0,0,7);c.fill();}TH.ln(c,[x-u*0.5,by-u*1.4],[x+u*0.5,by-u*1.4],'#e8508a',u*0.12);
      TH.ln(c,[x-u*0.4,by-u*2.9],[x-u*1.0,by-u*2.0],'#fbf3e0',u*0.26);TH.ln(c,[x+u*0.4,by-u*2.9],[x+u*1.0,by-u*2.1],'#fbf3e0',u*0.26);const hy=by-u*3.7;FSKULL(c,x,hy,u*0.62,v);
      c.fillStyle='#2a1a3a';c.beginPath();c.ellipse(x,hy-u*0.85,u*1.5,u*0.32,0,0,7);c.fill();c.beginPath();c.ellipse(x,hy-u*1.05,u*0.7,u*0.4,0,0,7);c.fill();for(let k=0;k<6;k++){const a=k/6*6.283;FMARIGOLD(c,x+Math.cos(a)*u*1.3,hy-u*0.9+Math.sin(a)*u*0.25,u*0.18);}[[-0.5,-1.5],[0.5,-1.7],[0,-1.9]].forEach(([dx,dy],i)=>TH.ell(c,x+dx*u,hy+dy*u,u*0.12,u*0.3,FCOL[(i+3)%6],0.3*(i-1)));});}},
  skeletonBand:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*5+9),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);FFLIP(c,x,v&1,()=>{FSH(c,x,y,u*3.0);FBOX(c,x,y,u,-2.0,2.0,-0.9,0.9,0,0.35,'#a8784a');
      const skel=(X,kind,col)=>{const b=I(X,0.1,0.35),bx=b[0],by=b[1];TH.ln(c,[bx-u*0.18,by],[bx-u*0.18,by-u*0.9],'#2a2a30',u*0.2);TH.ln(c,[bx+u*0.18,by],[bx+u*0.18,by-u*0.9],'#2a2a30',u*0.2);TH.poly(c,[[bx-u*0.4,by-u*0.9],[bx+u*0.4,by-u*0.9],[bx+u*0.32,by-u*2.0],[bx-u*0.32,by-u*2.0]],'#1a1a20');TH.ln(c,[bx,by-u*0.95],[bx,by-u*1.95],'#c0c4cc',u*0.07);for(let k=0;k<4;k++)TH.ell(c,bx,by-u*(1.1+k*0.22),u*0.07,u*0.07,'#d0d4dc');
        TH.ln(c,[bx-u*0.3,by-u*1.9],[bx-u*0.75,by-u*1.3],'#fbf3e0',u*0.13);TH.ln(c,[bx+u*0.3,by-u*1.9],[bx+u*0.75,by-u*1.4],'#fbf3e0',u*0.13);FSKULL(c,bx,by-u*2.45,u*0.4,v+X);TH.ell(c,bx,by-u*2.85,u*0.85,u*0.2,'#1a1a20');TH.poly(c,[[bx-u*0.4,by-u*2.85],[bx+u*0.4,by-u*2.85],[bx+u*0.25,by-u*3.4],[bx-u*0.25,by-u*3.4]],'#1a1a20');TH.ln(c,[bx-u*0.4,by-u*2.9],[bx+u*0.4,by-u*2.9],col,u*0.09);
        if(kind===0){c.fillStyle='#a8652a';c.beginPath();c.ellipse(bx-u*0.7,by-u*1.35,u*0.38,u*0.3,0.6,0,7);c.fill();TH.ln(c,[bx-u*0.55,by-u*1.55],[bx-u*1.5,by-u*2.4],'#6a4a2a',u*0.1);}else if(kind===1){TH.ln(c,[bx+u*0.7,by-u*1.45],[bx+u*1.5,by-u*1.9],'#e8c84a',u*0.14);TH.poly(c,[[bx+u*1.5,by-u*1.8],[bx+u*1.85,by-u*2.0],[bx+u*1.5,by-u*2.1]],'#e8c84a');}else{TH.ln(c,[bx-u*0.5,by-u*1.6],[bx+u*0.7,by-u*1.2],'#a8652a',u*0.1);TH.ln(c,[bx-u*0.6,by-u*1.1],[bx+u*0.9,by-u*1.9],'#6a4a2a',u*0.05);}};
      skel(-1.2,0,'#e8508a');skel(0,1,'#2ab5b0');skel(1.2,2,'#f2c230');
      const top=I(0,-0.9,3.4);const cols=FCOL;for(let k=0;k<9;k++){const q=I(-1.8+k*0.45,-0.9,3.2);TH.poly(c,[[q[0]-u*0.2,q[1]],[q[0]+u*0.2,q[1]],[q[0]+u*0.2,q[1]+u*0.9],[q[0],q[1]+u*0.7],[q[0]-u*0.2,q[1]+u*0.9]],cols[(k+v)%6],'rgba(255,255,255,.4)',u*0.02);}TH.ln(c,I(-2.0,-0.9,3.3),I(2.0,-0.9,3.3),'#e8e0d0',u*0.05);[-2.0,2.0].forEach(X=>TH.ln(c,I(X,-0.9,0.35),I(X,-0.9,3.3),FWOODD,u*0.16));});}},
  panteon:{cat:'ruin',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*5+9),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);FSH(c,x,y,u*2.6);TH.blob(c,x,y+u*0.1,u*2.4,u*0.9,'#b89878',r,10);
      const grave=(X,Y,kind,col)=>{const b=I(X,Y,0);c.fillStyle='rgba(60,30,20,.3)';c.beginPath();c.ellipse(b[0]+u*0.25,b[1]+u*0.05,u*0.5,u*0.18,0,0,7);c.fill();TH.blob(c,b[0],b[1]-u*0.05,u*0.8,u*0.3,col,r,9);for(let k=0;k<8;k++)FMARIGOLD(c,b[0]+(r()-0.5)*u*1.2,b[1]-u*0.15+(r()-0.5)*u*0.3,u*0.16);
        if(kind===0){c.fillStyle='#fbf3e0';c.fillRect(b[0]-u*0.12,b[1]-u*1.7,u*0.24,u*1.6);c.fillRect(b[0]-u*0.5,b[1]-u*1.35,u*1.0,u*0.22);TH.ln(c,[b[0],b[1]-u*1.7],[b[0],b[1]-u*0.1],FCOL[(v+X)%6|0],u*0.05);}else{c.fillStyle='#fbf3e0';c.beginPath();c.moveTo(b[0]-u*0.45,b[1]-u*0.1);c.lineTo(b[0]-u*0.45,b[1]-u*1.3);c.arc(b[0],b[1]-u*1.3,u*0.45,Math.PI,0);c.lineTo(b[0]+u*0.45,b[1]-u*0.1);c.closePath();c.fill();c.strokeStyle='#6a4a3a';c.lineWidth=u*0.05;c.stroke();FSKULL(c,b[0],b[1]-u*1.15,u*0.22,v+Y);}
        [[-0.7,0.25],[0.7,0.2]].forEach(([dx,dy])=>{const cp=[b[0]+dx*u,b[1]+dy*u];c.fillStyle='#fbf3e0';c.fillRect(cp[0]-u*0.08,cp[1]-u*0.55,u*0.16,u*0.55);FFLAME(c,cp[0],cp[1]-u*0.55,u*0.6);});};
      grave(-1.0,-0.5,0,'#6a3a8a');grave(0.6,-0.3,1,'#d9367a');grave(1.6,0.3,0,'#f08a24');}},
  marketStall:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*7+3),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),k=v%3,awn=k===0?['#e8508a','#f6e0e8']:k===1?['#2ab5b0','#fbf3e0']:['#f08a24','#f2c230'];FFLIP(c,x,(v>>2)&1,()=>{FSH(c,x,y,u*2.2);
      TH.poly(c,[I(-1.5,-0.7,0),I(1.5,-0.7,0),I(1.5,-0.7,2.2),I(-1.5,-0.7,2.2)],'#7a4a30');[-1.5,1.5].forEach(X=>[-0.7,0.7].forEach(Y=>TH.ln(c,I(X,Y,0),I(X,Y,2.2),FWOODD,u*0.14)));FBOX(c,x,y,u,-1.5,1.5,0.1,0.7,0.2,0.95,'#d9a8c0');FBOX(c,x,y,u,-1.55,1.55,0.05,0.75,0.95,1.05,'#f6e0e8');
      for(let i=0;i<6;i++){const p=I(-1.2+i*0.5,0.4,1.05);if(k===0)FSKULL(c,p[0],p[1]-u*0.28,u*0.26,i+v);else if(k===1){c.fillStyle='#c8803a';c.beginPath();c.ellipse(p[0],p[1]-u*0.2,u*0.28,u*0.2,0,0,7);c.fill();TH.ln(c,[p[0]-u*0.2,p[1]-u*0.22],[p[0]+u*0.2,p[1]-u*0.22],'#fbf3e0',u*0.06);TH.ln(c,[p[0],p[1]-u*0.38],[p[0],p[1]-u*0.05],'#fbf3e0',u*0.06);}else{for(let j=0;j<3;j++)FMARIGOLD(c,p[0]+(j-1)*u*0.14,p[1]-u*(0.25+j*0.08),u*0.2);}}
      const n=10,aw=3.2/n;for(let i=0;i<n;i++){const X0=-1.6+i*aw,X1=X0+aw;TH.poly(c,[I(X0,1.0,2.0),I(X1,1.0,2.0),I(X1,-0.7,2.7),I(X0,-0.7,2.7)],awn[i%2]);const e=I(X0+aw/2,1.0,2.0);c.fillStyle=awn[i%2];c.beginPath();c.ellipse(e[0],e[1],u*0.22,u*0.16,0,0,Math.PI);c.fill();}
      for(let i=0;i<8;i++){const q=I(-1.4+i*0.4,1.0,1.95);TH.poly(c,[[q[0]-u*0.14,q[1]],[q[0]+u*0.14,q[1]],[q[0],q[1]+u*0.5]],FCOL[(i+v)%6]);}});}},
  calaveraStatue:{cat:'ruin',rho:0.05,draw(c,x,y,u,v){FFLIP(c,x,v&1,()=>{FSH(c,x,y,u*1.6);c.fillStyle='#c8a888';c.fillRect(x-u*0.9,y-u*1.0,u*1.8,u*1.0);TH.ell(c,x,y-u*1.0,u*0.9,u*0.3,'#d6b898');TH.ell(c,x,y,u*0.9,u*0.3,'#b89878');FSKULL(c,x,y-u*2.4,u*1.35,v);for(let k=0;k<6;k++){const a=k/6*6.283;FMARIGOLD(c,x+Math.cos(a)*u*1.1,y-u*0.95+Math.sin(a)*u*0.3,u*0.2);}});}},
  /* ---------- small props (lower tiers only) ---------- */
  papelPicado:{cat:'prop',rho:0.12,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*2.4,u*0.4,'rgba(70,40,20,.14)');[-2.2,2.2].forEach(X=>TH.ln(c,I(X,0,0),I(X,0,3.4),'#6a4a2a',u*0.18));let prev=null;for(let k=0;k<=12;k++){const X=-2.2+4.4*k/12,p=I(X,0,3.3-Math.sin(k/12*Math.PI)*0.7);if(prev)TH.ln(c,prev,p,'#e8e0d0',u*0.04);prev=p;if(k<12){const q=I(X+0.18,0,3.3-Math.sin((k+0.5)/12*Math.PI)*0.7);TH.poly(c,[[q[0]-u*0.22,q[1]],[q[0]+u*0.22,q[1]],[q[0]+u*0.22,q[1]+u*0.45],[q[0]+u*0.11,q[1]+u*0.36],[q[0],q[1]+u*0.5],[q[0]-u*0.11,q[1]+u*0.36],[q[0]-u*0.22,q[1]+u*0.45]],FCOL[(k+v)%6],'rgba(255,255,255,.5)',u*0.03);}}}},
  farol:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(70,40,20,.24)');TH.ln(c,[x,y],[x,y-u*3.1],'#2a2d36',u*0.2);TH.ln(c,[x,y-u*2.95],[x+u*0.55,y-u*2.95],'#2a2d36',u*0.12);const lx=x+u*0.55,ly=y-u*2.9,g=c.createRadialGradient(lx,ly-u*0.3,0,lx,ly-u*0.3,u*1.6);g.addColorStop(0,'rgba(255,190,90,.55)');g.addColorStop(1,'rgba(255,190,90,0)');c.fillStyle=g;c.beginPath();c.arc(lx,ly-u*0.3,u*1.6,0,7);c.fill();TH.poly(c,[[lx-u*0.28,ly],[lx+u*0.28,ly],[lx+u*0.2,ly-u*0.65],[lx-u*0.2,ly-u*0.65]],FCOL[v%6],'#2a2d36',u*0.06);TH.poly(c,[[lx-u*0.3,ly-u*0.65],[lx+u*0.3,ly-u*0.65],[lx,ly-u*1.0]],'#2a2d36');TH.ell(c,lx,ly-u*0.3,u*0.1,u*0.16,'#ffe9a0');}},
  ollas:{cat:'prop',rho:0.05,draw(c,x,y,u,v){const pot=(px,py,s,col,flowers)=>{TH.ell(c,px+s*u*0.3,py+s*u*0.1,s*u*0.8,s*u*0.26,'rgba(70,40,20,.24)');const w=s*u*0.6,h=s*u*1.1;c.fillStyle=col;c.beginPath();c.moveTo(px-w*0.55,py);c.bezierCurveTo(px-w*1.3,py-h*0.4,px-w*0.8,py-h*0.9,px-w*0.5,py-h);c.lineTo(px+w*0.5,py-h);c.bezierCurveTo(px+w*0.8,py-h*0.9,px+w*1.3,py-h*0.4,px+w*0.55,py);c.ellipse(px,py,w*0.55,w*0.2,0,0,Math.PI);c.fill();TH.ln(c,[px-w*0.9,py-h*0.55],[px+w*0.9,py-h*0.55],'rgba(255,255,255,.6)',s*u*0.08);for(let k=0;k<5;k++)TH.ell(c,px+(k-2)*w*0.3,py-h*0.55,s*u*0.06,s*u*0.06,FCOL[k%6]);TH.ell(c,px,py-h,w*0.5,w*0.18,'#7a3a20');if(flowers)for(let k=0;k<4;k++)FMARIGOLD(c,px+(k-1.5)*w*0.3,py-h-s*u*0.15,s*u*0.2);};pot(x-u*0.7,y,1.0,'#c0603a',true);pot(x+u*0.6,y+u*0.1,0.85,'#d9703a',false);pot(x,y-u*0.2,0.8,'#a84a28',true);}},
  veladoras:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*1.2,u*0.3,'rgba(70,40,20,.22)');[[-0.5,0,1.5],[0.1,0.1,1.9],[0.6,-0.05,1.3],[-0.15,-0.2,1.6]].forEach(([dx,dy,h],i)=>{const px=x+dx*u,py=y+dy*u;c.fillStyle=['rgba(232,80,138,.9)','rgba(240,160,40,.9)','rgba(42,181,176,.9)','rgba(250,240,200,.95)'][i];c.fillRect(px-u*0.22,py-h*u*0.8,u*0.44,h*u*0.8);TH.ell(c,px,py,u*0.22,u*0.09,'rgba(0,0,0,.25)');TH.ell(c,px,py-h*u*0.8,u*0.22,u*0.09,'rgba(255,240,200,.6)');FFLAME(c,px,py-h*u*0.8,u*0.7);});}},
  pinata:{cat:'prop',rho:0.05,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.26,'rgba(70,40,20,.24)');TH.ln(c,[x,y],[x,y-u*4.0],'#6a4a2a',u*0.2);TH.ln(c,[x,y-u*3.9],[x+u*1.2,y-u*3.9],'#6a4a2a',u*0.14);TH.ln(c,[x+u*1.2,y-u*3.9],[x+u*1.2,y-u*3.2],'#e8e0d0',u*0.04);const px=x+u*1.2,py=y-u*2.7;for(let k=0;k<8;k++){const a=k/8*6.283,rr=u*0.95;TH.poly(c,[[px+Math.cos(a-0.3)*u*0.5,py+Math.sin(a-0.3)*u*0.5],[px+Math.cos(a)*rr,py+Math.sin(a)*rr],[px+Math.cos(a+0.3)*u*0.5,py+Math.sin(a+0.3)*u*0.5]],FCOL[k%6]);}TH.ell(c,px,py,u*0.62,u*0.62,'#f2c230');TH.ell(c,px,py,u*0.4,u*0.4,'#e8508a');for(let k=0;k<6;k++){const a=k/6*6.283;TH.ln(c,[px+Math.cos(a)*u*0.9,py+Math.sin(a)*u*0.9],[px+Math.cos(a)*u*1.2,py+Math.sin(a)*u*1.2+u*0.2],FCOL[(k+2)%6],u*0.08);}}}
};

/* ===== MACRO-LAND ENGINE (hex geometry, path network, planner, baker) ===== */
const W3=Math.sqrt(3),HX=W3/2,HV=[[HX,0.29],[0,0.58],[-HX,0.29],[-HX,-0.29],[0,-0.58],[HX,-0.29]];
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[0,1,2],[-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5,1.5]],C:[[0],[-0.5,0.5,1.5],[-1,0,1],[-0.5]],D:[[0,1,2],[-0.5,0.5,1.5],[0,1]]};
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

function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol,clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]),key=[T.id,shape,tier,R,m,ground,sc,JSON.stringify(clr),JSON.stringify(opts.clearTiles||[])].join('|');const cached=revisedLandCache.get(key);if(cached)return cached;
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=0.75,top=T.top||1.35,bot=0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);return[cv,g];};
  const [back,cb]=mk();T.ground(cb,G,R,ox,oy,m,ground,({A:11,B:22,C:33,D:44})[shape]);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]),vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho))&&!(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));
  const sprites=vis.map(o=>{const unit=u*(o.scale||1);return {x:m*o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>T.assets[o.kind].draw(ctx,x,y,unit,o.v)};});
  const front=document.createElement('canvas'),frontRect={x:0,y:0,w:1,h:1};front.width=front.height=1;
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return revisedLandCache.set(key,{back,front,frontRect,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0,sprites});
}
function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}

/* ===== FIESTA LAND (Day of the Dead): planner (Western-level sparse trees, little adobe houses sprinkled around, ofrendas / skeleton band / cemetery plots / marigold arch, no terrain) ===== */
const FIESTA_REGION={top:{palm:.22,jacaranda:.16,mesquite:.22,orangeTree:.16,cypress:.12,saguaro:.12},mid:{palm:.22,jacaranda:.16,mesquite:.22,orangeTree:.16,cypress:.12,saguaro:.12},bottom:{palm:.2,jacaranda:.14,mesquite:.24,orangeTree:.22,cypress:.08,saguaro:.12}};
const FIESTA_LOW=[['orangeTree',0.75],['jacaranda',0.6],['mesquite',0.8],['palm',0.55],['orangeTree',0.85],['mesquite',0.65]];
const FIESTA_CAP={saguaro:6,cypress:8};
const FIESTA_UNDER=['marigolds','marigolds','bougainvillea','agave','marigoldPatch','pricklyPear','marigolds','barrelCactus','dryGrass','stones'];
const FIESTA_PLAN_CACHE={};
function getFiestaPlan(shape){
  if(FIESTA_PLAN_CACHE[shape])return FIESTA_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(({A:7301,B:8402,C:9555,D:10656})[shape]),placed=[],bb=G.bbox,used={},A=FIESTA_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.66);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'mesquite';};
  const capOk=k=>!(FIESTA_CAP[k]&&(used[k]||0)>=FIESTA_CAP[k]);
  const regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?FIESTA_REGION.top:n<0.68?FIESTA_REGION.mid:FIESTA_REGION.bottom;};
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='tree'?0.88+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;if((D.cat==='tree'||D.cat==='shrub'||D.cat==='prop')&&placed.some(o=>o.noSouth&&Math.abs(px-o.x)<0.3&&py-o.y>-0.05&&py-o.y<0.36))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const tree=(x,y,extra,dom,low)=>{if(low){const L=FIESTA_LOW[Math.floor(rng()*FIESTA_LOW.length)];return place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return place(dom&&rng()<0.55&&capOk(dom)?dom:pickFrom(regionOf(y),capOk),x,y,extra||{});};
  const under=(x,y,extra)=>place(FIESTA_UNDER[Math.floor(rng()*FIESTA_UNDER.length)],x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const LKS=G.centers.length/12,landThin=l=>{const n=Math.max(1,Math.round(l.length*LKS));return Array.from({length:n},(_,i)=>l[Math.floor((i+0.5)*l.length/n)]);},landCnt=n=>Math.max(1,Math.round(n*LKS));
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. the back rim carries the grand ofrenda altar (no tree backdrop: the trees there are the same density as everywhere else) */
  {const pts=[];top.forEach(e=>[0.3,0.5,0.7].forEach(t=>pts.push(onEdge(e,t,0.0))));const p=pts.reduce((b,q)=>Math.abs(q[0]-cx)<Math.abs(b[0]-cx)?q:b);for(const [dx,dy] of [[0,-0.02],[0.3,0],[-0.3,0],[0,0.04]]){const o=place('ofrenda',p[0]+dx,p[1]+dy,{minT:1,scale:1.3,clear:2.4,noSouth:true});if(o)break;}}
  /* 2. little adobe houses sprinkled around: 4 on the rim (spread by farthest-point), 4 through the middle, then ONE bell wall beside a house */
  const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.filter(e=>e.vertical).forEach(e=>inn.push([e.mid[0],e.mid[1]]));
  const chosen=placed.filter(o=>o.cat==='ruin'||o.cat==='struct').map(o=>[o.x,o.y]),manors=[];
  const spread=(k,pool,extra)=>{const ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.22})).sort((a,b)=>b.d-a.d);for(let n=0;n<Math.min(12,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],extra);if(o){chosen.push([o.x,o.y]);if(/^(casita|casaTile|casaAlta)$/.test(k))manors.push(o);return o;}}return null;};
  landThin([['casita',1],['casaTile',2],['casaAlta',3],['casita',4]]).forEach(([k,mt])=>spread(k,rim,{minT:mt,scale:1.15,clear:2.5,noSouth:true}));
  landThin([['casaTile',2],['casita',3],['casaAlta',4],['casaTile',4]]).forEach(([k,mt])=>spread(k,inn,{minT:mt,scale:1.0,clear:3.0,noSouth:true}));
  {const home=manors[manors.length-1]||placed.find(o=>o.cat==='struct');if(home){for(const [dx,dy] of [[0.36,-0.08],[-0.36,-0.08],[0.3,0.12],[-0.3,0.12],[0.44,0.0],[-0.44,0.0]]){const o=place('bellWall',home.x+dx,home.y+dy,{minT:4,scale:1.1,clear:2.4,noSouth:true});if(o)break;}}}
  /* 2b. Day of the Dead pieces scattered through the land (farthest-point spacing): stalls, cemetery plots, a marigold arch, a second ofrenda, the skeleton band, a Catrina and a calavera statue */
  landThin([['marketStall',1],['panteon',2],['marigoldArch',2],['ofrenda',3],['skeletonBand',3],['catrinaStatue',3],['marketStall',4],['panteon',4],['calaveraStatue',4]]).forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,scale:k==='marketStall'||k==='panteon'?1.1:1.0,clear:1.8,noSouth:true}));
  /* 3. trees: very dark, same dense dials as the medieval land (and the top rim is treated exactly like every other edge) */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=pickFrom(regionOf(v.y),capOk),n=rng()<0.6?1+Math.floor(rng()*1.5):0;for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.09:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{const dom=pickFrom(regionOf(e.mid[1]),capOk);[-0.2,0.2].forEach(dy=>{if(rng()<0.3)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.3)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.8+rng()*0.2},null,true);if(rng()<0.0)tree(e.mid[0]+(rng()-0.5)*0.34,e.mid[1]+(rng()-0.5)*0.14,{scale:0.78+rng()*0.2},null,true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.36));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(rng()-0.2)*0.12)});});
    let mode='grove',run=0,dom='mesquite';samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.5?'grove':r<0.8?'sparse':'open';run=2+Math.floor(rng()*4);dom=pickFrom(regionOf(s.p[1]),capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){tree(p[0],p[1],null,dom,low);if(rng()<0.3)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,dom,low);if(rng()<0.08)tree(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,dom,true);if(rng()<0.04)tree(p[0]+(rng()-0.5)*0.34,p[1]-0.2,null,dom,low);}
      else if(mode==='sparse'){if(rng()<0.5)tree(p[0],p[1],null,dom,low);else under(p[0],p[1]);}else if(rng()<0.6)under(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.5)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<8;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.1)tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);}});
  /* 3c. balance the rim: the top, the sides and the bottom must carry the same tree density per unit of boundary (thin the heavy edges, fill the light ones) */
  {const dEdge=(x,y,e)=>{const dx=e.b[0]-e.a[0],dy=e.b[1]-e.a[1],t=Math.max(0,Math.min(1,((x-e.a[0])*dx+(y-e.a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-(e.a[0]+dx*t),(y-(e.a[1]+dy*t))*1.4);};
    const classes=['top','side','bottom'],len={top:0,side:0,bottom:0};outer.forEach(e=>len[e.cls]+=e.len);
    const members=()=>{const m={top:[],side:[],bottom:[]};placed.filter(o=>o.cat==='tree').forEach(o=>{let best=null,bd=1e9;outer.forEach(e=>{const d=dEdge(o.x,o.y,e);if(d<bd){bd=d;best=e;}});if(bd<0.32)m[best.cls].push(o);});return m;};
    let m=members();const mean=(m.top.length+m.side.length+m.bottom.length)/(len.top+len.side+len.bottom);
    classes.forEach(cl=>{const target=Math.round(len[cl]*mean);let list=m[cl];
      if(list.length>target+1){const drop=list.length-target;for(let i=0;i<drop;i++){const pick=list.splice(Math.floor(rng()*list.length),1)[0],ix=placed.indexOf(pick);if(ix>=0)placed.splice(ix,1);}}
      else if(list.length<target-1){const need=target-list.length,es=outer.filter(e=>e.cls===cl);let added=0,guard=0;while(added<need&&guard++<160){const e=es[Math.floor(rng()*es.length)],p=onEdge(e,rng(),(rng()-0.2)*0.12);if(tree(p[0],p[1],null,null,cl!=='top'))added++;}}});}
  /* 3d. sparse lands vary a lot with random placement, so pull the tree total to the Western-level target (add or thin interior trees; the balanced rim is left alone) */
  {const TARGET=88,dE=(x,y,e)=>{const dx=e.b[0]-e.a[0],dy=e.b[1]-e.a[1],t=Math.max(0,Math.min(1,((x-e.a[0])*dx+(y-e.a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-(e.a[0]+dx*t),(y-(e.a[1]+dy*t))*1.4);};
    const isRim=o=>outer.some(e=>dE(o.x,o.y,e)<0.32),trees=()=>placed.filter(o=>o.cat==='tree');
    let n=trees().length;
    if(n>TARGET){const inner=trees().filter(o=>!isRim(o));let drop=Math.min(n-TARGET,inner.length);while(drop-->0){const o=inner.splice(Math.floor(rng()*inner.length),1)[0],ix=placed.indexOf(o);if(ix>=0)placed.splice(ix,1);}}
    else if(n<TARGET){let guard=0;while(trees().length<TARGET&&guard++<900){const c=G.centers[Math.floor(rng()*G.centers.length)],px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);}}}
  /* 4. undergrowth: marigolds above all, bougainvillea, agave, cacti */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.65)under(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.5)under(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.5)under(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.4)under(px,py);}});
  /* 5. small props: lower tiers only */
  [['papelPicado',3],['farol',2],['ollas',2],['veladoras',2],['pinata',1]].forEach(([k,n])=>{for(let i=0;i<landCnt(n);i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  /* every house gets a facing (bit0 mirror, bit1 gable/eave); neighbours cycle through all four */
  {const houses=placed.filter(o=>/^(casita|casaTile|casaAlta)$/.test(o.kind)).sort((a,b)=>a.x-b.x||a.y-b.y),cyc=[0,3,1,2];houses.forEach((o,i)=>{o.v=((o.v>>2)<<2)|cyc[i%4];});placed.filter(o=>o.kind==='bellWall'||o.kind==='ofrenda').forEach(o=>{o.v=((o.v>>2)<<2)|(rng()<0.5?1:0);});}
  const cuts={tree:[0.2,0.52,0.8,1],shrub:[0.06,0.38,0.7,1],rock:[0.3,0.55,0.8,1],prop:[1,1,1,1],struct:[0,0,0,0],ruin:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='struct'||o.cat==='ruin')o.tier=o.minT;});
  const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
  for(let t=1;t<=4;t++){let guard=0;while(guard++<300){const c=count(t);if(c.tr/Math.max(1,c.n)>=0.5)break;const pool=placed.filter(o=>o.tier<=t&&t<=o.maxT),cand=(pool.filter(o=>o.cat==='shrub').sort((a,b)=>b.pri-a.pri)[0])||(pool.filter(o=>o.prop&&o.minT>1).sort((a,b)=>b.pri-a.pri)[0]);if(!cand)break;cand.tier=Math.min(5,cand.tier+1);}}
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.sort((a,b)=>a.y-b.y);
  return FIESTA_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: warm adobe sand with scattered marigold petals and a little papel-picado confetti (decals, not objects) ---- */
function fiestaGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<46;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'255,240,205':'196,150,100',r()<0.5?0.26:0.2);}
  for(let k=0;k<12;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'205,120,80',0.14);}                 /* terracotta dust */
  for(let k=0;k<10;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'255,255,225',0.16);}                /* sun-bleached */
  for(let k=0;k<5;k++){const p=pt();for(let j=0;j<7;j++){const a=r()*6.283,l=R*(0.06+r()*0.1);TH.ln(c,[p[0],p[1]],[p[0]+Math.cos(a)*l,p[1]+Math.sin(a)*l*0.5],'rgba(120,80,50,.28)',R*0.012);}}
  for(let k=0;k<90;k++){const p=pt(),a=r()*3.14,l=R*(0.025+r()*0.03);TH.ell(c,p[0],p[1],l,l*0.6,r()<0.5?'#f08a24':'#f6b83a',a);}   /* marigold petals */
  for(let k=0;k<50;k++){const p=pt(),sz=R*(0.014+r()*0.01);c.save();c.translate(p[0],p[1]);c.rotate(r()*3);c.fillStyle=['#e8508a','#2ab5b0','#f2c230','#8a4ab8','#7ac43a'][k%5];c.fillRect(-sz,-sz,sz*2,sz*2);c.restore();}   /* confetti */
  for(let k=0;k<110;k++){const p=pt(),h=R*(0.04+r()*0.05);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#b8a860','#a89850','#c8b870'][(k+j)%3],R*0.01);}
  for(let k=0;k<26;k++){const p=pt();TH.ell(c,p[0],p[1],R*(0.014+r()*0.012),R*0.01,'rgba(150,120,90,.55)');}
  c.restore();c.restore();
}
const FIESTA_THEME={id:'fiesta',assets:FIESTA_ASSETS,plan:getFiestaPlan,ground:fiestaGround,groundCol:'#e0c097',top:1.45};
const FIESTA_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
function bakeLandFiesta(shape,tier,R,opts){return bakeLandTheme(FIESTA_THEME,shape,tier,R,opts);}
function drawLandFiestaBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandFiestaFront(ctx,x,y,land){land.sprites.slice().sort((a,b)=>a.y-b.y).forEach(s=>drawScenicSprite(ctx,s,x+s.x,y+s.y));}
function landFiestaSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}


return Object.freeze({bake: bakeLandFiesta, drawBack: drawLandFiestaBack, drawFront: drawLandFiestaFront});
})(),
  space: (() => {

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

/* ===== SPACE ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const SSH=(c,x,y,rx)=>{c.fillStyle='rgba(8,10,24,.34)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const SROCK=[['#6a6f7a','#8a90a0','#4e535e'],['#7a6a62','#9c8678','#5a4a44'],['#5e6a7a','#7e8ca0','#46525f'],['#74727a','#948f9c','#54525c']];
const SWHITE='#e6eaf0',SMETAL='#6a7280',SMETAL_D='#454c58',SGLOW='#7fe8ff',SBLUE='#3a7ad8',SORANGE='#f08a24';
const SBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.28),shade(col,0.12));
const SFLIP=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
const SPATH=(c,pts)=>{pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();};
/* a low boulder with three tones */
const SBOULDER=(c,x,y,rx,ry,pal,r)=>{TH.ell(c,x+rx*0.2,y+ry*0.32,rx*1.05,ry*0.42,'rgba(8,10,24,.3)');const j=()=>0.85+r()*0.3;TH.poly(c,[[x-rx,y],[x-rx*0.9*j(),y-ry*0.6],[x-rx*0.4,y-ry*1.05*j()],[x+rx*0.4,y-ry*0.98],[x+rx*0.95,y-ry*0.4*j()],[x+rx,y+ry*0.1],[x-rx*0.6,y+ry*0.22]],pal[0]);TH.poly(c,[[x+rx*0.22,y-ry*1.0],[x+rx*0.95,y-ry*0.4],[x+rx,y+ry*0.1],[x+rx*0.15,y+ry*0.06]],pal[2]);TH.poly(c,[[x-rx*0.9,y-ry*0.6],[x-rx*0.4,y-ry*1.05],[x+rx*0.12,y-ry*0.98],[x-rx*0.4,y-ry*0.5]],pal[1]);if(r()<0.5)TH.ln(c,[x-rx*0.6,y-ry*0.3],[x+rx*0.5,y-ry*0.2],'rgba(0,0,0,.22)',ry*0.07);};
/* capsule (cylinder seen obliquely) along an iso axis: ang = +0.4636 (X axis) or -0.4636 (Y axis) */
const SCAPSULE=(c,x,y,len,rad,ang,body,stripe,u)=>{c.save();c.translate(x,y);c.rotate(ang);const g=c.createLinearGradient(0,-rad,0,rad);g.addColorStop(0,shade(body,0.25));g.addColorStop(0.45,body);g.addColorStop(1,shade(body,-0.4));c.fillStyle=g;c.beginPath();c.moveTo(-len/2+rad*0.5,-rad);c.lineTo(len/2-rad*0.5,-rad);c.quadraticCurveTo(len/2+rad*0.2,-rad,len/2+rad*0.2,0);c.quadraticCurveTo(len/2+rad*0.2,rad,len/2-rad*0.5,rad);c.lineTo(-len/2+rad*0.5,rad);c.quadraticCurveTo(-len/2-rad*0.2,rad,-len/2-rad*0.2,0);c.quadraticCurveTo(-len/2-rad*0.2,-rad,-len/2+rad*0.5,-rad);c.closePath();c.fill();
  if(stripe){c.fillStyle=stripe;c.fillRect(-len*0.18,-rad,len*0.1,rad*2);c.fillRect(len*0.12,-rad,len*0.1,rad*2);}c.strokeStyle='rgba(0,0,0,.22)';c.lineWidth=u*0.05;for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(k*len*0.3,-rad);c.lineTo(k*len*0.3,rad);c.stroke();}c.restore();};
const SDISH=(c,x,y,r,tilt,u)=>{c.save();c.translate(x,y);c.rotate(tilt);const g=c.createRadialGradient(-r*0.2,-r*0.1,0,0,0,r);g.addColorStop(0,'#c8d0dc');g.addColorStop(1,'#7a8494');c.fillStyle=g;c.beginPath();c.ellipse(0,0,r,r*0.6,0,0,7);c.fill();c.strokeStyle='#e6eaf0';c.lineWidth=u*0.1;c.stroke();c.fillStyle='rgba(60,68,84,.5)';c.beginPath();c.ellipse(r*0.05,r*0.04,r*0.72,r*0.42,0,0,7);c.fill();TH.ln(c,[0,0],[r*0.5,-r*0.9],'#4a525e',u*0.07);TH.ell(c,r*0.5,-r*0.9,u*0.14,u*0.1,'#e6eaf0');c.restore();};
const SBEACON=(c,x,y,u,col)=>{const g=c.createRadialGradient(x,y,0,x,y,u*1.4);g.addColorStop(0,col.replace('1)','.6)'));g.addColorStop(1,col.replace('1)','0)'));c.fillStyle=g;c.beginPath();c.arc(x,y,u*1.4,0,7);c.fill();TH.ell(c,x,y,u*0.16,u*0.16,col.replace('rgba','rgb').replace(',1)',')'));};
const SCRATE=['#e8762a','#2a6ab0','#e6e8ee','#c0392b','#3a9a5a','#f2c230'];
/* ---- habitat modules: dome / pod / cube, 4 orientations (mirror x variant), glowing windows ---- */
const SHAB={
  domeHab(c,x,y,u,s,variant){const r=mulberry(s*7+3),acc=[SBLUE,SORANGE,'#3ab5a0','#c05ad8'][s%4],rx=u*2.0,rh=u*2.3,by=y-u*0.35;
    TH.ell(c,x,y,rx*1.18,rx*0.44,SMETAL_D);TH.ell(c,x,y-u*0.15,rx*1.12,rx*0.4,'#8a92a2');
    c.beginPath();c.moveTo(x-rx,by);c.bezierCurveTo(x-rx,by-rh*1.25,x+rx,by-rh*1.25,x+rx,by);c.ellipse(x,by,rx,rx*0.36,0,0,Math.PI);c.closePath();const g=c.createRadialGradient(x-rx*0.4,by-rh*0.75,rx*0.1,x,by-rh*0.4,rx*1.5);g.addColorStop(0,'#fafcff');g.addColorStop(0.55,'#d8dfea');g.addColorStop(1,'#8d97aa');c.fillStyle=g;c.fill();
    c.save();c.beginPath();c.moveTo(x-rx,by);c.bezierCurveTo(x-rx,by-rh*1.25,x+rx,by-rh*1.25,x+rx,by);c.ellipse(x,by,rx,rx*0.36,0,0,Math.PI);c.closePath();c.clip();c.strokeStyle='rgba(70,80,100,.45)';c.lineWidth=u*0.06;
    for(let k=-3;k<=3;k++){c.beginPath();c.moveTo(x+k*rx*0.32,by+rx*0.3);c.quadraticCurveTo(x+k*rx*0.18,by-rh*1.0,x,by-rh*0.95);c.stroke();}for(let k=1;k<=3;k++){c.beginPath();c.ellipse(x,by-rh*0.28*k+rx*0.05,rx*(1-k*0.22),rx*(0.36-k*0.05),0,0,Math.PI);c.stroke();}
    c.fillStyle=acc;c.fillRect(x-rx*1.1,by-rh*0.2,rx*2.2,u*0.28);for(let k=0;k<5;k++){const wx=x-rx*0.8+k*rx*0.4;c.fillStyle=r()<0.8?SGLOW:'#2a4a6a';c.fillRect(wx-u*0.2,by-rh*0.55,u*0.4,u*0.5);}c.restore();
    const tx=variant?-1:1,tb=[x+tx*rx*0.85,by+rx*0.12];c.save();c.fillStyle='#b8c0cc';c.beginPath();c.moveTo(tb[0],tb[1]-u*0.5);c.lineTo(tb[0]+tx*u*1.7,tb[1]+u*0.4-u*0.5);c.lineTo(tb[0]+tx*u*1.7,tb[1]+u*0.4+u*0.5);c.lineTo(tb[0],tb[1]+u*0.5);c.closePath();c.fill();c.strokeStyle='#6a7280';c.lineWidth=u*0.06;c.stroke();for(let k=1;k<4;k++)TH.ln(c,[tb[0]+tx*u*0.42*k,tb[1]-u*0.45+u*0.1*k],[tb[0]+tx*u*0.42*k,tb[1]+u*0.55+u*0.1*k],'rgba(60,68,84,.5)',u*0.05);TH.ell(c,tb[0]+tx*u*1.7,tb[1]+u*0.4,u*0.5,u*0.55,'#e6eaf0');TH.ell(c,tb[0]+tx*u*1.7,tb[1]+u*0.4,u*0.34,u*0.4,'#3a4a62');c.restore();
    TH.ln(c,[x,by-rh*0.98],[x,by-rh*1.45],'#454c58',u*0.08);SBEACON(c,x,by-rh*1.45,u,'rgba(255,60,60,1)');},
  podHab(c,x,y,u,s,variant){const r=mulberry(s*5+1),acc=[SBLUE,SORANGE,'#3ab5a0','#c05ad8'][s%4],ang=variant?-0.4636:0.4636,len=u*4.4,rad=u*1.05,cy=y-u*1.55;
    [[-0.32,0.0],[0.32,0.0]].forEach(([f])=>{const px=x+Math.cos(ang)*len*f,py=cy+Math.sin(ang)*len*f;TH.poly(c,[[px-u*0.25,py+rad*0.6],[px+u*0.25,py+rad*0.6],[px+u*0.5,y+u*0.1],[px-u*0.5,y+u*0.1]],SMETAL_D);TH.ell(c,px,y+u*0.1,u*0.7,u*0.24,'#55606e');});
    SCAPSULE(c,x,cy,len,rad,ang,SWHITE,acc,u);
    c.save();c.translate(x,cy);c.rotate(ang);for(let k=0;k<6;k++){const wx=-len*0.4+k*len*0.16;if(Math.abs(wx)<len*0.02+len*0.14*0&&false)continue;c.fillStyle=r()<0.8?SGLOW:'#2a4a6a';c.beginPath();c.ellipse(wx,-rad*0.2,u*0.16,u*0.22,0,0,7);c.fill();}
    c.fillStyle='#2a3444';c.beginPath();c.ellipse(len*0.5,0,rad*0.24,rad*0.62,0,0,7);c.fill();c.strokeStyle='#b8c0cc';c.lineWidth=u*0.08;c.stroke();c.fillStyle=SGLOW;c.beginPath();c.ellipse(len*0.5,-rad*0.1,rad*0.12,rad*0.26,0,0,7);c.fill();c.restore();
    const ax=x+Math.cos(ang)*len*0.2,ay=cy-rad*0.95;TH.ln(c,[ax,ay],[ax,ay-u*1.1],'#454c58',u*0.08);SDISH(c,ax,ay-u*1.25,u*0.5,-0.3,u);TH.poly(c,[[x-u*0.7,cy-rad*0.9],[x-u*0.1,cy-rad*0.9],[x-u*0.1+u*0.1,cy-rad*1.35],[x-u*0.6,cy-rad*1.35]].map(p=>[p[0]+Math.cos(ang)*u*1.0,p[1]+Math.sin(ang)*u*1.0]),'#2a4a8a');},
  cubeHab(c,x,y,u,s,variant){const r=mulberry(s*9+2),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),acc=[SBLUE,SORANGE,'#3ab5a0','#c05ad8'][s%4];SBOX(c,x,y,u,-1.3,1.3,-1.0,1.0,0,1.9,SWHITE);SBOX(c,x,y,u,-1.4,1.4,-1.1,1.1,1.9,2.05,'#b8c0cc');
    const faces=[{J:(a,z)=>I(a,1.01,z),p0:-1.3,p1:1.3},{J:(b,z)=>I(1.31,b,z),p0:-1.0,p1:1.0}];faces.forEach((F,fi)=>{TH.poly(c,[F.J(F.p0,0.75),F.J(F.p1,0.75),F.J(F.p1,0.98),F.J(F.p0,0.98)],acc);for(let k=0;k<5;k++){const p=F.p0+(F.p1-F.p0)*(k+0.5)/5;TH.ln(c,F.J(p,0.02),F.J(p,1.85),'rgba(70,80,100,.3)',u*0.04);}});
    const door=variant?faces[1]:faces[0],win=variant?faces[0]:faces[1];TH.poly(c,[door.J(-0.28,0),door.J(0.28,0),door.J(0.28,1.35),door.J(-0.28,1.35)],'#3a4658','#8a94a4',u*0.05);TH.ln(c,door.J(0,0.05),door.J(0,1.3),'rgba(255,255,255,.35)',u*0.04);const lp=door.J(0.4,1.5);TH.ell(c,lp[0],lp[1],u*0.07,u*0.07,'#7fff9a');[-0.75,0.75].forEach(p=>TH.poly(c,[door.J(p-0.2,1.0),door.J(p+0.2,1.0),door.J(p+0.2,1.5),door.J(p-0.2,1.5)],SGLOW,'#8a94a4',u*0.04));[-0.6,0.0,0.6].forEach(p=>TH.poly(c,[win.J(p-0.22,1.15),win.J(p+0.22,1.15),win.J(p+0.22,1.6),win.J(p-0.22,1.6)],r()<0.8?SGLOW:'#2a4a6a','#8a94a4',u*0.04));
    const rp=I(-0.4,-0.3,2.05);SBOX(c,x,y,u,-0.9,-0.3,-0.6,-0.1,2.05,2.4,'#b8c0cc');SDISH(c,I(0.5,0.2,2.9)[0],I(0.5,0.2,2.9)[1],u*0.55,-0.4,u);TH.ln(c,I(0.5,0.2,2.05),I(0.5,0.2,2.7),'#454c58',u*0.08);const ap=I(-1.0,0.6,2.05);TH.ln(c,ap,[ap[0],ap[1]-u*1.3],'#454c58',u*0.07);SBEACON(c,ap[0],ap[1]-u*1.3,u,'rgba(255,70,70,1)');
    const sp=I(1.4,-0.2,0.6);TH.poly(c,[I(1.4,-0.8,0.5),I(1.4,0.6,0.5),I(2.3,0.6,1.5),I(2.3,-0.8,1.5)],'#1f3f8f','#9ab4e8',u*0.04);for(let k=1;k<4;k++)TH.ln(c,I(1.4+0.225*k,-0.8,0.5+0.25*k),I(1.4+0.225*k,0.6,0.5+0.25*k),'rgba(150,180,240,.5)',u*0.03);}
};
function SHAB_DRAW(kind,pals){return(c,x,y,u,v)=>{const o=v&3,s=v>>2,flip=o&1,variant=(o>>1)&1;c.fillStyle='rgba(8,10,24,.34)';c.beginPath();c.ellipse(x+u*0.9,y+u*0.2,u*pals.sw,u*pals.sh,0,0,7);c.fill();SFLIP(c,x,flip,()=>SHAB[kind](c,x,y,u,s,variant));};}
const SPACE_ASSETS={
  /* ---------- low rock clusters (no tall mountains) ---------- */
  rockCluster:{cat:'rock',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*3+5),pal=SROCK[v%4],n=5+Math.floor(r()*4),it=[];for(let k=0;k<n;k++)it.push([(r()-0.5)*u*3.2,(r()-0.4)*u*1.1,u*(0.6+r()*1.0),u*(0.5+r()*0.8)]);it.sort((a,b)=>a[1]-b[1]).forEach(([dx,dy,rx,ry])=>SBOULDER(c,x+dx,y+dy,rx,ry,pal,r));}},
  rockMound:{cat:'rock',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*7+8),pal=SROCK[v%4],w=u*(2.9+r()*0.9),H=u*(2.0+r()*0.9);TH.ell(c,x+u*0.6,y+u*0.2,w*1.2,u*0.55,'rgba(8,10,24,.3)');c.save();c.translate(x,y);c.beginPath();c.moveTo(-w,0);c.bezierCurveTo(-w*0.9,-H*0.9,-w*0.3,-H*1.15,w*0.1,-H);c.bezierCurveTo(w*0.6,-H*0.9,w*1.0,-H*0.4,w,0);c.closePath();c.fillStyle=pal[0];c.fill();c.clip();const g=c.createLinearGradient(-w,0,w,0);g.addColorStop(0,'rgba(200,210,230,.25)');g.addColorStop(0.55,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,10,.5)');c.fillStyle=g;c.fillRect(-w*1.1,-H*1.2,w*2.2,H*1.3);for(let k=1;k<5;k++)TH.ln(c,[-w,-H*0.2*k+u*0.1],[w,-H*0.2*k-u*0.1],'rgba(0,0,0,.22)',u*0.06);c.restore();for(let k=0;k<4;k++)SBOULDER(c,x+(r()-0.5)*w*1.6,y+u*(0.1+r()*0.3),u*(0.3+r()*0.4),u*(0.25+r()*0.3),pal,r);}},
  rockSlabs:{cat:'rock',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*9+2),pal=SROCK[v%4];TH.ell(c,x+u*0.5,y+u*0.15,u*2.2,u*0.5,'rgba(8,10,24,.3)');const n=3+Math.floor(r()*2);for(let k=0;k<n;k++){const sx=x+(k-(n-1)/2)*u*0.9+(r()-0.5)*u*0.3,sh=u*(1.3+r()*1.5),sw=u*(0.6+r()*0.4),lean=(r()-0.5)*u*0.6;TH.poly(c,[[sx-sw,y],[sx-sw+lean,y-sh],[sx+sw*0.6+lean,y-sh-u*0.25],[sx+sw,y-u*0.1]],pal[0]);TH.poly(c,[[sx+sw*0.2,y-u*0.05],[sx+sw*0.6+lean,y-sh-u*0.25],[sx+sw,y-u*0.1],[sx+sw*0.9,y+u*0.1]],pal[2]);TH.poly(c,[[sx-sw+lean,y-sh],[sx+sw*0.6+lean,y-sh-u*0.25],[sx+sw*0.2+lean,y-sh-u*0.1]],pal[1]);TH.ln(c,[sx-sw*0.6,y-sh*0.4],[sx+sw*0.7,y-sh*0.45],'rgba(0,0,0,.22)',u*0.05);}}},
  crater:{cat:'rock',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*5+7),pal=SROCK[v%4],rx=u*(1.9+r()*0.8),ry=rx*0.42;TH.ell(c,x,y,rx*1.18,ry*1.2,'rgba(210,218,235,.28)');TH.ell(c,x,y,rx,ry,'rgba(40,46,64,.55)');const g=c.createRadialGradient(x+rx*0.2,y-ry*0.2,0,x,y,rx);g.addColorStop(0,'rgba(20,24,40,.0)');g.addColorStop(1,'rgba(10,12,26,.5)');c.fillStyle=g;c.beginPath();c.ellipse(x,y,rx*0.92,ry*0.9,0,0,7);c.fill();c.strokeStyle='rgba(230,236,248,.55)';c.lineWidth=u*0.13;c.beginPath();c.ellipse(x,y,rx,ry,0,Math.PI*0.95,Math.PI*2.1);c.stroke();c.strokeStyle='rgba(10,12,26,.45)';c.lineWidth=u*0.1;c.beginPath();c.ellipse(x,y,rx,ry,0,0.1,Math.PI*0.85);c.stroke();for(let k=0;k<4;k++){const a=r()*6.283;SBOULDER(c,x+Math.cos(a)*rx*1.15,y+Math.sin(a)*ry*1.2,u*(0.2+r()*0.3),u*(0.16+r()*0.22),pal,r);}}},
  crystals:{cat:'rock',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+9),pal=SROCK[v%4],cols=[['#5ff0e0','#2ab8b0'],['#c08aff','#8a4ad8'],['#7fd8ff','#3a98d8']][v%3];const g=c.createRadialGradient(x,y-u*0.8,0,x,y-u*0.8,u*2.4);g.addColorStop(0,cols[0].replace('#','rgba(')?'rgba(120,240,230,.35)':'');g.addColorStop(1,'rgba(120,240,230,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*0.8,u*2.4,0,7);c.fill();TH.ell(c,x+u*0.3,y+u*0.1,u*1.4,u*0.4,'rgba(8,10,24,.3)');SBOULDER(c,x-u*0.6,y+u*0.05,u*0.7,u*0.45,pal,r);SBOULDER(c,x+u*0.6,y+u*0.1,u*0.55,u*0.38,pal,r);
    const n=5+Math.floor(r()*2);for(let k=0;k<n;k++){const cx=x+(k-(n-1)/2)*u*0.34+(r()-0.5)*u*0.2,h=u*(0.9+r()*1.5),w=u*(0.2+r()*0.12),lean=(r()-0.5)*u*0.5;TH.poly(c,[[cx-w,y],[cx-w+lean*0.5,y-h*0.75],[cx+lean,y-h],[cx+w+lean*0.5,y-h*0.75],[cx+w,y]],cols[0]);TH.poly(c,[[cx,y],[cx+lean,y-h],[cx+w+lean*0.5,y-h*0.75],[cx+w,y]],cols[1]);TH.ln(c,[cx-w*0.4,y-h*0.2],[cx-w*0.2+lean*0.5,y-h*0.7],'rgba(255,255,255,.6)',u*0.04);}}},
  pebbles:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4),pal=SROCK[v%4];for(let k=0;k<7;k++)SBOULDER(c,x+(r()-0.5)*u*2.0,y+(r()-0.5)*u*0.6,u*(0.12+r()*0.18),u*(0.1+r()*0.14),pal,r);}},
  /* ---------- habitats ---------- */
  domeHab:{cat:'struct',rho:0.13,draw:SHAB_DRAW('domeHab',{sw:3.2,sh:1.0})},
  podHab:{cat:'struct',rho:0.13,draw:SHAB_DRAW('podHab',{sw:3.4,sh:1.0})},
  cubeHab:{cat:'struct',rho:0.12,draw:SHAB_DRAW('cubeHab',{sw:3.4,sh:1.0})},
  /* ---------- the one tower: a comm mast beside the habitats ---------- */
  commMast:{cat:'struct',rho:0.05,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),H=7.4;SFLIP(c,x,v&1,()=>{SSH(c,x,y,u*2.2);TH.ell(c,x,y,u*1.3,u*0.45,SMETAL_D);TH.ell(c,x,y-u*0.1,u*1.1,u*0.38,'#8a92a2');
      [[-0.8,-0.8],[0.8,-0.8],[-0.8,0.8],[0.8,0.8]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0.1),I(X*0.25,Y*0.25,H),'#c8d0dc',u*0.13));for(let k=0;k<9;k++){const z0=0.1+k*(H-0.1)/9,z1=0.1+(k+1)*(H-0.1)/9,f0=1-0.75*z0/H,f1=1-0.75*z1/H;TH.ln(c,I(-0.8*f0,0.8*f0,z0),I(0.8*f1,0.8*f1,z1),'#8a94a4',u*0.06);TH.ln(c,I(0.8*f0,0.8*f0,z0),I(-0.8*f1,0.8*f1,z1),'#8a94a4',u*0.06);TH.ln(c,I(0.8*f0,-0.8*f0,z0),I(0.8*f1,0.8*f1,z1),'#8a94a4',u*0.06);TH.ln(c,I(-0.8*f0,-0.8*f0,z0),I(-0.8*f1,0.8*f1,z1),'#8a94a4',u*0.05);TH.ln(c,I(-0.8*f1,0.8*f1,z1),I(0.8*f1,0.8*f1,z1),'#8a94a4',u*0.06);}
      const tp=I(0,0,H);SDISH(c,tp[0]+u*0.5,tp[1]+u*0.2,u*1.1,-0.5,u);TH.ln(c,tp,[tp[0],tp[1]-u*1.2],'#454c58',u*0.08);SBEACON(c,tp[0],tp[1]-u*1.2,u*1.3,'rgba(255,60,60,1)');const mp=I(0,0,H*0.55);SDISH(c,mp[0]-u*0.7,mp[1],u*0.55,0.3,u);
      [[-1.6,-0.8],[1.6,-0.4]].forEach(([X,Y])=>{const b=I(X*1.4,Y*1.4,0);TH.ln(c,tp.map((q,i)=>i?q+u*0.0:q),b,'rgba(190,200,220,.45)',u*0.03);});});}},
  /* ---------- station pieces ---------- */
  cargoStack:{cat:'ruin',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*5+9),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SFLIP(c,x,(v>>3)&1,()=>{SSH(c,x,y,u*3.0);
      const cont=(X,Y,Z,col,hz)=>{SBOX(c,x,y,u,X-0.85,X+0.85,Y-0.45,Y+0.45,Z,Z+0.85,col);for(let k=0;k<7;k++){const p=X-0.78+k*0.26;TH.ln(c,I(p,Y+0.46,Z+0.06),I(p,Y+0.46,Z+0.79),'rgba(0,0,0,.28)',u*0.04);}TH.poly(c,[I(X-0.5,Y+0.47,Z+0.3),I(X+0.2,Y+0.47,Z+0.3),I(X+0.2,Y+0.47,Z+0.55),I(X-0.5,Y+0.47,Z+0.55)],'rgba(255,255,255,.75)');if(hz){for(let k=0;k<4;k++)TH.poly(c,[I(X+0.35+k*0.12,Y+0.47,Z+0.08),I(X+0.43+k*0.12,Y+0.47,Z+0.08),I(X+0.5+k*0.12,Y+0.47,Z+0.22),I(X+0.42+k*0.12,Y+0.47,Z+0.22)],'#f2c230');}};
      const cols=[SCRATE[(v>>2)%6],SCRATE[(v+2)%6],SCRATE[(v+4)%6]];cont(-0.9,-0.3,0,cols[0],true);cont(0.95,-0.3,0,cols[1],false);cont(0.0,-0.3,0.85,cols[2],false);cont(-0.2,0.7,0,cols[(v+1)%3],false);
      [[1.5,0.9,0.5],[1.9,0.6,0.4]].forEach(([X,Y,s2],i)=>{SBOX(c,x,y,u,X-s2/2,X+s2/2,Y-s2/2,Y+s2/2,0,s2,['#c8a060','#a88050'][i]);const fp=I(X,Y+s2/2+0.01,s2*0.5);TH.ell(c,fp[0],fp[1],u*0.1,u*0.1,'#f6efe0');});});}},
  fuelTanks:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const ang=(v>>2)&1?-0.4636:0.4636;SFLIP(c,x,(v>>3)&1,()=>{SSH(c,x,y,u*2.8);[[-0.9],[0.9]].forEach(([off],i)=>{const cx=x+Math.cos(ang+Math.PI/2)*u*0.0+off*u*0.5,cy=y-u*1.25+off*u*0.5;SBOX(c,x,y,u,-0.5,0.5,-0.5,0.5,0,0.01,'#454c58');const px=x+(i?0.3:-0.3)*u*0.0;const bx=x+Math.cos(ang)*0,by=y-u*1.15;SCAPSULE(c,x+(i?u*0.5:-u*0.5),y-u*(1.0+(i?0.5:-0.0)*0.0)+(i?u*0.5:-u*0.1),u*3.0,u*0.78,ang,i?'#e8e8ee':'#f2c230',i?'#c0392b':'#2a2a30',u);});
      [[-1.1,0.55],[1.1,0.95]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u*0.8,y+dy*u*0.0-u*1.8],[x+dx*u*0.8,y-u*0.2],'#454c58',u*0.1);});TH.ln(c,[x-u*0.7,y-u*2.1],[x+u*0.7,y-u*1.6],'#8a94a4',u*0.14);TH.ell(c,x,y-u*2.0,u*0.22,u*0.12,'#c0392b');});}},
  solarArray:{cat:'ruin',rho:0.1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SFLIP(c,x,v&1,()=>{SSH(c,x,y,u*3.0);for(let row=0;row<2;row++)for(let k=0;k<3;k++){const X0=-2.0+k*1.4,X1=X0+1.25,Y0=-0.8+row*1.3,Y1=Y0+0.7,z0=0.5,z1=1.3;[X0+0.1,X1-0.1].forEach(X=>{TH.ln(c,I(X,Y1,0),I(X,Y1,z1-0.1),'#8a94a4',u*0.07);TH.ln(c,I(X,Y0,0),I(X,Y0,z0),'#8a94a4',u*0.07);});
        TH.poly(c,[I(X0,Y0,z0),I(X1,Y0,z0),I(X1,Y1,z1),I(X0,Y1,z1)],'#1d3a8a','#b8c0cc',u*0.06);for(let g=1;g<5;g++)TH.ln(c,I(X0+(X1-X0)*g/5,Y0,z0),I(X0+(X1-X0)*g/5,Y1,z1),'rgba(140,170,235,.55)',u*0.03);for(let g=1;g<3;g++)TH.ln(c,I(X0,Y0+(Y1-Y0)*g/3,z0+(z1-z0)*g/3),I(X1,Y0+(Y1-Y0)*g/3,z0+(z1-z0)*g/3),'rgba(140,170,235,.55)',u*0.03);TH.poly(c,[I(X0,Y0,z0),I(X1,Y0,z0),I(X1,Y0+0.05,z0+0.05),I(X0,Y0+0.05,z0+0.05)],'#e6eaf0');}
      SBOX(c,x,y,u,2.2,2.8,-0.3,0.3,0,0.7,SMETAL);const bp=I(2.5,0.31,0.9);TH.ell(c,bp[0],bp[1],u*0.07,u*0.07,'#7fff9a');});}},
  roverBuggy:{cat:'ruin',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SFLIP(c,x,v&1,()=>{SSH(c,x,y,u*2.2);
      const wheel=(X,Y)=>{const p=I(X,Y,0.45);c.fillStyle='#2a2e38';c.beginPath();c.ellipse(p[0],p[1],u*0.46,u*0.52,0,0,7);c.fill();c.strokeStyle='#8a94a4';c.lineWidth=u*0.1;c.stroke();for(let k=0;k<6;k++){const a=k/6*6.283;TH.ln(c,p,[p[0]+Math.cos(a)*u*0.38,p[1]+Math.sin(a)*u*0.42],'#6a7280',u*0.05);}};
      [[-1.2,-0.75],[0,-0.75],[1.2,-0.75]].forEach(([X,Y])=>wheel(X,Y));SBOX(c,x,y,u,-1.5,1.5,-0.6,0.6,0.5,1.0,'#e6eaf0');SBOX(c,x,y,u,0.2,1.4,-0.5,0.5,1.0,1.55,'#c8d0dc');TH.poly(c,[I(0.35,0.51,1.1),I(1.3,0.51,1.1),I(1.3,0.51,1.45),I(0.35,0.51,1.45)],SGLOW,'#454c58',u*0.05);SBOX(c,x,y,u,-1.3,-0.1,-0.5,0.5,1.0,1.2,SORANGE);
      [[-1.2,0.75],[0,0.75],[1.2,0.75]].forEach(([X,Y])=>wheel(X,Y));const ap=I(-1.2,-0.3,1.2);TH.ln(c,ap,[ap[0],ap[1]-u*1.3],'#454c58',u*0.06);SDISH(c,ap[0],ap[1]-u*1.4,u*0.38,-0.3,u);const hp=I(1.52,0.2,0.75);TH.ell(c,hp[0],hp[1],u*0.12,u*0.1,'#fff6c0');});}},
  landingPad:{cat:'ruin',rho:0.1,draw(c,x,y,u,v){const rx=u*2.4,ry=u*0.95;TH.ell(c,x+u*0.2,y+u*0.1,rx*1.06,ry*1.1,'rgba(8,10,24,.3)');TH.ell(c,x,y,rx,ry,'#3a404e');TH.ell(c,x,y-u*0.05,rx,ry,'#454c5c');c.strokeStyle='#e6eaf0';c.lineWidth=u*0.14;c.beginPath();c.ellipse(x,y-u*0.05,rx*0.88,ry*0.88,0,0,7);c.stroke();c.strokeStyle='#f2c230';c.lineWidth=u*0.1;c.setLineDash([u*0.5,u*0.4]);c.beginPath();c.ellipse(x,y-u*0.05,rx*0.7,ry*0.7,0,0,7);c.stroke();c.setLineDash([]);
      c.fillStyle='#e6eaf0';const hx=u*0.8,hy=ry*0.5;c.fillRect(x-hx*0.55,y-hy,u*0.22,hy*2);c.fillRect(x+hx*0.55-u*0.22,y-hy,u*0.22,hy*2);c.fillRect(x-hx*0.55,y-u*0.12,hx*1.1,u*0.22);for(let k=0;k<12;k++){const a=k/12*6.283,px=x+Math.cos(a)*rx*0.96,py=y-u*0.05+Math.sin(a)*ry*0.96;const col=k%2?'rgba(255,200,60,1)':'rgba(120,255,160,1)';SBEACON(c,px,py,u*0.5,col);}}},
  greenhouseDome:{cat:'ruin',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*5+9),rx=u*2.7,rh=u*2.9,by=y-u*0.3;SFLIP(c,x,v&1,()=>{SSH(c,x,y,u*3.2);TH.ell(c,x,y,rx*1.1,rx*0.42,SMETAL_D);TH.ell(c,x,y-u*0.12,rx*1.05,rx*0.38,'#8a92a2');
      TH.ell(c,x,by-u*0.2,rx*0.92,rx*0.32,'#4a7a3a');for(let k=0;k<14;k++){const px=x+(r()*2-1)*rx*0.8,py=by-u*0.1-r()*rh*0.4;TH.blob(c,px,py,u*(0.35+r()*0.3),u*(0.3+r()*0.3),['#3f9a46','#58b052','#2f8a3c','#7acc5a'][k%4],r,7);}
      c.beginPath();c.moveTo(x-rx,by);c.bezierCurveTo(x-rx,by-rh*1.25,x+rx,by-rh*1.25,x+rx,by);c.ellipse(x,by,rx,rx*0.36,0,0,Math.PI);c.closePath();const g=c.createRadialGradient(x-rx*0.4,by-rh*0.75,rx*0.1,x,by-rh*0.4,rx*1.5);g.addColorStop(0,'rgba(220,250,255,.5)');g.addColorStop(0.6,'rgba(160,220,235,.22)');g.addColorStop(1,'rgba(90,150,190,.38)');c.fillStyle=g;c.fill();c.strokeStyle='rgba(235,245,255,.75)';c.lineWidth=u*0.09;c.stroke();
      c.save();c.beginPath();c.moveTo(x-rx,by);c.bezierCurveTo(x-rx,by-rh*1.25,x+rx,by-rh*1.25,x+rx,by);c.ellipse(x,by,rx,rx*0.36,0,0,Math.PI);c.closePath();c.clip();c.strokeStyle='rgba(235,245,255,.6)';c.lineWidth=u*0.06;for(let k=-4;k<=4;k++){c.beginPath();c.moveTo(x+k*rx*0.25,by+rx*0.3);c.quadraticCurveTo(x+k*rx*0.14,by-rh*1.0,x,by-rh*0.97);c.stroke();}for(let k=1;k<=3;k++){c.beginPath();c.ellipse(x,by-rh*0.26*k,rx*(1-k*0.24),rx*(0.36-k*0.06),0,0,Math.PI);c.stroke();}c.restore();});}},
  drillRig:{cat:'ruin',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SFLIP(c,x,v&1,()=>{SSH(c,x,y,u*2.4);TH.ell(c,x,y,u*1.4,u*0.5,SMETAL_D);[[-0.9,-0.6],[0.9,-0.6],[0,0.9]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0.1),I(0,0,4.6),'#f2c230',u*0.14));[[-0.9,-0.6],[0.9,-0.6],[0,0.9]].forEach(([X,Y],i)=>{TH.ln(c,I(X*0.55,Y*0.55,2.2),I(X*0.55*0.0+X*0.3,Y*0.3,2.8),'#c0a020',u*0.06);});TH.ln(c,I(0,0,0.1),I(0,0,4.9),'#8a94a4',u*0.26);for(let k=0;k<7;k++){const p=I(0,0,0.5+k*0.6);TH.ln(c,[p[0]-u*0.16,p[1]],[p[0]+u*0.16,p[1]],'#454c58',u*0.05);}const hp=I(0,0,4.9);SBOX(c,x,y,u,-0.45,0.45,-0.45,0.45,4.7,5.4,SORANGE);TH.ell(c,hp[0],hp[1]-u*0.8,u*0.2,u*0.1,'#6a7280');
      TH.ln(c,I(0.3,0.9,0.5),I(2.4,1.4,0.4),'#6a7280',u*0.2);SBOX(c,x,y,u,1.6,2.6,0.4,1.2,0,0.8,'#e8762a');const lp=I(2.1,1.21,0.7);TH.ell(c,lp[0],lp[1],u*0.07,u*0.07,'#7fff9a');});}},
  dishArray:{cat:'ruin',rho:0.1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SFLIP(c,x,v&1,()=>{SSH(c,x,y,u*3.4);SBOX(c,x,y,u,-2.2,2.2,-1.0,1.0,0,0.35,SMETAL);SBOX(c,x,y,u,-2.0,2.0,-0.8,0.8,0.35,0.5,'#8a92a2');
      [[-1.3,0.2,1.55,-0.5],[0.1,-0.2,1.9,-0.3],[1.5,0.2,1.35,-0.6]].forEach(([X,Y,rr,tilt])=>{const b=I(X,Y,0.5),top=I(X,Y,2.3);TH.ln(c,b,top,'#b8c0cc',u*0.22);TH.poly(c,[[b[0]-u*0.4,b[1]],[b[0]+u*0.4,b[1]],[b[0]+u*0.15,b[1]-u*0.6],[b[0]-u*0.15,b[1]-u*0.6]],'#8a94a4');SDISH(c,top[0],top[1]-u*0.5,u*rr,tilt,u);});SBOX(c,x,y,u,-1.9,-1.1,-0.7,-0.1,0.5,1.1,'#e6eaf0');const lp=I(-1.5,-0.09,0.85);TH.ell(c,lp[0],lp[1],u*0.07,u*0.07,'#7fff9a');});}},
  astronaut:{cat:'ruin',rho:0.04,draw(c,x,y,u,v){SFLIP(c,x,v&1,()=>{SSH(c,x,y,u*1.4);TH.ell(c,x,y,u*0.8,u*0.28,'#6a7280');TH.ell(c,x,y-u*0.1,u*0.7,u*0.24,'#8a92a2');
      const by=y-u*0.35;TH.poly(c,[[x-u*0.55,by],[x-u*0.1,by],[x-u*0.1,by-u*1.1],[x-u*0.55,by-u*1.1]],'#f0f3f8','#9ab',u*0.04);TH.poly(c,[[x+u*0.1,by],[x+u*0.55,by],[x+u*0.55,by-u*1.1],[x+u*0.1,by-u*1.1]],'#e0e4ec','#9ab',u*0.04);
      TH.poly(c,[[x-u*0.7,by-u*1.1],[x+u*0.7,by-u*1.1],[x+u*0.65,by-u*2.3],[x-u*0.65,by-u*2.3]],'#f6f8fc','#9ab',u*0.04);TH.poly(c,[[x+u*0.5,by-u*1.3],[x+u*1.0,by-u*1.3],[x+u*1.0,by-u*2.2],[x+u*0.5,by-u*2.2]],'#c8d0dc');TH.ln(c,[x-u*0.65,by-u*1.5],[x+u*0.65,by-u*1.5],SORANGE,u*0.14);
      TH.ln(c,[x-u*0.65,by-u*2.1],[x-u*1.2,by-u*1.4],'#f0f3f8',u*0.34);TH.ln(c,[x+u*0.65,by-u*2.1],[x+u*1.15,by-u*2.9],'#f0f3f8',u*0.34);TH.ell(c,x+u*1.15,by-u*3.0,u*0.2,u*0.2,'#e6e8ee');
      TH.ell(c,x,by-u*2.9,u*0.72,u*0.76,'#f6f8fc','#9ab',u*0.05);TH.ell(c,x+u*0.06,by-u*2.85,u*0.5,u*0.48,'#c8a030');TH.ell(c,x+u*0.0,by-u*2.95,u*0.3,u*0.2,'rgba(255,240,180,.7)');TH.ell(c,x-u*0.15,by-u*3.2,u*0.18,u*0.1,'rgba(255,255,255,.6)');});}},
  crashedPod:{cat:'ruin',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*5+9);SFLIP(c,x,v&1,()=>{TH.ell(c,x+u*0.3,y+u*0.1,u*2.5,u*0.8,'rgba(8,10,24,.34)');TH.ell(c,x,y,u*2.2,u*0.78,'rgba(20,20,26,.55)');TH.ell(c,x,y,u*1.5,u*0.55,'rgba(10,10,14,.5)');
      c.save();c.translate(x,y-u*0.8);c.rotate(-0.35);const g=c.createLinearGradient(0,-u*1.2,0,u*1.2);g.addColorStop(0,'#dfe4ec');g.addColorStop(1,'#7a8494');c.fillStyle=g;c.beginPath();c.moveTo(-u*1.6,u*0.1);c.quadraticCurveTo(-u*1.4,-u*1.3,u*0.2,-u*1.25);c.quadraticCurveTo(u*1.5,-u*1.0,u*1.6,u*0.4);c.quadraticCurveTo(u*0.4,u*1.2,-u*1.6,u*0.1);c.fill();c.fillStyle='#3a2a28';c.beginPath();c.moveTo(u*0.9,-u*0.9);c.quadraticCurveTo(u*1.6,-u*0.3,u*1.6,u*0.4);c.quadraticCurveTo(u*1.0,u*0.2,u*0.9,-u*0.9);c.fill();c.fillStyle='#2a4a6a';c.beginPath();c.ellipse(-u*0.3,-u*0.3,u*0.5,u*0.4,0,0,7);c.fill();c.strokeStyle='#b8c0cc';c.lineWidth=u*0.08;c.stroke();TH.ln(c,[-u*1.4,-u*0.2],[u*0.9,-u*0.6],'rgba(0,0,0,.25)',u*0.05);c.restore();
      for(let k=0;k<4;k++){const sx=x+(r()-0.3)*u*1.2;c.fillStyle='rgba(60,60,70,'+(0.4-k*0.08)+')';c.beginPath();c.ellipse(sx+k*u*0.2,y-u*(1.6+k*0.7),u*(0.4+k*0.15),u*(0.3+k*0.1),0,0,7);c.fill();}for(let k=0;k<5;k++)SBOULDER(c,x+(r()-0.5)*u*3.4,y+(r()*0.5)*u*0.5,u*(0.18+r()*0.2),u*(0.14+r()*0.16),SROCK[0],r);});}},
  /* ---------- small props (lower tiers only) ---------- */
  flag:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.26,'rgba(8,10,24,.3)');TH.ln(c,[x,y],[x,y-u*3.2],'#c8d0dc',u*0.12);TH.ln(c,[x,y-u*3.2],[x+u*1.3,y-u*3.2],'#c8d0dc',u*0.07);const fx=x+u*0.05,fy=y-u*3.15,w=u*1.25,h=u*0.85;TH.poly(c,[[fx,fy],[fx+w,fy+u*0.04],[fx+w,fy+h+u*0.04],[fx,fy+h]],'#f6f8fc','#9ab',u*0.03);TH.poly(c,[[fx,fy],[fx+w*0.4,fy+u*0.02],[fx+w*0.4,fy+h+u*0.03],[fx,fy+h]],'#1f9aa8');TH.poly(c,[[fx+w*0.4,fy+u*0.02],[fx+w,fy+u*0.04],[fx+w,fy+h*0.5+u*0.04],[fx+w*0.4,fy+h*0.5+u*0.02]],'#f6f8fc');TH.poly(c,[[fx+w*0.4,fy+h*0.5+u*0.02],[fx+w,fy+h*0.5+u*0.04],[fx+w,fy+h+u*0.04],[fx+w*0.4,fy+h+u*0.03]],SORANGE);TH.ell(c,fx+w*0.2,fy+h*0.5,u*0.2,u*0.2,'#f6f8fc');for(let k=0;k<3;k++)SBOULDER(c,x+(k-1)*u*0.4,y+u*0.05,u*0.2,u*0.15,SROCK[0],mulberry(k+v));}},
  floodLight:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.26,'rgba(8,10,24,.3)');TH.ln(c,[x,y],[x,y-u*3.4],'#8a94a4',u*0.16);TH.ln(c,[x-u*0.55,y-u*3.4],[x+u*0.55,y-u*3.4],'#6a7280',u*0.14);[-0.5,0.5].forEach(d=>{const g=c.createRadialGradient(x+d*u,y-u*3.2,0,x+d*u,y-u*3.2,u*1.7);g.addColorStop(0,'rgba(220,240,255,.5)');g.addColorStop(1,'rgba(220,240,255,0)');c.fillStyle=g;c.beginPath();c.arc(x+d*u,y-u*3.2,u*1.7,0,7);c.fill();TH.poly(c,[[x+d*u-u*0.28,y-u*3.4],[x+d*u+u*0.28,y-u*3.4],[x+d*u+u*0.22,y-u*3.05],[x+d*u-u*0.22,y-u*3.05]],'#e8f6ff','#454c58',u*0.05);});}},
  beacon:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.2,y+u*0.06,u*0.6,u*0.2,'rgba(8,10,24,.3)');TH.ln(c,[x,y],[x,y-u*2.4],'#6a7280',u*0.14);for(let k=0;k<4;k++)TH.ln(c,[x-u*0.16,y-u*(0.4+k*0.5)],[x+u*0.16,y-u*(0.4+k*0.5)-u*0.12],'#c0392b',u*0.07);SBEACON(c,x,y-u*2.5,u*1.2,v%2?'rgba(255,60,60,1)':'rgba(255,190,60,1)');}},
  canisters:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*1.2,u*0.3,'rgba(8,10,24,.3)');[[-0.55,0,'#3a9a5a'],[0.0,0.12,'#2a6ab0'],[0.55,0,'#e8762a']].forEach(([dx,dy,col],i)=>{const px=x+dx*u,py=y+dy*u,w=u*0.3,h=u*(1.5+(i%2)*0.2);const g=c.createLinearGradient(px-w,0,px+w,0);g.addColorStop(0,shade(col,0.25));g.addColorStop(1,shade(col,-0.35));c.fillStyle=g;c.beginPath();c.moveTo(px-w,py);c.lineTo(px-w,py-h+w);c.arc(px,py-h+w,w,Math.PI,0);c.lineTo(px+w,py);c.ellipse(px,py,w,w*0.35,0,0,Math.PI);c.closePath();c.fill();TH.ln(c,[px-w,py-h*0.55],[px+w,py-h*0.55],'rgba(255,255,255,.7)',u*0.07);TH.ell(c,px,py-h-u*0.05,u*0.12,u*0.08,'#454c58');});}},
  smallCrates:{cat:'prop',rho:0.05,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.5,u*0.4,'rgba(8,10,24,.3)');SBOX(c,x,y,u,-0.9,0.1,-0.6,0.5,0,0.9,SCRATE[v%6]);SBOX(c,x,y,u,0.2,1.1,-0.5,0.5,0,0.7,SCRATE[(v+2)%6]);SBOX(c,x,y,u,-0.5,0.5,-0.45,0.4,0.9,1.6,SCRATE[(v+4)%6]);TH.poly(c,[I(-0.7,0.51,0.3),I(-0.1,0.51,0.3),I(-0.1,0.51,0.55),I(-0.7,0.51,0.55)],'rgba(255,255,255,.75)');}}
};

/* ===== MACRO-LAND ENGINE (hex geometry, path network, planner, baker) ===== */
const W3=Math.sqrt(3),HX=W3/2,HV=[[HX,0.29],[0,0.58],[-HX,0.29],[-HX,-0.29],[0,-0.58],[HX,-0.29]];
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[0,1,2],[-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5,1.5]],C:[[0],[-0.5,0.5,1.5],[-1,0,1],[-0.5]],D:[[0,1,2],[-0.5,0.5,1.5],[0,1]]};
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

function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol,clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]),key=[T.id,shape,tier,R,m,ground,sc,JSON.stringify(clr),JSON.stringify(opts.clearTiles||[])].join('|');const cached=revisedLandCache.get(key);if(cached)return cached;
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=0.75,top=T.top||1.35,bot=0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);return[cv,g];};
  const [back,cb]=mk();T.ground(cb,G,R,ox,oy,m,ground,({A:11,B:22,C:33,D:44})[shape]);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]),vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho))&&!(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));
  const sprites=vis.map(o=>{const unit=u*(o.scale||1);return {x:m*o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>T.assets[o.kind].draw(ctx,x,y,unit,o.v)};});
  const front=document.createElement('canvas'),frontRect={x:0,y:0,w:1,h:1};front.width=front.height=1;
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return revisedLandCache.set(key,{back,front,frontRect,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0,sprites});
}
function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}

/* ===== SPACE LAND: planner (no trees: low rock clusters, craters and crystals carry the land; little station habitats, cargo stacks and machinery sprinkled around) ===== */
const SPACE_KINDS={rockCluster:.42,rockMound:.14,rockSlabs:.16,crater:.14,crystals:.08,rockSlabs2:0};
const SPACE_LOW=[['rockMound',0.8],['rockCluster',0.6],['crater',0.9],['rockSlabs',0.6],['rockCluster',0.75],['rockMound',0.65]];
const SPACE_CAP={crystals:8,crater:14};
const SPACE_PLAN_CACHE={};
function getSpacePlan(shape){
  if(SPACE_PLAN_CACHE[shape])return SPACE_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(({A:9101,B:9302,C:11368,D:12469})[shape]),placed=[],bb=G.bbox,used={},A=SPACE_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.66);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick='rockCluster';for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'rockCluster';};
  const capOk=k=>!(SPACE_CAP[k]&&(used[k]||0)>=SPACE_CAP[k]);
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='rock'?1.0+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;if((D.cat==='rock'||D.cat==='shrub'||D.cat==='prop')&&placed.some(o=>o.noSouth&&Math.abs(px-o.x)<0.3&&py-o.y>-0.05&&py-o.y<0.36))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const rock=(x,y,extra,low)=>{if(low){const L=SPACE_LOW[Math.floor(rng()*SPACE_LOW.length)];return place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return place(pickFrom(SPACE_KINDS,capOk),x,y,extra||{});};
  const pebbles=(x,y,extra)=>place('pebbles',x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const LKS=G.centers.length/12,landThin=l=>{const n=Math.max(1,Math.round(l.length*LKS));return Array.from({length:n},(_,i)=>l[Math.floor((i+0.5)*l.length/n)]);},landCnt=n=>Math.max(1,Math.round(n*LKS));
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. the back rim carries the dish array (no wall of rock there: the rocks along the top are the same density as everywhere else) */
  {const pts=[];top.forEach(e=>[0.3,0.5,0.7].forEach(t=>pts.push(onEdge(e,t,0.0))));const p=pts.reduce((b,q)=>Math.abs(q[0]-cx)<Math.abs(b[0]-cx)?q:b);for(const [dx,dy] of [[0,-0.02],[0.3,0],[-0.3,0],[0,0.04]]){const o=place('dishArray',p[0]+dx,p[1]+dy,{minT:1,scale:1.2,clear:2.4,noSouth:true});if(o)break;}}
  /* 2. station habitats: 4 on the rim (spread by farthest-point), 5 through the middle, then ONE comm mast beside a habitat */
  const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.filter(e=>e.vertical).forEach(e=>inn.push([e.mid[0],e.mid[1]]));
  const chosen=placed.filter(o=>o.cat==='ruin'||o.cat==='struct').map(o=>[o.x,o.y]),habs=[];
  const spread=(k,pool,extra)=>{const ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.22})).sort((a,b)=>b.d-a.d);for(let n=0;n<Math.min(12,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],extra);if(o){chosen.push([o.x,o.y]);if(/Hab$/.test(k))habs.push(o);return o;}}return null;};
  landThin([['domeHab',1],['podHab',2],['cubeHab',3],['domeHab',4]]).forEach(([k,mt])=>spread(k,rim,{minT:mt,scale:1.15,clear:2.5,noSouth:true}));
  landThin([['podHab',2],['cubeHab',2],['domeHab',3],['podHab',4],['cubeHab',4]]).forEach(([k,mt])=>spread(k,inn,{minT:mt,scale:1.0,clear:3.0,noSouth:true}));
  {const home=habs[habs.length-1]||placed.find(o=>o.cat==='struct');if(home){for(const [dx,dy] of [[0.36,-0.08],[-0.36,-0.08],[0.3,0.12],[-0.3,0.12],[0.44,0.0],[-0.44,0.0]]){const o=place('commMast',home.x+dx,home.y+dy,{minT:4,scale:1.0,clear:2.2,noSouth:true});if(o)break;}}}
  /* 2b. station machinery and cargo scattered through the land */
  landThin([['cargoStack',1],['roverBuggy',2],['fuelTanks',2],['solarArray',2],['cargoStack',3],['landingPad',3],['greenhouseDome',3],['drillRig',3],['astronaut',4],['cargoStack',4],['solarArray',4],['crashedPod',4],['roverBuggy',4],['fuelTanks',4],['cargoStack',4]]).forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,scale:k==='cargoStack'||k==='solarArray'?1.05:1.0,clear:1.8,noSouth:true}));
  /* 3. rock clusters (the heart of this land): junction voids, corridors, the rim, the corners */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.9){const n=1+Math.floor(rng()*1.9);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.09:0.02;rock(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8);}}});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{[-0.25,0.25].forEach(dy=>{if(rng()<0.6)rock(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy);});});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.6)rock(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.7+rng()*0.2},true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.3));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(rng()-0.2)*0.12)});});
    let mode='cluster',run=0;samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.62?'cluster':r<0.86?'sparse':'open';run=2+Math.floor(rng()*4);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='cluster'){rock(p[0],p[1],null,low);if(rng()<0.6)rock(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,low);if(rng()<0.3)rock(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,true);}
      else if(mode==='sparse'){if(rng()<0.5)rock(p[0],p[1],null,low);else pebbles(p[0],p[1]);}else if(rng()<0.5)pebbles(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.6)rock(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<10;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.2)rock(px,py,{scale:0.8+rng()*0.25},py>cy+0.35);}});
  /* 3b. the rock count must be even around the whole rim (top = sides = bottom), then pulled to the target total */
  {const dE=(x,y,e)=>{const dx=e.b[0]-e.a[0],dy=e.b[1]-e.a[1],t=Math.max(0,Math.min(1,((x-e.a[0])*dx+(y-e.a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-(e.a[0]+dx*t),(y-(e.a[1]+dy*t))*1.4);};
    const classes=['top','side','bottom'],len={top:0,side:0,bottom:0};outer.forEach(e=>len[e.cls]+=e.len);
    const members=()=>{const m={top:[],side:[],bottom:[]};placed.filter(o=>o.cat==='rock').forEach(o=>{let best=null,bd=1e9;outer.forEach(e=>{const d=dE(o.x,o.y,e);if(d<bd){bd=d;best=e;}});if(bd<0.32)m[best.cls].push(o);});return m;};
    let m=members();const mean=(m.top.length+m.side.length+m.bottom.length)/(len.top+len.side+len.bottom);
    classes.forEach(cl=>{const target=Math.round(len[cl]*mean);let list=m[cl];
      if(list.length>target+1){const drop=list.length-target;for(let i=0;i<drop;i++){const pick=list.splice(Math.floor(rng()*list.length),1)[0],ix=placed.indexOf(pick);if(ix>=0)placed.splice(ix,1);}}
      else if(list.length<target-1){const need=target-list.length,es=outer.filter(e=>e.cls===cl);let added=0,guard=0;while(added<need&&guard++<160){const e=es[Math.floor(rng()*es.length)],p=onEdge(e,rng(),(rng()-0.2)*0.12);if(rock(p[0],p[1],null,cl!=='top'))added++;}}});
    const TARGET=84,isRim=o=>outer.some(e=>dE(o.x,o.y,e)<0.32),rocks=()=>placed.filter(o=>o.cat==='rock');let n=rocks().length;
    if(n>TARGET){const inner=rocks().filter(o=>!isRim(o));let drop=Math.min(n-TARGET,inner.length);while(drop-->0){const o=inner.splice(Math.floor(rng()*inner.length),1)[0],ix=placed.indexOf(o);if(ix>=0)placed.splice(ix,1);}}
    else if(n<TARGET){let guard=0;while(rocks().length<TARGET&&guard++<900){const c=G.centers[Math.floor(rng()*G.centers.length)],px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;rock(px,py,{scale:0.8+rng()*0.25},py>cy+0.35);}}}
  /* 4. loose pebbles and debris */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.5)pebbles(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.4)pebbles(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.45)pebbles(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.35)pebbles(px,py);}});
  /* 5. small props: lower tiers only */
  [['flag',2],['floodLight',2],['beacon',2],['canisters',2],['smallCrates',3]].forEach(([k,n])=>{for(let i=0;i<landCnt(n);i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  /* every habitat gets a facing (bit0 mirror, bit1 variant: tube side / pod axis / door wall); neighbours cycle through all four */
  {const hs=placed.filter(o=>/Hab$/.test(o.kind)).sort((a,b)=>a.x-b.x||a.y-b.y),cyc=[0,3,1,2];hs.forEach((o,i)=>{o.v=((o.v>>2)<<2)|cyc[i%4];});placed.filter(o=>o.kind==='commMast').forEach(o=>{o.v=((o.v>>2)<<2)|(rng()<0.5?1:0);});}
  const cuts={rock:[0.2,0.5,0.78,1],shrub:[0.08,0.4,0.7,1],prop:[1,1,1,1],struct:[0,0,0,0],ruin:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.rock;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='struct'||o.cat==='ruin')o.tier=o.minT;});
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.sort((a,b)=>a.y-b.y);
  return SPACE_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: grey-blue regolith with scattered small craters, dust drifts and pebbles (decals, not objects) ---- */
function spaceGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<46;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'205,214,235':'40,46,70',r()<0.5?0.22:0.24);}
  for(let k=0;k<10;k++){const p=pt(),w=R*(0.35+r()*0.6);soft(p[0],p[1],w,w*0.4,'150,110,100',0.12);}                  /* rusty dust */
  for(let k=0;k<8;k++){const p=pt(),w=R*(0.5+r()*0.8);for(let j=0;j<5;j++)TH.ln(c,[p[0]-w*0.5,p[1]+j*R*0.03],[p[0]+w*0.5,p[1]+j*R*0.03-R*0.02],'rgba(220,228,245,.12)',R*0.014);}   /* wind-swept dust streaks */
  for(let k=0;k<60;k++){const p=pt(),rx=R*(0.05+r()*0.16),ry=rx*0.42;c.fillStyle='rgba(30,36,58,.28)';c.beginPath();c.ellipse(p[0],p[1],rx,ry,0,0,7);c.fill();c.strokeStyle='rgba(225,232,248,.34)';c.lineWidth=Math.max(0.7,R*0.012);c.beginPath();c.ellipse(p[0],p[1],rx,ry,0,Math.PI*0.95,Math.PI*2.1);c.stroke();}   /* small craters */
  for(let k=0;k<170;k++){const p=pt();TH.ell(c,p[0],p[1],R*(0.008+r()*0.012),R*0.007,r()<0.5?'rgba(40,46,66,.5)':'rgba(220,228,245,.45)');}
  c.restore();c.restore();
}
const SPACE_THEME={id:'space',assets:SPACE_ASSETS,plan:getSpacePlan,ground:spaceGround,groundCol:'#8d95a7',top:1.45};
const SPACE_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
function bakeLandSpace(shape,tier,R,opts){return bakeLandTheme(SPACE_THEME,shape,tier,R,opts);}
function drawLandSpaceBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandSpaceFront(ctx,x,y,land){land.sprites.slice().sort((a,b)=>a.y-b.y).forEach(s=>drawScenicSprite(ctx,s,x+s.x,y+s.y));}
function landSpaceSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}


return Object.freeze({bake: bakeLandSpace, drawBack: drawLandSpaceBack, drawFront: drawLandSpaceFront});
})(),
  nordic: (() => {

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
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[0,1,2],[-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5,1.5]],C:[[0],[-0.5,0.5,1.5],[-1,0,1],[-0.5]],D:[[0,1,2],[-0.5,0.5,1.5],[0,1]]};
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

function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol,clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]),key=[T.id,shape,tier,R,m,ground,sc,JSON.stringify(clr),JSON.stringify(opts.clearTiles||[])].join('|');const cached=revisedLandCache.get(key);if(cached)return cached;
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=0.75,top=T.top||1.35,bot=0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);return[cv,g];};
  const [back,cb]=mk();T.ground(cb,G,R,ox,oy,m,ground,({A:11,B:22,C:33,D:44})[shape]);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]),vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho))&&!(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));
  const sprites=vis.map(o=>{const unit=u*(o.scale||1);return {x:m*o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>T.assets[o.kind].draw(ctx,x,y,unit,o.v)};});
  const front=document.createElement('canvas'),frontRect={x:0,y:0,w:1,h:1};front.width=front.height=1;
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return revisedLandCache.set(key,{back,front,frontRect,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0,sprites});
}
function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}

/* ===== NORDIC LAND: planner (dark-green pines with sharp rock spikes, a few modest peaks and hills spread around the rim, ponds in the corridors between tiles, little Viking huts) ===== */
const NORDIC_REGION={top:{pineN:.28,spruceN:.22,firN:.1,snowPineN:.06,birchN:.14,rowan:.06,juniperN:.06,youngPineN:.08},mid:{pineN:.28,spruceN:.2,firN:.12,birchN:.16,rowan:.08,juniperN:.06,youngPineN:.1},bottom:{pineN:.2,spruceN:.14,firN:.12,birchN:.18,rowan:.1,juniperN:.1,youngPineN:.16}};
const NORDIC_LOW=[['youngPineN',1],['juniperN',0.9],['birchN',0.6],['rowan',0.7],['youngPineN',1.25],['pineN',0.55],['firN',0.62]];
const NORDIC_CAP={snowPineN:8};
const NORDIC_UNDER=['heather','bilberry','fernN','grassN','heather','fernN','bilberry','grassN','boulderN'];
const NORDIC_PLAN_CACHE={};
function getNordicPlan(shape){
  if(NORDIC_PLAN_CACHE[shape])return NORDIC_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(({A:7301,B:8402,C:9581,D:10682})[shape]),placed=[],bb=G.bbox,used={},A=NORDIC_ASSETS;
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
  const LKS=G.centers.length/12,landThin=l=>{const n=Math.max(1,Math.round(l.length*LKS));return Array.from({length:n},(_,i)=>l[Math.floor((i+0.5)*l.length/n)]);},landCnt=n=>Math.max(1,Math.round(n*LKS));
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1a. two or three ponds in the wide corridors BETWEEN horizontally adjacent tiles (spread apart; they appear one per tier) */
  {const vc=interior.filter(e=>e.vertical).map(e=>e.mid),picks=[],pool=vc.slice();while(picks.length<landCnt(3)&&pool.length){let best=0,bd=-1;pool.forEach((p,i)=>{const d=picks.length?Math.min(...picks.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4))):rng();if(d>bd){bd=d;best=i;}});const p=pool.splice(best,1)[0],o=place('pond',p[0],p[1],{minT:picks.length+1,scale:1,clear:3.4,noSouth:true,fixed:true});if(o)picks.push([o.x,o.y]);}}
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
  landThin([['turfHut',1],['plankHut',2],['boatHouse',3],['turfHut',4]]).forEach(([k,mt])=>spread(k,rim,{minT:mt,scale:1.15,clear:2.5,noSouth:true}));
  landThin([['plankHut',2],['turfHut',3],['boatHouse',4],['plankHut',4]]).forEach(([k,mt])=>spread(k,inn,{minT:mt,scale:1.0,clear:3.0,noSouth:true}));
  {const home=manors[manors.length-1]||placed.find(o=>o.cat==='struct');if(home){for(const [dx,dy] of [[0.36,-0.08],[-0.36,-0.08],[0.3,0.12],[-0.3,0.12],[0.44,0.0],[-0.44,0.0]]){const o=place('lookoutTower',home.x+dx,home.y+dy,{minT:4,scale:1.0,clear:2.4,noSouth:true});if(o)break;}}}
  /* 2b. Viking pieces scattered through the land (farthest-point spacing): runestones, a beached longship, drying racks, a forge, a longfire */
  landThin([['runestone',1],['longship',2],['dryingRack',2],['runestone',3],['forge',3],['longfire',3],['dryingRack',4],['runestone',4]]).forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,scale:k==='longship'?1.1:1.0,clear:1.8,noSouth:true}));
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
  [['vikingBanner',2],['torchPost',2],['shieldRack',2],['barrelsN',2],['woodPile',2]].forEach(([k,n])=>{for(let i=0;i<landCnt(n);i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
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
function drawLandNordicFront(ctx,x,y,land){land.sprites.slice().sort((a,b)=>a.y-b.y).forEach(s=>drawScenicSprite(ctx,s,x+s.x,y+s.y));}
function landNordicSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}


return Object.freeze({bake: bakeLandNordic, drawBack: drawLandNordicBack, drawFront: drawLandNordicFront});
})(),
  alps: (() => {

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
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[0,1,2],[-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5,1.5]],C:[[0],[-0.5,0.5,1.5],[-1,0,1],[-0.5]],D:[[0,1,2],[-0.5,0.5,1.5],[0,1]]};
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

function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol,clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]),key=[T.id,shape,tier,R,m,ground,sc,JSON.stringify(clr),JSON.stringify(opts.clearTiles||[])].join('|');const cached=revisedLandCache.get(key);if(cached)return cached;
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=0.75,top=T.top||1.35,bot=0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);return[cv,g];};
  const [back,cb]=mk();T.ground(cb,G,R,ox,oy,m,ground,({A:11,B:22,C:33,D:44})[shape]);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]),vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho))&&!(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));
  const sprites=vis.map(o=>{const unit=u*(o.scale||1);return {x:m*o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>T.assets[o.kind].draw(ctx,x,y,unit,o.v)};});
  const front=document.createElement('canvas'),frontRect={x:0,y:0,w:1,h:1};front.width=front.height=1;
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return revisedLandCache.set(key,{back,front,frontRect,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0,sprites});
}
function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}

/* ===== ALPINE LAND: planner (Frontier-style dense conifer forest, snowy mountains spread around the rim, alpine chalets / alm huts / hay barns, cows and goats; ground identical to the Nordic land so they blend) ===== */
const ALPINE_REGION={top:{spruceA:.28,firA:.1,pineA:.14,snowSpruceA:.08,larch:.14,youngSpruceA:.08,birchA:.1,rowanA:.08},mid:{spruceA:.3,firA:.12,pineA:.14,larch:.16,youngSpruceA:.1,birchA:.1,rowanA:.08},bottom:{spruceA:.22,firA:.12,pineA:.12,larch:.14,youngSpruceA:.16,birchA:.12,rowanA:.12}};
const ALPINE_LOW=[['youngSpruceA',1],['rowanA',0.7],['birchA',0.6],['firA',0.62],['youngSpruceA',1.25],['larch',0.6],['pineA',0.55]];
const ALPINE_CAP={snowSpruceA:10,larch:22};
const ALPINE_UNDER=['alpenrose','gentian','edelweiss','krummholz','grassA','fernA','alpenrose','gentian','snowBoulders'];
const ALPINE_PLAN_CACHE={};
function getAlpinePlan(shape){
  if(ALPINE_PLAN_CACHE[shape])return ALPINE_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(({A:7301,B:8402,C:9594,D:10695})[shape]),placed=[],bb=G.bbox,used={},A=ALPINE_ASSETS;
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
  const LKS=G.centers.length/12,landThin=l=>{const n=Math.max(1,Math.round(l.length*LKS));return Array.from({length:n},(_,i)=>l[Math.floor((i+0.5)*l.length/n)]);},landCnt=n=>Math.max(1,Math.round(n*LKS));
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
  landThin([['chalet',1],['almHut',2],['hayBarn',3],['chalet',4]]).forEach(([k,mt])=>spread(k,rim,{minT:mt,scale:1.15,clear:2.5,noSouth:true}));
  landThin([['almHut',2],['chalet',3],['hayBarn',4],['almHut',4]]).forEach(([k,mt])=>spread(k,inn,{minT:mt,scale:1.0,clear:3.0,noSouth:true}));
  {const home=manors[manors.length-1]||placed.find(o=>o.cat==='struct');if(home){for(const [dx,dy] of [[0.36,-0.08],[-0.36,-0.08],[0.3,0.12],[-0.3,0.12],[0.44,0.0],[-0.44,0.0]]){const o=place('alpChapel',home.x+dx,home.y+dy,{minT:4,scale:1.0,clear:2.4,noSouth:true});if(o)break;}}}
  /* 2b. alpine pieces scattered through the land (farthest-point spacing): cows, goats, wayside shrines, a log shed, a trough, cairns */
  landThin([['cows',1],['wayShrine',2],['cows',2],['cairn',2],['logShed',3],['trough',3],['goats',3],['wayShrine',4],['cows',4],['cairn',4]]).forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,scale:k==='cows'||k==='goats'?1.15:1.0,clear:1.8,noSouth:true}));
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
  [['pennants',2],['lanternA',2],['zigzagFence',2],['milkCans',2],['firewood',2],['hayBaleA',2],['trailSign',2]].forEach(([k,n])=>{for(let i=0;i<landCnt(n);i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
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
function drawLandAlpineFront(ctx,x,y,land){land.sprites.slice().sort((a,b)=>a.y-b.y).forEach(s=>drawScenicSprite(ctx,s,x+s.x,y+s.y));}
function landAlpineSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}


return Object.freeze({bake: bakeLandAlpine, drawBack: drawLandAlpineBack, drawFront: drawLandAlpineFront});
})(),
  classic: (() => {

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
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[0,1,2],[-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5,1.5]],C:[[0],[-0.5,0.5,1.5],[-1,0,1],[-0.5]],D:[[0,1,2],[-0.5,0.5,1.5],[0,1]]};
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

function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol,clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]),key=[T.id,shape,tier,R,m,ground,sc,JSON.stringify(clr),JSON.stringify(opts.clearTiles||[])].join('|');const cached=revisedLandCache.get(key);if(cached)return cached;
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=0.75,top=T.top||1.35,bot=0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);return[cv,g];};
  const [back,cb]=mk();T.ground(cb,G,R,ox,oy,m,ground,({A:11,B:22,C:33,D:44})[shape]);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]),vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho))&&!(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));
  const sprites=vis.map(o=>{const unit=u*(o.scale||1);return {x:m*o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>T.assets[o.kind].draw(ctx,x,y,unit,o.v)};});
  const front=document.createElement('canvas'),frontRect={x:0,y:0,w:1,h:1};front.width=front.height=1;
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return revisedLandCache.set(key,{back,front,frontRect,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0,sprites});
}
function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}

/* ===== CLASSIC MIDWAY LAND (county fair): planner (a few shade trees, striped-awning booths and food stands, an exhibition barn on the back rim, livestock pens / bandstand / tractor / picnic tables, no terrain) ===== */
const CLASSIC_REGION={top:{oakC:.34,mapleC:.3,elmC:.2,saplingC:.16},mid:{oakC:.34,mapleC:.3,elmC:.2,saplingC:.16},bottom:{oakC:.3,mapleC:.3,elmC:.18,saplingC:.22}};
const CLASSIC_LOW=[['saplingC',1],['mapleC',0.6],['oakC',0.55],['saplingC',1.2],['mapleC',0.7],['elmC',0.5]];
const CLASSIC_CAP={};
const CLASSIC_UNDER=['flowerBed','flowerBed','hedgeC','bushC','grassC','flowerBed','grassC','bushC'];
const CLASSIC_PLAN_CACHE={};
function getClassicPlan(shape){
  if(CLASSIC_PLAN_CACHE[shape])return CLASSIC_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(({A:7301,B:8402,C:9607,D:10708})[shape]),placed=[],bb=G.bbox,used={},A=CLASSIC_ASSETS;
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
  const LKS=G.centers.length/12,landThin=l=>{const n=Math.max(1,Math.round(l.length*LKS));return Array.from({length:n},(_,i)=>l[Math.floor((i+0.5)*l.length/n)]);},landCnt=n=>Math.max(1,Math.round(n*LKS));
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. the back rim carries the red exhibition barn (no tree backdrop: the trees there are the same density as everywhere else) */
  {const pts=[];top.forEach(e=>[0.3,0.5,0.7].forEach(t=>pts.push(onEdge(e,t,0.0))));const p=pts.reduce((b,q)=>Math.abs(q[0]-cx)<Math.abs(b[0]-cx)?q:b);for(const [dx,dy] of [[0,-0.02],[0.3,0],[-0.3,0],[0,0.04]]){const o=place('smallBarn',p[0]+dx,p[1]+dy,{minT:1,scale:1.2,clear:2.4,noSouth:true});if(o)break;}}
  /* 2. fair booths and food stands: 4 on the rim (spread by farthest-point), 5 through the middle, then ONE announcer's tower beside a booth */
  const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.filter(e=>e.vertical).forEach(e=>inn.push([e.mid[0],e.mid[1]]));
  const chosen=placed.filter(o=>o.cat==='ruin'||o.cat==='struct').map(o=>[o.x,o.y]),manors=[];
  const spread=(k,pool,extra)=>{const ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.22})).sort((a,b)=>b.d-a.d);for(let n=0;n<Math.min(12,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],extra);if(o){chosen.push([o.x,o.y]);if(/^(gameBooth|foodStand|ticketBooth)$/.test(k))manors.push(o);return o;}}return null;};
  landThin([['gameBooth',1],['foodStand',1],['ticketBooth',3],['gameBooth',4]]).forEach(([k,mt])=>spread(k,rim,{minT:mt,scale:1.15,clear:2.5,noSouth:true}));
  landThin([['foodStand',2],['gameBooth',2],['foodStand',3],['foodStand',4],['gameBooth',4]]).forEach(([k,mt])=>spread(k,inn,{minT:mt,scale:1.0,clear:3.0,noSouth:true}));
  {const home=manors[manors.length-1]||placed.find(o=>o.cat==='struct');if(home){for(const [dx,dy] of [[0.36,-0.08],[-0.36,-0.08],[0.3,0.12],[-0.3,0.12],[0.44,0.0],[-0.44,0.0]]){const o=place('announcerTower',home.x+dx,home.y+dy,{minT:4,scale:1.0,clear:2.4,noSouth:true});if(o)break;}}}
  /* 2b. fair pieces scattered through the land (farthest-point spacing): livestock pens, picnic tables, a pie-judging table, the bandstand, a duck-pond game, a vintage tractor */
  landThin([['livestockPen',1],['picnicSet',1],['pieTable',2],['livestockPen',2],['bandstand',3],['duckPond',3],['tractor',3],['picnicSet',4],['livestockPen',4],['picnicSet',4]]).forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,scale:k==='livestockPen'||k==='duckPond'?1.1:1.0,clear:1.8,noSouth:true,sz:0.62}));
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
  [['bunting',3],['hayBaleC',2],['lightPole',3],['balloons',2],['ropeBarrier',2],['trashBarrel',2]].forEach(([k,n])=>{for(let i=0;i<landCnt(n);i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
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
function drawLandClassicFront(ctx,x,y,land){land.sprites.slice().sort((a,b)=>a.y-b.y).forEach(s=>drawScenicSprite(ctx,s,x+s.x,y+s.y));}
function landClassicSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}


return Object.freeze({bake: bakeLandClassic, drawBack: drawLandClassicBack, drawFront: drawLandClassicFront});
})(),
  americana: (() => {

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

/* ===== iso building helpers (shared by the Caribbean + Americana packs). I=(X,Y,Z)=>screen point. Front face = plane Y=y1 (faces lower-left), right face = plane X=x1 (faces lower-right). ===== */
const MIR=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
const BP=(c,pts,fill,stroke,lw)=>TH.poly(c,pts,fill,stroke,lw);
const BF=(c,I,x0,x1,y1,z0,z1,col)=>BP(c,[I(x0,y1,z0),I(x1,y1,z0),I(x1,y1,z1),I(x0,y1,z1)],col);
const BR=(c,I,x1,y0,y1,z0,z1,col)=>BP(c,[I(x1,y0,z0),I(x1,y1,z0),I(x1,y1,z1),I(x1,y0,z1)],col);
const BT=(c,I,x0,x1,y0,y1,z,col)=>BP(c,[I(x0,y0,z),I(x1,y0,z),I(x1,y1,z),I(x0,y1,z)],col);
const WF=(c,I,y1,X,Z,w,h,col,fr)=>BP(c,[I(X-w/2,y1,Z-h/2),I(X+w/2,y1,Z-h/2),I(X+w/2,y1,Z+h/2),I(X-w/2,y1,Z+h/2)],col,fr,fr?0.9:0);
const WR=(c,I,x1,Y,Z,w,h,col,fr)=>BP(c,[I(x1,Y-w/2,Z-h/2),I(x1,Y+w/2,Z-h/2),I(x1,Y+w/2,Z+h/2),I(x1,Y-w/2,Z+h/2)],col,fr,fr?0.9:0);
/* clapboard / brick courses on a face: n lines between z0 and z1 */
const BFL=(c,I,x0,x1,y1,z0,z1,step,col,u)=>{for(let z=z0+step;z<z1-0.01;z+=step)TH.ln(c,I(x0,y1,z),I(x1,y1,z),col,u*0.05);};
const BRL=(c,I,x1,y0,y1,z0,z1,step,col,u)=>{for(let z=z0+step;z<z1-0.01;z+=step)TH.ln(c,I(x1,y0,z),I(x1,y1,z),col,u*0.05);};
/* hip roof over a rectangle: ridge runs along X; front trapezoid + right triangle */
function HIP(c,I,x0,x1,y0,y1,z,H,o,cf,cr,u,tex){const yc=(y0+y1)/2,xr0=x0+(y1-y0)/2,xr1=x1-(y1-y0)/2,A=I(x0-o,y1+o,z),B=I(x1+o,y1+o,z),R1=I(xr1,yc,z+H),R0=I(xr0,yc,z+H),C=I(x1+o,y0-o,z);
  BP(c,[B,C,R1],cr);BP(c,[A,B,R1,R0],cf);
  if(tex){for(let k=1;k<=tex;k++){const t=k/(tex+1),L=[A[0]+(R0[0]-A[0])*t,A[1]+(R0[1]-A[1])*t],Rr=[B[0]+(R1[0]-B[0])*t,B[1]+(R1[1]-B[1])*t];TH.ln(c,L,Rr,'rgba(0,0,0,.16)',u*0.07);TH.ln(c,[L[0],L[1]-u*0.07],[Rr[0],Rr[1]-u*0.07],'rgba(255,255,255,.14)',u*0.05);}}
  TH.ln(c,R0,R1,shade(cf,-0.3),u*0.16);}
/* gable roof, ridge along X: front slope + right gable end */
function GAB(c,I,x0,x1,y0,y1,z,H,o,cf,cg,u,tex){const yc=(y0+y1)/2,A=I(x0-o,y1+o,z),B=I(x1+o,y1+o,z),R1=I(x1+o,yc,z+H),R0=I(x0-o,yc,z+H);
  BP(c,[I(x1,y0,z),I(x1,y1,z),I(x1,yc,z+H*0.86)],cg);BP(c,[A,B,R1,R0],cf);
  if(tex){for(let k=1;k<=tex;k++){const t=k/(tex+1),L=[A[0]+(R0[0]-A[0])*t,A[1]+(R0[1]-A[1])*t],Rr=[B[0]+(R1[0]-B[0])*t,B[1]+(R1[1]-B[1])*t];TH.ln(c,L,Rr,'rgba(0,0,0,.16)',u*0.07);TH.ln(c,[L[0],L[1]-u*0.07],[Rr[0],Rr[1]-u*0.07],'rgba(255,255,255,.14)',u*0.05);}}
  TH.ln(c,R0,R1,shade(cf,-0.3),u*0.16);TH.ln(c,A,B,shade(cf,-0.25),u*0.1);}
const GLOW=(c,x,y,r,rgb,a)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();};

function RC(c,x,y,rx,ry,wh,cols){const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,cols[0]);g.addColorStop(0.5,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y-wh);c.lineTo(x-rx,y);c.ellipse(x,y,rx,ry,0,Math.PI,0,true);c.lineTo(x+rx,y-wh);c.ellipse(x,y-wh,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();}
const TKCYL2=RC;
const SLAB=(c,x,y,u,x0,x1,y0,y1)=>TH.box(c,x,y,u,x0,x1,y0,y1,0,0.14,'#e8dfc8','#bfb59a','#f1e9d4');
function ABAR(c,x,y,rx,h){const ry=rx*0.5,g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,'#b98a58');g.addColorStop(0.5,'#8a5a33');g.addColorStop(1,'#5a3a22');c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y-h);c.quadraticCurveTo(x-rx*1.2,y-h*0.5,x-rx,y);c.ellipse(x,y,rx,ry,0,Math.PI,0,true);c.quadraticCurveTo(x+rx*1.2,y-h*0.5,x+rx,y-h);c.ellipse(x,y-h,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();c.strokeStyle='#3a3a42';c.lineWidth=Math.max(1,rx*0.14);[0.22,0.78].forEach(f=>{c.beginPath();c.ellipse(x,y-h*f,rx*1.08,ry*1.08,0,0.05,Math.PI-0.05);c.stroke();});TH.ell(c,x,y-h,rx,ry,'#a07a4a');TH.ell(c,x,y-h,rx*0.8,ry*0.8,'#6a4a2c');}
function ABAR2(c,x,y,rx,h,col){const ry=rx*0.5,g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,shade(col,0.2));g.addColorStop(0.5,col);g.addColorStop(1,shade(col,-0.35));c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y-h);c.quadraticCurveTo(x-rx*1.12,y-h*0.5,x-rx,y);c.ellipse(x,y,rx,ry,0,Math.PI,0,true);c.quadraticCurveTo(x+rx*1.12,y-h*0.5,x+rx,y-h);c.ellipse(x,y-h,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();c.strokeStyle='rgba(20,20,24,.55)';c.lineWidth=Math.max(1,rx*0.1);[0.25,0.75].forEach(f=>{c.beginPath();c.ellipse(x,y-h*f,rx*1.05,ry*1.05,0,0.05,Math.PI-0.05);c.stroke();});}
function RSPH(c,x,y,r,cols){const g=c.createRadialGradient(x-r*0.35,y-r*0.4,r*0.1,x,y,r*1.05);g.addColorStop(0,cols[0]);g.addColorStop(0.55,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();}
/* ===== AMERICANA ASSETS: Main-Street-USA Victorian town. Storefronts with awnings + gingerbread, town hall, bandstand, gas lamps. draw(c,x,y,u,v): v bit3 = mirror (shopfront faces the street), bits0-2 = body colour, bits4-6 = awning ===== */
const AMBODY=['#e8c3b6','#c3d6b9','#efdfae','#b5cde2','#d8b699','#c0675a','#7fa08f','#d8c0e0'],AMTRIM='#fbf6e8',AMAWN=[['#c43a30','#fbf6e8'],['#2f6a8a','#fbf6e8'],['#2f7a4a','#fbf6e8'],['#e0a030','#fbf6e8'],['#7a3a8a','#fbf6e8'],['#d84a7a','#fbf6e8']],AMROOF=['#6a7a8a','#7a5a4a','#5a6a58','#8a4a3a'];
const ASH=(c,x,y,rx)=>{c.fillStyle='rgba(50,56,40,.25)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
function ACONE(c,x,y,rx,ry,h,col,u,scal){const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,shade(col,0.18));g.addColorStop(0.5,col);g.addColorStop(1,shade(col,-0.3));c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y);c.lineTo(x,y-h);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();
  if(scal){for(let k=0;k<scal;k++){const a0=Math.PI*k/scal,a1=Math.PI*(k+1)/scal;c.fillStyle=k%2?'#fbf6e8':shade(col,-0.1);c.beginPath();c.moveTo(x+Math.cos(a0)*rx,y+Math.sin(a0)*ry);c.lineTo(x+Math.cos((a0+a1)/2)*rx,y+Math.sin((a0+a1)/2)*ry+u*0.4);c.lineTo(x+Math.cos(a1)*rx,y+Math.sin(a1)*ry);c.closePath();c.fill();}}
  c.save();c.beginPath();c.moveTo(x-rx,y);c.lineTo(x,y-h);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.clip();for(let k=0;k<=14;k++){const a=Math.PI*k/14;TH.ln(c,[x,y-h],[x+Math.cos(a)*rx,y+Math.sin(a)*ry],'rgba(0,0,0,.12)',u*0.05);}c.restore();}
/* striped sloped awning projecting from the front wall at Y=y1 */
function AWN(c,I,X0,X1,y1,zTop,zBot,dY,col,u){const n=Math.max(4,Math.round((X1-X0)/0.5));for(let k=0;k<n;k++){const a=X0+(X1-X0)*k/n,b=X0+(X1-X0)*(k+1)/n,cc=k%2?col[1]:col[0];BP(c,[I(a,y1,zTop),I(b,y1,zTop),I(b,y1+dY,zBot),I(a,y1+dY,zBot)],cc);const p=I(a,y1+dY,zBot),q=I(b,y1+dY,zBot);BP(c,[p,q,[(p[0]+q[0])/2,(p[1]+q[1])/2+u*0.42]],cc);}}
const AME_ASSETS={
  emporium:{cat:'struct',rho:0.13,draw(c,x,y,u,v){MIR(c,x,v&8,()=>{const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),w=AMBODY[v&7],wr=shade(w,-0.2),aw=AMAWN[((v>>4)&7)%6];ASH(c,x,y,u*5.0);SLAB(c,x,y,u,-2.7,2.7,-2.0,3.0);
    BF(c,I,-2.4,2.4,1.7,0,4.6,w);BR(c,I,2.4,-1.7,1.7,0,4.6,wr);BFL(c,I,-2.4,2.4,1.7,0.5,4.6,0.34,'rgba(0,0,0,.08)',u);BRL(c,I,2.4,-1.7,1.7,0.5,4.6,0.34,'rgba(0,0,0,.12)',u);
    BF(c,I,-2.4,2.4,1.7,0,0.55,shade(w,-0.38));BR(c,I,2.4,-1.7,1.7,0,0.55,shade(w,-0.5));
    [-1.5,1.5].forEach(X=>{WF(c,I,1.7,X,1.35,1.4,1.45,'#a9d6e6',AMTRIM);TH.ln(c,I(X,1.7,0.62),I(X,1.7,2.08),AMTRIM,u*0.07);TH.poly(c,[I(X-0.6,1.7,0.7),I(X-0.1,1.7,0.7),I(X+0.3,1.7,2.0),I(X-0.2,1.7,2.0)],'rgba(255,255,255,.3)');});
    WF(c,I,1.7,0,1.15,0.9,1.95,AMTRIM);WF(c,I,1.7,0,1.1,0.66,1.75,'#8fc4d8');
    AWN(c,I,-2.3,2.3,1.7,2.45,1.95,0.85,aw,u);
    [-1.5,0,1.5].forEach(X=>{WF(c,I,1.7,X,3.5,0.9,1.5,'#27394d',AMTRIM);WF(c,I,1.7,X,3.5,0.7,1.3,'#f0e6c8');TH.ln(c,I(X,1.7,2.85),I(X,1.7,4.15),AMTRIM,u*0.06);BP(c,[I(X-0.55,1.7,4.3),I(X+0.55,1.7,4.3),I(X,1.7,4.65)],AMTRIM);});
    [0.2,-1.0].forEach((Y,i)=>{WR(c,I,2.4,Y,3.5,0.9,1.5,'#27394d',AMTRIM);WR(c,I,2.4,Y,1.4,0.9,1.3,'#27394d',AMTRIM);});
    TH.box(c,x,y,u,-2.65,2.65,-1.95,1.95,4.6,4.95,AMTRIM,shade(AMTRIM,-0.18),'#ffffff');for(let k=0;k<7;k++){const X=-2.3+k*0.77;TH.box(c,x,y,u,X-0.12,X+0.12,1.7,1.95,4.15,4.6,AMTRIM,shade(AMTRIM,-0.2),AMTRIM);}
    TH.box(c,x,y,u,-2.4,2.4,-1.7,1.7,4.95,5.3,shade(w,-0.05),shade(w,-0.25),shade(w,0.12));BP(c,[I(-1.3,1.7,5.3),I(1.3,1.7,5.3),I(1.3,1.7,6.0),I(-1.3,1.7,6.0)],shade(w,-0.05));BP(c,[I(-1.1,1.7,5.45),I(1.1,1.7,5.45),I(1.1,1.7,5.85),I(-1.1,1.7,5.85)],'#e8c46a');
    [[-2.3,1.6],[2.3,1.6]].forEach(([X,Y])=>{const p=I(X,Y,5.3);TH.ell(c,p[0],p[1]-u*0.35,u*0.28,u*0.4,AMTRIM);TH.ell(c,p[0],p[1]-u*0.8,u*0.2,u*0.2,AMTRIM);});}) }},
  parlor:{cat:'struct',rho:0.12,draw(c,x,y,u,v){MIR(c,x,v&8,()=>{const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),w=['#f4c6d6','#c8e6e0','#f6e2a8','#d8c8f0'][v&3],wr=shade(w,-0.2),aw=AMAWN[((v>>4)&7)%6];ASH(c,x,y,u*4.6);SLAB(c,x,y,u,-2.5,2.5,-1.9,2.8);
    BF(c,I,-2.2,2.2,1.6,0,3.8,w);BR(c,I,2.2,-1.6,1.6,0,3.8,wr);BFL(c,I,-2.2,2.2,1.6,0.5,3.8,0.3,'rgba(0,0,0,.08)',u);BRL(c,I,2.2,-1.6,1.6,0.5,3.8,0.3,'rgba(0,0,0,.12)',u);
    BF(c,I,-2.2,2.2,1.6,0,0.5,shade(w,-0.3));
    WF(c,I,1.6,-0.7,1.3,2.0,1.5,'#a9d6e6',AMTRIM);WF(c,I,1.6,1.35,1.2,0.9,1.9,AMTRIM);WF(c,I,1.6,1.35,1.15,0.68,1.7,'#8fc4d8');
    AWN(c,I,-2.1,2.1,1.6,2.4,1.95,0.8,aw,u);
    [-1.2,0.2,1.5].forEach(X=>{WF(c,I,1.6,X,3.1,0.8,1.2,'#27394d',AMTRIM);WF(c,I,1.6,X,3.1,0.6,1.0,'#f0e6c8');});WR(c,I,2.2,-0.2,3.0,0.9,1.3,'#27394d',AMTRIM);WR(c,I,2.2,-0.2,1.3,0.9,1.2,'#27394d',AMTRIM);
    TH.box(c,x,y,u,-2.4,2.4,-1.8,1.8,3.8,4.0,AMTRIM,shade(AMTRIM,-0.18),'#ffffff');
    HIP(c,I,-2.2,2.2,-1.6,1.6,4.0,1.9,0.2,AMROOF[(v>>2)&3],shade(AMROOF[(v>>2)&3],-0.28),u,5);
    /* gingerbread fretwork on the front eave */
    for(let k=0;k<10;k++){const X=-2.0+k*0.44,p=I(X,1.8,3.8);TH.ell(c,p[0],p[1]+u*0.25,u*0.15,u*0.3,AMTRIM);}
    /* ice-cream cone sign */
    const sp=I(2.5,1.7,2.9);TH.ln(c,sp,[sp[0],sp[1]-u*1.0],'#2a2a30',u*0.12);const cx=sp[0],cy=sp[1]-u*1.0;TH.poly(c,[[cx-u*0.55,cy-u*0.2],[cx+u*0.55,cy-u*0.2],[cx,cy+u*1.2]],'#e0b060');TH.ell(c,cx,cy-u*0.3,u*0.62,u*0.5,'#f4a6cb');TH.ell(c,cx,cy-u*0.95,u*0.5,u*0.42,'#fbf6e8');TH.ell(c,cx+u*0.1,cy-u*1.35,u*0.1,u*0.1,'#e0303a');}) }},
  cornerBank:{cat:'struct',rho:0.14,draw(c,x,y,u,v){MIR(c,x,v&8,()=>{const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),w=AMBODY[v&7],wr=shade(w,-0.2),aw=AMAWN[((v>>4)&7)%6];ASH(c,x,y,u*5.2);SLAB(c,x,y,u,-3.1,2.5,-2.1,3.0);
    BF(c,I,-2.8,2.2,1.8,0,5.4,w);BR(c,I,2.2,-1.8,1.8,0,5.4,wr);BFL(c,I,-2.8,2.2,1.8,0.5,5.4,0.36,'rgba(0,0,0,.08)',u);BRL(c,I,2.2,-1.8,1.8,0.5,5.4,0.36,'rgba(0,0,0,.12)',u);
    BF(c,I,-2.8,2.2,1.8,0,0.55,shade(w,-0.38));BR(c,I,2.2,-1.8,1.8,0,0.55,shade(w,-0.5));
    [-2.0,-0.6].forEach(X=>WF(c,I,1.8,X,1.4,1.0,1.5,'#a9d6e6',AMTRIM));WF(c,I,1.8,0.6,1.15,0.9,2.0,AMTRIM);WF(c,I,1.8,0.6,1.1,0.66,1.8,'#8fc4d8');AWN(c,I,-2.7,1.2,1.8,2.45,1.95,0.8,aw,u);
    [[-2.0,3.3],[-0.6,3.3],[0.8,3.3],[-2.0,4.7],[-0.6,4.7],[0.8,4.7]].forEach(([X,Z])=>{WF(c,I,1.8,X,Z,0.8,1.1,'#27394d',AMTRIM);BP(c,[I(X-0.5,1.8,Z+0.65),I(X+0.5,1.8,Z+0.65),I(X,1.8,Z+0.98)],AMTRIM);});
    [-0.9,0.7].forEach(Y=>{WR(c,I,2.2,Y,3.3,0.8,1.1,'#27394d',AMTRIM);WR(c,I,2.2,Y,4.7,0.8,1.1,'#27394d',AMTRIM);WR(c,I,2.2,Y,1.4,0.8,1.2,'#27394d',AMTRIM);});
    TH.box(c,x,y,u,-3.0,2.4,-2.0,2.0,5.4,5.75,AMTRIM,shade(AMTRIM,-0.18),'#ffffff');
    /* corner turret */
    const tx=2.2,ty=1.8,tp=I(tx,ty,0),tr=u*1.35,tH=u*8.2;const g=c.createLinearGradient(tp[0]-tr,0,tp[0]+tr,0);g.addColorStop(0,shade(w,0.1));g.addColorStop(0.5,w);g.addColorStop(1,shade(w,-0.3));c.fillStyle=g;c.beginPath();c.moveTo(tp[0]-tr,tp[1]-tH);c.lineTo(tp[0]-tr,tp[1]);c.ellipse(tp[0],tp[1],tr,tr*0.5,0,Math.PI,0,true);c.lineTo(tp[0]+tr,tp[1]-tH);c.ellipse(tp[0],tp[1]-tH,tr,tr*0.5,0,0,Math.PI,false);c.closePath();c.fill();
    [2.5,4.9].forEach(zz=>{[-0.5,0.5].forEach(s=>{const a=Math.PI/2+s*0.7,px=tp[0]+Math.cos(a)*tr,py=tp[1]+Math.sin(a)*tr*0.5-u*zz;TH.poly(c,[[px-u*0.3,py+u*0.55],[px+u*0.3,py+u*0.55],[px+u*0.3,py-u*0.55],[px-u*0.3,py-u*0.55]],'#27394d',AMTRIM,u*0.05);});});
    TH.ell(c,tp[0],tp[1]-tH,tr*1.15,tr*0.58,AMTRIM);ACONE(c,tp[0],tp[1]-tH,tr*1.2,tr*0.6,u*3.4,AMROOF[(v>>2)&3],u,0);TH.ln(c,[tp[0],tp[1]-tH-u*3.4],[tp[0],tp[1]-tH-u*4.6],'#4a3a2a',u*0.1);TH.ell(c,tp[0],tp[1]-tH-u*4.7,u*0.2,u*0.2,'#e8c46a');}) }},
  townHall:{cat:'struct',rho:0.16,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),w='#b85c4a',wr=shade(w,-0.22);ASH(c,x,y,u*6.4);
    TH.box(c,x,y,u,-3.9,3.9,-2.1,2.9,0,0.3,'#d8d0bc','#b4ab98','#e6dfcd');
    BF(c,I,-3.7,3.7,2.0,0.3,3.7,w);BR(c,I,3.7,-2.0,2.0,0.3,3.7,wr);BFL(c,I,-3.7,3.7,2.0,0.3,3.7,0.3,'rgba(0,0,0,.1)',u);BRL(c,I,3.7,-2.0,2.0,0.3,3.7,0.3,'rgba(0,0,0,.14)',u);
    BF(c,I,-3.75,3.75,2.02,2.9,3.1,AMTRIM);
    [-3.0,-2.0,2.0,3.0].forEach(X=>{WF(c,I,2.0,X,1.45,0.8,1.3,'#27394d',AMTRIM);WF(c,I,2.0,X,2.4,0.8,0.5,'#27394d',AMTRIM);});[-0.9,0.7].forEach(Y=>{WR(c,I,3.7,Y,1.45,0.8,1.3,'#27394d',AMTRIM);WR(c,I,3.7,Y,2.5,0.8,1.0,'#27394d',AMTRIM);});
    TH.box(c,x,y,u,-1.0,1.0,2.0,2.8,0.3,0.7,'#e6dfcd','#b4ab98','#f4eede');TH.box(c,x,y,u,-1.4,1.4,2.0,3.2,0,0.3,'#e6dfcd','#b4ab98','#f4eede');
    WF(c,I,2.0,0,1.4,1.1,2.1,AMTRIM);WF(c,I,2.0,0,1.35,0.84,1.9,'#4a2e22');
    TH.box(c,x,y,u,-3.85,3.85,-2.15,2.15,3.7,4.0,AMTRIM,shade(AMTRIM,-0.18),'#ffffff');
    /* clock tower */
    BF(c,I,-1.25,1.25,2.0,3.7,8.9,w);BR(c,I,1.25,0.0,2.0,3.7,8.9,wr);BFL(c,I,-1.25,1.25,2.0,3.7,8.9,0.3,'rgba(0,0,0,.1)',u);
    BF(c,I,-1.3,1.3,2.03,6.3,6.45,AMTRIM);BF(c,I,-1.3,1.3,2.03,8.55,8.7,AMTRIM);
    const cf=I(0,2.0,7.4);TH.ell(c,cf[0],cf[1],u*0.95,u*0.95,'#2a2a30');TH.ell(c,cf[0],cf[1],u*0.82,u*0.82,'#fbf6e8');for(let k=0;k<12;k++){const a=k/12*6.283;TH.ln(c,[cf[0]+Math.cos(a)*u*0.64,cf[1]+Math.sin(a)*u*0.64],[cf[0]+Math.cos(a)*u*0.76,cf[1]+Math.sin(a)*u*0.76],'#2a2a30',u*0.06);}TH.ln(c,[cf[0],cf[1]],[cf[0]+u*0.1,cf[1]-u*0.6],'#2a2a30',u*0.09);TH.ln(c,[cf[0],cf[1]],[cf[0]+u*0.5,cf[1]+u*0.2],'#2a2a30',u*0.09);
    [[-0.5,5.1],[0.5,5.1]].forEach(([X,Z])=>WF(c,I,2.0,X,Z,0.55,1.3,'#27394d',AMTRIM));WR(c,I,1.25,1.0,5.0,0.7,1.4,'#27394d',AMTRIM);
    BF(c,I,-0.9,0.9,2.02,8.0,8.55,'#2a2a30');
    TH.box(c,x,y,u,-1.5,1.5,-0.2,2.25,8.9,9.25,AMTRIM,shade(AMTRIM,-0.18),'#ffffff');
    const bp=I(0,1.0,9.25),pt=I(0,1.0,12.6);BP(c,[I(-1.45,2.2,9.25),I(1.45,2.2,9.25),I(1.45,-0.15,9.25),pt],'#6a8a78');BP(c,[I(-1.45,2.2,9.25),I(1.45,2.2,9.25),pt],'#7fa08c');BP(c,[I(1.45,2.2,9.25),I(1.45,-0.15,9.25),pt],'#4a6a58');
    TH.ln(c,pt,[pt[0],pt[1]-u*1.6],'#e8c46a',u*0.12);BP(c,[[pt[0],pt[1]-u*1.6],[pt[0]+u*1.6,pt[1]-u*1.25],[pt[0],pt[1]-u*0.9]],'#c43a30');
    /* bunting along the cornice */
    const a=I(-3.6,2.2,3.5),b=I(3.6,2.2,3.5);for(let k=0;k<12;k++){const t=(k+0.5)/12,px=a[0]+(b[0]-a[0])*t,py=a[1]+(b[1]-a[1])*t+Math.sin(t*Math.PI)*u*0.25;BP(c,[[px-u*0.22,py],[px+u*0.22,py],[px,py+u*0.5]],['#c43a30','#fbf6e8','#2f5a9a'][k%3]);}
    HIP(c,I,-3.7,3.7,-2.0,2.0,4.0,0.5,0.3,'#8a8c92','#6a6c72',u,0);}},
  gazebo:{cat:'ruin',rho:0.1,draw(c,x,y,u,v){const col=['#c43a30','#2f6a8a','#2f7a4a'][v%3];ASH(c,x,y,u*3.8);const rx=3.0*u,ry=1.5*u;RC(c,x,y,rx,ry,0.6*u,['#ffffff','#e8e4d8','#a8a494']);TH.ell(c,x,y-0.6*u,rx,ry,'#f2ede0');TH.ell(c,x,y-0.6*u,rx*0.86,ry*0.86,'#d8d0b8');
    const posts=[];for(let k=0;k<8;k++){const a=Math.PI*2*k/8+0.2;posts.push([x+Math.cos(a)*rx*0.84,y-0.6*u+Math.sin(a)*ry*0.84,Math.sin(a)]);}
    posts.filter(p=>p[2]<0).forEach(p=>TH.ln(c,[p[0],p[1]],[p[0],p[1]-3.3*u],'#fbf6e8',u*0.34));
    c.strokeStyle='#fbf6e8';c.lineWidth=u*0.12;c.beginPath();c.ellipse(x,y-1.7*u,rx*0.84,ry*0.84,0,Math.PI,Math.PI*2);c.stroke();
    posts.filter(p=>p[2]>=0).forEach(p=>TH.ln(c,[p[0],p[1]],[p[0],p[1]-3.3*u],'#fbf6e8',u*0.34));
    c.strokeStyle='#fbf6e8';c.lineWidth=u*0.12;c.beginPath();c.ellipse(x,y-1.7*u,rx*0.84,ry*0.84,0,0,Math.PI);c.stroke();for(let k=0;k<20;k++){const a=Math.PI*k/19,px=x+Math.cos(a)*rx*0.84,py=y-0.6*u+Math.sin(a)*ry*0.84;TH.ln(c,[px,py],[px,py-1.1*u],'#fbf6e8',u*0.06);}
    TH.ell(c,x,y-3.9*u,rx*1.1,ry*1.1,'#fbf6e8');ACONE(c,x,y-3.9*u,rx*1.14,ry*1.14,u*2.8,col,u,12);TH.ln(c,[x,y-6.7*u],[x,y-7.8*u],'#4a3a2a',u*0.12);TH.ell(c,x,y-7.9*u,u*0.24,u*0.24,'#e8c46a');
    for(let k=0;k<14;k++){const a=Math.PI*(k+0.5)/14;TH.ell(c,x+Math.cos(a)*rx*1.08,y-3.9*u+Math.sin(a)*ry*1.08+u*0.4,u*0.12,u*0.12,k%2?'#fff2a8':'#fbf6e8');}}},
  flagPole:{cat:'ruin',rho:0.05,draw(c,x,y,u,v){ASH(c,x,y,u*2.6);RC(c,x,y,1.7*u,0.85*u,0.7*u,['#d8d0bc','#b4ab98','#85816f']);TH.ell(c,x,y-0.7*u,1.7*u,0.85*u,'#d0c8b0');TH.ell(c,x,y-0.7*u,1.4*u,0.7*u,'#6aa84a');for(let k=0;k<16;k++){const a=k/16*6.283;TH.ell(c,x+Math.cos(a)*u*1.0,y-0.75*u+Math.sin(a)*u*0.5,u*0.18,u*0.14,['#e0303a','#fbf6e8','#f2b630'][k%3]);}
    TH.ln(c,[x,y-0.7*u],[x,y-13.0*u],'#f2eee2',u*0.28);TH.ln(c,[x+u*0.08,y-0.7*u],[x+u*0.08,y-13.0*u],'rgba(150,150,140,.5)',u*0.08);TH.ell(c,x,y-13.2*u,u*0.3,u*0.3,'#e8c46a');
    const fx=x+u*0.1,fy=y-12.7*u,W=u*5.0,H=u*3.1;for(let k=0;k<13;k++){const y0=fy+H*k/13,y1=fy+H*(k+1)/13;c.fillStyle=k%2?'#fbf6e8':'#c43a30';c.beginPath();c.moveTo(fx,y0);for(let s=0;s<=10;s++){const t=s/10;c.lineTo(fx+W*t,y0+Math.sin(t*6+k*0.2)*u*0.22*t);}for(let s=10;s>=0;s--){const t=s/10;c.lineTo(fx+W*t,y1+Math.sin(t*6+(k+1)*0.2)*u*0.22*t);}c.closePath();c.fill();}
    c.fillStyle='#2f4a8a';c.beginPath();c.moveTo(fx,fy);c.lineTo(fx+W*0.42,fy+Math.sin(2.5)*u*0.09);c.lineTo(fx+W*0.42,fy+H*0.54+Math.sin(2.5)*u*0.1);c.lineTo(fx,fy+H*0.54);c.closePath();c.fill();for(let r=0;r<3;r++)for(let k=0;k<4;k++)TH.ell(c,fx+W*0.07+k*W*0.09,fy+H*0.13+r*H*0.15,u*0.07,u*0.07,'#fbf6e8');}},
  popcornCart:{cat:'ruin',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);ASH(c,x,y,u*2.6);
    TH.box(c,x,y,u,-1.1,1.1,-0.7,0.7,0.5,1.5,'#c43a30','#8a2a20','#e0503e');for(let k=0;k<5;k++)BF(c,I,-1.1+k*0.44,-1.1+k*0.44+0.22,0.7,0.5,1.5,'#fbf6e8');
    TH.box(c,x,y,u,-1.0,1.0,-0.6,0.6,1.5,2.7,'rgba(200,230,240,.0)','rgba(160,200,215,.55)','rgba(255,255,255,.3)');BP(c,[I(-1.0,0.6,1.5),I(1.0,0.6,1.5),I(1.0,0.6,2.7),I(-1.0,0.6,2.7)],'rgba(190,225,238,.6)',AMTRIM,u*0.07);
    for(let k=0;k<14;k++){const p=I(-0.7+Math.random()*0,0,0);const px=x+(k%5-2)*u*0.34+(k%3)*u*0.05,py=y-u*(1.65+Math.floor(k/5)*0.35)+u*0.25;TH.ell(c,px,py,u*0.2,u*0.16,k%2?'#fff4c8':'#f6e6a8');}
    [-0.8,0.8].forEach(X=>{const p=I(X,0.8,0.5);TH.ell(c,p[0],p[1],u*0.5,u*0.5,'#2a2a30');TH.ell(c,p[0],p[1],u*0.2,u*0.2,'#c8c8d0');});
    TH.ln(c,I(0,0,2.7),I(0,0,5.0),'#4a3a2a',u*0.1);ACONE(c,I(0,0,5.0)[0],I(0,0,5.0)[1],u*2.5,u*1.1,u*1.4,'#e0a030',u,9);
    [[-0.6,-1.2,'#e0303a'],[0.1,-1.5,'#2f6aa8'],[0.7,-1.1,'#f2d030']].forEach(([X,Y,col],i)=>{const a=I(1.0,0.2,2.7),px=a[0]+(i-1)*u*0.7,py=a[1]-u*(2.0+i*0.4);TH.ln(c,a,[px,py],'rgba(60,60,60,.6)',u*0.04);TH.ell(c,px,py-u*0.3,u*0.38,u*0.46,col);TH.ell(c,px-u*0.1,py-u*0.45,u*0.1,u*0.12,'rgba(255,255,255,.7)');});}},
  gasLamp:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.24,'rgba(50,56,40,.24)');TH.ell(c,x,y,u*0.5,u*0.22,'#2a3a30');TH.poly(c,[[x-u*0.38,y],[x+u*0.38,y],[x+u*0.2,y-u*1.0],[x-u*0.2,y-u*1.0]],'#2f4a3a');TH.ln(c,[x,y-u*0.9],[x,y-u*3.6],'#2f4a3a',u*0.26);TH.ell(c,x,y-u*1.8,u*0.28,u*0.16,'#e8c46a');
    TH.ln(c,[x-u*0.9,y-u*3.2],[x+u*0.9,y-u*3.2],'#2f4a3a',u*0.12);c.strokeStyle='#2f4a3a';c.lineWidth=u*0.1;c.beginPath();c.arc(x-u*0.45,y-u*3.0,u*0.35,0,Math.PI);c.stroke();c.beginPath();c.arc(x+u*0.45,y-u*3.0,u*0.35,0,Math.PI);c.stroke();
    GLOW(c,x,y-u*4.4,u*2.4,'255,214,130',0.42);TH.poly(c,[[x-u*0.34,y-u*3.6],[x+u*0.34,y-u*3.6],[x+u*0.42,y-u*4.7],[x-u*0.42,y-u*4.7]],'#fff0b8','#2f4a3a',u*0.07);TH.ell(c,x,y-u*4.1,u*0.14,u*0.2,'#ffd460');TH.poly(c,[[x-u*0.5,y-u*4.7],[x+u*0.5,y-u*4.7],[x,y-u*5.3]],'#2f4a3a');TH.ell(c,x,y-u*5.4,u*0.12,u*0.12,'#e8c46a');}},
  streetTree:{cat:'tree',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*7+1),pal=[['#8fcf6a','#5faa44','#3f8a34'],['#a6d86e','#78bc4a','#4a9a38'],['#f6b8cf','#e48aaa','#c06888']][v%3],s=0.92+(v%4)*0.06;ASH(c,x,y,u*2.0);
    TH.box(c,x,y,u,-1.0,1.0,-1.0,1.0,0,0.5,'#4a4a52','#34343c','#5a5a64');for(let k=0;k<4;k++){TH.ln(c,TH.iso(x,y,u,-0.8+k*0.5,-0.8,0.5),TH.iso(x,y,u,-0.8+k*0.5,0.8,0.5),'#2a2a30',u*0.06);}TH.ell(c,x,y-u*0.5,u*0.5,u*0.25,'#3a2a1a');
    TH.ln(c,[x,y-u*0.5],[x,y-u*3.3*s],'#6a4a2c',u*0.4);TH.ln(c,[x,y-u*2.2*s],[x-u*0.9,y-u*3.2*s],'#6a4a2c',u*0.22);TH.ln(c,[x,y-u*2.4*s],[x+u*0.9,y-u*3.3*s],'#6a4a2c',u*0.22);
    [[0,-4.8,2.0,1.6],[-1.3,-3.9,1.5,1.2],[1.3,-4.0,1.5,1.2],[0,-3.7,1.7,1.0]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u*s,y+dy*u*s,u*rx*s,u*ry*s,pal[i%3],r,9));}},
  flowerPlanter:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+2),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),col=['#fbf6e8','#2f6a8a','#2f7a4a'][v%3];TH.ell(c,x+u*0.4,y+u*0.1,u*2.2,u*0.4,'rgba(50,56,40,.22)');TH.box(c,x,y,u,-1.6,1.6,-0.6,0.6,0,1.0,col,shade(col,-0.25),shade(col,0.1));
    TH.box(c,x,y,u,-1.5,1.5,-0.5,0.5,1.0,1.4,'#5a4a3a','#4a3a2a','#6a5a4a');for(let k=0;k<20;k++){const X=-1.4+r()*2.8,Y=-0.4+r()*0.8,p=I(X,Y,1.4);TH.ln(c,p,[p[0],p[1]-u*0.3],'#4a9a30',u*0.06);TH.ell(c,p[0],p[1]-u*0.4,u*0.2,u*0.16,['#e0303a','#fbf6e8','#e84a8a','#f2b630','#9a4ae0'][k%5]);}}},
  bench:{cat:'prop',rho:0.05,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*2.0,u*0.4,'rgba(50,56,40,.22)');[-1.5,1.5].forEach(X=>{TH.ln(c,I(X,-0.5,0),I(X,-0.5,1.4),'#2a2a30',u*0.14);TH.ln(c,I(X,0.5,0),I(X,0.5,0.8),'#2a2a30',u*0.14);TH.ln(c,I(X,-0.5,0.8),I(X,0.5,0.8),'#2a2a30',u*0.12);});
    for(let k=0;k<3;k++){const Y=-0.4+k*0.4;TH.ln(c,I(-1.7,Y,0.85),I(1.7,Y,0.85),'#2f6a4a',u*0.3);}for(let k=0;k<3;k++){const Z=1.0+k*0.32;TH.ln(c,I(-1.7,-0.52,Z),I(1.7,-0.52,Z),'#2f6a4a',u*0.28);}}},
  bunting:{cat:'prop',rho:0.04,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.3,y+u*0.1,u*2.4,u*0.36,'rgba(50,56,40,.2)');[-2.0,2.0].forEach(X=>{TH.ln(c,I(X,0,0),I(X,0,4.0),'#f2eee2',u*0.2);TH.ell(c,I(X,0,4.1)[0],I(X,0,4.1)[1],u*0.18,u*0.18,'#e8c46a');});
    const a=I(-2.0,0,3.9),b=I(2.0,0,3.9);for(let k=0;k<12;k++){const t=(k+0.5)/12,px=a[0]+(b[0]-a[0])*t,py=a[1]+(b[1]-a[1])*t+Math.sin(t*Math.PI)*u*0.9;BP(c,[[px-u*0.24,py],[px+u*0.24,py],[px,py+u*0.6]],['#c43a30','#fbf6e8','#2f5a9a'][k%3]);}c.strokeStyle='rgba(60,50,40,.7)';c.lineWidth=u*0.05;c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo((a[0]+b[0])/2,(a[1]+b[1])/2+u*1.8,b[0],b[1]);c.stroke();}},
  hydrant:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.2,y+u*0.06,u*0.7,u*0.2,'rgba(50,56,40,.22)');TH.ell(c,x,y,u*0.42,u*0.2,'#a8321f');TH.poly(c,[[x-u*0.38,y],[x+u*0.38,y],[x+u*0.3,y-u*1.4],[x-u*0.3,y-u*1.4]],'#c43a30');TH.ell(c,x,y-u*1.4,u*0.34,u*0.17,'#d8503e');TH.ell(c,x,y-u*1.6,u*0.22,u*0.2,'#c43a30');TH.ln(c,[x-u*0.6,y-u*0.9],[x+u*0.6,y-u*0.9],'#a8321f',u*0.3);TH.ell(c,x-u*0.62,y-u*0.9,u*0.16,u*0.16,'#e8c46a');TH.ell(c,x+u*0.62,y-u*0.9,u*0.16,u*0.16,'#e8c46a');}},

  diner:{cat:'struct',rho:0.13,draw(c,x,y,u,v){MIR(c,x,v&8,()=>{const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),acc=['#c43a30','#2fa8b8','#e0a030'][v%3];ASH(c,x,y,u*5.4);SLAB(c,x,y,u,-3.1,3.1,-1.9,2.8);
    BF(c,I,-2.8,2.8,1.5,0.14,2.5,'#f4ecd8');BR(c,I,2.8,-1.5,1.5,0.14,2.5,'#cfc6ae');
    for(let k=0;k<14;k++){const X0=-2.8+k*0.4;BP(c,[I(X0,1.5,0.14),I(X0+0.4,1.5,0.14),I(X0+0.4,1.5,0.5),I(X0,1.5,0.5)],k%2?'#2a2a30':'#f6f2e6');}
    BF(c,I,-2.8,2.8,1.5,2.0,2.4,acc);BR(c,I,2.8,-1.5,1.5,2.0,2.4,shade(acc,-0.25));
    BP(c,[I(-2.6,1.5,0.7),I(2.6,1.5,0.7),I(2.6,1.5,1.85),I(-2.6,1.5,1.85)],'#a6d6e8');BP(c,[I(-2.6,1.5,0.7),I(-1.2,1.5,0.7),I(-0.4,1.5,1.85),I(-1.8,1.5,1.85)],'rgba(255,255,255,.28)');
    for(let k=0;k<=6;k++){const X=-2.6+k*5.2/6;TH.ln(c,I(X,1.5,0.7),I(X,1.5,1.85),'#e2eaee',u*0.1);}TH.ln(c,I(-2.6,1.5,0.7),I(2.6,1.5,0.7),'#e2eaee',u*0.12);TH.ln(c,I(-2.6,1.5,1.85),I(2.6,1.5,1.85),'#e2eaee',u*0.12);
    [-1.9,-0.8,0.4,1.5].forEach(X=>{const p=I(X,1.35,1.0);TH.ell(c,p[0],p[1],u*0.22,u*0.1,'#c43a30');TH.ln(c,p,[p[0],p[1]+u*0.45],'#8a8a92',u*0.07);});
    [-0.5,0.7].forEach(Y=>WR(c,I,2.8,Y,1.3,0.9,1.1,'#a6d6e8','#e2eaee'));
    /* streamline barrel roof (curved along Y, extruded along X) */
    const zr=Y=>2.4+0.95*(1-(Y/1.6)*(Y/1.6)),N=8;for(let j=0;j<N;j++){const Y0=1.6-3.2*j/N,Y1=1.6-3.2*(j+1)/N,t=j/N;BP(c,[I(-2.9,Y0,zr(Y0)),I(2.9,Y0,zr(Y0)),I(2.9,Y1,zr(Y1)),I(-2.9,Y1,zr(Y1))],`rgb(${Math.round(226-t*50)},${Math.round(232-t*44)},${Math.round(238-t*36)})`);}
    const arc=[];for(let k=0;k<=12;k++){const Y=-1.6+3.2*k/12;arc.push(I(2.9,Y,zr(Y)));}BP(c,[I(2.9,-1.6,2.4),I(2.9,1.6,2.4)].concat(arc.slice().reverse()),'#aab6be');
    TH.ln(c,I(-2.9,1.6,2.4),I(2.9,1.6,2.4),'#f4f8fa',u*0.14);for(let k=0;k<5;k++){const Y=1.2-k*0.6;TH.ln(c,I(-2.9,Y,zr(Y)),I(2.9,Y,zr(Y)),'rgba(255,255,255,.5)',u*0.05);}
    /* neon pole sign */
    const sp=I(-3.3,2.5,0);TH.ln(c,sp,[sp[0],sp[1]-u*5.6],'#8a8a92',u*0.2);const sx=sp[0],sy=sp[1]-u*7.6;GLOW(c,sx,sy+u*1.2,u*3.4,acc==='#c43a30'?'255,70,60':'60,200,220',0.38);TH.poly(c,[[sx-u*1.0,sy],[sx+u*1.0,sy],[sx+u*1.0,sy+u*2.8],[sx-u*1.0,sy+u*2.8]],'#1a2030',acc,u*0.1);[0.35,1.0,1.65,2.3].forEach((f,i)=>{c.fillStyle=i%2?'#fff2c0':acc;c.fillRect(sx-u*0.62,sy+u*f,u*1.24,u*0.32);});}) }},
  generalStore:{cat:'struct',rho:0.13,draw(c,x,y,u,v){MIR(c,x,v&8,()=>{const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),w=['#f1ead8','#b8483a','#8fa6b8','#e8d49a','#c9d6c0','#d8b9a8','#6f8f7a','#efe2c6'][v&7],wr=shade(w,-0.22),tr='#fbf6e8';ASH(c,x,y,u*5.2);SLAB(c,x,y,u,-2.8,2.8,-2.0,3.4);
    BF(c,I,-2.4,2.4,1.8,0.14,3.4,w);BR(c,I,2.4,-1.8,1.8,0.14,3.4,wr);BFL(c,I,-2.4,2.4,1.8,0.14,3.4,0.3,'rgba(0,0,0,.1)',u);BRL(c,I,2.4,-1.8,1.8,0.14,3.4,0.3,'rgba(0,0,0,.14)',u);
    /* false front with a stepped cornice */
    const P=[[-2.55,3.4],[-2.55,4.2],[-1.5,4.2],[-1.5,4.8],[1.5,4.8],[1.5,4.2],[2.55,4.2],[2.55,3.4]];BP(c,P.map(q=>I(q[0],1.84,q[1])),w);for(let z=3.7;z<4.7;z+=0.3)TH.ln(c,I(-2.5,1.84,z),I(2.5,1.84,z),'rgba(0,0,0,.1)',u*0.05);
    TH.ln(c,I(-2.55,1.86,4.2),I(-1.5,1.86,4.2),tr,u*0.16);TH.ln(c,I(1.5,1.86,4.2),I(2.55,1.86,4.2),tr,u*0.16);TH.ln(c,I(-1.5,1.86,4.8),I(1.5,1.86,4.8),tr,u*0.18);BP(c,[I(2.55,1.84,3.4),I(2.55,1.84,4.2),I(2.7,1.5,4.2),I(2.7,1.5,3.4)],wr);
    BP(c,[I(-1.2,1.86,3.65),I(1.2,1.86,3.65),I(1.2,1.86,4.55),I(-1.2,1.86,4.55)],'#3a2a1a',tr,u*0.08);[-0.8,0,0.8].forEach(X=>BP(c,[I(X-0.22,1.86,3.9),I(X+0.22,1.86,3.9),I(X+0.22,1.86,4.3),I(X-0.22,1.86,4.3)],'#f4e0a8'));
    [-1.6,1.6].forEach(X=>{WF(c,I,1.8,X,1.55,1.3,1.4,'#a9d6e6',tr);TH.ln(c,I(X,1.8,0.85),I(X,1.8,2.25),tr,u*0.06);});WF(c,I,1.8,0,1.2,1.1,2.1,tr);WF(c,I,1.8,0,1.15,0.84,1.9,'#8fc4d8');
    [-0.5,0.7].forEach(Y=>WR(c,I,2.4,Y,2.0,0.9,1.3,'#27394d',tr));
    /* plank porch roof + posts */
    const A=I(-2.7,1.8,2.9),B=I(2.7,1.8,2.9),B2=I(2.7,3.2,2.3),A2=I(-2.7,3.2,2.3);BP(c,[A,B,B2,A2],'#8a6a44');for(let k=1;k<6;k++){const t=k/6;TH.ln(c,[A[0]+(A2[0]-A[0])*t,A[1]+(A2[1]-A[1])*t],[B[0]+(B2[0]-B[0])*t,B[1]+(B2[1]-B[1])*t],'rgba(40,24,10,.3)',u*0.07);}TH.ln(c,A2,B2,'#5a3e28',u*0.14);
    [-2.5,0,2.5].forEach(X=>TH.ln(c,I(X,3.1,0.14),I(X,3.1,2.3),'#6a4a2c',u*0.24));
    ABAR(c,I(-2.1,2.5,0.14)[0],I(-2.1,2.5,0.14)[1],u*0.5,u*1.2);TH.box(c,x,y,u,1.5,2.3,2.1,2.8,0.14,0.8,'#b0884e','#7a5a30','#c9a066');TH.box(c,x,y,u,1.7,2.3,2.2,2.8,0.8,1.4,'#c19a5c','#8a6a3a','#d8b070');}) }},
  theater:{cat:'struct',rho:0.14,draw(c,x,y,u,v){MIR(c,x,v&8,()=>{const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),w=['#b8584a','#c8b89a','#8f9fb0','#d8c2a0','#a86a52','#7f9f8f','#e0d2b0','#b07a8a'][v&7],wr=shade(w,-0.22),tr='#fbf6e8';ASH(c,x,y,u*5.2);SLAB(c,x,y,u,-3.2,2.9,-2.0,3.5);
    BF(c,I,-2.6,2.6,1.8,0.14,5.0,w);BR(c,I,2.6,-1.8,1.8,0.14,5.0,wr);BFL(c,I,-2.6,2.6,1.8,0.14,5.0,0.3,'rgba(0,0,0,.09)',u);BRL(c,I,2.6,-1.8,1.8,0.14,5.0,0.3,'rgba(0,0,0,.13)',u);
    [-2.5,-0.9,0.9,2.5].forEach(X=>BP(c,[I(X-0.16,1.84,0.14),I(X+0.16,1.84,0.14),I(X+0.16,1.84,5.2),I(X-0.16,1.84,5.2)],tr));
    [-1.7,0,1.7].forEach(X=>WF(c,I,1.8,X,4.2,0.9,0.9,'#27394d',tr));[-0.5,0.7].forEach(Y=>{WR(c,I,2.6,Y,4.2,0.9,0.9,'#27394d',tr);WR(c,I,2.6,Y,1.6,0.9,1.2,'#27394d',tr);});
    [-1.7,1.7].forEach(X=>{BP(c,[I(X-0.5,1.8,0.9),I(X+0.5,1.8,0.9),I(X+0.5,1.8,2.1),I(X-0.5,1.8,2.1)],['#3a6aa8','#a83a4a'][X<0?0:1],tr,u*0.06);TH.ell(c,I(X,1.8,1.55)[0],I(X,1.8,1.55)[1],u*0.18,u*0.22,'rgba(255,240,200,.85)');});
    WF(c,I,1.8,0,1.2,1.5,2.2,'#2a1a1a',tr);WF(c,I,1.8,0,1.2,1.2,2.0,'#7a4a3a');
    /* top deco panel with a sunburst */
    BP(c,[I(-1.5,1.84,5.0),I(1.5,1.84,5.0),I(1.5,1.84,5.9),I(-1.5,1.84,5.9)],shade(w,-0.05));BP(c,[I(-1.3,1.86,5.1),I(1.3,1.86,5.1),I(1.3,1.86,5.8),I(-1.3,1.86,5.8)],'#e8c46a');for(let k=0;k<7;k++){const a=-1.3+k*0.43;TH.ln(c,I(0,1.88,5.1),I(a,1.88,5.8),'rgba(120,70,20,.55)',u*0.06);}TH.box(c,x,y,u,-2.8,2.8,-2.0,2.0,5.0,5.25,tr,shade(tr,-0.18),'#ffffff');
    /* marquee with bulbs */
    TH.box(c,x,y,u,-2.2,2.2,1.8,3.4,2.7,3.2,'#c43a30','#8a2a20','#e05a48');BP(c,[I(-2.2,3.4,2.7),I(2.2,3.4,2.7),I(2.2,3.4,3.2),I(-2.2,3.4,3.2)],'#a8321f');for(let k=0;k<=11;k++){const p=I(-2.1+k*0.38,3.42,2.95);GLOW(c,p[0],p[1],u*0.55,'255,230,140',0.5);TH.ell(c,p[0],p[1],u*0.12,u*0.12,'#fff2a8');}
    BP(c,[I(-1.6,3.4,3.2),I(1.6,3.4,3.2),I(0,3.4,4.2)],'#f4e0a8',tr,u*0.06);
    /* vertical blade sign */
    TH.box(c,x,y,u,-3.1,-2.7,1.6,2.3,3.4,7.8,'#c43a30','#8a2a20','#e05a48');for(let k=0;k<5;k++){const z=3.8+k*0.85;BP(c,[I(-3.1,2.3,z),I(-2.7,2.3,z),I(-2.7,2.3,z+0.45),I(-3.1,2.3,z+0.45)],k%2?'#fff2a8':'#fbf6e8');}GLOW(c,I(-2.9,2.3,5.6)[0],I(-2.9,2.3,5.6)[1],u*3.0,'255,90,70',0.16);}) }},
  fireStation:{cat:'struct',rho:0.14,draw(c,x,y,u,v){MIR(c,x,v&8,()=>{const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),w=['#b8483a','#a8502e','#9a4a3a','#b05848'][v&3],wr=shade(w,-0.22),tr='#fbf6e8';ASH(c,x,y,u*5.4);SLAB(c,x,y,u,-3.0,3.0,-2.0,3.0);
    BF(c,I,-2.7,2.7,1.8,0.14,4.0,w);BR(c,I,2.7,-1.8,1.8,0.14,4.0,wr);BFL(c,I,-2.7,2.7,1.8,0.14,4.0,0.26,'rgba(0,0,0,.12)',u);BRL(c,I,2.7,-1.8,1.8,0.14,4.0,0.26,'rgba(0,0,0,.16)',u);
    /* hose tower with belfry */
    TH.box(c,x,y,u,1.5,2.9,-1.2,0.4,0.14,7.4,w,wr,shade(w,0.1));for(let z=0.4;z<7.2;z+=0.26)TH.ln(c,I(1.5,0.4,z),I(2.9,0.4,z),'rgba(0,0,0,.12)',u*0.05);
    TH.box(c,x,y,u,1.4,3.0,-1.3,0.5,7.3,7.6,tr,shade(tr,-0.18),'#ffffff');[1.9,2.5].forEach(X=>{BP(c,[I(X-0.2,0.5,5.2),I(X+0.2,0.5,5.2),I(X+0.2,0.5,6.4),I(X-0.2,0.5,6.4)],'#27394d');});
    [[1.55,-1.15],[2.85,-1.15],[1.55,0.35],[2.85,0.35]].forEach(([X,Y])=>TH.ln(c,I(X,Y,7.6),I(X,Y,9.0),tr,u*0.2));const bp=I(2.2,-0.4,8.4);TH.ell(c,bp[0],bp[1],u*0.4,u*0.45,'#e8c46a');TH.ln(c,[bp[0],bp[1]-u*0.5],[bp[0],bp[1]-u*0.9],'#4a3a2a',u*0.08);
    BP(c,[I(1.3,0.6,9.0),I(3.1,0.6,9.0),I(2.2,-0.4,10.6)],'#6a7a8a');BP(c,[I(3.1,0.6,9.0),I(3.1,-1.4,9.0),I(2.2,-0.4,10.6)],'#4a5a6a');TH.ln(c,I(2.2,-0.4,10.6),I(2.2,-0.4,11.6),'#4a3a2a',u*0.08);BP(c,[I(2.2,-0.4,11.6),[I(2.2,-0.4,11.6)[0]+u*1.4,I(2.2,-0.4,11.6)[1]+u*0.3],[I(2.2,-0.4,11.3)[0],I(2.2,-0.4,11.3)[1]+u*0.4]],'#c43a30');
    /* two arched engine bays */
    [-1.4,0.1].forEach(X=>{const pts=[I(X-0.6,1.8,0.14),I(X+0.6,1.8,0.14)];const top=[];for(let k=0;k<=8;k++){const a=Math.PI*k/8,xx=X+0.6*Math.cos(a),zz=2.1+0.7*Math.sin(a);top.push(I(xx,1.8,zz));}BP(c,[I(X-0.6,1.8,0.14),I(X+0.6,1.8,0.14)].concat(top),tr);const inner=[];for(let k=0;k<=8;k++){const a=Math.PI*k/8,xx=X+0.5*Math.cos(a),zz=2.05+0.6*Math.sin(a);inner.push(I(xx,1.82,zz));}BP(c,[I(X-0.5,1.82,0.14),I(X+0.5,1.82,0.14)].concat(inner),'#d63a2a');for(let z=0.5;z<2.5;z+=0.45)TH.ln(c,I(X-0.5,1.84,z),I(X+0.5,1.84,z),'rgba(120,20,10,.4)',u*0.05);for(let k=0;k<4;k++)BP(c,[I(X-0.42+k*0.22,1.84,2.0),I(X-0.26+k*0.22,1.84,2.0),I(X-0.26+k*0.22,1.84,2.35),I(X-0.42+k*0.22,1.84,2.35)],'#bfe0ee');});
    BP(c,[I(-2.4,1.84,3.15),I(0.9,1.84,3.15),I(0.9,1.84,3.6),I(-2.4,1.84,3.6)],tr);for(let k=0;k<6;k++)BP(c,[I(-2.2+k*0.5,1.86,3.25),I(-1.9+k*0.5,1.86,3.25),I(-1.9+k*0.5,1.86,3.5),I(-2.2+k*0.5,1.86,3.5)],'#a8321f');
    WR(c,I,2.7,0.9,2.2,0.8,1.0,'#27394d',tr);TH.box(c,x,y,u,-2.9,1.3,-2.0,2.0,4.0,4.3,tr,shade(tr,-0.18),'#ffffff');}) }},
  mailbox:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.2,y+u*0.06,u*0.7,u*0.2,'rgba(50,56,40,.22)');TH.ln(c,[x,y],[x,y-u*1.6],'#6a4a2c',u*0.3);const by=y-u*1.6,col=['#2f5a9a','#c43a30','#2f7a4a'][v%3];c.fillStyle=col;c.beginPath();c.moveTo(x-u*0.65,by);c.lineTo(x-u*0.65,by-u*0.6);c.quadraticCurveTo(x,by-u*1.4,x+u*0.65,by-u*0.6);c.lineTo(x+u*0.65,by);c.closePath();c.fill();c.fillStyle='rgba(255,255,255,.2)';c.fillRect(x-u*0.6,by-u*0.9,u*0.4,u*0.2);TH.poly(c,[[x+u*0.65,by-u*0.55],[x+u*0.95,by-u*0.55],[x+u*0.95,by-u*1.1],[x+u*0.75,by-u*1.1]],'#e0303a');}},
  newsBox:{cat:'prop',rho:0.03,draw(c,x,y,u,v){const col=['#c43a30','#2f5a9a','#2f7a4a'][v%3];TH.ell(c,x+u*0.2,y+u*0.06,u*0.8,u*0.22,'rgba(50,56,40,.22)');TH.ln(c,[x-u*0.4,y],[x-u*0.4,y-u*0.8],'#4a4a52',u*0.16);TH.ln(c,[x+u*0.4,y],[x+u*0.4,y-u*0.8],'#4a4a52',u*0.16);TH.poly(c,[[x-u*0.65,y-u*0.8],[x+u*0.65,y-u*0.8],[x+u*0.65,y-u*2.3],[x-u*0.65,y-u*2.3]],col);TH.poly(c,[[x-u*0.5,y-u*1.2],[x+u*0.5,y-u*1.2],[x+u*0.5,y-u*2.0],[x-u*0.5,y-u*2.0]],'#d8e8f0','#2a2a30',u*0.06);TH.ln(c,[x-u*0.4,y-u*1.6],[x+u*0.4,y-u*1.6],'rgba(0,0,0,.4)',u*0.05);TH.ell(c,x,y-u*2.35,u*0.65,u*0.14,shade(col,-0.25));}},
  trashCan:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.2,y+u*0.06,u*0.8,u*0.22,'rgba(50,56,40,.22)');ABAR2(c,x,y,u*0.62,u*1.6,'#2f5a40');TH.ell(c,x,y-u*1.6,u*0.66,u*0.3,'#3a6a4a');TH.ell(c,x,y-u*1.7,u*0.3,u*0.14,'#2a4a38');}},
  picnicTable:{cat:'prop',rho:0.05,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*2.2,u*0.45,'rgba(50,56,40,.22)');[-1.1,1.1].forEach(X=>{TH.ln(c,I(X,-0.5,0),I(X,0,1.2),'#6a4a2c',u*0.16);TH.ln(c,I(X,0.5,0),I(X,0,1.2),'#6a4a2c',u*0.16);});
    TH.box(c,x,y,u,-1.5,1.5,-1.25,-0.8,0.65,0.8,'#a8683a','#7a4a28','#c28050');TH.box(c,x,y,u,-1.5,1.5,0.8,1.25,0.65,0.8,'#a8683a','#7a4a28','#c28050');TH.box(c,x,y,u,-1.5,1.5,-0.6,0.6,1.2,1.35,'#c9a066','#9a7a44','#e0b878');for(let k=0;k<6;k++){BP(c,[I(-1.5+k*0.5,-0.6,1.36),I(-1.0+k*0.5,-0.6,1.36),I(-1.0+k*0.5,0.6,1.36),I(-1.5+k*0.5,0.6,1.36)],k%2?'rgba(255,255,255,.0)':'rgba(196,58,48,.55)');}}},
  picketFence:{cat:'prop',rho:0.04,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*2.6,u*0.4,'rgba(50,56,40,.2)');[0.5,1.1].forEach(Z=>TH.ln(c,I(-2.0,0,Z),I(2.0,0,Z),'#ece8dc',u*0.16));for(let k=0;k<10;k++){const X=-1.9+k*0.42,a=I(X,0,0),b=I(X,0,1.5);TH.poly(c,[[a[0]-u*0.17,a[1]],[a[0]+u*0.17,a[1]],[b[0]+u*0.17,b[1]],[b[0],b[1]-u*0.28],[b[0]-u*0.17,b[1]]],'#fbf8ee','#c8c4b4',u*0.04);}}},
  lemonadeStand:{cat:'ruin',rho:0.07,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);ASH(c,x,y,u*3.0);[[-1.4,-0.8],[1.4,-0.8],[-1.4,0.8],[1.4,0.8]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(X,Y,2.6),'#c9a066',u*0.2));
    TH.box(c,x,y,u,-1.4,1.4,-0.8,-0.6,0,2.0,'#c9a066','#9a7a44','#e0b878');TH.box(c,x,y,u,-1.5,1.5,0.3,0.8,0,1.1,'#f6e07a','#c8b040','#fff0a0');for(let k=0;k<6;k++)BF(c,I,-1.5+k*0.5,-1.0+k*0.5,0.8,0.0,1.1,k%2?'#ffffff':'#f2d030');
    const lp=I(0,0.9,1.9);TH.poly(c,[[lp[0]-u*0.9,lp[1]-u*0.5],[lp[0]+u*0.9,lp[1]-u*0.5],[lp[0]+u*0.9,lp[1]+u*0.5],[lp[0]-u*0.9,lp[1]+u*0.5]],'#fff8dc','#c9a066',u*0.08);TH.ell(c,lp[0],lp[1],u*0.4,u*0.28,'#f6d52a');
    const pp=I(0.9,0.5,1.1);TH.poly(c,[[pp[0]-u*0.2,pp[1]],[pp[0]+u*0.2,pp[1]],[pp[0]+u*0.26,pp[1]-u*0.8],[pp[0]-u*0.26,pp[1]-u*0.8]],'rgba(250,230,100,.85)','#8a8a92',u*0.05);
    for(let k=0;k<8;k++){const t0=k/8,t1=(k+1)/8,a=I(-1.7+3.4*t0,1.0,2.6),b=I(-1.7+3.4*t1,1.0,2.6),a2=I(-1.7+3.4*t0,-0.9,3.2),b2=I(-1.7+3.4*t1,-0.9,3.2);TH.poly(c,[a,b,b2,a2],k%2?'#ffffff':'#f2d030');}}},
  barrelPlanter:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+2);TH.ell(c,x+u*0.3,y+u*0.08,u*1.6,u*0.4,'rgba(50,56,40,.22)');ABAR2(c,x,y,u*1.0,u*1.2,'#8a5a33');TH.ell(c,x,y-u*1.2,u*1.0,u*0.5,'#5a4a3a');
    for(let k=0;k<5;k++)TH.blob(c,x+(k-2)*u*0.38,y-u*(1.55+(k%2)*0.2),u*0.5,u*0.4,['#4f9a40','#5fae4c','#3f8a36'][k%3],r,7);for(let k=0;k<16;k++){const fx=x+(r()-0.5)*u*1.9,fy=y-u*(1.5+r()*0.7);TH.ell(c,fx,fy,u*0.18,u*0.15,['#e0303a','#f2b630','#fbf6e8','#e84a8a','#9a4ae0','#f08a24'][k%6]);}}},
  topiaryPot:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+1);TH.ell(c,x+u*0.3,y+u*0.08,u*1.4,u*0.36,'rgba(50,56,40,.22)');
    const pot=['#c8683a','#f4f0e4','#3a6a8a'][v%3];TKCYL2(c,x,y,u*0.95,u*0.45,u*1.2,[shade(pot,0.18),pot,shade(pot,-0.3)]);TH.ell(c,x,y-u*1.2,u*0.95,u*0.45,shade(pot,0.1));TH.ell(c,x,y-u*1.2,u*0.7,u*0.32,'#4a3a2a');
    TH.ln(c,[x,y-u*1.2],[x,y-u*2.6],'#6a4a2c',u*0.2);
    if(v&1){[[1.0,2.6],[0.75,3.4],[0.5,4.1]].forEach(([rr,yy],i)=>RSPH(c,x,y-u*yy,u*rr,['#7fc24a','#5aa83a','#3f8a30']));}else RSPH(c,x,y-u*3.4,u*1.25,['#8fd05a','#5aa83a','#3f8a30']);}},
};

/* ===== MACRO-LAND ENGINE (hex geometry, path network, planner, baker) ===== */
const W3=Math.sqrt(3),HX=W3/2,HV=[[HX,0.29],[0,0.58],[-HX,0.29],[-HX,-0.29],[0,-0.58],[HX,-0.29]];
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[0,1,2],[-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5,1.5]],C:[[0],[-0.5,0.5,1.5],[-1,0,1],[-0.5]],D:[[0,1,2],[-0.5,0.5,1.5],[0,1]]};
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

/* ===== AMERICANA LAND: a classic American town green. Facade buildings (emporium, diner, general store, theater, fire station...) on the rim and in the voids facing the middle, a flag-pole plaza, then planters at every junction, edge and corner and plenty of street props. No street, no mirroring. ===== */
const AME_PLAN_CACHE={};
function getAmericanaPlan(shape){
  if(AME_PLAN_CACHE[shape])return AME_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(({A:15501,B:15602,C:15718,D:15819})[shape]),placed=[],bb=G.bbox,used={},A=AME_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.66);
  /* buildings and big pieces must stand on the tiles themselves (no overhanging the edge of the land) */
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='tree'?0.95+rng()*0.2:D.cat==='shrub'?0.95+rng()*0.15:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;if((D.cat==='struct'||D.cat==='ruin')&&!G.centers.some(c=>hexInside(px-c.x,py-c.y,(extra&&extra.edge)?1.12:1.0)))continue;if((D.cat==='tree'||D.cat==='shrub'||D.cat==='prop')&&placed.some(o=>o.noSouth&&Math.abs(px-o.x)<0.3&&py-o.y>-0.05&&py-o.y<0.36))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const PLANT_W={flowerPlanter:.3,barrelPlanter:.26,topiaryPot:.24,streetTree:.2},pickPlant=(low)=>{const w=Object.assign({},PLANT_W);if(low)delete w.streetTree;let t=0;for(const k in w)t+=w[k];let q=rng()*t;for(const k in w){q-=w[k];if(q<=0)return k;}return 'flowerPlanter';};
  const plant=(x,y,extra,low)=>place(pickPlant(low),x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const LKS=G.centers.length/12,landThin=l=>{const n=Math.max(1,Math.round(l.length*LKS));return Array.from({length:n},(_,i)=>l[Math.floor((i+0.5)*l.length/n)]);},landCnt=n=>Math.max(1,Math.round(n*LKS));
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  const rim=[],inn=[];outer.forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,-0.16))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.filter(e=>e.vertical).forEach(e=>inn.push([e.mid[0],e.mid[1]]));
  const chosen=[];
  const spread=(k,pool,extra)=>{const ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.22})).sort((a,b)=>b.d-a.d);for(let n=0;n<Math.min(14,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],extra);if(o){chosen.push([o.x,o.y]);return o;}}return null;};
  /* 1. the flag-pole plaza at the junction nearest the middle */
  {const js=G.verts.filter(v=>v.junction).sort((a,b)=>Math.hypot(a.x-cx,(a.y-cy)*0.7)-Math.hypot(b.x-cx,(b.y-cy)*0.7));let fp=null;for(const v of js){const o=place('flagPole',v.x,v.y,{minT:1,scale:1.0,clear:1.4});if(o){fp=o;chosen.push([o.x,o.y]);break;}}G.plaza=fp?[fp.x,fp.y]:null;}
  /* 2. facade buildings: rim first, then the voids; the bigger civic ones last */
  landThin([['emporium',1],['generalStore',1],['diner',2],['parlor',2],['cornerBank',3],['theater',3],['emporium',4],['fireStation',4]]).forEach(([k,mt])=>spread(k,rim,{minT:mt,scale:1.28,clear:2.5,noSouth:true}));
  landThin([['parlor',2],['generalStore',3],['diner',4],['townHall',4]]).forEach(([k,mt])=>spread(k,inn,{minT:mt,scale:k==='townHall'?1.05:1.2,clear:2.8,noSouth:true}));
  landThin([['gazebo',3],['popcornCart',2],['lemonadeStand',2],['popcornCart',4]]).forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,scale:1.1,clear:1.8,noSouth:true}));
  /* every building gets its own colour (never repeating next to itself) and turns its shopfront toward the middle of the land */
  {const bs=placed.filter(o=>o.cat==='struct').sort((a,b)=>a.x-b.x||a.y-b.y);bs.forEach((o,i)=>{o.v=((((i*5+1)%6)<<4))|((i*3)%8)|(o.x<cx?8:0);});}
  /* 3. planters: flower boxes, barrel planters, topiary pots and a few street trees at every junction, along every corridor and all round the rim */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.9)plant(v.x+(rng()-0.5)*0.1,v.y+(rng()-0.5)*0.08);if(rng()<0.4)plant(v.x+(rng()-0.5)*0.3,v.y+0.14,null,true);});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{[-0.24,0.24].forEach(dy=>{if(rng()<0.8)plant(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy);});});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.55)plant(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.95},true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx));
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.5));for(let s=0;s<nS;s++){if(rng()<0.4)continue;const p=onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(rng()-0.2)*0.1),low=e.cls==='bottom'||(e.cls==='side'&&p[1]>cy+0.25);plant(p[0],p[1],null,low);}});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.55)plant(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<8;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.1)plant(px,py,{scale:0.95},py>cy+0.35);}});
  /* 4. props, staged across the tiers and kept: lamps, benches, mailboxes, news boxes, bins, hydrants, picket fences, bunting, picnic tables */
  {const kinds=[['gasLamp',7],['picketFence',5],['bench',3],['trashCan',3],['mailbox',2],['newsBox',2],['hydrant',2],['bunting',2],['picnicTable',2]],seq=[];kinds.forEach(([k,n])=>{for(let i=0;i<landCnt(n);i++)seq.push(k);});
    for(let i=seq.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[seq[i],seq[j]]=[seq[j],seq[i]];}
    const pool=outer.concat(interior);seq.forEach((k,i)=>{const mt=1+Math.floor(i*4/seq.length);for(let a=0;a<6;a++){const e=pool[Math.floor(rng()*pool.length)],t=0.12+rng()*0.76,p=e.outer?onEdge(e,t,(rng()-0.3)*0.14):[e.a[0]+(e.b[0]-e.a[0])*t+(rng()-0.5)*0.1,e.a[1]+(e.b[1]-e.a[1])*t+(rng()-0.5)*0.1];if(place(k,p[0],p[1],{minT:mt,maxT:4}))break;}});}
  const cuts={tree:[0.3,0.55,0.8,1],shrub:[0.08,0.4,0.7,1],prop:[1,1,1,1],struct:[0,0,0,0],ruin:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='struct'||o.cat==='ruin')o.tier=o.minT;});
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.sort((a,b)=>a.y-b.y);
  return AME_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: the whole land is paved in a running-bond brick pattern (mixed terracotta tones, dark mortar), with soft light and wear patches for depth (decals, not objects) ---- */
function ameGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R];
  /* mortar, then bricks (oblique view: wide and short) */
  c.fillStyle='#7d6a5c';c.fillRect(bx[0]-4,bx[1]-4,bx[2]+8,bx[3]+8);
  const bw=R*0.17,bh=R*0.085,gap=Math.max(0.9,R*0.012),cols=['#b8664e','#ad5c46','#c27358','#a35643','#b46a52','#bc7a5e','#9c503e','#c47e62'],y0=Math.floor(bx[1]/bh)*bh,x0=Math.floor(bx[0]/bw)*bw-bw;
  for(let y=y0,row=0;y<bx[1]+bx[3]+bh;y+=bh,row++){const off=(row%2)*bw*0.5;for(let x=x0+off;x<bx[0]+bx[2]+bw;x+=bw){const t=r(),base=cols[Math.floor(t*cols.length)];c.fillStyle=base;c.fillRect(x+gap*0.5,y+gap*0.5,bw-gap,bh-gap);
      c.fillStyle='rgba(255,235,210,.16)';c.fillRect(x+gap*0.5,y+gap*0.5,bw-gap,Math.max(0.8,bh*0.22));c.fillStyle='rgba(60,25,15,.2)';c.fillRect(x+gap*0.5,y+bh-gap*0.5-Math.max(0.8,bh*0.2),bw-gap,Math.max(0.8,bh*0.2));
      if(r()<0.09){c.fillStyle='rgba(40,20,14,.22)';c.fillRect(x+gap*0.5,y+gap*0.5,bw-gap,bh-gap);}else if(r()<0.06){c.fillStyle='rgba(255,240,220,.18)';c.fillRect(x+gap*0.5,y+gap*0.5,bw-gap,bh-gap);}}}
  /* soft light and wear so the paving is not flat */
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  const pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  for(let k=0;k<34;k++){const p=pt(),w=R*(0.5+r()*1.0);soft(p[0],p[1],w,w*0.4,r()<0.55?'255,225,190':'70,35,25',r()<0.55?0.16:0.14);}
  for(let k=0;k<10;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'200,200,190',0.12);}
  c.restore();c.restore();
}
/* ---- generic baker (any theme object {assets, plan, ground, groundCol, seeds}) ---- */

function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol,clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]),key=[T.id,shape,tier,R,m,ground,sc,JSON.stringify(clr),JSON.stringify(opts.clearTiles||[])].join('|');const cached=revisedLandCache.get(key);if(cached)return cached;
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=0.75,top=T.top||1.35,bot=0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);return[cv,g];};
  const [back,cb]=mk();T.ground(cb,G,R,ox,oy,m,ground,({A:11,B:22,C:33,D:44})[shape]);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]),vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho))&&!(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));
  const sprites=vis.map(o=>{const unit=u*(o.scale||1);return {x:m*o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>T.assets[o.kind].draw(ctx,x,y,unit,o.v)};});
  const front=document.createElement('canvas'),frontRect={x:0,y:0,w:1,h:1};front.width=front.height=1;
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return revisedLandCache.set(key,{back,front,frontRect,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0,sprites});
}
function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}
const AME_THEME={id:'americana',assets:AME_ASSETS,plan:getAmericanaPlan,ground:ameGround,groundCol:'#a8644c',top:1.9};
const AME_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
/* public API: same shape as the Western pack */
function bakeLandAmericana(shape,tier,R,opts){return bakeLandTheme(AME_THEME,shape,tier,R,opts);}
function drawLandAmericanaBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandAmericanaFront(ctx,x,y,land){land.sprites.slice().sort((a,b)=>a.y-b.y).forEach(s=>drawScenicSprite(ctx,s,x+s.x,y+s.y));}
function landAmericanaSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}


return Object.freeze({bake: bakeLandAmericana, drawBack: drawLandAmericanaBack, drawFront: drawLandAmericanaFront});
})(),
  caribbean: (() => {

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

/* ===== CARIBBEAN ASSET LIBRARY (macro-land pieces). Jungle palms + pirate-port architecture. draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const JS=(c,x,y,rx)=>{c.fillStyle='rgba(12,40,22,.28)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const JPAL=[['#2f6b3a','#3f8a45','#58a04f','#2a5c35'],['#2b6a46','#3a8a58','#4fa56a','#25583b'],['#3d7a34','#58a03f','#76b84e','#336a2c'],['#2a6048','#37805e','#4c9c74','#234f3b']];
const JSTONE='#b5ae94',JSTONE_D='#8c866e',JSTONE_L='#cfc9b0',JMOSS='#5f8f3f';
const JFROND=(c,x,y,ang,len,u,col,mid,droop)=>{const ex=x+Math.cos(ang)*len,ey=y+Math.sin(ang)*len*0.6+len*(droop||0.35),mx=x+Math.cos(ang)*len*0.55,my=y+Math.sin(ang)*len*0.7-len*0.25;
  c.lineCap='round';c.strokeStyle=col;c.lineWidth=u*0.42;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(mx,my,ex,ey);c.stroke();c.strokeStyle=mid;c.lineWidth=u*0.1;c.stroke();
  for(let k=1;k<7;k++){const t=k/7,q=1-t,px=q*q*x+2*q*t*mx+t*t*ex,py=q*q*y+2*q*t*my+t*t*ey,s=len*0.2*(1-t*0.6);TH.ln(c,[px,py],[px+Math.sin(ang)*s*0.5-Math.cos(ang)*s*0.2,py+s*0.55],col,u*0.14);TH.ln(c,[px,py],[px-Math.sin(ang)*s*0.5-Math.cos(ang)*s*0.2,py+s*0.55],col,u*0.14);}};
const JBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.28),shade(col,0.16));
const JVINE=(c,x,y,u,r,n)=>{for(let k=0;k<n;k++){const vx=x+(r()-0.5)*u*2.4,vy=y-r()*u*1.2;TH.ell(c,vx,vy,u*(0.25+r()*0.3),u*(0.18+r()*0.2),r()<0.5?'#4d8a3a':'#3a7030');}};
/* ===== iso building helpers (shared by the Caribbean + Americana packs). I=(X,Y,Z)=>screen point. Front face = plane Y=y1 (faces lower-left), right face = plane X=x1 (faces lower-right). ===== */
const MIR=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
const BP=(c,pts,fill,stroke,lw)=>TH.poly(c,pts,fill,stroke,lw);
const BF=(c,I,x0,x1,y1,z0,z1,col)=>BP(c,[I(x0,y1,z0),I(x1,y1,z0),I(x1,y1,z1),I(x0,y1,z1)],col);
const BR=(c,I,x1,y0,y1,z0,z1,col)=>BP(c,[I(x1,y0,z0),I(x1,y1,z0),I(x1,y1,z1),I(x1,y0,z1)],col);
const BT=(c,I,x0,x1,y0,y1,z,col)=>BP(c,[I(x0,y0,z),I(x1,y0,z),I(x1,y1,z),I(x0,y1,z)],col);
const WF=(c,I,y1,X,Z,w,h,col,fr)=>BP(c,[I(X-w/2,y1,Z-h/2),I(X+w/2,y1,Z-h/2),I(X+w/2,y1,Z+h/2),I(X-w/2,y1,Z+h/2)],col,fr,fr?0.9:0);
const WR=(c,I,x1,Y,Z,w,h,col,fr)=>BP(c,[I(x1,Y-w/2,Z-h/2),I(x1,Y+w/2,Z-h/2),I(x1,Y+w/2,Z+h/2),I(x1,Y-w/2,Z+h/2)],col,fr,fr?0.9:0);
/* clapboard / brick courses on a face: n lines between z0 and z1 */
const BFL=(c,I,x0,x1,y1,z0,z1,step,col,u)=>{for(let z=z0+step;z<z1-0.01;z+=step)TH.ln(c,I(x0,y1,z),I(x1,y1,z),col,u*0.05);};
const BRL=(c,I,x1,y0,y1,z0,z1,step,col,u)=>{for(let z=z0+step;z<z1-0.01;z+=step)TH.ln(c,I(x1,y0,z),I(x1,y1,z),col,u*0.05);};
/* hip roof over a rectangle: ridge runs along X; front trapezoid + right triangle */
function HIP(c,I,x0,x1,y0,y1,z,H,o,cf,cr,u,tex){const yc=(y0+y1)/2,xr0=x0+(y1-y0)/2,xr1=x1-(y1-y0)/2,A=I(x0-o,y1+o,z),B=I(x1+o,y1+o,z),R1=I(xr1,yc,z+H),R0=I(xr0,yc,z+H),C=I(x1+o,y0-o,z);
  BP(c,[B,C,R1],cr);BP(c,[A,B,R1,R0],cf);
  if(tex){for(let k=1;k<=tex;k++){const t=k/(tex+1),L=[A[0]+(R0[0]-A[0])*t,A[1]+(R0[1]-A[1])*t],Rr=[B[0]+(R1[0]-B[0])*t,B[1]+(R1[1]-B[1])*t];TH.ln(c,L,Rr,'rgba(0,0,0,.16)',u*0.07);TH.ln(c,[L[0],L[1]-u*0.07],[Rr[0],Rr[1]-u*0.07],'rgba(255,255,255,.14)',u*0.05);}}
  TH.ln(c,R0,R1,shade(cf,-0.3),u*0.16);}
/* gable roof, ridge along X: front slope + right gable end */
function GAB(c,I,x0,x1,y0,y1,z,H,o,cf,cg,u,tex){const yc=(y0+y1)/2,A=I(x0-o,y1+o,z),B=I(x1+o,y1+o,z),R1=I(x1+o,yc,z+H),R0=I(x0-o,yc,z+H);
  BP(c,[I(x1,y0,z),I(x1,y1,z),I(x1,yc,z+H*0.86)],cg);BP(c,[A,B,R1,R0],cf);
  if(tex){for(let k=1;k<=tex;k++){const t=k/(tex+1),L=[A[0]+(R0[0]-A[0])*t,A[1]+(R0[1]-A[1])*t],Rr=[B[0]+(R1[0]-B[0])*t,B[1]+(R1[1]-B[1])*t];TH.ln(c,L,Rr,'rgba(0,0,0,.16)',u*0.07);TH.ln(c,[L[0],L[1]-u*0.07],[Rr[0],Rr[1]-u*0.07],'rgba(255,255,255,.14)',u*0.05);}}
  TH.ln(c,R0,R1,shade(cf,-0.3),u*0.16);TH.ln(c,A,B,shade(cf,-0.25),u*0.1);}
const GLOW=(c,x,y,r,rgb,a)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();};


function TKB(c,x,y,rx,h){const ry=rx*0.5,g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,'#b98a58');g.addColorStop(0.5,'#8a5a33');g.addColorStop(1,'#5a3a22');c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y-h);c.quadraticCurveTo(x-rx*1.2,y-h*0.5,x-rx,y);c.ellipse(x,y,rx,ry,0,Math.PI,0,true);c.quadraticCurveTo(x+rx*1.2,y-h*0.5,x+rx,y-h);c.ellipse(x,y-h,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();
  c.strokeStyle='#3a3a42';c.lineWidth=Math.max(1,rx*0.14);[0.22,0.78].forEach(f=>{c.beginPath();c.ellipse(x,y-h*f,rx*1.08,ry*1.08,0,0.05,Math.PI-0.05);c.stroke();});TH.ell(c,x,y-h,rx,ry,'#a07a4a');TH.ell(c,x,y-h,rx*0.8,ry*0.8,'#6a4a2c');}
function TKB2(c,x,y,rx,ry,wh){const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,'#cfc6b0');g.addColorStop(0.5,'#b4ab98');g.addColorStop(1,'#7a7260');c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y-wh);c.lineTo(x-rx,y);c.ellipse(x,y,rx,ry,0,Math.PI,0,true);c.lineTo(x+rx,y-wh);c.ellipse(x,y-wh,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();c.save();c.clip();c.strokeStyle='rgba(60,52,40,.3)';c.lineWidth=Math.max(0.8,rx*0.05);for(let k=1;k<4;k++){c.beginPath();c.ellipse(x,y-wh*k/4,rx,ry,0,0.02,Math.PI-0.02);c.stroke();}c.restore();}
/* ===== CARIBBEAN ASSETS: 18th-century pirate port. Pastel creole houses, tavern, fort, wrecks, cannons, palms. draw(c,x,y,u,v): v bit3 = mirror, bits0-2 = house colour, bits4-5 = roof ===== */
const CBP=['#f28ab2','#4fc3c7','#f6c453','#f08a4b','#8ad06a','#6aa8e8','#b98ae0','#ef6a5a'],CBROOF=['#c4553a','#a8442e','#8a5a3a','#6e7e8c'],CBTRIM='#fbf6ea',CBSTONE=['#b4ab98','#8f8774','#cfc6b0'];
const CBSH=(c,x,y,rx)=>{c.fillStyle='rgba(40,50,30,.26)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};

const CARIB_ASSETS={
  broadleaf:{cat:'tree',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*7+1),H=u*(4.6+r()*1.3),pal=JPAL[v%4];JS(c,x,y,u*2.3);c.lineCap='round';c.strokeStyle='#5f4228';c.lineWidth=u*0.7;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.1,y-H*0.35,x+u*0.05,y-H*0.62);c.stroke();TH.poly(c,[[x-u*0.55,y],[x-u*0.2,y-u*0.9],[x+u*0.15,y-u*0.9],[x+u*0.6,y]],'#5f4228');TH.ln(c,[x-u*0.1,y-H*0.1],[x-u*0.05,y-H*0.55],'#7b5a38',u*0.18);
    TH.ln(c,[x,y-H*0.5],[x-u*1.1,y-H*0.85],'#5f4228',u*0.32);TH.ln(c,[x,y-H*0.55],[x+u*1.2,y-H*0.82],'#5f4228',u*0.3);
    const cy=y-H*0.82;[[0,-0.3,1.9,1.15],[-1.55,-0.1,1.3,1.0],[1.55,-0.1,1.3,1.0],[-0.8,-1.15,1.45,1.0],[0.85,-1.15,1.45,1.0],[0,-1.7,1.2,0.85],[-1.1,0.5,0.9,0.6],[1.1,0.5,0.9,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[(i+(v>>2))%4],r,10));
    for(let k=0;k<4;k++){const vx=x+(r()-0.5)*u*2.6,vy=cy+u*(0.4+r()*0.5);TH.ln(c,[vx,vy],[vx+(r()-0.5)*u*0.3,vy+u*(0.8+r()*0.8)],'#3a7030',u*0.08);}}},
  ceiba:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*5+3),H=u*(8.4+r()*1.6);JS(c,x,y,u*2.6);const t='#8a7d68',td='#6d6150';
    TH.poly(c,[[x-u*1.5,y+u*0.1],[x-u*0.55,y-u*2.2],[x-u*0.45,y-u*0.2]],td);TH.poly(c,[[x+u*1.5,y+u*0.1],[x+u*0.55,y-u*2.2],[x+u*0.45,y-u*0.2]],td);TH.poly(c,[[x-u*0.7,y],[x-u*0.5,y-H*0.78],[x+u*0.5,y-H*0.78],[x+u*0.7,y]],t);TH.poly(c,[[x+u*0.1,y],[x+u*0.1,y-H*0.78],[x+u*0.5,y-H*0.78],[x+u*0.7,y]],'rgba(40,28,18,.25)');
    for(let k=0;k<6;k++)TH.ln(c,[x-u*0.45,y-H*(0.1+k*0.12)],[x+u*0.45,y-H*(0.1+k*0.12)-u*0.1],'rgba(40,28,18,.14)',u*0.07);
    [[-1,0.9],[0,1.0],[1,0.88]].forEach(([d,f])=>TH.ln(c,[x,y-H*0.7],[x+d*u*2.2,y-H*f*0.95],t,u*0.4));const pal=JPAL[v%4],cy=y-H*0.93;
    [[-3.0,0.4,1.7,0.7],[3.0,0.4,1.7,0.7],[-1.7,-0.1,2.0,0.9],[1.7,-0.1,2.0,0.9],[0,-0.35,2.3,0.95],[-0.8,0.5,1.7,0.6],[0.9,0.5,1.7,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,10));}},
  palm:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*11+2),H=u*(5.2+r()*1.6),lean=(r()-0.5)*u*2.0;JS(c,x,y,u*1.3);c.lineCap='round';c.strokeStyle='#a08c68';c.lineWidth=u*0.62;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*0.1,y-H*0.5,x+lean,y-H);c.stroke();c.strokeStyle='#bba67e';c.lineWidth=u*0.2;c.beginPath();c.moveTo(x-u*0.15,y);c.quadraticCurveTo(x+lean*0.1-u*0.15,y-H*0.5,x+lean-u*0.1,y-H);c.stroke();
    for(let k=1;k<9;k++){const t=k/9,q=1-t,px=q*q*x+2*q*t*(x+lean*0.1)+t*t*(x+lean),py=q*q*y+2*q*t*(y-H*0.5)+t*t*(y-H);TH.ln(c,[px-u*0.32,py],[px+u*0.32,py+u*0.05],'rgba(60,40,20,.35)',u*0.06);}
    const cx=x+lean,cy=y-H;[-2.9,-2.35,-1.85,-1.3,-0.7,-0.2].forEach((a,i)=>{JFROND(c,cx,cy,a,u*(2.5+r()*0.5),u,i%2?'#2f7a3a':'#3a8a42','#8fcf6a',0.3);JFROND(c,cx,cy,Math.PI-a-Math.PI*1.0+Math.PI,u*(2.3+r()*0.5),u,i%2?'#3a8a42':'#2f7a3a','#8fcf6a',0.3);});[[-0.25,0.2],[0.25,0.25],[0,0.35]].forEach(([dx,dy])=>TH.ell(c,cx+dx*u,cy+dy*u,u*0.24,u*0.26,'#6b4a22'));}},
  fanPalm:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*3+9);JS(c,x,y,u*1.4);TH.ln(c,[x,y],[x,y-u*1.4],'#6b4a2e',u*0.5);const cy=y-u*1.5;for(let k=0;k<9;k++){const a=-Math.PI+0.15+k/8*(Math.PI-0.3),l=u*(1.7+r()*0.4);c.save();c.translate(x,cy);c.rotate(a+Math.PI/2);TH.ell(c,0,-l*0.62,u*0.62,l*0.62,k%2?'#3a8a45':'#2f7a3a');TH.ln(c,[0,0],[0,-l*1.2],'#8fcf6a',u*0.07);c.restore();}}},
  jungleBush:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*29+3),pal=[['#3f8a45','#58a04f','#6fb35a','#2f7a3a'],['#4a9a3f','#6fb34a','#8cc66a','#3a8a35'],['#2f7a3a','#3f8a45','#58a04f','#2a6a38']][v%3];JS(c,x,y,u*1.6);TH.ln(c,[x,y],[x,y-u*0.9],'#5f4228',u*0.4);[[0,-1.9,1.2,0.9],[-0.9,-1.2,1.0,0.8],[0.9,-1.2,1.0,0.8],[0,-1.0,1.4,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,pal[i%4],r,9));}},
  fern:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(12,40,22,.22)');for(let k=0;k<9;k++){const a=-Math.PI+0.15+k/8*(Math.PI-0.3);JFROND(c,x,y-u*0.1,a,u*(1.2+r()*0.45),u,k%2?'#4a9a3f':'#3a8a35','#a8e07a',0.5);}}},
  elephantEar:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+9);TH.ell(c,x+u*0.2,y+u*0.08,u*1.0,u*0.3,'rgba(12,40,22,.22)');[[-0.7,-1.0,-0.5],[0.7,-1.1,0.5],[0,-1.5,0],[-0.2,-0.6,-0.2]].forEach(([dx,dy,rot],i)=>{const px=x+dx*u,py=y+dy*u;TH.ln(c,[x,y],[px,py+u*0.2],'#5f8a3a',u*0.14);c.save();c.translate(px,py);c.rotate(rot);c.fillStyle=i%2?'#3f8a45':'#2f7a3a';c.beginPath();c.moveTo(0,u*0.5);c.bezierCurveTo(-u*0.95,u*0.1,-u*0.8,-u*1.1,0,-u*0.95);c.bezierCurveTo(u*0.8,-u*1.1,u*0.95,u*0.1,0,u*0.5);c.fill();TH.ln(c,[0,u*0.4],[0,-u*0.8],'#8fcf6a',u*0.06);c.restore();});}},
  heliconia:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*7+2);TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.28,'rgba(12,40,22,.22)');[[-0.7,-1.5],[0.7,-1.6],[0,-2.0]].forEach(([dx,dy],i)=>{c.save();c.translate(x+dx*u*0.4,y);c.rotate(dx*0.35);c.fillStyle=i%2?'#3a8a42':'#2f7a3a';c.beginPath();c.ellipse(0,dy*u*0.5,u*0.38,u*0.85,0,0,7);c.fill();TH.ln(c,[0,0],[0,dy*u*0.9],'#8fcf6a',u*0.05);c.restore();});
    [[0.25,-1.8,'#d9433b'],[-0.35,-1.5,'#f08a24']].forEach(([dx,dy,col])=>{for(let k=0;k<4;k++)TH.poly(c,[[x+dx*u+k*u*0.12,y+dy*u+k*u*0.28],[x+dx*u+u*0.35+k*u*0.12,y+dy*u+k*u*0.28+u*0.15],[x+dx*u+u*0.1+k*u*0.12,y+dy*u+k*u*0.28+u*0.4]],col);});}},
  flowerBush:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*11+4),cols=[['#e86aa8','#f4a6cb'],['#d9433b','#f08a24'],['#f2c230','#fff0a0'],['#8a5ac8','#c9a6f0']][v%4];TH.ell(c,x+u*0.2,y+u*0.08,u*1.0,u*0.3,'rgba(12,40,22,.22)');[[-0.55,-0.5,0.8,0.55],[0.55,-0.5,0.8,0.55],[0,-0.9,0.85,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#3a8a45','#2f7a3a','#4a9a3f'][i],r,8));for(let k=0;k<11;k++){const fx=x+(r()-0.5)*u*1.7,fy=y-u*(0.3+r()*1.0);TH.ell(c,fx,fy,u*0.17,u*0.15,cols[k%2]);TH.ell(c,fx,fy,u*0.06,u*0.06,'#fff6c0');}}},
  jungleGrass:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);for(let k=0;k<13;k++){const a=-1.1+k/12*2.2+(r()-0.5)*0.2,l=u*(0.7+r()*0.8);TH.ln(c,[x+(r()-0.5)*u*0.6,y],[x+Math.sin(a)*l*0.8+(r()-0.5)*u*0.3,y-l],['#4f9a3f','#6fb34a','#3a8a35'][k%3],u*0.09);}}},
  banana:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*13+5);JS(c,x,y,u*1.3);TH.ln(c,[x,y],[x,y-u*1.8],'#8fa55a',u*0.5);for(let k=0;k<6;k++){const a=-Math.PI+0.2+k/5*(Math.PI-0.4);const ex=x+Math.cos(a)*u*2.0,ey=y-u*1.8+Math.sin(a)*u*0.8+u*0.9;c.fillStyle=k%2?'#4a9a3f':'#3a8a35';c.beginPath();c.moveTo(x,y-u*1.8);c.quadraticCurveTo(x+Math.cos(a)*u*1.1,y-u*2.8,ex,ey);c.quadraticCurveTo(x+Math.cos(a)*u*1.0,y-u*1.6,x,y-u*1.8);c.fill();TH.ln(c,[x,y-u*1.8],[ex,ey],'#a8e07a',u*0.05);}
    TH.ln(c,[x,y-u*1.7],[x+u*0.4,y-u*1.0],'#6b8a3a',u*0.1);for(let k=0;k<5;k++)TH.ell(c,x+u*0.4+(k%2)*u*0.15,y-u*(0.7+k*0.1),u*0.14,u*0.09,'#e8c83a');}},
  crates:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.4,u*0.4,'rgba(12,40,22,.25)');const w='#b0884e';TH.box(c,x,y,u,-0.9,0.1,-0.6,0.5,0,0.9,w,shade(w,-0.28),shade(w,0.16));TH.box(c,x,y,u,0.2,1.2,-0.5,0.5,0,0.8,'#9a7440',shade('#9a7440',-0.28),shade('#9a7440',0.16));TH.box(c,x,y,u,-0.6,0.4,-0.5,0.4,0.9,1.7,'#c19a5c',shade('#c19a5c',-0.28),shade('#c19a5c',0.16));
    [[-0.4,0.51,0.1],[-0.4,0.51,0.8]].forEach(([X,Y,Z])=>0);TH.ln(c,I(-0.9,0.51,0.45),I(0.1,0.51,0.45),'rgba(50,30,10,.4)',u*0.07);TH.ln(c,I(-0.1,0.41,1.3),I(0.4,0.41,1.3),'rgba(50,30,10,.4)',u*0.07);}},
  /* ---------- new: creole houses, tavern, fort, wrecks, cannons ---------- */
  creoleHouse:{cat:'struct',rho:0.13,draw(c,x,y,u,v){MIR(c,x,v&8,()=>{const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),w=CBP[v&7],wr=shade(w,-0.2),roof=CBROOF[(v>>4)&3],sh=CBP[(v+3)&7];CBSH(c,x,y,u*4.8);
    TH.box(c,x,y,u,-2.9,2.9,-1.9,2.9,0,0.18,'#c9b08a','#a38a66','#d8c19c');
    BF(c,I,-2.6,2.6,1.8,0.18,2.2,w);BR(c,I,2.6,-1.8,1.8,0.18,2.2,wr);BFL(c,I,-2.6,2.6,1.8,0.18,2.2,0.38,'rgba(0,0,0,.1)',u);BRL(c,I,2.6,-1.8,1.8,0.18,2.2,0.38,'rgba(0,0,0,.14)',u);
    WF(c,I,1.8,0,1.15,1.0,1.9,CBTRIM);WF(c,I,1.8,0,1.1,0.76,1.7,shade(sh,-0.1));
    [-1.7,1.7].forEach(X=>{WF(c,I,1.8,X,1.4,1.0,1.15,'#27394d',CBTRIM);WF(c,I,1.8,X-0.72,1.4,0.38,1.15,sh);WF(c,I,1.8,X+0.72,1.4,0.38,1.15,sh);});
    [-0.7,0.9].forEach(Y=>{WR(c,I,2.6,Y,1.4,0.9,1.15,'#27394d',CBTRIM);WR(c,I,2.6,Y-0.62,1.4,0.34,1.15,shade(sh,-0.12));WR(c,I,2.6,Y+0.62,1.4,0.34,1.15,shade(sh,-0.12));});
    [-2.7,-0.9,0.9,2.7].forEach(X=>TH.ln(c,I(X,2.8,0.18),I(X,2.8,2.3),CBTRIM,u*0.24));TH.ln(c,I(-2.7,2.8,1.0),I(2.7,2.8,1.0),CBTRIM,u*0.12);for(let k=0;k<12;k++){const X=-2.6+k*0.47;TH.ln(c,I(X,2.8,0.2),I(X,2.8,1.0),CBTRIM,u*0.06);}
    HIP(c,I,-2.7,2.7,-1.9,2.9,2.3,2.4,0.45,roof,shade(roof,-0.25),u,5);}) }},
  creoleHouse2:{cat:'struct',rho:0.13,draw(c,x,y,u,v){MIR(c,x,v&8,()=>{const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),w=CBP[v&7],wr=shade(w,-0.2),roof=CBROOF[(v>>4)&3],sh=CBP[(v+4)&7];CBSH(c,x,y,u*4.6);
    BF(c,I,-2.3,2.3,1.6,0,4.2,w);BR(c,I,2.3,-1.6,1.6,0,4.2,wr);BFL(c,I,-2.3,2.3,1.6,0,4.2,0.4,'rgba(0,0,0,.09)',u);BRL(c,I,2.3,-1.6,1.6,0,4.2,0.4,'rgba(0,0,0,.13)',u);
    BF(c,I,-2.35,2.35,1.62,2.05,2.25,CBTRIM);
    WF(c,I,1.6,0,1.0,1.1,1.9,CBTRIM);WF(c,I,1.6,-0.28,1.0,0.5,1.7,shade(sh,-0.1));WF(c,I,1.6,0.28,1.0,0.5,1.7,shade(sh,-0.1));
    [-1.5,1.5].forEach(X=>{WF(c,I,1.6,X,1.2,0.8,1.1,'#27394d',CBTRIM);WF(c,I,1.6,X-0.6,1.2,0.3,1.1,sh);WF(c,I,1.6,X+0.6,1.2,0.3,1.1,sh);});
    [-1.5,0,1.5].forEach(X=>{WF(c,I,1.6,X,3.3,0.8,1.3,'#27394d',CBTRIM);WF(c,I,1.6,X-0.6,3.3,0.3,1.3,sh);WF(c,I,1.6,X+0.6,3.3,0.3,1.3,sh);for(let k=1;k<5;k++)TH.ln(c,I(X-0.75,1.6,3.3-0.65+k*0.26),I(X-0.45,1.6,3.3-0.65+k*0.26),'rgba(0,0,0,.25)',u*0.04);});
    [-0.5,0.6].forEach(Y=>WR(c,I,2.3,Y,1.2,0.8,1.1,'#27394d',CBTRIM));[-0.5,0.6].forEach(Y=>WR(c,I,2.3,Y,3.3,0.8,1.3,'#27394d',CBTRIM));
    /* balcony */
    TH.box(c,x,y,u,-2.6,2.6,1.6,2.45,2.05,2.2,'#a38a66','#7a6648','#c9b08a');[-2.5,-1.0,0.5,2.0,2.5].forEach(X=>TH.ln(c,I(X,2.4,2.2),I(X,2.4,3.1),CBTRIM,u*0.09));TH.ln(c,I(-2.5,2.4,3.1),I(2.5,2.4,3.1),CBTRIM,u*0.11);
    [-2.5,2.5].forEach(X=>TH.ln(c,I(X,2.4,0.05),I(X,2.4,3.1),CBTRIM,u*0.2));
    GAB(c,I,-2.3,2.3,-1.6,1.6,4.2,2.2,0.5,roof,shade(w,-0.12),u,5);
    TH.box(c,x,y,u,1.0,1.7,-0.6,0.1,5.4,7.0,'#a8442e','#7a2e1e','#c4553a');}) }},
  pirateTavern:{cat:'struct',rho:0.14,draw(c,x,y,u,v){MIR(c,x,v&8,()=>{const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);CBSH(c,x,y,u*5.2);
    BF(c,I,-3.0,3.0,2.0,0,2.2,'#dccaa2');BR(c,I,3.0,-2.0,2.0,0,2.2,'#a89870');BFL(c,I,-3.0,3.0,2.0,0,2.2,0.45,'rgba(60,40,20,.12)',u);
    BF(c,I,-3.25,3.25,2.3,2.2,4.4,'#efe3c4');BR(c,I,3.25,-2.3,2.3,2.2,4.4,'#c8b88f');
    TH.box(c,x,y,u,-3.3,3.3,-2.35,2.35,2.1,2.3,'#5a3e28','#3e2a1a','#6e4c32');
    for(let k=0;k<=6;k++){const X=-3.25+k*(6.5/6);TH.ln(c,I(X,2.3,2.3),I(X,2.3,4.4),'#4a3220',u*0.16);}TH.ln(c,I(-3.25,2.3,3.3),I(3.25,2.3,3.3),'#4a3220',u*0.14);for(let k=0;k<6;k++){const X0=-3.25+k*(6.5/6),X1=X0+6.5/6;TH.ln(c,I(X0,2.3,2.3),I(X1,2.3,3.3),'#4a3220',u*0.1);TH.ln(c,I(X1,2.3,2.3),I(X0,2.3,3.3),'#4a3220',u*0.1);}
    TH.ln(c,I(3.25,-2.3,3.3),I(3.25,2.3,3.3),'#4a3220',u*0.14);
    WF(c,I,2.0,0.0,1.1,1.3,1.9,'#4a3220');WF(c,I,2.0,0.0,1.1,1.0,1.7,'#2a1a10');GLOW(c,I(0,2.0,1.1)[0],I(0,2.0,1.1)[1],u*2.4,'255,190,90',0.32);
    [-1.9,1.9].forEach(X=>{WF(c,I,2.0,X,1.3,1.0,1.0,'#ffd27a','#4a3220');TH.ln(c,I(X,2.0,0.8),I(X,2.0,1.8),'#4a3220',u*0.07);});
    [-2.0,0,2.0].forEach(X=>WF(c,I,2.3,X,3.4,0.9,0.9,'#ffd27a','#4a3220'));[-0.7,0.9].forEach(Y=>{WR(c,I,3.0,Y,1.3,0.9,1.0,'#ffd27a','#4a3220');WR(c,I,3.25,Y,3.4,0.9,0.9,'#d8b860','#4a3220');});
    GAB(c,I,-3.25,3.25,-2.3,2.3,4.4,2.5,0.5,'#5f4b3b','#c8b88f',u,6);
    TH.box(c,x,y,u,-2.2,-1.5,-0.6,0.1,5.4,7.2,'#8a7a66','#6a5a48','#a8987e');
    /* hanging skull sign */
    const sb=I(-3.25,2.3,3.9);TH.ln(c,sb,[sb[0]-u*0.9,sb[1]],'#2a1a10',u*0.12);TH.ln(c,[sb[0]-u*0.2,sb[1]],[sb[0]-u*0.2,sb[1]+u*0.4],'#2a1a10',u*0.05);TH.ln(c,[sb[0]-u*0.8,sb[1]],[sb[0]-u*0.8,sb[1]+u*0.4],'#2a1a10',u*0.05);
    TH.poly(c,[[sb[0]-u*0.95,sb[1]+u*0.4],[sb[0]-u*0.05,sb[1]+u*0.4],[sb[0]-u*0.05,sb[1]+u*1.5],[sb[0]-u*0.95,sb[1]+u*1.5]],'#1e1812','#6a4a2a',u*0.06);TH.ell(c,sb[0]-u*0.5,sb[1]+u*0.85,u*0.24,u*0.26,'#f2ead6');TH.ln(c,[sb[0]-u*0.8,sb[1]+u*1.2],[sb[0]-u*0.2,sb[1]+u*0.55],'#f2ead6',u*0.07);TH.ln(c,[sb[0]-u*0.2,sb[1]+u*1.2],[sb[0]-u*0.8,sb[1]+u*0.55],'#f2ead6',u*0.07);
    [[1.9,2.6],[2.6,2.2]].forEach(([X,Y],i)=>{const p=I(X,Y,0),h=u*(1.3-i*0.1);TKB(c,p[0],p[1],u*0.55,h);});}) }},
  fortTower:{cat:'struct',rho:0.12,draw(c,x,y,u,v){CBSH(c,x,y,u*4.2);const rx=2.9*u,ry=1.45*u,wh=8.2*u;
    TH.ell(c,x,y+u*0.1,rx*1.12,ry*1.12,'#8f8774');
    const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,'#cfc6b0');g.addColorStop(0.5,'#b4ab98');g.addColorStop(1,'#7a7260');c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y-wh);c.lineTo(x-rx*1.08,y);c.ellipse(x,y,rx*1.08,ry*1.08,0,Math.PI,0,true);c.lineTo(x+rx,y-wh);c.ellipse(x,y-wh,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();
    c.save();c.clip();c.strokeStyle='rgba(60,52,40,.28)';c.lineWidth=u*0.08;for(let k=1;k<10;k++){c.beginPath();c.ellipse(x,y-wh*k/10,rx*(1.08-0.08*k/10),ry*(1.08-0.08*k/10),0,0.02,Math.PI-0.02);c.stroke();}
    for(let k=0;k<22;k++){const a=Math.PI*k/22,px=x+Math.cos(a)*rx,py=y+Math.sin(a)*ry;for(let r=0;r<9;r++){const yy=py-wh*(r+(k%2?0.5:0.1))/9;c.strokeStyle='rgba(60,52,40,.2)';c.beginPath();c.moveTo(px,yy);c.lineTo(px,yy-wh/9);c.stroke();}}c.restore();
    [[0.35,-1.0],[0.5,0.2],[0.38,1.4]].forEach(([f,s])=>{const a=Math.PI/2+s*0.55,px=x+Math.cos(a)*rx,py=y+Math.sin(a)*ry-wh*f;TH.poly(c,[[px-u*0.22,py+u*0.5],[px+u*0.22,py+u*0.5],[px+u*0.22,py-u*0.5],[px-u*0.22,py-u*0.5]],'#2a2418');});
    [[0.62,-0.45],[0.62,0.45]].forEach(([f,s])=>{const a=Math.PI/2+s,px=x+Math.cos(a)*rx,py=y+Math.sin(a)*ry-wh*f;TH.poly(c,[[px-u*0.55,py+u*0.45],[px+u*0.55,py+u*0.45],[px+u*0.55,py-u*0.45],[px-u*0.55,py-u*0.45]],'#2a2418');TH.ln(c,[px,py],[px+(s<0?-1:1)*u*0.2,py+u*0.9],'#1e1c20',u*0.55);TH.ell(c,px+(s<0?-1:1)*u*0.2,py+u*0.95,u*0.32,u*0.22,'#101012');});
    const ty=y-wh,rr=rx*1.12,rrr=ry*1.12;TH.ell(c,x,ty,rr,rrr,'#a89f8a');TH.ell(c,x,ty,rr*0.86,rrr*0.86,'#6a6250');
    for(let k=0;k<14;k++){const a=Math.PI*(k+0.5)/14,px=x+Math.cos(a)*rr*0.97,py=ty+Math.sin(a)*rrr*0.97;TH.poly(c,[[px-u*0.28,py],[px+u*0.28,py],[px+u*0.28,py-u*0.8],[px-u*0.28,py-u*0.8]],'#b9b09a');}
    TH.ln(c,[x,ty],[x,ty-u*5.2],'#4a3220',u*0.2);const fx=x,fy=ty-u*5.0;c.fillStyle='#16161a';c.beginPath();c.moveTo(fx,fy);c.quadraticCurveTo(fx+u*1.2,fy+u*0.1,fx+u*2.4,fy-u*0.1);c.lineTo(fx+u*2.5,fy+u*1.5);c.quadraticCurveTo(fx+u*1.2,fy+u*1.7,fx,fy+u*1.5);c.closePath();c.fill();TH.ell(c,fx+u*1.2,fy+u*0.65,u*0.3,u*0.32,'#f2ead6');TH.ln(c,[fx+u*0.8,fy+u*1.1],[fx+u*1.6,fy+u*0.4],'#f2ead6',u*0.09);TH.ln(c,[fx+u*1.6,fy+u*1.1],[fx+u*0.8,fy+u*0.4],'#f2ead6',u*0.09);
    TH.blob(c,x-rx*0.8,y+u*0.1,u*1.1,u*0.4,'#5f8f3f',mulberry(v+3),6);}},
  governorHouse:{cat:'struct',rho:0.16,draw(c,x,y,u,v){MIR(c,x,v&8,()=>{const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),w='#f6dc92',wr=shade(w,-0.22),sh='#3f8a6a';CBSH(c,x,y,u*5.8);
    TH.box(c,x,y,u,-4.1,4.1,-2.5,3.3,0,0.3,'#d8d0bc','#b4ab98','#e6dfcd');
    BF(c,I,-3.9,3.9,2.4,0.3,4.8,w);BR(c,I,3.9,-2.4,2.4,0.3,4.8,wr);BFL(c,I,-3.9,3.9,2.4,0.3,4.8,0.42,'rgba(0,0,0,.07)',u);BRL(c,I,3.9,-2.4,2.4,0.3,4.8,0.42,'rgba(0,0,0,.12)',u);
    [-3.0,-1.5,0,1.5,3.0].forEach(X=>{WF(c,I,2.4,X,1.55,0.85,1.2,'#27394d',CBTRIM);WF(c,I,2.4,X-0.6,1.55,0.3,1.2,sh);WF(c,I,2.4,X+0.6,1.55,0.3,1.2,sh);WF(c,I,2.4,X,3.7,0.85,1.3,'#27394d',CBTRIM);WF(c,I,2.4,X-0.6,3.7,0.3,1.3,sh);WF(c,I,2.4,X+0.6,3.7,0.3,1.3,sh);});
    WF(c,I,2.4,0,1.2,1.2,2.0,CBTRIM);WF(c,I,2.4,0,1.15,0.9,1.8,'#2a3a4a');
    [-1.2,0.2].forEach(Y=>{WR(c,I,3.9,Y,1.55,0.9,1.2,'#27394d',CBTRIM);WR(c,I,3.9,Y,3.7,0.9,1.3,'#27394d',CBTRIM);});
    TH.box(c,x,y,u,-3.6,3.6,2.4,3.2,2.45,2.6,'#d8d0bc','#b4ab98','#efe9d8');for(let k=0;k<9;k++){const X=-3.4+k*0.85;TH.ln(c,I(X,3.1,2.6),I(X,3.1,3.4),CBTRIM,u*0.07);}TH.ln(c,I(-3.5,3.1,3.4),I(3.5,3.1,3.4),CBTRIM,u*0.1);
    [-3.5,-1.75,0,1.75,3.5].forEach(X=>{TH.ln(c,I(X,3.1,0.3),I(X,3.1,4.7),CBTRIM,u*0.42);TH.ln(c,I(X+0.12,3.1,0.3),I(X+0.12,3.1,4.7),'rgba(150,140,120,.45)',u*0.12);});
    BP(c,[I(-3.9,3.4,4.7),I(3.9,3.4,4.7),I(3.9,3.4,4.95),I(-3.9,3.4,4.95)],CBTRIM);BP(c,[I(-1.7,3.4,4.95),I(1.7,3.4,4.95),I(0,3.4,6.1)],CBTRIM);BP(c,[I(-1.2,3.4,5.0),I(1.2,3.4,5.0),I(0,3.4,5.8)],'#e8c46a');
    HIP(c,I,-3.9,3.9,-2.4,2.4,4.8,2.6,0.4,'#c4553a','#8a3a28',u,6);}) }},
  jollyRoger:{cat:'ruin',rho:0.05,draw(c,x,y,u,v){CBSH(c,x,y,u*2.4);TH.blob(c,x,y,u*1.6,u*0.6,'#8f8774',mulberry(v+1),8);TH.blob(c,x+u*0.5,y-u*0.2,u*0.9,u*0.4,'#a89f8a',mulberry(v+2),7);
    TH.ln(c,[x,y-u*0.2],[x,y-u*10.2],'#4a3220',u*0.3);TH.ell(c,x,y-u*10.3,u*0.22,u*0.22,'#e8c46a');
    const fx=x,fy=y-u*9.8,w=u*4.4,h=u*3.0;c.fillStyle='#16161a';c.beginPath();c.moveTo(fx,fy);for(let k=0;k<=8;k++){const t=k/8;c.lineTo(fx+w*t,fy+Math.sin(t*5)*u*0.28*t);}for(let k=8;k>=0;k--){const t=k/8;c.lineTo(fx+w*t,fy+h+Math.sin(t*5+0.6)*u*0.28*t);}c.closePath();c.fill();
    const sx=fx+w*0.45,sy=fy+h*0.48;TH.ell(c,sx,sy,u*0.48,u*0.52,'#f2ead6');TH.ell(c,sx-u*0.17,sy-u*0.05,u*0.1,u*0.12,'#16161a');TH.ell(c,sx+u*0.17,sy-u*0.05,u*0.1,u*0.12,'#16161a');TH.ln(c,[sx,sy+u*0.52],[sx,sy+u*0.7],'#f2ead6',u*0.28);TH.ln(c,[sx-u*1.0,sy+u*1.0],[sx+u*1.0,sy+u*0.05],'#f2ead6',u*0.14);TH.ln(c,[sx+u*1.0,sy+u*1.0],[sx-u*1.0,sy+u*0.05],'#f2ead6',u*0.14);}},
  marketStall:{cat:'ruin',rho:0.09,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),A=CBP[v&7],B=CBP[(v+2)&7];CBSH(c,x,y,u*3.4);
    [[-2,-1.1],[2,-1.1]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(X,Y,3.0),'#8a6a44',u*0.28));
    TH.box(c,x,y,u,-1.9,1.9,-1.1,-0.8,0,2.2,'#6a4a2c','#4a3220','#7a5a3a');TH.box(c,x,y,u,-2.0,2.0,0.1,1.0,0,1.2,'#a8683a','#7a4a28','#c28050');TH.box(c,x,y,u,-2.1,2.1,0.0,1.1,1.2,1.4,'#c9a65a','#a08040','#e0c07a');
    [['#f2d640',-1.2],['#e0483a',-0.4],['#f08a24',0.4],['#7ac04a',1.2]].forEach(([col,dx])=>{const p=I(dx,0.55,1.4);for(let k=0;k<4;k++)TH.ell(c,p[0]+(k%2-0.5)*u*0.5,p[1]-u*0.16*Math.floor(k/2)-u*0.1,u*0.3,u*0.26,k%2?col:shade(col,-0.12));});
    [[-2,1.1],[2,1.1]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(X,Y,3.0),'#a8845a',u*0.28));
    for(let k=0;k<8;k++){const t0=k/8,t1=(k+1)/8,a=I(-2.4+4.8*t0,1.6,2.6),b=I(-2.4+4.8*t1,1.6,2.6),a2=I(-2.4+4.8*t0,-1.3,3.5),b2=I(-2.4+4.8*t1,-1.3,3.5),col=k%2?A:'#fbf6ea';TH.poly(c,[a,b,b2,a2],col);TH.poly(c,[a,b,[(a[0]+b[0])/2,a[1]+u*0.45]],col);}}},
  cannonBattery:{cat:'ruin',rho:0.1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);CBSH(c,x,y,u*4.2);
    TH.box(c,x,y,u,-2.8,2.8,-0.9,0.1,0,1.5,'#b4ab98','#8f8774','#cfc6b0');for(let k=0;k<5;k++){const X=-2.6+k*1.15;TH.box(c,x,y,u,X,X+0.55,-0.9,0.1,1.5,2.0,'#b4ab98','#8f8774','#cfc6b0');}
    for(let k=0;k<4;k++)TH.ln(c,I(-2.8,0.1,0.4+k*0.35),I(2.8,0.1,0.4+k*0.35),'rgba(60,52,40,.25)',u*0.05);
    [-1.2,1.5].forEach((X,i)=>{const b0=I(X-0.5,1.3,0.9),b1=I(X+0.9,0.6,1.35);TH.ln(c,b0,b1,'#1e1c20',u*0.62);TH.ell(c,b1[0],b1[1],u*0.34,u*0.26,'#101012');const w=I(X,1.3,0.45);TH.ell(c,w[0],w[1],u*0.5,u*0.5,'#4a3220');TH.ell(c,w[0],w[1],u*0.18,u*0.18,'#2a1a10');const w2=I(X+0.9,1.9,0.45);TH.ell(c,w2[0],w2[1],u*0.5,u*0.5,'#4a3220');TH.ell(c,w2[0],w2[1],u*0.18,u*0.18,'#2a1a10');});
    [[0,2.1],[0.4,2.2],[-0.4,2.2],[0.2,2.4]].forEach(([X,Y],i)=>{const p=I(2.6+X*0.4,Y+0.1,0.3+(i>2?0.45:0));TH.ell(c,p[0],p[1],u*0.26,u*0.26,'#2a2a30');TH.ell(c,p[0]-u*0.07,p[1]-u*0.08,u*0.08,u*0.08,'#5a5a64');});}},
  wreckedShip:{cat:'ruin',rho:0.14,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x,y+u*0.3,u*5.0,u*1.5,'rgba(190,160,100,.55)');CBSH(c,x,y,u*4.8);
    TH.ln(c,I(-3.8,0,0.15),I(3.8,0,0.15),'#4a3220',u*0.4);
    for(let k=0;k<7;k++){const X=-3.2+k*1.05,h=1.2+1.9*Math.sin(Math.PI*(k+0.7)/7.6),wd=0.5+0.95*Math.sin(Math.PI*(k+0.7)/7.6);c.strokeStyle=k%2?'#6a4a2c':'#7a5a3a';c.lineWidth=u*0.3;c.lineCap='round';const a=I(X,-wd,h),m=I(X,0,0.15),b=I(X,wd,h),cc=I(X,0,-0.7);c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo(cc[0],cc[1]+u*0.2,b[0],b[1]);c.stroke();}
    for(let k=0;k<3;k++){const Z=0.55+k*0.5;TH.ln(c,I(-2.6,1.0-k*0.18,Z),I(2.4,1.0-k*0.18,Z),'#8a6a44',u*0.22);}
    TH.ln(c,I(-3.8,0,0.2),I(-4.3,0,2.2),'#5a3e28',u*0.4);TH.ln(c,I(3.8,0,0.2),I(4.2,0,1.2),'#5a3e28',u*0.34);
    TH.ln(c,I(0.2,0,0.3),I(1.1,-0.3,6.4),'#4a3220',u*0.3);TH.poly(c,[I(1.1,-0.3,6.2),I(1.1,-0.3,3.8),I(0.9,0.6,3.4),I(0.9,0.6,5.6)],'rgba(232,224,200,.85)');TH.ln(c,I(1.1,-0.3,6.2),I(0.9,0.6,5.6),'#4a3220',u*0.12);}},
  stoneWell:{cat:'ruin',rho:0.05,draw(c,x,y,u,v){CBSH(c,x,y,u*2.2);const rx=1.5*u,ry=0.75*u;TKB2(c,x,y,rx,ry,1.4*u);TH.ell(c,x,y-1.4*u,rx,ry,'#cfc6b0');TH.ell(c,x,y-1.4*u,rx*0.76,ry*0.76,'#1e2a30');
    [-1,1].forEach(s=>TH.ln(c,[x+s*rx*0.85,y-1.2*u],[x+s*rx*0.85,y-3.6*u],'#6a4a2c',u*0.26));
    TH.poly(c,[[x-rx*1.15,y-3.5*u],[x,y-5.0*u],[x+rx*1.15,y-3.5*u]],'#a8442e');TH.ln(c,[x-rx*1.15,y-3.5*u],[x+rx*1.15,y-3.5*u],'#6a2a1a',u*0.12);TH.ln(c,[x,y-3.5*u],[x,y-2.4*u],'#d8c27c',u*0.06);TH.poly(c,[[x-u*0.28,y-2.4*u],[x+u*0.28,y-2.4*u],[x+u*0.22,y-1.8*u],[x-u*0.22,y-1.8*u]],'#6a4a2c');}},
  rowboat:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);CBSH(c,x,y,u*3.4);
    const pts=[],pts2=[];for(let k=0;k<=14;k++){const t=k/14,X=-2.6+5.2*t,hw=0.8*Math.pow(Math.sin(Math.PI*t),0.5);pts.push(I(X,-hw,0.5));pts2.push(I(X,hw,0.5));}
    c.fillStyle='#4a3220';c.beginPath();pts2.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));pts2.slice().reverse().forEach(p=>c.lineTo(p[0],p[1]+u*0.55));c.closePath();c.fill();
    c.fillStyle=v&1?'#2f6aa8':'#c8402a';c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));pts2.slice().reverse().forEach(p=>c.lineTo(p[0],p[1]));c.closePath();c.fill();
    c.fillStyle='#2a1a10';c.beginPath();for(let k=1;k<=13;k++){const t=k/14,X=-2.6+5.2*t,hw=0.8*Math.pow(Math.sin(Math.PI*t),0.5)*0.74,p=I(X,-hw,0.52);k===1?c.moveTo(p[0],p[1]):c.lineTo(p[0],p[1]);}for(let k=13;k>=1;k--){const t=k/14,X=-2.6+5.2*t,hw=0.8*Math.pow(Math.sin(Math.PI*t),0.5)*0.74,p=I(X,hw,0.52);c.lineTo(p[0],p[1]);}c.closePath();c.fill();
    [-1,0.4].forEach(X=>TH.ln(c,I(X,-0.7,0.55),I(X,0.7,0.55),'#8a6a44',u*0.16));[[-0.4,-1.0],[0.8,-0.9]].forEach(([X,Y])=>{TH.ln(c,I(X,Y,0.6),I(X+0.3,Y-0.2,2.6),'#6a4a2c',u*0.12);});}},
  lighthouse:{cat:'struct',rho:0.09,draw(c,x,y,u,v){CBSH(c,x,y,u*3.4);TH.box(c,x,y,u,-1.9,1.9,-1.5,1.5,0,1.6,'#e8e0cc','#b4ab98','#f4eede');TH.poly(c,[TH.iso(x,y,u,-0.4,1.5,0),TH.iso(x,y,u,0.4,1.5,0),TH.iso(x,y,u,0.4,1.5,1.2),TH.iso(x,y,u,-0.4,1.5,1.2)],'#6a4a2c');
    const by=y-1.6*u,H=u*8.2,rb=1.5*u,rt=1.0*u;for(let k=0;k<5;k++){const f0=k/5,f1=(k+1)/5,y0=by-H*f0,y1=by-H*f1,r0=rb+(rt-rb)*f0,r1=rb+(rt-rb)*f1,col=k%2?'#f6f2e6':'#d8452e';const g=c.createLinearGradient(x-r0,0,x+r0,0);g.addColorStop(0,shade(col,0.12));g.addColorStop(0.55,col);g.addColorStop(1,shade(col,-0.3));c.fillStyle=g;c.beginPath();c.moveTo(x-r0,y0);c.lineTo(x-r1,y1);c.ellipse(x,y1,r1,r1*0.5,0,Math.PI,0,true);c.lineTo(x+r0,y0);c.ellipse(x,y0,r0,r0*0.5,0,0,Math.PI,false);c.closePath();c.fill();}
    const ty=by-H;TH.ell(c,x,ty,rt*1.4,rt*0.7,'#2a2a30');TH.ln(c,[x-rt*1.35,ty],[x+rt*1.35,ty],'#2a2a30',u*0.3);const lg=c.createLinearGradient(0,ty-u*2.2,0,ty);lg.addColorStop(0,'#fff6c0');lg.addColorStop(1,'#ffd460');c.fillStyle=lg;c.fillRect(x-rt*0.7,ty-u*2.1,rt*1.4,u*2.1);GLOW(c,x,ty-u*1.1,u*4.5,'255,220,120',0.32);
    c.strokeStyle='#2a2a30';c.lineWidth=u*0.1;c.strokeRect(x-rt*0.7,ty-u*2.1,rt*1.4,u*2.1);TH.poly(c,[[x-rt*0.9,ty-u*2.1],[x,ty-u*3.4],[x+rt*0.9,ty-u*2.1]],'#d8452e');TH.ln(c,[x,ty-u*3.4],[x,ty-u*4.1],'#2a2a30',u*0.1);}},
  barrels:{cat:'prop',rho:0.05,draw(c,x,y,u,v){CBSH(c,x,y,u*2.0);[[-0.8,0.1],[0.7,0.2],[0,-0.55]].forEach(([dx,dy],i)=>{TKB(c,x+dx*u*1.2,y+dy*u*1.0,u*0.7,u*(1.5-(i===2?0.1:0)));});}},
  treasureChest:{cat:'prop',rho:0.05,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);CBSH(c,x,y,u*2.0);TH.box(c,x,y,u,-0.9,0.9,-0.6,0.6,0,0.9,'#7a4a28','#4a2a18','#8a5a32');
    c.fillStyle='#8a5a32';c.beginPath();const a=I(-0.9,0.6,0.9),b=I(0.9,0.6,0.9);c.moveTo(a[0],a[1]);c.quadraticCurveTo((a[0]+b[0])/2,a[1]-u*1.0,b[0],b[1]);c.lineTo(b[0],b[1]+u*0.1);c.lineTo(a[0],a[1]+u*0.1);c.closePath();c.fill();TH.ln(c,I(-0.9,0.6,0.5),I(0.9,0.6,0.5),'#e8c46a',u*0.1);TH.poly(c,[I(-0.15,0.6,0.35),I(0.15,0.6,0.35),I(0.15,0.6,0.7),I(-0.15,0.6,0.7)],'#e8c46a');
    [[-0.5,0.3],[0,0.4],[0.4,0.2],[0.2,0.5]].forEach(([X,Y],i)=>{const p=I(X,Y,0.95);TH.ell(c,p[0],p[1],u*0.2,u*0.13,i%2?'#ffd650':'#e8b030');});}},
  ropeLantern:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(40,50,30,.24)');TH.ln(c,[x,y],[x,y-u*3.4],'#6a4a2c',u*0.3);TH.ln(c,[x,y-u*3.3],[x+u*0.8,y-u*3.3],'#6a4a2c',u*0.18);TH.ln(c,[x+u*0.8,y-u*3.3],[x+u*0.8,y-u*3.0],'#3a2a18',u*0.06);GLOW(c,x+u*0.8,y-u*2.6,u*1.7,'255,190,90',0.5);TH.poly(c,[[x+u*0.55,y-u*3.0],[x+u*1.05,y-u*3.0],[x+u*1.0,y-u*2.2],[x+u*0.6,y-u*2.2]],'#ffd27a','#3a2a18',u*0.06);TH.ell(c,x+u*0.8,y-u*2.5,u*0.12,u*0.2,'#fff6c0');}},
  anchor:{cat:'prop',rho:0.05,draw(c,x,y,u,v){CBSH(c,x,y,u*1.6);c.strokeStyle='#3a3a42';c.lineCap='round';c.lineWidth=u*0.3;c.beginPath();c.moveTo(x,y-u*3.0);c.lineTo(x,y-u*0.2);c.stroke();c.beginPath();c.arc(x,y-u*1.2,u*1.2,0.2,Math.PI-0.2);c.stroke();c.beginPath();c.moveTo(x-u*0.7,y-u*2.4);c.lineTo(x+u*0.7,y-u*2.4);c.stroke();TH.ell(c,x,y-u*3.2,u*0.32,u*0.32,'#3a3a42');c.strokeStyle='#6a4a2c';c.lineWidth=u*0.12;c.beginPath();c.moveTo(x+u*0.2,y-u*3.3);c.quadraticCurveTo(x+u*1.2,y-u*2.2,x+u*0.6,y-u*0.8);c.stroke();}},
  bougainvillea:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+1),col=['#e0307a','#f06aa8','#f08a24','#b04ae0'][v&3];TH.ell(c,x+u*0.3,y+u*0.1,u*1.4,u*0.4,'rgba(40,50,30,.24)');
    [[0,-1.5,1.3,0.95],[-1.0,-1.0,1.0,0.75],[1.0,-1.0,1.0,0.75]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#2f7a3a','#3f8a45','#4f9a50'][i],r,8));
    for(let k=0;k<26;k++){const fx=x+(r()-0.5)*u*2.8,fy=y-u*(0.5+r()*2.2);TH.ell(c,fx,fy,u*0.2,u*0.16,k%4?col:shade(col,0.25),r()*3);}}},
  /* ---------- terrain: grassy island hills, limestone sea-cliffs, coral rocks ---------- */
  isleHill:{cat:'rock',rho:0.2,draw(c,x,y,u,v){const r=mulberry(v*7+3);CBSH(c,x,y,u*5.6);const W=5.2*u,H=5.6*u;
    const body=()=>{c.beginPath();c.moveTo(x-W,y);c.bezierCurveTo(x-W*0.85,y-H*0.95,x-W*0.1,y-H*1.15,x+W*0.35,y-H*0.98);c.bezierCurveTo(x+W*0.85,y-H*0.78,x+W*1.0,y-H*0.2,x+W,y);c.ellipse(x,y,W,W*0.3,0,0,Math.PI,false);c.closePath();};
    body();const g=c.createLinearGradient(0,y-H,0,y+u);g.addColorStop(0,'#a8e070');g.addColorStop(0.5,'#72b84c');g.addColorStop(1,'#4f9440');c.fillStyle=g;c.fill();
    c.save();body();c.clip();
    const sg=c.createLinearGradient(x-W,0,x+W,0);sg.addColorStop(0,'rgba(255,255,200,.14)');sg.addColorStop(0.5,'rgba(0,0,0,0)');sg.addColorStop(1,'rgba(20,60,30,.42)');c.fillStyle=sg;c.fillRect(x-W-2,y-H*1.2,W*2+4,H*1.4);
    for(let k=0;k<7;k++){TH.blob(c,x+(r()-0.5)*W*1.5,y-H*(0.15+r()*0.65),u*(0.9+r()*1.1),u*(0.5+r()*0.5),['#5aa040','#68b048','#4a9038'][k%3],r,7);}
    /* winding sand footpath up the face */
    c.lineCap='round';const pp=()=>{c.beginPath();c.moveTo(x-W*0.12,y+u*0.5);c.bezierCurveTo(x-W*0.5,y-H*0.18,x+W*0.3,y-H*0.35,x-W*0.05,y-H*0.62);c.bezierCurveTo(x-W*0.25,y-H*0.78,x+W*0.05,y-H*0.86,x+W*0.1,y-H*0.95);};pp();c.strokeStyle='rgba(120,100,60,.4)';c.lineWidth=u*0.78;c.stroke();pp();c.strokeStyle='#e8d8a6';c.lineWidth=u*0.55;c.stroke();pp();c.strokeStyle='#f4ead0';c.lineWidth=u*0.2;c.stroke();
    /* pale limestone outcrops */
    [[-2.6,-1.6,1.0],[2.4,-2.2,0.8],[0.9,-3.6,0.7]].forEach(([dx,dy,s])=>{const px=x+dx*u,py=y+dy*u;TH.poly(c,[[px-u*s,py],[px-u*s*0.7,py-u*s*0.8],[px+u*s*0.3,py-u*s*1.0],[px+u*s,py-u*s*0.2],[px+u*s*0.8,py+u*s*0.2]],'#e0d6b8');TH.poly(c,[[px+u*s*0.3,py-u*s*1.0],[px+u*s,py-u*s*0.2],[px+u*s*0.8,py+u*s*0.2],[px+u*s*0.2,py+u*s*0.1]],'#b8aa86');});
    for(let k=0;k<70;k++){const px=x+(r()*2-1)*W*0.9,py=y-r()*H*0.95,h=u*(0.18+r()*0.2);TH.ln(c,[px,py],[px+(r()-0.5)*h,py-h],r()<0.5?'#8fcf5a':'#4f9a3c',u*0.07);}
    c.restore();
    /* crest palms */
    [[-0.5,-1.0,-0.6],[0.9,-0.9,0.5],[-1.5,-0.55,-0.4]].forEach(([dx,dh,lean],i)=>{const bx=x+dx*u*1.0+(i?0:u*0.1),by=y-H*(0.98-(i===2?0.08:0)-(i===1?0.03:0))+i*u*0.1,h=u*(3.6-i*0.5);c.lineCap='round';c.strokeStyle='#b8a47a';c.lineWidth=u*0.4;c.beginPath();c.moveTo(bx,by);c.quadraticCurveTo(bx+lean*u*0.4,by-h*0.5,bx+lean*u,by-h);c.stroke();const px=bx+lean*u,py=by-h;for(let k=0;k<7;k++){const a=-Math.PI+0.1+k/6*(Math.PI-0.2),l=u*(1.7+r()*0.3);c.strokeStyle=k%2?'#58b038':'#3f9a30';c.lineWidth=u*0.36;c.beginPath();c.moveTo(px,py);c.quadraticCurveTo(px+Math.cos(a)*l*0.55,py+Math.sin(a)*l*0.7-l*0.2,px+Math.cos(a)*l,py+Math.sin(a)*l*0.55+l*0.4);c.stroke();}TH.ell(c,px,py+u*0.1,u*0.3,u*0.28,'#8a6a44');});}},
  limestoneCliff:{cat:'rock',rho:0.17,draw(c,x,y,u,v){const r=mulberry(v*5+1);CBSH(c,x,y,u*5.2);const W=3.6*u,H=6.0*u,dx=1.7*u,dy=-0.85*u;
    /* right (shaded) side face */
    TH.poly(c,[[x+W,y],[x+W+dx,y+dy],[x+W+dx*0.9,y+dy-H*0.9],[x+W,y-H]],'#a79a76');
    /* front face with an irregular top edge */
    const top=[[x-W,y-H*0.88],[x-W*0.7,y-H*1.02],[x-W*0.3,y-H*0.94],[x+W*0.1,y-H*1.06],[x+W*0.5,y-H*0.96],[x+W,y-H]];
    const face=()=>{c.beginPath();c.moveTo(x-W,y);top.forEach(p=>c.lineTo(p[0],p[1]));c.lineTo(x+W,y);c.closePath();};
    face();const g=c.createLinearGradient(x-W,0,x+W,0);g.addColorStop(0,'#f0e8d0');g.addColorStop(0.55,'#dcd0ae');g.addColorStop(1,'#bfb08a');c.fillStyle=g;c.fill();
    c.save();face();c.clip();
    for(let k=1;k<6;k++){const yy=y-H*k/6.4;c.strokeStyle=k%2?'rgba(150,130,90,.38)':'rgba(255,255,240,.35)';c.lineWidth=u*(k%2?0.14:0.1);c.beginPath();c.moveTo(x-W,yy);for(let s=1;s<=8;s++)c.lineTo(x-W+2*W*s/8,yy+Math.sin(s*1.7+k)*u*0.18);c.stroke();}
    for(let k=0;k<5;k++){const cx0=x-W*0.8+r()*W*1.6,cy0=y-H*(0.15+r()*0.7);c.strokeStyle='rgba(90,75,50,.4)';c.lineWidth=u*0.09;c.beginPath();c.moveTo(cx0,cy0);c.lineTo(cx0+(r()-0.5)*u*0.8,cy0-u*(0.8+r()*1.2));c.stroke();}
    for(let k=0;k<26;k++){TH.ell(c,x+(r()*2-1)*W,y-r()*H,u*(0.05+r()*0.1),u*0.05,'rgba(120,100,70,.28)');}
    c.restore();
    /* cave mouth */
    c.fillStyle='#1e1810';c.beginPath();c.moveTo(x-W*0.45,y);c.quadraticCurveTo(x-W*0.45,y-u*2.0,x-W*0.1,y-u*2.1);c.quadraticCurveTo(x+W*0.2,y-u*2.0,x+W*0.2,y);c.closePath();c.fill();c.strokeStyle='#a89a74';c.lineWidth=u*0.2;c.stroke();
    /* grass cap + vines + flowering ledge */
    c.fillStyle='#78bc4c';c.beginPath();c.moveTo(x-W,y-H*0.88);top.forEach(p=>c.lineTo(p[0],p[1]-u*0.05));c.lineTo(x+W+dx*0.9,y+dy-H*0.9);c.lineTo(x+W+dx*0.7,y+dy-H*0.9-u*0.7);c.lineTo(x-W*0.6,y-H-u*1.0);c.lineTo(x-W*0.95,y-H*0.88-u*0.5);c.closePath();c.fill();
    c.fillStyle='rgba(255,255,200,.18)';c.beginPath();c.ellipse(x-W*0.3,y-H-u*0.4,W*0.5,u*0.5,0,0,7);c.fill();
    for(let k=0;k<6;k++)TH.blob(c,x+(r()*2-1)*W*0.95,y-H*(0.98+r()*0.04)-u*0.3,u*(0.7+r()*0.6),u*(0.45+r()*0.3),['#4f9a3c','#5fae48','#3f8a34'][k%3],r,7);
    for(let k=0;k<5;k++){const vx=x-W*0.9+r()*W*1.8,vy=y-H*0.95;TH.ln(c,[vx,vy],[vx+(r()-0.5)*u*0.2,vy+u*(1.0+r()*2.0)],'#4f9a3c',u*0.1);}
    [[-1.8,0.54],[0.3,0.4],[2.1,0.62]].forEach(([dxx,hf],i)=>{for(let k=0;k<5;k++)TH.ell(c,x+dxx*u+(k-2)*u*0.22,y-H*hf-u*0.15+(k%2)*u*0.1,u*0.15,u*0.12,['#e0307a','#f06aa8','#f08a24'][(k+i)%3]);});
    /* one palm leaning off the top */
    const bx=x+W*0.35,by=y-H*1.0,h=u*3.2;c.lineCap='round';c.strokeStyle='#b8a47a';c.lineWidth=u*0.36;c.beginPath();c.moveTo(bx,by);c.quadraticCurveTo(bx-u*0.5,by-h*0.5,bx-u*0.9,by-h);c.stroke();const px=bx-u*0.9,py=by-h;for(let k=0;k<7;k++){const a=-Math.PI+0.1+k/6*(Math.PI-0.2),l=u*1.6;c.strokeStyle=k%2?'#58b038':'#3f9a30';c.lineWidth=u*0.34;c.beginPath();c.moveTo(px,py);c.quadraticCurveTo(px+Math.cos(a)*l*0.55,py+Math.sin(a)*l*0.7-l*0.2,px+Math.cos(a)*l,py+Math.sin(a)*l*0.55+l*0.4);c.stroke();}
    /* rubble at the foot */
    [[-3.6,0.2,0.8],[-2.8,0.5,0.5],[3.4,0.3,0.7]].forEach(([dxx,dyy,s])=>{const px=x+dxx*u,py=y+dyy*u;TH.poly(c,[[px-u*s,py],[px-u*s*0.6,py-u*s*0.8],[px+u*s*0.4,py-u*s*0.9],[px+u*s,py-u*s*0.1],[px+u*s*0.6,py+u*s*0.2]],'#d8ccaa');TH.poly(c,[[px+u*s*0.4,py-u*s*0.9],[px+u*s,py-u*s*0.1],[px+u*s*0.6,py+u*s*0.2],[px+u*s*0.1,py+u*s*0.1]],'#a89a74');});}},
  coralRocks:{cat:'rock',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.8,'#e6dcc0'],[0.8,0.2,0.8,0.7,'#d4c8a6'],[0,-0.35,0.7,0.6,'#efe6cc']].forEach(([dx,dy,rx,ry,col])=>{const px=x+dx*u,py=y+dy*u,sx=u*rx,sy=u*ry*(1+r()*0.2);TH.ell(c,px+sx*0.15,py+sy*0.3,sx*1.05,sy*0.45,'rgba(40,50,30,.26)');TH.poly(c,[[px-sx,py],[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px-sx*0.6,py+sy*0.2]],col);TH.poly(c,[[px+sx*0.25,py-sy*0.98],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px+sx*0.2,py+sy*0.05]],shade(col,-0.22));for(let k=0;k<4;k++)TH.ell(c,px-sx*0.4+r()*sx*0.9,py-sy*0.5+r()*sy*0.5,u*0.07,u*0.05,'rgba(120,100,70,.4)');});TH.blob(c,x-u*1.0,y+u*0.25,u*0.5,u*0.2,'#5f9a44',r,6);}},
  /* ---------- shared with Tiki ---------- */
  hibiscus:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+1),col=['#e0303a','#f08a24','#f4a6cb','#f2d640'][v&3];TH.ell(c,x+u*0.3,y+u*0.1,u*1.3,u*0.4,'rgba(12,40,22,.24)');
    [[0,-1.6,1.2,0.9],[-0.9,-1.1,0.9,0.7],[0.9,-1.1,0.9,0.7]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#2f7a3a','#3f8a45','#4f9a50'][i],r,8));
    for(let k=0;k<7;k++){const fx=x+(r()-0.5)*u*2.2,fy=y-u*(0.8+r()*1.7);for(let p=0;p<5;p++){const a=p/5*6.283;TH.ell(c,fx+Math.cos(a)*u*0.24,fy+Math.sin(a)*u*0.2,u*0.2,u*0.16,col);}TH.ell(c,fx,fy,u*0.1,u*0.1,'#ffe27a');}}},
  birdOfParadise:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*7+3);TH.ell(c,x+u*0.3,y+u*0.1,u*1.2,u*0.36,'rgba(12,40,22,.24)');
    for(let k=0;k<5;k++){const a=(k/4-0.5)*1.3,l=u*(2.0+r()*0.8);c.save();c.translate(x+(k-2)*u*0.2,y);c.rotate(a);c.fillStyle=k%2?'#3a8a45':'#2f7a3a';c.beginPath();c.ellipse(0,-l*0.55,u*0.5,l*0.55,0,0,7);c.fill();TH.ln(c,[0,0],[0,-l*1.05],'#8fcf6a',u*0.05);c.restore();}
    for(let k=0;k<3;k++){const fx=x+(k-1)*u*0.9,fy=y-u*(2.6+(k%2)*0.5);TH.ln(c,[fx,y-u*0.8],[fx,fy+u*0.3],'#4f9a50',u*0.12);TH.poly(c,[[fx-u*0.5,fy],[fx,fy-u*0.9],[fx+u*0.5,fy],[fx,fy+u*0.25]],'#f08a24');TH.poly(c,[[fx-u*0.15,fy],[fx+u*0.45,fy-u*0.35],[fx+u*0.2,fy+u*0.15]],'#2a6ad8');TH.poly(c,[[fx-u*0.1,fy-u*0.2],[fx+u*0.05,fy-u*0.75],[fx+u*0.2,fy-u*0.15]],'#c8402a');}}},
  parrotPerch:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.9,u*0.26,'rgba(12,40,22,.24)');TH.ln(c,[x,y],[x,y-u*3.8],'#7a5230',u*0.34);TH.ln(c,[x-u*1.2,y-u*3.5],[x+u*1.3,y-u*3.4],'#4a2e1a',u*0.2);
    [[-0.8,'#c8402a','#2a6ad8'],[0.9,'#2a6ad8','#f2b630']].forEach(([dx,body,wing],i)=>{const px=x+dx*u,py=y-u*3.5;TH.ln(c,[px,py],[px+(i?u*0.2:-u*0.2),py+u*1.2],body,u*0.14);TH.ell(c,px,py-u*0.7,u*0.45,u*0.8,body);TH.ell(c,px+(i?u*0.25:-u*0.25),py-u*0.6,u*0.25,u*0.6,wing);TH.ell(c,px,py-u*1.6,u*0.36,u*0.34,body);TH.poly(c,[[px+u*0.2,py-u*1.65],[px+u*0.62,py-u*1.5],[px+u*0.22,py-u*1.38]],'#f6efe0');TH.ell(c,px+u*0.05,py-u*1.7,u*0.07,u*0.07,'#1a120a');});}},
};
/* ===== MACRO-LAND ENGINE (hex geometry, path network, planner, baker) ===== */
const W3=Math.sqrt(3),HX=W3/2,HV=[[HX,0.29],[0,0.58],[-HX,0.29],[-HX,-0.29],[0,-0.58],[HX,-0.29]];
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[0,1,2],[-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5,1.5]],C:[[0],[-0.5,0.5,1.5],[-1,0,1],[-0.5]],D:[[0,1,2],[-0.5,0.5,1.5],[0,1]]};
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

/* ===== CARIBBEAN LAND: planner (palm groves + a colour-cycled harbour village), sunny sand-and-lawn ground, generic baker ===== */
const CARIB_REGION={top:{palm:.38,broadleaf:.22,fanPalm:.14,jungleBush:.2,ceiba:.02},mid:{palm:.36,broadleaf:.2,fanPalm:.16,jungleBush:.18,ceiba:.02},bottom:{palm:.3,fanPalm:.22,jungleBush:.24,broadleaf:.14}};
const CARIB_LOW=[['jungleBush',1],['fanPalm',1],['jungleBush',1.2],['broadleaf',0.62],['palm',0.6],['fanPalm',1.15],['broadleaf',0.7]];            /* short species only in the foreground so a house's front is never hidden */
const CARIB_CAP={ceiba:2};
const CARIB_UNDER=['bougainvillea','hibiscus','birdOfParadise','flowerBush','bougainvillea','fern','banana','heliconia','hibiscus','jungleGrass'];
const CARIB_PLAN_CACHE={};
function getCaribPlan(shape){
  if(CARIB_PLAN_CACHE[shape])return CARIB_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(({A:14101,B:14202,C:14318,D:14419})[shape]),placed=[],bb=G.bbox,used={},A=CARIB_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  /* stretched sweet spots: the slot ellipse itself is still sacred, but scenery may now creep right up to it (West kept a much wider margin) */
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho,o2)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.72);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'broadleaf';};
  const capOk=k=>!(CARIB_CAP[k]&&(used[k]||0)>=CARIB_CAP[k]);
  const regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?CARIB_REGION.top:n<0.68?CARIB_REGION.mid:CARIB_REGION.bottom;};
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='tree'?0.88+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;if((D.cat==='struct'||D.cat==='ruin')&&!G.centers.some(c=>hexInside(px-c.x,py-c.y,(extra&&extra.edge)?1.12:1.0)))continue;if((D.cat==='rock'||D.cat==='shrub'||D.cat==='prop'||(D.cat==='tree'&&!extra))&&placed.some(o=>o.noSouth&&Math.abs(px-o.x)<0.3&&py-o.y>-0.05&&py-o.y<0.36))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const tree=(x,y,extra,dom,low)=>{if(rng()<0.34)return null;if(low){const L=CARIB_LOW[Math.floor(rng()*CARIB_LOW.length)];return place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return place(dom&&rng()<0.55&&capOk(dom)?dom:pickFrom(regionOf(y),capOk),x,y,extra||{});};
  const under=(x,y,extra)=>place(CARIB_UNDER[Math.floor(rng()*CARIB_UNDER.length)],x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const LKS=G.centers.length/12,landThin=l=>{const n=Math.max(1,Math.round(l.length*LKS));return Array.from({length:n},(_,i)=>l[Math.floor((i+0.5)*l.length/n)]);},landCnt=n=>Math.max(1,Math.round(n*LKS));
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. the back rim: the fort tower stands behind the middle (tier 1), palms and boulders along the rest, and a striped lighthouse at one end (tier 3) */
  {const pts=[];top.forEach(e=>[0.2,0.5,0.8].forEach(t=>pts.push(onEdge(e,t,0.0))));pts.sort((a,b)=>a[0]-b[0]);const x0=pts[0][0],x1=pts[pts.length-1][0],nearest=x=>pts.reduce((b,p)=>Math.abs(p[0]-x)<Math.abs(b[0]-x)?p:b);
    const centers=[];let x=x0+0.12+rng()*0.2;while(x<x1-0.05){centers.push(x);x+=0.8+rng()*0.55;}
    let hills=0,cliffs=0;const fort=Math.floor(centers.length*0.5),lh=centers.length>3?(fort>=centers.length/2?0:centers.length-1):-1;
    centers.forEach((cxp,i)=>{const p=nearest(cxp),bx=p[0],by=p[1],t=rng(),mt=a=>a+(rng()<0.35?1:0),at=(k,dx,dy,ex)=>place(k,bx+dx,by+dy,ex);
      if(i===fort){at('fortTower',0,-0.04,{minT:1,scale:1.0,clear:2.2,noSouth:true,edge:true});at('palm',-0.62,0.02,{minT:1,scale:1.1});at('palm',0.66,0.03,{minT:2,scale:1.05});at('coralRocks',-0.25,0.1,{minT:1});}
      else if(i===lh){at('lighthouse',0,-0.02,{minT:3,scale:1.05,clear:2.0,noSouth:true,edge:true});at('palm',-0.5,0.02,{minT:1});at('fanPalm',0.5,0.03,{minT:2});at('coralRocks',0.2,0.1,{minT:2});}
      else if(t<0.34&&hills<2){hills++;at('isleHill',0,0.02,{minT:mt(1),scale:1.0,clear:1.4});at('palm',-0.7,0.02,{minT:2,scale:1.05});at('coralRocks',0.6,0.1,{minT:1});}
      else if(t<0.62&&cliffs<2){cliffs++;at('limestoneCliff',0,0.0,{minT:mt(2),scale:1.0,clear:1.3});at('fanPalm',-0.62,0.04,{minT:2});at('coralRocks',0.52,0.1,{minT:2});}
      else if(t<0.8){at('palm',-0.3,0.0,{minT:mt(1),scale:1.1});at('palm',0.2,-0.02,{minT:mt(2),scale:1.1});at('fanPalm',0.55,0.01,{minT:3,scale:0.9});at('coralRocks',0.02,0.1,{minT:1});}
      else{at('fanPalm',-0.25,0.01,{minT:mt(1)});at('palm',0.3,0.0,{minT:2,scale:1.15});at('jungleBush',0.0,-0.02,{minT:3,scale:0.9});at('coralRocks',-0.05,0.1,{minT:1});}});
    {const gaps=[];for(let i=0;i+1<centers.length;i++)if(i!==fort&&i+1!==fort)gaps.push(i);if(!gaps.length)for(let i=0;i+1<centers.length;i++)gaps.push(i);
      [gaps[0],gaps[gaps.length-1]].filter((g,i,a)=>g!==undefined&&a.indexOf(g)===i).forEach((gi,k)=>{const p=nearest((centers[gi]+centers[gi+1])/2);place('ceiba',p[0],p[1]-0.06,{minT:k?4:3,scale:0.95,clear:1.3});});}}
  /* 2. the harbour village: creole houses, a tavern and a governor's mansion, then market stalls, cannon batteries, wrecks and boats (farthest-point spacing so nothing clumps) */
  const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,-0.16))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.forEach(e=>inn.push([e.mid[0],e.mid[1]]));
  const chosen=placed.filter(o=>o.cat==='ruin'||o.cat==='struct').map(o=>[o.x,o.y]);
  const spread=(k,pool,extra)=>{const ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.22})).sort((a,b)=>b.d-a.d);for(let n=0;n<Math.min(12,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],extra);if(o){chosen.push([o.x,o.y]);return o;}}return null;};
  landThin([['creoleHouse',1],['creoleHouse2',2],['pirateTavern',3],['creoleHouse',4],['creoleHouse2',4]]).forEach(([k,mt])=>spread(k,rim,{minT:mt,scale:1.28,clear:2.6,noSouth:true}));
  landThin([['creoleHouse2',2],['creoleHouse',3],['governorHouse',4],['pirateTavern',4]]).forEach(([k,mt])=>spread(k,inn,{minT:mt,scale:k==='governorHouse'?1.15:1.2,clear:2.9,noSouth:true}));
  landThin([['marketStall',1],['jollyRoger',1],['cannonBattery',2],['stoneWell',2],['rowboat',3],['wreckedShip',3],['marketStall',3],['cannonBattery',4],['rowboat',4],['marketStall',4]]).forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,scale:1.1,clear:1.8,noSouth:true}));
  /* every house gets its own colour (0,3,6,1,4,7,2,5 never repeats next to itself) and an alternating facing */
  {const hs=placed.filter(o=>o.kind==='creoleHouse'||o.kind==='creoleHouse2'||o.kind==='governorHouse'||o.kind==='pirateTavern').sort((a,b)=>a.x-b.x||a.y-b.y);hs.forEach((o,i)=>{o.v=((o.v>>4)<<4)|((i*3)%8)|(i%2?8:0);});}
  /* 3. trees: interior groves at every junction void, three-tree corridors, one-or-two in the diagonal corridors, then the rim and a fill pass for the corners */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=pickFrom(regionOf(v.y),capOk),n=1+Math.floor(rng()*2.3);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.08:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{const dom=pickFrom(regionOf(e.mid[1]),capOk);[-0.2,0.2].forEach(dy=>{if(rng()<0.7)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.55)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.8+rng()*0.2},null,true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.3));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(e.cls==='top'?-0.02:0)+(rng()-0.2)*0.12)});});
    let mode='grove',run=0,dom='broadleaf';samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.66?'grove':r<0.9?'sparse':'open';run=2+Math.floor(rng()*4);dom=pickFrom(regionOf(s.p[1]),capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){if(e.cls==='top'&&rng()<0.3)return;tree(p[0],p[1],null,dom,low);if(rng()<0.45)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,dom,low);if(rng()<0.12)tree(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,dom,true);}
      else if(mode==='sparse'){if(rng()<0.5)tree(p[0],p[1],null,dom,low);else under(p[0],p[1]);}else if(rng()<0.6)under(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.7)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<10;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.22)tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);}});
  /* 4. undergrowth: ferns, elephant ears, heliconia, flowers, banana plants */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.45)under(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.35)under(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.38)under(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.3)under(px,py);}});
  /* 5. small props: lower tiers only */
  [['ropeLantern',4],['barrels',3],['treasureChest',1],['anchor',1],['parrotPerch',1],['crates',1]].forEach(([k,n])=>{for(let i=0;i<landCnt(n);i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  /* tiers: each object appears at its tier and stays (props leave after tier 2); trees stay >= 68% of the scenery at every tier */
  const cuts={tree:[0.26,0.5,0.77,1],shrub:[0.06,0.38,0.7,1],rock:[0.3,0.55,0.8,1],prop:[1,1,1,1],ruin:[0,0,0,0],struct:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='ruin'||o.cat==='struct')o.tier=o.minT;});
  const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
  for(let t=1;t<=4;t++){let guard=0;while(guard++<300){const c=count(t);if(c.tr/Math.max(1,c.n)>=0.5)break;const pool=placed.filter(o=>o.tier<=t&&t<=o.maxT),cand=(pool.filter(o=>o.cat==='shrub').sort((a,b)=>b.pri-a.pri)[0])||(pool.filter(o=>o.prop&&o.minT>1).sort((a,b)=>b.pri-a.pri)[0]);if(!cand)break;cand.tier=Math.min(5,cand.tier+1);}}
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.sort((a,b)=>a.y-b.y);
  return CARIB_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: sunny island lawn with big sand drifts, cobble patches, fallen palm fronds and shells (decals, not objects) ---- */
function caribGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<40;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'160,214,110':'50,110,56',0.2);}
  for(let k=0;k<16;k++){const p=pt(),w=R*(0.6+r()*1.1);soft(p[0],p[1],w,w*0.4,'238,222,164',0.3);}                  /* sand drifts */
  for(let k=0;k<9;k++){const p=pt(),w=R*(0.25+r()*0.4);soft(p[0],p[1],w,w*0.4,'150,112,66',0.15);}
  for(let k=0;k<9;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'255,244,170',0.17);}
  /* cobble patches: tight clusters of small stones */
  for(let k=0;k<7;k++){const p=pt(),n=14+Math.floor(r()*10);for(let j=0;j<n;j++){const a=r()*6.283,rr=Math.sqrt(r())*R*0.32;TH.ell(c,p[0]+Math.cos(a)*rr,p[1]+Math.sin(a)*rr*0.5,R*0.032,R*0.02,['#a8a090','#b8b0a0','#8f8878'][j%3]);TH.ell(c,p[0]+Math.cos(a)*rr-R*0.006,p[1]+Math.sin(a)*rr*0.5-R*0.004,R*0.015,R*0.009,'rgba(255,255,255,.35)');}}
  for(let k=0;k<150;k++){const p=pt(),h=R*(0.05+r()*0.06);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#5aa845','#78c050','#46963a'][(k+j)%3],R*0.011);}
  for(let k=0;k<26;k++){const p=pt(),a=(r()-0.5)*1.2;c.save();c.translate(p[0],p[1]);c.rotate(a);c.fillStyle=r()<0.5?'#7ab048':'#5a9a3a';c.beginPath();c.ellipse(0,0,R*0.09,R*0.012,0,0,7);c.fill();c.restore();}   /* fallen palm fronds */
  for(let k=0;k<30;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.016,R*0.011,'#f6efe0');TH.ell(c,p[0]+R*0.006,p[1]+R*0.003,R*0.008,R*0.006,'rgba(0,0,0,.18)');}
  for(let k=0;k<46;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.011,R*0.009,['#f6efe0','#f2c230','#e86aa8','#ef6a5a','#fff6c0'][k%5]);}
  c.restore();c.restore();
}
/* ---- generic baker (any theme object {assets, plan, ground, groundCol, seeds}) ---- */

function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol,clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]),key=[T.id,shape,tier,R,m,ground,sc,JSON.stringify(clr),JSON.stringify(opts.clearTiles||[])].join('|');const cached=revisedLandCache.get(key);if(cached)return cached;
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=0.75,top=T.top||1.35,bot=0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);return[cv,g];};
  const [back,cb]=mk();T.ground(cb,G,R,ox,oy,m,ground,({A:11,B:22,C:33,D:44})[shape]);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]),vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho))&&!(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));
  const sprites=vis.map(o=>{const unit=u*(o.scale||1);return {x:m*o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>T.assets[o.kind].draw(ctx,x,y,unit,o.v)};});
  const front=document.createElement('canvas'),frontRect={x:0,y:0,w:1,h:1};front.width=front.height=1;
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return revisedLandCache.set(key,{back,front,frontRect,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0,sprites});
}
function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}
const CARIB_THEME={id:'caribbean',assets:CARIB_ASSETS,plan:getCaribPlan,ground:caribGround,groundCol:'#6aa04a',top:1.75};
const CARIB_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
/* public API: same shape as the Western pack */
function bakeLandCaribbean(shape,tier,R,opts){return bakeLandTheme(CARIB_THEME,shape,tier,R,opts);}
function drawLandCaribbeanBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandCaribbeanFront(ctx,x,y,land){land.sprites.slice().sort((a,b)=>a.y-b.y).forEach(s=>drawScenicSprite(ctx,s,x+s.x,y+s.y));}
function landCaribbeanSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}


return Object.freeze({bake: bakeLandCaribbean, drawBack: drawLandCaribbeanBack, drawFront: drawLandCaribbeanFront});
})(),
  retro: (() => {

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

/* ===== RETRO-FUTURE ASSETS (Tomorrowland-style): white Jetsons/Googie architecture, teal glass, orange accents, trees in sleek planters. draw(c,x,y,u,v): (x,y)=base centre, u=0.075*R, v=variant seed ===== */
const RW={w:'#f4f6f8',ws:'#b9c4d1',wl:'#ffffff',teal:'#2fb8c4',tealD:'#1f8a96',org:'#ff7a3c',yel:'#ffd23c',navy:'#2a3a52',leaf:['#8fd05a','#6ab83c','#4a9a30'],glass:['#cdeef8','#8ccfe4','#4f9fc0']};
const RSH=(c,x,y,rx)=>{c.fillStyle='rgba(40,62,96,.22)';c.beginPath();c.ellipse(x+rx*0.22,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const RBOX=(c,x,y,u,a,b,d,e,f,g,col)=>col?TH.box(c,x,y,u,a,b,d,e,f,g,col,shade(col,-0.22),shade(col,0.1)):TH.box(c,x,y,u,a,b,d,e,f,g,RW.w,RW.ws,RW.wl);
function RCYL(c,x,y,rx,ry,wh,cols){cols=cols||['#ffffff','#e9eef3','#a9b6c6'];const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,cols[0]);g.addColorStop(0.5,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y-wh);c.lineTo(x-rx,y);c.ellipse(x,y,rx,ry,0,Math.PI,0,true);c.lineTo(x+rx,y-wh);c.ellipse(x,y-wh,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();}
function RGLASS(c,pts,alpha){const ys=pts.map(p=>p[1]),g=c.createLinearGradient(0,Math.min(...ys),0,Math.max(...ys));g.addColorStop(0,RW.glass[0]);g.addColorStop(0.5,RW.glass[1]);g.addColorStop(1,RW.glass[2]);c.save();c.globalAlpha=alpha||1;c.fillStyle=g;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();c.restore();}
function RSPHERE(c,x,y,r,cols){const g=c.createRadialGradient(x-r*0.35,y-r*0.4,r*0.1,x,y,r*1.05);g.addColorStop(0,cols[0]);g.addColorStop(0.55,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();}
function RGLOW(c,x,y,r,rgb,a){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();}
const RETRO_ASSETS={
  saucerTower:{cat:'struct',rho:0.1,draw(c,x,y,u,v){const acc=[RW.teal,RW.org][(v>>1)&1],sz=1+(v&1)*0.14;RSH(c,x,y,u*3.4);
    RCYL(c,x,y,2.3*u,1.15*u,0.8*u);TH.ell(c,x,y-0.8*u,2.3*u,1.15*u,'#ffffff');c.strokeStyle=acc;c.lineWidth=u*0.14;c.beginPath();c.ellipse(x,y-0.8*u,1.75*u,0.88*u,0,0,7);c.stroke();
    const top=y-0.8*u,H=u*10.4,g=c.createLinearGradient(x-u,0,x+u,0);g.addColorStop(0,'#ffffff');g.addColorStop(0.5,'#e6ebf1');g.addColorStop(1,'#a3b0c0');c.fillStyle=g;c.beginPath();c.moveTo(x-u*1.0,top);c.lineTo(x-u*0.42,top-H);c.lineTo(x+u*0.42,top-H);c.lineTo(x+u*1.0,top);c.closePath();c.fill();
    c.strokeStyle='rgba(120,140,165,.35)';c.lineWidth=u*0.07;[0.25,0.5,0.75].forEach(f=>{const yy=top-H*f,hw=u*(1.0-0.58*f);c.beginPath();c.ellipse(x,yy,hw,hw*0.45,0,0.05,Math.PI-0.05);c.stroke();});
    const my=top-H*0.46;TH.ell(c,x,my+u*0.2,u*1.9,u*0.72,'#aab6c4');TH.ell(c,x,my,u*1.9,u*0.72,'#eef2f6');c.strokeStyle=RW.teal;c.lineWidth=u*0.12;c.beginPath();c.ellipse(x,my+u*0.08,u*1.8,u*0.68,0,0.1,Math.PI-0.1);c.stroke();TH.ell(c,x,my-u*0.12,u*1.4,u*0.5,'#ffffff');
    const cy=top-H-u*0.2,R=u*3.9*sz,r=u*1.25*sz;TH.ell(c,x,cy+u*0.55,R*0.92,r*0.88,'#a3b0c0');TH.ell(c,x,cy,R,r,'#e8edf2');c.strokeStyle=acc;c.lineWidth=u*0.24;c.beginPath();c.ellipse(x,cy+u*0.12,R*0.97,r*0.95,0,0.06,Math.PI-0.06);c.stroke();
    for(let k=0;k<11;k++){const a=0.18+k/10*(Math.PI-0.36);TH.ell(c,x+Math.cos(a)*R*0.86,cy+u*0.5+Math.sin(a)*r*0.78,u*0.16,u*0.13,k%2?'#fff2a8':'#ffffff');}
    TH.ell(c,x,cy-u*0.35,R*0.8,r*0.7,'#ffffff');
    const dg=c.createLinearGradient(0,cy-u*2.2,0,cy);dg.addColorStop(0,RW.glass[0]);dg.addColorStop(1,RW.glass[2]);c.fillStyle=dg;c.beginPath();c.ellipse(x,cy-u*0.4,u*1.75,u*1.75,0,Math.PI,0,false);c.closePath();c.fill();c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=u*0.08;c.beginPath();c.ellipse(x,cy-u*0.4,u*1.75,u*1.75,0,Math.PI*1.1,Math.PI*1.6,false);c.stroke();TH.ln(c,[x,cy-u*0.4],[x,cy-u*2.15],'rgba(255,255,255,.55)',u*0.06);
    TH.ln(c,[x,cy-u*2.15],[x,cy-u*3.8],'#8a98a8',u*0.12);TH.ell(c,x,cy-u*3.9,u*0.24,u*0.24,RW.org);RGLOW(c,x,cy-u*3.9,u*1.1,'255,122,60',0.4);}},
  domeLab:{cat:'struct',rho:0.13,draw(c,x,y,u,v){RSH(c,x,y,u*4.2);const rx=3.5*u,ry=1.75*u,wh=0.9*u,H=3.5*u,by=y-wh;
    RCYL(c,x,y,rx,ry,wh);TH.ell(c,x,by,rx,ry,'#f4f6f8');
    const g=c.createRadialGradient(x-rx*0.35,by-H*0.65,u*0.3,x,by-H*0.25,rx*1.15);g.addColorStop(0,'#ffffff');g.addColorStop(0.55,'#e4eaf1');g.addColorStop(1,'#9eb0c3');c.fillStyle=g;c.beginPath();c.ellipse(x,by,rx,H,0,Math.PI,Math.PI*2,false);c.ellipse(x,by,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();
    c.strokeStyle='rgba(70,100,135,.38)';c.lineWidth=u*0.08;[-3,-2,-1,1,2,3].forEach(k=>{c.beginPath();c.ellipse(x,by,rx*Math.abs(k)/4,H,0,Math.PI,Math.PI*2);c.stroke();});
    [0.32,0.6,0.82].forEach(f=>{const yy=by-H*f,q=Math.cos(Math.asin(f));c.beginPath();c.ellipse(x,yy,rx*q,ry*q,0,0.02,Math.PI-0.02);c.stroke();});
    c.beginPath();c.moveTo(x-rx*0.97,by-H*0.16);c.ellipse(x,by-H*0.16,rx*0.97,ry*0.97,0,Math.PI,0,true);c.lineTo(x+rx*0.97,by-H*0.4);c.ellipse(x,by-H*0.4,rx*0.93,ry*0.93,0,0,Math.PI,false);c.closePath();const gg=c.createLinearGradient(x-rx,0,x+rx,0);gg.addColorStop(0,'#bfe8f4');gg.addColorStop(1,'#4f9fc0');c.fillStyle=gg;c.globalAlpha=0.85;c.fill();c.globalAlpha=1;
    TH.ell(c,x,by-H*0.97,u*0.75,u*0.3,RW.teal);TH.ln(c,[x,by-H],[x,by-H-u*1.6],'#8a98a8',u*0.1);TH.ell(c,x,by-H-u*1.7,u*0.22,u*0.22,RW.org);
    const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.box(c,x,y,u,1.15,2.25,1.15,2.25,0,1.7,'#ffffff',RW.ws,RW.wl);TH.poly(c,[I(1.45,2.25,0),I(2.0,2.25,0),I(2.0,2.25,1.4),I(1.45,2.25,1.4)],RW.teal);TH.poly(c,[I(1.15,2.25,1.7),I(2.25,2.25,1.7),I(2.25,2.25,1.95),I(1.15,2.25,1.95)],RW.org);}},
  wingPavilion:{cat:'struct',rho:0.13,draw(c,x,y,u,v){RSH(c,x,y,u*4.8);const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),acc=[RW.teal,RW.org][v&1];
    RBOX(c,x,y,u,-2.8,2.8,-1.6,1.6,0,0.25);
    RGLASS(c,[I(-2.6,1.4,0.25),I(2.6,1.4,0.25),I(2.6,1.4,2.9),I(-2.6,1.4,2.9)]);RGLASS(c,[I(2.6,-1.4,0.25),I(2.6,1.4,0.25),I(2.6,1.4,2.9),I(2.6,-1.4,2.9)],0.9);
    c.fillStyle='rgba(30,60,90,.18)';c.beginPath();[I(2.6,-1.4,0.25),I(2.6,1.4,0.25),I(2.6,1.4,2.9),I(2.6,-1.4,2.9)].forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.fill();
    for(let k=0;k<=6;k++){const X=-2.6+5.2*k/6;TH.ln(c,I(X,1.4,0.25),I(X,1.4,2.9),'#ffffff',u*0.09);}for(let k=0;k<=3;k++){const Y=-1.4+2.8*k/3;TH.ln(c,I(2.6,Y,0.25),I(2.6,Y,2.9),'#e8edf2',u*0.09);}
    [[-2.7,1.5],[2.7,1.5]].forEach(([X,Y])=>{TH.ln(c,I(X,Y,0.2),I(X,Y,3.35),'#ffffff',u*0.42);TH.ln(c,I(X+0.1,Y,0.2),I(X+0.1,Y,3.35),'rgba(150,170,195,.5)',u*0.14);});
    const A=I(-4.6,2.5,3.2),B=I(4.6,2.5,4.4),C=I(4.6,-2.5,4.4),D=I(-4.6,-2.5,3.2),t=u*0.5;
    TH.poly(c,[A,B,[B[0],B[1]+t],[A[0],A[1]+t]],'#d9e0e8');TH.poly(c,[B,C,[C[0],C[1]+t],[B[0],B[1]+t]],'#aeb9c7');
    const rg=c.createLinearGradient(A[0],0,C[0],0);rg.addColorStop(0,'#ffffff');rg.addColorStop(1,'#e2e8ef');c.fillStyle=rg;c.beginPath();[A,B,C,D].forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();
    TH.ln(c,I(-4.5,2.2,3.22),I(4.5,2.2,4.42),acc,u*0.22);TH.ln(c,A,B,'#cfd7e0',u*0.08);
    for(let k=0;k<5;k++){const X=-3.2+k*1.6;TH.ell(c,I(X,-0.4,3.5+(X+4.6)*0.1)[0],I(X,-0.4,3.5+(X+4.6)*0.1)[1],u*0.18,u*0.1,'rgba(160,180,200,.5)');}}},
  ringHall:{cat:'struct',rho:0.12,draw(c,x,y,u,v){const acc=[RW.teal,RW.org][(v>>1)&1];RSH(c,x,y,u*4.0);const rx=3.1*u,ry=1.55*u,wh=3.4*u,ringY=y-wh-u*2.4,RR=u*4.0,rr=RR*0.5;
    c.strokeStyle='#dfe6ee';c.lineWidth=u*0.6;c.beginPath();c.ellipse(x,ringY,RR,rr,0,Math.PI,Math.PI*2);c.stroke();
    RCYL(c,x,y,rx,ry,wh);
    c.beginPath();c.moveTo(x-rx,y-0.9*u);c.ellipse(x,y-0.9*u,rx,ry,0,Math.PI,0,true);c.lineTo(x+rx,y-2.7*u);c.ellipse(x,y-2.7*u,rx,ry,0,0,Math.PI,false);c.closePath();const gg=c.createLinearGradient(x-rx,0,x+rx,0);gg.addColorStop(0,'#cdeef8');gg.addColorStop(0.5,'#8ccfe4');gg.addColorStop(1,'#3f88a8');c.fillStyle=gg;c.fill();
    c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=u*0.1;for(let k=1;k<12;k++){const a=Math.PI*k/12,px=x+Math.cos(a)*rx,py=y+Math.sin(a)*ry;c.beginPath();c.moveTo(px,py-0.9*u);c.lineTo(px,py-2.7*u);c.stroke();}
    c.strokeStyle=acc;c.lineWidth=u*0.2;c.beginPath();c.ellipse(x,y-wh+u*0.12,rx*0.99,ry*0.99,0,0.03,Math.PI-0.03);c.stroke();
    TH.ell(c,x,y-wh,rx,ry,'#ffffff');TH.ell(c,x,y-wh,rx*0.55,ry*0.55,'#eef2f6');
    [-1.6,0,1.6].forEach(dx=>{const px=x+dx*u,py=y-wh+(dx===0?ry*0.5:ry*0.32);TH.ln(c,[px,py],[px*0.4+x*0.6,ringY+rr*(dx===0?0.95:0.8)],'#aab6c4',u*0.12);});
    c.strokeStyle='#ffffff';c.lineWidth=u*0.6;c.beginPath();c.ellipse(x,ringY,RR,rr,0,0,Math.PI);c.stroke();c.strokeStyle=acc;c.lineWidth=u*0.14;c.beginPath();c.ellipse(x,ringY+u*0.05,RR*0.97,rr*0.97,0,0.1,Math.PI-0.1);c.stroke();
    RSPHERE(c,x,ringY-u*0.2,u*0.55,['#fff2c0','#ffb24a','#e0602a']);RGLOW(c,x,ringY-u*0.2,u*1.6,'255,170,60',0.3);}},
  rocketSpire:{cat:'struct',rho:0.09,draw(c,x,y,u,v){RSH(c,x,y,u*3.2);RCYL(c,x,y,2.1*u,1.05*u,0.7*u);TH.ell(c,x,y-0.7*u,2.1*u,1.05*u,'#ffffff');
    const base=y-0.7*u,H=u*10.6,w=u*0.95;
    TH.poly(c,[[x+w,base-u*3],[x+u*3.0,base+u*0.3],[x+w,base-u*0.2]],'#b9c4d1');                                          /* right fin (shaded) */
    const g=c.createLinearGradient(x-w,0,x+w,0);g.addColorStop(0,'#ffffff');g.addColorStop(0.5,'#e8edf2');g.addColorStop(1,'#a3b0c0');c.fillStyle=g;c.beginPath();c.moveTo(x-w,base);c.lineTo(x-w,base-H*0.78);c.quadraticCurveTo(x-w*0.8,base-H*0.92,x,base-H);c.quadraticCurveTo(x+w*0.8,base-H*0.92,x+w,base-H*0.78);c.lineTo(x+w,base);c.closePath();c.fill();
    TH.poly(c,[[x-w,base-u*3],[x-u*3.1,base+u*0.3],[x-w,base-u*0.2]],'#ffffff');TH.ln(c,[x-w,base-u*3],[x-u*3.1,base+u*0.3],RW.teal,u*0.22);TH.ln(c,[x+w,base-u*3],[x+u*3.0,base+u*0.3],RW.tealD,u*0.2);
    c.fillStyle=RW.teal;c.beginPath();c.moveTo(x-w,base-H*0.78);c.quadraticCurveTo(x-w*0.8,base-H*0.92,x,base-H);c.quadraticCurveTo(x+w*0.8,base-H*0.92,x+w,base-H*0.78);c.closePath();c.fill();
    [0.3,0.5,0.66].forEach((f,i)=>{c.fillStyle=i===1?RW.org:'#2a3a52';c.fillRect(x-w,base-H*f,w*2,u*(i===1?0.5:0.22));});
    [0.4,0.58].forEach(f=>{TH.ell(c,x,base-H*f,u*0.34,u*0.34,'#7cc4dc');TH.ell(c,x-u*0.1,base-H*f-u*0.08,u*0.12,u*0.1,'#ffffff');});
    TH.ln(c,[x,base-H],[x,base-H-u*1.6],'#8a98a8',u*0.1);RSPHERE(c,x,base-H-u*1.7,u*0.26,['#fff2c0','#ffb24a','#e0602a']);RGLOW(c,x,base-H-u*1.7,u*1.3,'255,160,60',0.4);}},
  skyDome:{cat:'struct',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*7+2);RSH(c,x,y,u*4.2);const rx=3.4*u,ry=1.7*u,wh=0.7*u,H=3.6*u,by=y-wh;RCYL(c,x,y,rx,ry,wh);TH.ell(c,x,by,rx,ry,'#e3f2d8');
    [[-1.6,0.4,1.2],[1.4,0.5,1.0],[0,-0.3,1.5]].forEach(([dx,dy,s],i)=>TH.blob(c,x+dx*u,by+dy*u*0.4-s*u*1.0,u*s,u*s*0.9,RW.leaf[i%3],r,8));
    TH.ln(c,[x+u*0.2,by],[x+u*0.1,by-u*2.6],'#8a6a44',u*0.3);for(let k=0;k<7;k++){const a=-Math.PI+0.2+k/6*(Math.PI-0.4);TH.ln(c,[x+u*0.1,by-u*2.6],[x+u*0.1+Math.cos(a)*u*1.5,by-u*2.6+Math.sin(a)*u*0.8+u*0.5],'#4a9a30',u*0.22);}
    const g=c.createLinearGradient(0,by-H,0,by);g.addColorStop(0,'rgba(205,238,248,.62)');g.addColorStop(1,'rgba(90,170,200,.38)');c.fillStyle=g;c.beginPath();c.ellipse(x,by,rx,H,0,Math.PI,Math.PI*2,false);c.ellipse(x,by,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();
    c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=u*0.12;[-3,-2,-1,1,2,3].forEach(k=>{c.beginPath();c.ellipse(x,by,rx*Math.abs(k)/4,H,0,Math.PI,Math.PI*2);c.stroke();});[0.35,0.68].forEach(f=>{const q=Math.cos(Math.asin(f));c.beginPath();c.ellipse(x,by-H*f,rx*q,ry*q,0,0.02,Math.PI-0.02);c.stroke();});
    c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=u*0.2;c.beginPath();c.ellipse(x,by,rx*0.98,H*0.98,0,Math.PI*1.12,Math.PI*1.4);c.stroke();TH.ell(c,x,by-H*0.99,u*0.45,u*0.2,'#ffffff');}},
  kiosk:{cat:'ruin',rho:0.09,draw(c,x,y,u,v){const acc=[RW.teal,RW.org][v&1];RSH(c,x,y,u*3.2);const rx=1.5*u,ry=0.75*u,wh=1.7*u;RCYL(c,x,y,rx,ry,wh);
    c.beginPath();c.moveTo(x-rx,y-0.5*u);c.ellipse(x,y-0.5*u,rx,ry,0,Math.PI,0,true);c.lineTo(x+rx,y-1.4*u);c.ellipse(x,y-1.4*u,rx,ry,0,0,Math.PI,false);c.closePath();const gg=c.createLinearGradient(x-rx,0,x+rx,0);gg.addColorStop(0,'#cdeef8');gg.addColorStop(1,'#4f9fc0');c.fillStyle=gg;c.fill();
    c.strokeStyle='#ffffff';c.lineWidth=u*0.08;for(let k=1;k<7;k++){const a=Math.PI*k/7,px=x+Math.cos(a)*rx,py=y+Math.sin(a)*ry;c.beginPath();c.moveTo(px,py-0.5*u);c.lineTo(px,py-1.4*u);c.stroke();}
    TH.ell(c,x,y-wh,rx,ry,'#ffffff');TH.ln(c,[x,y-wh],[x,y-wh-u*0.9],'#c9d1d9',u*0.3);
    const cy=y-wh-u*0.95;TH.ell(c,x,cy+u*0.22,2.6*u,1.3*u,'#b9c4d1');TH.ell(c,x,cy,2.6*u,1.3*u,'#f4f6f8');c.strokeStyle=acc;c.lineWidth=u*0.22;c.beginPath();c.ellipse(x,cy+u*0.12,2.55*u,1.27*u,0,0.08,Math.PI-0.08);c.stroke();TH.ell(c,x,cy-u*0.14,2.1*u,1.05*u,'#ffffff');
    TH.poly(c,[[x-rx*0.4,y-0.4*u+ry*0.9],[x+rx*0.4,y-0.4*u+ry*0.9],[x+rx*0.4,y-1.1*u+ry*0.9],[x-rx*0.4,y-1.1*u+ry*0.9]],'rgba(255,255,255,.0)');}},
  orbSculpture:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){RSH(c,x,y,u*2.6);RCYL(c,x,y,1.5*u,0.75*u,0.7*u);TH.ell(c,x,y-0.7*u,1.5*u,0.75*u,'#ffffff');
    [-1,0,1].forEach(s=>TH.ln(c,[x+s*u*0.8,y-0.7*u],[x+s*u*0.25,y-2.8*u],'#c4ccd6',u*0.24));
    const cy=y-4.2*u;c.save();c.strokeStyle='rgba(47,184,196,.95)';c.lineWidth=u*0.16;[-0.55,0.6].forEach((rot,i)=>{c.beginPath();c.ellipse(x,cy,u*2.7,u*0.8,rot,Math.PI,Math.PI*2);c.stroke();});c.restore();
    RSPHERE(c,x,cy,u*1.5,['#ffffff','#d5dde6','#8a98a8']);TH.ell(c,x-u*0.5,cy-u*0.55,u*0.4,u*0.25,'rgba(255,255,255,.9)');
    c.save();c.strokeStyle='#ffffff';c.lineWidth=u*0.2;[-0.55,0.6].forEach((rot,i)=>{c.beginPath();c.ellipse(x,cy,u*2.7,u*0.8,rot,0,Math.PI);c.stroke();});c.strokeStyle='rgba(47,184,196,.9)';c.lineWidth=u*0.08;[-0.55,0.6].forEach((rot,i)=>{c.beginPath();c.ellipse(x,cy,u*2.7,u*0.8,rot,0.1,Math.PI-0.1);c.stroke();});c.restore();
    RSPHERE(c,x+u*2.3,cy+u*0.45,u*0.4,['#fff2c0','#ff9a4a','#d0502a']);RSPHERE(c,x-u*2.2,cy-u*0.1,u*0.3,['#ffffff','#7cc4dc','#2f8aa8']);}},
  jetFountain:{cat:'ruin',rho:0.1,draw(c,x,y,u,v){RSH(c,x,y,u*3.8);const rx=3.4*u,ry=1.7*u,wh=0.8*u;RCYL(c,x,y,rx,ry,wh);TH.ell(c,x,y-wh,rx,ry,'#ffffff');TH.ell(c,x,y-wh,rx*0.9,ry*0.9,'#b9c4d1');const wg=c.createRadialGradient(x,y-wh,0,x,y-wh,rx*0.9);wg.addColorStop(0,'#5aaed0');wg.addColorStop(1,'#8fd4ea');c.fillStyle=wg;c.beginPath();c.ellipse(x,y-wh+u*0.12,rx*0.86,ry*0.84,0,0,7);c.fill();
    for(let k=0;k<14;k++){const a=k/14*6.283;TH.ell(c,x+Math.cos(a)*rx*0.96,y-wh+Math.sin(a)*ry*0.96,u*0.12,u*0.1,k%2?RW.teal:'#fff2a8');}
    c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=u*0.06;c.beginPath();c.ellipse(x,y-wh+u*0.12,rx*0.5,ry*0.46,0,0.2,Math.PI-0.2);c.stroke();
    const cy=y-wh+u*0.1;TH.ell(c,x,cy,u*0.7,u*0.3,'#ffffff');TH.ln(c,[x,cy],[x,cy-u*1.9],'#d9e0e8',u*0.4);TH.ell(c,x,cy-u*1.9,u*0.5,u*0.22,RW.teal);
    c.lineCap='round';[[0,-4.6],[-0.8,-3.8],[0.8,-3.8],[-1.5,-2.8],[1.5,-2.8],[-2.2,-1.8],[2.2,-1.8]].forEach(([dx,dh],i)=>{c.strokeStyle=i===0?'rgba(240,252,255,.95)':'rgba(205,238,252,.8)';c.lineWidth=u*(i===0?0.2:0.13);c.beginPath();c.moveTo(x,cy-u*1.9);c.quadraticCurveTo(x+dx*u*0.8,cy+dh*u*0.7,x+dx*u*1.55,cy+u*0.15);c.stroke();});
    [[-1.9,-3.4],[1.9,-3.1],[0.6,-4.4],[-0.5,-4.9],[2.6,-2.0]].forEach(([dx,dy])=>TH.ell(c,x+dx*u,cy+dy*u*0.7,u*0.1,u*0.1,'rgba(235,250,255,.9)'));}},
  holoSign:{cat:'ruin',rho:0.05,draw(c,x,y,u,v){const acc=[RW.teal,RW.org][v&1];RSH(c,x,y,u*2.2);TH.ell(c,x,y,u*1.2,u*0.5,'#c9d1d9');
    const g=c.createLinearGradient(x-u,0,x+u,0);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#a9b6c6');c.fillStyle=g;c.beginPath();c.moveTo(x-u*1.1,y);c.lineTo(x-u*0.8,y-u*5.2);c.lineTo(x+u*0.8,y-u*5.2);c.lineTo(x+u*1.1,y);c.closePath();c.fill();
    const py=y-u*3.9;c.fillStyle='#16283a';c.fillRect(x-u*0.62,py,u*1.24,u*2.4);const pg=c.createLinearGradient(0,py,0,py+u*2.4);pg.addColorStop(0,acc);pg.addColorStop(1,shade(acc,-0.3));c.fillStyle=pg;c.fillRect(x-u*0.5,py+u*0.12,u*1.0,u*2.16);
    c.strokeStyle='rgba(255,255,255,.95)';c.lineWidth=u*0.14;[0.55,1.2,1.85].forEach(f=>{c.beginPath();c.moveTo(x-u*0.32,py+u*f);c.lineTo(x,py+u*(f-0.35));c.lineTo(x+u*0.32,py+u*f);c.stroke();});RGLOW(c,x,py+u*1.2,u*2.4,acc===RW.teal?'47,184,196':'255,122,60',0.35);
    const sy=y-u*6.5;for(let k=0;k<10;k++){const a=k/10*6.283;TH.ln(c,[x,sy],[x+Math.cos(a)*u*1.2,sy+Math.sin(a)*u*1.2],'#ffffff',u*0.1);TH.ell(c,x+Math.cos(a)*u*1.25,sy+Math.sin(a)*u*1.25,u*0.14,u*0.14,k%2?RW.org:'#ffffff');}RSPHERE(c,x,sy,u*0.5,['#ffffff','#e0e8f0','#9fb0c2']);}},
  ringArch:{cat:'ruin',rho:0.1,draw(c,x,y,u,v){const acc=[RW.teal,RW.org][v&1],rgb=acc===RW.teal?'47,184,196':'255,122,60';RSH(c,x,y,u*3.6);const cy=y-u*3.9;
    [-1,1].forEach(s=>{TH.poly(c,[[x+s*u*2.9,y],[x+s*u*1.5,y],[x+s*u*1.7,y-u*0.9],[x+s*u*2.7,y-u*0.9]],'#e2e8ef');});
    c.strokeStyle='#aab6c4';c.lineWidth=u*1.0;c.beginPath();c.ellipse(x+u*0.14,cy+u*0.1,u*2.4,u*3.6,0,0,7);c.stroke();
    const g=c.createLinearGradient(x-u*2.6,0,x+u*2.6,0);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#cfd8e2');c.strokeStyle=g;c.lineWidth=u*0.9;c.beginPath();c.ellipse(x,cy,u*2.4,u*3.6,0,0,7);c.stroke();
    c.strokeStyle=acc;c.lineWidth=u*0.16;c.beginPath();c.ellipse(x,cy,u*1.93,u*3.13,0,0,7);c.stroke();
    for(let k=0;k<12;k++){const a=k/12*6.283;TH.ell(c,x+Math.cos(a)*u*1.78,cy+Math.sin(a)*u*2.98,u*0.12,u*0.12,'#fff2a8');}
    RGLOW(c,x,cy-u*3.3,u*1.6,rgb,0.35);}},
  sputnikLamp:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.24,'rgba(40,62,96,.22)');TH.ln(c,[x,y],[x,y-u*3.4],'#e6ebf1',u*0.3);TH.ln(c,[x+u*0.08,y],[x+u*0.08,y-u*3.4],'rgba(150,170,195,.5)',u*0.1);TH.ell(c,x,y,u*0.45,u*0.2,'#c9d1d9');
    const sy=y-u*3.9;RGLOW(c,x,sy,u*2.0,'255,225,150',0.38);for(let k=0;k<10;k++){const a=k/10*6.283;TH.ln(c,[x,sy],[x+Math.cos(a)*u*1.05,sy+Math.sin(a)*u*1.05],'#aab6c4',u*0.07);TH.ell(c,x+Math.cos(a)*u*1.1,sy+Math.sin(a)*u*1.1,u*0.13,u*0.13,k%3===0?RW.org:'#fff2c0');}RSPHERE(c,x,sy,u*0.5,['#ffffff','#ffe9a8','#e0a850']);}},
  loungePod:{cat:'prop',rho:0.05,draw(c,x,y,u,v){const acc=[RW.teal,RW.org][v&1],I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*2.4,u*0.5,'rgba(40,62,96,.22)');
    TH.box(c,x,y,u,-1.8,1.8,-0.6,0.6,0,0.7,'#ffffff',RW.ws,RW.wl);TH.box(c,x,y,u,-1.7,1.7,-0.5,0.5,0.7,1.0,acc,shade(acc,-0.25),shade(acc,0.12));TH.box(c,x,y,u,-1.8,1.8,-0.6,-0.3,1.0,2.0,'#ffffff',RW.ws,RW.wl);}},
  lightTube:{cat:'prop',rho:0.03,draw(c,x,y,u,v){const acc=[RW.teal,RW.org,'#9a6aff'][v%3],rgb=['47,184,196','255,122,60','154,106,255'][v%3];TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.24,'rgba(40,62,96,.22)');RCYL(c,x,y,u*0.7,u*0.32,u*0.6);TH.ell(c,x,y-u*0.6,u*0.7,u*0.32,'#ffffff');
    RGLOW(c,x,y-u*2.8,u*2.6,rgb,0.34);const g=c.createLinearGradient(x-u*0.38,0,x+u*0.38,0);g.addColorStop(0,shade(acc,0.4));g.addColorStop(0.5,'#ffffff');g.addColorStop(1,acc);c.fillStyle=g;c.fillRect(x-u*0.38,y-u*5.0,u*0.76,u*4.4);TH.ell(c,x,y-u*5.0,u*0.38,u*0.17,'#ffffff');TH.ell(c,x,y-u*5.2,u*0.5,u*0.2,'#d9e0e8');}},
  roundTree:{cat:'tree',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*7+1),pal=[['#b6e87a','#7fc24a','#4a9a30'],['#a8e07a','#6ab83c','#3f8a30'],['#c6ee8a','#8fd05a','#5aa83a']][v%3],s=0.9+(v%5)*0.07;RSH(c,x,y,u*2.0);
    RCYL(c,x,y,1.45*u,0.72*u,1.4*u);TH.ell(c,x,y-1.4*u,1.45*u,0.72*u,'#ffffff');TH.ell(c,x,y-1.4*u,1.15*u,0.55*u,'#5a4a3a');c.strokeStyle=RW.teal;c.lineWidth=u*0.14;c.beginPath();c.ellipse(x,y-0.45*u,1.43*u,0.7*u,0,0.1,Math.PI-0.1);c.stroke();
    TH.ln(c,[x,y-1.4*u],[x,y-3.5*u*s],'#8a7a66',u*0.3);RSPHERE(c,x,y-5.1*u*s,2.2*u*s,pal);TH.ell(c,x-u*0.7*s,y-5.9*u*s,u*0.7,u*0.45,'rgba(255,255,255,.28)');}},
  slimTree:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*5+3),H=u*(6.2+(v%4)*0.5);RSH(c,x,y,u*1.8);TH.box(c,x,y,u,-0.9,0.9,-0.9,0.9,0,1.5,'#ffffff',RW.ws,RW.wl);TH.box(c,x,y,u,-0.9,0.9,0.9,0.98,0.9,1.0,RW.teal,RW.tealD,RW.teal);
    const base=y-u*1.4,g=c.createLinearGradient(x-u*1.0,0,x+u*1.0,0);g.addColorStop(0,'#5aa83a');g.addColorStop(0.5,'#3f8a30');g.addColorStop(1,'#2a6a28');c.fillStyle=g;c.beginPath();c.moveTo(x,base-H);c.bezierCurveTo(x+u*1.3,base-H*0.7,x+u*1.15,base-H*0.15,x,base);c.bezierCurveTo(x-u*1.15,base-H*0.15,x-u*1.3,base-H*0.7,x,base-H);c.fill();
    for(let k=0;k<6;k++){const t=0.15+k*0.14;c.strokeStyle='rgba(20,70,30,.28)';c.lineWidth=u*0.08;c.beginPath();c.moveTo(x-u*0.8*Math.sin(Math.PI*t),base-H*t);c.quadraticCurveTo(x,base-H*t+u*0.35,x+u*0.8*Math.sin(Math.PI*t),base-H*t);c.stroke();}TH.ell(c,x-u*0.3,base-H*0.62,u*0.28,u*1.4,'rgba(190,240,130,.25)');}},
  palmPlanter:{cat:'tree',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+9),H=u*(5.4+(v%3)*0.5),lean=(r()-0.5)*u*1.2;RSH(c,x,y,u*2.0);TH.box(c,x,y,u,-1.1,1.1,-1.1,1.1,0,1.5,'#ffffff',RW.ws,RW.wl);TH.box(c,x,y,u,-1.1,1.1,-1.1,1.1,1.4,1.5,'#5a4a3a','#4a3a2a','#6a5a4a');
    const top=y-u*1.5;c.lineCap='round';c.strokeStyle='#c9b996';c.lineWidth=u*0.5;c.beginPath();c.moveTo(x,top);c.quadraticCurveTo(x+lean*0.2,top-H*0.5,x+lean,top-H);c.stroke();c.strokeStyle='#a8987a';c.lineWidth=u*0.14;c.beginPath();c.moveTo(x+u*0.15,top);c.quadraticCurveTo(x+lean*0.2+u*0.15,top-H*0.5,x+lean+u*0.1,top-H);c.stroke();
    const px=x+lean,py=top-H;for(let k=0;k<8;k++){const a=-Math.PI+0.1+k/7*(Math.PI-0.2),l=u*(2.2+r()*0.5),ex=px+Math.cos(a)*l,ey=py+Math.sin(a)*l*0.55+l*0.4;c.strokeStyle=k%2?'#58b038':'#3f9a30';c.lineWidth=u*0.4;c.beginPath();c.moveTo(px,py);c.quadraticCurveTo(px+Math.cos(a)*l*0.55,py+Math.sin(a)*l*0.7-l*0.2,ex,ey);c.stroke();c.strokeStyle='#8fd05a';c.lineWidth=u*0.1;c.stroke();}
    TH.ell(c,px,py+u*0.1,u*0.4,u*0.35,'#8a6a44');}},
  planterBox:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+2),acc=[RW.org,RW.yel,'#ff7aa8'][v%3];RSH(c,x,y,u*2.6);TH.box(c,x,y,u,-2.0,2.0,-0.7,0.7,0,0.9,'#ffffff',RW.ws,RW.wl);TH.box(c,x,y,u,-2.0,2.0,0.7,0.78,0.5,0.62,RW.teal,RW.tealD,RW.teal);
    TH.box(c,x,y,u,-1.8,1.8,-0.55,0.55,0.9,1.8,RW.leaf[1],RW.leaf[2],RW.leaf[0]);for(let k=0;k<9;k++){const X=-1.6+k*0.4,p=TH.iso(x,y,u,X,(r()-0.5)*0.8,1.8);TH.ell(c,p[0],p[1],u*0.17,u*0.14,k%3?acc:'#ffffff');}}},
  flowerRing:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*7+4);RSH(c,x,y,u*2.2);RCYL(c,x,y,1.6*u,0.8*u,0.9*u);TH.ell(c,x,y-0.9*u,1.6*u,0.8*u,'#ffffff');TH.ell(c,x,y-0.9*u,1.35*u,0.66*u,'#5a4a3a');c.strokeStyle=RW.teal;c.lineWidth=u*0.14;c.beginPath();c.ellipse(x,y-0.35*u,1.58*u,0.78*u,0,0.1,Math.PI-0.1);c.stroke();
    for(let k=0;k<18;k++){const a=r()*6.283,rr=Math.sqrt(r())*1.2,px=x+Math.cos(a)*u*rr,py=y-0.9*u+Math.sin(a)*u*rr*0.5-r()*u*0.7;TH.ln(c,[px,py+u*0.5],[px,py],'#4a9a30',u*0.08);TH.ell(c,px,py,u*0.26,u*0.22,['#ff7a3c','#ffd23c','#ff7aa8','#ffffff','#2fb8c4'][k%5]);}}},
};

/* ===== MACRO-LAND ENGINE (hex geometry, path network, planner, baker) ===== */
const W3=Math.sqrt(3),HX=W3/2,HV=[[HX,0.29],[0,0.58],[-HX,0.29],[-HX,-0.29],[0,-0.58],[HX,-0.29]];
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[0,1,2],[-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5,1.5]],C:[[0],[-0.5,0.5,1.5],[-1,0,1],[-0.5]],D:[[0,1,2],[-0.5,0.5,1.5],[0,1]]};
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

/* ===== RETRO-FUTURE LAND: planner (white architecture first, a few trees in sleek planters, no terrain), pale paved ground, generic baker ===== */
const RETRO_TREES={roundTree:.45,slimTree:.3,palmPlanter:.25};
const RETRO_PLAN_CACHE={};
function getRetroPlan(shape){
  if(RETRO_PLAN_CACHE[shape])return RETRO_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(({A:13101,B:13202,C:13318,D:13419})[shape]),placed=[],bb=G.bbox,used={},A=RETRO_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.66);
  const pickFrom=(w)=>{let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}return pick;};
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='tree'?0.95+rng()*0.2:D.cat==='shrub'?0.92+rng()*0.2:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;if((D.cat==='tree'||D.cat==='shrub'||D.cat==='prop')&&placed.some(o=>o.noSouth&&Math.abs(px-o.x)<0.3&&py-o.y>-0.05&&py-o.y<0.36))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  /* a planter: usually a tree (round / slim / palm), sometimes a long hedge box or a flower ring; 'low' keeps the foreground short */
  const plant=(x,y,extra,low)=>{if(low)return place(['roundTree','planterBox','flowerRing','planterBox'][Math.floor(rng()*4)],x,y,Object.assign({},extra||{},{scale:0.85+rng()*0.15}));return place(rng()<0.6?pickFrom(RETRO_TREES):['planterBox','flowerRing','planterBox'][Math.floor(rng()*3)],x,y,extra||{});};
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const LKS=G.centers.length/12,landThin=l=>{const n=Math.max(1,Math.round(l.length*LKS));return Array.from({length:n},(_,i)=>l[Math.floor((i+0.5)*l.length/n)]);},landCnt=n=>Math.max(1,Math.round(n*LKS));
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. the hero: a saucer tower on the back rim (centred), visible from tier 1 */
  {const pts=[];top.forEach(e=>[0.3,0.5,0.7].forEach(t=>pts.push(onEdge(e,t,0.0))));const p=pts.reduce((b,q)=>Math.abs(q[0]-cx)<Math.abs(b[0]-cx)?q:b);for(const [dx,dy] of [[0,-0.02],[0.3,0],[-0.3,0],[0,0.04]]){const o=place('saucerTower',p[0]+dx,p[1]+dy,{minT:1,scale:1.15,clear:2.4,noSouth:true});if(o)break;}}
  /* 2. the architecture: rim pieces and middle pieces spread by farthest-point, then the rocket spire and the sculptures */
  const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.filter(e=>e.vertical).forEach(e=>inn.push([e.mid[0],e.mid[1]]));
  const chosen=placed.filter(o=>o.cat==='ruin'||o.cat==='struct').map(o=>[o.x,o.y]);
  const spread=(k,pool,extra)=>{const ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.22})).sort((a,b)=>b.d-a.d);for(let n=0;n<Math.min(12,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],extra);if(o){chosen.push([o.x,o.y]);return o;}}return null;};
  landThin([['wingPavilion',1],['domeLab',2],['ringHall',3],['skyDome',4]]).forEach(([k,mt])=>spread(k,rim,{minT:mt,scale:1.12,clear:2.6,noSouth:true}));
  landThin([['domeLab',2],['wingPavilion',3],['rocketSpire',3],['ringHall',4],['skyDome',4]]).forEach(([k,mt])=>spread(k,inn,{minT:mt,scale:k==='rocketSpire'?1.1:1.0,clear:3.0,noSouth:true}));
  landThin([['kiosk',1],['orbSculpture',2],['jetFountain',2],['holoSign',2],['kiosk',3],['ringArch',3],['orbSculpture',3],['holoSign',3],['jetFountain',4],['kiosk',4],['ringArch',4],['orbSculpture',4]]).forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,scale:k==='kiosk'||k==='holoSign'?1.1:1.05,clear:1.8,noSouth:true}));
  /* 3. planters: a few trees and hedge boxes at the junction voids, along the corridors and around the rim */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.45)plant(v.x+(rng()-0.5)*0.1,v.y+(rng()-0.5)*0.08);});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{if(rng()<0.3)plant(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()<0.5?-0.22:0.22));});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.22)plant(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.9},true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx));
    ordered.forEach(e=>{const nS=Math.max(1,Math.round(e.len/0.85));for(let s=0;s<nS;s++){if(rng()<0.6)continue;const p=onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.1,(rng()-0.2)*0.1),low=e.cls==='bottom'||(e.cls==='side'&&p[1]>cy+0.25);plant(p[0],p[1],null,low);}});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.2)plant(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<8;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.04)plant(px,py,{scale:0.9},py>cy+0.35);}});
  /* 4. street furniture: lower tiers only */
  [['sputnikLamp',4],['loungePod',3],['lightTube',3]].forEach(([k,n])=>{for(let i=0;i<landCnt(n);i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  const cuts={tree:[0.3,0.55,0.8,1],shrub:[0.1,0.4,0.7,1],prop:[1,1,1,1],struct:[0,0,0,0],ruin:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='struct'||o.cat==='ruin')o.tier=o.minT;});
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.sort((a,b)=>a.y-b.y);
  return RETRO_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: pale paving in a large oblique grid, soft light/shade, teal guide line round the rim and landing-circle inlays at the junctions (decals, not objects) ---- */
function retroGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<40;k++){const p=pt(),w=R*(0.5+r()*1.0);soft(p[0],p[1],w,w*0.4,r()<0.55?'255,255,255':'150,172,198',r()<0.55?0.34:0.2);}
  /* paving: large oblique tiles with a light bevel */
  const gx=R*0.62,gy=R*0.36,x0=Math.floor(bx[0]/gx)*gx,y0=Math.floor(bx[1]/gy)*gy;
  c.lineWidth=Math.max(0.8,R*0.008);for(let x=x0;x<bx[0]+bx[2]+gx;x+=gx){c.strokeStyle='rgba(110,132,160,.16)';c.beginPath();c.moveTo(x,bx[1]);c.lineTo(x,bx[1]+bx[3]);c.stroke();c.strokeStyle='rgba(255,255,255,.5)';c.beginPath();c.moveTo(x+1,bx[1]);c.lineTo(x+1,bx[1]+bx[3]);c.stroke();}
  for(let y=y0;y<bx[1]+bx[3]+gy;y+=gy){c.strokeStyle='rgba(110,132,160,.16)';c.beginPath();c.moveTo(bx[0],y);c.lineTo(bx[0]+bx[2],y);c.stroke();c.strokeStyle='rgba(255,255,255,.5)';c.beginPath();c.moveTo(bx[0],y+1);c.lineTo(bx[0]+bx[2],y+1);c.stroke();}
  for(let k=0;k<14;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'120,140,170',0.1);}
  /* teal guide line inside the rim */
  c.save();c.setLineDash([R*0.16,R*0.1]);c.strokeStyle='rgba(47,184,196,.42)';c.lineWidth=R*0.022;c.beginPath();outer.forEach(e=>{const a=P([e.a[0]-e.n[0]*0.2,e.a[1]-e.n[1]*0.2]),b=P([e.b[0]-e.n[0]*0.2,e.b[1]-e.n[1]*0.2]);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();c.restore();
  /* landing-circle inlays at the junctions */
  G.verts.filter(v=>v.junction).forEach((v,vi)=>{if(vi%2)return;const p=P([v.x,v.y]);[[0.44,0.25,'rgba(255,255,255,.4)',0],[0.4,0.23,'rgba(47,184,196,.38)',R*0.016],[0.26,0.15,'rgba(255,122,60,.34)',R*0.011]].forEach(([rx,ry,col2,lw])=>{c.beginPath();c.ellipse(p[0],p[1],rx*R,ry*R,0,0,7);if(lw){c.strokeStyle=col2;c.lineWidth=lw;c.stroke();}else{c.fillStyle=col2;c.fill();}});TH.ell(c,p[0],p[1],R*0.05,R*0.03,'rgba(47,184,196,.4)');});
  for(let k=0;k<90;k++){const p=pt();TH.ell(c,p[0],p[1],R*(0.006+r()*0.01),R*0.005,r()<0.5?'rgba(110,132,160,.35)':'rgba(255,255,255,.7)');}
  c.restore();c.restore();
}
/* ---- generic baker (any theme object {assets, plan, ground, groundCol, seeds}) ---- */

function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol,clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]),key=[T.id,shape,tier,R,m,ground,sc,JSON.stringify(clr),JSON.stringify(opts.clearTiles||[])].join('|');const cached=revisedLandCache.get(key);if(cached)return cached;
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=0.75,top=T.top||1.35,bot=0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);return[cv,g];};
  const [back,cb]=mk();T.ground(cb,G,R,ox,oy,m,ground,({A:11,B:22,C:33,D:44})[shape]);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]),vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho))&&!(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));
  const sprites=vis.map(o=>{const unit=u*(o.scale||1);return {x:m*o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>T.assets[o.kind].draw(ctx,x,y,unit,o.v)};});
  const front=document.createElement('canvas'),frontRect={x:0,y:0,w:1,h:1};front.width=front.height=1;
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return revisedLandCache.set(key,{back,front,frontRect,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0,sprites});
}
function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}
const RETRO_THEME={id:'retro',assets:RETRO_ASSETS,plan:getRetroPlan,ground:retroGround,groundCol:'#bcc8d5',top:1.7};
const RETRO_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
/* public API: same shape as the Western pack */
function bakeLandRetro(shape,tier,R,opts){return bakeLandTheme(RETRO_THEME,shape,tier,R,opts);}
function drawLandRetroBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandRetroFront(ctx,x,y,land){land.sprites.slice().sort((a,b)=>a.y-b.y).forEach(s=>drawScenicSprite(ctx,s,x+s.x,y+s.y));}
function landRetroSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}


return Object.freeze({bake: bakeLandRetro, drawBack: drawLandRetroBack, drawFront: drawLandRetroFront});
})(),
  tiki: (() => {

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

/* ===== TIKI ASSET LIBRARY (macro-land pieces). Jungle vegetation + Adventureland structures. draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const JS=(c,x,y,rx)=>{c.fillStyle='rgba(12,40,22,.28)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const JPAL=[['#2f6b3a','#3f8a45','#58a04f','#2a5c35'],['#2b6a46','#3a8a58','#4fa56a','#25583b'],['#3d7a34','#58a03f','#76b84e','#336a2c'],['#2a6048','#37805e','#4c9c74','#234f3b']];
const JSTONE='#b5ae94',JSTONE_D='#8c866e',JSTONE_L='#cfc9b0',JMOSS='#5f8f3f';
const JFROND=(c,x,y,ang,len,u,col,mid,droop)=>{const ex=x+Math.cos(ang)*len,ey=y+Math.sin(ang)*len*0.6+len*(droop||0.35),mx=x+Math.cos(ang)*len*0.55,my=y+Math.sin(ang)*len*0.7-len*0.25;
  c.lineCap='round';c.strokeStyle=col;c.lineWidth=u*0.42;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(mx,my,ex,ey);c.stroke();c.strokeStyle=mid;c.lineWidth=u*0.1;c.stroke();
  for(let k=1;k<7;k++){const t=k/7,q=1-t,px=q*q*x+2*q*t*mx+t*t*ex,py=q*q*y+2*q*t*my+t*t*ey,s=len*0.2*(1-t*0.6);TH.ln(c,[px,py],[px+Math.sin(ang)*s*0.5-Math.cos(ang)*s*0.2,py+s*0.55],col,u*0.14);TH.ln(c,[px,py],[px-Math.sin(ang)*s*0.5-Math.cos(ang)*s*0.2,py+s*0.55],col,u*0.14);}};
const JBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.28),shade(col,0.16));
const JVINE=(c,x,y,u,r,n)=>{for(let k=0;k<n;k++){const vx=x+(r()-0.5)*u*2.4,vy=y-r()*u*1.2;TH.ell(c,vx,vy,u*(0.25+r()*0.3),u*(0.18+r()*0.2),r()<0.5?'#4d8a3a':'#3a7030');}};
/* ===== TIKI ASSETS (Adventureland-style): thatch, bamboo, carved totems, tiki bars. draw(c,x,y,u,v): (x,y)=base centre, u=0.075*R, v=variant seed ===== */
const TK={tha:['#e6c97f','#c9a65a','#966f34'],wood:'#7a5230',woodD:'#4a2e1a',red:'#c8402a',teal:'#2a9d8f',yel:'#f2b630',blk:'#2a2018',cream:'#f1e3b8'};
/* thatch cone: base ellipse centre (x,y), apex h above. Strands, tier rings and a ragged fringe. */
function TKCONE(c,x,y,rx,ry,h,u,r){const ay=y-h,g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,TK.tha[0]);g.addColorStop(0.45,TK.tha[1]);g.addColorStop(1,TK.tha[2]);
  c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y);c.lineTo(x,ay);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();
  c.save();c.clip();
  for(let j=1;j<=4;j++){const f=j/5,cy=y-h*(1-f);c.strokeStyle='rgba(60,38,12,.28)';c.lineWidth=u*0.13;c.beginPath();c.ellipse(x,cy+u*0.12,rx*f,ry*f,0,0.05,Math.PI-0.05);c.stroke();c.strokeStyle='rgba(255,236,170,.30)';c.lineWidth=u*0.09;c.beginPath();c.ellipse(x,cy,rx*f,ry*f,0,0.05,Math.PI-0.05);c.stroke();}
  for(let k=0;k<=26;k++){const a=Math.PI*k/26;c.strokeStyle=k%2?'rgba(70,44,14,.34)':'rgba(255,238,180,.18)';c.lineWidth=u*0.07;c.beginPath();c.moveTo(x,ay);c.lineTo(x+Math.cos(a)*rx,y+Math.sin(a)*ry);c.stroke();}
  c.restore();
  /* ragged fringe along the lower rim */
  for(let k=0;k<30;k++){const a0=Math.PI*k/30,a1=Math.PI*(k+1)/30,am=(a0+a1)/2,L=u*(0.28+r()*0.28);c.fillStyle=k%2?'#a07a3a':'#8a6830';c.beginPath();c.moveTo(x+Math.cos(a0)*rx,y+Math.sin(a0)*ry);c.lineTo(x+Math.cos(am)*rx*1.01,y+Math.sin(am)*ry+L);c.lineTo(x+Math.cos(a1)*rx,y+Math.sin(a1)*ry);c.closePath();c.fill();}
  TH.ln(c,[x,ay],[x,ay-u*0.8],'#5a3a22',u*0.16);TH.ell(c,x,ay-u*0.85,u*0.2,u*0.2,'#c8402a');}
const TKPAL=['#c8402a','#2a9d8f','#f2b630','#6a3fa0'];
function TKCYL(c,x,y,rx,ry,wh,cols){const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,cols[0]);g.addColorStop(0.5,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y-wh);c.lineTo(x-rx,y);c.ellipse(x,y,rx,ry,0,Math.PI,0,true);c.lineTo(x+rx,y-wh);c.ellipse(x,y-wh,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();}

const TIKI_ASSETS={
  broadleaf:{cat:'tree',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*7+1),H=u*(4.6+r()*1.3),pal=JPAL[v%4];JS(c,x,y,u*2.3);c.lineCap='round';c.strokeStyle='#5f4228';c.lineWidth=u*0.7;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.1,y-H*0.35,x+u*0.05,y-H*0.62);c.stroke();TH.poly(c,[[x-u*0.55,y],[x-u*0.2,y-u*0.9],[x+u*0.15,y-u*0.9],[x+u*0.6,y]],'#5f4228');TH.ln(c,[x-u*0.1,y-H*0.1],[x-u*0.05,y-H*0.55],'#7b5a38',u*0.18);
    TH.ln(c,[x,y-H*0.5],[x-u*1.1,y-H*0.85],'#5f4228',u*0.32);TH.ln(c,[x,y-H*0.55],[x+u*1.2,y-H*0.82],'#5f4228',u*0.3);
    const cy=y-H*0.82;[[0,-0.3,1.9,1.15],[-1.55,-0.1,1.3,1.0],[1.55,-0.1,1.3,1.0],[-0.8,-1.15,1.45,1.0],[0.85,-1.15,1.45,1.0],[0,-1.7,1.2,0.85],[-1.1,0.5,0.9,0.6],[1.1,0.5,0.9,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[(i+(v>>2))%4],r,10));
    for(let k=0;k<4;k++){const vx=x+(r()-0.5)*u*2.6,vy=cy+u*(0.4+r()*0.5);TH.ln(c,[vx,vy],[vx+(r()-0.5)*u*0.3,vy+u*(0.8+r()*0.8)],'#3a7030',u*0.08);}}},
  ceiba:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*5+3),H=u*(8.4+r()*1.6);JS(c,x,y,u*2.6);const t='#8a7d68',td='#6d6150';
    TH.poly(c,[[x-u*1.5,y+u*0.1],[x-u*0.55,y-u*2.2],[x-u*0.45,y-u*0.2]],td);TH.poly(c,[[x+u*1.5,y+u*0.1],[x+u*0.55,y-u*2.2],[x+u*0.45,y-u*0.2]],td);TH.poly(c,[[x-u*0.7,y],[x-u*0.5,y-H*0.78],[x+u*0.5,y-H*0.78],[x+u*0.7,y]],t);TH.poly(c,[[x+u*0.1,y],[x+u*0.1,y-H*0.78],[x+u*0.5,y-H*0.78],[x+u*0.7,y]],'rgba(40,28,18,.25)');
    for(let k=0;k<6;k++)TH.ln(c,[x-u*0.45,y-H*(0.1+k*0.12)],[x+u*0.45,y-H*(0.1+k*0.12)-u*0.1],'rgba(40,28,18,.14)',u*0.07);
    [[-1,0.9],[0,1.0],[1,0.88]].forEach(([d,f])=>TH.ln(c,[x,y-H*0.7],[x+d*u*2.2,y-H*f*0.95],t,u*0.4));const pal=JPAL[v%4],cy=y-H*0.93;
    [[-3.0,0.4,1.7,0.7],[3.0,0.4,1.7,0.7],[-1.7,-0.1,2.0,0.9],[1.7,-0.1,2.0,0.9],[0,-0.35,2.3,0.95],[-0.8,0.5,1.7,0.6],[0.9,0.5,1.7,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,10));}},
  palm:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*11+2),H=u*(5.2+r()*1.6),lean=(r()-0.5)*u*2.0;JS(c,x,y,u*1.3);c.lineCap='round';c.strokeStyle='#a08c68';c.lineWidth=u*0.62;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*0.1,y-H*0.5,x+lean,y-H);c.stroke();c.strokeStyle='#bba67e';c.lineWidth=u*0.2;c.beginPath();c.moveTo(x-u*0.15,y);c.quadraticCurveTo(x+lean*0.1-u*0.15,y-H*0.5,x+lean-u*0.1,y-H);c.stroke();
    for(let k=1;k<9;k++){const t=k/9,q=1-t,px=q*q*x+2*q*t*(x+lean*0.1)+t*t*(x+lean),py=q*q*y+2*q*t*(y-H*0.5)+t*t*(y-H);TH.ln(c,[px-u*0.32,py],[px+u*0.32,py+u*0.05],'rgba(60,40,20,.35)',u*0.06);}
    const cx=x+lean,cy=y-H;[-2.9,-2.35,-1.85,-1.3,-0.7,-0.2].forEach((a,i)=>{JFROND(c,cx,cy,a,u*(2.5+r()*0.5),u,i%2?'#2f7a3a':'#3a8a42','#8fcf6a',0.3);JFROND(c,cx,cy,Math.PI-a-Math.PI*1.0+Math.PI,u*(2.3+r()*0.5),u,i%2?'#3a8a42':'#2f7a3a','#8fcf6a',0.3);});[[-0.25,0.2],[0.25,0.25],[0,0.35]].forEach(([dx,dy])=>TH.ell(c,cx+dx*u,cy+dy*u,u*0.24,u*0.26,'#6b4a22'));}},
  fanPalm:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*3+9);JS(c,x,y,u*1.4);TH.ln(c,[x,y],[x,y-u*1.4],'#6b4a2e',u*0.5);const cy=y-u*1.5;for(let k=0;k<9;k++){const a=-Math.PI+0.15+k/8*(Math.PI-0.3),l=u*(1.7+r()*0.4);c.save();c.translate(x,cy);c.rotate(a+Math.PI/2);TH.ell(c,0,-l*0.62,u*0.62,l*0.62,k%2?'#3a8a45':'#2f7a3a');TH.ln(c,[0,0],[0,-l*1.2],'#8fcf6a',u*0.07);c.restore();}}},
  bamboo:{cat:'tree',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*13+1);JS(c,x,y,u*1.6);const n=6+Math.floor(r()*3);for(let k=0;k<n;k++){const bx=x+(k-n/2)*u*0.36+(r()-0.5)*u*0.2,H=u*(4.8+r()*2.4),lean=(r()-0.5)*u*0.9,col=k%2?'#9bb54a':'#b4c862';c.lineCap='round';c.strokeStyle=col;c.lineWidth=u*0.3;c.beginPath();c.moveTo(bx,y+u*(r()-0.5)*0.3);c.quadraticCurveTo(bx+lean*0.3,y-H*0.5,bx+lean,y-H);c.stroke();
      for(let j=1;j<7;j++){const t=j/7;TH.ln(c,[bx+lean*t*t-u*0.17,y-H*t],[bx+lean*t*t+u*0.17,y-H*t],'#5f7a2a',u*0.06);}
      for(let j=0;j<5;j++){const a=-Math.PI*0.9+j/4*Math.PI*0.8,l=u*(0.9+r()*0.5);TH.ln(c,[bx+lean,y-H],[bx+lean+Math.cos(a)*l,y-H+Math.sin(a)*l*0.7+u*0.25],r()<0.5?'#4f9a3f':'#6fb34a',u*0.16);}}}},
  treeFern:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*17+4),H=u*(2.0+r()*0.8);JS(c,x,y,u*1.4);TH.ln(c,[x,y],[x+u*0.1,y-H],'#4a3a2a',u*0.5);for(let k=0;k<5;k++)TH.ln(c,[x-u*0.2,y-H*(0.15+k*0.17)],[x+u*0.25,y-H*(0.15+k*0.17)],'#6b5238',u*0.07);for(let k=0;k<10;k++){const a=-Math.PI+0.2+k/9*(Math.PI-0.4);JFROND(c,x+u*0.1,y-H,a,u*(1.9+r()*0.5),u,k%2?'#4a9a3f':'#3a8a35','#a8e07a',0.4);}}},
  cecropia:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*19+2),H=u*(5.2+r()*1.2);JS(c,x,y,u*1.4);TH.ln(c,[x,y],[x,y-H*0.7],'#b9ad94',u*0.4);for(let k=1;k<9;k++)TH.ln(c,[x-u*0.2,y-H*0.08*k],[x+u*0.2,y-H*0.08*k],'rgba(70,55,35,.35)',u*0.06);
    [[-1.3,0.95],[0,1.05],[1.3,0.92]].forEach(([dx,f])=>{const bx=x+dx*u,by=y-H*f;TH.ln(c,[x,y-H*0.6],[bx,by+u*0.4],'#a99b82',u*0.22);const lc=['#6fb35a','#8cc66a','#5a9f4a'];for(let k=0;k<7;k++){const a=-Math.PI*0.95+k/6*Math.PI*0.9,l=u*(1.5+r()*0.3);TH.poly(c,[[bx,by],[bx+Math.cos(a-0.22)*l*0.8,by+Math.sin(a-0.22)*l*0.5],[bx+Math.cos(a)*l,by+Math.sin(a)*l*0.55],[bx+Math.cos(a+0.22)*l*0.8,by+Math.sin(a+0.22)*l*0.5]],lc[k%3]);}}) ;}},
  jungleBush:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*29+3),pal=[['#3f8a45','#58a04f','#6fb35a','#2f7a3a'],['#4a9a3f','#6fb34a','#8cc66a','#3a8a35'],['#2f7a3a','#3f8a45','#58a04f','#2a6a38']][v%3];JS(c,x,y,u*1.6);TH.ln(c,[x,y],[x,y-u*0.9],'#5f4228',u*0.4);[[0,-1.9,1.2,0.9],[-0.9,-1.2,1.0,0.8],[0.9,-1.2,1.0,0.8],[0,-1.0,1.4,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,pal[i%4],r,9));}},
  fern:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(12,40,22,.22)');for(let k=0;k<9;k++){const a=-Math.PI+0.15+k/8*(Math.PI-0.3);JFROND(c,x,y-u*0.1,a,u*(1.2+r()*0.45),u,k%2?'#4a9a3f':'#3a8a35','#a8e07a',0.5);}}},
  elephantEar:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+9);TH.ell(c,x+u*0.2,y+u*0.08,u*1.0,u*0.3,'rgba(12,40,22,.22)');[[-0.7,-1.0,-0.5],[0.7,-1.1,0.5],[0,-1.5,0],[-0.2,-0.6,-0.2]].forEach(([dx,dy,rot],i)=>{const px=x+dx*u,py=y+dy*u;TH.ln(c,[x,y],[px,py+u*0.2],'#5f8a3a',u*0.14);c.save();c.translate(px,py);c.rotate(rot);c.fillStyle=i%2?'#3f8a45':'#2f7a3a';c.beginPath();c.moveTo(0,u*0.5);c.bezierCurveTo(-u*0.95,u*0.1,-u*0.8,-u*1.1,0,-u*0.95);c.bezierCurveTo(u*0.8,-u*1.1,u*0.95,u*0.1,0,u*0.5);c.fill();TH.ln(c,[0,u*0.4],[0,-u*0.8],'#8fcf6a',u*0.06);c.restore();});}},
  heliconia:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*7+2);TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.28,'rgba(12,40,22,.22)');[[-0.7,-1.5],[0.7,-1.6],[0,-2.0]].forEach(([dx,dy],i)=>{c.save();c.translate(x+dx*u*0.4,y);c.rotate(dx*0.35);c.fillStyle=i%2?'#3a8a42':'#2f7a3a';c.beginPath();c.ellipse(0,dy*u*0.5,u*0.38,u*0.85,0,0,7);c.fill();TH.ln(c,[0,0],[0,dy*u*0.9],'#8fcf6a',u*0.05);c.restore();});
    [[0.25,-1.8,'#d9433b'],[-0.35,-1.5,'#f08a24']].forEach(([dx,dy,col])=>{for(let k=0;k<4;k++)TH.poly(c,[[x+dx*u+k*u*0.12,y+dy*u+k*u*0.28],[x+dx*u+u*0.35+k*u*0.12,y+dy*u+k*u*0.28+u*0.15],[x+dx*u+u*0.1+k*u*0.12,y+dy*u+k*u*0.28+u*0.4]],col);});}},
  flowerBush:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*11+4),cols=[['#e86aa8','#f4a6cb'],['#d9433b','#f08a24'],['#f2c230','#fff0a0'],['#8a5ac8','#c9a6f0']][v%4];TH.ell(c,x+u*0.2,y+u*0.08,u*1.0,u*0.3,'rgba(12,40,22,.22)');[[-0.55,-0.5,0.8,0.55],[0.55,-0.5,0.8,0.55],[0,-0.9,0.85,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#3a8a45','#2f7a3a','#4a9a3f'][i],r,8));for(let k=0;k<11;k++){const fx=x+(r()-0.5)*u*1.7,fy=y-u*(0.3+r()*1.0);TH.ell(c,fx,fy,u*0.17,u*0.15,cols[k%2]);TH.ell(c,fx,fy,u*0.06,u*0.06,'#fff6c0');}}},
  jungleGrass:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);for(let k=0;k<13;k++){const a=-1.1+k/12*2.2+(r()-0.5)*0.2,l=u*(0.7+r()*0.8);TH.ln(c,[x+(r()-0.5)*u*0.6,y],[x+Math.sin(a)*l*0.8+(r()-0.5)*u*0.3,y-l],['#4f9a3f','#6fb34a','#3a8a35'][k%3],u*0.09);}}},
  banana:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*13+5);JS(c,x,y,u*1.3);TH.ln(c,[x,y],[x,y-u*1.8],'#8fa55a',u*0.5);for(let k=0;k<6;k++){const a=-Math.PI+0.2+k/5*(Math.PI-0.4);const ex=x+Math.cos(a)*u*2.0,ey=y-u*1.8+Math.sin(a)*u*0.8+u*0.9;c.fillStyle=k%2?'#4a9a3f':'#3a8a35';c.beginPath();c.moveTo(x,y-u*1.8);c.quadraticCurveTo(x+Math.cos(a)*u*1.1,y-u*2.8,ex,ey);c.quadraticCurveTo(x+Math.cos(a)*u*1.0,y-u*1.6,x,y-u*1.8);c.fill();TH.ln(c,[x,y-u*1.8],[ex,ey],'#a8e07a',u*0.05);}
    TH.ln(c,[x,y-u*1.7],[x+u*0.4,y-u*1.0],'#6b8a3a',u*0.1);for(let k=0;k<5;k++)TH.ell(c,x+u*0.4+(k%2)*u*0.15,y-u*(0.7+k*0.1),u*0.14,u*0.09,'#e8c83a');}},
  mossBoulders:{cat:'rock',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.8,'#8d9086'],[0.7,0.2,0.8,0.7,'#9a9d92'],[0,-0.35,0.7,0.6,'#80847a']].forEach(([dx,dy,rx,ry,col])=>{const px=x+dx*u,py=y+dy*u,sx=u*rx,sy=u*ry*(1+r()*0.2);TH.ell(c,px+sx*0.15,py+sy*0.3,sx*1.05,sy*0.45,'rgba(12,40,22,.25)');TH.poly(c,[[px-sx,py],[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px-sx*0.6,py+sy*0.2]],col);TH.poly(c,[[px+sx*0.25,py-sy*0.98],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px+sx*0.2,py+sy*0.05]],shade(col,-0.25));TH.poly(c,[[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.1,py-sy*0.5],[px-sx*0.5,py-sy*0.45]],JMOSS);TH.ell(c,px-sx*0.3,py-sy*0.7,sx*0.3,sy*0.15,'rgba(180,230,120,.35)');});}},
  tikiTorch:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(12,40,22,.25)');TH.ln(c,[x,y],[x,y-u*3.0],'#9a8a4a',u*0.3);[0.3,0.55,0.8].forEach(f=>TH.ln(c,[x-u*0.18,y-u*3*f],[x+u*0.18,y-u*3*f],'#5f5a2a',u*0.07));const g=c.createRadialGradient(x,y-u*3.4,0,x,y-u*3.4,u*1.5);g.addColorStop(0,'rgba(255,190,90,.55)');g.addColorStop(1,'rgba(255,190,90,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*3.4,u*1.5,0,7);c.fill();TH.poly(c,[[x-u*0.3,y-u*3.0],[x+u*0.3,y-u*3.0],[x+u*0.1,y-u*3.9],[x,y-u*4.1],[x-u*0.1,y-u*3.8]],'#f08a24');TH.poly(c,[[x-u*0.15,y-u*3.0],[x+u*0.15,y-u*3.0],[x,y-u*3.6]],'#ffe27a');}},
  crates:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.4,u*0.4,'rgba(12,40,22,.25)');const w='#b0884e';TH.box(c,x,y,u,-0.9,0.1,-0.6,0.5,0,0.9,w,shade(w,-0.28),shade(w,0.16));TH.box(c,x,y,u,0.2,1.2,-0.5,0.5,0,0.8,'#9a7440',shade('#9a7440',-0.28),shade('#9a7440',0.16));TH.box(c,x,y,u,-0.6,0.4,-0.5,0.4,0.9,1.7,'#c19a5c',shade('#c19a5c',-0.28),shade('#c19a5c',0.16));
    [[-0.4,0.51,0.1],[-0.4,0.51,0.8]].forEach(([X,Y,Z])=>0);TH.ln(c,I(-0.9,0.51,0.45),I(0.1,0.51,0.45),'rgba(50,30,10,.4)',u*0.07);TH.ln(c,I(-0.1,0.41,1.3),I(0.4,0.41,1.3),'rgba(50,30,10,.4)',u*0.07);}},
  signpost:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.25,'rgba(12,40,22,.25)');TH.ln(c,[x,y],[x,y-u*2.8],'#6a4a2a',u*0.28);[[-1,-2.5,'#b0884e'],[1,-1.8,'#c19a5c']].forEach(([d,h,col])=>{TH.poly(c,[[x,y+h*u-u*0.3],[x+d*u*1.5,y+h*u-u*0.3],[x+d*u*1.9,y+h*u],[x+d*u*1.5,y+h*u+u*0.3],[x,y+h*u+u*0.3]],col,'#6a4a2a',u*0.05);TH.ln(c,[x+d*u*0.3,y+h*u],[x+d*u*1.2,y+h*u],'rgba(50,30,10,.45)',u*0.06);});}},
  /* ---------- new: thatch, bamboo, totems, tiki bars ---------- */
  thatchHut:{cat:'struct',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*9+1),rx=2.1*u,ry=1.05*u,wh=2.1*u,acc=TKPAL[v&3];JS(c,x,y,u*3.8);
    TKCYL(c,x,y,rx,ry,wh,['#dcc682','#c2a85e','#86703a']);
    for(let k=1;k<14;k++){const a=Math.PI*k/14,px=x+Math.cos(a)*rx,py=y+Math.sin(a)*ry;TH.ln(c,[px,py],[px,py-wh],'rgba(70,50,20,.32)',u*0.06);}
    c.strokeStyle=acc;c.lineWidth=u*0.5;c.beginPath();c.ellipse(x,y-wh+u*0.42,rx,ry,0,0.02,Math.PI-0.02);c.stroke();
    const a=Math.PI/2+0.42,dx=x+Math.cos(a)*rx,dy=y+Math.sin(a)*ry;c.fillStyle='#2e2014';c.beginPath();c.moveTo(dx-u*0.5,dy);c.lineTo(dx-u*0.5,dy-u*1.1);c.quadraticCurveTo(dx,dy-u*1.8,dx+u*0.5,dy-u*1.1);c.lineTo(dx+u*0.5,dy);c.closePath();c.fill();TH.ln(c,[dx-u*0.5,dy-u*1.1],[dx+u*0.5,dy-u*1.1],'#5a3a22',u*0.07);
    if(v&4){const wa=Math.PI/2-0.75,wx=x+Math.cos(wa)*rx,wy=y+Math.sin(wa)*ry;TH.poly(c,[[wx-u*0.35,wy-u*1.5],[wx+u*0.35,wy-u*1.5],[wx+u*0.35,wy-u*0.8],[wx-u*0.35,wy-u*0.8]],'#2e2014');TH.ln(c,[wx,wy-u*1.5],[wx,wy-u*0.8],'#7a5a30',u*0.06);}
    TKCONE(c,x,y-wh+u*0.15,3.25*u,1.62*u,3.5*u,u,r);}},
  longhouse:{cat:'struct',rho:0.14,draw(c,x,y,u,v){const r=mulberry(v*7+3),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),acc=TKPAL[(v>>1)&3];JS(c,x,y,u*5.2);
    const wall=(pts,col)=>TH.poly(c,pts,col);
    wall([I(-3.4,1.5,0),I(3.4,1.5,0),I(3.4,1.5,2),I(-3.4,1.5,2)],'#c9b068');wall([I(3.4,-1.5,0),I(3.4,1.5,0),I(3.4,1.5,2),I(3.4,-1.5,2)],'#8f7a3c');
    for(let k=1;k<18;k++){const X=-3.4+6.8*k/18,a=I(X,1.5,0),b=I(X,1.5,2);TH.ln(c,a,b,'rgba(70,50,20,.3)',u*0.06);}
    for(let k=1;k<6;k++){const Y=-1.5+3*k/6,a=I(3.4,Y,0),b=I(3.4,Y,2);TH.ln(c,a,b,'rgba(40,28,10,.3)',u*0.06);}
    TH.poly(c,[I(-0.9,1.5,0),I(0.5,1.5,0),I(0.5,1.5,1.5),I(-0.9,1.5,1.5)],'#2e2014');TH.poly(c,[I(1.6,1.5,0.7),I(2.8,1.5,0.7),I(2.8,1.5,1.5),I(1.6,1.5,1.5)],'#2e2014');TH.poly(c,[I(1.6,1.5,0.7),I(2.8,1.5,0.7),I(2.8,1.5,0.85),I(1.6,1.5,0.85)],acc);
    [-3.3,3.3].forEach(X=>TH.ln(c,I(X,2.05,0),I(X,2.05,1.9),'#6a4426',u*0.28));
    const ridge=5.4,E=[[-3.9,2.1,1.7],[3.9,2.1,1.7]];
    const g=c.createLinearGradient(I(-3.9,0,0)[0],0,I(3.9,0,0)[0],0);g.addColorStop(0,'#e6c97f');g.addColorStop(1,'#c9a65a');
    c.fillStyle=g;c.beginPath();[I(-3.9,2.1,1.7),I(3.9,2.1,1.7),I(3.9,0,ridge),I(-3.9,0,ridge)].forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();
    for(let k=0;k<=30;k++){const X=-3.9+7.8*k/30;TH.ln(c,I(X,2.1,1.7),I(X,0,ridge),k%2?'rgba(70,44,14,.32)':'rgba(255,238,180,.2)',u*0.07);}
    for(let j=1;j<=4;j++){const f=j/5,Y=2.1*(1-f),Z=1.7+(ridge-1.7)*f;TH.ln(c,I(-3.9,Y,Z),I(3.9,Y,Z),'rgba(60,38,12,.26)',u*0.12);}
    TH.poly(c,[I(3.9,-2.1,1.7),I(3.9,2.1,1.7),I(3.9,0,ridge)],'#a07c3c');for(let k=1;k<10;k++){const t=k/10;TH.ln(c,I(3.9,-2.1+4.2*t,1.7),I(3.9,0,ridge),'rgba(60,38,12,.3)',u*0.07);}
    for(let k=0;k<32;k++){const t0=k/32,t1=(k+1)/32,a=I(-3.9+7.8*t0,2.1,1.7),b=I(-3.9+7.8*t1,2.1,1.7),m=[(a[0]+b[0])/2,(a[1]+b[1])/2+u*(0.28+r()*0.25)];c.fillStyle=k%2?'#a07a3a':'#8a6830';c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(m[0],m[1]);c.lineTo(b[0],b[1]);c.closePath();c.fill();}
    TH.ln(c,I(-3.9,0,ridge),I(3.9,0,ridge),'#6a4a22',u*0.34);
    [[3.9,0.25],[3.9,-0.25]].forEach(([X,s])=>TH.ln(c,I(X,0,ridge),I(X+0.1,s*3,ridge+1.5),'#4a2e1a',u*0.18));
  }},
  tikiBar:{cat:'struct',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*5+2),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),BX=(a,b,d,e,f,g,col)=>TH.box(c,x,y,u,a,b,d,e,f,g,col,shade(col,-0.28),shade(col,0.16));JS(c,x,y,u*4.2);
    BX(-2.9,2.9,-1.8,1.8,0,0.22,'#a8844e');
    [[-2.6,-1.6],[2.6,-1.6]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0.2),I(X,Y,4.2),'#bfa75c',u*0.34));
    BX(-2.4,2.4,-1.7,-1.3,0.22,2.7,'#5a3a22');for(let k=0;k<6;k++){const X=-2+k*0.8,col=['#2a9d8f','#c8402a','#f2b630','#7ab8d8','#6a3fa0','#8fcf6a'][k%6];BX(X-0.18,X+0.18,-1.3,-1.0,1.6,2.25,col);BX(X-0.18,X+0.18,-1.3,-1.0,0.9,1.4,shade(col,-0.1));}
    BX(-2.5,2.5,0.4,1.3,0.22,1.5,'#7a5230');BX(-2.5,2.5,1.3,1.38,0.22,1.5,'#2a9d8f');BX(-2.6,2.6,0.3,1.4,1.5,1.7,'#c9a65a');
    [-1.5,0,1.5].forEach(X=>{const p=I(X,2.3,0),top=I(X,2.3,1.1);TH.ln(c,p,top,'#4a2e1a',u*0.16);TH.ell(c,top[0],top[1],u*0.62,u*0.3,'#c8402a');TH.ell(c,top[0],top[1]-u*0.08,u*0.5,u*0.22,'#e8604a');});
    [[-2.6,1.6],[2.6,1.6]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0.2),I(X,Y,4.2),'#d8c27c',u*0.34));
    const rc=I(0,0,4.1);TKCONE(c,rc[0],rc[1],4.7*u,2.3*u,2.2*u,u,r);
    [[-3.6,0.9],[0,1.6],[3.6,0.9]].forEach(([dx,dy],i)=>{const lx=rc[0]+dx*u*0.95,ly=rc[1]+(i===1?2.3:1.5)*u+dy*u*0.2+u*0.4;TH.ln(c,[lx,ly-u*0.2],[lx,ly+u*0.5],'#3a2a18',u*0.05);const gg=c.createRadialGradient(lx,ly+u*0.9,0,lx,ly+u*0.9,u*1.5);gg.addColorStop(0,'rgba(255,190,90,.5)');gg.addColorStop(1,'rgba(255,190,90,0)');c.fillStyle=gg;c.beginPath();c.arc(lx,ly+u*0.9,u*1.5,0,7);c.fill();TH.ell(c,lx,ly+u*0.9,u*0.36,u*0.46,'#f2a03a');TH.ell(c,lx,ly+u*0.85,u*0.2,u*0.28,'#ffe27a');});}},
  treehouse:{cat:'struct',rho:0.2,draw(c,x,y,u,v){const r=mulberry(v*11+4),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),BX=(a,b,d,e,f,g,col)=>TH.box(c,x,y,u,a,b,d,e,f,g,col,shade(col,-0.28),shade(col,0.16));JS(c,x,y,u*5.6);
    /* buttress roots + trunk */
    const tw=u*1.7;c.fillStyle='#6a4a2c';[[-1,1],[1,1],[-0.4,0.8],[0.5,0.9]].forEach(([s,k],i)=>{c.beginPath();c.moveTo(x+s*tw*0.5,y-u*2.4);c.quadraticCurveTo(x+s*tw*1.1,y-u*0.7,x+s*tw*(1.9+i*0.15),y+u*0.25*(i%2));c.lineTo(x+s*tw*0.2,y);c.closePath();c.fill();});
    const tg=c.createLinearGradient(x-tw,0,x+tw,0);tg.addColorStop(0,'#8a6a44');tg.addColorStop(0.55,'#6e4e2e');tg.addColorStop(1,'#46301c');c.fillStyle=tg;c.beginPath();c.moveTo(x-tw*0.95,y);c.quadraticCurveTo(x-tw*0.7,y-u*3.5,x-tw*0.75,y-u*7.5);c.lineTo(x+tw*0.75,y-u*7.5);c.quadraticCurveTo(x+tw*0.7,y-u*3.5,x+tw*0.95,y);c.closePath();c.fill();
    for(let k=0;k<7;k++){const bx=x+(r()-0.5)*tw*1.2;TH.ln(c,[bx,y-u*0.3],[bx+(r()-0.5)*u*0.3,y-u*(3+r()*4)],'rgba(30,18,8,.28)',u*0.08);}
    /* lower platform with railing and ladder */
    BX(-2.6,2.6,-1.8,1.8,3.0,3.3,'#a8844e');[[-2.5,1.7],[2.5,1.7],[-2.5,-1.7],[2.5,-1.7]].forEach(([X,Y])=>TH.ln(c,I(X,Y,3.3),I(X,Y,4.3),'#6a4426',u*0.14));TH.ln(c,I(-2.5,1.7,4.3),I(2.5,1.7,4.3),'#6a4426',u*0.12);TH.ln(c,I(2.5,1.7,4.3),I(2.5,-1.7,4.3),'#6a4426',u*0.12);
    const l0=I(-1.2,1.9,3.0),l1=I(-1.2,2.6,0),l2=I(-0.6,1.9,3.0),l3=I(-0.6,2.6,0);TH.ln(c,l0,l1,'#d8c27c',u*0.08);TH.ln(c,l2,l3,'#d8c27c',u*0.08);for(let k=1;k<7;k++){const t=k/7;TH.ln(c,[l0[0]+(l1[0]-l0[0])*t,l0[1]+(l1[1]-l0[1])*t],[l2[0]+(l3[0]-l2[0])*t,l2[1]+(l3[1]-l2[1])*t],'#8a6a3c',u*0.07);}
    /* upper platform + hut */
    BX(-3.1,3.1,-2.1,2.1,6.2,6.5,'#b8945a');[[-3,2],[3,2],[3,-2],[-3,-2]].forEach(([X,Y])=>TH.ln(c,I(X,Y,6.5),I(X,Y,7.5),'#6a4426',u*0.14));TH.ln(c,I(-3,2,7.5),I(3,2,7.5),'#6a4426',u*0.12);TH.ln(c,I(3,2,7.5),I(3,-2,7.5),'#6a4426',u*0.12);
    BX(-1.6,1.6,-1.0,1.0,6.5,8.5,'#c9b068');TH.poly(c,[I(-0.4,1.0,6.5),I(0.6,1.0,6.5),I(0.6,1.0,7.9),I(-0.4,1.0,7.9)],'#2e2014');
    const rc=I(0,0,8.4);TKCONE(c,rc[0],rc[1],2.9*u,1.45*u,2.7*u,u,r);
    /* canopy */
    const pal=[['#2f6b3a','#3f8a45','#58a04f'],['#2b6a46','#3a8a58','#4fa56a']][v&1];[[-3.6,-11.5,3.2],[0.2,-13.2,3.6],[3.8,-11.2,3.1],[-1.6,-9.4,2.6],[2.0,-9.0,2.4],[-5.0,-8.8,2.0],[5.4,-8.6,2.0]].forEach(([dx,dy,s],i)=>TH.blob(c,x+dx*u,y+dy*u,u*s,u*s*0.7,pal[i%3],r,9));
    for(let k=0;k<9;k++){const vx=x+(r()-0.5)*u*9,vy=y-u*(8.5+r()*2);TH.ln(c,[vx,vy],[vx+(r()-0.5)*u*0.3,vy+u*(2+r()*3)],'#4d8a3a',u*0.08);}
  }},
  totemPole:{cat:'ruin',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*3+5),cols=[['#c8402a','#e0603f'],['#2a9d8f','#44bdae'],['#f2b630','#f8d060'],['#2a2018','#4a3828']],ord=[[0,1,2,3],[1,0,3,2],[2,3,0,1],[3,2,1,0]][v&3];JS(c,x,y,u*2.2);
    TH.ell(c,x,y+u*0.05,u*1.6,u*0.6,'#8d8670');TH.ell(c,x,y-u*0.1,u*1.3,u*0.45,'#a8a18a');
    const w=u*1.45,sh=u*2.15;let by=y-u*0.2;
    ord.forEach((ci,i)=>{const top=by-sh,col=cols[ci];const g=c.createLinearGradient(x-w,0,x+w,0);g.addColorStop(0,col[1]);g.addColorStop(1,shade(col[0],-0.25));c.fillStyle=g;c.fillRect(x-w,top,w*2,sh);c.strokeStyle='#1a120a';c.lineWidth=u*0.1;c.strokeRect(x-w,top,w*2,sh);
      const k=(ci+(v>>2))%4,mx=x,my=top+sh*0.5,eye=(ex,ey,rr)=>{TH.ell(c,ex,ey,rr,rr*0.9,'#f6efe0');TH.ell(c,ex,ey,rr*0.5,rr*0.5,'#1a120a');};
      if(k===0){TH.ln(c,[x-w*0.8,top+sh*0.28],[x-w*0.15,top+sh*0.2],'#1a120a',u*0.14);TH.ln(c,[x+w*0.8,top+sh*0.28],[x+w*0.15,top+sh*0.2],'#1a120a',u*0.14);eye(x-w*0.45,top+sh*0.38,u*0.34);eye(x+w*0.45,top+sh*0.38,u*0.34);TH.ell(c,mx,top+sh*0.6,u*0.22,u*0.16,'#1a120a');c.fillStyle='#1a120a';c.fillRect(x-w*0.7,top+sh*0.74,w*1.4,sh*0.18);for(let t=0;t<5;t++)c.fillStyle='#f6efe0',c.fillRect(x-w*0.62+t*w*0.27,top+sh*0.74,w*0.17,sh*0.09);}
      else if(k===1){eye(x-w*0.5,top+sh*0.3,u*0.4);eye(x+w*0.5,top+sh*0.3,u*0.4);c.strokeStyle='#1a120a';c.lineWidth=u*0.14;c.beginPath();c.moveTo(x-w*0.8,top+sh*0.62);c.quadraticCurveTo(x,top+sh*0.9,x+w*0.8,top+sh*0.62);c.stroke();TH.ell(c,x-w*0.15,top+sh*0.5,u*0.08,u*0.08,'#1a120a');TH.ell(c,x+w*0.15,top+sh*0.5,u*0.08,u*0.08,'#1a120a');}
      else if(k===2){eye(x-w*0.5,top+sh*0.3,u*0.3);eye(x+w*0.5,top+sh*0.3,u*0.3);TH.poly(c,[[x-w*0.3,top+sh*0.36],[x+w*0.3,top+sh*0.36],[x+w*0.22,top+sh*0.68],[x,top+sh*0.92],[x-w*0.22,top+sh*0.62]],'#1a120a');TH.poly(c,[[x-w*0.22,top+sh*0.4],[x+w*0.22,top+sh*0.4],[x+w*0.14,top+sh*0.66],[x,top+sh*0.82]],'#c8402a');}
      else{eye(x-w*0.42,top+sh*0.4,u*0.3);eye(x+w*0.42,top+sh*0.4,u*0.3);TH.poly(c,[[x-w*0.2,top+sh*0.55],[x+w*0.2,top+sh*0.55],[x,top+sh*0.78]],'#f2b630');c.strokeStyle='#f6efe0';c.lineWidth=u*0.12;for(let t=0;t<4;t++){c.beginPath();c.moveTo(x-w*0.75+t*w*0.5,top+sh*0.1);c.lineTo(x-w*0.75+t*w*0.5,top+sh*0.2);c.stroke();}}
      by=top;
      if(i===1||i===3){const wy=top+sh*0.22,wl=u*(i===3?2.5:1.9);[-1,1].forEach(s=>{TH.poly(c,[[x+s*w,wy],[x+s*(w+wl),wy-u*0.4],[x+s*(w+wl*0.9),wy+u*0.5],[x+s*w,wy+u*0.7]],cols[ord[(i+1)%4]][0],'#1a120a',u*0.08);TH.ln(c,[x+s*w,wy+u*0.2],[x+s*(w+wl*0.8),wy+u*0.1],'#1a120a',u*0.06);});}});
    TH.poly(c,[[x-w,by],[x+w,by],[x+w*0.7,by-u*0.5],[x,by-u*0.9],[x-w*0.7,by-u*0.5]],'#6a4426','#1a120a',u*0.08);}},
  tikiIdol:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+7),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),BX=(a,b,d,e,f,g,col)=>TH.box(c,x,y,u,a,b,d,e,f,g,col,shade(col,-0.28),shade(col,0.16));JS(c,x,y,u*3.4);
    BX(-2.6,2.6,-1.7,1.7,0,0.6,'#a8a18a');BX(-2.0,2.0,-1.3,1.3,0.6,1.2,'#b8b19a');
    const y0=y-u*1.15,wb=u*1.45,wt=u*1.85,H=u*5.4,S='#8d8670',SD='#68624e',SL='#aaa38c';
    TH.poly(c,[[x+wb,y0],[x+wb+u*0.9,y0-u*0.45],[x+wt+u*0.9,y0-H-u*0.45],[x+wt,y0-H]],SD);
    const g=c.createLinearGradient(x-wt,0,x+wt,0);g.addColorStop(0,SL);g.addColorStop(1,S);c.fillStyle=g;c.beginPath();c.moveTo(x-wb,y0);c.lineTo(x+wb,y0);c.lineTo(x+wt,y0-H);c.lineTo(x-wt,y0-H);c.closePath();c.fill();
    TH.poly(c,[[x-wt,y0-H],[x+wt,y0-H],[x+wt+u*0.9,y0-H-u*0.45],[x-wt+u*0.9,y0-H-u*0.45]],SL);
    const fy=y0-H;TH.poly(c,[[x-wt*0.95,fy+H*0.18],[x+wt*0.95,fy+H*0.18],[x+wt*0.95,fy+H*0.3],[x-wt*0.95,fy+H*0.3]],'#4a4636');
    [-1,1].forEach(s=>{TH.ell(c,x+s*wt*0.45,fy+H*0.4,u*0.5,u*0.38,'#1c1a12');TH.ell(c,x+s*wt*0.45,fy+H*0.4,u*0.2,u*0.2,'#f6efe0');TH.ell(c,x+s*wt*0.45,fy+H*0.41,u*0.1,u*0.1,'#1c1a12');});
    TH.poly(c,[[x-wt*0.2,fy+H*0.34],[x+wt*0.2,fy+H*0.34],[x+wt*0.3,fy+H*0.66],[x-wt*0.3,fy+H*0.66]],SL);TH.ell(c,x-wt*0.14,fy+H*0.64,u*0.1,u*0.08,'#2a281c');TH.ell(c,x+wt*0.14,fy+H*0.64,u*0.1,u*0.08,'#2a281c');
    c.fillStyle='#1c1a12';c.fillRect(x-wt*0.55,fy+H*0.74,wt*1.1,H*0.11);for(let t=0;t<5;t++)c.fillStyle='#f6efe0',c.fillRect(x-wt*0.5+t*wt*0.22,fy+H*0.74,wt*0.14,H*0.055);
    /* topknot + flower lei */
    TKCYL(c,x+u*0.4,fy-u*0.25,u*1.2,u*0.5,u*0.9,['#9a5a3a','#b8704a','#6a3a22']);TH.ell(c,x+u*0.4,fy-u*1.15,u*1.2,u*0.5,'#c8806a');
    for(let k=0;k<12;k++){const t=k/11,px=x-wb*0.85+t*wb*1.7,py=y0-H*0.05+Math.sin(t*Math.PI)*u*0.5;TH.ell(c,px,py,u*0.22,u*0.2,['#f4a6cb','#f2b630','#c8402a','#fff0a0'][k%4]);}
    [[-1.6,0.7],[1.8,0.9]].forEach(([dx,dy])=>TH.blob(c,x+dx*u*1.2,y+dy*u*0.9,u*0.9,u*0.5,'#5f8f3f',r,7));}},
  canoe:{cat:'ruin',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*3+2),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);JS(c,x,y,u*4.2);
    const hull=(y0,w,len,z,col,dark)=>{const pts=[],pts2=[];for(let k=0;k<=16;k++){const t=k/16,X=-len+2*len*t,hw=w*Math.pow(Math.sin(Math.PI*t),0.55);pts.push(I(X,y0-hw,z));pts2.push(I(X,y0+hw,z));}
      c.fillStyle=dark;c.beginPath();pts2.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));pts2.slice().reverse().forEach(p=>c.lineTo(p[0],p[1]+u*0.5));c.closePath();c.fill();
      c.fillStyle=col;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));pts2.slice().reverse().forEach(p=>c.lineTo(p[0],p[1]));c.closePath();c.fill();return[pts,pts2];};
    /* outrigger float + booms */
    hull(2.2,0.22,3.0,0.15,'#8a5a33','#5a3a22');[-1.4,1.4].forEach(X=>TH.ln(c,I(X,0.5,0.35),I(X,2.1,0.2),'#4a2e1a',u*0.12));
    const [p1,p2]=hull(0,0.75,3.6,0.35,'#a8683a','#6a4426');
    c.fillStyle='#2a1c10';c.beginPath();for(let k=2;k<=14;k++){const t=k/16,X=-3.6+7.2*t,hw=0.75*Math.pow(Math.sin(Math.PI*t),0.55)*0.72,p=I(X,-hw*0.9,0.36);k===2?c.moveTo(p[0],p[1]):c.lineTo(p[0],p[1]);}for(let k=14;k>=2;k--){const t=k/16,X=-3.6+7.2*t,hw=0.75*Math.pow(Math.sin(Math.PI*t),0.55)*0.72,p=I(X,hw*0.9,0.36);c.lineTo(p[0],p[1]);}c.closePath();c.fill();
    [-1.6,0,1.6].forEach(X=>TH.ln(c,I(X,-0.62,0.4),I(X,0.62,0.4),'#8a5a33',u*0.18));
    [[-3.6,0],[3.6,0]].forEach(([X,Y],i)=>{const p=I(X,Y,0.4),q=I(X+(i?0.5:-0.5),Y,1.3);TH.ln(c,p,q,'#6a4426',u*0.3);TH.ell(c,q[0],q[1],u*0.22,u*0.22,'#c8402a');});
    [[-0.8,-1.3],[0.3,-1.2]].forEach(([X,Y])=>{TH.ln(c,I(X,Y,0),I(X+0.5,Y-0.2,1.8),'#7a5230',u*0.16);TH.poly(c,[I(X+0.5,Y-0.2,1.8),I(X+0.35,Y-0.1,2.5),I(X+0.65,Y-0.3,2.5)],'#c8402a');});}},
  fruitStand:{cat:'ruin',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*5+9),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),BX=(a,b,d,e,f,g,col)=>TH.box(c,x,y,u,a,b,d,e,f,g,col,shade(col,-0.28),shade(col,0.16));JS(c,x,y,u*3.4);
    [[-2,-1.1],[2,-1.1]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(X,Y,3.0),'#bfa75c',u*0.3));
    BX(-1.9,1.9,-1.1,-0.8,0,2.2,'#5a3a22');BX(-2.0,2.0,0.1,1.0,0,1.2,'#a8683a');BX(-2.1,2.1,0.0,1.1,1.2,1.4,'#c9a65a');
    const fr=[['#f2d640',0],['#f29a30',0.8],['#c8402a',1.6],['#8fcf6a',-0.8],['#8a5a33',-1.6]];fr.forEach(([col,dx],i)=>{const p=I(dx,0.55,1.4);for(let k=0;k<4;k++)TH.ell(c,p[0]+(k%2-0.5)*u*0.55,p[1]-u*0.18*Math.floor(k/2)-u*0.1,u*0.3,u*0.26,k%2?col:shade(col,-0.12));});
    [[-2,1.1],[2,1.1]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(X,Y,3.0),'#d8c27c',u*0.3));
    const stripes=['#2a9d8f','#f1e3b8'];for(let k=0;k<8;k++){const t0=k/8,t1=(k+1)/8,a=I(-2.4+4.8*t0,1.6,2.6),b=I(-2.4+4.8*t1,1.6,2.6),a2=I(-2.4+4.8*t0,-1.3,3.5),b2=I(-2.4+4.8*t1,-1.3,3.5);TH.poly(c,[a,b,b2,a2],stripes[k%2]);TH.poly(c,[[a[0],a[1]],[b[0],b[1]],[(a[0]+b[0])/2,a[1]+u*0.45]],stripes[k%2]);}
    TH.ln(c,I(-2.4,1.6,2.6),I(2.4,1.6,2.6),'#1d6e64',u*0.08);}},
  tikiArch:{cat:'ruin',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*3+1);JS(c,x,y,u*4.6);
    const post=(px)=>{const w=u*0.95,h=u*6.6,g=c.createLinearGradient(px-w,0,px+w,0);g.addColorStop(0,'#9a6a40');g.addColorStop(1,'#5a3a22');c.fillStyle=g;c.fillRect(px-w,y-h,w*2,h);c.strokeStyle='#1a120a';c.lineWidth=u*0.09;c.strokeRect(px-w,y-h,w*2,h);
      [0.18,0.45,0.72].forEach((f,i)=>{const fy=y-h*f-u*0.2,col=[TK.red,TK.teal,TK.yel][(i+(v&1))%3];TH.ell(c,px-w*0.42,fy-u*0.4,u*0.26,u*0.22,'#f6efe0');TH.ell(c,px+w*0.42,fy-u*0.4,u*0.26,u*0.22,'#f6efe0');TH.ell(c,px-w*0.42,fy-u*0.4,u*0.11,u*0.11,'#1a120a');TH.ell(c,px+w*0.42,fy-u*0.4,u*0.11,u*0.11,'#1a120a');c.fillStyle=col;c.fillRect(px-w*0.6,fy+u*0.05,w*1.2,u*0.45);c.fillStyle='#1a120a';c.fillRect(px-w*0.5,fy+u*0.5,w,u*0.2);});TH.ell(c,px,y+u*0.05,w*1.3,u*0.5,'#8d8670');};
    post(x-u*2.6);post(x+u*2.6);
    TH.poly(c,[[x-u*3.9,y-u*6.6],[x+u*3.9,y-u*6.6],[x+u*3.5,y-u*7.5],[x-u*3.5,y-u*7.5]],'#7a5230','#1a120a',u*0.08);
    TKCONE(c,x,y-u*7.5,u*4.3,u*1.0,u*1.9,u,r);
    [-1.6,0,1.6].forEach((dx,i)=>{const lx=x+dx*u,ly=y-u*6.6;TH.ln(c,[lx,ly],[lx,ly+u*0.8],'#3a2a18',u*0.05);const gg=c.createRadialGradient(lx,ly+u*1.4,0,lx,ly+u*1.4,u*1.6);gg.addColorStop(0,'rgba(255,190,90,.5)');gg.addColorStop(1,'rgba(255,190,90,0)');c.fillStyle=gg;c.beginPath();c.arc(lx,ly+u*1.4,u*1.6,0,7);c.fill();TH.ell(c,lx,ly+u*1.4,u*0.4,u*0.55,'#f2a03a');TH.ell(c,lx,ly+u*1.35,u*0.2,u*0.3,'#ffe27a');});
    for(let k=0;k<9;k++){const t=k/8,px=x-u*2.0+t*u*4.0,py=y-u*6.6+Math.sin(t*Math.PI)*u*0.55;TH.ell(c,px,py+u*0.2,u*0.2,u*0.18,['#f4a6cb','#f2b630','#c8402a','#fff0a0'][k%4]);}}},
  hammock:{cat:'ruin',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*3+4);JS(c,x,y,u*3.6);
    [-1,1].forEach(s=>{TH.ln(c,[x+s*u*2.8,y],[x+s*u*2.8,y-u*3.6],'#7a5230',u*0.5);TH.ell(c,x+s*u*2.8,y-u*3.6,u*0.3,u*0.3,'#4a2e1a');});
    const sag=u*1.3,a=[x-u*2.8,y-u*3.4],b=[x+u*2.8,y-u*3.4];c.strokeStyle='#d8c27c';c.lineWidth=u*0.08;c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo(x,a[1]+sag*0.6,x-u*1.9,a[1]+sag*0.78);c.moveTo(b[0],b[1]);c.quadraticCurveTo(x,b[1]+sag*0.6,x+u*1.9,b[1]+sag*0.78);c.stroke();
    c.fillStyle='#c8402a';c.beginPath();c.moveTo(x-u*1.9,a[1]+sag*0.7);c.quadraticCurveTo(x,a[1]+sag*2.1,x+u*1.9,a[1]+sag*0.7);c.lineTo(x+u*1.7,a[1]+sag*0.95);c.quadraticCurveTo(x,a[1]+sag*2.4,x-u*1.7,a[1]+sag*0.95);c.closePath();c.fill();
    c.save();c.clip();for(let k=0;k<12;k++)TH.ln(c,[x-u*1.9+k*u*0.34,a[1]],[x-u*1.9+k*u*0.34,a[1]+sag*3],k%2?'#f6efe0':'#2a9d8f',u*0.17);c.restore();}},
  fireBowl:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.1,u*1.1,u*0.34,'rgba(12,40,22,.26)');[-1,0,1].forEach(s=>TH.ln(c,[x+s*u*0.7,y],[x+s*u*0.2,y-u*1.6],'#4a2e1a',u*0.22));
    const gg=c.createRadialGradient(x,y-u*3.0,0,x,y-u*3.0,u*2.4);gg.addColorStop(0,'rgba(255,190,90,.5)');gg.addColorStop(1,'rgba(255,190,90,0)');c.fillStyle=gg;c.beginPath();c.arc(x,y-u*3.0,u*2.4,0,7);c.fill();
    TH.ell(c,x,y-u*1.8,u*1.15,u*0.45,'#2a2018');c.fillStyle='#4a3a2a';c.beginPath();c.moveTo(x-u*1.15,y-u*1.8);c.quadraticCurveTo(x,y-u*0.7,x+u*1.15,y-u*1.8);c.closePath();c.fill();
    TH.poly(c,[[x-u*0.7,y-u*1.8],[x-u*0.4,y-u*3.2],[x-u*0.15,y-u*2.5],[x+u*0.05,y-u*3.9],[x+u*0.4,y-u*2.6],[x+u*0.7,y-u*3.1],[x+u*0.75,y-u*1.8]],'#f08a24');TH.poly(c,[[x-u*0.4,y-u*1.8],[x-u*0.1,y-u*2.8],[x+u*0.1,y-u*3.2],[x+u*0.35,y-u*1.8]],'#ffe27a');}},
  drums:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+8);TH.ell(c,x+u*0.5,y+u*0.14,u*2.0,u*0.5,'rgba(12,40,22,.26)');
    [[-1.0,0.0,0.62,2.0,'#a8683a'],[0.1,0.2,0.7,2.5,'#8a5a33'],[1.2,0.05,0.56,1.7,'#c8402a']].forEach(([dx,dy,rr,h,col])=>{const px=x+dx*u,py=y+dy*u;TKCYL(c,px,py,rr*u,rr*u*0.5,h*u,[shade(col,0.15),col,shade(col,-0.3)]);TH.ell(c,px,py-h*u,rr*u,rr*u*0.5,'#f1e3b8');TH.ell(c,px,py-h*u,rr*u*0.8,rr*u*0.4,'#e0cf9c');c.strokeStyle='#4a2e1a';c.lineWidth=u*0.07;[0.3,0.7].forEach(f=>{c.beginPath();c.ellipse(px,py-h*u*f,rr*u,rr*u*0.5,0,0.1,Math.PI-0.1);c.stroke();});});}},
  bambooFence:{cat:'prop',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*3+3),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*2.6,u*0.4,'rgba(12,40,22,.22)');
    for(let k=0;k<7;k++){const X=-1.8+k*0.6,h=1.7+(k%2)*0.35,a=I(X,0,0),b=I(X,0,h);TH.ln(c,a,b,k%2?'#bfa75c':'#d8c27c',u*0.3);TH.ell(c,b[0],b[1],u*0.15,u*0.09,'#8f7a3c');}
    [0.6,1.3].forEach(Z=>{TH.ln(c,I(-1.9,0.12,Z),I(1.9,0.12,Z),'#8a6a3c',u*0.17);[-1.2,0,1.2].forEach(X=>{const p=I(X,0.12,Z);TH.ell(c,p[0],p[1],u*0.12,u*0.12,'#4a2e1a');});});}},
  surfboards:{cat:'prop',rho:0.05,draw(c,x,y,u,v){TH.ell(c,x+u*0.4,y+u*0.1,u*1.8,u*0.4,'rgba(12,40,22,.24)');TH.ln(c,[x-u*1.3,y],[x-u*1.3,y-u*1.7],'#6a4426',u*0.26);TH.ln(c,[x+u*1.3,y],[x+u*1.3,y-u*1.7],'#6a4426',u*0.26);TH.ln(c,[x-u*1.3,y-u*1.5],[x+u*1.3,y-u*1.5],'#6a4426',u*0.22);
    [[-0.8,'#f2b630','#c8402a'],[0,'#2a9d8f','#f6efe0'],[0.8,'#c8402a','#f2b630']].forEach(([dx,col,st],i)=>{const bx=x+dx*u,tilt=(i-1)*u*0.28;c.save();c.translate(bx,y-u*0.1);c.rotate(tilt/u*0.12);c.fillStyle=col;c.beginPath();c.ellipse(0,-u*2.4,u*0.62,u*2.5,0,0,7);c.fill();c.fillStyle=st;c.fillRect(-u*0.62,-u*2.6,u*1.24,u*0.34);c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=u*0.07;c.beginPath();c.moveTo(0,-u*4.7);c.lineTo(0,-u*0.2);c.stroke();c.restore();});}},
  parrotPerch:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.9,u*0.26,'rgba(12,40,22,.24)');TH.ln(c,[x,y],[x,y-u*3.8],'#7a5230',u*0.34);TH.ln(c,[x-u*1.2,y-u*3.5],[x+u*1.3,y-u*3.4],'#4a2e1a',u*0.2);
    [[-0.8,'#c8402a','#2a6ad8'],[0.9,'#2a6ad8','#f2b630']].forEach(([dx,body,wing],i)=>{const px=x+dx*u,py=y-u*3.5;TH.ln(c,[px,py],[px+(i?u*0.2:-u*0.2),py+u*1.2],body,u*0.14);TH.ell(c,px,py-u*0.7,u*0.45,u*0.8,body);TH.ell(c,px+(i?u*0.25:-u*0.25),py-u*0.6,u*0.25,u*0.6,wing);TH.ell(c,px,py-u*1.6,u*0.36,u*0.34,body);TH.poly(c,[[px+u*0.2,py-u*1.65],[px+u*0.62,py-u*1.5],[px+u*0.22,py-u*1.38]],'#f6efe0');TH.ell(c,px+u*0.05,py-u*1.7,u*0.07,u*0.07,'#1a120a');});}},
  hibiscus:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+1),col=['#e0303a','#f08a24','#f4a6cb','#f2d640'][v&3];TH.ell(c,x+u*0.3,y+u*0.1,u*1.3,u*0.4,'rgba(12,40,22,.24)');
    [[0,-1.6,1.2,0.9],[-0.9,-1.1,0.9,0.7],[0.9,-1.1,0.9,0.7]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#2f7a3a','#3f8a45','#4f9a50'][i],r,8));
    for(let k=0;k<7;k++){const fx=x+(r()-0.5)*u*2.2,fy=y-u*(0.8+r()*1.7);for(let p=0;p<5;p++){const a=p/5*6.283;TH.ell(c,fx+Math.cos(a)*u*0.24,fy+Math.sin(a)*u*0.2,u*0.2,u*0.16,col);}TH.ell(c,fx,fy,u*0.1,u*0.1,'#ffe27a');}}},
  birdOfParadise:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*7+3);TH.ell(c,x+u*0.3,y+u*0.1,u*1.2,u*0.36,'rgba(12,40,22,.24)');
    for(let k=0;k<5;k++){const a=(k/4-0.5)*1.3,l=u*(2.0+r()*0.8);c.save();c.translate(x+(k-2)*u*0.2,y);c.rotate(a);c.fillStyle=k%2?'#3a8a45':'#2f7a3a';c.beginPath();c.ellipse(0,-l*0.55,u*0.5,l*0.55,0,0,7);c.fill();TH.ln(c,[0,0],[0,-l*1.05],'#8fcf6a',u*0.05);c.restore();}
    for(let k=0;k<3;k++){const fx=x+(k-1)*u*0.9,fy=y-u*(2.6+(k%2)*0.5);TH.ln(c,[fx,y-u*0.8],[fx,fy+u*0.3],'#4f9a50',u*0.12);TH.poly(c,[[fx-u*0.5,fy],[fx,fy-u*0.9],[fx+u*0.5,fy],[fx,fy+u*0.25]],'#f08a24');TH.poly(c,[[fx-u*0.15,fy],[fx+u*0.45,fy-u*0.35],[fx+u*0.2,fy+u*0.15]],'#2a6ad8');TH.poly(c,[[fx-u*0.1,fy-u*0.2],[fx+u*0.05,fy-u*0.75],[fx+u*0.2,fy-u*0.15]],'#c8402a');}}},
  lavaRocks:{cat:'rock',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.8],[0.8,0.2,0.8,0.7],[0,-0.35,0.7,0.6]].forEach(([dx,dy,rx,ry],i)=>{const px=x+dx*u,py=y+dy*u,sx=u*rx,sy=u*ry*(1+r()*0.2),col=['#4a4a52','#3a3a42','#56565e'][i];TH.ell(c,px+sx*0.15,py+sy*0.3,sx*1.05,sy*0.45,'rgba(12,40,22,.28)');TH.poly(c,[[px-sx,py],[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px-sx*0.6,py+sy*0.2]],col);TH.poly(c,[[px+sx*0.25,py-sy*0.98],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px+sx*0.2,py+sy*0.05]],shade(col,-0.3));TH.poly(c,[[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.1,py-sy*0.5],[px-sx*0.5,py-sy*0.45]],shade(col,0.2));
      if(i===1){c.strokeStyle='rgba(255,120,40,.85)';c.lineWidth=u*0.07;c.beginPath();c.moveTo(px-sx*0.3,py-sy*0.5);c.lineTo(px,py-sy*0.2);c.lineTo(px+sx*0.3,py-sy*0.4);c.stroke();}
      if(i===0)TH.blob(c,px-sx*0.2,py+sy*0.1,u*0.55,u*0.22,'#5f8f3f',r,6);});}},
};

/* ===== MACRO-LAND ENGINE (hex geometry, path network, planner, baker) ===== */
const W3=Math.sqrt(3),HX=W3/2,HV=[[HX,0.29],[0,0.58],[-HX,0.29],[-HX,-0.29],[0,-0.58],[HX,-0.29]];
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[0,1,2],[-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5,1.5]],C:[[0],[-0.5,0.5,1.5],[-1,0,1],[-0.5]],D:[[0,1,2],[-0.5,0.5,1.5],[0,1]]};
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

/* ===== TIKI LAND: planner (Jungle-style groves + a thatch village, almost no terrain), sunny tropical ground, generic baker ===== */
const TIKI_REGION={top:{palm:.3,bamboo:.16,broadleaf:.16,fanPalm:.1,jungleBush:.14,treeFern:.08,cecropia:.06},mid:{palm:.3,broadleaf:.16,bamboo:.1,fanPalm:.14,jungleBush:.12,treeFern:.08,cecropia:.04,banana:0},bottom:{palm:.24,fanPalm:.2,jungleBush:.2,broadleaf:.14,treeFern:.12,bamboo:.06}};
const TIKI_LOW=[['jungleBush',1],['fanPalm',1],['treeFern',1.05],['broadleaf',0.62],['palm',0.6],['jungleBush',1.2],['fanPalm',1.15],['broadleaf',0.7]];            /* short species only in the foreground so a hut's base is never hidden */
const TIKI_CAP={ceiba:3,bamboo:9,cecropia:5};
const TIKI_UNDER=['hibiscus','birdOfParadise','fern','elephantEar','heliconia','flowerBush','hibiscus','jungleGrass','banana','birdOfParadise'];
const TIKI_PLAN_CACHE={};
function getTikiPlan(shape){
  if(TIKI_PLAN_CACHE[shape])return TIKI_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(({A:12101,B:12202,C:12318,D:12419})[shape]),placed=[],bb=G.bbox,used={},A=TIKI_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  /* stretched sweet spots: the slot ellipse itself is still sacred, but scenery may now creep right up to it (West kept a much wider margin) */
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho,o2)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.72);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'broadleaf';};
  const capOk=k=>!(TIKI_CAP[k]&&(used[k]||0)>=TIKI_CAP[k]);
  const regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?TIKI_REGION.top:n<0.68?TIKI_REGION.mid:TIKI_REGION.bottom;};
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='tree'?0.88+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;if((D.cat==='rock'||D.cat==='shrub'||D.cat==='prop')&&placed.some(o=>o.noSouth&&Math.abs(px-o.x)<0.3&&py-o.y>-0.05&&py-o.y<0.36))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const tree=(x,y,extra,dom,low)=>{if(low){const L=TIKI_LOW[Math.floor(rng()*TIKI_LOW.length)];return place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return place(dom&&rng()<0.55&&capOk(dom)?dom:pickFrom(regionOf(y),capOk),x,y,extra||{});};
  const under=(x,y,extra)=>place(TIKI_UNDER[Math.floor(rng()*TIKI_UNDER.length)],x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const LKS=G.centers.length/12,landThin=l=>{const n=Math.max(1,Math.round(l.length*LKS));return Array.from({length:n},(_,i)=>l[Math.floor((i+0.5)*l.length/n)]);},landCnt=n=>Math.max(1,Math.round(n*LKS));
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. the back rim: a tall backdrop of bamboo and palms with a few low lava-rock outcrops (almost no terrain), and one banyan treehouse behind the middle */
  {const pts=[];top.forEach(e=>[0.2,0.5,0.8].forEach(t=>pts.push(onEdge(e,t,0.0))));pts.sort((a,b)=>a[0]-b[0]);const x0=pts[0][0],x1=pts[pts.length-1][0],nearest=x=>pts.reduce((b,p)=>Math.abs(p[0]-x)<Math.abs(b[0]-x)?p:b);
    const centers=[];let x=x0+0.12+rng()*0.2;while(x<x1-0.05){centers.push(x);x+=0.8+rng()*0.55;}
    const th=Math.floor(centers.length*0.5);
    centers.forEach((cxp,i)=>{const p=nearest(cxp),bx=p[0],by=p[1],t=rng(),mt=a=>a+(rng()<0.35?1:0),at=(k,dx,dy,ex)=>place(k,bx+dx,by+dy,ex);
      if(i===th){at('treehouse',0,-0.04,{minT:3,scale:1.0,clear:2.2,noSouth:true});at('bamboo',-0.62,0.02,{minT:1});at('bamboo',0.66,0.03,{minT:2});at('lavaRocks',-0.25,0.1,{minT:1});}
      else if(t<0.4){at('bamboo',-0.3,0.0,{minT:mt(1),scale:1.1});at('palm',0.15,-0.02,{minT:mt(2),scale:1.1});at('palm',0.5,0.01,{minT:3,scale:0.9});at('lavaRocks',0.02,0.1,{minT:1});}
      else if(t<0.72){at('palm',-0.3,0.01,{minT:1,scale:1.1});at('bamboo',0.2,-0.02,{minT:mt(2)});at('fanPalm',-0.62,0.04,{minT:2});at('lavaRocks',0.1,0.1,{minT:2});}
      else{at('fanPalm',-0.25,0.01,{minT:mt(1)});at('palm',0.3,0.0,{minT:2,scale:1.15});at('bamboo',0.0,-0.02,{minT:3,scale:0.9});at('mossBoulders',-0.05,0.1,{minT:1});}});
    {const gaps=[];for(let i=0;i+1<centers.length;i++)if(i!==th&&i+1!==th)gaps.push(i);if(!gaps.length)for(let i=0;i+1<centers.length;i++)gaps.push(i);
      [gaps[0],gaps[gaps.length-1]].filter((g,i,a)=>g!==undefined&&a.indexOf(g)===i).forEach((gi,k)=>{const p=nearest((centers[gi]+centers[gi+1])/2);place('ceiba',p[0],p[1]-0.06,{minT:k?4:3,scale:0.95,clear:1.3});});}}
  /* 2. the village: huts, longhouses and tiki bars on the rim and through the middle, then totems, idols, stalls, canoes and arches (farthest-point spacing so nothing clumps) */
  const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.forEach(e=>inn.push([e.mid[0],e.mid[1]]));
  const chosen=placed.filter(o=>o.cat==='ruin'||o.cat==='struct').map(o=>[o.x,o.y]);
  const spread=(k,pool,extra)=>{const ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.22})).sort((a,b)=>b.d-a.d);for(let n=0;n<Math.min(12,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],extra);if(o){chosen.push([o.x,o.y]);return o;}}return null;};
  landThin([['thatchHut',1],['longhouse',2],['tikiBar',3],['thatchHut',4],['longhouse',4]]).forEach(([k,mt])=>spread(k,rim,{minT:mt,scale:1.15,clear:2.5,noSouth:true}));
  landThin([['thatchHut',2],['thatchHut',3],['tikiBar',4]]).forEach(([k,mt])=>spread(k,inn,{minT:mt,scale:1.05,clear:2.8,noSouth:true}));
  landThin([['totemPole',1],['tikiIdol',1],['fruitStand',2],['totemPole',2],['canoe',3],['tikiArch',3],['hammock',3],['fruitStand',3],['tikiIdol',4],['fruitStand',4],['totemPole',4],['canoe',4],['hammock',4]]).forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,scale:k==='totemPole'?1.15:1.1,clear:1.8,noSouth:true}));
  /* 3. trees: interior groves at every junction void, three-tree corridors, one-or-two in the diagonal corridors, then the rim and a fill pass for the corners */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=pickFrom(regionOf(v.y),capOk),n=1+Math.floor(rng()*2.3);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.08:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{const dom=pickFrom(regionOf(e.mid[1]),capOk);[-0.2,0.2].forEach(dy=>{if(rng()<0.7)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.55)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.8+rng()*0.2},null,true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.3));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(e.cls==='top'?-0.02:0)+(rng()-0.2)*0.12)});});
    let mode='grove',run=0,dom='broadleaf';samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.66?'grove':r<0.9?'sparse':'open';run=2+Math.floor(rng()*4);dom=pickFrom(regionOf(s.p[1]),capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){if(e.cls==='top'&&rng()<0.3)return;tree(p[0],p[1],null,dom,low);if(rng()<0.45)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,dom,low);if(rng()<0.12)tree(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,dom,true);}
      else if(mode==='sparse'){if(rng()<0.5)tree(p[0],p[1],null,dom,low);else under(p[0],p[1]);}else if(rng()<0.6)under(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.7)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<10;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.22)tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);}});
  /* 4. undergrowth: ferns, elephant ears, heliconia, flowers, banana plants */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.45)under(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.35)under(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.38)under(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.3)under(px,py);}});
  /* 5. small props: lower tiers only */
  [['tikiTorch',4],['fireBowl',2],['drums',2],['surfboards',1],['bambooFence',3],['parrotPerch',1],['crates',1]].forEach(([k,n])=>{for(let i=0;i<landCnt(n);i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  /* tiers: each object appears at its tier and stays (props leave after tier 2); trees stay >= 68% of the scenery at every tier */
  const cuts={tree:[0.26,0.5,0.77,1],shrub:[0.06,0.38,0.7,1],rock:[0.3,0.55,0.8,1],prop:[1,1,1,1],ruin:[0,0,0,0],struct:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='ruin'||o.cat==='struct')o.tier=o.minT;});
  const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
  for(let t=1;t<=4;t++){let guard=0;while(guard++<300){const c=count(t);if(c.tr/Math.max(1,c.n)>=0.6)break;const pool=placed.filter(o=>o.tier<=t&&t<=o.maxT),cand=(pool.filter(o=>o.cat==='shrub').sort((a,b)=>b.pri-a.pri)[0])||(pool.filter(o=>o.prop&&o.minT>1).sort((a,b)=>b.pri-a.pri)[0]);if(!cand)break;cand.tier=Math.min(5,cand.tier+1);}}
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.sort((a,b)=>a.y-b.y);
  return TIKI_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: sunny tropical lawn with sandy patches, worn earth, scattered petals, shells and coconut husks (decals, not objects) ---- */
function tikiGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<44;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'150,210,100':'40,100,52',r()<0.5?0.2:0.2);}
  for(let k=0;k<12;k++){const p=pt(),w=R*(0.5+r()*0.9);soft(p[0],p[1],w,w*0.4,'232,214,150',0.26);}                  /* sand drifts */
  for(let k=0;k<9;k++){const p=pt(),w=R*(0.25+r()*0.4);soft(p[0],p[1],w,w*0.4,'150,112,66',0.16);}                  /* worn earth */
  for(let k=0;k<10;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'255,244,170',0.17);}                 /* sun dapples */
  for(let k=0;k<150;k++){const p=pt(),h=R*(0.05+r()*0.06);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#5aa845','#78c050','#46963a'][(k+j)%3],R*0.011);}
  for(let k=0;k<60;k++){const p=pt(),a=r()*3.14,l=R*(0.02+r()*0.02);TH.ell(c,p[0],p[1],l,l*0.55,['#f4a6cb','#e0483a','#f2b630','#f08a24','#fff0b0'][k%5],a);}      /* fallen petals */
  for(let k=0;k<26;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.016,R*0.011,'#f6efe0');TH.ell(c,p[0]+R*0.006,p[1]+R*0.003,R*0.008,R*0.006,'rgba(0,0,0,.18)');}   /* shells */
  for(let k=0;k<18;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.022,R*0.014,'#6a4a2c',r()*3);TH.ell(c,p[0]-R*0.004,p[1]-R*0.003,R*0.012,R*0.008,'#8a6a44',r()*3);}      /* coconut husks */
  for(let k=0;k<46;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.011,R*0.009,['#f6efe0','#f2c230','#e86aa8','#d9433b','#fff6c0'][k%5]);}
  c.restore();c.restore();
}
/* ---- generic baker (any theme object {assets, plan, ground, groundCol, seeds}) ---- */

function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol,clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]),key=[T.id,shape,tier,R,m,ground,sc,JSON.stringify(clr),JSON.stringify(opts.clearTiles||[])].join('|');const cached=revisedLandCache.get(key);if(cached)return cached;
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=0.75,top=T.top||1.35,bot=0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);return[cv,g];};
  const [back,cb]=mk();T.ground(cb,G,R,ox,oy,m,ground,({A:11,B:22,C:33,D:44})[shape]);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]),vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho))&&!(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));
  const sprites=vis.map(o=>{const unit=u*(o.scale||1);return {x:m*o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>T.assets[o.kind].draw(ctx,x,y,unit,o.v)};});
  const front=document.createElement('canvas'),frontRect={x:0,y:0,w:1,h:1};front.width=front.height=1;
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return revisedLandCache.set(key,{back,front,frontRect,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0,sprites});
}
function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}
const TIKI_THEME={id:'tiki',assets:TIKI_ASSETS,plan:getTikiPlan,ground:tikiGround,groundCol:'#5c9444',top:1.65};
const TIKI_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
/* public API: same shape as the Western pack */
function bakeLandTiki(shape,tier,R,opts){return bakeLandTheme(TIKI_THEME,shape,tier,R,opts);}
function drawLandTikiBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandTikiFront(ctx,x,y,land){land.sprites.slice().sort((a,b)=>a.y-b.y).forEach(s=>drawScenicSprite(ctx,s,x+s.x,y+s.y));}
function landTikiSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}


return Object.freeze({bake: bakeLandTiki, drawBack: drawLandTikiBack, drawFront: drawLandTikiFront});
})(),
  gothic: (() => {

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

/* ===== GOTHIC ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const GSH=(c,x,y,rx)=>{c.fillStyle='rgba(6,12,10,.36)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const GDARK=[['#102219','#16301f','#0c1a13','#1d3a28'],['#13261c','#1a3425','#0e1d16','#24402e'],['#0f1f18','#152b20','#0a1711','#1b3526']];
const GSTONE='#7a7e87',GSTONE_D='#555962',GSTONE_L='#9298a1',GMOSS='#3a5a3a',GIVY='#27452f',GWOODD='#17120d',GGLOW='#e8d36a';
const GBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.32),shade(col,0.1));
const GFLIP=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
/* lancet (pointed) outline for a face; J(a,z) maps a face coordinate to the screen */
const GLANCET=(J,xc,w,z0,zs,zt)=>{const L=[],R=[];for(let t=0;t<=8;t++){const s=t/8,q=1-s,X=q*q*(xc-w)+2*q*s*(xc-w*0.85)+s*s*xc,Z=q*q*zs+2*q*s*(zs+(zt-zs)*0.85)+s*s*zt;L.push(J(X,Z));R.push(J(2*xc-X,Z));}return [J(xc-w,z0)].concat(L,R.slice().reverse(),[J(xc+w,z0)]);};
const GPATH=(c,pts)=>{pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();};
/* a wall face with real holes (windows / arches show the dark interior) */
const GWALLHOLES=(c,outer,holes,fill,dark)=>{holes.forEach(h=>{c.beginPath();GPATH(c,h);c.fillStyle=dark||'#0b1210';c.fill();});c.beginPath();GPATH(c,outer);holes.forEach(h=>GPATH(c,h));c.fillStyle=fill;c.fill('evenodd');};
const GIVYBLOBS=(c,x,y,u,r,n,spread)=>{for(let k=0;k<n;k++)TH.blob(c,x+(r()-0.5)*u*spread,y-r()*u*1.6,u*(0.3+r()*0.3),u*(0.22+r()*0.2),r()<0.5?'#2a4a30':'#1f3a27',r,7);};
const GBAT=(c,x,y,u)=>{c.fillStyle='#0a0a0e';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.45,y-u*0.5,x-u*0.9,y-u*0.1);c.quadraticCurveTo(x-u*0.55,y,x-u*0.3,y+u*0.18);c.lineTo(x,y+u*0.08);c.lineTo(x+u*0.3,y+u*0.18);c.quadraticCurveTo(x+u*0.55,y,x+u*0.9,y-u*0.1);c.quadraticCurveTo(x+u*0.45,y-u*0.5,x,y);c.fill();};
/* ---- spooky cottages: one parametric body, drawn in 4 orientations (gable/eave front x mirror), leaning, with lit windows ---- */
const GHOUSE_T={
  hauntedManor:{ha:1.3,hb:1.95,h1:3.0,h2:0,jet:0,wall:'#6c7079',beam:null,roof:'#2a2e38',roofD:'#1c2028',rise:2.5,turret:true,crook:0.025,glow:0.65,style:'stone',sw:3.4,sh:1.0},
  crookedTimber:{ha:1.2,hb:1.8,h1:1.4,h2:1.3,jet:0.2,wall:'#575c64',beam:'#14110d',roof:'#363b46',roofD:'#252932',rise:2.2,turret:false,crook:0.075,glow:0.5,style:'timber',sw:3.2,sh:0.95},
  witchCottage:{ha:1.15,hb:1.65,h1:1.3,h2:0,jet:0,wall:'#454a45',beam:'#14110d',roof:'#3b3828',roofD:'#2a281c',rise:2.0,turret:false,crook:0.095,glow:0.9,style:'timber',moss:true,sw:2.9,sh:0.9}
};
function GHOUSE_BODY(c,x,y,u,s,eave,T){const r=mulberry(s*7+3),Iw=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),L=(a,b,z)=>eave?Iw(b,a,z):Iw(a,b,z),LBOX=(a0,a1,b0,b1,z0,z1,col)=>eave?GBOX(c,x,y,u,b0,b1,a0,a1,z0,z1,col):GBOX(c,x,y,u,a0,a1,b0,b1,z0,z1,col);
  const ha=T.ha,hb=T.hb,jet=T.jet,ha2=ha+jet,hb2=hb+jet,zw=T.h1+T.h2,zr=zw+T.rise,lean=T.crook*(s%2?1:-1);
  c.save();c.translate(x,y);c.transform(1,0,-lean,1,0,0);c.translate(-x,-y);
  const faces=(aa,bb,z0,z1)=>[{J:(a,z)=>L(a,bb+0.012,z),p0:-aa,p1:aa},{J:(b,z)=>L(aa+0.012,b,z),p0:-bb,p1:bb}];
  const frame=(F,z0,z1)=>{const n=Math.max(3,Math.round((F.p1-F.p0)/0.8)),w=u*0.11;[z0+0.03,z1-0.03,(z0+z1)/2].forEach(z=>TH.ln(c,F.J(F.p0,z),F.J(F.p1,z),T.beam,w));for(let k=0;k<=n;k++){const p=F.p0+(F.p1-F.p0)*k/n;TH.ln(c,F.J(p,z0),F.J(p,z1),T.beam,w);if(k<n&&r()<0.55)TH.ln(c,F.J(p,z0),F.J(F.p0+(F.p1-F.p0)*(k+1)/n,(z0+z1)/2),T.beam,w*0.8);}};
  const courses=(F,z0,z1)=>{for(let row=0;row<Math.round((z1-z0)/0.3);row++){const z=z0+0.1+row*0.3;for(let k=0;k<Math.round((F.p1-F.p0)/0.45);k++){const p=F.p0+0.05+k*0.45+(row%2)*0.2;TH.ln(c,F.J(p,z),F.J(Math.min(F.p1,p+0.4),z),'rgba(8,12,12,.4)',u*0.05);TH.ln(c,F.J(p,z),F.J(p,z+0.3),'rgba(8,12,12,.32)',u*0.05);}}};
  const window_=(F,p,z0,h,lit,boarded)=>{const w=0.2,pts=GLANCET(F.J,p,w,z0,z0+h*0.62,z0+h);c.beginPath();GPATH(c,pts);if(lit){const g=F.J(p,z0+h*0.5),gr=c.createRadialGradient(g[0],g[1],0,g[0],g[1],u*1.5);gr.addColorStop(0,'rgba(232,211,106,.32)');gr.addColorStop(1,'rgba(232,211,106,0)');c.save();c.fillStyle=gr;c.beginPath();c.arc(g[0],g[1],u*1.5,0,7);c.fill();c.restore();c.beginPath();GPATH(c,pts);c.fillStyle=r()<0.35?'#a8e07a':GGLOW;}else c.fillStyle='#0b1012';c.fill();c.strokeStyle=boarded?'#3a2c1c':'#2a2620';c.lineWidth=u*0.07;c.stroke();if(boarded){TH.ln(c,F.J(p-w,z0+h*0.25),F.J(p+w,z0+h*0.6),'#4a3a28',u*0.1);TH.ln(c,F.J(p-w,z0+h*0.55),F.J(p+w,z0+h*0.2),'#3a2c1c',u*0.1);}else TH.ln(c,F.J(p,z0),F.J(p,z0+h*0.9),'#2a2620',u*0.04);};
  const door=(F,p,hz)=>{const pts=GLANCET(F.J,p,0.34,0,hz*0.7,hz);c.beginPath();GPATH(c,pts);c.fillStyle='#120e0a';c.fill();c.strokeStyle='#3a3228';c.lineWidth=u*0.08;c.stroke();TH.ln(c,F.J(p,0.05),F.J(p,hz*0.88),'#2a2218',u*0.05);TH.ell(c,...F.J(p+0.18,hz*0.4),u*0.05,u*0.05,'#9a8a5a');};
  /* walls */
  LBOX(-ha,ha,-hb,hb,0,T.h1,T.wall);let top=T.h1;if(T.h2){LBOX(-ha2,ha2,-hb2,hb2,T.h1,zw,shade(T.wall,0.04));top=zw;}
  const F1=faces(ha,hb)[0],F2=faces(ha,hb)[1],G1=faces(ha2,hb2)[0],G2=faces(ha2,hb2)[1];
  if(T.style==='stone'){courses(F1,0,T.h1);courses(F2,0,T.h1);}else{frame(F1,0,T.h1);frame(F2,0,T.h1);if(T.h2){frame(G1,T.h1,zw);frame(G2,T.h1,zw);}}
  const doorF=eave?F2:F1,otherF=eave?F1:F2;door(doorF,0,1.3);
  const nlow=T.style==='stone'?2:1;for(let k=0;k<nlow;k++){const p=(k?0.95:-0.95)*(doorF.p1*0.6);if(Math.abs(p)>0.4)window_(doorF,p,0.6,0.85,r()<T.glow,r()<0.25);}
  window_(otherF,otherF.p1*0.0,0.7,0.9,r()<T.glow,r()<0.2);if(T.style==='stone'){window_(otherF,otherF.p1*0.5,0.7,0.9,r()<T.glow,false);window_(otherF,-otherF.p1*0.5,0.7,0.9,r()<T.glow,false);window_(doorF,doorF.p1*0.5,1.7,1.0,true,false);window_(doorF,-doorF.p1*0.5,1.7,1.0,r()<T.glow,false);window_(otherF,0,1.9,1.0,r()<T.glow,false);}
  else if(T.h2){const H1=eave?G2:G1,H2=eave?G1:G2;window_(H1,-0.7,T.h1+0.2,0.85,r()<T.glow,r()<0.3);window_(H1,0.7,T.h1+0.2,0.85,r()<T.glow,r()<0.3);window_(H2,0,T.h1+0.2,0.85,r()<T.glow,false);}
  if(T.moss)for(let k=0;k<7;k++){const f=r()<0.5?F1:F2,p=f.p0+(f.p1-f.p0)*r(),q=f.J(p,0.15+r()*0.5);TH.blob(c,q[0],q[1],u*(0.3+r()*0.35),u*(0.2+r()*0.2),r()<0.5?'#2f5a34':'#3a6a3c',r,7);}
  /* chimney behind the ridge, then the roof planes */
  const ch=T.style==='stone'?1.7:1.2;LBOX(-ha*0.7,-ha*0.7+0.5,-hb*0.7,-hb*0.7+0.5,zw+0.3,zr+0.9,shade(T.wall,-0.1));{const cp=L(-ha*0.7+0.25,-hb*0.7+0.25,zr+1.0);TH.ell(c,cp[0],cp[1],u*0.3,u*0.14,'#0a0c10');if(T.moss){c.fillStyle='rgba(150,230,110,.35)';for(let k=0;k<3;k++){c.beginPath();c.ellipse(cp[0]+k*u*0.12,cp[1]-u*(0.5+k*0.5),u*(0.3+k*0.12),u*0.22,0,0,7);c.fill();}}else{c.fillStyle='rgba(190,196,205,.35)';c.beginPath();c.ellipse(cp[0]+u*0.1,cp[1]-u*0.6,u*0.3,u*0.2,0,0,7);c.fill();}}
  const ov=0.3,rA=L(ha2+ov,-hb2-ov,zw),rB=L(ha2+ov,hb2+ov,zw),rC=L(0,hb2+ov,zr),rD=L(0,-hb2-ov,zr);TH.poly(c,[rA,rB,rC,rD],T.roof);
  const rows=Math.max(5,Math.round(T.rise/0.28));for(let k=1;k<rows;k++){const t=k/rows;TH.ln(c,L(ha2+ov-(ha2+ov)*t,-hb2-ov,zw+T.rise*t),L(ha2+ov-(ha2+ov)*t,hb2+ov,zw+T.rise*t),'rgba(0,0,0,.35)',u*0.05);}
  for(let k=0;k<9;k++){const t=0.12+r()*0.75,bb=-hb2+r()*hb2*2,p=L((ha2+ov)*(1-t),bb,zw+T.rise*t);TH.poly(c,[[p[0]-u*0.22,p[1]],[p[0]+u*0.22,p[1]],[p[0]+u*0.16,p[1]+u*0.2],[p[0]-u*0.16,p[1]+u*0.2]],'#07090c');}
  if(T.moss)for(let k=0;k<8;k++){const t=0.1+r()*0.8,bb=-hb2+r()*hb2*2,p=L((ha2+ov)*(1-t),bb,zw+T.rise*t);TH.blob(c,p[0],p[1],u*(0.3+r()*0.3),u*(0.18+r()*0.15),r()<0.5?'#2f5a34':'#3c6a3a',r,7);}
  const gA=L(-ha2,hb2+0.02,zw),gB=L(ha2,hb2+0.02,zw),gC=L(0,hb2+0.02,zr-0.1);TH.poly(c,[gA,gB,gC],T.style==='stone'?shade(T.wall,-0.05):'#3a3f48');if(T.beam){TH.ln(c,gA,gC,T.beam,u*0.12);TH.ln(c,gB,gC,T.beam,u*0.12);TH.ln(c,L(0,hb2+0.03,zw),gC,T.beam,u*0.1);}
  TH.ln(c,L(-ha2-ov,hb2+ov,zw),L(0,hb2+ov,zr),'#0a0c10',u*0.12);TH.ln(c,L(ha2+ov,hb2+ov,zw),L(0,hb2+ov,zr),'#0a0c10',u*0.12);TH.ln(c,rD,rC,'#0a0c10',u*0.1);
  window_({J:(a,z)=>L(a,hb2+0.03,z)},0,zw+0.15,Math.min(1.6,T.rise*0.55),r()<T.glow,false);
  if(T.turret){const tc=L(-ha+0.2,hb-0.2,0),tt=L(-ha+0.2,hb-0.2,zw+1.4),rr=u*0.78;const g=c.createLinearGradient(tc[0]-rr,0,tc[0]+rr,0);g.addColorStop(0,shade(T.wall,0.12));g.addColorStop(0.6,T.wall);g.addColorStop(1,shade(T.wall,-0.4));c.fillStyle=g;c.beginPath();c.moveTo(tc[0]-rr,tc[1]);c.lineTo(tt[0]-rr,tt[1]);c.lineTo(tt[0]+rr,tt[1]);c.lineTo(tc[0]+rr,tc[1]);c.ellipse(tc[0],tc[1],rr,rr*0.4,0,0,Math.PI);c.closePath();c.fill();
    for(let k=1;k<9;k++)TH.ln(c,[tc[0]-rr,tc[1]-(tc[1]-tt[1])*k/9],[tc[0]+rr,tc[1]-(tc[1]-tt[1])*k/9+u*0.04],'rgba(8,12,12,.3)',u*0.05);const wy=(tc[1]+tt[1])/2;c.beginPath();c.moveTo(tc[0]-u*0.14,wy+u*0.45);c.lineTo(tc[0]-u*0.14,wy-u*0.05);c.quadraticCurveTo(tc[0],wy-u*0.55,tc[0]+u*0.14,wy-u*0.05);c.lineTo(tc[0]+u*0.14,wy+u*0.45);c.closePath();c.fillStyle=GGLOW;c.fill();
    TH.poly(c,[[tt[0]-rr*1.15,tt[1]],[tt[0]+rr*1.15,tt[1]],[tt[0],tt[1]-u*2.4]],'#1c2028');TH.poly(c,[[tt[0],tt[1]-u*2.4],[tt[0]+rr*1.15,tt[1]],[tt[0]+u*0.1,tt[1]]],'#12151b');TH.ln(c,[tt[0],tt[1]-u*2.4],[tt[0],tt[1]-u*3.0],'#0a0c10',u*0.1);}
  const bp=L(0,0,zr+0.2);if(r()<0.8)GBAT(c,bp[0]-u*0.8+r()*u*1.4,bp[1]-u*(0.9+r()*0.8),u*0.8);if(r()<0.5)GBAT(c,bp[0]+u*0.5+r()*u*1.2,bp[1]-u*(1.4+r()*0.9),u*0.7);
  c.restore();}
const GHOUSE=(key)=>({cat:'struct',rho:0.14,draw(c,x,y,u,v){const T=GHOUSE_T[key],o=v&3,s=v>>2,eave=(o>>1)&1;c.fillStyle='rgba(6,12,10,.36)';c.beginPath();c.ellipse(x+u*0.8,y+u*0.2,u*T.sw*(eave?1.2:1),u*T.sh,0,0,7);c.fill();GFLIP(c,x,o&1,()=>GHOUSE_BODY(c,x,y,u,s,eave,T));}});
const GOTHIC_ASSETS={
  /* ---------- trees: very, very dark ---------- */
  gnarledOak:{cat:'tree',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*7+1),H=u*(4.4+r()*1.1),pal=GDARK[v%3];GSH(c,x,y,u*2.3);c.lineCap='round';c.strokeStyle='#1a1410';c.lineWidth=u*0.85;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x-u*0.9,y-H*0.25,x+u*0.9,y-H*0.45,x+u*0.1,y-H*0.62);c.stroke();TH.poly(c,[[x-u*0.7,y],[x-u*0.3,y-u*0.9],[x+u*0.25,y-u*0.9],[x+u*0.75,y]],'#1a1410');TH.ln(c,[x-u*0.2,y-H*0.1],[x+u*0.1,y-H*0.5],'#2c241a',u*0.18);
    [[-1.5,0.82],[1.6,0.78],[-0.9,0.95],[0.8,0.97]].forEach(([dx,f])=>TH.ln(c,[x+u*0.1,y-H*0.55],[x+dx*u,y-H*f],'#1a1410',u*0.3));const cy=y-H*0.82;
    [[0,-0.3,1.9,1.1],[-1.6,0.0,1.2,0.9],[1.6,0.0,1.2,0.9],[-0.8,-1.1,1.4,0.95],[0.85,-1.1,1.4,0.95],[0,-1.6,1.1,0.8]].forEach(([dx,dy,rx,ry],i)=>{if(i===4&&v%3===0)return;TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[(i+(v>>2))%4],r,10);});
    if(v%8===0){const ey=y-H*0.18;TH.ell(c,x-u*0.14,ey,u*0.07,u*0.05,'#e8d36a');TH.ell(c,x+u*0.14,ey,u*0.07,u*0.05,'#e8d36a');}}},
  blackPine:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*11+2),h=u*(5.0+r()*1.6),w=u*1.35,n=7;GSH(c,x,y,u*1.5);TH.ln(c,[x,y],[x,y-h*0.3],'#1a1410',u*0.4);const lean=(r()-0.5)*u*0.3;for(let i=0;i<n;i++){const t=i/n,ww=w*(1-0.82*t)*(0.88+r()*0.24),yb=y-h*(0.14+0.76*t),tip=yb-h*0.3,dy=yb-tip,lx=x+lean*t;
      TH.poly(c,[[lx-ww,yb],[lx-ww*0.6,yb-h*0.03],[lx-ww*0.25,yb+h*0.012],[lx+ww*0.2,yb-h*0.035],[lx+ww*0.62,yb+h*0.01],[lx+ww,yb],[lx,tip]],'#0f241a');TH.poly(c,[[lx,tip],[lx+ww,yb],[lx+ww*0.62,yb+h*0.01],[lx+ww*0.2,yb-h*0.035],[lx,yb]],'#08150f');}}},
  deadTree:{cat:'tree',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*23+1),H=u*(4.0+r()*1.3);GSH(c,x,y,u*1.0);c.lineCap='round';c.strokeStyle='#2a2826';c.lineWidth=u*0.5;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x-u*0.5,y-H*0.3,x+u*0.6,y-H*0.6,x+u*0.1,y-H);c.stroke();TH.ln(c,[x-u*0.15,y],[x-u*0.05,y-H*0.7],'#4a4642',u*0.1);
    const br=[[0.45,-1.2,0.9],[0.55,1.3,1.0],[0.75,-0.9,1.15],[0.85,0.8,1.2],[0.65,1.6,0.95]];br.forEach(([f,dx,fy])=>{const bx=x+(f<0.6?0:0)+dx*u*0.2,by=y-H*f,ex=x+dx*u,ey=y-H*fy;TH.ln(c,[bx,by],[ex,ey],'#2a2826',u*0.2);TH.ln(c,[ex,ey],[ex+dx*u*0.35,ey-u*0.5],'#2a2826',u*0.11);TH.ln(c,[(bx+ex)/2,(by+ey)/2],[(bx+ex)/2+dx*u*0.2,(by+ey)/2-u*0.6],'#2a2826',u*0.1);});
    if(v%4===0){[[0.9,-0.9],[1.1,0.7]].forEach(([dx,fy],i)=>{const cx=x+dx*u,cy2=y-H*(0.9+i*0.12);c.fillStyle='#07070a';c.beginPath();c.ellipse(cx,cy2,u*0.3,u*0.18,0.2,0,7);c.fill();TH.poly(c,[[cx+u*0.25,cy2-u*0.05],[cx+u*0.55,cy2+u*0.02],[cx+u*0.25,cy2+u*0.1]],'#07070a');});}}},
  darkPoplar:{cat:'tree',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*13+1),H=u*(6.4+r()*1.6);GSH(c,x,y,u*1.0);TH.ln(c,[x,y],[x,y-u*1.3],'#1a1410',u*0.34);const pal=['#0e1f16','#12281c','#0a1811','#173020'];for(let k=0;k<9;k++){const t=k/8,yy=y-u*1.2-t*(H-u*1.5),rx=u*(0.55+0.4*Math.sin(Math.min(1,t*1.15)*Math.PI*0.85)),ry=u*0.85;TH.blob(c,x+(r()-0.5)*u*0.25,yy,rx,ry,pal[k%4],r,9);}}},
  weepingDark:{cat:'tree',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*29+3),H=u*(4.6+r()*0.8),pal=GDARK[(v+1)%3];GSH(c,x,y,u*2.2);c.lineCap='round';c.strokeStyle='#1a1410';c.lineWidth=u*0.65;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+u*0.3,y-H*0.4,x-u*0.1,y-H*0.7);c.stroke();const cy=y-H*0.78;[[0,-0.4,1.7,1.0],[-1.2,0,1.2,0.9],[1.2,0,1.2,0.9],[0,-1.0,1.2,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,9));for(let k=0;k<24;k++){const sx=x+(k/23-0.5)*u*3.4,sy=cy+u*0.5+Math.abs(k/23-0.5)*u*0.2,len=u*(1.4+r()*1.8);TH.ln(c,[sx,sy],[sx+(r()-0.5)*u*0.3,Math.min(y-u*0.2,sy+len)],k%2?'#0f2218':'#16301f',u*0.1);}}},
  yewDark:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*19+2);GSH(c,x,y,u*1.7);TH.ln(c,[x,y],[x,y-u*1.0],'#2a1a14',u*0.55);const cols=['#0e1f17','#132a1d','#0a1912','#18331f'];[[0,-2.0,1.25,1.0],[-0.85,-1.3,1.15,0.9],[0.85,-1.3,1.15,0.9],[0,-1.0,1.45,0.85],[0,-2.8,0.85,0.7]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,cols[i%4],r,9));}},
  twistedSapling:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*31+3),pal=GDARK[v%3];GSH(c,x,y,u*1.2);c.lineCap='round';c.strokeStyle='#1a1410';c.lineWidth=u*0.3;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+u*0.5,y-u*0.8,x-u*0.1,y-u*1.6);c.stroke();[[0,-2.0,0.95,0.8],[-0.55,-1.5,0.7,0.6],[0.55,-1.4,0.7,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,pal[i%4],r,8));}},
  /* ---------- undergrowth ---------- */
  thornBush:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+9);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(6,12,10,.3)');[[-0.55,-0.45,0.8,0.55],[0.55,-0.45,0.8,0.55],[0,-0.85,0.85,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#16301f','#102419','#1d3a28'][i],r,8));for(let k=0;k<9;k++){const a=-Math.PI+k/8*Math.PI,l=u*(0.9+r()*0.4);TH.ln(c,[x+Math.cos(a)*u*0.5,y-u*0.5+Math.sin(a)*u*0.3],[x+Math.cos(a)*l,y-u*0.5+Math.sin(a)*l*0.8-u*0.1],'#2a2826',u*0.06);}for(let k=0;k<4;k++)TH.ell(c,x+(r()-0.5)*u*1.3,y-u*(0.3+r()*0.7),u*0.08,u*0.08,'#6a1a1a');}},
  deadBrush:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.26,'rgba(6,12,10,.28)');for(let k=0;k<12;k++){const a=-Math.PI*0.5+(r()-0.5)*2.2,l=u*(0.8+r()*0.9);const ex=x+Math.sin(a)*l,ey=y-Math.cos(a)*l;TH.ln(c,[x+(r()-0.5)*u*0.3,y],[ex,ey],'#3a3836',u*0.07);TH.ln(c,[(x+ex)/2,(y+ey)/2],[(x+ex)/2+(r()-0.5)*u*0.7,(y+ey)/2-u*0.4],'#3a3836',u*0.05);}}},
  mushrooms:{cat:'shrub',rho:0.04,draw(c,x,y,u,v){const r=mulberry(v*7+2);TH.ell(c,x+u*0.15,y+u*0.08,u*0.8,u*0.24,'rgba(6,12,10,.3)');const g=c.createRadialGradient(x,y-u*0.5,0,x,y-u*0.5,u*1.6);g.addColorStop(0,'rgba(160,240,140,.22)');g.addColorStop(1,'rgba(160,240,140,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*0.5,u*1.6,0,7);c.fill();for(let k=0;k<5;k++){const mx=x+(k-2)*u*0.35+(r()-0.5)*u*0.2,my=y-(r()*u*0.25),h=u*(0.5+r()*0.5);TH.ln(c,[mx,my],[mx,my-h],'#d8dcc0',u*0.14);TH.ell(c,mx,my-h,u*(0.28+r()*0.14),u*0.17,k%2?'#b8d890':'#c8e0a0');TH.ell(c,mx-u*0.06,my-h-u*0.04,u*0.08,u*0.05,'#f0f8d8');}}},
  fernDark:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(6,12,10,.28)');for(let k=0;k<9;k++){const a=-Math.PI+0.15+k/8*(Math.PI-0.3),len=u*(1.1+r()*0.45),ex=x+Math.cos(a)*len,ey=y-u*0.1+Math.sin(a)*len*0.6+len*0.4;c.lineCap='round';c.strokeStyle=k%2?'#183a24':'#10281a';c.lineWidth=u*0.4;c.beginPath();c.moveTo(x,y-u*0.1);c.quadraticCurveTo(x+Math.cos(a)*len*0.55,y-u*0.1+Math.sin(a)*len*0.7-len*0.25,ex,ey);c.stroke();}}},
  grassDead:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);for(let k=0;k<13;k++){const a=-1.1+k/12*2.2+(r()-0.5)*0.2,l=u*(0.7+r()*0.8);TH.ln(c,[x+(r()-0.5)*u*0.6,y],[x+Math.sin(a)*l*0.8+(r()-0.5)*u*0.3,y-l],['#4a5240','#3a4234','#5a6250'][k%3],u*0.09);}}},
  darkStones:{cat:'rock',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.8,'#5a5e66'],[0.7,0.2,0.8,0.7,'#666a72'],[0,-0.35,0.7,0.6,'#4c5058']].forEach(([dx,dy,rx,ry,col])=>{const px=x+dx*u,py=y+dy*u,sx=u*rx,sy=u*ry*(1+r()*0.2);TH.ell(c,px+sx*0.15,py+sy*0.3,sx*1.05,sy*0.45,'rgba(6,12,10,.3)');TH.poly(c,[[px-sx,py],[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px-sx*0.6,py+sy*0.2]],col);TH.poly(c,[[px+sx*0.25,py-sy*0.98],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px+sx*0.2,py+sy*0.05]],shade(col,-0.3));TH.poly(c,[[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.1,py-sy*0.5],[px-sx*0.5,py-sy*0.45]],'#2f4a32');});}},
  crumbledWall:{cat:'rock',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*7+2),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.5,y+u*0.12,u*2.4,u*0.4,'rgba(6,12,10,.3)');GBOX(c,x,y,u,-2.0,0.6,-0.3,0.3,0,0.9,'#5a5e66');GBOX(c,x,y,u,0.6,1.3,-0.3,0.3,0,0.5,'#666a72');GBOX(c,x,y,u,-2.0,-1.2,-0.3,0.3,0.9,1.4,'#6a6e76');for(let k=0;k<6;k++)TH.ln(c,I(-1.9+k*0.5,0.31,0.3),I(-1.6+k*0.5,0.31,0.3),'rgba(8,12,12,.4)',u*0.05);GBOX(c,x,y,u,1.5,2.1,0.5,1.0,0,0.3,'#4c5058');for(let k=0;k<5;k++)TH.blob(c,...I(-1.8+r()*3.6,0,0.95),u*0.3,u*0.2,'#2a4a30',r,6);}},
  /* ---------- church ruins (small pieces; the cathedral is the weenie) ---------- */
  chapelRuin:{cat:'ruin',rho:0.14,draw(c,x,y,u,v){const r=mulberry(v*5+3),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),JY=(a,z)=>I(a,1.31,z),JX=(a,z)=>I(1.61,a,z);GFLIP(c,x,v&1,()=>{
      GSH(c,x,y,u*3.4);
      /* collapsed left wall + rubble */
      GBOX(c,x,y,u,-1.6,-1.35,-2.0,0.4,0,0.9,GSTONE_D);GBOX(c,x,y,u,-1.6,-1.35,-2.0,-1.2,0.9,1.6,GSTONE_D);
      /* right (long) wall with three empty lancets and a stepped broken top */
      const xr=1.35,wall=[I(xr+0.25,-2.0,0),I(xr+0.25,1.3,0),I(xr+0.25,1.3,2.6),I(xr+0.25,0.8,2.9),I(xr+0.25,0.3,2.2),I(xr+0.25,-0.3,2.5),I(xr+0.25,-0.8,1.7),I(xr+0.25,-1.3,2.3),I(xr+0.25,-2.0,2.0)];
      const holes=[-1.45,-0.35,0.75].map(yc=>GLANCET((a,z)=>I(xr+0.25,a,z),yc,0.22,0.7,1.5,2.0));
      GBOX(c,x,y,u,xr,xr+0.25,-2.0,1.3,0,0.2,GSTONE_D);GWALLHOLES(c,wall,holes,GSTONE);for(let k=0;k<5;k++)TH.ln(c,I(xr+0.26,-2.0,0.3+k*0.45),I(xr+0.26,1.3,0.3+k*0.45),'rgba(8,12,12,.26)',u*0.05);
      [[-1.9,0.3],[-0.9,0.4],[0.1,0.3]].forEach(([yy,w])=>GBOX(c,x,y,u,xr+0.25,xr+0.55,yy,yy+w,0,1.7,GSTONE_L));
      /* gable end: tall, with a big lancet and a broken rose window */
      const gw=[I(-1.6,1.3,0),I(1.6,1.3,0),I(1.6,1.3,2.5),I(1.2,1.3,3.0),I(0.9,1.3,4.1),I(0.3,1.3,3.6),I(-0.15,1.3,4.5),I(-0.7,1.3,3.7),I(-1.1,1.3,3.2),I(-1.6,1.3,2.6)];
      const big=GLANCET(JY,0,0.5,0.7,2.0,3.2),rose=[];for(let k=0;k<16;k++){const a=k/16*6.283;rose.push(I(0+Math.cos(a)*0.42,1.3,3.45+Math.sin(a)*0.42));}
      GWALLHOLES(c,gw,[big],GSTONE_L);GBOX(c,x,y,u,1.6,1.85,0.5,1.3,0,2.5,GSTONE_D);
      c.beginPath();GPATH(c,rose);c.fillStyle='#0b1210';c.fill();c.strokeStyle='#4c5058';c.lineWidth=u*0.07;c.stroke();for(let k=0;k<5;k++){const a=k/5*6.283;TH.ln(c,I(0,1.31,3.45),I(Math.cos(a)*0.42,1.31,3.45+Math.sin(a)*0.42),'#4c5058',u*0.05);}
      for(let k=0;k<5;k++)TH.ln(c,I(-1.55,1.31,0.35+k*0.55),I(1.55,1.31,0.35+k*0.55),'rgba(8,12,12,.24)',u*0.05);
      /* fallen roof timbers, rubble, ivy */
      TH.ln(c,I(-0.8,-1.2,1.5),I(0.9,0.3,0.4),'#2a1f16',u*0.2);TH.ln(c,I(-0.4,-1.8,1.1),I(0.6,-0.5,0.3),'#1f1710',u*0.18);for(let k=0;k<9;k++)TH.poly(c,[[...I(-1.0+r()*2.2,-1.6+r()*3.0,0.1)].map((q,i)=>q+(i?0:0)),[...I(-1.0+r()*2.2,-1.6+r()*3.0,0.1)]].length?[I(-0.9+r()*2.0,-1.5+r()*2.8,0.05),I(-0.9+r()*2.0,-1.5+r()*2.8,0.05),I(-0.9+r()*2.0,-1.5+r()*2.8,0.05)]:[],r()<0.5?GSTONE:GSTONE_D);
      GIVYBLOBS(c,x+u*0.4,y-u*1.0,u,r,9,4.4);GIVYBLOBS(c,x-u*1.0,y-u*2.6,u,r,5,2.0);for(let k=0;k<5;k++)TH.ln(c,I(-1.4+r()*2.8,1.32,3.0),I(-1.4+r()*2.8,1.32,1.2+r()*1.0),'#27452f',u*0.1);});}},
  gothicArch:{cat:'ruin',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*9+4),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),JY=(a,z)=>I(a,0.31,z);GFLIP(c,x,v&1,()=>{GSH(c,x,y,u*2.0);
      const out=[I(-1.4,0.31,0),I(1.4,0.31,0),I(1.4,0.31,2.4),I(0.9,0.31,3.0),I(0.5,0.31,4.0),I(0,0.31,3.3),I(-0.7,0.31,3.7),I(-1.0,0.31,3.1),I(-1.4,0.31,2.6)];GBOX(c,x,y,u,-1.4,1.4,-0.3,0.3,0,0.25,GSTONE_D);GBOX(c,x,y,u,1.4,1.65,-0.3,0.3,0,2.4,GSTONE_D);
      GWALLHOLES(c,out,[GLANCET(JY,0,0.62,0.25,1.7,2.9)],GSTONE);for(let k=0;k<6;k++)TH.ln(c,I(-1.35,0.32,0.4+k*0.4),I(-0.8,0.32,0.4+k*0.4),'rgba(8,12,12,.26)',u*0.05);GIVYBLOBS(c,x+u*0.4,y-u*1.0,u,r,6,2.6);for(let k=0;k<4;k++)TH.poly(c,[I(1.5+r()*0.8,0.6+r()*0.6,0.05),I(1.5+r()*0.8,0.6+r()*0.6,0.05),I(1.5+r()*0.8,0.6+r()*0.6,0.05)],GSTONE_D);});}},
  ruinedWall:{cat:'ruin',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*7+2),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),JY=(a,z)=>I(a,0.41,z);GFLIP(c,x,v&1,()=>{GSH(c,x,y,u*2.8);
      const out=[I(-2.2,0.41,0),I(2.2,0.41,0),I(2.2,0.41,1.6),I(1.5,0.41,2.1),I(0.8,0.41,1.5),I(0.1,0.41,2.4),I(-0.6,0.41,1.9),I(-1.4,0.41,2.6),I(-2.2,0.41,2.0)];GBOX(c,x,y,u,-2.2,2.2,-0.4,0.4,0,0.2,GSTONE_D);
      GWALLHOLES(c,out,[GLANCET(JY,-1.4,0.28,0.5,1.4,1.9),GLANCET(JY,0.2,0.28,0.5,1.3,1.7),GLANCET(JY,1.5,0.28,0.5,1.2,1.5)],GSTONE);for(let k=0;k<6;k++)TH.ln(c,I(-2.1,0.42,0.3+k*0.4),I(2.1,0.42,0.3+k*0.4),'rgba(8,12,12,.24)',u*0.05);
      GBOX(c,x,y,u,2.2,2.5,-0.4,0.4,0,1.5,GSTONE_L);for(let k=0;k<6;k++)TH.poly(c,[I(-2.0+r()*4.2,0.7+r()*0.8,0.05),I(-2.0+r()*4.2,0.7+r()*0.8,0.05),I(-2.0+r()*4.2,0.7+r()*0.8,0.05)],r()<0.5?GSTONE:GSTONE_D);GIVYBLOBS(c,x,y-u*0.8,u,r,8,4.6);});}},
  brokenColumns:{cat:'ruin',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*9+6);GSH(c,x,y,u*2.3);[[-1.2,0.2,2.8],[0.0,-0.1,1.7],[1.2,0.3,0.9]].forEach(([dx,dy,h],i)=>{const px=x+dx*u,py=y+dy*u,w=u*0.45,gr=c.createLinearGradient(px-w,0,px+w,0);gr.addColorStop(0,GSTONE_L);gr.addColorStop(1,GSTONE_D);c.fillStyle=gr;c.fillRect(px-w,py-h*u,w*2,h*u);TH.ell(c,px,py,w,w*0.4,GSTONE_D);TH.ell(c,px,py-h*u,w,w*0.4,i===2?GSTONE:GSTONE_L);for(let k=1;k<4;k++)TH.ln(c,[px-w,py-h*u*k/4],[px+w,py-h*u*k/4+u*0.04],'rgba(8,12,12,.3)',u*0.05);});
    c.save();c.translate(x+u*2.0,y+u*0.6);c.rotate(-0.05);c.fillStyle=GSTONE;c.fillRect(-u*1.0,-u*0.4,u*2.0,u*0.8);TH.ell(c,-u*1.0,0,u*0.2,u*0.4,GSTONE_D);TH.ell(c,u*1.0,0,u*0.2,u*0.4,GSTONE_L);c.restore();GIVYBLOBS(c,x,y,u,r,4,3.0);}},
  graveyard:{cat:'ruin',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*5+9),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);GSH(c,x,y,u*2.6);TH.blob(c,x,y+u*0.1,u*2.5,u*0.9,'rgba(40,52,40,.5)',r,10);
    const stone=(X,Y,h,kind)=>{const b=I(X,Y,0),w=u*0.42;c.fillStyle='rgba(6,12,10,.4)';c.beginPath();c.ellipse(b[0]+u*0.25,b[1]+u*0.05,w*1.1,w*0.4,0,0,7);c.fill();const gr=c.createLinearGradient(b[0]-w,0,b[0]+w,0);gr.addColorStop(0,GSTONE_L);gr.addColorStop(1,GSTONE_D);c.fillStyle=gr;
      if(kind===0){c.beginPath();c.moveTo(b[0]-w,b[1]);c.lineTo(b[0]-w,b[1]-h*u);c.arc(b[0],b[1]-h*u,w,Math.PI,0);c.lineTo(b[0]+w,b[1]);c.closePath();c.fill();TH.ln(c,[b[0],b[1]-h*u*0.8],[b[0],b[1]-h*u*0.4],'rgba(8,12,12,.5)',u*0.06);TH.ln(c,[b[0]-w*0.4,b[1]-h*u*0.62],[b[0]+w*0.4,b[1]-h*u*0.62],'rgba(8,12,12,.5)',u*0.06);}
      else if(kind===1){c.fillRect(b[0]-w*0.28,b[1]-h*u,w*0.56,h*u);c.fillRect(b[0]-w*0.85,b[1]-h*u*0.78,w*1.7,w*0.5);}
      else{c.beginPath();c.moveTo(b[0]-w,b[1]);c.lineTo(b[0]-w*0.8,b[1]-h*u);c.lineTo(b[0]+w*0.8,b[1]-h*u*0.9);c.lineTo(b[0]+w,b[1]);c.closePath();c.fill();}};
    [[-1.3,-0.2,1.5,0],[-0.5,0.5,1.1,1],[0.4,-0.4,1.6,0],[1.1,0.4,0.9,2],[-0.1,-1.0,1.3,1],[1.6,-0.6,1.2,0]].sort((a,b)=>a[1]-b[1]).forEach(([X,Y,h,k])=>stone(X,Y+0.4,h,k));GIVYBLOBS(c,x,y+u*0.2,u,r,5,3.4);for(let k=0;k<3;k++)TH.ell(c,x+(r()-0.5)*u*3,y+u*(0.1+r()*0.4),u*0.1,u*0.08,['#8a6ac8','#b0b0c0','#a84a4a'][k]);
    /* a little wrought-iron fence */
    [-2.0,-1.0,0,1.0,2.0].forEach(X=>{const b=I(X,1.4,0);TH.ln(c,b,[b[0],b[1]-u*1.1],'#14161a',u*0.1);TH.poly(c,[[b[0]-u*0.1,b[1]-u*1.1],[b[0]+u*0.1,b[1]-u*1.1],[b[0],b[1]-u*1.45]],'#14161a');});TH.ln(c,I(-2.0,1.4,0.8),I(2.0,1.4,0.8),'#14161a',u*0.08);}},
  mausoleum:{cat:'ruin',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*9+6),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);GFLIP(c,x,v&1,()=>{GSH(c,x,y,u*2.4);GBOX(c,x,y,u,-1.3,1.3,-1.2,1.2,0,0.4,GSTONE_D);GBOX(c,x,y,u,-1.1,1.1,-1.0,1.0,0.4,2.4,GSTONE);for(let row=0;row<6;row++)for(let k=0;k<5;k++){const X=-1.05+k*0.45+(row%2)*0.2,Z=0.45+row*0.32;TH.ln(c,I(X,1.01,Z),I(X+0.4,1.01,Z),'rgba(8,12,12,.34)',u*0.05);}
      const JY=(a,z)=>I(a,1.02,z);c.beginPath();GPATH(c,GLANCET(JY,0,0.38,0.4,1.5,1.9));c.fillStyle='#0b1210';c.fill();c.strokeStyle='#4c5058';c.lineWidth=u*0.09;c.stroke();TH.ln(c,I(-0.05,1.03,0.5),I(-0.05,1.03,1.6),'#14161a',u*0.07);TH.ln(c,I(0.12,1.03,0.5),I(0.12,1.03,1.6),'#14161a',u*0.07);
      TH.poly(c,[I(-1.3,1.15,2.4),I(1.3,1.15,2.4),I(0,1.15,3.3)],GSTONE_L);TH.poly(c,[I(1.3,-1.15,2.4),I(1.3,1.15,2.4),I(0,1.15,3.3),I(0,-1.15,3.3)],GSTONE_D);const t=I(0,1.15,3.3);TH.ln(c,t,[t[0],t[1]-u*0.8],'#14161a',u*0.1);TH.ln(c,[t[0]-u*0.3,t[1]-u*0.5],[t[0]+u*0.3,t[1]-u*0.5],'#14161a',u*0.1);for(let k=0;k<3;k++)TH.poly(c,[I(-1.3+k*1.0,1.2,0.4),I(-0.8+k*1.0,1.2,0.4),I(-1.05+k*1.0,1.2,0.9)],'#2a4a30');GIVYBLOBS(c,x,y-u*0.4,u,r,6,2.4);});}},
  ruinedBelfry:{cat:'struct',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*9+6),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);GFLIP(c,x,v&1,()=>{GSH(c,x,y,u*2.0);GBOX(c,x,y,u,-1.15,1.15,-1.15,1.15,0,5.0,GSTONE);for(let row=0;row<15;row++){const Z=0.1+row*0.32;for(let k=0;k<5;k++){const X=-1.1+k*0.46+(row%2)*0.2;TH.ln(c,I(X,1.16,Z),I(X+0.4,1.16,Z),'rgba(8,12,12,.3)',u*0.05);}}
      GBOX(c,x,y,u,-1.0,1.0,-1.0,1.0,5.0,6.2,GSTONE_L);const JY=(a,z)=>I(a,1.01,z),JX=(a,z)=>I(1.01,a,z);[-0.45,0.45].forEach(X=>{c.beginPath();GPATH(c,GLANCET(JY,X,0.26,5.1,5.8,6.2));c.fillStyle='#0b1210';c.fill();});c.beginPath();GPATH(c,GLANCET(JX,0.0,0.3,5.1,5.8,6.2));c.fillStyle='#0b1210';c.fill();
      TH.poly(c,[I(-1.0,1.01,6.2),I(-0.4,1.01,6.2),I(-0.55,1.01,6.8),I(-0.9,1.01,6.5)],GSTONE_L);TH.poly(c,[I(0.2,1.01,6.2),I(1.0,1.01,6.2),I(1.0,1.01,6.6),I(0.6,1.01,7.0)],GSTONE_L);TH.poly(c,[I(1.01,-1.0,6.2),I(1.01,-0.2,6.2),I(1.01,-0.5,6.7)],GSTONE_D);
      c.beginPath();GPATH(c,GLANCET((a,z)=>I(a,1.17,z),0,0.34,0,1.0,1.5));c.fillStyle='#0b1210';c.fill();c.strokeStyle='#4c5058';c.lineWidth=u*0.08;c.stroke();GIVYBLOBS(c,x,y-u*1.5,u,r,8,2.4);GIVYBLOBS(c,x,y-u*4.2,u,r,5,2.2);const bp=I(0,0,6.8);GBAT(c,bp[0]-u*0.4,bp[1]-u*0.9,u*0.9);GBAT(c,bp[0]+u*0.9,bp[1]-u*1.6,u*0.7);});}},
  /* ---------- spooky cottages (13 per land at Immersive) ---------- */
  hauntedManor:GHOUSE('hauntedManor'),crookedTimber:GHOUSE('crookedTimber'),witchCottage:GHOUSE('witchCottage'),
  /* ---------- small props (lower tiers only) ---------- */
  gothicLamp:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(6,12,10,.3)');TH.ln(c,[x,y],[x,y-u*3.1],'#0e1014',u*0.22);TH.poly(c,[[x-u*0.3,y],[x+u*0.3,y],[x+u*0.15,y-u*0.5],[x-u*0.15,y-u*0.5]],'#0e1014');TH.ln(c,[x,y-u*2.95],[x+u*0.55,y-u*2.95],'#0e1014',u*0.12);const lx=x+u*0.55,ly=y-u*2.9,g=c.createRadialGradient(lx,ly-u*0.3,0,lx,ly-u*0.3,u*1.7);g.addColorStop(0,'rgba(190,255,140,.5)');g.addColorStop(1,'rgba(190,255,140,0)');c.fillStyle=g;c.beginPath();c.arc(lx,ly-u*0.3,u*1.7,0,7);c.fill();TH.poly(c,[[lx-u*0.25,ly],[lx+u*0.25,ly],[lx+u*0.2,ly-u*0.6],[lx-u*0.2,ly-u*0.6]],'#cfe8a0','#0e1014',u*0.06);TH.poly(c,[[lx-u*0.3,ly-u*0.6],[lx+u*0.3,ly-u*0.6],[lx,ly-u*0.95]],'#0e1014');}},
  brokenCart:{cat:'prop',rho:0.08,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.5,y+u*0.12,u*2.0,u*0.55,'rgba(6,12,10,.3)');TH.box(c,x,y,u,-1.3,1.0,-0.7,0.7,0.4,0.7,'#3a2c20','#241a12','#4a3a2a');for(let k=0;k<2;k++){const Y=k?0.71:-0.71;TH.poly(c,[I(-1.3,Y,0.7),I(1.0,Y,0.7),I(1.0,Y,1.2),I(-1.3,Y,1.2)],k?'#3a2c20':'#241a12');}TH.ln(c,I(-1.0,-0.7,1.2),I(-1.3,-0.7,0.5),'#241a12',u*0.14);const wheel=(X,Y,tilt)=>{const p=I(X,Y,0.45);c.strokeStyle='#241a12';c.lineWidth=u*0.14;c.beginPath();c.ellipse(p[0],p[1],u*0.55,u*0.55,tilt,0,7);c.stroke();for(let k=0;k<6;k++){const a=k/6*6.283;TH.ln(c,[p[0],p[1]],[p[0]+Math.cos(a)*u*0.5,p[1]+Math.sin(a)*u*0.5],'#241a12',u*0.06);}};wheel(0.4,0.8,0);TH.ln(c,I(1.0,0,0.5),I(2.2,0.3,0.15),'#241a12',u*0.16);TH.ell(c,...I(-0.9,1.3,0.12),u*0.5,u*0.12,'#241a12');}},
  ironFence:{cat:'prop',rho:0.09,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.3,y+u*0.1,u*2.0,u*0.35,'rgba(6,12,10,.2)');for(let k=0;k<7;k++){const b=I(-1.8+k*0.6,0,0),h=1.3+(k===3?-0.5:0);TH.ln(c,b,[b[0],b[1]-u*h],'#0e1014',u*0.1);TH.poly(c,[[b[0]-u*0.12,b[1]-u*h],[b[0]+u*0.12,b[1]-u*h],[b[0],b[1]-u*(h+0.35)]],'#0e1014');}TH.ln(c,I(-1.8,0,0.45),I(1.8,0,0.45),'#0e1014',u*0.08);TH.ln(c,I(-1.8,0,1.05),I(1.8,0,1.05),'#0e1014',u*0.08);}},
  pumpkins:{cat:'prop',rho:0.05,draw(c,x,y,u,v){const pk=(px,py,s,face)=>{TH.ell(c,px+s*u*0.2,py+s*u*0.1,s*u*0.7,s*u*0.25,'rgba(6,12,10,.3)');const g=c.createRadialGradient(px-s*u*0.2,py-s*u*0.7,0,px,py-s*u*0.5,s*u*0.9);g.addColorStop(0,'#e8892a');g.addColorStop(1,'#9a4a14');c.fillStyle=g;c.beginPath();c.ellipse(px,py-s*u*0.45,s*u*0.62,s*u*0.5,0,0,7);c.fill();for(let k=-1;k<=1;k++)TH.ln(c,[px+k*s*u*0.28,py-s*u*0.05],[px+k*s*u*0.2,py-s*u*0.9],'rgba(90,40,10,.4)',s*u*0.06);TH.ln(c,[px,py-s*u*0.9],[px+s*u*0.1,py-s*u*1.15],'#4a3a1a',s*u*0.14);if(face){c.fillStyle='#ffd84a';TH.poly(c,[[px-s*u*0.3,py-s*u*0.62],[px-s*u*0.1,py-s*u*0.62],[px-s*u*0.2,py-s*u*0.8]],'#ffd84a');TH.poly(c,[[px+s*u*0.1,py-s*u*0.62],[px+s*u*0.3,py-s*u*0.62],[px+s*u*0.2,py-s*u*0.8]],'#ffd84a');c.beginPath();c.moveTo(px-s*u*0.32,py-s*u*0.32);c.quadraticCurveTo(px,py-s*u*0.15,px+s*u*0.32,py-s*u*0.32);c.lineTo(px+s*u*0.2,py-s*u*0.4);c.lineTo(px-s*u*0.2,py-s*u*0.4);c.closePath();c.fill();}};pk(x-u*0.7,y+u*0.1,0.8,false);pk(x+u*0.6,y+u*0.15,0.95,true);pk(x,y-u*0.15,0.75,false);}},
  scarecrow:{cat:'prop',rho:0.05,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.9,u*0.28,'rgba(6,12,10,.3)');TH.ln(c,[x,y],[x,y-u*3.2],'#3a2c1c',u*0.22);TH.ln(c,[x-u*1.3,y-u*2.3],[x+u*1.3,y-u*2.1],'#3a2c1c',u*0.2);TH.poly(c,[[x-u*0.5,y-u*2.4],[x+u*0.5,y-u*2.4],[x+u*0.45,y-u*1.0],[x-u*0.45,y-u*1.0]],'#2a2630');for(let k=0;k<4;k++)TH.ln(c,[x-u*0.4+k*u*0.27,y-u*1.0],[x-u*0.45+k*u*0.3,y-u*0.55],'#c9a85a',u*0.07);TH.ell(c,x,y-u*3.0,u*0.42,u*0.42,'#b8a070');TH.poly(c,[[x-u*0.55,y-u*3.25],[x+u*0.55,y-u*3.25],[x+u*0.3,y-u*3.5],[x,y-u*4.0],[x-u*0.3,y-u*3.5]],'#1a1620');TH.ell(c,x-u*0.14,y-u*3.02,u*0.07,u*0.07,'#1a1410');TH.ell(c,x+u*0.14,y-u*3.02,u*0.07,u*0.07,'#1a1410');for(let k=0;k<5;k++)TH.ln(c,[x+u*1.3,y-u*2.1],[x+u*1.3+(k-2)*u*0.12,y-u*1.6],'#c9a85a',u*0.06);const cx=x+u*1.5,cy2=y-u*2.9;c.fillStyle='#07070a';c.beginPath();c.ellipse(cx,cy2,u*0.28,u*0.17,0.2,0,7);c.fill();TH.poly(c,[[cx+u*0.24,cy2-u*0.05],[cx+u*0.5,cy2+u*0.02],[cx+u*0.24,cy2+u*0.1]],'#07070a');}}
};

/* ===== MACRO-LAND ENGINE (hex geometry, path network, planner, baker) ===== */
const W3=Math.sqrt(3),HX=W3/2,HV=[[HX,0.29],[0,0.58],[-HX,0.29],[-HX,-0.29],[0,-0.58],[HX,-0.29]];
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[0,1,2],[-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5,1.5]],C:[[0],[-0.5,0.5,1.5],[-1,0,1],[-0.5]],D:[[0,1,2],[-0.5,0.5,1.5],[0,1]]};
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

function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol,clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]),key=[T.id,shape,tier,R,m,ground,sc,JSON.stringify(clr),JSON.stringify(opts.clearTiles||[])].join('|');const cached=revisedLandCache.get(key);if(cached)return cached;
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=0.75,top=T.top||1.35,bot=0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);return[cv,g];};
  const [back,cb]=mk();T.ground(cb,G,R,ox,oy,m,ground,({A:11,B:22,C:33,D:44})[shape]);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]),vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho))&&!(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));
  const sprites=vis.map(o=>{const unit=u*(o.scale||1);return {x:m*o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>T.assets[o.kind].draw(ctx,x,y,unit,o.v)};});
  const front=document.createElement('canvas'),frontRect={x:0,y:0,w:1,h:1};front.width=front.height=1;
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return revisedLandCache.set(key,{back,front,frontRect,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0,sprites});
}
function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}

/* ===== GOTHIC LAND: planner (same tree + house counts as the medieval land, very dark trees, spooky homes, church ruins), murky ground ===== */
const GOTHIC_REGION={top:{gnarledOak:.28,blackPine:.22,deadTree:.1,darkPoplar:.08,weepingDark:.04,yewDark:.14,twistedSapling:.14},mid:{gnarledOak:.3,blackPine:.2,deadTree:.1,darkPoplar:.08,weepingDark:.05,yewDark:.14,twistedSapling:.13},bottom:{gnarledOak:.22,blackPine:.16,deadTree:.1,darkPoplar:.04,weepingDark:.05,yewDark:.18,twistedSapling:.25}};
const GOTHIC_LOW=[['twistedSapling',1],['yewDark',0.72],['twistedSapling',1.2],['blackPine',0.55],['yewDark',0.85],['twistedSapling',0.9],['deadTree',0.6]];
const GOTHIC_CAP={deadTree:12,weepingDark:4,darkPoplar:8,yewDark:12};
const GOTHIC_UNDER=['thornBush','deadBrush','mushrooms','fernDark','grassDead','thornBush','mushrooms','darkStones','grassDead'];
const GOTHIC_PLAN_CACHE={};
function getGothicPlan(shape){
  if(GOTHIC_PLAN_CACHE[shape])return GOTHIC_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(({A:7301,B:8402,C:9503,D:10604})[shape]),placed=[],bb=G.bbox,used={},A=GOTHIC_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.66);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'gnarledOak';};
  const capOk=k=>!(GOTHIC_CAP[k]&&(used[k]||0)>=GOTHIC_CAP[k]);
  const regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?GOTHIC_REGION.top:n<0.68?GOTHIC_REGION.mid:GOTHIC_REGION.bottom;};
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='tree'?0.88+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;if((D.cat==='tree'||D.cat==='shrub'||D.cat==='prop')&&placed.some(o=>o.noSouth&&Math.abs(px-o.x)<0.3&&py-o.y>-0.05&&py-o.y<0.36))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const tree=(x,y,extra,dom,low)=>{if(low){const L=GOTHIC_LOW[Math.floor(rng()*GOTHIC_LOW.length)];return place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return place(dom&&rng()<0.55&&capOk(dom)?dom:pickFrom(regionOf(y),capOk),x,y,extra||{});};
  const under=(x,y,extra)=>place(GOTHIC_UNDER[Math.floor(rng()*GOTHIC_UNDER.length)],x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const KS=G.centers.length/12,thin=l=>{const n=Math.max(1,Math.round(l.length*KS));return Array.from({length:n},(_,i)=>l[Math.floor((i+0.5)*l.length/n)]);},cnt=n=>Math.max(1,Math.round(n*KS));
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. the back rim carries just the ruined chapel (no tree backdrop: the trees there are the same density as everywhere else) */
  {const pts=[];top.forEach(e=>[0.3,0.5,0.7].forEach(t=>pts.push(onEdge(e,t,0.0))));const p=pts.reduce((b,q)=>Math.abs(q[0]-cx)<Math.abs(b[0]-cx)?q:b);for(const [dx,dy] of [[0,-0.02],[0.3,0],[-0.3,0],[0,0.04]]){const o=place('chapelRuin',p[0]+dx,p[1]+dy,{minT:1,scale:1.15,clear:2.4,noSouth:true});if(o)break;}}
  /* 2. spooky homes: 6 on the rim (spread by farthest-point), 7 through the middle, then ONE ruined belfry beside a manor */
  const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.filter(e=>e.vertical).forEach(e=>inn.push([e.mid[0],e.mid[1]]));
  const chosen=placed.filter(o=>o.cat==='ruin'||o.cat==='struct').map(o=>[o.x,o.y]),manors=[];
  const spread=(k,pool,extra)=>{const ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.22})).sort((a,b)=>b.d-a.d);for(let n=0;n<Math.min(12,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],extra);if(o){chosen.push([o.x,o.y]);if(k==='hauntedManor')manors.push(o);return o;}}return null;};
  thin([['crookedTimber',1],['witchCottage',2],['hauntedManor',3],['crookedTimber',3],['witchCottage',4],['hauntedManor',4]]).forEach(([k,mt])=>spread(k,rim,{minT:mt,scale:1.15,clear:2.5,noSouth:true}));
  thin([['witchCottage',2],['hauntedManor',2],['crookedTimber',3],['witchCottage',3],['crookedTimber',4],['hauntedManor',4],['witchCottage',4]]).forEach(([k,mt])=>spread(k,inn,{minT:mt,scale:1.0,clear:3.0,noSouth:true}));
  {const home=manors[manors.length-1]||placed.find(o=>o.cat==='struct');if(home){for(const [dx,dy] of [[0.36,-0.08],[-0.36,-0.08],[0.3,0.12],[-0.3,0.12],[0.44,0.0],[-0.44,0.0]]){const o=place('ruinedBelfry',home.x+dx,home.y+dy,{minT:4,scale:1.0,clear:2.4,noSouth:true});if(o)break;}}}
  /* 2b. church ruins scattered through the land (farthest-point spacing): arches, broken walls, graveyards, a mausoleum, fallen columns */
  thin([['gothicArch',1],['graveyard',2],['ruinedWall',2],['gothicArch',3],['mausoleum',3],['brokenColumns',3],['graveyard',4],['ruinedWall',4],['gothicArch',4]]).forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,scale:k==='graveyard'||k==='mausoleum'?1.1:1.0,clear:1.6,noSouth:true}));
  /* 3. trees: very dark, same dense dials as the medieval land (and the top rim is treated exactly like every other edge) */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=pickFrom(regionOf(v.y),capOk),n=2+Math.floor(rng()*1.9);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.09:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{const dom=pickFrom(regionOf(e.mid[1]),capOk);[-0.27,0,0.27].forEach(dy=>{if(rng()<0.72)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.72)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.8+rng()*0.2},null,true);if(rng()<0.22)tree(e.mid[0]+(rng()-0.5)*0.34,e.mid[1]+(rng()-0.5)*0.14,{scale:0.78+rng()*0.2},null,true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.26));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(rng()-0.2)*0.12)});});
    let mode='grove',run=0,dom='gnarledOak';samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.74?'grove':r<0.92?'sparse':'open';run=2+Math.floor(rng()*4);dom=pickFrom(regionOf(s.p[1]),capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){tree(p[0],p[1],null,dom,low);if(rng()<0.55)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,dom,low);if(rng()<0.2)tree(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,dom,true);if(rng()<0.14)tree(p[0]+(rng()-0.5)*0.34,p[1]-0.2,null,dom,low);}
      else if(mode==='sparse'){if(rng()<0.5)tree(p[0],p[1],null,dom,low);else under(p[0],p[1]);}else if(rng()<0.6)under(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.8)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<14;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.38)tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);}});
  /* 3c. balance the rim: the top, the sides and the bottom must carry the same tree density per unit of boundary (thin the heavy edges, fill the light ones) */
  {const dEdge=(x,y,e)=>{const dx=e.b[0]-e.a[0],dy=e.b[1]-e.a[1],t=Math.max(0,Math.min(1,((x-e.a[0])*dx+(y-e.a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-(e.a[0]+dx*t),(y-(e.a[1]+dy*t))*1.4);};
    const classes=['top','side','bottom'],len={top:0,side:0,bottom:0};outer.forEach(e=>len[e.cls]+=e.len);
    const members=()=>{const m={top:[],side:[],bottom:[]};placed.filter(o=>o.cat==='tree').forEach(o=>{let best=null,bd=1e9;outer.forEach(e=>{const d=dEdge(o.x,o.y,e);if(d<bd){bd=d;best=e;}});if(bd<0.32)m[best.cls].push(o);});return m;};
    let m=members();const mean=(m.top.length+m.side.length+m.bottom.length)/(len.top+len.side+len.bottom);
    classes.forEach(cl=>{const target=Math.round(len[cl]*mean);let list=m[cl];
      if(list.length>target+1){const drop=list.length-target;for(let i=0;i<drop;i++){const pick=list.splice(Math.floor(rng()*list.length),1)[0],ix=placed.indexOf(pick);if(ix>=0)placed.splice(ix,1);}}
      else if(list.length<target-1){const need=target-list.length,es=outer.filter(e=>e.cls===cl);let added=0,guard=0;while(added<need&&guard++<160){const e=es[Math.floor(rng()*es.length)],p=onEdge(e,rng(),(rng()-0.2)*0.12);if(tree(p[0],p[1],null,null,cl!=='top'))added++;}}});}
  /* 4. undergrowth: thorn bushes, dead brush, glowing mushrooms, dark ferns */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.45)under(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.35)under(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.38)under(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.3)under(px,py);}});
  /* 5. small props: lower tiers only */
  [['gothicLamp',2],['brokenCart',1],['ironFence',2],['pumpkins',2],['scarecrow',1]].forEach(([k,n])=>{for(let i=0;i<cnt(n);i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  /* every house gets a facing (bit0 mirror, bit1 gable/eave); neighbours cycle through all four */
  {const houses=placed.filter(o=>/^(hauntedManor|crookedTimber|witchCottage)$/.test(o.kind)).sort((a,b)=>a.x-b.x||a.y-b.y),cyc=[0,3,1,2];houses.forEach((o,i)=>{o.v=((o.v>>2)<<2)|cyc[i%4];});placed.filter(o=>o.kind==='ruinedBelfry'||o.kind==='chapelRuin').forEach(o=>{o.v=((o.v>>2)<<2)|(rng()<0.5?1:0);});}
  const cuts={tree:[0.2,0.52,0.8,1],shrub:[0.06,0.38,0.7,1],rock:[0.3,0.55,0.8,1],prop:[1,1,1,1],struct:[0,0,0,0],ruin:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='struct'||o.cat==='ruin')o.tier=o.minT;});
  const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
  for(let t=1;t<=4;t++){let guard=0;while(guard++<300){const c=count(t);if(c.tr/Math.max(1,c.n)>=0.68)break;const pool=placed.filter(o=>o.tier<=t&&t<=o.maxT),cand=(pool.filter(o=>o.cat==='shrub').sort((a,b)=>b.pri-a.pri)[0])||(pool.filter(o=>o.prop&&o.minT>1).sort((a,b)=>b.pri-a.pri)[0]);if(!cand)break;cand.tier=Math.min(5,cand.tier+1);}}
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.sort((a,b)=>a.y-b.y);
  return GOTHIC_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: murky grey-green earth, drifting ground mist, moss, dead grass and fallen leaves, a few faint wisps (decals, not objects) ---- */
function gothicGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<46;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'120,140,118':'28,40,32',r()<0.5?0.22:0.26);}
  for(let k=0;k<12;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'60,44,34',0.2);}                    /* bare earth */
  for(let k=0;k<12;k++){const p=pt(),w=R*(0.5+r()*0.9);soft(p[0],p[1],w,w*0.36,'205,218,212',0.13);}              /* ground mist */
  for(let k=0;k<10;k++){const p=pt(),w=R*(0.25+r()*0.4);soft(p[0],p[1],w,w*0.4,'58,96,64',0.22);}                 /* moss */
  for(let k=0;k<110;k++){const p=pt(),a=r()*3.14,l=R*(0.025+r()*0.03);TH.ln(c,[p[0],p[1]],[p[0]+Math.cos(a)*l,p[1]+Math.sin(a)*l*0.5],r()<0.5?'rgba(60,40,26,.6)':'rgba(40,30,22,.55)',R*0.01);}   /* fallen leaves */
  for(let k=0;k<150;k++){const p=pt(),h=R*(0.05+r()*0.06);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#4a5240','#3a4234','#586048'][(k+j)%3],R*0.011);}
  for(let k=0;k<26;k++){const p=pt();TH.ell(c,p[0],p[1],R*(0.015+r()*0.012),R*0.01,'rgba(120,124,132,.55)');}
  for(let k=0;k<6;k++){const p=pt();soft(p[0],p[1],R*0.06,R*0.05,'170,255,150',0.35);}
  c.restore();c.restore();
}
const GOTHIC_THEME={id:'gothic',assets:GOTHIC_ASSETS,plan:getGothicPlan,ground:gothicGround,groundCol:'#5e6a5f',top:1.5};
const GOTHIC_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
function bakeLandGothic(shape,tier,R,opts){return bakeLandTheme(GOTHIC_THEME,shape,tier,R,opts);}
function drawLandGothicBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandGothicFront(ctx,x,y,land){land.sprites.slice().sort((a,b)=>a.y-b.y).forEach(s=>drawScenicSprite(ctx,s,x+s.x,y+s.y));}
function landGothicSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}


return Object.freeze({bake: bakeLandGothic, drawBack: drawLandGothicBack, drawFront: drawLandGothicFront});
})(),
  medieval: (() => {

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

/* ===== MEDIEVAL ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const MSH=(c,x,y,rx)=>{c.fillStyle='rgba(30,42,24,.26)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const MPAL={oak:[['#4f8a3f','#5f9a4a','#3f7a36','#6fa955'],['#5a8f3a','#6ba046','#4a7f32','#7cb054'],['#468a48','#58a055','#38773c','#68b063']],copper:['#7a4a56','#8a5a5a','#6a3f4a','#96666a'],birch:['#9cc060','#86ae4f','#b0d070','#78a444'],apple:['#5f9a4a','#6faa55','#4f8a3f','#80ba62'],willow:['#9bb858','#86a547','#b3c96a','#789a40']};
const MWOOD_D='#4a3220',MPLASTER='#efe6d2',MSTONE='#9a9a92',MSTONE_D='#74746e',MSTONE_L='#b8b8ae';
const MBOX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.28),shade(col,0.14));
/* half-timbered wall: plaster box with a dark timber frame on the two visible faces */
const MFRAME=(c,x,y,u,x0,x1,y0,y1,z0,z1,plaster,beam,seed)=>{const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(seed);MBOX(c,x,y,u,x0,x1,y0,y1,z0,z1,plaster);const w=u*0.1,n=Math.max(3,Math.round((x1-x0)/0.8)),m=Math.max(2,Math.round((y1-y0)/0.8));
  [z0+0.03,z1-0.03,(z0+z1)/2].forEach(z=>{TH.ln(c,I(x0,y1+0.01,z),I(x1,y1+0.01,z),beam,w);TH.ln(c,I(x1+0.01,y0,z),I(x1+0.01,y1,z),beam,w);});
  for(let k=0;k<=n;k++){const X=x0+(x1-x0)*k/n;TH.ln(c,I(X,y1+0.01,z0),I(X,y1+0.01,z1),beam,w);if(k<n&&r()<0.55){const X2=x0+(x1-x0)*(k+1)/n;TH.ln(c,I(X,y1+0.01,z0),I(X2,y1+0.01,(z0+z1)/2),beam,w*0.8);}}
  for(let k=0;k<=m;k++){const Y=y0+(y1-y0)*k/m;TH.ln(c,I(x1+0.01,Y,z0),I(x1+0.01,Y,z1),beam,w);if(k<m&&r()<0.5){const Y2=y0+(y1-y0)*(k+1)/m;TH.ln(c,I(x1+0.01,Y,z0),I(x1+0.01,Y2,(z0+z1)/2),beam,w*0.8);}}};
const MGABLE=(c,x,y,u,xa,xb,ya,yb,zb,zr,col,colD,ridgeX)=>{const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.poly(c,[I(xb,ya,zb),I(xb,yb,zb),I(ridgeX,yb,zr),I(ridgeX,ya,zr)],col);TH.poly(c,[I(xa,yb,zb),I(xb,yb,zb),I(ridgeX,yb,zr)],colD);};
const MWIN=(c,x,y,u,X,Y,Z,face)=>{const I=(a,b,d)=>TH.iso(x,y,u,a,b,d);if(face==='f'){TH.poly(c,[I(X-0.28,Y,Z),I(X+0.28,Y,Z),I(X+0.28,Y,Z+0.5),I(X-0.28,Y,Z+0.5)],'#31404f',MWOOD_D,u*0.05);TH.ln(c,I(X,Y,Z),I(X,Y,Z+0.5),MWOOD_D,u*0.04);TH.poly(c,[I(X-0.3,Y,Z+0.52),I(X+0.3,Y,Z+0.52),I(X+0.3,Y,Z+0.56),I(X-0.3,Y,Z+0.56)],'#5f3d20');for(let k=0;k<4;k++)TH.ell(c,...I(X-0.2+k*0.14,Y,Z+0.62),u*0.06,u*0.05,['#e86aa8','#f2c230','#d9433b','#f6efe0'][k]);}};
const MROOF=(c,x,y,u,col,colD,w,lines)=>{};
const MEDIEVAL_ASSETS={
  /* ---------- trees ---------- */
  oak:{cat:'tree',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*7+1),H=u*(4.4+r()*1.1),pal=MPAL.oak[v%3];MSH(c,x,y,u*2.3);c.lineCap='round';c.strokeStyle='#5a3f26';c.lineWidth=u*0.8;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.1,y-H*0.35,x+u*0.05,y-H*0.6);c.stroke();TH.poly(c,[[x-u*0.6,y],[x-u*0.25,y-u*0.8],[x+u*0.2,y-u*0.8],[x+u*0.65,y]],'#5a3f26');TH.ln(c,[x-u*0.15,y-H*0.1],[x-u*0.1,y-H*0.55],'#7b5a38',u*0.2);TH.ln(c,[x,y-H*0.5],[x-u*1.2,y-H*0.82],'#5a3f26',u*0.34);TH.ln(c,[x,y-H*0.55],[x+u*1.3,y-H*0.8],'#5a3f26',u*0.32);
    const cy=y-H*0.82;[[0,-0.3,2.0,1.2],[-1.6,-0.1,1.3,1.0],[1.6,-0.1,1.3,1.0],[-0.8,-1.15,1.5,1.0],[0.85,-1.15,1.5,1.0],[0,-1.7,1.2,0.85],[-1.2,0.5,0.9,0.6],[1.2,0.5,0.9,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[(i+(v>>2))%4],r,10));}},
  copperBeech:{cat:'tree',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*5+3),H=u*(4.6+r()*1.0);MSH(c,x,y,u*2.2);TH.ln(c,[x,y],[x,y-H*0.62],'#7a7468',u*0.7);TH.ln(c,[x-u*0.15,y],[x-u*0.1,y-H*0.55],'#9a948a',u*0.16);TH.ln(c,[x,y-H*0.5],[x-u*1.1,y-H*0.82],'#7a7468',u*0.3);TH.ln(c,[x,y-H*0.55],[x+u*1.2,y-H*0.8],'#7a7468',u*0.3);const cy=y-H*0.82;[[0,-0.3,1.9,1.15],[-1.5,-0.1,1.25,0.95],[1.5,-0.1,1.25,0.95],[-0.8,-1.1,1.4,0.95],[0.8,-1.1,1.4,0.95],[0,-1.6,1.1,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,MPAL.copper[i%4],r,10));}},
  elm:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*11+2),H=u*(5.8+r()*1.0),pal=MPAL.oak[(v+1)%3];MSH(c,x,y,u*2.0);TH.ln(c,[x,y],[x,y-H*0.5],'#6a5238',u*0.6);TH.ln(c,[x,y-H*0.4],[x-u*0.8,y-H*0.75],'#6a5238',u*0.3);TH.ln(c,[x,y-H*0.42],[x+u*0.8,y-H*0.78],'#6a5238',u*0.3);const cy=y-H*0.78;[[0,0.4,1.5,1.0],[-1.0,-0.3,1.1,1.1],[1.0,-0.3,1.1,1.1],[0,-1.2,1.5,1.15],[-0.6,-2.1,1.1,0.95],[0.6,-2.1,1.1,0.95],[0,-2.8,0.95,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,10));}},
  poplar:{cat:'tree',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*13+1),H=u*(7+r()*1.6);MSH(c,x,y,u*1.0);TH.ln(c,[x,y],[x,y-u*1.3],'#6a5238',u*0.34);const pal=['#5a8a45','#4a7a3a','#6a9a50','#3f7032'];for(let k=0;k<9;k++){const t=k/8,yy=y-u*1.2-t*(H-u*1.5),rx=u*(0.62+0.42*Math.sin(Math.min(1,t*1.15)*Math.PI*0.85)),ry=u*0.85;TH.blob(c,x+(r()-0.5)*u*0.2,yy,rx,ry,pal[k%4],r,9);}}},
  birch:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*17+4),H=u*(4.4+r()*1.0),pal=MPAL.birch;MSH(c,x,y,u*1.7);c.lineCap='round';c.strokeStyle='#ece8dc';c.lineWidth=u*0.46;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.12,y-H*0.4,x+u*0.05,y-H*0.7);c.stroke();for(let k=0;k<8;k++)TH.ln(c,[x-u*0.2,y-H*(0.06+k*0.08)],[x+u*0.1,y-H*(0.06+k*0.08)+u*0.05],'rgba(40,36,30,.55)',u*0.07);TH.ln(c,[x,y-H*0.55],[x-u*0.8,y-H*0.85],'#ece8dc',u*0.2);TH.ln(c,[x,y-H*0.6],[x+u*0.9,y-H*0.82],'#ece8dc',u*0.2);const cy=y-H*0.85;[[0,-0.5,1.3,1.0],[-1.0,-0.1,1.0,0.85],[1.0,-0.1,1.0,0.85],[-0.5,-1.15,1.0,0.8],[0.6,-1.1,1.0,0.8],[0,0.2,1.2,0.7]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,9));}},
  yew:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*19+2);MSH(c,x,y,u*1.6);TH.ln(c,[x,y],[x,y-u*1.0],'#8a4a30',u*0.55);const cols=['#2f5f4a','#3a6e55','#27523f','#447a5f'];[[0,-2.0,1.2,1.0],[-0.8,-1.3,1.1,0.9],[0.8,-1.3,1.1,0.9],[0,-1.0,1.4,0.85],[0,-2.8,0.8,0.7]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,cols[i%4],r,9));for(let k=0;k<5;k++)TH.ell(c,x+(r()-0.5)*u*1.8,y-u*(1.0+r()*1.6),u*0.07,u*0.07,'#c0392b');}},
  appleTree:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*23+1),H=u*(3.3+r()*0.6),pal=MPAL.apple;MSH(c,x,y,u*1.9);c.lineCap='round';c.strokeStyle='#5a3f26';c.lineWidth=u*0.5;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+u*0.1,y-H*0.4,x,y-H*0.6);c.stroke();TH.ln(c,[x,y-H*0.4],[x-u*0.8,y-H*0.7],'#5a3f26',u*0.22);TH.ln(c,[x,y-H*0.45],[x+u*0.8,y-H*0.72],'#5a3f26',u*0.22);const cy=y-H*0.8;[[0,-0.2,1.6,1.0],[-1.2,0.1,1.0,0.8],[1.2,0.1,1.0,0.8],[-0.5,-0.9,1.0,0.8],[0.6,-0.9,1.0,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,9));for(let k=0;k<9;k++){const ax=x+(r()-0.5)*u*2.6,ay=cy+u*(-0.9+r()*1.7);TH.ell(c,ax,ay,u*0.13,u*0.13,v%2?'#c0392b':'#e8b83a');}}},
  willow:{cat:'tree',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*29+3),H=u*(4.6+r()*0.8),pal=MPAL.willow;MSH(c,x,y,u*2.2);c.lineCap='round';c.strokeStyle='#5f4a30';c.lineWidth=u*0.65;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+u*0.3,y-H*0.4,x-u*0.1,y-H*0.7);c.stroke();const cy=y-H*0.78;[[0,-0.4,1.7,1.0],[-1.2,0,1.2,0.9],[1.2,0,1.2,0.9],[0,-1.0,1.2,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,cy+dy*u,u*rx,u*ry,pal[i%4],r,9));for(let k=0;k<20;k++){const sx=x+(k/19-0.5)*u*3.4,sy=cy+u*0.5+Math.abs(k/19-0.5)*u*0.2,len=u*(1.4+r()*1.6);TH.ln(c,[sx,sy],[sx+(r()-0.5)*u*0.3,Math.min(y-u*0.2,sy+len)],k%2?'#8fb04e':'#a9c466',u*0.1);}}},
  pine:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*3+9),H=u*(5.6+r()*1.0);MSH(c,x,y,u*1.3);TH.ln(c,[x,y],[x,y-H*0.78],'#a8643a',u*0.42);TH.ln(c,[x-u*0.1,y],[x-u*0.1,y-H*0.7],'#c98050',u*0.14);const cols=['#3d6b43','#2f5a38','#4b7a50'];[[0,-0.2,1.4,0.75],[-0.6,-0.9,1.2,0.7],[0.6,-0.95,1.2,0.7],[0,-1.5,0.95,0.65],[-0.3,-2.0,0.7,0.55]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H*0.7+dy*u,u*rx,u*ry,cols[i%3],r,8));}},
  sapling:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*31+3),pal=MPAL.oak[v%3];MSH(c,x,y,u*1.2);TH.ln(c,[x,y],[x,y-u*1.4],'#6a5238',u*0.26);[[0,-2.0,0.95,0.8],[-0.55,-1.5,0.7,0.6],[0.55,-1.5,0.7,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,pal[i%4],r,8));}},
  /* ---------- undergrowth ---------- */
  hedge:{cat:'shrub',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*3+7),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.3,y+u*0.1,u*2.0,u*0.4,'rgba(30,42,24,.22)');const cols=['#4a7f38','#5a9246','#3f7030'];for(let k=0;k<6;k++){const X=-1.5+k*0.6;TH.blob(c,...I(X,0,0.5),u*0.55,u*0.5,cols[k%3],r,8);}for(let k=0;k<8;k++)TH.ell(c,...I(-1.6+r()*3.2,0.2,0.9+r()*0.3),u*0.08,u*0.07,v%2?'#f6efe0':'#e86a8a');}},
  hawthorn:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+9);TH.ell(c,x+u*0.2,y+u*0.08,u*1.1,u*0.32,'rgba(30,42,24,.22)');[[-0.55,-0.45,0.8,0.55],[0.55,-0.45,0.8,0.55],[0,-0.85,0.85,0.6]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#5f8f45','#4f7f3a','#6f9f55'][i],r,8));for(let k=0;k<11;k++)TH.ell(c,x+(r()-0.5)*u*1.6,y-u*(0.3+r()*0.9),u*0.1,u*0.09,k%3?'#f6efe0':'#f4b6c6');}},
  roseBush:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*7+2),cols=[['#d9433b','#f06a60'],['#e86aa8','#f4a6cb'],['#f2c230','#fff0a0'],['#f6efe0','#fff8e8']][v%4];TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.28,'rgba(30,42,24,.2)');[[-0.4,-0.4,0.7,0.5],[0.45,-0.4,0.7,0.5],[0,-0.8,0.75,0.55]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#3f7a36','#4f8a42','#346e30'][i],r,8));for(let k=0;k<9;k++){const fx=x+(r()-0.5)*u*1.5,fy=y-u*(0.3+r()*0.9);TH.ell(c,fx,fy,u*0.14,u*0.12,cols[k%2]);}}},
  flowers:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);TH.ell(c,x+u*0.2,y+u*0.08,u*0.9,u*0.28,'rgba(30,42,24,.2)');for(let k=0;k<12;k++){const fx=x+(r()-0.5)*u*1.6,fy=y-r()*u*0.5;TH.ln(c,[fx,fy],[fx,fy-u*(0.4+r()*0.4)],'#5f8a45',u*0.06);}for(let k=0;k<13;k++){const fx=x+(r()-0.5)*u*1.6,fy=y-u*(0.5+r()*0.8);TH.ell(c,fx,fy,u*0.13,u*0.11,['#f2c230','#f6efe0','#d9433b','#6a8ae8','#f4a6cb'][k%5]);TH.ell(c,fx,fy,u*0.05,u*0.05,'#fff0a0');}}},
  grassTuft:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);for(let k=0;k<13;k++){const a=-1.1+k/12*2.2+(r()-0.5)*0.2,l=u*(0.7+r()*0.8);TH.ln(c,[x+(r()-0.5)*u*0.6,y],[x+Math.sin(a)*l*0.8+(r()-0.5)*u*0.3,y-l],['#6fa650','#5f9645','#85b85f'][k%3],u*0.09);}}},
  stones:{cat:'rock',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.8,'#9a9a92'],[0.7,0.2,0.8,0.7,'#a8a8a0'],[0,-0.35,0.7,0.6,'#8a8a82']].forEach(([dx,dy,rx,ry,col])=>{const px=x+dx*u,py=y+dy*u,sx=u*rx,sy=u*ry*(1+r()*0.2);TH.ell(c,px+sx*0.15,py+sy*0.3,sx*1.05,sy*0.45,'rgba(30,42,24,.25)');TH.poly(c,[[px-sx,py],[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px-sx*0.6,py+sy*0.2]],col);TH.poly(c,[[px+sx*0.25,py-sy*0.98],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px+sx*0.2,py+sy*0.05]],shade(col,-0.25));TH.poly(c,[[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.1,py-sy*0.5],[px-sx*0.5,py-sy*0.45]],'#6f9a4a');});}},
  stoneWall:{cat:'rock',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*7+2),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.5,y+u*0.12,u*2.4,u*0.4,'rgba(30,42,24,.24)');MBOX(c,x,y,u,-2.0,2.0,-0.3,0.3,0,0.8,'#a2a29a');for(let row=0;row<3;row++)for(let k=0;k<9;k++){const X=-1.9+k*0.44+(row%2)*0.22;TH.ln(c,I(X,0.31,0.1+row*0.26),I(X+0.38,0.31,0.1+row*0.26),'rgba(40,40,36,.35)',u*0.05);TH.ln(c,I(X,0.31,0.1+row*0.26),I(X,0.31,0.3+row*0.26),'rgba(40,40,36,.3)',u*0.05);}for(let k=0;k<6;k++)TH.blob(c,...I(-1.8+r()*3.6,0,0.85),u*0.3,u*0.2,'#6f9a4a',r,6);}},
  /* ---------- hills ---------- */
  rollingHill:{cat:'rock',rho:0.2,draw(c,x,y,u,v){const r=mulberry(v*7+8),H=u*(4.4+r()*1.8),w=u*(3.8+r()*0.9);TH.ell(c,x+u*0.8,y+u*0.25,w*1.3,u*0.7,'rgba(30,42,24,.22)');
    c.save();c.translate(x,y);c.beginPath();c.moveTo(-w*1.35,0);c.bezierCurveTo(-w*1.1,-H*0.85,-w*0.45,-H*1.1,0,-H);c.bezierCurveTo(w*0.45,-H*1.05,w*1.1,-H*0.8,w*1.35,0);c.closePath();c.fillStyle='#86ad5e';c.fill();c.clip();
    const cols=['#8fb665','#7ea556','#9bc070','#76a050'];for(let k=0;k<7;k++){const y0=-H*1.1+k*H*0.2;c.fillStyle=cols[k%4];c.globalAlpha=0.55;c.beginPath();c.moveTo(-w*1.5,y0+w*0.15);c.lineTo(w*1.5,y0-w*0.15);c.lineTo(w*1.5,y0+H*0.2-w*0.15);c.lineTo(-w*1.5,y0+H*0.2+w*0.15);c.closePath();c.fill();}c.globalAlpha=1;
    for(let k=0;k<5;k++){const y0=-H*(0.2+k*0.17);TH.ln(c,[-w*1.4,y0+w*0.15],[w*1.4,y0-w*0.15],'rgba(46,92,38,.55)',u*0.12);}
    const g=c.createLinearGradient(-w*1.3,0,w*1.3,0);g.addColorStop(0,'rgba(220,240,160,.2)');g.addColorStop(0.5,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(20,50,22,.38)');c.fillStyle=g;c.fillRect(-w*1.4,-H*1.2,w*2.8,H*1.3);
    for(let k=0;k<9;k++){const t=Math.pow(r(),0.7),yy=-H*(0.1+t*0.8),span=w*(1.2-t*0.9),xx=(r()*2-1)*span,rr=u*(0.32+r()*0.22);c.fillStyle=['#3f7a36','#4f8a42','#346e30'][k%3];c.beginPath();c.ellipse(xx,yy,rr,rr*0.8,0,0,7);c.fill();}c.restore();}},
  woodedHill:{cat:'rock',rho:0.2,draw(c,x,y,u,v){const r=mulberry(v*5+6),H=u*(4.8+r()*1.6),w=u*(3.5+r()*0.8);TH.ell(c,x+u*0.8,y+u*0.25,w*1.3,u*0.7,'rgba(30,42,24,.22)');
    c.save();c.translate(x,y);c.beginPath();c.moveTo(-w*1.3,0);c.bezierCurveTo(-w*1.1,-H*0.85,-w*0.45,-H*1.1,0,-H);c.bezierCurveTo(w*0.45,-H*1.05,w*1.1,-H*0.8,w*1.3,0);c.closePath();c.fillStyle='#4f8a42';c.fill();c.clip();
    const g=c.createLinearGradient(-w*1.3,0,w*1.3,0);g.addColorStop(0,'rgba(200,235,150,.18)');g.addColorStop(0.5,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,40,20,.45)');c.fillStyle=g;c.fillRect(-w*1.4,-H*1.2,w*2.8,H*1.3);
    for(let k=0;k<44;k++){const t=Math.pow(r(),0.85),yy=-H*(0.03+t*0.93),span=w*(1.3-Math.pow(t,1.4)*1.05),xx=(r()*2-1)*span,rr=u*(0.5+r()*0.4);c.fillStyle=['#3f7a36','#4f8a42','#5f9a4a','#346e30','#6fa955'][Math.floor(r()*5)];c.beginPath();c.ellipse(xx,yy,rr,rr*0.8,0,0,7);c.fill();if(r()<0.5){c.fillStyle='rgba(200,240,150,.3)';c.beginPath();c.ellipse(xx-rr*0.25,yy-rr*0.3,rr*0.5,rr*0.3,0,0,7);c.fill();}}c.restore();}},
  crag:{cat:'rock',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*9+2),H=u*(3.4+r()*1.4),w=u*(2.0+r()*0.5);TH.ell(c,x+u*0.7,y+u*0.2,w*1.4,u*0.5,'rgba(30,42,24,.25)');const bands=['#b4b2a2','#a4a294','#c0beae','#98978a'];for(let i=0;i<4;i++){const t0=i/4,t1=(i+1)/4,j0=(r()-0.5)*u*0.4,j1=(r()-0.5)*u*0.4;TH.poly(c,[[x-w+j0,y-H*t0],[x+w+j1,y-H*t0],[x+w*0.92+j1,y-H*t1],[x-w*0.92+j0,y-H*t1]],bands[i%4]);TH.poly(c,[[x+w*0.2,y-H*t0],[x+w+j1,y-H*t0],[x+w*0.92+j1,y-H*t1],[x+w*0.2,y-H*t1]],'rgba(40,40,30,.26)');}
    TH.poly(c,[[x-w*0.95,y-H],[x+w*0.9,y-H],[x+w*0.65,y-H-u*0.5],[x-w*0.65,y-H-u*0.5]],'#7aa855');for(let k=0;k<4;k++)TH.blob(c,x+(r()*2-1)*w*0.7,y-H-u*0.3,u*0.55,u*0.4,['#4f8a42','#5f9a4a'][k%2],r,7);for(let k=0;k<3;k++)TH.ln(c,[x+(r()*2-1)*w*0.8,y-H*0.98],[x+(r()*2-1)*w*0.8,y-H*(0.5+r()*0.3)],'#4f8a42',u*0.1);}},
  /* ---------- cottages and a single small tower (sprinkled) ---------- */
  timberHouse:{cat:'struct',rho:0.13,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),tile=v%2===0,rc=tile?'#b5553a':'#c9a85a',rd=tile?'#8a3f28':'#a2823a';
    MFRAME(c,x,y,u,-1.6,1.6,-1.1,1.1,0,1.4,MPLASTER,MWOOD_D,v+1);MFRAME(c,x,y,u,-1.75,1.75,-1.25,1.25,1.4,2.5,MPLASTER,MWOOD_D,v+4);
    TH.poly(c,[I(-0.35,1.12,0),I(0.35,1.12,0),I(0.35,1.12,1.2),I(-0.35,1.12,1.2)],'#4a2f18','#2a1a10',u*0.05);MWIN(c,x,y,u,-1.15,1.12,0.45,'f');MWIN(c,x,y,u,1.1,1.12,0.45,'f');MWIN(c,x,y,u,-0.7,1.27,1.7,'f');MWIN(c,x,y,u,0.7,1.27,1.7,'f');
    MGABLE(c,x,y,u,-1.95,1.95,-1.45,1.45,2.5,3.9,rc,rd,0);for(let k=1;k<7;k++)TH.ln(c,I(1.95-0.325*k,-1.45,2.5+0.2*k),I(1.95-0.325*k,1.45,2.5+0.2*k),'rgba(30,15,5,.3)',u*0.05);
    TH.ln(c,I(-1.95,1.46,2.5),I(0,1.46,3.9),MWOOD_D,u*0.12);TH.ln(c,I(1.95,1.46,2.5),I(0,1.46,3.9),MWOOD_D,u*0.12);MBOX(c,x,y,u,1.0,1.5,-0.9,-0.4,2.9,4.3,'#9a5a44');TH.ell(c,...I(1.25,-0.65,4.35),u*0.3,u*0.14,'#3a2a24');TH.ell(c,I(1.25,-0.65,4.9)[0],I(1.25,-0.65,4.9)[1],u*0.35,u*0.2,'rgba(235,235,240,.5)');}},
  stoneHouse:{cat:'struct',rho:0.13,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v*5+1);MBOX(c,x,y,u,-1.7,1.7,-1.2,1.2,0,2.2,'#a8a89c');
    for(let row=0;row<7;row++)for(let k=0;k<8;k++){const X=-1.65+k*0.43+(row%2)*0.2,Z=0.1+row*0.3;TH.ln(c,I(X,1.21,Z),I(X+0.38,1.21,Z),'rgba(40,40,32,.34)',u*0.05);TH.ln(c,I(X,1.21,Z),I(X,1.21,Z+0.3),'rgba(40,40,32,.28)',u*0.05);}for(let row=0;row<7;row++)for(let k=0;k<6;k++){const Y=-1.15+k*0.4+(row%2)*0.18,Z=0.1+row*0.3;TH.ln(c,I(1.71,Y,Z),I(1.71,Y+0.36,Z),'rgba(30,30,24,.3)',u*0.05);}
    c.beginPath();const d0=I(-0.4,1.22,0),d1=I(0.4,1.22,0),dt=I(0,1.22,1.5);c.moveTo(d0[0],d0[1]);c.lineTo(I(-0.4,1.22,1.0)[0],I(-0.4,1.22,1.0)[1]);c.quadraticCurveTo(dt[0],dt[1]-u*0.35,I(0.4,1.22,1.0)[0],I(0.4,1.22,1.0)[1]);c.lineTo(d1[0],d1[1]);c.closePath();c.fillStyle='#4a2f18';c.fill();c.strokeStyle='#6a6a62';c.lineWidth=u*0.1;c.stroke();
    [[-1.2,0.8],[1.0,0.8],[-0.1,1.55]].forEach(([X,Z],i)=>{if(i<2)TH.poly(c,[I(X-0.2,1.22,Z),I(X+0.2,1.22,Z),I(X+0.2,1.22,Z+0.55),I(X-0.2,1.22,Z+0.55)],'#26303c','#6a6a62',u*0.05);});
    TH.poly(c,[I(2.0,-1.5,2.2),I(2.0,1.5,2.2),I(0,1.5,3.5),I(0,-1.5,3.5)],'#6a7078');for(let k=1;k<8;k++)TH.ln(c,I(2.0-0.25*k,-1.5,2.2+0.16*k),I(2.0-0.25*k,1.5,2.2+0.16*k),'rgba(20,24,30,.35)',u*0.05);TH.poly(c,[I(-2.0,1.5,2.2),I(2.0,1.5,2.2),I(0,1.5,3.5)],'#a8a89c');MBOX(c,x,y,u,0.7,1.3,-0.9,-0.3,2.8,4.4,'#8d8d84');TH.ell(c,...I(1.0,-0.6,4.5),u*0.34,u*0.16,'#3a3a34');TH.ell(c,I(1.0,-0.6,5.0)[0],I(1.0,-0.6,5.0)[1],u*0.4,u*0.22,'rgba(235,235,240,.5)');}},
  thatchHouse:{cat:'struct',rho:0.12,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v*3+2);MFRAME(c,x,y,u,-1.5,1.5,-1.0,1.0,0,1.3,MPLASTER,MWOOD_D,v+7);
    TH.poly(c,[I(-0.3,1.02,0),I(0.3,1.02,0),I(0.3,1.02,1.05),I(-0.3,1.02,1.05)],'#4a2f18','#2a1a10',u*0.05);MWIN(c,x,y,u,-1.0,1.02,0.4,'f');MWIN(c,x,y,u,1.0,1.02,0.4,'f');
    const roof=[I(1.8,-1.3,1.15),I(1.8,1.3,1.15),I(0.9,1.3,2.5),I(-0.9,1.3,2.5),I(-1.8,1.3,1.15)];TH.poly(c,[I(1.8,-1.3,1.15),I(1.8,1.3,1.15),I(0,1.3,3.0),I(0,-1.3,3.0)],'#c9a85a');TH.poly(c,[I(-1.8,1.3,1.15),I(1.8,1.3,1.15),I(0,1.3,3.0)],'#a2823a');
    for(let k=1;k<9;k++)TH.ln(c,I(1.8-0.2*k,-1.3,1.15+0.23*k),I(1.8-0.2*k,1.3,1.15+0.23*k),'rgba(120,90,30,.45)',u*0.07);for(let k=0;k<9;k++){const t=k/8,p=I(-1.8+3.6*t,1.31,1.15+0*t);TH.ell(c,p[0],p[1]+u*0.05,u*0.22,u*0.12,'#b8943f');}TH.ln(c,I(0,1.31,3.0),I(0,-1.3,3.0),'#8a6a2a',u*0.14);MBOX(c,x,y,u,0.8,1.3,-0.8,-0.3,2.2,3.5,'#9a9a92');TH.ell(c,I(1.05,-0.55,3.6)[0],I(1.05,-0.55,3.6)[1],u*0.3,u*0.14,'#3a3a34');TH.ell(c,I(1.05,-0.55,4.1)[0],I(1.05,-0.55,4.1)[1],u*0.35,u*0.2,'rgba(235,235,240,.5)');}},
  bellTower:{cat:'struct',rho:0.07,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);MBOX(c,x,y,u,-1.15,1.15,-1.15,1.15,0,4.4,'#a8a89c');for(let row=0;row<14;row++){const Z=0.1+row*0.3;for(let k=0;k<5;k++){const X=-1.1+k*0.46+(row%2)*0.2;TH.ln(c,I(X,1.16,Z),I(X+0.4,1.16,Z),'rgba(40,40,32,.3)',u*0.05);}}
    TH.poly(c,[I(-0.2,1.17,0),I(0.2,1.17,0),I(0.2,1.17,0.9),I(-0.2,1.17,0.9)],'#4a2f18');TH.poly(c,[I(-0.12,1.17,2.0),I(0.12,1.17,2.0),I(0.12,1.17,2.7),I(-0.12,1.17,2.7)],'#26303c');
    MBOX(c,x,y,u,-1.3,1.3,-1.3,1.3,4.4,4.6,'#8d8d84');MBOX(c,x,y,u,-1.0,1.0,-1.0,1.0,4.6,6.0,'#b8b8ae');[-0.45,0.45].forEach(X=>TH.poly(c,[I(X-0.3,1.01,4.7),I(X+0.3,1.01,4.7),I(X+0.3,1.01,5.6),I(X,1.01,5.9),I(X-0.3,1.01,5.6)],'#2a2420'));TH.ell(c,...I(0,1.0,5.1),u*0.16,u*0.2,'#c9a640');
    const b=I(0,0,6.0),t=I(0,0,8.6);TH.poly(c,[[b[0]-u*1.55,b[1]+u*0.2],[b[0]+u*1.55,b[1]+u*0.2],[t[0]+u*0.1,t[1]]],'#6a7078');TH.poly(c,[[b[0]+u*0.1,b[1]+u*0.2],[b[0]+u*1.55,b[1]+u*0.2],[t[0]+u*0.1,t[1]]],'#4a5058');TH.ln(c,[t[0]+u*0.1,t[1]],[t[0]+u*0.1,t[1]-u*0.7],'#c9a640',u*0.1);TH.poly(c,[[t[0]+u*0.1,t[1]-u*0.7],[t[0]+u*0.7,t[1]-u*0.55],[t[0]+u*0.1,t[1]-u*0.4]],'#b5362b');}},
  well:{cat:'struct',rho:0.05,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.6,y+u*0.14,u*1.7,u*0.5,'rgba(30,42,24,.25)');const rx=u*0.95,ry=u*0.42;c.fillStyle='#8d8d84';c.beginPath();c.moveTo(x-rx,y);c.lineTo(x-rx,y-u*0.95);c.ellipse(x,y-u*0.95,rx,ry,0,Math.PI,0,true);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI);c.closePath();c.fill();c.fillStyle='#a8a89c';c.beginPath();c.moveTo(x-rx,y);c.lineTo(x-rx,y-u*0.95);c.lineTo(x-rx*0.1,y-u*0.95+ry*0.99);c.lineTo(x-rx*0.1,y+ry*0.99);c.closePath();c.fill();for(let k=0;k<5;k++)TH.ln(c,[x-rx+k*rx*0.4,y-u*0.1+Math.sin(k)*ry*0.3],[x-rx+k*rx*0.4,y-u*0.85],'rgba(40,40,32,.25)',u*0.05);TH.ell(c,x,y-u*0.95,rx,ry,'#74746e');TH.ell(c,x,y-u*0.95,rx*0.78,ry*0.7,'#2a5a78');
    [-1,1].forEach(s=>TH.ln(c,[x+s*rx*0.85,y-u*0.8],[x+s*rx*0.85,y-u*2.6],'#5f3d20',u*0.18));TH.ln(c,[x-rx*0.85,y-u*2.5],[x+rx*0.85,y-u*2.5],'#5f3d20',u*0.14);TH.poly(c,[[x-rx*1.2,y-u*2.5],[x+rx*1.2,y-u*2.5],[x,y-u*3.5]],'#b5553a');TH.ln(c,[x,y-u*2.5],[x,y-u*1.4],'#3a3a34',u*0.05);TH.poly(c,[[x-u*0.18,y-u*1.4],[x+u*0.18,y-u*1.4],[x+u*0.14,y-u*1.0],[x-u*0.14,y-u*1.0]],'#8a5a33');}},
  /* ---------- small props (lower tiers only) ---------- */
  haybale:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.3,u*0.4,'rgba(30,42,24,.2)');TH.box(c,x,y,u,-0.9,0.1,-0.6,0.6,0,0.9,'#e0c26a','#b89a45','#f0d77a');TH.box(c,x,y,u,0.2,1.2,-0.6,0.6,0,0.9,'#e0c26a','#b89a45','#f0d77a');TH.box(c,x,y,u,-0.4,0.7,-0.5,0.5,0.9,1.8,'#e0c26a','#b89a45','#f0d77a');[-0.4,0.4].forEach(X=>TH.ln(c,I(X,0.61,0.9),I(X,0.61,1.7),'#8a7030',u*0.05));}},
  barrels:{cat:'prop',rho:0.05,draw(c,x,y,u,v){const bar=(bx,by,s)=>{const w=u*0.5*s,h=u*0.95*s;TH.ell(c,bx+w*0.5,by+w*0.2,w*1.3,w*0.4,'rgba(30,42,24,.2)');TH.ell(c,bx,by,w,w*0.4,'#5a3b22');c.fillStyle='#8a5a33';c.beginPath();c.moveTo(bx-w,by);c.quadraticCurveTo(bx-w*1.12,by-h*0.5,bx-w,by-h);c.lineTo(bx+w,by-h);c.quadraticCurveTo(bx+w*1.12,by-h*0.5,bx+w,by);c.ellipse(bx,by,w,w*0.4,0,0,Math.PI);c.fill();[0.2,0.8].forEach(f=>TH.ln(c,[bx-w*1.04,by-h*f],[bx+w*1.04,by-h*f],'#3a3f4a',u*0.08));TH.ell(c,bx,by-h,w,w*0.4,'#a97d49');};bar(x-u*0.6,y,1);bar(x+u*0.55,y+u*0.1,0.95);bar(x,y-u*0.15,0.9);}},
  cart:{cat:'prop',rho:0.08,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.5,y+u*0.12,u*2.0,u*0.55,'rgba(30,42,24,.22)');TH.box(c,x,y,u,-1.3,1.0,-0.7,0.7,0.5,0.8,'#8a5a33','#6a4426','#a8764a');for(let k=0;k<2;k++){const Y=k?0.71:-0.71;TH.poly(c,[I(-1.3,Y,0.8),I(1.0,Y,0.8),I(1.0,Y,1.3),I(-1.3,Y,1.3)],k?'#8a5a33':'#6a4426');}TH.blob(c,...I(-0.15,0,1.55),u*1.3,u*0.6,'#e0c26a',mulberry(v+3),9);const wheel=(X,Y)=>{const p=I(X,Y,0.5);c.strokeStyle='#4a3220';c.lineWidth=u*0.14;c.beginPath();c.ellipse(p[0],p[1],u*0.55,u*0.55,0,0,7);c.stroke();for(let k=0;k<6;k++){const a=k/6*6.283;TH.ln(c,[p[0],p[1]],[p[0]+Math.cos(a)*u*0.5,p[1]+Math.sin(a)*u*0.5],'#4a3220',u*0.06);}};wheel(0.4,0.8);wheel(-0.7,0.8);TH.ln(c,I(1.0,0,0.7),I(2.0,0.1,0.55),'#5f3d20',u*0.16);}},
  bannerString:{cat:'prop',rho:0.12,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*2.4,u*0.4,'rgba(30,42,24,.14)');[-2.2,2.2].forEach(X=>TH.ln(c,I(X,0,0),I(X,0,3.4),'#6a4a2a',u*0.18));const cols=['#b5362b','#2a5aa8','#f2c230','#f6efe0','#2f7a3a'];let prev=null;for(let k=0;k<=10;k++){const X=-2.2+4.4*k/10,p=I(X,0,3.3-Math.sin(k/10*Math.PI)*0.7);if(prev)TH.ln(c,prev,p,'#d9d4c2',u*0.04);prev=p;if(k<10){const q=I(X+0.2,0,3.3-Math.sin((k+0.5)/10*Math.PI)*0.7);TH.poly(c,[[q[0]-u*0.22,q[1]],[q[0]+u*0.22,q[1]],[q[0]+u*0.22,q[1]+u*0.45],[q[0],q[1]+u*0.65],[q[0]-u*0.22,q[1]+u*0.45]],cols[k%5]);}}}},
  lanternPost:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(30,42,24,.25)');TH.ln(c,[x,y],[x,y-u*3.0],'#2a2d36',u*0.2);TH.ln(c,[x,y-u*2.85],[x+u*0.55,y-u*2.85],'#2a2d36',u*0.12);const lx=x+u*0.55,ly=y-u*2.8,g=c.createRadialGradient(lx,ly-u*0.3,0,lx,ly-u*0.3,u*1.4);g.addColorStop(0,'rgba(255,215,130,.5)');g.addColorStop(1,'rgba(255,215,130,0)');c.fillStyle=g;c.beginPath();c.arc(lx,ly-u*0.3,u*1.4,0,7);c.fill();TH.poly(c,[[lx-u*0.25,ly],[lx+u*0.25,ly],[lx+u*0.2,ly-u*0.6],[lx-u*0.2,ly-u*0.6]],'#ffe9a8','#2a2d36',u*0.06);TH.poly(c,[[lx-u*0.3,ly-u*0.6],[lx+u*0.3,ly-u*0.6],[lx,ly-u*0.9]],'#2a2d36');}},
  woodFence:{cat:'prop',rho:0.09,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.3,y+u*0.1,u*2.0,u*0.35,'rgba(30,42,24,.16)');for(let k=0;k<4;k++){const X=-1.8+k*1.2;TH.ln(c,I(X,0,0),I(X,0,1.3),'#5f3d20',u*0.2);}[0.45,0.95].forEach(z=>TH.ln(c,I(-1.8,0,z),I(1.8,0,z),'#a67a48',u*0.15));}}
};

/* ---- eave-front versions of the three cottages: the long wall (with the door) faces the viewer and the gable end shows at the side ---- */
const MEAVE={
  timberHouse(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),tile=v%2===0,rc=tile?'#b5553a':'#c9a85a',rd=tile?'#8a3f28':'#a2823a';
    MFRAME(c,x,y,u,-2.0,2.0,-1.1,1.1,0,1.4,MPLASTER,MWOOD_D,v+1);MFRAME(c,x,y,u,-2.15,2.15,-1.25,1.25,1.4,2.5,MPLASTER,MWOOD_D,v+4);
    TH.poly(c,[I(-0.35,1.12,0),I(0.35,1.12,0),I(0.35,1.12,1.2),I(-0.35,1.12,1.2)],'#4a2f18','#2a1a10',u*0.05);[-1.3,1.3].forEach(X=>MWIN(c,x,y,u,X,1.12,0.45,'f'));[-1.3,0,1.3].forEach(X=>MWIN(c,x,y,u,X,1.27,1.7,'f'));
    MBOX(c,x,y,u,-1.5,-1.0,-0.6,-0.1,3.0,4.6,'#9a5a44');TH.ell(c,...I(-1.25,-0.35,4.65),u*0.3,u*0.14,'#3a2a24');TH.ell(c,I(-1.25,-0.35,5.2)[0],I(-1.25,-0.35,5.2)[1],u*0.35,u*0.2,'rgba(235,235,240,.5)');
    TH.poly(c,[I(-2.45,1.65,2.5),I(2.45,1.65,2.5),I(2.45,0,3.9),I(-2.45,0,3.9)],rc);for(let k=1;k<7;k++)TH.ln(c,I(-2.45,1.65-0.2357*k,2.5+0.2*k),I(2.45,1.65-0.2357*k,2.5+0.2*k),'rgba(30,15,5,.3)',u*0.05);
    TH.poly(c,[I(2.45,-1.65,2.5),I(2.45,1.65,2.5),I(2.45,0,3.9)],rd);TH.ln(c,I(2.46,-1.65,2.5),I(2.46,0,3.9),MWOOD_D,u*0.12);TH.ln(c,I(2.46,1.65,2.5),I(2.46,0,3.9),MWOOD_D,u*0.12);TH.ln(c,I(-2.45,0,3.9),I(2.45,0,3.9),MWOOD_D,u*0.1);},
  stoneHouse(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);MBOX(c,x,y,u,-2.0,2.0,-1.2,1.2,0,2.2,'#a8a89c');
    for(let row=0;row<7;row++)for(let k=0;k<9;k++){const X=-1.95+k*0.45+(row%2)*0.2,Z=0.1+row*0.3;TH.ln(c,I(X,1.21,Z),I(X+0.4,1.21,Z),'rgba(40,40,32,.34)',u*0.05);TH.ln(c,I(X,1.21,Z),I(X,1.21,Z+0.3),'rgba(40,40,32,.28)',u*0.05);}
    for(let row=0;row<7;row++)for(let k=0;k<6;k++){const Y=-1.15+k*0.4+(row%2)*0.18,Z=0.1+row*0.3;TH.ln(c,I(2.01,Y,Z),I(2.01,Y+0.36,Z),'rgba(30,30,24,.3)',u*0.05);}
    c.beginPath();const d0=I(-0.4,1.22,0),d1=I(0.4,1.22,0),dt=I(0,1.22,1.5);c.moveTo(d0[0],d0[1]);c.lineTo(I(-0.4,1.22,1.0)[0],I(-0.4,1.22,1.0)[1]);c.quadraticCurveTo(dt[0],dt[1]-u*0.35,I(0.4,1.22,1.0)[0],I(0.4,1.22,1.0)[1]);c.lineTo(d1[0],d1[1]);c.closePath();c.fillStyle='#4a2f18';c.fill();c.strokeStyle='#6a6a62';c.lineWidth=u*0.1;c.stroke();
    [-1.3,1.3].forEach(X=>TH.poly(c,[I(X-0.2,1.22,0.8),I(X+0.2,1.22,0.8),I(X+0.2,1.22,1.4),I(X-0.2,1.22,1.4)],'#26303c','#6a6a62',u*0.05));[-1.3,1.3].forEach(X=>TH.poly(c,[I(X-0.2,1.22,1.55),I(X+0.2,1.22,1.55),I(X+0.2,1.22,2.0),I(X-0.2,1.22,2.0)],'#26303c','#6a6a62',u*0.05));
    MBOX(c,x,y,u,1.4,1.95,-0.3,0.3,2.4,4.3,'#8d8d84');TH.ell(c,...I(1.67,0,4.4),u*0.34,u*0.16,'#3a3a34');TH.ell(c,I(1.67,0,4.95)[0],I(1.67,0,4.95)[1],u*0.4,u*0.22,'rgba(235,235,240,.5)');
    TH.poly(c,[I(-2.3,1.6,2.2),I(2.3,1.6,2.2),I(2.3,0,3.5),I(-2.3,0,3.5)],'#6a7078');for(let k=1;k<8;k++)TH.ln(c,I(-2.3,1.6-0.2*k,2.2+0.1625*k),I(2.3,1.6-0.2*k,2.2+0.1625*k),'rgba(20,24,30,.35)',u*0.05);
    TH.poly(c,[I(2.0,-1.2,2.2),I(2.0,1.2,2.2),I(2.0,0,3.5)],'#a8a89c');for(let k=0;k<4;k++)TH.ln(c,I(2.01,-1.0+k*0.3,2.3+k*0.05),I(2.01,0.9-k*0.3,2.3+k*0.05),'rgba(40,40,32,.3)',u*0.05);TH.ln(c,I(2.31,-1.6,2.2),I(2.31,0,3.5),'#5a6068',u*0.1);TH.ln(c,I(2.31,1.6,2.2),I(2.31,0,3.5),'#5a6068',u*0.1);},
  thatchHouse(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);MFRAME(c,x,y,u,-2.0,2.0,-1.0,1.0,0,1.3,MPLASTER,MWOOD_D,v+7);
    TH.poly(c,[I(-0.3,1.02,0),I(0.3,1.02,0),I(0.3,1.02,1.05),I(-0.3,1.02,1.05)],'#4a2f18','#2a1a10',u*0.05);[-1.3,1.3].forEach(X=>MWIN(c,x,y,u,X,1.02,0.4,'f'));
    MBOX(c,x,y,u,-1.5,-1.0,-0.5,0.0,2.3,3.5,'#9a9a92');TH.ell(c,I(-1.25,-0.25,3.6)[0],I(-1.25,-0.25,3.6)[1],u*0.3,u*0.14,'#3a3a34');TH.ell(c,I(-1.25,-0.25,4.1)[0],I(-1.25,-0.25,4.1)[1],u*0.35,u*0.2,'rgba(235,235,240,.5)');
    TH.poly(c,[I(-2.3,1.5,1.15),I(2.3,1.5,1.15),I(2.3,0,3.0),I(-2.3,0,3.0)],'#c9a85a');for(let k=1;k<9;k++)TH.ln(c,I(-2.3,1.5-0.1667*k,1.15+0.2056*k),I(2.3,1.5-0.1667*k,1.15+0.2056*k),'rgba(120,90,30,.45)',u*0.07);for(let k=0;k<10;k++){const t=k/9,p=I(-2.3+4.6*t,1.51,1.15);TH.ell(c,p[0],p[1]+u*0.05,u*0.22,u*0.12,'#b8943f');}
    TH.poly(c,[I(2.3,-1.5,1.15),I(2.3,1.5,1.15),I(2.3,0,3.0)],'#a2823a');for(let k=1;k<6;k++)TH.ln(c,I(2.31,-1.5+0.25*k,1.2+0.1*k),I(2.31,1.5-0.25*k,1.2+0.1*k),'rgba(100,70,20,.4)',u*0.05);TH.ln(c,I(-2.3,0,3.0),I(2.3,0,3.0),'#8a6a2a',u*0.14);}
};
/* orientation: v&3 -> bit0 mirrors left/right, bit1 chooses gable-front (0) or eave-front (1); v>>2 stays the random seed for roofs and timbers */
(function(){const flipWrap=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
  const shadow=(c,x,y,u,w,h)=>TH.ell(c,x+u*0.8,y+u*0.2,u*w,u*h,'rgba(30,42,24,.25)');
  ['timberHouse','stoneHouse','thatchHouse'].forEach(k=>{const gable=MEDIEVAL_ASSETS[k].draw,eave=MEAVE[k],sw=k==='thatchHouse'?2.8:3.0,sh=k==='thatchHouse'?0.85:0.9;
    MEDIEVAL_ASSETS[k].draw=(c,x,y,u,v)=>{const o=v&3,s=v>>2,isEave=(o>>1)&1;shadow(c,x,y,u,isEave?sw*1.25:sw,isEave?sh*1.05:sh);flipWrap(c,x,o&1,()=>isEave?eave(c,x,y,u,s):gable(c,x,y,u,s));};});
  const tw=MEDIEVAL_ASSETS.bellTower.draw;MEDIEVAL_ASSETS.bellTower.draw=(c,x,y,u,v)=>{shadow(c,x,y,u,2.0,0.65);flipWrap(c,x,v&1,()=>tw(c,x,y,u,v));};})();

/* ===== MACRO-LAND ENGINE (hex geometry, path network, planner, baker) ===== */
const W3=Math.sqrt(3),HX=W3/2,HV=[[HX,0.29],[0,0.58],[-HX,0.29],[-HX,-0.29],[0,-0.58],[HX,-0.29]];
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[0,1,2],[-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5,1.5]],C:[[0],[-0.5,0.5,1.5],[-1,0,1],[-0.5]],D:[[0,1,2],[-0.5,0.5,1.5],[0,1]]};
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

function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol,clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]),key=[T.id,shape,tier,R,m,ground,sc,JSON.stringify(clr),JSON.stringify(opts.clearTiles||[])].join('|');const cached=revisedLandCache.get(key);if(cached)return cached;
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=0.75,top=T.top||1.35,bot=0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);return[cv,g];};
  const [back,cb]=mk();T.ground(cb,G,R,ox,oy,m,ground,({A:11,B:22,C:33,D:44})[shape]);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]),vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho))&&!(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));
  const sprites=vis.map(o=>{const unit=u*(o.scale||1);return {x:m*o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>T.assets[o.kind].draw(ctx,x,y,unit,o.v)};});
  const front=document.createElement('canvas'),frontRect={x:0,y:0,w:1,h:1};front.width=front.height=1;
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return revisedLandCache.set(key,{back,front,frontRect,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0,sprites});
}
function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}

/* ===== MEDIEVAL LAND: planner (dense mixed woodland, rolling hills on the back rim, cottages sprinkled, one small tower beside homes) ===== */
const MEDIEVAL_REGION={top:{oak:.2,elm:.14,copperBeech:.04,poplar:.1,yew:.06,birch:.12,pine:.08,appleTree:.0,sapling:.06},mid:{oak:.26,birch:.12,elm:.1,appleTree:.16,copperBeech:.04,yew:.06,poplar:.06,pine:.04,willow:.04,sapling:.08},bottom:{appleTree:.24,oak:.18,birch:.16,sapling:.14,yew:.08,copperBeech:.04,willow:.04,elm:.08}};
const MEDIEVAL_LOW=[['sapling',1],['appleTree',0.75],['birch',0.65],['oak',0.55],['yew',0.62],['sapling',1.2],['appleTree',0.85]];
const MEDIEVAL_CAP={willow:3,poplar:8,yew:8,copperBeech:5,pine:6};
const MEDIEVAL_UNDER=['hedge','hawthorn','roseBush','flowers','grassTuft','hedge','flowers','grassTuft','stones'];
const MEDIEVAL_PLAN_CACHE={};
function getMedievalPlan(shape){
  if(MEDIEVAL_PLAN_CACHE[shape])return MEDIEVAL_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(({A:5101,B:6202,C:7303,D:8404})[shape]),placed=[],bb=G.bbox,used={},A=MEDIEVAL_ASSETS;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;});
  const clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.66);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'oak';};
  const capOk=k=>!(MEDIEVAL_CAP[k]&&(used[k]||0)>=MEDIEVAL_CAP[k]);
  const regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?MEDIEVAL_REGION.top:n<0.68?MEDIEVAL_REGION.mid:MEDIEVAL_REGION.bottom;};
  const place=(kind,x,y,extra)=>{const D=A[kind],sc=(extra&&extra.scale)||(D.cat==='tree'?0.88+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1),rho=D.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!clearOthers(px,py,rho))continue;if((D.cat==='tree'||D.cat==='shrub'||D.cat==='prop')&&placed.some(o=>o.noSouth&&Math.abs(px-o.x)<0.3&&py-o.y>-0.05&&py-o.y<0.36))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const tree=(x,y,extra,dom,low)=>{if(low){const L=MEDIEVAL_LOW[Math.floor(rng()*MEDIEVAL_LOW.length)];return place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return place(dom&&rng()<0.55&&capOk(dom)?dom:pickFrom(regionOf(y),capOk),x,y,extra||{});};
  const under=(x,y,extra)=>place(MEDIEVAL_UNDER[Math.floor(rng()*MEDIEVAL_UNDER.length)],x,y,extra||{});
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),interior=G.edges.filter(e=>!e.outer);
  const KS=G.centers.length/12,thin=l=>{const n=Math.max(1,Math.round(l.length*KS));return Array.from({length:n},(_,i)=>l[Math.floor((i+0.5)*l.length/n)]);},cnt=n=>Math.max(1,Math.round(n*KS));
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. back rim: rolling and wooded hills (no mountain range), the odd small crag and a drystone wall, with tall elms / poplars behind */
  {const pts=[];top.forEach(e=>[0.2,0.5,0.8].forEach(t=>pts.push(onEdge(e,t,0.0))));pts.sort((a,b)=>a[0]-b[0]);const x0=pts[0][0],x1=pts[pts.length-1][0],nearest=x=>pts.reduce((b,p)=>Math.abs(p[0]-x)<Math.abs(b[0]-x)?p:b);
    const centers=[];let x=x0+0.12+rng()*0.2;while(x<x1-0.05){centers.push(x);x+=0.8+rng()*0.55;}
    centers.forEach((cxp,i)=>{const p=nearest(cxp),bx=p[0],by=p[1],mt=a=>a+(rng()<0.35?1:0),at=(k,dx,dy,ex)=>place(k,bx+dx,by+dy,ex);
      {['elm','oak','poplar','oak','birch','elm'].forEach((k,j)=>at(k,(j-2.5)*0.27+(rng()-0.5)*0.1,-0.02+(rng()-0.5)*0.06,{minT:j<2?1:j<4?mt(2):mt(3),scale:1.0+rng()*0.25}));at('stones',0.05,0.1,{minT:2});if(rng()<0.4)at('stoneWall',-0.6,0.06,{minT:2});}});
    {const gaps=[];for(let i=0;i+1<centers.length;i++)gaps.push(i);[gaps[0],gaps[gaps.length-1]].filter((g,i,a)=>g!==undefined&&a.indexOf(g)===i).forEach((gi,k)=>{const p=nearest((centers[gi]+centers[gi+1])/2);place(k?'poplar':'elm',p[0],p[1]-0.06,{minT:k?4:3,scale:1.15,clear:1.3});});}}
  /* 2. cottages sprinkled across the land (farthest-point spacing, on the rim where there is room), a well, and ONE small bell tower placed beside a cottage */
  {const rim=[],inn=[];sides.concat(outer.filter(e=>e.cls==='bottom')).forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.forEach(e=>inn.push([e.mid[0],e.mid[1]]));
    const seq=thin([['timberHouse','r',1],['thatchHouse','r',2],['stoneHouse','r',3],['timberHouse','r',3],['well','a',3],['thatchHouse','r',4],['stoneHouse','r',4]]),chosen=[],sc={timberHouse:1.2,thatchHouse:1.2,stoneHouse:1.2,well:1.2},stone=[];
    seq.forEach(([k,z,mt])=>{const pool=z==='r'?rim:z==='i'?inn:rim.concat(inn),ranked=pool.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.25})).sort((a,b)=>b.d-a.d);
      for(let n=0;n<Math.min(10,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],{minT:mt,scale:sc[k],clear:2.5,noSouth:true});if(o){chosen.push([o.x,o.y]);if(k==='stoneHouse')stone.push(o);return;}}});
    /* the tower: one instance, right next to a cottage */
    {const home=stone[stone.length-1]||placed.find(o=>o.cat==='struct');if(home){const offs=[[0.34,-0.08],[-0.34,-0.08],[0.3,0.12],[-0.3,0.12],[0.42,0.0],[-0.42,0.0]];for(const [dx,dy] of offs){const o=place('bellTower',home.x+dx,home.y+dy,{minT:4,scale:1.0,clear:2.4,noSouth:true});if(o)break;}}}}
  /* 2b. a village in the middle: smaller cottages in the interior voids and wide corridors (placed before the trees so the trees give way) */
  {const inn=[];G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.filter(e=>e.vertical).forEach(e=>inn.push([e.mid[0],e.mid[1]]));
    const chosen=placed.filter(o=>o.cat==='struct').map(o=>[o.x,o.y]),seq=thin([['thatchHouse',2],['stoneHouse',2],['timberHouse',3],['thatchHouse',3],['timberHouse',4],['stoneHouse',4],['thatchHouse',4]]);
    seq.forEach(([k,mt])=>{const ranked=inn.map(p=>({p,d:Math.min(1e9,...chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.2})).sort((a,b)=>b.d-a.d);
      for(let n=0;n<Math.min(12,ranked.length);n++){const o=place(k,ranked[n].p[0],ranked[n].p[1],{minT:mt,scale:1.05,clear:3.0,noSouth:true});if(o){chosen.push([o.x,o.y]);return;}}});}
  /* 3. trees: junction groves, corridor trees, rim groves, corner fill (dense, same as the approved frontier setting) */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=pickFrom(regionOf(v.y),capOk),n=1+Math.floor(rng()*2.0);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.09:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{const dom=pickFrom(regionOf(e.mid[1]),capOk);[-0.27,0,0.27].forEach(dy=>{if(rng()<0.5)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});});
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.72)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.8+rng()*0.2},null,true);if(rng()<0.22)tree(e.mid[0]+(rng()-0.5)*0.34,e.mid[1]+(rng()-0.5)*0.14,{scale:0.78+rng()*0.2},null,true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.26));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(e.cls==='top'?-0.02:0)+(rng()-0.2)*0.12)});});
    let mode='grove',run=0,dom='oak';samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.74?'grove':r<0.92?'sparse':'open';run=2+Math.floor(rng()*4);dom=pickFrom(regionOf(s.p[1]),capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){if(e.cls==='top'&&rng()<0.08)return;tree(p[0],p[1],null,dom,low);if(rng()<0.55)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,dom,low);if(rng()<0.2)tree(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,dom,true);if(rng()<0.14)tree(p[0]+(rng()-0.5)*0.34,p[1]-0.2,null,dom,low);}
      else if(mode==='sparse'){if(rng()<0.5)tree(p[0],p[1],null,dom,low);else under(p[0],p[1]);}else if(rng()<0.6)under(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.8)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<14;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.2)tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);}});
  /* 4. undergrowth: hedges, hawthorn, roses, flowers */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.45)under(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.35)under(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.38)under(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.3)under(px,py);}});
  /* 5. small props: lower tiers only (haybales, barrels, a cart, a banner string, lamp posts, fences) */
  [['haybale',3],['barrels',2],['cart',1],['bannerString',1],['lanternPost',2],['woodFence',2]].forEach(([k,n])=>{for(let i=0;i<cnt(n);i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  {const houses=placed.filter(o=>/House$/.test(o.kind)).sort((a,b)=>a.x-b.x||a.y-b.y),cyc=[0,3,1,2];houses.forEach((o,i)=>{o.v=((o.v>>2)<<2)|cyc[i%4];});placed.filter(o=>o.kind==='bellTower').forEach(o=>{o.v=((o.v>>2)<<2)|(rng()<0.5?1:0);});}
  const cuts={tree:[0.2,0.52,0.8,1],shrub:[0.06,0.38,0.7,1],rock:[0.3,0.55,0.8,1],prop:[1,1,1,1],struct:[0,0,0,0]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop'||o.cat==='struct')o.tier=o.minT;});
  const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
  for(let t=1;t<=4;t++){let guard=0;while(guard++<300){const c=count(t);if(c.tr/Math.max(1,c.n)>=0.7)break;const pool=placed.filter(o=>o.tier<=t&&t<=o.maxT),cand=(pool.filter(o=>o.cat==='shrub').sort((a,b)=>b.pri-a.pri)[0])||(pool.filter(o=>o.prop&&o.minT>1).sort((a,b)=>b.pri-a.pri)[0]);if(!cand)break;cand.tier=Math.min(5,cand.tier+1);}}
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.sort((a,b)=>a.y-b.y);
  return MEDIEVAL_PLAN_CACHE[shape]={G,objs:placed,rng};
}
/* ---- ground: soft sage-green meadow, mown-stripe patches, buttercups and daisies, clover and small stones (decals, not objects) ---- */
function medievalGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<46;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'170,205,120':'70,110,56',r()<0.5?0.2:0.2);}
  for(let k=0;k<12;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'200,190,120',0.15);}              /* sun-bleached meadow */
  for(let k=0;k<8;k++){const p=pt(),w=R*(0.25+r()*0.4);soft(p[0],p[1],w,w*0.4,'120,96,62',0.14);}               /* worn earth */
  for(let k=0;k<160;k++){const p=pt(),h=R*(0.05+r()*0.06);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#6fa650','#5f9645','#85b85f'][(k+j)%3],R*0.011);}
  for(let k=0;k<60;k++){const p=pt();for(let j=0;j<3;j++)TH.ell(c,p[0]+(j-1)*R*0.016,p[1]+(j%2)*R*0.01,R*0.014,R*0.011,'#5f9a50');}     /* clover */
  for(let k=0;k<54;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.012,R*0.01,['#f2c230','#f6efe0','#f4a6cb','#fff0a0','#8aa8e8'][k%5]);}
  for(let k=0;k<22;k++){const p=pt();TH.ell(c,p[0],p[1],R*(0.014+r()*0.012),R*0.01,'rgba(150,152,146,.6)');}
  c.restore();c.restore();
}
const MEDIEVAL_THEME={id:'medieval',assets:MEDIEVAL_ASSETS,plan:getMedievalPlan,ground:medievalGround,groundCol:'#8aa66a',top:1.4};
const MEDIEVAL_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
function bakeLandMedieval(shape,tier,R,opts){return bakeLandTheme(MEDIEVAL_THEME,shape,tier,R,opts);}
function drawLandMedievalBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandMedievalFront(ctx,x,y,land){land.sprites.slice().sort((a,b)=>a.y-b.y).forEach(s=>drawScenicSprite(ctx,s,x+s.x,y+s.y));}
function landMedievalSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}


return Object.freeze({bake: bakeLandMedieval, drawBack: drawLandMedievalBack, drawFront: drawLandMedievalFront});
})(),
  western: (() => {

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

/* ===== WILD WEST ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const WS=(c,x,y,rx)=>{c.fillStyle='rgba(70,45,20,.2)';c.beginPath();c.ellipse(x+rx*0.28,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const WRK=(c,x,y,rx,ry,col,snow)=>{TH.ell(c,x+rx*0.15,y+ry*0.3,rx*1.05,ry*0.45,'rgba(60,35,15,.22)');TH.poly(c,[[x-rx,y],[x-rx*0.9,y-ry*0.6],[x-rx*0.35,y-ry*1.05],[x+rx*0.4,y-ry*0.95],[x+rx*0.95,y-ry*0.35],[x+rx,y+ry*0.1],[x-rx*0.6,y+ry*0.2]],col);
  TH.poly(c,[[x+rx*0.25,y-ry*0.98],[x+rx*0.95,y-ry*0.35],[x+rx,y+ry*0.1],[x+rx*0.2,y+ry*0.05]],shade(col,-0.28));TH.poly(c,[[x-rx*0.9,y-ry*0.6],[x-rx*0.35,y-ry*1.05],[x+rx*0.1,y-ry*0.95],[x-rx*0.4,y-ry*0.55]],shade(col,0.18));
  TH.ln(c,[x-rx*0.85,y-ry*0.3],[x+rx*0.8,y-ry*0.15],'rgba(80,40,20,.22)',ry*0.07);};
const WCONIF=(c,x,y,u,o,r)=>{const h=u*o.h,w=u*o.w,n=o.tiers;TH.ln(c,[x,y],[x,y-h*0.25],'#5a3b22',u*0.38);for(let i=0;i<n;i++){const t=i/n,ww=w*(1-0.8*t)*(0.9+r()*0.2),yb=y-h*(0.1+0.78*t),tip=yb-h*0.4;
    const pts=[[x-ww,yb],[x-ww*0.55,yb-h*0.045],[x-ww*0.2,yb+h*0.012],[x+ww*0.25,yb-h*0.04],[x+ww*0.6,yb+h*0.01],[x+ww,yb]];TH.poly(c,pts.concat([[x,tip]]),o.c1);TH.poly(c,[[x,tip],[x+ww,yb],[x+ww*0.6,yb+h*0.01],[x+ww*0.25,yb-h*0.04],[x,yb]],o.c2);}};
const WEST_ASSETS={
  /* ---------- trees ---------- */
  cottonwood:{cat:'tree',rho:0.13,draw(c,x,y,u,v){const r=mulberry(v*7+1),H=u*(4.4+r()*1.1);WS(c,x,y,u*2.0);c.strokeStyle='#8a7c64';c.lineWidth=u*0.58;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-u*0.12,y-H*0.35,x+u*0.05,y-H*0.62);c.stroke();c.strokeStyle='#a99b82';c.lineWidth=u*0.2;c.beginPath();c.moveTo(x-u*0.12,y);c.quadraticCurveTo(x-u*0.22,y-H*0.35,x-u*0.05,y-H*0.6);c.stroke();
    TH.ln(c,[x+u*0.05,y-H*0.5],[x-u*0.95,y-H*0.86],'#8a7c64',u*0.3);TH.ln(c,[x+u*0.05,y-H*0.56],[x+u*1.05,y-H*0.82],'#8a7c64',u*0.28);const cols=['#9db551','#8aa545','#aec45f','#7b9a3d','#bccd6e'];
    [[0,-0.9,1.5,1.1],[-1.25,-0.65,1.1,0.9],[1.25,-0.65,1.1,0.9],[0.05,-0.3,1.7,1.0],[-0.65,-1.5,1.0,0.8],[0.75,-1.45,1.0,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H*0.8+dy*u,u*rx,u*ry,r()<0.12?'#d2c653':cols[i%5],r,9));}},
  mesquite:{cat:'tree',rho:0.15,draw(c,x,y,u,v){const r=mulberry(v*5+3),H=u*(2.6+r()*0.6);WS(c,x,y,u*2.1);c.strokeStyle='#4f3b28';c.lineCap='round';c.lineWidth=u*0.4;c.beginPath();c.moveTo(x-u*0.1,y);c.bezierCurveTo(x-u*0.5,y-H*0.35,x+u*0.5,y-H*0.5,x,y-H*0.78);c.stroke();c.lineWidth=u*0.25;c.beginPath();c.moveTo(x+u*0.1,y-H*0.25);c.bezierCurveTo(x+u*0.9,y-H*0.35,x+u*1.0,y-H*0.6,x+u*0.9,y-H*0.78);c.stroke();
    const cols=['#8a9a46','#7a8a3c','#96a652','#6f7f35'];[[-1.5,-0.25,1.0,0.7],[-0.5,-0.85,1.2,0.8],[0.8,-0.7,1.2,0.8],[1.7,-0.2,1.0,0.7],[0.2,-0.2,1.5,0.8],[-0.8,-0.2,1.1,0.7]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H*0.78+dy*u,u*rx,u*ry,cols[i%4],r,8));}},
  juniper:{cat:'tree',rho:0.1,draw(c,x,y,u,v){const r=mulberry(v*3+5);WS(c,x,y,u*1.5);TH.ln(c,[x,y],[x+u*0.1,y-u*0.9],'#6b5640',u*0.45);const cols=['#4e7a64','#436b57','#5d8a72','#3c6450'];[[0,-2.0,1.2,1.0],[-0.7,-1.3,1.0,0.9],[0.7,-1.3,1.0,0.9],[0,-0.9,1.3,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,cols[i],r,8));for(let k=0;k<5;k++)TH.ell(c,x+(r()-0.5)*u*1.8,y-u*(0.8+r()*1.8),u*0.07,u*0.07,'#4a5a9a');}},
  pinyon:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*11+2);WS(c,x,y,u*1.4);WCONIF(c,x,y,u,{h:4.0+r()*1.0,w:1.35,tiers:5,c1:'#3c6a45',c2:'#2c5236'},r);}},
  ponderosa:{cat:'tree',rho:0.09,draw(c,x,y,u,v){const r=mulberry(v*13+1),H=u*(5.8+r()*1.0);WS(c,x,y,u*1.3);TH.ln(c,[x,y],[x,y-H*0.78],'#9a5f3c',u*0.45);TH.ln(c,[x-u*0.1,y],[x-u*0.1,y-H*0.7],'#b97a50',u*0.15);
    const cols=['#3d6b43','#2f5a38','#4b7a50'];[[0,-0.2,1.5,0.8],[-0.6,-0.95,1.3,0.75],[0.6,-0.95,1.3,0.75],[0,-1.6,1.0,0.7],[-0.35,-2.2,0.7,0.6],[0.2,-2.65,0.5,0.5]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H*0.7+dy*u,u*rx,u*ry,cols[i%3],r,8));}},
  saguaro:{cat:'tree',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*17+4),H=u*(4.6+r()*1.4),w=u*0.46;WS(c,x,y,u*1.0);const col=(x0,yb,h,ww)=>{const g=c.createLinearGradient(x0-ww,0,x0+ww,0);g.addColorStop(0,'#78ad63');g.addColorStop(0.55,'#4f8a45');g.addColorStop(1,'#2e6030');c.beginPath();c.moveTo(x0-ww,yb);c.lineTo(x0-ww,yb-h+ww);c.arc(x0,yb-h+ww,ww,Math.PI,0);c.lineTo(x0+ww,yb);c.closePath();c.fillStyle=g;c.fill();for(let k=-1;k<=1;k++)TH.ln(c,[x0+k*ww*0.5,yb-h*0.02],[x0+k*ww*0.5,yb-h+ww*0.8],'rgba(20,60,30,.35)',u*0.05);};
    const arm=(s,yy,out,up)=>{c.lineCap='round';c.lineJoin='round';c.strokeStyle='#2e6030';c.lineWidth=u*0.62;c.beginPath();c.moveTo(x+s*w*0.5,y-yy);c.lineTo(x+s*(w+out),y-yy);c.lineTo(x+s*(w+out),y-yy-up);c.stroke();c.strokeStyle='#5a9a50';c.lineWidth=u*0.4;c.stroke();};
    arm(-1,H*0.42,u*0.75,u*1.5+r()*u*0.7);if(r()<0.85)arm(1,H*0.55,u*0.8,u*1.1+r()*u*0.8);col(x,y,H,w);TH.ell(c,x-w*0.1,y-H,w*0.35,w*0.25,'#f3e9d2');}},
  joshua:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*19+2),H=u*(3.2+r()*0.8);WS(c,x,y,u*1.3);TH.ln(c,[x,y],[x,y-H*0.55],'#7c6a50',u*0.5);for(let k=0;k<7;k++)TH.ln(c,[x-u*0.2,y-H*0.08*k],[x+u*0.2,y-H*0.08*k+u*0.1],'rgba(50,35,20,.35)',u*0.06);
    const tuft=(tx,ty)=>{for(let k=0;k<11;k++){const a=-Math.PI*0.95+k/10*Math.PI*0.9,l=u*(0.65+r()*0.35);TH.ln(c,[tx,ty],[tx+Math.cos(a)*l,ty+Math.sin(a)*l*0.9],k%2?'#7d8f4a':'#a3a35a',u*0.09);}};
    [[-1.0,0.78],[0.9,0.85],[0.1,1.0]].forEach(([dx,f],i)=>{const bx=x+dx*u,by=y-H*f;TH.ln(c,[x,y-H*0.5],[bx,by+u*0.2],'#7c6a50',u*0.3);tuft(bx,by);});}},
  deadTree:{cat:'tree',rho:0.04,draw(c,x,y,u,v){const r=mulberry(v*23+1),H=u*(3.0+r()*0.8);WS(c,x,y,u*0.9);c.lineCap='round';TH.ln(c,[x,y],[x+u*0.15,y-H],'#8d8577',u*0.4);TH.ln(c,[x+u*0.1,y-H*0.55],[x-u*1.0,y-H*0.9],'#8d8577',u*0.22);TH.ln(c,[x+u*0.12,y-H*0.7],[x+u*0.95,y-H*1.05],'#8d8577',u*0.2);TH.ln(c,[x-u*0.55,y-H*0.78],[x-u*0.9,y-H*1.15],'#8d8577',u*0.14);TH.ln(c,[x+u*0.15,y-H],[x,y-H*1.25],'#8d8577',u*0.15);}},
  /* ---------- shrubs ---------- */
  sage:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*3+7);TH.ell(c,x+u*0.2,y+u*0.1,u*1.1,u*0.35,'rgba(70,45,20,.18)');[[-0.55,-0.4,0.7,0.5],[0.5,-0.4,0.7,0.5],[0,-0.7,0.8,0.55]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,u*rx,u*ry,['#93a082','#a3ae92','#86967a'][i],r,7));}},
  pricklyPear:{cat:'shrub',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*5+9);TH.ell(c,x+u*0.2,y+u*0.1,u*1.0,u*0.3,'rgba(70,45,20,.18)');const pad=(px,py,rx,ry,rot)=>{TH.ell(c,px,py,rx,ry,'#6f9a4e',rot);TH.ell(c,px-rx*0.2,py-ry*0.2,rx*0.55,ry*0.5,'rgba(255,255,255,.12)',rot);for(let k=0;k<5;k++)TH.ell(c,px+(r()-0.5)*rx,py+(r()-0.5)*ry,u*0.035,u*0.035,'#f3ead0');};pad(x,y-u*0.5,u*0.5,u*0.62,0);pad(x+u*0.55,y-u*1.05,u*0.4,u*0.5,0.5);pad(x-u*0.5,y-u*1.0,u*0.38,u*0.48,-0.5);[[0.85,-1.35],[-0.8,-1.3]].forEach(([dx,dy])=>TH.ell(c,x+dx*u,y+dy*u,u*0.14,u*0.11,'#c0392b'));}},
  yucca:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*7+2);TH.ell(c,x+u*0.15,y+u*0.08,u*0.8,u*0.25,'rgba(70,45,20,.18)');TH.ln(c,[x,y],[x,y-u*0.7],'#7c6a50',u*0.35);for(let k=0;k<13;k++){const a=-Math.PI*0.97+k/12*Math.PI*0.94,l=u*(0.9+r()*0.5);TH.ln(c,[x,y-u*0.7],[x+Math.cos(a)*l,y-u*0.7+Math.sin(a)*l],k%2?'#5f8a52':'#6f9a5a',u*0.12);}if(r()<0.5){TH.ln(c,[x,y-u*0.7],[x+u*0.1,y-u*2.6],'#e9dcc0',u*0.1);for(let k=0;k<5;k++)TH.ell(c,x+u*0.1,y-u*(1.6+k*0.22),u*0.14,u*0.1,'#f6efe0');}}},
  barrelCactus:{cat:'shrub',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.15,y+u*0.08,u*0.7,u*0.22,'rgba(70,45,20,.18)');const g=c.createRadialGradient(x-u*0.2,y-u*0.7,0,x,y-u*0.5,u*0.8);g.addColorStop(0,'#86b872');g.addColorStop(1,'#3f7a3a');c.fillStyle=g;c.beginPath();c.ellipse(x,y-u*0.5,u*0.55,u*0.6,0,0,7);c.fill();for(let k=-2;k<=2;k++)TH.ln(c,[x+k*u*0.2,y-u*0.05],[x+k*u*0.16,y-u*1.05],'rgba(20,60,30,.4)',u*0.05);TH.ell(c,x,y-u*1.08,u*0.2,u*0.1,'#f2c230');}},
  dryGrass:{cat:'shrub',rho:0.05,draw(c,x,y,u,v){const r=mulberry(v*11+4);for(let k=0;k<12;k++){const a=-1.1+k/11*2.2+(r()-0.5)*0.2,l=u*(0.5+r()*0.55);TH.ln(c,[x+(r()-0.5)*u*0.6,y],[x+Math.sin(a)*l+(r()-0.5)*u*0.3,y-l],['#c9b46a','#b8a35a','#d8c77a'][k%3],u*0.07);}}},
  /* ---------- rockwork ---------- */
  boulders:{cat:'rock',rho:0.08,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.8,'#b7714b'],[0.7,0.2,0.8,0.7,'#c28a5c'],[0,-0.35,0.7,0.6,'#a8633f']].forEach(([dx,dy,rx,ry,col],i)=>WRK(c,x+dx*u,y+dy*u,u*rx,u*ry*(1+r()*0.2),col));}},
  spire:{cat:'rock',rho:0.06,draw(c,x,y,u,v){const r=mulberry(v*9+2),H=u*(5.5+r()*3.2),w=u*(0.9+r()*0.4);TH.ell(c,x+u*0.5,y+u*0.1,w*1.5,u*0.4,'rgba(60,35,15,.22)');const bands=['#c07a50','#b86a42','#c98e62','#b0603a'];const n=5;for(let i=0;i<n;i++){const t0=i/n,t1=(i+1)/n,w0=w*(1-0.62*t0),w1=w*(1-0.62*t1);TH.poly(c,[[x-w0,y-H*t0],[x+w0,y-H*t0],[x+w1,y-H*t1],[x-w1,y-H*t1]],bands[i%4]);TH.poly(c,[[x+w0*0.15,y-H*t0],[x+w0,y-H*t0],[x+w1,y-H*t1],[x+w1*0.15,y-H*t1]],'rgba(60,25,10,.28)');}
    TH.poly(c,[[x-w*0.38,y-H],[x+w*0.38,y-H],[x+w*0.1,y-H-u*0.7],[x-w*0.1,y-H-u*0.7]],'#a8603a');TH.ln(c,[x-w*0.9,y-H*0.35],[x+w*0.9,y-H*0.35],'rgba(80,40,20,.25)',u*0.07);}},
  butte:{cat:'rock',rho:0.12,draw(c,x,y,u,v){const r=mulberry(v*7+8),H=u*(5.0+r()*1.6),w=u*(1.8+r()*0.5);TH.ell(c,x+u*0.8,y+u*0.15,w*1.5,u*0.5,'rgba(60,35,15,.22)');
    TH.poly(c,[[x-w*1.5,y],[x-w*0.95,y-H*0.35],[x+w*0.95,y-H*0.35],[x+w*1.5,y]],'#c9936a');TH.poly(c,[[x+w*0.4,y-H*0.35],[x+w*0.95,y-H*0.35],[x+w*1.5,y],[x+w*0.55,y]],'rgba(80,40,20,.25)');
    const cliff=['#b86a42','#c07a50','#a85f3a','#c98e62'];for(let i=0;i<4;i++){const t0=0.35+i*0.1625,t1=0.35+(i+1)*0.1625;TH.poly(c,[[x-w*0.95,y-H*t0],[x+w*0.95,y-H*t0],[x+w*0.9,y-H*t1],[x-w*0.9,y-H*t1]],cliff[i]);TH.poly(c,[[x+w*0.25,y-H*t0],[x+w*0.95,y-H*t0],[x+w*0.9,y-H*t1],[x+w*0.25,y-H*t1]],'rgba(60,25,10,.3)');}
    for(let k=-3;k<=3;k++)TH.ln(c,[x+k*w*0.27,y-H*0.4],[x+k*w*0.25,y-H*0.98],'rgba(60,25,10,.18)',u*0.06);TH.poly(c,[[x-w*0.95,y-H],[x+w*0.9,y-H],[x+w*0.6,y-H-u*0.4],[x-w*0.6,y-H-u*0.4]],'#d4a577');}},
  mesa:{cat:'rock',rho:0.2,draw(c,x,y,u,v){const r=mulberry(v*5+6),H=u*(5.5+r()*1.0),w=u*(3.0+r()*0.8);TH.ell(c,x+u*1.0,y+u*0.2,w*1.5,u*0.6,'rgba(60,35,15,.2)');
    TH.poly(c,[[x-w*1.4,y],[x-w*1.05,y-H*0.3],[x+w*1.0,y-H*0.3],[x+w*1.4,y]],'#c9936a');TH.poly(c,[[x+w*0.3,y-H*0.3],[x+w*1.0,y-H*0.3],[x+w*1.4,y],[x+w*0.5,y]],'rgba(80,40,20,.22)');
    const cliff=['#b86a42','#c07a50','#a85f3a','#c98e62','#b0603a'];for(let i=0;i<5;i++){const t0=0.3+i*0.14,t1=0.3+(i+1)*0.14;TH.poly(c,[[x-w*1.0,y-H*t0],[x+w*1.0,y-H*t0],[x+w*0.97,y-H*t1],[x-w*0.97,y-H*t1]],cliff[i]);TH.poly(c,[[x+w*0.3,y-H*t0],[x+w*1.0,y-H*t0],[x+w*0.97,y-H*t1],[x+w*0.3,y-H*t1]],'rgba(60,25,10,.28)');}
    for(let k=-5;k<=5;k++)TH.ln(c,[x+k*w*0.19,y-H*0.35],[x+k*w*0.18,y-H*1.0],'rgba(60,25,10,.16)',u*0.06);TH.poly(c,[[x-w*1.0,y-H],[x+w*0.97,y-H],[x+w*0.7,y-H-u*0.5],[x-w*0.7,y-H-u*0.5]],'#d4a577');for(let k=0;k<4;k++)WRK(c,x+(r()-0.5)*w*1.2,y-H-u*0.2,u*0.35,u*0.25,'#b7714b');}},
  ledge:{cat:'rock',rho:0.16,draw(c,x,y,u,v){const r=mulberry(v*3+3),w=u*(2.2+r()*0.8),H=u*(1.6+r()*0.6);TH.ell(c,x+u*0.5,y+u*0.1,w*1.1,u*0.35,'rgba(60,35,15,.2)');const bands=['#c07a50','#b86a42','#c98e62'];for(let i=0;i<3;i++){const t0=i/3,t1=(i+1)/3,j0=(r()-0.5)*u*0.5,j1=(r()-0.5)*u*0.5;TH.poly(c,[[x-w+j0,y-H*t0],[x+w+j1,y-H*t0],[x+w*0.9+j1,y-H*t1],[x-w*0.92+j0,y-H*t1]],bands[i]);TH.poly(c,[[x+w*0.2,y-H*t0],[x+w+j1,y-H*t0],[x+w*0.9+j1,y-H*t1],[x+w*0.2,y-H*t1]],'rgba(60,25,10,.26)');}
    TH.poly(c,[[x-w*0.92,y-H],[x+w*0.9,y-H],[x+w*0.7,y-H-u*0.3],[x-w*0.7,y-H-u*0.3]],'#d4a577');WRK(c,x-w*0.7,y,u*0.5,u*0.4,'#a8633f');WRK(c,x+w*0.85,y+u*0.05,u*0.45,u*0.35,'#b7714b');}},
  arch:{cat:'rock',rho:0.2,draw(c,x,y,u,v){const H=u*6.0,w=u*1.2;TH.ell(c,x+u*1.2,y+u*0.2,u*4.2,u*0.7,'rgba(60,35,15,.2)');[[-2.1],[2.1]].forEach(([dx],k)=>{const px=x+dx*u;const bands=['#c07a50','#b86a42','#c98e62','#b0603a'];for(let i=0;i<4;i++){const t0=i/4,t1=(i+1)/4,w0=w*(1-0.25*t0),w1=w*(1-0.25*t1);TH.poly(c,[[px-w0,y-H*0.9*t0],[px+w0,y-H*0.9*t0],[px+w1,y-H*0.9*t1],[px-w1,y-H*0.9*t1]],bands[(i+k)%4]);TH.poly(c,[[px+w0*0.2,y-H*0.9*t0],[px+w0,y-H*0.9*t0],[px+w1,y-H*0.9*t1],[px+w1*0.2,y-H*0.9*t1]],'rgba(60,25,10,.28)');}});
    c.beginPath();c.moveTo(x-u*3.3,y-H*0.78);c.quadraticCurveTo(x,y-H*1.28,x+u*3.3,y-H*0.78);c.lineTo(x+u*3.1,y-H*0.62);c.quadraticCurveTo(x,y-H*1.05,x-u*3.1,y-H*0.62);c.closePath();c.fillStyle='#b86a42';c.fill();c.strokeStyle='rgba(60,25,10,.3)';c.lineWidth=u*0.1;c.stroke();TH.ln(c,[x-u*3.0,y-H*0.7],[x+u*3.0,y-H*0.7],'rgba(255,220,170,.2)',u*0.1);}},
  /* ---------- small props (lower tiers only) ---------- */
  hay:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.3,u*0.4,'rgba(70,45,20,.2)');TH.box(c,x,y,u,-0.9,0.1,-0.6,0.6,0,0.9,'#e0c26a','#b89a45','#f0d77a');TH.box(c,x,y,u,0.2,1.2,-0.6,0.6,0,0.9,'#e0c26a','#b89a45','#f0d77a');TH.box(c,x,y,u,-0.4,0.7,-0.5,0.5,0.9,1.8,'#e0c26a','#b89a45','#f0d77a');[-0.4,0.4].forEach(X=>TH.ln(c,I(X,0.61,0.9),I(X,0.61,1.7),'#8a7030',u*0.05));}},
  barrel:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.8,u*0.25,'rgba(70,45,20,.2)');const w=u*0.5,h=u*0.95;TH.ell(c,x,y,w,w*0.4,'#5a3b22');c.fillStyle='#8a5a33';c.beginPath();c.moveTo(x-w,y);c.quadraticCurveTo(x-w*1.12,y-h*0.5,x-w,y-h);c.lineTo(x+w,y-h);c.quadraticCurveTo(x+w*1.12,y-h*0.5,x+w,y);c.ellipse(x,y,w,w*0.4,0,0,Math.PI);c.fill();[0.2,0.8].forEach(f=>TH.ln(c,[x-w*1.04,y-h*f],[x+w*1.04,y-h*f],'#3a3f4a',u*0.08));TH.ell(c,x,y-h,w,w*0.4,'#a97d49');}},
  wheel:{cat:'prop',rho:0.04,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.1,u*0.9,u*0.25,'rgba(70,45,20,.2)');const cx=x,cy=y-u*0.95,r=u*0.95;c.strokeStyle='#6a4a2a';c.lineWidth=u*0.16;c.beginPath();c.ellipse(cx,cy,r*0.78,r,0.15,0,7);c.stroke();for(let k=0;k<8;k++){const a=k/8*6.283;TH.ln(c,[cx,cy],[cx+Math.cos(a)*r*0.78,cy+Math.sin(a)*r],'#6a4a2a',u*0.08);}TH.ell(c,cx,cy,u*0.14,u*0.16,'#3a3f4a');TH.ln(c,[x-u*0.3,y],[cx-u*0.3,cy+r*0.6],'#6a4a2a',u*0.12);}},
  trough:{cat:'prop',rho:0.06,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*1.6,u*0.45,'rgba(70,45,20,.2)');TH.box(c,x,y,u,-1.3,1.3,-0.45,0.45,0.1,0.85,'#8a5a33','#6a4424','#a97d49');TH.poly(c,[I(-1.15,-0.32,0.86),I(1.15,-0.32,0.86),I(1.15,0.32,0.86),I(-1.15,0.32,0.86)],'#5a9ac0');[-1.2,1.2].forEach(X=>{TH.ln(c,I(X,-0.3,0),I(X,-0.3,0.2),'#5a3b22',u*0.14);TH.ln(c,I(X,0.3,0),I(X,0.3,0.2),'#5a3b22',u*0.14);});}},
  fence:{cat:'prop',rho:0.09,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.3,y+u*0.1,u*2.0,u*0.35,'rgba(70,45,20,.16)');for(let k=0;k<4;k++){const X=-1.8+k*1.2;TH.ln(c,I(X,0,0),I(X,0,1.4),'#6a4a2a',u*0.2);}[0.5,1.05].forEach(z=>TH.ln(c,I(-1.8,0,z),I(1.8,0,z),'#8a6a44',u*0.14));}},
  lamp:{cat:'prop',rho:0.03,draw(c,x,y,u,v){TH.ell(c,x+u*0.3,y+u*0.08,u*0.7,u*0.22,'rgba(70,45,20,.2)');TH.ln(c,[x,y],[x,y-u*3.1],'#2a2d36',u*0.16);TH.ln(c,[x,y-u*2.95],[x+u*0.5,y-u*2.95],'#2a2d36',u*0.1);const lx=x+u*0.5,ly=y-u*2.9,g=c.createRadialGradient(lx,ly-u*0.3,0,lx,ly-u*0.3,u*1.4);g.addColorStop(0,'rgba(255,215,130,.5)');g.addColorStop(1,'rgba(255,215,130,0)');c.fillStyle=g;c.beginPath();c.arc(lx,ly-u*0.3,u*1.4,0,7);c.fill();TH.poly(c,[[lx-u*0.25,ly],[lx+u*0.25,ly],[lx+u*0.2,ly-u*0.6],[lx-u*0.2,ly-u*0.6]],'#ffe9a8','#2a2d36',u*0.06);TH.poly(c,[[lx-u*0.3,ly-u*0.6],[lx+u*0.3,ly-u*0.6],[lx,ly-u*0.9]],'#2a2d36');}},
  flags:{cat:'prop',rho:0.12,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.4,y+u*0.1,u*2.4,u*0.4,'rgba(70,45,20,.14)');[-2.2,2.2].forEach(X=>TH.ln(c,I(X,0,0),I(X,0,3.4),'#6a4a2a',u*0.18));const cols=['#c0392b','#f2c230','#2a6aa8','#f6efe0','#3f8a4a'];let prev=null;for(let k=0;k<=10;k++){const X=-2.2+4.4*k/10,p=I(X,0,3.3-Math.sin(k/10*Math.PI)*0.7);if(prev)TH.ln(c,prev,p,'#d9d4c2',u*0.04);prev=p;if(k<10){const q=I(X+0.2,0,3.3-Math.sin((k+0.5)/10*Math.PI)*0.7);TH.poly(c,[[q[0]-u*0.2,q[1]],[q[0]+u*0.2,q[1]],[q[0],q[1]+u*0.55]],cols[k%5]);}}}},
  /* ---------- structures (heavier tiers, one homestead only) ---------- */
  cabin:{cat:'struct',rho:0.17,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.8,y+u*0.2,u*3.0,u*0.9,'rgba(70,45,20,.22)');TH.box(c,x,y,u,-1.7,1.7,-1.2,1.2,0,2.2,'#a07a4e','#7a5a34','#b98c5a');for(let k=-3;k<=3;k++)TH.ln(c,I(k*0.46,1.21,0.05),I(k*0.46,1.21,2.15),'rgba(50,30,10,.35)',u*0.05);
    TH.poly(c,[I(-0.35,1.22,0),I(0.35,1.22,0),I(0.35,1.22,1.5),I(-0.35,1.22,1.5)],'#3a2615');TH.poly(c,[I(-1.3,1.22,1.2),I(-0.7,1.22,1.2),I(-0.7,1.22,1.8),I(-1.3,1.22,1.8)],'#2a1a10','#d9c9a0',u*0.05);
    TH.poly(c,[I(2.1,-1.6,2.2),I(2.1,1.6,2.2),I(0,1.6,3.5),I(0,-1.6,3.5)],'#9aa3a8');for(let k=1;k<7;k++)TH.ln(c,I(2.1-0.3*k,-1.6,2.2+0.185*k),I(2.1-0.3*k,1.6,2.2+0.185*k),'rgba(80,60,40,.3)',u*0.05);TH.poly(c,[I(-2.1,1.6,2.2),I(2.1,1.6,2.2),I(0,1.6,3.5)],'#7a5a34');TH.box(c,x,y,u,0.7,1.1,-0.9,-0.5,3.0,4.2,'#8d8478','#6d665a','#a39b8e');
    TH.box(c,x,y,u,-1.3,1.3,1.3,2.3,0,1.0,'#a07a4e','#7a5a34','#b98c5a');}},
  waterTower:{cat:'struct',rho:0.09,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.ell(c,x+u*0.6,y+u*0.15,u*1.9,u*0.6,'rgba(70,45,20,.22)');[[-0.9,-0.9],[0.9,-0.9],[-0.9,0.9],[0.9,0.9]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(X*0.8,Y*0.8,4.4),'#6a4a2a',u*0.22));[1.4,3.0].forEach(z=>{const f=1-z*0.05;TH.ln(c,I(-f*0.9,f*0.9,z),I(f*0.9,f*0.9,z),'#6a4a2a',u*0.12);TH.ln(c,I(f*0.9,f*0.9,z),I(f*0.9,-f*0.9,z),'#6a4a2a',u*0.12);});TH.ln(c,I(-0.8,0.8,1.4),I(0.8,0.8,3.0),'#6a4a2a',u*0.08);TH.ln(c,I(0.8,0.8,1.4),I(-0.8,0.8,3.0),'#6a4a2a',u*0.08);
    const b=TH.iso(x,y,u,0,0,4.4),t=TH.iso(x,y,u,0,0,7.0),rx=u*1.25,ry=u*0.62,g=c.createLinearGradient(b[0]-rx,0,b[0]+rx,0);g.addColorStop(0,'#b0865a');g.addColorStop(0.5,'#8a6238');g.addColorStop(1,'#5a3f22');c.beginPath();c.moveTo(b[0]-rx,b[1]);c.lineTo(t[0]-rx,t[1]);c.lineTo(t[0]+rx,t[1]);c.lineTo(b[0]+rx,b[1]);c.ellipse(b[0],b[1],rx,ry,0,0,Math.PI);c.closePath();c.fillStyle=g;c.fill();for(let k=-3;k<=3;k++)TH.ln(c,[b[0]+k*rx*0.3,b[1]+ry*Math.sqrt(1-(k*0.3)**2)],[t[0]+k*rx*0.3,t[1]+ry*Math.sqrt(1-(k*0.3)**2)],'rgba(40,25,10,.3)',u*0.05);[0.3,0.7].forEach(f=>{c.strokeStyle='#3a3f4a';c.lineWidth=u*0.1;c.beginPath();c.ellipse(b[0],b[1]+(t[1]-b[1])*f,rx,ry,0,0,Math.PI);c.stroke();});TH.ell(c,t[0],t[1],rx,ry,'#7a5a34');TH.poly(c,[[t[0]-rx*1.05,t[1]],[t[0],t[1]-u*1.1],[t[0]+rx*1.05,t[1]]],'#6a4a2a');}}
};

/* ===== MACRO-LAND ENGINE (hex geometry, path network, planner, baker) ===== */
const W3=Math.sqrt(3),HX=W3/2,HV=[[HX,0.29],[0,0.58],[-HX,0.29],[-HX,-0.29],[0,-0.58],[HX,-0.29]];
const LAND_ROWS={A:[[-1,0,1],[-1.5,-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5]],B:[[0,1,2],[-0.5,0.5,1.5],[-1,0,1],[-0.5,0.5,1.5]],C:[[0],[-0.5,0.5,1.5],[-1,0,1],[-0.5]],D:[[0,1,2],[-0.5,0.5,1.5],[0,1]]};
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
/* ---- corridor reservation (no paths are drawn; the corridors between the slots are kept clear of scenery so rides, queues and guest walkways have room): a spine through the corridors between the slots, then branches that appear on higher tiers ---- */
function planPaths(G,rng){
  const interior=G.edges.filter(e=>e.hexes.length===2),adj=new Map(),node=new Map();
  interior.forEach(e=>{e.w=e.len*(0.85+0.3*rng());[[e.ka,e.a],[e.kb,e.b]].forEach(([k,p])=>{node.set(k,p);if(!adj.has(k))adj.set(k,[]);});adj.get(e.ka).push({to:e.kb,e});adj.get(e.kb).push({to:e.ka,e});});
  const dijk=(sources,target)=>{const dist=new Map(),prev=new Map(),open=new Set(sources);sources.forEach(s=>dist.set(s,0));while(open.size){let cur=null,cd=1e9;open.forEach(k=>{if(dist.get(k)<cd){cd=dist.get(k);cur=k;}});open.delete(cur);if(cur===target)break;adj.get(cur).forEach(({to,e})=>{const nd=cd+e.w;if(!dist.has(to)||nd<dist.get(to)){dist.set(to,nd);prev.set(to,{from:cur,e});open.add(to);}});}
    const out=[];let k=target;while(prev.has(k)&&!sources.includes(k)){const p=prev.get(k);out.push(p.e);k=p.from;}return out;};
  const keys=[...node.keys()],pt=k=>node.get(k);
  const start=keys.reduce((b,k)=>pt(k)[1]>pt(b)[1]+1e-6||(Math.abs(pt(k)[1]-pt(b)[1])<1e-6&&Math.abs(pt(k)[0]-0.9)<Math.abs(pt(b)[0]-0.9))?k:b),end=keys.reduce((b,k)=>pt(k)[1]<pt(b)[1]-1e-6?k:b);
  const net=new Set(),netNodes=new Set([start]),tierOf=new Map();
  const add=(es,t)=>es.forEach(e=>{if(!tierOf.has(e)){tierOf.set(e,t);netNodes.add(e.ka);netNodes.add(e.kb);}});
  add(dijk([start],end),1);
  const farthest=()=>keys.filter(k=>!netNodes.has(k)).reduce((b,k)=>{const d=Math.min(...[...netNodes].map(n=>Math.hypot(pt(k)[0]-pt(n)[0],pt(k)[1]-pt(n)[1])));return !b||d>b.d?{k,d}:b;},null);
  const left=keys.reduce((b,k)=>pt(k)[0]<pt(b)[0]?k:b),right=keys.reduce((b,k)=>pt(k)[0]>pt(b)[0]?k:b);
  [left,right].forEach((tgt,i)=>{if(netNodes.has(tgt)){}else add(dijk([...netNodes],tgt),2+i);});
  const f=farthest();if(f)add(dijk([...netNodes],f.k),4);
  const jit=new Map();keys.forEach(k=>jit.set(k,[(rng()-0.5)*0.05,(rng()-0.5)*0.05]));
  const edgesT=[...tierOf.entries()].map(([e,t])=>({a:e.a,b:e.b,ka:e.ka,kb:e.kb,tier:t,vertical:e.vertical}));
  return{edges:edgesT,netNodes,jit,node};
}
/* waypoint chains for the edges visible at a tier (nodes of degree != 2 start/stop a chain) */
function pathChains(P,tier){
  const es=P.edges.filter(e=>e.tier<=tier),adj=new Map();es.forEach(e=>{[e.ka,e.kb].forEach(k=>{if(!adj.has(k))adj.set(k,[]);});adj.get(e.ka).push(e);adj.get(e.kb).push(e);});
  const used=new Set(),chains=[],pointOf=k=>P.node.get(k),other=(e,k)=>e.ka===k?e.kb:e.ka;
  const walk=(startK)=>{adj.get(startK).forEach(e0=>{if(used.has(e0))return;const chain=[startK];let k=startK,e=e0;while(e&&!used.has(e)){used.add(e);k=other(e,k);chain.push(k);const next=adj.get(k).filter(x=>!used.has(x));e=adj.get(k).length===2&&next.length===1?next[0]:null;}chains.push(chain);});};
  [...adj.keys()].filter(k=>adj.get(k).length!==2).forEach(walk);[...adj.keys()].forEach(k=>walk(k));
  return chains.map(ch=>ch.map(k=>{const p=pointOf(k),j=P.jit.get(k)||[0,0];return[p[0]+j[0],p[1]+j[1]];}));
}
function pathSamples(chains){const out=[];chains.forEach(ch=>{if(ch.length<2)return;let prev=ch[0];const mids=ch.slice(1).map((p,i)=>[(ch[i][0]+p[0])/2,(ch[i][1]+p[1])/2]);
  const seg=(p0,c,p1)=>{for(let t=0;t<=1.0001;t+=0.1){const q=1-t;out.push([q*q*p0[0]+2*q*t*c[0]+t*t*p1[0],q*q*p0[1]+2*q*t*c[1]+t*t*p1[1]]);}};
  const lin=(p0,p1)=>{for(let t=0;t<=1.0001;t+=0.2)out.push([p0[0]+(p1[0]-p0[0])*t,p0[1]+(p1[1]-p0[1])*t]);};
  lin(ch[0],mids[0]);for(let i=1;i<mids.length;i++)seg(mids[i-1],ch[i],mids[i]);lin(mids[mids.length-1],ch[ch.length-1]);});return out;}
/* ---- the planner: every object is placed once (clear of all slot ellipses and the path network) and given a tier range ---- */
const WEST_REGION={top:{pinyon:.28,ponderosa:.16,juniper:.24,cottonwood:.18,mesquite:.04,joshua:.05,deadTree:.05},mid:{cottonwood:.24,mesquite:.2,juniper:.2,pinyon:.12,saguaro:.07,joshua:.08,ponderosa:.05,deadTree:.04},bottom:{mesquite:.26,cottonwood:.2,juniper:.2,joshua:.12,saguaro:.1,pinyon:.07,deadTree:.05}};
const WEST_LOW=['mesquite','juniper','joshua','mesquite','juniper'];            /* short species only in the foreground (never hide a ride's base) */
const WEST_CAP={saguaro:4,joshua:4,deadTree:3,ponderosa:5};
const WEST_PLAN_CACHE={};
function getWestPlan(shape){
  if(WEST_PLAN_CACHE[shape])return WEST_PLAN_CACHE[shape];
  const G=landGeometry(shape),rng=mulberry(({A:4401,B:8802,C:6603,D:7704})[shape]),P=planPaths(G,rng),pathPts=pathSamples(pathChains(P,4)),placed=[],bb=G.bbox,used={};
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const inLand=(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  const free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.9),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.5);return dx*dx+dy*dy>=1;});
  const pathClear=(x,y,rho)=>pathPts.every(p=>Math.hypot(x-p[0],(y-p[1])*1.4)>=0.075+rho*0.55);
  const clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.8);
  const pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return 'mesquite';};
  const capOk=k=>!(WEST_CAP[k]&&(used[k]||0)>=WEST_CAP[k]);
  const regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?WEST_REGION.top:n<0.68?WEST_REGION.mid:WEST_REGION.bottom;};
  const place=(kind,x,y,extra)=>{const A=WEST_ASSETS[kind],sc=(extra&&extra.scale)||(A.cat==='tree'?0.88+rng()*0.38:A.cat==='shrub'?0.9+rng()*0.3:1),rho=A.rho*sc;
    for(let t=0;t<8;t++){const px=x+(t?(rng()-0.5)*0.12*t:0),py=y+(t?(rng()-0.5)*0.09*t:0);if(!inLand(px,py)||!free(px,py,rho)||!pathClear(px,py,rho)||!clearOthers(px,py,rho))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:A.cat,pri:rng(),minT:1,maxT:4},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  const tree=(x,y,extra,dom,low)=>{const ex=extra||{};const k=low?WEST_LOW[Math.floor(rng()*WEST_LOW.length)]:(dom&&rng()<0.55&&capOk(dom)?dom:pickFrom(regionOf(y),capOk));return place(k,x,y,ex);};
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side');
  const LKS=G.centers.length/12,landThin=l=>{const n=Math.max(1,Math.round(l.length*LKS));return Array.from({length:n},(_,i)=>l[Math.floor((i+0.5)*l.length/n)]);},landCnt=n=>Math.max(1,Math.round(n*LKS));
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  /* 1. the single homestead (heavier tiers): a small cabin on a flank with a water tower beside it, given a clearing */
  {const cand=sides.filter(e=>e.mid[1]>bb.minY+0.9).sort((a,b)=>b.mid[1]-a.mid[1]);for(const e of cand){const p=onEdge(e,0.5,0.14),c=place('cabin',p[0],p[1],{minT:3,scale:1.15,clear:1.9});if(c){const tw=place('waterTower',p[0]+(e.n[0]>0?0.02:-0.02),p[1]-0.5,{minT:4,clear:1.4})||place('waterTower',p[0],p[1]+0.5,{minT:4,clear:1.4});break;}}}
  /* 2. rock backdrop on the upper rim: irregular outcrop clusters (massif / spires / ledge runs), two mesas and one arch */
  {const pts=[];top.forEach(e=>[0.2,0.5,0.8].forEach(t=>pts.push(onEdge(e,t,0.0))));pts.sort((a,b)=>a[0]-b[0]);const x0=pts[0][0],x1=pts[pts.length-1][0],nearest=x=>pts.reduce((b,p)=>Math.abs(p[0]-x)<Math.abs(b[0]-x)?p:b);
    let x=x0+0.15+rng()*0.2,idx=0;const kinds=[];while(x<x1-0.1){kinds.push(x);x+=0.75+rng()*0.65;}
    const mesaAt=[Math.floor(kinds.length*0.28),Math.floor(kinds.length*0.74)];let archAt=Math.floor(kinds.length*0.52);if(LKS<1&&mesaAt.includes(archAt)){const fr=kinds.map((_,i)=>i).filter(i=>!mesaAt.includes(i));if(fr.length)archAt=fr[Math.floor(fr.length/2)];}
    kinds.forEach((cxp,i)=>{const p=nearest(cxp),bx=p[0],by=p[1];const t=rng(),mt=(a)=>a+(rng()<0.35?1:0);
      const at=(k,dx,dy,ex)=>place(k,bx+dx,by+dy,ex);
      if(mesaAt.includes(i)){at('mesa',0,-0.02,{minT:i===mesaAt[0]?3:4,scale:0.9});at('ledge',-0.5,0.03,{minT:2});at('ledge',0.5,0.02,{minT:3});at('boulders',0.05,0.1,{minT:1});}
      else if(i===archAt){at('arch',0,-0.01,{minT:4,scale:0.85});at('boulders',-0.45,0.06,{minT:2});at('boulders',0.5,0.05,{minT:3});}
      else if(t<0.34){at('butte',0,0,{minT:mt(2)});at('ledge',-0.4,0.04,{minT:2});at('ledge',0.42,0.02,{minT:mt(2)});at('boulders',0.02,0.1,{minT:1});}
      else if(t<0.66){at('spire',-0.22,0,{minT:mt(2)});at('spire',0.08,-0.01,{minT:mt(3),scale:1.15});at('spire',0.36,0.01,{minT:3,scale:0.7});at('boulders',0.06,0.09,{minT:1});at('ledge',-0.5,0.05,{minT:3});}
      else{at('ledge',-0.3,0.03,{minT:mt(1)});at('ledge',0.32,0.0,{minT:2});at('spire',0.02,-0.01,{minT:3,scale:0.6});at('boulders',-0.05,0.1,{minT:1});}});}
  /* 3. trees (the bulk). 3a: interior groves at the junction voids, corridor pairs along the wide vertical corridors */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=pickFrom(regionOf(v.y),capOk),n=1+Math.floor(rng()*2.4);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.13+rng()*0.06:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}});
  G.edges.filter(e=>!e.outer&&e.vertical).forEach(e=>{const dom=pickFrom(regionOf(e.mid[1]),capOk);[-0.18,0.18].forEach(dy=>{if(rng()<0.62)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});});
  /* 3b: the rim, walked in order as groves / sparse stretches / open stretches so it never reads as a wall */
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.3));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(e.cls==='top'?-0.02:0)+(rng()-0.2)*0.1)});});
    let mode='grove',run=0,dom='mesquite';
    samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.5?'grove':r<0.78?'sparse':'open';run=2+Math.floor(rng()*4);dom=pickFrom(regionOf(s.p[1]),capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){if(e.cls==='top'&&rng()<0.4)return;tree(p[0],p[1],null,dom,low);if(rng()<0.42)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.1,null,dom,low);}
      else if(mode==='sparse'){if(rng()<0.4)tree(p[0],p[1],null,dom,low);else place(['sage','pricklyPear','yucca','dryGrass','barrelCactus'][Math.floor(rng()*5)],p[0],p[1]);}
      else if(rng()<0.5)place(['sage','dryGrass','boulders','yucca'][Math.floor(rng()*4)],p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<0.5)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  /* 4. low growth in the diagonal corridors */
  G.edges.filter(e=>!e.outer&&!e.vertical).forEach(e=>{if(rng()<0.7)place(['sage','pricklyPear','yucca','barrelCactus','dryGrass','boulders'][Math.floor(rng()*6)],e.mid[0]+(rng()-0.5)*0.18,e.mid[1]+(rng()-0.5)*0.1);});
  /* 5. small props: lower tiers only (first six may stay through tier 2, the rest exist only at tier 2) */
  [['flags',1],['hay',2],['barrel',2],['wheel',1],['trough',1],['fence',2],['lamp',2]].forEach(([k,n])=>{for(let i=0;i<landCnt(n);i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.06);place(k,p[0],p[1],{minT:1,maxT:2,prop:true});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<5?1:2;});
  /* tiers: each object appears at its tier and stays (props leave after tier 2); trees keep >= 60% of the scenery at every tier */
  const cuts={tree:[0.28,0.52,0.78,1],shrub:[0.0,0.35,0.7,1],rock:[0.34,0.58,0.82,1],prop:[1,1,1,1],struct:[0,0,0,1]};
  placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<4&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.cat==='prop')o.tier=o.minT;});
  const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
  for(let t=1;t<=4;t++){let guard=0;while(guard++<200){const c=count(t);if(c.tr/Math.max(1,c.n)>=0.63)break;const cand=placed.filter(o=>o.tier<=t&&t<=o.maxT&&(o.cat==='shrub'||o.prop)).sort((a,b)=>b.pri-a.pri)[0];if(!cand)break;cand.tier=Math.min(5,cand.tier+1);}}
  /* front layer: only scenery that stands south of every slot it overlaps horizontally */
  placed.forEach(o=>{const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
  placed.sort((a,b)=>a.y-b.y);
  return WEST_PLAN_CACHE[shape]={G,objs:placed,P,rng};
}

/* capsule = the box of a two-hex ride on slots a,b: the slot ellipse swept along the segment between the two centres (units of R) */
function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,px=x-a.x,py=y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(px*dx/(A*A)+py*dy/(B*B))/q)),ex=(px-t*dx)/A,ey=(py-t*dy)/B;return ex*ex+ey*ey<1;}

/* ===== BAKER: bakeLandWest(shape, tier, R, {mirrorX, ground, scale, clear}) -> {back, front, frontRect, w, h, ox, oy, centers} =====
 * back  = ground + decals + every object behind/between the rides   (draw first)
 * front = only scenery south of the slots it overlaps, trimmed to its own bounds (draw after the rides, at frontRect)
 * opts.clear = [[slotA, slotB], ...]: slot-index pairs that now hold a two-hex ride; scenery inside those ride boxes is left out (re-bake takes ~3 ms).
 * opts.scale = pixel density (default min(2, devicePixelRatio)); bake at the on-screen R x density you actually draw at.
 * Local origin (ox, oy) = centre of the first hex of row 0 (shape A: middle hex of row 0). centers[] are the 12 slot centres in canvas pixels. */
const WEST_TIER_NAMES=['Light','Medium','Heavy','Immersive'];
function westGround(c,G,R,ox,oy,m,col,seed){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed);
  const outer=G.edges.filter(e=>e.outer),P=(p)=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>{TH.poly(c,poly(i),col,col,2);});
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R];
  const pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  const soft=(x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
  for(let k=0;k<40;k++){const p=pt(),w=R*(0.45+r()*0.9);soft(p[0],p[1],w,w*0.4,r()<0.5?'255,244,214':'176,138,84',r()<0.5?0.2:0.16);}
  for(let k=0;k<14;k++){const p=pt(),w=R*(0.3+r()*0.5);soft(p[0],p[1],w,w*0.4,'196,120,70',0.14);}
  for(let k=0;k<5;k++){const p=pt();for(let j=0;j<7;j++){const a=r()*6.283,l=R*(0.06+r()*0.1);TH.ln(c,[p[0],p[1]],[p[0]+Math.cos(a)*l,p[1]+Math.sin(a)*l*0.5],'rgba(120,85,50,.26)',R*0.012);}}
  for(let k=0;k<170;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.012,R*0.008,r()<0.5?'rgba(120,90,55,.32)':'rgba(255,245,220,.4)');}
  c.restore();c.restore();
}

function bakeLandWest(shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||'#e5d2a3',clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]),key=[shape,tier,R,m,ground,sc,JSON.stringify(clr),JSON.stringify(opts.clearTiles||[])].join('|');const cached=revisedLandCache.get('western|'+key);if(cached)return cached;
  const plan=getWestPlan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=0.75,top=1.25,bot=0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);return[cv,g];};
  const [back,cb]=mk();
  westGround(cb,G,R,ox,oy,m,ground,({A:11,B:22,C:33,D:44})[shape]);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]),vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho))&&!(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));
  const sprites=vis.map(o=>{const unit=u*(o.scale||1);return {x:m*o.x*R,y:o.y*R,unit,draw:(ctx,x,y)=>WEST_ASSETS[o.kind].draw(ctx,x,y,unit,o.v)};});
  const front=document.createElement('canvas'),frontRect={x:0,y:0,w:1,h:1};front.width=front.height=1;
  const centers=G.centers.map(c=>({x:ox+m*c.x*R,y:oy+c.y*R,row:c.row}));
  return revisedLandCache.set('western|'+key,{back,front,frontRect,w:W,h:H,ox,oy,centers,sc,shape,tier,mirrorX:m<0,sprites});
}
function drawLandWestBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandWestFront(ctx,x,y,land){land.sprites.slice().sort((a,b)=>a.y-b.y).forEach(s=>drawScenicSprite(ctx,s,x+s.x,y+s.y));}
/* the slot footprints a ride may occupy (keep-out ellipses), in canvas px of the baked land */
function landWestSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}


return Object.freeze({bake: bakeLandWest, drawBack: drawLandWestBack, drawFront: drawLandWestFront});
})(),
});
