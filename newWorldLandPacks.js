/* Imported land artwork, isolated by theme. Unthemed stays empty; immersive uses source tier 5. */
const NEW_WORLD_LAND_PACKS = Object.freeze({
  galactic: (() => {
/* ===== THEME PACK CORE (shared by every theme pack; copy once into engine.js) ===== */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shade(hex, amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=c=>Math.max(0,Math.min(255,Math.round(amt<0?c*(1+amt):c+(255-c)*amt)));return `rgb(${f(r)},${f(g)},${f(b)})`;}
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
    ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x+rx*0.35,y+ry*0.25,rx*0.4,ry*0.5,0,0,7);ctx.fill();}
};

/* ===== GALACTIC OUTPOST ASSET LIBRARY (Batuu & Tatooine Architectural Inspiration) ===== */
const GOSH = (c, x, y, rx) => {
  c.fillStyle = 'rgba(28, 16, 10, .32)';
  c.beginPath();
  c.ellipse(x + rx * 0.25, y + rx * 0.1, rx, rx * 0.36, 0, 0, 7);
  c.fill();
};
const GOFLIP = (c, x, f, fn) => {
  if (f) {
    c.save();
    c.translate(x, 0);
    c.scale(-1, 1);
    c.translate(-x, 0);
    fn();
    c.restore();
  } else fn();
};
const GOBOX = (c, x, y, u, x0, x1, y0, y1, z0, z1, col) => TH.box(c, x, y, u, x0, x1, y0, y1, z0, z1, col, shade(col, -0.28), shade(col, 0.10));

// Warm Sunlit Outer-Rim Palette (Golden sandstone, terracotta plaster, weathered duracrete, oxidized copper-teal, glowing amber & cyan)
const GO_STUCCO   = '#e2cbb0';
const GO_STUCCO_D = '#aa8e70';
const GO_SAND     = '#d4a373';
const GO_TERRA    = '#b85a3a';
const GO_RUST     = '#963d28';
const GO_SLATE    = '#3d4856';
const GO_TEAL     = '#1f7a7a';
const GO_AMBER    = '#f59e0b';
const GO_CYAN     = '#38bdf8';

// Helper: Draw a 3D Cylindrical Batuu Drum with Weathered Panel Seams & Warm Specular Shading
function drawBatuuCylinder(c, pBot, pTop, rx, ry, colMain, colDark, u, seams = 2) {
  const g = c.createLinearGradient(pBot[0] - rx, 0, pBot[0] + rx, 0);
  g.addColorStop(0.00, shade(colMain, 0.20));
  g.addColorStop(0.45, colMain);
  g.addColorStop(0.82, colDark || shade(colMain, -0.28));
  g.addColorStop(1.00, shade(colMain, -0.42));

  c.fillStyle = g;
  c.beginPath();
  c.moveTo(pBot[0] - rx, pBot[1]);
  c.lineTo(pTop[0] - rx, pTop[1]);
  c.ellipse(pTop[0], pTop[1], rx, ry, 0, Math.PI, 0, false);
  c.lineTo(pBot[0] + rx, pBot[1]);
  c.ellipse(pBot[0], pBot[1], rx, ry, 0, 0, Math.PI, false);
  c.closePath();
  c.fill();

  c.strokeStyle = 'rgba(38, 24, 16, 0.28)';
  c.lineWidth = u * 0.04;
  for (let s = 1; s <= seams; s++) {
    const f = s / (seams + 1);
    const sy = pBot[1] + (pTop[1] - pBot[1]) * f;
    c.beginPath();
    c.ellipse(pBot[0], sy, rx * 0.99, ry * 0.96, 0, 0.08, Math.PI - 0.08);
    c.stroke();
  }
}

// Helper: Draw Batuu Overhanging Saucer-Dome Roof
function drawBatuuSaucerCap(c, pBase, rx, ry, hDome, roofCol, rimCol, u, tiered = false) {
  TH.ell(c, pBase[0], pBase[1] + u * 0.04, rx * 1.18, ry * 1.18, '#1c1917');
  TH.ell(c, pBase[0], pBase[1], rx * 1.16, ry * 1.16, rimCol || GO_SLATE);

  const g = c.createLinearGradient(pBase[0] - rx, pBase[1] - hDome, pBase[0] + rx, pBase[1]);
  g.addColorStop(0.0, shade(roofCol, 0.22));
  g.addColorStop(0.55, roofCol);
  g.addColorStop(1.0, shade(roofCol, -0.34));
  c.fillStyle = g;
  c.beginPath();
  c.ellipse(pBase[0], pBase[1] - u * 0.03, rx * 1.02, hDome, 0, Math.PI, 0);
  c.ellipse(pBase[0], pBase[1] - u * 0.03, rx * 1.02, ry * 0.95, 0, 0, Math.PI);
  c.closePath();
  c.fill();

  if (tiered) {
    const pMid = [pBase[0], pBase[1] - hDome * 0.56];
    TH.ell(c, pMid[0], pMid[1] + u * 0.03, rx * 0.84, ry * 0.84, '#1c1917');
    TH.ell(c, pMid[0], pMid[1], rx * 0.82, ry * 0.82, rimCol || GO_SLATE);
    c.fillStyle = g;
    c.beginPath();
    c.ellipse(pMid[0], pMid[1] - u * 0.02, rx * 0.68, hDome * 0.55, 0, Math.PI, 0);
    c.ellipse(pMid[0], pMid[1] - u * 0.02, rx * 0.68, ry * 0.68, 0, 0, Math.PI);
    c.closePath();
    c.fill();
  }

  TH.ell(c, pBase[0], pBase[1] - hDome * (tiered ? 1.06 : 0.95), rx * 0.24, ry * 0.34, shade(roofCol, -0.15));
}

/* ---- Rounded Batuu Buildings & Outpost Vignettes ---- */
const GALACTIC_ASSETS = {
  // 1. Batuu Tiered Saucer-Dome Rotunda + Attached Cylindrical Turret
  batuuRotunda: {
    cat: 'struct', rho: 0.13,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 13 + 5);
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      const o = v & 3, eave = (o >> 1) & 1;
      const wallCol = [GO_SAND, GO_STUCCO, '#d9a87a', '#ccb499'][v % 4];
      const roofCol = ['#7c6858', GO_TERRA, GO_TEAL, '#4b5563'][(v >> 1) % 4];
      const hasTurret = (v % 3 !== 0);
      GOFLIP(c, x, o & 1, () => {
        c.fillStyle = 'rgba(28, 16, 10, .34)';
        c.beginPath();
        c.ellipse(x + u * 0.55, y + u * 0.18, u * 3.65, u * 1.35, 0, 0, 7);
        c.fill();

        const cx0 = eave ? -0.25 : 0.25, cy0 = eave ? 0.22 : -0.22;
        const tx0 = eave ? 1.18 : -1.18, ty0 = eave ? -0.82 : 0.82;

        if (hasTurret) {
          const turH = 3.5 + r() * 0.85;
          const pTurB = I(tx0, ty0, 0), pTurT = I(tx0, ty0, turH);
          drawBatuuCylinder(c, pTurB, pTurT, u * 0.88, u * 0.42, GO_STUCCO, GO_STUCCO_D, u, 3);
          drawBatuuSaucerCap(c, pTurT, u * 0.96, u * 0.46, u * 0.72, GO_TERRA, GO_SLATE, u, false);
        }

        const mainH = 2.45 + r() * 0.45;
        const pMainB = I(cx0, cy0, 0), pMainT = I(cx0, cy0, mainH);
        drawBatuuCylinder(c, pMainB, pMainT, u * 2.05, u * 0.98, wallCol, shade(wallCol, -0.28), u, 2);

        const pDoor = I(cx0 + 0.15, cy0 + 1.38, 0.10);
        c.fillStyle = '#1c1917';
        c.beginPath();
        c.arc(pDoor[0], pDoor[1] - u * 0.52, u * 0.44, Math.PI, 0);
        c.lineTo(pDoor[0] + u * 0.44, pDoor[1] + u * 0.16);
        c.lineTo(pDoor[0] - u * 0.44, pDoor[1] + u * 0.16);
        c.closePath();
        c.fill();
        TH.ell(c, pDoor[0], pDoor[1] - u * 0.22, u * 0.26, u * 0.34, (v % 2) ? GO_AMBER : GO_CYAN);

        TH.poly(c, [
          [pDoor[0] - u * 0.80, pDoor[1] - u * 0.92],
          [pDoor[0] + u * 0.68, pDoor[1] - u * 1.04],
          [pDoor[0] + u * 0.88, pDoor[1] - u * 0.62],
          [pDoor[0] - u * 0.60, pDoor[1] - u * 0.50]
        ], (v % 2) ? GO_TEAL : GO_TERRA, '#1c1917', u * 0.04);

        drawBatuuSaucerCap(c, pMainT, u * 2.12, u * 1.02, u * 1.32, roofCol, GO_SLATE, u, (v % 2 === 0));
      });
    }
  },

  // 2. Batuu Tapered Cylindrical Silo Tower & Canopy Annex
  batuuSiloTower: {
    cat: 'struct', rho: 0.12,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 19 + 7);
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      const o = v & 3, eave = (o >> 1) & 1;
      const towCol = ['#ded2be', GO_STUCCO, '#c8b8a4', '#e4d5c0'][v % 4];
      GOFLIP(c, x, o & 1, () => {
        c.fillStyle = 'rgba(28, 16, 10, .34)';
        c.beginPath();
        c.ellipse(x + u * 0.50, y + u * 0.18, u * 3.35, u * 1.25, 0, 0, 7);
        c.fill();

        const sx = eave ? 0.62 : -0.62, sy = eave ? -0.40 : 0.40;
        const ax = -sx * 1.15, ay = -sy * 1.15;

        const pAnnB = I(ax, ay, 0), pAnnT = I(ax, ay, 2.05 + r() * 0.40);
        drawBatuuCylinder(c, pAnnB, pAnnT, u * 1.52, u * 0.74, GO_STUCCO, GO_STUCCO_D, u, 1);
        drawBatuuSaucerCap(c, pAnnT, u * 1.56, u * 0.76, u * 0.65, GO_SLATE, GO_TERRA, u, false);

        const pTowB = I(sx, sy, 0), pTowT = I(sx, sy, 3.95 + r() * 0.75);
        drawBatuuCylinder(c, pTowB, pTowT, u * 1.24, u * 0.58, towCol, shade(towCol, -0.30), u, 4);

        TH.ln(c, [pTowB[0] + u * 0.58, pTowB[1] - u * 0.35], [pTowT[0] + u * 0.52, pTowT[1] + u * 0.25], GO_TERRA, u * 0.12);
        TH.ell(c, pTowT[0] - u * 0.30, pTowT[1] + u * 0.55, u * 0.20, u * 0.26, GO_SLATE);

        drawBatuuSaucerCap(c, pTowT, u * 1.46, u * 0.68, u * 0.78, (v % 2) ? GO_SLATE : GO_TEAL, '#57534e', u, false);
        TH.ln(c, [pTowT[0], pTowT[1] - u * 0.78], [pTowT[0], pTowT[1] - u * 1.75], '#cbd5e1', u * 0.07);
        TH.ell(c, pTowT[0], pTowT[1] - u * 1.78, u * 0.13, u * 0.13, (v % 2) ? GO_CYAN : GO_AMBER);
      });
    }
  },

  // 3. Batuu Multi-Tiered Market Citadel (Stepped Bastions, Sky-Bridge Arch, Twin Domes & Awnings)
  batuuArchComplex: {
    cat: 'struct', rho: 0.13,
    draw(c, x, y, u, v) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      const o = v & 3, eave = (o >> 1) & 1;
      const domeCol = [GO_TEAL, GO_TERRA, '#8c6239', GO_SLATE][v % 4];
      GOFLIP(c, x, o & 1, () => {
        c.fillStyle = 'rgba(28, 16, 10, .35)';
        c.beginPath();
        c.ellipse(x + u * 0.55, y + u * 0.18, u * 3.75, u * 1.38, 0, 0, 7);
        c.fill();

        const tx = eave ? -1.10 : 1.10, ty = eave ? 0.62 : -0.62;
        const bx = -tx * 0.68, by = -ty * 0.68;

        // Back rounded hall + copper saucer dome
        const pHallB = I(bx, by, 0), pHallT = I(bx, by, 2.55);
        drawBatuuCylinder(c, pHallB, pHallT, u * 1.75, u * 0.85, GO_STUCCO, GO_STUCCO_D, u, 2);
        drawBatuuSaucerCap(c, pHallT, u * 1.80, u * 0.88, u * 0.86, domeCol, GO_SLATE, u, false);

        // Stepped limestone/plaster sky-bridge wing connecting the two drums
        GOBOX(c, x, y, u, -1.25, 1.25, -0.45, 0.55, 1.35, 2.15, GO_STUCCO);

        // Front rounded bastion tower with dome crown
        const pBastB = I(tx, ty, 0), pBastT = I(tx, ty, 3.45 + (v % 3) * 0.30);
        drawBatuuCylinder(c, pBastB, pBastT, u * 1.15, u * 0.56, GO_SAND, '#8c643e', u, 3);
        TH.ell(c, pBastT[0], pBastT[1], u * 1.26, u * 0.62, GO_STUCCO);
        drawBatuuSaucerCap(c, [pBastT[0], pBastT[1] - u * 0.10], u * 1.12, u * 0.54, u * 0.78, GO_STUCCO, GO_STUCCO_D, u, false);

        // Grand rounded bazaar archway under the sky-bridge + draped colorful market awnings
        const pArch = I(0, 0.58, 0.10);
        c.fillStyle = '#1c1917';
        c.beginPath();
        c.arc(pArch[0], pArch[1] - u * 0.68, u * 0.54, Math.PI, 0);
        c.lineTo(pArch[0] + u * 0.54, pArch[1] + u * 0.16);
        c.lineTo(pArch[0] - u * 0.54, pArch[1] + u * 0.16);
        c.closePath();
        c.fill();
        c.strokeStyle = GO_STUCCO;
        c.lineWidth = u * 0.14;
        c.stroke();

        // Draped fabric market sail
        TH.poly(c, [
          [pArch[0] - u * 1.45, pArch[1] - u * 1.05],
          [pArch[0] - u * 0.45, pArch[1] - u * 1.15],
          [pArch[0] - u * 0.35, pArch[1] - u * 0.72],
          [pArch[0] - u * 1.35, pArch[1] - u * 0.62]
        ], (v % 2) ? '#d97706' : GO_TEAL);
      });
    }
  },

  // 4. Tatooine / Batuu Twin-Dome Plastered Courtyard Homestead
  tatooineHomestead: {
    cat: 'struct', rho: 0.12,
    draw(c, x, y, u, v) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      const o = v & 3, eave = (o >> 1) & 1;
      const wallC = (v % 2) ? '#ead4b7' : '#d6bea0';
      GOFLIP(c, x, o & 1, () => {
        c.fillStyle = 'rgba(28, 16, 10, .32)';
        c.beginPath();
        c.ellipse(x + u * 0.50, y + u * 0.16, u * 3.35, u * 1.22, 0, 0, 7);
        c.fill();

        const pCompB = I(0, 0, 0), pCompT = I(0, 0, 1.72);
        drawBatuuCylinder(c, pCompB, pCompT, u * 2.22, u * 1.08, wallC, shade(wallC, -0.26), u, 1);
        TH.ell(c, pCompT[0], pCompT[1], u * 2.22, u * 1.08, shade(wallC, 0.12));

        const d1 = eave ? I(-0.74, 0.22, 1.62) : I(-0.68, -0.26, 1.62);
        const d2 = eave ? I( 0.82, -0.26, 1.62) : I( 0.75, 0.28, 1.62);
        drawBatuuSaucerCap(c, d1, u * 1.15, u * 0.58, u * 1.12, wallC, GO_STUCCO_D, u, false);
        drawBatuuSaucerCap(c, d2, u * 0.90, u * 0.46, u * 0.88, GO_STUCCO, GO_TERRA, u, false);

        const pDoor = I(0.18, 1.38, 0.08);
        c.fillStyle = '#1c1917';
        c.beginPath();
        c.arc(pDoor[0], pDoor[1] - u * 0.42, u * 0.34, Math.PI, 0);
        c.lineTo(pDoor[0] + u * 0.34, pDoor[1] + u * 0.12);
        c.lineTo(pDoor[0] - u * 0.34, pDoor[1] + u * 0.12);
        c.closePath();
        c.fill();
        TH.ell(c, pDoor[0], pDoor[1] - u * 0.18, u * 0.18, u * 0.24, GO_AMBER);
      });
    }
  },

  // 5. Batuu Curved Market Cantina & Terrace Gallery
  batuuCantinaHall: {
    cat: 'struct', rho: 0.13,
    draw(c, x, y, u, v) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      const o = v & 3, eave = (o >> 1) & 1;
      GOFLIP(c, x, o & 1, () => {
        c.fillStyle = 'rgba(28, 16, 10, .34)';
        c.beginPath();
        c.ellipse(x + u * 0.55, y + u * 0.18, u * 3.60, u * 1.32, 0, 0, 7);
        c.fill();

        const ax = eave ? -0.90 : 0.90, ay = eave ? 0.54 : -0.54;
        const p1B = I(-ax * 0.6, -ay * 0.6, 0), p1T = I(-ax * 0.6, -ay * 0.6, 2.45);
        const p2B = I( ax * 0.85, ay * 0.85, 0), p2T = I( ax * 0.85, ay * 0.85, 2.95);

        drawBatuuCylinder(c, p2B, p2T, u * 1.48, u * 0.72, GO_STUCCO, GO_STUCCO_D, u, 2);
        drawBatuuSaucerCap(c, p2T, u * 1.56, u * 0.76, u * 0.84, GO_TERRA, GO_SLATE, u, false);

        drawBatuuCylinder(c, p1B, p1T, u * 1.80, u * 0.88, '#d4a373', '#8c643e', u, 2);
        drawBatuuSaucerCap(c, p1T, u * 1.88, u * 0.92, u * 1.00, GO_SLATE, GO_TEAL, u, true);

        [-0.42, 0.30].forEach(wx => {
          const pw = I(wx, 1.12, 1.45);
          TH.ell(c, pw[0], pw[1], u * 0.24, u * 0.12, GO_AMBER);
        });
      });
    }
  },

  /* ---------- Colossal Towering Petrified Black Spires & Fluted Canyon Crags ---------- */
  petrifiedSpire: {
    cat: 'hill', rho: 0.10,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 29 + 11);
      const count = 2 + (v % 2); // 2 or 3 towering clustered spires per formation
      const baseW = u * (1.55 + r() * 0.65);
      const mainH = u * (8.2 + r() * 4.4); // Towering Galaxy's Edge Black Spires!

      TH.ell(c, x, y + u * 0.08, baseW * 1.25, u * 0.42, 'rgba(24, 16, 10, .32)');

      const drawFlutedSpire = (ox, oy, w, h, tilt, cLit, cDark, cRim) => {
        const tipX = ox + tilt * w;
        const tipY = oy - h;
        const midY1 = oy - h * (0.36 + r() * 0.12);
        const midY2 = oy - h * (0.70 + r() * 0.12);
        const shoulderL1 = ox - w * (0.68 + r() * 0.18);
        const shoulderL2 = ox - w * (0.36 + r() * 0.14);
        const shoulderR1 = ox + w * (0.70 + r() * 0.18);
        const shoulderR2 = ox + w * (0.38 + r() * 0.14);

        // Sunlit left sandstone/petrified-wood face
        TH.poly(c, [
          [ox - w, oy],
          [shoulderL1, midY1],
          [shoulderL2, midY2],
          [tipX, tipY],
          [ox + w * 0.04, midY2],
          [ox + w * 0.06, oy + u * 0.06]
        ], cLit);

        // Deep charcoal-slate shaded right face
        TH.poly(c, [
          [ox + w * 0.06, oy + u * 0.06],
          [ox + w * 0.04, midY2],
          [tipX, tipY],
          [shoulderR2, midY2],
          [shoulderR1, midY1],
          [ox + w, oy]
        ], cDark);

        // Sharp sunlit ridge spine
        TH.ln(c, [tipX, tipY], [ox + w * 0.05, oy + u * 0.05], cRim, u * 0.052);

        // Vertical petrified-wood fluting ribs & horizontal sedimentary ledges
        [-0.42, 0.38].forEach((rf, idx) => {
          TH.ln(c, [ox + w * rf * 0.35, oy - h * 0.72], [ox + w * rf, oy], idx === 0 ? 'rgba(255,235,210,0.22)' : 'rgba(15,18,24,0.45)', u * 0.04);
        });
        [0.26, 0.52, 0.76].forEach(tf => {
          const sy = oy - h * tf;
          const sw = w * (1 - tf * 0.78);
          TH.ln(c, [ox - sw * 0.85, sy], [ox + sw * 0.85, sy - u * 0.05], 'rgba(20, 14, 12, 0.38)', u * 0.04);
        });

        // Moss/scrub clinging to lower rock ledges (like your Galaxy's Edge photo!)
        TH.ell(c, ox - w * 0.48, oy - h * 0.14, w * 0.42, u * 0.18, '#2d5a36');
      };

      const dir = (v % 2) ? 1 : -1;
      drawFlutedSpire(x - dir * baseW * 0.65, y - u * 0.03, baseW * 0.44, mainH * (0.62 + r() * 0.22), -dir * (0.06 + r() * 0.12), '#6b5e54', '#2e2b36', '#a89688');
      if (count === 3) {
        drawFlutedSpire(x + dir * baseW * 0.68, y + u * 0.02, baseW * 0.40, mainH * (0.50 + r() * 0.24),  dir * (0.08 + r() * 0.14), '#75665a', '#26242e', '#b8a290');
      }
      drawFlutedSpire(x, y + u * 0.04, baseW * 0.62, mainH, -dir * (0.03 + r() * 0.07), '#7c6b5e', '#24222b', '#c7b29e');
    }
  },
  canyonCrag: {
    cat: 'hill', rho: 0.09,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 31 + 13);
      const w = u * (1.45 + r() * 0.55);
      const h = u * (5.4 + r() * 3.2);
      TH.ell(c, x, y + u * 0.07, w * 1.18, u * 0.36, 'rgba(24, 16, 10, .30)');

      const dir = (v % 2) ? -1 : 1;
      const tipX = x - dir * w * (0.05 + r() * 0.14);
      const stepZ = h * (0.46 + r() * 0.22);

      TH.poly(c, [
        [x - w * 0.78, y + u * 0.05],
        [x - w * 0.56, y - stepZ],
        [x - w * 0.32, y - stepZ * 1.06],
        [tipX, y - h],
        [x + w * 0.05, y + u * 0.06]
      ], '#877262');
      TH.poly(c, [
        [x + w * 0.05, y + u * 0.06],
        [tipX, y - h],
        [x + w * 0.46, y - h * 0.58],
        [x + w * 0.80, y + u * 0.05]
      ], '#322d38');
      TH.ln(c, [tipX, y - h], [x + w * 0.05, y + u * 0.05], '#c7b29e', u * 0.048);
      TH.ell(c, x - w * 0.38, y - h * 0.14, w * 0.38, u * 0.16, '#2d5a36');
    }
  },

  // 2. Batuu Tapered Cylindrical Silo Tower & Canopy Annex
  batuuSiloTower: {
    cat: 'struct', rho: 0.11,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 19 + 7);
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      const o = v & 3, eave = (o >> 1) & 1;
      const towCol = ['#ded2be', GO_STUCCO, '#c8b8a4', '#e4d5c0'][v % 4];
      GOFLIP(c, x, o & 1, () => {
        c.fillStyle = 'rgba(28, 16, 10, .32)';
        c.beginPath();
        c.ellipse(x + u * 0.45, y + u * 0.16, u * 2.8, u * 1.05, 0, 0, 7);
        c.fill();

        const sx = eave ? 0.55 : -0.55, sy = eave ? -0.35 : 0.35;
        const ax = -sx * 1.15, ay = -sy * 1.15;

        const pAnnB = I(ax, ay, 0), pAnnT = I(ax, ay, 1.65 + r() * 0.35);
        drawBatuuCylinder(c, pAnnB, pAnnT, u * 1.25, u * 0.62, GO_STUCCO, GO_STUCCO_D, u, 1);
        drawBatuuSaucerCap(c, pAnnT, u * 1.28, u * 0.64, u * 0.52, GO_SLATE, GO_TERRA, u, false);

        const pTowB = I(sx, sy, 0), pTowT = I(sx, sy, 3.25 + r() * 0.65);
        drawBatuuCylinder(c, pTowB, pTowT, u * 1.02, u * 0.48, towCol, shade(towCol, -0.30), u, 4);

        TH.ln(c, [pTowB[0] + u * 0.48, pTowB[1] - u * 0.3], [pTowT[0] + u * 0.44, pTowT[1] + u * 0.2], GO_TERRA, u * 0.10);
        TH.ell(c, pTowT[0] - u * 0.25, pTowT[1] + u * 0.45, u * 0.16, u * 0.22, GO_SLATE);

        drawBatuuSaucerCap(c, pTowT, u * 1.20, u * 0.56, u * 0.64, (v % 2) ? GO_SLATE : GO_TEAL, '#57534e', u, false);
        TH.ln(c, [pTowT[0], pTowT[1] - u * 0.65], [pTowT[0], pTowT[1] - u * 1.45], '#cbd5e1', u * 0.06);
        TH.ell(c, pTowT[0], pTowT[1] - u * 1.48, u * 0.11, u * 0.11, (v % 2) ? GO_CYAN : GO_AMBER);
      });
    }
  },

  // 3. Batuu Rounded Archway Bazaar Bastion
  batuuArchComplex: {
    cat: 'struct', rho: 0.12,
    draw(c, x, y, u, v) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      const o = v & 3, eave = (o >> 1) & 1;
      const domeCol = [GO_TEAL, GO_TERRA, GO_SLATE, '#8c6239'][v % 4];
      GOFLIP(c, x, o & 1, () => {
        c.fillStyle = 'rgba(28, 16, 10, .32)';
        c.beginPath();
        c.ellipse(x + u * 0.5, y + u * 0.16, u * 3.0, u * 1.10, 0, 0, 7);
        c.fill();

        const tx = eave ? -0.95 : 0.95, ty = eave ? 0.55 : -0.55;
        const bx = -tx * 0.65, by = -ty * 0.65;

        const pHallB = I(bx, by, 0), pHallT = I(bx, by, 2.05);
        drawBatuuCylinder(c, pHallB, pHallT, u * 1.42, u * 0.70, GO_STUCCO, GO_STUCCO_D, u, 2);
        drawBatuuSaucerCap(c, pHallT, u * 1.45, u * 0.72, u * 0.70, domeCol, GO_SLATE, u, false);

        const pBastB = I(tx, ty, 0), pBastT = I(tx, ty, 2.95 + (v % 3) * 0.25);
        drawBatuuCylinder(c, pBastB, pBastT, u * 0.92, u * 0.45, GO_SAND, '#8c643e', u, 3);
        TH.ell(c, pBastT[0], pBastT[1], u * 1.02, u * 0.50, GO_STUCCO);
        drawBatuuSaucerCap(c, [pBastT[0], pBastT[1] - u * 0.08], u * 0.90, u * 0.44, u * 0.62, GO_SLATE, GO_STUCCO_D, u, false);

        const pArch = I(0, 0.55, 0.10);
        c.fillStyle = '#1c1917';
        c.beginPath();
        c.arc(pArch[0], pArch[1] - u * 0.55, u * 0.44, Math.PI, 0);
        c.lineTo(pArch[0] + u * 0.44, pArch[1] + u * 0.15);
        c.lineTo(pArch[0] - u * 0.44, pArch[1] + u * 0.15);
        c.closePath();
        c.fill();
        c.strokeStyle = GO_STUCCO;
        c.lineWidth = u * 0.12;
        c.stroke();
      });
    }
  },

  // 4. Tatooine / Batuu Twin-Dome Plastered Courtyard Homestead
  tatooineHomestead: {
    cat: 'struct', rho: 0.11,
    draw(c, x, y, u, v) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      const o = v & 3, eave = (o >> 1) & 1;
      const wallC = (v % 2) ? '#ead4b7' : '#d6bea0';
      GOFLIP(c, x, o & 1, () => {
        c.fillStyle = 'rgba(28, 16, 10, .30)';
        c.beginPath();
        c.ellipse(x + u * 0.45, y + u * 0.15, u * 2.8, u * 1.02, 0, 0, 7);
        c.fill();

        const pCompB = I(0, 0, 0), pCompT = I(0, 0, 1.35);
        drawBatuuCylinder(c, pCompB, pCompT, u * 1.85, u * 0.90, wallC, shade(wallC, -0.26), u, 1);
        TH.ell(c, pCompT[0], pCompT[1], u * 1.85, u * 0.90, shade(wallC, 0.12));

        const d1 = eave ? I(-0.62, 0.18, 1.25) : I(-0.55, -0.22, 1.25);
        const d2 = eave ? I( 0.68, -0.22, 1.25) : I( 0.62, 0.24, 1.25);
        drawBatuuSaucerCap(c, d1, u * 0.95, u * 0.48, u * 0.92, wallC, GO_STUCCO_D, u, false);
        drawBatuuSaucerCap(c, d2, u * 0.74, u * 0.38, u * 0.72, GO_STUCCO, GO_TERRA, u, false);

        const pDoor = I(0.15, 1.15, 0.08);
        c.fillStyle = '#1c1917';
        c.beginPath();
        c.arc(pDoor[0], pDoor[1] - u * 0.34, u * 0.28, Math.PI, 0);
        c.lineTo(pDoor[0] + u * 0.28, pDoor[1] + u * 0.10);
        c.lineTo(pDoor[0] - u * 0.28, pDoor[1] + u * 0.10);
        c.closePath();
        c.fill();
        TH.ell(c, pDoor[0], pDoor[1] - u * 0.14, u * 0.15, u * 0.20, GO_AMBER);
      });
    }
  },

  // 5. Batuu Curved Market Cantina & Terrace Gallery
  batuuCantinaHall: {
    cat: 'struct', rho: 0.12,
    draw(c, x, y, u, v) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      const o = v & 3, eave = (o >> 1) & 1;
      GOFLIP(c, x, o & 1, () => {
        c.fillStyle = 'rgba(28, 16, 10, .32)';
        c.beginPath();
        c.ellipse(x + u * 0.48, y + u * 0.16, u * 3.0, u * 1.10, 0, 0, 7);
        c.fill();

        const ax = eave ? -0.75 : 0.75, ay = eave ? 0.45 : -0.45;
        const p1B = I(-ax * 0.6, -ay * 0.6, 0), p1T = I(-ax * 0.6, -ay * 0.6, 1.95);
        const p2B = I( ax * 0.85, ay * 0.85, 0), p2T = I( ax * 0.85, ay * 0.85, 2.35);

        drawBatuuCylinder(c, p2B, p2T, u * 1.22, u * 0.60, GO_STUCCO, GO_STUCCO_D, u, 2);
        drawBatuuSaucerCap(c, p2T, u * 1.28, u * 0.62, u * 0.68, GO_TERRA, GO_SLATE, u, false);

        drawBatuuCylinder(c, p1B, p1T, u * 1.48, u * 0.72, '#d4a373', '#8c643e', u, 2);
        drawBatuuSaucerCap(c, p1T, u * 1.54, u * 0.75, u * 0.82, GO_SLATE, GO_TEAL, u, true);

        [-0.35, 0.25].forEach(wx => {
          const pw = I(wx, 0.92, 1.15);
          TH.ell(c, pw[0], pw[1], u * 0.20, u * 0.10, GO_AMBER);
        });
      });
    }
  },

  /* ---------- Rear Sharp Petrified Rock Spires & Canyon Gateway Arches ---------- */
  petrifiedSpire: {
    cat: 'hill', rho: 0.09,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 29 + 11);
      const count = 1 + (v % 3);
      const baseW = u * (1.20 + r() * 0.50);
      const mainH = u * (5.2 + r() * 3.0);

      TH.ell(c, x, y + u * 0.06, baseW * 1.15, u * 0.34, 'rgba(24, 16, 10, .28)');

      const drawSlenderNeedle = (ox, oy, w, h, tilt, cLit, cDark, cRim) => {
        const tipX = ox + tilt * w;
        const tipY = oy - h;
        const midY = oy - h * (0.48 + r() * 0.16);
        const shoulderL = ox - w * (0.45 + r() * 0.22);
        const shoulderR = ox + w * (0.48 + r() * 0.22);

        TH.poly(c, [
          [ox - w, oy],
          [shoulderL, midY],
          [tipX, tipY],
          [ox + w * 0.04, midY],
          [ox + w * 0.06, oy + u * 0.05]
        ], cLit);

        TH.poly(c, [
          [ox + w * 0.06, oy + u * 0.05],
          [ox + w * 0.04, midY],
          [tipX, tipY],
          [shoulderR, midY],
          [ox + w, oy]
        ], cDark);

        TH.ln(c, [tipX, tipY], [ox + w * 0.04, oy + u * 0.04], cRim, u * 0.045);

        [0.32, 0.62].forEach(tf => {
          const sy = oy - h * tf;
          const sw = w * (1 - tf * 0.80);
          TH.ln(c, [ox - sw * 0.8, sy], [ox + sw * 0.8, sy - u * 0.04], 'rgba(24, 16, 14, 0.32)', u * 0.035);
        });
      };

      const dir = (v % 2) ? 1 : -1;
      if (count >= 2) {
        drawSlenderNeedle(x - dir * baseW * 0.62, y - u * 0.03, baseW * 0.38, mainH * (0.55 + r() * 0.25), -dir * (0.08 + r() * 0.14), '#6b5e54', '#38343d', '#9c8b7e');
      }
      if (count === 3) {
        drawSlenderNeedle(x + dir * baseW * 0.66, y + u * 0.02, baseW * 0.34, mainH * (0.45 + r() * 0.25),  dir * (0.10 + r() * 0.16), '#75665a', '#322f38', '#a89688');
      }
      drawSlenderNeedle(x, y + u * 0.03, baseW * 0.54, mainH, -dir * (0.03 + r() * 0.08), '#7c6b5e', '#2f2c36', '#b8a290');
    }
  },
  canyonCrag: {
    cat: 'hill', rho: 0.08,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 31 + 13);
      const w = u * (1.15 + r() * 0.45);
      const h = u * (3.6 + r() * 2.2);
      TH.ell(c, x, y + u * 0.06, w * 1.10, u * 0.30, 'rgba(24, 16, 10, .26)');

      const dir = (v % 2) ? -1 : 1;
      const tipX = x - dir * w * (0.06 + r() * 0.14);
      const stepZ = h * (0.45 + r() * 0.22);

      TH.poly(c, [
        [x - w * 0.72, y + u * 0.04],
        [x - w * 0.52, y - stepZ],
        [x - w * 0.30, y - stepZ * 1.05],
        [tipX, y - h],
        [x + w * 0.04, y + u * 0.05]
      ], '#877262');
      TH.poly(c, [
        [x + w * 0.04, y + u * 0.05],
        [tipX, y - h],
        [x + w * 0.42, y - h * 0.58],
        [x + w * 0.74, y + u * 0.04]
      ], '#3d3740');
      TH.ln(c, [tipX, y - h], [x + w * 0.04, y + u * 0.04], '#bda693', u * 0.042);
    }
  },
  // NEW HERO ELEMENT: Natural Sandstone Canyon Archway spanning a path/oasis
  canyonSandstoneArch: {
    cat: 'ruin', rho: 0.11,
    draw(c, x, y, u, v) {
      GOFLIP(c, x, v & 1, () => {
        TH.ell(c, x, y + u * 0.08, u * 2.6, u * 0.55, 'rgba(28, 16, 10, .30)');
        // Sweeping natural red-ochre sandstone arch bridge
        c.fillStyle = '#9c5a3c';
        c.beginPath();
        c.moveTo(x - u * 2.35, y + u * 0.12);
        c.bezierCurveTo(x - u * 2.15, y - u * 3.1, x + u * 2.15, y - u * 3.1, x + u * 2.35, y + u * 0.12);
        c.lineTo(x + u * 1.45, y + u * 0.18);
        c.bezierCurveTo(x + u * 1.25, y - u * 1.85, x - u * 1.25, y - u * 1.85, x - u * 1.45, y + u * 0.18);
        c.closePath();
        c.fill();

        // Sunlit top sandstone rim
        c.strokeStyle = '#d48c62';
        c.lineWidth = u * 0.16;
        c.beginPath();
        c.moveTo(x - u * 2.1, y - u * 0.4);
        c.bezierCurveTo(x - u * 1.8, y - u * 2.95, x + u * 1.8, y - u * 2.95, x + u * 2.1, y - u * 0.4);
        c.stroke();

        // Hanging outpost lantern beneath the arch keystone
        TH.ln(c, [x, y - u * 2.15], [x, y - u * 1.65], '#1e293b', u * 0.05);
        TH.ell(c, x, y - u * 1.58, u * 0.14, u * 0.16, GO_AMBER);
      });
    }
  },
  // NEW HERO ELEMENT: Glowing Turquoise Geothermal Desert Oasis Pool
  desertOasisPool: {
    cat: 'ruin', rho: 0.10,
    draw(c, x, y, u, v) {
      const r = mulberry((v || 1) * 23 + 9);
      const ph1 = r() * Math.PI * 2, ph2 = r() * Math.PI * 2;
      const poolPath = (rx, ry, ox = 0, oy = 0) => {
        const N = 28;
        c.beginPath();
        for (let i = 0; i <= N; i++) {
          const a = (i / N) * Math.PI * 2;
          const mod = 1 + 0.16 * Math.sin(2 * a + ph1) + 0.10 * Math.cos(3 * a + ph2);
          const px = x + ox + Math.cos(a) * rx * mod;
          const py = y + oy + Math.sin(a) * ry * mod;
          i === 0 ? c.moveTo(px, py) : c.lineTo(px, py);
        }
        c.closePath();
      };
      poolPath(u * 2.25, u * 1.00);
      c.fillStyle = '#78685c';
      c.fill();
      poolPath(u * 1.92, u * 0.82);
      c.fillStyle = '#0e7490';
      c.fill();
      poolPath(u * 1.48, u * 0.60, -u * 0.12, -u * 0.03);
      c.fillStyle = '#22d3ee';
      c.fill();
      // Shoreline sandstone pebbles
      [[-1.6, 0.2], [1.5, -0.2], [0.4, 0.68]].forEach(([bx, by]) => {
        TH.ell(c, x + bx * u, y + by * u, u * 0.28, u * 0.15, '#5e5652');
      });
    }
  },

  /* ---------- Dark-Blue Alien Trees (3 Distinct Variants, Zero Cacti) ---------- */
  indigoCanopyTree: {
    cat: 'tree', rho: 0.08,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 11 + 5), H = u * (3.6 + r() * 0.9);
      GOSH(c, x, y, u * 1.5);
      c.strokeStyle = '#1e2433';
      c.lineWidth = u * 0.42;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(x, y);
      c.bezierCurveTo(x - u * 0.55, y - H * 0.35, x + u * 0.55, y - H * 0.65, x - u * 0.08, y - H * 0.85);
      c.stroke();

      [
        [-0.95, -0.56, 0.92, 0.34, '#172554'],
        [ 0.95, -0.66, 0.94, 0.36, '#1e3a8a'],
        [ 0.05, -0.92, 1.15, 0.40, '#2563eb']
      ].forEach(([dx, fy, rx, ry, col]) => {
        TH.ln(c, [x, y + H * (fy + 0.14)], [x + dx * u, y + H * fy], '#1e2433', u * 0.15);
        TH.blob(c, x + dx * u, y + H * fy, u * rx, u * ry, col, r, 8);
      });
    }
  },
  cobaltWeepingTree: {
    cat: 'tree', rho: 0.08,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 19 + 3), H = u * (3.8 + r() * 0.8);
      GOSH(c, x, y, u * 1.5);
      c.strokeStyle = '#1e293b';
      c.lineWidth = u * 0.40;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(x + u * 0.3, y - H * 0.45, x - u * 0.1, y - H * 0.78);
      c.stroke();

      const cy = y - H * 0.80;
      TH.blob(c, x, cy, u * 1.35, u * 0.56, '#1e3a8a', r, 9);
      TH.blob(c, x - u * 0.2, cy - u * 0.25, u * 0.95, u * 0.42, '#1d4ed8', r, 8);

      for (let k = 0; k < 11; k++) {
        const sx = x + (k / 10 - 0.5) * u * 2.2;
        const len = u * (1.1 + r() * 1.1);
        TH.ln(c, [sx, cy + u * 0.15], [sx + (r() - 0.5) * u * 0.22, Math.min(y - u * 0.15, cy + len)], k % 2 ? '#172554' : '#2563eb', u * 0.09);
      }
    }
  },
  midnightConifer: {
    cat: 'tree', rho: 0.07,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 23 + 9), H = u * (4.1 + r() * 0.9), w = u * 0.95, tiers = 5;
      GOSH(c, x, y, u * 1.05);
      TH.ln(c, [x, y], [x, y - H * 0.28], '#1e2433', u * 0.30);
      for (let i = 0; i < tiers; i++) {
        const t = i / tiers;
        const ww = w * (1 - 0.78 * t) * (0.9 + r() * 0.18);
        const yb = y - H * (0.16 + 0.76 * t);
        const tip = yb - H * 0.30;
        TH.poly(c, [[x - ww, yb], [x, yb + H * 0.03], [x + ww, yb], [x, tip]], i % 2 ? '#172554' : '#1e3a8a');
        TH.poly(c, [[x, tip], [x + ww, yb], [x, yb + H * 0.03]], '#0f172a');
      }
    }
  },
  agaveCluster: {
    cat: 'shrub', rho: 0.05,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 7 + 3);
      TH.ell(c, x + u * 0.15, y + u * 0.06, u * 0.90, u * 0.26, 'rgba(28, 16, 10, .24)');
      for (let k = 0; k < 9; k++) {
        const a = -Math.PI + 0.15 + k / 8 * (Math.PI - 0.3);
        const len = u * (0.85 + r() * 0.35);
        TH.ln(c, [x, y - u * 0.1], [x + Math.cos(a) * len, y - u * 0.1 + Math.sin(a) * len * 0.72], k % 2 ? '#1e3a8a' : '#3b82f6', u * 0.14);
      }
    }
  },
  crateredRock: {
    cat: 'rock', rho: 0.06,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 17 + 7);
      const variant = v % 4;
      const w = u * (0.85 + r() * 0.50);
      const h = u * (1.15 + r() * 1.35);

      GOSH(c, x, y, w * 1.18);

      if (variant === 0) {
        // Tall jagged black-spire rock outcrop sprouting among the buildings
        TH.poly(c, [[x - w * 0.75, y], [x - w * 0.42, y - h * 1.35], [x + w * 0.12, y - h * 1.55], [x + w * 0.68, y - h * 0.42], [x + w * 0.58, y + u * 0.06]], '#7c6b5e');
        TH.poly(c, [[x + w * 0.08, y - h * 1.50], [x + w * 0.68, y - h * 0.42], [x + w * 0.58, y + u * 0.06], [x + w * 0.05, y + u * 0.03]], '#322d38');
      } else if (variant === 1) {
        // Broad stratified canyon sandstone ledge
        TH.poly(c, [[x - w * 1.25, y], [x - w * 0.90, y - h * 0.62], [x + w * 0.82, y - h * 0.68], [x + w * 1.18, y - h * 0.18], [x + w * 0.96, y + u * 0.08]], '#877262');
        TH.poly(c, [[x + w * 0.25, y - h * 0.65], [x + w * 1.18, y - h * 0.18], [x + w * 0.96, y + u * 0.08], [x + w * 0.20, y + u * 0.04]], '#3d3740');
      } else if (variant === 2) {
        // Twin jagged pinnacle boulders
        TH.poly(c, [[x - w * 1.05, y], [x - w * 0.68, y - h * 1.05], [x - w * 0.08, y - h * 0.82], [x, y + u * 0.05]], '#6b5e54');
        TH.poly(c, [[x + w * 0.10, y + u * 0.04], [x + w * 0.38, y - h * 0.72], [x + w * 0.92, y - h * 0.55], [x + w * 1.02, y + u * 0.06]], '#2e2b36');
      } else {
        // Moss-draped craggy monolith
        TH.poly(c, [[x - w * 0.85, y], [x - w * 0.22, y - h * 1.28], [x + w * 0.48, y - h * 1.10], [x + w * 0.90, y + u * 0.06]], '#75665a');
        TH.poly(c, [[x + w * 0.20, y - h * 1.15], [x + w * 0.90, y + u * 0.06], [x + w * 0.15, y + u * 0.04]], '#2e2b36');
        TH.ell(c, x - w * 0.32, y - h * 0.25, w * 0.35, u * 0.15, '#2d5a36');
      }
    }
  },

  /* ---------- Batuu & Tatooine Outpost Tech & Bazaar Structures ---------- */
  moistureVaporator: {
    cat: 'ruin', rho: 0.07,
    draw(c, x, y, u) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      GOSH(c, x, y, u * 1.35);
      GOBOX(c, x, y, u, -0.62, 0.62, -0.62, 0.62, 0, 0.62, GO_SLATE);
      const pB = I(0, 0, 0.62), pT = I(0, 0, 3.60);
      TH.ln(c, pB, pT, '#e2e8f0', u * 0.42);
      TH.ln(c, [pB[0] + u * 0.10, pB[1]], [pT[0] + u * 0.10, pT[1]], '#64748b', u * 0.15);
      [1.4, 2.2, 3.0].forEach(zv => {
        const pv = I(0, 0, zv);
        TH.ln(c, [pv[0] - u * 0.40, pv[1]], [pv[0] + u * 0.40, pv[1]], GO_SLATE, u * 0.11);
      });
      TH.ell(c, ...I(0, 0.25, 1.8), u * 0.10, u * 0.10, GO_CYAN);
      TH.ln(c, pT, [pT[0], pT[1] - u * 1.15], '#94a3b8', u * 0.08);
    }
  },
  bazaarStall: {
    cat: 'ruin', rho: 0.09,
    draw(c, x, y, u, v) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      GOFLIP(c, x, v & 1, () => {
        GOSH(c, x, y, u * 2.2);
        GOBOX(c, x, y, u, -1.60, 1.60, -0.52, 0.52, 0, 0.82, GO_STUCCO_D);
        GOBOX(c, x, y, u, -1.30, -0.52, -0.32, 0.32, 0.82, 1.32, GO_TERRA);
        GOBOX(c, x, y, u,  0.42,  1.22, -0.32, 0.32, 0.82, 1.25, GO_TEAL);

        [[-1.60, -0.62], [1.60, -0.62], [-1.60, 0.62], [1.60, 0.62]].forEach(([px, py]) => {
          TH.ln(c, I(px, py, 0), I(px, py, 2.40), '#44403c', u * 0.11);
        });

        TH.poly(c, [I(-1.80, -0.78, 2.50), I(1.80, -0.78, 2.50), I(1.80, 0.78, 2.10), I(-1.80, 0.78, 2.10)], '#d97706', '#5c3c24', u * 0.04);
        TH.poly(c, [I(-0.52, -0.78, 2.50), I(0.62, -0.78, 2.50), I(0.62, 0.78, 2.10), I(-0.52, 0.78, 2.10)], GO_TEAL);
        TH.ell(c, ...I(-1.40, 0.62, 1.90), u * 0.11, u * 0.14, GO_AMBER);
      });
    }
  },
  commsRelayDish: {
    cat: 'ruin', rho: 0.08,
    draw(c, x, y, u, v) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      GOFLIP(c, x, v & 1, () => {
        GOSH(c, x, y, u * 1.85);
        GOBOX(c, x, y, u, -1.10, 1.10, -1.00, 1.00, 0, 1.10, GO_SLATE);
        TH.ln(c, I(0, 0, 1.10), I(0, 0, 2.40), '#cbd5e1', u * 0.24);
        const pDish = I(0.15, 0.15, 2.70);
        TH.ell(c, pDish[0], pDish[1], u * 1.12, u * 0.70, '#f8fafc', -0.45);
        TH.ell(c, pDish[0] + u * 0.08, pDish[1] + u * 0.05, u * 0.86, u * 0.52, '#94a3b8', -0.45);
        TH.ln(c, pDish, [pDish[0] + u * 0.44, pDish[1] - u * 0.62], GO_TERRA, u * 0.09);
        TH.ell(c, pDish[0] + u * 0.44, pDish[1] - u * 0.62, u * 0.12, u * 0.12, GO_CYAN);
      });
    }
  },
  fuelCellCluster: {
    cat: 'ruin', rho: 0.08,
    draw(c, x, y, u) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      GOSH(c, x, y, u * 1.9);
      GOBOX(c, x, y, u, -1.50, 1.50, -0.72, 0.72, 0, 0.34, GO_SLATE);
      [-0.72, 0.72].forEach((tx, idx) => {
        const pt = I(tx, 0, 1.12);
        TH.ell(c, pt[0], pt[1], u * 0.76, u * 0.74, idx === 0 ? GO_TERRA : GO_TEAL);
        TH.ell(c, pt[0] - u * 0.22, pt[1] - u * 0.22, u * 0.26, u * 0.22, 'rgba(255,255,255,0.24)');
        TH.ell(c, pt[0], pt[1] + u * 0.18, u * 0.25, u * 0.10, idx === 0 ? GO_AMBER : GO_CYAN);
      });
      TH.ln(c, I(-0.72, 0, 1.82), I(0.72, 0, 1.82), '#cbd5e1', u * 0.14);
    }
  },
  spireBeaconTower: {
    cat: 'struct', rho: 0.08,
    draw(c, x, y, u, v) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      GOFLIP(c, x, v & 1, () => {
        GOSH(c, x, y, u * 2.0);
        const pB = I(0, 0, 0), pM = I(0, 0, 2.55), pT = I(0, 0, 4.85);
        drawBatuuCylinder(c, pB, pM, u * 1.12, u * 0.54, GO_STUCCO_D, '#78624a', u, 2);
        drawBatuuCylinder(c, pM, pT, u * 0.94, u * 0.45, GO_STUCCO, GO_STUCCO_D, u, 3);
        TH.ell(c, pT[0] - u * 0.28, pT[1] + u * 0.35, u * 0.22, u * 0.10, GO_AMBER);
        TH.ell(c, pT[0] + u * 0.32, pT[1] + u * 0.32, u * 0.20, u * 0.10, GO_CYAN);
        drawBatuuSaucerCap(c, pT, u * 1.15, u * 0.55, u * 0.72, GO_TERRA, GO_SLATE, u, true);
        TH.ln(c, [pT[0], pT[1] - u * 0.75], [pT[0], pT[1] - u * 1.85], '#cbd5e1', u * 0.09);
        TH.ell(c, pT[0], pT[1] - u * 1.90, u * 0.16, u * 0.16, GO_AMBER);
      });
    }
  },
  overheadCableSpan: {
    cat: 'wire', rho: 0.01,
    draw() {}
  },

  /* ---------- Small Outer-Rim Props ---------- */
  cargoCrates: {
    cat: 'prop', rho: 0.035,
    draw(c, x, y, u) {
      GOSH(c, x, y, u * 0.95);
      GOBOX(c, x, y, u, -0.65, 0.25, -0.45, 0.45, 0, 0.82, GO_TERRA);
      GOBOX(c, x, y, u, 0.05, 0.75, -0.25, 0.55, 0, 0.58, GO_TEAL);
      GOBOX(c, x, y, u, -0.45, 0.05, -0.25, 0.25, 0.82, 1.25, '#f59e0b');
    }
  },
  powerDroid: {
    cat: 'prop', rho: 0.025,
    draw(c, x, y, u, v) {
      GOFLIP(c, x, v & 1, () => {
        GOSH(c, x, y, u * 0.65);
        TH.ln(c, [x - u * 0.18, y], [x - u * 0.18, y - u * 0.45], '#1e293b', u * 0.14);
        TH.ln(c, [x + u * 0.18, y], [x + u * 0.18, y - u * 0.45], '#1e293b', u * 0.14);
        GOBOX(c, x, y, u, -0.38, 0.38, -0.32, 0.32, 0.38, 1.22, '#475569');
        TH.ell(c, x + u * 0.12, y - u * 0.88, u * 0.07, u * 0.07, GO_CYAN);
      });
    }
  },
  outpostBeacon: {
    cat: 'prop', rho: 0.025,
    draw(c, x, y, u) {
      TH.ell(c, x + u * 0.18, y + u * 0.06, u * 0.58, u * 0.18, 'rgba(28, 16, 10, .28)');
      TH.ln(c, [x, y], [x, y - u * 2.35], GO_SLATE, u * 0.20);
      TH.ell(c, x, y - u * 2.42, u * 0.28, u * 0.28, 'rgba(56, 189, 248, 0.35)');
      TH.ell(c, x, y - u * 2.42, u * 0.14, u * 0.14, GO_CYAN);
    }
  },
  plasmaConduit: {
    cat: 'prop', rho: 0.04,
    draw(c, x, y, u) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      GOSH(c, x, y, u * 1.15);
      GOBOX(c, x, y, u, -0.95, -0.55, -0.35, 0.35, 0, 0.72, GO_SLATE);
      GOBOX(c, x, y, u,  0.55,  0.95, -0.35, 0.35, 0, 0.72, GO_SLATE);
      TH.ln(c, I(-0.55, 0, 0.48), I(0.55, 0, 0.48), GO_TERRA, u * 0.22);
      TH.ln(c, I(-0.55, 0, 0.48), I(0.55, 0, 0.48), GO_AMBER, u * 0.08);
    }
  }
};

/* ===== MACRO-LAND ENGINE (hex geometry, planner, 5-tier baker) ===== */
const W3 = Math.sqrt(3), HX = W3 / 2, HV = [[HX, 0.29], [0, 0.58], [-HX, 0.29], [-HX, -0.29], [0, -0.58], [HX, -0.29]];
const LAND_ROWS = {
  A: [[-1, 0, 1], [-1.5, -0.5, 0.5, 1.5], [-1, 0, 1], [-0.5, 0.5]],
  B: [[0, 1, 2], [-0.5, 0.5, 1.5], [-1, 0, 1], [-0.5, 0.5, 1.5]],
  C: [[0], [-0.5, 0.5, 1.5], [-1, 0, 1], [-0.5]],
  D: [[0, 1, 2], [-0.5, 0.5, 1.5], [0, 1]]
};
const LAND_KEEP = { rx: 0.52, ry: 0.34 };
const vkey = p => p[0].toFixed(3) + ',' + p[1].toFixed(3);
function hexInside(dx, dy, s) {
  const ax = Math.abs(dx) / s, ay = Math.abs(dy) / s;
  return ax <= HX && ay <= 0.58 - 0.3349 * ax;
}

function landGeometry(shape) {
  const centers = [];
  LAND_ROWS[shape].forEach((row, r) => row.forEach((u, i) => centers.push({ x: u * W3, y: r * 0.87, row: r, col: i })));
  const edges = new Map(), verts = new Map();
  centers.forEach((c, ci) => {
    for (let k = 0; k < 6; k++) {
      const a = [c.x + HV[k][0], c.y + HV[k][1]], b = [c.x + HV[(k + 1) % 6][0], c.y + HV[(k + 1) % 6][1]];
      const ka = vkey(a), kb = vkey(b), ek = ka < kb ? ka + '|' + kb : kb + '|' + ka;
      let e = edges.get(ek);
      if (!e) { e = { a, b, ka, kb, hexes: [] }; edges.set(ek, e); }
      e.hexes.push(ci);
      [[ka, a], [kb, b]].forEach(([kk, p]) => {
        let v = verts.get(kk);
        if (!v) { v = { k: kk, x: p[0], y: p[1], hexes: new Set() }; verts.set(kk, v); }
        v.hexes.add(ci);
      });
    }
  });
  const E = [...edges.values()].map(e => {
    const mid = [(e.a[0] + e.b[0]) / 2, (e.a[1] + e.b[1]) / 2], len = Math.hypot(e.b[0] - e.a[0], e.b[1] - e.a[1]), vertical = Math.abs(e.a[0] - e.b[0]) < 1e-6;
    let n = null, cls = null;
    if (e.hexes.length === 1) {
      const c = centers[e.hexes[0]];
      let nx = mid[0] - c.x, ny = mid[1] - c.y;
      const m = Math.hypot(nx, ny);
      n = [nx / m, ny / m];
      cls = n[1] < -0.4 ? 'top' : n[1] > 0.4 ? 'bottom' : 'side';
    }
    return Object.assign(e, { mid, len, vertical, outer: e.hexes.length === 1, n, cls });
  });
  const V = [...verts.values()].map(v => Object.assign(v, { junction: v.hexes.size >= 3 }));
  const xs = [], ys = [];
  centers.forEach(c => { xs.push(c.x - HX, c.x + HX); ys.push(c.y - 0.58, c.y + 0.58); });
  return { centers, edges: E, verts: V, bbox: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) } };
}

/* ---- generic 5-tier baker ---- */

function bakeLandTheme(T, shape, tier, R, opts) {
  opts = opts || {};
  const sc = opts.scale || getBakeScale();
  const m = opts.mirrorX ? -1 : 1;
  const ground = opts.ground || T.groundCol;
  const clr = (opts.clear || []).map(p => [Math.min(p[0], p[1]), Math.max(p[0], p[1])]);
  const key = [T.id, shape, tier, R, m, ground, sc, JSON.stringify(clr), JSON.stringify(opts.clearTiles || [])].join('|');
  const cached = revisedLandCache.get(key); if (cached) return cached;

  const plan = T.plan(shape), G = plan.G, bb = G.bbox;
  const x0 = m > 0 ? bb.minX : -bb.maxX, x1 = m > 0 ? bb.maxX : -bb.minX;
  const mx = 0.75, top = T.top || 2.15, bot = 0.85;
  const W = Math.ceil((x1 - x0 + 2 * mx) * R), H = Math.ceil((bb.maxY - bb.minY + top + bot) * R);
  const ox = (-x0 + mx) * R, oy = (-bb.minY + top) * R, u = R * 0.075;

  const mk = () => {
    const cv = document.createElement('canvas');
    cv.width = Math.ceil(W * sc);
    cv.height = Math.ceil(H * sc);
    const g = cv.getContext('2d');
    g.scale(sc, sc);
    return [cv, g];
  };
  const [back, cb] = mk();
  T.ground(cb, G, R, ox, oy, m, ground, ({ A: 5101, B: 6202, C: 7303, D: 8404 })[shape]);
  const bridges = clr.map(([i, j]) => [G.centers[i], G.centers[j]]);
  const vis = plan.objs.filter(o => o.tier <= tier && tier <= o.maxT && !bridges.some(([a, c]) => westCapsuleHit(a, c, o.x, o.y, o.rho)) && !(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));
  const drawObj = (ctxTarget, o) => {
    const px = ox + m * o.x * R, py = oy + o.y * R, scU = u * (o.scale || 1);
    if (o.kind === 'overheadCableSpan' && o.p1 && o.p2) {
      const ax = ox + m * o.p1[0] * R, ay = oy + o.p1[1] * R - u * (o.z1 || 2.2);
      const bx = ox + m * o.p2[0] * R, by = oy + o.p2[1] * R - u * (o.z2 || 2.2);
      const mxC = (ax + bx) * 0.5, myC = (ay + by) * 0.5 + u * 0.34;
      ctxTarget.strokeStyle = 'rgba(28, 25, 23, 0.72)';
      ctxTarget.lineWidth = Math.max(1, u * 0.032);
      ctxTarget.beginPath();
      ctxTarget.moveTo(ax, ay);
      ctxTarget.quadraticCurveTo(mxC, myC, bx, by);
      ctxTarget.stroke();
      // Second lower slack wire
      ctxTarget.strokeStyle = 'rgba(217, 119, 6, 0.55)';
      ctxTarget.lineWidth = Math.max(0.8, u * 0.022);
      ctxTarget.beginPath();
      ctxTarget.moveTo(ax, ay + u * 0.14);
      ctxTarget.quadraticCurveTo(mxC, myC + u * 0.22, bx, by + u * 0.14);
      ctxTarget.stroke();
      return;
    }
    T.assets[o.kind].draw(ctxTarget, px, py, scU, o.v);
  };

  const sprites = vis.map(o => {
    const asset = T.assets[o.kind], base = u * (o.scale || 1);
    const reach = Math.max(asset.reach || 4, (asset.tall || 9) * 0.45);
    const span = [o.p1, o.p2].filter(Boolean).reduce((max, p) =>
      Math.max(max, Math.abs(p[0] - o.x) * R / 8, Math.abs(p[1] - o.y) * R / 4), 0);
    const unit = Math.max(base, base * reach / 8, span);
    return { x: m * o.x * R, y: o.y * R, unit, draw: (ctx, x, y) => {
      ctx.save();
      ctx.translate(x - (ox + m * o.x * R), y - (oy + o.y * R));
      drawObj(ctx,o);
      ctx.restore();
    }};
  });
  const front = document.createElement('canvas');
  front.width = front.height = 1;
  const frontRect = {x: 0, y: 0, w: 1, h: 1};
  const centers = G.centers.map(c => ({x: ox + m * c.x * R, y: oy + c.y * R, row: c.row}));
  return revisedLandCache.set(key, {back, front, frontRect, w: W, h: H, ox, oy, centers, sc, shape, tier, mirrorX: m < 0, sprites});
}

function westCapsuleHit(a, b, x, y, rho) {
  const A = LAND_KEEP.rx + rho * 0.55, B = LAND_KEEP.ry + rho * 0.28;
  const dx = b.x - a.x, dy = b.y - a.y, px = x - a.x, py = y - a.y;
  const q = dx * dx / (A * A) + dy * dy / (B * B);
  const t = Math.max(0, Math.min(1, (px * dx / (A * A) + py * dy / (B * B)) / q));
  const ex = (px - t * dx) / A, ey = (py - t * dy) / B;
  return ex * ex + ey * ey < 1;
}

/* ===== PAINTERLY TIER-5-FIRST OUTPOST COMPOSER (Peeled Layer-by-Layer Down to Tier 1) ===== */
const GALACTIC_PLAN_CACHE = {};

function getGalacticPlan(shape) {
  if (GALACTIC_PLAN_CACHE[shape]) return GALACTIC_PLAN_CACHE[shape];
  const G = landGeometry(shape), rng = mulberry(({ A: 3101, B: 4202, C: 5303, D: 6404 })[shape]);
  const placed = [], A = GALACTIC_ASSETS;
  const cx = G.centers.reduce((a, c) => a + c.x, 0) / G.centers.length;
  const cy = G.centers.reduce((a, c) => a + c.y, 0) / G.centers.length;

  const inLand = (x, y, pad = 1.07) => G.centers.some(c => hexInside(x - c.x, y - c.y, pad));
  const free = (x, y, rho) => G.centers.every(c => {
    const dx = (x - c.x) / (LAND_KEEP.rx + rho * 0.34), dy = (y - c.y) / (LAND_KEEP.ry + rho * 0.20);
    return dx * dx + dy * dy >= 1;
  });
  const clearOthers = (x, y, rho) => placed.every(o => {
    if (o.cat === 'wire') return true;
    return Math.hypot(x - o.x, (y - o.y) * 1.7) >= (rho + o.rho * (o.clear || 1)) * 0.50;
  });

  // Painterly placement helper: composes the full Tier 5 canvas first, assigning each feature to its peel tier (`minT`)
  const compose = (kind, x, y, minT, extra = {}) => {
    const D = A[kind];
    if (!D) return null;
    const sc = extra.scale || 1;
    const rho = D.rho * sc;
    const maxPad = extra.pad || ((D.cat === 'struct' || D.cat === 'ruin' || D.cat === 'hill') ? 0.98 : 1.06);
    for (let t = 0; t < 16; t++) {
      const px = x + (t ? (rng() - 0.5) * 0.14 * t : 0);
      const py = y + (t ? (rng() - 0.5) * 0.10 * t : 0);
      if (!inLand(px, py, maxPad) || !free(px, py, rho) || !clearOthers(px, py, rho)) continue;
      if ((D.cat === 'tree' || D.cat === 'shrub' || D.cat === 'prop') && placed.some(o => o.noSouth && Math.abs(px - o.x) < 0.22 && py - o.y > -0.05 && py - o.y < 0.28)) continue;
      const o = Object.assign({
        kind,
        x: px,
        y: py,
        rho,
        scale: sc,
        v: extra.v != null ? extra.v : Math.floor(rng() * 1000),
        cat: D.cat,
        tier: minT,
        minT,
        maxT: 5
      }, extra);
      placed.push(o);
      return o;
    }
    return null;
  };

  const outer = G.edges.filter(e => e.outer), top = outer.filter(e => e.cls === 'top'), sides = outer.filter(e => e.cls === 'side'), interior = G.edges.filter(e => !e.outer);
  const onEdge = (e, t, off) => [e.a[0] + (e.b[0] - e.a[0]) * t + e.n[0] * off, e.a[1] + (e.b[1] - e.a[1]) * t + e.n[1] * off];

  // =========================================================================
  // LAYER 1 (Back Horizon + Mid-Town & Lower Outcrops): TOWERING PETRIFIED BLACK SPIRES & CRAGS
  // =========================================================================
  {
    const topPts = [];
    top.forEach(e => [0.08, 0.28, 0.48, 0.68, 0.88].forEach(t => topPts.push(onEdge(e, t, -0.14))));
    topPts.sort((a, b) => a[0] - b[0]);
    const spireDefs = [
      ['petrifiedSpire', 1, 1.35, 1],
      ['canyonCrag',     1, 1.22, 2],
      ['petrifiedSpire', 1, 1.48, 3],
      ['petrifiedSpire', 2, 1.32, 4],
      ['canyonCrag',     2, 1.20, 5],
      ['petrifiedSpire', 3, 1.40, 6],
      ['canyonCrag',     3, 1.24, 7],
      ['petrifiedSpire', 4, 1.34, 8],
      ['canyonCrag',     4, 1.20, 9]
    ];
    spireDefs.forEach(([kind, mt, sc, vSeed], idx) => {
      const slot = topPts[idx % topPts.length];
      if (!slot) return;
      const jitterX = (idx >= topPts.length ? 0.22 : 0) + (rng() - 0.5) * 0.14;
      const jitterY = 0.04 + (rng() - 0.5) * 0.06;
      compose(kind, slot[0] + jitterX, slot[1] + jitterY, mt, { scale: sc, clear: 0.68, noSouth: true, v: vSeed * 17 });
    });

    // Dramatic Black Spire & Canyon Crag rock outcrops sprouting throughout the middle, sides & lower plazas!
    const innerRockSpots = [
      ...interior.filter(e => !e.vertical).map(e => [e.mid[0], e.mid[1]]),
      ...sides.map(e => onEdge(e, 0.45, -0.05)),
      ...outer.filter(e => e.cls === 'bottom').map(e => onEdge(e, 0.5, -0.05))
    ];
    innerRockSpots.forEach(([rx, ry], idx) => {
      compose(idx % 3 === 0 ? 'petrifiedSpire' : 'canyonCrag', rx, ry, (idx % 4) + 1, {
        scale: idx % 3 === 0 ? 0.88 : 1.02,
        clear: 0.72,
        noSouth: true,
        v: (idx + 5) * 23
      });
    });
  }

  // =========================================================================
  // LAYER 2 (Architectural Heart — Full Campus Coverage): GRAND BATUU COMPOUNDS & TOWERS
  // =========================================================================
  const junctions = G.verts.filter(v => v.junction).sort((a, b) => b.y - a.y || a.x - b.x);
  const vertEdges = interior.filter(e => e.vertical).sort((a, b) => b.mid[1] - a.mid[1] || a.mid[0] - b.mid[0]);
  const diagEdges = interior.filter(e => !e.vertical).sort((a, b) => b.mid[1] - a.mid[1]);
  const rimAnchors = [];
  outer.filter(e => e.cls === 'bottom').concat(sides).forEach(e => [0.28, 0.72].forEach(t => rimAnchors.push(onEdge(e, t, -0.05))));

  const buildingRoster = [
    ['batuuRotunda',      1, 1.24, 0],
    ['batuuArchComplex',  1, 1.22, 1],
    ['batuuCantinaHall',  1, 1.20, 2],
    ['tatooineHomestead', 1, 1.22, 3],
    ['batuuSiloTower',    2, 1.24, 0],
    ['batuuRotunda',      2, 1.20, 2],
    ['batuuArchComplex',  2, 1.22, 1],
    ['tatooineHomestead', 2, 1.20, 0],
    ['batuuCantinaHall',  3, 1.22, 3],
    ['batuuSiloTower',    3, 1.24, 1],
    ['batuuRotunda',      3, 1.18, 3],
    ['batuuArchComplex',  3, 1.20, 2],
    ['tatooineHomestead', 4, 1.20, 1],
    ['batuuSiloTower',    4, 1.22, 3],
    ['batuuRotunda',      4, 1.20, 1],
    ['batuuCantinaHall',  4, 1.18, 0],
    ['batuuArchComplex',  5, 1.22, 3],
    ['batuuRotunda',      5, 1.20, 2],
    ['tatooineHomestead', 5, 1.18, 0],
    ['batuuSiloTower',    5, 1.22, 1]
  ];

  // Prioritize middle, side, and lower junctions/rims so the whole campus is rich with Batuu compounds!
  const archSpots = [];
  const maxLen = Math.max(junctions.length, vertEdges.length, rimAnchors.length, diagEdges.length);
  for (let i = 0; i < maxLen; i++) {
    if (junctions[i])  archSpots.push([junctions[i].x, junctions[i].y]);
    if (rimAnchors[i]) archSpots.push(rimAnchors[i]);
    if (vertEdges[i])  archSpots.push([vertEdges[i].mid[0], vertEdges[i].mid[1]]);
    if (diagEdges[i])  archSpots.push([diagEdges[i].mid[0], diagEdges[i].mid[1]]);
  }

  const placedBuildings = [];
  buildingRoster.forEach(([bKind, mt, sc, facing], idx) => {
    for (let attempt = 0; attempt < archSpots.length; attempt++) {
      const spot = archSpots[(idx + attempt) % archSpots.length];
      if (!spot) continue;
      const bo = compose(bKind, spot[0], spot[1], mt, {
        scale: sc,
        clear: 1.05,
        noSouth: true,
        v: (idx * 12) + facing
      });
      if (bo) { placedBuildings.push(bo); break; }
    }
  });

  // Add tall Batuu Spire Beacon Towers paired next to rotundas/cantinas across upper, middle & lower zones
  placedBuildings.filter(b => b.kind === 'batuuRotunda' || b.kind === 'batuuCantinaHall').slice(0, 4).forEach((anchor, idx) => {
    for (const [dx, dy] of [[0.36, -0.05], [-0.36, -0.05], [0.30, 0.08], [-0.30, 0.08]]) {
      const tow = compose('spireBeaconTower', anchor.x + dx, anchor.y + dy, idx < 2 ? 3 : 4, { scale: 1.16, clear: 1.15, noSouth: true });
      if (tow) { placedBuildings.push(tow); break; }
    }
  });

  // Connect nearby Batuu buildings with sagging overhead spaceport power cables
  for (let i = 0; i < placedBuildings.length; i++) {
    for (let j = i + 1; j < placedBuildings.length; j++) {
      const b1 = placedBuildings[i], b2 = placedBuildings[j];
      const dist = Math.hypot(b1.x - b2.x, (b1.y - b2.y) * 1.5);
      if (dist > 0.35 && dist < 1.25) {
        placed.push({
          kind: 'overheadCableSpan',
          x: (b1.x + b2.x) * 0.5,
          y: (b1.y + b2.y) * 0.5,
          p1: [b1.x, b1.y],
          p2: [b2.x, b2.y],
          z1: 2.35,
          z2: 2.35,
          rho: 0.01,
          scale: 1,
          v: i * 17 + j,
          cat: 'wire',
          tier: Math.max(b1.minT, b2.minT, 3),
          minT: Math.max(b1.minT, b2.minT, 3),
          maxT: 5
        });
        break;
      }
    }
  }

  // =========================================================================
  // LAYER 3 (Canyon Arches & Geothermal Oasis Pools): Mid & Lower Focal Landmarks
  // =========================================================================
  const oasisSpots = [
    ...diagEdges.map(e => [e.mid[0], e.mid[1]]),
    ...rimAnchors
  ];
  [
    ['desertOasisPool',     2, 1.05],
    ['canyonSandstoneArch', 2, 1.05],
    ['desertOasisPool',     3, 1.02],
    ['canyonSandstoneArch', 4, 1.05]
  ].forEach(([lKind, mt, sc], idx) => {
    for (let a = 0; a < oasisSpots.length; a++) {
      const sp = oasisSpots[(idx * 3 + a) % oasisSpots.length];
      if (!sp) continue;
      if (compose(lKind, sp[0], sp[1], mt, { scale: sc, clear: 1.05, noSouth: true })) break;
    }
  });

  // =========================================================================
  // LAYER 4 (Spaceport Equipment & Bazaar Stalls): Vaporators, Dishes, Fuel Tanks & Stalls
  // =========================================================================
  const techRoster = ['bazaarStall', 'moistureVaporator', 'commsRelayDish', 'fuelCellCluster'];
  const techSpots = [
    ...interior.map(e => [e.mid[0], e.mid[1]]),
    ...outer.map(e => onEdge(e, 0.5, -0.05)),
    ...G.verts.filter(v => !v.junction).map(v => [v.x, v.y])
  ];
  techSpots.forEach(([tx, ty], idx) => {
    const kind = techRoster[idx % techRoster.length];
    const mt = (idx % 5) + 1;
    compose(kind, tx, ty, mt, { scale: 1.06, clear: 0.78, noSouth: true });
  });

  // =========================================================================
  // LAYER 5 (Dark-Blue Alien Trees): Lush Pockets Framing Buildings & Rocks Everywhere
  // =========================================================================
  const treeSpecies = ['indigoCanopyTree', 'cobaltWeepingTree', 'midnightConifer'];
  const treeCandidates = [
    ...G.verts.map(v => [v.x, v.y]),
    ...interior.map(e => [e.mid[0], e.mid[1]]),
    ...outer.flatMap(e => [onEdge(e, 0.25, -0.05), onEdge(e, 0.75, -0.05)])
  ];
  treeCandidates.forEach(([tx, ty], idx) => {
    const kind = treeSpecies[idx % treeSpecies.length];
    const mt = (idx % 5) + 1;
    compose(kind, tx + (rng() - 0.5) * 0.14, ty + (rng() - 0.5) * 0.10, mt, {
      scale: 0.92 + (idx % 3) * 0.16,
      clear: 0.68
    });
  });

  // =========================================================================
  // LAYER 6 (Bigger Rocks, Agave Scrub, Droids & Crates Around Every Hex Perimeter)
  // =========================================================================
  G.centers.forEach((c, cIdx) => {
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2 + cIdx * 0.65;
      const px = c.x + Math.cos(a) * HX * 0.80;
      const py = c.y + Math.sin(a) * 0.48;
      // More and much bigger rocks mixed with dark-blue trees and agave scrub
      const kind = k < 4 ? 'crateredRock' : (k === 4 ? treeSpecies[cIdx % 3] : 'agaveCluster');
      const mt = (k % 5) + 1;
      const sc = kind === 'crateredRock' ? (1.35 + (k % 3) * 0.22) : 1.02;
      compose(kind, px, py, mt, { scale: sc, clear: 0.66 });
    }
  });

  const propRoster = ['cargoCrates', 'powerDroid', 'outpostBeacon', 'plasmaConduit'];
  outer.forEach((e, idx) => {
    [0.25, 0.75].forEach((tPos, sub) => {
      const p = onEdge(e, tPos, -0.04);
      const kind = propRoster[(idx + sub) % propRoster.length];
      const mt = ((idx + sub) % 4) + 1;
      compose(kind, p[0], p[1], mt, { scale: 1.08, clear: 0.65 });
    });
  });

  // Sort back-to-front by Y depth & assign front/back occlusion layer
  placed.forEach(o => {
    const over = G.centers.filter(c => Math.abs(o.x - c.x) < 1.0);
    o.layer = over.length && o.y > Math.max(...over.map(c => c.y)) + 0.05 ? 'front' : 'back';
  });
  placed.sort((a, b) => a.y - b.y);
  return (GALACTIC_PLAN_CACHE[shape] = { G, objs: placed, rng });
}

/* ---- Warm Sunlit Tatooine/Batuu Desert Ground (Golden Sand Dunes, Flagstone Plazas & Canyon Shadows) ---- */
function galacticGround(c, G, R, ox, oy, m, col, seed) {
  const poly = i => HV.map(v => [ox + m * (G.centers[i].x + v[0]) * R, oy + (G.centers[i].y + v[1]) * R]);
  const r = mulberry(seed), outer = G.edges.filter(e => e.outer), P = p => [ox + m * p[0] * R, oy + p[1] * R];

  c.save();
  c.lineJoin = 'round';
  c.lineCap = 'round';
  for (let i = 1; i <= 6; i++) {
    c.globalAlpha = 0.11 - i * 0.014;
    c.strokeStyle = col;
    c.lineWidth = R * 0.06 * i;
    c.beginPath();
    outer.forEach(e => { const a = P(e.a), b = P(e.b); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); });
    c.stroke();
  }
  c.globalAlpha = 1;
  G.centers.forEach((_, i) => TH.poly(c, poly(i), col, col, 2));

  c.save();
  c.beginPath();
  G.centers.forEach((_, i) => {
    poly(i).forEach((p, k) => k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
    c.closePath();
  });
  c.clip();

  const bx = [ox + Math.min(m * G.bbox.minX, m * G.bbox.maxX) * R, oy + G.bbox.minY * R, (G.bbox.maxX - G.bbox.minX) * R, (G.bbox.maxY - G.bbox.minY) * R];
  const pt = () => [bx[0] + r() * bx[2], bx[1] + r() * bx[3]];
  const soft = (x, y, rx, ry, rgb, a) => {
    c.save();
    c.translate(x, y);
    c.scale(1, ry / rx);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, `rgba(${rgb},${a})`);
    g.addColorStop(0.6, `rgba(${rgb},${a * 0.55})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    c.fillStyle = g;
    c.beginPath();
    c.arc(0, 0, rx, 0, 7);
    c.fill();
    c.restore();
  };

  // Warm sun-drenched golden Tatooine sand & terracotta-ochre canyon washes (no longer cold/grey!)
  for (let k = 0; k < 52; k++) {
    const p = pt(), w = R * (0.45 + r() * 0.90);
    soft(p[0], p[1], w, w * 0.4, r() < 0.58 ? '245, 206, 148' : '184, 118, 72', r() < 0.58 ? 0.28 : 0.22);
  }
  // Cool slate-indigo canyon shadow pockets near the upper ridge
  for (let k = 0; k < 14; k++) {
    const p = pt(), w = R * (0.30 + r() * 0.48);
    soft(p[0], p[1], w, w * 0.4, '76, 82, 104', 0.16);
  }
  // Wind-swept desert sand dune ripples
  c.strokeStyle = 'rgba(254, 235, 198, 0.34)';
  c.lineWidth = Math.max(1, R * 0.015);
  for (let k = 0; k < 22; k++) {
    const p = pt(), len = R * (0.28 + r() * 0.35);
    c.beginPath();
    c.moveTo(p[0] - len * 0.5, p[1]);
    c.quadraticCurveTo(p[0], p[1] - R * 0.04, p[0] + len * 0.5, p[1] + R * 0.02);
    c.stroke();
  }
  // Warm sandstone bazaar flagstones & pebbles
  for (let k = 0; k < 48; k++) {
    const p = pt();
    TH.ell(c, p[0], p[1], R * (0.024 + r() * 0.016), R * 0.013, k % 2 ? 'rgba(232, 204, 168, 0.56)' : 'rgba(138, 92, 62, 0.52)');
  }

  c.restore();
  c.restore();
}

const GALACTIC_THEME = { id: 'galactic', assets: GALACTIC_ASSETS, plan: getGalacticPlan, ground: galacticGround, groundCol: '#cda372', top: 2.25 };
const GALACTIC_TIER_NAMES = ['Sparse', 'Light', 'Medium', 'Heavy', 'Immersive'];
function bakeLandGalactic(shape, tier, R, opts) { return bakeLandTheme(GALACTIC_THEME, shape, tier, R, opts); }
function drawLandGalacticBack(ctx, x, y, land) { ctx.drawImage(land.back, x - land.ox, y - land.oy, land.w, land.h); }
function drawLandGalacticFront(ctx, x, y, land) { const r = land.frontRect; ctx.drawImage(land.front, x - land.ox + r.x, y - land.oy + r.y, r.w, r.h); }
function landGalacticSlots(land, R) { return land.centers.map(c => ({ x: c.x, y: c.y, rx: LAND_KEEP.rx * R, ry: LAND_KEEP.ry * R })); }
return Object.freeze({ bake: (shape, tier, radius, opts) => bakeLandGalactic(shape, tier === 4 ? 5 : tier, radius, opts), drawBack: drawLandGalacticBack, drawFront: (ctx, x, y, land) => land.sprites.slice().sort((a,b) => a.y-b.y).forEach(s => drawScenicSprite(ctx,s,x+s.x,y+s.y)) });
})(),
  babylon: (() => {
/* ===== THEME PACK CORE (shared by every theme pack; copy once into engine.js) ===== */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shade(hex, amt){let r,g,b;if(hex[0]==='r'){const m=hex.match(/[\d.]+/g);r=+m[0];g=+m[1];b=+m[2];}else{const n=parseInt(hex.slice(1),16);r=n>>16;g=(n>>8)&255;b=n&255;}const f=c=>Math.round(amt<0?c*(1+amt):c+(255-c)*amt);return `rgb(${f(r)},${f(g)},${f(b)})`;}
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


/* ===== SHARED HELPERS FOR THE ANCIENT PACKS ===== */
const NT=5;                                                         /* five scenery tiers in these packs */
const FLIP=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
const BX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.28),shade(col,0.16));
const SHD=(c,x,y,rx,rgb)=>{c.fillStyle='rgba('+(rgb||'70,44,18')+',.26)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const SOFT=(c,x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
const segDist=(x,y,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy;let t=l?((x-a[0])*dx+(y-a[1])*dy)/l:0;t=Math.max(0,Math.min(1,t));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);};
/* an irregular amoeba outline (closed polygon, game units) from a few random harmonics; rx, ry are the maximum half-extents */
function amoeba(cx,cy,rx,ry,seed,n,amp){amp=amp||1;const r=mulberry(seed),h=[[2,(0.2+r()*0.14)*amp,r()*6.28],[3,(0.14+r()*0.12)*amp,r()*6.28],[5,(0.07+r()*0.06)*amp,r()*6.28]],pts=[];n=n||28;let mx=0;const rad=[];for(let k=0;k<n;k++){const a=k/n*6.2832;let q=1;h.forEach(([f,amp,ph])=>q+=amp*Math.sin(f*a+ph));rad.push(q);mx=Math.max(mx,q);}
  for(let k=0;k<n;k++){const a=k/n*6.2832,q=rad[k]/mx;pts.push([cx+Math.cos(a)*rx*q,cy+Math.sin(a)*ry*q]);}return pts;}
function pathPoly(c,pts,close){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));if(close!==false)c.closePath();}
function smoothClosed(c,pts){const n=pts.length;c.beginPath();for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n],m=[(a[0]+b[0])/2,(a[1]+b[1])/2];if(i===0){const l=pts[n-1],m0=[(l[0]+a[0])/2,(l[1]+a[1])/2];c.moveTo(m0[0],m0[1]);}c.quadraticCurveTo(a[0],a[1],m[0],m[1]);}c.closePath();}
const inPoly=(p,x,y)=>{let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;};

/* ===== PLANNER TOOLKIT (shared by Egypt and Babylon): placement rules, tier assignment, layering ===== */
function planKit(shape,seed,T){
  const G=landGeometry(shape),rng=mulberry(seed),placed=[],bb=G.bbox,used={},A=T.assets;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),bottoms=outer.filter(e=>e.cls==='bottom'),interior=G.edges.filter(e=>!e.outer);
  const LKS=G.centers.length/12,landCnt=n=>Math.max(1,Math.round(n*LKS)),landThin=l=>{const n=Math.max(1,Math.round(l.length*LKS));return Array.from({length:n},(_,i)=>l[Math.floor((i+0.5)*l.length/n)]);};
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  const K={G,rng,placed,used,bb,cx,cy,outer,top,sides,bottoms,interior,LKS,landCnt,landThin,onEdge,obstacles:[]};
  K.inLand=T.inLand?T.inLand(G,K):(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  K.free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;})&&K.obstacles.every(f=>f(x,y,rho));
  K.clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.72);
  K.pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return Object.keys(w)[0];};
  K.capOk=k=>!(T.cap&&T.cap[k]&&(used[k]||0)>=Math.max(1,Math.round(T.cap[k]*(T.capScale?LKS:1))));
  K.regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?T.region.top:n<0.68?T.region.mid:T.region.bottom;};
  K.place=(kind,x,y,extra)=>{const D=A[kind];if(!D)throw new Error('unknown asset '+kind);const mul=D.cat==='tree'?(T.treeMul||1):D.cat==='shrub'?(T.shrubMul||1):1,sc=((extra&&extra.scale)||(D.cat==='tree'?0.88+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1))*mul,rho=D.rho*sc;
    for(let t=0;t<8;t++){const jit=!(extra&&extra.fixed)&&t,px=x+(jit?(rng()-0.5)*0.12*t:0),py=y+(jit?(rng()-0.5)*0.09*t:0);if(!K.inLand(px,py)||!K.free(px,py,rho)||!K.clearOthers(px,py,rho))continue;
      if((D.cat==='rock'||D.cat==='shrub'||D.cat==='prop')&&placed.some(o=>o.noSouth&&Math.abs(px-o.x)<0.3&&py-o.y>-0.05&&py-o.y<0.36))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:9},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  K.tree=(x,y,extra,dom,low)=>{if(low&&T.low){const L=T.low[Math.floor(rng()*T.low.length)];return K.place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return K.place(dom&&rng()<0.55&&K.capOk(dom)?dom:K.pickFrom(K.regionOf(y),K.capOk),x,y,extra||{});};
  K.under=(x,y,extra)=>K.place(T.under[Math.floor(rng()*T.under.length)],x,y,extra||{});
  /* farthest-point spacing so structures never clump */
  K.chosen=[];
  K.spread=(k,pool,extra)=>{const ranked=pool.map(p=>({p,d:Math.min(1e9,...K.chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.22})).sort((a,b)=>b.d-a.d);for(let n=0;n<Math.min(14,ranked.length);n++){const o=K.place(k,ranked[n].p[0],ranked[n].p[1],extra);if(o){K.chosen.push([o.x,o.y]);return o;}}return null;};
  /* shared finishing: assign each object its tier, keep trees dominant where asked, set front/back layers, sort */
  K.finish=(cuts,opts)=>{opts=opts||{};
    placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<NT&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.fixedTier)o.tier=o.minT;});
    const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
    if(opts.treeShare)for(let t=1;t<=NT;t++){let guard=0;while(guard++<400){const c=count(t);if(c.tr/Math.max(1,c.n)>=opts.treeShare)break;const pool=placed.filter(o=>o.tier<=t&&t<=o.maxT&&!o.fixedTier),cand=(pool.filter(o=>o.cat==='shrub').sort((a,b)=>b.pri-a.pri)[0])||(pool.filter(o=>o.prop&&o.minT>1).sort((a,b)=>b.pri-a.pri)[0]);if(!cand)break;cand.tier=Math.min(NT,cand.tier+1);}}
    placed.forEach(o=>{if(o.layer)return;const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
    placed.sort((a,b)=>a.y-b.y);return placed;};
  return K;
}

/* ===== GENERIC BAKER (any theme object {id, assets, plan, ground, groundCol, top}); tiers 1..5 ===== */

function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol,clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]),key=[T.id,shape,tier,R,m,ground,sc,JSON.stringify(clr),JSON.stringify(opts.clearTiles||[])].join('|');const cached=revisedLandCache.get(key);if(cached)return cached;
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=T.mx||0.75,top=T.top||1.35,bot=T.bot||0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);return[cv,g];};
  const [back,cb]=mk();T.ground(cb,G,R,ox,oy,m,ground,({A:11,B:22,C:33,D:44})[shape],plan,tier);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]),vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho))&&!(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));
  const drw=(cx,o)=>{const A=T.assets[o.kind];if(A.drawEx)A.drawEx(cx,o,ox,oy,m,R,u);else A.draw(cx,ox+m*o.x*R,oy+o.y*R,u*(o.scale||1),o.v);};

  const sprites = vis.map(o => {
    const asset = T.assets[o.kind], base = u * (o.scale || 1);
    const reach = Math.max(asset.reach || 4, (asset.tall || 9) * 0.45);
    const span = [o.p1, o.p2].filter(Boolean).reduce((max, p) =>
      Math.max(max, Math.abs(p[0] - o.x) * R / 8, Math.abs(p[1] - o.y) * R / 4), 0);
    const unit = Math.max(base, base * reach / 8, span);
    return { x: m * o.x * R, y: o.y * R, unit, draw: (ctx, x, y) => {
      ctx.save();
      ctx.translate(x - (ox + m * o.x * R), y - (oy + o.y * R));
      drw(ctx,o);
      ctx.restore();
    }};
  });
  const front = document.createElement('canvas');
  front.width = front.height = 1;
  const frontRect = {x: 0, y: 0, w: 1, h: 1};
  const centers = G.centers.map(c => ({x: ox + m * c.x * R, y: oy + c.y * R, row: c.row}));
  return revisedLandCache.set(key, {back, front, frontRect, w: W, h: H, ox, oy, centers, sc, shape, tier, mirrorX: m < 0, sprites});
}
function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(x*0+((x-a.x)*dx/(A*A)+(y-a.y)*dy/(B*B)))/q)),ex=(x-a.x-t*dx)/A,ey=(y-a.y-t*dy)/B;return ex*ex+ey*ey<1;}

/* ===== EGYPT ASSET LIBRARY: golden desert, date palms, dunes, papyrus marshes, mud huts, obelisks and small monuments (NO pyramids: those are the facilities).
   draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R*scale, v = variant seed ===== */
const EG={sand:'#e2c068',sandD:'#c49a44',sandL:'#f0d98c',stone:'#d9bd86',stoneD:'#b99a62',stoneL:'#ecd9a8',mud:'#b58a58',mudD:'#8d6538',mudL:'#cca372',gold:'#e8b82a',turq:'#2fa59a',ochre:'#b9552f',palm:'#4f8a38',palmD:'#3a6e2c',palmL:'#7fb54a'};
const EGFROND=(c,x,y,ang,len,u,col,mid,droop,lf)=>{const ex=x+Math.cos(ang)*len,ey=y+Math.sin(ang)*len*0.55+len*(droop||0.4),mx=x+Math.cos(ang)*len*0.5,my=y+Math.sin(ang)*len*0.62-len*0.22;
  c.lineCap='round';c.strokeStyle=mid;c.lineWidth=u*0.16;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(mx,my,ex,ey);c.stroke();
  const n=lf||9;for(let k=1;k<=n;k++){const t=k/(n+1),q=1-t,px=q*q*x+2*q*t*mx+t*t*ex,py=q*q*y+2*q*t*my+t*t*ey,s=len*0.27*Math.sin(Math.PI*(0.12+t*0.8))*(1-t*0.35),dx=Math.cos(ang),sy=1;
    TH.ln(c,[px,py],[px-s*0.34+dx*s*0.1,py+s*0.62],col,u*0.17);TH.ln(c,[px,py],[px+s*0.34+dx*s*0.1,py+s*0.62],col,u*0.17);}};
/* jungle-style palm (arching fronds, coconuts): replaces the flat-crowned date palm in the Egypt land */
const EGJS=(c,x,y,rx)=>{c.fillStyle='rgba(12,40,22,.28)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const EGJFROND=(c,x,y,ang,len,u,col,mid,droop)=>{const ex=x+Math.cos(ang)*len,ey=y+Math.sin(ang)*len*0.6+len*(droop||0.35),mx=x+Math.cos(ang)*len*0.55,my=y+Math.sin(ang)*len*0.7-len*0.25;
  c.lineCap='round';c.strokeStyle=col;c.lineWidth=u*0.42;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(mx,my,ex,ey);c.stroke();c.strokeStyle=mid;c.lineWidth=u*0.1;c.stroke();
  for(let k=1;k<7;k++){const t=k/7,q=1-t,px=q*q*x+2*q*t*mx+t*t*ex,py=q*q*y+2*q*t*my+t*t*ey,s=len*0.2*(1-t*0.6);TH.ln(c,[px,py],[px+Math.sin(ang)*s*0.5-Math.cos(ang)*s*0.2,py+s*0.55],col,u*0.14);TH.ln(c,[px,py],[px-Math.sin(ang)*s*0.5-Math.cos(ang)*s*0.2,py+s*0.55],col,u*0.14);}};

const EGT={
  junglePalm:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*11+2),H=u*(5.2+r()*1.6),lean=(r()-0.5)*u*2.0;EGJS(c,x,y,u*1.3);c.lineCap='round';c.strokeStyle='#a08c68';c.lineWidth=u*0.62;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*0.1,y-H*0.5,x+lean,y-H);c.stroke();c.strokeStyle='#bba67e';c.lineWidth=u*0.2;c.beginPath();c.moveTo(x-u*0.15,y);c.quadraticCurveTo(x+lean*0.1-u*0.15,y-H*0.5,x+lean-u*0.1,y-H);c.stroke();
    for(let k=1;k<9;k++){const t=k/9,q=1-t,px=q*q*x+2*q*t*(x+lean*0.1)+t*t*(x+lean),py=q*q*y+2*q*t*(y-H*0.5)+t*t*(y-H);TH.ln(c,[px-u*0.32,py],[px+u*0.32,py+u*0.05],'rgba(60,40,20,.35)',u*0.06);}
    const cx=x+lean,cy=y-H;[-2.9,-2.35,-1.85,-1.3,-0.7,-0.2].forEach((a,i)=>{EGJFROND(c,cx,cy,a,u*(2.5+r()*0.5),u,i%2?'#2f7a3a':'#3a8a42','#8fcf6a',0.3);EGJFROND(c,cx,cy,Math.PI-a-Math.PI*1.0+Math.PI,u*(2.3+r()*0.5),u,i%2?'#3a8a42':'#2f7a3a','#8fcf6a',0.3);});[[-0.25,0.2],[0.25,0.25],[0,0.35]].forEach(([dx,dy])=>TH.ell(c,cx+dx*u,cy+dy*u,u*0.24,u*0.26,'#6b4a22'));}},
  datePalm:{cat:'tree',rho:0.07,tall:13,reach:5.5,draw(c,x,y,u,v){const r=mulberry(v*11+4),H=u*(6.8+r()*2.4),lean=(r()-0.5)*u*2.8,tw=u*0.55;SHD(c,x,y,u*1.4);
    const P=t=>{const q=1-t;return[q*q*x+2*q*t*(x+lean*0.12)+t*t*(x+lean),q*q*y+2*q*t*(y-H*0.55)+t*t*(y-H)];};const Lf=[],Rt=[];for(let k=0;k<=9;k++){const t=k/9,p=P(t),w=tw*(1-0.32*t)*0.5;Lf.push([p[0]-w,p[1]]);Rt.push([p[0]+w,p[1]]);}
    TH.poly(c,Lf.concat(Rt.reverse()),'#a98a56');c.strokeStyle='#cdb07a';c.lineWidth=u*0.14;c.beginPath();Lf.forEach((p,i)=>i?c.lineTo(p[0]+u*0.1,p[1]):c.moveTo(p[0]+u*0.1,p[1]));c.stroke();
    for(let k=1;k<12;k++){const p=P(k/12);TH.ln(c,[p[0]-u*0.26,p[1]+u*0.05],[p[0]+u*0.12,p[1]-u*0.07],'rgba(70,46,20,.4)',u*0.07);TH.ln(c,[p[0]+u*0.26,p[1]+u*0.05],[p[0]-u*0.1,p[1]-u*0.07],'rgba(70,46,20,.3)',u*0.06);}
    const cx=x+lean,cy=y-H,n=15;for(let i=0;i<n;i++){const a=-Math.PI*1.04+i/(n-1)*Math.PI*1.08+(r()-0.5)*0.12,l=u*(3.1+r()*0.8),dk=i%2;EGFROND(c,cx,cy,a,l,u*1.25,dk?EG.palmD:EG.palm,'#9fcf6a',0.4+0.24*Math.abs(Math.cos(a)),12);}
    for(let i=0;i<6;i++){const a=-Math.PI*0.92+i/5*Math.PI*0.84;EGFROND(c,cx,cy,a,u*(2.2+r()*0.4),u*1.15,EG.palmL,'#a8d874',0.12,9);}
    for(let k=0;k<5;k++)TH.ell(c,cx+(k-2)*u*0.2,cy+u*(0.22+Math.abs(k-2)*0.05),u*0.17,u*0.22,k%2?'#b4622a':'#8f4a1e');}},
  doumPalm:{cat:'tree',rho:0.08,tall:11,reach:5,draw(c,x,y,u,v){const r=mulberry(v*7+3),H1=u*(2.6+r()*0.8),H2=u*(2.4+r()*0.8),sx=u*(1.2+r()*0.6);SHD(c,x,y,u*1.5);const fan=(px,py,s)=>{for(let i=0;i<11;i++){const a=-Math.PI+0.1+i/10*(Math.PI-0.2),l=u*s*(1.5+r()*0.3);c.save();c.translate(px,py);c.rotate(a+Math.PI/2);TH.ell(c,0,-l*0.6,u*0.5*s,l*0.62,i%2?'#6fa83e':'#58903a');TH.ln(c,[0,0],[0,-l*1.18],'#a8d46e',u*0.06);c.restore();}};
    TH.ln(c,[x,y],[x,y-H1],'#9a7c4c',u*0.5);const bx=x,by=y-H1;TH.ln(c,[bx,by],[bx-sx,by-H2],'#9a7c4c',u*0.36);TH.ln(c,[bx,by],[bx+sx,by-H2*0.9],'#9a7c4c',u*0.36);TH.ell(c,bx,by,u*0.3,u*0.2,'#7a5e36');fan(bx-sx,by-H2,1.0);fan(bx+sx,by-H2*0.9,0.95);for(let k=0;k<3;k++)TH.ell(c,bx-sx+(k-1)*u*0.3,by-H2+u*0.4,u*0.22,u*0.25,'#7a4a24');}},
  sycamoreFig:{cat:'tree',rho:0.1,tall:9,reach:5.5,draw(c,x,y,u,v){const r=mulberry(v*13+1);SHD(c,x,y,u*2.6);TH.poly(c,[[x-u*0.55,y],[x-u*0.3,y-u*2.2],[x+u*0.3,y-u*2.2],[x+u*0.6,y]],'#7a5836');TH.ln(c,[x-u*0.1,y],[x-u*0.1,y-u*2.0],'#946f48',u*0.2);
    [[-1.6,-3.6,2.1,1.5],[1.7,-3.5,2.0,1.4],[0,-5.0,2.4,1.7],[-0.2,-3.3,2.5,1.5]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,rx*u,ry*u,['#4f8a3a','#5f9a40','#3f7a32','#6aa646'][i],r,9));}},
  papyrus:{cat:'shrub',rho:0.05,tall:7,reach:3,draw(c,x,y,u,v){const r=mulberry(v*5+2);SHD(c,x,y,u*1.4,'30,60,30');const n=7+Math.floor(r()*3);for(let k=0;k<n;k++){const bx=x+(k-n/2)*u*0.3+(r()-0.5)*u*0.2,H=u*(3.6+r()*2.2),ln=(r()-0.5)*u*0.8,col=k%2?'#7fa63a':'#97bc4a';TH.ln(c,[bx,y],[bx+ln,y-H],col,u*0.17);
      for(let j=0;j<9;j++){const a=-Math.PI*0.95+j/8*Math.PI*0.9;TH.ln(c,[bx+ln,y-H],[bx+ln+Math.cos(a)*u*0.9,y-H+Math.sin(a)*u*0.55+u*0.28],j%2?'#6e9632':'#8fb344',u*0.07);}}}},
  reeds:{cat:'shrub',rho:0.045,tall:5,reach:3,draw(c,x,y,u,v){const r=mulberry(v*3+7);SHD(c,x,y,u*1.2,'40,50,20');const n=9+Math.floor(r()*4);for(let k=0;k<n;k++){const bx=x+(k-n/2)*u*0.22+(r()-0.5)*u*0.15,H=u*(2.4+r()*1.8),ln=(r()-0.5)*u*0.7;TH.ln(c,[bx,y],[bx+ln,y-H],k%2?'#a9a24a':'#b8b45c',u*0.12);if(k%4===0){TH.ell(c,bx+ln,y-H-u*0.2,u*0.12,u*0.32,'#6b4a2a');}}}},
  dryScrub:{cat:'shrub',rho:0.05,tall:3,reach:2.6,draw(c,x,y,u,v){const r=mulberry(v*9+1);SHD(c,x,y,u*1.2);for(let k=0;k<10;k++){const a=-Math.PI*0.95+k/9*Math.PI*0.9,l=u*(0.9+r()*0.8);TH.ln(c,[x+(r()-0.5)*u*0.4,y],[x+Math.cos(a)*l,y+Math.sin(a)*l*0.8],k%3?'#a7a152':'#8c8a45',u*0.15);}TH.blob(c,x,y-u*0.3,u*0.9,u*0.45,'#98a050',r,7);}},
  tamarisk:{cat:'shrub',rho:0.06,tall:5,reach:3.2,draw(c,x,y,u,v){const r=mulberry(v*17+3);SHD(c,x,y,u*1.6);TH.ln(c,[x,y],[x-u*0.2,y-u*1.4],'#7a5a3a',u*0.3);for(let k=0;k<6;k++){const bx=x+(r()-0.5)*u*1.6,by=y-u*(1.3+r()*1.4);TH.blob(c,bx,by,u*(0.8+r()*0.4),u*(0.55+r()*0.25),k%2?'#8fb0a0':'#7da08f',r,8);if(k%2===0)TH.ell(c,bx+u*0.2,by-u*0.3,u*0.25,u*0.15,'#e8a0b4');}}},
  dune:{cat:'rock',rho:0.3,tall:4,reach:9,draw(c,x,y,u,v){const r=mulberry(v*5+3),W=u*(5.6+r()*3.0),Hh=u*(1.6+r()*1.0),cr=(r()-0.3)*W*0.35;
    c.fillStyle='rgba(150,98,34,.22)';c.beginPath();c.ellipse(x+W*0.2,y+Hh*0.1,W*1.02,Hh*0.3,0,0,7);c.fill();
    c.save();c.beginPath();c.moveTo(x-W,y+Hh*0.05);c.bezierCurveTo(x-W*0.55,y-Hh*0.1,x-W*0.3+cr,y-Hh*0.95,x+cr,y-Hh);c.bezierCurveTo(x+cr+W*0.18,y-Hh*1.04,x+W*0.5,y-Hh*0.42,x+W*0.92,y+Hh*0.04);c.quadraticCurveTo(x+W*0.1,y+Hh*0.3,x-W,y+Hh*0.05);c.closePath();
    const g=c.createLinearGradient(x-W,y-Hh,x+W*0.9,y+Hh*0.1);g.addColorStop(0,'#faebb4');g.addColorStop(0.45,'#ecc96c');g.addColorStop(1,'#b98a34');c.fillStyle=g;c.fill();c.clip();
    c.fillStyle='rgba(150,90,30,.52)';c.beginPath();c.moveTo(x+cr,y-Hh);c.bezierCurveTo(x+cr+W*0.18,y-Hh*1.04,x+W*0.5,y-Hh*0.42,x+W*0.92,y+Hh*0.04);c.lineTo(x+cr*0.4,y+Hh*0.3);c.bezierCurveTo(x+cr+W*0.02,y-Hh*0.3,x+cr+W*0.02,y-Hh*0.7,x+cr,y-Hh);c.closePath();c.fill();
    c.strokeStyle='rgba(130,86,30,.26)';c.lineWidth=u*0.08;for(let k=1;k<5;k++){c.beginPath();c.moveTo(x-W*0.95,y+Hh*(0.0+0.04*k));c.bezierCurveTo(x-W*0.4,y-Hh*(0.15+0.14*k),x+W*0.1,y-Hh*(0.28+0.1*k),x+W*0.85,y+Hh*0.02);c.stroke();}
    c.strokeStyle='rgba(255,250,220,.85)';c.lineWidth=u*0.16;c.beginPath();c.moveTo(x-W*0.6,y-Hh*0.28);c.bezierCurveTo(x-W*0.3+cr,y-Hh*0.86,x+cr-W*0.08,y-Hh*0.98,x+cr,y-Hh);c.stroke();c.restore();}},
  sandRocks:{cat:'rock',rho:0.08,tall:3,reach:3,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.7],[0.8,0.2,0.75,0.6],[0,-0.3,0.65,0.55]].forEach(([dx,dy,rx,ry],i)=>{const px=x+dx*u,py=y+dy*u,sx=u*rx,sy=u*ry*(1+r()*0.2),col=['#c6a06a','#b58d58','#d3b07a'][i];TH.ell(c,px+sx*0.15,py+sy*0.3,sx*1.05,sy*0.45,'rgba(80,50,20,.26)');TH.poly(c,[[px-sx,py],[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px-sx*0.6,py+sy*0.2]],col);TH.poly(c,[[px+sx*0.25,py-sy*0.98],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px+sx*0.2,py+sy*0.05]],shade(col,-0.28));TH.poly(c,[[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.1,py-sy*0.5],[px-sx*0.5,py-sy*0.45]],shade(col,0.2));});}},
  marsh:{cat:'water',rho:0.22,tall:2,reach:7,drawEx(c,o,ox,oy,m,R,u){this.draw(c,ox+m*o.x*R,oy+o.y*R,u,o.v,o.rx*R,o.ry*R);},draw(c,x,y,u,v,sx,sy){/* amoeba swamp pond; sx, sy = max half extents in px */ const r=mulberry(v*3+11),rx=sx||u*4.4,ry=sy||u*3.0,P=amoeba(x,y,rx,ry,v+31,36,1.4);
    /* a lush grass ring round the whole shore, fading into the sand */
    SOFT(c,x,y,rx*2.6,ry*2.2,'96,150,60',0.34);const Gp=k=>P.map(p=>[x+(p[0]-x)*k,y+(p[1]-y)*k]);smoothClosed(c,Gp(1.95));c.fillStyle='rgba(118,164,66,.68)';c.fill();smoothClosed(c,Gp(1.6));c.fillStyle='rgba(104,156,58,.9)';c.fill();smoothClosed(c,Gp(1.32));c.fillStyle='rgba(88,142,52,.9)';c.fill();
    for(let k=0;k<70;k++){const a=r()*6.283,rr=1.12+r()*0.85,gx=x+Math.cos(a)*rx*rr,gy=y+Math.sin(a)*ry*rr,h=u*(0.5+r()*0.5);for(let j=0;j<3;j++)TH.ln(c,[gx,gy],[gx+(j-1)*h*0.45,gy-h],['#6fa046','#86b856','#5a8e3e'][(k+j)%3],u*0.13);if(k%9===0)TH.ell(c,gx,gy-u*0.3,u*0.12,u*0.1,['#f6efe0','#f2c230','#e86aa8'][k%3]);}
    SOFT(c,x,y,rx*1.5,ry*1.5,'96,110,50',0.22);smoothClosed(c,P.map(p=>[x+(p[0]-x)*1.12,y+(p[1]-y)*1.12]));c.fillStyle='#8d7a48';c.fill();smoothClosed(c,P.map(p=>[x+(p[0]-x)*1.05,y+(p[1]-y)*1.05]));c.fillStyle='#6f7f43';c.fill();
    smoothClosed(c,P);const g=c.createRadialGradient(x-rx*0.2,y-ry*0.3,0,x,y,Math.max(rx,ry));g.addColorStop(0,'#7da57c');g.addColorStop(0.6,'#5f8a68');g.addColorStop(1,'#456f54');c.fillStyle=g;c.fill();
    c.save();smoothClosed(c,P);c.clip();for(let k=0;k<7;k++)TH.blob(c,x+(r()-0.5)*rx*1.4,y+(r()-0.5)*ry*1.3,u*(0.5+r()*0.6),u*(0.22+r()*0.2),'rgba(120,160,60,.55)',r,6);
    for(let k=0;k<6;k++){const px=x+(r()-0.5)*rx*1.2,py=y+(r()-0.5)*ry*1.1;TH.ell(c,px,py,u*0.42,u*0.2,'#4f8f45');if(k%2===0){TH.ell(c,px,py-u*0.06,u*0.17,u*0.1,k%4===0?'#f6f0e4':'#f0a6c0');}}
    c.strokeStyle='rgba(235,248,235,.4)';c.lineWidth=u*0.08;c.beginPath();c.ellipse(x-rx*0.1,y-ry*0.1,rx*0.55,ry*0.4,0,Math.PI*0.95,Math.PI*1.7);c.stroke();c.restore();}},
};

/* ---- Egypt part 2: monuments, huts and props ---- */
const EGCYL=(c,x,y,rx,ry,h,cols)=>{const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,cols[0]);g.addColorStop(0.55,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y);c.lineTo(x-rx,y-h);c.ellipse(x,y-h,rx,ry,0,Math.PI,0,false);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();c.fillStyle=cols[0];c.beginPath();c.ellipse(x,y-h,rx,ry,0,0,7);c.fill();c.fillStyle='rgba(255,255,255,.16)';c.beginPath();c.ellipse(x,y-h,rx*0.82,ry*0.8,0,0,7);c.fill();};
const EGTAPER=(c,I,cx,cy,b0,b1,z0,z1,col)=>{TH.poly(c,[I(cx-b0,cy+b0,z0),I(cx+b0,cy+b0,z0),I(cx+b1,cy+b1,z1),I(cx-b1,cy+b1,z1)],col);TH.poly(c,[I(cx+b0,cy-b0,z0),I(cx+b0,cy+b0,z0),I(cx+b1,cy+b1,z1),I(cx+b1,cy-b1,z1)],shade(col,-0.26));TH.poly(c,[I(cx-b1,cy-b1,z1),I(cx+b1,cy-b1,z1),I(cx+b1,cy+b1,z1),I(cx-b1,cy+b1,z1)],shade(col,0.18));};
const EGGLYPH=(c,I,face,u,r,n,z0,z1,span,col)=>{for(let k=0;k<n;k++){const t=k/(n-1||1),z=z0+(z1-z0)*t,w=span*(0.25+0.75*r()),a=face==='L'?I(-w,0.0,z):I(0,-w,z),b=face==='L'?I(w,0.0,z):I(0,w,z);TH.ln(c,a,b,col||'rgba(70,40,12,.5)',u*0.07);if(r()<0.5)TH.ell(c,face==='L'?I(-span*0.5+r()*span,0,z+0.12)[0]:I(0,-span*0.5+r()*span,z+0.12)[0],face==='L'?I(0,0,z+0.12)[1]:I(0,0,z+0.12)[1],u*0.07,u*0.07,col||'rgba(70,40,12,.5)');}};
const EGT2={
  obelisk:{cat:'ruin',rho:0.07,tall:14,reach:3.5,draw(c,x,y,u,v){const r=mulberry(v*7+1),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),H=7.4+r()*1.8,pink=v%3===0,col=pink?'#cf9279':'#e4cf9a',base='#c6ab74';SHD(c,x,y,u*1.9);
    BX(c,x,y,u,-0.9,0.9,-0.9,0.9,0,0.45,base);BX(c,x,y,u,-0.7,0.7,-0.7,0.7,0.45,0.8,shade(base,0.06));EGTAPER(c,I,0,0,0.5,0.3,0.8,H,col);
    TH.poly(c,[I(-0.3,0.3,H),I(0.3,0.3,H),I(0,0,H+1.1)],pink?'#e2b196':'#f2e0ae');TH.poly(c,[I(0.3,-0.3,H),I(0.3,0.3,H),I(0,0,H+1.1)],pink?'#b97a62':'#c9ae74');TH.poly(c,[I(-0.3,0.3,H),I(0.3,0.3,H),I(0,0,H+1.1)],null);
    const tip=[I(-0.1,0.1,H+0.75),I(0.1,0.1,H+0.75),I(0,0,H+1.1)];TH.poly(c,tip,'#f0c93a');
    EGGLYPH(c,(X,Y,Z)=>I(X*0.5+0,0.42-0.003*Z+0*Y,Z),'L',u,r,9,1.2,H-0.9,0.12,pink?'rgba(90,40,22,.5)':'rgba(96,64,24,.5)');}},
  sphinx:{cat:'ruin',rho:0.12,tall:7,reach:6,draw(c,x,y,u,v){const r=mulberry(v*5+9);SHD(c,x,y,u*3.8);FLIP(c,x,v&1,()=>{const st='#dcbb7c',sd='#b4905a',sl='#efd69e';
    TH.poly(c,[[x-u*4.4,y+u*0.05],[x+u*5.4,y+u*0.05],[x+u*4.9,y+u*0.5],[x-u*3.9,y+u*0.5]],'#bfa064');
    c.beginPath();c.moveTo(x-u*3.9,y);c.bezierCurveTo(x-u*4.2,y-u*1.2,x-u*3.5,y-u*2.2,x-u*2.3,y-u*2.1);c.bezierCurveTo(x-u*1.1,y-u*1.9,x+u*0.3,y-u*1.95,x+u*1.0,y-u*2.2);c.bezierCurveTo(x+u*1.4,y-u*2.9,x+u*1.5,y-u*3.3,x+u*1.7,y-u*3.9);c.lineTo(x+u*3.1,y-u*3.7);c.bezierCurveTo(x+u*3.0,y-u*3.0,x+u*2.7,y-u*2.4,x+u*2.7,y-u*1.8);c.lineTo(x+u*5.0,y-u*0.9);c.lineTo(x+u*5.0,y);c.closePath();
    const g=c.createLinearGradient(x-u*4,y-u*3,x+u*5,y);g.addColorStop(0,sl);g.addColorStop(0.55,st);g.addColorStop(1,sd);c.fillStyle=g;c.fill();
    c.strokeStyle='rgba(110,74,30,.35)';c.lineWidth=u*0.08;c.beginPath();c.moveTo(x-u*3.3,y-u*0.3);c.bezierCurveTo(x-u*3.0,y-u*1.4,x-u*2.2,y-u*1.6,x-u*1.6,y-u*0.5);c.stroke();c.beginPath();c.moveTo(x+u*2.8,y-u*1.6);c.lineTo(x+u*4.8,y-u*0.3);c.moveTo(x+u*3.6,y-u*1.1);c.lineTo(x+u*3.7,y);c.stroke();
    for(let k=0;k<3;k++)TH.ln(c,[x+u*(4.2+k*0.25),y-u*0.5],[x+u*(4.3+k*0.25),y],'rgba(110,74,30,.4)',u*0.07);
    const hx=x+u*2.45,hy=y-u*4.6;TH.poly(c,[[hx-u*0.9,hy-u*0.9],[hx+u*0.9,hy-u*0.9],[hx+u*1.25,hy+u*1.3],[hx+u*0.6,hy+u*1.15],[hx-u*0.6,hy+u*1.15],[hx-u*1.25,hy+u*1.3]],'#e8c14a');for(let k=0;k<5;k++)TH.ln(c,[hx-u*0.8+k*u*0.4,hy-u*0.85],[hx-u*1.1+k*u*0.55,hy+u*1.15],'#3a5fa0',u*0.13);
    TH.ell(c,hx+u*0.05,hy+u*0.1,u*0.58,u*0.72,st);TH.ell(c,hx+u*0.3,hy+u*0.0,u*0.07,u*0.09,'#3a2a14');TH.ln(c,[hx+u*0.1,hy+u*0.5],[hx+u*0.5,hy+u*0.5],'#8a5a30',u*0.09);TH.poly(c,[[hx-u*0.1,hy+u*0.7],[hx+u*0.3,hy+u*0.7],[hx+u*0.2,hy+u*1.5],[hx-u*0.1,hy+u*1.4]],'#3a5fa0');TH.ell(c,hx,hy-u*0.95,u*0.1,u*0.13,'#d9433b');});}},
  seatedStatue:{cat:'ruin',rho:0.1,tall:10,reach:4.5,draw(c,x,y,u,v){const r=mulberry(v*9+4),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),st='#d6b980',gold='#e8b82a';SHD(c,x,y,u*2.6);FLIP(c,x,v&1,()=>{BX(c,x,y,u,-1.6,1.6,-1.2,1.2,0,0.5,'#c2a56c');BX(c,x,y,u,-1.2,1.2,-0.9,0.9,0.5,2.3,st);BX(c,x,y,u,-0.9,0.9,-0.6,0.6,2.3,5.0,st);
    BX(c,x,y,u,-1.15,-0.55,0.55,1.35,2.3,3.0,shade(st,-0.06));BX(c,x,y,u,0.55,1.15,0.55,1.35,2.3,3.0,shade(st,-0.06));
    const hc=I(0,0,5.7),hx=hc[0],hy=hc[1];TH.poly(c,[[hx-u*0.6,hy-u*0.9],[hx+u*0.6,hy-u*0.9],[hx+u*1.0,hy+u*0.95],[hx+u*0.5,hy+u*0.8],[hx-u*0.5,hy+u*0.8],[hx-u*1.0,hy+u*0.95]],'#e8c14a');for(let k=0;k<5;k++)TH.ln(c,[hx-u*0.5+k*u*0.25,hy-u*0.85],[hx-u*0.8+k*u*0.4,hy+u*0.85],'#3a5fa0',u*0.1);TH.ell(c,hx,hy+u*0.1,u*0.42,u*0.55,st);TH.ell(c,hx+u*0.12,hy+u*0.02,u*0.05,u*0.07,'#3a2a14');TH.ln(c,I(-0.9,0.2,4.2),I(-0.9,0.2,2.9),gold,u*0.12);TH.ln(c,I(0.4,0.8,3.2),I(0.4,0.8,2.5),'#3a5fa0',u*0.1);});}},
  columnRuin:{cat:'ruin',rho:0.1,tall:10,reach:6,draw(c,x,y,u,v){const r=mulberry(v*3+8),st=['#e0c690','#c9ac76','#a98e5c'];SHD(c,x,y,u*4.2);
    BX(c,x,y,u,-4,4,-1,1,0,0.3,'#bfa268');
    [[-2.6,6.0],[0,7.2],[2.6,3.4]].forEach(([dx,h],i)=>{const px=x+dx*u,py=y-u*0.1;EGCYL(c,px,py,u*0.62,u*0.25,u*h,st);for(let k=1;k<5;k++)TH.ln(c,[px-u*0.62,py-u*h*k/5],[px+u*0.62,py-u*h*k/5],'rgba(60,36,10,.2)',u*0.06);
      if(h>5){const cy=py-u*h;TH.poly(c,[[px-u*0.55,cy],[px-u*0.95,cy-u*0.9],[px-u*0.45,cy-u*1.9],[px,cy-u*2.3],[px+u*0.45,cy-u*1.9],[px+u*0.95,cy-u*0.9],[px+u*0.55,cy]],'#d4b87c');TH.ln(c,[px,cy],[px,cy-u*2.2],'rgba(70,44,14,.35)',u*0.1);TH.ln(c,[px-u*0.6,cy-u*1.0],[px+u*0.6,cy-u*1.0],'#3a8a7a',u*0.22);}
      else{TH.poly(c,[[px-u*0.62,py-u*h],[px-u*0.3,py-u*h-u*0.5],[px+u*0.4,py-u*h-u*0.35],[px+u*0.62,py-u*h]],'#cdb078');}});
    BX(c,x,y,u,0.6,3.8,-0.7,0.7,0.3,1.1,'#c7aa72');}},
  stela:{cat:'ruin',rho:0.05,tall:7,reach:3,draw(c,x,y,u,v){const r=mulberry(v*5+5),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SHD(c,x,y,u*1.4);FLIP(c,x,v&1,()=>{BX(c,x,y,u,-0.9,0.9,-0.6,0.6,0,0.5,'#bda26a');BX(c,x,y,u,-0.55,0.55,-0.25,0.25,0.5,4.4,'#dcc690');
    const a=I(-0.55,0.25,3.6),b=I(0.55,0.25,3.6);TH.poly(c,[I(-0.4,0.26,0.9),I(0.4,0.26,0.9),I(0.4,0.26,3.5),I(-0.4,0.26,3.5)],'rgba(150,116,60,.45)');TH.ell(c,I(0,0.26,3.9)[0],I(0,0.26,3.9)[1],u*0.5,u*0.26,'#e8b82a');TH.ln(c,I(-0.5,0.26,3.9),I(-0.9,0.26,3.6),'#3a5fa0',u*0.1);TH.ln(c,I(0.5,0.26,3.9),I(0.9,0.26,3.6),'#3a5fa0',u*0.1);for(let k=0;k<5;k++)EGGLYPH(c,(X,Y,Z)=>I(X*0.6,0.27,Z),'L',u,r,2,1.2+k*0.45,1.2+k*0.45,0.28);
    });}},
  anubis:{cat:'ruin',rho:0.08,tall:8,reach:3.5,draw(c,x,y,u,v){const r=mulberry(v*3+1);SHD(c,x,y,u*2);FLIP(c,x,v&1,()=>{BX(c,x,y,u,-1.3,1.3,-0.9,0.9,0,1.2,'#cdb278');BX(c,x,y,u,-1.0,1.0,-0.7,0.7,1.2,1.5,'#bda26a');const k='#26262c';TH.poly(c,[[x-u*0.9,y-u*1.6],[x-u*0.7,y-u*3.4],[x-u*0.2,y-u*4.0],[x+u*0.5,y-u*3.9],[x+u*0.9,y-u*3.2],[x+u*1.0,y-u*1.6]],k);TH.poly(c,[[x+u*0.1,y-u*3.9],[x+u*0.6,y-u*4.5],[x+u*1.5,y-u*4.6],[x+u*1.9,y-u*4.2],[x+u*1.3,y-u*3.9],[x+u*0.8,y-u*3.5]],k);TH.poly(c,[[x+u*0.4,y-u*4.4],[x+u*0.5,y-u*5.6],[x+u*0.85,y-u*4.5]],k);TH.poly(c,[[x+u*0.9,y-u*4.5],[x+u*1.15,y-u*5.7],[x+u*1.3,y-u*4.4]],k);TH.ell(c,x+u*1.45,y-u*4.3,u*0.07,u*0.07,'#e8c14a');TH.poly(c,[[x-u*0.7,y-u*3.3],[x+u*0.9,y-u*3.2],[x+u*0.6,y-u*3.8],[x-u*0.4,y-u*3.9]],'#e8b82a');TH.ln(c,[x-u*0.55,y-u*1.6],[x-u*0.55,y-u*2.8],'#3a3a44',u*0.14);});}},
  shrine:{cat:'ruin',rho:0.11,tall:9,reach:5,draw(c,x,y,u,v){const r=mulberry(v*7+2),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SHD(c,x,y,u*3.2);FLIP(c,x,v&1,()=>{BX(c,x,y,u,-2.6,2.6,-2.0,2.0,0,0.5,'#bfa268');BX(c,x,y,u,-2.0,2.0,-1.5,1.5,0.5,0.9,'#cdb078');
    [[-1.6,1.1],[1.6,1.1],[-1.6,-1.1],[1.6,-1.1]].forEach(([X,Y],i)=>{if(Y<0&&false)return;const p=I(X,Y,0.9);EGCYL(c,p[0],p[1],u*0.3,u*0.13,u*3.0,['#e0c690','#c9ac76','#a98e5c']);TH.ell(c,p[0],p[1]-u*3.0,u*0.46,u*0.2,'#d4b87c');});
    BX(c,x,y,u,-2.2,2.2,-1.7,1.7,4.1,4.7,'#d7ba82');TH.poly(c,[I(-2.3,1.8,4.7),I(2.3,1.8,4.7),I(2.3,1.8,5.2),I(-2.3,1.8,5.2)],'#c2a36a');TH.poly(c,[I(-2.3,1.8,4.1),I(2.3,1.8,4.1),I(2.3,1.8,4.7),I(-2.3,1.8,4.7)],'#d0b178');for(let k=0;k<8;k++)TH.ln(c,I(-2+k*0.57,1.82,4.15),I(-2+k*0.57,1.82,4.65),'#3a8a7a',u*0.13);
    TH.poly(c,[I(-0.7,1.2,0.9),I(0.7,1.2,0.9),I(0.7,1.2,2.4),I(-0.7,1.2,2.4)],'#2a2018');TH.ell(c,I(0,0.6,1.5)[0],I(0,0.6,1.5)[1],u*0.3,u*0.38,'#e8b82a');});}},
  pylonGate:{cat:'ruin',rho:0.14,tall:11,reach:6,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SHD(c,x,y,u*4.4);FLIP(c,x,v&1,()=>{BX(c,x,y,u,-3.6,3.6,-0.9,0.9,0,0.3,'#bfa268');
    [-2.3,2.3].forEach(X=>{EGTAPER(c,I,X,0,1.25,0.95,0.3,7.2,'#d8bb82');TH.poly(c,[I(X-1.0,1.0,7.2),I(X+1.0,1.0,7.2),I(X+1.05,1.05,7.6),I(X-1.05,1.05,7.6)],'#c9ac76');for(let k=0;k<5;k++)TH.ln(c,I(X-0.6,1.06,1.6+k*1.1),I(X+0.6,1.06,1.6+k*1.1),'rgba(70,44,14,.34)',u*0.07);TH.poly(c,[I(X-0.4,1.05,0.4),I(X-0.4,1.05,0.6),I(X-0.4,1.05,6.8),I(X-0.5,1.05,6.8)],null);});
    BX(c,x,y,u,-1.15,1.15,-0.8,0.8,4.4,5.4,'#ccaf76');TH.poly(c,[I(-1.15,0.82,4.4),I(1.15,0.82,4.4),I(1.15,0.82,5.4),I(-1.15,0.82,5.4)],'#d4b77e');TH.ell(c,I(0,0.84,4.95)[0],I(0,0.84,4.95)[1],u*0.5,u*0.24,'#e8b82a');TH.poly(c,[I(-0.9,0.9,0.3),I(0.9,0.9,0.3),I(0.9,0.9,4.4),I(-0.9,0.9,4.4)],'#2a2018');TH.poly(c,[I(-2.9,1.0,6.7),I(-1.7,1.0,6.7),I(-1.7,1.0,7.0),I(-2.9,1.0,7.0)],null);});}},
  mudHut:{cat:'struct',rho:0.1,tall:7,reach:4,draw(c,x,y,u,v){const r=mulberry(v*9+1),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),w=1.5+(v%3)*0.25,d=1.3+((v>>2)%2)*0.25,h=2.1+r()*0.4;SHD(c,x,y,u*3.2);FLIP(c,x,v&1,()=>{
    BX(c,x,y,u,-w,w,-d,d,0,h,'#b98c5a');BX(c,x,y,u,-w-0.12,w+0.12,-d-0.12,d+0.12,h,h+0.28,'#c79d68');for(let k=0;k<6;k++){const X=-w+(k+0.5)*(2*w/6);TH.ell(c,I(X,d+0.12,h+0.12)[0],I(X,d+0.12,h+0.12)[1],u*0.1,u*0.1,'#6a4a2a');}
    for(let k=0;k<3;k++)TH.ln(c,I(-w,d+0.01,0.5+k*0.55),I(w,d+0.01,0.5+k*0.55),'rgba(80,50,22,.2)',u*0.07);
    const dx=-w*0.25;TH.poly(c,[I(dx-0.45,d+0.02,0),I(dx+0.45,d+0.02,0),I(dx+0.45,d+0.02,1.35),I(dx-0.45,d+0.02,1.35)],'#2c2016');TH.ell(c,I(dx,d+0.02,1.35)[0],I(dx,d+0.02,1.35)[1],u*0.46,u*0.22,'#2c2016');
    TH.poly(c,[I(w*0.35,d+0.02,1.0),I(w*0.7,d+0.02,1.0),I(w*0.7,d+0.02,1.45),I(w*0.35,d+0.02,1.45)],'#2c2016');
    if(v%2){TH.ln(c,I(w+0.1,-0.4,0),I(w+0.1,-0.4,h+0.9),'#7a5a36',u*0.16);TH.ln(c,I(w+0.1,0.5,0),I(w+0.1,0.5,h+0.9),'#7a5a36',u*0.16);for(let k=0;k<4;k++)TH.ln(c,I(w+0.1,-0.4,0.6+k*0.55),I(w+0.1,0.5,0.6+k*0.55),'#7a5a36',u*0.1);}
    else{const ax=I(-w*0.2,d+0.2,2.55);const aw=u*(1.6+r()*0.4);TH.poly(c,[[ax[0]-aw,ax[1]],[ax[0]+aw,ax[1]],[ax[0]+aw*0.8,ax[1]+u*0.7],[ax[0]-aw*0.8,ax[1]+u*0.7]],'#cfae6a');for(let k=0;k<5;k++)TH.ln(c,[ax[0]-aw*0.8+k*aw*0.4,ax[1]],[ax[0]-aw*0.7+k*aw*0.35,ax[1]+u*0.7],'#a88a4a',u*0.08);}
    });}},
  mudHutRound:{cat:'struct',rho:0.09,tall:7,reach:3.5,draw(c,x,y,u,v){const r=mulberry(v*5+3),rx=1.7*u,ry=0.85*u,h=1.8*u;SHD(c,x,y,u*3.2);FLIP(c,x,v&1,()=>{EGCYL(c,x,y,rx,ry,h,['#d0a46c','#b98c58','#8d6538']);
    c.fillStyle='#bd915c';c.beginPath();c.ellipse(x,y-h,rx,ry,0,Math.PI,0,false);c.bezierCurveTo(x+rx*0.8,y-h-u*1.9,x-rx*0.8,y-h-u*1.9,x-rx,y-h);c.closePath();const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,'#d6aa72');g.addColorStop(0.6,'#b98c58');g.addColorStop(1,'#8f693c');c.fillStyle=g;c.fill();
    for(let k=1;k<4;k++){c.strokeStyle='rgba(70,44,14,.22)';c.lineWidth=u*0.07;c.beginPath();c.ellipse(x,y-h-u*0.35*k,rx*(1-k*0.22),ry*(1-k*0.22),0,0.05,Math.PI-0.05);c.stroke();}
    TH.ell(c,x,y-h-u*1.15,u*0.2,u*0.12,'#7a5a36');const a=Math.PI/2+0.35,dx=x+Math.cos(a)*rx,dy=y+Math.sin(a)*ry;c.fillStyle='#2c2016';c.beginPath();c.moveTo(dx-u*0.45,dy);c.lineTo(dx-u*0.45,dy-u*0.9);c.quadraticCurveTo(dx,dy-u*1.5,dx+u*0.45,dy-u*0.9);c.lineTo(dx+u*0.45,dy);c.closePath();c.fill();});}},
  mudHutPair:{cat:'struct',rho:0.15,tall:7,reach:6,draw(c,x,y,u,v){const r=mulberry(v*11+6),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SHD(c,x,y,u*5.4);FLIP(c,x,v&1,()=>{
    BX(c,x,y,u,-3.4,3.4,0.9,1.1,0,0.7,'#c19463');BX(c,x,y,u,-3.4,-3.2,-1.2,1.1,0,0.7,'#c19463');BX(c,x,y,u,3.2,3.4,-1.2,1.1,0,0.7,'#b48858');
    BX(c,x,y,u,-3.0,-0.5,-1.2,0.5,0,2.2,'#b98c5a');BX(c,x,y,u,-3.1,-0.4,-1.3,0.6,2.2,2.5,'#c79d68');BX(c,x,y,u,0.8,2.9,-1.2,0.3,0,1.7,'#c09260');BX(c,x,y,u,0.7,3.0,-1.3,0.4,1.7,1.95,'#cda46f');
    TH.poly(c,[I(-2.2,0.52,0),I(-1.3,0.52,0),I(-1.3,0.52,1.4),I(-2.2,0.52,1.4)],'#2c2016');TH.poly(c,[I(1.4,0.32,0),I(2.2,0.32,0),I(2.2,0.32,1.2),I(1.4,0.32,1.2)],'#2c2016');
    TH.poly(c,[I(-0.4,1.12,0),I(0.4,1.12,0),I(0.4,1.12,0.9),I(-0.4,1.12,0.9)],'#2c2016');
    [[0.1,0.1],[0.5,-0.3]].forEach(([X,Y],i)=>{const p=I(X,Y+0.3,0);EGCYL(c,p[0],p[1],u*0.28,u*0.13,u*(0.9+i*0.3),['#c4683a','#a8532b','#7a3a1c']);});});}},
  shadoof:{cat:'prop',rho:0.07,tall:8,reach:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SHD(c,x,y,u*2.4);FLIP(c,x,v&1,()=>{BX(c,x,y,u,-0.9,-0.3,-0.4,0.4,0,3.6,'#b88c58');BX(c,x,y,u,0.3,0.9,-0.4,0.4,0,3.6,'#a97f4d');TH.ln(c,I(-1.0,0,3.2),I(1.0,0,3.2),'#5e4020',u*0.22);
    const p0=I(-3.6,0,4.5),p1=I(3.0,0,1.9),pv=I(0,0,3.2);TH.ln(c,p0,p1,'#6a4a28',u*0.26);TH.ell(c,p0[0]-u*0.1,p0[1]-u*0.05,u*0.55,u*0.5,'#9a7448');TH.ln(c,p1,[p1[0],p1[1]+u*1.6],'#4a3418',u*0.07);EGCYL(c,p1[0],p1[1]+u*2.5,u*0.38,u*0.16,u*0.8,['#a3643a','#8a4f2a','#6a3a1c']);});}},
  clayJars:{cat:'prop',rho:0.05,tall:3,reach:3,draw(c,x,y,u,v){SHD(c,x,y,u*1.6);[[-0.9,0.1,1.0],[0.0,-0.25,1.3],[0.95,0.1,0.9]].forEach(([dx,dy,s],i)=>{const px=x+dx*u,py=y+dy*u,rx=u*0.62*s,h=u*1.5*s;const g=c.createLinearGradient(px-rx,0,px+rx,0);g.addColorStop(0,'#d98a50');g.addColorStop(0.6,'#b8693a');g.addColorStop(1,'#84451f');c.fillStyle=g;c.beginPath();c.moveTo(px-rx*0.55,py-h);c.bezierCurveTo(px-rx*1.5,py-h*0.55,px-rx*1.1,py,px-rx*0.5,py);c.lineTo(px+rx*0.5,py);c.bezierCurveTo(px+rx*1.1,py,px+rx*1.5,py-h*0.55,px+rx*0.55,py-h);c.closePath();c.fill();TH.ell(c,px,py-h,rx*0.55,rx*0.22,'#7a3a18');TH.ln(c,[px-rx*1.1,py-h*0.55],[px+rx*1.1,py-h*0.55],i%2?'#3a8a7a':'#e8c14a',u*0.1);});}},
  reedBoat:{cat:'prop',rho:0.1,tall:4,reach:4,draw(c,x,y,u,v){SHD(c,x,y,u*3,'30,60,40');FLIP(c,x,v&1,()=>{TH.poly(c,[[x-u*3.2,y-u*1.1],[x-u*2.4,y-u*0.2],[x+u*2.2,y-u*0.15],[x+u*3.3,y-u*1.3],[x+u*2.0,y-u*0.55],[x-u*2.2,y-u*0.6]],'#b9aa5e');TH.poly(c,[[x-u*2.4,y-u*0.2],[x+u*2.2,y-u*0.15],[x+u*2.0,y+u*0.25],[x-u*2.1,y+u*0.3]],'#8f823c');for(let k=0;k<7;k++)TH.ln(c,[x-u*2.1+k*u*0.7,y-u*0.2],[x-u*2.0+k*u*0.7,y+u*0.28],'rgba(60,50,10,.4)',u*0.08);TH.ln(c,[x-u*0.5,y-u*0.4],[x+u*0.9,y-u*3.6],'#6a4a28',u*0.14);TH.ell(c,x+u*0.95,y-u*3.7,u*0.3,u*0.12,'#8a6a3a');});}},
  offeringTable:{cat:'prop',rho:0.06,tall:4,reach:3,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SHD(c,x,y,u*1.8);BX(c,x,y,u,-1.1,1.1,-0.7,0.7,0,0.9,'#cdb078');BX(c,x,y,u,-1.3,1.3,-0.9,0.9,0.9,1.15,'#d9bf88');TH.ell(c,I(-0.4,0,1.4)[0],I(-0.4,0,1.4)[1],u*0.35,u*0.18,'#a3643a');TH.ell(c,I(0.5,0.1,1.4)[0],I(0.5,0.1,1.4)[1],u*0.3,u*0.15,'#3a8a7a');TH.ell(c,I(0.05,-0.3,1.45)[0],I(0.05,-0.3,1.45)[1]-u*0.3,u*0.14,u*0.3,'#ff9a30');}},
};

/* ===== BABYLON ASSET LIBRARY (macro-land pieces): lush Mesopotamian foliage, blue-dyed mud huts, small monuments; the glazed-brick perimeter wall and gates are drawn by the planner ===== */
const BB={blue:'#2b63b7',blueD:'#1d4a92',blueL:'#4a82d4',gold:'#e3b436',white:'#efe6cf',mud:'#b48a5c',mudD:'#8a6238',sand:'#d8c07a'};
const BFOL=[['#2f6b3a','#3f8a45','#58a04f'],['#2b6a46','#3a8a58','#4fa56a'],['#3d7a34','#58a03f','#76b84e'],['#4a7a30','#69a043','#8cbb52']];
const BTREE={
  figTree:{cat:'tree',rho:0.1,tall:9,reach:5.5,draw(c,x,y,u,v){const r=mulberry(v*13+1),pal=BFOL[v&3];SHD(c,x,y,u*2.8,'20,50,24');TH.poly(c,[[x-u*0.6,y],[x-u*0.35,y-u*2.3],[x+u*0.35,y-u*2.3],[x+u*0.65,y]],'#6e5238');TH.ln(c,[x-u*0.12,y],[x-u*0.12,y-u*2.1],'#8a6a48',u*0.2);
    [[-1.7,-3.7,2.2,1.6],[1.8,-3.6,2.1,1.5],[0,-5.2,2.5,1.8],[-0.2,-3.4,2.6,1.6],[-2.4,-2.6,1.4,1.0],[2.5,-2.6,1.4,1.0]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,rx*u,ry*u,pal[i%3],r,9));
    for(let k=0;k<3;k++){const vx=x+(r()-0.5)*u*4,vy=y-u*(3+r()*1.2);TH.ln(c,[vx,vy],[vx+(r()-0.5)*u*0.3,vy+u*(1.0+r()*1.2)],'#4d8a3a',u*0.1);}
    for(let k=0;k<5;k++)TH.ell(c,x+(r()-0.5)*u*4,y-u*(2.8+r()*2),u*0.14,u*0.14,'#7a3a6a');}},
  poplar:{cat:'tree',rho:0.06,tall:12,reach:3.2,draw(c,x,y,u,v){const r=mulberry(v*7+3),H=u*(7.2+r()*2.2),pal=BFOL[(v>>1)&3];SHD(c,x,y,u*1.4,'20,50,24');TH.ln(c,[x,y],[x,y-H*0.3],'#7a6040',u*0.4);
    for(let k=0;k<7;k++){const t=k/6,cy=y-H*(0.22+0.72*t),w=u*(1.15-0.55*Math.pow(t-0.35,2)*1.6)*(1-t*0.35);TH.blob(c,x+(r()-0.5)*u*0.3,cy,Math.max(u*0.45,w),u*(1.05+r()*0.3),pal[k%3],r,8);}}},
  tamariskTree:{cat:'tree',rho:0.08,tall:9,reach:4.5,draw(c,x,y,u,v){const r=mulberry(v*17+3);SHD(c,x,y,u*2.2,'20,50,24');TH.ln(c,[x,y],[x-u*0.3,y-u*2.6],'#7a5a3a',u*0.4);TH.ln(c,[x-u*0.3,y-u*2.6],[x-u*1.1,y-u*3.8],'#7a5a3a',u*0.25);TH.ln(c,[x-u*0.3,y-u*2.6],[x+u*0.9,y-u*3.9],'#7a5a3a',u*0.25);
    for(let k=0;k<7;k++){const bx=x+(r()-0.5)*u*3.4,by=y-u*(3.0+r()*2.4);TH.blob(c,bx,by,u*(0.95+r()*0.5),u*(0.65+r()*0.3),k%2?'#7fae98':'#6f9e88',r,9);if(k%2===0)TH.ell(c,bx+u*0.3,by-u*0.35,u*0.3,u*0.16,'#eaa0bc');}}},
  willow:{cat:'tree',rho:0.09,tall:9,reach:5,draw(c,x,y,u,v){const r=mulberry(v*5+9);SHD(c,x,y,u*2.6,'20,50,24');TH.poly(c,[[x-u*0.55,y],[x-u*0.3,y-u*2.6],[x+u*0.3,y-u*2.6],[x+u*0.6,y]],'#6a5236');TH.blob(c,x,y-u*3.9,u*2.5,u*1.5,'#6f9a44',r,10);TH.blob(c,x-u*0.8,y-u*4.4,u*1.6,u*1.0,'#82ac52',r,9);
    for(let k=0;k<18;k++){const a=-Math.PI*0.05-k/17*Math.PI*0.9,sx=x+Math.cos(a)*u*2.4,sy=y-u*3.9+Math.sin(a)*u*1.0,l=u*(2.2+r()*1.3);c.strokeStyle=k%2?'#8cb85a':'#78a448';c.lineWidth=u*0.13;c.lineCap='round';c.beginPath();c.moveTo(sx,sy);c.quadraticCurveTo(sx+(r()-0.5)*u*0.5,sy+l*0.5,sx+(r()-0.5)*u*0.8,sy+l);c.stroke();}}},
  cypress:{cat:'tree',rho:0.05,tall:11,reach:2.6,draw(c,x,y,u,v){const r=mulberry(v*3+1),H=u*(6.4+r()*1.8);SHD(c,x,y,u*1.2,'10,36,20');const g=c.createLinearGradient(x-u,0,x+u,0);g.addColorStop(0,'#3c7a4a');g.addColorStop(0.55,'#2a5c36');g.addColorStop(1,'#1b4228');c.fillStyle=g;c.beginPath();c.moveTo(x,y-H);c.bezierCurveTo(x+u*0.95,y-H*0.7,x+u*1.05,y-H*0.2,x+u*0.55,y-u*0.2);c.lineTo(x-u*0.55,y-u*0.2);c.bezierCurveTo(x-u*1.05,y-H*0.2,x-u*0.95,y-H*0.7,x,y-H);c.fill();for(let k=1;k<6;k++)TH.ln(c,[x-u*0.7*(1-k/6),y-H*k/6],[x+u*0.3*(1-k/6),y-H*k/6+u*0.5],'rgba(0,0,0,.14)',u*0.1);}},
  pomegranate:{cat:'tree',rho:0.06,tall:5,reach:3.2,draw(c,x,y,u,v){const r=mulberry(v*5+4);SHD(c,x,y,u*1.8,'20,50,24');TH.ln(c,[x,y],[x-u*0.1,y-u*1.7],'#6a4e32',u*0.34);[[0,-2.9,1.5,1.1],[-1.0,-2.3,1.0,0.8],[1.0,-2.3,1.0,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,rx*u,ry*u,['#4e8a3a','#5f9c42','#437a34'][i],r,8));for(let k=0;k<6;k++)TH.ell(c,x+(r()-0.5)*u*2.4,y-u*(2.0+r()*1.6),u*0.19,u*0.2,k%2?'#d23a2e':'#e24a36');}},
  jungleBush:{cat:'shrub',rho:0.06,tall:4,reach:3.4,draw(c,x,y,u,v){const r=mulberry(v*3+2),pal=BFOL[v&3];SHD(c,x,y,u*2.0,'14,46,22');[[-0.9,-0.6,1.1,0.8],[0.9,-0.6,1.1,0.8],[0,-1.1,1.3,0.9]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,rx*u,ry*u,pal[i],r,8));for(let k=0;k<5;k++){const a=-Math.PI*0.9+k/4*Math.PI*0.8;c.save();c.translate(x+(r()-0.5)*u*1.2,y-u*0.8);c.rotate(a+Math.PI/2);TH.ell(c,0,-u*0.9,u*0.34,u*0.95,k%2?'#2f7a3a':'#3a8a45');c.restore();}}},
  oleander:{cat:'shrub',rho:0.06,tall:5,reach:3.2,draw(c,x,y,u,v){const r=mulberry(v*7+5),fl=['#ee86a8','#f6b0c4','#fff0f4'][v%3];SHD(c,x,y,u*1.9,'14,46,22');[[-0.8,-0.7,1.0,0.8],[0.8,-0.7,1.0,0.8],[0,-1.2,1.1,0.9]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,rx*u,ry*u,['#4a7a3a','#5a8e44','#3f6e34'][i],r,8));for(let k=0;k<9;k++){const px=x+(r()-0.5)*u*2.4,py=y-u*(0.9+r()*1.2);for(let j=0;j<5;j++){const a=j/5*6.283;TH.ell(c,px+Math.cos(a)*u*0.15,py+Math.sin(a)*u*0.11,u*0.12,u*0.1,fl);}TH.ell(c,px,py,u*0.07,u*0.06,'#f2c230');}}},
  caneReeds:{cat:'shrub',rho:0.05,tall:8,reach:3,draw(c,x,y,u,v){const r=mulberry(v*5+2);SHD(c,x,y,u*1.5,'30,60,30');const n=8+Math.floor(r()*3);for(let k=0;k<n;k++){const bx=x+(k-n/2)*u*0.28+(r()-0.5)*u*0.2,H=u*(4.2+r()*3.0),ln=(r()-0.5)*u*0.9;TH.ln(c,[bx,y],[bx+ln,y-H],k%2?'#9ab04a':'#b4c262',u*0.15);for(let j=0;j<3;j++)TH.ln(c,[bx+ln*0.5,y-H*0.5-j*u*0.4],[bx+ln*0.5+u*(0.5+j*0.1),y-H*0.5-j*u*0.4+u*0.5],'#7ea040',u*0.09);TH.ell(c,bx+ln,y-H-u*0.35,u*0.2,u*0.5,'#d8c88a');}}},
  tallGrass:{cat:'shrub',rho:0.04,tall:3,reach:2.6,draw(c,x,y,u,v){const r=mulberry(v*9+1);for(let k=0;k<14;k++){const bx=x+(r()-0.5)*u*1.6,H=u*(0.9+r()*1.2),a=(r()-0.5)*0.9;TH.ln(c,[bx,y],[bx+a*H,y-H],['#9bb04a','#7a9a3c','#b8c460','#6d8e38'][k%4],u*0.1);}}},
  fernPatch:{cat:'shrub',rho:0.05,tall:3,reach:3,draw(c,x,y,u,v){const r=mulberry(v*13+7);SHD(c,x,y,u*1.5,'14,46,22');for(let k=0;k<9;k++){const a=-Math.PI*0.95+k/8*Math.PI*0.9,l=u*(1.6+r()*0.8),ex=x+Math.cos(a)*l,ey=y-u*0.3+Math.sin(a)*l*0.6;c.strokeStyle=k%2?'#3f8a45':'#58a04f';c.lineWidth=u*0.2;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo((x+ex)/2,(y+ey)/2-u*0.5,ex,ey+u*0.3);c.stroke();}}},
  vineBloom:{cat:'shrub',rho:0.05,tall:4,reach:3,draw(c,x,y,u,v){const r=mulberry(v*3+6),fl=['#e86aa8','#f2b630','#d9433b','#8a6ae8'][v&3];SHD(c,x,y,u*1.6,'14,46,22');[[-0.7,-0.6,1.0,0.7],[0.7,-0.6,1.0,0.7],[0,-1.0,1.1,0.8]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,rx*u,ry*u,['#3a8a45','#2f7a3a','#4a9a50'][i],r,8));for(let k=0;k<8;k++)TH.ell(c,x+(r()-0.5)*u*2.2,y-u*(0.6+r()*1.3),u*0.17,u*0.14,fl);}},
  mudBricks:{cat:'rock',rho:0.07,tall:3,reach:3,draw(c,x,y,u,v){const r=mulberry(v*3+5);SHD(c,x,y,u*2);[[-0.9,0.1,1.0,0.5],[0.2,0.0,1.1,0.55],[1.2,0.15,0.8,0.45],[-0.3,-0.45,0.9,0.45],[0.6,-0.5,0.7,0.4]].forEach(([dx,dy,w,h],i)=>{const px=x+dx*u,py=y+dy*u;BX(c,px,py,u*0.7,-w,w,-0.5,0.5,0,h*1.2,['#b48a5c','#a37a4e','#c29668'][i%3]);});}},
  limestone:{cat:'rock',rho:0.08,tall:3,reach:3,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.7],[0.8,0.2,0.75,0.6],[0,-0.3,0.65,0.55]].forEach(([dx,dy,rx,ry],i)=>{const px=x+dx*u,py=y+dy*u,sx=u*rx,sy=u*ry*(1+r()*0.2),col=['#d8cdaa','#c4b890','#e4dab8'][i];TH.ell(c,px+sx*0.15,py+sy*0.3,sx*1.05,sy*0.45,'rgba(60,50,24,.26)');TH.poly(c,[[px-sx,py],[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px-sx*0.6,py+sy*0.2]],col);TH.poly(c,[[px+sx*0.25,py-sy*0.98],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px+sx*0.2,py+sy*0.05]],shade(col,-0.28));TH.poly(c,[[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.1,py-sy*0.5],[px-sx*0.5,py-sy*0.45]],shade(col,0.2));if(i===1)TH.blob(c,px-sx*0.2,py+sy*0.1,u*0.55,u*0.22,'#6f9a44',r,6);});}},
};

/* ---- Babylon part 2: blue-dyed mud huts, small monuments and props ---- */
const BBLUE=['#3d6fb8','#2f5fa8','#4a7cc4','#36689f'];
const BHUT_CLOTH=(c,x,y,u,r,cols)=>{const aw=u*(1.5+r()*0.4);TH.poly(c,[[x-aw,y],[x+aw,y],[x+aw*0.8,y+u*0.75],[x-aw*0.8,y+u*0.75]],cols[0]);for(let k=0;k<5;k++)TH.poly(c,[[x-aw+k*aw*0.4,y],[x-aw+(k+0.5)*aw*0.4,y],[x-aw*0.8+(k+0.5)*aw*0.32,y+u*0.75],[x-aw*0.8+k*aw*0.32,y+u*0.75]],cols[1]);};
const BBT={
  blueHut:{cat:'struct',rho:0.1,tall:7,reach:4,draw(c,x,y,u,v){const r=mulberry(v*9+1),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),w=1.5+(v%3)*0.25,d=1.3+((v>>2)%2)*0.25,h=2.2+r()*0.4,bl=BBLUE[v&3];SHD(c,x,y,u*3.2,'40,30,16');FLIP(c,x,v&1,()=>{
    BX(c,x,y,u,-w,w,-d,d,0,h,bl);TH.poly(c,[I(-w,d,0),I(w,d,0),I(w,d,0.55),I(-w,d,0.55)],'#a47a4e');TH.poly(c,[I(w,-d,0),I(w,d,0),I(w,d,0.55),I(w,-d,0.55)],'#86603a');
    for(let k=0;k<4;k++){const X=-w+r()*2*w,Z=0.7+r()*(h-1.0);TH.ell(c,I(X,d+0.01,Z)[0],I(X,d+0.01,Z)[1],u*(0.2+r()*0.25),u*(0.12+r()*0.1),'rgba(176,134,86,.55)');}
    for(let k=1;k<4;k++)TH.ln(c,I(-w,d+0.01,0.55+k*0.38),I(w,d+0.01,0.55+k*0.38),'rgba(20,40,90,.22)',u*0.06);
    BX(c,x,y,u,-w-0.12,w+0.12,-d-0.12,d+0.12,h,h+0.3,'#5b8ed0');for(let k=0;k<6;k++){const X=-w+(k+0.5)*(2*w/6);TH.ell(c,I(X,d+0.12,h+0.14)[0],I(X,d+0.12,h+0.14)[1],u*0.1,u*0.1,'#6a4a2a');}
    const dx=-w*0.25;TH.poly(c,[I(dx-0.45,d+0.02,0),I(dx+0.45,d+0.02,0),I(dx+0.45,d+0.02,1.4),I(dx-0.45,d+0.02,1.4)],'#2a2018');TH.ell(c,I(dx,d+0.02,1.4)[0],I(dx,d+0.02,1.4)[1],u*0.46,u*0.22,'#2a2018');TH.ln(c,I(dx-0.6,d+0.03,1.7),I(dx+0.6,d+0.03,1.7),'#f1ead3',u*0.12);
    TH.poly(c,[I(w*0.35,d+0.02,1.1),I(w*0.7,d+0.02,1.1),I(w*0.7,d+0.02,1.6),I(w*0.35,d+0.02,1.6)],'#1c1a18');TH.ln(c,I(w*0.35,d+0.03,1.1),I(w*0.7,d+0.03,1.1),'#f1ead3',u*0.1);
    if(v%2){const ax=I(-w*0.2,d+0.2,2.6);BHUT_CLOTH(c,ax[0],ax[1],u,r,['#2f5fa8','#f1ead3']);}else{TH.ln(c,I(w+0.1,-0.4,0),I(w+0.1,-0.4,h+0.9),'#7a5a36',u*0.16);TH.ln(c,I(w+0.1,0.5,0),I(w+0.1,0.5,h+0.9),'#7a5a36',u*0.16);for(let k=0;k<4;k++)TH.ln(c,I(w+0.1,-0.4,0.6+k*0.55),I(w+0.1,0.5,0.6+k*0.55),'#7a5a36',u*0.1);}});}},
  blueHutRound:{cat:'struct',rho:0.09,tall:7,reach:3.5,draw(c,x,y,u,v){const r=mulberry(v*5+3),rx=1.7*u,ry=0.85*u,h=1.8*u,bl=BBLUE[v&3];SHD(c,x,y,u*3.2,'40,30,16');FLIP(c,x,v&1,()=>{EGCYL(c,x,y,rx,ry,h,[shade(bl,0.18),bl,shade(bl,-0.3)]);c.fillStyle='#a47a4e';c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.lineTo(x-rx,y-u*0.4);c.ellipse(x,y-u*0.4,rx,ry,0,Math.PI,0,true);c.closePath();c.fill();
    const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,shade(bl,0.25));g.addColorStop(0.6,bl);g.addColorStop(1,shade(bl,-0.32));c.fillStyle=g;c.beginPath();c.ellipse(x,y-h,rx,ry,0,Math.PI,0,false);c.bezierCurveTo(x+rx*0.8,y-h-u*1.9,x-rx*0.8,y-h-u*1.9,x-rx,y-h);c.closePath();c.fill();
    c.strokeStyle='#f1ead3';c.lineWidth=u*0.14;c.beginPath();c.ellipse(x,y-h+u*0.12,rx,ry,0,0.02,Math.PI-0.02);c.stroke();TH.ell(c,x,y-h-u*1.2,u*0.2,u*0.12,'#e3b436');
    const a=Math.PI/2+0.35,dx=x+Math.cos(a)*rx,dy=y+Math.sin(a)*ry;c.fillStyle='#2a2018';c.beginPath();c.moveTo(dx-u*0.45,dy);c.lineTo(dx-u*0.45,dy-u*0.9);c.quadraticCurveTo(dx,dy-u*1.5,dx+u*0.45,dy-u*0.9);c.lineTo(dx+u*0.45,dy);c.closePath();c.fill();});}},
  blueHutPair:{cat:'struct',rho:0.15,tall:7,reach:6,draw(c,x,y,u,v){const r=mulberry(v*11+6),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SHD(c,x,y,u*5.4,'40,30,16');FLIP(c,x,v&1,()=>{
    BX(c,x,y,u,-3.4,3.4,0.9,1.1,0,0.7,'#b8946a');BX(c,x,y,u,-3.4,-3.2,-1.2,1.1,0,0.7,'#b8946a');BX(c,x,y,u,3.2,3.4,-1.2,1.1,0,0.7,'#a98258');
    BX(c,x,y,u,-3.0,-0.5,-1.2,0.5,0,2.2,'#3a6cb6');BX(c,x,y,u,-3.1,-0.4,-1.3,0.6,2.2,2.5,'#5b8ed0');BX(c,x,y,u,0.8,2.9,-1.2,0.3,0,1.7,'#2f5fa8');BX(c,x,y,u,0.7,3.0,-1.3,0.4,1.7,1.95,'#4f82c8');
    TH.poly(c,[I(-2.2,0.52,0),I(-1.3,0.52,0),I(-1.3,0.52,1.4),I(-2.2,0.52,1.4)],'#2a2018');TH.poly(c,[I(1.4,0.32,0),I(2.2,0.32,0),I(2.2,0.32,1.2),I(1.4,0.32,1.2)],'#2a2018');TH.poly(c,[I(-0.4,1.12,0),I(0.4,1.12,0),I(0.4,1.12,0.9),I(-0.4,1.12,0.9)],'#2a2018');
    [[0.1,0.0],[0.6,-0.3]].forEach(([X,Y],i)=>{const p=I(X,Y+0.3,0);EGCYL(c,p[0],p[1],u*0.3,u*0.14,u*(0.9+i*0.3),['#4a7cc4','#2f5fa8','#1d4a92']);});});}},
  dyeVat:{cat:'prop',rho:0.09,tall:7,reach:5,draw(c,x,y,u,v){const r=mulberry(v*5+2);SHD(c,x,y,u*3,'30,30,50');FLIP(c,x,v&1,()=>{[[-1.6,0.2],[0.2,0.35],[1.9,0.1]].forEach(([dx,dy],i)=>{const px=x+dx*u,py=y+dy*u,rx=u*0.8,h=u*0.9;EGCYL(c,px,py,rx,rx*0.42,h,['#b8693a','#9a5430','#6e3a1c']);c.fillStyle=['#2a58a6','#3a6cc0','#1d4a92'][i];c.beginPath();c.ellipse(px,py-h,rx*0.84,rx*0.34,0,0,7);c.fill();TH.ell(c,px-rx*0.2,py-h-rx*0.05,rx*0.35,rx*0.12,'rgba(255,255,255,.3)');});
    TH.ln(c,[x-u*2.7,y+u*0.2],[x-u*2.7,y-u*4.2],'#6a4a28',u*0.2);TH.ln(c,[x+u*2.9,y+u*0.1],[x+u*2.9,y-u*4.2],'#6a4a28',u*0.2);TH.ln(c,[x-u*2.7,y-u*4.1],[x+u*2.9,y-u*4.1],'#8a6a40',u*0.1);
    for(let k=0;k<4;k++){const px=x-u*2.1+k*u*1.4,col=k%2?'#2f5fa8':'#4a82d4';c.fillStyle=col;c.beginPath();c.moveTo(px-u*0.55,y-u*4.1);c.lineTo(px+u*0.55,y-u*4.1);c.lineTo(px+u*0.5+(r()-0.5)*u*0.2,y-u*(1.7+r()*0.8));c.lineTo(px-u*0.5,y-u*(2.0+r()*0.6));c.closePath();c.fill();}});}},
  marketStall:{cat:'prop',rho:0.08,tall:6,reach:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),r=mulberry(v*3+1);SHD(c,x,y,u*3,'40,30,16');FLIP(c,x,v&1,()=>{BX(c,x,y,u,-1.6,1.6,-0.6,0.6,0,1.1,'#a47a4e');[[-1.7,0.7],[1.7,0.7],[-1.7,-0.7],[1.7,-0.7]].forEach(([X,Y])=>TH.ln(c,I(X,Y,0),I(X,Y,3.1),'#6a4a28',u*0.16));
    const aw=I(0,0.4,3.2);for(let k=0;k<6;k++){const X0=-1.9+k*0.64;TH.poly(c,[I(X0,-0.9,3.5),I(X0+0.64,-0.9,3.5),I(X0+0.64,1.1,3.0),I(X0,1.1,3.0)],k%2?'#f1ead3':'#2f5fa8');}
    for(let k=0;k<4;k++){const p=I(-1.0+k*0.65,0.1,1.1);TH.ell(c,p[0],p[1]-u*0.2,u*0.28,u*0.24,['#d23a2e','#e8a02a','#7a9a3c','#8a4a7a'][k]);}});}},
  clayTablets:{cat:'prop',rho:0.05,tall:3,reach:3,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SHD(c,x,y,u*1.8);BX(c,x,y,u,-1.0,1.0,-0.6,0.6,0,0.7,'#b0905e');for(let k=0;k<3;k++)BX(c,x,y,u,-0.7+k*0.1,0.5+k*0.1,-0.4,0.4,0.7+k*0.18,0.85+k*0.18,['#cfae7a','#c29d68','#d6b682'][k]);for(let k=0;k<3;k++)TH.ln(c,I(-0.5,0.42,0.78+k*0.18),I(0.4,0.42,0.78+k*0.18),'rgba(60,40,14,.55)',u*0.05);}},
  brazier:{cat:'prop',rho:0.05,tall:5,reach:3,draw(c,x,y,u,v){SHD(c,x,y,u*1.6);TH.ln(c,[x-u*0.5,y],[x-u*0.2,y-u*1.3],'#5a4020',u*0.16);TH.ln(c,[x+u*0.5,y],[x+u*0.2,y-u*1.3],'#5a4020',u*0.16);TH.ln(c,[x,y],[x,y-u*1.3],'#5a4020',u*0.14);EGCYL(c,x,y-u*1.3,u*0.7,u*0.28,u*0.5,['#b9893a','#8f6a28','#5e4418']);c.fillStyle='#ff8a2a';c.beginPath();c.moveTo(x-u*0.45,y-u*1.8);c.quadraticCurveTo(x-u*0.5,y-u*2.8,x,y-u*3.3);c.quadraticCurveTo(x+u*0.5,y-u*2.6,x+u*0.45,y-u*1.8);c.closePath();c.fill();c.fillStyle='#ffd45a';c.beginPath();c.moveTo(x-u*0.22,y-u*1.85);c.quadraticCurveTo(x-u*0.2,y-u*2.4,x,y-u*2.7);c.quadraticCurveTo(x+u*0.2,y-u*2.3,x+u*0.22,y-u*1.85);c.closePath();c.fill();}},
  hammurabiStele:{cat:'ruin',rho:0.06,tall:9,reach:3,draw(c,x,y,u,v){const r=mulberry(v*5+5),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SHD(c,x,y,u*1.6);FLIP(c,x,v&1,()=>{BX(c,x,y,u,-1.0,1.0,-0.7,0.7,0,0.5,'#b8ac8a');
    TH.poly(c,[I(-0.6,0.3,0.5),I(0.6,0.3,0.5),I(0.6,0.3,5.4),I(0,0.3,6.0),I(-0.6,0.3,5.4)],'#3a3a42');TH.poly(c,[I(0.6,-0.3,0.5),I(0.6,0.3,0.5),I(0.6,0.3,5.4),I(0.6,-0.3,5.4)],'#26262c');
    TH.poly(c,[I(-0.45,0.31,3.6),I(0.45,0.31,3.6),I(0.45,0.31,5.2),I(-0.45,0.31,5.2)],'#4c4c56');TH.ell(c,I(-0.15,0.31,4.5)[0],I(-0.15,0.31,4.5)[1],u*0.2,u*0.5,'#6a6a74');TH.ell(c,I(0.2,0.31,4.4)[0],I(0.2,0.31,4.4)[1],u*0.18,u*0.44,'#7a7a84');TH.ln(c,I(0,0.31,5.0),I(0,0.31,4.0),'#8a8a94',u*0.1);
    for(let k=0;k<9;k++){const Z=0.8+k*0.3;TH.ln(c,I(-0.45,0.31,Z),I(0.45,0.31,Z),'rgba(160,160,172,.5)',u*0.06);}});}},
  lionStatue:{cat:'ruin',rho:0.09,tall:7,reach:5,draw(c,x,y,u,v){const r=mulberry(v*9+4);SHD(c,x,y,u*3.2);FLIP(c,x,v&1,()=>{BX(c,x,y,u,-2.6,2.6,-1.1,1.1,0,0.9,'#bcb08e');BX(c,x,y,u,-2.3,2.3,-0.9,0.9,0.9,1.2,'#cdc2a0');const k='#34343c',kl='#4a4a54',ky=y-u*1.2;
    c.beginPath();c.moveTo(x-u*2.0,ky);c.bezierCurveTo(x-u*2.2,ky-u*1.2,x-u*1.4,ky-u*1.9,x-u*0.4,ky-u*1.8);c.bezierCurveTo(x+u*0.4,ky-u*1.9,x+u*1.0,ky-u*2.0,x+u*1.4,ky-u*2.5);c.lineTo(x+u*2.1,ky-u*2.4);c.bezierCurveTo(x+u*2.4,ky-u*2.2,x+u*2.2,ky-u*1.6,x+u*1.8,ky-u*1.4);c.lineTo(x+u*1.9,ky);c.lineTo(x+u*1.4,ky);c.lineTo(x+u*1.3,ky-u*0.9);c.lineTo(x+u*0.6,ky-u*0.9);c.lineTo(x+u*0.5,ky);c.lineTo(x-u*1.2,ky);c.lineTo(x-u*1.3,ky-u*0.7);c.lineTo(x-u*1.7,ky);c.closePath();const g=c.createLinearGradient(x-u*2,ky-u*2.5,x+u*2,ky);g.addColorStop(0,kl);g.addColorStop(1,k);c.fillStyle=g;c.fill();
    TH.ell(c,x+u*1.5,ky-u*2.4,u*0.85,u*0.8,'#2a2a32');TH.ell(c,x+u*1.7,ky-u*2.3,u*0.5,u*0.5,kl);TH.ell(c,x+u*1.95,ky-u*2.4,u*0.07,u*0.07,'#c8b46a');TH.ln(c,[x-u*2.0,ky-u*0.6],[x-u*2.6,ky-u*0.3],k,u*0.2);TH.ell(c,x-u*2.7,ky-u*0.25,u*0.22,u*0.2,k);});}},
  blackObelisk:{cat:'ruin',rho:0.07,tall:12,reach:3.5,draw(c,x,y,u,v){const r=mulberry(v*7+1),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),H=6.2+r()*1.0;SHD(c,x,y,u*1.8);BX(c,x,y,u,-0.9,0.9,-0.9,0.9,0,0.45,'#bcb08e');EGTAPER(c,I,0,0,0.6,0.42,0.45,H,'#3a3a42');
    [[0.46,0.3],[0.34,0.3],[0.22,0.3]].forEach(([b,h],i)=>BX(c,x,y,u,-b,b,-b,b,H+i*0.32,H+(i+1)*0.32,'#34343c'));TH.poly(c,[I(-0.1,0.1,H+0.96),I(0.1,0.1,H+0.96),I(0,0,H+1.4)],'#4a4a54');
    for(let k=0;k<4;k++){const Z=1.1+k*1.2;TH.poly(c,[I(-0.3,0.52-0.01*Z,Z),I(0.3,0.52-0.01*Z,Z),I(0.3,0.52-0.01*Z,Z+0.8),I(-0.3,0.52-0.01*Z,Z+0.8)],'rgba(150,150,164,.4)');TH.ln(c,I(-0.25,0.52-0.01*Z,Z+0.4),I(0.25,0.52-0.01*Z,Z+0.4),'rgba(205,205,216,.55)',u*0.06);}}},
  zigguratShrine:{cat:'ruin',rho:0.11,tall:9,reach:5,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SHD(c,x,y,u*4);FLIP(c,x,v&1,()=>{BX(c,x,y,u,-2.6,2.6,-2.2,2.2,0,1.2,'#c0a070');BX(c,x,y,u,-1.9,1.9,-1.6,1.6,1.2,2.3,'#b8986a');BX(c,x,y,u,-1.3,1.3,-1.1,1.1,2.3,3.3,'#b08e62');
    TH.poly(c,[I(-0.5,2.2,0),I(0.5,2.2,0),I(0.1,1.6,1.2),I(-0.1,1.6,1.2)],'#a8845a');for(let k=0;k<4;k++)TH.ln(c,I(-0.45+k*0.03,2.21-k*0.15,k*0.3),I(0.45-k*0.03,2.21-k*0.15,k*0.3),'rgba(60,40,14,.35)',u*0.06);
    BX(c,x,y,u,-0.8,0.8,-0.7,0.7,3.3,4.5,'#2f63b4');TH.poly(c,[I(-0.9,0.8,4.5),I(0.9,0.8,4.5),I(0,0,5.3)],'#3f78d0');TH.poly(c,[I(0.9,-0.8,4.5),I(0.9,0.8,4.5),I(0,0,5.3)],'#1d4a92');TH.poly(c,[I(-0.3,0.72,3.3),I(0.3,0.72,3.3),I(0.3,0.72,4.0),I(-0.3,0.72,4.0)],'#e3b436');
    TH.ln(c,I(-1.9,1.62,2.0),I(1.9,1.62,2.0),'#f1ead3',u*0.08);TH.ln(c,I(-2.6,2.22,1.0),I(2.6,2.22,1.0),'#2f63b4',u*0.1);});}},
  lamassu:{cat:'ruin',rho:0.1,tall:8,reach:4,draw(c,x,y,u,v){SHD(c,x,y,u*3.2);FLIP(c,x,v&1,()=>{BX(c,x,y,u,-2.8,2.8,-1.0,1.0,0,0.8,'#bdb08c');const ky=y-u*0.8,st='#d9cfaa',sd='#b3a781';
    [[-1.8,0.0],[-1.0,0.0],[1.2,0.0],[2.0,0.0]].forEach(([dx,dy],i)=>TH.poly(c,[[x+dx*u-u*0.32,ky],[x+dx*u+u*0.32,ky],[x+dx*u+u*0.28,ky-u*1.3],[x+dx*u-u*0.28,ky-u*1.3]],i%2?sd:st));
    c.beginPath();c.moveTo(x-u*2.5,ky-u*1.2);c.bezierCurveTo(x-u*2.7,ky-u*2.3,x-u*1.6,ky-u*2.8,x-u*0.2,ky-u*2.7);c.bezierCurveTo(x+u*1.0,ky-u*2.7,x+u*1.9,ky-u*2.5,x+u*2.3,ky-u*2.1);c.lineTo(x+u*2.5,ky-u*1.2);c.bezierCurveTo(x+u*1.6,ky-u*0.9,x-u*1.2,ky-u*0.9,x-u*2.5,ky-u*1.2);c.closePath();const g=c.createLinearGradient(x-u*2.5,ky-u*2.8,x+u*2.5,ky);g.addColorStop(0,'#e8dfbc');g.addColorStop(1,sd);c.fillStyle=g;c.fill();
    c.fillStyle='#cbbf98';c.beginPath();c.moveTo(x-u*1.7,ky-u*2.3);c.bezierCurveTo(x-u*2.6,ky-u*3.6,x-u*1.9,ky-u*5.2,x-u*0.1,ky-u*5.4);c.bezierCurveTo(x+u*0.6,ky-u*4.6,x+u*0.8,ky-u*3.4,x+u*0.9,ky-u*2.5);c.closePath();c.fill();for(let k=0;k<6;k++)TH.ln(c,[x-u*1.9+k*u*0.4,ky-u*2.7-k*u*0.45],[x+u*0.6,ky-u*2.9-k*u*0.4],'rgba(110,98,60,.4)',u*0.07);
    const hx=x+u*2.4,hy=ky-u*3.5;TH.poly(c,[[hx-u*0.55,hy-u*0.7],[hx-u*0.5,hy-u*2.0],[hx+u*0.55,hy-u*2.0],[hx+u*0.6,hy-u*0.7]],'#e3b436');TH.ln(c,[hx-u*0.5,hy-u*1.35],[hx+u*0.55,hy-u*1.35],'#2f63b4',u*0.12);TH.ell(c,hx,hy-u*0.2,u*0.66,u*0.74,st);TH.ell(c,hx+u*0.18,hy-u*0.3,u*0.07,u*0.08,'#3a2a14');TH.poly(c,[[hx-u*0.2,hy+u*0.35],[hx+u*0.3,hy+u*0.35],[hx+u*0.2,hy+u*1.3],[hx-u*0.15,hy+u*1.2]],'#3a3a42');TH.ln(c,[hx+u*0.05,hy-u*0.05],[hx+u*0.4,hy+u*0.1],'#8a6a40',u*0.08);});}},
  hangingGarden:{cat:'ruin',rho:0.11,tall:8,reach:5,draw(c,x,y,u,v){const r=mulberry(v*5+8),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SHD(c,x,y,u*4,'20,40,20');FLIP(c,x,v&1,()=>{[[2.6,2.1,0,1.0],[1.9,1.5,1.0,2.0],[1.2,0.9,2.0,3.0]].forEach(([w,d,z0,z1],i)=>{BX(c,x,y,u,-w,w,-d,d,z0,z1,['#c0a070','#b8986a','#b08e62'][i]);BX(c,x,y,u,-w+0.1,w-0.1,-d+0.1,d-0.1,z1,z1+0.1,'#6aa045');
      for(let k=0;k<4+i;k++){const X=-w+0.3+r()*(2*w-0.6),Y=-d+0.3+r()*(2*d-0.6),p=I(X,Y,z1+0.1);TH.blob(c,p[0],p[1]-u*0.3,u*(0.5+r()*0.5),u*(0.4+r()*0.3),['#3a8a45','#58a04f','#2f7a3a','#6aa845'][k%4],r,7);}
      for(let k=0;k<6;k++){const X=-w+0.3+k*(2*w-0.6)/5,a=I(X,d,z1),b=I(X+(r()-0.5)*0.2,d,z1-0.6-r()*0.6);TH.ln(c,a,b,'#4d8a3a',u*0.1);}});
    const p=I(0.2,0.2,3.1);TH.blob(c,p[0],p[1]-u*0.5,u*0.8,u*0.7,'#2f7a3a',r,8);TH.ell(c,p[0]+u*0.2,p[1]-u*0.8,u*0.14,u*0.14,'#e86aa8');});}},
  ishtarPillar:{cat:'ruin',rho:0.06,tall:9,reach:3,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SHD(c,x,y,u*1.8);BX(c,x,y,u,-1.0,1.0,-1.0,1.0,0,0.5,'#bcb08e');BX(c,x,y,u,-0.75,0.75,-0.75,0.75,0.5,6.2,'#2b63b7');BX(c,x,y,u,-0.9,0.9,-0.9,0.9,6.2,6.6,'#e3b436');
    for(let k=0;k<3;k++){const Z=1.0+k*1.7;TH.poly(c,[I(-0.5,0.76,Z),I(0.5,0.76,Z),I(0.5,0.76,Z+1.2),I(-0.5,0.76,Z+1.2)],'#f1ead3');TH.poly(c,[I(-0.4,0.77,Z+0.15),I(0.4,0.77,Z+0.15),I(0.4,0.77,Z+1.05),I(-0.4,0.77,Z+1.05)],'#2b63b7');const p=I(0,0.78,Z+0.6);TH.poly(c,[[p[0]-u*0.34,p[1]+u*0.2],[p[0]-u*0.3,p[1]-u*0.15],[p[0]-u*0.05,p[1]-u*0.28],[p[0]+u*0.25,p[1]-u*0.18],[p[0]+u*0.34,p[1]+u*0.05],[p[0]+u*0.28,p[1]+u*0.22]],'#e3b436');TH.ell(c,p[0]+u*0.3,p[1]-u*0.22,u*0.09,u*0.07,'#e3b436');}
    BX(c,x,y,u,-0.6,0.6,-0.6,0.6,6.6,7.0,'#4a82d4');}},
};

/* ---- Babylon part 3: the glazed-brick perimeter wall (stepped battlements), corner piers and the four Ishtar-style gates. All drawn by drawEx from plan geometry. ---- */
const BW={face:'#2b63b7',top:'#5a92de',merlon:'#3871c6',gold:'#e8b93a',white:'#f1ead3',joint:'rgba(14,36,86,.28)',dark:'#13100c'};
/* extrude a base polygon (px) from z0 to z1 (px): draws the faces that look toward the viewer, then the top. deco(c,face) paints on a face. */
function bbPrism(c,pts,z0,z1,col,topCol,deco){
  let cx=0,cy=0;pts.forEach(p=>{cx+=p[0];cy+=p[1];});cx/=pts.length;cy/=pts.length;const faces=[];
  for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],dx=b[0]-a[0],dy=b[1]-a[1];let nx=dy,ny=-dx;const mx=(a[0]+b[0])/2-cx,my=(a[1]+b[1])/2-cy;if(nx*mx+ny*my<0){nx=-nx;ny=-ny;}const l=Math.hypot(nx,ny)||1;nx/=l;ny/=l;if(ny>0.03)faces.push({a,b,nx,ny,z0,z1});}
  faces.sort((p,q)=>(p.a[1]+p.b[1])-(q.a[1]+q.b[1]));
  faces.forEach(f=>{const q=[[f.a[0],f.a[1]-z0],[f.b[0],f.b[1]-z0],[f.b[0],f.b[1]-z1],[f.a[0],f.a[1]-z1]];TH.poly(c,q,shade(col,-f.nx*0.26+(f.ny-0.8)*0.1));if(deco)deco(c,f);});
  TH.poly(c,pts.map(p=>[p[0],p[1]-z1]),topCol);}
/* paint a glazed-brick face: courses, joints, a gold frieze of little bulls on a white-bordered band */
function bbFaceDeco(c,f,R,opts){const w=Math.hypot(f.b[0]-f.a[0],f.b[1]-f.a[1]),h=f.z1-f.z0;if(w<2||h<3)return;opts=opts||{};const P=(s,z)=>[f.a[0]+(f.b[0]-f.a[0])*s,f.a[1]+(f.b[1]-f.a[1])*s-f.z0-z];
  const lw=Math.max(0.6,R*0.006);c.save();
  for(let k=1;k<4;k++){const z=h*k/4,a=P(0,z),b=P(1,z);c.strokeStyle=BW.joint;c.lineWidth=lw;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  const n=Math.max(2,Math.round(w/(R*0.075)));for(let k=1;k<n;k++){const s=k/n,off=(k%2?0.0:0.0),a=P(s,0),b=P(s,h*0.25);c.strokeStyle=BW.joint;c.lineWidth=lw;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  if(h>R*0.12){const z0=h*(opts.fz0||0.36),z1=h*(opts.fz1||0.66),A=P(0,z0),B=P(1,z0),C=P(1,z1),D=P(0,z1);TH.poly(c,[A,B,C,D],BW.white);const ez=(z1-z0)*0.16,A2=P(0,z0+ez),B2=P(1,z0+ez),C2=P(1,z1-ez),D2=P(0,z1-ez);TH.poly(c,[A2,B2,C2,D2],'#2459a8');
    const nb=Math.max(1,Math.round(w/(R*0.14)));for(let k=0;k<nb;k++){const s=(k+0.5)/nb,bz=z0+(z1-z0)*0.5,p=P(s,bz),sx=(f.b[0]-f.a[0])/w,sy=(f.b[1]-f.a[1])/w,L=Math.min(w/nb*0.36,R*0.055),H=(z1-z0)*0.3;
      const q=(dx,dy)=>[p[0]+sx*dx*L+0,p[1]+sy*dx*L-dy*H];TH.poly(c,[q(-1,-0.9),q(-0.9,0.1),q(-0.5,0.6),q(0.2,0.7),q(0.8,0.5),q(1,0.1),q(0.9,-0.9),q(0.5,-0.6),q(-0.4,-0.6)],BW.gold);}}
  c.restore();}
const BWH=0.18,BWT=0.105;                                          /* wall height and thickness in R */
const BBW={
  wall:{cat:'wall',rho:0.05,tall:5,reach:4,drawEx(c,o,ox,oy,m,R,u){const P=(p)=>[ox+m*p[0]*R,oy+p[1]*R],a=P(o.a),b=P(o.b);let dx=b[0]-a[0],dy=b[1]-a[1];const L=Math.hypot(dx,dy);if(L<1)return;dx/=L;dy/=L;let nx=-dy,ny=dx;const tw=BWT*R*0.5,ext=tw*0.9,H=BWH*R;
    const A=[a[0]-dx*ext,a[1]-dy*ext],B=[b[0]+dx*ext,b[1]+dy*ext],q=[[A[0]+nx*tw,A[1]+ny*tw],[B[0]+nx*tw,B[1]+ny*tw],[B[0]-nx*tw,B[1]-ny*tw],[A[0]-nx*tw,A[1]-ny*tw]];
    bbPrism(c,q,0,H,BW.face,BW.top,(cc,f)=>{if(Math.hypot(f.b[0]-f.a[0],f.b[1]-f.a[1])>L*0.5)bbFaceDeco(cc,f,R,{});});
    /* stepped battlements: two merlons per piece, each a little two-step ziggurat */
    for(const t of [0.25,0.75]){const mx=a[0]+(b[0]-a[0])*t,my=a[1]+(b[1]-a[1])*t,mk=(len,th,z0,z1,col,top)=>{const l2=len/2,t2=th;bbPrism(c,[[mx-dx*l2+nx*t2,my-dy*l2+ny*t2],[mx+dx*l2+nx*t2,my+dy*l2+ny*t2],[mx+dx*l2-nx*t2,my+dy*l2-ny*t2],[mx-dx*l2-nx*t2,my-dy*l2-ny*t2]],z0,z1,col,top);};
      mk(R*0.085,tw*0.86,H,H+R*0.035,BW.merlon,'#6aa2ec');mk(R*0.05,tw*0.58,H+R*0.035,H+R*0.068,'#3f7ed0','#79b0f2');}}},
  pier:{cat:'wall',rho:0.05,tall:6,reach:3,drawEx(c,o,ox,oy,m,R,u){const x=ox+m*o.x*R,y=oy+o.y*R,s=R*0.075,H=(BWH+0.045)*R,sq=(r)=>[[x-r,y-r*0.7],[x+r,y-r*0.7],[x+r,y+r*0.7],[x-r,y+r*0.7]];bbPrism(c,sq(s),0,H,'#2559a8','#5a92de',(cc,f)=>bbFaceDeco(cc,f,R,{fz0:0.3,fz1:0.62}));bbPrism(c,sq(s*0.72),H,H+R*0.035,'#3871c6','#6aa2ec');bbPrism(c,sq(s*0.42),H+R*0.035,H+R*0.07,'#3f7ed0','#79b0f2');TH.ell(c,x,y-H-R*0.085,R*0.016,R*0.016,BW.gold);}},
  gate:{cat:'wall',rho:0.18,tall:16,reach:12,drawEx(c,o,ox,oy,m,R,u){const P=(p)=>[ox+m*p[0]*R,oy+p[1]*R],a=P(o.a),b=P(o.b),ctr=P([o.x,o.y]);let dx=b[0]-a[0],dy=b[1]-a[1];const L=Math.hypot(dx,dy);dx/=L;dy/=L;let nx=-dy,ny=dx;if(ny<0){nx=-nx;ny=-ny;}
    const S=(s,t)=>[ctr[0]+dx*s*R+nx*t*R,ctr[1]+dy*s*R+ny*t*R],quad=(s0,s1,t0,t1)=>[S(s0,t0),S(s1,t0),S(s1,t1),S(s0,t1)];
    const Ht=0.46*R,Hw=BWH*R;
    /* wall stubs either side of the towers */
    [[-0.5,-0.4],[0.4,0.5]].forEach(([s0,s1])=>bbPrism(c,quad(s0,s1,-BWT/2,BWT/2),0,Hw,BW.face,BW.top,(cc,f)=>bbFaceDeco(cc,f,R,{})));
    /* back tower pair drawn first (they are the same here), then the passage block, then the front faces */
    [-1,1].forEach(sg=>{const s0=sg>0?0.15:-0.41,s1=sg>0?0.41:-0.15;
      bbPrism(c,quad(s0,s1,-0.115,0.115),0,Ht,'#2559a8','#5a92de',(cc,f)=>bbFaceDeco(cc,f,R,{fz0:0.18,fz1:0.34}));
      /* second relief band higher up */
      const f2=(cc,f)=>{};bbPrism(c,quad(s0+0.02,s1-0.02,-0.1,0.1),Ht,Ht+R*0.045,'#3871c6','#6aa2ec');bbPrism(c,quad(s0+0.05,s1-0.05,-0.075,0.075),Ht+R*0.045,Ht+R*0.085,'#3f7ed0','#79b0f2');bbPrism(c,quad(s0+0.085,s1-0.085,-0.045,0.045),Ht+R*0.085,Ht+R*0.12,'#4a88dc','#8ab8f4');
      const tp=S((s0+s1)/2,0.0);TH.ell(c,tp[0],tp[1]-Ht-R*0.14,R*0.018,R*0.018,BW.gold);});
    /* passage block with the arched opening */
    bbPrism(c,quad(-0.16,0.16,-0.095,0.095),0,0.36*R,'#2a5eae','#5a92de',(cc,f)=>{bbFaceDeco(cc,f,R,{fz0:0.62,fz1:0.9});
      const sw=0.115,zs=0.13*R,P2=(s,z)=>{const q=[S(s,0.095)[0],S(s,0.095)[1]-z];return q;};const pts=[P2(-sw,0),P2(-sw,zs)];for(let k=0;k<=14;k++){const th=Math.PI*k/14;pts.push(P2(-sw*Math.cos(th),zs+sw*R*Math.sin(th)));}pts.push(P2(sw,zs),P2(sw,0));
      cc.beginPath();pts.forEach((p,i)=>i?cc.lineTo(p[0],p[1]):cc.moveTo(p[0],p[1]));cc.closePath();const g=cc.createLinearGradient(0,pts[Math.floor(pts.length/2)][1],0,P2(0,0)[1]);g.addColorStop(0,'#0a0806');g.addColorStop(1,'#3a2c1a');cc.fillStyle=g;cc.fill();cc.strokeStyle=BW.white;cc.lineWidth=Math.max(1,R*0.012);cc.stroke();
      const key=P2(0,zs+sw*R+R*0.012);TH.ell(cc,key[0],key[1],R*0.014,R*0.012,BW.gold);});
    bbPrism(c,quad(-0.13,0.13,-0.07,0.07),0.36*R,0.36*R+R*0.04,'#3871c6','#6aa2ec');
  }},
};

/* ===== BABYLON LAND: planner (lush jungle-like foliage at Bavarian density on a desert-and-grassland floor, blue-dyed mud huts, small monuments, and a blue glazed-brick perimeter wall with stepped battlements and four evenly spaced gates) ===== */
const BAB_ASSETS=Object.assign({datePalm:EGT.datePalm,clayJars:EGT2.clayJars},BTREE,BBT,BBW);
const BAB_REGION={top:{datePalm:.2,figTree:.17,poplar:.13,tamariskTree:.13,willow:.07,cypress:.1,pomegranate:.08,jungleBush:.12},mid:{datePalm:.2,figTree:.18,poplar:.12,tamariskTree:.13,willow:.08,cypress:.08,pomegranate:.1,jungleBush:.11},bottom:{datePalm:.16,figTree:.16,poplar:.1,tamariskTree:.14,willow:.08,cypress:.06,pomegranate:.14,jungleBush:.16}};
const BAB_LOW=[['pomegranate',1],['jungleBush',1.15],['oleander',1.1],['figTree',0.6],['datePalm',0.55],['tamariskTree',0.72],['pomegranate',1.1],['jungleBush',1.25]];     /* short species in the foreground so a hut's base is never hidden */
const BAB_CAP={willow:7,cypress:12,figTree:40,pomegranate:26};
const BAB_UNDER=['jungleBush','fernPatch','oleander','tallGrass','caneReeds','jungleBush','vineBloom','fernPatch','tallGrass','oleander','jungleBush'];
const BAB_PLAN_CACHE={};
/* walk the closed boundary of the land (the outer edges, in order) */
function babBoundary(outer){const by=new Map();outer.forEach(e=>[e.ka,e.kb].forEach(k=>{if(!by.has(k))by.set(k,[]);by.get(k).push(e);}));const order=[],used=new Set();let e=outer[0],from=e.ka;
  for(let i=0;i<outer.length;i++){const fwd=from===e.ka;order.push({e,fwd,a:fwd?e.a:e.b,b:fwd?e.b:e.a});used.add(e);const to=fwd?e.kb:e.ka,nx=(by.get(to)||[]).find(q=>!used.has(q));if(!nx)break;e=nx;from=to;}
  let s=0;order.forEach(o=>{o.s0=s;o.len=o.e.len;s+=o.len;o.sm=o.s0+o.len/2;});return{order,P:s};}
function getBabylonPlan(shape){
  if(BAB_PLAN_CACHE[shape])return BAB_PLAN_CACHE[shape];
  const K=planKit(shape,({A:41101,B:41202,C:41318,D:41419})[shape],{assets:BAB_ASSETS,region:BAB_REGION,low:BAB_LOW,cap:BAB_CAP,capScale:true,under:BAB_UNDER,treeMul:0.6,shrubMul:0.78,
    inLand:(G,K0)=>{const outer=G.edges.filter(e=>e.outer);return (x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.0))&&outer.every(e=>segDist(x,y,e.a,e.b)>=0.15);}});
  const {G,rng,placed,place,tree,under,onEdge,landCnt,landThin,spread,outer,top,sides,bottoms,interior,cx,cy}=K;
  const DENS=({A:0.42,B:0.42,C:0.42,D:0.42})[shape];
  /* 1. the perimeter wall: short glazed-brick pieces + a pier at every vertex; four gates evenly spaced by arc length on the slanted (front-facing) edges */
  const {order,P}=babBoundary(outer);
  const cand=order.filter(o=>!o.e.vertical);let best=null;
  for(let off=0;off<P/4;off+=P/96){const chosen=[];let cost=0,ok=true;for(let k=0;k<4;k++){const s=(off+k*P/4)%P;let bc=null,bd=1e9;cand.forEach(o=>{if(chosen.includes(o))return;let d=Math.abs(o.sm-s);d=Math.min(d,P-d);if(d<bd){bd=d;bc=o;}});if(!bc){ok=false;break;}chosen.push(bc);cost+=bd;}if(ok&&(!best||cost<best.cost))best={cost,chosen};}
  const gates=best.chosen;gates.forEach(o=>o.gate=true);
  order.forEach(o=>{if(o.gate)return;const n=Math.max(2,Math.round(o.len/0.24));for(let k=0;k<n;k++){const t0=k/n,t1=(k+1)/n,a=[o.a[0]+(o.b[0]-o.a[0])*t0,o.a[1]+(o.b[1]-o.a[1])*t0],b=[o.a[0]+(o.b[0]-o.a[0])*t1,o.a[1]+(o.b[1]-o.a[1])*t1];placed.push({kind:'wall',cat:'wall',x:(a[0]+b[0])/2,y:(a[1]+b[1])/2,a,b,rho:0.05,scale:1,v:0,pri:0.5,minT:1,maxT:9,fixedTier:true,tier:1});}});
  const seenV=new Set();order.forEach(o=>[o.a,o.b].forEach(p=>{const k=vkey(p);if(seenV.has(k))return;seenV.add(k);placed.push({kind:'pier',cat:'wall',x:p[0],y:p[1],rho:0.05,scale:1,v:0,pri:0.5,minT:1,maxT:9,fixedTier:true,tier:1});}));
  gates.forEach(o=>{const mid=[(o.a[0]+o.b[0])/2,(o.a[1]+o.b[1])/2];placed.push({kind:'gate',cat:'wall',x:mid[0],y:mid[1],a:o.a,b:o.b,rho:0.18,scale:1,v:0,pri:0.5,minT:1,maxT:9,fixedTier:true,tier:1,gate:true});K.obstacles.push((x,y,rho)=>Math.hypot(x-mid[0],(y-mid[1])*1.5)>0.5+rho*0.4);});
  /* 2. monuments (small, spread so none clump) and the blue mud huts */
  const rim=[],inn=[];outer.forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,-0.28))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.forEach(e=>inn.push([e.mid[0],e.mid[1]]));
  landThin([['hammurabiStele',1,1],['ishtarPillar',2,0.9],['lionStatue',2,0.85],['zigguratShrine',3,0.8],['blackObelisk',3,1],['lamassu',4,0.82],['hangingGarden',4,0.8],['hammurabiStele',5,1],['ishtarPillar',5,0.9],['lionStatue',5,0.8]]).forEach(([k,mt,s])=>spread(k,rim.concat(inn),{minT:mt,fixedTier:true,scale:s,clear:2.0,noSouth:true}));
  landThin([['blueHutRound',1],['blueHut',1],['blueHut',2],['blueHutRound',2],['blueHutPair',3],['blueHut',3],['blueHutRound',4],['blueHut',4],['blueHutPair',5],['blueHut',5],['blueHutRound',5],['blueHut',5],['blueHutPair',5]]).forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,fixedTier:true,scale:1.05,clear:2.3,noSouth:true}));
  /* 3. trees: lush groves at every junction, in every corridor, round the rim and filling the corners (dense: Bavarian count) */
  G.verts.filter(v=>v.junction).forEach(v=>{const dom=K.pickFrom(K.regionOf(v.y),K.capOk),n=1+Math.floor(rng()*1.6);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.1:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}});
  interior.filter(e=>e.vertical).forEach(e=>{const dom=K.pickFrom(K.regionOf(e.mid[1]),K.capOk);[-0.25,0.0,0.25].forEach(dy=>{if(rng()<0.8*DENS)tree(e.mid[0]+(rng()-0.5)*0.26,e.mid[1]+dy,null,dom);});});
  interior.filter(e=>!e.vertical).forEach(e=>{const dom=K.pickFrom(K.regionOf(e.mid[1]),K.capOk);for(let k=0;k<2;k++)if(rng()<0.8*DENS)tree(e.mid[0]+(rng()-0.5)*0.3,e.mid[1]+(rng()-0.5)*0.14,{scale:0.82+rng()*0.22},dom,k===1);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(3,Math.round(e.len/0.2));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.06,-0.2-rng()*0.16)});});
    let mode='grove',run=0,dom='figTree';samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.5?'grove':r<0.8?'sparse':'open';run=3+Math.floor(rng()*4);dom=K.pickFrom(K.regionOf(s.p[1]),K.capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){if(rng()<0.8)tree(p[0],p[1],null,dom,low);if(rng()<0.8*DENS)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.12,null,dom,low);if(rng()<0.2*DENS)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.24,null,dom,low);if(rng()<0.12)tree(p[0]+(rng()-0.5)*0.3,p[1]+0.1,null,dom,true);}
      else if(mode==='sparse'){if(rng()<0.6)tree(p[0],p[1],null,dom,low);else under(p[0],p[1]);}else if(rng()<0.6)under(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{for(let k=0;k<2;k++)if(rng()<0.8*DENS)tree(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.16,null,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<14;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<0.4*DENS)tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.3);}});
  /* 3b. top up to the Bavarian tree count: scatter into any free ground until the target is met */
  {const TARGET=({A:96,B:108,C:60,D:70})[shape],cnt=()=>placed.filter(o=>o.cat==='tree').length;let guard=0;while(cnt()<TARGET&&guard++<9000){const c=G.centers[Math.floor(rng()*G.centers.length)],px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;tree(px,py,{scale:0.8+rng()*0.28},null,py>cy+0.3);}}
  /* 4. undergrowth, bricks and rubble, and a few market props (lower tiers only) */
  G.verts.filter(v=>v.junction).forEach(v=>{for(let k=0;k<2;k++)if(rng()<0.3)under(v.x+(rng()-0.5)*0.3,v.y+(rng()-0.5)*0.16);});
  interior.forEach(e=>{for(let k=0;k<2;k++)if(rng()<0.22)under(e.mid[0]+(rng()-0.5)*0.3,e.mid[1]+(rng()-0.5)*0.2);});
  outer.forEach(e=>{for(let k=0;k<2;k++)if(rng()<0.3)under(...onEdge(e,rng(),-0.19-rng()*0.1));});
  G.centers.forEach(c=>{for(let k=0;k<8;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.12)under(px,py);}});
  [['mudBricks',3],['limestone',2],['dyeVat',2],['marketStall',2],['clayTablets',1],['brazier',2],['clayJars',2]].forEach(([k,n])=>{for(let i=0;i<landCnt(n);i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,-(0.2+rng()*0.14));const pr=['dyeVat','marketStall','clayTablets','brazier','clayJars'].includes(k);place(k,p[0],p[1],pr?{minT:1,maxT:3,prop:true}:{minT:1});}});
  let pi=0;placed.filter(o=>o.prop).forEach(o=>{o.minT=pi++<4?1:2;});
  K.finish({tree:[0.18,0.4,0.62,0.82,1],shrub:[0.06,0.3,0.55,0.8,1],rock:[0.2,0.4,0.6,0.8,1],prop:[1,1,1,1,1],ruin:[0,0,0,0,0],struct:[0,0,0,0,0],wall:[0,0,0,0,0]},{});
  return BAB_PLAN_CACHE[shape]={G,objs:placed,gates:gates.map(o=>({x:(o.a[0]+o.b[0])/2,y:(o.a[1]+o.b[1])/2,cls:o.e.cls})),perimeter:P,rng};
}
/* ---- ground: desert and grassland mixed: sandy floor with big green sward patches, dry earth, sun dapples, pebbles, tufts and tiny flowers; a worn stone doorstep at each gate ---- */
function babylonGround(c,G,R,ox,oy,m,col,seed,plan,tier){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  for(let k=0;k<30;k++){const p=pt(),w=R*(0.55+r()*1.0);SOFT(c,p[0],p[1],w,w*0.4,'118,164,72',0.34);}              /* grassland */
  for(let k=0;k<22;k++){const p=pt(),w=R*(0.5+r()*0.9);SOFT(c,p[0],p[1],w,w*0.4,'236,208,128',0.3);}              /* desert sand */
  for(let k=0;k<10;k++){const p=pt(),w=R*(0.3+r()*0.5);SOFT(c,p[0],p[1],w,w*0.4,'158,118,64',0.18);}
  for(let k=0;k<22;k++){const p=pt(),w=R*(0.4+r()*0.7);SOFT(c,p[0],p[1],w,w*0.4,'52,110,52',0.2);}
  for(let k=0;k<8;k++){const p=pt(),w=R*(0.4+r()*0.7);SOFT(c,p[0],p[1],w,w*0.4,'255,246,190',0.18);}
  for(let k=0;k<190;k++){const p=pt(),h=R*(0.05+r()*0.06);for(let j=0;j<3;j++)TH.ln(c,[p[0],p[1]],[p[0]+(j-1)*h*0.5,p[1]-h],['#6fa04a','#86b856','#5a8e3e','#a8b45a'][(k+j)%4],R*0.011);}
  for(let k=0;k<60;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.012,R*0.009,['#f6efe0','#f2c230','#e86aa8','#5a8ae8'][k%4]);}
  for(let k=0;k<16;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.02,R*0.012,'#bba97a',r()*3);TH.ell(c,p[0]-R*0.004,p[1]-R*0.003,R*0.011,R*0.007,'#d8c8a0',r()*3);}
  (plan.gates||[]).forEach(g=>{const p=P([g.x,g.y]);SOFT(c,p[0],p[1]+R*0.04,R*0.34,R*0.13,'200,176,120',0.5);});
  c.restore();c.restore();
}
const BABYLON_THEME={id:'babylon',assets:BAB_ASSETS,plan:getBabylonPlan,ground:babylonGround,groundCol:'#c4b468',top:1.7,mx:0.85};
const BABYLON_TIER_NAMES=['Sparse','Light','Medium','Heavy','Immersive'];
function bakeLandBabylon(shape,tier,R,opts){return bakeLandTheme(BABYLON_THEME,shape,tier,R,opts);}
function drawLandBabylonBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandBabylonFront(ctx,x,y,land){const r=land.frontRect;ctx.drawImage(land.front,x-land.ox+r.x,y-land.oy+r.y,r.w,r.h);}
function landBabylonSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}

const PACK={bake:bakeLandBabylon,names:BABYLON_TIER_NAMES,plan:getBabylonPlan,park:'#c4b468'};
return Object.freeze({ bake: (shape, tier, radius, opts) => bakeLandBabylon(shape, tier === 4 ? 5 : tier, radius, opts), drawBack: drawLandBabylonBack, drawFront: (ctx, x, y, land) => land.sprites.slice().sort((a,b) => a.y-b.y).forEach(s => drawScenicSprite(ctx,s,x+s.x,y+s.y)) });
})(),
  egypt: (() => {
/* ===== THEME PACK CORE (shared by every theme pack; copy once into engine.js) ===== */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shade(hex, amt){let r,g,b;if(hex[0]==='r'){const m=hex.match(/[\d.]+/g);r=+m[0];g=+m[1];b=+m[2];}else{const n=parseInt(hex.slice(1),16);r=n>>16;g=(n>>8)&255;b=n&255;}const f=c=>Math.round(amt<0?c*(1+amt):c+(255-c)*amt);return `rgb(${f(r)},${f(g)},${f(b)})`;}
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


/* ===== SHARED HELPERS FOR THE ANCIENT PACKS ===== */
const NT=5;                                                         /* five scenery tiers in these packs */
const FLIP=(c,x,f,fn)=>{if(f){c.save();c.translate(x,0);c.scale(-1,1);c.translate(-x,0);fn();c.restore();}else fn();};
const BX=(c,x,y,u,x0,x1,y0,y1,z0,z1,col)=>TH.box(c,x,y,u,x0,x1,y0,y1,z0,z1,col,shade(col,-0.28),shade(col,0.16));
const SHD=(c,x,y,rx,rgb)=>{c.fillStyle='rgba('+(rgb||'70,44,18')+',.26)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const SOFT=(c,x,y,rx,ry,rgb,a)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(0.6,`rgba(${rgb},${a*0.55})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,7);c.fill();c.restore();};
const segDist=(x,y,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy;let t=l?((x-a[0])*dx+(y-a[1])*dy)/l:0;t=Math.max(0,Math.min(1,t));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);};
/* an irregular amoeba outline (closed polygon, game units) from a few random harmonics; rx, ry are the maximum half-extents */
function amoeba(cx,cy,rx,ry,seed,n,amp){amp=amp||1;const r=mulberry(seed),h=[[2,(0.2+r()*0.14)*amp,r()*6.28],[3,(0.14+r()*0.12)*amp,r()*6.28],[5,(0.07+r()*0.06)*amp,r()*6.28]],pts=[];n=n||28;let mx=0;const rad=[];for(let k=0;k<n;k++){const a=k/n*6.2832;let q=1;h.forEach(([f,amp,ph])=>q+=amp*Math.sin(f*a+ph));rad.push(q);mx=Math.max(mx,q);}
  for(let k=0;k<n;k++){const a=k/n*6.2832,q=rad[k]/mx;pts.push([cx+Math.cos(a)*rx*q,cy+Math.sin(a)*ry*q]);}return pts;}
function pathPoly(c,pts,close){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));if(close!==false)c.closePath();}
function smoothClosed(c,pts){const n=pts.length;c.beginPath();for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n],m=[(a[0]+b[0])/2,(a[1]+b[1])/2];if(i===0){const l=pts[n-1],m0=[(l[0]+a[0])/2,(l[1]+a[1])/2];c.moveTo(m0[0],m0[1]);}c.quadraticCurveTo(a[0],a[1],m[0],m[1]);}c.closePath();}
const inPoly=(p,x,y)=>{let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;};

/* ===== PLANNER TOOLKIT (shared by Egypt and Babylon): placement rules, tier assignment, layering ===== */
function planKit(shape,seed,T){
  const G=landGeometry(shape),rng=mulberry(seed),placed=[],bb=G.bbox,used={},A=T.assets;
  const cx=G.centers.reduce((a,c)=>a+c.x,0)/G.centers.length,cy=G.centers.reduce((a,c)=>a+c.y,0)/G.centers.length;
  const outer=G.edges.filter(e=>e.outer),top=outer.filter(e=>e.cls==='top'),sides=outer.filter(e=>e.cls==='side'),bottoms=outer.filter(e=>e.cls==='bottom'),interior=G.edges.filter(e=>!e.outer);
  const LKS=G.centers.length/12,landCnt=n=>Math.max(1,Math.round(n*LKS)),landThin=l=>{const n=Math.max(1,Math.round(l.length*LKS));return Array.from({length:n},(_,i)=>l[Math.floor((i+0.5)*l.length/n)]);};
  const onEdge=(e,t,off)=>[e.a[0]+(e.b[0]-e.a[0])*t+e.n[0]*off,e.a[1]+(e.b[1]-e.a[1])*t+e.n[1]*off];
  const K={G,rng,placed,used,bb,cx,cy,outer,top,sides,bottoms,interior,LKS,landCnt,landThin,onEdge,obstacles:[]};
  K.inLand=T.inLand?T.inLand(G,K):(x,y)=>G.centers.some(c=>hexInside(x-c.x,y-c.y,1.3));
  K.free=(x,y,rho)=>G.centers.every(c=>{const dx=(x-c.x)/(LAND_KEEP.rx+rho*0.4),dy=(y-c.y)/(LAND_KEEP.ry+rho*0.25);return dx*dx+dy*dy>=1;})&&K.obstacles.every(f=>f(x,y,rho));
  K.clearOthers=(x,y,rho)=>placed.every(o=>Math.hypot(x-o.x,(y-o.y)*1.7)>=(rho+o.rho*(o.clear||1))*0.72);
  K.pickFrom=(w,ok)=>{for(let g=0;g<12;g++){let t=rng(),acc=0,pick=Object.keys(w)[0];for(const k in w){acc+=w[k];if(t<=acc){pick=k;break;}}if(!ok||ok(pick))return pick;}return Object.keys(w)[0];};
  K.capOk=k=>!(T.cap&&T.cap[k]&&(used[k]||0)>=Math.max(1,Math.round(T.cap[k]*(T.capScale?LKS:1))));
  K.regionOf=y=>{const n=(y-bb.minY)/(bb.maxY-bb.minY);return n<0.34?T.region.top:n<0.68?T.region.mid:T.region.bottom;};
  K.place=(kind,x,y,extra)=>{const D=A[kind];if(!D)throw new Error('unknown asset '+kind);const mul=D.cat==='tree'?(T.treeMul||1):D.cat==='shrub'?(T.shrubMul||1):1,sc=((extra&&extra.scale)||(D.cat==='tree'?0.88+rng()*0.4:D.cat==='shrub'?0.9+rng()*0.3:1))*mul,rho=D.rho*sc;
    for(let t=0;t<8;t++){const jit=!(extra&&extra.fixed)&&t,px=x+(jit?(rng()-0.5)*0.12*t:0),py=y+(jit?(rng()-0.5)*0.09*t:0);if(!K.inLand(px,py)||!K.free(px,py,rho)||!K.clearOthers(px,py,rho))continue;
      if((D.cat==='rock'||D.cat==='shrub'||D.cat==='prop')&&placed.some(o=>o.noSouth&&Math.abs(px-o.x)<0.3&&py-o.y>-0.05&&py-o.y<0.36))continue;
      const o=Object.assign({kind,x:px,y:py,rho,scale:sc,v:Math.floor(rng()*1000),cat:D.cat,pri:rng(),minT:1,maxT:9},extra||{});o.scale=sc;placed.push(o);used[kind]=(used[kind]||0)+1;return o;}return null;};
  K.tree=(x,y,extra,dom,low)=>{if(low&&T.low){const L=T.low[Math.floor(rng()*T.low.length)];return K.place(L[0],x,y,Object.assign({},extra||{},{scale:L[1]*(0.9+rng()*0.2)}));}return K.place(dom&&rng()<0.55&&K.capOk(dom)?dom:K.pickFrom(K.regionOf(y),K.capOk),x,y,extra||{});};
  K.under=(x,y,extra)=>K.place(T.under[Math.floor(rng()*T.under.length)],x,y,extra||{});
  /* farthest-point spacing so structures never clump */
  K.chosen=[];
  K.spread=(k,pool,extra)=>{const ranked=pool.map(p=>({p,d:Math.min(1e9,...K.chosen.map(q=>Math.hypot(p[0]-q[0],(p[1]-q[1])*1.4)))+rng()*0.22})).sort((a,b)=>b.d-a.d);for(let n=0;n<Math.min(14,ranked.length);n++){const o=K.place(k,ranked[n].p[0],ranked[n].p[1],extra);if(o){K.chosen.push([o.x,o.y]);return o;}}return null;};
  /* shared finishing: assign each object its tier, keep trees dominant where asked, set front/back layers, sort */
  K.finish=(cuts,opts)=>{opts=opts||{};
    placed.forEach(o=>{const c=cuts[o.cat]||cuts.tree;let t=1;while(t<NT&&o.pri>c[t-1])t++;o.tier=Math.max(t,o.minT);if(o.fixedTier)o.tier=o.minT;});
    const count=t=>{const vis=placed.filter(o=>o.tier<=t&&t<=o.maxT),tr=vis.filter(o=>o.cat==='tree').length;return{n:vis.length,tr};};
    if(opts.treeShare)for(let t=1;t<=NT;t++){let guard=0;while(guard++<400){const c=count(t);if(c.tr/Math.max(1,c.n)>=opts.treeShare)break;const pool=placed.filter(o=>o.tier<=t&&t<=o.maxT&&!o.fixedTier),cand=(pool.filter(o=>o.cat==='shrub').sort((a,b)=>b.pri-a.pri)[0])||(pool.filter(o=>o.prop&&o.minT>1).sort((a,b)=>b.pri-a.pri)[0]);if(!cand)break;cand.tier=Math.min(NT,cand.tier+1);}}
    placed.forEach(o=>{if(o.layer)return;const over=G.centers.filter(c=>Math.abs(o.x-c.x)<1.0);o.layer=over.length&&o.y>Math.max(...over.map(c=>c.y))+0.05?'front':'back';});
    placed.sort((a,b)=>a.y-b.y);return placed;};
  return K;
}

/* ===== GENERIC BAKER (any theme object {id, assets, plan, ground, groundCol, top}); tiers 1..5 ===== */

function bakeLandTheme(T,shape,tier,R,opts){
  opts=opts||{};const sc=opts.scale||getBakeScale(),m=opts.mirrorX?-1:1,ground=opts.ground||T.groundCol,clr=(opts.clear||[]).map(p=>[Math.min(p[0],p[1]),Math.max(p[0],p[1])]),key=[T.id,shape,tier,R,m,ground,sc,JSON.stringify(clr),JSON.stringify(opts.clearTiles||[])].join('|');const cached=revisedLandCache.get(key);if(cached)return cached;
  const plan=T.plan(shape),G=plan.G,bb=G.bbox,x0=m>0?bb.minX:-bb.maxX,x1=m>0?bb.maxX:-bb.minX,mx=T.mx||0.75,top=T.top||1.35,bot=T.bot||0.85;
  const W=Math.ceil((x1-x0+2*mx)*R),H=Math.ceil((bb.maxY-bb.minY+top+bot)*R),ox=(-x0+mx)*R,oy=(-bb.minY+top)*R,u=R*0.075;
  const mk=()=>{const cv=document.createElement('canvas');cv.width=Math.ceil(W*sc);cv.height=Math.ceil(H*sc);const g=cv.getContext('2d');g.scale(sc,sc);return[cv,g];};
  const [back,cb]=mk();T.ground(cb,G,R,ox,oy,m,ground,({A:11,B:22,C:33,D:44})[shape],plan,tier);
  const bridges=clr.map(([i,j])=>[G.centers[i],G.centers[j]]),vis=plan.objs.filter(o=>o.tier<=tier&&tier<=o.maxT&&!bridges.some(([a,c])=>westCapsuleHit(a,c,o.x,o.y,o.rho))&&!(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));
  const drw=(cx,o)=>{const A=T.assets[o.kind];if(A.drawEx)A.drawEx(cx,o,ox,oy,m,R,u);else A.draw(cx,ox+m*o.x*R,oy+o.y*R,u*(o.scale||1),o.v);};

  const sprites = vis.map(o => {
    const asset = T.assets[o.kind], base = u * (o.scale || 1);
    const reach = Math.max(asset.reach || 4, (asset.tall || 9) * 0.45);
    const span = [o.p1, o.p2].filter(Boolean).reduce((max, p) =>
      Math.max(max, Math.abs(p[0] - o.x) * R / 8, Math.abs(p[1] - o.y) * R / 4), 0);
    const unit = Math.max(base, base * reach / 8, span);
    return { x: m * o.x * R, y: o.y * R, unit, draw: (ctx, x, y) => {
      ctx.save();
      ctx.translate(x - (ox + m * o.x * R), y - (oy + o.y * R));
      drw(ctx,o);
      ctx.restore();
    }};
  });
  const front = document.createElement('canvas');
  front.width = front.height = 1;
  const frontRect = {x: 0, y: 0, w: 1, h: 1};
  const centers = G.centers.map(c => ({x: ox + m * c.x * R, y: oy + c.y * R, row: c.row}));
  return revisedLandCache.set(key, {back, front, frontRect, w: W, h: H, ox, oy, centers, sc, shape, tier, mirrorX: m < 0, sprites});
}
function westCapsuleHit(a,b,x,y,rho){const A=LAND_KEEP.rx+rho*0.55,B=LAND_KEEP.ry+rho*0.28,dx=b.x-a.x,dy=b.y-a.y,q=dx*dx/(A*A)+dy*dy/(B*B),t=Math.max(0,Math.min(1,(x*0+((x-a.x)*dx/(A*A)+(y-a.y)*dy/(B*B)))/q)),ex=(x-a.x-t*dx)/A,ey=(y-a.y-t*dy)/B;return ex*ex+ey*ey<1;}

/* ===== EGYPT ASSET LIBRARY: golden desert, date palms, dunes, papyrus marshes, mud huts, obelisks and small monuments (NO pyramids: those are the facilities).
   draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R*scale, v = variant seed ===== */
const EG={sand:'#e2c068',sandD:'#c49a44',sandL:'#f0d98c',stone:'#d9bd86',stoneD:'#b99a62',stoneL:'#ecd9a8',mud:'#b58a58',mudD:'#8d6538',mudL:'#cca372',gold:'#e8b82a',turq:'#2fa59a',ochre:'#b9552f',palm:'#4f8a38',palmD:'#3a6e2c',palmL:'#7fb54a'};
const EGFROND=(c,x,y,ang,len,u,col,mid,droop,lf)=>{const ex=x+Math.cos(ang)*len,ey=y+Math.sin(ang)*len*0.55+len*(droop||0.4),mx=x+Math.cos(ang)*len*0.5,my=y+Math.sin(ang)*len*0.62-len*0.22;
  c.lineCap='round';c.strokeStyle=mid;c.lineWidth=u*0.16;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(mx,my,ex,ey);c.stroke();
  const n=lf||9;for(let k=1;k<=n;k++){const t=k/(n+1),q=1-t,px=q*q*x+2*q*t*mx+t*t*ex,py=q*q*y+2*q*t*my+t*t*ey,s=len*0.27*Math.sin(Math.PI*(0.12+t*0.8))*(1-t*0.35),dx=Math.cos(ang),sy=1;
    TH.ln(c,[px,py],[px-s*0.34+dx*s*0.1,py+s*0.62],col,u*0.17);TH.ln(c,[px,py],[px+s*0.34+dx*s*0.1,py+s*0.62],col,u*0.17);}};
/* jungle-style palm (arching fronds, coconuts): replaces the flat-crowned date palm in the Egypt land */
const EGJS=(c,x,y,rx)=>{c.fillStyle='rgba(12,40,22,.28)';c.beginPath();c.ellipse(x+rx*0.26,y+rx*0.1,rx,rx*0.36,0,0,7);c.fill();};
const EGJFROND=(c,x,y,ang,len,u,col,mid,droop)=>{const ex=x+Math.cos(ang)*len,ey=y+Math.sin(ang)*len*0.6+len*(droop||0.35),mx=x+Math.cos(ang)*len*0.55,my=y+Math.sin(ang)*len*0.7-len*0.25;
  c.lineCap='round';c.strokeStyle=col;c.lineWidth=u*0.42;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(mx,my,ex,ey);c.stroke();c.strokeStyle=mid;c.lineWidth=u*0.1;c.stroke();
  for(let k=1;k<7;k++){const t=k/7,q=1-t,px=q*q*x+2*q*t*mx+t*t*ex,py=q*q*y+2*q*t*my+t*t*ey,s=len*0.2*(1-t*0.6);TH.ln(c,[px,py],[px+Math.sin(ang)*s*0.5-Math.cos(ang)*s*0.2,py+s*0.55],col,u*0.14);TH.ln(c,[px,py],[px-Math.sin(ang)*s*0.5-Math.cos(ang)*s*0.2,py+s*0.55],col,u*0.14);}};

const EGT={
  junglePalm:{cat:'tree',rho:0.07,draw(c,x,y,u,v){const r=mulberry(v*11+2),H=u*(5.2+r()*1.6),lean=(r()-0.5)*u*2.0;EGJS(c,x,y,u*1.3);c.lineCap='round';c.strokeStyle='#a08c68';c.lineWidth=u*0.62;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*0.1,y-H*0.5,x+lean,y-H);c.stroke();c.strokeStyle='#bba67e';c.lineWidth=u*0.2;c.beginPath();c.moveTo(x-u*0.15,y);c.quadraticCurveTo(x+lean*0.1-u*0.15,y-H*0.5,x+lean-u*0.1,y-H);c.stroke();
    for(let k=1;k<9;k++){const t=k/9,q=1-t,px=q*q*x+2*q*t*(x+lean*0.1)+t*t*(x+lean),py=q*q*y+2*q*t*(y-H*0.5)+t*t*(y-H);TH.ln(c,[px-u*0.32,py],[px+u*0.32,py+u*0.05],'rgba(60,40,20,.35)',u*0.06);}
    const cx=x+lean,cy=y-H;[-2.9,-2.35,-1.85,-1.3,-0.7,-0.2].forEach((a,i)=>{EGJFROND(c,cx,cy,a,u*(2.5+r()*0.5),u,i%2?'#2f7a3a':'#3a8a42','#8fcf6a',0.3);EGJFROND(c,cx,cy,Math.PI-a-Math.PI*1.0+Math.PI,u*(2.3+r()*0.5),u,i%2?'#3a8a42':'#2f7a3a','#8fcf6a',0.3);});[[-0.25,0.2],[0.25,0.25],[0,0.35]].forEach(([dx,dy])=>TH.ell(c,cx+dx*u,cy+dy*u,u*0.24,u*0.26,'#6b4a22'));}},
  datePalm:{cat:'tree',rho:0.07,tall:13,reach:5.5,draw(c,x,y,u,v){const r=mulberry(v*11+4),H=u*(6.8+r()*2.4),lean=(r()-0.5)*u*2.8,tw=u*0.55;SHD(c,x,y,u*1.4);
    const P=t=>{const q=1-t;return[q*q*x+2*q*t*(x+lean*0.12)+t*t*(x+lean),q*q*y+2*q*t*(y-H*0.55)+t*t*(y-H)];};const Lf=[],Rt=[];for(let k=0;k<=9;k++){const t=k/9,p=P(t),w=tw*(1-0.32*t)*0.5;Lf.push([p[0]-w,p[1]]);Rt.push([p[0]+w,p[1]]);}
    TH.poly(c,Lf.concat(Rt.reverse()),'#a98a56');c.strokeStyle='#cdb07a';c.lineWidth=u*0.14;c.beginPath();Lf.forEach((p,i)=>i?c.lineTo(p[0]+u*0.1,p[1]):c.moveTo(p[0]+u*0.1,p[1]));c.stroke();
    for(let k=1;k<12;k++){const p=P(k/12);TH.ln(c,[p[0]-u*0.26,p[1]+u*0.05],[p[0]+u*0.12,p[1]-u*0.07],'rgba(70,46,20,.4)',u*0.07);TH.ln(c,[p[0]+u*0.26,p[1]+u*0.05],[p[0]-u*0.1,p[1]-u*0.07],'rgba(70,46,20,.3)',u*0.06);}
    const cx=x+lean,cy=y-H,n=15;for(let i=0;i<n;i++){const a=-Math.PI*1.04+i/(n-1)*Math.PI*1.08+(r()-0.5)*0.12,l=u*(3.1+r()*0.8),dk=i%2;EGFROND(c,cx,cy,a,l,u*1.25,dk?EG.palmD:EG.palm,'#9fcf6a',0.4+0.24*Math.abs(Math.cos(a)),12);}
    for(let i=0;i<6;i++){const a=-Math.PI*0.92+i/5*Math.PI*0.84;EGFROND(c,cx,cy,a,u*(2.2+r()*0.4),u*1.15,EG.palmL,'#a8d874',0.12,9);}
    for(let k=0;k<5;k++)TH.ell(c,cx+(k-2)*u*0.2,cy+u*(0.22+Math.abs(k-2)*0.05),u*0.17,u*0.22,k%2?'#b4622a':'#8f4a1e');}},
  doumPalm:{cat:'tree',rho:0.08,tall:11,reach:5,draw(c,x,y,u,v){const r=mulberry(v*7+3),H1=u*(2.6+r()*0.8),H2=u*(2.4+r()*0.8),sx=u*(1.2+r()*0.6);SHD(c,x,y,u*1.5);const fan=(px,py,s)=>{for(let i=0;i<11;i++){const a=-Math.PI+0.1+i/10*(Math.PI-0.2),l=u*s*(1.5+r()*0.3);c.save();c.translate(px,py);c.rotate(a+Math.PI/2);TH.ell(c,0,-l*0.6,u*0.5*s,l*0.62,i%2?'#6fa83e':'#58903a');TH.ln(c,[0,0],[0,-l*1.18],'#a8d46e',u*0.06);c.restore();}};
    TH.ln(c,[x,y],[x,y-H1],'#9a7c4c',u*0.5);const bx=x,by=y-H1;TH.ln(c,[bx,by],[bx-sx,by-H2],'#9a7c4c',u*0.36);TH.ln(c,[bx,by],[bx+sx,by-H2*0.9],'#9a7c4c',u*0.36);TH.ell(c,bx,by,u*0.3,u*0.2,'#7a5e36');fan(bx-sx,by-H2,1.0);fan(bx+sx,by-H2*0.9,0.95);for(let k=0;k<3;k++)TH.ell(c,bx-sx+(k-1)*u*0.3,by-H2+u*0.4,u*0.22,u*0.25,'#7a4a24');}},
  sycamoreFig:{cat:'tree',rho:0.1,tall:9,reach:5.5,draw(c,x,y,u,v){const r=mulberry(v*13+1);SHD(c,x,y,u*2.6);TH.poly(c,[[x-u*0.55,y],[x-u*0.3,y-u*2.2],[x+u*0.3,y-u*2.2],[x+u*0.6,y]],'#7a5836');TH.ln(c,[x-u*0.1,y],[x-u*0.1,y-u*2.0],'#946f48',u*0.2);
    [[-1.6,-3.6,2.1,1.5],[1.7,-3.5,2.0,1.4],[0,-5.0,2.4,1.7],[-0.2,-3.3,2.5,1.5]].forEach(([dx,dy,rx,ry],i)=>TH.blob(c,x+dx*u,y+dy*u,rx*u,ry*u,['#4f8a3a','#5f9a40','#3f7a32','#6aa646'][i],r,9));}},
  papyrus:{cat:'shrub',rho:0.05,tall:7,reach:3,draw(c,x,y,u,v){const r=mulberry(v*5+2);SHD(c,x,y,u*1.4,'30,60,30');const n=7+Math.floor(r()*3);for(let k=0;k<n;k++){const bx=x+(k-n/2)*u*0.3+(r()-0.5)*u*0.2,H=u*(3.6+r()*2.2),ln=(r()-0.5)*u*0.8,col=k%2?'#7fa63a':'#97bc4a';TH.ln(c,[bx,y],[bx+ln,y-H],col,u*0.17);
      for(let j=0;j<9;j++){const a=-Math.PI*0.95+j/8*Math.PI*0.9;TH.ln(c,[bx+ln,y-H],[bx+ln+Math.cos(a)*u*0.9,y-H+Math.sin(a)*u*0.55+u*0.28],j%2?'#6e9632':'#8fb344',u*0.07);}}}},
  reeds:{cat:'shrub',rho:0.045,tall:5,reach:3,draw(c,x,y,u,v){const r=mulberry(v*3+7);SHD(c,x,y,u*1.2,'40,50,20');const n=9+Math.floor(r()*4);for(let k=0;k<n;k++){const bx=x+(k-n/2)*u*0.22+(r()-0.5)*u*0.15,H=u*(2.4+r()*1.8),ln=(r()-0.5)*u*0.7;TH.ln(c,[bx,y],[bx+ln,y-H],k%2?'#a9a24a':'#b8b45c',u*0.12);if(k%4===0){TH.ell(c,bx+ln,y-H-u*0.2,u*0.12,u*0.32,'#6b4a2a');}}}},
  dryScrub:{cat:'shrub',rho:0.05,tall:3,reach:2.6,draw(c,x,y,u,v){const r=mulberry(v*9+1);SHD(c,x,y,u*1.2);for(let k=0;k<10;k++){const a=-Math.PI*0.95+k/9*Math.PI*0.9,l=u*(0.9+r()*0.8);TH.ln(c,[x+(r()-0.5)*u*0.4,y],[x+Math.cos(a)*l,y+Math.sin(a)*l*0.8],k%3?'#a7a152':'#8c8a45',u*0.15);}TH.blob(c,x,y-u*0.3,u*0.9,u*0.45,'#98a050',r,7);}},
  tamarisk:{cat:'shrub',rho:0.06,tall:5,reach:3.2,draw(c,x,y,u,v){const r=mulberry(v*17+3);SHD(c,x,y,u*1.6);TH.ln(c,[x,y],[x-u*0.2,y-u*1.4],'#7a5a3a',u*0.3);for(let k=0;k<6;k++){const bx=x+(r()-0.5)*u*1.6,by=y-u*(1.3+r()*1.4);TH.blob(c,bx,by,u*(0.8+r()*0.4),u*(0.55+r()*0.25),k%2?'#8fb0a0':'#7da08f',r,8);if(k%2===0)TH.ell(c,bx+u*0.2,by-u*0.3,u*0.25,u*0.15,'#e8a0b4');}}},
  dune:{cat:'rock',rho:0.3,tall:4,reach:9,draw(c,x,y,u,v){const r=mulberry(v*5+3),W=u*(5.6+r()*3.0),Hh=u*(1.6+r()*1.0),cr=(r()-0.3)*W*0.35;
    c.fillStyle='rgba(150,98,34,.22)';c.beginPath();c.ellipse(x+W*0.2,y+Hh*0.1,W*1.02,Hh*0.3,0,0,7);c.fill();
    c.save();c.beginPath();c.moveTo(x-W,y+Hh*0.05);c.bezierCurveTo(x-W*0.55,y-Hh*0.1,x-W*0.3+cr,y-Hh*0.95,x+cr,y-Hh);c.bezierCurveTo(x+cr+W*0.18,y-Hh*1.04,x+W*0.5,y-Hh*0.42,x+W*0.92,y+Hh*0.04);c.quadraticCurveTo(x+W*0.1,y+Hh*0.3,x-W,y+Hh*0.05);c.closePath();
    const g=c.createLinearGradient(x-W,y-Hh,x+W*0.9,y+Hh*0.1);g.addColorStop(0,'#faebb4');g.addColorStop(0.45,'#ecc96c');g.addColorStop(1,'#b98a34');c.fillStyle=g;c.fill();c.clip();
    c.fillStyle='rgba(150,90,30,.52)';c.beginPath();c.moveTo(x+cr,y-Hh);c.bezierCurveTo(x+cr+W*0.18,y-Hh*1.04,x+W*0.5,y-Hh*0.42,x+W*0.92,y+Hh*0.04);c.lineTo(x+cr*0.4,y+Hh*0.3);c.bezierCurveTo(x+cr+W*0.02,y-Hh*0.3,x+cr+W*0.02,y-Hh*0.7,x+cr,y-Hh);c.closePath();c.fill();
    c.strokeStyle='rgba(130,86,30,.26)';c.lineWidth=u*0.08;for(let k=1;k<5;k++){c.beginPath();c.moveTo(x-W*0.95,y+Hh*(0.0+0.04*k));c.bezierCurveTo(x-W*0.4,y-Hh*(0.15+0.14*k),x+W*0.1,y-Hh*(0.28+0.1*k),x+W*0.85,y+Hh*0.02);c.stroke();}
    c.strokeStyle='rgba(255,250,220,.85)';c.lineWidth=u*0.16;c.beginPath();c.moveTo(x-W*0.6,y-Hh*0.28);c.bezierCurveTo(x-W*0.3+cr,y-Hh*0.86,x+cr-W*0.08,y-Hh*0.98,x+cr,y-Hh);c.stroke();c.restore();}},
  sandRocks:{cat:'rock',rho:0.08,tall:3,reach:3,draw(c,x,y,u,v){const r=mulberry(v*3+5);[[-0.9,0.1,0.9,0.7],[0.8,0.2,0.75,0.6],[0,-0.3,0.65,0.55]].forEach(([dx,dy,rx,ry],i)=>{const px=x+dx*u,py=y+dy*u,sx=u*rx,sy=u*ry*(1+r()*0.2),col=['#c6a06a','#b58d58','#d3b07a'][i];TH.ell(c,px+sx*0.15,py+sy*0.3,sx*1.05,sy*0.45,'rgba(80,50,20,.26)');TH.poly(c,[[px-sx,py],[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px-sx*0.6,py+sy*0.2]],col);TH.poly(c,[[px+sx*0.25,py-sy*0.98],[px+sx*0.95,py-sy*0.35],[px+sx,py+sy*0.1],[px+sx*0.2,py+sy*0.05]],shade(col,-0.28));TH.poly(c,[[px-sx*0.9,py-sy*0.6],[px-sx*0.35,py-sy*1.05],[px+sx*0.4,py-sy*0.95],[px+sx*0.1,py-sy*0.5],[px-sx*0.5,py-sy*0.45]],shade(col,0.2));});}},
  marsh:{cat:'water',rho:0.22,tall:2,reach:7,drawEx(c,o,ox,oy,m,R,u){this.draw(c,ox+m*o.x*R,oy+o.y*R,u,o.v,o.rx*R,o.ry*R);},draw(c,x,y,u,v,sx,sy){/* amoeba swamp pond; sx, sy = max half extents in px */ const r=mulberry(v*3+11),rx=sx||u*4.4,ry=sy||u*3.0,P=amoeba(x,y,rx,ry,v+31,36,1.4);
    /* a lush grass ring round the whole shore, fading into the sand */
    SOFT(c,x,y,rx*2.6,ry*2.2,'96,150,60',0.34);const Gp=k=>P.map(p=>[x+(p[0]-x)*k,y+(p[1]-y)*k]);smoothClosed(c,Gp(1.95));c.fillStyle='rgba(118,164,66,.68)';c.fill();smoothClosed(c,Gp(1.6));c.fillStyle='rgba(104,156,58,.9)';c.fill();smoothClosed(c,Gp(1.32));c.fillStyle='rgba(88,142,52,.9)';c.fill();
    for(let k=0;k<70;k++){const a=r()*6.283,rr=1.12+r()*0.85,gx=x+Math.cos(a)*rx*rr,gy=y+Math.sin(a)*ry*rr,h=u*(0.5+r()*0.5);for(let j=0;j<3;j++)TH.ln(c,[gx,gy],[gx+(j-1)*h*0.45,gy-h],['#6fa046','#86b856','#5a8e3e'][(k+j)%3],u*0.13);if(k%9===0)TH.ell(c,gx,gy-u*0.3,u*0.12,u*0.1,['#f6efe0','#f2c230','#e86aa8'][k%3]);}
    SOFT(c,x,y,rx*1.5,ry*1.5,'96,110,50',0.22);smoothClosed(c,P.map(p=>[x+(p[0]-x)*1.12,y+(p[1]-y)*1.12]));c.fillStyle='#8d7a48';c.fill();smoothClosed(c,P.map(p=>[x+(p[0]-x)*1.05,y+(p[1]-y)*1.05]));c.fillStyle='#6f7f43';c.fill();
    smoothClosed(c,P);const g=c.createRadialGradient(x-rx*0.2,y-ry*0.3,0,x,y,Math.max(rx,ry));g.addColorStop(0,'#7da57c');g.addColorStop(0.6,'#5f8a68');g.addColorStop(1,'#456f54');c.fillStyle=g;c.fill();
    c.save();smoothClosed(c,P);c.clip();for(let k=0;k<7;k++)TH.blob(c,x+(r()-0.5)*rx*1.4,y+(r()-0.5)*ry*1.3,u*(0.5+r()*0.6),u*(0.22+r()*0.2),'rgba(120,160,60,.55)',r,6);
    for(let k=0;k<6;k++){const px=x+(r()-0.5)*rx*1.2,py=y+(r()-0.5)*ry*1.1;TH.ell(c,px,py,u*0.42,u*0.2,'#4f8f45');if(k%2===0){TH.ell(c,px,py-u*0.06,u*0.17,u*0.1,k%4===0?'#f6f0e4':'#f0a6c0');}}
    c.strokeStyle='rgba(235,248,235,.4)';c.lineWidth=u*0.08;c.beginPath();c.ellipse(x-rx*0.1,y-ry*0.1,rx*0.55,ry*0.4,0,Math.PI*0.95,Math.PI*1.7);c.stroke();c.restore();}},
};

/* ---- Egypt part 2: monuments, huts and props ---- */
const EGCYL=(c,x,y,rx,ry,h,cols)=>{const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,cols[0]);g.addColorStop(0.55,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y);c.lineTo(x-rx,y-h);c.ellipse(x,y-h,rx,ry,0,Math.PI,0,false);c.lineTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI,false);c.closePath();c.fill();c.fillStyle=cols[0];c.beginPath();c.ellipse(x,y-h,rx,ry,0,0,7);c.fill();c.fillStyle='rgba(255,255,255,.16)';c.beginPath();c.ellipse(x,y-h,rx*0.82,ry*0.8,0,0,7);c.fill();};
const EGTAPER=(c,I,cx,cy,b0,b1,z0,z1,col)=>{TH.poly(c,[I(cx-b0,cy+b0,z0),I(cx+b0,cy+b0,z0),I(cx+b1,cy+b1,z1),I(cx-b1,cy+b1,z1)],col);TH.poly(c,[I(cx+b0,cy-b0,z0),I(cx+b0,cy+b0,z0),I(cx+b1,cy+b1,z1),I(cx+b1,cy-b1,z1)],shade(col,-0.26));TH.poly(c,[I(cx-b1,cy-b1,z1),I(cx+b1,cy-b1,z1),I(cx+b1,cy+b1,z1),I(cx-b1,cy+b1,z1)],shade(col,0.18));};
const EGGLYPH=(c,I,face,u,r,n,z0,z1,span,col)=>{for(let k=0;k<n;k++){const t=k/(n-1||1),z=z0+(z1-z0)*t,w=span*(0.25+0.75*r()),a=face==='L'?I(-w,0.0,z):I(0,-w,z),b=face==='L'?I(w,0.0,z):I(0,w,z);TH.ln(c,a,b,col||'rgba(70,40,12,.5)',u*0.07);if(r()<0.5)TH.ell(c,face==='L'?I(-span*0.5+r()*span,0,z+0.12)[0]:I(0,-span*0.5+r()*span,z+0.12)[0],face==='L'?I(0,0,z+0.12)[1]:I(0,0,z+0.12)[1],u*0.07,u*0.07,col||'rgba(70,40,12,.5)');}};
const EGT2={
  obelisk:{cat:'ruin',rho:0.07,tall:14,reach:3.5,draw(c,x,y,u,v){const r=mulberry(v*7+1),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),H=7.4+r()*1.8,pink=v%3===0,col=pink?'#cf9279':'#e4cf9a',base='#c6ab74';SHD(c,x,y,u*1.9);
    BX(c,x,y,u,-0.9,0.9,-0.9,0.9,0,0.45,base);BX(c,x,y,u,-0.7,0.7,-0.7,0.7,0.45,0.8,shade(base,0.06));EGTAPER(c,I,0,0,0.5,0.3,0.8,H,col);
    TH.poly(c,[I(-0.3,0.3,H),I(0.3,0.3,H),I(0,0,H+1.1)],pink?'#e2b196':'#f2e0ae');TH.poly(c,[I(0.3,-0.3,H),I(0.3,0.3,H),I(0,0,H+1.1)],pink?'#b97a62':'#c9ae74');TH.poly(c,[I(-0.3,0.3,H),I(0.3,0.3,H),I(0,0,H+1.1)],null);
    const tip=[I(-0.1,0.1,H+0.75),I(0.1,0.1,H+0.75),I(0,0,H+1.1)];TH.poly(c,tip,'#f0c93a');
    EGGLYPH(c,(X,Y,Z)=>I(X*0.5+0,0.42-0.003*Z+0*Y,Z),'L',u,r,9,1.2,H-0.9,0.12,pink?'rgba(90,40,22,.5)':'rgba(96,64,24,.5)');}},
  sphinx:{cat:'ruin',rho:0.12,tall:7,reach:6,draw(c,x,y,u,v){const r=mulberry(v*5+9);SHD(c,x,y,u*3.8);FLIP(c,x,v&1,()=>{const st='#dcbb7c',sd='#b4905a',sl='#efd69e';
    TH.poly(c,[[x-u*4.4,y+u*0.05],[x+u*5.4,y+u*0.05],[x+u*4.9,y+u*0.5],[x-u*3.9,y+u*0.5]],'#bfa064');
    c.beginPath();c.moveTo(x-u*3.9,y);c.bezierCurveTo(x-u*4.2,y-u*1.2,x-u*3.5,y-u*2.2,x-u*2.3,y-u*2.1);c.bezierCurveTo(x-u*1.1,y-u*1.9,x+u*0.3,y-u*1.95,x+u*1.0,y-u*2.2);c.bezierCurveTo(x+u*1.4,y-u*2.9,x+u*1.5,y-u*3.3,x+u*1.7,y-u*3.9);c.lineTo(x+u*3.1,y-u*3.7);c.bezierCurveTo(x+u*3.0,y-u*3.0,x+u*2.7,y-u*2.4,x+u*2.7,y-u*1.8);c.lineTo(x+u*5.0,y-u*0.9);c.lineTo(x+u*5.0,y);c.closePath();
    const g=c.createLinearGradient(x-u*4,y-u*3,x+u*5,y);g.addColorStop(0,sl);g.addColorStop(0.55,st);g.addColorStop(1,sd);c.fillStyle=g;c.fill();
    c.strokeStyle='rgba(110,74,30,.35)';c.lineWidth=u*0.08;c.beginPath();c.moveTo(x-u*3.3,y-u*0.3);c.bezierCurveTo(x-u*3.0,y-u*1.4,x-u*2.2,y-u*1.6,x-u*1.6,y-u*0.5);c.stroke();c.beginPath();c.moveTo(x+u*2.8,y-u*1.6);c.lineTo(x+u*4.8,y-u*0.3);c.moveTo(x+u*3.6,y-u*1.1);c.lineTo(x+u*3.7,y);c.stroke();
    for(let k=0;k<3;k++)TH.ln(c,[x+u*(4.2+k*0.25),y-u*0.5],[x+u*(4.3+k*0.25),y],'rgba(110,74,30,.4)',u*0.07);
    const hx=x+u*2.45,hy=y-u*4.6;TH.poly(c,[[hx-u*0.9,hy-u*0.9],[hx+u*0.9,hy-u*0.9],[hx+u*1.25,hy+u*1.3],[hx+u*0.6,hy+u*1.15],[hx-u*0.6,hy+u*1.15],[hx-u*1.25,hy+u*1.3]],'#e8c14a');for(let k=0;k<5;k++)TH.ln(c,[hx-u*0.8+k*u*0.4,hy-u*0.85],[hx-u*1.1+k*u*0.55,hy+u*1.15],'#3a5fa0',u*0.13);
    TH.ell(c,hx+u*0.05,hy+u*0.1,u*0.58,u*0.72,st);TH.ell(c,hx+u*0.3,hy+u*0.0,u*0.07,u*0.09,'#3a2a14');TH.ln(c,[hx+u*0.1,hy+u*0.5],[hx+u*0.5,hy+u*0.5],'#8a5a30',u*0.09);TH.poly(c,[[hx-u*0.1,hy+u*0.7],[hx+u*0.3,hy+u*0.7],[hx+u*0.2,hy+u*1.5],[hx-u*0.1,hy+u*1.4]],'#3a5fa0');TH.ell(c,hx,hy-u*0.95,u*0.1,u*0.13,'#d9433b');});}},
  seatedStatue:{cat:'ruin',rho:0.1,tall:10,reach:4.5,draw(c,x,y,u,v){const r=mulberry(v*9+4),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),st='#d6b980',gold='#e8b82a';SHD(c,x,y,u*2.6);FLIP(c,x,v&1,()=>{BX(c,x,y,u,-1.6,1.6,-1.2,1.2,0,0.5,'#c2a56c');BX(c,x,y,u,-1.2,1.2,-0.9,0.9,0.5,2.3,st);BX(c,x,y,u,-0.9,0.9,-0.6,0.6,2.3,5.0,st);
    BX(c,x,y,u,-1.15,-0.55,0.55,1.35,2.3,3.0,shade(st,-0.06));BX(c,x,y,u,0.55,1.15,0.55,1.35,2.3,3.0,shade(st,-0.06));
    const hc=I(0,0,5.7),hx=hc[0],hy=hc[1];TH.poly(c,[[hx-u*0.6,hy-u*0.9],[hx+u*0.6,hy-u*0.9],[hx+u*1.0,hy+u*0.95],[hx+u*0.5,hy+u*0.8],[hx-u*0.5,hy+u*0.8],[hx-u*1.0,hy+u*0.95]],'#e8c14a');for(let k=0;k<5;k++)TH.ln(c,[hx-u*0.5+k*u*0.25,hy-u*0.85],[hx-u*0.8+k*u*0.4,hy+u*0.85],'#3a5fa0',u*0.1);TH.ell(c,hx,hy+u*0.1,u*0.42,u*0.55,st);TH.ell(c,hx+u*0.12,hy+u*0.02,u*0.05,u*0.07,'#3a2a14');TH.ln(c,I(-0.9,0.2,4.2),I(-0.9,0.2,2.9),gold,u*0.12);TH.ln(c,I(0.4,0.8,3.2),I(0.4,0.8,2.5),'#3a5fa0',u*0.1);});}},
  columnRuin:{cat:'ruin',rho:0.1,tall:10,reach:6,draw(c,x,y,u,v){const r=mulberry(v*3+8),st=['#e0c690','#c9ac76','#a98e5c'];SHD(c,x,y,u*4.2);
    BX(c,x,y,u,-4,4,-1,1,0,0.3,'#bfa268');
    [[-2.6,6.0],[0,7.2],[2.6,3.4]].forEach(([dx,h],i)=>{const px=x+dx*u,py=y-u*0.1;EGCYL(c,px,py,u*0.62,u*0.25,u*h,st);for(let k=1;k<5;k++)TH.ln(c,[px-u*0.62,py-u*h*k/5],[px+u*0.62,py-u*h*k/5],'rgba(60,36,10,.2)',u*0.06);
      if(h>5){const cy=py-u*h;TH.poly(c,[[px-u*0.55,cy],[px-u*0.95,cy-u*0.9],[px-u*0.45,cy-u*1.9],[px,cy-u*2.3],[px+u*0.45,cy-u*1.9],[px+u*0.95,cy-u*0.9],[px+u*0.55,cy]],'#d4b87c');TH.ln(c,[px,cy],[px,cy-u*2.2],'rgba(70,44,14,.35)',u*0.1);TH.ln(c,[px-u*0.6,cy-u*1.0],[px+u*0.6,cy-u*1.0],'#3a8a7a',u*0.22);}
      else{TH.poly(c,[[px-u*0.62,py-u*h],[px-u*0.3,py-u*h-u*0.5],[px+u*0.4,py-u*h-u*0.35],[px+u*0.62,py-u*h]],'#cdb078');}});
    BX(c,x,y,u,0.6,3.8,-0.7,0.7,0.3,1.1,'#c7aa72');}},
  stela:{cat:'ruin',rho:0.05,tall:7,reach:3,draw(c,x,y,u,v){const r=mulberry(v*5+5),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SHD(c,x,y,u*1.4);FLIP(c,x,v&1,()=>{BX(c,x,y,u,-0.9,0.9,-0.6,0.6,0,0.5,'#bda26a');BX(c,x,y,u,-0.55,0.55,-0.25,0.25,0.5,4.4,'#dcc690');
    const a=I(-0.55,0.25,3.6),b=I(0.55,0.25,3.6);TH.poly(c,[I(-0.4,0.26,0.9),I(0.4,0.26,0.9),I(0.4,0.26,3.5),I(-0.4,0.26,3.5)],'rgba(150,116,60,.45)');TH.ell(c,I(0,0.26,3.9)[0],I(0,0.26,3.9)[1],u*0.5,u*0.26,'#e8b82a');TH.ln(c,I(-0.5,0.26,3.9),I(-0.9,0.26,3.6),'#3a5fa0',u*0.1);TH.ln(c,I(0.5,0.26,3.9),I(0.9,0.26,3.6),'#3a5fa0',u*0.1);for(let k=0;k<5;k++)EGGLYPH(c,(X,Y,Z)=>I(X*0.6,0.27,Z),'L',u,r,2,1.2+k*0.45,1.2+k*0.45,0.28);
    });}},
  anubis:{cat:'ruin',rho:0.08,tall:8,reach:3.5,draw(c,x,y,u,v){const r=mulberry(v*3+1);SHD(c,x,y,u*2);FLIP(c,x,v&1,()=>{BX(c,x,y,u,-1.3,1.3,-0.9,0.9,0,1.2,'#cdb278');BX(c,x,y,u,-1.0,1.0,-0.7,0.7,1.2,1.5,'#bda26a');const k='#26262c';TH.poly(c,[[x-u*0.9,y-u*1.6],[x-u*0.7,y-u*3.4],[x-u*0.2,y-u*4.0],[x+u*0.5,y-u*3.9],[x+u*0.9,y-u*3.2],[x+u*1.0,y-u*1.6]],k);TH.poly(c,[[x+u*0.1,y-u*3.9],[x+u*0.6,y-u*4.5],[x+u*1.5,y-u*4.6],[x+u*1.9,y-u*4.2],[x+u*1.3,y-u*3.9],[x+u*0.8,y-u*3.5]],k);TH.poly(c,[[x+u*0.4,y-u*4.4],[x+u*0.5,y-u*5.6],[x+u*0.85,y-u*4.5]],k);TH.poly(c,[[x+u*0.9,y-u*4.5],[x+u*1.15,y-u*5.7],[x+u*1.3,y-u*4.4]],k);TH.ell(c,x+u*1.45,y-u*4.3,u*0.07,u*0.07,'#e8c14a');TH.poly(c,[[x-u*0.7,y-u*3.3],[x+u*0.9,y-u*3.2],[x+u*0.6,y-u*3.8],[x-u*0.4,y-u*3.9]],'#e8b82a');TH.ln(c,[x-u*0.55,y-u*1.6],[x-u*0.55,y-u*2.8],'#3a3a44',u*0.14);});}},
  shrine:{cat:'ruin',rho:0.11,tall:9,reach:5,draw(c,x,y,u,v){const r=mulberry(v*7+2),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SHD(c,x,y,u*3.2);FLIP(c,x,v&1,()=>{BX(c,x,y,u,-2.6,2.6,-2.0,2.0,0,0.5,'#bfa268');BX(c,x,y,u,-2.0,2.0,-1.5,1.5,0.5,0.9,'#cdb078');
    [[-1.6,1.1],[1.6,1.1],[-1.6,-1.1],[1.6,-1.1]].forEach(([X,Y],i)=>{if(Y<0&&false)return;const p=I(X,Y,0.9);EGCYL(c,p[0],p[1],u*0.3,u*0.13,u*3.0,['#e0c690','#c9ac76','#a98e5c']);TH.ell(c,p[0],p[1]-u*3.0,u*0.46,u*0.2,'#d4b87c');});
    BX(c,x,y,u,-2.2,2.2,-1.7,1.7,4.1,4.7,'#d7ba82');TH.poly(c,[I(-2.3,1.8,4.7),I(2.3,1.8,4.7),I(2.3,1.8,5.2),I(-2.3,1.8,5.2)],'#c2a36a');TH.poly(c,[I(-2.3,1.8,4.1),I(2.3,1.8,4.1),I(2.3,1.8,4.7),I(-2.3,1.8,4.7)],'#d0b178');for(let k=0;k<8;k++)TH.ln(c,I(-2+k*0.57,1.82,4.15),I(-2+k*0.57,1.82,4.65),'#3a8a7a',u*0.13);
    TH.poly(c,[I(-0.7,1.2,0.9),I(0.7,1.2,0.9),I(0.7,1.2,2.4),I(-0.7,1.2,2.4)],'#2a2018');TH.ell(c,I(0,0.6,1.5)[0],I(0,0.6,1.5)[1],u*0.3,u*0.38,'#e8b82a');});}},
  pylonGate:{cat:'ruin',rho:0.14,tall:11,reach:6,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SHD(c,x,y,u*4.4);FLIP(c,x,v&1,()=>{BX(c,x,y,u,-3.6,3.6,-0.9,0.9,0,0.3,'#bfa268');
    [-2.3,2.3].forEach(X=>{EGTAPER(c,I,X,0,1.25,0.95,0.3,7.2,'#d8bb82');TH.poly(c,[I(X-1.0,1.0,7.2),I(X+1.0,1.0,7.2),I(X+1.05,1.05,7.6),I(X-1.05,1.05,7.6)],'#c9ac76');for(let k=0;k<5;k++)TH.ln(c,I(X-0.6,1.06,1.6+k*1.1),I(X+0.6,1.06,1.6+k*1.1),'rgba(70,44,14,.34)',u*0.07);TH.poly(c,[I(X-0.4,1.05,0.4),I(X-0.4,1.05,0.6),I(X-0.4,1.05,6.8),I(X-0.5,1.05,6.8)],null);});
    BX(c,x,y,u,-1.15,1.15,-0.8,0.8,4.4,5.4,'#ccaf76');TH.poly(c,[I(-1.15,0.82,4.4),I(1.15,0.82,4.4),I(1.15,0.82,5.4),I(-1.15,0.82,5.4)],'#d4b77e');TH.ell(c,I(0,0.84,4.95)[0],I(0,0.84,4.95)[1],u*0.5,u*0.24,'#e8b82a');TH.poly(c,[I(-0.9,0.9,0.3),I(0.9,0.9,0.3),I(0.9,0.9,4.4),I(-0.9,0.9,4.4)],'#2a2018');TH.poly(c,[I(-2.9,1.0,6.7),I(-1.7,1.0,6.7),I(-1.7,1.0,7.0),I(-2.9,1.0,7.0)],null);});}},
  mudHut:{cat:'struct',rho:0.1,tall:7,reach:4,draw(c,x,y,u,v){const r=mulberry(v*9+1),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z),w=1.5+(v%3)*0.25,d=1.3+((v>>2)%2)*0.25,h=2.1+r()*0.4;SHD(c,x,y,u*3.2);FLIP(c,x,v&1,()=>{
    BX(c,x,y,u,-w,w,-d,d,0,h,'#b98c5a');BX(c,x,y,u,-w-0.12,w+0.12,-d-0.12,d+0.12,h,h+0.28,'#c79d68');for(let k=0;k<6;k++){const X=-w+(k+0.5)*(2*w/6);TH.ell(c,I(X,d+0.12,h+0.12)[0],I(X,d+0.12,h+0.12)[1],u*0.1,u*0.1,'#6a4a2a');}
    for(let k=0;k<3;k++)TH.ln(c,I(-w,d+0.01,0.5+k*0.55),I(w,d+0.01,0.5+k*0.55),'rgba(80,50,22,.2)',u*0.07);
    const dx=-w*0.25;TH.poly(c,[I(dx-0.45,d+0.02,0),I(dx+0.45,d+0.02,0),I(dx+0.45,d+0.02,1.35),I(dx-0.45,d+0.02,1.35)],'#2c2016');TH.ell(c,I(dx,d+0.02,1.35)[0],I(dx,d+0.02,1.35)[1],u*0.46,u*0.22,'#2c2016');
    TH.poly(c,[I(w*0.35,d+0.02,1.0),I(w*0.7,d+0.02,1.0),I(w*0.7,d+0.02,1.45),I(w*0.35,d+0.02,1.45)],'#2c2016');
    if(v%2){TH.ln(c,I(w+0.1,-0.4,0),I(w+0.1,-0.4,h+0.9),'#7a5a36',u*0.16);TH.ln(c,I(w+0.1,0.5,0),I(w+0.1,0.5,h+0.9),'#7a5a36',u*0.16);for(let k=0;k<4;k++)TH.ln(c,I(w+0.1,-0.4,0.6+k*0.55),I(w+0.1,0.5,0.6+k*0.55),'#7a5a36',u*0.1);}
    else{const ax=I(-w*0.2,d+0.2,2.55);const aw=u*(1.6+r()*0.4);TH.poly(c,[[ax[0]-aw,ax[1]],[ax[0]+aw,ax[1]],[ax[0]+aw*0.8,ax[1]+u*0.7],[ax[0]-aw*0.8,ax[1]+u*0.7]],'#cfae6a');for(let k=0;k<5;k++)TH.ln(c,[ax[0]-aw*0.8+k*aw*0.4,ax[1]],[ax[0]-aw*0.7+k*aw*0.35,ax[1]+u*0.7],'#a88a4a',u*0.08);}
    });}},
  mudHutRound:{cat:'struct',rho:0.09,tall:7,reach:3.5,draw(c,x,y,u,v){const r=mulberry(v*5+3),rx=1.7*u,ry=0.85*u,h=1.8*u;SHD(c,x,y,u*3.2);FLIP(c,x,v&1,()=>{EGCYL(c,x,y,rx,ry,h,['#d0a46c','#b98c58','#8d6538']);
    c.fillStyle='#bd915c';c.beginPath();c.ellipse(x,y-h,rx,ry,0,Math.PI,0,false);c.bezierCurveTo(x+rx*0.8,y-h-u*1.9,x-rx*0.8,y-h-u*1.9,x-rx,y-h);c.closePath();const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,'#d6aa72');g.addColorStop(0.6,'#b98c58');g.addColorStop(1,'#8f693c');c.fillStyle=g;c.fill();
    for(let k=1;k<4;k++){c.strokeStyle='rgba(70,44,14,.22)';c.lineWidth=u*0.07;c.beginPath();c.ellipse(x,y-h-u*0.35*k,rx*(1-k*0.22),ry*(1-k*0.22),0,0.05,Math.PI-0.05);c.stroke();}
    TH.ell(c,x,y-h-u*1.15,u*0.2,u*0.12,'#7a5a36');const a=Math.PI/2+0.35,dx=x+Math.cos(a)*rx,dy=y+Math.sin(a)*ry;c.fillStyle='#2c2016';c.beginPath();c.moveTo(dx-u*0.45,dy);c.lineTo(dx-u*0.45,dy-u*0.9);c.quadraticCurveTo(dx,dy-u*1.5,dx+u*0.45,dy-u*0.9);c.lineTo(dx+u*0.45,dy);c.closePath();c.fill();});}},
  mudHutPair:{cat:'struct',rho:0.15,tall:7,reach:6,draw(c,x,y,u,v){const r=mulberry(v*11+6),I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SHD(c,x,y,u*5.4);FLIP(c,x,v&1,()=>{
    BX(c,x,y,u,-3.4,3.4,0.9,1.1,0,0.7,'#c19463');BX(c,x,y,u,-3.4,-3.2,-1.2,1.1,0,0.7,'#c19463');BX(c,x,y,u,3.2,3.4,-1.2,1.1,0,0.7,'#b48858');
    BX(c,x,y,u,-3.0,-0.5,-1.2,0.5,0,2.2,'#b98c5a');BX(c,x,y,u,-3.1,-0.4,-1.3,0.6,2.2,2.5,'#c79d68');BX(c,x,y,u,0.8,2.9,-1.2,0.3,0,1.7,'#c09260');BX(c,x,y,u,0.7,3.0,-1.3,0.4,1.7,1.95,'#cda46f');
    TH.poly(c,[I(-2.2,0.52,0),I(-1.3,0.52,0),I(-1.3,0.52,1.4),I(-2.2,0.52,1.4)],'#2c2016');TH.poly(c,[I(1.4,0.32,0),I(2.2,0.32,0),I(2.2,0.32,1.2),I(1.4,0.32,1.2)],'#2c2016');
    TH.poly(c,[I(-0.4,1.12,0),I(0.4,1.12,0),I(0.4,1.12,0.9),I(-0.4,1.12,0.9)],'#2c2016');
    [[0.1,0.1],[0.5,-0.3]].forEach(([X,Y],i)=>{const p=I(X,Y+0.3,0);EGCYL(c,p[0],p[1],u*0.28,u*0.13,u*(0.9+i*0.3),['#c4683a','#a8532b','#7a3a1c']);});});}},
  shadoof:{cat:'prop',rho:0.07,tall:8,reach:4,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SHD(c,x,y,u*2.4);FLIP(c,x,v&1,()=>{BX(c,x,y,u,-0.9,-0.3,-0.4,0.4,0,3.6,'#b88c58');BX(c,x,y,u,0.3,0.9,-0.4,0.4,0,3.6,'#a97f4d');TH.ln(c,I(-1.0,0,3.2),I(1.0,0,3.2),'#5e4020',u*0.22);
    const p0=I(-3.6,0,4.5),p1=I(3.0,0,1.9),pv=I(0,0,3.2);TH.ln(c,p0,p1,'#6a4a28',u*0.26);TH.ell(c,p0[0]-u*0.1,p0[1]-u*0.05,u*0.55,u*0.5,'#9a7448');TH.ln(c,p1,[p1[0],p1[1]+u*1.6],'#4a3418',u*0.07);EGCYL(c,p1[0],p1[1]+u*2.5,u*0.38,u*0.16,u*0.8,['#a3643a','#8a4f2a','#6a3a1c']);});}},
  clayJars:{cat:'prop',rho:0.05,tall:3,reach:3,draw(c,x,y,u,v){SHD(c,x,y,u*1.6);[[-0.9,0.1,1.0],[0.0,-0.25,1.3],[0.95,0.1,0.9]].forEach(([dx,dy,s],i)=>{const px=x+dx*u,py=y+dy*u,rx=u*0.62*s,h=u*1.5*s;const g=c.createLinearGradient(px-rx,0,px+rx,0);g.addColorStop(0,'#d98a50');g.addColorStop(0.6,'#b8693a');g.addColorStop(1,'#84451f');c.fillStyle=g;c.beginPath();c.moveTo(px-rx*0.55,py-h);c.bezierCurveTo(px-rx*1.5,py-h*0.55,px-rx*1.1,py,px-rx*0.5,py);c.lineTo(px+rx*0.5,py);c.bezierCurveTo(px+rx*1.1,py,px+rx*1.5,py-h*0.55,px+rx*0.55,py-h);c.closePath();c.fill();TH.ell(c,px,py-h,rx*0.55,rx*0.22,'#7a3a18');TH.ln(c,[px-rx*1.1,py-h*0.55],[px+rx*1.1,py-h*0.55],i%2?'#3a8a7a':'#e8c14a',u*0.1);});}},
  reedBoat:{cat:'prop',rho:0.1,tall:4,reach:4,draw(c,x,y,u,v){SHD(c,x,y,u*3,'30,60,40');FLIP(c,x,v&1,()=>{TH.poly(c,[[x-u*3.2,y-u*1.1],[x-u*2.4,y-u*0.2],[x+u*2.2,y-u*0.15],[x+u*3.3,y-u*1.3],[x+u*2.0,y-u*0.55],[x-u*2.2,y-u*0.6]],'#b9aa5e');TH.poly(c,[[x-u*2.4,y-u*0.2],[x+u*2.2,y-u*0.15],[x+u*2.0,y+u*0.25],[x-u*2.1,y+u*0.3]],'#8f823c');for(let k=0;k<7;k++)TH.ln(c,[x-u*2.1+k*u*0.7,y-u*0.2],[x-u*2.0+k*u*0.7,y+u*0.28],'rgba(60,50,10,.4)',u*0.08);TH.ln(c,[x-u*0.5,y-u*0.4],[x+u*0.9,y-u*3.6],'#6a4a28',u*0.14);TH.ell(c,x+u*0.95,y-u*3.7,u*0.3,u*0.12,'#8a6a3a');});}},
  offeringTable:{cat:'prop',rho:0.06,tall:4,reach:3,draw(c,x,y,u,v){const I=(X,Y,Z)=>TH.iso(x,y,u,X,Y,Z);SHD(c,x,y,u*1.8);BX(c,x,y,u,-1.1,1.1,-0.7,0.7,0,0.9,'#cdb078');BX(c,x,y,u,-1.3,1.3,-0.9,0.9,0.9,1.15,'#d9bf88');TH.ell(c,I(-0.4,0,1.4)[0],I(-0.4,0,1.4)[1],u*0.35,u*0.18,'#a3643a');TH.ell(c,I(0.5,0.1,1.4)[0],I(0.5,0.1,1.4)[1],u*0.3,u*0.15,'#3a8a7a');TH.ell(c,I(0.05,-0.3,1.45)[0],I(0.05,-0.3,1.45)[1]-u*0.3,u*0.14,u*0.3,'#ff9a30');}},
};

/* ===== EGYPT LAND: planner (sparse date palms at Wild-West density, wind-rippled dunes, amoeba swamp ponds with papyrus, mud huts, obelisks and small monuments), golden desert ground ===== */
const EGYPT_ASSETS=Object.assign({},EGT,EGT2);
const EGYPT_REGION={top:{junglePalm:.9,sycamoreFig:.1},mid:{junglePalm:.9,sycamoreFig:.1},bottom:{junglePalm:.94,sycamoreFig:.06}};
const EGYPT_LOW=[['junglePalm',0.8],['junglePalm',0.7],['dryScrub',1.1],['junglePalm',0.85],['tamarisk',1.05],['junglePalm',0.75]];     /* short species only in the foreground */
const EGYPT_CAP={sycamoreFig:3};
const EGYPT_UNDER=['dryScrub','tamarisk','dryScrub','sandRocks','dryScrub'];
const EGYPT_PLAN_CACHE={};
function getEgyptPlan(shape){
  if(EGYPT_PLAN_CACHE[shape])return EGYPT_PLAN_CACHE[shape];
  const K=planKit(shape,({A:31101,B:31202,C:31318,D:31419})[shape],{assets:EGYPT_ASSETS,region:EGYPT_REGION,low:EGYPT_LOW,cap:EGYPT_CAP,under:EGYPT_UNDER,treeMul:0.62}),{G,rng,placed,place,tree,under,onEdge,landCnt,landThin,spread,outer,top,sides,bottoms,interior,cx,cy}=K;
  const DENS=({A:0.48,B:0.5,C:0.56,D:0.7})[shape];
  /* 1. swamp ponds in the vertical corridors between horizontally adjacent tiles (amoeba shaped; one more appears every other tier) */
  const ponds=[];
  {const pool=interior.filter(e=>e.vertical).map(e=>e.mid.slice()),n=landCnt(3)>=3?3:2,minTs=n===3?[1,3,5]:[2,4];
    for(let k=0;k<n&&pool.length;k++){let best=0,bd=-1;pool.forEach((p,i)=>{const d=ponds.length?Math.min(...ponds.map(q=>Math.hypot(p[0]-q.x,(p[1]-q.y)*1.4))):rng();if(d>bd){bd=d;best=i;}});const p=pool.splice(best,1)[0],seed=Math.floor(rng()*900);let rx=0.17+rng()*0.025,ry=0.29+rng()*0.04,poly=null;for(let g=0;g<5;g++){poly=amoeba(p[0],p[1],rx,ry,seed+31,36,1.4);if(poly.every(q=>K.free(q[0],q[1],0.0)&&K.inLand(q[0],q[1])))break;poly=null;rx*=0.92;ry*=0.92;}
      if(!poly)continue;
      const pd={x:p[0],y:p[1],rx,ry,v:seed,poly,minT:minTs[ponds.length]};ponds.push(pd);K.obstacles.push((x,y,rho)=>!(inPoly(pd.poly,x,y)||pd.poly.some(q=>Math.hypot(q[0]-x,(q[1]-y)*1.6)<0.07+rho*0.5)));}}
  /* 2. wind-rippled dunes along the back rim, with a few smaller ones on the sides (they appear tier by tier) */
  {const tops=top.slice().sort((a,b)=>a.mid[0]-b.mid[0]),pick=[];const want=landCnt(6);const step=tops.length/Math.max(1,want);for(let i=0;i<want;i++)pick.push(tops[Math.min(tops.length-1,Math.floor((i+0.5)*step))]);
    pick.forEach((e,i)=>{const t=0.35+rng()*0.3,p=onEdge(e,t,0.03+rng()*0.05);place('dune',p[0],p[1],{minT:[1,2,3,4,5,5,4][i%7],scale:1.15+rng()*0.2,fixed:true,fixedTier:true,noSouth:true,clear:0.8,layer:'back'});});
    const sd=sides.slice().sort((a,b)=>rng()-0.5).slice(0,landCnt(3));sd.forEach((e,i)=>{const p=onEdge(e,0.5,0.14);place('dune',p[0],p[1],{minT:[2,4,5][i%3],scale:0.5+rng()*0.1,fixed:true,fixedTier:true,clear:0.8});});}
  /* 3. monuments (small): obelisks, a sphinx, statues, columns, stelae, a shrine and a pylon, spread so none clump */
  const rim=[],inn=[];outer.forEach(e=>[0.3,0.7].forEach(t=>rim.push(onEdge(e,t,0.1))));G.verts.filter(v=>v.junction).forEach(v=>inn.push([v.x,v.y]));interior.forEach(e=>inn.push([e.mid[0],e.mid[1]]));
  const topRim=top.flatMap(e=>[0.3,0.7].map(t=>onEdge(e,t,0.12)));
  landThin([['obelisk',1,0.95],['stela',1,1],['obelisk',3,0.95],['sphinx',3,0.78],['columnRuin',4,0.82],['seatedStatue',4,0.82],['obelisk',5,1],['pylonGate',5,0.66],['anubis',5,0.95],['shrine',5,0.8],['stela',2,1],['columnRuin',5,0.7],['stela',4,1]]).forEach(([k,mt,s])=>spread(k,rim.concat(inn),{minT:mt,fixedTier:true,scale:s,clear:2.0,noSouth:true}));
  /* 4. mud huts: beehive granaries, flat-roofed houses and courtyard pairs on the rim and through the middle */
  landThin([['mudHutRound',1],['mudHut',2],['mudHut',3],['mudHutRound',3],['mudHutPair',4],['mudHut',5],['mudHutRound',5]]).forEach(([k,mt])=>spread(k,rim.concat(inn),{minT:mt,fixedTier:true,scale:1.05,clear:2.2,noSouth:true}));
  /* 5. the marsh edge: papyrus, reeds and a few palms round each pond, a reed boat and a shadoof */
  ponds.forEach((pd,pi)=>{const ang0=rng()*6.28;for(let k=0;k<8;k++){const a=ang0+k/8*6.28;if(Math.sin(a)>0.2)continue;const px=pd.x+Math.cos(a)*pd.rx*1.5,py=pd.y+Math.sin(a)*pd.ry*1.4;place(k%3===0?'reeds':'papyrus',px,py,{minT:pd.minT,fixedTier:true,scale:0.62+rng()*0.25,clear:0.3});}
    for(let k=0;k<2;k++){const a=ang0+k*3.14+0.8,px=pd.x+Math.cos(a)*pd.rx*1.28,py=pd.y+Math.sin(a)*pd.ry*1.18;place('junglePalm',px,py,{minT:pd.minT,fixedTier:true,scale:0.95,clear:0.5});}
    if(pi===0)place('reedBoat',pd.x-pd.rx*0.1,pd.y+pd.ry*0.05,{minT:Math.max(2,pd.minT),maxT:4,prop:true,fixedTier:true,fixed:true,scale:0.9,noObstacle:true});
    if(pi===1||(ponds.length===2&&pi===0)){const a=rng()<0.5?0.1:3.04;place('shadoof',pd.x+Math.cos(a)*pd.rx*1.5,pd.y+Math.sin(a)*pd.ry*1.4,{minT:Math.max(2,pd.minT),maxT:4,prop:true,fixedTier:true,scale:1.0});}});
  /* 6. trees: palm groves at the junctions, in the corridors and along the rim (sparse: West density) */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()>DENS*1.35)return;const dom=K.pickFrom(K.regionOf(v.y),K.capOk),n=1+Math.floor(rng()*1.8);for(let k=0;k<n;k++){const a=rng()*6.283,r=k?0.12+rng()*0.08:0.02;tree(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r*0.8,null,dom);}});
  interior.filter(e=>e.vertical).forEach(e=>{const dom=K.pickFrom(K.regionOf(e.mid[1]),K.capOk);[-0.2,0.2].forEach(dy=>{if(rng()<DENS*0.9)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+dy,null,dom);});});
  interior.filter(e=>!e.vertical).forEach(e=>{if(rng()<DENS*0.7)tree(e.mid[0]+(rng()-0.5)*0.2,e.mid[1]+(rng()-0.5)*0.1,{scale:0.8+rng()*0.2},null,true);});
  {const ordered=outer.slice().sort((a,b)=>Math.atan2((a.mid[1]-cy)*1.7,a.mid[0]-cx)-Math.atan2((b.mid[1]-cy)*1.7,b.mid[0]-cx)),samples=[];
    ordered.forEach(e=>{const nS=Math.max(2,Math.round(e.len/0.32));for(let s=0;s<nS;s++)samples.push({e,p:onEdge(e,(s+0.5)/nS+(rng()-0.5)*0.08,(e.cls==='top'?-0.02:0)+(rng()-0.2)*0.12)});});
    let mode='grove',run=0,dom='datePalm';samples.forEach(s=>{if(run<=0){const r=rng();mode=r<0.5?'grove':r<0.78?'sparse':'open';run=2+Math.floor(rng()*4);dom=K.pickFrom(K.regionOf(s.p[1]),K.capOk);}run--;const e=s.e,low=e.cls==='bottom'||(e.cls==='side'&&s.p[1]>cy+0.25),p=s.p;
      if(mode==='grove'){if(e.cls==='top'&&rng()<0.35)return;if(rng()<DENS*1.5)tree(p[0],p[1],null,dom,low);if(rng()<DENS*0.7)tree(p[0]+(rng()-0.5)*0.3,p[1]-0.11,null,dom,low);}
      else if(mode==='sparse'){if(rng()<DENS)tree(p[0],p[1],null,dom,low);else if(rng()<0.3)under(p[0],p[1]);}else if(rng()<0.25)under(p[0],p[1]);});}
  G.verts.filter(v=>!v.junction&&v.hexes.size<=2).forEach(v=>{if(rng()<DENS*0.8)tree(v.x+(rng()-0.5)*0.12,v.y+(rng()-0.5)*0.1,null,null,v.y>cy+0.3);});
  G.centers.forEach(c=>{for(let k=0;k<10;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(!hexInside(px-c.x,py-c.y,1.0))continue;if(rng()<DENS*0.3)tree(px,py,{scale:0.8+rng()*0.25},null,py>cy+0.35);}});
  /* 7. low scrub, tamarisk and sandstone outcrops; a few small props (lower tiers only) */
  G.verts.filter(v=>v.junction).forEach(v=>{if(rng()<0.3)under(v.x+(rng()-0.5)*0.2,v.y+(rng()-0.5)*0.12);});
  interior.forEach(e=>{if(rng()<0.2)under(e.mid[0]+(rng()-0.5)*0.24,e.mid[1]+(rng()-0.5)*0.12);});
  outer.forEach(e=>{if(rng()<0.3)under(...onEdge(e,rng(),0.06));});
  G.centers.forEach(c=>{for(let k=0;k<5;k++){const px=c.x+(rng()*2-1)*HX,py=c.y+(rng()*2-1)*0.58;if(hexInside(px-c.x,py-c.y,1.0)&&rng()<0.12)under(px,py);}});
  [['sandRocks',3],['clayJars',3],['offeringTable',1]].forEach(([k,n])=>{for(let i=0;i<landCnt(n);i++){const e=outer[Math.floor(rng()*outer.length)],p=onEdge(e,0.15+rng()*0.7,0.04+rng()*0.08);place(k,p[0],p[1],k==='sandRocks'?{minT:1}:{minT:1,maxT:3,prop:true});}});
  let pi=0;placed.filter(o=>o.prop&&!o.fixedTier).forEach(o=>{o.minT=pi++<3?1:2;});
  K.finish({tree:[0.24,0.46,0.67,0.84,1],shrub:[0.08,0.28,0.52,0.76,1],rock:[0.18,0.4,0.62,0.82,1],prop:[1,1,1,1,1],ruin:[0,0,0,0,0],struct:[0,0,0,0,0],water:[0,0,0,0,0]});
  return EGYPT_PLAN_CACHE[shape]={G,objs:placed,ponds,rng};
}
/* ---- ground: golden desert with wind-rippled sand, soft drifts, darker hardpan, pebbles, and the swamp ponds (drawn here so they sit under everything) ---- */
function egyptGround(c,G,R,ox,oy,m,col,seed,plan,tier){
  const poly=i=>HV.map(v=>[ox+m*(G.centers[i].x+v[0])*R,oy+(G.centers[i].y+v[1])*R]),r=mulberry(seed),outer=G.edges.filter(e=>e.outer),P=p=>[ox+m*p[0]*R,oy+p[1]*R];
  c.save();c.lineJoin='round';c.lineCap='round';
  for(let i=1;i<=6;i++){c.globalAlpha=0.11-i*0.014;c.strokeStyle=col;c.lineWidth=R*0.06*i;c.beginPath();outer.forEach(e=>{const a=P(e.a),b=P(e.b);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();}
  c.globalAlpha=1;G.centers.forEach((_,i)=>TH.poly(c,poly(i),col,col,2));
  c.save();c.beginPath();G.centers.forEach((_,i)=>{poly(i).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();});c.clip();
  const bx=[ox+Math.min(m*G.bbox.minX,m*G.bbox.maxX)*R,oy+G.bbox.minY*R,(G.bbox.maxX-G.bbox.minX)*R,(G.bbox.maxY-G.bbox.minY)*R],pt=()=>[bx[0]+r()*bx[2],bx[1]+r()*bx[3]];
  for(let k=0;k<30;k++){const p=pt(),w=R*(0.5+r()*1.0);SOFT(c,p[0],p[1],w,w*0.4,r()<0.5?'255,236,160':'216,168,70',0.24);}
  for(let k=0;k<10;k++){const p=pt(),w=R*(0.4+r()*0.8);SOFT(c,p[0],p[1],w,w*0.4,'176,128,52',0.16);}
  for(let k=0;k<8;k++){const p=pt(),w=R*(0.4+r()*0.7);SOFT(c,p[0],p[1],w,w*0.4,'255,250,205',0.18);}
  /* wind ripples: long faint wavy lines */
  for(let k=0;k<70;k++){const p=pt(),l=R*(0.3+r()*0.5);c.strokeStyle=r()<0.5?'rgba(150,100,34,.14)':'rgba(255,246,200,.2)';c.lineWidth=Math.max(0.8,R*0.011);c.beginPath();c.moveTo(p[0],p[1]);c.bezierCurveTo(p[0]+l*0.3,p[1]-R*0.03,p[0]+l*0.7,p[1]+R*0.03,p[0]+l,p[1]);c.stroke();}
  for(let k=0;k<120;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.01,R*0.007,r()<0.5?'#b88d44':'#f4e3a8');}
  for(let k=0;k<14;k++){const p=pt();TH.ell(c,p[0],p[1],R*0.02,R*0.012,'#b69a6a',r()*3);TH.ell(c,p[0]-R*0.004,p[1]-R*0.003,R*0.011,R*0.007,'#d2b886',r()*3);}
  for(let k=0;k<10;k++){const p=pt(),l=R*0.05;TH.ln(c,[p[0],p[1]],[p[0]+(r()-0.5)*l,p[1]-l*0.8],'#8c9a4a',R*0.01);}
  const u=R*0.075;plan.ponds.filter(p=>p.minT<=tier).forEach(p=>EGYPT_ASSETS.marsh.drawEx(c,p,ox,oy,m,R,u));
  c.restore();c.restore();
}
const EGYPT_THEME={id:'egypt',assets:EGYPT_ASSETS,plan:getEgyptPlan,ground:egyptGround,groundCol:'#dcb95e',top:1.6};
const EGYPT_TIER_NAMES=['Sparse','Light','Medium','Heavy','Immersive'];
function bakeLandEgypt(shape,tier,R,opts){return bakeLandTheme(EGYPT_THEME,shape,tier,R,opts);}
function drawLandEgyptBack(ctx,x,y,land){ctx.drawImage(land.back,x-land.ox,y-land.oy,land.w,land.h);}
function drawLandEgyptFront(ctx,x,y,land){const r=land.frontRect;ctx.drawImage(land.front,x-land.ox+r.x,y-land.oy+r.y,r.w,r.h);}
function landEgyptSlots(land,R){return land.centers.map(c=>({x:c.x,y:c.y,rx:LAND_KEEP.rx*R,ry:LAND_KEEP.ry*R}));}

const PACK={bake:bakeLandEgypt,names:EGYPT_TIER_NAMES,plan:getEgyptPlan,park:'#d9b65a'};
return Object.freeze({ bake: (shape, tier, radius, opts) => bakeLandEgypt(shape, tier === 4 ? 5 : tier, radius, opts), drawBack: drawLandEgyptBack, drawFront: (ctx, x, y, land) => land.sprites.slice().sort((a,b) => a.y-b.y).forEach(s => drawScenicSprite(ctx,s,x+s.x,y+s.y)) });
})(),
  china: (() => {
/* ===== THEME PACK CORE (shared by every theme pack; copy once into engine.js) ===== */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shade(hex, amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=c=>Math.max(0,Math.min(255,Math.round(amt<0?c*(1+amt):c+(255-c)*amt)));return `rgb(${f(r)},${f(g)},${f(b)})`;}
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

/* ===== CHINESE ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const CSH = (c, x, y, rx) => {
  c.fillStyle = 'rgba(14, 34, 16, .30)';
  c.beginPath();
  c.ellipse(x + rx * 0.24, y + rx * 0.1, rx, rx * 0.36, 0, 0, 7);
  c.fill();
};
const CFLIP = (c, x, f, fn) => {
  if (f) {
    c.save();
    c.translate(x, 0);
    c.scale(-1, 1);
    c.translate(-x, 0);
    fn();
    c.restore();
  } else fn();
};
const CBOX = (c, x, y, u, x0, x1, y0, y1, z0, z1, col) => TH.box(c, x, y, u, x0, x1, y0, y1, z0, z1, col, shade(col, -0.28), shade(col, 0.12));

// Shared Chinese architectural colors
const C_VERM   = '#b83227'; // Lacquered vermilion timber
const C_VERM_D = '#7e1e17';
const C_GOLD   = '#d99b26'; // Imperial glazed yellow-gold tile
const C_JADE   = '#2e7d5b'; // Glazed jade-green tile
const C_SLATE  = '#3b424c'; // Classical grey-black clay tile
const C_WALL   = '#ece8dc'; // Lime-washed plaster wall
const C_BRICK  = '#7e848c'; // Qing grey brick
const C_MARBLE = '#e4e2d8'; // Carved white marble plinth/balustrade
const C_LANTERN= '#ef4444';
const C_GLOW   = '#fde047';

// Helper: Sweeping upturned Chinese gable roof (feiyan) in isometric space
function drawChineseSweptRoof(c, L, a0, a1, b0, b1, zBase, rise, tileCol, ridgeCol, u, flare = 0.36) {
  const am = (a0 + a1) * 0.5;
  const ov = 0.28;
  // Front-left eave corner, front-right eave corner, back-right eave corner, back-left eave corner
  const eFL = L(a0 - ov, b1 + ov, zBase + flare * 0.65);
  const eFR = L(a1 + ov, b1 + ov, zBase + flare);
  const eBR = L(a1 + ov, b0 - ov, zBase + flare * 0.65);
  const eBL = L(a0 - ov, b0 - ov, zBase + flare * 0.45);
  // Ridge beam endpoints with subtle upturned horn finials
  const rF  = L(am, b1 + ov * 0.7, zBase + rise + flare * 0.42);
  const rB  = L(am, b0 - ov * 0.7, zBase + rise + flare * 0.35);

  // Back-left slope (visible behind ridge)
  c.fillStyle = shade(tileCol, 0.14);
  c.beginPath();
  c.moveTo(eBL[0], eBL[1]);
  c.quadraticCurveTo(L(a0, b0, zBase + rise * 0.38)[0], L(a0, b0, zBase + rise * 0.38)[1], rB[0], rB[1]);
  c.lineTo(rF[0], rF[1]);
  c.quadraticCurveTo(L(a0, b1, zBase + rise * 0.38)[0], L(a0, b1, zBase + rise * 0.38)[1], eFL[0], eFL[1]);
  c.closePath();
  c.fill();

  // Front-right sunlit/shaded glazed tile slope with concave upturned curve
  c.fillStyle = tileCol;
  c.beginPath();
  c.moveTo(eFR[0], eFR[1]);
  c.quadraticCurveTo(L(a1, b1, zBase + rise * 0.38)[0], L(a1, b1, zBase + rise * 0.38)[1], rF[0], rF[1]);
  c.lineTo(rB[0], rB[1]);
  c.quadraticCurveTo(L(a1, b0, zBase + rise * 0.38)[0], L(a1, b0, zBase + rise * 0.38)[1], eBR[0], eBR[1]);
  c.closePath();
  c.fill();

  // Glazed tile rib flutes running down the slope
  const nRibs = 7;
  for (let k = 1; k < nRibs; k++) {
    const t = k / nRibs;
    const tb = b0 - ov + (b1 - b0 + 2 * ov) * t;
    const pTop = L(am, tb, zBase + rise + flare * 0.38);
    const pBot = L(a1 + ov, tb, zBase + flare * (0.65 + 0.35 * Math.sin(t * Math.PI)));
    TH.ln(c, pTop, pBot, 'rgba(15, 23, 20, 0.28)', u * 0.045);
  }

  // Front gable triangle infill (under the upturned eaves)
  TH.poly(c, [L(a0, b1 + 0.02, zBase), L(a1, b1 + 0.02, zBase), L(am, b1 + 0.02, zBase + rise)], C_WALL);
  TH.ln(c, L(am, b1 + 0.03, zBase), L(am, b1 + 0.03, zBase + rise), C_VERM, u * 0.09);

  // Ornamental ridge beam + chiwen dragon/beast finials on both ridge ends
  TH.ln(c, rB, rF, ridgeCol || shade(tileCol, 0.28), u * 0.12);
  [rB, rF].forEach(rp => {
    TH.poly(c, [[rp[0] - u * 0.08, rp[1]], [rp[0] + u * 0.08, rp[1]], [rp[0], rp[1] - u * 0.24]], ridgeCol || C_GOLD);
  });

  // Upturned eave trim lines
  c.strokeStyle = shade(tileCol, -0.35);
  c.lineWidth = u * 0.08;
  c.beginPath();
  c.moveTo(eFL[0], eFL[1]);
  c.quadraticCurveTo(L(a0, b1, zBase + rise * 0.38)[0], L(a0, b1, zBase + rise * 0.38)[1], rF[0], rF[1]);
  c.quadraticCurveTo(L(a1, b1, zBase + rise * 0.38)[0], L(a1, b1, zBase + rise * 0.38)[1], eFR[0], eFR[1]);
  c.stroke();
}

// Helper: Hanging red silk lantern with gold tassel
function drawHangingLantern(c, px, py, u, sc = 1) {
  TH.ln(c, [px, py], [px, py + u * 0.14 * sc], '#1c1917', u * 0.03 * sc);
  TH.ell(c, px, py + u * 0.30 * sc, u * 0.17 * sc, u * 0.15 * sc, C_LANTERN);
  TH.ell(c, px - u * 0.04 * sc, py + u * 0.27 * sc, u * 0.07 * sc, u * 0.08 * sc, C_GLOW);
  TH.ln(c, [px - u * 0.10 * sc, py + u * 0.16 * sc], [px + u * 0.10 * sc, py + u * 0.16 * sc], C_GOLD, u * 0.045 * sc);
  TH.ln(c, [px - u * 0.10 * sc, py + u * 0.44 * sc], [px + u * 0.10 * sc, py + u * 0.44 * sc], C_GOLD, u * 0.045 * sc);
  TH.ln(c, [px, py + u * 0.45 * sc], [px, py + u * 0.62 * sc], '#dc2626', u * 0.03 * sc);
}

/* ---- Traditional Chinese Courtyard Residences (4 orientations via GFLIP x eave) ---- */
const CHOUSE_T = {
  courtyardHouse: { ha: 1.25, hb: 1.85, h1: 1.85, h2: 0, wall: C_WALL, tile: C_SLATE, ridge: '#94a3b8', rise: 1.65, flare: 0.34, lanterns: true, sw: 3.2, sh: 0.95 },
  vermilionVilla: { ha: 1.30, hb: 1.90, h1: 1.65, h2: 1.45, wall: C_WALL, tile: C_GOLD, ridge: '#fef08a', rise: 1.85, flare: 0.42, lanterns: true, sw: 3.4, sh: 1.0 },
  teaHouse:       { ha: 1.15, hb: 1.65, h1: 1.65, h2: 0, wall: '#f5f0e1', tile: C_JADE, ridge: '#6ee7b7', rise: 1.55, flare: 0.38, openVeranda: true, lanterns: true, sw: 3.0, sh: 0.92 }
};

function CHOUSE_BODY(c, x, y, u, s, eave, T) {
  const r = mulberry(s * 11 + 5);
  const Iw = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
  const L  = (a, b, z) => eave ? Iw(b, a, z) : Iw(a, b, z);
  const LBOX = (a0, a1, b0, b1, z0, z1, col) => eave ? CBOX(c, x, y, u, b0, b1, a0, a1, z0, z1, col) : CBOX(c, x, y, u, a0, a1, b0, b1, z0, z1, col);

  const ha = T.ha, hb = T.hb;
  // White marble foundation plinth
  LBOX(-ha - 0.14, ha + 0.14, -hb - 0.14, hb + 0.14, 0, 0.32, C_MARBLE);

  // Main ground floor walls
  LBOX(-ha, ha, -hb, hb, 0.32, 0.32 + T.h1, T.wall);

  // Vermilion corner & bay timber columns + dado brick base
  const z1 = 0.32 + T.h1;
  [-ha, 0, ha].forEach(ax => {
    TH.ln(c, L(ax, hb + 0.02, 0.32), L(ax, hb + 0.02, z1), C_VERM, u * 0.11);
  });
  [-hb, -hb * 0.33, hb * 0.33, hb].forEach(by => {
    TH.ln(c, L(ha + 0.02, by, 0.32), L(ha + 0.02, by, z1), C_VERM, u * 0.11);
  });
  // Horizontal vermilion lintel beam
  TH.ln(c, L(-ha, hb + 0.02, z1 - 0.06), L(ha, hb + 0.02, z1 - 0.06), C_VERM, u * 0.10);
  TH.ln(c, L(ha + 0.02, -hb, z1 - 0.06), L(ha + 0.02, hb, z1 - 0.06), C_VERM, u * 0.10);

  // Lattice windows & doorway with warm paper glow
  const drawLatticeWin = (p0, p1, fixedCoord, isFrontB, zw0, zw1) => {
    const J = (t, z) => isFrontB ? L(t, fixedCoord, z) : L(fixedCoord, t, z);
    TH.poly(c, [J(p0, zw0), J(p1, zw0), J(p1, zw1), J(p0, zw1)], r() < 0.7 ? '#fef08a' : '#fed7aa', C_VERM_D, u * 0.06);
    const tm = (p0 + p1) * 0.5, zm = (zw0 + zw1) * 0.5;
    TH.ln(c, J(tm, zw0), J(tm, zw1), C_VERM_D, u * 0.035);
    TH.ln(c, J(p0, zm), J(p1, zm), C_VERM_D, u * 0.035);
  };

  // Doorway on primary face
  const doorOnB = !eave;
  if (doorOnB) {
    TH.poly(c, [L(-0.34, hb + 0.03, 0.32), L(0.34, hb + 0.03, 0.32), L(0.34, hb + 0.03, 1.55), L(-0.34, hb + 0.03, 1.55)], '#3b1510', C_VERM, u * 0.07);
    drawLatticeWin(-1.05, -0.55, hb + 0.03, true, 0.75, 1.48);
    drawLatticeWin( 0.55,  1.05, hb + 0.03, true, 0.75, 1.48);
    drawLatticeWin(-1.25, -0.45, ha + 0.03, false, 0.75, 1.48);
    drawLatticeWin( 0.45,  1.25, ha + 0.03, false, 0.75, 1.48);
  } else {
    TH.poly(c, [L(ha + 0.03, -0.36, 0.32), L(ha + 0.03, 0.36, 0.32), L(ha + 0.03, 0.36, 1.55), L(ha + 0.03, -0.36, 1.55)], '#3b1510', C_VERM, u * 0.07);
    drawLatticeWin(-1.35, -0.65, ha + 0.03, false, 0.75, 1.48);
    drawLatticeWin( 0.65,  1.35, ha + 0.03, false, 0.75, 1.48);
    drawLatticeWin(-0.85,  0.85, hb + 0.03, true, 0.75, 1.48);
  }

  let roofZ = z1;
  if (T.h2 > 0) {
    // Lower skirt eave collar + second story recessed pavilion with vermilion gallery balustrade
    drawChineseSweptRoof(c, L, -ha, ha, -hb, hb, z1 - 0.15, 0.55, T.tile, T.ridge, u, T.flare * 0.75);
    const ha2 = ha * 0.78, hb2 = hb * 0.80, z2 = z1 + T.h2;
    LBOX(-ha2, ha2, -hb2, hb2, z1 + 0.15, z2, T.wall);
    [-ha2, 0, ha2].forEach(ax => TH.ln(c, L(ax, hb2 + 0.02, z1 + 0.15), L(ax, hb2 + 0.02, z2), C_VERM, u * 0.09));
    [-hb2, 0, hb2].forEach(by => TH.ln(c, L(ha2 + 0.02, by, z1 + 0.15), L(ha2 + 0.02, by, z2), C_VERM, u * 0.09));
    drawLatticeWin(-0.65, 0.65, hb2 + 0.03, true, z1 + 0.45, z2 - 0.22);
    drawLatticeWin(-0.95, 0.95, ha2 + 0.03, false, z1 + 0.45, z2 - 0.22);
    drawChineseSweptRoof(c, L, -ha2, ha2, -hb2, hb2, z2, T.rise * 0.85, T.tile, T.ridge, u, T.flare);
    roofZ = z2;
  } else {
    drawChineseSweptRoof(c, L, -ha, ha, -hb, hb, z1, T.rise, T.tile, T.ridge, u, T.flare);
  }

  if (T.lanterns) {
    const pL1 = L(ha + 0.22, hb + 0.22, roofZ + T.flare * 0.92);
    const pL2 = L(-ha - 0.22, hb + 0.22, roofZ + T.flare * 0.60);
    drawHangingLantern(c, pL1[0], pL1[1], u, 0.92);
    drawHangingLantern(c, pL2[0], pL2[1], u, 0.85);
  }
}

const CHOUSE = (key) => ({
  cat: 'struct',
  rho: 0.14,
  draw(c, x, y, u, v) {
    const T = CHOUSE_T[key], o = v & 3, s = v >> 2, eave = (o >> 1) & 1;
    c.fillStyle = 'rgba(14, 34, 16, .30)';
    c.beginPath();
    c.ellipse(x + u * 0.7, y + u * 0.18, u * T.sw * (eave ? 1.18 : 1), u * T.sh, 0, 0, 7);
    c.fill();
    CFLIP(c, x, o & 1, () => CHOUSE_BODY(c, x, y, u, s, eave, T));
  }
});

const CHINA_ASSETS = {
  /* ---------- Chinese Trees & Bamboo (vibrant greens, blossoms & golden ginkgos) ---------- */
  bambooGrove: {
    cat: 'tree', rho: 0.12,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 7 + 3);
      CSH(c, x, y, u * 1.9);
      const nStalks = 7;
      for (let k = 0; k < nStalks; k++) {
        const bx = x + (k - (nStalks - 1) * 0.5) * u * 0.36 + (r() - 0.5) * u * 0.16;
        const by = y + (r() - 0.5) * u * 0.28;
        const h  = u * (4.8 + r() * 2.2);
        const lean = (k - (nStalks - 1) * 0.5) * u * 0.28 + (r() - 0.5) * u * 0.25;
        const col = k % 3 === 0 ? '#3f8f38' : k % 3 === 1 ? '#56ab43' : '#74bf44';

        // Curved segmented bamboo culm
        c.strokeStyle = col;
        c.lineWidth = u * (0.16 + (k % 2) * 0.04);
        c.lineCap = 'round';
        c.beginPath();
        c.moveTo(bx, by);
        c.quadraticCurveTo(bx + lean * 0.35, by - h * 0.55, bx + lean, by - h);
        c.stroke();

        // Dark bamboo internode rings + sunlit highlight
        for (let seg = 1; seg <= 5; seg++) {
          const t = seg / 6;
          const nx = bx + lean * t * t;
          const ny = by - h * t;
          TH.ln(c, [nx - u * 0.09, ny], [nx + u * 0.09, ny], '#235422', u * 0.045);
          // Feathery bamboo leaf sprays sprouting from upper nodes
          if (seg >= 3) {
            [-1, 1].forEach(dir => {
              const lx = nx + dir * u * (0.45 + r() * 0.45);
              const ly = ny - u * (0.12 + r() * 0.22);
              TH.ell(c, (nx + lx) * 0.5, (ny + ly) * 0.5, u * 0.38, u * 0.11, seg % 2 ? '#4ca63e' : '#78cc4b', dir * 0.35);
            });
          }
        }
      }
    }
  },
  weepingWillow: {
    cat: 'tree', rho: 0.13,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 13 + 7), H = u * (4.6 + r() * 0.9);
      CSH(c, x, y, u * 2.3);
      c.strokeStyle = '#4a3726';
      c.lineWidth = u * 0.68;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(x + u * 0.35, y - H * 0.4, x - u * 0.1, y - H * 0.72);
      c.stroke();
      const cy = y - H * 0.78;
      const pal = ['#3d8c40', '#52a847', '#6ec454', '#2e7033'];
      [[0, -0.45, 1.85, 1.05], [-1.3, 0, 1.3, 0.9], [1.3, 0, 1.3, 0.9], [0, -1.05, 1.35, 0.85]].forEach(([dx, dy, rx, ry], i) => {
        TH.blob(c, x + dx * u, cy + dy * u, u * rx, u * ry, pal[i % 4], r, 9);
      });
      // Long cascading jade-green willow curtains
      for (let k = 0; k < 26; k++) {
        const sx = x + (k / 25 - 0.5) * u * 3.7;
        const sy = cy + u * 0.35 + Math.abs(k / 25 - 0.5) * u * 0.25;
        const len = u * (1.7 + r() * 1.9);
        TH.ln(c, [sx, sy], [sx + (r() - 0.5) * u * 0.28, Math.min(y - u * 0.12, sy + len)], k % 3 === 0 ? '#6ec454' : k % 3 === 1 ? '#4ca346' : '#357a38', u * 0.095);
      }
    }
  },
  chinesePine: {
    cat: 'tree', rho: 0.12,
    draw(c, x, y, u, v) {
      // Windswept Huangshan Scholar's Pine with twisted dark trunk and layered horizontal foliage pads
      const r = mulberry(v * 17 + 2), H = u * (4.4 + r() * 1.1);
      CSH(c, x, y, u * 2.1);
      c.strokeStyle = '#3b2b20';
      c.lineWidth = u * 0.52;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(x, y);
      c.bezierCurveTo(x - u * 0.9, y - H * 0.3, x + u * 0.85, y - H * 0.65, x + u * 0.25, y - H * 0.92);
      c.stroke();

      const pads = [
        [-1.35, -0.52, 1.25, 0.42, '#245c36'],
        [ 1.30, -0.64, 1.30, 0.44, '#2d6e3f'],
        [-0.55, -0.82, 1.15, 0.38, '#388249'],
        [ 0.35, -0.98, 1.45, 0.48, '#29663b']
      ];
      pads.forEach(([dx, fy, rx, ry, col]) => {
        TH.ln(c, [x + u * 0.1, y + H * (fy + 0.12)], [x + dx * u, y + H * fy], '#3b2b20', u * 0.18);
        TH.blob(c, x + dx * u, y + H * fy, u * rx, u * ry, col, r, 9);
      });
    }
  },
  peachBlossom: {
    cat: 'tree', rho: 0.11,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 19 + 4), H = u * (4.0 + r() * 0.9);
      CSH(c, x, y, u * 1.9);
      c.strokeStyle = '#473026';
      c.lineWidth = u * 0.48;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(x - u * 0.45, y - H * 0.45, x + u * 0.15, y - H * 0.72);
      c.stroke();
      const cy = y - H * 0.78;
      const pinks = ['#f472b6', '#fb7185', '#f9a8d4', '#fda4af'];
      [[0, -0.25, 1.55, 1.0], [-1.15, 0.05, 1.05, 0.8], [1.15, 0.05, 1.05, 0.8], [-0.55, -0.95, 1.15, 0.82], [0.6, -0.92, 1.1, 0.8]].forEach(([dx, dy, rx, ry], i) => {
        TH.blob(c, x + dx * u, cy + dy * u, u * rx, u * ry, pinks[(i + v) % 4], r, 9);
      });
      // Fallen pink petals on the grass
      for (let k = 0; k < 7; k++) {
        TH.ell(c, x + (r() - 0.5) * u * 2.4, y + (r() - 0.3) * u * 0.7, u * 0.09, u * 0.05, '#f9a8d4', r() * 3);
      }
    }
  },
  cherryBlossom: {
    cat: 'tree', rho: 0.11,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 23 + 9), H = u * (4.1 + r() * 0.8);
      CSH(c, x, y, u * 1.9);
      c.strokeStyle = '#3f2b24';
      c.lineWidth = u * 0.46;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(x + u * 0.4, y - H * 0.45, x - u * 0.1, y - H * 0.72);
      c.stroke();
      const cy = y - H * 0.78;
      const whites = ['#fff1f2', '#ffe4e6', '#fecdd3', '#ffffff'];
      [[0, -0.25, 1.55, 1.0], [-1.1, 0.05, 1.05, 0.8], [1.15, 0.05, 1.05, 0.8], [-0.5, -0.95, 1.1, 0.82], [0.55, -0.92, 1.1, 0.8]].forEach(([dx, dy, rx, ry], i) => {
        TH.blob(c, x + dx * u, cy + dy * u, u * rx, u * ry, whites[(i + v) % 4], r, 9);
      });
    }
  },
  ginkgoTree: {
    cat: 'tree', rho: 0.11,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 29 + 1), H = u * (4.6 + r() * 1.0);
      CSH(c, x, y, u * 1.9);
      TH.ln(c, [x, y], [x, y - H * 0.65], '#574232', u * 0.48);
      const cy = y - H * 0.75;
      const golds = ['#eab308', '#facc15', '#d97706', '#fde047'];
      [[0, -0.3, 1.5, 1.1], [-1.05, 0.1, 1.0, 0.85], [1.05, 0.1, 1.0, 0.85], [0, -1.15, 1.15, 0.9]].forEach(([dx, dy, rx, ry], i) => {
        TH.blob(c, x + dx * u, cy + dy * u, u * rx, u * ry, golds[(i + v) % 4], r, 9);
      });
    }
  },
  bambooSapling: {
    cat: 'tree', rho: 0.07,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 31 + 3);
      CSH(c, x, y, u * 1.1);
      for (let k = 0; k < 4; k++) {
        const bx = x + (k - 1.5) * u * 0.28;
        const h  = u * (2.2 + r() * 1.1);
        const lean = (k - 1.5) * u * 0.22;
        TH.ln(c, [bx, y], [bx + lean, y - h], k % 2 ? '#56ab43' : '#74bf44', u * 0.12);
        TH.ell(c, bx + lean + u * 0.18, y - h * 0.75, u * 0.30, u * 0.09, '#65b846', 0.3);
        TH.ell(c, bx + lean - u * 0.18, y - h * 0.90, u * 0.30, u * 0.09, '#4ca33e', -0.3);
      }
    }
  },

  /* ---------- Undergrowth & Scholar's Garden Features ---------- */
  azaleaBush: {
    cat: 'shrub', rho: 0.06,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 5 + 9);
      TH.ell(c, x + u * 0.18, y + u * 0.08, u * 1.05, u * 0.32, 'rgba(14, 34, 16, .28)');
      [[-0.5, -0.4, 0.78, 0.55], [0.5, -0.4, 0.78, 0.55], [0, -0.8, 0.82, 0.58]].forEach(([dx, dy, rx, ry], i) => {
        TH.blob(c, x + dx * u, y + dy * u, u * rx, u * ry, ['#2d7a36', '#3d9444', '#4ca850'][i], r, 8);
      });
      for (let k = 0; k < 8; k++) {
        TH.ell(c, x + (r() - 0.5) * u * 1.3, y - u * (0.28 + r() * 0.72), u * 0.11, u * 0.09, k % 2 ? '#ec4899' : '#f43f5e');
      }
    }
  },
  fernCluster: {
    cat: 'shrub', rho: 0.06,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 3 + 7);
      TH.ell(c, x + u * 0.18, y + u * 0.08, u * 1.05, u * 0.30, 'rgba(14, 34, 16, .26)');
      for (let k = 0; k < 9; k++) {
        const a = -Math.PI + 0.15 + k / 8 * (Math.PI - 0.3);
        const len = u * (1.05 + r() * 0.45);
        const ex = x + Math.cos(a) * len, ey = y - u * 0.1 + Math.sin(a) * len * 0.6 + len * 0.4;
        c.lineCap = 'round';
        c.strokeStyle = k % 2 ? '#3b8c3e' : '#58b34c';
        c.lineWidth = u * 0.36;
        c.beginPath();
        c.moveTo(x, y - u * 0.1);
        c.quadraticCurveTo(x + Math.cos(a) * len * 0.55, y - u * 0.1 + Math.sin(a) * len * 0.7 - len * 0.25, ex, ey);
        c.stroke();
      }
    }
  },
  taihuRock: {
    cat: 'rock', rho: 0.08,
    draw(c, x, y, u, v) {
      // Sculpted porous Chinese Taihu scholar's limestone rock on a carved stone pedestal
      const r = mulberry(v * 11 + 5);
      CSH(c, x, y, u * 1.4);
      CBOX(c, x, y, u, -0.85, 0.85, -0.55, 0.55, 0, 0.32, C_MARBLE);
      TH.poly(c, [
        [x - u * 0.65, y - u * 0.3],
        [x - u * 0.85, y - u * 1.3],
        [x - u * 0.35, y - u * 2.25],
        [x + u * 0.45, y - u * 2.45],
        [x + u * 0.82, y - u * 1.55],
        [x + u * 0.58, y - u * 0.3]
      ], '#9ca3af', '#4b5563', u * 0.05);
      TH.poly(c, [
        [x + u * 0.15, y - u * 2.35],
        [x + u * 0.82, y - u * 1.55],
        [x + u * 0.58, y - u * 0.3],
        [x + u * 0.05, y - u * 0.3]
      ], '#6b7280');
      // Characteristic eroded Taihu rock holes showing background green through the stone
      TH.ell(c, x - u * 0.15, y - u * 1.45, u * 0.20, u * 0.16, '#4d7c38');
      TH.ell(c, x + u * 0.22, y - u * 0.92, u * 0.15, u * 0.12, '#4d7c38');
      TH.ell(c, x - u * 0.35, y - u * 0.45, u * 0.32, u * 0.14, '#4d8a3a');
    }
  },
  lotusPond: {
    cat: 'ruin', rho: 0.11,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 9 + 2);
      TH.ell(c, x, y, u * 2.35, u * 1.05, '#9ca3af');
      TH.ell(c, x, y, u * 2.05, u * 0.88, '#1d6b78');
      TH.ell(c, x - u * 0.15, y - u * 0.04, u * 1.65, u * 0.68, '#28919e');
      // Lily pads, blooming pink lotus flowers & orange koi fish
      [[-0.85, -0.15, 0.34, true], [0.65, 0.18, 0.38, true], [-0.15, 0.28, 0.30, false], [0.85, -0.22, 0.28, false]].forEach(([dx, dy, rad, hasFlower]) => {
        const px = x + dx * u, py = y + dy * u;
        TH.ell(c, px, py, u * rad, u * rad * 0.52, '#3ca346');
        if (hasFlower) {
          TH.ell(c, px, py - u * 0.08, u * 0.16, u * 0.12, '#f472b6');
          TH.ell(c, px, py - u * 0.11, u * 0.08, u * 0.06, '#fef08a');
        }
      });
      // Swimming orange koi fish
      TH.ell(c, x + u * 0.12, y - u * 0.16, u * 0.20, u * 0.07, '#f97316', -0.25);
      TH.ell(c, x - u * 0.42, y + u * 0.08, u * 0.17, u * 0.06, '#ef4444', 0.2);
    }
  },

  /* ---------- Classical Chinese Garden Landmarks & Structures ---------- */
  paifangGate: {
    cat: 'ruin', rho: 0.14,
    draw(c, x, y, u, v) {
      // Ceremonial triple-bay Chinese Paifang archway on the back rim
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      CFLIP(c, x, v & 1, () => {
        CSH(c, x, y, u * 3.1);
        [-2.1, -0.85, 0.85, 2.1].forEach(px => {
          CBOX(c, x, y, u, px - 0.18, px + 0.18, -0.25, 0.25, 0, 0.38, C_MARBLE);
          TH.ln(c, I(px, 0, 0.38), I(px, 0, 3.35), C_VERM, u * 0.22);
        });
        // Ornate painted lintel frieze
        CBOX(c, x, y, u, -2.2, 2.2, -0.16, 0.16, 2.65, 3.15, C_VERM_D);
        CBOX(c, x, y, u, -0.75, 0.75, -0.18, 0.18, 2.75, 3.25, C_GOLD);
        // Side roofs & taller central imperial-gold roof with upturned eaves
        drawChineseSweptRoof(c, I, -2.45, -0.82, -0.45, 0.45, 3.05, 0.85, C_JADE, '#a7f3d0', u, 0.32);
        drawChineseSweptRoof(c, I,  0.82,  2.45, -0.45, 0.45, 3.05, 0.85, C_JADE, '#a7f3d0', u, 0.32);
        drawChineseSweptRoof(c, I, -1.05,  1.05, -0.55, 0.55, 3.65, 1.15, C_GOLD, '#fef08a', u, 0.42);
      });
    }
  },
  moonGateWall: {
    cat: 'ruin', rho: 0.10,
    draw(c, x, y, u, v) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      CFLIP(c, x, v & 1, () => {
        CSH(c, x, y, u * 2.5);
        CBOX(c, x, y, u, -2.0, 2.0, -0.24, 0.24, 0, 0.28, C_MARBLE);
        // Whitewashed garden wall with circular Moon Gate portal revealing bamboo behind
        const wallPts = [I(-1.95, 0.22, 0.28), I(1.95, 0.22, 0.28), I(1.95, 0.22, 2.45), I(-1.95, 0.22, 2.45)];
        TH.poly(c, wallPts, C_WALL, '#cbd5e1', u * 0.04);
        CBOX(c, x, y, u, 1.95, 2.18, -0.24, 0.24, 0, 2.45, shade(C_WALL, -0.24));

        // Circular Moon Gate opening
        const mg = I(0, 0.24, 1.32);
        c.save();
        c.beginPath();
        c.ellipse(mg[0], mg[1], u * 0.66, u * 0.82, -0.18, 0, 7);
        c.fillStyle = '#264f2a';
        c.fill();
        c.lineWidth = u * 0.09;
        c.strokeStyle = C_VERM;
        c.stroke();
        // Bamboo stalks visible inside the Moon Gate
        c.clip();
        TH.ln(c, [mg[0] - u * 0.18, mg[1] + u * 0.8], [mg[0] - u * 0.12, mg[1] - u * 0.8], '#56ab43', u * 0.11);
        TH.ln(c, [mg[0] + u * 0.16, mg[1] + u * 0.8], [mg[0] + u * 0.22, mg[1] - u * 0.8], '#74bf44', u * 0.10);
        c.restore();

        // Dark clay tile wall coping with upturned end caps
        drawChineseSweptRoof(c, I, -2.05, 2.05, -0.34, 0.34, 2.45, 0.48, C_SLATE, '#94a3b8', u, 0.26);
      });
    }
  },
  gardenPavilion: {
    cat: 'ruin', rho: 0.10,
    draw(c, x, y, u, v) {
      // Open-air hexagonal Chinese Ting pavilion with upturned imperial-gold double eaves
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      CSH(c, x, y, u * 2.2);
      const rad = 1.35;
      const hexPts = (r, z) => Array.from({ length: 6 }, (_, i) => {
        const a = i / 6 * Math.PI * 2 + 0.3;
        return I(Math.cos(a) * r, Math.sin(a) * r, z);
      });
      TH.poly(c, hexPts(rad + 0.22, 0), '#cbd5e1');
      TH.poly(c, hexPts(rad + 0.15, 0.34), C_MARBLE, '#94a3b8', u * 0.04);

      // Six lacquered vermilion columns + carved wooden bench rails
      const cols = hexPts(rad * 0.86, 0.34);
      const tops = hexPts(rad * 0.86, 2.25);
      cols.forEach((p, i) => {
        TH.ln(c, p, tops[i], C_VERM, u * 0.12);
        const nxt = cols[(i + 1) % 6];
        TH.ln(c, [p[0], p[1] - u * 0.45], [nxt[0], nxt[1] - u * 0.45], C_VERM_D, u * 0.07);
      });

      // Lower & upper upturned hexagonal conical roofs
      const apex1 = I(0, 0, 3.45);
      const eave1 = hexPts(rad * 1.28, 2.38);
      for (let i = 0; i < 6; i++) {
        TH.poly(c, [eave1[i], eave1[(i + 1) % 6], apex1], i % 2 ? C_GOLD : shade(C_GOLD, -0.16), shade(C_GOLD, -0.35), u * 0.03);
      }
      const apex2 = I(0, 0, 4.35);
      const eave2 = hexPts(rad * 0.72, 3.22);
      for (let i = 0; i < 6; i++) {
        TH.poly(c, [eave2[i], eave2[(i + 1) % 6], apex2], i % 2 ? '#facc15' : C_GOLD, shade(C_GOLD, -0.35), u * 0.03);
      }
      TH.ell(c, apex2[0], apex2[1] - u * 0.12, u * 0.14, u * 0.18, '#fef08a');
    }
  },
  archedStoneBridge: {
    cat: 'ruin', rho: 0.11,
    draw(c, x, y, u, v) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      CFLIP(c, x, v & 1, () => {
        // Stream water beneath bridge
        TH.ell(c, x, y + u * 0.15, u * 2.2, u * 0.85, '#1d6b78');
        TH.ell(c, x, y + u * 0.12, u * 1.85, u * 0.65, '#28919e');

        // Humped white-marble arch deck
        const N = 12, topL = [], topR = [], botR = [];
        for (let k = 0; k <= N; k++) {
          const t = k / N, X = -1.9 + 3.8 * t;
          const zArch = 0.22 + Math.sin(t * Math.PI) * 1.15;
          topL.push(I(X, -0.65, zArch));
          topR.push(I(X,  0.65, zArch));
          botR.push(I(X,  0.65, Math.max(0, zArch - 0.34)));
        }
        TH.poly(c, topL.concat(topR.slice().reverse()), C_MARBLE, '#94a3b8', u * 0.04);
        TH.poly(c, topR.concat(botR.slice().reverse()), '#cbd5e1');

        // Carved marble balustrade posts & handrails
        [-0.65, 0.65].forEach(Y => {
          for (let k = 0; k <= 6; k++) {
            const t = k / 6, X = -1.85 + 3.7 * t;
            const zA = 0.22 + Math.sin(t * Math.PI) * 1.15;
            TH.ln(c, I(X, Y, zA), I(X, Y, zA + 0.52), C_MARBLE, u * 0.08);
            TH.ell(c, ...I(X, Y, zA + 0.56), u * 0.06, u * 0.06, '#f8fafc');
          }
        });
      });
    }
  },
  drumTower: {
    cat: 'struct', rho: 0.08,
    draw(c, x, y, u, v) {
      // Multi-tiered Chinese Drum/Bell Watchtower placed beside a villa at Tier 4-5
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      CFLIP(c, x, v & 1, () => {
        CSH(c, x, y, u * 2.2);
        // Stone trapezoidal base podium with arched portal
        CBOX(c, x, y, u, -1.25, 1.25, -1.25, 1.25, 0, 2.35, C_BRICK);
        TH.poly(c, [I(-0.36, 1.26, 0), I(0.36, 1.26, 0), I(0.36, 1.26, 1.15), I(0, 1.26, 1.48), I(-0.36, 1.26, 1.15)], '#1c1917', C_MARBLE, u * 0.06);

        // Tier 1 timber gallery + upturned jade-glazed roof
        CBOX(c, x, y, u, -1.02, 1.02, -1.02, 1.02, 2.35, 3.95, C_VERM);
        drawChineseSweptRoof(c, I, -1.25, 1.25, -1.25, 1.25, 3.95, 0.85, C_JADE, '#a7f3d0', u, 0.38);

        // Tier 2 upper bell/drum belfry + imperial-gold crowning roof
        CBOX(c, x, y, u, -0.76, 0.76, -0.76, 0.76, 4.45, 5.75, C_VERM_D);
        TH.poly(c, [I(-0.26, 0.77, 4.65), I(0.26, 0.77, 4.65), I(0.26, 0.77, 5.45), I(-0.26, 0.77, 5.45)], '#fef08a');
        drawChineseSweptRoof(c, I, -0.98, 0.98, -0.98, 0.98, 5.75, 1.05, C_GOLD, '#fef08a', u, 0.42);
      });
    }
  },

  /* ---------- Courtyard Residences ---------- */
  courtyardHouse: CHOUSE('courtyardHouse'),
  vermilionVilla: CHOUSE('vermilionVilla'),
  teaHouse:       CHOUSE('teaHouse'),

  /* ---------- Small Chinese Garden Props (lower tiers) ---------- */
  stoneLantern: {
    cat: 'prop', rho: 0.03,
    draw(c, x, y, u) {
      TH.ell(c, x + u * 0.22, y + u * 0.07, u * 0.65, u * 0.20, 'rgba(14, 34, 16, .28)');
      TH.ln(c, [x, y], [x, y - u * 1.9], '#9ca3af', u * 0.26);
      TH.poly(c, [[x - u * 0.35, y], [x + u * 0.35, y], [x + u * 0.22, y - u * 0.42], [x - u * 0.22, y - u * 0.42]], '#6b7280');
      TH.poly(c, [[x - u * 0.32, y - u * 1.85], [x + u * 0.32, y - u * 1.85], [x + u * 0.28, y - u * 2.35], [x - u * 0.28, y - u * 2.35]], '#fef08a', '#4b5563', u * 0.05);
      TH.poly(c, [[x - u * 0.56, y - u * 2.32], [x + u * 0.56, y - u * 2.32], [x, y - u * 2.85]], '#6b7280');
      TH.ell(c, x, y - u * 2.92, u * 0.10, u * 0.12, '#9ca3af');
    }
  },
  redLanternPost: {
    cat: 'prop', rho: 0.03,
    draw(c, x, y, u) {
      TH.ell(c, x + u * 0.25, y + u * 0.08, u * 0.68, u * 0.22, 'rgba(14, 34, 16, .28)');
      TH.ln(c, [x, y], [x, y - u * 3.1], C_VERM, u * 0.22);
      TH.ln(c, [x - u * 0.45, y - u * 2.85], [x + u * 0.65, y - u * 2.85], C_VERM_D, u * 0.12);
      drawHangingLantern(c, x + u * 0.55, y - u * 2.82, u, 1.05);
      drawHangingLantern(c, x - u * 0.38, y - u * 2.82, u, 0.88);
    }
  },
  guardianLion: {
    cat: 'prop', rho: 0.04,
    draw(c, x, y, u, v) {
      CFLIP(c, x, v & 1, () => {
        TH.ell(c, x + u * 0.22, y + u * 0.08, u * 0.85, u * 0.28, 'rgba(14, 34, 16, .28)');
        CBOX(c, x, y, u, -0.65, 0.65, -0.45, 0.45, 0, 0.55, C_MARBLE);
        TH.ell(c, x - u * 0.05, y - u * 1.05, u * 0.48, u * 0.42, '#9ca3af');
        TH.ell(c, x + u * 0.22, y - u * 1.48, u * 0.36, u * 0.34, '#cbd5e1');
        TH.ell(c, x + u * 0.36, y - u * 0.82, u * 0.20, u * 0.18, C_GOLD); // Brocade ball under paw
      });
    }
  },
  bonsaiPlanter: {
    cat: 'prop', rho: 0.04,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 5 + 3);
      TH.ell(c, x + u * 0.18, y + u * 0.08, u * 0.85, u * 0.26, 'rgba(14, 34, 16, .26)');
      TH.poly(c, [[x - u * 0.55, y - u * 0.55], [x + u * 0.55, y - u * 0.55], [x + u * 0.42, y], [x - u * 0.42, y]], '#1d4ed8', '#1e3a8a', u * 0.05);
      TH.ln(c, [x, y - u * 0.55], [x - u * 0.18, y - u * 1.25], '#4a3320', u * 0.16);
      TH.blob(c, x - u * 0.32, y - u * 1.38, u * 0.55, u * 0.26, '#2d7a36', r, 7);
      TH.blob(c, x + u * 0.28, y - u * 1.18, u * 0.48, u * 0.22, '#4ca850', r, 7);
    }
  },
  jadeHill: {
    cat: 'hill', rho: 0.14,
    draw(c, x, y, u, v) {
      // Layered Chinese Guilin-inspired jade & limestone hillside knoll for the rear rim
      const r = mulberry(v * 13 + 7);
      const w = u * (2.6 + r() * 0.7);
      const h = u * (2.2 + r() * 0.7);

      // Soft ground shadow
      TH.ell(c, x, y + u * 0.08, w * 1.04, u * 0.42, 'rgba(14, 34, 16, .26)');

      // Secondary offset rear foothill hump for depth
      const ox = (v % 2 ? 1 : -1) * w * 0.42;
      const hw2 = w * 0.72, hh2 = h * 0.72;
      c.fillStyle = '#3f7634';
      c.beginPath();
      c.moveTo(x + ox - hw2, y + u * 0.04);
      c.bezierCurveTo(x + ox - hw2 * 0.55, y - hh2 * 0.95, x + ox + hw2 * 0.55, y - hh2 * 0.95, x + ox + hw2, y + u * 0.04);
      c.closePath();
      c.fill();

      // Main sculpted emerald-jade hillside dome
      const grad = c.createLinearGradient(x - w * 0.5, y - h, x + w * 0.5, y);
      grad.addColorStop(0.0, '#72b84c');
      grad.addColorStop(0.55, '#52943c');
      grad.addColorStop(1.0, '#366b2d');
      c.fillStyle = grad;
      c.beginPath();
      c.moveTo(x - w, y + u * 0.06);
      c.bezierCurveTo(x - w * 0.58, y - h * 1.05, x + w * 0.58, y - h * 1.05, x + w, y + u * 0.06);
      c.quadraticCurveTo(x, y + u * 0.24, x - w, y + u * 0.06);
      c.closePath();
      c.fill();

      // Sunlit upper ridge highlight
      c.fillStyle = 'rgba(182, 232, 118, 0.28)';
      c.beginPath();
      c.ellipse(x - w * 0.16, y - h * 0.44, w * 0.46, h * 0.24, -0.15, 0, Math.PI * 2);
      c.fill();

      // Exposed karst limestone outcrop crag on flank
      const rx = x + (v % 2 ? -0.34 : 0.34) * w;
      const ry = y - h * 0.26;
      TH.poly(c, [
        [rx - u * 0.48, ry + u * 0.24],
        [rx - u * 0.34, ry - u * 0.34],
        [rx + u * 0.14, ry - u * 0.44],
        [rx + u * 0.46, ry + u * 0.18]
      ], '#9ca3af', '#6b7280', u * 0.04);
      TH.poly(c, [
        [rx + u * 0.05, ry - u * 0.42],
        [rx + u * 0.46, ry + u * 0.18],
        [rx + u * 0.12, ry + u * 0.22]
      ], '#6b7280');

      // Shrubs & bamboo tufts nestled along the ridge & base
      TH.blob(c, x - w * 0.38, y - h * 0.16, u * 0.46, u * 0.28, '#2f6e33', r, 7);
      TH.blob(c, x + w * 0.42, y - h * 0.12, u * 0.42, u * 0.25, '#468c3e', r, 7);
    }
  }
};

/* ===== MACRO-LAND ENGINE (hex geometry, planner, 5-tier baker) ===== */
const W3 = Math.sqrt(3), HX = W3 / 2, HV = [[HX, 0.29], [0, 0.58], [-HX, 0.29], [-HX, -0.29], [0, -0.58], [HX, -0.29]];
const LAND_ROWS = {
  A: [[-1, 0, 1], [-1.5, -0.5, 0.5, 1.5], [-1, 0, 1], [-0.5, 0.5]],
  B: [[0, 1, 2], [-0.5, 0.5, 1.5], [-1, 0, 1], [-0.5, 0.5, 1.5]],
  C: [[0], [-0.5, 0.5, 1.5], [-1, 0, 1], [-0.5]],
  D: [[0, 1, 2], [-0.5, 0.5, 1.5], [0, 1]]
};
const LAND_KEEP = { rx: 0.52, ry: 0.34 };
const vkey = p => p[0].toFixed(3) + ',' + p[1].toFixed(3);
function hexInside(dx, dy, s) {
  const ax = Math.abs(dx) / s, ay = Math.abs(dy) / s;
  return ax <= HX && ay <= 0.58 - 0.3349 * ax;
}

function landGeometry(shape) {
  const centers = [];
  LAND_ROWS[shape].forEach((row, r) => row.forEach((u, i) => centers.push({ x: u * W3, y: r * 0.87, row: r, col: i })));
  const edges = new Map(), verts = new Map();
  centers.forEach((c, ci) => {
    for (let k = 0; k < 6; k++) {
      const a = [c.x + HV[k][0], c.y + HV[k][1]], b = [c.x + HV[(k + 1) % 6][0], c.y + HV[(k + 1) % 6][1]];
      const ka = vkey(a), kb = vkey(b), ek = ka < kb ? ka + '|' + kb : kb + '|' + ka;
      let e = edges.get(ek);
      if (!e) { e = { a, b, ka, kb, hexes: [] }; edges.set(ek, e); }
      e.hexes.push(ci);
      [[ka, a], [kb, b]].forEach(([kk, p]) => {
        let v = verts.get(kk);
        if (!v) { v = { k: kk, x: p[0], y: p[1], hexes: new Set() }; verts.set(kk, v); }
        v.hexes.add(ci);
      });
    }
  });
  const E = [...edges.values()].map(e => {
    const mid = [(e.a[0] + e.b[0]) / 2, (e.a[1] + e.b[1]) / 2], len = Math.hypot(e.b[0] - e.a[0], e.b[1] - e.a[1]), vertical = Math.abs(e.a[0] - e.b[0]) < 1e-6;
    let n = null, cls = null;
    if (e.hexes.length === 1) {
      const c = centers[e.hexes[0]];
      let nx = mid[0] - c.x, ny = mid[1] - c.y;
      const m = Math.hypot(nx, ny);
      n = [nx / m, ny / m];
      cls = n[1] < -0.4 ? 'top' : n[1] > 0.4 ? 'bottom' : 'side';
    }
    return Object.assign(e, { mid, len, vertical, outer: e.hexes.length === 1, n, cls });
  });
  const V = [...verts.values()].map(v => Object.assign(v, { junction: v.hexes.size >= 3 }));
  const xs = [], ys = [];
  centers.forEach(c => { xs.push(c.x - HX, c.x + HX); ys.push(c.y - 0.58, c.y + 0.58); });
  return { centers, edges: E, verts: V, bbox: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) } };
}

/* ---- generic 5-tier baker ---- */

function bakeLandTheme(T, shape, tier, R, opts) {
  opts = opts || {};
  const sc = opts.scale || getBakeScale();
  const m = opts.mirrorX ? -1 : 1;
  const ground = opts.ground || T.groundCol;
  const clr = (opts.clear || []).map(p => [Math.min(p[0], p[1]), Math.max(p[0], p[1])]);
  const key = [T.id, shape, tier, R, m, ground, sc, JSON.stringify(clr), JSON.stringify(opts.clearTiles || [])].join('|');
  const cached = revisedLandCache.get(key); if (cached) return cached;

  const plan = T.plan(shape), G = plan.G, bb = G.bbox;
  const x0 = m > 0 ? bb.minX : -bb.maxX, x1 = m > 0 ? bb.maxX : -bb.minX;
  const mx = 0.75, top = T.top || 1.45, bot = 0.85;
  const W = Math.ceil((x1 - x0 + 2 * mx) * R), H = Math.ceil((bb.maxY - bb.minY + top + bot) * R);
  const ox = (-x0 + mx) * R, oy = (-bb.minY + top) * R, u = R * 0.075;

  const mk = () => {
    const cv = document.createElement('canvas');
    cv.width = Math.ceil(W * sc);
    cv.height = Math.ceil(H * sc);
    const g = cv.getContext('2d');
    g.scale(sc, sc);
    return [cv, g];
  };
  const [back, cb] = mk();
  T.ground(cb, G, R, ox, oy, m, ground, ({ A: 1101, B: 2202, C: 3303, D: 4404 })[shape]);
  const bridges = clr.map(([i, j]) => [G.centers[i], G.centers[j]]);
  const vis = plan.objs.filter(o => o.tier <= tier && tier <= o.maxT && !bridges.some(([a, c]) => westCapsuleHit(a, c, o.x, o.y, o.rho)) && !(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));

  const sprites = vis.map(o => {
    const asset = T.assets[o.kind], base = u * (o.scale || 1);
    const reach = Math.max(asset.reach || 4, (asset.tall || 9) * 0.45);
    const span = [o.p1, o.p2].filter(Boolean).reduce((max, p) =>
      Math.max(max, Math.abs(p[0] - o.x) * R / 8, Math.abs(p[1] - o.y) * R / 4), 0);
    const unit = Math.max(base, base * reach / 8, span);
    return { x: m * o.x * R, y: o.y * R, unit, draw: (ctx, x, y) => {
      ctx.save();
      ctx.translate(x - (ox + m * o.x * R), y - (oy + o.y * R));
      T.assets[o.kind].draw(ctx,ox+m*o.x*R,oy+o.y*R,u*(o.scale||1),o.v);
      ctx.restore();
    }};
  });
  const front = document.createElement('canvas');
  front.width = front.height = 1;
  const frontRect = {x: 0, y: 0, w: 1, h: 1};
  const centers = G.centers.map(c => ({x: ox + m * c.x * R, y: oy + c.y * R, row: c.row}));
  return revisedLandCache.set(key, {back, front, frontRect, w: W, h: H, ox, oy, centers, sc, shape, tier, mirrorX: m < 0, sprites});
}

function westCapsuleHit(a, b, x, y, rho) {
  const A = LAND_KEEP.rx + rho * 0.55, B = LAND_KEEP.ry + rho * 0.28;
  const dx = b.x - a.x, dy = b.y - a.y, px = x - a.x, py = y - a.y;
  const q = dx * dx / (A * A) + dy * dy / (B * B);
  const t = Math.max(0, Math.min(1, (px * dx / (A * A) + py * dy / (B * B)) / q));
  const ex = (px - t * dx) / A, ey = (py - t * dy) / B;
  return ex * ex + ey * ey < 1;
}

/* ===== CHINESE LAND: 5-tier spatial planner & vibrant jade meadow ground ===== */
const CHINA_REGION = {
  top:    { bambooGrove: .26, chinesePine: .22, weepingWillow: .10, peachBlossom: .12, cherryBlossom: .10, ginkgoTree: .10, bambooSapling: .10 },
  mid:    { bambooGrove: .24, chinesePine: .16, weepingWillow: .14, peachBlossom: .14, cherryBlossom: .10, ginkgoTree: .12, bambooSapling: .10 },
  bottom: { bambooGrove: .20, chinesePine: .14, weepingWillow: .12, peachBlossom: .14, cherryBlossom: .10, ginkgoTree: .10, bambooSapling: .20 }
};
const CHINA_LOW = [['bambooSapling', 1.05], ['peachBlossom', 0.72], ['cherryBlossom', 0.72], ['bambooSapling', 0.85], ['ginkgoTree', 0.68], ['chinesePine', 0.65]];
const CHINA_CAP = { weepingWillow: 6, ginkgoTree: 8, peachBlossom: 10, cherryBlossom: 9 };
const CHINA_UNDER = ['azaleaBush', 'fernCluster', 'azaleaBush', 'fernCluster', 'taihuRock'];
const CHINA_PLAN_CACHE = {};

function getChinaPlan(shape) {
  if (CHINA_PLAN_CACHE[shape]) return CHINA_PLAN_CACHE[shape];
  const G = landGeometry(shape), rng = mulberry(({ A: 5101, B: 6202, C: 7303, D: 8404 })[shape]);
  const placed = [], bb = G.bbox, used = {}, A = CHINA_ASSETS;
  const cx = G.centers.reduce((a, c) => a + c.x, 0) / G.centers.length;
  const cy = G.centers.reduce((a, c) => a + c.y, 0) / G.centers.length;

  // Tighter boundary check (1.07 vs 1.3) + margin check so outer sprites stay close to the hex rim and never spill into neighboring lands
  const inLand = (x, y, pad = 1.07) => G.centers.some(c => hexInside(x - c.x, y - c.y, pad));
  const free = (x, y, rho) => G.centers.every(c => {
    const dx = (x - c.x) / (LAND_KEEP.rx + rho * 0.42), dy = (y - c.y) / (LAND_KEEP.ry + rho * 0.26);
    return dx * dx + dy * dy >= 1;
  });
  const clearOthers = (x, y, rho) => placed.every(o => Math.hypot(x - o.x, (y - o.y) * 1.7) >= (rho + o.rho * (o.clear || 1)) * 0.68);
  const pickFrom = (w, ok) => {
    for (let g = 0; g < 12; g++) {
      let t = rng(), acc = 0, pick = Object.keys(w)[0];
      for (const k in w) { acc += w[k]; if (t <= acc) { pick = k; break; } }
      if (!ok || ok(pick)) return pick;
    }
    return 'bambooGrove';
  };
  const capOk = k => !(CHINA_CAP[k] && (used[k] || 0) >= CHINA_CAP[k]);
  const regionOf = y => {
    const n = (y - bb.minY) / (bb.maxY - bb.minY);
    return n < 0.34 ? CHINA_REGION.top : n < 0.68 ? CHINA_REGION.mid : CHINA_REGION.bottom;
  };

  const place = (kind, x, y, extra) => {
    const D = A[kind], sc = (extra && extra.scale) || (D.cat === 'tree' ? 0.86 + rng() * 0.34 : D.cat === 'shrub' ? 0.88 + rng() * 0.28 : 1), rho = D.rho * sc;
    // Structures, hills, and wide landmarks get a tighter hex-containment radius so their roofs/edges don't overhang into adjacent lands
    const maxPad = (extra && extra.pad) || ((D.cat === 'struct' || D.cat === 'ruin' || D.cat === 'hill') ? 0.96 : 1.05);
    for (let t = 0; t < 8; t++) {
      const px = x + (t ? (rng() - 0.5) * 0.10 * t : 0), py = y + (t ? (rng() - 0.5) * 0.08 * t : 0);
      if (!inLand(px, py, maxPad) || !free(px, py, rho) || !clearOthers(px, py, rho)) continue;
      if ((D.cat === 'tree' || D.cat === 'shrub' || D.cat === 'prop') && placed.some(o => o.noSouth && Math.abs(px - o.x) < 0.3 && py - o.y > -0.05 && py - o.y < 0.36)) continue;
      const o = Object.assign({ kind, x: px, y: py, rho, scale: sc, v: Math.floor(rng() * 1000), cat: D.cat, pri: rng(), minT: 1, maxT: 5 }, extra || {});
      o.scale = sc;
      placed.push(o);
      used[kind] = (used[kind] || 0) + 1;
      return o;
    }
    return null;
  };

  const tree = (x, y, extra, dom, low) => {
    if (low) {
      const L = CHINA_LOW[Math.floor(rng() * CHINA_LOW.length)];
      return place(L[0], x, y, Object.assign({}, extra || {}, { scale: L[1] * (0.9 + rng() * 0.2) }));
    }
    return place(dom && rng() < 0.55 && capOk(dom) ? dom : pickFrom(regionOf(y), capOk), x, y, extra || {});
  };
  const under = (x, y, extra) => place(CHINA_UNDER[Math.floor(rng() * CHINA_UNDER.length)], x, y, extra || {});

  const outer = G.edges.filter(e => e.outer), top = outer.filter(e => e.cls === 'top'), sides = outer.filter(e => e.cls === 'side'), interior = G.edges.filter(e => !e.outer);
  const KS = G.centers.length / 12;
  const thin = l => { const n = Math.max(1, Math.round(l.length * KS)); return Array.from({ length: n }, (_, i) => l[Math.floor((i + 0.5) * l.length / n)]); };
  const cnt = n => Math.max(1, Math.round(n * KS));
  const onEdge = (e, t, off) => [e.a[0] + (e.b[0] - e.a[0]) * t + e.n[0] * off, e.a[1] + (e.b[1] - e.a[1]) * t + e.n[1] * off];

  // 1. Back rim ceremonial Paifang Gate (Tier 2+) — nudged slightly inward (-0.08 * e.n) so eaves stay cleanly inside the top border
  {
    const pts = [];
    top.forEach(e => [0.3, 0.5, 0.7].forEach(t => pts.push(onEdge(e, t, -0.08))));
    const p = pts.reduce((b, q) => Math.abs(q[0] - cx) < Math.abs(b[0] - cx) ? q : b);
    for (const [dx, dy] of [[0, 0.04], [0.28, 0.06], [-0.28, 0.06], [0, 0.12]]) {
      const o = place('paifangGate', p[0] + dx, p[1] + dy, { minT: 2, scale: 1.06, clear: 2.2, noSouth: true, pad: 0.95 });
      if (o) break;
    }
  }

  // 1b. Small Scenic Jade Hills along the rear (top) rim of the land (Tiers 1..4)
  {
    const hillCandidates = [];
    top.forEach(e => [0.25, 0.5, 0.75].forEach(t => hillCandidates.push(onEdge(e, t, -0.14))));
    // Sort left-to-right and pick 2 to 3 well-spaced rear hill spots
    hillCandidates.sort((a, b) => a[0] - b[0]);
    const targetHills = G.centers.length >= 12 ? 3 : 2;
    const pickedHills = [];
    for (let h = 0; h < targetHills; h++) {
      const idx = Math.floor(((h + 0.5) / targetHills) * hillCandidates.length);
      const cand = hillCandidates[idx];
      if (!cand) continue;
      if (pickedHills.some(q => Math.hypot(q[0] - cand[0], (q[1] - cand[1]) * 1.5) < 0.85)) continue;
      const ho = place('jadeHill', cand[0], cand[1] + 0.06, {
        minT: h === 0 ? 1 : (h === 1 ? 2 : 3),
        scale: 0.92 + rng() * 0.22,
        clear: 1.4,
        noSouth: true,
        pad: 0.94
      });
      if (ho) pickedHills.push([ho.x, ho.y]);
    }
  }

  // 2. Traditional Chinese Residences spread across 5 tiers + one tiered Drum Tower beside a villa at Tier 5
  const rim = [], inn = [];
  // Negative normal offset (-0.06) keeps rim buildings & trees pulled slightly inward from the outer boundary
  sides.concat(outer.filter(e => e.cls === 'bottom')).forEach(e => [0.3, 0.7].forEach(t => rim.push(onEdge(e, t, -0.06))));
  G.verts.filter(v => v.junction).forEach(v => inn.push([v.x, v.y]));
  interior.filter(e => e.vertical).forEach(e => inn.push([e.mid[0], e.mid[1]]));

  const chosen = placed.filter(o => o.cat === 'ruin' || o.cat === 'struct' || o.cat === 'hill').map(o => [o.x, o.y]), villas = [];
  const spread = (k, pool, extra) => {
    const ranked = pool.map(p => ({ p, d: Math.min(1e9, ...chosen.map(q => Math.hypot(p[0] - q[0], (p[1] - q[1]) * 1.4))) + rng() * 0.22 })).sort((a, b) => b.d - a.d);
    for (let n = 0; n < Math.min(12, ranked.length); n++) {
      const o = place(k, ranked[n].p[0], ranked[n].p[1], extra);
      if (o) {
        chosen.push([o.x, o.y]);
        if (k === 'vermilionVilla') villas.push(o);
        return o;
      }
    }
    return null;
  };

  thin([
    ['courtyardHouse', 1],
    ['teaHouse', 2],
    ['vermilionVilla', 3],
    ['courtyardHouse', 4],
    ['teaHouse', 4],
    ['vermilionVilla', 5]
  ]).forEach(([k, mt]) => spread(k, rim, { minT: mt, scale: 1.06, clear: 2.4, noSouth: true, pad: 0.95 }));

  thin([
    ['teaHouse', 2],
    ['vermilionVilla', 3],
    ['courtyardHouse', 3],
    ['teaHouse', 4],
    ['courtyardHouse', 5],
    ['vermilionVilla', 5],
    ['teaHouse', 5]
  ]).forEach(([k, mt]) => spread(k, inn, { minT: mt, scale: 1.0, clear: 2.9, noSouth: true, pad: 0.96 }));

  {
    const home = villas[villas.length - 1] || placed.find(o => o.cat === 'struct');
    if (home) {
      for (const [dx, dy] of [[0.36, -0.06], [-0.36, -0.06], [0.30, 0.10], [-0.30, 0.10], [0.42, 0.0], [-0.42, 0.0]]) {
        const o = place('drumTower', home.x + dx, home.y + dy, { minT: 5, scale: 1.0, clear: 2.4, noSouth: true, pad: 0.95 });
        if (o) break;
      }
    }
  }

  // 2b. Classical Chinese Garden Landmarks scattered across Tiers 1..5
  thin([
    ['moonGateWall', 1],
    ['lotusPond', 2],
    ['gardenPavilion', 2],
    ['archedStoneBridge', 3],
    ['moonGateWall', 3],
    ['taihuRock', 3],
    ['lotusPond', 4],
    ['gardenPavilion', 4],
    ['archedStoneBridge', 5]
  ]).forEach(([k, mt]) => spread(k, rim.concat(inn), { minT: mt, scale: k === 'lotusPond' || k === 'gardenPavilion' ? 1.05 : 1.0, clear: 1.6, noSouth: true, pad: 0.96 }));

  // 3. Vibrant Chinese Woodland & Bamboo Groves
  G.verts.filter(v => v.junction).forEach(v => {
    const dom = pickFrom(regionOf(v.y), capOk), n = 2 + Math.floor(rng() * 1.9);
    for (let k = 0; k < n; k++) {
      const a = rng() * 6.283, r = k ? 0.12 + rng() * 0.09 : 0.02;
      tree(v.x + Math.cos(a) * r, v.y + Math.sin(a) * r * 0.8, null, dom);
    }
  });
  G.edges.filter(e => !e.outer && e.vertical).forEach(e => {
    const dom = pickFrom(regionOf(e.mid[1]), capOk);
    [-0.27, 0, 0.27].forEach(dy => { if (rng() < 0.72) tree(e.mid[0] + (rng() - 0.5) * 0.2, e.mid[1] + dy, null, dom); });
  });
  G.edges.filter(e => !e.outer && !e.vertical).forEach(e => {
    if (rng() < 0.72) tree(e.mid[0] + (rng() - 0.5) * 0.2, e.mid[1] + (rng() - 0.5) * 0.1, { scale: 0.8 + rng() * 0.2 }, null, true);
    if (rng() < 0.22) tree(e.mid[0] + (rng() - 0.5) * 0.34, e.mid[1] + (rng() - 0.5) * 0.14, { scale: 0.78 + rng() * 0.2 }, null, true);
  });
  {
    const ordered = outer.slice().sort((a, b) => Math.atan2((a.mid[1] - cy) * 1.7, a.mid[0] - cx) - Math.atan2((b.mid[1] - cy) * 1.7, b.mid[0] - cx)), samples = [];
    ordered.forEach(e => {
      const nS = Math.max(2, Math.round(e.len / 0.26));
      // Negative offset (-0.08 .. +0.02) keeps edge groves hugging the border instead of spilling outward
      for (let s = 0; s < nS; s++) samples.push({ e, p: onEdge(e, (s + 0.5) / nS + (rng() - 0.5) * 0.08, -0.08 + rng() * 0.10) });
    });
    let mode = 'grove', run = 0, dom = 'bambooGrove';
    samples.forEach(s => {
      if (run <= 0) {
        const r = rng();
        mode = r < 0.74 ? 'grove' : r < 0.92 ? 'sparse' : 'open';
        run = 2 + Math.floor(rng() * 4);
        dom = pickFrom(regionOf(s.p[1]), capOk);
      }
      run--;
      const e = s.e, low = e.cls === 'bottom' || (e.cls === 'side' && s.p[1] > cy + 0.25), p = s.p;
      if (mode === 'grove') {
        tree(p[0], p[1], null, dom, low);
        if (rng() < 0.55) tree(p[0] + (rng() - 0.5) * 0.26, p[1] - 0.09, null, dom, low);
        if (rng() < 0.2)  tree(p[0] + (rng() - 0.5) * 0.26, p[1] + 0.08, null, dom, true);
        if (rng() < 0.14) tree(p[0] + (rng() - 0.5) * 0.28, p[1] - 0.16, null, dom, low);
      } else if (mode === 'sparse') {
        if (rng() < 0.5) tree(p[0], p[1], null, dom, low); else under(p[0], p[1]);
      } else if (rng() < 0.6) under(p[0], p[1]);
    });
  }
  G.verts.filter(v => !v.junction && v.hexes.size <= 2).forEach(v => {
    if (rng() < 0.8) tree(v.x + (rng() - 0.5) * 0.10, v.y + (rng() - 0.5) * 0.08, null, null, v.y > cy + 0.3);
  });
  G.centers.forEach(c => {
    for (let k = 0; k < 14; k++) {
      const px = c.x + (rng() * 2 - 1) * HX, py = c.y + (rng() * 2 - 1) * 0.58;
      if (!hexInside(px - c.x, py - c.y, 0.98)) continue;
      if (rng() < 0.38) tree(px, py, { scale: 0.8 + rng() * 0.25 }, null, py > cy + 0.35);
    }
  });

  // Balance outer rim tree density across top, side, and bottom boundaries
  {
    const dEdge = (x, y, e) => {
      const dx = e.b[0] - e.a[0], dy = e.b[1] - e.a[1];
      const t = Math.max(0, Math.min(1, ((x - e.a[0]) * dx + (y - e.a[1]) * dy) / (dx * dx + dy * dy)));
      return Math.hypot(x - (e.a[0] + dx * t), (y - (e.a[1] + dy * t)) * 1.4);
    };
    const classes = ['top', 'side', 'bottom'], len = { top: 0, side: 0, bottom: 0 };
    outer.forEach(e => len[e.cls] += e.len);
    const members = () => {
      const m = { top: [], side: [], bottom: [] };
      placed.filter(o => o.cat === 'tree').forEach(o => {
        let best = null, bd = 1e9;
        outer.forEach(e => { const d = dEdge(o.x, o.y, e); if (d < bd) { bd = d; best = e; } });
        if (bd < 0.32) m[best.cls].push(o);
      });
      return m;
    };
    let m = members();
    const mean = (m.top.length + m.side.length + m.bottom.length) / (len.top + len.side + len.bottom);
    classes.forEach(cl => {
      const target = Math.round(len[cl] * mean);
      let list = m[cl];
      if (list.length > target + 1) {
        const drop = list.length - target;
        for (let i = 0; i < drop; i++) {
          const pick = list.splice(Math.floor(rng() * list.length), 1)[0], ix = placed.indexOf(pick);
          if (ix >= 0) placed.splice(ix, 1);
        }
      } else if (list.length < target - 1) {
        const need = target - list.length, es = outer.filter(e => e.cls === cl);
        let added = 0, guard = 0;
        while (added < need && guard++ < 160) {
          const e = es[Math.floor(rng() * es.length)], p = onEdge(e, rng(), -0.08 + rng() * 0.10);
          if (tree(p[0], p[1], null, null, cl !== 'top')) added++;
        }
      }
    });
  }

  // 4. Undergrowth: azaleas, ferns & Taihu scholar's rocks
  G.verts.filter(v => v.junction).forEach(v => { if (rng() < 0.45) under(v.x + (rng() - 0.5) * 0.2, v.y + (rng() - 0.5) * 0.12); });
  interior.forEach(e => { if (rng() < 0.35) under(e.mid[0] + (rng() - 0.5) * 0.24, e.mid[1] + (rng() - 0.5) * 0.12); });
  outer.forEach(e => { if (rng() < 0.38) under(...onEdge(e, rng(), -0.03)); });
  G.centers.forEach(c => {
    for (let k = 0; k < 5; k++) {
      const px = c.x + (rng() * 2 - 1) * HX, py = c.y + (rng() * 2 - 1) * 0.58;
      if (hexInside(px - c.x, py - c.y, 0.96) && rng() < 0.3) under(px, py);
    }
  });

  // 5. Small Chinese Garden Props (Tiers 1..3)
  [['stoneLantern', 2], ['redLanternPost', 2], ['guardianLion', 2], ['bonsaiPlanter', 2]].forEach(([k, n]) => {
    for (let i = 0; i < cnt(n); i++) {
      const e = outer[Math.floor(rng() * outer.length)], p = onEdge(e, 0.15 + rng() * 0.7, -0.04 + rng() * 0.06);
      place(k, p[0], p[1], { minT: 1, maxT: 3, prop: true });
    }
  });
  let pi = 0;
  placed.filter(o => o.prop).forEach(o => { o.minT = pi++ < 4 ? 1 : 2; });

  // Cycle residences through all 4 isometric facings
  {
    const houses = placed.filter(o => /^(courtyardHouse|vermilionVilla|teaHouse)$/.test(o.kind)).sort((a, b) => a.x - b.x || a.y - b.y);
    const cyc = [0, 3, 1, 2];
    houses.forEach((o, i) => { o.v = ((o.v >> 2) << 2) | cyc[i % 4]; });
    placed.filter(o => o.kind === 'drumTower' || o.kind === 'paifangGate').forEach(o => { o.v = ((o.v >> 2) << 2) | (rng() < 0.5 ? 1 : 0); });
  }

  // Assign 5-tier thresholds (`1` Sparse -> `5` Immersive)
  const cuts = {
    tree:   [0.14, 0.34, 0.56, 0.78, 1.0],
    shrub:  [0.05, 0.24, 0.48, 0.74, 1.0],
    rock:   [0.18, 0.40, 0.65, 0.85, 1.0],
    prop:   [1, 1, 1, 1, 1],
    struct: [0, 0, 0, 0, 0],
    ruin:   [0, 0, 0, 0, 0],
    hill:   [0, 0, 0, 0, 0]
  };
  placed.forEach(o => {
    const c = cuts[o.cat] || cuts.tree;
    let t = 1;
    while (t < 5 && o.pri > c[t - 1]) t++;
    o.tier = Math.max(t, o.minT);
    if (o.cat === 'prop' || o.cat === 'struct' || o.cat === 'ruin' || o.cat === 'hill') o.tier = o.minT;
  });

  // Ensure vibrant woodland canopy ratio (>= 65% trees) at every tier 1..5
  const count = t => {
    const vis = placed.filter(o => o.tier <= t && t <= o.maxT);
    const tr = vis.filter(o => o.cat === 'tree').length;
    return { n: vis.length, tr };
  };
  for (let t = 1; t <= 5; t++) {
    let guard = 0;
    while (guard++ < 320) {
      const c = count(t);
      if (c.tr / Math.max(1, c.n) >= 0.65) break;
      const pool = placed.filter(o => o.tier <= t && t <= o.maxT);
      const cand = (pool.filter(o => o.cat === 'shrub').sort((a, b) => b.pri - a.pri)[0]) ||
                   (pool.filter(o => o.prop && o.minT > 1).sort((a, b) => b.pri - a.pri)[0]);
      if (!cand) break;
      cand.tier = Math.min(6, cand.tier + 1);
    }
  }

  placed.forEach(o => {
    const over = G.centers.filter(c => Math.abs(o.x - c.x) < 1.0);
    o.layer = over.length && o.y > Math.max(...over.map(c => c.y)) + 0.05 ? 'front' : 'back';
  });
  placed.sort((a, b) => a.y - b.y);
  return (CHINA_PLAN_CACHE[shape] = { G, objs: placed, rng });
}

/* ---- Vibrant Jade-Green Garden Ground, Flagstone Paths & Fallen Blossom Petals ---- */
function chinaGround(c, G, R, ox, oy, m, col, seed) {
  const poly = i => HV.map(v => [ox + m * (G.centers[i].x + v[0]) * R, oy + (G.centers[i].y + v[1]) * R]);
  const r = mulberry(seed), outer = G.edges.filter(e => e.outer), P = p => [ox + m * p[0] * R, oy + p[1] * R];

  c.save();
  c.lineJoin = 'round';
  c.lineCap = 'round';
  for (let i = 1; i <= 6; i++) {
    c.globalAlpha = 0.11 - i * 0.014;
    c.strokeStyle = col;
    c.lineWidth = R * 0.06 * i;
    c.beginPath();
    outer.forEach(e => { const a = P(e.a), b = P(e.b); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); });
    c.stroke();
  }
  c.globalAlpha = 1;
  G.centers.forEach((_, i) => TH.poly(c, poly(i), col, col, 2));

  c.save();
  c.beginPath();
  G.centers.forEach((_, i) => {
    poly(i).forEach((p, k) => k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
    c.closePath();
  });
  c.clip();

  const bx = [ox + Math.min(m * G.bbox.minX, m * G.bbox.maxX) * R, oy + G.bbox.minY * R, (G.bbox.maxX - G.bbox.minX) * R, (G.bbox.maxY - G.bbox.minY) * R];
  const pt = () => [bx[0] + r() * bx[2], bx[1] + r() * bx[3]];
  const soft = (x, y, rx, ry, rgb, a) => {
    c.save();
    c.translate(x, y);
    c.scale(1, ry / rx);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, `rgba(${rgb},${a})`);
    g.addColorStop(0.6, `rgba(${rgb},${a * 0.55})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    c.fillStyle = g;
    c.beginPath();
    c.arc(0, 0, rx, 0, 7);
    c.fill();
    c.restore();
  };

  // Sunlit chartreuse-emerald grass patches & lush jade moss hollows
  for (let k = 0; k < 48; k++) {
    const p = pt(), w = R * (0.42 + r() * 0.85);
    soft(p[0], p[1], w, w * 0.4, r() < 0.55 ? '148, 212, 82' : '46, 118, 48', r() < 0.55 ? 0.24 : 0.22);
  }
  // Warm garden gravel & stepping-stone footpath patches
  for (let k = 0; k < 14; k++) {
    const p = pt(), w = R * (0.28 + r() * 0.45);
    soft(p[0], p[1], w, w * 0.4, '214, 198, 158', 0.22);
  }
  // Carved flagstone stepping pebbles
  for (let k = 0; k < 34; k++) {
    const p = pt();
    TH.ell(c, p[0], p[1], R * (0.024 + r() * 0.016), R * 0.014, r() < 0.5 ? 'rgba(226, 222, 208, 0.55)' : 'rgba(180, 176, 162, 0.55)');
  }
  // Fresh green grass blades
  for (let k = 0; k < 160; k++) {
    const p = pt(), h = R * (0.05 + r() * 0.06);
    for (let j = 0; j < 3; j++) {
      TH.ln(c, [p[0], p[1]], [p[0] + (j - 1) * h * 0.5, p[1] - h], ['#4d8c38', '#68ab46', '#82c456'][(k + j) % 3], R * 0.011);
    }
  }
  // Fallen pink peach-blossom & golden ginkgo leaves on the lawn
  for (let k = 0; k < 70; k++) {
    const p = pt(), a = r() * 3.14, l = R * (0.02 + r() * 0.025);
    TH.ln(c, [p[0], p[1]], [p[0] + Math.cos(a) * l, p[1] + Math.sin(a) * l * 0.5], k % 3 === 0 ? 'rgba(244, 114, 182, 0.65)' : 'rgba(250, 204, 21, 0.55)', R * 0.012);
  }

  c.restore();
  c.restore();
}

const CHINA_THEME = { id: 'china', assets: CHINA_ASSETS, plan: getChinaPlan, ground: chinaGround, groundCol: '#5c8e43', top: 1.5 };
const CHINA_TIER_NAMES = ['Sparse', 'Light', 'Medium', 'Heavy', 'Immersive'];
function bakeLandChina(shape, tier, R, opts) { return bakeLandTheme(CHINA_THEME, shape, tier, R, opts); }
function drawLandChinaBack(ctx, x, y, land) { ctx.drawImage(land.back, x - land.ox, y - land.oy, land.w, land.h); }
function drawLandChinaFront(ctx, x, y, land) { const r = land.frontRect; ctx.drawImage(land.front, x - land.ox + r.x, y - land.oy + r.y, r.w, r.h); }
function landChinaSlots(land, R) { return land.centers.map(c => ({ x: c.x, y: c.y, rx: LAND_KEEP.rx * R, ry: LAND_KEEP.ry * R })); }
return Object.freeze({ bake: (shape, tier, radius, opts) => bakeLandChina(shape, tier === 4 ? 5 : tier, radius, opts), drawBack: drawLandChinaBack, drawFront: (ctx, x, y, land) => land.sprites.slice().sort((a,b) => a.y-b.y).forEach(s => drawScenicSprite(ctx,s,x+s.x,y+s.y)) });
})(),
  japan: (() => {
/* ===== THEME PACK CORE (shared by every theme pack; copy once into engine.js) ===== */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shade(hex, amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=c=>Math.max(0,Math.min(255,Math.round(amt<0?c*(1+amt):c+(255-c)*amt)));return `rgb(${f(r)},${f(g)},${f(b)})`;}
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
  arch(x,y,u,Y,xc,w,z0,zs,zt){const I=(X,Z)=>TH.iso(x,y,u,X,Y,Z),L=[],Rr=[];for(let t=0;t<=8;t++){const s=t/8,q=1-s,
      X=q*q*(xc-w)+2*q*s*(xc-w*0.85)+s*s*xc,Z=q*q*zs+2*q*s*(zs+(zt-zs)*0.85)+s*s*zt;L.push(I(X,Z));Rr.push(I(2*xc-X,Z));}
    return [I(xc-w,z0)].concat(L,Rr.slice().reverse(),[I(xc+w,z0)]);}
};

/* ===== JAPANESE ASSET LIBRARY (macro-land pieces). draw(c, x, y, u, v): (x,y) = base centre, u = 0.075*R, v = variant seed ===== */
const JSH = (c, x, y, rx) => {
  c.fillStyle = 'rgba(12, 28, 16, .30)';
  c.beginPath();
  c.ellipse(x + rx * 0.24, y + rx * 0.1, rx, rx * 0.36, 0, 0, 7);
  c.fill();
};
const JFLIP = (c, x, f, fn) => {
  if (f) {
    c.save();
    c.translate(x, 0);
    c.scale(-1, 1);
    c.translate(-x, 0);
    fn();
    c.restore();
  } else fn();
};
const JBOX = (c, x, y, u, x0, x1, y0, y1, z0, z1, col) => TH.box(c, x, y, u, x0, x1, y0, y1, z0, z1, col, shade(col, -0.28), shade(col, 0.12));

// Shared Japanese Architectural & Landscape Palette
const J_CEDAR   = '#5c3c24'; // Warm aged Hinoki / Sugi cedar timber
const J_CEDAR_D = '#3b2414';
const J_PLASTER = '#f5f2e8'; // Shikkui white lime plaster
const J_KAWARA  = '#2d333d'; // Dark charcoal-slate Kawara clay roof tiles
const J_THATCH  = '#7a6342'; // Gassho-zukuri woven reed thatch
const J_TORII   = '#c83224'; // Shinto vermilion-red lacquer
const J_TORII_D = '#8c1d13';
const J_STONE   = '#9ca3af'; // Granite stone foundation & lanterns
const J_SHOJI   = '#fef3c7'; // Warm backlit shoji paper screen
const J_GOLD    = '#eab308'; // Shachihoko / gilt finial accent

// Helper: Traditional Japanese Irimoya / Kirizuma Kawara Tile Roof with subtle concave curve & ridge caps
function drawJapaneseKawaraRoof(c, L, a0, a1, b0, b1, zBase, rise, tileCol, ridgeCol, u, flare = 0.24) {
  const am = (a0 + a1) * 0.5;
  const ov = 0.26;
  const eFL = L(a0 - ov, b1 + ov, zBase + flare * 0.55);
  const eFR = L(a1 + ov, b1 + ov, zBase + flare);
  const eBR = L(a1 + ov, b0 - ov, zBase + flare * 0.55);
  const eBL = L(a0 - ov, b0 - ov, zBase + flare * 0.40);
  const rF  = L(am, b1 + ov * 0.65, zBase + rise + flare * 0.25);
  const rB  = L(am, b0 - ov * 0.65, zBase + rise + flare * 0.20);

  // Back-left slope
  c.fillStyle = shade(tileCol, 0.14);
  c.beginPath();
  c.moveTo(eBL[0], eBL[1]);
  c.quadraticCurveTo(L(a0, b0, zBase + rise * 0.42)[0], L(a0, b0, zBase + rise * 0.42)[1], rB[0], rB[1]);
  c.lineTo(rF[0], rF[1]);
  c.quadraticCurveTo(L(a0, b1, zBase + rise * 0.42)[0], L(a0, b1, zBase + rise * 0.42)[1], eFL[0], eFL[1]);
  c.closePath();
  c.fill();

  // Front-right main roof slope
  c.fillStyle = tileCol;
  c.beginPath();
  c.moveTo(eFR[0], eFR[1]);
  c.quadraticCurveTo(L(a1, b1, zBase + rise * 0.42)[0], L(a1, b1, zBase + rise * 0.42)[1], rF[0], rF[1]);
  c.lineTo(rB[0], rB[1]);
  c.quadraticCurveTo(L(a1, b0, zBase + rise * 0.42)[0], L(a1, b0, zBase + rise * 0.42)[1], eBR[0], eBR[1]);
  c.closePath();
  c.fill();

  // Kawara tile rib flutes
  const nRibs = 8;
  for (let k = 1; k < nRibs; k++) {
    const t = k / nRibs;
    const tb = b0 - ov + (b1 - b0 + 2 * ov) * t;
    const pTop = L(am, tb, zBase + rise + flare * 0.22);
    const pBot = L(a1 + ov, tb, zBase + flare * (0.55 + 0.45 * Math.sin(t * Math.PI)));
    TH.ln(c, pTop, pBot, 'rgba(8, 12, 18, 0.34)', u * 0.042);
  }

  // Front gable triangle infill with exposed cedar bargeboards
  TH.poly(c, [L(a0, b1 + 0.02, zBase), L(a1, b1 + 0.02, zBase), L(am, b1 + 0.02, zBase + rise)], J_PLASTER);
  TH.ln(c, L(am, b1 + 0.03, zBase), L(am, b1 + 0.03, zBase + rise), J_CEDAR_D, u * 0.09);

  // Heavy kawara ridge beam + ornamental onigawara / gilt end-caps
  TH.ln(c, rB, rF, ridgeCol || '#64748b', u * 0.13);
  [rB, rF].forEach(rp => {
    TH.poly(c, [[rp[0] - u * 0.07, rp[1]], [rp[0] + u * 0.07, rp[1]], [rp[0], rp[1] - u * 0.20]], J_GOLD);
  });

  // Eave fascia trim
  c.strokeStyle = shade(tileCol, -0.35);
  c.lineWidth = u * 0.075;
  c.beginPath();
  c.moveTo(eFL[0], eFL[1]);
  c.quadraticCurveTo(L(a0, b1, zBase + rise * 0.42)[0], L(a0, b1, zBase + rise * 0.42)[1], rF[0], rF[1]);
  c.quadraticCurveTo(L(a1, b1, zBase + rise * 0.42)[0], L(a1, b1, zBase + rise * 0.42)[1], eFR[0], eFR[1]);
  c.stroke();
}

// Helper: Hanging warm chochin paper lantern
function drawChochinLantern(c, px, py, u, col = '#fef3c7') {
  TH.ln(c, [px, py], [px, py + u * 0.12], '#1c1917', u * 0.03);
  TH.ell(c, px, py + u * 0.28, u * 0.14, u * 0.17, col);
  TH.ln(c, [px - u * 0.09, py + u * 0.14], [px + u * 0.09, py + u * 0.14], '#1c1917', u * 0.04);
  TH.ln(c, [px - u * 0.09, py + u * 0.42], [px + u * 0.09, py + u * 0.42], '#1c1917', u * 0.04);
}

/* ---- Traditional Japanese Residences (Machiya, Minka Farmhouse, Ryokan Inn) ---- */
const JHOUSE_T = {
  machiyaHouse: { ha: 1.20, hb: 1.85, h1: 1.75, h2: 0, wall: J_PLASTER, timber: J_CEDAR, tile: J_KAWARA, ridge: '#94a3b8', rise: 1.45, flare: 0.22, noren: true, sw: 3.1, sh: 0.94 },
  ryokanInn:    { ha: 1.32, hb: 1.92, h1: 1.60, h2: 1.40, wall: J_PLASTER, timber: J_CEDAR_D, tile: J_KAWARA, ridge: '#cbd5e1', rise: 1.65, flare: 0.28, lanterns: true, sw: 3.4, sh: 1.0 },
  minkaCottage: { ha: 1.22, hb: 1.72, h1: 1.45, h2: 0, wall: '#e8dec8', timber: J_CEDAR_D, tile: J_THATCH, ridge: '#b59a6e', rise: 1.95, flare: 0.18, thatch: true, sw: 3.1, sh: 0.95 }
};

function JHOUSE_BODY(c, x, y, u, s, eave, T) {
  const r = mulberry(s * 13 + 7);
  const Iw = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
  const L  = (a, b, z) => eave ? Iw(b, a, z) : Iw(a, b, z);
  const LBOX = (a0, a1, b0, b1, z0, z1, col) => eave ? JBOX(c, x, y, u, b0, b1, a0, a1, z0, z1, col) : JBOX(c, x, y, u, a0, a1, b0, b1, z0, z1, col);

  const ha = T.ha, hb = T.hb;
  // Granite foundation & wooden engawa veranda step
  LBOX(-ha - 0.16, ha + 0.16, -hb - 0.16, hb + 0.16, 0, 0.30, J_STONE);
  LBOX(-ha - 0.08, ha + 0.08, -hb - 0.08, hb + 0.08, 0.30, 0.42, J_CEDAR);

  // Main ground story shikkui plaster & cedar walls
  const z1 = 0.42 + T.h1;
  LBOX(-ha, ha, -hb, hb, 0.42, z1, T.wall);

  // Exposed dark cedar corner posts, mid-posts & horizontal nageshi tie-beams
  [-ha, 0, ha].forEach(ax => TH.ln(c, L(ax, hb + 0.02, 0.42), L(ax, hb + 0.02, z1), T.timber, u * 0.11));
  [-hb, -hb * 0.33, hb * 0.33, hb].forEach(by => TH.ln(c, L(ha + 0.02, by, 0.42), L(ha + 0.02, by, z1), T.timber, u * 0.11));
  TH.ln(c, L(-ha, hb + 0.02, z1 - 0.05), L(ha, hb + 0.02, z1 - 0.05), T.timber, u * 0.10);
  TH.ln(c, L(ha + 0.02, -hb, z1 - 0.05), L(ha + 0.02, hb, z1 - 0.05), T.timber, u * 0.10);

  // Shoji sliding paper screens & koshi wooden lattice grilles
  const drawShoji = (p0, p1, fixedCoord, isFrontB, zw0, zw1) => {
    const J = (t, z) => isFrontB ? L(t, fixedCoord, z) : L(fixedCoord, t, z);
    TH.poly(c, [J(p0, zw0), J(p1, zw0), J(p1, zw1), J(p0, zw1)], r() < 0.72 ? J_SHOJI : '#e2e8f0', T.timber, u * 0.055);
    const tm = (p0 + p1) * 0.5, z13 = zw0 + (zw1 - zw0) * 0.34, z23 = zw0 + (zw1 - zw0) * 0.68;
    TH.ln(c, J(tm, zw0), J(tm, zw1), T.timber, u * 0.032);
    TH.ln(c, J(p0, z13), J(p1, z13), T.timber, u * 0.028);
    TH.ln(c, J(p0, z23), J(p1, z23), T.timber, u * 0.028);
  };

  if (!eave) {
    // Sliding entryway + indigo noren shop/inn curtain
    drawShoji(-0.42, 0.42, hb + 0.03, true, 0.42, 1.62);
    if (T.noren) {
      TH.poly(c, [L(-0.38, hb + 0.04, 1.18), L(0.38, hb + 0.04, 1.18), L(0.38, hb + 0.04, 1.58), L(-0.38, hb + 0.04, 1.58)], '#1e3a8a');
    }
    drawShoji(-1.05, -0.55, hb + 0.03, true, 0.65, 1.58);
    drawShoji( 0.55,  1.05, hb + 0.03, true, 0.65, 1.58);
    drawShoji(-1.35, -0.45, ha + 0.03, false, 0.65, 1.58);
    drawShoji( 0.45,  1.35, ha + 0.03, false, 0.65, 1.58);
  } else {
    drawShoji(-0.45, 0.45, ha + 0.03, false, 0.42, 1.62);
    drawShoji(-1.45, -0.65, ha + 0.03, false, 0.65, 1.58);
    drawShoji( 0.65,  1.45, ha + 0.03, false, 0.65, 1.58);
    drawShoji(-0.88,  0.88, hb + 0.03, true, 0.65, 1.58);
  }

  let roofZ = z1;
  if (T.h2 > 0) {
    // Two-story Ryokan Inn with lower hisashi eave skirt & second-floor shoji gallery
    drawJapaneseKawaraRoof(c, L, -ha, ha, -hb, hb, z1 - 0.14, 0.52, T.tile, T.ridge, u, T.flare * 0.72);
    const ha2 = ha * 0.80, hb2 = hb * 0.82, z2 = z1 + T.h2;
    LBOX(-ha2, ha2, -hb2, hb2, z1 + 0.15, z2, T.wall);
    [-ha2, 0, ha2].forEach(ax => TH.ln(c, L(ax, hb2 + 0.02, z1 + 0.15), L(ax, hb2 + 0.02, z2), T.timber, u * 0.09));
    [-hb2, 0, hb2].forEach(by => TH.ln(c, L(ha2 + 0.02, by, z1 + 0.15), L(ha2 + 0.02, by, z2), T.timber, u * 0.09));
    drawShoji(-0.72, 0.72, hb2 + 0.03, true, z1 + 0.42, z2 - 0.18);
    drawShoji(-1.10, 1.10, ha2 + 0.03, false, z1 + 0.42, z2 - 0.18);
    drawJapaneseKawaraRoof(c, L, -ha2, ha2, -hb2, hb2, z2, T.rise * 0.88, T.tile, T.ridge, u, T.flare);
    roofZ = z2;
  } else {
    drawJapaneseKawaraRoof(c, L, -ha, ha, -hb, hb, z1, T.rise, T.tile, T.ridge, u, T.flare);
  }

  if (T.lanterns) {
    const pL1 = L(ha + 0.20, hb + 0.20, roofZ + T.flare * 0.85);
    drawChochinLantern(c, pL1[0], pL1[1], u, '#fef3c7');
  }
}

const JHOUSE = (key) => ({
  cat: 'struct',
  rho: 0.14,
  draw(c, x, y, u, v) {
    const T = JHOUSE_T[key], o = v & 3, s = v >> 2, eave = (o >> 1) & 1;
    c.fillStyle = 'rgba(12, 28, 16, .30)';
    c.beginPath();
    c.ellipse(x + u * 0.7, y + u * 0.18, u * T.sw * (eave ? 1.18 : 1), u * T.sh, 0, 0, 7);
    c.fill();
    JFLIP(c, x, o & 1, () => JHOUSE_BODY(c, x, y, u, s, eave, T));
  }
});

const JAPAN_ASSETS = {
  /* ---------- Rear Mountains (Taller Mt. Fuji Stratovolcano & Cedar Ridges) ---------- */
  fujiPeak: {
    cat: 'hill', rho: 0.16,
    draw(c, x, y, u, v) {
      // Towering, iconic Mount Fuji-inspired snow-capped volcanic cone for the rear rim
      const r = mulberry(v * 17 + 3);
      const w = u * (5.6 + r() * 0.75);
      const h = u * (7.2 + r() * 0.95);

      // Soft mountain base shadow
      TH.ell(c, x, y + u * 0.12, w * 1.04, u * 0.56, 'rgba(12, 28, 16, .30)');

      // Secondary flanking green foothill ridge for depth
      const ox = (v % 2 ? 1 : -1) * w * 0.46;
      const hw2 = w * 0.68, hh2 = h * 0.58;
      c.fillStyle = '#365e3b';
      c.beginPath();
      c.moveTo(x + ox - hw2, y + u * 0.06);
      c.quadraticCurveTo(x + ox, y - hh2 * 1.08, x + ox + hw2, y + u * 0.06);
      c.closePath();
      c.fill();

      // Main sweeping concave stratovolcano silhouette
      const traceCone = () => {
        c.beginPath();
        c.moveTo(x - w, y + u * 0.10);
        c.quadraticCurveTo(x - w * 0.34, y - h * 0.44, x - w * 0.15, y - h);
        c.lineTo(x + w * 0.15, y - h);
        c.quadraticCurveTo(x + w * 0.34, y - h * 0.44, x + w, y + u * 0.10);
        c.quadraticCurveTo(x, y + u * 0.30, x - w, y + u * 0.10);
        c.closePath();
      };

      const mGrad = c.createLinearGradient(x - w * 0.6, y - h, x + w * 0.7, y);
      mGrad.addColorStop(0.00, '#5a7894'); // Misty blue-slate upper slope
      mGrad.addColorStop(0.45, '#425d73');
      mGrad.addColorStop(0.78, '#3b6641'); // Forested cedar lower flank
      mGrad.addColorStop(1.00, '#2a4d30');
      traceCone();
      c.fillStyle = mGrad;
      c.fill();

      // Clip inside cone for directional sunlight, radial gullies & jagged snow-cap fingers
      c.save();
      traceCone();
      c.clip();

      // Shaded right-hand slope
      c.fillStyle = 'rgba(15, 28, 42, 0.34)';
      c.beginPath();
      c.moveTo(x + w * 0.03, y - h);
      c.lineTo(x + w * 0.18, y - h);
      c.quadraticCurveTo(x + w * 0.36, y - h * 0.44, x + w * 1.05, y + u * 0.14);
      c.lineTo(x + w * 0.12, y + u * 0.28);
      c.closePath();
      c.fill();

      // Crisp jagged snow-cap crown with glacial gullies reaching down the cone
      const snowBot = y - h * 0.56;
      const snowGrad = c.createLinearGradient(x - w * 0.2, y - h, x + w * 0.2, snowBot);
      snowGrad.addColorStop(0, '#ffffff');
      snowGrad.addColorStop(1, '#dbeafe');
      c.fillStyle = snowGrad;
      c.beginPath();
      c.moveTo(x - w * 0.18, y - h - 2);
      c.lineTo(x + w * 0.18, y - h - 2);
      c.lineTo(x + w * 0.46, snowBot);
      c.lineTo(x + w * 0.28, snowBot - h * 0.08);
      c.lineTo(x + w * 0.14, snowBot + h * 0.05);
      c.lineTo(x, snowBot - h * 0.06);
      c.lineTo(x - w * 0.16, snowBot + h * 0.06);
      c.lineTo(x - w * 0.30, snowBot - h * 0.07);
      c.lineTo(x - w * 0.46, snowBot);
      c.closePath();
      c.fill();

      // Cool shadow on right side of snow cap
      c.fillStyle = 'rgba(147, 197, 253, 0.42)';
      c.beginPath();
      c.moveTo(x + w * 0.03, y - h - 2);
      c.lineTo(x + w * 0.18, y - h - 2);
      c.lineTo(x + w * 0.46, snowBot);
      c.lineTo(x + w * 0.14, snowBot + h * 0.05);
      c.closePath();
      c.fill();

      c.restore();

      // Foothill Hinoki-cedar tree tufts along base
      TH.blob(c, x - w * 0.46, y - u * 0.14, u * 0.72, u * 0.40, '#2d5a36', r, 7);
      TH.blob(c, x + w * 0.48, y - u * 0.12, u * 0.68, u * 0.38, '#3a6e42', r, 7);
    }
  },
  cedarRidgeHill: {
    cat: 'hill', rho: 0.14,
    draw(c, x, y, u, v) {
      // Tall forested Japanese Hakone/Nikko cedar mountain ridge
      const r = mulberry(v * 19 + 5);
      const w = u * (4.5 + r() * 0.75);
      const h = u * (5.4 + r() * 0.85);

      TH.ell(c, x, y + u * 0.10, w * 1.04, u * 0.50, 'rgba(12, 28, 16, .28)');

      // Secondary peak behind
      const ox = (v % 2 ? -1 : 1) * w * 0.38;
      c.fillStyle = '#2b5234';
      c.beginPath();
      c.moveTo(x + ox - w * 0.65, y + u * 0.05);
      c.quadraticCurveTo(x + ox, y - h * 0.88, x + ox + w * 0.65, y + u * 0.05);
      c.closePath();
      c.fill();

      // Main steep emerald-pine mountain peak
      const grad = c.createLinearGradient(x - w * 0.4, y - h, x + w * 0.6, y);
      grad.addColorStop(0.0, '#4f8249');
      grad.addColorStop(0.55, '#366339');
      grad.addColorStop(1.0, '#234729');
      c.fillStyle = grad;
      c.beginPath();
      c.moveTo(x - w, y + u * 0.08);
      c.quadraticCurveTo(x - w * 0.25, y - h * 1.05, x, y - h);
      c.quadraticCurveTo(x + w * 0.25, y - h * 1.05, x + w, y + u * 0.08);
      c.quadraticCurveTo(x, y + u * 0.26, x - w, y + u * 0.08);
      c.closePath();
      c.fill();

      // Shaded right flank
      c.fillStyle = 'rgba(12, 26, 16, 0.28)';
      c.beginPath();
      c.moveTo(x, y - h);
      c.quadraticCurveTo(x + w * 0.25, y - h * 1.05, x + w, y + u * 0.08);
      c.lineTo(x + w * 0.08, y + u * 0.22);
      c.closePath();
      c.fill();

      // Drifting mountain mist wisp across mid-slope
      c.fillStyle = 'rgba(241, 245, 249, 0.24)';
      c.beginPath();
      c.ellipse(x - w * 0.12, y - h * 0.36, w * 0.56, h * 0.11, -0.08, 0, Math.PI * 2);
      c.fill();
    }
  },

  /* ---------- Authentic Japanese Trees (Sakura, Momiji Maple, Hinoki Cypress, Niwaki Pine, Bamboo) ---------- */
  sakuraTree: {
    cat: 'tree', rho: 0.12,
    draw(c, x, y, u, v) {
      // Iconic Japanese Somei-Yoshino Sakura (Cherry Blossom) tree with gnarled dark bark & soft pink cloud canopy
      const r = mulberry(v * 11 + 3), H = u * (4.2 + r() * 0.9);
      JSH(c, x, y, u * 2.1);
      c.strokeStyle = '#3b2822';
      c.lineWidth = u * 0.54;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(x, y);
      c.bezierCurveTo(x - u * 0.5, y - H * 0.32, x + u * 0.45, y - H * 0.58, x + u * 0.1, y - H * 0.74);
      c.stroke();

      const cy = y - H * 0.80;
      const sakuraCols = ['#fbcfe8', '#f9a8d4', '#fce7f3', '#f472b6'];
      [
        [0, -0.28, 1.75, 1.08],
        [-1.30, 0.04, 1.22, 0.88],
        [1.30, 0.04, 1.22, 0.88],
        [-0.65, -0.98, 1.30, 0.90],
        [0.68, -0.95, 1.25, 0.88]
      ].forEach(([dx, dy, rx, ry], i) => {
        TH.blob(c, x + dx * u, cy + dy * u, u * rx, u * ry, sakuraCols[(i + v) % 4], r, 10);
      });

      // Fallen sakura petals blanketing the moss beneath
      for (let k = 0; k < 9; k++) {
        TH.ell(c, x + (r() - 0.5) * u * 2.8, y + (r() - 0.3) * u * 0.8, u * 0.10, u * 0.06, k % 2 ? '#fbcfe8' : '#f9a8d4', r() * 3);
      }
    }
  },
  japaneseMaple: {
    cat: 'tree', rho: 0.11,
    draw(c, x, y, u, v) {
      // Delicate Japanese Momiji Maple in vibrant crimson, scarlet & burnt-amber tones
      const r = mulberry(v * 17 + 5), H = u * (3.8 + r() * 0.8);
      JSH(c, x, y, u * 1.9);
      c.strokeStyle = '#3d2c24';
      c.lineWidth = u * 0.42;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(x + u * 0.4, y - H * 0.45, x - u * 0.15, y - H * 0.72);
      c.stroke();

      const cy = y - H * 0.78;
      const momijiCols = ['#dc2626', '#ea580c', '#b91c1c', '#f59e0b'];
      [
        [0, -0.22, 1.55, 0.92],
        [-1.15, 0.08, 1.10, 0.72],
        [1.15, 0.06, 1.10, 0.72],
        [-0.45, -0.82, 1.05, 0.72],
        [0.50, -0.80, 1.05, 0.72]
      ].forEach(([dx, dy, rx, ry], i) => {
        TH.blob(c, x + dx * u, cy + dy * u, u * rx, u * ry, momijiCols[(i + v) % 4], r, 9);
      });
    }
  },
  hinokiCypress: {
    cat: 'tree', rho: 0.09,
    draw(c, x, y, u, v) {
      // Tall, slender conical Japanese Hinoki Cypress / Sugi Cedar
      const r = mulberry(v * 23 + 1), H = u * (5.4 + r() * 1.3), w = u * 1.18, tiers = 8;
      JSH(c, x, y, u * 1.3);
      TH.ln(c, [x, y], [x, y - H * 0.25], '#4a3222', u * 0.36);
      for (let i = 0; i < tiers; i++) {
        const t = i / tiers;
        const ww = w * (1 - 0.82 * t) * (0.9 + r() * 0.18);
        const yb = y - H * (0.14 + 0.78 * t);
        const tip = yb - H * 0.28;
        TH.poly(c, [[x - ww, yb], [x, yb + H * 0.03], [x + ww, yb], [x, tip]], i % 2 ? '#295738' : '#346b45');
        TH.poly(c, [[x, tip], [x + ww, yb], [x, yb + H * 0.03]], '#1c3f28');
      }
    }
  },
  niwakiPine: {
    cat: 'tree', rho: 0.12,
    draw(c, x, y, u, v) {
      // Sculpted Japanese Niwaki (cloud-pruned Kuromatsu black pine) with horizontal foliage pads
      const r = mulberry(v * 29 + 2), H = u * (4.1 + r() * 0.8);
      JSH(c, x, y, u * 2.0);
      c.strokeStyle = '#3b281c';
      c.lineWidth = u * 0.48;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(x, y);
      c.bezierCurveTo(x + u * 0.75, y - H * 0.35, x - u * 0.75, y - H * 0.65, x - u * 0.15, y - H * 0.90);
      c.stroke();

      const pads = [
        [-1.35, -0.48, 1.25, 0.38, '#235234'],
        [ 1.30, -0.60, 1.28, 0.40, '#2d6641'],
        [-0.50, -0.82, 1.15, 0.36, '#387a4e'],
        [ 0.25, -0.98, 1.40, 0.42, '#275938']
      ];
      pads.forEach(([dx, fy, rx, ry, col]) => {
        TH.ln(c, [x, y + H * (fy + 0.14)], [x + dx * u, y + H * fy], '#3b281c', u * 0.16);
        TH.blob(c, x + dx * u, y + H * fy, u * rx, u * ry, col, r, 9);
      });
    }
  },
  bambooStalks: {
    cat: 'tree', rho: 0.10,
    draw(c, x, y, u, v) {
      // Arashiyama-style tall straight green Moso bamboo stalks
      const r = mulberry(v * 31 + 7);
      JSH(c, x, y, u * 1.5);
      for (let k = 0; k < 6; k++) {
        const bx = x + (k - 2.5) * u * 0.32;
        const h  = u * (4.6 + r() * 1.8);
        const lean = (k - 2.5) * u * 0.14;
        TH.ln(c, [bx, y], [bx + lean, y - h], k % 2 ? '#4d8c3a' : '#65a844', u * 0.15);
        for (let seg = 1; seg <= 4; seg++) {
          const t = seg / 5;
          const nx = bx + lean * t, ny = y - h * t;
          TH.ln(c, [nx - u * 0.08, ny], [nx + u * 0.08, ny], '#264d1f', u * 0.04);
          if (seg >= 3) {
            TH.ell(c, nx + u * 0.32, ny - u * 0.08, u * 0.34, u * 0.09, '#6cb848', 0.3);
            TH.ell(c, nx - u * 0.32, ny - u * 0.08, u * 0.34, u * 0.09, '#4d8c3a', -0.3);
          }
        }
      }
    }
  },
  smallSakura: {
    cat: 'tree', rho: 0.07,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 37 + 1);
      JSH(c, x, y, u * 1.1);
      TH.ln(c, [x, y], [x, y - u * 1.5], '#3b2822', u * 0.28);
      TH.blob(c, x, y - u * 1.9, u * 1.05, u * 0.75, v % 2 ? '#f9a8d4' : '#fbcfe8', r, 8);
    }
  },

  /* ---------- Japanese Garden Shrubs, Karikomi & Zen Rocks ---------- */
  azaleaMound: {
    cat: 'shrub', rho: 0.06,
    draw(c, x, y, u, v) {
      // Rounded clipped Karikomi satsuki azalea bushes
      const r = mulberry(v * 5 + 9);
      TH.ell(c, x + u * 0.16, y + u * 0.07, u * 1.05, u * 0.30, 'rgba(12, 28, 16, .26)');
      [[-0.48, -0.36, 0.76, 0.52, '#2d6a36'], [0.48, -0.36, 0.76, 0.52, '#3c8244'], [0, -0.72, 0.82, 0.56, '#4b9952']].forEach(([dx, dy, rx, ry, col]) => {
        TH.blob(c, x + dx * u, y + dy * u, u * rx, u * ry, col, r, 8);
      });
      if (v % 2 === 0) {
        for (let k = 0; k < 7; k++) {
          TH.ell(c, x + (r() - 0.5) * u * 1.2, y - u * (0.26 + r() * 0.65), u * 0.10, u * 0.08, '#f43f5e');
        }
      }
    }
  },
  zenRockGroup: {
    cat: 'rock', rho: 0.08,
    draw(c, x, y, u, v) {
      // Karesansui raked white-sand ring around mossy granite boulders
      const r = mulberry(v * 13 + 3);
      TH.ell(c, x, y + u * 0.05, u * 1.65, u * 0.72, '#e2dfd5');
      c.strokeStyle = 'rgba(148, 163, 184, 0.55)';
      c.lineWidth = u * 0.04;
      c.beginPath();
      c.ellipse(x, y + u * 0.05, u * 1.38, u * 0.58, 0, 0, Math.PI * 2);
      c.stroke();

      [[-0.45, -0.05, 0.72, 0.85, '#6b7280'], [0.48, 0.08, 0.55, 0.58, '#858d99']].forEach(([dx, dy, rx, ry, col]) => {
        const px = x + dx * u, py = y + dy * u;
        TH.poly(c, [[px - u * rx, py], [px - u * rx * 0.7, py - u * ry], [px + u * rx * 0.4, py - u * ry * 0.9], [px + u * rx, py]], col);
        TH.blob(c, px - u * 0.1, py - u * ry * 0.75, u * rx * 0.55, u * 0.22, '#3f7a42', r, 6);
      });
    }
  },

  /* ---------- Traditional Japanese Landmarks & Structures ---------- */
  toriiGate: {
    cat: 'ruin', rho: 0.12,
    draw(c, x, y, u, v) {
      // Iconic Vermilion Myojin Torii Gate with black stone bases & curved kasagi lintel
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      JFLIP(c, x, v & 1, () => {
        JSH(c, x, y, u * 2.5);
        [-1.35, 1.35].forEach(px => {
          JBOX(c, x, y, u, px - 0.22, px + 0.22, -0.22, 0.22, 0, 0.48, '#1e293b');
          TH.ln(c, I(px, 0, 0.48), I(px, 0, 3.35), J_TORII, u * 0.28);
          TH.ln(c, I(px + 0.06, 0, 0.48), I(px + 0.06, 0, 3.35), J_TORII_D, u * 0.10);
        });
        // Lower horizontal nuki tie-beam & central gakuzuka tablet
        JBOX(c, x, y, u, -1.75, 1.75, -0.10, 0.10, 2.55, 2.82, J_TORII);
        JBOX(c, x, y, u, -0.26, 0.26, -0.14, 0.14, 2.82, 3.35, '#1e293b');
        // Upper curved kasagi lintel with upturned ends & black shimaki cap
        TH.poly(c, [
          I(-2.25, 0, 3.58),
          I(-1.40, 0, 3.38),
          I( 1.40, 0, 3.38),
          I( 2.25, 0, 3.58),
          I( 2.15, 0, 3.25),
          I(-2.15, 0, 3.25)
        ], J_TORII);
        TH.ln(c, I(-2.28, 0, 3.60), I(0, 0, 3.42), '#1e293b', u * 0.11);
        TH.ln(c, I(0, 0, 3.42), I(2.28, 0, 3.60), '#1e293b', u * 0.11);
      });
    }
  },
  taikoBridge: {
    cat: 'ruin', rho: 0.11,
    draw(c, x, y, u, v) {
      // High-arched Vermilion Japanese Drum Bridge (Taiko-bashi) over a koi stream
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      JFLIP(c, x, v & 1, () => {
        TH.ell(c, x, y + u * 0.15, u * 2.2, u * 0.85, '#1d6b78');
        TH.ell(c, x, y + u * 0.12, u * 1.85, u * 0.65, '#2b95a3');

        const N = 12, topL = [], topR = [], botR = [];
        for (let k = 0; k <= N; k++) {
          const t = k / N, X = -1.85 + 3.7 * t;
          const zArch = 0.20 + Math.sin(t * Math.PI) * 1.25;
          topL.push(I(X, -0.62, zArch));
          topR.push(I(X,  0.62, zArch));
          botR.push(I(X,  0.62, Math.max(0, zArch - 0.30)));
        }
        TH.poly(c, topL.concat(topR.slice().reverse()), J_CEDAR);
        TH.poly(c, topR.concat(botR.slice().reverse()), J_CEDAR_D);

        // Vermilion balustrade posts with brass giboshi finials
        [-0.62, 0.62].forEach(Y => {
          for (let k = 0; k <= 6; k++) {
            const t = k / 6, X = -1.80 + 3.6 * t;
            const zA = 0.20 + Math.sin(t * Math.PI) * 1.25;
            TH.ln(c, I(X, Y, zA), I(X, Y, zA + 0.54), J_TORII, u * 0.08);
            TH.ell(c, ...I(X, Y, zA + 0.58), u * 0.055, u * 0.06, J_GOLD);
          }
        });
      });
    }
  },
  koiPond: {
    cat: 'ruin', rho: 0.11,
    draw(c, x, y, u, v) {
      // Organic, non-perfect amoeba-shaped Japanese garden koi pond
      const r = mulberry((v || 1) * 31 + 11);
      const ph1 = r() * Math.PI * 2;
      const ph2 = r() * Math.PI * 2;
      const ph3 = r() * Math.PI * 2;
      const lobe1 = 0.18 + r() * 0.08;
      const lobe2 = 0.13 + r() * 0.07;
      const lobe3 = 0.09 + r() * 0.05;

      const amoebaPath = (rx, ry, ox = 0, oy = 0) => {
        const N = 32;
        c.beginPath();
        for (let i = 0; i <= N; i++) {
          const a = (i / N) * Math.PI * 2;
          const mod = 1
            + lobe1 * Math.sin(2 * a + ph1)
            + lobe2 * Math.cos(3 * a + ph2)
            + lobe3 * Math.sin(5 * a + ph3);
          const px = x + ox + Math.cos(a) * rx * mod;
          const py = y + oy + Math.sin(a) * ry * mod;
          if (i === 0) c.moveTo(px, py);
          else c.lineTo(px, py);
        }
        c.closePath();
      };

      // Granite gravel & mossy shoreline rim
      amoebaPath(u * 2.45, u * 1.12);
      c.fillStyle = '#8a929a';
      c.fill();

      // Deep teal pond water
      amoebaPath(u * 2.15, u * 0.95);
      c.fillStyle = '#1b6470';
      c.fill();

      // Sunlit turquoise inner water shallows
      amoebaPath(u * 1.72, u * 0.72, -u * 0.14, -u * 0.04);
      c.fillStyle = '#278a99';
      c.fill();

      // Shoreline mossy boulders hugging the amoeba indentations
      for (let k = 0; k < 5; k++) {
        const a = ph1 + k * 1.25;
        const mod = 1 + lobe1 * Math.sin(2 * a + ph1) + lobe2 * Math.cos(3 * a + ph2);
        const bx = x + Math.cos(a) * u * 2.18 * mod;
        const by = y + Math.sin(a) * u * 0.96 * mod;
        TH.ell(c, bx, by, u * (0.24 + (k % 2) * 0.08), u * 0.14, k % 2 ? '#6b7280' : '#4b7a44');
      }

      // Lotus lily pads & Kohaku red-and-white koi
      [[-0.78, -0.16], [0.68, 0.20], [0.12, -0.24]].forEach(([dx, dy], idx) => {
        TH.ell(c, x + dx * u, y + dy * u, u * 0.30, u * 0.15, '#3f8f45');
        if (idx === 1) TH.ell(c, x + dx * u, y + dy * u - u * 0.04, u * 0.10, u * 0.07, '#f9a8d4');
      });
      TH.ell(c, x - u * 0.12, y + u * 0.14, u * 0.24, u * 0.075, '#ffffff', -0.22);
      TH.ell(c, x - u * 0.07, y + u * 0.13, u * 0.11, u * 0.055, '#ef4444', -0.22);
      TH.ell(c, x + u * 0.38, y - u * 0.08, u * 0.20, u * 0.065, '#f97316', 0.28);
    }
  },
  chozuyaPavilion: {
    cat: 'ruin', rho: 0.09,
    draw(c, x, y, u) {
      // Traditional Japanese temple purification water pavilion
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      JSH(c, x, y, u * 1.9);
      JBOX(c, x, y, u, -1.35, 1.35, -1.15, 1.15, 0, 0.25, J_STONE);
      JBOX(c, x, y, u, -0.65, 0.65, -0.45, 0.45, 0.25, 0.92, '#6b7280');
      TH.ell(c, ...I(0, 0, 0.93), u * 0.45, u * 0.22, '#38bdf8');
      [[-1.1, -0.9], [1.1, -0.9], [-1.1, 0.9], [1.1, 0.9]].forEach(([px, py]) => {
        TH.ln(c, I(px, py, 0.25), I(px, py, 2.25), J_CEDAR, u * 0.13);
      });
      drawJapaneseKawaraRoof(c, I, -1.25, 1.25, -1.05, 1.05, 2.25, 0.95, J_KAWARA, '#94a3b8', u, 0.26);
    }
  },
  tenshuKeep: {
    cat: 'struct', rho: 0.08,
    draw(c, x, y, u, v) {
      // Multi-tiered Japanese Tenshu Castle Keep / Pagoda beside a Ryokan at Tier 5
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      JFLIP(c, x, v & 1, () => {
        JSH(c, x, y, u * 2.3);
        // Sloped Ishigaki battered stone castle base
        TH.poly(c, [I(-1.45, 1.45, 0), I(1.45, 1.45, 0), I(1.22, 1.22, 1.95), I(-1.22, 1.22, 1.95)], '#7b828c');
        TH.poly(c, [I(1.45, -1.45, 0), I(1.45, 1.45, 0), I(1.22, 1.22, 1.95), I(1.22, -1.22, 1.95)], '#555c66');

        // Tier 1 white shikkui plaster & dark cedar castle story + kawara roof
        JBOX(c, x, y, u, -1.12, 1.12, -1.12, 1.12, 1.95, 3.25, J_PLASTER);
        drawJapaneseKawaraRoof(c, I, -1.18, 1.18, -1.18, 1.18, 3.25, 0.72, J_KAWARA, '#cbd5e1', u, 0.30);

        // Tier 2 upper watchtower story + crowning roof with golden Shachihoko finials
        JBOX(c, x, y, u, -0.78, 0.78, -0.78, 0.78, 3.75, 4.95, J_PLASTER);
        TH.ln(c, I(-0.78, 0.79, 4.35), I(0.78, 0.79, 4.35), J_CEDAR_D, u * 0.09);
        drawJapaneseKawaraRoof(c, I, -0.84, 0.84, -0.84, 0.84, 4.95, 0.88, J_KAWARA, J_GOLD, u, 0.34);
      });
    }
  },

  /* ---------- Residences ---------- */
  machiyaHouse: JHOUSE('machiyaHouse'),
  ryokanInn:    JHOUSE('ryokanInn'),
  minkaCottage: JHOUSE('minkaCottage'),

  /* ---------- Small Japanese Garden Props (lower tiers) ---------- */
  ishidoroLantern: {
    cat: 'prop', rho: 0.03,
    draw(c, x, y, u) {
      // Traditional carved granite Ishidoro garden lantern
      TH.ell(c, x + u * 0.20, y + u * 0.06, u * 0.62, u * 0.20, 'rgba(12, 28, 16, .26)');
      TH.ln(c, [x, y], [x, y - u * 1.75], J_STONE, u * 0.26);
      TH.poly(c, [[x - u * 0.36, y], [x + u * 0.36, y], [x + u * 0.20, y - u * 0.40], [x - u * 0.20, y - u * 0.40]], '#6b7280');
      TH.poly(c, [[x - u * 0.30, y - u * 1.70], [x + u * 0.30, y - u * 1.70], [x + u * 0.26, y - u * 2.18], [x - u * 0.26, y - u * 2.18]], '#fef08a', '#4b5563', u * 0.04);
      TH.poly(c, [[x - u * 0.62, y - u * 2.15], [x + u * 0.62, y - u * 2.15], [x, y - u * 2.68]], '#6b7280');
      TH.ell(c, x, y - u * 2.75, u * 0.09, u * 0.11, J_STONE);
    }
  },
  jizoStatue: {
    cat: 'prop', rho: 0.03,
    draw(c, x, y, u) {
      TH.ell(c, x + u * 0.16, y + u * 0.06, u * 0.55, u * 0.18, 'rgba(12, 28, 16, .25)');
      JBOX(c, x, y, u, -0.45, 0.45, -0.35, 0.35, 0, 0.35, '#6b7280');
      TH.ell(c, x, y - u * 0.85, u * 0.34, u * 0.46, J_STONE);
      TH.ell(c, x, y - u * 1.42, u * 0.26, u * 0.26, '#cbd5e1');
      // Traditional red knitted bib (yodarekake)
      TH.poly(c, [[x - u * 0.24, y - u * 1.15], [x + u * 0.24, y - u * 1.15], [x, y - u * 0.78]], '#dc2626');
    }
  },
  bambooFountain: {
    cat: 'prop', rho: 0.04,
    draw(c, x, y, u) {
      // Shishi-odoshi bamboo water feature & stone basin
      TH.ell(c, x, y, u * 0.85, u * 0.38, '#6b7280');
      TH.ell(c, x, y - u * 0.05, u * 0.65, u * 0.28, '#38bdf8');
      TH.ln(c, [x + u * 0.42, y], [x + u * 0.42, y - u * 1.15], '#4d8c3a', u * 0.14);
      TH.ln(c, [x + u * 0.42, y - u * 0.95], [x + u * 0.05, y - u * 0.78], '#65a844', u * 0.12);
    }
  },
  woodenCart: {
    cat: 'prop', rho: 0.05,
    draw(c, x, y, u) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      JSH(c, x, y, u * 1.2);
      JBOX(c, x, y, u, -0.9, 0.8, -0.5, 0.5, 0.35, 0.85, J_CEDAR);
      const pW = I(0, 0.55, 0.42);
      c.strokeStyle = J_CEDAR_D;
      c.lineWidth = u * 0.11;
      c.beginPath();
      c.arc(pW[0], pW[1], u * 0.42, 0, Math.PI * 2);
      c.stroke();
    }
  }
};

/* ===== MACRO-LAND ENGINE (hex geometry, planner, 5-tier baker) ===== */
const W3 = Math.sqrt(3), HX = W3 / 2, HV = [[HX, 0.29], [0, 0.58], [-HX, 0.29], [-HX, -0.29], [0, -0.58], [HX, -0.29]];
const LAND_ROWS = {
  A: [[-1, 0, 1], [-1.5, -0.5, 0.5, 1.5], [-1, 0, 1], [-0.5, 0.5]],
  B: [[0, 1, 2], [-0.5, 0.5, 1.5], [-1, 0, 1], [-0.5, 0.5, 1.5]],
  C: [[0], [-0.5, 0.5, 1.5], [-1, 0, 1], [-0.5]],
  D: [[0, 1, 2], [-0.5, 0.5, 1.5], [0, 1]]
};
const LAND_KEEP = { rx: 0.52, ry: 0.34 };
const vkey = p => p[0].toFixed(3) + ',' + p[1].toFixed(3);
function hexInside(dx, dy, s) {
  const ax = Math.abs(dx) / s, ay = Math.abs(dy) / s;
  return ax <= HX && ay <= 0.58 - 0.3349 * ax;
}

function landGeometry(shape) {
  const centers = [];
  LAND_ROWS[shape].forEach((row, r) => row.forEach((u, i) => centers.push({ x: u * W3, y: r * 0.87, row: r, col: i })));
  const edges = new Map(), verts = new Map();
  centers.forEach((c, ci) => {
    for (let k = 0; k < 6; k++) {
      const a = [c.x + HV[k][0], c.y + HV[k][1]], b = [c.x + HV[(k + 1) % 6][0], c.y + HV[(k + 1) % 6][1]];
      const ka = vkey(a), kb = vkey(b), ek = ka < kb ? ka + '|' + kb : kb + '|' + ka;
      let e = edges.get(ek);
      if (!e) { e = { a, b, ka, kb, hexes: [] }; edges.set(ek, e); }
      e.hexes.push(ci);
      [[ka, a], [kb, b]].forEach(([kk, p]) => {
        let v = verts.get(kk);
        if (!v) { v = { k: kk, x: p[0], y: p[1], hexes: new Set() }; verts.set(kk, v); }
        v.hexes.add(ci);
      });
    }
  });
  const E = [...edges.values()].map(e => {
    const mid = [(e.a[0] + e.b[0]) / 2, (e.a[1] + e.b[1]) / 2], len = Math.hypot(e.b[0] - e.a[0], e.b[1] - e.a[1]), vertical = Math.abs(e.a[0] - e.b[0]) < 1e-6;
    let n = null, cls = null;
    if (e.hexes.length === 1) {
      const c = centers[e.hexes[0]];
      let nx = mid[0] - c.x, ny = mid[1] - c.y;
      const m = Math.hypot(nx, ny);
      n = [nx / m, ny / m];
      cls = n[1] < -0.4 ? 'top' : n[1] > 0.4 ? 'bottom' : 'side';
    }
    return Object.assign(e, { mid, len, vertical, outer: e.hexes.length === 1, n, cls });
  });
  const V = [...verts.values()].map(v => Object.assign(v, { junction: v.hexes.size >= 3 }));
  const xs = [], ys = [];
  centers.forEach(c => { xs.push(c.x - HX, c.x + HX); ys.push(c.y - 0.58, c.y + 0.58); });
  return { centers, edges: E, verts: V, bbox: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) } };
}

/* ---- generic 5-tier baker ---- */

function bakeLandTheme(T, shape, tier, R, opts) {
  opts = opts || {};
  const sc = opts.scale || getBakeScale();
  const m = opts.mirrorX ? -1 : 1;
  const ground = opts.ground || T.groundCol;
  const clr = (opts.clear || []).map(p => [Math.min(p[0], p[1]), Math.max(p[0], p[1])]);
  const key = [T.id, shape, tier, R, m, ground, sc, JSON.stringify(clr), JSON.stringify(opts.clearTiles || [])].join('|');
  const cached = revisedLandCache.get(key); if (cached) return cached;

  const plan = T.plan(shape), G = plan.G, bb = G.bbox;
  const x0 = m > 0 ? bb.minX : -bb.maxX, x1 = m > 0 ? bb.maxX : -bb.minX;
  const mx = 0.75, top = T.top || 1.65, bot = 0.85;
  const W = Math.ceil((x1 - x0 + 2 * mx) * R), H = Math.ceil((bb.maxY - bb.minY + top + bot) * R);
  const ox = (-x0 + mx) * R, oy = (-bb.minY + top) * R, u = R * 0.075;

  const mk = () => {
    const cv = document.createElement('canvas');
    cv.width = Math.ceil(W * sc);
    cv.height = Math.ceil(H * sc);
    const g = cv.getContext('2d');
    g.scale(sc, sc);
    return [cv, g];
  };
  const [back, cb] = mk();
  T.ground(cb, G, R, ox, oy, m, ground, ({ A: 3101, B: 4202, C: 5303, D: 6404 })[shape]);
  const bridges = clr.map(([i, j]) => [G.centers[i], G.centers[j]]);
  const vis = plan.objs.filter(o => o.tier <= tier && tier <= o.maxT && !bridges.some(([a, c]) => westCapsuleHit(a, c, o.x, o.y, o.rho)) && !(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));

  const sprites = vis.map(o => {
    const asset = T.assets[o.kind], base = u * (o.scale || 1);
    const reach = Math.max(asset.reach || 4, (asset.tall || 9) * 0.45);
    const span = [o.p1, o.p2].filter(Boolean).reduce((max, p) =>
      Math.max(max, Math.abs(p[0] - o.x) * R / 8, Math.abs(p[1] - o.y) * R / 4), 0);
    const unit = Math.max(base, base * reach / 8, span);
    return { x: m * o.x * R, y: o.y * R, unit, draw: (ctx, x, y) => {
      ctx.save();
      ctx.translate(x - (ox + m * o.x * R), y - (oy + o.y * R));
      T.assets[o.kind].draw(ctx,ox+m*o.x*R,oy+o.y*R,u*(o.scale||1),o.v);
      ctx.restore();
    }};
  });
  const front = document.createElement('canvas');
  front.width = front.height = 1;
  const frontRect = {x: 0, y: 0, w: 1, h: 1};
  const centers = G.centers.map(c => ({x: ox + m * c.x * R, y: oy + c.y * R, row: c.row}));
  return revisedLandCache.set(key, {back, front, frontRect, w: W, h: H, ox, oy, centers, sc, shape, tier, mirrorX: m < 0, sprites});
}

function westCapsuleHit(a, b, x, y, rho) {
  const A = LAND_KEEP.rx + rho * 0.55, B = LAND_KEEP.ry + rho * 0.28;
  const dx = b.x - a.x, dy = b.y - a.y, px = x - a.x, py = y - a.y;
  const q = dx * dx / (A * A) + dy * dy / (B * B);
  const t = Math.max(0, Math.min(1, (px * dx / (A * A) + py * dy / (B * B)) / q));
  const ex = (px - t * dx) / A, ey = (py - t * dy) / B;
  return ex * ex + ey * ey < 1;
}

/* ===== JAPANESE LAND: 5-tier spatial planner & moss/zen-gravel ground ===== */
const JAPAN_REGION = {
  top:    { hinokiCypress: .28, niwakiPine: .22, sakuraTree: .18, japaneseMaple: .14, bambooStalks: .10, smallSakura: .08 },
  mid:    { sakuraTree: .24, japaneseMaple: .20, hinokiCypress: .18, niwakiPine: .16, bambooStalks: .12, smallSakura: .10 },
  bottom: { sakuraTree: .24, japaneseMaple: .20, niwakiPine: .16, hinokiCypress: .12, bambooStalks: .10, smallSakura: .18 }
};
const JAPAN_LOW = [['smallSakura', 1.05], ['japaneseMaple', 0.72], ['niwakiPine', 0.68], ['smallSakura', 0.88], ['hinokiCypress', 0.62]];
const JAPAN_CAP = { sakuraTree: 11, japaneseMaple: 10, bambooStalks: 7 };
const JAPAN_UNDER = ['azaleaMound', 'zenRockGroup', 'azaleaMound', 'zenRockGroup'];
const JAPAN_PLAN_CACHE = {};

function getJapanPlan(shape) {
  if (JAPAN_PLAN_CACHE[shape]) return JAPAN_PLAN_CACHE[shape];
  const G = landGeometry(shape), rng = mulberry(({ A: 8101, B: 9202, C: 10303, D: 11404 })[shape]);
  const placed = [], bb = G.bbox, used = {}, A = JAPAN_ASSETS;
  const cx = G.centers.reduce((a, c) => a + c.x, 0) / G.centers.length;
  const cy = G.centers.reduce((a, c) => a + c.y, 0) / G.centers.length;

  // Tight boundary containment so outer sprites hug the hex land rim and never intrude on adjacent lands
  const inLand = (x, y, pad = 1.06) => G.centers.some(c => hexInside(x - c.x, y - c.y, pad));
  const free = (x, y, rho) => G.centers.every(c => {
    const dx = (x - c.x) / (LAND_KEEP.rx + rho * 0.42), dy = (y - c.y) / (LAND_KEEP.ry + rho * 0.26);
    return dx * dx + dy * dy >= 1;
  });
  const clearOthers = (x, y, rho) => placed.every(o => Math.hypot(x - o.x, (y - o.y) * 1.7) >= (rho + o.rho * (o.clear || 1)) * 0.68);
  const pickFrom = (w, ok) => {
    for (let g = 0; g < 12; g++) {
      let t = rng(), acc = 0, pick = Object.keys(w)[0];
      for (const k in w) { acc += w[k]; if (t <= acc) { pick = k; break; } }
      if (!ok || ok(pick)) return pick;
    }
    return 'sakuraTree';
  };
  const capOk = k => !(JAPAN_CAP[k] && (used[k] || 0) >= JAPAN_CAP[k]);
  const regionOf = y => {
    const n = (y - bb.minY) / (bb.maxY - bb.minY);
    return n < 0.34 ? JAPAN_REGION.top : n < 0.68 ? JAPAN_REGION.mid : JAPAN_REGION.bottom;
  };

  const place = (kind, x, y, extra) => {
    const D = A[kind], sc = (extra && extra.scale) || (D.cat === 'tree' ? 0.86 + rng() * 0.34 : D.cat === 'shrub' ? 0.88 + rng() * 0.28 : 1), rho = D.rho * sc;
    const maxPad = (extra && extra.pad) || ((D.cat === 'struct' || D.cat === 'ruin' || D.cat === 'hill') ? 0.95 : 1.05);
    for (let t = 0; t < 8; t++) {
      const px = x + (t ? (rng() - 0.5) * 0.10 * t : 0), py = y + (t ? (rng() - 0.5) * 0.08 * t : 0);
      if (!inLand(px, py, maxPad) || !free(px, py, rho) || !clearOthers(px, py, rho)) continue;
      if ((D.cat === 'tree' || D.cat === 'shrub' || D.cat === 'prop') && placed.some(o => o.noSouth && Math.abs(px - o.x) < 0.3 && py - o.y > -0.05 && py - o.y < 0.36)) continue;
      const o = Object.assign({ kind, x: px, y: py, rho, scale: sc, v: Math.floor(rng() * 1000), cat: D.cat, pri: rng(), minT: 1, maxT: 5 }, extra || {});
      o.scale = sc;
      placed.push(o);
      used[kind] = (used[kind] || 0) + 1;
      return o;
    }
    return null;
  };

  const tree = (x, y, extra, dom, low) => {
    if (low) {
      const L = JAPAN_LOW[Math.floor(rng() * JAPAN_LOW.length)];
      return place(L[0], x, y, Object.assign({}, extra || {}, { scale: L[1] * (0.9 + rng() * 0.2) }));
    }
    return place(dom && rng() < 0.55 && capOk(dom) ? dom : pickFrom(regionOf(y), capOk), x, y, extra || {});
  };
  const under = (x, y, extra) => place(JAPAN_UNDER[Math.floor(rng() * JAPAN_UNDER.length)], x, y, extra || {});

  const outer = G.edges.filter(e => e.outer), top = outer.filter(e => e.cls === 'top'), sides = outer.filter(e => e.cls === 'side'), interior = G.edges.filter(e => !e.outer);
  const KS = G.centers.length / 12;
  const thin = l => { const n = Math.max(1, Math.round(l.length * KS)); return Array.from({ length: n }, (_, i) => l[Math.floor((i + 0.5) * l.length / n)]); };
  const cnt = n => Math.max(1, Math.round(n * KS));
  const onEdge = (e, t, off) => [e.a[0] + (e.b[0] - e.a[0]) * t + e.n[0] * off, e.a[1] + (e.b[1] - e.a[1]) * t + e.n[1] * off];

  // 1. Towering Snow-Capped Mt. Fuji & Layered Cedar Mountain Terrain along the rear (top) rim!
  {
    const mtnSpots = [];
    top.forEach(e => [0.18, 0.38, 0.55, 0.72, 0.90].forEach(t => mtnSpots.push(onEdge(e, t, -0.18))));
    mtnSpots.sort((a, b) => a[0] - b[0]);
    const targetMtns = G.centers.length >= 12 ? 5 : 4;
    const placedMtns = [];
    for (let m = 0; m < targetMtns; m++) {
      const idx = Math.floor(((m + 0.5) / targetMtns) * mtnSpots.length);
      const cand = mtnSpots[idx];
      if (!cand) continue;
      if (placedMtns.some(q => Math.hypot(q[0] - cand[0], (q[1] - cand[1]) * 1.5) < 0.62)) continue;
      // Colossal snow-capped Fuji peak at center-back, flanked by tall layered Hinoki cedar mountain terrain
      const isCenterPeak = (m === Math.floor(targetMtns / 2));
      const kind = isCenterPeak ? 'fujiPeak' : 'cedarRidgeHill';
      const mo = place(kind, cand[0], cand[1] + 0.08, {
        minT: isCenterPeak ? 1 : (m === 1 || m === targetMtns - 2 ? 1 : 2),
        scale: isCenterPeak ? (1.18 + rng() * 0.16) : (1.06 + rng() * 0.22),
        clear: 1.15,
        noSouth: true,
        pad: 0.94
      });
      if (mo) placedMtns.push([mo.x, mo.y]);
    }
  }

  // 1b. Vermilion Torii Gate at the back rim / approach (Tier 2+)
  {
    const pts = [];
    top.forEach(e => [0.3, 0.5, 0.7].forEach(t => pts.push(onEdge(e, t, -0.08))));
    const p = pts.reduce((b, q) => Math.abs(q[0] - cx) < Math.abs(b[0] - cx) ? q : b);
    for (const [dx, dy] of [[0, 0.10], [0.35, 0.12], [-0.35, 0.12], [0.55, 0.14], [-0.55, 0.14]]) {
      const o = place('toriiGate', p[0] + dx, p[1] + dy, { minT: 2, scale: 1.05, clear: 2.0, noSouth: true, pad: 0.95 });
      if (o) break;
    }
  }

  // 2. Traditional Japanese Residences (Machiya, Minka, Ryokan) + Tier 5 Tenshu Castle Keep beside a Ryokan
  const rim = [], inn = [];
  sides.concat(outer.filter(e => e.cls === 'bottom')).forEach(e => [0.3, 0.7].forEach(t => rim.push(onEdge(e, t, -0.06))));
  G.verts.filter(v => v.junction).forEach(v => inn.push([v.x, v.y]));
  interior.filter(e => e.vertical).forEach(e => inn.push([e.mid[0], e.mid[1]]));

  const chosen = placed.filter(o => o.cat === 'ruin' || o.cat === 'struct' || o.cat === 'hill').map(o => [o.x, o.y]), ryokans = [];
  const spread = (k, pool, extra) => {
    const ranked = pool.map(p => ({ p, d: Math.min(1e9, ...chosen.map(q => Math.hypot(p[0] - q[0], (p[1] - q[1]) * 1.4))) + rng() * 0.22 })).sort((a, b) => b.d - a.d);
    for (let n = 0; n < Math.min(12, ranked.length); n++) {
      const o = place(k, ranked[n].p[0], ranked[n].p[1], extra);
      if (o) {
        chosen.push([o.x, o.y]);
        if (k === 'ryokanInn') ryokans.push(o);
        return o;
      }
    }
    return null;
  };

  thin([
    ['machiyaHouse', 1],
    ['minkaCottage', 2],
    ['ryokanInn', 3],
    ['machiyaHouse', 4],
    ['minkaCottage', 4],
    ['ryokanInn', 5]
  ]).forEach(([k, mt]) => spread(k, rim, { minT: mt, scale: 1.05, clear: 2.4, noSouth: true, pad: 0.95 }));

  thin([
    ['minkaCottage', 2],
    ['ryokanInn', 2],
    ['machiyaHouse', 3],
    ['minkaCottage', 3],
    ['machiyaHouse', 4],
    ['ryokanInn', 5],
    ['machiyaHouse', 5]
  ]).forEach(([k, mt]) => spread(k, inn, { minT: mt, scale: 1.0, clear: 2.9, noSouth: true, pad: 0.96 }));

  {
    const home = ryokans[ryokans.length - 1] || placed.find(o => o.cat === 'struct');
    if (home) {
      for (const [dx, dy] of [[0.36, -0.06], [-0.36, -0.06], [0.30, 0.10], [-0.30, 0.10], [0.42, 0.0], [-0.42, 0.0]]) {
        const o = place('tenshuKeep', home.x + dx, home.y + dy, { minT: 5, scale: 1.0, clear: 2.4, noSouth: true, pad: 0.95 });
        if (o) break;
      }
    }
  }

  // 2b. Japanese Garden Features scattered across Tiers 1..5
  thin([
    ['chozuyaPavilion', 1],
    ['koiPond', 2],
    ['taikoBridge', 2],
    ['toriiGate', 3],
    ['zenRockGroup', 3],
    ['chozuyaPavilion', 3],
    ['koiPond', 4],
    ['taikoBridge', 4],
    ['toriiGate', 5]
  ]).forEach(([k, mt]) => spread(k, rim.concat(inn), { minT: mt, scale: k === 'koiPond' || k === 'taikoBridge' ? 1.05 : 1.0, clear: 1.6, noSouth: true, pad: 0.96 }));

  // 3. Sakura, Momiji Maple, Hinoki Cypress & Niwaki Pine Woodland
  G.verts.filter(v => v.junction).forEach(v => {
    const dom = pickFrom(regionOf(v.y), capOk), n = 2 + Math.floor(rng() * 1.9);
    for (let k = 0; k < n; k++) {
      const a = rng() * 6.283, r = k ? 0.12 + rng() * 0.09 : 0.02;
      tree(v.x + Math.cos(a) * r, v.y + Math.sin(a) * r * 0.8, null, dom);
    }
  });
  G.edges.filter(e => !e.outer && e.vertical).forEach(e => {
    const dom = pickFrom(regionOf(e.mid[1]), capOk);
    [-0.27, 0, 0.27].forEach(dy => { if (rng() < 0.72) tree(e.mid[0] + (rng() - 0.5) * 0.2, e.mid[1] + dy, null, dom); });
  });
  G.edges.filter(e => !e.outer && !e.vertical).forEach(e => {
    if (rng() < 0.72) tree(e.mid[0] + (rng() - 0.5) * 0.2, e.mid[1] + (rng() - 0.5) * 0.1, { scale: 0.8 + rng() * 0.2 }, null, true);
    if (rng() < 0.22) tree(e.mid[0] + (rng() - 0.5) * 0.34, e.mid[1] + (rng() - 0.5) * 0.14, { scale: 0.78 + rng() * 0.2 }, null, true);
  });
  {
    const ordered = outer.slice().sort((a, b) => Math.atan2((a.mid[1] - cy) * 1.7, a.mid[0] - cx) - Math.atan2((b.mid[1] - cy) * 1.7, b.mid[0] - cx)), samples = [];
    ordered.forEach(e => {
      const nS = Math.max(2, Math.round(e.len / 0.26));
      for (let s = 0; s < nS; s++) samples.push({ e, p: onEdge(e, (s + 0.5) / nS + (rng() - 0.5) * 0.08, -0.08 + rng() * 0.10) });
    });
    let mode = 'grove', run = 0, dom = 'sakuraTree';
    samples.forEach(s => {
      if (run <= 0) {
        const r = rng();
        mode = r < 0.74 ? 'grove' : r < 0.92 ? 'sparse' : 'open';
        run = 2 + Math.floor(rng() * 4);
        dom = pickFrom(regionOf(s.p[1]), capOk);
      }
      run--;
      const e = s.e, low = e.cls === 'bottom' || (e.cls === 'side' && s.p[1] > cy + 0.25), p = s.p;
      if (mode === 'grove') {
        tree(p[0], p[1], null, dom, low);
        if (rng() < 0.55) tree(p[0] + (rng() - 0.5) * 0.26, p[1] - 0.09, null, dom, low);
        if (rng() < 0.2)  tree(p[0] + (rng() - 0.5) * 0.26, p[1] + 0.08, null, dom, true);
        if (rng() < 0.14) tree(p[0] + (rng() - 0.5) * 0.28, p[1] - 0.16, null, dom, low);
      } else if (mode === 'sparse') {
        if (rng() < 0.5) tree(p[0], p[1], null, dom, low); else under(p[0], p[1]);
      } else if (rng() < 0.6) under(p[0], p[1]);
    });
  }
  G.verts.filter(v => !v.junction && v.hexes.size <= 2).forEach(v => {
    if (rng() < 0.8) tree(v.x + (rng() - 0.5) * 0.10, v.y + (rng() - 0.5) * 0.08, null, null, v.y > cy + 0.3);
  });
  G.centers.forEach(c => {
    for (let k = 0; k < 14; k++) {
      const px = c.x + (rng() * 2 - 1) * HX, py = c.y + (rng() * 2 - 1) * 0.58;
      if (!hexInside(px - c.x, py - c.y, 0.98)) continue;
      if (rng() < 0.38) tree(px, py, { scale: 0.8 + rng() * 0.25 }, null, py > cy + 0.35);
    }
  });

  // Balance outer rim tree density
  {
    const dEdge = (x, y, e) => {
      const dx = e.b[0] - e.a[0], dy = e.b[1] - e.a[1];
      const t = Math.max(0, Math.min(1, ((x - e.a[0]) * dx + (y - e.a[1]) * dy) / (dx * dx + dy * dy)));
      return Math.hypot(x - (e.a[0] + dx * t), (y - (e.a[1] + dy * t)) * 1.4);
    };
    const classes = ['top', 'side', 'bottom'], len = { top: 0, side: 0, bottom: 0 };
    outer.forEach(e => len[e.cls] += e.len);
    const members = () => {
      const m = { top: [], side: [], bottom: [] };
      placed.filter(o => o.cat === 'tree').forEach(o => {
        let best = null, bd = 1e9;
        outer.forEach(e => { const d = dEdge(o.x, o.y, e); if (d < bd) { bd = d; best = e; } });
        if (bd < 0.32) m[best.cls].push(o);
      });
      return m;
    };
    let m = members();
    const mean = (m.top.length + m.side.length + m.bottom.length) / (len.top + len.side + len.bottom);
    classes.forEach(cl => {
      const target = Math.round(len[cl] * mean);
      let list = m[cl];
      if (list.length > target + 1) {
        const drop = list.length - target;
        for (let i = 0; i < drop; i++) {
          const pick = list.splice(Math.floor(rng() * list.length), 1)[0], ix = placed.indexOf(pick);
          if (ix >= 0) placed.splice(ix, 1);
        }
      } else if (list.length < target - 1) {
        const need = target - list.length, es = outer.filter(e => e.cls === cl);
        let added = 0, guard = 0;
        while (added < need && guard++ < 160) {
          const e = es[Math.floor(rng() * es.length)], p = onEdge(e, rng(), -0.08 + rng() * 0.10);
          if (tree(p[0], p[1], null, null, cl !== 'top')) added++;
        }
      }
    });
  }

  // 4. Undergrowth: Karikomi azaleas & Zen karesansui rock gardens
  G.verts.filter(v => v.junction).forEach(v => { if (rng() < 0.45) under(v.x + (rng() - 0.5) * 0.2, v.y + (rng() - 0.5) * 0.12); });
  interior.forEach(e => { if (rng() < 0.35) under(e.mid[0] + (rng() - 0.5) * 0.24, e.mid[1] + (rng() - 0.5) * 0.12); });
  outer.forEach(e => { if (rng() < 0.38) under(...onEdge(e, rng(), -0.03)); });
  G.centers.forEach(c => {
    for (let k = 0; k < 5; k++) {
      const px = c.x + (rng() * 2 - 1) * HX, py = c.y + (rng() * 2 - 1) * 0.58;
      if (hexInside(px - c.x, py - c.y, 0.96) && rng() < 0.3) under(px, py);
    }
  });

  // 5. Small Japanese Garden Props (Tiers 1..3)
  [['ishidoroLantern', 3], ['jizoStatue', 2], ['bambooFountain', 2], ['woodenCart', 1]].forEach(([k, n]) => {
    for (let i = 0; i < cnt(n); i++) {
      const e = outer[Math.floor(rng() * outer.length)], p = onEdge(e, 0.15 + rng() * 0.7, -0.04 + rng() * 0.06);
      place(k, p[0], p[1], { minT: 1, maxT: 3, prop: true });
    }
  });
  let pi = 0;
  placed.filter(o => o.prop).forEach(o => { o.minT = pi++ < 4 ? 1 : 2; });

  // Cycle residences through all 4 isometric facings
  {
    const houses = placed.filter(o => /^(machiyaHouse|ryokanInn|minkaCottage)$/.test(o.kind)).sort((a, b) => a.x - b.x || a.y - b.y);
    const cyc = [0, 3, 1, 2];
    houses.forEach((o, i) => { o.v = ((o.v >> 2) << 2) | cyc[i % 4]; });
    placed.filter(o => o.kind === 'tenshuKeep' || o.kind === 'toriiGate').forEach(o => { o.v = ((o.v >> 2) << 2) | (rng() < 0.5 ? 1 : 0); });
  }

  // Assign 5-tier thresholds (`1` Sparse -> `5` Immersive)
  const cuts = {
    tree:   [0.14, 0.34, 0.56, 0.78, 1.0],
    shrub:  [0.05, 0.24, 0.48, 0.74, 1.0],
    rock:   [0.18, 0.40, 0.65, 0.85, 1.0],
    prop:   [1, 1, 1, 1, 1],
    struct: [0, 0, 0, 0, 0],
    ruin:   [0, 0, 0, 0, 0],
    hill:   [0, 0, 0, 0, 0]
  };
  placed.forEach(o => {
    const c = cuts[o.cat] || cuts.tree;
    let t = 1;
    while (t < 5 && o.pri > c[t - 1]) t++;
    o.tier = Math.max(t, o.minT);
    if (o.cat === 'prop' || o.cat === 'struct' || o.cat === 'ruin' || o.cat === 'hill') o.tier = o.minT;
  });

  // Maintain lush tree canopy ratio (>= 65%) at every tier 1..5
  const count = t => {
    const vis = placed.filter(o => o.tier <= t && t <= o.maxT);
    const tr = vis.filter(o => o.cat === 'tree').length;
    return { n: vis.length, tr };
  };
  for (let t = 1; t <= 5; t++) {
    let guard = 0;
    while (guard++ < 320) {
      const c = count(t);
      if (c.tr / Math.max(1, c.n) >= 0.65) break;
      const pool = placed.filter(o => o.tier <= t && t <= o.maxT);
      const cand = (pool.filter(o => o.cat === 'shrub').sort((a, b) => b.pri - a.pri)[0]) ||
                   (pool.filter(o => o.prop && o.minT > 1).sort((a, b) => b.pri - a.pri)[0]);
      if (!cand) break;
      cand.tier = Math.min(6, cand.tier + 1);
    }
  }

  placed.forEach(o => {
    const over = G.centers.filter(c => Math.abs(o.x - c.x) < 1.0);
    o.layer = over.length && o.y > Math.max(...over.map(c => c.y)) + 0.05 ? 'front' : 'back';
  });
  placed.sort((a, b) => a.y - b.y);
  return (JAPAN_PLAN_CACHE[shape] = { G, objs: placed, rng });
}

/* ---- Japanese Moss Garden Ground, Zen Gravel & Fallen Sakura/Momiji Leaves ---- */
function japanGround(c, G, R, ox, oy, m, col, seed) {
  const poly = i => HV.map(v => [ox + m * (G.centers[i].x + v[0]) * R, oy + (G.centers[i].y + v[1]) * R]);
  const r = mulberry(seed), outer = G.edges.filter(e => e.outer), P = p => [ox + m * p[0] * R, oy + p[1] * R];

  c.save();
  c.lineJoin = 'round';
  c.lineCap = 'round';
  for (let i = 1; i <= 6; i++) {
    c.globalAlpha = 0.11 - i * 0.014;
    c.strokeStyle = col;
    c.lineWidth = R * 0.06 * i;
    c.beginPath();
    outer.forEach(e => { const a = P(e.a), b = P(e.b); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); });
    c.stroke();
  }
  c.globalAlpha = 1;
  G.centers.forEach((_, i) => TH.poly(c, poly(i), col, col, 2));

  c.save();
  c.beginPath();
  G.centers.forEach((_, i) => {
    poly(i).forEach((p, k) => k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
    c.closePath();
  });
  c.clip();

  const bx = [ox + Math.min(m * G.bbox.minX, m * G.bbox.maxX) * R, oy + G.bbox.minY * R, (G.bbox.maxX - G.bbox.minX) * R, (G.bbox.maxY - G.bbox.minY) * R];
  const pt = () => [bx[0] + r() * bx[2], bx[1] + r() * bx[3]];
  const soft = (x, y, rx, ry, rgb, a) => {
    c.save();
    c.translate(x, y);
    c.scale(1, ry / rx);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, `rgba(${rgb},${a})`);
    g.addColorStop(0.6, `rgba(${rgb},${a * 0.55})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    c.fillStyle = g;
    c.beginPath();
    c.arc(0, 0, rx, 0, 7);
    c.fill();
    c.restore();
  };

  // Kyoto temple-garden velvet moss tones (deep sugi-moss & warm matcha green)
  for (let k = 0; k < 48; k++) {
    const p = pt(), w = R * (0.42 + r() * 0.85);
    soft(p[0], p[1], w, w * 0.4, r() < 0.5 ? '118, 168, 72' : '42, 86, 44', r() < 0.5 ? 0.24 : 0.22);
  }
  // Raked Karesansui pale granite gravel beds
  for (let k = 0; k < 12; k++) {
    const p = pt(), w = R * (0.28 + r() * 0.44);
    soft(p[0], p[1], w, w * 0.4, '218, 214, 200', 0.24);
  }
  // Tobi-ishi flat garden stepping stones
  for (let k = 0; k < 32; k++) {
    const p = pt();
    TH.ell(c, p[0], p[1], R * (0.025 + r() * 0.015), R * 0.014, r() < 0.5 ? 'rgba(156, 163, 175, 0.60)' : 'rgba(107, 114, 128, 0.55)');
  }
  // Fine moss & grass blades
  for (let k = 0; k < 150; k++) {
    const p = pt(), h = R * (0.045 + r() * 0.055);
    for (let j = 0; j < 3; j++) {
      TH.ln(c, [p[0], p[1]], [p[0] + (j - 1) * h * 0.5, p[1] - h], ['#447838', '#5c9446', '#74ad54'][(k + j) % 3], R * 0.011);
    }
  }
  // Fallen pink sakura petals & crimson momiji maple leaves
  for (let k = 0; k < 80; k++) {
    const p = pt(), a = r() * 3.14, l = R * (0.018 + r() * 0.022);
    TH.ln(c, [p[0], p[1]], [p[0] + Math.cos(a) * l, p[1] + Math.sin(a) * l * 0.5], k % 3 === 0 ? 'rgba(220, 38, 38, 0.58)' : 'rgba(249, 168, 212, 0.72)', R * 0.012);
  }

  c.restore();
  c.restore();
}

const JAPAN_THEME = { id: 'japan', assets: JAPAN_ASSETS, plan: getJapanPlan, ground: japanGround, groundCol: '#547e42', top: 2.35 };
const JAPAN_TIER_NAMES = ['Sparse', 'Light', 'Medium', 'Heavy', 'Immersive'];
function bakeLandJapan(shape, tier, R, opts) { return bakeLandTheme(JAPAN_THEME, shape, tier, R, opts); }
function drawLandJapanBack(ctx, x, y, land) { ctx.drawImage(land.back, x - land.ox, y - land.oy, land.w, land.h); }
function drawLandJapanFront(ctx, x, y, land) { const r = land.frontRect; ctx.drawImage(land.front, x - land.ox + r.x, y - land.oy + r.y, r.w, r.h); }
function landJapanSlots(land, R) { return land.centers.map(c => ({ x: c.x, y: c.y, rx: LAND_KEEP.rx * R, ry: LAND_KEEP.ry * R })); }
return Object.freeze({ bake: (shape, tier, radius, opts) => bakeLandJapan(shape, tier === 4 ? 5 : tier, radius, opts), drawBack: drawLandJapanBack, drawFront: (ctx, x, y, land) => land.sprites.slice().sort((a,b) => a.y-b.y).forEach(s => drawScenicSprite(ctx,s,x+s.x,y+s.y)) });
})(),
  jurassic: (() => {
/* ===== THEME PACK CORE ===== */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shade(hex, amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=c=>Math.max(0,Math.min(255,Math.round(amt<0?c*(1+amt):c+(255-c)*amt)));return `rgb(${f(r)},${f(g)},${f(b)})`;}
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
    ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x+rx*0.35,y+ry*0.25,rx*0.4,ry*0.5,0,0,7);ctx.fill();}
};

/* ===== JURASSIC ISLAND ASSET LIBRARY ===== */
const JSH = (c, x, y, rx) => {
  c.fillStyle = 'rgba(8, 22, 10, 0.32)';
  c.beginPath();
  c.ellipse(x + rx * 0.24, y + rx * 0.1, rx, rx * 0.36, 0, 0, 7);
  c.fill();
};
const JFLIP = (c, x, f, fn) => {
  if (f) {
    c.save();
    c.translate(x, 0);
    c.scale(-1, 1);
    c.translate(-x, 0);
    fn();
    c.restore();
  } else fn();
};
const JBOX = (c, x, y, u, x0, x1, y0, y1, z0, z1, col) => TH.box(c, x, y, u, x0, x1, y0, y1, z0, z1, col, shade(col, -0.28), shade(col, 0.12));

// Shared Prehistoric Island Palette
const J_BASALT   = '#374151';
const J_BASALT_D = '#1f2937';
const J_LAVA     = '#f97316';
const J_BAMBOO   = '#a37b42';
const J_THATCH   = '#b5934c';
const J_STEEL    = '#64748b';
const J_AMBER    = '#f59e0b';

const JHOUSE_T = {
  expeditionLodge: { ha: 1.25, hb: 1.85, h1: 1.75, h2: 0, rise: 1.65, flare: 0.30, sw: 3.1, sh: 0.94 },
  researchBunker:  { ha: 1.30, hb: 1.85, h1: 1.60, h2: 1.35, rise: 1.45, flare: 0.22, bunker: true, sw: 3.3, sh: 0.98 },
  safariOutpost:   { ha: 1.15, hb: 1.68, h1: 1.55, h2: 0, rise: 1.50, flare: 0.28, open: true, sw: 3.0, sh: 0.92 }
};

function JHOUSE_BODY(c, x, y, u, s, eave, T) {
  const Iw = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
  const L  = (a, b, z) => eave ? Iw(b, a, z) : Iw(a, b, z);
  const LBOX = (a0, a1, b0, b1, z0, z1, col) => eave ? JBOX(c, x, y, u, b0, b1, a0, a1, z0, z1, col) : JBOX(c, x, y, u, a0, a1, b0, b1, z0, z1, col);

  const ha = T.ha, hb = T.hb;
  // Basalt stone foundation plinth
  LBOX(-ha - 0.16, ha + 0.16, -hb - 0.16, hb + 0.16, 0, 0.34, J_BASALT);

  const z1 = 0.34 + T.h1;
  if (T.bunker) {
    // Reinforced volcanic-stone & steel-trimmed field lab
    LBOX(-ha, ha, -hb, hb, 0.34, z1, '#6b7280');
    TH.poly(c, [L(-0.75, hb + 0.02, 0.95), L(0.75, hb + 0.02, 0.95), L(0.75, hb + 0.02, 1.48), L(-0.75, hb + 0.02, 1.48)], '#fef08a', '#1f2937', u * 0.06);
    TH.poly(c, [L(ha + 0.02, -0.95, 0.95), L(ha + 0.02, 0.95, 0.95), L(ha + 0.02, 0.95, 1.48), L(ha + 0.02, -0.95, 1.48)], '#38bdf8', '#1f2937', u * 0.06);

    const ha2 = ha * 0.76, hb2 = hb * 0.78, z2 = z1 + T.h2;
    LBOX(-ha2, ha2, -hb2, hb2, z1, z2, '#4b5563');
    TH.poly(c, [L(-0.55, hb2 + 0.02, z1 + 0.35), L(0.55, hb2 + 0.02, z1 + 0.35), L(0.55, hb2 + 0.02, z2 - 0.25), L(-0.55, hb2 + 0.02, z2 - 0.25)], '#38bdf8');
    // Corrugated steel roof + solar/comm dish
    TH.poly(c, [L(-ha2 - 0.18, hb2 + 0.18, z2), L(ha2 + 0.18, hb2 + 0.18, z2), L(ha2 + 0.18, -hb2 - 0.18, z2 + 0.45), L(-ha2 - 0.18, -hb2 - 0.18, z2 + 0.45)], '#334155');
    TH.ln(c, L(0, 0, z2 + 0.3), L(0, 0, z2 + 1.4), '#94a3b8', u * 0.08);
    TH.ell(c, ...L(0, 0, z2 + 1.45), u * 0.16, u * 0.16, J_AMBER);
  } else {
    // Timber & woven-bamboo expedition lodge with palm-thatch pitched roof
    LBOX(-ha, ha, -hb, hb, 0.34, z1, '#8c6239');
    [-ha, 0, ha].forEach(ax => TH.ln(c, L(ax, hb + 0.02, 0.34), L(ax, hb + 0.02, z1), '#4a3219', u * 0.12));
    [-hb, 0, hb].forEach(by => TH.ln(c, L(ha + 0.02, by, 0.34), L(ha + 0.02, by, z1), '#4a3219', u * 0.12));

    // Warm glowing expedition windows & doorway
    TH.poly(c, [L(-0.35, hb + 0.03, 0.34), L(0.35, hb + 0.03, 0.34), L(0.35, hb + 0.03, 1.55), L(-0.35, hb + 0.03, 1.55)], '#2b1b0e', '#d97706', u * 0.06);
    TH.poly(c, [L(-1.02, hb + 0.03, 0.85), L(-0.55, hb + 0.03, 0.85), L(-0.55, hb + 0.03, 1.50), L(-1.02, hb + 0.03, 1.50)], '#fef08a');
    TH.poly(c, [L( 0.55, hb + 0.03, 0.85), L( 1.02, hb + 0.03, 0.85), L( 1.02, hb + 0.03, 1.50), L( 0.55, hb + 0.03, 1.50)], '#fef08a');

    // Layered palm-thatch hipped/gabled roof
    const ov = 0.32, zPeak = z1 + T.rise;
    TH.poly(c, [L(-ha - ov, hb + ov, z1 - 0.08), L(ha + ov, hb + ov, z1 - 0.08), L(0, hb + ov, zPeak), L(0, -hb - ov, zPeak), L(-ha - ov, -hb - ov, z1 - 0.08)], '#9e7d3c');
    TH.poly(c, [L(ha + ov, hb + ov, z1 - 0.08), L(ha + ov, -hb - ov, z1 - 0.08), L(0, -hb - ov, zPeak), L(0, hb + ov, zPeak)], J_THATCH);
    TH.poly(c, [L(-ha, hb + 0.02, z1), L(ha, hb + 0.02, z1), L(0, hb + 0.02, zPeak)], '#6e4c28');
    TH.ln(c, L(0, -hb - ov, zPeak), L(0, hb + ov, zPeak), '#d9a74a', u * 0.14);
  }
}

const JHOUSE = (key) => ({
  cat: 'struct',
  rho: 0.14,
  draw(c, x, y, u, v) {
    const T = JHOUSE_T[key], o = v & 3, s = v >> 2, eave = (o >> 1) & 1;
    c.fillStyle = 'rgba(8, 22, 10, 0.32)';
    c.beginPath();
    c.ellipse(x + u * 0.7, y + u * 0.18, u * T.sw * (eave ? 1.18 : 1), u * T.sh, 0, 0, 7);
    c.fill();
    JFLIP(c, x, o & 1, () => JHOUSE_BODY(c, x, y, u, s, eave, T));
  }
});

const JURASSIC_ASSETS = {
  /* ---------- Rear Volcanic Caldera & Basalt Jungle Ridges ---------- */
  volcanoPeak: {
    cat: 'hill', rho: 0.16,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 17 + 9);
      const w = u * (5.2 + r() * 0.7);
      const h = u * (6.4 + r() * 0.8);

      TH.ell(c, x, y + u * 0.12, w * 1.04, u * 0.54, 'rgba(8, 22, 10, 0.32)');

      // Flanking lush jungle foothill ridge
      const ox = (v % 2 ? 1 : -1) * w * 0.44;
      c.fillStyle = '#254a26';
      c.beginPath();
      c.moveTo(x + ox - w * 0.65, y + u * 0.06);
      c.quadraticCurveTo(x + ox, y - h * 0.62, x + ox + w * 0.65, y + u * 0.06);
      c.closePath();
      c.fill();

      // Main volcanic basalt cone with crater rim
      const traceVolcano = () => {
        c.beginPath();
        c.moveTo(x - w, y + u * 0.10);
        c.quadraticCurveTo(x - w * 0.38, y - h * 0.48, x - w * 0.24, y - h);
        c.lineTo(x + w * 0.24, y - h);
        c.quadraticCurveTo(x + w * 0.38, y - h * 0.48, x + w, y + u * 0.10);
        c.quadraticCurveTo(x, y + u * 0.28, x - w, y + u * 0.10);
        c.closePath();
      };

      const vGrad = c.createLinearGradient(x - w * 0.5, y - h, x + w * 0.6, y);
      vGrad.addColorStop(0.00, '#4b5563');
      vGrad.addColorStop(0.45, '#374151');
      vGrad.addColorStop(0.75, '#2b522c');
      vGrad.addColorStop(1.00, '#1e3f20');
      traceVolcano();
      c.fillStyle = vGrad;
      c.fill();

      // Glowing magma crater rim & lava fissure
      TH.ell(c, x, y - h, w * 0.24, u * 0.16, '#ea580c');
      TH.ell(c, x, y - h, w * 0.15, u * 0.09, '#facc15');
      c.strokeStyle = '#f97316';
      c.lineWidth = u * 0.11;
      c.beginPath();
      c.moveTo(x - w * 0.05, y - h + u * 0.05);
      c.quadraticCurveTo(x - w * 0.16, y - h * 0.68, x - w * 0.24, y - h * 0.44);
      c.stroke();

      // Drifting volcanic steam plume
      c.fillStyle = 'rgba(226, 232, 240, 0.26)';
      c.beginPath();
      c.ellipse(x + w * 0.12, y - h - u * 0.55, u * 0.85, u * 0.36, -0.15, 0, Math.PI * 2);
      c.ellipse(x + w * 0.32, y - h - u * 0.95, u * 1.15, u * 0.45, -0.10, 0, Math.PI * 2);
      c.fill();
    }
  },
  basaltRidge: {
    cat: 'hill', rho: 0.14,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 23 + 3);
      const w = u * (4.2 + r() * 0.7);
      const h = u * (4.8 + r() * 0.8);

      TH.ell(c, x, y + u * 0.10, w * 1.04, u * 0.48, 'rgba(8, 22, 10, 0.28)');

      const grad = c.createLinearGradient(x - w * 0.4, y - h, x + w * 0.6, y);
      grad.addColorStop(0.0, '#4b5563');
      grad.addColorStop(0.50, '#2f5c30');
      grad.addColorStop(1.0, '#1e4020');
      c.fillStyle = grad;
      c.beginPath();
      c.moveTo(x - w, y + u * 0.08);
      c.quadraticCurveTo(x - w * 0.28, y - h * 1.05, x, y - h);
      c.quadraticCurveTo(x + w * 0.28, y - h * 1.05, x + w, y + u * 0.08);
      c.quadraticCurveTo(x, y + u * 0.26, x - w, y + u * 0.08);
      c.closePath();
      c.fill();

      // Jungle mist wisp across ridge
      c.fillStyle = 'rgba(226, 232, 240, 0.22)';
      c.beginPath();
      c.ellipse(x - w * 0.10, y - h * 0.34, w * 0.55, h * 0.11, -0.06, 0, Math.PI * 2);
      c.fill();
    }
  },

  /* ---------- Prehistoric Mesozoic Trees & Flora ---------- */
  araucariaTree: {
    cat: 'tree', rho: 0.12,
    draw(c, x, y, u, v) {
      // Towering Araucaria (Monkey-Puzzle) conifer with layered umbrella whorls
      const r = mulberry(v * 11 + 3), H = u * (5.8 + r() * 1.3);
      JSH(c, x, y, u * 1.8);
      TH.ln(c, [x, y], [x, y - H * 0.92], '#4a3525', u * 0.46);
      const whorls = [
        [0.48, 1.55, 0.44, '#1f4d26'],
        [0.64, 1.35, 0.40, '#296331'],
        [0.80, 1.10, 0.36, '#347a3d'],
        [0.95, 0.82, 0.32, '#41914b']
      ];
      whorls.forEach(([fy, rx, ry, col]) => {
        TH.blob(c, x, y - H * fy, u * rx, u * ry, col, r, 9);
      });
    }
  },
  giantTreeFern: {
    cat: 'tree', rho: 0.11,
    draw(c, x, y, u, v) {
      // Prehistoric Carboniferous/Jurassic giant tree fern with fibrous trunk & radiating fronds
      const r = mulberry(v * 13 + 7), H = u * (3.6 + r() * 0.8);
      JSH(c, x, y, u * 1.9);
      TH.ln(c, [x, y], [x, y - H], '#5c4028', u * 0.44);
      const ty = y - H;
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * Math.PI * 2 + 0.2;
        const len = u * (1.55 + (k % 2) * 0.35);
        const ex = x + Math.cos(a) * len;
        const ey = ty + Math.sin(a) * len * 0.55 + u * 0.35;
        c.strokeStyle = k % 2 ? '#2e7d36' : '#43a047';
        c.lineWidth = u * 0.16;
        c.beginPath();
        c.moveTo(x, ty);
        c.quadraticCurveTo(x + Math.cos(a) * len * 0.55, ty - u * 0.45, ex, ey);
        c.stroke();
      }
    }
  },
  prehistoricGinkgo: {
    cat: 'tree', rho: 0.11,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 19 + 5), H = u * (4.6 + r() * 0.9);
      JSH(c, x, y, u * 1.9);
      TH.ln(c, [x, y], [x, y - H * 0.65], '#523b28', u * 0.48);
      const cy = y - H * 0.76;
      const cols = ['#65a30d', '#84cc16', '#4d7c0f', '#a3e635'];
      [[0, -0.3, 1.55, 1.08], [-1.05, 0.08, 1.05, 0.85], [1.05, 0.08, 1.05, 0.85], [0, -1.12, 1.15, 0.88]].forEach(([dx, dy, rx, ry], i) => {
        TH.blob(c, x + dx * u, cy + dy * u, u * rx, u * ry, cols[(i + v) % 4], r, 9);
      });
    }
  },
  junglePalm: {
    cat: 'tree', rho: 0.11,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 29 + 2), H = u * (4.8 + r() * 1.1);
      const lean = (r() - 0.5) * u * 1.1;
      JSH(c, x, y, u * 1.8);
      c.strokeStyle = '#5c432c';
      c.lineWidth = u * 0.38;
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(x + lean * 0.4, y - H * 0.55, x + lean, y - H);
      c.stroke();
      const tx = x + lean, ty = y - H;
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        const len = u * 1.65;
        c.strokeStyle = k % 2 ? '#235e2b' : '#33803c';
        c.lineWidth = u * 0.14;
        c.beginPath();
        c.moveTo(tx, ty);
        c.quadraticCurveTo(tx + Math.cos(a) * len * 0.5, ty - u * 0.35, tx + Math.cos(a) * len, ty + Math.sin(a) * len * 0.52 + u * 0.32);
        c.stroke();
      }
    }
  },
  cycadPalm: {
    cat: 'tree', rho: 0.08,
    draw(c, x, y, u, v) {
      JSH(c, x, y, u * 1.2);
      TH.ell(c, x, y - u * 0.45, u * 0.42, u * 0.52, '#5c3d24');
      for (let k = 0; k < 9; k++) {
        const a = (k / 9) * Math.PI * 2;
        const len = u * 1.25;
        TH.ln(c, [x, y - u * 0.85], [x + Math.cos(a) * len, y - u * 0.85 + Math.sin(a) * len * 0.52], k % 2 ? '#2e7d36' : '#43a047', u * 0.14);
      }
    }
  },

  /* ---------- Prehistoric Undergrowth & Volcanic Rocks ---------- */
  cycadCluster: {
    cat: 'shrub', rho: 0.06,
    draw(c, x, y, u, v) {
      TH.ell(c, x + u * 0.15, y + u * 0.06, u * 1.1, u * 0.32, 'rgba(8, 22, 10, 0.28)');
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        TH.ln(c, [x, y - u * 0.22], [x + Math.cos(a) * u * 1.05, y - u * 0.22 + Math.sin(a) * u * 0.52], k % 2 ? '#25632c' : '#388e3c', u * 0.14);
      }
    }
  },
  volcanicBoulder: {
    cat: 'rock', rho: 0.08,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 17 + 3);
      JSH(c, x, y, u * 1.3);
      TH.poly(c, [[x - u * 1.1, y], [x - u * 0.75, y - u * 0.85], [x + u * 0.25, y - u * 0.95], [x + u * 1.05, y - u * 0.35], [x + u * 0.9, y + u * 0.1]], '#374151');
      TH.blob(c, x - u * 0.25, y - u * 0.65, u * 0.65, u * 0.25, '#3b7a3e', r, 6);
    }
  },

  /* ---------- Dinosaurs (Expanded Roster!) ---------- */
  brachiosaurus: {
    cat: 'ruin', rho: 0.11,
    draw(c, x, y, u, v) {
      // Towering Sauropod browsing high tree canopies
      JFLIP(c, x, v & 1, () => {
        JSH(c, x, y, u * 2.1);
        const bodyCol = '#5c7c48';
        const darkCol = '#3f5930';
        // 4 pillar legs
        [[-0.75, 0], [-0.25, 0.1], [0.45, 0], [0.85, 0.1]].forEach(([lx, ly]) => {
          TH.ln(c, [x + lx * u, y - u * 0.8], [x + lx * u, y + ly * u], darkCol, u * 0.26);
        });
        // Sweeping tail
        c.strokeStyle = bodyCol;
        c.lineWidth = u * 0.28;
        c.lineCap = 'round';
        c.beginPath();
        c.moveTo(x - u * 0.85, y - u * 1.05);
        c.quadraticCurveTo(x - u * 1.85, y - u * 1.15, x - u * 2.55, y - u * 0.85);
        c.stroke();
        // Massive torso & soaring vertical neck
        TH.ell(c, x + u * 0.05, y - u * 1.15, u * 1.15, u * 0.68, bodyCol, -0.2);
        c.strokeStyle = bodyCol;
        c.lineWidth = u * 0.34;
        c.beginPath();
        c.moveTo(x + u * 0.75, y - u * 1.45);
        c.quadraticCurveTo(x + u * 1.05, y - u * 2.65, x + u * 1.35, y - u * 3.65);
        c.stroke();
        // Crest head
        TH.ell(c, x + u * 1.55, y - u * 3.72, u * 0.34, u * 0.22, '#789c5e', 0.15);
      });
    }
  },
  triceratops: {
    cat: 'ruin', rho: 0.09,
    draw(c, x, y, u, v) {
      JFLIP(c, x, v & 1, () => {
        JSH(c, x, y, u * 1.8);
        const col = '#8c5a3c';
        [[-0.65, 0], [-0.20, 0.08], [0.35, 0], [0.75, 0.08]].forEach(([lx, ly]) => {
          TH.ln(c, [x + lx * u, y - u * 0.55], [x + lx * u, y + ly * u], '#5c3a24', u * 0.24);
        });
        TH.ln(c, [x - u * 0.85, y - u * 0.75], [x - u * 1.65, y - u * 0.55], col, u * 0.22);
        TH.ell(c, x, y - u * 0.82, u * 1.05, u * 0.56, col);
        // Iconic bony frill shield & 3 ivory horns
        TH.ell(c, x + u * 0.88, y - u * 1.05, u * 0.42, u * 0.56, '#a86e4c', -0.25);
        TH.ell(c, x + u * 1.18, y - u * 0.82, u * 0.44, u * 0.32, col);
        TH.ln(c, [x + u * 1.25, y - u * 1.02], [x + u * 1.78, y - u * 1.25], '#fef3c7', u * 0.08);
        TH.ln(c, [x + u * 1.32, y - u * 0.92], [x + u * 1.82, y - u * 1.10], '#fef3c7', u * 0.08);
        TH.ln(c, [x + u * 1.52, y - u * 0.82], [x + u * 1.78, y - u * 0.96], '#fef3c7', u * 0.07);
      });
    }
  },
  stegosaurus: {
    cat: 'ruin', rho: 0.09,
    draw(c, x, y, u, v) {
      JFLIP(c, x, v & 1, () => {
        JSH(c, x, y, u * 1.8);
        const col = '#4a6b53';
        const plateCol = '#d97706';
        [[-0.65, 0], [-0.20, 0.08], [0.35, 0], [0.75, 0.08]].forEach(([lx, ly]) => {
          TH.ln(c, [x + lx * u, y - u * 0.52], [x + lx * u, y + ly * u], '#2f4736', u * 0.24);
        });
        TH.ln(c, [x - u * 0.85, y - u * 0.72], [x - u * 1.85, y - u * 0.65], col, u * 0.20);
        // Thagomizer tail spikes
        TH.ln(c, [x - u * 1.65, y - u * 0.68], [x - u * 1.82, y - u * 0.98], '#fef3c7', u * 0.06);
        TH.ln(c, [x - u * 1.82, y - u * 0.65], [x - u * 2.02, y - u * 0.92], '#fef3c7', u * 0.06);
        TH.ell(c, x, y - u * 0.80, u * 1.05, u * 0.55, col);
        TH.ell(c, x + u * 1.18, y - u * 0.65, u * 0.30, u * 0.18, col);
        // Row of dorsal diamond plates
        [[-0.65, 1.15], [-0.28, 1.38], [0.12, 1.42], [0.52, 1.25], [0.85, 1.02]].forEach(([px, pz]) => {
          TH.poly(c, [
            [x + px * u - u * 0.18, y - u * (pz - 0.15)],
            [x + px * u,            y - u * (pz + 0.35)],
            [x + px * u + u * 0.18, y - u * (pz - 0.15)]
          ], plateCol);
        });
      });
    }
  },
  tyrannosaurus: {
    cat: 'ruin', rho: 0.12,
    draw(c, x, y, u, v) {
      // Apex Theropod Predator with massive skull, serrated jaws, tiny forelimbs & heavy tail
      JFLIP(c, x, v & 1, () => {
        JSH(c, x, y, u * 2.2);
        const rexMain = '#7f1d1d';
        const rexDark = '#450a0a';
        const rexStripe = '#d97706';

        // Heavy muscular hind legs & three-toed clawed feet
        TH.ln(c, [x - u * 0.25, y - u * 1.15], [x - u * 0.45, y], rexDark, u * 0.34);
        TH.ln(c, [x + u * 0.15, y - u * 1.15], [x + u * 0.12, y + u * 0.08], rexMain, u * 0.38);

        // Long counterbalancing tail
        c.strokeStyle = rexMain;
        c.lineWidth = u * 0.34;
        c.lineCap = 'round';
        c.beginPath();
        c.moveTo(x - u * 0.45, y - u * 1.35);
        c.quadraticCurveTo(x - u * 1.65, y - u * 1.55, x - u * 2.75, y - u * 1.25);
        c.stroke();

        // Deep muscular torso & tiger-stripe dorsal markings
        TH.ell(c, x + u * 0.15, y - u * 1.48, u * 0.95, u * 0.62, rexMain, -0.28);
        TH.ln(c, [x - u * 0.25, y - u * 1.68], [x + u * 0.45, y - u * 1.92], rexStripe, u * 0.12);

        // Tiny two-fingered forelimbs
        TH.ln(c, [x + u * 0.72, y - u * 1.45], [x + u * 1.05, y - u * 1.32], rexDark, u * 0.10);

        // Massive boxy Tyrannosaurus skull & open roaring jaws with white teeth
        TH.poly(c, [
          [x + u * 0.65, y - u * 1.85],
          [x + u * 1.65, y - u * 2.15],
          [x + u * 1.72, y - u * 1.82],
          [x + u * 0.85, y - u * 1.62]
        ], rexMain);
        // Lower jaw
        TH.poly(c, [
          [x + u * 0.78, y - u * 1.55],
          [x + u * 1.58, y - u * 1.64],
          [x + u * 1.52, y - u * 1.48],
          [x + u * 0.78, y - u * 1.42]
        ], rexDark);
        // Teeth & amber predator eye
        [1.12, 1.32, 1.50].forEach(tx => {
          TH.ln(c, [x + u * tx, y - u * 1.82], [x + u * tx, y - u * 1.70], '#fef3c7', u * 0.05);
        });
        TH.ell(c, x + u * 1.02, y - u * 1.92, u * 0.08, u * 0.06, '#facc15');
      });
    }
  },
  ankylosaurus: {
    cat: 'ruin', rho: 0.09,
    draw(c, x, y, u, v) {
      // Heavily armored low-slung herbivore with spiked carapace & tail club
      JFLIP(c, x, v & 1, () => {
        JSH(c, x, y, u * 1.8);
        const shellCol = '#57534e';
        const spikeCol = '#d6d3d1';
        [[-0.65, 0], [-0.20, 0.08], [0.35, 0], [0.75, 0.08]].forEach(([lx, ly]) => {
          TH.ln(c, [x + lx * u, y - u * 0.45], [x + lx * u, y + ly * u], '#44403c', u * 0.24);
        });
        // Heavy tail + bony tail club
        TH.ln(c, [x - u * 0.85, y - u * 0.55], [x - u * 1.85, y - u * 0.45], shellCol, u * 0.20);
        TH.ell(c, x - u * 1.95, y - u * 0.45, u * 0.28, u * 0.22, '#78716c');
        // Wide armored oval shell & lateral spikes
        TH.ell(c, x, y - u * 0.65, u * 1.05, u * 0.48, shellCol);
        [-0.6, -0.2, 0.2, 0.6].forEach(sx => {
          TH.poly(c, [[x + sx * u - u * 0.12, y - u * 0.85], [x + sx * u, y - u * 1.12], [x + sx * u + u * 0.12, y - u * 0.85]], spikeCol);
        });
        TH.ell(c, x + u * 1.12, y - u * 0.52, u * 0.34, u * 0.24, '#78716c');
      });
    }
  },
  pteranodon: {
    cat: 'prop', rho: 0.05,
    draw(c, x, y, u, v) {
      // Soaring crested Pteranodon gliding above the jungle canopy
      JFLIP(c, x, v & 1, () => {
        const fy = y - u * 2.85;
        TH.ell(c, x, y + u * 0.08, u * 0.9, u * 0.26, 'rgba(8, 22, 10, 0.18)');
        // Swept leathery wings
        TH.poly(c, [
          [x - u * 1.45, fy - u * 0.35],
          [x - u * 0.15, fy - u * 0.10],
          [x + u * 0.25, fy + u * 0.15],
          [x - u * 0.65, fy + u * 0.22]
        ], '#9a3412');
        TH.poly(c, [
          [x + u * 0.15, fy - u * 0.10],
          [x + u * 1.35, fy - u * 0.55],
          [x + u * 0.75, fy + u * 0.08]
        ], '#c2410c');
        // Pointed beak & cranial crest
        TH.poly(c, [
          [x - u * 0.45, fy - u * 0.25],
          [x + u * 0.15, fy - u * 0.12],
          [x + u * 0.85, fy + u * 0.18],
          [x + u * 0.05, fy + u * 0.05]
        ], '#ea580c');
      });
    }
  },

  /* ---------- Expedition Containment Fences, Full-Hex Paddock Segments & Pools ---------- */
  paddockFenceSeg: {
    cat: 'fence', rho: 0.02,
    draw(c, x, y, u) {
      TH.ln(c, [x, y], [x + u * 1.8, y], '#64748b', u * 0.12);
    }
  },
  electricFence: {
    cat: 'ruin', rho: 0.09,
    draw(c, x, y, u, v) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      JFLIP(c, x, v & 1, () => {
        JSH(c, x, y, u * 2.1);
        [-1.6, 0, 1.6].forEach(px => {
          JBOX(c, x, y, u, px - 0.18, px + 0.18, -0.18, 0.18, 0, 2.35, J_STEEL);
          TH.ell(c, ...I(px, 0, 2.48), u * 0.14, u * 0.14, J_AMBER);
        });
        [0.65, 1.15, 1.65, 2.15].forEach((zh, idx) => {
          TH.ln(c, I(-1.6, 0, zh), I(1.6, 0, zh), idx === 3 ? J_AMBER : '#cbd5e1', u * 0.045);
        });
      });
    }
  },
  geothermalPool: {
    cat: 'ruin', rho: 0.11,
    draw(c, x, y, u, v) {
      const r = mulberry((v || 1) * 29 + 7);
      const ph1 = r() * Math.PI * 2, ph2 = r() * Math.PI * 2;
      const poolPath = (rx, ry, ox = 0, oy = 0) => {
        const N = 28;
        c.beginPath();
        for (let i = 0; i <= N; i++) {
          const a = (i / N) * Math.PI * 2;
          const mod = 1 + 0.16 * Math.sin(2 * a + ph1) + 0.11 * Math.cos(3 * a + ph2);
          const px = x + ox + Math.cos(a) * rx * mod;
          const py = y + oy + Math.sin(a) * ry * mod;
          i === 0 ? c.moveTo(px, py) : c.lineTo(px, py);
        }
        c.closePath();
      };
      poolPath(u * 2.25, u * 1.02);
      c.fillStyle = '#4b5563';
      c.fill();
      poolPath(u * 1.92, u * 0.84);
      c.fillStyle = '#0891b2';
      c.fill();
      poolPath(u * 1.48, u * 0.62, -u * 0.1, -u * 0.03);
      c.fillStyle = '#22d3ee';
      c.fill();
      // Rising steam wisps
      c.fillStyle = 'rgba(240, 249, 255, 0.30)';
      c.beginPath();
      c.ellipse(x - u * 0.2, y - u * 0.35, u * 0.65, u * 0.25, 0, 0, Math.PI * 2);
      c.fill();
    }
  },
  amberMonument: {
    cat: 'ruin', rho: 0.09,
    draw(c, x, y, u) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      JSH(c, x, y, u * 1.6);
      JBOX(c, x, y, u, -1.0, 1.0, -0.8, 0.8, 0, 0.65, J_BASALT);
      const pTop = I(0, 0, 2.35);
      TH.poly(c, [I(-0.55, 0.55, 0.65), I(0.55, 0.55, 0.65), pTop], '#f59e0b');
      TH.poly(c, [I(0.55, -0.55, 0.65), I(0.55, 0.55, 0.65), pTop], '#d97706');
      TH.ell(c, ...I(0.1, 0.2, 1.45), u * 0.14, u * 0.20, '#451a03', 0.3);
    }
  },
  canopyLookout: {
    cat: 'struct', rho: 0.08,
    draw(c, x, y, u, v) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      JFLIP(c, x, v & 1, () => {
        JSH(c, x, y, u * 2.1);
        [[-0.95, -0.95], [0.95, -0.95], [-0.95, 0.95], [0.95, 0.95]].forEach(([px, py]) => {
          TH.ln(c, I(px, py, 0), I(px * 0.85, py * 0.85, 3.85), '#5c3d24', u * 0.18);
        });
        JBOX(c, x, y, u, -1.15, 1.15, -1.15, 1.15, 3.65, 3.95, '#8c6239');
        JBOX(c, x, y, u, -0.95, 0.95, -0.95, 0.95, 3.95, 5.15, '#78350f');
        TH.poly(c, [I(-0.65, 0.96, 4.15), I(0.65, 0.96, 4.15), I(0.65, 0.96, 4.85), I(-0.65, 0.96, 4.85)], '#fef08a');
        const pPeak = I(0, 0, 6.25);
        TH.poly(c, [I(-1.35, 1.35, 5.15), I(1.35, 1.35, 5.15), pPeak], J_THATCH);
        TH.poly(c, [I(1.35, -1.35, 5.15), I(1.35, 1.35, 5.15), pPeak], '#8f7236');
      });
    }
  },

  /* ---------- Residences ---------- */
  expeditionLodge: JHOUSE('expeditionLodge'),
  researchBunker:  JHOUSE('researchBunker'),
  safariOutpost:   JHOUSE('safariOutpost'),

  /* ---------- Small Prehistoric & Expedition Props ---------- */
  raptorPack: {
    cat: 'prop', rho: 0.05,
    draw(c, x, y, u, v) {
      JFLIP(c, x, v & 1, () => {
        [[-0.45, 0.05, 0.95], [0.42, -0.08, 0.85]].forEach(([dx, dy, sc]) => {
          const rx = x + dx * u, ry = y + dy * u;
          TH.ell(c, rx, ry + u * 0.05, u * 0.65 * sc, u * 0.22 * sc, 'rgba(8, 22, 10, 0.26)');
          TH.ln(c, [rx - u * 0.1 * sc, ry - u * 0.45 * sc], [rx - u * 0.18 * sc, ry], '#9a3412', u * 0.11 * sc);
          TH.ln(c, [rx + u * 0.12 * sc, ry - u * 0.45 * sc], [rx + u * 0.18 * sc, ry], '#7c2d12', u * 0.11 * sc);
          TH.ln(c, [rx - u * 0.35 * sc, ry - u * 0.55 * sc], [rx - u * 1.15 * sc, ry - u * 0.65 * sc], '#c2410c', u * 0.12 * sc);
          TH.ell(c, rx, ry - u * 0.58 * sc, u * 0.45 * sc, u * 0.24 * sc, '#c2410c', -0.25);
          TH.ell(c, rx + u * 0.55 * sc, ry - u * 0.88 * sc, u * 0.26 * sc, u * 0.14 * sc, '#ea580c', 0.15);
        });
      });
    }
  },
  expeditionCrate: {
    cat: 'prop', rho: 0.04,
    draw(c, x, y, u) {
      JSH(c, x, y, u * 0.9);
      JBOX(c, x, y, u, -0.55, 0.55, -0.45, 0.45, 0, 0.72, '#b45309');
      JBOX(c, x, y, u, 0.15, 0.75, 0.15, 0.65, 0, 0.48, '#0d9488');
    }
  },
  warningBeacon: {
    cat: 'prop', rho: 0.03,
    draw(c, x, y, u) {
      TH.ell(c, x + u * 0.15, y + u * 0.05, u * 0.55, u * 0.18, 'rgba(8, 22, 10, 0.26)');
      TH.ln(c, [x, y], [x, y - u * 1.85], '#334155', u * 0.18);
      TH.ell(c, x, y - u * 1.95, u * 0.26, u * 0.26, 'rgba(245, 158, 11, 0.36)');
      TH.ell(c, x, y - u * 1.95, u * 0.14, u * 0.14, '#f59e0b');
    }
  }
};

/* ===== MACRO-LAND ENGINE (hex geometry, planner, 5-tier baker) ===== */
const W3 = Math.sqrt(3), HX = W3 / 2, HV = [[HX, 0.29], [0, 0.58], [-HX, 0.29], [-HX, -0.29], [0, -0.58], [HX, -0.29]];
const LAND_ROWS = {
  A: [[-1, 0, 1], [-1.5, -0.5, 0.5, 1.5], [-1, 0, 1], [-0.5, 0.5]],
  B: [[0, 1, 2], [-0.5, 0.5, 1.5], [-1, 0, 1], [-0.5, 0.5, 1.5]],
  C: [[0], [-0.5, 0.5, 1.5], [-1, 0, 1], [-0.5]],
  D: [[0, 1, 2], [-0.5, 0.5, 1.5], [0, 1]]
};
const LAND_KEEP = { rx: 0.52, ry: 0.34 };
const vkey = p => p[0].toFixed(3) + ',' + p[1].toFixed(3);
function hexInside(dx, dy, s) {
  const ax = Math.abs(dx) / s, ay = Math.abs(dy) / s;
  return ax <= HX && ay <= 0.58 - 0.3349 * ax;
}

function landGeometry(shape) {
  const centers = [];
  LAND_ROWS[shape].forEach((row, r) => row.forEach((u, i) => centers.push({ x: u * W3, y: r * 0.87, row: r, col: i })));
  const edges = new Map(), verts = new Map();
  centers.forEach((c, ci) => {
    for (let k = 0; k < 6; k++) {
      const a = [c.x + HV[k][0], c.y + HV[k][1]], b = [c.x + HV[(k + 1) % 6][0], c.y + HV[(k + 1) % 6][1]];
      const ka = vkey(a), kb = vkey(b), ek = ka < kb ? ka + '|' + kb : kb + '|' + ka;
      let e = edges.get(ek);
      if (!e) { e = { a, b, ka, kb, hexes: [] }; edges.set(ek, e); }
      e.hexes.push(ci);
      [[ka, a], [kb, b]].forEach(([kk, p]) => {
        let v = verts.get(kk);
        if (!v) { v = { k: kk, x: p[0], y: p[1], hexes: new Set() }; verts.set(kk, v); }
        v.hexes.add(ci);
      });
    }
  });
  const E = [...edges.values()].map(e => {
    const mid = [(e.a[0] + e.b[0]) / 2, (e.a[1] + e.b[1]) / 2], len = Math.hypot(e.b[0] - e.a[0], e.b[1] - e.a[1]), vertical = Math.abs(e.a[0] - e.b[0]) < 1e-6;
    let n = null, cls = null;
    if (e.hexes.length === 1) {
      const c = centers[e.hexes[0]];
      let nx = mid[0] - c.x, ny = mid[1] - c.y;
      const m = Math.hypot(nx, ny);
      n = [nx / m, ny / m];
      cls = n[1] < -0.4 ? 'top' : n[1] > 0.4 ? 'bottom' : 'side';
    }
    return Object.assign(e, { mid, len, vertical, outer: e.hexes.length === 1, n, cls });
  });
  const V = [...verts.values()].map(v => Object.assign(v, { junction: v.hexes.size >= 3 }));
  const xs = [], ys = [];
  centers.forEach(c => { xs.push(c.x - HX, c.x + HX); ys.push(c.y - 0.58, c.y + 0.58); });
  return { centers, edges: E, verts: V, bbox: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) } };
}

/* ---- generic 5-tier baker ---- */

function bakeLandTheme(T, shape, tier, R, opts) {
  opts = opts || {};
  const sc = opts.scale || getBakeScale();
  const m = opts.mirrorX ? -1 : 1;
  const ground = opts.ground || T.groundCol;
  const clr = (opts.clear || []).map(p => [Math.min(p[0], p[1]), Math.max(p[0], p[1])]);
  const key = [T.id, shape, tier, R, m, ground, sc, JSON.stringify(clr), JSON.stringify(opts.clearTiles || [])].join('|');
  const cached = revisedLandCache.get(key); if (cached) return cached;

  const plan = T.plan(shape), G = plan.G, bb = G.bbox;
  const x0 = m > 0 ? bb.minX : -bb.maxX, x1 = m > 0 ? bb.maxX : -bb.minX;
  const mx = 0.75, top = T.top || 2.15, bot = 0.85;
  const W = Math.ceil((x1 - x0 + 2 * mx) * R), H = Math.ceil((bb.maxY - bb.minY + top + bot) * R);
  const ox = (-x0 + mx) * R, oy = (-bb.minY + top) * R, u = R * 0.075;

  const mk = () => {
    const cv = document.createElement('canvas');
    cv.width = Math.ceil(W * sc);
    cv.height = Math.ceil(H * sc);
    const g = cv.getContext('2d');
    g.scale(sc, sc);
    return [cv, g];
  };
  const [back, cb] = mk();
  T.ground(cb, G, R, ox, oy, m, ground, ({ A: 6101, B: 7202, C: 8303, D: 9404 })[shape]);
  const bridges = clr.map(([i, j]) => [G.centers[i], G.centers[j]]);
  const vis = plan.objs.filter(o => o.tier <= tier && tier <= o.maxT && !bridges.some(([a, c]) => westCapsuleHit(a, c, o.x, o.y, o.rho)) && !(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));
  const drawObj = (ctxTarget, o) => {
    const px = ox + m * o.x * R, py = oy + o.y * R, scU = u * (o.scale || 1);
    if (o.kind === 'paddockFenceSeg' && o.p1 && o.p2) {
      const ax = ox + m * o.p1[0] * R, ay = oy + o.p1[1] * R;
      const bx = ox + m * o.p2[0] * R, by = oy + o.p2[1] * R;
      const postH = u * 1.85;
      // Ground shadow under electrified fence run
      TH.ln(ctxTarget, [ax + u * 0.12, ay + u * 0.06], [bx + u * 0.12, by + u * 0.06], 'rgba(8, 22, 10, 0.30)', u * 0.14);
      // 4 horizontal high-voltage steel cables spanning between hex corner pylons
      [0.24, 0.50, 0.76, 0.96].forEach((hf, idx) => {
        TH.ln(ctxTarget, [ax, ay - postH * hf], [bx, by - postH * hf], idx === 3 ? '#f59e0b' : '#94a3b8', u * 0.042);
      });
      // Mid-span intermediate steel stanchion post
      const mx = (ax + bx) * 0.5, my = (ay + by) * 0.5;
      TH.ln(ctxTarget, [mx, my], [mx, my - postH * 0.96], '#475569', u * 0.11);
      // Heavy concrete-and-steel corner containment pylons with glowing amber warning beacons
      [[ax, ay], [bx, by]].forEach(([cxP, cyP]) => {
        TH.ln(ctxTarget, [cxP, cyP], [cxP, cyP - postH], '#334155', u * 0.22);
        TH.ln(ctxTarget, [cxP - u * 0.04, cyP], [cxP - u * 0.04, cyP - postH], '#64748b', u * 0.07);
        TH.ell(ctxTarget, cxP, cyP - postH - u * 0.10, u * 0.20, u * 0.20, 'rgba(245, 158, 11, 0.34)');
        TH.ell(ctxTarget, cxP, cyP - postH - u * 0.10, u * 0.10, u * 0.10, '#f59e0b');
      });
      return;
    }
    T.assets[o.kind].draw(ctxTarget, px, py, scU, o.v);
  };

  const sprites = vis.map(o => {
    const asset = T.assets[o.kind], base = u * (o.scale || 1);
    const reach = Math.max(asset.reach || 4, (asset.tall || 9) * 0.45);
    const span = [o.p1, o.p2].filter(Boolean).reduce((max, p) =>
      Math.max(max, Math.abs(p[0] - o.x) * R / 8, Math.abs(p[1] - o.y) * R / 4), 0);
    const unit = Math.max(base, base * reach / 8, span);
    return { x: m * o.x * R, y: o.y * R, unit, draw: (ctx, x, y) => {
      ctx.save();
      ctx.translate(x - (ox + m * o.x * R), y - (oy + o.y * R));
      drawObj(ctx,o);
      ctx.restore();
    }};
  });
  const front = document.createElement('canvas');
  front.width = front.height = 1;
  const frontRect = {x: 0, y: 0, w: 1, h: 1};
  const centers = G.centers.map(c => ({x: ox + m * c.x * R, y: oy + c.y * R, row: c.row}));
  return revisedLandCache.set(key, {back, front, frontRect, w: W, h: H, ox, oy, centers, sc, shape, tier, mirrorX: m < 0, sprites});
}

function westCapsuleHit(a, b, x, y, rho) {
  const A = LAND_KEEP.rx + rho * 0.55, B = LAND_KEEP.ry + rho * 0.28;
  const dx = b.x - a.x, dy = b.y - a.y, px = x - a.x, py = y - a.y;
  const q = dx * dx / (A * A) + dy * dy / (B * B);
  const t = Math.max(0, Math.min(1, (px * dx / (A * A) + py * dy / (B * B)) / q));
  const ex = (px - t * dx) / A, ey = (py - t * dy) / B;
  return ex * ex + ey * ey < 1;
}

/* ===== JURASSIC ISLAND LAND PLANNER & VOLCANIC JUNGLE FLOOR ===== */
const JURASSIC_REGION = {
  top:    { araucariaTree: .32, giantTreeFern: .24, prehistoricGinkgo: .20, junglePalm: .16, cycadPalm: .08 },
  mid:    { giantTreeFern: .28, araucariaTree: .24, prehistoricGinkgo: .20, junglePalm: .18, cycadPalm: .10 },
  bottom: { giantTreeFern: .28, junglePalm: .24, prehistoricGinkgo: .18, araucariaTree: .14, cycadPalm: .16 }
};
const JURASSIC_LOW = [['cycadPalm', 1.05], ['giantTreeFern', 0.72], ['prehistoricGinkgo', 0.68], ['cycadPalm', 0.88], ['junglePalm', 0.65]];
const JURASSIC_CAP = { araucariaTree: 12, giantTreeFern: 12, prehistoricGinkgo: 10 };
const JURASSIC_UNDER = ['cycadCluster', 'volcanicBoulder', 'cycadCluster', 'volcanicBoulder'];
const JURASSIC_PLAN_CACHE = {};

function getJurassicPlan(shape) {
  if (JURASSIC_PLAN_CACHE[shape]) return JURASSIC_PLAN_CACHE[shape];
  const G = landGeometry(shape), rng = mulberry(({ A: 4101, B: 5202, C: 6303, D: 7404 })[shape]);
  const placed = [], bb = G.bbox, used = {}, A = JURASSIC_ASSETS;
  const cx = G.centers.reduce((a, c) => a + c.x, 0) / G.centers.length;
  const cy = G.centers.reduce((a, c) => a + c.y, 0) / G.centers.length;

  const inLand = (x, y, pad = 1.06) => G.centers.some(c => hexInside(x - c.x, y - c.y, pad));
  const free = (x, y, rho) => G.centers.every(c => {
    const dx = (x - c.x) / (LAND_KEEP.rx + rho * 0.42), dy = (y - c.y) / (LAND_KEEP.ry + rho * 0.26);
    return dx * dx + dy * dy >= 1;
  });
  const clearOthers = (x, y, rho) => placed.every(o => {
    if (o.cat === 'fence') return true;
    return Math.hypot(x - o.x, (y - o.y) * 1.7) >= (rho + o.rho * (o.clear || 1)) * 0.68;
  });
  const pickFrom = (w, ok) => {
    for (let g = 0; g < 12; g++) {
      let t = rng(), acc = 0, pick = Object.keys(w)[0];
      for (const k in w) { acc += w[k]; if (t <= acc) { pick = k; break; } }
      if (!ok || ok(pick)) return pick;
    }
    return 'araucariaTree';
  };
  const capOk = k => !(JURASSIC_CAP[k] && (used[k] || 0) >= JURASSIC_CAP[k]);
  const regionOf = y => {
    const n = (y - bb.minY) / (bb.maxY - bb.minY);
    return n < 0.34 ? JURASSIC_REGION.top : n < 0.68 ? JURASSIC_REGION.mid : JURASSIC_REGION.bottom;
  };

  const place = (kind, x, y, extra) => {
    const D = A[kind], sc = (extra && extra.scale) || (D.cat === 'tree' ? 0.86 + rng() * 0.34 : D.cat === 'shrub' ? 0.88 + rng() * 0.28 : 1), rho = D.rho * sc;
    const maxPad = (extra && extra.pad) || ((D.cat === 'struct' || D.cat === 'ruin' || D.cat === 'hill') ? 0.95 : 1.05);
    for (let t = 0; t < 8; t++) {
      const px = x + (t ? (rng() - 0.5) * 0.10 * t : 0), py = y + (t ? (rng() - 0.5) * 0.08 * t : 0);
      if (!inLand(px, py, maxPad) || !free(px, py, rho) || !clearOthers(px, py, rho)) continue;
      if ((D.cat === 'tree' || D.cat === 'shrub' || D.cat === 'prop') && placed.some(o => o.noSouth && Math.abs(px - o.x) < 0.3 && py - o.y > -0.05 && py - o.y < 0.36)) continue;
      const o = Object.assign({ kind, x: px, y: py, rho, scale: sc, v: Math.floor(rng() * 1000), cat: D.cat, pri: rng(), minT: 1, maxT: 5 }, extra || {});
      o.scale = sc;
      placed.push(o);
      used[kind] = (used[kind] || 0) + 1;
      return o;
    }
    return null;
  };

  const tree = (x, y, extra, dom, low) => {
    if (low) {
      const L = JURASSIC_LOW[Math.floor(rng() * JURASSIC_LOW.length)];
      return place(L[0], x, y, Object.assign({}, extra || {}, { scale: L[1] * (0.9 + rng() * 0.2) }));
    }
    return place(dom && rng() < 0.55 && capOk(dom) ? dom : pickFrom(regionOf(y), capOk), x, y, extra || {});
  };
  const under = (x, y, extra) => place(JURASSIC_UNDER[Math.floor(rng() * JURASSIC_UNDER.length)], x, y, extra || {});

  const outer = G.edges.filter(e => e.outer), top = outer.filter(e => e.cls === 'top'), sides = outer.filter(e => e.cls === 'side'), interior = G.edges.filter(e => !e.outer);
  const KS = G.centers.length / 12;
  const thin = l => { const n = Math.max(1, Math.round(l.length * KS)); return Array.from({ length: n }, (_, i) => l[Math.floor((i + 0.5) * l.length / n)]); };
  const cnt = n => Math.max(1, Math.round(n * KS));
  const onEdge = (e, t, off) => [e.a[0] + (e.b[0] - e.a[0]) * t + e.n[0] * off, e.a[1] + (e.b[1] - e.a[1]) * t + e.n[1] * off];

  // 1. Rear Volcanic Caldera & Basalt Jungle Mountain Chain along top rim
  {
    const mtnSpots = [];
    top.forEach(e => [0.20, 0.42, 0.62, 0.82].forEach(t => mtnSpots.push(onEdge(e, t, -0.16))));
    mtnSpots.sort((a, b) => a[0] - b[0]);
    const targetMtns = G.centers.length >= 12 ? 4 : 3;
    const placedMtns = [];
    for (let m = 0; m < targetMtns; m++) {
      const idx = Math.floor(((m + 0.5) / targetMtns) * mtnSpots.length);
      const cand = mtnSpots[idx];
      if (!cand) continue;
      if (placedMtns.some(q => Math.hypot(q[0] - cand[0], (q[1] - cand[1]) * 1.5) < 0.65)) continue;
      const isVolcano = (m === Math.floor(targetMtns / 2));
      const kind = isVolcano ? 'volcanoPeak' : 'basaltRidge';
      const mo = place(kind, cand[0], cand[1] + 0.08, {
        minT: isVolcano ? 1 : 2,
        scale: isVolcano ? (1.14 + rng() * 0.14) : (1.02 + rng() * 0.18),
        clear: 1.2,
        noSouth: true,
        pad: 0.94
      });
      if (mo) placedMtns.push([mo.x, mo.y]);
    }
  }

  // 2. Expedition Outposts & Research Bunkers + Tier 5 Canopy Lookout Tower
  const rim = [], inn = [];
  sides.concat(outer.filter(e => e.cls === 'bottom')).forEach(e => [0.3, 0.7].forEach(t => rim.push(onEdge(e, t, -0.06))));
  G.verts.filter(v => v.junction).forEach(v => inn.push([v.x, v.y]));
  interior.filter(e => e.vertical).forEach(e => inn.push([e.mid[0], e.mid[1]]));

  const chosen = placed.filter(o => o.cat === 'ruin' || o.cat === 'struct' || o.cat === 'hill').map(o => [o.x, o.y]), bunkers = [];
  const spread = (k, pool, extra) => {
    const ranked = pool.map(p => ({ p, d: Math.min(1e9, ...chosen.map(q => Math.hypot(p[0] - q[0], (p[1] - q[1]) * 1.4))) + rng() * 0.22 })).sort((a, b) => b.d - a.d);
    for (let n = 0; n < Math.min(12, ranked.length); n++) {
      const o = place(k, ranked[n].p[0], ranked[n].p[1], extra);
      if (o) {
        chosen.push([o.x, o.y]);
        if (k === 'researchBunker') bunkers.push(o);
        return o;
      }
    }
    return null;
  };

  thin([
    ['expeditionLodge', 1],
    ['safariOutpost', 2],
    ['researchBunker', 3],
    ['expeditionLodge', 4],
    ['safariOutpost', 4],
    ['researchBunker', 5]
  ]).forEach(([k, mt]) => spread(k, rim, { minT: mt, scale: 1.05, clear: 2.3, noSouth: true, pad: 0.95 }));

  thin([
    ['safariOutpost', 2],
    ['researchBunker', 3],
    ['expeditionLodge', 3],
    ['safariOutpost', 4],
    ['expeditionLodge', 5],
    ['researchBunker', 5]
  ]).forEach(([k, mt]) => spread(k, inn, { minT: mt, scale: 1.0, clear: 2.8, noSouth: true, pad: 0.96 }));

  {
    const home = bunkers[bunkers.length - 1] || placed.find(o => o.cat === 'struct');
    if (home) {
      for (const [dx, dy] of [[0.36, -0.06], [-0.36, -0.06], [0.30, 0.10], [-0.30, 0.10], [0.42, 0.0], [-0.42, 0.0]]) {
        const o = place('canopyLookout', home.x + dx, home.y + dy, { minT: 5, scale: 1.0, clear: 2.3, noSouth: true, pad: 0.95 });
        if (o) break;
      }
    }
  }

  // 2b. Full-Hex Electrified Dino Paddocks (Fencing in entire hexes + enclosing dinosaurs inside!)
  const PADDOCK_HEX_IDS = {
    A: [6, 9],
    B: [5, 8],
    C: [4],
    D: [3]
  };
  const paddockIds = PADDOCK_HEX_IDS[shape] || [];
  paddockIds.forEach((hIdx, pOrder) => {
    const hc = G.centers[hIdx];
    if (!hc) return;
    const minTierPaddock = pOrder === 0 ? 2 : 3;
    const fScale = 0.94;
    for (let k = 0; k < 6; k++) {
      const p1 = [hc.x + HV[k][0] * fScale, hc.y + HV[k][1] * fScale];
      const p2 = [hc.x + HV[(k + 1) % 6][0] * fScale, hc.y + HV[(k + 1) % 6][1] * fScale];
      const midX = (p1[0] + p2[0]) * 0.5;
      const midY = (p1[1] + p2[1]) * 0.5;
      placed.push({
        kind: 'paddockFenceSeg',
        x: midX,
        y: midY,
        p1,
        p2,
        rho: 0.02,
        scale: 1,
        v: k + pOrder * 7,
        cat: 'fence',
        pri: 0,
        minT: minTierPaddock,
        maxT: 5
      });
    }
    const enclosedSpecies = pOrder === 0
      ? [['brachiosaurus', -0.26, -0.10], ['triceratops', 0.28, 0.14]]
      : [['tyrannosaurus', -0.22, -0.06], ['ankylosaurus', 0.28, 0.16]];
    enclosedSpecies.forEach(([dKind, oxH, oyH], dIdx) => {
      const D = A[dKind];
      placed.push({
        kind: dKind,
        x: hc.x + oxH,
        y: hc.y + oyH,
        rho: D.rho * 0.95,
        scale: 0.96,
        v: Math.floor(rng() * 1000) + dIdx,
        cat: 'ruin',
        pri: 0,
        minT: minTierPaddock + (dIdx > 0 ? 1 : 0),
        maxT: 5,
        noSouth: true
      });
    });
  });

  // 2c. Free-Roaming Prehistoric Dinosaurs, Containment Fences & Geothermal Pools across the Island!
  thin([
    ['electricFence', 1],
    ['triceratops', 1],
    ['geothermalPool', 2],
    ['brachiosaurus', 2],
    ['stegosaurus', 2],
    ['tyrannosaurus', 3],
    ['ankylosaurus', 3],
    ['amberMonument', 3],
    ['brachiosaurus', 4],
    ['triceratops', 4],
    ['stegosaurus', 4],
    ['tyrannosaurus', 5],
    ['ankylosaurus', 5]
  ]).forEach(([k, mt]) => spread(k, rim.concat(inn), { minT: mt, scale: k === 'brachiosaurus' || k === 'tyrannosaurus' ? 1.06 : 1.0, clear: 1.55, noSouth: true, pad: 0.96 }));

  // 3. Dense Mesozoic Jungle Canopy
  G.verts.filter(v => v.junction).forEach(v => {
    const dom = pickFrom(regionOf(v.y), capOk), n = 2 + Math.floor(rng() * 1.9);
    for (let k = 0; k < n; k++) {
      const a = rng() * 6.283, r = k ? 0.12 + rng() * 0.09 : 0.02;
      tree(v.x + Math.cos(a) * r, v.y + Math.sin(a) * r * 0.8, null, dom);
    }
  });
  G.edges.filter(e => !e.outer && e.vertical).forEach(e => {
    const dom = pickFrom(regionOf(e.mid[1]), capOk);
    [-0.27, 0, 0.27].forEach(dy => { if (rng() < 0.72) tree(e.mid[0] + (rng() - 0.5) * 0.2, e.mid[1] + dy, null, dom); });
  });
  G.edges.filter(e => !e.outer && !e.vertical).forEach(e => {
    if (rng() < 0.72) tree(e.mid[0] + (rng() - 0.5) * 0.2, e.mid[1] + (rng() - 0.5) * 0.1, { scale: 0.8 + rng() * 0.2 }, null, true);
    if (rng() < 0.22) tree(e.mid[0] + (rng() - 0.5) * 0.34, e.mid[1] + (rng() - 0.5) * 0.14, { scale: 0.78 + rng() * 0.2 }, null, true);
  });
  {
    const ordered = outer.slice().sort((a, b) => Math.atan2((a.mid[1] - cy) * 1.7, a.mid[0] - cx) - Math.atan2((b.mid[1] - cy) * 1.7, b.mid[0] - cx)), samples = [];
    ordered.forEach(e => {
      const nS = Math.max(2, Math.round(e.len / 0.26));
      for (let s = 0; s < nS; s++) samples.push({ e, p: onEdge(e, (s + 0.5) / nS + (rng() - 0.5) * 0.08, -0.08 + rng() * 0.10) });
    });
    let mode = 'grove', run = 0, dom = 'araucariaTree';
    samples.forEach(s => {
      if (run <= 0) {
        const r = rng();
        mode = r < 0.74 ? 'grove' : r < 0.92 ? 'sparse' : 'open';
        run = 2 + Math.floor(rng() * 4);
        dom = pickFrom(regionOf(s.p[1]), capOk);
      }
      run--;
      const e = s.e, low = e.cls === 'bottom' || (e.cls === 'side' && s.p[1] > cy + 0.25), p = s.p;
      if (mode === 'grove') {
        tree(p[0], p[1], null, dom, low);
        if (rng() < 0.55) tree(p[0] + (rng() - 0.5) * 0.26, p[1] - 0.09, null, dom, low);
        if (rng() < 0.2)  tree(p[0] + (rng() - 0.5) * 0.26, p[1] + 0.08, null, dom, true);
        if (rng() < 0.14) tree(p[0] + (rng() - 0.5) * 0.28, p[1] - 0.16, null, dom, low);
      } else if (mode === 'sparse') {
        if (rng() < 0.5) tree(p[0], p[1], null, dom, low); else under(p[0], p[1]);
      } else if (rng() < 0.6) under(p[0], p[1]);
    });
  }
  G.verts.filter(v => !v.junction && v.hexes.size <= 2).forEach(v => {
    if (rng() < 0.8) tree(v.x + (rng() - 0.5) * 0.10, v.y + (rng() - 0.5) * 0.08, null, null, v.y > cy + 0.3);
  });
  G.centers.forEach(c => {
    for (let k = 0; k < 14; k++) {
      const px = c.x + (rng() * 2 - 1) * HX, py = c.y + (rng() * 2 - 1) * 0.58;
      if (!hexInside(px - c.x, py - c.y, 0.98)) continue;
      if (rng() < 0.38) tree(px, py, { scale: 0.8 + rng() * 0.25 }, null, py > cy + 0.35);
    }
  });

  // Balance outer rim tree density
  {
    const dEdge = (x, y, e) => {
      const dx = e.b[0] - e.a[0], dy = e.b[1] - e.a[1];
      const t = Math.max(0, Math.min(1, ((x - e.a[0]) * dx + (y - e.a[1]) * dy) / (dx * dx + dy * dy)));
      return Math.hypot(x - (e.a[0] + dx * t), (y - (e.a[1] + dy * t)) * 1.4);
    };
    const classes = ['top', 'side', 'bottom'], len = { top: 0, side: 0, bottom: 0 };
    outer.forEach(e => len[e.cls] += e.len);
    const members = () => {
      const m = { top: [], side: [], bottom: [] };
      placed.filter(o => o.cat === 'tree').forEach(o => {
        let best = null, bd = 1e9;
        outer.forEach(e => { const d = dEdge(o.x, o.y, e); if (d < bd) { bd = d; best = e; } });
        if (bd < 0.32) m[best.cls].push(o);
      });
      return m;
    };
    let m = members();
    const mean = (m.top.length + m.side.length + m.bottom.length) / (len.top + len.side + len.bottom);
    classes.forEach(cl => {
      const target = Math.round(len[cl] * mean);
      let list = m[cl];
      if (list.length > target + 1) {
        const drop = list.length - target;
        for (let i = 0; i < drop; i++) {
          const pick = list.splice(Math.floor(rng() * list.length), 1)[0], ix = placed.indexOf(pick);
          if (ix >= 0) placed.splice(ix, 1);
        }
      } else if (list.length < target - 1) {
        const need = target - list.length, es = outer.filter(e => e.cls === cl);
        let added = 0, guard = 0;
        while (added < need && guard++ < 160) {
          const e = es[Math.floor(rng() * es.length)], p = onEdge(e, rng(), -0.08 + rng() * 0.10);
          if (tree(p[0], p[1], null, null, cl !== 'top')) added++;
        }
      }
    });
  }

  // 4. Cycad Undergrowth & Mossy Volcanic Boulders
  G.verts.filter(v => v.junction).forEach(v => { if (rng() < 0.45) under(v.x + (rng() - 0.5) * 0.2, v.y + (rng() - 0.5) * 0.12); });
  interior.forEach(e => { if (rng() < 0.35) under(e.mid[0] + (rng() - 0.5) * 0.24, e.mid[1] + (rng() - 0.5) * 0.12); });
  outer.forEach(e => { if (rng() < 0.38) under(...onEdge(e, rng(), -0.03)); });
  G.centers.forEach(c => {
    for (let k = 0; k < 5; k++) {
      const px = c.x + (rng() * 2 - 1) * HX, py = c.y + (rng() * 2 - 1) * 0.58;
      if (hexInside(px - c.x, py - c.y, 0.96) && rng() < 0.3) under(px, py);
    }
  });

  // 5. Small Prehistoric Props (Raptor packs, Soaring Pteranodons, Expedition crates, Amber warning beacons)
  [['raptorPack', 4], ['pteranodon', 3], ['expeditionCrate', 2], ['warningBeacon', 3]].forEach(([k, n]) => {
    for (let i = 0; i < cnt(n); i++) {
      const e = outer[Math.floor(rng() * outer.length)], p = onEdge(e, 0.15 + rng() * 0.7, -0.04 + rng() * 0.06);
      place(k, p[0], p[1], { minT: 1, maxT: 5, prop: true });
    }
  });
  let pi = 0;
  placed.filter(o => o.prop).forEach(o => { o.minT = pi++ < 5 ? 1 : (pi < 10 ? 2 : 3); });

  // Cycle buildings through all 4 isometric facings
  {
    const houses = placed.filter(o => /^(expeditionLodge|researchBunker|safariOutpost)$/.test(o.kind)).sort((a, b) => a.x - b.x || a.y - b.y);
    const cyc = [0, 3, 1, 2];
    houses.forEach((o, i) => { o.v = ((o.v >> 2) << 2) | cyc[i % 4]; });
    placed.filter(o => o.kind === 'canopyLookout').forEach(o => { o.v = ((o.v >> 2) << 2) | (rng() < 0.5 ? 1 : 0); });
  }

  // Assign 5-tier thresholds (`1` Sparse -> `5` Immersive)
  const cuts = {
    tree:   [0.14, 0.34, 0.56, 0.78, 1.0],
    shrub:  [0.05, 0.24, 0.48, 0.74, 1.0],
    rock:   [0.18, 0.40, 0.65, 0.85, 1.0],
    prop:   [1, 1, 1, 1, 1],
    struct: [0, 0, 0, 0, 0],
    ruin:   [0, 0, 0, 0, 0],
    hill:   [0, 0, 0, 0, 0],
    fence:  [0, 0, 0, 0, 0]
  };
  placed.forEach(o => {
    const c = cuts[o.cat] || cuts.tree;
    let t = 1;
    while (t < 5 && o.pri > c[t - 1]) t++;
    o.tier = Math.max(t, o.minT);
    if (o.cat === 'prop' || o.cat === 'struct' || o.cat === 'ruin' || o.cat === 'hill' || o.cat === 'fence') o.tier = o.minT;
  });

  // Maintain lush jungle canopy ratio (>= 62%) at every tier 1..5
  const count = t => {
    const vis = placed.filter(o => o.tier <= t && t <= o.maxT);
    const tr = vis.filter(o => o.cat === 'tree').length;
    return { n: vis.length, tr };
  };
  for (let t = 1; t <= 5; t++) {
    let guard = 0;
    while (guard++ < 320) {
      const c = count(t);
      if (c.tr / Math.max(1, c.n) >= 0.62) break;
      const pool = placed.filter(o => o.tier <= t && t <= o.maxT);
      const cand = (pool.filter(o => o.cat === 'shrub').sort((a, b) => b.pri - a.pri)[0]) ||
                   (pool.filter(o => o.prop && o.minT > 1).sort((a, b) => b.pri - a.pri)[0]);
      if (!cand) break;
      cand.tier = Math.min(6, cand.tier + 1);
    }
  }

  placed.forEach(o => {
    const over = G.centers.filter(c => Math.abs(o.x - c.x) < 1.0);
    o.layer = over.length && o.y > Math.max(...over.map(c => c.y)) + 0.05 ? 'front' : 'back';
  });
  placed.sort((a, b) => a.y - b.y);
  return (JURASSIC_PLAN_CACHE[shape] = { G, objs: placed, rng });
}

/* ---- Rich Volcanic-Loam Jungle Ground, Fern Litter & Expedition Trail Pebbles ---- */
function jurassicGround(c, G, R, ox, oy, m, col, seed) {
  const poly = i => HV.map(v => [ox + m * (G.centers[i].x + v[0]) * R, oy + (G.centers[i].y + v[1]) * R]);
  const r = mulberry(seed), outer = G.edges.filter(e => e.outer), P = p => [ox + m * p[0] * R, oy + p[1] * R];

  c.save();
  c.lineJoin = 'round';
  c.lineCap = 'round';
  for (let i = 1; i <= 6; i++) {
    c.globalAlpha = 0.11 - i * 0.014;
    c.strokeStyle = col;
    c.lineWidth = R * 0.06 * i;
    c.beginPath();
    outer.forEach(e => { const a = P(e.a), b = P(e.b); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); });
    c.stroke();
  }
  c.globalAlpha = 1;
  G.centers.forEach((_, i) => TH.poly(c, poly(i), col, col, 2));

  c.save();
  c.beginPath();
  G.centers.forEach((_, i) => {
    poly(i).forEach((p, k) => k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
    c.closePath();
  });
  c.clip();

  const bx = [ox + Math.min(m * G.bbox.minX, m * G.bbox.maxX) * R, oy + G.bbox.minY * R, (G.bbox.maxX - G.bbox.minX) * R, (G.bbox.maxY - G.bbox.minY) * R];
  const pt = () => [bx[0] + r() * bx[2], bx[1] + r() * bx[3]];
  const soft = (x, y, rx, ry, rgb, a) => {
    c.save();
    c.translate(x, y);
    c.scale(1, ry / rx);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, `rgba(${rgb},${a})`);
    g.addColorStop(0.6, `rgba(${rgb},${a * 0.55})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    c.fillStyle = g;
    c.beginPath();
    c.arc(0, 0, rx, 0, 7);
    c.fill();
    c.restore();
  };

  // Deep tropical jungle moss & sunlit fern-canopy dapple
  for (let k = 0; k < 48; k++) {
    const p = pt(), w = R * (0.42 + r() * 0.85);
    soft(p[0], p[1], w, w * 0.4, r() < 0.5 ? '88, 148, 56' : '28, 62, 32', r() < 0.5 ? 0.24 : 0.24);
  }
  // Dark volcanic-loam mud & expedition trail patches
  for (let k = 0; k < 14; k++) {
    const p = pt(), w = R * (0.28 + r() * 0.44);
    soft(p[0], p[1], w, w * 0.4, '74, 56, 38', 0.22);
  }
  // Volcanic basalt pebbles
  for (let k = 0; k < 30; k++) {
    const p = pt();
    TH.ell(c, p[0], p[1], R * (0.022 + r() * 0.014), R * 0.013, 'rgba(55, 65, 81, 0.58)');
  }
  // Tropical undergrowth fern blades
  for (let k = 0; k < 160; k++) {
    const p = pt(), h = R * (0.05 + r() * 0.06);
    for (let j = 0; j < 3; j++) {
      TH.ln(c, [p[0], p[1]], [p[0] + (j - 1) * h * 0.5, p[1] - h], ['#2d6a32', '#438a42', '#5ca64e'][(k + j) % 3], R * 0.011);
    }
  }

  c.restore();
  c.restore();
}

const JURASSIC_THEME = { id: 'jurassic', assets: JURASSIC_ASSETS, plan: getJurassicPlan, ground: jurassicGround, groundCol: '#3d6838', top: 2.15 };
const JURASSIC_TIER_NAMES = ['Sparse', 'Light', 'Medium', 'Heavy', 'Immersive'];
function bakeLandJurassic(shape, tier, R, opts) { return bakeLandTheme(JURASSIC_THEME, shape, tier, R, opts); }
function drawLandJurassicBack(ctx, x, y, land) { ctx.drawImage(land.back, x - land.ox, y - land.oy, land.w, land.h); }
function drawLandJurassicFront(ctx, x, y, land) { const r = land.frontRect; ctx.drawImage(land.front, x - land.ox + r.x, y - land.oy + r.y, r.w, r.h); }
function landJurassicSlots(land, R) { return land.centers.map(c => ({ x: c.x, y: c.y, rx: LAND_KEEP.rx * R, ry: LAND_KEEP.ry * R })); }
return Object.freeze({ bake: (shape, tier, radius, opts) => bakeLandJurassic(shape, tier === 4 ? 5 : tier, radius, opts), drawBack: drawLandJurassicBack, drawFront: (ctx, x, y, land) => land.sprites.slice().sort((a,b) => a.y-b.y).forEach(s => drawScenicSprite(ctx,s,x+s.x,y+s.y)) });
})(),
  greece: (() => {
/* ===== THEME PACK CORE (shared by every theme pack; copy once into engine.js) ===== */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shade(hex, amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=c=>Math.max(0,Math.min(255,Math.round(amt<0?c*(1+amt):c+(255-c)*amt)));return `rgb(${f(r)},${f(g)},${f(b)})`;}
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
    ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x+rx*0.35,y+ry*0.25,rx*0.4,ry*0.5,0,0,7);ctx.fill();}
};

/* ===== ANCIENT GREECE ASSET LIBRARY ===== */
const GSH = (c, x, y, rx) => {
  c.fillStyle = 'rgba(28, 34, 14, .28)';
  c.beginPath();
  c.ellipse(x + rx * 0.24, y + rx * 0.1, rx, rx * 0.36, 0, 0, 7);
  c.fill();
};
const GFLIP = (c, x, f, fn) => {
  if (f) {
    c.save();
    c.translate(x, 0);
    c.scale(-1, 1);
    c.translate(-x, 0);
    fn();
    c.restore();
  } else fn();
};
const GBOX = (c, x, y, u, x0, x1, y0, y1, z0, z1, col) => TH.box(c, x, y, u, x0, x1, y0, y1, z0, z1, col, shade(col, -0.26), shade(col, 0.12));

// Shared Classical Greek Palette
const GR_MARBLE   = '#f4efe6'; // Pentelic cream-white marble
const GR_MARBLE_D = '#d6cfc0';
const GR_LIMESTN  = '#e6decb'; // Warm Aegean limestone
const GR_TERRA    = '#c2593a'; // Terracotta barrel roof tiles
const GR_TERRA_D  = '#8c3b24';
const GR_BLUE     = '#1d5fa7'; // Aegean cobalt-blue trim & shutters
const GR_GOLD     = '#d99b26'; // Gilded bronze acroteria & sun trim
const GR_OLIVE    = '#6b8c4e'; // Silvery-sage olive leaf

// Helper: Low-pitched Classical Greek Terracotta Barrel-Tile Gable Roof with Triangular Pediment
function drawGreekPedimentRoof(c, L, a0, a1, b0, b1, zBase, rise, tileCol, pedCol, u) {
  const am = (a0 + a1) * 0.5;
  const ov = 0.22;
  const eFL = L(a0 - ov, b1 + ov, zBase);
  const eFR = L(a1 + ov, b1 + ov, zBase);
  const eBR = L(a1 + ov, b0 - ov, zBase);
  const eBL = L(a0 - ov, b0 - ov, zBase);
  const rF  = L(am, b1 + ov, zBase + rise);
  const rB  = L(am, b0 - ov, zBase + rise);

  // Back-left terracotta slope
  TH.poly(c, [eBL, eFL, rF, rB], shade(tileCol, 0.14));
  // Front-right sunlit/shaded terracotta slope
  TH.poly(c, [eFR, eBR, rB, rF], tileCol);

  // Barrel-tile ridge flutes running down slope
  const nRibs = 7;
  for (let k = 1; k < nRibs; k++) {
    const t = k / nRibs;
    const tb = b0 - ov + (b1 - b0 + 2 * ov) * t;
    TH.ln(c, L(am, tb, zBase + rise), L(a1 + ov, tb, zBase), 'rgba(55, 20, 10, 0.28)', u * 0.045);
  }

  // Front triangular tympanum pediment with recessed relief & gold acroterion ornament
  TH.poly(c, [L(a0 - 0.06, b1 + 0.02, zBase), L(a1 + 0.06, b1 + 0.02, zBase), L(am, b1 + 0.02, zBase + rise)], pedCol || GR_MARBLE);
  TH.poly(c, [L(a0 + 0.14, b1 + 0.03, zBase + 0.12), L(a1 - 0.14, b1 + 0.03, zBase + 0.12), L(am, b1 + 0.03, zBase + rise - 0.16)], shade(pedCol || GR_MARBLE, -0.14));
  TH.ln(c, rB, rF, shade(tileCol, 0.28), u * 0.11);
  // Gilded acroteria finials at apex and corners
  TH.ell(c, rF[0], rF[1] - u * 0.12, u * 0.11, u * 0.15, GR_GOLD);
}

/* ---- Classical Greek Residences & Villas (4 orientations via GFLIP x eave) ---- */
const GRHOUSE_T = {
  greekVilla:     { ha: 1.25, hb: 1.85, h1: 1.85, h2: 0, wall: GR_MARBLE, tile: GR_TERRA, rise: 1.05, portico: true, sw: 3.2, sh: 0.95 },
  peristyleHouse: { ha: 1.32, hb: 1.92, h1: 1.65, h2: 1.35, wall: GR_LIMESTN, tile: '#b84a2e', rise: 1.15, twoStory: true, sw: 3.4, sh: 1.0 },
  aegeanCottage:  { ha: 1.15, hb: 1.68, h1: 1.65, h2: 0, wall: '#ffffff', tile: GR_TERRA, rise: 0.95, blueTrim: true, sw: 3.0, sh: 0.92 }
};

function GRHOUSE_BODY(c, x, y, u, s, eave, T) {
  const Iw = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
  const L  = (a, b, z) => eave ? Iw(b, a, z) : Iw(a, b, z);
  const LBOX = (a0, a1, b0, b1, z0, z1, col) => eave ? GBOX(c, x, y, u, b0, b1, a0, a1, z0, z1, col) : GBOX(c, x, y, u, a0, a1, b0, b1, z0, z1, col);

  const ha = T.ha, hb = T.hb, z1 = 0.30 + T.h1;
  // Stepped marble crepidoma foundation
  LBOX(-ha - 0.15, ha + 0.15, -hb - 0.15, hb + 0.15, 0, 0.30, GR_MARBLE_D);
  LBOX(-ha, ha, -hb, hb, 0.30, z1, T.wall);

  // Aegean blue or terracotta dado frieze & Doric corner pilasters
  const trimCol = T.blueTrim ? GR_BLUE : GR_GOLD;
  TH.ln(c, L(-ha, hb + 0.02, z1 - 0.10), L(ha, hb + 0.02, z1 - 0.10), trimCol, u * 0.09);
  TH.ln(c, L(ha + 0.02, -hb, z1 - 0.10), L(ha + 0.02, hb, z1 - 0.10), trimCol, u * 0.09);

  // Tall recessed doorway & shuttered windows
  if (!eave) {
    TH.poly(c, [L(-0.34, hb + 0.03, 0.30), L(0.34, hb + 0.03, 0.30), L(0.34, hb + 0.03, 1.52), L(-0.34, hb + 0.03, 1.52)], '#291d14', trimCol, u * 0.06);
    [-0.85, 0.85].forEach(wx => {
      TH.poly(c, [L(wx - 0.22, hb + 0.03, 0.78), L(wx + 0.22, hb + 0.03, 0.78), L(wx + 0.22, hb + 0.03, 1.48), L(wx - 0.22, hb + 0.03, 1.48)], T.blueTrim ? GR_BLUE : '#334155');
    });
    [-1.1, 0, 1.1].forEach(wy => {
      TH.poly(c, [L(ha + 0.03, wy - 0.22, 0.78), L(ha + 0.03, wy + 0.22, 0.78), L(ha + 0.03, wy + 0.22, 1.48), L(ha + 0.03, wy - 0.22, 1.48)], '#1e293b');
    });
  } else {
    TH.poly(c, [L(ha + 0.03, -0.36, 0.30), L(ha + 0.03, 0.36, 0.30), L(ha + 0.03, 0.36, 1.52), L(ha + 0.03, -0.36, 1.52)], '#291d14', trimCol, u * 0.06);
    [-1.15, 1.15].forEach(wy => {
      TH.poly(c, [L(ha + 0.03, wy - 0.22, 0.78), L(ha + 0.03, wy + 0.22, 0.78), L(ha + 0.03, wy + 0.22, 1.48), L(ha + 0.03, wy - 0.22, 1.48)], T.blueTrim ? GR_BLUE : '#334155');
    });
    [-0.75, 0.75].forEach(wx => {
      TH.poly(c, [L(wx - 0.22, hb + 0.03, 0.78), L(wx + 0.22, hb + 0.03, 0.78), L(wx + 0.22, hb + 0.03, 1.48), L(wx - 0.22, hb + 0.03, 1.48)], '#1e293b');
    });
  }

  // Front Doric columned porch if `portico`
  if (T.portico && !eave) {
    [-0.85, -0.28, 0.28, 0.85].forEach(cxO => {
      TH.ln(c, L(cxO, hb + 0.26, 0.30), L(cxO, hb + 0.26, z1), '#ffffff', u * 0.13);
    });
  }

  if (T.twoStory) {
    const ha2 = ha * 0.80, hb2 = hb * 0.82, z2 = z1 + T.h2;
    LBOX(-ha2, ha2, -hb2, hb2, z1, z2, GR_MARBLE);
    [-0.65, 0.65].forEach(wx => {
      TH.poly(c, [L(wx - 0.20, hb2 + 0.03, z1 + 0.35), L(wx + 0.20, hb2 + 0.03, z1 + 0.35), L(wx + 0.20, hb2 + 0.03, z2 - 0.22), L(wx - 0.20, hb2 + 0.03, z2 - 0.22)], '#fef08a');
    });
    drawGreekPedimentRoof(c, L, -ha2, ha2, -hb2, hb2, z2, T.rise, T.tile, GR_MARBLE, u);
  } else {
    drawGreekPedimentRoof(c, L, -ha, ha, -hb, hb, z1, T.rise, T.tile, T.wall, u);
  }
}

const GRHOUSE = (key) => ({
  cat: 'struct',
  rho: 0.14,
  draw(c, x, y, u, v) {
    const T = GRHOUSE_T[key], o = v & 3, s = v >> 2, eave = (o >> 1) & 1;
    c.fillStyle = 'rgba(28, 34, 14, .28)';
    c.beginPath();
    c.ellipse(x + u * 0.7, y + u * 0.18, u * T.sw * (eave ? 1.18 : 1), u * T.sh, 0, 0, 7);
    c.fill();
    GFLIP(c, x, o & 1, () => GRHOUSE_BODY(c, x, y, u, s, eave, T));
  }
});

const GREECE_ASSETS = {
  /* ---------- Rear Peloponnesian & Olympus Karst Limestone Hills ---------- */
  olympusCrag: {
    cat: 'hill', rho: 0.15,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 17 + 5);
      const w = u * (4.4 + r() * 0.7);
      const h = u * (4.8 + r() * 0.8);

      TH.ell(c, x, y + u * 0.10, w * 1.04, u * 0.48, 'rgba(28, 34, 14, .26)');

      // Flanking sun-baked olive foothill
      const ox = (v % 2 ? 1 : -1) * w * 0.44;
      c.fillStyle = '#738c46';
      c.beginPath();
      c.moveTo(x + ox - w * 0.65, y + u * 0.05);
      c.quadraticCurveTo(x + ox, y - h * 0.68, x + ox + w * 0.65, y + u * 0.05);
      c.closePath();
      c.fill();

      // Main Peloponnesian pale-limestone & olive-scrub mountain peak
      const grad = c.createLinearGradient(x - w * 0.4, y - h, x + w * 0.6, y);
      grad.addColorStop(0.00, '#ede7d8');
      grad.addColorStop(0.38, '#cfc6b2');
      grad.addColorStop(0.75, '#829c52');
      grad.addColorStop(1.00, '#5e7a3a');
      c.fillStyle = grad;
      c.beginPath();
      c.moveTo(x - w, y + u * 0.08);
      c.quadraticCurveTo(x - w * 0.28, y - h * 1.02, x, y - h);
      c.quadraticCurveTo(x + w * 0.28, y - h * 1.02, x + w, y + u * 0.08);
      c.quadraticCurveTo(x, y + u * 0.26, x - w, y + u * 0.08);
      c.closePath();
      c.fill();

      // Shaded right limestone face
      c.fillStyle = 'rgba(42, 48, 36, 0.22)';
      c.beginPath();
      c.moveTo(x, y - h);
      c.quadraticCurveTo(x + w * 0.28, y - h * 1.02, x + w, y + u * 0.08);
      c.lineTo(x + w * 0.10, y + u * 0.22);
      c.closePath();
      c.fill();

      // Tiny whitewashed cliffside shrine perched near ridge
      TH.poly(c, [[x - u * 0.22, y - h * 0.66], [x + u * 0.22, y - h * 0.66], [x + u * 0.22, y - h * 0.82], [x - u * 0.22, y - h * 0.82]], '#ffffff');
      TH.poly(c, [[x - u * 0.28, y - h * 0.82], [x + u * 0.28, y - h * 0.82], [x, y - h * 0.94]], GR_BLUE);
    }
  },
  aegeanHill: {
    cat: 'hill', rho: 0.13,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 23 + 3);
      const w = u * (3.6 + r() * 0.6);
      const h = u * (3.6 + r() * 0.7);
      TH.ell(c, x, y + u * 0.08, w * 1.04, u * 0.44, 'rgba(28, 34, 14, .24)');

      const grad = c.createLinearGradient(x - w * 0.4, y - h, x + w * 0.6, y);
      grad.addColorStop(0.0, '#d8d0be');
      grad.addColorStop(0.5, '#8fa858');
      grad.addColorStop(1.0, '#66823e');
      c.fillStyle = grad;
      c.beginPath();
      c.moveTo(x - w, y + u * 0.06);
      c.quadraticCurveTo(x - w * 0.25, y - h * 1.02, x, y - h);
      c.quadraticCurveTo(x + w * 0.25, y - h * 1.02, x + w, y + u * 0.06);
      c.quadraticCurveTo(x, y + u * 0.24, x - w, y + u * 0.06);
      c.closePath();
      c.fill();
    }
  },

  /* ---------- Mediterranean Trees (Gnarled Olive, Tall Cypress, Umbrella Stone Pine) ---------- */
  oliveTree: {
    cat: 'tree', rho: 0.12,
    draw(c, x, y, u, v) {
      // Ancient gnarled silvery-green Mediterranean olive tree
      const r = mulberry(v * 11 + 3), H = u * (3.8 + r() * 0.8);
      GSH(c, x, y, u * 2.0);
      c.strokeStyle = '#5c4b3b';
      c.lineWidth = u * 0.56;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(x, y);
      c.bezierCurveTo(x - u * 0.65, y - H * 0.35, x + u * 0.65, y - H * 0.62, x - u * 0.1, y - H * 0.76);
      c.stroke();

      const cy = y - H * 0.82;
      const oliveCols = ['#7d9c5a', '#94b36e', '#658547', '#a8c482'];
      [[0, -0.25, 1.75, 0.98], [-1.25, 0.06, 1.20, 0.80], [1.25, 0.04, 1.20, 0.80], [-0.55, -0.85, 1.25, 0.82], [0.60, -0.82, 1.20, 0.80]].forEach(([dx, dy, rx, ry], i) => {
        TH.blob(c, x + dx * u, cy + dy * u, u * rx, u * ry, oliveCols[(i + v) % 4], r, 9);
      });
    }
  },
  medCypress: {
    cat: 'tree', rho: 0.08,
    draw(c, x, y, u, v) {
      // Tall slender flame-shaped Mediterranean Cypress
      const r = mulberry(v * 17 + 7), H = u * (6.4 + r() * 1.4);
      GSH(c, x, y, u * 0.95);
      TH.ln(c, [x, y], [x, y - u * 1.1], '#4a3728', u * 0.30);
      const pal = ['#294d2e', '#35613a', '#1f3d24', '#417346'];
      for (let k = 0; k < 9; k++) {
        const t = k / 8;
        const yy = y - u * 1.0 - t * (H - u * 1.3);
        const rx = u * (0.52 + 0.30 * Math.sin(Math.min(1, t * 1.15) * Math.PI * 0.88));
        TH.blob(c, x + (r() - 0.5) * u * 0.16, yy, rx, u * 0.82, pal[k % 4], r, 8);
      }
    }
  },
  umbrellaPine: {
    cat: 'tree', rho: 0.12,
    draw(c, x, y, u, v) {
      // Mediterranean Stone Pine with tall bare trunk & broad flat-topped umbrella crown
      const r = mulberry(v * 23 + 2), H = u * (4.8 + r() * 0.9);
      GSH(c, x, y, u * 2.1);
      c.strokeStyle = '#6b4730';
      c.lineWidth = u * 0.44;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(x + u * 0.3, y - H * 0.5, x - u * 0.1, y - H * 0.88);
      c.stroke();
      const cy = y - H * 0.92;
      TH.blob(c, x, cy, u * 2.15, u * 0.68, '#366639', r, 10);
      TH.blob(c, x - u * 0.55, cy - u * 0.22, u * 1.45, u * 0.52, '#4a8249', r, 9);
      TH.blob(c, x + u * 0.65, cy - u * 0.16, u * 1.35, u * 0.48, '#2b542f', r, 9);
    }
  },
  smallOlive: {
    cat: 'tree', rho: 0.07,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 29 + 1);
      GSH(c, x, y, u * 1.0);
      TH.ln(c, [x, y], [x, y - u * 1.4], '#5c4b3b', u * 0.26);
      TH.blob(c, x, y - u * 1.85, u * 1.05, u * 0.68, v % 2 ? '#7d9c5a' : '#94b36e', r, 8);
    }
  },

  /* ---------- Mediterranean Shrubs & Limestone Boulders ---------- */
  oleanderBush: {
    cat: 'shrub', rho: 0.06,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 5 + 9);
      TH.ell(c, x + u * 0.16, y + u * 0.07, u * 1.05, u * 0.30, 'rgba(28, 34, 14, .24)');
      [[-0.48, -0.36, 0.76, 0.52, '#3d6e3a'], [0.48, -0.36, 0.76, 0.52, '#4d8546'], [0, -0.72, 0.82, 0.56, '#5c9952']].forEach(([dx, dy, rx, ry, col]) => {
        TH.blob(c, x + dx * u, y + dy * u, u * rx, u * ry, col, r, 8);
      });
      for (let k = 0; k < 8; k++) {
        TH.ell(c, x + (r() - 0.5) * u * 1.25, y - u * (0.26 + r() * 0.68), u * 0.11, u * 0.08, k % 2 ? '#f472b6' : '#ffffff');
      }
    }
  },
  limestoneBoulder: {
    cat: 'rock', rho: 0.08,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 13 + 3);
      GSH(c, x, y, u * 1.3);
      TH.poly(c, [[x - u * 1.1, y], [x - u * 0.72, y - u * 0.82], [x + u * 0.28, y - u * 0.92], [x + u * 1.02, y - u * 0.32], [x + u * 0.88, y + u * 0.08]], '#d6cfc0');
      TH.blob(c, x - u * 0.22, y - u * 0.62, u * 0.62, u * 0.24, '#7d9c5a', r, 6);
    }
  },

  /* ---------- Classical Greek Civic Monuments & Temples ---------- */
  doricTemple: {
    cat: 'ruin', rho: 0.14,
    draw(c, x, y, u, v) {
      // Parthenon-inspired Doric Marble Acropolis Temple
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      GFLIP(c, x, v & 1, () => {
        GSH(c, x, y, u * 3.1);
        // 3-stepped marble stylobate platform
        GBOX(c, x, y, u, -1.65, 1.65, -2.35, 2.35, 0, 0.24, GR_MARBLE_D);
        GBOX(c, x, y, u, -1.48, 1.48, -2.18, 2.18, 0.24, 0.46, GR_MARBLE);
        // Inner cella sanctuary wall
        GBOX(c, x, y, u, -0.88, 0.88, -1.45, 1.45, 0.46, 2.75, GR_LIMESTN);

        // Peristyle fluted Doric marble columns around perimeter
        [-1.32, -0.44, 0.44, 1.32].forEach(cxO => {
          TH.ln(c, I(cxO, 2.02, 0.46), I(cxO, 2.02, 2.85), '#ffffff', u * 0.19);
        });
        [-1.95, -1.15, -0.35, 0.45, 1.25, 2.02].forEach(cyO => {
          TH.ln(c, I(1.32, cyO, 0.46), I(1.32, cyO, 2.85), '#e8e2d5', u * 0.19);
        });

        // Entablature architrave & triglyph frieze
        GBOX(c, x, y, u, -1.45, 1.45, -2.15, 2.15, 2.85, 3.32, GR_MARBLE);
        [-1.1, -0.55, 0, 0.55, 1.1].forEach(tx => {
          TH.ln(c, I(tx, 2.16, 2.95), I(tx, 2.16, 3.25), GR_BLUE, u * 0.08);
        });

        // Terracotta roof & sculpted pediment
        drawGreekPedimentRoof(c, I, -1.45, 1.45, -2.15, 2.15, 3.32, 1.05, GR_TERRA, GR_MARBLE, u);
      });
    }
  },
  amphitheater: {
    cat: 'ruin', rho: 0.12,
    draw(c, x, y, u, v) {
      // Epidaurus-inspired semi-circular marble Greek theater
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      GFLIP(c, x, v & 1, () => {
        GSH(c, x, y, u * 2.5);
        // Circular marble orchestra floor
        const pOrch = I(0, 0.45, 0.08);
        TH.ell(c, pOrch[0], pOrch[1], u * 1.45, u * 0.72, GR_MARBLE_D);
        TH.ell(c, pOrch[0], pOrch[1], u * 1.15, u * 0.56, GR_MARBLE);

        // Stepped semi-circular stone seating tiers (theatron)
        [1.95, 1.62, 1.28].forEach((rad, idx) => {
          const zH = 1.35 - idx * 0.38;
          c.strokeStyle = idx % 2 ? GR_MARBLE : GR_LIMESTN;
          c.lineWidth = u * 0.28;
          c.beginPath();
          for (let s = 0; s <= 16; s++) {
            const a = Math.PI + (s / 16) * Math.PI;
            const pt = I(Math.cos(a) * rad, 0.45 + Math.sin(a) * rad, zH);
            s === 0 ? c.moveTo(pt[0], pt[1]) : c.lineTo(pt[0], pt[1]);
          }
          c.stroke();
        });
      });
    }
  },
  stoaColonnade: {
    cat: 'ruin', rho: 0.11,
    draw(c, x, y, u, v) {
      // Covered marble Stoa walkway colonnade
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      GFLIP(c, x, v & 1, () => {
        GSH(c, x, y, u * 2.5);
        GBOX(c, x, y, u, -2.15, 2.15, -0.75, 0.75, 0, 0.26, GR_MARBLE_D);
        GBOX(c, x, y, u, -2.05, 2.05, -0.65, -0.35, 0.26, 2.35, GR_LIMESTN);
        [-1.85, -1.10, -0.35, 0.40, 1.15, 1.85].forEach(cxO => {
          TH.ln(c, I(cxO, 0.58, 0.26), I(cxO, 0.58, 2.35), '#ffffff', u * 0.16);
        });
        drawGreekPedimentRoof(c, I, -2.10, 2.10, -0.70, 0.70, 2.35, 0.78, GR_TERRA, GR_MARBLE, u);
      });
    }
  },
  aegeanPool: {
    cat: 'ruin', rho: 0.11,
    draw(c, x, y, u) {
      TH.ell(c, x, y, u * 2.35, u * 1.05, GR_MARBLE_D);
      TH.ell(c, x, y, u * 2.05, u * 0.88, '#1d6fa5');
      TH.ell(c, x - u * 0.14, y - u * 0.04, u * 1.65, u * 0.68, '#38bdf8');
      // Marble fountain spout in center
      TH.ell(c, x, y - u * 0.06, u * 0.42, u * 0.20, GR_MARBLE);
      TH.ln(c, [x, y - u * 0.06], [x, y - u * 0.72], '#e0f2fe', u * 0.08);
    }
  },
  brokenColumns: {
    cat: 'ruin', rho: 0.09,
    draw(c, x, y, u, v) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      GFLIP(c, x, v & 1, () => {
        GSH(c, x, y, u * 2.1);
        GBOX(c, x, y, u, -1.65, 1.65, -0.65, 0.65, 0, 0.24, GR_MARBLE_D);
        [[-1.1, 2.45], [-0.15, 1.65], [0.95, 2.15]].forEach(([cxO, h]) => {
          TH.ln(c, I(cxO, 0, 0.24), I(cxO, 0, h), '#ffffff', u * 0.24);
          TH.ell(c, ...I(cxO, 0, h), u * 0.14, u * 0.07, GR_MARBLE_D);
        });
        // Broken lintel beam spanning two columns
        GBOX(c, x, y, u, -1.35, 0.05, -0.22, 0.22, 1.65, 2.05, GR_MARBLE);
      });
    }
  },
  tholosRotunda: {
    cat: 'struct', rho: 0.08,
    draw(c, x, y, u, v) {
      // Tier 5 Circular Marble Tholos Sanctuary Tower beside a Peristyle Villa
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      GFLIP(c, x, v & 1, () => {
        GSH(c, x, y, u * 2.1);
        const pB = I(0, 0, 0), pT = I(0, 0, 4.15);
        const r = u * 1.18;
        TH.ell(c, pB[0], pB[1], r * 1.15, r * 0.52, GR_MARBLE_D);
        c.fillStyle = GR_MARBLE;
        c.fillRect(pB[0] - r * 0.85, pT[1], r * 1.7, pB[1] - pT[1]);
        // Ring of white Doric columns around the circular sanctuary
        for (let k = 0; k < 6; k++) {
          const a = (k / 5) * Math.PI;
          const cxO = pB[0] - Math.cos(a) * r * 0.96;
          TH.ln(c, [cxO, pB[1]], [cxO, pT[1]], '#ffffff', u * 0.14);
        }
        // Conical terracotta tile roof & gilded bronze tripod finial
        TH.poly(c, [[pT[0] - r * 1.12, pT[1]], [pT[0] + r * 1.12, pT[1]], [pT[0], pT[1] - u * 1.85]], GR_TERRA, GR_GOLD, u * 0.04);
        TH.ell(c, pT[0], pT[1] - u * 1.95, u * 0.18, u * 0.22, GR_GOLD);
      });
    }
  },

  /* ---------- Residences ---------- */
  greekVilla:     GRHOUSE('greekVilla'),
  peristyleHouse: GRHOUSE('peristyleHouse'),
  aegeanCottage:  GRHOUSE('aegeanCottage'),

  /* ---------- Small Classical Greek Props ---------- */
  amphoraCluster: {
    cat: 'prop', rho: 0.04,
    draw(c, x, y, u) {
      GSH(c, x, y, u * 0.95);
      [[-0.35, 0.05, 1.0, '#c2593a'], [0.35, -0.05, 0.88, '#d97706'], [0.05, 0.22, 0.78, '#9a3412']].forEach(([dx, dy, sc, col]) => {
        const px = x + dx * u, py = y + dy * u;
        TH.ell(c, px, py - u * 0.55 * sc, u * 0.28 * sc, u * 0.44 * sc, col);
        TH.ln(c, [px, py - u * 0.85 * sc], [px, py - u * 1.12 * sc], col, u * 0.14 * sc);
        TH.ell(c, px, py - u * 1.14 * sc, u * 0.14 * sc, u * 0.06 * sc, '#451a03');
      });
    }
  },
  marbleStatue: {
    cat: 'prop', rho: 0.04,
    draw(c, x, y, u) {
      GSH(c, x, y, u * 0.85);
      GBOX(c, x, y, u, -0.5, 0.5, -0.5, 0.5, 0, 0.85, GR_MARBLE_D);
      TH.ln(c, [x, y - u * 0.85], [x, y - u * 2.15], '#ffffff', u * 0.26);
      TH.ell(c, x, y - u * 2.35, u * 0.16, u * 0.18, '#ffffff');
      TH.ln(c, [x + u * 0.25, y - u * 1.15], [x + u * 0.25, y - u * 2.65], GR_GOLD, u * 0.06); // Spear/trident
    }
  },
  bronzeBrazier: {
    cat: 'prop', rho: 0.03,
    draw(c, x, y, u) {
      GSH(c, x, y, u * 0.75);
      GBOX(c, x, y, u, -0.45, 0.45, -0.45, 0.45, 0, 0.75, GR_MARBLE_D);
      TH.ell(c, x, y - u * 0.85, u * 0.42, u * 0.18, '#78350f');
      TH.poly(c, [[x - u * 0.28, y - u * 0.85], [x, y - u * 1.65], [x + u * 0.28, y - u * 0.85]], '#f97316');
      TH.poly(c, [[x - u * 0.14, y - u * 0.85], [x, y - u * 1.35], [x + u * 0.14, y - u * 0.85]], '#fef08a');
    }
  },
  marbleBench: {
    cat: 'prop', rho: 0.05,
    draw(c, x, y, u, v) {
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      GFLIP(c, x, v & 1, () => {
        GSH(c, x, y, u * 1.15);
        GBOX(c, x, y, u, -0.85, -0.55, -0.32, 0.32, 0, 0.48, GR_MARBLE_D);
        GBOX(c, x, y, u,  0.55,  0.85, -0.32, 0.32, 0, 0.48, GR_MARBLE_D);
        GBOX(c, x, y, u, -0.95,  0.95, -0.38, 0.38, 0.48, 0.68, GR_MARBLE);
      });
    }
  }
};

/* ===== MACRO-LAND ENGINE (hex geometry, planner, 5-tier baker) ===== */
const W3 = Math.sqrt(3), HX = W3 / 2, HV = [[HX, 0.29], [0, 0.58], [-HX, 0.29], [-HX, -0.29], [0, -0.58], [HX, -0.29]];
const LAND_ROWS = {
  A: [[-1, 0, 1], [-1.5, -0.5, 0.5, 1.5], [-1, 0, 1], [-0.5, 0.5]],
  B: [[0, 1, 2], [-0.5, 0.5, 1.5], [-1, 0, 1], [-0.5, 0.5, 1.5]],
  C: [[0], [-0.5, 0.5, 1.5], [-1, 0, 1], [-0.5]],
  D: [[0, 1, 2], [-0.5, 0.5, 1.5], [0, 1]]
};
const LAND_KEEP = { rx: 0.52, ry: 0.34 };
const vkey = p => p[0].toFixed(3) + ',' + p[1].toFixed(3);
function hexInside(dx, dy, s) {
  const ax = Math.abs(dx) / s, ay = Math.abs(dy) / s;
  return ax <= HX && ay <= 0.58 - 0.3349 * ax;
}

function landGeometry(shape) {
  const centers = [];
  LAND_ROWS[shape].forEach((row, r) => row.forEach((u, i) => centers.push({ x: u * W3, y: r * 0.87, row: r, col: i })));
  const edges = new Map(), verts = new Map();
  centers.forEach((c, ci) => {
    for (let k = 0; k < 6; k++) {
      const a = [c.x + HV[k][0], c.y + HV[k][1]], b = [c.x + HV[(k + 1) % 6][0], c.y + HV[(k + 1) % 6][1]];
      const ka = vkey(a), kb = vkey(b), ek = ka < kb ? ka + '|' + kb : kb + '|' + ka;
      let e = edges.get(ek);
      if (!e) { e = { a, b, ka, kb, hexes: [] }; edges.set(ek, e); }
      e.hexes.push(ci);
      [[ka, a], [kb, b]].forEach(([kk, p]) => {
        let v = verts.get(kk);
        if (!v) { v = { k: kk, x: p[0], y: p[1], hexes: new Set() }; verts.set(kk, v); }
        v.hexes.add(ci);
      });
    }
  });
  const E = [...edges.values()].map(e => {
    const mid = [(e.a[0] + e.b[0]) / 2, (e.a[1] + e.b[1]) / 2], len = Math.hypot(e.b[0] - e.a[0], e.b[1] - e.a[1]), vertical = Math.abs(e.a[0] - e.b[0]) < 1e-6;
    let n = null, cls = null;
    if (e.hexes.length === 1) {
      const c = centers[e.hexes[0]];
      let nx = mid[0] - c.x, ny = mid[1] - c.y;
      const m = Math.hypot(nx, ny);
      n = [nx / m, ny / m];
      cls = n[1] < -0.4 ? 'top' : n[1] > 0.4 ? 'bottom' : 'side';
    }
    return Object.assign(e, { mid, len, vertical, outer: e.hexes.length === 1, n, cls });
  });
  const V = [...verts.values()].map(v => Object.assign(v, { junction: v.hexes.size >= 3 }));
  const xs = [], ys = [];
  centers.forEach(c => { xs.push(c.x - HX, c.x + HX); ys.push(c.y - 0.58, c.y + 0.58); });
  return { centers, edges: E, verts: V, bbox: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) } };
}

/* ---- generic 5-tier baker ---- */

function bakeLandTheme(T, shape, tier, R, opts) {
  opts = opts || {};
  const sc = opts.scale || getBakeScale();
  const m = opts.mirrorX ? -1 : 1;
  const ground = opts.ground || T.groundCol;
  const clr = (opts.clear || []).map(p => [Math.min(p[0], p[1]), Math.max(p[0], p[1])]);
  const key = [T.id, shape, tier, R, m, ground, sc, JSON.stringify(clr), JSON.stringify(opts.clearTiles || [])].join('|');
  const cached = revisedLandCache.get(key); if (cached) return cached;

  const plan = T.plan(shape), G = plan.G, bb = G.bbox;
  const x0 = m > 0 ? bb.minX : -bb.maxX, x1 = m > 0 ? bb.maxX : -bb.minX;
  const mx = 0.75, top = T.top || 1.85, bot = 0.85;
  const W = Math.ceil((x1 - x0 + 2 * mx) * R), H = Math.ceil((bb.maxY - bb.minY + top + bot) * R);
  const ox = (-x0 + mx) * R, oy = (-bb.minY + top) * R, u = R * 0.075;

  const mk = () => {
    const cv = document.createElement('canvas');
    cv.width = Math.ceil(W * sc);
    cv.height = Math.ceil(H * sc);
    const g = cv.getContext('2d');
    g.scale(sc, sc);
    return [cv, g];
  };
  const [back, cb] = mk();
  T.ground(cb, G, R, ox, oy, m, ground, ({ A: 2101, B: 3202, C: 4303, D: 5404 })[shape]);
  const bridges = clr.map(([i, j]) => [G.centers[i], G.centers[j]]);
  const vis = plan.objs.filter(o => o.tier <= tier && tier <= o.maxT && !bridges.some(([a, c]) => westCapsuleHit(a, c, o.x, o.y, o.rho)) && !(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));

  const sprites = vis.map(o => {
    const asset = T.assets[o.kind], base = u * (o.scale || 1);
    const reach = Math.max(asset.reach || 4, (asset.tall || 9) * 0.45);
    const span = [o.p1, o.p2].filter(Boolean).reduce((max, p) =>
      Math.max(max, Math.abs(p[0] - o.x) * R / 8, Math.abs(p[1] - o.y) * R / 4), 0);
    const unit = Math.max(base, base * reach / 8, span);
    return { x: m * o.x * R, y: o.y * R, unit, draw: (ctx, x, y) => {
      ctx.save();
      ctx.translate(x - (ox + m * o.x * R), y - (oy + o.y * R));
      T.assets[o.kind].draw(ctx,ox+m*o.x*R,oy+o.y*R,u*(o.scale||1),o.v);
      ctx.restore();
    }};
  });
  const front = document.createElement('canvas');
  front.width = front.height = 1;
  const frontRect = {x: 0, y: 0, w: 1, h: 1};
  const centers = G.centers.map(c => ({x: ox + m * c.x * R, y: oy + c.y * R, row: c.row}));
  return revisedLandCache.set(key, {back, front, frontRect, w: W, h: H, ox, oy, centers, sc, shape, tier, mirrorX: m < 0, sprites});
}

function westCapsuleHit(a, b, x, y, rho) {
  const A = LAND_KEEP.rx + rho * 0.55, B = LAND_KEEP.ry + rho * 0.28;
  const dx = b.x - a.x, dy = b.y - a.y, px = x - a.x, py = y - a.y;
  const q = dx * dx / (A * A) + dy * dy / (B * B);
  const t = Math.max(0, Math.min(1, (px * dx / (A * A) + py * dy / (B * B)) / q));
  const ex = (px - t * dx) / A, ey = (py - t * dy) / B;
  return ex * ex + ey * ey < 1;
}

/* ===== ANCIENT GREECE LAND PLANNER & MEDITERRANEAN FLOOR ===== */
const GREECE_REGION = {
  top:    { medCypress: .30, oliveTree: .28, umbrellaPine: .24, smallOlive: .18 },
  mid:    { oliveTree: .34, medCypress: .26, umbrellaPine: .22, smallOlive: .18 },
  bottom: { oliveTree: .34, smallOlive: .26, umbrellaPine: .22, medCypress: .18 }
};
const GREECE_LOW = [['smallOlive', 1.05], ['oliveTree', 0.72], ['umbrellaPine', 0.68], ['smallOlive', 0.88], ['medCypress', 0.65]];
const GREECE_CAP = { medCypress: 12, umbrellaPine: 10, oliveTree: 14 };
const GREECE_UNDER = ['oleanderBush', 'limestoneBoulder', 'oleanderBush', 'limestoneBoulder'];
const GREECE_PLAN_CACHE = {};

function getGreecePlan(shape) {
  if (GREECE_PLAN_CACHE[shape]) return GREECE_PLAN_CACHE[shape];
  const G = landGeometry(shape), rng = mulberry(({ A: 1401, B: 2502, C: 3603, D: 4704 })[shape]);
  const placed = [], bb = G.bbox, used = {}, A = GREECE_ASSETS;
  const cx = G.centers.reduce((a, c) => a + c.x, 0) / G.centers.length;
  const cy = G.centers.reduce((a, c) => a + c.y, 0) / G.centers.length;

  const inLand = (x, y, pad = 1.06) => G.centers.some(c => hexInside(x - c.x, y - c.y, pad));
  const free = (x, y, rho) => G.centers.every(c => {
    const dx = (x - c.x) / (LAND_KEEP.rx + rho * 0.42), dy = (y - c.y) / (LAND_KEEP.ry + rho * 0.26);
    return dx * dx + dy * dy >= 1;
  });
  const clearOthers = (x, y, rho) => placed.every(o => Math.hypot(x - o.x, (y - o.y) * 1.7) >= (rho + o.rho * (o.clear || 1)) * 0.68);
  const pickFrom = (w, ok) => {
    for (let g = 0; g < 12; g++) {
      let t = rng(), acc = 0, pick = Object.keys(w)[0];
      for (const k in w) { acc += w[k]; if (t <= acc) { pick = k; break; } }
      if (!ok || ok(pick)) return pick;
    }
    return 'oliveTree';
  };
  const capOk = k => !(GREECE_CAP[k] && (used[k] || 0) >= GREECE_CAP[k]);
  const regionOf = y => {
    const n = (y - bb.minY) / (bb.maxY - bb.minY);
    return n < 0.34 ? GREECE_REGION.top : n < 0.68 ? GREECE_REGION.mid : GREECE_REGION.bottom;
  };

  const place = (kind, x, y, extra) => {
    const D = A[kind], sc = (extra && extra.scale) || (D.cat === 'tree' ? 0.86 + rng() * 0.34 : D.cat === 'shrub' ? 0.88 + rng() * 0.28 : 1), rho = D.rho * sc;
    const maxPad = (extra && extra.pad) || ((D.cat === 'struct' || D.cat === 'ruin' || D.cat === 'hill') ? 0.95 : 1.05);
    for (let t = 0; t < 8; t++) {
      const px = x + (t ? (rng() - 0.5) * 0.10 * t : 0), py = y + (t ? (rng() - 0.5) * 0.08 * t : 0);
      if (!inLand(px, py, maxPad) || !free(px, py, rho) || !clearOthers(px, py, rho)) continue;
      if ((D.cat === 'tree' || D.cat === 'shrub' || D.cat === 'prop') && placed.some(o => o.noSouth && Math.abs(px - o.x) < 0.3 && py - o.y > -0.05 && py - o.y < 0.36)) continue;
      const o = Object.assign({ kind, x: px, y: py, rho, scale: sc, v: Math.floor(rng() * 1000), cat: D.cat, pri: rng(), minT: 1, maxT: 5 }, extra || {});
      o.scale = sc;
      placed.push(o);
      used[kind] = (used[kind] || 0) + 1;
      return o;
    }
    return null;
  };

  const tree = (x, y, extra, dom, low) => {
    if (low) {
      const L = GREECE_LOW[Math.floor(rng() * GREECE_LOW.length)];
      return place(L[0], x, y, Object.assign({}, extra || {}, { scale: L[1] * (0.9 + rng() * 0.2) }));
    }
    return place(dom && rng() < 0.55 && capOk(dom) ? dom : pickFrom(regionOf(y), capOk), x, y, extra || {});
  };
  const under = (x, y, extra) => place(GREECE_UNDER[Math.floor(rng() * GREECE_UNDER.length)], x, y, extra || {});

  const outer = G.edges.filter(e => e.outer), top = outer.filter(e => e.cls === 'top'), sides = outer.filter(e => e.cls === 'side'), interior = G.edges.filter(e => !e.outer);
  const KS = G.centers.length / 12;
  const thin = l => { const n = Math.max(1, Math.round(l.length * KS)); return Array.from({ length: n }, (_, i) => l[Math.floor((i + 0.5) * l.length / n)]); };
  const cnt = n => Math.max(1, Math.round(n * KS));
  const onEdge = (e, t, off) => [e.a[0] + (e.b[0] - e.a[0]) * t + e.n[0] * off, e.a[1] + (e.b[1] - e.a[1]) * t + e.n[1] * off];

  // 1. Rear Peloponnesian & Olympus Karst Limestone Hills along top rim
  {
    const hillSpots = [];
    top.forEach(e => [0.20, 0.42, 0.62, 0.82].forEach(t => hillSpots.push(onEdge(e, t, -0.16))));
    hillSpots.sort((a, b) => a[0] - b[0]);
    const targetHills = G.centers.length >= 12 ? 4 : 3;
    const placedHills = [];
    for (let h = 0; h < targetHills; h++) {
      const idx = Math.floor(((h + 0.5) / targetHills) * hillSpots.length);
      const cand = hillSpots[idx];
      if (!cand) continue;
      if (placedHills.some(q => Math.hypot(q[0] - cand[0], (q[1] - cand[1]) * 1.5) < 0.65)) continue;
      const isCenter = (h === Math.floor(targetHills / 2));
      const kind = isCenter ? 'olympusCrag' : 'aegeanHill';
      const ho = place(kind, cand[0], cand[1] + 0.08, {
        minT: isCenter ? 1 : 2,
        scale: isCenter ? (1.12 + rng() * 0.14) : (1.02 + rng() * 0.18),
        clear: 1.2,
        noSouth: true,
        pad: 0.94
      });
      if (ho) placedHills.push([ho.x, ho.y]);
    }
  }

  // 2. Classical Greek Residences (Villas, Peristyle Houses, Aegean Cottages) + Tier 5 Tholos Rotunda
  const rim = [], inn = [];
  sides.concat(outer.filter(e => e.cls === 'bottom')).forEach(e => [0.3, 0.7].forEach(t => rim.push(onEdge(e, t, -0.06))));
  G.verts.filter(v => v.junction).forEach(v => inn.push([v.x, v.y]));
  interior.filter(e => e.vertical).forEach(e => inn.push([e.mid[0], e.mid[1]]));

  const chosen = placed.filter(o => o.cat === 'ruin' || o.cat === 'struct' || o.cat === 'hill').map(o => [o.x, o.y]), villas = [];
  const spread = (k, pool, extra) => {
    const ranked = pool.map(p => ({ p, d: Math.min(1e9, ...chosen.map(q => Math.hypot(p[0] - q[0], (p[1] - q[1]) * 1.4))) + rng() * 0.22 })).sort((a, b) => b.d - a.d);
    for (let n = 0; n < Math.min(12, ranked.length); n++) {
      const o = place(k, ranked[n].p[0], ranked[n].p[1], extra);
      if (o) {
        chosen.push([o.x, o.y]);
        if (k === 'peristyleHouse') villas.push(o);
        return o;
      }
    }
    return null;
  };

  thin([
    ['greekVilla', 1],
    ['aegeanCottage', 2],
    ['peristyleHouse', 3],
    ['greekVilla', 4],
    ['aegeanCottage', 4],
    ['peristyleHouse', 5]
  ]).forEach(([k, mt]) => spread(k, rim, { minT: mt, scale: 1.05, clear: 2.3, noSouth: true, pad: 0.95 }));

  thin([
    ['aegeanCottage', 2],
    ['peristyleHouse', 3],
    ['greekVilla', 3],
    ['aegeanCottage', 4],
    ['greekVilla', 5],
    ['peristyleHouse', 5]
  ]).forEach(([k, mt]) => spread(k, inn, { minT: mt, scale: 1.0, clear: 2.8, noSouth: true, pad: 0.96 }));

  {
    const home = villas[villas.length - 1] || placed.find(o => o.cat === 'struct');
    if (home) {
      for (const [dx, dy] of [[0.36, -0.06], [-0.36, -0.06], [0.30, 0.10], [-0.30, 0.10], [0.42, 0.0], [-0.42, 0.0]]) {
        const o = place('tholosRotunda', home.x + dx, home.y + dy, { minT: 5, scale: 1.0, clear: 2.3, noSouth: true, pad: 0.95 });
        if (o) break;
      }
    }
  }

  // 2b. Classical Greek Civic & Acropolis Monuments (Doric Temple, Amphitheater, Stoa, Aegean Pool, Broken Columns)
  thin([
    ['brokenColumns', 1],
    ['doricTemple', 2],
    ['aegeanPool', 2],
    ['stoaColonnade', 3],
    ['amphitheater', 3],
    ['brokenColumns', 4],
    ['doricTemple', 4],
    ['amphitheater', 5]
  ]).forEach(([k, mt]) => spread(k, rim.concat(inn), { minT: mt, scale: k === 'doricTemple' || k === 'amphitheater' ? 1.05 : 1.0, clear: 1.6, noSouth: true, pad: 0.96 }));

  // 3. Mediterranean Olive & Cypress Grove Canopy
  G.verts.filter(v => v.junction).forEach(v => {
    const dom = pickFrom(regionOf(v.y), capOk), n = 2 + Math.floor(rng() * 1.9);
    for (let k = 0; k < n; k++) {
      const a = rng() * 6.283, r = k ? 0.12 + rng() * 0.09 : 0.02;
      tree(v.x + Math.cos(a) * r, v.y + Math.sin(a) * r * 0.8, null, dom);
    }
  });
  G.edges.filter(e => !e.outer && e.vertical).forEach(e => {
    const dom = pickFrom(regionOf(e.mid[1]), capOk);
    [-0.27, 0, 0.27].forEach(dy => { if (rng() < 0.72) tree(e.mid[0] + (rng() - 0.5) * 0.2, e.mid[1] + dy, null, dom); });
  });
  G.edges.filter(e => !e.outer && !e.vertical).forEach(e => {
    if (rng() < 0.72) tree(e.mid[0] + (rng() - 0.5) * 0.2, e.mid[1] + (rng() - 0.5) * 0.1, { scale: 0.8 + rng() * 0.2 }, null, true);
    if (rng() < 0.22) tree(e.mid[0] + (rng() - 0.5) * 0.34, e.mid[1] + (rng() - 0.5) * 0.14, { scale: 0.78 + rng() * 0.2 }, null, true);
  });
  {
    const ordered = outer.slice().sort((a, b) => Math.atan2((a.mid[1] - cy) * 1.7, a.mid[0] - cx) - Math.atan2((b.mid[1] - cy) * 1.7, b.mid[0] - cx)), samples = [];
    ordered.forEach(e => {
      const nS = Math.max(2, Math.round(e.len / 0.26));
      for (let s = 0; s < nS; s++) samples.push({ e, p: onEdge(e, (s + 0.5) / nS + (rng() - 0.5) * 0.08, -0.08 + rng() * 0.10) });
    });
    let mode = 'grove', run = 0, dom = 'oliveTree';
    samples.forEach(s => {
      if (run <= 0) {
        const r = rng();
        mode = r < 0.74 ? 'grove' : r < 0.92 ? 'sparse' : 'open';
        run = 2 + Math.floor(rng() * 4);
        dom = pickFrom(regionOf(s.p[1]), capOk);
      }
      run--;
      const e = s.e, low = e.cls === 'bottom' || (e.cls === 'side' && s.p[1] > cy + 0.25), p = s.p;
      if (mode === 'grove') {
        tree(p[0], p[1], null, dom, low);
        if (rng() < 0.55) tree(p[0] + (rng() - 0.5) * 0.26, p[1] - 0.09, null, dom, low);
        if (rng() < 0.2)  tree(p[0] + (rng() - 0.5) * 0.26, p[1] + 0.08, null, dom, true);
        if (rng() < 0.14) tree(p[0] + (rng() - 0.5) * 0.28, p[1] - 0.16, null, dom, low);
      } else if (mode === 'sparse') {
        if (rng() < 0.5) tree(p[0], p[1], null, dom, low); else under(p[0], p[1]);
      } else if (rng() < 0.6) under(p[0], p[1]);
    });
  }
  G.verts.filter(v => !v.junction && v.hexes.size <= 2).forEach(v => {
    if (rng() < 0.8) tree(v.x + (rng() - 0.5) * 0.10, v.y + (rng() - 0.5) * 0.08, null, null, v.y > cy + 0.3);
  });
  G.centers.forEach(c => {
    for (let k = 0; k < 14; k++) {
      const px = c.x + (rng() * 2 - 1) * HX, py = c.y + (rng() * 2 - 1) * 0.58;
      if (!hexInside(px - c.x, py - c.y, 0.98)) continue;
      if (rng() < 0.38) tree(px, py, { scale: 0.8 + rng() * 0.25 }, null, py > cy + 0.35);
    }
  });

  // Balance outer rim tree density
  {
    const dEdge = (x, y, e) => {
      const dx = e.b[0] - e.a[0], dy = e.b[1] - e.a[1];
      const t = Math.max(0, Math.min(1, ((x - e.a[0]) * dx + (y - e.a[1]) * dy) / (dx * dx + dy * dy)));
      return Math.hypot(x - (e.a[0] + dx * t), (y - (e.a[1] + dy * t)) * 1.4);
    };
    const classes = ['top', 'side', 'bottom'], len = { top: 0, side: 0, bottom: 0 };
    outer.forEach(e => len[e.cls] += e.len);
    const members = () => {
      const m = { top: [], side: [], bottom: [] };
      placed.filter(o => o.cat === 'tree').forEach(o => {
        let best = null, bd = 1e9;
        outer.forEach(e => { const d = dEdge(o.x, o.y, e); if (d < bd) { bd = d; best = e; } });
        if (bd < 0.32) m[best.cls].push(o);
      });
      return m;
    };
    let m = members();
    const mean = (m.top.length + m.side.length + m.bottom.length) / (len.top + len.side + len.bottom);
    classes.forEach(cl => {
      const target = Math.round(len[cl] * mean);
      let list = m[cl];
      if (list.length > target + 1) {
        const drop = list.length - target;
        for (let i = 0; i < drop; i++) {
          const pick = list.splice(Math.floor(rng() * list.length), 1)[0], ix = placed.indexOf(pick);
          if (ix >= 0) placed.splice(ix, 1);
        }
      } else if (list.length < target - 1) {
        const need = target - list.length, es = outer.filter(e => e.cls === cl);
        let added = 0, guard = 0;
        while (added < need && guard++ < 160) {
          const e = es[Math.floor(rng() * es.length)], p = onEdge(e, rng(), -0.08 + rng() * 0.10);
          if (tree(p[0], p[1], null, null, cl !== 'top')) added++;
        }
      }
    });
  }

  // 4. Oleander Shrubs & Pale Limestone Boulders
  G.verts.filter(v => v.junction).forEach(v => { if (rng() < 0.45) under(v.x + (rng() - 0.5) * 0.2, v.y + (rng() - 0.5) * 0.12); });
  interior.forEach(e => { if (rng() < 0.35) under(e.mid[0] + (rng() - 0.5) * 0.24, e.mid[1] + (rng() - 0.5) * 0.12); });
  outer.forEach(e => { if (rng() < 0.38) under(...onEdge(e, rng(), -0.03)); });
  G.centers.forEach(c => {
    for (let k = 0; k < 5; k++) {
      const px = c.x + (rng() * 2 - 1) * HX, py = c.y + (rng() * 2 - 1) * 0.58;
      if (hexInside(px - c.x, py - c.y, 0.96) && rng() < 0.3) under(px, py);
    }
  });

  // 5. Classical Greek Props (Amphorae, Marble Statues, Bronze Braziers, Marble Benches)
  [['amphoraCluster', 3], ['marbleStatue', 2], ['bronzeBrazier', 2], ['marbleBench', 2]].forEach(([k, n]) => {
    for (let i = 0; i < cnt(n); i++) {
      const e = outer[Math.floor(rng() * outer.length)], p = onEdge(e, 0.15 + rng() * 0.7, -0.04 + rng() * 0.06);
      place(k, p[0], p[1], { minT: 1, maxT: 4, prop: true });
    }
  });
  let pi = 0;
  placed.filter(o => o.prop).forEach(o => { o.minT = pi++ < 4 ? 1 : 2; });

  // Cycle residences through all 4 isometric facings
  {
    const houses = placed.filter(o => /^(greekVilla|peristyleHouse|aegeanCottage)$/.test(o.kind)).sort((a, b) => a.x - b.x || a.y - b.y);
    const cyc = [0, 3, 1, 2];
    houses.forEach((o, i) => { o.v = ((o.v >> 2) << 2) | cyc[i % 4]; });
    placed.filter(o => o.kind === 'tholosRotunda' || o.kind === 'doricTemple').forEach(o => { o.v = ((o.v >> 2) << 2) | (rng() < 0.5 ? 1 : 0); });
  }

  // Assign 5-tier thresholds (`1` Sparse -> `5` Immersive)
  const cuts = {
    tree:   [0.14, 0.34, 0.56, 0.78, 1.0],
    shrub:  [0.05, 0.24, 0.48, 0.74, 1.0],
    rock:   [0.18, 0.40, 0.65, 0.85, 1.0],
    prop:   [1, 1, 1, 1, 1],
    struct: [0, 0, 0, 0, 0],
    ruin:   [0, 0, 0, 0, 0],
    hill:   [0, 0, 0, 0, 0]
  };
  placed.forEach(o => {
    const c = cuts[o.cat] || cuts.tree;
    let t = 1;
    while (t < 5 && o.pri > c[t - 1]) t++;
    o.tier = Math.max(t, o.minT);
    if (o.cat === 'prop' || o.cat === 'struct' || o.cat === 'ruin' || o.cat === 'hill') o.tier = o.minT;
  });

  // Maintain lush Mediterranean olive/cypress grove ratio (>= 64%)
  const count = t => {
    const vis = placed.filter(o => o.tier <= t && t <= o.maxT);
    const tr = vis.filter(o => o.cat === 'tree').length;
    return { n: vis.length, tr };
  };
  for (let t = 1; t <= 5; t++) {
    let guard = 0;
    while (guard++ < 320) {
      const c = count(t);
      if (c.tr / Math.max(1, c.n) >= 0.64) break;
      const pool = placed.filter(o => o.tier <= t && t <= o.maxT);
      const cand = (pool.filter(o => o.cat === 'shrub').sort((a, b) => b.pri - a.pri)[0]) ||
                   (pool.filter(o => o.prop && o.minT > 1).sort((a, b) => b.pri - a.pri)[0]);
      if (!cand) break;
      cand.tier = Math.min(6, cand.tier + 1);
    }
  }

  placed.forEach(o => {
    const over = G.centers.filter(c => Math.abs(o.x - c.x) < 1.0);
    o.layer = over.length && o.y > Math.max(...over.map(c => c.y)) + 0.05 ? 'front' : 'back';
  });
  placed.sort((a, b) => a.y - b.y);
  return (GREECE_PLAN_CACHE[shape] = { G, objs: placed, rng });
}

/* ---- Sun-Drenched Mediterranean Olive Meadow, Limestone Paths & Terracotta Flecks ---- */
function greeceGround(c, G, R, ox, oy, m, col, seed) {
  const poly = i => HV.map(v => [ox + m * (G.centers[i].x + v[0]) * R, oy + (G.centers[i].y + v[1]) * R]);
  const r = mulberry(seed), outer = G.edges.filter(e => e.outer), P = p => [ox + m * p[0] * R, oy + p[1] * R];

  c.save();
  c.lineJoin = 'round';
  c.lineCap = 'round';
  for (let i = 1; i <= 6; i++) {
    c.globalAlpha = 0.11 - i * 0.014;
    c.strokeStyle = col;
    c.lineWidth = R * 0.06 * i;
    c.beginPath();
    outer.forEach(e => { const a = P(e.a), b = P(e.b); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); });
    c.stroke();
  }
  c.globalAlpha = 1;
  G.centers.forEach((_, i) => TH.poly(c, poly(i), col, col, 2));

  c.save();
  c.beginPath();
  G.centers.forEach((_, i) => {
    poly(i).forEach((p, k) => k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
    c.closePath();
  });
  c.clip();

  const bx = [ox + Math.min(m * G.bbox.minX, m * G.bbox.maxX) * R, oy + G.bbox.minY * R, (G.bbox.maxX - G.bbox.minX) * R, (G.bbox.maxY - G.bbox.minY) * R];
  const pt = () => [bx[0] + r() * bx[2], bx[1] + r() * bx[3]];
  const soft = (x, y, rx, ry, rgb, a) => {
    c.save();
    c.translate(x, y);
    c.scale(1, ry / rx);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, `rgba(${rgb},${a})`);
    g.addColorStop(0.6, `rgba(${rgb},${a * 0.55})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    c.fillStyle = g;
    c.beginPath();
    c.arc(0, 0, rx, 0, 7);
    c.fill();
    c.restore();
  };

  // Warm sun-baked olive meadow & golden summer grass tones
  for (let k = 0; k < 48; k++) {
    const p = pt(), w = R * (0.42 + r() * 0.85);
    soft(p[0], p[1], w, w * 0.4, r() < 0.55 ? '174, 186, 98' : '96, 128, 62', r() < 0.55 ? 0.24 : 0.22);
  }
  // Crushed pale limestone & ochre Agora footpath patches
  for (let k = 0; k < 14; k++) {
    const p = pt(), w = R * (0.28 + r() * 0.45);
    soft(p[0], p[1], w, w * 0.4, '228, 216, 188', 0.26);
  }
  // White marble & limestone path stepping stones
  for (let k = 0; k < 34; k++) {
    const p = pt();
    TH.ell(c, p[0], p[1], R * (0.025 + r() * 0.015), R * 0.014, 'rgba(244, 239, 230, 0.62)');
  }
  // Mediterranean dry grass & wild herb tufts
  for (let k = 0; k < 150; k++) {
    const p = pt(), h = R * (0.045 + r() * 0.055);
    for (let j = 0; j < 3; j++) {
      TH.ln(c, [p[0], p[1]], [p[0] + (j - 1) * h * 0.5, p[1] - h], ['#78964c', '#98b062', '#b5bd74'][(k + j) % 3], R * 0.011);
    }
  }

  c.restore();
  c.restore();
}

const GREECE_THEME = { id: 'greece', assets: GREECE_ASSETS, plan: getGreecePlan, ground: greeceGround, groundCol: '#8aa054', top: 1.95 };
const GREECE_TIER_NAMES = ['Sparse', 'Light', 'Medium', 'Heavy', 'Immersive'];
function bakeLandGreece(shape, tier, R, opts) { return bakeLandTheme(GREECE_THEME, shape, tier, R, opts); }
function drawLandGreeceBack(ctx, x, y, land) { ctx.drawImage(land.back, x - land.ox, y - land.oy, land.w, land.h); }
function drawLandGreeceFront(ctx, x, y, land) { const r = land.frontRect; ctx.drawImage(land.front, x - land.ox + r.x, y - land.oy + r.y, r.w, r.h); }
function landGreeceSlots(land, R) { return land.centers.map(c => ({ x: c.x, y: c.y, rx: LAND_KEEP.rx * R, ry: LAND_KEEP.ry * R })); }
return Object.freeze({ bake: (shape, tier, radius, opts) => bakeLandGreece(shape, tier === 4 ? 5 : tier, radius, opts), drawBack: drawLandGreeceBack, drawFront: (ctx, x, y, land) => land.sprites.slice().sort((a,b) => a.y-b.y).forEach(s => drawScenicSprite(ctx,s,x+s.x,y+s.y)) });
})(),
  rome: (() => {
/* ===== THEME PACK CORE (shared by every theme pack; copy once into engine.js) ===== */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shade(hex, amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=c=>Math.max(0,Math.min(255,Math.round(amt<0?c*(1+amt):c+(255-c)*amt)));return `rgb(${f(r)},${f(g)},${f(b)})`;}
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
    ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x+rx*0.35,y+ry*0.25,rx*0.4,ry*0.5,0,0,7);ctx.fill();}
};

/* ===== ANCIENT ROME ASSET LIBRARY (Darker & Warmer Tuscan/Imperial Tones) ===== */
const RSH = (c, x, y, rx) => {
  c.fillStyle = 'rgba(22, 24, 10, .32)';
  c.beginPath();
  c.ellipse(x + rx * 0.24, y + rx * 0.1, rx, rx * 0.36, 0, 0, 7);
  c.fill();
};
const RFLIP = (c, x, f, fn) => {
  if (f) {
    c.save();
    c.translate(x, 0);
    c.scale(-1, 1);
    c.translate(-x, 0);
    fn();
    c.restore();
  } else fn();
};
const RBOX = (c, x, y, u, x0, x1, y0, y1, z0, z1, col) => TH.box(c, x, y, u, x0, x1, y0, y1, z0, z1, col, shade(col, -0.28), shade(col, 0.12));

// Warmer, Deeper Imperial Roman Palette
const RM_TRAV    = '#dfd0b4'; // Warm cream-ochre Roman travertine stone
const RM_TRAV_D  = '#b8a482';
const RM_OCHRE   = '#d49a54'; // Warm Roman golden-ochre stucco
const RM_POMPEII = '#9e3324'; // Deep Pompeian red wall dado & civic trim
const RM_TILE    = '#a64126'; // Rich burnt-terracotta tegula roof tiles
const RM_PURPLE  = '#5b2147'; // Imperial Tyrian purple accent
const RM_GOLD    = '#d98a1c'; // Burnished Roman bronze-gold
const RM_VERD    = '#2f7a66'; // Patinated bronze dome

// Helper: Roman Terracotta Tegula & Imbrex Gable Roof with Heavy Cornice
function drawRomanTileRoof(c, L, a0, a1, b0, b1, zBase, rise, tileCol, pedCol, u) {
  const am = (a0 + a1) * 0.5;
  const ov = 0.24;
  const eFL = L(a0 - ov, b1 + ov, zBase);
  const eFR = L(a1 + ov, b1 + ov, zBase);
  const eBR = L(a1 + ov, b0 - ov, zBase);
  const eBL = L(a0 - ov, b0 - ov, zBase);
  const rF  = L(am, b1 + ov, zBase + rise);
  const rB  = L(am, b0 - ov, zBase + rise);

  TH.poly(c, [eBL, eFL, rF, rB], shade(tileCol, 0.14));
  TH.poly(c, [eFR, eBR, rB, rF], tileCol);

  const nRibs = 8;
  for (let k = 1; k < nRibs; k++) {
    const t = k / nRibs;
    const tb = b0 - ov + (b1 - b0 + 2 * ov) * t;
    TH.ln(c, L(am, tb, zBase + rise), L(a1 + ov, tb, zBase), 'rgba(42, 14, 6, 0.34)', u * 0.048);
  }

  TH.poly(c, [L(a0 - 0.06, b1 + 0.02, zBase), L(a1 + 0.06, b1 + 0.02, zBase), L(am, b1 + 0.02, zBase + rise)], pedCol || RM_TRAV);
  TH.poly(c, [L(a0 + 0.16, b1 + 0.03, zBase + 0.12), L(a1 - 0.16, b1 + 0.03, zBase + 0.12), L(am, b1 + 0.03, zBase + rise - 0.16)], shade(pedCol || RM_TRAV, -0.16));
  TH.ln(c, rB, rF, shade(tileCol, 0.26), u * 0.12);
  TH.ell(c, rF[0], rF[1] - u * 0.12, u * 0.11, u * 0.15, RM_GOLD);
}

/* ---- Roman Domus, Patrician Villas & Multi-Story Insulae ---- */
const RMHOUSE_T = {
  romanDomus:     { ha: 1.26, hb: 1.86, h1: 1.85, h2: 0, wall: RM_OCHRE, dado: RM_POMPEII, tile: RM_TILE, rise: 1.00, portico: true, sw: 3.2, sh: 0.95 },
  romanInsula:    { ha: 1.32, hb: 1.90, h1: 1.65, h2: 1.45, wall: RM_TRAV, dado: '#8c3526', tile: '#963820', rise: 1.05, twoStory: true, sw: 3.4, sh: 1.0 },
  patricianVilla: { ha: 1.20, hb: 1.72, h1: 1.75, h2: 0, wall: '#e8d6b3', dado: RM_PURPLE, tile: RM_TILE, rise: 0.98, sw: 3.1, sh: 0.93 }
};

function RMHOUSE_BODY(c, x, y, u, s, eave, T) {
  const Iw = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
  const L  = (a, b, z) => eave ? Iw(b, a, z) : Iw(a, b, z);
  const LBOX = (a0, a1, b0, b1, z0, z1, col) => eave ? RBOX(c, x, y, u, b0, b1, a0, a1, z0, z1, col) : RBOX(c, x, y, u, a0, a1, b0, b1, z0, z1, col);

  const ha = T.ha, hb = T.hb, z1 = 0.30 + T.h1;
  // Travertine podium base
  LBOX(-ha - 0.14, ha + 0.14, -hb - 0.14, hb + 0.14, 0, 0.30, RM_TRAV_D);
  LBOX(-ha, ha, -hb, hb, 0.30, z1, T.wall);

  // Characteristic Pompeian Red / Imperial Purple lower wall dado band
  const zDado = 0.30 + T.h1 * 0.34;
  TH.poly(c, [L(-ha, hb + 0.015, 0.30), L(ha, hb + 0.015, 0.30), L(ha, hb + 0.015, zDado), L(-ha, hb + 0.015, zDado)], T.dado);
  TH.poly(c, [L(ha + 0.015, -hb, 0.30), L(ha + 0.015, hb, 0.30), L(ha + 0.015, hb, zDado), L(ha + 0.015, -hb, zDado)], shade(T.dado, -0.24));

  // Roman arched doorway & shuttered windows
  if (!eave) {
    TH.poly(c, [L(-0.34, hb + 0.03, 0.30), L(0.34, hb + 0.03, 0.30), L(0.34, hb + 0.03, 1.32), L(0, hb + 0.03, 1.56), L(-0.34, hb + 0.03, 1.32)], '#29180e', RM_GOLD, u * 0.06);
    [-0.85, 0.85].forEach(wx => {
      TH.poly(c, [L(wx - 0.22, hb + 0.03, 0.85), L(wx + 0.22, hb + 0.03, 0.85), L(wx + 0.22, hb + 0.03, 1.48), L(wx - 0.22, hb + 0.03, 1.48)], '#291d16');
    });
    [-1.1, 0, 1.1].forEach(wy => {
      TH.poly(c, [L(ha + 0.03, wy - 0.22, 0.85), L(ha + 0.03, wy + 0.22, 0.85), L(ha + 0.03, wy + 0.22, 1.48), L(ha + 0.03, wy - 0.22, 1.48)], '#1f1610');
    });
  } else {
    TH.poly(c, [L(ha + 0.03, -0.36, 0.30), L(ha + 0.03, 0.36, 0.30), L(ha + 0.03, 0.36, 1.32), L(ha + 0.03, 0, 1.56), L(ha + 0.03, -0.36, 1.32)], '#29180e', RM_GOLD, u * 0.06);
    [-1.15, 1.15].forEach(wy => {
      TH.poly(c, [L(ha + 0.03, wy - 0.22, 0.85), L(ha + 0.03, wy + 0.22, 0.85), L(ha + 0.03, wy + 0.22, 1.48), L(ha + 0.03, wy - 0.22, 1.48)], '#1f1610');
    });
    [-0.75, 0.75].forEach(wx => {
      TH.poly(c, [L(wx - 0.22, hb + 0.03, 0.85), L(wx + 0.22, hb + 0.03, 0.85), L(wx + 0.22, hb + 0.03, 1.48), L(wx - 0.22, hb + 0.03, 1.48)], '#291d16');
    });
  }

  if (T.portico && !eave) {
    [-0.85, -0.28, 0.28, 0.85].forEach(cxO => {
      TH.ln(c, L(cxO, hb + 0.26, 0.30), L(cxO, hb + 0.26, z1), RM_TRAV, u * 0.13);
    });
  }

  if (T.twoStory) {
    const ha2 = ha * 0.84, hb2 = hb * 0.86, z2 = z1 + T.h2;
    LBOX(-ha2, ha2, -hb2, hb2, z1, z2, RM_OCHRE);
    [-0.68, 0, 0.68].forEach(wx => {
      TH.poly(c, [L(wx - 0.20, hb2 + 0.03, z1 + 0.32), L(wx + 0.20, hb2 + 0.03, z1 + 0.32), L(wx + 0.20, hb2 + 0.03, z2 - 0.20), L(wx - 0.20, hb2 + 0.03, z2 - 0.20)], '#fde68a');
    });
    drawRomanTileRoof(c, L, -ha2, ha2, -hb2, hb2, z2, T.rise, T.tile, RM_TRAV, u);
  } else {
    drawRomanTileRoof(c, L, -ha, ha, -hb, hb, z1, T.rise, T.tile, RM_TRAV, u);
  }
}

const RMHOUSE = (key) => ({
  cat: 'struct',
  rho: 0.14,
  draw(c, x, y, u, v) {
    const T = RMHOUSE_T[key], o = v & 3, s = v >> 2, eave = (o >> 1) & 1;
    c.fillStyle = 'rgba(22, 24, 10, .32)';
    c.beginPath();
    c.ellipse(x + u * 0.7, y + u * 0.18, u * T.sw * (eave ? 1.18 : 1), u * T.sh, 0, 0, 7);
    c.fill();
    RFLIP(c, x, o & 1, () => RMHOUSE_BODY(c, x, y, u, s, eave, T));
  }
});

const ROME_ASSETS = {
  /* ---------- Rear Alban & Sabine Apennine Hills (Natural Rolling Tuscan Hillsides) ---------- */
  albanPeak: {
    cat: 'hill', rho: 0.15,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 17 + 7);
      const w = u * (4.6 + r() * 0.7);
      const h = u * (3.4 + r() * 0.6);

      // Soft ground shadow
      TH.ell(c, x, y + u * 0.08, w * 1.02, u * 0.44, 'rgba(22, 24, 10, .24)');

      // Offset rolling background foothill knoll
      const ox = (v % 2 ? 1 : -1) * w * 0.46;
      const hw2 = w * 0.72, hh2 = h * 0.78;
      c.fillStyle = '#5e6d34';
      c.beginPath();
      c.moveTo(x + ox - hw2, y + u * 0.04);
      c.bezierCurveTo(
        x + ox - hw2 * 0.55, y - hh2 * 0.92,
        x + ox + hw2 * 0.45, y - hh2 * 0.96,
        x + ox + hw2, y + u * 0.04
      );
      c.closePath();
      c.fill();

      // Main broad, rounded Tuscan hillside (gentle S-curve flanks & rounded crest, never triangular)
      const crestX = x + (v % 2 ? -0.14 : 0.14) * w;
      const traceHill = () => {
        c.beginPath();
        c.moveTo(x - w, y + u * 0.06);
        c.bezierCurveTo(
          x - w * 0.62, y - h * 0.18,
          crestX - w * 0.36, y - h * 1.02,
          crestX, y - h
        );
        c.bezierCurveTo(
          crestX + w * 0.38, y - h * 0.98,
          x + w * 0.62, y - h * 0.16,
          x + w, y + u * 0.06
        );
        c.quadraticCurveTo(x, y + u * 0.22, x - w, y + u * 0.06);
        c.closePath();
      };

      const grad = c.createLinearGradient(x - w * 0.5, y - h, x + w * 0.6, y);
      grad.addColorStop(0.00, '#c9ab76');
      grad.addColorStop(0.45, '#8c9648');
      grad.addColorStop(0.82, '#687838');
      grad.addColorStop(1.00, '#52602c');
      traceHill();
      c.fillStyle = grad;
      c.fill();

      // Clip inside hillside for sunlit meadow swales, soft shadow flank & agricultural terrace lines
      c.save();
      traceHill();
      c.clip();

      // Warm sunlit left/upper meadow glow
      c.fillStyle = 'rgba(224, 198, 134, 0.28)';
      c.beginPath();
      c.ellipse(crestX - w * 0.22, y - h * 0.46, w * 0.48, h * 0.28, -0.18, 0, Math.PI * 2);
      c.fill();

      // Soft warm-umber shaded right slope
      c.fillStyle = 'rgba(46, 36, 18, 0.22)';
      c.beginPath();
      c.moveTo(crestX + w * 0.04, y - h * 1.02);
      c.bezierCurveTo(crestX + w * 0.40, y - h * 0.96, x + w * 0.65, y - h * 0.16, x + w * 1.04, y + u * 0.10);
      c.lineTo(x + w * 0.12, y + u * 0.20);
      c.quadraticCurveTo(crestX + w * 0.10, y - h * 0.45, crestX + w * 0.04, y - h * 1.02);
      c.closePath();
      c.fill();

      // Subtle contoured Tuscan vineyard / olive terrace lines along the slope
      [0.32, 0.58].forEach((tf, idx) => {
        const ty = y - h * tf;
        c.strokeStyle = idx === 0 ? 'rgba(62, 74, 30, 0.34)' : 'rgba(218, 194, 136, 0.28)';
        c.lineWidth = u * 0.06;
        c.beginPath();
        c.moveTo(x - w * 0.75, ty + u * 0.10);
        c.quadraticCurveTo(crestX, ty - u * 0.12, x + w * 0.75, ty + u * 0.08);
        c.stroke();
      });

      c.restore();

      // Small Roman hilltop stone watch-villa & cypress grove nestled near the rounded crest
      const vx = crestX - u * 0.18, vy = y - h * 0.78;
      TH.poly(c, [[vx - u * 0.24, vy + u * 0.16], [vx + u * 0.24, vy + u * 0.16], [vx + u * 0.24, vy - u * 0.04], [vx - u * 0.24, vy - u * 0.04]], RM_OCHRE);
      TH.poly(c, [[vx - u * 0.30, vy - u * 0.04], [vx + u * 0.30, vy - u * 0.04], [vx, vy - u * 0.15]], RM_TILE);
      // Flanking miniature cypress silhouettes & foothill olive scrub
      TH.ell(c, vx + u * 0.38, vy + u * 0.02, u * 0.08, u * 0.26, '#244428');
      TH.ell(c, vx + u * 0.52, vy + u * 0.06, u * 0.07, u * 0.22, '#305733');
      TH.blob(c, x - w * 0.44, y - h * 0.16, u * 0.52, u * 0.26, '#566e38', r, 7);
      TH.blob(c, x + w * 0.46, y - h * 0.14, u * 0.48, u * 0.24, '#4a5e2e', r, 7);
    }
  },
  tuscanRidge: {
    cat: 'hill', rho: 0.13,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 23 + 5);
      const w = u * (3.9 + r() * 0.6);
      const h = u * (2.6 + r() * 0.5);
      TH.ell(c, x, y + u * 0.07, w * 1.02, u * 0.40, 'rgba(22, 24, 10, .22)');

      // Double-humped rolling Tuscan ridge
      const crestX = x + (v % 2 ? 0.15 : -0.15) * w;
      const traceRidge = () => {
        c.beginPath();
        c.moveTo(x - w, y + u * 0.05);
        c.bezierCurveTo(
          x - w * 0.58, y - h * 0.15,
          crestX - w * 0.38, y - h * 1.02,
          crestX, y - h
        );
        c.bezierCurveTo(
          crestX + w * 0.38, y - h * 0.98,
          x + w * 0.58, y - h * 0.14,
          x + w, y + u * 0.05
        );
        c.quadraticCurveTo(x, y + u * 0.20, x - w, y + u * 0.05);
        c.closePath();
      };

      const grad = c.createLinearGradient(x - w * 0.4, y - h, x + w * 0.6, y);
      grad.addColorStop(0.0, '#b8a268');
      grad.addColorStop(0.5, '#768740');
      grad.addColorStop(1.0, '#55632c');
      traceRidge();
      c.fillStyle = grad;
      c.fill();

      c.save();
      traceRidge();
      c.clip();
      c.fillStyle = 'rgba(218, 194, 134, 0.24)';
      c.beginPath();
      c.ellipse(crestX - w * 0.18, y - h * 0.45, w * 0.44, h * 0.26, -0.15, 0, Math.PI * 2);
      c.fill();
      c.restore();

      TH.blob(c, x - w * 0.36, y - h * 0.14, u * 0.44, u * 0.22, '#627536', r, 7);
    }
  },
  tuscanRidge: {
    cat: 'hill', rho: 0.13,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 23 + 5);
      const w = u * (3.7 + r() * 0.6);
      const h = u * (3.8 + r() * 0.7);
      TH.ell(c, x, y + u * 0.08, w * 1.04, u * 0.44, 'rgba(22, 24, 10, .26)');

      const grad = c.createLinearGradient(x - w * 0.4, y - h, x + w * 0.6, y);
      grad.addColorStop(0.0, '#c7a676');
      grad.addColorStop(0.5, '#768740');
      grad.addColorStop(1.0, '#55632c');
      c.fillStyle = grad;
      c.beginPath();
      c.moveTo(x - w, y + u * 0.06);
      c.quadraticCurveTo(x - w * 0.25, y - h * 1.02, x, y - h);
      c.quadraticCurveTo(x + w * 0.25, y - h * 1.02, x + w, y + u * 0.06);
      c.quadraticCurveTo(x, y + u * 0.24, x - w, y + u * 0.06);
      c.closePath();
      c.fill();
    }
  },

  /* ---------- Warm Roman & Tuscan Trees ---------- */
  romanStonePine: {
    cat: 'tree', rho: 0.12,
    draw(c, x, y, u, v) {
      // Iconic Roman Pineta Umbrella Stone Pine with warm reddish-brown trunk & deep rich pine canopy
      const r = mulberry(v * 11 + 3), H = u * (5.0 + r() * 0.9);
      RSH(c, x, y, u * 2.2);
      c.strokeStyle = '#633c24';
      c.lineWidth = u * 0.46;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(x + u * 0.32, y - H * 0.5, x - u * 0.08, y - H * 0.88);
      c.stroke();
      const cy = y - H * 0.92;
      TH.blob(c, x, cy, u * 2.25, u * 0.70, '#2d5730', r, 10);
      TH.blob(c, x - u * 0.55, cy - u * 0.22, u * 1.50, u * 0.54, '#3e733d', r, 9);
      TH.blob(c, x + u * 0.65, cy - u * 0.16, u * 1.40, u * 0.50, '#224526', r, 9);
    }
  },
  tuscanCypress: {
    cat: 'tree', rho: 0.08,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 17 + 7), H = u * (6.6 + r() * 1.4);
      RSH(c, x, y, u * 0.95);
      TH.ln(c, [x, y], [x, y - u * 1.1], '#473020', u * 0.30);
      const pal = ['#244428', '#305733', '#1a361e', '#3a663b'];
      for (let k = 0; k < 9; k++) {
        const t = k / 8;
        const yy = y - u * 1.0 - t * (H - u * 1.3);
        const rx = u * (0.52 + 0.30 * Math.sin(Math.min(1, t * 1.15) * Math.PI * 0.88));
        TH.blob(c, x + (r() - 0.5) * u * 0.16, yy, rx, u * 0.82, pal[k % 4], r, 8);
      }
    }
  },
  sabineOlive: {
    cat: 'tree', rho: 0.12,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 23 + 3), H = u * (3.8 + r() * 0.8);
      RSH(c, x, y, u * 2.0);
      c.strokeStyle = '#523e2e';
      c.lineWidth = u * 0.56;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(x, y);
      c.bezierCurveTo(x - u * 0.65, y - H * 0.35, x + u * 0.65, y - H * 0.62, x - u * 0.1, y - H * 0.76);
      c.stroke();
      const cy = y - H * 0.82;
      const oliveCols = ['#6c8748', '#829e58', '#566e38', '#96b068'];
      [[0, -0.25, 1.75, 0.98], [-1.25, 0.06, 1.20, 0.80], [1.25, 0.04, 1.20, 0.80], [-0.55, -0.85, 1.25, 0.82], [0.60, -0.82, 1.20, 0.80]].forEach(([dx, dy, rx, ry], i) => {
        TH.blob(c, x + dx * u, cy + dy * u, u * rx, u * ry, oliveCols[(i + v) % 4], r, 9);
      });
    }
  },
  smallTuscanOlive: {
    cat: 'tree', rho: 0.07,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 29 + 1);
      RSH(c, x, y, u * 1.0);
      TH.ln(c, [x, y], [x, y - u * 1.4], '#523e2e', u * 0.26);
      TH.blob(c, x, y - u * 1.85, u * 1.05, u * 0.68, v % 2 ? '#6c8748' : '#829e58', r, 8);
    }
  },

  /* ---------- Warm Roman Shrubs & Travertine Boulders ---------- */
  romanLaurel: {
    cat: 'shrub', rho: 0.06,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 5 + 9);
      TH.ell(c, x + u * 0.16, y + u * 0.07, u * 1.05, u * 0.30, 'rgba(22, 24, 10, .26)');
      [[-0.48, -0.36, 0.76, 0.52, '#345c30'], [0.48, -0.36, 0.76, 0.52, '#43733b'], [0, -0.72, 0.82, 0.56, '#528746']].forEach(([dx, dy, rx, ry, col]) => {
        TH.blob(c, x + dx * u, y + dy * u, u * rx, u * ry, col, r, 8);
      });
      for (let k = 0; k < 8; k++) {
        TH.ell(c, x + (r() - 0.5) * u * 1.25, y - u * (0.26 + r() * 0.68), u * 0.11, u * 0.08, k % 2 ? '#dc2626' : '#f59e0b');
      }
    }
  },
  travertineBoulder: {
    cat: 'rock', rho: 0.08,
    draw(c, x, y, u, v) {
      const r = mulberry(v * 13 + 3);
      RSH(c, x, y, u * 1.3);
      TH.poly(c, [[x - u * 1.1, y], [x - u * 0.72, y - u * 0.82], [x + u * 0.28, y - u * 0.92], [x + u * 1.02, y - u * 0.32], [x + u * 0.88, y + u * 0.08]], RM_TRAV_D);
      TH.blob(c, x - u * 0.22, y - u * 0.62, u * 0.62, u * 0.24, '#6c8748', r, 6);
    }
  },

  /* ---------- Imperial Roman Civic Monuments & Engineering ---------- */
  aqueductArcade: {
    cat: 'ruin', rho: 0.14,
    draw(c, x, y, u, v) {
      // Multi-tiered Roman Travertine Aqueduct Arcade (Pont du Gard / Aqua Claudia)
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      RFLIP(c, x, v & 1, () => {
        RSH(c, x, y, u * 3.1);
        // 4 heavy travertine piers with 3 rounded Roman arches
        [-2.1, -0.7, 0.7, 2.1].forEach(px => {
          RBOX(c, x, y, u, px - 0.24, px + 0.24, -0.35, 0.35, 0, 2.45, RM_TRAV);
        });
        // Arch spandrels & upper attic water channel (specus)
        RBOX(c, x, y, u, -2.34, 2.34, -0.35, 0.35, 1.95, 2.85, RM_TRAV);
        RBOX(c, x, y, u, -2.42, 2.42, -0.40, 0.40, 2.85, 3.25, RM_TRAV_D);
        // Upper water trough glint
        TH.poly(c, [I(-2.35, -0.22, 3.26), I(2.35, -0.22, 3.26), I(2.35, 0.22, 3.26), I(-2.35, 0.22, 3.26)], '#1d6fa5');
        // Dark rounded arch openings
        [-1.4, 0, 1.4].forEach(ax => {
          TH.poly(c, [
            I(ax - 0.44, 0.36, 0),
            I(ax + 0.44, 0.36, 0),
            I(ax + 0.44, 0.36, 1.45),
            I(ax, 0.36, 1.88),
            I(ax - 0.44, 0.36, 1.45)
          ], '#1c1814');
        });
      });
    }
  },
  triumphalArch: {
    cat: 'ruin', rho: 0.12,
    draw(c, x, y, u, v) {
      // Arch of Constantine / Titus inspired Roman Triumphal Arch with gilded quadriga
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      RFLIP(c, x, v & 1, () => {
        RSH(c, x, y, u * 2.5);
        RBOX(c, x, y, u, -1.75, -0.65, -0.45, 0.45, 0, 2.45, RM_TRAV);
        RBOX(c, x, y, u,  0.65,  1.75, -0.45, 0.45, 0, 2.45, RM_TRAV);
        // Central arch vault & attic inscription entablature
        RBOX(c, x, y, u, -1.85, 1.85, -0.48, 0.48, 2.15, 3.35, RM_TRAV);
        // Pompeian red & gold relief panels on attic
        TH.poly(c, [I(-1.45, 0.49, 2.48), I(1.45, 0.49, 2.48), I(1.45, 0.49, 3.12), I(-1.45, 0.49, 3.12)], RM_POMPEII, RM_GOLD, u * 0.05);
        // Gilded bronze chariot / eagle statue crowning the attic
        RBOX(c, x, y, u, -0.75, 0.75, -0.32, 0.32, 3.35, 3.72, RM_GOLD);
        [-0.45, 0, 0.45].forEach(hx => {
          TH.ln(c, I(hx, 0.1, 3.72), I(hx, 0.1, 4.35), RM_GOLD, u * 0.16);
        });
      });
    }
  },
  pantheonRotunda: {
    cat: 'ruin', rho: 0.14,
    draw(c, x, y, u, v) {
      // Pantheon-inspired Roman Rotunda Temple with portico & patinated bronze dome
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      RFLIP(c, x, v & 1, () => {
        RSH(c, x, y, u * 3.0);
        // Cylindrical warm brick & travertine rotunda drum
        const pC = I(0, -0.4, 0), pT = I(0, -0.4, 2.45);
        const r = u * 1.85;
        TH.ell(c, pC[0], pC[1], r, r * 0.48, RM_TRAV_D);
        c.fillStyle = '#c46a4a';
        c.fillRect(pC[0] - r * 0.96, pT[1], r * 1.92, pC[1] - pT[1]);
        // Coffered verdigris dome & golden oculus ring
        c.fillStyle = RM_VERD;
        c.beginPath();
        c.arc(pT[0], pT[1], r * 0.96, Math.PI, 0);
        c.closePath();
        c.fill();
        TH.ell(c, pT[0], pT[1] - r * 0.88, u * 0.36, u * 0.16, RM_GOLD);

        // Front travertine portico & triangular pediment
        RBOX(c, x, y, u, -1.35, 1.35, 0.55, 1.95, 0, 0.28, RM_TRAV_D);
        [-1.1, -0.38, 0.38, 1.1].forEach(cxO => {
          TH.ln(c, I(cxO, 1.82, 0.28), I(cxO, 1.82, 2.15), RM_TRAV, u * 0.16);
        });
        drawRomanTileRoof(c, I, -1.32, 1.32, 0.55, 1.92, 2.15, 0.88, RM_TILE, RM_TRAV, u);
      });
    }
  },
  thermaePool: {
    cat: 'ruin', rho: 0.11,
    draw(c, x, y, u) {
      // Roman Thermae thermal bath pool framed in warm travertine & Pompeian red tiles
      TH.ell(c, x, y, u * 2.40, u * 1.08, RM_TRAV_D);
      TH.ell(c, x, y, u * 2.22, u * 0.98, RM_POMPEII);
      TH.ell(c, x, y, u * 1.98, u * 0.85, '#19647e');
      TH.ell(c, x - u * 0.14, y - u * 0.04, u * 1.55, u * 0.64, '#2896a8');
      // Warm thermal steam wisps
      c.fillStyle = 'rgba(254, 243, 199, 0.26)';
      c.beginPath();
      c.ellipse(x - u * 0.2, y - u * 0.28, u * 0.72, u * 0.26, 0, 0, Math.PI * 2);
      c.fill();
    }
  },
  victoryColumn: {
    cat: 'struct', rho: 0.08,
    draw(c, x, y, u, v) {
      // Tier 5 Trajan's Column / Imperial Roman Victory Watchtower beside a Villa
      const I = (X, Y, Z) => TH.iso(x, y, u, X, Y, Z);
      RFLIP(c, x, v & 1, () => {
        RSH(c, x, y, u * 2.0);
        // Sculpted square travertine pedestal with Pompeian red & gold relief
        RBOX(c, x, y, u, -1.15, 1.15, -1.15, 1.15, 0, 1.45, RM_TRAV);
        TH.poly(c, [I(-0.85, 1.16, 0.35), I(0.85, 1.16, 0.35), I(0.85, 1.16, 1.15), I(-0.85, 1.16, 1.15)], RM_POMPEII, RM_GOLD, u * 0.05);
        // Tall sculpted marble column shaft with spiral relief bands
        const pB = I(0, 0, 1.45), pT = I(0, 0, 5.25);
        TH.ln(c, pB, pT, RM_TRAV, u * 1.15);
        TH.ln(c, [pB[0] + u * 0.22, pB[1]], [pT[0] + u * 0.22, pT[1]], RM_TRAV_D, u * 0.35);
        for (let z = 1.95; z < 5.0; z += 0.62) {
          const pz = I(0, 0, z);
          TH.ln(c, [pz[0] - u * 0.54, pz[1] - u * 0.12], [pz[0] + u * 0.54, pz[1] + u * 0.12], RM_TRAV_D, u * 0.06);
        }
        // Doric capital & gilded bronze Emperor statue at summit
        RBOX(c, x, y, u, -0.78, 0.78, -0.78, 0.78, 5.25, 5.55, RM_TRAV);
        TH.ln(c, [pT[0], pT[1] - u * 0.30], [pT[0], pT[1] - u * 1.35], RM_GOLD, u * 0.26);
        TH.ell(c, pT[0], pT[1] - u * 1.52, u * 0.16, u * 0.18, '#fef08a');
      });
    }
  },

  /* ---------- Residences ---------- */
  romanDomus:     RMHOUSE('romanDomus'),
  romanInsula:    RMHOUSE('romanInsula'),
  patricianVilla: RMHOUSE('patricianVilla'),

  /* ---------- Small Roman Props ---------- */
  romanAmphorae: {
    cat: 'prop', rho: 0.04,
    draw(c, x, y, u) {
      RSH(c, x, y, u * 0.95);
      [[-0.35, 0.05, 1.0, '#b5492b'], [0.35, -0.05, 0.88, '#c96a38'], [0.05, 0.22, 0.78, '#8c331c']].forEach(([dx, dy, sc, col]) => {
        const px = x + dx * u, py = y + dy * u;
        TH.ell(c, px, py - u * 0.55 * sc, u * 0.28 * sc, u * 0.44 * sc, col);
        TH.ln(c, [px, py - u * 0.85 * sc], [px, py - u * 1.12 * sc], col, u * 0.14 * sc);
        TH.ell(c, px, py - u * 1.14 * sc, u * 0.14 * sc, u * 0.06 * sc, '#3b150a');
      });
    }
  },
  legionStandard: {
    cat: 'prop', rho: 0.03,
    draw(c, x, y, u) {
      // SPQR Crimson & Gold Roman Vexillum Banner Standard
      RSH(c, x, y, u * 0.75);
      TH.ln(c, [x, y], [x, y - u * 2.55], RM_GOLD, u * 0.10);
      TH.ln(c, [x - u * 0.42, y - u * 2.25], [x + u * 0.42, y - u * 2.25], RM_GOLD, u * 0.08);
      TH.poly(c, [[x - u * 0.36, y - u * 2.22], [x + u * 0.36, y - u * 2.22], [x + u * 0.36, y - u * 1.45], [x, y - u * 1.25], [x - u * 0.36, y - u * 1.45]], RM_POMPEII, RM_GOLD, u * 0.04);
      TH.ell(c, x, y - u * 2.68, u * 0.16, u * 0.16, RM_GOLD);
    }
  },
  romanBrazier: {
    cat: 'prop', rho: 0.03,
    draw(c, x, y, u) {
      RSH(c, x, y, u * 0.75);
      RBOX(c, x, y, u, -0.45, 0.45, -0.45, 0.45, 0, 0.75, RM_TRAV_D);
      TH.ell(c, x, y - u * 0.85, u * 0.42, u * 0.18, '#5c2d16');
      TH.poly(c, [[x - u * 0.28, y - u * 0.85], [x, y - u * 1.65], [x + u * 0.28, y - u * 0.85]], '#ea580c');
      TH.poly(c, [[x - u * 0.14, y - u * 0.85], [x, y - u * 1.35], [x + u * 0.14, y - u * 0.85]], '#fde047');
    }
  },
  travertineBench: {
    cat: 'prop', rho: 0.05,
    draw(c, x, y, u, v) {
      RFLIP(c, x, v & 1, () => {
        RSH(c, x, y, u * 1.15);
        RBOX(c, x, y, u, -0.85, -0.55, -0.32, 0.32, 0, 0.48, RM_TRAV_D);
        RBOX(c, x, y, u,  0.55,  0.85, -0.32, 0.32, 0, 0.48, RM_TRAV_D);
        RBOX(c, x, y, u, -0.95,  0.95, -0.38, 0.38, 0.48, 0.68, RM_TRAV);
      });
    }
  }
};

/* ===== MACRO-LAND ENGINE (hex geometry, planner, 5-tier baker) ===== */
const W3 = Math.sqrt(3), HX = W3 / 2, HV = [[HX, 0.29], [0, 0.58], [-HX, 0.29], [-HX, -0.29], [0, -0.58], [HX, -0.29]];
const LAND_ROWS = {
  A: [[-1, 0, 1], [-1.5, -0.5, 0.5, 1.5], [-1, 0, 1], [-0.5, 0.5]],
  B: [[0, 1, 2], [-0.5, 0.5, 1.5], [-1, 0, 1], [-0.5, 0.5, 1.5]],
  C: [[0], [-0.5, 0.5, 1.5], [-1, 0, 1], [-0.5]],
  D: [[0, 1, 2], [-0.5, 0.5, 1.5], [0, 1]]
};
const LAND_KEEP = { rx: 0.52, ry: 0.34 };
const vkey = p => p[0].toFixed(3) + ',' + p[1].toFixed(3);
function hexInside(dx, dy, s) {
  const ax = Math.abs(dx) / s, ay = Math.abs(dy) / s;
  return ax <= HX && ay <= 0.58 - 0.3349 * ax;
}

function landGeometry(shape) {
  const centers = [];
  LAND_ROWS[shape].forEach((row, r) => row.forEach((u, i) => centers.push({ x: u * W3, y: r * 0.87, row: r, col: i })));
  const edges = new Map(), verts = new Map();
  centers.forEach((c, ci) => {
    for (let k = 0; k < 6; k++) {
      const a = [c.x + HV[k][0], c.y + HV[k][1]], b = [c.x + HV[(k + 1) % 6][0], c.y + HV[(k + 1) % 6][1]];
      const ka = vkey(a), kb = vkey(b), ek = ka < kb ? ka + '|' + kb : kb + '|' + ka;
      let e = edges.get(ek);
      if (!e) { e = { a, b, ka, kb, hexes: [] }; edges.set(ek, e); }
      e.hexes.push(ci);
      [[ka, a], [kb, b]].forEach(([kk, p]) => {
        let v = verts.get(kk);
        if (!v) { v = { k: kk, x: p[0], y: p[1], hexes: new Set() }; verts.set(kk, v); }
        v.hexes.add(ci);
      });
    }
  });
  const E = [...edges.values()].map(e => {
    const mid = [(e.a[0] + e.b[0]) / 2, (e.a[1] + e.b[1]) / 2], len = Math.hypot(e.b[0] - e.a[0], e.b[1] - e.a[1]), vertical = Math.abs(e.a[0] - e.b[0]) < 1e-6;
    let n = null, cls = null;
    if (e.hexes.length === 1) {
      const c = centers[e.hexes[0]];
      let nx = mid[0] - c.x, ny = mid[1] - c.y;
      const m = Math.hypot(nx, ny);
      n = [nx / m, ny / m];
      cls = n[1] < -0.4 ? 'top' : n[1] > 0.4 ? 'bottom' : 'side';
    }
    return Object.assign(e, { mid, len, vertical, outer: e.hexes.length === 1, n, cls });
  });
  const V = [...verts.values()].map(v => Object.assign(v, { junction: v.hexes.size >= 3 }));
  const xs = [], ys = [];
  centers.forEach(c => { xs.push(c.x - HX, c.x + HX); ys.push(c.y - 0.58, c.y + 0.58); });
  return { centers, edges: E, verts: V, bbox: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) } };
}

/* ---- generic 5-tier baker ---- */

function bakeLandTheme(T, shape, tier, R, opts) {
  opts = opts || {};
  const sc = opts.scale || getBakeScale();
  const m = opts.mirrorX ? -1 : 1;
  const ground = opts.ground || T.groundCol;
  const clr = (opts.clear || []).map(p => [Math.min(p[0], p[1]), Math.max(p[0], p[1])]);
  const key = [T.id, shape, tier, R, m, ground, sc, JSON.stringify(clr), JSON.stringify(opts.clearTiles || [])].join('|');
  const cached = revisedLandCache.get(key); if (cached) return cached;

  const plan = T.plan(shape), G = plan.G, bb = G.bbox;
  const x0 = m > 0 ? bb.minX : -bb.maxX, x1 = m > 0 ? bb.maxX : -bb.minX;
  const mx = 0.75, top = T.top || 1.95, bot = 0.85;
  const W = Math.ceil((x1 - x0 + 2 * mx) * R), H = Math.ceil((bb.maxY - bb.minY + top + bot) * R);
  const ox = (-x0 + mx) * R, oy = (-bb.minY + top) * R, u = R * 0.075;

  const mk = () => {
    const cv = document.createElement('canvas');
    cv.width = Math.ceil(W * sc);
    cv.height = Math.ceil(H * sc);
    const g = cv.getContext('2d');
    g.scale(sc, sc);
    return [cv, g];
  };
  const [back, cb] = mk();
  T.ground(cb, G, R, ox, oy, m, ground, ({ A: 2601, B: 3702, C: 4803, D: 5904 })[shape]);
  const bridges = clr.map(([i, j]) => [G.centers[i], G.centers[j]]);
  const vis = plan.objs.filter(o => o.tier <= tier && tier <= o.maxT && !bridges.some(([a, c]) => westCapsuleHit(a, c, o.x, o.y, o.rho)) && !(opts.clearTiles||[]).some(i=>{const c=G.centers[i];return c&&Math.abs(o.x-c.x)<0.866+o.rho&&Math.abs(o.y-c.y)<0.58+o.rho*0.58;}));

  const sprites = vis.map(o => {
    const asset = T.assets[o.kind], base = u * (o.scale || 1);
    const reach = Math.max(asset.reach || 4, (asset.tall || 9) * 0.45);
    const span = [o.p1, o.p2].filter(Boolean).reduce((max, p) =>
      Math.max(max, Math.abs(p[0] - o.x) * R / 8, Math.abs(p[1] - o.y) * R / 4), 0);
    const unit = Math.max(base, base * reach / 8, span);
    return { x: m * o.x * R, y: o.y * R, unit, draw: (ctx, x, y) => {
      ctx.save();
      ctx.translate(x - (ox + m * o.x * R), y - (oy + o.y * R));
      T.assets[o.kind].draw(ctx,ox+m*o.x*R,oy+o.y*R,u*(o.scale||1),o.v);
      ctx.restore();
    }};
  });
  const front = document.createElement('canvas');
  front.width = front.height = 1;
  const frontRect = {x: 0, y: 0, w: 1, h: 1};
  const centers = G.centers.map(c => ({x: ox + m * c.x * R, y: oy + c.y * R, row: c.row}));
  return revisedLandCache.set(key, {back, front, frontRect, w: W, h: H, ox, oy, centers, sc, shape, tier, mirrorX: m < 0, sprites});
}

function westCapsuleHit(a, b, x, y, rho) {
  const A = LAND_KEEP.rx + rho * 0.55, B = LAND_KEEP.ry + rho * 0.28;
  const dx = b.x - a.x, dy = b.y - a.y, px = x - a.x, py = y - a.y;
  const q = dx * dx / (A * A) + dy * dy / (B * B);
  const t = Math.max(0, Math.min(1, (px * dx / (A * A) + py * dy / (B * B)) / q));
  const ex = (px - t * dx) / A, ey = (py - t * dy) / B;
  return ex * ex + ey * ey < 1;
}

/* ===== ANCIENT ROME LAND PLANNER & WARM TUSCAN FLOOR ===== */
const ROME_REGION = {
  top:    { tuscanCypress: .30, romanStonePine: .28, sabineOlive: .24, smallTuscanOlive: .18 },
  mid:    { romanStonePine: .32, sabineOlive: .30, tuscanCypress: .22, smallTuscanOlive: .16 },
  bottom: { sabineOlive: .34, smallTuscanOlive: .26, romanStonePine: .24, tuscanCypress: .16 }
};
const ROME_LOW = [['smallTuscanOlive', 1.05], ['sabineOlive', 0.72], ['romanStonePine', 0.68], ['smallTuscanOlive', 0.88], ['tuscanCypress', 0.65]];
const ROME_CAP = { tuscanCypress: 12, romanStonePine: 11, sabineOlive: 14 };
const ROME_UNDER = ['romanLaurel', 'travertineBoulder', 'romanLaurel', 'travertineBoulder'];
const ROME_PLAN_CACHE = {};

function getRomePlan(shape) {
  if (ROME_PLAN_CACHE[shape]) return ROME_PLAN_CACHE[shape];
  const G = landGeometry(shape), rng = mulberry(({ A: 1901, B: 2802, C: 3903, D: 4904 })[shape]);
  const placed = [], bb = G.bbox, used = {}, A = ROME_ASSETS;
  const cx = G.centers.reduce((a, c) => a + c.x, 0) / G.centers.length;
  const cy = G.centers.reduce((a, c) => a + c.y, 0) / G.centers.length;

  const inLand = (x, y, pad = 1.06) => G.centers.some(c => hexInside(x - c.x, y - c.y, pad));
  const free = (x, y, rho) => G.centers.every(c => {
    const dx = (x - c.x) / (LAND_KEEP.rx + rho * 0.42), dy = (y - c.y) / (LAND_KEEP.ry + rho * 0.26);
    return dx * dx + dy * dy >= 1;
  });
  const clearOthers = (x, y, rho) => placed.every(o => Math.hypot(x - o.x, (y - o.y) * 1.7) >= (rho + o.rho * (o.clear || 1)) * 0.68);
  const pickFrom = (w, ok) => {
    for (let g = 0; g < 12; g++) {
      let t = rng(), acc = 0, pick = Object.keys(w)[0];
      for (const k in w) { acc += w[k]; if (t <= acc) { pick = k; break; } }
      if (!ok || ok(pick)) return pick;
    }
    return 'romanStonePine';
  };
  const capOk = k => !(ROME_CAP[k] && (used[k] || 0) >= ROME_CAP[k]);
  const regionOf = y => {
    const n = (y - bb.minY) / (bb.maxY - bb.minY);
    return n < 0.34 ? ROME_REGION.top : n < 0.68 ? ROME_REGION.mid : ROME_REGION.bottom;
  };

  const place = (kind, x, y, extra) => {
    const D = A[kind], sc = (extra && extra.scale) || (D.cat === 'tree' ? 0.86 + rng() * 0.34 : D.cat === 'shrub' ? 0.88 + rng() * 0.28 : 1), rho = D.rho * sc;
    const maxPad = (extra && extra.pad) || ((D.cat === 'struct' || D.cat === 'ruin' || D.cat === 'hill') ? 0.95 : 1.05);
    for (let t = 0; t < 8; t++) {
      const px = x + (t ? (rng() - 0.5) * 0.10 * t : 0), py = y + (t ? (rng() - 0.5) * 0.08 * t : 0);
      if (!inLand(px, py, maxPad) || !free(px, py, rho) || !clearOthers(px, py, rho)) continue;
      if ((D.cat === 'tree' || D.cat === 'shrub' || D.cat === 'prop') && placed.some(o => o.noSouth && Math.abs(px - o.x) < 0.3 && py - o.y > -0.05 && py - o.y < 0.36)) continue;
      const o = Object.assign({ kind, x: px, y: py, rho, scale: sc, v: Math.floor(rng() * 1000), cat: D.cat, pri: rng(), minT: 1, maxT: 5 }, extra || {});
      o.scale = sc;
      placed.push(o);
      used[kind] = (used[kind] || 0) + 1;
      return o;
    }
    return null;
  };

  const tree = (x, y, extra, dom, low) => {
    if (low) {
      const L = ROME_LOW[Math.floor(rng() * ROME_LOW.length)];
      return place(L[0], x, y, Object.assign({}, extra || {}, { scale: L[1] * (0.9 + rng() * 0.2) }));
    }
    return place(dom && rng() < 0.55 && capOk(dom) ? dom : pickFrom(regionOf(y), capOk), x, y, extra || {});
  };
  const under = (x, y, extra) => place(ROME_UNDER[Math.floor(rng() * ROME_UNDER.length)], x, y, extra || {});

  const outer = G.edges.filter(e => e.outer), top = outer.filter(e => e.cls === 'top'), sides = outer.filter(e => e.cls === 'side'), interior = G.edges.filter(e => !e.outer);
  const KS = G.centers.length / 12;
  const thin = l => { const n = Math.max(1, Math.round(l.length * KS)); return Array.from({ length: n }, (_, i) => l[Math.floor((i + 0.5) * l.length / n)]); };
  const cnt = n => Math.max(1, Math.round(n * KS));
  const onEdge = (e, t, off) => [e.a[0] + (e.b[0] - e.a[0]) * t + e.n[0] * off, e.a[1] + (e.b[1] - e.a[1]) * t + e.n[1] * off];

  // 1. Rear Alban & Sabine Apennine Hills along top rim
  {
    const hillSpots = [];
    top.forEach(e => [0.20, 0.42, 0.62, 0.82].forEach(t => hillSpots.push(onEdge(e, t, -0.16))));
    hillSpots.sort((a, b) => a[0] - b[0]);
    const targetHills = G.centers.length >= 12 ? 4 : 3;
    const placedHills = [];
    for (let h = 0; h < targetHills; h++) {
      const idx = Math.floor(((h + 0.5) / targetHills) * hillSpots.length);
      const cand = hillSpots[idx];
      if (!cand) continue;
      if (placedHills.some(q => Math.hypot(q[0] - cand[0], (q[1] - cand[1]) * 1.5) < 0.65)) continue;
      const isCenter = (h === Math.floor(targetHills / 2));
      const kind = isCenter ? 'albanPeak' : 'tuscanRidge';
      const ho = place(kind, cand[0], cand[1] + 0.08, {
        minT: isCenter ? 1 : 2,
        scale: isCenter ? (1.12 + rng() * 0.14) : (1.02 + rng() * 0.18),
        clear: 1.2,
        noSouth: true,
        pad: 0.94
      });
      if (ho) placedHills.push([ho.x, ho.y]);
    }
  }

  // 2. Roman Residences (Domus, Insulae, Patrician Villas) + Tier 5 Trajan's Victory Column
  const rim = [], inn = [];
  sides.concat(outer.filter(e => e.cls === 'bottom')).forEach(e => [0.3, 0.7].forEach(t => rim.push(onEdge(e, t, -0.06))));
  G.verts.filter(v => v.junction).forEach(v => inn.push([v.x, v.y]));
  interior.filter(e => e.vertical).forEach(e => inn.push([e.mid[0], e.mid[1]]));

  const chosen = placed.filter(o => o.cat === 'ruin' || o.cat === 'struct' || o.cat === 'hill').map(o => [o.x, o.y]), insulae = [];
  const spread = (k, pool, extra) => {
    const ranked = pool.map(p => ({ p, d: Math.min(1e9, ...chosen.map(q => Math.hypot(p[0] - q[0], (p[1] - q[1]) * 1.4))) + rng() * 0.22 })).sort((a, b) => b.d - a.d);
    for (let n = 0; n < Math.min(12, ranked.length); n++) {
      const o = place(k, ranked[n].p[0], ranked[n].p[1], extra);
      if (o) {
        chosen.push([o.x, o.y]);
        if (k === 'romanInsula') insulae.push(o);
        return o;
      }
    }
    return null;
  };

  thin([
    ['romanDomus', 1],
    ['patricianVilla', 2],
    ['romanInsula', 3],
    ['romanDomus', 4],
    ['patricianVilla', 4],
    ['romanInsula', 5]
  ]).forEach(([k, mt]) => spread(k, rim, { minT: mt, scale: 1.05, clear: 2.3, noSouth: true, pad: 0.95 }));

  thin([
    ['patricianVilla', 2],
    ['romanInsula', 3],
    ['romanDomus', 3],
    ['patricianVilla', 4],
    ['romanDomus', 5],
    ['romanInsula', 5]
  ]).forEach(([k, mt]) => spread(k, inn, { minT: mt, scale: 1.0, clear: 2.8, noSouth: true, pad: 0.96 }));

  {
    const home = insulae[insulae.length - 1] || placed.find(o => o.cat === 'struct');
    if (home) {
      for (const [dx, dy] of [[0.36, -0.06], [-0.36, -0.06], [0.30, 0.10], [-0.30, 0.10], [0.42, 0.0], [-0.42, 0.0]]) {
        const o = place('victoryColumn', home.x + dx, home.y + dy, { minT: 5, scale: 1.0, clear: 2.3, noSouth: true, pad: 0.95 });
        if (o) break;
      }
    }
  }

  // 2b. Imperial Roman Civic & Engineering Monuments (Aqueduct, Triumphal Arch, Pantheon Rotunda, Thermae Baths)
  thin([
    ['triumphalArch', 1],
    ['aqueductArcade', 2],
    ['thermaePool', 2],
    ['pantheonRotunda', 3],
    ['aqueductArcade', 3],
    ['triumphalArch', 4],
    ['pantheonRotunda', 4],
    ['thermaePool', 5]
  ]).forEach(([k, mt]) => spread(k, rim.concat(inn), { minT: mt, scale: k === 'pantheonRotunda' || k === 'aqueductArcade' ? 1.05 : 1.0, clear: 1.6, noSouth: true, pad: 0.96 }));

  // 3. Tuscan Cypress, Stone Pine & Sabine Olive Woodland
  G.verts.filter(v => v.junction).forEach(v => {
    const dom = pickFrom(regionOf(v.y), capOk), n = 2 + Math.floor(rng() * 1.9);
    for (let k = 0; k < n; k++) {
      const a = rng() * 6.283, r = k ? 0.12 + rng() * 0.09 : 0.02;
      tree(v.x + Math.cos(a) * r, v.y + Math.sin(a) * r * 0.8, null, dom);
    }
  });
  G.edges.filter(e => !e.outer && e.vertical).forEach(e => {
    const dom = pickFrom(regionOf(e.mid[1]), capOk);
    [-0.27, 0, 0.27].forEach(dy => { if (rng() < 0.72) tree(e.mid[0] + (rng() - 0.5) * 0.2, e.mid[1] + dy, null, dom); });
  });
  G.edges.filter(e => !e.outer && !e.vertical).forEach(e => {
    if (rng() < 0.72) tree(e.mid[0] + (rng() - 0.5) * 0.2, e.mid[1] + (rng() - 0.5) * 0.1, { scale: 0.8 + rng() * 0.2 }, null, true);
    if (rng() < 0.22) tree(e.mid[0] + (rng() - 0.5) * 0.34, e.mid[1] + (rng() - 0.5) * 0.14, { scale: 0.78 + rng() * 0.2 }, null, true);
  });
  {
    const ordered = outer.slice().sort((a, b) => Math.atan2((a.mid[1] - cy) * 1.7, a.mid[0] - cx) - Math.atan2((b.mid[1] - cy) * 1.7, b.mid[0] - cx)), samples = [];
    ordered.forEach(e => {
      const nS = Math.max(2, Math.round(e.len / 0.26));
      for (let s = 0; s < nS; s++) samples.push({ e, p: onEdge(e, (s + 0.5) / nS + (rng() - 0.5) * 0.08, -0.08 + rng() * 0.10) });
    });
    let mode = 'grove', run = 0, dom = 'romanStonePine';
    samples.forEach(s => {
      if (run <= 0) {
        const r = rng();
        mode = r < 0.74 ? 'grove' : r < 0.92 ? 'sparse' : 'open';
        run = 2 + Math.floor(rng() * 4);
        dom = pickFrom(regionOf(s.p[1]), capOk);
      }
      run--;
      const e = s.e, low = e.cls === 'bottom' || (e.cls === 'side' && s.p[1] > cy + 0.25), p = s.p;
      if (mode === 'grove') {
        tree(p[0], p[1], null, dom, low);
        if (rng() < 0.55) tree(p[0] + (rng() - 0.5) * 0.26, p[1] - 0.09, null, dom, low);
        if (rng() < 0.2)  tree(p[0] + (rng() - 0.5) * 0.26, p[1] + 0.08, null, dom, true);
        if (rng() < 0.14) tree(p[0] + (rng() - 0.5) * 0.28, p[1] - 0.16, null, dom, low);
      } else if (mode === 'sparse') {
        if (rng() < 0.5) tree(p[0], p[1], null, dom, low); else under(p[0], p[1]);
      } else if (rng() < 0.6) under(p[0], p[1]);
    });
  }
  G.verts.filter(v => !v.junction && v.hexes.size <= 2).forEach(v => {
    if (rng() < 0.8) tree(v.x + (rng() - 0.5) * 0.10, v.y + (rng() - 0.5) * 0.08, null, null, v.y > cy + 0.3);
  });
  G.centers.forEach(c => {
    for (let k = 0; k < 14; k++) {
      const px = c.x + (rng() * 2 - 1) * HX, py = c.y + (rng() * 2 - 1) * 0.58;
      if (!hexInside(px - c.x, py - c.y, 0.98)) continue;
      if (rng() < 0.38) tree(px, py, { scale: 0.8 + rng() * 0.25 }, null, py > cy + 0.35);
    }
  });

  // Balance outer rim tree density
  {
    const dEdge = (x, y, e) => {
      const dx = e.b[0] - e.a[0], dy = e.b[1] - e.a[1];
      const t = Math.max(0, Math.min(1, ((x - e.a[0]) * dx + (y - e.a[1]) * dy) / (dx * dx + dy * dy)));
      return Math.hypot(x - (e.a[0] + dx * t), (y - (e.a[1] + dy * t)) * 1.4);
    };
    const classes = ['top', 'side', 'bottom'], len = { top: 0, side: 0, bottom: 0 };
    outer.forEach(e => len[e.cls] += e.len);
    const members = () => {
      const m = { top: [], side: [], bottom: [] };
      placed.filter(o => o.cat === 'tree').forEach(o => {
        let best = null, bd = 1e9;
        outer.forEach(e => { const d = dEdge(o.x, o.y, e); if (d < bd) { bd = d; best = e; } });
        if (bd < 0.32) m[best.cls].push(o);
      });
      return m;
    };
    let m = members();
    const mean = (m.top.length + m.side.length + m.bottom.length) / (len.top + len.side + len.bottom);
    classes.forEach(cl => {
      const target = Math.round(len[cl] * mean);
      let list = m[cl];
      if (list.length > target + 1) {
        const drop = list.length - target;
        for (let i = 0; i < drop; i++) {
          const pick = list.splice(Math.floor(rng() * list.length), 1)[0], ix = placed.indexOf(pick);
          if (ix >= 0) placed.splice(ix, 1);
        }
      } else if (list.length < target - 1) {
        const need = target - list.length, es = outer.filter(e => e.cls === cl);
        let added = 0, guard = 0;
        while (added < need && guard++ < 160) {
          const e = es[Math.floor(rng() * es.length)], p = onEdge(e, rng(), -0.08 + rng() * 0.10);
          if (tree(p[0], p[1], null, null, cl !== 'top')) added++;
        }
      }
    });
  }

  // 4. Roman Laurel Shrubs & Travertine Boulders
  G.verts.filter(v => v.junction).forEach(v => { if (rng() < 0.45) under(v.x + (rng() - 0.5) * 0.2, v.y + (rng() - 0.5) * 0.12); });
  interior.forEach(e => { if (rng() < 0.35) under(e.mid[0] + (rng() - 0.5) * 0.24, e.mid[1] + (rng() - 0.5) * 0.12); });
  outer.forEach(e => { if (rng() < 0.38) under(...onEdge(e, rng(), -0.03)); });
  G.centers.forEach(c => {
    for (let k = 0; k < 5; k++) {
      const px = c.x + (rng() * 2 - 1) * HX, py = c.y + (rng() * 2 - 1) * 0.58;
      if (hexInside(px - c.x, py - c.y, 0.96) && rng() < 0.3) under(px, py);
    }
  });

  // 5. Small Roman Props (Amphorae, SPQR Legion Standards, Bronze Braziers, Travertine Benches)
  [['romanAmphorae', 3], ['legionStandard', 2], ['romanBrazier', 2], ['travertineBench', 2]].forEach(([k, n]) => {
    for (let i = 0; i < cnt(n); i++) {
      const e = outer[Math.floor(rng() * outer.length)], p = onEdge(e, 0.15 + rng() * 0.7, -0.04 + rng() * 0.06);
      place(k, p[0], p[1], { minT: 1, maxT: 4, prop: true });
    }
  });
  let pi = 0;
  placed.filter(o => o.prop).forEach(o => { o.minT = pi++ < 4 ? 1 : 2; });

  // Cycle residences through all 4 isometric facings
  {
    const houses = placed.filter(o => /^(romanDomus|romanInsula|patricianVilla)$/.test(o.kind)).sort((a, b) => a.x - b.x || a.y - b.y);
    const cyc = [0, 3, 1, 2];
    houses.forEach((o, i) => { o.v = ((o.v >> 2) << 2) | cyc[i % 4]; });
    placed.filter(o => o.kind === 'victoryColumn' || o.kind === 'triumphalArch').forEach(o => { o.v = ((o.v >> 2) << 2) | (rng() < 0.5 ? 1 : 0); });
  }

  // Assign 5-tier thresholds (`1` Sparse -> `5` Immersive)
  const cuts = {
    tree:   [0.14, 0.34, 0.56, 0.78, 1.0],
    shrub:  [0.05, 0.24, 0.48, 0.74, 1.0],
    rock:   [0.18, 0.40, 0.65, 0.85, 1.0],
    prop:   [1, 1, 1, 1, 1],
    struct: [0, 0, 0, 0, 0],
    ruin:   [0, 0, 0, 0, 0],
    hill:   [0, 0, 0, 0, 0]
  };
  placed.forEach(o => {
    const c = cuts[o.cat] || cuts.tree;
    let t = 1;
    while (t < 5 && o.pri > c[t - 1]) t++;
    o.tier = Math.max(t, o.minT);
    if (o.cat === 'prop' || o.cat === 'struct' || o.cat === 'ruin' || o.cat === 'hill') o.tier = o.minT;
  });

  // Maintain lush Tuscan pine/cypress grove ratio (>= 64%)
  const count = t => {
    const vis = placed.filter(o => o.tier <= t && t <= o.maxT);
    const tr = vis.filter(o => o.cat === 'tree').length;
    return { n: vis.length, tr };
  };
  for (let t = 1; t <= 5; t++) {
    let guard = 0;
    while (guard++ < 320) {
      const c = count(t);
      if (c.tr / Math.max(1, c.n) >= 0.64) break;
      const pool = placed.filter(o => o.tier <= t && t <= o.maxT);
      const cand = (pool.filter(o => o.cat === 'shrub').sort((a, b) => b.pri - a.pri)[0]) ||
                   (pool.filter(o => o.prop && o.minT > 1).sort((a, b) => b.pri - a.pri)[0]);
      if (!cand) break;
      cand.tier = Math.min(6, cand.tier + 1);
    }
  }

  placed.forEach(o => {
    const over = G.centers.filter(c => Math.abs(o.x - c.x) < 1.0);
    o.layer = over.length && o.y > Math.max(...over.map(c => c.y)) + 0.05 ? 'front' : 'back';
  });
  placed.sort((a, b) => a.y - b.y);
  return (ROME_PLAN_CACHE[shape] = { G, objs: placed, rng });
}

/* ---- Darker & Warmer Tuscan Earth, Travertine Flagstones & Burnt-Sienna Paths ---- */
function romeGround(c, G, R, ox, oy, m, col, seed) {
  const poly = i => HV.map(v => [ox + m * (G.centers[i].x + v[0]) * R, oy + (G.centers[i].y + v[1]) * R]);
  const r = mulberry(seed), outer = G.edges.filter(e => e.outer), P = p => [ox + m * p[0] * R, oy + p[1] * R];

  c.save();
  c.lineJoin = 'round';
  c.lineCap = 'round';
  for (let i = 1; i <= 6; i++) {
    c.globalAlpha = 0.11 - i * 0.014;
    c.strokeStyle = col;
    c.lineWidth = R * 0.06 * i;
    c.beginPath();
    outer.forEach(e => { const a = P(e.a), b = P(e.b); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); });
    c.stroke();
  }
  c.globalAlpha = 1;
  G.centers.forEach((_, i) => TH.poly(c, poly(i), col, col, 2));

  c.save();
  c.beginPath();
  G.centers.forEach((_, i) => {
    poly(i).forEach((p, k) => k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
    c.closePath();
  });
  c.clip();

  const bx = [ox + Math.min(m * G.bbox.minX, m * G.bbox.maxX) * R, oy + G.bbox.minY * R, (G.bbox.maxX - G.bbox.minX) * R, (G.bbox.maxY - G.bbox.minY) * R];
  const pt = () => [bx[0] + r() * bx[2], bx[1] + r() * bx[3]];
  const soft = (x, y, rx, ry, rgb, a) => {
    c.save();
    c.translate(x, y);
    c.scale(1, ry / rx);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, `rgba(${rgb},${a})`);
    g.addColorStop(0.6, `rgba(${rgb},${a * 0.55})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    c.fillStyle = g;
    c.beginPath();
    c.arc(0, 0, rx, 0, 7);
    c.fill();
    c.restore();
  };

  // Warmer, slightly darker Sienese ochre & deep olive-earth meadow patches
  for (let k = 0; k < 48; k++) {
    const p = pt(), w = R * (0.42 + r() * 0.85);
    soft(p[0], p[1], w, w * 0.4, r() < 0.55 ? '168, 146, 74' : '74, 92, 42', r() < 0.55 ? 0.25 : 0.24);
  }
  // Warm burnt-terracotta & Via Appia Roman stone road patches
  for (let k = 0; k < 14; k++) {
    const p = pt(), w = R * (0.28 + r() * 0.45);
    soft(p[0], p[1], w, w * 0.4, '196, 162, 118', 0.26);
  }
  // Warm travertine & basalt polygonal Roman road flagstones
  for (let k = 0; k < 34; k++) {
    const p = pt();
    TH.ell(c, p[0], p[1], R * (0.025 + r() * 0.015), R * 0.014, k % 3 === 0 ? 'rgba(92, 86, 78, 0.52)' : 'rgba(223, 208, 180, 0.58)');
  }
  // Warm autumn Tuscan grass & herb tufts
  for (let k = 0; k < 150; k++) {
    const p = pt(), h = R * (0.045 + r() * 0.055);
    for (let j = 0; j < 3; j++) {
      TH.ln(c, [p[0], p[1]], [p[0] + (j - 1) * h * 0.5, p[1] - h], ['#627536', '#848f48', '#a69652'][(k + j) % 3], R * 0.011);
    }
  }

  c.restore();
  c.restore();
}

const ROME_THEME = { id: 'rome', assets: ROME_ASSETS, plan: getRomePlan, ground: romeGround, groundCol: '#768646', top: 1.95 };
const ROME_TIER_NAMES = ['Sparse', 'Light', 'Medium', 'Heavy', 'Immersive'];
function bakeLandRome(shape, tier, R, opts) { return bakeLandTheme(ROME_THEME, shape, tier, R, opts); }
function drawLandRomeBack(ctx, x, y, land) { ctx.drawImage(land.back, x - land.ox, y - land.oy, land.w, land.h); }
function drawLandRomeFront(ctx, x, y, land) { const r = land.frontRect; ctx.drawImage(land.front, x - land.ox + r.x, y - land.oy + r.y, r.w, r.h); }
function landRomeSlots(land, R) { return land.centers.map(c => ({ x: c.x, y: c.y, rx: LAND_KEEP.rx * R, ry: LAND_KEEP.ry * R })); }
return Object.freeze({ bake: (shape, tier, radius, opts) => bakeLandRome(shape, tier === 4 ? 5 : tier, radius, opts), drawBack: drawLandRomeBack, drawFront: (ctx, x, y, land) => land.sprites.slice().sort((a,b) => a.y-b.y).forEach(s => drawScenicSprite(ctx,s,x+s.x,y+s.y)) });
})()
});
