import { motion, AnimatePresence } from "motion/react";
import { Paperclip, Sparkles, Send, Microscope, TrendingUp, Bug, Cloud, User, Loader2, X, History, Plus, MessageSquare, Camera } from "lucide-react";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { chatWithGemini } from "../lib/gemini";
import { useAuth } from "../contexts/AuthContext";
import { createChat, addMessage, getUserChats, getChatMessages, uploadChatImage } from "../lib/db";
import { Message, ChatSession } from "../types";

const suggestions = [
  {
    icon: Microscope,
    title: "토양 산도를 어떻게 개선하나요?",
    sub: "토양 분석 및 개량"
  },
  {
    icon: TrendingUp,
    title: "올해 하반기 쌀 가격 전망은 어떤가요?",
    sub: "시장 데이터 예측"
  },
  {
    icon: Bug,
    title: "잎사귀에 갈색 반점이 생겼어요. 진단해주세요.",
    sub: "이미지 기반 병해충 분석"
  },
  {
    icon: Cloud,
    title: "다음 주 폭우에 대비한 과수원 관리법",
    sub: "기상 연동 대응 솔루션"
  }
];

export default function AIAssistant() {
  const { user, login } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      // 입력창(floating input)이 가리지 않도록 하단에서 240px 여백을 두고 스크롤합니다.
      const elementY = scrollRef.current.getBoundingClientRect().top + window.scrollY;
      const targetY = elementY - window.innerHeight + 240;
      window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Fetch chat history on login
  useEffect(() => {
    if (user) {
      loadChats();
    } else {
      setChats([]);
      setActiveChatId(null);
      setMessages([]);
    }
  }, [user]);

  const loadChats = async () => {
    if (!user) return;
    try {
      const userChats = await getUserChats(user.uid);
      setChats(userChats || []);
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  };

  const selectChat = async (chatId: string) => {
    setActiveChatId(chatId);
    setShowHistory(false);
    try {
      const chatMessages = await getChatMessages(chatId);
      setMessages(chatMessages || []);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setShowHistory(false);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedImage = await new Promise<{ data: string; mimeType: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 1024;
            const MAX_HEIGHT = 1024;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, width, height);
            
            // Compress to JPEG with 70% quality to significantly reduce size
            const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
            const base64String = dataUrl.split(",")[1];
            resolve({ data: base64String, mimeType: "image/jpeg" });
          };
          img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
      });

      setSelectedImage(compressedImage);
    } catch (error) {
      console.error("Image compression failed:", error);
      alert("이미지 처리 중 오류가 발생했습니다.");
    }
  };

  const handleSend = async (text: string) => {
    if ((!text.trim() && !selectedImage) || isLoading) return;

    // Check if login is required
    if (!user) {
      if (confirm("대화 내용을 저장하려면 로그인이 필요합니다. 로그인하시겠습니까?")) {
        await login();
        return;
      }
    }

    const newMessage: Message = { 
      role: "user", 
      text,
      image: selectedImage ? { ...selectedImage } : undefined,
      createdAt: new Date() // Temporary for UI
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    try {
      let chatId = activeChatId;
      
      // 1. Ensure chat session exists
      if (!chatId && user) {
        const title = text.slice(0, 20) || "이미지 분석 대화";
        chatId = await createChat(user.uid, title) || null;
        setActiveChatId(chatId);
        loadChats(); // Refresh history list
      }

      // 2. Upload image to Storage if exists
      let imageUrl = "";
      if (newMessage.image && chatId && user) {
        try {
          imageUrl = await uploadChatImage(user.uid, chatId, newMessage.image.data!, newMessage.image.mimeType);
          newMessage.image.url = imageUrl;
          // Note: we keep .data for locally displayed messages, but in DB we store URL
        } catch (uploadError) {
          console.error("Storage upload failed, fallback to no image record in DB", uploadError);
          // If storage is not enabled, we might get an error here
        }
      }

      // 3. Save user message to Firestore
      if (chatId) {
        await addMessage(chatId, "user", text, newMessage.image);
      }

      // 4. Get AI Response
      const response = await chatWithGemini([...messages, newMessage] as any);
      const modelMessage: Message = { role: "model", text: response, createdAt: new Date() };
      
      setMessages((prev) => [...prev, modelMessage]);

      // 5. Save model response to Firestore
      if (chatId) {
        await addMessage(chatId, "model", response);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "model", text: "오류가 발생했습니다. 나중에 다시 시도해 주세요.", createdAt: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col pt-20 pb-[240px] relative overflow-x-hidden">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-[70] p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  대화 기록
                </h2>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-50 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <button 
                onClick={startNewChat}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl mb-6 transition-colors font-bold text-primary border border-primary/10"
              >
                <Plus className="w-5 h-5" />
                새 대화 시작하기
              </button>

              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {chats.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-sm">저장된 대화가 없습니다.</p>
                  </div>
                ) : (
                  chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => selectChat(chat.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all group border ${
                        activeChatId === chat.id 
                          ? "bg-primary/5 border-primary/20" 
                          : "bg-white border-transparent hover:bg-slate-50"
                      }`}
                    >
                      <p className="font-bold text-on-surface truncate mb-1 group-hover:text-primary transition-colors">
                        {chat.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {new Date(chat.updatedAt?.seconds * 1000).toLocaleDateString()}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* History Button */}
      <div className="max-w-3xl mx-auto px-6 w-full flex justify-end mb-4">
        {user && (
          <button 
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
          >
            <History className="w-4 h-4 text-primary" />
            대화 기록
          </button>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-6 w-full flex flex-col">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center">
            {/* Header Icon */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-primary/10 p-5 rounded-full mb-8"
            >
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white fill-white/20" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl font-bold text-on-surface mb-6 tracking-tight">
                무엇을 도와드릴까요?
              </h1>
              <p className="text-on-surface-variant text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                데이터 기반의 스마트 농업 비서입니다. 작물 생육, 시장 동향, 병해충 진단 등 어떤 것이든 물어보세요.
              </p>
            </motion.div>

            {/* Suggestion Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
              {suggestions.map((item, i) => (
                <motion.button
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  onClick={() => handleSend(item.title)}
                  className="bg-white border border-slate-100 rounded-2xl p-6 text-left hover:shadow-xl transition-all group flex flex-col items-start gap-4 border-b-4 hover:border-primary/30"
                >
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="w-full">
                    <p className="text-on-surface font-bold mb-3">{item.title}</p>
                    <div className="pt-3 border-t border-slate-50 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {item.sub}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 mb-12">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "model" && (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div 
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-base font-medium leading-relaxed shadow-sm border ${
                      msg.role === "user" 
                        ? "bg-primary text-white border-primary" 
                        : "bg-white text-on-surface border-slate-100"
                    }`}
                  >
                    {msg.image && (
                      <div className="mb-4 rounded-xl overflow-hidden border border-white/20">
                        <img 
                          src={msg.image.url || (msg.image.data ? `data:${msg.image.mimeType};base64,${msg.image.data}` : "")} 
                          alt="User uploaded" 
                          className="max-h-64 object-contain"
                        />
                      </div>
                    )}
                    {msg.text}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-slate-500" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 justify-start"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              </motion.div>
            )}
            <div ref={scrollRef} />
          </div>
        )}
      </div>

      {/* Floating Input Area */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-surface via-surface to-transparent pt-12 pb-10 px-6 z-50">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
          {/* Image Preview */}
          {selectedImage && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="relative w-full max-w-[200px] mb-4 group"
            >
              <img 
                src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} 
                className="w-full h-auto rounded-xl border-2 border-primary/50 shadow-lg"
                alt="Selected"
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-on-surface text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Active Tags */}
          {messages.length === 0 && !selectedImage && (
            <div className="flex flex-wrap justify-center gap-2">
              {["#쌀수확량", "#병해충방제", "#스마트팜지원금"].map((tag) => (
                <button 
                  key={tag} 
                  onClick={() => handleSend(tag)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <Sparkles className="w-3 h-3 text-primary" />
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="w-full bg-white border border-slate-200 rounded-[2.5rem] p-3 shadow-[0_10px_40px_-5px_rgba(0,0,0,0.1)] flex items-center gap-2 focus-within:border-primary transition-all group relative">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <input 
              type="file" 
              ref={cameraInputRef}
              onChange={handleFileChange}
              accept="image/*"
              capture="environment"
              className="hidden"
            />
            <button 
              onClick={() => cameraInputRef.current?.click()}
              className="p-2 sm:p-3 hover:bg-slate-50 rounded-full transition-colors group/icon md:hidden"
              title="카메라로 촬영"
            >
              <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover/icon:text-primary transition-colors" />
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 sm:p-3 hover:bg-slate-50 rounded-full transition-colors group/icon"
              title="이미지 첨부"
            >
              <Paperclip className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover/icon:text-primary transition-colors" />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder={selectedImage ? "이미지에 대해 설명해 주세요..." : "농업 관련 질문이나 이미지를 입력하세요..."}
              className="flex-1 bg-transparent border-none focus:ring-0 text-base font-medium text-on-surface placeholder:text-slate-300"
            />
            <div className="flex items-center gap-1 pr-1">
              <button className="p-3 hover:bg-slate-50 rounded-full transition-colors">
                <Sparkles className="w-6 h-6 text-primary animate-pulse-slow" />
              </button>
              <button 
                onClick={() => handleSend(input)}
                disabled={isLoading || (!input.trim() && !selectedImage)}
                className="p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary-container transition-all active:scale-95 group/send disabled:opacity-50 disabled:scale-100"
              >
                <Send className="w-6 h-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">
            AI는 실수를 할 수 있습니다. 중요한 농업 결정 전 전문가와 교차 검증하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
