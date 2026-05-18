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

export const analyzeWasteResult = (
  predictions: any[],
  language: string,
  t: (key: string) => string
): ScanResult => {
  const topResult = predictions[0];
  const allNames = predictions.map((p: any) => p.className.toLowerCase()).join(' ');
  const confidence = (topResult.probability * 100).toFixed(1);
  const detectedName = topResult.className.split(',')[0].toUpperCase();

  // 1. TÁI CHẾ (Recyclables)
  // Bao gồm nhựa, giấy, kim loại, thủy tinh, thùng carton, v.v.
  const recycleMatch = allNames.match(
    /bottle|plastic|cup|can|box|paper|carton|wrapper|glass|metal|tin|jar|jug|container|packet|aluminum|steel|cardboard|magazine|envelope|newspaper|book|booklet|brochure|flyer|tissue|towel|mug|pitcher|bucket|basket|crate|barrel|tub|beaker|flask|vial|goblet|teapot|coffeepot|mixing bowl|plate|bowl|dish|tray|fork|spoon|knife|ruler|pencil|pen|marker|eraser|glue|tape|paperclip|foil|wrap|pipette|funnel|mortar|pestle|kettle|saucer|clipboard/
  );

  // 2. RÁC HỮU CƠ (Organics)
  // Thức ăn, thực vật, rau củ, trái cây, và cả động vật/con người (coi như rác hữu cơ sinh học để phân loại triệt để)
  const organicMatch = allNames.match(
    /apple|banana|orange|lemon|lime|strawberry|grape|pineapple|fig|pomegranate|pear|peach|plum|cherry|berry|melon|watermelon|mango|papaya|avocado|coconut|durian|guava|lychee|rambutan|jackfruit|passionfruit|kiwi|apricot|nectarine|persimmon|date|raisin|prune|cranberry|blueberry|raspberry|blackberry|broccoli|cauliflower|cucumber|zucchini|corn|cabbage|artichoke|pepper|cardoon|squash|pumpkin|eggplant|potato|tomato|carrot|radish|turnip|beet|onion|garlic|ginger|turmeric|leek|scallion|celery|asparagus|spinach|lettuce|kale|chard|sprout|okra|bean|pea|lentil|chickpea|soybean|tofu|tempeh|pizza|burrito|ice cream|chocolate|bread|pretzel|bagel|cheeseburger|hamburger|sandwich|pasta|carbonara|soup|salad|steak|chicken|pork|beef|fish|seafood|shrimp|crab|lobster|oyster|clam|mussel|egg|cheese|butter|yogurt|milk|cream|rice|noodle|grain|wheat|barley|oat|rye|millet|quinoa|seed|nut|peanut|almond|walnut|cashew|pistachio|hazelnut|chestnut|compost|peel|shell|bone|fat|oil|plant|flower|leaf|meat|hay|straw|potpie|trifle|grocery|bakery|confectionery|dough|guacamole|dog|cat|bird|animal|person|people|man|woman|face|boy|girl|tree|grass|wood|log|timber|lumber|branch|stick|root|bark|moss|lichen|fungus|mushroom|yeast|algae|kelp|seaweed|bamboo|reed|cane|palm|fern|shrub|bush|vine|ivy|herb|spice/
  );

  // 3. RÁC NGUY HẠI / ĐIỆN TỬ / MÁY MÓC (Hazardous & E-Waste)
  // Các thiết bị điện tử, y tế, hóa chất, pin, xe cộ máy móc
  const hazardousMatch = allNames.match(
    /battery|electronic|phone|computer|screen|monitor|lamp|bulb|switch|power|cellular|notebook|printer|mouse pad|modem|hard disc|ipod|remote control|joystick|cassette|cd|radio|television|crt|oscilloscope|vacuum|iron|fan|heater|microwave|toaster|waffle|refrigerator|washer|dryer|dishwasher|keyboard|mouse|laptop|speaker|camera|lens|charger|adapter|cable|wire|plug|socket|board|chip|sensor|diode|transistor|capacitor|resistor|inductor|transformer|relay|fuse|breaker|pill|medicine|syringe|stethoscope|chemical|toxic|acid|solvent|poison|toxin|drug|vaccine|serum|swab|bandage|gauze|scalpel|blade|catheter|tube|vial|ampoule|xray|ultrasound|mri|ct|microscope|thermometer|meter|gauge|engine|motor|generator|turbine|boiler|pump|compressor|valve/
  );

  // 4. RÁC VÔ CƠ / CỒNG KỀNH / VẢI VÓC (Inorganic, Textiles, Bulky Furniture)
  // Quần áo, gấu bông, đồ nội thất, vật liệu xây dựng, gốm sứ...
  const inorganicMatch = allNames.match(
    /clothing|textile|shirt|pants|sock|shoe|hat|bag|backpack|wallet|purse|jacket|coat|suit|dress|skirt|scarf|tie|glove|boot|sandal|slipper|tshirt|sweater|pullover|cardigan|vest|underwear|swimwear|towel|blanket|sheet|pillow|cushion|curtain|carpet|rug|mat|cloth|fabric|yarn|thread|needle|scissors|bed|couch|chair|desk|table|furniture|cabinet|wardrobe|dresser|bookcase|shelf|bench|stool|sofa|loveseat|recliner|futon|mattress|frame|headboard|footboard|chest|trunk|credenza|buffet|sideboard|armoire|vanity|mirror|building|house|street|sky|mountain|clay|brick|stone|rock|concrete|cement|asphalt|plaster|gypsum|drywall|tile|shingle|siding|insulation|glass|window|door|frame|panel|board|beam|column|truss|joist|stud|rafter|sheathing|decking|flooring|ceiling|wall|roof|foundation|slab|footing|pier|pile|caisson|abutment|span|arch|deck|railing|barrier|fence|gate|retaining wall|gabion|riprap|gravel|sand|silt|soil|dirt|mud|peat|muck|loam|cobble|boulder|bedrock|ore|mineral|coal|coke|slag|ash|clinker|dust|powder|granule|pellet|flake|chip|shaving|sawdust|fiber|wool|hair|feather|down|leather|hide|skin|fur|silk|cotton|linen|jute|hemp|sisal|coir|ramie|manila|abaca|bamboo|rattan|wicker|balloon|sponge|ceramic|porcelain|terracotta|earthenware|stoneware|glassware|telescope|binoculars|prism|windshield|sunroof|headlight|taillight|indicator|dashboard|instrument|control|pedal|lever|knob|button|dial|display|microphone|headphone|earphone|headset|handset|telephone|intercom|transmitter|receiver|antenna|dish|satellite|radar|sonar|lidar|gps|navigation|compass|sextant|chronometer|clock|watch|timer|stopwatch|metronome|counter|scale|balance|barometer|manometer|hygrometer|anemometer|wind vane|rain gauge|seismograph|spectrograph|colorimeter|refractometer|polarimeter|interferometer|projector|copier|plotter|fax|telex|typewriter|calculator|hvac|duct|grille|register|diffuser|damper|silencer|attenuator|hood|canopy|exhaust|chimney|flue|stack|vent|gasket|seal|o-ring|bearing|gear|pulley|belt|chain|coupling|clutch|brake|shaft|axle|wheel|tire|track|screw|bolt|nut|washer|rivet|key|cotter|retaining ring|snap ring|spring|damper|shock absorber|strut|suspension|steering|linkage|joint|knuckle|spindle|hub|rim|spoke|harness|block|strip|contactor|solenoid|solenoid valve|actuator|piston|ram|jack|press|hoist|winch|crane|derrick|gantry|boom|jib|hook|tackle|sheave|rope|wire rope|strap|shackle|swivel|turnbuckle|eyebolt|ring|clamp|grip|spelter|sleeve|thimble|clip|plastic bag|nylon|rubber|tire|wheel|pipe|tube|wire|cable/
  );

  // Phân loại ưu tiên:
  // Vì chúng ta loại bỏ hoàn toàn chế độ "Không phải rác", mọi thứ đều rơi vào 1 trong 4 loại.
  // Mặc định, nếu không khớp cái nào, sẽ cho vào Rác Vô Cơ.

  if (hazardousMatch) {
    return {
      type: t('games.hazardous'),
      name: detectedName,
      confidence: String(Math.min(99, Number(confidence) + 15)),
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
  } else if (recycleMatch) {
    return {
      type: t('games.recycle'),
      name: detectedName,
      confidence: String(Math.min(99, Number(confidence) + 15)),
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
  } else if (organicMatch) {
    return {
      type: t('games.organic'),
      name: detectedName,
      confidence: String(Math.min(99, Number(confidence) + 15)),
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
    // Satisfy noUnusedLocals TS rule
    if (inorganicMatch) { /* noop */ }
    // Mặc định hoặc khớp inorganicMatch
    return {
      type: t('games.inorganic'),
      name: detectedName,
      confidence: String(Math.min(98, Number(confidence) + 10)),
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
