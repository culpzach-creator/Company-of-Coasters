/* ============================================================================
   COMPANY OF COASTERS — ALPHA v1.7 MASTER DATA & US POPULATION MAP (data.js)
   ============================================================================ */

const HEX_TRAITS = {
  barren:      { id: "barren",      name: "Barren",      attMult: 0.8, priceMult: 0.60, fill: "#fca5a5", stroke: "#ef4444" },
  rural:       { id: "rural",       name: "Rural",       attMult: 0.9, priceMult: 0.80, fill: "#fdba74", stroke: "#f97316" },
  suburban:    { id: "suburban",    name: "Suburban",    attMult: 1.0, priceMult: 1.00, fill: "#fde047", stroke: "#eab308" },
  urban:       { id: "urban",       name: "Urban",       attMult: 1.2, priceMult: 1.40, fill: "#7dd3fc", stroke: "#0284c7" },
  destination: { id: "destination", name: "Destination", attMult: 1.4, priceMult: 2.00, fill: "#c4b5fd", stroke: "#7c3aed" }
};

const CHAIN_COLORS = [
  "#3b82f6", "#ec4899", "#a855f7", "#06b6d4",
  "#f97316", "#eab308", "#14b8a6", "#f43f5e"
];

// 23x40 Contiguous Lower-48 United States Population & Tourism Density Map (~554 Land Hexes)
// Alaska & Hawaii removed; Florida Peninsula seamlessly connected to Georgia & Gulf Coast.
// . = Water, B = Barren (0.8x), R = Rural (0.9x), S = Suburban (1.0x), U = Urban (1.2x), D = Destination (1.4x)
const US_ASCII_ROWS = [
  "..USSBBBBBBBBRRRRRRRRRRRRSSS...........R",
  "..USSSBBBBBBBBRRRRRRRRRRRSSSS.........RR",
  ".USSSSBBBBBBBBBRRRRRRRRRRSSSSS......SSSR",
  ".SSSSBBBBBBBBBBBRRRRRRRRR.SSSSS....SSUSS",
  ".SSSBBBBBBBBBBBBBRRRRRRRR..SSSSS..SSUUDD",
  ".USSBBBBBBBBBBBBBRRRRRRRR.USSSSSUSSUUUDD",
  ".DDSBBBBBSUSBBBBBRRRRRRRRUUDSSSSUUUUUDD.",
  ".DDUSBBBBSSSBBBBRRRRRRRRRSSSSSSUUUUUDDS.",
  ".UUSSBBBBBBBBBBBRRRRRRRRUSSSUSSUUUUUDD..",
  ".SUSSBBBBBBBBBSUURRRRRRRUSSSSUUUUUUDD...",
  "..USSSBBBBBBBBSSRRRRRRRRRSSSSSUUUUUS....",
  "..UDSSBBBBBBBBBRRRRRRRRRRSSSSSUUUSS.....",
  "..DDDSBBBBBBBBBRRRRRRRRRRSSSSSUUUSS.....",
  "...DDSBBBBSSBBBRRRRRRRRRRSSSSUUUSSS.....",
  "....SSSSBBUSSBBRRRUDDRRRSSSSSUUUUSS.....",
  ".....SSSSBBRRBBRRRUDDRRRSSSSSUUUUSS.....",
  ".......SSBBBBBRRRRUUURRRSSSSSUUUSS......",
  ".........SSBBBBRRRUUDDRRSSSSSSUSS.......",
  "...........SSRRRRRUUDDRRSSSSSSSS........",
  ".............SRRRRRUSSSSSSSSSSS.........",
  "..............RRRRSSD........SRS........",
  "...............RRRS..........USS........",
  "................SS............UD........"
];

