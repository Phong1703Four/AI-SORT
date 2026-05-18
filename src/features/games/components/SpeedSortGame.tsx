import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Trophy, Zap } from 'lucide-react';
import { WASTE_ITEMS } from '../../../data/wasteData';
import { useTranslation } from '../../../context/LanguageContext';
import type { Inventory } from '../../../App';

const BINS = [
  { id: 'organic', icon: '🌿', color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/40', text: 'text-emerald-400', glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]' },
  { id: 'recycle', icon: '♻️', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/40', text: 'text-blue-400', glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]' },
  { id: 'inorganic', icon: '🗑️', color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/40', text: 'text-amber-400', glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]' },
  { id: 'hazardous', icon: '⚠️', color: 'from-red-500/20 to-red-600/10', border: 'border-red-500/40', text: 'text-red-400', glow: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]' },
];

const GAME_TIME = 60;

interface SpeedSortGameProps {
  setInventory: React.Dispatch<React.SetStateAction<Inventory>>;
}

export const SpeedSortGame = ({ setInventory }: SpeedSortGameProps) => {
  const { t, language } = useTranslation();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [items, setItems] = useState(() => [...WASTE_ITEMS].sort(() => Math.random() - 0.5));
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);

  const currentItem = items[0];

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) { setGameState('ended'); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, gameState]);

  const handleSelect = useCallback((binId: string) => {
    if (gameState !== 'playing' || !currentItem) return;
    if (currentItem.type === binId) {
      setScore(s => s + 10);
      setCorrect(c => c + 1);
      setFlash('correct');
      setInventory(prev => ({ ...prev, [currentItem.type]: prev[currentItem.type as keyof Inventory] + 1 }));
    } else {
      setScore(s => Math.max(0, s - 5));
      setWrong(w => w + 1);
      setFlash('wrong');
    }
    setItems(prev => prev.length > 1 ? prev.slice(1) : [...WASTE_ITEMS].sort(() => Math.random() - 0.5));
    setTimeout(() => setFlash(null), 300);
  }, [gameState, currentItem, setInventory]);

  const startGame = () => {
    setItems([...WASTE_ITEMS].sort(() => Math.random() - 0.5));
    setTimeLeft(GAME_TIME);
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setGameState('playing');
  };

  if (gameState === 'ready') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl mx-auto glass rounded-3xl p-8 border border-slate-200 dark:border-white/10 text-center h-full flex flex-col justify-center items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/30 to-red-500/30 flex items-center justify-center mb-4 border border-orange-500/30">
          <Zap className="w-10 h-10 text-orange-400" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{language === 'en' ? 'Speed Sort' : 'Phân Loại Siêu Tốc'}</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md text-sm">{language === 'en' ? 'Sort as many items as you can in 60 seconds! +10 for correct, -5 for wrong.' : 'Phân loại nhiều rác nhất có thể trong 60 giây! +10 đúng, -5 sai.'}</p>
        <button onClick={startGame} className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all">
          {language === 'en' ? '🚀 START' : '🚀 BẮT ĐẦU'}
        </button>
      </motion.div>
    );
  }

  if (gameState === 'ended') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl mx-auto glass rounded-3xl p-8 border border-slate-200 dark:border-white/10 text-center h-full flex flex-col justify-center items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{language === 'en' ? 'Time\'s Up!' : 'Hết Giờ!'}</h2>
        <div className="glass rounded-2xl p-6 mb-6 border border-slate-200 dark:border-white/10">
          <div className="text-4xl font-black text-orange-400 mb-1">{score}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">{t('games.totalScore')}</div>
          <div className="flex gap-6 justify-center text-sm">
            <span className="text-emerald-400 font-bold">✅ {correct}</span>
            <span className="text-red-400 font-bold">❌ {wrong}</span>
          </div>
        </div>
        <button onClick={startGame} className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full shadow-lg">
          {t('games.playAgain')}
        </button>
      </motion.div>
    );
  }

  const pct = (timeLeft / GAME_TIME) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full justify-between pb-2">
      {/* HUD */}
      <div className="flex justify-between items-center glass rounded-2xl p-3 px-5 border border-slate-200 dark:border-white/10 mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <Timer className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-orange-400'}`} />
          <span className={`text-xl font-black ${timeLeft <= 10 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{timeLeft}s</span>
        </div>
        <div className="flex-1 mx-4 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
          <motion.div className={`h-full rounded-full ${timeLeft <= 10 ? 'bg-red-500' : 'bg-orange-400'}`} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
        </div>
        <div className="text-xl font-black text-orange-400">{score}</div>
      </div>

      {/* Flash overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div initial={{ opacity: 0.8 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-50 pointer-events-none ${flash === 'correct' ? 'bg-emerald-500/15' : 'bg-red-500/15'}`} />
        )}
      </AnimatePresence>

      {/* Current Item */}
      <div className="flex-1 flex items-center justify-center min-h-0 mb-2">
        <AnimatePresence mode="popLayout">
          {currentItem && (
            <motion.div key={currentItem.id} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, y: 50, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="flex flex-col items-center">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-white/20 to-white/5 dark:from-white/10 dark:to-white/[0.02] backdrop-blur-md border-2 border-white/20 shadow-xl flex items-center justify-center mb-3">
                <span className="text-6xl md:text-7xl select-none drop-shadow-lg">{currentItem.icon}</span>
              </div>
              <div className="px-4 py-1.5 bg-slate-100/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-full border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-bold text-sm shadow-md">
                {language === 'en' ? currentItem.name.en : currentItem.name.vi}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4 Bins */}
      <div className="grid grid-cols-2 gap-3 shrink-0">
        {BINS.map(bin => (
          <motion.button key={bin.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} onClick={() => handleSelect(bin.id)}
            className={`flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br ${bin.color} border-2 ${bin.border} ${bin.glow} transition-all cursor-pointer backdrop-blur-sm`}>
            <span className="text-3xl mb-1">{bin.icon}</span>
            <span className={`font-black text-xs tracking-wide ${bin.text}`}>{t(`games.${bin.id}`)}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
