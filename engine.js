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
  zoneEditor: { active: false, themeId: "classic", selectedKeys: new Set(), editingZoneId: null },
  unlockedRides: new Set(STARTING_UNLOCKED_IDS),
  records: {},
  logs: [],
  currentTurnNews: [],
  pendingAdvisorReports: [],
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

const RIDE_REFURB_FRACTION = ECONOMIC_BALANCING_RULES.refurbishCostRate;

const campusHexNodes = new Map();
let campusLayerParkId = null;
let campusSelectedHexNode = null;
let campusLayerPaused = true;
let campusAnimationFrame = null;

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

function getHexClusterBonusInfo(hex, viewingPlayer = null) {
  if (!hex) return { count: 0, bonus: 0 };
  if (!viewingPlayer && hex.ownerId) {
    viewingPlayer = gameState.players.find(player => player.id === hex.ownerId) || null;
  }
  if (!viewingPlayer) viewingPlayer = gameState.players[gameState.activePlayerIdx] || null;
  if (!viewingPlayer || viewingPlayer.isAI) return { count: 0, bonus: 0 };

  let count = 0;
  for (const park of viewingPlayer.parks) {
    const parkHex = gameState.hexByKey.get(park.hexKey);
    if (!parkHex || parkHex.key === hex.key) continue;
    const dist = hexDistance(hex, parkHex);
    if (dist >= 1 && dist <= 3) count++;
  }
  return { count, bonus: +(count * 0.10).toFixed(2) };
}

function getOpponentCannibalizationPenalty(q, r, viewingOrOwningPlayerId) {
  let penalty = 0;
  for (const player of gameState.players) {
    if (player.id === viewingOrOwningPlayerId) continue;
    for (const park of player.parks) {
      const rivalHex = gameState.hexByKey.get(park.hexKey);
      if (!rivalHex) continue;
      const distance = hexDistance({ q, r }, rivalHex);
      if (distance === 1) penalty += 0.20;
      else if (distance === 2) penalty += 0.10;
    }
  }
  return +penalty.toFixed(2);
}

function getOpponentCannibalizationSummary(hex, viewingOrOwningPlayerId) {
  const summary = { adjacent: 0, nearby: 0 };
  if (!hex) return summary;
  for (const player of gameState.players) {
    if (player.id === viewingOrOwningPlayerId) continue;
    for (const park of player.parks) {
      const rivalHex = gameState.hexByKey.get(park.hexKey);
      if (!rivalHex) continue;
      const distance = hexDistance(hex, rivalHex);
      if (distance === 1) summary.adjacent++;
      else if (distance === 2) summary.nearby++;
    }
  }
  return summary;
}

function getHexMarketDetails(hex, viewingPlayer = null) {
  if (!hex) return { base: 1, cluster: { count: 0, bonus: 0 }, rivalPenalty: 0, total: 1 };
  if (!viewingPlayer && hex.ownerId) {
    viewingPlayer = gameState.players.find(player => player.id === hex.ownerId) || null;
  }
  if (!viewingPlayer) viewingPlayer = gameState.players[gameState.activePlayerIdx] || null;
  const base = HEX_TRAITS[hex.traitId].attMult;
  const cluster = getHexClusterBonusInfo(hex, viewingPlayer);
  const rivalPenalty = getOpponentCannibalizationPenalty(hex.q, hex.r, viewingPlayer?.id);
  const total = Math.max(0.30, base + cluster.bonus - rivalPenalty);
  return { base, cluster, rivalPenalty, total: +total.toFixed(2) };
}