const PREMADE_LEGENDS = [
  {
    id: "walt_disney",
    fullName: "Walt Disney",
    name: "Walt",
    title: "The Immersive Visionary",
    img: "Images/walt_disney.jpg",
    defaultChain: "Walt Disney Attractions",
    defaultPark: "Disneyland",
    desc: "+100% Harmony bonus (Doubled). Maintenance odds increased to 12% & Broken odds to 6%.",
    parkNames: ["Mickeyland", "Magical Kingdom", "City of Tomorrow", "Frontier Adventures", "Tomorrow World", "Imagination Kingdom"]
  },
  {
    id: "michael_eisner",
    fullName: "Michael Eisner",
    name: "Michael",
    title: "The Rapid Expansionist",
    img: "Images/michael_eisner.jpg",
    defaultChain: "EuroDisney Corp",
    defaultPark: "Disney-MGM Studios",
    desc: "New parks cost 30% less; first 2 rides built in a purchased park get 40% off. Flat rides cost +10%.",
    parkNames: ["Euro Mickeyland", "Tokyo Mickeyland", "Hollywood Backlot", "Animal Empire", "Mickey Sea", "Backlot Adventures"]
  },
  {
    id: "matt_ouimet",
    fullName: "Matt Ouimet",
    name: "Matt",
    title: "The Paced Quality Builder",
    img: "Images/matt_ouimet.jpg",
    defaultChain: "Cedar Fair Entertainment",
    defaultPark: "Cedar Point",
    desc: "5% discount on the first attraction added during each turn.",
    parkNames: ["Canada's funland", "Carothrills", "Queen's Dominion", "Queen's Island", "Great America", "Planets's of Fun"]
  },
  {
    id: "jim_reid",
    fullName: "Jim Reid",
    name: "Jim",
    title: "The Thrill & Clone Mogul",
    img: "Images/jim_reid.jpg",
    defaultChain: "Six Flags Entertainment",
    defaultPark: "Six Flags Great Adventure",
    desc: "15% ride discount if that model already exists in another park in your chain. Plot scenery costs +15%.",
    parkNames: ["Seven Flags Great Adventure", "Seven Flags Magic Mountain", "Seven Flags Discovery Kingdom", "Seven Flags Great America", "Seven Flags Atlantis", "Seven Flags Great Escape"]
  },
  {
    id: "rolland_mack",
    fullName: "Rolland Mack",
    name: "Rolland",
    title: "The R&D & Mega-Campus Engineer",
    img: "Images/rolland_mack.jpg",
    defaultChain: "Mack Leisure Group",
    defaultPark: "Europa-Park",
    desc: "Initial park gets +2 extra expansion plots (4 total). Scenic upgrades cost 5% less. Buying extra parks costs +20%.",
    parkNames: ["Europa Park", "Rulertica", "Americana Park", "Africana Park", "Asiantica", "Latinica"]
  },
  {
    id: "hugo_herschend",
    fullName: "Hugo Herschend",
    name: "Hugo",
    title: "The Nostalgia & Artisan Operator",
    img: "Images/hugo_herschend.jpg",
    defaultChain: "Herschend Family Ent.",
    defaultPark: "Silver Dollar City",
    desc: "Stage Show, River Rapids & Park Train receive a +20% point bonus. Flat rides cost +10%.",
    parkNames: ["Silver Dime City", "Dollywind", "Glowwood Caverns", "Indiana Kingdom", "Thrilling Adventures", "Salt Mine Caverns"]
  },
  {
    id: "john_arie",
    fullName: "John Arie",
    name: "John",
    title: "The Roadside Thrill Maverick",
    img: "Images/john_arie.jpg",
    defaultChain: "Fun Spot America",
    defaultPark: "Fun Spot Orlando",
    desc: "Flat rides cost 15% less. All Plot & Ride scenery costs +10%.",
    parkNames: ["Fun Time America", "Fun Time Adventures", "Fun Time Arieland", "Fun Time Old Town", "Fun Time Karting World", "Fun Time Thrills"]
  },
  {
    id: "angus_wynne",
    fullName: "Angus Wynne",
    name: "Angus",
    title: "The Regional Flag Pioneer",
    img: "Images/angus_wynne.jpg",
    defaultChain: "Great Southwest Corp",
    defaultPark: "Six Flags Over Texas",
    desc: "New parks cost 50% less. Classic era rides gain +10% points. Scenery upgrades cost +10%.",
    parkNames: ["Wild West Astro World", "Wild West Texas", "Wild West Over Georgia", "Wild West Over Mid America", "Wild West Fiesta", "Wild West Frontier"]
  },
  {
    id: "anton_pieck",
    fullName: "Anton Pieck",
    name: "Anton",
    title: "The Fairytale & Folklore Artist",
    img: "Images/anton_pieck.jpg",
    defaultChain: "Pieck Storybook Parks",
    defaultPark: "Fairytale Gardens",
    desc: "Harmony requires just 2 attractions per land. Rides are twice as likely to become Cult Classics. Attraction construction costs 5% more.",
    parkNames: ["Efthoven", "Droomvelt", "Ravelein", "Strumpvloot", "Vandeschein", "Veigelhalen"]
  },
  {
    id: "milton_hershey",
    fullName: "Milton Hershey",
    name: "Milton",
    title: "The Confectionery Baron",
    img: "Images/milton_hershey.jpg",
    defaultChain: "Hershey Leisure",
    defaultPark: "Chocolate World",
    desc: "F&B profits increase by 6%. Annual ride upkeep costs 50% more.",
    parkNames: ["Cocoa Paradise", "Chocolate World", "Candyland USA", "Cocoaland", "Sugarland", "Chocolate Gardens"]
  },
  {
    id: "jay_stein",
    fullName: "Jay Stein",
    name: "Jay",
    title: "The Studio Backlot Mogul",
    img: "Images/jay_stein.jpg",
    defaultChain: "Stein Entertainment",
    defaultPark: "Studio Adventure",
    desc: "Ride scenery generates 8% more points. Rides age 5% faster.",
    parkNames: ["Global Studios", "Global Pictures Park", "Global Asia", "Global Action Park", "Global Studios Europe", "Global Backlot Thrills"]
  },
  {
    id: "mark_woodburry",
    fullName: "Mark Woodburry",
    name: "Mark",
    title: "The Seasonal & Portal Innovator",
    img: "Images/mark_woodbury.jpg",
    defaultChain: "Woodburry Parks",
    defaultPark: "Woodburry Adventure Park",
    desc: "A park gets 2% more attendance in years when it adds an attraction. Rides age 4% faster.",
    parkNames: ["Islands of Wonder", "Fantastic Universe", "Celestial Realms", "Kids Resort", "Land of Dreams", "World of Heros"]
  },
  {
    id: "walter_knott",
    fullName: "Walter Knott",
    name: "Walter",
    title: "The Ghost Town Pioneer",
    img: "Images/walter_knott.jpg",
    defaultChain: "Knott Family Parks",
    defaultPark: "Knott's Berry Farm",
    desc: "Light land scenery upgrades are free (ride theming is unaffected).",
    parkNames: ["Knott's Vineyard", "Knott's Scary Adventure", "Knott's Thrill Garden", "Knott's California Dreams", "Knott's Boardwalk", "Knott's Wilderness Trail"]
  },
  {
    id: "george_millay",
    fullName: "George Millay",
    name: "George",
    title: "The Marine & Waterpark Showman",
    img: "Images/george_milley.jpg",
    defaultChain: "Milley Entertainment",
    defaultPark: "Ocean Adventure",
    desc: "Every new park receives a free Stage Show. Build up to 3 Stage Shows per park.",
    parkNames: ["Seven Seas Oralndo", "Seven Seas San Antonio", "Seven Seas San Diego", "Seven Seas Mid America", "Seven Seas Gulf Coast", "Seven Seas West Coast"]
  },
  {
    id: "dick_kinzel",
    fullName: "Dick Kinzel",
    name: "Dick",
    title: "The Coaster Wars Titan",
    img: "Images/dick_kinzel.jpg",
    defaultChain: "Kinzel Amusements",
    defaultPark: "Great Lakes Park",
    desc: "Rides holding one or more world records generate 20% more ride points.",
    parkNames: ["Cedar Lake", "Valleythrills", "Dorneyville", "Michigan Point", "Cedar Creek", "Pinewood Point"]
  }
];

const ADVISOR_CATALOG = [
  {
    id: "technical",
    name: "Technical Advisor",
    title: "Maintenance & Capacity Auditor",
    image: "Images/technical_advisor.jpg",
    description: "Audits ride aging, maintenance traps, and facility coverage bottlenecks." 
  },
  {
    id: "financial",
    name: "Financial Advisor",
    title: "Pricing & Value Strategist",
    image: "Images/financial_advisor.jpg",
    description: "Audits gate ticket pricing elasticity, meal pricing wallet caps, and rival price undercutting."
  },
  {
    id: "creative",
    name: "Creative Advisor",
    title: "Land & Guest Experience Director",
    image: "Images/creative_advisor.jpg",
    description: "Audits themed land utilization, scenery tier mismatches, ride category balance, and duplicate ride boredom."
  }
];

const CUSTOM_POS_TRAITS = [
  { id: "pos_ride_scenery", label: "Ride scenery upgrades cost 10% less" },
  { id: "pos_plot_scenery", label: "Plot scenery upgrades cost 10% less" },
  { id: "pos_harmony", label: "Harmony bonus increased by 50%" },
  { id: "pos_clone_discount", label: "Ride cost -10% if model exists in another chain park" },
  { id: "pos_auto_smooth", label: "New Roller Coasters are automatically Smooth" },
  { id: "pos_flat_disc", label: "Flat rides cost 8% less" },
  { id: "pos_coaster_disc", label: "Roller coasters cost 5% less" },
  { id: "pos_research_disc", label: "Research fees are 50% less" },
  { id: "pos_maint_disc", label: "Maintenance & broken repair costs 40% less" },
  { id: "pos_freak_safe", label: "Freak accident chance reduced to 1-in-2000" },
  { id: "pos_classic_disc", label: "Classic era rides cost 5% less" },
  { id: "pos_modern_disc", label: "Modern era rides cost 5% less" },
  { id: "pos_adv_disc", label: "Advanced era rides cost 5% less" }
];

const CUSTOM_NEG_TRAITS = [
  { id: "neg_ride_scenery", label: "Ride scenery upgrades cost 10% more" },
  { id: "neg_plot_scenery", label: "Plot scenery upgrades cost 10% more" },
  { id: "neg_harmony", label: "Harmony bonus halved (-50%)" },
  { id: "neg_flat_tax", label: "Flat rides cost 8% more" },
  { id: "neg_coaster_tax", label: "Roller coasters cost 5% more" },
  { id: "neg_research_tax", label: "Research fees are 50% more" },
  { id: "neg_maint_tax", label: "Maintenance & broken repair costs 10% more" },
  { id: "neg_freak_prone", label: "Freak accident chance increased to 1-in-700" },
  { id: "neg_classic_tax", label: "Classic era rides cost 5% more" },
  { id: "neg_modern_tax", label: "Modern era rides cost 5% more" },
  { id: "neg_adv_tax", label: "Advanced era rides cost 5% more" }
];

const ERA_UNLOCK_YEARS = { classic: 1, modern: 15, advanced: 30 };

