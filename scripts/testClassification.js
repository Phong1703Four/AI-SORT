/**
 * Standalone Test Suite for AI Sort Waste Classification
 * Verifies category matching accuracy, weighted multi-predictions, 
 * explicit overrides, and word boundary regexes.
 */

// Mock translation function
const mockT = (key) => {
  const translations = {
    'games.organic': 'ORGANIC',
    'games.recycle': 'RECYCLE',
    'games.inorganic': 'INORGANIC',
    'games.hazardous': 'HAZARDOUS'
  };
  return translations[key] || key;
};

// Copy of upgraded classification logic from wasteAnalysisData.ts to run in zero-dependency Node.js
const getExplicitCategory = (className) => {
  const name = className.toLowerCase();
  if (name.includes('notebook computer') || name.includes('laptop') || name.includes('keyboard') || name.includes('monitor') || name.includes('mouse') || name.includes('printer')) {
    return 'hazardous';
  }
  if (name === 'notebook' || name === 'writing pad' || name === 'book' || name === 'envelope' || name === 'binder') {
    return 'recycle';
  }
  if (name.includes('banana') || name.includes('apple') || name.includes('orange') || name.includes('pineapple') || name.includes('cabbage') || name.includes('broccoli') || name.includes('lemon') || name.includes('fig') || name.includes('eggplant')) {
    return 'organic';
  }
  if (name.includes('bottle') || name.includes('cup') || name.includes('beaker') || name.includes('can') || name.includes('carton') || name.includes('cardboard')) {
    return 'recycle';
  }
  if (name.includes('battery') || name.includes('ipod') || name.includes('cellular') || name.includes('phone') || name.includes('thermometer') || name.includes('syringe')) {
    return 'hazardous';
  }
  if (name.includes('shoe') || name.includes('clothing') || name.includes('shirt') || name.includes('sock') || name.includes('furniture') || name.includes('brick') || name.includes('ceramic') || name.includes('porcelain')) {
    return 'inorganic';
  }
  return null;
};

