import { useState, useEffect, FormEvent } from "react";
import { motion } from "motion/react";
import { Users, MessageSquare, ShieldCheck, LogOut, ChevronRight, Calendar } from "lucide-react";
import { getAllUsers, getAllChats, getChatMessages } from "../lib/db";
import { ChatSession, Message } from "../types";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [users, setUsers] = useState<any[]>([]);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const ADMIN_PASSWORD = "kfarmnet_admin_2024"; // Hardcoded as requested

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setError("");
      setIsLoading(true);
      try {
        // First, check for data loading - if this fails, they aren't real admins in Firestore
        const [allUsers, allChats] = await Promise.all([
          getAllUsers(),
          getAllChats()
        ]);
        
        setUsers(allUsers || []);
        setChats(allChats || []);
        setIsAuthenticated(true);
      } catch (err: any) {
        console.error("Admin verification failed", err);
        setError("비밀번호는 맞지만, 데이터베이스 접근 권한이 없습니다. 관리자 목록에 등록되어야 합니다.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  };

  const loadAdminData = async () => {
    // Already loaded in handleLogin, but for refreshing:
    setIsLoading(true);
    try {
      const [allUsers, allChats] = await Promise.all([
        getAllUsers(),
        getAllChats()
      ]);
      setUsers(allUsers || []);
      setChats(allChats || []);
    } catch (err: any) {
      console.error("Failed to load admin data", err);
      setError(`데이터를 불러올 수 없습니다: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (chat: ChatSession) => {
    setSelectedChat(chat);
    try {
      const msgs = await getChatMessages(chat.id);
      setMessages(msgs || []);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-red-50 rounded-full">
              <ShieldCheck className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">관리자 로그인</h2>
          <p className="text-gray-500 text-center mb-8">액세스하려면 관리자 비밀번호를 입력하세요.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                placeholder="관리자 암호 입력"
                required
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            
            <button
              type="submit"
              className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
            >
              로그인
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShieldCheck className="text-red-600" /> 
            시스템 관리자 패널
          </h1>
          <p className="text-gray-500">사용자 활동 및 대화 로그를 모니터링합니다.</p>
        </div>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats & Users */}
        <div className="lg:col-span-1 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <Users className="w-6 h-6 text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">{users.length}</div>
              <div className="text-gray-500 text-sm">전체 사용자</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <MessageSquare className="w-6 h-6 text-green-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">{chats.length}</div>
              <div className="text-gray-500 text-sm">대화 세션</div>
            </div>
          </div>

          {/* User List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900">최근 가입 사용자</h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {users.map((u) => (
                <div key={u.id} className="p-4 flex items-center gap-3">
                  <img src={u.photoURL} alt="" className="w-10 h-10 rounded-full" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 truncate">{u.displayName}</div>
                    <div className="text-xs text-gray-500 truncate">{u.email}</div>
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <div className="p-8 text-center text-gray-400">사용자가 없습니다.</div>
              )}
            </div>
          </div>
        </div>

        {/* Chats & Messages */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row h-[800px]">
          {/* Chat List */}
          <div className="w-full md:w-1/3 border-r border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900">모든 대화 로그</h3>
            </div>
            <div className="flex-grow overflow-y-auto">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => loadMessages(chat)}
                  className={`w-full p-4 flex flex-col items-start transition-colors border-b border-gray-50 text-left ${
                    selectedChat?.id === chat.id ? "bg-red-50 border-r-4 border-r-red-500" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium text-gray-900 truncate w-full">{chat.title}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Calendar className="w-3 h-3" />
                    {chat.updatedAt?.toDate().toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message View */}
          <div className="w-full md:w-2/3 flex flex-col bg-gray-50/30">
            {selectedChat ? (
              <>
                <div className="p-4 border-b bg-white flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedChat.title}</h3>
                    <p className="text-xs text-gray-500">ID: {selectedChat.id}</p>
                  </div>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {messages.map((m) => (
                    <div 
                      key={m.id} 
                      className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                    >
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        m.role === "user" ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-800"
                      }`}>
                        {m.image && (
                          <img src={m.image.url} alt="" className="rounded-lg mb-2 max-h-48 w-full object-cover" />
                        )}
                        {m.text}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1">
                        {m.createdAt?.toDate().toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-gray-400 p-8 space-y-4">
                <MessageSquare className="w-12 h-12 opacity-20" />
                <p>대화를 선택하여 내용을 확인하세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