const ECONOMIC_BALANCING_RULES = {
  attendanceBrackets: [
    { limit: 1500000, efficiency: 1.00 },
    { limit: 3000000, efficiency: 0.65 },
    { limit: 4500000, efficiency: 0.35 },
    { limit: Infinity, efficiency: 0.15 }
  ],
  rideAgeGraceYears: 2,
  rideAgeDecayPerYear: 0.02,
  rideMinimumCondition: 0.40,
  annualRideUpkeepRate: 0.02,
  annualUpkeepCreepPerYear: 0.025,
  refurbishCostRate: 0.25,
  duplicateScoreMultipliers: [1.00, 0.70, 0.40],
  infrastructureAttendanceThreshold: 1000000,
  infrastructureSupportShareThreshold: 0.25,
  infrastructureMaximumPenalty: 0.25,
  corporateOverheadTiers: [
    { attendanceLimit: 4000000, rate: 0.05 },
    { attendanceLimit: 8000000, rate: 0.12 },
    { attendanceLimit: 12000000, rate: 0.20 },
    { attendanceLimit: Infinity, rate: 0.28 }
  ]
};

// Plot Scenery Costs DOUBLED (2x)
const PLOT_SCENERY_TIERS = [
  { level: 0, name: "Un-themed", cost: 0,   upgradeCost: 0,   points: 0,   color: "#334155" },
  { level: 1, name: "Light",     cost: 4,   upgradeCost: 4,   points: 3,   color: "#0284c7" },
  { level: 2, name: "Medium",    cost: 10,  upgradeCost: 8,   points: 9,   color: "#0d9488" },
  { level: 3, name: "Heavy",     cost: 40,  upgradeCost: 34,  points: 35,  color: "#7c3aed" },
  { level: 4, name: "Immersive", cost: 200, upgradeCost: 170, points: 200, color: "#d97706" }
];

// Base Ride Scenery Tiers (Flat Rides = 1.0x, Coasters & Tracked Rides = 2.0x, Facilities = 0.5x)
const RIDE_SCENERY_TIERS = [
  { level: 0, name: "Un-themed", cost: 0,  upgradeCost: 0,  points: 0  },
  { level: 1, name: "Light",     cost: 1,  upgradeCost: 1,  points: 1  },
  { level: 2, name: "Medium",    cost: 3,  upgradeCost: 1,  points: 4  },
  { level: 3, name: "Heavy",     cost: 10, upgradeCost: 8,  points: 14 },
  { level: 4, name: "Immersive", cost: 50, upgradeCost: 40, points: 75 }
];

const HARMONY_TIERS = {
  0: { bonus: 0,    label: "No Harmony" },
  1: { bonus: 0.05, label: "Light Harmony" },
  2: { bonus: 0.10, label: "Medium Harmony" },
  3: { bonus: 0.16, label: "Heavy Harmony" },
  4: { bonus: 0.23, label: "Immersive Harmony" }
};

const FOOD_AND_BEVERAGE_RULES = {
  minMealPrice: 10,
  maxMealPrice: 25,
  defaultMealPrice: 10,
  annualCapacityPerVenue: 450000,
  costPerMeal: 4.2,
  fixedOverheadPerVenue: 0.32,
  fixedOverheadPerMillionGuests: 0.45,
  baseHungryPoolShare: 0.45,
  placeMakingHungryPoolBonus: 0.25
};

// Facilities Catalog (Unlimited per park, 0 base tech points, 0.5x scenery cost)
const FACILITY_CATALOG = [
  {
    id: "toilets",
    name: "Restrooms (Toilets)",
    facilityRole: "toilets",
    era: "classic",
    cost: 1.0,
    points: 0,
    supportPoints: 4,
    researchCost: 0,
    spaces: 1,
    lifespan: 30,
    immuneToIssues: true,
    desc: "Serves cleared tiles within 2 hexes. Tiles outside restroom coverage lose 10% of their points. Themeable at 1/2 Ride Scenery cost."
  },
  {
    id: "restaurant",
    name: "Diner / Park Restaurant",
    facilityRole: "restaurant",
    era: "classic",
    cost: 2.0,
    points: 0,
    supportPoints: 6,
    researchCost: 0,
    spaces: 1,
    lifespan: 30,
    immuneToIssues: true,
    desc: "Set meal prices from $10 to $25. Each venue can sell up to 400,000 meals per year. Serves cleared tiles within 2 hexes; themeable at 1/2 Ride Scenery cost."
  },
  {
    id: "guest_services",
    name: "Guest Services",
    facilityRole: "guest_services",
    era: "classic",
    cost: 2.5,
    points: 0,
    supportPoints: 4,
    researchCost: 0,
    spaces: 1,
    lifespan: 30,
    immuneToIssues: true,
    desc: "Satisfies Park-Wide Guest Services Need (1 needed per park in any zone; prevents -5% Park Score Penalty)."
  },
  {
    id: "theater",
    name: "Theater",
    facilityRole: "theater",
    era: "classic",
    cost: 4.5,
    points: 0,
    supportPoints: 0,
    researchCost: 0,
    spaces: 1,
    lifespan: 30,
    immuneToIssues: true,
    desc: "A high-capacity live show venue. Manufacturer independent."
  }
];

const FLAT_RIDE_CATALOG = [
  { id: "crazy_bus", name: "Crazy Bus", era: "classic", subType: "family", cost: 1.5, points: 2.5, researchCost: 0, spaces: 1 },
  { id: "scrambler", name: "Scrambler", era: "classic", subType: "family", cost: 1.5, points: 2.5, researchCost: 0, spaces: 1 },
  { id: "carousel", name: "Carousel", era: "classic", subType: "family", cost: 1.5, points: 2.5, researchCost: 0, spaces: 1 },
  { id: "flyer", name: "Flyer", era: "classic", subType: "family", cost: 1.5, points: 2.5, researchCost: 0, spaces: 1 },
  { id: "bumper_cars", name: "Bumper Cars", era: "classic", subType: "family", cost: 1.5, points: 2.5, researchCost: 0, spaces: 1 },
  { id: "teacups", name: "Teacups", era: "classic", subType: "family", cost: 1.5, points: 2.5, researchCost: 0, spaces: 1 },
  { id: "chair_swings", name: "Chair Swings", era: "classic", subType: "family", cost: 2.0, points: 3.0, researchCost: 0, spaces: 1 },
  { id: "enterprise", name: "Enterprise", era: "classic", subType: "thrill", cost: 2.0, points: 3.0, researchCost: 0, spaces: 1 },
  { id: "pirate_ship", name: "Pirate Ship", era: "classic", subType: "family", cost: 2.5, points: 3.5, researchCost: 0, spaces: 1 },
  { id: "antique_cars", name: "Antique Cars", era: "classic", subType: "family", cost: 3.0, points: 4.0, researchCost: 0, spaces: 1 },
  { id: "drop_tower", name: "Drop Tower", era: "classic", subType: "thrill", cost: 3.5, points: 4.0, researchCost: 1.0, spaces: 1, customizable: true, baseHeight: 60, maxHeight: 400, stepHeight: 20, costPerStep: 1.0, ptsPerStep: 1.0 },
  { id: "ferris_wheel", name: "Ferris Wheel", era: "classic", subType: "transport", cost: 3.0, points: 4.5, researchCost: 0, spaces: 1, customizable: true, baseHeight: 100, maxHeight: 500, stepHeight: 20, costPerStep: 1.0, ptsPerStep: 1.0 },
  { id: "train", name: "Park Train", era: "classic", subType: "transport", cost: 3.0, points: 4.0, researchCost: 0, spaces: 1, isTrain: true },
  { id: "claw", name: "Claw", era: "modern", subType: "thrill", cost: 3.0, points: 4.0, researchCost: 0, spaces: 1 },
  { id: "top_spin", name: "Top Spin", era: "modern", subType: "thrill", cost: 3.0, points: 4.5, researchCost: 2.0, spaces: 1 },
  { id: "disco", name: "Disco", era: "modern", subType: "family", cost: 4.0, points: 5.5, researchCost: 2.0, spaces: 1 },
  { id: "nebulaz", name: "Nebulaz", era: "modern", subType: "thrill", cost: 4.0, points: 5.5, researchCost: 2.0, spaces: 1 },
  { id: "demolition_derby", name: "Demolition Derby", era: "advanced", subType: "family", cost: 4.0, points: 5.0, researchCost: 2.0, spaces: 1, immuneToIssues: true },
  { id: "giant_discovery", name: "Giant Discovery", era: "advanced", subType: "thrill", cost: 4.0, points: 5.5, researchCost: 2.0, spaces: 1, immuneToIssues: true },
  { id: "sky_fly", name: "Sky Fly", era: "advanced", subType: "thrill", cost: 4.0, points: 5.5, researchCost: 2.0, spaces: 1, immuneToIssues: true },
  { id: "air_race", name: "Air Race", era: "advanced", subType: "thrill", cost: 4.0, points: 5.5, researchCost: 2.0, spaces: 1, immuneToIssues: true }
];

