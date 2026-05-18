const fs = require('fs');
const path = require('path');

const organicBases = [
  "Vỏ", "Hạt", "Lõi", "Cuống", "Rễ", "Lá", "Cành", "Bã", "Vụn", "Thức ăn thừa của", "Mảnh", "Phần hỏng của"
];
const fruitsAndVeg = [
  "chuối", "táo", "cam", "xoài", "dưa hấu", "sầu riêng", "đu đủ", "thanh long", "nho", "lê",
  "rau cải", "cà chua", "khoai tây", "cà rốt", "súp lơ", "rau muống", "mồng tơi", "bầu", "bí", "mướp",
  "hành tây", "tỏi", "ớt", "cà tím", "nấm", "ngô", "dừa", "mít", "chôm chôm", "vải"
];

const recycleBases = [
  "Chai", "Lọ", "Bình", "Vỏ hộp", "Lon", "Thùng", "Mảnh", "Nắp", "Cuộn", "Tấm"
];
const recycleMaterials = [
  "nhựa PET", "nhựa cứng", "thủy tinh", "nhôm", "sắt", "giấy carton", "giấy báo", "giấy viết", "đồng", "kẽm",
  "bìa các-tông", "nhựa PP", "nhựa HDPE", "kim loại tổng hợp", "giấy kraft"
];

const inorganicBases = [
  "Túi", "Bao bì", "Mảnh", "Miếng", "Sợi", "Cục", "Tấm", "Phế liệu", "Đồ hỏng bằng", "Mẩu"
];
const inorganicMaterials = [
  "nilon", "nhựa xốp", "cao su", "sứ vỡ", "gốm vỡ", "đất sét nung", "gạch vỡ", "kính cường lực vỡ",
  "vải vụn", "da tổng hợp", "vải dù", "bọt biển", "mút xốp", "vải simili", "nilon đen"
];

const hazardousBases = [
  "Pin", "Bình ắc quy", "Bóng đèn", "Lọ thuốc", "Chai hóa chất", "Mạch điện tử", "Linh kiện", "Hộp mực", "Nhiệt kế", "Pin sạc"
];
const hazardousDetails = [
  "AA", "AAA", "lithium", "chì", "huỳnh quang", "LED vỡ", "diệt côn trùng", "tẩy rửa mạnh", "in", "thủy ngân",
  "điện thoại cũ", "máy tính hỏng", "hết hạn", "chống gỉ", "nhuộm tóc"
];

let items = [];
let currentId = 1;

// Sinh 150 Organic
for(let i=0; i<150; i++) {
  let base = organicBases[Math.floor(Math.random() * organicBases.length)];
  let item = fruitsAndVeg[Math.floor(Math.random() * fruitsAndVeg.length)];
  let name = `${base} ${item}`;
  items.push({
    id: currentId++,
    name: name,
    type: 'organic',
    icon: '🌿',
    explanation: `${name} là rác hữu cơ, có khả năng phân hủy sinh học trong tự nhiên. Rất tốt để dùng làm phân ủ (compost) bón cho cây trồng.`
  });
}

// Sinh 150 Recycle
for(let i=0; i<150; i++) {
  let base = recycleBases[Math.floor(Math.random() * recycleBases.length)];
  let mat = recycleMaterials[Math.floor(Math.random() * recycleMaterials.length)];
  let name = `${base} ${mat}`;
  items.push({
    id: currentId++,
    name: name,
    type: 'recycle',
    icon: '♻️',
    explanation: `${name} là vật liệu có thể tái chế. Cần làm sạch và phân loại riêng để đưa về nhà máy tái chế thành sản phẩm mới, giúp tiết kiệm tài nguyên.`
  });
}

// Sinh 150 Inorganic
for(let i=0; i<150; i++) {
  let base = inorganicBases[Math.floor(Math.random() * inorganicBases.length)];
  let mat = inorganicMaterials[Math.floor(Math.random() * inorganicMaterials.length)];
  let name = `${base} ${mat}`;
  items.push({
    id: currentId++,
    name: name,
    type: 'inorganic',
    icon: '🗑️',
    explanation: `${name} thuộc loại rác vô cơ không thể tái chế hoặc rất khó phân hủy. Cần được thu gom và xử lý tại bãi chôn lấp hoặc nhà máy điện rác.`
  });
}

// Sinh 150 Hazardous
for(let i=0; i<150; i++) {
  let base = hazardousBases[Math.floor(Math.random() * hazardousBases.length)];
  let det = hazardousDetails[Math.floor(Math.random() * hazardousDetails.length)];
  let name = `${base} ${det}`;
  items.push({
    id: currentId++,
    name: name,
    type: 'hazardous',
    icon: '⚠️',
    explanation: `${name} chứa hóa chất độc hại, kim loại nặng hoặc tác nhân gây nguy hiểm. Tuyệt đối không vứt bừa bãi, cần đưa đến điểm thu gom rác nguy hại chuyên biệt.`
  });
}

// Xáo trộn ngẫu nhiên mảng
items.sort(() => Math.random() - 0.5);

// Re-assign ID
items.forEach((item, index) => {
  item.id = index + 1;
});

const fileContent = `// Tệp dữ liệu tự động tạo 600 loại rác
export const WASTE_ITEMS = ${JSON.stringify(items, null, 2)};
`;

const dir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'wasteData.ts'), fileContent, 'utf8');
console.log('Đã tạo thành công 600 loại rác tại src/data/wasteData.ts');
