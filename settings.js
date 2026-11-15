const DEFAULT_SETTINGS = Object.freeze({
  confirmEndTurn: false,
  eventPopupMode: "all",
  autoSaveInterval: 5,
  animateRides: true,
  renderQuality: "high",
  atmosphericVfx: true,
  hexGridVisibility: "hover",
  edgeScrollSpeed: 50,
  masterVolume: 80,
  musicVolume: 65,
  sfxVolume: 85,
  uiSounds: true,
  uiScale: 1,
  colorblindBadges: false,
  musicEnabled: true
});
const SETTINGS_KEY = "coc_settings_v1";
const GAME_SETTINGS = { ...DEFAULT_SETTINGS };
const MUSIC_TRACKS = [
  "Audio/dreaming-music-box.mp3",
  "Audio/turnstiles-and-sunshine.mp3",
  "Audio/amusement-park.mp3"
];
let musicPlayer = null;
let musicTrackIndex = 0;
let musicGameStarted = false;
let musicBlobUrl = null;
let musicLoadVersion = 0;
let settingsSnapshot = null;
let settingsReturnFocus = null;

function isValidSetting(key, value) {
  const choices = {
    eventPopupMode: ["all", "major", "silent"],
    autoSaveInterval: [0, 1, 5, 10],
    renderQuality: ["high", "standard", "performance"],
    hexGridVisibility: ["hover", "always", "hidden"],
    uiScale: [.9, 1, 1.15]
  };
  if (choices[key]) return choices[key].includes(value);
  if (["edgeScrollSpeed", "masterVolume", "musicVolume", "sfxVolume"].includes(key)) {
    return Number.isInteger(value) && value >= 0 && value <= 100;
  }
  return typeof value === typeof DEFAULT_SETTINGS[key];
}

function loadSettings() {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return;
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Settings must be an object.");
    }
    for (const key of Object.keys(DEFAULT_SETTINGS)) {
      if (Object.prototype.hasOwnProperty.call(parsed, key)) {
        if (!isValidSetting(key, parsed[key])) {
          console.warn(`Invalid stored setting "${key}"; using its default.`);
          continue;
        }
        GAME_SETTINGS[key] = parsed[key];
      }
    }
  } catch (error) {
    console.error("Unable to load settings.", error);
    alert("Could not load saved settings. Defaults will be used.");
  }
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(GAME_SETTINGS));
    return true;
  } catch (error) {
    console.error("Unable to save settings.", error);
    alert("Settings could not be saved to this browser.");
    return false;
  }
}

function applySettings(previous = {}) {
  document.documentElement.style.setProperty("--ui-scale", GAME_SETTINGS.uiScale);
  document.documentElement.classList.toggle("colorblind-badges", GAME_SETTINGS.colorblindBadges);
  document.getElementById("panelCenterWorkspace").dataset.hexGrid = GAME_SETTINGS.hexGridVisibility;
  if (musicPlayer) {
    musicPlayer.volume = GAME_SETTINGS.masterVolume * GAME_SETTINGS.musicVolume / 10000;
    if (!GAME_SETTINGS.musicEnabled) musicPlayer.pause();
    else if (musicGameStarted && musicPlayer.paused) playMusic();
  }
  if (typeof scenicSceneCache !== "undefined" && previous.renderQuality !== GAME_SETTINGS.renderQuality) {
    scenicSceneCache = null;
    scenicSpriteCache.clear();
    scenicSpriteBytes = 0;
  }
  if (typeof syncCampusLayerVisibility === "function") syncCampusLayerVisibility();
  if (typeof gameState !== "undefined" && gameState.players.length) requestAnimationFrame(drawMapCanvas);
}

function resetSettings() {
  const previous = { ...GAME_SETTINGS };
  Object.assign(GAME_SETTINGS, DEFAULT_SETTINGS);
  applySettings(previous);
  renderSettings();
}

function renderSettings() {
  document.querySelectorAll("#settings-modal [data-setting]").forEach(input => {
    const value = GAME_SETTINGS[input.dataset.setting];
    if (input.type === "checkbox") input.checked = value;
    else input.value = String(value);
  });
  document.querySelectorAll("#settings-modal [data-output]").forEach(output => {
    output.textContent = `${GAME_SETTINGS[output.dataset.output]}%`;
  });
}

function selectSettingsTab(tab) {
  for (const name of ["gameplay", "graphics", "audio", "controls"]) {
    const selected = name === tab;
    document.getElementById(`settings-tab-${name}`).setAttribute("aria-selected", String(selected));
    document.getElementById(`settings-${name}`).hidden = !selected;
  }
}

