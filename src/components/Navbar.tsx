import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Bell, User, Menu, LogOut, LogIn, ShieldAlert, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar({ onHomeClick, onSearchClick, onAIClick, onAdminClick }: { 
  onHomeClick: () => void, 
  onSearchClick: () => void, 
  onAIClick: () => void,
  onAdminClick: () => void
}) {
  const { user, login, logout, loading, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onHomeClick}
            className="text-2xl font-black tracking-tight text-primary cursor-pointer hover:scale-105 transition-transform"
          >
            kfarmnet
          </motion.div>
          
          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: "AI 상담", action: onAIClick },
              { label: "교육", action: onHomeClick },
              { label: "내 농장", action: onHomeClick },
              { label: "마켓플레이스", action: onHomeClick }
            ].map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                onClick={item.action}
                className="text-secondary hover:text-primary font-medium transition-colors"
              >
                {item.label}
              </motion.button>
            ))}
            {isAdmin && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={onAdminClick}
                className="text-red-500 hover:text-red-600 font-bold transition-colors flex items-center gap-1"
              >
                <ShieldAlert className="w-4 h-4" />
                Admin
              </motion.button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center bg-surface-container rounded-full px-4 py-1.5 border border-outline-variant group focus-within:border-primary transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="궁금한 농사 정보를 검색해 보세요" 
              onKeyDown={(e) => e.key === 'Enter' && onSearchClick()}
              className="bg-transparent border-none focus:ring-0 text-sm w-[200px] p-0 placeholder:text-slate-400"
            />
          </div>
          
          <button className="p-2 hover:bg-surface-container rounded-full transition-colors relative">
            <Bell className="w-5 h-5 text-on-surface" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center gap-2">
            {!loading && (
              user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-2 py-1 border border-outline-variant rounded-full hover:bg-surface-container transition-colors">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full" />
                    ) : (
                      <User className="w-5 h-5 text-on-surface" />
                    )}
                    <span className="text-xs font-medium hidden sm:block">{user.displayName || "사용자"}</span>
                  </div>
                  <button 
                    onClick={logout}
                    className="p-2 hover:bg-red-50 rounded-full text-slate-500 hover:text-red-500 transition-colors"
                    title="로그아웃"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={login}
                  className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-all font-medium text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  로그인
                </button>
              )
            )}
          </div>
          
          <button 
            className="md:hidden p-2 hover:bg-surface-container rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-on-surface" />
            ) : (
              <Menu className="w-6 h-6 text-on-surface" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-outline-variant overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {[
                { label: "AI 상담", action: onAIClick },
                { label: "교육", action: onHomeClick },
                { label: "내 농장", action: onHomeClick },
                { label: "마켓플레이스", action: onHomeClick }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.action();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-on-surface font-medium py-2 border-b border-slate-100 last:border-none hover:text-primary transition-colors"
                >
                  {item.label}
                </button>
              ))}
              {isAdmin && (
                <button
                  onClick={() => {
                    onAdminClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-red-500 font-bold py-2 flex items-center gap-2 hover:text-red-600 transition-colors"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Admin
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
