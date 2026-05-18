import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Recycle, AlertTriangle, 
  Info, Calendar, BookOpen, 
  CheckCircle2, Leaf, X, Clock, Compass, 
  ChevronRight, Sparkles, AlertCircle
} from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';
import { WASTE_ITEMS } from '../../../data/wasteData';
import type { WasteItem } from '../../../data/wasteData';

// Custom interface for detail lookup
interface EcoDetails {
  decompTime: string;
  disposalGuide: string;
  ecoFact: string;
  severity: 'success' | 'info' | 'warning' | 'danger';
}

export const EcoLibrary = () => {
  const { t, language } = useTranslation();
  const [activeSubTab, setActiveSubTab] = useState<'dictionary' | 'decomposition' | 'guides'>('dictionary');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedItem, setSelectedItem] = useState<WasteItem | null>(null);

  // Helper: Categorize item types and return detailed custom information for displays
  const getItemDetails = (item: WasteItem): EcoDetails => {
    const nameVi = item.name.vi.toLowerCase();
    const nameEn = item.name.en.toLowerCase();
    const isVi = language === 'vi';

    // 1. Organic items details
    if (item.type === 'organic') {
      let decomp = isVi ? '2 - 5 tuần' : '2 - 5 weeks';
      let fact = isVi 
        ? 'Rác hữu cơ chiếm hơn 50% lượng rác thải sinh hoạt tại Việt Nam, phần lớn bị đem chôn lấp vô cùng lãng phí thay vì tái chế làm phân bón.'
        : 'Organic waste makes up over 50% of municipal household trash, but most is landfilled instead of being recycled into compost.';
      
      if (nameVi.includes('dừa') || nameEn.includes('coconut')) {
        decomp = isVi ? '6 - 12 tháng' : '6 - 12 months';
        fact = isVi 
          ? 'Xơ dừa và gáo dừa có cấu trúc xenluloza cực bền, mất nhiều thời gian phân hủy hơn các loại rau củ mềm nhưng ủ phân bón rất tốt.'
          : 'Coconut husks and shells have extremely tough cellulose structures, taking longer to biodegrade but making excellent soil conditioners.';
      } else if (nameVi.includes('gỗ') || nameEn.includes('wood') || nameVi.includes('cành') || nameEn.includes('branch')) {
        decomp = isVi ? '1 - 3 năm' : '1 - 3 years';
      }

      return {
        decompTime: decomp,
        disposalGuide: isVi 
          ? 'Loại bỏ túi nilon bọc ngoài, gom thức ăn thừa và vỏ rau củ vào thùng rác Hữu Cơ. Tuyệt đối không để lẫn lộn chất tẩy rửa hay rác vô cơ.'
          : 'Remove any wrapping plastic bags, throw organic leftovers in the Organic bin. Never mix with chemicals or inorganic materials.',
        ecoFact: fact,
        severity: 'success'
      };
    }

    // 2. Recycle items details
    if (item.type === 'recycle') {
      if (nameVi.includes('chai nhựa') || nameEn.includes('plastic bottle') || nameVi.includes('pet')) {
        return {
          decompTime: isVi ? '450 năm' : '450 years',
          disposalGuide: isVi 
            ? 'Trút hết nước thừa bên trong, súc rửa sạch, mở nắp và vòng đệm nhựa nếu có thể, ép bẹp chai để tiết kiệm diện tích và vứt vào thùng Tái Chế.'
            : 'Empty all liquid inside, rinse clean, remove the cap and ring if possible, crush to save space, and place in the Recycle bin.',
          ecoFact: isVi 
            ? 'Chỉ 9% rác thải nhựa toàn cầu thực sự được tái chế. Chai nhựa PET tái chế có thể dệt thành quần áo sợi poly, thảm hoặc làm chai mới.'
            : 'Only 9% of plastic waste globally is recycled. Recycled PET bottles can be woven into polyester clothing, carpets, or new bottles.',
          severity: 'info'
        };
      }
      if (nameVi.includes('thủy tinh') || nameEn.includes('glass')) {
        return {
          decompTime: isVi ? '1 triệu năm (Hoặc vô hạn)' : '1 million years (Or indefinite)',
          disposalGuide: isVi 
            ? 'Rửa sạch bụi bẩn và nhãn giấy thừa, phơi khô. Xếp cẩn thận vào thùng rác Tái Chế, tránh quăng quật mạnh làm nứt vỡ gây nguy hiểm.'
            : 'Rinse out dirt and dry. Place carefully in the Recycle bin, avoiding rough handling that breaks the glass and endangers handlers.',
          ecoFact: isVi 
            ? 'Thủy tinh có khả năng tái chế vô hạn 100% mà không bị suy giảm chất lượng hay độ tinh khiết. Tiết kiệm 30% năng lượng so với sản xuất mới.'
            : 'Glass is 100% endlessly recyclable without loss in quality or purity. Recycling glass saves 30% energy compared to making new glass.',
          severity: 'info'
        };
      }
      if (nameVi.includes('nhôm') || nameEn.includes('aluminum') || nameVi.includes('lon') || nameEn.includes('can')) {
        return {
          decompTime: isVi ? '80 - 100 năm' : '80 - 100 years',
          disposalGuide: isVi 
            ? 'Làm sạch chất lỏng bên trong, ép xẹp vỏ lon để tối ưu không gian vận chuyển thu gom, sau đó cho vào ngăn rác Tái Chế.'
            : 'Clean out residues, crush the can to optimize collection and transportation space, then put in the Recycle bin.',
          ecoFact: isVi 
            ? 'Tái chế nhôm giúp tiết kiệm đến 95% năng lượng cần thiết để khai thác quặng nhôm bauxite thô nguyên chất từ lòng đất.'
            : 'Recycling aluminum saves up to 95% of the energy needed to mine and refine raw bauxite ore into new metal.',
          severity: 'info'
        };
      }
      if (nameVi.includes('giấy') || nameEn.includes('paper') || nameVi.includes('báo') || nameEn.includes('newspaper') || nameVi.includes('carton')) {
        return {
          decompTime: isVi ? '2 - 6 tuần' : '2 - 6 weeks',
          disposalGuide: isVi 
            ? 'Giữ cho giấy luôn khô ráo, xếp gọn gàng, tháo các băng keo nhựa dính trên hộp carton rồi cho vào túi đựng rác Tái Chế.'
            : 'Keep papers completely dry, fold neatly, remove plastic adhesive tape from cartons, and place in the Recycle bin.',
          ecoFact: isVi 
            ? 'Tái chế 1 tấn giấy giúp cứu sống được 17 cây gỗ trưởng thành, tiết kiệm 30.000 lít nước sạch và hạn chế khí thải nhà kính đáng kể.'
            : 'Recycling 1 ton of paper saves 17 mature trees, 30,000 liters of fresh water, and significantly reduces greenhouse gas emissions.',
          severity: 'info'
        };
      }
      // General Recycle
      return {
        decompTime: isVi ? '50 - 100 năm' : '50 - 100 years',
        disposalGuide: isVi 
          ? 'Lau khô sạch dầu mỡ bám bẩn (nếu bẩn nhiều hãy phân vào rác vô cơ), phân loại chung vào thùng rác Tái Chế.'
          : 'Wipe dry and clean of grease (if heavily contaminated, treat as inorganic), and sort into the Recycle bin.',
        ecoFact: isVi 
          ? 'Việc phân loại riêng rác tái chế sạch tại nguồn giúp nâng cao tỷ lệ tái chế thành công từ dưới 15% lên đến hơn 85%.'
          : 'Sorting clean recyclables at the source boosts successful recycling rates from under 15% to over 85%.',
        severity: 'info'
      };
    }

    // 3. Inorganic items details
    if (item.type === 'inorganic') {
      if (nameVi.includes('xốp') || nameEn.includes('styrofoam') || nameVi.includes('foam')) {
        return {
          decompTime: isVi ? 'Vô hạn (Không bao giờ phân hủy)' : 'Indefinite (Never biodegrades)',
          disposalGuide: isVi 
            ? 'Hạn chế sử dụng tối đa. Rác vô cơ không thể tái chế, hãy bỏ gọn vào thùng rác Vô Cơ để thu gom đem đi chôn lấp hoặc thiêu đốt.'
            : 'Minimize usage. Styrofoam is non-recyclable; pack it neatly in the Inorganic bin for landfilling or incineration.',
          ecoFact: isVi 
            ? 'Hộp xốp polystyrene dưới tác động thời tiết chỉ vỡ vụn ra thành các hạt xốp li ti trôi nổi, hấp thụ độc tố và tàn phá động vật hoang dã.'
            : 'Polystyrene styrofoam under weathering only fragments into micro-beads, absorbing toxins and devastating wildlife.',
          severity: 'warning'
        };
      }
      if (nameVi.includes('nilon') || nameEn.includes('nylon') || nameVi.includes('túi') || nameEn.includes('bag')) {
        return {
          decompTime: isVi ? '10 - 20 năm' : '10 - 20 years',
          disposalGuide: isVi 
            ? 'Cố gắng tái sử dụng nhiều lần để đựng đồ hoặc làm túi rác. Khi vứt bỏ, xếp dẹt lại cho gọn và bỏ vào thùng rác Vô Cơ.'
            : 'Try to reuse multiple times for storage or bin lining. For final disposal, pack flat and place in the Inorganic bin.',
          ecoFact: isVi 
            ? 'Túi nilon mỏng trôi nổi ngoài tự nhiên là nguyên nhân gây nghẹt đường thở, tử vong cho hàng triệu cá thể rùa biển và chim hải âu.'
            : 'Thin plastic bags drifting in nature are causes of suffocation and death for millions of sea turtles and albatrosses.',
          severity: 'warning'
        };
      }
      return {
        decompTime: isVi ? '50 - 200 năm' : '50 - 200 years',
        disposalGuide: isVi 
          ? 'Thu gom gọn gàng, ép chặt thể tích tối đa để tránh cồng kềnh, vứt bỏ vào thùng rác Vô Cơ để xử lý tập trung.'
          : 'Collect neatly, compress to reduce bulkiness, and dispose of in the Inorganic waste bin for centralized treatment.',
        ecoFact: isVi 
          ? 'Rác vô cơ không phân hủy sẽ tồn tại dưới lòng đất hàng trăm năm hoặc sinh ra khí độc dioxin nếu bị đốt cháy ở nhiệt độ thấp không chuẩn.'
          : 'Non-biodegradable inorganic waste stays underground for centuries, or generates toxic dioxins if incinerated at low temperatures.',
        severity: 'warning'
      };
    }

    // 4. Hazardous items details
    if (item.type === 'hazardous') {
      if (nameVi.includes('pin') || nameEn.includes('battery') || nameVi.includes('aa') || nameVi.includes('lithium')) {
        return {
          decompTime: isVi ? '100 - 200 năm (kèm ô nhiễm kim loại nặng)' : '100 - 200 years (with toxic metal leakage)',
          disposalGuide: isVi 
            ? '⚠️ TUYỆT ĐỐI không vứt chung rác sinh hoạt thông thường, không đốt. Gom pin cũ vào lọ thủy tinh khô, mang đến điểm thu hồi pin chuyên dụng.'
            : '⚠️ NEVER throw into general domestic trash or incinerate. Store in a dry glass jar, and bring to specialized battery recycling points.',
          ecoFact: isVi 
            ? 'Một viên pin nhỏ bị vứt bừa bãi rò rỉ hóa chất độc hại (Cadmium, Chì, Thủy ngân) làm ô nhiễm 500 lít nước hoặc 1m³ đất trong suốt 50 năm.'
            : 'A single discarded battery leaking toxic chemicals (Cadmium, Lead, Mercury) contaminates 500 liters of water or 1m³ of soil for 50 years.',
          severity: 'danger'
        };
      }
      if (nameVi.includes('bóng đèn') || nameEn.includes('bulb') || nameVi.includes('huỳnh quang') || nameEn.includes('fluorescent')) {
        return {
          decompTime: isVi ? 'Không phân hủy (Lớp bột hóa chất cực độc)' : 'Non-biodegradable (Highly toxic phosphor coating)',
          disposalGuide: isVi 
            ? '⚠️ Tránh làm vỡ bóng đèn vì giải phóng hơi thủy ngân gây hại đường hô hấp. Bọc bóng đèn cẩn thận bằng giấy báo cũ và đưa tới điểm thu gom chất thải nguy hại.'
            : '⚠️ Avoid breaking bulbs as they release gaseous mercury harmful to inhalation. Wrap carefully in newspaper and take to hazardous waste collection centers.',
          ecoFact: isVi 
            ? 'Bóng đèn huỳnh quang chứa hơi thủy ngân siêu mịn. Một hàm lượng cực nhỏ thủy ngân đi vào nguồn nước có thể tàn phá hệ thần kinh của các loài thủy sinh.'
            : 'Fluorescent tubes contain fine mercury vapor. Even an extremely tiny amount entering water can destroy the nervous system of aquatic life.',
          severity: 'danger'
        };
      }
      // General Hazardous
      return {
        decompTime: isVi ? 'Hàng trăm năm (Độc hại cao)' : 'Hundreds of years (High toxicity)',
        disposalGuide: isVi 
          ? '⚠️ Giữ nguyên nhãn chai hóa chất/thuốc hết hạn. Để riêng trong hộp kín an toàn, xa tầm tay trẻ em và đưa tới điểm thu gom rác nguy hại của địa phương.'
          : '⚠️ Keep original labels on chemical or expired medicine bottles. Store in a sealed container, out of reach of children, and hand over to hazardous waste collection.',
        ecoFact: isVi 
          ? 'Các chất hóa học độc hại thấm xuống mạch nước ngầm là nguyên nhân hàng đầu gây nên các ngôi làng ung thư và dị tật bẩm sinh.'
          : 'Toxic chemical substances seeping into groundwater aquifers are leading causes of cancer clusters and congenital defects.',
        severity: 'danger'
      };
    }

    // Fallback default details
    return {
      decompTime: isVi ? 'Không xác định' : 'Unknown',
      disposalGuide: isVi ? 'Phân loại cẩn thận vào thùng rác chuyên biệt.' : 'Sort carefully into dedicated waste containers.',
      ecoFact: isVi ? 'Phân loại rác hôm nay vì tương lai xanh ngày mai.' : 'Sort waste today for a greener future tomorrow.',
      severity: 'info'
    };
  };

  // Filter 600 items based on search query and category tab
  const filteredItems = useMemo(() => {
    return WASTE_ITEMS.filter(item => {
      const nameVi = item.name.vi.toLowerCase();
      const nameEn = item.name.en.toLowerCase();
      const query = searchQuery.toLowerCase();

      // Search match
      const matchesSearch = nameVi.includes(query) || nameEn.includes(query);

      // Category filter match
      const matchesCategory = categoryFilter === 'all' || item.type === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  // Handle category tab change - reset pagination visible items count
  const handleCategoryChange = (cat: string) => {
    setCategoryFilter(cat);
    setVisibleCount(12);
  };

  // Handle search text change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(12);
  };

  // Load more items
  const handleShowMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  // Decomposition guide comparative items
  const decompositionItems = [
    { name: { vi: 'Vỏ Trái Cây / Rau Củ', en: 'Fruit & Veg Leftovers' }, time: { vi: '2 - 5 tuần', en: '2 - 5 weeks' }, emoji: '🍌', color: 'bg-emerald-500', pct: 2, desc: { vi: 'Phân hủy sinh học nhanh chóng, bổ dưỡng cho đất.', en: 'Biodegrades very quickly, highly nourishing for soil.' } },
    { name: { vi: 'Túi Giấy Carton Sạch', en: 'Clean Cardboard Box' }, time: { vi: '1 - 2 tháng', en: '1 - 2 months' }, emoji: '📦', color: 'bg-teal-500', pct: 6, desc: { vi: 'Dễ dàng phân hủy hoặc tái chế lại thành giấy mới.', en: 'Easily decomposes or recyclable into new papers.' } },
    { name: { vi: 'Tất Len Sợi Tự Nhiên', en: 'Natural Wool Sock' }, time: { vi: '1 - 5 năm', en: '1 - 5 years' }, emoji: '🧦', color: 'bg-sky-500', pct: 15, desc: { vi: 'Sợi len tự nhiên cần thời gian mục nát trung bình.', en: 'Natural wool fibers take moderate time to rot away.' } },
    { name: { vi: 'Đầu Lọc Thuốc Lá', en: 'Cigarette Filter' }, time: { vi: '10 - 12 năm', en: '10 - 12 years' }, emoji: '🚬', color: 'bg-orange-400', pct: 30, desc: { vi: 'Đầy chất hóa học độc hại đầu độc sinh vật đất.', en: 'Saturated with toxic chemical additives polluting soil.' } },
    { name: { vi: 'Túi Nilon / Bao Bì Nhựa', en: 'Plastic Nylon Bag' }, time: { vi: '10 - 20 năm', en: '10 - 20 years' }, emoji: '🛍️', color: 'bg-amber-500', pct: 50, desc: { vi: 'Rã thành các hạt vi nhựa tồn tại lâu dài tàn hại mạch nước.', en: 'Fragments into persistent microplastics polluting waters.' } },
    { name: { vi: 'Lon Nhôm Nước Ngọt', en: 'Aluminum Soda Can' }, time: { vi: '80 - 100 năm', en: '80 - 100 years' }, emoji: '🥫', color: 'bg-yellow-500', pct: 75, desc: { vi: 'Kim loại oxy hóa cực chậm trong môi trường tự nhiên.', en: 'Metal oxidizes extremely slowly in natural conditions.' } },
    { name: { vi: 'Chai Nhựa PET Đồ Uống', en: 'PET Plastic Bottle' }, time: { vi: '450 năm', en: '450 years' }, emoji: '🫙', color: 'bg-red-500', pct: 90, desc: { vi: 'Tồn tại gần 5 thế kỷ tàn sát đa dạng sinh học.', en: 'Persists for nearly 5 centuries destroying biodiversity.' } },
    { name: { vi: 'Hộp Xốp Đựng Thức Ăn', en: 'Styrofoam Meal Container' }, time: { vi: 'Vô hạn (Không phân hủy)', en: 'Indefinite (Never)' }, emoji: '🥪', color: 'bg-rose-600', pct: 100, desc: { vi: 'Vĩnh viễn không phân hủy sinh học, tàn phá sinh thái.', en: 'Permanently resists biodegradation, ruins ecology.' } }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 relative z-20">
      {/* Header Banner Section */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-brand-green mb-6 text-sm font-semibold uppercase tracking-wider"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          {t('library.title')}
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          {t('library.title')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
          {t('library.subtitle')}
        </p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex justify-center mb-10">
        <div className="flex bg-slate-200/60 dark:bg-white/5 rounded-2xl p-1.5 border border-slate-300 dark:border-white/10 backdrop-blur-md shadow-inner">
          <button
            onClick={() => setActiveSubTab('dictionary')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
              activeSubTab === 'dictionary'
                ? 'bg-brand-green text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {t('library.tabDictionary')}
          </button>
          <button
            onClick={() => setActiveSubTab('decomposition')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
              activeSubTab === 'decomposition'
                ? 'bg-brand-green text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            {t('library.tabDecomposition')}
          </button>
          <button
            onClick={() => setActiveSubTab('guides')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
              activeSubTab === 'guides'
                ? 'bg-brand-green text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            {t('library.tabGuides')}
          </button>
        </div>
      </div>

      {/* SUB TAB CONTENT */}
      <AnimatePresence mode="wait">
        {/* Tab 1: Waste Dictionary */}
        {activeSubTab === 'dictionary' && (
          <motion.div
            key="dictionary-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* Search and Filters Area */}
            <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-white/10 mb-8 flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/2 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search input bar */}
                <div className="relative w-full flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder={t('library.searchPlaceholder')}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all shadow-sm"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => { setSearchQuery(''); setVisibleCount(12); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Match counter */}
                <div className="px-4 py-2 bg-slate-200/50 dark:bg-white/5 rounded-xl border border-slate-300 dark:border-white/10 text-sm text-slate-600 dark:text-slate-400 font-bold shrink-0">
                  {filteredItems.length} {language === 'vi' ? 'vật phẩm tìm thấy' : 'items found'}
                </div>
              </div>

              {/* Category selector tabs */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-white/5">
                {[
                  { id: 'all', label: t('library.filterAll'), color: 'border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5' },
                  { id: 'organic', label: t('library.filterOrganic'), color: 'border-emerald-500/30 text-brand-green bg-emerald-500/5 hover:bg-emerald-500/10' },
                  { id: 'recycle', label: t('library.filterRecycle'), color: 'border-blue-500/30 text-brand-blue bg-blue-500/5 hover:bg-blue-500/10' },
                  { id: 'inorganic', label: t('library.filterInorganic'), color: 'border-amber-500/30 text-amber-500 bg-amber-500/5 hover:bg-amber-500/10' },
                  { id: 'hazardous', label: t('library.filterHazardous'), color: 'border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10' }
                ].map((tab) => {
                  const isActive = categoryFilter === tab.id;
                  let activeClass = isActive 
                    ? tab.id === 'all' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-md'
                      : tab.id === 'organic' ? 'bg-emerald-500 text-white border-transparent shadow-lg shadow-emerald-500/20'
                      : tab.id === 'recycle' ? 'bg-blue-500 text-white border-transparent shadow-lg shadow-blue-500/20'
                      : tab.id === 'inorganic' ? 'bg-amber-500 text-white border-transparent shadow-lg shadow-amber-500/20'
                      : 'bg-red-500 text-white border-transparent shadow-lg shadow-red-500/20'
                    : tab.color;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleCategoryChange(tab.id)}
                      className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeClass}`}
                    >
                      {tab.id === 'organic' && '🌿'}
                      {tab.id === 'recycle' && '♻️'}
                      {tab.id === 'inorganic' && '🗑️'}
                      {tab.id === 'hazardous' && '⚠️'}
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Waste Items Grid */}
            {filteredItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredItems.slice(0, visibleCount).map((item, index) => {
                    const typeColor = item.type === 'organic' ? 'border-emerald-500/20 hover:border-emerald-500/40 text-brand-green group-hover:bg-emerald-500/5'
                      : item.type === 'recycle' ? 'border-blue-500/20 hover:border-blue-500/40 text-brand-blue group-hover:bg-blue-500/5'
                      : item.type === 'inorganic' ? 'border-amber-500/20 hover:border-amber-500/40 text-amber-500 group-hover:bg-amber-500/5'
                      : 'border-red-500/20 hover:border-red-500/40 text-red-500 group-hover:bg-red-500/5';
                    
                    const badgeText = item.type === 'organic' ? t('games.organic')
                      : item.type === 'recycle' ? t('games.recycle')
                      : item.type === 'inorganic' ? t('games.inorganic')
                      : t('games.hazardous');

                    const badgeColor = item.type === 'organic' ? 'bg-emerald-500/10 text-brand-green'
                      : item.type === 'recycle' ? 'bg-blue-500/10 text-brand-blue'
                      : item.type === 'inorganic' ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-red-500/10 text-red-500';

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: (index % 12) * 0.03 }}
                        onClick={() => setSelectedItem(item)}
                        className={`glass rounded-3xl p-5 border cursor-pointer hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between h-[180px] relative overflow-hidden ${typeColor}`}
                      >
                        {/* Hover glow background decoration */}
                        <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-[30px] opacity-0 group-hover:opacity-10 transition-opacity bg-current pointer-events-none" />

                        <div className="flex justify-between items-start gap-4 mb-2">
                          <div className="text-3xl p-3 bg-white/40 dark:bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm border border-slate-200/50 dark:border-white/5">
                            {item.icon}
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${badgeColor}`}>
                            {badgeText}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-black text-slate-800 dark:text-white text-base tracking-tight line-clamp-1 group-hover:text-brand-green transition-colors mb-0.5">
                            {language === 'vi' ? item.name.vi : item.name.en}
                          </h3>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-1">
                            {language === 'vi' ? item.name.en : item.name.vi}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Show More Button */}
                {visibleCount < filteredItems.length && (
                  <div className="flex justify-center mt-12 mb-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShowMore}
                      className="px-8 py-4 bg-brand-green hover:bg-emerald-400 text-white font-bold rounded-2xl shadow-lg shadow-brand-green/20 hover:shadow-xl transition-all flex items-center gap-2"
                    >
                      {t('library.showMore')}
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 glass rounded-3xl border border-slate-200 dark:border-white/10">
                <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                  {t('library.noResults')}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {language === 'vi' 
                    ? 'Hãy thử tìm kiếm với các từ khóa ngắn gọn hoặc thay đổi bộ lọc phân loại rác ở trên nhé!'
                    : 'Try searching with shorter keywords or modify the waste category filters above!'}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 2: Decomposition Map */}
        {activeSubTab === 'decomposition' && (
          <motion.div
            key="decomposition-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl mx-auto"
          >
            {/* Intro text */}
            <div className="glass rounded-3xl p-8 border border-slate-200 dark:border-white/10 mb-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-2">
                <Clock className="w-6 h-6 text-amber-500" />
                {t('library.decompTitle')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base">
                {t('library.decompDesc')}
              </p>
            </div>

            {/* Interactive Timeline List */}
            <div className="flex flex-col gap-5 mb-8">
              {decompositionItems.map((item, idx) => {
                const label = language === 'vi' ? item.name.vi : item.name.en;
                const timeLabel = language === 'vi' ? item.time.vi : item.time.en;
                const note = language === 'vi' ? item.desc.vi : item.desc.en;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="glass rounded-2xl p-5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group relative overflow-hidden"
                  >
                    <div className="flex items-center gap-4 min-w-[280px]">
                      <div className="text-3xl p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                        {item.emoji}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 dark:text-white text-base tracking-tight">
                          {label}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {note}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar comparison */}
                    <div className="flex-1 flex flex-col gap-1.5 md:px-4">
                      <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                        <span>{language === 'vi' ? 'Sinh thái' : 'Impact'}</span>
                        <span className="font-black text-slate-700 dark:text-slate-300">{timeLabel}</span>
                      </div>
                      
                      <div className="w-full bg-slate-200 dark:bg-white/5 rounded-full h-3 overflow-hidden border border-slate-300/30 dark:border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: idx * 0.1, ease: 'easeOut' }}
                          className={`h-full rounded-full ${item.color} shadow-sm`}
                        />
                      </div>
                    </div>

                    {/* Tag label right */}
                    <div className="flex items-center shrink-0">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
                        item.pct < 10 ? 'bg-emerald-500/10 text-brand-green'
                          : item.pct < 35 ? 'bg-blue-500/10 text-brand-blue'
                          : item.pct < 76 ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {item.pct < 10 ? t('library.filterOrganic') 
                          : item.pct < 35 ? t('library.filterRecycle')
                          : item.pct < 76 ? t('library.filterInorganic') 
                          : t('library.filterHazardous')}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Ecology Warning Alert */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-4 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
              <div className="text-sm font-semibold leading-relaxed">
                {t('library.decompNote')}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Green Guides */}
        {activeSubTab === 'guides' && (
          <motion.div
            key="guides-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl mx-auto"
          >
            {/* Guide intro */}
            <div className="glass rounded-3xl p-8 border border-slate-200 dark:border-white/10 mb-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-2">
                <Compass className="w-6 h-6 text-brand-green" />
                {t('library.guideTitle')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base">
                {t('library.guideDesc')}
              </p>
            </div>

            {/* Guides Detailed Cards */}
            <div className="flex flex-col gap-8">
              {/* Card 1: 3R Principles */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-white/10 relative overflow-hidden group hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-md"
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] opacity-10 bg-brand-blue group-hover:opacity-20 transition-opacity" />
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                    <Recycle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-brand-blue transition-colors">
                      {t('library.guide3RTitle')}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                      {t('library.guide3RDesc')}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { title: language === 'vi' ? 'Reduce (Tiết giảm)' : 'Reduce', desc: language === 'vi' ? 'Hạn chế mua sắm không cần thiết, chọn sản phẩm ít bao bì nilon, thay thế cốc nhựa dùng 1 lần bằng bình cá nhân.' : 'Avoid buying unnecessary products, minimize plastic packaging, replace single-use plastic cups with reusable tumblers.', emoji: '📉' },
                        { title: language === 'vi' ? 'Reuse (Tái sử dụng)' : 'Reuse', desc: language === 'vi' ? 'Tận dụng hộp giấy làm hộp đựng đồ, chai thủy tinh làm lọ cắm hoa, quần áo cũ làm khăn lau bếp thay vì vứt bỏ.' : 'Turn boxes into organizers, bottles into flower vases, old clothes into rags instead of throwing them away instantly.', emoji: '🔄' },
                        { title: language === 'vi' ? 'Recycle (Tái chế)' : 'Recycle', desc: language === 'vi' ? 'Thu gom tách riêng giấy vụn, kim loại, chai nhựa sạch để bán phế liệu hoặc đưa vào nhà máy xử lý tái chế công nghiệp.' : 'Collect clean papers, metals, plastics separately, and send them to recycling plants or scrap processing points.', emoji: '♻️' }
                      ].map((sub, i) => (
                        <div key={i} className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5 flex flex-col justify-between">
                          <span className="text-2xl mb-2">{sub.emoji}</span>
                          <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{sub.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold dark:font-normal">{sub.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Organic Compost */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-white/10 relative overflow-hidden group hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-md"
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] opacity-10 bg-brand-green group-hover:opacity-20 transition-opacity" />
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
                    <Leaf className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-brand-green transition-colors">
                      {t('library.guideCompostTitle')}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                      {t('library.guideCompostDesc')}
                    </p>

                    <div className="p-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 mb-4">
                      <h4 className="font-bold text-brand-green text-sm mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        {language === 'vi' ? 'Quy trình 6 bước ủ compost thành công tại nhà:' : '6 Steps for successful home composting:'}
                      </h4>
                      <ul className="flex flex-col gap-2.5 text-xs text-slate-600 dark:text-slate-400 font-semibold dark:font-normal">
                        {(language === 'vi' 
                          ? [
                            '1. Chuẩn bị thùng chứa có nắp kín đậy (có đục một số lỗ thông khí nhỏ quanh thùng).',
                            '2. Rải một lớp rác nâu dày khoảng 10cm dưới đáy (gồm lá cây khô, xơ dừa, bìa giấy vụn cắt nhỏ).',
                            '3. Thêm một lớp rác xanh (rau củ bỏ thừa, vỏ trái cây, bã trà, cà phê). Tránh thịt cá, mỡ thực phẩm.',
                            '4. Phủ một lớp đất mỏng lên bề mặt lớp rác xanh để khử mùi hôi và đẩy nhanh quá trình vi sinh lên men.',
                            '5. Duy trì độ ẩm ẩm ướt nhẹ (như vắt miếng bọt biển) và đảo trộn đống ủ khoảng 1 lần mỗi tuần để cấp oxy.',
                            '6. Sau khoảng 8 - 12 tuần, phân hữu cơ chuyển hẳn sang màu mùn nâu đen tơi xốp, có mùi đất thơm nhẹ là sẵn sàng sử dụng.'
                          ] : [
                            '1. Prepare a container with a tight lid (drill small ventilation holes around the container).',
                            '2. Put a 10cm brown layer at the bottom (dry leaves, twigs, shredded plain cardboard/paper).',
                            '3. Add a green layer (kitchen veggie scraps, fruit peels, coffee grounds). Avoid meat, bones, grease.',
                            '4. Cover with a thin soil layer to neutralize odors and introduce active microbes.',
                            '5. Maintain damp moisture level (like a wrung-out sponge) and turn/aerate the compost once a week.',
                            '6. After 8-12 weeks, the mixture turns into rich, crumbly black-brown compost with an earthy aroma.'
                          ]
                        ).map((step, sIdx) => (
                          <li key={sIdx} className="flex gap-2 items-start">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0 mt-1.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Hazardous & E-Waste Rules */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-white/10 relative overflow-hidden group hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-md"
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] opacity-10 bg-red-500 group-hover:opacity-20 transition-opacity" />
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-red-500 transition-colors">
                      {t('library.guideHazardousTitle')}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                      {t('library.guideHazardousDesc')}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { 
                          title: language === 'vi' ? 'Nhận biết rác nguy hại' : 'Identifying Hazardous waste', 
                          desc: language === 'vi' ? 'Pin cũ, bóng đèn hư, chai lọ đựng nước tẩy rửa mạnh, nhớt xe máy hỏng, thuốc bảo vệ thực vật, thuốc chữa bệnh quá hạn, các thiết bị điện tử hỏng hóc nặng.' : 'Batteries, light bulbs, paint tins, strong household detergents, motorcycle oils, insecticides, expired medicines, and broken electronics.',
                          icon: AlertCircle,
                          color: 'text-red-500 bg-red-500/5'
                        },
                        { 
                          title: language === 'vi' ? 'Cách xử lý an toàn nhất' : 'Safest Handling Methods', 
                          desc: language === 'vi' ? 'Đựng riêng biệt trong chai lọ kín. Tuyệt đối không xả chung cống nước sinh hoạt hay chôn dưới vườn. Đưa đến điểm gom rác độc hại định kỳ hoặc các chương trình ngày hội xanh thu gom rác điện tử.' : 'Store in closed labeled containers. Never dump into household drains or bury in gardens. Deliver to local toxic waste centers or drop off at green electronic e-waste days.',
                          icon: CheckCircle2,
                          color: 'text-emerald-500 bg-emerald-500/5'
                        }
                      ].map((item, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                          <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-2 flex items-center gap-2">
                            <item.icon className={`w-4 h-4 ${item.color.split(' ')[0]}`} />
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold dark:font-normal">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAIL MODAL POPUP BACKDROP */}
      <AnimatePresence>
        {selectedItem && (() => {
          const details = getItemDetails(selectedItem);
          const typeLabel = selectedItem.type === 'organic' ? t('games.organic')
            : selectedItem.type === 'recycle' ? t('games.recycle')
            : selectedItem.type === 'inorganic' ? t('games.inorganic')
            : t('games.hazardous');

          const modalThemeColor = selectedItem.type === 'organic' ? 'text-brand-green bg-emerald-500/10 border-brand-green/20'
            : selectedItem.type === 'recycle' ? 'text-brand-blue bg-blue-500/10 border-brand-blue/20'
            : selectedItem.type === 'inorganic' ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
            : 'text-red-500 bg-red-500/10 border-red-500/20';

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
              onClick={() => setSelectedItem(null)}
            >
              {/* Modal Card Content */}
              <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="w-full max-w-lg glass rounded-3xl border border-white/20 p-6 md:p-8 relative overflow-hidden shadow-2xl bg-white dark:bg-slate-900"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Visual Glow background decoration */}
                <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px] opacity-15 pointer-events-none ${
                  selectedItem.type === 'organic' ? 'bg-emerald-500'
                    : selectedItem.type === 'recycle' ? 'bg-blue-500'
                    : selectedItem.type === 'inorganic' ? 'bg-amber-500'
                    : 'bg-red-500'
                }`} />

                {/* Close Button top-right */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-200/50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/50 dark:hover:bg-white/10 transition-colors z-10"
                  aria-label={t('library.close')}
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Modal Title Category */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-4xl p-3 bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-inner">
                    {selectedItem.icon}
                  </div>
                  <div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${modalThemeColor}`}>
                      {typeLabel}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
                      {language === 'vi' ? selectedItem.name.vi : selectedItem.name.en}
                    </h2>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {language === 'vi' ? selectedItem.name.en : selectedItem.name.vi}
                    </p>
                  </div>
                </div>

                {/* Modal Information details */}
                <div className="flex flex-col gap-5 border-t border-slate-200 dark:border-white/5 pt-5">
                  {/* Detailed Description */}
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1.5 flex items-center gap-2">
                      <Info className="w-4 h-4 text-slate-400" />
                      {language === 'vi' ? 'Thông tin phân loại' : 'Classification Description'}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-semibold dark:font-normal">
                      {language === 'vi' ? selectedItem.explanation.vi : selectedItem.explanation.en}
                    </p>
                  </div>

                  {/* Decomposition time */}
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                    <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider leading-none mb-1">
                        {t('library.decompTime')}
                      </h4>
                      <p className="font-black text-slate-900 dark:text-white text-sm leading-none">
                        {details.decompTime}
                      </p>
                    </div>
                  </div>

                  {/* Proper Disposal Procedure */}
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1.5 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-slate-400" />
                      {t('library.disposalGuide')}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-semibold dark:font-normal">
                      {details.disposalGuide}
                    </p>
                  </div>

                  {/* Eco Fact */}
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <h4 className="font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t('library.ecoFact')}
                    </h4>
                    <p className="text-xs leading-relaxed font-semibold dark:font-normal">
                      {details.ecoFact}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
