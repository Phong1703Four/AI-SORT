import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lightbulb, SkipForward } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';
import type { Inventory } from '../../../App';

interface WordItem {
  id: number;
  word: { vi: string; en: string };
  hint: { vi: string; en: string };
}

const WORDS: WordItem[] = [
  { id: 1, word: { vi: 'TÁI CHẾ', en: 'RECYCLE' }, hint: { vi: 'Biến rác cũ thành sản phẩm mới', en: 'Turn old waste into new products' } },
  { id: 2, word: { vi: 'HỮU CƠ', en: 'ORGANIC' }, hint: { vi: 'Loại rác phân hủy sinh học tự nhiên', en: 'Waste that naturally biodegrades' } },
  { id: 3, word: { vi: 'COMPOST', en: 'COMPOST' }, hint: { vi: 'Phân bón ủ từ rác thực vật', en: 'Fertilizer made from plant waste' } },
  { id: 4, word: { vi: 'DIOXIN', en: 'DIOXIN' }, hint: { vi: 'Khí cực độc khi đốt nhựa', en: 'Extremely toxic gas from burning plastic' } },
  { id: 5, word: { vi: 'METAN', en: 'METHANE' }, hint: { vi: 'Khí nhà kính chính từ bãi rác', en: 'Main greenhouse gas from landfills' } },
  { id: 6, word: { vi: 'NILON', en: 'NYLON' }, hint: { vi: 'Túi nhựa mất hàng trăm năm để phân hủy', en: 'Plastic bag taking hundreds of years to decompose' } },
  { id: 7, word: { vi: 'OZON', en: 'OZONE' }, hint: { vi: 'Tầng bảo vệ Trái Đất khỏi tia UV', en: 'Layer protecting Earth from UV rays' } },
  { id: 8, word: { vi: 'NGUY HẠI', en: 'HAZARDOUS' }, hint: { vi: 'Rác chứa hóa chất độc hại', en: 'Waste containing toxic chemicals' } },
  { id: 9, word: { vi: 'SINH THÁI', en: 'ECOLOGY' }, hint: { vi: 'Khoa học nghiên cứu hệ sinh vật và môi trường', en: 'Science studying organisms and their environment' } },
  { id: 10, word: { vi: 'VI NHỰA', en: 'MICROPLASTIC' }, hint: { vi: 'Hạt nhựa siêu nhỏ dưới 5mm', en: 'Tiny plastic particles under 5mm' } },
  { id: 11, word: { vi: 'NĂNG LƯỢNG', en: 'ENERGY' }, hint: { vi: 'Mặt trời, gió, nước cung cấp dạng tái tạo', en: 'Sun, wind, water provide renewable forms' } },
  { id: 12, word: { vi: 'Ô NHIỄM', en: 'POLLUTION' }, hint: { vi: 'Hệ quả của xả rác bừa bãi', en: 'Consequence of littering' } },
  { id: 13, word: { vi: 'PHÂN LOẠI', en: 'SORTING' }, hint: { vi: 'Chia rác thành các nhóm khác nhau', en: 'Dividing waste into different groups' } },
  { id: 14, word: { vi: 'KHÍ HẬU', en: 'CLIMATE' }, hint: { vi: 'Biến đổi ... là vấn đề toàn cầu', en: '... change is a global issue' } },
  { id: 15, word: { vi: 'BỀN VỮNG', en: 'SUSTAINABLE' }, hint: { vi: 'Phát triển đáp ứng hiện tại mà không hại tương lai', en: 'Development meeting present needs without harming future' } },
];

const shuffle = (s: string) => s.split('').sort(() => Math.random() - 0.5).join('');

interface WordScrambleGameProps {
  setInventory: React.Dispatch<React.SetStateAction<Inventory>>;
}

