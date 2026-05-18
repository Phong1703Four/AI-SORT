import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClassicGame } from './ClassicGame';
import { QuizGame } from './QuizGame';
import { SpeedSortGame } from './SpeedSortGame';
import { TrueFalseGame } from './TrueFalseGame';
import { MemoryMatchGame } from './MemoryMatchGame';
import { WasteCatcherGame } from './WasteCatcherGame';
import { WordScrambleGame } from './WordScrambleGame';
import { EcoLabGame } from './EcoLabGame';
import { Gamepad2, BrainCircuit, Zap, ThumbsUp, Layers, Target, Type, ArrowLeft, Beaker } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';

import type { Inventory } from '../../../App';

type GameId = 'hub' | 'classic' | 'quiz' | 'speedsort' | 'truefalse' | 'memory' | 'catcher' | 'scramble' | 'ecolab';

interface GamesHubProps {
  setInventory: React.Dispatch<React.SetStateAction<Inventory>>;
}

const GAME_CARDS = [
  { id: 'classic' as GameId, icon: Gamepad2, titleKey: 'games.classicTitle', descKey: 'games.classicDesc', btnKey: 'games.playNow',
    iconBg: 'bg-brand-green/15', iconBorder: 'border-brand-green/20', iconColor: 'text-brand-green', glow: 'bg-brand-green/15', glowHover: 'group-hover:bg-brand-green/30', hoverBorder: 'hover:border-brand-green/50', btnBg: 'bg-brand-green/10', btnText: 'text-brand-green', btnHoverBg: 'group-hover:bg-brand-green', btnHoverText: 'group-hover:text-white' },
  { id: 'quiz' as GameId, icon: BrainCircuit, titleKey: 'games.quizTitle', descKey: 'games.quizDesc', btnKey: 'games.tryNow',
    iconBg: 'bg-blue-500/15', iconBorder: 'border-blue-500/20', iconColor: 'text-blue-500', glow: 'bg-blue-500/15', glowHover: 'group-hover:bg-blue-500/30', hoverBorder: 'hover:border-blue-500/50', btnBg: 'bg-blue-500/10', btnText: 'text-blue-500', btnHoverBg: 'group-hover:bg-blue-500', btnHoverText: 'group-hover:text-white' },
  { id: 'speedsort' as GameId, icon: Zap, titleKey: 'games.speedTitle', descKey: 'games.speedDesc', btnKey: 'games.playNow',
    iconBg: 'bg-orange-500/15', iconBorder: 'border-orange-500/20', iconColor: 'text-orange-500', glow: 'bg-orange-500/15', glowHover: 'group-hover:bg-orange-500/30', hoverBorder: 'hover:border-orange-500/50', btnBg: 'bg-orange-500/10', btnText: 'text-orange-500', btnHoverBg: 'group-hover:bg-orange-500', btnHoverText: 'group-hover:text-white' },
  { id: 'truefalse' as GameId, icon: ThumbsUp, titleKey: 'games.tfTitle', descKey: 'games.tfDesc', btnKey: 'games.tryNow',
    iconBg: 'bg-purple-500/15', iconBorder: 'border-purple-500/20', iconColor: 'text-purple-500', glow: 'bg-purple-500/15', glowHover: 'group-hover:bg-purple-500/30', hoverBorder: 'hover:border-purple-500/50', btnBg: 'bg-purple-500/10', btnText: 'text-purple-500', btnHoverBg: 'group-hover:bg-purple-500', btnHoverText: 'group-hover:text-white' },
  { id: 'memory' as GameId, icon: Layers, titleKey: 'games.memoryTitle', descKey: 'games.memoryDesc', btnKey: 'games.playNow',
    iconBg: 'bg-cyan-500/15', iconBorder: 'border-cyan-500/20', iconColor: 'text-cyan-500', glow: 'bg-cyan-500/15', glowHover: 'group-hover:bg-cyan-500/30', hoverBorder: 'hover:border-cyan-500/50', btnBg: 'bg-cyan-500/10', btnText: 'text-cyan-500', btnHoverBg: 'group-hover:bg-cyan-500', btnHoverText: 'group-hover:text-white' },
  { id: 'catcher' as GameId, icon: Target, titleKey: 'games.catcherTitle', descKey: 'games.catcherDesc', btnKey: 'games.playNow',
    iconBg: 'bg-teal-500/15', iconBorder: 'border-teal-500/20', iconColor: 'text-teal-500', glow: 'bg-teal-500/15', glowHover: 'group-hover:bg-teal-500/30', hoverBorder: 'hover:border-teal-500/50', btnBg: 'bg-teal-500/10', btnText: 'text-teal-500', btnHoverBg: 'group-hover:bg-teal-500', btnHoverText: 'group-hover:text-white' },
  { id: 'scramble' as GameId, icon: Type, titleKey: 'games.scrambleTitle', descKey: 'games.scrambleDesc', btnKey: 'games.tryNow',
    iconBg: 'bg-violet-500/15', iconBorder: 'border-violet-500/20', iconColor: 'text-violet-500', glow: 'bg-violet-500/15', glowHover: 'group-hover:bg-violet-500/30', hoverBorder: 'hover:border-violet-500/50', btnBg: 'bg-violet-500/10', btnText: 'text-violet-500', btnHoverBg: 'group-hover:bg-violet-500', btnHoverText: 'group-hover:text-white' },
  { id: 'ecolab' as GameId, icon: Beaker, titleKey: 'games.ecolabTitle', descKey: 'games.ecolabDesc', btnKey: 'games.playNow',
    iconBg: 'bg-emerald-500/15', iconBorder: 'border-emerald-500/20', iconColor: 'text-emerald-500', glow: 'bg-emerald-500/15', glowHover: 'group-hover:bg-emerald-500/30', hoverBorder: 'hover:border-emerald-500/50', btnBg: 'bg-emerald-500/10', btnText: 'text-emerald-500', btnHoverBg: 'group-hover:bg-emerald-500', btnHoverText: 'group-hover:text-white' },
];

