/* ============================================================================
   COMPANY OF COASTERS — ALPHA v1.7 CORE ENGINE & UI CONTROLLER (engine.js)
   ============================================================================ */

let draftState = {
  humanTargetCount: 1,
  currentHumanIdx: 0,
  draftedPlayers: [],
  takenLegendIds: new Set(),
  selectedLegendId: "walt_disney",
  customLegendData: null,
  tempPosTraits: new Set(),
  tempNegTraits: new Set()
};

let gameState = {
  year: 1,
  maxYears: 200,
  winAttendance: 50000000,
  players: [],
  activePlayerIdx: 0,
  inspectedPlayerIdx: 0,
  selectedParkId: null,
  selectedPlotId: null,
  selectedCampusTileKey: "-2,4",
  zoneEditor: { active: false, name: "", color: "#f472b6", selectedKeys: new Set(), editingZoneId: null },
  unlockedRides: new Set(STARTING_UNLOCKED_IDS),
  records: {},
  logs: [],
  currentTurnNews: [],
  gameOver: false,
  tutorialStep: 0,
  tutorialEnabled: true,
  hexGrid: [],
  hexByKey: new Map(),
  selectedHexKey: null,
  hoveredHexKey: null,
  mapViewMode: "national",
  camera: { x: 0, y: 0, zoom: 1.0, isDragging: false, startX: 0, startY: 0, moved: false },
  buildContext: { plotId: null, category: "flat", selectedModelId: null },
  renameContext: { type: null, parkId: null, plotId: null, rideId: null },
  lastTurnReport: { page: 1, yearFinished: 1, attendanceRows: [], newsHeadlines: [], awardsGiven: [], tourismClimate: null }
};

let uidCounter = 1000;
function nextUid(prefix) { return `${prefix}_${++uidCounter}`; }

/* --- 1. HEX GRID & GEOGRAPHY HELPERS --- */

function offsetToAxial(col, row) {
  return { q: col - Math.floor(row / 2), r: row };
}

function hexDistance(a, b) {
  return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
}

function getRegionStateLabel(col, row) {
  if (col <= 4 && row <= 5) return "Pacific Northwest (WA/OR)";
  if (col <= 5 && row >= 6) return "California Coast & Metro";
  if (col >= 5 && col <= 9 && row >= 10 && row <= 15) return "Mojave & Las Vegas / Phoenix";
  if (col >= 10 && col <= 15 && row <= 11) return "Rocky Mountains & Front Range";
  if (col <= 13 && row <= 10) return "Great Basin & Intermountain West";
  if (col <= 13 && row > 10) return "Desert Southwest (AZ/NM)";
  if (col >= 14 && col <= 22 && row >= 14) return "Texas Triangle & Gulf Coast";
  if (col >= 14 && col <= 22 && row < 14) return "Great Plains Heartland";
  if (col >= 22 && col <= 29 && row <= 10) return "Great Lakes & Midwest Coaster Belt";
  if (col >= 23 && col <= 30 && row > 10 && row <= 17) return "Southeast & Piedmont (GA/NC/TN)";
  if (col >= 29 && row >= 18) return "Florida Peninsula (Orlando/Miami/Tampa)";
  if (col >= 32 && row <= 9) return "Northeast Megalopolis (NYC/BOS/PHL/DC)";
  return "Mid-Atlantic & Ohio River Valley";
}

function buildUSHexGrid() {
  gameState.hexGrid = [];
  gameState.hexByKey = new Map();
  const charMap = { B: "barren", R: "rural", S: "suburban", U: "urban", D: "destination" };

  for (let row = 0; row < US_ASCII_ROWS.length; row++) {
    const line = US_ASCII_ROWS[row];
    for (let col = 0; col < line.length; col++) {
      const ch = line[col];
      if (!charMap[ch]) continue;
      const { q, r } = offsetToAxial(col, row);
      const key = `${col},${row}`;
      const hexObj = {
        key, col, row, q, r,
        traitId: charMap[ch],
        regionName: getRegionStateLabel(col, row),
        parkId: null,
        ownerId: null
      };
      gameState.hexGrid.push(hexObj);
      gameState.hexByKey.set(key, hexObj);
    }
  }
}

function getHexClusterBonusInfo(hex) {
  if (!hex) return { count: 0, bonus: 0 };
  let count = 0;
  for (const p of gameState.players) {
    for (const pk of p.parks) {
      const pkHex = gameState.hexByKey.get(pk.hexKey);
      if (!pkHex || pkHex.key === hex.key) continue;
      const dist = hexDistance(hex, pkHex);
      if (dist >= 1 && dist <= 3) count++;
    }
  }
  return { count, bonus: +(count * 0.10).toFixed(2) };
}

function getTotalHexAttendanceMultiplier(hex) {
  if (!hex) return 1.0;
  return +(HEX_TRAITS[hex.traitId].attMult + getHexClusterBonusInfo(hex).bonus).toFixed(2);
}

function canPlayerBuildParkOnHex(player, hex) {
  if (!hex) return { allowed: false, reason: "Invalid hex" };
  if (hex.parkId) return { allowed: false, reason: "Hex already occupied by a theme park" };
  let oppAdj = false, ownAdj = false;
  for (const p of gameState.players) {
    for (const pk of p.parks) {
      const pkHex = gameState.hexByKey.get(pk.hexKey);
      if (pkHex && hexDistance(hex, pkHex) <= 1) {
        if (p.id === player.id) ownAdj = true;
        else oppAdj = true;
      }
    }
  }
  if (oppAdj && !ownAdj) {
    return { allowed: false, reason: "Blocked by rival border (within 1 hex of an opponent without an adjacent park of your own)" };
  }
  return { allowed: true, reason: ownAdj && oppAdj ? "Contested Border Hex" : "Available Regional Market" };
}

function getHexParkPricesForPlayer(player, hex) {
  const trait = HEX_TRAITS[hex.traitId];
  const combined = trait.priceMult * getPlayerParkPurchaseMultiplier(player);
  return {
    smallCost:  +(10 * combined).toFixed(2),
    mediumCost: +(25 * combined).toFixed(2),
    largeCost:  +(40 * combined).toFixed(2),
    smallExp:   +(PARK_SIZE_SPECS.small.baseClearCost * trait.priceMult).toFixed(2),
    mediumExp:  +(PARK_SIZE_SPECS.medium.baseClearCost * trait.priceMult).toFixed(2),
    largeExp:   +(PARK_SIZE_SPECS.large.baseClearCost * trait.priceMult).toFixed(2)
  };
}

/* --- 2. LEGEND & SCENERY MULTIPLIERS --- */

function hasCustomTrait(player, traitId) {
  return player.legend.isCustom && player.legend.traits && player.legend.traits.includes(traitId);
}

function getCategorySceneryScale(cat) {
  return (cat === "coaster" || cat === "tracked") ? 2.0 : (cat === "facility" ? 0.5 : 1.0);
}

function modelExistsInOtherChainPark(player, currentParkId, modelId) {
  for (const pk of player.parks) {
    if (pk.id === currentParkId) continue;
    for (const pl of pk.plots) if (pl.rides.some(r => r.modelId === modelId)) return true;
  }
  return false;
}

function getPlayerParkPurchaseMultiplier(player) {
  let m = 1.0;
  if (player.legend.id === "michael_eisner") m *= 0.70;
  if (player.legend.id === "roland_mack") m *= 1.20;
  if (player.legend.id === "angus_wynne") m *= 0.50;
  return m;
}

function getPlayerPlotSceneryMultiplier(player, isUpg) {
  let m = 1.0;
  if (player.legend.id === "jim_reid") m *= 1.15;
  if (player.legend.id === "john_arie") m *= 1.10;
  if (isUpg && player.legend.id === "roland_mack") m *= 0.95;
  if (isUpg && player.legend.id === "angus_wynne") m *= 1.10;
  if (hasCustomTrait(player, "pos_plot_scenery")) m *= 0.90;
  if (hasCustomTrait(player, "neg_plot_scenery")) m *= 1.10;
  return m;
}

function getPlayerRideSceneryMultiplier(player, isUpg) {
  let m = 1.0;
  if (player.legend.id === "john_arie") m *= 1.10;
  if (isUpg && player.legend.id === "roland_mack") m *= 0.95;
  if (isUpg && player.legend.id === "angus_wynne") m *= 1.10;
  if (hasCustomTrait(player, "pos_ride_scenery")) m *= 0.90;
  if (hasCustomTrait(player, "neg_ride_scenery")) m *= 1.10;
  return m;
}

function getPlayerResearchFeeMultiplier(player) {
  let m = 1.0;
  if (hasCustomTrait(player, "pos_research_disc")) m *= 0.50;
  if (hasCustomTrait(player, "neg_research_tax")) m *= 1.50;
  return m;
}

function getPlayerMaintAndRepairMultiplier(player) {
  let m = 1.0;
  if (hasCustomTrait(player, "pos_maint_disc")) m *= 0.60;
  if (hasCustomTrait(player, "neg_maint_tax")) m *= 1.10;
  return m;
}

function getPlayerRideBuildMultiplier(player, park, model, cat) {
  if (cat === "facility") return { mult: 1.0, notes: ["Standard Facility Price"] };
  let mult = 1.0, notes = [];
  if (cat === "flat") {
    if (player.legend.id === "michael_eisner" || player.legend.id === "hugo_herschend") mult *= 1.10;
    if (player.legend.id === "john_arie") { mult *= 0.85; notes.push("John Arie Jr. -15% Flat"); }
    if (hasCustomTrait(player, "pos_flat_disc")) mult *= 0.92;
    if (hasCustomTrait(player, "neg_flat_tax")) mult *= 1.08;
  } else if (cat === "coaster") {
    if (hasCustomTrait(player, "pos_coaster_disc")) mult *= 0.95;
    if (hasCustomTrait(player, "neg_coaster_tax")) mult *= 1.05;
  }
  if (model.era === "classic") {
    if (hasCustomTrait(player, "pos_classic_disc")) mult *= 0.95;
    if (hasCustomTrait(player, "neg_classic_tax")) mult *= 1.05;
  } else if (model.era === "modern") {
    if (hasCustomTrait(player, "pos_modern_disc")) mult *= 0.95;
    if (hasCustomTrait(player, "neg_modern_tax")) mult *= 1.05;
  } else if (model.era === "advanced") {
    if (hasCustomTrait(player, "pos_adv_disc")) mult *= 0.95;
    if (hasCustomTrait(player, "neg_adv_tax")) mult *= 1.05;
  }
  if (player.legend.id === "matt_ouimet" && (player.ridesBuiltThisTurn || 0) === 0) {
    mult *= 0.95;
    notes.push("Matt Ouimet 1st Ride (-5%)");
  }
  if (player.legend.id === "michael_eisner" && (park.eisnerDiscountRidesLeft || 0) > 0) {
    mult *= 0.60;
    notes.push(`Eisner New Park (-40%, ${park.eisnerDiscountRidesLeft} left)`);
  }
  if (modelExistsInOtherChainPark(player, park.id, model.id)) {
    if (player.legend.id === "jim_reid") { mult *= 0.85; notes.push("Jim Reid-Anderson Clone (-15%)"); }
    if (hasCustomTrait(player, "pos_clone_discount")) { mult *= 0.90; notes.push("Chain Clone (-10%)"); }
  }
  return { mult, notes };
}

function getPlayerHarmonyBonusMultiplier(player) {
  let m = 1.0;
  if (player.legend.id === "walt_disney") m *= 2.0;
  if (hasCustomTrait(player, "pos_harmony")) m *= 1.5;
  if (hasCustomTrait(player, "neg_harmony")) m *= 0.5;
  return m;
}

/* --- 3. SETUP & LEGEND DRAFT --- */

function openSetupModal() {
  draftState.currentHumanIdx = 0;
  draftState.draftedPlayers = [];
  draftState.takenLegendIds = new Set();
  draftState.selectedLegendId = "walt_disney";
  draftState.customLegendData = null;
  document.getElementById("setupStepConfig").style.display = "block";
  toggleSetupModeUI();
  renderPremadeLegendsGrid();
  selectPremadeLegend("walt_disney");
  document.getElementById("setupModal").classList.add("active");
}

function toggleSetupModeUI() {
  const mode = document.getElementById("setupMode").value;
  document.getElementById("singlePlayerCountBox").style.display = mode === "single" ? "block" : "none";
  document.getElementById("singlePlayerDiffBox").style.display = mode === "single" ? "block" : "none";
  document.getElementById("multiplayerCountBox").style.display = mode === "hotseat" ? "block" : "none";
  updateDraftHeadingText();
}

function updateDraftHeadingText() {
  const mode = document.getElementById("setupMode").value;
  const totalHumans = mode === "single" ? 1 : Math.min(8, Math.max(2, parseInt(document.getElementById("setupHumanCount").value) || 2));
  draftState.humanTargetCount = totalHumans;
  document.getElementById("draftPlayerHeading").textContent = totalHumans === 1
    ? "Select Your Legend, Chain & First Park"
    : `Player ${draftState.currentHumanIdx + 1} of ${totalHumans}: Draft Your Legend`;
  document.getElementById("btnConfirmDraftPlayer").textContent = (draftState.currentHumanIdx + 1 < totalHumans)
    ? `Lock In Player ${draftState.currentHumanIdx + 1} ➔`
    : `Launch Chain Empire ➔`;
}

function getLegendPortraitHTML(legend, cssClass) {
  const imagePath = legend.img || `images/${legend.id}.jpg`;
  const fallbackPath = `images/${legend.id}.png`;
  return `<img class="${escapeHtml(cssClass)}" src="${escapeHtml(imagePath)}" alt="${escapeHtml(legend.name)} portrait" onerror="this.onerror=function(){this.style.display='none'};this.src='${escapeHtml(fallbackPath)}'">`;
}

function renderSelectedLegendSpotlight() {
  const spotlight = document.getElementById("selectedLegendSpotlight");
  if (!spotlight) return;
  const legend = draftState.customLegendData ||
    PREMADE_LEGENDS.find(item => item.id === draftState.selectedLegendId);
  if (!legend) {
    spotlight.innerHTML = "";
    return;
  }
  const title = legend.title || (legend.isCustom ? "Independent Theme Park Operator" : "Theme Park Leader");
  spotlight.innerHTML = `
    <div class="spotlight-portrait-wrap">
      ${getLegendPortraitHTML(legend, "legend-portrait-img")}
    </div>
    <div class="spotlight-copy">
      <strong>${escapeHtml(legend.name)}</strong>
      <div class="spotlight-title">${escapeHtml(title)}</div>
      <div class="spotlight-description">${escapeHtml(legend.desc)}</div>
    </div>`;
}

function renderPremadeLegendsGrid() {
  const grid = document.getElementById("premadeLegendsGrid");
  grid.innerHTML = "";
  for (const leg of PREMADE_LEGENDS) {
    const isTaken = draftState.takenLegendIds.has(leg.id);
    const isSel = !draftState.customLegendData && draftState.selectedLegendId === leg.id;
    const div = document.createElement("div");
    div.className = `legend-portrait-card ${isSel ? "selected" : ""} ${isTaken ? "taken" : ""}`;
    div.setAttribute("role", "button");
    div.setAttribute("tabindex", isTaken ? "-1" : "0");
    div.setAttribute("aria-label", `${leg.name}${isSel ? ", selected" : ""}${isTaken ? ", already drafted" : ""}`);
    div.setAttribute("aria-pressed", String(isSel));
    div.onclick = () => selectPremadeLegend(leg.id);
    div.onkeydown = event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectPremadeLegend(leg.id);
      }
    };
    div.innerHTML = `${getLegendPortraitHTML(leg, "legend-portrait-img")}${isTaken ? '<span class="badge badge-red legend-status-pill">Drafted</span>' : (isSel ? '<span class="badge badge-gold legend-status-pill">Selected</span>' : '')}<span class="legend-name-overlay">${escapeHtml(leg.name)}</span>`;
    grid.appendChild(div);
  }
  if (draftState.customLegendData) {
    const cDiv = document.createElement("div");
    cDiv.className = "legend-portrait-card selected";
    cDiv.setAttribute("aria-label", `${draftState.customLegendData.name}, custom legend, selected`);
    cDiv.innerHTML = `<span class="badge badge-gold legend-status-pill">Selected</span><span class="legend-name-overlay">${escapeHtml(draftState.customLegendData.name)} · Custom</span>`;
    grid.appendChild(cDiv);
  }
  renderSelectedLegendSpotlight();
}

function selectPremadeLegend(legendId) {
  if (draftState.takenLegendIds.has(legendId)) return;
  draftState.customLegendData = null;
  draftState.selectedLegendId = legendId;
  const leg = PREMADE_LEGENDS.find(l => l.id === legendId);
  const ceoInput = document.getElementById("setupCeoName");
  ceoInput.value = leg.name;
  ceoInput.readOnly = true;
  document.getElementById("setupChainName").value = leg.defaultChain;
  document.getElementById("setupParkName").value = leg.defaultPark;
  renderPremadeLegendsGrid();
}

function openCustomLegendModal() {
  draftState.tempPosTraits = new Set();
  draftState.tempNegTraits = new Set();
  renderCustomTraitsModalLists();
  document.getElementById("customLegendModal").classList.add("active");
}

function renderCustomTraitsModalLists() {
  document.getElementById("posTraitCount").textContent = draftState.tempPosTraits.size;
  document.getElementById("negTraitCount").textContent = draftState.tempNegTraits.size;
  const posEl = document.getElementById("posTraitsList");
  posEl.innerHTML = "";
  for (const t of CUSTOM_POS_TRAITS) {
    const sel = draftState.tempPosTraits.has(t.id);
    const d = document.createElement("div");
    d.className = `trait-pill ${sel ? 'selected-pos' : ''}`;
    d.onclick = () => {
      if (sel) draftState.tempPosTraits.delete(t.id);
      else if (draftState.tempPosTraits.size < 2) draftState.tempPosTraits.add(t.id);
      renderCustomTraitsModalLists();
    };
    d.innerHTML = `<span>${sel ? '✅' : '⬜'}</span> <span>${escapeHtml(t.label)}</span>`;
    posEl.appendChild(d);
  }
  const negEl = document.getElementById("negTraitsList");
  negEl.innerHTML = "";
  for (const t of CUSTOM_NEG_TRAITS) {
    const sel = draftState.tempNegTraits.has(t.id);
    const d = document.createElement("div");
    d.className = `trait-pill ${sel ? 'selected-neg' : ''}`;
    d.onclick = () => {
      if (sel) draftState.tempNegTraits.delete(t.id);
      else if (draftState.tempNegTraits.size < 2) draftState.tempNegTraits.add(t.id);
      renderCustomTraitsModalLists();
    };
    d.innerHTML = `<span>${sel ? '⚠️' : '⬜'}</span> <span>${escapeHtml(t.label)}</span>`;
    negEl.appendChild(d);
  }
  document.getElementById("btnSaveCustomLegend").disabled = !(draftState.tempPosTraits.size === 2 && draftState.tempNegTraits.size === 2);
}

function applyCustomLegendSelection() {
  const ceoName = document.getElementById("customLegendCeoInput").value.trim() || "Custom CEO";
  const allPicked = [...draftState.tempPosTraits, ...draftState.tempNegTraits];
  const labels = allPicked.map(id => (CUSTOM_POS_TRAITS.find(x => x.id === id) || CUSTOM_NEG_TRAITS.find(x => x.id === id)).label);
  draftState.customLegendData = { id: nextUid("custom_leg"), name: ceoName, isCustom: true, traits: allPicked, desc: labels.join(" • ") };
  const ceoInput = document.getElementById("setupCeoName");
  ceoInput.readOnly = false;
  ceoInput.value = ceoName;
  closeModal("customLegendModal");
  renderPremadeLegendsGrid();
}

function confirmPlayerSetupStep() {
  updateDraftHeadingText();
  const ceoName = document.getElementById("setupCeoName").value.trim() || "CEO";
  const chainName = document.getElementById("setupChainName").value.trim() || "ThrillCorp Chain";
  const parkName = document.getElementById("setupParkName").value.trim() || "Adventure Park";
  let legendObj = draftState.customLegendData
    ? { ...draftState.customLegendData, name: ceoName }
    : { ...PREMADE_LEGENDS.find(l => l.id === draftState.selectedLegendId), isCustom: false, traits: [] };
  if (!draftState.customLegendData) draftState.takenLegendIds.add(legendObj.id);
  draftState.draftedPlayers.push({ ceoName, chainName, parkName, legend: legendObj });
  draftState.currentHumanIdx++;
  if (draftState.currentHumanIdx < draftState.humanTargetCount) {
    document.getElementById("setupStepConfig").style.display = "none";
    const nextAvail = PREMADE_LEGENDS.find(l => !draftState.takenLegendIds.has(l.id));
    if (nextAvail) selectPremadeLegend(nextAvail.id);
    updateDraftHeadingText();
    renderPremadeLegendsGrid();
  } else {
    finalizeSetupAndLaunchGame();
  }
}

function pickRandomStartingHex() {
  const cands = gameState.hexGrid.filter(h => {
    if (h.parkId || h.traitId !== "suburban") return false;
    for (const p of gameState.players) {
      for (const pk of p.parks) {
        const oH = gameState.hexByKey.get(pk.hexKey);
        if (oH && hexDistance(h, oH) < 4) return false;
      }
    }
    return true;
  });
  if (cands.length > 0) return cands[Math.floor(Math.random() * cands.length)];
  const fb = gameState.hexGrid.filter(h => !h.parkId);
  return fb[Math.floor(Math.random() * fb.length)];
}

// Pointy-top hex positions for the centered 49-hex rounded campus.
const CAMPUS_HEX_R = 34;
const CAMPUS_HEX_VERTICAL_SCALE = 0.58;
const CAMPUS_ROUNDED_ROWS = [
  { v: -4, u: [1, 2, 3] },
  { v: -3, u: [-1, 0, 1, 2, 3, 4] },
  { v: -2, u: [-2, -1, 0, 1, 2, 3, 4] },
  { v: -1, u: [-2, -1, 0, 1, 2, 3] },
  { v: 0, u: [-3, -2, -1, 0, 1, 2, 3] },
  { v: 1, u: [-3, -2, -1, 0, 1, 2] },
  { v: 2, u: [-4, -3, -2, -1, 0, 1, 2] },
  { v: 3, u: [-3, -2, -1, 0] },
  { v: 4, u: [-3, -2, -1] }
];

function getCampusTilePixel(sx, sy) {
  return {
    x: CAMPUS_HEX_R * Math.sqrt(3) * sx,
    y: CAMPUS_HEX_R * 1.5 * sy * CAMPUS_HEX_VERTICAL_SCALE
  };
}

// Checks if two campus tiles are adjacent along one of the 4 diagonals (NW, NE, SW, SE)
function areCampusTilesDiagonalNeighbors(t1, t2) {
  if (!t1 || !t2) return false;
  const dq = t2.q - t1.q, dr = t2.r - t1.r;
  return (dq === 1 && dr === 0) || (dq === -1 && dr === 0) || (dq === 1 && dr === -1) || (dq === -1 && dr === 1);
}

function areCampusTilesAdjacent(t1, t2) {
  if (!t1 || !t2) return false;
  return hexDistance(t1, t2) === 1;
}

// Syncs park.tiles & park.zones into park.plots so AI, News, Awards & Maintenance work seamlessly
function syncParkPlotsMirror(park) {
  if (!park || !park.tiles) return;
  const byZone = new Map();
  for (const z of park.zones) {
    byZone.set(z.id, { id: z.id, name: z.name, color: z.color, themeLevel: 0, rides: [] });
  }
  const genericPlot = { id: "generic", name: "Generic (Unzoned)", color: "#f8fafc", themeLevel: 0, rides: [] };
  for (const r of park.rides) {
    const zId = r.zoneId && byZone.has(r.zoneId) ? r.zoneId : "generic";
    if (zId === "generic") genericPlot.rides.push(r);
    else byZone.get(zId).rides.push(r);
  }
  park.plots = [...byZone.values(), genericPlot];
}

function generate49HexCampusDiamond(tier, extraWoods = 0) {
  const spec = PARK_SIZE_SPECS[tier] || PARK_SIZE_SPECS.medium;
  const rawCoords = [];
  for (const row of CAMPUS_ROUNDED_ROWS) {
    for (const u of row.u) {
      const v = row.v;
      const q = u;
      const r = v;
      const sx = u + v * 0.5;
      const sy = v;
      const { x: px, y: py } = getCampusTilePixel(sx, sy);
      rawCoords.push({ q, r, u, v, sx, sy, px, py });
    }
  }

  const entranceCoord = rawCoords.find(c => c.u === -2 && c.v === 4);
  const plazaCoords = rawCoords.filter(c => c !== entranceCoord);
  const coordByRowAndX = new Map(plazaCoords.map(c => [`${c.v},${c.sx}`, c]));
  const plazaGroups = plazaCoords
    .filter(c => c.sx >= 0)
    .map(c => ({
      tiles: c.sx === 0 ? [c] : [c, coordByRowAndX.get(`${c.v},${-c.sx}`)],
      distToPlaza: Math.hypot(c.sx * 0.95, (c.v - 2.2) * 1.05)
    }))
    .sort((a, b) =>
      a.distToPlaza - b.distToPlaza ||
      a.tiles[0].v - b.tiles[0].v ||
      a.tiles[0].sx - b.tiles[0].sx
    );
  const tilesToClear = Math.max(0, spec.clearedCount - 1);
  const bestGroups = Array(tilesToClear + 1).fill(null);
  bestGroups[0] = { distance: 0, tiles: [] };
  for (const group of plazaGroups) {
    const groupSize = group.tiles.length;
    for (let count = tilesToClear; count >= groupSize; count--) {
      const previous = bestGroups[count - groupSize];
      if (!previous) continue;
      const distance = previous.distance + group.distToPlaza * groupSize;
      if (!bestGroups[count] || distance < bestGroups[count].distance) {
        bestGroups[count] = {
          distance,
          tiles: [...previous.tiles, ...group.tiles]
        };
      }
    }
  }
  const clearedKeys = new Set([
    `${entranceCoord.q},${entranceCoord.r}`,
    ...(bestGroups[tilesToClear]?.tiles || [])
      .map(c => `${c.q},${c.r}`)
  ]);
  const tiles = [];
  rawCoords.forEach(c => {
    const key = `${c.q},${c.r}`;
    const isEntrance = c.u === -2 && c.v === 4;
    tiles.push({
      key,
      q: c.q,
      r: c.r,
      u: c.u,
      v: c.v,
      sx: c.sx,
      sy: c.sy,
      px: c.px,
      py: c.py,
      isEntrance,
      state: isEntrance || clearedKeys.has(key) ? "cleared" : "woods",
      zoneId: null,
      themeLevel: 0,
      themedForZoneId: null,
      rideId: null,
      isSecondaryHex: false
    });
  });

  return {
    tiles,
    maxExpansions: spec.maxWoodsExpansions + extraWoods
  };
}

function createInitialParkForPlayer(parkName, legend, playerId, hexObj) {
  const parkId = nextUid("park");
  hexObj.parkId = parkId;
  hexObj.ownerId = playerId;

  const extraExp = legend.id === "roland_mack" ? 8 : 0;
  const { tiles, maxExpansions } = generate49HexCampusDiamond("starting", extraExp);

  const starterZone = { id: nextUid("zone"), name: "Main Street Plaza", color: "#7dd3fc" };
  const zones = [starterZone];

  const clearedBuildable = tiles.filter(t => t.state === "cleared" && !t.isEntrance);
  clearedBuildable.forEach(t => { t.zoneId = starterZone.id; });

  const rides = [];
  function placeStarterFacility(tileObj, id, name, role, cost) {
    if (!tileObj) return;
    const fac = {
      id: nextUid("fac"),
      name,
      modelId: id,
      modelName: name,
      category: "facility",
      facilityRole: role,
      ...(role === "restaurant" ? {
        mealPrice: FOOD_AND_BEVERAGE_RULES.defaultMealPrice,
        lastFbStats: { mealsSold: 0, grossRev: 0, cogs: 0, fixedOpEx: 0, netProfit: 0 }
      } : {}),
      era: "classic",
      spaces: 1,
      primaryTileKey: tileObj.key,
      secondaryTileKey: null,
      zoneId: tileObj.zoneId,
      techPoints: 0,
      themeLevel: 0,
      themedForZoneId: tileObj.zoneId || "generic",
      totalInvestment: cost,
      age: 0,
      lifespan: 30,
      refurbCount: 0,
      cultClassic: false,
      cultChecked: false,
      status: "open",
      immuneToIssues: true,
      immunityTurns: 0,
      recordTags: []
    };
    tileObj.rideId = fac.id;
    rides.push(fac);
  }

  const facilityTile = (q, r) => clearedBuildable.find(t => t.q === q && t.r === r);
  placeStarterFacility(facilityTile(0, 1), "guest_services", "Guest Services", "guest_services", 2.5);
  placeStarterFacility(facilityTile(0, 2), "toilets", "Restrooms (Toilets)", "toilets", 1.0);
  placeStarterFacility(facilityTile(-1, 2), "restaurant", "Park Restaurant", "restaurant", 2.0);

  const parkObj = {
    id: parkId,
    name: parkName,
    hexKey: hexObj.key,
    tier: "starting",
    maxExpansions,
    expansionsBought: 0,
    expansionCost: 0.50,
    eisnerDiscountRidesLeft: 0,
    lastAttendance: 0,
    lastRollLabel: "—",
    yearsSinceLastAddition: 0,
    additionThisYear: true,
    newCoasterBuiltThisYear: false,
    lastFoodAndBeverageLedger: null,
    tiles,
    zones,
    rides,
    plots: []
  };
  syncParkPlotsMirror(parkObj);
  return parkObj;
}

function finalizeSetupAndLaunchGame() {
  const mode = document.getElementById("setupMode").value;
  gameState.tutorialEnabled = !document.getElementById("setupDisableTutorial").checked;
  buildUSHexGrid();
  gameState.year = 1;
  gameState.players = [];
  gameState.activePlayerIdx = 0;
  gameState.inspectedPlayerIdx = 0;
  gameState.unlockedRides = new Set(STARTING_UNLOCKED_IDS);
  gameState.logs = [];
  gameState.currentTurnNews = [];
  gameState.gameOver = false;
  gameState.mapViewMode = "national";

  draftState.draftedPlayers.forEach((dp, i) => {
    const pid = `p_${i + 1}`;
    const sHex = pickRandomStartingHex();
    gameState.players.push({
      id: pid,
      color: CHAIN_COLORS[i % CHAIN_COLORS.length],
      ceoName: dp.ceoName,
      chainName: dp.chainName,
      name: `${dp.ceoName} (${dp.chainName})`,
      legend: dp.legend,
      isAI: false,
      difficulty: "human",
      revenueMult: 1.0,
      cash: 30.0,
      totalAttendance: 0,
      ridesBuiltThisTurn: 0,
      parks: [createInitialParkForPlayer(dp.parkName, dp.legend, pid, sHex)]
    });
  });

  if (mode === "single") {
    const botCount = Math.min(7, Math.max(1, parseInt(document.getElementById("setupBotCount").value) || 3));
    const botDiff = document.getElementById("setupBotDifficulty").value;
    const diffMultMap = { easy: 0.90, medium: 1.10, hard: 1.30 };
    const remLegs = PREMADE_LEGENDS.filter(l => !draftState.takenLegendIds.has(l.id));
    for (let i = 0; i < botCount; i++) {
      const leg = remLegs[i % remLegs.length];
      draftState.takenLegendIds.add(leg.id);
      const pid = `bot_${i + 1}`;
      const sHex = pickRandomStartingHex();
      gameState.players.push({
        id: pid,
        color: CHAIN_COLORS[(draftState.draftedPlayers.length + i) % CHAIN_COLORS.length],
        ceoName: leg.name,
        chainName: leg.defaultChain,
        name: `${leg.name} • ${leg.defaultChain}`,
        legend: { ...leg, isCustom: false, traits: [] },
        isAI: true,
        difficulty: botDiff,
        revenueMult: diffMultMap[botDiff],
        cash: 30.0,
        totalAttendance: 0,
        ridesBuiltThisTurn: 0,
        parks: [createInitialParkForPlayer(leg.defaultPark, leg, pid, sHex)]
      });
    }
  }

  const p0 = gameState.players[0];
  gameState.selectedParkId = p0.parks[0].id;
  gameState.selectedHexKey = p0.parks[0].hexKey;
  recalculateGlobalRecords();
  addLog(`Year 1 started! ${p0.ceoName} leads ${p0.chainName}.`);
  closeModal("setupModal");
  resetMapCamera();
  renderAll();
  showWelcomeModal(p0);
}

function showWelcomeModal(p0) {
  const parkName = p0.parks[0].name;
  const hObj = gameState.hexByKey.get(p0.parks[0].hexKey);
  const title = p0.legend.title || "Independent Theme Park Operator";
  document.getElementById("welcomeModalBody").innerHTML = `
    <div class="welcome-legend-layout">
      <div class="welcome-legend-portrait">
        ${getLegendPortraitHTML(p0.legend, "legend-portrait-img")}
      </div>
      <div>
        <div class="card" style="border-color:var(--accent-gold);background:var(--accent-gold-light);padding:.9rem;">
          <p style="font-style:italic;color:var(--text-main);margin-bottom:.75rem;">"A new era begins for <strong>${escapeHtml(parkName)}</strong>, under the leadership of <strong>${escapeHtml(p0.chainName)}</strong>! Park CEO, <strong>${escapeHtml(p0.ceoName)}</strong> looks to welcome more guests throughout the coming seasons with exciting new changes and additions."</p>
          <p style="color:var(--text-muted);font-size:.88rem;">Welcome to <strong>Company of Coasters</strong>, where you step into the shoes of a theme park CEO in the <strong>${escapeHtml(hObj.regionName)}</strong> region, with the goal of growing your chain to welcome <strong>50 million guests annually</strong>.</p>
        </div>
        <div style="font-size:.8rem;color:var(--accent-blue);margin-top:.55rem;"><strong>${escapeHtml(title)}:</strong> ${escapeHtml(p0.legend.desc)}</div>
      </div>
    </div>`;
  document.getElementById("welcomeModal").classList.add("active");
}

function closeWelcomeAndStartTutorial() {
  closeModal("welcomeModal");
  if (gameState.tutorialEnabled) startInteractiveTutorial();
}

/* --- 4. TUTORIAL CONTROLLER --- */

const TUTORIAL_STEPS = [
  { title: "1. Contiguous US Population Hex Map", targetId: "panelCenterWorkspace", text: "The Lower-48 US Hex Map reflects real-world population & tourism pockets: Barren (0.8x Red), Rural (0.9x Orange), Suburban (1.0x Yellow), Urban (1.2x Light Green), and Destination (1.4x Strong Green). Every nearby park within 3 hexes adds +0.1x attendance!" },
  { title: "2. Facilities & Avoiding Score Penalties", targetId: "panelLeftSidebar", text: "Restrooms and restaurants serve cleared hexes within 2 hexes. Each uncovered hex loses 10% of its points for each missing amenity (up to 20%). Your Park also needs 1 Guest Services (-5% park score if missing). Build facilities in the Facilities tab—and theme them at HALF the cost of rides!" },
  { title: "3. Expanding & Territorial Borders", targetId: "hexInspectorCard", text: "Click any hex on the map to inspect its market multiplier and buy a new Small, Medium, or Large park. You cannot build within 1 hex of a rival's park unless you also own a park within 1 hex!" },
  { title: "4. Zooming Into Your Park Campus", targetId: "panelCenterWorkspace", text: "Double-click your park hex on the map (or click 'Manage Zones & Rides') to open its campus. Your starting park begins as one themed land; use Create / Rezone Land to divide it into custom themed lands!" },
  { title: "5. Chain Treasury & Doubled Scenery Costs", targetId: "hudBankBox", text: "Plot, Coaster, and Tracked Ride scenery costs are doubled (2x), while Flat Rides cost standard price (1x) and Facilities cost half price (0.5x). Reach 50,000,000 annual guests to win!" },
  { title: "6. Ending Your Season", targetId: "btnEndTurn", text: "When you finish building rides, facilities, and scenery for the turn, click 'End Turn ➔' to view the 4-page Annual Report!" }
];

function startInteractiveTutorial() {
  gameState.tutorialStep = 0;
  document.getElementById("tutorialFloatingBox").classList.add("active");
  renderTutorialStep();
}

function stepTutorial(delta) {
  gameState.tutorialStep += delta;
  if (gameState.tutorialStep >= TUTORIAL_STEPS.length) { endTutorial(); return; }
  if (gameState.tutorialStep < 0) gameState.tutorialStep = 0;
  renderTutorialStep();
}

function renderTutorialStep() {
  document.querySelectorAll(".tutorial-highlight").forEach(el => el.classList.remove("tutorial-highlight"));
  const s = TUTORIAL_STEPS[gameState.tutorialStep];
  document.getElementById("tutorialStepBadge").textContent = `Tutorial ${gameState.tutorialStep + 1} / ${TUTORIAL_STEPS.length}`;
  document.getElementById("tutorialStepTitle").textContent = s.title;
  document.getElementById("tutorialStepText").textContent = s.text;
  document.getElementById("btnTutPrev").style.visibility = gameState.tutorialStep === 0 ? "hidden" : "visible";
  document.getElementById("btnTutNext").textContent = gameState.tutorialStep === TUTORIAL_STEPS.length - 1 ? "Finish Tutorial ✔" : "Next Tip ➔";
  const tEl = document.getElementById(s.targetId);
  if (tEl) tEl.classList.add("tutorial-highlight");
}

