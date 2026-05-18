import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Droplets, Leaf, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';
import type { Inventory } from '../../../App';

interface EcoChallengesProps {
  inventory: Inventory;
  setInventory: React.Dispatch<React.SetStateAction<Inventory>>;
}

export const EcoChallenges = ({ inventory, setInventory }: EcoChallengesProps) => {
  const { language } = useTranslation();
  const [claimed, setClaimed] = useState<number[]>([]);

  const totalCollected = inventory.organic + inventory.recycle + inventory.inorganic + inventory.hazardous;

  interface Challenge {
    id: number;
    title: string;
    description: string;
    progress: number;
    total: number;
    reward: {
      organic?: number;
      recycle?: number;
      inorganic?: number;
      hazardous?: number;
    };
    icon: any;
    color: string;
    text: string;
  }

  const challenges: Challenge[] = [
    {
      id: 1,
      title: language === 'en' ? 'Waste Collector' : 'Nhà Thu Thập Rác',
      description: language === 'en' ? 'Collect 20 waste items of any type.' : 'Thu thập tổng cộng 20 vật phẩm rác bất kỳ.',
      progress: Math.min(totalCollected, 20),
      total: 20,
      reward: { recycle: 5, organic: 5 },
      icon: Leaf,
      color: 'bg-brand-green',
      text: 'text-brand-green',
    },
    {
      id: 2,
      title: language === 'en' ? 'Recycle Hero' : 'Anh Hùng Tái Chế',
      description: language === 'en' ? 'Collect 10 recyclable items.' : 'Thu thập 10 rác tái chế.',
      progress: Math.min(inventory.recycle, 10),
      total: 10,
      reward: { recycle: 10 },
      icon: Target,
      color: 'bg-brand-blue',
      text: 'text-brand-blue',
    },
    {
      id: 3,
      title: language === 'en' ? 'Inorganic Cleaner' : 'Chuyên Gia Vô Cơ',
      description: language === 'en' ? 'Sort 10 inorganic items correctly.' : 'Phân loại đúng 10 rác vô cơ.',
      progress: Math.min(inventory.inorganic, 10),
      total: 10,
      reward: { inorganic: 10 },
      icon: Zap,
      color: 'bg-yellow-500',
      text: 'text-yellow-500',
    },
    {
      id: 4,
      title: language === 'en' ? 'Hazardous Handler' : 'Xử Lý Nguy Hại',
      description: language === 'en' ? 'Safely sort 5 hazardous items.' : 'Xử lý an toàn 5 rác nguy hại.',
      progress: Math.min(inventory.hazardous, 5),
      total: 5,
      reward: { hazardous: 5, recycle: 5 },
      icon: Droplets,
      color: 'bg-cyan-500',
      text: 'text-cyan-500',
    }
  ];

  const handleClaim = (challenge: Challenge) => {
    if (claimed.includes(challenge.id)) return;
    
    // Add reward to inventory
    setInventory(prev => ({
      organic: prev.organic + (challenge.reward.organic || 0),
      recycle: prev.recycle + (challenge.reward.recycle || 0),
      inorganic: prev.inorganic + (challenge.reward.inorganic || 0),
      hazardous: prev.hazardous + (challenge.reward.hazardous || 0),
    }));
    
    setClaimed(prev => [...prev, challenge.id]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto mb-24 relative z-20 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            {language === 'en' ? 'Eco Challenges' : 'Thử Thách Xanh'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {language === 'en' ? 'Complete challenges to earn extra resources.' : 'Hoàn thành thử thách để nhận thêm tài nguyên.'}
          </p>
        </div>
        <button className="hidden sm:block px-4 py-2 rounded-full border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
          {language === 'en' ? 'View All' : 'Xem Tất Cả'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {challenges.map((challenge, index) => {
          const percentage = Math.round((challenge.progress / challenge.total) * 100);
          const isComplete = challenge.progress >= challenge.total;
          const isClaimed = claimed.includes(challenge.id);
          
          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass rounded-3xl p-6 border border-slate-200 dark:border-white/10 hover:border-brand-green/30 hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex flex-col h-full group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 group-hover:scale-110 transition-transform`}>
                  <challenge.icon className={`w-5 h-5 ${challenge.text}`} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white tracking-tight">{challenge.title}</h3>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-1 leading-relaxed">
                {challenge.description}
              </p>

              <div className="mb-4">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-500 dark:text-slate-300">{language === 'en' ? 'Progress' : 'Tiến Độ'}</span>
                  <span className={challenge.text}>{challenge.progress} / {challenge.total}</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${challenge.color}`}
                  />
                </div>
              </div>

              {isClaimed ? (
                <button disabled className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold flex items-center justify-center gap-2 cursor-not-allowed text-sm">
                  <CheckCircle2 className="w-4 h-4" /> {language === 'en' ? 'Claimed' : 'Đã nhận thưởng'}
                </button>
              ) : isComplete ? (
                <button onClick={() => handleClaim(challenge)} className="w-full py-2.5 rounded-xl bg-brand-green hover:bg-emerald-400 text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-colors text-sm">
                  {language === 'en' ? 'Claim Reward' : 'Nhận Thưởng'}
                </button>
              ) : (
                <div className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-transparent text-slate-400 font-bold text-center text-sm cursor-not-allowed">
                  {language === 'en' ? 'In Progress' : 'Chưa Hoàn Thành'}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