export const GamesHub = ({ setInventory }: GamesHubProps) => {
  const [selectedGame, setSelectedGame] = useState<GameId>('hub');
  const { t } = useTranslation();

  const renderGame = () => {
    switch (selectedGame) {
      case 'classic': return <ClassicGame setInventory={setInventory} />;
      case 'quiz': return <QuizGame setInventory={setInventory} />;
      case 'speedsort': return <SpeedSortGame setInventory={setInventory} />;
      case 'truefalse': return <TrueFalseGame setInventory={setInventory} />;
      case 'memory': return <MemoryMatchGame setInventory={setInventory} />;
      case 'catcher': return <WasteCatcherGame setInventory={setInventory} />;
      case 'scramble': return <WordScrambleGame setInventory={setInventory} />;
      case 'ecolab': return <EcoLabGame setInventory={setInventory} />;
      default: return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center overflow-hidden">
      <AnimatePresence mode="wait">
        {selectedGame === 'hub' ? (
          <motion.div
            key="hub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-6xl mx-auto flex flex-col items-center flex-1 py-2 h-full overflow-y-auto"
          >
            <div className="text-center mb-4 shrink-0">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1">{t('games.hubTitle')}</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{t('games.hubDesc')}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full px-2">
              {GAME_CARDS.map((game, i) => {
                const Icon = game.icon;
                return (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedGame(game.id)}
                    className={`glass rounded-2xl p-4 border border-slate-200 dark:border-white/10 ${game.hoverBorder} cursor-pointer transition-all group relative overflow-hidden flex flex-col`}
                  >
                    <div className={`absolute -right-8 -top-8 w-28 h-28 ${game.glow} rounded-full blur-[40px] ${game.glowHover} transition-colors duration-500`} />
                    <div className={`w-12 h-12 rounded-xl ${game.iconBg} flex items-center justify-center mb-3 border ${game.iconBorder} transition-colors shrink-0`}>
                      <Icon className={`w-6 h-6 ${game.iconColor}`} />
                    </div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 shrink-0">{t(game.titleKey)}</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-3 flex-1 text-xs line-clamp-2">{t(game.descKey)}</p>
                    <div className="mt-auto shrink-0">
                      <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full ${game.btnBg} ${game.btnText} font-bold text-xs uppercase tracking-wider ${game.btnHoverBg} ${game.btnHoverText} transition-colors`}>
                        {t(game.btnKey)} <span>→</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div key={selectedGame} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full h-full flex flex-col">
            <button onClick={() => setSelectedGame('hub')} className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 px-4 py-1.5 rounded-full w-fit shrink-0 text-sm font-medium border border-slate-200 dark:border-white/10">
              <ArrowLeft className="w-4 h-4" /> {t('games.back')}
            </button>
            <div className="flex-1 min-h-0">
              {renderGame()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