function endTutorial() {
  document.querySelectorAll(".tutorial-highlight").forEach(el => el.classList.remove("tutorial-highlight"));
  document.getElementById("tutorialFloatingBox").classList.remove("active");
}

/* --- 5. HTML5 CANVAS MAP RENDERER --- */

const HEX_RADIUS = 19, HEX_W = Math.sqrt(3) * HEX_RADIUS, HEX_H = 2 * HEX_RADIUS;

function getHexPixelCenter(col, row) {
  return { x: col * HEX_W + (row % 2 === 1 ? HEX_W / 2 : 0) + 60, y: row * (HEX_H * 0.75) + 60 };
}

function drawHexPolygon(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 30);
    const vx = cx + r * Math.cos(a), vy = cy + r * Math.sin(a);
    if (i === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
  }
  ctx.closePath();
}

function initMapCanvasEvents() {
  const canvas = document.getElementById("mapCanvas");
  window.addEventListener("resize", () => { resizeCanvas(); requestAnimationFrame(drawMapCanvas); });
  canvas.addEventListener("mousedown", e => {
    gameState.camera.isDragging = true;
    gameState.camera.moved = false;
    gameState.camera.startX = e.clientX - gameState.camera.x;
    gameState.camera.startY = e.clientY - gameState.camera.y;
  });
  window.addEventListener("mousemove", e => {
    if (gameState.camera.isDragging) {
      const nx = e.clientX - gameState.camera.startX, ny = e.clientY - gameState.camera.startY;
      if (Math.hypot(nx - gameState.camera.x, ny - gameState.camera.y) > 4) gameState.camera.moved = true;
      gameState.camera.x = nx; gameState.camera.y = ny;
      requestAnimationFrame(drawMapCanvas);
    } else handleCanvasHover(e);
  });
  window.addEventListener("mouseup", e => {
    if (gameState.camera.isDragging) {
      gameState.camera.isDragging = false;
      if (!gameState.camera.moved && e.target === canvas) handleCanvasClick(e);
    }
  });
  canvas.addEventListener("dblclick", e => handleCanvasDoubleClick(e));
  canvas.addEventListener("wheel", e => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.14 : 0.88;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const pz = gameState.camera.zoom, nz = Math.min(3.5, Math.max(0.55, pz * factor));
    gameState.camera.x = mx - ((mx - gameState.camera.x) / pz) * nz;
    gameState.camera.y = my - ((my - gameState.camera.y) / pz) * nz;
    gameState.camera.zoom = nz;
    requestAnimationFrame(drawMapCanvas);
  }, { passive: false });
  resizeCanvas();
}

function resizeCanvas() {
  const c = document.getElementById("mapCanvas");
  if (c && c.parentElement) { c.width = c.parentElement.clientWidth; c.height = c.parentElement.clientHeight; }
}

function resetMapCamera() {
  resizeCanvas();
  const c = document.getElementById("mapCanvas");
  if (gameState.mapViewMode === "national") {
    const mw = 40 * HEX_W + 120, mh = 23 * (HEX_H * 0.75) + 120;
    const bz = Math.min(1.35, Math.max(0.65, Math.min((c.width - 60) / mw, (c.height - 80) / mh)));
    gameState.camera.zoom = bz;
    gameState.camera.x = (c.width - mw * bz) / 2;
    gameState.camera.y = (c.height - mh * bz) / 2 - 10;
  } else {
    gameState.camera.zoom = 1.0;
    gameState.camera.x = c.width / 2;
    gameState.camera.y = c.height / 2;
  }
  requestAnimationFrame(drawMapCanvas);
}

function zoomMapBy(mult) {
  const c = document.getElementById("mapCanvas"), cx = c.width / 2, cy = c.height / 2;
  const pz = gameState.camera.zoom, nz = Math.min(3.5, Math.max(0.55, pz * mult));
  gameState.camera.x = cx - ((cx - gameState.camera.x) / pz) * nz;
  gameState.camera.y = cy - ((cy - gameState.camera.y) / pz) * nz;
  gameState.camera.zoom = nz;
  requestAnimationFrame(drawMapCanvas);
}

function screenToWorld(clientX, clientY) {
  const rect = document.getElementById("mapCanvas").getBoundingClientRect();
  return {
    wx: ((clientX - rect.left) - gameState.camera.x) / gameState.camera.zoom,
    wy: ((clientY - rect.top) - gameState.camera.y) / gameState.camera.zoom
  };
}

function findHexAtWorldPoint(wx, wy) {
  let closest = null, minDist = HEX_RADIUS * 0.95;
  for (const h of gameState.hexGrid) {
    const { x, y } = getHexPixelCenter(h.col, h.row);
    const d = Math.hypot(wx - x, wy - y);
    if (d < minDist) { minDist = d; closest = h; }
  }
  return closest;
}

function handleCanvasHover(e) {
  if (e.target !== document.getElementById("mapCanvas") || gameState.mapViewMode !== "national") return;
  const { wx, wy } = screenToWorld(e.clientX, e.clientY);
  const h = findHexAtWorldPoint(wx, wy);
  const k = h ? h.key : null;
  if (k !== gameState.hoveredHexKey) { gameState.hoveredHexKey = k; requestAnimationFrame(drawMapCanvas); }
}

function handleCanvasClick(e) {
  const { wx, wy } = screenToWorld(e.clientX, e.clientY);
  if (gameState.mapViewMode === "national") {
    const h = findHexAtWorldPoint(wx, wy);
    if (!h) return;
    gameState.selectedHexKey = h.key;
    if (h.parkId) {
      const ownerIdx = gameState.players.findIndex(p => p.id === h.ownerId);
      if (ownerIdx !== -1) {
        gameState.inspectedPlayerIdx = ownerIdx;
        gameState.selectedParkId = h.parkId;
        toggleParkDrawer(true);
      }
    }
    renderAll();
  } else {
    const p = gameState.players[gameState.inspectedPlayerIdx];
    const park = p.parks.find(pk => pk.id === gameState.selectedParkId) || p.parks[0];
    for (const node of getCampusPlotHexPositions(park)) {
      if (Math.hypot(wx - node.x, wy - node.y) < 88) {
        gameState.selectedPlotId = node.plot.id;
        toggleParkDrawer(true);
        renderParkDrawer();
        requestAnimationFrame(drawMapCanvas);
        break;
      }
    }
  }
}

function findCampusTileAtWorldPoint(park, wx, wy) {
  let closest = null, minDist = CAMPUS_HEX_R * 0.95;
  for (const t of park.tiles) {
    const d = Math.hypot(wx - t.px, (wy - t.py) / CAMPUS_HEX_VERTICAL_SCALE);
    if (d < minDist) { minDist = d; closest = t; }
  }
  return closest;
}

function handleCanvasClick(e) {
  const { wx, wy } = screenToWorld(e.clientX, e.clientY);
  if (gameState.mapViewMode === "national") {
    const h = findHexAtWorldPoint(wx, wy);
    if (!h) return;
    gameState.selectedHexKey = h.key;
    if (h.parkId) {
      const ownerIdx = gameState.players.findIndex(p => p.id === h.ownerId);
      if (ownerIdx !== -1) {
        gameState.inspectedPlayerIdx = ownerIdx;
        gameState.selectedParkId = h.parkId;
        toggleParkDrawer(true);
      }
    }
    renderAll();
  } else {
    const p = gameState.players[gameState.inspectedPlayerIdx];
    const park = p.parks.find(pk => pk.id === gameState.selectedParkId) || p.parks[0];
    const hitTile = findCampusTileAtWorldPoint(park, wx, wy);
    if (!hitTile) return;

    // If Zone Editor Brush is active, toggle tile in selection!
    if (gameState.zoneEditor.active && hitTile.state === "cleared" && !hitTile.isEntrance) {
      toggleTileInZoneBrush(park, hitTile);
      renderParkDrawer();
      requestAnimationFrame(drawMapCanvas);
      return;
    }

    gameState.selectedCampusTileKey = hitTile.key;
    toggleParkDrawer(true);
    renderParkDrawer();
    requestAnimationFrame(drawMapCanvas);
  }
}

function handleCanvasDoubleClick(e) {
  if (gameState.mapViewMode === "national") {
    const { wx, wy } = screenToWorld(e.clientX, e.clientY);
    const h = findHexAtWorldPoint(wx, wy);
    if (h && h.parkId) {
      const ownerIdx = gameState.players.findIndex(p => p.id === h.ownerId);
      if (ownerIdx !== -1) {
        gameState.inspectedPlayerIdx = ownerIdx;
        gameState.selectedParkId = h.parkId;
        enterParkCampusView(h.parkId);
      }
    }
  }
}

function enterParkCampusView(parkId) {
  gameState.selectedParkId = parkId;
  gameState.mapViewMode = "campus";
  gameState.zoneEditor.active = false;
  document.getElementById("btnExitParkView").style.display = "inline-flex";
  document.getElementById("usMapTraitLegend").style.display = "none";
  resetMapCamera();
  toggleParkDrawer(true);
  renderAll();
}

function exitParkCampusView() {
  gameState.mapViewMode = "national";
  gameState.zoneEditor.active = false;
  document.getElementById("mapModeIndicator").textContent = "🌎 Contiguous US Population Hex Map";
  document.getElementById("btnExitParkView").style.display = "none";
  document.getElementById("usMapTraitLegend").style.display = "flex";
  resetMapCamera();
  renderAll();
}

function drawCampusHexPolygon(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i + 30);
    const vx = cx + r * Math.cos(a), vy = cy + r * Math.sin(a) * CAMPUS_HEX_VERTICAL_SCALE;
    if (i === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
  }
  ctx.closePath();
}

function drawSingleTileFacilityBase(ctx, cx, cy, radius, accent, project) {
  drawCampusHexPolygon(ctx, cx, cy, radius);
  ctx.fillStyle = shadeEnterpriseColor(accent, 0.35);
  ctx.fill();
  drawCampusHexPolygon(ctx, cx, cy, radius * 0.9);
  ctx.fillStyle = shadeEnterpriseColor(accent, 0.52);
  ctx.fill();
  const base = radius * 0.03;
  const corners = [
    project(-radius * 0.52, -radius * 0.42, base),
    project(radius * 0.52, -radius * 0.42, base),
    project(radius * 0.52, radius * 0.42, base),
    project(-radius * 0.52, radius * 0.42, base)
  ];
  ctx.beginPath();
  corners.forEach((point, index) => {
    if (index) ctx.lineTo(point[0], point[1]);
    else ctx.moveTo(point[0], point[1]);
  });
  ctx.closePath();
  ctx.fillStyle = "#cbd5e1";
  ctx.fill();
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = radius * 0.018;
  ctx.stroke();
}

function drawGuestServicesSprite(ctx, cx, cy, radius, accent) {
  const project = (x, y, z) => [cx + (x - y) * 0.7, cy + (x + y) * 0.35 - z];
  const polygon = (points, fill, stroke, lineWidth = radius * 0.018) => {
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index) ctx.lineTo(point[0], point[1]);
      else ctx.moveTo(point[0], point[1]);
    });
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  };
  const line = (start, end, color, width) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
  };
  const x0 = -radius * 0.3, x1 = radius * 0.3;
  const y0 = -radius * 0.24, y1 = radius * 0.24;
  const base = radius * 0.03, wallTop = radius * 0.25, roofTop = radius * 0.35;

  ctx.fillStyle = "rgba(15,23,42,.22)";
  ctx.beginPath();
  const shadow = project(radius * 0.08, radius * 0.1, base);
  ctx.ellipse(shadow[0], shadow[1], radius * 0.48, radius * 0.16, 0, 0, 7);
  ctx.fill();
  drawSingleTileFacilityBase(ctx, cx, cy, radius, accent, project);

  polygon([
    project(x0, y1, base), project(x1, y1, base),
    project(x1, y1, wallTop), project(x0, y1, wallTop)
  ], "#f1f5f9", "#94a3b8");
  polygon([
    project(x1, y0, base), project(x1, y1, base),
    project(x1, y1, wallTop), project(x1, y0, wallTop)
  ], "#cbd5e1", "#94a3b8");
  polygon([
    project(x0, y1, radius * 0.15), project(x1, y1, radius * 0.15),
    project(x1, y1, wallTop), project(x0, y1, wallTop)
  ], shadeEnterpriseColor(accent, -0.25));
  polygon([
    project(x1, y0, radius * 0.15), project(x1, y1, radius * 0.15),
    project(x1, y1, wallTop), project(x1, y0, wallTop)
  ], shadeEnterpriseColor(accent, -0.45));

  polygon([
    project(x0 - radius * 0.035, y1 + radius * 0.035, wallTop),
    project(x1 + radius * 0.035, y1 + radius * 0.035, wallTop),
    project(x1 - radius * 0.1, 0, roofTop),
    project(x0 + radius * 0.1, 0, roofTop)
  ], accent, shadeEnterpriseColor(accent, -0.3));
  polygon([
    project(x1 + radius * 0.035, y1 + radius * 0.035, wallTop),
    project(x1 + radius * 0.035, -y1 - radius * 0.035, wallTop),
    project(x1 - radius * 0.1, 0, roofTop)
  ], shadeEnterpriseColor(accent, -0.4));
  line(project(x0 + radius * 0.1, 0, roofTop), project(x1 - radius * 0.1, 0, roofTop),
    shadeEnterpriseColor(accent, 0.45), radius * 0.018);

  const window = (left, right) => polygon([
    project(left, y1 + radius * 0.002, radius * 0.055),
    project(right, y1 + radius * 0.002, radius * 0.055),
    project(right, y1 + radius * 0.002, radius * 0.13),
    project(left, y1 + radius * 0.002, radius * 0.13)
  ], "#7dd3fc", "#475569", radius * 0.012);
  window(-radius * 0.26, -radius * 0.19);
  window(radius * 0.19, radius * 0.26);
  polygon([
    project(-radius * 0.15, y1 + radius * 0.004, radius * 0.04),
    project(radius * 0.15, y1 + radius * 0.004, radius * 0.04),
    project(radius * 0.15, y1 + radius * 0.004, radius * 0.12),
    project(-radius * 0.15, y1 + radius * 0.004, radius * 0.12)
  ], "#1e293b", accent, radius * 0.012);
  polygon([
    project(-radius * 0.18, y1 + radius * 0.012, radius * 0.14),
    project(radius * 0.18, y1 + radius * 0.012, radius * 0.14),
    project(radius * 0.18, y1 + radius * 0.065, radius * 0.14),
    project(-radius * 0.18, y1 + radius * 0.065, radius * 0.14)
  ], accent, "#94a3b8", radius * 0.009);

  const sign = project(0, y1 + radius * 0.04, radius * 0.2);
  ctx.fillStyle = "#f8fafc";
  ctx.font = `bold ${Math.max(5, radius * 0.07)}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("GUEST SERVICES", sign[0], sign[1]);

  const infoPost = project(0, 0, roofTop);
  const infoTop = project(0, 0, roofTop + radius * 0.1);
  line(infoPost, infoTop, "#64748b", radius * 0.018);
  const infoSign = project(0, 0, roofTop + radius * 0.15);
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(infoSign[0], infoSign[1], radius * 0.065, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#f8fafc";
  ctx.lineWidth = radius * 0.012;
  ctx.stroke();
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.arc(infoSign[0], infoSign[1] - radius * 0.025, radius * 0.009, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(infoSign[0] - radius * 0.007, infoSign[1] - radius * 0.01, radius * 0.014, radius * 0.033);
}

function drawRestroomsSprite(ctx, cx, cy, radius, accent) {
  const project = (x, y, z) => [cx + (x - y) * 0.7, cy + (x + y) * 0.35 - z];
  const polygon = (points, fill, stroke, lineWidth = radius * 0.012) => {
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index) ctx.lineTo(point[0], point[1]);
      else ctx.moveTo(point[0], point[1]);
    });
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  };
  const line = (start, end, color, width) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
  };
  const x0 = -radius * 0.34, x1 = radius * 0.34;
  const y0 = -radius * 0.2, y1 = radius * 0.2;
  const base = radius * 0.03, wallTop = radius * 0.25, roofTop = radius * 0.35;

  ctx.fillStyle = "rgba(15,23,42,.22)";
  ctx.beginPath();
  const shadow = project(radius * 0.08, radius * 0.1, base);
  ctx.ellipse(shadow[0], shadow[1], radius * 0.48, radius * 0.16, 0, 0, 7);
  ctx.fill();
  drawSingleTileFacilityBase(ctx, cx, cy, radius, accent, project);

  polygon([
    project(x0, y1, base), project(x1, y1, base),
    project(x1, y1, wallTop), project(x0, y1, wallTop)
  ], "#f1f5f9");
  polygon([
    project(x1, y0, base), project(x1, y1, base),
    project(x1, y1, wallTop), project(x1, y0, wallTop)
  ], "#cbd5e1");
  polygon([
    project(x0, y1, radius * 0.14), project(x1, y1, radius * 0.14),
    project(x1, y1, wallTop), project(x0, y1, wallTop)
  ], shadeEnterpriseColor(accent, -0.25));
  polygon([
    project(x1, y0, radius * 0.14), project(x1, y1, radius * 0.14),
    project(x1, y1, wallTop), project(x1, y0, wallTop)
  ], shadeEnterpriseColor(accent, -0.45));

  const door = (left, right, female) => {
    polygon([
      project(left - radius * 0.015, y1, base),
      project(right + radius * 0.015, y1, base),
      project(right + radius * 0.015, y1, radius * 0.135),
      project(left - radius * 0.015, y1, radius * 0.135)
    ], accent);
    polygon([
      project(left, y1 - radius * 0.004, base),
      project(right, y1 - radius * 0.004, base),
      project(right, y1 - radius * 0.004, radius * 0.125),
      project(left, y1 - radius * 0.004, radius * 0.125)
    ], "#334155");
    const centerX = (left + right) / 2;
    const head = project(centerX, y1 - radius * 0.008, radius * 0.09);
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.arc(head[0], head[1], radius * 0.016, 0, Math.PI * 2);
    ctx.fill();
    if (female) {
      polygon([
        project(centerX, y1 - radius * 0.012, radius * 0.075),
        project(centerX - radius * 0.03, y1 - radius * 0.012, radius * 0.025),
        project(centerX + radius * 0.03, y1 - radius * 0.012, radius * 0.025)
      ], "#f8fafc");
      line(project(centerX - radius * 0.012, y1 - radius * 0.018, radius * 0.025),
        project(centerX - radius * 0.012, y1 - radius * 0.018, radius * 0.008), "#f8fafc", radius * 0.01);
      line(project(centerX + radius * 0.012, y1 - radius * 0.018, radius * 0.025),
        project(centerX + radius * 0.012, y1 - radius * 0.018, radius * 0.008), "#f8fafc", radius * 0.01);
    } else {
      polygon([
        project(centerX - radius * 0.017, y1 - radius * 0.012, radius * 0.075),
        project(centerX + radius * 0.017, y1 - radius * 0.012, radius * 0.075),
        project(centerX + radius * 0.017, y1 - radius * 0.012, radius * 0.025),
        project(centerX - radius * 0.017, y1 - radius * 0.012, radius * 0.025)
      ], "#f8fafc");
      [-1, 1].forEach(side => line(
        project(centerX + side * radius * 0.009, y1 - radius * 0.012, radius * 0.025),
        project(centerX + side * radius * 0.009, y1 - radius * 0.012, radius * 0.008),
        "#f8fafc", radius * 0.01));
    }
  };
  door(-radius * 0.24, -radius * 0.08, false);
  door(radius * 0.08, radius * 0.24, true);
  for (let index = 0; index < 4; index++) {
    const z = radius * (0.06 + index * 0.016);
    line(project(-radius * 0.035, y1, z), project(radius * 0.035, y1, z),
      "#94a3b8", radius * 0.008);
  }
  polygon([
    project(x1, y0, wallTop), project(x1, y1, wallTop), project(x1, 0, roofTop)
  ], "#cbd5e1");
  polygon([
    project(x0 - radius * 0.03, y1 + radius * 0.03, wallTop - radius * 0.01),
    project(x1 + radius * 0.03, y1 + radius * 0.03, wallTop - radius * 0.01),
    project(x1 + radius * 0.03, 0, roofTop),
    project(x0 - radius * 0.03, 0, roofTop)
  ], accent);
  for (let fraction = 0.25; fraction < 1; fraction += 0.25) {
    const y = (y1 + radius * 0.03) * (1 - fraction);
    const z = wallTop - radius * 0.01 + (roofTop - wallTop + radius * 0.01) * fraction;
    line(project(x0 - radius * 0.03, y, z), project(x1 + radius * 0.03, y, z),
      shadeEnterpriseColor(accent, -0.25), radius * 0.007);
  }
  line(project(x0 - radius * 0.03, y1 + radius * 0.03, wallTop - radius * 0.01),
    project(x1 + radius * 0.03, y1 + radius * 0.03, wallTop - radius * 0.01),
    shadeEnterpriseColor(accent, -0.4), radius * 0.014);
  line(project(x0 - radius * 0.03, 0, roofTop), project(x1 + radius * 0.03, 0, roofTop),
    shadeEnterpriseColor(accent, 0.45), radius * 0.014);

  const planter = x => {
    const center = project(x, radius * 0.34, base);
    polygon([
      project(x - radius * 0.06, radius * 0.29, base),
      project(x + radius * 0.06, radius * 0.29, base),
      project(x + radius * 0.06, radius * 0.39, base),
      project(x - radius * 0.06, radius * 0.39, base)
    ], "#92400e");
    [[-0.03, 0, "#2f7d4f"], [0.03, -0.01, "#3f9d5f"], [0, -0.04, "#256d44"]]
      .forEach(([dx, dy, color]) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(center[0] + dx * radius, center[1] - radius * 0.05 + dy * radius,
          radius * 0.045, 0, Math.PI * 2);
        ctx.fill();
      });
  };
  planter(-radius * 0.42);
  planter(radius * 0.42);
  const fountain = project(-radius * 0.4, radius * 0.42, base);
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(fountain[0] - radius * 0.015, fountain[1] - radius * 0.07,
    radius * 0.03, radius * 0.07);
  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.ellipse(fountain[0], fountain[1] - radius * 0.07, radius * 0.02, radius * 0.009,
    0, 0, Math.PI * 2);
  ctx.fill();
}

function drawDinerSprite(ctx, cx, cy, radius, accent) {
  const project = (x, y, z) => [cx + (x - y) * 0.7, cy + (x + y) * 0.35 - z];
  const polygon = (points, fill, stroke, lineWidth = radius * 0.012) => {
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index) ctx.lineTo(point[0], point[1]);
      else ctx.moveTo(point[0], point[1]);
    });
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  };
  const line = (start, end, color, width) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
  };
  const x0 = -radius * 0.44, x1 = radius * 0.44;
  const y0 = -radius * 0.24, y1 = radius * 0.24;
  const base = radius * 0.03, wallTop = radius * 0.2, roofTop = radius * 0.27;

  ctx.fillStyle = "rgba(15,23,42,.22)";
  ctx.beginPath();
  const shadow = project(radius * 0.08, radius * 0.1, base);
  ctx.ellipse(shadow[0], shadow[1], radius * 0.48, radius * 0.16, 0, 0, 7);
  ctx.fill();
  drawSingleTileFacilityBase(ctx, cx, cy, radius, accent, project);

  polygon([
    project(x0, y1, base), project(x1, y1, base),
    project(x1, y1, wallTop), project(x0, y1, wallTop)
  ], "#f1f5f9", "#94a3b8");
  polygon([
    project(x1, y0, base), project(x1, y1, base),
    project(x1, y1, wallTop), project(x1, y0, wallTop)
  ], "#cbd5e1", "#94a3b8");
  polygon([
    project(x0, y1, radius * 0.15), project(x1, y1, radius * 0.15),
    project(x1, y1, wallTop), project(x0, y1, wallTop)
  ], accent);
  polygon([
    project(x1, y0, radius * 0.15), project(x1, y1, radius * 0.15),
    project(x1, y1, wallTop), project(x1, y0, wallTop)
  ], shadeEnterpriseColor(accent, -0.25));

  const window = (left, right) => {
    polygon([
      project(left, y1 - radius * 0.004, radius * 0.04),
      project(right, y1 - radius * 0.004, radius * 0.04),
      project(right, y1 - radius * 0.004, radius * 0.12),
      project(left, y1 - radius * 0.004, radius * 0.12)
    ], "#7dd3fc", "#475569", radius * 0.01);
    line(project((left + right) / 2, y1 - radius * 0.006, radius * 0.04),
      project((left + right) / 2, y1 - radius * 0.006, radius * 0.12),
      "#475569", radius * 0.008);
    const glint = project(left + (right - left) * 0.14, y1 - radius * 0.009, radius * 0.115);
    line(glint, project(left + (right - left) * 0.25, y1 - radius * 0.009, radius * 0.05),
      "rgba(255,255,255,.7)", radius * 0.008);
  };
  window(-radius * 0.4, -radius * 0.08);
  window(radius * 0.1, radius * 0.4);
  polygon([
    project(-radius * 0.05, y1 - radius * 0.01, base),
    project(radius * 0.07, y1 - radius * 0.01, base),
    project(radius * 0.07, y1 - radius * 0.01, radius * 0.12),
    project(-radius * 0.05, y1 - radius * 0.01, radius * 0.12)
  ], shadeEnterpriseColor(accent, -0.55), "#e2e8f0", radius * 0.01);
  const handle = project(radius * 0.05, y1 - radius * 0.015, radius * 0.07);
  ctx.fillStyle = "#fde68a";
  ctx.beginPath();
  ctx.arc(handle[0], handle[1], radius * 0.009, 0, Math.PI * 2);
  ctx.fill();
  polygon([
    project(x1, -radius * 0.14, radius * 0.04),
    project(x1, radius * 0.14, radius * 0.04),
    project(x1, radius * 0.14, radius * 0.12),
    project(x1, -radius * 0.14, radius * 0.12)
  ], "#38bdf8", "#475569", radius * 0.01);

  polygon([
    project(x0, y0, wallTop), project(x1, y0, wallTop),
    project(x1, y1, wallTop), project(x0, y1, wallTop)
  ], shadeEnterpriseColor(accent, -0.15));
  polygon([
    project(x0 + radius * 0.04, y0 + radius * 0.04, wallTop + radius * 0.008),
    project(x1 - radius * 0.04, y0 + radius * 0.04, wallTop + radius * 0.008),
    project(x1 - radius * 0.04, y1 - radius * 0.04, wallTop + radius * 0.008),
    project(x0 + radius * 0.04, y1 - radius * 0.04, wallTop + radius * 0.008)
  ], shadeEnterpriseColor(accent, 0.2));
  polygon([
    project(radius * 0.22, -radius * 0.1, wallTop + radius * 0.01),
    project(radius * 0.32, -radius * 0.1, wallTop + radius * 0.01),
    project(radius * 0.32, 0, wallTop + radius * 0.01),
    project(radius * 0.22, 0, wallTop + radius * 0.01)
  ], "#94a3b8");
  for (let index = 0; index < 8; index++) {
    const left = x0 + radius * 0.02 + (x1 - x0 - radius * 0.04) * index / 8;
    const right = x0 + radius * 0.02 + (x1 - x0 - radius * 0.04) * (index + 1) / 8;
    polygon([
      project(left, y1 + radius * 0.005, radius * 0.17),
      project(right, y1 + radius * 0.005, radius * 0.17),
      project(right, y1 + radius * 0.065, radius * 0.145),
      project(left, y1 + radius * 0.065, radius * 0.145)
    ], index % 2 ? "#f8fafc" : accent);
  }

  const signX0 = -radius * 0.3, signX1 = radius * 0.14;
  line(project(signX0 + radius * 0.05, -radius * 0.02, wallTop),
    project(signX0 + radius * 0.05, -radius * 0.02, wallTop + radius * 0.1),
    "#64748b", radius * 0.02);
  line(project(signX1 - radius * 0.05, -radius * 0.02, wallTop),
    project(signX1 - radius * 0.05, -radius * 0.02, wallTop + radius * 0.1),
    "#64748b", radius * 0.02);
  polygon([
    project(signX0, -radius * 0.02, wallTop + radius * 0.1),
    project(signX1, -radius * 0.02, wallTop + radius * 0.1),
    project(signX1, -radius * 0.02, wallTop + radius * 0.24),
    project(signX0, -radius * 0.02, wallTop + radius * 0.24)
  ], accent, "#f8fafc", radius * 0.014);
  const signCenter = project((signX0 + signX1) / 2, -radius * 0.02, wallTop + radius * 0.17);
  ctx.fillStyle = "#f8fafc";
  ctx.font = `bold ${Math.max(6, radius * 0.1)}px Arial Black, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("DINER", signCenter[0], signCenter[1]);

  [[-radius * 0.2, radius * 0.42], [radius * 0.27, radius * 0.42]].forEach(([x, y], index) => {
    const center = project(x, y, base);
    ctx.fillStyle = "rgba(15,23,42,.2)";
    ctx.beginPath();
    ctx.ellipse(center[0] + radius * 0.025, center[1] + radius * 0.006,
      radius * 0.07, radius * 0.025, 0, 0, Math.PI * 2);
    ctx.fill();
    line(center, [center[0], center[1] - radius * 0.15], "#94a3b8", radius * 0.012);
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.ellipse(center[0], center[1] - radius * 0.035, radius * 0.05, radius * 0.022, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = index ? "#f8fafc" : accent;
    ctx.beginPath();
    ctx.ellipse(center[0], center[1] - radius * 0.16, radius * 0.09, radius * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = shadeEnterpriseColor(accent, -0.3);
    ctx.lineWidth = radius * 0.008;
    ctx.stroke();
  });
}

function shadeEnterpriseColor(hex, amount) {
  const value = parseInt(hex.slice(1), 16);
  const channels = [value >> 16, (value >> 8) & 255, value & 255];
  const shade = channel => Math.round(amount < 0 ? channel * (1 + amount) : channel + (255 - channel) * amount);
  return `rgb(${channels.map(shade).join(",")})`;
}

function drawEnterpriseSprite(ctx, cx, cy, radius, options = {}) {
  const accent = options.accent || "#f8fafc";
  const spin = options.t == null ? 0.5 : options.t;
  const angle = options.tilt == null ? 1.15 : options.tilt;
  const shadowFlip = options.flip ? -1 : 1;
  const sine = Math.sin(angle), cosine = Math.cos(angle);
  const project = (x, y, z) => [cx + (x - y) * 0.7, cy + (x + y) * 0.35 - z];
  const wheelRadius = radius * 0.52;
  const wheelHeight = radius * 0.17 + wheelRadius * sine;
  const gondolaCount = 10;
  const drawLine = (start, end, color, width) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
  };
  const rimPoint = theta => [
    wheelRadius * Math.cos(theta),
    wheelRadius * Math.sin(theta) * cosine,
    wheelHeight + wheelRadius * Math.sin(theta) * sine
  ];

  const slabX = radius * 0.64, slabY = radius * 0.4, baseZ = radius * 0.035;
  ctx.beginPath();
  [[-slabX, -slabY], [slabX, -slabY], [slabX, slabY], [-slabX, slabY]].forEach(([x, y], index) => {
    const point = project(x, y, baseZ);
    if (index) ctx.lineTo(point[0], point[1]); else ctx.moveTo(point[0], point[1]);
  });
  ctx.closePath();
  ctx.fillStyle = "#94a3b8";
  ctx.fill();
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = radius * 0.012;
  ctx.stroke();

  ctx.fillStyle = "rgba(15,23,42,.2)";
  ctx.beginPath();
  for (let index = 0; index <= 48; index++) {
    const point = rimPoint(index / 48 * 2 * Math.PI);
    const projected = project(point[0], point[1], baseZ);
    const x = projected[0] + shadowFlip * point[2] * 0.32;
    const y = projected[1] + point[2] * 0.16;
    if (index) ctx.lineTo(x, y); else ctx.moveTo(x, y);
  }
  ctx.fill();

  const base = project(0, -radius * 0.5, baseZ);
  const baseTop = base[1] - radius * 0.2;
  const baseWidth = radius * 0.1;
  ctx.fillStyle = shadeEnterpriseColor("#64748b", -0.35);
  ctx.beginPath();
  ctx.moveTo(base[0] - baseWidth, base[1]);
  ctx.lineTo(base[0], base[1] + radius * 0.05);
  ctx.lineTo(base[0], baseTop + radius * 0.05);
  ctx.lineTo(base[0] - baseWidth, baseTop);
  ctx.fill();
  ctx.fillStyle = shadeEnterpriseColor("#64748b", -0.1);
  ctx.beginPath();
  ctx.moveTo(base[0] + baseWidth, base[1]);
  ctx.lineTo(base[0], base[1] + radius * 0.05);
  ctx.lineTo(base[0], baseTop + radius * 0.05);
  ctx.lineTo(base[0] + baseWidth, baseTop);
  ctx.fill();
  ctx.fillStyle = shadeEnterpriseColor("#64748b", 0.2);
  ctx.beginPath();
  ctx.moveTo(base[0] - baseWidth, baseTop);
  ctx.lineTo(base[0], baseTop - radius * 0.05);
  ctx.lineTo(base[0] + baseWidth, baseTop);
  ctx.lineTo(base[0], baseTop + radius * 0.05);
  ctx.fill();

  const hub = project(0, 0, wheelHeight);
  const liftTop = project(0, -radius * 0.5, radius * 0.2);
  drawLine(liftTop, hub, "#475569", radius * 0.075);
  drawLine([liftTop[0] - radius * 0.012, liftTop[1]], [hub[0] - radius * 0.012, hub[1]], "#94a3b8", radius * 0.02);

  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = radius * 0.035;
  ctx.lineJoin = "round";
  ctx.beginPath();
  for (let index = 0; index <= 64; index++) {
    const point = rimPoint(index / 64 * 2 * Math.PI);
    const projected = project(point[0], point[1], point[2]);
    if (index) ctx.lineTo(projected[0], projected[1]); else ctx.moveTo(projected[0], projected[1]);
  }
  ctx.stroke();

  const gondolas = [];
  const riderColors = ["#ef4444", "#facc15", "#22c55e", "#3b82f6", "#f97316", "#e2e8f0"];
  for (let index = 0; index < gondolaCount; index++) {
    const theta = spin + index * 2 * Math.PI / gondolaCount;
    const position = [Math.cos(theta), Math.sin(theta) * cosine, Math.sin(theta) * sine];
    const gondola = project(
      position[0] * (wheelRadius + radius * 0.06),
      position[1] * (wheelRadius + radius * 0.06),
      wheelHeight + position[2] * (wheelRadius + radius * 0.06)
    );
    const spoke = project(position[0] * wheelRadius, position[1] * wheelRadius, wheelHeight + position[2] * wheelRadius);
    gondolas.push({
      depth: position[0] * wheelRadius + position[1] * wheelRadius + (wheelHeight + position[2] * wheelRadius) * 0.9,
      draw: () => {
        drawLine(hub, spoke, "#64748b", radius * 0.032);
        ctx.save();
        ctx.translate(gondola[0], gondola[1]);
        ctx.rotate(Math.atan2(gondola[1] - hub[1], gondola[0] - hub[0]));
        ctx.fillStyle = index % 2 ? shadeEnterpriseColor(accent, -0.25) : accent;
        ctx.fillRect(-radius * 0.075, -radius * 0.05, radius * 0.15, radius * 0.1);
        ctx.fillStyle = shadeEnterpriseColor(accent, -0.6);
        ctx.fillRect(-radius * 0.057, -radius * 0.034, radius * 0.114, radius * 0.068);
        [-1, 1].forEach((side, rider) => {
          ctx.fillStyle = riderColors[(index + rider * 3) % riderColors.length];
          ctx.beginPath();
          ctx.arc(side * radius * 0.026, 0, radius * 0.028, 0, 7);
          ctx.fill();
        });
        ctx.restore();
      }
    });
  }
  gondolas.sort((a, b) => a.depth - b.depth).forEach(item => item.draw());

  const normal = [0, -sine, cosine];
  drawLine(
    project(-normal[0] * radius * 0.1, -normal[1] * radius * 0.1, wheelHeight - normal[2] * radius * 0.1),
    project(normal[0] * radius * 0.1, normal[1] * radius * 0.1, wheelHeight + normal[2] * radius * 0.1),
    "#64748b",
    radius * 0.05
  );
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(hub[0], hub[1], radius * 0.07, 0, 7);
  ctx.fill();
  ctx.fillStyle = shadeEnterpriseColor(accent, 0.45);
  ctx.beginPath();
  ctx.arc(hub[0] - radius * 0.02, hub[1] - radius * 0.02, radius * 0.022, 0, 7);
  ctx.fill();
}