function openSettings() {
  settingsReturnFocus = document.activeElement;
  settingsSnapshot = { ...GAME_SETTINGS };
  renderSettings();
  document.getElementById("settings-game-actions").hidden =
    !gameState.players.length || document.getElementById("homeModal").classList.contains("active");
  selectSettingsTab("gameplay");
  document.getElementById("settings-modal").classList.add("active");
  syncCampusLayerVisibility();
  document.querySelector("#settings-modal .settings-close").focus();
}

function closeSettings() {
  document.getElementById("settings-modal").classList.remove("active");
  settingsSnapshot = null;
  syncCampusLayerVisibility();
  if (settingsReturnFocus instanceof HTMLElement) settingsReturnFocus.focus();
}

function cancelSettings() {
  if (settingsSnapshot) {
    const previous = { ...GAME_SETTINGS };
    Object.assign(GAME_SETTINGS, settingsSnapshot);
    applySettings(previous);
  }
  closeSettings();
}

function saveAndCloseSettings() {
  if (saveSettings()) closeSettings();
}

function setMusicStatus(message) {
  const status = document.getElementById("music-status");
  if (status) status.textContent = message;
}

function playMusic() {
  if (!musicPlayer || !musicGameStarted || !GAME_SETTINGS.musicEnabled) return;
  const attempt = musicPlayer.play();
  if (attempt) attempt.then(() => setMusicStatus("")).catch(error => {
    if (error.name === "AbortError") return;
    if (error.name === "NotSupportedError" && location.protocol === "file:" && !musicBlobUrl) return;
    console.warn("Background music could not play.", error);
    setMusicStatus("Music could not start. Check the audio files or enable sound in your browser.");
  });
}

function loadMusicTrack() {
  musicLoadVersion++;
  if (musicBlobUrl) URL.revokeObjectURL(musicBlobUrl);
  musicBlobUrl = null;
  musicPlayer.src = MUSIC_TRACKS[musicTrackIndex];
  playMusic();
}

async function recoverLocalMusic() {
  const version = musicLoadVersion;
  const track = MUSIC_TRACKS[musicTrackIndex];
  try {
    const response = await fetch(track);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    if (version !== musicLoadVersion) return;
    musicBlobUrl = URL.createObjectURL(blob);
    musicPlayer.src = musicBlobUrl;
    playMusic();
  } catch (error) {
    console.error(`Unable to load background music: ${track}`, error);
    setMusicStatus(`Unable to load track ${musicTrackIndex + 1}. Check the game's Audio folder.`);
  }
}

function startGameMusic() {
  if (!musicPlayer) {
    musicPlayer = new Audio();
    musicPlayer.preload = "auto";
    musicPlayer.addEventListener("ended", () => {
      musicTrackIndex = (musicTrackIndex + 1) % MUSIC_TRACKS.length;
      loadMusicTrack();
    });
    musicPlayer.addEventListener("error", () => {
      console.error(`Unable to load background music: ${MUSIC_TRACKS[musicTrackIndex]}`, musicPlayer.error);
      if (location.protocol === "file:" && !musicBlobUrl) {
        recoverLocalMusic();
        return;
      }
      setMusicStatus(`Unable to load track ${musicTrackIndex + 1}. Check the game's Audio folder.`);
    });
  }
  musicGameStarted = true;
  musicTrackIndex = 0;
  musicPlayer.volume = GAME_SETTINGS.masterVolume * GAME_SETTINGS.musicVolume / 10000;
  loadMusicTrack();
}

window.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  applySettings();
  document.getElementById("settings-modal").addEventListener("input", event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement || input instanceof HTMLSelectElement) || !input.dataset.setting) return;
    const key = input.dataset.setting;
    const value = input.type === "checkbox" ? input.checked :
      (typeof DEFAULT_SETTINGS[key] === "number" ? Number(input.value) : input.value);
    if (!isValidSetting(key, value)) {
      console.error(`Invalid setting: ${key}`, value);
      return;
    }
    const previous = { ...GAME_SETTINGS };
    GAME_SETTINGS[key] = value;
    applySettings(previous);
    renderSettings();
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const settings = document.getElementById("settings-modal");
    if (settings.classList.contains("active")) {
      event.preventDefault();
      cancelSettings();
    } else if (gameState.players.length && !document.querySelector(".modal-backdrop.active")) {
      event.preventDefault();
      openSettings();
    }
  });
});