function getTotalHexAttendanceMultiplier(hex, viewingPlayer = null) {
  if (!hex) return 1.0;
  return getHexMarketDetails(hex, viewingPlayer).total;
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
  const expansionMultiplier = player.legend.id === "walter_knott" ? 1.15 : 1;
  return {
    smallCost:  +(10 * combined).toFixed(2),
    mediumCost: +(25 * combined).toFixed(2),
    largeCost:  +(40 * combined).toFixed(2),
    smallExp:   +(PARK_SIZE_SPECS.small.baseClearCost * trait.priceMult * expansionMultiplier).toFixed(2),
    mediumExp:  +(PARK_SIZE_SPECS.medium.baseClearCost * trait.priceMult * expansionMultiplier).toFixed(2),
    largeExp:   +(PARK_SIZE_SPECS.large.baseClearCost * trait.priceMult * expansionMultiplier).toFixed(2)
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

function getParkExpansionCost(park) {
  return +park.expansionCost.toFixed(2);
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

function getTileSceneryUpgradeCost(player, currentLevel, nextTier) {
  if (player.legend.id === "walter_knott" && currentLevel === 0 && nextTier.level === 1) return 0;
  return (currentLevel === 0
    ? nextTier.cost * getPlayerPlotSceneryMultiplier(player, false)
    : nextTier.upgradeCost * getPlayerPlotSceneryMultiplier(player, true));
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
  if (player.legend.id === "anton_pieck") {
    mult *= 1.05;
    notes.push("Anton Pieck +5% Attraction Cost");
  }
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
  draftState.customPortrait = PREMADE_LEGENDS[0].img;
  document.getElementById("setupStartingTheme").value = "classic";
  draftState.tempPosTraits = new Set();
  draftState.tempNegTraits = new Set();
  document.getElementById("customLegendBuilderName").value = "Zachary Culp";
  document.getElementById("btnConfirmDraftPlayer").disabled = false;
  document.getElementById("setupStepConfig").hidden = false;
  document.getElementById("setupStepLegend").hidden = true;
  toggleSetupModeUI();
  document.getElementById("setupChainName").value = PREMADE_LEGENDS[0].defaultChain;
  document.getElementById("setupParkName").value = PREMADE_LEGENDS[0].defaultPark;
  renderLegendSelection();
  document.getElementById("setupModal").classList.add("active");
}

function showLegendSetupStep() {
  document.getElementById("setupStepConfig").hidden = true;
  document.getElementById("setupStepLegend").hidden = false;
  updateDraftHeadingText();
  renderLegendSelection();
}

function showOptionsSetupStep() {
  document.getElementById("setupStepLegend").hidden = true;
  document.getElementById("setupStepConfig").hidden = false;
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
    ? "Select Your Legend"
    : `Player ${draftState.currentHumanIdx + 1} of ${totalHumans}: Select a Legend`;
  document.getElementById("btnConfirmDraftPlayer").textContent = (draftState.currentHumanIdx + 1 < totalHumans)
    ? `Select Legend & Continue to Player ${draftState.currentHumanIdx + 2} →`
    : "Select Legend & Start Game";
}

function getLegendPortraitHTML(legend, cssClass) {
  const imagePath = legend.img || `Images/${legend.id}.jpg`;
  const fallbackPath = `Images/${legend.id}.png`;
  return `<img class="${escapeHtml(cssClass)}" src="${escapeHtml(imagePath)}" alt="${escapeHtml(legend.name)} portrait" onerror="this.onerror=function(){this.style.display='none'};this.src='${escapeHtml(fallbackPath)}'">`;
}

function renderLegendSelection() {
  const roster = document.getElementById("legendRosterList");
  if (!roster) return;
  roster.innerHTML = "";
  for (const legend of PREMADE_LEGENDS) {
    const taken = draftState.takenLegendIds.has(legend.id);
    const active = draftState.selectedLegendId === legend.id;
    const row = document.createElement("button");
    row.type = "button";
    row.className = `legend-roster-item${active ? " active" : ""}`;
    row.disabled = taken;
    row.setAttribute("role", "option");
    row.setAttribute("aria-selected", String(active));
    row.innerHTML = `${getLegendPortraitHTML(legend, "legend-roster-thumb")}<span class="legend-roster-copy"><strong>${escapeHtml(legend.name)}</strong><small>${escapeHtml(legend.title)}</small></span>${taken ? '<span class="badge badge-red">Drafted</span>' : ""}`;
    row.onclick = () => selectPremadeLegend(legend.id);
    roster.appendChild(row);
  }
  const customRow = document.createElement("button");
  customRow.type = "button";
  customRow.className = `legend-roster-item${draftState.selectedLegendId === "custom" ? " active" : ""}`;
  customRow.setAttribute("role", "option");
  customRow.setAttribute("aria-selected", String(draftState.selectedLegendId === "custom"));
  customRow.innerHTML = `<span class="legend-roster-thumb custom-legend-thumb">✨</span><span class="legend-roster-copy"><strong>Custom Legend</strong><small>Build a leader with your own perks</small></span>`;
  customRow.onclick = selectCustomLegend;
  roster.appendChild(customRow);
  renderLegendDetails();
}

function renderLegendDetails() {
  const isCustom = draftState.selectedLegendId === "custom";
  const builder = document.getElementById("customLegendBuilder");
  const perks = document.getElementById("legendDetailPerks");
  builder.style.display = isCustom ? "block" : "none";
  if (isCustom) {
    renderCustomLegendBuilder();
    return;
  }
  const legend = PREMADE_LEGENDS.find(item => item.id === draftState.selectedLegendId);
  if (!legend) return;
  const parts = legend.desc.split(/(?<=[.!?])\s+/);
  document.getElementById("legendDetailHero").innerHTML = `
    <div class="legend-detail-portrait-wrap">${getLegendPortraitHTML(legend, "legend-detail-portrait")}</div>
    <div class="legend-detail-copy">
      <span class="badge badge-gold">PARK LEADER</span>
      <h2>${escapeHtml(legend.name)}</h2>
      <div class="legend-detail-title">${escapeHtml(legend.title)}</div>
      <p class="legend-detail-description">${escapeHtml(legend.desc)}</p>
    </div>`;
  perks.innerHTML = parts.map(part => `<span class="legend-perk-badge">${escapeHtml(part)}</span>`).join("");
}

function selectCustomLegend() {
  const alreadyCustom = draftState.selectedLegendId === "custom";
  draftState.selectedLegendId = "custom";
  draftState.customPortrait = draftState.customPortrait || PREMADE_LEGENDS[0].img;
  draftState.tempPosTraits = draftState.tempPosTraits || new Set();
  draftState.tempNegTraits = draftState.tempNegTraits || new Set();
  if (!alreadyCustom) {
    document.getElementById("setupChainName").value = "Independent Attractions";
    document.getElementById("setupParkName").value = "Wonderland Park";
  }
  if (!draftState.customLegendData) {
    const portraitSelect = document.getElementById("customLegendPortrait");
    if (portraitSelect && portraitSelect.value) draftState.customPortrait = portraitSelect.value;
  }
  renderLegendSelection();
}

function renderCustomLegendBuilder() {
  const nameInput = document.getElementById("customLegendBuilderName");
  const portraitSelect = document.getElementById("customLegendPortrait");
  if (!portraitSelect.options.length) {
    portraitSelect.innerHTML = PREMADE_LEGENDS.map(legend =>
      `<option value="${escapeHtml(legend.img)}">${escapeHtml(legend.name)} portrait</option>`).join("");
  }
  nameInput.value = draftState.customLegendData?.name || nameInput.value || "Zachary Culp";
  portraitSelect.value = draftState.customLegendData?.img || draftState.customPortrait || PREMADE_LEGENDS[0].img;
  renderCustomBuilderTraits();
  updateCustomLegendDraft();
}

function renderCustomBuilderTraits() {
  const setupDropdowns = (traits, selected, firstId, secondId, type) => {
    const first = document.getElementById(firstId);
    const second = document.getElementById(secondId);
    const options = `<option value="">Choose a perk…</option>${traits.map(trait =>
      `<option value="${escapeHtml(trait.id)}">${escapeHtml(trait.label)}</option>`).join("")}`;
    if (!first.options.length) {
      first.innerHTML = options;
      second.innerHTML = options;
      first.onchange = () => updateCustomTraitSelections(type);
      second.onchange = () => updateCustomTraitSelections(type);
    }
    const values = [...selected];
    first.value = values[0] || "";
    second.value = values[1] || "";
  };
  setupDropdowns(CUSTOM_POS_TRAITS, draftState.tempPosTraits, "builderPosTraitA", "builderPosTraitB", "positive");
  setupDropdowns(CUSTOM_NEG_TRAITS, draftState.tempNegTraits, "builderNegTraitA", "builderNegTraitB", "negative");
  document.getElementById("builderPosCount").textContent = `${draftState.tempPosTraits.size}/2`;
  document.getElementById("builderNegCount").textContent = `${draftState.tempNegTraits.size}/2`;
}

function updateCustomTraitSelections(type) {
  const isPositive = type === "positive";
  const selected = isPositive ? draftState.tempPosTraits : draftState.tempNegTraits;
  const first = document.getElementById(isPositive ? "builderPosTraitA" : "builderNegTraitA");
  const second = document.getElementById(isPositive ? "builderPosTraitB" : "builderNegTraitB");
  if (first.value && first.value === second.value) second.value = "";
  selected.clear();
  if (first.value) selected.add(first.value);
  if (second.value) selected.add(second.value);
  document.getElementById(isPositive ? "builderPosCount" : "builderNegCount").textContent = `${selected.size}/2`;
  updateCustomLegendDraft();
}

function updateCustomLegendDraft() {
  const name = document.getElementById("customLegendBuilderName").value.trim() || "Custom CEO";
  const img = document.getElementById("customLegendPortrait").value || PREMADE_LEGENDS[0].img;
  draftState.customPortrait = img;
  const traits = [...draftState.tempPosTraits, ...draftState.tempNegTraits];
  const labels = traits.map(id => (CUSTOM_POS_TRAITS.find(item => item.id === id) || CUSTOM_NEG_TRAITS.find(item => item.id === id)).label);
  draftState.customLegendData = {
    id: draftState.customLegendData?.id || nextUid("custom_leg"), name, title: "Independent Theme Park Operator", img,
    isCustom: true, traits, desc: labels.length ? labels.join(" • ") : "Choose two positive perks and two trade-offs."
  };
  document.getElementById("legendDetailHero").innerHTML = `
    <div class="legend-detail-portrait-wrap">${getLegendPortraitHTML(draftState.customLegendData, "legend-detail-portrait")}</div>
    <div class="legend-detail-copy">
      <span class="badge badge-purple">CUSTOM LEADER</span>
      <h2>${escapeHtml(name)}</h2>
      <div class="legend-detail-title">Independent Theme Park Operator</div>
      <p class="legend-detail-description">${escapeHtml(draftState.customLegendData.desc)}</p>
    </div>`;
  document.getElementById("legendDetailPerks").innerHTML = "";
  document.getElementById("btnConfirmDraftPlayer").disabled =
    draftState.tempPosTraits.size !== 2 || draftState.tempNegTraits.size !== 2;
}

function selectPremadeLegend(legendId) {
  if (draftState.takenLegendIds.has(legendId)) return;
  draftState.customLegendData = null;
  draftState.selectedLegendId = legendId;
  const leg = PREMADE_LEGENDS.find(l => l.id === legendId);
  document.getElementById("setupChainName").value = leg.defaultChain;
  document.getElementById("setupParkName").value = leg.defaultPark;
  document.getElementById("btnConfirmDraftPlayer").disabled = false;
  renderLegendSelection();
}

function confirmPlayerSetupStep() {
  updateDraftHeadingText();
  if (draftState.selectedLegendId === "custom" &&
    (draftState.tempPosTraits.size !== 2 || draftState.tempNegTraits.size !== 2)) return;
  const legendObj = draftState.selectedLegendId === "custom"
    ? { ...draftState.customLegendData }
    : { ...PREMADE_LEGENDS.find(l => l.id === draftState.selectedLegendId), isCustom: false, traits: [] };
  const ceoName = legendObj.name || "CEO";
  const chainName = document.getElementById("setupChainName").value.trim() || "ThrillCorp Chain";
  const parkName = document.getElementById("setupParkName").value.trim() || "Adventure Park";
  if (!legendObj.isCustom) draftState.takenLegendIds.add(legendObj.id);
  const startingThemeId = document.getElementById("setupStartingTheme").value;
  draftState.draftedPlayers.push({ ceoName, chainName, parkName, legend: legendObj, startingThemeId });
  draftState.currentHumanIdx++;
  if (draftState.currentHumanIdx < draftState.humanTargetCount) {
    draftState.selectedLegendId = "walt_disney";
    draftState.customLegendData = null;
    const nextAvail = PREMADE_LEGENDS.find(l => !draftState.takenLegendIds.has(l.id));
    if (nextAvail) {
      draftState.selectedLegendId = nextAvail.id;
      document.getElementById("setupChainName").value = nextAvail.defaultChain;
      document.getElementById("setupParkName").value = nextAvail.defaultPark;
    } else {
      draftState.selectedLegendId = "custom";
    }
    updateDraftHeadingText();
    document.getElementById("btnConfirmDraftPlayer").disabled = draftState.selectedLegendId === "custom";
    renderLegendSelection();
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

function areCampusTilesAdjacent(t1, t2) {
  if (!t1 || !t2) return false;
  return hexDistance(t1, t2) === 1;
}

function areCampusTilesDiagonalNeighbors(t1, t2) {
  if (!t1 || !t2) return false;
  const dq = t2.q - t1.q, dr = t2.r - t1.r;
  return (dq === 1 && dr === 0) || (dq === -1 && dr === 0) ||
    (dq === 1 && dr === -1) || (dq === -1 && dr === 1);
}

function getMultiTileRideOrientation(firstTile, secondTile) {
  const dx = secondTile.px - firstTile.px;
  const dy = secondTile.py - firstTile.py;
  if (Math.abs(dx) > Math.abs(dy) * 1.5) return "side";
  return dx * dy >= 0 ? "NW-SE" : "NE-SW";
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

function createInitialParkForPlayer(parkName, legend, playerId, hexObj, themeId = "classic") {
  const parkId = nextUid("park");
  hexObj.parkId = parkId;
  hexObj.ownerId = playerId;

  const extraExp = legend.id === "roland_mack" ? 8 : 0;
  const { tiles, maxExpansions } = generate49HexCampusDiamond("starting", extraExp);

  const starterTheme = getLandTheme(themeId);
  const starterZone = {
    id: nextUid("zone"),
    name: `${starterTheme.name} Plaza`,
    themeId: starterTheme.id,
    color: starterTheme.borderColor
  };
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
      baseBuildCost: cost,
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
    setRideAge({ tiles }, fac, fac.age);
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
    expansionCost: 0.50 * (legend.id === "walter_knott" ? 1.15 : 1),
    eisnerDiscountRidesLeft: 0,
    lastAttendance: 0,
    lastRollLabel: "—",
    yearsSinceLastAddition: 0,
    additionThisYear: true,
    attractionAddedThisYear: false,
    newCoasterBuiltThisYear: false,
    ticketPrice: 45,
    fairTicketPrice: 25,
    lastFoodAndBeverageLedger: null,
    tiles,
    themeId: starterTheme.id,
    zones,
    rides,
    plots: []
  };
  addLegendFreeShow(parkObj, legend);
  syncParkPlotsMirror(parkObj);
  return parkObj;
}

function addLegendFreeShow(park, legend) {
  if (legend.id !== "george_milley") return false;
  const model = TRACKED_RIDE_CATALOG.find(item => item.id === "stage_show");
  if (!model || countParkModelOccurrences(park, model.id) >= 3) return false;
  const primaryTile = park.tiles.find(tile =>
    tile.state === "cleared" && !tile.isEntrance && !tile.rideId
  );
  if (!primaryTile) return false;
  const show = {
    id: nextUid("ride"),
    name: model.name,
    modelId: model.id,
    modelName: model.name,
    category: "tracked",
    subType: model.subType,
    era: model.era,
    primaryTileKey: primaryTile.key,
    secondaryTileKey: null,
    zoneId: primaryTile.zoneId,
    spaces: 1,
    themeLevel: 0,
    themedForZoneId: primaryTile.zoneId || "generic",
    totalInvestment: 0,
    baseBuildCost: model.cost,
    age: 0,
    refurbCount: 0,
    cultClassic: false,
    cultChecked: false,
    status: "open",
    immuneToIssues: true,
    immunityTurns: 0,
    recordTags: [],
    lifespan: model.lifespan,
    techPoints: model.points
  };
  primaryTile.rideId = show.id;
  secondTile.rideId = show.id;
  secondTile.isSecondaryHex = true;
  park.rides.push(show);
  setRideAge(park, show, 0);
  return true;
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
  gameState.pendingAdvisorReports = [];
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
      advisors: ADVISOR_CATALOG.map(advisor => ({
        ...advisor,
        hired: false,
        turnsRemaining: 0,
        lastReportYear: 0,
        latestReport: "Position Vacant — No Audit Conducted"
      })),
      parks: [createInitialParkForPlayer(dp.parkName, dp.legend, pid, sHex, dp.startingThemeId)]
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
        advisors: ADVISOR_CATALOG.map(advisor => ({
          ...advisor,
          hired: false,
          turnsRemaining: 0,
          lastReportYear: 0,
          latestReport: "Position Vacant — No Audit Conducted"
        })),
        parks: [createInitialParkForPlayer(leg.defaultPark, leg, pid, sHex, getPreferredLandThemeId(leg))]
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

function drawMapCanvas() {
  const canvas = document.getElementById("mapCanvas");
  if (!canvas) return;
  syncCampusLayerVisibility();
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

function getZoneForTile(park, tile) {
  if (!tile || !tile.zoneId) return null;
  return park.zones.find(z => z.id === tile.zoneId) || null;
}

function getLandTheme(themeId) {
  if (themeId == null) return LAND_THEMES[0];
  const theme = LAND_THEMES.find(item => item.id === themeId);
  if (!theme) throw new RangeError(`Unknown land theme: ${themeId}`);
  return theme;
}

function getPreferredLandThemeId(legend) {
  const preferences = {
    walt_disney: "classic",
    michael_eisner: "classic",
    jim_reid: "western",
    roland_mack: "space",
    hugo_herschend: "frontier",
    john_arie: "classic",
    angus_wynne: "western",
    anton_pieck: "medieval",
    milton_hershey: "classic",
    jay_stein: "space",
    mark_woodburry: "gothic",
    walter_knott: "frontier",
    george_milley: "medieval",
    dick_kinzel: "western"
  };
  return preferences[legend?.id] || "classic";
}

function getCampusRideSpriteSource(ride) {
  const sources = isCampusRideSpriteStatic(ride)
    ? [ride.staticSpriteUrl, ride.staticImageUrl, ride.spriteUrl, ride.animationUrl, ride.sprite]
    : [ride.animationUrl, ride.spriteUrl, ride.sprite];
  const source = sources
    .find(value => typeof value === "string" && value.length > 0);
  return source || null;
}

function isCampusRideSpriteStatic(ride) {
  return ride.category === "coaster" || ["rapids", "log_flume"].includes(ride.modelId);
}

function createCampusRideSprite(ride) {
  const source = getCampusRideSpriteSource(ride);
  if (source && /\.(webm|mp4)(?:[?#].*)?$/i.test(source)) {
    const video = document.createElement("video");
    video.src = source;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("aria-label", ride.name || "Ride");
    return video;
  }
  if (source) {
    const image = document.createElement("img");
    image.src = source;
    image.alt = ride.name || "Ride";
    return image;
  }

  return null;
}

function updateCampusSpriteLayer(park) {
  const layer = document.getElementById("campusSpriteLayer");
  if (!layer) return;
  if (campusLayerParkId !== park.id) {
    layer.replaceChildren();
    campusHexNodes.clear();
    campusSelectedHexNode = null;
    campusLayerParkId = park.id;
  }

  const tileByKey = new Map(park.tiles.map(tile => [tile.key, tile]));
  const rideByTileKey = new Map();
  for (const ride of park.rides) rideByTileKey.set(ride.primaryTileKey, ride);

  for (const tile of park.tiles) {
    let node = campusHexNodes.get(tile.key);
    if (!node) {
      node = document.createElement("div");
      node.className = "campus-hex";
      node.dataset.tileKey = tile.key;
      node.style.left = `${tile.px - CAMPUS_HEX_R}px`;
      node.style.top = `${tile.py - CAMPUS_HEX_R * 0.58}px`;
      node.style.width = `${CAMPUS_HEX_R * 2}px`;
      node.style.height = `${CAMPUS_HEX_R * 1.16}px`;

      const spriteLayer = document.createElement("div");
      spriteLayer.className = "hex-ride-sprite";
      node.append(spriteLayer);
      const outline = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      outline.classList.add("campus-tile-outline");
      outline.setAttribute("viewBox", "0 0 100 67");
      outline.setAttribute("aria-hidden", "true");
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      polygon.setAttribute("points", "93,50 50,67 7,50 7,17 50,0 93,17");
      outline.appendChild(polygon);
      node.append(outline);
      layer.appendChild(node);
      campusHexNodes.set(tile.key, node);
    }

    const ride = rideByTileKey.get(tile.key);
    const brushSelected = gameState.zoneEditor.active &&
      gameState.zoneEditor.selectedKeys.has(tile.key);
    node.classList.toggle("brush-selected", brushSelected);
    const outline = node.querySelector(".campus-tile-outline");
    outline.style.setProperty(
      "--campus-tile-outline-color",
      brushSelected ? getLandTheme(gameState.zoneEditor.themeId).borderColor : "#f59e0b"
    );

    const spriteLayer = node.querySelector(".hex-ride-sprite");
    const source = ride ? getCampusRideSpriteSource(ride) : null;
    const spriteKey = source ? `${ride.id}:${source}` : "";
    spriteLayer.classList.toggle("static", !!ride && isCampusRideSpriteStatic(ride));
    if (spriteLayer.dataset.spriteKey !== spriteKey) {
      spriteLayer.replaceChildren();
      spriteLayer.dataset.spriteKey = spriteKey;
      if (ride && source) {
        const sprite = createCampusRideSprite(ride);
        const secondTile = ride.spaces === 2 ? tileByKey.get(ride.secondaryTileKey) : null;
        let offsetX = 0;
        let offsetY = 0;
        if (secondTile) {
          offsetX = (secondTile.px - tile.px) / 2;
          offsetY = (secondTile.py - tile.py) / 2;
          sprite.style.left = `calc(50% + ${offsetX}px)`;
          sprite.style.top = `calc(50% + ${offsetY}px)`;
        }
        spriteLayer.appendChild(sprite);
        if (sprite instanceof HTMLVideoElement) {
          if (campusLayerPaused || isCampusRideSpriteStatic(ride)) sprite.pause();
          else sprite.play().catch(error => console.warn("Unable to start campus ride video.", error));
        }
        const score = document.createElement("span");
        score.className = "hex-ride-score";
        if (secondTile) {
          score.style.left = `calc(50% + ${offsetX}px)`;
          score.style.top = `calc(50% + ${offsetY + CAMPUS_HEX_R * 0.67}px)`;
        }
        spriteLayer.appendChild(score);
      }
    }
    if (ride && source) {
      const score = spriteLayer.querySelector(".hex-ride-score");
      score.textContent =
        `${calculateRideTotalScore(ride, gameState.players[gameState.inspectedPlayerIdx]).toFixed(0)}p`;
    }
  }

  const selectedKey = gameState.selectedCampusTileKey;
  const selectedNode = campusHexNodes.get(selectedKey) || null;
  if (campusSelectedHexNode !== selectedNode) {
    campusSelectedHexNode?.classList.remove("selected");
    selectedNode?.classList.add("selected");
    campusSelectedHexNode = selectedNode;
  }
}

function syncCampusLayerVisibility() {
  const layer = document.getElementById("campusSpriteLayer");
  if (!layer) return;
  const hasActiveModal = Boolean(document.querySelector(".modal-backdrop.active"));
  const paused = gameState.mapViewMode !== "campus" || hasActiveModal;
  layer.classList.toggle("animations-paused", paused);
  layer.style.visibility = gameState.mapViewMode === "campus" ? "visible" : "hidden";
  layer.style.transform =
    `translate(${gameState.camera.x}px, ${gameState.camera.y}px) scale(${gameState.camera.zoom})`;

  if (paused !== campusLayerPaused) {
    for (const video of layer.querySelectorAll("video")) {
      if (paused || video.closest(".hex-ride-sprite")?.classList.contains("static")) video.pause();
      else video.play().catch(error => console.warn("Unable to resume campus ride video.", error));
    }
    campusLayerPaused = paused;
  }
  if (paused && campusAnimationFrame !== null) {
    cancelAnimationFrame(campusAnimationFrame);
    campusAnimationFrame = null;
  } else if (!paused && campusAnimationFrame === null) {
    campusAnimationFrame = requestAnimationFrame(() => {
      campusAnimationFrame = null;
      drawMapCanvas();
    });
  }
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
  const totMult = getTotalHexAttendanceMultiplier(hexObj, p);
  document.getElementById("mapModeIndicator").textContent = `🎡 ${park.name} — 49-Hex District Campus (${hexObj ? hexObj.regionName : ''} • ${totMult}x Market)`;

  const tileByKey = new Map(park.tiles.map(t => [t.key, t]));
  const weenieTileKeys = new Set(
    park.rides.filter(ride => ride.facilityRole === "weenie").map(ride => ride.primaryTileKey)
  );

  // 1. Draw all 49 Hex Tiles in the Diamond Grid
  for (const t of park.tiles) {
    const zone = getZoneForTile(park, t);
    const effTileTheme = getEffectiveTileThemeLevel(t);
    const themeId = zone?.themeId || park.themeId;

    if (t.state === "cleared" && !t.isEntrance && themeId) {
      const themePack = THEME_PACKS[themeId];
      if (!themePack) throw new Error(`Missing procedural theme pack: ${themeId}`);
      themePack.drawThemeGround(ctx, t.px, t.py, CAMPUS_HEX_R, themePack.pack, false);
      if (effTileTheme > 0) {
        const seed = Array.from(`${t.key}:${themeId}:${effTileTheme}`).reduce(
          (value, character) => Math.imul(value ^ character.charCodeAt(0), 16777619) >>> 0,
          2166136261
        );
        const layout = themePack.placeThemeAssets(
          themePack.pack,
          effTileTheme,
          CAMPUS_HEX_R,
          seed
        );
        if (weenieTileKeys.has(t.key)) {
          layout.assets = layout.assets.filter(
            asset => themePack.pack.assets[asset.id].cat !== "landmark"
          );
        }
        themePack.drawThemeDecals(ctx, t.px, t.py, themePack.pack, layout, 0);
        themePack.drawThemeAssets(ctx, t.px, t.py, themePack.pack, layout, 0);
      }
    } else {
      drawCampusHexPolygon(ctx, t.px, t.py, CAMPUS_HEX_R);
      if (t.isEntrance) {
        ctx.fillStyle = "#7dd3fc";
      } else if (t.state === "woods") {
        ctx.fillStyle = "#64748b";
      } else {
        ctx.fillStyle = "#bbf7d0";
      }
      ctx.fill();
    }

    // Tile Content: Entrance (ME), Woods Tree, or Scenery Stars
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (t.isEntrance) {
      drawParkEntrance(ctx, t.px, t.py, CAMPUS_HEX_R * 0.9, {
        accent: "#7dd3fc", tile: false, tm: performance.now() / 1000
      });
    } else if (t.state === "woods") {
      ctx.font = "16px sans-serif";
      ctx.fillText("🌲", t.px, t.py);
    } else if (effTileTheme > 0 && !t.rideId) {
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 9px 'Segoe UI', sans-serif";
      ctx.fillText("★".repeat(effTileTheme), t.px, t.py + 18);
    }
  }

  // 2. Draw 1-Hex rides and multi-hex rides over the campus tiles
  const canvasRides = park.rides.filter(ride => !getCampusRideSpriteSource(ride));
  for (const r of canvasRides) {
    const t1 = tileByKey.get(r.primaryTileKey);
    if (!t1) continue;
    const zone = r.zoneId ? park.zones.find(z => z.id === r.zoneId) : null;
    const accentColor = r.trainLineColor || (zone ? zone.color : "#ffffff");
    const isDown = !isRideOperational(r);

    if (r.spaces === 2 && r.secondaryTileKey) {
      const t2 = tileByKey.get(r.secondaryTileKey);
      if (t2) {
        if (["rapids", "log_flume"].includes(r.modelId) ||
          (r.category === "coaster" && r.modelId === "classic_wood")) {
          const phase = 0;
          const orientation = getMultiTileRideOrientation(t1, t2);
          const midX = (t1.px + t2.px) / 2;
          const midY = (t1.py + t2.py) / 2;
          ctx.save();
          if (r.modelId === "rapids") {
            if (orientation === "side") {
              drawRapidsSide(ctx, midX, midY, CAMPUS_HEX_R, { accent: accentColor, t: phase });
            } else {
              drawRapidsDiagDir(ctx, midX, midY, CAMPUS_HEX_R, { accent: accentColor, t: phase }, orientation);
            }
          } else if (r.modelId === "log_flume") {
            if (orientation === "side") {
              drawFlumeSide(ctx, midX, midY, CAMPUS_HEX_R, { accent: accentColor, t: phase });
            } else {
              drawFlumeDiagDir(ctx, midX, midY, CAMPUS_HEX_R, { accent: accentColor, t: phase }, orientation);
            }
          } else if (orientation === "side") {
            drawWoodCoasterSide(ctx, midX, midY, CAMPUS_HEX_R, { accent: accentColor, t: phase });
          } else {
            drawWoodCoasterDiagDir(ctx, midX, midY, CAMPUS_HEX_R, { accent: accentColor, t: phase }, orientation);
          }
          ctx.fillStyle = "#0f172a";
          ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, midX, midY + CAMPUS_HEX_R * 0.62);
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
        const cartProgress = r.category === "tracked"
          ? (performance.now() / 1000 / 5) % 1
          : 0.5;
        const cartX = t1.px + (t2.px - t1.px) * cartProgress;
        const cartY = t1.py + (t2.py - t1.py) * cartProgress;
        ctx.arc(cartX, cartY, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#0f172a";
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = isDown ? "#ef4444" : accentColor;
        ctx.stroke();

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
        const effR = getEffectiveRideThemeLevel(r);
        if (r.facilityRole === "weenie") {
          drawCampusWeenie(ctx, r, t1);
          ctx.fillStyle = "#0f172a";
          ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
          ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`,
            t1.px, t1.py + CAMPUS_HEX_R * 0.62);
        } else if (r.facilityRole === "restaurant") {
          drawDiner(ctx, t1.px, t1.py, CAMPUS_HEX_R * 0.72, { accent: accentColor, tile: false });
          ctx.fillStyle = "#0f172a";
          ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
          ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`,
            t1.px, t1.py + CAMPUS_HEX_R * 0.62);
        } else if (r.facilityRole === "toilets") {
          drawRestrooms(ctx, t1.px, t1.py, CAMPUS_HEX_R * 0.72, { accent: accentColor, tile: false });
          ctx.fillStyle = "#0f172a";
          ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
          ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`,
            t1.px, t1.py + CAMPUS_HEX_R * 0.62);
        } else if (r.facilityRole === "guest_services") {
          drawGuestServices(ctx, t1.px, t1.py, CAMPUS_HEX_R * 0.72, { accent: accentColor, tile: false });
          ctx.fillStyle = "#0f172a";
          ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
          ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`,
            t1.px, t1.py + CAMPUS_HEX_R * 0.62);
        } else {
          ctx.fillStyle = "#dc2626";
          ctx.font = "bold 12px 'Segoe UI', sans-serif";
          ctx.fillText(code, t1.px, t1.py - 2);
        }
        if (effR > 0 && !["guest_services", "toilets"].includes(r.facilityRole)) {
          ctx.fillStyle = "#0f172a";
          ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
          ctx.fillText(`+${RIDE_SCENERY_TIERS[effR].points}p`, t1.px, t1.py + 12);
        }
      } else if (r.modelId === "stage_show") {
        drawTheater(ctx, t1.px, t1.py, CAMPUS_HEX_R * 0.9, {
          accent: accentColor, tile: false, t: performance.now() / 1000
        });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.isTrainStation) {
        drawTrainStation(ctx, t1.px, t1.py, CAMPUS_HEX_R * 0.9, { accent: accentColor, tile: false });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "ferris_wheel") {
        const rotation = isDown ? 0.3 : performance.now() / 1000 * 0.35;
        drawFerrisWheel(ctx, t1.px, t1.py, CAMPUS_HEX_R, {
          accent: accentColor, t: rotation, tile: false
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
        drawDropTower(ctx, t1.px, t1.py, CAMPUS_HEX_R, { accent: accentColor, levels, t: gondolaPosition, tile: false });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "top_spin") {
        const seconds = performance.now() / 1000;
        const phase = seconds % 12;
        const swing = isDown ? 0.9 : 2.5 * Math.sin(Math.PI * phase / 12) * Math.sin(2 * Math.PI * phase / 2.4);
        drawTopSpin(ctx, t1.px, t1.py, CAMPUS_HEX_R, { accent: accentColor, t: swing, tile: false });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "scrambler") {
        const rotation = isDown ? 0.6 : performance.now() / 1000 * 1.1;
        drawScrambler(ctx, t1.px, t1.py, CAMPUS_HEX_R, { accent: accentColor, t: rotation, tile: false });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "enterprise") {
        const seconds = performance.now() / 1000;
        const phase = seconds % 16;
        const tilt = isDown ? 0 : 1.4 * Math.pow(Math.sin(Math.PI * phase / 16), 0.7);
        const spin = isDown ? 0 : seconds * (0.8 + 2.4 * Math.sin(Math.PI * phase / 16));
        drawEnterprise(ctx, t1.px, t1.py, CAMPUS_HEX_R, { accent: accentColor, t: spin, tilt, tile: false });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "claw") {
        const seconds = performance.now() / 1000;
        const swing = isDown ? 1.7 : 2.1 * Math.sin(seconds * 0.9);
        const rotor = isDown ? 0.5 : seconds * 2.6;
        drawClaw(ctx, t1.px, t1.py, CAMPUS_HEX_R, {
          accent: accentColor, t: swing, r: rotor, tile: false
        });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "chair_swings") {
        const seconds = performance.now() / 1000;
        const phase = seconds % 14;
        const fly = isDown ? 0 : Math.min(1, Math.sin(Math.PI * phase / 14) * 1.4);
        const rotation = isDown ? 0.4 : seconds * (0.5 + 1.6 * fly);
        drawChairSwing(ctx, t1.px, t1.py, CAMPUS_HEX_R, {
          accent: accentColor, t: rotation, fly, tile: false
        });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "pirate_ship") {
        const seconds = performance.now() / 1000;
        const phase = seconds % 12;
        const swing = isDown ? 0.6 :
          1.25 * Math.sin(Math.PI * phase / 12) * Math.sin(2 * Math.PI * phase / 2.6);
        drawPirateShip(ctx, t1.px, t1.py, CAMPUS_HEX_R, {
          accent: accentColor, t: swing, tile: false
        });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "bumper_cars") {
        drawBumperCars(ctx, t1.px, t1.py, CAMPUS_HEX_R, {
          accent: accentColor, t: performance.now() / 1000, tile: false
        });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "air_race") {
        const seconds = performance.now() / 1000;
        drawAirRace(ctx, t1.px, t1.py, CAMPUS_HEX_R, {
          accent: accentColor, t: isDown ? 0.5 : seconds * 1.2,
          fly: isDown ? 0 : Math.abs(Math.sin(seconds * 0.35)), tile: false
        });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "disco") {
        drawDiskO(ctx, t1.px, t1.py, CAMPUS_HEX_R, {
          accent: accentColor, r: isDown ? 0.4 : performance.now() / 1000, tile: false
        });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "giant_discovery") {
        drawGiantDiscovery(ctx, t1.px, t1.py, CAMPUS_HEX_R, {
          accent: accentColor, t: isDown ? 0 : performance.now() / 1000, tile: false
        });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "sky_fly") {
        drawSkyFly(ctx, t1.px, t1.py, CAMPUS_HEX_R, {
          accent: accentColor, t: isDown ? 0 : performance.now() / 1000, tile: false
        });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "carousel") {
        const seconds = performance.now() / 1000;
        drawCarousel(ctx, t1.px, t1.py, CAMPUS_HEX_R, {
          accent: accentColor, t: isDown ? 0.4 : seconds * 0.7 + 0.4,
          tm: seconds, tile: false
        });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else if (r.modelId === "flyer") {
        const seconds = performance.now() / 1000;
        drawFlyerRide(ctx, t1.px, t1.py, CAMPUS_HEX_R, {
          accent: accentColor, t: isDown ? 0.4 : seconds * 0.9 + 0.4,
          fly: isDown ? 0.55 : 0.5 + 0.5 * Math.sin(seconds * 0.5),
          tm: seconds, tile: false
        });
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + CAMPUS_HEX_R * 0.62);
      } else {
        // Unsupported flat-ride models still get a moving visual marker.
        ctx.beginPath();
        ctx.arc(t1.px, t1.py, 15, 0, Math.PI * 2);
        ctx.fillStyle = "#0f172a";
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = isDown ? "#991b1b" : "#dc2626";
        ctx.stroke();

        const phase = isDown ? 0 : performance.now() / 1000;
        const markerX = t1.px + Math.cos(phase) * 7;
        const markerY = t1.py + Math.sin(phase) * 4;
        ctx.beginPath();
        ctx.arc(markerX, markerY, 4, 0, Math.PI * 2);
        ctx.fillStyle = accentColor;
        ctx.fill();

        ctx.font = "bold 8.5px 'Segoe UI', sans-serif";
        ctx.fillStyle = "#0f172a";
        ctx.fillText(`${calculateRideTotalScore(r, p).toFixed(0)}p`, t1.px, t1.py + 22);
      }
      ctx.restore();
    }
  }

  updateCampusSpriteLayer(park);
}

function drawCampusWeenie(ctx, ride, tile) {
  const definition = WEENIE_CATALOG.find(item => item.id === ride.modelId);
  if (!definition) throw new RangeError(`Unknown weenie model: ${ride.modelId}`);
  const themePack = THEME_PACKS[definition.themeId];
  if (!themePack) throw new Error(`Missing weenie theme pack: ${definition.themeId}`);
  const seed = Array.from(`${ride.id}:${definition.id}`).reduce(
    (value, character) => Math.imul(value ^ character.charCodeAt(0), 16777619) >>> 0,
    2166136261
  );
  const scale = CAMPUS_HEX_R * definition.assetScale;
  const cx = tile.px;
  const cy = tile.py + CAMPUS_HEX_R * 0.28;

  if (definition.assetId) {
    const asset = themePack.pack.assets[definition.assetId];
    if (!asset) throw new Error(`Missing weenie illustration: ${definition.assetId}`);
    asset.draw(ctx, cx, cy, scale, seed, 0);
    return;
  }

  ctx.save();
  ctx.fillStyle = "rgba(45,28,12,.3)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + scale * 1.4, scale * 2.8, scale * 0.85, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(cx - scale * 2.3, cy - scale * 2.8, scale * 4.6, scale * 4.2);
  ctx.fillStyle = "#c98a4b";
  ctx.fillRect(cx - scale * 2.3, cy - scale * 2.8, scale * 4.6, scale * 1.1);
  ctx.fillStyle = "#75421f";
  ctx.beginPath();
  ctx.moveTo(cx - scale * 2.8, cy - scale * 2.8);
  ctx.lineTo(cx, cy - scale * 4.5);
  ctx.lineTo(cx + scale * 2.8, cy - scale * 2.8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#332216";
  ctx.fillRect(cx - scale * 0.55, cy - scale * 1.8, scale * 1.1, scale * 3.2);
  ctx.fillStyle = "#fef3c7";
  ctx.font = `bold ${Math.max(7, scale * 0.8)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SALOON", cx, cy - scale * 2.25, scale * 4.1);
  ctx.restore();
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

function getRideAgeMultiplier(ride) {
  const age = Math.max(0, Number(ride.age) || 0);
  const yearsBeyondGrace = Math.max(0, age - ECONOMIC_BALANCING_RULES.rideAgeGraceYears);
  return Math.max(
    ECONOMIC_BALANCING_RULES.rideMinimumCondition,
    Math.pow(1 - ECONOMIC_BALANCING_RULES.rideAgeDecayPerYear, yearsBeyondGrace)
  );
}

function getRideUpkeepMultiplier(ride) {
  const age = Math.max(0, Number(ride.age) || 0);
  const yearsBeyondGrace = Math.max(0, age - ECONOMIC_BALANCING_RULES.rideAgeGraceYears);
  return Math.min(
    1.5,
    1 + yearsBeyondGrace * ECONOMIC_BALANCING_RULES.annualUpkeepCreepPerYear
  );
}

function getRideAnnualAgeIncrement(ride, ownerPlayer) {
  if (ride.facilityRole === "weenie") return 0;
  if (ride.category === "facility") return 1;
  if (ownerPlayer?.legend.id === "jay_stein") return 1.05;
  if (ownerPlayer?.legend.id === "mark_woodburry") return 1.04;
  return 1;
}

function getRideScoringMultiplier(ride, ownerPlayer = null) {
  if (!ownerPlayer) {
    ownerPlayer = gameState.players.find(player =>
      player.parks.some(park => park.rides.some(item => item.id === ride.id))
    );
  }
  const park = ownerPlayer?.parks.find(item => item.rides.some(candidate => candidate.id === ride.id));
  let duplicateMultiplier = 1;
  if (park && ride.category !== "facility") {
    const seenRideGroups = new Set();
    const matchingModels = [];
    for (const candidate of park.rides) {
      if (candidate.category === "facility" || candidate.modelId !== ride.modelId) continue;
      const groupId = candidate.trainGroupId || candidate.id;
      if (seenRideGroups.has(groupId)) continue;
      seenRideGroups.add(groupId);
      matchingModels.push(candidate);
    }
    const duplicateIndex = matchingModels.findIndex(candidate =>
      ride.trainGroupId
        ? candidate.trainGroupId === ride.trainGroupId
        : candidate.id === ride.id
    );
    if (duplicateIndex >= 0) {
      const multipliers = ECONOMIC_BALANCING_RULES.duplicateScoreMultipliers;
      duplicateMultiplier = multipliers[Math.min(duplicateIndex, multipliers.length - 1)];
    }
  }
  let ownerMultiplier = 1;
  if (ownerPlayer) {
    if (ownerPlayer.legend.id === "hugo_herschend" &&
        ["stage_show", "rapids", "train"].includes(ride.modelId)) ownerMultiplier *= 1.20;
    if (ownerPlayer.legend.id === "angus_wynne" && ride.era === "classic" &&
        ride.category !== "facility") ownerMultiplier *= 1.10;
    if (ownerPlayer.legend.id === "dick_kinzel" && (ride.recordTags?.length || 0) > 0) {
      ownerMultiplier *= 1.20;
    }
  }
  if (ride.cultClassic) ownerMultiplier *= 1.20;
  return getRideAgeMultiplier(ride) * duplicateMultiplier * ownerMultiplier;
}

function getParkOwner(targetPark) {
  return gameState.players.find(player =>
    player.parks.some(park => park.id === targetPark.id)
  ) || null;
}

function getRideOwner(ride) {
  const owner = gameState.players.find(player =>
    player.parks.some(park => park.rides.some(candidate => candidate.id === ride.id))
  );
  return owner || null;
}

function getRideBaseBuildCost(ride) {
  if (ride.facilityRole === "weenie") return Number(ride.baseBuildCost) || 25;
  const definition = getRideModelById(ride.modelId, ride.category);
  return Number(definition?.baseCost) ||
    Number(definition?.cost) ||
    2.0;
}

function setRideAge(park, ride, age) {
  ride.age = Math.max(0, Number(age) || 0);
  for (const tile of park.tiles || []) {
    if (tile.rideId === ride.id) tile.age = ride.age;
  }
}

function getRideAnnualUpkeep(ride, ownerPlayer = null) {
  if (ride.category === "facility") return 0;
  const legendMultiplier = ownerPlayer?.legend.id === "milton_hershey" ? 1.5 : 1;
  return getRideBaseBuildCost(ride) *
    ECONOMIC_BALANCING_RULES.annualRideUpkeepRate *
    Math.min(1.5, getRideUpkeepMultiplier(ride) * legendMultiplier);
}

function convertAttendanceWithSaturation(potentialAttendance) {
  let remaining = Math.max(0, potentialAttendance);
  let lowerLimit = 0;
  let adjustedAttendance = 0;
  for (const bracket of ECONOMIC_BALANCING_RULES.attendanceBrackets) {
    const bracketCapacity = bracket.limit - lowerLimit;
    const guestsInBracket = Math.min(remaining, bracketCapacity);
    adjustedAttendance += guestsInBracket * bracket.efficiency;
    remaining -= guestsInBracket;
    lowerLimit = bracket.limit;
    if (remaining <= 0) break;
  }
  const realizedPotential = Math.max(1, potentialAttendance);
  const marginalEfficiency = ECONOMIC_BALANCING_RULES.attendanceBrackets
    .find(bracket => potentialAttendance < bracket.limit)?.efficiency ??
    ECONOMIC_BALANCING_RULES.attendanceBrackets[
      ECONOMIC_BALANCING_RULES.attendanceBrackets.length - 1
    ].efficiency;
  return {
    attendance: Math.round(adjustedAttendance),
    efficiency: marginalEfficiency,
    averageEfficiency: adjustedAttendance / realizedPotential
  };
}

function getCorporateOverheadRate(attendance) {
  return ECONOMIC_BALANCING_RULES.corporateOverheadTiers
    .find(tier => attendance < tier.attendanceLimit)?.rate ??
    ECONOMIC_BALANCING_RULES.corporateOverheadTiers[
      ECONOMIC_BALANCING_RULES.corporateOverheadTiers.length - 1
    ].rate;
}

function calculateBaseRideTechPoints(ride) {
  if (!isRideOperational(ride)) return 0;
  if (ride.facilityRole === "weenie") return Number(ride.techPoints) || 25;
  if (ride.category === "facility") return 0;
  if (ride.category === "flat" || ride.category === "tracked") return ride.techPoints;
  return Math.max(0.5, ((ride.length / 100) * 0.25 + (ride.height / 20) * 0.5 + (ride.inversions || 0) * 1.0) - (ride.smoothnessPenalty || 0));
}

function calculateBaseRideSceneryPoints(ride, ownerPlayer = null) {
  if (!isRideOperational(ride)) return 0;
  if (!ownerPlayer) ownerPlayer = getRideOwner(ride);
  const effLevel = getEffectiveRideThemeLevel(ride);
  const basePts = RIDE_SCENERY_TIERS[effLevel].points;
  // Rides in a designated Themed Land receive a 1.25x Zoned Scenery Multiplier!
  const zoneMult = (ride.zoneId && ride.zoneId !== "generic") ? 1.25 : 1.0;
  const sceneryBonus = ownerPlayer?.legend.id === "jay_stein" ? 1.08 : 1;
  return basePts * zoneMult * sceneryBonus;
}

function calculateRideSceneryPoints(ride, ownerPlayer = null) {
  return calculateBaseRideSceneryPoints(ride, ownerPlayer) * getRideScoringMultiplier(ride, ownerPlayer);
}

function calculateRideTotalScore(ride, ownerPlayer = null) {
  if (!isRideOperational(ride)) return 0;
  const rawScore = calculateBaseRideTechPoints(ride) +
    calculateBaseRideSceneryPoints(ride, ownerPlayer) +
    ((ride.recordTags ? ride.recordTags.length : 0) * getRecordBonusValue());
  return rawScore * getRideScoringMultiplier(ride, ownerPlayer);
}

function getRestaurantMealPrice(restaurant) {
  const price = Number(restaurant.mealPrice);
  return Number.isInteger(price) &&
    price >= FOOD_AND_BEVERAGE_RULES.minMealPrice &&
    price <= FOOD_AND_BEVERAGE_RULES.maxMealPrice
    ? price
    : FOOD_AND_BEVERAGE_RULES.defaultMealPrice;
}

function getRideSceneryUpgradeCost(ride, ownerPlayer = null) {
  if (!ride) return 0;
  const player = ownerPlayer || getRideOwner(ride);
  const level = getEffectiveRideThemeLevel(ride);
  const tier = RIDE_SCENERY_TIERS[level] || RIDE_SCENERY_TIERS[0];
  const baseCost = level === 0 ? tier.cost : tier.upgradeCost;
  const adjusted = baseCost * (ride.facilityRole === "weenie" ? 2 : getCategorySceneryScale(ride.category)) * getPlayerRideSceneryMultiplier(player, level > 0);
  return Number(adjusted || 0);
}

function getRideRefurbishCost(ride, ownerPlayer = null) {
  if (ride.facilityRole === "weenie") return 0;
  const rawBaseRideCost = getRideBaseBuildCost(ride);
  const sceneryLevel = Math.min(
    RIDE_SCENERY_TIERS.length - 1,
    Math.max(0, Math.floor(Number(ride.themeLevel) || 0))
  );
  const rawSceneryCost = Number(RIDE_SCENERY_TIERS[sceneryLevel]?.cost) || 0;
  const refurbCost = rawBaseRideCost * RIDE_REFURB_FRACTION + rawSceneryCost / 6;
  return +Math.min(rawBaseRideCost * 0.5, refurbCost).toFixed(2);
}

function getRideMaintenanceCost(ride, ownerPlayer = null) {
  if (ride.facilityRole === "weenie") return 0;
  const rawBaseRideCost = getRideBaseBuildCost(ride);
  const owner = ownerPlayer || getRideOwner(ride);
  const maintenanceMultiplier = owner ? getPlayerMaintAndRepairMultiplier(owner) : 1;
  return +(rawBaseRideCost * 0.10 * maintenanceMultiplier).toFixed(2);
}

function getRideRepairCost(ride) {
  if (ride.facilityRole === "weenie") return 0;
  return getRideRefurbishCost(ride);
}

function getRideDemolitionCost(ride) {
  return +Math.min(getRideBaseBuildCost(ride) * 0.10, 0.25).toFixed(2);
}

function getRestaurantMealPricingState(park, restaurant) {
  const venueThemeRatio = Math.min(1, getEffectiveRideThemeLevel(restaurant) / 4);
  const tile = park.tiles.find(item => item.key === restaurant.primaryTileKey);
  const tileSceneryRatio = Math.min(1, getEffectiveTileThemeLevel(tile) / 4);
  const themeProgress = Math.min(1, venueThemeRatio * 0.5 + tileSceneryRatio * 0.5);
  return {
    venueThemeRatio,
    tileSceneryRatio,
    themeProgress,
    fairMealPrice: Math.round(
      FOOD_AND_BEVERAGE_RULES.minMealPrice +
      themeProgress * (FOOD_AND_BEVERAGE_RULES.maxMealPrice - FOOD_AND_BEVERAGE_RULES.minMealPrice)
    )
  };
}

function getAdvisorAnnualSalary(player, advisorId) {
  const turnIndex = Math.max(1, Number(gameState.year) || 1);
  const parkCount = Math.max(0, (player?.parks?.length || 1) - 1);
  return +(0.60 + (turnIndex * 0.08) + (parkCount * 0.20)).toFixed(2);
}

function getAdvisorState(player, advisorId) {
  return (player?.advisors || []).find(advisor => advisor.id === advisorId) || null;
}

function hireAdvisor(advisorId) {
  const player = gameState.players[gameState.activePlayerIdx];
  if (!player) return;
  const advisor = getAdvisorState(player, advisorId);
  if (!advisor || advisor.hired) return;
  const salary = getAdvisorAnnualSalary(player, advisorId);
  if (player.cash < salary) {
    addLog(`${player.ceoName} cannot afford ${advisor.name} (${salary.toFixed(2)}M).`);
    return;
  }
  advisor.hired = true;
  advisor.turnsRemaining = 3;
  advisor.lastReportYear = gameState.year;
  advisor.latestReport = `${advisor.name} is on contract and awaiting the next tri-annual audit.`;
  addLog(`${player.ceoName} hired ${advisor.name} on a three-year contract at $${salary.toFixed(2)}M per year.`);
  renderAll();
}

function fireAdvisor(advisorId) {
  const player = gameState.players[gameState.activePlayerIdx];
  if (!player) return;
  const advisor = getAdvisorState(player, advisorId);
  if (!advisor || !advisor.hired) return;
  advisor.hired = false;
  advisor.turnsRemaining = 0;
  advisor.latestReport = `${advisor.name} was released. The prior dossier remains archived for review.`;
  addLog(`${player.ceoName} dismissed ${advisor.name}.`);
  renderAll();
}

function generateAdvisorAuditReport(player, advisorId) {
  const advisor = getAdvisorState(player, advisorId);
  if (!advisor || !advisor.hired) return null;
  const parks = player.parks || [];
  const totalAttendance = player.totalAttendance || 0;
  const activeParks = parks.filter(park => park && park.rides && park.rides.length > 0);
  const averageRideAge = activeParks.length
    ? activeParks.reduce((sum, park) => sum + (park.rides || []).reduce((inner, ride) => inner + (Number(ride.age) || 0), 0), 0) /
      activeParks.reduce((sum, park) => sum + (park.rides || []).length, 0)
    : 0;
  const supportGap = parks.filter(park => !calculateParkInfrastructureSupport(park, player, park.lastAttendance || 0).hasGuestServices).length;
  const pricingDetails = parks.map(park => {
    const ticketState = getParkTicketPricingState(park, player);
    const restaurants = park.rides
      .filter(ride => ride.category === "facility" && ride.facilityRole === "restaurant")
      .map(restaurant => ({
        name: restaurant.name,
        actualPrice: getRestaurantMealPrice(restaurant),
        ...getRestaurantMealPricingState(park, restaurant)
      }));
    return {
      parkName: park.name,
      ticketPrice: ticketState.ticketPrice,
      fairTicketPrice: ticketState.fairTicketPrice,
      ticketRatio: ticketState.priceRatio,
      restaurants
    };
  });
  const pricingWarnings = pricingDetails.filter(park =>
    park.ticketRatio < 0.90 || park.ticketRatio > 1.10 ||
    park.restaurants.some(restaurant => Math.abs(restaurant.actualPrice - restaurant.fairMealPrice) > 2)
  ).length;
  const harmonyAvg = parks.length
    ? parks.reduce((sum, park) => sum + (calculateParkPrestigeMetrics(park, player).placeMakingIndex || 0), 0) / parks.length
    : 0;

  let report = "";
  if (advisor.id === "technical") {
    const maintenanceRisk = averageRideAge > 12 ? "maintenance risk is elevated" : "maintenance conditions remain stable";
    report = `Technical review: ${maintenanceRisk}; ${supportGap} park${supportGap === 1 ? "" : "s"} lack full guest-service coverage and average ride age sits at ${averageRideAge.toFixed(1)} years.`;
  } else if (advisor.id === "financial") {
    const gateText = pricingWarnings > 0 ? `${pricingWarnings} park${pricingWarnings === 1 ? "" : "s"} are mispriced relative to fair value` : "park gate pricing is currently aligned to fair value";
    report = `Financial review: ${gateText}; chain attendance is ${totalAttendance.toLocaleString()}. Meal-price guidance accounts for each restaurant's venue and tile theming.`;
  } else {
    const harmonyText = harmonyAvg >= 0.65 ? "experience mix remains strong" : "experience mix needs more coherent theming";
    report = `Creative review: ${harmonyText}; ${activeParks.length} active park zones are shaping a ${Math.min(100, Math.max(0, harmonyAvg * 100)).toFixed(0)}% place-making index across the chain.`;
  }

  advisor.latestReport = report;
  advisor.lastReportYear = gameState.year;
  const reportData = {
    playerId: player.id,
    playerName: `${player.ceoName} (${player.chainName})`,
    advisorId: advisor.id,
    advisorName: advisor.name,
    advisorTitle: advisor.title,
    advisorImage: advisor.image,
    report,
    year: gameState.year,
    parks: pricingDetails
  };
  advisor.latestReportData = reportData;
  return reportData;
}

function processAdvisorReportsForPlayer(player) {
  const reports = [];
  for (const advisor of player.advisors || []) {
    if (!advisor.hired) continue;
    const lastYear = Number(advisor.lastReportYear) || 0;
    if (advisor.turnsRemaining <= 1 || (gameState.year - lastYear) >= 3) {
      const report = generateAdvisorAuditReport(player, advisor.id);
      if (report) reports.push(report);
      advisor.turnsRemaining = 3;
    } else {
      advisor.turnsRemaining = Math.max(1, (Number(advisor.turnsRemaining) || 3) - 1);
    }
  }
  gameState.pendingAdvisorReports.push(...reports);
  return reports;
}

function getParkTicketPricingState(park, ownerPlayer = null, summaryOverride = null) {
  const owner = ownerPlayer || gameState.players.find(player => player.parks.some(item => item.id === park.id)) || null;
  const summary = summaryOverride || calculateParkScoreSummary(park, owner);
  const parkScore = Number(summary?.finalScore) || 0;
  const ticketPrice = Number(park?.ticketPrice) || 45;
  const clampedScore = Math.max(100, Math.min(6000, parkScore));
  const fairTicketPrice = parkScore <= 100
    ? 25
    : Math.round(25 + ((clampedScore - 100) / (6000 - 100)) * 175);
  const priceRatio = fairTicketPrice > 0 ? ticketPrice / fairTicketPrice : 1;
  let attendanceMultiplier = 1;
  if (priceRatio < 0.90) attendanceMultiplier = 1 + Math.min(0.25, (1 - priceRatio) * 0.6);
  else if (priceRatio <= 1.10) attendanceMultiplier = 1 - (priceRatio - 1.0) * 0.25;
  else attendanceMultiplier = Math.max(0.25, 1 - Math.pow(priceRatio - 1.0, 1.45) * 1.3);

  let withinRangePenalty = 1;
  if (priceRatio > 1.10) {
    const parkHex = gameState.hexByKey.get(park.hexKey);
    const ownerParks = owner?.parks || [];
    const currentValueRatio = parkScore / Math.max(1, ticketPrice);
    for (const rivalPark of ownerParks.filter(item => item.id !== park.id)) {
      const rivalHex = gameState.hexByKey.get(rivalPark.hexKey);
      if (!parkHex || !rivalHex) continue;
      if (hexDistance(parkHex, rivalHex) <= 2) {
        const rivalSummary = calculateParkScoreSummary(rivalPark, owner);
        const rivalValueRatio = (rivalSummary?.finalScore || 0) / Math.max(1, Number(rivalPark.ticketPrice || 45));
        if (rivalValueRatio > currentValueRatio * 1.25) {
          withinRangePenalty = 0.90;
          break;
        }
      }
    }
  }

  return {
    fairTicketPrice,
    ticketPrice,
    priceRatio,
    attendanceMultiplier: attendanceMultiplier * withinRangePenalty,
    underpriced: priceRatio < 0.90,
    overPriced: priceRatio > 1.10,
    valueRatio: parkScore / Math.max(1, ticketPrice),
    rivalBleed: withinRangePenalty < 1
  };
}

function setParkTicketPrice(parkId, rawPrice) {
  const player = gameState.players[gameState.activePlayerIdx];
  const park = player.parks.find(item => item.id === parkId);
  const value = Number(rawPrice);
  if (!park || !Number.isFinite(value)) return;
  park.ticketPrice = Math.min(200, Math.max(20, Math.round(value / 5) * 5));
  park.fairTicketPrice = getParkTicketPricingState(park, player).fairTicketPrice;
  renderAll();
}

function calculateParkFoodAndBeverageLedger(park, attendance, ownerPlayer, prestige, guestRevenueFactor = 1) {
  const restaurants = park.rides.filter(ride => ride.category === "facility" &&
    ride.facilityRole === "restaurant" && isRideOperational(ride));
  if (restaurants.length === 0) {
    return { venueCount: 0, mealsSold: 0, grossRevenue: 0, cogs: 0, overhead: 0, netProfit: 0, venues: [] };
  }

  const venueCount = restaurants.length;
  const metrics = prestige || calculateParkPrestigeMetrics(park, ownerPlayer);
  const placeMakingIndex = metrics.placeMakingIndex;
  const revenueMultiplier = ownerPlayer?.revenueMult || 1;
  const foodProfitMultiplier = ownerPlayer?.legend.id === "milton_hershey" ? 1.06 : 1;
  const hungryPoolShare = FOOD_AND_BEVERAGE_RULES.baseHungryPoolShare +
    FOOD_AND_BEVERAGE_RULES.placeMakingHungryPoolBonus * placeMakingIndex;
  const guestsPerUnit = attendance / venueCount;
  let totalMealsSold = 0, grossRevenue = 0, variableCogs = 0, fixedOpEx = 0;
  const venues = restaurants.map(restaurant => {
    const pricingState = getRestaurantMealPricingState(park, restaurant);
    const priceDelta = getRestaurantMealPrice(restaurant) - pricingState.fairMealPrice;
    const priceConversion = priceDelta < 0
      ? Math.min(0.88, 0.52 - 0.048 * priceDelta)
      : 0.52 * Math.exp(-0.06 * priceDelta * priceDelta);
    const mealsSold = Math.min(
      FOOD_AND_BEVERAGE_RULES.annualCapacityPerVenue,
      Math.round(guestsPerUnit * hungryPoolShare * priceConversion)
    );
    const venueGrossRevenue = mealsSold * getRestaurantMealPrice(restaurant) /
      1000000 * guestRevenueFactor;
    const venueVariableCogs = mealsSold * FOOD_AND_BEVERAGE_RULES.costPerMeal / 1000000;
    const venueFixedOpEx = FOOD_AND_BEVERAGE_RULES.fixedOverheadPerVenue +
      guestsPerUnit / 1000000 * FOOD_AND_BEVERAGE_RULES.fixedOverheadPerMillionGuests;
    const venueCogs = venueVariableCogs + venueFixedOpEx;
    const netProfit = (venueGrossRevenue - venueCogs) * revenueMultiplier * foodProfitMultiplier;
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
      fairMealPrice: pricingState.fairMealPrice,
      price: getRestaurantMealPrice(restaurant),
      themeProgress: pricingState.themeProgress,
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
    throw new RangeError(`Meal price must be a whole dollar amount from $${FOOD_AND_BEVERAGE_RULES.minMealPrice} to $${FOOD_AND_BEVERAGE_RULES.maxMealPrice}.`);
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
    throw new RangeError(`Meal price must be a whole dollar amount from $${FOOD_AND_BEVERAGE_RULES.minMealPrice} to $${FOOD_AND_BEVERAGE_RULES.maxMealPrice}.`);
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
    pointsByTile.set(t.key, { scenic, other: 0, weenieTech: 0 });
  }

  let rideScenicSum = 0;
  let rideTechAndRecSum = 0;
  let minRideTheme = landRides.length > 0 ? 4 : 0;

  for (const r of landRides) {
    const lv = getEffectiveRideThemeLevel(r);
    if ((ownerPlayer?.legend.id !== "anton_pieck" || r.category !== "facility") &&
        lv < minRideTheme) minRideTheme = lv;
    const rideScenic = calculateRideSceneryPoints(r, ownerPlayer);
    const rideOther = calculateRideTotalScore(r, ownerPlayer) - rideScenic;
    const weenieTech = r.facilityRole === "weenie"
      ? calculateBaseRideTechPoints(r) * getRideScoringMultiplier(r, ownerPlayer)
      : 0;
    rideScenicSum += rideScenic;
    rideTechAndRecSum += rideOther;

    const rideTileKeys = [r.primaryTileKey, r.secondaryTileKey]
      .filter((key, index, keys) => key && keys.indexOf(key) === index && pointsByTile.has(key));
    if (rideTileKeys.length === 0 && landTiles.length > 0) rideTileKeys.push(landTiles[0].key);
    for (const key of rideTileKeys) {
      const tilePoints = pointsByTile.get(key);
      tilePoints.scenic += rideScenic / rideTileKeys.length;
      tilePoints.other += rideOther / rideTileKeys.length;
      tilePoints.weenieTech += weenieTech / rideTileKeys.length;
    }
  }

  // Land Harmony requires at least 4 tiles, at least 2 rides/facilities, and matches lowest theme tier
  const landAttractions = landRides.filter(ride => ride.category !== "facility").length;
  const harmonyRequirementsMet = ownerPlayer?.legend.id === "anton_pieck"
    ? landAttractions >= 2
    : landTiles.length >= 4 && landRides.length >= 2;
  const harmonyTier = harmonyRequirementsMet ? Math.min(minTileTheme, minRideTheme) : 0;
  const legHarmMult = ownerPlayer ? getPlayerHarmonyBonusMultiplier(ownerPlayer) : 1.0;
  const weenieHarmonyBonus = landRides.some(ride => ride.facilityRole === "weenie") ? 0.10 : 0;
  const harmonyMult = LAND_HARMONY_TIERS[harmonyTier].bonus * legHarmMult + weenieHarmonyBonus;
  const totalLandScenic = (tileScenicRaw + rideScenicSum) * (1 + harmonyMult);

  let finalLandScore = 0;
  let toiletsCoveredTiles = 0, restaurantCoveredTiles = 0;
  for (const tile of landTiles) {
    const coverage = amenityCoverage.get(tile.key);
    if (coverage && coverage.toilets) toiletsCoveredTiles++;
    if (coverage && coverage.restaurant) restaurantCoveredTiles++;
    const points = pointsByTile.get(tile.key);
    const amenityPenalty = getTileAmenityPenalty(tile, amenityCoverage);
    const scoreWithoutWeenieTech = points.scenic * (1 + harmonyMult) +
      points.other - points.weenieTech;
    finalLandScore += scoreWithoutWeenieTech * (1 - amenityPenalty) + points.weenieTech;
  }

  return {
    zone,
    tileCount: landTiles.length,
    rideCount: landRides.length,
    harmonyTier,
    weenieHarmonyBonus,
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

function calculateParkInfrastructureSupport(park, ownerPlayer, estimatedAttendance) {
  let ridePoints = (park.recordTags?.length || 0) * getRecordBonusValue();
  let supportPoints = 0;
  for (const tile of park.tiles || []) {
    if (tile.state !== "cleared" || tile.isEntrance) continue;
    const level = getEffectiveTileThemeLevel(tile);
    supportPoints += TILE_SCENERY_TIERS[level].points * (tile.zoneId ? 1.25 : 1);
  }
  for (const ride of park.rides || []) {
    if (!isRideOperational(ride)) continue;
    const sceneryPoints = calculateRideSceneryPoints(ride, ownerPlayer);
    if (ride.category === "facility") {
      supportPoints += sceneryPoints;
      const model = FACILITY_CATALOG.find(item => item.id === ride.modelId);
      supportPoints += model?.supportPoints || 0;
    } else {
      supportPoints += sceneryPoints;
      ridePoints += Math.max(0, calculateRideTotalScore(ride, ownerPlayer) - sceneryPoints);
    }
  }
  const totalPoints = ridePoints + supportPoints;
  const supportShare = totalPoints > 0 ? supportPoints / totalPoints : 0;
  const attendanceThresholdReached =
    estimatedAttendance > ECONOMIC_BALANCING_RULES.infrastructureAttendanceThreshold;
  const supportDeficit = Math.max(
    0,
    ECONOMIC_BALANCING_RULES.infrastructureSupportShareThreshold - supportShare
  );
  const penalty = attendanceThresholdReached
    ? Math.min(
      ECONOMIC_BALANCING_RULES.infrastructureMaximumPenalty,
      supportDeficit / ECONOMIC_BALANCING_RULES.infrastructureSupportShareThreshold *
        ECONOMIC_BALANCING_RULES.infrastructureMaximumPenalty
    )
    : 0;
  return {
    ridePoints,
    supportPoints,
    supportShare,
    penalty,
    isBottleneck: penalty > 0
  };
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
    const rideScenic = calculateRideSceneryPoints(r, ownerPlayer);
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
  const finalScore = score + balancedBonusPts;
  const marketMultiplier = getTotalHexAttendanceMultiplier(
    gameState.hexByKey.get(park.hexKey),
    ownerPlayer
  );
  const pricingState = getParkTicketPricingState(park, ownerPlayer, { finalScore });
  const potentialAttendance = finalScore * 10000 * marketMultiplier * pricingState.attendanceMultiplier;
  const saturation = convertAttendanceWithSaturation(potentialAttendance);
  const infrastructure = calculateParkInfrastructureSupport(park, ownerPlayer, saturation.attendance);
  return {
    totalScenic,
    totalRecordBonus: parkRecBonus,
    hasGuestServices,
    hasBalancedBonus,
    balancedBonusPts,
    finalScore,
    marketSaturationEfficiency: saturation.efficiency,
    infrastructureSupportShare: infrastructure.supportShare,
    infrastructurePenalty: infrastructure.penalty,
    infrastructureBottleneck: infrastructure.isBottleneck
  };
}

function calculateParkPrestigeMetrics(park, ownerPlayer = null) {
  if (!ownerPlayer) ownerPlayer = gameState.players.find(player => player.parks.some(item => item.id === park.id));
  const summary = calculateParkScoreSummary(park, ownerPlayer);
  const recordBonus = getRecordBonusValue();
  const totalTechScore = (park.rides || []).reduce((sum, ride) => {
    if (!isRideOperational(ride) ||
        (ride.category === "facility" && ride.facilityRole !== "weenie")) return sum;
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
  ["parks", "rivals", "rd", "advisors", "records"].forEach(t => {
    document.getElementById(`tbTab${t.charAt(0).toUpperCase() + t.slice(1)}`).classList.toggle("active", t === tab);
  });
  document.getElementById("sidebarParksPane").style.display = tab === "parks" ? "block" : "none";
  document.getElementById("sidebarRivalsPane").style.display = tab === "rivals" ? "block" : "none";
  document.getElementById("sidebarRdPane").style.display = tab === "rd" ? "block" : "none";
  document.getElementById("sidebarAdvisorsPane").style.display = tab === "advisors" ? "block" : "none";
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

  renderAdvisorSidebar(activePlayer);
  renderLeftSidebar(inspectedPlayer);
  renderHexInspector();
  if (document.getElementById("parkZoneDrawer").classList.contains("open")) renderParkDrawer();
  requestAnimationFrame(drawMapCanvas);
}

function renderAdvisorSidebar(player) {
  const list = document.getElementById("advisorListContainer");
  if (!list) return;
  list.innerHTML = ADVISOR_CATALOG.map(advisor => {
    const advisorState = getAdvisorState(player, advisor.id);
    const salary = getAdvisorAnnualSalary(player, advisor.id);
    const isHired = !!advisorState?.hired;
    const initials = advisor.name.split(/\s+/).map(part => part[0]).join("").slice(0, 2);
    return `<div class="card" style="padding:.65rem;">
      <div style="display:flex;align-items:center;gap:.75rem;">
        <div class="advisor-avatar">
          <img src="${advisor.image}" alt="${advisor.name}" onerror="this.remove();this.parentElement.textContent='${initials}'">
        </div>
        <div style="flex:1;min-width:0;">
          <strong style="display:block;color:var(--accent-gold);font-size:.85rem;">${advisor.name}</strong>
          <small style="color:var(--text-muted);display:block;">${advisor.title}</small>
          <small style="color:var(--text-muted);display:block;">$${salary.toFixed(2)}M/yr</small>
        </div>
      </div>
      <div style="font-size:.68rem;color:var(--text-muted);margin:.45rem 0;line-height:1.45;">${advisor.description}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:.3rem;">
        ${isHired ? '<button class="btn-outline btn-sm" onclick="fireAdvisor(\'' + advisor.id + '\')">Fire</button>' : '<button class="btn-primary btn-sm" onclick="hireAdvisor(\'' + advisor.id + '\')">Hire</button>'}
      </div>
      <div style="margin-top:.55rem;padding:.45rem .5rem;background:rgba(15,23,42,.35);border:1px solid var(--border-color);border-radius:8px;font-size:.68rem;color:var(--text-main);line-height:1.5;">
        <strong>Latest Report ${advisorState?.lastReportYear ? `• Year ${advisorState.lastReportYear}` : ""}</strong><br>
        ${escapeHtml(advisorState?.latestReport || "No audit conducted yet.")}
        ${advisorState?.latestReportData ? `<button class="btn-outline btn-sm advisor-report-open" onclick="openAdvisorReport('${advisor.id}')">Open Report</button>` : ""}
      </div>
    </div>`;
  }).join("");
}

function renderAdvisorReportHTML(reports) {
  return reports.map(report => {
    const advisorImage = report.advisorImage ||
      ADVISOR_CATALOG.find(advisor => advisor.id === report.advisorId)?.image || "";
    const parkRows = report.advisorId === "financial"
      ? `<div class="advisor-report-table-wrap"><table class="advisor-report-table">
          <thead><tr><th>Park</th><th>Gate Pricing</th><th>Food Pricing</th></tr></thead>
          <tbody>${report.parks.map(park => `<tr>
            <td>${escapeHtml(park.parkName)}</td>
            <td>${park.ticketRatio < 0.90 ? "Underpriced" : park.ticketRatio > 1.10 ? "Overpriced" : "Just right"}</td>
            <td>${park.restaurants.length
              ? park.restaurants.map(restaurant => {
                const delta = restaurant.actualPrice - restaurant.fairMealPrice;
                const status = delta > 2 ? "Overpriced" : delta < -2 ? "Underpriced" : "Just right";
                return `${escapeHtml(restaurant.name)}: ${status}`;
              }).join("<br>")
              : "No restaurants"}</td>
          </tr>`).join("")}</tbody>
        </table></div>`
      : "";
    return `<article class="advisor-report-entry">
      <img class="advisor-report-image" src="${escapeHtml(advisorImage)}" alt="${escapeHtml(report.advisorName)}">
      <div class="advisor-report-content">
        <div class="advisor-report-heading">
          <div><span class="badge badge-gold">Year ${report.year}</span>
            <h3>${escapeHtml(report.advisorName)}</h3>
            <small>${escapeHtml(report.advisorTitle)} · ${escapeHtml(report.playerName)}</small>
          </div>
        </div>
        <p>${escapeHtml(report.report)}</p>
        ${parkRows}
      </div>
    </article>`;
  }).join("");
}

function openAdvisorReportsModal(reports) {
  const modal = document.getElementById("advisorReportModal");
  const body = document.getElementById("advisorReportModalBody");
  if (!modal || !body || !reports.length) return;
  body.innerHTML = renderAdvisorReportHTML(reports);
  document.getElementById("advisorReportModalTitle").textContent =
    reports.length === 1 ? `${reports[0].advisorName} Report` : "Triennial Advisor Reports";
  modal.classList.add("active");
}

function openAdvisorReport(advisorId) {
  const player = gameState.players[gameState.activePlayerIdx];
  const advisor = getAdvisorState(player, advisorId);
  if (advisor?.latestReportData) openAdvisorReportsModal([advisor.latestReportData]);
}

function openPendingAdvisorReportsModal() {
  const reports = gameState.pendingAdvisorReports.splice(0);
  openAdvisorReportsModal(reports);
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
    const totMult = getTotalHexAttendanceMultiplier(hexObj, inspectedPlayer);
    const card = document.createElement("div");
    card.className = `card ${park.id === gameState.selectedParkId ? 'active-card' : ''}`;
    card.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;"><strong style="cursor:pointer;" onclick="focusParkOnMap('${park.id}')">🎡 ${escapeHtml(park.name)}</strong><span class="badge badge-gold">${summary.finalScore.toFixed(1)}p</span></div><div style="font-size:.7rem;color:var(--text-muted);margin-top:.18rem;">📍 ${hexObj ? escapeHtml(hexObj.regionName) : ''} • <strong style="color:var(--accent-teal);">${totMult}x Market</strong> • Saturation: <strong>${(summary.marketSaturationEfficiency * 100).toFixed(0)}%</strong> ${!summary.hasGuestServices ? '<span class="badge badge-red">No Guest Svc (-5%)</span>' : '<span class="badge badge-green">ℹ️ OK</span>'}</div>${summary.infrastructureBottleneck ? '<div class="badge badge-red" style="white-space:normal;margin-top:.3rem;">⚠ Infrastructure Bottleneck: Build more F&amp;B, Services, or Plazas!</div>' : ''}<div style="display:flex;gap:.35rem;margin-top:.4rem;"><button class="btn-primary btn-sm" style="flex:1;" onclick="enterParkCampusView('${park.id}')">🔍 Open 49-Hex Campus</button></div>`;
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
  const activePlayer = gameState.players[gameState.activePlayerIdx];

  if (hex.parkId) {
    const owner = gameState.players.find(p => p.id === hex.ownerId);
    const park = owner.parks.find(pk => pk.id === hex.parkId);
    const market = getHexMarketDetails(hex, owner);
    const rivalParks = getOpponentCannibalizationSummary(hex, owner.id);
    const summary = calculateParkScoreSummary(park, owner);
    el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;"><strong style="color:var(--accent-gold);font-size:.92rem;">🎡 ${escapeHtml(park.name)}</strong><span class="badge badge-teal">${market.total}x Att. Mod</span></div><div style="font-size:.72rem;color:var(--text-muted);margin-top:.12rem;">Owner: <strong>${escapeHtml(owner.chainName)}</strong> • ${escapeHtml(hex.regionName)} (${trait.name} ${market.base}x + Cluster ${market.cluster.bonus}x − Rival drain ${market.rivalPenalty}x; ${rivalParks.adjacent} adjacent, ${rivalParks.nearby} at distance 2)</div><div style="margin-top:.4rem;display:flex;justify-content:space-between;align-items:center;"><span>Score: <strong>${summary.finalScore.toFixed(1)} pts</strong></span><div style="display:flex;gap:.3rem;"><button class="btn-primary btn-sm" onclick="enterParkCampusView('${park.id}')">🔍 Open 49-Hex Campus</button></div></div>`;
  } else {
    const market = getHexMarketDetails(hex, activePlayer);
    const rivalParks = getOpponentCannibalizationSummary(hex, activePlayer.id);
    const check = canPlayerBuildParkOnHex(activePlayer, hex);
    const prices = getHexParkPricesForPlayer(activePlayer, hex);
    el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;"><strong>📍 ${escapeHtml(hex.regionName)} (${hex.col}, ${hex.row})</strong><span class="badge badge-gold">${trait.name} (${trait.attMult}x)</span></div><div style="font-size:.73rem;color:var(--accent-teal);margin-top:.18rem;"><strong>Total Market Multiplier: ${market.total}x</strong> (Base ${market.base}x + ${market.cluster.count} Nearby Parks = +${market.cluster.bonus}x − Rival drain ${market.rivalPenalty}x; ${rivalParks.adjacent} adjacent, ${rivalParks.nearby} at distance 2)</div><div style="font-size:.7rem;color:var(--text-muted);margin-top:.18rem;">Prices: Small <strong>$${prices.smallCost}M</strong> • Med <strong>$${prices.mediumCost}M</strong> • Large <strong>$${prices.largeCost}M</strong></div><div style="margin-top:.4rem;">${check.allowed ? `<button class="btn-gold btn-sm" style="width:100%;" onclick="openBuyParkOnHexModal('${hex.key}')">🏗️ Acquire Theme Park on This Hex</button>` : `<div style="color:var(--accent-red);font-size:.7rem;font-weight:600;">🚫 ${escapeHtml(check.reason)}</div>`}</div>`;
  }
}

function renderParkDrawer() {
  const inspectedPlayer = gameState.players[gameState.inspectedPlayerIdx];
  const isRO = gameState.inspectedPlayerIdx !== gameState.activePlayerIdx;
  const park = inspectedPlayer.parks.find(pk => pk.id === gameState.selectedParkId) || inspectedPlayer.parks[0];
  const hexObj = gameState.hexByKey.get(park.hexKey);
  const totMult = getTotalHexAttendanceMultiplier(hexObj, inspectedPlayer);
  const summary = calculateParkScoreSummary(park, inspectedPlayer);
  const prestige = calculateParkPrestigeMetrics(park, inspectedPlayer);
  const woodCounts = countParkWoodCoasters(park);

  document.getElementById("drawerParkTitle").textContent = `🎡 ${park.name}`;
  document.getElementById("drawerParkSub").textContent = `${hexObj ? hexObj.regionName : ''} • ${totMult}x Market • Score: ${summary.finalScore.toFixed(1)} pts • Market Saturation Efficiency: ${(summary.marketSaturationEfficiency * 100).toFixed(0)}% • Place-making: ${(prestige.placeMakingIndex * 100).toFixed(0)}%`;
  const identityBadges = {
    thrill: { label: "🎢 Iron-Ride Thrill Park", style: "badge-red" },
    resort: { label: "🏰 Immersive Resort Destination", style: "badge-blue" },
    balanced: { label: "🎡 Balanced Regional Park", style: "badge-gold" }
  };
  const identityBadge = identityBadges[prestige.identity];
  const identityElement = document.getElementById("drawerParkIdentity");
  identityElement.textContent = identityBadge.label;
  identityElement.className = `badge ${identityBadge.style}`;

  let html = `<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.35rem;"><div><div style="font-size:.72rem;color:var(--text-muted);">Wood Coasters: <strong>${woodCounts.totalWood}/4</strong> (Classic: ${woodCounts.classicWood}/2) • Woods Cleared: <strong>${park.expansionsBought}/${park.maxExpansions}</strong></div><div style="margin-top:.28rem;display:flex;gap:.28rem;flex-wrap:wrap;">${summary.hasGuestServices ? '<span class="badge badge-green">ℹ️ Guest Services OK</span>' : '<span class="badge badge-red">⚠️ No Guest Services (-5%)</span>'}${summary.hasBalancedBonus ? '<span class="badge badge-green">🌟 Balanced (+10%)</span>' : ''}${summary.infrastructureBottleneck ? '<span class="badge badge-red">⚠ Infrastructure Bottleneck: Build more F&amp;B, Services, or Plazas!</span>' : ''}${(park.recordTags || []).map(t => `<span class="badge badge-gold">🏆 ${escapeHtml(t)}</span>`).join("")}</div></div>${!isRO ? `<button class="icon-btn" onclick="openRenameModal('park', '${park.id}')">✏️ Rename Park</button>` : ''}</div></div>`;

  if (!isRO) {
    html += `<div class="card" style="padding:.7rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem;">
        <strong style="color:var(--accent-gold);">🎟️ Park Pricing</strong>
        <span class="badge badge-gold">$${Number(park.ticketPrice || 45).toFixed(0)} gate</span>
      </div>
      <div style="display:flex;align-items:center;gap:.45rem;justify-content:space-between;margin-bottom:.45rem;">
        <span style="font-size:.72rem;color:var(--text-muted);">Ticket Price</span>
        <div style="display:flex;align-items:center;gap:.25rem;">
          <button class="btn-outline btn-sm" onclick="setParkTicketPrice('${park.id}', ${(Number(park.ticketPrice) || 45) - 5})">−</button>
          <strong style="min-width:52px;text-align:center;color:var(--accent-gold);">$${Number(park.ticketPrice || 45).toFixed(0)}</strong>
          <button class="btn-outline btn-sm" onclick="setParkTicketPrice('${park.id}', ${(Number(park.ticketPrice) || 45) + 5})">+</button>
        </div>
      </div>
    </div>`;
  }

  // 1. SELECTED HEX TILE & RIDE INSPECTOR CARD
  const selTile = park.tiles.find(t => t.key === gameState.selectedCampusTileKey) || park.tiles[0];
  if (selTile) {
    const tileZone = getZoneForTile(park, selTile);
    const ride = selTile.rideId ? park.rides.find(r => r.id === selTile.rideId) : null;
    const effTileLv = getEffectiveTileThemeLevel(selTile);
    const nextTileTier = TILE_SCENERY_TIERS[effTileLv + 1];
    const nextTileCost = nextTileTier
      ? +getTileSceneryUpgradeCost(inspectedPlayer, effTileLv, nextTileTier).toFixed(2)
      : 0;

    html += `<div class="card" style="border-color:var(--accent-gold);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.35rem;">
        <strong style="color:var(--accent-gold);">📍 Selected Hex Tile (${selTile.q}, ${selTile.r})</strong>
        <span class="badge" style="background:${tileZone ? tileZone.color : '#334155'};color:#000;">${selTile.isEntrance ? 'Main Entrance' : (selTile.state === 'woods' ? '🌲 Undeveloped Woods' : (tileZone ? escapeHtml(tileZone.name) : 'Generic (Unzoned)'))}</span>
      </div>`;

    if (selTile.isEntrance) {
      html += `<div style="font-size:.76rem;color:var(--text-muted);">Park Main Entrance turnstiles. Guests enter the campus from this tile.</div>`;
    } else if (selTile.state === "woods") {
      const expansionCost = getParkExpansionCost(park);
      const canClear = !isRO && park.expansionsBought < park.maxExpansions && inspectedPlayer.cash >= expansionCost;
      html += `<div style="font-size:.75rem;color:var(--text-muted);margin-bottom:.45rem;">Undeveloped forest tile. Clear this hex to place rides or expand a Themed Land!</div>
      ${!isRO ? `<button class="btn-primary btn-sm" style="width:100%;" ${canClear ? '' : 'disabled'} onclick="clearWoodsHex('${park.id}','${selTile.key}')">🪓 Clear Woods Tile ($${expansionCost.toFixed(2)}M)</button>` : ''}`;
    } else {
      // Cleared Buildable Tile Inspector
      const themeMismatch = selTile.themeLevel > 0 && effTileLv === 0;
      html += `<div style="display:flex;justify-content:space-between;align-items:center;font-size:.75rem;margin-bottom:.45rem;">
        <span>Ground Scenery: <strong>${TILE_SCENERY_TIERS[effTileLv].name}</strong> (+${(TILE_SCENERY_TIERS[effTileLv].points * (tileZone ? 1.25 : 1.0)).toFixed(2)}p) ${themeMismatch ? '<span class="badge badge-red">Rezoned (Reset to 0)</span>' : ''}</span>
        ${(!isRO && nextTileTier) ? `<button class="btn-outline btn-sm" onclick="upgradeCampusTileScenery('${park.id}','${selTile.key}')">🎨 +Tile Theme ($${nextTileCost}M)</button>` : ''}
      </div>`;

      if (ride) {
        const rideScore = calculateRideTotalScore(ride, inspectedPlayer);
        const isWeenie = ride.facilityRole === "weenie";
        const effRideLv = getEffectiveRideThemeLevel(ride);
        const nextRideTier = RIDE_SCENERY_TIERS[effRideLv + 1];
        const catScale = isWeenie ? 2 : getCategorySceneryScale(ride.category);
        const rideInitMult = getPlayerRideSceneryMultiplier(inspectedPlayer, false);
        const rideUpgMult = getPlayerRideSceneryMultiplier(inspectedPlayer, true);
        const nextRideCost = nextRideTier ? +((effRideLv === 0 ? nextRideTier.cost * rideInitMult : nextRideTier.upgradeCost * rideUpgMult) * catScale).toFixed(2) : 0;
        const maintenanceCost = getRideMaintenanceCost(ride, inspectedPlayer);
        const repairCost = getRideRepairCost(ride);
        const refurbishCost = getRideRefurbishCost(ride, inspectedPlayer);
        const demolitionCost = getRideDemolitionCost(ride);
        const foodVenueLedger = ride.facilityRole === "restaurant"
          ? (ride.lastFbStats || { mealsSold: 0, grossRev: 0, cogs: 0, fixedOpEx: 0, netProfit: 0 })
          : null;

        html += `<div style="background:var(--bg-panel);border:1px solid var(--border-color);border-radius:8px;padding:.6rem;margin-top:.3rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong style="font-size:.88rem;color:var(--text-main);">${escapeHtml(ride.name)}</strong>
            <span class="badge badge-gold">${rideScore.toFixed(1)} pts</span>
          </div>
          <div style="font-size:.7rem;color:var(--text-muted);margin:.15rem 0;">
            ${escapeHtml(ride.modelName)} • ${isWeenie ? 'Weenie Building' : (ride.category === 'facility' ? 'Facility' : `${ride.lifespan}y lifespan`)}
            ${isWeenie ? '' : ` • Yr ${Number(ride.age || 0).toFixed(1)} • Condition ${(getRideAgeMultiplier(ride) * 100).toFixed(0)}%`}
            ${ride.smoothnessTier ? ` • <strong>${ride.smoothnessTier}</strong>` : ''}
          </div>
          <div style="font-size:.72rem;color:var(--accent-teal);margin-bottom:.4rem;">
            ${isWeenie ? 'Building' : 'Ride'} Theme: <strong>${RIDE_SCENERY_TIERS[effRideLv].name}</strong> (+${calculateRideSceneryPoints(ride).toFixed(1)}p)
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
            ${nextRideTier ? `<button class="btn-primary btn-sm" onclick="upgradeRideScenery('${park.id}','generic','${ride.id}')">🎨 +${isWeenie ? 'Building' : 'Ride'} Theme ($${nextRideCost}M)</button>` : ''}
            ${!isWeenie && ride.status === "needs_maintenance" ? `<button class="btn-gold btn-sm" title="Maintenance service: $${maintenanceCost.toFixed(2)}M, based on raw ride cost" onclick="payRideMaintenance('${park.id}','generic','${ride.id}')">🔧 Maint ($${maintenanceCost.toFixed(2)}M)</button>` : ''}
            ${!isWeenie && ride.status === "needs_repair" ? `<button class="btn-gold btn-sm" title="Repair: $${repairCost.toFixed(2)}M; raw base ride cost plus raw scenery, capped at 50% of base cost" onclick="payRideRepair('${park.id}','generic','${ride.id}')">🛠️ Repair ($${repairCost.toFixed(2)}M)</button>` : ''}
            ${!isWeenie && ride.status === "needs_inspection" ? `<button class="btn-gold btn-sm" onclick="payRideInspection('${park.id}','generic','${ride.id}')">🕵️ Inspect ($0.50M)</button>` : ''}
            ${ride.category !== "facility" ? `<button class="btn-outline btn-sm" title="Refurbish: $${refurbishCost.toFixed(2)}M; raw base ride cost plus raw scenery, capped at 50% of base cost" ${inspectedPlayer.cash < refurbishCost ? 'disabled' : ''} onclick="refurbishRide('${park.id}','${ride.id}')">🔄 Refurbish Ride ($${refurbishCost.toFixed(2)}M)</button>` : ''}
            <button class="icon-btn" onclick="openRenameModal('ride','${park.id}','generic','${ride.id}')">✏️ Rename</button>
            <button class="btn-danger btn-sm" style="margin-left:auto;" title="Demolition: $${demolitionCost.toFixed(2)}M; existing ground scenery is preserved" ${inspectedPlayer.cash < demolitionCost ? 'disabled' : ''} onclick="demolishSingleRide('${park.id}','generic','${ride.id}')">🗑️ Demolish / Replace ($${demolitionCost.toFixed(2)}M)</button>
          </div>` : ''}
        </div>`;
      } else if (!isRO) {
        html += `<button class="btn-gold btn-sm" style="width:100%;margin-top:.2rem;" onclick="openBuildModal('${selTile.key}')">➕ Construct Ride or Facility on This Hex</button>`;
        if (tileZone) {
          html += `<button class="btn-outline btn-sm" style="width:100%;margin-top:.25rem;" onclick="openWeenieModal('${park.id}','${selTile.key}')">🏰 Build Themed Weenie</button>`;
        }
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
      const usedThemes = new Set(park.zones.filter(z => z.id !== zEd.editingZoneId).map(z => z.themeId));
      const count = zEd.selectedKeys.size;
      const validCount = count >= 4 && count <= 12;

      html += `<div class="card" style="border-color:var(--accent-teal);background:rgba(6,182,212,.1);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.35rem;">
          <strong style="color:var(--accent-teal);">🖌️ Land Zoning Brush (${count}/12 Hexes — Min 4)</strong>
          <button class="icon-btn" onclick="cancelZoneEditor()">Cancel ✕</button>
        </div>
        <div style="font-size:.7rem;color:var(--text-muted);margin-bottom:.4rem;">Click cleared hexes on the map to add/remove them. (2-hex Coasters move together; rezoning resets mismatched themes to 0!)</div>
        <div class="land-theme-selector">
          ${LAND_THEMES.map(theme => {
            const taken = usedThemes.has(theme.id);
            const sel = zEd.themeId === theme.id;
            return `<button type="button" class="land-theme-option${sel ? " active" : ""}" ${taken ? "disabled" : ""} onclick="selectZoneEditorTheme('${theme.id}')" style="--theme-accent:${theme.badgeColor};--theme-border:${theme.borderColor};">${escapeHtml(theme.name)}</button>`;
          }).join("")}
        </div>
        <button class="btn-gold btn-sm" style="width:100%;" ${validCount ? '' : 'disabled'} onclick="saveZoneEditor('${park.id}')">✔ Save Themed Land (${count} Hexes)</button>
      </div>`;
    }
  }

  // 3. LIST OF DESIGNATED THEMED LANDS IN PARK
  for (const zone of park.zones) {
    const ev = evaluateThemedLandBreakdown(park, zone, inspectedPlayer);
    const theme = getLandTheme(zone.themeId);
    html += `<div class="card" style="border-left:4px solid ${theme.borderColor};">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <strong>${escapeHtml(zone.name)}</strong>
          <span class="badge land-theme-badge" style="--theme-accent:${theme.badgeColor};--theme-border:${theme.borderColor};margin-left:4px;">${escapeHtml(theme.name)} · ${ev.tileCount} Hexes</span>
        </div>
        <div style="display:flex;gap:.25rem;align-items:center;">
          <span class="badge badge-gold">${ev.finalLandScore.toFixed(1)}p</span>
          ${!isRO ? `<button class="icon-btn" onclick="startZoneEditor('${zone.id}')">🖌️ Edit</button>` : ''}
        </div>
      </div>
      <div style="font-size:.69rem;color:var(--text-muted);margin-top:.2rem;">
        Scenic: <strong>${ev.totalPlotScenic.toFixed(1)}p</strong> • ${LAND_HARMONY_TIERS[ev.harmonyTier].label}
        ${ev.weenieHarmonyBonus ? " • Weenie +10% Harmony" : ""}
      </div>
      ${!isRO ? (() => {
        const upgrade = getThemedLandTileUpgrade(park, zone, inspectedPlayer);
        const label = upgrade.tiles.length
          ? `🎨 Upgrade All Tiles (+1 tier) · $${upgrade.cost.toFixed(2)}M`
          : "✓ All Tiles Fully Upgraded";
        return `<button class="btn-outline btn-sm themed-land-upgrade" style="margin-top:.35rem;" ${upgrade.tiles.length && inspectedPlayer.cash >= upgrade.cost ? "" : "disabled"} onclick="upgradeThemedLandTiles('${park.id}','${zone.id}')">${label}</button>`;
      })() : ""}
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
  if (zoneId) {
    const z = park.zones.find(zn => zn.id === zoneId);
    if (!z) return;
    const keys = new Set(park.tiles.filter(t => t.zoneId === zoneId).map(t => t.key));
    gameState.zoneEditor = { active: true, themeId: getLandTheme(z.themeId).id, selectedKeys: keys, editingZoneId: z.id };
  } else {
    const usedThemes = new Set(park.zones.map(zone => zone.themeId));
    const availableTheme = LAND_THEMES.find(theme => !usedThemes.has(theme.id));
    if (!availableTheme) {
      alert("All seven land themes are already in use in this park.");
      return;
    }
    gameState.zoneEditor = { active: true, themeId: availableTheme.id, selectedKeys: new Set(), editingZoneId: null };
  }
  renderParkDrawer();
  requestAnimationFrame(drawMapCanvas);
}

function selectZoneEditorTheme(themeId) {
  const p = gameState.players[gameState.activePlayerIdx];
  const park = p.parks.find(pk => pk.id === gameState.selectedParkId);
  const alreadyUsed = park.zones.some(zone =>
    zone.themeId === themeId && zone.id !== gameState.zoneEditor.editingZoneId
  );
  if (!LAND_THEMES.some(theme => theme.id === themeId) || alreadyUsed) return;
  gameState.zoneEditor.themeId = themeId;
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
  const theme = LAND_THEMES.find(item => item.id === zEd.themeId);
  if (!theme || park.zones.some(zone =>
    zone.themeId === theme.id && zone.id !== zEd.editingZoneId
  )) return;

  let targetZoneId = zEd.editingZoneId;
  if (targetZoneId) {
    const z = park.zones.find(zn => zn.id === targetZoneId);
    z.name = `${theme.name} Land`;
    z.themeId = theme.id;
    z.color = theme.borderColor;
    // Remove tiles that were unchecked from this zone
    for (const t of park.tiles) {
      if (t.zoneId === targetZoneId && !zEd.selectedKeys.has(t.key)) t.zoneId = null;
    }
  } else {
    targetZoneId = nextUid("zone");
    park.zones.push({ id: targetZoneId, name: `${theme.name} Land`, themeId: theme.id, color: theme.borderColor });
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
  const expansionCost = getParkExpansionCost(park);
  if (!tile || tile.state !== "woods" || park.expansionsBought >= park.maxExpansions || player.cash < expansionCost) return;
  player.cash -= expansionCost;
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
  const cost = +getTileSceneryUpgradeCost(player, effLv, tierObj).toFixed(2);
  if (player.cash < cost) { alert(`Insufficient funds! Need $${cost}M.`); return; }

  player.cash -= cost;
  tile.themeLevel = nextLv;
  tile.themedForZoneId = currentZoneKey;
  updateParkHarmonyMilestones(park, player);
  renderAll();
}

function getThemedLandTileUpgrade(park, zone, player) {
  const tiles = park.tiles.filter(tile =>
    tile.state === "cleared" && tile.zoneId === zone.id &&
    getEffectiveTileThemeLevel(tile) < TILE_SCENERY_TIERS.length - 1
  );
  const cost = tiles.reduce((total, tile) => {
    const level = getEffectiveTileThemeLevel(tile);
    const nextTier = TILE_SCENERY_TIERS[level + 1];
    return total + +getTileSceneryUpgradeCost(player, level, nextTier).toFixed(2);
  }, 0);
  return { tiles, cost: +cost.toFixed(2) };
}

function upgradeThemedLandTiles(parkId, zoneId) {
  if (gameState.inspectedPlayerIdx !== gameState.activePlayerIdx) return;
  const player = gameState.players[gameState.activePlayerIdx];
  const park = player.parks.find(item => item.id === parkId);
  const zone = park?.zones.find(item => item.id === zoneId);
  if (!park || !zone) return;

  const upgrade = getThemedLandTileUpgrade(park, zone, player);
  if (!upgrade.tiles.length) return;
  if (player.cash < upgrade.cost) {
    alert(`Insufficient funds! Need $${upgrade.cost.toFixed(2)}M to upgrade all eligible tiles.`);
    return;
  }

  player.cash -= upgrade.cost;
  for (const tile of upgrade.tiles) {
    const currentLevel = getEffectiveTileThemeLevel(tile);
    tile.themeLevel = currentLevel + 1;
    tile.themedForZoneId = zone.id;
  }
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
  const totMult = getTotalHexAttendanceMultiplier(hex, player);
  const prices = getHexParkPricesForPlayer(player, hex);
  document.getElementById("buyParkModalHeader").textContent = `🗺️ Acquire Park in ${hex.regionName} (${trait.name} • ${totMult}x Att)`;
  document.getElementById("buyParkModalBody").innerHTML = `<div class="form-group"><label>New Park Name</label><div style="display:flex;gap:.5rem;"><input type="text" id="newParkNameInput" value="${generateRandomParkName()}"><button class="btn-outline btn-sm" onclick="document.getElementById('newParkNameInput').value=generateRandomParkName()">🎲</button></div></div><div class="form-group"><label for="newParkThemeSelect">Starting Land Theme</label><select id="newParkThemeSelect">${LAND_THEMES.map(theme => `<option value="${theme.id}">${escapeHtml(theme.name)}</option>`).join("")}</select></div><div class="card"><div style="display:flex;justify-content:space-between;align-items:center;"><div><strong>Small Park (11 Cleared Hexes)</strong><div style="font-size:.72rem;color:var(--text-muted);">+14 Woods Hexes ($${prices.smallExp}M/hex)</div></div><button class="btn-primary" ${player.cash < prices.smallCost ? 'disabled' : ''} onclick="purchaseNewParkOnHex('${hex.key}','small',${prices.smallCost},${prices.smallExp})">Buy $${prices.smallCost}M</button></div></div><div class="card"><div style="display:flex;justify-content:space-between;align-items:center;"><div><strong>Medium Park (19 Cleared Hexes)</strong><div style="font-size:.72rem;color:var(--text-muted);">+18 Woods Hexes ($${prices.mediumExp}M/hex)</div></div><button class="btn-primary" ${player.cash < prices.mediumCost ? 'disabled' : ''} onclick="purchaseNewParkOnHex('${hex.key}','medium',${prices.mediumCost},${prices.mediumExp})">Buy $${prices.mediumCost}M</button></div></div><div class="card"><div style="display:flex;justify-content:space-between;align-items:center;"><div><strong>Large Park (29 Cleared Hexes)</strong><div style="font-size:.72rem;color:var(--text-muted);">+20 Woods Hexes ($${prices.largeExp}M/hex)</div></div><button class="btn-primary" ${player.cash < prices.largeCost ? 'disabled' : ''} onclick="purchaseNewParkOnHex('${hex.key}','large',${prices.largeCost},${prices.largeExp})">Buy $${prices.largeCost}M</button></div></div>`;
  document.getElementById("buyParkModal").classList.add("active");
}

function purchaseNewParkOnHex(hexKey, tier, finalCost, expCost) {
  const player = gameState.players[gameState.activePlayerIdx];
  const hex = gameState.hexByKey.get(hexKey);
  if (!hex || hex.parkId || player.cash < finalCost) return;
  const pName = document.getElementById("newParkNameInput").value.trim() || generateRandomParkName();
  const themeId = document.getElementById("newParkThemeSelect").value;
  player.cash -= finalCost;

  const { tiles, maxExpansions } = generate49HexCampusDiamond(tier, 0);
  const newParkId = nextUid("park");
  hex.parkId = newParkId;
  hex.ownerId = player.id;

  const newPark = {
    id: newParkId, name: pName, hexKey: hex.key, tier, maxExpansions, expansionsBought: 0, expansionCost: expCost,
    eisnerDiscountRidesLeft: player.legend.id === "michael_eisner" ? 2 : 0, lastAttendance: 0, lastRollLabel: "—",
    yearsSinceLastAddition: 0, additionThisYear: true, attractionAddedThisYear: false, newCoasterBuiltThisYear: false,
    lastFoodAndBeverageLedger: null,
    tiles, themeId, zones: [], rides: [], plots: []
  };
  addLegendFreeShow(newPark, player.legend);
  syncParkPlotsMirror(newPark);
  player.parks.push(newPark);
  gameState.selectedParkId = newPark.id;
  addLog(`${player.ceoName} acquired "${pName}" in ${hex.regionName} ($${finalCost}M)!`);
  closeModal("buyParkModal");
  enterParkCampusView(newPark.id);
}

function getValidSecondHexOptions(park, primaryTile, modelId) {
  if (!primaryTile || primaryTile.state !== "cleared" || primaryTile.isEntrance || primaryTile.rideId) return [];
  const supportsSideBySide = ["rapids", "log_flume", "classic_wood"].includes(modelId);
  return park.tiles.filter(t =>
    t.state === "cleared" &&
    !t.isEntrance &&
    !t.rideId &&
    t.zoneId === primaryTile.zoneId &&
    (supportsSideBySide
      ? areCampusTilesAdjacent(primaryTile, t)
      : areCampusTilesDiagonalNeighbors(primaryTile, t))
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
    const cap = getParkOwner(park)?.legend.id === "george_milley" && model.id === "stage_show"
      ? 3
      : (model.maxPerPark || 1);
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

function openWeenieModal(parkId, tileKey) {
  const player = gameState.players[gameState.activePlayerIdx];
  const park = player.parks.find(item => item.id === parkId);
  const tile = park?.tiles.find(item => item.key === tileKey);
  const zone = tile && getZoneForTile(park, tile);
  if (!park || !tile || tile.state !== "cleared" || tile.isEntrance || tile.rideId || !zone) return;

  const theme = getLandTheme(zone.themeId);
  document.getElementById("weenieModalTitle").textContent = `🏰 ${theme.name} Weenies`;
  document.getElementById("weenieModalBody").innerHTML = `
    <p class="weenie-modal-note">Build only the landmark assigned to this land. Each weenie is limited to one per park, costs $25M to build, and can be themed separately using coaster scenery tiers.</p>
    <div class="weenie-card-grid">
      ${WEENIE_CATALOG.map(weenie => {
        const themeMatches = weenie.themeId === zone.themeId;
        const alreadyBuilt = park.rides.some(ride =>
          ride.facilityRole === "weenie" && ride.modelId === weenie.id
        );
        const canBuild = themeMatches && !alreadyBuilt && player.cash >= weenie.baseCost;
        const status = alreadyBuilt
          ? "Already built in this park"
          : !themeMatches
            ? `Requires ${getLandTheme(weenie.themeId).name}`
            : player.cash < weenie.baseCost
              ? "Insufficient funds"
              : "25 points · +10% land harmony · No upkeep";
        return `<article class="weenie-card${themeMatches ? " theme-match" : ""}">
          <canvas class="weenie-preview" width="140" height="110" data-weenie-preview="${weenie.id}" aria-label="${escapeHtml(weenie.name)} preview"></canvas>
          <div class="weenie-card-copy">
            <strong>${escapeHtml(weenie.name)}</strong>
            <small>${escapeHtml(getLandTheme(weenie.themeId).name)}</small>
            <small>${status}</small>
            <button class="btn-gold btn-sm" ${canBuild ? "" : "disabled"} onclick="buildWeenie('${park.id}','${tile.key}','${weenie.id}')">
              Build ($${weenie.baseCost}M)
            </button>
          </div>
        </article>`;
      }).join("")}
    </div>`;
  document.querySelectorAll("[data-weenie-preview]").forEach(canvas => {
    const weenie = WEENIE_CATALOG.find(item => item.id === canvas.dataset.weeniePreview);
    const ctx = canvas.getContext("2d");
    const pack = THEME_PACKS[weenie.themeId];
    pack.drawThemeGround(ctx, 70, 56, 40, pack.pack, false);
    drawCampusWeenie(ctx, { id: `preview-${weenie.id}`, modelId: weenie.id }, { px: 70, py: 56 });
  });
  document.getElementById("weenieModal").classList.add("active");
}

function buildWeenie(parkId, tileKey, weenieId) {
  const player = gameState.players[gameState.activePlayerIdx];
  const park = player.parks.find(item => item.id === parkId);
  const tile = park?.tiles.find(item => item.key === tileKey);
  const zone = tile && getZoneForTile(park, tile);
  const definition = WEENIE_CATALOG.find(item => item.id === weenieId);
  if (!park || !tile || !zone || !definition ||
      tile.state !== "cleared" || tile.isEntrance || tile.rideId ||
      zone.themeId !== definition.themeId ||
      park.rides.some(ride => ride.facilityRole === "weenie" && ride.modelId === definition.id)) {
    return;
  }
  if (player.cash < definition.baseCost) {
    alert(`Insufficient funds! Need $${definition.baseCost}M to build this weenie.`);
    return;
  }

  const ride = {
    id: nextUid("weenie"),
    modelId: definition.id,
    modelName: definition.name,
    name: definition.name,
    category: "facility",
    facilityRole: "weenie",
    baseBuildCost: definition.baseCost,
    techPoints: definition.techPoints,
    spaces: 1,
    zoneId: zone.id,
    primaryTileKey: tile.key,
    secondaryTileKey: null,
    themeLevel: 0,
    themedForZoneId: zone.id,
    totalInvestment: definition.baseCost,
    age: 0,
    status: "open",
    recordTags: []
  };
  player.cash -= definition.baseCost;
  park.rides.push(ride);
  tile.rideId = ride.id;
  tile.age = 0;
  syncParkPlotsMirror(park);
  updateParkHarmonyMilestones(park, player);
  gameState.selectedCampusTileKey = tile.key;
  closeModal("weenieModal");
  renderAll();
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
  const secondHexOptions = park.tiles.filter(tile =>
    tile.state === "cleared" && !tile.isEntrance && !tile.rideId &&
    tile.zoneId === primaryTile.zoneId && areCampusTilesAdjacent(primaryTile, tile));
  const catalogEl = document.getElementById("buildCatalogSection");
  catalogEl.innerHTML = "";

  const list = cat === "flat" ? FLAT_RIDE_CATALOG : (cat === "tracked" ? TRACKED_RIDE_CATALOG : (cat === "coaster" ? COASTER_CATALOG : FACILITY_CATALOG));
  if (cat === "coaster" && secondHexOptions.length === 0) {
    catalogEl.innerHTML = `<div class="card" style="color:var(--accent-red);">2-Hex Coasters require an open <strong>neighbor hex</strong> in the <strong>same Themed Land</strong> (or both Generic)!</div>`;
    clearRideInspector();
    return;
  }
  let firstBuildableModel = null;
  for (const m of list) {
    const isUnl = gameState.unlockedRides.has(m.id);
    const modelSecondHexOptions = m.spaces === 1
      ? []
      : getValidSecondHexOptions(park, primaryTile, m.id);
    const check = (cat === "tracked" || cat === "coaster") &&
      m.spaces !== 1 && modelSecondHexOptions.length === 0
      ? { allowed: false, reason: "Requires an open eligible neighboring hex" }
      : canBuildRideModelInPark(park, m, cat);
    const ownedCount = cat === "facility" ? 0 : countParkModelOccurrences(park, m.id);
    const duplicateMultiplier = ECONOMIC_BALANCING_RULES.duplicateScoreMultipliers[
      Math.min(ownedCount, ECONOMIC_BALANCING_RULES.duplicateScoreMultipliers.length - 1)
    ];
    const row = document.createElement("button");
    row.type = "button";
    row.className = "ride-list-row";
    row.dataset.modelId = m.id;
    row.disabled = !check.allowed;
    row.setAttribute("aria-label", `${m.name}, $${m.cost.toFixed(2)} million${check.allowed ? "" : `, unavailable: ${check.reason}`}`);
    const badges = [
      cat === "facility" ? "Facility" : (m.era === "advanced" ? "Advanced" : m.era),
      ownedCount ? `Duplicate ${Math.round(duplicateMultiplier * 100)}%` : "",
      !check.allowed ? check.reason : (!isUnl && m.researchCost > 0 ? "Research required" : "")
    ].filter(Boolean);
    row.innerHTML = `<span class="ride-mini-icon">${getRideCatalogIcon(m, cat)}</span>
      <span class="ride-list-copy"><strong>${escapeHtml(m.name)}</strong><small>Base $${m.cost.toFixed(2)}M</small>
      <span class="ride-list-badges">${badges.map((badge, index) => `<span class="badge ${!check.allowed && index === badges.length - 1 ? "badge-red" : "badge-teal"}">${escapeHtml(badge)}</span>`).join("")}</span></span>`;
    row.onclick = () => selectModelForCustomizer(m.id, cat);
    catalogEl.appendChild(row);
    if (check.allowed && !firstBuildableModel) firstBuildableModel = m;
  }
  if (firstBuildableModel) {
    selectModelForCustomizer(firstBuildableModel.id, cat);
  } else {
    clearRideInspector();
  }
}

function getRideCatalogIcon(model, category) {
  if (category === "facility") {
    if (model.facilityRole === "restaurant") return "🍽️";
    if (model.facilityRole === "guest_services") return "ℹ️";
    return "🚻";
  }
  if (model.id === "air_race") return "🎡";
  if (category === "coaster") return "🎢";
  if (category === "tracked") return model.id === "stage_show" ? "🎭" : "🌊";
  if (model.subType === "transport") return "🚂";
  if (model.subType === "family") return "🎠";
  return "🎢";
}

function clearRideInspector() {
  document.getElementById("buildCustomizerSection").style.display = "none";
  document.getElementById("ridePreviewName").textContent = "No available attractions";
  document.getElementById("ridePreviewCategory").textContent = "Unavailable";
  document.getElementById("ridePreviewStats").textContent = "";
  document.getElementById("ridePreviewGraphic").innerHTML = "<span>🎢</span>";
  document.getElementById("btnConfirmBuildRide").disabled = true;
  document.getElementById("btnConfirmBuildRide").textContent = "Build Attraction";
}

function getRideModelById(modelId, cat) {
  const catalog = cat === "flat" ? FLAT_RIDE_CATALOG :
    (cat === "tracked" ? TRACKED_RIDE_CATALOG :
    (cat === "coaster" ? COASTER_CATALOG : FACILITY_CATALOG));
  return catalog.find(model => model.id === modelId);
}

function getRideDisplayCategory(model, cat) {
  if (cat === "flat") return model.era === "advanced" ? "Advanced Flat Ride" : "Flat Ride";
  if (cat === "tracked") return ["log_flume", "rapids"].includes(model.id) ? "Water Ride" : "Tracked Ride";
  if (cat === "coaster") return "Roller Coaster";
  if (model.facilityRole === "restaurant") return "Food & Beverage";
  if (model.facilityRole === "guest_services") return "Guest Services";
  return "Facility";
}

function renderRidePreview(model, cat) {
  const categoryName = getRideDisplayCategory(model, cat);
  const player = gameState.players[gameState.activePlayerIdx];
  const baseRide = {
    category: cat,
    modelId: model.id,
    baseBuildCost: model.cost,
    totalInvestment: model.cost,
    age: 0
  };
  const upkeep = getRideAnnualUpkeep(baseRide, player);
  const basePoints = model.points ?? (cat === "coaster"
    ? (model.baseLen / 100) * 0.25 + (model.baseHeight / 20) * 0.5 + (model.baseInv || 0)
    : 0);
  document.getElementById("ridePreviewName").textContent = model.name;
  document.getElementById("ridePreviewCategory").textContent = categoryName;
  document.getElementById("ridePreviewStats").innerHTML = `
    <span>Base $${model.cost.toFixed(2)}M</span>
    <span>Upkeep $${upkeep.toFixed(2)}M/year</span>
    <span>Base ${Number(basePoints).toFixed(1)} pts</span>
    ${model.researchCost > 0 && !gameState.unlockedRides.has(model.id) ? `<span>Research $${(model.researchCost * getPlayerResearchFeeMultiplier(player)).toFixed(2)}M</span>` : ""}`;
  const graphic = document.getElementById("ridePreviewGraphic");
  const drawNames = {
    air_race: "drawAirRace", bumper_cars: "drawBumperCars", carousel: "drawCarousel",
    chair_swings: "drawChairSwing", claw: "drawClaw", drop_tower: "drawDropTower",
    enterprise: "drawEnterprise", ferris_wheel: "drawFerrisWheel", flyer: "drawFlyerRide",
    giant_discovery: "drawGiantDiscovery", pirate_ship: "drawPirateShip", scrambler: "drawScrambler",
    sky_fly: "drawSkyFly", top_spin: "drawTopSpin", disco: "drawDiskO",
    log_flume: "drawFlumeSide", rapids: "drawRapidsSide", stage_show: "drawTheater",
    toilets: "drawRestrooms", guest_services: "drawGuestServices", train: "drawTrainStation",
    classic_wood: "drawWoodCoasterSide"
  };
  const drawRide = window[drawNames[model.id]];
  if (!drawRide) {
    graphic.innerHTML = `<span>${getRideCatalogIcon(model, cat)}</span>`;
    return;
  }
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 240;
  graphic.replaceChildren(canvas);
  const ctx = canvas.getContext("2d");
  drawRide(ctx, 160, 155, 72, {
    accent: "#0284c7", tile: false, t: 0.7, fly: 0.5, tilt: 1.1, r: 0.7, tm: 0
  });
}

function selectModelForCustomizer(modelId, cat) {
  gameState.buildContext.selectedModelId = modelId;
  gameState.buildContext.category = cat;
  document.querySelectorAll(".ride-list-row").forEach(row => row.classList.toggle(
    "active", row.dataset.modelId === modelId
  ));
  const customizerEl = document.getElementById("buildCustomizerSection");
  const slidersEl = document.getElementById("customSlidersContainer");
  customizerEl.style.display = "flex";
  slidersEl.innerHTML = "";
  const player = gameState.players[gameState.activePlayerIdx];
  const park = player.parks.find(pk => pk.id === gameState.selectedParkId);
  const primaryTile = park.tiles.find(t => t.key === gameState.buildContext.plotId);
  const model = getRideModelById(modelId, cat);

  document.getElementById("customizerModelTitle").textContent = `Configure ${model.name}`;
  renderRidePreview(model, cat);
  document.getElementById("customRideName").value = cat === "facility" ? model.name : generateRandomRideName();
  populateInitialSceneryDropdown(cat);
  document.getElementById("customRideTheme").value = "0";
  const secondHexOptions = getValidSecondHexOptions(park, primaryTile, model.id);

  let diagSelectHTML = "";
  if (cat === "coaster" || (cat === "tracked" && model.spaces !== 1)) {
    diagSelectHTML = `<div class="form-group"><label>Second Neighbor Hex (Same Land)</label><select id="selectSecondDiagTile">${secondHexOptions.map(tile => {
      const orientation = getMultiTileRideOrientation(primaryTile, tile);
      const direction = orientation === "side" ? "Side-by-side" : `Diagonal ${orientation}`;
      return `<option value="${tile.key}">${direction} (${tile.q}, ${tile.r})</option>`;
    }).join("")}</select></div>`;
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
    document.getElementById("previewSmoothnessOdds").textContent = model.spaces === 1
      ? "Occupies 1 hex tile. Tracked Ride Scenery costs 2x base price."
      : "Occupies 2 diagonal hexes. Tracked Ride Scenery costs 2x base price.";
  } else {
    let h = diagSelectHTML;
    if (!model.fixed) {
      h += `<div class="form-group"><label>Track Length: <strong id="lblCoasterLen">${model.baseLen} ft</strong></label><input type="range" id="sliderCoasterLen" min="${model.baseLen}" max="${model.maxLen}" step="${model.lenStep}" value="${model.baseLen}" oninput="updateCustomizerPreview()"></div><div class="form-group"><label>Peak Height: <strong id="lblCoasterHeight">${model.baseHeight} ft</strong></label><input type="range" id="sliderCoasterHeight" min="${model.baseHeight}" max="${model.maxHeight}" step="${model.heightStep}" value="${model.baseHeight}" oninput="updateCustomizerPreview()"></div>${model.canInvert ? `<div class="form-group"><label>Inversions: <strong id="lblCoasterInv">${model.baseInv}</strong></label><input type="range" id="sliderCoasterInv" min="${model.baseInv}" max="${model.maxInv}" step="1" value="${model.baseInv}" oninput="updateCustomizerPreview()"></div>` : ''}`;
    }
    slidersEl.innerHTML = h;
    document.getElementById("previewSmoothnessOdds").textContent = hasCustomTrait(player, "pos_auto_smooth") ? "✨ Guaranteed Smooth Coaster! (2 neighboring hexes)" : `Smoothness Odds (${model.gen.toUpperCase()}) • Occupies 2 neighboring hexes.`;
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
    return { cat: "facility", model, totalCost: model.cost + themeCost, baseBuildCost: model.cost, resFee: 0, techPoints: 0, scenicPoints: themeObj.points * zoneMult, themeLevel, notes: ["Facility Scenery is 50% off"] };
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
    return { cat: "flat", model, totalCost: rawBuildCost * mult + themeCost + resFee, baseBuildCost: rawBuildCost, resFee, techPoints, scenicPoints: themeObj.points * zoneMult, themeLevel, height, stations, notes };
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
    return { cat: "tracked", model, totalCost: rawBuildCost * mult + themeCost + resFee, baseBuildCost: rawBuildCost, resFee, techPoints, scenicPoints: themeObj.points * zoneMult, themeLevel, length, height, notes };
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
    return { cat: "coaster", model, totalCost: rawBuildCost * mult + themeCost + resFee, baseBuildCost: rawBuildCost, resFee, techPoints: (length / 100) * 0.25 + (height / 20) * 0.5 + inversions * 1.0, scenicPoints: themeObj.points * zoneMult, themeLevel, length, height, inversions, notes };
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
  btn.textContent = canAfford ? `Build Attraction ($${specs.totalCost.toFixed(2)}M)` : `Insufficient Funds ($${specs.totalCost.toFixed(2)}M)`;
}

function confirmBuildRide() {
  const specs = calculateCustomizedRideSpecs();
  if (!specs) return;
  const player = gameState.players[gameState.activePlayerIdx];
  const park = player.parks.find(pk => pk.id === gameState.selectedParkId);
  const primaryTile = park.tiles.find(t => t.key === gameState.buildContext.plotId);
  if (!primaryTile || primaryTile.rideId || player.cash < specs.totalCost) return;
  const requiresSecondHex = specs.cat === "coaster" ||
    (specs.cat === "tracked" && specs.model.spaces !== 1);
  const selectedSecondTile = requiresSecondHex
    ? park.tiles.find(tile => tile.key === document.getElementById("selectSecondDiagTile")?.value)
    : null;
  if (requiresSecondHex && (!selectedSecondTile ||
    !getValidSecondHexOptions(park, primaryTile, specs.model.id)
      .some(tile => tile.key === selectedSecondTile.key))) return;

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
    baseBuildCost: specs.baseBuildCost,
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
    setRideAge(park, fac, fac.age);
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
          techPoints: perPts, totalInvestment: (specs.totalCost - specs.resFee) / specs.stations,
          baseBuildCost: specs.baseBuildCost / specs.stations, lifespan: 20,
          isTrainStation: true, trainGroupId: tgId, trainLineColor: originColor
        };
        tTile.rideId = stRide.id;
        park.rides.push(stRide);
        setRideAge(park, stRide, stRide.age);
        placed++;
      }
    } else {
      const flRide = { ...baseProps, id: nextUid("ride"), name: customName, category: "flat", subType: specs.model.subType, spaces: 1, techPoints: specs.techPoints, height: specs.height, lifespan: 20 };
      primaryTile.rideId = flRide.id;
      park.rides.push(flRide);
      setRideAge(park, flRide, flRide.age);
    }
    addNewsHeadline("ride", generateRideAdditionHeadline(player.ceoName, park.name, zoneName, customName, specs.model.name, park.rides.length, null));
  } else if (specs.cat === "tracked") {
    const secTile = selectedSecondTile;
    const trRide = { ...baseProps, id: nextUid("ride"), name: customName, category: "tracked", subType: specs.model.subType, spaces: specs.model.spaces || 2, secondaryTileKey: secTile ? secTile.key : null, techPoints: specs.techPoints, length: specs.length, height: specs.height, lifespan: specs.model.lifespan || 20 };
    primaryTile.rideId = trRide.id;
    if (secTile) {
      secTile.rideId = trRide.id;
      secTile.isSecondaryHex = true;
    }
    park.rides.push(trRide);
    setRideAge(park, trRide, trRide.age);
    addNewsHeadline("ride", generateRideAdditionHeadline(player.ceoName, park.name, zoneName, customName, specs.model.name, park.rides.length, null));
  } else {
    const secTile = selectedSecondTile;
    const sm = rollCoasterSmoothness(player, specs.model.gen);
    const coRide = { ...baseProps, id: nextUid("ride"), name: customName, category: "coaster", track: specs.model.track, gen: specs.model.gen, spaces: 2, secondaryTileKey: secTile.key, length: specs.length, height: specs.height, inversions: specs.inversions, smoothnessTier: sm.tier, smoothnessPenalty: sm.penalty, lifespan: specs.model.lifespan };
    primaryTile.rideId = coRide.id;
    secTile.rideId = coRide.id;
    secTile.isSecondaryHex = true;
    park.rides.push(coRide);
    setRideAge(park, coRide, coRide.age);
    addNewsHeadline("ride", generateRideAdditionHeadline(player.ceoName, park.name, zoneName, customName, specs.model.name, park.rides.length, sm.tier));
  }

  if (specs.cat !== "facility") {
    park.yearsSinceLastAddition = 0;
    park.additionThisYear = true;
    park.attractionAddedThisYear = true;
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
  const categoryScale = ride.facilityRole === "weenie" ? 2 : getCategorySceneryScale(ride.category);
  const cost = +((effLv === 0 ? tierObj.cost : tierObj.upgradeCost) * categoryScale * getPlayerRideSceneryMultiplier(player, effLv > 0)).toFixed(2);
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
  const cost = getRideMaintenanceCost(ride, player);
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
  const cost = getRideRepairCost(ride);
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

function refurbishRide(parkId, rideId) {
  const player = gameState.players[gameState.activePlayerIdx];
  const park = player.parks.find(item => item.id === parkId);
  const ride = park?.rides.find(item => item.id === rideId);
  if (!park || !ride || ride.category === "facility") return;
  const cost = getRideRefurbishCost(ride, player);
  if (player.cash < cost) return;
  player.cash -= cost;
  setRideAge(park, ride, ECONOMIC_BALANCING_RULES.rideAgeGraceYears);
  ride.refurbCount = (ride.refurbCount || 0) + 1;
  ride.pendingEolDecision = false;
  ride.immunityTurns = 3;
  renderAll();
}

function refurbishEndOfLifeRide(parkId, plotId, rideId) {
  const player = gameState.players.find(p => p.parks.some(pk => pk.id === parkId));
  const park = player.parks.find(pk => pk.id === parkId);
  const ride = park.rides.find(r => r.id === rideId);
  if (!ride) return;
  const cost = getRideRefurbishCost(ride, player);
  if (player.cash < cost) return;
  player.cash -= cost;
  setRideAge(park, ride, 0);
  ride.refurbCount = (ride.refurbCount || 0) + 1;
  ride.pendingEolDecision = false;
  ride.immunityTurns = 3;
  renderReportPage4();
  renderAll();
}

function removeRideFromCampus(park, rideId) {
  const idx = park.rides.findIndex(r => r.id === rideId);
  if (idx === -1) return;
  for (const t of park.tiles) {
    if (t.rideId === rideId) { t.rideId = null; t.age = undefined; t.isSecondaryHex = false; }
  }
  park.rides.splice(idx, 1);
  syncParkPlotsMirror(park);
}

function letEndOfLifeRideDemolish(parkId, plotId, rideId) {
  const player = gameState.players.find(p => p.parks.some(pk => pk.id === parkId));
  const park = player.parks.find(pk => pk.id === parkId);
  const ride = park.rides.find(item => item.id === rideId);
  if (!ride) return;
  const cost = getRideDemolitionCost(ride);
  if (player.cash < cost) return;
  player.cash -= cost;
  removeRideFromCampus(park, rideId);
  renderReportPage4();
  renderAll();
}

function demolishSingleRide(parkId, plotId, rideId) {
  const player = gameState.players[gameState.activePlayerIdx];
  const park = player.parks.find(pk => pk.id === parkId);
  const ride = park?.rides.find(item => item.id === rideId);
  if (!park || !ride) return;
  const cost = getRideDemolitionCost(ride);
  if (player.cash < cost) return;
  player.cash -= cost;
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
    totalInvestment: model.cost, baseBuildCost: model.cost, age: 0, lifespan: model.lifespan || 30,
    refurbCount: 0, cultClassic: false, cultChecked: false, status: "open",
    immuneToIssues: true, immunityTurns: 0, recordTags: []
  };
  bot.cash -= model.cost;
  tile.rideId = facility.id;
  park.rides.push(facility);
  setRideAge(park, facility, facility.age);
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
    totalInvestment: plan.investedCost, baseBuildCost: model.cost, age: 0, refurbCount: 0,
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
  setRideAge(park, ride, ride.age);
  park.yearsSinceLastAddition = 0;
  park.additionThisYear = true;
  park.attractionAddedThisYear = true;
  if (category === "coaster") park.newCoasterBuiltThisYear = true;
  syncParkPlotsMirror(park);
  return true;
}

function createAIThemedLands(park, desiredLandCount = 2, preferredThemeId = park.themeId) {
  const usedThemes = new Set(park.zones.map(zone => zone.themeId));
  const palette = LAND_THEMES.filter(theme => !usedThemes.has(theme.id));
  const preferred = palette.find(theme => theme.id === preferredThemeId);
  if (preferred) palette.unshift(palette.splice(palette.indexOf(preferred), 1)[0]);
  const tiles = park.tiles.filter(tile => tile.state === "cleared" && !tile.isEntrance);
  const landCount = Math.min(desiredLandCount, palette.length, Math.max(1, Math.ceil(tiles.length / 8)));
  const chunkSize = Math.ceil(tiles.length / landCount);
  for (let i = 0; i < landCount; i++) {
    const theme = palette[i];
    if (!theme) break;
    const zone = { id: nextUid("zone"), name: `${theme.name} Land`, themeId: theme.id, color: theme.borderColor };
    park.zones.push(zone);
    for (const tile of tiles.slice(i * chunkSize, (i + 1) * chunkSize)) tile.zoneId = zone.id;
  }
}

function initializeAIPurchasedPark(bot, park) {
  createAIThemedLands(park, park.tier === "small" ? 2 : 3, park.themeId);
  const mainZone = park.zones[0];
  const facilityModels = ["guest_services", "toilets", "restaurant"];
  for (const id of facilityModels) {
    const model = FACILITY_CATALOG.find(item => item.id === id);
    const tile = getAIOpenCampusTiles(park).find(item => item.zoneId === mainZone.id);
    if (!tile || bot.cash < model.cost) continue;
    buildAIFacility(bot, park, tile, model);
  }
  addLegendFreeShow(park, bot.legend);
  syncParkPlotsMirror(park);
}

function countAIParkAttractions(park) {
  return park.rides.filter(ride => ride.category !== "facility").length;
}

function canAIExpandChain(bot) {
  return bot.parks.length < 6 &&
    bot.parks.every(park => countAIParkAttractions(park) >= 3);
}

function getAIMandatoryParkTarget(year) {
  if (year >= 25) return 3;
  if (year >= 15) return 2;
  return 0;
}

function getAIExpansionCandidates(bot) {
  return gameState.hexGrid
    .filter(hex => canPlayerBuildParkOnHex(bot, hex).allowed)
    .map(hex => {
      const nearestOwnPark = bot.parks.reduce((nearest, park) => {
        const parkHex = gameState.hexByKey.get(park.hexKey);
        return parkHex ? Math.min(nearest, hexDistance(hex, parkHex)) : nearest;
      }, Infinity);
      return {
        hex,
        attendance: getTotalHexAttendanceMultiplier(hex, bot),
        prices: getHexParkPricesForPlayer(bot, hex),
        spacing: nearestOwnPark >= 3 ? 2 : (nearestOwnPark >= 2 ? 1 : 0)
      };
    })
    .sort((a, b) => b.spacing - a.spacing || b.attendance - a.attendance);
}

function getAIExpansionSavingsReserve(bot) {
  const candidates = getAIExpansionCandidates(bot);
  if (!candidates.length) return 0;
  return Math.min(...candidates.map(candidate => candidate.prices.smallCost));
}

function buyAIPark(bot, mandatory = false) {
  if (!canAIExpandChain(bot)) return false;
  const candidates = getAIExpansionCandidates(bot);
  for (const candidate of candidates) {
    let tier, cost, expansionCost;
    const isAngusEarly = bot.legend.id === "angus_wynne" && gameState.year < 20;
    if (mandatory) {
      tier = "small";
      cost = candidate.prices.smallCost;
      expansionCost = candidate.prices.smallExp;
    } else if (isAngusEarly && bot.cash >= candidate.prices.smallCost + 8) {
      tier = "small"; cost = candidate.prices.smallCost; expansionCost = candidate.prices.smallExp;
    } else if (bot.cash >= candidate.prices.largeCost + 12) {
      tier = "large"; cost = candidate.prices.largeCost; expansionCost = candidate.prices.largeExp;
    } else if (bot.cash >= candidate.prices.mediumCost + 8) {
      tier = "medium"; cost = candidate.prices.mediumCost; expansionCost = candidate.prices.mediumExp;
    } else if (bot.legend.id === "angus_wynne" && bot.cash >= candidate.prices.smallCost + 8) {
      tier = "small"; cost = candidate.prices.smallCost; expansionCost = candidate.prices.smallExp;
    } else continue;

    if (mandatory && bot.cash < cost + 8) {
      const subsidy = +(cost + 8 - bot.cash).toFixed(2);
      bot.cash += subsidy;
      addLog(`${bot.ceoName} received a $${subsidy.toFixed(2)}M expansion subsidy to meet its park-growth milestone.`);
    }

    bot.cash -= cost;
    const { tiles, maxExpansions } = generate49HexCampusDiamond(tier, 0);
    const park = {
      id: nextUid("park"), name: generateRandomParkName(), hexKey: candidate.hex.key,
      tier, maxExpansions, expansionsBought: 0, expansionCost,
      eisnerDiscountRidesLeft: bot.legend.id === "michael_eisner" ? 2 : 0,
      lastAttendance: 0, lastRollLabel: "—", yearsSinceLastAddition: 0,
      additionThisYear: true, attractionAddedThisYear: false, newCoasterBuiltThisYear: false,
      lastFoodAndBeverageLedger: null, tiles, themeId: getPreferredLandThemeId(bot.legend), zones: [], rides: [], plots: []
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
  const reserve = profile.reserve;
  const maxRidesPerTurn = profile.oneRidePerTurn ? 1 : 3;
  const milestoneParkTarget = getAIMandatoryParkTarget(gameState.year);
  const savingForExpansion = bot.parks.length < milestoneParkTarget;
  const expansionSavingsReserve = savingForExpansion && canAIExpandChain(bot)
    ? getAIExpansionSavingsReserve(bot)
    : 0;
  const rideReserve = Math.max(reserve, expansionSavingsReserve);

  for (const park of bot.parks) {
    const parkSummary = calculateParkScoreSummary(park, bot);
    const projectedAttendance = parkSummary.finalScore * 10000 *
      getTotalHexAttendanceMultiplier(gameState.hexByKey.get(park.hexKey), bot);
    if (projectedAttendance >= 3000000) {
      for (const ride of park.rides) {
        if (ride.category === "facility" || (ride.age || 0) <= 15) continue;
        const refurbishCost = getRideRefurbishCost(ride, bot);
        if (bot.cash < refurbishCost) continue;
        bot.cash -= refurbishCost;
        setRideAge(park, ride, ECONOMIC_BALANCING_RULES.rideAgeGraceYears);
        ride.refurbCount = (ride.refurbCount || 0) + 1;
        ride.pendingEolDecision = false;
        ride.immunityTurns = 3;
      }
    }

    for (const ride of park.rides) {
      let cost = 0;
      if (ride.status === "needs_inspection") cost = 0.5;
      else if (ride.status === "needs_repair") cost = getRideRepairCost(ride);
      else if (ride.status === "needs_maintenance") cost = getRideMaintenanceCost(ride, bot);
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
    const expansionCost = getParkExpansionCost(park);
    if (openTiles.length < 4 && park.expansionsBought < park.maxExpansions) {
      for (let cleared = 0; cleared < 3 && bot.cash >= expansionCost + 4 &&
        park.expansionsBought < park.maxExpansions; cleared++) {
        const clearedTiles = park.tiles.filter(tile => tile.state === "cleared");
        const woodsTile = park.tiles.find(tile => tile.state === "woods" &&
          clearedTiles.some(clearedTile => areCampusTilesAdjacent(clearedTile, tile)));
        if (!woodsTile) break;
        bot.cash -= expansionCost;
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
    if (unzonedTiles.length >= 4 && park.zones.length < LAND_THEMES.length) {
      const availableThemes = LAND_THEMES.filter(theme =>
        !park.zones.some(zone => zone.themeId === theme.id));
      const preferredTheme = availableThemes.find(theme =>
        theme.id === getPreferredLandThemeId(bot.legend));
      const theme = preferredTheme || availableThemes[0];
      if (theme) {
        const zone = {
          id: nextUid("zone"),
          name: `${theme.name} Land`,
          themeId: theme.id,
          color: theme.borderColor
        };
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
        (category === "tracked"
          ? [...freeTiles.map(tile => [tile, null]), ...freeTiles.flatMap(tile =>
            park.tiles.filter(second => second.state === "cleared" && !second.isEntrance &&
              !second.rideId && second.zoneId === tile.zoneId &&
              areCampusTilesAdjacent(tile, second)).map(second => [tile, second]))]
          : freeTiles.flatMap(tile => park.tiles.filter(second => second.state === "cleared" &&
            !second.isEntrance && !second.rideId && second.zoneId === tile.zoneId &&
            areCampusTilesAdjacent(tile, second)).map(second => [tile, second])));
      if (!pairOptions.length) {
        if (category !== "flat" &&
          !(bot.legend.id === "michael_eisner" && park.eisnerDiscountRidesLeft > 0)) {
          const flatModel = FLAT_RIDE_CATALOG.find(model =>
            isModelEraAvailable(model.era) &&
            (!["family", "thrill", "transport"].includes(missingPortfolioCategory) ||
              model.subType === missingPortfolioCategory) &&
            canBuildRideModelInPark(park, model, "flat").allowed);
          const tile = freeTiles[0];
          const plan = flatModel && getAIRideBuildPlan(bot, park, flatModel, "flat", rideReserve);
          if (flatModel && plan && buildAIRide(bot, park, "flat", flatModel, tile, null, plan)) continue;
        }
        break;
      }

      const options = [];
      for (const model of catalog) {
        if (!isModelEraAvailable(model.era) || !canBuildRideModelInPark(park, model, category).allowed) continue;
        if (category === "flat" && ["family", "thrill", "transport"].includes(missingPortfolioCategory) &&
          model.subType !== missingPortfolioCategory) continue;
        const plan = getAIRideBuildPlan(bot, park, model, category, rideReserve);
        if (!plan) continue;
        for (const [primaryTile, secondTile] of pairOptions) {
          if (category === "tracked" && (model.spaces === 1) !== (secondTile === null)) continue;
          if (category !== "flat" && model.spaces !== 1 &&
            (!secondTile || !getValidSecondHexOptions(park, primaryTile, model.id)
              .some(tile => tile.key === secondTile.key))) continue;
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

    for (const restaurant of park.rides.filter(ride => ride.category === "facility" &&
      ride.facilityRole === "restaurant" && ride.status === "open")) {
      const fairPrice = getRestaurantMealPricingState(park, restaurant).fairMealPrice;
      const undercut = ["jim_reid", "john_arie"].includes(bot.legend.id) ? 1 : 0;
      restaurant.mealPrice = Math.max(FOOD_AND_BEVERAGE_RULES.minMealPrice,
        Math.min(FOOD_AND_BEVERAGE_RULES.maxMealPrice, Math.round(fairPrice - undercut)));
    }

    const targetTier = Math.min(profile.targetThemeTier,
      gameState.year < 12 ? 1 : (gameState.year < 25 ? 2 :
        (["walt_disney", "roland_mack"].includes(bot.legend.id) ? 4 : 3)));
    const sceneryTargets = [];
    for (const zone of park.zones) {
      for (const tile of park.tiles.filter(item => item.zoneId === zone.id && item.state === "cleared")) {
        if (!tile.rideId) continue;
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
      if (savingForExpansion || bot.cash <= reserve || item.level >= targetTier) continue;
      const nextLevel = item.level + 1;
      let cost;
      if (item.type === "tile") {
        const tier = TILE_SCENERY_TIERS[nextLevel];
        cost = (item.level === 0 ? tier.cost * getPlayerPlotSceneryMultiplier(bot, false) :
          tier.upgradeCost * getPlayerPlotSceneryMultiplier(bot, true));
      } else {
        const tier = RIDE_SCENERY_TIERS[nextLevel];
        cost = (item.level === 0 ? tier.cost : tier.upgradeCost) *
          (item.target.facilityRole === "weenie" ? 2 : getCategorySceneryScale(item.target.category)) *
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
  if (bot.parks.length >= 6 || !canAIExpandChain(bot)) return;

  const needsMilestonePark = bot.parks.length < milestoneParkTarget;
  const milestoneDue = milestoneParkTarget === 2
    ? gameState.year >= 20
    : milestoneParkTarget === 3 && gameState.year >= 30;
  if (needsMilestonePark && milestoneDue) {
    buyAIPark(bot, true);
  } else if (needsMilestonePark) {
    if (bot.cash >= expansionSavingsReserve) buyAIPark(bot);
  } else if (needsCapacity || expansionistPurchase) {
    buyAIPark(bot);
  }
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
  const attendanceRows = [], awardsGiven = [];
  for (const player of gameState.players) {
    let chainAtt = 0, chainGateRevenue = 0, chainFoodGross = 0, chainFoodCogs = 0, chainFoodProfit = 0;
    let chainRideUpkeep = 0;
    let hadAccidentInChain = false;
    player.ridesBuiltThisTurn = 0;
    for (const park of player.parks) {
      if (park.additionThisYear) park.yearsSinceLastAddition = 0;
      else park.yearsSinceLastAddition = (park.yearsSinceLastAddition || 0) + 1;
      const summary = calculateParkScoreSummary(park, player);
      const prestige = calculateParkPrestigeMetrics(park, player);
      const hexMarketMult = getTotalHexAttendanceMultiplier(
        gameState.hexByKey.get(park.hexKey),
        player
      );
      const rollObj = WEATHER_ROLL_TABLE[Math.floor(Math.random() * WEATHER_ROLL_TABLE.length)];
      const weatherMult = prestige.placeMakingIndex >= 0.5 && rollObj.mult < 1
        ? 1 - (1 - rollObj.mult) * 0.5
        : rollObj.mult;
      let attendancePotential = summary.finalScore * 10000 *
        hexMarketMult * weatherMult * tourismClimate.mult;
      if (park.attractionAddedThisYear && player.legend.id === "mark_woodburry") {
        attendancePotential *= 1.02;
      }
      if (prestige.identity === "thrill" && park.newCoasterBuiltThisYear) attendancePotential *= 1.12;
      if (prestige.identity === "thrill" && prestige.placeMakingIndex < 0.35 &&
          park.yearsSinceLastAddition >= 2) {
        const stagnationPenalty = Math.min(0.15, (park.yearsSinceLastAddition - 1) * 0.05);
        attendancePotential *= 1 - stagnationPenalty;
      }
      if (park.freakAccidentThisYear) {
        attendancePotential *= 0.70;
        hadAccidentInChain = true;
      }
      const saturatedAttendance = convertAttendanceWithSaturation(attendancePotential).attendance;
      const infrastructure = calculateParkInfrastructureSupport(park, player, saturatedAttendance);
      const guestRevenueFactor = 1 - infrastructure.penalty;
      const parkAtt = Math.round(saturatedAttendance * guestRevenueFactor);
      park.infrastructureSupportShare = infrastructure.supportShare;
      park.currentInfrastructurePenalty = infrastructure.penalty;
      const gateRevenue = parkAtt / 100000 * guestRevenueFactor;
      const foodLedger = calculateParkFoodAndBeverageLedger(
        park,
        parkAtt,
        player,
        prestige,
        guestRevenueFactor
      );
      park.lastFoodAndBeverageLedger = foodLedger;
      const parkRev = gateRevenue * player.revenueMult;
      const parkFoodGross = foodLedger.grossRevenue * player.revenueMult;
      const parkFoodCogs = foodLedger.cogs * player.revenueMult;
      const parkFoodProfit = foodLedger.netProfit;
      const parkUpkeep = park.rides.reduce((total, ride) =>
        total + getRideAnnualUpkeep(ride, player), 0);
      park.lastAttendance = parkAtt;
      chainAtt += parkAtt;
      chainGateRevenue += parkRev;
      chainFoodGross += parkFoodGross;
      chainFoodCogs += parkFoodCogs;
      chainFoodProfit += parkFoodProfit;
      chainRideUpkeep += parkUpkeep;
      park.additionThisYear = false;
      park.attractionAddedThisYear = false;
      park.newCoasterBuiltThisYear = false;
    }
    player.totalAttendance = chainAtt;
    const corporateOverheadRate = getCorporateOverheadRate(chainAtt);
    const grossChainRevenue = chainGateRevenue + chainFoodGross;
    const corporateOverhead = grossChainRevenue * corporateOverheadRate;
    const chainRevenue = chainGateRevenue + chainFoodProfit - corporateOverhead - chainRideUpkeep;
    for (const advisor of player.advisors || []) {
      if (advisor.hired) {
        const salary = getAdvisorAnnualSalary(player, advisor.id);
        player.cash -= salary;
      }
    }
    player.cash += chainRevenue;
    attendanceRows.push({
      playerName: `${player.ceoName} (${player.chainName})`,
      parksCount: player.parks.length,
      attendance: chainAtt,
      gateRevenue: chainGateRevenue,
      foodAndBeverageGross: chainFoodGross,
      foodAndBeverageCogs: chainFoodCogs,
      foodAndBeverageProfit: chainFoodProfit,
      rideUpkeep: chainRideUpkeep,
      corporateOverhead,
      corporateOverheadRate,
      revenue: chainRevenue,
      newTreasury: player.cash,
      hadAccidentInChain
    });
    processAdvisorReportsForPlayer(player);
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
          if (r.category === "facility") {
            setRideAge(park, r, (r.age || 0) + getRideAnnualAgeIncrement(r, player));
            continue;
          }
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
          setRideAge(park, r, (r.age || 0) + getRideAnnualAgeIncrement(r, player));
          if (r.age >= r.lifespan) {
            if (!r.cultChecked && (r.refurbCount || 0) === 0) {
              r.cultChecked = true;
              const cultRoll = Math.random();
              const cultChance = player.legend.id === "anton_pieck" ? 2 / 3 : 1 / 3;
              if (cultRoll < cultChance) {
                r.cultClassic = true;
                addNewsHeadline("cult", `🌟 <strong>CULT CLASSIC:</strong> ${escapeHtml(r.modelName)} <strong>"${escapeHtml(r.name)}"</strong> at <strong>${escapeHtml(park.name)}</strong> completed its first lifecycle and achieved permanent Cult Classic status (+20% score)!`);
              }
            }
            if (player.isAI) {
              const refCost = getRideRefurbishCost(r, player);
              if (player.cash >= refCost && (isFirst || r.cultClassic)) {
                player.cash -= refCost;
                setRideAge(park, r, 0);
                r.refurbCount = (r.refurbCount || 0) + 1;
                r.immunityTurns = 3;
              } else {
                removeRideFromCampus(park, r.id);
              }
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
    <div style="font-size:.72rem;color:var(--text-muted);margin-bottom:.45rem;">Gross revenue is reduced by progressive chain overhead, ride upkeep, and F&amp;B costs.</div>
    <table><thead><tr><th>CEO &amp; Chain</th><th>Parks</th><th>Yearly Attendance</th><th>Gate Revenue</th><th>F&amp;B Sales</th><th>F&amp;B COGS &amp; OpEx</th><th>Ride Upkeep</th><th>Corporate Overhead</th><th>Net Season Profit</th><th>Updated Treasury</th></tr></thead>
    <tbody>${attendanceRows.map(row => `<tr>
      <td><strong>${escapeHtml(row.playerName)}</strong>${row.hadAccidentInChain ? '<span class="badge badge-red" style="margin-left:6px;">0.7x Accident</span>' : ''}</td>
      <td>${row.parksCount}</td>
      <td style="color:var(--accent-teal);font-weight:700;">${row.attendance.toLocaleString()}</td>
      <td>${money(row.gateRevenue)}</td>
      <td style="color:var(--accent-green);">${money(row.foodAndBeverageGross)}</td>
      <td style="color:var(--accent-red);">-${Math.abs(row.foodAndBeverageCogs).toFixed(2)}M</td>
      <td style="color:var(--accent-red);">-${row.rideUpkeep.toFixed(2)}M</td>
      <td style="color:var(--accent-red);">-${row.corporateOverhead.toFixed(2)}M (${(row.corporateOverheadRate * 100).toFixed(0)}%)</td>
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
  let html = `<p style="font-size:.75rem;color:var(--text-muted);margin-bottom:.75rem;">Refurbishment and repair use the raw base ride cost plus un-multiplied ride scenery, capped at <strong>50% of base ride cost</strong>. Demolition preserves existing ground scenery. Any completed service grants <strong>3-Turn Immunity (🛡️)</strong>.</p>`;
  for (const player of humanPlayers) {
    let itemsHtml = "";
    for (const park of player.parks) {
      for (const plot of park.plots) {
        for (const r of plot.rides) {
          if (r.pendingEolDecision) {
            const refCost = getRideRefurbishCost(r, player);
            const demolitionCost = getRideDemolitionCost(r);
            itemsHtml += `<div class="card" style="border-color:var(--accent-gold);display:flex;justify-content:space-between;align-items:center;"><div><span class="badge badge-gold">⏳ Lifecycle #${(r.refurbCount || 0) + 1}</span> ${r.cultClassic ? '<span class="badge badge-gold">🌟 Cult Classic</span>' : ''} <strong>${escapeHtml(r.name)}</strong> (${escapeHtml(park.name)})</div><div style="display:flex;gap:.35rem;"><button class="btn-gold btn-sm" title="Refurbish: $${refCost.toFixed(2)}M; raw base ride cost plus raw scenery, capped at 50% of base cost" ${player.cash < refCost ? 'disabled' : ''} onclick="refurbishEndOfLifeRide('${park.id}','${plot.id}','${r.id}')">🔄 Refurb ($${refCost.toFixed(2)}M)</button><button class="btn-danger btn-sm" title="Demolition: $${demolitionCost.toFixed(2)}M; existing ground scenery is preserved" ${player.cash < demolitionCost ? 'disabled' : ''} onclick="letEndOfLifeRideDemolish('${park.id}','${plot.id}','${r.id}')">🗑️ Demolish ($${demolitionCost.toFixed(2)}M)</button></div></div>`;
          }
          if (r.status === "needs_maintenance") {
            const c = getRideMaintenanceCost(r, player);
            itemsHtml += `<div class="card" style="border-color:var(--accent-teal);display:flex;justify-content:space-between;align-items:center;"><div><span class="badge badge-teal">🔧 Maintenance</span> <strong>${escapeHtml(r.name)}</strong> (${escapeHtml(park.name)})</div><button class="btn-primary btn-sm" title="Maintenance service: $${c.toFixed(2)}M, based on raw ride cost" ${player.cash < c ? 'disabled' : ''} onclick="payRideMaintenance('${park.id}','${plot.id}','${r.id}',true)">Pay $${c.toFixed(2)}M</button></div>`;
          }
          if (r.status === "needs_repair") {
            const c = getRideRepairCost(r);
            itemsHtml += `<div class="card" style="border-color:var(--accent-red);display:flex;justify-content:space-between;align-items:center;"><div><span class="badge badge-red">🛠️ Repair</span> <strong>${escapeHtml(r.name)}</strong> (${escapeHtml(park.name)})</div><button class="btn-gold btn-sm" title="Base ride cost plus raw scenery, capped at 50% of base ride cost" ${player.cash < c ? 'disabled' : ''} onclick="payRideRepair('${park.id}','${plot.id}','${r.id}',true)">Fix $${c.toFixed(2)}M</button></div>`;
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
    openPendingAdvisorReportsModal();
    return;
  }
  gameState.year++;
  gameState.activePlayerIdx = 0;
  gameState.inspectedPlayerIdx = 0;
  gameState.selectedParkId = gameState.players[0].parks[0].id;
  gameState.selectedHexKey = gameState.players[0].parks[0].hexKey;
  renderAll();
  openPendingAdvisorReportsModal();
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
  const { type, parkId, plotId } = gameState.renameContext;
  const park = gameState.players[gameState.activePlayerIdx].parks.find(item => item.id === parkId);
  if (type === "park") document.getElementById("renameModalInput").value = generateRandomParkName();
  else if (type === "plot") {
    const zone = park?.zones.find(item => item.id === plotId);
    if (zone) document.getElementById("renameModalInput").value = `${getLandTheme(zone.themeId).name} Land`;
  } else document.getElementById("renameModalInput").value = generateRandomRideName();
}

function saveRenameModal() {
  const val = document.getElementById("renameModalInput").value.trim();
  if (!val) return;
  const { type, parkId, plotId, rideId } = gameState.renameContext;
  const park = gameState.players[gameState.activePlayerIdx].parks.find(pk => pk.id === parkId);
  if (type === "park") park.name = val;
  else if (type === "plot") {
    const zone = park.zones.find(item => item.id === plotId);
    if (zone) zone.name = `${getLandTheme(zone.themeId).name} Land`;
  }
  else park.plots.find(pl => pl.id === plotId).rides.find(r => r.id === rideId).name = val;
  closeModal("renameModal");
  renderAll();
}

function generateRandomParkName() { return RANDOM_PARK_NAMES[Math.floor(Math.random() * RANDOM_PARK_NAMES.length)]; }
function generateRandomRideName() { return RANDOM_RIDE_NAMES[Math.floor(Math.random() * RANDOM_RIDE_NAMES.length)]; }
function rollRandomAttractionName() {
  document.getElementById("customRideName").value = generateRandomRideName();
  updateCustomizerPreview();
}
function closeModal(id) {
  document.getElementById(id).classList.remove("active");
  syncCampusLayerVisibility();
}

function escapeHtml(str) {
  return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

window.addEventListener("DOMContentLoaded", () => {
  const modalObserver = new MutationObserver(syncCampusLayerVisibility);
  document.querySelectorAll(".modal-backdrop").forEach(modal => {
    modalObserver.observe(modal, { attributes: true, attributeFilter: ["class"] });
  });
  initMapCanvasEvents();
  buildUSHexGrid();
  openSetupModal();
});