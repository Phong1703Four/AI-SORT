import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Menu, X, BarChart2, Target, Gamepad2, Sun, Moon, Globe } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

export interface Inventory {
  organic: number;
  recycle: number;
  inorganic: number;
  hazardous: number;
}

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  inventory?: Inventory;
  theme?: string;
  toggleTheme?: () => void;
}

export const Navbar = ({ activeTab = 'dashboard', setActiveTab = () => {}, inventory = { organic: 0, recycle: 0, inorganic: 0, hazardous: 0 }, theme = 'dark', toggleTheme = () => {} }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'dashboard', name: t('nav.dashboard'), icon: BarChart2 },
    { id: 'games', name: t('nav.games'), icon: Gamepad2 },
    { id: 'shop', name: t('nav.shop'), icon: Target },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-white/10 py-3 shadow-lg' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center shadow-lg shadow-brand-green/20">
                <Leaf className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white hidden sm:block">
                AI Sort<span className="text-brand-green">.</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 bg-white/50 dark:bg-white/5 rounded-full px-2 py-1 border border-slate-200 dark:border-white/10 backdrop-blur-md">
              {navLinks.map((link) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
                    activeTab === link.id ? 'bg-brand-green text-white shadow-lg font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-brand-green dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 font-semibold dark:font-medium'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </motion.button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-white/10 transition-colors font-bold text-sm"
              >
                <Globe className="w-4 h-4" />
                {language.toUpperCase()}
              </button>
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-white/10 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-full font-bold shadow-sm">
                <span className="text-emerald-500" title="Rác Hữu Cơ">🌿 {inventory.organic}</span>
                <span className="text-blue-500" title="Rác Tái Chế">♻️ {inventory.recycle}</span>
                <span className="text-amber-500" title="Rác Vô Cơ">🗑️ {inventory.inorganic}</span>
                <span className="text-red-500" title="Rác Nguy Hại">⚠️ {inventory.hazardous}</span>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-brand-green hover:bg-emerald-400 text-white text-sm font-bold rounded-full transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                {t('nav.openApp')}
              </motion.button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-full bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-bold text-sm"
              >
                {language.toUpperCase()}
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-slate-300"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-2"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center">
                    <Leaf className="text-white w-6 h-6" />
                  </div>
                  <span className="font-bold text-xl tracking-tight text-white">AI Sort.</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.id}
                    onClick={() => {
                      setActiveTab(link.id);
                      setMobileMenuOpen(false);
                    }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl glass text-lg font-medium transition-colors w-full text-left ${
                      activeTab === link.id ? 'text-white bg-white/10 border-brand-green/50 border' : 'text-slate-200 hover:text-white hover:bg-white/5 border-transparent border'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${activeTab === link.id ? 'bg-brand-green text-white' : 'bg-brand-green/20 text-brand-green'}`}>
                      <link.icon className="w-6 h-6" />
                    </div>
                    {link.name}
                  </motion.button>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-white/10">
                <button className="w-full py-4 bg-brand-green text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  {t('nav.openApp')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
