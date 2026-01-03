
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, BrainCircuit } from 'lucide-react';
import { GeminiService } from '../GeminiService';

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hi! I am the OC Thrive Assistant. How can I help you discover Orange County today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await GeminiService.chatWithThinking(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: response || "I'm sorry, I couldn't process that." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to Gemini. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-sky-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
        >
          <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />
        </button>
      ) : (
        <div className="bg-white w-[350px] md:w-[400px] h-[550px] rounded-[2rem] shadow-2xl flex flex-col border border-stone-200 overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
          <div className="bg-sky-950 p-5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-sky-800 p-2 rounded-lg">
                <BrainCircuit className="h-5 w-5 text-sky-300" />
              </div>
              <span className="text-white font-bold tracking-tight">Thrive AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white"><X className="h-5 w-5" /></button>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-5 space-y-4 bg-stone-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-sky-900 text-white rounded-br-none' 
                    : 'bg-white border border-stone-200 text-slate-800 rounded-bl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 p-4 rounded-[1.5rem] rounded-bl-none shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-sky-900" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-stone-100 bg-white">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center space-x-2 bg-stone-100 rounded-2xl px-4 py-2 border border-stone-200 focus-within:ring-2 focus-within:ring-sky-500 transition-all"
            >
              <input 
                type="text" 
                placeholder="Ask anything about OC..." 
                className="bg-transparent flex-grow outline-none text-sm text-slate-800 py-1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" disabled={isLoading} className="text-sky-900 hover:text-sky-700 disabled:opacity-50">
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatBot;