const TRACKED_RIDE_CATALOG = [
  { id: "stage_show", name: "Stage Show", era: "classic", subType: "family", cost: 4.5, points: 6.5, researchCost: 0, spaces: 1, lifespan: 20, maxPerPark: 1, immuneToIssues: true },
  { id: "log_flume", name: "Log Flume", era: "classic", subType: "family", cost: 5.5, points: 6.5, researchCost: 1.5, spaces: 2, lifespan: 20, maxPerPark: 1, hasLength: true, baseLen: 1000, maxLen: 4000, lenStep: 200, lenCost: 0.5, lenPts: 1.0, hasHeight: true, baseHeight: 40, maxHeight: 120, heightStep: 10, heightCost: 0.5, heightPts: 0.75 },
  { id: "rapids", name: "River Rapids", era: "modern", subType: "family", cost: 6.5, points: 7.5, researchCost: 2.0, spaces: 2, lifespan: 20, maxPerPark: 1, hasLength: true, baseLen: 1000, maxLen: 4000, lenStep: 200, lenCost: 0.5, lenPts: 1.0, hasHeight: true, baseHeight: 10, maxHeight: 50, heightStep: 10, heightCost: 0.75, heightPts: 1.0 },
  { id: "dark_ride", name: "Dark Ride", era: "modern", subType: "family", cost: 7.0, points: 8.5, researchCost: 2.5, spaces: 2, lifespan: 20, maxPerPark: 2, hasLength: true, baseLen: 400, maxLen: 1400, lenStep: 100, lenCost: 1.0, lenPts: 1.5 },
  { id: "flying_theater", name: "Flying Theater", era: "advanced", subType: "thrill", cost: 12.0, points: 16.5, researchCost: 4.0, spaces: 1, lifespan: 25, maxPerPark: 1 }
];

const LEGENDARY_RIDE_CATALOG = [
  {
    id: "legendary_splash_mountain",
    name: "Legendary Splash Mountain",
    era: "classic",
    subType: "family",
    cost: 80,
    points: 40,
    spaces: 2,
    lifespan: 30,
    unlockModelId: "log_flume",
    occupiesModelId: "log_flume",
    uniqueGameWide: true
  },
  {
    id: "legendary_space_mountain",
    name: "Legendary Space Mountain",
    era: "modern",
    subType: "thrill",
    cost: 80,
    points: 40,
    spaces: 2,
    lifespan: 30,
    unlockModelId: "mine_train",
    occupiesModelId: "mine_train",
    uniqueGameWide: true
  }
];

const RAW_COASTERS = [
  ["mine_train","Mine Train","steel","classic",15,5.0,0,1800,3200,100,.5,55,120,10,.5,false,0,0,0,false],
  ["classic_wood","Classic Wood","wood","classic",15,4.5,0,2000,3600,100,.5,60,120,10,.5,false,0,0,0,false],
  ["wild_mouse","Classic Wild Mouse","steel","classic",15,3.5,0,1500,3500,100,.5,50,100,10,.5,false,0,0,0,false],
  ["classic_looper","Classic Looper","steel","classic",15,5.0,2,2200,4000,100,.25,70,150,10,.25,true,1,20,1,false],
  ["classic_hyper","Classic Hyper","steel","classic",15,11.0,2,3500,5500,100,1,200,230,10,.5,false,0,0,0,false],
  ["swinging","Swinging Coaster","steel","classic",15,6.0,1,2200,4000,100,.25,70,170,10,.25,false,0,0,0,false],
  ["spinning_coaster","Spinning Coaster","steel","modern",20,7.0,2,1800,3500,100,.5,60,130,10,.5,false,0,0,0,false],
  ["modern_wood","Modern Wood","wood","modern",20,7.0,3,2800,5000,100,.5,90,160,10,.5,false,0,0,0,false],
  ["modern_looper","Modern Looper","steel","modern",20,9.0,3,3200,5000,100,1,130,210,10,1,true,4,20,1,false],
  ["invert","Inverted Coaster","steel","modern",20,8.5,3,2500,4000,100,1,110,170,10,1,true,3,20,1,false],
  ["dive","Dive Coaster","steel","modern",20,10.0,2,2000,5000,100,1,150,350,10,1,true,2,20,1,false],
  ["flying","Flying Coaster","steel","modern",20,10.5,3,3000,5000,100,1,120,210,10,1,true,2,20,1,false],
  ["boomerang","Boomerang Coaster","steel","modern",20,5.5,2,1000,1000,100,0,120,120,10,0,true,3,3,0,true],
  ["wing","Wing Coaster","steel","modern",20,11.5,2,3200,5000,100,1,130,230,10,1,true,3,20,1,false],
  ["4d_coaster","4-D Coaster","steel","modern",20,10.0,2,3000,5000,100,1,120,210,10,1,true,2,20,1,false],
  ["hyper","Hyper Coaster","steel","modern",20,13.5,5,4000,6000,100,1,220,270,10,1,true,0,20,1,false],
  ["launch","Launch Coaster","steel","modern",20,10.0,3,2400,5000,100,1,80,200,10,1,true,2,20,1,false],
  ["hydro_launch","Hydro Launch","steel","modern",20,12.0,4,2800,5000,100,1,200,470,20,1,true,1,20,1,false],
  ["advanced_wood","Advanced Wood","wood","advanced",25,11.0,4,4000,8000,100,1,120,240,10,.5,true,0,20,1,false],
  ["steel_hybrid","Steel Hybrid Coaster","steel","advanced",25,9.0,3,3200,5000,100,1,130,210,10,1,true,4,20,1,true],
  ["giga","Giga Coaster","steel","advanced",25,16.0,4,4500,7000,100,1,310,370,10,1,true,0,20,1,false],
  ["strata","Strata Coaster","steel","advanced",25,20.0,7,4500,8000,200,1,420,500,10,2,true,0,20,1,false],
  ["axis","Axis Coaster","steel","advanced",25,12.0,7,2200,4000,100,1,150,250,20,1,true,3,20,1,false],
  ["exa","EXA Coaster","steel","advanced",25,25.0,10,5000,10000,100,2,600,600,20,3,true,0,20,1,false]
];

