import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, ShieldAlert, Sparkles, Trash2, ShieldCheck, HelpCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';
import type { Inventory } from '../../../App';

interface EcoLabGameProps {
  setInventory: React.Dispatch<React.SetStateAction<Inventory>>;
}

interface LabItem {
  id: string;
  nameKey: string;
  icon: string;
  isContaminated: boolean;
  needsDisassembly: boolean;
  isHazardous?: boolean;
  subComponents?: { nameKey: string; icon: string; category: keyof Inventory }[];
  correctCategory: keyof Inventory; // final fallback if sorted directly
  points: number;
}

export const EcoLabGame = ({ setInventory }: EcoLabGameProps) => {
  const { t, language } = useTranslation();
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [safetyEquipped, setSafetyEquipped] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false);
  const [isDisassembled, setIsDisassembled] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [gameOver, setGameOver] = useState(false);

  // List of experimental waste items
  const labItems: LabItem[] = [
    {
      id: 'milk_carton',
      nameKey: 'games.ecolab.items.milkCarton',
      icon: '🥛',
      isContaminated: true,
      needsDisassembly: false,
      isHazardous: false,
      correctCategory: 'recycle',
      points: 25,
    },
    {
      id: 'pizza_box',
      nameKey: 'games.ecolab.items.pizzaBox',
      icon: '📦',
      isContaminated: true,
      needsDisassembly: true,
      isHazardous: false,
      subComponents: [
        { nameKey: 'games.ecolab.items.cleanPaper', icon: '📄', category: 'recycle' },
        { nameKey: 'games.ecolab.items.greasyLeftover', icon: '🍕', category: 'organic' },
      ],
      correctCategory: 'organic',
      points: 35,
    },
    {
      id: 'thermometer',
      nameKey: 'games.ecolab.items.thermometer',
      icon: '🌡️',
      isContaminated: false,
      needsDisassembly: false,
      isHazardous: true,
      correctCategory: 'hazardous',
      points: 30,
    },
    {
      id: 'coffee_cup',
      nameKey: 'games.ecolab.items.coffeeCup',
      icon: '🥤',
      isContaminated: false,
      needsDisassembly: true,
      subComponents: [
        { nameKey: 'games.ecolab.items.plasticLid', icon: '🔘', category: 'recycle' },
        { nameKey: 'games.ecolab.items.paperSleeve', icon: '🧻', category: 'recycle' },
        { nameKey: 'games.ecolab.items.waxedCup', icon: '🥛', category: 'inorganic' },
      ],
      correctCategory: 'inorganic',
      points: 40,
    },
    {
      id: 'smartphone',
      nameKey: 'games.ecolab.items.phone',
      icon: '📱',
      isContaminated: false,
      needsDisassembly: true,
      isHazardous: true,
      subComponents: [
        { nameKey: 'games.ecolab.items.lithiumBattery', icon: '🔋', category: 'hazardous' },
        { nameKey: 'games.ecolab.items.metalCasing', icon: '🛡️', category: 'recycle' },
      ],
      correctCategory: 'hazardous',
      points: 45,
    },
  ];

  const currentItem = labItems[activeItemIndex];

  // Tool handling
  const handleWash = () => {
    if (currentItem.isContaminated && !isCleaned) {
      setIsCleaned(true);
      showFeedback('success', language === 'en' ? '🧼 Rinsed! Organic residues and grease removed.' : '🧼 Đã súc rửa! Loại bỏ hoàn toàn mỡ và cặn bã.');
    } else {
      showFeedback('error', language === 'en' ? 'Item is already clean!' : 'Vật phẩm đã sạch rồi!');
    }
  };

  const handleDisassemble = () => {
    if (currentItem.isHazardous && !safetyEquipped) {
      showFeedback('error', language === 'en' ? '⚠️ DANGER! Toxic parts inside. Equip Safety Gear first.' : '⚠️ NGUY HIỂM! Có chi tiết độc hại bên trong. Đeo đồ bảo hộ trước.');
      return;
    }
    if (currentItem.needsDisassembly && !isDisassembled) {
      setIsDisassembled(true);
      showFeedback('success', language === 'en' ? '🔧 Success! Composite item split into pure materials.' : '🔧 Thành công! Đã tách rời vật phẩm thành các chất liệu nguyên bản.');
    } else {
      showFeedback('error', language === 'en' ? 'No disassembly needed or already completed!' : 'Không cần tháo rã hoặc đã tháo rã xong!');
    }
  };

  const handleEquipSafety = () => {
    if (!safetyEquipped) {
      setSafetyEquipped(true);
      showFeedback('success', language === 'en' ? '🛡️ Safety suit, heavy-duty gloves, and mask equipped!' : '🛡️ Đã đeo găng tay chống cắt, kính bảo hộ và mặt nạ phòng độc!');
    } else {
      setSafetyEquipped(false);
      showFeedback('success', language === 'en' ? 'Safety gear removed.' : 'Đã tháo đồ bảo hộ.');
    }
  };

  // Direct Sorting without Treatment
  const handleSortItemDirectly = (category: keyof Inventory) => {
    if (currentItem.isHazardous && !safetyEquipped) {
      showFeedback('error', language === 'en' ? '⚠️ TOXIC SPILL! You handled hazardous materials without Safety Gear. -10 Coins' : '⚠️ RÒ RỈ ĐỘC HẠI! Bạn đã phân loại chất thải nguy hại mà không đeo đồ bảo hộ. -10 Xu');
      setScore(s => Math.max(0, s - 10));
      return;
    }

    if (currentItem.isContaminated && !isCleaned) {
      showFeedback('error', language === 'en' ? '♻️ STREAM CONTAMINATION! Rinsing is required for sticky recyclables. +5 Coins only.' : '♻️ Ô NHIỄM NGUỒN TÁI CHẾ! Cần làm sạch rác bẩn trước khi phân loại. Chỉ được +5 Xu.');
      setScore(s => s + 5);
      setInventory(prev => ({ ...prev, [category]: prev[category] + 1 }));
      nextStep();
      return;
    }

    if (currentItem.needsDisassembly && !isDisassembled) {
      showFeedback('error', language === 'en' ? '🗑️ Sorting failed! Mixed-material items cannot be processed directly. +5 Coins only.' : '🗑️ Thất bại! Rác hỗn hợp chưa tháo rã không thể tái chế hoàn toàn. Chỉ được +5 Xu.');
      setScore(s => s + 5);
      setInventory(prev => ({ ...prev, [category]: prev[category] + 1 }));
      nextStep();
      return;
    }

    // Fully correct direct sorting (e.g. thermometer with safety equipped, or plain non-contaminated waste)
    if (category === currentItem.correctCategory) {
      showFeedback('success', `${language === 'en' ? '🎯 Perfect sorting!' : '🎯 Phân loại chính xác!'} +${currentItem.points} Xu.`);
      setScore(s => s + currentItem.points);
      setInventory(prev => ({ ...prev, [category]: prev[category] + 5 }));
    } else {
      showFeedback('error', `${language === 'en' ? '❌ Wrong bin!' : '❌ Thùng rác sai rồi!'} +5 Xu.`);
      setScore(s => s + 5);
    }
    nextStep();
  };

  // Sort isolated subcomponents
  const handleSortSubcomponent = (category: keyof Inventory, compIndex: number) => {
    if (!currentItem.subComponents) return;
    const component = currentItem.subComponents[compIndex];

    if (category === component.category) {
      showFeedback('success', `✨ Correct! "${t(component.nameKey)}" -> ${t('games.' + category)} (+15 Xu)`);
      setScore(s => s + 15);
      setInventory(prev => ({ ...prev, [category]: prev[category] + 3 }));
    } else {
      showFeedback('error', `❌ Incorrect bin for "${t(component.nameKey)}"! (+5 Xu)`);
      setScore(s => s + 5);
    }

    // Remove component from list
    currentItem.subComponents.splice(compIndex, 1);
    if (currentItem.subComponents.length === 0) {
      nextStep();
    } else {
      // Force rerender
      setScore(s => s);
    }
  };

  const nextStep = () => {
    setTimeout(() => {
      setIsCleaned(false);
      setIsDisassembled(false);
      if (activeItemIndex + 1 < labItems.length) {
        setActiveItemIndex(i => i + 1);
      } else {
        setGameOver(true);
      }
    }, 1500);
  };

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3000);
  };

  const restartGame = () => {
    setActiveItemIndex(0);
    setScore(0);
    setSafetyEquipped(false);
    setIsCleaned(false);
    setIsDisassembled(false);
    setGameOver(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[620px] glass rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 p-6 flex flex-col relative text-slate-900 dark:text-white">
      {/* Feedback Overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full font-bold shadow-lg border backdrop-blur-md flex items-center gap-2 ${
              feedback.type === 'success' 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-red-500/20 text-red-400 border-red-500/30'
            }`}
          >
            {feedback.type === 'success' ? <Sparkles className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            <span className="text-sm">{feedback.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-green/10 border border-brand-green/20 rounded-xl flex items-center justify-center text-brand-green">
            <Beaker className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black">{t('games.ecolab.title')}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('games.ecolab.desc')}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-full font-mono text-sm border border-slate-200 dark:border-white/5">
            SCORE: <span className="text-brand-green font-bold">{score}</span>
          </div>
          {safetyEquipped ? (
            <div className="px-3 py-1 bg-brand-green/20 text-brand-green border border-brand-green/30 rounded-full text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> SAFE
            </div>
          ) : (
            <div className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> EXPOSED
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameOver ? (
          <motion.div
            key="gameover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center gap-6"
          >
            <div className="text-7xl">🧪🏆</div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                {language === 'en' ? 'Lab Work Completed!' : 'Hoàn Thành Công Việc Phòng Thí Nghiệm!'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto mb-6">
                {language === 'en' 
                  ? `You processed all experimental waste correctly and earned a total of ${score} Coins!` 
                  : `Bạn đã xử lý và phân loại thành công mọi vật phẩm phức tạp! Tổng điểm đạt được là ${score} Xu!`}
              </p>
              <button 
                onClick={restartGame}
                className="px-8 py-3 bg-gradient-to-r from-brand-green to-emerald-400 hover:scale-105 active:scale-95 text-white font-bold rounded-2xl shadow-lg transition-all"
              >
                {language === 'en' ? 'Test Again' : 'Thí Nghiệm Lại'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="flex-1 min-h-0 flex flex-col md:flex-row gap-6"
          >
            {/* Left: Workbench & Lab Tools */}
            <div className="flex-1 flex flex-col bg-slate-900/40 rounded-2xl border border-white/5 p-5 relative overflow-hidden">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase mb-4 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" /> {language === 'en' ? 'LAB BENCH WORKSPACE' : 'BÀN LÀM VIỆC PHÒNG THÍ NGHIỆM'}
              </div>

              {/* Lab Visual Area */}
              <div className="flex-1 flex items-center justify-center relative bg-black/40 rounded-xl border border-white/10 p-6 shadow-inner">
                {/* Clean / Dirty overlay animation container */}
                <div className="flex flex-col items-center gap-4 z-10 relative">
                  {!isDisassembled ? (
                    <motion.div
                      animate={isCleaned ? { scale: [1, 1.1, 1] } : {}}
                      className="text-8xl filter drop-shadow-xl relative"
                    >
                      {currentItem.icon}
                      {currentItem.isContaminated && !isCleaned && (
                        <div className="absolute -bottom-2 -right-2 text-2xl animate-pulse">🦠</div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="flex gap-4">
                      {currentItem.subComponents?.map((sub, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.5, y: 30 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-4 bg-slate-800/80 border border-white/10 rounded-2xl flex flex-col items-center gap-2 shadow-lg"
                        >
                          <span className="text-4xl">{sub.icon}</span>
                          <span className="text-xs font-semibold text-slate-300 max-w-[80px] text-center truncate">
                            {t(sub.nameKey)}
                          </span>
                          
                          {/* Subcomponent sorting bins */}
                          <div className="grid grid-cols-2 gap-1.5 mt-2">
                            <button onClick={() => handleSortSubcomponent('organic', idx)} className="px-1.5 py-1 bg-brand-green/20 hover:bg-brand-green text-brand-green hover:text-white rounded text-[10px] font-bold">🌿</button>
                            <button onClick={() => handleSortSubcomponent('recycle', idx)} className="px-1.5 py-1 bg-brand-blue/20 hover:bg-brand-blue text-brand-blue hover:text-white rounded text-[10px] font-bold">♻️</button>
                            <button onClick={() => handleSortSubcomponent('inorganic', idx)} className="px-1.5 py-1 bg-amber-500/20 hover:bg-amber-500 text-amber-500 hover:text-white rounded text-[10px] font-bold">🗑️</button>
                            <button onClick={() => handleSortSubcomponent('hazardous', idx)} className="px-1.5 py-1 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded text-[10px] font-bold">⚠️</button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  {!isDisassembled && (
                    <div className="text-center">
                      <h4 className="text-lg font-black">{t(currentItem.nameKey)}</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
                        {currentItem.isHazardous && !safetyEquipped && (language === 'en' ? '⚠️ Extreme hazard! Containment leak.' : '⚠️ Độc hại cao! Cần trang bị an toàn.')}
                        {currentItem.isContaminated && !isCleaned && (language === 'en' ? '🧼 Contaminated. Requires cleaning.' : '🧼 Dính tạp chất bẩn. Cần làm sạch.')}
                        {currentItem.needsDisassembly && !isDisassembled && (language === 'en' ? '🔧 Composite materials. Needs disassembly.' : '🔧 Vật liệu hỗn hợp. Cần tháo rã.')}
                        {!currentItem.isContaminated && !currentItem.needsDisassembly && !currentItem.isHazardous && (language === 'en' ? '✅ Ready for sorting.' : '✅ Sẵn sàng phân loại.')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Lab Tools Grid */}
              <div className="grid grid-cols-3 gap-3 mt-4 shrink-0">
                <button
                  onClick={handleEquipSafety}
                  className={`py-3 px-4 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 border transition-all ${
                    safetyEquipped 
                      ? 'bg-brand-green/20 text-brand-green border-brand-green/30' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  🛡️ {language === 'en' ? 'SAFETY GEAR' : 'BẢO HỘ'}
                </button>
                <button
                  onClick={handleWash}
                  disabled={isDisassembled}
                  className={`py-3 px-4 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 border transition-all ${
                    isCleaned 
                      ? 'bg-brand-blue/20 text-brand-blue border-brand-blue/30' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300 disabled:opacity-30'
                  }`}
                >
                  🧼 {language === 'en' ? 'WASH / CLEAN' : 'LÀM SẠCH'}
                </button>
                <button
                  onClick={handleDisassemble}
                  disabled={isDisassembled}
                  className="py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 text-slate-300 transition-all disabled:opacity-30"
                >
                  🔧 {language === 'en' ? 'DISASSEMBLE' : 'THÁO RÃ'}
                </button>
              </div>
            </div>

            {/* Right: Direct Sorting Actions */}
            <div className="w-full md:w-[260px] flex flex-col justify-between p-1">
              {!isDisassembled ? (
                <div className="space-y-4">
                  <div className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-2">
                    {language === 'en' ? 'SORT MAIN ITEM' : 'PHÂN LOẠI VẬT PHẨM CHÍNH'}
                  </div>
                  
                  <button
                    onClick={() => handleSortItemDirectly('organic')}
                    className="w-full py-4 bg-brand-green/10 hover:bg-brand-green/20 border border-brand-green/30 rounded-2xl flex items-center gap-3 px-4 font-bold text-brand-green text-sm transition-all"
                  >
                    <span className="text-2xl">🌿</span>
                    <div className="text-left">
                      <div>{t('games.organic')}</div>
                      <div className="text-[10px] text-slate-400 font-normal">Organic residues / leftovers</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSortItemDirectly('recycle')}
                    className="w-full py-4 bg-brand-blue/10 hover:bg-brand-blue/20 border border-brand-blue/30 rounded-2xl flex items-center gap-3 px-4 font-bold text-brand-blue text-sm transition-all"
                  >
                    <span className="text-2xl">♻️</span>
                    <div className="text-left">
                      <div>{t('games.recycle')}</div>
                      <div className="text-[10px] text-slate-400 font-normal">Paper, Plastics, Metal, Glass</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSortItemDirectly('inorganic')}
                    className="w-full py-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-2xl flex items-center gap-3 px-4 font-bold text-amber-500 text-sm transition-all"
                  >
                    <span className="text-2xl">🗑️</span>
                    <div className="text-left">
                      <div>{t('games.inorganic')}</div>
                      <div className="text-[10px] text-slate-400 font-normal">Bulky trash / general waste</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSortItemDirectly('hazardous')}
                    className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center gap-3 px-4 font-bold text-red-500 text-sm transition-all"
                  >
                    <span className="text-2xl">⚠️</span>
                    <div className="text-left">
                      <div>{t('games.hazardous')}</div>
                      <div className="text-[10px] text-slate-400 font-normal">E-waste, mercury, batteries</div>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center p-4 bg-slate-900/20 border border-white/5 rounded-2xl">
                  <div className="text-5xl mb-3">🔧💡</div>
                  <h4 className="font-bold text-sm mb-1">{language === 'en' ? 'Item Disassembled' : 'Đã Tháo Rã Rác Thải'}</h4>
                  <p className="text-xs text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                    {language === 'en' 
                      ? 'The compound waste has been split. Sort each isolated component cards inside the bench workspace!'
                      : 'Vật phẩm hỗn hợp đã được tháo rời thành công. Vui lòng phân loại từng thẻ linh kiện ở bàn thí nghiệm!'}
                  </p>
                </div>
              )}

              {/* Lab instructions help */}
              <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl text-xs text-slate-400 flex gap-2">
                <Trash2 className="w-4 h-4 shrink-0 text-amber-500" />
                <p>
                  {language === 'en' 
                    ? 'Always wear protective gear before treating heavy electronics or medical products to earn full tokens!'
                    : 'Luôn đeo đồ bảo hộ trước khi tháo lắp rác điện tử lớn hoặc sản phẩm y tế để bảo vệ sức khỏe và đạt điểm tối đa!'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
