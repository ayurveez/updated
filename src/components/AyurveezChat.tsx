import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateChatResponse, isAiConfigured } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AyurveezChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Namaste! I am **Ayurveez AI**. \n\nI can help you with:\n- BAMS Syllabus Queries\n- Clinical Case Studies\n- Ayurvedic Texts (Samhitas)\n- Exam Tips\n\nHow can I assist you today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
    const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    let mounted = true;
    checkAiServer().then(ok => {
      if (mounted) setAiAvailable(ok);
    });
    return () => { mounted = false; };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const responseText = await generateChatResponse(userMsg.text, history);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm having trouble connecting to the ancient wisdom network right now. Please try again.",
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-4 md:my-8 p-4 h-[calc(100vh-140px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-xl border-2 border-ayur-gold overflow-hidden flex flex-col flex-grow">
        {/* Header */}
        <div className="bg-gradient-to-r from-ayur-green to-ayur-brown p-4 text-white flex items-center gap-3 shadow-md z-10">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
            <i className="fas fa-robot"></i>
          </div>
          <div>
            <h2 className="font-bold text-lg">Ayurveez AI</h2>
            <p className="text-xs opacity-90">Your 24/7 BAMS Companion</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-4 bg-[#f9f9f9]" ref={scrollRef}>
          {aiAvailable === false && (
            <div className="mb-4 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded">
              AI is not available on the server. Ask the admin to set `GEMINI_API_KEY` in Vercel project settings.
            </div>
          )}
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-sm text-sm md:text-base ${
                  msg.role === 'user' 
                    ? 'bg-ayur-saffron text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none prose'
                } ${msg.isError ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-ayur-green rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-ayur-green rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-ayur-green rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={aiAvailable === false ? "AI not available on server" : "Ask about Shlokas, Herbs, or Exams..."}
              className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:border-ayur-green focus:ring-1 focus:ring-ayur-green transition-all shadow-inner"
              disabled={aiAvailable === false}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !isAiConfigured()}
              className="bg-ayur-green hover:bg-green-700 text-white px-6 rounded-full font-semibold transition-colors disabled:opacity-50 shadow-md"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
