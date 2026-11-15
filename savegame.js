const AUTOSAVE_KEY = "coc_autosave_v1";
const SAVE_FORMAT = "company-of-coasters-save";
const SAVE_VERSION = 1;
const MAX_SAVE_BYTES = 16 * 1024 * 1024;

function encodeSaveGraph(value) {
  const nodes = [];
  const seen = new Map();
  function encode(item) {
    if (item === undefined) return { undefined: true };
    if (item === Infinity) return { infinity: true };
    if (item === null || typeof item === "string" || typeof item === "boolean" ||
        (typeof item === "number" && Number.isFinite(item))) return item;
    if (typeof item !== "object") throw new Error("The game contains unsupported save data.");
    if (seen.has(item)) return { ref: seen.get(item) };
    const id = nodes.length;
    seen.set(item, id);
    nodes.push(null);
    if (Array.isArray(item)) nodes[id] = { type: "array", value: item.map(encode) };
    else if (item instanceof Set) nodes[id] = { type: "set", value: Array.from(item, encode) };
    else if (item instanceof Map) nodes[id] = { type: "map", value: Array.from(item, ([k, v]) => [encode(k), encode(v)]) };
    else {
      const entries = Object.entries(item).map(([key, val]) => [key, encode(val)]);
      nodes[id] = { type: "object", value: entries };
    }
    return { ref: id };
  }
  return { root: encode(value), nodes };
}

function decodeSaveGraph(graph) {
  if (!graph || !Array.isArray(graph.nodes) || graph.nodes.length > 200000) throw new Error("Invalid save data.");
  const objects = graph.nodes.map(node => {
    if (!node || !Array.isArray(node.value)) throw new Error("Invalid save entry.");
    if (node.type === "array") return [];
    if (node.type === "set") return new Set();
    if (node.type === "map") return new Map();
    if (node.type === "object") return {};
    throw new Error("Unknown save entry type.");
  });
  function decode(value) {
    if (value === null || typeof value === "string" || typeof value === "boolean" ||
        (typeof value === "number" && Number.isFinite(value))) return value;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (Object.keys(value).length === 1 && value.undefined === true) return undefined;
      if (Object.keys(value).length === 1 && value.infinity === true) return Infinity;
      if (Object.keys(value).length === 1 && Number.isInteger(value.ref) &&
          value.ref >= 0 && value.ref < objects.length) return objects[value.ref];
    }
    throw new Error("Invalid save reference.");
  }
  graph.nodes.forEach((node, index) => {
    const target = objects[index];
    if (node.type === "array") node.value.forEach(value => target.push(decode(value)));
    else if (node.type === "set") node.value.forEach(value => target.add(decode(value)));
    else for (const pair of node.value) {
      if (!Array.isArray(pair) || pair.length !== 2) throw new Error("Invalid save entry.");
      if (node.type === "map") target.set(decode(pair[0]), decode(pair[1]));
      else {
        const key = pair[0];
        if (typeof key !== "string" || ["__proto__", "constructor", "prototype"].includes(key) ||
            Object.prototype.hasOwnProperty.call(target, key)) throw new Error("Invalid save property.");
        target[key] = decode(pair[1]);
      }
    }
  });
  return decode(graph.root);
}

function createGameSave() {
  if (!gameState.players.length) throw new Error("There is no active game to save.");
  const state = { ...gameState, records: {}, hexByKey: new Map() };
  const tutorialActive = document.getElementById("tutorialFloatingBox").classList.contains("active");
  const text = JSON.stringify({ format: SAVE_FORMAT, version: SAVE_VERSION, uidCounter, tutorialActive, graph: encodeSaveGraph(state) });
  if (new Blob([text]).size > MAX_SAVE_BYTES) throw new Error("The game exceeds the maximum save size.");
  return text;
}

