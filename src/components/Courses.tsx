
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

// Dedicated Courses page (renders only the courses-focused sections)
export const Courses: React.FC = () => {
  type Lecture = { title: string; duration: string; youtubeId: string; notesUrl?: string; free?: boolean };
  type Chapter = { name: string; free?: boolean; lectures: Lecture[] };
  type Subject = { price: number; proff: 'first'|'second'|'final'; description: string; chapters: Chapter[] };

  const [activeProff, setActiveProff] = useState<'first'|'second'|'final'>('first');
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentSubjectName, setCurrentSubjectName] = useState('');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentProff, setCurrentProff] = useState<'first'|'second'|'final'>('first');
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [openChapters, setOpenChapters] = useState<Record<number, boolean>>({});
  const [videoTitle, setVideoTitle] = useState('');
  const [videoId, setVideoId] = useState('');

  const subjectData: Record<string, Subject> = {
    'Padarth Vigyan': {
      price: 499,
      proff: 'first',
      description: 'Fundamental principles of Ayurveda, Dravya, Guna, Karma, Samanya, Vishesha, Samavaya, etc.',
      chapters: [
        {
          name: 'Introduction to Ayurveda', free: true,
          lectures: [
            { title: 'What is Ayurveda? - Basic Introduction', duration: '25:30', youtubeId: 'dQw4w9WgXcQ', notesUrl: '', free: true },
            { title: 'History & Development of Ayurveda', duration: '32:15', youtubeId: 'dQw4w9WgXcQ', notesUrl: '' }
          ]
        },
        {
          name: 'Padartha: Definition & Classification', free: true,
          lectures: [ { title: 'Meaning of Padartha', duration: '22:10', youtubeId: 'dQw4w9WgXcQ', notesUrl: '', free: true } ]
        }
      ]
    },
    'Rachana Sharir': {
      price: 499,
      proff: 'first',
      description: 'Ayurvedic anatomy - Asthi, Sandhi, Peshi, Sira, Dhamani, Kosthanga, Marma, etc.',
      chapters: [
        { name: 'Introduction to Ayurvedic Anatomy', free: true, lectures: [ { title: 'Basic Concepts of Sharira Rachana', duration: '28:20', youtubeId: 'dQw4w9WgXcQ', notesUrl: '', free: true } ] },
        { name: 'Asthi: Bones (206 bones)', lectures: [ { title: 'Types of Bones in Ayurveda', duration: '45:10', youtubeId: 'dQw4w9WgXcQ', notesUrl: '' } ] }
      ]
    },
    // minimal set for second/final proffs
    'Dravyaguna Vigyan': { price: 599, proff: 'second', description: 'Study of medicinal plants', chapters: [] },
    'Panchakarma': { price: 699, proff: 'final', description: 'Detoxification therapies', chapters: [] }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const proff = params.get('proff');
    if (proff === 'first' || proff === 'second' || proff === 'final') setActiveProff(proff);
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSubjectModalOpen(false);
        setVideoModalOpen(false);
      }
    };
    document.addEventListener('keydown', escHandler);
    return () => document.removeEventListener('keydown', escHandler);
  }, []);

  function openSubjectModal(name: string, proff: 'first'|'second'|'final', price: number) {
    setCurrentSubjectName(name);
    setCurrentPrice(price);
    setCurrentProff(proff);
    setCurrentSubject(subjectData[name] || { price, proff, description: 'Complete course with chapter-wise videos and notes.', chapters: [ { name: 'Introduction', free: true, lectures: [ { title: 'Demo Lecture 1', duration: '25:00', youtubeId: 'dQw4w9WgXcQ', notesUrl: '', free: true } ] } ] });
    setOpenChapters({});
    setSubjectModalOpen(true);
  }

  function toggleChapter(idx: number) {
    setOpenChapters(prev => ({ ...prev, [idx]: !prev[idx] }));
  }

  function playVideo(title: string, youtubeId: string) {
    setVideoTitle(title);
    setVideoId(youtubeId);
    setVideoModalOpen(true);
  }

  function closeVideoModal() { setVideoModalOpen(false); setVideoId(''); }
  function closeSubjectModal() { setSubjectModalOpen(false); }

  function buyCurrentSubject() {
    // redirect to payment processor
    window.open(PAYMENT_LINK, '_blank');
    closeSubjectModal();
  }

  function buyProffPackage(name: string, price: number) {
    window.open(PAYMENT_LINK, '_blank');
  }

  return (
    <div>
      <style>{`\n        .page-header { padding: 60px 5% 40px; text-align: center; background: linear-gradient(rgba(245, 245, 220, 0.9), rgba(245, 245, 220, 0.9)), url('https://images.unsplash.com/photo-1542736667-069246bdbc6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'); background-size: cover; background-position: center; }\n        .page-title { font-size: 2.5rem; color: #8B4513; margin-bottom: 10px; font-weight:700 }\n        .page-subtitle { font-size: 1.1rem; color: #FF9933; max-width: 800px; margin: 0 auto; font-weight:600 }\n        h2, h3, h4 { font-weight: 700 }\n        .proff-nav { display:flex; justify-content:center; gap:20px; margin:30px 0; flex-wrap:wrap; }\n        .proff-tab { padding: 12px 30px; background:white; border:2px solid #138808; border-radius:50px; font-weight:700; cursor:pointer; transition: all .25s; color:#8B4513 }\n        .proff-tab:hover { background:#e8f5e9 }\n        .proff-tab.active { background:#138808; color:white; border-color:#138808 }\n        .proff-container { display:none; padding:0 5% 60px }\n        .proff-container.active { display:block; animation: fadeIn .5s ease }\n        @keyframes fadeIn { from { opacity:0; transform: translateY(20px) } to { opacity:1; transform: translateY(0) } }\n        .pricing-comparison { display:grid; grid-template-columns: repeat(auto-fit, minmax(300px,1fr)); gap:30px; margin:40px 0 60px }\n        .price-card { background:white; border-radius:15px; padding:35px; box-shadow:0 10px 30px rgba(0,0,0,0.08); text-align:center; border:2px solid #e9e0df }\n        .price-card.best-value { border-color:#FF9933; transform:scale(1.02) }\n        .best-badge { position:absolute; top:-15px; left:50%; transform:translateX(-50%); background:#FF9933; color:white; padding:8px 25px; border-radius:25px }\n        .price { font-size: 2.5rem; color: #FF9933; font-weight: 800 }\n        .price-card .price-period { color:#666 }\n        .price-display { font-size: 3rem; color: #FF9933; font-weight:800; margin: 20px 0 }
        /* Maroon heading and professional accents */
        .price-card h3 { color: #8B1A1A; font-weight:800; font-size:1.05rem; margin-bottom:6px }
        .price-card p { color: #8B1A1A; font-weight:700 }
        .features-list li { display:flex; align-items:center; gap:10px; color:#4a2b2b; font-weight:700; margin:8px 0 }
        .features-list li i { color:#8B1A1A }\n        .btn { padding: 12px 30px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all .25s; text-decoration: none; display: inline-block }\n        .btn-primary { background: #FF9933; color: white }\n        .btn-primary:hover { background: #e68900 }\n        .btn-secondary { background: #138808; color: white }\n        .btn-secondary:hover { background: #0c6c07 }\n        .btn-large { padding: 15px 40px; font-size: 1.1rem }\n        .subjects-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap:25px; margin-top:40px }\n        .subject-card { background:white; border-radius:15px; padding:25px; box-shadow:0 8px 20px rgba(0,0,0,0.08); border:1px solid #e8e0df; cursor:pointer; transition: all .25s }\n        .subject-card:hover { border-color:#FF9933; transform:translateY(-6px); box-shadow:0 18px 40px rgba(0,0,0,0.12) }\n        .subject-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px }\n        .subject-icon { width:50px; height:50px; background:#E8F5E9; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:1.5rem; color:#138808 }\n        .subject-price { background:#FFF3E0; color:#FF9933; padding:5px 12px; border-radius:20px; font-weight:700 }\n        .subject-desc { color:#666; margin-bottom:12px }\n        .subject-details { display:flex; justify-content:space-between; font-size:0.95rem; color:#777 }\n        .detail-item { display:flex; gap:8px; align-items:center }
        .subject-card h4 { color:#8B1A1A; font-weight:800; margin:6px 0 }
        .subject-details span { color:#8B1A1A; font-weight:700 }\n        .modal-overlay { display: ${subjectModalOpen ? 'flex' : 'none'}; position:fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.7); z-index:2000; align-items:center; justify-content:center; padding:20px }\n        .modal-content { background:white; border-radius:20px; max-width:1200px; width:100%; max-height:85vh; overflow-y:auto }\n        .modal-header { background: linear-gradient(135deg,#138808,#FF9933); color:white; padding:25px 30px; border-radius:20px 20px 0 0; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0 }\n        .modal-body { padding:30px }\n        .folder-header { background:#E8F5E9; padding:20px; display:flex; align-items:center; gap:15px; border-bottom:2px solid #138808 }\n        .chapters-container { max-height:400px; overflow-y:auto; padding:10px }\n        .chapter-folder { margin-bottom:15px; border:1px solid #e0e0e0; border-radius:10px }\n        .chapter-header { background:#F5F5DC; padding:15px 20px; display:flex; justify-content:space-between; align-items:center; cursor:pointer }\n        .lectures-container { display:none; padding:15px; background:white; border-top:1px solid #eee }\n        .lectures-container.open { display:block }\n        .lecture-item { padding:12px 15px; margin-bottom:10px; border:1px solid #e0e0e0; border-radius:8px; display:flex; justify-content:space-between; align-items:center }\n        .lecture-item.free { border-color:#E8F5E9; background:#E8F5E9 }\n        .video-modal { display: ${videoModalOpen ? 'flex' : 'none'}; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:3000; align-items:center; justify-content:center; padding:20px }\n        .video-container { width:100%; max-width:1000px; background:black; border-radius:10px; overflow:hidden }\n        .video-header { background:#222; padding:15px 20px; color:white; display:flex; justify-content:space-between; align-items:center }\n        .video-player { width:100%; aspect-ratio:16/9; background:#000 }\n      `}</style>

      <section className="page-header">
        <h1 className="page-title">BAMS Professional Courses</h1>
        <p className="page-subtitle">Choose your professional year or buy subjects individually. Each course includes chapter-wise videos, notes, and tests.</p>
      </section>

      <div className="proff-nav">
        <div className={`proff-tab ${activeProff === 'first' ? 'active' : ''}`} onClick={() => setActiveProff('first')}>First Professional</div>
        <div className={`proff-tab ${activeProff === 'second' ? 'active' : ''}`} onClick={() => setActiveProff('second')}>Second Professional</div>
        <div className={`proff-tab ${activeProff === 'final' ? 'active' : ''}`} onClick={() => setActiveProff('final')}>Final Professional</div>
      </div>

      <div className={`proff-container ${activeProff === 'first' ? 'active' : ''}`} id="first-proff">
        <div className="pricing-comparison">
          <div className="price-card">
            <h3>Subject-wise</h3>
            <p>Buy only what you need</p>
            <div className="price">₹499</div>
            <div className="price-period">per subject</div>
            <ul className="features-list">
              <li><i className="fas fa-check-circle"></i> Complete subject videos</li>
              <li><i className="fas fa-check-circle"></i> Chapter-wise notes (PDF)</li>
              <li><i className="fas fa-check-circle"></i> Self-assessment tests</li>
              <li><i className="fas fa-check-circle"></i> Email support</li>
              <li><i className="fas fa-check-circle"></i> Access for 1 year</li>
            </ul>
            <p style={{color: '#666', fontSize: '0.9rem'}}>Choose any subject below</p>
          </div>

          <div className="price-card best-value" style={{position: 'relative'}}>
            <div className="best-badge">BEST VALUE</div>
            <h3>Complete First Proff</h3>
            <p>All 5 subjects package</p>
            <div className="price">₹1,999</div>
            <div className="price-period">one-time payment</div>
            <ul className="features-list">
              <li><i className="fas fa-check-circle"></i> <strong>All 5 subjects</strong> included</li>
              <li><i className="fas fa-check-circle"></i> Complete notes package</li>
              <li><i className="fas fa-check-circle"></i> All chapter tests + Mock exams</li>
              <li><i className="fas fa-check-circle"></i> Priority WhatsApp support</li>
              <li><i className="fas fa-check-circle"></i> 2 doubt-solving calls with Dr. Ravi</li>
              <li><i className="fas fa-check-circle"></i> Personal study plan</li>
              <li><i className="fas fa-check-circle"></i> Certificate of completion</li>
            </ul>
            <button className="btn btn-primary btn-large" onClick={() => buyProffPackage('First Professional', 1999)}>
              <i className="fas fa-shopping-cart"></i> Buy Complete Package
            </button>
            <p style={{marginTop: 15, color: '#666', fontSize: '0.9rem'}}>Save ₹496 compared to buying individually</p>
          </div>
        </div>

        <h2 style={{color: '#8B4513', textAlign: 'center', marginBottom: 20}}>First Professional Subjects</h2>
        <p style={{textAlign: 'center', color:'#666', maxWidth:800, margin:'0 auto 30px'}}>Click on any subject to see detailed chapter list with FREE preview lectures</p>

        <div className="subjects-grid">
          {['Padarth Vigyan','Rachana Sharir','Kriya Sharir','Maulik Siddhant','Sanskrit'].map((name) => (
            <div className="subject-card" key={name} onClick={() => openSubjectModal(name, 'first', 499)}>
              <div className="subject-header">
                <div className="subject-icon"><i className="fas fa-atom"></i></div>
                <div className="subject-price">₹499</div>
              </div>
              <h4>{name}</h4>
              <p className="subject-desc">Fundamental course content and chapter-wise lectures.</p>
              <div className="subject-details">
                <div className="detail-item"><i className="fas fa-play-circle"></i><span>40-60 Videos</span></div>
                <div className="detail-item"><i className="fas fa-folder"></i><span>12-20 Chapters</span></div>
                <div className="detail-item"><i className="fas fa-file-pdf"></i><span>12-20 Notes Sets</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECOND and FINAL placeholders (simplified) */}
      <div className={`proff-container ${activeProff === 'second' ? 'active' : ''}`} id="second-proff">
        <div className="pricing-comparison">
          <div className="price-card">
            <h3>Subject-wise</h3>
            <p>Buy only what you need</p>
            <div className="price">₹599</div>
            <div className="price-period">per subject</div>
            <ul className="features-list">
              <li><i className="fas fa-check-circle"></i> Complete subject videos</li>
              <li><i className="fas fa-check-circle"></i> Chapter-wise notes (PDF)</li>
            </ul>
          </div>
          <div className="price-card best-value" style={{position: 'relative'}}>
            <div className="best-badge">BEST VALUE</div>
            <h3>Complete Second Proff</h3>
            <p>All 6 subjects package</p>
            <div className="price">₹2,999</div>
            <button className="btn btn-primary btn-large" onClick={() => buyProffPackage('Second Professional', 2999)}>Buy Complete Package</button>
          </div>
        </div>

        <h2 style={{color: '#8B4513', textAlign: 'center', marginBottom: 20}}>Second Professional Subjects</h2>
        <div className="subjects-grid">
          {['Dravyaguna Vigyan','Rasa Shastra & Bhaishajya Kalpana','Rog Nidan & Vikriti Vigyan','Charak Samhita (Uttarardha)','Swasthavritta & Yoga','Agada Tantra (Forensic)'].map((name) => (
            <div className="subject-card" key={name} onClick={() => openSubjectModal(name, 'second', 599)}>
              <div className="subject-header"><div className="subject-icon"><i className="fas fa-seedling"></i></div><div className="subject-price">₹599</div></div>
              <h4>{name}</h4>
              <p className="subject-desc">Course details for {name}.</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`proff-container ${activeProff === 'final' ? 'active' : ''}`} id="final-proff">
        <div className="pricing-comparison">
          <div className="price-card">
            <h3>Subject-wise</h3>
            <p>Buy only what you need</p>
            <div className="price">₹699</div>
            <div className="price-period">per subject</div>
          </div>
          <div className="price-card best-value" style={{position: 'relative'}}>
            <div className="best-badge">BEST VALUE</div>
            <h3>Complete Final Proff</h3>
            <p>All 9 subjects package</p>
            <div className="price">₹4,999</div>
            <button className="btn btn-primary btn-large" onClick={() => buyProffPackage('Final Professional', 4999)}>Buy Complete Package</button>
          </div>
        </div>

        <h2 style={{color: '#8B4513', textAlign: 'center', marginBottom: 20}}>Final Professional Subjects</h2>
        <div className="subjects-grid">
          {['Panchakarma','Prasuti Tantra & Stri Roga','Kaumarbhritya','Agad Tantra','Shalakya Tantra','Kayachikitsa','Shalya Tantra','Research Methodology & Medical Statistics','Modern Medicine'].map((name) => (
            <div className="subject-card" key={name} onClick={() => openSubjectModal(name, 'final', 699)}>
              <div className="subject-header"><div className="subject-icon"><i className="fas fa-book-medical"></i></div><div className="subject-price">₹699</div></div>
              <h4>{name}</h4>
              <p className="subject-desc">Course details for {name}.</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Modal */}
      <div className="modal-overlay" id="subjectModal" onClick={(e) => { if (e.target === e.currentTarget) closeSubjectModal(); }}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 id="modalSubjectTitle">{currentSubjectName || 'Subject Details'}</h2>
            <button className="close-modal" onClick={closeSubjectModal}>&times;</button>
          </div>
          <div className="modal-body" id="modalSubjectContent">
            {currentSubject && (
              <>
                <div style={{marginBottom: 30}}>
                  <h3 style={{color: '#8B4513', marginBottom: 10}}>{currentSubjectName}</h3>
                  <p>{currentSubject.description}</p>
                </div>

                <div className="subject-folder">
                  <div className="folder-header"><i className="fas fa-folder"></i><div><h4 style={{color: '#8B4513', margin: 0}}>{currentSubjectName} Course Content</h4><p style={{color:'#666', margin:'5px 0 0'}}>{currentSubject.chapters.length} Chapters • {currentSubject.chapters.reduce((total, ch) => total + ch.lectures.length, 0)} Lectures</p></div></div>
                  <div className="chapters-container">
                    {currentSubject.chapters.map((chapter, ci) => (
                      <div className="chapter-folder" key={ci}>
                        <div className="chapter-header" onClick={() => toggleChapter(ci)}>
                          <div className="chapter-title"><i className={`fas ${chapter.free ? 'fa-folder-open' : 'fa-folder'}`}></i><span style={{marginLeft:10}}>Chapter {ci+1}: {chapter.name}</span>{chapter.free ? <span className="preview-badge" style={{marginLeft:10}}>FREE PREVIEW</span> : null}</div>
                          <div><span className={`chapter-status ${chapter.free ? 'status-free' : 'status-locked'}`}>{chapter.free ? 'FREE' : 'LOCKED'}</span><i className="fas fa-chevron-down" style={{marginLeft:10, transform: openChapters[ci] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .25s'}}></i></div>
                        </div>
                        <div className={`lectures-container ${openChapters[ci] ? 'open' : ''}`} id={`lectures${ci}`}>
                          {chapter.lectures.map((lecture, li) => (
                            <div className={`lecture-item ${lecture.free ? 'free' : ''}`} key={li}>
                              <div className="lecture-info"><div className="lecture-number">{li+1}</div><div className="lecture-details"><div className="lecture-title">{lecture.title}</div><div className="lecture-duration">{lecture.duration}</div></div></div>
                              <div className="lecture-actions">
                                <button className={`action-btn ${lecture.free ? 'watch-btn' : 'locked-btn'}`} onClick={() => lecture.free && playVideo(lecture.title, lecture.youtubeId)} disabled={!lecture.free}><i className="fas fa-play"></i> {lecture.free ? 'Watch' : 'Locked'}</button>
                                <button className={`action-btn ${lecture.free ? 'notes-btn' : 'locked-btn'}`} onClick={() => lecture.free && window.open(lecture.notesUrl || '#', '_blank')} disabled={!lecture.free}><i className="fas fa-file-pdf"></i> Notes</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="preview-section" style={{marginTop:20}}>
                  <h3><i className="fas fa-eye"></i> Free Preview Available</h3>
                  <p>Watch the first chapter lectures for free to experience our teaching style and content quality.</p>
                  <div className="preview-grid" style={{marginTop:20}}>
                    <div className="preview-item"><h4 style={{color:'#138808', marginBottom:10}}>What You Get:</h4><ul style={{listStyle:'none', padding:0}}><li style={{marginBottom:8}}><i className="fas fa-check-circle" style={{color:'#138808'}}></i> First chapter videos (free)</li><li style={{marginBottom:8}}><i className="fas fa-check-circle" style={{color:'#138808'}}></i> Downloadable PDF notes</li><li style={{marginBottom:8}}><i className="fas fa-check-circle" style={{color:'#138808'}}></i> Sample assessment questions</li></ul></div>
                    <div className="preview-item"><h4 style={{color:'#FF9933', marginBottom:10}}>After Purchase:</h4><ul style={{listStyle:'none', padding:0}}><li style={{marginBottom:8}}><i className="fas fa-unlock" style={{color:'#FF9933'}}></i> Full course unlocked</li><li style={{marginBottom:8}}><i className="fas fa-video" style={{color:'#FF9933'}}></i> Video lectures</li></ul></div>
                  </div>
                </div>

                <div className="purchase-section" style={{marginTop:20}}>
                  <h3 style={{color:'#8B4513', marginBottom:15}}>Ready to Unlock Full Course?</h3>
                  <p style={{color:'#666', marginBottom:20}}>Get complete access to all chapters, videos, notes, and tests.</p>
                  <div className="price-display">₹{currentSubject?.price || currentPrice}</div>
                  <div style={{display:'flex', justifyContent:'center', gap:15, marginTop:30}}>
                    <button className="btn btn-primary btn-large" onClick={buyCurrentSubject}><i className="fas fa-shopping-cart"></i> Buy This Subject</button>
                    <button className="btn btn-secondary" onClick={closeSubjectModal}>Continue Preview</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <div className="video-modal" id="videoModal" onClick={(e) => { if (e.target === e.currentTarget) closeVideoModal(); }}>
        <div className="video-container">
          <div className="video-header"><h3 id="videoTitle" style={{margin:0}}>{videoTitle}</h3><button className="close-video" onClick={closeVideoModal}>&times;</button></div>
          <div className="video-player" id="videoPlayer">
            {videoId && <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>}
          </div>
        </div>
      </div>
    </div>
  );
};
