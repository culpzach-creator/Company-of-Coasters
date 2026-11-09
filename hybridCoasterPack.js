const hybridCoasterPack = (() => {
function hybridShade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const channel = value => Math.round(amt < 0 ? value * (1 + amt) : value + (255 - value) * amt);
  return `rgb(${channel(r)},${channel(g)},${channel(b)})`;
}

const HYB_ANCHORS = [
  // [s, v, z, bank, isTrussLift]
  // Closed, non-self-overlapping circuit matching image_ef6f9a.png:
  // 0..2: Station (front-center-left, travels right-to-left: s = -0.05 -> -0.44 along v = +0.44, z = 0.09)
  [-0.05,  0.44, 0.09,  0.00, 0], // 0: Station Rear Entry
  [-0.24,  0.44, 0.09,  0.00, 0], // 1: Station Center (Gabled Metal Roof)
  [-0.44,  0.44, 0.09,  0.00, 0], // 2: Station Dispatch Exit
  // 3..5: Low Pre-Lift Bunny Hop & Turn on the front-left (tucked inside the outer helix)
  [-0.72,  0.36, 0.08,  0.30, 0], // 3: Pre-Lift Dip
  [-0.84,  0.14, 0.11,  0.45, 0], // 4: Pre-Lift Turn Apex
  [-0.74, -0.06, 0.12,  0.10, 1], // 5: Lift Hill Base Entry (Truss Lift begins!)
  // 6..9: ICONIC RMC OPEN-AIR TRUSS ARCH LIFT HILL climbing left-to-right across the center!
  //       (Supported ONLY by deep Warren steel arch truss + 2 A-frame towers — NO wood trestle wall!)
  [-0.50, -0.10, 0.36,  0.00, 1], // 6: Lift Lower (Tower #1 at seg 6.3)
  [-0.26, -0.14, 0.62,  0.00, 1], // 7: Lift Mid-Span (Open unsupported arch span!)
  [-0.06, -0.18, 0.85,  0.00, 1], // 8: Lift Summit Crest
  [ 0.08, -0.22, 0.78,  0.18, 1], // 9: Steep 82-deg Beyond-Vertical Drop Entry (Tower #2 at seg 9.0)
  // 10..11: Plunging First Drop diving toward the right end
  [ 0.24, -0.26, 0.34,  0.22, 0], // 10: First Drop Steep Plunge
  [ 0.48, -0.32, 0.11,  0.35, 0], // 11: First Drop Pull-Out Valley (threads through right structure!)
  // 12..15: Tall Right-End Overbanked Wall / Top-Hat Turnaround (Tall lattice structure on far right of photo!)
  [ 0.76, -0.46, 0.44,  0.95, 0], // 12: Right Turnaround Climb
  [ 0.96, -0.68, 0.72,  1.45, 0], // 13: Right Overbanked Wall Crest (High elevation!)
  [ 1.00, -0.28, 0.64,  1.35, 0], // 14: Sweeping High Far-Right Rim
  [ 0.86,  0.12, 0.32,  0.85, 0], // 15: Diving off the Right Wall
  // 16..19: Mid-Course Camelback & Zero-G Stall along the back-center ridge (with headchopper portal cutout!)
  [ 0.62,  0.06, 0.12,  0.00, 0], // 16: Right-Center Valley
  [ 0.40, -0.52, 0.42,  1.65, 0], // 17: Zero-G Stall Entry
  [ 0.16, -0.78, 0.56,  3.14, 0], // 18: Inverted Zero-G Stall Crest (Portal Cutout #1 underneath!)
  [-0.10, -0.74, 0.38,  4.70, 0], // 19: Zero-G Stall Exit Roll
  // 20..23: Back-Left Outward-Banked Wave Turn Wall (The tall curved lattice wall on the back-left of photo!)
  [-0.34, -0.58, 0.14,  6.28, 0], // 20: Back-Center Valley
  [-0.64, -0.76, 0.42,  5.65, 0], // 21: Climbing into Back-Left Wave Turn
  [-0.92, -0.82, 0.54,  5.35, 0], // 22: Outward-Banked Wave Turn Crest
  [-0.88, -0.44, 0.30,  6.00, 0], // 23: Diving off Back-Left Wall toward Front-Left
  // 24..27: Front-Left Double-Reversing Banked S-Helix / Cutback (Left foreground of reference photo!)
  [-0.98,  0.06, 0.28,  6.85, 0], // 24: Front-Left Outer Rim Entry
  [-0.96,  0.48, 0.24,  7.10, 0], // 25: Front-Left Outer Banked Bowl
  [-0.68,  0.58, 0.20,  6.70, 0], // 26: Front-Left Pull-Out
  [-0.48,  0.22, 0.32,  5.85, 0], // 27: Reversing Cutback Hill over Pre-Lift
  // 28..32: Twisting Infield Barrel Roll & Airtime Run to Front-Right Turnaround
  [-0.18,  0.08, 0.14,  6.28, 0], // 28: Center Infield Low Pass (threads under Lift Arch!)
  [ 0.12,  0.14, 0.34,  7.85, 0], // 29: Infield Barrel-Roll Entry
  [ 0.38,  0.22, 0.38,  9.42, 0], // 30: Infield Barrel-Roll Inverted Crest (1.5x 360 roll!)
  [ 0.62,  0.34, 0.22, 11.20, 0], // 31: Barrel-Roll Exit diving to Front-Right
  [ 0.72,  0.50, 0.14, 12.20, 0], // 32: Front-Right Final Turnaround Rim
  // 33..34: Straight Final Magnetic Brake Run along the front-center feeding collinearly into Station #0!
  [ 0.42,  0.54, 0.12, 12.57, 0], // 33: Brake Run Entry
  [ 0.16,  0.46, 0.10, 12.57, 0]  // 34: Final Brake Run -> flows straight into #0 [-0.05, 0.44, 0.09]
];

function hybLayout(R, mode){
  hybLayout._c = hybLayout._c || {};
  const key = mode + '|' + R;
  if(hybLayout._c[key]) return hybLayout._c[key];

  const side = mode === 'side';
  const N = 920;
  const A = side ? 1.42*R : 1.00*R;
  const B = side ? 0.46*R : 0.35*R;
  const zsc = 0.90 * Math.min(1.05, A/(1.42*R) + 0.08);
  const k = side ? 1.0 : 0.90;
  const ax = side ? [1, 0] : [0.706, 0.709];
  const lt = side ? [0, -1] : [0.706, -0.709];
  const hexes = side ? [[-0.866*R, 0], [0.866*R, 0]] : [[-0.433*R, -0.435*R], [0.433*R, 0.435*R]];

  const W = HYB_ANCHORS, m = W.length, dense = [];
  const totalBankTurn = 4 * Math.PI; // 2 net 360-degree inversions around loop = 4*PI
  const getPt = idx => {
    const wraps = Math.floor(idx / m);
    const baseIdx = ((idx % m) + m) % m;
    const pt = W[baseIdx];
    return [pt[0], pt[1], pt[2], pt[3] + wraps * totalBankTurn, pt[4]];
  };

  for(let i=0; i<m; i++){
    const p0 = getPt(i-1), p1 = getPt(i), p2 = getPt(i+1), p3 = getPt(i+2);
    for(let q=0; q<36; q++){
      const t = q/36, t2 = t*t, t3 = t2*t;
      const cr = (v0,v1,v2,v3) => 0.5*((2*v1) + (-v0+v2)*t + (2*v0-5*v1+4*v2-v3)*t2 + (-v0+3*v1-3*v2+v3)*t3);
      const uVal = cr(p0[0], p1[0], p2[0], p3[0]) * A;
      const vVal = -cr(p0[1], p1[1], p2[1], p3[1]) * B;
      const zVal = Math.max(0.05, cr(p0[2], p1[2], p2[2], p3[2])) * zsc * R;
      const bkVal = cr(p0[3], p1[3], p2[3], p3[3]);
      dense.push({
        gx: ax[0]*uVal + lt[0]*vVal,
        gy: ax[1]*uVal + lt[1]*vVal,
        z: zVal,
        bk: bkVal,
        seg: i + t
      });
    }
  }

  const cum = [0];
  for(let i=1; i<dense.length; i++){
    cum.push(cum[i-1] + Math.hypot(dense[i].gx - dense[i-1].gx, dense[i].gy - dense[i-1].gy, (dense[i].z - dense[i-1].z)*0.55));
  }
  const last = dense[dense.length-1];
  const Lt = cum[cum.length-1] + Math.hypot(dense[0].gx - last.gx, dense[0].gy - last.gy, (dense[0].z - last.z)*0.55);
  dense.push({
    gx: dense[0].gx,
    gy: dense[0].gy,
    z: dense[0].z,
    bk: dense[0].bk + totalBankTurn,
    seg: m
  });
  cum.push(Lt);

  const g = [], z = [], bank = [], segIdx = [];
  let j = 0;
  for(let i=0; i<N; i++){
    const d = i/N * Lt;
    while(j < cum.length-2 && cum[j+1] < d) j++;
    const t = (d - cum[j]) / ((cum[j+1] - cum[j]) || 1);
    const A0 = dense[j], A1 = dense[j+1];
    g.push([A0.gx + (A1.gx - A0.gx)*t, A0.gy + (A1.gy - A0.gy)*t]);
    z.push(A0.z + (A1.z - A0.z)*t);
    bank.push(A0.bk + (A1.bk - A0.bk)*t);
    segIdx.push(A0.seg + (A1.seg - A0.seg)*t);
  }

  const n = [];
  for(let i=0; i<N; i++){
    const p = g[(i+N-1)%N], q = g[(i+1)%N];
    const dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy) || 1;
    n.push([-dy/len, dx/len]);
  }

  return hybLayout._c[key] = {N, g, z, bank, n, segIdx, hexes, Lt, k, ds: Lt/N, lt, ax};
}