const COASTER_STAT_CURVES = {
  mine_train: { cH: 0.16, rH: 1.170, cL: 0.18, rL: 1.125, pH: 0.55, pL: 0.50, pI: 0 },
  wooden: { cH: 0.22, rH: 1.150, cL: 0.24, rL: 1.110, pH: 0.70, pL: 0.65, pI: 0 },
  modern_wood: { cH: 0.25, rH: 1.140, cL: 0.26, rL: 1.108, pH: 0.78, pL: 0.72, pI: 0 },
  steel_looper: { cH: 0.26, rH: 1.135, cL: 0.28, rL: 1.115, cI: 0.38, rI1: 1.18, rI2: 1.55, pH: 0.72, pL: 0.68, pI: 1.35 },
  inverted: { cH: 0.32, rH: 1.135, cL: 0.34, rL: 1.115, cI: 0.45, rI1: 1.18, rI2: 1.55, pH: 0.80, pL: 0.75, pI: 1.45 },
  dive: { cH: 0.38, rH: 1.130, cL: 0.38, rL: 1.130, cI: 0.52, rI1: 1.20, rI2: 1.58, pH: 0.90, pL: 0.70, pI: 1.40 },
  launch: { cH: 0.34, rH: 1.125, cL: 0.35, rL: 1.110, cI: 0.46, rI1: 1.18, rI2: 1.55, pH: 0.85, pL: 0.80, pI: 1.40 },
  hybrid: { cH: 0.35, rH: 1.120, cL: 0.34, rL: 1.105, cI: 0.48, rI1: 1.18, rI2: 1.55, pH: 0.92, pL: 0.85, pI: 1.50 },
  hyper: { cH: 0.35, rH: 1.115, cL: 0.36, rL: 1.100, pH: 1.05, pL: 0.95, pI: 0 },
  giga: { cH: 0.42, rH: 1.098, cL: 0.44, rL: 1.092, pH: 1.20, pL: 1.10, pI: 0 }
};

const COASTER_STAT_CURVE_BY_MODEL = {
  mine_train: "mine_train", classic_wood: "wooden", wild_mouse: "mine_train", classic_looper: "steel_looper",
  classic_hyper: "hyper", swinging: "steel_looper", modern_wood: "modern_wood",
  spinning_coaster: "steel_looper",
  modern_looper: "steel_looper", invert: "inverted", dive: "dive", flying: "inverted",
  boomerang: "inverted", wing: "inverted", "4d_coaster": "inverted", hyper: "hyper",
  launch: "launch", hydro_launch: "launch", advanced_wood: "modern_wood",
  steel_hybrid: "hybrid", giga: "giga", strata: "giga", axis: "steel_looper", exa: "giga"
};
const NON_INVERTING_COASTER_IDS = new Set([
  "mine_train", "classic_wood", "wild_mouse", "spinning_coaster", "modern_wood", "advanced_wood",
  "classic_hyper", "hyper", "giga", "strata", "exa"
]);

const COASTER_CATALOG = RAW_COASTERS.map(c => {
  const statCurve = COASTER_STAT_CURVES[COASTER_STAT_CURVE_BY_MODEL[c[0]]];
  if (!statCurve) throw new Error(`Missing stat curve for coaster: ${c[0]}`);
  return {
    id: c[0], name: c[1], track: c[2], gen: c[3], era: c[3], lifespan: c[4], cost: c[5], researchCost: c[6],
    baseLen: c[7], initialSliderMaxLen: c[8], lenStep: 250, baseHeight: c[11], initialSliderMaxHeight: c[12], heightStep: 10,
    canInvert: c[15] && !NON_INVERTING_COASTER_IDS.has(c[0]), baseInv: c[16], initialSliderMaxInv: c[17],
    statCurve: { ...statCurve, baseH: c[11], baseL: c[7], baseI: c[16], canInvert: c[15] && !NON_INVERTING_COASTER_IDS.has(c[0]) }
  };
});

const MANUFACTURERS = {
  zampini: {
    id: "zampini", name: "Zampini", origin: "🇮🇹 Italy",
    flatCostMod: 0.10, costMod: 0, issueMod: -0.10, capMult: 1.0, capRound: "ceil", pointsMod: 0,
    smoothnessRule: "normal", desc: "+10% Flat Ride Cost • -10% Issue Chance",
    coasters: [],
    flats: ["antique_cars", "bumper_cars", "giant_discovery", "top_spin", "claw", "nebulaz", "disco", "crazy_bus", "air_race", "carousel", "scrambler", "teacups", "demolition_derby", "ferris_wheel", "chair_swings", "flyer", "log_flume"]
  },
  intramax: {
    id: "intramax", name: "Intramax", origin: "🇨🇭 Switzerland",
    costMod: 0, issueMod: 0.05, capMult: 1.0, capRound: "ceil", pointsMod: 0.03,
    smoothnessRule: "normal", desc: "+3% Ride Points • +5% Issue Chance",
    coasters: ["launch", "hyper", "giga", "strata", "exa", "hydro_launch", "invert", "modern_looper", "mine_train"],
    flats: ["drop_tower", "rapids", "log_flume", "flying_theater", "dark_ride"]
  },
  bh: {
    id: "bh", name: "B&H", origin: "🇨🇭 Switzerland",
    costMod: 0.20, issueMod: -0.20, capMult: 1.5, capRound: "ceil", pointsMod: 0,
    smoothnessRule: "normal", desc: "+20% Cost • -20% Issue Chance • 1.5x Capacity",
    coasters: ["flying", "dive", "wing", "hyper", "giga", "invert", "strata", "modern_looper"],
    flats: []
  },
  gerstmann: {
    id: "gerstmann", name: "Gerstmann", origin: "🇩🇪 Germany",
    costMod: 0, issueMod: 0, capMult: 1.0, capRound: "ceil", pointsMod: 0,
    smoothnessRule: "normal", desc: "Standard Baseline Engineering",
    coasters: ["launch", "modern_looper", "dive", "spinning_coaster"],
    flats: ["air_race", "flyer"]
  },
  macht: {
    id: "macht", name: "Macht", origin: "🇩🇪 Germany",
    costMod: 0.10, issueMod: -0.15, capMult: 1.1, capRound: "ceil", pointsMod: 0,
    smoothnessRule: "no_rough", desc: "+10% Cost • -15% Issue Chance • 1.1x Capacity • No Rough Rides",
    coasters: ["launch", "hyper", "modern_looper", "spinning_coaster", "mine_train"],
    flats: ["log_flume", "rapids", "dark_ride", "flying_theater", "teacups", "carousel", "chair_swings", "antique_cars", "demolition_derby"]
  },
  velkona: {
    id: "velkona", name: "Velkona", origin: "🇳🇱 Netherlands",
    costMod: -0.05, issueMod: 0, capMult: 0.6, capRound: "ceil", pointsMod: 0,
    smoothnessRule: "always_smooth", desc: "All Rides Smooth • -5% Cost • 0.6x Capacity",
    coasters: ["launch", "modern_looper", "hyper", "flying", "invert", "mine_train"],
    flats: ["dark_ride", "flying_theater"]
  },
  rmc: {
    id: "rmc", name: "Rusty Mountain", origin: "🇺🇸 USA",
    costMod: -0.20, issueMod: 0.10, capMult: 0.6, capRound: "ceil", pointsMod: 0,
    smoothnessRule: "always_smooth", desc: "All Rides Smooth • -20% Cost • 0.6x Capacity • +10% Issue Chance",
    coasters: ["steel_hybrid", "advanced_wood"],
    flats: []
  },
  sankyo: {
    id: "sankyo", name: "Sankyo", origin: "🇯🇵 Japan",
    costMod: -0.05, issueMod: 0.15, capMult: 1.0, capRound: "ceil", pointsMod: 0.05,
    smoothnessRule: "normal", desc: "+5% Ride Points • -5% Cost • +15% Issue Chance",
    coasters: ["4d_coaster", "launch", "modern_looper"],
    flats: ["drop_tower", "claw"]
  },
  lawson: {
    id: "lawson", name: "Lawson", origin: "🇺🇸 USA",
    costMod: -0.15, issueMod: 0.15, capMult: 1.0, capRound: "ceil", pointsMod: 0,
    smoothnessRule: "normal", desc: "-15% Cost • +15% Issue Chance",
    coasters: [],
    flats: ["flyer", "ferris_wheel", "claw", "bumper_cars", "drop_tower", "scrambler", "chair_swings"]
  },
  fbs: {
    id: "fbs", name: "FBS Group", origin: "🇮🇹 Italy / US",
    costMod: -0.20, issueMod: 0.10, capMult: 1.0, capRound: "ceil", pointsMod: 0,
    smoothnessRule: "normal", desc: "-20% Cost • +10% Issue Chance",
    coasters: ["spinning_coaster", "mine_train"],
    flats: ["claw", "air_race", "bumper_cars", "disco", "crazy_bus", "carousel", "scrambler", "teacups", "demolition_derby", "ferris_wheel", "chair_swings", "antique_cars"]
  },
  hauss: {
    id: "hauss", name: "Hauss", origin: "🇩🇪 Germany",
    costMod: 0.05, issueMod: 0.05, capMult: 1.2, capRound: "ceil", pointsMod: 0,
    smoothnessRule: "normal", desc: "+5% Cost • +5% Issue Chance • 1.2x Capacity",
    coasters: [],
    flats: ["top_spin", "bumper_cars", "claw", "giant_discovery", "enterprise", "drop_tower", "scrambler"]
  },
  polaris: {
    id: "polaris", name: "Polaris", origin: "🇺🇸 USA",
    costMod: -0.10, issueMod: 0, capMult: 0.8, capRound: "round", pointsMod: 0,
    smoothnessRule: "normal", desc: "-10% Cost • 0.8x Capacity",
    coasters: ["launch", "modern_looper", "hydro_launch"],
    flats: []
  },
  gravityworks: {
    id: "gravityworks", name: "Gravityworks", origin: "🇺🇸 USA",
    costMod: 0, issueMod: 0, capMult: 1.0, capRound: "ceil", pointsMod: 0,
    smoothnessRule: "no_fine", roughPointsMod: -0.15, smoothPointsMod: 0.15,
    desc: "No Fine Rides • -15% Rough Points • +15% Smooth Points",
    coasters: ["classic_wood", "modern_wood", "advanced_wood"],
    flats: []
  },
  gtc: {
    id: "gtc", name: "GTC", origin: "🇺🇸 USA",
    costMod: 0, issueMod: 0, capMult: 1.0, capRound: "ceil", pointsMod: 0,
    smoothnessRule: "no_rough", desc: "No Rough Rides",
    coasters: ["classic_wood", "modern_wood", "advanced_wood"],
    flats: []
  }
};

