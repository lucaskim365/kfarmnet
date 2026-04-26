import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Hero({ onSearch }: { onSearch: () => void }) {
  return (
    <section className="relative h-[800px] flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          alt="Smart Farm" 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHqA4Ps9Tytar8OmTLTeKj6U8rcChqZTyKAJFCG6C7fS1waoBkKdIjZGPkluSwl41yrFFHPq8rs6Lj6lxsoXd9R6zJ-5aeKzCcYkSemRykjAYycaZw0wedPaT_8BRXlPJlEXCaC2JSQFLuzm06H34RIzXQoGtQx98Gjydo57Oqy9TylPzvT-nGjQlkL7N9JPmmPROcdRP1AxJdW8TK629cJ51gbXJWbKsvetnqpbdPJEsGxN7mdKAsJSXTtVV8gpPfmN6mbDpKDmNd" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-surface"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl px-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-5xl md:text-6xl font-black text-white mb-8 drop-shadow-lg tracking-tight leading-tight"
        >
          농업의 미래를 질문하세요,<br />
          스마트 AI 비서 <span className="text-primary-fixed">kfarmnet</span>
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="glass-panel p-2 rounded-full shadow-2xl flex items-center border border-white/30 max-w-2xl mx-auto"
        >
          <div className="ml-6 p-2 bg-primary/10 rounded-full">
            <Sparkles className="w-5 h-5 text-primary fill-primary/20" />
          </div>
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-4 text-on-surface text-lg placeholder:text-slate-400 font-medium" 
            placeholder="작물 생육 상태에 대해 물어보세요..." 
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
          <button 
            onClick={onSearch}
            className="bg-primary text-white rounded-full px-8 py-4 font-bold hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2 shadow-lg"
          >
            <span>검색</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {["#토마토_생육", "#병해충_방제", "#시장_가격_동향"].map((tag) => (
            <span 
              key={tag} 
              className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold border border-white/10 hover:bg-white/30 cursor-pointer transition-colors"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