export const WordScrambleGame = ({ setInventory }: WordScrambleGameProps) => {
  const { t, language } = useTranslation();
  const [questions] = useState(() => [...WORDS].sort(() => Math.random() - 0.5).slice(0, 10));
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [scrambled, setScrambled] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const current = questions[idx];
  const correctWord = language === 'en' ? current.word.en : current.word.vi;

  useEffect(() => {
    let s = shuffle(correctWord);
    while (s === correctWord) s = shuffle(correctWord);
    setScrambled(s);
    setInput('');
    setShowHint(false);
    setAnswered(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [idx, language, correctWord]);

  const checkAnswer = () => {
    if (answered) return;
    const correct = input.trim().toUpperCase() === correctWord.toUpperCase();
    setWasCorrect(correct);
    setAnswered(true);
    if (correct) {
      setScore(s => s + (showHint ? 10 : 20));
      const types: (keyof Inventory)[] = ['organic', 'recycle', 'inorganic', 'hazardous'];
      const r = types[Math.floor(Math.random() * types.length)];
      setInventory(p => ({ ...p, [r]: p[r] + 3 }));
    }
  };

  const next = () => {
    if (idx < questions.length - 1) setIdx(i => i + 1);
    else setGameOver(true);
  };

  const skipWord = () => {
    setAnswered(true);
    setWasCorrect(false);
  };

  if (gameOver) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl mx-auto glass rounded-3xl p-8 border border-slate-200 dark:border-white/10 text-center h-full flex flex-col justify-center items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{t('games.completed')}</h2>
        <div className="glass rounded-2xl p-6 mb-6 border border-slate-200 dark:border-white/10">
          <div className="text-4xl font-black text-violet-400">{score}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">{t('games.totalScore')}</div>
        </div>
        <button onClick={() => { setIdx(0); setScore(0); setGameOver(false); }} className="px-8 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-full shadow-lg">
          {t('games.playAgain')}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-full justify-between pb-2">
      {/* Header */}
      <div className="flex justify-between items-center glass rounded-2xl p-3 px-5 border border-slate-200 dark:border-white/10 mb-3 shrink-0">
        <div className="text-sm font-bold text-slate-500 dark:text-slate-400">{idx + 1}/{questions.length}</div>
        <div className="flex-1 mx-4 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full bg-violet-500 rounded-full" animate={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
        </div>
        <div className="text-lg font-black text-violet-400">{score}</div>
      </div>

      {/* Game Card */}
      <AnimatePresence mode="wait">
        <motion.div key={current.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          className="flex-1 glass rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-white/10 shadow-xl flex flex-col items-center justify-center text-center mb-3">

          <div className="text-4xl mb-3">🔤</div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{language === 'en' ? 'Unscramble the eco word:' : 'Giải mã từ khóa môi trường:'}</p>

          {/* Scrambled letters */}
          <div className="flex gap-2 mb-6 flex-wrap justify-center">
            {scrambled.split('').map((letter, i) => (
              <motion.div key={i} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: i * 0.05, type: 'spring' }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/20 border-2 border-violet-500/40 flex items-center justify-center font-black text-lg md:text-xl text-white shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                {letter === ' ' ? '·' : letter}
              </motion.div>
            ))}
          </div>

          {/* Hint */}
          {showHint && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-violet-400 mb-4 flex items-center gap-1">
              <Lightbulb className="w-4 h-4" /> {language === 'en' ? current.hint.en : current.hint.vi}
            </motion.p>
          )}

          {!answered ? (
            <div className="w-full max-w-sm">
              <div className="flex gap-2 mb-3">
                <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && checkAnswer()}
                  placeholder={language === 'en' ? 'Type your answer...' : 'Gõ đáp án...'}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border-2 border-white/10 focus:border-violet-500/50 outline-none text-slate-900 dark:text-white font-bold text-center text-lg tracking-widest placeholder:text-slate-500 placeholder:text-sm placeholder:tracking-normal" />
              </div>
              <div className="flex gap-2 justify-center">
                <button onClick={checkAnswer} disabled={!input.trim()}
                  className="px-6 py-2.5 bg-violet-500 hover:bg-violet-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-full transition-colors shadow-lg text-sm">
                  {language === 'en' ? 'Check' : 'Kiểm Tra'}
                </button>
                {!showHint && (
                  <button onClick={() => setShowHint(true)} className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-slate-400 rounded-full transition-colors text-sm flex items-center gap-1">
                    <Lightbulb className="w-4 h-4" /> {language === 'en' ? 'Hint' : 'Gợi ý'}
                  </button>
                )}
                <button onClick={skipWord} className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-slate-400 rounded-full transition-colors text-sm flex items-center gap-1">
                  <SkipForward className="w-4 h-4" /> {language === 'en' ? 'Skip' : 'Bỏ qua'}
                </button>
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
              <div className={`text-lg font-bold mb-2 ${wasCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                {wasCorrect ? (language === 'en' ? '✅ Correct!' : '✅ Chính xác!') : (language === 'en' ? `❌ Answer: ${correctWord}` : `❌ Đáp án: ${correctWord}`)}
              </div>
              <button onClick={next} className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full text-sm">
                {idx < questions.length - 1 ? t('games.nextQuestion') : t('games.finish')}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