function hybDraw(ctx, cx, cy, R, op, mode){
  const accent  = op.accent || '#dc2626';
  const woodBase = op.wood || '#9a7b56';
  const fl = op.flip ? -1 : 1;
  const L = hybLayout(R, mode), N = L.N, k = L.k, Rk = R*k;
  const hw = R*0.0155*k;     // Half-width of RMC I-Box track
  const ibH = R*0.0115*k;    // Depth of the steel I-Box beam rails

  ctx.save();
  ctx.translate(cx, cy);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const line = (a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const poly = (pts,fill,stroke,lw)=>{
    ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=fill;ctx.lineWidth=0.55;ctx.stroke();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||R*0.006;ctx.stroke();}
  };
  const P = i => { i=(i+N)%N; return [L.g[i][0], L.g[i][1] - L.z[i]]; };
  const G = i => L.g[(i+N)%N];

  // Precompute 3D banked I-Box rail geometry
  const ED = [];
  for(let i=0; i<N; i++){
    const p = P(i), n = L.n[i], b = L.bank[i], cb = Math.cos(b), sb = Math.sin(b);
    const lx = n[0]*cb, ly = n[1]*cb - sb;
    const dx = n[0]*sb, dy = n[1]*sb + cb;
    const R1 = [p[0] + lx*hw, p[1] + ly*hw];
    const R2 = [p[0] - lx*hw, p[1] - ly*hw];
    const B1 = [R1[0] + dx*ibH, R1[1] + dy*ibH];
    const B2 = [R2[0] + dx*ibH, R2[1] + dy*ibH];
    ED.push({p, R1, R2, B1, B2, lx, ly, dx, dy});
  }

  // 1. Soft Continuous Ground Shadow
  ctx.save();
  ctx.translate(fl*R*0.038, R*0.028);
  ctx.beginPath();
  L.g.forEach((p,i)=>{const z=L.z[i],x=p[0]+fl*z*0.26,y=p[1]+z*0.13;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});
  ctx.closePath();
  ctx.strokeStyle = 'rgba(15, 20, 28, 0.18)';
  ctx.lineWidth = R * 0.048 * k;
  ctx.stroke();
  ctx.restore();

  const items = [];
  const woodLight = hybridShade(woodBase, 0.22);
  const woodMid   = woodBase;
  const woodDark  = hybridShade(woodBase, -0.35);
  const steelTruss = '#cbd5e1';
  const steelDark  = '#475569';
  const railDark   = hybridShade(accent, -0.38);
  const railLight  = hybridShade(accent, 0.28);

  // Helper: Is segment `sVal` part of the Open-Air RMC Truss Lift Hill (no dense wood trestle underneath)?
  const isTrussLiftSeg = sVal => (sVal >= 5.15 && sVal <= 9.65);

  // Helper: Headchopper Portal Cutouts in the wood structure (matching the rectangular portal windows in image_ef6f9a.png!)
  const isPortalCutout = (sVal, zVal) => {
    // Cutout #1: Under the Zero-G Stall peak (seg 17.6..18.5)
    if(sVal >= 17.6 && sVal <= 18.5 && zVal < R*0.28) return true;
    // Cutout #2: Under the Right Overbank Climb (seg 12.1..12.8)
    if(sVal >= 12.1 && sVal <= 12.8 && zVal < R*0.22) return true;
    // Cutout #3: Under the Reversing Cutback Hill (seg 26.8..27.5)
    if(sVal >= 26.8 && sVal <= 27.5 && zVal < R*0.19) return true;
    return false;
  };

  // =========================================================================
  // 2. DENSE WOODEN LATTICE TRESTLE STRUCTURE (Everywhere EXCEPT the Open Lift Arch!)
  // =========================================================================
  const lev = R * 0.046;
  const step = Math.max(3, Math.round(R * 0.038 / L.ds));
  const maxZ = Math.max(...L.z), Mlev = Math.floor(maxZ / lev);
  const CH = 18;

  // 2A. Horizontal Wood Trestle Ledgers (chunked for accurate depth-sorting)
  for(let c0=0; c0<N; c0+=CH){
    const c1 = Math.min(N, c0 + CH + 1);
    let sy = 0, sz = 0, cnt = 0;
    for(let i=c0; i<c1; i++){ sy += L.g[i%N][1]; sz += L.z[i%N]; cnt++; }
    const kk = sy/cnt + (sz/cnt)*0.045 - 0.014;

    items.push({k: kk, f: () => {
      for(let m=1; m<=Mlev; m++){
        const hz = m * lev;
        let pen = false;
        ctx.beginPath();
        for(let i=c0; i<c1; i++){
          const idx = i % N, sVal = L.segIdx[idx], zi = L.z[idx];
          if(isTrussLiftSeg(sVal) || isPortalCutout(sVal, hz)){ pen = false; continue; }
          const q = G(idx);
          if(zi >= hz + R*0.01){
            pen ? ctx.lineTo(q[0], q[1]-hz) : ctx.moveTo(q[0], q[1]-hz);
            pen = true;
          } else {
            pen = false;
          }
        }
        ctx.strokeStyle = woodDark;
        ctx.lineWidth = R * 0.0052 * k;
        ctx.stroke();
        ctx.strokeStyle = woodLight;
        ctx.lineWidth = R * 0.0036 * k;
        ctx.stroke();
      }
    }});
  }

  // 2B. Vertical Wood Bents, Diagonal X-Bracing & Headchopper Portal Frames
  for(let i=0; i<N; i+=step){
    const j = (i + step) % N;
    const sVal = L.segIdx[i], zi = L.z[i], zj = L.z[j];
    if(isTrussLiftSeg(sVal) || Math.max(zi, zj) < R*0.048) continue;

    const gi = G(i), gj = G(j);
    const kk = (gi[1] + gj[1])*0.5 + (zi + zj)*0.5*0.045 - 0.012;

    items.push({k: kk, f: () => {
      const portalHere = isPortalCutout(sVal, R*0.10);
      const zBot = portalHere ? Math.min(zi*0.52, R*0.24) : 0;

      // Vertical timber post (with dark shadow edge + sunlit edge)
      line([gi[0]+R*0.002, gi[1]-zBot], [gi[0]+R*0.002, gi[1]-zi], woodDark, R*0.0062*k);
      line([gi[0], gi[1]-zBot], [gi[0], gi[1]-zi], woodLight, R*0.0044*k);

      // Bold portal header beam if this bay is over a headchopper cutout!
      if(portalHere && !isPortalCutout(L.segIdx[j], R*0.10)){
        line([gi[0], gi[1]], [gi[0], gi[1]-zBot], woodDark, R*0.009*k);
      }
      if(portalHere){
        line([gi[0], gi[1]-zBot], [gj[0], gj[1]-zBot], woodLight, R*0.0075*k);
      }

      // Diagonal timber X-bracing between adjacent bents
      const lo = Math.min(zi, zj), nm = Math.floor(lo / lev);
      const mStart = Math.ceil(zBot / lev);
      for(let m=mStart; m<nm; m++){
        const za = m * lev, zb = (m + 1) * lev;
        line([gi[0], gi[1]-za], [gj[0], gj[1]-zb], woodMid, R*0.0034*k);
        line([gj[0], gj[1]-za], [gi[0], gi[1]-zb], woodMid, R*0.0034*k);
      }
    }});
  }

  // =========================================================================
  // 3. ICONIC RMC OPEN-AIR WARREN-TRUSS ARCH LIFT HILL & TWO A-FRAME TOWERS
  //    (Matches the signature open arch lift hill in the center of image_ef6f9a.png!)
  // =========================================================================
  // 3A. Deep Warren Truss Arch Spine running underneath the Lift Hill (seg 5.15 .. 9.65)
  for(let i=0; i<N; i+=2){
    const sVal = L.segIdx[i];
    if(!isTrussLiftSeg(sVal)) continue;
    const j = (i + 2) % N;
    const pi = P(i), pj = P(j);
    // Arch lower chord depth (thickest in the middle of the arch span!)
    const archPhase = Math.sin(Math.max(0, Math.min(1, (sVal - 5.15)/4.5)) * Math.PI);
    const trussD = R * (0.028 + 0.024 * archPhase) * k;
    const bi = [pi[0], pi[1] + trussD], bj = [pj[0], pj[1] + trussD];
    const key = L.g[i][1] + L.z[i]*0.05 - 0.004;

    items.push({k: key, f: () => {
      // Lower arch chord beam & Warren diagonal web struts
      line(bi, bj, steelDark, R*0.009*k);
      line(bi, bj, steelTruss, R*0.005*k);
      line(pi, bi, steelDark, R*0.0055*k);
      line(pi, bj, steelTruss, R*0.0045*k);
      line(bi, pj, steelDark, R*0.0045*k);
    }});
  }

  // 3B. The TWO Signature RMC Lift Hill A-Frame Support Towers (at seg 6.35 and seg 8.95)
  [
    [6.35, 0.075], // Lower Lift A-Frame Tower
    [8.95, 0.115]  // Main Summit Crest A-Frame Tower (tall twin-leg steel portal!)
  ].forEach(([targetSeg, spreadF]) => {
    let bestI = 0, bestD = 1e9;
    for(let i=0; i<N; i++){
      const d = Math.abs(L.segIdx[i] - targetSeg);
      if(d < bestD){ bestD = d; bestI = i; }
    }
    const gC = L.g[bestI], zC = L.z[bestI], nC = L.n[bestI];
    const topP = [gC[0], gC[1] - zC + R*0.015*k];
    const legA = [gC[0] - nC[0]*R*spreadF*k - R*0.02*k, gC[1] - nC[1]*R*spreadF*k + R*0.02*k];
    const legB = [gC[0] + nC[0]*R*spreadF*k + R*0.02*k, gC[1] + nC[1]*R*spreadF*k - R*0.02*k];
    const key = Math.max(legA[1], legB[1]) + zC*0.05 - 0.008;

    items.push({k: key, f: () => {
      // Concrete foot piers
      [legA, legB].forEach(ft => {
        ctx.fillStyle = 'rgba(15,23,42,0.32)';
        ctx.beginPath(); ctx.ellipse(ft[0], ft[1]+R*0.004, R*0.032*k, R*0.014*k, 0, 0, 7); ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath(); ctx.ellipse(ft[0], ft[1], R*0.022*k, R*0.010*k, 0, 0, 7); ctx.fill();
      });
      // Twin A-frame steel legs + horizontal cross-struts
      line(legA, topP, '#1e293b', R*0.022*k);
      line(legB, topP, '#1e293b', R*0.022*k);
      line(legA, topP, '#94a3b8', R*0.012*k);
      line(legB, topP, '#cbd5e1', R*0.012*k);
      [0.35, 0.68].forEach(f => {
        const p1 = [legA[0]+(topP[0]-legA[0])*f, legA[1]+(topP[1]-legA[1])*f];
        const p2 = [legB[0]+(topP[0]-legB[0])*f, legB[1]+(topP[1]-legB[1])*f];
        line(p1, p2, '#475569', R*0.010*k);
      });
    }});
  });

  // =========================================================================
  // 4. RMC I-BOX STEEL TRACK (Thick Colored Steel I-Beams + Cross-Ties + Running Strips)
  // =========================================================================
  for(let i=0; i<N; i++){
    const j = (i + 1) % N, ei = ED[i], ej = ED[j];
    const sVal = L.segIdx[i];
    const isLift = isTrussLiftSeg(sVal);
    const isBrake = sVal >= 33.0 || sVal <= 0.2;
    const key = L.g[i][1] + L.z[i]*0.05;

    items.push({k: key, f: () => {
      // A. Steel Cross-Tie Web Plate between the two I-Box rails
      if(i % 2 === 0){
        line(ei.B1, ei.B2, '#e2e8f0', R*0.0055*k);
        line(ei.R1, ei.R2, railDark,  R*0.0045*k);
      }

      // B. Deep Colored Steel I-Box Side Webs (gives the signature thick RMC ribbon look!)
      poly([ei.R1, ej.R1, ej.B1, ei.B1], railDark);
      poly([ei.R2, ej.R2, ej.B2, ei.B2], railDark);

      // C. Top Colored I-Box Flanges & Bright Steel Running Strips
      line(ei.R1, ej.R1, accent, R*0.0085*k);
      line(ei.R2, ej.R2, accent, R*0.0085*k);
      line(ei.R1, ej.R1, railLight, R*0.0032*k);
      line(ei.R2, ej.R2, railLight, R*0.0032*k);

      // D. Lift Hill Chain Trough & Catwalk Handrail
      if(isLift){
        line(ei.p, ej.p, '#1e293b', R*0.0065*k);
        if(i % 3 === 0){
          const cw1 = [ei.R2[0] - ei.lx*hw*0.45, ei.R2[1] - ei.ly*hw*0.45 - R*0.015*k];
          const cw2 = [ej.R2[0] - ej.lx*hw*0.45, ej.R2[1] - ej.ly*hw*0.45 - R*0.015*k];
          line(ei.R2, cw1, '#94a3b8', R*0.0038*k);
          line(cw1, cw2, '#cbd5e1', R*0.0042*k);
        }
      }

      // E. Brass Eddy-Current Magnetic Brake Fins on Final Brake Run
      if(isBrake && i % 2 === 0){
        line(ei.p, ej.p, '#facc15', R*0.0065*k);
      }
    }});
  }

  // =========================================================================
  // 5. GABLED RMC BOARDING STATION (Split into Platform below track + Gabled Roof above!)
  // =========================================================================
  let stI0 = 0, stI1 = Math.round(0.055 * N);
  for(let i=0; i<N; i++){
    if(Math.abs(L.segIdx[i] - 0.15) < 0.08) stI0 = i;
    if(Math.abs(L.segIdx[i] - 2.05) < 0.08) stI1 = i;
  }
  const b = L.lt, g0 = L.g[stI0], g1 = L.g[stI1];
  const stMaxY = Math.max(g0[1], g1[1]), stMinY = Math.min(g0[1], g1[1]);
  const pf = (gx, off, up) => [gx[0] + b[0]*off, gx[1] + b[1]*off - up];
  const wBack = Rk * 0.068, wFront = -Rk * 0.072;
  const zDeck = Rk * 0.022, zEave = Rk * 0.125, zPeak = Rk * 0.165;

  // Station Pass 1 (Below Track): Timber/Concrete Deck & Back Posts
  items.push({k: stMinY - Rk*0.08, f: () => {
    const dB0 = pf(g0, wBack, zDeck), dB1 = pf(g1, wBack, zDeck);
    const dF1 = pf(g1, wFront, zDeck), dF0 = pf(g0, wFront, zDeck);
    poly([dF0, dF1, [dF1[0], dF1[1]+zDeck], [dF0[0], dF0[1]+zDeck]], woodDark);
    poly([dB0, dB1, dF1, dF0], '#cbd5e1', '#475569', Rk*0.006);
    [0.1, 0.5, 0.9].forEach(t => {
      const gx = [g0[0]+(g1[0]-g0[0])*t, g0[1]+(g1[1]-g0[1])*t];
      line(pf(gx, wBack*0.9, zDeck), pf(gx, wBack*0.9, zEave), woodDark, Rk*0.011);
    });
  }});

  // Station Pass 2 (Above Track): Front Posts & Corrugated Silver/Accent Gable Roof (like the model!)
  items.push({k: stMaxY + Rk*0.24, f: () => {
    [0.1, 0.5, 0.9].forEach(t => {
      const gx = [g0[0]+(g1[0]-g0[0])*t, g0[1]+(g1[1]-g0[1])*t];
      line(pf(gx, wFront*0.9, zDeck), pf(gx, wFront*0.9, zEave), woodLight, Rk*0.011);
    });
    const rB0 = pf(g0, wBack*1.05, zEave),  rB1 = pf(g1, wBack*1.05, zEave);
    const rF0 = pf(g0, wFront*1.05, zEave), rF1 = pf(g1, wFront*1.05, zEave);
    const rM0 = pf(g0, 0, zPeak),           rM1 = pf(g1, 0, zPeak);

    poly([rB0, rB1, rM1, rM0], '#94a3b8', '#475569', Rk*0.006);
    poly([rB0, rF0, rM0], woodDark);
    poly([rB1, rF1, rM1], woodMid);
    poly([rM0, rM1, rF1, rF0], '#e2e8f0', '#475569', Rk*0.007);
    // Standing-seam metal roof ribs
    [0.2, 0.4, 0.6, 0.8].forEach(t => {
      const mPt = [rM0[0]+(rM1[0]-rM0[0])*t, rM0[1]+(rM1[1]-rM0[1])*t];
      const fPt = [rF0[0]+(rF1[0]-rF0[0])*t, rF0[1]+(rF1[1]-rF0[1])*t];
      line(mPt, fPt, '#94a3b8', Rk*0.005);
    });
    line(rF0, rF1, accent, Rk*0.011);
    line(rM0, rM1, accent, Rk*0.009);
  }});

  // =========================================================================
  // 6. TWO 6-CAR RMC SWING-AXLE TRAINS (One climbing Lift Arch, one in Right Turnaround)
  // =========================================================================
  const drawHybridCar = (i, isLead) => {
    const idx = (i + N) % N;
    const p = P(idx), pn = P(idx+2), pp = P(idx-2);
    let tx = pn[0] - pp[0], ty = pn[1] - pp[1];
    const m = Math.hypot(tx, ty) || 1; tx /= m; ty /= m;
    const ei = ED[idx];
    const c = [p[0] - ei.dx*Rk*0.012, p[1] - ei.dy*Rk*0.012];
    const lx = Rk * 0.032, wy = Rk * 0.020;
    const q = (a, bb, dz) => [c[0] + tx*a + ei.lx*bb, c[1] + ty*a + ei.ly*bb + dz];

    items.push({k: L.g[idx][1] + L.z[idx]*0.05 + 0.015, f: () => {
      poly([q(-lx,wy,0), q(lx,wy,0), q(lx,wy,Rk*0.013), q(-lx,wy,Rk*0.013)], hybridShade(accent,-0.35));
      poly([q(-lx,-wy,0), q(lx,-wy,0), q(lx,wy,0), q(-lx,wy,0)], '#1e293b');
      if(isLead){
        // Sculpted RMC V-Nose Zero CarHood
        poly([q(lx*0.2,-wy,0), q(lx*1.45,0,Rk*0.003), q(lx*0.2,wy,0)], accent, '#f8fafc', Rk*0.005);
      } else {
        poly([q(lx*0.35,-wy,0), q(lx,-wy,0), q(lx,wy,0), q(lx*0.35,wy,0)], hybridShade(accent,0.18));
      }
      [-0.45, 0.45].forEach(d => {
        const h = q(-lx*0.12, d*wy, -Rk*0.020);
        ctx.fillStyle = ['#38bdf8','#facc15','#22c55e','#f97316'][(idx + (d>0?1:0)) % 4];
        ctx.fillRect(h[0]-Rk*0.009, h[1]+Rk*0.008, Rk*0.018, Rk*0.012);
        ctx.fillStyle = '#fde4c8';
        ctx.beginPath(); ctx.arc(h[0], h[1], Rk*0.011, 0, 7); ctx.fill();
      });
    }});
  };

  const sp = Math.round(Rk * 0.056 / L.ds);
  [0.195, 0.56].forEach(fh => {
    const ih = Math.round(fh * N);
    for(let cIdx=0; cIdx<6; cIdx++) drawHybridCar(ih - cIdx*sp, cIdx===0);
  });

  items.sort((a,b) => a.k - b.k).forEach(it => it.f());
  ctx.restore();
}

