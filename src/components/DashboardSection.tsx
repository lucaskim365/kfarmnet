import { motion } from "motion/react";
import { CheckCircle2, Maximize2, Thermometer, Droplets, TrendingUp, AlertTriangle } from "lucide-react";

export default function DashboardSection() {
  return (
    <section className="bg-inverse-surface py-24 text-inverse-on-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary-fixed-dim font-bold tracking-widest text-xs uppercase mb-4 block">
            실시간 분석
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            최대 수확을 위한<br />
            정밀 데이터 분석.
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-lg font-medium">
            120개 이상의 데이터 포인트를 매초 추적하여 문제를 사전에 예측하는 고성능 대시보드입니다.
          </p>
          <ul className="space-y-4">
            {[
              "정밀 토양 수분 측정",
              "동적 공조 제어 동기화",
              "자동 생육 단계 감지"
            ].map((item, i) => (
              <motion.li 
                key={item}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-primary-fixed shrink-0" />
                <span className="text-slate-200 font-medium">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="dark-glass-panel p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative"
        >
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
              <span className="font-mono uppercase tracking-tighter text-sm text-slate-400">
                A-12 구역 실시간 모니터링
              </span>
            </div>
            <Maximize2 className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">온도</span>
                <Thermometer className="w-5 h-5 text-primary-fixed" />
              </div>
              <div className="text-4xl font-mono font-bold">24.8<span className="text-xl">°C</span></div>
              <div className="text-green-400 text-xs mt-2 flex items-center gap-1 font-bold">
                <TrendingUp className="w-3 h-3" /> 0.2% 최적
              </div>
            </div>
            
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">습도</span>
                <Droplets className="w-5 h-5 text-tertiary-fixed-dim" />
              </div>
              <div className="text-4xl font-mono font-bold">62<span className="text-xl">%</span></div>
              <div className="text-yellow-400 text-xs mt-2 flex items-center gap-1 font-bold">
                <AlertTriangle className="w-3 h-3" /> -1.4% 주의
              </div>
            </div>
          </div>

          <div className="h-48 relative overflow-hidden flex items-end justify-between px-2 gap-1.5">
            {[24, 32, 28, 40, 36, 44, 32, 48, 38, 24].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + i * 0.05, duration: 0.5 }}
                className={`flex-1 rounded-t-sm transition-colors ${i === 7 ? 'bg-primary' : 'bg-primary/30'}`}
              >
                {i === 7 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold py-1 px-2 rounded whitespace-nowrap"
                  >
                    최대 성장
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
