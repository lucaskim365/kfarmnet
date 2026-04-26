import { motion } from "motion/react";
import { ArrowRight, Clock, MapPin, Tag } from "lucide-react";

const insights = [
  {
    type: "기상 특보",
    typeColor: "bg-red-500",
    title: "국지성 호우 예상",
    desc: "6시간 이내 전라권에 국지성 뇌우가 예상됩니다. 노지 작물의 피해가 우려되니 대비하시기 바랍니다.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbxZx0fU0vXLbA8pvOiJZ8McA6-zatqjkGdwSQ6dy8fWSAeqLckKS4k8Vg0YGFAiFCqfcWhz69wa7_kzuNFYnMzp76D8RS334TwgwPcL55dVcnPyqexKo8vB1cC3AFbMrkr8fZ2hXWI-9wU8hKhUOl08FRU_fvt-9vPkypTIAx17Gl1Svz2Yf5ketKE0AJJGrIM5ujBd-MIj2tlySo0sGBSCbcNE3AZwbRlBGhvXqtq4dkP9RZNMAjm1iyrI5QFrd2pOszShnnvqDb",
    meta: "경보 수준: 높음",
    time: "24분 전",
    span: "lg:col-span-1"
  },
  {
    type: "시장 동향",
    typeColor: "bg-primary/10 text-primary",
    title: "동남아시아 딸기 수출 수요 15% 급증",
    desc: "프리미엄 한국산 딸기에 대한 수요가 기록적입니다. 수출 품질을 위해 당도 최적화가 권장됩니다.",
    image: null,
    author: "한진우",
    time: "2시간 전"
  },
  {
    type: "기술 보고서",
    typeColor: "bg-tertiary/10 text-tertiary",
    title: "새로운 AI 모델, 병해충 진단에서 뛰어난 성능 입증",
    desc: "연구에 따르면 kfarmnet V3 모델은 시각적 증상이 나타나기 전 곰팡이 감염을 98.4% 정확하게 식별합니다.",
    image: null,
    author: "공세라",
    time: "5시간 전"
  }
];

export default function InsightsSection() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">
      <div className="flex justify-between items-end mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">실시간 농업 인사이트</h2>
          <p className="text-on-surface-variant font-medium">지역 날씨 및 글로벌 시장 정보로 앞서가세요.</p>
        </motion.div>
        
        <button className="group flex items-center gap-2 text-primary font-bold border-b-2 border-primary-fixed-dim pb-1 hover:border-primary transition-all">
          <span>전체 보기</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {insights.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className={`${item.span || ""} bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant flex flex-col hover:border-primary/30 transition-colors cursor-pointer group`}
          >
            {item.image && (
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4">
                  <span className={`${item.typeColor} text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg`}>
                    {item.type}
                  </span>
                </div>
              </div>
            )}
            
            <div className="p-8 flex-1 flex flex-col">
              {!item.image && (
                <div className="flex items-center gap-2 mb-4">
                  <span className={`${item.typeColor} text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap`}>
                    {item.type}
                  </span>
                </div>
              )}
              
              <h4 className={`font-bold text-on-surface mb-3 leading-snug ${item.image ? 'text-xl' : 'text-2xl'}`}>
                {item.title}
              </h4>
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed font-medium line-clamp-3">
                {item.desc}
              </p>
              
              <div className="mt-auto pt-6 border-t border-outline-variant flex items-center justify-between">
                {item.author ? (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-600">
                      {item.author[0]}
                    </div>
                    <span className="text-sm font-bold text-on-surface">{item.author}</span>
                  </div>
                ) : (
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-tighter">
                    {item.meta}
                  </span>
                )}
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{item.time}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
