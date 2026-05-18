import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Heart } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';
import type { Inventory } from '../../../App';

interface FallingItem {
  id: number;
  icon: string;
  name: { vi: string; en: string };
  type: string;
}

const WASTE_POOL = [
  { icon: '🍌', name: { vi: 'Vỏ chuối', en: 'Banana peel' }, type: 'organic' },
  { icon: '🍎', name: { vi: 'Lõi táo', en: 'Apple core' }, type: 'organic' },
  { icon: '🥬', name: { vi: 'Rau cải', en: 'Cabbage' }, type: 'organic' },
  { icon: '🍅', name: { vi: 'Cà chua', en: 'Tomato' }, type: 'organic' },
  { icon: '🥕', name: { vi: 'Cà rốt', en: 'Carrot' }, type: 'organic' },
  { icon: '🫙', name: { vi: 'Chai nhựa', en: 'Plastic bottle' }, type: 'recycle' },
  { icon: '📰', name: { vi: 'Giấy báo', en: 'Newspaper' }, type: 'recycle' },
  { icon: '🥫', name: { vi: 'Lon nhôm', en: 'Aluminum can' }, type: 'recycle' },
  { icon: '📦', name: { vi: 'Hộp carton', en: 'Cardboard' }, type: 'recycle' },
  { icon: '🍶', name: { vi: 'Chai thủy tinh', en: 'Glass bottle' }, type: 'recycle' },
  { icon: '🛍️', name: { vi: 'Túi nilon', en: 'Plastic bag' }, type: 'inorganic' },
  { icon: '🧱', name: { vi: 'Nhựa xốp', en: 'Styrofoam' }, type: 'inorganic' },
  { icon: '🔘', name: { vi: 'Cao su', en: 'Rubber' }, type: 'inorganic' },
  { icon: '🧵', name: { vi: 'Vải vụn', en: 'Fabric scrap' }, type: 'inorganic' },
  { icon: '🔋', name: { vi: 'Pin cũ', en: 'Old battery' }, type: 'hazardous' },
  { icon: '💡', name: { vi: 'Bóng đèn', en: 'Light bulb' }, type: 'hazardous' },
  { icon: '📱', name: { vi: 'Điện thoại cũ', en: 'Old phone' }, type: 'hazardous' },
  { icon: '💊', name: { vi: 'Thuốc hết hạn', en: 'Expired medicine' }, type: 'hazardous' },
];

const BINS = [
  { id: 'organic', icon: '🌿', color: 'from-emerald-600 to-emerald-500', text: 'text-emerald-300' },
  { id: 'recycle', icon: '♻️', color: 'from-blue-600 to-blue-500', text: 'text-blue-300' },
  { id: 'inorganic', icon: '🗑️', color: 'from-amber-600 to-amber-500', text: 'text-amber-300' },
  { id: 'hazardous', icon: '⚠️', color: 'from-red-600 to-red-500', text: 'text-red-300' },
];

// Fall duration in seconds
const FALL_DURATION = 6;

interface WasteCatcherGameProps {
  setInventory: React.Dispatch<React.SetStateAction<Inventory>>;
}

