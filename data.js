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
    name: "Walt Disney",
    title: "The Immersive Visionary",
    img: "Images/walt_disney.jpg",
    defaultChain: "Walt Disney Attractions",
    defaultPark: "Disneyland",
    desc: "+100% Harmony bonus (Doubled). Maintenance odds increased to 12% & Broken odds to 6%."
  },
  {
    id: "michael_eisner",
    name: "Michael Eisner",
    title: "The Rapid Expansionist",
    img: "Images/michael_eisner.jpg",
    defaultChain: "EuroDisney Corp",
    defaultPark: "Disney-MGM Studios",
    desc: "New parks cost 30% less; first 2 rides built in a purchased park get 40% off. Flat rides cost +10%."
  },
  {
    id: "matt_ouimet",
    name: "Matt",
    title: "The Paced Quality Builder",
    img: "Images/matt_ouimet.jpg",
    defaultChain: "Cedar Fair Entertainment",
    defaultPark: "Cedar Point",
    desc: "5% discount on the first attraction added during each turn.",
    parkNames: ["Carowinds Resort", "Monarch Island", "Monarch Dominion", "Wonderland North", "California's Great Midway", "Gilroy Botanical Gardens"]
  },
  {
    id: "jim_reid",
    name: "Jim",
    title: "The Thrill & Clone Mogul",
    img: "Images/jim_reid.jpg",
    defaultChain: "Six Flags Entertainment",
    defaultPark: "Six Flags Great Adventure",
    desc: "15% ride discount if that model already exists in another park in your chain. Plot scenery costs +15%.",
    parkNames: ["Thrill Flags Magic Mountain", "Thrill Flags Great Adventure", "Thrill Flags Great America", "Thrill Flags Fiesta Texas", "Thrill Flags New England", "Thrill Flags Discovery Kingdom"]
  },
  {
    id: "roland_mack",
    name: "Lukas",
    title: "The R&D & Mega-Campus Engineer",
    img: "Images/rolland_mack.jpg",
    defaultChain: "Mack Leisure Group",
    defaultPark: "Europa-Park",
    desc: "Initial park gets +2 extra expansion plots (4 total). Scenic upgrades cost 5% less. Buying extra parks costs +20%.",
    parkNames: ["Continental-Park", "Nordic-Waterworld", "Americana-Park", "Pacifica-Park", "Bavaria-Park", "Mediterranea-Park"]
  },
  {
    id: "hugo_herschend",
    name: "Hugo Herschend",
    title: "The Nostalgia & Artisan Operator",
    img: "Images/hugo_herschend.jpg",
    defaultChain: "Herschend Family Ent.",
    defaultPark: "Silver Dollar City",
    desc: "Stage Show, River Rapids & Park Train receive a +20% point bonus. Flat rides cost +10%."
  },
  {
    id: "john_arie",
    name: "John Arie Jr.",
    title: "The Flat-Ride & Value Hustler",
    img: "Images/john_arie.jpg",
    defaultChain: "Fun Spot America",
    defaultPark: "Fun Spot Orlando",
    desc: "Flat rides cost 15% less. All Plot & Ride scenery costs +10%."
  },
  {
    id: "angus_wynne",
    name: "Angus",
    title: "The Regional Flag Pioneer",
    img: "Images/angus_wynne.jpg",
    defaultChain: "Great Southwest Corp",
    defaultPark: "Six Flags Over Texas",
    desc: "New parks cost 50% less. Classic era rides gain +10% points. Scenery upgrades cost +10%.",
    parkNames: ["Six Banners Over Texas", "Six Banners Over Georgia", "Six Banners Over Mid-America", "Six Banners AstroWorld", "Six Banners Over the Gulf", "Six Banners Over the Carolinas"]
  },
  {
    id: "anton_pieck",
    name: "Willem",
    title: "The Fairytale & Folklore Artist",
    img: "Images/anton_pieck.jpg",
    defaultChain: "Pieck Storybook Parks",
    defaultPark: "Fairytale Gardens",
    desc: "Harmony requires just 2 attractions per land. Rides are twice as likely to become Cult Classics. Attraction construction costs 5% more.",
    parkNames: ["Sprookjeswald", "Grimmwood Forest", "Fablehaven", "Mythos Woods", "Andersen Gardens", "Avalon Hollow"]
  },
  {
    id: "milton_hershey",
    name: "Arthur",
    title: "The Confectionery Baron",
    img: "Images/milton_hershey.jpg",
    defaultChain: "Hershey Leisure",
    defaultPark: "Chocolate World",
    desc: "F&B profits increase by 6%. Annual ride upkeep costs 50% more.",
    parkNames: ["Cocoa Valley Park", "Sweetwater Confectionery Park", "Cocoa Avenue Gardens", "Sugar Mill Pleasure Grounds", "Caramel Valley Resort", "Peppermint Point"]
  },
  {
    id: "jay_stein",
    name: "Jay",
    title: "The Studio Backlot Mogul",
    img: "Images/jay_stein.jpg",
    defaultChain: "Stein Entertainment",
    defaultPark: "Studio Adventure",
    desc: "Ride scenery generates 8% more points. Rides age 5% faster.",
    parkNames: ["Global Studios Florida", "Global Studios Hollywood", "Global Mediterranea", "Global Studios Europe", "Global Studios Chicago", "Global Studios Texas"]
  },
  {
    id: "mark_woodburry",
    name: "Mark",
    title: "The Seasonal & Portal Innovator",
    img: "Images/mark_woodbury.jpg",
    defaultChain: "Woodburry Parks",
    defaultPark: "Woodburry Adventure Park",
    desc: "A park gets 2% more attendance in years when it adds an attraction. Rides age 4% faster.",
    parkNames: ["Epic Portals Universe", "Isles of Adventure", "Global Studios Osaka", "Global Studios Beijing", "Krakatoa Volcano Bay", "Global Kids Resort"]
  },
  {
    id: "walter_knott",
    name: "Walter",
    title: "The Ghost Town Pioneer",
    img: "Images/walter_knott.jpg",
    defaultChain: "Knott Family Parks",
    defaultPark: "Knott's Berry Farm",
    desc: "Light theming is free for campus tiles (not rides). Clearing expansion tiles costs 15% more.",
    parkNames: ["Walter's Boysenberry Farm", "Calico Silver Ghost Town", "Buena Vista Peach Orchard", "Sierra Timber Country", "Mojave Gold Rush Camp", "Golden State Apple Valley"]
  },
  {
    id: "george_milley",
    name: "George",
    title: "The Marine & Waterpark Showman",
    img: "Images/george_milley.jpg",
    defaultChain: "Milley Entertainment",
    defaultPark: "Ocean Adventure",
    desc: "Every new park receives a free Stage Show. Build up to 3 Stage Shows per park.",
    parkNames: ["OceanWorld San Diego", "OceanWorld Orlando", "OceanWorld San Antonio", "OceanWorld Ohio", "Splash 'n Wild Orlando", "Splash 'n Wild Emerald Pointe"]
  },
  {
    id: "dick_kinzel",
    name: "Dick",
    title: "The Coaster Wars Titan",
    img: "Images/dick_kinzel.jpg",
    defaultChain: "Kinzel Amusements",
    defaultPark: "Great Lakes Park",
    desc: "Rides holding one or more world records generate 20% more ride points.",
    parkNames: ["Sandusky Point", "Valleyfair Grounds", "Lehigh Park", "Worlds of Thrills", "Michigan's Coaster Coast", "Geauga Lakefront"]
  },
  {
    id: "john_arie",
    name: "John",
    title: "The Roadside Thrill Maverick",
    img: "Images/john_arie.jpg",
    defaultChain: "Fun Spot America",
    defaultPark: "Fun Spot Orlando",
    desc: "Flat rides cost 15% less. All Plot & Ride scenery costs +10%.",
    parkNames: ["Thrill Spot Orlando", "Thrill Spot Kissimmee", "Thrill Spot Atlanta", "Thrill Spot Chicago", "Thrill Spot Dallas", "Thrill Spot Myrtle Beach"]
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
    name: "Park Restaurant",
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
  }
];

