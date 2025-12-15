import React, { useState } from 'react';
import { ViewState, PAYMENT_LINK, SUPPORT_LINK } from '../types';
import { FloatingFAQ } from './FloatingFAQ';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, isAdmin, setIsAdmin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', view: ViewState.HOME },
    { label: 'Courses', view: ViewState.COURSES },
    { label: 'Ayurveez AI', view: ViewState.AI_CHAT },
    { label: 'Study Scheduler', view: ViewState.SCHEDULER },
    { label: 'Wellness Zone', view: ViewState.WELLNESS },
  ];

  const handleLogout = () => {
    setIsAdmin(false);
    setView(ViewState.HOME);
  };

  const showFloatingChat = currentView !== ViewState.STUDENT_DASHBOARD && currentView !== ViewState.ADMIN_DASHBOARD;

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-ayur-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm px-4 py-3 md:px-8 flex justify-between items-center border-b-2 border-ayur-green/20">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => setView(ViewState.HOME)}
        >
          <div className="w-12 h-12 flex items-center justify-center">
            {/* Build a safe logo URL from BASE_URL so GH Pages and root deployments both work */}
            <img
              src={`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/logo.jpg`}
              alt="Ayurveez"
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ayur-green tracking-wide">AYURVEEZ</h1>
            <span className="text-xs text-ayur-saffron font-medium block">Where Ayurveda Meets Modern Learning</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setView(item.view)}
              className={`text-sm font-medium transition-colors hover:text-ayur-saffron relative group ${currentView === item.view ? 'text-ayur-saffron' : 'text-ayur-brown'}`}
            >
              {item.label}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-ayur-saffron transition-all duration-300 ${currentView === item.view ? 'width-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
          ))}
          
          {/* Access Course / Dashboard Button */}
          {currentView === ViewState.STUDENT_DASHBOARD ? (
            <button 
               onClick={() => setView(ViewState.HOME)}
               className="bg-ayur-brown text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-orange-900"
            >
               Log Out
            </button>
          ) : currentView === ViewState.ADMIN_DASHBOARD ? (
            <button 
               onClick={handleLogout}
               className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-red-700"
            >
               Exit Admin
            </button>
          ) : (
            <button
              onClick={() => setView(ViewState.LOGIN)}
              className="bg-white border-2 border-ayur-green text-ayur-green px-4 py-2 rounded-md font-semibold hover:bg-ayur-light-green transition-colors text-sm"
            >
              Access Course
            </button>
          )}

          <a 
            href={PAYMENT_LINK} 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-ayur-saffron to-orange-500 text-white px-5 py-2 rounded-md font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm"
          >
            Enroll Now
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-ayur-brown text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </header>

      {/* Mobile Nav Drawer */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-20 px-6">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setView(item.view);
                  setIsMenuOpen(false);
                }}
                className={`text-lg font-medium text-left py-3 border-b border-gray-100 ${currentView === item.view ? 'text-ayur-saffron' : 'text-ayur-brown'}`}
              >
                {item.label}
              </button>
            ))}
            <button
               onClick={() => { setView(ViewState.LOGIN); setIsMenuOpen(false); }}
               className="mt-2 w-full bg-white border-2 border-ayur-green text-ayur-green py-3 rounded text-center font-bold"
            >
               Access Course
            </button>
            <a 
              href={PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 bg-ayur-saffron text-white py-3 rounded text-center font-bold"
            >
              Enroll Now
            </a>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Floating FAQ - Only on non-dashboard pages */}
      {showFloatingChat && <FloatingFAQ />}

      {/* Footer (Hide on Dashboard to maximize space) */}
      {(currentView !== ViewState.STUDENT_DASHBOARD && currentView !== ViewState.ADMIN_DASHBOARD) && (
        <footer className="bg-ayur-brown text-white pt-12 pb-6 px-4 md:px-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Brand */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-ayur-gold mb-2">AYURVEEZ</h2>
              <p className="text-sm opacity-90 mb-4">Where Ayurveda Meets Modern Learning</p>
              <div className="text-sm opacity-80 leading-relaxed mb-4">
                <p className="mb-1">Created by Dr. Ravi Shankar Sharma</p>
                <p className="mb-2">BAMS 2nd Prof, Uttarakhand Ayurveda University</p>
                <a 
                  href="https://www.instagram.com/drshankar.ravi/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-ayur-gold hover:text-white transition-colors text-xs inline-flex items-center gap-1"
                >
                  <i className="fab fa-instagram"></i> Follow Founder
                </a>
              </div>
              <div className="flex justify-center md:justify-start gap-4 text-lg mt-4">
                <a href="https://wa.me/9376884568" target="_blank" rel="noopener noreferrer" className="hover:text-ayur-saffron transition-colors"><i className="fab fa-whatsapp"></i></a>
                <a href="https://t.me/ayurveez" target="_blank" rel="noopener noreferrer" className="hover:text-ayur-saffron transition-colors"><i className="fab fa-telegram"></i></a>
                <a href="https://www.instagram.com/ayurveez_bams/" target="_blank" rel="noopener noreferrer" className="hover:text-ayur-saffron transition-colors"><i className="fab fa-instagram"></i></a>
                <a href="https://www.youtube.com/@ayurveez" target="_blank" rel="noopener noreferrer" className="hover:text-ayur-saffron transition-colors"><i className="fab fa-youtube"></i></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h4 className="text-ayur-gold font-semibold text-lg mb-4 relative inline-block">
                Quick Links
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-ayur-saffron"></span>
              </h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li><button onClick={() => setView(ViewState.COURSES)} className="hover:text-ayur-saffron transition">Courses</button></li>
                <li><button onClick={() => setView(ViewState.AI_CHAT)} className="hover:text-ayur-saffron transition">Ayurveez AI</button></li>
                <li><button onClick={() => setView(ViewState.SCHEDULER)} className="hover:text-ayur-saffron transition">Study Planner</button></li>
                <li><button onClick={() => setView(ViewState.WELLNESS)} className="hover:text-ayur-saffron transition">Stress Management</button></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="text-center md:text-left">
              <h4 className="text-ayur-gold font-semibold text-lg mb-4 relative inline-block">
                Contact Us
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-ayur-saffron"></span>
              </h4>
              <ul className="space-y-3 text-sm opacity-90 mb-6">
                <li className="flex items-center justify-center md:justify-start gap-3">
                  <i className="fas fa-phone text-ayur-saffron"></i> 9376884568
                </li>
                <li className="flex items-center justify-center md:justify-start gap-3">
                  <i className="fas fa-envelope text-ayur-saffron"></i> ayurveez@gmail.com
                </li>
                <li className="flex items-center justify-center md:justify-start gap-3">
                  <i className="fas fa-map-marker-alt text-ayur-saffron"></i> Dehradun, Uttarakhand
                </li>
              </ul>
              <div className="flex gap-2 justify-center md:justify-start">
                 <a 
                   href={SUPPORT_LINK}
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-block bg-ayur-saffron hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors"
                 >
                   <i className="fas fa-headset mr-2"></i> Get Support
                 </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs opacity-60">
            © 2024 AYURVEEZ. All rights reserved. | BAMS Classes Made Easy
          </div>
        </footer>
      )}
    </div>
  );
};