import sys, re
sys.stdout.reconfigure(encoding='utf-8')

# Read current file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# The section from line 50 to ~127 is broken. We need to replace it.
# Find the broken section and replace with correct structure

# Fix: Replace from '<div class="top-dashboard">' through the broken mobile-controls
# back to the correct structure

broken_start = content.find('<div class="top-dashboard">')
broken_end = content.find('<!-- Canvas Game')

if broken_start == -1 or broken_end == -1:
    print("Could not find markers!")
    sys.exit(1)

correct_section = '''<div class="top-dashboard">
            <div class="level-container">
                <div class="level-badge" id="levelBadge">1</div>
                <div class="xp-bar-container">
                    <div class="xp-bar" id="xpBar"></div>
                </div>
            </div>
            <div class="stat-box">⭐ Điểm: <span id="score">0</span></div>
            <div class="stat-box">🔥 Combo: <span id="streak">0</span></div>
        </div>
    </header>

    <!-- TRASHQUEST MINIGAME OVERLAY -->
    <div id="adventureContainer">
        <!-- Lớp hiển thị UI -->
        <div class="adventure-hud">
            <div class="hud-left">
                <button class="hud-btn" onclick="exitTrashQuest()">✕ Thoát</button>
                <div class="hp-bar-container">
                    <div class="hp-bar-fill" id="tqHealthBar"></div>
                    <div class="hp-text" id="tqHealthText">100 / 100 HP</div>
                </div>
            </div>
            <div class="hud-right">
                <div class="hud-coin">🟡 <span id="tqCoinCount">0</span></div>
                <button class="hud-btn" onclick="openShop()">🛒 Shop</button>
            </div>
        </div>

        <div class="obj-toast" id="tqObjective">Mục tiêu: Dọn sạch 8 rác trên bản đồ! (0/8)</div>

        <!-- Bàn Phím Ảo (Chỉ hiện Mobile) -->
        <div class="mobile-controls">
            <!-- Khu Joystick Trái -->
            <div class="joystick-zone" id="joystickZone">
                <div class="joystick-knob" id="joystickKnob"></div>
            </div>
            <!-- Khu Nút Hành Động Phải -->
            <div class="action-buttons">
                <div class="action-btn skill" id="btnSkill">
                    <span>⚡ (F)</span>
                    <div class="skill-cooldown" id="btnSkillCd"></div>
                </div>
                <div class="action-btn" id="btnInteract">💚 (I)</div>
                <div class="action-btn attack" id="btnAttack">⚔️ (J)</div>
            </div>
        </div>

        <!-- HỆ THỐNG TÚI PHÂN LOẠI RÁC -->
        <div id="bagInventory" style="
            position: absolute; bottom: 140px; left: 50%; transform: translateX(-50%);
            display: none; gap: 10px; z-index: 15; pointer-events: none;
            background: rgba(0,0,0,0.7); backdrop-filter: blur(10px);
            padding: 12px 18px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.15);
        ">
            <div class="sort-bag" id="bag-organic" style="text-align:center;">
                <div style="width:50px;height:55px;background:linear-gradient(180deg,#22c55e,#15803d);border-radius:8px 8px 12px 12px;display:flex;align-items:center;justify-content:center;font-size:24px;border:2px solid #4ade80;position:relative;box-shadow:0 4px 12px rgba(34,197,94,0.4);">
                    🌿
                    <span id="bagCount-organic" style="position:absolute;top:-8px;right:-8px;background:#ef4444;color:white;border-radius:50%;width:20px;height:20px;font-size:11px;font-weight:bold;display:flex;align-items:center;justify-content:center;">0</span>
                </div>
                <div style="font-size:8px;color:#4ade80;font-weight:bold;margin-top:4px;">HỮU CƠ</div>
            </div>
            <div class="sort-bag" id="bag-recycle" style="text-align:center;">
                <div style="width:50px;height:55px;background:linear-gradient(180deg,#3b82f6,#1d4ed8);border-radius:8px 8px 12px 12px;display:flex;align-items:center;justify-content:center;font-size:24px;border:2px solid #60a5fa;position:relative;box-shadow:0 4px 12px rgba(59,130,246,0.4);">
                    ♻️
                    <span id="bagCount-recycle" style="position:absolute;top:-8px;right:-8px;background:#ef4444;color:white;border-radius:50%;width:20px;height:20px;font-size:11px;font-weight:bold;display:flex;align-items:center;justify-content:center;">0</span>
                </div>
                <div style="font-size:8px;color:#60a5fa;font-weight:bold;margin-top:4px;">TÁI CHẾ</div>
            </div>
            <div class="sort-bag" id="bag-inorganic" style="text-align:center;">
                <div style="width:50px;height:55px;background:linear-gradient(180deg,#f59e0b,#b45309);border-radius:8px 8px 12px 12px;display:flex;align-items:center;justify-content:center;font-size:24px;border:2px solid #fbbf24;position:relative;box-shadow:0 4px 12px rgba(245,158,11,0.4);">
                    🗑️
                    <span id="bagCount-inorganic" style="position:absolute;top:-8px;right:-8px;background:#ef4444;color:white;border-radius:50%;width:20px;height:20px;font-size:11px;font-weight:bold;display:flex;align-items:center;justify-content:center;">0</span>
                </div>
                <div style="font-size:8px;color:#fbbf24;font-weight:bold;margin-top:4px;">VÔ CƠ</div>
            </div>
            <div class="sort-bag" id="bag-hazardous" style="text-align:center;">
                <div style="width:50px;height:55px;background:linear-gradient(180deg,#ef4444,#b91c1c);border-radius:8px 8px 12px 12px;display:flex;align-items:center;justify-content:center;font-size:24px;border:2px solid #f87171;position:relative;box-shadow:0 4px 12px rgba(239,68,68,0.4);">
                    ☢️
                    <span id="bagCount-hazardous" style="position:absolute;top:-8px;right:-8px;background:#ef4444;color:white;border-radius:50%;width:20px;height:20px;font-size:11px;font-weight:bold;display:flex;align-items:center;justify-content:center;">0</span>
                </div>
                <div style="font-size:8px;color:#f87171;font-weight:bold;margin-top:4px;">NGUY HẠI</div>
            </div>
        </div>
        <button id="btnToggleBag" onclick="toggleBagInventory()" style="
            position: absolute; bottom: 100px; left: 50%; transform: translateX(-50%);
            background: linear-gradient(135deg, rgba(16,185,129,0.9), rgba(5,150,105,0.9));
            border: 2px solid #34d399; color: white; padding: 8px 20px;
            border-radius: 25px; font-weight: bold; font-size: 0.9rem; z-index: 15;
            cursor: pointer; box-shadow: 0 4px 15px rgba(16,185,129,0.4);
            backdrop-filter: blur(5px); transition: all 0.2s;
        ">🎒 Túi Phân Loại</button>

        '''

