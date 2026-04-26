import { motion } from "motion/react";
import { Search, ArrowRight, Brain, GraduationCap, Monitor, BarChart3, Bolt, Bookmark, Database, HeartHandshake } from "lucide-react";

const results = [
  {
    category: "MARKET",
    time: "2분 전 업데이트",
    title: "남부 지역 고추 출하량 감소로 인한 도매가 15% 상승 전망",
    desc: "기상 이변으로 인한 수확 시기 지연이 시장 공급량에 직접적인 영향을 미치고 있습니다.",
    trend: "+15.2%",
    trendLabel: "전주 대비",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYk-dwltCJNpOYBGg_DgHHdVWcU3HyWCLGJU_7KYj8px7MXT5LN7MKLEgLwiSRCiEisPCmG_cLJYddKXydmqqphZWNzjyfJxCaQY4tWQDaoi0AJt6YurbGv31-YcSPmGfPWPACafBWoiYldqZck5o3fKWwtWxhdfkMU5W2g04BIH0VATf7XM1HnzzNVqsNle6CYyghgbPSjCl1D2iQOi9xpjp01Sb-DJ6yFIYldiNaoSEBgBKzzErNOGgW-5MqgtkQm6iZqMdjK8QC",
    color: "text-green-600 bg-green-100"
  },
  {
    category: "TECH",
    time: "15분 전 업데이트",
    title: "자율 주행 트랙터 및 정밀 농업 센서 정부 보조금 확대",
    desc: "스마트 농기구 도입을 희망하는 청년 농부를 위한 신규 지원책이 발표되었습니다.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOuIMiyh-uyE_Bc1zjMqoTg_yUaon52UwZ1wFqKy5fQgyDgV0HGwYcRWf0G_RuXLqrhIzDVSl8bd5xs4OKy5MEIJel4dg0xmnlz5-zlm926q7zPjiMVUZ_Q5G6xOt2UcdSSIsGcqKGdimAiBKD5MtMHUzVMHlm7H0nIoZmAE0E16jEDWVz_jZvhu9uggsWBDefe9TAAMB3fuBo5aAihxg16MpLqD5AT0oVwrVYAzYeETINs_anue-7kxdftvj9zXHcCo7BQlQy7HUX",
    color: "text-blue-600 bg-blue-100",
    bookmark: true
  }
];

export default function SearchResults() {
  return (
    <div className="bg-surface min-h-screen pt-32 pb-24">
      {/* Header & Search */}
      <section className="max-w-4xl mx-auto px-6 text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-on-surface mb-8 tracking-tight"
        >
          농업의 미래를 질문하세요.
        </motion.h1>
        
        <div className="relative max-w-2xl mx-auto">
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow group focus-within:border-primary">
            <Search className="w-5 h-5 text-slate-400 mr-3 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              defaultValue="토양 산성도를 어떻게 관리하나요?"
              className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium text-on-surface placeholder:text-slate-400" 
            />
            <button className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-black transition-colors flex items-center justify-center shadow-lg">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="text-sm font-medium text-slate-400 mr-2 self-center">추천 검색어:</span>
            {["올해 고추 농사 전망", "스마트팜 보조금 신청", "병충해 진단 AI"].map((chip) => (
              <button key={chip} className="px-4 py-1.5 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Cards */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "AI Consultation", icon: Brain, color: "text-green-600 bg-green-50", hover: "group-hover:bg-green-600", desc: "실시간 AI 전문가가 제공하는 맞춤형 영농 솔루션" },
            { title: "Education", icon: GraduationCap, color: "text-blue-600 bg-blue-50", hover: "group-hover:bg-blue-600", desc: "최신 농업 기술부터 경영까지, 개인화된 학습 경로" },
            { title: "My Farm", icon: Monitor, color: "text-orange-600 bg-orange-50", hover: "group-hover:bg-orange-600", desc: "데이터 기반의 실시간 농장 모니터링 및 자원 관리" },
            { title: "Market Data", icon: BarChart3, color: "text-purple-600 bg-purple-50", hover: "group-hover:bg-purple-600", desc: "전국 농산물 경매가 및 유통 트렌드 분석 리포트" }
          ].map((card, i) => (
            <motion.div 
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-white border border-slate-100 rounded-2xl hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-4 ${card.hover} group-hover:text-white transition-all`}>
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Insights List */}
      <section className="max-w-4xl mx-auto px-6 mb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-on-surface flex items-center gap-2">
            <Bolt className="w-6 h-6 text-primary fill-primary" />
            실시간 농업 인사이트
          </h2>
          <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline underline-offset-4">
            전체 보기 <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        <div className="space-y-4">
          {results.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="p-5 bg-white border border-slate-100 rounded-2xl flex gap-6 items-start hover:bg-slate-50 transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shadow-inner">
                <img src={item.image} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 ${item.color} text-[10px] font-black rounded uppercase tracking-wider`}>
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{item.time}</span>
                </div>
                <h4 className="text-base font-bold text-slate-800 mb-1 leading-snug">{item.title}</h4>
                <p className="text-sm text-slate-500 font-medium line-clamp-1">{item.desc}</p>
              </div>
              {item.trend ? (
                <div className="flex flex-col items-end">
                  <span className="text-green-600 font-black text-sm">{item.trend}</span>
                  <span className="text-[10px] text-slate-400 font-bold">{item.trendLabel}</span>
                </div>
              ) : (
                <button className="text-slate-300 hover:text-slate-600 transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Intelligence Section */}
      <section className="bg-white py-24 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-16 tracking-tight">데이터로 실현하는 농업 지능</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Database className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">지능형 데이터 허브</h3>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                수만 건의 영농 사례와 공공 데이터를 결합하여 당신의 농장에 가장 적합한 의사결정을 지원합니다. 토양, 기후, 시장 변화를 단일 플랫폼에서 관리하세요.
              </p>
            </div>
            <div className="space-y-6">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">전문가 수준의 컨설팅</h3>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                AI는 단순한 검색 도구가 아닙니다. 작물의 상태를 진단하고, 처방전을 발행하며, 수확 시기를 예측하는 농업 전문가의 역할을 수행합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="max-w-screen-xl mx-auto px-6 py-20 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-12">Trusted by Industry Leaders</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          {[
            { name: "KOREA AGRI", icon: "🚜" },
            { name: "SMART TECH", icon: "🌱" },
            { name: "ECO FARM", icon: "🏛️" },
            { name: "BIO GENES", icon: "🧬" }
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <span className="font-black text-lg text-slate-900">{item.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