const analyzeWasteResult = (predictions, language = 'en') => {
  if (!predictions || predictions.length === 0) {
    return { type: mockT('games.recycle') };
  }
  const rankWeights = [1.0, 0.6, 0.4];
  const scores = { recycle: 0, organic: 0, hazardous: 0, inorganic: 0 };

  const recycleRegex = /\b(bottle|plastic|cup|can|box|paper|carton|wrapper|glass|metal|tin|jar|jug|container|packet|aluminum|steel|cardboard|magazine|envelope|newspaper|book|booklet|brochure|flyer|tissue|towel|mug|pitcher|bucket|basket|crate|barrel|tub|beaker|flask|vial|goblet|teapot|coffeepot|mixing bowl|plate|bowl|dish|tray|fork|spoon|knife|ruler|pencil|pen|marker|eraser|glue|tape|paperclip|foil|wrap|pipette|funnel|mortar|pestle|kettle|saucer|clipboard)\b/i;
  const organicRegex = /\b(apple|banana|orange|lemon|lime|strawberry|grape|pineapple|fig|pomegranate|pear|peach|plum|cherry|berry|melon|watermelon|mango|papaya|avocado|coconut|durian|guava|lychee|rambutan|jackfruit|passionfruit|kiwi|apricot|nectarine|persimmon|date|raisin|prune|cranberry|blueberry|raspberry|blackberry|broccoli|cauliflower|cucumber|zucchini|corn|cabbage|artichoke|pepper|cardoon|squash|pumpkin|eggplant|potato|tomato|carrot|radish|turnip|beet|onion|garlic|ginger|turmeric|leek|scallion|celery|asparagus|spinach|lettuce|kale|chard|sprout|okra|bean|pea|lentil|chickpea|soybean|tofu|tempeh|pizza|burrito|ice cream|chocolate|bread|pretzel|bagel|cheeseburger|hamburger|sandwich|pasta|carbonara|soup|salad|steak|chicken|pork|beef|fish|seafood|shrimp|crab|lobster|oyster|clam|mussel|egg|cheese|butter|yogurt|milk|cream|rice|noodle|grain|wheat|barley|oat|rye|millet|quinoa|seed|nut|peanut|almond|walnut|cashew|pistachio|hazelnut|chestnut|compost|peel|shell|bone|fat|oil|plant|flower|leaf|meat|hay|straw|potpie|trifle|grocery|bakery|confectionery|dough|guacamole|dog|cat|bird|animal|person|people|man|woman|face|boy|girl|tree|grass|wood|log|timber|lumber|branch|stick|root|bark|moss|lichen|fungus|mushroom|yeast|algae|kelp|seaweed|bamboo|reed|cane|palm|fern|shrub|bush|vine|ivy|herb|spice)\b/i;
  const hazardousRegex = /\b(battery|electronic|phone|computer|screen|monitor|lamp|bulb|switch|power|cellular|notebook|printer|mouse pad|modem|hard disc|ipod|remote control|joystick|cassette|cd|radio|television|crt|oscilloscope|vacuum|iron|fan|heater|microwave|toaster|waffle|refrigerator|washer|dryer|dishwasher|keyboard|mouse|laptop|speaker|camera|lens|charger|adapter|cable|wire|plug|socket|board|chip|sensor|diode|transistor|capacitor|resistor|inductor|transformer|relay|fuse|breaker|pill|medicine|syringe|stethoscope|chemical|toxic|acid|solvent|poison|toxin|drug|vaccine|serum|swab|bandage|gauze|scalpel|blade|catheter|tube|vial|ampoule|xray|ultrasound|mri|ct|microscope|thermometer|meter|gauge|engine|motor|generator|turbine|boiler|pump|compressor|valve)\b/i;
  const inorganicRegex = /\b(clothing|textile|shirt|pants|sock|shoe|hat|bag|backpack|wallet|purse|jacket|coat|suit|dress|skirt|scarf|tie|glove|boot|sandal|slipper|tshirt|sweater|pullover|cardigan|vest|underwear|swimwear|towel|blanket|sheet|pillow|cushion|curtain|carpet|rug|mat|cloth|fabric|yarn|thread|needle|scissors|bed|couch|chair|desk|table|furniture|cabinet|wardrobe|dresser|bookcase|shelf|bench|stool|sofa|loveseat|recliner|futon|mattress|frame|headboard|footboard|chest|trunk|credenza|buffet|sideboard|armoire|vanity|mirror|building|house|street|sky|mountain|clay|brick|stone|rock|concrete|cement|asphalt|plaster|gypsum|drywall|tile|shingle|siding|insulation|glass|window|door|frame|panel|board|beam|column|truss|joist|stud|rafter|sheathing|decking|flooring|ceiling|wall|roof|foundation|slab|footing|pier|pile|caisson|abutment|span|arch|deck|railing|barrier|fence|gate|retaining wall|gabion|riprap|gravel|sand|silt|soil|dirt|mud|peat|muck|loam|cobble|boulder|bedrock|ore|mineral|coal|coke|slag|ash|clinker|dust|powder|granule|pellet|flake|chip|shaving|sawdust|fiber|wool|hair|feather|down|leather|hide|skin|fur|silk|cotton|linen|jute|hemp|sisal|coir|ramie|manila|abaca|bamboo|rattan|wicker|balloon|sponge|ceramic|porcelain|terracotta|earthenware|stoneware|glassware|telescope|binoculars|prism|windshield|sunroof|headlight|taillight|indicator|dashboard|instrument|control|pedal|lever|knob|button|dial|display|microphone|headphone|earphone|headset|handset|telephone|intercom|transmitter|receiver|antenna|dish|satellite|radar|sonar|lidar|gps|navigation|compass|sextant|chronometer|clock|watch|timer|stopwatch|metronome|counter|scale|balance|barometer|manometer|hygrometer|anemometer|wind vane|rain gauge|seismograph|spectrograph|colorimeter|refractometer|polarimeter|interferometer|projector|copier|plotter|fax|telex|typewriter|calculator|hvac|duct|grille|register|diffuser|damper|silencer|attenuator|hood|canopy|exhaust|chimney|flue|stack|vent|gasket|seal|o-ring|bearing|gear|pulley|belt|chain|coupling|clutch|brake|shadow|axle|wheel|tire|track|screw|bolt|nut|warning|washer|rivet|key|cotter|retaining ring|snap ring|spring|damper|shock absorber|strut|suspension|steering|linkage|joint|knuckle|spindle|hub|rim|spoke|harness|block|strip|contactor|solenoid|solenoid valve|actuator|piston|ram|jack|press|hoist|winch|crane|derrick|gantry|boom|jib|hook|tackle|sheave|rope|wire rope|strap|shackle|swivel|turnbuckle|eyebolt|ring|clamp|grip|spelter|sleeve|thimble|clip|plastic bag|nylon|rubber|tire|wheel|pipe|tube|wire|cable)\b/i;

  const topResult = predictions[0];
  const detectedName = topResult.className.split(',')[0].toUpperCase();
  const confidence = (topResult.probability * 100).toFixed(1);

  predictions.slice(0, 3).forEach((p, index) => {
    const weight = rankWeights[index] || 0.3;
    const prob = p.probability;
    const name = p.className.toLowerCase();

    const explicitCat = getExplicitCategory(name);
    if (explicitCat) {
      scores[explicitCat] += prob * weight * 1.5;
      return;
    }

    if (hazardousRegex.test(name)) scores.hazardous += prob * weight;
    if (recycleRegex.test(name)) scores.recycle += prob * weight;
    if (organicRegex.test(name)) scores.organic += prob * weight;
    if (inorganicRegex.test(name)) scores.inorganic += prob * weight;
  });

  let winningCat = 'inorganic';
  let highestScore = 0;
  Object.keys(scores).forEach((cat) => {
    if (scores[cat] > highestScore) {
      highestScore = scores[cat];
      winningCat = cat;
    }
  });

  if (highestScore === 0) {
    const topName = topResult.className.toLowerCase();
    if (topName.match(/battery|phone|computer|screen|monitor|electronic|bulb/i)) winningCat = 'hazardous';
    else if (topName.match(/bottle|plastic|cup|can|box|paper|carton/i)) winningCat = 'recycle';
    else if (topName.match(/apple|banana|orange|peel|leaf|wood|plant/i)) winningCat = 'organic';
    else winningCat = 'inorganic';
  }

  return { type: mockT(`games.${winningCat}`), detectedName, confidence };
};

