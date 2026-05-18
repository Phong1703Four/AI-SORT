import { useState } from "react";
import type { ChatMessage } from "../chat.types";

import { WASTE_ITEMS } from "../../../data/wasteData";

const GREETINGS = ['chào', 'hello', 'hi', 'xin chào', 'ê'];

const getWasteTypeInfo = (type: string, lang: 'vi' | 'en') => {
  switch (type) {
    case 'organic': return lang === 'en' ? '**Organic Waste** 🌿' : '**Rác Hữu Cơ** 🌿';
    case 'recycle': return lang === 'en' ? '**Recyclable Waste** ♻️' : '**Rác Tái Chế** ♻️';
    case 'inorganic': return lang === 'en' ? '**Inorganic Waste** 🗑️' : '**Rác Vô Cơ** 🗑️';
    case 'hazardous': return lang === 'en' ? '**Hazardous Waste** ⚠️' : '**Rác Nguy Hại** ⚠️';
    default: return type;
  }
};

export const useLocalChat = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const isReady = true;

  const generateResponse = async (
    userMessage: string, 
    _history: ChatMessage[],
    onUpdate: (currentText: string) => void
  ) => {
    setIsGenerating(true);
    
    // Giả lập thời gian suy nghĩ
    await new Promise(r => setTimeout(r, 600));

    const msgLower = userMessage.toLowerCase();
    let bestReply = 'Xin lỗi, tôi chưa rõ món đồ này. Bạn có thể cho biết nó làm bằng gì không (ví dụ: nhựa, giấy, thức ăn thừa)?';

    const isGreeting = GREETINGS.some(kw => msgLower.includes(kw));
    
    if (isGreeting) {
      bestReply = 'Xin chào! Tôi là Trợ lý Sinh Thái AI SORT siêu cấp. Tôi đã học thuộc dữ liệu của 600 loại rác. Hãy hỏi tôi bất kỳ loại rác nào bạn muốn phân loại!';
    } else {
      // Tìm kiếm trong bộ dữ liệu 600 món rác
      const matchedItem = WASTE_ITEMS.find(item => 
        msgLower.includes(item.name.vi.toLowerCase()) || 
        msgLower.includes(item.name.en.toLowerCase())
      );

      if (matchedItem) {
        bestReply = `Theo hệ thống phân tích, **${matchedItem.name.vi}** thuộc nhóm ${getWasteTypeInfo(matchedItem.type, 'vi')}.\n\n💡 **Chi tiết:** ${matchedItem.explanation.vi}`;
      } else {
        // Fallback fuzzy search if exact match fails
        const fuzzyMatch = WASTE_ITEMS.find(item => 
          item.name.vi.toLowerCase().split(' ').some(word => word.length > 3 && msgLower.includes(word))
        );

        if (fuzzyMatch) {
          bestReply = `Có phải bạn đang hỏi về **${fuzzyMatch.name.vi}**?\nĐó là ${getWasteTypeInfo(fuzzyMatch.type, 'vi')}.\n\n💡 **Giải thích:** ${fuzzyMatch.explanation.vi}`;
        } else {
          bestReply = 'Rất tiếc, AI của tôi chưa tìm thấy loại rác này trong cơ sở dữ liệu 600 vật phẩm. Bạn có thể nói rõ hơn đó là vật liệu gì (nhựa, giấy, kim loại...) không?';
        }
      }
    }

    // Hiệu ứng gõ phím
    let currentText = "";
    for (let i = 0; i < bestReply.length; i++) {
      currentText += bestReply[i];
      onUpdate(currentText);
      await new Promise(r => setTimeout(r, 20)); // Tốc độ gõ 20ms/ký tự
    }

    setIsGenerating(false);
  };

  return {
    isReady,
    isGenerating,
    generateResponse
  };
};