function drawScramblerSprite(ctx, cx, cy, radius, options = {}) {
  const accent = options.accent || "#f8fafc";
  const rotation = options.t == null ? 0.6 : options.t;
  const verticalScale = 0.58;
  const armLength = radius * 0.5;
  const podRadius = radius * 0.21;
  const hubHeight = radius * 0.13;
  const riderColors = ["#ef4444", "#facc15", "#22c55e", "#3b82f6"];
  const drawCylinder = (x, y, cylinderRadius, height, color) => {
    const ellipseHeight = cylinderRadius * verticalScale;
    ctx.fillStyle = shadeEnterpriseColor(color, -0.25);
    ctx.beginPath();
    ctx.ellipse(x, y, cylinderRadius, ellipseHeight, 0, 0, 7);
    ctx.fill();
    ctx.fillRect(x - cylinderRadius, y - height, cylinderRadius * 2, height);
    ctx.fillStyle = shadeEnterpriseColor(color, 0.2);
    ctx.beginPath();
    ctx.ellipse(x, y - height, cylinderRadius, ellipseHeight, 0, 0, 7);
    ctx.fill();
  };
  const arms = [0, 1, 2].map(index => {
    const angle = rotation + index * 2 * Math.PI / 3;
    return {
      index,
      depth: Math.sin(angle),
      x: cx + armLength * Math.cos(angle),
      y: cy + armLength * Math.sin(angle) * verticalScale
    };
  }).sort((first, second) => first.depth - second.depth);

  ctx.fillStyle = "rgba(15,23,42,.25)";
  ctx.beginPath();
  ctx.ellipse(cx + radius * 0.04, cy + radius * 0.03, radius * 0.2, radius * 0.2 * verticalScale, 0, 0, 7);
  ctx.fill();
  arms.forEach(arm => {
    ctx.beginPath();
    ctx.ellipse(arm.x + radius * 0.05, arm.y + radius * 0.05, podRadius * 1.05, podRadius * verticalScale * 1.05, 0, 0, 7);
    ctx.fill();
  });
  drawCylinder(cx, cy + radius * 0.02, radius * 0.17, radius * 0.07, "#64748b");

  const drawPod = arm => {
    const podY = arm.y - hubHeight;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = radius * 0.055;
    ctx.beginPath();
    ctx.moveTo(cx, cy - hubHeight);
    ctx.lineTo(arm.x, podY);
    ctx.stroke();
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = radius * 0.024;
    ctx.beginPath();
    ctx.moveTo(cx, cy - hubHeight - radius * 0.012);
    ctx.lineTo(arm.x, podY - radius * 0.012);
    ctx.stroke();
    drawCylinder(arm.x, podY + radius * 0.03, podRadius, radius * 0.03, "#475569");

    ctx.strokeStyle = accent;
    ctx.lineWidth = Math.max(1.5, radius * 0.025);
    ctx.beginPath();
    ctx.ellipse(arm.x, podY, podRadius, podRadius * verticalScale, 0, 0, 7);
    ctx.stroke();
    const cars = [0, 1, 2, 3].map(index => {
      const angle = -2.2 * rotation + index * Math.PI / 2 + arm.index;
      return {
        index,
        depth: Math.sin(angle),
        x: arm.x + podRadius * 0.72 * Math.cos(angle),
        y: podY + podRadius * 0.72 * Math.sin(angle) * verticalScale
      };
    }).sort((first, second) => first.depth - second.depth);
    cars.forEach(car => {
      drawCylinder(car.x, car.y, radius * 0.06, radius * 0.075, accent);
      ctx.fillStyle = riderColors[car.index];
      ctx.beginPath();
      ctx.arc(car.x, car.y - radius * 0.1, radius * 0.026, 0, 7);
      ctx.fill();
    });
  };

  arms.filter(arm => arm.depth < 0).forEach(drawPod);
  drawCylinder(cx, cy, radius * 0.08, hubHeight + radius * 0.1, "#94a3b8");
  arms.filter(arm => arm.depth >= 0).forEach(drawPod);
  drawCylinder(cx, cy - hubHeight - radius * 0.1, radius * 0.1, radius * 0.05, accent);
  ctx.fillStyle = shadeEnterpriseColor(accent, 0.4);
  ctx.beginPath();
  ctx.arc(cx, cy - hubHeight - radius * 0.17, radius * 0.03, 0, 7);
  ctx.fill();
}

function drawDropTowerSprite(ctx, cx, cy, radius, options = {}) {
  const accent = options.accent || "#f8fafc";
  const levels = Math.max(1, Math.min(10, options.levels || 5));
  const gondolaPosition = Math.max(0, Math.min(1, options.t == null ? 1 : options.t));
  const steel = "#94a3b8", width = radius * 0.2, depth = width * 0.5;
  const segmentHeight = radius * 0.24, plinthHeight = radius * 0.1;
  const towerHeight = segmentHeight * (levels + 1);
  const baseY = cy + depth;
  const prism = (baseX, bottomY, halfWidth, prismDepth, height, color) => {
    const topY = bottomY - height;
    ctx.fillStyle = shadeEnterpriseColor(color, -0.35);
    ctx.beginPath();
    ctx.moveTo(baseX - halfWidth, bottomY);
    ctx.lineTo(baseX, bottomY + prismDepth);
    ctx.lineTo(baseX, topY + prismDepth);
    ctx.lineTo(baseX - halfWidth, topY);
    ctx.fill();
    ctx.fillStyle = shadeEnterpriseColor(color, -0.1);
    ctx.beginPath();
    ctx.moveTo(baseX + halfWidth, bottomY);
    ctx.lineTo(baseX, bottomY + prismDepth);
    ctx.lineTo(baseX, topY + prismDepth);
    ctx.lineTo(baseX + halfWidth, topY);
    ctx.fill();
    ctx.fillStyle = shadeEnterpriseColor(color, 0.2);
    ctx.beginPath();
    ctx.moveTo(baseX - halfWidth, topY);
    ctx.lineTo(baseX, topY - prismDepth);
    ctx.lineTo(baseX + halfWidth, topY);
    ctx.lineTo(baseX, topY + prismDepth);
    ctx.fill();
  };

  const plinthY = baseY + depth * 0.4;
  prism(cx, plinthY, width * 1.8, depth * 1.8, plinthHeight, "#64748b");
  const towerBase = baseY - plinthHeight + depth * 0.4;
  const towerTop = towerBase - towerHeight;
  const gondolaY = towerBase - segmentHeight * 0.2 - gondolaPosition * (towerHeight - segmentHeight * 1.4);
  const gondolaWidth = width * 1.75, gondolaDepth = depth * 1.75, bandHeight = radius * 0.1;

  ctx.save();
  drawCampusHexPolygon(ctx, cx, cy, radius * 0.97);
  ctx.clip();
  ctx.fillStyle = "rgba(15,23,42,.28)";
  ctx.beginPath();
  const shadowX = Math.min(towerHeight * 0.45, radius * 0.95), shadowY = shadowX * 0.35;
  ctx.moveTo(cx - width, baseY - depth);
  ctx.lineTo(cx, baseY);
  ctx.lineTo(cx + width, baseY - depth);
  ctx.lineTo(cx + width + shadowX, baseY - depth + shadowY);
  ctx.lineTo(cx + shadowX, baseY + shadowY);
  ctx.lineTo(cx - width + shadowX, baseY - depth + shadowY);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = shadeEnterpriseColor(accent, -0.55);
  ctx.beginPath();
  ctx.moveTo(cx - gondolaWidth, gondolaY);
  ctx.lineTo(cx, gondolaY - gondolaDepth);
  ctx.lineTo(cx, gondolaY - gondolaDepth - bandHeight);
  ctx.lineTo(cx - gondolaWidth, gondolaY - bandHeight);
  ctx.fill();
  ctx.fillStyle = shadeEnterpriseColor(accent, -0.4);
  ctx.beginPath();
  ctx.moveTo(cx + gondolaWidth, gondolaY);
  ctx.lineTo(cx, gondolaY - gondolaDepth);
  ctx.lineTo(cx, gondolaY - gondolaDepth - bandHeight);
  ctx.lineTo(cx + gondolaWidth, gondolaY - bandHeight);
  ctx.fill();

  ctx.fillStyle = "#475569";
  ctx.beginPath();
  ctx.moveTo(cx - width, towerBase);
  ctx.lineTo(cx, towerBase + depth);
  ctx.lineTo(cx, towerTop + depth);
  ctx.lineTo(cx - width, towerTop);
  ctx.fill();
  ctx.fillStyle = "#64748b";
  ctx.beginPath();
  ctx.moveTo(cx + width, towerBase);
  ctx.lineTo(cx, towerBase + depth);
  ctx.lineTo(cx, towerTop + depth);
  ctx.lineTo(cx + width, towerTop);
  ctx.fill();

  ctx.strokeStyle = steel;
  ctx.lineWidth = Math.max(1, radius * 0.022);
  for (let level = 0; level <= levels; level++) {
    const lower = towerBase - level * segmentHeight;
    const upper = lower - segmentHeight;
    [-1, 1].forEach(side => {
      const x1 = cx + side * width;
      const lowerFront = lower + depth, upperFront = upper + depth;
      ctx.beginPath();
      ctx.moveTo(cx, lowerFront);
      ctx.lineTo(x1, upper);
      ctx.moveTo(x1, lower);
      ctx.lineTo(cx, upperFront);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, upperFront);
      ctx.lineTo(x1, upper);
      ctx.stroke();
    });
  }
  ctx.lineWidth = Math.max(2, radius * 0.045);
  [[cx - width, 0], [cx, depth], [cx + width, 0]].forEach(([x, offset]) => {
    ctx.beginPath();
    ctx.moveTo(x, towerBase + offset);
    ctx.lineTo(x, towerTop + offset);
    ctx.stroke();
  });

  for (let level = 2; level <= levels; level += 3) {
    const bandY = towerBase - level * segmentHeight;
    ctx.fillStyle = accent;
    ctx.fillRect(cx - width, bandY - segmentHeight * 0.18, width, segmentHeight * 0.18);
    ctx.fillRect(cx, bandY - segmentHeight * 0.18, width, segmentHeight * 0.18);
    ctx.fillStyle = shadeEnterpriseColor(accent, -0.25);
    ctx.beginPath();
    ctx.moveTo(cx - width, bandY);
    ctx.lineTo(cx, bandY + depth);
    ctx.lineTo(cx, bandY + depth - segmentHeight * 0.18);
    ctx.lineTo(cx - width, bandY - segmentHeight * 0.18);
    ctx.fill();
  }

  ctx.fillStyle = shadeEnterpriseColor(accent, -0.3);
  ctx.beginPath();
  ctx.moveTo(cx - gondolaWidth, gondolaY);
  ctx.lineTo(cx, gondolaY + gondolaDepth);
  ctx.lineTo(cx, gondolaY + gondolaDepth - bandHeight);
  ctx.lineTo(cx - gondolaWidth, gondolaY - bandHeight);
  ctx.fill();
  ctx.fillStyle = shadeEnterpriseColor(accent, -0.05);
  ctx.beginPath();
  ctx.moveTo(cx + gondolaWidth, gondolaY);
  ctx.lineTo(cx, gondolaY + gondolaDepth);
  ctx.lineTo(cx, gondolaY + gondolaDepth - bandHeight);
  ctx.lineTo(cx + gondolaWidth, gondolaY - bandHeight);
  ctx.fill();
  ctx.strokeStyle = shadeEnterpriseColor(accent, 0.45);
  ctx.lineWidth = Math.max(1, radius * 0.022);
  ctx.beginPath();
  ctx.moveTo(cx - gondolaWidth, gondolaY - bandHeight);
  ctx.lineTo(cx, gondolaY + gondolaDepth - bandHeight);
  ctx.lineTo(cx + gondolaWidth, gondolaY - bandHeight);
  ctx.stroke();

  const riderColors = ["#ef4444", "#facc15", "#22c55e", "#3b82f6", "#a855f7"];
  [-0.9, 0.9, -0.45, 0.45, 0].forEach((position, index) => {
    const x = cx + position * gondolaWidth;
    const riderBase = gondolaY + gondolaDepth * (1 - Math.abs(position));
    const riderRadius = radius * 0.035;
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(x - riderRadius * 0.9, riderBase + radius * 0.13, riderRadius * 0.8, radius * 0.07);
    ctx.fillRect(x + riderRadius * 0.1, riderBase + radius * 0.13, riderRadius * 0.8, radius * 0.07);
    ctx.fillStyle = riderColors[index];
    ctx.fillRect(x - riderRadius, riderBase + radius * 0.045, riderRadius * 2, radius * 0.09);
    ctx.fillStyle = "#fde4c8";
    ctx.beginPath();
    ctx.arc(x, riderBase + radius * 0.03, riderRadius, 0, 7);
    ctx.fill();
  });

  prism(cx, towerTop + depth * 0.2, width * 1.35, depth * 1.35, radius * 0.1, accent);
  ctx.strokeStyle = steel;
  ctx.lineWidth = Math.max(1.5, radius * 0.03);
  ctx.beginPath();
  ctx.moveTo(cx, towerTop - radius * 0.1);
  ctx.lineTo(cx, towerTop - radius * 0.38);
  ctx.stroke();
  ctx.fillStyle = shadeEnterpriseColor(accent, 0.35);
  ctx.beginPath();
  ctx.arc(cx, towerTop - radius * 0.4, radius * 0.045, 0, 7);
  ctx.fill();
}

function drawTopSpinSprite(ctx, cx, cy, radius, options = {}) {
  const accent = options.accent || "#f8fafc";
  const phase = options.t == null ? 0.9 : options.t;
  const project = (x, y, z) => [cx + (x - y) * 0.7, cy + (x + y) * 0.35 - z];
  const axleHeight = radius * 0.85, armLength = radius * 0.46;
  const axleHalfWidth = radius * 0.5, gondolaHalfWidth = radius * 0.36;
  const gondolaWidth = radius * 0.32, legLength = radius * 0.28;
  const line = (start, end, color, width) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
  };
  const lerp = (start, end, amount) => [
    start[0] + (end[0] - start[0]) * amount,
    start[1] + (end[1] - start[1]) * amount
  ];
  const polygon = (points, fill, stroke, lineWidth) => {
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index) ctx.lineTo(point[0], point[1]); else ctx.moveTo(point[0], point[1]);
    });
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  };

  const slabX = radius * 0.62, slabY = radius * 0.36;
  polygon([
    project(-slabX, -slabY, radius * 0.035),
    project(slabX, -slabY, radius * 0.035),
    project(slabX, slabY, radius * 0.035),
    project(-slabX, slabY, radius * 0.035)
  ], "#94a3b8", "#64748b", radius * 0.012);

  const sine = Math.sin(phase), cosine = Math.cos(phase);
  const gondolaCenter = [0, armLength * sine, axleHeight - armLength * cosine];
  const up = [0, -sine, cosine], across = [0, cosine, sine];
  ctx.fillStyle = "rgba(15,23,42,.22)";
  ctx.beginPath();
  const groundShadow = project(0, gondolaCenter[1], radius * 0.035);
  ctx.ellipse(groundShadow[0], groundShadow[1], radius * 0.24, radius * 0.1, 0, 0, 7);
  ctx.fill();

  const drawPylon = x => {
    const top = project(x, 0, axleHeight);
    const footNear = project(x, -legLength, radius * 0.035);
    const footFar = project(x, legLength, radius * 0.035);
    [footNear, footFar].forEach(foot => {
      line(foot, top, "#64748b", radius * 0.05);
      line([foot[0] - radius * 0.012, foot[1]], [top[0] - radius * 0.012, top[1]], "#94a3b8", radius * 0.016);
      line(lerp(foot, top, 0.62), lerp(foot, top, 0.88), accent, radius * 0.054);
    });
    line(lerp(footNear, top, 0.3), lerp(footFar, top, 0.3), "#64748b", radius * 0.03);
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(top[0], top[1], radius * 0.065, 0, 7);
    ctx.fill();
    ctx.fillStyle = shadeEnterpriseColor(accent, 0.45);
    ctx.beginPath();
    ctx.arc(top[0] - radius * 0.02, top[1] - radius * 0.02, radius * 0.02, 0, 7);
    ctx.fill();
  };

  drawPylon(-axleHalfWidth);
  line(project(-axleHalfWidth, 0, axleHeight), project(axleHalfWidth, 0, axleHeight), "#94a3b8", radius * 0.045);
  const drawArm = x => line(
    project(x, 0, axleHeight),
    project(x, gondolaCenter[1], gondolaCenter[2]),
    "#94a3b8",
    radius * 0.042
  );
  drawArm(-gondolaHalfWidth);

  const deckPoints = offset => [
    [-gondolaHalfWidth - radius * 0.03, -1],
    [gondolaHalfWidth + radius * 0.03, -1],
    [gondolaHalfWidth + radius * 0.03, 1],
    [-gondolaHalfWidth - radius * 0.03, 1]
  ].map(([x, direction]) => project(
    x,
    gondolaCenter[1] + across[1] * direction * gondolaWidth / 2 - up[1] * offset,
    gondolaCenter[2] + across[2] * direction * gondolaWidth / 2 - up[2] * offset
  ));
  polygon(deckPoints(radius * 0.035), "#334155");
  polygon(deckPoints(0), "#475569", accent, radius * 0.026);

  const riderColors = ["#ef4444", "#facc15", "#22c55e", "#3b82f6", "#f97316", "#e2e8f0", "#a855f7", "#fde047"];
  const riders = [];
  [-1, 1].forEach((side, row) => [-0.27, -0.09, 0.09, 0.27].forEach(offset => {
    const x = offset * radius;
    const y = gondolaCenter[1] + across[1] * side * gondolaWidth * 0.28;
    const z = gondolaCenter[2] + across[2] * side * gondolaWidth * 0.28;
    riders.push({ x, y, z, depth: x + y, color: riderColors[row * 4 + column] });
  }));
  riders.sort((first, second) => first.depth - second.depth).forEach(rider => {
    const at = height => project(rider.x, rider.y + up[1] * height, rider.z + up[2] * height);
    line(at(0), at(radius * 0.035), accent, radius * 0.075);
    line(at(radius * 0.035), at(radius * 0.11), rider.color, radius * 0.058);
    const head = at(radius * 0.14);
    ctx.fillStyle = "#fde4c8";
    ctx.beginPath();
    ctx.arc(head[0], head[1], radius * 0.033, 0, 7);
    ctx.fill();
  });

  drawArm(gondolaHalfWidth);
  drawPylon(axleHalfWidth);
}

function drawRapidsSprite(ctx, firstTile, secondTile, radius, options = {}) {
  const accent = options.accent || "#f8fafc";
  const phase = options.t == null ? 0.1 : options.t;
  const dx = secondTile.px - firstTile.px, dy = secondTile.py - firstTile.py;
  const tileDistance = Math.hypot(dx, dy);
  const sourceDistance = Math.hypot(0.866, 0.87) * radius;
  const scale = tileDistance / sourceDistance;
  const midpointX = (firstTile.px + secondTile.px) / 2;
  const midpointY = (firstTile.py + secondTile.py) / 2;
  const rotation = Math.atan2(dy, dx) - Math.atan2(0.87, 0.866);
  const cache = drawRapidsSprite.layouts || (drawRapidsSprite.layouts = new Map());
  let layout = cache.get(radius);

  if (!layout) {
    let seed = 12345;
    const random = () => {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      let value = Math.imul(seed ^ seed >>> 15, 1 | seed);
      value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
      return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
    const hexes = [[-0.433 * radius, -0.435 * radius], [0.433 * radius, 0.435 * radius]];
    const path = [];
    const pointCount = 120, channelWidth = radius * 0.07;
    for (let index = 0; index < pointCount; index++) {
      const angle = 2 * Math.PI * index / pointCount;
      const along = 0.74 * Math.cos(angle);
      const side = radius * (0.36 * Math.sin(angle) + 0.06 * Math.sin(3 * angle + 1));
      path.push([0.866 * radius * along + 0.706 * side, 0.87 * radius * along - 0.709 * side]);
    }
    const frame = index => {
      const before = path[(index + pointCount - 1) % pointCount];
      const after = path[(index + 1) % pointCount];
      const vx = after[0] - before[0], vy = after[1] - before[1];
      const length = Math.hypot(vx, vy);
      const tangent = [vx / length, vy / length];
      let normal = [-tangent[1], tangent[0]];
      const point = path[index];
      if (normal[0] * point[0] + normal[1] * point[1] < 0) normal = [-normal[0], -normal[1]];
      return { point, tangent, normal };
    };
    const isInsideHex = (x, y, index) => {
      const center = hexes[index];
      const normalizedX = Math.abs(x - center[0]) / radius;
      const normalizedY = Math.abs(y - center[1]) / (0.58 * radius);
      return normalizedX <= 0.866 * 0.9 && normalizedY <= 0.9 - normalizedX / 1.732;
    };
    const isInside = (x, y) => isInsideHex(x, y, 0) || isInsideHex(x, y, 1);
    const pathDistance = (x, y) => path.reduce((minimum, point) => Math.min(minimum, Math.hypot(x - point[0], y - point[1])), Infinity);
    const station = frame(Math.round(pointCount * 0.9));
    const waterfall = frame(Math.round(pointCount * 0.5));
    const moundCenter = [waterfall.point[0] - 0.705 * radius * 0.14, waterfall.point[1] - 0.709 * radius * 0.14];
    const blob = (x, y, size, color) => ({
      x, y, size, color,
      points: Array.from({ length: 7 }, (_, index) => {
        const angle = index / 7 * 6.283 + random() * 0.5;
        const pointRadius = size * (0.75 + random() * 0.4);
        return [Math.cos(angle) * pointRadius, Math.sin(angle) * pointRadius * 0.8];
      })
    });
    const rocks = [];
    for (let index = 0; index < pointCount; index += 2) {
      for (const side of [-1, 1]) {
        if (random() >= 0.6) continue;
        const edge = frame(index);
        const offset = channelWidth + radius * 0.05 + random() * radius * 0.035;
        const x = edge.point[0] + edge.normal[0] * side * offset;
        const y = edge.point[1] + edge.normal[1] * side * offset;
        if (isInside(x, y) && Math.hypot(x - moundCenter[0], y - moundCenter[1]) > radius * 0.2 &&
            Math.hypot(x - station.point[0], y - station.point[1]) > radius * 0.22) {
          const shade = -0.25 + random() * 0.35;
          const color = `rgb(${[148, 163, 184].map(channel => Math.round(shade < 0
            ? channel * (1 + shade)
            : channel + (255 - channel) * shade)).join(",")})`;
          rocks.push(blob(x, y, radius * (0.032 + random() * 0.04), color));
        }
      }
    }
    const mound = [[0, 0, 0.1], [-0.07, 0.06, 0.07], [0.07, -0.05, 0.07], [0, -0.1, 0.07], [0.1, 0.06, 0.05]]
      .map(([x, y, size]) => blob(moundCenter[0] + x * radius, moundCenter[1] + y * radius,
        radius * size, "#64748b"));
    const trees = [];
    const treeStep = radius * 0.17;
    for (let x = -1.2 * radius; x <= 1.2 * radius; x += treeStep) {
      for (let y = -1.2 * radius; y <= 1.2 * radius; y += treeStep) {
        const tx = x + (random() - 0.5) * radius * 0.1;
        const ty = y + (random() - 0.5) * radius * 0.1;
        if (random() >= 0.88 || !isInside(tx, ty) || pathDistance(tx, ty) <= channelWidth + radius * 0.13 ||
            Math.hypot(tx - moundCenter[0], ty - moundCenter[1]) <= radius * 0.24 ||
            Math.hypot(tx - station.point[0], ty - station.point[1]) <= radius * 0.26 ||
            trees.some(tree => Math.hypot(tree.x - tx, tree.y - ty) <= radius * 0.12)) continue;
        trees.push({
          x: tx, y: ty, height: radius * (0.17 + random() * 0.11), pine: random() < 0.4,
          green: ["#2f7d4f", "#3f9d5f", "#256d44"][Math.floor(random() * 3)]
        });
      }
    }
    layout = { hexes, path, pointCount, channelWidth, frame, station, waterfall, moundCenter, rocks, mound, trees };
    cache.set(radius, layout);
  }

  ctx.save();
  ctx.beginPath();
  [firstTile, secondTile].forEach(tile => {
    for (let index = 0; index < 6; index++) {
      const angle = Math.PI / 180 * (60 * index + 30);
      const x = tile.px + radius * 0.96 * Math.cos(angle);
      const y = tile.py + radius * 0.96 * Math.sin(angle) * CAMPUS_HEX_VERTICAL_SCALE;
      if (index) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    ctx.closePath();
  });
  ctx.clip();
  [firstTile, secondTile].forEach(tile => {
    drawCampusHexPolygon(ctx, tile.px, tile.py, radius * 0.94);
    ctx.fillStyle = shadeEnterpriseColor(accent, 0.35);
    ctx.fill();
    drawCampusHexPolygon(ctx, tile.px, tile.py, radius * 0.84);
    ctx.fillStyle = shadeEnterpriseColor(accent, 0.52);
    ctx.fill();
  });
  ctx.translate(midpointX, midpointY);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);

  const traceChannel = offset => {
    ctx.beginPath();
    layout.path.forEach((point, index) => {
      const edge = layout.frame(index);
      const x = point[0] + edge.normal[0] * offset;
      const y = point[1] + edge.normal[1] * offset;
      if (index) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    });
    ctx.closePath();
  };
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.save();
  ctx.translate(0, radius * 0.03);
  traceChannel(0);
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = layout.channelWidth * 2 + radius * 0.09;
  ctx.stroke();
  ctx.restore();
  traceChannel(0);
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = layout.channelWidth * 2 + radius * 0.09;
  ctx.stroke();
  traceChannel(0);
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = layout.channelWidth * 2;
  ctx.stroke();
  traceChannel(0);
  ctx.strokeStyle = "#0ea5e9";
  ctx.lineWidth = layout.channelWidth * 1.05;
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,.75)";
  ctx.lineWidth = radius * 0.013;
  ctx.setLineDash([radius * 0.05, radius * 0.11]);
  ctx.lineDashOffset = -phase * radius * 9;
  traceChannel(layout.channelWidth * 0.55);
  ctx.stroke();
  ctx.lineDashOffset = -phase * radius * 7 + radius * 0.06;
  traceChannel(-layout.channelWidth * 0.5);
  ctx.stroke();
  ctx.setLineDash([]);

  const items = [];
  const drawRock = rock => {
    ctx.fillStyle = "rgba(15,23,42,.2)";
    ctx.beginPath();
    ctx.ellipse(rock.x + rock.size * 0.3, rock.y + rock.size * 0.5, rock.size * 1.1, rock.size * 0.5, 0, 0, 7);
    ctx.fill();
    ctx.fillStyle = rock.color;
    ctx.beginPath();
    rock.points.forEach(([x, y], index) => {
      if (index) ctx.lineTo(rock.x + x, rock.y + y); else ctx.moveTo(rock.x + x, rock.y + y);
    });
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.22)";
    ctx.beginPath();
    rock.points.slice(0, 4).forEach(([x, y], index) => {
      if (index) ctx.lineTo(rock.x + x * 0.6, rock.y + y * 0.6 - rock.size * 0.2);
      else ctx.moveTo(rock.x + x * 0.6, rock.y + y * 0.6 - rock.size * 0.2);
    });
    ctx.fill();
  };
  layout.rocks.forEach(rock => items.push({ depth: rock.y, draw: () => drawRock(rock) }));
  layout.mound.forEach(rock => items.push({ depth: rock.y - radius * 0.02, draw: () => drawRock(rock) }));
  layout.trees.forEach(tree => items.push({ depth: tree.y, draw: () => {
    ctx.fillStyle = "rgba(15,23,42,.22)";
    ctx.beginPath();
    ctx.ellipse(tree.x + tree.height * 0.18, tree.y + tree.height * 0.03, tree.height * 0.32, tree.height * 0.12, 0, 0, 7);
    ctx.fill();
    ctx.fillStyle = "#78350f";
    ctx.fillRect(tree.x - tree.height * 0.04, tree.y - tree.height * 0.3, tree.height * 0.08, tree.height * 0.3);
    if (tree.pine) {
      [[0.95, 0.3], [0.72, 0.23], [0.5, 0.16]].forEach(([top, width], index) => {
        ctx.fillStyle = shadeEnterpriseColor("#1f6b46", index * 0.1);
        ctx.beginPath();
        ctx.moveTo(tree.x, tree.y - tree.height * top - tree.height * 0.25);
        ctx.lineTo(tree.x + tree.height * width, tree.y - tree.height * (top - 0.4));
        ctx.lineTo(tree.x - tree.height * width, tree.y - tree.height * (top - 0.4));
        ctx.fill();
      });
    } else {
      [[-0.12, 0.55, 0.26, -0.25], [0.13, 0.52, 0.25, -0.1], [0, 0.8, 0.27, 0.1]].forEach(([dx, y, size, shade], index) => {
        ctx.fillStyle = shadeEnterpriseColor(tree.green, shade);
        ctx.beginPath();
        ctx.arc(tree.x + dx * tree.height, tree.y - y * tree.height, size * tree.height, 0, 7);
        ctx.fill();
      });
    }
  }}));
  items.push({ depth: layout.moundCenter[1] + radius * 0.01, draw: () => {
    const top = [
      layout.moundCenter[0] + (layout.waterfall.point[0] - layout.moundCenter[0]) * 0.35,
      layout.moundCenter[1] - radius * 0.13
    ];
    for (let index = -1; index <= 1; index++) {
      ctx.strokeStyle = index ? "rgba(186,230,253,.9)" : "rgba(255,255,255,.95)";
      ctx.lineWidth = radius * 0.03;
      ctx.beginPath();
      ctx.moveTo(top[0] + index * radius * 0.03, top[1]);
      ctx.lineTo(layout.waterfall.point[0] + index * radius * 0.03, layout.waterfall.point[1]);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,255,255,.8)";
    ctx.beginPath();
    ctx.ellipse(layout.waterfall.point[0], layout.waterfall.point[1] + radius * 0.01, radius * 0.1, radius * 0.045, 0, 0, 7);
    ctx.fill();
  }});

  const station = layout.station;
  const stationCenter = [
    station.point[0] + station.normal[0] * (layout.channelWidth + radius * 0.12),
    station.point[1] + station.normal[1] * (layout.channelWidth + radius * 0.12)
  ];
  const stationPoint = (along, outward, height) => [
    stationCenter[0] + station.tangent[0] * along + station.normal[0] * outward,
    stationCenter[1] + station.tangent[1] * along + station.normal[1] * outward - height
  ];
  items.push({ depth: stationCenter[1], draw: () => {
    const drawPolygon = (points, fill, stroke) => {
      ctx.beginPath();
      points.forEach((point, index) => {
        if (index) ctx.lineTo(point[0], point[1]); else ctx.moveTo(point[0], point[1]);
      });
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = radius * 0.012;
        ctx.stroke();
      }
    };
    const halfLength = radius * 0.17, halfWidth = radius * 0.085;
    drawPolygon([
      stationPoint(-halfLength, -halfWidth, 0), stationPoint(halfLength, -halfWidth, 0),
      stationPoint(halfLength, halfWidth, 0), stationPoint(-halfLength, halfWidth, 0)
    ], "#e2e8f0", "#94a3b8");
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = radius * 0.016;
    [[-halfLength, halfWidth], [halfLength, halfWidth], [halfLength, -halfWidth], [-halfLength, -halfWidth]]
      .forEach(([along, outward]) => {
        const bottom = stationPoint(along, outward, 0), top = stationPoint(along, outward, radius * 0.16);
        ctx.beginPath();
        ctx.moveTo(bottom[0], bottom[1]);
        ctx.lineTo(top[0], top[1]);
        ctx.stroke();
      });
    drawPolygon([
      stationPoint(-halfLength * 1.1, -halfWidth * 1.15, radius * 0.16),
      stationPoint(halfLength * 1.1, -halfWidth * 1.15, radius * 0.16),
      stationPoint(halfLength * 1.1, halfWidth * 1.15, radius * 0.16),
      stationPoint(-halfLength * 1.1, halfWidth * 1.15, radius * 0.16)
    ], accent, shadeEnterpriseColor(accent, -0.3));
  }});

  for (let raft = 0; raft < 4; raft++) {
    const index = Math.floor(((phase + raft / 4) % 1) * layout.pointCount);
    const point = layout.path[index];
    const raftRadius = radius * 0.085, raftHeight = raftRadius * 0.58;
    const spin = phase * 14 + raft * 1.7;
    items.push({ depth: point[1], draw: () => {
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.ellipse(point[0], point[1], raftRadius, raftHeight, 0, 0, 7);
      ctx.fill();
      ctx.fillStyle = shadeEnterpriseColor(accent, -0.5);
      ctx.beginPath();
      ctx.ellipse(point[0], point[1], raftRadius * 0.62, raftHeight * 0.62, 0, 0, 7);
      ctx.fill();
      [0, 1, 2, 3].map(index => spin + index * Math.PI / 2).sort((first, second) => Math.sin(first) - Math.sin(second))
        .forEach((angle, rider) => {
          const x = point[0] + raftRadius * 0.7 * Math.cos(angle);
          const y = point[1] + raftHeight * 0.7 * Math.sin(angle);
          ctx.fillStyle = ["#ef4444", "#facc15", "#22c55e", "#3b82f6", "#e2e8f0", "#a855f7"][(raft * 2 + rider) % 6];
          ctx.fillRect(x - radius * 0.016, y - radius * 0.05, radius * 0.032, radius * 0.05);
          ctx.fillStyle = "#fde4c8";
          ctx.beginPath();
          ctx.arc(x, y - radius * 0.065, radius * 0.02, 0, 7);
          ctx.fill();
        });
    }});
  }
  items.sort((first, second) => first.depth - second.depth).forEach(item => item.draw());
  ctx.restore();
}

