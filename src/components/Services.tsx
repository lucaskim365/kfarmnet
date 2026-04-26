import { motion } from "motion/react";
import { Brain, GraduationCap, Monitor, ArrowUpRight } from "lucide-react";

const services = [
  {
    title: "AI 농업 상담",
    desc: "작물 상태에 대한 실시간 진단 및 최적화 전략을 제공하는 고급 생성형 AI입니다.",
    icon: Brain,
    color: "bg-primary-fixed",
    iconColor: "text-primary",
    link: "자세히 보기"
  },
  {
    title: "맞춤형 전문 교육",
    desc: "토양학부터 유통 물류까지 현대 농업인을 위해 설계된 맞춤형 학습 모듈입니다.",
    icon: GraduationCap,
    color: "bg-secondary-container",
    iconColor: "text-secondary",
    link: "수강하기"
  },
  {
    title: "내 농장 관리",
    desc: "관수, 양분 상태, 수확량 예측을 한눈에 파악할 수 있는 통합 대시보드입니다.",
    icon: Monitor,
    color: "bg-tertiary-fixed",
    iconColor: "text-tertiary",
    link: "내 농장 가기"
  }
];

export default function Services() {
  return (
    <section className="max-w-7xl mx-auto px-8 -mt-24 relative z-20 mb-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="bg-surface-container-lowest p-8 rounded-2xl shadow-xl border border-outline-variant hover:shadow-2xl transition-all group flex flex-col items-start"
          >
            <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <service.icon className={`w-8 h-8 ${service.iconColor}`} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-on-surface">{service.title}</h3>
            <p className="text-on-surface-variant leading-relaxed font-medium">
              {service.desc}
            </p>
            <div className="mt-auto pt-8 flex items-center text-primary font-bold gap-2 cursor-pointer group/link">
              <span className="group-hover/link:underline underline-offset-4">{service.link}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