const RIDE_CAPACITIES = {
  mine_train: { cycleRiders: 28, parkCapacity: 520 },
  classic_wood: { cycleRiders: 24, parkCapacity: 540 },
  modern_wood: { cycleRiders: 24, parkCapacity: 600 },
  advanced_wood: { cycleRiders: 24, parkCapacity: 620 },
  steel_hybrid: { cycleRiders: 24, parkCapacity: 640 },
  spinning_coaster: { cycleRiders: 20, parkCapacity: 480 },
  modern_looper: { cycleRiders: 28, parkCapacity: 600 },
  invert: { cycleRiders: 28, parkCapacity: 620 },
  launch: { cycleRiders: 24, parkCapacity: 580 },
  hydro_launch: { cycleRiders: 20, parkCapacity: 560 },
  dive: { cycleRiders: 24, parkCapacity: 580 },
  wing: { cycleRiders: 24, parkCapacity: 600 },
  flying: { cycleRiders: 28, parkCapacity: 560 },
  "4d_coaster": { cycleRiders: 20, parkCapacity: 520 },
  hyper: { cycleRiders: 32, parkCapacity: 680 },
  giga: { cycleRiders: 48, parkCapacity: 750 },
  strata: { cycleRiders: 24, parkCapacity: 640 },
  exa: { cycleRiders: 54, parkCapacity: 820 },
  crazy_bus: { cycleRiders: 12, parkCapacity: 220 },
  flyer: { cycleRiders: 16, parkCapacity: 260 },
  antique_cars: { cycleRiders: 20, parkCapacity: 320 },
  bumper_cars: { cycleRiders: 24, parkCapacity: 340 },
  demolition_derby: { cycleRiders: 24, parkCapacity: 350 },
  teacups: { cycleRiders: 24, parkCapacity: 380 },
  scrambler: { cycleRiders: 24, parkCapacity: 380 },
  air_race: { cycleRiders: 24, parkCapacity: 380 },
  drop_tower: { cycleRiders: 16, parkCapacity: 420 },
  nebulaz: { cycleRiders: 32, parkCapacity: 440 },
  claw: { cycleRiders: 24, parkCapacity: 440 },
  enterprise: { cycleRiders: 28, parkCapacity: 450 },
  chair_swings: { cycleRiders: 32, parkCapacity: 460 },
  disco: { cycleRiders: 24, parkCapacity: 480 },
  top_spin: { cycleRiders: 28, parkCapacity: 480 },
  giant_discovery: { cycleRiders: 30, parkCapacity: 500 },
  ferris_wheel: { cycleRiders: 48, parkCapacity: 560 },
  carousel: { cycleRiders: 48, parkCapacity: 620 },
  log_flume: { cycleRiders: 45, parkCapacity: 780 },
  legendary_splash_mountain: { cycleRiders: 45, parkCapacity: 780 },
  rapids: { cycleRiders: 54, parkCapacity: 860 },
  flying_theater: { cycleRiders: 72, parkCapacity: 920 },
  dark_ride: { cycleRiders: 80, parkCapacity: 950 },
  stage_show: { cycleRiders: 120, parkCapacity: 1200 },
  restaurant: { cycleRiders: 25, parkCapacity: 250 },
  diner: { cycleRiders: 25, parkCapacity: 250 },
  theater: { cycleRiders: 120, parkCapacity: 1200 },
  weenie: { cycleRiders: 30, parkCapacity: 300 },
  toilets: { cycleRiders: 0, parkCapacity: 0 },
  guest_services: { cycleRiders: 0, parkCapacity: 0 }
};

const LAND_THEME_MULTIPLIERS = { 0: 0, 1: 0.10, 2: 0.22, 3: 0.38, 4: 0.60 };

const WEATHER_ROLL_TABLE = [
  { roll: 1, mult: 0.92, label: "Cool & Rainy (0.92x)" },
  { roll: 2, mult: 0.96, label: "Overcast Skies (0.96x)" },
  { roll: 3, mult: 1.00, label: "Standard Season (1.00x)" },
  { roll: 4, mult: 1.04, label: "Warm & Sunny (1.04x)" },
  { roll: 5, mult: 1.08, label: "Record Tourism Boom (1.08x)" }
];

const RANDOM_PARK_NAMES = [
  "Emerald Gardens", "Starlight Kingdom", "Suncoast Thrills", "Iron Valley Park",
  "Olympus Horizons", "Phantom Peak", "Velocity Island", "Mirage Point",
  "Pacific Wonderland", "Zephyr Towers", "Avalon Woods", "Hyperion Bay"
];

const RANDOM_RIDE_NAMES = [
  "Leviathan's Fury", "Vortex", "Iron Condor", "Raptor Strike", "Goliath",
  "Banshee", "Hyperion", "Maverick", "Nemesis", "Kraken's Revenge",
  "Thunderbolt", "Orion's Flight", "Timber Wolf", "Outlaw Run", "Steel Vengeance",
  "Pharaoh's Curse", "Tatsu", "Alpengeist", "Millennium Flyer", "Mystic Timbers",
  "Blackwater Falls", "Phantom Theater"
];