function drawClawSprite(ctx, cx, cy, radius, options = {}) {
  const accent = options.accent || "#f8fafc";
  const phase = options.t == null ? 1.7 : options.t;
  const rotation = options.r == null ? 0.5 : options.r;
  const shadowFlip = options.flip ? -1 : 1;
  const project = (x, y, z) => [cx + (x - y) * 0.7, cy + (x + y) * 0.35 - z];
  const boomLength = radius * 0.5, armLength = radius * 0.29;
  const axleX = radius * 0.3, legLength = radius * 0.28, baseZ = radius * 0.035;
  const pivotZ = radius * 0.62;
  const line = (start, end, color, width) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
  };
  const lerp = (start, end, amount) => [
    start[0] + (end[0] - start[0]) * amount,
    start[1] + (end[1] - start[1]) * amount
  ];
  const polygon = (points, fill, stroke, lineWidth) => {
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index) ctx.lineTo(point[0], point[1]);
      else ctx.moveTo(point[0], point[1]);
    });
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth || radius * 0.01;
      ctx.stroke();
    }
  };
  const sine = Math.sin(phase), cosine = Math.cos(phase);
  const boom = [0, sine, -cosine], rotorAxis = [0, cosine, sine];
  const hub = [0, boomLength * sine, pivotZ - boomLength * cosine];

  drawCampusHexPolygon(ctx, cx, cy, radius);
  ctx.fillStyle = "#cbd5e1";
  ctx.fill();
  ctx.lineWidth = Math.max(2, radius * 0.06);
  ctx.strokeStyle = accent;
  ctx.stroke();

  const slabX = radius * 0.62, slabY = radius * 0.42;
  ctx.beginPath();
  [[-slabX, -slabY], [slabX, -slabY], [slabX, slabY], [-slabX, slabY]].forEach(([x, y], index) => {
    const point = project(x, y, baseZ);
    if (index) ctx.lineTo(point[0], point[1]);
    else ctx.moveTo(point[0], point[1]);
  });
  ctx.closePath();
  ctx.fillStyle = "#94a3b8";
  ctx.fill();
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = radius * 0.012;
  ctx.stroke();

  const groundShadow = project(0, hub[1], baseZ);
  ctx.fillStyle = "rgba(15,23,42,.2)";
  ctx.beginPath();
  ctx.ellipse(groundShadow[0] + shadowFlip * radius * 0.05,
    groundShadow[1] + radius * 0.02, radius * 0.24, radius * 0.1, 0, 0, 7);
  ctx.fill();

  const drawPylon = x => {
    const top = project(x, 0, pivotZ);
    const feet = [project(x, -legLength, baseZ), project(x, legLength, baseZ)];
    for (const foot of feet) {
      line(foot, top, "#64748b", radius * 0.065);
      line([foot[0] - radius * 0.012, foot[1]],
        [top[0] - radius * 0.012, top[1]], "#94a3b8", radius * 0.016);
      line(lerp(foot, top, 0.7), lerp(foot, top, 0.92), accent, radius * 0.07);
    }
    line(lerp(feet[0], top, 0.28), lerp(feet[1], top, 0.28), "#64748b", radius * 0.03);
    const sign = lerp(lerp(feet[0], top, 0.5), lerp(feet[1], top, 0.5), 0.5);
    polygon([
      [sign[0], sign[1] - radius * 0.06], [sign[0] + radius * 0.05, sign[1]],
      [sign[0], sign[1] + radius * 0.06], [sign[0] - radius * 0.05, sign[1]]
    ], accent, "#f8fafc", radius * 0.012);
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(top[0], top[1], radius * 0.06, 0, 7);
    ctx.fill();
    ctx.fillStyle = shadeEnterpriseColor(accent, 0.45);
    ctx.beginPath();
    ctx.arc(top[0] - radius * 0.018, top[1] - radius * 0.018, radius * 0.018, 0, 7);
    ctx.fill();
  };

  drawPylon(-axleX);
  line(project(-axleX, 0, pivotZ), project(axleX, 0, pivotZ), "#94a3b8", radius * 0.045);
  const pivot = project(0, 0, pivotZ);
  const rotorHub = project(hub[0], hub[1], hub[2]);
  line(pivot, rotorHub, "#334155", radius * 0.1);
  for (let index = 0; index < 9; index++) {
    const start = lerp(pivot, rotorHub, index / 9);
    const end = lerp(pivot, rotorHub, (index + 0.85) / 9);
    line(start, end, index % 2 ? "#f8fafc" : accent, radius * 0.075);
  }

  const rotorArms = [];
  const podColors = ["#ef4444", "#facc15", "#22c55e", "#3b82f6", "#f97316", "#e2e8f0", "#a855f7", "#fde047"];
  for (let index = 0; index < 4; index++) {
    const angle = rotation + index * Math.PI / 2;
    const direction = [Math.cos(angle), Math.sin(angle) * rotorAxis[1], Math.sin(angle) * rotorAxis[2]];
    const tangent = [-Math.sin(angle), Math.cos(angle) * rotorAxis[1], Math.cos(angle) * rotorAxis[2]];
    const endpoint = [
      hub[0] + direction[0] * armLength,
      hub[1] + direction[1] * armLength,
      hub[2] + direction[2] * armLength
    ];
    rotorArms.push({
      depth: endpoint[0] + endpoint[1] + endpoint[2] * 0.9,
      draw: () => {
        const end = project(endpoint[0], endpoint[1], endpoint[2]);
        line(rotorHub, end, "#64748b", radius * 0.04);
        const seatA = project(
          endpoint[0] - tangent[0] * radius * 0.1,
          endpoint[1] - tangent[1] * radius * 0.1,
          endpoint[2] - tangent[2] * radius * 0.1
        );
        const seatB = project(
          endpoint[0] + tangent[0] * radius * 0.1,
          endpoint[1] + tangent[1] * radius * 0.1,
          endpoint[2] + tangent[2] * radius * 0.1
        );
        line(seatA, seatB, shadeEnterpriseColor(accent, -0.3), radius * 0.1);
        line(seatA, seatB, index % 2 ? accent : "#f8fafc", radius * 0.075);
        [-1, 1].forEach((side, seatIndex) => {
          const point = project(
            endpoint[0] + direction[0] * radius * 0.06 + tangent[0] * side * radius * 0.05,
            endpoint[1] + direction[1] * radius * 0.06 + tangent[1] * side * radius * 0.05,
            endpoint[2] + direction[2] * radius * 0.06 + tangent[2] * side * radius * 0.05
          );
          ctx.fillStyle = podColors[(index * 2 + seatIndex) % podColors.length];
          ctx.beginPath();
          ctx.arc(point[0], point[1], radius * 0.034, 0, 7);
          ctx.fill();
        });
      }
    });
  }
  rotorArms.sort((first, second) => first.depth - second.depth).forEach(item => item.draw());
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(rotorHub[0], rotorHub[1], radius * 0.055, 0, 7);
  ctx.fill();
  ctx.fillStyle = shadeEnterpriseColor(accent, 0.45);
  ctx.beginPath();
  ctx.arc(rotorHub[0] - radius * 0.016, rotorHub[1] - radius * 0.016, radius * 0.016, 0, 7);
  ctx.fill();
  drawPylon(axleX);
}

function drawChairSwingSprite(ctx, cx, cy, radius, options = {}) {
  const accent = options.accent || "#f8fafc";
  const rotation = options.t == null ? 0.4 : options.t;
  const fly = options.fly == null ? 0.8 : options.fly;
  const shadowFlip = options.flip ? -1 : 1;
  const project = (x, y, z) => [cx + (x - y) * 0.7, cy + (x + y) * 0.35 - z];
  const pointOnCircle = (distance, angle, z) =>
    project(distance * Math.cos(angle), distance * Math.sin(angle), z);
  const canopyRadius = radius * 0.46, towerHeight = radius * 0.62;
  const rotorHeight = towerHeight - radius * 0.045;
  const seatCount = 16, chainLength = radius * 0.38;
  const swingAngle = 0.15 + 0.65 * fly, baseZ = radius * 0.03;
  const cream = "#fde8c0", tau = Math.PI * 2;
  const line = (start, end, color, width) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
  };
  const ellipse = (point, size, fill) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.ellipse(point[0], point[1], size * 0.99, size * 0.495, 0, 0, 7);
    ctx.fill();
  };
  const cylinder = (size, z, height, color) => {
    const point = project(0, 0, z);
    ellipse(point, size, shadeEnterpriseColor(color, -0.25));
    ctx.fillRect(point[0] - 0.99 * size, point[1] - height, 1.98 * size, height);
    ellipse([point[0], point[1] - height], size, shadeEnterpriseColor(color, 0.15));
  };
  const side = (size, z, height, color) => {
    const point = project(0, 0, z);
    ctx.fillStyle = shadeEnterpriseColor(color, -0.1);
    ellipse(point, size, shadeEnterpriseColor(color, -0.1));
    ctx.fillRect(point[0] - 0.99 * size, point[1] - height, 1.98 * size, height);
  };
  const drawPolygon = (points, fill) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index) ctx.lineTo(point[0], point[1]);
      else ctx.moveTo(point[0], point[1]);
    });
    ctx.fill();
  };

  drawCampusHexPolygon(ctx, cx, cy, radius);
  ctx.fillStyle = "#cbd5e1";
  ctx.fill();
  ctx.lineWidth = Math.max(2, radius * 0.06);
  ctx.strokeStyle = accent;
  ctx.stroke();

  const platform = project(0, 0, baseZ);
  ellipse(platform, radius * 0.64, "#94a3b8");
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = radius * 0.012;
  ctx.beginPath();
  ctx.ellipse(platform[0], platform[1], 0.99 * radius * 0.64,
    0.495 * radius * 0.64, 0, 0, 7);
  ctx.stroke();
  ellipse([platform[0] + shadowFlip * radius * 0.14, platform[1] + radius * 0.05],
    radius * 0.5, "rgba(15,23,42,.18)");

  const seats = [];
  for (let index = 0; index < seatCount; index++) {
    const angle = rotation + index * tau / seatCount;
    const innerRadius = canopyRadius * 0.92;
    const outerRadius = innerRadius + chainLength * Math.sin(swingAngle);
    const seatZ = rotorHeight - chainLength * Math.cos(swingAngle);
    seats.push({
      angle, index,
      point: pointOnCircle(outerRadius, angle, seatZ),
      depth: Math.cos(angle) + Math.sin(angle),
      innerRadius, outerRadius, seatZ
    });
  }
  const riderColors = ["#facc15", "#3b82f6", "#22c55e", "#f97316", "#e2e8f0", "#a855f7"];
  const drawSeat = seat => {
    [-1, 1].forEach(offset => {
      const sideOffset = radius * 0.016 * offset;
      const cosine = Math.cos(seat.angle), sine = Math.sin(seat.angle);
      line(
        project(seat.innerRadius * cosine - sine * sideOffset,
          seat.innerRadius * sine + cosine * sideOffset, rotorHeight),
        project(seat.outerRadius * cosine - sine * sideOffset,
          seat.outerRadius * sine + cosine * sideOffset, seat.seatZ),
        "rgba(226,232,240,.85)", radius * 0.011
      );
    });
    const point = seat.point;
    ctx.fillStyle = riderColors[seat.index % riderColors.length];
    ctx.fillRect(point[0] - radius * 0.024, point[1] - radius * 0.08,
      radius * 0.048, radius * 0.068);
    ctx.fillStyle = "#fde4c8";
    ctx.beginPath();
    ctx.arc(point[0], point[1] - radius * 0.102, radius * 0.027, 0, 7);
    ctx.fill();
    ctx.fillStyle = seat.index % 2 ? accent : "#f8fafc";
    ctx.fillRect(point[0] - radius * 0.04, point[1] - radius * 0.016,
      radius * 0.08, radius * 0.02);
  };
  seats.filter(seat => seat.depth < 0).sort((a, b) => a.depth - b.depth).forEach(drawSeat);

  cylinder(radius * 0.26, baseZ, radius * 0.05, "#e2e8f0");
  const towerRadius = radius * 0.16;
  const towerBase = baseZ + radius * 0.05, towerTop = rotorHeight - radius * 0.06;
  cylinder(towerRadius, towerBase, towerTop - towerBase, cream);
  for (let index = 0; index < 8; index++) {
    const startAngle = -Math.PI / 4 + index * Math.PI * 0.25 * 0.9;
    const endAngle = startAngle + Math.PI * 0.25 * 0.9;
    ctx.fillStyle = index % 2 ? cream : accent;
    drawPolygon([
      pointOnCircle(towerRadius, startAngle, towerBase),
      pointOnCircle(towerRadius, endAngle, towerBase),
      pointOnCircle(towerRadius, endAngle, towerTop),
      pointOnCircle(towerRadius, startAngle, towerTop)
    ], ctx.fillStyle);
    if (index % 2 === 0) {
      ctx.fillStyle = "rgba(255,255,255,.35)";
      drawPolygon([
        pointOnCircle(towerRadius, startAngle + 0.1, towerBase + (towerTop - towerBase) * 0.3),
        pointOnCircle(towerRadius, endAngle - 0.1, towerBase + (towerTop - towerBase) * 0.3),
        pointOnCircle(towerRadius, endAngle - 0.1, towerBase + (towerTop - towerBase) * 0.7),
        pointOnCircle(towerRadius, startAngle + 0.1, towerBase + (towerTop - towerBase) * 0.7)
      ], ctx.fillStyle);
    }
  }
  cylinder(radius * 0.2, towerTop, radius * 0.05, accent);

  side(canopyRadius, rotorHeight, radius * 0.045, cream);
  ctx.strokeStyle = shadeEnterpriseColor(cream, -0.3);
  ctx.lineWidth = radius * 0.008;
  for (let index = 0; index < 24; index++) {
    const angle = rotation * 0.5 + index * tau / 24;
    if (Math.cos(angle) + Math.sin(angle) <= 0) continue;
    const point = pointOnCircle(canopyRadius * 0.995, angle, rotorHeight + radius * 0.015);
    ctx.fillStyle = "#fde68a";
    ctx.beginPath();
    ctx.arc(point[0], point[1], radius * 0.011, 0, 7);
    ctx.fill();
  }
  const peak = project(0, 0, towerHeight + radius * 0.11);
  for (let index = 0; index < 12; index++) {
    const startAngle = rotation * 0.5 + index * tau / 12;
    const endAngle = startAngle + tau / 12;
    ctx.fillStyle = index % 2 ? cream : accent;
    ctx.beginPath();
    ctx.moveTo(peak[0], peak[1]);
    for (let step = 0; step <= 3; step++) {
      const point = pointOnCircle(canopyRadius,
        startAngle + (endAngle - startAngle) * step / 3, towerHeight);
      ctx.lineTo(point[0], point[1]);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(120,53,15,.25)";
    ctx.lineWidth = radius * 0.006;
    ctx.stroke();
  }
  ctx.strokeStyle = shadeEnterpriseColor(accent, -0.3);
  ctx.lineWidth = radius * 0.012;
  ctx.beginPath();
  for (let step = 0; step <= 48; step++) {
    const point = pointOnCircle(canopyRadius, step / 48 * tau, towerHeight);
    if (step) ctx.lineTo(point[0], point[1]);
    else ctx.moveTo(point[0], point[1]);
  }
  ctx.stroke();
  const spire = project(0, 0, towerHeight + radius * 0.24);
  line(peak, spire, "#fde68a", radius * 0.016);
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(spire[0], spire[1], radius * 0.03, 0, 7);
  ctx.fill();

  seats.filter(seat => seat.depth >= 0).sort((a, b) => a.depth - b.depth).forEach(drawSeat);
}

function drawFerrisWheelSprite(ctx, cx, cy, radius, options = {}) {
  const accent = options.accent || "#f8fafc";
  const rotation = options.t == null ? 0.3 : options.t;
  const shadowFlip = options.flip ? -1 : 1;
  const project = (x, y, z) => [cx + (x - y) * 0.7, cy + (x + y) * 0.35 - z];
  const wheelHeight = radius * 0.62, wheelRadius = radius * 0.5;
  const wheelWidth = radius * 0.07, supportDepth = radius * 0.15;
  const cabinCount = 12, baseZ = radius * 0.035;
  const line = (start, end, color, width) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
  };
  const lerp = (start, end, amount) => [
    start[0] + (end[0] - start[0]) * amount,
    start[1] + (end[1] - start[1]) * amount
  ];
  const rim = (angle, depth) => project(
    wheelRadius * Math.cos(angle), depth, wheelHeight + wheelRadius * Math.sin(angle)
  );
  const drawAFrame = depth => {
    const top = project(0, depth, wheelHeight);
    const feet = [project(-radius * 0.38, depth, baseZ), project(radius * 0.38, depth, baseZ)];
    for (const foot of feet) {
      line(foot, top, "#64748b", radius * 0.05);
      line([foot[0] - radius * 0.01, foot[1]],
        [top[0] - radius * 0.01, top[1]], "#94a3b8", radius * 0.014);
      line(lerp(foot, top, 0.7), lerp(foot, top, 0.92), accent, radius * 0.054);
      ctx.fillStyle = "#475569";
      ctx.beginPath();
      ctx.ellipse(foot[0], foot[1], radius * 0.05, radius * 0.022, 0, 0, 7);
      ctx.fill();
    }
    line(lerp(feet[0], top, 0.28), lerp(feet[1], top, 0.28), "#64748b", radius * 0.028);
  };
  const drawRing = (depth, color, width) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (let index = 0; index <= 64; index++) {
      const point = rim(index / 64 * Math.PI * 2, depth);
      if (index) ctx.lineTo(point[0], point[1]);
      else ctx.moveTo(point[0], point[1]);
    }
    ctx.stroke();
  };
  const drawSpokes = (depth, color) => {
    for (let index = 0; index < cabinCount; index++) {
      line(project(0, depth, wheelHeight),
        rim(rotation + index * Math.PI * 2 / cabinCount, depth), color, radius * 0.012);
    }
  };

  drawCampusHexPolygon(ctx, cx, cy, radius);
  ctx.fillStyle = "#cbd5e1";
  ctx.fill();
  ctx.lineWidth = Math.max(2, radius * 0.06);
  ctx.strokeStyle = accent;
  ctx.stroke();

  const slabX = radius * 0.58, slabY = radius * 0.34;
  ctx.beginPath();
  [[-slabX, -slabY], [slabX, -slabY], [slabX, slabY], [-slabX, slabY]].forEach(([x, y], index) => {
    const point = project(x, y, baseZ);
    if (index) ctx.lineTo(point[0], point[1]);
    else ctx.moveTo(point[0], point[1]);
  });
  ctx.closePath();
  ctx.fillStyle = "#94a3b8";
  ctx.fill();
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = radius * 0.012;
  ctx.stroke();
  ctx.fillStyle = "rgba(15,23,42,.2)";
  ctx.beginPath();
  for (let index = 0; index <= 48; index++) {
    const angle = index / 48 * Math.PI * 2;
    const height = wheelHeight + wheelRadius * Math.sin(angle);
    const point = project(wheelRadius * Math.cos(angle), 0, baseZ);
    const x = point[0] + shadowFlip * height * 0.3;
    const y = point[1] + height * 0.15;
    if (index) ctx.lineTo(x, y);
    else ctx.moveTo(x, y);
  }
  ctx.fill();

  drawAFrame(-supportDepth);
  line(project(0, -supportDepth, wheelHeight),
    project(0, supportDepth, wheelHeight), "#94a3b8", radius * 0.05);
  drawRing(-wheelWidth, "#64748b", radius * 0.03);
  drawSpokes(-wheelWidth, "#64748b");
  for (let index = 0; index < cabinCount; index++) {
    const angle = rotation + index * Math.PI * 2 / cabinCount;
    line(rim(angle, -wheelWidth), rim(angle, wheelWidth), "#94a3b8", radius * 0.01);
  }
  const cabinColors = [accent, "#f8fafc", "#facc15"];
  const cabins = [];
  for (let index = 0; index < cabinCount; index++) {
    const point = rim(rotation + index * Math.PI * 2 / cabinCount, 0);
    cabins.push({ point, index });
  }
  cabins.sort((a, b) => a.point[1] - b.point[1]).forEach(({ point, index }) => {
    line(point, [point[0], point[1] + radius * 0.03], "#475569", radius * 0.01);
    const color = cabinColors[index % cabinColors.length];
    const cabinX = point[0], cabinY = point[1] + radius * 0.09;
    ctx.fillStyle = shadeEnterpriseColor(color, -0.35);
    ctx.beginPath();
    ctx.moveTo(cabinX - radius * 0.036, cabinY);
    ctx.lineTo(cabinX, cabinY + radius * 0.018);
    ctx.lineTo(cabinX, cabinY - radius * 0.037);
    ctx.lineTo(cabinX - radius * 0.036, cabinY - radius * 0.055);
    ctx.fill();
    ctx.fillStyle = shadeEnterpriseColor(color, -0.1);
    ctx.beginPath();
    ctx.moveTo(cabinX + radius * 0.036, cabinY);
    ctx.lineTo(cabinX, cabinY + radius * 0.018);
    ctx.lineTo(cabinX, cabinY - radius * 0.037);
    ctx.lineTo(cabinX + radius * 0.036, cabinY - radius * 0.055);
    ctx.fill();
    ctx.fillStyle = shadeEnterpriseColor(color, 0.2);
    ctx.beginPath();
    ctx.moveTo(cabinX - radius * 0.036, cabinY - radius * 0.055);
    ctx.lineTo(cabinX, cabinY - radius * 0.073);
    ctx.lineTo(cabinX + radius * 0.036, cabinY - radius * 0.055);
    ctx.lineTo(cabinX, cabinY - radius * 0.037);
    ctx.fill();
    ctx.fillStyle = "#7dd3fc";
    ctx.fillRect(cabinX - radius * 0.014, point[1] + radius * 0.05,
      radius * 0.028, radius * 0.018);
  });
  drawSpokes(wheelWidth, "#cbd5e1");
  drawRing(wheelWidth, "#cbd5e1", radius * 0.034);
  drawRing(wheelWidth, accent, radius * 0.014);
  for (let index = 0; index < 24; index++) {
    const point = rim(rotation + index * Math.PI / 12, wheelWidth);
    ctx.fillStyle = (index + Math.floor(rotation * 3)) % 2 ? "#fef08a" : "#fb923c";
    ctx.beginPath();
    ctx.arc(point[0], point[1], radius * 0.011, 0, 7);
    ctx.fill();
  }
  drawAFrame(supportDepth);
  const hub = project(0, supportDepth, wheelHeight);
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(hub[0], hub[1], radius * 0.065, 0, 7);
  ctx.fill();
  ctx.fillStyle = shadeEnterpriseColor(accent, 0.45);
  ctx.beginPath();
  ctx.arc(hub[0] - radius * 0.02, hub[1] - radius * 0.02, radius * 0.02, 0, 7);
  ctx.fill();
}

function drawPirateShipSprite(ctx, cx, cy, radius, options = {}) {
  const accent = options.accent || "#f8fafc";
  const swing = options.t == null ? 0.6 : options.t;
  const shadowFlip = options.flip ? -1 : 1;
  const project = (x, y, z) => [cx + (x - y) * 0.7, cy + (x + y) * 0.35 - z];
  const pivotZ = radius * 0.92, armLength = radius * 0.6;
  const axleX = radius * 0.46, legLength = radius * 0.26;
  const hullLength = radius * 0.4, hullWidth = radius * 0.28, baseZ = radius * 0.035;
  const line = (start, end, color, width) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
  };
  const lerp = (start, end, amount) => [
    start[0] + (end[0] - start[0]) * amount,
    start[1] + (end[1] - start[1]) * amount
  ];
  const polygon = (points, fill, stroke, lineWidth) => {
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index) ctx.lineTo(point[0], point[1]);
      else ctx.moveTo(point[0], point[1]);
    });
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth || radius * 0.01;
      ctx.stroke();
    }
  };
  const sine = Math.sin(swing), cosine = Math.cos(swing);
  const center = [0, armLength * sine, pivotZ - armLength * cosine];
  const alongArm = [0, -sine, cosine], alongSwing = [0, cosine, sine];
  const position = (length, height, side) => project(
    side, center[1] + alongArm[1] * height + alongSwing[1] * length,
    center[2] + alongArm[2] * height + alongSwing[2] * length
  );
  const halfWidthAt = length =>
    hullWidth / 2 * (1 - 0.85 * Math.pow(Math.abs(length) / hullLength, 3));
  const topAt = length => radius * 0.12 * Math.pow(Math.abs(length) / hullLength, 2.2);
  const bottomAt = length =>
    -radius * 0.09 * Math.pow(Math.max(0, 1 - (length / hullLength) ** 2), 0.55);
  const lengths = Array.from({ length: 17 }, (_, index) =>
    -hullLength + 2 * hullLength * index / 16);

  drawCampusHexPolygon(ctx, cx, cy, radius);
  ctx.fillStyle = "#cbd5e1";
  ctx.fill();
  ctx.lineWidth = Math.max(2, radius * 0.06);
  ctx.strokeStyle = accent;
  ctx.stroke();
  const slabX = radius * 0.64, slabY = radius * 0.42;
  ctx.beginPath();
  [[-slabX, -slabY], [slabX, -slabY], [slabX, slabY], [-slabX, slabY]].forEach(([x, y], index) => {
    const point = project(x, y, baseZ);
    if (index) ctx.lineTo(point[0], point[1]);
    else ctx.moveTo(point[0], point[1]);
  });
  ctx.closePath();
  ctx.fillStyle = "#94a3b8";
  ctx.fill();
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = radius * 0.012;
  ctx.stroke();
  const shadowPoint = project(0, center[1], baseZ);
  ctx.fillStyle = "rgba(15,23,42,.22)";
  ctx.beginPath();
  ctx.ellipse(shadowPoint[0] + shadowFlip * radius * 0.05,
    shadowPoint[1] + radius * 0.02, radius * 0.26, radius * 0.1, 0, 0, 7);
  ctx.fill();

  const drawPylon = x => {
    const top = project(x, 0, pivotZ);
    const feet = [project(x, -legLength, baseZ), project(x, legLength, baseZ)];
    for (const foot of feet) {
      line(foot, top, "#64748b", radius * 0.05);
      line([foot[0] - radius * 0.012, foot[1]],
        [top[0] - radius * 0.012, top[1]], "#94a3b8", radius * 0.016);
      line(lerp(foot, top, 0.66), lerp(foot, top, 0.9), accent, radius * 0.054);
    }
    line(lerp(feet[0], top, 0.3), lerp(feet[1], top, 0.3), "#64748b", radius * 0.03);
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(top[0], top[1], radius * 0.065, 0, 7);
    ctx.fill();
    ctx.fillStyle = shadeEnterpriseColor(accent, 0.45);
    ctx.beginPath();
    ctx.arc(top[0] - radius * 0.02, top[1] - radius * 0.02, radius * 0.02, 0, 7);
    ctx.fill();
  };
  const drawHullSide = side => {
    const top = lengths.map(length => position(length, topAt(length), side * halfWidthAt(length)));
    const bottom = lengths.map(length => position(length, bottomAt(length), side * halfWidthAt(length)));
    polygon(top.concat(bottom.slice().reverse()), side < 0 ? "#5c2d0c" : "#8b4513",
      shadeEnterpriseColor("#8b4513", -0.5), radius * 0.008);
    for (const fraction of [0.33, 0.66]) {
      ctx.strokeStyle = "rgba(0,0,0,.22)";
      ctx.lineWidth = radius * 0.007;
      ctx.beginPath();
      top.forEach((point, index) => {
        const inner = lerp(point, bottom[index], fraction);
        if (index) ctx.lineTo(inner[0], inner[1]);
        else ctx.moveTo(inner[0], inner[1]);
      });
      ctx.stroke();
    }
    ctx.strokeStyle = accent;
    ctx.lineWidth = radius * 0.026;
    ctx.lineJoin = "round";
    ctx.beginPath();
    top.forEach((point, index) => {
      if (index) ctx.lineTo(point[0], point[1]);
      else ctx.moveTo(point[0], point[1]);
    });
    ctx.stroke();
  };
  const riderColors = ["#ef4444", "#facc15", "#22c55e", "#3b82f6", "#f97316", "#e2e8f0"];
  const drawRiders = side => {
    [-0.26, -0.13, 0, 0.13, 0.26].forEach((offset, index) => {
      const length = offset * radius, across = side * hullWidth * 0.26;
      const body = position(length, -radius * 0.045, across);
      const seat = position(length, radius * 0.035, across);
      const head = position(length, radius * 0.068, across);
      line(body, seat, riderColors[(index + (side > 0 ? 3 : 0)) % riderColors.length], radius * 0.048);
      ctx.fillStyle = "#fde4c8";
      ctx.beginPath();
      ctx.arc(head[0], head[1], radius * 0.027, 0, 7);
      ctx.fill();
    });
  };

  drawPylon(-axleX);
  line(project(-axleX, 0, pivotZ), project(axleX, 0, pivotZ), "#94a3b8", radius * 0.045);
  drawHullSide(-1);
  polygon(
    lengths.map(length => position(length, -radius * 0.05, halfWidthAt(length)))
      .concat(lengths.slice().reverse().map(length => position(length, -radius * 0.05, -halfWidthAt(length)))),
    "#3b2210"
  );
  drawRiders(-1);
  const armStart = project(0, 0, pivotZ), armEnd = position(0, -radius * 0.02, 0);
  line(armStart, armEnd, "#475569", radius * 0.055);
  line(lerp(armStart, armEnd, 0.55), lerp(armStart, armEnd, 0.85), accent, radius * 0.058);
  line([armStart[0] - radius * 0.012, armStart[1]],
    [armEnd[0] - radius * 0.012, armEnd[1]], "#94a3b8", radius * 0.014);
  drawRiders(1);
  drawHullSide(1);
  [-1, 1].forEach(direction => {
    const bow = position(direction * hullLength, topAt(hullLength), 0);
    const control = position(direction * (hullLength + radius * 0.07), topAt(hullLength) + radius * 0.07, 0);
    const tip = position(direction * (hullLength + radius * 0.03), topAt(hullLength) + radius * 0.17, 0);
    ctx.strokeStyle = accent;
    ctx.lineWidth = radius * 0.032;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(bow[0], bow[1]);
    ctx.quadraticCurveTo(control[0], control[1], tip[0], tip[1]);
    ctx.stroke();
    ctx.fillStyle = shadeEnterpriseColor(accent, 0.3);
    ctx.beginPath();
    ctx.arc(tip[0], tip[1], radius * 0.03, 0, 7);
    ctx.fill();
  });
  drawPylon(axleX);
}

let campusAnimationFrame = null;
function scheduleCampusAnimation() {
  if (campusAnimationFrame !== null) return;
  campusAnimationFrame = requestAnimationFrame(() => {
    campusAnimationFrame = null;
    if (gameState.mapViewMode === "campus") drawMapCanvas();
  });
}

function drawMapCanvas() {
  const canvas = document.getElementById("mapCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(gameState.camera.x, gameState.camera.y);
  ctx.scale(gameState.camera.zoom, gameState.camera.zoom);
  if (gameState.mapViewMode === "national") drawNationalUSMap(ctx);
  else drawParkCampusMap(ctx);
  ctx.restore();
}

function drawNationalUSMap(ctx) {
  const territoryOwnerByKey = new Map();
  for (const p of gameState.players) {
    for (const pk of p.parks) {
      const cH = gameState.hexByKey.get(pk.hexKey);
      if (!cH) continue;
      for (const h of gameState.hexGrid) if (hexDistance(cH, h) <= 1) territoryOwnerByKey.set(h.key, p);
    }
  }
  for (const h of gameState.hexGrid) {
    const { x, y } = getHexPixelCenter(h.col, h.row);
    const trait = HEX_TRAITS[h.traitId];
    drawHexPolygon(ctx, x, y, HEX_RADIUS - 0.8);
    ctx.fillStyle = trait.fill;
    ctx.fill();
    const bOwner = territoryOwnerByKey.get(h.key);
    ctx.lineWidth = bOwner ? (h.parkId ? 3.2 : 2.0) : 0.8;
    ctx.strokeStyle = bOwner ? bOwner.color : "rgba(15,23,42,0.45)";
    ctx.stroke();
    if (h.key === gameState.selectedHexKey || h.key === gameState.hoveredHexKey) {
      drawHexPolygon(ctx, x, y, HEX_RADIUS - 1.5);
      ctx.lineWidth = h.key === gameState.selectedHexKey ? 3.0 : 2.0;
      ctx.strokeStyle = h.key === gameState.selectedHexKey ? "#0f172a" : "#fff";
      ctx.stroke();
    }
  }
  if (gameState.selectedHexKey) {
    const selH = gameState.hexByKey.get(gameState.selectedHexKey);
    if (selH) {
      for (const h of gameState.hexGrid) {
        const d = hexDistance(selH, h);
        if (d > 0 && d <= 3) {
          const { x, y } = getHexPixelCenter(h.col, h.row);
          drawHexPolygon(ctx, x, y, HEX_RADIUS - 3);
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = "rgba(6,182,212,0.55)";
          ctx.stroke();
        }
      }
    }
  }
  for (const p of gameState.players) {
    for (const pk of p.parks) {
      const h = gameState.hexByKey.get(pk.hexKey);
      if (!h) continue;
      const { x, y } = getHexPixelCenter(h.col, h.row);
      const summary = calculateParkScoreSummary(pk, p);
      ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = "#fff"; ctx.stroke();
      ctx.font = "11px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff"; ctx.fillText("🎢", x, y);
      const lbl = `${pk.name} (${summary.finalScore.toFixed(0)}p)`;
      ctx.font = "bold 9.5px 'Segoe UI', sans-serif";
      const bw = ctx.measureText(lbl).width + 14, bh = 16, bx = x - bw / 2, by = y - 28;
      ctx.fillStyle = "rgba(15,23,42,0.92)";
      ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 4); ctx.fill();
      ctx.lineWidth = 1.4; ctx.strokeStyle = p.color; ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.fillText(lbl, x, by + bh / 2 + 0.5);
    }
  }
}

function getFacilityIcon(role) {
  return role === "toilets" ? "🚻" : (role === "restaurant" ? "🍔" : "ℹ️");
}

function getZoneForTile(park, tile) {
  if (!tile || !tile.zoneId) return null;
  return park.zones.find(z => z.id === tile.zoneId) || null;
}

function getEffectiveTileThemeLevel(tile) {
  if (!tile || tile.state !== "cleared") return 0;
  const expected = tile.zoneId || "generic";
  return tile.themedForZoneId === expected ? (tile.themeLevel || 0) : 0;
}

function getEffectiveRideThemeLevel(ride) {
  if (!ride) return 0;
  const expected = ride.zoneId || "generic";
  return ride.themedForZoneId === expected ? (ride.themeLevel || 0) : 0;
}