function parseGameSave(text) {
  if (typeof text !== "string" || new Blob([text]).size > MAX_SAVE_BYTES) throw new Error("The save file is too large.");
  const save = JSON.parse(text);
  if (!save || save.format !== SAVE_FORMAT || save.version !== SAVE_VERSION ||
      !Number.isSafeInteger(save.uidCounter) || save.uidCounter < 1000) throw new Error("Unsupported save format.");
  const state = decodeSaveGraph(save.graph);
  for (const node of save.graph.nodes) {
    if (node.type !== "object") continue;
    for (const [key, value] of node.value) {
      if ((key === "id" || key.endsWith("Id")) && typeof value === "string" &&
          !/^[a-zA-Z0-9_,-]+$/.test(value)) throw new Error("Invalid identifier in save.");
    }
  }
  if (!state || !Array.isArray(state.players) || !state.players.length ||
      !Array.isArray(state.hexGrid) || !state.hexGrid.length ||
      !["america", "europe"].includes(state.mapId) ||
      !Number.isSafeInteger(state.year) || state.year < 1 ||
      !(state.maxYears === Infinity || (Number.isSafeInteger(state.maxYears) && state.maxYears > 0)) ||
      !(state.unlockedRides instanceof Set) ||
      !state.zoneEditor || !(state.zoneEditor.selectedKeys instanceof Set) ||
      !state.camera || !Array.isArray(state.logs) || !Array.isArray(state.currentTurnNews) ||
      !Array.isArray(state.pendingAdvisorReports) || !state.lastTurnReport ||
      !state.players.every(player => player && player.legend && Array.isArray(player.parks) &&
        player.parks.length && Array.isArray(player.advisors) && Number.isFinite(player.cash) &&
        player.parks.every(park => park && Array.isArray(park.tiles) && Array.isArray(park.lands) &&
          Array.isArray(park.rides) && Array.isArray(park.plots) && Array.isArray(park.zones) &&
          park.plots.every(plot => plot && Array.isArray(plot.rides))))) {
    throw new Error("The save is incomplete or invalid.");
  }
  if (!state.hexGrid.every(hex => hex && typeof hex.key === "string") ||
      new Set(state.hexGrid.map(hex => hex.key)).size !== state.hexGrid.length) throw new Error("Invalid map data.");
  if (state.finalAwards != null) {
    const result = state.finalAwards;
    const validStanding = item => item && typeof item.playerId === "string" &&
      typeof item.chainName === "string" && typeof item.ceoName === "string" &&
      Number.isFinite(item.tickets) && Number.isFinite(item.parkPoints);
    const validHolder = item => item && typeof item.playerId === "string" &&
      typeof item.label === "string" && Number.isFinite(item.value);
    if (!Number.isSafeInteger(result.year) || !Array.isArray(result.standings) ||
        !result.standings.length || !result.standings.every(validStanding) ||
        !Array.isArray(result.winners) || !result.winners.length ||
        !result.winners.every(id => result.standings.some(item => item.playerId === id)) ||
        !Array.isArray(result.awards) || !result.awards.every(award => award &&
          typeof award.title === "string" && typeof award.unit === "string" &&
          Number.isFinite(award.tickets) && (award.value === null || Number.isFinite(award.value)) &&
          Array.isArray(award.holders) && award.holders.every(validHolder) &&
          award.holders.every(holder => result.standings.some(item => item.playerId === holder.playerId)))) {
      throw new Error("Invalid final awards in save.");
    }
  }
  state.hexByKey = new Map(state.hexGrid.map(hex => [hex.key, hex]));
  if (!state.players.every(player => player.parks.every(park => state.hexByKey.has(park.hexKey)))) {
    throw new Error("A park refers to a missing map location.");
  }
  const cleanNews = item => {
    if (!item || typeof item.htmlText !== "string" || !["ride", "accident", "tourism", "cult", "era"].includes(item.type)) {
      throw new Error("Invalid news in save.");
    }
    const doc = new DOMParser().parseFromString(item.htmlText, "text/html");
    const safeHtml = node => {
      if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.textContent);
      if (node.nodeType !== Node.ELEMENT_NODE) return "";
      const contents = Array.from(node.childNodes, safeHtml).join("");
      return node.tagName === "STRONG" ? `<strong>${contents}</strong>` : contents;
    };
    item.htmlText = Array.from(doc.body.childNodes, safeHtml).join("");
  };
  state.currentTurnNews.forEach(cleanNews);
  if (!Array.isArray(state.lastTurnReport.newsHeadlines)) throw new Error("Invalid report in save.");
  state.lastTurnReport.newsHeadlines.forEach(cleanNews);
  if (save.tutorialActive && (!state.tutorialEnabled || !Number.isInteger(state.tutorialStep) ||
      state.tutorialStep < 0 ||
      state.tutorialStep >= (state.tutorialMode ? GUIDED_TUTORIAL_STEPS.length : TUTORIAL_STEPS.length))) {
    throw new Error("Invalid tutorial progress in save.");
  }
  return { state, uidCounter: save.uidCounter, tutorialActive: save.tutorialActive === true };
}

