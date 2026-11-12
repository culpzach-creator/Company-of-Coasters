/* Supplied steam train artwork and railway animation. */
const CAMPUS_TRAIN_ART = (() => {
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
      // Measure true isotropic plan arc-length (undoing 0.58 Y foreshortening) so speed is constant around curves!
      const dx = p[0] - raw[i - 1][0];
      const dy = (p[1] - raw[i - 1][1]) / 0.58;
      cum.push(cum[i - 1] + Math.hypot(dx, dy));
    }
  }
  // Close loop distance from last point back to pts[0]
  const dxClose = pts[0][0] - pts[N - 1][0];
  const dyClose = (pts[0][1] - pts[N - 1][1]) / 0.58;
  const totalLen = cum[N - 1] + Math.hypot(dxClose, dyClose);
  cum.push(totalLen);

  // Locate arc-length distance `stationDist` closest to the Pink Train Station hex
  let stationDist = 0;
  if (campus.station) {
    let bestD = 1e9;
    for (let i = 0; i < N; i++) {
      const d = Math.hypot(pts[i][0] - campus.station.x, pts[i][1] - campus.station.y);
      if (d < bestD) { bestD = d; stationDist = cum[i]; }
    }
  }

  // Sample position and tangent at any arc-length `dist` along the closed loop
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

    // Look slightly ahead and behind for smooth tangent angle
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
  const livDark = shade(livery, -0.35);
  const livLight = shade(livery, 0.25);
  const gold = '#f59e0b';
  const cream = '#fef3c7';
  const numCoaches = opts.cars != null ? opts.cars : 3;
  const speed = opts.speed != null ? opts.speed : 1.0;
  const rawT = (opts.t != null ? opts.t : (typeof performance !== 'undefined' ? performance.now() / 1000 : 0)) * speed;

  // Compute continuous head distance along the track (with optional smooth station stop & dwell)
  const baseSpeedPx = RS * 2.35; // px per second
  const lapTime = sp.totalLen / baseSpeedPx;
  let headDist;

  if (opts.stationStop !== false && campus.station) {
    // Cycle = 1 full lap (lapTime) + 3.2s station dwell pause, with smooth ease-in/out braking!
    const dwell = 3.2;
    const cycle = lapTime + dwell;
    const u = ((rawT % cycle) + cycle) % cycle;
    const laps = Math.floor(rawT / cycle);
    let progress = 0;
    if (u < lapTime) {
      const f = u / lapTime;
      // Smooth cubic ease-in-out so train decelerates gently into the station and accelerates out
      progress = f - Math.sin(f * Math.PI * 2) / (Math.PI * 2) * 0.42;
    } else {
      progress = 1.0; // Parked at the station platform!
    }
    headDist = sp.stationDist + (laps + progress) * sp.totalLen;
  } else {
    headDist = rawT * baseSpeedPx;
  }

  // Assemble the train consist from front (Locomotive) to back (Caboose)
  const consist = [
    { kind: 'loco',    len: RS * 0.42, gap: 0 },
    { kind: 'tender',  len: RS * 0.26, gap: RS * 0.36 }
  ];
  for (let i = 0; i < numCoaches; i++) {
    consist.push({ kind: 'coach', idx: i, len: RS * 0.34, gap: RS * 0.33 });
  }
  consist.push({ kind: 'caboose', len: RS * 0.28, gap: RS * 0.34 });

  // Sample 2D positions & angles for every car along the track spline
  let cursor = headDist;
  const cars = consist.map((spec, idx) => {
    if (idx > 0) cursor -= spec.gap;
    const pose = sp.sampleAt(cursor);
    return { ...spec, ...pose, dist: cursor };
  });

  // Sort back-to-front by screen Y so overlapping cars on tight curves render in true painter's order
  const sortedCars = cars.slice().sort((a, b) => a.y - b.y);

  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // =========================================================================
  // TUNNEL OCCLUSION CLIPPING MASK:
  // `campus.train.tunnel` defines the stone overpass carrying the entrance walk
  // over the track at `(x, y)` with `portalHalfSpan`. The west portal mouth sits at
  // `tun.x - portalHalfSpan` and the east portal mouth sits at `tun.x + portalHalfSpan`.
  // By subtracting the interior tunnel bore rectangle from the active clip region,
  // every train car smoothly disappears inside the dark archway as it enters one portal
  // and emerges cleanly out of the opposite portal!
  // =========================================================================
  if (campus.train.tunnel) {
    const tun = campus.train.tunnel;
    const xWest = ax + tun.x - tun.portalHalfSpan * 0.94;
    const xEast = ax + tun.x + tun.portalHalfSpan * 0.94;
    const yTop  = ay + tun.y - RS * 0.42;
    const yBot  = ay + tun.y + RS * 0.26;

    ctx.beginPath();
    // Outer world bounds (clockwise)
    ctx.rect(xWest - 1000000, yTop - 1000000, 2000000, 2000000);
    // Subtract interior tunnel bore (counter-clockwise winding hole!)
    ctx.moveTo(xWest, yTop);
    ctx.lineTo(xWest, yBot);
    ctx.lineTo(xEast, yBot);
    ctx.lineTo(xEast, yTop);
    ctx.closePath();
    ctx.clip('evenodd');
  }

  // Helper to draw a single 2.5D Isometric Railroad Car aligned to its local track tangent
  const drawCar = (car) => {
    const sx = ax + car.x;
    const sy = ay + car.y;
    const ang = car.ang;
    // Slight foreshortening scale when moving steeply North-South vs East-West
    const foreshorten = 0.86 + 0.14 * Math.abs(car.tx);
    const L = car.len * foreshorten;
    const W = RS * 0.125;
    const H = RS * 0.135;

    ctx.save();
    ctx.translate(sx, sy);

    // 1. Contact Track Shadow (Stays on the rails at ground level)
    ctx.save();
    ctx.rotate(ang);
    ctx.fillStyle = 'rgba(10, 14, 22, 0.36)';
    ctx.beginPath();
    ctx.ellipse(0, RS * 0.015, L * 0.56, W * 0.58, 0, 0, Math.PI * 2);
    ctx.fill();

    // Coupler link bar extending forward to the car ahead
    if (car.kind !== 'loco') {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = RS * 0.022;
      ctx.beginPath();
      ctx.moveTo(L * 0.45, 0);
      ctx.lineTo(L * 0.68, 0);
      ctx.stroke();
    }

    // Iron wheel bogies & gold/red drive rods
    [-0.30, 0.30].forEach(wx => {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(wx * L, W * 0.42, RS * 0.036, RS * 0.022, 0, 0, Math.PI * 2);
      ctx.ellipse(wx * L, -W * 0.42, RS * 0.036, RS * 0.022, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // Helper for 2.5D extruded car body box (automatically tilted to `ang` with vertical Z lift!)
    const draw25DBox = (x0, x1, wHalf, z0, z1, colSide, colTop, strokeCol) => {
      const ca = Math.cos(ang), sa = Math.sin(ang);
      const pt = (lx, ly, lz) => [lx * ca - ly * sa, lx * sa + ly * ca - lz];
      const fBL = pt(x0,  wHalf, z0), fBR = pt(x1,  wHalf, z0);
      const fTR = pt(x1,  wHalf, z1), fTL = pt(x0,  wHalf, z1);
      const bBL = pt(x0, -wHalf, z0), bBR = pt(x1, -wHalf, z0);
      const bTR = pt(x1, -wHalf, z1), bTL = pt(x0, -wHalf, z1);

      // Draw whichever side wall faces south (+screen Y)
      const faceSouth = (fBL[1] + fBR[1]) >= (bBL[1] + bBR[1]);
      const wall = faceSouth ? [fBL, fBR, fTR, fTL] : [bBL, bBR, bTR, bTL];
      TH.poly(ctx, wall, colSide, strokeCol || '#0f172a', RS * 0.008);

      // Draw front/rear end wall if facing south
      const frontSouth = (fBR[1] + bBR[1]) > (fBL[1] + bBL[1]);
      const endWall = frontSouth ? [fBR, bBR, bTR, fTR] : [fBL, bBL, bTL, fTL];
      TH.poly(ctx, endWall, shade(colSide, -0.22), strokeCol || '#0f172a', RS * 0.008);

      // Draw roof/top plane
      TH.poly(ctx, [fTL, fTR, bTR, bTL], colTop, strokeCol || '#0f172a', RS * 0.008);
      return { pt };
    };

    // -----------------------------------------------------------------------
    // A. STEAM LOCOMOTIVE (4-4-0 American Classic Park Engine)
    // -----------------------------------------------------------------------
    if (car.kind === 'loco') {
      // Dark chassis frame & red cowcatcher pilot at the nose (+L*0.52)
      const { pt } = draw25DBox(-L * 0.48, L * 0.46, W * 0.48, RS * 0.02, RS * 0.06, '#1e293b', '#334155');
      // Cowcatcher pilot wedge
      TH.poly(ctx, [pt(L*0.46, W*0.45, RS*0.02), pt(L*0.62, 0, RS*0.02), pt(L*0.46, -W*0.45, RS*0.02), pt(L*0.46, 0, RS*0.07)], livery, '#0f172a', RS*0.007);

      // Cylindrical Boiler Barrel (-L*0.08 to +L*0.46) with Gold Boiler Bands & Brass Headlamp
      draw25DBox(-L * 0.08, L * 0.45, W * 0.40, RS * 0.06, RS * 0.145, '#1e293b', '#334155');
      // Gold boiler trim rings
      [0.08, 0.26, 0.42].forEach(bx => {
        const p1 = pt(bx * L, W * 0.41, RS * 0.06), p2 = pt(bx * L, W * 0.41, RS * 0.145);
        TH.ln(ctx, p1, p2, gold, RS * 0.011);
      });

      // Flared Diamond Smokestack & Brass Steam Dome atop the boiler
      const pStackBase = pt(L * 0.34, 0, RS * 0.145);
      const pStackTop  = pt(L * 0.34, 0, RS * 0.235);
      TH.ln(ctx, pStackBase, pStackTop, '#0f172a', RS * 0.036);
      TH.ell(ctx, pStackTop[0], pStackTop[1], RS * 0.026, RS * 0.016, '#1e293b');
      TH.ell(ctx, pStackTop[0], pStackTop[1] - RS * 0.004, RS * 0.018, RS * 0.010, gold);

      const pDome = pt(L * 0.12, 0, RS * 0.16);
      TH.ell(ctx, pDome[0], pDome[1], RS * 0.026, RS * 0.022, gold);

      // Glowing Golden Headlamp on the smokebox front
      const pLamp = pt(L * 0.48, 0, RS * 0.12);
      TH.ell(ctx, pLamp[0], pLamp[1], RS * 0.020, RS * 0.020, '#fef08a');

      // Engineer's Cab (-L*0.46 to -L*0.06) in Livery Color with Cream Roof
      draw25DBox(-L * 0.46, -L * 0.06, W * 0.50, RS * 0.06, RS * 0.185, livery, livLight);
      draw25DBox(-L * 0.50, -L * 0.02, W * 0.56, RS * 0.185, RS * 0.205, cream, '#ffffff');
      // Cab window & engineer silhouette
      const pWin = pt(-L * 0.24, W * 0.51, RS * 0.135);
      TH.ell(ctx, pWin[0], pWin[1], RS * 0.024, RS * 0.020, '#bae6fd');

      // Animated White Steam Puffs drifting backward from the smokestack!
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
    }

    // -----------------------------------------------------------------------
    // B. COAL & WATER TENDER
    // -----------------------------------------------------------------------
    else if (car.kind === 'tender') {
      const { pt } = draw25DBox(-L * 0.46, L * 0.46, W * 0.48, RS * 0.025, RS * 0.135, livery, '#1e293b');
      // Gold side stripe
      TH.ln(ctx, pt(-L*0.42, W*0.49, RS*0.08), pt(L*0.42, W*0.49, RS*0.08), gold, RS*0.012);
      // Heaped black coal mound on top
      const pCoal = pt(0, 0, RS * 0.145);
      TH.ell(ctx, pCoal[0], pCoal[1], L * 0.36, W * 0.36, '#0f172a');
    }

    // -----------------------------------------------------------------------
    // C. OPEN-AIR EXCURSION PASSENGER COACH (With Seated Riders & Striped Canopy)
    // -----------------------------------------------------------------------
    else if (car.kind === 'coach') {
      // Lower wooden/painted coach tub
      const { pt } = draw25DBox(-L * 0.48, L * 0.48, W * 0.50, RS * 0.025, RS * 0.095, livery, '#78350f');
      TH.ln(ctx, pt(-L*0.45, W*0.51, RS*0.06), pt(L*0.45, W*0.51, RS*0.06), gold, RS*0.010);

      // 3 Rows of Seated Park Guests inside the open-air coach
      const shirts = ['#38bdf8', '#facc15', '#22c55e', '#a855f7', '#fb7185'];
      [-0.28, 0, 0.28].forEach((rx, rIdx) => {
        const pSeat = pt(rx * L, 0, RS * 0.115);
        TH.ell(ctx, pSeat[0], pSeat[1], RS * 0.022, RS * 0.018, shirts[(rIdx + car.idx) % shirts.length]);
        TH.ell(ctx, pSeat[0], pSeat[1] - RS * 0.022, RS * 0.014, RS * 0.014, '#fde4c8');
      });

      // Brass canopy stanchion posts
      [-0.40, 0, 0.40].forEach(px => {
        [-1, 1].forEach(sy => {
          TH.ln(ctx, pt(px*L, sy*W*0.46, RS*0.095), pt(px*L, sy*W*0.46, RS*0.175), gold, RS*0.008);
        });
      });

      // Canopy Roof (cream with livery trim)
      draw25DBox(-L * 0.52, L * 0.52, W * 0.55, RS * 0.175, RS * 0.195, cream, '#ffffff');
    }

    // -----------------------------------------------------------------------
    // D. OBSERVATION CABOOSE (With Cupola Lookout & Rear Marker Lantern)
    // -----------------------------------------------------------------------
    else if (car.kind === 'caboose') {
      const { pt } = draw25DBox(-L * 0.46, L * 0.46, W * 0.48, RS * 0.025, RS * 0.145, livery, cream);
      // Cupola lookout cabin on roof
      draw25DBox(-L * 0.18, L * 0.22, W * 0.36, RS * 0.145, RS * 0.195, livLight, cream);
      // Glowing red rear marker lantern at tail (-L*0.48)
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