function drawParkCampusMap(ctx) {
  const p = gameState.players[gameState.inspectedPlayerIdx];
  const park = p.parks.find(pk => pk.id === gameState.selectedParkId) || p.parks[0];
  const hexObj = gameState.hexByKey.get(park.hexKey);
  const totMult = getTotalHexAttendanceMultiplier(hexObj);
  document.getElementById("mapModeIndicator").textContent = `🎡 ${park.name} — 49-Hex District Campus (${hexObj ? hexObj.regionName : ''} • ${totMult}x Market)`;

  const tileByKey = new Map(park.tiles.map(t => [t.key, t]));

  // 1. Draw all 49 Hex Tiles in the Diamond Grid
  for (const t of park.tiles) {
    const zone = getZoneForTile(park, t);
    const isSel = t.key === gameState.selectedCampusTileKey;
    const inBrush = gameState.zoneEditor.active && gameState.zoneEditor.selectedKeys.has(t.key);
    const effTileTheme = getEffectiveTileThemeLevel(t);

    drawCampusHexPolygon(ctx, t.px, t.py, CAMPUS_HEX_R);

    if (t.isEntrance) {
      ctx.fillStyle = "#7dd3fc";
    } else if (t.state === "woods") {
      ctx.fillStyle = "#64748b"; // Grey Undeveloped Woods
    } else if (zone) {
      ctx.fillStyle = zone.color;
    } else {
      ctx.fillStyle = "#bbf7d0"; // Cleared Unzoned Flat Land
    }
    ctx.fill();

    // Border styling
    if (inBrush) {
      ctx.lineWidth = 4;
      ctx.strokeStyle = gameState.zoneEditor.color || "#ffffff";
    } else if (isSel) {
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = "#f59e0b";
    } else {
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = "#0f172a";
    }
    ctx.stroke();

    // Tile Content: Entrance (ME), Woods Tree, or Scenery Stars
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (t.isEntrance) {
      ctx.fillStyle = "#dc2626";
      ctx.font = "bold 14px 'Segoe UI', sans-serif";
      ctx.fillText("ME", t.px, t.py - 3);
      ctx.font = "9px 'Segoe UI', sans-serif";
      ctx.fillStyle = "#0f172a";
      ctx.fillText("Entrance", t.px, t.py + 11);
    } else if (t.state === "woods") {
      ctx.font = "16px sans-serif";
      ctx.fillText("🌲", t.px, t.py);
    } else if (effTileTheme > 0 && !t.rideId) {
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 9px 'Segoe UI', sans-serif";
      ctx.fillText("★".repeat(effTileTheme), t.px, t.py + 18);
    }
  }

  // 2. Draw 1-Hex Rides/Facilities & 2-Hex Diagonal Coasters/Tracked Rides on Top
  for (const r of park.rides) {
    const t1 = tileByKey.get(r.primaryTileKey);
    if (!t1) continue;
    const zone = r.zoneId ? park.zones.find(z => z.id === r.zoneId) : null;
    const accentColor = r.trainLineColor || (zone ? zone.color : "#ffffff");
    const isDown = !isRideOperational(r);

    if (r.spaces === 2 && r.secondaryTileKey) {
      const t2 = tileByKey.get(r.secondaryTileKey);
      if (t2) {
        if (r.modelId === "rapids") {
          const phase = isDown ? 0.1 : (performance.now() / 1000 / 24) % 1;
          ctx.save();
          drawRapidsSprite(ctx, t1, t2, CAMPUS_HEX_R, { accent: accentColor, t: phase });
          ctx.fillStyle = "#0f172a";
          ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, (t1.px + t2.px) / 2, (t1.py + t2.py) / 2 + CAMPUS_HEX_R * 0.62);
          ctx.restore();
          continue;
        }
        // Draw Red Diagonal Coaster / Tracked Ride Bar across both hexes
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(t1.px, t1.py);
        ctx.lineTo(t2.px, t2.py);
        ctx.lineCap = "round";
        ctx.lineWidth = 14;
        ctx.strokeStyle = isDown ? "#991b1b" : "#dc2626";
        ctx.stroke();

        ctx.lineWidth = 8;
        ctx.strokeStyle = accentColor;
        ctx.stroke();

        const mx = (t1.px + t2.px) / 2;
        const my = (t1.py + t2.py) / 2;
        ctx.beginPath();
        ctx.arc(mx, my, 15, 0, Math.PI * 2);
        ctx.fillStyle = "#0f172a";
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = isDown ? "#ef4444" : accentColor;
        ctx.stroke();

        ctx.font = "14px sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText(r.category === "coaster" ? "🎢" : "🚣", mx, my);

        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillStyle = "#0f172a";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, mx, my + 23);
        ctx.restore();
      }
    } else {
      // 1-Hex Flat Ride or Facility
      ctx.save();
      if (r.category === "facility") {
        const code = r.facilityRole === "toilets" ? "RR" : (r.facilityRole === "restaurant" ? "FB" : "GS");
        const emoji = getFacilityIcon(r.facilityRole);
        const effR = getEffectiveRideThemeLevel(r);
        if (r.facilityRole === "restaurant") {
          drawDinerSprite(ctx, t1.px, t1.py, CAMPUS_HEX_R * 0.72, accentColor);
          ctx.fillStyle = "#0f172a";
          ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
          ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`,
            t1.px, t1.py + CAMPUS_HEX_R * 0.62);
        } else if (r.facilityRole === "toilets") {
          drawRestroomsSprite(ctx, t1.px, t1.py, CAMPUS_HEX_R * 0.72, accentColor);
          ctx.fillStyle = "#0f172a";
          ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
          ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`,
            t1.px, t1.py + CAMPUS_HEX_R * 0.62);
        } else if (r.facilityRole === "guest_services") {
          drawGuestServicesSprite(ctx, t1.px, t1.py, CAMPUS_HEX_R * 0.72, accentColor);
          ctx.fillStyle = "#0f172a";
          ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
          ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`,
            t1.px, t1.py + CAMPUS_HEX_R * 0.62);
        } else {
          ctx.fillStyle = "#dc2626";
          ctx.font = "bold 12px 'Segoe UI', sans-serif";
          ctx.fillText(`${emoji}${code}`, t1.px, t1.py - 2);
        }
        if (effR > 0 && !["guest_services", "toilets"].includes(r.facilityRole)) {
          ctx.fillStyle = "#0f172a";
          ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
          ctx.fillText(`+${RIDE_SCENERY_TIERS[effR].points}p`, t1.px, t1.py + 12);
        }
      } else if (r.modelId === "ferris_wheel") {
        const rotation = isDown ? 0.3 : performance.now() / 1000 * 0.35;
        drawFerrisWheelSprite(ctx, t1.px, t1.py, CAMPUS_HEX_R, {
          accent: accentColor, t: rotation
        });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "drop_tower") {
        const model = FLAT_RIDE_CATALOG.find(item => item.id === "drop_tower");
        const height = r.height || model.baseHeight;
        const levels = 1 + ((height - model.baseHeight) / (model.maxHeight - model.baseHeight)) * 9;
        const phase = performance.now() / 1000 % 6.5;
        const gondolaPosition = isDown ? 0 : (phase < 3
          ? (1 - Math.cos(Math.PI * phase / 3)) / 2 * 0.999
          : (phase < 4 ? 1 : (phase < 4.8 ? 1 - Math.pow((phase - 4) / 0.8, 2) : 0)));
        drawDropTowerSprite(ctx, t1.px, t1.py, CAMPUS_HEX_R, { accent: accentColor, levels, t: gondolaPosition });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "top_spin") {
        const seconds = performance.now() / 1000;
        const phase = seconds % 12;
        const swing = isDown ? 0.9 : 2.5 * Math.sin(Math.PI * phase / 12) * Math.sin(2 * Math.PI * phase / 2.4);
        drawTopSpinSprite(ctx, t1.px, t1.py, CAMPUS_HEX_R, { accent: accentColor, t: swing });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "scrambler") {
        const rotation = isDown ? 0.6 : performance.now() / 1000 * 1.1;
        drawScramblerSprite(ctx, t1.px, t1.py, CAMPUS_HEX_R, { accent: accentColor, t: rotation });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "enterprise") {
        const seconds = performance.now() / 1000;
        const phase = seconds % 16;
        const tilt = isDown ? 0 : 1.4 * Math.pow(Math.sin(Math.PI * phase / 16), 0.7);
        const spin = isDown ? 0 : seconds * (0.8 + 2.4 * Math.sin(Math.PI * phase / 16));
        drawEnterpriseSprite(ctx, t1.px, t1.py, CAMPUS_HEX_R, { accent: accentColor, t: spin, tilt });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "claw") {
        const seconds = performance.now() / 1000;
        const swing = isDown ? 1.7 : 2.1 * Math.sin(seconds * 0.9);
        const rotor = isDown ? 0.5 : seconds * 2.6;
        drawClawSprite(ctx, t1.px, t1.py, CAMPUS_HEX_R, {
          accent: accentColor, t: swing, r: rotor
        });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "chair_swings") {
        const seconds = performance.now() / 1000;
        const phase = seconds % 14;
        const fly = isDown ? 0 : Math.min(1, Math.sin(Math.PI * phase / 14) * 1.4);
        const rotation = isDown ? 0.4 : seconds * (0.5 + 1.6 * fly);
        drawChairSwingSprite(ctx, t1.px, t1.py, CAMPUS_HEX_R, {
          accent: accentColor, t: rotation, fly
        });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "pirate_ship") {
        const seconds = performance.now() / 1000;
        const phase = seconds % 12;
        const swing = isDown ? 0.6 :
          1.25 * Math.sin(Math.PI * phase / 12) * Math.sin(2 * Math.PI * phase / 2.6);
        drawPirateShipSprite(ctx, t1.px, t1.py, CAMPUS_HEX_R, {
          accent: accentColor, t: swing
        });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else {
        // Flat Ride or Train Station (Red Ring + Emoji)
        ctx.beginPath();
        ctx.arc(t1.px, t1.py, 15, 0, Math.PI * 2);
        ctx.fillStyle = "#0f172a";
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = isDown ? "#991b1b" : "#dc2626";
        ctx.stroke();

        ctx.font = "13px sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText(r.isTrainStation ? "🚂" : "🎠", t1.px, t1.py);

        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillStyle = "#0f172a";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + 22);
      }
      ctx.restore();
    }
  }
  if (park.rides.some(ride => [
    "enterprise", "scrambler", "drop_tower", "top_spin", "rapids", "claw",
    "chair_swings", "pirate_ship", "ferris_wheel"
  ].includes(ride.modelId) && isRideOperational(ride))) {
    scheduleCampusAnimation();
  }
}

/* --- 6. NEW HEX & THEMED LAND SCORING ENGINE --- */

function getCurrentEraName() {
  return gameState.year >= 30 ? "Advanced Era" : (gameState.year >= 15 ? "Modern Era" : "Classic Era");
}
function isModelEraAvailable(era) { return gameState.year >= (ERA_UNLOCK_YEARS[era] || 1); }
function getRecordBonusValue() { return 1 + Math.floor((gameState.year - 1) / 10); }
function getAwardCashValue() { return 0.25 + Math.floor((gameState.year - 1) / 10) * 0.25; }

function rollCoasterSmoothness(player, gen) {
  if (hasCustomTrait(player, "pos_auto_smooth")) return { tier: "Smooth", penalty: 0 };
  const w = gen === "classic" ? [3, 2, 1] : (gen === "modern" ? [1, 2, 1] : [1, 2, 3]);
  const r = Math.random() * (w[0] + w[1] + w[2]);
  return r < w[0] ? { tier: "Rough", penalty: 4 } : (r < w[0] + w[1] ? { tier: "Fine", penalty: 2 } : { tier: "Smooth", penalty: 0 });
}

function isRideOperational(ride) { return ride.status === "open"; }

function calculateBaseRideTechPoints(ride) {
  if (!isRideOperational(ride) || ride.category === "facility") return 0;
  if (ride.category === "flat" || ride.category === "tracked") return ride.techPoints;
  return Math.max(0.5, ((ride.length / 100) * 0.25 + (ride.height / 20) * 0.5 + (ride.inversions || 0) * 1.0) - (ride.smoothnessPenalty || 0));
}

function calculateRideSceneryPoints(ride) {
  if (!isRideOperational(ride)) return 0;
  const effLevel = getEffectiveRideThemeLevel(ride);
  const basePts = RIDE_SCENERY_TIERS[effLevel].points;
  // Rides in a designated Themed Land receive a 1.25x Zoned Scenery Multiplier!
  const zoneMult = (ride.zoneId && ride.zoneId !== "generic") ? 1.25 : 1.0;
  return basePts * zoneMult;
}

function calculateRideTotalScore(ride, ownerPlayer = null) {
  if (!isRideOperational(ride)) return 0;
  let sub = calculateBaseRideTechPoints(ride) + calculateRideSceneryPoints(ride) + ((ride.recordTags ? ride.recordTags.length : 0) * getRecordBonusValue());
  if (ride.cultClassic) sub *= 1.20;
  if (ownerPlayer) {
    if (ownerPlayer.legend.id === "hugo_herschend" && ["stage_show", "rapids", "train"].includes(ride.modelId)) sub *= 1.20;
    if (ownerPlayer.legend.id === "angus_wynne" && ride.era === "classic" && ride.category !== "facility") sub *= 1.10;
  }
  return sub;
}

function getRestaurantMealPrice(restaurant) {
  const price = Number(restaurant.mealPrice);
  return Number.isInteger(price) &&
    price >= FOOD_AND_BEVERAGE_RULES.minMealPrice &&
    price <= FOOD_AND_BEVERAGE_RULES.maxMealPrice
    ? price
    : FOOD_AND_BEVERAGE_RULES.defaultMealPrice;
}

function getGlobalAverageMealPrice() {
  const restaurants = gameState.players.flatMap(player =>
    player.parks.flatMap(park =>
      park.rides.filter(ride => ride.category === "facility" &&
        ride.facilityRole === "restaurant" && isRideOperational(ride))
    )
  );
  if (restaurants.length === 0) return 15.0;
  return restaurants.reduce((sum, restaurant) => sum + getRestaurantMealPrice(restaurant), 0) / restaurants.length;
}

function calculateParkFoodAndBeverageLedger(park, attendance, ownerPlayer, globalAveragePrice, prestige) {
  const restaurants = park.rides.filter(ride => ride.category === "facility" &&
    ride.facilityRole === "restaurant" && isRideOperational(ride));
  if (restaurants.length === 0) {
    return { venueCount: 0, mealsSold: 0, grossRevenue: 0, cogs: 0, overhead: 0, netProfit: 0, venues: [] };
  }

  const venueCount = restaurants.length;
  const metrics = prestige || calculateParkPrestigeMetrics(park, ownerPlayer);
  const placeMakingIndex = metrics.placeMakingIndex;
  const revenueMultiplier = ownerPlayer?.revenueMult || 1;
  const hungryPoolShare = FOOD_AND_BEVERAGE_RULES.baseHungryPoolShare +
    FOOD_AND_BEVERAGE_RULES.placeMakingHungryPoolBonus * placeMakingIndex;
  const guestsPerUnit = attendance / venueCount;
  let totalMealsSold = 0, grossRevenue = 0, variableCogs = 0, fixedOpEx = 0;
  const venues = restaurants.map(restaurant => {
    const themeTier = getEffectiveRideThemeLevel(restaurant);
    const zoneBonus = restaurant.zoneId && restaurant.zoneId !== "generic" ? 1 : 0;
    const referencePrice =
      FOOD_AND_BEVERAGE_RULES.baselineMarketPrice * FOOD_AND_BEVERAGE_RULES.fixedPriceWeight +
      globalAveragePrice * FOOD_AND_BEVERAGE_RULES.globalAverageWeight +
      themeTier * FOOD_AND_BEVERAGE_RULES.themeBonusPerTier +
      placeMakingIndex * 2.5 + zoneBonus;
    const priceDelta = getRestaurantMealPrice(restaurant) - referencePrice;
    const priceConversion = priceDelta < 0
      ? Math.min(0.88, 0.52 - 0.048 * priceDelta)
      : 0.52 * Math.exp(-0.06 * priceDelta * priceDelta);
    const mealsSold = Math.min(
      FOOD_AND_BEVERAGE_RULES.annualCapacityPerVenue,
      Math.round(guestsPerUnit * hungryPoolShare * priceConversion)
    );
    const venueGrossRevenue = mealsSold * getRestaurantMealPrice(restaurant) / 1000000;
    const venueVariableCogs = mealsSold * FOOD_AND_BEVERAGE_RULES.costPerMeal / 1000000;
    const venueFixedOpEx = FOOD_AND_BEVERAGE_RULES.fixedOverheadPerVenue +
      guestsPerUnit / 1000000 * FOOD_AND_BEVERAGE_RULES.fixedOverheadPerMillionGuests;
    const venueCogs = venueVariableCogs + venueFixedOpEx;
    const netProfit = (venueGrossRevenue - venueCogs) * revenueMultiplier;
    restaurant.lastFbStats = {
      mealsSold,
      grossRev: venueGrossRevenue * revenueMultiplier,
      cogs: venueCogs * revenueMultiplier,
      fixedOpEx: venueFixedOpEx * revenueMultiplier,
      netProfit
    };
    totalMealsSold += mealsSold;
    grossRevenue += venueGrossRevenue;
    variableCogs += venueVariableCogs;
    fixedOpEx += venueFixedOpEx;
    return {
      rideId: restaurant.id,
      mealsSold,
      grossRevenue: venueGrossRevenue,
      cogs: venueCogs,
      overhead: venueFixedOpEx,
      fixedOpEx: venueFixedOpEx,
      profit: netProfit
    };
  });
  const cogs = variableCogs + fixedOpEx;
  return {
    venueCount,
    mealsSold: totalMealsSold,
    grossRevenue,
    cogs,
    overhead: fixedOpEx,
    fixedOpEx,
    netProfit: venues.reduce((sum, venue) => sum + venue.profit, 0),
    landHarmonyAvg: metrics.landHarmonyAvg,
    venues
  };
}

function setRestaurantMealPrice(parkId, rideId, rawPrice) {
  if (gameState.inspectedPlayerIdx !== gameState.activePlayerIdx) return;
  const player = gameState.players[gameState.activePlayerIdx];
  const park = player.parks.find(item => item.id === parkId);
  const restaurant = park?.rides.find(ride => ride.id === rideId &&
    ride.category === "facility" && ride.facilityRole === "restaurant");
  const price = Number(rawPrice);
  if (!restaurant || !Number.isInteger(price) ||
      price < FOOD_AND_BEVERAGE_RULES.minMealPrice ||
      price > FOOD_AND_BEVERAGE_RULES.maxMealPrice) {
    throw new RangeError("Meal price must be a whole dollar amount from $5 to $25.");
  }
  restaurant.mealPrice = price;
  renderAll();
}

function applyRestaurantMealPriceToPark(parkId, rawPrice) {
  if (gameState.inspectedPlayerIdx !== gameState.activePlayerIdx) return;
  const player = gameState.players[gameState.activePlayerIdx];
  const park = player.parks.find(item => item.id === parkId);
  const price = Number(rawPrice);
  if (!park || !Number.isInteger(price) || price < FOOD_AND_BEVERAGE_RULES.minMealPrice ||
      price > FOOD_AND_BEVERAGE_RULES.maxMealPrice) {
    throw new RangeError("Meal price must be a whole dollar amount from $5 to $25.");
  }
  for (const restaurant of park.rides) {
    if (restaurant.category === "facility" && restaurant.facilityRole === "restaurant") {
      restaurant.mealPrice = price;
    }
  }
  renderAll();
}

function getParkAmenityCoverage(park) {
  const coverage = new Map(park.tiles.map(tile => [tile.key, { toilets: false, restaurant: false }]));
  const tileByKey = new Map(park.tiles.map(tile => [tile.key, tile]));

  for (const ride of park.rides) {
    if (!isRideOperational(ride) || ride.category !== "facility") continue;
    if (ride.facilityRole !== "toilets" && ride.facilityRole !== "restaurant") continue;
    const facilityTile = tileByKey.get(ride.primaryTileKey);
    if (!facilityTile) continue;

    for (const tile of park.tiles) {
      if (hexDistance(facilityTile, tile) <= 2) {
        coverage.get(tile.key)[ride.facilityRole === "toilets" ? "toilets" : "restaurant"] = true;
      }
    }
  }

  return coverage;
}

function getTileAmenityPenalty(tile, amenityCoverage) {
  const coverage = amenityCoverage.get(tile.key);
  return (!coverage || !coverage.toilets ? 0.10 : 0) + (!coverage || !coverage.restaurant ? 0.10 : 0);
}

function evaluateThemedLandBreakdown(park, zone, ownerPlayer = null, amenityCoverage = getParkAmenityCoverage(park)) {
  const landTiles = park.tiles.filter(t => t.state === "cleared" && t.zoneId === zone.id);
  const landRides = park.rides.filter(r => r.zoneId === zone.id && isRideOperational(r));

  let tileScenicRaw = 0;
  let minTileTheme = landTiles.length > 0 ? 4 : 0;
  const pointsByTile = new Map();
  for (const t of landTiles) {
    const lv = getEffectiveTileThemeLevel(t);
    if (lv < minTileTheme) minTileTheme = lv;
    const scenic = TILE_SCENERY_TIERS[lv].points * 1.25; // 1.25x Zoned Tile Multiplier
    tileScenicRaw += scenic;
    pointsByTile.set(t.key, { scenic, other: 0 });
  }

  let rideScenicSum = 0;
  let rideTechAndRecSum = 0;
  let minRideTheme = landRides.length > 0 ? 4 : 0;

  for (const r of landRides) {
    const lv = getEffectiveRideThemeLevel(r);
    if (lv < minRideTheme) minRideTheme = lv;
    const rideScenic = calculateRideSceneryPoints(r);
    const rideOther = calculateRideTotalScore(r, ownerPlayer) - rideScenic;
    rideScenicSum += rideScenic;
    rideTechAndRecSum += rideOther;

    const rideTileKeys = [r.primaryTileKey, r.secondaryTileKey]
      .filter((key, index, keys) => key && keys.indexOf(key) === index && pointsByTile.has(key));
    if (rideTileKeys.length === 0 && landTiles.length > 0) rideTileKeys.push(landTiles[0].key);
    for (const key of rideTileKeys) {
      const tilePoints = pointsByTile.get(key);
      tilePoints.scenic += rideScenic / rideTileKeys.length;
      tilePoints.other += rideOther / rideTileKeys.length;
    }
  }

  // Land Harmony requires at least 4 tiles, at least 2 rides/facilities, and matches lowest theme tier
  const harmonyTier = (landTiles.length >= 4 && landRides.length >= 2) ? Math.min(minTileTheme, minRideTheme) : 0;
  const legHarmMult = ownerPlayer ? getPlayerHarmonyBonusMultiplier(ownerPlayer) : 1.0;
  const harmonyMult = LAND_HARMONY_TIERS[harmonyTier].bonus * legHarmMult;
  const totalLandScenic = (tileScenicRaw + rideScenicSum) * (1 + harmonyMult);

  let finalLandScore = 0;
  let toiletsCoveredTiles = 0, restaurantCoveredTiles = 0;
  for (const tile of landTiles) {
    const coverage = amenityCoverage.get(tile.key);
    if (coverage && coverage.toilets) toiletsCoveredTiles++;
    if (coverage && coverage.restaurant) restaurantCoveredTiles++;
    const points = pointsByTile.get(tile.key);
    const tileScore = points.scenic * (1 + harmonyMult) + points.other;
    finalLandScore += tileScore * (1 - getTileAmenityPenalty(tile, amenityCoverage));
  }

  return {
    zone,
    tileCount: landTiles.length,
    rideCount: landRides.length,
    harmonyTier,
    totalPlotScenic: totalLandScenic,
    toiletsCoveredTiles,
    restaurantCoveredTiles,
    hasToilets: toiletsCoveredTiles === landTiles.length,
    hasRestaurant: restaurantCoveredTiles === landTiles.length,
    finalLandScore
  };
}

function calculatePlotScenicBreakdown(plot, ownerPlayer = null) {
  const park = ownerPlayer ? ownerPlayer.parks.find(pk => pk.plots.some(pl => pl.id === plot.id)) : null;
  if (park && park.zones) {
    const z = park.zones.find(zn => zn.id === plot.id);
    if (z) return evaluateThemedLandBreakdown(park, z, ownerPlayer);
  }
  return { totalPlotScenic: 0 };
}

function checkParkHasGuestServices(park) {
  return (park.rides || []).some(r => isRideOperational(r) && r.category === "facility" && r.facilityRole === "guest_services");
}

function checkParkBalancedPortfolio(park) {
  let c = false, f = false, t = false, tr = false;
  for (const r of (park.rides || [])) {
    if (!isRideOperational(r)) continue;
    if (r.category === "coaster") c = true;
    else if (r.subType === "family") f = true;
    else if (r.subType === "thrill") t = true;
    else if (r.subType === "transport") tr = true;
  }
  return c && f && t && tr;
}

function calculateParkScoreSummary(park, ownerPlayer = null) {
  if (!ownerPlayer) ownerPlayer = gameState.players.find(p => p.parks.some(pk => pk.id === park.id));
  syncParkPlotsMirror(park);
  const amenityCoverage = getParkAmenityCoverage(park);

  let sumLandsScore = 0, totalScenic = 0;
  for (const z of (park.zones || [])) {
    const ev = evaluateThemedLandBreakdown(park, z, ownerPlayer, amenityCoverage);
    sumLandsScore += ev.finalLandScore;
    totalScenic += ev.totalPlotScenic;
  }

  // Add Generic (Unzoned) Tiles & Rides (1.0x multiplier)
  const genericTiles = (park.tiles || []).filter(t => t.state === "cleared" && !t.zoneId && !t.isEntrance);
  const genericRides = (park.rides || []).filter(r => !r.zoneId && isRideOperational(r));
  const genericPointsByTile = new Map();
  let genScenic = 0;
  for (const t of genericTiles) {
    const pts = TILE_SCENERY_TIERS[getEffectiveTileThemeLevel(t)].points;
    genericPointsByTile.set(t.key, { scenic: pts, other: 0 });
    genScenic += pts;
  }
  for (const r of genericRides) {
    const rideScenic = calculateRideSceneryPoints(r);
    const rideOther = calculateRideTotalScore(r, ownerPlayer) - rideScenic;
    genScenic += rideScenic;
    const rideTileKeys = [r.primaryTileKey, r.secondaryTileKey]
      .filter((key, index, keys) => key && keys.indexOf(key) === index && genericPointsByTile.has(key));
    if (rideTileKeys.length === 0 && genericTiles.length > 0) rideTileKeys.push(genericTiles[0].key);
    for (const key of rideTileKeys) {
      const tilePoints = genericPointsByTile.get(key);
      tilePoints.scenic += rideScenic / rideTileKeys.length;
      tilePoints.other += rideOther / rideTileKeys.length;
    }
  }
  for (const tile of genericTiles) {
    const points = genericPointsByTile.get(tile.key);
    sumLandsScore += (points.scenic + points.other) * (1 - getTileAmenityPenalty(tile, amenityCoverage));
  }
  totalScenic += genScenic;

  const parkRecBonus = (park.recordTags ? park.recordTags.length : 0) * getRecordBonusValue();
  let score = sumLandsScore + parkRecBonus;
  const hasGuestServices = checkParkHasGuestServices(park);
  if (!hasGuestServices) score *= 0.95;

  const hasBalancedBonus = checkParkBalancedPortfolio(park);
  const balancedBonusPts = hasBalancedBonus ? score * 0.10 : 0;
  return { totalScenic, totalRecordBonus: parkRecBonus, hasGuestServices, hasBalancedBonus, balancedBonusPts, finalScore: score + balancedBonusPts };
}

function calculateParkPrestigeMetrics(park, ownerPlayer = null) {
  if (!ownerPlayer) ownerPlayer = gameState.players.find(player => player.parks.some(item => item.id === park.id));
  const summary = calculateParkScoreSummary(park, ownerPlayer);
  const recordBonus = getRecordBonusValue();
  const totalTechScore = (park.rides || []).reduce((sum, ride) => {
    if (!isRideOperational(ride) || ride.category === "facility") return sum;
    return sum + calculateBaseRideTechPoints(ride) + (ride.recordTags?.length || 0) * recordBonus;
  }, (park.recordTags?.length || 0) * recordBonus);
  const totalScenicScore = summary.totalScenic;
  const scenicRatio = totalScenicScore / Math.max(10, totalTechScore + totalScenicScore);
  const placeMakingIndex = Math.min(1, totalScenicScore / 60);
  const lands = (park.zones || []).map(zone => evaluateThemedLandBreakdown(park, zone, ownerPlayer).harmonyTier);
  const landHarmonyAvg = lands.length ? lands.reduce((total, tier) => total + tier, 0) / lands.length : 0;
  let identity = "balanced";
  if (totalTechScore > totalScenicScore * 1.8) identity = "thrill";
  else if (totalScenicScore >= totalTechScore * 0.9 && totalScenicScore >= 15) identity = "resort";
  return {
    totalTechScore,
    totalScenicScore,
    scenicRatio,
    placeMakingIndex,
    landHarmonyAvg,
    identity
  };
}

function updateParkHarmonyMilestones(park, ownerPlayer = null) {
  let reachedMediumHarmony = false;
  for (const zone of park.zones || []) {
    const harmonyTier = evaluateThemedLandBreakdown(park, zone, ownerPlayer).harmonyTier;
    if (harmonyTier >= 2 && !zone.mediumHarmonyAchieved) {
      zone.mediumHarmonyAchieved = true;
      reachedMediumHarmony = true;
    }
  }
  if (reachedMediumHarmony) {
    park.yearsSinceLastAddition = 0;
    park.additionThisYear = true;
  }
}

function recalculateGlobalRecords() {
  const recBonus = getRecordBonusValue();
  const records = {
    tallestSteel: { label: "Tallest Steel Coaster", val: 0, unit: "ft", holders: [] },
    longestSteel: { label: "Longest Steel Coaster", val: 0, unit: "ft", holders: [] },
    tallestWood: { label: "Tallest Wood Coaster", val: 0, unit: "ft", holders: [] },
    longestWood: { label: "Longest Wood Coaster", val: 0, unit: "ft", holders: [] },
    mostInversions: { label: "Most Coaster Inversions", val: 0, unit: "inv", holders: [] },
    tallestDrop: { label: "Tallest Drop Tower", val: 0, unit: "ft", holders: [] },
    tallestWheel: { label: "Tallest Ferris Wheel", val: 0, unit: "ft", holders: [] },
    mostRidesPark: { label: "Most Rides in a Park", val: 0, unit: "rides", holders: [] },
    mostCoastersPark: { label: "Most Coasters in a Park", val: 0, unit: "coasters", holders: [] }
  };
  for (const p of gameState.players) {
    for (const pk of p.parks) {
      pk.recordTags = [];
      for (const r of (pk.rides || [])) r.recordTags = [];
    }
  }
  for (const p of gameState.players) {
    for (const park of p.parks) {
      let rCnt = 0, cCnt = 0;
      const trains = new Set();
      for (const r of (park.rides || [])) {
        if (!isRideOperational(r) || r.category === "facility") continue;
        if (r.isTrainStation) {
          if (!trains.has(r.trainGroupId)) { trains.add(r.trainGroupId); rCnt++; }
        } else rCnt++;
        if (r.category === "coaster") {
          cCnt++;
          if (r.track === "steel") {
            updateMaxRecord(records.tallestSteel, r.height, { type: "ride", ride: r, park, player: p });
            updateMaxRecord(records.longestSteel, r.length, { type: "ride", ride: r, park, player: p });
          } else {
            updateMaxRecord(records.tallestWood, r.height, { type: "ride", ride: r, park, player: p });
            updateMaxRecord(records.longestWood, r.length, { type: "ride", ride: r, park, player: p });
          }
          if (r.inversions > 0) updateMaxRecord(records.mostInversions, r.inversions, { type: "ride", ride: r, park, player: p });
        } else if (r.modelId === "drop_tower") updateMaxRecord(records.tallestDrop, r.height, { type: "ride", ride: r, park, player: p });
        else if (r.modelId === "ferris_wheel") updateMaxRecord(records.tallestWheel, r.height, { type: "ride", ride: r, park, player: p });
      }
      if (rCnt > 0) updateMaxRecord(records.mostRidesPark, rCnt, { type: "park", park, player: p });
      if (cCnt > 0) updateMaxRecord(records.mostCoastersPark, cCnt, { type: "park", park, player: p });
    }
  }
  for (const k in records) {
    const rec = records[k];
    if (rec.val > 0) {
      for (const h of rec.holders) {
        if (h.type === "ride") h.ride.recordTags.push(`${rec.label} (+${recBonus} pt)`);
        else h.park.recordTags.push(`${rec.label} (+${recBonus} pt)`);
      }
    }
  }
  gameState.records = records;
}

function updateMaxRecord(recObj, val, entry) {
  if (val <= 0) return;
  if (val > recObj.val) { recObj.val = val; recObj.holders = [entry]; }
  else if (val === recObj.val) recObj.holders.push(entry);
}

/* --- 7. UI RENDERING & TILE INSPECTOR DRAWER --- */

function switchSidebarTab(tab) {
  ["parks", "rivals", "rd", "records"].forEach(t => {
    document.getElementById(`tbTab${t.charAt(0).toUpperCase() + t.slice(1)}`).classList.toggle("active", t === tab);
  });
  document.getElementById("sidebarParksPane").style.display = tab === "parks" ? "block" : "none";
  document.getElementById("sidebarRivalsPane").style.display = tab === "rivals" ? "block" : "none";
  document.getElementById("sidebarRdPane").style.display = tab === "rd" ? "block" : "none";
  document.getElementById("sidebarRecordsPane").style.display = tab === "records" ? "block" : "none";
}

function toggleParkDrawer(open) {
  document.getElementById("parkZoneDrawer").classList.toggle("open", open);
  if (open) renderParkDrawer();
}

function renderAll() {
  if (!gameState.players.length) return;
  recalculateGlobalRecords();
  const activePlayer = gameState.players[gameState.activePlayerIdx];
  const inspectedPlayer = gameState.players[gameState.inspectedPlayerIdx];
  if (!inspectedPlayer.parks.some(pk => pk.id === gameState.selectedParkId)) {
    gameState.selectedParkId = inspectedPlayer.parks[0].id;
  }
  document.getElementById("hudPlayerName").textContent = `${activePlayer.ceoName} (${activePlayer.chainName})`;
  const hudLegendName = document.getElementById("hudLegendName");
  hudLegendName.innerHTML = `${getLegendPortraitHTML(activePlayer.legend, "legend-avatar-thumb")}<span class="hud-legend-text"><span>${activePlayer.legend.isCustom ? `✨ ${escapeHtml(activePlayer.legend.name)}` : `👑 ${escapeHtml(activePlayer.legend.name)}`}</span><span class="hud-legend-hint">ℹ️ Click for Legend Info</span></span>`;
  hudLegendName.setAttribute("aria-label", `Legend information for ${activePlayer.legend.name}`);
  document.getElementById("hudYear").textContent = `Yr ${gameState.year} • ${getCurrentEraName().split(" ")[0]}`;
  document.getElementById("hudCash").textContent = `$${activePlayer.cash.toFixed(2)}M`;
  document.getElementById("hudAttendance").textContent = activePlayer.totalAttendance.toLocaleString();
  document.getElementById("lblRecPts").textContent = getRecordBonusValue();

  renderLeftSidebar(inspectedPlayer);
  renderHexInspector();
  if (document.getElementById("parkZoneDrawer").classList.contains("open")) renderParkDrawer();
  requestAnimationFrame(drawMapCanvas);
}

function renderLeftSidebar(inspectedPlayer) {
  const isRO = gameState.inspectedPlayerIdx !== gameState.activePlayerIdx;
  document.getElementById("inspectionNoticeBox").innerHTML = isRO
    ? `<div class="Inspection-banner"><span style="font-size:.72rem;">👁️ Viewing <strong>${escapeHtml(inspectedPlayer.chainName)}</strong></span><button class="btn-primary btn-sm" onclick="returnToOwnChain()">My Chain</button></div>`
    : "";

  const parkListEl = document.getElementById("parkListContainer");
  parkListEl.innerHTML = "";
  for (const park of inspectedPlayer.parks) {
    const summary = calculateParkScoreSummary(park, inspectedPlayer);
    const hexObj = gameState.hexByKey.get(park.hexKey);
    const totMult = getTotalHexAttendanceMultiplier(hexObj);
    const card = document.createElement("div");
    card.className = `card ${park.id === gameState.selectedParkId ? 'active-card' : ''}`;
    card.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;"><strong style="cursor:pointer;" onclick="focusParkOnMap('${park.id}')">🎡 ${escapeHtml(park.name)}</strong><span class="badge badge-gold">${summary.finalScore.toFixed(1)}p</span></div><div style="font-size:.7rem;color:var(--text-muted);margin-top:.18rem;">📍 ${hexObj ? escapeHtml(hexObj.regionName) : ''} • <strong style="color:var(--accent-teal);">${totMult}x Market</strong> ${!summary.hasGuestServices ? '<span class="badge badge-red">No Guest Svc (-5%)</span>' : '<span class="badge badge-green">ℹ️ OK</span>'}</div><div style="display:flex;gap:.35rem;margin-top:.4rem;"><button class="btn-primary btn-sm" style="flex:1;" onclick="enterParkCampusView('${park.id}')">🔍 Open 49-Hex Campus</button></div>`;
    parkListEl.appendChild(card);
  }

  const lbEl = document.getElementById("leaderboardContainer");
  lbEl.innerHTML = "";
  const sorted = [...gameState.players].map((p, idx) => ({ p, idx })).sort((a, b) => b.p.totalAttendance - a.p.totalAttendance);
  for (const { p, idx } of sorted) {
    const pct = Math.min(100, (p.totalAttendance / gameState.winAttendance) * 100);
    const card = document.createElement("div");
    card.className = `card ${idx === gameState.inspectedPlayerIdx ? 'active-card' : ''}`;
    card.style.cursor = "pointer";
    card.onclick = () => {
      gameState.inspectedPlayerIdx = idx;
      gameState.selectedParkId = p.parks[0].id;
      gameState.selectedHexKey = p.parks[0].hexKey;
      switchSidebarTab("parks");
      renderAll();
    };
    card.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;"><div style="display:flex;align-items:center;gap:.38rem;"><span style="width:10px;height:10px;border-radius:50%;background:${p.color};display:inline-block;"></span><strong>${escapeHtml(p.chainName)}</strong></div><span style="font-size:.75rem;color:var(--accent-green);font-weight:700;">$${p.cash.toFixed(2)}M</span></div><div style="display:flex;justify-content:space-between;align-items:center;gap:.4rem;margin-top:.1rem;"><span style="font-size:.68rem;color:var(--accent-gold);">CEO: ${escapeHtml(p.ceoName)} (${p.parks.length} Parks)</span><button class="btn-outline btn-sm" onclick="event.stopPropagation();openLegendInfoModal(${idx})" aria-label="View ${escapeHtml(p.legend.name)} legend info">👑 Legend Info</button></div><div style="font-size:.72rem;color:var(--accent-teal);margin-top:.18rem;">Att: <strong>${p.totalAttendance.toLocaleString()}</strong> (${pct.toFixed(1)}%)</div>`;
    lbEl.appendChild(card);
  }

  const rdEl = document.getElementById("researchListContainer");
  rdEl.innerHTML = "";
  const activePlayer = gameState.players[gameState.activePlayerIdx];
  const resMult = getPlayerResearchFeeMultiplier(activePlayer);
  const allM = [
    ...FLAT_RIDE_CATALOG.filter(m => m.researchCost > 0).map(m => ({ ...m, cat: "Flat" })),
    ...TRACKED_RIDE_CATALOG.filter(m => m.researchCost > 0).map(m => ({ ...m, cat: "Tracked" })),
    ...COASTER_CATALOG.filter(m => m.researchCost > 0).map(m => ({ ...m, cat: "Coaster" }))
  ];
  for (const m of allM) {
    const isUnl = gameState.unlockedRides.has(m.id);
    const eraOk = isModelEraAvailable(m.era);
    const c = +(m.researchCost * resMult).toFixed(2);
    const card = document.createElement("div");
    card.className = "card";
    const act = isUnl
      ? '<span class="badge badge-green">Unlocked</span>'
      : (!eraOk ? `<span class="badge badge-purple">Yr ${ERA_UNLOCK_YEARS[m.era]}</span>` : `<button class="btn-gold btn-sm" ${activePlayer.cash < c ? 'disabled' : ''} onclick="researchRideDirectly('${m.id}', ${c}, '${escapeHtml(m.name)}')">R&D $${c}M</button>`);
    card.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;"><div><strong>${escapeHtml(m.name)}</strong><div style="font-size:.66rem;color:var(--text-muted);">${m.cat} • ${m.era.toUpperCase()}</div></div>${act}</div>`;
    rdEl.appendChild(card);
  }

  document.getElementById("sidebarRecordsTableContainer").innerHTML = buildGlobalRecordsTableHTML();
  document.getElementById("gameLogContainer").innerHTML = gameState.logs.map(l => `<div style="padding:.22rem 0;border-bottom:1px solid rgba(255,255,255,.05);">${escapeHtml(l)}</div>`).join("");
}

function focusParkOnMap(parkId, openDrawer = false) {
  const p = gameState.players[gameState.inspectedPlayerIdx];
  const park = p.parks.find(pk => pk.id === parkId);
  if (!park) return;
  gameState.selectedParkId = park.id;
  gameState.selectedHexKey = park.hexKey;
  if (openDrawer) enterParkCampusView(park.id);
  else renderAll();
}

