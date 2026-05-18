const fs = require('fs');
const path = require('path');

const organicEmojis = {
  'chuối': '🍌', 'banana': '🍌',
  'táo': '🍎', 'apple': '🍎',
  'cam': '🍊', 'orange': '🍊',
  'xoài': '🥭', 'mango': '🥭',
  'dưa hấu': '🍉', 'watermelon': '🍉',
  'sầu riêng': '🟢', 'durian': '🟢',
  'đu đủ': '🍈', 'papaya': '🍈',
  'thanh long': '🥝', 'dragon fruit': '🥝',
  'nho': '🍇', 'grape': '🍇',
  'lê': '🍐', 'pear': '🍐',
  'rau cải': '🥬', 'cabbage': '🥬',
  'cà chua': '🍅', 'tomato': '🍅',
  'khoai tây': '🥔', 'potato': '🥔',
  'cà rốt': '🥕', 'carrot': '🥕',
  'súp lơ': '🥦', 'broccoli': '🥦',
  'rau muống': '🥗', 'water spinach': '🥗',
  'mồng tơi': '🌱', 'malabar spinach': '🌱',
  'bầu': '🫛', 'gourd': '🫛',
  'bí': '🎃', 'pumpkin': '🎃',
  'mướp': '🥒', 'luffa': '🥒',
  'hành tây': '🧅', 'onion': '🧅',
  'tỏi': '🧄', 'garlic': '🧄',
  'ớt': '🌶️', 'chili': '🌶️',
  'cà tím': '🍆', 'eggplant': '🍆',
  'nấm': '🍄', 'mushroom': '🍄',
  'ngô': '🌽', 'corn': '🌽',
  'dừa': '🥥', 'coconut': '🥥',
  'mít': '🍯', 'jackfruit': '🍯',
  'chôm chôm': '🍒', 'rambutan': '🍒',
  'vải': '🫐', 'lychee': '🫐',
};

const recycleEmojis = {
  'nhựa PET': '🫙', 'PET plastic': '🫙',
  'nhựa cứng': '🧴', 'hard plastic': '🧴',
  'thủy tinh': '🍶', 'glass': '🍶',
  'nhôm': '🥫', 'aluminum': '🥫',
  'sắt': '🔩', 'iron': '🔩',
  'giấy carton': '📦', 'carton': '📦',
  'giấy báo': '📰', 'newspaper': '📰',
  'giấy viết': '📄', 'writing paper': '📄',
  'đồng': '🪙', 'copper': '🪙',
  'kẽm': '⚙️', 'zinc': '⚙️',
  'bìa các-tông': '🗃️', 'cardboard': '🗃️',
  'nhựa PP': '🥤', 'PP plastic': '🥤',
  'nhựa HDPE': '🧃', 'HDPE plastic': '🧃',
  'kim loại tổng hợp': '🔧', 'mixed metal': '🔧',
  'giấy kraft': '🛍️', 'kraft paper': '🛍️',
};

const inorganicEmojis = {
  'nilon': '🛍️', 'nylon': '🛍️',
  'nhựa xốp': '📦', 'styrofoam': '📦',
  'cao su': '🔘', 'rubber': '🔘',
  'sứ vỡ': '🏺', 'broken porcelain': '🏺',
  'gốm vỡ': '🫖', 'broken ceramic': '🫖',
  'đất sét nung': '🧱', 'baked clay': '🧱',
  'gạch vỡ': '🪨', 'broken brick': '🪨',
  'kính cường lực vỡ': '🪟', 'broken tempered glass': '🪟',
  'vải vụn': '🧵', 'fabric scrap': '🧵',
  'da tổng hợp': '👜', 'synthetic leather': '👜',
  'vải dù': '☂️', 'parachute fabric': '☂️',
  'bọt biển': '🧽', 'sponge': '🧽',
  'mút xốp': '🫧', 'foam': '🫧',
  'vải simili': '🧥', 'simili fabric': '🧥',
  'nilon đen': '🗑️', 'black nylon': '🗑️',
};

const hazardousEmojis = {
  'AA': '🔋', 'AAA': '🪫',
  'lithium': '⚡', 'lead': '🏭',
  'chì': '🏭',
  'huỳnh quang': '💡', 'fluorescent': '💡',
  'LED vỡ': '🔌', 'broken LED': '🔌',
  'diệt côn trùng': '🪳', 'insecticide': '🪳',
  'tẩy rửa mạnh': '🧪', 'strong detergent': '🧪',
  'in': '🖨️', 'printer': '🖨️',
  'thủy ngân': '🌡️', 'mercury': '🌡️',
  'điện thoại cũ': '📱', 'old phone': '📱',
  'máy tính hỏng': '💻', 'broken computer': '💻',
  'hết hạn': '💊', 'expired': '💊',
  'chống gỉ': '🧯', 'anti-rust': '🧯',
  'nhuộm tóc': '💈', 'hair dye': '💈',
};

