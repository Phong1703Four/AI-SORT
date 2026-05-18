import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';
import type { Inventory } from '../../../App';

interface Statement {
  id: number;
  text: { vi: string; en: string };
  isTrue: boolean;
  explanation: { vi: string; en: string };
}

const STATEMENTS: Statement[] = [
  { id: 1, text: { vi: 'Túi nilon mất hơn 500 năm để phân hủy.', en: 'Plastic bags take over 500 years to decompose.' }, isTrue: true, explanation: { vi: 'Đúng! Túi nilon có thể mất từ 500-1000 năm để phân hủy tự nhiên.', en: 'True! Plastic bags can take 500-1000 years to decompose naturally.' } },
  { id: 2, text: { vi: 'Thủy tinh có thể tái chế vô hạn lần.', en: 'Glass can be recycled infinitely.' }, isTrue: true, explanation: { vi: 'Đúng! Thủy tinh có thể tái chế 100% và không giới hạn số lần.', en: 'True! Glass is 100% recyclable with no limit on number of times.' } },
  { id: 3, text: { vi: 'Pin AA có thể vứt chung với rác sinh hoạt.', en: 'AA batteries can be thrown with household waste.' }, isTrue: false, explanation: { vi: 'Sai! Pin chứa kim loại nặng độc hại, phải đem đến điểm thu gom rác nguy hại.', en: 'False! Batteries contain toxic heavy metals and must be taken to hazardous waste points.' } },
  { id: 4, text: { vi: 'Giấy báo đã dùng có thể tái chế.', en: 'Used newspapers can be recycled.' }, isTrue: true, explanation: { vi: 'Đúng! Giấy báo khô ráo có thể tái chế thành các sản phẩm giấy mới.', en: 'True! Dry newspapers can be recycled into new paper products.' } },
  { id: 5, text: { vi: 'Vỏ chuối là rác vô cơ.', en: 'Banana peels are inorganic waste.' }, isTrue: false, explanation: { vi: 'Sai! Vỏ chuối là rác hữu cơ, phân hủy sinh học tự nhiên và có thể ủ phân compost.', en: 'False! Banana peels are organic waste, naturally biodegradable and great for composting.' } },
  { id: 6, text: { vi: 'Đốt nhựa tạo ra khí Dioxin gây ung thư.', en: 'Burning plastic produces cancer-causing Dioxin gas.' }, isTrue: true, explanation: { vi: 'Đúng! Đốt nhựa sinh ra Dioxin và Furan cực độc, có khả năng gây ung thư và đột biến gen.', en: 'True! Burning plastic produces extremely toxic Dioxin and Furan, which can cause cancer.' } },
  { id: 7, text: { vi: 'Hộp sữa giấy Tetra Pak không thể tái chế.', en: 'Tetra Pak milk cartons cannot be recycled.' }, isTrue: false, explanation: { vi: 'Sai! Hộp Tetra Pak hoàn toàn có thể tái chế bằng công nghệ đặc biệt.', en: 'False! Tetra Pak can be fully recycled using special technology.' } },
  { id: 8, text: { vi: 'Metan (CH4) là khí nhà kính chính từ bãi rác.', en: 'Methane (CH4) is the main greenhouse gas from landfills.' }, isTrue: true, explanation: { vi: 'Đúng! Phân hủy rác hữu cơ trong điều kiện thiếu oxy tạo ra lượng lớn khí CH4.', en: 'True! Organic waste decomposition under anaerobic conditions produces large amounts of CH4.' } },
  { id: 9, text: { vi: 'Gương vỡ có thể tái chế chung với chai thủy tinh.', en: 'Broken mirrors can be recycled with glass bottles.' }, isTrue: false, explanation: { vi: 'Sai! Gương có lớp tráng kim loại, không thể tái chế chung với thủy tinh thông thường.', en: 'False! Mirrors have metallic coating and cannot be recycled with regular glass.' } },
  { id: 10, text: { vi: 'Tái chế 1 tấn giấy cứu được khoảng 17 cây xanh.', en: 'Recycling 1 ton of paper saves about 17 trees.' }, isTrue: true, explanation: { vi: 'Đúng! Theo thống kê, tái chế 1 tấn giấy cứu khoảng 17 cây trưởng thành.', en: 'True! Statistics show recycling 1 ton of paper saves about 17 mature trees.' } },
  { id: 11, text: { vi: 'Nhựa xốp (styrofoam) dễ dàng tái chế.', en: 'Styrofoam is easily recyclable.' }, isTrue: false, explanation: { vi: 'Sai! Nhựa xốp rất khó tái chế, thuộc nhóm rác vô cơ.', en: 'False! Styrofoam is very hard to recycle and belongs to inorganic waste.' } },
  { id: 12, text: { vi: 'Bóng đèn huỳnh quang chứa thủy ngân.', en: 'Fluorescent bulbs contain mercury.' }, isTrue: true, explanation: { vi: 'Đúng! Chúng chứa lượng nhỏ thủy ngân, thuộc rác nguy hại.', en: 'True! They contain small amounts of mercury and are hazardous waste.' } },
  { id: 13, text: { vi: 'Vi nhựa (microplastics) là hạt nhựa nhỏ hơn 5cm.', en: 'Microplastics are plastic particles smaller than 5cm.' }, isTrue: false, explanation: { vi: 'Sai! Vi nhựa là hạt nhựa nhỏ hơn 5mm (không phải 5cm).', en: 'False! Microplastics are smaller than 5mm (not 5cm).' } },
  { id: 14, text: { vi: '80% rác nhựa đại dương xuất phát từ đất liền.', en: '80% of ocean plastic comes from land-based activities.' }, isTrue: true, explanation: { vi: 'Đúng! Phần lớn rác nhựa biển bị cuốn từ đất liền qua sông ra biển.', en: 'True! Most marine plastic is washed from land through rivers into the ocean.' } },
  { id: 15, text: { vi: 'Tã giấy dùng một lần phân hủy trong 10 năm.', en: 'Disposable diapers decompose in 10 years.' }, isTrue: false, explanation: { vi: 'Sai! Tã giấy mất đến 500 năm để phân hủy do chứa nhựa tổng hợp.', en: 'False! Diapers take up to 500 years due to synthetic plastics.' } },
  { id: 16, text: { vi: 'Ngày Trái Đất được tổ chức vào 22 tháng 4.', en: 'Earth Day is celebrated on April 22.' }, isTrue: true, explanation: { vi: 'Đúng! Ngày Trái Đất là 22/4 hằng năm.', en: 'True! Earth Day is on April 22 every year.' } },
  { id: 17, text: { vi: 'Than đá là nguồn năng lượng tái tạo.', en: 'Coal is a renewable energy source.' }, isTrue: false, explanation: { vi: 'Sai! Than đá là nhiên liệu hóa thạch, không tái tạo.', en: 'False! Coal is a fossil fuel, non-renewable.' } },
  { id: 18, text: { vi: 'Compost cung cấp dinh dưỡng tự nhiên cho đất.', en: 'Compost provides natural nutrients for soil.' }, isTrue: true, explanation: { vi: 'Đúng! Phân compost giúp đất tơi xốp, giữ ẩm và cung cấp dinh dưỡng an toàn.', en: 'True! Compost aerates soil, retains moisture, and provides safe nutrients.' } },
  { id: 19, text: { vi: 'Biểu tượng tái chế Mobius Loop có 4 mũi tên.', en: 'The Mobius Loop recycling symbol has 4 arrows.' }, isTrue: false, explanation: { vi: 'Sai! Biểu tượng Mobius Loop gồm 3 mũi tên.', en: 'False! The Mobius Loop has 3 arrows.' } },
  { id: 20, text: { vi: 'CFCs từ máy lạnh cũ gây thủng tầng Ozon.', en: 'CFCs from old AC units deplete the Ozone layer.' }, isTrue: true, explanation: { vi: 'Đúng! CFCs phá hủy các phân tử Ozon trong tầng bình lưu.', en: 'True! CFCs destroy Ozone molecules in the stratosphere.' } },
];