function renderHexInspector() {
  const el = document.getElementById("hexInspectorContent");
  const hex = gameState.hexByKey.get(gameState.selectedHexKey);
  if (!hex) { el.innerHTML = "Click any hex on the US map to inspect its attendance modifier and land prices."; return; }
  const trait = HEX_TRAITS[hex.traitId];
  const cluster = getHexClusterBonusInfo(hex);
  const totalMult = getTotalHexAttendanceMultiplier(hex);
  const activePlayer = gameState.players[gameState.activePlayerIdx];

  if (hex.parkId) {
    const owner = gameState.players.find(p => p.id === hex.ownerId);
    const park = owner.parks.find(pk => pk.id === hex.parkId);
    const summary = calculateParkScoreSummary(park, owner);
    el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;"><strong style="color:var(--accent-gold);font-size:.92rem;">🎡 ${escapeHtml(park.name)}</strong><span class="badge badge-teal">${totalMult}x Att. Mod</span></div><div style="font-size:.72rem;color:var(--text-muted);margin-top:.12rem;">Owner: <strong>${escapeHtml(owner.chainName)}</strong> • ${escapeHtml(hex.regionName)} (${trait.name} ${trait.attMult}x + Cluster +${cluster.bonus}x)</div><div style="margin-top:.4rem;display:flex;justify-content:space-between;align-items:center;"><span>Score: <strong>${summary.finalScore.toFixed(1)} pts</strong></span><div style="display:flex;gap:.3rem;"><button class="btn-primary btn-sm" onclick="enterParkCampusView('${park.id}')">🔍 Open 49-Hex Campus</button></div></div>`;
  } else {
    const check = canPlayerBuildParkOnHex(activePlayer, hex);
    const prices = getHexParkPricesForPlayer(activePlayer, hex);
    el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;"><strong>📍 ${escapeHtml(hex.regionName)} (${hex.col}, ${hex.row})</strong><span class="badge badge-gold">${trait.name} (${trait.attMult}x)</span></div><div style="font-size:.73rem;color:var(--accent-teal);margin-top:.18rem;"><strong>Total Market Multiplier: ${totalMult}x</strong> (Base ${trait.attMult}x + ${cluster.count} Nearby Parks = +${cluster.bonus}x)</div><div style="font-size:.7rem;color:var(--text-muted);margin-top:.18rem;">Prices: Small <strong>$${prices.smallCost}M</strong> • Med <strong>$${prices.mediumCost}M</strong> • Large <strong>$${prices.largeCost}M</strong></div><div style="margin-top:.4rem;">${check.allowed ? `<button class="btn-gold btn-sm" style="width:100%;" onclick="openBuyParkOnHexModal('${hex.key}')">🏗️ Acquire Theme Park on This Hex</button>` : `<div style="color:var(--accent-red);font-size:.7rem;font-weight:600;">🚫 ${escapeHtml(check.reason)}</div>`}</div>`;
  }
}

function renderParkDrawer() {
  const inspectedPlayer = gameState.players[gameState.inspectedPlayerIdx];
  const isRO = gameState.inspectedPlayerIdx !== gameState.activePlayerIdx;
  const park = inspectedPlayer.parks.find(pk => pk.id === gameState.selectedParkId) || inspectedPlayer.parks[0];
  const hexObj = gameState.hexByKey.get(park.hexKey);
  const totMult = getTotalHexAttendanceMultiplier(hexObj);
  const summary = calculateParkScoreSummary(park, inspectedPlayer);
  const prestige = calculateParkPrestigeMetrics(park, inspectedPlayer);
  const woodCounts = countParkWoodCoasters(park);

  document.getElementById("drawerParkTitle").textContent = `🎡 ${park.name}`;
  document.getElementById("drawerParkSub").textContent = `${hexObj ? hexObj.regionName : ''} • ${totMult}x Market • Score: ${summary.finalScore.toFixed(1)} pts • Place-making: ${(prestige.placeMakingIndex * 100).toFixed(0)}%`;
  const identityBadges = {
    thrill: { label: "🎢 Iron-Ride Thrill Park", style: "badge-red" },
    resort: { label: "🏰 Immersive Resort Destination", style: "badge-blue" },
    balanced: { label: "🎡 Balanced Regional Park", style: "badge-gold" }
  };
  const identityBadge = identityBadges[prestige.identity];
  const identityElement = document.getElementById("drawerParkIdentity");
  identityElement.textContent = identityBadge.label;
  identityElement.className = `badge ${identityBadge.style}`;

  let html = `<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.35rem;"><div><div style="font-size:.72rem;color:var(--text-muted);">Wood Coasters: <strong>${woodCounts.totalWood}/4</strong> (Classic: ${woodCounts.classicWood}/2) • Woods Cleared: <strong>${park.expansionsBought}/${park.maxExpansions}</strong></div><div style="margin-top:.28rem;display:flex;gap:.28rem;flex-wrap:wrap;">${summary.hasGuestServices ? '<span class="badge badge-green">ℹ️ Guest Services OK</span>' : '<span class="badge badge-red">⚠️ No Guest Services (-5%)</span>'}${summary.hasBalancedBonus ? '<span class="badge badge-green">🌟 Balanced (+10%)</span>' : ''}${(park.recordTags || []).map(t => `<span class="badge badge-gold">🏆 ${escapeHtml(t)}</span>`).join("")}</div></div>${!isRO ? `<button class="icon-btn" onclick="openRenameModal('park', '${park.id}')">✏️ Rename Park</button>` : ''}</div></div>`;

  // 1. SELECTED HEX TILE & RIDE INSPECTOR CARD
  const selTile = park.tiles.find(t => t.key === gameState.selectedCampusTileKey) || park.tiles[0];
  if (selTile) {
    const tileZone = getZoneForTile(park, selTile);
    const ride = selTile.rideId ? park.rides.find(r => r.id === selTile.rideId) : null;
    const effTileLv = getEffectiveTileThemeLevel(selTile);
    const nextTileTier = TILE_SCENERY_TIERS[effTileLv + 1];
    const plotInitMult = getPlayerPlotSceneryMultiplier(inspectedPlayer, false);
    const plotUpgMult = getPlayerPlotSceneryMultiplier(inspectedPlayer, true);
    const nextTileCost = nextTileTier ? +((effTileLv === 0 ? nextTileTier.cost * plotInitMult : nextTileTier.upgradeCost * plotUpgMult)).toFixed(2) : 0;

    html += `<div class="card" style="border-color:var(--accent-gold);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.35rem;">
        <strong style="color:var(--accent-gold);">📍 Selected Hex Tile (${selTile.q}, ${selTile.r})</strong>
        <span class="badge" style="background:${tileZone ? tileZone.color : '#334155'};color:#000;">${selTile.isEntrance ? 'Main Entrance' : (selTile.state === 'woods' ? '🌲 Undeveloped Woods' : (tileZone ? escapeHtml(tileZone.name) : 'Generic (Unzoned)'))}</span>
      </div>`;

    if (selTile.isEntrance) {
      html += `<div style="font-size:.76rem;color:var(--text-muted);">Park Main Entrance turnstiles. Guests enter the campus from this tile.</div>`;
    } else if (selTile.state === "woods") {
      const canClear = !isRO && park.expansionsBought < park.maxExpansions && inspectedPlayer.cash >= park.expansionCost;
      html += `<div style="font-size:.75rem;color:var(--text-muted);margin-bottom:.45rem;">Undeveloped forest tile. Clear this hex to place rides or expand a Themed Land!</div>
      ${!isRO ? `<button class="btn-primary btn-sm" style="width:100%;" ${canClear ? '' : 'disabled'} onclick="clearWoodsHex('${park.id}','${selTile.key}')">🪓 Clear Woods Tile ($${park.expansionCost.toFixed(2)}M)</button>` : ''}`;
    } else {
      // Cleared Buildable Tile Inspector
      const themeMismatch = selTile.themeLevel > 0 && effTileLv === 0;
      html += `<div style="display:flex;justify-content:space-between;align-items:center;font-size:.75rem;margin-bottom:.45rem;">
        <span>Ground Scenery: <strong>${TILE_SCENERY_TIERS[effTileLv].name}</strong> (+${(TILE_SCENERY_TIERS[effTileLv].points * (tileZone ? 1.25 : 1.0)).toFixed(2)}p) ${themeMismatch ? '<span class="badge badge-red">Rezoned (Reset to 0)</span>' : ''}</span>
        ${(!isRO && nextTileTier) ? `<button class="btn-outline btn-sm" onclick="upgradeCampusTileScenery('${park.id}','${selTile.key}')">🎨 +Tile Theme ($${nextTileCost}M)</button>` : ''}
      </div>`;

      if (ride) {
        const rideScore = calculateRideTotalScore(ride, inspectedPlayer);
        const effRideLv = getEffectiveRideThemeLevel(ride);
        const nextRideTier = RIDE_SCENERY_TIERS[effRideLv + 1];
        const catScale = getCategorySceneryScale(ride.category);
        const rideInitMult = getPlayerRideSceneryMultiplier(inspectedPlayer, false);
        const rideUpgMult = getPlayerRideSceneryMultiplier(inspectedPlayer, true);
        const nextRideCost = nextRideTier ? +((effRideLv === 0 ? nextRideTier.cost * rideInitMult : nextRideTier.upgradeCost * rideUpgMult) * catScale).toFixed(2) : 0;
        const maintMult = getPlayerMaintAndRepairMultiplier(inspectedPlayer);
        const foodVenueLedger = ride.facilityRole === "restaurant"
          ? (ride.lastFbStats || { mealsSold: 0, grossRev: 0, cogs: 0, fixedOpEx: 0, netProfit: 0 })
          : null;

        html += `<div style="background:var(--bg-panel);border:1px solid var(--border-color);border-radius:8px;padding:.6rem;margin-top:.3rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong style="font-size:.88rem;color:var(--text-main);">${escapeHtml(ride.name)}</strong>
            <span class="badge badge-gold">${rideScore.toFixed(1)} pts</span>
          </div>
          <div style="font-size:.7rem;color:var(--text-muted);margin:.15rem 0;">
            ${escapeHtml(ride.modelName)} • ${ride.category === 'facility' ? 'Facility' : `Age ${ride.age}/${ride.lifespan}y`}
            ${ride.smoothnessTier ? ` • <strong>${ride.smoothnessTier}</strong>` : ''}
          </div>
          <div style="font-size:.72rem;color:var(--accent-teal);margin-bottom:.4rem;">
            Ride Theme: <strong>${RIDE_SCENERY_TIERS[effRideLv].name}</strong> (+${calculateRideSceneryPoints(ride).toFixed(1)}p)
          </div>
          ${ride.facilityRole === "restaurant" ? `<div class="card" style="margin:.4rem 0;background:rgba(245,158,11,.08);">
            <label for="mealPrice-${ride.id}" style="display:flex;justify-content:space-between;align-items:center;font-size:.76rem;color:var(--text-main);">
              <strong>🍔 Meal Price:</strong>
              <strong id="mealPriceValue-${ride.id}" style="color:var(--accent-gold);">$${getRestaurantMealPrice(ride)}</strong>
            </label>
            <input id="mealPrice-${ride.id}" type="range" min="${FOOD_AND_BEVERAGE_RULES.minMealPrice}" max="${FOOD_AND_BEVERAGE_RULES.maxMealPrice}" step="1" value="${getRestaurantMealPrice(ride)}" style="width:100%;margin:.35rem 0;" ${isRO ? "disabled" : `oninput="document.getElementById('mealPriceValue-${ride.id}').textContent='$'+this.value;document.getElementById('mealPriceAllValue-${ride.id}').textContent=this.value" onchange="setRestaurantMealPrice('${park.id}','${ride.id}',this.value)"`}>
            <div style="display:flex;justify-content:space-between;font-size:.65rem;color:var(--text-muted);"><span>$${FOOD_AND_BEVERAGE_RULES.minMealPrice}</span><span>$${FOOD_AND_BEVERAGE_RULES.maxMealPrice}</span></div>
            ${!isRO ? `<button class="btn-outline btn-sm" style="width:100%;" onclick="applyRestaurantMealPriceToPark('${park.id}',document.getElementById('mealPrice-${ride.id}').value)">Apply $<span id="mealPriceAllValue-${ride.id}">${getRestaurantMealPrice(ride)}</span> to All Restaurants in Park</button>` : ""}
            <div style="font-size:.68rem;color:var(--text-muted);margin-top:.25rem;">Capacity: 450,000 meals/year per venue. Pricing, land theming, and park atmosphere affect demand.</div>
            <div style="font-size:.7rem;margin-top:.35rem;line-height:1.55;">
              <strong>Last Season F&amp;B Ledger</strong><br>
              Meals Sold: ${foodVenueLedger.mealsSold.toLocaleString()}<br>
              Gross F&amp;B Sales: <span style="color:var(--accent-green);">+$${foodVenueLedger.grossRev.toFixed(2)}M</span><br>
              COGS &amp; Kitchen OpEx: <span style="color:var(--accent-red);">-$${foodVenueLedger.cogs.toFixed(2)}M</span><br>
              Net F&amp;B Profit: <span style="color:${foodVenueLedger.netProfit >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'};">${foodVenueLedger.netProfit >= 0 ? '+' : '-'}$${Math.abs(foodVenueLedger.netProfit).toFixed(2)}M</span>
            </div>
          </div>` : ""}
          ${!isRO ? `<div style="display:flex;gap:.3rem;flex-wrap:wrap;">
            ${nextRideTier ? `<button class="btn-primary btn-sm" onclick="upgradeRideScenery('${park.id}','generic','${ride.id}')">🎨 +Ride Theme ($${nextRideCost}M)</button>` : ''}
            ${ride.status === "needs_maintenance" ? `<button class="btn-gold btn-sm" onclick="payRideMaintenance('${park.id}','generic','${ride.id}')">🔧 Maint ($${(ride.totalInvestment * 0.2 * maintMult).toFixed(2)}M)</button>` : ''}
            ${ride.status === "needs_repair" ? `<button class="btn-gold btn-sm" onclick="payRideRepair('${park.id}','generic','${ride.id}')">🛠️ Repair ($${(ride.totalInvestment * 0.4 * maintMult).toFixed(2)}M)</button>` : ''}
            ${ride.status === "needs_inspection" ? `<button class="btn-gold btn-sm" onclick="payRideInspection('${park.id}','generic','${ride.id}')">🕵️ Inspect ($0.50M)</button>` : ''}
            <button class="icon-btn" onclick="openRenameModal('ride','${park.id}','generic','${ride.id}')">✏️ Rename</button>
            <button class="btn-danger btn-sm" style="margin-left:auto;" onclick="demolishSingleRide('${park.id}','generic','${ride.id}')">🗑️ Demolish</button>
          </div>` : ''}
        </div>`;
      } else if (!isRO) {
        html += `<button class="btn-gold btn-sm" style="width:100%;margin-top:.2rem;" onclick="openBuildModal('${selTile.key}')">➕ Construct Ride or Facility on This Hex</button>`;
      }
    }
    html += `</div>`;
  }

  // 2. THEMED LAND ZONING STUDIO (4 TO 12 HEXES)
  if (!isRO) {
    if (!gameState.zoneEditor.active) {
      html += `<div style="display:flex;justify-content:space-between;align-items:center;margin:.55rem 0 .35rem;">
        <span style="font-size:.72rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;">Themed Lands (1.25x Zone Scenery)</span>
        <button class="btn-primary btn-sm" onclick="startZoneEditor(null)">🖌️ + Create / Rezone Land</button>
      </div>`;
      if (park.tier === "starting") {
        html += `<div style="font-size:.7rem;color:var(--text-muted);margin-bottom:.4rem;">Your starting park begins as one themed land. Create and shape additional lands here.</div>`;
      }
    } else {
      const zEd = gameState.zoneEditor;
      const usedColors = new Set(park.zones.filter(z => z.id !== zEd.editingZoneId).map(z => z.color));
      const count = zEd.selectedKeys.size;
      const validCount = count >= 4 && count <= 12;

      html += `<div class="card" style="border-color:var(--accent-teal);background:rgba(6,182,212,.1);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.35rem;">
          <strong style="color:var(--accent-teal);">🖌️ Land Zoning Brush (${count}/12 Hexes — Min 4)</strong>
          <button class="icon-btn" onclick="cancelZoneEditor()">Cancel ✕</button>
        </div>
        <div style="font-size:.7rem;color:var(--text-muted);margin-bottom:.4rem;">Click cleared hexes on the map to add/remove them. (2-hex Coasters move together; rezoning resets mismatched themes to 0!)</div>
        <div class="form-group" style="margin-bottom:.4rem;">
          <input type="text" id="zoneEditorNameInput" value="${escapeHtml(zEd.name)}" placeholder="Land Name..." oninput="gameState.zoneEditor.name=this.value">
        </div>
        <div style="display:flex;gap:.35rem;margin-bottom:.5rem;flex-wrap:wrap;">
          ${LAND_COLOR_PALETTE.map(c => {
            const taken = usedColors.has(c.hex);
            const sel = zEd.color === c.hex;
            return `<div onclick="${taken ? '' : `selectZoneEditorColor('${c.hex}')`}" style="width:22px;height:22px;border-radius:4px;background:${c.hex};cursor:${taken ? 'not-allowed' : 'pointer'};opacity:${taken ? 0.25 : 1};border:${sel ? '2px solid #fff' : '1px solid #000'};"></div>`;
          }).join("")}
        </div>
        <button class="btn-gold btn-sm" style="width:100%;" ${validCount ? '' : 'disabled'} onclick="saveZoneEditor('${park.id}')">✔ Save Themed Land (${count} Hexes)</button>
      </div>`;
    }
  }

  // 3. LIST OF DESIGNATED THEMED LANDS IN PARK
  for (const zone of park.zones) {
    const ev = evaluateThemedLandBreakdown(park, zone, inspectedPlayer);
    html += `<div class="card" style="border-left:4px solid ${zone.color};">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <strong>${escapeHtml(zone.name)}</strong>
          <span class="badge" style="background:${zone.color};color:#000;margin-left:4px;">${ev.tileCount} Hexes</span>
        </div>
        <div style="display:flex;gap:.25rem;align-items:center;">
          <span class="badge badge-gold">${ev.finalLandScore.toFixed(1)}p</span>
          ${!isRO ? `<button class="icon-btn" onclick="startZoneEditor('${zone.id}')">🖌️ Edit</button>` : ''}
        </div>
      </div>
      <div style="font-size:.69rem;color:var(--text-muted);margin-top:.2rem;">
        Scenic: <strong>${ev.totalPlotScenic.toFixed(1)}p</strong> • ${LAND_HARMONY_TIERS[ev.harmonyTier].label}
      </div>
      <div style="display:flex;gap:.3rem;margin-top:.3rem;flex-wrap:wrap;">
        <span class="badge ${ev.hasToilets ? 'badge-green' : 'badge-red'}">🚻 RR Coverage ${ev.toiletsCoveredTiles}/${ev.tileCount}</span>
        <span class="badge ${ev.hasRestaurant ? 'badge-green' : 'badge-red'}">🍔 FB Coverage ${ev.restaurantCoveredTiles}/${ev.tileCount}</span>
      </div>
    </div>`;
  }

  document.getElementById("drawerParkBody").innerHTML = html;
}

function startZoneEditor(zoneId = null) {
  const p = gameState.players[gameState.activePlayerIdx];
  const park = p.parks.find(pk => pk.id === gameState.selectedParkId);
  const usedColors = new Set(park.zones.filter(z => z.id !== zoneId).map(z => z.color));
  const freeColorObj = LAND_COLOR_PALETTE.find(c => !usedColors.has(c.hex)) || LAND_COLOR_PALETTE[0];

  if (zoneId) {
    const z = park.zones.find(zn => zn.id === zoneId);
    const keys = new Set(park.tiles.filter(t => t.zoneId === zoneId).map(t => t.key));
    gameState.zoneEditor = { active: true, name: z.name, color: z.color, selectedKeys: keys, editingZoneId: z.id };
  } else {
    gameState.zoneEditor = { active: true, name: generateRandomZoneName(), color: freeColorObj.hex, selectedKeys: new Set(), editingZoneId: null };
  }
  renderParkDrawer();
  requestAnimationFrame(drawMapCanvas);
}

function selectZoneEditorColor(hexColor) {
  gameState.zoneEditor.color = hexColor;
  renderParkDrawer();
  requestAnimationFrame(drawMapCanvas);
}

function cancelZoneEditor() {
  gameState.zoneEditor.active = false;
  renderParkDrawer();
  requestAnimationFrame(drawMapCanvas);
}

function toggleTileInZoneBrush(park, tile) {
  const keys = gameState.zoneEditor.selectedKeys;
  const ride = tile.rideId ? park.rides.find(r => r.id === tile.rideId) : null;
  const pairedKeys = [tile.key];
  if (ride && ride.spaces === 2) {
    if (ride.primaryTileKey && ride.primaryTileKey !== tile.key) pairedKeys.push(ride.primaryTileKey);
    if (ride.secondaryTileKey && ride.secondaryTileKey !== tile.key) pairedKeys.push(ride.secondaryTileKey);
  }

  const isAdding = !keys.has(tile.key);
  if (isAdding) {
    if (keys.size + pairedKeys.length > 12) { alert("A Themed Land can have a maximum of 12 hexes!"); return; }
    pairedKeys.forEach(k => keys.add(k));
  } else {
    pairedKeys.forEach(k => keys.delete(k));
  }
}

function saveZoneEditor(parkId) {
  const p = gameState.players[gameState.activePlayerIdx];
  const park = p.parks.find(pk => pk.id === parkId);
  const zEd = gameState.zoneEditor;
  if (zEd.selectedKeys.size < 4 || zEd.selectedKeys.size > 12) return;

  let targetZoneId = zEd.editingZoneId;
  if (targetZoneId) {
    const z = park.zones.find(zn => zn.id === targetZoneId);
    z.name = (zEd.name || "").trim() || z.name;
    z.color = zEd.color;
    // Remove tiles that were unchecked from this zone
    for (const t of park.tiles) {
      if (t.zoneId === targetZoneId && !zEd.selectedKeys.has(t.key)) t.zoneId = null;
    }
  } else {
    targetZoneId = nextUid("zone");
    park.zones.push({ id: targetZoneId, name: (zEd.name || "").trim() || generateRandomZoneName(), color: zEd.color });
  }

  for (const t of park.tiles) {
    if (zEd.selectedKeys.has(t.key)) t.zoneId = targetZoneId;
  }

  // Update ride zone assignments (note: themedForZoneId stays locked to the OLD zone, forcing re-theming if rezoned!)
  const tileByKey = new Map(park.tiles.map(t => [t.key, t]));
  for (const r of park.rides) {
    const t1 = tileByKey.get(r.primaryTileKey);
    if (t1) r.zoneId = t1.zoneId;
  }

  // Clean up any zones that dropped below 1 tile
  park.zones = park.zones.filter(z => park.tiles.some(t => t.zoneId === z.id));
  gameState.zoneEditor.active = false;
  updateParkHarmonyMilestones(park, p);
  syncParkPlotsMirror(park);
  renderAll();
}

function clearWoodsHex(parkId, tileKey) {
  const player = gameState.players[gameState.activePlayerIdx];
  const park = player.parks.find(pk => pk.id === parkId);
  const tile = park.tiles.find(t => t.key === tileKey);
  if (!tile || tile.state !== "woods" || park.expansionsBought >= park.maxExpansions || player.cash < park.expansionCost) return;
  player.cash -= park.expansionCost;
  park.expansionsBought++;
  tile.state = "cleared";
  renderAll();
}

function upgradeCampusTileScenery(parkId, tileKey) {
  const player = gameState.players[gameState.activePlayerIdx];
  const park = player.parks.find(pk => pk.id === parkId);
  const tile = park.tiles.find(t => t.key === tileKey);
  if (!tile || tile.state !== "cleared") return;

  const currentZoneKey = tile.zoneId || "generic";
  const effLv = getEffectiveTileThemeLevel(tile);
  const nextLv = effLv + 1;
  if (nextLv >= TILE_SCENERY_TIERS.length) return;

  const tierObj = TILE_SCENERY_TIERS[nextLv];
  const cost = +((effLv === 0 ? tierObj.cost * getPlayerPlotSceneryMultiplier(player, false) : tierObj.upgradeCost * getPlayerPlotSceneryMultiplier(player, true))).toFixed(2);
  if (player.cash < cost) { alert(`Insufficient funds! Need $${cost}M.`); return; }

  player.cash -= cost;
  tile.themeLevel = nextLv;
  tile.themedForZoneId = currentZoneKey;
  updateParkHarmonyMilestones(park, player);
  renderAll();
}

function returnToOwnChain() {
  gameState.inspectedPlayerIdx = gameState.activePlayerIdx;
  const p = gameState.players[gameState.activePlayerIdx];
  gameState.selectedParkId = p.parks[0].id;
  gameState.selectedHexKey = p.parks[0].hexKey;
  renderAll();
}

/* --- 8. CONSTRUCTION ON HEX TILES (1-HEX & 2-HEX DIAGONAL) --- */

function openBuyParkOnHexModal(hexKey) {
  const hex = gameState.hexByKey.get(hexKey);
  const player = gameState.players[gameState.activePlayerIdx];
  const check = canPlayerBuildParkOnHex(player, hex);
  if (!check.allowed) { alert(check.reason); return; }
  const trait = HEX_TRAITS[hex.traitId];
  const totMult = getTotalHexAttendanceMultiplier(hex);
  const prices = getHexParkPricesForPlayer(player, hex);
  document.getElementById("buyParkModalHeader").textContent = `🗺️ Acquire Park in ${hex.regionName} (${trait.name} • ${totMult}x Att)`;
  document.getElementById("buyParkModalBody").innerHTML = `<div class="form-group"><label>New Park Name</label><div style="display:flex;gap:.5rem;"><input type="text" id="newParkNameInput" value="${generateRandomParkName()}"><button class="btn-outline btn-sm" onclick="document.getElementById('newParkNameInput').value=generateRandomParkName()">🎲</button></div></div><div class="card"><div style="display:flex;justify-content:space-between;align-items:center;"><div><strong>Small Park (11 Cleared Hexes)</strong><div style="font-size:.72rem;color:var(--text-muted);">+14 Woods Hexes ($${prices.smallExp}M/hex)</div></div><button class="btn-primary" ${player.cash < prices.smallCost ? 'disabled' : ''} onclick="purchaseNewParkOnHex('${hex.key}','small',${prices.smallCost},${prices.smallExp})">Buy $${prices.smallCost}M</button></div></div><div class="card"><div style="display:flex;justify-content:space-between;align-items:center;"><div><strong>Medium Park (19 Cleared Hexes)</strong><div style="font-size:.72rem;color:var(--text-muted);">+18 Woods Hexes ($${prices.mediumExp}M/hex)</div></div><button class="btn-primary" ${player.cash < prices.mediumCost ? 'disabled' : ''} onclick="purchaseNewParkOnHex('${hex.key}','medium',${prices.mediumCost},${prices.mediumExp})">Buy $${prices.mediumCost}M</button></div></div><div class="card"><div style="display:flex;justify-content:space-between;align-items:center;"><div><strong>Large Park (29 Cleared Hexes)</strong><div style="font-size:.72rem;color:var(--text-muted);">+20 Woods Hexes ($${prices.largeExp}M/hex)</div></div><button class="btn-primary" ${player.cash < prices.largeCost ? 'disabled' : ''} onclick="purchaseNewParkOnHex('${hex.key}','large',${prices.largeCost},${prices.largeExp})">Buy $${prices.largeCost}M</button></div></div>`;
  document.getElementById("buyParkModal").classList.add("active");
}

function purchaseNewParkOnHex(hexKey, tier, finalCost, expCost) {
  const player = gameState.players[gameState.activePlayerIdx];
  const hex = gameState.hexByKey.get(hexKey);
  if (!hex || hex.parkId || player.cash < finalCost) return;
  const pName = document.getElementById("newParkNameInput").value.trim() || generateRandomParkName();
  player.cash -= finalCost;

  const { tiles, maxExpansions } = generate49HexCampusDiamond(tier, 0);
  const newParkId = nextUid("park");
  hex.parkId = newParkId;
  hex.ownerId = player.id;

  const newPark = {
    id: newParkId, name: pName, hexKey: hex.key, tier, maxExpansions, expansionsBought: 0, expansionCost: expCost,
    eisnerDiscountRidesLeft: player.legend.id === "michael_eisner" ? 2 : 0, lastAttendance: 0, lastRollLabel: "—",
    yearsSinceLastAddition: 0, additionThisYear: true, newCoasterBuiltThisYear: false,
    lastFoodAndBeverageLedger: null,
    tiles, zones: [], rides: [], plots: []
  };
  syncParkPlotsMirror(newPark);
  player.parks.push(newPark);
  gameState.selectedParkId = newPark.id;
  addLog(`${player.ceoName} acquired "${pName}" in ${hex.regionName} ($${finalCost}M)!`);
  closeModal("buyParkModal");
  enterParkCampusView(newPark.id);
}

function getValidDiagonalSecondTiles(park, primaryTile) {
  if (!primaryTile || primaryTile.state !== "cleared" || primaryTile.isEntrance || primaryTile.rideId) return [];
  return park.tiles.filter(t =>
    t.state === "cleared" &&
    !t.isEntrance &&
    !t.rideId &&
    t.zoneId === primaryTile.zoneId &&
    areCampusTilesDiagonalNeighbors(primaryTile, t)
  );
}

function getUsedPlotSpaces(plot) { return 0; }
function countParkModelOccurrences(park, modelId) {
  return (park.rides || []).filter(r => r.modelId === modelId).length;
}
function countParkWoodCoasters(park) {
  let totalWood = 0, classicWood = 0;
  for (const r of (park.rides || [])) {
    if (r.category === "coaster" && r.track === "wood") {
      totalWood++;
      if (r.modelId === "classic_wood") classicWood++;
    }
  }
  return { totalWood, classicWood };
}

function canBuildRideModelInPark(park, model, cat) {
  if (cat === "facility") return { allowed: true, reason: "Unlimited allowed" };
  if (!isModelEraAvailable(model.era)) return { allowed: false, reason: `Unlocks Yr ${ERA_UNLOCK_YEARS[model.era]}` };
  if (cat === "flat") return countParkModelOccurrences(park, model.id) >= 1 ? { allowed: false, reason: "Max 1/park" } : { allowed: true, reason: "" };
  if (cat === "tracked") {
    const cap = model.maxPerPark || 1;
    return countParkModelOccurrences(park, model.id) >= cap ? { allowed: false, reason: `Max ${cap}/park` } : { allowed: true, reason: "" };
  }
  const wc = countParkWoodCoasters(park);
  if (model.track === "wood") {
    if (wc.totalWood >= 4) return { allowed: false, reason: "Max 4 Wood/park" };
    if (model.id === "classic_wood" && wc.classicWood >= 2) return { allowed: false, reason: "Max 2 Classic Wood" };
    if (model.id !== "classic_wood" && countParkModelOccurrences(park, model.id) >= 1) return { allowed: false, reason: "Max 1/park" };
    return { allowed: true, reason: "" };
  }
  return countParkModelOccurrences(park, model.id) >= 1 ? { allowed: false, reason: "Max 1/park" } : { allowed: true, reason: "" };
}

function openBuildModal(tileKey) {
  gameState.buildContext.plotId = tileKey; // Stores selected primaryTileKey
  gameState.buildContext.selectedModelId = null;
  document.getElementById("buildCustomizerSection").style.display = "none";
  document.getElementById("btnConfirmBuildRide").disabled = true;
  switchBuildCategory("flat");
  document.getElementById("buildRideModal").classList.add("active");
}

function populateInitialSceneryDropdown(cat) {
  const sel = document.getElementById("customRideTheme");
  const scale = getCategorySceneryScale(cat);
  const legMult = getPlayerRideSceneryMultiplier(gameState.players[gameState.activePlayerIdx], false);
  sel.innerHTML = RIDE_SCENERY_TIERS.map(t => `<option value="${t.level}">${t.name} ($${+(t.cost * scale * legMult).toFixed(2)}M • +${t.points} base pts)</option>`).join("");
}

function switchBuildCategory(cat) {
  gameState.buildContext.category = cat;
  gameState.buildContext.selectedModelId = null;
  ["flat", "tracked", "coaster", "facility"].forEach(c => {
    document.getElementById(`buildTab${c.charAt(0).toUpperCase() + c.slice(1)}`).classList.toggle("active", c === cat);
  });
  document.getElementById("buildCustomizerSection").style.display = "none";
  document.getElementById("btnConfirmBuildRide").disabled = true;
  const player = gameState.players[gameState.activePlayerIdx];
  const park = player.parks.find(pk => pk.id === gameState.selectedParkId);
  const primaryTile = park.tiles.find(t => t.key === gameState.buildContext.plotId);
  const diagNeighbors = getValidDiagonalSecondTiles(park, primaryTile);
  const catalogEl = document.getElementById("buildCatalogSection");
  catalogEl.innerHTML = "";

  if ((cat === "tracked" || cat === "coaster") && diagNeighbors.length === 0) {
    catalogEl.innerHTML = `<div class="card" style="color:var(--accent-red);">2-Hex Coasters & Tracked Rides require an open <strong>diagonal neighbor hex</strong> in the <strong>same Themed Land</strong> (or both Generic)!</div>`;
    return;
  }
  const list = cat === "flat" ? FLAT_RIDE_CATALOG : (cat === "tracked" ? TRACKED_RIDE_CATALOG : (cat === "coaster" ? COASTER_CATALOG : FACILITY_CATALOG));
  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(220px, 1fr))";
  grid.style.gap = "0.5rem";

  for (const m of list) {
    const isUnl = gameState.unlockedRides.has(m.id);
    const check = canBuildRideModelInPark(park, m, cat);
    const card = document.createElement("div");
    card.className = "card";
    card.style.marginBottom = "0";
    card.innerHTML = `<div style="display:flex;justify-content:space-between;"><strong>${escapeHtml(m.name)}</strong><span class="badge ${cat === 'facility' ? 'badge-green' : 'badge-teal'}">${cat === 'facility' ? 'Facility' : m.era}</span></div><div style="font-size:.7rem;color:var(--text-muted);margin:.2rem 0;">Base: $${m.cost}M • ${cat === 'facility' ? m.desc : `Lifespan: ${m.lifespan || 20}y`}${!isUnl && m.researchCost > 0 ? `<br><span style="color:var(--accent-gold);">+$${(m.researchCost * getPlayerResearchFeeMultiplier(player)).toFixed(2)}M R&D</span>` : ''}</div>${!check.allowed ? `<div style="font-size:.68rem;color:var(--accent-red);font-weight:600;">${check.reason}</div>` : `<button class="btn-primary btn-sm" style="width:100%;margin-top:.22rem;" onclick="selectModelForCustomizer('${m.id}','${cat}')">Select & Configure</button>`}`;
    grid.appendChild(card);
  }
  catalogEl.appendChild(grid);
}

function selectModelForCustomizer(modelId, cat) {
  gameState.buildContext.selectedModelId = modelId;
  gameState.buildContext.category = cat;
  const customizerEl = document.getElementById("buildCustomizerSection");
  const slidersEl = document.getElementById("customSlidersContainer");
  customizerEl.style.display = "block";
  slidersEl.innerHTML = "";
  const player = gameState.players[gameState.activePlayerIdx];
  const park = player.parks.find(pk => pk.id === gameState.selectedParkId);
  const primaryTile = park.tiles.find(t => t.key === gameState.buildContext.plotId);
  const diagNeighbors = getValidDiagonalSecondTiles(park, primaryTile);

  const model = cat === "flat" ? FLAT_RIDE_CATALOG.find(m => m.id === modelId)
    : (cat === "tracked" ? TRACKED_RIDE_CATALOG.find(m => m.id === modelId)
    : (cat === "coaster" ? COASTER_CATALOG.find(m => m.id === modelId) : FACILITY_CATALOG.find(m => m.id === modelId)));

  document.getElementById("customizerModelTitle").textContent = `Configure ${model.name}`;
  document.getElementById("customRideName").value = cat === "facility" ? model.name : generateRandomRideName();
  populateInitialSceneryDropdown(cat);
  document.getElementById("customRideTheme").value = "0";

  let diagSelectHTML = "";
  if (cat === "coaster" || cat === "tracked") {
    diagSelectHTML = `<div class="form-group"><label>2nd Diagonal Hex Tile (Same Land)</label><select id="selectSecondDiagTile">${diagNeighbors.map(n => `<option value="${n.key}">Diagonal Hex (${n.q}, ${n.r})</option>`).join("")}</select></div>`;
  }

  if (cat === "facility") {
    slidersEl.innerHTML = `<div style="font-size:.76rem;color:var(--accent-green);margin-bottom:.5rem;">${escapeHtml(model.desc)}</div>`;
    document.getElementById("previewSmoothnessOdds").textContent = "Facilities occupy 1 hex and can be themed at 50% of standard ride scenery cost.";
  } else if (cat === "flat") {
    if (model.customizable) slidersEl.innerHTML = `<div class="form-group"><label>Height: <strong id="lblCustomFlatHeight">${model.baseHeight} ft</strong></label><input type="range" id="sliderFlatHeight" min="${model.baseHeight}" max="${model.maxHeight}" step="${model.stepHeight}" value="${model.baseHeight}" oninput="updateCustomizerPreview()"></div>`;
    else if (model.isTrain) {
      const elig = Math.max(1, park.zones.length);
      slidersEl.innerHTML = `<div class="form-group"><label>Train Stations Across Lands: <strong id="lblTrainStations">1</strong> (Max ${elig})</label><input type="range" id="sliderTrainStations" min="1" max="${elig}" step="1" value="1" oninput="updateCustomizerPreview()"></div>`;
    }
    document.getElementById("previewSmoothnessOdds").textContent = "Occupies 1 hex tile. Flat Ride Scenery is 1x base price.";
  } else if (cat === "tracked") {
    let h = diagSelectHTML;
    if (model.hasLength) h += `<div class="form-group"><label>Track Length: <strong id="lblTrackedLen">${model.baseLen} ft</strong></label><input type="range" id="sliderTrackedLen" min="${model.baseLen}" max="${model.maxLen}" step="${model.lenStep}" value="${model.baseLen}" oninput="updateCustomizerPreview()"></div>`;
    if (model.hasHeight) h += `<div class="form-group"><label>Drop Height: <strong id="lblTrackedHeight">${model.baseHeight} ft</strong></label><input type="range" id="sliderTrackedHeight" min="${model.baseHeight}" max="${model.maxHeight}" step="${model.heightStep}" value="${model.baseHeight}" oninput="updateCustomizerPreview()"></div>`;
    slidersEl.innerHTML = h;
    document.getElementById("previewSmoothnessOdds").textContent = "Occupies 2 diagonal hexes. Tracked Ride Scenery costs 2x base price.";
  } else {
    let h = diagSelectHTML;
    if (!model.fixed) {
      h += `<div class="form-group"><label>Track Length: <strong id="lblCoasterLen">${model.baseLen} ft</strong></label><input type="range" id="sliderCoasterLen" min="${model.baseLen}" max="${model.maxLen}" step="${model.lenStep}" value="${model.baseLen}" oninput="updateCustomizerPreview()"></div><div class="form-group"><label>Peak Height: <strong id="lblCoasterHeight">${model.baseHeight} ft</strong></label><input type="range" id="sliderCoasterHeight" min="${model.baseHeight}" max="${model.maxHeight}" step="${model.heightStep}" value="${model.baseHeight}" oninput="updateCustomizerPreview()"></div>${model.canInvert ? `<div class="form-group"><label>Inversions: <strong id="lblCoasterInv">${model.baseInv}</strong></label><input type="range" id="sliderCoasterInv" min="${model.baseInv}" max="${model.maxInv}" step="1" value="${model.baseInv}" oninput="updateCustomizerPreview()"></div>` : ''}`;
    }
    slidersEl.innerHTML = h;
    document.getElementById("previewSmoothnessOdds").textContent = hasCustomTrait(player, "pos_auto_smooth") ? "✨ Guaranteed Smooth Coaster! (2 Diagonal Hexes)" : `Smoothness Odds (${model.gen.toUpperCase()}) • Occupies 2 Diagonal Hexes.`;
  }
  updateCustomizerPreview();
}

