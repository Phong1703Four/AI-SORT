import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle2, XCircle, BrainCircuit } from 'lucide-react';
import { ALL_QUIZ_QUESTIONS } from '../../../data/quizQuestions';
import { useTranslation } from '../../../context/LanguageContext';

import type { Inventory } from '../../../App';

interface QuizGameProps {
  setInventory: React.Dispatch<React.SetStateAction<Inventory>>;
}

export const QuizGame = ({ setInventory }: QuizGameProps) => {
  const { t, language } = useTranslation();
  const [questions, setQuestions] = useState([...ALL_QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 20));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQ.correctIndex) {
      setScore(s => s + 20);
      
      // Random resource
      const types: (keyof Inventory)[] = ['organic', 'recycle', 'inorganic', 'hazardous'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      setInventory(prev => ({
        ...prev,
        [randomType]: prev[randomType] + 5
      }));
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setQuestions([...ALL_QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 20));
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto glass rounded-3xl p-8 border border-slate-200 dark:border-white/10 text-center h-full flex flex-col justify-center"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-brand-blue to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{t('games.completed')}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">{t('games.answeredAll')}</p>
        
        <div className="glass bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 mb-6 max-w-sm mx-auto shadow-md dark:shadow-none">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{t('games.totalScore')}</div>
          <div className="text-4xl font-black text-brand-blue">{score}</div>
          <div className="mt-2 text-brand-green font-bold flex items-center justify-center gap-1 text-sm">
            {language === 'en' ? '+ Bonus Resources' : '+ Tài Nguyên Thưởng'}
          </div>
        </div>

        <button 
          onClick={resetGame}
          className="px-8 py-3 bg-brand-blue hover:bg-blue-500 text-white font-bold rounded-full transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)] mx-auto"
        >
          {t('games.playAgain')}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center h-full pb-4">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-4 glass px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-blue/20 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{t('games.question')}</div>
            <div className="text-lg font-black text-slate-900 dark:text-white leading-none">{currentIndex + 1} / {questions.length}</div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{t('games.score')}</div>
          <div className="text-lg font-black text-brand-green leading-none">{score}</div>
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full glass rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-xl relative overflow-y-auto flex-1 flex flex-col"
        >
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-white/5">
            <motion.div 
              className="h-full bg-brand-blue"
              initial={{ width: `${(currentIndex / questions.length) * 100}%` }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 leading-snug mt-2 shrink-0">
            {language === 'en' ? currentQ.question.en : currentQ.question.vi}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 shrink-0">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              
              let btnClass = "bg-white/50 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white";
              let icon = null;

              if (isAnswered) {
                if (isCorrect) {
                  btnClass = "bg-brand-green/20 border-brand-green text-emerald-700 dark:text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] font-bold";
                  icon = <CheckCircle2 className="w-5 h-5 text-brand-green" />;
                } else if (isSelected) {
                  btnClass = "bg-red-500/20 border-red-500 text-red-700 dark:text-white shadow-[0_0_15px_rgba(239,68,68,0.2)] font-bold";
                  icon = <XCircle className="w-5 h-5 text-red-500" />;
                } else {
                  btnClass = "bg-white/5 border-transparent text-slate-400 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={`relative flex items-center justify-between w-full p-4 rounded-xl border-2 text-left font-medium text-sm transition-all ${btnClass} ${!isAnswered ? 'hover:scale-[1.01]' : ''}`}
                >
                  <span>{language === 'en' ? option.en : option.vi}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                className="overflow-hidden shrink-0 mt-auto"
              >
                <div className={`p-4 rounded-xl border ${selectedOption === currentQ.correctIndex ? 'bg-brand-green/10 border-brand-green/30' : 'bg-brand-blue/10 border-brand-blue/30'}`}>
                  <h4 className={`text-sm font-bold mb-1 flex items-center gap-2 ${selectedOption === currentQ.correctIndex ? 'text-brand-green' : 'text-brand-blue'}`}>
                    {selectedOption === currentQ.correctIndex ? t('games.correct') : t('games.knowledge')}
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                    {language === 'en' ? currentQ.explanation.en : currentQ.explanation.vi}
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg text-sm"
                  >
                    {currentIndex < questions.length - 1 ? t('games.nextQuestion') : t('games.finish')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
