/* Supplied small-park steam train artwork. */
const SMALL_CAMPUS_TRAIN_ART = (() => {
function shade(hex, amt){
  if(!hex || hex[0]!=='#') return hex || '#888888';
  const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;
  const f=c=>Math.max(0,Math.min(255,Math.round(amt<0?c*(1+amt):c+(255-c)*amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
const TH={
  ln(ctx,a,b,c,w){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();},
  ell(ctx,x,y,rx,ry,c,rot){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,Math.max(0.4,rx),Math.max(0.4,ry),rot||0,0,7);ctx.fill();},
  poly(ctx,pts,fill,stroke,lw){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||1;ctx.stroke();}},
  iso(x,y,u,X,Y,Z){return[x+(X-Y)*0.7*u,y+(X+Y)*0.35*u-Z*u];},
  box(ctx,x,y,u,x0,x1,y0,y1,z0,z1,cf,ce,ct){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);
    TH.poly(ctx,[I(x0,y1,z0),I(x1,y1,z0),I(x1,y1,z1),I(x0,y1,z1)],cf);TH.poly(ctx,[I(x1,y0,z0),I(x1,y1,z0),I(x1,y1,z1),I(x1,y0,z1)],ce);
    TH.poly(ctx,[I(x0,y0,z1),I(x1,y0,z1),I(x1,y1,z1),I(x0,y1,z1)],ct);},
  blob(ctx,x,y,rx,ry,col,rnd,n){const pts=[];n=n||8;for(let k=0;k<n;k++){const a=k/n*6.283,rr=0.78+rnd()*0.3;pts.push([x+Math.cos(a)*rx*rr,y+Math.sin(a)*ry*rr]);}
    TH.poly(ctx,pts,col);ctx.fillStyle='rgba(255,255,255,.14)';ctx.beginPath();ctx.ellipse(x-rx*0.25,y-ry*0.3,rx*0.45,ry*0.35,0,0,7);ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x+rx*0.35,y+ry*0.25,rx*0.4,ry*0.5,0,0,7);ctx.fill();}
};

/* ===== BAVARIAN ASSET LIBRARY ===== */
const TRAIN_SPLINE_CACHE = new WeakMap();

function getCampusTrainSpline(campus) {
  if (!campus || !campus.train || !campus.train.track) return null;
  if (TRAIN_SPLINE_CACHE.has(campus)) return TRAIN_SPLINE_CACHE.get(campus);

  const raw = campus.train.track;
  const N = raw.length;
  const pts = [];
  const cum = [0];

  for (let i = 0; i < N; i++) {
    const p = raw[i];
    pts.push([p[0], p[1]]);
    if (i > 0) {
      const dx = p[0] - raw[i - 1][0];
      const dy = (p[1] - raw[i - 1][1]) / 0.58;
      cum.push(cum[i - 1] + Math.hypot(dx, dy));
    }
  }
  const dxClose = pts[0][0] - pts[N - 1][0];
  const dyClose = (pts[0][1] - pts[N - 1][1]) / 0.58;
  const totalLen = cum[N - 1] + Math.hypot(dxClose, dyClose);
  cum.push(totalLen);

  let stationDist = 0;
  if (campus.station) {
    let bestD = 1e9;
    for (let i = 0; i < N; i++) {
      const d = Math.hypot(pts[i][0] - campus.station.x, pts[i][1] - campus.station.y);
      if (d < bestD) { bestD = d; stationDist = cum[i]; }
    }
  }

  const sampleAt = (dist) => {
    const d = ((dist % totalLen) + totalLen) % totalLen;
    let lo = 0, hi = N;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] <= d) lo = mid; else hi = mid;
    }
    const segLen = (cum[lo + 1] - cum[lo]) || 1;
    const f = (d - cum[lo]) / segLen;
    const A = pts[lo % N];
    const B = pts[(lo + 1) % N];
    const x = A[0] + (B[0] - A[0]) * f;
    const y = A[1] + (B[1] - A[1]) * f;

    const pPrev = pts[(lo - 2 + N) % N];
    const pNext = pts[(lo + 3) % N];
    const tx = pNext[0] - pPrev[0];
    const ty = pNext[1] - pPrev[1];
    const tLen = Math.hypot(tx, ty) || 1;
    return { x, y, tx: tx / tLen, ty: ty / tLen, ang: Math.atan2(ty, tx) };
  };

  const info = { pts, cum, totalLen, stationDist, sampleAt };
  TRAIN_SPLINE_CACHE.set(campus, info);
  return info;
}

