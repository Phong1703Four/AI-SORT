import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground } from './shared/animations/AuroraBackground';
import { Navbar } from './shared/ui/Navbar';
import { UploadCard } from './features/waste-scanner/components/UploadCard';
import { ChatUI } from './features/chat-ai/components/ChatUI';
import { DashboardStats } from './features/dashboard/components/DashboardStats';
import { EcoChallenges } from './features/dashboard/components/EcoChallenges';

import { GamesHub } from './features/games/components/GamesHub';
import { EcoShop } from './features/shop/components/EcoShop';
import { useTranslation } from './context/LanguageContext';

export interface Inventory {
  organic: number;
  recycle: number;
  inorganic: number;
  hazardous: number;
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState<Inventory>({ organic: 0, recycle: 0, inorganic: 0, hazardous: 0 });
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const { t } = useTranslation();

  return (
    <AuroraBackground theme={theme}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} inventory={inventory} theme={theme} toggleTheme={toggleTheme} />

      <main className="flex-1 flex flex-col items-center justify-center p-4 pt-32 pb-20 z-10 w-full max-w-7xl mx-auto min-h-[calc(100vh-100px)]">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <div className="text-center w-full">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm font-medium text-brand-green border border-brand-green/20"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
                  </span>
                  {t('dashboard.aiRunning')}
                </motion.div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 text-slate-900 dark:text-white leading-tight drop-shadow-sm dark:drop-shadow-none">
                  {t('dashboard.title')} <br className="hidden md:block" />
                  <span className="bg-gradient-to-r from-brand-green to-emerald-400 bg-clip-text text-transparent">
                    {t('dashboard.titleHighlight')}
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium dark:font-normal">
                  {t('dashboard.subtitle')}
                </p>
                
                <UploadCard setInventory={setInventory} />
              </div>
              <DashboardStats />
              <EcoChallenges inventory={inventory} setInventory={setInventory} />
            </motion.div>
          )}

          {activeTab === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full flex-1 flex flex-col"
            >
              <GamesHub setInventory={setInventory} />
            </motion.div>
          )}

          {activeTab === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <EcoShop inventory={inventory} setInventory={setInventory} />
            </motion.div>
          )}

          {activeTab === 'edu' && (
            <motion.div
              key="edu"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="w-full flex-1 flex flex-col items-center justify-center text-slate-400 text-center"
            >
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('dashboard.library')}</h2>
              <p className="text-slate-600 dark:text-slate-400">{t('dashboard.libraryDesc')}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ChatUI />
    </AuroraBackground>
  );
}

export default App;
