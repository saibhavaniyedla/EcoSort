import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Battery, 
  UtensilsCrossed, 
  Recycle, 
  Leaf, 
  Bot, 
  User, 
  MoreVertical, 
  Paperclip, 
  Send, 
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage, Tip } from '../types';
import { cn } from '../lib/utils';

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface ChatProps {
  persistedMessages: ChatMessage[];
  setPersistedMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function ChatView({ persistedMessages, setPersistedMessages }: ChatProps) {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [persistedMessages]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userContent = input.trim();
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setPersistedMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsGenerating(true);

    try {
      const history = persistedMessages.map(msg => ({
        role: msg.role === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...history,
          { role: 'user', parts: [{ text: userContent }] }
        ],
        config: {
          systemInstruction: "You are an Eco-Assistant, an expert in waste management. IMPORTANT: Respond only in plain, normal text. DO NOT use Markdown, bolding (**), italics (_), headers (#), or bullet points with symbols. Use simple sentences and clear paragraphs. Do not use any special formatting characters.",
        }
      });

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response.text || "I'm sorry, I couldn't process that request.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setPersistedMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: "I'm having a bit of trouble connecting to my neural network. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setPersistedMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-1 gap-6 overflow-hidden h-full">
      {/* Sidebar: Recent Activity */}
      <aside className="hidden lg:flex flex-col w-80 bg-surface-container-low rounded-lg p-6 overflow-y-auto">
        <div className="mb-8">
          <h2 className="font-headline text-xl font-extrabold tracking-tight text-on-surface mb-2">Recent Activity</h2>
          <p className="text-xs text-on-surface-variant">Your history with Eco-Assistant</p>
        </div>
        <div className="space-y-4">
          {persistedMessages
            .filter(msg => msg.role === 'user')
            .slice(-5) // Last 5 user questions
            .reverse()
            .map((msg) => (
            <motion.div 
              key={msg.id}
              whileHover={{ scale: 0.98 }}
              className="p-4 bg-surface-container-lowest rounded-default hover:shadow-sm transition-all cursor-pointer flex items-start gap-3 border border-surface-variant/20"
            >
              <div className="mt-1 text-primary">
                <Bot size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold font-headline line-clamp-2">{msg.content}</p>
                <p className="text-xs text-on-surface-variant mt-1">{msg.timestamp}</p>
              </div>
            </motion.div>
          ))}
          {persistedMessages.filter(msg => msg.role === 'user').length === 0 && (
            <p className="text-sm text-on-surface-variant italic text-center py-10">No recent activity yet.</p>
          )}
        </div>
        <div className="mt-auto pt-6">
          <div className="p-4 bg-primary-container rounded-default text-primary">
            <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-70">Impact Goal</p>
            <p className="text-sm font-bold">Your journey to zero waste is saved locally.</p>
          </div>
        </div>
      </aside>

      {/* Main Chat Interface */}
      <section className="flex-1 flex flex-col bg-surface-container-lowest rounded-lg overflow-hidden relative shadow-sm border border-surface-variant/30">
        {/* Chat Header */}
      <div className="px-6 py-4 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-surface-variant/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center">
            <img 
              src="https://picsum.photos/seed/eco-assistant/100/100" 
              alt="Assistant" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="font-headline font-bold text-on-surface leading-tight">Eco-Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs font-medium text-on-surface-variant">Active Now</span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {persistedMessages.map((msg) => (
          <div 
            key={msg.id} 
            className={cn(
              "flex items-start gap-3 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center",
              msg.role === 'bot' ? "bg-primary-fixed text-primary" : "bg-secondary-fixed text-secondary"
            )}>
              {msg.role === 'bot' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={cn(
              "p-4 rounded-lg shadow-sm whitespace-pre-wrap text-sm leading-relaxed",
              msg.role === 'bot' 
                ? "bg-surface-container-low text-on-surface rounded-tl-none" 
                : "bg-primary text-white rounded-tr-none"
            )}>
              <p>{msg.content}</p>
              {msg.bullets && (
                <ul className="mt-3 space-y-2">
                  {msg.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="mt-0.5 text-primary flex-shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-[10px] mt-2 opacity-50 font-bold uppercase tracking-wider">
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex items-start gap-3 max-w-[85%] animate-pulse">
            <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
              <Loader2 size={16} className="animate-spin" />
            </div>
            <div className="p-4 rounded-lg bg-surface-container-low text-on-surface-variant text-sm italic font-medium">
              Eco-Assistant is thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-surface-container-low/30 border-t border-surface-variant/30">
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {["Where is the nearest recycling center?", "Can I recycle pizza boxes?", "Eco-friendly alternatives"].map((s) => (
            <button 
              key={s} 
              onClick={() => setInput(s)}
              disabled={isGenerating}
              className="whitespace-nowrap px-4 py-2 bg-surface-container-lowest text-xs font-semibold text-primary rounded-full hover:bg-primary-fixed transition-colors border border-primary/10 disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative flex items-center gap-3 bg-surface-container-lowest p-2 rounded-full shadow-sm ring-1 ring-inset ring-outline-variant/20 focus-within:ring-primary/50 transition-all">
          <button 
            disabled={isGenerating}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30"
          >
            <Paperclip size={20} />
          </button>
          <input 
            type="text" 
            placeholder={isGenerating ? "Processing response..." : "Type your waste management question..."}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm py-2 px-1 text-on-surface placeholder:text-on-surface-variant/50 disabled:opacity-50"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isGenerating}
          />
          <button 
            onClick={handleSend}
            className="bg-primary text-white p-2.5 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            disabled={!input.trim() || isGenerating}
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} fill="currentColor" />}
          </button>
        </div>
      </div>
      </section>
    </div>
  );
}