function drawCampusTrain(ctx, ax, ay, campus, opts = {}) {
  const sp = getCampusTrainSpline(campus);
  if (!sp) return;

  const RS = campus.R * (campus.scale || 1);
  const livery = opts.livery || '#dc2626';
  const livLight = shade(livery, 0.25);
  const gold = '#f59e0b';
  const cream = '#fef3c7';
  const numCoaches = opts.cars != null ? opts.cars : 3;
  const speed = opts.speed != null ? opts.speed : 1.0;
  const rawT = (opts.t != null ? opts.t : (typeof performance !== 'undefined' ? performance.now() / 1000 : 0)) * speed;

  const baseSpeedPx = RS * 2.35;
  const lapTime = sp.totalLen / baseSpeedPx;
  let headDist;

  if (opts.stationStop !== false && campus.station) {
    const dwell = 3.2;
    const cycle = lapTime + dwell;
    const u = ((rawT % cycle) + cycle) % cycle;
    const laps = Math.floor(rawT / cycle);
    let progress = 0;
    if (u < lapTime) {
      const f = u / lapTime;
      progress = f - Math.sin(f * Math.PI * 2) / (Math.PI * 2) * 0.42;
    } else {
      progress = 1.0;
    }
    headDist = sp.stationDist + (laps + progress) * sp.totalLen;
  } else {
    headDist = rawT * baseSpeedPx;
  }

  const consist = [
    { kind: 'loco',   len: RS * 0.42, gap: 0 },
    { kind: 'tender', len: RS * 0.26, gap: RS * 0.36 }
  ];
  for (let i = 0; i < numCoaches; i++) {
    consist.push({ kind: 'coach', idx: i, len: RS * 0.34, gap: RS * 0.33 });
  }
  consist.push({ kind: 'caboose', len: RS * 0.28, gap: RS * 0.34 });

  let cursor = headDist;
  const cars = consist.map((spec, idx) => {
    if (idx > 0) cursor -= spec.gap;
    const pose = sp.sampleAt(cursor);
    return { ...spec, ...pose, dist: cursor };
  });

  const sortedCars = cars.slice().sort((a, b) => a.y - b.y);

  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Tunnel Overpass Occlusion Clipping Mask
  if (campus.train.tunnel) {
    const tun = campus.train.tunnel;
    const xWest = ax + tun.x - tun.portalHalfSpan * 0.94;
    const xEast = ax + tun.x + tun.portalHalfSpan * 0.94;
    const yTop  = ay + tun.y - RS * 0.42;
    const yBot  = ay + tun.y + RS * 0.26;

    ctx.beginPath();
    ctx.rect(xWest - 1000000, yTop - 1000000, 2000000, 2000000);
    ctx.moveTo(xWest, yTop);
    ctx.lineTo(xWest, yBot);
    ctx.lineTo(xEast, yBot);
    ctx.lineTo(xEast, yTop);
    ctx.closePath();
    ctx.clip('evenodd');
  }

  const drawCar = (car) => {
    const sx = ax + car.x;
    const sy = ay + car.y;
    const ang = car.ang;
    const foreshorten = 0.86 + 0.14 * Math.abs(car.tx);
    const L = car.len * foreshorten;
    const W = RS * 0.125;

    ctx.save();
    ctx.translate(sx, sy);

    // Track contact shadow, coupler & bogie wheels
    ctx.save();
    ctx.rotate(ang);
    ctx.fillStyle = 'rgba(10, 14, 22, 0.36)';
    ctx.beginPath();
    ctx.ellipse(0, RS * 0.015, L * 0.56, W * 0.58, 0, 0, Math.PI * 2);
    ctx.fill();

    if (car.kind !== 'loco') {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = RS * 0.022;
      ctx.beginPath();
      ctx.moveTo(L * 0.45, 0);
      ctx.lineTo(L * 0.68, 0);
      ctx.stroke();
    }

    [-0.30, 0.30].forEach(wx => {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(wx * L, W * 0.42, RS * 0.036, RS * 0.022, 0, 0, Math.PI * 2);
      ctx.ellipse(wx * L, -W * 0.42, RS * 0.036, RS * 0.022, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    const draw25DBox = (x0, x1, wHalf, z0, z1, colSide, colTop, strokeCol) => {
      const ca = Math.cos(ang), sa = Math.sin(ang);
      const pt = (lx, ly, lz) => [lx * ca - ly * sa, lx * sa + ly * ca - lz];
      const fBL = pt(x0,  wHalf, z0), fBR = pt(x1,  wHalf, z0);
      const fTR = pt(x1,  wHalf, z1), fTL = pt(x0,  wHalf, z1);
      const bBL = pt(x0, -wHalf, z0), bBR = pt(x1, -wHalf, z0);
      const bTR = pt(x1, -wHalf, z1), bTL = pt(x0, -wHalf, z1);

      const faceSouth = (fBL[1] + fBR[1]) >= (bBL[1] + bBR[1]);
      const wall = faceSouth ? [fBL, fBR, fTR, fTL] : [bBL, bBR, bTR, bTL];
      TH.poly(ctx, wall, colSide, strokeCol || '#0f172a', RS * 0.008);

      const frontSouth = (fBR[1] + bBR[1]) > (fBL[1] + bBL[1]);
      const endWall = frontSouth ? [fBR, bBR, bTR, fTR] : [fBL, bBL, bTL, fTL];
      TH.poly(ctx, endWall, shade(colSide, -0.22), strokeCol || '#0f172a', RS * 0.008);

      TH.poly(ctx, [fTL, fTR, bTR, bTL], colTop, strokeCol || '#0f172a', RS * 0.008);
      return { pt };
    };

    if (car.kind === 'loco') {
      const { pt } = draw25DBox(-L * 0.48, L * 0.46, W * 0.48, RS * 0.02, RS * 0.06, '#1e293b', '#334155');
      TH.poly(ctx, [pt(L*0.46, W*0.45, RS*0.02), pt(L*0.62, 0, RS*0.02), pt(L*0.46, -W*0.45, RS*0.02), pt(L*0.46, 0, RS*0.07)], livery, '#0f172a', RS*0.007);

      draw25DBox(-L * 0.08, L * 0.45, W * 0.40, RS * 0.06, RS * 0.145, '#1e293b', '#334155');
      [0.08, 0.26, 0.42].forEach(bx => {
        const p1 = pt(bx * L, W * 0.41, RS * 0.06), p2 = pt(bx * L, W * 0.41, RS * 0.145);
        TH.ln(ctx, p1, p2, gold, RS * 0.011);
      });

      const pStackBase = pt(L * 0.34, 0, RS * 0.145);
      const pStackTop  = pt(L * 0.34, 0, RS * 0.235);
      TH.ln(ctx, pStackBase, pStackTop, '#0f172a', RS * 0.036);
      TH.ell(ctx, pStackTop[0], pStackTop[1], RS * 0.026, RS * 0.016, '#1e293b');
      TH.ell(ctx, pStackTop[0], pStackTop[1] - RS * 0.004, RS * 0.018, RS * 0.010, gold);

      const pDome = pt(L * 0.12, 0, RS * 0.16);
      TH.ell(ctx, pDome[0], pDome[1], RS * 0.026, RS * 0.022, gold);

      const pLamp = pt(L * 0.48, 0, RS * 0.12);
      TH.ell(ctx, pLamp[0], pLamp[1], RS * 0.020, RS * 0.020, '#fef08a');

      draw25DBox(-L * 0.46, -L * 0.06, W * 0.50, RS * 0.06, RS * 0.185, livery, livLight);
      draw25DBox(-L * 0.50, -L * 0.02, W * 0.56, RS * 0.185, RS * 0.205, cream, '#ffffff');
      const pWin = pt(-L * 0.24, W * 0.51, RS * 0.135);
      TH.ell(ctx, pWin[0], pWin[1], RS * 0.024, RS * 0.020, '#bae6fd');

      for (let k = 0; k < 4; k++) {
        const ph = (rawT * 1.4 + k * 0.25) % 1;
        const puffX = pStackTop[0] - car.tx * ph * RS * 0.38 + Math.sin(rawT * 4 + k) * RS * 0.02;
        const puffY = pStackTop[1] - ph * RS * 0.22 - car.ty * ph * RS * 0.18;
        const rad = RS * (0.022 + ph * 0.048);
        ctx.fillStyle = `rgba(248, 250, 252, ${(1 - ph) * 0.65})`;
        ctx.beginPath();
        ctx.arc(puffX, puffY, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (car.kind === 'tender') {
      const { pt } = draw25DBox(-L * 0.46, L * 0.46, W * 0.48, RS * 0.025, RS * 0.135, livery, '#1e293b');
      TH.ln(ctx, pt(-L*0.42, W*0.49, RS*0.08), pt(L*0.42, W*0.49, RS*0.08), gold, RS*0.012);
      const pCoal = pt(0, 0, RS * 0.145);
      TH.ell(ctx, pCoal[0], pCoal[1], L * 0.36, W * 0.36, '#0f172a');
    } else if (car.kind === 'coach') {
      const { pt } = draw25DBox(-L * 0.48, L * 0.48, W * 0.50, RS * 0.025, RS * 0.095, livery, '#78350f');
      TH.ln(ctx, pt(-L*0.45, W*0.51, RS*0.06), pt(L*0.45, W*0.51, RS*0.06), gold, RS*0.010);

      const shirts = ['#38bdf8', '#facc15', '#22c55e', '#a855f7', '#fb7185'];
      [-0.28, 0, 0.28].forEach((rx, rIdx) => {
        const pSeat = pt(rx * L, 0, RS * 0.115);
        TH.ell(ctx, pSeat[0], pSeat[1], RS * 0.022, RS * 0.018, shirts[(rIdx + car.idx) % shirts.length]);
        TH.ell(ctx, pSeat[0], pSeat[1] - RS * 0.022, RS * 0.014, RS * 0.014, '#fde4c8');
      });

      [-0.40, 0, 0.40].forEach(px => {
        [-1, 1].forEach(sy => {
          TH.ln(ctx, pt(px*L, sy*W*0.46, RS*0.095), pt(px*L, sy*W*0.46, RS*0.175), gold, RS*0.008);
        });
      });

      draw25DBox(-L * 0.52, L * 0.52, W * 0.55, RS * 0.175, RS * 0.195, cream, '#ffffff');
    } else if (car.kind === 'caboose') {
      const { pt } = draw25DBox(-L * 0.46, L * 0.46, W * 0.48, RS * 0.025, RS * 0.145, livery, cream);
      draw25DBox(-L * 0.18, L * 0.22, W * 0.36, RS * 0.145, RS * 0.195, livLight, cream);
      const pTail = pt(-L * 0.48, 0, RS * 0.11);
      TH.ell(ctx, pTail[0], pTail[1], RS * 0.016, RS * 0.016, '#ef4444');
    }

    ctx.restore();
  };

  sortedCars.forEach(drawCar);
  ctx.restore();
}

return { draw: drawCampusTrain };
})();
