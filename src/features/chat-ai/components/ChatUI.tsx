import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, Trash2, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLocalChat } from '../hooks/useLocalChat';
import type { ChatMessage } from '../chat.types';
import { useTranslation } from '../../../context/LanguageContext';

export const ChatUI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useTranslation();
  
  const { isReady, isGenerating, generateResponse } = useLocalChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSend = async () => {
    if (!input.trim() || !isReady || isGenerating) return;

    const userText = input.trim();
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: userText };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput('');
    
    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMsgId, sender: 'ai', text: '' }]);

    await generateResponse(userText, newMessages, (currentText) => {
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: currentText } : m));
    });
  };

  const clearHistory = () => {
    setMessages([]);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-brand-green to-brand-blue flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all group"
          >
            <Bot className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-32px)] h-[650px] max-h-[calc(100vh-100px)] flex flex-col glass rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-slate-950/90 backdrop-blur-2xl"
          >
            <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-green to-brand-blue flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">AI Sort Mini</h3>
                  <div className="flex items-center gap-2 text-xs text-brand-green font-medium">
                    <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                    {language === 'en' ? 'Online (Ultra Fast)' : 'Hoạt động (Siêu Nhanh)'}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={clearHistory} className="p-2 text-slate-400 hover:text-white transition-colors" title="Xóa lịch sử">
                  <Trash2 className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors">
                  <ChevronDown className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.length === 0 && (
                <div className="text-center text-slate-400 my-auto px-4">
                  <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{language === 'en' ? 'Super fast AI assistant is ready.' : 'Trợ lý AI siêu tốc đã sẵn sàng.'}</p>
                  <p className="text-sm mt-2">{language === 'en' ? 'Automated offline system, no internet required.' : 'Hệ thống tra cứu tự động, không yêu cầu mạng hoặc tải model nặng.'}</p>
                </div>
              )}

              {messages.map((msg) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                    msg.sender === 'user' 
                      ? 'bg-brand-green text-white rounded-tr-sm' 
                      : 'bg-white/10 text-slate-200 rounded-tl-sm border border-white/5 prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10'
                  }`}>
                    {msg.sender === 'user' ? (
                      <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>
                    ) : (
                      <ReactMarkdown>{msg.text || "..."}</ReactMarkdown>
                    )}
                  </div>
                </motion.div>
              ))}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={!isReady || isGenerating}
                  placeholder={language === 'en' ? "Ask about waste sorting..." : "Hỏi về phân loại rác..."}
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-green/50 transition-colors disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  disabled={!input.trim() || !isReady || isGenerating}
                  className="absolute right-2 p-2 rounded-full bg-brand-green text-white hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-brand-green transition-colors"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