function calculateCustomizedRideSpecs() {
  const cat = gameState.buildContext.category, modelId = gameState.buildContext.selectedModelId;
  if (!modelId) return null;
  const player = gameState.players[gameState.activePlayerIdx];
  const park = player.parks.find(pk => pk.id === gameState.selectedParkId);
  const primaryTile = park.tiles.find(t => t.key === gameState.buildContext.plotId);
  const inThemedLand = !!(primaryTile && primaryTile.zoneId);
  const zoneMult = inThemedLand ? 1.25 : 1.0;

  const themeLevel = parseInt(document.getElementById("customRideTheme").value) || 0;
  const themeObj = RIDE_SCENERY_TIERS[themeLevel];
  const themeCost = themeObj.cost * getCategorySceneryScale(cat) * getPlayerRideSceneryMultiplier(player, false);
  const isUnl = gameState.unlockedRides.has(modelId);
  const resMult = getPlayerResearchFeeMultiplier(player);

  if (cat === "facility") {
    const model = FACILITY_CATALOG.find(m => m.id === modelId);
    return { cat: "facility", model, totalCost: model.cost + themeCost, resFee: 0, techPoints: 0, scenicPoints: themeObj.points * zoneMult, themeLevel, notes: ["Facility Scenery is 50% off"] };
  } else if (cat === "flat") {
    const model = FLAT_RIDE_CATALOG.find(m => m.id === modelId);
    const resFee = isUnl ? 0 : model.researchCost * resMult;
    let rawBuildCost = model.cost, techPoints = model.points, height = null, stations = 1;
    if (model.customizable) {
      height = parseInt(document.getElementById("sliderFlatHeight").value) || model.baseHeight;
      document.getElementById("lblCustomFlatHeight").textContent = `${height} ft`;
      const st = (height - model.baseHeight) / model.stepHeight;
      rawBuildCost += st * model.costPerStep;
      techPoints += st * model.ptsPerStep;
    } else if (model.isTrain) {
      stations = parseInt(document.getElementById("sliderTrainStations").value) || 1;
      document.getElementById("lblTrainStations").textContent = stations;
      rawBuildCost += (stations - 1) * 1.0;
      techPoints += (stations - 1) * 2.0;
    }
    const { mult, notes } = getPlayerRideBuildMultiplier(player, park, model, "flat");
    return { cat: "flat", model, totalCost: rawBuildCost * mult + themeCost + resFee, resFee, techPoints, scenicPoints: themeObj.points * zoneMult, themeLevel, height, stations, notes };
  } else if (cat === "tracked") {
    const model = TRACKED_RIDE_CATALOG.find(m => m.id === modelId);
    const resFee = isUnl ? 0 : model.researchCost * resMult;
    let rawBuildCost = model.cost, techPoints = model.points;
    let length = model.hasLength ? model.baseLen : null, height = model.hasHeight ? model.baseHeight : null;
    if (model.hasLength) {
      length = parseInt(document.getElementById("sliderTrackedLen").value) || model.baseLen;
      document.getElementById("lblTrackedLen").textContent = `${length} ft`;
      const st = (length - model.baseLen) / model.lenStep;
      rawBuildCost += st * model.lenCost;
      techPoints += st * model.lenPts;
    }
    if (model.hasHeight) {
      height = parseInt(document.getElementById("sliderTrackedHeight").value) || model.baseHeight;
      document.getElementById("lblTrackedHeight").textContent = `${height} ft`;
      const st = (height - model.baseHeight) / model.heightStep;
      rawBuildCost += st * model.heightCost;
      techPoints += st * model.heightPts;
    }
    const { mult, notes } = getPlayerRideBuildMultiplier(player, park, model, "tracked");
    return { cat: "tracked", model, totalCost: rawBuildCost * mult + themeCost + resFee, resFee, techPoints, scenicPoints: themeObj.points * zoneMult, themeLevel, length, height, notes };
  } else {
    const model = COASTER_CATALOG.find(m => m.id === modelId);
    const resFee = isUnl ? 0 : model.researchCost * resMult;
    let length = model.baseLen, height = model.baseHeight, inversions = model.baseInv;
    if (!model.fixed) {
      length = parseInt(document.getElementById("sliderCoasterLen").value) || model.baseLen;
      height = parseInt(document.getElementById("sliderCoasterHeight").value) || model.baseHeight;
      document.getElementById("lblCoasterLen").textContent = `${length} ft`;
      document.getElementById("lblCoasterHeight").textContent = `${height} ft`;
      if (model.canInvert) {
        inversions = parseInt(document.getElementById("sliderCoasterInv").value) || model.baseInv;
        document.getElementById("lblCoasterInv").textContent = inversions;
      }
    }
    const rawBuildCost = model.cost + ((length - model.baseLen) / model.lenStep) * model.lenCost + ((height - model.baseHeight) / model.heightStep) * model.heightCost + (inversions - model.baseInv) * model.invCost;
    const { mult, notes } = getPlayerRideBuildMultiplier(player, park, model, "coaster");
    return { cat: "coaster", model, totalCost: rawBuildCost * mult + themeCost + resFee, resFee, techPoints: (length / 100) * 0.25 + (height / 20) * 0.5 + inversions * 1.0, scenicPoints: themeObj.points * zoneMult, themeLevel, length, height, inversions, notes };
  }
}

function updateCustomizerPreview() {
  const specs = calculateCustomizedRideSpecs();
  if (!specs) return;
  const player = gameState.players[gameState.activePlayerIdx];
  document.getElementById("previewTotalCost").textContent = `$${specs.totalCost.toFixed(2)}M`;
  document.getElementById("previewDiscountNote").textContent = specs.notes.length ? `Active Modifiers: ${specs.notes.join(" • ")}` : "";
  let estScore = specs.techPoints + specs.scenicPoints;
  if (player.legend.id === "hugo_herschend" && ["stage_show", "rapids", "train"].includes(specs.model.id)) estScore *= 1.20;
  if (player.legend.id === "angus_wynne" && specs.model.era === "classic" && specs.cat !== "facility") estScore *= 1.10;
  document.getElementById("previewTotalScore").textContent = `${estScore.toFixed(2)} pts`;
  const canAfford = player.cash >= specs.totalCost;
  const btn = document.getElementById("btnConfirmBuildRide");
  btn.disabled = !canAfford;
  btn.textContent = canAfford ? `Construct ($${specs.totalCost.toFixed(2)}M)` : `Insufficient Funds ($${specs.totalCost.toFixed(2)}M)`;
}

function confirmBuildRide() {
  const specs = calculateCustomizedRideSpecs();
  if (!specs) return;
  const player = gameState.players[gameState.activePlayerIdx];
  const park = player.parks.find(pk => pk.id === gameState.selectedParkId);
  const primaryTile = park.tiles.find(t => t.key === gameState.buildContext.plotId);
  if (!primaryTile || primaryTile.rideId || player.cash < specs.totalCost) return;

  player.cash -= specs.totalCost;
  if (specs.cat !== "facility") {
    player.ridesBuiltThisTurn = (player.ridesBuiltThisTurn || 0) + 1;
    if ((park.eisnerDiscountRidesLeft || 0) > 0) park.eisnerDiscountRidesLeft--;
  }
  const customName = document.getElementById("customRideName").value.trim() || specs.model.name;
  if (specs.resFee > 0) {
    gameState.unlockedRides.add(specs.model.id);
    player.cash += 1.0;
    addLog(`${player.ceoName} researched & debuted ${specs.model.name}, earning the $1.00M Innovation Award!`);
  }

  const zoneObj = getZoneForTile(park, primaryTile);
  const zoneName = zoneObj ? zoneObj.name : "Generic Zone";
  const baseProps = {
    modelId: specs.model.id, modelName: specs.model.name, era: specs.model.era,
    primaryTileKey: primaryTile.key, secondaryTileKey: null,
    zoneId: primaryTile.zoneId,
    themeLevel: specs.themeLevel,
    themedForZoneId: primaryTile.zoneId || "generic",
    totalInvestment: specs.totalCost - specs.resFee,
    age: 0, refurbCount: 0, cultClassic: false, cultChecked: false,
    status: "open", immuneToIssues: !!specs.model.immuneToIssues, immunityTurns: 0, recordTags: []
  };

  if (specs.cat === "facility") {
    const fac = {
      ...baseProps,
      id: nextUid("fac"),
      name: customName,
      category: "facility",
      facilityRole: specs.model.facilityRole,
      ...(specs.model.facilityRole === "restaurant" ? {
        mealPrice: FOOD_AND_BEVERAGE_RULES.defaultMealPrice,
        lastFbStats: { mealsSold: 0, grossRev: 0, cogs: 0, fixedOpEx: 0, netProfit: 0 }
      } : {}),
      spaces: 1,
      techPoints: 0,
      lifespan: 30,
      immuneToIssues: true
    };
    primaryTile.rideId = fac.id;
    park.rides.push(fac);
  } else if (specs.cat === "flat") {
    if (specs.model.isTrain) {
      const tgId = nextUid("train"), perPts = specs.techPoints / specs.stations;
      const originColor = zoneObj ? zoneObj.color : "#ffffff";
      let placed = 0;
      const otherTiles = park.tiles.filter(t => t.state === "cleared" && !t.isEntrance && !t.rideId && t.key !== primaryTile.key);
      for (const tTile of [primaryTile, ...otherTiles]) {
        if (placed >= specs.stations) break;
        const stRide = {
          ...baseProps, id: nextUid("ride"), name: `${customName} (Stn ${placed + 1})`, category: "flat", subType: "transport",
          spaces: 1, primaryTileKey: tTile.key, zoneId: tTile.zoneId, themedForZoneId: tTile.zoneId || "generic",
          techPoints: perPts, totalInvestment: (specs.totalCost - specs.resFee) / specs.stations, lifespan: 20,
          isTrainStation: true, trainGroupId: tgId, trainLineColor: originColor
        };
        tTile.rideId = stRide.id;
        park.rides.push(stRide);
        placed++;
      }
    } else {
      const flRide = { ...baseProps, id: nextUid("ride"), name: customName, category: "flat", subType: specs.model.subType, spaces: 1, techPoints: specs.techPoints, height: specs.height, lifespan: 20 };
      primaryTile.rideId = flRide.id;
      park.rides.push(flRide);
    }
    addNewsHeadline("ride", generateRideAdditionHeadline(player.ceoName, park.name, zoneName, customName, specs.model.name, park.rides.length, null));
  } else if (specs.cat === "tracked") {
    const secKey = document.getElementById("selectSecondDiagTile").value;
    const secTile = park.tiles.find(t => t.key === secKey);
    if (!secTile) return;
    const trRide = { ...baseProps, id: nextUid("ride"), name: customName, category: "tracked", subType: specs.model.subType, spaces: 2, secondaryTileKey: secTile.key, techPoints: specs.techPoints, length: specs.length, height: specs.height, lifespan: specs.model.lifespan || 20 };
    primaryTile.rideId = trRide.id;
    secTile.rideId = trRide.id;
    secTile.isSecondaryHex = true;
    park.rides.push(trRide);
    addNewsHeadline("ride", generateRideAdditionHeadline(player.ceoName, park.name, zoneName, customName, specs.model.name, park.rides.length, null));
  } else {
    const secKey = document.getElementById("selectSecondDiagTile").value;
    const secTile = park.tiles.find(t => t.key === secKey);
    if (!secTile) return;
    const sm = rollCoasterSmoothness(player, specs.model.gen);
    const coRide = { ...baseProps, id: nextUid("ride"), name: customName, category: "coaster", track: specs.model.track, gen: specs.model.gen, spaces: 2, secondaryTileKey: secTile.key, length: specs.length, height: specs.height, inversions: specs.inversions, smoothnessTier: sm.tier, smoothnessPenalty: sm.penalty, lifespan: specs.model.lifespan };
    primaryTile.rideId = coRide.id;
    secTile.rideId = coRide.id;
    secTile.isSecondaryHex = true;
    park.rides.push(coRide);
    addNewsHeadline("ride", generateRideAdditionHeadline(player.ceoName, park.name, zoneName, customName, specs.model.name, park.rides.length, sm.tier));
  }

  if (specs.cat !== "facility") {
    park.yearsSinceLastAddition = 0;
    park.additionThisYear = true;
    if (specs.cat === "coaster") park.newCoasterBuiltThisYear = true;
  }
  updateParkHarmonyMilestones(park, player);
  syncParkPlotsMirror(park);
  closeModal("buildRideModal");
  renderAll();
}

function upgradeRideScenery(parkId, plotId, rideId) {
  const player = gameState.players[gameState.activePlayerIdx];
  const park = player.parks.find(pk => pk.id === parkId);
  const ride = park.rides.find(r => r.id === rideId);
  if (!ride) return;
  const effLv = getEffectiveRideThemeLevel(ride);
  const nextL = effLv + 1;
  if (nextL >= RIDE_SCENERY_TIERS.length) return;
  const tierObj = RIDE_SCENERY_TIERS[nextL];
  const cost = +((effLv === 0 ? tierObj.cost : tierObj.upgradeCost) * getCategorySceneryScale(ride.category) * getPlayerRideSceneryMultiplier(player, effLv > 0)).toFixed(2);
  if (player.cash < cost) { alert(`Insufficient funds! Need $${cost}M.`); return; }
  player.cash -= cost;
  ride.themeLevel = nextL;
  ride.themedForZoneId = ride.zoneId || "generic";
  ride.totalInvestment += cost;
  updateParkHarmonyMilestones(park, player);
  renderAll();
}

function payRideMaintenance(parkId, plotId, rideId, fromModal = false) {
  const player = gameState.players.find(p => p.parks.some(pk => pk.id === parkId));
  const park = player.parks.find(pk => pk.id === parkId);
  const ride = park.rides.find(r => r.id === rideId);
  if (!ride || ride.status !== "needs_maintenance") return;
  const cost = +(ride.totalInvestment * 0.20 * getPlayerMaintAndRepairMultiplier(player)).toFixed(2);
  if (player.cash < cost) return;
  player.cash -= cost; ride.status = "open"; ride.immunityTurns = 3;
  if (fromModal) renderReportPage4();
  renderAll();
}

function payRideRepair(parkId, plotId, rideId, fromModal = false) {
  const player = gameState.players.find(p => p.parks.some(pk => pk.id === parkId));
  const park = player.parks.find(pk => pk.id === parkId);
  const ride = park.rides.find(r => r.id === rideId);
  if (!ride || ride.status !== "needs_repair") return;
  const cost = +(ride.totalInvestment * 0.40 * getPlayerMaintAndRepairMultiplier(player)).toFixed(2);
  if (player.cash < cost) return;
  player.cash -= cost; ride.status = "open"; ride.immunityTurns = 3;
  if (fromModal) renderReportPage4();
  renderAll();
}

function payRideInspection(parkId, plotId, rideId, fromModal = false) {
  const player = gameState.players.find(p => p.parks.some(pk => pk.id === parkId));
  const park = player.parks.find(pk => pk.id === parkId);
  const ride = park.rides.find(r => r.id === rideId);
  if (!ride || ride.status !== "needs_inspection" || player.cash < 0.5) return;
  player.cash -= 0.50; ride.status = "open"; ride.immunityTurns = 3;
  if (fromModal) renderReportPage4();
  renderAll();
}

function refurbishEndOfLifeRide(parkId, plotId, rideId) {
  const player = gameState.players.find(p => p.parks.some(pk => pk.id === parkId));
  const park = player.parks.find(pk => pk.id === parkId);
  const ride = park.rides.find(r => r.id === rideId);
  if (!ride) return;
  const cost = +(ride.totalInvestment * ((ride.refurbCount || 0) === 0 ? 0.50 : 1.00)).toFixed(2);
  if (player.cash < cost) return;
  player.cash -= cost; ride.age = 0; ride.refurbCount = (ride.refurbCount || 0) + 1; ride.pendingEolDecision = false; ride.immunityTurns = 3;
  renderReportPage4();
  renderAll();
}

function removeRideFromCampus(park, rideId) {
  const idx = park.rides.findIndex(r => r.id === rideId);
  if (idx === -1) return;
  for (const t of park.tiles) {
    if (t.rideId === rideId) { t.rideId = null; t.isSecondaryHex = false; }
  }
  park.rides.splice(idx, 1);
  syncParkPlotsMirror(park);
}

function letEndOfLifeRideDemolish(parkId, plotId, rideId) {
  const player = gameState.players.find(p => p.parks.some(pk => pk.id === parkId));
  const park = player.parks.find(pk => pk.id === parkId);
  removeRideFromCampus(park, rideId);
  renderReportPage4();
  renderAll();
}

function demolishSingleRide(parkId, plotId, rideId) {
  const park = gameState.players[gameState.activePlayerIdx].parks.find(pk => pk.id === parkId);
  removeRideFromCampus(park, rideId);
  renderAll();
}


function researchRideDirectly(modelId, cost, modelName) {
  const player = gameState.players[gameState.activePlayerIdx];
  if (player.cash < cost) return;
  player.cash -= cost;
  gameState.unlockedRides.add(modelId);
  addLog(`${player.ceoName} researched ${modelName} ($${cost}M).`);
  renderAll();
}

/* --- 9. TURN RESOLUTION & AI LOGIC --- */

function endPlayerTurn() {
  if (gameState.gameOver) return;
  let nextIdx = gameState.activePlayerIdx + 1;
  while (nextIdx < gameState.players.length && gameState.players[nextIdx].isAI) nextIdx++;
  if (nextIdx < gameState.players.length) {
    gameState.activePlayerIdx = nextIdx;
    gameState.inspectedPlayerIdx = nextIdx;
    gameState.selectedParkId = gameState.players[nextIdx].parks[0].id;
    gameState.selectedHexKey = gameState.players[nextIdx].parks[0].hexKey;
    renderAll();
    return;
  }
  for (const p of gameState.players) if (p.isAI) executeAITurn(p);
  resolveSeasonEnd();
}

function getAILegendStrategyProfile(bot) {
  const profiles = {
    walt_disney: { targetThemeTier: 4, coasterFocus: 0.35, trackedFocus: 0.45, flatFocus: 0.20, initialRideThemeTier: 2, reserve: 7 },
    michael_eisner: { targetThemeTier: 2, coasterFocus: 0.45, trackedFocus: 0.35, flatFocus: 0.20, initialRideThemeTier: 1, reserve: 4, expansionist: true },
    jim_reid: { targetThemeTier: 1, coasterFocus: 0.75, trackedFocus: 0.15, flatFocus: 0.10, initialRideThemeTier: 1, reserve: 3 },
    hugo_herschend: { targetThemeTier: 3, coasterFocus: 0.25, trackedFocus: 0.50, flatFocus: 0.25, initialRideThemeTier: 2, reserve: 5 },
    john_arie: { targetThemeTier: 1, coasterFocus: 0.20, trackedFocus: 0.15, flatFocus: 0.65, initialRideThemeTier: 1, reserve: 3 },
    roland_mack: { targetThemeTier: 3, coasterFocus: 0.45, trackedFocus: 0.40, flatFocus: 0.15, initialRideThemeTier: 2, reserve: 6 },
    matt_ouimet: { targetThemeTier: 2, coasterFocus: 0.45, trackedFocus: 0.35, flatFocus: 0.20, initialRideThemeTier: 1, reserve: 2, oneRidePerTurn: true },
    angus_wynne: { targetThemeTier: 1, coasterFocus: 0.45, trackedFocus: 0.25, flatFocus: 0.30, initialRideThemeTier: 1, reserve: 5, expansionist: true }
  };
  return profiles[bot.legend.id] || {
    targetThemeTier: 2, coasterFocus: 0.45, trackedFocus: 0.30,
    flatFocus: 0.25, initialRideThemeTier: 1, reserve: 4
  };
}

function getAIOpenCampusTiles(park) {
  return park.tiles.filter(tile => tile.state === "cleared" && !tile.isEntrance && !tile.rideId);
}

function buildAIFacility(bot, park, tile, model) {
  if (!tile || tile.rideId || bot.cash < model.cost) return false;
  const facility = {
    id: nextUid("fac"), name: model.name, modelId: model.id, modelName: model.name,
    category: "facility", facilityRole: model.facilityRole, era: model.era,
    ...(model.facilityRole === "restaurant" ? {
      mealPrice: FOOD_AND_BEVERAGE_RULES.defaultMealPrice,
      lastFbStats: { mealsSold: 0, grossRev: 0, cogs: 0, fixedOpEx: 0, netProfit: 0 }
    } : {}),
    spaces: 1, primaryTileKey: tile.key, secondaryTileKey: null, zoneId: tile.zoneId,
    techPoints: 0, themeLevel: 0, themedForZoneId: tile.zoneId || "generic",
    totalInvestment: model.cost, age: 0, lifespan: model.lifespan || 30,
    refurbCount: 0, cultClassic: false, cultChecked: false, status: "open",
    immuneToIssues: true, immunityTurns: 0, recordTags: []
  };
  bot.cash -= model.cost;
  tile.rideId = facility.id;
  park.rides.push(facility);
  return true;
}

function getAIRideBuildPlan(bot, park, model, category, reserve, sliderOverride = null, themeOverride = null) {
  const profile = getAILegendStrategyProfile(bot);
  const isUnlocked = gameState.unlockedRides.has(model.id);
  const researchFee = isUnlocked ? 0 : model.researchCost * getPlayerResearchFeeMultiplier(bot);
  const themeLevel = themeOverride === null
    ? Math.min(profile.initialRideThemeTier, gameState.year < 12 ? 1 : 2)
    : themeOverride;
  const themeCost = RIDE_SCENERY_TIERS[themeLevel].cost *
    getCategorySceneryScale(category) * getPlayerRideSceneryMultiplier(bot, false);
  const buildMultiplier = getPlayerRideBuildMultiplier(bot, park, model, category).mult;
  const sliderFraction = sliderOverride === null
    ? (bot.cash > model.cost * 1.6
      ? Math.max(0.4, Math.min(1, 0.4 + (bot.cash / model.cost - 1.6) * (0.6 / 1.4)))
      : 0)
    : sliderOverride;
  let rawCost = model.cost, techPoints = model.points || 0;
  let length = model.baseLen, height = model.baseHeight, inversions = model.baseInv || 0;
  let stations = 1;
  const scale = (base, max, step) => base + Math.floor(((max - base) * sliderFraction) / step) * step;

  if (category === "coaster" && !model.fixed) {
    length = scale(model.baseLen, model.maxLen, model.lenStep);
    height = scale(model.baseHeight, model.maxHeight, model.heightStep);
    if (model.canInvert) inversions = Math.floor(model.baseInv + (model.maxInv - model.baseInv) * sliderFraction);
    rawCost += ((length - model.baseLen) / model.lenStep) * model.lenCost;
    rawCost += ((height - model.baseHeight) / model.heightStep) * model.heightCost;
    rawCost += (inversions - model.baseInv) * model.invCost;
    techPoints = (length / 100) * 0.25 + (height / 20) * 0.5 + inversions;
  } else if (category === "tracked") {
    if (model.hasLength) {
      length = scale(model.baseLen, model.maxLen, model.lenStep);
      rawCost += ((length - model.baseLen) / model.lenStep) * model.lenCost;
      techPoints += ((length - model.baseLen) / model.lenStep) * model.lenPts;
    }
    if (model.hasHeight) {
      height = scale(model.baseHeight, model.maxHeight, model.heightStep);
      rawCost += ((height - model.baseHeight) / model.heightStep) * model.heightCost;
      techPoints += ((height - model.baseHeight) / model.heightStep) * model.heightPts;
    }
  } else if (category === "flat") {
    if (model.customizable) {
      height = scale(model.baseHeight, model.maxHeight, model.stepHeight);
      rawCost += ((height - model.baseHeight) / model.stepHeight) * model.costPerStep;
      techPoints += ((height - model.baseHeight) / model.stepHeight) * model.ptsPerStep;
    } else if (model.isTrain) {
      stations = 1;
    }
  }

  const totalCost = rawCost * buildMultiplier + themeCost + researchFee;
  if (bot.cash - totalCost < reserve) {
    if (themeLevel > 1) {
      return getAIRideBuildPlan(bot, park, model, category, reserve, sliderFraction, 1);
    }
    if (sliderFraction > 0) {
      return getAIRideBuildPlan(bot, park, model, category, reserve,
        Math.max(0, sliderFraction - 0.1), themeLevel);
    }
    return null;
  }
  return {
    totalCost, investedCost: totalCost - researchFee, researchFee, themeLevel,
    techPoints, length, height, inversions, stations
  };
}

function getAICategoryPriority(bot, park, profile) {
  const has = category => park.rides.some(ride => ride.status === "open" &&
    (category === "coaster" ? ride.category === "coaster" : ride.subType === category));
  if (bot.legend.id === "michael_eisner" && park.eisnerDiscountRidesLeft > 0) {
    return park.eisnerDiscountRidesLeft === 2 ? "coaster" : "tracked";
  }
  if (bot.legend.id === "hugo_herschend") {
    if (!park.rides.some(ride => ride.modelId === "stage_show")) return "tracked";
    if (gameState.year >= 15 && !park.rides.some(ride => ride.modelId === "rapids")) return "tracked";
    if (!park.rides.some(ride => ride.modelId === "train")) return "flat";
    if (!park.rides.some(ride => ride.category === "coaster" && ride.track === "wood")) return "coaster";
  }
  const missing = ["coaster", "family", "thrill", "transport"].find(category => !has(category));
  if (missing) return missing === "coaster" ? "coaster" : "flat";
  if (bot.legend.id === "john_arie") return "flat";
  if (bot.legend.id === "jim_reid") return "coaster";
  const weighted = [
    ["coaster", profile.coasterFocus],
    ["tracked", profile.trackedFocus],
    ["flat", profile.flatFocus]
  ];
  return weighted.sort((a, b) => b[1] - a[1])[0][0];
}

function getAIMissingPortfolioCategory(park) {
  const has = category => park.rides.some(ride => ride.status === "open" &&
    (category === "coaster" ? ride.category === "coaster" : ride.subType === category));
  return ["coaster", "family", "thrill", "transport"].find(category => !has(category));
}

function getAICatalogPreference(bot, model, category) {
  let score = (model.points || 0) + (model.cost || 1) * 0.25;
  if (category === "coaster") {
    if (bot.legend.id === "jim_reid") {
      score += model.track === "steel" || model.track === "wood" ? 5 : 0;
      score += (model.maxHeight || 0) / 100 + (model.maxLen || 0) / 1000;
    }
    if (bot.legend.id === "hugo_herschend" && model.track === "wood") score += 12;
    if (bot.legend.id === "angus_wynne" && model.era === "classic") score += 8;
    if (bot.legend.id === "michael_eisner" && (model.track === "steel" || model.track === "wood")) score += 4;
  } else if (category === "tracked" && bot.legend.id === "hugo_herschend") {
    if (model.id === "stage_show") score += 30;
    if (model.id === "rapids") score += 25;
  } else if (category === "flat") {
    if (bot.legend.id === "hugo_herschend" && model.id === "train") score += 20;
    if (bot.legend.id === "john_arie") {
      if (model.id === "drop_tower" || model.id === "ferris_wheel") score += 15;
      if (model.customizable) score += 8;
    }
    if (bot.legend.id === "angus_wynne" && model.era === "classic") score += 8;
  }
  return score;
}

function buildAIRide(bot, park, category, model, primaryTile, secondTile, plan) {
  if (!primaryTile || primaryTile.rideId || bot.cash < plan.totalCost) return false;
  bot.cash -= plan.totalCost;
  if (plan.researchFee > 0) {
    gameState.unlockedRides.add(model.id);
    bot.cash += 1.0;
  }
  bot.ridesBuiltThisTurn = (bot.ridesBuiltThisTurn || 0) + 1;
  if ((park.eisnerDiscountRidesLeft || 0) > 0) park.eisnerDiscountRidesLeft--;

  const ride = {
    id: nextUid("ride"), name: generateRandomRideName(), modelId: model.id,
    modelName: model.name, category, era: model.era, primaryTileKey: primaryTile.key,
    secondaryTileKey: secondTile ? secondTile.key : null,
    zoneId: primaryTile.zoneId, spaces: secondTile ? 2 : 1,
    themeLevel: plan.themeLevel, themedForZoneId: primaryTile.zoneId || "generic",
    totalInvestment: plan.investedCost, age: 0, refurbCount: 0,
    cultClassic: false, cultChecked: false, status: "open",
    immuneToIssues: !!model.immuneToIssues, immunityTurns: 0, recordTags: [],
    lifespan: model.lifespan || 20, techPoints: plan.techPoints
  };
  if (category === "coaster") {
    const smoothness = rollCoasterSmoothness(bot, model.gen);
    Object.assign(ride, {
      track: model.track, gen: model.gen, length: plan.length, height: plan.height,
      inversions: plan.inversions, smoothnessTier: smoothness.tier,
      smoothnessPenalty: smoothness.penalty
    });
  } else if (category === "tracked") {
    Object.assign(ride, { subType: model.subType, length: plan.length, height: plan.height });
  } else {
    Object.assign(ride, { subType: model.subType, height: plan.height });
    if (model.isTrain) {
      ride.isTrainStation = true;
      ride.trainGroupId = nextUid("train");
      ride.trainLineColor = getZoneForTile(park, primaryTile)?.color || "#ffffff";
    }
  }
  primaryTile.rideId = ride.id;
  if (secondTile) {
    secondTile.rideId = ride.id;
    secondTile.isSecondaryHex = true;
  }
  park.rides.push(ride);
  park.yearsSinceLastAddition = 0;
  park.additionThisYear = true;
  if (category === "coaster") park.newCoasterBuiltThisYear = true;
  syncParkPlotsMirror(park);
  return true;
}

function createAIThemedLands(park, desiredLandCount = 2) {
  const palette = LAND_COLOR_PALETTE.filter(color => !park.zones.some(zone => zone.color === color.hex));
  const tiles = park.tiles.filter(tile => tile.state === "cleared" && !tile.isEntrance);
  const landCount = Math.min(desiredLandCount, palette.length, Math.max(1, Math.ceil(tiles.length / 8)));
  const chunkSize = Math.ceil(tiles.length / landCount);
  for (let i = 0; i < landCount; i++) {
    const color = palette[i];
    if (!color) break;
    const zone = { id: nextUid("zone"), name: generateRandomZoneName(), color: color.hex };
    park.zones.push(zone);
    for (const tile of tiles.slice(i * chunkSize, (i + 1) * chunkSize)) tile.zoneId = zone.id;
  }
}

function initializeAIPurchasedPark(bot, park) {
  createAIThemedLands(park, park.tier === "small" ? 2 : 3);
  const mainZone = park.zones[0];
  const facilityModels = ["guest_services", "toilets", "restaurant"];
  for (const id of facilityModels) {
    const model = FACILITY_CATALOG.find(item => item.id === id);
    const tile = getAIOpenCampusTiles(park).find(item => item.zoneId === mainZone.id);
    if (!tile || bot.cash < model.cost) continue;
    buildAIFacility(bot, park, tile, model);
  }
  syncParkPlotsMirror(park);
}

function buyAIPark(bot, profile) {
  const candidates = gameState.hexGrid
    .filter(hex => canPlayerBuildParkOnHex(bot, hex).allowed)
    .map(hex => ({ hex, attendance: getTotalHexAttendanceMultiplier(hex), prices: getHexParkPricesForPlayer(bot, hex) }))
    .sort((a, b) => b.attendance - a.attendance);
  for (const candidate of candidates) {
    let tier, cost, expansionCost;
    const isAngusEarly = bot.legend.id === "angus_wynne" && gameState.year < 20;
    if (isAngusEarly && bot.cash >= candidate.prices.smallCost + 8) {
      tier = "small"; cost = candidate.prices.smallCost; expansionCost = candidate.prices.smallExp;
    } else if (bot.cash >= candidate.prices.largeCost + 12) {
      tier = "large"; cost = candidate.prices.largeCost; expansionCost = candidate.prices.largeExp;
    } else if (bot.cash >= candidate.prices.mediumCost + 8) {
      tier = "medium"; cost = candidate.prices.mediumCost; expansionCost = candidate.prices.mediumExp;
    } else if (bot.legend.id === "angus_wynne" && bot.cash >= candidate.prices.smallCost + 8) {
      tier = "small"; cost = candidate.prices.smallCost; expansionCost = candidate.prices.smallExp;
    } else continue;

    bot.cash -= cost;
    const { tiles, maxExpansions } = generate49HexCampusDiamond(tier, 0);
    const park = {
      id: nextUid("park"), name: generateRandomParkName(), hexKey: candidate.hex.key,
      tier, maxExpansions, expansionsBought: 0, expansionCost,
      eisnerDiscountRidesLeft: bot.legend.id === "michael_eisner" ? 2 : 0,
      lastAttendance: 0, lastRollLabel: "—", yearsSinceLastAddition: 0,
      additionThisYear: true, newCoasterBuiltThisYear: false,
      lastFoodAndBeverageLedger: null, tiles, zones: [], rides: [], plots: []
    };
    candidate.hex.parkId = park.id;
    candidate.hex.ownerId = bot.id;
    bot.parks.push(park);
    initializeAIPurchasedPark(bot, park);
    addLog(`${bot.ceoName} acquired "${park.name}" in ${candidate.hex.regionName} ($${cost.toFixed(2)}M)!`);
    return true;
  }
  return false;
}