/**
 * 4x HiDPI Supersampled Offscreen Baker for the 2-Hex RMC Hybrid Coaster:
 */
function hybridSprite(R, mode, dir, accent, wood, scale){
  hybridSprite._c = hybridSprite._c || {};
  const sc = scale || getBakeScale();
  const wd = wood || '#9a7b56';
  const key = [mode, dir, Math.round(R * sc), R, accent, wd, sc].join('|');
  if(hybridSprite._c[key]) return hybridSprite._c[key];

  const side = mode === 'side';
  const W = Math.ceil((side ? 3.55 : 2.65) * R);
  const H = Math.ceil((side ? 2.25 : 2.90) * R);
  const oy = (side ? 1.55 : 1.85) * R;
  const cv = document.createElement('canvas');
  cv.width = Math.ceil(W * sc);
  cv.height = Math.ceil(H * sc);
  const g = cv.getContext('2d');
  g.scale(sc, sc);
  g.save();
  g.translate(W/2, oy);
  if(dir === 'NE-SW') g.scale(-1, 1);
  hybDraw(g, 0, 0, R, {accent, wood: wd, flip: dir==='NE-SW'}, mode);
  g.restore();
  return hybridSprite._c[key] = {canvas: cv, ox: W/2, oy, w: W, h: H};
}