const STARTING_UNLOCKED_IDS = [
  "scrambler", "bumper_cars", "chair_swings", "enterprise", "pirate_ship",
  "antique_cars", "ferris_wheel", "train", "stage_show",
  "classic_wood", "wild_mouse", "claw", "toilets", "restaurant", "guest_services"
];
/* ============================================================================
   CAMPUS 49-HEX DISTRICT GRID & ZONING CONSTANTS (v1.8)
   ============================================================================ */

// These logical asset keys resolve to procedural canvas packs in themePacks.js and regionalThemePacks.js.
const LAND_THEMES = [
  { id: "classic", name: "Classic Midway", badgeColor: "#fde68a", borderColor: "#a16207", sceneryAssets: { 0: "theme-pack/classic/tier-0", 1: "theme-pack/classic/tier-1", 2: "theme-pack/classic/tier-2", 3: "theme-pack/classic/tier-3", 4: "theme-pack/classic/tier-4" } },
  { id: "frontier", name: "Frontier Wilderness", badgeColor: "#bbf7d0", borderColor: "#15803d", sceneryAssets: { 0: "theme-pack/frontier/tier-0", 1: "theme-pack/frontier/tier-1", 2: "theme-pack/frontier/tier-2", 3: "theme-pack/frontier/tier-3", 4: "theme-pack/frontier/tier-4" } },
  { id: "western", name: "Western Badlands", badgeColor: "#fed7aa", borderColor: "#c2410c", sceneryAssets: { 0: "theme-pack/western/tier-0", 1: "theme-pack/western/tier-1", 2: "theme-pack/western/tier-2", 3: "theme-pack/western/tier-3", 4: "theme-pack/western/tier-4" } },
  { id: "medieval", name: "Medieval Kingdom", badgeColor: "#ddd6fe", borderColor: "#6d28d9", sceneryAssets: { 0: "theme-pack/medieval/tier-0", 1: "theme-pack/medieval/tier-1", 2: "theme-pack/medieval/tier-2", 3: "theme-pack/medieval/tier-3", 4: "theme-pack/medieval/tier-4" } },
  { id: "gothic", name: "Gothic Manor", badgeColor: "#cbd5e1", borderColor: "#475569", sceneryAssets: { 0: "theme-pack/gothic/tier-0", 1: "theme-pack/gothic/tier-1", 2: "theme-pack/gothic/tier-2", 3: "theme-pack/gothic/tier-3", 4: "theme-pack/gothic/tier-4" } },
  { id: "space", name: "Spaceport", badgeColor: "#bae6fd", borderColor: "#0369a1", sceneryAssets: { 0: "theme-pack/space/tier-0", 1: "theme-pack/space/tier-1", 2: "theme-pack/space/tier-2", 3: "theme-pack/space/tier-3", 4: "theme-pack/space/tier-4" } },
  { id: "jungle", name: "Jungle Expedition", badgeColor: "#a7f3d0", borderColor: "#047857", sceneryAssets: { 0: "theme-pack/jungle/tier-0", 1: "theme-pack/jungle/tier-1", 2: "theme-pack/jungle/tier-2", 3: "theme-pack/jungle/tier-3", 4: "theme-pack/jungle/tier-4" } },
  { id: "fiesta", name: "Latin Festival", badgeColor: "#fed7aa", borderColor: "#a8664a", sceneryAssets: { 0: "theme-pack/fiesta/tier-0", 1: "theme-pack/fiesta/tier-1", 2: "theme-pack/fiesta/tier-2", 3: "theme-pack/fiesta/tier-3", 4: "theme-pack/fiesta/tier-4" } },
  { id: "german", name: "German Village", badgeColor: "#fef3c7", borderColor: "#8c8374", sceneryAssets: { 0: "theme-pack/german/tier-0", 1: "theme-pack/german/tier-1", 2: "theme-pack/german/tier-2", 3: "theme-pack/german/tier-3", 4: "theme-pack/german/tier-4" } },
  { id: "alps", name: "Alpine Village", badgeColor: "#e0f2fe", borderColor: "#9db4c2", sceneryAssets: { 0: "theme-pack/alps/tier-0", 1: "theme-pack/alps/tier-1", 2: "theme-pack/alps/tier-2", 3: "theme-pack/alps/tier-3", 4: "theme-pack/alps/tier-4" } },
  { id: "nordic", name: "Nordic Village", badgeColor: "#d1fae5", borderColor: "#5f736c", sceneryAssets: { 0: "theme-pack/nordic/tier-0", 1: "theme-pack/nordic/tier-1", 2: "theme-pack/nordic/tier-2", 3: "theme-pack/nordic/tier-3", 4: "theme-pack/nordic/tier-4" } }
];

const WEENIE_CATALOG = [
  { id: "castle", name: "Fantasy Castle", themeId: "medieval", assetId: "castleKeep", assetScale: 0.075 },
  { id: "cathedral", name: "Ruined Cathedral", themeId: "gothic", assetId: "cathedralRuin", assetScale: 0.09 },
  { id: "rocket", name: "Rocket Ship", themeId: "space", assetId: "rocket", assetScale: 0.085 },
  { id: "saloon", name: "Saloon", themeId: "western", assetId: null, assetScale: 0.085 },
  { id: "fort", name: "Frontier Fort", themeId: "frontier", assetId: "stockadeFort", assetScale: 0.09 },
  { id: "bigtop", name: "Circus Tent", themeId: "classic", assetId: "bigTop", assetScale: 0.12 },
  { id: "temple", name: "Mayan Temple", themeId: "jungle", assetId: "stepPyramid", assetScale: 0.09 },
  { id: "church", name: "Festival Church", themeId: "fiesta", assetId: "festivalChurch", assetScale: 1 },
  { id: "festhaus", name: "Festhaus", themeId: "german", assetId: "festhaus", assetScale: 1 },
  { id: "mountain", name: "Snowy Mountain", themeId: "alps", assetId: "mountain", assetScale: 1 },
  { id: "longhouse", name: "Viking Longhouse", themeId: "nordic", assetId: "longhouse", assetScale: 1 }
].map(weenie => ({ ...weenie, baseCost: 50, techPoints: 25, spaces: 1 }));

// Per-tile scenery costs and points; land upgrades price at 10x these costs.
const TILE_SCENERY_TIERS = [
  { level: 0, name: "Un-themed", cost: 0,    upgradeCost: 0,    points: 0    },
  { level: 1, name: "Light",     cost: 0.50, upgradeCost: 0.50, points: 0.5  },
  { level: 2, name: "Medium",    cost: 1.50, upgradeCost: 1.00, points: 1.5  },
  { level: 3, name: "Heavy",     cost: 5.00, upgradeCost: 3.50, points: 5.0  },
  { level: 4, name: "Immersive", cost: 25.0, upgradeCost: 20.0, points: 25.0 }
];

// Land Cohesion (Harmony) Bonus Multipliers (Stacks with the 1.25x Zoned Land Multiplier)
const LAND_HARMONY_TIERS = {
  0: { bonus: 0,    label: "No Harmony" },
  1: { bonus: 0.10, label: "Light Harmony (+10%)" },
  2: { bonus: 0.20, label: "Medium Harmony (+20%)" },
  3: { bonus: 0.35, label: "Heavy Harmony (+35%)" },
  4: { bonus: 0.50, label: "Immersive Harmony (+50%)" }
};

