import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Sparkles } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';

import type { Inventory } from '../../../App';

interface EcoShopProps {
  inventory: Inventory;
  setInventory: React.Dispatch<React.SetStateAction<Inventory>>;
}

export const EcoShop = ({ inventory, setInventory }: EcoShopProps) => {
  const [craftedItems, setCraftedItems] = useState<string[]>([]);
  const [toast, setToast] = useState('');
  const { language } = useTranslation();

  interface ShopItem {
    id: string;
    name: string;
    desc: string;
    req: {
      organic?: number;
      recycle?: number;
      inorganic?: number;
      hazardous?: number;
    };
    icon: string;
    color: string;
  }

  const SHOP_ITEMS: ShopItem[] = [
    { id: 'notebook', name: language === 'en' ? 'Recycled Notebook' : 'Sổ Tay Tái Chế', desc: language === 'en' ? 'Crafted from old paper.' : 'Làm từ giấy phế liệu.', req: { recycle: 10, organic: 5 }, icon: '📔', color: 'text-brand-green' },
    { id: 'plant', name: language === 'en' ? 'Eco Plant Pot' : 'Chậu Cây Sinh Thái', desc: language === 'en' ? 'A pot for a new life.' : 'Chậu cây ươm mầm sự sống.', req: { recycle: 15, organic: 10 }, icon: '🌱', color: 'text-emerald-400' },
    { id: 'fertilizer', name: language === 'en' ? 'Organic Fertilizer' : 'Phân Bón Hữu Cơ', desc: language === 'en' ? 'Compost for plants.' : 'Phân ủ sinh học tự nhiên.', req: { organic: 20 }, icon: '💩', color: 'text-amber-700' },
    { id: 'bag', name: language === 'en' ? 'Tote Bag' : 'Túi Vải Đi Chợ', desc: language === 'en' ? 'Say no to plastic bags.' : 'Nói không với túi nilon.', req: { recycle: 20 }, icon: '🛍️', color: 'text-blue-400' },
    { id: 'brick', name: language === 'en' ? 'Eco Brick' : 'Gạch Sinh Thái', desc: language === 'en' ? 'Building material from waste.' : 'Vật liệu xây dựng từ rác thải.', req: { inorganic: 30, recycle: 10 }, icon: '🧱', color: 'text-orange-500' },
    { id: 'keychain', name: language === 'en' ? 'Plastic Keychain' : 'Móc Khóa Nhựa', desc: language === 'en' ? 'Cute recycled accessory.' : 'Phụ kiện dễ thương tái chế.', req: { recycle: 15, inorganic: 5 }, icon: '🔑', color: 'text-cyan-400' },
    { id: 'flashlight', name: language === 'en' ? 'Recycled Flashlight' : 'Đèn Pin Tái Chế', desc: language === 'en' ? 'Light up from e-waste.' : 'Tỏa sáng từ rác điện tử.', req: { hazardous: 10, recycle: 20 }, icon: '🔦', color: 'text-yellow-400' },
    { id: 'trashcan', name: language === 'en' ? 'Mini Trash Can' : 'Thùng Rác Mini', desc: language === 'en' ? 'For sorting waste at home.' : 'Dùng để phân loại rác tại nhà.', req: { recycle: 25, inorganic: 15 }, icon: '🗑️', color: 'text-slate-400' },
    { id: 'robot', name: language === 'en' ? 'Robot Model' : 'Mô Hình Robot', desc: language === 'en' ? 'Masterpiece of recycling.' : 'Tuyệt tác của nghệ thuật tái chế.', req: { hazardous: 15, recycle: 30, inorganic: 20 }, icon: '🤖', color: 'text-purple-500' },
    { id: 'badge', name: language === 'en' ? 'Earth Badge' : 'Huy Hiệu Trái Đất', desc: language === 'en' ? 'Ultimate eco warrior symbol.' : 'Biểu tượng chiến binh môi trường.', req: { recycle: 50, organic: 50, inorganic: 50, hazardous: 50 }, icon: '🌍', color: 'text-blue-500' },
  ];

  const handleCraft = (item: ShopItem) => {
    if (craftedItems.includes(item.id)) {
      showToast(language === 'en' ? 'You already crafted this item!' : 'Bạn đã chế tạo vật phẩm này rồi!');
      return;
    }
    
    // Check requirements
    const req = item.req;
    const canCraft = (!req.organic || inventory.organic >= req.organic) &&
                     (!req.recycle || inventory.recycle >= req.recycle) &&
                     (!req.inorganic || inventory.inorganic >= req.inorganic) &&
                     (!req.hazardous || inventory.hazardous >= req.hazardous);

    if (canCraft) {
      setInventory(prev => ({
        organic: prev.organic - (req.organic || 0),
        recycle: prev.recycle - (req.recycle || 0),
        inorganic: prev.inorganic - (req.inorganic || 0),
        hazardous: prev.hazardous - (req.hazardous || 0),
      }));
      setCraftedItems(prev => [...prev, item.id]);
      showToast(language === 'en' ? `Successfully crafted ${item.name}!` : `Đã chế tạo thành công ${item.name}!`);
    } else {
      showToast(language === 'en' ? 'Not enough resources!' : 'Không đủ tài nguyên rác!');
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
      <div className="flex items-center gap-4 mb-10">
        <ShoppingCart className="w-10 h-10 text-brand-green" />
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{language === 'en' ? 'Eco Workshop' : 'Xưởng Chế Tạo'}</h2>
          <p className="text-slate-600 dark:text-slate-400">{language === 'en' ? 'Use collected waste to craft useful eco-friendly items.' : 'Sử dụng rác thải thu thập được để chế tạo vật phẩm sinh thái.'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {SHOP_ITEMS.map((item) => {
          const isOwned = craftedItems.includes(item.id);
          const req = item.req;
          const canCraft = (!req.organic || inventory.organic >= req.organic) &&
                           (!req.recycle || inventory.recycle >= req.recycle) &&
                           (!req.inorganic || inventory.inorganic >= req.inorganic) &&
                           (!req.hazardous || inventory.hazardous >= req.hazardous);
                           
          return (
            <motion.div 
              key={item.id}
              whileHover={{ y: -5 }}
              className="glass rounded-2xl p-6 border border-slate-200 dark:border-white/10 flex flex-col relative overflow-hidden group"
            >
              {isOwned && (
                <div className="absolute top-2 right-2 bg-brand-green text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                  {language === 'en' ? 'Crafted' : 'Đã chế tạo'}
                </div>
              )}
              
              <div className={`text-6xl mb-4 self-center filter drop-shadow-md dark:drop-shadow-[0_0_15px_currentColor] ${item.color}`}>
                {item.icon}
              </div>
              
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">{item.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1">{item.desc}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {req.organic && <span className={`text-[10px] font-bold px-2 py-1 rounded bg-slate-200 dark:bg-white/10 ${inventory.organic >= req.organic ? 'text-emerald-500' : 'text-slate-400'}`}>🌿 {inventory.organic}/{req.organic}</span>}
                {req.recycle && <span className={`text-[10px] font-bold px-2 py-1 rounded bg-slate-200 dark:bg-white/10 ${inventory.recycle >= req.recycle ? 'text-blue-500' : 'text-slate-400'}`}>♻️ {inventory.recycle}/{req.recycle}</span>}
                {req.inorganic && <span className={`text-[10px] font-bold px-2 py-1 rounded bg-slate-200 dark:bg-white/10 ${inventory.inorganic >= req.inorganic ? 'text-amber-500' : 'text-slate-400'}`}>🗑️ {inventory.inorganic}/{req.inorganic}</span>}
                {req.hazardous && <span className={`text-[10px] font-bold px-2 py-1 rounded bg-slate-200 dark:bg-white/10 ${inventory.hazardous >= req.hazardous ? 'text-red-500' : 'text-slate-400'}`}>⚠️ {inventory.hazardous}/{req.hazardous}</span>}
              </div>

              <motion.button
                whileHover={{ scale: isOwned ? 1 : 1.05 }}
                whileTap={{ scale: isOwned ? 1 : 0.95 }}
                onClick={() => handleCraft(item)}
                disabled={isOwned || !canCraft}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
                  isOwned 
                    ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : canCraft
                      ? 'bg-brand-green text-white hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-slate-200 dark:bg-white/5 text-slate-400 cursor-not-allowed'
                }`}
              >
                {!isOwned ? (
                  canCraft ? (language === 'en' ? 'CRAFT NOW' : 'CHẾ TẠO NGAY') : (language === 'en' ? 'NEED RESOURCES' : 'THIẾU TÀI NGUYÊN')
                ) : (
                  language === 'en' ? 'CRAFTED' : 'HOÀN THÀNH'
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-brand-green text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-3 font-medium"
          >
            <Sparkles className="w-5 h-5 text-brand-green" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