const organicBases = {
  vi: ["Vỏ", "Hạt", "Lõi", "Cuống", "Rễ", "Lá", "Cành", "Bã", "Vụn", "Thức ăn thừa của", "Mảnh", "Phần hỏng của"],
  en: ["Peel of", "Seed of", "Core of", "Stem of", "Root of", "Leaf of", "Branch of", "Residue of", "Crumb of", "Leftover of", "Piece of", "Rotten part of"]
};
const fruitsAndVeg = {
  vi: ["chuối", "táo", "cam", "xoài", "dưa hấu", "sầu riêng", "đu đủ", "thanh long", "nho", "lê", "rau cải", "cà chua", "khoai tây", "cà rốt", "súp lơ", "rau muống", "mồng tơi", "bầu", "bí", "mướp", "hành tây", "tỏi", "ớt", "cà tím", "nấm", "ngô", "dừa", "mít", "chôm chôm", "vải"],
  en: ["banana", "apple", "orange", "mango", "watermelon", "durian", "papaya", "dragon fruit", "grape", "pear", "cabbage", "tomato", "potato", "carrot", "broccoli", "water spinach", "malabar spinach", "gourd", "pumpkin", "luffa", "onion", "garlic", "chili", "eggplant", "mushroom", "corn", "coconut", "jackfruit", "rambutan", "lychee"]
};

const recycleBases = {
  vi: ["Chai", "Lọ", "Bình", "Vỏ hộp", "Lon", "Thùng", "Mảnh", "Nắp", "Cuộn", "Tấm"],
  en: ["Bottle of", "Jar of", "Jug of", "Box of", "Can of", "Container of", "Piece of", "Cap of", "Roll of", "Sheet of"]
};
const recycleMaterials = {
  vi: ["nhựa PET", "nhựa cứng", "thủy tinh", "nhôm", "sắt", "giấy carton", "giấy báo", "giấy viết", "đồng", "kẽm", "bìa các-tông", "nhựa PP", "nhựa HDPE", "kim loại tổng hợp", "giấy kraft"],
  en: ["PET plastic", "hard plastic", "glass", "aluminum", "iron", "carton", "newspaper", "writing paper", "copper", "zinc", "cardboard", "PP plastic", "HDPE plastic", "mixed metal", "kraft paper"]
};

const inorganicBases = {
  vi: ["Túi", "Bao bì", "Mảnh", "Miếng", "Sợi", "Cục", "Tấm", "Phế liệu", "Đồ hỏng bằng", "Mẩu"],
  en: ["Bag of", "Packaging of", "Piece of", "Slice of", "Fiber of", "Lump of", "Sheet of", "Scrap of", "Broken item of", "Scrap of"]
};
const inorganicMaterials = {
  vi: ["nilon", "nhựa xốp", "cao su", "sứ vỡ", "gốm vỡ", "đất sét nung", "gạch vỡ", "kính cường lực vỡ", "vải vụn", "da tổng hợp", "vải dù", "bọt biển", "mút xốp", "vải simili", "nilon đen"],
  en: ["nylon", "styrofoam", "rubber", "broken porcelain", "broken ceramic", "baked clay", "broken brick", "broken tempered glass", "fabric scrap", "synthetic leather", "parachute fabric", "sponge", "foam", "simili fabric", "black nylon"]
};

const hazardousBases = {
  vi: ["Pin", "Bình ắc quy", "Bóng đèn", "Lọ thuốc", "Chai hóa chất", "Mạch điện tử", "Linh kiện", "Hộp mực", "Nhiệt kế", "Pin sạc"],
  en: ["Battery", "Accumulator", "Light bulb", "Medicine bottle", "Chemical bottle", "Electronic circuit", "Component", "Ink cartridge", "Thermometer", "Rechargeable battery"]
};
const hazardousDetails = {
  vi: ["AA", "AAA", "lithium", "chì", "huỳnh quang", "LED vỡ", "diệt côn trùng", "tẩy rửa mạnh", "in", "thủy ngân", "điện thoại cũ", "máy tính hỏng", "hết hạn", "chống gỉ", "nhuộm tóc"],
  en: ["AA", "AAA", "lithium", "lead", "fluorescent", "broken LED", "insecticide", "strong detergent", "printer", "mercury", "old phone", "broken computer", "expired", "anti-rust", "hair dye"]
};

let items = [];
let currentId = 1;

