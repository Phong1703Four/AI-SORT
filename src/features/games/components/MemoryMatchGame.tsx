import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';
import type { Inventory } from '../../../App';

interface Card {
  id: number;
  pairId: number;
  content: string;
  type: 'item' | 'bin';
  isFlipped: boolean;
  isMatched: boolean;
}

const PAIRS = [
  { item: '🍌', itemLabel: { vi: 'Vỏ chuối', en: 'Banana peel' }, bin: '🌿', binLabel: { vi: 'Hữu Cơ', en: 'Organic' } },
  { item: '🍶', itemLabel: { vi: 'Chai thủy tinh', en: 'Glass bottle' }, bin: '♻️', binLabel: { vi: 'Tái Chế', en: 'Recycle' } },
  { item: '🔋', itemLabel: { vi: 'Pin cũ', en: 'Old battery' }, bin: '⚠️', binLabel: { vi: 'Nguy Hại', en: 'Hazardous' } },
  { item: '🛍️', itemLabel: { vi: 'Túi nilon', en: 'Plastic bag' }, bin: '🗑️', binLabel: { vi: 'Vô Cơ', en: 'Inorganic' } },
  { item: '🍎', itemLabel: { vi: 'Vỏ táo', en: 'Apple peel' }, bin: '🌿', binLabel: { vi: 'Hữu Cơ', en: 'Organic' } },
  { item: '📰', itemLabel: { vi: 'Giấy báo', en: 'Newspaper' }, bin: '♻️', binLabel: { vi: 'Tái Chế', en: 'Recycle' } },
];

interface MemoryMatchGameProps {
  setInventory: React.Dispatch<React.SetStateAction<Inventory>>;
}

export const MemoryMatchGame = ({ setInventory }: MemoryMatchGameProps) => {
  const { t, language } = useTranslation();
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lockBoard, setLockBoard] = useState(false);

  const initGame = () => {
    const gameCards: Card[] = [];
    let id = 0;
    PAIRS.forEach((pair, pairIdx) => {
      gameCards.push({
        id: id++, pairId: pairIdx, content: pair.item, type: 'item', isFlipped: false, isMatched: false,
      });
      gameCards.push({
        id: id++, pairId: pairIdx, content: pair.bin, type: 'bin', isFlipped: false, isMatched: false,
      });
    });
    setCards(gameCards.sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMoves(0);
    setMatches(0);
    setGameOver(false);
    setLockBoard(false);
  };

  useEffect(() => { initGame(); }, []);

  const handleFlip = (cardId: number) => {
    if (lockBoard) return;
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    if (flipped.includes(cardId)) return;

    const newFlipped = [...flipped, cardId];
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, isFlipped: true } : c));
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLockBoard(true);
      const [firstId, secondId] = newFlipped;
      const first = cards.find(c => c.id === firstId)!;
      const second = cards.find(c => c.id === secondId)!;

      if (first.pairId === second.pairId && first.type !== second.type) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c => c.pairId === first.pairId ? { ...c, isMatched: true } : c));
          setMatches(m => {
            const newM = m + 1;
            if (newM === PAIRS.length) {
              setGameOver(true);
              const types: (keyof Inventory)[] = ['organic', 'recycle', 'inorganic', 'hazardous'];
              const r = types[Math.floor(Math.random() * types.length)];
              setInventory(p => ({ ...p, [r]: p[r] + 10 }));
            }
            return newM;
          });
          setFlipped([]);
          setLockBoard(false);
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c));
          setFlipped([]);
          setLockBoard(false);
        }, 800);
      }
    }
  };

  if (gameOver) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl mx-auto glass rounded-3xl p-8 border border-slate-200 dark:border-white/10 text-center h-full flex flex-col justify-center items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{language === 'en' ? 'All Matched!' : 'Ghép Hết!'}</h2>
        <div className="glass rounded-2xl p-6 mb-6 border border-slate-200 dark:border-white/10">
          <div className="text-4xl font-black text-cyan-400 mb-1">{moves}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">{language === 'en' ? 'Total Moves' : 'Tổng Lượt'}</div>
        </div>
        <button onClick={initGame} className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-full shadow-lg">
          {t('games.playAgain')}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-full justify-between pb-2">
      {/* Header */}
      <div className="flex justify-between items-center glass rounded-2xl p-3 px-5 border border-slate-200 dark:border-white/10 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{language === 'en' ? 'Moves' : 'Lượt'}: <span className="text-cyan-400 text-lg font-black">{moves}</span></span>
        </div>
        <div className="text-sm font-bold text-slate-500 dark:text-slate-400">{language === 'en' ? 'Pairs' : 'Cặp'}: <span className="text-cyan-400 text-lg font-black">{matches}/{PAIRS.length}</span></div>
        <button onClick={initGame} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
          <RotateCcw className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <p className="text-center text-slate-500 dark:text-slate-400 text-xs mb-2 shrink-0">{language === 'en' ? 'Match each waste item with its correct bin!' : 'Ghép mỗi loại rác với thùng đúng!'}</p>

      {/* Card Grid */}
      <div className="flex-1 grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-3 min-h-0 auto-rows-fr">
        {cards.map(card => (
          <motion.button key={card.id} onClick={() => handleFlip(card.id)}
            whileTap={{ scale: 0.95 }}
            className={`rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer min-h-0 ${
              card.isMatched
                ? 'bg-cyan-500/20 border-cyan-500/50 opacity-60'
                : card.isFlipped
                  ? 'bg-white/20 dark:bg-white/10 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'glass border-slate-200 dark:border-white/10 hover:border-cyan-400/30 hover:bg-white/5'
            }`}>
            <AnimatePresence mode="wait">
              {card.isFlipped || card.isMatched ? (
                <motion.div key="front" initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} exit={{ rotateY: 90 }} transition={{ duration: 0.2 }} className="flex flex-col items-center">
                  <span className="text-3xl md:text-4xl mb-1">{card.content}</span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-tight text-center px-1">
                    {card.type === 'item'
                      ? (language === 'en' ? PAIRS[card.pairId].itemLabel.en : PAIRS[card.pairId].itemLabel.vi)
                      : (language === 'en' ? PAIRS[card.pairId].binLabel.en : PAIRS[card.pairId].binLabel.vi)}
                  </span>
                </motion.div>
              ) : (
                <motion.div key="back" initial={{ rotateY: -90 }} animate={{ rotateY: 0 }} exit={{ rotateY: -90 }} transition={{ duration: 0.2 }}>
                  <span className="text-3xl md:text-4xl">❓</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
