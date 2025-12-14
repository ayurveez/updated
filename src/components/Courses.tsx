
import React, { useState, useEffect } from 'react';
import { ViewState, PAYMENT_LINK } from '../types';
import { dataService } from '../services/dataService';

interface HomeProps {
  setView: (view: ViewState) => void;
}

export const Home: React.FC<HomeProps> = ({ setView }) => {
  const [liveStatus, setLiveStatus] = useState<Record<string, boolean>>({
    'first-proff': true,
    'second-proff': false,
    'third-proff': false
  });

  useEffect(() => {
    // Fetch live status from data service
    const data = dataService.getData();
    const statusMap: Record<string, boolean> = {};
    data.forEach(proff => {
      statusMap[proff.id] = proff.isLive;
    });
    setLiveStatus(prev => ({ ...prev, ...statusMap }));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-4 py-20 bg-cover bg-center" 
               style={{backgroundImage: `linear-gradient(rgba(245, 245, 220, 0.9), rgba(245, 245, 220, 0.9)), url('https://images.unsplash.com/photo-1542736667-069246bdbc6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`}}>
        <h2 className="text-4xl md:text-6xl font-bold text-ayur-brown mb-4">
          Welcome to <span className="text-ayur-green">AYURVEEZ</span>
        </h2>
        <div className="text-2xl text-ayur-saffron font-semibold mb-6">BAMS Classes Made Easy</div>
        <p className="max-w-2xl text-lg text-gray-700 mb-8 leading-relaxed">
          Master Ayurvedic Medicine with India's first AI-powered learning platform. 
          Created by Dr. Ravi Shankar Sharma for BAMS students worldwide.
        </p>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto px-4">
          <button 
            onClick={() => setView(ViewState.COURSES)}
            className="bg-gradient-to-r from-ayur-saffron to-orange-500 text-white px-8 py-4 rounded-lg text-lg font-bold shadow-lg hover:-translate-y-1 transition-transform flex items-center justify-center gap-3 w-full md:w-auto"
          >
            <i className="fas fa-graduation-cap"></i> Explore Courses
          </button>
          <button 
            onClick={() => setView(ViewState.LOGIN)}
            className="bg-white text-ayur-green border-2 border-ayur-green px-8 py-4 rounded-lg text-lg font-bold shadow-lg hover:-translate-y-1 transition-transform flex items-center justify-center gap-3 w-full md:w-auto"
          >
            <i className="fas fa-sign-in-alt"></i> Access Course
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 md:px-12 bg-white">
        <div className="text-center mb-12 relative">
          <h2 className="text-3xl font-bold text-ayur-brown inline-block relative pb-4">
            Why Choose AYURVEEZ?
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-ayur-saffron rounded-full"></span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            { icon: 'fa-video', title: 'Chapter-wise Videos', desc: 'High-quality video lectures for each chapter.' },
            { icon: 'fa-file-pdf', title: 'Digital Notes', desc: 'Comprehensive notes with diagrams (PDF).' },
            { icon: 'fa-question-circle', title: 'Chapter Tests', desc: 'Self-assessment tests to track progress.' },
            { icon: 'fa-robot', title: '24/7 AI Support', desc: 'Ayurveez AI for instant doubt solving.' },
            { icon: 'fa-rupee-sign', title: 'Flexible Payment', desc: 'Pay per subject or complete proff.' },
            { icon: 'fa-headset', title: 'Personal Mentorship', desc: 'Direct doubt solving calls with Dr. Ravi.' },
          ].map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-ayur-green hover:-translate-y-2 transition-transform text-center group">
              <div className="text-4xl text-ayur-saffron mb-4 group-hover:scale-110 transition-transform">
                <i className={`fas ${f.icon}`}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses Preview Section */}
      <section className="py-16 px-4 md:px-12 bg-ayur-cream/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-ayur-brown mb-4">BAMS Courses Structure</h2>
          <div className="w-20 h-1 bg-ayur-saffron mx-auto rounded mb-8"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* First Proff */}
          <div className="bg-white rounded-xl overflow-hidden border-2 border-ayur-green hover:shadow-xl transition-all cursor-pointer flex flex-col h-full" onClick={() => setView(ViewState.COURSES)}>
            <div className="bg-ayur-green text-white p-5 text-center">
              <h3 className="text-xl font-bold">FIRST PROFESSIONAL</h3>
              <p className="text-sm opacity-90">18 Months Duration</p>
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between">
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2"><i className="fas fa-book-medical text-ayur-saffron"></i> Padarth Vigyan</li>
                <li className="flex items-center gap-2"><i className="fas fa-bone text-ayur-saffron"></i> Rachana Sharir</li>
                <li className="flex items-center gap-2"><i className="fas fa-brain text-ayur-saffron"></i> Kriya Sharir</li>
                <li className="flex items-center gap-2"><i className="fas fa-book text-ayur-saffron"></i> Maulik Siddhant</li>
              </ul>
              <div className="text-center">
                <span className="block text-2xl font-bold text-ayur-brown mb-3">₹1,999</span>
                <button className="w-full py-2 bg-ayur-saffron text-white rounded font-semibold">View Details</button>
              </div>
            </div>
          </div>

          {/* Second Proff */}
          <div className="bg-white rounded-xl overflow-hidden border-2 border-gray-300 relative flex flex-col h-full" onClick={() => setView(ViewState.COURSES)}>
             {/* Mobile-Friendly Overlay */}
            {!liveStatus['second-proff'] && (
              <div className="absolute inset-0 bg-white/40 z-20 flex items-center justify-center">
                  <div className="bg-ayur-saffron text-white px-6 py-2 rounded-full font-bold shadow-lg transform -rotate-12 border-2 border-white">
                      Coming Soon
                  </div>
              </div>
            )}
            <div className="bg-gray-700 text-white p-5 text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-white/10 opacity-50"></div>
               <h3 className="text-xl font-bold relative z-10">SECOND PROFESSIONAL</h3>
               <p className="text-sm opacity-90 relative z-10">18 Months Duration</p>
            </div>
            <div className={`p-6 flex flex-col flex-1 justify-between ${!liveStatus['second-proff'] ? 'opacity-60 filter blur-[1px]' : ''}`}>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2"><i className="fas fa-prescription-bottle text-gray-400"></i> Dravyaguna</li>
                <li className="flex items-center gap-2"><i className="fas fa-mortar-pestle text-gray-400"></i> Rasa Shastra</li>
                <li className="flex items-center gap-2"><i className="fas fa-stethoscope text-gray-400"></i> Rog Nidan</li>
                <li className="flex items-center gap-2"><i className="fas fa-scroll text-gray-400"></i> Charak Samhita</li>
              </ul>
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-500 mb-3">₹2,999</span>
                <button className={`w-full py-2 rounded font-semibold ${!liveStatus['second-proff'] ? 'bg-gray-500 text-white cursor-default' : 'bg-ayur-saffron text-white cursor-pointer'}`}>
                  {liveStatus['second-proff'] ? 'View Details' : 'Coming Soon'}
                </button>
              </div>
            </div>
          </div>

          {/* Third Proff */}
          <div className="bg-white rounded-xl overflow-hidden border-2 border-gray-300 relative flex flex-col h-full" onClick={() => setView(ViewState.COURSES)}>
            {/* Mobile-Friendly Overlay */}
            {!liveStatus['third-proff'] && (
              <div className="absolute inset-0 bg-white/40 z-20 flex items-center justify-center">
                  <div className="bg-ayur-saffron text-white px-6 py-2 rounded-full font-bold shadow-lg transform -rotate-12 border-2 border-white">
                      Coming Soon
                  </div>
              </div>
            )}
            <div className="bg-gray-700 text-white p-5 text-center relative">
              <h3 className="text-xl font-bold relative z-10">THIRD PROFESSIONAL</h3>
              <p className="text-sm opacity-90 relative z-10">18 Months Duration</p>
            </div>
            <div className={`p-6 flex flex-col flex-1 justify-between ${!liveStatus['third-proff'] ? 'opacity-60 filter blur-[1px]' : ''}`}>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2"><i className="fas fa-spa text-gray-400"></i> Panchakarma</li>
                <li className="flex items-center gap-2"><i className="fas fa-baby text-gray-400"></i> Kaumarbhritya</li>
                <li className="flex items-center gap-2"><i className="fas fa-eye text-gray-400"></i> Shalakya Tantra</li>
                <li className="flex items-center gap-2"><i className="fas fa-user-md text-gray-400"></i> Kayachikitsa</li>
              </ul>
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-500 mb-3">₹4,999</span>
                <button className={`w-full py-2 rounded font-semibold ${!liveStatus['third-proff'] ? 'bg-gray-500 text-white cursor-default' : 'bg-ayur-saffron text-white cursor-pointer'}`}>
                  {liveStatus['third-proff'] ? 'View Details' : 'Coming Soon'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Teaser */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#e8f5e9] to-[#fff3e0] text-center">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl border-4 border-ayur-gold/30">
          <div className="w-24 h-24 bg-gradient-to-br from-ayur-saffron to-ayur-gold rounded-full flex items-center justify-center text-4xl text-white mx-auto mb-6 shadow-lg">
            <i className="fas fa-robot"></i>
          </div>
          <h2 className="text-3xl font-bold text-ayur-brown mb-4">Meet Ayurveez AI</h2>
          <p className="text-lg text-gray-700 mb-8">
            Your 24/7 Ayurveda study assistant. Get personalized study plans, 
            exam preparation strategies, and instant answers to clinical queries.
          </p>
          <button 
            onClick={() => setView(ViewState.AI_CHAT)}
            className="bg-ayur-green text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-green-700 transition-colors"
          >
            Start Chatting Now
          </button>
        </div>
      </section>
      
      {/* Enrollment Info */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto bg-ayur-cream p-8 md:p-12 rounded-2xl border-2 border-ayur-green/30">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-ayur-brown mb-10">How to Enroll</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
             {[
               { num: 1, title: 'Choose Course', desc: 'Select Proff or Subject' },
               { num: 2, title: 'Make Payment', desc: 'Use the Secure Link' },
               { num: 3, title: 'Send Screenshot', desc: 'WhatsApp: 9376884568' },
               { num: 4, title: 'Get Access', desc: 'Unique dashboard code' },
             ].map((step) => (
               <div key={step.num}>
                 <div className="w-14 h-14 bg-ayur-saffron text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                   {step.num}
                 </div>
                 <h4 className="font-bold text-lg mb-1">{step.title}</h4>
                 <p className="text-sm text-gray-600">{step.desc}</p>
               </div>
             ))}
          </div>
          <div className="mt-10 text-center">
             <div className="bg-white inline-block p-4 rounded-lg border border-gray-200 text-left font-mono text-sm shadow-inner overflow-x-auto max-w-full">
               <p><strong>WhatsApp Payment Message Format:</strong></p>
               <p>Name: [Your Full Name]</p>
               <p>Course: [Proff/Subject Name]</p>
               <p>Amount: ₹[Amount Paid]</p>
               <p>Transaction ID: [Last 4 digits]</p>
             </div>
             <div className="mt-6">
                <p className="mb-2 text-gray-700 text-sm">Or Pay via UPI ID: <strong>thersk@axl</strong></p>
                <a 
                  href={PAYMENT_LINK} 
                  target="_blank" 
                  className="bg-ayur-green text-white px-8 py-3 rounded-full font-bold shadow hover:bg-green-700 transition-colors inline-block text-lg"
                >
                  Pay via Secure Link
                </a>
             </div>
          </div>
        </div>
      </section>
    </>
  );
};

export const Courses = Home;