interface TrueFalseGameProps {
  setInventory: React.Dispatch<React.SetStateAction<Inventory>>;
}

export const TrueFalseGame = ({ setInventory }: TrueFalseGameProps) => {
  const { t, language } = useTranslation();
  const [questions] = useState(() => [...STATEMENTS].sort(() => Math.random() - 0.5).slice(0, 15));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const current = questions[idx];

  const handleAnswer = (answer: boolean) => {
    if (answered) return;
    setAnswered(true);
    const correct = answer === current.isTrue;
    setWasCorrect(correct);
    if (correct) {
      setScore(s => s + 15);
      const types: (keyof Inventory)[] = ['organic', 'recycle', 'inorganic', 'hazardous'];
      const r = types[Math.floor(Math.random() * types.length)];
      setInventory(p => ({ ...p, [r]: p[r] + 3 }));
    }
  };

  const next = () => {
    if (idx < questions.length - 1) { setIdx(i => i + 1); setAnswered(false); }
    else setGameOver(true);
  };

  if (gameOver) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl mx-auto glass rounded-3xl p-8 border border-slate-200 dark:border-white/10 text-center h-full flex flex-col justify-center items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{t('games.completed')}</h2>
        <div className="glass rounded-2xl p-6 mb-6 border border-slate-200 dark:border-white/10">
          <div className="text-4xl font-black text-purple-400">{score}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">{t('games.totalScore')}</div>
        </div>
        <button onClick={() => { setIdx(0); setScore(0); setAnswered(false); setGameOver(false); }} className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg">
          {t('games.playAgain')}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-full justify-between pb-2">
      {/* Header */}
      <div className="flex justify-between items-center glass rounded-2xl p-3 px-5 border border-slate-200 dark:border-white/10 mb-3 shrink-0">
        <div className="text-sm font-bold text-slate-500 dark:text-slate-400">{idx + 1} / {questions.length}</div>
        <div className="flex-1 mx-4 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full bg-purple-500 rounded-full" animate={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
        </div>
        <div className="text-lg font-black text-purple-400">{score}</div>
      </div>

      {/* Statement Card */}
      <AnimatePresence mode="wait">
        <motion.div key={current.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          className="flex-1 glass rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-white/10 shadow-xl flex flex-col justify-center items-center text-center mb-3">
          
          <div className="text-5xl mb-4">🤔</div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-snug mb-6 max-w-lg">
            {language === 'en' ? current.text.en : current.text.vi}
          </h3>

          {!answered ? (
            <div className="flex gap-4">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleAnswer(true)}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-500 font-bold text-lg hover:bg-emerald-500/30 transition-colors">
                <ThumbsUp className="w-5 h-5" /> {language === 'en' ? 'TRUE' : 'ĐÚNG'}
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleAnswer(false)}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-red-500/20 border-2 border-red-500/40 text-red-500 font-bold text-lg hover:bg-red-500/30 transition-colors">
                <ThumbsDown className="w-5 h-5" /> {language === 'en' ? 'FALSE' : 'SAI'}
              </motion.button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
              <div className={`flex items-center gap-2 justify-center mb-3 text-lg font-bold ${wasCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                {wasCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                {wasCorrect ? (language === 'en' ? 'Correct!' : 'Chính xác!') : (language === 'en' ? 'Wrong!' : 'Sai rồi!')}
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">{language === 'en' ? current.explanation.en : current.explanation.vi}</p>
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