const FLAT_RIDE_CATALOG = [
  { id: "scrambler", name: "Scrambler", era: "classic", subType: "family", cost: 1.5, points: 2.5, researchCost: 0, spaces: 1 },
  { id: "carousel", name: "Carousel", era: "classic", subType: "family", cost: 1.5, points: 2.5, researchCost: 0, spaces: 1 },
  { id: "flyer", name: "Flyer", era: "classic", subType: "family", cost: 1.5, points: 2.5, researchCost: 0, spaces: 1 },
  { id: "bumper_cars", name: "Bumper Cars", era: "classic", subType: "family", cost: 1.5, points: 2.5, researchCost: 0, spaces: 1 },
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
  { id: "flying_theater", name: "Flying Theater", era: "advanced", subType: "thrill", cost: 12.0, points: 16.5, researchCost: 4.0, spaces: 2, lifespan: 25, maxPerPark: 1 }
];

const RAW_COASTERS = [
  ["classic_wood","Classic Wood","wood","classic",15,4.5,0,2000,3600,100,.5,60,120,10,.5,false,0,0,0,false],
  ["wild_mouse","Classic Wild Mouse","steel","classic",15,3.5,0,1500,3500,100,.5,50,100,10,.5,false,0,0,0,false],
  ["classic_looper","Classic Looper","steel","classic",15,5.0,2,2200,4000,100,.25,70,150,10,.25,true,1,20,1,false],
  ["classic_hyper","Classic Hyper","steel","classic",15,11.0,2,3500,5500,100,1,200,230,10,.5,false,0,0,0,false],
  ["swinging","Swinging Coaster","steel","classic",15,6.0,1,2200,4000,100,.25,70,170,10,.25,false,0,0,0,false],
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
  ["giga","Giga Coaster","steel","advanced",25,16.0,4,4500,7000,100,1,310,370,10,1,true,0,20,1,false],
  ["strata","Strata Coaster","steel","advanced",25,20.0,7,4500,8000,200,1,420,500,10,2,true,0,20,1,false],
  ["axis","Axis Coaster","steel","advanced",25,12.0,7,2200,4000,100,1,150,250,20,1,true,3,20,1,false],
  ["exa","EXA Coaster","steel","advanced",25,25.0,10,5000,10000,100,2,600,600,20,3,true,0,20,1,false]
];

