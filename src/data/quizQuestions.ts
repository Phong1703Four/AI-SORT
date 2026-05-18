export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: {
      vi: "Mất bao lâu để một chai nhựa phân hủy hoàn toàn trong môi trường tự nhiên?",
      en: "How long does it take for a plastic bottle to completely decompose in the natural environment?"
    },
    options: [
      { vi: "10 - 20 năm", en: "10 - 20 years" },
      { vi: "50 - 100 năm", en: "50 - 100 years" },
      { vi: "450 - 1000 năm", en: "450 - 1000 years" },
      { vi: "Không bao giờ phân hủy", en: "Never decomposes" }
    ],
    correctIndex: 2,
    explanation: {
      vi: "Chai nhựa cực kỳ khó phân hủy. Nó sẽ tồn tại từ 450 năm đến 1000 năm, phân rã thành vi nhựa và tiếp tục gây hại cho hệ sinh thái.",
      en: "Plastic bottles are extremely hard to decompose. They will exist from 450 to 1000 years, breaking down into microplastics and continuing to harm the ecosystem."
    }
  },
  {
    id: 2,
    question: {
      vi: "Đâu là cách xử lý pin đã qua sử dụng đúng nhất?",
      en: "What is the most proper way to dispose of used batteries?"
    },
    options: [
      { vi: "Vứt vào thùng rác vô cơ", en: "Throw in inorganic bin" },
      { vi: "Chôn xuống đất", en: "Bury in the ground" },
      { vi: "Đốt để tiêu hủy", en: "Burn to destroy" },
      { vi: "Gom lại mang đến điểm thu hồi pin", en: "Collect and bring to battery recycling point" }
    ],
    correctIndex: 3,
    explanation: {
      vi: "Pin chứa kim loại nặng (chì, thủy ngân, kẽm). Vứt bừa bãi sẽ ô nhiễm đất và nước ngầm. Phải gom lại đem đến điểm thu hồi rác điện tử.",
      en: "Batteries contain heavy metals (lead, mercury, zinc). Improper disposal pollutes soil and groundwater. Must be collected and brought to e-waste recycling points."
    }
  },
  {
    id: 3,
    question: {
      vi: "Nguyên tắc '3T' (3R) trong bảo vệ môi trường là gì?",
      en: "What is the '3R' principle in environmental protection?"
    },
    options: [
      { vi: "Tiết kiệm - Thân thiện - Thông minh", en: "Save - Friendly - Smart" },
      { vi: "Tiết giảm - Tái sử dụng - Tái chế", en: "Reduce - Reuse - Recycle" },
      { vi: "Trồng cây - Thu gom - Tiêu hủy", en: "Plant - Collect - Destroy" },
      { vi: "Thay thế - Tái tạo - Thích ứng", en: "Replace - Regenerate - Adapt" }
    ],
    correctIndex: 1,
    explanation: {
      vi: "Nguyên tắc 3R (Reduce - Reuse - Recycle) dịch ra tiếng Việt là Tiết giảm, Tái sử dụng và Tái chế.",
      en: "The 3R principle stands for Reduce, Reuse, and Recycle."
    }
  },
  {
    id: 4,
    question: {
      vi: "Loại rác nào sau đây dùng để ủ làm phân bón compost?",
      en: "Which of the following types of waste is used for composting?"
    },
    options: [
      { vi: "Túi nilon rách", en: "Torn plastic bags" },
      { vi: "Xỉ than", en: "Coal ash" },
      { vi: "Vỏ trái cây và rau củ", en: "Fruit and vegetable peels" },
      { vi: "Gốm sứ vỡ", en: "Broken ceramics" }
    ],
    correctIndex: 2,
    explanation: {
      vi: "Vỏ trái cây, rau củ là rác hữu cơ dễ phân hủy, ủ chúng tạo ra phân bón sinh học rất tốt cho cây trồng.",
      en: "Fruit and vegetable peels are easily biodegradable organic waste. Composting them creates bio-fertilizer which is very good for plants."
    }
  },
  {
    id: 5,
    question: {
      vi: "Tại sao không nên đốt rác thải nhựa tại nhà?",
      en: "Why shouldn't you burn plastic waste at home?"
    },
    options: [
      { vi: "Khó cháy", en: "Hard to burn" },
      { vi: "Tạo ra khí độc Dioxin và Furan", en: "Produces toxic Dioxin and Furan gases" },
      { vi: "Tốn thời gian", en: "Time-consuming" },
      { vi: "Tro nhựa khó dọn", en: "Plastic ash is hard to clean" }
    ],
    correctIndex: 1,
    explanation: {
      vi: "Đốt nhựa sinh ra khí Dioxin và Furan cực độc, có khả năng gây ung thư và đột biến gen.",
      en: "Burning plastic produces extremely toxic Dioxin and Furan gases, which can cause cancer and genetic mutations."
    }
  },
  {
    id: 6,
    question: {
      vi: "Khí nhà kính nào phát thải nhiều nhất từ các bãi rác chôn lấp?",
      en: "Which greenhouse gas is emitted the most from landfills?"
    },
    options: [
      { vi: "Oxy (O2)", en: "Oxygen (O2)" },
      { vi: "Cacbon đioxit (CO2)", en: "Carbon dioxide (CO2)" },
      { vi: "Metan (CH4)", en: "Methane (CH4)" },
      { vi: "Nitơ (N2)", en: "Nitrogen (N2)" }
    ],
    correctIndex: 2,
    explanation: {
      vi: "Quá trình phân hủy rác hữu cơ trong điều kiện thiếu oxy tại các bãi chôn lấp sinh ra lượng lớn khí Metan (CH4), một loại khí nhà kính mạnh.",
      en: "The decomposition of organic waste under anaerobic conditions in landfills produces a large amount of Methane (CH4), a potent greenhouse gas."
    }
  },
  {
    id: 7,
    question: {
      vi: "Giấy báo, bìa carton đã qua sử dụng nên được bỏ vào thùng rác nào?",
      en: "Which bin should used newspapers and cardboard be put into?"
    },
    options: [
      { vi: "Hữu cơ", en: "Organic" },
      { vi: "Vô cơ", en: "Inorganic" },
      { vi: "Tái chế", en: "Recycle" },
      { vi: "Nguy hại", en: "Hazardous" }
    ],
    correctIndex: 2,
    explanation: {
      vi: "Giấy báo và bìa carton khô ráo, sạch sẽ hoàn toàn có thể được tái chế thành các sản phẩm giấy mới.",
      en: "Dry and clean newspapers and cardboard can be fully recycled into new paper products."
    }
  },
  {
    id: 8,
    question: {
      vi: "Rác thải y tế như kim tiêm, băng gạc dính máu thuộc loại rác nào?",
      en: "Medical waste like needles and bloody bandages belong to which type of waste?"
    },
    options: [
      { vi: "Tái chế", en: "Recycle" },
      { vi: "Nguy hại sinh học", en: "Biohazardous" },
      { vi: "Hữu cơ", en: "Organic" },
      { vi: "Vô cơ", en: "Inorganic" }
    ],
    correctIndex: 1,
    explanation: {
      vi: "Đây là rác thải nguy hại sinh học (lây nhiễm), cần được phân loại riêng biệt và xử lý tại các nhà máy tiêu hủy chuyên dụng.",
      en: "This is biohazardous (infectious) waste, which must be sorted separately and processed at specialized disposal facilities."
    }
  },
  {
    id: 9,
    question: {
      vi: "Một chiếc áo len cũ, rách không thể mặc được nữa nên xử lý thế nào?",
      en: "How should an old, torn sweater that can no longer be worn be disposed of?"
    },
    options: [
      { vi: "Vứt thùng rác hữu cơ", en: "Throw in organic bin" },
      { vi: "Đốt đi", en: "Burn it" },
      { vi: "Vứt thùng vô cơ/tái chế vải", en: "Throw in inorganic bin / fabric recycling" },
      { vi: "Chôn làm phân bón", en: "Bury for fertilizer" }
    ],
    correctIndex: 2,
    explanation: {
      vi: "Vải vóc cũ thường được xếp vào rác vô cơ, nhưng ở nhiều nơi chúng có thể được thu gom để tái chế thành thảm chùi chân hoặc sợi công nghiệp.",
      en: "Old fabrics are usually classified as inorganic waste, but in many places they can be collected to be recycled into doormats or industrial fibers."
    }
  },
  {
    id: 10,
    question: {
      vi: "Chai thủy tinh đựng nước mắm sau khi dùng hết nên làm gì?",
      en: "What should be done with an empty fish sauce glass bottle?"
    },
    options: [
      { vi: "Đập vỡ rồi vứt", en: "Smash then throw away" },
      { vi: "Vứt thùng rác vô cơ", en: "Throw in inorganic bin" },
      { vi: "Rửa sạch, bỏ thùng tái chế", en: "Clean and put in recycle bin" },
      { vi: "Vứt xuống sông", en: "Throw into the river" }
    ],
    correctIndex: 2,
    explanation: {
      vi: "Thủy tinh có thể tái chế 100% và không giới hạn số lần. Bạn cần rửa sạch để tránh bốc mùi trước khi bỏ vào thùng tái chế.",
      en: "Glass is 100% recyclable and infinitely recyclable. You need to wash it to avoid odor before putting it in the recycle bin."
    }
  },
  {
    id: 11,
    question: {
      vi: "Tại sao nên hạn chế sử dụng túi nilon dùng một lần?",
      en: "Why should we limit the use of single-use plastic bags?"
    },
    options: [
      { vi: "Vì nó đắt", en: "Because they are expensive" },
      { vi: "Vì nó làm mất mỹ quan", en: "Because they are an eyesore" },
      { vi: "Vì mất hàng trăm năm để phân hủy và gây ô nhiễm vi nhựa", en: "Because it takes hundreds of years to decompose and causes microplastic pollution" },
      { vi: "Vì nó gây mùi hôi", en: "Because they cause bad odor" }
    ],
    correctIndex: 2,
    explanation: {
      vi: "Túi nilon mất hàng trăm năm để tự phân rã ngoài tự nhiên, cuối cùng biến thành vi nhựa thâm nhập vào chuỗi thức ăn.",
      en: "Plastic bags take hundreds of years to break down in nature, eventually turning into microplastics that enter the food chain."
    }
  },
  {
    id: 12,
    question: {
      vi: "Theo quy định ở nhiều thành phố, rác sinh hoạt phải được phân thành mấy loại cơ bản?",
      en: "According to regulations in many cities, how many basic categories must household waste be sorted into?"
    },
    options: [
      { vi: "1 loại", en: "1 category" },
      { vi: "2 loại", en: "2 categories" },
      { vi: "3 loại", en: "3 categories" },
      { vi: "5 loại", en: "5 categories" }
    ],
    correctIndex: 2,
    explanation: {
      vi: "Phổ biến nhất hiện nay là phân thành 3 loại: Rác tái chế, Rác hữu cơ, và Rác vô cơ (rác còn lại).",
      en: "The most common currently is sorting into 3 categories: Recyclable waste, Organic waste, and Inorganic waste (remaining waste)."
    }
  },
  {
    id: 13,
    question: {
      vi: "Đâu KHÔNG phải là nguồn năng lượng tái tạo?",
      en: "Which of the following is NOT a renewable energy source?"
    },
    options: [
      { vi: "Năng lượng mặt trời", en: "Solar energy" },
      { vi: "Năng lượng gió", en: "Wind energy" },
      { vi: "Than đá", en: "Coal" },
      { vi: "Năng lượng sinh khối", en: "Biomass energy" }
    ],
    correctIndex: 2,
    explanation: {
      vi: "Than đá là nhiên liệu hóa thạch, cần hàng triệu năm để hình thành và không thể tái tạo trong thời gian ngắn, khi đốt sinh ra nhiều khí thải.",
      en: "Coal is a fossil fuel, takes millions of years to form and cannot be replenished in a short time; burning it produces many emissions."
    }
  },
  {
    id: 14,
    question: {
      vi: "Bóng đèn huỳnh quang hỏng thuộc nhóm rác nào?",
      en: "Broken fluorescent light bulbs belong to which waste group?"
    },
    options: [
      { vi: "Tái chế", en: "Recycle" },
      { vi: "Nguy hại", en: "Hazardous" },
      { vi: "Vô cơ", en: "Inorganic" },
      { vi: "Hữu cơ", en: "Organic" }
    ],
    correctIndex: 1,
    explanation: {
      vi: "Bóng đèn huỳnh quang chứa lượng nhỏ thủy ngân - một kim loại nặng rất độc, do đó chúng thuộc loại rác nguy hại.",
      en: "Fluorescent bulbs contain a small amount of mercury - a highly toxic heavy metal, thus they belong to hazardous waste."
    }
  },
  {
    id: 15,
    question: {
      vi: "Chất dẻo (nhựa) được phát minh từ nguyên liệu chính nào?",
      en: "Plastic is mainly invented from which raw material?"
    },
    options: [
      { vi: "Cây cao su", en: "Rubber tree" },
      { vi: "Đất sét", en: "Clay" },
      { vi: "Dầu mỏ", en: "Petroleum" },
      { vi: "Silica", en: "Silica" }
    ],
    correctIndex: 2,
    explanation: {
      vi: "Hầu hết các loại nhựa ngày nay được tổng hợp từ các dẫn xuất của dầu mỏ, một loại tài nguyên không tái tạo.",
      en: "Most plastics today are synthesized from petroleum derivatives, a non-renewable resource."
    }
  },
  {
    id: 16,
    question: {
      vi: "Thuật ngữ 'Vi nhựa' (Microplastics) chỉ những hạt nhựa có kích thước nhỏ hơn bao nhiêu?",
      en: "The term 'Microplastics' refers to plastic particles smaller than what size?"
    },
    options: [
      { vi: "5 cm", en: "5 cm" },
      { vi: "5 mm", en: "5 mm" },
      { vi: "5 micromet", en: "5 micrometers" },
      { vi: "5 nanomet", en: "5 nanometers" }
    ],
    correctIndex: 1,
    explanation: {
      vi: "Vi nhựa là những mảnh nhựa có đường kính nhỏ hơn 5mm. Chúng đang là vấn nạn toàn cầu vì dễ lọt qua hệ thống lọc nước và vào cơ thể sinh vật.",
      en: "Microplastics are plastic pieces with a diameter of less than 5mm. They are a global issue as they easily slip through water filtration systems and enter living organisms."
    }
  },
  {
    id: 17,
    question: {
      vi: "Cách tốt nhất để giảm thiểu rác thải nhựa khi đi siêu thị là gì?",
      en: "What is the best way to reduce plastic waste when grocery shopping?"
    },
    options: [
      { vi: "Xin nhiều túi nilon mỏng", en: "Ask for many thin plastic bags" },
      { vi: "Mua hàng bọc sẵn màng bọc thực phẩm", en: "Buy goods pre-wrapped in cling film" },
      { vi: "Mang theo túi vải cá nhân dùng nhiều lần", en: "Bring reusable personal cloth bags" },
      { vi: "Dùng túi nilon đen", en: "Use black plastic bags" }
    ],
    correctIndex: 2,
    explanation: {
      vi: "Mang theo túi vải cá nhân là cách trực tiếp và hiệu quả nhất để thực hiện chữ 'Reduce' (Tiết giảm) trong nguyên tắc 3R.",
      en: "Bringing personal cloth bags is the most direct and effective way to implement 'Reduce' in the 3R principle."
    }
  },
  {
    id: 18,
    question: {
      vi: "Lõi cuộn giấy vệ sinh là loại rác gì?",
      en: "What type of waste is a toilet paper roll core?"
    },
    options: [
      { vi: "Rác hữu cơ", en: "Organic waste" },
      { vi: "Rác vô cơ", en: "Inorganic waste" },
      { vi: "Rác tái chế", en: "Recyclable waste" },
      { vi: "Rác nguy hại", en: "Hazardous waste" }
    ],
    correctIndex: 2,
    explanation: {
      vi: "Lõi giấy được làm từ bìa cứng carton mỏng, rất dễ dàng để tái chế thành các sản phẩm giấy khác.",
      en: "Paper cores are made from thin cardboard, which is very easy to recycle into other paper products."
    }
  },
  {
    id: 19,
    question: {
      vi: "Phân bón sinh học hữu cơ (Compost) có tác dụng gì?",
      en: "What is the effect of organic bio-fertilizer (Compost)?"
    },
    options: [
      { vi: "Tiêu diệt vi khuẩn", en: "Kills bacteria" },
      { vi: "Làm đất bạc màu", en: "Depletes soil" },
      { vi: "Cung cấp dinh dưỡng tự nhiên và làm xốp đất", en: "Provides natural nutrients and aerates soil" },
      { vi: "Gây ô nhiễm nguồn nước", en: "Pollutes water sources" }
    ],
    correctIndex: 2,
    explanation: {
      vi: "Phân compost được ủ từ rác hữu cơ, chứa nhiều mùn, giúp đất tơi xốp, giữ ẩm tốt và cung cấp dinh dưỡng an toàn cho cây trồng.",
      en: "Compost made from organic waste contains a lot of humus, helps aerate the soil, retains moisture well, and provides safe nutrients for plants."
    }
  },
  {
    id: 20,
    question: {
      vi: "Nước thải từ các khu công nghiệp chưa qua xử lý thải ra sông gây hiện tượng gì?",
      en: "Untreated wastewater from industrial zones discharged into rivers causes what phenomenon?"
    },
    options: [
      { vi: "Phú dưỡng hóa", en: "Eutrophication" },
      { vi: "Làm trong nước", en: "Clarifies water" },
      { vi: "Tăng lượng oxy", en: "Increases oxygen level" },
      { vi: "Giảm sự phát triển tảo", en: "Reduces algae growth" }
    ],
    correctIndex: 0,
    explanation: {
      vi: "Nước thải mang nhiều chất ô nhiễm và dinh dưỡng (như nitơ, phốt pho) gây ra hiện tượng phú dưỡng hóa, làm bùng phát tảo và làm chết cá.",
      en: "Wastewater carrying many pollutants and nutrients (like nitrogen, phosphorus) causes eutrophication, leading to algae blooms and fish kills."
    }
  },
  {
    id: 21,
    question: {
      vi: "Mảnh gương vỡ thuộc loại rác nào?",
      en: "Which type of waste does a broken mirror belong to?"
    },
    options: [
      { vi: "Tái chế", en: "Recycle" },
      { vi: "Hữu cơ", en: "Organic" },
      { vi: "Nguy hại", en: "Hazardous" },
      { vi: "Vô cơ", en: "Inorganic" }
    ],
    correctIndex: 3,
    explanation: {
      vi: "Gương vỡ được tráng kim loại phía sau, không thể tái chế chung với thủy tinh thông thường nên được xếp vào rác vô cơ (rác còn lại).",
      en: "Broken mirrors have a metallic coating on the back, they cannot be recycled with regular glass so they are classified as inorganic waste (residual waste)."
    }
  },
  {
    id: 22,
    question: {
      vi: "Bạn nên làm gì với hộp xốp đựng thức ăn dùng một lần sau khi sử dụng?",
      en: "What should you do with a single-use styrofoam food container after use?"
    },
    options: [
      { vi: "Rửa và tái chế", en: "Wash and recycle" },
      { vi: "Đốt", en: "Burn it" },
      { vi: "Vứt vào thùng rác vô cơ", en: "Throw in inorganic bin" },
      { vi: "Ủ phân", en: "Compost it" }
    ],
    correctIndex: 2,
    explanation: {
      vi: "Hộp xốp (nhựa EPS) rất khó tái chế và thường dính dầu mỡ, do đó phải vứt vào thùng rác vô cơ.",
      en: "Styrofoam containers (EPS plastic) are very difficult to recycle and usually greasy, so they must be thrown in the inorganic bin."
    }
  },
  {
    id: 23,
    question: {
      vi: "Hộp sữa giấy (Tetra Pak) có thể tái chế được không?",
      en: "Can Tetra Pak paper milk cartons be recycled?"
    },
    options: [
      { vi: "Không", en: "No" },
      { vi: "Có, nếu được làm sạch và thu gom đúng cách", en: "Yes, if cleaned and collected properly" },
      { vi: "Có, nhưng chỉ tái chế được phần nilon", en: "Yes, but only the plastic part can be recycled" },
      { vi: "Không, vì nó chứa chất độc", en: "No, because it contains toxins" }
    ],
    correctIndex: 1,
    explanation: {
      vi: "Hộp sữa Tetra Pak cấu tạo từ giấy, nhựa và nhôm, hoàn toàn có thể tái chế bằng công nghệ đặc biệt thành bột giấy và tấm nhôm nhựa.",
      en: "Tetra Pak milk cartons are made of paper, plastic, and aluminum, and can be fully recycled using special technology into paper pulp and aluminum-plastic sheets."
    }
  },
  {
    id: 24,
    question: {
      vi: "Rác thải điện tử (E-waste) nguy hiểm vì lý do gì?",
      en: "Why is electronic waste (E-waste) dangerous?"
    },
    options: [
      { vi: "Chứa virus máy tính", en: "Contains computer viruses" },
      { vi: "Rất dễ cháy nổ", en: "Very flammable and explosive" },
      { vi: "Chứa kim loại nặng và hóa chất độc hại", en: "Contains heavy metals and toxic chemicals" },
      { vi: "Tỏa ra bức xạ hạt nhân", en: "Emits nuclear radiation" }
    ],
    correctIndex: 2,
    explanation: {
      vi: "E-waste chứa chì, thủy ngân, cadmium và các hợp chất chống cháy, dễ rò rỉ ra môi trường nếu xử lý không đúng cách.",
      en: "E-waste contains lead, mercury, cadmium, and flame retardants, which can easily leak into the environment if not disposed of properly."
    }
  },
  {
    id: 25,
    question: {
      vi: "Ngày Trái Đất (Earth Day) được tổ chức hằng năm vào ngày nào?",
      en: "When is Earth Day celebrated annually?"
    },
    options: [
      { vi: "22 tháng 3", en: "March 22" },
      { vi: "22 tháng 4", en: "April 22" },
      { vi: "5 tháng 6", en: "June 5" },
      { vi: "10 tháng 10", en: "October 10" }
    ],
    correctIndex: 1,
    explanation: {
      vi: "Ngày Trái Đất là ngày 22 tháng 4 hằng năm, nhằm nâng cao nhận thức và hành động bảo vệ môi trường trên toàn cầu.",
      en: "Earth Day is on April 22 every year, aiming to raise awareness and inspire action for global environmental protection."
    }
  },
  {
    id: 26,
    question: {
      vi: "Biểu tượng tái chế (Mobius Loop) gồm bao nhiêu mũi tên?",
      en: "How many arrows does the recycling symbol (Mobius Loop) consist of?"
    },
    options: [
      { vi: "2", en: "2" },
      { vi: "3", en: "3" },
      { vi: "4", en: "4" },
      { vi: "5", en: "5" }
    ],
    correctIndex: 1,
    explanation: {
      vi: "Biểu tượng vòng lặp Mobius gồm 3 mũi tên uốn cong nối đuôi nhau, tượng trưng cho 3 bước: Thu gom, Tái chế và Mua sản phẩm tái chế.",
      en: "The Mobius Loop symbol consists of 3 curved arrows chasing each other, representing 3 steps: Collect, Recycle, and Buy recycled products."
    }
  },
  {
    id: 27,
    question: {
      vi: "Rác thải đại dương phần lớn xuất phát từ đâu?",
      en: "Where does the majority of ocean waste originate from?"
    },
    options: [
      { vi: "Từ các con tàu", en: "From ships" },
      { vi: "Từ đất liền do gió và nước mưa cuốn trôi", en: "From land, washed away by wind and rain" },
      { vi: "Từ núi lửa dưới biển", en: "From underwater volcanoes" },
      { vi: "Từ động vật biển", en: "From marine animals" }
    ],
    correctIndex: 1,
    explanation: {
      vi: "Khoảng 80% rác thải nhựa ở đại dương có nguồn gốc từ các hoạt động trên đất liền, bị nước mưa, gió bão cuốn xuống sông rồi đổ ra biển.",
      en: "About 80% of marine plastic waste originates from land-based activities, washed into rivers by rain and storms, then flowing into the sea."
    }
  },
  {
    id: 28,
    question: {
      vi: "Tái chế 1 tấn giấy tiết kiệm được bao nhiêu cây xanh trưởng thành?",
      en: "How many mature trees are saved by recycling 1 ton of paper?"
    },
    options: [
      { vi: "2 cây", en: "2 trees" },
      { vi: "17 cây", en: "17 trees" },
      { vi: "50 cây", en: "50 trees" },
      { vi: "100 cây", en: "100 trees" }
    ],
    correctIndex: 1,
    explanation: {
      vi: "Theo thống kê, việc tái chế 1 tấn giấy có thể cứu được khoảng 17 cây xanh trưởng thành, giúp bảo vệ rừng.",
      en: "According to statistics, recycling 1 ton of paper can save about 17 mature trees, helping to protect forests."
    }
  },
  {
    id: 29,
    question: {
      vi: "Một chiếc băng vệ sinh/tã giấy mất bao lâu để phân hủy?",
      en: "How long does a sanitary pad/diaper take to decompose?"
    },
    options: [
      { vi: "10 năm", en: "10 years" },
      { vi: "50 năm", en: "50 years" },
      { vi: "100 năm", en: "100 years" },
      { vi: "Lên đến 500 năm", en: "Up to 500 years" }
    ],
    correctIndex: 3,
    explanation: {
      vi: "Tã giấy và băng vệ sinh chứa nhiều lớp nhựa tổng hợp và gel thấm hút, mất đến 500 năm để phân hủy hoàn toàn.",
      en: "Diapers and sanitary pads contain multiple layers of synthetic plastic and absorbent gels, taking up to 500 years to decompose completely."
    }
  },
  {
    id: 30,
    question: {
      vi: "Lưới đánh cá bằng cước nhựa hỏng khi bị vứt xuống biển gây ra hậu quả gì?",
      en: "What is the consequence of discarded plastic fishing nets in the ocean?"
    },
    options: [
      { vi: "Cung cấp thức ăn cho cá", en: "Provides food for fish" },
      { vi: "Hiện tượng 'lưới ma' bẫy và giết chết sinh vật biển", en: "Creates 'ghost nets' that trap and kill marine life" },
      { vi: "Trở thành rạn san hô nhân tạo", en: "Becomes an artificial coral reef" },
      { vi: "Làm nước biển trong hơn", en: "Makes seawater clearer" }
    ],
    correctIndex: 1,
    explanation: {
      vi: "Các tấm lưới cước vô chủ trôi dạt trên biển được gọi là 'lưới ma', liên tục mắc vào và giết chết rùa, cá heo, cá mập... trong nhiều thập kỷ.",
      en: "Abandoned nylon nets drifting in the sea are called 'ghost nets', which continuously entangle and kill turtles, dolphins, sharks... for decades."
    }
  },
  {
    id: 31,
    question: {
      vi: "Điều nào sau đây là hệ quả trực tiếp của Biến đổi khí hậu?",
      en: "Which of the following is a direct consequence of Climate Change?"
    },
    options: [
      { vi: "Nước biển dâng", en: "Sea level rise" },
      { vi: "Trái đất quay nhanh hơn", en: "Earth rotates faster" },
      { vi: "Từ trường trái đất yếu đi", en: "Earth's magnetic field weakens" },
      { vi: "Núi lửa phun trào", en: "Volcanic eruptions" }
    ],
    correctIndex: 0,
    explanation: {
      vi: "Biến đổi khí hậu làm nhiệt độ toàn cầu tăng, băng hai cực tan chảy và nước biển giãn nở nhiệt, dẫn đến hiện tượng nước biển dâng.",
      en: "Climate change increases global temperatures, melts polar ice, and causes thermal expansion of seawater, leading to sea level rise."
    }
  },
  {
    id: 32,
    question: {
      vi: "Bạn nên làm gì với chiếc áo phông vẫn còn tốt nhưng bạn không thích mặc nữa?",
      en: "What should you do with a t-shirt that is still good but you no longer like to wear?"
    },
    options: [
      { vi: "Vứt vào thùng rác", en: "Throw it in the trash" },
      { vi: "Đốt nó đi", en: "Burn it" },
      { vi: "Quyên góp từ thiện hoặc cho người khác", en: "Donate to charity or give to someone else" },
      { vi: "Xé ra làm giẻ lau", en: "Tear it into rags" }
    ],
    correctIndex: 2,
    explanation: {
      vi: "Quyên góp áo cũ còn tốt (Tái sử dụng/Reuse) là cách ưu tiên nhất, giúp kéo dài vòng đời sản phẩm và giảm nhu cầu sản xuất mới.",
      en: "Donating good old clothes (Reuse) is the most preferred method, helping to extend the product lifecycle and reduce the need for new production."
    }
  },
  {
    id: 33,
    question: {
      vi: "Chất CFCs trong các máy lạnh đời cũ gây ra hiện tượng môi trường nào?",
      en: "What environmental phenomenon is caused by CFCs in older air conditioners?"
    },
    options: [
      { vi: "Thủng tầng Ozon", en: "Ozone layer depletion" },
      { vi: "Sương mù quang hóa", en: "Photochemical smog" },
      { vi: "Mưa axit", en: "Acid rain" },
      { vi: "Tràn dầu", en: "Oil spill" }
    ],
    correctIndex: 0,
    explanation: {
      vi: "Chlorofluorocarbons (CFCs) khi bay lên tầng bình lưu sẽ phân hủy và phá hủy các phân tử Ozon, làm mỏng và thủng tầng Ozon bảo vệ Trái Đất.",
      en: "Chlorofluorocarbons (CFCs), when reaching the stratosphere, decompose and destroy Ozone molecules, thinning and depleting Earth's protective Ozone layer."
    }
  },
  {
    id: 34,
    question: {
      vi: "Giày dép cũ rách nát không thể dùng được nữa thuộc nhóm rác nào?",
      en: "Old, torn shoes that can no longer be used belong to which waste group?"
    },
    options: [
      { vi: "Hữu cơ", en: "Organic" },
      { vi: "Tái chế", en: "Recycle" },
      { vi: "Nguy hại", en: "Hazardous" },
      { vi: "Vô cơ", en: "Inorganic" }
    ],
    correctIndex: 3,
    explanation: {
      vi: "Giày dép cấu tạo từ nhiều vật liệu phức tạp (cao su, keo, vải, nhựa) dính chặt vào nhau, không thể tái chế nên thuộc nhóm rác vô cơ.",
      en: "Shoes are made of complex materials (rubber, glue, fabric, plastic) bonded together, which cannot be recycled and therefore belong to the inorganic waste group."
    }
  },
  {
    id: 35,
    question: {
      vi: "Quá trình ủ phân hữu cơ (composting) cần yếu tố nào sau đây?",
      en: "Which of the following factors are needed for the composting process?"
    },
    options: [
      { vi: "Oxy, Độ ẩm, Cạc-bon, Ni-tơ", en: "Oxygen, Moisture, Carbon, Nitrogen" },
      { vi: "Khí độc, Kim loại, Nhựa", en: "Toxic gases, Metal, Plastic" },
      { vi: "Ánh sáng mặt trời trực tiếp, Nhiệt độ âm", en: "Direct sunlight, Sub-zero temperature" },
      { vi: "Lưu huỳnh, Clo", en: "Sulfur, Chlorine" }
    ],
    correctIndex: 0,
    explanation: {
      vi: "Quá trình ủ phân hiếu khí cần Cạc-bon (rác nâu như lá khô), Ni-tơ (rác xanh như rau củ), cùng với Độ ẩm vừa phải và Oxy để vi sinh vật hoạt động.",
      en: "The aerobic composting process requires Carbon (browns like dry leaves), Nitrogen (greens like veggies), along with moderate Moisture and Oxygen for microorganisms to act."
    }
  }
] as const;

// Generate extended questions from base set
const _extendedQuestions = Array.from({ length: 15 }, (_, i) => {
  const idx = i + 36;
  const baseQ = QUIZ_QUESTIONS[i % 35];
  return {
    ...baseQ,
    id: idx,
    question: {
      vi: `${baseQ.question.vi} (Nâng cao)`,
      en: `${baseQ.question.en} (Advanced)`
    },
  };
});

export const ALL_QUIZ_QUESTIONS = [...QUIZ_QUESTIONS, ..._extendedQuestions];

