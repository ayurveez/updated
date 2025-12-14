
import React, { useState, useRef, useEffect } from 'react';

interface Message {
  text: string;
  sender: 'bot' | 'user';
}

export const FloatingFAQ: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm your AYURVEEZ assistant. How can I help you today? Click on any question below to get instant answers.", sender: 'bot' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const faqData: Record<string, string> = {
    "1": "We offer comprehensive BAMS preparation courses for all professional years:\n\n• First Professional (1st Year) - ₹1,999\n• Second Professional (2nd Year) - ₹2,999\n• Third Professional (3rd Year) - ₹4,999\n\nYou can also purchase individual subjects starting from ₹499 each.",
    "2": "Payment Process:\n1. Choose your course/subject\n2. Make payment via UPI (thersk@axl) or bank transfer\n3. Send payment screenshot to WhatsApp: 9376884568\n4. Include your name, course, amount, transaction ID, and email\n5. Receive access code within 2-4 hours",
    "3": "Access is granted within 2-4 hours after we verify your payment. We process requests daily from 9 AM to 10 PM. You'll receive a unique access code via WhatsApp/email to login to our learning dashboard.",
    "4": "Yes! Upon course completion, you receive a certificate of completion from AYURVEEZ signed by Dr. Ravi Shankar Sharma.",
    "5": "Our courses are non-refundable once access has been provided. We ensure you can preview the course content before purchase through our free resources and demo videos.",
    "6": "To download study material:\n1. Login to your AYURVEEZ dashboard\n2. Go to 'My Courses' section\n3. Click on the subject\n4. Find the 'Downloads' tab\n5. Click on PDF/notes to download",
    "7": "Currently we have a mobile-responsive web platform that works perfectly on all devices. We're developing a dedicated mobile app which will launch soon.",
    "8": "Dr. Ravi is available for:\n• Direct doubt-solving calls for enrolled students\n• Email: ayurveez@gmail.com\n• WhatsApp: 9376884568",
    "9": "Ayurveez AI (formerly GuruJi) is our public 24/7 AI assistant. It helps with general BAMS queries, exam tips, and syllabus information. It's free to use on our website.",
    "10": "Sathi AI is our premium academic companion exclusively for enrolled students inside the dashboard. It acts like a senior mentor for clinical case studies, detailed shloka explanations, and diagnosis assistance.",
    "11": "The Study Scheduler is a tool that creates a personalized routine based on your college timings (Attending/Non-attending) and sleep cycle, ensuring you cover the syllabus efficiently.",
    "12": "The Wellness Zone provides Ayurvedic solutions for exam stress, anxiety, and focus issues. It suggests specific herbs, daily regimens (Dinacharya), and mental exercises."
  };

  const quickQuestions = [
    { k: "1", q: "What courses do you offer?" },
    { k: "2", q: "How do I make payment?" },
    { k: "3", q: "When will I get access?" },
    { k: "10", q: "What is Sathi AI?" },
    { k: "9", q: "What is Ayurveez AI?" },
    { k: "11", q: "How does Scheduler work?" },
    { k: "12", q: "Wellness Zone features?" },
    { k: "4", q: "Do you provide certificates?" },
    { k: "5", q: "Refund policy?" },
    { k: "6", q: "How to download notes?" },
    { k: "7", q: "Is there a mobile app?" },
    { k: "8", q: "Contact Dr. Ravi?" },
  ];

  const handleQuickQuestion = (key: string, question: string) => {
    // User Message
    setMessages(prev => [...prev, { text: question, sender: 'user' }]);
    
    // Bot Response with delay
    setTimeout(() => {
      setMessages(prev => [...prev, { text: faqData[key], sender: 'bot' }]);
    }, 600);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Thank you for your question. For personalized assistance, please contact us directly:\n\n📱 WhatsApp: 9376884568\n📧 Email: ayurveez@gmail.com\n\nWe'll respond within 2-4 hours.", 
        sender: 'bot' 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col items-end font-sans safe-area-bottom">
      {isOpen && (
        <div className="mb-3 md:mb-4 bg-white w-[85vw] md:w-[380px] h-[60vh] md:h-[520px] rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-ayur-green to-ayur-saffron p-3 md:p-4 text-white flex justify-between items-center shadow-md">
            <div>
              <h3 className="font-bold text-base md:text-lg">Ayurveez Support</h3>
              <p className="text-[10px] md:text-xs opacity-90">24/7 Assistance</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 bg-gray-50 scrollbar-hide">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-2 md:p-3 rounded-2xl text-xs md:text-sm whitespace-pre-wrap shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-ayur-saffron to-orange-400 text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions - Updated Layout */}
          <div className="bg-white border-t border-gray-100 p-2 md:p-3 max-h-[140px] md:max-h-[160px] overflow-y-auto shadow-inner scrollbar-hide">
            <p className="text-[10px] md:text-xs font-bold text-gray-500 mb-2 uppercase">Common Queries</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((item) => (
                <button
                  key={item.k}
                  onClick={() => handleQuickQuestion(item.k, item.q)}
                  className="text-[10px] md:text-xs text-left px-2 md:px-3 py-1.5 md:py-2 bg-gray-50 border border-gray-200 rounded-full hover:bg-ayur-light-green hover:border-ayur-green hover:text-ayur-green transition whitespace-normal"
                >
                  {item.q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-2 md:p-3 bg-white border-t border-gray-200 flex gap-2">
            <input 
              className="flex-1 border border-gray-300 rounded-full px-3 md:px-4 py-2 text-xs md:text-sm focus:outline-none focus:border-ayur-green focus:ring-1 focus:ring-ayur-green"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="w-9 h-9 md:w-10 md:h-10 bg-ayur-green text-white rounded-full flex items-center justify-center hover:bg-green-700 shadow-sm transition"
            >
              <i className="fas fa-paper-plane text-xs md:text-sm"></i>
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button with Label */}
      <div className="flex flex-col items-center">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-ayur-green to-ayur-saffron text-white shadow-lg flex items-center justify-center text-xl md:text-2xl hover:scale-105 transition-transform"
        >
          {isOpen ? <i className="fas fa-chevron-down"></i> : <i className="fas fa-comments"></i>}
        </button>
        <span className="text-[10px] font-bold text-ayur-brown bg-white/90 px-2 py-0.5 rounded-full shadow-md mt-1 backdrop-blur-sm border border-gray-200 whitespace-nowrap">
          24*7 Support
        </span>
      </div>
    </div>
  );
};
