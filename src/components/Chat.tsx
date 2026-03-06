import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { getNepaliContext } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Namaste! I am Sathi AI. How can I help you today? You can ask me about Nepali culture, laws, travel, or anything else!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await getNepaliContext(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response || 'Sorry, I couldn\'t process that.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error connecting to Sathi AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
      <header className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-100">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-serif font-medium text-stone-800">Sathi AI</h3>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Online • Nepali Expert</p>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-stone-200 text-stone-600' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-stone-900 text-white rounded-tr-none' 
                    : 'bg-stone-50 text-stone-800 rounded-tl-none border border-stone-100'
                }`}>
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 flex gap-2">
              <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-stone-100 bg-stone-50/30">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Sathi AI anything..."
            className="flex-1 bg-white border border-stone-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-emerald-600 text-white p-3 rounded-2xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