function restoreGameSave(text) {
  const saved = parseGameSave(text);
  const oldState = gameState;
  const oldUid = uidCounter;
  try {
    gameState = saved.state;
    uidCounter = saved.uidCounter;
    gameState.activePlayerIdx = 0;
    gameState.inspectedPlayerIdx = 0;
    gameState.selectedParkId = gameState.players[0].parks[0].id;
    gameState.selectedHexKey = gameState.players[0].parks[0].hexKey;
    gameState.mapViewMode = "national";
    gameState.hoveredHexKey = null;
    gameState.camera.isDragging = false;
    gameState.zoneEditor.active = false;
    campusLayerParkId = null;
    scenicSceneCache = null;
    document.getElementById("mapModeIndicator").textContent = getNationalMapTitle();
    document.getElementById("btnExitParkView").style.display = "none";
    document.getElementById("campusViewToggle").style.display = "none";
    document.getElementById("usMapTraitLegend").style.display = "flex";
    document.getElementById("panelCenterWorkspace").classList.remove("campus-view-strategic", "campus-view-scenic");
    toggleParkDrawer(false);
    closeSidebarDrawer();
    resetMapCamera();
    renderAll();
  } catch (error) {
    gameState = oldState;
    uidCounter = oldUid;
    campusLayerParkId = null;
    scenicSceneCache = null;
    if (gameState.players.length) renderAll();
    throw error;
  }
  endTutorial();
  if (saved.tutorialActive) {
    document.getElementById("tutorialFloatingBox").classList.add("active");
    renderTutorialStep();
  }
  if (document.getElementById("settings-modal").classList.contains("active")) cancelSettings();
  document.querySelectorAll(".modal-backdrop.active").forEach(modal => modal.classList.remove("active"));
  settingsSnapshot = null;
  if (gameState.gameOver && !gameState.finalAwards) {
    gameState.finalAwards = calculateFinalAwards();
    renderAll();
  }
  if (gameState.maxYears === Infinity && !gameState.gameOver) {
    document.getElementById("legacyLengthModal").classList.add("active");
  } else if (gameState.gameOver && gameState.finalAwards) {
    openFinalAwards();
  }
  startGameMusic();
  syncCampusLayerVisibility();
}

function autosaveGame(completedYear) {
  if (!GAME_SETTINGS.autoSaveInterval || completedYear % GAME_SETTINGS.autoSaveInterval !== 0) return;
  try {
    localStorage.setItem(AUTOSAVE_KEY, createGameSave());
  } catch (error) {
    console.error("Unable to autosave game.", error);
    alert("Autosave failed. Export your game from Settings to avoid losing progress.");
  }
}

function openLoadGame() {
  try {
    document.getElementById("btnLoadAutosave").disabled = !localStorage.getItem(AUTOSAVE_KEY);
    document.getElementById("loadGameModal").classList.add("active");
  } catch (error) {
    console.error("Unable to access autosave.", error);
    alert("Could not access browser saves. You can still import a JSON save.");
    document.getElementById("btnLoadAutosave").disabled = true;
    document.getElementById("loadGameModal").classList.add("active");
  }
}

function loadAutosave() {
  try {
    const text = localStorage.getItem(AUTOSAVE_KEY);
    if (!text) throw new Error("No autosave was found.");
    restoreGameSave(text);
  } catch (error) {
    console.error("Unable to load autosave.", error);
    alert(`Could not load autosave: ${error.message}`);
  }
}

function exportGameSave() {
  try {
    const blob = new Blob([createGameSave()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `company-of-coasters-year-${gameState.year}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error("Unable to export save.", error);
    alert(`Could not export save: ${error.message}`);
  }
}

function chooseSaveFile() {
  const input = document.getElementById("saveFileInput");
  input.value = "";
  input.click();
}

async function importGameSave(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (gameState.players.length && !document.getElementById("homeModal").classList.contains("active") &&
      !confirm("Importing replaces the current game. Unsaved progress will be lost. Continue?")) return;
  try {
    if (file.size > MAX_SAVE_BYTES) throw new Error("The save file is too large.");
    restoreGameSave(await file.text());
  } catch (error) {
    console.error("Unable to import save.", error);
    alert(`Could not import save: ${error.message}`);
  } finally {
    event.target.value = "";
  }
}

function exitToMainMenu() {
  if (!confirm("Exit to the main menu? Unsaved progress since the last autosave or export will be lost.")) return;
  cancelSettings();
  endTutorial();
  if (musicPlayer) musicPlayer.pause();
  musicGameStarted = false;
  toggleParkDrawer(false);
  closeSidebarDrawer();
  gameState.players = [];
  gameState.mapViewMode = "national";
  document.getElementById("homeModal").classList.add("active");
  syncCampusLayerVisibility();
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("saveFileInput").addEventListener("change", importGameSave);
});