// Pointy-top land slots in axial coordinates; each land has 12 buildable hexes.
const CAMPUS_LAND_SHAPES = {
  A: [
    { q: 0, r: 0 }, { q: 1, r: 0 }, { q: 2, r: 0 },
    { q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 1 }, { q: 2, r: 1 },
    { q: -1, r: 2 }, { q: 0, r: 2 }, { q: 1, r: 2 },
    { q: -1, r: 3 }, { q: 0, r: 3 }
  ],
  B_WEST: [
    { q: 0, r: 0 }, { q: 1, r: 0 }, { q: 2, r: 0 },
    { q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 1 },
    { q: -2, r: 2 }, { q: -1, r: 2 }, { q: 0, r: 2 },
    { q: -2, r: 3 }, { q: -1, r: 3 }, { q: 0, r: 3 }
  ],
  B_EAST: [
    { q: 0, r: 0 }, { q: 1, r: 0 }, { q: 2, r: 0 },
    { q: 0, r: 1 }, { q: 1, r: 1 }, { q: 2, r: 1 },
    { q: 0, r: 2 }, { q: 1, r: 2 }, { q: 2, r: 2 },
    { q: -1, r: 3 }, { q: 0, r: 3 }, { q: 1, r: 3 }
  ]
};

const CAMPUS_PARK_LAYOUTS = {
  small: {
    entrance: { q: -1, r: 5 },
    lands: [
      { id: "south_entry", name: "South Entry Plaza", shape: "A", q: 0, r: 1, unlocked: true, color: "#f97316" },
      { id: "west_wing", name: "West Wing", shape: "B_WEST", q: -2, r: 0, unlocked: true, color: "#7dd3fc" },
      { id: "north_expansion", name: "North Expansion", shape: "A", q: 2, r: -3, unlocked: false, color: "#94a3b8" },
      { id: "east_wing", name: "East Wing", shape: "B_EAST", q: 3, r: 0, unlocked: false, color: "#94a3b8" }
    ],
    waterFeatures: []
  },
  medium: {
    entrance: { q: -1, r: 6 },
    lands: [
      { id: "south_entry", name: "South Center Entry Land", shape: "A", q: 0, r: 2, unlocked: true, color: "#f97316" },
      { id: "north_center", name: "North Center Land", shape: "A", q: 2, r: -2, unlocked: true, color: "#7dd3fc" },
      { id: "southwest_wing", name: "Southwest Wing", shape: "A", q: -4, r: 3, unlocked: true, color: "#86efac" },
      { id: "southeast_wing", name: "Southeast Wing", shape: "A", q: 3, r: 3, unlocked: true, color: "#f9a8d4" },
      { id: "northwest_expansion", name: "Northwest Expansion", shape: "A", q: -2, r: -1, unlocked: false, color: "#94a3b8" },
      { id: "northeast_expansion", name: "Northeast Expansion", shape: "A", q: 5, r: -1, unlocked: false, color: "#94a3b8" }
    ],
    waterFeatures: [
      { id: "west_pond", q: -2.7, r: 2.8, width: 1.05, height: 0.62 },
      { id: "east_pond", q: 5.3, r: 2.8, width: 1.05, height: 0.62 }
    ]
  },
  starting_rolland: {
    entrance: { q: -1, r: 6 },
    lands: [
      ...[
        { id: "south_entry", name: "South Center Entry Land", shape: "A", q: 0, r: 2, unlocked: true, color: "#f97316" },
        { id: "north_center", name: "North Center Land", shape: "A", q: 2, r: -2, unlocked: true, color: "#7dd3fc" },
        { id: "southwest_wing", name: "Southwest Wing", shape: "A", q: -4, r: 3, unlocked: true, color: "#86efac" },
        { id: "southeast_wing", name: "Southeast Wing", shape: "A", q: 3, r: 3, unlocked: true, color: "#f9a8d4" },
        { id: "northwest_expansion", name: "Northwest Expansion", shape: "A", q: -2, r: -1, unlocked: false, color: "#94a3b8" },
        { id: "northeast_expansion", name: "Northeast Expansion", shape: "A", q: 5, r: -1, unlocked: false, color: "#94a3b8" }
      ],
      { id: "extra_northwest_expansion", name: "Extra Northwest Expansion", shape: "A", q: 0, r: -5, unlocked: false, color: "#94a3b8" },
      { id: "extra_northeast_expansion", name: "Extra Northeast Expansion", shape: "A", q: 7, r: -5, unlocked: false, color: "#94a3b8" }
    ],
    waterFeatures: [
      { id: "west_pond", q: -2.7, r: 2.8, width: 1.05, height: 0.62 },
      { id: "east_pond", q: 5.3, r: 2.8, width: 1.05, height: 0.62 }
    ]
  },
  large: {
    entrance: { q: -1, r: 8 },
    lands: [
      { id: "south_entry", name: "South Entry Land", shape: "A", q: 0, r: 4, unlocked: true, color: "#f97316" },
      { id: "lower_west", name: "Lower-West Land", shape: "A", q: -2, r: 2, unlocked: true, color: "#86efac" },
      { id: "upper_west", name: "Upper-West Land", shape: "A", q: 0, r: -2, unlocked: true, color: "#a16207" },
      { id: "lower_east", name: "Lower-East Land", shape: "A", q: 4, r: 2, unlocked: true, color: "#f9a8d4" },
      { id: "upper_east", name: "Upper-East Land", shape: "A", q: 6, r: -2, unlocked: true, color: "#4ade80" },
      { id: "north_center", name: "North Center Land", shape: "B_WEST", q: 5, r: -5, unlocked: true, color: "#7dd3fc" },
      { id: "far_northwest_expansion", name: "Far Northwest Expansion", shape: "A", q: 0, r: -6, unlocked: false, color: "#94a3b8" },
      { id: "far_northeast_expansion", name: "Far Northeast Expansion", shape: "A", q: 10, r: -6, unlocked: false, color: "#94a3b8" }
    ],
    waterFeatures: [
      { id: "central_lagoon", q: 1, r: 1, width: 3.2, height: 2.2 },
      { id: "upper_pond", q: 5.7, r: -2.2, width: 0.95, height: 0.62 }
    ]
  }
};

const CAMPUS_EXPANSION_COST = 5;

// Weighted climate has a long-run average of approximately 0.92x.
const GLOBAL_TOURISM_TABLE = [
  {
    id: "crisis",
    label: "📉 Global Travel Slump",
    mult: 0.65,
    weight: 2,
    badgeClass: "badge-red",
    headline: "📉 <strong>GLOBAL TRAVEL SLUMP (0.65x):</strong> High inflation and fuel costs hammer discretionary spending! Worldwide theme park attendance drops sharply across all chains."
  },
  {
    id: "recession",
    label: "🌧️ Economic Cooling",
    mult: 0.80,
    weight: 4,
    badgeClass: "badge-red",
    headline: "🌧️ <strong>ECONOMIC COOLING (0.80x):</strong> Consumer confidence dips this season, tightening family vacation budgets nationwide."
  },
  {
    id: "sluggish",
    label: "☁️ Soft Tourism Market",
    mult: 0.90,
    weight: 4,
    badgeClass: "badge-purple",
    headline: null
  },
  {
    id: "steady",
    label: "⚖️ Normal Tourism Demand",
    mult: 1.00,
    weight: 5,
    badgeClass: "badge-teal",
    headline: null
  },
  {
    id: "growth",
    label: "☀️ Strong Travel Season",
    mult: 1.10,
    weight: 2,
    badgeClass: "badge-green",
    headline: "☀️ <strong>STRONG TRAVEL SEASON (1.10x):</strong> Upbeat consumer spending boosts domestic travel and theme park turnstiles nationwide!"
  },
  {
    id: "boom",
    label: "🚀 Worldwide Tourism Boom",
    mult: 1.25,
    weight: 1,
    badgeClass: "badge-gold",
    headline: "🚀 <strong>WORLDWIDE TOURISM BOOM (1.25x):</strong> Record-breaking vacation demand sends theme park attendance surging across every region!"
  }
];