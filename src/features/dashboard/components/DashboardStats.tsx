import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { TrendingUp, Users, Trash2, TreePine } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';

const AnimatedCounter = ({ from, to, duration = 2 }: { from: number, to: number, duration?: number }) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    const controls = animate(count, to, { duration, ease: "easeOut" });
    return controls.stop;
  }, [count, to, duration]);

  return <motion.span>{rounded}</motion.span>;
};

export const DashboardStats = () => {
  const { language } = useTranslation();

  const stats = [
    {
      id: 1,
      name: language === 'en' ? 'Waste Sorted' : 'Rác Đã Phân Loại',
      value: 124592,
      unit: 'kg',
      icon: Trash2,
      color: 'text-brand-blue',
      bgColor: 'bg-brand-blue/10',
      trend: '+12.5%',
    },
    {
      id: 2,
      name: language === 'en' ? 'Active Users' : 'Người Dùng Tích Cực',
      value: 4521,
      unit: '',
      icon: Users,
      color: 'text-brand-green',
      bgColor: 'bg-brand-green/10',
      trend: '+5.2%',
    },
    {
      id: 3,
      name: language === 'en' ? 'CO2 Reduced' : 'Lượng CO2 Giảm',
      value: 89400,
      unit: 'kg',
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      trend: '+18.1%',
    },
    {
      id: 4,
      name: language === 'en' ? 'Equivalent Trees' : 'Số Cây Tương Đương',
      value: 3450,
      unit: '',
      icon: TreePine,
      color: 'text-teal-400',
      bgColor: 'bg-teal-400/10',
      trend: '+2.4%',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto mt-24 mb-12 relative z-20 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {language === 'en' ? 'Global Impact' : 'Tác Động Toàn Cầu'}
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {language === 'en' 
            ? 'Every item you sort contributes to a larger goal. Here is our collective environmental impact so far.'
            : 'Mỗi vật phẩm bạn phân loại đều đóng góp vào một mục tiêu lớn hơn. Đây là tác động môi trường chung của chúng ta cho đến nay.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-colors group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity ${stat.bgColor.split('/')[0]}`} />
            
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="px-2.5 py-1 rounded-full bg-white/5 text-xs font-semibold text-slate-300 flex items-center gap-1 border border-white/5">
                <TrendingUp className="w-3 h-3 text-brand-green" /> {stat.trend}
              </div>
            </div>

            <div>
              <div className="text-4xl font-black text-white tracking-tight mb-1 flex items-baseline gap-1">
                <AnimatedCounter from={0} to={stat.value} duration={2.5} />
                {stat.unit && <span className="text-lg font-medium text-slate-400">{stat.unit}</span>}
              </div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">{stat.name}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