// Unit test cases
const testCases = [
  {
    name: 'Standard Organic Match (Banana)',
    predictions: [{ className: 'banana', probability: 0.98 }],
    expected: 'ORGANIC'
  },
  {
    name: 'Standard Recyclable Match (Water Bottle)',
    predictions: [{ className: 'water bottle', probability: 0.95 }],
    expected: 'RECYCLE'
  },
  {
    name: 'Multi-Prediction Weighted Overrides (No greedy override)',
    predictions: [
      { className: 'banana', probability: 0.85 },
      { className: 'plate', probability: 0.15 } // Plate is recycle keyword
    ],
    expected: 'ORGANIC'
  },
  {
    name: 'Laptop computer (Hazardous)',
    predictions: [{ className: 'notebook, notebook computer', probability: 0.90 }],
    expected: 'HAZARDOUS'
  },
  {
    name: 'Paper notebook (Recyclable)',
    predictions: [{ className: 'notebook', probability: 0.92 }],
    expected: 'RECYCLE'
  },
  {
    name: 'Foil vs Oil (Foil should be Recycle)',
    predictions: [{ className: 'foil wrapper', probability: 0.90 }],
    expected: 'RECYCLE'
  },
  {
    name: 'Catheter vs Cat (Catheter should be Hazardous, not Organic)',
    predictions: [{ className: 'catheter tube', probability: 0.95 }],
    expected: 'HAZARDOUS'
  },
  {
    name: 'Sneaker shoe (Inorganic)',
    predictions: [{ className: 'running shoe, sneaker', probability: 0.90 }],
    expected: 'INORGANIC'
  },
  {
    name: 'Syringe medical tool (Hazardous)',
    predictions: [{ className: 'syringe, needle', probability: 0.88 }],
    expected: 'HAZARDOUS'
  }
];

// Run tests
console.log('\n=========================================');
console.log('🤖 RUNNING AI SORT CLASSIFICATION TESTS...');
console.log('=========================================\n');

let passedCount = 0;
testCases.forEach((tc, idx) => {
  const result = analyzeWasteResult(tc.predictions);
  const passed = result.type === tc.expected;
  if (passed) {
    passedCount++;
    console.log(`✅ [Test ${idx + 1}] PASSED: "${tc.name}" -> Mapped to ${result.type}`);
  } else {
    console.error(`❌ [Test ${idx + 1}] FAILED: "${tc.name}" -> Mapped to ${result.type} (Expected: ${tc.expected})`);
  }
});

console.log('\n=========================================');
console.log(`📊 TEST RESULTS: ${passedCount}/${testCases.length} PASSED`);
console.log('=========================================\n');

if (passedCount === testCases.length) {
  console.log('✨ ALL CLASSIFICATION TESTS PASSED PERFECTLY!\n');
  process.exit(0);
} else {
  console.error('⚠️ SOME TESTS FAILED. PLEASE CHECK COMPILER OR REGEX RULES.\n');
  process.exit(1);
}