content = content[:broken_start] + correct_section + content[broken_end:]

# Now fix all the encoding issues in the remaining content
fixes = {
    'TH"NG CHUẨN XÁC ốể': 'THÙNG CHUẨN XÁC để',
    'Khi ố"ng h! thống...': 'Khởi động hệ thống...',
    '"️': '♻️',
    'V CƠ': 'VÔ CƠ',
    'a️': '⚠️',
    'x0 than': 'xỉ than',
    'bóng ốèn': 'bóng đèn',
    'Đ"i ngũ v! sinh làm vi!c': 'Đội ngũ vệ sinh làm việc',
    'Tốc ố" gốc': 'Tốc độ gốc',
    'NHẬN THƯ~NG': 'NHẬN THƯỞNG',
    'S Nhi!m Vụ': '📋 Nhiệm Vụ',
    '} Vòng Quay': '🎰 Vòng Quay',
    'Mi lượt': 'Mỗi lượt',
    'CỬA HìNG': 'CỬA HÀNG',
    'DìI HƠN': 'DÀI HƠN',
    ': Trạm Tiết Ki!m': '🏪 Trạm Tiết Kiệm',
    'ĐANG\r\n                        D"NG': 'ĐANG DÙNG',
    'ĐANG\n                        D"NG': 'ĐANG DÙNG',
    'Viền ốỏ rực': 'Viền đỏ rực',
    'công ngh! ối!n tử Matrix Xanh ch:p nháy': 'công nghệ điện tử Matrix Xanh chớp nháy',
    'Hoàng Kim T"c': 'Hoàng Kim Tộc',
    'Mạ vàng 24k ốánh bóng lấp lánh khẳng ốịnh ố" giàu': 'Mạ vàng 24k đánh bóng lấp lánh khẳng định độ giàu',
    'ốang hút rác': 'đang hút rác',
    'bảo v! màu xanh': 'bảo vệ màu xanh',
    'a️ Cứu Môi': '⚔️ Cứu Môi',
    'Cung Tái Chế Cán G': 'Cung Tái Chế Cán Gỗ',
    'ốánh quái rác. (+50 Dmg T"ng)': 'đánh quái rác. (+50 Dmg Tổng)',
    'Xuyên thấu lốc xoáy rác': 'Xuyên thấu lốc xoáy rác',
    'Nư:c Bù Khoáng': 'Nước Bù Khoáng',
    'Hi 50 Máu lập tức trong lúc ốánh Boss Rác. (Tối ốa 5 bình)': 'Hồi 50 Máu lập tức trong lúc đánh Boss Rác. (Tối đa 5 bình)',
    '3 ITEM MaI': '3 ITEM MỚI',
    'vật li!u tái chế': 'vật liệu tái chế',
    'Lực hút ối!n từ tự ố"ng thu thập rác  cự ly gần': 'Lực hút điện từ tự động thu thập rác ở cự ly gần',
    ':️': '🛡️',
    'hi ốầy máu': 'hồi đầy máu',
    'PHỤ KI N': 'PHỤ KIỆN',
    'Phụ Ki!n Sưu Tầm': 'Phụ Kiện Sưu Tầm',
    'mác nilon m"t lần. Phụ ki!n thời trang bền b0': 'túi nilon một lần. Phụ kiện thời trang bền bỉ',
    'Bình Giữ Nhi!t': 'Bình Giữ Nhiệt',
    'Giữ ốá lạnh 24h, vỏ tre nứa tự nhiên. Nói không v:i ly nhựa': 'Giữ đá lạnh 24h, vỏ tre nứa tự nhiên. Nói không với ly nhựa',
    'B" 3 ống hút inox chống r0 + cọ rửa. Cứu h" rùa biển': 'Bộ 3 ống hút inox chống rỉ + cọ rửa. Cứu hộ rùa biển',
    'Mèo Máy Đng Hành': 'Mèo Máy Đồng Hành',
    'ối theo nhặt rác': 'đi theo nhặt rác',
    'SI`U TH` SINH THÁI': 'SIÊU THỊ SINH THÁI',
    ': Siêu Thị Sinh Thái': '🏪 Siêu Thị Sinh Thái',
    'Mua ốể nhận BUFF vĩnh vi&n': 'Mua để nhận BUFF vĩnh viễn',
    'S" Tay Mầm Xanh': 'Sổ Tay Mầm Xanh',
    'bảo v! rừng xanh': 'bảo vệ rừng xanh',
    'S Buff': '⭐ Buff',
    'tự ố"ng': 'tự động',
    'c"ng +5 Vàng mi 10': 'cộng +5 Vàng mỗi 10',
    'Túi Tote Sợi Canh': 'Túi Tote Sợi Gai',
    'bỏ ối': 'bỏ đi',
    'Đèn Lng Lõi Cu"n': 'Đèn Lồng Lõi Cuộn',
    'giấy v! sinh làm ố decor ngh! thuật': 'giấy vệ sinh làm đồ decor nghệ thuật',
    'Gấp ốôi (x2) Vàng rơi khi di!t': 'Gấp đôi (x2) Vàng rơi khi diệt',
    'ERROR POP-UP MODAL BÁO LI (MaI)': 'ERROR POP-UP MODAL BÁO LỖI',
    '>R<': '>❌<',
    'Bạn ốã xếp': 'Bạn đã xếp',
    'phải thu"c về': 'phải thuộc về',
    'ĐÒ GHI NHa': 'ĐÃ GHI NHỚ',
    'H SƠ THìNH TÍCH': 'HỒ SƠ THÀNH TÍCH',
    '  Kỷ Lục': '🏆 Kỷ Lục',
    '>⬍a<': '>👨‍🚀<',
    '! T"ng Điểm Rác': '⭐ Tổng Điểm Rác',
    ' Kỷ Lục Combo': '🔥 Kỷ Lục Combo',
    'a️ Ải Minigame': '⚔️ Ải Minigame',
    'Dữ li!u ốược Tự Đ"ng Lưu (Auto-Save) liên tục trên trình duy!t': 'Dữ liệu được Tự Động Lưu (Auto-Save) liên tục trên trình duyệt',
    '️ XA DỮ LI U & LìM LẠI': '🗑️ XÓA DỮ LIỆU & LÀM LẠI',
    ' Tài Khoản Offline': '👤 Tài Khoản Offline',
    'trình duy!t này': 'trình duyệt này',
    'LƯU T`N': 'LƯU TÊN',
    '  Bảng Xếp Hạng': '🏆 Bảng Xếp Hạng',
    'Trợ lý thông minh ốa năng': 'Trợ lý thông minh đa năng',
    'Cài ốặt API Key': 'Cài đặt API Key',
    'a"️': '⚙️',
    'Hỏi bất cứ ốiều gì': 'Hỏi bất cứ điều gì',
    '>~<': '>➤<',
}

for old, new in fixes.items():
    content = content.replace(old, new)

# Fix the bin icons in main game area  
content = content.replace('<span class="bin-icon">🧠</span>\n                <div class="bin-title">HỮU CƠ', '<span class="bin-icon">🌿</span>\n                <div class="bin-title">HỮU CƠ')
content = content.replace('<span class="bin-icon">🧠</span>\r\n                <div class="bin-title">HỮU CƠ', '<span class="bin-icon">🌿</span>\r\n                <div class="bin-title">HỮU CƠ')

# Write fixed file
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("HTML fixed successfully!")
print(f"File size: {len(content)} bytes")
