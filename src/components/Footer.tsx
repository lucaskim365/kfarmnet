import { motion } from "motion/react";
import { Globe, Mail, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const years = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-low border-t border-outline-variant pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-24">
          <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mb-12">
            글로벌 농업 리더들이 신뢰하는 플랫폼
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {["ECOGROW", "AGRISTREAM", "SMARTLEAF", "VITA-SOIL", "FUTUREFARM"].map((logo) => (
              <span key={logo} className="text-2xl font-black tracking-tighter text-slate-700 cursor-default">
                {logo}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <span className="text-2xl font-black text-primary mb-6 block">kfarmnet</span>
            <p className="text-on-surface-variant text-sm leading-loose max-w-xs font-medium">
              인공지능의 정밀함과 유기적 성장의 지혜로 농업 경영인을 지원합니다. 지속 가능한 미래 농업을 위해 혁신적인 솔루션을 제공합니다.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface mb-8">제품</h4>
            <ul className="space-y-4">
              {["회사 소개", "내 농장", "AI 윤리", "릴리즈 노트"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-on-surface-variant hover:text-primary text-sm font-medium transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface mb-8">고객 지원</h4>
            <ul className="space-y-4">
              {["문의하기", "고객 센터", "커뮤니티", "파트너십"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-on-surface-variant hover:text-primary text-sm font-medium transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface mb-8">법적 고지</h4>
            <ul className="space-y-4">
              {["개인정보 처리방침", "이용 약관", "보안 정책"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-on-surface-variant hover:text-primary text-sm font-medium transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-outline-variant/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">
            © {years} kfarmnet. AI로 실현하는 지능형 농업 경영.
          </p>
          
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <Globe className="w-5 h-5 text-slate-400 hover:text-primary cursor-pointer transition-colors" />
              <Mail className="w-5 h-5 text-slate-400 hover:text-primary cursor-pointer transition-colors" />
            </div>
            <div className="h-4 w-[1px] bg-outline-variant/50 hidden md:block" />
            <div className="flex gap-4">
              <Twitter className="w-5 h-5 text-slate-400 hover:text-primary cursor-pointer transition-colors" />
              <Facebook className="w-5 h-5 text-slate-400 hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-slate-400 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
