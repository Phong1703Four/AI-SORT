import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, AlertCircle, Info } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';

import { WASTE_ITEMS } from '../../../data/wasteData';

const BINS_CONFIG = [
  { id: 'organic', key: 'games.organic', icon: '🌿', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', hoverBorder: 'hover:border-emerald-500' },
  { id: 'recycle', key: 'games.recycle', icon: '♻️', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', hoverBorder: 'hover:border-blue-500' },
  { id: 'inorganic', key: 'games.inorganic', icon: '🗑️', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', hoverBorder: 'hover:border-amber-500' },
  { id: 'hazardous', key: 'games.hazardous', icon: '⚠️', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', hoverBorder: 'hover:border-red-500' },
];

import type { Inventory } from '../../../App';

interface ClassicGameProps {
  setInventory: React.Dispatch<React.SetStateAction<Inventory>>;
}

export const ClassicGame = ({ setInventory }: ClassicGameProps) => {
  const { t, language } = useTranslation();
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [items, setItems] = useState([...WASTE_ITEMS].sort(() => Math.random() - 0.5));
  const [currentItem, setCurrentItem] = useState(items[0]);
  const [feedback, setFeedback] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  interface ErrorModalData {
    bin: string;
    correctBin: string;
    explanation: string;
  }
  const [errorModal, setErrorModal] = useState<ErrorModalData | null>(null);

  useEffect(() => {
    if (items.length > 0) {
      setCurrentItem(items[0]);
    } else {
      // Tái nạp rác nếu hết
      const newItems = [...WASTE_ITEMS].sort(() => Math.random() - 0.5);
      setItems(newItems);
      setCurrentItem(newItems[0]);
    }
  }, [items]);

  const handleBinSelect = (binId: string) => {
    if (!currentItem || errorModal || feedback) return;

    if (currentItem.type === binId) {
      // Đúng
      const points = 10 + (streak * 2);
      setScore(s => s + points);
      setStreak(s => s + 1);
      
      // Thu thập rác vào túi đồ thay vì xu vàng
      setInventory(prev => ({ 
        ...prev, 
        [currentItem.type]: prev[currentItem.type as keyof Inventory] + 1 
      }));

      const typeName = BINS_CONFIG.find(b => b.id === currentItem.type)?.key;
      setFeedback({ text: `+1 ${t(typeName || '')}`, type: 'success' });
      
      setTimeout(() => {
        setFeedback(null);
        setItems(prev => prev.slice(1));
      }, 1000);
    } else {
      // Sai
      setStreak(0);
      const correctBinObj = BINS_CONFIG.find(b => b.id === currentItem.type);
      const userBinObj = BINS_CONFIG.find(b => b.id === binId);
      
      setErrorModal({
        bin: userBinObj?.key ? t(userBinObj.key) : binId,
        correctBin: correctBinObj?.key ? t(correctBinObj.key) : currentItem.type,
        explanation: language === 'en' ? currentItem.explanation.en : currentItem.explanation.vi
      });
    }
  };

  const closeErrorModal = () => {
    setErrorModal(null);
    setItems(prev => prev.slice(1));
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto h-full justify-between pb-4">
      {/* HUD */}
      <div className="flex justify-between w-full mb-2 glass rounded-2xl p-3 px-6 border border-slate-200 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 rounded-lg">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{t('games.score')}</div>
            <div className="text-xl font-black text-slate-900 dark:text-white leading-none">{score}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-red-500/20 text-red-600 dark:text-red-500 rounded-lg">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{t('games.combo')}</div>
            <div className="text-xl font-black text-slate-900 dark:text-white leading-none">{streak}x</div>
          </div>
        </div>
      </div>

      {/* Item Display */}
      <div className="relative w-full max-w-sm flex-1 max-h-[35vh] glass rounded-3xl border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center mb-4 shadow-xl overflow-hidden shrink-0">
        <div className="absolute top-3 left-4 right-4 flex justify-between items-center z-10">
          <div className="text-[10px] font-mono text-brand-green font-bold animate-pulse">{t('games.scanningItem')}</div>
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">ID: #{currentItem?.id.toString().padStart(4, '0')}</div>
        </div>
        
        {/* Lazer effect */}
        <motion.div 
          animate={{ y: [-50, 250, -50] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-10 right-10 h-0.5 bg-brand-green/50 shadow-[0_0_20px_rgba(16,185,129,0.8)] z-20 pointer-events-none"
        />

        <AnimatePresence mode="popLayout">
          {currentItem && !errorModal && (
            <motion.div
              key={currentItem.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative z-30 flex flex-col items-center"
            >
              <div className="relative mb-3">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] bg-gradient-to-br from-white/20 to-white/5 dark:from-white/10 dark:to-white/[0.02] backdrop-blur-md border-2 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex items-center justify-center">
                  <span className="text-7xl md:text-8xl drop-shadow-xl select-none" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}>
                    {currentItem.icon}
                  </span>
                </div>
                {/* Subtle glow behind icon */}
                <div className="absolute inset-0 rounded-[2rem] bg-brand-green/10 blur-2xl -z-10 animate-pulse" />
              </div>
              <div className="px-4 py-1.5 bg-slate-100/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-full border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-bold text-sm shadow-md">
                {language === 'en' ? currentItem.name.en : currentItem.name.vi}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Feedback Overlay */}
        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md bg-brand-green/20"
            >
              <h2 className="text-3xl font-black text-center px-4 text-brand-green drop-shadow-md">
                {feedback.text}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-slate-600 dark:text-slate-300 mb-2 font-medium text-center px-4 text-sm bg-slate-200/50 dark:bg-white/5 py-1.5 rounded-full border border-slate-300 dark:border-white/10 shrink-0">
        {t('games.chooseBin')}
      </p>

      {/* 4 Bins (Multiple Choice Buttons) */}
      <div className="grid grid-cols-2 gap-3 w-full md:gap-4 shrink-0">
        {BINS_CONFIG.map(bin => (
          <motion.button
            key={bin.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleBinSelect(bin.id)}
            className={`flex flex-col items-center p-4 rounded-3xl glass border-2 transition-all cursor-pointer shadow-md ${bin.bg} ${bin.border} ${bin.hoverBorder} hover:shadow-[0_0_15px_currentColor] group outline-none`}
            style={{ color: bin.color }}
          >
            <div className="text-4xl mb-2 filter drop-shadow-md group-hover:scale-110 transition-transform">
              {bin.icon}
            </div>
            <h3 className="font-black text-sm tracking-wide text-current">{t(bin.key)}</h3>
          </motion.button>
        ))}
      </div>

      {/* Error Explanation Modal */}
      <AnimatePresence>
        {errorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="w-full max-w-lg glass bg-slate-900 rounded-3xl p-8 border border-red-500/30 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{t('games.wrongTitle')}</h3>
                  <p className="text-slate-300 text-sm">
                    {t('games.youPut')} <strong className="text-white">{errorModal.bin}</strong>. 
                    <br/>{t('games.correctAnswerIs')} <strong className="text-brand-green">{errorModal.correctBin}</strong>!
                  </p>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 mb-6">
                <h4 className="text-sm font-semibold text-brand-green uppercase mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" /> {t('games.detailedExplanation')}
                </h4>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {errorModal.explanation}
                </p>
              </div>

              <button
                onClick={closeErrorModal}
                className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                {t('games.understood')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