function drawHybridSide(ctx, cx, cy, R, o){
  o = o || {};
  const s = hybridSprite(R, 'side', 'NW-SE', o.accent || '#dc2626', o.wood || '#9a7b56', o.scale);
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(s.canvas, cx - s.ox, cy - s.oy, s.w, s.h);
  ctx.restore();
}
function drawHybridDiag(ctx, cx, cy, R, o){
  o = o || {};
  const d = o.dir === 'NE-SW' ? 'NE-SW' : 'NW-SE';
  const s = hybridSprite(R, 'diag', d, o.accent || '#dc2626', o.wood || '#9a7b56', o.scale);
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(s.canvas, cx - s.ox, cy - s.oy, s.w, s.h);
  ctx.restore();
}
function hybridFootprint(R, mode, dir){
  const L = hybLayout(R, mode), m = dir === 'NE-SW' ? -1 : 1, c = [];
  for(let i=0; i<L.N; i+=5) c.push({x: L.g[i][0]*m, y: L.g[i][1], r: R*0.115*L.k});
  return {tiles: L.hexes.map(h => [h[0]*m, h[1]]), circles: c};
}
/* ===== END STATIC RMC HYBRID COASTER ===== */

return Object.freeze({ side: drawHybridSide, diag: drawHybridDiag, footprint: hybridFootprint });
})();