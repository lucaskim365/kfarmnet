import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=2500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1595800473216-562768565bfa?q=80&w=2500&auto=format&fit=crop"
];

export default function Hero({ onSearch }: { onSearch: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[800px] flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 z-0 bg-black">
        <AnimatePresence>
          <motion.img 
            key={currentIndex}
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            alt="Smart Farm" 
            className="absolute inset-0 w-full h-full object-cover" 
            src={BACKGROUND_IMAGES[currentIndex]} 
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-surface pointer-events-none"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl px-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 sm:mb-8 drop-shadow-lg tracking-tight leading-tight px-4"
        >
          농업의 미래를 질문하세요,<br />
          스마트 AI 비서 <span className="text-primary-fixed">kfarmnet</span>
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="glass-panel p-1.5 sm:p-2 rounded-full shadow-2xl flex items-center border border-white/30 max-w-2xl mx-auto w-full"
        >
          <div className="ml-2 sm:ml-6 p-2 bg-primary/10 rounded-full hidden sm:block">
            <Sparkles className="w-5 h-5 text-primary fill-primary/20" />
          </div>
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 sm:px-4 py-3 sm:py-4 text-on-surface text-sm sm:text-lg placeholder:text-slate-400 font-medium min-w-0" 
            placeholder="작물 생육 상태에 대해 물어보세요..." 
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
          <button 
            onClick={onSearch}
            className="bg-primary text-white rounded-full px-5 sm:px-8 py-3 sm:py-4 font-bold hover:bg-primary-container transition-all active:scale-95 flex items-center gap-1 sm:gap-2 shadow-lg text-sm sm:text-base whitespace-nowrap shrink-0"
          >
            <span>검색</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3 px-2"
        >
          {["#토마토_생육", "#병해충_방제", "#시장_가격_동향"].map((tag) => (
            <span 
              key={tag} 
              className="px-3 sm:px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold border border-white/10 hover:bg-white/30 cursor-pointer transition-colors"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