const COASTER_CATALOG = RAW_COASTERS.map(c => ({
  id: c[0], name: c[1], track: c[2], gen: c[3], era: c[3], lifespan: c[4], cost: c[5], researchCost: c[6],
  baseLen: c[7], maxLen: c[8], lenStep: c[9], lenCost: c[10], baseHeight: c[11], maxHeight: c[12], heightStep: c[13], heightCost: c[14],
  canInvert: c[15], baseInv: c[16], maxInv: c[17], invCost: c[18], fixed: c[19]
}));

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

// These logical asset keys resolve to procedural canvas packs in themePacks.js.
const LAND_THEMES = [
  { id: "classic", name: "Classic Midway", badgeColor: "#fde68a", borderColor: "#a16207", sceneryAssets: { 0: "theme-pack/classic/tier-0", 1: "theme-pack/classic/tier-1", 2: "theme-pack/classic/tier-2", 3: "theme-pack/classic/tier-3", 4: "theme-pack/classic/tier-4" } },
  { id: "frontier", name: "Frontier Wilderness", badgeColor: "#bbf7d0", borderColor: "#15803d", sceneryAssets: { 0: "theme-pack/frontier/tier-0", 1: "theme-pack/frontier/tier-1", 2: "theme-pack/frontier/tier-2", 3: "theme-pack/frontier/tier-3", 4: "theme-pack/frontier/tier-4" } },
  { id: "western", name: "Western Badlands", badgeColor: "#fed7aa", borderColor: "#c2410c", sceneryAssets: { 0: "theme-pack/western/tier-0", 1: "theme-pack/western/tier-1", 2: "theme-pack/western/tier-2", 3: "theme-pack/western/tier-3", 4: "theme-pack/western/tier-4" } },
  { id: "medieval", name: "Medieval Kingdom", badgeColor: "#ddd6fe", borderColor: "#6d28d9", sceneryAssets: { 0: "theme-pack/medieval/tier-0", 1: "theme-pack/medieval/tier-1", 2: "theme-pack/medieval/tier-2", 3: "theme-pack/medieval/tier-3", 4: "theme-pack/medieval/tier-4" } },
  { id: "gothic", name: "Gothic Manor", badgeColor: "#cbd5e1", borderColor: "#475569", sceneryAssets: { 0: "theme-pack/gothic/tier-0", 1: "theme-pack/gothic/tier-1", 2: "theme-pack/gothic/tier-2", 3: "theme-pack/gothic/tier-3", 4: "theme-pack/gothic/tier-4" } },
  { id: "space", name: "Spaceport", badgeColor: "#bae6fd", borderColor: "#0369a1", sceneryAssets: { 0: "theme-pack/space/tier-0", 1: "theme-pack/space/tier-1", 2: "theme-pack/space/tier-2", 3: "theme-pack/space/tier-3", 4: "theme-pack/space/tier-4" } },
  { id: "jungle", name: "Jungle Expedition", badgeColor: "#a7f3d0", borderColor: "#047857", sceneryAssets: { 0: "theme-pack/jungle/tier-0", 1: "theme-pack/jungle/tier-1", 2: "theme-pack/jungle/tier-2", 3: "theme-pack/jungle/tier-3", 4: "theme-pack/jungle/tier-4" } }
];

const WEENIE_CATALOG = [
  { id: "castle", name: "Fantasy Castle", themeId: "medieval", assetId: "castleKeep", assetScale: 0.075 },
  { id: "cathedral", name: "Ruined Cathedral", themeId: "gothic", assetId: "cathedralRuin", assetScale: 0.09 },
  { id: "rocket", name: "Rocket Ship", themeId: "space", assetId: "rocket", assetScale: 0.085 },
  { id: "saloon", name: "Saloon", themeId: "western", assetId: null, assetScale: 0.085 },
  { id: "fort", name: "Frontier Fort", themeId: "frontier", assetId: "stockadeFort", assetScale: 0.09 },
  { id: "bigtop", name: "Circus Tent", themeId: "classic", assetId: "bigTop", assetScale: 0.12 },
  { id: "temple", name: "Mayan Temple", themeId: "jungle", assetId: "stepPyramid", assetScale: 0.09 }
].map(weenie => ({ ...weenie, baseCost: 25, techPoints: 25, spaces: 1 }));

// Per-Hex Ground Tile Scenery Costs & Base Points
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

// Park Size Configurations (Cleared Starter Hexes vs. Woods Expansion Cap)
const PARK_SIZE_SPECS = {
  small:    { clearedCount: 11, maxWoodsExpansions: 14, baseClearCost: 0.60 },
  medium:   { clearedCount: 19, maxWoodsExpansions: 18, baseClearCost: 0.50 },
  starting: { clearedCount: 19, maxWoodsExpansions: 18, baseClearCost: 0.50 },
  large:    { clearedCount: 29, maxWoodsExpansions: 20, baseClearCost: 0.40 }
};

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