// 150 Hữu cơ
for (let i = 0; i < 150; i++) {
  const baseVi = organicBases.vi[i % organicBases.vi.length];
  const itemVi = fruitsAndVeg.vi[i % fruitsAndVeg.vi.length];
  const nameVi = `${baseVi} ${itemVi}`;
  
  const baseEn = organicBases.en[i % organicBases.en.length];
  const itemEn = fruitsAndVeg.en[i % fruitsAndVeg.en.length];
  const nameEn = `${baseEn} ${itemEn}`;

  const emoji = organicEmojis[itemVi] || '🌿';

  items.push({
    id: currentId++,
    name: { vi: nameVi, en: nameEn },
    type: 'organic',
    icon: emoji,
    explanation: {
      vi: `${nameVi} là rác hữu cơ, có khả năng phân hủy sinh học tự nhiên. Rất tốt để ủ phân compost bón cho cây trồng.`,
      en: `${nameEn} is organic waste, naturally biodegradable. Great for composting to fertilize plants.`
    }
  });
}

// 150 Tái chế
for (let i = 0; i < 150; i++) {
  const baseVi = recycleBases.vi[i % recycleBases.vi.length];
  const matVi = recycleMaterials.vi[i % recycleMaterials.vi.length];
  const nameVi = `${baseVi} ${matVi}`;

  const baseEn = recycleBases.en[i % recycleBases.en.length];
  const matEn = recycleMaterials.en[i % recycleMaterials.en.length];
  const nameEn = `${baseEn} ${matEn}`;

  const emoji = recycleEmojis[matVi] || '♻️';

  items.push({
    id: currentId++,
    name: { vi: nameVi, en: nameEn },
    type: 'recycle',
    icon: emoji,
    explanation: {
      vi: `${nameVi} là vật liệu có thể tái chế. Cần làm sạch và phân loại riêng để tái sản xuất, giúp tiết kiệm tài nguyên thiên nhiên.`,
      en: `${nameEn} is a recyclable material. It should be cleaned and sorted separately for remanufacturing, helping to save natural resources.`
    }
  });
}

// 150 Vô cơ
for (let i = 0; i < 150; i++) {
  const baseVi = inorganicBases.vi[i % inorganicBases.vi.length];
  const matVi = inorganicMaterials.vi[i % inorganicMaterials.vi.length];
  const nameVi = `${baseVi} ${matVi}`;

  const baseEn = inorganicBases.en[i % inorganicBases.en.length];
  const matEn = inorganicMaterials.en[i % inorganicMaterials.en.length];
  const nameEn = `${baseEn} ${matEn}`;

  const emoji = inorganicEmojis[matVi] || '🗑️';

  items.push({
    id: currentId++,
    name: { vi: nameVi, en: nameEn },
    type: 'inorganic',
    icon: emoji,
    explanation: {
      vi: `${nameVi} thuộc loại rác vô cơ không thể tái chế, rất khó phân hủy. Cần được thu gom và xử lý tại bãi chôn lấp hoặc nhà máy điện rác.`,
      en: `${nameEn} belongs to non-recyclable inorganic waste, very hard to decompose. It needs to be collected and processed at landfills or waste-to-energy plants.`
    }
  });
}

// 150 Nguy hại
for (let i = 0; i < 150; i++) {
  const baseVi = hazardousBases.vi[i % hazardousBases.vi.length];
  const detVi = hazardousDetails.vi[i % hazardousDetails.vi.length];
  const nameVi = `${baseVi} ${detVi}`;

  const baseEn = hazardousBases.en[i % hazardousBases.en.length];
  const detEn = hazardousDetails.en[i % hazardousDetails.en.length];
  const nameEn = `${baseEn} ${detEn}`;

  const emoji = hazardousEmojis[detVi] || '⚠️';

  items.push({
    id: currentId++,
    name: { vi: nameVi, en: nameEn },
    type: 'hazardous',
    icon: emoji,
    explanation: {
      vi: `${nameVi} chứa hóa chất độc hại, kim loại nặng. Tuyệt đối không vứt bừa bãi, cần đưa đến điểm thu gom rác nguy hại để xử lý an toàn.`,
      en: `${nameEn} contains toxic chemicals or heavy metals. Absolutely do not throw away randomly, it must be taken to hazardous waste collection points for safe disposal.`
    }
  });
}

// Xáo trộn ngẫu nhiên mảng và gán lại ID
items.sort(() => Math.random() - 0.5);
items.forEach((item, index) => {
  item.id = index + 1;
});

const fileContent = `// Tệp dữ liệu tự động tạo 600 loại rác
export interface WasteItem {
  id: number;
  name: { vi: string, en: string };
  type: string;
  icon: string;
  explanation: { vi: string, en: string };
}

export const WASTE_ITEMS: WasteItem[] = ${JSON.stringify(items, null, 2)};
`;

const dir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'wasteData.ts'), fileContent, 'utf8');
console.log('Đã tạo thành công 600 loại rác định dạng bản địa hóa tại src/data/wasteData.ts');