function executeAITurn(bot) {
  const profile = getAILegendStrategyProfile(bot);
  const maintMult = getPlayerMaintAndRepairMultiplier(bot);
  const reserve = profile.reserve;
  const maxRidesPerTurn = profile.oneRidePerTurn ? 1 : 3;

  for (const park of bot.parks) {
    for (const ride of park.rides) {
      let cost = 0;
      if (ride.status === "needs_inspection") cost = 0.5;
      else if (ride.status === "needs_repair") cost = ride.totalInvestment * 0.4 * maintMult;
      else if (ride.status === "needs_maintenance") cost = ride.totalInvestment * 0.2 * maintMult;
      if (cost > 0 && bot.cash >= cost) {
        bot.cash -= cost;
        ride.status = "open";
        ride.immunityTurns = 3;
      }
    }

    if (!checkParkHasGuestServices(park)) {
      const tile = getAIOpenCampusTiles(park)[0];
      const model = FACILITY_CATALOG.find(item => item.id === "guest_services");
      if (tile) buildAIFacility(bot, park, tile, model);
    }

    for (const zone of park.zones) {
      const zoneHasRides = park.rides.some(ride => ride.zoneId === zone.id);
      if (!zoneHasRides) continue;
      for (const role of ["toilets", "restaurant"]) {
        const hasFacility = park.rides.some(ride => ride.status === "open" &&
          ride.category === "facility" && ride.facilityRole === role && ride.zoneId === zone.id);
        if (hasFacility) continue;
        const tile = getAIOpenCampusTiles(park).find(item => item.zoneId === zone.id);
        const model = FACILITY_CATALOG.find(item => item.facilityRole === role);
        if (tile) buildAIFacility(bot, park, tile, model);
      }
    }

    let openTiles = getAIOpenCampusTiles(park);
    if (openTiles.length < 4 && park.expansionsBought < park.maxExpansions) {
      for (let cleared = 0; cleared < 3 && bot.cash >= park.expansionCost + 4 &&
        park.expansionsBought < park.maxExpansions; cleared++) {
        const clearedTiles = park.tiles.filter(tile => tile.state === "cleared");
        const woodsTile = park.tiles.find(tile => tile.state === "woods" &&
          clearedTiles.some(clearedTile => areCampusTilesAdjacent(clearedTile, tile)));
        if (!woodsTile) break;
        bot.cash -= park.expansionCost;
        park.expansionsBought++;
        woodsTile.state = "cleared";
      }
    }

    openTiles = getAIOpenCampusTiles(park);
    const unzonedTiles = openTiles.filter(tile => !tile.zoneId);
    for (const zone of park.zones) {
      let zoneSize = park.tiles.filter(tile => tile.zoneId === zone.id).length;
      if (zoneSize >= 10) continue;
      for (const tile of unzonedTiles) {
        if (zoneSize >= 10) break;
        if (park.tiles.some(zoned => zoned.zoneId === zone.id &&
          areCampusTilesAdjacent(zoned, tile))) {
          tile.zoneId = zone.id;
          unzonedTiles.splice(unzonedTiles.indexOf(tile), 1);
          zoneSize++;
        }
      }
    }
    if (unzonedTiles.length >= 4 && park.zones.length < 6) {
      const availableColors = LAND_COLOR_PALETTE.filter(color =>
        !park.zones.some(zone => zone.color === color.hex));
      const color = availableColors[0];
      if (color) {
        const zone = { id: nextUid("zone"), name: generateRandomZoneName(), color: color.hex };
        park.zones.push(zone);
        for (const tile of unzonedTiles.slice(0, Math.min(8, unzonedTiles.length))) tile.zoneId = zone.id;
      }
    }

    const rideLimit = Math.max(0, maxRidesPerTurn - (bot.ridesBuiltThisTurn || 0));
    for (let built = 0; built < rideLimit; built++) {
      const freeTiles = getAIOpenCampusTiles(park);
      if (!freeTiles.length || bot.cash <= reserve) break;
      const category = getAICategoryPriority(bot, park, profile);
      const missingPortfolioCategory = getAIMissingPortfolioCategory(park);
      const catalog = category === "coaster" ? COASTER_CATALOG :
        (category === "tracked" ? TRACKED_RIDE_CATALOG : FLAT_RIDE_CATALOG);
      const pairOptions = category === "flat" ? freeTiles.map(tile => [tile, null]) :
        freeTiles.flatMap(tile => getValidDiagonalSecondTiles(park, tile).map(second => [tile, second]));
      if (!pairOptions.length) {
        if (category !== "flat" &&
          !(bot.legend.id === "michael_eisner" && park.eisnerDiscountRidesLeft > 0)) {
          const flatModel = FLAT_RIDE_CATALOG.find(model =>
            isModelEraAvailable(model.era) &&
            (!["family", "thrill", "transport"].includes(missingPortfolioCategory) ||
              model.subType === missingPortfolioCategory) &&
            canBuildRideModelInPark(park, model, "flat").allowed);
          const tile = freeTiles[0];
          const plan = flatModel && getAIRideBuildPlan(bot, park, flatModel, "flat", reserve);
          if (flatModel && plan && buildAIRide(bot, park, "flat", flatModel, tile, null, plan)) continue;
        }
        break;
      }

      const options = [];
      for (const model of catalog) {
        if (!isModelEraAvailable(model.era) || !canBuildRideModelInPark(park, model, category).allowed) continue;
        if (category === "flat" && ["family", "thrill", "transport"].includes(missingPortfolioCategory) &&
          model.subType !== missingPortfolioCategory) continue;
        const plan = getAIRideBuildPlan(bot, park, model, category, reserve);
        if (!plan) continue;
        for (const [primaryTile, secondTile] of pairOptions) {
          if (category === "coaster" && bot.legend.id === "jim_reid" &&
            modelExistsInOtherChainPark(bot, park.id, model.id)) {
            options.push({ model, plan, primaryTile, secondTile, score: getAICatalogPreference(bot, model, category) + 20 });
          } else {
            options.push({
              model, plan, primaryTile, secondTile,
              score: getAICatalogPreference(bot, model, category) -
                plan.totalCost * 0.08
            });
          }
        }
      }
      options.sort((a, b) => b.score - a.score);
      const choice = options[0];
      if (!choice || !buildAIRide(bot, park, category, choice.model,
        choice.primaryTile, choice.secondTile, choice.plan)) break;
    }

    for (const zone of park.zones) {
      if (!park.rides.some(ride => ride.zoneId === zone.id)) continue;
      for (const role of ["toilets", "restaurant"]) {
        const hasFacility = park.rides.some(ride => ride.status === "open" &&
          ride.category === "facility" && ride.facilityRole === role && ride.zoneId === zone.id);
        if (hasFacility) continue;
        const tile = getAIOpenCampusTiles(park).find(item => item.zoneId === zone.id);
        const model = FACILITY_CATALOG.find(item => item.facilityRole === role);
        if (tile) buildAIFacility(bot, park, tile, model);
      }
    }

    const prestige = calculateParkPrestigeMetrics(park, bot);
    const globalMealPrice = getGlobalAverageMealPrice();
    for (const restaurant of park.rides.filter(ride => ride.category === "facility" &&
      ride.facilityRole === "restaurant" && ride.status === "open")) {
      const referencePrice = FOOD_AND_BEVERAGE_RULES.baselineMarketPrice *
        FOOD_AND_BEVERAGE_RULES.fixedPriceWeight +
        globalMealPrice * FOOD_AND_BEVERAGE_RULES.globalAverageWeight +
        getEffectiveRideThemeLevel(restaurant) * FOOD_AND_BEVERAGE_RULES.themeBonusPerTier +
        prestige.placeMakingIndex * 2.5 + (restaurant.zoneId ? 1 : 0);
      const undercut = ["jim_reid", "john_arie"].includes(bot.legend.id) ? 1 : 0;
      restaurant.mealPrice = Math.max(FOOD_AND_BEVERAGE_RULES.minMealPrice,
        Math.min(FOOD_AND_BEVERAGE_RULES.maxMealPrice, Math.round(referencePrice - undercut)));
    }

    const targetTier = Math.min(profile.targetThemeTier,
      gameState.year < 12 ? 1 : (gameState.year < 25 ? 2 :
        (["walt_disney", "roland_mack"].includes(bot.legend.id) ? 4 : 3)));
    const sceneryTargets = [];
    for (const zone of park.zones) {
      for (const tile of park.tiles.filter(item => item.zoneId === zone.id && item.state === "cleared")) {
        const level = getEffectiveTileThemeLevel(tile);
        if (level < targetTier) sceneryTargets.push({ type: "tile", target: tile, level });
      }
      for (const ride of park.rides.filter(item => item.zoneId === zone.id && item.status === "open")) {
        const level = getEffectiveRideThemeLevel(ride);
        if (level < targetTier) sceneryTargets.push({ type: "ride", target: ride, level });
      }
    }
    sceneryTargets.sort((a, b) => a.level - b.level ||
      (a.type === b.type ? 0 : (a.type === "tile" ? -1 : 1)));
    for (const item of sceneryTargets) {
      if (bot.cash <= reserve || item.level >= targetTier) continue;
      const nextLevel = item.level + 1;
      let cost;
      if (item.type === "tile") {
        const tier = TILE_SCENERY_TIERS[nextLevel];
        cost = (item.level === 0 ? tier.cost * getPlayerPlotSceneryMultiplier(bot, false) :
          tier.upgradeCost * getPlayerPlotSceneryMultiplier(bot, true));
      } else {
        const tier = RIDE_SCENERY_TIERS[nextLevel];
        cost = (item.level === 0 ? tier.cost : tier.upgradeCost) *
          getCategorySceneryScale(item.target.category) *
          getPlayerRideSceneryMultiplier(bot, item.level > 0);
      }
      cost = +cost.toFixed(2);
      if (bot.cash - cost < reserve) continue;
      bot.cash -= cost;
      if (item.type === "tile") {
        item.target.themeLevel = nextLevel;
        item.target.themedForZoneId = item.target.zoneId || "generic";
      } else {
        item.target.themeLevel = nextLevel;
        item.target.themedForZoneId = item.target.zoneId || "generic";
      }
    }
    updateParkHarmonyMilestones(park, bot);
    syncParkPlotsMirror(park);
  }

  const openClearedCount = bot.parks.reduce((sum, park) => sum + getAIOpenCampusTiles(park).length, 0);
  const remainingWoodsExpansions = bot.parks.reduce((sum, park) =>
    sum + Math.max(0, park.maxExpansions - park.expansionsBought), 0);
  const chainRideCount = bot.parks.reduce((sum, park) => sum + park.rides.filter(ride =>
    ride.category !== "facility").length, 0);
  const needsCapacity = openClearedCount < 5 && remainingWoodsExpansions < 4;
  const expansionistPurchase = profile.expansionist && bot.cash >= 28 && chainRideCount >= 6;
  if (needsCapacity || expansionistPurchase) buyAIPark(bot, profile);
}

function rollGlobalTourismClimate() {
  const totalWeight = GLOBAL_TOURISM_TABLE.reduce((sum, climate) => sum + climate.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const climate of GLOBAL_TOURISM_TABLE) {
    roll -= climate.weight;
    if (roll < 0) return climate;
  }
  return GLOBAL_TOURISM_TABLE[GLOBAL_TOURISM_TABLE.length - 1];
}

function resolveSeasonEnd() {
  for (const player of gameState.players) {
    let accidentFaces = hasCustomTrait(player, "pos_freak_safe") ? 2000 : (hasCustomTrait(player, "neg_freak_prone") ? 700 : 1000);
    for (const park of player.parks) {
      park.freakAccidentThisYear = false;
      for (const plot of park.plots) {
        for (const r of plot.rides) {
          if (r.status === "open" && r.category !== "facility") {
            if (Math.floor(Math.random() * accidentFaces) + 1 === accidentFaces) {
              park.freakAccidentThisYear = true;
              r.status = "freak_accident_down";
              r.justHadFreakAccident = true;
              addNewsHeadline("accident", `🚨 <strong>BREAKING:</strong> A 1-in-1000 Freak Accident occurred on <strong>"${escapeHtml(r.name)}"</strong> (${escapeHtml(r.modelName)}) at <strong>${escapeHtml(park.name)}</strong>! Park attendance dropped to 0.7x and the ride is closed for 1 year pending a $0.50M inspection!`);
            }
          }
        }
      }
    }
  }
  recalculateGlobalRecords();
  for (const player of gameState.players) {
    for (const park of player.parks) updateParkHarmonyMilestones(park, player);
  }
  const tourismClimate = rollGlobalTourismClimate();
  if (tourismClimate.headline) addNewsHeadline("tourism", tourismClimate.headline);
  const globalAverageMealPrice = getGlobalAverageMealPrice();
  const attendanceRows = [], awardsGiven = [];
  for (const player of gameState.players) {
    let chainAtt = 0, chainGateRevenue = 0, chainFoodGross = 0, chainFoodCogs = 0, chainFoodProfit = 0;
    let hadAccidentInChain = false;
    player.ridesBuiltThisTurn = 0;
    for (const park of player.parks) {
      if (park.additionThisYear) park.yearsSinceLastAddition = 0;
      else park.yearsSinceLastAddition = (park.yearsSinceLastAddition || 0) + 1;
      const summary = calculateParkScoreSummary(park, player);
      const prestige = calculateParkPrestigeMetrics(park, player);
      const hexMarketMult = getTotalHexAttendanceMultiplier(gameState.hexByKey.get(park.hexKey));
      const rollObj = WEATHER_ROLL_TABLE[Math.floor(Math.random() * WEATHER_ROLL_TABLE.length)];
      const weatherMult = prestige.placeMakingIndex >= 0.5 && rollObj.mult < 1
        ? 1 - (1 - rollObj.mult) * 0.5
        : rollObj.mult;
      let parkAtt = Math.round(summary.finalScore * 10000 * hexMarketMult * weatherMult * tourismClimate.mult);
      if (prestige.identity === "thrill" && park.newCoasterBuiltThisYear) parkAtt = Math.round(parkAtt * 1.12);
      if (prestige.identity === "thrill" && prestige.placeMakingIndex < 0.35 &&
          park.yearsSinceLastAddition >= 2) {
        const stagnationPenalty = Math.min(0.15, (park.yearsSinceLastAddition - 1) * 0.05);
        parkAtt = Math.round(parkAtt * (1 - stagnationPenalty));
      }
      if (park.freakAccidentThisYear) { parkAtt = Math.round(parkAtt * 0.70); hadAccidentInChain = true; }
      const gateRevenue = parkAtt / 100000;
      const foodLedger = calculateParkFoodAndBeverageLedger(park, parkAtt, player, globalAverageMealPrice, prestige);
      park.lastFoodAndBeverageLedger = foodLedger;
      const parkRev = gateRevenue * player.revenueMult;
      const parkFoodGross = foodLedger.grossRevenue * player.revenueMult;
      const parkFoodCogs = foodLedger.cogs * player.revenueMult;
      const parkFoodProfit = foodLedger.netProfit;
      park.lastAttendance = parkAtt;
      chainAtt += parkAtt;
      chainGateRevenue += parkRev;
      chainFoodGross += parkFoodGross;
      chainFoodCogs += parkFoodCogs;
      chainFoodProfit += parkFoodProfit;
      park.additionThisYear = false;
      park.newCoasterBuiltThisYear = false;
    }
    player.totalAttendance = chainAtt;
    const chainRevenue = chainGateRevenue + chainFoodProfit;
    player.cash += chainRevenue;
    attendanceRows.push({
      playerName: `${player.ceoName} (${player.chainName})`,
      parksCount: player.parks.length,
      attendance: chainAtt,
      gateRevenue: chainGateRevenue,
      foodAndBeverageGross: chainFoodGross,
      foodAndBeverageCogs: chainFoodCogs,
      foodAndBeverageProfit: chainFoodProfit,
      revenue: chainRevenue,
      newTreasury: player.cash,
      hadAccidentInChain
    });
  }
  if (gameState.year > 5) {
    const awardCash = getAwardCashValue();
    const cats = [["steel_coaster", "Best Steel Coaster"], ["wood_coaster", "Best Wood Coaster"], ["park_scenery", "Best Park Scenery"], ...(gameState.year > 20 ? [["themed_plot", "Best Themed Zone"]] : []), ["best_park", "Best Overall Park"]];
    for (const [key, title] of cats) {
      const w = findHighestScoringEntity(key);
      if (w) {
        w.player.cash += awardCash;
        const label = w.ride ? `${w.ride.name} (${w.park.name})` : (w.plot ? `${w.plot.name} (${w.park.name})` : w.park.name);
        awardsGiven.push({ title, winner: label, ceo: w.player.chainName, score: `${w.score.toFixed(1)} pts`, cash: awardCash });
      }
    }
  }
  for (const player of gameState.players) {
    const isWalt = player.legend.id === "walt_disney", maintChance = isWalt ? 0.12 : 0.08, brokenChance = isWalt ? 0.06 : 0.04;
    for (const park of player.parks) {
      for (const plot of park.plots) {
        for (let i = plot.rides.length - 1; i >= 0; i--) {
          const r = plot.rides[i];
          if (r.category === "facility") continue;
          if (r.status === "broken_down") r.status = "needs_repair";
          else if (r.status === "freak_accident_down") {
            if (r.justHadFreakAccident) r.justHadFreakAccident = false;
            else r.status = "needs_inspection";
          } else if (r.status === "open" && !r.immuneToIssues) {
            if ((r.immunityTurns || 0) > 0) r.immunityTurns--;
            else {
              const roll = Math.random();
              if (roll < brokenChance) r.status = "broken_down";
              else if (roll < brokenChance + maintChance) r.status = "needs_maintenance";
            }
          }
          r.age++;
          if (r.age >= r.lifespan) {
            if (!r.cultChecked && (r.refurbCount || 0) === 0) {
              r.cultChecked = true;
              if (Math.floor(Math.random() * 3) + 1 === 3) {
                r.cultClassic = true;
                addNewsHeadline("cult", `🌟 <strong>CULT CLASSIC:</strong> ${escapeHtml(r.modelName)} <strong>"${escapeHtml(r.name)}"</strong> at <strong>${escapeHtml(park.name)}</strong> completed its first lifecycle and achieved permanent Cult Classic status (+20% score)!`);
              }
            }
            if (player.isAI) {
              const isFirst = (r.refurbCount || 0) === 0, refCost = r.totalInvestment * (isFirst ? 0.5 : 1.0);
              if (player.cash >= refCost && (isFirst || r.cultClassic)) {
                player.cash -= refCost; r.age = 0; r.refurbCount = (r.refurbCount || 0) + 1; r.immunityTurns = 3;
              } else plot.rides.splice(i, 1);
            } else r.pendingEolDecision = true;
          }
        }
      }
    }
  }
  const nextYear = gameState.year + 1;
  if (nextYear === 15) addNewsHeadline("era", "🚀 <strong>YEAR 15 — MODERN ERA UNLOCKED!</strong>");
  if (nextYear === 30) addNewsHeadline("era", "⚡ <strong>YEAR 30 — ADVANCED ERA UNLOCKED!</strong>");
  attendanceRows.forEach((row, index) => { row.newTreasury = gameState.players[index].cash; });
  gameState.lastTurnReport = {
    page: 1,
    yearFinished: gameState.year,
    attendanceRows,
    newsHeadlines: [...gameState.currentTurnNews],
    awardsGiven,
    tourismClimate
  };
  gameState.currentTurnNews = [];
  openYearEndReportModal();
}

function findHighestScoringEntity(type) {
  let bestVal = 0, cands = [];
  for (const player of gameState.players) {
    for (const park of player.parks) {
      if (type === "best_park") {
        const s = calculateParkScoreSummary(park, player).finalScore;
        if (s > bestVal) { bestVal = s; cands = [{ player, park, score: s }]; }
        else if (s === bestVal && s > 0) cands.push({ player, park, score: s });
      } else if (type === "park_scenery") {
        const s = calculateParkScoreSummary(park, player).totalScenic;
        if (s > bestVal) { bestVal = s; cands = [{ player, park, score: s }]; }
        else if (s === bestVal && s > 0) cands.push({ player, park, score: s });
      } else {
        for (const plot of park.plots) {
          if (type === "themed_plot") {
            const s = calculatePlotScenicBreakdown(plot, player).totalPlotScenic;
            if (s > bestVal) { bestVal = s; cands = [{ player, park, plot, score: s }]; }
            else if (s === bestVal && s > 0) cands.push({ player, park, plot, score: s });
          } else {
            for (const r of plot.rides) {
              if (!isRideOperational(r) || r.category !== "coaster") continue;
              if ((type === "steel_coaster" && r.track === "steel") || (type === "wood_coaster" && r.track === "wood")) {
                const s = calculateRideTotalScore(r, player);
                if (s > bestVal) { bestVal = s; cands = [{ player, park, ride: r, score: s }]; }
                else if (s === bestVal && s > 0) cands.push({ player, park, ride: r, score: s });
              }
            }
          }
        }
      }
    }
  }
  return cands.length ? cands[Math.floor(Math.random() * cands.length)] : null;
}

/* --- 10. 4-PAGE REPORT & UTILITIES --- */

function ordinalSuffix(i) {
  const j = i % 10, k = i % 100;
  return (j === 1 && k !== 11) ? i + "st" : ((j === 2 && k !== 12) ? i + "nd" : ((j === 3 && k !== 13) ? i + "rd" : i + "th"));
}

function generateRideAdditionHeadline(ceoName, parkName, plotName, rideName, modelName, plotRideCount, smoothTier) {
  let b = `📰 <strong>${escapeHtml(parkName)}</strong> added a brand new ${escapeHtml(modelName)}, called <strong>"${escapeHtml(rideName)}"</strong>! This is the ${ordinalSuffix(plotRideCount)} addition in the <em>${escapeHtml(plotName)}</em> area of the park.`;
  if (smoothTier) b += ` 🗣️ <em>"Fans say the ride is <strong>${smoothTier}</strong>!"</em>`;
  return b;
}

function addNewsHeadline(type, htmlText) { gameState.currentTurnNews.push({ type, htmlText }); }
function addLog(msg) { gameState.logs.unshift(`[Yr ${gameState.year}] ${msg}`); if (gameState.logs.length > 80) gameState.logs.pop(); }

function openYearEndReportModal() {
  gameState.lastTurnReport.page = 1;
  renderReportPage1(); renderReportPage2(); renderReportPage3(); renderReportPage4();
  updateReportPageVisibility();
  document.getElementById("yearEndModal").classList.add("active");
}

function stepReportPage(delta) {
  const next = gameState.lastTurnReport.page + delta;
  if (next >= 1 && next <= 4) {
    gameState.lastTurnReport.page = next;
    if (next === 4) renderReportPage4();
    updateReportPageVisibility();
  } else if (next > 4) finalizeYearAndStartNextTurn();
}

function updateReportPageVisibility() {
  const p = gameState.lastTurnReport.page;
  document.getElementById("yearEndModalTitle").textContent = `📊 End of Year ${gameState.lastTurnReport.yearFinished} Report`;
  document.getElementById("yearEndStepIndicator").textContent = `Page ${p} of 4`;
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`reportTabBtn${i}`).classList.toggle("active", p === i);
    document.getElementById(`reportPage${i}`).style.display = p === i ? "block" : "none";
  }
  document.getElementById("btnReportPrev").style.display = p > 1 ? "inline-flex" : "none";
  const nextBtn = document.getElementById("btnReportNext");
  const labels = ["", "Next Page: News Wire ➔", "Next Page: Awards & Records ➔", "Next Page: Maintenance & Safety ➔", `Start Year ${gameState.year + 1} ➔`];
  nextBtn.textContent = labels[p];
  nextBtn.className = p === 4 ? "btn-primary" : "btn-gold";
}

function renderReportPage1() {
  const { attendanceRows, tourismClimate } = gameState.lastTurnReport;
  const money = value => `${value >= 0 ? "+" : "-"}$${Math.abs(value).toFixed(2)}M`;
  const climateBadge = document.getElementById("globalTourismBadge");
  if (tourismClimate) {
    climateBadge.innerHTML = `<span class="badge ${tourismClimate.badgeClass}">${tourismClimate.label} (${tourismClimate.mult.toFixed(2)}x)</span>`;
  } else {
    climateBadge.textContent = "";
  }
  document.getElementById("reportPage1").innerHTML = `<h4 style="margin-bottom:.55rem;color:var(--accent-teal);">📈 Chain-Wide Yearly Attendance & Revenue</h4>
    <div style="font-size:.72rem;color:var(--text-muted);margin-bottom:.45rem;">F&amp;B sales, cost of goods, and kitchen operating expenses are itemized for the season.</div>
    <table><thead><tr><th>CEO &amp; Chain</th><th>Parks</th><th>Yearly Attendance</th><th>Gate Revenue</th><th>F&amp;B Sales</th><th>F&amp;B COGS &amp; OpEx</th><th>Net Season Profit</th><th>Updated Treasury</th></tr></thead>
    <tbody>${attendanceRows.map(row => `<tr>
      <td><strong>${escapeHtml(row.playerName)}</strong>${row.hadAccidentInChain ? '<span class="badge badge-red" style="margin-left:6px;">0.7x Accident</span>' : ''}</td>
      <td>${row.parksCount}</td>
      <td style="color:var(--accent-teal);font-weight:700;">${row.attendance.toLocaleString()}</td>
      <td>${money(row.gateRevenue)}</td>
      <td style="color:var(--accent-green);">${money(row.foodAndBeverageGross)}</td>
      <td style="color:var(--accent-red);">-${Math.abs(row.foodAndBeverageCogs).toFixed(2)}M</td>
      <td style="color:${row.revenue >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'};font-weight:700;">${money(row.revenue)}</td>
      <td>$${row.newTreasury.toFixed(2)}M</td>
    </tr>`).join("")}</tbody></table>`;
}

function renderReportPage2() {
  const { newsHeadlines, yearFinished } = gameState.lastTurnReport;
  document.getElementById("reportPage2").innerHTML = `<h4 style="margin-bottom:.65rem;color:var(--accent-gold);">🗞️ Coaster Chronicle — Year ${yearFinished} News Wire</h4>${(!newsHeadlines || !newsHeadlines.length) ? '<div class="card" style="color:var(--text-muted);">A quiet year across the industry.</div>' : newsHeadlines.map(item => `<div class="news-card ${item.type}"><div style="font-size:.84rem;line-height:1.42;">${item.htmlText}</div></div>`).join("")}`;
}

function renderReportPage3() {
  const { awardsGiven, yearFinished } = gameState.lastTurnReport;
  let h = `<h4 style="margin-bottom:.55rem;color:var(--accent-gold);">🏅 Annual Golden Ticket Awards</h4>`;
  if (yearFinished <= 5) h += `<div class="card" style="color:var(--text-muted);">Awards ceremonies begin after Year 5.</div>`;
  else if (!awardsGiven.length) h += `<div class="card" style="color:var(--text-muted);">No eligible winners this season.</div>`;
  else h += `<table style="margin-bottom:1rem;"><thead><tr><th>Award</th><th>Winner</th><th>Chain</th><th>Score</th><th>Prize</th></tr></thead><tbody>${awardsGiven.map(a => `<tr><td><strong>🏆 ${escapeHtml(a.title)}</strong></td><td>${escapeHtml(a.winner)}</td><td>${escapeHtml(a.ceo)}</td><td>${a.score}</td><td style="color:var(--accent-green);font-weight:700;">+$${a.cash.toFixed(2)}M</td></tr>`).join("")}</tbody></table>`;
  h += `<h4 style="margin-bottom:.55rem;color:var(--accent-teal);">🌍 Global World Record Holders (+${getRecordBonusValue()} pt each)</h4>${buildGlobalRecordsTableHTML()}`;
  document.getElementById("reportPage3").innerHTML = h;
}

function renderReportPage4() {
  const el = document.getElementById("reportPage4");
  const humanPlayers = gameState.players.filter(p => !p.isAI);
  let html = `<p style="font-size:.75rem;color:var(--text-muted);margin-bottom:.75rem;">1st Lifecycle Refurbishment costs <strong>50%</strong>; subsequent refurbishments cost <strong>100%</strong>. Any completed service grants <strong>3-Turn Immunity (🛡️)</strong>!</p>`;
  for (const player of humanPlayers) {
    let itemsHtml = "";
    const maintMult = getPlayerMaintAndRepairMultiplier(player);
    for (const park of player.parks) {
      for (const plot of park.plots) {
        for (const r of plot.rides) {
          if (r.pendingEolDecision) {
            const isFirst = ((r.refurbCount || 0) === 0), refCost = +(r.totalInvestment * (isFirst ? 0.50 : 1.00)).toFixed(2);
            itemsHtml += `<div class="card" style="border-color:var(--accent-gold);display:flex;justify-content:space-between;align-items:center;"><div><span class="badge badge-gold">⏳ Lifecycle #${(r.refurbCount || 0) + 1}</span> ${r.cultClassic ? '<span class="badge badge-gold">🌟 Cult Classic</span>' : ''} <strong>${escapeHtml(r.name)}</strong> (${escapeHtml(park.name)})</div><div style="display:flex;gap:.35rem;"><button class="btn-gold btn-sm" ${player.cash < refCost ? 'disabled' : ''} onclick="refurbishEndOfLifeRide('${park.id}','${plot.id}','${r.id}')">🔄 Refurb ($${refCost}M)</button><button class="btn-danger btn-sm" onclick="letEndOfLifeRideDemolish('${park.id}','${plot.id}','${r.id}')">🗑️ Demolish</button></div></div>`;
          }
          if (r.status === "needs_maintenance") {
            const c = +(r.totalInvestment * 0.20 * maintMult).toFixed(2);
            itemsHtml += `<div class="card" style="border-color:var(--accent-teal);display:flex;justify-content:space-between;align-items:center;"><div><span class="badge badge-teal">🔧 Maintenance</span> <strong>${escapeHtml(r.name)}</strong> (${escapeHtml(park.name)})</div><button class="btn-primary btn-sm" ${player.cash < c ? 'disabled' : ''} onclick="payRideMaintenance('${park.id}','${plot.id}','${r.id}',true)">Pay $${c}M</button></div>`;
          }
          if (r.status === "needs_repair") {
            const c = +(r.totalInvestment * 0.40 * maintMult).toFixed(2);
            itemsHtml += `<div class="card" style="border-color:var(--accent-red);display:flex;justify-content:space-between;align-items:center;"><div><span class="badge badge-red">🛠️ Repair</span> <strong>${escapeHtml(r.name)}</strong> (${escapeHtml(park.name)})</div><button class="btn-gold btn-sm" ${player.cash < c ? 'disabled' : ''} onclick="payRideRepair('${park.id}','${plot.id}','${r.id}',true)">Fix $${c}M</button></div>`;
          }
          if (r.status === "needs_inspection") {
            itemsHtml += `<div class="card" style="border-color:var(--accent-red);display:flex;justify-content:space-between;align-items:center;"><div><span class="badge badge-red">🕵️ Inspection</span> <strong>${escapeHtml(r.name)}</strong> (${escapeHtml(park.name)})</div><button class="btn-gold btn-sm" ${player.cash < 0.5 ? 'disabled' : ''} onclick="payRideInspection('${park.id}','${plot.id}','${r.id}',true)">Inspect $0.50M</button></div>`;
          }
        }
      }
    }
    html += `<div style="margin-bottom:.8rem;"><div style="display:flex;justify-content:space-between;margin-bottom:.28rem;"><strong>${escapeHtml(player.ceoName)} (${escapeHtml(player.chainName)})</strong><span style="color:var(--accent-green);font-weight:700;">Cash: $${player.cash.toFixed(2)}M</span></div>${itemsHtml || '<div class="card" style="color:var(--accent-green);">✅ All attractions operating safely!</div>'}</div>`;
  }
  el.innerHTML = html;
}

function finalizeYearAndStartNextTurn() {
  for (const p of gameState.players) {
    for (const pk of p.parks) {
      for (const pl of pk.plots) {
        for (let i = pl.rides.length - 1; i >= 0; i--) if (pl.rides[i].pendingEolDecision) pl.rides.splice(i, 1);
      }
    }
  }
  closeModal("yearEndModal");
  const winners = gameState.players.filter(p => p.totalAttendance >= gameState.winAttendance);
  if (winners.length > 0 || gameState.year >= gameState.maxYears) {
    const top = [...gameState.players].sort((a, b) => b.totalAttendance - a.totalAttendance)[0];
    gameState.gameOver = true;
    alert(`🏆 VICTORY! ${top.ceoName} (${top.chainName}) wins in Year ${gameState.year} with ${top.totalAttendance.toLocaleString()} guests!`);
    renderAll();
    return;
  }
  gameState.year++;
  gameState.activePlayerIdx = 0;
  gameState.inspectedPlayerIdx = 0;
  gameState.selectedParkId = gameState.players[0].parks[0].id;
  gameState.selectedHexKey = gameState.players[0].parks[0].hexKey;
  renderAll();
}

function buildGlobalRecordsTableHTML() {
  recalculateGlobalRecords();
  let rows = "";
  for (const k in gameState.records) {
    const rec = gameState.records[k];
    let holders = "—";
    if (rec.val > 0 && rec.holders.length) {
      holders = rec.holders.map(h => h.type === "ride" ? `${escapeHtml(h.ride.name)} (${escapeHtml(h.park.name)})` : `${escapeHtml(h.park.name)}`).join(", ");
    }
    rows += `<tr><td><strong>${escapeHtml(rec.label)}</strong></td><td style="color:var(--accent-gold);font-weight:700;">${rec.val > 0 ? `${rec.val} ${rec.unit}` : 'None'}</td><td>${holders}</td></tr>`;
  }
  return `<table><thead><tr><th>Record</th><th>Value</th><th>Holder(s)</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function openLegendDetailsModal() {
  const p = gameState.players[gameState.inspectedPlayerIdx];
  document.getElementById("recordsModalTitle").textContent = `👑 Legend Profile — ${p.ceoName}`;
  document.getElementById("recordsModalBody").innerHTML = `<div class="card"><h4 style="color:var(--accent-gold);margin-bottom:.3rem;">${escapeHtml(p.ceoName)} • ${escapeHtml(p.chainName)}</h4><p style="font-size:.88rem;line-height:1.45;">${escapeHtml(p.legend.desc)}</p></div>`;
  document.getElementById("recordsModal").classList.add("active");
}

function openLegendInfoModal(playerIdx = gameState.activePlayerIdx) {
  const player = gameState.players[playerIdx];
  if (!player) return;
  const legend = player.legend;
  const title = legend.title || (legend.isCustom ? "Independent Theme Park Operator" : "Theme Park Leader");
  const perks = legend.isCustom
    ? (legend.traits || []).map(id =>
      (CUSTOM_POS_TRAITS.find(trait => trait.id === id) ||
        CUSTOM_NEG_TRAITS.find(trait => trait.id === id))?.label
    ).filter(Boolean)
    : [legend.desc];
  const flagship = [...player.parks].sort((a, b) => {
    const attendanceDifference = (b.lastAttendance || 0) - (a.lastAttendance || 0);
    if (attendanceDifference) return attendanceDifference;
    return calculateParkScoreSummary(b, player).finalScore -
      calculateParkScoreSummary(a, player).finalScore;
  })[0];
  const attendance = player.totalAttendance || 0;
  const body = document.getElementById("legendInfoModalBody");
  document.getElementById("legendInfoModalTitle").textContent = `👑 Legend Dossier — ${legend.name}`;
  body.innerHTML = `
    <div class="legend-dossier-layout">
      <div class="legend-dossier-portrait">
        ${getLegendPortraitHTML(legend, "legend-portrait-img")}
      </div>
      <div class="legend-dossier-copy">
        <h3>${escapeHtml(player.ceoName)} · ${escapeHtml(player.chainName)}</h3>
        <div class="legend-dossier-title">${escapeHtml(title)}</div>
        <h4 style="color:var(--accent-gold);margin-bottom:.25rem;">Active Legend Modifiers &amp; Perks</h4>
        <div class="legend-dossier-perks">${perks.length
          ? perks.map(perk => `<div>• ${escapeHtml(perk)}</div>`).join("")
          : "<div>No additional legend modifiers.</div>"}</div>
        <h4 style="color:var(--accent-gold);margin-bottom:.4rem;">Empire Snapshot</h4>
        <div class="legend-empire-stats">
          <div class="legend-empire-stat"><span>Parks Owned</span><strong>${player.parks.length}</strong></div>
          <div class="legend-empire-stat"><span>Chain Attendance</span><strong>${attendance.toLocaleString()}</strong></div>
          <div class="legend-empire-stat"><span>Current Treasury</span><strong class="money-value">$${player.cash.toFixed(2)}M</strong></div>
          <div class="legend-empire-stat"><span>Flagship Park</span><strong>${escapeHtml(flagship?.name || "—")}</strong></div>
        </div>
      </div>
    </div>`;
  document.getElementById("legendInfoModal").classList.add("active");
}

function openRenameModal(type, parkId, plotId = null, rideId = null) {
  const park = gameState.players[gameState.activePlayerIdx].parks.find(pk => pk.id === parkId);
  if (!park) return;
  gameState.renameContext = { type, parkId, plotId, rideId };
  const inputEl = document.getElementById("renameModalInput");
  inputEl.value = type === "park" ? park.name : (type === "plot" ? park.plots.find(pl => pl.id === plotId).name : park.plots.find(pl => pl.id === plotId).rides.find(r => r.id === rideId).name);
  document.getElementById("renameModal").classList.add("active");
  setTimeout(() => { inputEl.focus(); inputEl.select(); }, 50);
}

function randomizeRenameModalInput() {
  const { type } = gameState.renameContext;
  document.getElementById("renameModalInput").value = type === "park" ? generateRandomParkName() : (type === "plot" ? generateRandomZoneName() : generateRandomRideName());
}

function saveRenameModal() {
  const val = document.getElementById("renameModalInput").value.trim();
  if (!val) return;
  const { type, parkId, plotId, rideId } = gameState.renameContext;
  const park = gameState.players[gameState.activePlayerIdx].parks.find(pk => pk.id === parkId);
  if (type === "park") park.name = val;
  else if (type === "plot") park.plots.find(pl => pl.id === plotId).name = val;
  else park.plots.find(pl => pl.id === plotId).rides.find(r => r.id === rideId).name = val;
  closeModal("renameModal");
  renderAll();
}

function generateRandomParkName() { return RANDOM_PARK_NAMES[Math.floor(Math.random() * RANDOM_PARK_NAMES.length)]; }
function generateRandomZoneName() { return RANDOM_ZONE_NAMES[Math.floor(Math.random() * RANDOM_ZONE_NAMES.length)]; }
function generateRandomRideName() { return RANDOM_RIDE_NAMES[Math.floor(Math.random() * RANDOM_RIDE_NAMES.length)]; }
function rollRandomAttractionName() { document.getElementById("customRideName").value = generateRandomRideName(); }
function closeModal(id) { document.getElementById(id).classList.remove("active"); }

function escapeHtml(str) {
  return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

window.addEventListener("DOMContentLoaded", () => {
  initMapCanvasEvents();
  buildUSHexGrid();
  openSetupModal();
});