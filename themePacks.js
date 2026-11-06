/* Procedural theme assets extracted from the provided theme pack sources. */

const CLASSIC_THEME_PACK = (() => {
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
/* ===== CLASSIC (COUNTY FAIR) PACK ===== */
const K={red:'#d9342b',redD:'#a82a22',cream:'#f6efe0',blue:'#2a5fa8',yel:'#f2c230',pink:'#f49ac1',teal:'#2fb5a8',wood:'#8a5a33',woodD:'#5a3b22',woodL:'#b07a46',barn:'#b3342f'};
const ksh=(c,x,y,rx,h)=>{c.fillStyle='rgba(60,40,15,.28)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
const fsign=(c,x,y,u,X0,X1,Y,Z0,Z1,text,bg,fg)=>{const I=(X,Z)=>TH.iso(x,y,u,X,Y,Z);TH.poly(c,[I(X0,Z0),I(X1,Z0),I(X1,Z1),I(X0,Z1)],bg,'#f8f2d8',u*0.07);const o=I(X0,Z1);c.save();c.transform(0.7,0.35,0,1,o[0],o[1]);c.fillStyle=fg||'#fff';c.font='bold '+((Z1-Z0)*u*0.62)+'px Arial Black, Arial, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(text,(X1-X0)*u/2,(Z1-Z0)*u/2,(X1-X0)*u*0.9);c.restore();};
const awn=(c,x,y,u,X0,X1,Yf,Yb,Zf,Zb,n,c1,c2)=>{const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);for(let i=0;i<n;i++){const a=X0+(X1-X0)*i/n,b=X0+(X1-X0)*(i+1)/n,col=i%2?c2:c1;TH.poly(c,[I(a,Yf,Zf),I(b,Yf,Zf),I(b,Yb,Zb),I(a,Yb,Zb)],col);const p=I(a,Yf,Zf),q=I(b,Yf,Zf);TH.poly(c,[p,q,[(p[0]+q[0])/2,(p[1]+q[1])/2+u*0.4]],col);}};
const stripedBox=(c,x,y,u,X0,X1,Y0,Y1,Z0,Z1,n,c1,c2)=>{const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);for(let i=0;i<n;i++){const a=X0+(X1-X0)*i/n,b=X0+(X1-X0)*(i+1)/n;TH.poly(c,[I(a,Y1,Z0),I(b,Y1,Z0),I(b,Y1,Z1),I(a,Y1,Z1)],i%2?c2:c1);}TH.poly(c,[I(X1,Y0,Z0),I(X1,Y1,Z0),I(X1,Y1,Z1),I(X1,Y0,Z1)],shade(c1,-0.3));TH.poly(c,[I(X0,Y0,Z1),I(X1,Y0,Z1),I(X1,Y1,Z1),I(X0,Y1,Z1)],shade(c2,-0.05));};
const CLASSIC_PACK={id:'classic',name:'Classic County Fair',ground:'#cbb07c',groundDark:'#b89a64',border:'#a07f48',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},
         3:{budget:11,decals:4,landmark:0.75,pool:['redBarn','grandstand','fairArch']},
         4:{budget:15,decals:5,landmark:1,pool:['bigTop','hotAirBalloon','redBarn','grandstand','fairArch'],second:0.45}},
  assets:{
  /* ---------- ground decals ---------- */
  sawdustPath:{cat:'decal',w:2.6,tier:1,weight:4,cost:0,draw(c,x,y,u,v){const r=mulberry(v+3);TH.ell(c,x,y,u*2.6,u*1.1,'#b79a63');TH.ell(c,x-u*0.2,y-u*0.05,u*2.0,u*0.8,'#c9ae78');for(let k=0;k<26;k++){const a=r()*6.283,rr=Math.sqrt(r());TH.ell(c,x+Math.cos(a)*u*2.3*rr,y+Math.sin(a)*u*0.95*rr,u*0.07,u*0.05,['#a8884c','#dcc48e','#9a7a42'][k%3]);}for(let k=0;k<3;k++){const px=x+(k-1)*u*0.9;TH.ell(c,px,y+u*0.1,u*0.13,u*0.08,'rgba(80,55,25,.3)');TH.ell(c,px+u*0.25,y-u*0.1,u*0.13,u*0.08,'rgba(80,55,25,.3)');}}},
  confetti:{cat:'decal',w:2.0,tier:1,weight:3,cost:0,draw(c,x,y,u,v){const r=mulberry(v+7);for(let k=0;k<34;k++){const a=r()*6.283,rr=Math.sqrt(r()),px=x+Math.cos(a)*u*1.9*rr,py=y+Math.sin(a)*u*0.85*rr;TH.ell(c,px,py,u*0.09,u*0.05,['#d9342b','#f2c230','#2a5fa8','#2fb5a8','#f49ac1','#f8fafc'][k%6],r()*3);}}},
  checkerBlanket:{cat:'decal',w:2.0,tier:1,weight:3,cost:0,draw(c,x,y,u,v){const I=(X,Y)=>TH.iso(x,y,u,X,Y,0);const W=1.3,D=0.95,n=6,m=4;for(let i=0;i<n;i++)for(let j=0;j<m;j++){const x0=-W+2*W*i/n,x1=-W+2*W*(i+1)/n,y0=-D+2*D*j/m,y1=-D+2*D*(j+1)/m;TH.poly(c,[I(x0,y0),I(x1,y0),I(x1,y1),I(x0,y1)],(i+j)%2?'#f6efe0':'#d9342b');}
    const p=I(0.3,0.1);TH.ell(c,p[0],p[1]-u*0.25,u*0.5,u*0.32,'#a8784a');TH.ell(c,p[0],p[1]-u*0.4,u*0.4,u*0.2,'#c99a62');TH.ln(c,[p[0]-u*0.4,p[1]-u*0.4],[p[0]+u*0.4,p[1]-u*0.4],'#7a4d2b',u*0.06);}},
  clover:{cat:'decal',w:2.0,tier:1,weight:3.5,cost:0,draw(c,x,y,u,v){const r=mulberry(v+5);TH.ell(c,x,y,u*2.0,u*0.85,'#8fb259');for(let k=0;k<30;k++){const a=r()*6.283,rr=Math.sqrt(r()),px=x+Math.cos(a)*u*1.8*rr,py=y+Math.sin(a)*u*0.75*rr;TH.ln(c,[px,py],[px+(r()-0.5)*u*0.2,py-u*(0.2+r()*0.3)],['#5f8f3a','#76a64a','#4d7a30'][k%3],u*0.06);if(k%6===0)TH.ell(c,px,py-u*0.35,u*0.08,u*0.08,'#f8fafc');}}},
  /* ---------- trees, crops, plants ---------- */
  shadeTree:{cat:'tree',w:2.0,tier:2,weight:3.5,cost:2,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*17+3),H=u*(2.7+r()*0.6),t=tm||0;ksh(c,x,y,u*2.3,u*6);for(let k=0;k<3;k++)TH.ln(c,[x,y-u*0.2],[x+(k-1)*u*0.7,y+u*0.15],'#4a3320',u*0.3);TH.ln(c,[x+u*0.1,y],[x+u*0.15,y-H],'#4a3320',u*0.8);TH.ln(c,[x-u*0.1,y],[x+u*0.05,y-H],'#7a5836',u*0.28);
    TH.ln(c,[x+u*0.1,y-H*0.7],[x-u*1.2,y-H-u*0.5],'#4a3320',u*0.34);TH.ln(c,[x+u*0.1,y-H*0.75],[x+u*1.3,y-H-u*0.4],'#4a3320',u*0.32);
    [[0,-1.9,2.3,1.9],[-1.6,-0.9,1.7,1.4],[1.6,-1.0,1.7,1.4],[0.1,-0.8,2.0,1.5],[-0.7,-2.7,1.4,1.1],[1.0,-2.5,1.3,1.0]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H+dy*u,u*rx,u*ry,['#4a9a40','#5aab4a','#6bbb55','#3f8a38'][i%4],r,9));
    if(v%2){const bx=x-u*1.0,by=y-H-u*0.3,sw=Math.sin(t*1.5)*u*0.15;TH.ln(c,[bx,by],[bx+sw,by+u*1.5],'#c9b98a',u*0.05);TH.ln(c,[bx+sw,by+u*1.5],[bx+sw,by+u*1.7],'#c9b98a',u*0.05);c.strokeStyle='#1d1d22';c.lineWidth=u*0.28;c.beginPath();c.ellipse(bx+sw,by+u*1.95,u*0.4,u*0.2,0,0,7);c.stroke();}}},
  mapleTree:{cat:'tree',w:2.0,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v){const r=mulberry(v*7+5),H=u*(2.4+r()*0.6);ksh(c,x,y,u*2.2,u*5.5);TH.ln(c,[x,y],[x+u*0.1,y-H],'#4a3320',u*0.7);TH.ln(c,[x-u*0.1,y],[x,y-H],'#7a5836',u*0.25);
    [[0,-1.7,2.2,1.8],[-1.5,-0.8,1.6,1.3],[1.5,-0.9,1.6,1.3],[0.1,-0.6,1.9,1.4],[-0.6,-2.5,1.3,1.0],[0.9,-2.4,1.2,1.0]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H+dy*u,u*rx,u*ry,['#c9432b','#e0662a','#d9892a','#b23a24'][i%4],r,9));
    for(let k=0;k<10;k++)TH.ell(c,x+(r()-0.5)*u*4.0,y+r()*u*0.5,u*0.12,u*0.07,['#c9432b','#e0662a','#d9892a'][k%3],r()*3);}},
  sunflowers:{cat:'plant',w:1.5,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*3+2),t=tm||0;ksh(c,x,y,u*1.5,u*3);[[-0.8,3.2],[0.0,4.0],[0.8,3.0],[-0.3,2.4],[0.5,3.7]].sort((a,b)=>a[1]-b[1]).forEach(([dx,h],i)=>{const bx=x+dx*u,sw=Math.sin(t*1.2+i)*u*0.05,tx=bx+sw,ty=y-h*u;TH.ln(c,[bx,y],[tx,ty],'#3f7a38',u*0.14);TH.poly(c,[[bx,y-h*u*0.4],[bx-u*0.7,y-h*u*0.5],[bx-u*0.1,y-h*u*0.3]],'#4a8a40');
      for(let k=0;k<12;k++){const a=k/12*6.283;TH.poly(c,[[tx+Math.cos(a)*u*0.25,ty+Math.sin(a)*u*0.25],[tx+Math.cos(a-0.22)*u*0.7,ty+Math.sin(a-0.22)*u*0.7],[tx+Math.cos(a)*u*0.85,ty+Math.sin(a)*u*0.85],[tx+Math.cos(a+0.22)*u*0.7,ty+Math.sin(a+0.22)*u*0.7]],k%2?'#f2c230':'#f8d24a');}TH.ell(c,tx,ty,u*0.34,u*0.34,'#5a3b22');TH.ell(c,tx,ty,u*0.2,u*0.2,'#3a2614');});}},
  cornStalks:{cat:'plant',w:2.0,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v,tm){const t=tm||0;TH.ell(c,x,y,u*2.0,u*0.9,'#7a5a38');const st=[];for(let i=-4;i<=4;i++)for(let j=-3;j<=3;j++){const px=x+(i+(Math.abs(j)%2)*0.5)*u*0.38,py=y+j*u*0.24;if(((px-x)/(u*1.9))**2+((py-y)/(u*0.8))**2<1)st.push([px,py]);}
    st.sort((a,b)=>a[1]-b[1]).forEach(([px,py],k)=>{const sw=Math.sin(t*1.4+px*0.05)*u*0.07,h=u*(2.2+(k%3)*0.2);TH.ln(c,[px,py],[px+sw,py-h],'#6aa03a',u*0.1);TH.poly(c,[[px,py-h*0.45],[px-u*0.8+sw,py-h*0.55],[px,py-h*0.38]],'#5a9030');TH.poly(c,[[px,py-h*0.6],[px+u*0.8+sw,py-h*0.7],[px,py-h*0.52]],'#6aa03a');if(k%2)TH.ell(c,px+u*0.12,py-h*0.5,u*0.1,u*0.3,'#e6c64a',0.2);TH.poly(c,[[px+sw-u*0.12,py-h],[px+sw,py-h-u*0.3],[px+sw+u*0.12,py-h]],'#b89a45');});}},
  pumpkinPatch:{cat:'plant',w:1.7,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*5+4);ksh(c,x,y,u*1.7,u);for(let k=0;k<4;k++){c.strokeStyle='#4a7a30';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x+(k-1.5)*u*0.2,y);c.quadraticCurveTo(x+(r()-0.5)*u*2.2,y-u*0.3,x+(r()-0.5)*u*2.6,y+(r()-0.5)*u*0.6);c.stroke();TH.poly(c,[[x+(k-1.5)*u*0.5,y-u*0.1],[x+(k-1.5)*u*0.5+u*0.5,y-u*0.4],[x+(k-1.5)*u*0.5+u*0.2,y]],'#5a9030');}
    [[-0.9,0.1,0.8,'#e87a1c'],[0.8,0.15,0.9,'#f08a22'],[0.0,-0.3,0.7,'#e06a14'],[-0.3,0.5,0.55,'#f2f0e6'],[1.5,-0.1,0.5,'#e87a1c']].sort((a,b)=>a[1]-b[1]).forEach(([dx,dy,s,col])=>{const px=x+dx*u,py=y+dy*u-u*0.5*s;TH.ell(c,px,py,u*s,u*0.78*s,col);for(let k=-2;k<=2;k++){c.strokeStyle='rgba(120,50,0,.35)';c.lineWidth=u*0.05;c.beginPath();c.ellipse(px+k*u*0.2*s,py,Math.abs(k)*u*0.08*s+u*0.04,u*0.74*s,0,0,7);c.stroke();}TH.ln(c,[px,py-u*0.7*s],[px+u*0.1,py-u*0.95*s],'#4a7a30',u*0.14*s);TH.ell(c,px-u*0.25*s,py-u*0.25*s,u*0.28*s,u*0.18*s,'rgba(255,255,255,.22)');});}},
  /* ---------- fair props ---------- */
  ticketBooth:{cat:'prop',w:1.8,tier:3,weight:3,cost:2,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0;ksh(c,x,y,u*2,u*4);stripedBox(c,x,y,u,-1.2,1.2,-1.0,1.0,0,2.3,6,K.red,K.cream);
    TH.poly(c,[I(-0.7,1.01,0.9),I(0.7,1.01,0.9),I(0.7,1.01,1.9),I(-0.7,1.01,1.9)],'#1f1812','#f6efe0',u*0.07);TH.poly(c,[I(-0.6,1.02,1.0),I(0.6,1.02,1.0),I(0.6,1.02,1.8),I(-0.6,1.02,1.8)],'#ffd98a');TH.box(c,x,y,u,-0.9,0.9,1.0,1.5,0.85,1.0,'#a97d49','#7d5a34','#c49858');
    const ap=I(0,0,3.9);TH.poly(c,[I(-1.5,1.3,2.3),I(1.5,1.3,2.3),ap],K.red);TH.poly(c,[I(1.5,-1.3,2.3),I(1.5,1.3,2.3),ap],K.redD);for(let i=0;i<3;i++){const a=-1.5+i,b=a+1;TH.poly(c,[I(a,1.3,2.3),I(b,1.3,2.3),I((a+b)/2,1.3,2.3-0.0),],i%2?K.cream:K.red);}
    fsign(c,x,y,u,-1.0,1.0,1.31,2.4,3.0,'TICKETS',K.blue,'#f6efe0');TH.ln(c,ap,[ap[0],ap[1]-u*1.0],'#d5dae6',u*0.08);TH.poly(c,[[ap[0],ap[1]-u*1.0],[ap[0]+u*1.0,ap[1]-u*0.8+Math.sin(t*3)*u*0.1],[ap[0],ap[1]-u*0.5]],K.yel);}},
  ringToss:{cat:'prop',w:2.2,tier:3,weight:3,cost:2,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+3);ksh(c,x,y,u*2.4,u*3.5);
    TH.box(c,x,y,u,-2.0,2.0,-1.1,-0.7,0,3.0,'#b8884f','#8a6238','#d6a86a');for(let k=1;k<5;k++)TH.ln(c,I(-2.0+k*0.8,-0.69,0),I(-2.0+k*0.8,-0.69,3.0),'rgba(60,35,10,.3)',u*0.05);
    [[-1.6,1.0],[-0.5,2.0],[0.6,1.0],[1.5,2.0]].forEach(([X,Z],i)=>{const p=I(X,-0.6,Z);TH.ell(c,p[0],p[1]-u*0.3,u*0.38,u*0.32,['#f49ac1','#9bd0e8','#f2c230','#b3e08a'][i]);TH.ell(c,p[0],p[1]-u*0.65,u*0.24,u*0.22,['#f49ac1','#9bd0e8','#f2c230','#b3e08a'][i]);TH.ell(c,p[0]-u*0.08,p[1]-u*0.68,u*0.04,u*0.04,'#222');TH.ell(c,p[0]+u*0.08,p[1]-u*0.68,u*0.04,u*0.04,'#222');});
    TH.box(c,x,y,u,-2.0,2.0,-0.6,0.5,0.9,1.0,'#a97d49','#7d5a34','#c49858');[-1.4,-0.5,0.5,1.4].forEach((X,i)=>{TH.ln(c,I(X,0.0,1.0),I(X,0.0,1.8),'#d5dae6',u*0.15);TH.ell(c,...I(X,0.0,1.85),u*0.2,u*0.12,'#d5dae6');});
    [[-1.0,0.3],[0.2,0.1],[1.0,0.35]].forEach(([X,Y],i)=>{const p=I(X,Y,1.05);c.strokeStyle=['#d9342b','#2a5fa8','#f2c230'][i];c.lineWidth=u*0.1;c.beginPath();c.ellipse(p[0],p[1],u*0.3,u*0.14,0,0,7);c.stroke();});
    TH.box(c,x,y,u,-2.0,2.0,0.5,1.0,0,0.95,'#b8884f','#8a6238','#d6a86a');[[-2.0,1.0],[2.0,1.0],[-2.0,-0.7],[2.0,-0.7]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(X,Y,3.3),K.woodD,u*0.2));
    awn(c,x,y,u,-2.2,2.2,1.5,-0.9,2.5,3.4,8,K.blue,K.cream);fsign(c,x,y,u,-1.5,1.5,1.52,2.55,3.1,'RING TOSS',K.red,'#f8f2d8');}},
  balloonDarts:{cat:'prop',w:2.2,tier:3,weight:3,cost:2,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+5),t=tm||0;ksh(c,x,y,u*2.4,u*3.5);TH.box(c,x,y,u,-2.0,2.0,-1.1,-0.7,0,3.0,'#c9b98a','#a8986a','#e0d3aa');
    for(let row=0;row<4;row++)for(let col=0;col<8;col++){const X=-1.8+col*0.52+(row%2)*0.26,Z=0.4+row*0.6;const p=I(X,-0.6,Z);if(r()<0.12)continue;const sw=Math.sin(t*2+col+row)*u*0.03;TH.ell(c,p[0]+sw,p[1]-u*0.2,u*0.26,u*0.3,['#d9342b','#f2c230','#2a5fa8','#2fb5a8','#f49ac1','#f08a22'][(col+row*3)%6]);TH.ell(c,p[0]+sw-u*0.08,p[1]-u*0.3,u*0.06,u*0.08,'rgba(255,255,255,.55)');}
    TH.box(c,x,y,u,-2.0,2.0,-0.1,1.0,0,0.95,'#b8884f','#8a6238','#d6a86a');[-1.2,0,1.2].forEach(X=>{const p=I(X,0.4,0.95);TH.ln(c,[p[0],p[1]],[p[0]+u*0.5,p[1]-u*0.18],'#d9342b',u*0.07);TH.poly(c,[[p[0]-u*0.12,p[1]+u*0.02],[p[0]-u*0.12,p[1]-u*0.14],[p[0]+u*0.05,p[1]-u*0.06]],'#f2c230');});
    [[-2.0,1.0],[2.0,1.0],[-2.0,-0.7],[2.0,-0.7]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(X,Y,3.3),K.woodD,u*0.2));awn(c,x,y,u,-2.2,2.2,1.5,-0.9,2.5,3.4,8,K.red,K.cream);fsign(c,x,y,u,-1.6,1.6,1.52,2.55,3.1,'DARTS',K.blue,'#f8f2d8');}},
  popcornCart:{cat:'prop',w:1.7,tier:1,weight:3,cost:1,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+2);ksh(c,x,y,u*1.8,u*3.5);
    [[-0.6,-0.9],[-0.6,0.9]].forEach(([X,Y])=>{const p=I(X,Y,0.6);TH.ell(c,p[0],p[1],u*0.55,u*0.6,'#222');TH.ell(c,p[0],p[1],u*0.42,u*0.46,'#e6eaf0');TH.ell(c,p[0],p[1],u*0.1,u*0.1,'#555');});
    TH.box(c,x,y,u,-1.2,1.2,-0.8,0.8,0.6,1.8,K.red,K.redD,'#e8584c');stripedBox(c,x,y,u,-1.2,1.2,-0.8,0.8,1.8,1.81,6,K.red,K.cream);TH.box(c,x,y,u,-1.1,1.1,-0.7,0.7,1.8,3.0,'rgba(190,225,240,.55)','rgba(130,170,190,.5)','rgba(230,245,250,.6)');
    for(let k=0;k<26;k++){const p=I(-0.9+r()*1.8,-0.5+r()*1.0,1.9+r()*0.9);TH.ell(c,p[0],p[1],u*0.13,u*0.1,['#fff7d6','#f6e7a6','#fffbe8'][k%3]);}
    TH.ln(c,I(-1.3,0.7,1.2),I(-2.2,0.9,1.0),K.woodD,u*0.12);[[-1.1,-0.7],[1.1,-0.7],[1.1,0.7],[-1.1,0.7]].forEach(([X,Y])=>TH.ln(c,I(X,Y,3.0),I(X,Y,3.6),'#d5dae6',u*0.06));
    const ap=I(0,0,4.6);for(let i=0;i<6;i++){const a=i/6*Math.PI*2,b=(i+1)/6*Math.PI*2;TH.poly(c,[ap,[ap[0]+Math.cos(a)*u*1.7,ap[1]+u*1.3+Math.sin(a)*u*0.8],[ap[0]+Math.cos(b)*u*1.7,ap[1]+u*1.3+Math.sin(b)*u*0.8]],i%2?K.cream:K.red);}
    fsign(c,x,y,u,-0.9,0.9,0.81,0.7,1.5,'POPCORN',K.yel,'#a82a22');}},
  cottonCandyCart:{cat:'prop',w:1.6,tier:2,weight:3,cost:1,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+4),t=tm||0;ksh(c,x,y,u*1.7,u*3.5);
    [[-0.6,-0.8],[-0.6,0.8]].forEach(([X,Y])=>{const p=I(X,Y,0.55);TH.ell(c,p[0],p[1],u*0.5,u*0.55,'#222');TH.ell(c,p[0],p[1],u*0.38,u*0.42,'#f6efe0');});
    TH.box(c,x,y,u,-1.1,1.1,-0.7,0.7,0.55,1.7,K.pink,'#d77aa6','#f9b4d2');stripedBox(c,x,y,u,-1.1,1.1,-0.7,0.7,1.7,1.71,6,K.pink,K.cream);
    const bp=I(0,0,1.8);TH.ell(c,bp[0],bp[1],u*1.0,u*0.5,'#e6eaf0');for(let k=0;k<12;k++){const a=k/12*6.283;TH.blob(c,bp[0]+Math.cos(a)*u*0.45,bp[1]-u*0.5+Math.sin(a)*u*0.2,u*0.5,u*0.5,['#f9a8d4','#f49ac1','#fbc4e0'][k%3],r,7);}TH.blob(c,bp[0],bp[1]-u*0.9,u*0.85,u*0.7,'#f9a8d4',r,9);TH.ell(c,bp[0]-u*0.2,bp[1]-u*1.1,u*0.3,u*0.2,'rgba(255,255,255,.4)');
    TH.ln(c,[bp[0]+u*1.0,bp[1]-u*0.2],[bp[0]+u*1.0,bp[1]-u*1.6],'#d5dae6',u*0.08);const ap=[bp[0],bp[1]-u*2.6];for(let i=0;i<6;i++){const a=i/6*6.283,b=(i+1)/6*6.283;TH.poly(c,[ap,[ap[0]+Math.cos(a)*u*1.7,ap[1]+u*1.3+Math.sin(a)*u*0.8],[ap[0]+Math.cos(b)*u*1.7,ap[1]+u*1.3+Math.sin(b)*u*0.8]],i%2?K.cream:K.pink);}TH.ln(c,ap,[ap[0],ap[1]+u*2.2],'#d5dae6',u*0.1);
    fsign(c,x,y,u,-0.9,0.9,0.71,0.7,1.5,'FLOSS',K.blue,'#f6efe0');}},
  picnicTable:{cat:'prop',w:2.0,tier:1,weight:3.5,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);ksh(c,x,y,u*2.1,u*1.8);[-1.5,1.5].forEach(X=>{TH.ln(c,I(X,-0.7,0),I(X,-0.2,1.15),K.woodD,u*0.14);TH.ln(c,I(X,0.7,0),I(X,0.2,1.15),K.woodD,u*0.14);});
    [-1.2,1.2].forEach(Y=>TH.box(c,x,y,u,-1.8,1.8,Y>0?Y:Y-0.5,Y>0?Y+0.5:Y,0.5,0.65,'#b8884f','#8a6238','#d6a86a'));
    TH.box(c,x,y,u,-1.9,1.9,-0.55,0.55,1.15,1.3,'#b8884f','#8a6238','#d6a86a');const W=1.9,D=0.55,n=8,m=3;for(let i=0;i<n;i++)for(let j=0;j<m;j++){const x0=-W+2*W*i/n,x1=-W+2*W*(i+1)/n,y0=-D+2*D*j/m,y1=-D+2*D*(j+1)/m;TH.poly(c,[I(x0,y0,1.31),I(x1,y0,1.31),I(x1,y1,1.31),I(x0,y1,1.31)],(i+j)%2?'#f6efe0':'#d9342b');}
    const p=I(-0.5,0,1.4);TH.ell(c,p[0],p[1]-u*0.3,u*0.4,u*0.3,'#a8784a');TH.ln(c,[p[0]-u*0.35,p[1]-u*0.45],[p[0]+u*0.35,p[1]-u*0.45],'#7a4d2b',u*0.06);const q=I(0.9,0.1,1.4);TH.ell(c,q[0],q[1]-u*0.25,u*0.22,u*0.3,'#e8c24a');TH.ell(c,q[0],q[1]-u*0.55,u*0.22,u*0.08,'#f6efe0');}},
  balloonBunch:{cat:'prop',w:1.2,tier:1,weight:3.5,cost:1,max:2,draw(c,x,y,u,v,tm){const t=tm||0,r=mulberry(v+3);ksh(c,x,y,u*0.9,u*5);TH.ell(c,x,y,u*0.4,u*0.16,'#6b6f78');const anch=[x,y-u*0.1];
    const cols=['#d9342b','#f2c230','#2a5fa8','#2fb5a8','#f49ac1','#f08a22','#f8fafc'];for(let k=0;k<7;k++){const sw=Math.sin(t*1.3+k*0.9+v)*u*0.18,bx=x+(k-3)*u*0.42+sw,by=y-u*(4.2+(k%3)*0.7)+Math.sin(t*1.7+k)*u*0.08;TH.ln(c,anch,[bx,by+u*0.5],'rgba(230,230,235,.8)',u*0.03);
      TH.ell(c,bx,by,u*0.5,u*0.62,cols[k]);TH.ell(c,bx-u*0.16,by-u*0.2,u*0.12,u*0.2,'rgba(255,255,255,.55)');TH.poly(c,[[bx-u*0.07,by+u*0.6],[bx+u*0.07,by+u*0.6],[bx,by+u*0.7]],shade(cols[k],-0.2));}}},
  buntingLine:{cat:'prop',w:2.6,tier:2,weight:3,cost:1,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0;ksh(c,x,y,u*2.7,u*3);[-2.4,2.4].forEach(X=>{TH.ln(c,I(X,0,0),I(X,0,4.0),K.woodD,u*0.22);TH.ell(c,...I(X,0,4.1),u*0.16,u*0.16,K.yel);});
    const cols=['#d9342b','#f2c230','#2a5fa8','#f6efe0','#2fb5a8'];let prev=null;for(let k=0;k<=12;k++){const X=-2.4+4.8*k/12,sag=Math.sin(k/12*Math.PI)*0.9,p=I(X,0,3.9-sag);if(prev)TH.ln(c,prev,p,'#d9d4c2',u*0.05);prev=p;if(k<12){const q=I(X+0.2,0,3.9-Math.sin((k+0.5)/12*Math.PI)*0.9),fl=Math.sin(t*3+k)*u*0.06;TH.poly(c,[[q[0]-u*0.2,q[1]],[q[0]+u*0.2,q[1]],[q[0]+fl,q[1]+u*0.6]],cols[k%5],'rgba(0,0,0,.2)',u*0.03);}}}},
  prizeWheel:{cat:'prop',w:1.7,tier:3,weight:2.5,cost:1,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0;ksh(c,x,y,u*1.8,u*4.5);TH.box(c,x,y,u,-1.0,1.0,-0.6,0.6,0,0.5,'#a97d49','#7d5a34','#c49858');[-0.8,0.8].forEach(X=>TH.ln(c,I(X,0,0.5),I(X*0.3,0,2.7),K.woodD,u*0.22));const cc=[0,0,3.3],R0=1.7,a0=t*(v%2?1.2:-0.9)+v;
    const P=(a,r)=>I(cc[0]+r*Math.cos(a),cc[1],cc[2]+r*Math.sin(a));TH.poly(c,Array.from({length:25},(_,k)=>P(k/24*6.283,R0+0.18)),'#f2c230','#a82a22',u*0.08);const cols=['#d9342b','#f6efe0','#2a5fa8','#f2c230','#2fb5a8','#f49ac1','#d9342b','#f6efe0'];
    for(let k=0;k<8;k++){const a=a0+k*0.7854;TH.poly(c,[P(a,0),P(a,R0),P(a+0.2,R0),P(a+0.4,R0),P(a+0.7854,R0),P(a+0.7854,0)],cols[k]);TH.ln(c,P(a,0.2),P(a,R0),'rgba(60,30,10,.5)',u*0.05);}
    for(let k=0;k<16;k++){const a=a0+k*0.3927,p=P(a,R0+0.18);TH.ell(c,p[0],p[1],u*0.07,u*0.07,k%2?'#fff3b0':'#d9342b');}TH.ell(c,...P(0,0),u*0.25,u*0.25,'#a82a22');TH.ell(c,...P(0,0),u*0.1,u*0.1,'#f2c230');
    const pt=P(1.5708,R0+0.3),pb=P(1.5708,R0-0.2);TH.poly(c,[[pt[0]-u*0.12,pt[1]-u*0.5],[pt[0]+u*0.12,pt[1]-u*0.5],[pb[0],pb[1]-u*0.65]],'#222');}},
  highStriker:{cat:'prop',w:1.3,tier:3,weight:2.5,cost:1,max:1,draw(c,x,y,u,v,tm){const t=tm||0;ksh(c,x,y,u*1.4,u*7);TH.ell(c,x,y,u*1.0,u*0.45,'#a97d49');c.fillStyle='#8a5a33';c.fillRect(x-u*0.6,y-u*0.6,u*1.2,u*0.6);TH.ell(c,x,y-u*0.6,u*0.6,u*0.3,'#c49858');
    [-0.4,0.4].forEach(dx=>TH.ln(c,[x+dx*u,y-u*0.5],[x+dx*u,y-u*7.2],'#8a5a33',u*0.2));TH.ln(c,[x,y-u*0.5],[x,y-u*7.0],'#f6efe0',u*0.28);for(let k=0;k<7;k++){const yy=y-u*(1.0+k*0.9);TH.ln(c,[x-u*0.25,yy],[x+u*0.25,yy],k%2?K.red:'#222',u*0.1);}
    const cyc=(t*0.6+v*0.2)%2,hz=cyc<1?cyc:2-cyc,py=y-u*(0.9+hz*5.6);TH.ell(c,x,py,u*0.34,u*0.2,K.red);TH.ell(c,x,py-u*0.05,u*0.22,u*0.12,'#f2c230');
    const by=y-u*7.4;TH.ell(c,x,by,u*0.6,u*0.62,'#e0b53a');TH.ell(c,x-u*0.15,by-u*0.15,u*0.2,u*0.25,'rgba(255,255,255,.4)');TH.ell(c,x,by+u*0.4,u*0.14,u*0.14,'#a8801a');if(hz>0.95){TH.ln(c,[x+u*0.7,by-u*0.3],[x+u*1.1,by-u*0.6],'#e0b53a',u*0.06);TH.ln(c,[x-u*0.7,by-u*0.3],[x-u*1.1,by-u*0.6],'#e0b53a',u*0.06);}
    TH.ln(c,[x-u*1.0,y-u*0.2],[x-u*1.9,y-u*1.6],'#6b4a2b',u*0.2);TH.ell(c,x-u*1.95,y-u*1.7,u*0.4,u*0.3,'#7a5a3a');TH.poly(c,[[x-u*0.9,y-u*7.9],[x,y-u*8.5],[x+u*0.9,y-u*7.9]],K.red);}},
  livestockPen:{cat:'prop',w:2.8,tier:2,weight:3,cost:2,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0;ksh(c,x,y,u*3,u*2);TH.poly(c,[I(-2.8,-1.9,0.03),I(2.8,-1.9,0.03),I(2.8,1.9,0.03),I(-2.8,1.9,0.03)],'#c9a96a');for(let k=0;k<30;k++){const r=mulberry(v+k);TH.ln(c,I(-2.6+r()*5.2,-1.7+r()*3.4,0.04),I(-2.4+r()*5.2,-1.6+r()*3.4,0.05),['#e0c26a','#b89a45'][k%2],u*0.05);}
    [[-2.8,-1.9],[2.8,-1.9],[-2.8,1.9],[2.8,1.9],[0,-1.9],[-2.8,0]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(X,Y,1.5),K.woodD,u*0.2));[0.5,1.1].forEach(Z=>{TH.ln(c,I(-2.8,-1.9,Z),I(2.8,-1.9,Z),K.wood,u*0.14);TH.ln(c,I(-2.8,-1.9,Z),I(-2.8,1.9,Z),K.wood,u*0.14);});
    const cow=(X,Y,s)=>{const p=I(X,Y,0),bx=p[0],by=p[1],sc=u*s,sw=Math.sin(t*1.5+X)*sc*0.05;[[-0.7,0.1],[0.5,0.1],[-0.5,-0.2],[0.7,-0.2]].forEach(([dx,dy])=>{TH.ln(c,[bx+dx*sc,by-sc*1.0],[bx+dx*sc,by+dy*sc],'#f6efe0',sc*0.2);TH.ell(c,bx+dx*sc,by+dy*sc,sc*0.15,sc*0.07,'#222');});
      TH.ell(c,bx,by-sc*1.4,sc*1.35,sc*0.7,'#f6efe0');TH.ell(c,bx-sc*0.3,by-sc*1.55,sc*0.45,sc*0.3,'#222');TH.ell(c,bx+sc*0.5,by-sc*1.25,sc*0.35,sc*0.25,'#222');TH.ell(c,bx-sc*0.2,by-sc*1.0,sc*0.5,sc*0.18,'#f4b8b0');
      TH.ell(c,bx+sc*1.5,by-sc*1.6+sw,sc*0.42,sc*0.38,'#f6efe0');TH.ell(c,bx+sc*1.85,by-sc*1.5+sw,sc*0.25,sc*0.2,'#f4b8b0');TH.ell(c,bx+sc*1.4,by-sc*1.7+sw,sc*0.13,sc*0.15,'#222');TH.ln(c,[bx+sc*1.35,by-sc*1.95+sw],[bx+sc*1.2,by-sc*2.25+sw],'#e8e0cc',sc*0.08);TH.ln(c,[bx+sc*1.62,by-sc*1.95+sw],[bx+sc*1.8,by-sc*2.2+sw],'#e8e0cc',sc*0.08);TH.ln(c,[bx-sc*1.3,by-sc*1.6],[bx-sc*1.5,by-sc*0.8],'#f6efe0',sc*0.07);};
    cow(-0.8,0.4,0.9);const pig=(X,Y,s)=>{const p=I(X,Y,0),sc=u*s;TH.ell(c,p[0],p[1]-sc*0.6,sc*0.9,sc*0.5,'#f4a6a0');[-0.4,0.4].forEach(dx=>TH.ln(c,[p[0]+dx*sc,p[1]-sc*0.3],[p[0]+dx*sc,p[1]],'#e8948e',sc*0.16));TH.ell(c,p[0]+sc*1.0,p[1]-sc*0.7,sc*0.35,sc*0.3,'#f4a6a0');TH.ell(c,p[0]+sc*1.3,p[1]-sc*0.62,sc*0.17,sc*0.13,'#e8948e');TH.poly(c,[[p[0]+sc*0.85,p[1]-sc*0.95],[p[0]+sc*0.95,p[1]-sc*1.25],[p[0]+sc*1.15,p[1]-sc*0.9]],'#e8948e');TH.ell(c,p[0]+sc*1.08,p[1]-sc*0.78,sc*0.04,sc*0.04,'#222');};pig(1.3,-0.5,0.8);
    TH.box(c,x,y,u,-0.2,1.4,1.3,1.8,0,0.5,'#8a5a33','#6f4524','#a97d49');TH.ell(c,...I(0.6,1.55,0.5),u*0.7,u*0.22,'#3f6aa0');}},
  tractor:{cat:'prop',w:2.2,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0;ksh(c,x,y,u*2.4,u*3);const wheel=(X,Y,R0,col)=>{const p=I(X,Y,R0);TH.ell(c,p[0],p[1],u*R0*0.95,u*R0*1.05,'#1c1c20');TH.ell(c,p[0],p[1],u*R0*0.7,u*R0*0.78,col);for(let k=0;k<10;k++){const a=k/10*6.283;TH.ln(c,[p[0]+Math.cos(a)*u*R0*0.8,p[1]+Math.sin(a)*u*R0*0.88],[p[0]+Math.cos(a)*u*R0*0.98,p[1]+Math.sin(a)*u*R0*1.06],'#1c1c20',u*0.14);}TH.ell(c,p[0],p[1],u*R0*0.18,u*R0*0.2,'#b9bcc4');};
    wheel(-0.8,-1.15,1.2,'#d9a02a');TH.box(c,x,y,u,0.2,2.4,-0.6,0.6,0.9,2.0,'#c9342b','#9a2820','#e0584c');[[1.6,0.61]].forEach(()=>{for(let k=0;k<4;k++)TH.ln(c,I(1.8+k*0.15,0.61,1.0),I(1.8+k*0.15,0.61,1.9),'rgba(0,0,0,.3)',u*0.05);});TH.ln(c,I(2.1,0,2.0),I(2.1,0,3.3),'#222',u*0.2);const sp=I(2.1,0,3.35);for(let k=0;k<3;k++){const ph=(t*0.8+k*0.33)%1;c.fillStyle='rgba(70,70,76,'+(0.5*(1-ph))+')';c.beginPath();c.ellipse(sp[0]+ph*u*0.4,sp[1]-ph*u*2.0,u*(0.2+ph*0.4),u*(0.17+ph*0.3),0,0,7);c.fill();}
    TH.box(c,x,y,u,-1.4,0.4,-0.8,0.8,0.9,1.4,'#c9342b','#9a2820','#e0584c');TH.box(c,x,y,u,-1.2,-0.1,-0.5,0.5,1.4,2.5,'#a82a22','#7a1f19','#c9342b');TH.poly(c,[I(-1.1,0.51,1.5),I(-0.2,0.51,1.5),I(-0.2,0.51,2.3),I(-1.1,0.51,2.3)],'#bfe3f2');
    const sw=I(0.5,0,2.2);TH.ln(c,sw,[sw[0],sw[1]-u*0.5],'#222',u*0.1);TH.ell(c,sw[0],sw[1]-u*0.55,u*0.35,u*0.14,'#222');TH.ell(c,x+u*1.0,y+u*0.5,u*0.1,u*0.1,'#fff3b0');wheel(-0.8,1.15,1.2,'#d9a02a');wheel(2.0,1.0,0.6,'#d9a02a');}},
  scarecrow:{cat:'prop',w:1.3,tier:2,weight:3,cost:1,max:1,draw(c,x,y,u,v,tm){const t=tm||0,r=mulberry(v+3);ksh(c,x,y,u*1.3,u*5);TH.ln(c,[x,y],[x,y-u*4.0],'#6b4a2b',u*0.24);TH.ln(c,[x-u*1.5,y-u*2.9],[x+u*1.5,y-u*2.9],'#6b4a2b',u*0.2);
    TH.poly(c,[[x-u*0.55,y-u*3.1],[x+u*0.55,y-u*3.1],[x+u*0.5,y-u*1.7],[x-u*0.5,y-u*1.7]],'#c9342b');for(let k=0;k<4;k++){TH.ln(c,[x-u*0.5+k*u*0.33,y-u*3.1],[x-u*0.5+k*u*0.33,y-u*1.7],'rgba(40,20,10,.35)',u*0.05);TH.ln(c,[x-u*0.55,y-u*2.9+k*u*0.35],[x+u*0.55,y-u*2.9+k*u*0.35],'rgba(40,20,10,.3)',u*0.05);}
    [[-1.6,0],[1.6,0]].forEach(([dx])=>{for(let k=0;k<5;k++)TH.ln(c,[x+dx*u,y-u*2.9],[x+dx*u+(r()-0.5)*u*0.5,y-u*(2.5+r()*0.4)],'#e0c26a',u*0.07);});
    TH.poly(c,[[x-u*0.45,y-u*1.7],[x-u*0.1,y-u*1.7],[x-u*0.15,y-u*0.4],[x-u*0.5,y-u*0.4]],'#3b5a8a');TH.poly(c,[[x+u*0.1,y-u*1.7],[x+u*0.45,y-u*1.7],[x+u*0.5,y-u*0.4],[x+u*0.15,y-u*0.4]],'#33527f');for(let k=0;k<4;k++)TH.ln(c,[x-u*0.3+(k%2)*u*0.6,y-u*0.4],[x-u*0.3+(k%2)*u*0.6+u*0.1,y-u*0.1],'#e0c26a',u*0.06);
    TH.ell(c,x,y-u*3.75,u*0.5,u*0.5,'#e8d8b0');TH.ell(c,x-u*0.15,y-u*3.8,u*0.05,u*0.05,'#222');TH.ell(c,x+u*0.15,y-u*3.8,u*0.05,u*0.05,'#222');TH.ln(c,[x-u*0.15,y-u*3.55],[x+u*0.15,y-u*3.55],'#222',u*0.05);
    TH.ell(c,x,y-u*4.1,u*0.95,u*0.28,'#c9a24a');TH.poly(c,[[x-u*0.45,y-u*4.1],[x-u*0.3,y-u*4.8],[x+u*0.3,y-u*4.8],[x+u*0.45,y-u*4.1]],'#d6b055');TH.ln(c,[x-u*0.42,y-u*4.25],[x+u*0.42,y-u*4.25],'#8a2b24',u*0.1);
    const cx=x+u*1.3,cy=y-u*3.1,hb=Math.sin(t*3+v)*u*0.03;TH.ell(c,cx,cy-u*0.2,u*0.3,u*0.2,'#14121c');TH.ell(c,cx+u*0.22,cy-u*0.4+hb,u*0.13,u*0.12,'#14121c');TH.poly(c,[[cx+u*0.32,cy-u*0.42+hb],[cx+u*0.52,cy-u*0.38+hb],[cx+u*0.32,cy-u*0.34+hb]],'#e4a24a');}},
  hayBales:{cat:'prop',w:1.7,tier:1,weight:3.5,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);ksh(c,x,y,u*1.8,u*2.5);const bale=(X,Y,Z)=>{TH.box(c,x,y,u,X-0.9,X+0.9,Y-0.6,Y+0.6,Z,Z+0.9,'#e0c26a','#b89a45','#f0d77a');[-0.4,0.4].forEach(dx=>{TH.ln(c,I(X+dx,Y+0.61,Z),I(X+dx,Y+0.61,Z+0.9),'#8a7030',u*0.06);TH.ln(c,I(X+dx,Y-0.6,Z+0.91),I(X+dx,Y+0.6,Z+0.91),'#8a7030',u*0.06);});for(let k=1;k<4;k++)TH.ln(c,I(X-0.8+k*0.4,Y+0.62,Z+0.1),I(X-0.7+k*0.4,Y+0.62,Z+0.8),'rgba(130,100,30,.35)',u*0.04);};
    bale(-0.9,0.5,0);bale(0.9,0.5,0);bale(0,-0.3,0.9);if(v%2)bale(-0.1,1.9,0);}},
  /* ---------- landmarks ---------- */
  redBarn:{cat:'landmark',w:3.6,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);ksh(c,x,y,u*3.8,u*7);
    const sp=TH.iso(x,y,u,-3.7,-1.6,0);const sr=u*1.35,sh=u*5.4;TH.ell(c,sp[0],sp[1],sr*0.99,sr*0.5,'#8a8f98');c.fillStyle='#b9bec8';c.fillRect(sp[0]-sr*0.99,sp[1]-sh,sr*1.98,sh);const g=c.createLinearGradient(sp[0]-sr,0,sp[0]+sr,0);g.addColorStop(0,'rgba(255,255,255,.4)');g.addColorStop(1,'rgba(30,40,60,.45)');c.fillStyle=g;c.fillRect(sp[0]-sr*0.99,sp[1]-sh,sr*1.98,sh);for(let k=1;k<7;k++){c.strokeStyle='rgba(60,70,90,.3)';c.lineWidth=u*0.05;c.beginPath();c.ellipse(sp[0],sp[1]-sh*k/7,sr*0.99,sr*0.5,0,0,Math.PI);c.stroke();}
    TH.ell(c,sp[0],sp[1]-sh,sr*0.99,sr*0.5,'#d5d9e0');c.beginPath();c.ellipse(sp[0],sp[1]-sh,sr*0.99,sr*1.0,0,Math.PI,2*Math.PI,false);c.closePath();const dg=c.createLinearGradient(sp[0]-sr,0,sp[0]+sr,0);dg.addColorStop(0,'#eef1f6');dg.addColorStop(1,'#8e97a8');c.fillStyle=dg;c.fill();
    TH.box(c,x,y,u,-3.0,3.0,-2.2,2.2,0,3.2,K.barn,'#8a2620','#d44a3f');for(let k=1;k<12;k++)TH.ln(c,I(-3.0+k*0.5,2.21,0),I(-3.0+k*0.5,2.21,3.2),'rgba(60,15,10,.28)',u*0.05);for(let k=1;k<9;k++)TH.ln(c,I(3.01,-2.2+k*0.5,0),I(3.01,-2.2+k*0.5,3.2),'rgba(40,10,8,.3)',u*0.05);
    const prof=[[2.7,3.0],[1.6,4.6],[0,5.6],[-1.6,4.6],[-2.7,3.0]];TH.poly(c,prof.map(p=>I(3.0,p[0],p[1])),'#a52d26');
    const sl=(Y0,Z0,Y1,Z1,col)=>TH.poly(c,[I(-3.4,Y0,Z0),I(3.4,Y0,Z0),I(3.4,Y1,Z1),I(-3.4,Y1,Z1)],col);sl(2.9,2.95,1.6,4.7,'#6e6a70');sl(1.6,4.7,0,5.75,'#5c5860');for(let k=1;k<6;k++){TH.ln(c,I(-3.4,2.9-k*0.22,2.95+k*0.29),I(3.4,2.9-k*0.22,2.95+k*0.29),'rgba(20,20,26,.35)',u*0.05);}TH.ln(c,I(-3.4,0,5.75),I(3.4,0,5.75),'#7a7680',u*0.12);
    const bd=(X0,X1,Y,Z0,Z1,col)=>{TH.poly(c,[I(X0,Y,Z0),I(X1,Y,Z0),I(X1,Y,Z1),I(X0,Y,Z1)],col,'#f6efe0',u*0.08);TH.ln(c,I(X0,Y,Z0),I(X1,Y,Z1),'#f6efe0',u*0.08);TH.ln(c,I(X1,Y,Z0),I(X0,Y,Z1),'#f6efe0',u*0.08);};
    bd(-1.2,1.2,2.21,0,2.7,K.barn);TH.ln(c,I(0,2.22,0),I(0,2.22,2.7),'#f6efe0',u*0.1);bd(-0.6,0.6,2.21,3.3,4.5,'#8a2620');const hp=I(3.01,0,4.0);TH.poly(c,[I(3.01,-0.6,3.4),I(3.01,0.6,3.4),I(3.01,0.6,4.4),I(3.01,-0.6,4.4)],'#8a2620','#f6efe0',u*0.08);
    const cp=I(0,0,5.75);TH.box(c,x,y,u,-0.4,0.4,-0.4,0.4,5.7,6.5,'#f6efe0','#d6ceba','#fff9e8');TH.poly(c,[I(-0.55,0.55,6.5),I(0.55,0.55,6.5),I(0,0,7.2)],'#5c5860');TH.ln(c,I(0,0,7.2),I(0,0,7.8),'#222',u*0.06);const wvv=Math.sin((tm||0)*1.2)*0.3;TH.ln(c,I(-0.4,0,7.6),I(0.4+wvv,0,7.6),'#222',u*0.06);TH.ell(c,...I(0.5+wvv,0,7.65),u*0.12,u*0.12,'#d9a02a');}},
  grandstand:{cat:'landmark',w:3.9,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0,r=mulberry(v+3);ksh(c,x,y,u*4.1,u*6);
    TH.poly(c,[I(-3.8,-2.4,0),I(3.8,-2.4,0),I(3.8,-2.4,4.5),I(-3.8,-2.4,4.5)],'#5a3b22');[-3.6,-1.2,1.2,3.6].forEach(X=>{TH.ln(c,I(X,-2.5,0),I(X,-2.5,6.2),K.woodD,u*0.22);TH.ln(c,I(X,1.4,3.4),I(X,1.4,6.0),K.woodD,u*0.2);});
    for(let i=0;i<5;i++){const Y0=-2.4+i*0.62,Z0=i*0.75;TH.box(c,x,y,u,-3.8,3.8,Y0,Y0+0.62,0,Z0+0.75,'#c49858','#8a6238','#d6a86a');}
    for(let i=0;i<5;i++){const Y0=-2.4+i*0.62,Z=i*0.75+0.75;for(let k=0;k<13;k++){if(r()<0.18)continue;const p=I(-3.5+k*0.58,Y0+0.35,Z);const col=['#d9342b','#2a5fa8','#f2c230','#2fb5a8','#f49ac1','#f6efe0','#8a5ad0'][(k+i*3)%7];TH.ell(c,p[0],p[1]-u*0.45,u*0.2,u*0.28,col);TH.ell(c,p[0],p[1]-u*0.88,u*0.15,u*0.15,['#fde4c8','#e0b48a','#c9936a'][(k+i)%3]);if(k%5===1)TH.ln(c,[p[0]+u*0.2,p[1]-u*0.6],[p[0]+u*0.3,p[1]-u*0.95+Math.sin(t*4+k)*u*0.08],'#fde4c8',u*0.07);}}
    TH.poly(c,[I(-4.2,1.9,5.5),I(4.2,1.9,5.5),I(4.2,-2.8,6.8),I(-4.2,-2.8,6.8)],'#a82a22');for(let i=0;i<9;i++){const a=-4.2+i*0.933,b=a+0.933;if(i%2===0)TH.poly(c,[I(a,1.9,5.5),I(b,1.9,5.5),I(b,-2.8,6.8),I(a,-2.8,6.8)],'#f6efe0');}TH.ln(c,I(-4.2,1.9,5.5),I(4.2,1.9,5.5),'#7a1f19',u*0.14);
    fsign(c,x,y,u,-2.2,2.2,1.95,4.5,5.4,'COUNTY FAIR',K.blue,'#f6efe0');[[-4.0,1.9],[4.0,1.9]].forEach(([X,Y],i)=>{const p=I(X,Y,5.6);TH.ln(c,p,[p[0],p[1]-u*1.8],'#d5dae6',u*0.07);TH.poly(c,[[p[0],p[1]-u*1.8],[p[0]+u*1.0,p[1]-u*1.55+Math.sin(t*3+i)*u*0.1],[p[0],p[1]-u*1.2]],i?K.yel:K.red);});}},
  fairArch:{cat:'landmark',w:3.6,tier:3,weight:2.5,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0;ksh(c,x,y,u*3.8,u*8);
    [-3.0,3.0].forEach(X=>{TH.box(c,x,y,u,X-0.55,X+0.55,-0.55,0.55,0,0.7,'#d6c7a4','#a8997a','#eee3c6');TH.box(c,x,y,u,X-0.4,X+0.4,-0.4,0.4,0.7,6.4,K.red,K.redD,'#e8584c');for(let k=0;k<5;k++)TH.ln(c,I(X-0.4,0.41,1.2+k*1.0),I(X+0.4,0.41,1.2+k*1.0),'rgba(255,255,255,.35)',u*0.1);TH.box(c,x,y,u,X-0.6,X+0.6,-0.6,0.6,6.4,6.8,'#eee3c6','#c9bd9a','#fff9e8');TH.ell(c,...I(X,0,7.0),u*0.3,u*0.3,K.yel);});
    const pts=[];for(let k=0;k<=24;k++){const a=Math.PI*k/24,X=-3.0*Math.cos(a),Z=6.8+Math.sin(a)*1.6;pts.push(I(X,0.45,Z));}TH.poly(c,pts.concat(pts.slice().reverse().map(p=>[p[0],p[1]+u*1.0])),K.blue,'#f6efe0',u*0.1);
    fsign(c,x,y,u,-2.2,2.2,0.5,6.0,7.4,'COUNTY FAIR',K.red,'#fff3b0');for(let k=0;k<=24;k++){const a=Math.PI*k/24,p=I(-3.0*Math.cos(a),0.5,6.8+Math.sin(a)*1.6+0.55),on=(Math.floor(t*4)+k)%2===0;const gl=c.createRadialGradient(p[0],p[1],0,p[0],p[1],u*0.5);gl.addColorStop(0,'rgba(255,230,150,'+(on?0.7:0.15)+')');gl.addColorStop(1,'rgba(255,230,150,0)');c.fillStyle=gl;c.beginPath();c.arc(p[0],p[1],u*0.5,0,7);c.fill();TH.ell(c,p[0],p[1],u*0.1,u*0.1,on?'#fff3b0':'#9a8a50');}
    for(let k=0;k<7;k++){const X=-2.4+k*0.8,p=I(X,0.5,5.4);TH.ell(c,p[0],p[1],u*0.08,u*0.08,(Math.floor(t*4)+k)%2?'#fff3b0':'#9a8a50');}
    [-3.0,3.0].forEach((X,i)=>{const p=I(X,0,7.2);TH.ln(c,p,[p[0],p[1]-u*1.3],'#d5dae6',u*0.07);TH.poly(c,[[p[0],p[1]-u*1.3],[p[0]+u*1.1,p[1]-u*1.1+Math.sin(t*3+i)*u*0.1],[p[0],p[1]-u*0.8]],i?K.yel:K.blue);});}},
  bigTop:{cat:'landmark',w:4.8,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const t=tm||0,R0=u*4.4,Hw=u*2.6,Hr=u*5.2,N=14;ksh(c,x,y,R0*1.05,u*9);TH.ell(c,x,y,R0*1.04,R0*0.5,'#9a7a42');
    for(let i=0;i<N;i++){const a0=Math.PI*i/N,a1=Math.PI*(i+1)/N,p0=[x+Math.cos(a0)*R0,y+Math.sin(a0)*R0*0.5],p1=[x+Math.cos(a1)*R0,y+Math.sin(a1)*R0*0.5];TH.poly(c,[p0,p1,[p1[0],p1[1]-Hw],[p0[0],p0[1]-Hw]],i%2?'#f6efe0':K.red);}
    const g=c.createLinearGradient(x-R0,0,x+R0,0);g.addColorStop(0,'rgba(255,255,255,.3)');g.addColorStop(0.5,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(30,20,10,.45)');c.fillStyle=g;c.fillRect(x-R0,y-Hw,R0*2,Hw+R0*0.5);
    const ap=[x,y-Hw-Hr];for(let i=0;i<N*2;i++){const a0=Math.PI*2*i/(N*2),a1=Math.PI*2*(i+1)/(N*2);TH.poly(c,[ap,[x+Math.cos(a0)*R0,y-Hw+Math.sin(a0)*R0*0.5],[x+Math.cos(a1)*R0,y-Hw+Math.sin(a1)*R0*0.5]],i%2?'#f6efe0':K.red,'rgba(60,20,10,.15)',u*0.03);}
    for(let i=0;i<N*2;i++){const a=Math.PI*2*i/(N*2);if(Math.sin(a)>-0.05){const px=x+Math.cos(a)*R0,py=y-Hw+Math.sin(a)*R0*0.5;TH.poly(c,[[px-u*0.3,py],[px+u*0.3,py],[px,py+u*0.6]],i%2?K.red:'#f6efe0');}}
    c.beginPath();c.moveTo(x-u*0.9,y+R0*0.46);c.lineTo(x-u*0.6,y-Hw+u*0.2);c.quadraticCurveTo(x,y-Hw-u*0.8,x+u*0.6,y-Hw+u*0.2);c.lineTo(x+u*0.9,y+R0*0.46);c.closePath();c.fillStyle='#2a1810';c.fill();TH.poly(c,[[x-u*0.9,y+R0*0.46],[x-u*0.6,y-Hw+u*0.2],[x-u*1.9,y+R0*0.5]],K.red);TH.poly(c,[[x+u*0.9,y+R0*0.46],[x+u*0.6,y-Hw+u*0.2],[x+u*1.9,y+R0*0.5]],'#f6efe0');
    for(let i=0;i<22;i++){const a=Math.PI*(i+0.5)/22,p=[x+Math.cos(a)*R0,y-Hw+Math.sin(a)*R0*0.5],on=(Math.floor(t*4)+i)%2===0;TH.ell(c,p[0],p[1]+u*0.1,u*0.1,u*0.1,on?'#fff3b0':'#9a8a50');}
    TH.ln(c,ap,[ap[0],ap[1]-u*1.8],'#d5dae6',u*0.1);[[0,0,K.red],[0.9,0.2,K.yel],[-0.9,0.2,K.blue]].forEach(([dx,dy,col],i)=>{TH.poly(c,[[ap[0],ap[1]-u*(1.8-dy)],[ap[0]+u*(1.6+dx*0.0),ap[1]-u*(1.6-dy)+Math.sin(t*3+i)*u*0.1],[ap[0],ap[1]-u*(1.2-dy)]],col);});}},
  hotAirBalloon:{cat:'landmark',w:2.6,tier:4,weight:2.5,cost:4,draw(c,x,y,u,v,tm){const t=tm||0,bob=Math.sin(t*0.8+v)*u*0.25,Rb=u*2.9,cy=y-u*8.2+bob,sw=Math.sin(t*0.6+v)*u*0.15;ksh(c,x,y,u*1.8,u*9);
    [[-2.2,0.8],[2.2,0.8],[0,-1.2]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u,y+dy*u],[x+sw*0.5,y-u*2.6+bob],'rgba(230,225,210,.75)',u*0.05);TH.ell(c,x+dx*u,y+dy*u+u*0.05,u*0.25,u*0.1,'#6b6f78');});
    const gores=10;c.save();c.beginPath();c.moveTo(x+sw-Rb*0.28,cy+Rb*1.35);c.bezierCurveTo(x+sw-Rb*1.3,cy+Rb*0.9,x+sw-Rb*1.15,cy-Rb*1.2,x+sw,cy-Rb*1.25);c.bezierCurveTo(x+sw+Rb*1.15,cy-Rb*1.2,x+sw+Rb*1.3,cy+Rb*0.9,x+sw+Rb*0.28,cy+Rb*1.35);c.closePath();c.clip();
    for(let i=0;i<gores;i++){const a=x+sw-Rb*1.3+Rb*2.6*i/gores;c.fillStyle=['#d9342b','#f2c230','#2a5fa8','#f6efe0','#2fb5a8'][i%5];c.fillRect(a,cy-Rb*1.3,Rb*2.6/gores+1,Rb*2.8);}
    const gg=c.createLinearGradient(x-Rb,0,x+Rb,0);gg.addColorStop(0,'rgba(255,255,255,.35)');gg.addColorStop(0.5,'rgba(0,0,0,0)');gg.addColorStop(1,'rgba(20,10,30,.45)');c.fillStyle=gg;c.fillRect(x-Rb*1.4,cy-Rb*1.3,Rb*2.8,Rb*2.8);
    c.strokeStyle='rgba(40,20,10,.25)';c.lineWidth=u*0.06;for(let i=1;i<gores;i++){const a=x+sw-Rb*1.3+Rb*2.6*i/gores;c.beginPath();c.moveTo(x+sw+(a-(x+sw))*0.18,cy+Rb*1.35);c.quadraticCurveTo(a*1.0+(a-(x+sw))*0.08,cy,x+sw+(a-(x+sw))*0.05,cy-Rb*1.25);c.stroke();}
    c.fillStyle='rgba(255,255,255,.45)';c.beginPath();c.ellipse(x+sw-Rb*0.5,cy-Rb*0.3,Rb*0.18,Rb*0.55,0.2,0,7);c.fill();c.restore();TH.ln(c,[x+sw-Rb*0.27,cy+Rb*1.35],[x+sw*0.6-u*0.7,y-u*2.0+bob],'rgba(60,40,20,.6)',u*0.06);TH.ln(c,[x+sw+Rb*0.27,cy+Rb*1.35],[x+sw*0.6+u*0.7,y-u*2.0+bob],'rgba(60,40,20,.6)',u*0.06);
    const by=y-u*2.0+bob;TH.poly(c,[[x+sw*0.6-u*0.8,by],[x+sw*0.6+u*0.8,by],[x+sw*0.6+u*0.65,by+u*1.2],[x+sw*0.6-u*0.65,by+u*1.2]],'#a97d49','#5a3b22',u*0.06);for(let k=1;k<4;k++)TH.ln(c,[x+sw*0.6-u*0.8+k*u*0.4,by],[x+sw*0.6-u*0.65+k*u*0.33,by+u*1.2],'rgba(60,30,10,.4)',u*0.05);
    const f=Math.sin(t*12+v)*u*0.08,fx=x+sw*0.6,fy=by-u*0.3;const gl=c.createRadialGradient(fx,fy-u*0.4,0,fx,fy-u*0.4,u*1.8);gl.addColorStop(0,'rgba(255,170,60,.5)');gl.addColorStop(1,'rgba(255,170,60,0)');c.fillStyle=gl;c.beginPath();c.arc(fx,fy-u*0.4,u*1.8,0,7);c.fill();TH.poly(c,[[fx-u*0.18,fy],[fx+f,fy-u*0.8],[fx+u*0.18,fy]],'#fbbf24');TH.poly(c,[[fx-u*0.09,fy],[fx+f*0.5,fy-u*0.5],[fx+u*0.09,fy]],'#fff3b0');
    for(let k=0;k<3;k++)TH.ell(c,x+sw*0.6+(k-1)*u*0.4,by+u*0.05-u*0.1,u*0.13,u*0.13,['#fde4c8','#e0b48a','#c9936a'][k]);}}
  }};
const CLASSIC_HEIGHT={sunflowers:'low',cornStalks:'low',pumpkinPatch:'low',popcornCart:'low',cottonCandyCart:'low',picnicTable:'low',livestockPen:'low',hayBales:'low',
  shadeTree:'mid',mapleTree:'mid',ticketBooth:'mid',ringToss:'mid',balloonDarts:'mid',balloonBunch:'mid',buntingLine:'mid',prizeWheel:'mid',highStriker:'mid',tractor:'mid',scarecrow:'mid',
  redBarn:'tall',grandstand:'tall',fairArch:'tall',bigTop:'tall',hotAirBalloon:'tall'};
Object.keys(CLASSIC_PACK.assets).forEach(id=>{CLASSIC_PACK.assets[id].h=CLASSIC_HEIGHT[id]||'low';});
const KEEP_OUT={rx:0.52,ry:0.34};   // central ellipse (x R) reserved for the ride or building sprite
function placeThemeAssets(pack,tier,R,seed){
  const rnd=mulberry(seed*7919+tier*131), u=R*0.068, T=pack.tiers[tier], out=[], decals=[], TAU=Math.PI*2;
  if(!T)return {assets:out,decals,u};
  const inside=(x,y,k)=>{const X=Math.abs(x)/R,Y=Math.abs(y)/(0.58*R);return X<=0.866*k&&Y<=k-X/1.732;};
  const ids=Object.keys(pack.assets), cnt={};
  const free=(x,y,w)=>out.every(o=>Math.hypot(o.x-x,(o.y-y)*1.7)>(o.w+w)*u*0.8);
  const clearOfCenter=(x,y,w,h)=>{const kx=h==='tall'?0.28:0.75,ky=h==='tall'?0.18:0.4,ex=R*KEEP_OUT.rx+w*u*kx,ey=R*KEEP_OUT.ry+w*u*ky;return x*x/(ex*ex)+y*y/(ey*ey)>1;};
  const zoneOK=(a,x,y)=>{const h=a.h||'low';if(h==='low')return true;const ax=Math.abs(x)/R;
    if(h==='tall')return y<R*0.12&&ax>(y>=-R*0.12?0.55:0.4);
    if(y>R*0.12)return h==='mid'&&ax>0.5;if(y>=-R*0.12)return h==='mid'||ax>0.55;return true;};
  const ringPoint=(tmax)=>{const th=rnd()*TAU,dx=Math.cos(th),dy=Math.sin(th);let lo=0,hi=R*1.2;
    for(let i=0;i<12;i++){const m=(lo+hi)/2;if(inside(dx*m,dy*m,0.9))lo=m;else hi=m;}const t=0.5+rnd()*((tmax||1)-0.5);return[dx*lo*t,dy*lo*t];};
  const spot=a=>{for(let i=0;i<120;i++){const p=ringPoint(a.h==='tall'?0.8:a.h==='mid'?0.92:1);if(clearOfCenter(p[0],p[1],a.w,a.h)&&zoneOK(a,p[0],p[1])&&free(p[0],p[1],a.w))return p;}return null;};
  const add=(id,x,y)=>{const a=pack.assets[id];out.push({id,x,y,v:Math.floor(rnd()*1000),w:a.w});cnt[id]=(cnt[id]||0)+1;};
  for(let i=0;i<T.decals;i++){const pool=ids.filter(id=>pack.assets[id].cat==='decal'&&pack.assets[id].tier<=tier),id=pool[Math.floor(rnd()*pool.length)];
    for(let t=0;t<40;t++){const p=ringPoint();if(clearOfCenter(p[0],p[1],pack.assets[id].w*0.5)){decals.push({id,x:p[0],y:p[1],v:Math.floor(rnd()*1000)});break;}}}
  let budget=T.budget;
  const land=()=>{let id=T.pool[Math.floor(rnd()*T.pool.length)];for(let q=0;q<8&&cnt[id];q++)id=T.pool[Math.floor(rnd()*T.pool.length)];
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}};
  if(T.pool.length&&rnd()<T.landmark){land();if(T.second&&rnd()<T.second)land();}
  let guard=0;while(budget>0&&guard++<500){const pool=ids.filter(id=>{const a=pack.assets[id];return a.cat!=='decal'&&a.cat!=='landmark'&&a.tier<=tier&&a.cost<=budget&&(cnt[id]||0)<(a.max||3);});
    if(!pool.length)break;let tot=0;pool.forEach(id=>tot+=pack.assets[id].weight);let pick=rnd()*tot,id=pool[0];for(const q of pool){pick-=pack.assets[q].weight;if(pick<=0){id=q;break;}}
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}else{cnt[id]=99;}}
  return {assets:out,decals,u};
}
function drawThemeGround(ctx,cx,cy,R,pack,border){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);ctx[i?'lineTo':'moveTo'](cx+R*Math.cos(a),cy+R*Math.sin(a)*0.58);}ctx.closePath();
  ctx.fillStyle=pack.ground;ctx.fill();if(border!==false){ctx.lineWidth=Math.max(1.5,R*0.03);ctx.strokeStyle=border||pack.border;ctx.stroke();}}
function drawThemeDecals(ctx,cx,cy,pack,pl,tm){pl.decals.forEach(d=>pack.assets[d.id].draw(ctx,cx+d.x,cy+d.y,pl.u,d.v,tm||0));}
/* layer: 'back' (y<0, draw BEFORE the ride sprite), 'front' (y>=0, draw AFTER it) or omit for all, sorted by y */
function drawThemeAssets(ctx,cx,cy,pack,pl,tm,layer){pl.assets.filter(o=>layer==='back'?o.y<0:layer==='front'?o.y>=0:true).sort((a,b)=>a.y-b.y).forEach(o=>pack.assets[o.id].draw(ctx,cx+o.x,cy+o.y,pl.u,o.v,tm||0));}
function drawThemedTile(ctx,cx,cy,R,pack,tier,seed,tm,border,rideFn){drawThemeGround(ctx,cx,cy,R,pack,border);const pl=placeThemeAssets(pack,tier,R,seed);
  drawThemeDecals(ctx,cx,cy,pack,pl,tm);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'back');if(rideFn)rideFn(ctx,cx,cy,R);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'front');}
return { pack: CLASSIC_PACK, placeThemeAssets, drawThemeGround, drawThemeDecals, drawThemeAssets };
})();

const FRONTIER_THEME_PACK = (() => {
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
/* ===== FRONTIER PACK ===== */
const F={wood:'#8a5a33',woodD:'#5a3b22',woodL:'#b07a46',bark:'#6b4a2b',endc:'#d9b27a',pine:'#2f5f3a',pineL:'#3d7348',pineD:'#26503a',water:'#4aa0c8',waterD:'#2f7fa8',rock:'#8a8f96',rockD:'#5f656c',rockL:'#b4b9c0',snow:'#f4f8fc',canvas:'#eadfc4'};
const fsh=(c,x,y,rx,h)=>{c.fillStyle='rgba(12,34,14,.32)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
const logWall=(c,x,y,u,X0,X1,Y,Z0,Z1)=>{let k=0;for(let z=Z0+0.17;z<Z1;z+=0.34,k++){const a=TH.iso(x,y,u,X0,Y,z),b=TH.iso(x,y,u,X1,Y,z);TH.ln(c,a,b,k%2?F.wood:'#7d4f2b',u*0.36);TH.ln(c,[a[0],a[1]-u*0.09],[b[0],b[1]-u*0.09],'rgba(255,225,170,.28)',u*0.08);}};
const logWallE=(c,x,y,u,X,Y0,Y1,Z0,Z1)=>{let k=0;for(let z=Z0+0.17;z<Z1;z+=0.34,k++){const a=TH.iso(x,y,u,X,Y0,z),b=TH.iso(x,y,u,X,Y1,z);TH.ln(c,a,b,k%2?'#6f4524':'#5f3b1f',u*0.36);}};
const logEnds=(c,x,y,u,X,Y,Z0,Z1)=>{for(let z=Z0+0.17;z<Z1;z+=0.34){const p=TH.iso(x,y,u,X,Y,z);TH.ell(c,p[0],p[1],u*0.2,u*0.17,F.endc);TH.ell(c,p[0],p[1],u*0.09,u*0.07,'#b8884f');}};
function frFir(c,x,y,u,s,v){const H=u*6.2*s,tiers=6;fsh(c,x,y,u*1.6*s,H);TH.ln(c,[x,y],[x,y-u*1.2*s],'#4a3320',u*0.5*s);
  for(let k=0;k<tiers;k++){const t=k/(tiers-1),by=y-u*1.0*s-H*0.76*t,w=u*(1.75-1.2*t)*s,h=u*1.5*s;
    TH.poly(c,[[x-w,by+h*0.2],[x-w*0.35,by-h*0.3],[x,by-h*1.15],[x+w*0.35,by-h*0.3],[x+w,by+h*0.2],[x,by+h*0.55]],k%2?F.pine:F.pineL);
    TH.poly(c,[[x,by-h*1.15],[x+w*0.35,by-h*0.3],[x+w,by+h*0.2],[x+w*0.3,by+h*0.35]],'rgba(8,30,18,.4)');}}
const fcrag=(c,x,y,u,o)=>{const wt=o.wt,wb=o.wb,H=o.H,r=mulberry(o.seed),n=o.bands.length;TH.ell(c,x,y,wb*1.1,wb*0.47,'#6f7a62');c.save();c.beginPath();c.moveTo(x-wt,y-H);c.lineTo(x-wb,y);c.ellipse(x,y,wb,wb*0.42,0,Math.PI,0,true);c.lineTo(x+wt,y-H);c.ellipse(x,y-H,wt,wt*0.42,0,0,Math.PI);c.closePath();c.clip();
  const Hh=H+wb*0.42;for(let j=0;j<n;j++){c.fillStyle=o.bands[j];c.fillRect(x-wb-2,y-H+Hh*j/n,wb*2+4,Hh/n+1);}
  const g=c.createLinearGradient(x-wb,0,x+wb,0);g.addColorStop(0,'rgba(255,255,255,.22)');g.addColorStop(0.45,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,15,25,.5)');c.fillStyle=g;c.fillRect(x-wb-2,y-H-2,wb*2+4,Hh+4);
  for(let k=0;k<8;k++){const fx=x+(r()*2-1)*wt*0.9,bx=x+(fx-x)*wb/wt;c.strokeStyle='rgba(20,28,36,.3)';c.lineWidth=u*0.07;c.beginPath();c.moveTo(fx,y-H+wt*0.25);c.quadraticCurveTo((fx+bx)/2+u*0.12,y-H/2,bx,y+wb*0.3);c.stroke();}
  c.restore();TH.ell(c,x,y-H,wt,wt*0.42,o.top||'#6f8a5a');};
const FRONTIER_PACK={id:'frontier',name:'Frontier',ground:'#7d955d',groundDark:'#6b8350',border:'#566e42',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},
         3:{budget:11,decals:4,landmark:0.75,pool:['lookoutTower','waterfallCliff','mountainPeak']},
         4:{budget:15,decals:5,landmark:1,pool:['stockadeFort','sawmill','mountainPeak','waterfallCliff','lookoutTower'],second:0.45}},
  assets:{
  /* ---------- ground decals ---------- */
  riverBend:{cat:'decal',w:3.2,tier:1,weight:4,cost:0,draw(c,x,y,u,v,tm){const r=mulberry(v+3),f=v%2?-1:1,t=tm||0;const path=()=>{c.beginPath();c.moveTo(x-u*3.2,y-u*0.5*f);c.bezierCurveTo(x-u*1.6,y+u*0.7*f,x-u*0.1,y-u*0.9*f,x+u*3.2,y+u*0.5*f);};
    c.lineCap='round';path();c.strokeStyle='#6b5a3a';c.lineWidth=u*1.55;c.stroke();path();c.strokeStyle='#2f7fa8';c.lineWidth=u*1.2;c.stroke();path();c.strokeStyle='#4aa0c8';c.lineWidth=u*0.9;c.stroke();
    c.setLineDash([u*0.35,u*0.55]);c.lineDashOffset=-t*u*1.5;path();c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=u*0.08;c.stroke();c.setLineDash([]);
    for(let k=0;k<9;k++){const s=r(),b=(1-s)**3*(x-u*3.2)+3*(1-s)**2*s*(x-u*1.6)+3*(1-s)*s*s*(x-u*0.1)+s**3*(x+u*3.2),yy=(1-s)**3*(y-u*0.5*f)+3*(1-s)**2*s*(y+u*0.7*f)+3*(1-s)*s*s*(y-u*0.9*f)+s**3*(y+u*0.5*f);TH.ell(c,b,yy+(k%2?1:-1)*u*0.8,u*0.2,u*0.12,['#8a8f96','#a5a9ad','#6f747a'][k%3]);}}},
  pebbleBar:{cat:'decal',w:2.0,tier:1,weight:3,cost:0,draw(c,x,y,u,v){const r=mulberry(v+5);TH.ell(c,x,y,u*2.0,u*0.9,'#b9b4a2');for(let k=0;k<28;k++){const a=r()*6.283,rr=Math.sqrt(r());TH.ell(c,x+Math.cos(a)*u*1.8*rr,y+Math.sin(a)*u*0.8*rr,u*0.14,u*0.09,['#8a8f96','#a8a290','#c9c3b0','#6f747a'][k%4]);}}},
  pineNeedles:{cat:'decal',w:2.2,tier:1,weight:3.5,cost:0,draw(c,x,y,u,v){const r=mulberry(v+8);TH.ell(c,x,y,u*2.2,u*0.95,'#6b4f32');TH.ell(c,x-u*0.2,y-u*0.05,u*1.7,u*0.7,'#7b5c3a');for(let k=0;k<34;k++){const a=r()*6.283,rr=Math.sqrt(r()),px=x+Math.cos(a)*u*2.0*rr,py=y+Math.sin(a)*u*0.85*rr;TH.ln(c,[px,py],[px+u*0.28,py-u*0.1],k%3?'#4a3320':'#8a6a45',u*0.04);}}},
  wildMeadow:{cat:'decal',w:2.2,tier:1,weight:3.5,cost:0,draw(c,x,y,u,v){const r=mulberry(v+9);for(let k=0;k<30;k++){const a=r()*6.283,rr=Math.sqrt(r()),px=x+Math.cos(a)*u*2.0*rr,py=y+Math.sin(a)*u*0.9*rr;TH.ln(c,[px,py],[px+(r()-0.5)*u*0.2,py-u*(0.3+r()*0.3)],'#4a7a3c',u*0.05);if(k%3===0)TH.ell(c,px,py-u*0.5,u*0.09,u*0.12,['#8a5ad0','#f2d24a','#f8fafc','#d884e0'][k%4]);}}},
  /* ---------- trees and plants ---------- */
  pineTree:{cat:'tree',w:1.8,tier:2,weight:3.5,cost:2,max:2,draw(c,x,y,u,v){frFir(c,x,y,u,1.3+(v%3)*0.12,v);}},
  firGrove:{cat:'tree',w:2.3,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v){[[-1.1,0.2,0.8],[1.0,0.3,0.92],[0.0,-0.5,0.7]].sort((a,b)=>a[1]-b[1]).forEach(([dx,dy,s])=>frFir(c,x+dx*u,y+dy*u,u,s,v));}},
  aspenTree:{cat:'tree',w:1.7,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*5+2),H=u*(4.2+r()*0.8),t=tm||0;fsh(c,x,y,u*1.8,u*6);TH.ln(c,[x,y],[x+u*0.1,y-H],'#d8d3c2',u*0.5);TH.ln(c,[x+u*0.12,y],[x+u*0.2,y-H],'rgba(60,50,40,.25)',u*0.2);
    for(let k=0;k<9;k++){const ky=y-u*(0.4+k*0.45);TH.ln(c,[x-u*0.18,ky],[x+u*0.05,ky-u*0.05],'#3a3228',u*0.06);}
    const cols=['#c9b43a','#b2c040','#9ab838','#d6c046'];[[0,-0.9,1.9,1.5],[-1.2,0.1,1.4,1.1],[1.2,0.0,1.4,1.1],[0.1,0.1,1.7,1.2],[-0.5,-1.9,1.2,0.95]].forEach(([dx,dy,rx,ry],i)=>{const sw=Math.sin(t*1.4+i)*u*0.06;TH.blob(c,x+dx*u+sw,y-H+dy*u,u*rx,u*ry,cols[i%4],r,9);});}},
  berryBush:{cat:'plant',w:1.4,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*3+6);fsh(c,x,y,u*1.4,u);[[-0.7,-0.5,0.85,'#3f7a45'],[0.7,-0.5,0.8,'#4a8a4c'],[0,-0.95,0.95,'#559858'],[-0.1,-0.45,0.85,'#437f48']].forEach(([dx,dy,s,col])=>TH.blob(c,x+dx*u,y+dy*u,u*s,u*s*0.72,col,r,9));
    for(let k=0;k<9;k++)TH.ell(c,x+(r()-0.5)*u*1.8,y-u*(0.3+r()*1.0),u*0.1,u*0.1,['#3a5ad0','#d9342b','#5a3ad0'][k%3]);}},
  fernPatch:{cat:'plant',w:1.5,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*5+2),t=tm||0;fsh(c,x,y,u*1.5,u*1.5);for(let k=0;k<8;k++){const a=-3.1+k*0.48,l=u*(1.5+r()*0.7),sw=Math.sin(t*1.2+k)*u*0.05,ex=x+Math.cos(a)*l+sw,ey=y-Math.abs(Math.sin(a))*l*0.8-u*0.15;
      c.strokeStyle=k%2?'#2f6a3a':'#3a7a44';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(ex-x)*0.45,y-l*0.85,ex,ey);c.stroke();
      for(let q=1;q<7;q++){const f=q/7,px=x+(ex-x)*f*0.92,py=y+(ey-y)*f-Math.sin(f*3.0)*l*0.3;TH.ln(c,[px,py],[px-u*0.26,py+u*0.18],'#4a8e4e',u*0.05);TH.ln(c,[px,py],[px+u*0.26,py+u*0.18],'#4a8e4e',u*0.05);}}}},
  cattails:{cat:'plant',w:1.4,tier:1,weight:3,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*4+3),t=tm||0;TH.ell(c,x,y+u*0.1,u*1.6,u*0.6,'#3f8fb5');TH.ell(c,x-u*0.2,y,u*1.2,u*0.4,'#56a8cc');
    for(let k=0;k<8;k++){const bx=x+(k-3.5)*u*0.3,h=u*(2.4+r()*1.3),sw=Math.sin(t*1.3+k)*u*0.06;TH.ln(c,[bx,y],[bx+sw,y-h],'#5a8a3a',u*0.1);TH.ln(c,[bx,y-h*0.3],[bx-u*0.5+sw,y-h*0.95],'#4a7a32',u*0.06);if(k%2===0){TH.ell(c,bx+sw,y-h*0.82,u*0.13,u*0.38,'#6b4a2b');TH.ln(c,[bx+sw,y-h*0.6],[bx+sw,y-h*1.15],'#8a6a45',u*0.04);}}}},
  fallenLog:{cat:'plant',w:2.4,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+2);fsh(c,x,y,u*2.4,u*1.5);const a=I(-2.2,0,0.5),b=I(2.2,0,0.5);TH.ln(c,a,b,'#4a3320',u*1.2);TH.ln(c,a,b,F.bark,u*1.0);TH.ln(c,[a[0],a[1]-u*0.3],[b[0],b[1]-u*0.3],F.woodL,u*0.2);
    for(let k=0;k<7;k++){const p=I(-1.8+k*0.6,0,0.5);TH.ln(c,[p[0],p[1]-u*0.45],[p[0]+u*0.2,p[1]+u*0.4],'rgba(40,24,10,.35)',u*0.05);}TH.ell(c,b[0],b[1],u*0.5,u*0.62,F.endc);[0.16,0.3,0.44].forEach(s=>{c.strokeStyle='rgba(120,80,40,.5)';c.lineWidth=u*0.04;c.beginPath();c.ellipse(b[0],b[1],u*s*1.1,u*s*1.3,0,0,7);c.stroke();});
    TH.ln(c,I(0.5,0,0.8),I(1.2,-0.6,1.7),F.bark,u*0.16);TH.blob(c,...I(-1.0,0.1,1.1),u*0.7,u*0.2,'rgba(95,138,71,.95)',r,7);for(let k=0;k<3;k++){const p=I(-0.4+k*0.35,0.5,0.75);TH.ln(c,[p[0],p[1]],[p[0],p[1]-u*0.35],'#e8e0cc',u*0.06);TH.ell(c,p[0],p[1]-u*0.4,u*0.16,u*0.1,'#c9663a');}}},
  boulders:{cat:'rock',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*13+3);fsh(c,x,y,u*1.9,u*1.4);[[0.0,0.0,1.0,1.0,'#80858d'],[-1.0,0.2,0.65,0.6,'#6f747c'],[0.9,0.25,0.6,0.55,'#8f949b']].forEach(([dx,dy,sx,sy,col])=>TH.blob(c,x+dx*u,y-u*0.55*sy+dy*u,u*0.9*sx,u*0.75*sy,col,r,9));
    for(let k=0;k<4;k++)TH.ell(c,x+(r()-0.5)*u*1.4,y-u*(0.2+r()*0.7),u*0.2,u*0.1,k%2?'rgba(150,170,90,.8)':'rgba(95,138,71,.7)');}},
  /* ---------- props ---------- */
  campfire:{cat:'prop',w:1.7,tier:1,weight:3,cost:1,max:1,draw(c,x,y,u,v,tm){const t=tm||0;fsh(c,x,y,u*1.8,u*2);TH.ell(c,x,y+u*0.1,u*1.2,u*0.5,'#4a3a2a');for(let k=0;k<9;k++){const a=k/9*6.283;TH.ell(c,x+Math.cos(a)*u*0.95,y+u*0.1+Math.sin(a)*u*0.42,u*0.28,u*0.18,['#8a8f96','#6f747a'][k%2]);}
    TH.ln(c,[x-u*0.7,y+u*0.1],[x+u*0.6,y-u*0.3],'#4a3320',u*0.24);TH.ln(c,[x+u*0.7,y+u*0.15],[x-u*0.5,y-u*0.3],'#5a4028',u*0.24);
    [[-1.9,0.4],[1.9,0.5]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u-u*0.5,y+dy*u],[x+dx*u+u*0.5,y+dy*u-u*0.1],'#6b4a2b',u*0.5);TH.ell(c,x+dx*u+u*0.5,y+dy*u-u*0.1,u*0.22,u*0.25,F.endc);});
    [[-1.4,0.1],[1.4,0.1],[0,-0.7]].forEach(([dx,dy])=>TH.ln(c,[x+dx*u,y+dy*u+u*0.2],[x+dx*u*0.2,y-u*2.4],'#3b3f4a',u*0.09));TH.ell(c,x,y-u*1.4,u*0.45,u*0.34,'#2b2f3a');
    const g=c.createRadialGradient(x,y-u*0.6,0,x,y-u*0.6,u*2.6);g.addColorStop(0,'rgba(255,170,60,'+(0.45+0.1*Math.sin(t*9))+')');g.addColorStop(1,'rgba(255,170,60,0)');c.fillStyle=g;c.beginPath();c.arc(x,y-u*0.6,u*2.6,0,7);c.fill();
    [[0,1.0,0.9],[-0.35,0.75,0.6],[0.35,0.8,0.65]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*11+i*2+v)*u*0.12;TH.poly(c,[[x+dx*u-u*0.38*w,y-u*0.05],[x+dx*u+f,y-u*(0.1+h*1.2)],[x+dx*u+u*0.38*w,y-u*0.05]],i?'#fbbf24':'#f97316');});
    for(let k=0;k<3;k++){const ph=(t*0.6+k*0.33)%1;c.fillStyle='rgba(120,120,126,'+(0.35*(1-ph))+')';c.beginPath();c.ellipse(x+Math.sin(ph*5+k)*u*0.3,y-u*(2.3+ph*2.2),u*(0.22+ph*0.45),u*(0.18+ph*0.35),0,0,7);c.fill();}}},
  canoe:{cat:'prop',w:2.5,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.7,u*1.5);const N=16,top=[];for(let k=0;k<=N;k++){const X=-2.6+5.2*k/N,q=Math.abs(X)/2.6;top.push([X,0.62*Math.pow(Math.max(0,1-q*q),0.55),0.28+0.95*Math.pow(q,3)]);}
    TH.poly(c,top.map(p=>I(p[0],-p[1],p[2])).concat(top.slice().reverse().map(p=>I(p[0],p[1],p[2]))),'#2f2012');
    TH.poly(c,top.map(p=>I(p[0],p[1],p[2])).concat(top.slice().reverse().map(p=>I(p[0],p[1]*0.35,0.03+p[2]*0.12))),'#c98f4a');
    for(let k=1;k<N;k+=2){const p=top[k];TH.ln(c,I(p[0],p[1],p[2]),I(p[0],p[1]*0.35,0.03+p[2]*0.12),'rgba(90,50,20,.35)',u*0.05);}
    c.strokeStyle='#7a4d2b';c.lineWidth=u*0.12;c.lineJoin='round';c.beginPath();top.forEach((p,i)=>{const q=I(p[0],p[1],p[2]);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.stroke();
    [-0.8,0.9].forEach(X=>TH.ln(c,I(X,-0.55,0.5),I(X,0.55,0.5),'#8a5a33',u*0.12));TH.ln(c,I(1.5,1.3,0),I(1.9,1.0,2.4),F.woodL,u*0.1);TH.ell(c,...I(1.95,0.98,2.7),u*0.14,u*0.3,F.woodL,-0.3);}},
  fishRack:{cat:'prop',w:2.2,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+4);fsh(c,x,y,u*2.3,u*3);[-1.9,1.9].forEach(X=>{TH.ln(c,I(X,-0.7,0),I(X,0,2.6),F.bark,u*0.18);TH.ln(c,I(X,0.7,0),I(X,0,2.6),F.bark,u*0.18);});
    TH.ln(c,I(-2.1,0,2.5),I(2.1,0,2.5),F.woodD,u*0.16);TH.ln(c,I(-1.9,0,1.5),I(1.9,0,1.5),F.woodD,u*0.12);
    for(let k=0;k<10;k++){const X=-1.7+k*0.38,L=0.5+r()*0.5,top=I(X,0,2.5),bot=[top[0],top[1]+u*L*1.2];TH.ln(c,top,bot,'#c9b98a',u*0.04);TH.ell(c,bot[0],bot[1]+u*0.28,u*0.12,u*0.34,'#b8c4cc');TH.poly(c,[[bot[0]-u*0.1,bot[1]+u*0.55],[bot[0]+u*0.1,bot[1]+u*0.55],[bot[0],bot[1]+u*0.4]],'#98a4ac');TH.ell(c,bot[0]+u*0.02,bot[1]+u*0.16,u*0.025,u*0.025,'#222');}
    for(let k=0;k<5;k++){const p=I(-1.5+k*0.75,0,1.5);TH.poly(c,[[p[0]-u*0.12,p[1]],[p[0]+u*0.12,p[1]],[p[0]+u*0.08,p[1]+u*0.9],[p[0]-u*0.08,p[1]+u*0.9]],'#b86a4a');}}},
  firewood:{cat:'prop',w:1.7,tier:1,weight:2,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+5);fsh(c,x,y,u*1.8,u*1.6);[-1.5,1.5].forEach(X=>TH.ln(c,I(X,0.5,0),I(X,0.5,1.6),F.woodD,u*0.18));
    TH.box(c,x,y,u,-1.4,1.4,-0.5,0.5,0,1.5,'#9a6a3c','#6f4a28','#b8884f');for(let row=0;row<4;row++)for(let col=0;col<7;col++){const p=I(-1.2+col*0.4+(row%2)*0.2,0.51,0.18+row*0.36);TH.ell(c,p[0],p[1],u*0.17,u*0.16,F.endc);TH.ell(c,p[0],p[1],u*0.07,u*0.06,'#a8783f');}
    TH.poly(c,[I(-1.6,0.8,1.5),I(1.6,0.8,1.5),I(1.6,-0.6,1.7),I(-1.6,-0.6,1.7)],'#5a3b22');TH.ell(c,x+u*2.0,y+u*0.3,u*0.35,u*0.28,F.endc);TH.ln(c,[x+u*2.0,y+u*0.3],[x+u*2.5,y-u*0.4],F.woodL,u*0.14);TH.poly(c,[[x+u*2.35,y-u*0.45],[x+u*2.75,y-u*0.55],[x+u*2.6,y-u*0.2]],'#9aa0a8');}},
  railFence:{cat:'prop',w:2.6,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.7,u);for(let seg=-2;seg<=1;seg++){const sx=seg*1.25,s=seg%2?1:-1;for(let lvl=0;lvl<4;lvl++){const z=0.25+lvl*0.4,k=(lvl+seg)%2?1:-1;TH.ln(c,I(sx,0.35*k*s,z),I(sx+1.45,-0.35*k*s,z+0.03),'#8a6a45',u*0.2);TH.ell(c,...I(sx+1.45,-0.35*k*s,z+0.03),u*0.1,u*0.1,'#c9a56a');}}
    if(v%2)TH.ln(c,I(1.8,0,0.2),I(2.6,0.5,0.9),'#8a6a45',u*0.2);}},
  footbridge:{cat:'prop',w:2.4,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.poly(c,[I(-1.6,-3.0,0),I(1.6,-3.0,0),I(1.6,3.0,0),I(-1.6,3.0,0)],'#6b5a3a');TH.poly(c,[I(-1.2,-3.0,0.02),I(1.2,-3.0,0.02),I(1.2,3.0,0.02),I(-1.2,3.0,0.02)],F.waterD);TH.poly(c,[I(-0.9,-3.0,0.04),I(0.9,-3.0,0.04),I(0.9,3.0,0.04),I(-0.9,3.0,0.04)],F.water);
    fsh(c,x,y,u*2.2,u*1.5);const deck=Y=>{const z=0.55+0.35*(1-Math.pow(Y/2.6,2));return z;};[-2.6,2.6].forEach(Y=>TH.ln(c,I(-0.7,Y,0),I(-0.7,Y,0.65),F.woodD,u*0.3));
    const pts=[];for(let k=0;k<=12;k++){const Y=-2.6+5.2*k/12;pts.push([Y,deck(Y)]);}TH.poly(c,pts.map(p=>I(-0.75,p[0],p[1])).concat(pts.slice().reverse().map(p=>I(0.75,p[0],p[1]))),'#a97d49');for(let k=1;k<12;k++){TH.ln(c,I(-0.75,pts[k][0],pts[k][1]),I(0.75,pts[k][0],pts[k][1]),'rgba(60,35,10,.4)',u*0.05);}
    [-0.8,0.8].forEach(X=>{c.strokeStyle=F.woodD;c.lineWidth=u*0.12;c.beginPath();pts.forEach((p,i)=>{const q=I(X,p[0],p[1]+0.8);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.stroke();for(let k=0;k<=12;k+=3)TH.ln(c,I(X,pts[k][0],pts[k][1]),I(X,pts[k][0],pts[k][1]+0.8),F.woodD,u*0.1);});}},
  trapperTent:{cat:'prop',w:2.4,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.5,u*3);TH.poly(c,[I(2.2,-1.5,0),I(2.2,1.5,0),I(2.2,0,2.6)],'#d6c7a4');TH.poly(c,[I(2.2,-0.6,0),I(2.2,0.6,0),I(2.2,0.05,1.7)],'#241c14');TH.poly(c,[I(2.2,-0.6,0),I(2.2,0.05,1.7),I(2.2,-0.2,0.0)],'#f0e6c8');
    TH.poly(c,[I(-2.2,1.5,0),I(2.2,1.5,0),I(2.2,0,2.6),I(-2.2,0,2.6)],F.canvas);TH.poly(c,[I(-2.2,0.4,0.9),I(2.2,0.4,0.9),I(2.2,0,2.6),I(-2.2,0,2.6)],'rgba(140,110,60,.18)');for(let k=1;k<5;k++)TH.ln(c,I(-2.2+k*0.9,1.5,0),I(-2.2+k*0.9,0,2.6),'rgba(110,85,50,.35)',u*0.04);TH.ln(c,I(-2.2,0,2.6),I(2.2,0,2.6),F.woodD,u*0.18);
    [-2.6,2.6].forEach(X=>TH.ln(c,I(X,0,2.8),I(X,0,0),F.bark,u*0.14));[[-2.6,2.2],[2.6,2.2],[-1,2.2]].forEach(([X,Y])=>{TH.ln(c,I(X*0.8,1.2,1.0),I(X,Y,0),'rgba(230,220,190,.7)',u*0.04);TH.ln(c,I(X,Y,0),I(X,Y,0.3),F.woodD,u*0.1);});
    TH.ell(c,...I(1.0,2.0,0.3),u*0.3,u*0.2,'#7a5a3a');TH.ell(c,...I(1.0,2.0,0.55),u*0.2,u*0.14,'#e0d6b8');TH.ln(c,I(2.8,1.6,0),I(2.8,1.6,1.5),F.bark,u*0.12);TH.ell(c,...I(2.8,1.6,1.6),u*0.18,u*0.22,'#fbbf24');}},
  bear:{cat:'prop',w:1.7,tier:2,weight:2,cost:1,max:1,draw(c,x,y,u,v,tm){const dk='#4a2f1e',md='#6b4630',lt='#8a6a4a';fsh(c,x,y,u*1.9,u*2.2);[[-0.6,-0.1],[1.1,-0.05]].forEach(([dx,dy])=>{TH.poly(c,[[x+dx*u-u*0.3,y-u*0.9],[x+dx*u+u*0.3,y-u*0.9],[x+dx*u+u*0.26,y+dy*u],[x+dx*u-u*0.26,y+dy*u]],'#3b2516');});
    TH.ell(c,x,y-u*1.4,u*1.75,u*0.95,md);TH.ell(c,x-u*0.55,y-u*1.95,u*0.85,u*0.6,md);TH.ell(c,x+u*0.1,y-u*1.0,u*1.4,u*0.5,'rgba(0,0,0,.2)');
    [[-1.0,0.3],[0.8,0.35]].forEach(([dx,dy])=>{TH.poly(c,[[x+dx*u-u*0.34,y-u*0.95],[x+dx*u+u*0.34,y-u*0.95],[x+dx*u+u*0.3,y+dy*u],[x+dx*u-u*0.3,y+dy*u]],dk);TH.ell(c,x+dx*u,y+dy*u,u*0.42,u*0.14,'#2f2015');for(let k=-1;k<=1;k++)TH.ln(c,[x+dx*u+k*u*0.15+u*0.2,y+dy*u+u*0.05],[x+dx*u+k*u*0.15+u*0.32,y+dy*u+u*0.1],'#e8e0cc',u*0.04);});
    const hy=y-u*1.55+Math.sin((tm||0)*1.2+v)*u*0.05;TH.ell(c,x+u*1.65,hy,u*0.62,u*0.56,md);TH.ell(c,x+u*2.1,hy+u*0.15,u*0.4,u*0.3,lt);TH.ell(c,x+u*2.38,hy+u*0.06,u*0.12,u*0.1,'#1a1410');TH.ell(c,x+u*1.4,hy-u*0.5,u*0.17,u*0.17,md);TH.ell(c,x+u*1.85,hy-u*0.42,u*0.15,u*0.15,dk);TH.ell(c,x+u*1.85,hy-u*0.1,u*0.06,u*0.06,'#111');
    if(v%2){TH.ell(c,x+u*2.35,hy+u*0.42,u*0.55,u*0.12,'#e0746a',-0.35);TH.poly(c,[[x+u*2.8,hy+u*0.3],[x+u*3.0,hy+u*0.1],[x+u*3.0,hy+u*0.5]],'#c9564a');}}},
  deer:{cat:'prop',w:1.5,tier:1,weight:2.5,cost:1,max:1,draw(c,x,y,u,v,tm){const tn='#b88a56',dk='#8a6238';fsh(c,x,y,u*1.7,u*2.5);[[-0.8,0.05],[0.9,0.05]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u+u*0.15,y-u*1.4],[x+dx*u+u*0.1,y+dy*u],dk,u*0.16);});
    TH.ell(c,x,y-u*1.65,u*1.25,u*0.55,tn);TH.ell(c,x-u*0.2,y-u*1.4,u*0.9,u*0.25,'#e6d6b4');[[-0.95,0.05],[0.65,0.1]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u,y-u*1.4],[x+dx*u-u*0.04,y+dy*u],tn,u*0.18);TH.ell(c,x+dx*u-u*0.04,y+dy*u,u*0.14,u*0.07,'#2b1f14');});
    TH.ln(c,[x+u*1.0,y-u*1.8],[x+u*1.5,y-u*3.0],tn,u*0.4);const hy=y-u*3.15+Math.sin((tm||0)*1.5+v)*u*0.04;TH.ell(c,x+u*1.65,hy,u*0.38,u*0.3,tn,0.3);TH.ell(c,x+u*2.0,hy+u*0.1,u*0.2,u*0.14,'#d9c4a0');TH.ell(c,x+u*2.15,hy+u*0.08,u*0.06,u*0.05,'#111');TH.ell(c,x+u*1.62,hy-u*0.35,u*0.1,u*0.2,tn,-0.3);
    c.strokeStyle='#6b4a2b';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x+u*1.6,hy-u*0.25);c.lineTo(x+u*1.3,hy-u*0.85);c.moveTo(x+u*1.45,hy-u*0.55);c.lineTo(x+u*1.1,hy-u*0.55);c.moveTo(x+u*1.35,hy-u*0.75);c.lineTo(x+u*1.65,hy-u*1.1);c.stroke();TH.poly(c,[[x-u*1.25,y-u*1.8],[x-u*1.6,y-u*1.95],[x-u*1.3,y-u*1.55]],'#f1ece0');}},
  beaverDam:{cat:'prop',w:2.4,tier:2,weight:2,cost:1,max:1,draw(c,x,y,u,v,tm){const r=mulberry(v+3),t=tm||0;TH.ell(c,x,y,u*2.6,u*1.1,'#6b5a3a');TH.ell(c,x,y,u*2.4,u*0.98,F.waterD);TH.ell(c,x-u*0.2,y-u*0.05,u*1.9,u*0.74,F.water);c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=u*0.05;const ph=(t*0.35)%1;c.beginPath();c.ellipse(x-u*1.0,y+u*0.2,u*(0.2+ph*0.6),u*(0.1+ph*0.26),0,0,7);c.stroke();
    for(let k=0;k<22;k++){const px=x+u*(1.0+(r()-0.5)*0.4)+k*0.0,py=y+u*(-0.9+k*0.085),L=u*(0.9+r()*0.6);TH.ln(c,[px-L*0.5,py+(r()-0.5)*u*0.1],[px+L*0.5,py+(r()-0.5)*u*0.1-u*0.05],['#6b4a2b','#8a6238','#5a3b22'][k%3],u*0.14);}
    c.beginPath();c.moveTo(x-u*1.9,y-u*0.1);c.quadraticCurveTo(x-u*1.6,y-u*2.2,x-u*0.5,y-u*2.0);c.quadraticCurveTo(x+u*0.3,y-u*1.4,x+u*0.4,y-u*0.1);c.closePath();c.fillStyle='#7a5a38';c.fill();
    for(let k=0;k<26;k++){const a=r()*6.283,rr=Math.sqrt(r());const px=x-u*0.75+Math.cos(a)*u*1.0*rr,py=y-u*0.9+Math.sin(a)*u*0.75*rr;TH.ln(c,[px,py],[px+(r()-0.5)*u*0.9,py+(r()-0.5)*u*0.4],['#5a3b22','#9a7a4a','#6b4a2b'][k%3],u*0.07);}
    TH.ell(c,x-u*0.7,y+u*0.35,u*0.25,u*0.14,'#4a3320');TH.ell(c,x-u*0.45,y+u*0.34,u*0.1,u*0.09,'#4a3320');TH.ell(c,x-u*1.0,y+u*0.42,u*0.2,u*0.07,'#3a2a1a');}},
  logCabin:{cat:'structure',w:2.8,tier:3,weight:3,cost:2,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0;fsh(c,x,y,u*3.2,u*4);
    TH.box(c,x,y,u,-2.2,2.2,-1.6,1.6,0,2.3,'#8a5a33','#6f4524','#a97d49');logWall(c,x,y,u,-2.2,2.2,1.61,0,2.3);logWallE(c,x,y,u,2.21,-1.6,1.6,0,2.3);logEnds(c,x,y,u,-2.2,1.61,0,2.3);logEnds(c,x,y,u,2.2,1.61,0,2.3);
    TH.poly(c,[I(-0.45,1.64,0),I(0.45,1.64,0),I(0.45,1.64,1.6),I(-0.45,1.64,1.6)],'#4a2f1c','#2b1b0e',u*0.05);TH.ell(c,...I(0.3,1.65,0.8),u*0.05,u*0.05,'#e0b53a');
    TH.poly(c,[I(1.0,1.64,0.9),I(1.8,1.64,0.9),I(1.8,1.64,1.7),I(1.0,1.64,1.7)],'#9bd0e8','#4a2f1c',u*0.07);TH.ln(c,I(1.4,1.65,0.9),I(1.4,1.65,1.7),'#4a2f1c',u*0.05);[[0.78,1.0],[2.02,1.8]].forEach(([X,x2])=>TH.poly(c,[I(X,1.65,0.9),I(X+(X<1?0.22:-0.22),1.65,0.9),I(X+(X<1?0.22:-0.22),1.65,1.7),I(X,1.65,1.7)],'#5a3b22'));
    TH.poly(c,[I(2.2,-1.6,2.3),I(2.2,1.6,2.3),I(2.2,0,3.9)],'#7a4d2b');for(let k=0;k<5;k++)TH.ln(c,I(2.21,-1.5+k*0.75,2.3),I(2.21,-0.7+k*0.4+(k%2)*0.0,3.4),'rgba(40,24,10,.0)',1);
    TH.poly(c,[I(-2.7,2.0,2.2),I(2.7,2.0,2.2),I(2.7,0,4.0),I(-2.7,0,4.0)],'#7a5a3a');for(let k=1;k<7;k++){TH.ln(c,I(-2.7,2.0-k*0.285,2.2+k*0.257),I(2.7,2.0-k*0.285,2.2+k*0.257),'rgba(40,24,10,.45)',u*0.06);}TH.ln(c,I(-2.7,2.0,2.2),I(2.7,2.0,2.2),'#4a3320',u*0.14);TH.ln(c,I(-2.7,0,4.0),I(2.7,0,4.0),'#9a7a4a',u*0.14);
    TH.box(c,x,y,u,-1.7,-1.0,-1.1,-0.5,2.0,4.8,'#9aa0a8','#6f747c','#c3c8cf');for(let k=0;k<4;k++){const ph=(t*0.5+k*0.25)%1,tp=I(-1.35,-0.8,4.8);c.fillStyle='rgba(200,200,205,'+(0.5*(1-ph))+')';c.beginPath();c.ellipse(tp[0]+Math.sin(ph*4+k)*u*0.3+ph*u*0.6,tp[1]-ph*u*3.0-u*0.2,u*(0.25+ph*0.5),u*(0.2+ph*0.4),0,0,7);c.fill();}
    TH.box(c,x,y,u,-2.0,2.0,1.7,2.5,0,0.2,'#a97d49','#7d5a34','#c49858');[-1.9,1.9].forEach(X=>TH.ln(c,I(X,2.4,0.2),I(X,2.4,2.1),F.bark,u*0.18));}},
  /* ---------- landmarks ---------- */
  lookoutTower:{cat:'landmark',w:2.3,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);fsh(c,x,y,u*2.4,u*9);const H=9.0;
    const legs=[[-1.9,-1.4],[1.9,-1.4],[-1.9,1.4],[1.9,1.4]],top=(X,Y)=>[X*0.55,Y*0.55];legs.slice(0,2).forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(top(X,Y)[0],top(X,Y)[1],H),F.woodD,u*0.3));
    for(let k=1;k<5;k++){const f=k/5,z=H*f,s=1-0.45*f;TH.ln(c,I(-1.9*s,1.4*s,z),I(1.9*s,1.4*s,z),F.woodD,u*0.14);TH.ln(c,I(1.9*s,-1.4*s,z),I(1.9*s,1.4*s,z),F.woodD,u*0.14);}
    for(let k=0;k<4;k++){const f0=k/5,f1=(k+1)/5,s0=1-0.45*f0,s1=1-0.45*f1;TH.ln(c,I(-1.9*s0,1.4*s0,H*f0),I(1.9*s1,1.4*s1,H*f1),F.wood,u*0.1);TH.ln(c,I(1.9*s0,1.4*s0,H*f0),I(-1.9*s1,1.4*s1,H*f1),F.wood,u*0.1);}
    legs.slice(2).forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(top(X,Y)[0],top(X,Y)[1],H),F.wood,u*0.34));
    for(let k=0;k<7;k++){const f=k/7;TH.ln(c,I(-1.2+f*0.2,1.5,H*f),I(-0.6+f*0.2,1.5,H*(f+0.15)),'#c9a56a',u*0.08);}
    const cs=1.5;TH.box(c,x,y,u,-cs-0.3,cs+0.3,-cs-0.3,cs+0.3,H,H+0.25,'#a97d49','#7d5a34','#c49858');TH.box(c,x,y,u,-cs,cs,-cs,cs,H+0.25,H+1.8,'#b88a56','#8a6238','#d6a86a');
    [[-1.1,-0.2],[0.2,1.1]].forEach(([a,b])=>TH.poly(c,[I(a,cs+0.01,H+0.7),I(b,cs+0.01,H+0.7),I(b,cs+0.01,H+1.5),I(a,cs+0.01,H+1.5)],'#9bd0e8','#4a2f1c',u*0.05));TH.poly(c,[I(cs+0.01,-1.1,H+0.7),I(cs+0.01,1.1,H+0.7),I(cs+0.01,1.1,H+1.5),I(cs+0.01,-1.1,H+1.5)],'#9bd0e8','#4a2f1c',u*0.05);
    const ap=I(0,0,H+3.3);TH.poly(c,[I(-cs-0.4,cs+0.4,H+1.8),I(cs+0.4,cs+0.4,H+1.8),ap],'#5a3b22');TH.poly(c,[I(cs+0.4,-cs-0.4,H+1.8),I(cs+0.4,cs+0.4,H+1.8),ap],'#3f2815');TH.ln(c,ap,[ap[0],ap[1]-u*1.0],'#d5dae6',u*0.08);
    TH.poly(c,[[ap[0],ap[1]-u*1.0],[ap[0]+u*1.1,ap[1]-u*0.8+Math.sin((tm||0)*3)*u*0.1],[ap[0],ap[1]-u*0.5]],'#d9342b');}},
  waterfallCliff:{cat:'landmark',w:3.2,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const r=mulberry(v+4),t=tm||0,H=u*6.0,wt=u*2.7,wb=u*3.4;fsh(c,x,y,u*3.4,u*7);
    fcrag(c,x,y,u,{wt:wt,wb:wb,H:H,seed:v+2,bands:['#8a8f96','#7a7f87','#9a9fa6','#6f747c','#858a92','#7a7f87'],top:'#6f8a5a'});
    const fx=x-u*0.3,top=y-H+wt*0.42*0.9,bot=y+wb*0.42*0.9;c.save();c.beginPath();c.moveTo(fx-u*0.55,top);c.lineTo(fx+u*0.55,top);c.lineTo(fx+u*0.8,bot);c.lineTo(fx-u*0.8,bot);c.closePath();const g=c.createLinearGradient(fx,top,fx,bot);g.addColorStop(0,'#eaf6ff');g.addColorStop(1,'#bfe3f5');c.fillStyle=g;c.fill();c.clip();
    for(let k=0;k<7;k++){const ph=(t*1.4+k*0.31)%1;c.strokeStyle='rgba(255,255,255,'+(0.35+0.3*(1-ph))+')';c.lineWidth=u*0.06;const sx=fx-u*0.45+k*u*0.15;c.beginPath();c.moveTo(sx,top+(bot-top)*ph*0.7);c.lineTo(sx+(k-3)*u*0.02,top+(bot-top)*(ph*0.7+0.3));c.stroke();}c.restore();
    TH.ell(c,fx,bot+u*0.35,u*2.2,u*0.8,'#2f7fa8');TH.ell(c,fx,bot+u*0.3,u*1.9,u*0.66,'#4aa0c8');for(let k=0;k<7;k++){const ph=(t*0.9+k*0.2)%1;c.fillStyle='rgba(255,255,255,'+(0.55*(1-ph))+')';c.beginPath();c.ellipse(fx+(r()-0.5)*u*1.4,bot+u*0.2+ph*u*0.2,u*(0.3+ph*0.4),u*(0.14+ph*0.18),0,0,7);c.fill();}
    for(let k=0;k<4;k++){const ph=(t*0.5+k*0.25)%1;c.fillStyle='rgba(235,245,250,'+(0.3*(1-ph))+')';c.beginPath();c.ellipse(fx+(k-1.5)*u*0.5,bot-ph*u*1.6,u*(0.5+ph*0.6),u*(0.3+ph*0.4),0,0,7);c.fill();}
    [[-1.5,0.1],[0.6,-0.1],[1.4,0.2]].forEach(([dx,dy],i)=>frFir(c,x+dx*u,y-H+dy*u+wt*0.1,u*0.55,0.7+i*0.05,v+i));for(let k=0;k<5;k++)TH.blob(c,x+(r()-0.5)*wb*2.1,y+wb*0.25+r()*u*0.5,u*(0.35+r()*0.3),u*0.2,'#6f747c',r,7);}},
  mountainPeak:{cat:'landmark',w:4.0,tier:3,weight:3,cost:4,draw(c,x,y,u,v){const r=mulberry(v+6);fsh(c,x,y,u*4.2,u*10);const peak=(px,base,hw,H,snowF)=>{const ap=[px,base-H],L=[px-hw,base],Rr=[px+hw,base],M=[px+hw*0.08,base+hw*0.16];
      TH.poly(c,[L,ap,M],'#8e949c');TH.poly(c,[M,ap,Rr],'#575d68');c.strokeStyle='rgba(25,32,44,.35)';c.lineWidth=u*0.07;c.beginPath();c.moveTo(ap[0],ap[1]);c.lineTo(px-hw*0.4,base-H*0.3);c.moveTo(ap[0],ap[1]);c.lineTo(px+hw*0.25,base-H*0.15);c.moveTo(px-hw*0.25,base-H*0.62);c.lineTo(px-hw*0.55,base-H*0.4);c.stroke();
      const sy=base-H*(1-snowF);const sw=(f)=>hw*(1-f);TH.poly(c,[ap,[px-hw*snowF*1.0,sy],[px-hw*snowF*0.6,sy+H*0.07],[px-hw*snowF*0.3,sy-H*0.02],[px+hw*0.05,sy+H*0.09],[px+hw*snowF*0.4,sy+H*0.02],[px+hw*snowF*0.8,sy+H*0.08],[px+hw*snowF*1.0,sy]],'#f4f8fc');
      TH.poly(c,[ap,[px+hw*0.08,sy+H*0.09],[px+hw*snowF*0.4,sy+H*0.02],[px+hw*snowF*0.8,sy+H*0.08],[px+hw*snowF*1.0,sy]],'#c9d6e4');};
    peak(x+u*3.0,y,u*3.0,u*6.5,0.4);peak(x-u*0.5,y,u*4.6,u*10,0.38);
    TH.ell(c,x,y,u*5.2,u*1.6,'#566e42');[[-4.2,0.5,1.5],[3.8,0.6,1.3],[-2.0,0.9,1.0],[1.6,1.0,1.1]].forEach(([dx,dy,s])=>TH.blob(c,x+dx*u,y+dy*u,u*s*1.4,u*s*0.6,'#4a6e48',r,8));[[-3.4,0.8],[-2.6,1.1],[2.7,0.9],[3.5,0.7],[0.4,1.2]].forEach(([dx,dy],i)=>frFir(c,x+dx*u,y+dy*u,u*0.5,0.8+(i%2)*0.15,v+i));}},
  sawmill:{cat:'landmark',w:3.7,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0,r=mulberry(v+3);fsh(c,x,y,u*3.8,u*6);
    TH.poly(c,[I(2.4,-2.6,0.12),I(5.2,-2.6,0.12),I(5.2,2.4,0.12),I(2.4,2.4,0.12)],'#3f7a9a');TH.poly(c,[I(2.7,-2.4,0.14),I(5.0,-2.4,0.14),I(5.0,2.2,0.14),I(2.7,2.2,0.14)],'#4aa0c8');
    TH.box(c,x,y,u,-3.0,2.4,-2.0,2.0,0,3.0,'#9a6a3c','#6f4a28','#b07a46');logWall(c,x,y,u,-3.0,2.4,2.01,0,3.0);logWallE(c,x,y,u,2.41,-2.0,2.0,0,3.0);
    TH.poly(c,[I(-2.2,2.03,0),I(0.2,2.03,0),I(0.2,2.03,2.2),I(-2.2,2.03,2.2)],'#1c130c');for(let k=0;k<3;k++)TH.ln(c,I(-2.0+k*0.9,2.04,0.4),I(-1.8+k*0.9,2.04,2.0),'rgba(200,200,205,.2)',u*0.05);
    TH.ln(c,I(-2.2,2.2,0.4),I(0.2,2.2,0.4),'#5a5f68',u*0.12);TH.box(c,x,y,u,-1.8,-0.2,2.1,2.6,0.4,0.8,'#7a7f87','#555a62','#9aa0a8');TH.ell(c,...I(-1.0,2.3,1.3),u*0.65,u*0.7,'#c9ced6');TH.ell(c,...I(-1.0,2.3,1.3),u*0.12,u*0.12,'#555a62');
    TH.poly(c,[I(-3.4,2.4,2.9),I(2.8,2.4,2.9),I(2.8,0,5.0),I(-3.4,0,5.0)],'#6b4a2b');for(let k=1;k<6;k++)TH.ln(c,I(-3.4,2.4-k*0.4,2.9+k*0.35),I(2.8,2.4-k*0.4,2.9+k*0.35),'rgba(30,18,6,.45)',u*0.06);TH.poly(c,[I(2.4,-2.0,3.0),I(2.4,2.0,3.0),I(2.4,0,4.9)],'#8a5a33');
    const wc=[2.9,0,2.6],R0=2.3,a0=t*0.8;const pt=(a,rr)=>I(wc[0],rr*Math.cos(a),wc[2]+rr*Math.sin(a));c.strokeStyle='#4a3320';c.lineWidth=u*0.3;c.beginPath();for(let k=0;k<=32;k++){const p=pt(k/32*6.283,R0);k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();c.strokeStyle='#8a5a33';c.lineWidth=u*0.16;c.stroke();
    for(let k=0;k<8;k++){const a=a0+k*0.7854;TH.ln(c,pt(a,0),pt(a,R0),'#6b4a2b',u*0.16);const p=pt(a,R0),q=pt(a+0.22,R0+0.45);TH.poly(c,[p,q,pt(a+0.46,R0)],'#a97d49','#4a3320',u*0.04);}TH.ell(c,...pt(0,0),u*0.28,u*0.28,'#2b1b0e');
    for(let k=0;k<3;k++){const ph=(t*0.7+k*0.33)%1;TH.ln(c,I(3.9+ph*0.6,-2.3+ph*0.4,5.2-ph*3.3),I(4.3+ph*0.6,-2.0+ph*0.4,5.0-ph*3.3),'rgba(235,248,255,.6)',u*0.1);}TH.poly(c,[I(3.5,-2.6,5.2),I(4.6,-2.6,5.2),I(4.6,-1.6,3.4),I(3.5,-1.6,3.4)],'rgba(160,110,60,.5)');
    for(let row=0;row<3;row++)for(let col=0;col<4-row;col++)TH.ln(c,I(-3.4+col*0.62+row*0.3,3.0-row*0.1,0.3+row*0.5),I(-1.9+col*0.62+row*0.3,3.0-row*0.1,0.3+row*0.5),['#9a6a3c','#8a5a33'][(row+col)%2],u*0.46);}},
  stockadeFort:{cat:'landmark',w:4.5,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0,S=3.6,wh=3.4;fsh(c,x,y,u*4.8,u*6);TH.poly(c,[I(-S,-S,0.03),I(S,-S,0.03),I(S,S,0.03),I(-S,S,0.03)],'#a98b62');
    const wallY=(Y,x0,x1,col)=>{for(let X=x0;X<=x1;X+=0.36){const b=I(X,Y,0),tp=I(X,Y,wh);TH.ln(c,b,tp,col,u*0.3);TH.poly(c,[[tp[0]-u*0.17,tp[1]],[tp[0]+u*0.17,tp[1]],[tp[0],tp[1]-u*0.45]],col);}};
    const wallX=(X,y0,y1,col)=>{for(let Y=y0;Y<=y1;Y+=0.36){const b=I(X,Y,0),tp=I(X,Y,wh);TH.ln(c,b,tp,col,u*0.3);TH.poly(c,[[tp[0]-u*0.17,tp[1]],[tp[0]+u*0.17,tp[1]],[tp[0],tp[1]-u*0.45]],col);}};
    const tower=(X,Y,col)=>{TH.box(c,x,y,u,X-0.8,X+0.8,Y-0.8,Y+0.8,0,4.6,'#9a6a3c','#6f4a28','#b07a46');logWall(c,x,y,u,X-0.8,X+0.8,Y+0.81,0,4.6);logWallE(c,x,y,u,X+0.81,Y-0.8,Y+0.8,0,4.6);TH.box(c,x,y,u,X-1.0,X+1.0,Y-1.0,Y+1.0,4.6,4.9,'#a97d49','#7d5a34','#c49858');const ap=I(X,Y,6.4);TH.poly(c,[I(X-1.1,Y+1.1,4.9),I(X+1.1,Y+1.1,4.9),ap],'#5a3b22');TH.poly(c,[I(X+1.1,Y-1.1,4.9),I(X+1.1,Y+1.1,4.9),ap],'#3f2815');TH.poly(c,[I(X-0.3,Y+0.82,3.4),I(X+0.3,Y+0.82,3.4),I(X+0.3,Y+0.82,4.2),I(X-0.3,Y+0.82,4.2)],'#161a22');};
    wallY(-S,-S,S,'#7d5a34');wallX(-S,-S,S,'#6f4a28');tower(-S,-S);
    TH.box(c,x,y,u,-2.3,-0.6,-2.2,-0.6,0,1.7,'#9a6a3c','#6f4a28','#b07a46');TH.poly(c,[I(-2.5,-0.4,1.6),I(-0.4,-0.4,1.6),I(-0.4,-1.4,2.8),I(-2.5,-1.4,2.8)],'#5a3b22');TH.poly(c,[I(-0.4,-2.4,1.6),I(-0.4,-0.4,1.6),I(-0.4,-1.4,2.8)],'#7a5a3a');
    TH.box(c,x,y,u,0.6,2.2,-2.3,-0.9,0,1.5,'#9a6a3c','#6f4a28','#b07a46');TH.poly(c,[I(0.4,-0.7,1.4),I(2.4,-0.7,1.4),I(2.4,-1.6,2.5),I(0.4,-1.6,2.5)],'#6b4a2b');
    const fp=I(0.6,0.2,0);TH.ln(c,fp,[fp[0],fp[1]-u*6.2],'#d5dae6',u*0.1);const wv=Math.sin(t*3)*u*0.12;TH.poly(c,[[fp[0],fp[1]-u*6.2],[fp[0]+u*1.6,fp[1]-u*6.0+wv],[fp[0]+u*1.2,fp[1]-u*5.6+wv*1.3],[fp[0]+u*1.6,fp[1]-u*5.2+wv],[fp[0],fp[1]-u*5.3]],'#2f4f8f');
    tower(S,-S);wallX(S,-S,S,'#7d5a34');tower(-S,S);
    wallY(S,-S,-1.0,'#8a6238');wallY(S,1.0,S,'#8a6238');TH.poly(c,[I(-1.0,S+0.01,0),I(1.0,S+0.01,0),I(1.0,S+0.01,2.8),I(-1.0,S+0.01,2.8)],'#140f0a');[-1,1].forEach(s=>{TH.poly(c,[I(s*1.0,S+0.02,0),I(s*0.45,S+0.5,0),I(s*0.45,S+0.5,2.7),I(s*1.0,S+0.02,2.7)],'#6b4a2b','#3b2616',u*0.05);});TH.ln(c,I(-1.0,S+0.05,2.9),I(1.0,S+0.05,2.9),F.woodD,u*0.3);
    tower(S,S);const f1=I(S,S,6.4);TH.ln(c,f1,[f1[0],f1[1]-u*1.2],'#d5dae6',u*0.08);TH.poly(c,[[f1[0],f1[1]-u*1.2],[f1[0]+u*1.1,f1[1]-u*1.0+Math.sin(t*3+1)*u*0.1],[f1[0],f1[1]-u*0.7]],'#b3342f');}}
  }};
const FRONTIER_HEIGHT={berryBush:'low',fernPatch:'low',cattails:'low',fallenLog:'low',boulders:'low',campfire:'low',canoe:'low',fishRack:'low',firewood:'low',railFence:'low',footbridge:'low',beaverDam:'low',deer:'low',
  pineTree:'mid',firGrove:'mid',aspenTree:'mid',trapperTent:'mid',bear:'mid',logCabin:'mid',lookoutTower:'tall',waterfallCliff:'tall',mountainPeak:'tall',sawmill:'tall',stockadeFort:'tall'};
Object.keys(FRONTIER_PACK.assets).forEach(id=>{FRONTIER_PACK.assets[id].h=FRONTIER_HEIGHT[id]||'low';});
const KEEP_OUT={rx:0.52,ry:0.34};   // central ellipse (x R) reserved for the ride or building sprite
function placeThemeAssets(pack,tier,R,seed){
  const rnd=mulberry(seed*7919+tier*131), u=R*0.068, T=pack.tiers[tier], out=[], decals=[], TAU=Math.PI*2;
  if(!T)return {assets:out,decals,u};
  const inside=(x,y,k)=>{const X=Math.abs(x)/R,Y=Math.abs(y)/(0.58*R);return X<=0.866*k&&Y<=k-X/1.732;};
  const ids=Object.keys(pack.assets), cnt={};
  const free=(x,y,w)=>out.every(o=>Math.hypot(o.x-x,(o.y-y)*1.7)>(o.w+w)*u*0.8);
  const clearOfCenter=(x,y,w,h)=>{const kx=h==='tall'?0.28:0.75,ky=h==='tall'?0.18:0.4,ex=R*KEEP_OUT.rx+w*u*kx,ey=R*KEEP_OUT.ry+w*u*ky;return x*x/(ex*ex)+y*y/(ey*ey)>1;};
  const zoneOK=(a,x,y)=>{const h=a.h||'low';if(h==='low')return true;const ax=Math.abs(x)/R;
    if(h==='tall')return y<R*0.12&&ax>(y>=-R*0.12?0.55:0.4);
    if(y>R*0.12)return h==='mid'&&ax>0.5;if(y>=-R*0.12)return h==='mid'||ax>0.55;return true;};
  const ringPoint=(tmax)=>{const th=rnd()*TAU,dx=Math.cos(th),dy=Math.sin(th);let lo=0,hi=R*1.2;
    for(let i=0;i<12;i++){const m=(lo+hi)/2;if(inside(dx*m,dy*m,0.9))lo=m;else hi=m;}const t=0.5+rnd()*((tmax||1)-0.5);return[dx*lo*t,dy*lo*t];};
  const spot=a=>{for(let i=0;i<120;i++){const p=ringPoint(a.h==='tall'?0.8:a.h==='mid'?0.92:1);if(clearOfCenter(p[0],p[1],a.w,a.h)&&zoneOK(a,p[0],p[1])&&free(p[0],p[1],a.w))return p;}return null;};
  const add=(id,x,y)=>{const a=pack.assets[id];out.push({id,x,y,v:Math.floor(rnd()*1000),w:a.w});cnt[id]=(cnt[id]||0)+1;};
  for(let i=0;i<T.decals;i++){const pool=ids.filter(id=>pack.assets[id].cat==='decal'&&pack.assets[id].tier<=tier),id=pool[Math.floor(rnd()*pool.length)];
    for(let t=0;t<40;t++){const p=ringPoint();if(clearOfCenter(p[0],p[1],pack.assets[id].w*0.5)){decals.push({id,x:p[0],y:p[1],v:Math.floor(rnd()*1000)});break;}}}
  let budget=T.budget;
  const land=()=>{let id=T.pool[Math.floor(rnd()*T.pool.length)];for(let q=0;q<8&&cnt[id];q++)id=T.pool[Math.floor(rnd()*T.pool.length)];
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}};
  if(T.pool.length&&rnd()<T.landmark){land();if(T.second&&rnd()<T.second)land();}
  let guard=0;while(budget>0&&guard++<500){const pool=ids.filter(id=>{const a=pack.assets[id];return a.cat!=='decal'&&a.cat!=='landmark'&&a.tier<=tier&&a.cost<=budget&&(cnt[id]||0)<(a.max||3);});
    if(!pool.length)break;let tot=0;pool.forEach(id=>tot+=pack.assets[id].weight);let pick=rnd()*tot,id=pool[0];for(const q of pool){pick-=pack.assets[q].weight;if(pick<=0){id=q;break;}}
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}else{cnt[id]=99;}}
  return {assets:out,decals,u};
}
function drawThemeGround(ctx,cx,cy,R,pack,border){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);ctx[i?'lineTo':'moveTo'](cx+R*Math.cos(a),cy+R*Math.sin(a)*0.58);}ctx.closePath();
  ctx.fillStyle=pack.ground;ctx.fill();if(border!==false){ctx.lineWidth=Math.max(1.5,R*0.03);ctx.strokeStyle=border||pack.border;ctx.stroke();}}
function drawThemeDecals(ctx,cx,cy,pack,pl,tm){pl.decals.forEach(d=>pack.assets[d.id].draw(ctx,cx+d.x,cy+d.y,pl.u,d.v,tm||0));}
/* layer: 'back' (y<0, draw BEFORE the ride sprite), 'front' (y>=0, draw AFTER it) or omit for all, sorted by y */
function drawThemeAssets(ctx,cx,cy,pack,pl,tm,layer){pl.assets.filter(o=>layer==='back'?o.y<0:layer==='front'?o.y>=0:true).sort((a,b)=>a.y-b.y).forEach(o=>pack.assets[o.id].draw(ctx,cx+o.x,cy+o.y,pl.u,o.v,tm||0));}
function drawThemedTile(ctx,cx,cy,R,pack,tier,seed,tm,border,rideFn){drawThemeGround(ctx,cx,cy,R,pack,border);const pl=placeThemeAssets(pack,tier,R,seed);
  drawThemeDecals(ctx,cx,cy,pack,pl,tm);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'back');if(rideFn)rideFn(ctx,cx,cy,R);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'front');}
return { pack: FRONTIER_PACK, placeThemeAssets, drawThemeGround, drawThemeDecals, drawThemeAssets };
})();

const WESTERN_THEME_PACK = (() => {
/* ===== THEME PACK CORE (shared by every theme pack; copy once into engine.js) ===== */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shade(hex, amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=c=>Math.round(amt<0?c*(1+amt):c+(255-c)*amt);return `rgb(${f(r)},${f(g)},${f(b)})`;}
const TH={
  ln(ctx,a,b,c,w){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();},
  ell(ctx,x,y,rx,ry,c,rot){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot||0,0,7);ctx.fill();},
  poly(ctx,pts,fill,stroke,lw){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||1;ctx.stroke();}},
  shadow(ctx,x,y,rx,h){ctx.fillStyle='rgba(70,40,10,.2)';ctx.beginPath();ctx.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);ctx.fill();},
  iso(x,y,u,X,Y,Z){return[x+(X-Y)*0.7*u,y+(X+Y)*0.35*u-Z*u];},
  box(ctx,x,y,u,x0,x1,y0,y1,z0,z1,cf,ce,ct){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);
    TH.poly(ctx,[I(x0,y1,z0),I(x1,y1,z0),I(x1,y1,z1),I(x0,y1,z1)],cf);TH.poly(ctx,[I(x1,y0,z0),I(x1,y1,z0),I(x1,y1,z1),I(x1,y0,z1)],ce);
    TH.poly(ctx,[I(x0,y0,z1),I(x1,y0,z1),I(x1,y1,z1),I(x0,y1,z1)],ct);},
  blob(ctx,x,y,rx,ry,col,rnd,n){const pts=[];n=n||8;for(let k=0;k<n;k++){const a=k/n*6.283,rr=0.78+rnd()*0.3;pts.push([x+Math.cos(a)*rx*rr,y+Math.sin(a)*ry*rr]);}
    TH.poly(ctx,pts,col);ctx.fillStyle='rgba(255,240,210,.22)';ctx.beginPath();ctx.ellipse(x-rx*0.25,y-ry*0.3,rx*0.45,ry*0.35,0,0,7);ctx.fill();
    ctx.fillStyle='rgba(50,20,10,.22)';ctx.beginPath();ctx.ellipse(x+rx*0.35,y+ry*0.25,rx*0.4,ry*0.5,0,0,7);ctx.fill();}
};
/* layered sandstone body used by mesas, buttes and arches */
function rockBody(ctx,x,y,u,o){const wt=o.wt,wb=o.wb,H=o.H,r=mulberry(o.seed),n=o.bands.length;
  TH.ell(ctx,x,y,wb*1.12,wb*0.48,'#dcb88e');
  ctx.save();ctx.beginPath();ctx.moveTo(x-wt,y-H);ctx.lineTo(x-wb,y);ctx.ellipse(x,y,wb,wb*0.42,0,Math.PI,0,true);ctx.lineTo(x+wt,y-H);ctx.ellipse(x,y-H,wt,wt*0.42,0,0,Math.PI);ctx.closePath();ctx.clip();
  const Hh=H+wb*0.42;for(let j=0;j<n;j++){ctx.fillStyle=o.bands[j];ctx.fillRect(x-wb-2,y-H+Hh*j/n,wb*2+4,Hh/n+1);}
  const g=ctx.createLinearGradient(x-wb,0,x+wb,0);g.addColorStop(0,'rgba(255,230,200,.25)');g.addColorStop(0.45,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(60,15,5,.55)');
  ctx.fillStyle=g;ctx.fillRect(x-wb-2,y-H-2,wb*2+4,Hh+4);
  for(let k=0;k<7;k++){const fx=x+(r()*2-1)*wt*0.92,bx=x+(fx-x)*wb/wt;ctx.strokeStyle='rgba(80,30,15,.32)';ctx.lineWidth=u*0.07;ctx.beginPath();
    ctx.moveTo(fx,y-H+wt*0.25);ctx.quadraticCurveTo((fx+bx)/2+u*0.12,y-H/2,bx,y+wb*0.3);ctx.stroke();
    ctx.strokeStyle='rgba(255,220,180,.18)';ctx.lineWidth=u*0.05;ctx.beginPath();ctx.moveTo(fx+u*0.12,y-H+wt*0.25);ctx.quadraticCurveTo((fx+bx)/2+u*0.24,y-H/2,bx+u*0.12,y+wb*0.3);ctx.stroke();}
  ctx.restore();
  TH.ell(ctx,x,y-H,wt,wt*0.42,o.top||'#cf8a5a');ctx.strokeStyle='rgba(90,40,20,.45)';ctx.lineWidth=u*0.08;ctx.beginPath();ctx.ellipse(x,y-H,wt,wt*0.42,0,0,7);ctx.stroke();
  for(let k=0;k<(o.scrub||4);k++){const a=r()*6.283,rr=r()*0.6;TH.ell(ctx,x+Math.cos(a)*wt*rr,y-H+Math.sin(a)*wt*0.42*rr,u*0.2,u*0.13,'#7f8f5c');}
}
/* ===== WILD WEST PACK ===== */
const WEST_BANDS=['#c8693a','#b5532f','#d9885a','#a8472b','#e0a070','#b5532f','#cf7a46'];
const WESTERN_PACK={id:'western',name:'Wild West',ground:'#e5d2a3',groundDark:'#cdb583',border:'#b49b66',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},
         3:{budget:11,decals:4,landmark:0.75,pool:['butte','windmill','waterTower']},
         4:{budget:15,decals:5,landmark:1,pool:['mesa','arch','butte','oilDerrick','windmill','waterTower'],second:0.45}},
  assets:{
  /* ---------- ground decals (flat) ---------- */
  sandDrift:{cat:'decal',w:2.6,tier:1,weight:3,cost:0,draw(c,x,y,u,v){const r=mulberry(v+3);TH.ell(c,x,y,u*2.6,u*1.15,'#efdfb6');TH.ell(c,x-u*0.3,y-u*0.1,u*1.7,u*0.7,'#f4e8c4');
    for(let k=0;k<4;k++){c.strokeStyle='rgba(160,125,70,.35)';c.lineWidth=u*0.06;c.beginPath();c.ellipse(x+(r()-0.5)*u,y+(k-1.5)*u*0.25,u*(1.8-k*0.2),u*0.3,0,Math.PI*1.1,Math.PI*1.9);c.stroke();}}},
  crackedEarth:{cat:'decal',w:2.2,tier:1,weight:2,cost:0,draw(c,x,y,u,v){const r=mulberry(v+11);TH.ell(c,x,y,u*2.2,u*1.0,'#d4bb86');c.strokeStyle='#9f8150';c.lineWidth=u*0.07;c.lineCap='round';
    for(let k=0;k<9;k++){let px=x+(r()-0.5)*u*1.6,py=y+(r()-0.5)*u*0.7;c.beginPath();c.moveTo(px,py);for(let s=0;s<4;s++){px+=(r()-0.5)*u*0.9;py+=(r()-0.5)*u*0.4;c.lineTo(px,py);}c.stroke();}}},
  gravelPatch:{cat:'decal',w:2,tier:1,weight:2,cost:0,draw(c,x,y,u,v){const r=mulberry(v+5);TH.ell(c,x,y,u*2,u*0.9,'#d6c294');
    for(let k=0;k<26;k++){const a=r()*6.283,rr=Math.sqrt(r());TH.ell(c,x+Math.cos(a)*u*1.8*rr,y+Math.sin(a)*u*0.8*rr,u*0.1,u*0.07,['#a8946a','#c4ae80','#8d7a55'][k%3]);}}},
  dryStream:{cat:'decal',w:3,tier:2,weight:1.5,cost:0,draw(c,x,y,u,v){const r=mulberry(v+9);c.strokeStyle='#cdb27a';c.lineWidth=u*0.95;c.lineCap='round';c.lineJoin='round';c.beginPath();
    c.moveTo(x-u*3,y-u*0.5);c.bezierCurveTo(x-u*1.5,y+u*0.5,x-u*0.2,y-u*0.8,x+u*3,y+u*0.4);c.stroke();c.strokeStyle='#b99d63';c.lineWidth=u*0.18;c.beginPath();
    c.moveTo(x-u*3,y-u*0.1);c.bezierCurveTo(x-u*1.5,y+u*0.9,x-u*0.2,y-u*0.4,x+u*3,y+u*0.8);c.stroke();
    for(let k=0;k<8;k++)TH.ell(c,x+(r()*2-1)*u*2.4,y+(r()*2-1)*u*0.4,u*0.1,u*0.07,'#8f7a52');}},
  /* ---------- plants ---------- */
  sagebrush:{cat:'plant',w:1.4,tier:1,weight:4,cost:1,draw(c,x,y,u,v){const r=mulberry(v*17+1);TH.shadow(c,x,y,u*1.3,u);
    for(let k=0;k<5;k++)TH.ln(c,[x+(r()-0.5)*u,y],[x+(r()-0.5)*u*1.6,y-u*0.6],'#8a6f45',u*0.07);
    [[-0.7,-0.6,0.8,'#7e977c'],[0.7,-0.55,0.75,'#8da58a'],[0,-1.0,0.95,'#9fb596'],[-0.2,-0.5,0.85,'#86a081']].forEach(([dx,dy,s,col])=>TH.ell(c,x+dx*u,y+dy*u,u*s,u*s*0.7,col));
    for(let k=0;k<6;k++)TH.ell(c,x+(r()-0.5)*u*1.8,y-u*(0.4+r()*0.8),u*0.09,u*0.06,'#cfdcc4');}},
  tumbleweed:{cat:'plant',w:0.95,tier:1,weight:3,cost:1,draw(c,x,y,u,v){const r=mulberry(v*7+2),cy=y-u*0.85;TH.shadow(c,x,y,u*0.9,u);TH.ell(c,x,cy,u*0.9,u*0.9,'rgba(205,185,140,.55)');
    c.strokeStyle='#8f7448';c.lineWidth=u*0.06;c.lineCap='round';for(let k=0;k<16;k++){const a=r()*6.283,b=r()*6.283;c.beginPath();c.moveTo(x+Math.cos(a)*u*0.85,cy+Math.sin(a)*u*0.85);
      c.quadraticCurveTo(x+(r()-0.5)*u*0.8,cy+(r()-0.5)*u*0.8,x+Math.cos(b)*u*0.85,cy+Math.sin(b)*u*0.85);c.stroke();}}},
  dryGrass:{cat:'plant',w:0.9,tier:1,weight:4,cost:1,draw(c,x,y,u,v){const r=mulberry(v*5+4);for(let k=0;k<9;k++){const a=-1.9+k*0.28+(r()-0.5)*0.2,len=u*(0.9+r()*0.8);
    c.strokeStyle=['#c9a94f','#b39438','#d8bc6a'][k%3];c.lineWidth=u*0.09;c.lineCap='round';c.beginPath();c.moveTo(x+(k-4)*u*0.07,y);c.quadraticCurveTo(x+Math.cos(a)*len*0.5,y+Math.sin(a)*len*0.7,x+Math.cos(a)*len*0.9+u*0.15,y+Math.sin(a)*len);c.stroke();}}},
  agave:{cat:'plant',w:1.5,tier:1,weight:3,cost:1,draw(c,x,y,u,v){const N=11,cy=y-u*0.35;TH.shadow(c,x,y,u*1.5,u);const L=[];for(let k=0;k<N;k++){const a=k/N*6.283+v;L.push({a,s:Math.sin(a)});}
    L.sort((p,q)=>p.s-q.s).forEach(l=>{const tx=x+Math.cos(l.a)*u*2.0,ty=cy+l.s*u*0.85-u*1.0,bx=Math.cos(l.a+1.57)*u*0.28,by=Math.sin(l.a+1.57)*u*0.12;
      TH.poly(c,[[x+bx,cy+by],[tx,ty],[x-bx,cy-by]],l.s>0?'#6f9f94':'#5b8f86','#3f6b63',u*0.04);c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=u*0.04;c.beginPath();c.moveTo(x,cy);c.lineTo(tx,ty);c.stroke();});
    TH.ell(c,x,cy-u*0.2,u*0.25,u*0.2,'#4b7a72');}},
  yucca:{cat:'plant',w:1.5,tier:2,weight:2.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*3+8),cy=y-u*0.3;TH.shadow(c,x,y,u*1.4,u*2);
    TH.ln(c,[x,cy],[x+u*0.1,y-u*4.2],'#8a7a55',u*0.14);for(let k=0;k<7;k++)TH.ell(c,x+u*0.1+(r()-0.5)*u*0.3,y-u*(3.0+k*0.22),u*0.17,u*0.12,'#f4f1e2');
    for(let k=0;k<15;k++){const a=-Math.PI*(0.08+0.84*k/14),len=u*(1.6+r()*0.8);TH.ln(c,[x,cy],[x+Math.cos(a)*len*1.15,cy+Math.sin(a)*len*0.9],k%2?'#7a9a5a':'#68894c',u*0.1);}}},
  barrelCactus:{cat:'cactus',w:1.0,tier:1,weight:3,cost:1,draw(c,x,y,u,v){const cy=y-u*0.9;TH.shadow(c,x,y,u*1.0,u*1.5);TH.ell(c,x,y-u*0.15,u*1.05,u*0.45,'#2c5d34');TH.ell(c,x,cy,u*1.0,u*0.95,'#4f9150');
    c.save();c.beginPath();c.ellipse(x,cy,u*1.0,u*0.95,0,0,7);c.clip();for(let k=-3;k<=3;k++){c.strokeStyle='rgba(20,60,30,.4)';c.lineWidth=u*0.06;c.beginPath();c.ellipse(x+k*u*0.28,cy,Math.abs(k)*u*0.08+u*0.05,u*0.95,0,0,7);c.stroke();}
    const g=c.createLinearGradient(x-u,0,x+u,0);g.addColorStop(0,'rgba(200,255,200,.28)');g.addColorStop(1,'rgba(10,40,20,.4)');c.fillStyle=g;c.fillRect(x-u,cy-u,u*2,u*2);c.restore();
    for(let k=-2;k<=2;k++){TH.ell(c,x+k*u*0.3,cy-u*0.4+Math.abs(k)*u*0.12,u*0.05,u*0.05,'#f5e9a8');TH.ell(c,x+k*u*0.3,cy+u*0.1,u*0.05,u*0.05,'#f5e9a8');}
    TH.ell(c,x,cy-u*0.82,u*0.35,u*0.17,'#f472b6');TH.ell(c,x,cy-u*0.86,u*0.18,u*0.09,'#fde047');}},
  pricklyPear:{cat:'cactus',w:1.5,tier:2,weight:3,cost:1,draw(c,x,y,u,v){const r=mulberry(v*9+6);TH.shadow(c,x,y,u*1.6,u*2);
    const pad=(px,py,rot,s)=>{c.save();c.translate(px,py);c.rotate(rot);TH.ell(c,0,0,u*0.72*s,u*0.95*s,'#2f6f5b');TH.ell(c,-u*0.06,-u*0.06,u*0.66*s,u*0.88*s,'#5f9e6b');
      for(let k=0;k<7;k++)TH.ell(c,(r()-0.5)*u*1.0*s,(r()-0.5)*u*1.4*s,u*0.04,u*0.04,'#f5e9a8');c.restore();};
    pad(x,y-u*0.9,0,1);pad(x-u*0.85,y-u*1.8,-0.5,0.85);pad(x+u*0.8,y-u*1.85,0.45,0.9);pad(x-u*0.15,y-u*2.1,0.1,0.7);if(v%2)pad(x+u*1.4,y-u*2.7,0.9,0.6);
    [[-0.9,-2.5],[0.9,-2.6],[0.0,-2.7]].forEach(([dx,dy])=>TH.ell(c,x+dx*u,y+dy*u,u*0.18,u*0.22,'#c2412d'));}},
  saguaro:{cat:'cactus',w:1.2,tier:2,weight:4,cost:1,draw(c,x,y,u,v){const r=mulberry(v*131+7),H=u*(5.2+r()*2.6),w=u*0.95,g1='#3f7d43',g2='#6aa862',g3='#2c5d34';TH.shadow(c,x,y,u*1.1,H);
    const seg=(a,b,wd)=>{TH.ln(c,a,b,g3,wd+u*0.14);TH.ln(c,a,b,g1,wd);TH.ln(c,[a[0]-wd*0.2,a[1]],[b[0]-wd*0.2,b[1]],g2,wd*0.28);};
    const arms=v%4===0?0:(v%4===1?1:2),spec=[[0.42+r()*0.1,1],[0.58+r()*0.12,-1]];
    for(let i=0;i<arms;i++){const hf=spec[i][0],dir=spec[i][1],ay=y-H*hf,ex=x+dir*u*(1.3+r()*0.5),top=ay-H*(0.22+r()*0.15);seg([x,ay],[ex,ay],w*0.62);seg([ex,ay],[ex,top],w*0.62);TH.ell(c,ex,top-w*0.3,w*0.28,w*0.17,'#f8fafc');}
    seg([x,y],[x,y-H],w);[-0.28,0.28].forEach(k=>TH.ln(c,[x+k*w,y],[x+k*w,y-H],'rgba(20,60,30,.4)',u*0.06));TH.ell(c,x,y-H-w*0.35,w*0.3,w*0.18,'#f8fafc');}},
  /* ---------- dead wood ---------- */
  deadTree:{cat:'tree',w:1.6,tier:2,weight:4,cost:2,max:2,draw(c,x,y,u,v){const r=mulberry(v*23+5);TH.shadow(c,x,y,u*1.8,u*5);
    for(let k=0;k<4;k++)TH.ln(c,[x,y],[x+(k-1.5)*u*0.55,y+u*0.18],'#6d5f4e',u*(0.3-k%2*0.08));
    const br=(px,py,ang,len,wd,d)=>{const nx=px+Math.cos(ang)*len,ny=py+Math.sin(ang)*len;TH.ln(c,[px,py],[nx,ny],'#5f5242',wd+u*0.06);TH.ln(c,[px,py],[nx,ny],'#85766a',wd);TH.ln(c,[px-wd*0.2,py],[nx-wd*0.2,ny],'#b3a48c',wd*0.25);
      if(d>0){const n=d>1?3:2;for(let k=0;k<n;k++)br(nx,ny,ang+(k-(n-1)/2)*0.85+(r()-0.5)*0.5,len*(0.62+r()*0.2),wd*0.62,d-1);}};
    br(x,y,-1.57+(r()-0.5)*0.35,u*(2.0+r()*0.6),u*0.45,3);if(v%2)br(x,y-u*1.4,-0.5-(r()*0.3),u*1.5,u*0.2,1);}},
  stump:{cat:'tree',w:1.1,tier:2,weight:2,cost:1,draw(c,x,y,u,v){const r=mulberry(v*3+1);TH.shadow(c,x,y,u*1.2,u*1.2);for(let k=0;k<3;k++)TH.ln(c,[x,y-u*0.2],[x+(k-1)*u*0.8,y+u*0.1],'#6d5f4e',u*0.28);
    const top=[[x-u*0.5,y-u*1.15],[x-u*0.3,y-u*1.5],[x-u*0.1,y-u*1.2],[x+u*0.15,y-u*1.6],[x+u*0.35,y-u*1.2],[x+u*0.52,y-u*1.3]];
    TH.poly(c,[[x-u*0.55,y],...top.slice().reverse().map(p=>p),[x+u*0.55,y]].slice(0,1).concat(top,[[x+u*0.55,y]]),'#85766a','#5f5242',u*0.05);TH.ell(c,x,y-u*1.2,u*0.5,u*0.2,'#a69882');
    c.strokeStyle='rgba(60,45,30,.35)';c.lineWidth=u*0.05;c.beginPath();c.moveTo(x-u*0.2,y-u*1.1);c.lineTo(x-u*0.25,y-u*0.1);c.moveTo(x+u*0.2,y-u*1.1);c.lineTo(x+u*0.22,y-u*0.1);c.stroke();}},
  /* ---------- rock formations ---------- */
  boulders:{cat:'rock',w:1.6,tier:1,weight:4,cost:1,draw(c,x,y,u,v){const r=mulberry(v*13+3);TH.shadow(c,x,y,u*1.9,u*1.4);
    [[0.0,0.0,1.0,1.0,'#b5683f'],[-1.0,0.2,0.65,0.6,'#a65a36'],[0.9,0.25,0.6,0.55,'#c47a4a']].forEach(([dx,dy,sx,sy,col])=>TH.blob(c,x+dx*u,y-u*0.55*sy+dy*u,u*0.9*sx,u*0.75*sy,col,r,9));}},
  butte:{cat:'landmark',w:2.4,tier:3,weight:2,cost:4,draw(c,x,y,u,v){TH.shadow(c,x,y,u*2.2,u*7);const r=mulberry(v+31);
    rockBody(c,x,y,u,{wt:u*0.95,wb:u*1.9,H:u*(6.6+(v%3)*0.7),bands:WEST_BANDS.slice(v%3).concat(WEST_BANDS.slice(0,v%3)),seed:v+31,top:'#c97f50',scrub:1});
    if(v%2){rockBody(c,x+u*2.6,y+u*0.3,u,{wt:u*0.5,wb:u*1.0,H:u*3.2,bands:WEST_BANDS,seed:v+7,top:'#c97f50',scrub:0});}}},
  mesa:{cat:'landmark',w:3.8,tier:4,weight:3,cost:4,draw(c,x,y,u,v){TH.shadow(c,x,y,u*3.6,u*5);const k=v%3,H=u*(3.8+k*0.5),B=WEST_BANDS.slice(k).concat(WEST_BANDS.slice(0,k));
    rockBody(c,x,y,u,{wt:u*3.0,wb:u*3.7,H:H,bands:B,seed:v+21,top:'#d08e5e',scrub:6});
    if(k!==1)rockBody(c,x-u*0.3,y-H+u*0.1,u,{wt:u*1.5,wb:u*1.9,H:u*1.5,bands:B.slice(1),seed:v+22,top:'#d6976a',scrub:2});}},
  arch:{cat:'landmark',w:4.2,tier:4,weight:2,cost:4,draw(c,x,y,u,v){TH.shadow(c,x,y,u*4,u*5);rockBody(c,x,y,u,{wt:u*3.4,wb:u*4.1,H:u*4.4,bands:WEST_BANDS,seed:v+41,top:'#d08e5e',scrub:4});
    c.beginPath();c.moveTo(x-u*1.15,y+u*0.5);c.lineTo(x-u*1.15,y-u*1.5);c.arc(x,y-u*1.5,u*1.15,Math.PI,0);c.lineTo(x+u*1.15,y+u*0.5);c.closePath();c.fillStyle='#5c2c1a';c.fill();
    c.beginPath();c.moveTo(x-u*0.8,y+u*0.35);c.lineTo(x-u*0.8,y-u*1.4);c.arc(x,y-u*1.4,u*0.8,Math.PI,0);c.lineTo(x+u*0.8,y+u*0.35);c.closePath();c.fillStyle='#a8603a';c.fill();TH.ell(c,x,y+u*0.3,u*0.85,u*0.3,'#e0cb9a');}},
  /* ---------- oil ---------- */
  oilDerrick:{cat:'landmark',w:2.8,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const H=u*11,bw=u*2.3,tw=u*0.5,bd=u*1.05,dk='#3a2410',wd='#5b3b1f',lt='#8a6238';TH.shadow(c,x,y,u*2.8,H*0.5);
    const pt=t=>({L:[x-bw+(bw-tw)*t,y-H*t],R:[x+bw-(bw-tw)*t,y-H*t],F:[x,y+bd*(1-t)-H*t],B:[x,y-bd*(1-t)-H*t]});
    if(v%4===0)TH.ell(c,x+u*0.4,y+u*0.4,u*2.4,u*1.0,'#2a1d14');
    TH.ln(c,pt(0).B,pt(1).B,dk,u*0.2);const lv=[0.14,0.3,0.46,0.62,0.78,0.92];
    lv.forEach(t=>{const p=pt(t);c.strokeStyle=dk;c.lineWidth=u*0.1;c.beginPath();c.moveTo(p.L[0],p.L[1]);c.lineTo(p.F[0],p.F[1]);c.lineTo(p.R[0],p.R[1]);c.lineTo(p.B[0],p.B[1]);c.closePath();c.stroke();});
    const all=[0].concat(lv,[1]);for(let i=0;i<all.length-1;i++){const a=pt(all[i]),b=pt(all[i+1]);c.strokeStyle=dk;c.lineWidth=u*0.09;c.beginPath();
      c.moveTo(a.L[0],a.L[1]);c.lineTo(b.F[0],b.F[1]);c.moveTo(a.F[0],a.F[1]);c.lineTo(b.L[0],b.L[1]);c.moveTo(a.F[0],a.F[1]);c.lineTo(b.R[0],b.R[1]);c.moveTo(a.R[0],a.R[1]);c.lineTo(b.F[0],b.F[1]);c.stroke();}
    const pl=pt(0.62);TH.poly(c,[pl.L,pl.F,pl.R,pl.B],'rgba(138,98,56,.7)');
    ['L','R','F'].forEach(k=>{TH.ln(c,pt(0)[k],pt(1)[k],wd,u*0.26);TH.ln(c,[pt(0)[k][0]-u*0.06,pt(0)[k][1]],[pt(1)[k][0]-u*0.06,pt(1)[k][1]],lt,u*0.07);});
    const tp=pt(1).F;TH.poly(c,[[tp[0]-u*0.7,tp[1]-u*0.2],[tp[0]+u*0.7,tp[1]-u*0.2],[tp[0]+u*0.5,tp[1]-u*1.0],[tp[0]-u*0.5,tp[1]-u*1.0]],'#2b2f36');TH.ell(c,tp[0],tp[1]-u*0.62,u*0.28,u*0.28,'#9aa4b0');
    TH.box(c,x,y,u,2.4,4.2,-0.2,1.4,0,1.5,'#7a8696','#5d6877','#8e9aab');TH.box(c,x,y,u,-5.2,-3.6,0.2,1.8,0,1.1,'#6d7785','#535c69','#7f8a99');
    if(v%4===0){c.strokeStyle='#2a1d14';c.lineCap='round';const tt=(tm||0)*4;for(let k=0;k<13;k++){const dx=(k-6)*u*0.55,ph=((tt+k*0.37)%1);c.lineWidth=u*(0.11-0.05*ph);c.globalAlpha=1-ph*0.6;c.beginPath();c.moveTo(x,tp[1]-u*1.0);
      c.quadraticCurveTo(x+dx*0.5,tp[1]-u*(3.2-Math.abs(k-6)*0.2),x+dx*1.2,y-u*(0.1+ph*0.6));c.stroke();}c.globalAlpha=1;}}},
  pumpJack:{cat:'oil',w:2.6,tier:3,weight:3,cost:2,max:2,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),th=0.2*Math.sin((tm||0)*2.2+v),dk='#334155',rs='#b5532f';TH.shadow(c,x,y,u*2.6,u*4);
    TH.box(c,x,y,u,-2.6,2.2,-0.8,0.8,0,0.35,'#475569','#334155','#64748b');
    const apex=I(0,0,3.5);[[-1.2,0.6],[1.2,0.6],[-1.2,-0.6],[1.2,-0.6]].forEach(([a,b])=>TH.ln(c,I(a,b,0.35),apex,dk,u*0.2));TH.ln(c,I(-1.2,0.6,0.35),I(1.2,0.6,0.35),dk,u*0.12);
    const C=I(0,0,3.6),d=[0.7,0.35],dl=Math.hypot(d[0],d[1]),dx=d[0]/dl,dy=d[1]/dl,L1=u*3.0,L2=u*2.1,cs=Math.cos(th),sn=Math.sin(th);
    const E1=[C[0]-dx*L1*cs-0*sn,C[1]-dy*L1*cs+L1*sn*0.9],E2=[C[0]+dx*L2*cs,C[1]+dy*L2*cs-L2*sn*0.9];TH.ln(c,E1,E2,'#1f2937',u*0.5);TH.ln(c,E1,E2,rs,u*0.34);
    c.fillStyle='#1f2937';c.beginPath();c.moveTo(E1[0]+u*0.2,E1[1]-u*0.5);c.arc(E1[0]+u*0.2,E1[1]+u*0.4,u*1.0,-Math.PI*0.5,Math.PI*0.5,true);c.closePath();c.fill();
    TH.ln(c,[E1[0]-u*0.55,E1[1]+u*0.3],[E1[0]-u*0.55,y-u*0.4],'#cbd5e1',u*0.12);TH.ell(c,E1[0]-u*0.55,y-u*0.2,u*0.3,u*0.12,'#1f2937');
    const W=[E2[0]+u*0.3,E2[1]+u*1.0];TH.ell(c,W[0],W[1],u*0.95,u*0.95,'#1f2937');TH.ell(c,W[0],W[1],u*0.75,u*0.75,rs);TH.ell(c,W[0],W[1],u*0.18,u*0.18,'#1f2937');TH.ln(c,E2,W,'#94a3b8',u*0.1);
    TH.box(c,x,y,u,1.6,3.0,-0.6,0.8,0,1.1,"#64748b","#475569","#7d8a9c");}},
  /* ---------- structures ---------- */
  windmill:{cat:'landmark',w:2.1,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const H=u*8.3,bw=u*1.6,tw=u*0.5,bd=u*0.7,cy=y-H-u*0.4;TH.shadow(c,x,y,u*2,H*0.5);
    TH.ell(c,x+u*3.0,y+u*0.8,u*1.6,u*0.75,'#6f7b88');TH.ell(c,x+u*3.0,y+u*0.45,u*1.5,u*0.7,'#8591a0');TH.ell(c,x+u*3.0,y+u*0.45,u*1.25,u*0.55,'#4b7fa8');
    const pt=t=>({L:[x-bw+(bw-tw)*t,y-H*t],R:[x+bw-(bw-tw)*t,y-H*t],F:[x,y+bd*(1-t)-H*t],B:[x,y-bd*(1-t)-H*t]});TH.ln(c,pt(0).B,pt(1).B,'#334155',u*0.14);
    for(let i=0;i<8;i++){const a=pt(i/8),b=pt((i+1)/8);c.strokeStyle='#475569';c.lineWidth=u*0.07;c.beginPath();c.moveTo(a.L[0],a.L[1]);c.lineTo(a.F[0],a.F[1]);c.lineTo(a.R[0],a.R[1]);
      c.moveTo(a.L[0],a.L[1]);c.lineTo(b.F[0],b.F[1]);c.moveTo(a.F[0],a.F[1]);c.lineTo(b.L[0],b.L[1]);c.moveTo(a.F[0],a.F[1]);c.lineTo(b.R[0],b.R[1]);c.moveTo(a.R[0],a.R[1]);c.lineTo(b.F[0],b.F[1]);c.stroke();}
    ['L','R','F'].forEach(k=>TH.ln(c,pt(0)[k],pt(1)[k],'#64748b',u*0.2));
    TH.ln(c,[x,cy],[x+u*3.4,cy+u*0.5],'#475569',u*0.14);TH.poly(c,[[x+u*2.5,cy+u*0.35],[x+u*4.2,cy-u*0.4],[x+u*4.2,cy+u*1.5],[x+u*2.8,cy+u*1.2]],'#b5532f','#7f3a1e',u*0.05);
    const rx=u*1.5,ry=u*2.0,N=18;TH.ell(c,x,cy,rx*1.02,ry*1.02,'rgba(148,163,184,.18)');for(let i=0;i<N;i++){const a=(tm||0)*1.6+i*6.283/N,ca=Math.cos(a),sa=Math.sin(a);
      TH.poly(c,[[x+ca*rx*0.25,cy+sa*ry*0.25],[x+ca*rx*1.0-sa*u*0.1,cy+sa*ry*1.0+ca*u*0.08],[x+ca*rx*1.0+sa*u*0.1,cy+sa*ry*1.0-ca*u*0.08]],'#d4dde6','#8a97a6',u*0.03);}
    c.strokeStyle='#64748b';c.lineWidth=u*0.07;c.beginPath();c.ellipse(x,cy,rx*0.7,ry*0.7,0,0,7);c.stroke();TH.ell(c,x,cy,u*0.3,u*0.3,'#475569');}},
  waterTower:{cat:'landmark',w:2.1,tier:3,weight:3,cost:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),wd='#8a5a33',dk='#5b3b1f',sh=4.2;TH.shadow(c,x,y,u*2.1,u*8);
    [[-1.3,-1.3],[1.3,-1.3],[-1.3,1.3],[1.3,1.3]].forEach(([a,b])=>TH.ln(c,I(a,b,0),I(a*0.85,b*0.85,sh),dk,u*0.26));
    [[-1.3,1.3,1.3,1.3],[1.3,-1.3,1.3,1.3]].forEach(([a,b,a2,b2])=>{TH.ln(c,I(a,b,0.2),I(a2,b2,sh-0.3),'#6b4a2b',u*0.1);TH.ln(c,I(a,b,sh-0.3),I(a2,b2,0.2),'#6b4a2b',u*0.1);});
    TH.ln(c,I(-1.3,1.3,sh*0.5),I(1.3,1.3,sh*0.5),'#6b4a2b',u*0.12);TH.ln(c,I(1.3,-1.3,sh*0.5),I(1.3,1.3,sh*0.5),'#6b4a2b',u*0.12);
    const cx0=x,cy0=y-sh*u,rr=u*1.7,th=u*3.2;TH.ell(c,cx0,cy0,rr*0.99,rr*0.5,shade(wd,-0.3));c.fillStyle=wd;c.fillRect(cx0-rr*0.99,cy0-th,rr*1.98,th);
    for(let k=-5;k<=5;k++){c.strokeStyle='rgba(60,35,15,.4)';c.lineWidth=u*0.05;c.beginPath();c.moveTo(cx0+k*rr*0.18,cy0+rr*0.5*Math.sqrt(1-Math.min(1,(k*0.18)**2)));c.lineTo(cx0+k*rr*0.18,cy0-th+rr*0.5*Math.sqrt(1-Math.min(1,(k*0.18)**2)));c.stroke();}
    const g=c.createLinearGradient(cx0-rr,0,cx0+rr,0);g.addColorStop(0,'rgba(255,230,190,.25)');g.addColorStop(1,'rgba(40,15,5,.45)');c.fillStyle=g;c.fillRect(cx0-rr*0.99,cy0-th,rr*1.98,th);
    [0.25,0.75].forEach(f=>{const hy=cy0-th*f;c.strokeStyle='#2b2f36';c.lineWidth=u*0.12;c.beginPath();c.ellipse(cx0,hy,rr*0.99,rr*0.5,0,0,Math.PI);c.stroke();});
    TH.ell(c,cx0,cy0-th,rr*0.99,rr*0.5,wd);const ax=cx0,ay=cy0-th;TH.poly(c,[[ax-rr*1.08,ay],[ax+rr*1.08,ay],[ax,ay-u*2.2]],'#6b4226',shade('#6b4226',-0.4),u*0.05);
    TH.ln(c,[ax,ay-u*2.2],[ax,ay-u*2.9],'#2b2f36',u*0.08);TH.ln(c,[cx0+rr*0.9,cy0],[cx0+rr*0.9,y-u*0.5],'#475569',u*0.12);}},
  adobeRuin:{cat:'structure',w:2.7,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v*4+2);TH.shadow(c,x,y,u*3,u*2.5);
    TH.box(c,x,y,u,-2.2,1.2,-0.5,0.4,0,2.0,'#dcc093','#bf9f70','#e8d0a4');TH.box(c,x,y,u,1.2,2.2,-0.5,0.4,0,1.2,'#dcc093','#bf9f70','#e8d0a4');
    TH.poly(c,[I(-2.2,0.4,2.0),I(-1.4,0.4,2.5),I(-0.7,0.4,2.0),I(-0.2,0.4,2.2),I(0.5,0.4,2.0)],'#dcc093');
    TH.poly(c,[I(-1.0,0.4,0.4),I(0.2,0.4,0.4),I(0.2,0.4,1.7),I(-1.0,0.4,1.7)],'#2b1d12');TH.poly(c,[I(-0.9,0.4,0.4),I(0.1,0.4,0.4),I(0.1,0.4,1.55),I(-0.9,0.4,1.55)],'#6d5a3c');
    for(let k=0;k<5;k++)TH.ln(c,I(-2.2+r()*3.4,0.41,0.2+r()*1.6),I(-2.2+r()*3.4,0.41,0.2+r()*1.6),'rgba(110,80,45,.25)',u*0.05);
    TH.box(c,x,y,u,2.5,3.1,0.0,0.6,0,0.35,'#d2b588','#b69668','#e0c698');TH.box(c,x,y,u,-3.0,-2.5,0.5,1.0,0,0.3,'#d2b588','#b69668','#e0c698');}},
  /* ---------- props ---------- */
  wagon:{cat:'prop',w:2.7,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),br=v%3===0;TH.shadow(c,x,y,u*2.9,u*2);
    const wheel=(Xc,Y0,R0,dead)=>{const pts=[];for(let a=0;a<=24;a++){const t=a/24*6.283;pts.push(I(Xc+Math.cos(t)*R0,Y0,R0*0.95+Math.sin(t)*R0*0.95));}
      c.strokeStyle='#3b2412';c.lineWidth=u*0.22;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();c.strokeStyle='#8a5a33';c.lineWidth=u*0.12;c.stroke();
      for(let k=0;k<(dead?5:8);k++){const t=k/8*6.283;TH.ln(c,I(Xc,Y0,R0*0.95),I(Xc+Math.cos(t)*R0,Y0,R0*0.95+Math.sin(t)*R0*0.95),'#8a5a33',u*0.09);}TH.ell(c,...I(Xc,Y0,R0*0.95),u*0.22,u*0.22,'#2b1b0e');};
    wheel(-1.2,-0.9,0.7,false);wheel(1.3,-0.9,0.6,false);
    TH.box(c,x,y,u,-2.0,2.0,-0.8,0.8,0.8,1.5,'#9a6a3a','#7c5129','#2f1f10');TH.poly(c,[I(-1.9,-0.7,1.5),I(1.9,-0.7,1.5),I(1.9,0.7,1.5),I(-1.9,0.7,1.5)],'#3a2614');
    for(let k=0;k<4;k++){const X=-1.4+k*0.95,hp=[];for(let a=0;a<=8;a++){const t=a/8*3.1416;hp.push(I(X,-0.75*Math.cos(t),1.5+Math.sin(t)*1.1));}c.strokeStyle='#d8caa8';c.lineWidth=u*0.1;c.beginPath();hp.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();}
    TH.ln(c,I(2.0,0,1.0),I(3.6,0,br?0.1:0.7),'#6b4226',u*0.2);
    if(!br){wheel(-1.2,0.9,0.7,false);wheel(1.3,0.9,0.6,false);}else{TH.ln(c,I(-1.2,0.9,0.1),I(-0.2,1.5,0.3),'#6b4226',u*0.14);}}},
  fence:{cat:'prop',w:2.5,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+2);TH.shadow(c,x,y,u*2.5,u);
    [-2.2,0,2.2].forEach((X,i)=>{TH.ln(c,I(X,0,0),I(X+(i===1?0.12*(r()-0.5)*4:0),0,1.45),'#5f4a33',u*0.2);TH.ln(c,I(X-0.03,0,0),I(X-0.03,0,1.4),'#8c7556',u*0.07);});
    [0.5,1.05].forEach((Z,k)=>{if(v%2&&k===1){TH.ln(c,I(-2.2,0,Z),I(-0.3,0,Z),'#75603f',u*0.15);TH.ln(c,I(0.5,0,Z-0.5),I(2.0,0,Z-0.9),'#75603f',u*0.15);}
      else{TH.ln(c,I(-2.2,0,Z),I(2.2,0,Z),'#6e5a3b',u*0.16);TH.ln(c,I(-2.2,-0.02,Z+0.02),I(2.2,-0.02,Z+0.02),'#a08a66',u*0.05);}});}},
  hitchingPost:{cat:'prop',w:1.7,tier:2,weight:2,cost:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);TH.shadow(c,x,y,u*1.7,u);
    [-1.1,1.1].forEach(X=>{TH.ln(c,I(X,0,0),I(X,0,1.6),'#5f4a33',u*0.26);TH.ln(c,I(X-0.04,0,0),I(X-0.04,0,1.55),'#8c7556',u*0.08);});
    TH.ln(c,I(-1.1,0,1.2),I(1.1,0,1.2),'#6e5a3b',u*0.22);c.strokeStyle='#c9b98a';c.lineWidth=u*0.06;c.beginPath();let p=I(-0.6,0.05,1.15);c.moveTo(p[0],p[1]);p=I(0.0,0.05,0.6);c.quadraticCurveTo(p[0],p[1]+u*0.2,...I(0.5,0.05,1.1));c.stroke();}},
  barrels:{cat:'prop',w:1.5,tier:2,weight:3,cost:1,draw(c,x,y,u,v){const r=mulberry(v+1);TH.shadow(c,x,y,u*1.6,u*1.6);
    const bar=(bx,by,s)=>{const rw=u*0.62*s,h=u*1.2*s;c.fillStyle='#8a5a33';c.beginPath();c.ellipse(bx,by,rw,rw*0.45,0,0,7);c.fill();c.fillRect(bx-rw,by-h,rw*2,h);
      TH.ell(c,bx,by,rw,rw*0.45,'#7a4d29');c.fillRect(bx-rw,by-h,rw*2,h);[0.2,0.8].forEach(f=>{c.strokeStyle='#2b2f36';c.lineWidth=u*0.1;c.beginPath();c.ellipse(bx,by-h*f,rw,rw*0.45,0,0,Math.PI);c.stroke();});
      const g=c.createLinearGradient(bx-rw,0,bx+rw,0);g.addColorStop(0,'rgba(255,230,190,.25)');g.addColorStop(1,'rgba(40,15,5,.4)');c.fillStyle=g;c.fillRect(bx-rw,by-h,rw*2,h);TH.ell(c,bx,by-h,rw,rw*0.45,'#a8794a');TH.ell(c,bx,by-h,rw*0.8,rw*0.34,'#6d4724');};
    bar(x-u*0.7,y,1);bar(x+u*0.6,y+u*0.15,0.9);if(v%2){TH.box(c,x,y,u,-0.7,0.9,-1.6,-0.3,0,1.1,'#a0743f','#80592f','#bd8f58');}}},
  cowSkull:{cat:'prop',w:0.9,tier:1,weight:3,cost:1,draw(c,x,y,u,v){const post=v%2===0,cy=post?y-u*1.9:y-u*0.35;TH.shadow(c,x,y,u*0.9,u);if(post){TH.ln(c,[x,y],[x,y-u*1.8],'#5f4a33',u*0.22);TH.ln(c,[x-u*0.7,y-u*1.3],[x+u*0.7,y-u*1.3],'#5f4a33',u*0.14);}
    c.strokeStyle='#e8e0cc';c.lineWidth=u*0.16;c.lineCap='round';c.beginPath();c.moveTo(x-u*0.45,cy-u*0.2);c.quadraticCurveTo(x-u*1.3,cy-u*0.5,x-u*1.1,cy-u*1.0);c.moveTo(x+u*0.45,cy-u*0.2);c.quadraticCurveTo(x+u*1.3,cy-u*0.5,x+u*1.1,cy-u*1.0);c.stroke();
    TH.ell(c,x,cy,u*0.5,u*0.42,'#f1ead8');TH.poly(c,[[x-u*0.3,cy+u*0.15],[x+u*0.3,cy+u*0.15],[x+u*0.18,cy+u*0.62],[x-u*0.18,cy+u*0.62]],'#e8e0cc');TH.ell(c,x-u*0.18,cy,u*0.12,u*0.14,'#2b2f36');TH.ell(c,x+u*0.18,cy,u*0.12,u*0.14,'#2b2f36');}},
  mineCart:{cat:'prop',w:2.1,tier:3,weight:2,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+6);TH.shadow(c,x,y,u*2.2,u*1.5);
    [-0.5,0.5].forEach(Y=>TH.ln(c,I(-2.4,Y,0.05),I(2.4,Y,0.05),'#64748b',u*0.1));for(let X=-2.2;X<=2.3;X+=0.8)TH.ln(c,I(X,-0.7,0.02),I(X,0.7,0.02),'#5b3b1f',u*0.13);
    TH.box(c,x,y,u,-1.0,1.0,-0.65,0.65,0.35,1.35,'#6d4a2a','#53381f','#2a1a0e');TH.poly(c,[I(-0.9,-0.55,1.35),I(0.9,-0.55,1.35),I(0.9,0.55,1.35),I(-0.9,0.55,1.35)],'#3a2614');
    for(let k=0;k<6;k++)TH.blob(c,...I(-0.7+r()*1.4,-0.4+r()*0.8,1.45),u*0.28,u*0.22,['#9a9187','#b08a3e','#7d756c'][k%3],r,6);
    [[-0.6,0.65],[0.6,0.65]].forEach(([X,Y])=>{TH.ell(c,...I(X,Y,0.3),u*0.32,u*0.34,'#2b2f36');TH.ell(c,...I(X,Y,0.3),u*0.13,u*0.13,'#94a3b8');});}}
  }};
/* ===== tile placement + tile rendering (works for any pack) ===== */
/* Height classes keep scenery from hiding the ride/building in the middle of the tile:
   low = anywhere on the edge ring, mid = back + sides (and the front corners), tall = back corners + sides only (never straight behind the ride, so they aren't hidden by it). */
const WEST_HEIGHT={sagebrush:'low',tumbleweed:'low',dryGrass:'low',agave:'low',barrelCactus:'low',pricklyPear:'low',boulders:'low',stump:'low',hitchingPost:'low',barrels:'low',cowSkull:'low',fence:'low',mineCart:'low',
  saguaro:'mid',yucca:'mid',deadTree:'mid',pumpJack:'mid',wagon:'mid',adobeRuin:'mid',butte:'tall',mesa:'tall',arch:'tall',oilDerrick:'tall',windmill:'tall',waterTower:'tall'};
Object.keys(WESTERN_PACK.assets).forEach(id=>{WESTERN_PACK.assets[id].h=WEST_HEIGHT[id]||'low';});
const KEEP_OUT={rx:0.52,ry:0.34};   // central ellipse (x R) reserved for the ride or building sprite
function placeThemeAssets(pack,tier,R,seed){
  const rnd=mulberry(seed*7919+tier*131), u=R*0.068, T=pack.tiers[tier], out=[], decals=[], TAU=Math.PI*2;
  if(!T)return {assets:out,decals,u};
  const inside=(x,y,k)=>{const X=Math.abs(x)/R,Y=Math.abs(y)/(0.58*R);return X<=0.866*k&&Y<=k-X/1.732;};
  const ids=Object.keys(pack.assets), cnt={};
  const free=(x,y,w)=>out.every(o=>Math.hypot(o.x-x,(o.y-y)*1.7)>(o.w+w)*u*0.8);
  const clearOfCenter=(x,y,w,h)=>{const kx=h==='tall'?0.28:0.75,ky=h==='tall'?0.18:0.4,ex=R*KEEP_OUT.rx+w*u*kx,ey=R*KEEP_OUT.ry+w*u*ky;return x*x/(ex*ex)+y*y/(ey*ey)>1;};
  const zoneOK=(a,x,y)=>{const h=a.h||'low';if(h==='low')return true;const ax=Math.abs(x)/R;
    if(h==='tall')return y<R*0.12&&ax>(y>=-R*0.12?0.55:0.4);
    if(y>R*0.12)return h==='mid'&&ax>0.5;if(y>=-R*0.12)return h==='mid'||ax>0.55;return true;};
  const ringPoint=(tmax)=>{const th=rnd()*TAU,dx=Math.cos(th),dy=Math.sin(th);let lo=0,hi=R*1.2;
    for(let i=0;i<12;i++){const m=(lo+hi)/2;if(inside(dx*m,dy*m,0.9))lo=m;else hi=m;}const t=0.5+rnd()*((tmax||1)-0.5);return[dx*lo*t,dy*lo*t];};
  const spot=a=>{for(let i=0;i<120;i++){const p=ringPoint(a.h==='tall'?0.8:a.h==='mid'?0.92:1);if(clearOfCenter(p[0],p[1],a.w,a.h)&&zoneOK(a,p[0],p[1])&&free(p[0],p[1],a.w))return p;}return null;};
  const add=(id,x,y)=>{const a=pack.assets[id];out.push({id,x,y,v:Math.floor(rnd()*1000),w:a.w});cnt[id]=(cnt[id]||0)+1;};
  for(let i=0;i<T.decals;i++){const pool=ids.filter(id=>pack.assets[id].cat==='decal'&&pack.assets[id].tier<=tier),id=pool[Math.floor(rnd()*pool.length)];
    for(let t=0;t<40;t++){const p=ringPoint();if(clearOfCenter(p[0],p[1],pack.assets[id].w*0.5)){decals.push({id,x:p[0],y:p[1],v:Math.floor(rnd()*1000)});break;}}}
  let budget=T.budget;
  const land=()=>{let id=T.pool[Math.floor(rnd()*T.pool.length)];for(let q=0;q<8&&cnt[id];q++)id=T.pool[Math.floor(rnd()*T.pool.length)];
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}};
  if(T.pool.length&&rnd()<T.landmark){land();if(T.second&&rnd()<T.second)land();}
  let guard=0;while(budget>0&&guard++<500){const pool=ids.filter(id=>{const a=pack.assets[id];return a.cat!=='decal'&&a.cat!=='landmark'&&a.tier<=tier&&a.cost<=budget&&(cnt[id]||0)<(a.max||3);});
    if(!pool.length)break;let tot=0;pool.forEach(id=>tot+=pack.assets[id].weight);let pick=rnd()*tot,id=pool[0];for(const q of pool){pick-=pack.assets[q].weight;if(pick<=0){id=q;break;}}
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}else{cnt[id]=99;}}
  return {assets:out,decals,u};
}
function drawThemeGround(ctx,cx,cy,R,pack,border){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);ctx[i?'lineTo':'moveTo'](cx+R*Math.cos(a),cy+R*Math.sin(a)*0.58);}ctx.closePath();
  ctx.fillStyle=pack.ground;ctx.fill();if(border!==false){ctx.lineWidth=Math.max(1.5,R*0.03);ctx.strokeStyle=border||pack.border;ctx.stroke();}}
function drawThemeDecals(ctx,cx,cy,pack,pl){pl.decals.forEach(d=>pack.assets[d.id].draw(ctx,cx+d.x,cy+d.y,pl.u,d.v,0));}
/* layer: 'back' (y<0, draw BEFORE the ride sprite), 'front' (y>=0, draw AFTER it) or omit for all, sorted by y */
function drawThemeAssets(ctx,cx,cy,pack,pl,tm,layer){pl.assets.filter(o=>layer==='back'?o.y<0:layer==='front'?o.y>=0:true).sort((a,b)=>a.y-b.y).forEach(o=>pack.assets[o.id].draw(ctx,cx+o.x,cy+o.y,pl.u,o.v,tm||0));}
/* convenience: ground + decals + back scenery, then your ride callback, then front scenery */
function drawThemedTile(ctx,cx,cy,R,pack,tier,seed,tm,border,rideFn){drawThemeGround(ctx,cx,cy,R,pack,border);const pl=placeThemeAssets(pack,tier,R,seed);
  drawThemeDecals(ctx,cx,cy,pack,pl);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'back');if(rideFn)rideFn(ctx,cx,cy,R);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'front');}
return { pack: WESTERN_PACK, placeThemeAssets, drawThemeGround, drawThemeDecals, drawThemeAssets };
})();

const MEDIEVAL_THEME_PACK = (() => {
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
/* ===== MEDIEVAL PACK ===== */
const M={timber:'#6b4a2b',timberD:'#4a3320',timberL:'#8a6238',thatch:'#d6b25c',thatchD:'#a8873a',stone:'#9aa0a8',stoneD:'#6e747c',stoneL:'#c3c8cf',red:'#b3342f',blue:'#2f4f8f',gold:'#e0b53a',plaster:'#eadfc4'};
const mbox=(c,x,y,u,x0,x1,y0,y1,z0,z1,k)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,k?shade(M.stone,k):M.stone,k?shade(M.stoneD,k):M.stoneD,k?shade(M.stoneL,k):M.stoneL);
const tbox=(c,x,y,u,x0,x1,y0,y1,z0,z1,k)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,k?shade(M.timberL,k):M.timberL,k?shade(M.timber,k):M.timber,k?shade('#a97d49',k):'#a97d49');
const msh=(c,x,y,rx,h)=>{c.fillStyle='rgba(25,40,15,.3)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
const mglow=(c,x,y,r,a)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(255,170,60,'+a+')');g.addColorStop(1,'rgba(255,170,60,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();};
const merl=(c,x,y,u,x0,x1,y0,y1,z)=>{for(let Y=y0;Y<y1-0.4;Y+=0.6)mbox(c,x,y,u,x1-0.3,x1,Y,Y+0.34,z,z+0.45,0.04);for(let X=x0;X<x1-0.2;X+=0.6)mbox(c,x,y,u,X,X+0.34,y1-0.3,y1,z,z+0.45,0.04);};
const mortar=(c,x,y,u,x0,x1,Y,z0,z1)=>{for(let z=z0+0.5;z<z1;z+=0.55)TH.ln(c,TH.iso(x,y,u,x0,Y,z),TH.iso(x,y,u,x1,Y,z),'rgba(45,52,66,.28)',u*0.04);};
const mortarE=(c,x,y,u,X,y0,y1,z0,z1)=>{for(let z=z0+0.5;z<z1;z+=0.55)TH.ln(c,TH.iso(x,y,u,X,y0,z),TH.iso(x,y,u,X,y1,z),'rgba(30,36,50,.3)',u*0.04);};
const mcyl=(c,x,y,u,X,Y,r,z0,z1,col)=>{const p=TH.iso(x,y,u,X,Y,z0),q=TH.iso(x,y,u,X,Y,z1),rx=r*u*0.99,ry=r*u*0.495;TH.ell(c,p[0],p[1],rx,ry,shade(col,-0.25));c.fillStyle=col;c.fillRect(p[0]-rx,q[1],rx*2,p[1]-q[1]);
  const g=c.createLinearGradient(p[0]-rx,0,p[0]+rx,0);g.addColorStop(0,'rgba(255,255,255,.3)');g.addColorStop(1,'rgba(20,25,40,.42)');c.fillStyle=g;c.fillRect(p[0]-rx,q[1],rx*2,p[1]-q[1]);TH.ell(c,q[0],q[1],rx,ry,shade(col,0.2));return[q[0],q[1],rx,ry];};
const mcone=(c,x,y,u,X,Y,r,z0,z1,col)=>{const p=TH.iso(x,y,u,X,Y,z0),q=TH.iso(x,y,u,X,Y,z1),rx=r*u*0.99,ry=r*u*0.495;c.beginPath();c.moveTo(p[0]-rx,p[1]);c.lineTo(q[0],q[1]);c.lineTo(p[0]+rx,p[1]);c.ellipse(p[0],p[1],rx,ry,0,0,Math.PI,false);c.closePath();
  const g=c.createLinearGradient(p[0]-rx,0,p[0]+rx,0);g.addColorStop(0,shade(col,0.22));g.addColorStop(0.55,col);g.addColorStop(1,shade(col,-0.38));c.fillStyle=g;c.fill();};
const mflag=(c,x,y,u,len,col,tm,k)=>{const w=Math.sin((tm||0)*3+k)*u*0.12;TH.ln(c,[x,y],[x,y-u*len],'#d5dae6',u*0.1);TH.poly(c,[[x,y-u*len],[x+u*1.5,y-u*(len-0.2)+w],[x+u*1.1,y-u*(len-0.55)+w*1.4],[x+u*1.5,y-u*(len-0.9)+w],[x,y-u*(len-0.8)]],col,shade(col,-0.4),u*0.05);};
const MEDIEVAL_PACK={id:'medieval',name:'Medieval',ground:'#92b06f',groundDark:'#7f9e5f',border:'#617f46',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},
         3:{budget:11,decals:4,landmark:0.75,pool:['roundTower','windmill','gatehouse']},
         4:{budget:15,decals:5,landmark:1,pool:['castleKeep','roundTower','windmill','gatehouse'],second:0.45}},
  assets:{
  /* ---------- ground decals ---------- */
  dirtPatch:{cat:'decal',w:2.5,tier:1,weight:4,cost:0,draw(c,x,y,u,v){const r=mulberry(v+3);TH.ell(c,x,y,u*2.5,u*1.05,'#a98b62');TH.ell(c,x-u*0.3,y-u*0.05,u*1.8,u*0.7,'#b89b72');for(let k=0;k<2;k++){c.strokeStyle='rgba(90,66,36,.4)';c.lineWidth=u*0.1;c.beginPath();c.ellipse(x+(k?0.2:-0.15)*u,y+(k-0.5)*u*0.25,u*2.0,u*0.36,0,Math.PI*1.08,Math.PI*1.92);c.stroke();}for(let k=0;k<7;k++)TH.ell(c,x+(r()-0.5)*u*3.6,y+(r()-0.5)*u*1.3,u*0.09,u*0.06,'#8b6e47');}},
  mudPuddle:{cat:'decal',w:1.6,tier:1,weight:2.5,cost:0,draw(c,x,y,u,v){TH.ell(c,x,y,u*1.8,u*0.8,'#6f5636');TH.ell(c,x-u*0.1,y-u*0.05,u*1.5,u*0.6,'#85694a');c.strokeStyle='rgba(190,215,235,.6)';c.lineWidth=u*0.07;c.beginPath();c.ellipse(x-u*0.1,y-u*0.05,u*1.1,u*0.4,0,Math.PI*1.05,Math.PI*1.6);c.stroke();}},
  hayScatter:{cat:'decal',w:1.8,tier:1,weight:3,cost:0,draw(c,x,y,u,v){const r=mulberry(v+7);for(let k=0;k<24;k++){const a=r()*6.283,rr=Math.sqrt(r()),px=x+Math.cos(a)*u*1.7*rr,py=y+Math.sin(a)*u*0.75*rr;TH.ln(c,[px,py],[px+(r()-0.5)*u*0.6,py+(r()-0.5)*u*0.2],['#d9b95a','#c4a243','#e6cb78'][k%3],u*0.07);}}},
  wildflowers:{cat:'decal',w:2,tier:1,weight:3.5,cost:0,draw(c,x,y,u,v){const r=mulberry(v+9);for(let k=0;k<22;k++){const a=r()*6.283,rr=Math.sqrt(r()),px=x+Math.cos(a)*u*1.8*rr,py=y+Math.sin(a)*u*0.8*rr;TH.ln(c,[px,py],[px,py-u*0.25],'#4a7a3c',u*0.05);TH.ell(c,px,py-u*0.3,u*0.1,u*0.09,['#e04a4a','#f2d24a','#f8fafc','#6a8cf0','#d884e0'][k%5]);}}},
  /* ---------- trees, plants, crops ---------- */
  oakTree:{cat:'tree',w:2.0,tier:2,weight:3.5,cost:2,max:2,draw(c,x,y,u,v){const r=mulberry(v*17+3),H=u*(2.6+r()*0.8);msh(c,x,y,u*2.3,u*6);
    for(let k=0;k<3;k++)TH.ln(c,[x,y-u*0.2],[x+(k-1)*u*0.7,y+u*0.15],'#4a3320',u*0.3);TH.ln(c,[x+u*0.1,y],[x+u*0.15,y-H],'#4a3320',u*0.75);TH.ln(c,[x-u*0.1,y],[x+u*0.05,y-H],'#7a5836',u*0.28);
    TH.ln(c,[x+u*0.1,y-H*0.7],[x-u*1.1,y-H-u*0.5],'#4a3320',u*0.32);TH.ln(c,[x+u*0.1,y-H*0.75],[x+u*1.2,y-H-u*0.4],'#4a3320',u*0.3);
    const cols=['#3a7340','#4a8647','#5c9a52','#437f44'];[[0,-1.9,2.3,1.9],[-1.6,-0.9,1.7,1.4],[1.6,-1.0,1.7,1.4],[0.1,-0.8,2.0,1.5],[-0.7,-2.7,1.4,1.1],[1.0,-2.5,1.3,1.0]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H+dy*u,u*rx,u*ry,cols[i%4],r,9));}},
  appleTree:{cat:'tree',w:1.7,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v){const r=mulberry(v*5+8),H=u*1.9;msh(c,x,y,u*1.9,u*4.5);TH.ln(c,[x,y],[x,y-H],'#4a3320',u*0.55);TH.ln(c,[x-u*0.08,y],[x-u*0.08,y-H],'#7a5836',u*0.2);
    [[0,-1.5,1.7,1.4],[-1.1,-0.7,1.2,1.0],[1.1,-0.75,1.2,1.0],[0.1,-0.6,1.5,1.1]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H+dy*u,u*rx,u*ry,['#4a8647','#5c9a52','#3f7a42'][i%3],r,9));
    for(let k=0;k<9;k++)TH.ell(c,x+(r()-0.5)*u*2.6,y-H-u*(0.1+r()*1.6),u*0.14,u*0.14,k%3?'#d9342b':'#f2c230');}},
  bush:{cat:'plant',w:1.4,tier:1,weight:4,cost:1,draw(c,x,y,u,v){const r=mulberry(v*3+6);msh(c,x,y,u*1.4,u);[[-0.7,-0.5,0.85,'#447c43'],[0.7,-0.5,0.8,'#548f4d'],[0,-0.95,0.95,'#5f9d56'],[-0.1,-0.45,0.85,'#4a8447']].forEach(([dx,dy,s,col])=>TH.blob(c,x+dx*u,y+dy*u,u*s,u*s*0.72,col,r,9));
    if(v%2)for(let k=0;k<6;k++)TH.ell(c,x+(r()-0.5)*u*1.8,y-u*(0.3+r()*1.0),u*0.1,u*0.1,['#e04a4a','#f8fafc','#f2d24a'][k%3]);}},
  wheatPatch:{cat:'plant',w:2.0,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v,tm){TH.ell(c,x,y,u*2.0,u*0.9,'#8a6a3e');const st=[];for(let i=-5;i<=5;i++)for(let j=-3;j<=3;j++){const px=x+(i+(Math.abs(j)%2)*0.5)*u*0.34,py=y+j*u*0.22;if(((px-x)/(u*1.9))**2+((py-y)/(u*0.82))**2<1)st.push([px,py]);}
    st.sort((a,b)=>a[1]-b[1]).forEach(([px,py],k)=>{const sw=Math.sin((tm||0)*1.5+px*0.05)*u*0.06;TH.ln(c,[px,py],[px+sw,py-u*1.4],'#c9a84a',u*0.07);TH.ell(c,px+sw,py-u*1.5,u*0.1,u*0.22,'#e3c25a',0.1);});}},
  /* ---------- rocks ---------- */
  boulders:{cat:'rock',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*13+3);msh(c,x,y,u*1.9,u*1.4);[[0.0,0.0,1.0,1.0,'#8d939b'],[-1.0,0.2,0.65,0.6,'#7d838b'],[0.9,0.25,0.6,0.55,'#9aa0a8']].forEach(([dx,dy,sx,sy,col])=>TH.blob(c,x+dx*u,y-u*0.55*sy+dy*u,u*0.9*sx,u*0.75*sy,col,r,9));
    for(let k=0;k<3;k++)TH.ell(c,x+(r()-0.5)*u*1.4,y-u*(0.2+r()*0.6),u*0.22,u*0.12,'rgba(95,140,80,.75)');}},
  ruinedWall:{cat:'rock',w:2.4,tier:3,weight:2.5,cost:1,max:2,draw(c,x,y,u,v){const r=mulberry(v+2);msh(c,x,y,u*2.4,u*2);mbox(c,x,y,u,-2.2,2.2,-0.4,0.4,0,1.3,-0.04);mortar(c,x,y,u,-2.2,2.2,0.41,0,1.3);
    for(let X=-2.2;X<1.9;X+=0.7){const h=0.3+r()*0.9;if(r()<0.8)mbox(c,x,y,u,X,X+0.6,-0.4,0.4,1.3,1.3+h,0.0);}mortarE(c,x,y,u,2.2,-0.4,0.4,0,1.3);
    TH.blob(c,x-u*1.4,y-u*0.7,u*0.7,u*0.5,'#4f8a48',r,8);TH.blob(c,x+u*1.0,y-u*1.0,u*0.5,u*0.4,'#5a9a52',r,7);for(let k=0;k<3;k++)mbox(c,x,y,u,-1.0+r()*3,-0.4+r()*3,0.5+r()*0.9,1.0+r()*0.9,0,0.35+r()*0.25,-0.1);}},
  /* ---------- props ---------- */
  hayStack:{cat:'prop',w:1.6,tier:1,weight:3.5,cost:1,max:2,draw(c,x,y,u,v){msh(c,x,y,u*1.7,u*3.5);const rx=u*1.5;c.beginPath();c.moveTo(x-rx,y);c.quadraticCurveTo(x-rx*0.95,y-u*2.6,x,y-u*3.3);c.quadraticCurveTo(x+rx*0.95,y-u*2.6,x+rx,y);c.ellipse(x,y,rx,rx*0.42,0,0,Math.PI,false);c.closePath();
    const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,'#f0d77a');g.addColorStop(0.55,'#d9b95a');g.addColorStop(1,'#a8873a');c.fillStyle=g;c.fill();
    c.strokeStyle='rgba(120,90,30,.4)';c.lineWidth=u*0.06;for(let k=-3;k<=3;k++){c.beginPath();c.moveTo(x+k*rx*0.28,y+rx*0.3);c.quadraticCurveTo(x+k*rx*0.2,y-u*1.6,x+k*rx*0.02,y-u*3.2);c.stroke();}
    TH.ln(c,[x+rx*1.15,y+u*0.1],[x+rx*0.7,y-u*2.6],'#6b4a2b',u*0.1);[-0.12,0,0.12].forEach(d=>TH.ln(c,[x+rx*0.7+d*u,y-u*2.6],[x+rx*0.62+d*u,y-u*3.0],'#8d939b',u*0.05));}},
  woodFence:{cat:'prop',w:2.4,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+4);msh(c,x,y,u*2.5,u);for(let X=-2.2;X<=2.25;X+=0.44){const h=1.35+r()*0.25;TH.ln(c,I(X,0,0),I(X,0,h),'#6b4a2b',u*0.24);TH.ln(c,I(X-0.05,0,0),I(X-0.05,0,h),'#9a7040',u*0.07);TH.poly(c,[I(X-0.12,0,h),I(X+0.12,0,h),I(X,0,h+0.35)],'#7a5836');}
    [0.4,1.0].forEach(Z=>{TH.ln(c,I(-2.3,0.05,Z),I(2.3,0.05,Z),'#c9b98a',u*0.07);});if(v%2)TH.ln(c,I(1.2,0,0),I(1.8,0,1.6),'#6b4a2b',u*0.2);}},
  well:{cat:'prop',w:1.6,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const r=mulberry(v+5);msh(c,x,y,u*1.6,u*4);const q=mcyl(c,x,y,u,0,0,1.15,0,0.95,M.stone);for(let j=0;j<3;j++)for(let i=-4;i<=4;i++){c.strokeStyle='rgba(40,46,60,.3)';c.lineWidth=u*0.04;c.strokeRect(q[0]+(i+(j%2)*0.5)*u*0.28-u*0.14,q[1]+u*0.5+j*u*0.3,u*0.28,u*0.3);}
    TH.ell(c,q[0],q[1],q[2]*0.78,q[3]*0.78,'#1d2a3a');TH.ell(c,q[0]-u*0.2,q[1]+u*0.02,q[2]*0.35,q[3]*0.3,'rgba(130,170,210,.4)');
    [-1,1].forEach(s=>TH.ln(c,[x+s*u*1.0,q[1]+u*0.2],[x+s*u*1.0,q[1]-u*2.0],'#6b4a2b',u*0.22));TH.ln(c,[x-u*1.0,q[1]-u*1.9],[x+u*1.0,q[1]-u*1.9],'#4a3320',u*0.2);
    c.beginPath();c.moveTo(x-u*1.5,q[1]-u*1.7);c.lineTo(x,q[1]-u*3.1);c.lineTo(x+u*1.5,q[1]-u*1.7);c.closePath();c.fillStyle='#d6b25c';c.fill();c.fillStyle='rgba(90,60,10,.3)';c.beginPath();c.moveTo(x,q[1]-u*3.1);c.lineTo(x+u*1.5,q[1]-u*1.7);c.lineTo(x+u*0.3,q[1]-u*1.7);c.fill();
    TH.ln(c,[x,q[1]-u*1.8],[x,q[1]-u*0.6],'#c9b98a',u*0.05);TH.ell(c,x,q[1]-u*0.45,u*0.25,u*0.2,'#6b4a2b');}},
  marketStall:{cat:'prop',w:2.4,tier:3,weight:3,cost:2,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+3);msh(c,x,y,u*2.5,u*3);
    [[-2.0,-0.6],[2.0,-0.6]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(X,Y,3.0),'#6b4a2b',u*0.22));tbox(c,x,y,u,-2.0,2.0,-0.4,0.9,0,1.0);TH.poly(c,[I(-2.0,0.9,1.0),I(2.0,0.9,1.0),I(2.0,-0.4,1.0),I(-2.0,-0.4,1.0)],'#a97d49');
    [-1.5,-0.5,0.5,1.5].forEach((X,i)=>{const p=I(X,0.3,1.0);TH.ell(c,p[0],p[1]-u*0.3,u*0.38,u*0.34,['#d9342b','#f2a22b','#5aa55a','#d9342b'][i]);TH.ell(c,p[0]+u*0.5,p[1]-u*0.2,u*0.3,u*0.28,['#f2a22b','#5aa55a','#d9342b','#f2c230'][i]);});
    for(let i=0;i<8;i++){const X0=-2.3+i*0.575,X1=X0+0.575;TH.poly(c,[I(X0,1.4,2.5),I(X1,1.4,2.5),I(X1,-0.9,3.3),I(X0,-0.9,3.3)],i%2?'#f1ece0':'#b3342f');TH.poly(c,[I(X0,1.4,2.5),I(X1,1.4,2.5),[(I(X0,1.4,2.5)[0]+I(X1,1.4,2.5)[0])/2,I(X0,1.4,2.5)[1]+u*0.35]],i%2?'#f1ece0':'#b3342f');}
    TH.ln(c,I(-2.3,1.4,2.5),I(2.3,1.4,2.5),'rgba(60,20,20,.35)',u*0.05);TH.ln(c,I(-2.3,-0.9,3.3),I(2.3,-0.9,3.3),'#6b4a2b',u*0.1);}},
  merchantCart:{cat:'prop',w:2.6,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+2);msh(c,x,y,u*2.8,u*2);
    const wheel=(Xc,Y0,R0)=>{const pts=[];for(let a=0;a<=24;a++){const t=a/24*6.283;pts.push(I(Xc+Math.cos(t)*R0,Y0,R0*0.95+Math.sin(t)*R0*0.95));}c.strokeStyle='#3b2412';c.lineWidth=u*0.2;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();c.strokeStyle='#8a6238';c.lineWidth=u*0.1;c.stroke();
      for(let k=0;k<8;k++){const t=k/8*6.283;TH.ln(c,I(Xc,Y0,R0*0.95),I(Xc+Math.cos(t)*R0,Y0,R0*0.95+Math.sin(t)*R0*0.95),'#8a6238',u*0.08);}TH.ell(c,...I(Xc,Y0,R0*0.95),u*0.2,u*0.2,'#2b1b0e');};
    wheel(-0.2,-1.0,1.0);tbox(c,x,y,u,-1.8,1.6,-0.9,0.9,0.9,1.6);TH.poly(c,[I(-1.7,-0.8,1.6),I(1.5,-0.8,1.6),I(1.5,0.8,1.6),I(-1.7,0.8,1.6)],'#2f2010');
    for(let k=0;k<6;k++)TH.blob(c,...I(-1.3+k*0.5,-0.3+(k%2)*0.5,1.9),u*0.55,u*0.4,['#d9b95a','#c4a243','#e6cb78'][k%3],r,7);TH.ln(c,I(1.6,-0.4,1.2),I(3.6,-0.5,0.8),'#6b4a2b',u*0.14);TH.ln(c,I(1.6,0.4,1.2),I(3.6,0.5,0.8),'#6b4a2b',u*0.14);
    wheel(-0.2,1.0,1.0);TH.ell(c,...I(-1.0,1.0,1.9),u*0.4,u*0.5,'#c9b98a');}},
  barrelCrates:{cat:'prop',w:1.6,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v){msh(c,x,y,u*1.7,u*1.6);const bar=(bx,by,s)=>{const rw=u*0.62*s,h=u*1.2*s;TH.ell(c,bx,by,rw,rw*0.45,'#6b4a2b');c.fillStyle='#8a6238';c.fillRect(bx-rw,by-h,rw*2,h);[0.2,0.8].forEach(f=>{c.strokeStyle='#3b3f4a';c.lineWidth=u*0.09;c.beginPath();c.ellipse(bx,by-h*f,rw,rw*0.45,0,0,Math.PI);c.stroke();});
      const g=c.createLinearGradient(bx-rw,0,bx+rw,0);g.addColorStop(0,'rgba(255,230,190,.3)');g.addColorStop(1,'rgba(30,15,5,.4)');c.fillStyle=g;c.fillRect(bx-rw,by-h,rw*2,h);TH.ell(c,bx,by-h,rw,rw*0.45,'#a8794a');};
    bar(x-u*0.7,y,1);bar(x+u*0.6,y+u*0.15,0.9);TH.box(c,x,y,u,-0.6,0.9,-1.7,-0.4,0,1.0,'#a0743f','#80592f','#bd8f58');TH.ell(c,x+u*1.4,y+u*0.3,u*0.5,u*0.35,'#d8c9a0');TH.ell(c,x+u*1.4,y+u*0.0,u*0.35,u*0.28,'#e7dcb8');}},
  bannerPole:{cat:'prop',w:1.0,tier:2,weight:2.5,cost:1,max:2,draw(c,x,y,u,v,tm){msh(c,x,y,u,u*6);TH.ln(c,[x,y],[x,y-u*6.4],'#6b4a2b',u*0.24);TH.ell(c,x,y-u*6.5,u*0.2,u*0.2,M.gold);TH.ln(c,[x-u*0.1,y],[x-u*0.1,y-u*6.3],'#9a7040',u*0.07);TH.ln(c,[x-u*1.0,y-u*5.7],[x+u*1.0,y-u*5.7],'#4a3320',u*0.14);
    const sw=Math.sin((tm||0)*2+v)*u*0.2,col=v%2?M.red:M.blue;c.beginPath();c.moveTo(x-u*0.85,y-u*5.6);c.lineTo(x+u*0.85,y-u*5.6);c.lineTo(x+u*0.85+sw*0.5,y-u*2.5);c.lineTo(x+sw,y-u*2.0);c.lineTo(x-u*0.85+sw*0.5,y-u*2.5);c.closePath();c.fillStyle=col;c.fill();c.strokeStyle=M.gold;c.lineWidth=u*0.08;c.stroke();
    c.fillStyle=M.gold;c.fillRect(x-u*0.12+sw*0.2,y-u*5.1,u*0.24,u*2.2);c.fillRect(x-u*0.5+sw*0.2,y-u*4.5,u*1.0,u*0.22);TH.ell(c,x+sw*0.3,y-u*3.2,u*0.2,u*0.2,M.gold);}},
  brazier:{cat:'prop',w:1.0,tier:3,weight:2.5,cost:1,max:2,draw(c,x,y,u,v,tm){const t=tm||0;msh(c,x,y,u,u*2);[[-0.7,0.15],[0.7,0.15],[0,-0.3]].forEach(([dx,dy])=>TH.ln(c,[x+dx*u,y+dy*u],[x+dx*u*0.5,y-u*1.4],'#2b2f3a',u*0.14));
    c.beginPath();c.moveTo(x-u*0.9,y-u*1.5);c.quadraticCurveTo(x,y-u*0.7,x+u*0.9,y-u*1.5);c.ellipse(x,y-u*1.5,u*0.9,u*0.36,0,0,Math.PI,true);c.closePath();c.fillStyle='#3b3f4a';c.fill();TH.ell(c,x,y-u*1.5,u*0.9,u*0.36,'#1d1f27');
    mglow(c,x,y-u*2.0,u*2.6,0.4+0.1*Math.sin(t*8+v));[[0,1.2,0.9],[-0.4,0.8,0.6],[0.4,0.85,0.65]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*10+i*2+v)*u*0.1;TH.poly(c,[[x+dx*u-u*0.35*w,y-u*1.5],[x+dx*u+f,y-u*(1.5+h*1.4)],[x+dx*u+u*0.35*w,y-u*1.5]],i?'#fbbf24':'#f97316');});TH.poly(c,[[x-u*0.15,y-u*1.5],[x+(Math.sin(t*9)*0.05)*u,y-u*2.4],[x+u*0.15,y-u*1.5]],'#fff3b0');}},
  weaponRack:{cat:'prop',w:1.9,tier:3,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);msh(c,x,y,u*2,u*3);[-1.6,1.6].forEach(X=>TH.ln(c,I(X,0,0),I(X,0,2.4),'#6b4a2b',u*0.24));TH.ln(c,I(-1.8,0,1.6),I(1.8,0,1.6),'#4a3320',u*0.2);TH.ln(c,I(-1.8,0,0.6),I(1.8,0,0.6),'#4a3320',u*0.18);
    [-1.2,-0.7,-0.2].forEach((X,i)=>{TH.ln(c,I(X,0.1,0.2),I(X+0.12,0.1,3.1),'#8a6238',u*0.09);TH.poly(c,[I(X+0.06,0.1,3.0),I(X+0.18,0.1,3.0),I(X+0.12,0.1,3.5)],'#c3c8cf');});
    [0.5,0.95,1.4].forEach(X=>{TH.ln(c,I(X,0.1,0.5),I(X,0.1,2.2),'#d5dae6',u*0.1);TH.ln(c,I(X-0.2,0.1,1.0),I(X+0.2,0.1,1.0),'#8a6238',u*0.1);});
    const sp=I(2.3,0.5,0.7);TH.ell(c,sp[0],sp[1],u*0.5,u*0.55,'#b3342f');TH.ell(c,sp[0],sp[1],u*0.5,u*0.55,'rgba(0,0,0,.15)');c.strokeStyle='#e0b53a';c.lineWidth=u*0.07;c.beginPath();c.arc(sp[0],sp[1],u*0.4,0,7);c.stroke();TH.ell(c,sp[0],sp[1],u*0.12,u*0.12,'#c9cbd2');}},
  archeryTarget:{cat:'prop',w:1.5,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){msh(c,x,y,u*1.5,u*3);[-0.9,0.9].forEach(s=>TH.ln(c,[x+s*u*0.3,y-u*1.6],[x+s*u*1.1,y+u*0.1],'#6b4a2b',u*0.18));TH.ln(c,[x,y-u*1.6],[x,y+u*0.3],'#6b4a2b',u*0.18);
    const cy=y-u*2.2;TH.ell(c,x,cy,u*1.35,u*1.45,'#c9a84a');[['#f8fafc',1.2],['#1f2937',0.95],['#2f6fb0',0.72],['#d9342b',0.5],['#f2c230',0.26]].forEach(([col,s])=>TH.ell(c,x,cy,u*1.35*s,u*1.45*s,col));
    [[0.3,-0.2],[-0.35,0.3],[0.55,0.45]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u,cy+dy*u],[x+dx*u+u*0.9,cy+dy*u-u*0.55],'#a67c52',u*0.07);TH.poly(c,[[x+dx*u+u*0.75,cy+dy*u-u*0.5],[x+dx*u+u*1.1,cy+dy*u-u*0.55],[x+dx*u+u*0.95,cy+dy*u-u*0.75]],'#d9342b');});}},
  campfire:{cat:'prop',w:1.5,tier:1,weight:2.5,cost:1,max:1,draw(c,x,y,u,v,tm){const t=tm||0;msh(c,x,y,u*1.5,u*2);TH.ell(c,x,y+u*0.1,u*1.3,u*0.55,'#4a3a2a');for(let k=0;k<10;k++){const a=k/10*6.283;TH.ell(c,x+Math.cos(a)*u*1.05,y+u*0.1+Math.sin(a)*u*0.45,u*0.3,u*0.2,['#8d939b','#7d838b'][k%2]);}
    TH.ln(c,[x-u*0.8,y+u*0.1],[x+u*0.7,y-u*0.4],'#4a3320',u*0.26);TH.ln(c,[x+u*0.8,y+u*0.15],[x-u*0.6,y-u*0.4],'#5a4028',u*0.26);
    [[-1.6,0.1],[1.6,0.1],[0,-0.7]].forEach(([dx,dy])=>TH.ln(c,[x+dx*u,y+dy*u+u*0.2],[x+dx*u*0.2,y-u*2.6],'#3b3f4a',u*0.1));TH.ln(c,[x,y-u*2.6],[x,y-u*1.8],'#3b3f4a',u*0.05);TH.ell(c,x,y-u*1.5,u*0.55,u*0.38,'#2b2f3a');TH.ell(c,x,y-u*1.65,u*0.45,u*0.15,'#6b5a3a');
    mglow(c,x,y-u*0.6,u*2.6,0.5+0.1*Math.sin(t*9));[[0,1.0,0.9],[-0.35,0.75,0.6],[0.35,0.8,0.65]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*11+i*2+v)*u*0.12;TH.poly(c,[[x+dx*u-u*0.38*w,y-u*0.05],[x+dx*u+f,y-u*(0.1+h*1.2)],[x+dx*u+u*0.38*w,y-u*0.05]],i?'#fbbf24':'#f97316');});
    for(let k=0;k<4;k++){const ph=(t*0.6+k*0.25)%1;c.fillStyle='rgba(70,70,76,'+(0.4*(1-ph))+')';c.beginPath();c.ellipse(x+Math.sin(ph*5+k)*u*0.3,y-u*(2.4+ph*2.4),u*(0.25+ph*0.5),u*(0.2+ph*0.4),0,0,7);c.fill();}}},
  signpost:{cat:'prop',w:1.0,tier:1,weight:3,cost:1,max:1,draw(c,x,y,u,v){msh(c,x,y,u,u*3);TH.ln(c,[x,y],[x,y-u*3.2],'#6b4a2b',u*0.26);TH.ln(c,[x-u*0.08,y],[x-u*0.08,y-u*3.1],'#9a7040',u*0.07);
    [[1,-2.7,'#c9a56a'],[-1,-1.9,'#b88f56']].forEach(([s,dy,col])=>{TH.poly(c,[[x,y+dy*u-u*0.32],[x+s*u*1.5,y+dy*u-u*0.32],[x+s*u*1.95,y+dy*u],[x+s*u*1.5,y+dy*u+u*0.32],[x,y+dy*u+u*0.32]],col,'#4a3320',u*0.05);TH.ln(c,[x+s*u*0.25,y+dy*u],[x+s*u*1.3,y+dy*u],'rgba(60,35,10,.5)',u*0.07);});}},
  tent:{cat:'prop',w:2.5,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v,tm){const R=u*2.4,H=u*3.9,N=12;msh(c,x,y,R,u*4);TH.ell(c,x,y,R*1.02,R*0.48,'#6b7d4a');const apex=[x,y-H];
    for(let i=0;i<N;i++){const a0=i/N*6.283,a1=(i+1)/N*6.283;TH.poly(c,[apex,[x+Math.cos(a0)*R,y+Math.sin(a0)*R*0.48],[x+Math.cos(a1)*R,y+Math.sin(a1)*R*0.48]],i%2?'#f1ece0':(v%2?M.red:M.blue),'rgba(40,30,20,.25)',u*0.03);}
    for(let i=0;i<N*2;i++){const a0=i/(N*2)*6.283;if(Math.sin(a0)>-0.1){const px=x+Math.cos(a0)*R,py=y+Math.sin(a0)*R*0.48;TH.poly(c,[[px,py],[px+Math.cos(a0+0.26)*R*0.0+u*0.3,py],[px+u*0.15,py+u*0.35]],i%2?'#f1ece0':(v%2?M.red:M.blue));}}
    c.beginPath();c.moveTo(x-u*0.5,y+R*0.46);c.lineTo(x,y-u*1.6);c.lineTo(x+u*0.5,y+R*0.46);c.closePath();c.fillStyle='#2a1e14';c.fill();TH.poly(c,[[x-u*0.5,y+R*0.46],[x,y-u*1.6],[x-u*0.1,y+R*0.46]],'#ece4d0');
    mflag(c,x,y-H,u,1.6,v%2?M.red:M.blue,tm,v);[[-1.0,0.7],[1.0,0.7],[0,-0.9]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*R*0.55,y+dy*R*0.3-u*1.0],[x+dx*R*1.15,y+dy*R*0.55],'rgba(220,210,180,.8)',u*0.04);TH.ln(c,[x+dx*R*1.15,y+dy*R*0.55],[x+dx*R*1.15,y+dy*R*0.55+u*0.2],'#6b4a2b',u*0.1);});}},
  cottage:{cat:'structure',w:2.6,tier:3,weight:3,cost:2,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0;msh(c,x,y,u*3,u*4);
    TH.box(c,x,y,u,-2.0,2.0,-1.5,1.5,0,2.2,M.plaster,'#c9bd9e','#f2ead2');
    [-2.0,-0.6,0.8,2.0].forEach(X=>TH.ln(c,I(X,1.51,0),I(X,1.51,2.2),M.timberD,u*0.16));[0.9,2.2].forEach(Z=>TH.ln(c,I(-2.0,1.51,Z),I(2.0,1.51,Z),M.timberD,u*0.16));TH.ln(c,I(0.8,1.51,0.9),I(2.0,1.51,2.2),M.timberD,u*0.12);TH.ln(c,I(-2.0,1.51,0.9),I(-0.6,1.51,2.2),M.timberD,u*0.12);
    TH.poly(c,[I(-0.45,1.52,0),I(0.45,1.52,0),I(0.45,1.52,1.6),I(-0.45,1.52,1.6)],'#5a3b22','#2b1b0e',u*0.05);TH.poly(c,[I(1.0,1.52,1.0),I(1.8,1.52,1.0),I(1.8,1.52,1.8),I(1.0,1.52,1.8)],'#7dc2e8','#4a3320',u*0.07);TH.poly(c,[I(1.0,1.53,1.0),I(0.7,1.53,1.0),I(0.7,1.53,1.8),I(1.0,1.53,1.8)],'#7a5836');TH.poly(c,[I(1.8,1.53,1.0),I(2.1,1.53,1.0),I(2.1,1.53,1.8),I(1.8,1.53,1.8)],'#7a5836');
    mbox(c,x,y,u,-1.5,-0.9,-1.2,-0.6,2.0,4.6,0.0);
    TH.poly(c,[I(2.0,-1.5,2.2),I(2.0,1.5,2.2),I(2.0,0,3.9)],'#d9cfb2');TH.poly(c,[I(-2.5,1.9,2.1),I(2.5,1.9,2.1),I(2.5,0,3.95),I(-2.5,0,3.95)],M.thatch);
    for(let k=1;k<5;k++)TH.ln(c,I(-2.5,1.9-k*0.38,2.1+k*0.37),I(2.5,1.9-k*0.38,2.1+k*0.37),'rgba(120,90,30,.45)',u*0.06);TH.ln(c,I(-2.5,1.9,2.1),I(2.5,1.9,2.1),M.thatchD,u*0.14);TH.ln(c,I(-2.5,0,3.95),I(2.5,0,3.95),'#c4a243',u*0.14);
    const top=I(-1.2,-0.9,4.6);for(let k=0;k<4;k++){const ph=(t*0.5+k*0.25)%1;c.fillStyle='rgba(200,200,205,'+(0.5*(1-ph))+')';c.beginPath();c.ellipse(top[0]+Math.sin(ph*4+k)*u*0.3+ph*u*0.6,top[1]-ph*u*3.0-u*0.2,u*(0.25+ph*0.5),u*(0.2+ph*0.4),0,0,7);c.fill();}}},
  /* ---------- landmarks ---------- */
  roundTower:{cat:'landmark',w:2.3,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const rx=2.1;msh(c,x,y,u*2.4,u*9);mcyl(c,x,y,u,0,0,2.5,0,0.5,M.stoneD);const q=mcyl(c,x,y,u,0,0,rx,0.5,8.0,M.stone);
    c.strokeStyle='rgba(45,52,66,.28)';c.lineWidth=u*0.04;for(let z=1.0;z<8.0;z+=0.55){const p=TH.iso(x,y,u,0,0,z);c.beginPath();c.ellipse(p[0],p[1],rx*u*0.99,rx*u*0.495,0,0,Math.PI);c.stroke();}
    [[0.55,2.3],[-0.45,4.2],[0.35,6.2]].forEach(([a,z])=>{const px=x+Math.sin(a)*rx*u*0.99,pz=TH.iso(x,y,u,0,0,z)[1]+Math.cos(a)*rx*u*0.495;c.fillStyle='#161a26';c.fillRect(px-u*0.1,pz-u*0.5,u*0.2,u*0.9);});
    const dp=TH.iso(x,y,u,0,0,0.5);c.beginPath();c.moveTo(dp[0]-u*0.45,dp[1]+rx*u*0.49);c.lineTo(dp[0]-u*0.45,dp[1]+rx*u*0.49-u*1.4);c.arc(dp[0],dp[1]+rx*u*0.49-u*1.4,u*0.45,Math.PI,0);c.lineTo(dp[0]+u*0.45,dp[1]+rx*u*0.49);c.closePath();c.fillStyle='#4a3320';c.fill();
    const rimC=mcyl(c,x,y,u,0,0,2.6,8.0,8.45,M.stoneL);for(let i=0;i<14;i++){const a=i/14*Math.PI,px=rimC[0]+Math.cos(a)*u*2.6*0.99,py=rimC[1]+Math.sin(a)*u*2.6*0.495;if(i%2===0){c.fillStyle=M.stoneL;c.fillRect(px-u*0.25,py-u*0.45,u*0.5,u*0.6);c.fillStyle='rgba(30,36,50,.35)';c.fillRect(px+u*0.02,py-u*0.45,u*0.23,u*0.6);}}
    TH.ell(c,rimC[0],rimC[1],u*2.2*0.99,u*2.2*0.495,'#6e747c');mcone(c,x,y,u,0,0,1.9,8.45,12.4,'#b3342f');const ap=TH.iso(x,y,u,0,0,12.4);mflag(c,ap[0],ap[1],u,1.8,M.gold,tm,v);}},
  windmill:{cat:'landmark',w:2.4,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0;msh(c,x,y,u*2.6,u*9);
    [[-1.4,-1.0],[1.4,-1.0],[-1.4,1.0],[1.4,1.0]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(X*0.3,Y*0.3,3.0),'#6b4a2b',u*0.24));TH.ln(c,I(0,0,0),I(0,0,3.2),'#4a3320',u*0.5);[-1.0,1.0].forEach(Y=>TH.ln(c,I(-1.4,Y,1.0),I(1.4,Y,1.0),'#8a6238',u*0.12));
    TH.box(c,x,y,u,-1.3,1.3,-1.1,1.1,3.0,6.4,'#a97d49','#7d5a34','#c49858');for(let k=1;k<8;k++)TH.ln(c,I(-1.3,1.11,3.0+k*0.42),I(1.3,1.11,3.0+k*0.42),'rgba(60,35,10,.3)',u*0.04);
    TH.poly(c,[I(1.3,-1.1,6.4),I(1.3,1.1,6.4),I(1.3,0,7.9)],'#8a6238');TH.poly(c,[I(-1.5,1.3,6.3),I(1.5,1.3,6.3),I(1.5,0,8.0),I(-1.5,0,8.0)],'#6b4a2b');for(let k=1;k<4;k++)TH.ln(c,I(-1.5,1.3-k*0.43,6.3+k*0.42),I(1.5,1.3-k*0.43,6.3+k*0.42),'rgba(30,18,6,.4)',u*0.05);
    TH.poly(c,[I(-0.45,1.12,3.0),I(0.45,1.12,3.0),I(0.45,1.12,4.3),I(-0.45,1.12,4.3)],'#4a3320');TH.ln(c,I(1.45,-0.6,0),I(1.45,1.0,3.0),'#6b4a2b',u*0.14);
    const hub=I(0,1.25,5.2);for(let k=0;k<4;k++){const a=t*0.6+k*Math.PI/2,ca=Math.cos(a),sa=Math.sin(a),e=I(ca*4.4,1.25,5.2+sa*4.4),b1=I(ca*0.5-sa*0.35,1.25,5.2+sa*0.5+ca*0.35),b2=I(ca*0.5+sa*0.35,1.25,5.2+sa*0.5-ca*0.35),e1=I(ca*4.4-sa*0.55,1.25,5.2+sa*4.4+ca*0.55),e2=I(ca*4.4+sa*0.55,1.25,5.2+sa*4.4-ca*0.55);
      TH.ln(c,hub,e,'#4a3320',u*0.14);TH.poly(c,[b1,e1,e2,b2],'rgba(238,228,200,.85)','#6b4a2b',u*0.06);for(let j=1;j<5;j++){const f=j/5;TH.ln(c,[b1[0]+(e1[0]-b1[0])*f,b1[1]+(e1[1]-b1[1])*f],[b2[0]+(e2[0]-b2[0])*f,b2[1]+(e2[1]-b2[1])*f],'#8a6238',u*0.05);}}
    TH.ell(c,hub[0],hub[1],u*0.3,u*0.3,'#2b1b0e');}},
  gatehouse:{cat:'landmark',w:3.4,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);msh(c,x,y,u*3.6,u*7);
    mbox(c,x,y,u,-1.5,1.5,-1.1,1.1,0,4.4,-0.02);mortar(c,x,y,u,-1.5,1.5,1.11,0,4.4);merl(c,x,y,u,-1.5,1.5,-1.1,1.1,4.4);
    [-1,1].forEach(s=>{});
    const tw=(X0,X1)=>{mbox(c,x,y,u,X0,X1,-1.3,1.3,0,7.0,0.04);mortar(c,x,y,u,X0,X1,1.31,0,7.0);mortarE(c,x,y,u,X1,-1.3,1.3,0,7.0);merl(c,x,y,u,X0,X1,-1.3,1.3,7.0);
      TH.poly(c,TH.arch(x,y,u,1.32,(X0+X1)/2,0.22,4.3,5.0,5.8),'#161a26');TH.poly(c,TH.arch(x,y,u,1.32,(X0+X1)/2,0.22,1.8,2.5,3.3),'#161a26');};
    tw(-3.5,-1.5);mbox(c,x,y,u,-1.5,1.5,-1.1,1.1,0,4.4,-0.02);mortar(c,x,y,u,-1.5,1.5,1.11,0,4.4);merl(c,x,y,u,-1.5,1.5,-1.1,1.1,4.4);
    const ap=TH.arch(x,y,u,1.12,0,1.0,0,2.6,3.5);TH.poly(c,ap,'#10131c');c.strokeStyle='#3b3f4a';c.lineWidth=u*0.08;for(let X=-0.8;X<=0.85;X+=0.4){TH.ln(c,I(X,1.13,0.1),I(X,1.13,3.0-Math.abs(X)*0.6),'#4a4f5c',u*0.07);}for(let Z=0.8;Z<3.1;Z+=0.7)TH.ln(c,I(-0.9,1.13,Z),I(0.9,1.13,Z),'#4a4f5c',u*0.07);
    TH.poly(c,[I(-0.9,1.1,0.05),I(0.9,1.1,0.05),I(1.0,3.4,0.0),I(-1.0,3.4,0.0)],'#8a6238','#4a3320',u*0.06);for(let k=1;k<5;k++)TH.ln(c,I(-0.95,1.1+k*0.46,0.02),I(0.95,1.1+k*0.46,0.02),'rgba(40,25,10,.4)',u*0.05);
    tw(1.5,3.5);const f1=I(-2.5,0,7.0),f2=I(2.5,0,7.0);mflag(c,f1[0],f1[1],u,2.4,M.red,tm,1);mflag(c,f2[0],f2[1],u,2.4,M.blue,tm,2);
    const bn=I(0,1.14,4.1);c.beginPath();c.moveTo(bn[0]-u*0.5,bn[1]-u*0.2);c.lineTo(bn[0]+u*0.5,bn[1]-u*0.2);c.lineTo(bn[0]+u*0.5,bn[1]+u*1.2);c.lineTo(bn[0],bn[1]+u*0.9);c.lineTo(bn[0]-u*0.5,bn[1]+u*1.2);c.closePath();c.fillStyle=M.red;c.fill();}},
  castleKeep:{cat:'landmark',w:4.6,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);msh(c,x,y,u*4.8,u*10);
    mcyl(c,x,y,u,-3.4,-3.4,1.0,0,5.0,M.stone);mcone(c,x,y,u,-3.4,-3.4,1.25,5.0,7.6,'#b3342f');mcyl(c,x,y,u,3.2,-3.4,1.0,0,5.0,M.stone);mcone(c,x,y,u,3.2,-3.4,1.25,5.0,7.6,'#2f4f8f');
    mbox(c,x,y,u,-2.2,2.2,-2.2,2.2,0,8.6,-0.02);mortar(c,x,y,u,-2.2,2.2,2.21,0,8.6);mortarE(c,x,y,u,2.2,-2.2,2.2,0,8.6);merl(c,x,y,u,-2.2,2.2,-2.2,2.2,8.6);
    [[-1.3,6.4],[0.5,4.6],[1.4,6.4]].forEach(([X,Z])=>TH.poly(c,TH.arch(x,y,u,2.22,X,0.28,Z-0.2,Z+0.55,Z+1.3),'#161a26'));
    TH.poly(c,TH.arch(x,y,u,2.22,0,0.85,0,2.0,3.1),'#10131c');mcone(c,x,y,u,-1.2,-1.2,1.3,8.6,12.0,'#b3342f');
    mcyl(c,x,y,u,-3.4,3.4,1.1,0,5.6,M.stone);mcone(c,x,y,u,-3.4,3.4,1.35,5.6,8.4,'#2f4f8f');
    mbox(c,x,y,u,-4.6,3.6,3.0,3.8,0,2.6,-0.06);merl(c,x,y,u,-4.6,3.6,3.0,3.8,2.6);mortar(c,x,y,u,-4.6,3.6,3.81,0,2.6);TH.poly(c,TH.arch(x,y,u,3.82,-0.5,0.8,0,1.6,2.3),'#10131c');for(let X=-1.1;X<=0.15;X+=0.35)TH.ln(c,I(X,3.83,0.1),I(X,3.83,2.0-Math.abs(X+0.5)*0.5),'#4a4f5c',u*0.06);
    mcyl(c,x,y,u,3.4,3.4,1.1,0,5.6,M.stone);mcone(c,x,y,u,3.4,3.4,1.35,5.6,8.4,'#b3342f');
    const f=I(1.4,-0.2,12.0);mflag(c,I(1.4,1.0,8.6)[0],I(1.4,1.0,8.6)[1],u,4.2,M.gold,tm,1);const f2=I(-1.2,-1.2,12.0);mflag(c,f2[0],f2[1],u,1.8,M.red,tm,3);}}
  }};
const MEDIEVAL_HEIGHT={bush:'low',wheatPatch:'low',boulders:'low',ruinedWall:'low',hayStack:'low',woodFence:'low',well:'low',merchantCart:'low',barrelCrates:'low',brazier:'low',weaponRack:'low',archeryTarget:'low',campfire:'low',signpost:'low',
  oakTree:'mid',appleTree:'mid',marketStall:'mid',bannerPole:'mid',tent:'mid',cottage:'mid',roundTower:'tall',windmill:'tall',gatehouse:'tall',castleKeep:'tall'};
Object.keys(MEDIEVAL_PACK.assets).forEach(id=>{MEDIEVAL_PACK.assets[id].h=MEDIEVAL_HEIGHT[id]||'low';});
const KEEP_OUT={rx:0.52,ry:0.34};   // central ellipse (x R) reserved for the ride or building sprite
function placeThemeAssets(pack,tier,R,seed){
  const rnd=mulberry(seed*7919+tier*131), u=R*0.068, T=pack.tiers[tier], out=[], decals=[], TAU=Math.PI*2;
  if(!T)return {assets:out,decals,u};
  const inside=(x,y,k)=>{const X=Math.abs(x)/R,Y=Math.abs(y)/(0.58*R);return X<=0.866*k&&Y<=k-X/1.732;};
  const ids=Object.keys(pack.assets), cnt={};
  const free=(x,y,w)=>out.every(o=>Math.hypot(o.x-x,(o.y-y)*1.7)>(o.w+w)*u*0.8);
  const clearOfCenter=(x,y,w,h)=>{const kx=h==='tall'?0.28:0.75,ky=h==='tall'?0.18:0.4,ex=R*KEEP_OUT.rx+w*u*kx,ey=R*KEEP_OUT.ry+w*u*ky;return x*x/(ex*ex)+y*y/(ey*ey)>1;};
  const zoneOK=(a,x,y)=>{const h=a.h||'low';if(h==='low')return true;const ax=Math.abs(x)/R;
    if(h==='tall')return y<R*0.12&&ax>(y>=-R*0.12?0.55:0.4);
    if(y>R*0.12)return h==='mid'&&ax>0.5;if(y>=-R*0.12)return h==='mid'||ax>0.55;return true;};
  const ringPoint=(tmax)=>{const th=rnd()*TAU,dx=Math.cos(th),dy=Math.sin(th);let lo=0,hi=R*1.2;
    for(let i=0;i<12;i++){const m=(lo+hi)/2;if(inside(dx*m,dy*m,0.9))lo=m;else hi=m;}const t=0.5+rnd()*((tmax||1)-0.5);return[dx*lo*t,dy*lo*t];};
  const spot=a=>{for(let i=0;i<120;i++){const p=ringPoint(a.h==='tall'?0.8:a.h==='mid'?0.92:1);if(clearOfCenter(p[0],p[1],a.w,a.h)&&zoneOK(a,p[0],p[1])&&free(p[0],p[1],a.w))return p;}return null;};
  const add=(id,x,y)=>{const a=pack.assets[id];out.push({id,x,y,v:Math.floor(rnd()*1000),w:a.w});cnt[id]=(cnt[id]||0)+1;};
  for(let i=0;i<T.decals;i++){const pool=ids.filter(id=>pack.assets[id].cat==='decal'&&pack.assets[id].tier<=tier),id=pool[Math.floor(rnd()*pool.length)];
    for(let t=0;t<40;t++){const p=ringPoint();if(clearOfCenter(p[0],p[1],pack.assets[id].w*0.5)){decals.push({id,x:p[0],y:p[1],v:Math.floor(rnd()*1000)});break;}}}
  let budget=T.budget;
  const land=()=>{let id=T.pool[Math.floor(rnd()*T.pool.length)];for(let q=0;q<8&&cnt[id];q++)id=T.pool[Math.floor(rnd()*T.pool.length)];
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}};
  if(T.pool.length&&rnd()<T.landmark){land();if(T.second&&rnd()<T.second)land();}
  let guard=0;while(budget>0&&guard++<500){const pool=ids.filter(id=>{const a=pack.assets[id];return a.cat!=='decal'&&a.cat!=='landmark'&&a.tier<=tier&&a.cost<=budget&&(cnt[id]||0)<(a.max||3);});
    if(!pool.length)break;let tot=0;pool.forEach(id=>tot+=pack.assets[id].weight);let pick=rnd()*tot,id=pool[0];for(const q of pool){pick-=pack.assets[q].weight;if(pick<=0){id=q;break;}}
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}else{cnt[id]=99;}}
  return {assets:out,decals,u};
}
function drawThemeGround(ctx,cx,cy,R,pack,border){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);ctx[i?'lineTo':'moveTo'](cx+R*Math.cos(a),cy+R*Math.sin(a)*0.58);}ctx.closePath();
  ctx.fillStyle=pack.ground;ctx.fill();if(border!==false){ctx.lineWidth=Math.max(1.5,R*0.03);ctx.strokeStyle=border||pack.border;ctx.stroke();}}
function drawThemeDecals(ctx,cx,cy,pack,pl,tm){pl.decals.forEach(d=>pack.assets[d.id].draw(ctx,cx+d.x,cy+d.y,pl.u,d.v,tm||0));}
/* layer: 'back' (y<0, draw BEFORE the ride sprite), 'front' (y>=0, draw AFTER it) or omit for all, sorted by y */
function drawThemeAssets(ctx,cx,cy,pack,pl,tm,layer){pl.assets.filter(o=>layer==='back'?o.y<0:layer==='front'?o.y>=0:true).sort((a,b)=>a.y-b.y).forEach(o=>pack.assets[o.id].draw(ctx,cx+o.x,cy+o.y,pl.u,o.v,tm||0));}
function drawThemedTile(ctx,cx,cy,R,pack,tier,seed,tm,border,rideFn){drawThemeGround(ctx,cx,cy,R,pack,border);const pl=placeThemeAssets(pack,tier,R,seed);
  drawThemeDecals(ctx,cx,cy,pack,pl,tm);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'back');if(rideFn)rideFn(ctx,cx,cy,R);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'front');}
return { pack: MEDIEVAL_PACK, placeThemeAssets, drawThemeGround, drawThemeDecals, drawThemeAssets };
})();

const GOTHIC_THEME_PACK = (() => {
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
/* ===== GOTHIC PACK ===== */
const G={stone:'#a3a8bb',stoneL:'#c9cddb',stoneD:'#6c7185',stoneDD:'#474b5e',moss:'#5c7a55',iron:'#1d2030',ironL:'#3b4058',wood:'#4b3a2e',glow:'#fcd34d',slate:'#3c4258'};
const sbox=(c,x,y,u,x0,x1,y0,y1,z0,z1,k)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,k?shade(G.stone,k):G.stone,k?shade(G.stoneD,k):G.stoneD,k?shade(G.stoneL,k):G.stoneL);
const gsh=(c,x,y,rx,h)=>{c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
const glow=(c,x,y,r,a)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(252,211,77,'+a+')');g.addColorStop(1,'rgba(252,211,77,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();};
const moss=(c,x,y,u,r)=>{for(let k=0;k<3;k++)TH.ell(c,x+(r()-0.5)*u*0.8,y-r()*u*0.2,u*(0.2+r()*0.2),u*0.1,'rgba(92,122,85,.8)');};
const GOTHIC_PACK={id:'gothic',name:'Gothic',ground:'#5f687e',groundDark:'#4d5569',border:'#3b4357',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},
         3:{budget:11,decals:4,landmark:0.75,pool:['mausoleum','ruinedArch','chapelSpire']},
         4:{budget:15,decals:5,landmark:1,pool:['cathedralRuin','mausoleum','chapelSpire','ruinedArch'],second:0.45}},
  assets:{
  /* ---------- ground decals ---------- */
  fogBank:{cat:'decal',w:3,tier:1,weight:4,cost:0,draw(c,x,y,u,v,tm){const r=mulberry(v+3);for(let k=0;k<5;k++){const ox=(r()-0.5)*u*2.4+Math.sin((tm||0)*0.35+k*1.7)*u*0.5,oy=(r()-0.5)*u*0.5;
    c.fillStyle='rgba(225,230,245,'+(0.15+r()*0.12)+')';c.beginPath();c.ellipse(x+ox,y+oy,u*(1.4+r()*1.2),u*(0.5+r()*0.35),0,0,7);c.fill();}}},
  cobbles:{cat:'decal',w:2.2,tier:1,weight:3,cost:0,draw(c,x,y,u,v){c.save();c.beginPath();c.ellipse(x,y,u*2.2,u*1.0,0,0,7);c.clip();c.fillStyle='#454b5f';c.fillRect(x-u*2.3,y-u*1.1,u*4.6,u*2.2);
    for(let i=-6;i<=6;i++)for(let j=-3;j<=3;j++)TH.ell(c,x+(i+(Math.abs(j)%2)*0.5)*u*0.42,y+j*u*0.3,u*0.19,u*0.12,['#767c93','#6a7086','#838aa1'][Math.abs(i*7+j*3+v)%3]);c.restore();}},
  deadLeaves:{cat:'decal',w:2,tier:1,weight:3,cost:0,draw(c,x,y,u,v){const r=mulberry(v+8);for(let k=0;k<22;k++){const a=r()*6.283,rr=Math.sqrt(r());TH.ell(c,x+Math.cos(a)*u*1.9*rr,y+Math.sin(a)*u*0.85*rr,u*0.14,u*0.07,['#6b4a32','#4e3626','#7a3a32','#5a4a30'][k%4],r()*3);}}},
  mistPuddle:{cat:'decal',w:1.6,tier:2,weight:2,cost:0,draw(c,x,y,u,v){TH.ell(c,x,y,u*1.7,u*0.75,'#2a2f45');TH.ell(c,x-u*0.15,y-u*0.05,u*1.4,u*0.55,'#363c58');c.strokeStyle='rgba(180,195,235,.55)';c.lineWidth=u*0.07;c.beginPath();c.ellipse(x-u*0.1,y-u*0.05,u*1.05,u*0.38,0,Math.PI*1.05,Math.PI*1.6);c.stroke();TH.ell(c,x+u*0.5,y+u*0.08,u*0.2,u*0.08,'rgba(200,215,250,.6)');}},
  /* ---------- plants ---------- */
  brambles:{cat:'plant',w:1.4,tier:1,weight:3,cost:1,draw(c,x,y,u,v){const r=mulberry(v*11+2);gsh(c,x,y,u*1.3,u);
    for(let k=0;k<9;k++){const a=-0.4-r()*2.3,l=u*(1.0+r()*1.1),x1=x+Math.cos(a)*l,y1=y-Math.abs(Math.sin(a))*l*0.9;c.strokeStyle=k%2?'#2a2433':'#3d3248';c.lineWidth=u*0.09;c.lineCap='round';c.beginPath();c.moveTo(x+(r()-0.5)*u*0.5,y);
      c.quadraticCurveTo(x+(x1-x)*0.3+(r()-0.5)*u*0.6,y1+u*0.3,x1,y1);c.stroke();for(let t=1;t<4;t++){const tx=x+(x1-x)*t/4,ty=y+(y1-y)*t/4;TH.ln(c,[tx,ty],[tx+(r()-0.5)*u*0.35,ty-u*0.18],'#6a5a78',u*0.04);}}
    [[-0.5,-0.9],[0.5,-1.1],[0.0,-0.6]].forEach(([dx,dy])=>{TH.ell(c,x+dx*u,y+dy*u,u*0.2,u*0.18,'#8a1c3a');TH.ell(c,x+dx*u,y+dy*u,u*0.1,u*0.09,'#c23660');});}},
  mushrooms:{cat:'plant',w:1.1,tier:1,weight:3,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*7+4);gsh(c,x,y,u*1.1,u);
    [[0,0,1],[-0.8,0.2,0.7],[0.75,0.25,0.62]].forEach(([dx,dy,s],i)=>{const px=x+dx*u,py=y+dy*u,g=0.35+0.15*Math.sin((tm||0)*2+i);
      const gr=c.createRadialGradient(px,py-u*s,0,px,py-u*s,u*1.3*s);gr.addColorStop(0,'rgba(160,140,255,'+g+')');gr.addColorStop(1,'rgba(160,140,255,0)');c.fillStyle=gr;c.beginPath();c.arc(px,py-u*s,u*1.3*s,0,7);c.fill();
      TH.ln(c,[px,py],[px,py-u*0.9*s],'#d8d2e8',u*0.3*s);TH.ell(c,px,py-u*0.95*s,u*0.75*s,u*0.46*s,['#7c5aa6','#5b6fc2','#8b5fbf'][i]);TH.ell(c,px-u*0.1*s,py-u*1.02*s,u*0.5*s,u*0.26*s,'rgba(255,255,255,.2)');
      for(let k=0;k<4;k++)TH.ell(c,px+(k-1.5)*u*0.25*s,py-u*(0.95+(k%2)*0.12)*s,u*0.07*s,u*0.05*s,'#efe9ff');});}},
  ivyBush:{cat:'plant',w:1.5,tier:1,weight:3,cost:1,draw(c,x,y,u,v){const r=mulberry(v*3+6);gsh(c,x,y,u*1.5,u);
    [[-0.7,-0.5,0.9,'#2f4a33'],[0.7,-0.5,0.85,'#3a5a3c'],[0,-0.95,1.0,'#46684a'],[-0.1,-0.45,0.9,'#35553a']].forEach(([dx,dy,s,col])=>TH.blob(c,x+dx*u,y+dy*u,u*s,u*s*0.72,col,r,9));
    for(let k=0;k<10;k++)TH.ell(c,x+(r()-0.5)*u*1.9,y-u*(0.3+r()*1.1),u*0.13,u*0.08,['#6f9a68','#56804f'][k%2],r()*3);}},
  /* ---------- trees ---------- */
  deadOak:{cat:'tree',w:1.8,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*23+5);gsh(c,x,y,u*1.9,u*5);let tip=null;
    for(let k=0;k<4;k++)TH.ln(c,[x,y],[x+(k-1.5)*u*0.6,y+u*0.2],'#2f2824',u*(0.32-k%2*0.08));
    const br=(px,py,ang,len,wd,d)=>{const nx=px+Math.cos(ang)*len,ny=py+Math.sin(ang)*len;TH.ln(c,[px,py],[nx,ny],'#241f1d',wd+u*0.07);TH.ln(c,[px,py],[nx,ny],'#4a403a',wd);TH.ln(c,[px-wd*0.2,py],[nx-wd*0.2,ny],'#6d625a',wd*0.22);
      if(!tip||ny<tip[1])tip=[nx,ny];if(d>0){const n=d>1?3:2;for(let k=0;k<n;k++)br(nx,ny,ang+(k-(n-1)/2)*0.9+(r()-0.5)*0.6,len*(0.64+r()*0.2),wd*0.62,d-1);}};
    br(x,y,-1.57+(r()-0.5)*0.4,u*(2.1+r()*0.6),u*0.5,3);
    for(let k=0;k<4;k++){const sx=x+(r()-0.5)*u*2.4,sy=y-u*(2.6+r()*1.8);c.strokeStyle='rgba(140,165,130,.6)';c.lineWidth=u*0.05;c.beginPath();c.moveTo(sx,sy);c.quadraticCurveTo(sx+u*0.1,sy+u*0.5,sx-u*0.05,sy+u*(0.8+r()*0.5));c.stroke();}
    if(v%2&&tip){const rx=tip[0],ry=tip[1];TH.ell(c,rx,ry-u*0.25,u*0.3,u*0.2,'#14121c');TH.ell(c,rx+u*0.28,ry-u*0.42,u*0.14,u*0.11,'#14121c');TH.poly(c,[[rx+u*0.38,ry-u*0.42],[rx+u*0.62,ry-u*0.38],[rx+u*0.38,ry-u*0.34]],'#e4a24a');}}},
  yewTree:{cat:'tree',w:1.6,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v){const r=mulberry(v*5+9),H=u*(6+r()*1.5);gsh(c,x,y,u*1.8,H);TH.ln(c,[x,y],[x,y-u*1.2],'#2b221d',u*0.45);
    const L=5;for(let k=0;k<L;k++){const t=k/(L-1),cy=y-u*1.1-H*0.78*t,w=u*(1.8-1.25*t+0.2*r()),h=u*(2.1-0.5*t);
      TH.poly(c,[[x-w,cy+h*0.35],[x-w*0.4,cy-h*0.5],[x,cy-h*0.92],[x+w*0.4,cy-h*0.5],[x+w,cy+h*0.35],[x,cy+h*0.5]],k%2?'#22392c':'#2a4636');
      TH.poly(c,[[x,cy-h*0.92],[x+w*0.4,cy-h*0.5],[x+w,cy+h*0.35],[x+w*0.35,cy+h*0.2]],'rgba(6,18,12,.5)');TH.poly(c,[[x,cy-h*0.92],[x-w*0.4,cy-h*0.5],[x-w,cy+h*0.35],[x-w*0.5,cy+h*0.1]],'rgba(120,170,130,.12)');}}},
  /* ---------- graves ---------- */
  gravestone:{cat:'grave',w:1.1,tier:1,weight:5,cost:1,max:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),k=v%3,hw=0.75,hh=1.6+(v%2)*0.4,b=0.28,r=mulberry(v+4);gsh(c,x,y,u*1.2,u*2);
    sbox(c,x,y,u,-0.95,0.95,-0.42,0.42,0,b,-0.12);
    const top=Y=>{const p=[];if(k===0){for(let a=0;a<=10;a++){const t=a/10*Math.PI;p.push(I(Math.cos(t)*hw,Y,b+hh+Math.sin(t)*hw));}}else if(k===1){p.push(I(hw,Y,b+hh),I(0,Y,b+hh+0.95),I(-hw,Y,b+hh));}else{p.push(I(hw,Y,b+hh),I(hw*0.62,Y,b+hh+0.38),I(-hw*0.62,Y,b+hh+0.38),I(-hw,Y,b+hh));}return p;};
    TH.poly(c,[I(hw,-0.2,b),I(hw,0.2,b),I(hw,0.2,b+hh),I(hw,-0.2,b+hh)],G.stoneD);TH.poly(c,top(-0.2).concat(top(0.2).slice().reverse()),G.stoneL);TH.poly(c,[I(-hw,0.2,b),I(hw,0.2,b)].concat(top(0.2)),G.stone);
    c.strokeStyle='rgba(40,45,62,.55)';c.lineWidth=u*0.06;c.lineCap='round';if(k===1){TH.ln(c,I(0,0.21,b+hh*0.5),I(0,0.21,b+hh*0.95),'rgba(40,45,62,.55)',u*0.07);TH.ln(c,I(-0.28,0.21,b+hh*0.82),I(0.28,0.21,b+hh*0.82),'rgba(40,45,62,.55)',u*0.07);}
    for(let l=0;l<3;l++)TH.ln(c,I(-0.4+r()*0.1,0.21,b+hh*(0.55-l*0.14)),I(0.4-r()*0.1,0.21,b+hh*(0.55-l*0.14)),'rgba(40,45,62,.4)',u*0.05);moss(c,x-u*0.4,y+u*0.1,u,r);}},
  celticCross:{cat:'grave',w:1.4,tier:2,weight:3,cost:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+2);gsh(c,x,y,u*1.4,u*3.5);sbox(c,x,y,u,-1.0,1.0,-0.5,0.5,0,0.4,-0.1);sbox(c,x,y,u,-0.6,0.6,-0.3,0.3,0.4,0.8,-0.05);
    const bar=(x0,x1,z0,z1)=>{TH.poly(c,[I(x1,-0.18,z0),I(x1,0.18,z0),I(x1,0.18,z1),I(x1,-0.18,z1)],G.stoneD);TH.poly(c,[I(x0,-0.18,z1),I(x1,-0.18,z1),I(x1,0.18,z1),I(x0,0.18,z1)],G.stoneL);TH.poly(c,[I(x0,0.18,z0),I(x1,0.18,z0),I(x1,0.18,z1),I(x0,0.18,z1)],G.stone);};
    bar(-0.28,0.28,0.8,4.0);bar(-1.05,1.05,2.6,3.3);c.strokeStyle='#8c92a8';c.lineWidth=u*0.16;c.beginPath();for(let a=0;a<=24;a++){const t=a/24*6.283,p=I(Math.cos(t)*0.95,0.2,2.95+Math.sin(t)*0.95);a?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();
    c.strokeStyle=G.stoneL;c.lineWidth=u*0.05;c.stroke();for(let k=0;k<3;k++)TH.ln(c,I(-0.1,0.2,1.2+k*0.4),I(0.1,0.2,1.2+k*0.4),'rgba(40,45,62,.4)',u*0.05);moss(c,x-u*0.6,y+u*0.15,u,r);}},
  obelisk:{cat:'grave',w:1.5,tier:2,weight:2,cost:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+7);gsh(c,x,y,u*1.5,u*6);sbox(c,x,y,u,-1.3,1.3,-1.3,1.3,0,0.45,-0.1);sbox(c,x,y,u,-1.0,1.0,-1.0,1.0,0.45,0.9,-0.05);
    const b=0.9,t=0.38,H=6.2;TH.poly(c,[I(1,-1,b),I(1,1,b),I(t,t,H),I(t,-t,H)],G.stoneD);TH.poly(c,[I(-1,1,b),I(1,1,b),I(t,t,H),I(-t,t,H)],G.stone);
    TH.poly(c,[I(-t,-t,H),I(t,-t,H),I(t,t,H),I(-t,t,H)],G.stoneL);TH.poly(c,[I(t,-t,H),I(t,t,H),I(0,0,H+0.9)],G.stoneD);TH.poly(c,[I(-t,t,H),I(t,t,H),I(0,0,H+0.9)],G.stoneL);
    for(let k=0;k<5;k++)TH.ln(c,I(-0.4,1-k*0.04,1.8+k*0.7),I(0.4,1-k*0.04,1.8+k*0.7),'rgba(40,45,62,.3)',u*0.05);moss(c,x-u*0.7,y+u*0.3,u,r);}},
  angelStatue:{cat:'grave',w:1.7,tier:3,weight:2,cost:2,draw(c,x,y,u,v){const r=mulberry(v+1);gsh(c,x,y,u*1.7,u*6);sbox(c,x,y,u,-1.2,1.2,-0.9,0.9,0,0.5,-0.12);sbox(c,x,y,u,-0.9,0.9,-0.65,0.65,0.5,1.7,-0.05);
    const by=y-u*1.7;const wing=(s)=>{TH.poly(c,[[x+s*u*0.5,by-u*1.7],[x+s*u*2.1,by-u*3.4],[x+s*u*2.4,by-u*2.2],[x+s*u*2.0,by-u*1.0],[x+s*u*0.6,by-u*0.3]],s<0?G.stoneL:'#8f95aa');
      for(let k=1;k<4;k++)TH.ln(c,[x+s*u*0.7,by-u*(1.6-k*0.2)],[x+s*u*(2.0+k*0.1),by-u*(3.0-k*0.55)],'rgba(60,66,90,.35)',u*0.05);};wing(-1);wing(1);
    TH.poly(c,[[x-u*0.9,by],[x-u*0.55,by-u*2.4],[x-u*0.3,by-u*3.3],[x+u*0.3,by-u*3.3],[x+u*0.55,by-u*2.4],[x+u*0.9,by]],'#b9bed0');TH.poly(c,[[x+u*0.3,by-u*3.3],[x+u*0.55,by-u*2.4],[x+u*0.9,by],[x+u*0.2,by]],'rgba(70,76,100,.4)');
    for(let k=0;k<4;k++)TH.ln(c,[x-u*0.5+k*u*0.3,by-u*0.1],[x-u*0.35+k*u*0.28,by-u*2.2],'rgba(70,76,100,.3)',u*0.05);
    TH.ell(c,x,by-u*3.75,u*0.4,u*0.45,'#cfd3e0');TH.poly(c,[[x-u*0.55,by-u*3.1],[x+u*0.55,by-u*3.1],[x+u*0.25,by-u*3.9],[x-u*0.25,by-u*3.9]],'#aeb4c8');TH.ln(c,[x-u*0.45,by-u*3.3],[x-u*0.05,by-u*2.2],'#b9bed0',u*0.28);TH.ln(c,[x+u*0.45,by-u*3.3],[x+u*0.05,by-u*2.2],'#b9bed0',u*0.28);moss(c,x+u*0.5,y+u*0.3,u,r);}},
  sarcophagus:{cat:'grave',w:2.1,tier:3,weight:2,cost:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+9);gsh(c,x,y,u*2.2,u*2);sbox(c,x,y,u,-2.0,2.0,-0.85,0.85,0,1.3,-0.06);sbox(c,x,y,u,-2.2,2.2,-1.0,1.0,1.3,1.75,0.05);
    TH.poly(c,[I(-1.9,-0.7,1.75),I(1.9,-0.7,1.75),I(1.6,0.7,1.75),I(-1.6,0.7,1.75)],'#d4d8e4');TH.ln(c,I(0,0.4,1.78),I(0,-0.4,1.78),'#8a90a6',u*0.18);TH.ln(c,I(-0.45,0.0,1.78),I(0.45,0.0,1.78),'#8a90a6',u*0.18);
    [-1.3,-0.4,0.5,1.3].forEach(X=>TH.poly(c,TH.arch(x,y,u,0.86,X,0.3,0.25,0.85,1.1),'rgba(40,45,62,.3)'));moss(c,x-u*1.2,y+u*0.3,u,r);moss(c,x+u*1.3,y+u*0.2,u,r);}},
  /* ---------- props ---------- */
  ironFence:{cat:'prop',w:2.5,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+3);gsh(c,x,y,u*2.6,u);
    [-2.3,2.3].forEach(X=>{sbox(c,x,y,u,X-0.3,X+0.3,-0.3,0.3,0,2.1,-0.08);TH.poly(c,[I(X-0.36,0.36,2.1),I(X+0.36,0.36,2.1),I(X,0,2.7)],G.stoneL);TH.ell(c,...I(X,0,2.8),u*0.12,u*0.12,G.stoneL);});
    for(let X=-1.8;X<=1.85;X+=0.36){if(v%3===0&&Math.abs(X-0.5)<0.2)continue;const lean=(v%2&&X>1)?0.12*(X-1):0;TH.ln(c,I(X,0,0),I(X+lean,0,1.7),G.iron,u*0.08);TH.poly(c,[I(X+lean-0.08,0,1.7),I(X+lean+0.08,0,1.7),I(X+lean,0,2.05)],G.ironL);}
    [0.5,1.35].forEach(Z=>TH.ln(c,I(-2.0,0,Z),I(2.0,0,Z),G.iron,u*0.11));}},
  ironGate:{cat:'prop',w:2.4,tier:3,weight:2,cost:2,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);gsh(c,x,y,u*2.4,u*2);
    [-1.8,1.8].forEach(X=>{sbox(c,x,y,u,X-0.4,X+0.4,-0.4,0.4,0,3.4,-0.08);sbox(c,x,y,u,X-0.5,X+0.5,-0.5,0.5,3.4,3.7,0.05);TH.poly(c,[I(X-0.45,0.45,3.7),I(X+0.45,0.45,3.7),I(X,0,4.5)],G.stoneL);TH.ell(c,...I(X,0,4.6),u*0.16,u*0.16,'#d6dae6');});
    const ar=TH.arch(x,y,u,0,0,1.4,0,2.4,3.5);c.strokeStyle=G.iron;c.lineWidth=u*0.14;c.beginPath();ar.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
    for(let X=-1.2;X<=1.25;X+=0.4){const top=2.4+Math.max(0,1.1*(1-Math.abs(X)/1.4)*1.2);TH.ln(c,I(X,0,0),I(X,0,top),G.iron,u*0.08);TH.poly(c,[I(X-0.07,0,top),I(X+0.07,0,top),I(X,0,top+0.4)],G.ironL);}
    TH.ln(c,I(-1.4,0,0.7),I(1.4,0,0.7),G.iron,u*0.1);TH.ln(c,I(-1.4,0,1.9),I(1.4,0,1.9),G.iron,u*0.1);TH.ln(c,I(0,0,0.2),I(0,0,3.3),G.iron,u*0.12);}},
  gasLamp:{cat:'prop',w:0.9,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v,tm){gsh(c,x,y,u*0.9,u*5);sbox(c,x,y,u,-0.4,0.4,-0.4,0.4,0,0.5,-0.2);TH.ln(c,[x,y-u*0.4],[x,y-u*4.6],G.iron,u*0.2);TH.ln(c,[x-u*0.04,y-u*0.4],[x-u*0.04,y-u*4.6],G.ironL,u*0.06);
    const ty=y-u*4.9;TH.poly(c,[[x-u*0.45,ty-u*0.4],[x+u*0.45,ty-u*0.4],[x+u*0.32,ty+u*0.5],[x-u*0.32,ty+u*0.5]],'#fde68a','#1d2030',u*0.1);TH.poly(c,[[x-u*0.6,ty-u*0.4],[x+u*0.6,ty-u*0.4],[x,ty-u*1.0]],G.iron);TH.ell(c,x,ty-u*1.1,u*0.1,u*0.1,G.iron);
    glow(c,x,ty,u*3.0,0.32+0.1*Math.sin((tm||0)*6+v));TH.ell(c,x,ty,u*0.25,u*0.3,'#fffbe0');}},
  candelabra:{cat:'prop',w:0.9,tier:2,weight:2,cost:1,max:2,draw(c,x,y,u,v,tm){gsh(c,x,y,u*0.9,u*3);TH.ell(c,x,y,u*0.55,u*0.22,G.iron);TH.ln(c,[x,y],[x,y-u*2.2],G.iron,u*0.16);
    [-1,0,1].forEach((s,i)=>{const ax=x+s*u*0.9,ay=y-u*(2.2+(s?0:0.55));c.strokeStyle=G.iron;c.lineWidth=u*0.1;c.lineCap='round';c.beginPath();c.moveTo(x,y-u*1.8);c.quadraticCurveTo(x+s*u*0.2,y-u*2.0,ax,ay+u*0.1);c.stroke();
      c.fillStyle='#efe6cc';c.fillRect(ax-u*0.11,ay-u*0.55,u*0.22,u*0.6);const f=Math.sin((tm||0)*9+i*2+v)*u*0.06;glow(c,ax,ay-u*0.9,u*1.4,0.3);
      TH.poly(c,[[ax-u*0.12,ay-u*0.55],[ax+f,ay-u*1.3],[ax+u*0.12,ay-u*0.55]],'#fbbf24');TH.poly(c,[[ax-u*0.06,ay-u*0.58],[ax+f*0.6,ay-u*1.0],[ax+u*0.06,ay-u*0.58]],'#fff7c2');});}},
  well:{cat:'prop',w:1.6,tier:3,weight:2,cost:1,max:1,draw(c,x,y,u,v){const r=mulberry(v+5);gsh(c,x,y,u*1.6,u*4);const rx=u*1.2,h=u*1.0;TH.ell(c,x,y,rx*0.99,rx*0.5,G.stoneD);c.fillStyle=G.stone;c.fillRect(x-rx*0.99,y-h,rx*1.98,h);
    for(let j=0;j<3;j++)for(let i=-4;i<=4;i++){c.strokeStyle='rgba(40,45,62,.35)';c.lineWidth=u*0.04;c.strokeRect(x+(i+(j%2)*0.5)*u*0.28-u*0.14,y-h+j*h/3,u*0.28,h/3);}
    const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,'rgba(255,255,255,.2)');g.addColorStop(1,'rgba(0,0,0,.38)');c.fillStyle=g;c.fillRect(x-rx*0.99,y-h,rx*1.98,h);
    TH.ell(c,x,y-h,rx*0.99,rx*0.5,G.stoneL);TH.ell(c,x,y-h,rx*0.78,rx*0.38,'#14182a');TH.ell(c,x-rx*0.15,y-h+rx*0.02,rx*0.4,rx*0.14,'rgba(120,140,200,.35)');
    [-1,1].forEach(s=>TH.ln(c,[x+s*rx*0.85,y-h*0.6],[x+s*rx*0.85,y-h-u*2.2],G.wood,u*0.2));TH.ln(c,[x-rx*0.85,y-h-u*2.1],[x+rx*0.85,y-h-u*2.1],'#3b2d23',u*0.2);
    TH.poly(c,[[x-rx*1.1,y-h-u*1.95],[x+rx*1.1,y-h-u*1.95],[x,y-h-u*3.1]],'#3c4258');TH.ln(c,[x,y-h-u*2.0],[x,y-h-u*0.5],'#a89b82',u*0.05);TH.ell(c,x,y-h-u*0.35,u*0.2,u*0.15,G.wood);moss(c,x+rx*0.5,y,u,r);}},
  coffin:{cat:'prop',w:2.0,tier:2,weight:2,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),P=[[-1.5,-0.25],[-1.0,-0.6],[0.8,-0.45],[1.5,-0.2],[1.5,0.2],[0.8,0.45],[-1.0,0.6],[-1.5,0.25]],h=0.7;gsh(c,x,y,u*2,u*1.5);
    for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length],nx=(b[1]-a[1]),ny=-(b[0]-a[0]);if(nx+ny>0.01)TH.poly(c,[I(a[0],a[1],0),I(b[0],b[1],0),I(b[0],b[1],h),I(a[0],a[1],h)],nx>ny?'#2f241c':'#3e3026');}
    TH.poly(c,P.map(p=>I(p[0],p[1],h)),'#5a4636');TH.poly(c,P.map(p=>I(p[0]*0.86,p[1]*0.78,h+0.02)),'#4b3a2c');
    TH.ln(c,I(-0.9,0,h+0.03),I(0.9,0,h+0.03),'#a8905a',u*0.07);TH.ln(c,I(0.1,-0.28,h+0.03),I(0.1,0.28,h+0.03),'#a8905a',u*0.07);if(v%2)TH.ln(c,I(0.9,0.4,h),I(1.4,1.2,0.3),'#c9b98a',u*0.05);}},
  skullPile:{cat:'prop',w:1.1,tier:1,weight:3,cost:1,draw(c,x,y,u,v){const r=mulberry(v+2);gsh(c,x,y,u*1.2,u);
    const bone=(a,b)=>{TH.ln(c,a,b,'#d7d0bd',u*0.14);TH.ell(c,a[0],a[1],u*0.1,u*0.1,'#d7d0bd');TH.ell(c,b[0],b[1],u*0.1,u*0.1,'#d7d0bd');};bone([x-u*1.1,y-u*0.1],[x+u*0.2,y+u*0.15]);bone([x-u*0.4,y+u*0.2],[x+u*1.1,y-u*0.1]);
    [[-0.5,-0.35],[0.45,-0.3],[0,-0.95],[-0.1,-0.25],[0.8,-0.05]].forEach(([dx,dy],i)=>{const px=x+dx*u,py=y+dy*u,s=0.5+(i===2?0.05:0);TH.ell(c,px,py,u*s*0.8,u*s*0.72,'#e4dfcd');TH.ell(c,px+u*0.06,py+u*0.2,u*s*0.5,u*s*0.3,'#cfc8b3');
      TH.ell(c,px-u*0.17,py-u*0.04,u*0.1,u*0.13,'#1b1a22');TH.ell(c,px+u*0.17,py-u*0.04,u*0.1,u*0.13,'#1b1a22');TH.poly(c,[[px-u*0.04,py+u*0.1],[px+u*0.04,py+u*0.1],[px,py+u*0.2]],'#1b1a22');});}},
  raven:{cat:'prop',w:0.7,tier:1,weight:3,cost:1,draw(c,x,y,u,v){const post=v%2===0,by=post?y-u*1.7:y-u*0.35;if(post){gsh(c,x,y,u*0.8,u*2);TH.ln(c,[x,y],[x,y-u*1.6],G.wood,u*0.28);}else gsh(c,x,y,u*0.8,u);
    TH.ell(c,x,by-u*0.4,u*0.5,u*0.34,'#14121c',-0.35);TH.poly(c,[[x-u*0.3,by-u*0.3],[x-u*1.0,by-u*0.1],[x-u*0.4,by-u*0.55]],'#0e0c14');TH.ell(c,x+u*0.38,by-u*0.82,u*0.2,u*0.18,'#14121c');
    TH.poly(c,[[x+u*0.52,by-u*0.86],[x+u*0.88,by-u*0.78],[x+u*0.52,by-u*0.72]],'#d79a46');TH.ell(c,x+u*0.42,by-u*0.86,u*0.04,u*0.04,'#e8e8f2');TH.ell(c,x-u*0.05,by-u*0.5,u*0.28,u*0.12,'rgba(120,130,170,.25)');TH.ln(c,[x+u*0.05,by-u*0.1],[x+u*0.05,by+u*0.12],'#d79a46',u*0.05);TH.ln(c,[x-u*0.15,by-u*0.1],[x-u*0.15,by+u*0.12],'#d79a46',u*0.05);}},
  batSwarm:{cat:'prop',w:1.6,tier:2,weight:2,cost:1,max:1,draw(c,x,y,u,v,tm){const t=tm||0,n=5;for(let i=0;i<n;i++){const a=t*0.8+i*1.3+v,bx=x+Math.cos(a)*u*2.0,by=y-u*(3.2+Math.sin(t*0.6+i*1.1)*1.0+i*0.35),fl=Math.sin(t*13+i*2)*0.5+0.1,s=u*(0.8-0.06*i);
      c.fillStyle='#14121c';[-1,1].forEach(d=>{c.beginPath();c.moveTo(bx,by);c.quadraticCurveTo(bx+d*s*0.7,by-s*(0.55+fl),bx+d*s*1.1,by-s*(0.2+fl*0.6));c.quadraticCurveTo(bx+d*s*0.85,by+s*0.05,bx+d*s*0.62,by+s*0.18);c.quadraticCurveTo(bx+d*s*0.4,by+s*0.02,bx+d*s*0.22,by+s*0.2);c.closePath();c.fill();});
      TH.ell(c,bx,by+s*0.05,s*0.2,s*0.3,'#14121c');TH.poly(c,[[bx-s*0.14,by-s*0.18],[bx-s*0.06,by-s*0.4],[bx,by-s*0.18]],'#14121c');TH.poly(c,[[bx+s*0.14,by-s*0.18],[bx+s*0.06,by-s*0.4],[bx,by-s*0.18]],'#14121c');}}},
  gargoyle:{cat:'prop',w:1.5,tier:3,weight:2,cost:2,max:1,draw(c,x,y,u,v){const r=mulberry(v+3);gsh(c,x,y,u*1.5,u*4);sbox(c,x,y,u,-1.0,1.0,-0.8,0.8,0,1.3,-0.12);const by=y-u*1.3;
    TH.poly(c,[[x-u*0.4,by-u*0.3],[x-u*1.7,by-u*1.8],[x-u*1.9,by-u*0.7],[x-u*1.2,by-u*0.2]],'#6a7086');TH.poly(c,[[x+u*0.4,by-u*0.3],[x+u*1.7,by-u*1.8],[x+u*1.9,by-u*0.7],[x+u*1.2,by-u*0.2]],'#7b8197');
    TH.poly(c,[[x-u*0.7,by],[x-u*0.55,by-u*1.2],[x-u*0.2,by-u*1.8],[x+u*0.3,by-u*1.8],[x+u*0.65,by-u*1.2],[x+u*0.8,by]],'#8f95aa');TH.poly(c,[[x+u*0.3,by-u*1.8],[x+u*0.65,by-u*1.2],[x+u*0.8,by],[x+u*0.15,by]],'rgba(40,46,66,.4)');
    TH.ln(c,[x-u*0.5,by-u*0.5],[x-u*0.9,by],'#8f95aa',u*0.3);TH.ln(c,[x+u*0.5,by-u*0.5],[x+u*0.9,by],'#8f95aa',u*0.3);TH.ell(c,x,by-u*2.1,u*0.45,u*0.4,'#a2a8bd');
    TH.poly(c,[[x-u*0.35,by-u*2.35],[x-u*0.65,by-u*3.1],[x-u*0.1,by-u*2.5]],'#6a7086');TH.poly(c,[[x+u*0.35,by-u*2.35],[x+u*0.65,by-u*3.1],[x+u*0.1,by-u*2.5]],'#6a7086');
    TH.ell(c,x-u*0.17,by-u*2.15,u*0.07,u*0.07,'#ef4444');TH.ell(c,x+u*0.17,by-u*2.15,u*0.07,u*0.07,'#ef4444');TH.ln(c,[x-u*0.18,by-u*1.88],[x+u*0.18,by-u*1.88],'#2f3347',u*0.06);moss(c,x,y,u,r);}},
  /* ---------- landmarks ---------- */
  mausoleum:{cat:'landmark',w:3.0,tier:3,weight:3,cost:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+9);gsh(c,x,y,u*3.2,u*6);
    sbox(c,x,y,u,-2.7,2.7,-2.0,2.2,0,0.4,-0.15);sbox(c,x,y,u,-2.4,2.4,-1.8,2.0,0.4,0.8,-0.1);sbox(c,x,y,u,-2.1,2.1,-1.6,1.6,0.8,3.8);
    [-1.5,1.5].forEach(X=>{sbox(c,x,y,u,X-0.25,X+0.25,1.6,1.9,0.8,3.8,0.08);});sbox(c,x,y,u,-2.3,2.3,-1.7,1.9,3.8,4.1,0.08);
    TH.poly(c,TH.arch(x,y,u,1.61,0,0.8,0.8,2.4,3.4),'#0c0f1a');TH.poly(c,TH.arch(x,y,u,1.62,0,0.55,0.8,2.2,3.1),'#1a1f33');TH.ln(c,I(0,1.63,0.8),I(0,1.63,2.9),'#2a3048',u*0.06);
    [-1.5,1.5].forEach(X=>TH.poly(c,TH.arch(x,y,u,1.62,X*0.62+(X>0?0.3:-0.3),0.22,2.1,2.9,3.4),'#2a3a66'));
    TH.poly(c,[I(2.3,-1.7,4.1),I(2.3,1.9,4.1),I(2.3,0.1,5.9)],G.stoneD);TH.poly(c,[I(-2.4,1.9,4.1),I(2.4,1.9,4.1),I(2.4,0.1,5.9),I(-2.4,0.1,5.9)],G.slate);
    for(let k=1;k<5;k++)TH.ln(c,I(-2.4,1.9-k*0.36,4.1+k*0.36),I(2.4,1.9-k*0.36,4.1+k*0.36),'rgba(10,14,28,.35)',u*0.05);TH.ln(c,I(-2.4,0.1,5.9),I(2.4,0.1,5.9),G.stoneL,u*0.12);
    TH.ln(c,I(2.4,0.1,5.9),I(2.4,0.1,7.1),G.stoneL,u*0.2);TH.ln(c,I(2.4,0.1,6.6),I(2.4,0.1,6.6),G.stoneL,u*0.2);TH.ln(c,I(2.4-0.35,0.1,6.5),I(2.4+0.35,0.1,6.5),G.stoneL,u*0.18);
    [-2.2,2.2].forEach(X=>{TH.poly(c,[I(X-0.35,1.9,4.1),I(X+0.35,1.9,4.1),I(X,1.9,5.0)],G.stoneL);});moss(c,x-u*1.6,y+u*0.9,u,r);moss(c,x+u*1.8,y+u*0.7,u,r);}},
  chapelSpire:{cat:'landmark',w:2.2,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+4);gsh(c,x,y,u*2.2,u*9);
    sbox(c,x,y,u,-1.7,1.7,-1.7,1.7,0,0.6,-0.12);sbox(c,x,y,u,-1.35,1.35,-1.35,1.35,0.6,7.2);[[-1.5,1.5],[1.5,1.5],[1.5,-1.5]].forEach(([X,Y])=>sbox(c,x,y,u,X-0.22,X+0.22,Y-0.22,Y+0.22,0.6,6.4,0.1));
    TH.poly(c,TH.arch(x,y,u,1.36,0,0.55,0.6,2.0,3.1),'#0c0f1a');TH.poly(c,TH.arch(x,y,u,1.36,0,0.3,3.8,4.6,5.5),'#2a3a66');TH.poly(c,TH.arch(x,y,u,1.36,0,0.35,5.6,6.2,6.9),'#0c0f1a');
    c.save();TH.poly(c,TH.arch(x,y,u,1.36,0,0.3,3.8,4.6,5.5),'rgba(252,211,77,'+(0.3+0.1*Math.sin((tm||0)*3))+')');c.restore();
    TH.poly(c,TH.arch(x,y,u,-1.36,0,0.3,3.8,4.6,5.5),'#2a3a66');
    sbox(c,x,y,u,-1.6,1.6,-1.6,1.6,7.2,7.6,0.08);
    [[-1.5,1.5],[1.5,1.5],[1.5,-1.5],[-1.5,-1.5]].forEach(([X,Y])=>TH.poly(c,[I(X-0.2,Y+0.2,7.6),I(X+0.2,Y+0.2,7.6),I(X,Y,8.5)],G.stoneL));
    const Z0=7.6,Z1=13.4;TH.poly(c,[I(1.5,-1.5,Z0),I(1.5,1.5,Z0),I(0,0,Z1)],'#2c3248');TH.poly(c,[I(-1.5,1.5,Z0),I(1.5,1.5,Z0),I(0,0,Z1)],G.slate);
    for(let k=1;k<6;k++){const t=k/6,a=1.5*(1-t);TH.ln(c,I(-a,a,Z0+(Z1-Z0)*t),I(a,a,Z0+(Z1-Z0)*t),'rgba(10,14,28,.35)',u*0.05);}
    TH.ln(c,I(0,0,Z1),I(0,0,Z1+1.2),G.stoneL,u*0.14);TH.ln(c,I(-0.35,0,Z1+0.75),I(0.35,0,Z1+0.75),G.stoneL,u*0.14);moss(c,x-u*0.9,y+u*0.9,u,r);}},
  ruinedArch:{cat:'landmark',w:3.0,tier:3,weight:3,cost:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+2);gsh(c,x,y,u*3.1,u*6);
    const arcPts=TH.arch(x,y,u,0.0,0,2.1,0,5.2,8.2);                                   // lancet arch, springing at z=5.2
    sbox(c,x,y,u,-3.0,-1.3,-0.7,0.7,0,5.4);sbox(c,x,y,u,1.3,3.0,-0.7,0.7,0,3.5);
    TH.poly(c,[I(1.3,0.7,3.5),I(1.3,-0.7,3.5),I(1.9,0,4.2),I(2.3,0.7,3.7),I(3.0,0,4.4),I(3.0,0.7,3.5)],G.stoneL);
    for(let k=0;k<4;k++)TH.ln(c,I(-2.9,0.71,0.6+k*1.3),I(-1.4,0.71,0.6+k*1.3),'rgba(40,45,62,.25)',u*0.05);
    const seg=arcPts.slice(1,13);                                                          // left side up to the apex, plus a broken stub
    c.lineJoin='round';c.lineCap='butt';c.strokeStyle=G.stoneD;c.lineWidth=u*0.95;c.beginPath();seg.forEach((p,i)=>i?c.lineTo(p[0]+u*0.12,p[1]):c.moveTo(p[0]+u*0.12,p[1]));c.stroke();
    c.strokeStyle=G.stone;c.lineWidth=u*0.8;c.beginPath();seg.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
    c.strokeStyle=G.stoneL;c.lineWidth=u*0.12;c.beginPath();seg.forEach((p,i)=>i?c.lineTo(p[0]-u*0.2,p[1]-u*0.08):c.moveTo(p[0]-u*0.2,p[1]-u*0.08));c.stroke();
    const mull=(X,z0,z1)=>TH.ln(c,I(X,0,z0),I(X,0,z1),G.stone,u*0.28);mull(-0.85,1.4,6.9);mull(0.2,1.4,7.4);TH.ln(c,I(-1.5,0,3.2),I(1.0,0,3.2),G.stone,u*0.24);
    c.strokeStyle=G.stone;c.lineWidth=u*0.22;c.beginPath();for(let a=0;a<=20;a++){const t=a/20*6.283,p=I(-0.3+Math.cos(t)*0.7,0,5.3+Math.sin(t)*0.7);a?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();
    TH.poly(c,TH.arch(x,y,u,0.0,-0.9,0.85,1.4,5.2,6.4).slice(1,-1),'rgba(26,34,66,.35)');
    for(let k=0;k<7;k++)sbox(c,x,y,u,-1.0+r()*3.4,-0.5+r()*3.4,0.5+r()*1.4,1.1+r()*1.4,0,0.45+r()*0.45,-0.12+r()*0.16);
    moss(c,x-u*2.3,y+u*0.8,u,r);moss(c,x+u*2.2,y+u*0.8,u,r);}},
  cathedralRuin:{cat:'landmark',w:4.4,tier:4,weight:3,cost:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+6);gsh(c,x,y,u*4.2,u*8);
    sbox(c,x,y,u,3.0,3.8,-5.2,0.5,0,5.4,-0.04);sbox(c,x,y,u,-3.4,3.4,-0.4,0.6,0,6.4);sbox(c,x,y,u,-4.1,-3.2,-0.7,0.9,0,8.4,0.06);sbox(c,x,y,u,3.2,4.1,-0.7,0.9,0,6.0,0.06);
    TH.poly(c,[I(-2.4,0.6,6.4),I(2.4,0.6,6.4),I(0.7,0.6,9.7),I(-0.7,0.6,9.7)],G.stone);TH.poly(c,[I(2.4,-0.4,6.4),I(2.4,0.6,6.4),I(0.7,0.6,9.7),I(0.7,-0.4,9.7)],G.stoneD);
    TH.poly(c,[I(-0.7,0.6,9.7),I(0.7,0.6,9.7),I(0.0,0.6,10.9)],G.stoneL);TH.ln(c,I(0,0.6,10.8),I(0,0.6,11.8),G.stoneL,u*0.15);TH.ln(c,I(-0.35,0.6,11.4),I(0.35,0.6,11.4),G.stoneL,u*0.15);
    TH.poly(c,TH.arch(x,y,u,0.61,0,1.3,0,3.2,4.6),'#0c0f1a');TH.poly(c,TH.arch(x,y,u,0.62,0,0.95,0,3.0,4.3),'#1a1f33');TH.ln(c,I(0,0.63,0),I(0,0.63,3.7),'#2a3048',u*0.07);
    for(let k=0;k<3;k++)TH.poly(c,TH.arch(x,y,u,0.61,0,1.3-k*0.14,0,3.2,4.6).slice(1,-1).map(p=>p),null,'rgba(200,205,220,.4)',u*0.06);
    const rc=I(0,0.62,6.9),rr=u*1.15;TH.ell(c,rc[0],rc[1],rr*0.7,rr,'#2a3a66');for(let k=0;k<12;k++){const a=k*0.5236;TH.ln(c,rc,[rc[0]+Math.cos(a)*rr*0.7,rc[1]+Math.sin(a)*rr],'#c9cddb',u*0.07);}
    ['#d14a4a','#e8b23a','#3f7fd0','#4fae6a'].forEach((col,k)=>{const a=k*1.57+0.4;TH.ell(c,rc[0]+Math.cos(a)*rr*0.35,rc[1]+Math.sin(a)*rr*0.5,rr*0.17,rr*0.24,col);});c.strokeStyle='#c9cddb';c.lineWidth=u*0.1;c.beginPath();c.ellipse(rc[0],rc[1],rr*0.7,rr,0,0,7);c.stroke();TH.ell(c,rc[0],rc[1],rr*0.14,rr*0.2,'#c9cddb');
    [-3.65,3.65].forEach((X,i)=>TH.poly(c,TH.arch(x,y,u,0.91,X,0.22,2.6,3.6,4.4),'#2a3a66'));
    TH.poly(c,[I(-4.1,0.9,8.4),I(-3.2,0.9,8.4),I(-3.2,0.9,9.6),I(-3.65,0.9,8.9),I(-4.1,0.9,9.3)],G.stone);TH.poly(c,[I(3.2,0.9,6.0),I(4.1,0.9,6.0),I(4.1,0.9,6.8),I(3.7,0.9,6.3),I(3.2,0.9,6.7)],G.stone);
    for(let k=0;k<4;k++){const Yc=-0.9-k*1.15;const pts=[I(3.81,Yc-0.36,1.2),I(3.81,Yc+0.36,1.2),I(3.81,Yc+0.36,3.3),I(3.81,Yc,4.0),I(3.81,Yc-0.36,3.3)];TH.poly(c,pts,'#161a2c');}
    TH.poly(c,[I(3.0,-5.2,5.4),I(3.8,-5.2,5.4),I(3.8,-4.4,4.8),I(3.4,-4.0,5.2),I(3.0,-3.6,4.6)],G.stoneL);
    for(let k=0;k<8;k++)sbox(c,x,y,u,-3.0+r()*6,-2.4+r()*6,-1.4+r()*1.8,-0.9+r()*1.8,0,0.3+r()*0.5,-0.12+r()*0.15);moss(c,x-u*2.6,y+u*1.0,u,r);moss(c,x+u*3.0,y+u*0.7,u,r);}}
  }};
const GOTH_HEIGHT={brambles:'low',mushrooms:'low',ivyBush:'low',gravestone:'low',skullPile:'low',raven:'low',candelabra:'low',coffin:'low',ironFence:'low',well:'low',
  deadOak:'mid',yewTree:'mid',celticCross:'mid',obelisk:'mid',angelStatue:'mid',sarcophagus:'low',ironGate:'mid',gasLamp:'mid',batSwarm:'mid',gargoyle:'mid',
  mausoleum:'tall',chapelSpire:'tall',ruinedArch:'tall',cathedralRuin:'tall'};
Object.keys(GOTHIC_PACK.assets).forEach(id=>{GOTHIC_PACK.assets[id].h=GOTH_HEIGHT[id]||'low';});
const KEEP_OUT={rx:0.52,ry:0.34};   // central ellipse (x R) reserved for the ride or building sprite
function placeThemeAssets(pack,tier,R,seed){
  const rnd=mulberry(seed*7919+tier*131), u=R*0.068, T=pack.tiers[tier], out=[], decals=[], TAU=Math.PI*2;
  if(!T)return {assets:out,decals,u};
  const inside=(x,y,k)=>{const X=Math.abs(x)/R,Y=Math.abs(y)/(0.58*R);return X<=0.866*k&&Y<=k-X/1.732;};
  const ids=Object.keys(pack.assets), cnt={};
  const free=(x,y,w)=>out.every(o=>Math.hypot(o.x-x,(o.y-y)*1.7)>(o.w+w)*u*0.8);
  const clearOfCenter=(x,y,w,h)=>{const kx=h==='tall'?0.28:0.75,ky=h==='tall'?0.18:0.4,ex=R*KEEP_OUT.rx+w*u*kx,ey=R*KEEP_OUT.ry+w*u*ky;return x*x/(ex*ex)+y*y/(ey*ey)>1;};
  const zoneOK=(a,x,y)=>{const h=a.h||'low';if(h==='low')return true;const ax=Math.abs(x)/R;
    if(h==='tall')return y<R*0.12&&ax>(y>=-R*0.12?0.55:0.4);
    if(y>R*0.12)return h==='mid'&&ax>0.5;if(y>=-R*0.12)return h==='mid'||ax>0.55;return true;};
  const ringPoint=(tmax)=>{const th=rnd()*TAU,dx=Math.cos(th),dy=Math.sin(th);let lo=0,hi=R*1.2;
    for(let i=0;i<12;i++){const m=(lo+hi)/2;if(inside(dx*m,dy*m,0.9))lo=m;else hi=m;}const t=0.5+rnd()*((tmax||1)-0.5);return[dx*lo*t,dy*lo*t];};
  const spot=a=>{for(let i=0;i<120;i++){const p=ringPoint(a.h==='tall'?0.8:a.h==='mid'?0.92:1);if(clearOfCenter(p[0],p[1],a.w,a.h)&&zoneOK(a,p[0],p[1])&&free(p[0],p[1],a.w))return p;}return null;};
  const add=(id,x,y)=>{const a=pack.assets[id];out.push({id,x,y,v:Math.floor(rnd()*1000),w:a.w});cnt[id]=(cnt[id]||0)+1;};
  for(let i=0;i<T.decals;i++){const pool=ids.filter(id=>pack.assets[id].cat==='decal'&&pack.assets[id].tier<=tier),id=pool[Math.floor(rnd()*pool.length)];
    for(let t=0;t<40;t++){const p=ringPoint();if(clearOfCenter(p[0],p[1],pack.assets[id].w*0.5)){decals.push({id,x:p[0],y:p[1],v:Math.floor(rnd()*1000)});break;}}}
  let budget=T.budget;
  const land=()=>{let id=T.pool[Math.floor(rnd()*T.pool.length)];for(let q=0;q<8&&cnt[id];q++)id=T.pool[Math.floor(rnd()*T.pool.length)];
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}};
  if(T.pool.length&&rnd()<T.landmark){land();if(T.second&&rnd()<T.second)land();}
  let guard=0;while(budget>0&&guard++<500){const pool=ids.filter(id=>{const a=pack.assets[id];return a.cat!=='decal'&&a.cat!=='landmark'&&a.tier<=tier&&a.cost<=budget&&(cnt[id]||0)<(a.max||3);});
    if(!pool.length)break;let tot=0;pool.forEach(id=>tot+=pack.assets[id].weight);let pick=rnd()*tot,id=pool[0];for(const q of pool){pick-=pack.assets[q].weight;if(pick<=0){id=q;break;}}
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}else{cnt[id]=99;}}
  return {assets:out,decals,u};
}
function drawThemeGround(ctx,cx,cy,R,pack,border){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);ctx[i?'lineTo':'moveTo'](cx+R*Math.cos(a),cy+R*Math.sin(a)*0.58);}ctx.closePath();
  ctx.fillStyle=pack.ground;ctx.fill();if(border!==false){ctx.lineWidth=Math.max(1.5,R*0.03);ctx.strokeStyle=border||pack.border;ctx.stroke();}}
function drawThemeDecals(ctx,cx,cy,pack,pl,tm){pl.decals.forEach(d=>pack.assets[d.id].draw(ctx,cx+d.x,cy+d.y,pl.u,d.v,tm||0));}
/* layer: 'back' (y<0, draw BEFORE the ride sprite), 'front' (y>=0, draw AFTER it) or omit for all, sorted by y */
function drawThemeAssets(ctx,cx,cy,pack,pl,tm,layer){pl.assets.filter(o=>layer==='back'?o.y<0:layer==='front'?o.y>=0:true).sort((a,b)=>a.y-b.y).forEach(o=>pack.assets[o.id].draw(ctx,cx+o.x,cy+o.y,pl.u,o.v,tm||0));}
function drawThemedTile(ctx,cx,cy,R,pack,tier,seed,tm,border,rideFn){drawThemeGround(ctx,cx,cy,R,pack,border);const pl=placeThemeAssets(pack,tier,R,seed);
  drawThemeDecals(ctx,cx,cy,pack,pl,tm);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'back');if(rideFn)rideFn(ctx,cx,cy,R);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'front');}
return { pack: GOTHIC_PACK, placeThemeAssets, drawThemeGround, drawThemeDecals, drawThemeAssets };
})();

const SPACE_THEME_PACK = (() => {
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
/* ===== SPACE PACK ===== */
const S={hull:'#e6eaf3',hullD:'#98a1b6',hullL:'#f6f8fc',dark:'#2a3044',navy:'#1c2438',cy:'#22d3ee',mg:'#e879f9',or:'#fb923c',gl:'#7dd3fc',pan:'#1d4ed8',reg:'#9097a8',regD:'#6f768b'};
const hbox=(c,x,y,u,x0,x1,y0,y1,z0,z1,k)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,k?shade(S.hull,k):S.hull,k?shade(S.hullD,k):S.hullD,k?shade(S.hullL,k):S.hullL);
const ssh=(c,x,y,rx,h)=>{c.fillStyle='rgba(20,24,40,.32)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
const glo=(c,x,y,r,rgb,a)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba('+rgb+','+a+')');g.addColorStop(1,'rgba('+rgb+',0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();};
const SPACE_PACK={id:'space',name:'Space',ground:'#8b91a5',groundDark:'#767d92',border:'#5d647b',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},
         3:{budget:11,decals:4,landmark:0.75,pool:['observatory','radioTelescope','habitatDome']},
         4:{budget:15,decals:5,landmark:1,pool:['rocket','crashedSaucer','radioTelescope','habitatDome','observatory'],second:0.45}},
  assets:{
  /* ---------- ground decals ---------- */
  crater:{cat:'decal',w:2.4,tier:1,weight:4,cost:0,draw(c,x,y,u,v){const r=mulberry(v+3),rx=u*(1.5+r()*0.8);TH.ell(c,x,y,rx*1.14,rx*0.52,'#a1a8ba');TH.ell(c,x+rx*0.04,y+rx*0.03,rx*0.94,rx*0.42,'#6b7288');TH.ell(c,x+rx*0.16,y+rx*0.08,rx*0.7,rx*0.28,'#575e74');
    c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=u*0.07;c.beginPath();c.ellipse(x,y,rx*1.06,rx*0.47,0,Math.PI*0.95,Math.PI*1.55);c.stroke();for(let k=0;k<5;k++){const a=r()*6.283;TH.ell(c,x+Math.cos(a)*rx*1.15,y+Math.sin(a)*rx*0.54,u*0.1,u*0.07,'#a9afc0');}}},
  craterField:{cat:'decal',w:2.3,tier:1,weight:3,cost:0,draw(c,x,y,u,v){const r=mulberry(v+7);[[-1.2,0.1,0.8],[0.9,-0.2,0.6],[0.1,0.5,0.45],[-0.1,-0.5,0.4]].forEach(([dx,dy,s])=>{TH.ell(c,x+dx*u,y+dy*u,u*s*1.15,u*s*0.52,'#9aa1b3');TH.ell(c,x+dx*u+u*s*0.1,y+dy*u+u*s*0.06,u*s*0.9,u*s*0.4,'#666d83');});}},
  dustDrift:{cat:'decal',w:2.6,tier:1,weight:3,cost:0,draw(c,x,y,u,v){const r=mulberry(v+5);TH.ell(c,x,y,u*2.6,u*1.1,'#a8aebf');TH.ell(c,x-u*0.3,y-u*0.1,u*1.7,u*0.65,'#b4bacb');for(let k=0;k<4;k++){c.strokeStyle='rgba(90,98,120,.4)';c.lineWidth=u*0.06;c.beginPath();c.ellipse(x+(r()-0.5)*u,y+(k-1.5)*u*0.25,u*(1.8-k*0.2),u*0.3,0,Math.PI*1.1,Math.PI*1.9);c.stroke();}}},
  deckPlate:{cat:'decal',w:2.4,tier:2,weight:2.5,cost:0,draw(c,x,y,u,v,tm){const I=(X,Y)=>TH.iso(x,y,u,X,Y,0);TH.poly(c,[I(-2,-1.2),I(2,-1.2),I(2,1.2),I(-2,1.2)],'#4d5670','#2a3044',u*0.08);
    for(let k=0;k<8;k++){const a=-2+k*0.5,b=a+0.25;TH.poly(c,[I(a,1.05),I(b,1.05),I(b,1.2),I(a,1.2)],k%2?'#1c2438':'#f2c230');}
    c.strokeStyle='#22d3ee';c.lineWidth=u*0.09;c.beginPath();for(let a=0;a<=24;a++){const t=a/24*6.283,p=I(Math.cos(t)*0.8,Math.sin(t)*0.55);a?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();
    c.globalAlpha=0.5+0.4*Math.sin((tm||0)*3+v);c.strokeStyle='#a5f3fc';c.lineWidth=u*0.04;c.stroke();c.globalAlpha=1;[[-1.8,-1.0],[1.8,-1.0],[1.8,0.9],[-1.8,0.9]].forEach(([X,Y])=>{const p=I(X,Y);TH.ell(c,p[0],p[1],u*0.07,u*0.05,'#9aa3bd');});}},
  /* ---------- alien flora and rocks ---------- */
  crystalCluster:{cat:'flora',w:1.4,tier:1,weight:4,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*7+1);ssh(c,x,y,u*1.3,u*2);glo(c,x,y-u*0.8,u*2.4,'34,211,238',0.22+0.1*Math.sin((tm||0)*2+v));
    const cols=[['#22d3ee','#0e7490'],['#67e8f9','#0891b2'],['#a78bfa','#6d28d9'],['#22d3ee','#155e75']];
    for(let k=0;k<6;k++){const bx=x+(k-2.5)*u*0.4+(r()-0.5)*u*0.2,h=u*(1.2+r()*2.4),w=u*(0.3+r()*0.25),l=cols[k%4][0],d=cols[k%4][1];
      TH.poly(c,[[bx-w,y],[bx-w*0.9,y-h*0.75],[bx,y-h],[bx+w*0.9,y-h*0.75],[bx+w,y]],l);TH.poly(c,[[bx,y-h],[bx+w*0.9,y-h*0.75],[bx+w,y],[bx+w*0.15,y]],d);TH.ln(c,[bx-w*0.5,y-h*0.2],[bx-w*0.35,y-h*0.7],'rgba(255,255,255,.55)',u*0.06);}}},
  glowPods:{cat:'flora',w:1.3,tier:1,weight:3,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*5+2);ssh(c,x,y,u*1.2,u);
    for(let k=0;k<4;k++){const bx=x+(k-1.5)*u*0.55,h=u*(1.2+r()*1.3),tx=bx+(r()-0.5)*u*0.6,ty=y-h;c.strokeStyle='#2f8f83';c.lineWidth=u*0.1;c.lineCap='round';c.beginPath();c.moveTo(bx,y);c.quadraticCurveTo(bx+(tx-bx)*0.2,y-h*0.6,tx,ty);c.stroke();
      const g=0.4+0.25*Math.sin((tm||0)*2.5+k*1.3+v);glo(c,tx,ty,u*1.1,'163,230,53',g*0.6);TH.ell(c,tx,ty,u*0.34,u*0.4,'#a3e635');TH.ell(c,tx-u*0.08,ty-u*0.1,u*0.14,u*0.16,'#ecfccb');}
    TH.ell(c,x,y,u*0.55,u*0.2,'#2a6f66');}},
  alienFronds:{cat:'flora',w:1.5,tier:1,weight:3,cost:1,draw(c,x,y,u,v){const r=mulberry(v*3+8);ssh(c,x,y,u*1.5,u*2);
    for(let k=0;k<8;k++){const a=-3.0+k*0.4+(r()-0.5)*0.2,l=u*(1.7+r()*1.2),ex=x+Math.cos(a)*l,ey=y-Math.abs(Math.sin(a))*l*1.05-u*0.2;c.strokeStyle=k%2?'#1f8a8a':'#26a0a0';c.lineWidth=u*0.2;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(ex-x)*0.4,y-l*0.9,ex,ey);c.stroke();
      c.strokeStyle='#5eead4';c.lineWidth=u*0.05;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(ex-x)*0.4-u*0.05,y-l*0.9,ex,ey);c.stroke();TH.ell(c,ex,ey,u*0.14,u*0.14,'#e879f9');}
    TH.ell(c,x,y-u*0.2,u*0.35,u*0.28,'#115e59');}},
  moonBoulder:{cat:'rock',w:1.6,tier:1,weight:4,cost:1,draw(c,x,y,u,v){const r=mulberry(v*13+3);ssh(c,x,y,u*1.8,u*1.4);
    [[0.0,0.0,1.0,1.0,'#7c8399'],[-1.0,0.2,0.65,0.6,'#6c7389'],[0.9,0.25,0.6,0.55,'#8890a6']].forEach(([dx,dy,sx,sy,col])=>{TH.blob(c,x+dx*u,y-u*0.55*sy+dy*u,u*0.9*sx,u*0.75*sy,col,r,9);TH.ell(c,x+dx*u+u*0.1,y-u*0.55*sy+dy*u,u*0.2*sx,u*0.1*sx,'rgba(30,36,56,.35)');});}},
  oreRock:{cat:'rock',w:1.5,tier:2,weight:3,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*9+5);ssh(c,x,y,u*1.6,u*1.6);TH.blob(c,x,y-u*0.8,u*1.2,u*1.0,'#5f6680',r,10);TH.blob(c,x-u*0.9,y-u*0.4,u*0.6,u*0.5,'#555c75',r,8);
    const g=0.6+0.3*Math.sin((tm||0)*3+v);for(let k=0;k<4;k++){const a=r()*3,px=x+(r()-0.5)*u*1.4,py=y-u*(0.4+r()*1.0);TH.ln(c,[px,py],[px+Math.cos(a)*u*0.5,py-Math.abs(Math.sin(a))*u*0.4],k%2?'#fb923c':'#22d3ee',u*0.1);}
    glo(c,x,y-u*0.9,u*1.8,'34,211,238',0.12*g);}},
  /* ---------- props ---------- */
  crateStack:{cat:'prop',w:1.6,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);ssh(c,x,y,u*1.8,u*2);
    TH.box(c,x,y,u,-1.6,0.1,-0.8,0.8,0,1.3,'#d9822b','#a85f1d','#f0a04e');TH.box(c,x,y,u,-1.3,-0.2,-0.6,0.6,1.3,2.2,'#e6eaf3','#98a1b6','#f6f8fc');
    TH.ln(c,I(-1.6,0.81,0.65),I(0.1,0.81,0.65),'rgba(60,35,10,.5)',u*0.08);TH.ln(c,I(-0.75,0.81,0),I(-0.75,0.81,1.3),'rgba(60,35,10,.5)',u*0.08);TH.poly(c,[I(-1.1,0.61,1.5),I(-0.4,0.61,1.5),I(-0.4,0.61,2.0),I(-1.1,0.61,2.0)],'#f2c230');
    const bx=x+u*1.7,by=y+u*0.3;TH.ell(c,bx,by,u*0.6,u*0.27,'#1c2438');c.fillStyle='#2a3350';c.fillRect(bx-u*0.6,by-u*1.2,u*1.2,u*1.2);c.fillStyle='#22d3ee';c.fillRect(bx-u*0.6,by-u*0.8,u*1.2,u*0.22);TH.ell(c,bx,by-u*1.2,u*0.6,u*0.27,'#3b4668');}},
  fuelTank:{cat:'prop',w:1.7,tier:2,weight:2.5,cost:1,max:2,draw(c,x,y,u,v){ssh(c,x,y,u*1.8,u*3.5);[[-0.8,0.1],[0.9,0.35]].forEach(([dx,dy],i)=>{const tx=x+dx*u,ty=y+dy*u,rx=u*0.85,h=u*(3.0-i*0.5);TH.ell(c,tx,ty,rx*0.99,rx*0.5,'#7b86a0');c.fillStyle='#d9deea';c.fillRect(tx-rx*0.99,ty-h,rx*1.98,h);
      const g=c.createLinearGradient(tx-rx,0,tx+rx,0);g.addColorStop(0,'rgba(255,255,255,.4)');g.addColorStop(1,'rgba(30,40,70,.45)');c.fillStyle=g;c.fillRect(tx-rx*0.99,ty-h,rx*1.98,h);
      for(let k=0;k<4;k++){const hy=ty-h*0.15-k*h*0.22;c.fillStyle=k%2?'#1c2438':'#f2c230';c.fillRect(tx-rx*0.99,hy-h*0.07,rx*1.98,h*0.07);}
      TH.ell(c,tx,ty-h,rx*0.99,rx*0.5,'#eef1f8');TH.ell(c,tx,ty-h,rx*0.35,rx*0.17,'#98a1b6');});
    TH.ln(c,[x-u*0.8,y-u*2.6],[x+u*0.9,y-u*2.1],'#4b556f',u*0.14);}},
  solarPanels:{cat:'prop',w:2.6,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);ssh(c,x,y,u*2.6,u*2);
    [-1.9,0,1.9].forEach(X=>{[-0.7,0.7].forEach(dx=>TH.ln(c,I(X+dx,0.25,0),I(X+dx,0.1,1.0),'#6b7490',u*0.1));
      TH.poly(c,[I(X-0.85,0.15,0.9),I(X+0.85,0.15,0.9),I(X+0.85,-0.55,2.0),I(X-0.85,-0.55,2.0)],'#1d3a9e','#e6eaf3',u*0.07);
      for(let k=1;k<4;k++)TH.ln(c,I(X-0.85+k*0.425,0.15,0.9),I(X-0.85+k*0.425,-0.55,2.0),'rgba(150,190,255,.5)',u*0.04);TH.ln(c,I(X-0.85,-0.2,1.45),I(X+0.85,-0.2,1.45),'rgba(150,190,255,.5)',u*0.04);
      TH.poly(c,[I(X-0.8,0.14,0.95),I(X-0.3,0.14,0.95),I(X-0.3,-0.5,1.9),I(X-0.8,-0.5,1.9)],'rgba(255,255,255,.12)');});
    TH.ln(c,I(-1.9,0.25,0.2),I(1.9,0.25,0.2),'#4b556f',u*0.08);}},
  antennaDish:{cat:'prop',w:1.7,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v,tm){ssh(c,x,y,u*1.6,u*4);hbox(c,x,y,u,-0.6,0.6,-0.6,0.6,0,0.6,-0.05);TH.ln(c,[x,y-u*0.4],[x,y-u*2.6],S.hullD,u*0.28);TH.ln(c,[x-u*0.05,y-u*0.4],[x-u*0.05,y-u*2.6],S.hull,u*0.1);
    const sw=Math.sin((tm||0)*0.7+v)*0.5;c.save();c.translate(x,y-u*3.0);c.rotate(-0.55+sw*0.5);TH.ell(c,0,0,u*1.7,u*0.9,'#9ba4ba');TH.ell(c,u*0.1,0,u*1.5,u*0.75,'#dfe4ef');TH.ell(c,u*0.14,0,u*1.1,u*0.55,'#c3cadb');TH.ell(c,u*0.16,0,u*0.5,u*0.25,'#a4adc4');
    c.strokeStyle='rgba(90,100,130,.5)';c.lineWidth=u*0.05;for(let k=0;k<6;k++){c.beginPath();c.moveTo(u*0.14,0);c.lineTo(u*0.14+Math.cos(k*1.047)*u*1.5,Math.sin(k*1.047)*u*0.75);c.stroke();}
    TH.ln(c,[u*0.14,0],[u*0.9,-u*1.2],'#6b7490',u*0.08);TH.ell(c,u*0.9,-u*1.25,u*0.14,u*0.14,'#e6eaf3');c.restore();}},
  beacon:{cat:'prop',w:1.0,tier:2,weight:2.5,cost:1,max:2,draw(c,x,y,u,v,tm){ssh(c,x,y,u,u*6);const H=u*6.2;[[-0.7,0.15],[0.7,0.15],[0,-0.3]].forEach(([dx,dy])=>TH.ln(c,[x+dx*u,y+dy*u],[x+dx*u*0.18,y-H],'#8d96ad',u*0.12));
    for(let k=1;k<6;k++){const t=k/6,w=0.7*(1-t*0.8);TH.ln(c,[x-w*u,y-H*t],[x+w*u,y-H*t],'#6b7490',u*0.06);}TH.ln(c,[x-u*0.65,y],[x+u*0.15,y-H*0.4],'#6b7490',u*0.05);
    const on=Math.floor((tm||0)*2+v)%2===0,col=on?'#ef4444':'#7f1d1d';if(on)glo(c,x,y-H-u*0.2,u*2.2,'239,68,68',0.45);TH.ell(c,x,y-H-u*0.2,u*0.28,u*0.28,col);TH.ell(c,x,y-H*0.55,u*0.2,u*0.2,on?'#22d3ee':'#0e7490');}},
  rover:{cat:'prop',w:1.9,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);ssh(c,x,y,u*2,u*2);
    [[-1.0,-1.0],[1.0,-1.0]].forEach(([X,Y])=>{const p=I(X,Y,0.55);TH.ell(c,p[0],p[1],u*0.5,u*0.55,'#1f2639');TH.ell(c,p[0],p[1],u*0.2,u*0.22,'#8d96ad');});
    hbox(c,x,y,u,-1.3,1.3,-0.7,0.7,0.5,1.2);TH.poly(c,[I(-0.9,0.71,0.6),I(-0.2,0.71,0.6),I(-0.2,0.71,1.1),I(-0.9,0.71,1.1)],'#7dd3fc');TH.poly(c,[I(-1.0,-0.6,1.25),I(0.6,-0.6,1.25),I(0.6,0.5,1.25),I(-1.0,0.5,1.25)],'#1d3a9e');
    TH.ln(c,I(1.0,0,1.2),I(1.0,0,2.2),'#98a1b6',u*0.07);TH.ell(c,...I(1.0,0,2.2),u*0.28,u*0.14,'#e6eaf3');
    [[-1.0,1.0],[1.0,1.0]].forEach(([X,Y])=>{const p=I(X,Y,0.55);TH.ell(c,p[0],p[1],u*0.5,u*0.55,'#2a3350');TH.ell(c,p[0],p[1],u*0.5,u*0.55,'rgba(0,0,0,.2)');TH.ell(c,p[0],p[1],u*0.2,u*0.22,'#b6bed2');});}},
  astronaut:{cat:'prop',w:0.8,tier:1,weight:3,cost:1,draw(c,x,y,u,v,tm){ssh(c,x,y,u*0.9,u*2.5);const w=Math.sin((tm||0)*3+v)*0.5;
    TH.poly(c,[[x-u*0.4,y],[x-u*0.1,y],[x-u*0.1,y-u*1.0],[x-u*0.4,y-u*1.0]],'#e6eaf3');TH.poly(c,[[x+u*0.1,y],[x+u*0.4,y],[x+u*0.4,y-u*1.0],[x+u*0.1,y-u*1.0]],'#c3cadb');TH.ell(c,x-u*0.25,y,u*0.25,u*0.1,'#4b556f');TH.ell(c,x+u*0.25,y,u*0.25,u*0.1,'#4b556f');
    c.fillStyle='#d6dbe8';c.beginPath();c.roundRect?c.roundRect(x-u*0.55,y-u*2.0,u*1.1,u*1.1,u*0.3):c.rect(x-u*0.55,y-u*2.0,u*1.1,u*1.1);c.fill();TH.ln(c,[x-u*0.55,y-u*1.8],[x-u*0.95,y-u*1.0],'#e6eaf3',u*0.32);TH.ln(c,[x+u*0.55,y-u*1.8],[x+u*(0.95+w*0.2),y-u*(2.6+w*0.3)],'#e6eaf3',u*0.32);
    c.fillStyle='#a8b0c6';c.fillRect(x-u*0.85,y-u*1.9,u*0.3,u*1.0);TH.ell(c,x,y-u*2.35,u*0.55,u*0.55,'#eef1f8');TH.ell(c,x+u*0.1,y-u*2.35,u*0.38,u*0.34,'#e3b341');TH.ell(c,x+u*0.15,y-u*2.4,u*0.2,u*0.13,'rgba(255,255,255,.55)');TH.ell(c,x-u*0.1,y-u*1.5,u*0.18,u*0.14,'#22d3ee');}},
  flagPole:{cat:'prop',w:0.9,tier:1,weight:2,cost:1,max:1,draw(c,x,y,u,v){ssh(c,x,y,u*0.9,u*4);TH.ell(c,x,y,u*0.4,u*0.16,'#6b7490');TH.ln(c,[x,y],[x,y-u*5],'#d5dae6',u*0.14);TH.ln(c,[x,y-u*4.7],[x+u*2.2,y-u*4.7],'#d5dae6',u*0.1);
    const fx=x,fy=y-u*4.7;c.fillStyle='#e11d48';c.fillRect(fx,fy,u*2.2,u*0.4);c.fillStyle='#f8fafc';c.fillRect(fx,fy+u*0.4,u*2.2,u*0.4);c.fillStyle='#2563eb';c.fillRect(fx,fy+u*0.8,u*2.2,u*0.4);c.fillStyle='#f8fafc';c.fillRect(fx,fy,u*0.8,u*1.2);c.fillStyle='#2563eb';c.fillRect(fx,fy,u*0.8,u*0.6);TH.ell(c,fx+u*0.4,fy+u*0.3,u*0.14,u*0.14,'#f8fafc');TH.ell(c,x,y-u*5,u*0.12,u*0.12,'#f2c230');}},
  lander:{cat:'prop',w:2.0,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v){ssh(c,x,y,u*2.2,u*4);
    [[-1.7,0.2],[1.7,0.2],[-1.0,-0.5],[1.1,-0.4]].forEach(([dx,dy])=>{TH.ln(c,[x+dx*u*0.3,y-u*1.7],[x+dx*u,y+dy*u],'#8d96ad',u*0.14);TH.ell(c,x+dx*u,y+dy*u,u*0.45,u*0.2,'#6b7490');});
    TH.poly(c,[[x-u*1.2,y-u*1.6],[x-u*0.8,y-u*3.2],[x+u*0.8,y-u*3.2],[x+u*1.2,y-u*1.6]],'#e0a72a');TH.poly(c,[[x+u*0.4,y-u*3.2],[x+u*0.8,y-u*3.2],[x+u*1.2,y-u*1.6],[x+u*0.5,y-u*1.6]],'#b9821a');TH.poly(c,[[x-u*1.2,y-u*1.6],[x-u*0.8,y-u*3.2],[x-u*0.6,y-u*3.2],[x-u*0.9,y-u*1.6]],'#f5c85a');
    TH.ell(c,x,y-u*3.2,u*0.8,u*0.35,'#d8dee9');TH.poly(c,[[x-u*0.8,y-u*3.2],[x-u*0.5,y-u*3.9],[x+u*0.5,y-u*3.9],[x+u*0.8,y-u*3.2]],'#e6eaf3');TH.ell(c,x-u*0.1,y-u*3.5,u*0.28,u*0.22,'#7dd3fc');TH.ln(c,[x-u*0.4,y-u*1.6],[x-u*1.2,y+u*0.1],'#b6bed2',u*0.07);}},
  airlock:{cat:'prop',w:2.4,tier:3,weight:2.5,cost:1,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);ssh(c,x,y,u*2.6,u*2);hbox(c,x,y,u,-2.4,2.4,-0.9,0.9,0,1.5,-0.02);
    for(let k=-2;k<=2;k++)TH.ln(c,I(k*0.9,0.91,0),I(k*0.9,0.91,1.5),'rgba(70,80,110,.4)',u*0.06);
    TH.ell(c,...I(2.4,0,0.8),u*0.5,u*0.62,'#98a1b6');TH.ell(c,...I(2.4,0,0.8),u*0.35,u*0.45,'#2a3044');TH.ln(c,I(2.4,0,0.35),I(2.4,0,1.25),'#22d3ee',u*0.07);
    [-1.4,0.4].forEach(X=>TH.poly(c,[I(X,0.92,0.7),I(X+0.7,0.92,0.7),I(X+0.7,0.92,1.2),I(X,0.92,1.2)],'#7dd3fc','#475569',u*0.05));
    TH.poly(c,[I(-0.2,-0.9,1.5),I(0.2,-0.9,1.5),I(0.2,-0.9,2.3),I(-0.2,-0.9,2.3)],'#98a1b6');glo(c,...I(-1.6,0.95,1.2),u*1.4,'125,211,252',0.2+0.08*Math.sin((tm||0)*2));}},
  habPod:{cat:'prop',w:2.0,tier:3,weight:2.5,cost:2,max:2,draw(c,x,y,u,v,tm){const R=u*2.0,H=u*1.9;ssh(c,x,y,R*1.1,u*2);TH.ell(c,x,y,R*1.05,R*0.48,'#7b86a0');
    c.beginPath();c.ellipse(x,y,R,H,0,Math.PI,2*Math.PI,false);c.ellipse(x,y,R,R*0.46,0,0,Math.PI,false);c.closePath();const g=c.createLinearGradient(x-R,0,x+R,0);g.addColorStop(0,'#f6f8fc');g.addColorStop(0.6,'#cfd5e4');g.addColorStop(1,'#8e97b0');c.fillStyle=g;c.fill();
    c.save();c.clip();c.strokeStyle='rgba(80,90,120,.55)';c.lineWidth=u*0.06;for(let k=-3;k<=3;k++){c.beginPath();c.moveTo(x+R*k/3.4,y+R*0.46*Math.sqrt(1-(k/3.4)**2));c.quadraticCurveTo(x+R*k/3.4*0.6,y-H*0.7,x,y-H);c.stroke();}
    for(let t=1;t<=3;t++){const q=t/4,rr=R*Math.sqrt(1-q*q);c.beginPath();c.ellipse(x,y-H*q,rr,rr*0.46,0,0,Math.PI);c.stroke();}c.restore();
    TH.poly(c,[[x+R*0.2,y+R*0.35],[x+R*0.6,y+R*0.25],[x+R*0.6,y-H*0.35],[x+R*0.2,y-H*0.2]],'#1a2236');TH.poly(c,[[x+R*0.26,y+R*0.28],[x+R*0.54,y+R*0.2],[x+R*0.54,y-H*0.3],[x+R*0.26,y-H*0.16]],'rgba(252,211,77,'+(0.5+0.2*Math.sin((tm||0)*2))+')');
    TH.ell(c,x-R*0.4,y-H*0.35,u*0.25,u*0.2,'#7dd3fc');TH.ell(c,x-R*0.1,y-H*0.62,u*0.2,u*0.16,'#7dd3fc');}},
  hologramSign:{cat:'prop',w:1.3,tier:3,weight:2,cost:1,max:1,draw(c,x,y,u,v,tm){const t=tm||0;ssh(c,x,y,u*1.3,u);TH.ell(c,x,y,u*0.9,u*0.4,'#2a3044');TH.ell(c,x,y-u*0.2,u*0.7,u*0.3,'#4b556f');TH.ell(c,x,y-u*0.2,u*0.45,u*0.18,'#22d3ee');
    const g=c.createLinearGradient(0,y-u*4.5,0,y-u*0.3);g.addColorStop(0,'rgba(34,211,238,.02)');g.addColorStop(1,'rgba(34,211,238,.35)');c.fillStyle=g;c.beginPath();c.moveTo(x-u*0.55,y-u*0.3);c.lineTo(x-u*1.2,y-u*4.4);c.lineTo(x+u*1.2,y-u*4.4);c.lineTo(x+u*0.55,y-u*0.3);c.closePath();c.fill();
    const cy=y-u*3.0,rr=u*1.1,fl=0.7+0.3*Math.sin(t*7+v);c.strokeStyle='rgba(165,243,252,'+fl+')';c.lineWidth=u*0.07;c.beginPath();c.arc(x,cy,rr,0,7);c.stroke();
    for(let k=-1;k<=1;k++){c.beginPath();c.ellipse(x,cy+k*rr*0.5,rr*Math.sqrt(1-(k*0.5)**2),rr*0.25,0,0,7);c.stroke();}for(let k=0;k<3;k++){c.beginPath();c.ellipse(x,cy,rr*Math.abs(Math.cos(t*1.2+k*1.05)),rr,0,0,7);c.stroke();}}},
  drillRig:{cat:'prop',w:2.0,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);ssh(c,x,y,u*2,u*5);TH.ell(c,x,y,u*1.8,u*0.8,'#555c75');TH.ell(c,x,y,u*0.5,u*0.22,'#1c2438');
    [[-1.2,-0.5],[1.2,-0.5],[-1.0,0.7],[1.0,0.7]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(X*0.25,Y*0.25,4.6),'#f2c230',u*0.14));
    for(let k=1;k<5;k++){const t=k/5,w=1.0-0.75*t;TH.ln(c,I(-w*1.2,0.7*w,4.6*t),I(w*1.2,0.7*w,4.6*t),'#c9962a',u*0.07);TH.ln(c,I(-w*1.2,-0.5*w,4.6*t),I(w*1.2,-0.5*w,4.6*t),'#c9962a',u*0.06);}
    const off=((tm||0)*3)%1;TH.ln(c,[x,y-u*4.7],[x,y-u*0.3],'#98a1b6',u*0.3);for(let k=0;k<7;k++){const yy=y-u*(0.5+k*0.6+off*0.6);TH.ln(c,[x-u*0.2,yy],[x+u*0.2,yy-u*0.3],'#4b556f',u*0.06);}
    TH.poly(c,[[x-u*0.3,y-u*0.3],[x+u*0.3,y-u*0.3],[x,y+u*0.5]],'#6b7490');hbox(c,x,y,u,2.0,3.4,-0.6,0.8,0,1.5);TH.ln(c,[x+u*0.9,y-u*0.9],[x+u*0.2,y-u*3.8],'#4b556f',u*0.09);
    TH.ell(c,x,y-u*4.85,u*0.45,u*0.22,'#e6eaf3');TH.ell(c,x,y-u*4.9,u*0.2,u*0.1,'#ef4444');}},
  /* ---------- landmarks ---------- */
  radioTelescope:{cat:'landmark',w:2.4,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){ssh(c,x,y,u*2.6,u*8);const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),sw=Math.sin((tm||0)*0.3+v)*0.12;
    [[-1.4,-0.8],[1.4,-0.8],[-1.2,1.0],[1.2,1.0]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(X*0.22,Y*0.22,5.2),'#c3cadb',u*0.2));
    for(let k=1;k<5;k++){const t=k/5,w=1-0.78*t;TH.ln(c,I(-1.3*w,1.0*w,5.2*t),I(1.3*w,1.0*w,5.2*t),'#8d96ad',u*0.09);TH.ln(c,I(1.3*w,-0.8*w,5.2*t),I(1.3*w,1.0*w,5.2*t),'#8d96ad',u*0.09);}
    hbox(c,x,y,u,-1.0,1.0,-0.8,0.8,0,0.5,-0.05);TH.ell(c,x,y-u*5.4,u*0.5,u*0.5,'#6b7490');
    c.save();c.translate(x+u*0.2,y-u*6.3);c.rotate(-0.62+sw);TH.ell(c,0,0,u*4.2,u*1.9,'#8d96ad');TH.ell(c,u*0.15,0,u*3.9,u*1.75,'#eef1f8');TH.ell(c,u*0.2,0,u*3.0,u*1.35,'#d5dae8');TH.ell(c,u*0.24,0,u*1.9,u*0.85,'#bcc4d8');TH.ell(c,u*0.26,0,u*0.9,u*0.4,'#98a1b6');
    c.strokeStyle='rgba(90,100,130,.5)';c.lineWidth=u*0.06;for(let k=0;k<12;k++){const a=k*0.5236;c.beginPath();c.moveTo(u*0.26,0);c.lineTo(u*0.15+Math.cos(a)*u*3.9,Math.sin(a)*u*1.75);c.stroke();}
    const fp=[u*0.3,-u*3.4];[[-3.5,0.2],[3.5,0.2],[0,-1.6]].forEach(([dx,dy])=>TH.ln(c,[dx*u,dy*u],fp,'#6b7490',u*0.1));TH.ell(c,fp[0],fp[1],u*0.3,u*0.3,'#e6eaf3');TH.ell(c,fp[0],fp[1],u*0.14,u*0.14,'#ef4444');c.restore();}},
  observatory:{cat:'landmark',w:2.6,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const rx=u*2.3,h=u*3.2;ssh(c,x,y,u*2.8,u*6);TH.ell(c,x,y,rx*1.2,rx*0.55,'#6b7490');TH.ell(c,x,y,rx*0.99,rx*0.5,'#a4adc4');
    c.fillStyle='#e6eaf3';c.fillRect(x-rx*0.99,y-h,rx*1.98,h);const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,'rgba(255,255,255,.4)');g.addColorStop(1,'rgba(30,40,70,.5)');c.fillStyle=g;c.fillRect(x-rx*0.99,y-h,rx*1.98,h);
    for(let k=-2;k<=2;k++){const wx=x+k*rx*0.38,off=rx*0.5*Math.sqrt(Math.max(0,1-(k*0.38)**2));c.fillStyle='#2a3a66';c.fillRect(wx-u*0.2,y-h*0.68+off*0.0,u*0.4,u*0.9);}
    c.fillStyle='#f2c230';c.fillRect(x-rx*0.99,y-h*0.2,rx*1.98,h*0.07);TH.ell(c,x,y-h,rx*0.99,rx*0.5,'#c3cadb');
    c.beginPath();c.ellipse(x,y-h,rx*0.95,rx*1.0,0,Math.PI,2*Math.PI,false);c.closePath();const dg=c.createLinearGradient(x-rx,0,x+rx,0);dg.addColorStop(0,'#fafbfe');dg.addColorStop(0.55,'#d3d9e8');dg.addColorStop(1,'#8e97b0');c.fillStyle=dg;c.fill();
    c.save();c.clip();const sl=Math.sin((tm||0)*0.4+v)*rx*0.55;c.fillStyle='#0b1020';c.fillRect(x+sl-u*0.45,y-h-rx*1.1,u*0.9,rx*1.4);
    c.strokeStyle='rgba(90,100,130,.45)';c.lineWidth=u*0.05;for(let k=-3;k<=3;k++){c.beginPath();c.moveTo(x+rx*k/3.3,y-h);c.quadraticCurveTo(x+rx*k/3.3*0.6,y-h-rx*0.7,x,y-h-rx*0.98);c.stroke();}c.restore();
    c.save();c.translate(x+sl,y-h-rx*0.55);c.rotate(-0.5);c.fillStyle='#5b6580';c.fillRect(-u*0.28,-u*1.3,u*0.56,u*1.7);c.fillStyle='#c3cadb';c.fillRect(-u*0.28,-u*1.3,u*0.56,u*0.3);c.restore();
    TH.ln(c,[x-rx*1.05,y-h*0.5],[x-rx*1.45,y-h*0.5-u*0.9],'#98a1b6',u*0.12);}},
  habitatDome:{cat:'landmark',w:4.3,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const R=u*4.2,H=u*3.7,r=mulberry(v+4);ssh(c,x,y,R*1.1,u*6);TH.ell(c,x,y,R*1.1,R*0.5,'#7b86a0');TH.ell(c,x,y,R*1.0,R*0.46,'#4b556f');
    c.beginPath();c.ellipse(x,y,R,H,0,Math.PI,2*Math.PI,false);c.ellipse(x,y,R,R*0.46,0,0,Math.PI,false);c.closePath();c.save();c.clip();
    const g=c.createLinearGradient(0,y-H,0,y+R*0.4);g.addColorStop(0,'#b9e6f2');g.addColorStop(1,'#4f7f8f');c.fillStyle=g;c.fillRect(x-R,y-H,R*2,H+R*0.5);
    for(let k=0;k<7;k++){const tx=x+(k-3)*R*0.27+(r()-0.5)*u*0.4,ty=y+R*0.1*(k%2)-u*0.1,th=u*(1.2+r()*1.5);TH.ln(c,[tx,ty],[tx,ty-th*0.6],'#5a3b22',u*0.15);TH.ell(c,tx,ty-th*0.85,u*(0.55+r()*0.3),u*(0.7+r()*0.2),['#3f9d5f','#2f7d4f','#56b36f'][k%3]);}
    TH.ell(c,x-R*0.35,y-H*0.35,R*0.5,H*0.25,'rgba(255,255,255,.18)');c.restore();
    c.strokeStyle='#eef1f8';c.lineWidth=u*0.1;c.save();c.beginPath();c.ellipse(x,y,R,H,0,Math.PI,2*Math.PI,false);c.ellipse(x,y,R,R*0.46,0,0,Math.PI,false);c.closePath();c.clip();
    for(let k=-3;k<=3;k++){c.beginPath();c.moveTo(x+R*k/3.4,y+R*0.46*Math.sqrt(1-(k/3.4)**2));c.quadraticCurveTo(x+R*k/3.4*0.62,y-H*0.7,x,y-H);c.stroke();}
    for(let t=1;t<=4;t++){const q=t/5,rr=R*Math.sqrt(1-q*q);c.beginPath();c.ellipse(x,y-H*q,rr,rr*0.46,0,0,Math.PI);c.stroke();}c.restore();
    c.lineWidth=u*0.14;c.beginPath();c.ellipse(x,y,R,R*0.46,0,0,Math.PI);c.stroke();c.beginPath();c.ellipse(x,y,R,H,0,Math.PI,2*Math.PI);c.stroke();
    const I=(X,Y,Z)=>TH.iso(x+R*0.55,y+R*0.52,u,X,Y,Z);hbox(c,x+R*0.55,y+R*0.52,u,-1.0,1.0,-0.8,0.8,0,1.8);TH.poly(c,[I(-0.5,0.81,0),I(0.5,0.81,0),I(0.5,0.81,1.3),I(-0.5,0.81,1.3)],'#1a2236');glo(c,...I(0,0.9,0.7),u*1.2,'252,211,77',0.25+0.08*Math.sin((tm||0)*2));}},
  rocket:{cat:'landmark',w:2.6,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const H=u*11.8,rw=u*1.15,I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),t=tm||0;ssh(c,x,y,u*3.2,H*0.5);
    TH.ell(c,x,y,u*3.2,u*1.45,'#4a526a');TH.ell(c,x,y-u*0.12,u*2.8,u*1.25,'#5d6580');c.strokeStyle='#f2c230';c.lineWidth=u*0.12;c.beginPath();c.ellipse(x,y-u*0.12,u*2.4,u*1.05,0,0,7);c.stroke();
    const gx=-3.4;[[-0.8,-0.8],[0.8,-0.8],[-0.8,0.8],[0.8,0.8]].forEach(([dx,dy])=>TH.ln(c,I(gx+dx*0.5,dy*0.5,0),I(gx+dx*0.5,dy*0.5,9.8),'#c9962a',u*0.13));
    for(let k=1;k<9;k++){TH.ln(c,I(gx-0.4,0.4,k*1.1),I(gx+0.4,0.4,k*1.1),'#a87b22',u*0.06);TH.ln(c,I(gx+0.4,-0.4,k*1.1),I(gx+0.4,0.4,k*1.1),'#a87b22',u*0.06);}
    [3.0,5.6,8.2].forEach(Z=>{TH.ln(c,I(gx+0.4,0,Z),I(-1.0,0,Z),'#c9962a',u*0.12);});
    const by=y-u*0.9,top=y-H*0.78,mid=(by+top)/2;TH.poly(c,[[x-rw,by-u*0.5],[x-rw-u*1.7,by+u*0.35],[x-rw,by-u*2.6]],'#d6384d');TH.poly(c,[[x+rw,by-u*0.5],[x+rw+u*1.7,by+u*0.35],[x+rw,by-u*2.6]],'#a82a3b');
    c.fillStyle='#f4f6fb';c.fillRect(x-rw,top,rw*2,by-top);TH.ell(c,x,by,rw,rw*0.42,'#c9d0df');
    const g=c.createLinearGradient(x-rw,0,x+rw,0);g.addColorStop(0,'rgba(255,255,255,.45)');g.addColorStop(0.5,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(30,40,70,.5)');c.fillStyle=g;c.fillRect(x-rw,top,rw*2,by-top);
    [[0.18,0.1],[0.86,0.06]].forEach(([f,hf])=>{const yb=top+(by-top)*f;c.fillStyle='#d6384d';c.fillRect(x-rw,yb,rw*2,(by-top)*hf);});
    c.beginPath();c.moveTo(x-rw,top);c.quadraticCurveTo(x-rw*0.85,top-u*2.2,x,top-u*3.8);c.quadraticCurveTo(x+rw*0.85,top-u*2.2,x+rw,top);c.closePath();c.fillStyle='#d6384d';c.fill();c.fillStyle=g;c.fill();
    TH.ell(c,x,mid-u*0.5,u*0.42,u*0.42,'#475569');TH.ell(c,x,mid-u*0.5,u*0.3,u*0.3,'#7dd3fc');TH.ell(c,x-u*0.08,mid-u*0.58,u*0.1,u*0.1,'rgba(255,255,255,.6)');
    for(let k=0;k<5;k++){const ph=(t*0.7+k*0.2)%1;c.fillStyle='rgba(240,243,250,'+(0.55*(1-ph))+')';c.beginPath();c.ellipse(x+(k-2)*u*0.6*(1+ph),y+u*0.1-ph*u*0.2,u*(0.5+ph*1.1),u*(0.25+ph*0.45),0,0,7);c.fill();}}},
  crashedSaucer:{cat:'landmark',w:3.4,tier:4,weight:2.5,cost:4,draw(c,x,y,u,v,tm){const t=tm||0,rx=u*3.8;ssh(c,x,y,u*3.6,u*3);TH.ell(c,x,y,u*4.4,u*1.6,'#4a4560');TH.ell(c,x-u*0.3,y,u*3.8,u*1.3,'#3b3750');
    c.save();c.translate(x,y-u*1.4);c.rotate(-0.2);TH.ell(c,0,u*0.55,rx,u*1.5,'#6b7490');TH.ell(c,0,u*0.3,rx,u*1.5,'#98a1b6');TH.ell(c,0,0,rx,u*1.5,'#c9d0e0');TH.ell(c,0,-u*0.1,rx*0.88,u*1.28,'#e1e6f0');TH.ell(c,0,-u*0.1,rx*0.62,u*0.9,'#b4bdd2');
    for(let k=0;k<10;k++){const a=k/10*6.283,on=(Math.floor(t*4)+k)%2===0;const px=Math.cos(a)*rx*0.8,py=Math.sin(a)*u*1.15+u*0.1;if(Math.sin(a)>-0.3){glo(c,px,py,u*0.7,'34,211,238',on?0.5:0.1);TH.ell(c,px,py,u*0.13,u*0.1,on?'#a5f3fc':'#0e7490');}}
    c.beginPath();c.ellipse(0,-u*0.5,rx*0.38,u*1.7,0,Math.PI,2*Math.PI,false);c.closePath();const dg=c.createLinearGradient(-rx*0.4,0,rx*0.4,0);dg.addColorStop(0,'rgba(190,250,255,.9)');dg.addColorStop(1,'rgba(40,160,190,.9)');c.fillStyle=dg;c.fill();TH.ell(c,-rx*0.1,-u*1.5,u*0.3,u*0.2,'rgba(255,255,255,.6)');
    c.strokeStyle='#2a3044';c.lineWidth=u*0.1;c.beginPath();c.moveTo(rx*0.3,-u*0.9);c.lineTo(rx*0.5,-u*0.2);c.lineTo(rx*0.4,u*0.5);c.stroke();c.restore();
    for(let k=0;k<5;k++){const ph=(t*0.5+k*0.2)%1;c.fillStyle='rgba(60,64,84,'+(0.5*(1-ph))+')';c.beginPath();c.ellipse(x+u*1.6+Math.sin(ph*5+k)*u*0.5,y-u*3.2-ph*u*3.6,u*(0.4+ph*0.9),u*(0.35+ph*0.7),0,0,7);c.fill();}
    const r=mulberry(v+2);for(let k=0;k<5;k++)TH.blob(c,x+(r()-0.5)*u*5.5,y+u*0.6+r()*u*0.5,u*0.45,u*0.3,'#6b7289',r,7);}}
  }};
const SPACE_HEIGHT={crater:'low',moonBoulder:'low',oreRock:'low',crystalCluster:'low',glowPods:'low',alienFronds:'low',crateStack:'low',solarPanels:'low',rover:'low',airlock:'low',astronaut:'low',
  fuelTank:'mid',antennaDish:'mid',beacon:'mid',flagPole:'mid',lander:'mid',habPod:'mid',hologramSign:'mid',drillRig:'mid',
  radioTelescope:'tall',observatory:'tall',habitatDome:'tall',rocket:'tall',crashedSaucer:'tall'};
Object.keys(SPACE_PACK.assets).forEach(id=>{SPACE_PACK.assets[id].h=SPACE_HEIGHT[id]||'low';});
const KEEP_OUT={rx:0.52,ry:0.34};   // central ellipse (x R) reserved for the ride or building sprite
function placeThemeAssets(pack,tier,R,seed){
  const rnd=mulberry(seed*7919+tier*131), u=R*0.068, T=pack.tiers[tier], out=[], decals=[], TAU=Math.PI*2;
  if(!T)return {assets:out,decals,u};
  const inside=(x,y,k)=>{const X=Math.abs(x)/R,Y=Math.abs(y)/(0.58*R);return X<=0.866*k&&Y<=k-X/1.732;};
  const ids=Object.keys(pack.assets), cnt={};
  const free=(x,y,w)=>out.every(o=>Math.hypot(o.x-x,(o.y-y)*1.7)>(o.w+w)*u*0.8);
  const clearOfCenter=(x,y,w,h)=>{const kx=h==='tall'?0.28:0.75,ky=h==='tall'?0.18:0.4,ex=R*KEEP_OUT.rx+w*u*kx,ey=R*KEEP_OUT.ry+w*u*ky;return x*x/(ex*ex)+y*y/(ey*ey)>1;};
  const zoneOK=(a,x,y)=>{const h=a.h||'low';if(h==='low')return true;const ax=Math.abs(x)/R;
    if(h==='tall')return y<R*0.12&&ax>(y>=-R*0.12?0.55:0.4);
    if(y>R*0.12)return h==='mid'&&ax>0.5;if(y>=-R*0.12)return h==='mid'||ax>0.55;return true;};
  const ringPoint=(tmax)=>{const th=rnd()*TAU,dx=Math.cos(th),dy=Math.sin(th);let lo=0,hi=R*1.2;
    for(let i=0;i<12;i++){const m=(lo+hi)/2;if(inside(dx*m,dy*m,0.9))lo=m;else hi=m;}const t=0.5+rnd()*((tmax||1)-0.5);return[dx*lo*t,dy*lo*t];};
  const spot=a=>{for(let i=0;i<120;i++){const p=ringPoint(a.h==='tall'?0.8:a.h==='mid'?0.92:1);if(clearOfCenter(p[0],p[1],a.w,a.h)&&zoneOK(a,p[0],p[1])&&free(p[0],p[1],a.w))return p;}return null;};
  const add=(id,x,y)=>{const a=pack.assets[id];out.push({id,x,y,v:Math.floor(rnd()*1000),w:a.w});cnt[id]=(cnt[id]||0)+1;};
  for(let i=0;i<T.decals;i++){const pool=ids.filter(id=>pack.assets[id].cat==='decal'&&pack.assets[id].tier<=tier),id=pool[Math.floor(rnd()*pool.length)];
    for(let t=0;t<40;t++){const p=ringPoint();if(clearOfCenter(p[0],p[1],pack.assets[id].w*0.5)){decals.push({id,x:p[0],y:p[1],v:Math.floor(rnd()*1000)});break;}}}
  let budget=T.budget;
  const land=()=>{let id=T.pool[Math.floor(rnd()*T.pool.length)];for(let q=0;q<8&&cnt[id];q++)id=T.pool[Math.floor(rnd()*T.pool.length)];
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}};
  if(T.pool.length&&rnd()<T.landmark){land();if(T.second&&rnd()<T.second)land();}
  let guard=0;while(budget>0&&guard++<500){const pool=ids.filter(id=>{const a=pack.assets[id];return a.cat!=='decal'&&a.cat!=='landmark'&&a.tier<=tier&&a.cost<=budget&&(cnt[id]||0)<(a.max||3);});
    if(!pool.length)break;let tot=0;pool.forEach(id=>tot+=pack.assets[id].weight);let pick=rnd()*tot,id=pool[0];for(const q of pool){pick-=pack.assets[q].weight;if(pick<=0){id=q;break;}}
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}else{cnt[id]=99;}}
  return {assets:out,decals,u};
}
function drawThemeGround(ctx,cx,cy,R,pack,border){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);ctx[i?'lineTo':'moveTo'](cx+R*Math.cos(a),cy+R*Math.sin(a)*0.58);}ctx.closePath();
  ctx.fillStyle=pack.ground;ctx.fill();if(border!==false){ctx.lineWidth=Math.max(1.5,R*0.03);ctx.strokeStyle=border||pack.border;ctx.stroke();}}
function drawThemeDecals(ctx,cx,cy,pack,pl,tm){pl.decals.forEach(d=>pack.assets[d.id].draw(ctx,cx+d.x,cy+d.y,pl.u,d.v,tm||0));}
/* layer: 'back' (y<0, draw BEFORE the ride sprite), 'front' (y>=0, draw AFTER it) or omit for all, sorted by y */
function drawThemeAssets(ctx,cx,cy,pack,pl,tm,layer){pl.assets.filter(o=>layer==='back'?o.y<0:layer==='front'?o.y>=0:true).sort((a,b)=>a.y-b.y).forEach(o=>pack.assets[o.id].draw(ctx,cx+o.x,cy+o.y,pl.u,o.v,tm||0));}
function drawThemedTile(ctx,cx,cy,R,pack,tier,seed,tm,border,rideFn){drawThemeGround(ctx,cx,cy,R,pack,border);const pl=placeThemeAssets(pack,tier,R,seed);
  drawThemeDecals(ctx,cx,cy,pack,pl,tm);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'back');if(rideFn)rideFn(ctx,cx,cy,R);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'front');}
return { pack: SPACE_PACK, placeThemeAssets, drawThemeGround, drawThemeDecals, drawThemeAssets };
})();

const JUNGLE_THEME_PACK = (() => {
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
/* ===== JUNGLE PACK ===== */
const J={st:'#bdb9a0',stD:'#8e8a72',stL:'#dad7c3',moss:'#5f8a47',mossD:'#3f6a38',jade:'#2fbf9a',ochre:'#b5532f',turq:'#1fb5a8',dark:'#10161a',clay:'#c4683a'};
const jbox=(c,x,y,u,x0,x1,y0,y1,z0,z1,k)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,k?shade(J.st,k):J.st,k?shade(J.stD,k):J.stD,k?shade(J.stL,k):J.stL);
const jsh=(c,x,y,rx,h)=>{c.fillStyle='rgba(8,26,10,.36)';c.beginPath();c.ellipse(x+h*0.16,y+rx*0.06,rx,rx*0.38,0,0,7);c.fill();};
const jmoss=(c,x,y,u,r,n)=>{for(let k=0;k<(n||3);k++)TH.ell(c,x+(r()-0.5)*u*1.6,y-r()*u*0.3,u*(0.22+r()*0.25),u*0.11,k%2?'rgba(95,138,71,.85)':'rgba(63,106,56,.85)');};
const jglow=(c,x,y,r,rgb,a)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba('+rgb+','+a+')');g.addColorStop(1,'rgba('+rgb+',0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();};
const glyphs=(c,x,y,u,X0,X1,Y,Z0,Z1,r)=>{for(let z=Z0;z<Z1-0.2;z+=0.42)for(let X=X0;X<X1-0.2;X+=0.5){if(r()<0.25)continue;const a=TH.iso(x,y,u,X+0.05,Y,z),b=TH.iso(x,y,u,X+0.05+0.12+r()*0.2,Y,z+(r()<0.5?0:0.12));TH.ln(c,a,b,'rgba(40,38,26,.45)',u*0.07);TH.ln(c,a,TH.iso(x,y,u,X+0.05,Y,z+0.2),'rgba(40,38,26,.4)',u*0.06);}};
const jmask=(c,x,y,u,X,Y,Z,s)=>{const I=(a,b)=>TH.iso(x,y,u,X+a*s,Y,Z+b*s);TH.poly(c,[I(-0.6,-0.6),I(0.6,-0.6),I(0.6,0.6),I(-0.6,0.6)],'rgba(60,56,40,.3)');[-0.3,0.3].forEach(e=>TH.poly(c,[I(e-0.12,0.15),I(e+0.12,0.15),I(e+0.12,0.35),I(e-0.12,0.35)],'rgba(30,30,22,.7)'));TH.ln(c,I(0,0.1),I(0,-0.15),'rgba(30,30,22,.6)',u*0.08);TH.ln(c,I(-0.3,-0.35),I(0.3,-0.35),'rgba(30,30,22,.7)',u*0.1);[-0.2,0.2].forEach(e=>TH.ln(c,I(e,-0.35),I(e,-0.5),'#e8e4d0',u*0.06));};
const JUNGLE_PACK={id:'jungle',name:'Jungle',ground:'#587c48',groundDark:'#456a3a',border:'#35552c',
  tiers:{1:{budget:4,decals:2,landmark:0,pool:[]},2:{budget:7,decals:3,landmark:0,pool:[]},
         3:{budget:11,decals:4,landmark:0.75,pool:['templeShrine','corbelArch','ballCourt']},
         4:{budget:15,decals:5,landmark:1,pool:['stepPyramid','templeShrine','corbelArch','ballCourt'],second:0.45}},
  assets:{
  /* ---------- ground decals ---------- */
  leafLitter:{cat:'decal',w:2.2,tier:1,weight:4,cost:0,draw(c,x,y,u,v){const r=mulberry(v+8);TH.ell(c,x,y,u*2.1,u*0.9,'#3f5f36');for(let k=0;k<26;k++){const a=r()*6.283,rr=Math.sqrt(r());TH.ell(c,x+Math.cos(a)*u*1.9*rr,y+Math.sin(a)*u*0.8*rr,u*0.17,u*0.08,['#6a5a2e','#4e7a3a','#8a6a30','#355a2e','#7a4a2a'][k%5],r()*3);}}},
  lilyPond:{cat:'decal',w:2.2,tier:1,weight:2.5,cost:0,draw(c,x,y,u,v,tm){const r=mulberry(v+4),t=tm||0;TH.ell(c,x,y,u*2.2,u*1.0,'#3a5a3a');TH.ell(c,x,y,u*1.95,u*0.86,'#2f7f78');TH.ell(c,x-u*0.2,y-u*0.05,u*1.5,u*0.6,'#3a9a8e');
    c.strokeStyle='rgba(200,245,235,.5)';c.lineWidth=u*0.05;const ph=(t*0.4+v*0.3)%1;c.beginPath();c.ellipse(x+u*0.5,y+u*0.1,u*(0.2+ph*0.7),u*(0.1+ph*0.32),0,0,7);c.stroke();
    for(let k=0;k<5;k++){const px=x+(r()-0.5)*u*2.8,py=y+(r()-0.5)*u*0.9;TH.ell(c,px,py,u*0.36,u*0.18,'#4aa04a');TH.poly(c,[[px,py],[px+u*0.3,py-u*0.05],[px+u*0.3,py+u*0.05]],'#3a7f4a');if(k%2)TH.ell(c,px,py-u*0.05,u*0.1,u*0.07,'#f9a8d4');}}},
  mossyPaving:{cat:'decal',w:2.4,tier:2,weight:3,cost:0,draw(c,x,y,u,v){const I=(X,Y)=>TH.iso(x,y,u,X,Y,0),r=mulberry(v+2);for(let i=-2;i<=1;i++)for(let j=-1;j<=0;j++){if(r()<0.2)continue;const ox=r()*0.1,oy=r()*0.1;TH.poly(c,[I(i*1.1+ox,j*1.1+oy),I(i*1.1+1.0+ox,j*1.1+oy),I(i*1.1+1.0+ox,j*1.1+1.0+oy),I(i*1.1+ox,j*1.1+1.0+oy)],['#a9a58c','#9a967e','#b4b098'][(i+j+3)%3],'rgba(30,40,25,.5)',u*0.05);}
    for(let k=0;k<8;k++){const p=I(-2.2+r()*4.2,-1+r()*2);TH.ell(c,p[0],p[1],u*(0.2+r()*0.3),u*0.12,'rgba(70,120,55,.8)');}}},
  rootCrawl:{cat:'decal',w:2.2,tier:2,weight:2,cost:0,draw(c,x,y,u,v){const r=mulberry(v+6);for(let k=0;k<7;k++){const a=-2.8+k*0.9+(r()-0.5)*0.4,l=u*(1.2+r()*1.2);c.strokeStyle='#4a3a28';c.lineWidth=u*(0.22-k*0.012);c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+Math.cos(a)*l*0.5,y+Math.sin(a)*l*0.25-u*0.2,x+Math.cos(a)*l,y+Math.sin(a)*l*0.4);c.stroke();}
    TH.ell(c,x,y,u*0.4,u*0.22,'#3a2e20');}},
  /* ---------- jungle flora ---------- */
  fernCluster:{cat:'flora',w:1.6,tier:1,weight:4,cost:1,draw(c,x,y,u,v,tm){const r=mulberry(v*5+2),t=tm||0;jsh(c,x,y,u*1.6,u*1.5);
    for(let k=0;k<9;k++){const a=-3.1+k*0.42,l=u*(1.7+r()*0.8),sw=Math.sin(t*1.3+k)*u*0.06,ex=x+Math.cos(a)*l+sw,ey=y-Math.abs(Math.sin(a))*l*0.9-u*0.2;c.strokeStyle=k%2?'#3f8f45':'#4aa14e';c.lineWidth=u*0.07;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(ex-x)*0.45,y-l*0.95,ex,ey);c.stroke();
      for(let q=1;q<8;q++){const f=q/8,px=x+(ex-x)*f*0.9,py=y+(ey-y)*f-Math.sin(f*3.0)*l*0.35;TH.ln(c,[px,py],[px+(f<0.9?-u*0.28:0),py+u*0.2],'#58b85a',u*0.06);TH.ln(c,[px,py],[px+u*0.28,py+u*0.2],'#58b85a',u*0.06);}}}},
  elephantEar:{cat:'flora',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v,tm){const t=tm||0;jsh(c,x,y,u*1.6,u*2.5);[[-0.9,-1.5,0.5,'#2f7f3f'],[0.8,-1.8,-0.4,'#3a8f48'],[0.0,-2.4,0.05,'#4aa356']].forEach(([dx,dy,rot,col],i)=>{const sw=Math.sin(t*1.2+i)*u*0.05;TH.ln(c,[x+dx*u*0.3,y],[x+dx*u+sw,y+dy*u*0.55],'#2a6a34',u*0.12);
      c.save();c.translate(x+dx*u+sw,y+dy*u);c.rotate(rot);c.fillStyle=col;c.beginPath();c.moveTo(0,u*0.9);c.bezierCurveTo(-u*1.4,u*0.3,-u*1.0,-u*1.1,0,-u*1.0);c.bezierCurveTo(u*1.0,-u*1.1,u*1.4,u*0.3,0,u*0.9);c.fill();c.strokeStyle='rgba(20,70,30,.55)';c.lineWidth=u*0.06;c.beginPath();c.moveTo(0,u*0.9);c.lineTo(0,-u*0.9);for(let k=-2;k<=2;k++){if(k){c.moveTo(0,u*0.1);c.lineTo(k*u*0.4,-u*0.5);}}c.stroke();c.restore();});}},
  heliconia:{cat:'flora',w:1.3,tier:1,weight:3,cost:1,draw(c,x,y,u,v){const r=mulberry(v*3+7);jsh(c,x,y,u*1.3,u*2.5);for(let k=0;k<4;k++){const bx=x+(k-1.5)*u*0.45,h=u*(2.0+r()*1.2);TH.ln(c,[bx,y],[bx+(r()-0.5)*u*0.3,y-h],'#2f7a3a',u*0.1);
      TH.poly(c,[[bx-u*0.5,y-h*0.3],[bx-u*0.05,y-h*0.55],[bx-u*0.1,y-h*0.2]],'#3a8f48');const cx=bx+(k%2?0.1:-0.1)*u;for(let q=0;q<4;q++){const py=y-h*(0.7+q*0.1);TH.poly(c,[[cx,py+u*0.3],[cx+(q%2?1:-1)*u*0.55,py+u*0.05],[cx,py-u*0.05],[cx+(q%2?1:-1)*u*0.15,py+u*0.2]],['#e0382b','#f06a2a','#f2b22b','#e0382b'][q],'#8a1d14',u*0.03);}}}},
  bamboo:{cat:'flora',w:1.5,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*11+3),t=tm||0;jsh(c,x,y,u*1.5,u*5);for(let k=0;k<7;k++){const bx=x+(k-3)*u*0.32,h=u*(4.6+r()*1.6),sw=Math.sin(t*1.1+k)*u*0.1+(k-3)*u*0.06,col=['#7aa83a','#8ab944','#6a9a34'][k%3];
      TH.ln(c,[bx,y],[bx+sw,y-h],'#4a6a24',u*0.28);TH.ln(c,[bx,y],[bx+sw,y-h],col,u*0.2);for(let q=1;q<7;q++){const f=q/7;TH.ln(c,[bx+sw*f-u*0.15,y-h*f],[bx+sw*f+u*0.15,y-h*f],'#4a6a24',u*0.06);}
      for(let q=0;q<3;q++){const f=0.7+q*0.1;TH.poly(c,[[bx+sw*f,y-h*f],[bx+sw*f+(q%2?1:-1)*u*1.1,y-h*f-u*0.15],[bx+sw*f+(q%2?1:-1)*u*0.3,y-h*f+u*0.12]],'#9acd4a','#5a8a28',u*0.03);}}}},
  palmTree:{cat:'tree',w:1.8,tier:2,weight:3,cost:2,max:2,draw(c,x,y,u,v,tm){const r=mulberry(v*9+4),t=tm||0,H=u*(6.4+r()*1.4),lean=(r()-0.5)*u*2.0;jsh(c,x,y,u*2.0,H);
    c.strokeStyle='#6a5236';c.lineWidth=u*0.55;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*0.2,y-H*0.5,x+lean,y-H);c.stroke();c.strokeStyle='#8a6e4a';c.lineWidth=u*0.3;c.stroke();
    for(let k=1;k<12;k++){const f=k/12,px=(1-f)*(1-f)*x+2*(1-f)*f*(x+lean*0.2)+f*f*(x+lean),py=(1-f)*(1-f)*y+2*(1-f)*f*(y-H*0.5)+f*f*(y-H);TH.ln(c,[px-u*0.25,py],[px+u*0.25,py],'rgba(50,34,18,.5)',u*0.06);}
    const tx=x+lean,ty=y-H;for(let k=0;k<9;k++){const a=-3.1+k*0.52,sw=Math.sin(t*1.5+k*0.8)*0.08,l=u*(2.6+(k%2)*0.5);const ex=tx+Math.cos(a+sw)*l,ey=ty+Math.sin(a+sw)*l*0.5+u*0.8;
      c.strokeStyle=k%2?'#2f7f3a':'#3f9a48';c.lineWidth=u*0.18;c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+(ex-tx)*0.55,ty-u*1.2-Math.abs(Math.sin(a))*u*0.6,ex,ey);c.stroke();
      for(let q=1;q<7;q++){const f=q/7,px=tx+(ex-tx)*f,py=ty+(ey-ty)*f-Math.sin(f*3.14)*u*1.0;TH.ln(c,[px,py],[px-(ey-ty)*0.12-u*0.1,py+u*0.5],'#48a852',u*0.07);TH.ln(c,[px,py],[px+(ey-ty)*0.1+u*0.1,py+u*0.5],'#48a852',u*0.07);}}
    [[-0.25,0.35],[0.25,0.4],[0,0.6]].forEach(([dx,dy])=>TH.ell(c,tx+dx*u,ty+dy*u,u*0.28,u*0.28,'#6a4a22'));}},
  kapokTree:{cat:'tree',w:2.6,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v,tm){const r=mulberry(v*7+5),t=tm||0,H=u*5.2;jsh(c,x,y,u*3.0,u*9);
    for(let k=0;k<5;k++){const a=-2.7+k*0.55,l=u*(1.5+r()*0.7);TH.poly(c,[[x+Math.cos(a)*u*0.2,y-u*2.4],[x+Math.cos(a)*l,y+Math.sin(a)*l*0.28+u*0.1],[x+Math.cos(a)*l*0.5+u*0.3,y+Math.sin(a)*l*0.15+u*0.2],[x+u*0.1,y-u*2.8]],k%2?'#6b5a48':'#7a6853');}
    TH.poly(c,[[x-u*0.7,y-u*0.2],[x-u*0.5,y-H],[x+u*0.5,y-H],[x+u*0.7,y-u*0.2]],'#8a7a66');TH.poly(c,[[x+u*0.1,y-H],[x+u*0.5,y-H],[x+u*0.7,y-u*0.2],[x+u*0.15,y-u*0.2]],'rgba(30,24,16,.35)');
    const cols=['#2f6a3a','#3a7a44','#2a5e34','#438a4c'];[[0,-2.4,3.0,2.1],[-2.3,-1.1,2.1,1.5],[2.3,-1.2,2.1,1.5],[0.1,-0.7,2.6,1.6],[-1.2,-3.4,1.9,1.4],[1.4,-3.2,1.8,1.3]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y-H+dy*u,u*rx,u*ry,cols[i%4],r,10));
    for(let k=0;k<7;k++){const vx=x+(r()-0.5)*u*5.0,vy=y-H+u*(0.0+r()*1.0),l=u*(1.8+r()*2.2),sw=Math.sin(t*0.9+k)*u*0.1;c.strokeStyle=k%2?'#3f6a3a':'#4a7a3a';c.lineWidth=u*0.07;c.beginPath();c.moveTo(vx,vy);c.quadraticCurveTo(vx+sw,vy+l*0.5,vx+sw*1.5,vy+l);c.stroke();}}},
  /* ---------- ruin props ---------- */
  mossBoulder:{cat:'rock',w:1.6,tier:1,weight:3.5,cost:1,draw(c,x,y,u,v){const r=mulberry(v*13+3);jsh(c,x,y,u*1.9,u*1.4);[[0.0,0.0,1.0,1.0,'#7d7f70'],[-1.0,0.2,0.65,0.6,'#6e7062'],[0.9,0.25,0.6,0.55,'#8a8c7c']].forEach(([dx,dy,sx,sy,col])=>TH.blob(c,x+dx*u,y-u*0.55*sy+dy*u,u*0.9*sx,u*0.75*sy,col,r,9));
    for(let k=0;k<5;k++)TH.ell(c,x+(r()-0.5)*u*1.5,y-u*(0.2+r()*0.8),u*0.3,u*0.14,'rgba(88,140,64,.85)');}},
  fallenColumn:{cat:'rock',w:2.4,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+2);jsh(c,x,y,u*2.4,u*2);
    [[-2.0,-0.9,0.7],[0.0,0.1,0.65],[1.7,-0.4,0.6]].forEach(([X,Y,rr],i)=>{const a=I(X-0.7,Y,rr),b=I(X+0.7,Y,rr);TH.ln(c,a,b,J.stD,u*rr*2.1);TH.ln(c,a,b,J.st,u*rr*1.7);TH.ln(c,[a[0],a[1]-u*rr*0.4],[b[0],b[1]-u*rr*0.4],J.stL,u*rr*0.5);TH.ell(c,a[0],a[1],u*rr*0.55,u*rr*0.9,J.stD);TH.ell(c,a[0],a[1],u*rr*0.3,u*rr*0.5,'#6e6a56');for(let k=0;k<3;k++){const p=I(X-0.4+k*0.4,Y,rr);TH.ln(c,[p[0],p[1]-u*rr*0.9],[p[0],p[1]+u*rr*0.9],'rgba(50,48,34,.3)',u*0.05);}});
    TH.ell(c,x-u*0.9,y-u*0.5,u*0.8,u*0.2,'rgba(80,130,60,.8)');TH.ell(c,x+u*1.6,y-u*0.35,u*0.6,u*0.16,'rgba(70,120,55,.8)');}},
  stela:{cat:'ruin',w:1.3,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+5);jsh(c,x,y,u*1.3,u*4);jbox(c,x,y,u,-0.9,0.9,-0.5,0.5,0,0.4,-0.1);
    TH.poly(c,[I(0.7,-0.2,0.4),I(0.7,0.2,0.4),I(0.7,0.2,4.0),I(0.7,-0.2,4.0)],J.stD);TH.poly(c,[I(-0.7,-0.2,4.0),I(0.7,-0.2,4.0),I(0.7,0.2,4.0),I(-0.7,0.2,4.0)],J.stL);TH.poly(c,[I(-0.7,0.2,0.4),I(0.7,0.2,0.4),I(0.7,0.2,4.0),I(-0.7,0.2,4.0)],J.st);
    jmask(c,x,y,u,0,0.21,3.0,0.9);glyphs(c,x,y,u,-0.6,0.6,0.21,0.7,2.2,r);jmoss(c,x-u*0.3,y+u*0.2,u,r,3);}},
  glyphBlock:{cat:'ruin',w:1.3,tier:1,weight:3.5,cost:1,max:2,draw(c,x,y,u,v){const r=mulberry(v+3);jsh(c,x,y,u*1.4,u*2);jbox(c,x,y,u,-1.0,1.0,-0.8,0.8,0,1.6);jmask(c,x,y,u,0,0.81,0.85,0.9);jbox(c,x,y,u,-0.6,0.5,-0.5,0.4,1.6,2.1,-0.05);jmask(c,x,y,u,-0.05,0.41,1.85,0.4);jmoss(c,x,y+u*0.3,u,r,4);}},
  chacMool:{cat:'ruin',w:1.7,tier:3,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+8);jsh(c,x,y,u*1.8,u*2);jbox(c,x,y,u,-1.6,1.6,-0.9,0.9,0,0.6,-0.08);
    jbox(c,x,y,u,-1.0,1.1,-0.5,0.5,0.6,1.3);TH.poly(c,[I(-1.2,-0.4,0.6),I(-1.0,-0.4,0.6),I(-1.0,-0.4,1.1),I(-1.2,-0.4,1.1)],J.st);jbox(c,x,y,u,1.0,1.6,-0.3,0.6,0.9,1.5,0.05);TH.ell(c,...I(1.3,0.15,1.7),u*0.3,u*0.3,J.stL);
    TH.ell(c,...I(0.0,0.0,1.35),u*0.45,u*0.22,'#6e6a56');TH.ell(c,...I(0.0,0.0,1.38),u*0.34,u*0.16,'#2b2a22');[[-0.6,0.45],[-0.6,-0.45]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0.9),I(0.1,Y*0.4,1.25),J.st,u*0.22));jmoss(c,x,y+u*0.3,u,r,4);}},
  jaguarStatue:{cat:'ruin',w:1.5,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const r=mulberry(v+4);jsh(c,x,y,u*1.6,u*2);jbox(c,x,y,u,-1.3,1.3,-0.8,0.8,0,0.7,-0.06);const by=y-u*0.7;
    TH.poly(c,[[x-u*1.1,by],[x-u*1.0,by-u*0.9],[x-u*0.3,by-u*1.2],[x+u*0.5,by-u*1.0],[x+u*0.9,by-u*0.3],[x+u*1.0,by]],J.st);TH.poly(c,[[x+u*0.5,by-u*1.0],[x+u*0.9,by-u*0.3],[x+u*1.0,by],[x+u*0.2,by]],'rgba(40,40,28,.35)');
    TH.ln(c,[x-u*1.1,by-u*0.4],[x-u*1.5,by-u*0.9],J.st,u*0.22);TH.poly(c,[[x+u*0.2,by-u*1.1],[x+u*0.9,by-u*1.5],[x+u*1.4,by-u*1.3],[x+u*1.5,by-u*0.7],[x+u*0.9,by-u*0.4],[x+u*0.4,by-u*0.5]],J.stL);
    TH.poly(c,[[x+u*0.4,by-u*1.5],[x+u*0.5,by-u*1.9],[x+u*0.8,by-u*1.5]],J.stL);TH.ell(c,x+u*1.0,by-u*1.0,u*0.1,u*0.1,J.jade);for(let k=0;k<5;k++)TH.ell(c,x-u*0.7+k*u*0.3,by-u*(0.5+(k%2)*0.35),u*0.08,u*0.07,'rgba(40,40,28,.5)');jmoss(c,x,y+u*0.2,u,r,3);}},
  serpentHead:{cat:'ruin',w:1.9,tier:3,weight:2.5,cost:2,max:1,draw(c,x,y,u,v){const r=mulberry(v+6);jsh(c,x,y,u*2.0,u*3);
    c.strokeStyle=J.stD;c.lineWidth=u*1.2;c.lineCap='round';c.beginPath();c.moveTo(x+u*2.6,y);c.quadraticCurveTo(x+u*2.2,y-u*1.8,x+u*0.9,y-u*1.4);c.stroke();c.strokeStyle=J.st;c.lineWidth=u*0.9;c.stroke();
    for(let k=0;k<5;k++){const f=k/5;TH.ln(c,[x+u*(2.6-f*1.5),y-u*(f*1.6)-u*0.2],[x+u*(2.6-f*1.5)+u*0.25,y-u*(f*1.6)-u*0.1],'rgba(50,48,34,.4)',u*0.07);}
    jbox(c,x,y,u,-1.4,0.9,-0.9,0.9,0,2.2);TH.poly(c,[[x-u*1.3,y-u*1.5],[x-u*0.4,y-u*2.9],[x+u*0.4,y-u*2.9],[x+u*1.3,y-u*1.5]],J.stL);
    jmask(c,x,y,u,-0.25,0.91,1.2,0.9);TH.ell(c,x-u*0.5,y-u*1.8,u*0.2,u*0.2,J.jade);TH.ell(c,x+u*0.15,y-u*1.8,u*0.2,u*0.2,J.jade);
    TH.poly(c,[[x-u*1.1,y-u*0.3],[x+u*0.7,y-u*0.3],[x+u*0.5,y+u*0.5],[x-u*0.9,y+u*0.5]],'#2b2a22');[[-0.9,0.5],[-0.3,0.5],[0.3,0.5]].forEach(([dx,dy])=>TH.poly(c,[[x+dx*u-u*0.15,y+dy*u-u*0.8],[x+dx*u+u*0.15,y+dy*u-u*0.8],[x+dx*u,y+dy*u-u*0.05]],'#f0ecd8'));TH.poly(c,[[x-u*0.2,y+u*0.1],[x+u*0.2,y+u*0.1],[x,y+u*0.9]],'#b3342f');
    for(let k=0;k<5;k++){const a=-0.4-k*0.35;TH.poly(c,[[x-u*0.4+k*u*0.25,y-u*2.9],[x-u*0.7+k*u*0.4,y-u*3.8-(k%2)*u*0.4],[x-u*0.1+k*u*0.3,y-u*2.9]],[J.turq,J.jade,'#e0382b','#f2b22b','#2f8fd0'][k]);}jmoss(c,x,y+u*0.3,u,r,4);}},
  stoneAltar:{cat:'ruin',w:1.6,tier:3,weight:2.5,cost:1,max:1,draw(c,x,y,u,v,tm){const r=mulberry(v+9),t=tm||0;jsh(c,x,y,u*1.7,u*2);jbox(c,x,y,u,-1.4,1.4,-1.0,1.0,0,0.5,-0.08);jbox(c,x,y,u,-1.1,1.1,-0.7,0.7,0.5,1.5);jmask(c,x,y,u,0,0.71,0.95,0.6);
    TH.ell(c,x,y-u*1.65,u*0.8,u*0.34,'#5e5b48');TH.ell(c,x,y-u*1.7,u*0.65,u*0.27,'#2b2a22');jglow(c,x,y-u*2.3,u*2.4,'255,160,60',0.4+0.1*Math.sin(t*9+v));
    [[0,1.1,0.8],[-0.3,0.75,0.55],[0.3,0.8,0.6]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*11+i*2+v)*u*0.1;TH.poly(c,[[x+dx*u-u*0.3*w,y-u*1.7],[x+dx*u+f,y-u*(1.7+h*1.2)],[x+dx*u+u*0.3*w,y-u*1.7]],i?'#fbbf24':'#f97316');});jmoss(c,x,y+u*0.3,u,r,3);}},
  /* ---------- props ---------- */
  torchPost:{cat:'prop',w:0.9,tier:2,weight:3,cost:1,max:2,draw(c,x,y,u,v,tm){const t=tm||0;jsh(c,x,y,u,u*4);jbox(c,x,y,u,-0.5,0.5,-0.5,0.5,0,0.5,-0.06);TH.ln(c,[x,y-u*0.4],[x,y-u*2.6],'#6b5a3e',u*0.34);TH.ln(c,[x,y-u*1.2],[x,y-u*1.6],J.turq,u*0.4);
    TH.poly(c,[[x-u*0.5,y-u*2.5],[x+u*0.5,y-u*2.5],[x+u*0.35,y-u*3.0],[x-u*0.35,y-u*3.0]],'#4a3d2a');jglow(c,x,y-u*3.5,u*2.4,'255,160,60',0.4+0.1*Math.sin(t*10+v));
    [[0,1.1,0.8],[-0.25,0.75,0.55],[0.25,0.8,0.6]].forEach(([dx,h,w],i)=>{const f=Math.sin(t*12+i*2+v)*u*0.1;TH.poly(c,[[x+dx*u-u*0.3*w,y-u*3.0],[x+dx*u+f,y-u*(3.0+h*1.2)],[x+dx*u+u*0.3*w,y-u*3.0]],i?'#fbbf24':'#f97316');});}},
  clayPots:{cat:'prop',w:1.4,tier:1,weight:3,cost:1,max:2,draw(c,x,y,u,v){jsh(c,x,y,u*1.5,u*1.5);const pot=(px,py,s,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(px-u*0.45*s,py-u*1.1*s);c.bezierCurveTo(px-u*0.9*s,py-u*0.7*s,px-u*0.7*s,py,px-u*0.3*s,py);c.lineTo(px+u*0.3*s,py);c.bezierCurveTo(px+u*0.7*s,py,px+u*0.9*s,py-u*0.7*s,px+u*0.45*s,py-u*1.1*s);c.closePath();c.fill();
      c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.moveTo(px+u*0.1*s,py-u*1.1*s);c.bezierCurveTo(px+u*0.5*s,py-u*0.9*s,px+u*0.6*s,py-u*0.2*s,px+u*0.3*s,py);c.lineTo(px+u*0.1*s,py);c.fill();TH.ell(c,px,py-u*1.1*s,u*0.45*s,u*0.17*s,'#2a1c12');TH.ln(c,[px-u*0.7*s,py-u*0.55*s],[px+u*0.7*s,py-u*0.55*s],J.turq,u*0.1*s);TH.ln(c,[px-u*0.55*s,py-u*0.3*s],[px+u*0.55*s,py-u*0.3*s],'#f2d24a',u*0.07*s);};
    pot(x-u*0.9,y+u*0.1,0.9,'#c4683a');pot(x+u*0.5,y+u*0.2,1.15,'#b5532f');TH.ell(c,x-u*0.1,y+u*0.5,u*0.55,u*0.2,'#a5502f');TH.ell(c,x-u*0.1,y+u*0.38,u*0.4,u*0.13,'#e8b04a');[[-0.2,0.3],[0.05,0.28]].forEach(([dx,dy],i)=>TH.ell(c,x+dx*u,y+dy*u,u*0.18,u*0.18,['#f06a2a','#f2c230'][i]));}},
  macaw:{cat:'prop',w:0.9,tier:1,weight:3,cost:1,max:1,draw(c,x,y,u,v,tm){const t=tm||0,by=y-u*1.8;jsh(c,x,y,u*0.8,u*3);TH.ln(c,[x,y],[x,y-u*1.7],'#6b5a3e',u*0.2);TH.ln(c,[x-u*0.9,y-u*1.7],[x+u*0.9,y-u*1.7],'#6b5a3e',u*0.16);
    TH.poly(c,[[x-u*0.3,by-u*0.3],[x-u*0.9,by+u*1.1],[x-u*0.55,by+u*1.3],[x-u*0.2,by+u*0.2]],'#2f6fd0');TH.poly(c,[[x-u*0.4,by-u*0.3],[x-u*0.7,by+u*0.9],[x-u*0.5,by+u*1.0],[x-u*0.25,by+u*0.1]],'#e0382b');
    TH.ell(c,x,by-u*0.5,u*0.5,u*0.8,'#d9342b',-0.2);TH.ell(c,x+u*0.15,by-u*0.35,u*0.28,u*0.5,'#f2c230',-0.2);TH.poly(c,[[x-u*0.4,by-u*0.5],[x-u*0.1,by-u*0.9],[x+u*0.15,by-u*0.2]],'#2f6fd0');
    const hb=Math.sin(t*3+v)*u*0.04;TH.ell(c,x+u*0.2,by-u*1.35+hb,u*0.3,u*0.3,'#d9342b');TH.ell(c,x+u*0.3,by-u*1.35+hb,u*0.16,u*0.18,'#f8fafc');TH.ell(c,x+u*0.32,by-u*1.38+hb,u*0.05,u*0.05,'#161616');TH.poly(c,[[x+u*0.45,by-u*1.5+hb],[x+u*0.85,by-u*1.3+hb],[x+u*0.5,by-u*1.15+hb]],'#3a3a3a');TH.poly(c,[[x+u*0.45,by-u*1.5+hb],[x+u*0.8,by-u*1.38+hb],[x+u*0.5,by-u*1.32+hb]],'#f0e8d0');
    TH.ln(c,[x-u*0.1,by+u*0.1],[x-u*0.1,by+u*0.4],'#4a4a4a',u*0.06);TH.ln(c,[x+u*0.2,by+u*0.1],[x+u*0.2,by+u*0.4],'#4a4a4a',u*0.06);}},
  tikiTotem:{cat:'prop',w:1.0,tier:2,weight:2.5,cost:1,max:1,draw(c,x,y,u,v){const r=mulberry(v+2);jsh(c,x,y,u,u*5);TH.ln(c,[x,y],[x,y-u*5.2],'#5a4028',u*1.1);TH.ln(c,[x-u*0.15,y],[x-u*0.15,y-u*5.1],'#7a5836',u*0.35);
    ['#b5532f','#1fb5a8','#e0b53a','#b5532f'].forEach((col,i)=>{const cy=y-u*(0.9+i*1.2);TH.poly(c,[[x-u*0.55,cy-u*0.5],[x+u*0.55,cy-u*0.5],[x+u*0.55,cy+u*0.5],[x-u*0.55,cy+u*0.5]],col,'#2a1c12',u*0.05);[-0.2,0.2].forEach(e=>{TH.ell(c,x+e*u,cy-u*0.1,u*0.13,u*0.13,'#f8fafc');TH.ell(c,x+e*u,cy-u*0.1,u*0.06,u*0.06,'#161616');});TH.ln(c,[x-u*0.25,cy+u*0.22],[x+u*0.25,cy+u*0.22],'#2a1c12',u*0.1);TH.ln(c,[x,cy],[x,cy+u*0.12],'#2a1c12',u*0.07);});
    TH.poly(c,[[x-u*0.4,y-u*5.15],[x,y-u*5.9],[x+u*0.4,y-u*5.15]],'#e0382b');TH.poly(c,[[x-u*1.1,y-u*3.5],[x-u*0.55,y-u*3.9],[x-u*0.55,y-u*3.1]],'#1fb5a8');TH.poly(c,[[x+u*1.1,y-u*3.5],[x+u*0.55,y-u*3.9],[x+u*0.55,y-u*3.1]],'#1fb5a8');}},
  smallShrine:{cat:'structure',w:2.3,tier:3,weight:3,cost:2,max:1,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+3);jsh(c,x,y,u*2.6,u*4);jbox(c,x,y,u,-2.2,2.2,-2.0,2.0,0,0.7,-0.06);jbox(c,x,y,u,-1.8,1.8,-1.6,1.6,0.7,1.3,-0.03);
    jbox(c,x,y,u,-1.3,1.3,-1.1,1.1,1.3,3.5);TH.poly(c,[I(-0.5,1.11,1.3),I(0.5,1.11,1.3),I(0.5,1.11,2.8),I(-0.5,1.11,2.8)],J.dark);TH.ln(c,I(-0.55,1.12,2.85),I(0.55,1.12,2.85),J.stL,u*0.14);glyphs(c,x,y,u,-1.2,-0.6,1.11,1.5,3.2,r);glyphs(c,x,y,u,0.6,1.2,1.11,1.5,3.2,r);
    jbox(c,x,y,u,-1.5,1.5,-1.3,1.3,3.5,3.9,0.05);jbox(c,x,y,u,-0.8,0.8,-0.4,0.4,3.9,5.3);[[-0.4,4.3],[0.3,4.7],[-0.2,5.0]].forEach(([X,Z])=>TH.poly(c,[I(X,0.41,Z),I(X+0.25,0.41,Z),I(X+0.25,0.41,Z+0.3),I(X,0.41,Z+0.3)],J.dark));
    jmoss(c,x-u*1.3,y+u*0.9,u,r,4);jmoss(c,x+u*1.1,y+u*0.5,u,r,3);}},
  /* ---------- landmarks ---------- */
  stepPyramid:{cat:'landmark',w:4.6,tier:4,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+3),n=6,th=1.15,top=n*th,t=tm||0;jsh(c,x,y,u*5.2,u*9);
    for(let i=0;i<n;i++){const s=4.4-i*0.62;jbox(c,x,y,u,-s,s,-s,s,i*th,(i+1)*th,i%2?-0.02:0.03);TH.ln(c,I(-s,s,(i+1)*th),I(s,s,(i+1)*th),'rgba(255,255,240,.22)',u*0.07);
      for(let k=-3;k<=3;k++){if(Math.abs(k*s*0.3)<1.2)continue;const X=k*s*0.3;TH.poly(c,[I(X-0.15,s+0.01,i*th+0.3),I(X+0.15,s+0.01,i*th+0.3),I(X+0.15,s+0.01,i*th+0.75),I(X-0.15,s+0.01,i*th+0.75)],'rgba(30,34,24,.5)');}
      if(i<4)glyphs(c,x,y,u,-s+0.3,-1.2,s+0.01,i*th+0.15,(i+1)*th-0.1,r);}
    const Ya=4.6,Yb=1.4;TH.poly(c,[I(-0.85,Ya,0),I(0.85,Ya,0),I(0.85,Yb,top),I(-0.85,Yb,top)],'#d0ccb4');for(let k=1;k<30;k++){const f=k/30;TH.ln(c,I(-0.85,Ya+(Yb-Ya)*f,top*f),I(0.85,Ya+(Yb-Ya)*f,top*f),'rgba(70,66,48,.4)',u*0.04);}
    [-1,1].forEach(s=>TH.ln(c,I(s*1.0,Ya,0.25),I(s*1.0,Yb,top+0.25),J.stL,u*0.34));TH.poly(c,[I(-1.0,Ya,0),I(-0.85,Ya,0),I(-0.85,Yb,top),I(-1.0,Yb,top)],'rgba(30,30,20,.22)');
    const ts=1.5;jbox(c,x,y,u,-ts,ts,-ts,ts,top,top+1.8);TH.poly(c,[I(-0.5,ts+0.01,top),I(0.5,ts+0.01,top),I(0.5,ts+0.01,top+1.35),I(-0.5,ts+0.01,top+1.35)],J.dark);jmask(c,x,y,u,-1.0,ts+0.01,top+0.9,0.5);jmask(c,x,y,u,1.0,ts+0.01,top+0.9,0.5);
    jbox(c,x,y,u,-ts-0.15,ts+0.15,-ts-0.15,ts+0.15,top+1.8,top+2.1,0.06);jbox(c,x,y,u,-0.95,0.95,-0.5,0.5,top+2.1,top+3.4);[[-0.5,2.5],[0.2,2.9],[-0.2,3.1]].forEach(([X,Z])=>TH.poly(c,[I(X,0.51,top+Z-0.1),I(X+0.3,0.51,top+Z-0.1),I(X+0.3,0.51,top+Z+0.2),I(X,0.51,top+Z+0.2)],J.dark));
    for(let k=0;k<10;k++){const s=4.3-r()*3.2,i=Math.floor(r()*4);TH.blob(c,...I(-s+r()*1.5,s+0.05,i*th+0.5),u*(0.4+r()*0.5),u*0.22,k%2?'#4a7a3a':'#5f8a47',r,7);}
    const f=I(0,0,top+3.4);jglow(c,f[0],f[1]-u*0.5,u*2.4,'255,160,60',0.25+0.08*Math.sin(t*6));}},
  templeShrine:{cat:'landmark',w:3.0,tier:3,weight:3,cost:4,draw(c,x,y,u,v,tm){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+5),n=3,th=1.1,top=n*th;jsh(c,x,y,u*3.3,u*6);
    for(let i=0;i<n;i++){const s=3.0-i*0.6;jbox(c,x,y,u,-s,s,-s,s,i*th,(i+1)*th,i%2?-0.02:0.03);TH.ln(c,I(-s,s,(i+1)*th),I(s,s,(i+1)*th),'rgba(255,255,240,.22)',u*0.07);glyphs(c,x,y,u,-s+0.3,-0.8,s+0.01,i*th+0.15,(i+1)*th-0.1,r);}
    const Ya=3.2,Yb=1.3;TH.poly(c,[I(-0.7,Ya,0),I(0.7,Ya,0),I(0.7,Yb,top),I(-0.7,Yb,top)],'#d0ccb4');for(let k=1;k<18;k++){const f=k/18;TH.ln(c,I(-0.7,Ya+(Yb-Ya)*f,top*f),I(0.7,Ya+(Yb-Ya)*f,top*f),'rgba(70,66,48,.4)',u*0.04);}
    const ts=1.2;jbox(c,x,y,u,-ts,ts,-ts,ts,top,top+1.6);TH.poly(c,[I(-0.45,ts+0.01,top),I(0.45,ts+0.01,top),I(0.45,ts+0.01,top+1.2),I(-0.45,ts+0.01,top+1.2)],J.dark);jbox(c,x,y,u,-ts-0.12,ts+0.12,-ts-0.12,ts+0.12,top+1.6,top+1.9,0.06);jbox(c,x,y,u,-0.8,0.8,-0.4,0.4,top+1.9,top+3.0);
    [[-0.4,2.3],[0.2,2.6]].forEach(([X,Z])=>TH.poly(c,[I(X,0.41,top+Z-0.1),I(X+0.25,0.41,top+Z-0.1),I(X+0.25,0.41,top+Z+0.2),I(X,0.41,top+Z+0.2)],J.dark));
    for(let k=0;k<8;k++)TH.blob(c,...I(-2.6+r()*2.0,3.0+0.05,r()*2.2+0.4),u*(0.4+r()*0.5),u*0.22,k%2?'#4a7a3a':'#5f8a47',r,7);jmoss(c,x+u*1.8,y+u*0.8,u,r,4);}},
  ballCourt:{cat:'landmark',w:4.0,tier:3,weight:2.5,cost:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+7);jsh(c,x,y,u*4,u*5);TH.poly(c,[I(-3.4,-1.0,0),I(3.4,-1.0,0),I(3.4,1.0,0),I(-3.4,1.0,0)],'#c9b98a');for(let k=0;k<12;k++)TH.ln(c,I(-3.2+k*0.58,-0.9,0),I(-3.2+k*0.58,0.9,0),'rgba(100,80,40,.25)',u*0.05);TH.ln(c,I(-3.4,0,0),I(3.4,0,0),'rgba(100,80,40,.45)',u*0.07);
    jbox(c,x,y,u,-3.6,3.6,-3.2,-1.5,0,2.8);TH.poly(c,[I(-3.6,-1.5,2.8),I(3.6,-1.5,2.8),I(3.6,-0.9,0),I(-3.6,-0.9,0)],J.st);for(let k=1;k<7;k++){const f=k/7;TH.ln(c,I(-3.6,-1.5+0.6*f,2.8*(1-f)),I(3.6,-1.5+0.6*f,2.8*(1-f)),'rgba(60,56,40,.22)',u*0.05);}
    glyphs(c,x,y,u,-3.4,-1.2,-0.91,0.2,1.8,r);const rc=I(0,-1.5,3.9);c.strokeStyle='#8e8a72';c.lineWidth=u*0.55;c.beginPath();for(let a=0;a<=24;a++){const t=a/24*6.283,p=I(Math.cos(t)*0.9,-1.5,3.9+Math.sin(t)*0.9);a?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();c.strokeStyle=J.stL;c.lineWidth=u*0.2;c.stroke();jmask(c,x,y,u,1.9,-1.49,2.1,0.6);
    jbox(c,x,y,u,-3.6,3.6,1.5,3.2,0,1.9,-0.04);TH.poly(c,[I(-3.6,1.5,1.9),I(3.6,1.5,1.9),I(3.6,1.0,1.4),I(-3.6,1.0,1.4)],'#a9a58c');glyphs(c,x,y,u,-3.4,3.2,3.21,0.3,1.6,r);
    jbox(c,x,y,u,-3.9,-3.2,-0.6,0.6,0,1.4,0.04);jbox(c,x,y,u,3.2,3.9,-0.6,0.6,0,1.4,0.04);for(let k=0;k<9;k++)TH.blob(c,...I(-3.4+r()*6.8,r()<0.5?-2.4:2.5,2.8+r()*0.1),u*(0.3+r()*0.4),u*0.18,k%2?'#4a7a3a':'#5f8a47',r,7);}},
  corbelArch:{cat:'landmark',w:3.2,tier:3,weight:3,cost:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v+4);jsh(c,x,y,u*3.2,u*6);TH.poly(c,[I(-1.8,0.0,0),I(1.8,0.0,0),I(0,0.0,5.0)],'#0f1514');
    for(let i=0;i<6;i++){const z0=i*0.95,z1=z0+0.95;jbox(c,x,y,u,-3.1,-1.8+0.42*i,-0.9,0.9,z0,z1,i%2?-0.03:0.02);if(i<4)jbox(c,x,y,u,1.8-0.42*i,3.1,-0.9,0.9,z0,z1,i%2?0.02:-0.03);}
    jbox(c,x,y,u,1.2,3.1,-0.9,0.9,3.8,4.2,-0.04);for(let k=0;k<5;k++)jbox(c,x,y,u,0.6+r()*2.2,1.0+r()*2.2,0.5+r()*0.9,0.8+r()*1.1,0,0.4+r()*0.5,-0.1+r()*0.15);
    jbox(c,x,y,u,-1.3,1.3,-0.7,0.7,5.7,6.2,0.04);jbox(c,x,y,u,-0.5,0.5,-0.3,0.3,6.2,7.5);[[-0.2,6.5],[0.1,6.9]].forEach(([X,Z])=>TH.poly(c,[I(X-0.1,0.31,Z),I(X+0.15,0.31,Z),I(X+0.15,0.31,Z+0.25),I(X-0.1,0.31,Z+0.25)],J.dark));
    glyphs(c,x,y,u,-3.0,-2.0,0.91,0.3,4.0,r);jmask(c,x,y,u,-2.45,0.91,4.2,0.55);
    for(let k=0;k<8;k++){const sx=-3.0+r()*6;TH.ln(c,I(sx,0.95,3.0+r()*2),I(sx+(r()-0.5)*0.3,0.95,1.0+r()*1.5),r()<0.5?'#3f6a3a':'#4a7a3a',u*0.07);}jmoss(c,x-u*2.2,y+u*0.8,u,r,4);jmoss(c,x+u*2.0,y+u*0.6,u,r,3);}}
  }};
const JUNGLE_HEIGHT={fernCluster:'low',elephantEar:'low',heliconia:'low',mossBoulder:'low',fallenColumn:'low',glyphBlock:'low',chacMool:'low',jaguarStatue:'low',serpentHead:'low',stoneAltar:'low',torchPost:'low',clayPots:'low',macaw:'low',
  bamboo:'mid',palmTree:'mid',kapokTree:'mid',stela:'mid',tikiTotem:'mid',smallShrine:'mid',stepPyramid:'tall',templeShrine:'tall',ballCourt:'tall',corbelArch:'tall'};
Object.keys(JUNGLE_PACK.assets).forEach(id=>{JUNGLE_PACK.assets[id].h=JUNGLE_HEIGHT[id]||'low';});
const KEEP_OUT={rx:0.52,ry:0.34};   // central ellipse (x R) reserved for the ride or building sprite
function placeThemeAssets(pack,tier,R,seed){
  const rnd=mulberry(seed*7919+tier*131), u=R*0.068, T=pack.tiers[tier], out=[], decals=[], TAU=Math.PI*2;
  if(!T)return {assets:out,decals,u};
  const inside=(x,y,k)=>{const X=Math.abs(x)/R,Y=Math.abs(y)/(0.58*R);return X<=0.866*k&&Y<=k-X/1.732;};
  const ids=Object.keys(pack.assets), cnt={};
  const free=(x,y,w)=>out.every(o=>Math.hypot(o.x-x,(o.y-y)*1.7)>(o.w+w)*u*0.8);
  const clearOfCenter=(x,y,w,h)=>{const kx=h==='tall'?0.28:0.75,ky=h==='tall'?0.18:0.4,ex=R*KEEP_OUT.rx+w*u*kx,ey=R*KEEP_OUT.ry+w*u*ky;return x*x/(ex*ex)+y*y/(ey*ey)>1;};
  const zoneOK=(a,x,y)=>{const h=a.h||'low';if(h==='low')return true;const ax=Math.abs(x)/R;
    if(h==='tall')return y<R*0.12&&ax>(y>=-R*0.12?0.55:0.4);
    if(y>R*0.12)return h==='mid'&&ax>0.5;if(y>=-R*0.12)return h==='mid'||ax>0.55;return true;};
  const ringPoint=(tmax)=>{const th=rnd()*TAU,dx=Math.cos(th),dy=Math.sin(th);let lo=0,hi=R*1.2;
    for(let i=0;i<12;i++){const m=(lo+hi)/2;if(inside(dx*m,dy*m,0.9))lo=m;else hi=m;}const t=0.5+rnd()*((tmax||1)-0.5);return[dx*lo*t,dy*lo*t];};
  const spot=a=>{for(let i=0;i<120;i++){const p=ringPoint(a.h==='tall'?0.8:a.h==='mid'?0.92:1);if(clearOfCenter(p[0],p[1],a.w,a.h)&&zoneOK(a,p[0],p[1])&&free(p[0],p[1],a.w))return p;}return null;};
  const add=(id,x,y)=>{const a=pack.assets[id];out.push({id,x,y,v:Math.floor(rnd()*1000),w:a.w});cnt[id]=(cnt[id]||0)+1;};
  for(let i=0;i<T.decals;i++){const pool=ids.filter(id=>pack.assets[id].cat==='decal'&&pack.assets[id].tier<=tier),id=pool[Math.floor(rnd()*pool.length)];
    for(let t=0;t<40;t++){const p=ringPoint();if(clearOfCenter(p[0],p[1],pack.assets[id].w*0.5)){decals.push({id,x:p[0],y:p[1],v:Math.floor(rnd()*1000)});break;}}}
  let budget=T.budget;
  const land=()=>{let id=T.pool[Math.floor(rnd()*T.pool.length)];for(let q=0;q<8&&cnt[id];q++)id=T.pool[Math.floor(rnd()*T.pool.length)];
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}};
  if(T.pool.length&&rnd()<T.landmark){land();if(T.second&&rnd()<T.second)land();}
  let guard=0;while(budget>0&&guard++<500){const pool=ids.filter(id=>{const a=pack.assets[id];return a.cat!=='decal'&&a.cat!=='landmark'&&a.tier<=tier&&a.cost<=budget&&(cnt[id]||0)<(a.max||3);});
    if(!pool.length)break;let tot=0;pool.forEach(id=>tot+=pack.assets[id].weight);let pick=rnd()*tot,id=pool[0];for(const q of pool){pick-=pack.assets[q].weight;if(pick<=0){id=q;break;}}
    const a=pack.assets[id],p=spot(a);if(p){add(id,p[0],p[1]);budget-=a.cost;}else{cnt[id]=99;}}
  return {assets:out,decals,u};
}
function drawThemeGround(ctx,cx,cy,R,pack,border){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i+30);ctx[i?'lineTo':'moveTo'](cx+R*Math.cos(a),cy+R*Math.sin(a)*0.58);}ctx.closePath();
  ctx.fillStyle=pack.ground;ctx.fill();if(border!==false){ctx.lineWidth=Math.max(1.5,R*0.03);ctx.strokeStyle=border||pack.border;ctx.stroke();}}
function drawThemeDecals(ctx,cx,cy,pack,pl,tm){pl.decals.forEach(d=>pack.assets[d.id].draw(ctx,cx+d.x,cy+d.y,pl.u,d.v,tm||0));}
/* layer: 'back' (y<0, draw BEFORE the ride sprite), 'front' (y>=0, draw AFTER it) or omit for all, sorted by y */
function drawThemeAssets(ctx,cx,cy,pack,pl,tm,layer){pl.assets.filter(o=>layer==='back'?o.y<0:layer==='front'?o.y>=0:true).sort((a,b)=>a.y-b.y).forEach(o=>pack.assets[o.id].draw(ctx,cx+o.x,cy+o.y,pl.u,o.v,tm||0));}
function drawThemedTile(ctx,cx,cy,R,pack,tier,seed,tm,border,rideFn){drawThemeGround(ctx,cx,cy,R,pack,border);const pl=placeThemeAssets(pack,tier,R,seed);
  drawThemeDecals(ctx,cx,cy,pack,pl,tm);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'back');if(rideFn)rideFn(ctx,cx,cy,R);drawThemeAssets(ctx,cx,cy,pack,pl,tm,'front');}
return { pack: JUNGLE_PACK, placeThemeAssets, drawThemeGround, drawThemeDecals, drawThemeAssets };
})();

const THEME_PACKS = Object.freeze({
  classic: CLASSIC_THEME_PACK,
  frontier: FRONTIER_THEME_PACK,
  western: WESTERN_THEME_PACK,
  medieval: MEDIEVAL_THEME_PACK,
  gothic: GOTHIC_THEME_PACK,
  space: SPACE_THEME_PACK,
  jungle: JUNGLE_THEME_PACK,
  ...REGIONAL_THEME_PACKS
});
