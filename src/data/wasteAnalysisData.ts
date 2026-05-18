export interface ScanResult {
  type: string;
  name: string;
  confidence: string | number;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  description: string;
  action: string;
}

// A mapping of explicit ImageNet classNames or words to their exact correct category
const getExplicitCategory = (className: string): 'recycle' | 'organic' | 'hazardous' | 'inorganic' | null => {
  const name = className.toLowerCase();
  
  // Notebook exception: in ImageNet, class 681 is "notebook, notebook computer" which represents a laptop computer (hazardous).
  if (name.includes('notebook computer') || name.includes('laptop') || name.includes('keyboard') || name.includes('monitor') || name.includes('mouse') || name.includes('printer')) {
    return 'hazardous';
  }
  
  // Writing pad notebook
  if (name === 'notebook' || name === 'writing pad' || name === 'book' || name === 'envelope' || name === 'binder') {
    return 'recycle';
  }
  
  // Direct matches for common items
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

export const analyzeWasteResult = (
  predictions: any[],
  language: string,
  t: (key: string) => string
): ScanResult => {
  if (!predictions || predictions.length === 0) {
    // Default fallback scan result
    return {
      type: t('games.recycle'),
      name: 'UNKNOWN',
      confidence: 50.0,
      color: 'text-brand-blue',
      bgColor: 'bg-brand-blue/10',
      borderColor: 'border-brand-blue/30',
      icon: '♻️',
      description: language === 'en' ? 'Unidentified item. Defaulting to recyclable.' : 'Không nhận diện được vật phẩm. Đặt mặc định là có thể tái chế.',
      action: language === 'en' ? 'Sort into appropriate bin.' : 'Phân loại vào thùng rác thích hợp.',
    };
  }

  // Define weights for predictions by rank
  const rankWeights = [1.0, 0.6, 0.4];

  // Initialize scores
  const scores = {
    recycle: 0,
    organic: 0,
    hazardous: 0,
    inorganic: 0
  };

  // Compile regular expressions with word boundaries
  const recycleRegex = /\b(bottle|plastic|cup|can|box|paper|carton|wrapper|glass|metal|tin|jar|jug|container|packet|aluminum|steel|cardboard|magazine|envelope|newspaper|book|booklet|brochure|flyer|tissue|towel|mug|pitcher|bucket|basket|crate|barrel|tub|beaker|flask|vial|goblet|teapot|coffeepot|mixing bowl|plate|bowl|dish|tray|fork|spoon|knife|ruler|pencil|pen|marker|eraser|glue|tape|paperclip|foil|wrap|pipette|funnel|mortar|pestle|kettle|saucer|clipboard)\b/i;
  const organicRegex = /\b(apple|banana|orange|lemon|lime|strawberry|grape|pineapple|fig|pomegranate|pear|peach|plum|cherry|berry|melon|watermelon|mango|papaya|avocado|coconut|durian|guava|lychee|rambutan|jackfruit|passionfruit|kiwi|apricot|nectarine|persimmon|date|raisin|prune|cranberry|blueberry|raspberry|blackberry|broccoli|cauliflower|cucumber|zucchini|corn|cabbage|artichoke|pepper|cardoon|squash|pumpkin|eggplant|potato|tomato|carrot|radish|turnip|beet|onion|garlic|ginger|turmeric|leek|scallion|celery|asparagus|spinach|lettuce|kale|chard|sprout|okra|bean|pea|lentil|chickpea|soybean|tofu|tempeh|pizza|burrito|ice cream|chocolate|bread|pretzel|bagel|cheeseburger|hamburger|sandwich|pasta|carbonara|soup|salad|steak|chicken|pork|beef|fish|seafood|shrimp|crab|lobster|oyster|clam|mussel|egg|cheese|butter|yogurt|milk|cream|rice|noodle|grain|wheat|barley|oat|rye|millet|quinoa|seed|nut|peanut|almond|walnut|cashew|pistachio|hazelnut|chestnut|compost|peel|shell|bone|fat|oil|plant|flower|leaf|meat|hay|straw|potpie|trifle|grocery|bakery|confectionery|dough|guacamole|dog|cat|bird|animal|person|people|man|woman|face|boy|girl|tree|grass|wood|log|timber|lumber|branch|stick|root|bark|moss|lichen|fungus|mushroom|yeast|algae|kelp|seaweed|bamboo|reed|cane|palm|fern|shrub|bush|vine|ivy|herb|spice)\b/i;
  const hazardousRegex = /\b(battery|electronic|phone|computer|screen|monitor|lamp|bulb|switch|power|cellular|notebook|printer|mouse pad|modem|hard disc|ipod|remote control|joystick|cassette|cd|radio|television|crt|oscilloscope|vacuum|iron|fan|heater|microwave|toaster|waffle|refrigerator|washer|dryer|dishwasher|keyboard|mouse|laptop|speaker|camera|lens|charger|adapter|cable|wire|plug|socket|board|chip|sensor|diode|transistor|capacitor|resistor|inductor|transformer|relay|fuse|breaker|pill|medicine|syringe|stethoscope|chemical|toxic|acid|solvent|poison|toxin|drug|vaccine|serum|swab|bandage|gauze|scalpel|blade|catheter|tube|vial|ampoule|xray|ultrasound|mri|ct|microscope|thermometer|meter|gauge|engine|motor|generator|turbine|boiler|pump|compressor|valve)\b/i;
  const inorganicRegex = /\b(clothing|textile|shirt|pants|sock|shoe|hat|bag|backpack|wallet|purse|jacket|coat|suit|dress|skirt|scarf|tie|glove|boot|sandal|slipper|tshirt|sweater|pullover|cardigan|vest|underwear|swimwear|towel|blanket|sheet|pillow|cushion|curtain|carpet|rug|mat|cloth|fabric|yarn|thread|needle|scissors|bed|couch|chair|desk|table|furniture|cabinet|wardrobe|dresser|bookcase|shelf|bench|stool|sofa|loveseat|recliner|futon|mattress|frame|headboard|footboard|chest|trunk|credenza|buffet|sideboard|armoire|vanity|mirror|building|house|street|sky|mountain|clay|brick|stone|rock|concrete|cement|asphalt|plaster|gypsum|drywall|tile|shingle|siding|insulation|glass|window|door|frame|panel|board|beam|column|truss|joist|stud|rafter|sheathing|decking|flooring|ceiling|wall|roof|foundation|slab|footing|pier|pile|caisson|abutment|span|arch|deck|railing|barrier|fence|gate|retaining wall|gabion|riprap|gravel|sand|silt|soil|dirt|mud|peat|muck|loam|cobble|boulder|bedrock|ore|mineral|coal|coke|slag|ash|clinker|dust|powder|granule|pellet|flake|chip|shaving|sawdust|fiber|wool|hair|feather|down|leather|hide|skin|fur|silk|cotton|linen|jute|hemp|sisal|coir|ramie|manila|abaca|bamboo|rattan|wicker|balloon|sponge|ceramic|porcelain|terracotta|earthenware|stoneware|glassware|telescope|binoculars|prism|windshield|sunroof|headlight|taillight|indicator|dashboard|instrument|control|pedal|lever|knob|button|dial|display|microphone|headphone|earphone|headset|handset|telephone|intercom|transmitter|receiver|antenna|dish|satellite|radar|sonar|lidar|gps|navigation|compass|sextant|chronometer|clock|watch|timer|stopwatch|metronome|counter|scale|balance|barometer|manometer|hygrometer|anemometer|wind vane|rain gauge|seismograph|spectrograph|colorimeter|refractometer|polarimeter|interferometer|projector|copier|plotter|fax|telex|typewriter|calculator|hvac|duct|grille|register|diffuser|damper|silencer|attenuator|hood|canopy|exhaust|chimney|flue|stack|vent|gasket|seal|o-ring|bearing|gear|pulley|belt|chain|coupling|clutch|brake|shaft|axle|wheel|tire|track|screw|bolt|nut|warning|washer|rivet|key|cotter|retaining ring|snap ring|spring|damper|shock absorber|strut|suspension|steering|linkage|joint|knuckle|spindle|hub|rim|spoke|harness|block|strip|contactor|solenoid|solenoid valve|actuator|piston|ram|jack|press|hoist|winch|crane|derrick|gantry|boom|jib|hook|tackle|sheave|rope|wire rope|strap|shackle|swivel|turnbuckle|eyebolt|ring|clamp|grip|spelter|sleeve|thimble|clip|plastic bag|nylon|rubber|tire|wheel|pipe|tube|wire|cable)\b/i;

  const topResult = predictions[0];
  const detectedName = topResult.className.split(',')[0].toUpperCase();
  const confidence = (topResult.probability * 100).toFixed(1);

  // Evaluate top 3 predictions
  predictions.slice(0, 3).forEach((p: any, index: number) => {
    const weight = rankWeights[index] || 0.3;
    const prob = p.probability;
    const name = p.className.toLowerCase();

    // Check explicit override first
    const explicitCat = getExplicitCategory(name);
    if (explicitCat) {
      scores[explicitCat] += prob * weight * 1.5; // Boost explicit overrides
      return;
    }

    // Check matches
    if (hazardousRegex.test(name)) {
      scores.hazardous += prob * weight;
    }
    if (recycleRegex.test(name)) {
      scores.recycle += prob * weight;
    }
    if (organicRegex.test(name)) {
      scores.organic += prob * weight;
    }
    if (inorganicRegex.test(name)) {
      scores.inorganic += prob * weight;
    }
  });

  // Determine winning category
  let winningCat: 'recycle' | 'organic' | 'hazardous' | 'inorganic' = 'inorganic';
  let highestScore = 0;

  (Object.keys(scores) as Array<keyof typeof scores>).forEach((cat) => {
    if (scores[cat] > highestScore) {
      highestScore = scores[cat];
      winningCat = cat;
    }
  });

  // If no category had a positive score, fallback to scanning the top result name without boundaries
  if (highestScore === 0) {
    const topName = topResult.className.toLowerCase();
    if (topName.match(/battery|phone|computer|screen|monitor|electronic|bulb/i)) {
      winningCat = 'hazardous';
    } else if (topName.match(/bottle|plastic|cup|can|box|paper|carton/i)) {
      winningCat = 'recycle';
    } else if (topName.match(/apple|banana|orange|peel|leaf|wood|plant/i)) {
      winningCat = 'organic';
    } else {
      winningCat = 'inorganic';
    }
  }

  // Boost low confidence predictions with a minimum base confidence representation for display
  const finalConfidence = String(Math.min(99, Math.max(Number(confidence), 10)));

  // Return the mapped result
  if (winningCat === 'hazardous') {
    return {
      type: t('games.hazardous'),
      name: detectedName,
      confidence: finalConfidence,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      icon: '⚠️',
      description: language === 'en' 
        ? `Detected: "${topResult.className}". Contains electronic parts, chemicals, or hazardous materials.` 
        : `Nhận diện: "${topResult.className}". Thuộc nhóm rác thải điện tử, thiết bị, hoặc rác nguy hại.`,
      action: language === 'en' 
        ? '⚠️ Never throw with regular trash. Bring to a specialized e-waste or hazardous waste collection point.' 
        : '⚠️ Không vứt chung rác sinh hoạt. Đem đến điểm thu gom rác điện tử / nguy hại chuyên dụng.',
    };
  } else if (winningCat === 'recycle') {
    return {
      type: t('games.recycle'),
      name: detectedName,
      confidence: finalConfidence,
      color: 'text-brand-blue',
      bgColor: 'bg-brand-blue/10',
      borderColor: 'border-brand-blue/30',
      icon: '♻️',
      description: language === 'en' 
        ? `Detected: "${topResult.className}". High recyclability material (plastic, paper, glass, metal).` 
        : `Nhận diện: "${topResult.className}". Vật liệu có khả năng tái chế cao (nhựa, giấy, thủy tinh, kim loại).`,
      action: language === 'en' 
        ? '♻️ Clean, dry, and crush to save space, then put in the Recycle bin.' 
        : '♻️ Súc rửa sạch, để khô, làm bẹp để tiết kiệm diện tích và cho vào thùng Tái Chế.',
    };
  } else if (winningCat === 'organic') {
    return {
      type: t('games.organic'),
      name: detectedName,
      confidence: finalConfidence,
      color: 'text-brand-green',
      bgColor: 'bg-brand-green/10',
      borderColor: 'border-brand-green/30',
      icon: '🌿',
      description: language === 'en' 
        ? `Detected: "${topResult.className}". Biodegradable organic matter or natural material.` 
        : `Nhận diện: "${topResult.className}". Thuộc nhóm rác hữu cơ sinh học, thức ăn thừa hoặc vật chất tự nhiên.`,
      action: language === 'en' 
        ? '🌿 Compost for plants or put in the Organic waste bin.' 
        : '🌿 Sử dụng để ủ phân compost bón cây hoặc bỏ vào thùng Rác Hữu Cơ.',
    };
  } else {
    return {
      type: t('games.inorganic'),
      name: detectedName,
      confidence: finalConfidence,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      icon: '🗑️',
      description: language === 'en' 
        ? `Detected: "${topResult.className}". Inorganic waste, mixed material, textile, or bulky item.` 
        : `Nhận diện: "${topResult.className}". Rác Vô Cơ, vật liệu hỗn hợp, vải vóc hoặc rác cồng kềnh khó phân hủy.`,
      action: language === 'en' 
        ? '🗑️ Reduce usage if possible. Put in Inorganic bin or arrange for bulky waste pickup.' 
        : '🗑️ Bỏ vào thùng rác Vô Cơ để xử lý chôn lấp, hoặc liên hệ thu gom rác cồng kềnh nếu kích thước quá lớn.',
    };
  }
};
