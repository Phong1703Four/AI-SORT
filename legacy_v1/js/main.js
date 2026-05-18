
        // --- ÂM THANH (SFX) ---
        const sfx = (function () {
            let ctx = null;
            const g = () => { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); return ctx; };
            const t = (f, d, tp, v, dl) => { try { const c = g(), o = c.createOscillator(), gn = c.createGain(); o.connect(gn); gn.connect(c.destination); o.type = tp; o.frequency.setValueAtTime(f, c.currentTime + dl); gn.gain.setValueAtTime(v, c.currentTime + dl); gn.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dl + d); o.start(c.currentTime + dl); o.stop(c.currentTime + dl + d); } catch (e) { } };
            return {
                collect: () => { t(523, .15, "sine", .25, 0); t(659, .15, "sine", .25, .08); t(784, .2, "sine", .25, .16); },
                wrong: () => t(150, .4, "sawtooth", .3, 0),
                quizOk: () => { t(600, .15, "triangle", .2, 0); t(800, .25, "triangle", .2, .1); },
                pickup: () => { t(880, .08, "sine", .3, 0); t(1100, .1, "sine", .25, .06); t(1320, .12, "sine", .2, .12); t(1760, .15, "sine", .15, .18); },
                pickupOrganic: () => { t(440, .1, "sine", .2, 0); t(660, .12, "sine", .22, .07); t(880, .15, "sine", .18, .14); },
                pickupRecycle: () => { t(800, .08, "triangle", .25, 0); t(1000, .1, "triangle", .2, .05); t(1200, .12, "triangle", .15, .1); },
                pickupInorganic: () => { t(300, .1, "square", .15, 0); t(400, .12, "square", .12, .06); },
                pickupHazard: () => { t(200, .08, "sawtooth", .2, 0); t(250, .1, "sawtooth", .18, .05); t(500, .15, "sine", .15, .1); }
            };
        })();

        // --- 1. GAME DATA ---
        const trashData = [
    {
        "name": "Nguy hiểm điện thoại",
        "emoji": "📱",
        "type": "hazardous",
        "desc": "Rác thải điện tử (e-waste) chứa chì và thủy ngân."
    },
    {
        "name": "Bẩn đồ chơi nhựa",
        "emoji": "🧸",
        "type": "inorganic",
        "desc": "Đồ chơi vỡ trộn lẫn nhiều loại nhựa khó tái chế."
    },
    {
        "name": "Mút xốp bọc nilon",
        "emoji": "🥡",
        "type": "inorganic",
        "desc": "Xốp EPS gần như không thể tự phân hủy."
    },
    {
        "name": "Gói snack bám bẩn",
        "emoji": "🍟",
        "type": "inorganic",
        "desc": "Vỏ snack tráng màng nhôm/nhựa không thể tách rời để tái chế."
    },
    {
        "name": "Vỏ tã lót",
        "emoji": "👶",
        "type": "inorganic",
        "desc": "Tã lót chứa nhiều gel thấm hút vô cơ."
    },
    {
        "name": "Vỏ găng tay cao su",
        "emoji": "🧤",
        "type": "inorganic",
        "desc": "Cao su tổng hợp rất khó tiêu hủy."
    },
    {
        "name": "Vỏ lon bia",
        "emoji": "🍺",
        "type": "recycle",
        "desc": "Lon nhôm có thể đúc lại vô hạn lần."
    },
    {
        "name": "Cũ lon bia",
        "emoji": "🍺",
        "type": "recycle",
        "desc": "Lon nhôm có thể đúc lại vô hạn lần."
    },
    {
        "name": "Rau lên men",
        "emoji": "🥬",
        "type": "organic",
        "desc": "Cọng rau thừa rất dễ phân hủy."
    },
    {
        "name": "Thuốc hỏng",
        "emoji": "💊",
        "type": "hazardous",
        "desc": "Thuốc quá hạn làm ô nhiễm nguồn nước ngầm."
    },
    {
        "name": "Cà phê bị dập",
        "emoji": "☕",
        "type": "organic",
        "desc": "Bã cà phê giúp xua đuổi sâu bọ cho cây."
    },
    {
        "name": "Vỏ thịt",
        "emoji": "🥩",
        "type": "organic",
        "desc": "Thịt hỏng cần ủ kỹ để tránh mùi hôi."
    },
    {
        "name": "Vỏ gói snack",
        "emoji": "🍟",
        "type": "inorganic",
        "desc": "Vỏ snack tráng màng nhôm/nhựa không thể tách rời để tái chế."
    },
    {
        "name": "Vỏ bút bi",
        "emoji": "🖊️",
        "type": "inorganic",
        "desc": "Vỏ bút nhựa nhỏ vụn làm ô nhiễm vi nhựa."
    },
    {
        "name": "Vỏ lon bò húc rỗng",
        "emoji": "🥫",
        "type": "recycle",
        "desc": "Lon kim loại dễ dàng thu gom tái chế."
    },
    {
        "name": "Chết bình xịt côn trùng",
        "emoji": "🪰",
        "type": "hazardous",
        "desc": "Vỏ bình xịt áp suất cao dễ gây nổ và độc."
    },
    {
        "name": "Ống nước PVC rỗng",
        "emoji": "🚰",
        "type": "recycle",
        "desc": "Nhựa PVC tái chế dùng trong công nghiệp."
    },
    {
        "name": "Vỏ thuốc",
        "emoji": "💊",
        "type": "hazardous",
        "desc": "Thuốc quá hạn làm ô nhiễm nguồn nước ngầm."
    },
    {
        "name": "Đã xài ống nước pvc",
        "emoji": "🚰",
        "type": "recycle",
        "desc": "Nhựa PVC tái chế dùng trong công nghiệp."
    },
    {
        "name": "Vỏ laptop",
        "emoji": "💻",
        "type": "hazardous",
        "desc": "Bo mạch chứa nhiều kim loại nặng."
    },
    {
        "name": "Mút xốp xốp",
        "emoji": "🥡",
        "type": "inorganic",
        "desc": "Xốp EPS gần như không thể tự phân hủy."
    },
    {
        "name": "Vỏ báo",
        "emoji": "📰",
        "type": "recycle",
        "desc": "Giấy báo là nguồn giấy tái chế dồi dào."
    },
    {
        "name": "Rách nát bút bi",
        "emoji": "🖊️",
        "type": "inorganic",
        "desc": "Vỏ bút nhựa nhỏ vụn làm ô nhiễm vi nhựa."
    },
    {
        "name": "Bọc nilon mút xốp",
        "emoji": "🥡",
        "type": "inorganic",
        "desc": "Xốp EPS gần như không thể tự phân hủy."
    },
    {
        "name": "Vỏ băng dính",
        "emoji": "🩹",
        "type": "inorganic",
        "desc": "Keo nhựa dán không thể phân hủy sinh học."
    },
    {
        "name": "Bình xịt côn trùng đã qua sử dụng",
        "emoji": "🪰",
        "type": "hazardous",
        "desc": "Vỏ bình xịt áp suất cao dễ gây nổ và độc."
    },
    {
        "name": "Ống hút nhựa đã dính dầu",
        "emoji": "🥤",
        "type": "inorganic",
        "desc": "Ống hút nhựa sử dụng 1 lần gây hại cho sinh vật biển."
    },
    {
        "name": "Sơn hỏng",
        "emoji": "🎨",
        "type": "hazardous",
        "desc": "Hộp sơn cũ chứa dung môi bay hơi độc hại."
    },
    {
        "name": "Vỏ cà phê",
        "emoji": "☕",
        "type": "organic",
        "desc": "Bã cà phê giúp xua đuổi sâu bọ cho cây."
    },
    {
        "name": "Bóng đèn rỉ sét",
        "emoji": "💡",
        "type": "hazardous",
        "desc": "Bóng đèn huỳnh quang chứa hơi thủy ngân nguy hiểm."
    },
    {
        "name": "Bao bì báo",
        "emoji": "📰",
        "type": "recycle",
        "desc": "Giấy báo là nguồn giấy tái chế dồi dào."
    },
    {
        "name": "Chết pin tiểu aa",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Pin rò rỉ hóa chất và kim loại nặng cực độc."
    },
    {
        "name": "Rách vỏ lon bò húc",
        "emoji": "🥫",
        "type": "recycle",
        "desc": "Lon kim loại dễ dàng thu gom tái chế."
    },
    {
        "name": "Bình ắc quy hết hạn",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Ắc quy chì-axit rất nguy hại nếu rò rỉ."
    },
    {
        "name": "Nguy hiểm hóa chất",
        "emoji": "🧪",
        "type": "hazardous",
        "desc": "Hóa chất nông nghiệp hoặc tẩy rửa rất độc hại."
    },
    {
        "name": "Vàng hoa",
        "emoji": "🌺",
        "type": "organic",
        "desc": "Hoa héo rụng phân hủy tự nhiên."
    },
    {
        "name": "Cà phê xanh",
        "emoji": "☕",
        "type": "organic",
        "desc": "Bã cà phê giúp xua đuổi sâu bọ cho cây."
    },
    {
        "name": "Bẩn gói snack",
        "emoji": "🍟",
        "type": "inorganic",
        "desc": "Vỏ snack tráng màng nhôm/nhựa không thể tách rời để tái chế."
    },
    {
        "name": "Thịt héo",
        "emoji": "🥩",
        "type": "organic",
        "desc": "Thịt hỏng cần ủ kỹ để tránh mùi hôi."
    },
    {
        "name": "Nguy hiểm laptop",
        "emoji": "💻",
        "type": "hazardous",
        "desc": "Bo mạch chứa nhiều kim loại nặng."
    },
    {
        "name": "Vỏ bánh mì",
        "emoji": "🍞",
        "type": "organic",
        "desc": "Bánh mì mốc phân hủy rất nhanh."
    },
    {
        "name": "Vỏ vỏ trứng",
        "emoji": "🥚",
        "type": "organic",
        "desc": "Vỏ trứng cung cấp canxi cho đất."
    },
    {
        "name": "Báo rách",
        "emoji": "📰",
        "type": "recycle",
        "desc": "Giấy báo là nguồn giấy tái chế dồi dào."
    },
    {
        "name": "Vỏ cơm",
        "emoji": "🍚",
        "type": "organic",
        "desc": "Cơm thừa có thể cho gia súc ăn hoặc làm phân xanh."
    },
    {
        "name": "Rau còn thừa",
        "emoji": "🥬",
        "type": "organic",
        "desc": "Cọng rau thừa rất dễ phân hủy."
    },
    {
        "name": "Rách nát bàn chải",
        "emoji": "🪥",
        "type": "inorganic",
        "desc": "Sợi cước ni-lông không phân hủy."
    },
    {
        "name": "Mới gỡ ly thủy tinh",
        "emoji": "🍸",
        "type": "recycle",
        "desc": "Ly vỡ vẫn là nguồn thủy tinh tái sinh."
    },
    {
        "name": "Vàng táo",
        "emoji": "🍎",
        "type": "organic",
        "desc": "Lõi táo là rác hữu cơ tuyệt vời."
    },
    {
        "name": "Hoa thừa",
        "emoji": "🌺",
        "type": "organic",
        "desc": "Hoa héo rụng phân hủy tự nhiên."
    },
    {
        "name": "Cơm thối",
        "emoji": "🍚",
        "type": "organic",
        "desc": "Cơm thừa có thể cho gia súc ăn hoặc làm phân xanh."
    },
    {
        "name": "Còn thừa lá cây",
        "emoji": "🍂",
        "type": "organic",
        "desc": "Lá cây rụng tạo mùn cho đất."
    },
    {
        "name": "Tái chế được vỏ lon bò húc",
        "emoji": "🥫",
        "type": "recycle",
        "desc": "Lon kim loại dễ dàng thu gom tái chế."
    },
    {
        "name": "Vỏ sách",
        "emoji": "📖",
        "type": "recycle",
        "desc": "Sách cũ có thể tái chế thành giấy nháp."
    },
    {
        "name": "Rách nát tã lót",
        "emoji": "👶",
        "type": "inorganic",
        "desc": "Tã lót chứa nhiều gel thấm hút vô cơ."
    },
    {
        "name": "Cũ ly thủy tinh",
        "emoji": "🍸",
        "type": "recycle",
        "desc": "Ly vỡ vẫn là nguồn thủy tinh tái sinh."
    },
    {
        "name": "Héo lá cây",
        "emoji": "🍂",
        "type": "organic",
        "desc": "Lá cây rụng tạo mùn cho đất."
    },
    {
        "name": "Vỏ chuối",
        "emoji": "🍌",
        "type": "organic",
        "desc": "Vỏ chuối phân hủy nhanh, làm phân bón tốt."
    },
    {
        "name": "Băng dính tạp chất",
        "emoji": "🩹",
        "type": "inorganic",
        "desc": "Keo nhựa dán không thể phân hủy sinh học."
    },
    {
        "name": "Rau vàng",
        "emoji": "🥬",
        "type": "organic",
        "desc": "Cọng rau thừa rất dễ phân hủy."
    },
    {
        "name": "Bẩn bàn chải",
        "emoji": "🪥",
        "type": "inorganic",
        "desc": "Sợi cước ni-lông không phân hủy."
    },
    {
        "name": "Vàng lá cây",
        "emoji": "🍂",
        "type": "organic",
        "desc": "Lá cây rụng tạo mùn cho đất."
    },
    {
        "name": "Bình ắc quy vỡ vụn",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Ắc quy chì-axit rất nguy hại nếu rò rỉ."
    },
    {
        "name": "Cơm héo",
        "emoji": "🍚",
        "type": "organic",
        "desc": "Cơm thừa có thể cho gia súc ăn hoặc làm phân xanh."
    },
    {
        "name": "Xanh hoa",
        "emoji": "🌺",
        "type": "organic",
        "desc": "Hoa héo rụng phân hủy tự nhiên."
    },
    {
        "name": "Bao bì ly thủy tinh",
        "emoji": "🍸",
        "type": "recycle",
        "desc": "Ly vỡ vẫn là nguồn thủy tinh tái sinh."
    },
    {
        "name": "Bình xịt côn trùng chết",
        "emoji": "🪰",
        "type": "hazardous",
        "desc": "Vỏ bình xịt áp suất cao dễ gây nổ và độc."
    },
    {
        "name": "Vỏ nhiệt kế thủy ngân",
        "emoji": "🌡️",
        "type": "hazardous",
        "desc": "Thủy ngân là chất kịch độc đối với thần kinh."
    },
    {
        "name": "Rỉ sét nhiệt kế thủy ngân",
        "emoji": "🌡️",
        "type": "hazardous",
        "desc": "Thủy ngân là chất kịch độc đối với thần kinh."
    },
    {
        "name": "Vỏ ly thủy tinh",
        "emoji": "🍸",
        "type": "recycle",
        "desc": "Ly vỡ vẫn là nguồn thủy tinh tái sinh."
    },
    {
        "name": "Chết sơn",
        "emoji": "🎨",
        "type": "hazardous",
        "desc": "Hộp sơn cũ chứa dung môi bay hơi độc hại."
    },
    {
        "name": "Hộp giấy sạch",
        "emoji": "📦",
        "type": "recycle",
        "desc": "Giấy carton được nghiền ra làm giấy mới."
    },
    {
        "name": "Vỏ hóa chất",
        "emoji": "🧪",
        "type": "hazardous",
        "desc": "Hóa chất nông nghiệp hoặc tẩy rửa rất độc hại."
    },
    {
        "name": "Hết hạn thuốc",
        "emoji": "💊",
        "type": "hazardous",
        "desc": "Thuốc quá hạn làm ô nhiễm nguồn nước ngầm."
    },
    {
        "name": "Mút xốp rách nát",
        "emoji": "🥡",
        "type": "inorganic",
        "desc": "Xốp EPS gần như không thể tự phân hủy."
    },
    {
        "name": "Thịt thừa",
        "emoji": "🥩",
        "type": "organic",
        "desc": "Thịt hỏng cần ủ kỹ để tránh mùi hôi."
    },
    {
        "name": "Hỏng thuốc",
        "emoji": "💊",
        "type": "hazardous",
        "desc": "Thuốc quá hạn làm ô nhiễm nguồn nước ngầm."
    },
    {
        "name": "Pin tiểu AA rỉ sét",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Pin rò rỉ hóa chất và kim loại nặng cực độc."
    },
    {
        "name": "Hóa chất đã qua sử dụng",
        "emoji": "🧪",
        "type": "hazardous",
        "desc": "Hóa chất nông nghiệp hoặc tẩy rửa rất độc hại."
    },
    {
        "name": "Vỏ sơn",
        "emoji": "🎨",
        "type": "hazardous",
        "desc": "Hộp sơn cũ chứa dung môi bay hơi độc hại."
    },
    {
        "name": "Điện thoại rỉ sét",
        "emoji": "📱",
        "type": "hazardous",
        "desc": "Rác thải điện tử (e-waste) chứa chì và thủy ngân."
    },
    {
        "name": "Bám bẩn bút bi",
        "emoji": "🖊️",
        "type": "inorganic",
        "desc": "Vỏ bút nhựa nhỏ vụn làm ô nhiễm vi nhựa."
    },
    {
        "name": "Vỏ bình ắc quy",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Ắc quy chì-axit rất nguy hại nếu rò rỉ."
    },
    {
        "name": "Héo chuối",
        "emoji": "🍌",
        "type": "organic",
        "desc": "Vỏ chuối phân hủy nhanh, làm phân bón tốt."
    },
    {
        "name": "Điện thoại nguy hiểm",
        "emoji": "📱",
        "type": "hazardous",
        "desc": "Rác thải điện tử (e-waste) chứa chì và thủy ngân."
    },
    {
        "name": "Vỏ bóng đèn",
        "emoji": "💡",
        "type": "hazardous",
        "desc": "Bóng đèn huỳnh quang chứa hơi thủy ngân nguy hiểm."
    },
    {
        "name": "Vỏ hộp giấy",
        "emoji": "📦",
        "type": "recycle",
        "desc": "Giấy carton được nghiền ra làm giấy mới."
    },
    {
        "name": "Rách ống nước pvc",
        "emoji": "🚰",
        "type": "recycle",
        "desc": "Nhựa PVC tái chế dùng trong công nghiệp."
    },
    {
        "name": "Vỏ táo",
        "emoji": "🍎",
        "type": "organic",
        "desc": "Lõi táo là rác hữu cơ tuyệt vời."
    },
    {
        "name": "Vỏ hoa",
        "emoji": "🌺",
        "type": "organic",
        "desc": "Hoa héo rụng phân hủy tự nhiên."
    },
    {
        "name": "Cơm bị dập",
        "emoji": "🍚",
        "type": "organic",
        "desc": "Cơm thừa có thể cho gia súc ăn hoặc làm phân xanh."
    },
    {
        "name": "Cá vứt đi",
        "emoji": "🐟",
        "type": "organic",
        "desc": "Xương và thịt cá là nguồn phốt pho tốt."
    },
    {
        "name": "Sơn bị rò rỉ",
        "emoji": "🎨",
        "type": "hazardous",
        "desc": "Hộp sơn cũ chứa dung môi bay hơi độc hại."
    },
    {
        "name": "Bị rò rỉ laptop",
        "emoji": "💻",
        "type": "hazardous",
        "desc": "Bo mạch chứa nhiều kim loại nặng."
    },
    {
        "name": "Đồ chơi nhựa vỡ",
        "emoji": "🧸",
        "type": "inorganic",
        "desc": "Đồ chơi vỡ trộn lẫn nhiều loại nhựa khó tái chế."
    },
    {
        "name": "Nhiệt kế thủy ngân chết",
        "emoji": "🌡️",
        "type": "hazardous",
        "desc": "Thủy ngân là chất kịch độc đối với thần kinh."
    },
    {
        "name": "Pin tiểu AA hỏng",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Pin rò rỉ hóa chất và kim loại nặng cực độc."
    },
    {
        "name": "Cà phê còn thừa",
        "emoji": "☕",
        "type": "organic",
        "desc": "Bã cà phê giúp xua đuổi sâu bọ cho cây."
    },
    {
        "name": "Mốc rau",
        "emoji": "🥬",
        "type": "organic",
        "desc": "Cọng rau thừa rất dễ phân hủy."
    },
    {
        "name": "Vỏ điện thoại",
        "emoji": "📱",
        "type": "hazardous",
        "desc": "Rác thải điện tử (e-waste) chứa chì và thủy ngân."
    },
    {
        "name": "Chuối vàng",
        "emoji": "🍌",
        "type": "organic",
        "desc": "Vỏ chuối phân hủy nhanh, làm phân bón tốt."
    },
    {
        "name": "Cơm lên men",
        "emoji": "🍚",
        "type": "organic",
        "desc": "Cơm thừa có thể cho gia súc ăn hoặc làm phân xanh."
    },
    {
        "name": "Bút bi nhựa cứng",
        "emoji": "🖊️",
        "type": "inorganic",
        "desc": "Vỏ bút nhựa nhỏ vụn làm ô nhiễm vi nhựa."
    },
    {
        "name": "Bóp méo vỏ lon bò húc",
        "emoji": "🥫",
        "type": "recycle",
        "desc": "Lon kim loại dễ dàng thu gom tái chế."
    },
    {
        "name": "Túi nilon vỡ",
        "emoji": "🛍️",
        "type": "inorganic",
        "desc": "Túi nilon mất hàng trăm năm để phân hủy."
    },
    {
        "name": "Đã qua sử dụng bình ắc quy",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Ắc quy chì-axit rất nguy hại nếu rò rỉ."
    },
    {
        "name": "Thừa cá",
        "emoji": "🐟",
        "type": "organic",
        "desc": "Xương và thịt cá là nguồn phốt pho tốt."
    },
    {
        "name": "Cũ ống nước pvc",
        "emoji": "🚰",
        "type": "recycle",
        "desc": "Nhựa PVC tái chế dùng trong công nghiệp."
    },
    {
        "name": "Vỏ vỏ hộp sữa",
        "emoji": "🧃",
        "type": "recycle",
        "desc": "Vỏ hộp Tetra Pak có lớp giấy và nhôm tái chế được."
    },
    {
        "name": "Mốc cá",
        "emoji": "🐟",
        "type": "organic",
        "desc": "Xương và thịt cá là nguồn phốt pho tốt."
    },
    {
        "name": "Vỡ mút xốp",
        "emoji": "🥡",
        "type": "inorganic",
        "desc": "Xốp EPS gần như không thể tự phân hủy."
    },
    {
        "name": "Vỡ ống hút nhựa",
        "emoji": "🥤",
        "type": "inorganic",
        "desc": "Ống hút nhựa sử dụng 1 lần gây hại cho sinh vật biển."
    },
    {
        "name": "Vỏ rau",
        "emoji": "🥬",
        "type": "organic",
        "desc": "Cọng rau thừa rất dễ phân hủy."
    },
    {
        "name": "Điện thoại bị rò rỉ",
        "emoji": "📱",
        "type": "hazardous",
        "desc": "Rác thải điện tử (e-waste) chứa chì và thủy ngân."
    },
    {
        "name": "Rỉ sét thuốc",
        "emoji": "💊",
        "type": "hazardous",
        "desc": "Thuốc quá hạn làm ô nhiễm nguồn nước ngầm."
    },
    {
        "name": "Vỏ ống nước pvc",
        "emoji": "🚰",
        "type": "recycle",
        "desc": "Nhựa PVC tái chế dùng trong công nghiệp."
    },
    {
        "name": "Mút xốp nhựa cứng",
        "emoji": "🥡",
        "type": "inorganic",
        "desc": "Xốp EPS gần như không thể tự phân hủy."
    },
    {
        "name": "Tã lót xốp",
        "emoji": "👶",
        "type": "inorganic",
        "desc": "Tã lót chứa nhiều gel thấm hút vô cơ."
    },
    {
        "name": "Thối lá cây",
        "emoji": "🍂",
        "type": "organic",
        "desc": "Lá cây rụng tạo mùn cho đất."
    },
    {
        "name": "Vỏ chai nhựa",
        "emoji": "🧴",
        "type": "recycle",
        "desc": "Nhựa PET có thể tái chế thành sợi polyester."
    },
    {
        "name": "Bàn chải xốp",
        "emoji": "🪥",
        "type": "inorganic",
        "desc": "Sợi cước ni-lông không phân hủy."
    },
    {
        "name": "Mới gỡ hộp giấy",
        "emoji": "📦",
        "type": "recycle",
        "desc": "Giấy carton được nghiền ra làm giấy mới."
    },
    {
        "name": "Thừa chuối",
        "emoji": "🍌",
        "type": "organic",
        "desc": "Vỏ chuối phân hủy nhanh, làm phân bón tốt."
    },
    {
        "name": "Băng dính bẩn",
        "emoji": "🩹",
        "type": "inorganic",
        "desc": "Keo nhựa dán không thể phân hủy sinh học."
    },
    {
        "name": "Tã lót nhựa cứng",
        "emoji": "👶",
        "type": "inorganic",
        "desc": "Tã lót chứa nhiều gel thấm hút vô cơ."
    },
    {
        "name": "Cà phê vàng",
        "emoji": "☕",
        "type": "organic",
        "desc": "Bã cà phê giúp xua đuổi sâu bọ cho cây."
    },
    {
        "name": "Mảnh vụn bàn chải",
        "emoji": "🪥",
        "type": "inorganic",
        "desc": "Sợi cước ni-lông không phân hủy."
    },
    {
        "name": "Chai nhựa rỗng",
        "emoji": "🧴",
        "type": "recycle",
        "desc": "Nhựa PET có thể tái chế thành sợi polyester."
    },
    {
        "name": "Sơn hết hạn",
        "emoji": "🎨",
        "type": "hazardous",
        "desc": "Hộp sơn cũ chứa dung môi bay hơi độc hại."
    },
    {
        "name": "Đã dính dầu đồ chơi nhựa",
        "emoji": "🧸",
        "type": "inorganic",
        "desc": "Đồ chơi vỡ trộn lẫn nhiều loại nhựa khó tái chế."
    },
    {
        "name": "Vỏ ống hút nhựa",
        "emoji": "🥤",
        "type": "inorganic",
        "desc": "Ống hút nhựa sử dụng 1 lần gây hại cho sinh vật biển."
    },
    {
        "name": "Đã xài vỏ hộp sữa",
        "emoji": "🧃",
        "type": "recycle",
        "desc": "Vỏ hộp Tetra Pak có lớp giấy và nhôm tái chế được."
    },
    {
        "name": "Vỏ hộp sữa bóp méo",
        "emoji": "🧃",
        "type": "recycle",
        "desc": "Vỏ hộp Tetra Pak có lớp giấy và nhôm tái chế được."
    },
    {
        "name": "Chết laptop",
        "emoji": "💻",
        "type": "hazardous",
        "desc": "Bo mạch chứa nhiều kim loại nặng."
    },
    {
        "name": "Ống hút nhựa vỡ",
        "emoji": "🥤",
        "type": "inorganic",
        "desc": "Ống hút nhựa sử dụng 1 lần gây hại cho sinh vật biển."
    },
    {
        "name": "Táo thừa",
        "emoji": "🍎",
        "type": "organic",
        "desc": "Lõi táo là rác hữu cơ tuyệt vời."
    },
    {
        "name": "Bóp méo hộp giấy",
        "emoji": "📦",
        "type": "recycle",
        "desc": "Giấy carton được nghiền ra làm giấy mới."
    },
    {
        "name": "Cà phê vứt đi",
        "emoji": "☕",
        "type": "organic",
        "desc": "Bã cà phê giúp xua đuổi sâu bọ cho cây."
    },
    {
        "name": "Điện thoại nhiễm độc",
        "emoji": "📱",
        "type": "hazardous",
        "desc": "Rác thải điện tử (e-waste) chứa chì và thủy ngân."
    },
    {
        "name": "Nhựa cứng túi nilon",
        "emoji": "🛍️",
        "type": "inorganic",
        "desc": "Túi nilon mất hàng trăm năm để phân hủy."
    },
    {
        "name": "Vỏ lá cây",
        "emoji": "🍂",
        "type": "organic",
        "desc": "Lá cây rụng tạo mùn cho đất."
    },
    {
        "name": "Sơn vỡ vụn",
        "emoji": "🎨",
        "type": "hazardous",
        "desc": "Hộp sơn cũ chứa dung môi bay hơi độc hại."
    },
    {
        "name": "Bình xịt côn trùng bị rò rỉ",
        "emoji": "🪰",
        "type": "hazardous",
        "desc": "Vỏ bình xịt áp suất cao dễ gây nổ và độc."
    },
    {
        "name": "Tái chế được chai thủy tinh",
        "emoji": "🍾",
        "type": "recycle",
        "desc": "Thủy tinh nấu chảy để tạo hình dáng mới."
    },
    {
        "name": "Thuốc chết",
        "emoji": "💊",
        "type": "hazardous",
        "desc": "Thuốc quá hạn làm ô nhiễm nguồn nước ngầm."
    },
    {
        "name": "Tạp chất bút bi",
        "emoji": "🖊️",
        "type": "inorganic",
        "desc": "Vỏ bút nhựa nhỏ vụn làm ô nhiễm vi nhựa."
    },
    {
        "name": "Thuốc phế thải",
        "emoji": "💊",
        "type": "hazardous",
        "desc": "Thuốc quá hạn làm ô nhiễm nguồn nước ngầm."
    },
    {
        "name": "Vỏ lon bò húc rách",
        "emoji": "🥫",
        "type": "recycle",
        "desc": "Lon kim loại dễ dàng thu gom tái chế."
    },
    {
        "name": "Héo cá",
        "emoji": "🐟",
        "type": "organic",
        "desc": "Xương và thịt cá là nguồn phốt pho tốt."
    },
    {
        "name": "Vỏ lon bò húc cũ",
        "emoji": "🥫",
        "type": "recycle",
        "desc": "Lon kim loại dễ dàng thu gom tái chế."
    },
    {
        "name": "Bị rò rỉ điện thoại",
        "emoji": "📱",
        "type": "hazardous",
        "desc": "Rác thải điện tử (e-waste) chứa chì và thủy ngân."
    },
    {
        "name": "Rách báo",
        "emoji": "📰",
        "type": "recycle",
        "desc": "Giấy báo là nguồn giấy tái chế dồi dào."
    },
    {
        "name": "Sách đã xài",
        "emoji": "📖",
        "type": "recycle",
        "desc": "Sách cũ có thể tái chế thành giấy nháp."
    },
    {
        "name": "Mốc cà chua",
        "emoji": "🍅",
        "type": "organic",
        "desc": "Cà chua dập làm phân bón cực tốt."
    },
    {
        "name": "Lon bia đã xài",
        "emoji": "🍺",
        "type": "recycle",
        "desc": "Lon nhôm có thể đúc lại vô hạn lần."
    },
    {
        "name": "Vỏ vỏ lon bò húc",
        "emoji": "🥫",
        "type": "recycle",
        "desc": "Lon kim loại dễ dàng thu gom tái chế."
    },
    {
        "name": "Tạp chất túi nilon",
        "emoji": "🛍️",
        "type": "inorganic",
        "desc": "Túi nilon mất hàng trăm năm để phân hủy."
    },
    {
        "name": "Tã lót bẩn",
        "emoji": "👶",
        "type": "inorganic",
        "desc": "Tã lót chứa nhiều gel thấm hút vô cơ."
    },
    {
        "name": "Mảnh vụn ống hút nhựa",
        "emoji": "🥤",
        "type": "inorganic",
        "desc": "Ống hút nhựa sử dụng 1 lần gây hại cho sinh vật biển."
    },
    {
        "name": "Đồ chơi nhựa bẩn",
        "emoji": "🧸",
        "type": "inorganic",
        "desc": "Đồ chơi vỡ trộn lẫn nhiều loại nhựa khó tái chế."
    },
    {
        "name": "Bám bẩn đồ chơi nhựa",
        "emoji": "🧸",
        "type": "inorganic",
        "desc": "Đồ chơi vỡ trộn lẫn nhiều loại nhựa khó tái chế."
    },
    {
        "name": "Hoa lên men",
        "emoji": "🌺",
        "type": "organic",
        "desc": "Hoa héo rụng phân hủy tự nhiên."
    },
    {
        "name": "Vỏ pin tiểu aa",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Pin rò rỉ hóa chất và kim loại nặng cực độc."
    },
    {
        "name": "Pin tiểu AA hết hạn",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Pin rò rỉ hóa chất và kim loại nặng cực độc."
    },
    {
        "name": "Vỏ hộp sữa rách",
        "emoji": "🧃",
        "type": "recycle",
        "desc": "Vỏ hộp Tetra Pak có lớp giấy và nhôm tái chế được."
    },
    {
        "name": "Phế thải bình ắc quy",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Ắc quy chì-axit rất nguy hại nếu rò rỉ."
    },
    {
        "name": "Vỏ túi nilon",
        "emoji": "🛍️",
        "type": "inorganic",
        "desc": "Túi nilon mất hàng trăm năm để phân hủy."
    },
    {
        "name": "Ly thủy tinh bóp méo",
        "emoji": "🍸",
        "type": "recycle",
        "desc": "Ly vỡ vẫn là nguồn thủy tinh tái sinh."
    },
    {
        "name": "Rách nát mút xốp",
        "emoji": "🥡",
        "type": "inorganic",
        "desc": "Xốp EPS gần như không thể tự phân hủy."
    },
    {
        "name": "Vỏ cá",
        "emoji": "🐟",
        "type": "organic",
        "desc": "Xương và thịt cá là nguồn phốt pho tốt."
    },
    {
        "name": "Bình xịt côn trùng nhiễm độc",
        "emoji": "🪰",
        "type": "hazardous",
        "desc": "Vỏ bình xịt áp suất cao dễ gây nổ và độc."
    },
    {
        "name": "Bị rò rỉ thuốc",
        "emoji": "💊",
        "type": "hazardous",
        "desc": "Thuốc quá hạn làm ô nhiễm nguồn nước ngầm."
    },
    {
        "name": "Đã dính dầu bàn chải",
        "emoji": "🪥",
        "type": "inorganic",
        "desc": "Sợi cước ni-lông không phân hủy."
    },
    {
        "name": "Hết hạn bóng đèn",
        "emoji": "💡",
        "type": "hazardous",
        "desc": "Bóng đèn huỳnh quang chứa hơi thủy ngân nguy hiểm."
    },
    {
        "name": "Nhựa cứng bàn chải",
        "emoji": "🪥",
        "type": "inorganic",
        "desc": "Sợi cước ni-lông không phân hủy."
    },
    {
        "name": "Nhiễm độc nhiệt kế thủy ngân",
        "emoji": "🌡️",
        "type": "hazardous",
        "desc": "Thủy ngân là chất kịch độc đối với thần kinh."
    },
    {
        "name": "Cá xanh",
        "emoji": "🐟",
        "type": "organic",
        "desc": "Xương và thịt cá là nguồn phốt pho tốt."
    },
    {
        "name": "Sách rách",
        "emoji": "📖",
        "type": "recycle",
        "desc": "Sách cũ có thể tái chế thành giấy nháp."
    },
    {
        "name": "Thịt xanh",
        "emoji": "🥩",
        "type": "organic",
        "desc": "Thịt hỏng cần ủ kỹ để tránh mùi hôi."
    },
    {
        "name": "Bóp méo báo",
        "emoji": "📰",
        "type": "recycle",
        "desc": "Giấy báo là nguồn giấy tái chế dồi dào."
    },
    {
        "name": "Vỏ đồ chơi nhựa",
        "emoji": "🧸",
        "type": "inorganic",
        "desc": "Đồ chơi vỡ trộn lẫn nhiều loại nhựa khó tái chế."
    },
    {
        "name": "Táo bị dập",
        "emoji": "🍎",
        "type": "organic",
        "desc": "Lõi táo là rác hữu cơ tuyệt vời."
    },
    {
        "name": "Đã dính dầu băng dính",
        "emoji": "🩹",
        "type": "inorganic",
        "desc": "Keo nhựa dán không thể phân hủy sinh học."
    },
    {
        "name": "Đồ chơi nhựa đã dính dầu",
        "emoji": "🧸",
        "type": "inorganic",
        "desc": "Đồ chơi vỡ trộn lẫn nhiều loại nhựa khó tái chế."
    },
    {
        "name": "Ly thủy tinh tái chế được",
        "emoji": "🍸",
        "type": "recycle",
        "desc": "Ly vỡ vẫn là nguồn thủy tinh tái sinh."
    },
    {
        "name": "Vứt đi táo",
        "emoji": "🍎",
        "type": "organic",
        "desc": "Lõi táo là rác hữu cơ tuyệt vời."
    },
    {
        "name": "Vỡ bàn chải",
        "emoji": "🪥",
        "type": "inorganic",
        "desc": "Sợi cước ni-lông không phân hủy."
    },
    {
        "name": "Bút bi mảnh vụn",
        "emoji": "🖊️",
        "type": "inorganic",
        "desc": "Vỏ bút nhựa nhỏ vụn làm ô nhiễm vi nhựa."
    },
    {
        "name": "Cà chua héo",
        "emoji": "🍅",
        "type": "organic",
        "desc": "Cà chua dập làm phân bón cực tốt."
    },
    {
        "name": "Bóng đèn hỏng",
        "emoji": "💡",
        "type": "hazardous",
        "desc": "Bóng đèn huỳnh quang chứa hơi thủy ngân nguy hiểm."
    },
    {
        "name": "Vỏ hộp sữa bao bì",
        "emoji": "🧃",
        "type": "recycle",
        "desc": "Vỏ hộp Tetra Pak có lớp giấy và nhôm tái chế được."
    },
    {
        "name": "Vỏ bình xịt côn trùng",
        "emoji": "🪰",
        "type": "hazardous",
        "desc": "Vỏ bình xịt áp suất cao dễ gây nổ và độc."
    },
    {
        "name": "Vỏ trứng thừa",
        "emoji": "🥚",
        "type": "organic",
        "desc": "Vỏ trứng cung cấp canxi cho đất."
    },
    {
        "name": "Báo bóp méo",
        "emoji": "📰",
        "type": "recycle",
        "desc": "Giấy báo là nguồn giấy tái chế dồi dào."
    },
    {
        "name": "Báo cũ",
        "emoji": "📰",
        "type": "recycle",
        "desc": "Giấy báo là nguồn giấy tái chế dồi dào."
    },
    {
        "name": "Rách lon bia",
        "emoji": "🍺",
        "type": "recycle",
        "desc": "Lon nhôm có thể đúc lại vô hạn lần."
    },
    {
        "name": "Bánh mì mốc",
        "emoji": "🍞",
        "type": "organic",
        "desc": "Bánh mì mốc phân hủy rất nhanh."
    },
    {
        "name": "Cũ chai nhựa",
        "emoji": "🧴",
        "type": "recycle",
        "desc": "Nhựa PET có thể tái chế thành sợi polyester."
    },
    {
        "name": "Vỏ mút xốp",
        "emoji": "🥡",
        "type": "inorganic",
        "desc": "Xốp EPS gần như không thể tự phân hủy."
    },
    {
        "name": "Vỡ vụn pin tiểu aa",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Pin rò rỉ hóa chất và kim loại nặng cực độc."
    },
    {
        "name": "Chuối lên men",
        "emoji": "🍌",
        "type": "organic",
        "desc": "Vỏ chuối phân hủy nhanh, làm phân bón tốt."
    },
    {
        "name": "Đã dính dầu túi nilon",
        "emoji": "🛍️",
        "type": "inorganic",
        "desc": "Túi nilon mất hàng trăm năm để phân hủy."
    },
    {
        "name": "Lon bia rỗng",
        "emoji": "🍺",
        "type": "recycle",
        "desc": "Lon nhôm có thể đúc lại vô hạn lần."
    },
    {
        "name": "Bóng đèn hết hạn",
        "emoji": "💡",
        "type": "hazardous",
        "desc": "Bóng đèn huỳnh quang chứa hơi thủy ngân nguy hiểm."
    },
    {
        "name": "Hộp giấy vỏ",
        "emoji": "📦",
        "type": "recycle",
        "desc": "Giấy carton được nghiền ra làm giấy mới."
    },
    {
        "name": "Rỗng lon bia",
        "emoji": "🍺",
        "type": "recycle",
        "desc": "Lon nhôm có thể đúc lại vô hạn lần."
    },
    {
        "name": "Vỏ cà chua",
        "emoji": "🍅",
        "type": "organic",
        "desc": "Cà chua dập làm phân bón cực tốt."
    },
    {
        "name": "Lon bia bóp méo",
        "emoji": "🍺",
        "type": "recycle",
        "desc": "Lon nhôm có thể đúc lại vô hạn lần."
    },
    {
        "name": "Xanh lá cây",
        "emoji": "🍂",
        "type": "organic",
        "desc": "Lá cây rụng tạo mùn cho đất."
    },
    {
        "name": "Nhiệt kế thủy ngân hết hạn",
        "emoji": "🌡️",
        "type": "hazardous",
        "desc": "Thủy ngân là chất kịch độc đối với thần kinh."
    },
    {
        "name": "Vứt đi thịt",
        "emoji": "🥩",
        "type": "organic",
        "desc": "Thịt hỏng cần ủ kỹ để tránh mùi hôi."
    },
    {
        "name": "Còn thừa vỏ trứng",
        "emoji": "🥚",
        "type": "organic",
        "desc": "Vỏ trứng cung cấp canxi cho đất."
    },
    {
        "name": "Băng dính đã dính dầu",
        "emoji": "🩹",
        "type": "inorganic",
        "desc": "Keo nhựa dán không thể phân hủy sinh học."
    },
    {
        "name": "Đã dính dầu bút bi",
        "emoji": "🖊️",
        "type": "inorganic",
        "desc": "Vỏ bút nhựa nhỏ vụn làm ô nhiễm vi nhựa."
    },
    {
        "name": "Bị rò rỉ pin tiểu aa",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Pin rò rỉ hóa chất và kim loại nặng cực độc."
    },
    {
        "name": "Hết hạn nhiệt kế thủy ngân",
        "emoji": "🌡️",
        "type": "hazardous",
        "desc": "Thủy ngân là chất kịch độc đối với thần kinh."
    },
    {
        "name": "Ly thủy tinh rỗng",
        "emoji": "🍸",
        "type": "recycle",
        "desc": "Ly vỡ vẫn là nguồn thủy tinh tái sinh."
    },
    {
        "name": "Rỉ sét sơn",
        "emoji": "🎨",
        "type": "hazardous",
        "desc": "Hộp sơn cũ chứa dung môi bay hơi độc hại."
    },
    {
        "name": "Chuối thối",
        "emoji": "🍌",
        "type": "organic",
        "desc": "Vỏ chuối phân hủy nhanh, làm phân bón tốt."
    },
    {
        "name": "Tạp chất bàn chải",
        "emoji": "🪥",
        "type": "inorganic",
        "desc": "Sợi cước ni-lông không phân hủy."
    },
    {
        "name": "Vỏ bàn chải",
        "emoji": "🪥",
        "type": "inorganic",
        "desc": "Sợi cước ni-lông không phân hủy."
    },
    {
        "name": "Chai thủy tinh vỏ",
        "emoji": "🍾",
        "type": "recycle",
        "desc": "Thủy tinh nấu chảy để tạo hình dáng mới."
    },
    {
        "name": "Vỏ trứng mốc",
        "emoji": "🥚",
        "type": "organic",
        "desc": "Vỏ trứng cung cấp canxi cho đất."
    },
    {
        "name": "Hoa vứt đi",
        "emoji": "🌺",
        "type": "organic",
        "desc": "Hoa héo rụng phân hủy tự nhiên."
    },
    {
        "name": "Găng tay cao su xốp",
        "emoji": "🧤",
        "type": "inorganic",
        "desc": "Cao su tổng hợp rất khó tiêu hủy."
    },
    {
        "name": "Ống hút nhựa bám bẩn",
        "emoji": "🥤",
        "type": "inorganic",
        "desc": "Ống hút nhựa sử dụng 1 lần gây hại cho sinh vật biển."
    },
    {
        "name": "Lá cây lên men",
        "emoji": "🍂",
        "type": "organic",
        "desc": "Lá cây rụng tạo mùn cho đất."
    },
    {
        "name": "Găng tay cao su nhựa cứng",
        "emoji": "🧤",
        "type": "inorganic",
        "desc": "Cao su tổng hợp rất khó tiêu hủy."
    },
    {
        "name": "Báo mới gỡ",
        "emoji": "📰",
        "type": "recycle",
        "desc": "Giấy báo là nguồn giấy tái chế dồi dào."
    },
    {
        "name": "Lá cây thối",
        "emoji": "🍂",
        "type": "organic",
        "desc": "Lá cây rụng tạo mùn cho đất."
    },
    {
        "name": "Xanh thịt",
        "emoji": "🥩",
        "type": "organic",
        "desc": "Thịt hỏng cần ủ kỹ để tránh mùi hôi."
    },
    {
        "name": "Lên men cơm",
        "emoji": "🍚",
        "type": "organic",
        "desc": "Cơm thừa có thể cho gia súc ăn hoặc làm phân xanh."
    },
    {
        "name": "Bình xịt côn trùng nguy hiểm",
        "emoji": "🪰",
        "type": "hazardous",
        "desc": "Vỏ bình xịt áp suất cao dễ gây nổ và độc."
    },
    {
        "name": "Nhựa cứng gói snack",
        "emoji": "🍟",
        "type": "inorganic",
        "desc": "Vỏ snack tráng màng nhôm/nhựa không thể tách rời để tái chế."
    },
    {
        "name": "Túi nilon đã dính dầu",
        "emoji": "🛍️",
        "type": "inorganic",
        "desc": "Túi nilon mất hàng trăm năm để phân hủy."
    },
    {
        "name": "Héo bánh mì",
        "emoji": "🍞",
        "type": "organic",
        "desc": "Bánh mì mốc phân hủy rất nhanh."
    },
    {
        "name": "Xốp đồ chơi nhựa",
        "emoji": "🧸",
        "type": "inorganic",
        "desc": "Đồ chơi vỡ trộn lẫn nhiều loại nhựa khó tái chế."
    },
    {
        "name": "Phế thải thuốc",
        "emoji": "💊",
        "type": "hazardous",
        "desc": "Thuốc quá hạn làm ô nhiễm nguồn nước ngầm."
    },
    {
        "name": "Vỏ lon bò húc tái chế được",
        "emoji": "🥫",
        "type": "recycle",
        "desc": "Lon kim loại dễ dàng thu gom tái chế."
    },
    {
        "name": "Vỡ gói snack",
        "emoji": "🍟",
        "type": "inorganic",
        "desc": "Vỏ snack tráng màng nhôm/nhựa không thể tách rời để tái chế."
    },
    {
        "name": "Găng tay cao su tạp chất",
        "emoji": "🧤",
        "type": "inorganic",
        "desc": "Cao su tổng hợp rất khó tiêu hủy."
    },
    {
        "name": "Hỏng sơn",
        "emoji": "🎨",
        "type": "hazardous",
        "desc": "Hộp sơn cũ chứa dung môi bay hơi độc hại."
    },
    {
        "name": "Phế thải sơn",
        "emoji": "🎨",
        "type": "hazardous",
        "desc": "Hộp sơn cũ chứa dung môi bay hơi độc hại."
    },
    {
        "name": "Găng tay cao su bám bẩn",
        "emoji": "🧤",
        "type": "inorganic",
        "desc": "Cao su tổng hợp rất khó tiêu hủy."
    },
    {
        "name": "Sạch chai nhựa",
        "emoji": "🧴",
        "type": "recycle",
        "desc": "Nhựa PET có thể tái chế thành sợi polyester."
    },
    {
        "name": "Đã xài ly thủy tinh",
        "emoji": "🍸",
        "type": "recycle",
        "desc": "Ly vỡ vẫn là nguồn thủy tinh tái sinh."
    },
    {
        "name": "Cơm vứt đi",
        "emoji": "🍚",
        "type": "organic",
        "desc": "Cơm thừa có thể cho gia súc ăn hoặc làm phân xanh."
    },
    {
        "name": "Đã qua sử dụng điện thoại",
        "emoji": "📱",
        "type": "hazardous",
        "desc": "Rác thải điện tử (e-waste) chứa chì và thủy ngân."
    },
    {
        "name": "Tạp chất băng dính",
        "emoji": "🩹",
        "type": "inorganic",
        "desc": "Keo nhựa dán không thể phân hủy sinh học."
    },
    {
        "name": "Sách tái chế được",
        "emoji": "📖",
        "type": "recycle",
        "desc": "Sách cũ có thể tái chế thành giấy nháp."
    },
    {
        "name": "Bao bì chai nhựa",
        "emoji": "🧴",
        "type": "recycle",
        "desc": "Nhựa PET có thể tái chế thành sợi polyester."
    },
    {
        "name": "Lon bia bao bì",
        "emoji": "🍺",
        "type": "recycle",
        "desc": "Lon nhôm có thể đúc lại vô hạn lần."
    },
    {
        "name": "Hóa chất chết",
        "emoji": "🧪",
        "type": "hazardous",
        "desc": "Hóa chất nông nghiệp hoặc tẩy rửa rất độc hại."
    },
    {
        "name": "Tạp chất ống hút nhựa",
        "emoji": "🥤",
        "type": "inorganic",
        "desc": "Ống hút nhựa sử dụng 1 lần gây hại cho sinh vật biển."
    },
    {
        "name": "Vàng bánh mì",
        "emoji": "🍞",
        "type": "organic",
        "desc": "Bánh mì mốc phân hủy rất nhanh."
    },
    {
        "name": "Vỏ trứng héo",
        "emoji": "🥚",
        "type": "organic",
        "desc": "Vỏ trứng cung cấp canxi cho đất."
    },
    {
        "name": "Bọc nilon đồ chơi nhựa",
        "emoji": "🧸",
        "type": "inorganic",
        "desc": "Đồ chơi vỡ trộn lẫn nhiều loại nhựa khó tái chế."
    },
    {
        "name": "Đã qua sử dụng bình xịt côn trùng",
        "emoji": "🪰",
        "type": "hazardous",
        "desc": "Vỏ bình xịt áp suất cao dễ gây nổ và độc."
    },
    {
        "name": "Ống nước PVC tái chế được",
        "emoji": "🚰",
        "type": "recycle",
        "desc": "Nhựa PVC tái chế dùng trong công nghiệp."
    },
    {
        "name": "Túi nilon bẩn",
        "emoji": "🛍️",
        "type": "inorganic",
        "desc": "Túi nilon mất hàng trăm năm để phân hủy."
    },
    {
        "name": "Nguy hiểm bình ắc quy",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Ắc quy chì-axit rất nguy hại nếu rò rỉ."
    },
    {
        "name": "Vỏ trứng lên men",
        "emoji": "🥚",
        "type": "organic",
        "desc": "Vỏ trứng cung cấp canxi cho đất."
    },
    {
        "name": "Vàng cà phê",
        "emoji": "☕",
        "type": "organic",
        "desc": "Bã cà phê giúp xua đuổi sâu bọ cho cây."
    },
    {
        "name": "Lá cây héo",
        "emoji": "🍂",
        "type": "organic",
        "desc": "Lá cây rụng tạo mùn cho đất."
    },
    {
        "name": "Bút bi bọc nilon",
        "emoji": "🖊️",
        "type": "inorganic",
        "desc": "Vỏ bút nhựa nhỏ vụn làm ô nhiễm vi nhựa."
    },
    {
        "name": "Lên men hoa",
        "emoji": "🌺",
        "type": "organic",
        "desc": "Hoa héo rụng phân hủy tự nhiên."
    },
    {
        "name": "Thừa lá cây",
        "emoji": "🍂",
        "type": "organic",
        "desc": "Lá cây rụng tạo mùn cho đất."
    },
    {
        "name": "Bình ắc quy bị rò rỉ",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Ắc quy chì-axit rất nguy hại nếu rò rỉ."
    },
    {
        "name": "Tạp chất đồ chơi nhựa",
        "emoji": "🧸",
        "type": "inorganic",
        "desc": "Đồ chơi vỡ trộn lẫn nhiều loại nhựa khó tái chế."
    },
    {
        "name": "Còn thừa táo",
        "emoji": "🍎",
        "type": "organic",
        "desc": "Lõi táo là rác hữu cơ tuyệt vời."
    },
    {
        "name": "Xanh cơm",
        "emoji": "🍚",
        "type": "organic",
        "desc": "Cơm thừa có thể cho gia súc ăn hoặc làm phân xanh."
    },
    {
        "name": "Bình ắc quy đã qua sử dụng",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Ắc quy chì-axit rất nguy hại nếu rò rỉ."
    },
    {
        "name": "Rỗng chai thủy tinh",
        "emoji": "🍾",
        "type": "recycle",
        "desc": "Thủy tinh nấu chảy để tạo hình dáng mới."
    },
    {
        "name": "Chai thủy tinh mới gỡ",
        "emoji": "🍾",
        "type": "recycle",
        "desc": "Thủy tinh nấu chảy để tạo hình dáng mới."
    },
    {
        "name": "Thịt bị dập",
        "emoji": "🥩",
        "type": "organic",
        "desc": "Thịt hỏng cần ủ kỹ để tránh mùi hôi."
    },
    {
        "name": "Bị dập hoa",
        "emoji": "🌺",
        "type": "organic",
        "desc": "Hoa héo rụng phân hủy tự nhiên."
    },
    {
        "name": "Bao bì ống nước pvc",
        "emoji": "🚰",
        "type": "recycle",
        "desc": "Nhựa PVC tái chế dùng trong công nghiệp."
    },
    {
        "name": "Mới gỡ chai thủy tinh",
        "emoji": "🍾",
        "type": "recycle",
        "desc": "Thủy tinh nấu chảy để tạo hình dáng mới."
    },
    {
        "name": "Cũ báo",
        "emoji": "📰",
        "type": "recycle",
        "desc": "Giấy báo là nguồn giấy tái chế dồi dào."
    },
    {
        "name": "Vỏ chai thủy tinh",
        "emoji": "🍾",
        "type": "recycle",
        "desc": "Thủy tinh nấu chảy để tạo hình dáng mới."
    },
    {
        "name": "Vỡ tã lót",
        "emoji": "👶",
        "type": "inorganic",
        "desc": "Tã lót chứa nhiều gel thấm hút vô cơ."
    },
    {
        "name": "Bánh mì còn thừa",
        "emoji": "🍞",
        "type": "organic",
        "desc": "Bánh mì mốc phân hủy rất nhanh."
    },
    {
        "name": "Vỡ vụn bóng đèn",
        "emoji": "💡",
        "type": "hazardous",
        "desc": "Bóng đèn huỳnh quang chứa hơi thủy ngân nguy hiểm."
    },
    {
        "name": "Băng dính mảnh vụn",
        "emoji": "🩹",
        "type": "inorganic",
        "desc": "Keo nhựa dán không thể phân hủy sinh học."
    },
    {
        "name": "Vỏ hộp sữa rỗng",
        "emoji": "🧃",
        "type": "recycle",
        "desc": "Vỏ hộp Tetra Pak có lớp giấy và nhôm tái chế được."
    },
    {
        "name": "Găng tay cao su vỡ",
        "emoji": "🧤",
        "type": "inorganic",
        "desc": "Cao su tổng hợp rất khó tiêu hủy."
    },
    {
        "name": "Bám bẩn bàn chải",
        "emoji": "🪥",
        "type": "inorganic",
        "desc": "Sợi cước ni-lông không phân hủy."
    },
    {
        "name": "Gói snack xốp",
        "emoji": "🍟",
        "type": "inorganic",
        "desc": "Vỏ snack tráng màng nhôm/nhựa không thể tách rời để tái chế."
    },
    {
        "name": "Pin tiểu AA nguy hiểm",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Pin rò rỉ hóa chất và kim loại nặng cực độc."
    },
    {
        "name": "Nhiễm độc bình ắc quy",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Ắc quy chì-axit rất nguy hại nếu rò rỉ."
    },
    {
        "name": "Gói snack bọc nilon",
        "emoji": "🍟",
        "type": "inorganic",
        "desc": "Vỏ snack tráng màng nhôm/nhựa không thể tách rời để tái chế."
    },
    {
        "name": "Mảnh vụn bút bi",
        "emoji": "🖊️",
        "type": "inorganic",
        "desc": "Vỏ bút nhựa nhỏ vụn làm ô nhiễm vi nhựa."
    },
    {
        "name": "Bị rò rỉ nhiệt kế thủy ngân",
        "emoji": "🌡️",
        "type": "hazardous",
        "desc": "Thủy ngân là chất kịch độc đối với thần kinh."
    },
    {
        "name": "Cà phê héo",
        "emoji": "☕",
        "type": "organic",
        "desc": "Bã cà phê giúp xua đuổi sâu bọ cho cây."
    },
    {
        "name": "Bánh mì héo",
        "emoji": "🍞",
        "type": "organic",
        "desc": "Bánh mì mốc phân hủy rất nhanh."
    },
    {
        "name": "Cũ chai thủy tinh",
        "emoji": "🍾",
        "type": "recycle",
        "desc": "Thủy tinh nấu chảy để tạo hình dáng mới."
    },
    {
        "name": "Gói snack bẩn",
        "emoji": "🍟",
        "type": "inorganic",
        "desc": "Vỏ snack tráng màng nhôm/nhựa không thể tách rời để tái chế."
    },
    {
        "name": "Hết hạn pin tiểu aa",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Pin rò rỉ hóa chất và kim loại nặng cực độc."
    },
    {
        "name": "Nhiệt kế thủy ngân vỡ vụn",
        "emoji": "🌡️",
        "type": "hazardous",
        "desc": "Thủy ngân là chất kịch độc đối với thần kinh."
    },
    {
        "name": "Cơm xanh",
        "emoji": "🍚",
        "type": "organic",
        "desc": "Cơm thừa có thể cho gia súc ăn hoặc làm phân xanh."
    },
    {
        "name": "Thừa vỏ trứng",
        "emoji": "🥚",
        "type": "organic",
        "desc": "Vỏ trứng cung cấp canxi cho đất."
    },
    {
        "name": "Chết thuốc",
        "emoji": "💊",
        "type": "hazardous",
        "desc": "Thuốc quá hạn làm ô nhiễm nguồn nước ngầm."
    },
    {
        "name": "Bình xịt côn trùng rỉ sét",
        "emoji": "🪰",
        "type": "hazardous",
        "desc": "Vỏ bình xịt áp suất cao dễ gây nổ và độc."
    },
    {
        "name": "Bị dập táo",
        "emoji": "🍎",
        "type": "organic",
        "desc": "Lõi táo là rác hữu cơ tuyệt vời."
    },
    {
        "name": "Mảnh vụn băng dính",
        "emoji": "🩹",
        "type": "inorganic",
        "desc": "Keo nhựa dán không thể phân hủy sinh học."
    },
    {
        "name": "Lá cây còn thừa",
        "emoji": "🍂",
        "type": "organic",
        "desc": "Lá cây rụng tạo mùn cho đất."
    },
    {
        "name": "Lên men cá",
        "emoji": "🐟",
        "type": "organic",
        "desc": "Xương và thịt cá là nguồn phốt pho tốt."
    },
    {
        "name": "Găng tay cao su bẩn",
        "emoji": "🧤",
        "type": "inorganic",
        "desc": "Cao su tổng hợp rất khó tiêu hủy."
    },
    {
        "name": "Héo cà phê",
        "emoji": "☕",
        "type": "organic",
        "desc": "Bã cà phê giúp xua đuổi sâu bọ cho cây."
    },
    {
        "name": "Mới gỡ chai nhựa",
        "emoji": "🧴",
        "type": "recycle",
        "desc": "Nhựa PET có thể tái chế thành sợi polyester."
    },
    {
        "name": "Rỉ sét bình xịt côn trùng",
        "emoji": "🪰",
        "type": "hazardous",
        "desc": "Vỏ bình xịt áp suất cao dễ gây nổ và độc."
    },
    {
        "name": "Rau xanh",
        "emoji": "🥬",
        "type": "organic",
        "desc": "Cọng rau thừa rất dễ phân hủy."
    },
    {
        "name": "Bàn chải đã dính dầu",
        "emoji": "🪥",
        "type": "inorganic",
        "desc": "Sợi cước ni-lông không phân hủy."
    },
    {
        "name": "Bẩn bút bi",
        "emoji": "🖊️",
        "type": "inorganic",
        "desc": "Vỏ bút nhựa nhỏ vụn làm ô nhiễm vi nhựa."
    },
    {
        "name": "Mút xốp đã dính dầu",
        "emoji": "🥡",
        "type": "inorganic",
        "desc": "Xốp EPS gần như không thể tự phân hủy."
    },
    {
        "name": "Nguy hiểm thuốc",
        "emoji": "💊",
        "type": "hazardous",
        "desc": "Thuốc quá hạn làm ô nhiễm nguồn nước ngầm."
    },
    {
        "name": "Hết hạn điện thoại",
        "emoji": "📱",
        "type": "hazardous",
        "desc": "Rác thải điện tử (e-waste) chứa chì và thủy ngân."
    },
    {
        "name": "Mốc thịt",
        "emoji": "🥩",
        "type": "organic",
        "desc": "Thịt hỏng cần ủ kỹ để tránh mùi hôi."
    },
    {
        "name": "Phế thải pin tiểu aa",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Pin rò rỉ hóa chất và kim loại nặng cực độc."
    },
    {
        "name": "Xốp mút xốp",
        "emoji": "🥡",
        "type": "inorganic",
        "desc": "Xốp EPS gần như không thể tự phân hủy."
    },
    {
        "name": "Vỡ vụn hóa chất",
        "emoji": "🧪",
        "type": "hazardous",
        "desc": "Hóa chất nông nghiệp hoặc tẩy rửa rất độc hại."
    },
    {
        "name": "Cà chua mốc",
        "emoji": "🍅",
        "type": "organic",
        "desc": "Cà chua dập làm phân bón cực tốt."
    },
    {
        "name": "Bao bì hộp giấy",
        "emoji": "📦",
        "type": "recycle",
        "desc": "Giấy carton được nghiền ra làm giấy mới."
    },
    {
        "name": "Sạch ly thủy tinh",
        "emoji": "🍸",
        "type": "recycle",
        "desc": "Ly vỡ vẫn là nguồn thủy tinh tái sinh."
    },
    {
        "name": "Bình ắc quy phế thải",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Ắc quy chì-axit rất nguy hại nếu rò rỉ."
    },
    {
        "name": "Sạch báo",
        "emoji": "📰",
        "type": "recycle",
        "desc": "Giấy báo là nguồn giấy tái chế dồi dào."
    },
    {
        "name": "Thối thịt",
        "emoji": "🥩",
        "type": "organic",
        "desc": "Thịt hỏng cần ủ kỹ để tránh mùi hôi."
    },
    {
        "name": "Xốp băng dính",
        "emoji": "🩹",
        "type": "inorganic",
        "desc": "Keo nhựa dán không thể phân hủy sinh học."
    },
    {
        "name": "Rau vứt đi",
        "emoji": "🥬",
        "type": "organic",
        "desc": "Cọng rau thừa rất dễ phân hủy."
    },
    {
        "name": "Tái chế được báo",
        "emoji": "📰",
        "type": "recycle",
        "desc": "Giấy báo là nguồn giấy tái chế dồi dào."
    },
    {
        "name": "Thối táo",
        "emoji": "🍎",
        "type": "organic",
        "desc": "Lõi táo là rác hữu cơ tuyệt vời."
    },
    {
        "name": "Vàng cà chua",
        "emoji": "🍅",
        "type": "organic",
        "desc": "Cà chua dập làm phân bón cực tốt."
    },
    {
        "name": "Gói snack vỡ",
        "emoji": "🍟",
        "type": "inorganic",
        "desc": "Vỏ snack tráng màng nhôm/nhựa không thể tách rời để tái chế."
    },
    {
        "name": "Mới gỡ ống nước pvc",
        "emoji": "🚰",
        "type": "recycle",
        "desc": "Nhựa PVC tái chế dùng trong công nghiệp."
    },
    {
        "name": "Bút bi tạp chất",
        "emoji": "🖊️",
        "type": "inorganic",
        "desc": "Vỏ bút nhựa nhỏ vụn làm ô nhiễm vi nhựa."
    },
    {
        "name": "Bọc nilon ống hút nhựa",
        "emoji": "🥤",
        "type": "inorganic",
        "desc": "Ống hút nhựa sử dụng 1 lần gây hại cho sinh vật biển."
    },
    {
        "name": "Sách rỗng",
        "emoji": "📖",
        "type": "recycle",
        "desc": "Sách cũ có thể tái chế thành giấy nháp."
    },
    {
        "name": "Phế thải laptop",
        "emoji": "💻",
        "type": "hazardous",
        "desc": "Bo mạch chứa nhiều kim loại nặng."
    },
    {
        "name": "Vỏ hộp sữa đã xài",
        "emoji": "🧃",
        "type": "recycle",
        "desc": "Vỏ hộp Tetra Pak có lớp giấy và nhôm tái chế được."
    },
    {
        "name": "Nhiễm độc thuốc",
        "emoji": "💊",
        "type": "hazardous",
        "desc": "Thuốc quá hạn làm ô nhiễm nguồn nước ngầm."
    },
    {
        "name": "Điện thoại vỡ vụn",
        "emoji": "📱",
        "type": "hazardous",
        "desc": "Rác thải điện tử (e-waste) chứa chì và thủy ngân."
    },
    {
        "name": "Lon bia rách",
        "emoji": "🍺",
        "type": "recycle",
        "desc": "Lon nhôm có thể đúc lại vô hạn lần."
    },
    {
        "name": "Chai nhựa bao bì",
        "emoji": "🧴",
        "type": "recycle",
        "desc": "Nhựa PET có thể tái chế thành sợi polyester."
    },
    {
        "name": "Vàng cơm",
        "emoji": "🍚",
        "type": "organic",
        "desc": "Cơm thừa có thể cho gia súc ăn hoặc làm phân xanh."
    },
    {
        "name": "Rỗng ống nước pvc",
        "emoji": "🚰",
        "type": "recycle",
        "desc": "Nhựa PVC tái chế dùng trong công nghiệp."
    },
    {
        "name": "Vỏ trứng còn thừa",
        "emoji": "🥚",
        "type": "organic",
        "desc": "Vỏ trứng cung cấp canxi cho đất."
    },
    {
        "name": "Báo vỏ",
        "emoji": "📰",
        "type": "recycle",
        "desc": "Giấy báo là nguồn giấy tái chế dồi dào."
    },
    {
        "name": "Tã lót mảnh vụn",
        "emoji": "👶",
        "type": "inorganic",
        "desc": "Tã lót chứa nhiều gel thấm hút vô cơ."
    },
    {
        "name": "Chuối mốc",
        "emoji": "🍌",
        "type": "organic",
        "desc": "Vỏ chuối phân hủy nhanh, làm phân bón tốt."
    },
    {
        "name": "Chai nhựa bóp méo",
        "emoji": "🧴",
        "type": "recycle",
        "desc": "Nhựa PET có thể tái chế thành sợi polyester."
    },
    {
        "name": "Bóp méo ly thủy tinh",
        "emoji": "🍸",
        "type": "recycle",
        "desc": "Ly vỡ vẫn là nguồn thủy tinh tái sinh."
    },
    {
        "name": "Bị rò rỉ bình ắc quy",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Ắc quy chì-axit rất nguy hại nếu rò rỉ."
    },
    {
        "name": "Hoa mốc",
        "emoji": "🌺",
        "type": "organic",
        "desc": "Hoa héo rụng phân hủy tự nhiên."
    },
    {
        "name": "Bị dập rau",
        "emoji": "🥬",
        "type": "organic",
        "desc": "Cọng rau thừa rất dễ phân hủy."
    },
    {
        "name": "Hết hạn laptop",
        "emoji": "💻",
        "type": "hazardous",
        "desc": "Bo mạch chứa nhiều kim loại nặng."
    },
    {
        "name": "Mới gỡ lon bia",
        "emoji": "🍺",
        "type": "recycle",
        "desc": "Lon nhôm có thể đúc lại vô hạn lần."
    },
    {
        "name": "Nguy hiểm nhiệt kế thủy ngân",
        "emoji": "🌡️",
        "type": "hazardous",
        "desc": "Thủy ngân là chất kịch độc đối với thần kinh."
    },
    {
        "name": "Bánh mì vàng",
        "emoji": "🍞",
        "type": "organic",
        "desc": "Bánh mì mốc phân hủy rất nhanh."
    },
    {
        "name": "Hóa chất nguy hiểm",
        "emoji": "🧪",
        "type": "hazardous",
        "desc": "Hóa chất nông nghiệp hoặc tẩy rửa rất độc hại."
    },
    {
        "name": "Bút bi bẩn",
        "emoji": "🖊️",
        "type": "inorganic",
        "desc": "Vỏ bút nhựa nhỏ vụn làm ô nhiễm vi nhựa."
    },
    {
        "name": "Hộp giấy bóp méo",
        "emoji": "📦",
        "type": "recycle",
        "desc": "Giấy carton được nghiền ra làm giấy mới."
    },
    {
        "name": "Sơn nhiễm độc",
        "emoji": "🎨",
        "type": "hazardous",
        "desc": "Hộp sơn cũ chứa dung môi bay hơi độc hại."
    },
    {
        "name": "Đã xài chai thủy tinh",
        "emoji": "🍾",
        "type": "recycle",
        "desc": "Thủy tinh nấu chảy để tạo hình dáng mới."
    },
    {
        "name": "Pin tiểu AA chết",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Pin rò rỉ hóa chất và kim loại nặng cực độc."
    },
    {
        "name": "Sạch vỏ hộp sữa",
        "emoji": "🧃",
        "type": "recycle",
        "desc": "Vỏ hộp Tetra Pak có lớp giấy và nhôm tái chế được."
    },
    {
        "name": "Hoa xanh",
        "emoji": "🌺",
        "type": "organic",
        "desc": "Hoa héo rụng phân hủy tự nhiên."
    },
    {
        "name": "Mới gỡ báo",
        "emoji": "📰",
        "type": "recycle",
        "desc": "Giấy báo là nguồn giấy tái chế dồi dào."
    },
    {
        "name": "Bám bẩn túi nilon",
        "emoji": "🛍️",
        "type": "inorganic",
        "desc": "Túi nilon mất hàng trăm năm để phân hủy."
    },
    {
        "name": "Laptop vỡ vụn",
        "emoji": "💻",
        "type": "hazardous",
        "desc": "Bo mạch chứa nhiều kim loại nặng."
    },
    {
        "name": "Bị dập vỏ trứng",
        "emoji": "🥚",
        "type": "organic",
        "desc": "Vỏ trứng cung cấp canxi cho đất."
    },
    {
        "name": "Hóa chất vỡ vụn",
        "emoji": "🧪",
        "type": "hazardous",
        "desc": "Hóa chất nông nghiệp hoặc tẩy rửa rất độc hại."
    },
    {
        "name": "Bánh mì thừa",
        "emoji": "🍞",
        "type": "organic",
        "desc": "Bánh mì mốc phân hủy rất nhanh."
    },
    {
        "name": "Chuối bị dập",
        "emoji": "🍌",
        "type": "organic",
        "desc": "Vỏ chuối phân hủy nhanh, làm phân bón tốt."
    },
    {
        "name": "Bàn chải nhựa cứng",
        "emoji": "🪥",
        "type": "inorganic",
        "desc": "Sợi cước ni-lông không phân hủy."
    },
    {
        "name": "Bóng đèn chết",
        "emoji": "💡",
        "type": "hazardous",
        "desc": "Bóng đèn huỳnh quang chứa hơi thủy ngân nguy hiểm."
    },
    {
        "name": "Tái chế được sách",
        "emoji": "📖",
        "type": "recycle",
        "desc": "Sách cũ có thể tái chế thành giấy nháp."
    },
    {
        "name": "Còn thừa cá",
        "emoji": "🐟",
        "type": "organic",
        "desc": "Xương và thịt cá là nguồn phốt pho tốt."
    },
    {
        "name": "Chết nhiệt kế thủy ngân",
        "emoji": "🌡️",
        "type": "hazardous",
        "desc": "Thủy ngân là chất kịch độc đối với thần kinh."
    },
    {
        "name": "Ly thủy tinh rách",
        "emoji": "🍸",
        "type": "recycle",
        "desc": "Ly vỡ vẫn là nguồn thủy tinh tái sinh."
    },
    {
        "name": "Sơn nguy hiểm",
        "emoji": "🎨",
        "type": "hazardous",
        "desc": "Hộp sơn cũ chứa dung môi bay hơi độc hại."
    },
    {
        "name": "Táo vứt đi",
        "emoji": "🍎",
        "type": "organic",
        "desc": "Lõi táo là rác hữu cơ tuyệt vời."
    },
    {
        "name": "Rỗng sách",
        "emoji": "📖",
        "type": "recycle",
        "desc": "Sách cũ có thể tái chế thành giấy nháp."
    },
    {
        "name": "Hóa chất hết hạn",
        "emoji": "🧪",
        "type": "hazardous",
        "desc": "Hóa chất nông nghiệp hoặc tẩy rửa rất độc hại."
    },
    {
        "name": "Chai nhựa đã xài",
        "emoji": "🧴",
        "type": "recycle",
        "desc": "Nhựa PET có thể tái chế thành sợi polyester."
    },
    {
        "name": "Túi nilon bám bẩn",
        "emoji": "🛍️",
        "type": "inorganic",
        "desc": "Túi nilon mất hàng trăm năm để phân hủy."
    },
    {
        "name": "Sơn rỉ sét",
        "emoji": "🎨",
        "type": "hazardous",
        "desc": "Hộp sơn cũ chứa dung môi bay hơi độc hại."
    },
    {
        "name": "Hết hạn bình ắc quy",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Ắc quy chì-axit rất nguy hại nếu rò rỉ."
    },
    {
        "name": "Hóa chất rỉ sét",
        "emoji": "🧪",
        "type": "hazardous",
        "desc": "Hóa chất nông nghiệp hoặc tẩy rửa rất độc hại."
    },
    {
        "name": "Đã dính dầu găng tay cao su",
        "emoji": "🧤",
        "type": "inorganic",
        "desc": "Cao su tổng hợp rất khó tiêu hủy."
    },
    {
        "name": "Bình ắc quy rỉ sét",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Ắc quy chì-axit rất nguy hại nếu rò rỉ."
    },
    {
        "name": "Vỏ lon bò húc sạch",
        "emoji": "🥫",
        "type": "recycle",
        "desc": "Lon kim loại dễ dàng thu gom tái chế."
    },
    {
        "name": "Đồ chơi nhựa rách nát",
        "emoji": "🧸",
        "type": "inorganic",
        "desc": "Đồ chơi vỡ trộn lẫn nhiều loại nhựa khó tái chế."
    },
    {
        "name": "Tái chế được vỏ hộp sữa",
        "emoji": "🧃",
        "type": "recycle",
        "desc": "Vỏ hộp Tetra Pak có lớp giấy và nhôm tái chế được."
    },
    {
        "name": "Sơn phế thải",
        "emoji": "🎨",
        "type": "hazardous",
        "desc": "Hộp sơn cũ chứa dung môi bay hơi độc hại."
    },
    {
        "name": "Ống hút nhựa tạp chất",
        "emoji": "🥤",
        "type": "inorganic",
        "desc": "Ống hút nhựa sử dụng 1 lần gây hại cho sinh vật biển."
    },
    {
        "name": "Pin tiểu AA phế thải",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Pin rò rỉ hóa chất và kim loại nặng cực độc."
    },
    {
        "name": "Đã qua sử dụng bóng đèn",
        "emoji": "💡",
        "type": "hazardous",
        "desc": "Bóng đèn huỳnh quang chứa hơi thủy ngân nguy hiểm."
    },
    {
        "name": "Sạch ống nước pvc",
        "emoji": "🚰",
        "type": "recycle",
        "desc": "Nhựa PVC tái chế dùng trong công nghiệp."
    },
    {
        "name": "Mảnh vụn găng tay cao su",
        "emoji": "🧤",
        "type": "inorganic",
        "desc": "Cao su tổng hợp rất khó tiêu hủy."
    },
    {
        "name": "Vỏ hộp sữa sạch",
        "emoji": "🧃",
        "type": "recycle",
        "desc": "Vỏ hộp Tetra Pak có lớp giấy và nhôm tái chế được."
    },
    {
        "name": "Vỡ vụn điện thoại",
        "emoji": "📱",
        "type": "hazardous",
        "desc": "Rác thải điện tử (e-waste) chứa chì và thủy ngân."
    },
    {
        "name": "Laptop đã qua sử dụng",
        "emoji": "💻",
        "type": "hazardous",
        "desc": "Bo mạch chứa nhiều kim loại nặng."
    },
    {
        "name": "Hết hạn bình xịt côn trùng",
        "emoji": "🪰",
        "type": "hazardous",
        "desc": "Vỏ bình xịt áp suất cao dễ gây nổ và độc."
    },
    {
        "name": "Mút xốp mảnh vụn",
        "emoji": "🥡",
        "type": "inorganic",
        "desc": "Xốp EPS gần như không thể tự phân hủy."
    },
    {
        "name": "Thuốc bị rò rỉ",
        "emoji": "💊",
        "type": "hazardous",
        "desc": "Thuốc quá hạn làm ô nhiễm nguồn nước ngầm."
    },
    {
        "name": "Gói snack tạp chất",
        "emoji": "🍟",
        "type": "inorganic",
        "desc": "Vỏ snack tráng màng nhôm/nhựa không thể tách rời để tái chế."
    },
    {
        "name": "Báo đã xài",
        "emoji": "📰",
        "type": "recycle",
        "desc": "Giấy báo là nguồn giấy tái chế dồi dào."
    },
    {
        "name": "Vỡ vụn sơn",
        "emoji": "🎨",
        "type": "hazardous",
        "desc": "Hộp sơn cũ chứa dung môi bay hơi độc hại."
    },
    {
        "name": "Ly thủy tinh đã xài",
        "emoji": "🍸",
        "type": "recycle",
        "desc": "Ly vỡ vẫn là nguồn thủy tinh tái sinh."
    },
    {
        "name": "Táo thối",
        "emoji": "🍎",
        "type": "organic",
        "desc": "Lõi táo là rác hữu cơ tuyệt vời."
    },
    {
        "name": "Bóp méo ống nước pvc",
        "emoji": "🚰",
        "type": "recycle",
        "desc": "Nhựa PVC tái chế dùng trong công nghiệp."
    },
    {
        "name": "Bình ắc quy chết",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Ắc quy chì-axit rất nguy hại nếu rò rỉ."
    },
    {
        "name": "Mốc cơm",
        "emoji": "🍚",
        "type": "organic",
        "desc": "Cơm thừa có thể cho gia súc ăn hoặc làm phân xanh."
    },
    {
        "name": "Bọc nilon tã lót",
        "emoji": "👶",
        "type": "inorganic",
        "desc": "Tã lót chứa nhiều gel thấm hút vô cơ."
    },
    {
        "name": "Vỏ hộp sữa cũ",
        "emoji": "🧃",
        "type": "recycle",
        "desc": "Vỏ hộp Tetra Pak có lớp giấy và nhôm tái chế được."
    },
    {
        "name": "Tã lót tạp chất",
        "emoji": "👶",
        "type": "inorganic",
        "desc": "Tã lót chứa nhiều gel thấm hút vô cơ."
    },
    {
        "name": "Đã xài báo",
        "emoji": "📰",
        "type": "recycle",
        "desc": "Giấy báo là nguồn giấy tái chế dồi dào."
    },
    {
        "name": "Hết hạn sơn",
        "emoji": "🎨",
        "type": "hazardous",
        "desc": "Hộp sơn cũ chứa dung môi bay hơi độc hại."
    },
    {
        "name": "Phế thải điện thoại",
        "emoji": "📱",
        "type": "hazardous",
        "desc": "Rác thải điện tử (e-waste) chứa chì và thủy ngân."
    },
    {
        "name": "Bàn chải rách nát",
        "emoji": "🪥",
        "type": "inorganic",
        "desc": "Sợi cước ni-lông không phân hủy."
    },
    {
        "name": "Thối chuối",
        "emoji": "🍌",
        "type": "organic",
        "desc": "Vỏ chuối phân hủy nhanh, làm phân bón tốt."
    },
    {
        "name": "Lá cây thừa",
        "emoji": "🍂",
        "type": "organic",
        "desc": "Lá cây rụng tạo mùn cho đất."
    },
    {
        "name": "Rỗng ly thủy tinh",
        "emoji": "🍸",
        "type": "recycle",
        "desc": "Ly vỡ vẫn là nguồn thủy tinh tái sinh."
    },
    {
        "name": "Chai nhựa rách",
        "emoji": "🧴",
        "type": "recycle",
        "desc": "Nhựa PET có thể tái chế thành sợi polyester."
    },
    {
        "name": "Ống nước PVC vỏ",
        "emoji": "🚰",
        "type": "recycle",
        "desc": "Nhựa PVC tái chế dùng trong công nghiệp."
    },
    {
        "name": "Ống hút nhựa bẩn",
        "emoji": "🥤",
        "type": "inorganic",
        "desc": "Ống hút nhựa sử dụng 1 lần gây hại cho sinh vật biển."
    },
    {
        "name": "Đã dính dầu mút xốp",
        "emoji": "🥡",
        "type": "inorganic",
        "desc": "Xốp EPS gần như không thể tự phân hủy."
    },
    {
        "name": "Bị dập lá cây",
        "emoji": "🍂",
        "type": "organic",
        "desc": "Lá cây rụng tạo mùn cho đất."
    },
    {
        "name": "Cà chua thừa",
        "emoji": "🍅",
        "type": "organic",
        "desc": "Cà chua dập làm phân bón cực tốt."
    },
    {
        "name": "Ống hút nhựa xốp",
        "emoji": "🥤",
        "type": "inorganic",
        "desc": "Ống hút nhựa sử dụng 1 lần gây hại cho sinh vật biển."
    },
    {
        "name": "Bàn chải mảnh vụn",
        "emoji": "🪥",
        "type": "inorganic",
        "desc": "Sợi cước ni-lông không phân hủy."
    },
    {
        "name": "Ly thủy tinh sạch",
        "emoji": "🍸",
        "type": "recycle",
        "desc": "Ly vỡ vẫn là nguồn thủy tinh tái sinh."
    },
    {
        "name": "Mốc táo",
        "emoji": "🍎",
        "type": "organic",
        "desc": "Lõi táo là rác hữu cơ tuyệt vời."
    },
    {
        "name": "Rỉ sét bình ắc quy",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Ắc quy chì-axit rất nguy hại nếu rò rỉ."
    },
    {
        "name": "Gói snack đã dính dầu",
        "emoji": "🍟",
        "type": "inorganic",
        "desc": "Vỏ snack tráng màng nhôm/nhựa không thể tách rời để tái chế."
    },
    {
        "name": "Thừa hoa",
        "emoji": "🌺",
        "type": "organic",
        "desc": "Hoa héo rụng phân hủy tự nhiên."
    },
    {
        "name": "Xanh táo",
        "emoji": "🍎",
        "type": "organic",
        "desc": "Lõi táo là rác hữu cơ tuyệt vời."
    },
    {
        "name": "Rỗng chai nhựa",
        "emoji": "🧴",
        "type": "recycle",
        "desc": "Nhựa PET có thể tái chế thành sợi polyester."
    },
    {
        "name": "Vỡ vụn laptop",
        "emoji": "💻",
        "type": "hazardous",
        "desc": "Bo mạch chứa nhiều kim loại nặng."
    },
    {
        "name": "Rách chai nhựa",
        "emoji": "🧴",
        "type": "recycle",
        "desc": "Nhựa PET có thể tái chế thành sợi polyester."
    },
    {
        "name": "Vứt đi bánh mì",
        "emoji": "🍞",
        "type": "organic",
        "desc": "Bánh mì mốc phân hủy rất nhanh."
    },
    {
        "name": "Chuối thừa",
        "emoji": "🍌",
        "type": "organic",
        "desc": "Vỏ chuối phân hủy nhanh, làm phân bón tốt."
    },
    {
        "name": "Túi nilon tạp chất",
        "emoji": "🛍️",
        "type": "inorganic",
        "desc": "Túi nilon mất hàng trăm năm để phân hủy."
    },
    {
        "name": "Chết hóa chất",
        "emoji": "🧪",
        "type": "hazardous",
        "desc": "Hóa chất nông nghiệp hoặc tẩy rửa rất độc hại."
    },
    {
        "name": "Rau mốc",
        "emoji": "🥬",
        "type": "organic",
        "desc": "Cọng rau thừa rất dễ phân hủy."
    },
    {
        "name": "Vỏ lon bò húc vỏ",
        "emoji": "🥫",
        "type": "recycle",
        "desc": "Lon kim loại dễ dàng thu gom tái chế."
    },
    {
        "name": "Bóng đèn nguy hiểm",
        "emoji": "💡",
        "type": "hazardous",
        "desc": "Bóng đèn huỳnh quang chứa hơi thủy ngân nguy hiểm."
    },
    {
        "name": "Vỏ trứng xanh",
        "emoji": "🥚",
        "type": "organic",
        "desc": "Vỏ trứng cung cấp canxi cho đất."
    },
    {
        "name": "Mảnh vụn mút xốp",
        "emoji": "🥡",
        "type": "inorganic",
        "desc": "Xốp EPS gần như không thể tự phân hủy."
    },
    {
        "name": "Đồ chơi nhựa bám bẩn",
        "emoji": "🧸",
        "type": "inorganic",
        "desc": "Đồ chơi vỡ trộn lẫn nhiều loại nhựa khó tái chế."
    },
    {
        "name": "Bút bi xốp",
        "emoji": "🖊️",
        "type": "inorganic",
        "desc": "Vỏ bút nhựa nhỏ vụn làm ô nhiễm vi nhựa."
    },
    {
        "name": "Hóa chất hỏng",
        "emoji": "🧪",
        "type": "hazardous",
        "desc": "Hóa chất nông nghiệp hoặc tẩy rửa rất độc hại."
    },
    {
        "name": "Laptop hết hạn",
        "emoji": "💻",
        "type": "hazardous",
        "desc": "Bo mạch chứa nhiều kim loại nặng."
    },
    {
        "name": "Rỗng hộp giấy",
        "emoji": "📦",
        "type": "recycle",
        "desc": "Giấy carton được nghiền ra làm giấy mới."
    },
    {
        "name": "Táo xanh",
        "emoji": "🍎",
        "type": "organic",
        "desc": "Lõi táo là rác hữu cơ tuyệt vời."
    },
    {
        "name": "Đồ chơi nhựa bọc nilon",
        "emoji": "🧸",
        "type": "inorganic",
        "desc": "Đồ chơi vỡ trộn lẫn nhiều loại nhựa khó tái chế."
    },
    {
        "name": "Mảnh vụn gói snack",
        "emoji": "🍟",
        "type": "inorganic",
        "desc": "Vỏ snack tráng màng nhôm/nhựa không thể tách rời để tái chế."
    },
    {
        "name": "Rau bị dập",
        "emoji": "🥬",
        "type": "organic",
        "desc": "Cọng rau thừa rất dễ phân hủy."
    },
    {
        "name": "Vứt đi cà chua",
        "emoji": "🍅",
        "type": "organic",
        "desc": "Cà chua dập làm phân bón cực tốt."
    },
    {
        "name": "Pin tiểu AA nhiễm độc",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Pin rò rỉ hóa chất và kim loại nặng cực độc."
    },
    {
        "name": "Xanh cà phê",
        "emoji": "☕",
        "type": "organic",
        "desc": "Bã cà phê giúp xua đuổi sâu bọ cho cây."
    },
    {
        "name": "Túi nilon mảnh vụn",
        "emoji": "🛍️",
        "type": "inorganic",
        "desc": "Túi nilon mất hàng trăm năm để phân hủy."
    },
    {
        "name": "Bẩn túi nilon",
        "emoji": "🛍️",
        "type": "inorganic",
        "desc": "Túi nilon mất hàng trăm năm để phân hủy."
    },
    {
        "name": "Đã qua sử dụng pin tiểu aa",
        "emoji": "🔋",
        "type": "hazardous",
        "desc": "Pin rò rỉ hóa chất và kim loại nặng cực độc."
    },
    {
        "name": "Vỏ trứng vàng",
        "emoji": "🥚",
        "type": "organic",
        "desc": "Vỏ trứng cung cấp canxi cho đất."
    },
    {
        "name": "Rách hộp giấy",
        "emoji": "📦",
        "type": "recycle",
        "desc": "Giấy carton được nghiền ra làm giấy mới."
    },
    {
        "name": "Cá bị dập",
        "emoji": "🐟",
        "type": "organic",
        "desc": "Xương và thịt cá là nguồn phốt pho tốt."
    },
    {
        "name": "Lên men rau",
        "emoji": "🥬",
        "type": "organic",
        "desc": "Cọng rau thừa rất dễ phân hủy."
    },
    {
        "name": "Bút bi bám bẩn",
        "emoji": "🖊️",
        "type": "inorganic",
        "desc": "Vỏ bút nhựa nhỏ vụn làm ô nhiễm vi nhựa."
    },
    {
        "name": "Cà phê lên men",
        "emoji": "☕",
        "type": "organic",
        "desc": "Bã cà phê giúp xua đuổi sâu bọ cho cây."
    },
    {
        "name": "Báo tái chế được",
        "emoji": "📰",
        "type": "recycle",
        "desc": "Giấy báo là nguồn giấy tái chế dồi dào."
    },
    {
        "name": "Laptop chết",
        "emoji": "💻",
        "type": "hazardous",
        "desc": "Bo mạch chứa nhiều kim loại nặng."
    },
    {
        "name": "Chai nhựa mới gỡ",
        "emoji": "🧴",
        "type": "recycle",
        "desc": "Nhựa PET có thể tái chế thành sợi polyester."
    },
    {
        "name": "Rỉ sét laptop",
        "emoji": "💻",
        "type": "hazardous",
        "desc": "Bo mạch chứa nhiều kim loại nặng."
    },
    {
        "name": "Rách ly thủy tinh",
        "emoji": "🍸",
        "type": "recycle",
        "desc": "Ly vỡ vẫn là nguồn thủy tinh tái sinh."
    },
    {
        "name": "Bút bi đã dính dầu",
        "emoji": "🖊️",
        "type": "inorganic",
        "desc": "Vỏ bút nhựa nhỏ vụn làm ô nhiễm vi nhựa."
    },
    {
        "name": "Mốc cà phê",
        "emoji": "☕",
        "type": "organic",
        "desc": "Bã cà phê giúp xua đuổi sâu bọ cho cây."
    },
    {
        "name": "Hoa héo",
        "emoji": "🌺",
        "type": "organic",
        "desc": "Hoa héo rụng phân hủy tự nhiên."
    },
    {
        "name": "Hoa bị dập",
        "emoji": "🌺",
        "type": "organic",
        "desc": "Hoa héo rụng phân hủy tự nhiên."
    },
    {
        "name": "Tạp chất găng tay cao su",
        "emoji": "🧤",
        "type": "inorganic",
        "desc": "Cao su tổng hợp rất khó tiêu hủy."
    },
    {
        "name": "Nguy hiểm bóng đèn",
        "emoji": "💡",
        "type": "hazardous",
        "desc": "Bóng đèn huỳnh quang chứa hơi thủy ngân nguy hiểm."
    },
    {
        "name": "Vỏ hộp sữa mới gỡ",
        "emoji": "🧃",
        "type": "recycle",
        "desc": "Vỏ hộp Tetra Pak có lớp giấy và nhôm tái chế được."
    },
    {
        "name": "Héo táo",
        "emoji": "🍎",
        "type": "organic",
        "desc": "Lõi táo là rác hữu cơ tuyệt vời."
    },
    {
        "name": "Hộp giấy rách",
        "emoji": "📦",
        "type": "recycle",
        "desc": "Giấy carton được nghiền ra làm giấy mới."
    },
    {
        "name": "Bám bẩn mút xốp",
        "emoji": "🥡",
        "type": "inorganic",
        "desc": "Xốp EPS gần như không thể tự phân hủy."
    },
    {
        "name": "Vứt đi chuối",
        "emoji": "🍌",
        "type": "organic",
        "desc": "Vỏ chuối phân hủy nhanh, làm phân bón tốt."
    },
    {
        "name": "Nhiễm độc bình xịt côn trùng",
        "emoji": "🪰",
        "type": "hazardous",
        "desc": "Vỏ bình xịt áp suất cao dễ gây nổ và độc."
    },
    {
        "name": "Cà phê mốc",
        "emoji": "☕",
        "type": "organic",
        "desc": "Bã cà phê giúp xua đuổi sâu bọ cho cây."
    },
    {
        "name": "Vỏ lon bò húc bao bì",
        "emoji": "🥫",
        "type": "recycle",
        "desc": "Lon kim loại dễ dàng thu gom tái chế."
    },
    {
        "name": "Hóa chất nhiễm độc",
        "emoji": "🧪",
        "type": "hazardous",
        "desc": "Hóa chất nông nghiệp hoặc tẩy rửa rất độc hại."
    },
    {
        "name": "Xanh vỏ trứng",
        "emoji": "🥚",
        "type": "organic",
        "desc": "Vỏ trứng cung cấp canxi cho đất."
    },
    {
        "name": "Thịt mốc",
        "emoji": "🥩",
        "type": "organic",
        "desc": "Thịt hỏng cần ủ kỹ để tránh mùi hôi."
    },
    {
        "name": "Xốp ống hút nhựa",
        "emoji": "🥤",
        "type": "inorganic",
        "desc": "Ống hút nhựa sử dụng 1 lần gây hại cho sinh vật biển."
    },
    {
        "name": "Thịt lên men",
        "emoji": "🥩",
        "type": "organic",
        "desc": "Thịt hỏng cần ủ kỹ để tránh mùi hôi."
    },
    {
        "name": "Tái chế được ống nước pvc",
        "emoji": "🚰",
        "type": "recycle",
        "desc": "Nhựa PVC tái chế dùng trong công nghiệp."
    },
    {
        "name": "Phế thải bóng đèn",
        "emoji": "💡",
        "type": "hazardous",
        "desc": "Bóng đèn huỳnh quang chứa hơi thủy ngân nguy hiểm."
    },
    {
        "name": "Chai thủy tinh cũ",
        "emoji": "🍾",
        "type": "recycle",
        "desc": "Thủy tinh nấu chảy để tạo hình dáng mới."
    },
    {
        "name": "Đã qua sử dụng hóa chất",
        "emoji": "🧪",
        "type": "hazardous",
        "desc": "Hóa chất nông nghiệp hoặc tẩy rửa rất độc hại."
    },
    {
        "name": "Sạch hộp giấy",
        "emoji": "📦",
        "type": "recycle",
        "desc": "Giấy carton được nghiền ra làm giấy mới."
    },
    {
        "name": "Nhựa cứng đồ chơi nhựa",
        "emoji": "🧸",
        "type": "inorganic",
        "desc": "Đồ chơi vỡ trộn lẫn nhiều loại nhựa khó tái chế."
    },
    {
        "name": "Xanh cà chua",
        "emoji": "🍅",
        "type": "organic",
        "desc": "Cà chua dập làm phân bón cực tốt."
    }
];

        const QUIZ_DB = [
            { q: "Ngày Môi Trường Thế Giới là ngày nào?", opts: ["5/5", "5/6", "22/4", "21/3"], ans: 1, emoji: "🌍", fact: "5/6 hàng năm, LHQ tổ chức từ 1974." },
            { q: "Ngày Trái Đất (Earth Day) là ngày nào?", opts: ["22/3", "22/4", "5/6", "16/9"], ans: 1, emoji: "🌱", fact: "22/4/1970 – huy động hàng triệu người bảo vệ môi trường." },
            { q: "Chai nhựa PET mất bao lâu phân hủy?", opts: ["50 năm", "100 năm", "450 năm", "1000 năm"], ans: 2, emoji: "⏳", fact: "Nhựa PET cần lên tới 450 năm phân hủy trong tự nhiên." },
            { q: "Vai trò chính của hệ thống Rừng là gì?", opts: ["Chỉ để cung cấp gỗ", "Sinh ra O2 và bắt giữ CO2", "Xây nhà trên cây", "Tạo ra khí Metan"], ans: 1, emoji: "🌳", fact: "Rừng hô hấp tự nhiên, hấp thụ hơi carbon cản trở hiệu ứng nhà kính." },
            { q: "Loại rác nào KHÔNG BAO GIỜ nên đốt bỏ?", opts: ["Giấy vụn", "Lá cây khô rụng", "Nhựa và Cao su", "Củi mộc"], ans: 2, emoji: "🔥", fact: "Đốt nhựa sinh ra nhóm khí Dioxin, cực độc và có thể gây ung thư cho não bộ người hít phải." },
            { q: "Nhiệt độ Trái Đất đã tăng bao nhiêu so với thời tiền công nghiệp?", opts: ["0.5°C", "1.1°C", "1.8°C", "2.3°C"], ans: 1, emoji: "🌡️", fact: "Theo tổ chức IPCC 2023, nhiệt độ đã tăng 1.1°C so với thời kỳ 1850-1900." },
            { q: "Tái chế 1 tấn giấy tiết kiệm bao nhiêu cây?", opts: ["7 cây", "17 cây", "27 cây", "37 cây"], ans: 1, emoji: "🌳", fact: "17 cây xanh được bảo vệ khi tiến hành tái chế 1 tấn giấy phế liệu." },
            { q: "Hộp xốp bám dầu mỡ thuộc loại rác nào?", opts: ["Rác hữu cơ", "Rác tái chế", "Rác vô cơ", "Rác nguy hại"], ans: 2, emoji: "🥡", fact: "Hộp xốp bẩn không thể đem đi tái chế được nữa, nên phải đưa vào rác vô cơ chôn lấp." },
            { q: "Bóng đèn huỳnh quang cũ (đèn tuýp dài) là rác gì?", opts: ["Rác vô cơ", "Rác nguy hại", "Rác tái chế", "Rác hỗn hợp"], ans: 1, emoji: "💡", fact: "Bóng đèn chứa bột thủy ngân cực độc, nếu phát tán vào không khí sẽ gây ung thư." },
            { q: "Vỏ trái cây (chuối, táo) có thể dùng làm gì?", opts: ["Chế nhựa", "Ủ làm phân bón sinh học", "Nấu lại để ăn", "Đốt sinh nhiệt"], ans: 1, emoji: "🍎", fact: "Vỏ thực vật là rác hữu cơ tự nhiên, rất tốt khi được uỷ thành phân vi sinh cho cây trồng." },
            { q: "Tái chế lon nhôm bảo toàn % năng lượng?", opts: ["50%", "75%", "95%", "30%"], ans: 2, emoji: "⚡", fact: "Lên tới 95% năng lượng sản xuất điện năng mới được tiết kiệm – lon nhôm là vua tái chế." },
            { q: "Tại sao ném Pin cũ ra vườn lại nguy hiểm?", opts: ["Vì nó dễ cháy nổ", "Nó thu hút sét", "Axit & Kim loại nặng ngấm vào đất", "Tạo ra phóng xạ hạt nhân"], ans: 2, emoji: "🔋", fact: "Pin có chứa chì và thủy ngân. Chỉ 1 cục pin có thể làm ô nhiễm mạch nước tự nhiên." }
        ];

        let level = 1; let xp = 0; let score = 0; let streak = 0; let coins = 0;
        let isSimulatingAI = false; let currentTrash = null; let isErrorModalOpen = false;

        // Inventory
        let unlockSkins = { 'default': true, 'neon': false, 'cyber': false, 'gold': false, 'ufo': false, 'eco': false };
        let currentSkin = 'default';
        let boughtAccessories = { 'tote': false, 'bambu': false, 'metalstraw': false, 'robocat': false };

        // Lưu trữ tự động biến Minigame 
        let tqWeaponType = 'wood';
        let tqWeaponLevel = 1;
        let tqArmorAmount = 0;
        let tqPotionsCount = 0;
        let tqMagnetActive = false;
        let savedTqLevel = 1;

        // --- ECO SHOP VARIABLES ---
        let ecoItemsOwned = {
            notebook: false, // +20% XP
            plant: false,    // Auto farm vàng
            tote: false,     // Giảm 20% sát thương quái
            lamp: false      // X2 Vàng rơi từ quái/Boss
        };
        let autoCoinInterval = null;

        function startEcoPlantAutoFarm() {
            if (autoCoinInterval) clearInterval(autoCoinInterval);
            autoCoinInterval = setInterval(() => {
                if (ecoItemsOwned.plant) {
                    coins += 5;
                    coinValEl.textContent = coins;
                    spawnFloatingText("+5 🟡 (Auto-Farm)", window.innerWidth / 2, 80, 'coin');
                    saveGameData();
                }
            }, 10000); // 10 giây rớt 5 vàng
        }

        // --- HỆ THỐNG SAVE / LOAD (LOCAL STORAGE) ---
        function saveGameData() {
            const gameData = {
                level: level,
                xp: xp,
                score: score,
                streak: streak,
                coins: coins,
                currentSkin: currentSkin,
                unlockSkins: unlockSkins,
                boughtAccessories: boughtAccessories,
                tqLevel: tqCurrentLevel, // Ải Minigame cao nhất
                tqWeapon: tqWeaponType,
                tqWeaponLv: tqWeaponLevel,
                tqArmor: tqArmorAmount,
                tqPotions: tqPotionsCount,
                tqMagnet: tqMagnetActive,
                bagCounts: bagCounts,
                ecoItemsOwned: ecoItemsOwned // Lưu dữ liệu Eco Shop
            };
            localStorage.setItem('AISortGameSave', JSON.stringify(gameData));
        }

        function loadGameData() {
            try {
                const saved = localStorage.getItem('AISortGameSave');
                if (saved) {
                    const data = JSON.parse(saved);

                    // Ghi đè biến 
                    if (data.level !== undefined) level = data.level;
                    if (data.xp !== undefined) xp = data.xp;
                    if (data.score !== undefined) score = data.score;
                    if (data.streak !== undefined) streak = data.streak;
                    if (data.coins !== undefined) coins = data.coins;

                    if (data.currentSkin) currentSkin = data.currentSkin;
                    if (data.unlockSkins) unlockSkins = data.unlockSkins;
                    if (data.boughtAccessories) boughtAccessories = data.boughtAccessories;

                    if (data.tqLevel) tqCurrentLevel = data.tqLevel;
                    if (data.tqWeapon) tqWeaponType = data.tqWeapon;
                    if (data.tqWeaponLv) tqWeaponLevel = data.tqWeaponLv;
                    if (data.tqArmor !== undefined) tqArmorAmount = data.tqArmor;
                    if (data.tqPotions !== undefined) tqPotionsCount = data.tqPotions;
                    if (data.tqMagnet !== undefined) tqMagnetActive = data.tqMagnet;

                    if (data.bagCounts) bagCounts = data.bagCounts;

                    if (data.ecoItemsOwned) {
                        ecoItemsOwned = data.ecoItemsOwned;
                        if (ecoItemsOwned.plant) startEcoPlantAutoFarm();
                    }

                    console.log("Game Loaded Successfully!");
                }
            } catch (err) {
                console.error("Failed to load save data", err);
            }

            // Render UI theo LocalStorage
            levelBadge.textContent = level;
            scoreEl.textContent = score;
            streakEl.textContent = streak;
            coinValEl.textContent = coins;

            let reqXpUpdated = 100 * Math.pow(1.5, level - 1);
            xpBar.style.width = Math.min((xp / reqXpUpdated) * 100, 100) + '%';

            equipSkin(currentSkin); // Mặc skin lại
            updateBagUI(); // Hiện lại túi rác phân loại
            updateSeasonTheme();

            // Cập nhật giao diện Eco Shop
            for (let id in ecoItemsOwned) {
                let btn = document.getElementById(`btn-eco-${id}`);
                if (btn && ecoItemsOwned[id]) {
                    btn.innerHTML = "ĐÃ SỞ HỮU";
                    btn.className = "buy-btn equipped";
                }
            }
        }

        // --- ECO SHOP LOGIC ---
        function openEcoShop() { document.getElementById('ecoShopModal').classList.add('active'); }
        function closeEcoShop() { document.getElementById('ecoShopModal').classList.remove('active'); }

        function buyEcoItem(id, price) {
            if (ecoItemsOwned[id]) return;
            if (coins >= price) {
                coins -= price;
                coinValEl.textContent = coins;
                ecoItemsOwned[id] = true;

                let btn = document.getElementById(`btn-eco-${id}`);
                if (btn) {
                    btn.innerHTML = "ĐÃ SỞ HỮU";
                    btn.className = "buy-btn equipped";
                }

                if (id === 'plant') startEcoPlantAutoFarm();

                fireConfettiOrigin(window.innerWidth / 2, window.innerHeight / 2, 100, 2);
                showFeedback(`Chúc mừng! Bạn đã sở hữu vật phẩm sinh thái có BUFF đặc biệt.`, 'success');
                saveGameData();
            } else {
                alert(`Không đủ Tiền! Cần ${price} 🟡. Bạn thiếu ${price - coins} 🟡.`);
            }
        }

        function resetGameData() {
            if (confirm('Bạn có chắc chắn muốn xóa toàn bộ Dữ Liệu chơi (Level, Đồ Cửa hàng, Túi Rác) và làm lại từ đầu không?')) {
                localStorage.removeItem('AISortGameSave');
                location.reload();
            }
        }

        // Gọi khi vừa tải Web xong
        window.addEventListener('DOMContentLoaded', () => {
            loadGameData();
        });

        // --- DOM Elements ---
        const itemEl = document.getElementById('trashItem');
        const nameEl = document.getElementById('trashName');
        const scoreEl = document.getElementById('score');
        const streakEl = document.getElementById('streak');
        const coinValEl = document.getElementById('coinCount');
        const levelBadge = document.getElementById('levelBadge');
        const xpBar = document.getElementById('xpBar');
        const laserEl = document.getElementById('aiLaser');
        const scanningTextEl = document.getElementById('scanningText');
        const feedbackEl = document.getElementById('feedbackToast');
        const bins = document.querySelectorAll('.bin');
        const mainContainer = document.getElementById('mainContainer');
        const seasonFlash = document.getElementById('seasonFlash');
        const bgContainer = document.getElementById('bgParticles');
        const seasonBadge = document.getElementById('seasonBadge');
        const scannerArea = document.getElementById('scannerArea');
        const errorModal = document.getElementById('errorModal');

        // Seasons logic
        const seasons = [
            { name: "Mùa Xuân 🌸", class: "theme-spring", pType: "blossom" },
            { name: "Mùa Hạ ☀️", class: "theme-summer", pType: "bubble" },
            { name: "Mùa Thu 🍁", class: "theme-autumn", pType: "leaf" },
            { name: "Mùa Đông ❄️", class: "theme-winter", pType: "snowflake" },
        ];

        function getSeasonIndex() { return Math.floor((level - 1) / 10) % 4; }

        function updateSeasonTheme() {
            let sIdx = getSeasonIndex(); let season = seasons[sIdx];
            document.body.className = season.class;
            seasonBadge.textContent = `${season.name} (Lv ${sIdx * 10 + 1} - ${sIdx * 10 + 10})`;
            bgContainer.innerHTML = '';
            let amount = (season.class === "theme-winter") ? 40 : 25;
            for (let i = 0; i < amount; i++) {
                let p = document.createElement('div');
                p.className = `particle ${season.pType}`;
                p.style.left = Math.random() * 100 + 'vw';
                p.style.animationDuration = (Math.random() * 10 + 5) + 's';
                p.style.animationDelay = (Math.random() * 5) + 's';
                p.style.width = p.style.height = (Math.random() * 15 + 10) + 'px';
                if (season.pType === "leaf") p.style.background = ['#ea580c', '#eab308', '#dc2626'][Math.floor(Math.random() * 3)];
                else if (season.pType === "blossom") p.style.background = ['#fbcfe8', '#f472b6', '#ffffff'][Math.floor(Math.random() * 3)];
                bgContainer.appendChild(p);
            }
        }
        updateSeasonTheme();

        // Utilities
        function spawnFloatingText(text, x, y, type = '') {
            const el = document.createElement('div');
            el.className = `floating-text ${type}`; el.textContent = text;
            el.style.left = `${x}px`; el.style.top = `${y}px`;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 1200);
        }

        function showFeedback(message, type) {
            feedbackEl.innerHTML = message;
            feedbackEl.className = `feedback show ${type}`;
            setTimeout(() => feedbackEl.classList.remove('show'), 2500); // Ngắn lại
        }

        // Eco Plant Auto Farm Logic
        function startEcoPlantAutoFarm() {
            if (autoCoinInterval) clearInterval(autoCoinInterval);
            autoCoinInterval = setInterval(() => {
                if (ecoItemsOwned.plant) {
                    coins += 5;
                    coinValEl.textContent = coins;
                    saveGameData();
                    // Hiệu ứng bay (+5) trên thanh coin
                    spawnFloatingDmg("+5 🟡", 110, 50, "#fbbf24");
                }
            }, 10000); // 10s cho +5 vàng
        }

        // Logic
        function generateNewTrash() {
            if (isErrorModalOpen) return; // Nếu đang mở modal báo lỗi thì không sinh rác mới

            isSimulatingAI = true;
            itemEl.style.transform = "scale(0.8)"; itemEl.style.opacity = "0.3";
            laserEl.style.visibility = "visible"; scanningTextEl.style.visibility = "visible";
            nameEl.textContent = "HỆ THỐNG ĐANG QUÉT...";

            setTimeout(() => {
                const randIndex = Math.floor(Math.random() * trashData.length);
                currentTrash = trashData[randIndex];
                itemEl.textContent = currentTrash.emoji; nameEl.textContent = currentTrash.name;
                itemEl.style.transform = "scale(1)"; itemEl.style.opacity = "1";
                laserEl.style.visibility = "hidden"; scanningTextEl.style.visibility = "hidden";
                isSimulatingAI = false;
            }, 800);
        }

        // Error Modal Actions
        function openErrorModal(correctType) {
            isErrorModalOpen = true; // Dừng game
            let correctName = document.querySelector(`.bin[data-type="${correctType}"] .bin-title`).textContent;

            document.getElementById('errTrashName').textContent = currentTrash.name;
            document.getElementById('errBinName').textContent = correctName;
            document.getElementById('errReason').textContent = currentTrash.desc;

            errorModal.classList.add('active');
        }

        function closeErrorModal() {
            errorModal.classList.remove('active');
            isErrorModalOpen = false;

            // Xóa rác hiện tại ngay sau khi tắt thông báo để chơi tiếp
            itemEl.style.transform = `scale(0) translateY(100px)`;
            itemEl.style.opacity = "0";
            setTimeout(generateNewTrash, 300);
        }

                function checkResult(selectedType, eventX, eventY) {
            if (isSimulatingAI || !currentTrash || isErrorModalOpen) return;

            let isCorrect = selectedType === currentTrash.type;

            if (isCorrect) {
                if (typeof triggerQuestProgress === 'function') triggerQuestProgress('sortRgb');
                sfx.collect();
                streak++;
                let gainScore = 10 + Math.floor(streak * 0.5);
                let gainXp = 25;
                let gainCoin = (streak % 3 === 0) ? 10 : 2; 

                score += gainScore;

                if (ecoItemsOwned.notebook) gainXp = Math.floor(gainXp * 1.2);
                xp += gainXp;
                coins += gainCoin;

                let reqXp = 100 * Math.pow(1.5, level - 1);
                if (xp >= reqXp) {
                    xp = xp - reqXp;
                    fireConfettiOrigin(canvas.width / 2, canvas.height, 300, 2); 

                    let oldSeason = getSeasonIndex(); level++; levelBadge.textContent = level;
                    let newSeason = getSeasonIndex();

                    if (newSeason !== oldSeason) {
                        seasonFlash.classList.add('active');
                        setTimeout(() => updateSeasonTheme(), 500);
                        setTimeout(() => seasonFlash.classList.remove('active'), 1500);
                        showFeedback(`MÙA MỚI!<br>${seasons[newSeason].name}`, 'season-alert');
                    } else {
                        showFeedback(`✨ LÊN CẤP ${level}! ✨`, 'season-alert');
                    }
                } else {
                    fireConfettiOrigin(eventX, eventY, 50, 1.2);
                    showFeedback(`Tuyệt vời! +${gainScore} ĐIỂM`, 'success');
                }

                spawnFloatingText(`+${gainCoin} 🟡`, eventX, eventY - 60, 'coin');
                spawnFloatingText(`+${gainXp} XP`, eventX, eventY - 120, 'success');

                isSimulatingAI = true;
                itemEl.style.transform = `scale(0.1) rotate(360deg)`;
                itemEl.style.opacity = "0";
                setTimeout(generateNewTrash, typeof isTimeAttack !== 'undefined' && isTimeAttack ? 0 : 400);

            } else {
                sfx.wrong();
                streak = 0; score = Math.max(0, score - 5);
                mainContainer.classList.add('shake-active');
                setTimeout(() => mainContainer.classList.remove('shake-active'), 600);

                spawnFloatingText(`-5 ĐIỂM`, eventX, eventY, 'neg');

                if (typeof isTimeAttack !== 'undefined' && isTimeAttack) {
                    isSimulatingAI = true;
                    itemEl.style.transform = `scale(0.1) translateY(100px)`;
                    itemEl.style.opacity = "0";
                    setTimeout(generateNewTrash, 0);
                } else {
                    openErrorModal(currentTrash.type);
                }
            }

            scoreEl.textContent = score;
            streakEl.textContent = streak;
            coinValEl.textContent = coins;
            let reqXpUpdated = 100 * Math.pow(1.5, level - 1);
            xpBar.style.width = Math.min((xp / reqXpUpdated) * 100, 100) + '%';

            saveGameData(); 
        }

        // --- DRAG / DROP ---
        itemEl.addEventListener('dragstart', (e) => {
            if (isSimulatingAI || isErrorModalOpen) { e.preventDefault(); return; }
            if (e.dataTransfer) e.dataTransfer.setData('text/plain', 'trash');
        });

        bins.forEach(bin => {
            bin.addEventListener('dragover', (e) => { e.preventDefault(); bin.classList.add('drag-over'); });
            bin.addEventListener('dragleave', () => { bin.classList.remove('drag-over'); });
            bin.addEventListener('drop', (e) => {
                e.preventDefault(); bin.classList.remove('drag-over');
                let rect = bin.getBoundingClientRect();
                checkResult(bin.getAttribute('data-type'), rect.left + rect.width / 2, rect.top + rect.height / 3); // Nảy ra từ miệng thùng
            });
            bin.addEventListener('click', (e) => {
                let rect = bin.getBoundingClientRect();
                checkResult(bin.getAttribute('data-type'), rect.left + rect.width / 2, rect.top + rect.height / 3);
            });
        });

        // --- QUIZ LOGIC (MINI-GAME) ---
        let currentQuiz = null;

        function openQuiz() {
            document.getElementById('quizModal').classList.add('active');
            loadRandomQuiz();
        }

        function closeQuiz() {
            document.getElementById('quizModal').classList.remove('active');
        }

        function loadRandomQuiz() {
            currentQuiz = QUIZ_DB[Math.floor(Math.random() * QUIZ_DB.length)];
            document.getElementById('quizEmoji').textContent = currentQuiz.emoji;
            document.getElementById('quizQuestion').textContent = currentQuiz.q;
            document.getElementById('quizFact').style.display = 'none';

            const btnContainer = document.getElementById('quizOptions');
            btnContainer.innerHTML = '';

            currentQuiz.opts.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'buy-btn';
                btn.style.background = 'rgba(255, 255, 255, 0.1)';
                btn.style.color = 'white';
                btn.style.padding = '15px';
                btn.style.fontSize = '1.1rem';
                btn.textContent = opt;
                btn.onclick = () => answerQuiz(idx, btn, btnContainer);
                btnContainer.appendChild(btn);
            });
        }

        function answerQuiz(selectedIdx, btnElement, btnContainer) {
            Array.from(btnContainer.children).forEach(b => {
                b.onclick = null;
                b.style.cursor = 'not-allowed';
            });

            const factEl = document.getElementById('quizFact');

            if (selectedIdx === currentQuiz.ans) {
                if (typeof triggerQuestProgress === 'function') triggerQuestProgress('playQuiz');
                btnElement.style.background = 'var(--primary)';
                btnElement.style.transform = 'scale(1.05)';
                sfx.quizOk();
                let rewardCoins = 8;
                let rewardXP = 30;
                coins += rewardCoins;
                xp += rewardXP;
                coinValEl.textContent = coins;
                let reqXpUpdated = 100 * Math.pow(1.5, level - 1);
                xpBar.style.width = Math.min((xp / reqXpUpdated) * 100, 100) + '%';
                spawnFloatingText(`+${rewardCoins} 🟡`, window.innerWidth / 2, 80, 'coin');

                saveGameData(); // Save khi trúng Quiz

                factEl.textContent = "💡 Chính xác! " + currentQuiz.fact;
                factEl.style.color = '#a5b4fc';
                factEl.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            } else {
                btnElement.style.background = 'var(--hazardous)';
                btnContainer.children[currentQuiz.ans].style.background = 'var(--primary)';
                sfx.wrong();

                factEl.innerHTML = `<b style="color:#fca5a5">❌ Rất tiếc, bạn đã chọn sai!</b><br>💡 Lời giải: ` + currentQuiz.fact;
                factEl.style.color = '#fff';
                factEl.style.borderColor = '#ef4444';
            }

            factEl.style.display = 'block';

            setTimeout(() => {
                if (document.getElementById('quizModal').classList.contains('active')) {
                    loadRandomQuiz();
                }
            }, 4500); // Tăng thời gian chờ để user kịp đọc lý giải
        }

        // --- SHOP & COINS ---
        function openShop() { document.getElementById('shopModal').classList.add('active'); }
        function closeShop() { document.getElementById('shopModal').classList.remove('active'); }

        function buyAccessory(id, price) {
            if (boughtAccessories[id]) return;
            if (coins >= price) {
                coins -= price;
                coinValEl.textContent = coins;
                boughtAccessories[id] = true;

                let btn = document.getElementById(`btn-acc-${id}`);
                btn.innerHTML = "ĐÃ SỞ HỮU";
                btn.className = "buy-btn equipped";

                fireConfettiOrigin(window.innerWidth / 2, window.innerHeight / 2, 100, 2);
                showFeedback(`Cảm ơn bạn đã ủng hộ sản phẩm thân thiện môi trường!`, 'success');
            } else {
                alert(`Không đủ Tiền! Cần ${price} 🟡. Bạn thiếu ${price - coins} 🟡.`);
            }
        }

        function buyOrEquip(skinId, price) {
            if (unlockSkins[skinId]) {
                equipSkin(skinId);
            } else {
                if (coins >= price) {
                    coins -= price; coinValEl.textContent = coins;
                    unlockSkins[skinId] = true;
                    equipSkin(skinId);
                    saveGameData(); // Save khi đổi Skin
                    fireConfettiOrigin(canvas.width / 2, canvas.height / 2, 100, 2); // Chúc mừng mua
                    showFeedback(`ĐÃ MUA GIAO DIỆN THÀNH CÔNG!`, 'success')
                } else {
                    alert(`Không đủ Tiền! Cần ${price} 🟡. Bạn đang thiếu ${price - coins} 🟡 nữa.`);
                }
            }
        }

        function equipSkin(skinId) {
            currentSkin = skinId;
            scannerArea.className = "scanner-area";
            if (skinId !== 'default') scannerArea.classList.add(`skin-${skinId}`);

            ['default', 'neon', 'cyber', 'gold', 'ufo', 'eco'].forEach(id => {
                let btn = document.getElementById(`btn-skin-${id}`);
                if (id === currentSkin) {
                    btn.innerHTML = "ĐANG DÙNG"; btn.className = "buy-btn equipped";
                } else if (unlockSkins[id]) {
                    btn.innerHTML = "TRANG BỊ"; btn.className = "buy-btn";
                }
            });
        }

        // --- HỒ SƠ THÀNH TÍCH (PROFILE) ---
        function openProfile() {
            let profileModal = document.getElementById('profileModal');
            profileModal.classList.add('active');

            // Xử lý thống kê (Stats)
            document.getElementById('profileSkinIcon').textContent = PlayerSkinEmoji[currentSkin] || '👨‍🚀';
            document.getElementById('profileRankLabel').textContent = "Level " + level;
            document.getElementById('statScore').textContent = score;
            document.getElementById('statCoins').textContent = coins;
            document.getElementById('statStreak').textContent = streak;
            document.getElementById('statTqLevel').textContent = "Ải " + tqCurrentLevel;

            // Sinh danh hiệu theo level
            let title = "Tập Sự Thu Gom";
            if (level >= 5) title = "Thiếu Niên Sinh Thái";
            if (level >= 10) title = "Chiến Binh Môi Trường";
            if (level >= 20) title = "Kiến Trúc Sư Xanh";
            if (level >= 50) title = "Vị Thần Cứu Rỗi Trái Đất";
            document.getElementById('profileTitle').textContent = title;
        }

        function closeProfile() {
            document.getElementById('profileModal').classList.remove('active');
        }

        // ==========================================
        //  TRASHQUEST MINIGAME ENGINE (VANILLA JS)
        // ==========================================
        const tqContainer = document.getElementById('adventureContainer');
        const tqCanvas = document.getElementById('gameCanvas');
        const tqCtx = tqCanvas.getContext('2d');
        const tqHealthBar = document.getElementById('tqHealthBar');
        const tqHealthText = document.getElementById('tqHealthText');
        const tqCoinCount = document.getElementById('tqCoinCount');
        const tqObjective = document.getElementById('tqObjective');

        let isTrashQuestActive = false;
        let tqAnimFrame = null;
        let tqLastTime = 0;

        function startTrashQuest() {
            if (typeof triggerQuestProgress === 'function') triggerQuestProgress('playTq');
            isTrashQuestActive = true;
            tqContainer.style.display = 'flex';
            resizeTqCanvas();
            initTqLevel();
            tqAnimFrame = requestAnimationFrame(tqGameLoop);
        }

        function exitTrashQuest() {
            isTrashQuestActive = false;
            tqContainer.style.display = 'none';
            cancelAnimationFrame(tqAnimFrame);
        }

        function resizeTqCanvas() {
            tqCanvas.width = window.innerWidth;
            tqCanvas.height = window.innerHeight;
            tqCtx.imageSmoothingEnabled = false; // Chuẩn Pixel Art
        }
        window.addEventListener('resize', () => { if (isTrashQuestActive) resizeTqCanvas(); });

        // --- Hệ Thống Input ---
        const keys = {};
        window.addEventListener('keydown', e => { if (isTrashQuestActive) keys[e.key.toLowerCase()] = true; });
        window.addEventListener('keyup', e => { if (isTrashQuestActive) keys[e.key.toLowerCase()] = false; });

        // Mobile Virtual Joystick Logic
        const joyZone = document.getElementById('joystickZone');
        const joyKnob = document.getElementById('joystickKnob');
        let joyActive = false;
        let joyVector = { x: 0, y: 0 };
        let joyCenter = { x: 0, y: 0 };

        joyZone.addEventListener('touchstart', (e) => {
            joyActive = true;
            let rect = joyZone.getBoundingClientRect();
            joyCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
            updateJoystick(e.touches[0]);
        });
        joyZone.addEventListener('touchmove', (e) => {
            if (joyActive) updateJoystick(e.touches[0]);
        });
        joyZone.addEventListener('touchend', () => {
            joyActive = false; joyVector = { x: 0, y: 0 };
            joyKnob.style.transform = `translate(0px, 0px)`;
        });

        function updateJoystick(touch) {
            let dx = touch.clientX - joyCenter.x;
            let dy = touch.clientY - joyCenter.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            let maxDist = 45; // Bán kính di chuyển của núm
            if (dist > maxDist) {
                dx = (dx / dist) * maxDist;
                dy = (dy / dist) * maxDist;
            }
            joyKnob.style.transform = `translate(${dx}px, ${dy}px)`;
            joyVector.x = dx / maxDist; // Chuẩn hóa -1 đến 1
            joyVector.y = dy / maxDist;
        }

        // --- Player Entity ---
        const player = {
            x: 0, y: 0,
            width: 32, height: 32,
            speed: 250, // pixel per second
            hp: 100, maxHp: 100,
            dir: 1, // 1: phải, -1: trái
            state: 'idle',
            dmg: 25,
            attackTimer: 0,
            pickupTimer: 0
        };

        const PlayerSkinEmoji = {
            'default': '👨‍🚀', 'neon': '🥷', 'cyber': '🤖',
            'gold': '🦸‍♂️', 'ufo': '👽', 'eco': '🧝'
        };

        let tqCamera = { x: 0, y: 0 };

        let tqMapTrashes = [];
        let tqMapDecor = []; // Phụ kiện bản đồ thiên nhiên
        let tqProjectiles = []; // Chứa mũi tên (Cung thủ)
        let tqTotalTrashCount = 0;
        let tqCollectedTrash = 0;
        let tqBoss = null;
        let tqMiniMonsters = []; // Quái vật nhỏ xuất hiện khi dọn rác
        let monsterSpawnTimer = 0;
        let dmgTexts = []; // Damage nổi
        let tqCurrentLevel = 1;

        // === MAP CONSTANTS ===
        const MAP_SIZE = 4000; // Kích cỡ bản đồ
        const MAP_HALF = MAP_SIZE / 2;

        // Bảng màu skin cho nhân vật (theo skin mua trong shop)
        const PlayerSkinColors = {
            'default': { body: '#4a90d9', head: '#fdd9b5', outline: '#2563eb' },
            'neon': { body: '#1a1a2e', head: '#e0e0e0', outline: '#f43f5e' },
            'cyber': { body: '#06b6d4', head: '#c0c0c0', outline: '#0891b2' },
            'gold': { body: '#f59e0b', head: '#fdd9b5', outline: '#d97706' },
            'ufo': { body: '#22c55e', head: '#a3e635', outline: '#16a34a' },
            'eco': { body: '#10b981', head: '#fdd9b5', outline: '#059669' }
        };

        // Animation timer cho nhân vật
        let playerAnimTimer = 0;

        // === HỆ THỐNG TÚI PHÂN LOẠI ===
        let bagCounts = { organic: 0, recycle: 0, inorganic: 0, hazardous: 0 };
        let bagOpen = false;
        let bagAutoHideTimer = 0;
        let flyToBagItems = []; // Items bay vào túi

        function toggleBagInventory() {
            bagOpen = !bagOpen;
            document.getElementById('bagInventory').style.display = bagOpen ? 'flex' : 'none';
            document.getElementById('btnToggleBag').textContent = bagOpen ? '❌ Đóng Túi' : '🎒 Túi Phân Loại';
        }

        function updateBagUI() {
            ['organic', 'recycle', 'inorganic', 'hazardous'].forEach(type => {
                let el = document.getElementById('bagCount-' + type);
                if (el) el.textContent = bagCounts[type];
            });
        }

        function flashBag(type) {
            let bagEl = document.getElementById('bag-' + type);
            if (!bagEl) return;
            bagEl.style.transition = 'transform 0.15s';
            bagEl.style.transform = 'scale(1.3)';
            setTimeout(() => { bagEl.style.transform = 'scale(1)'; }, 200);
        }

        function spawnFlyToBag(worldX, worldY, type) {
            // Chuyển world pos sang screen pos
            let screenX = worldX - tqCamera.x;
            let screenY = worldY - tqCamera.y;
            let typeInfo = TRASH_TYPE_COLORS[type] || TRASH_TYPE_COLORS['organic'];

            // Tạo DOM element bay từ vị trí rác tới túi
            let flyEl = document.createElement('div');
            flyEl.style.cssText = `
                position: fixed; left: ${screenX}px; top: ${screenY}px;
                width: 30px; height: 30px; border-radius: 8px;
                background: ${typeInfo.bg}; border: 2px solid ${typeInfo.border};
                display: flex; align-items: center; justify-content: center;
                font-size: 16px; z-index: 10000;
                box-shadow: 0 0 15px ${typeInfo.glow};
                transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
                pointer-events: none;
            `;
            flyEl.textContent = typeInfo.icon;
            document.body.appendChild(flyEl);

            // Tìm vị trí túi đích
            let bagEl = document.getElementById('bag-' + type);
            let targetX = window.innerWidth / 2;
            let targetY = window.innerHeight - 160;
            if (bagEl) {
                let rect = bagEl.getBoundingClientRect();
                targetX = rect.left + rect.width / 2;
                targetY = rect.top + rect.height / 2;
            }

            // Bay tới túi sau 1 frame
            requestAnimationFrame(() => {
                flyEl.style.left = targetX + 'px';
                flyEl.style.top = targetY + 'px';
                flyEl.style.transform = 'scale(0.3)';
                flyEl.style.opacity = '0.5';
            });

            // Xóa sau khi bay xong
            setTimeout(() => {
                flyEl.remove();
                flashBag(type);
            }, 650);
        }

        function playTypeSound(type) {
            if (type === 'organic') sfx.pickupOrganic();
            else if (type === 'recycle') sfx.pickupRecycle();
            else if (type === 'inorganic') sfx.pickupInorganic();
            else if (type === 'hazardous') sfx.pickupHazard();
            else sfx.pickup();
        }

        function initTqLevel() {
            player.x = tqCanvas.width / 2;
            player.y = tqCanvas.height / 2;
            player.hp = player.maxHp;
            coinValEl.textContent = coins;

            tqMapTrashes = [];
            tqProjectiles = [];
            tqMapDecor = [];
            tqBoss = null;
            dmgTexts = [];
            tqCollectedTrash = 0;
            playerAnimTimer = 0;
            tqMiniMonsters = [];
            monsterSpawnTimer = 0;
            bagCounts = { organic: 0, recycle: 0, inorganic: 0, hazardous: 0 };
            updateBagUI();
            // Hiện túi tự động
            if (!bagOpen) { document.getElementById('bagInventory').style.display = 'flex'; bagOpen = true; document.getElementById('btnToggleBag').textContent = '❌ Đóng Túi'; }

            // Generate map decor kiểu surviv.io (Canvas shapes)
            const decorTypes = ['tree', 'rock', 'bush', 'grass', 'puddle'];
            for (let i = 0; i < 80; i++) {
                let type = decorTypes[Math.floor(Math.random() * decorTypes.length)];
                tqMapDecor.push({
                    x: Math.random() * MAP_SIZE - MAP_HALF,
                    y: Math.random() * MAP_SIZE - MAP_HALF,
                    type: type,
                    scale: 0.7 + Math.random() * 0.6,
                    rot: Math.random() * Math.PI * 2
                });
            }
            // Thêm nhiều cỏ nhỏ
            for (let i = 0; i < 120; i++) {
                tqMapDecor.push({
                    x: Math.random() * MAP_SIZE - MAP_HALF,
                    y: Math.random() * MAP_SIZE - MAP_HALF,
                    type: 'grass',
                    scale: 0.3 + Math.random() * 0.4,
                    rot: Math.random() * Math.PI * 2
                });
            }

            tqTotalTrashCount = tqCurrentLevel * 10;
            updateTqHUD();

            let initialSpawn = Math.min(tqTotalTrashCount, 15);
            for (let i = 0; i < initialSpawn; i++) {
                spawnMapTrash();
            }
            updateTqObjective();
        }

        function spawnFloatingDmg(txt, x, y, color = "#ef4444") {
            dmgTexts.push({ text: txt, x, y, life: 1.0, color });
        }

        // Tấn Công Logic
        const btnAttack = document.getElementById('btnAttack');
        btnAttack.addEventListener('touchstart', (e) => { e.preventDefault(); triggerAttack(); });
        btnAttack.addEventListener('mousedown', (e) => { e.preventDefault(); triggerAttack(); });

        window.addEventListener('keydown', e => {
            if (isTrashQuestActive && e.key.toLowerCase() === 'j') triggerAttack();
        });

        function triggerAttack() {
            if (player.attackTimer > 0) return;
            player.attackTimer = 0.4; // Cooldown bắn tên

            sfx.wrong(); // Tiếng bắn tên

            let target = null;
            let minDist = Infinity;

            // Kiểm tra Boss
            if (tqBoss && tqBoss.hp > 0) {
                let dist = Math.sqrt((tqBoss.x - player.x) ** 2 + (tqBoss.y - player.y) ** 2);
                if (dist < minDist) {
                    minDist = dist;
                    target = tqBoss;
                }
            }

            // Kiểm tra Quái Nhỏ
            if (tqMiniMonsters && tqMiniMonsters.length > 0) {
                for (let i = 0; i < tqMiniMonsters.length; i++) {
                    let m = tqMiniMonsters[i];
                    if (m && m.hp > 0) {
                        let dist = Math.sqrt((m.x - player.x) ** 2 + (m.y - player.y) ** 2);
                        if (dist < minDist) {
                            minDist = dist;
                            target = m;
                        }
                    }
                }
            }

            // Tìm mục tiêu bay tới nếu bấm tự động, hoặc bắn chĩa ra phía mặt
            let vx = player.dir * 400; // Mặc định bay ngang 400px/s
            let vy = 0;

            if (target) {
                // Hướng thẳng tới mục tiêu gần nhất
                let dx = target.x - player.x;
                let dy = target.y - player.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 0) {
                    vx = (dx / dist) * 500;
                    vy = (dy / dist) * 500;
                    // Bẻ dir nhân vật quay qua mục tiêu
                    player.dir = dx < 0 ? -1 : 1;
                }
            }

            // Spawn Mũi Tên
            tqProjectiles.push({
                x: player.x,
                y: player.y - 10, // ngang người
                vx: vx, vy: vy,
                life: 2.0, // Tồn tại 2s để tăng tầm xa
                dmg: player.dmg
            });
        }

        function updateTqHUD() {
            tqHealthBar.style.width = (player.hp / player.maxHp) * 100 + "%";
            tqHealthText.textContent = `${player.hp} / ${player.maxHp} HP`;
            tqCoinCount.textContent = coins;
            btnInteract.textContent = `💊 (I) x${tqPotions}`;
        }

        const bossNames = [
            "Chúa Tể Nilon", "Đại Ma Vương Nhựa", "Cỗ Máy Phế Liệu",
            "Kẻ Hủy Diệt Xanh", "Tinh Linh Độc Hại", "Thỏ Rác Đột Biến"
        ];

        function updateTqObjective() {
            tqObjective.textContent = `[Level ${tqCurrentLevel}] Mục tiêu dọn rác: (${tqCollectedTrash}/${tqTotalTrashCount})`;
            if (tqCollectedTrash >= tqTotalTrashCount && !tqBoss) {
                tqObjective.textContent = "BÁO ĐỘNG: QUÁI VẬT RÁC XUẤT HIỆN!!! (Dùng phím J để Đánh)";
                tqObjective.style.color = "#ef4444";
                tqObjective.style.borderColor = "#ef4444";

                // Vén màn boss
                tqMapTrashes = []; // Xoá sạch rác con

                let randomName = bossNames[Math.floor(Math.random() * bossNames.length)];

                // Spawn Boss ngẫu nhiên gần người chơi
                tqBoss = {
                    x: player.x, y: player.y - 300,
                    name: `[LV.${tqCurrentLevel}] ${randomName}`,
                    hp: 500 * tqCurrentLevel, maxHp: 500 * tqCurrentLevel, // HP boss tăng theo level
                    speed: 150 + (tqCurrentLevel * 10), size: 64,
                    hitTimer: 0, attackTimer: 0
                };
                tqContainer.classList.add('shake-active');
                setTimeout(() => tqContainer.classList.remove('shake-active'), 500);
            }
        }

        function spawnMapTrash() {
            const randDist = Math.random() * 1500 + 100;
            const randAngle = Math.random() * Math.PI * 2;

            const randTrashItem = trashData[Math.floor(Math.random() * trashData.length)];
            tqMapTrashes.push({
                x: player.x + Math.cos(randAngle) * randDist,
                y: player.y + Math.sin(randAngle) * randDist,
                size: 24,
                emoji: randTrashItem.emoji,
                type: randTrashItem.type,
                name: randTrashItem.name
            });
        }

        // --- Vòng Lặp Chính ---
        function tqGameLoop(timestamp) {
            if (!isTrashQuestActive) return;
            const dt = (timestamp - tqLastTime) / 1000;
            tqLastTime = timestamp;

            updateTqLogic(dt);
            renderTqGraphics();

            tqAnimFrame = requestAnimationFrame(tqGameLoop);
        }

        // Logic Mua Vũ Khí & Potion
        let tqPotions = 3;
        let tqWeaponBought = { 'iron': false, 'diamond': false, 'boots': false, 'magnet': false, 'armor': false };
        function buyWeapon(id, price, newDmg) {
            if (tqWeaponBought[id]) return alert("Bạn đã sở hữu vũ khí này rồi!");
            if (coins >= price) {
                coins -= price; coinValEl.textContent = coins;
                tqWeaponBought[id] = true;
                player.dmg = newDmg;
                document.getElementById('btn-weap-' + id).textContent = "ĐÃ TRANG BỊ";
                document.getElementById('btn-weap-' + id).className = "buy-btn equipped";
                fireConfettiOrigin(window.innerWidth / 2, window.innerHeight / 2, 100, 2);
                updateTqHUD();
                saveGameData();
            } else {
                alert("Thiếu vàng! Cần " + price + " 🟡");
            }
        }
        function buyPotion(price) {
            if (tqPotions >= 5) return alert("Đã đầy 5 bình nước bù khoáng!");
            if (coins >= price) {
                coins -= price; coinValEl.textContent = coins;
                tqPotions++;
                updateTqHUD();
                showFeedback("Đã mua 1 bình Nước Bù Khoáng!", "success");
            } else {
                alert("Thiếu vàng! Cần " + price + " 🟡");
            }
        }

        function buyBoots(price) {
            if (tqWeaponBought['boots']) return alert("Bạn đã sở hữu Giày Sinh Học rồi!");
            if (coins >= price) {
                coins -= price; coinValEl.textContent = coins;
                tqWeaponBought['boots'] = true;
                player.speed = 350; // Tăng tốc lên 350 (gốc là 250)
                document.getElementById('btn-weap-boots').textContent = "ĐÃ TRANG BỊ";
                document.getElementById('btn-weap-boots').className = "buy-btn equipped";
                fireConfettiOrigin(window.innerWidth / 2, window.innerHeight / 2, 100, 2);
                saveGameData();
            } else {
                alert("Thiếu vàng! Cần " + price + " 🟡");
            }
        }

        function buyMagnet(price) {
            if (tqWeaponBought['magnet']) return alert("Bạn đã sở hữu Găng Tay Nam Châm rồi!");
            if (coins >= price) {
                coins -= price; coinValEl.textContent = coins;
                tqWeaponBought['magnet'] = true;
                document.getElementById('btn-weap-magnet').textContent = "ĐÃ TRANG BỊ";
                document.getElementById('btn-weap-magnet').className = "buy-btn equipped";
                fireConfettiOrigin(window.innerWidth / 2, window.innerHeight / 2, 100, 2);
                saveGameData();
            } else {
                alert("Thiếu vàng! Cần " + price + " 🟡");
            }
        }

        function buyArmor(price) {
            if (tqWeaponBought['armor']) return alert("Bạn đã sở hữu Áo Giáp Bã Rau Củ rồi!");
            if (coins >= price) {
                coins -= price; coinValEl.textContent = coins;
                tqWeaponBought['armor'] = true;
                player.maxHp = 150; // Tăng máu tối đa
                player.hp = 150; // Hồi full máu mới
                document.getElementById('btn-weap-armor').textContent = "ĐÃ TRANG BỊ";
                document.getElementById('btn-weap-armor').className = "buy-btn equipped";
                fireConfettiOrigin(window.innerWidth / 2, window.innerHeight / 2, 100, 2);
                updateTqHUD();
                saveGameData();
            } else {
                alert("Thiếu vàng! Cần " + price + " 🟡");
            }
        }

        // Skill F Logic (Shockwave)
        let skillCooldown = 0;
        const SKILL_MAX_CD = 10; // 10s cooldown
        const btnSkill = document.getElementById('btnSkill');
        const btnSkillCd = document.getElementById('btnSkillCd');

        btnSkill.addEventListener('touchstart', (e) => { e.preventDefault(); castSkill(); });
        btnSkill.addEventListener('mousedown', (e) => { e.preventDefault(); castSkill(); });
        window.addEventListener('keydown', e => { if (isTrashQuestActive && e.key.toLowerCase() === 'f') castSkill(); });

        let skillAuraTimer = 0; // Để render vòng nổ
        function castSkill() {
            if (skillCooldown > 0) return;
            skillCooldown = SKILL_MAX_CD;
            skillAuraTimer = 0.5; // Sáng 0.5s

            sfx.wrong(); setTimeout(sfx.wrong, 100); // Tiếng nổ đúp

            // Check Boss AOE trong bán kính 200px
            if (tqBoss && tqBoss.hp > 0) {
                let dist = Math.sqrt((tqBoss.x - player.x) ** 2 + (tqBoss.y - player.y) ** 2);
                if (dist <= 250) {
                    let skillDmg = player.dmg * 3; // Nổ x3 damage
                    tqBoss.hp -= skillDmg;
                    tqBoss.hitTimer = 0.5;

                    // Đẩy lùi boss
                    let dx = tqBoss.x - player.x; let dy = tqBoss.y - player.y;
                    tqBoss.x += (dx / dist) * 100; tqBoss.y += (dy / dist) * 100;

                    spawnFloatingDmg(`CHÍ MẠNG -${skillDmg}`, tqBoss.x, tqBoss.y - 60, "#a855f7");

                    if (tqBoss.hp <= 0) bossDied();
                }
            }

            // Skill AOE vs Mini Monsters
            let skillDmgM = player.dmg * 3;
            for (let i = tqMiniMonsters.length - 1; i >= 0; i--) {
                let m = tqMiniMonsters[i];
                let d = Math.sqrt((m.x - player.x) ** 2 + (m.y - player.y) ** 2);
                if (d <= 250) {
                    m.hp -= skillDmgM;
                    m.hitTimer = 0.5;
                    let dx = m.x - player.x, dy = m.y - player.y;
                    m.x += (dx / d) * 60; m.y += (dy / d) * 60;
                    spawnFloatingDmg(`-${skillDmgM}`, m.x, m.y - 30, '#a855f7');
                    if (m.hp <= 0) {
                        sfx.collect();
                        let monsterReward = 10;
                        if (ecoItemsOwned.lamp) monsterReward *= 2; // x2 Vàng rớt
                        coins += monsterReward; coinValEl.textContent = coins;
                        spawnFloatingDmg(`+${monsterReward} 🟡`, m.x, m.y - 40, '#fbbf24');
                        spawnPickupParticles(m.x, m.y, 'hazardous');
                        tqMiniMonsters.splice(i, 1);
                    }
                }
            }
        }

        // Potion I Logic
        const btnInteract = document.getElementById('btnInteract');
        btnInteract.addEventListener('touchstart', (e) => { e.preventDefault(); usePotion(); });
        btnInteract.addEventListener('mousedown', (e) => { e.preventDefault(); usePotion(); });
        window.addEventListener('keydown', e => { if (isTrashQuestActive && e.key.toLowerCase() === 'i') usePotion(); });

        function usePotion() {
            if (tqPotions > 0 && player.hp < player.maxHp) {
                tqPotions--;
                player.hp = Math.min(player.maxHp, player.hp + 50);
                sfx.quizOk(); // Tiếng uống
                spawnFloatingDmg("+50 HP", player.x, player.y - 40, "#10b981");
                updateTqHUD();
                saveGameData();
            }
        }

        function bossDied() {
            tqBoss = null;
            fireConfettiOrigin(tqCanvas.width / 2, tqCanvas.height / 2, 200, 3);
            sfx.collect();
            let reward = 500 * tqCurrentLevel;
            if (ecoItemsOwned.lamp) reward *= 2; // Đèn Lồng x2 Tỷ lệ roi Tiền Boss

            coins += reward;
            coinValEl.textContent = coins;
            tqCurrentLevel++; // Lên Level cho lần chơi kế
            updateTqHUD();
            tqObjective.textContent = `🏆 BẠN ĐÃ QUA MÀN! NHẬN THƯỞNG +${reward} Vàng!`;
            tqObjective.style.color = "#fbbf24"; tqObjective.style.borderColor = "#fbbf24";

            saveGameData();

            setTimeout(() => {
                let p = confirm("Tuyệt vời! Bạn có muốn đi tiếp sang Level " + tqCurrentLevel + " ngay không?\n(Bạn cũng có thể ra Menu chính để mua nâng cấp trong Shop)");
                if (p) {
                    initTqLevel(); // Chơi tiếp luôn
                } else {
                    exitTrashQuest();
                }
            }, 3000);
        }

        function updateTqLogic(dt) {
            if (dt > 0.1) dt = 0.016;

            // Cập nhật animation timer
            playerAnimTimer += dt;

            if (player.attackTimer > 0) player.attackTimer -= dt;
            if (player.pickupTimer > 0) player.pickupTimer -= dt;
            if (skillAuraTimer > 0) skillAuraTimer -= dt;

            // Auto-hide bag timer
            if (bagAutoHideTimer > 0) {
                bagAutoHideTimer -= dt;
                if (bagAutoHideTimer <= 0 && !bagOpen) {
                    document.getElementById('bagInventory').style.display = 'none';
                }
            }

            if (skillCooldown > 0) {
                skillCooldown -= dt;
                btnSkillCd.style.height = (skillCooldown / SKILL_MAX_CD * 100) + "%";
            } else {
                btnSkillCd.style.height = "0%";
            }

            // Movement
            let moveX = 0, moveY = 0;
            if (keys['w'] || keys['arrowup']) moveY -= 1;
            if (keys['s'] || keys['arrowdown']) moveY += 1;
            if (keys['a'] || keys['arrowleft']) moveX -= 1;
            if (keys['d'] || keys['arrowright']) moveX += 1;

            if (joyActive) { moveX = joyVector.x; moveY = joyVector.y; }

            let mag = Math.sqrt(moveX * moveX + moveY * moveY);
            if (mag > 0) {
                moveX /= mag; moveY /= mag;
                player.state = 'run';
                if (moveX > 0) player.dir = 1;
                else if (moveX < 0) player.dir = -1;
            } else {
                player.state = 'idle';
            }

            // Khoá di chuyển nhẹ lúc đang chém (0.3) hoặc đang gồng skill (0.1)
            let currentSpeed = player.speed;
            if (player.attackTimer > 0) currentSpeed *= 0.3;
            if (skillAuraTimer > 0) currentSpeed *= 0.1;

            player.x += moveX * currentSpeed * dt;
            player.y += moveY * currentSpeed * dt;

            // Camera follow
            let targetCamX = player.x - tqCanvas.width / 2;
            let targetCamY = player.y - tqCanvas.height / 2;
            tqCamera.x += (targetCamX - tqCamera.x) * 5 * dt;
            tqCamera.y += (targetCamY - tqCamera.y) * 5 * dt;

            // Boss AI Logic
            if (tqBoss && tqBoss.hp > 0) {
                if (tqBoss.hitTimer > 0) tqBoss.hitTimer -= dt;
                if (tqBoss.attackTimer > 0) tqBoss.attackTimer -= dt;

                let dx = player.x - tqBoss.x;
                let dy = player.y - tqBoss.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > 40) {
                    tqBoss.x += (dx / dist) * tqBoss.speed * dt;
                    tqBoss.y += (dy / dist) * tqBoss.speed * dt;
                } else {
                    if (tqBoss.attackTimer <= 0) {
                        tqBoss.attackTimer = 1.0;
                        let bossDmg = 20;
                        if (ecoItemsOwned.tote) bossDmg = Math.floor(bossDmg * 0.8); // Giảm 20% sát thương
                        player.hp -= bossDmg;
                        updateTqHUD();
                        spawnFloatingDmg(`-${bossDmg}`, player.x, player.y - 40, "#b91c1c");
                        if (player.hp <= 0) {
                            tqObjective.textContent = "Bạn đã hy sinh!!! Game Over";
                            player.hp = 0;
                            setTimeout(exitTrashQuest, 2000);
                        }
                    }
                }
            }

            // === MINI MONSTERS AI ===
            // Spawn quái nhỏ định kỳ (khi chưa có boss)
            if (!tqBoss && tqMiniMonsters.length < 5) { // Tăng tối đa lên 5 con
                monsterSpawnTimer -= dt;
                if (monsterSpawnTimer <= 0) {
                    monsterSpawnTimer = 4 + Math.random() * 4; // Mỗi 4-8s spawn 1 con (giảm thời gian)
                    let angle = Math.random() * Math.PI * 2;
                    let dist = 500 + Math.random() * 400;
                    let monsterNames = ['🐀 Chuột Rác', '🧟 Zombie Rác', '🐛 Bọ Rác', '🦇 Dơi Rác', '🐍 Rắn Rác'];
                    let monsterColors = ['#6B7280', '#7C3AED', '#059669', '#B91C1C', '#D97706'];
                    let idx = Math.floor(Math.random() * monsterNames.length);

                    // Gán type tùy ý cho từng con để vẽ hình dạng khác nhau
                    let types = ['slime', 'spider', 'bat', 'worm', 'roller'];
                    let mType = types[Math.floor(Math.random() * types.length)];

                    tqMiniMonsters.push({
                        x: player.x + Math.cos(angle) * dist,
                        y: player.y + Math.sin(angle) * dist,
                        hp: 50 + tqCurrentLevel * 15,
                        maxHp: 50 + tqCurrentLevel * 15,
                        speed: 80 + tqCurrentLevel * 10,
                        dmg: 10,
                        attackTimer: 0,
                        hitTimer: 0,
                        name: monsterNames[idx],
                        color: monsterColors[idx],
                        type: mType,       // <-- Loại hình (Shape)
                        animTime: Math.random() * 100 // <-- Timer riêng lẻ cho animation của từng con 
                    });
                }
            }

            // Cập nhật mini monsters
            for (let i = tqMiniMonsters.length - 1; i >= 0; i--) {
                let m = tqMiniMonsters[i];
                if (m.hitTimer > 0) m.hitTimer -= dt;
                if (m.attackTimer > 0) m.attackTimer -= dt;

                let dx = player.x - m.x;
                let dy = player.y - m.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > 30) {
                    m.x += (dx / dist) * m.speed * dt;
                    m.y += (dy / dist) * m.speed * dt;
                } else if (m.attackTimer <= 0) {
                    m.attackTimer = 1.5;
                    let monsterDmg = m.dmg;
                    if (ecoItemsOwned.tote) monsterDmg = Math.floor(monsterDmg * 0.8); // Giảm 20% sát thương
                    player.hp -= monsterDmg;
                    updateTqHUD();
                    spawnFloatingDmg(`-${monsterDmg}`, player.x, player.y - 30, '#ef4444');
                    if (player.hp <= 0) {
                        tqObjective.textContent = "Bạn đã hy sinh!!! Game Over";
                        player.hp = 0;
                        setTimeout(exitTrashQuest, 2000);
                    }
                }
            }

            // Cập nhật Dmg Texts nổi
            for (let i = dmgTexts.length - 1; i >= 0; i--) {
                dmgTexts[i].y -= 50 * dt;
                dmgTexts[i].life -= dt;
                if (dmgTexts[i].life <= 0) dmgTexts.splice(i, 1);
            }

            // Mũi bay (Archery Projectiles)
            for (let i = tqProjectiles.length - 1; i >= 0; i--) {
                let p = tqProjectiles[i];
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.life -= dt;

                let hitTarget = false;

                // Va chạm boss
                if (tqBoss && tqBoss.hp > 0) {
                    let d = Math.sqrt((p.x - tqBoss.x) ** 2 + (p.y - tqBoss.y) ** 2);
                    if (d < 40) {
                        tqBoss.hp -= p.dmg;
                        tqBoss.hitTimer = 0.2;
                        spawnFloatingDmg("-" + p.dmg, tqBoss.x + (Math.random() * 40 - 20), tqBoss.y - 40 - (Math.random() * 20), "#ef4444");
                        hitTarget = true;
                        if (tqBoss.hp <= 0) bossDied();
                    }
                }

                // Va chạm mini monsters
                if (!hitTarget) {
                    for (let j = tqMiniMonsters.length - 1; j >= 0; j--) {
                        let m = tqMiniMonsters[j];
                        let d = Math.sqrt((p.x - m.x) ** 2 + (p.y - m.y) ** 2);
                        if (d < 25) {
                            m.hp -= p.dmg;
                            m.hitTimer = 0.2;
                            // Đẩy lùi
                            let kx = m.x - player.x, ky = m.y - player.y;
                            let kd = Math.sqrt(kx * kx + ky * ky) || 1;
                            m.x += (kx / kd) * 30; m.y += (ky / kd) * 30;
                            spawnFloatingDmg('-' + p.dmg, m.x, m.y - 25, '#f59e0b');
                            hitTarget = true;
                            if (m.hp <= 0) {
                                sfx.collect();
                                coins += 10; coinValEl.textContent = coins;
                                spawnFloatingDmg('+10 🟡', m.x, m.y - 35, '#fbbf24');
                                spawnPickupParticles(m.x, m.y, 'hazardous');
                                tqMiniMonsters.splice(j, 1);
                            }
                            break;
                        }
                    }
                }

                if (p.life <= 0 || hitTarget) {
                    tqProjectiles.splice(i, 1);
                }
            }

            // Collision vs Trash
            for (let i = tqMapTrashes.length - 1; i >= 0; i--) {
                let t = tqMapTrashes[i];
                let dist = Math.sqrt((player.x - t.x) ** 2 + (player.y - t.y) ** 2);

                // Nam châm hút rác (Magnet effect)
                if (tqWeaponBought['magnet'] && dist < 200) {
                    let mx = (player.x - t.x) / dist;
                    let my = (player.y - t.y) / dist;
                    t.x -= mx * 150 * dt; // Kéo rác về phía người (player - trash -> direction from trash to player)
                    t.y -= my * 150 * dt;
                    dist = Math.sqrt((player.x - t.x) ** 2 + (player.y - t.y) ** 2); // Cập nhật lại khoảng cách sau khi di chuyển
                }

                if (dist < 30) {
                    let removedTrash = tqMapTrashes.splice(i, 1)[0];

                    // Âm thanh theo loại rác
                    playTypeSound(removedTrash.type);

                    coins += 5; coinValEl.textContent = coins;

                    // Hiệu ứng particle burst
                    spawnPickupParticles(removedTrash.x, removedTrash.y, removedTrash.type);
                    spawnFloatingDmg('+5 🟡', removedTrash.x, removedTrash.y - 20, '#fbbf24');

                    // Cập nhật túi phân loại
                    if (removedTrash.type && bagCounts[removedTrash.type] !== undefined) {
                        bagCounts[removedTrash.type]++;
                        updateBagUI();
                    }

                    // Animation bay vào túi
                    spawnFlyToBag(removedTrash.x, removedTrash.y, removedTrash.type || 'organic');

                    // Player cúi xuống nhặt (pickup animation)
                    player.pickupTimer = 0.3;

                    // Hiện túi nếu đang ẩn
                    if (!bagOpen) {
                        document.getElementById('bagInventory').style.display = 'flex';
                        bagAutoHideTimer = 2.0;
                    }

                    if (tqCollectedTrash < tqTotalTrashCount) {
                        tqCollectedTrash++;
                        updateTqHUD();
                        updateTqObjective();

                        // Nếu vẫn chưa đủ mục tiêu thì mọc rác ra sau đúng 0.5s (500ms)
                        if (tqCollectedTrash + tqMapTrashes.length < tqTotalTrashCount) {
                            setTimeout(spawnMapTrash, 500);
                        }
                    }
                }
            }

            // Cập nhật pickup particles
            for (let i = pickupParticles.length - 1; i >= 0; i--) {
                let p = pickupParticles[i];
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.vy += 60 * dt; // gravity nhẹ
                p.life -= dt;
                if (p.life <= 0) pickupParticles.splice(i, 1);
            }
        }

        // === HÀM VẼ DECOR (CÂY, ĐÁ, BỤI CỎ, NƯỚC) ===
        function drawDecor(ctx, d) {
            ctx.save();
            ctx.translate(d.x, d.y);
            let s = d.scale;

            if (d.type === 'tree') {
                // Bóng
                ctx.fillStyle = 'rgba(0,0,0,0.18)';
                ctx.beginPath(); ctx.ellipse(5, 25 * s, 22 * s, 10 * s, 0, 0, Math.PI * 2); ctx.fill();
                // Thân cây
                ctx.fillStyle = '#5D4037';
                ctx.fillRect(-4 * s, -10 * s, 8 * s, 35 * s);
                // Tán cây
                ctx.fillStyle = '#2E7D32';
                ctx.beginPath(); ctx.arc(0, -18 * s, 20 * s, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#388E3C';
                ctx.beginPath(); ctx.arc(-8 * s, -12 * s, 14 * s, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(10 * s, -14 * s, 12 * s, 0, Math.PI * 2); ctx.fill();
                // Highlight
                ctx.fillStyle = 'rgba(255,255,255,0.08)';
                ctx.beginPath(); ctx.arc(-3 * s, -22 * s, 8 * s, 0, Math.PI * 2); ctx.fill();
            } else if (d.type === 'rock') {
                ctx.fillStyle = 'rgba(0,0,0,0.15)';
                ctx.beginPath(); ctx.ellipse(3, 12 * s, 16 * s, 6 * s, 0, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#78909C';
                ctx.beginPath();
                ctx.moveTo(-15 * s, 5 * s); ctx.lineTo(-10 * s, -12 * s); ctx.lineTo(5 * s, -15 * s);
                ctx.lineTo(16 * s, -5 * s); ctx.lineTo(14 * s, 8 * s); ctx.lineTo(-12 * s, 10 * s);
                ctx.closePath(); ctx.fill();
                ctx.fillStyle = '#90A4AE';
                ctx.beginPath();
                ctx.moveTo(-8 * s, -8 * s); ctx.lineTo(3 * s, -13 * s); ctx.lineTo(12 * s, -3 * s);
                ctx.lineTo(5 * s, 2 * s); ctx.closePath(); ctx.fill();
            } else if (d.type === 'bush') {
                ctx.fillStyle = 'rgba(0,0,0,0.12)';
                ctx.beginPath(); ctx.ellipse(0, 8 * s, 15 * s, 5 * s, 0, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#43A047';
                ctx.beginPath(); ctx.arc(0, -2 * s, 12 * s, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#66BB6A';
                ctx.beginPath(); ctx.arc(-7 * s, 0, 8 * s, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(8 * s, -1 * s, 9 * s, 0, Math.PI * 2); ctx.fill();
            } else if (d.type === 'grass') {
                ctx.strokeStyle = '#4CAF50';
                ctx.lineWidth = 1.5 * s;
                ctx.lineCap = 'round';
                for (let i = -1; i <= 1; i++) {
                    ctx.beginPath();
                    ctx.moveTo(i * 4 * s, 5 * s);
                    ctx.quadraticCurveTo(i * 3 * s + Math.sin(d.rot + i) * 3, -5 * s, i * 5 * s, -10 * s);
                    ctx.stroke();
                }
            } else if (d.type === 'puddle') {
                ctx.fillStyle = 'rgba(33, 150, 243, 0.25)';
                ctx.beginPath(); ctx.ellipse(0, 0, 20 * s, 12 * s, d.rot, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = 'rgba(33, 150, 243, 0.15)';
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.ellipse(0, 0, 20 * s, 12 * s, d.rot, 0, Math.PI * 2); ctx.stroke();
                // Highlight nước
                ctx.fillStyle = 'rgba(255,255,255,0.12)';
                ctx.beginPath(); ctx.ellipse(-5 * s, -3 * s, 6 * s, 3 * s, d.rot, 0, Math.PI * 2); ctx.fill();
            }
            ctx.restore();
        }

        // === VẼ NHÂN VẬT HUMANOID (RÕ NÉT, CHI TIẾT CAO) ===
        function drawHumanoid(ctx, x, y, dir, state, attackTimer, skinId) {
            let colors = PlayerSkinColors[skinId] || PlayerSkinColors['default'];
            let time = playerAnimTimer;

            // Tính toán animation cycle
            let walkCycle = 0, armSwing = 0, bodyBob = 0;
            if (state === 'run') {
                walkCycle = Math.sin(time * 10) * 0.55;
                armSwing = Math.sin(time * 10) * 0.65;
                bodyBob = Math.abs(Math.sin(time * 10)) * 2.5;
            }

            let atkSwing = 0;
            if (attackTimer > 0) {
                atkSwing = Math.sin((0.4 - attackTimer) / 0.4 * Math.PI) * 1.2;
            }

            ctx.save();
            ctx.translate(x, y);

            // === BÓNG RÕ DƯỚI CHÂN ===
            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            ctx.beginPath(); ctx.ellipse(0, 30, 20, 6, 0, 0, Math.PI * 2); ctx.fill();

            ctx.scale(dir, 1); // Lật mặt

            // === 2 CHÂN (to hơn, rõ hơn) ===
            ctx.save();
            // Chân trái
            ctx.save();
            ctx.translate(-7, 12);
            ctx.rotate(walkCycle * 0.55);
            // Đùi
            ctx.fillStyle = '#1e3a5f';
            ctx.strokeStyle = '#0f2744';
            ctx.lineWidth = 1.5;
            if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(-4, 0, 8, 14, 2); ctx.fill(); ctx.stroke(); }
            else { ctx.fillRect(-4, 0, 8, 14); ctx.strokeRect(-4, 0, 8, 14); }
            // Ống chân
            ctx.fillStyle = '#17304f';
            if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(-4, 14, 8, 10, 2); ctx.fill(); ctx.stroke(); }
            else { ctx.fillRect(-4, 14, 8, 10); ctx.strokeRect(-4, 14, 8, 10); }
            // Giày
            ctx.fillStyle = '#4E342E';
            ctx.strokeStyle = '#3E2723';
            ctx.lineWidth = 1.5;
            if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(-5, 22, 13, 7, 3); ctx.fill(); ctx.stroke(); }
            else { ctx.fillRect(-5, 22, 13, 7); ctx.strokeRect(-5, 22, 13, 7); }
            // Đế giày
            ctx.fillStyle = '#2E2E2E';
            ctx.fillRect(-5, 27, 13, 2);
            ctx.restore();

            // Chân phải
            ctx.save();
            ctx.translate(7, 12);
            ctx.rotate(-walkCycle * 0.55);
            ctx.fillStyle = '#1e3a5f';
            ctx.strokeStyle = '#0f2744';
            ctx.lineWidth = 1.5;
            if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(-4, 0, 8, 14, 2); ctx.fill(); ctx.stroke(); }
            else { ctx.fillRect(-4, 0, 8, 14); ctx.strokeRect(-4, 0, 8, 14); }
            ctx.fillStyle = '#17304f';
            if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(-4, 14, 8, 10, 2); ctx.fill(); ctx.stroke(); }
            else { ctx.fillRect(-4, 14, 8, 10); ctx.strokeRect(-4, 14, 8, 10); }
            ctx.fillStyle = '#4E342E';
            ctx.strokeStyle = '#3E2723';
            ctx.lineWidth = 1.5;
            if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(-5, 22, 13, 7, 3); ctx.fill(); ctx.stroke(); }
            else { ctx.fillRect(-5, 22, 13, 7); ctx.strokeRect(-5, 22, 13, 7); }
            ctx.fillStyle = '#2E2E2E';
            ctx.fillRect(-5, 27, 13, 2);
            ctx.restore();
            ctx.restore();

            // Body nảy nhẹ khi chạy
            ctx.translate(0, -bodyBob);

            // === HIỆU ỨNG NHẶT RÁC (cúi xuống) ===
            if (player.pickupTimer > 0) {
                let t = player.pickupTimer / 0.3;
                let pickupSquash = Math.sin(t * Math.PI) * 0.25;
                ctx.scale(1 + pickupSquash * 0.3, 1 - pickupSquash);
                ctx.translate(0, pickupSquash * 15);
            }

            // === THÂN NGƯỜI (TO, RÕ, BO GÓC) ===
            ctx.fillStyle = colors.body;
            ctx.strokeStyle = colors.outline;
            ctx.lineWidth = 3;
            if (ctx.roundRect) {
                ctx.beginPath(); ctx.roundRect(-12, -10, 24, 26, 5); ctx.fill(); ctx.stroke();
            } else {
                ctx.fillRect(-12, -10, 24, 26); ctx.strokeRect(-12, -10, 24, 26);
            }
            // Cổ áo
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(-8, -10, 16, 5, [3, 3, 0, 0]); ctx.fill(); }
            else { ctx.fillRect(-8, -10, 16, 5); }
            // Thắt lưng
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(-12, 10, 24, 4);
            ctx.fillStyle = '#FFD54F';
            ctx.beginPath(); ctx.arc(0, 12, 2.5, 0, Math.PI * 2); ctx.fill(); // Khóa thắt lưng

            // === TAY TRÁI (phía sau) ===
            ctx.save();
            ctx.translate(-14, -5);
            ctx.rotate(-armSwing * 0.8);
            // Bắp tay
            ctx.fillStyle = colors.body;
            ctx.strokeStyle = colors.outline;
            ctx.lineWidth = 2;
            if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(-4, 0, 8, 14, 3); ctx.fill(); ctx.stroke(); }
            else { ctx.fillRect(-4, 0, 8, 14); ctx.strokeRect(-4, 0, 8, 14); }
            // Bàn tay
            ctx.fillStyle = colors.head;
            ctx.strokeStyle = 'rgba(0,0,0,0.3)';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(0, 17, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.restore();

            // === TAY PHẢI (cầm vũ khí) ===
            ctx.save();
            ctx.translate(14, -5);
            ctx.rotate(armSwing * 0.8 + atkSwing);
            // Bắp tay
            ctx.fillStyle = colors.body;
            ctx.strokeStyle = colors.outline;
            ctx.lineWidth = 2;
            if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(-4, 0, 8, 14, 3); ctx.fill(); ctx.stroke(); }
            else { ctx.fillRect(-4, 0, 8, 14); ctx.strokeRect(-4, 0, 8, 14); }
            // Bàn tay
            ctx.fillStyle = colors.head;
            ctx.strokeStyle = 'rgba(0,0,0,0.3)';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(0, 17, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            // === VŨ KHÍ - SÚNG NĂNG LƯỢNG (ECO-BLASTER) ===
            ctx.save();
            // Lật súng nều nhân vật xoay về bên trái
            ctx.translate(6, 12);
            ctx.rotate(Math.PI / 4); // Cầm súng chếch góc

            // Tay cầm súng (Grip)
            ctx.fillStyle = '#1e293b'; // Xám đen chì
            ctx.beginPath(); ctx.roundRect(-4, 0, 8, 14, 2); ctx.fill();

            // Xương thân súng (Body)
            ctx.fillStyle = '#e2e8f0'; // Thép trắng
            ctx.beginPath(); ctx.roundRect(-8, -12, 28, 14, 4); ctx.fill();

            // Mảng xanh ốp hông
            ctx.fillStyle = '#10b981'; // Xanh lá
            ctx.beginPath(); ctx.roundRect(-2, -9, 18, 8, 3); ctx.fill();

            // Nòng súng (Barrel)
            ctx.fillStyle = '#334155';
            ctx.beginPath(); ctx.roundRect(20, -10, 12, 10, 2); ctx.fill();

            // Lõi thu năng lượng (Core Glow)
            ctx.fillStyle = '#34d399';
            ctx.shadowColor = '#34d399';
            ctx.shadowBlur = 8;
            ctx.beginPath(); ctx.arc(6, -5, 3.5, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;

            // Hạt chớp lóa nếu đang cắn đạn
            if (attackTimer > 0) {
                let flashSize = 10 + Math.random() * 6;
                ctx.fillStyle = '#a7f3d0';
                ctx.shadowColor = '#6ee7b7'; ctx.shadowBlur = 10;
                ctx.beginPath(); ctx.arc(36, -5, flashSize, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.beginPath(); ctx.arc(36, -5, flashSize / 2, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;
            }

            ctx.restore();

            ctx.restore(); // End tay phải

            // === ĐẦU (TO HƠN, RÕ HƠN) ===
            // Cổ
            ctx.fillStyle = colors.head;
            ctx.fillRect(-4, -16, 8, 6);

            // Đầu chính
            ctx.fillStyle = colors.head;
            ctx.strokeStyle = colors.outline;
            ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(0, -24, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            // Tóc (Kiểu Anh Hùng Tình Nguyện Viên - gọn gàng)
            ctx.fillStyle = '#eab308'; // Tóc vàng óng
            ctx.beginPath();
            ctx.arc(0, -25, 14.5, Math.PI, Math.PI * 2); ctx.fill();
            // Tóc mái chẻ xéo
            ctx.beginPath();
            ctx.moveTo(-12, -25); ctx.quadraticCurveTo(-2, -18, 4, -26);
            ctx.lineTo(-14, -28); ctx.closePath(); ctx.fill();

            // Băng đô thể thao (Headband Xanh Lá)
            ctx.fillStyle = '#10b981';
            ctx.fillRect(-14, -27, 28, 5);
            ctx.strokeStyle = '#059669'; ctx.lineWidth = 1;
            ctx.strokeRect(-14, -27, 28, 5);
            // Thêm đuôi băng đô bay phấp phới đằng sau (Bên trái vì nv quay mặt sang phải)
            ctx.beginPath(); ctx.moveTo(-14, -25); ctx.quadraticCurveTo(-22, -22 - walkCycle * 3, -26, -26);
            ctx.lineTo(-24, -22); ctx.lineTo(-14, -22); ctx.closePath(); ctx.fill();

            // Mắt PHẢI (to, rõ, có lòng trắng + đồng tử + highlight)
            // Lòng trắng
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.ellipse(5, -25, 4, 3.5, 0, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 0.8;
            ctx.stroke();
            // Đồng tử
            ctx.fillStyle = '#1a1a2e';
            ctx.beginPath(); ctx.arc(6, -25, 2.2, 0, Math.PI * 2); ctx.fill();
            // Highlight mắt
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(7, -26, 1, 0, Math.PI * 2); ctx.fill();

            // Mắt TRÁI (nhỏ hơn do góc nhìn)
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.ellipse(-4, -25, 3, 3, 0, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 0.8; ctx.stroke();
            ctx.fillStyle = '#1a1a2e';
            ctx.beginPath(); ctx.arc(-3, -25, 1.8, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(-2.5, -26, 0.8, 0, Math.PI * 2); ctx.fill();

            // Lông mày
            ctx.strokeStyle = '#3E2723';
            ctx.lineWidth = 1.8;
            ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(2, -30); ctx.lineTo(9, -29.5); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-6, -29.5); ctx.lineTo(-1, -30); ctx.stroke();

            // Mũi (nhỏ, nét nhẹ)
            ctx.strokeStyle = 'rgba(139, 90, 43, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(2, -22); ctx.lineTo(3, -19); ctx.lineTo(1, -18); ctx.stroke();

            // Miệng (nụ cười nhẹ)
            ctx.strokeStyle = '#8B5A2B';
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            ctx.beginPath(); ctx.arc(2, -17, 4, 0.15, Math.PI - 0.15); ctx.stroke();

            // Má hồng
            ctx.fillStyle = 'rgba(255, 150, 150, 0.2)';
            ctx.beginPath(); ctx.arc(-6, -20, 3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(9, -20, 3, 0, Math.PI * 2); ctx.fill();

            ctx.restore(); // End toàn bộ
        }

        // === VẼ BOSS =======
        function drawBoss(ctx, boss) {
            ctx.save();
            ctx.translate(boss.x, boss.y);

            // Bóng
            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            ctx.beginPath(); ctx.ellipse(0, 35, 30, 10, 0, 0, Math.PI * 2); ctx.fill();

            // Rung khi bị đánh
            let shakeX = 0, shakeY = 0;
            if (boss.hitTimer > 0) {
                shakeX = (Math.random() - 0.5) * 8;
                shakeY = (Math.random() - 0.5) * 8;
            }
            ctx.translate(shakeX, shakeY);

            // Aura phát sáng
            let auraSize = 42 + Math.sin(Date.now() / 300) * 5;
            ctx.fillStyle = 'rgba(220, 38, 38, 0.1)';
            ctx.beginPath(); ctx.arc(0, 0, auraSize, 0, Math.PI * 2); ctx.fill();

            // Thân boss (lớn, tối tím)
            let gradient = ctx.createRadialGradient(0, 0, 5, 0, 0, 35);
            gradient.addColorStop(0, '#6B21A8');
            gradient.addColorStop(1, '#3B0764');
            ctx.fillStyle = gradient;
            ctx.beginPath(); ctx.arc(0, 0, 32, 0, Math.PI * 2); ctx.fill();

            // Viền boss
            ctx.strokeStyle = boss.hitTimer > 0 ? '#ef4444' : '#9333ea';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(0, 0, 32, 0, Math.PI * 2); ctx.stroke();

            // Gai xung quanh
            let spikeCount = 8;
            ctx.fillStyle = '#7C3AED';
            for (let i = 0; i < spikeCount; i++) {
                let ang = (i / spikeCount) * Math.PI * 2 + Date.now() / 2000;
                ctx.save();
                ctx.rotate(ang);
                ctx.beginPath(); ctx.moveTo(28, -5); ctx.lineTo(40, 0); ctx.lineTo(28, 5); ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            // Mắt (2 mắt đỏ phát sáng)
            ctx.fillStyle = '#ef4444';
            ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 8;
            ctx.beginPath(); ctx.arc(-10, -8, 5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(10, -8, 5, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;

            // Đồng tử
            ctx.fillStyle = '#1a1a2e';
            ctx.beginPath(); ctx.arc(-10, -8, 2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(10, -8, 2, 0, Math.PI * 2); ctx.fill();

            // Miệng boss
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-12, 8); ctx.lineTo(-7, 14); ctx.lineTo(-2, 8); ctx.lineTo(3, 14); ctx.lineTo(8, 8); ctx.lineTo(13, 14);
            ctx.stroke();

            // Tên Boss
            ctx.font = 'bold 13px Arial';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fca5a5';
            ctx.fillText(boss.name, 0, -55);

            // Thanh Máu Boss (bo góc, gradient)
            let barW = 70, barH = 8, barY = -44;
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(-barW / 2, barY, barW, barH, 4); ctx.fill(); }
            else { ctx.fillRect(-barW / 2, barY, barW, barH); }

            let hpPct = boss.hp / boss.maxHp;
            let hpGrad = ctx.createLinearGradient(-barW / 2, 0, -barW / 2 + barW * hpPct, 0);
            hpGrad.addColorStop(0, '#ef4444'); hpGrad.addColorStop(1, '#f87171');
            ctx.fillStyle = hpGrad;
            if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(-barW / 2, barY, barW * hpPct, barH, 4); ctx.fill(); }
            else { ctx.fillRect(-barW / 2, barY, barW * hpPct, barH); }

            ctx.restore();
        }

        // === VẼ QUÁI VẬT NHỎ (ĐA HÌNH DẠNG) ===
        function drawMiniMonster(ctx, m) {
            ctx.save();
            ctx.translate(m.x, m.y);

            // Cập nhật tick anim
            if (!m.animTime) m.animTime = Math.random() * 100;
            m.animTime += 0.05;
            let aT = m.animTime;

            // Rung khi bị đánh
            if (m.hitTimer > 0) {
                ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
            }

            // Bóng chung
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath(); ctx.ellipse(0, 18, 14, 5, 0, 0, Math.PI * 2); ctx.fill();

            // Gradient màu của quái
            let bodyGrad = ctx.createRadialGradient(0, 0, 3, 0, 0, 18);
            bodyGrad.addColorStop(0, m.color);
            bodyGrad.addColorStop(1, '#1a1a2e');
            ctx.fillStyle = bodyGrad;
            ctx.strokeStyle = m.hitTimer > 0 ? '#ef4444' : m.color;
            ctx.lineWidth = 2.5;

            // VẼ THEO LOẠI HÌNH (m.type)
            ctx.save();
            switch (m.type) {
                case 'slime':
                    // SLIME: Nảy nhấp nhô
                    let jump = Math.abs(Math.sin(aT * 2)) * 10;
                    ctx.translate(0, -jump + 5);
                    let squash = 1 - Math.abs(Math.sin(aT * 2)) * 0.2;
                    ctx.scale(1 / squash, squash);

                    ctx.beginPath(); ctx.ellipse(0, 5, 20, 15, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                    // Giọt nhỏ trên đầu
                    ctx.beginPath(); ctx.arc(-5, -12, 4, 0, Math.PI * 2); ctx.fill();
                    break;
                case 'bat':
                    // BAT: Bay lượn + Đập cánh
                    ctx.translate(0, Math.sin(aT * 3) * 6 - 15);
                    ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                    ctx.fillStyle = m.color;
                    // Cánh trái
                    ctx.save(); ctx.translate(-10, 0); ctx.rotate(Math.sin(aT * 10) * 0.8);
                    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-20, -10); ctx.lineTo(-25, 5); ctx.lineTo(-10, 5); ctx.fill(); ctx.restore();
                    // Cánh phải
                    ctx.save(); ctx.translate(10, 0); ctx.rotate(-Math.sin(aT * 10) * 0.8);
                    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(20, -10); ctx.lineTo(25, 5); ctx.lineTo(10, 5); ctx.fill(); ctx.restore();
                    break;
                case 'spider':
                    // SPIDER: 8 chân ngoe nguẩy
                    ctx.beginPath(); ctx.ellipse(0, 5, 15, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                    ctx.strokeStyle = m.color; ctx.lineWidth = 3; ctx.lineCap = 'round';
                    for (let i = 0; i < 4; i++) {
                        let legA = Math.sin(aT * 5 + i) * 5;
                        // Chân trái
                        ctx.beginPath(); ctx.moveTo(-10, 5); ctx.lineTo(-20, 0 + legA); ctx.lineTo(-25, 10 + legA); ctx.stroke();
                        // Chân phải
                        ctx.beginPath(); ctx.moveTo(10, 5); ctx.lineTo(20, 0 - legA); ctx.lineTo(25, 10 - legA); ctx.stroke();
                    }
                    break;
                case 'worm':
                    // WORM: Trượt dài
                    let stretch = 1 + Math.sin(aT * 4) * 0.3;
                    ctx.scale(stretch, 1 / stretch);
                    ctx.beginPath(); ctx.ellipse(0, 10, 22, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                    for (let i = -2; i <= 2; i++) {
                        ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(i * 5, 3); ctx.lineTo(i * 5, 17); ctx.stroke();
                    }
                    break;
                case 'roller':
                default:
                    // BÓNG LĂN CÓ GAI (Original cơ bản nhưng thêm xoay)
                    ctx.rotate(aT);
                    ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                    ctx.fillStyle = m.color;
                    for (let i = 0; i < 6; i++) {
                        ctx.save(); ctx.rotate((i / 6) * Math.PI * 2);
                        ctx.beginPath(); ctx.moveTo(16, -3); ctx.lineTo(23, 0); ctx.lineTo(16, 3); ctx.fill(); ctx.restore();
                    }
                    ctx.rotate(-aT); // Hủy xoay cho mắt khỏi xoay theo
                    break;
            }
            ctx.restore();

            // MẮT CHUNG CHO QUÁI
            let eyeY = m.type === 'spider' ? 5 : (m.type === 'worm' ? 8 : (m.type === 'slime' ? 2 : (m.type === 'bat' ? -15 : -3)));

            ctx.fillStyle = '#ef4444';
            ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 6;
            ctx.beginPath(); ctx.arc(-6, eyeY, 4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(6, eyeY, 4, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
            // Đồng tử
            ctx.fillStyle = '#1a1a2e';
            ctx.beginPath(); ctx.arc(-5, eyeY, 2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(7, eyeY, 2, 0, Math.PI * 2); ctx.fill();
            // Miệng chung nhỏ
            if (m.type !== 'worm') {
                ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(-4, eyeY + 6); ctx.lineTo(0, eyeY + 10); ctx.lineTo(4, eyeY + 6); ctx.stroke();
            }

            // Tên & Thanh máu
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fca5a5';
            ctx.fillText(m.name, 0, -30);

            let barW = 36, barH = 5, barY = -24;
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(-barW / 2, barY, barW, barH);
            let hpPct = m.hp / m.maxHp;
            ctx.fillStyle = hpPct > 0.5 ? '#22c55e' : hpPct > 0.25 ? '#f59e0b' : '#ef4444';
            ctx.fillRect(-barW / 2, barY, barW * hpPct, barH);

            ctx.restore();
        }

        // Bảng màu theo loại rác
        const TRASH_TYPE_COLORS = {
            'organic': { bg: '#22c55e', border: '#15803d', glow: '#4ade80', label: 'HỮU CƠ', icon: '🍎' },
            'recycle': { bg: '#3b82f6', border: '#1d4ed8', glow: '#60a5fa', label: 'TÁI CHẾ', icon: '♻️' },
            'inorganic': { bg: '#f59e0b', border: '#b45309', glow: '#fbbf24', label: 'VÔ CƠ', icon: '🗑️' },
            'hazardous': { bg: '#ef4444', border: '#b91c1c', glow: '#f87171', label: 'NGUY HẠI', icon: '⚠️' }
        };

        // Particle hệ thống cho nhặt rác
        let pickupParticles = [];

        function spawnPickupParticles(x, y, type) {
            let colors = TRASH_TYPE_COLORS[type] || TRASH_TYPE_COLORS['organic'];
            for (let i = 0; i < 12; i++) {
                let angle = (i / 12) * Math.PI * 2;
                let speed = 80 + Math.random() * 60;
                pickupParticles.push({
                    x: x, y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 0.6 + Math.random() * 0.3,
                    size: 3 + Math.random() * 3,
                    color: colors.bg
                });
            }
        }

        // === VẼ RÁC TRÊN BẢN ĐỒ (CANVAS 2D - RÕ RÀNG) ===
        function drawTrashItem(ctx, t) {
            ctx.save();
            ctx.translate(t.x, t.y);

            let bob = Math.sin(Date.now() / 500 + t.x) * 3;
            ctx.translate(0, bob);

            let typeInfo = TRASH_TYPE_COLORS[t.type] || TRASH_TYPE_COLORS['organic'];

            // Vòng pulse nhấp nháy
            let pulse = 0.6 + Math.sin(Date.now() / 400 + t.y) * 0.4;
            ctx.strokeStyle = typeInfo.glow + '80';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, 0, 26 + pulse * 4, 0, Math.PI * 2); ctx.stroke();

            // Bóng
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.beginPath(); ctx.ellipse(0, 18, 16, 5, 0, 0, Math.PI * 2); ctx.fill();

            // Nền vuông bo góc theo màu loại rác
            ctx.fillStyle = typeInfo.bg;
            ctx.strokeStyle = typeInfo.border;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = typeInfo.glow;
            ctx.shadowBlur = 10;
            if (ctx.roundRect) {
                ctx.beginPath(); ctx.roundRect(-20, -20, 40, 40, 10); ctx.fill(); ctx.stroke();
            } else {
                ctx.fillRect(-20, -20, 40, 40); ctx.strokeRect(-20, -20, 40, 40);
            }
            ctx.shadowBlur = 0;

            // Vẽ hình rác bằng Canvas theo loại
            if (t.type === 'organic') {
                // Trái cây: vẽ quả tròn + lá
                ctx.fillStyle = '#dc2626';
                ctx.beginPath(); ctx.arc(0, 2, 10, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#15803d';
                ctx.beginPath(); ctx.ellipse(4, -8, 6, 3, 0.5, 0, Math.PI * 2); ctx.fill();
                // Cuống
                ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(2, -6); ctx.lineTo(2, -10); ctx.stroke();
                // Highlight
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.beginPath(); ctx.arc(-3, -1, 3, 0, Math.PI * 2); ctx.fill();
            } else if (t.type === 'recycle') {
                // Chai/lon: vẽ chai hình chữ nhật có nắp
                ctx.fillStyle = '#93c5fd';
                if (ctx.roundRect) {
                    ctx.beginPath(); ctx.roundRect(-6, -4, 12, 16, 3); ctx.fill();
                } else { ctx.fillRect(-6, -4, 12, 16); }
                // Nắp chai
                ctx.fillStyle = '#1e40af';
                ctx.fillRect(-4, -8, 8, 5);
                // Nhãn chai
                ctx.fillStyle = '#1e3a8a';
                ctx.fillRect(-5, 2, 10, 4);
                // Highlight
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.fillRect(-4, -2, 3, 10);
            } else if (t.type === 'inorganic') {
                // Túi nilon: vẽ túi méo mó
                ctx.fillStyle = '#d4d4d8';
                ctx.beginPath();
                ctx.moveTo(-8, -8); ctx.lineTo(8, -8);
                ctx.lineTo(10, 8); ctx.lineTo(-10, 10);
                ctx.closePath(); ctx.fill();
                ctx.strokeStyle = '#71717a'; ctx.lineWidth = 1.5; ctx.stroke();
                // Nút buộc
                ctx.fillStyle = '#a1a1aa';
                ctx.beginPath(); ctx.arc(0, -10, 4, 0, Math.PI * 2); ctx.fill();
                // Vệt bẩn
                ctx.fillStyle = 'rgba(0,0,0,0.15)';
                ctx.beginPath(); ctx.arc(3, 2, 4, 0, Math.PI * 2); ctx.fill();
            } else if (t.type === 'hazardous') {
                // Pin / hoá chất: vẽ pin
                ctx.fillStyle = '#374151';
                if (ctx.roundRect) {
                    ctx.beginPath(); ctx.roundRect(-7, -5, 14, 18, 2); ctx.fill();
                } else { ctx.fillRect(-7, -5, 14, 18); }
                // Đầu pin (+)
                ctx.fillStyle = '#9ca3af';
                ctx.fillRect(-3, -9, 6, 5);
                // Nhãn nguy hiểm
                ctx.fillStyle = '#fbbf24';
                ctx.fillRect(-5, 1, 10, 6);
                // Ký hiệu sét ⚡
                ctx.strokeStyle = '#1a1a2e'; ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(1, 1); ctx.lineTo(-2, 4); ctx.lineTo(1, 4); ctx.lineTo(-1, 7);
                ctx.stroke();
            }

            // Nhãn loại rác phía dưới
            ctx.font = 'bold 8px Arial';
            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
            ctx.fillStyle = 'rgba(255,255,255,0.95)';
            ctx.fillText(typeInfo.label, 0, 22);

            ctx.restore();
        }

        // === VẼ ĐẠN NĂNG LƯỢNG (ECO-PULSE) ===
        function drawProjectile(ctx, p) {
            ctx.save();
            ctx.translate(p.x, p.y);
            let angle = Math.atan2(p.vy, p.vx);
            ctx.rotate(angle);

            // Xung động vòng Elip đuôi đạn
            let pulse = 2 + Math.abs(Math.sin(p.life * 20)) * 2;
            ctx.fillStyle = 'rgba(110, 231, 183, 0.4)';
            ctx.beginPath(); ctx.ellipse(-10, 0, 15 + pulse, 6 + pulse / 2, 0, 0, Math.PI * 2); ctx.fill();

            // Trail ánh sáng bay theo
            let trailGrad = ctx.createLinearGradient(-35, 0, 0, 0);
            trailGrad.addColorStop(0, 'rgba(52, 211, 153, 0)');
            trailGrad.addColorStop(1, 'rgba(52, 211, 153, 0.8)');
            ctx.fillStyle = trailGrad;
            ctx.beginPath();
            ctx.moveTo(0, -4); ctx.lineTo(-35, 0); ctx.lineTo(0, 4);
            ctx.closePath(); ctx.fill();

            // Head (Cốt đạn Laser/Năng lượng tròn)
            ctx.fillStyle = '#059669';
            ctx.beginPath(); ctx.arc(2, 0, 6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#a7f3d0';
            ctx.beginPath(); ctx.arc(4, 0, 3.5, 0, Math.PI * 2); ctx.fill();

            // Tỏa sáng xung quanh
            ctx.shadowColor = '#34d399';
            ctx.shadowBlur = 15;
            ctx.strokeStyle = 'rgba(255,255,255,0.9)';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(2, 0, 6, 0, Math.PI * 2); ctx.stroke();

            ctx.restore();
        }

        // ============================
        // RENDER CHÍNH - SURVIV.IO STYLE
        // ============================
        function renderTqGraphics() {
            let W = tqCanvas.width, H = tqCanvas.height;

            // === NỀN CỎ XANH ===
            tqCtx.fillStyle = '#3a7d44';
            tqCtx.fillRect(0, 0, W, H);

            // Pattern cỏ nhạt (tile-based)
            tqCtx.save();
            tqCtx.translate(-tqCamera.x % 80, -tqCamera.y % 80);
            tqCtx.fillStyle = 'rgba(255,255,255,0.03)';
            for (let gx = -80; gx < W + 160; gx += 80) {
                for (let gy = -80; gy < H + 160; gy += 80) {
                    if ((Math.floor((gx + tqCamera.x) / 80) + Math.floor((gy + tqCamera.y) / 80)) % 2 === 0) {
                        tqCtx.fillRect(gx, gy, 80, 80);
                    }
                }
            }
            tqCtx.restore();

            tqCtx.save();
            tqCtx.translate(-tqCamera.x, -tqCamera.y);

            // === GRID LƯỚI SURVIV.IO ===
            tqCtx.strokeStyle = 'rgba(0,0,0,0.06)';
            tqCtx.lineWidth = 1;
            const tileSize = 80;
            const startX = Math.floor(tqCamera.x / tileSize) * tileSize;
            const startY = Math.floor(tqCamera.y / tileSize) * tileSize;
            tqCtx.beginPath();
            for (let x = startX; x < startX + W + tileSize; x += tileSize) {
                tqCtx.moveTo(x, startY); tqCtx.lineTo(x, startY + H + tileSize);
            }
            for (let y = startY; y < startY + H + tileSize; y += tileSize) {
                tqCtx.moveTo(startX, y); tqCtx.lineTo(startX + W + tileSize, y);
            }
            tqCtx.stroke();

            // === VIỀN BẢN ĐỒ (Safe Zone) ===
            tqCtx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
            tqCtx.lineWidth = 4;
            tqCtx.setLineDash([15, 10]);
            tqCtx.strokeRect(-MAP_HALF, -MAP_HALF, MAP_SIZE, MAP_SIZE);
            tqCtx.setLineDash([]);
            // Nền ngoài bản đồ - tối hơn
            tqCtx.fillStyle = 'rgba(0,0,0,0.4)';
            // Top
            tqCtx.fillRect(-MAP_HALF - 2000, -MAP_HALF - 2000, MAP_SIZE + 4000, 2000);
            // Bottom
            tqCtx.fillRect(-MAP_HALF - 2000, MAP_HALF, MAP_SIZE + 4000, 2000);
            // Left
            tqCtx.fillRect(-MAP_HALF - 2000, -MAP_HALF, 2000, MAP_SIZE);
            // Right
            tqCtx.fillRect(MAP_HALF, -MAP_HALF, 2000, MAP_SIZE);

            // === VẼ DECOR BẢN ĐỒ ===
            tqCtx.textAlign = 'center'; tqCtx.textBaseline = 'middle';
            tqMapDecor.forEach(d => {
                if (d.x > tqCamera.x - 100 && d.x < tqCamera.x + W + 100 &&
                    d.y > tqCamera.y - 100 && d.y < tqCamera.y + H + 100) {
                    drawDecor(tqCtx, d);
                }
            });

            // === VẼ RÁC ===
            tqMapTrashes.forEach(t => drawTrashItem(tqCtx, t));

            // === VẼ PICKUP PARTICLES ===
            pickupParticles.forEach(p => {
                tqCtx.globalAlpha = p.life;
                tqCtx.fillStyle = p.color;
                tqCtx.beginPath(); tqCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2); tqCtx.fill();
                tqCtx.globalAlpha = 1.0;
            });

            // === VẼ MŨI TÊN ===
            tqProjectiles.forEach(p => drawProjectile(tqCtx, p));

            // === VẼ BOSS ===
            if (tqBoss && tqBoss.hp > 0) drawBoss(tqCtx, tqBoss);

            // === VẼ QUÁI VẬT NHỎ ===
            tqMiniMonsters.forEach(m => drawMiniMonster(tqCtx, m));

            // VẼ PET: MÈO MÁY ECO-CAT NẾU ĐÃ MUA
            if (typeof boughtAccessories !== 'undefined' && boughtAccessories['robocat']) {
                let pTime = Date.now() / 200;
                let cX = player.x - (player.dir === 'right' ? 35 : -35); // Dịch ra sau lưng
                let cY = player.y + 10 + Math.sin(pTime) * 6; // Lơ lửng nhấp nhô

                tqCtx.save();
                tqCtx.translate(cX, cY);
                if (player.dir === 'left') tqCtx.scale(-1, 1); // Đổi hướng mặt mèo

                // Múi thân mèo
                tqCtx.fillStyle = '#cbd5e1';
                tqCtx.beginPath(); tqCtx.ellipse(-5, 0, 11, 7, 0, 0, Math.PI * 2); tqCtx.fill();

                // Đầu mèo
                tqCtx.fillStyle = '#94a3b8';
                tqCtx.beginPath(); tqCtx.arc(0, -10, 9, 0, Math.PI * 2); tqCtx.fill();

                // Tai mèo
                tqCtx.beginPath(); tqCtx.moveTo(-7, -16); tqCtx.lineTo(-9, -24); tqCtx.lineTo(-2, -18); tqCtx.fill();
                tqCtx.beginPath(); tqCtx.moveTo(7, -16); tqCtx.lineTo(9, -24); tqCtx.lineTo(2, -18); tqCtx.fill();

                // Màn hình mặt (Kính đen)
                tqCtx.fillStyle = '#1e293b';
                tqCtx.beginPath(); tqCtx.roundRect(-5, -14, 12, 6, 2); tqCtx.fill();

                // 2 Mắt Led Xanh phát sáng
                tqCtx.fillStyle = '#34d399';
                tqCtx.shadowColor = '#6ee7b7'; tqCtx.shadowBlur = 5;
                tqCtx.fillRect(-3, -13, 3, 3); tqCtx.fillRect(4, -13, 3, 3);
                tqCtx.shadowBlur = 0;

                // Đuôi dây cáp cắm điện
                tqCtx.strokeStyle = '#38bdf8'; tqCtx.lineWidth = 2.5; tqCtx.lineCap = 'round';
                tqCtx.beginPath(); tqCtx.moveTo(-16, 0); tqCtx.quadraticCurveTo(-20, -5, -25, -10 + Math.sin(pTime * 2) * 5); tqCtx.stroke();

                // Phích cắm đuôi
                tqCtx.fillStyle = '#f8fafc';
                tqCtx.beginPath(); tqCtx.arc(-25, -10 + Math.sin(pTime * 2) * 5, 3, 0, Math.PI * 2); tqCtx.fill();

                // Lõi sáng dưới bụng đẩy nó bay lên
                tqCtx.fillStyle = 'rgba(16, 185, 129, 0.5)';
                tqCtx.beginPath(); tqCtx.ellipse(-5, 8, 5, 2, 0, 0, Math.PI * 2); tqCtx.fill();

                tqCtx.restore();
            }

            // === VẼ PLAYER (Humanoid) ===
            drawHumanoid(tqCtx, player.x, player.y, player.dir, player.state, player.attackTimer, currentSkin);

            // === HIỆU ỨNG SHOCKWAVE SKILL ===
            if (skillAuraTimer > 0) {
                let progress = (0.5 - skillAuraTimer) / 0.5;
                let radius = 250 * progress;
                tqCtx.beginPath();
                tqCtx.arc(player.x, player.y, radius, 0, Math.PI * 2);
                tqCtx.lineWidth = 8 * (1 - progress);
                tqCtx.strokeStyle = `rgba(168, 85, 247, ${1 - progress})`;
                tqCtx.stroke();
                tqCtx.fillStyle = `rgba(168, 85, 247, ${(1 - progress) * 0.2})`;
                tqCtx.fill();
            }

            // === RADAR MŨI TÊN CHỈ ĐƯỜNG ===
            let targetX = null, targetY = null;
            if (tqBoss && tqBoss.hp > 0) {
                targetX = tqBoss.x; targetY = tqBoss.y;
            } else if (tqMapTrashes.length > 0) {
                let minDist = Infinity, closestTrash = null;
                tqMapTrashes.forEach(t => {
                    let d = Math.sqrt((player.x - t.x) ** 2 + (player.y - t.y) ** 2);
                    if (d < minDist) { minDist = d; closestTrash = t; }
                });
                if (closestTrash && minDist > 300) { targetX = closestTrash.x; targetY = closestTrash.y; }
            }

            if (targetX !== null && targetY !== null) {
                let dx = targetX - player.x, dy = targetY - player.y;
                let angle = Math.atan2(dy, dx);
                let distToTarget = Math.sqrt(dx * dx + dy * dy);
                let radarR = 70;
                let arrX = player.x + Math.cos(angle) * radarR;
                let arrY = player.y + Math.sin(angle) * radarR;

                tqCtx.save();
                tqCtx.translate(arrX, arrY);
                tqCtx.rotate(angle);

                // Mũi tên chỉ đường (Canvas triangle)
                tqCtx.fillStyle = tqBoss ? 'rgba(239, 68, 68, 0.85)' : 'rgba(250, 204, 21, 0.85)';
                tqCtx.beginPath(); tqCtx.moveTo(12, 0); tqCtx.lineTo(-6, -8); tqCtx.lineTo(-6, 8); tqCtx.closePath(); tqCtx.fill();
                tqCtx.strokeStyle = 'rgba(255,255,255,0.5)'; tqCtx.lineWidth = 1;
                tqCtx.stroke();

                // Khoảng cách
                tqCtx.font = 'bold 11px Arial';
                tqCtx.fillStyle = 'rgba(255,255,255,0.7)';
                tqCtx.textAlign = 'center';
                tqCtx.fillText(Math.floor(distToTarget) + 'm', 0, 18);

                tqCtx.restore();
            }

            // === VẼ DAMAGE TEXT NỔI ===
            tqCtx.font = 'bold 20px Arial';
            tqCtx.textAlign = 'center';
            dmgTexts.forEach(d => {
                tqCtx.globalAlpha = d.life;
                tqCtx.fillStyle = 'rgba(0,0,0,0.4)';
                tqCtx.fillText(d.text, d.x + 1, d.y + 1);
                tqCtx.fillStyle = d.color;
                tqCtx.fillText(d.text, d.x, d.y);
                tqCtx.globalAlpha = 1.0;
            });

            tqCtx.restore(); // Kết thúc viewport camera

            // === SCREEN VIGNETTE (Tối 4 góc) ===
            let vigGrad = tqCtx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.75);
            vigGrad.addColorStop(0, 'rgba(0,0,0,0)'); vigGrad.addColorStop(1, 'rgba(0,0,0,0.3)');
            tqCtx.fillStyle = vigGrad;
            tqCtx.fillRect(0, 0, W, H);

            // === MINI-MAP (Radar HUD) ===
            const mapSize = 160;
            const mapPad = 15;
            const mapX = W - mapSize - mapPad;
            const mapY = mapPad;

            // Background map - xanh lá nhạt
            tqCtx.fillStyle = 'rgba(46, 125, 50, 0.6)';
            tqCtx.strokeStyle = 'rgba(255,255,255,0.5)';
            tqCtx.lineWidth = 2;
            tqCtx.beginPath();
            if (tqCtx.roundRect) tqCtx.roundRect(mapX, mapY, mapSize, mapSize, 10);
            else tqCtx.rect(mapX, mapY, mapSize, mapSize);
            tqCtx.fill(); tqCtx.stroke();

            tqCtx.save();
            tqCtx.beginPath();
            if (tqCtx.roundRect) tqCtx.roundRect(mapX, mapY, mapSize, mapSize, 10);
            else tqCtx.rect(mapX, mapY, mapSize, mapSize);
            tqCtx.clip();

            // Viền bản đồ trên minimap
            const mmScale = mapSize / MAP_SIZE;
            const mmCenterX = mapX + mapSize / 2;
            const mmCenterY = mapY + mapSize / 2;
            tqCtx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
            tqCtx.lineWidth = 1;
            tqCtx.strokeRect(
                mmCenterX + (-MAP_HALF - player.x) * mmScale,
                mmCenterY + (-MAP_HALF - player.y) * mmScale,
                MAP_SIZE * mmScale, MAP_SIZE * mmScale
            );

            // Rác trên Mini-map (chấm xanh lá)
            tqCtx.fillStyle = '#4ade80';
            tqMapTrashes.forEach(t => {
                let dx = (t.x - player.x) * mmScale;
                let dy = (t.y - player.y) * mmScale;
                tqCtx.beginPath(); tqCtx.arc(mmCenterX + dx, mmCenterY + dy, 2.5, 0, Math.PI * 2); tqCtx.fill();
            });

            // Boss trên mini-map (nhấp nháy đỏ)
            if (tqBoss && tqBoss.hp > 0) {
                let dx = (tqBoss.x - player.x) * mmScale;
                let dy = (tqBoss.y - player.y) * mmScale;
                tqCtx.fillStyle = Math.floor(Date.now() / 200) % 2 === 0 ? '#ef4444' : '#fca5a5';
                tqCtx.beginPath(); tqCtx.arc(mmCenterX + dx, mmCenterY + dy, 4, 0, Math.PI * 2); tqCtx.fill();
            }

            // Player trên mini-map (chấm trắng viền xanh dương)
            tqCtx.fillStyle = '#ffffff';
            tqCtx.strokeStyle = '#3b82f6';
            tqCtx.lineWidth = 2;
            tqCtx.beginPath(); tqCtx.arc(mmCenterX, mmCenterY, 4, 0, Math.PI * 2); tqCtx.fill(); tqCtx.stroke();

            tqCtx.restore(); // Bỏ clip minimap
        }

        // --- CONSFETTI JS TỪ ĐIỂM (ORIGIN XY) ---
        const canvas = document.getElementById('confettiCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        let confettiParticles = [];
        const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#ffffff', '#a855f7'];

        window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });

        let confettiAnimFrame = null;

        function fireConfettiOrigin(x, y, particleCount = 50, force = 1) {
            for (let i = 0; i < particleCount; i++) {
                confettiParticles.push({
                    x: x, y: y,
                    r: Math.random() * 6 + 4,
                    dx: (Math.random() - 0.5) * 25 * force,  // Bắn bung ra
                    dy: (Math.random() * -20 - 5) * force,  // Bay bổng lên
                    color: colors[Math.floor(Math.random() * colors.length)],
                    tilt: Math.random() * 10, tiltAngle: 0, tiltAngleInc: (Math.random() * 0.07) + 0.05
                });
            }
            if (!confettiAnimFrame) {
                drawConfetti();
            }
        }

        function drawConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (confettiParticles.length === 0) {
                confettiAnimFrame = null;
                return;
            }
            for (let i = 0; i < confettiParticles.length; i++) {
                let p = confettiParticles[i];
                p.tiltAngle += p.tiltAngleInc;
                p.y += (Math.cos(p.tiltAngle) + 1 + p.r / 2) / 2;
                p.x += Math.sin(p.tiltAngle) * 2;
                p.dy += 0.4; p.y += p.dy; p.x += p.dx; // 0.4 Gravity down

                ctx.beginPath(); ctx.lineWidth = p.r; ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.tilt + p.r, p.y); ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r); ctx.stroke();

                // Mất khi rơi khỏi màn hình
                if (p.y > canvas.height) { confettiParticles.splice(i, 1); i--; }
            }
            confettiAnimFrame = requestAnimationFrame(drawConfetti);
        }

        // ==========================================
        //  MODERN FEATURES: Quests, Lucky Wheel, AFK
        // ==========================================

        // --- 1. IDLE AFK REWARDS ---
        let afkCoinsTimer = null;
        let afkAccumulated = 0;
        let afkRatePerMinute = 10;
        const afkCoinCountEl = document.getElementById('afkCoinCount');
        const afkAccumulatedEl = document.getElementById('afkAccumulated');
        const afkRateEl = document.getElementById('afkRate');

        function initAFK() {
            let savedAFKTime = localStorage.getItem('aiSortLastTime');
            let savedAFKCoins = parseFloat(localStorage.getItem('aiSortAfkCoins') || 0);
            if (savedAFKTime) {
                let diffMins = (Date.now() - parseInt(savedAFKTime)) / 60000;
                if (diffMins > 0) {
                    diffMins = Math.min(diffMins, 720); // Max 12 hours
                    afkAccumulated = savedAFKCoins + (diffMins * afkRatePerMinute);
                }
            }
            updateAFKUI();

            afkCoinsTimer = setInterval(() => {
                afkRatePerMinute = 10 + (level - 1) * 2;
                afkAccumulated += afkRatePerMinute / 60;
                updateAFKUI();
            }, 1000);
        }

        function updateAFKUI() {
            localStorage.setItem('aiSortLastTime', Date.now());
            localStorage.setItem('aiSortAfkCoins', afkAccumulated);
            if (afkCoinCountEl) afkCoinCountEl.textContent = Math.floor(afkRatePerMinute);
            if (afkAccumulatedEl) afkAccumulatedEl.textContent = Math.floor(afkAccumulated);
            if (afkRateEl) afkRateEl.textContent = afkRatePerMinute;
        }

        function openAFK() { document.getElementById('afkModal').classList.add('active'); updateAFKUI(); }
        function closeAFK() { document.getElementById('afkModal').classList.remove('active'); }

        function claimAFK() {
            let claimAmount = Math.floor(afkAccumulated);
            if (claimAmount > 0) {
                sfx.collect();
                coins += claimAmount;
                coinValEl.textContent = coins;
                afkAccumulated = 0;
                localStorage.setItem('aiSortAfkCoins', 0);
                updateAFKUI();
                fireConfettiOrigin(window.innerWidth / 2, window.innerHeight / 2, 80, 2);
                showFeedback(`Đã nhận ${claimAmount} 🟡 từ Quỹ AFK!`, 'success');
                closeAFK();
            } else {
                showFeedback(`Chưa có tích luỹ, hãy chờ xíu nhé!`, 'season-alert');
            }
        }

        window.addEventListener('beforeunload', () => {
            localStorage.setItem('aiSortLastTime', Date.now());
            localStorage.setItem('aiSortAfkCoins', afkAccumulated);
        });

        // --- 2. LUCKY WHEEL ---
        const wheelSlices = [
            { label: "100 🟡", type: "coin", val: 100 },
            { label: "50 XP", type: "xp", val: 50 },
            { label: "Thêm Máu", type: "potion", val: 1 },
            { label: "20 🟡", type: "coin", val: 20 },
            { label: "X2 Vàng", type: "buff", val: 0 },
            { label: "200 XP", type: "xp", val: 200 },
            { label: "Trượt Lô", type: "none", val: 0 },
            { label: "500 🟡", type: "coin", val: 500 }
        ];

        let wheelBg = null;
        let isSpinning = false;
        let currentWheelRotation = 0;

        function renderWheelItems() {
            wheelBg = document.getElementById('wheelBg');
            wheelBg.innerHTML = '';
            wheelSlices.forEach((slice, idx) => {
                let rot = idx * 45;
                let el = document.createElement('div');
                el.className = 'wheel-item';
                el.style.transform = `rotate(${rot + 22.5}deg)`;
                el.innerHTML = `<span>${slice.label}</span>`;
                wheelBg.appendChild(el);
            });
        }

        function openWheel() {
            if (!wheelBg) renderWheelItems();
            document.getElementById('wheelModal').classList.add('active');
        }
        function closeWheel() {
            if (!isSpinning) document.getElementById('wheelModal').classList.remove('active');
        }

        function spinWheel() {
            if (isSpinning) return;
            if (coins < 50) return alert("Bạn không đủ 50 🟡 để quay!");

            coins -= 50;
            coinValEl.textContent = coins;
            isSpinning = true;
            if (typeof triggerQuestProgress === 'function') triggerQuestProgress('spinWheel');

            document.getElementById('btnSpinWheel').disabled = true;
            document.getElementById('btnSpinWheel').textContent = "ĐANG QUAY...";

            sfx.wrong(); // Placeholder cho âm thanh xoay

            let spinTarget = Math.floor(Math.random() * 8);
            let extraSpins = 5;

            let fixAngle = 360 - (spinTarget * 45 + 22.5);
            let targetRotation = currentWheelRotation + (360 - (currentWheelRotation % 360)) + (360 * extraSpins) + fixAngle;

            currentWheelRotation = targetRotation;
            wheelBg.style.transform = `rotate(${targetRotation}deg)`;

            setTimeout(() => {
                let reward = wheelSlices[spinTarget];
                handleWheelReward(reward);
                isSpinning = false;
                document.getElementById('btnSpinWheel').disabled = false;
                document.getElementById('btnSpinWheel').textContent = "QUAY LẠI (50 🟡)";
            }, 5200);
        }

        function handleWheelReward(reward) {
            if (reward.type === "coin") {
                coins += reward.val; coinValEl.textContent = coins;
                fireConfettiOrigin(window.innerWidth / 2, window.innerHeight / 2, 100, 2);
                showFeedback(`Trúng lớn! Nhận ${reward.val} 🟡`, 'success');
                sfx.collect();
            } else if (reward.type === "xp") {
                xp += reward.val;
                let reqXp = 100 * Math.pow(1.5, level - 1);
                if (xp >= reqXp) {
                    xp = xp - reqXp; level++; levelBadge.textContent = level;
                    updateSeasonTheme();
                }
                xpBar.style.width = Math.min((xp / reqXp) * 100, 100) + '%';
                fireConfettiOrigin(window.innerWidth / 2, window.innerHeight / 2, 50, 1.5);
                showFeedback(`Nhận ${reward.val} XP!`, 'success');
                sfx.quizOk();
            } else if (reward.type === "potion") {
                if (tqPotions < 5) tqPotions++;
                updateTqHUD();
                fireConfettiOrigin(window.innerWidth / 2, window.innerHeight / 2, 50, 1.5);
                showFeedback(`Nhận 1 Bình Máu!`, 'success');
                sfx.quizOk();
            } else if (reward.type === "none") {
                showFeedback(`Rất tiếc, bánh xe xui xẻo! Chúc bạn may mắn lần sau.`, 'season-alert');
                sfx.wrong();
            } else if (reward.type === "buff") {
                coins += 100; coinValEl.textContent = coins;
                fireConfettiOrigin(window.innerWidth / 2, window.innerHeight / 2, 200, 3);
                showFeedback(`Nhận Gói Cứu Trợ siêu tốc 100 🟡!`, 'success');
                sfx.collect();
            }
        }

        // --- 3. DAILY QUESTS ---
        const dailyQuests = [
            { id: "sortRgb", title: "Anh hùng phân loại", desc: "Phân loại chuẩn xác 20 món rác", target: 20, progress: 0, reward: 100, claimed: false },
            { id: "playQuiz", title: "Nhà bác học xanh", desc: "Trả lời đúng 3 câu đố vui sinh thái", target: 3, progress: 0, reward: 50, claimed: false },
            { id: "playTq", title: "Dũng sĩ tiêu diệt rác", desc: "Góp sức chơi Minigame 1 lần", target: 1, progress: 0, reward: 80, claimed: false },
            { id: "spinWheel", title: "Thử vận may cuối ngõ", desc: "Quay Vòng Quay Nhân Phẩm 2 lần", target: 2, progress: 0, reward: 120, claimed: false }
        ];

        function renderQuests() {
            const container = document.getElementById('questListContainer');
            container.innerHTML = '';
            dailyQuests.forEach((q, idx) => {
                let btnState = "";
                let btnClass = "quest-btn";
                let btnText = `Nhận ${q.reward} 🟡`;
                if (q.claimed) {
                    btnState = "disabled";
                    btnClass = "quest-btn claimed";
                    btnText = "ĐÃ NHẬN";
                } else if (q.progress >= q.target) {
                    btnClass = "quest-btn claimable";
                    btnText = `NHẬN QUÀ`;
                } else {
                    btnState = "disabled";
                }

                let pct = Math.min((q.progress / q.target) * 100, 100);

                let el = document.createElement('div');
                el.className = 'quest-item';
                el.innerHTML = `
                    <div class="quest-info">
                        <div class="quest-title"><span style="font-size:1.5rem">🎯</span> ${q.title}</div>
                        <div class="quest-desc">${q.desc} (${Math.min(q.progress, q.target)}/${q.target})</div>
                        <div class="quest-progress-bg">
                            <div class="quest-progress-fill" style="width: ${pct}%"></div>
                        </div>
                    </div>
                    <button class="${btnClass}" ${btnState} onclick="claimQuest(${idx})">${btnText}</button>
                `;
                container.appendChild(el);
            });
        }

        function openQuests() { document.getElementById('questsModal').classList.add('active'); renderQuests(); }
        function closeQuests() { document.getElementById('questsModal').classList.remove('active'); }

        function triggerQuestProgress(id, amount = 1) {
            let q = dailyQuests.find(q => q.id === id);
            if (q && !q.claimed && q.progress < q.target) {
                q.progress += amount;
                if (q.progress >= q.target && document.getElementById('questsModal').classList.contains('active')) {
                    renderQuests();
                } else if (q.progress >= q.target) {
                    showFeedback(`🎯 Đã hoàn thành nhiệm vụ: ${q.title}!`, 'success');
                }
            }
        }

        function claimQuest(idx) {
            let q = dailyQuests[idx];
            if (q && q.progress >= q.target && !q.claimed) {
                q.claimed = true;
                coins += q.reward;
                coinValEl.textContent = coins;
                fireConfettiOrigin(window.innerWidth / 2, window.innerHeight / 2, 80, 2);
                showFeedback(`Nhận ${q.reward} 🟡 từ nhiệm vụ!`, 'success');
                sfx.collect();
                renderQuests();
            }
        }

        initAFK();

        // Khởi động
        generateNewTrash();

        // ============================================
        // ======= AI TÁI CHẾ CHATBOT =================
        // ============================================
        let recycleAiOpen = false;

        // CƠ SỞ DỮ LIỆU KIẾN THỨC TÁI CHẾ
        const recycleKnowledge = [
            {
                keywords: ['chai nhựa', 'chai nước', 'pet', 'chai'],
                title: '♻️ Tái chế Chai Nhựa PET',
                items: [
                    { name: '🌱 Chậu cây treo', materials: 'Chai nhựa 1.5L, sơn acrylic, dây thừng, đất trồng', steps: '1. Cắt chai ngang phần 1/3 trên.\n2. Đục 2 lỗ hai bên, luồn dây thừng.\n3. Sơn bên ngoài bằng sơn acrylic.\n4. Đổ đất và trồng cây nhỏ.' },
                    { name: '💡 Đèn lồng trang trí', materials: 'Chai nhựa, dao rọc, nến LED, sơn màu', steps: '1. Rạch các đường dọc quanh chai (cách nhau 1cm).\n2. Ấn nhẹ chai để tạo hình lồng đèn.\n3. Sơn màu yêu thích.\n4. Đặt nến LED bên trong.' },
                    { name: '🧹 Chổi mini', materials: '2 chai nhựa, kéo, dây thép', steps: '1. Cắt đáy chai, rạch thân thành sợi nhỏ.\n2. Lồng chai đã cắt vào cán (chai còn lại).\n3. Buộc chặt bằng dây thép.\n4. Tỉa đều các sợi.' }
                ]
            },
            {
                keywords: ['lon', 'lon bia', 'lon nước', 'nhôm', 'thiếc'],
                title: '🥫 Tái chế Lon Kim Loại',
                items: [
                    { name: '🕯️ Đèn nến handmade', materials: 'Lon nhôm, kéo cắt kim loại, nến tealight', steps: '1. Vẽ họa tiết (ngôi sao, trái tim) lên lon.\n2. Dùng đinh đục lỗ theo họa tiết.\n3. Sơn bên ngoài nếu muốn.\n4. Đặt nến tealight bên trong, ánh sáng sẽ xuyên qua.' },
                    { name: '🎨 Hộp bút', materials: 'Lon nhôm, giấy dán, keo, vải nỉ', steps: '1. Rửa sạch lon, mài nhẵn mép cắt.\n2. Dán giấy hoặc vải nỉ quanh thân lon.\n3. Trang trí bằng sticker, ruy băng.\n4. Có thể dán nam châm phía sau để treo tường.' },
                    { name: '🌿 Hệ thống tưới nhỏ giọt', materials: '3-5 lon, ống nhỏ, keo chống nước', steps: '1. Đục lỗ nhỏ ở đáy mỗi lon.\n2. Nối các lon bằng ống nhỏ.\n3. Đặt lon trên giá cao hơn chậu cây.\n4. Đổ nước vào lon đầu tiên – nước sẽ nhỏ giọt tưới cây tự động.' }
                ]
            },
            {
                keywords: ['giấy', 'báo', 'carton', 'bìa', 'sách'],
                title: '📰 Tái chế Giấy & Carton',
                items: [
                    { name: '📝 Giấy tái sinh handmade', materials: 'Giấy cũ, nước, khung lưới, vải dạ', steps: '1. Xé nhỏ giấy, ngâm nước 2 tiếng.\n2. Xay nhuyễn thành bột giấy.\n3. Đổ bột lên khung lưới, dàn đều.\n4. Ép nước bằng vải dạ, phơi khô.\n5. Có thể thêm hoa khô hoặc lá cây vào bột để tạo điểm nhấn.' },
                    { name: '🏠 Nhà mô hình', materials: 'Thùng carton, keo, sơn, dao rọc', steps: '1. Vẽ và cắt các mặt nhà từ carton.\n2. Dán ghép bằng keo nóng.\n3. Cắt cửa sổ, cửa chính.\n4. Sơn và trang trí.' },
                    { name: '🧺 Giỏ đựng đồ', materials: 'Tạp chí/báo cũ, keo sữa', steps: '1. Cuộn chặt từng trang báo thành ống dài.\n2. Bện các ống thành sợi dài.\n3. Quấn hình xoắn ốc tạo đáy giỏ.\n4. Quấn lên cao tạo thành giỏ, phết keo sữa để cứng.' }
                ]
            },
            {
                keywords: ['vải', 'quần áo', 'áo', 'quần', 'jean', 'jeans'],
                title: '👗 Tái chế Vải & Quần Áo Cũ',
                items: [
                    { name: '👜 Túi tote từ áo cũ', materials: 'Áo thun cũ, kéo, chỉ may', steps: '1. Cắt bỏ tay áo và cổ áo.\n2. Lộn trái, may mép dưới lại.\n3. Lộn lại phần phải – đã có túi tote!\n4. Có thể cắt tua rua ở dưới để đẹp hơn.' },
                    { name: '🧸 Gối ôm handmade', materials: 'Quần áo cũ, bông gòn, kim chỉ', steps: '1. Cắt vải thành 2 miếng hình vuông/tròn.\n2. May úp mặt phải, chừa 1 lỗ nhỏ.\n3. Lộn phải ra, nhồi bông gòn.\n4. Khâu kín lỗ.' },
                    { name: '👛 Ví nhỏ từ quần jean cũ', materials: 'Túi sau quần jean, khóa kéo, kim chỉ', steps: '1. Cắt nguyên túi sau quần jean.\n2. Gấp đôi, may viền 2 bên.\n3. May khóa kéo ở miệng.\n4. Trang trí bằng patch hoặc thêu.' }
                ]
            },
            {
                keywords: ['thủy tinh', 'chai thủy tinh', 'lọ thủy tinh', 'kính'],
                title: '🍾 Tái chế Thủy Tinh',
                items: [
                    { name: '🕯️ Đèn nến từ chai rượu', materials: 'Chai thủy tinh, dây đốt bằng bông, cồn, nước', steps: '1. Tẩy sạch nhãn chai.\n2. Quấn dây bông quanh chai tại vị trí muốn cắt.\n3. Nhúng dây vào cồn, đốt lửa rồi nhúng nhanh vào nước lạnh.\n4. Chai sẽ tách đôi tại vị trí dây. Mài nhẵn mép.\n5. Đặt nến vào phần dưới.' },
                    { name: '🌸 Bình hoa trang trí', materials: 'Lọ thủy tinh, sơn, dây thừng, decal', steps: '1. Rửa sạch và tẩy nhãn.\n2. Sơn quanh lọ bằng sơn acrylic.\n3. Quấn dây thừng quanh cổ lọ.\n4. Dán decal hoặc vẽ họa tiết.' }
                ]
            },
            {
                keywords: ['hộp sữa', 'hộp giấy', 'tetra pak', 'tetra'],
                title: '🥛 Tái chế Hộp Sữa Giấy',
                items: [
                    { name: '👛 Ví đựng tiền mini', materials: '2 hộp sữa, kéo, keo, khóa bấm', steps: '1. Cắt mở hộp sữa thành miếng phẳng.\n2. Gấp theo mẫu ví (nhiều hướng dẫn trên YouTube).\n3. Dán chồng 2 lớp cho cứng.\n4. Gắn khóa bấm.' },
                    { name: '📱 Giá đỡ điện thoại', materials: 'Hộp sữa 1L, kéo, băng keo màu', steps: '1. Cắt hộp thành hình chữ L ngược.\n2. Tạo rãnh ở phía trên để đặt điện thoại.\n3. Dán băng keo màu trang trí.\n4. Có thể đục lỗ cho dây sạc.' }
                ]
            },
            {
                keywords: ['lốp xe', 'lốp', 'cao su', 'săm'],
                title: '⭕ Tái chế Lốp Xe Cũ',
                items: [
                    { name: '🪴 Chậu cây từ lốp xe', materials: 'Lốp xe cũ, sơn, cọ, đất trồng', steps: '1. Rửa sạch lốp xe.\n2. Sơn bằng sơn chịu nhiệt (nhiều màu).\n3. Xếp chồng 2-3 lốp hoặc treo tường.\n4. Đổ đất và trồng hoa/rau.' },
                    { name: '🪑 Ghế ngồi ngoài trời', materials: 'Lốp xe, ván gỗ tròn, vải bọc, bông', steps: '1. Đặt lốp nằm ngang.\n2. Cắt ván gỗ tròn vừa đường kính, đặt lên trên.\n3. Bọc bông và vải.\n4. Cố định bằng keo hoặc đinh vít.' }
                ]
            },
            {
                keywords: ['pin', 'điện tử', 'điện thoại', 'linh kiện', 'dây điện'],
                title: '🔋 Xử Lý Rác Điện Tử An Toàn',
                items: [
                    { name: '⚠️ Lưu ý quan trọng', materials: '', steps: '❌ KHÔNG tự tháo pin lithium – rất dễ cháy nổ!\n❌ KHÔNG vứt pin, điện thoại vào thùng rác thường.\n\n✅ Mang đến điểm thu gom rác điện tử (e-waste):\n   - Cửa hàng FPT, Thế Giới Di Động thường nhận thu.\n   - Điểm thu gom của Sở TN&MT.\n   - Chương trình đổi cũ lấy mới.\n\n✅ Tách riêng pin trước khi bỏ thiết bị.' }
                ]
            },
            {
                keywords: ['ống hút', 'ống hút nhựa', 'hạt xốp'],
                title: '🧋 Tái chế Ống Hút & Xốp',
                items: [
                    { name: '🌟 Khung ảnh ống hút', materials: '20+ ống hút, bìa carton, keo', steps: '1. Cắt bìa carton thành khung ảnh.\n2. Cắt ống hút thành đoạn ngắn (2-3cm).\n3. Dán ống hút quanh khung tạo hoa văn.\n4. Sơn phủ nếu muốn đồng màu.' },
                    { name: '🎄 Cây thông Noel mini', materials: 'Ống hút xanh, kéo, keo, ngôi sao', steps: '1. Cắt ống hút thành các đoạn giảm dần (15cm, 13cm, 11cm...).\n2. Dán đều lên cán gỗ theo tầng.\n3. Gắn ngôi sao ở đỉnh.\n4. Trang trí bằng hạt cườm.' }
                ]
            },
            {
                keywords: ['vỏ trứng', 'trứng'],
                title: '🥚 Tái chế Vỏ Trứng',
                items: [
                    { name: '🎨 Tranh mosaic vỏ trứng', materials: 'Vỏ trứng rửa sạch, bìa cứng, keo, sơn acrylic', steps: '1. Rửa sạch vỏ trứng, phơi khô.\n2. Bẻ vỡ vụn thành mảnh nhỏ.\n3. Vẽ hình lên bìa cứng.\n4. Dán vỏ trứng theo từng mảng màu.\n5. Sơn phủ acrylic lên vỏ trứng đã dán.' },
                    { name: '🌱 Chậu ươm mini', materials: 'Nửa vỏ trứng, đất ươm, hạt giống, khay đựng', steps: '1. Rửa sạch nửa vỏ trứng.\n2. Đục lỗ nhỏ ở đáy thoát nước.\n3. Đổ đất ươm, gieo hạt.\n4. Khi cây lớn, trồng nguyên (vỏ trứng phân hủy bổ sung canxi).' }
                ]
            }
        ];

        const recycleGreetings = [
            "Xin chào! Tôi là **AI Eco** 🌍\n\nTôi là trợ lý thông minh, có thể giúp bạn:\n• 💬 Trả lời **mọi câu hỏi** bạn thắc mắc\n• ♻️ Hướng dẫn **tái chế** và làm đồ handmade\n• 🌱 Tư vấn **môi trường** và sống xanh\n• 📚 Giải thích **khoa học**, công nghệ, lịch sử...\n• 💡 Gợi ý **ý tưởng** sáng tạo\n\nHãy hỏi tôi bất cứ điều gì!",
        ];

        const suggestedQuestions = [
            "Chai nhựa làm được gì?",
            "Tại sao bảo vệ môi trường quan trọng?",
            "Cách tiết kiệm điện ở nhà",
            "Nhựa phân hủy bao lâu?",
            "Giải thích hiệu ứng nhà kính",
            "Cách xử lý pin cũ an toàn",
            "Làm sao sống xanh mỗi ngày?",
            "Tái chế giấy báo cũ",
            "Biến đổi khí hậu là gì?",
            "Kể về nhiệm vụ của game này"
        ];

        function toggleRecycleAi() {
            recycleAiOpen = !recycleAiOpen;
            document.getElementById('recycleAiPanel').classList.toggle('active', recycleAiOpen);
            document.getElementById('recycleAiFab').classList.toggle('active', recycleAiOpen);
            if (recycleAiOpen && document.getElementById('recycleMessages').children.length === 0) {
                addBotMessage(recycleGreetings[0]);
                showSuggestions();
            }
        }

        function addBotMessage(text) {
            let msgDiv = document.createElement('div');
            msgDiv.style.cssText = 'display:flex;gap:10px;align-items:flex-start;margin-bottom:15px;';
            msgDiv.innerHTML = `
                <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">🌍</div>
                <div class="ai-msg-content" style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.2);border-radius:4px 18px 18px 18px;padding:12px 16px;max-width:85%;color:#e2e8f0;font-size:0.95rem;line-height:1.6;">${formatAiText(text)}</div>
            `;
            document.getElementById('recycleMessages').appendChild(msgDiv);
            if (typeof hljs !== 'undefined') {
                msgDiv.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }
            scrollChatBottom();
        }

        function addUserMessage(text) {
            let msgDiv = document.createElement('div');
            msgDiv.style.cssText = 'display:flex;gap:10px;align-items:flex-start;margin-bottom:15px;justify-content:flex-end;';
            msgDiv.innerHTML = `
                <div style="background:linear-gradient(135deg,#3b82f6,#2563eb);border-radius:18px 4px 18px 18px;padding:12px 16px;max-width:85%;color:white;font-size:0.9rem;line-height:1.5;">${escapeHtml(text)}</div>
            `;
            document.getElementById('recycleMessages').appendChild(msgDiv);
            scrollChatBottom();
        }

        function formatAiText(text) {
            if (typeof marked !== 'undefined') {
                return `<div class="ai-markdown">${marked.parse(text)}</div>`;
            }
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#34d399">$1</strong>')
                .replace(/\n/g, '<br>');
        }

        function escapeHtml(text) {
            return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        function scrollChatBottom() {
            let c = document.getElementById('recycleMessages');
            setTimeout(() => { c.scrollTop = c.scrollHeight; }, 50);
        }

        function showSuggestions() {
            let sugDiv = document.createElement('div');
            sugDiv.className = 'recycle-suggestions';
            sugDiv.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin-bottom:15px;';
            let shuffled = suggestedQuestions.sort(() => Math.random() - 0.5).slice(0, 4);
            shuffled.forEach(q => {
                let btn = document.createElement('button');
                btn.style.cssText = 'background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#34d399;padding:6px 12px;border-radius:20px;font-size:0.8rem;cursor:pointer;transition:all 0.2s;';
                btn.textContent = q;
                btn.onclick = () => {
                    document.getElementById('recycleInput').value = q;
                    sendRecycleQuestion();
                    // Xóa suggestions cũ
                    document.querySelectorAll('.recycle-suggestions').forEach(s => s.remove());
                };
                sugDiv.appendChild(btn);
            });
            document.getElementById('recycleMessages').appendChild(sugDiv);
            scrollChatBottom();
        }

        function showTypingIndicator() {
            let typing = document.createElement('div');
            typing.id = 'typingIndicator';
            typing.style.cssText = 'display:flex;gap:10px;align-items:flex-start;margin-bottom:15px;';
            typing.innerHTML = `
                <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">🌍</div>
                <div style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.2);border-radius:4px 18px 18px 18px;padding:12px 20px;color:#94a3b8;font-size:0.85rem;">
                    <span class="typing-dots">Đang suy nghĩ<span>.</span><span>.</span><span>.</span></span>
                </div>
            `;
            document.getElementById('recycleMessages').appendChild(typing);
            scrollChatBottom();
        }

        function removeTypingIndicator() {
            let t = document.getElementById('typingIndicator');
            if (t) t.remove();
        }

        // === GEMINI API INTEGRATION ===
        let geminiApiKey = localStorage.getItem('geminiApiKey') || '';
        let chatHistory = []; // Lưu lịch sử hội thoại

        const AI_SYSTEM_PROMPT = `Bạn là "AI Eco" – một trợ lý AI siêu thông minh, thân thiện, chào đón, được tích hợp trong ứng dụng "AI Sort" về phân loại rác và bảo vệ môi trường.

Bạn có thể trả lời TẤT CẢ MỌI CÂU HỎI của người dùng, không giới hạn chỉ về tái chế. Bao gồm: lập trình, khoa học, công nghệ, lịch sử, toán học, văn học, đời sống, sức khỏe, nấu ăn, v.v. Bạn hoạt động trên sức mạnh của một AI hiện đại.

Đặc biệt chuyên sâu về:
- Tái chế vật liệu (chai nhựa, lon, giấy, vải, thủy tinh...)
- Hướng dẫn làm đồ handmade từ rác
- Môi trường, biến đổi khí hậu, sống xanh
- Phân loại rác (🟢 Hữu cơ, 🔵 Tái chế, 🟡 Vô cơ, 🔴 Nguy hại)

🔥 QUY TẮC TRẢ LỜI QUAN TRỌNG:
1. TRÌNH BÀY BẰNG MARKDOWN: Sử dụng phong phú định dạng MD (Heading, In đậm, In nghiêng, Danh sách bullet, Danh sách số, Bảng biểu...).
2. Đặc biệt, TẤT CẢ các đoạn mã (code) phải được bọc trong block \`\`\`ngôn_ngữ ... \`\`\`.
3. Dùng thật nhiều emoji 🌟 sinh động và phù hợp ngữ cảnh.
4. Trả lời bằng Tiếng Việt thân thiện, rõ ràng, hiện đại. Dễ đọc.`;

        function setupApiKey() {
            addBotMessage('✅ Hệ thống AI đã được nâng cấp siêu trí tuệ chạy miễn phí vô hạn. Bạn không cần tìm cấu hình API Key rườm rà nữa nha! 🌟');
        }

        async function sendRecycleQuestion() {
            let input = document.getElementById('recycleInput');
            let question = input.value.trim();
            if (!question) return;

            addUserMessage(question);
            input.value = '';

            // Xóa suggestions cũ
            document.querySelectorAll('.recycle-suggestions').forEach(s => s.remove());

            showTypingIndicator();

            // Sử dụng AI Model miễn phí qua Pollinations AI (Không cần API_KEY)
            try {
                chatHistory.push({ role: 'user', parts: [{ text: question }] });
                let pollinationsMessages = [{ role: 'system', content: AI_SYSTEM_PROMPT }];
                chatHistory.slice(-10).forEach(msg => {
                    pollinationsMessages.push({
                        role: msg.role === 'model' ? 'assistant' : 'user',
                        content: msg.parts[0].text
                    });
                });

                let response = await fetch("https://text.pollinations.ai/", {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'omit',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: pollinationsMessages
                    })
                });

                let aiText = await response.text();
                removeTypingIndicator();

                if (aiText && !aiText.error) {
                    chatHistory.push({ role: 'model', parts: [{ text: aiText }] });
                    addBotMessage(aiText);
                } else {
                    addBotMessage(generateRecycleResponse(question));
                }
            } catch (err) {
                removeTypingIndicator();
                addBotMessage('📡 Lỗi mạng hoặc server quá tải. Đang dùng trí nhớ có sẵn...');
                let fallback = generateRecycleResponse(question);
                addBotMessage(fallback);
            }

            showSuggestions();
        }

        function generateRecycleResponse(question) {
            let q = question.toLowerCase();

            // Tìm trong knowledge base
            for (let topic of recycleKnowledge) {
                let matched = topic.keywords.some(k => q.includes(k));
                if (matched) {
                    let result = `**${topic.title}**\n\nĐây là những gì bạn có thể làm:\n\n`;
                    topic.items.forEach((item, i) => {
                        result += `**${i + 1}. ${item.name}**\n`;
                        if (item.materials) result += `📦 Vật liệu: ${item.materials}\n`;
                        result += `📋 Cách làm:\n${item.steps}\n\n`;
                    });
                    return result.trim();
                }
            }

            if (q.includes('tái chế') && (q.includes('là gì') || q.includes('nghĩa'))) {
                return "**Tái chế là gì?** ♻️\n\nTái chế là quá trình **chuyển đổi rác thải** thành vật liệu hoặc sản phẩm mới, giúp:\n\n🌍 Giảm ô nhiễm môi trường\n🏭 Tiết kiệm tài nguyên\n💰 Tạo giá trị kinh tế\n🌿 Giảm rác chôn lấp";
            }

            if (q.includes('xin chào') || q.includes('hello') || q.includes('hi') || q.includes('chào')) {
                return "Xin chào bạn! 👋🌍\n\nTôi là **AI Eco Đã Cải Tiến**, sẵn sàng giúp bạn mọi thứ!\n\nBạn có thể hỏi tôi về bất cứ điều gì – tái chế, môi trường, khoa học, hay cuộc sống hàng ngày!\n\n💡 **Mẹo**: Hệ thống AI nay đã không giới hạn sức mạnh, không cần API Key!";
            }

            if (q.includes('cảm ơn') || q.includes('cám ơn') || q.includes('thanks')) {
                return "Không có gì! 😊🌍\n\nRất vui được giúp bạn! Hãy hỏi thêm nếu cần nhé! 💫";
            }

            if (q.includes('phân loại') || q.includes('loại rác')) {
                return "**Hướng dẫn Phân Loại Rác** 🗑️\n\n🟢 **Hữu cơ** – Thức ăn thừa, lá cây\n→ Ủ phân compost\n\n🔵 **Tái chế** – Chai nhựa, lon, giấy\n→ Rửa sạch, bỏ thùng xanh dương\n\n🟡 **Vô cơ** – Nilon bẩn, xốp, tã\n→ Bỏ thùng rác thường\n\n🔴 **Nguy hại** – Pin, bóng đèn, thuốc\n→ Mang đến điểm thu gom chuyên biệt";
            }

            // Fallback
            return `Hệ thống AI đang khởi động hoặc quá tải 🌍\n\n💡 Bạn có thể hỏi tôi về **tái chế** (chai nhựa, lon, giấy, vải, pin...) – tôi có kiến thức offline rất tốt phục vụ bạn!`;
        }

        // Enter để gửi
        document.getElementById('recycleInput').addEventListener('keydown', e => {
            if (e.key === 'Enter') sendRecycleQuestion();
        });
    

// --- TÀI KHOẢN & BẢNG XẾP HẠNG ---
let currentUser = localStorage.getItem('ai_sort_username') || '';

function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
    document.getElementById('usernameInput').value = currentUser;
    updateUserDisplay();
}
function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
}
function saveUsername() {
    let name = document.getElementById('usernameInput').value.trim();
    if (name) {
        currentUser = name;
        localStorage.setItem('ai_sort_username', currentUser);
        updateUserDisplay();
        alert('Đã lưu tên: ' + currentUser);
    }
}
function updateUserDisplay() {
    let display = document.getElementById('currentUserDisplay');
    if (display) {
        display.innerText = currentUser ? "Xin chào, " + currentUser + "!" : "Chưa đăng nhập";
    }
}

const mockLeaderboard = [
    {name: "EcoWarrior99", score: 15400},
    {name: "GreenEarth", score: 12200},
    {name: "TrashNinja", score: 9500},
    {name: "RecycleKing", score: 8100},
    {name: "NatureLover", score: 5400},
    {name: "CleanCity", score: 4200},
    {name: "OceanSaver", score: 3100},
];

function openLeaderboardModal() {
    document.getElementById('leaderboardModal').classList.add('active');
    renderLeaderboard();
}
function closeLeaderboardModal() {
    document.getElementById('leaderboardModal').classList.remove('active');
}

function renderLeaderboard() {
    let list = [...mockLeaderboard];
    if (currentUser) {
        // Filter out old entry if exists to avoid duplicates in mock
        list = list.filter(p => p.name !== currentUser);
        list.push({name: currentUser, score: score, isMe: true});
    }
    
    list.sort((a, b) => b.score - a.score);
    
    let html = '';
    list.forEach((p, index) => {
        let rankColor = index === 0 ? '#fbbf24' : (index === 1 ? '#cbd5e1' : (index === 2 ? '#b45309' : '#fff'));
        let bg = p.isMe ? 'background: rgba(59, 130, 246, 0.2);' : '';
        html += `<tr style="border-bottom: 1px solid rgba(255,255,255,0.05); ${bg}">
            <td style="padding: 10px; color: ${rankColor}; font-weight: bold;">#${index + 1}</td>
            <td style="padding: 10px; color: ${p.isMe ? '#60a5fa' : '#fff'}">${p.name} ${p.isMe ? '(Bạn)' : ''}</td>
            <td style="padding: 10px; color: #4ade80;">${p.score}</td>
        </tr>`;
    });
    
    document.getElementById('leaderboardBody').innerHTML = html;
}

// --- TIME ATTACK MODE ---
let timeAttackInterval = null;
let timeAttackTime = 60;
let isTimeAttack = false;

function startTimeAttack() {
    if(isTimeAttack) return;
    showFeedback('⏱️ Thử Thách 60s Bắt Đầu! Phân loại thật nhanh!', 'success');
    isTimeAttack = true;
    timeAttackTime = 60;
    
    document.getElementById('trashName').innerText = "⏱️ Thời gian: 60s";
    document.getElementById('trashName').style.color = "#fca5a5";
    
    timeAttackInterval = setInterval(() => {
        timeAttackTime--;
        document.getElementById('trashName').innerText = "⏱️ Thời gian: " + timeAttackTime + "s";
        
        if(timeAttackTime <= 0) {
            endTimeAttack();
        }
    }, 1000);
}

function endTimeAttack() {
    clearInterval(timeAttackInterval);
    isTimeAttack = false;
    coins += 500;
    document.getElementById('coinCount').textContent = coins;
    if(typeof saveGameData === 'function') saveGameData();
    document.getElementById('trashName').innerText = "Hệ thống sẵn sàng";
    document.getElementById('trashName').style.color = "";
    showFeedback('🏆 Hết giờ! +500 Vàng!', 'success');
}


// ============================================
// ECO RUSH - ARCADE FALLING TRASH GAME
// ============================================
let erActive = false, erAnimId = null, erItems = [], erScore2 = 0, erCombo2 = 0, erLives = 3;
let erCoinsEarned = 0, erSpeed = 2, erSpawnRate = 60, erFrame = 0, erCanvas, erCtx;
let erCurrentItem = null;

function startEcoRush() {
    erActive = true; erScore2 = 0; erCombo2 = 0; erLives = 3; erCoinsEarned = 0;
    erSpeed = 2; erSpawnRate = 55; erFrame = 0; erItems = []; erCurrentItem = null;
    
    document.getElementById('ecoRushOverlay').classList.add('active');
    document.getElementById('erResult').style.display = 'none';
    document.getElementById('erScore').textContent = '0';
    document.getElementById('erCombo').textContent = '0';
    document.getElementById('erCoins').textContent = '0';
    updateErLives();
    
    erCanvas = document.getElementById('ecoRushCanvas');
    erCtx = erCanvas.getContext('2d');
    resizeErCanvas();
    window.addEventListener('resize', resizeErCanvas);
    
    erGameLoop();
}

function resizeErCanvas() {
    if (!erCanvas) return;
    erCanvas.width = erCanvas.parentElement.clientWidth;
    erCanvas.height = erCanvas.parentElement.clientHeight - 120;
}

function updateErLives() {
    let h = '';
    for (let i = 0; i < erLives; i++) h += String.fromCodePoint(0x2764, 0xFE0F);
    for (let i = erLives; i < 3; i++) h += String.fromCodePoint(0x1F5A4);
    document.getElementById('erLives').textContent = h;
}

function erSpawnItem() {
    let item = trashData[Math.floor(Math.random() * trashData.length)];
    let w = erCanvas.width;
    erItems.push({
        x: 40 + Math.random() * (w - 80),
        y: -40,
        emoji: item.emoji,
        type: item.type,
        name: item.name,
        speed: erSpeed + Math.random() * 1.5,
        size: 36
    });
}

function erGameLoop() {
    if (!erActive) return;
    erCtx.clearRect(0, 0, erCanvas.width, erCanvas.height);
    erFrame++;
    
    // Spawn
    if (erFrame % Math.floor(erSpawnRate) === 0) erSpawnItem();
    
    // Increase difficulty
    if (erFrame % 300 === 0) {
        erSpeed = Math.min(erSpeed + 0.3, 8);
        erSpawnRate = Math.max(erSpawnRate - 2, 20);
    }
    
    // Highlight current (lowest) item
    let lowestIdx = -1, lowestY = -1;
    for (let i = 0; i < erItems.length; i++) {
        if (erItems[i].y > lowestY) { lowestY = erItems[i].y; lowestIdx = i; }
    }
    erCurrentItem = lowestIdx >= 0 ? erItems[lowestIdx] : null;
    
    // Draw items
    erCtx.font = '36px serif';
    erCtx.textAlign = 'center';
    for (let i = 0; i < erItems.length; i++) {
        let it = erItems[i];
        it.y += it.speed;
        
        // Highlight lowest item
        if (i === lowestIdx) {
            erCtx.globalAlpha = 1;
            erCtx.fillText(it.emoji, it.x, it.y);
            // Draw name below
            erCtx.font = '11px Plus Jakarta Sans, sans-serif';
            erCtx.fillStyle = '#6b6b80';
            erCtx.fillText(it.name, it.x, it.y + 20);
            erCtx.font = '36px serif';
            erCtx.fillStyle = '#e2e2e8';
        } else {
            erCtx.globalAlpha = 0.4;
            erCtx.fillText(it.emoji, it.x, it.y);
            erCtx.globalAlpha = 1;
        }
        
        // Missed - fell off screen
        if (it.y > erCanvas.height + 40) {
            erItems.splice(i, 1); i--;
            erCombo2 = 0;
            erLives--;
            updateErLives();
            document.getElementById('erCombo').textContent = erCombo2;
            if (erLives <= 0) { endEcoRush(); return; }
        }
    }
    
    erAnimId = requestAnimationFrame(erGameLoop);
}

function erCatchBin(type) {
    if (!erActive || !erCurrentItem) return;
    
    let item = erCurrentItem;
    let idx = erItems.indexOf(item);
    if (idx === -1) return;
    
    erItems.splice(idx, 1);
    
    if (item.type === type) {
        // Correct!
        erCombo2++;
        let pts = 10 + Math.floor(erCombo2 / 3) * 5;
        let coinGain = 2 + Math.floor(erCombo2 / 5);
        erScore2 += pts;
        erCoinsEarned += coinGain;
        
        document.getElementById('erScore').textContent = erScore2;
        document.getElementById('erCombo').textContent = erCombo2;
        document.getElementById('erCoins').textContent = erCoinsEarned;
        
        if (typeof sfx !== 'undefined') sfx.collect();
    } else {
        // Wrong!
        erCombo2 = 0;
        erLives--;
        updateErLives();
        document.getElementById('erCombo').textContent = '0';
        if (typeof sfx !== 'undefined') sfx.wrong();
        if (erLives <= 0) { endEcoRush(); return; }
    }
}

function endEcoRush() {
    erActive = false;
    if (erAnimId) cancelAnimationFrame(erAnimId);
    
    // Award coins
    if (typeof coins !== 'undefined') {
        coins += erCoinsEarned;
        document.getElementById('coinCount').textContent = coins;
        if (typeof saveGameData === 'function') saveGameData();
    }
    
    let body = document.getElementById('erResultBody');
    body.innerHTML = '<div style="font-size:2.5rem;margin:10px 0">' + erScore2 + '</div>' +
        '<div style="color:#6b6b80;margin-bottom:8px">diem</div>' +
        '<div style="color:#fbbf24;font-weight:700;font-size:1.1rem">+' + erCoinsEarned + ' xu da duoc cong</div>';
    document.getElementById('erResult').style.display = 'block';
}

function exitEcoRush() {
    erActive = false;
    if (erAnimId) cancelAnimationFrame(erAnimId);
    window.removeEventListener('resize', resizeErCanvas);
    document.getElementById('ecoRushOverlay').classList.remove('active');
}
// ============================================