export const WasteCatcherGame = ({ setInventory }: WasteCatcherGameProps) => {
  const { t, language } = useTranslation();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [currentItem, setCurrentItem] = useState<FallingItem | null>(null);
  const [itemCount, setItemCount] = useState(0);
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);
  const [leftPos, setLeftPos] = useState(30);

  const livesRef = useRef(5);
  const gameStateRef = useRef<'ready' | 'playing' | 'ended'>('ready');
  const waitingForNext = useRef(false);
  const fallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep refs in sync
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const handleFallEndRef = useRef<() => void>(() => {});

  const spawnNext = useCallback(() => {
    if (waitingForNext.current) return;
    if (gameStateRef.current !== 'playing') return;

    const pool = WASTE_POOL[Math.floor(Math.random() * WASTE_POOL.length)];
    setLeftPos(10 + Math.random() * 55);
    const newItem = {
      id: Date.now() + Math.random(),
      ...pool,
    };
    setCurrentItem(newItem);

    // Use a reliable setTimeout as fallback for fall detection
    if (fallTimerRef.current) clearTimeout(fallTimerRef.current);
    fallTimerRef.current = setTimeout(() => {
      if (gameStateRef.current === 'playing') {
        handleFallEndRef.current();
      }
    }, FALL_DURATION * 1000 + 500);
  }, []);

  // When item falls to bottom without being caught → lose a life
  const handleFallEnd = useCallback(() => {
    if (gameStateRef.current !== 'playing') return;

    if (fallTimerRef.current) {
      clearTimeout(fallTimerRef.current);
      fallTimerRef.current = null;
    }

    const newLives = livesRef.current - 1;
    livesRef.current = newLives;
    setLives(newLives);
    setFlash('wrong');
    setCurrentItem(null);

    if (newLives <= 0) {
      setGameState('ended');
      gameStateRef.current = 'ended';
      return;
    }

    waitingForNext.current = true;
    setTimeout(() => {
      setFlash(null);
      waitingForNext.current = false;
      if (gameStateRef.current === 'playing') {
        spawnNext();
      }
    }, 600);
  }, [spawnNext]);

  // Keep ref in sync
  useEffect(() => {
    handleFallEndRef.current = handleFallEnd;
  }, [handleFallEnd]);

  const catchInBin = (binId: string) => {
    if (!currentItem || gameStateRef.current !== 'playing') return;

    // Clear the fall timer since item was caught
    if (fallTimerRef.current) {
      clearTimeout(fallTimerRef.current);
      fallTimerRef.current = null;
    }

    if (currentItem.type === binId) {
      setScore(s => s + 10);
      setItemCount(c => c + 1);
      setFlash('correct');
      setInventory(p => ({ ...p, [currentItem.type]: p[currentItem.type as keyof Inventory] + 1 }));
    } else {
      const newLives = livesRef.current - 1;
      livesRef.current = newLives;
      setLives(newLives);
      setFlash('wrong');

      if (newLives <= 0) {
        setCurrentItem(null);
        setGameState('ended');
        gameStateRef.current = 'ended';
        return;
      }
    }

    setCurrentItem(null);
    waitingForNext.current = true;
    setTimeout(() => {
      setFlash(null);
      waitingForNext.current = false;
      if (gameStateRef.current === 'playing') {
        spawnNext();
      }
    }, 600);
  };

  const startGame = () => {
    setScore(0);
    setLives(5);
    livesRef.current = 5;
    setItemCount(0);
    setCurrentItem(null);
    setFlash(null);
    waitingForNext.current = false;
    if (fallTimerRef.current) clearTimeout(fallTimerRef.current);
    setGameState('playing');
    gameStateRef.current = 'playing';
    // Spawn first item after a short delay
    setTimeout(() => spawnNext(), 400);
  };

  // Cleanup on unmount or game end
  useEffect(() => {
    if (gameState === 'ended') {
      setCurrentItem(null);
      if (fallTimerRef.current) {
        clearTimeout(fallTimerRef.current);
        fallTimerRef.current = null;
      }
    }
    return () => {
      if (fallTimerRef.current) {
        clearTimeout(fallTimerRef.current);
      }
    };
  }, [gameState]);

  if (gameState === 'ready') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl mx-auto glass rounded-3xl p-8 border border-slate-200 dark:border-white/10 text-center h-full flex flex-col justify-center items-center">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{language === 'en' ? 'Waste Catcher' : 'Hứng Rác'}</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md text-sm">{language === 'en' ? 'Waste falls slowly from the sky! Tap the correct bin to catch it before it reaches the bottom. You have 5 lives.' : 'Rác rơi chậm từ trên xuống! Chọn đúng thùng rác trước khi nó rơi tới đáy. Bạn có 5 mạng.'}</p>
        <button onClick={startGame} className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:shadow-[0_0_30px_rgba(20,184,166,0.6)] transition-all">
          {language === 'en' ? '🎯 START' : '🎯 BẮT ĐẦU'}
        </button>
      </motion.div>
    );
  }

  if (gameState === 'ended') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl mx-auto glass rounded-3xl p-8 border border-slate-200 dark:border-white/10 text-center h-full flex flex-col justify-center items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(20,184,166,0.3)]">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{language === 'en' ? 'Game Over!' : 'Kết Thúc!'}</h2>
        <div className="glass rounded-2xl p-6 mb-6 border border-slate-200 dark:border-white/10">
          <div className="text-4xl font-black text-teal-400 mb-1">{score}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">{t('games.totalScore')}</div>
          <div className="text-sm text-slate-500">{language === 'en' ? `Caught ${itemCount} items` : `Đã hứng ${itemCount} rác`}</div>
        </div>
        <button onClick={startGame} className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all">
          {t('games.playAgain')}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col pb-2" style={{ height: '100%', minHeight: '450px' }}>
      {/* HUD */}
      <div className="flex justify-between items-center glass rounded-2xl p-3 px-5 border border-slate-200 dark:border-white/10 mb-2 shrink-0">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart key={i} className={`w-5 h-5 transition-all ${i < lives ? 'text-red-500 fill-red-500 scale-100' : 'text-slate-700 scale-75'}`} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-bold uppercase">{language === 'en' ? 'Caught' : 'Đã hứng'}: {itemCount}</span>
          <span className="text-xl font-black text-teal-400">{score}</span>
        </div>
      </div>

      {/* Flash overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            className={`fixed inset-0 z-50 pointer-events-none ${flash === 'correct' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`} />
        )}
      </AnimatePresence>

      {/* Falling area */}
      <div className="relative glass rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden mb-2" style={{ flex: '1 1 0', minHeight: '250px' }}>
        {/* CSS Keyframe falling animation - much more reliable than framer-motion for continuous fall */}
        <style>{`
          @keyframes wasteFall {
            0% { top: -10%; opacity: 0; transform: scale(0.3); }
            5% { opacity: 1; transform: scale(1); }
            95% { opacity: 1; transform: scale(1); }
            100% { top: 85%; opacity: 0.8; transform: scale(1); }
          }
          .falling-item {
            animation: wasteFall ${FALL_DURATION}s linear forwards;
            position: absolute;
            z-index: 10;
          }
        `}</style>

        <AnimatePresence>
          {currentItem && (
            <div
              key={currentItem.id}
              className="falling-item flex flex-col items-center"
              style={{ left: `${leftPos}%` }}
              onAnimationEnd={() => {
                // CSS animation ended = item reached bottom
                if (gameStateRef.current === 'playing') {
                  handleFallEnd();
                }
              }}
            >
              <div className="relative">
                <span className="text-5xl md:text-6xl drop-shadow-lg select-none block">{currentItem.icon}</span>
                {/* Glow behind */}
                <div className="absolute inset-0 bg-white/10 blur-xl rounded-full -z-10" />
              </div>
              <span className="text-[10px] font-bold text-white mt-1 bg-slate-900/70 px-2.5 py-0.5 rounded-full backdrop-blur-sm whitespace-nowrap border border-white/10">
                {language === 'en' ? currentItem.name.en : currentItem.name.vi}
              </span>
            </div>
          )}
        </AnimatePresence>

        {/* Guide text when no item */}
        {!currentItem && gameState === 'playing' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-slate-600 dark:text-slate-500 text-sm animate-pulse">{language === 'en' ? 'Get ready...' : 'Chuẩn bị...'}</p>
          </div>
        )}

        {/* Drop zone indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-red-500/15 to-transparent border-t border-dashed border-red-500/30">
          <p className="text-center text-red-400/50 text-[10px] font-bold mt-1">{language === 'en' ? '⚠️ DANGER ZONE' : '⚠️ VÙNG NGUY HIỂM'}</p>
        </div>
      </div>

      {/* 4 Bins */}
      <div className="grid grid-cols-4 gap-2 shrink-0">
        {BINS.map(bin => (
          <motion.button key={bin.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={() => catchInBin(bin.id)}
            className={`flex flex-col items-center p-3 md:p-4 rounded-2xl bg-gradient-to-b ${bin.color} border border-white/10 shadow-lg cursor-pointer active:shadow-inner transition-all`}>
            <span className="text-2xl md:text-3xl mb-0.5">{bin.icon}</span>
            <span className={`font-black text-[10px] md:text-xs tracking-wide ${bin.text}`}>{t(`games.${bin.id}`)}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
