const GUIDED_TUTORIAL_STEPS = [
  {
    title: "Welcome to Company of Coasters",
    text: "You are Walt, leading Walt Disney Attractions. This is a real game: try the actions as you read, use Back and Next to revisit lessons, or Skip whenever you are ready.",
    targetId: "hudLegendPill"
  },
  {
    title: "Your goal",
    text: "At the turn limit, chains earn Bronze Tickets for attendance, parks, themed lands, rides and coaster records. The chain with the most tickets wins; total park points break a tie.",
    targetId: "hudAttendanceBox"
  },
  {
    title: "The market map",
    text: "Each hex represents a market. The colored legend shows its population multiplier: destination markets are strongest, while barren markets are weakest. Select a hex to inspect its market and park prices.",
    targetId: "hexInspectorCard",
    location: "map"
  },
  {
    title: "Open your park",
    text: "Your starting park is Disneyland. Open Parks and choose Open Campus, or double-click its park hex on the map. The campus contains the individual land tiles where you build.",
    targetId: "tbTabParks",
    location: "parks"
  },
  {
    title: "Choose a tile",
    text: "In the campus, click an empty tile in your open entry land. The park drawer displays the selected tile. Choose Construct Ride or Facility on This Hex to open the attraction builder.",
    targetId: "drawerParkBody",
    location: "campus"
  },
  {
    title: "Choose an attraction",
    text: "In the builder, choose a category, then a manufacturer and an available model. Some attractions require research or a later era; two-tile rides also need an available adjacent tile.",
    targetId: "buildCatalogSection",
    location: "campus"
  },
  {
    title: "Change ride statistics",
    text: "For customizable coasters and tracked rides, adjust available statistics such as height, length and inversions. Try the classic Mine Train from FBS Group. Watch the estimated score, capacity and cost; flat rides have fixed specifications.",
    targetId: "customSlidersContainer"
  },
  {
    title: "Theme and build a ride",
    text: "Choose an Initial Scenery Tier in the builder, then press Build Attraction. To improve an existing ride later, select its tile and use the ride theme upgrade in the park drawer.",
    targetId: "customRideTheme"
  },
  {
    title: "Support your guests",
    text: "Use the Facilities category to build restrooms, food and beverage, and guest services. Every land needs an operational restroom and restaurant; the park also needs guest services to avoid a park-wide penalty.",
    targetId: "buildTabFacility"
  },
  {
    title: "Choose a land theme",
    text: "In the park drawer, find your unlocked land and choose its Land theme. Your rides and scenery can match that theme to build a more harmonious park.",
    targetId: "drawerParkBody",
    location: "campus"
  },
  {
    title: "Upgrade land scenery",
    text: "Use Upgrade Land in the land's card to increase its scenery tier. The cost covers the land rather than a single ride; watch the treasury before committing.",
    targetId: "drawerParkBody",
    location: "campus"
  },
  {
    title: "Buy more land",
    text: "The park drawer lists locked expansion lands and their prices. Choose Unlock Land on an affordable land to open its tiles for new attractions and facilities.",
    targetId: "drawerParkBody",
    location: "campus"
  },
  {
    title: "Money and the treasury",
    text: "Your chain treasury is shown in millions. Construction, scenery, research, land and advisor salaries cost money. Attendance and park pricing affect income; leave enough cash for upkeep.",
    targetId: "hudBankBox"
  },
  {
    title: "Attendance and capacity",
    text: "Chain attendance is the number of guests your parks actually welcome each year. Chain capacity is their combined annual ride capacity. More demand cannot be served indefinitely without enough capacity.",
    targetId: "hudAttendanceBox"
  },
  {
    title: "Hire advisors",
    text: "Open Advisors from the gold medallions. Review the available advisors and their annual salaries, then use Hire if you want their reports. Contracts last three years.",
    targetId: "tbTabAdvisors",
    location: "advisors"
  },
  {
    title: "Research attractions",
    text: "Open Research to see available technologies. Pay the listed R&D cost to unlock eligible models. Some advanced attractions also require the appropriate game era.",
    targetId: "tbTabRd",
    location: "rd"
  },
  {
    title: "Check other chains",
    text: "Open Chains to compare other operators, their cash and attendance. Select a chain to inspect it; return to your own chain before making changes to your parks.",
    targetId: "tbTabRivals",
    location: "rivals"
  },
  {
    title: "Awards and records",
    text: "Open Records to see world records, their holders and the event feed. Records grant bonus points; year-end reports also announce industry awards and achievements.",
    targetId: "tbTabRecords",
    location: "records"
  },
  {
    title: "Buy another park",
    text: "Return to the national map, select an unoccupied hex and review the Hex Inspector. Choose Acquire Theme Park, select a size and theme, and pay the listed price. Rival proximity and funds can limit where you may build.",
    targetId: "hexInspectorCard",
    location: "map"
  },
  {
    title: "End your turn",
    text: "When you are ready, choose End Turn. The annual report summarizes finances, news, awards and maintenance decisions. Review it and advance to the next year to continue growing your chain.",
    targetId: "btnEndTurn"
  }
];

function openTutorialConfirmation() {
  document.getElementById("tutorialConfirmModal").classList.add("active");
  document.querySelector("#tutorialConfirmModal .btn-outline").focus();
}

function closeTutorialConfirmation() {
  closeModal("tutorialConfirmModal");
  document.querySelector('#homeModal button[onclick="openTutorialConfirmation()"]').focus();
}

function toggleTutorialMinimized() {
  const box = document.getElementById("tutorialFloatingBox");
  const minimized = box.classList.toggle("tutorial-collapsed");
  const button = document.getElementById("btnTutorialMinimize");
  button.textContent = minimized ? "Expand" : "Minimize";
  button.setAttribute("aria-expanded", String(!minimized));
}

function startTutorialGame() {
  closeModal("tutorialConfirmModal");
  openSetupModal();
  document.getElementById("setupMap").value = "america";
  document.getElementById("setupBotDifficulty").value = "medium";
  document.getElementById("setupGameLength").value = "50";
  document.getElementById("setupStartingCash").value = "30";
  document.getElementById("setupUnlockAllTechnology").checked = false;
  document.getElementById("setupDisableTutorial").checked = false;
  startConfiguredGame({ tutorialMode: true });
  closeWelcomeAndStartTutorial();
}

function showTutorialLocation() {
  const step = GUIDED_TUTORIAL_STEPS[gameState.tutorialStep];
  if (!step || !step.location) return;
  if (document.getElementById("buildRideModal").classList.contains("active")) {
    if (step.location === "campus") {
      renderTutorialStep();
      return;
    }
    alert("Close the attraction builder before switching locations.");
    return;
  }
  if (step.location === "map") {
    if (gameState.mapViewMode === "campus") exitParkCampusView();
    closeSidebarDrawer();
  } else if (step.location === "campus") {
    const player = gameState.players[gameState.activePlayerIdx];
    if (gameState.inspectedPlayerIdx !== gameState.activePlayerIdx ||
        !player.parks.some(park => park.id === gameState.selectedParkId)) {
      gameState.inspectedPlayerIdx = gameState.activePlayerIdx;
      gameState.selectedParkId = player.parks[0].id;
    }
    closeSidebarDrawer();
    if (gameState.mapViewMode !== "campus") enterParkCampusView(gameState.selectedParkId);
    else toggleParkDrawer(true);
  } else {
    switchSidebarTab(step.location);
  }
  renderTutorialStep();
}
