import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Proff, Subject, Chapter, ContentItem, MCQ, StudentPermissions, ChatMessage } from '../types';
import { dataService } from '../services/dataService';
import { generateSathiResponse } from '../services/geminiService';

interface StudentDashboardProps {
  permissions: StudentPermissions;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ permissions }) => {
  const [courses, setCourses] = useState<Proff[]>([]);
  const [selectedProff, setSelectedProff] = useState<Proff | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [activeContent, setActiveContent] = useState<ContentItem | null>(null);
  const [viewMode, setViewMode] = useState<'content' | 'mcq'>('content');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  
  // MCQ State
  const [currentMcqIndex, setCurrentMcqIndex] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  // Sathi AI State
  const [isSathiOpen, setIsSathiOpen] = useState(false);
  const [sathiInput, setSathiInput] = useState('');
  const [sathiMessages, setSathiMessages] = useState<ChatMessage[]>([
    { id: 'sathi-welcome', role: 'model', text: "Namaste! I am **Sathi**, your personalized academic companion. Ask me about your studies, clinical doubts, or Ayurvedic treatments." }
  ]);
  const [sathiLoading, setSathiLoading] = useState(false);
  const sathiScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Get all courses data
    const allCourses = dataService.getData();
    
    // 2. Filter courses based on permissions
    const allowedCourses = allCourses.map(proff => {
      // Logic: 
      // If student has Proff permission, they get ALL subjects in that proff.
      // If student has Subject permission, they only get specific subjects.
      
      const hasProffAccess = permissions.allowedProffs.includes(proff.id);
      
      if (hasProffAccess) {
        return proff; // Return full proff
      }

      // Check specific subjects
      const allowedSubjects = proff.subjects.filter(sub => permissions.allowedSubjects.includes(sub.id));
      
      if (allowedSubjects.length > 0) {
        return { ...proff, subjects: allowedSubjects }; // Return proff with only allowed subjects
      }

      return null;
    }).filter(Boolean) as Proff[];

    setCourses(allowedCourses);
  }, [permissions]);

  useEffect(() => {
    if (sathiScrollRef.current) {
      sathiScrollRef.current.scrollTop = sathiScrollRef.current.scrollHeight;
    }
  }, [sathiMessages, isSathiOpen]);

  const handleChapterClick = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setViewMode('content');
    if (chapter.content.length > 0) {
      setActiveContent(chapter.content[0]);
    } else {
      setActiveContent(null);
    }
    // Close sidebar on mobile when chapter is selected
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (showResult) return;
    setMcqAnswers(prev => ({...prev, [currentMcqIndex]: optionIndex}));
  };

  const handleSathiSend = async () => {
    if (!sathiInput.trim() || sathiLoading) return;

    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: sathiInput
    };

    setSathiMessages(prev => [...prev, userMsg]);
    setSathiInput('');
    setSathiLoading(true);

    try {
        const history = sathiMessages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

        const responseText = await generateSathiResponse(userMsg.text, history);

        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText
        };
        setSathiMessages(prev => [...prev, aiMsg]);
    } catch (error) {
        const errorMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: "I'm having trouble connecting right now. Please try again later.",
            isError: true
        };
        setSathiMessages(prev => [...prev, errorMsg]);
    } finally {
        setSathiLoading(false);
    }
  };

  // Helper to ensure we have a clean ID for the player
  const getCleanVideoId = (url: string) => {
    if (!url) return '';
    // If it's already an ID (approx 11 chars, no slash), return it
    if (url.length === 11 && !url.includes('/')) return url;
    // Otherwise try to extract
    return dataService.extractYoutubeId(url);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-100 relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="absolute inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - Course Structure */}
      <div className={`absolute md:static top-0 left-0 h-full w-72 bg-white border-r border-gray-200 overflow-y-auto z-30 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-4 border-b bg-ayur-cream flex justify-between items-center">
          <h2 className="font-bold text-ayur-brown flex items-center gap-2">
            <i className="fas fa-book-reader"></i> My Learning
          </h2>
          <button className="md:hidden text-ayur-brown" onClick={() => setIsSidebarOpen(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Navigation Levels */}
        <div className="p-2">
          {!selectedProff ? (
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase px-3 py-2">My Courses</h3>
              {courses.length > 0 ? courses.map(proff => (
                <button 
                  key={proff.id}
                  onClick={() => setSelectedProff(proff)}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 mb-1 flex justify-between items-center group transition-colors"
                >
                  <span className="font-semibold text-gray-700 group-hover:text-ayur-green">{proff.title}</span>
                  <i className="fas fa-chevron-right text-gray-400"></i>
                </button>
              )) : (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  No courses assigned.<br/>Contact admin if this is an error.
                </div>
              )}
            </div>
          ) : !selectedSubject ? (
            <div>
              <button onClick={() => setSelectedProff(null)} className="flex items-center text-sm text-gray-500 px-3 py-2 hover:text-ayur-saffron mb-2">
                <i className="fas fa-arrow-left mr-1"></i> Back to Courses
              </button>
              <h3 className="font-bold text-ayur-brown px-3 mb-2">{selectedProff.title}</h3>
              {selectedProff.subjects.map(sub => (
                <button 
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub)}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 mb-1 border-l-4 border-transparent hover:border-ayur-green bg-white shadow-sm transition-all"
                >
                   {sub.title}
                </button>
              ))}
              {selectedProff.subjects.length === 0 && <div className="p-4 text-sm text-gray-500">No subjects available.</div>}
            </div>
          ) : (
            <div>
              <button onClick={() => setSelectedSubject(null)} className="flex items-center text-sm text-gray-500 px-3 py-2 hover:text-ayur-saffron mb-2">
                <i className="fas fa-arrow-left mr-1"></i> Back to Subjects
              </button>
              <h3 className="font-bold text-ayur-green px-3 mb-4">{selectedSubject.title}</h3>
              
              <div className="space-y-1">
                {selectedSubject.chapters.map(chap => (
                  <button
                    key={chap.id}
                    onClick={() => handleChapterClick(chap)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${selectedChapter?.id === chap.id ? 'bg-ayur-green text-white shadow-md' : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    <i className={`fas ${selectedChapter?.id === chap.id ? 'fa-folder-open' : 'fa-folder'}`}></i>
                    <span className="truncate">{chap.title}</span>
                  </button>
                ))}
              </div>
              {selectedSubject.chapters.length === 0 && <div className="p-4 text-sm text-gray-500">No chapters yet.</div>}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full relative">
        {/* Mobile Header Trigger */}
        {!isSidebarOpen && (
          <div className="md:hidden bg-white border-b p-3 flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="text-ayur-green mr-3">
              <i className="fas fa-bars text-xl"></i>
            </button>
            <span className="font-bold text-ayur-brown truncate">
              {selectedChapter ? selectedChapter.title : 'Dashboard'}
            </span>
          </div>
        )}

        {!selectedChapter ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-graduation-cap text-3xl md:text-4xl text-gray-400"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-600">Welcome to Student Dashboard</h2>
            <p className="mt-2 text-sm md:text-base">Select a course from the menu to start learning.</p>
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden mt-4 bg-ayur-green text-white px-4 py-2 rounded-full text-sm">
              Open Menu
            </button>
          </div>
        ) : (
          <>
            {/* Top Bar inside Content Area (Desktop) */}
            <div className="hidden md:flex bg-white border-b px-6 py-3 justify-between items-center shadow-sm z-10">
              <h2 className="font-bold text-lg text-gray-800">{selectedChapter.title}</h2>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode('content')}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${viewMode === 'content' ? 'bg-white text-ayur-green shadow' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <i className="fas fa-play-circle mr-2"></i>Content
                </button>
                <button 
                  onClick={() => { setViewMode('mcq'); setCurrentMcqIndex(0); setShowResult(false); setMcqAnswers({}); }}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${viewMode === 'mcq' ? 'bg-white text-ayur-green shadow' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <i className="fas fa-tasks mr-2"></i>Practice MCQs
                </button>
              </div>
            </div>

            {/* Mobile View Toggle */}
            <div className="md:hidden flex border-b bg-white">
               <button 
                  onClick={() => setViewMode('content')}
                  className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 ${viewMode === 'content' ? 'border-ayur-green text-ayur-green' : 'border-transparent text-gray-500'}`}
               >
                 Content
               </button>
               <button 
                  onClick={() => { setViewMode('mcq'); setCurrentMcqIndex(0); setShowResult(false); setMcqAnswers({}); }}
                  className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 ${viewMode === 'mcq' ? 'border-ayur-green text-ayur-green' : 'border-transparent text-gray-500'}`}
               >
                 MCQs
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
              {viewMode === 'content' ? (
                <div className="max-w-4xl mx-auto">
                   {/* Content List */}
                   {selectedChapter.content.length > 0 ? (
                     <div className="grid gap-6">
                        {/* Video Player Section */}
                        {activeContent && activeContent.type === 'video' && (
                          <div className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video relative group">
                            <iframe 
                              width="100%" 
                              height="100%" 
                              src={`https://www.youtube.com/embed/${getCleanVideoId(activeContent.url)}?rel=0&modestbranding=1&origin=${window.location.origin}`} 
                              title={activeContent.title}
                              frameBorder="0" 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowFullScreen
                            ></iframe>
                          </div>
                        )}

                        {/* Embedded PDF/Note Viewer */}
                        {activeContent && activeContent.type === 'note' && (
                          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative">
                             <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <button 
                                        onClick={() => setActiveContent(null)}
                                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-ayur-green hover:text-white transition-colors"
                                        title="Close Note"
                                    >
                                        <i className="fas fa-arrow-left"></i>
                                    </button>
                                    <h3 className="font-bold text-gray-700 truncate">{activeContent.title}</h3>
                                </div>
                                <span className="text-xs text-ayur-green bg-ayur-light-green px-2 py-1 rounded whitespace-nowrap ml-2">Protected View</span>
                             </div>
                             
                             {/* Transparent Overlay to deter right-click saves (UI protection only) */}
                             <div className="absolute inset-0 z-10 w-full h-full" onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }}></div>
                             
                             <div className="w-full h-[80vh]">
                               <iframe 
                                 src={dataService.getEmbedUrl(activeContent.url)} 
                                 className="w-full h-full border-none"
                                 title="Study Note"
                               ></iframe>
                             </div>
                          </div>
                        )}

                        {/* Content Selector / List */}
                        <div className="bg-white rounded-xl shadow-sm border p-4">
                          <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">Chapter Resources</h3>
                          <div className="grid gap-2">
                            {selectedChapter.content.map(item => (
                              <button 
                                key={item.id}
                                onClick={() => setActiveContent(item)}
                                className={`flex items-center p-3 rounded-lg border transition-all text-left ${activeContent?.id === item.id ? 'bg-ayur-light-green border-ayur-green' : 'hover:bg-gray-50 border-gray-200'}`}
                              >
                                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mr-3 ${item.type === 'video' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}`}>
                                  <i className={`fas ${item.type === 'video' ? 'fa-play' : 'fa-file-alt'}`}></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-gray-800 truncate">{item.title}</div>
                                  <div className="text-xs text-gray-500">{item.type === 'video' ? 'Video Lecture' : 'Study Notes'}</div>
                                </div>
                                {activeContent?.id === item.id && <i className="fas fa-check-circle text-ayur-green ml-2"></i>}
                              </button>
                            ))}
                          </div>
                        </div>
                     </div>
                   ) : (
                     <div className="text-center py-20 text-gray-500">
                       <i className="fas fa-folder-open text-4xl mb-3 opacity-30"></i>
                       <p>No content added to this chapter yet.</p>
                     </div>
                   )}
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  {/* MCQ Interface */}
                  {selectedChapter.mcqs.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-lg border p-4 md:p-8">
                       <div className="flex justify-between items-center mb-6">
                         <span className="text-xs md:text-sm font-bold text-gray-400">Question {currentMcqIndex + 1} of {selectedChapter.mcqs.length}</span>
                         <span className="text-xs md:text-sm bg-ayur-light-green text-ayur-green px-3 py-1 rounded-full font-bold">Score: {Object.keys(mcqAnswers).filter(idx => mcqAnswers[idx] === selectedChapter.mcqs[parseInt(idx)].correctIndex).length} / {selectedChapter.mcqs.length}</span>
                       </div>
                       
                       <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6">{selectedChapter.mcqs[currentMcqIndex].question}</h3>
                       
                       <div className="space-y-3 mb-8">
                         {selectedChapter.mcqs[currentMcqIndex].options.map((opt, idx) => {
                           const isSelected = mcqAnswers[currentMcqIndex.toString()] === idx;
                           const isCorrect = selectedChapter.mcqs[currentMcqIndex].correctIndex === idx;
                           
                           let btnClass = "border-gray-200 hover:bg-gray-50";
                           if (showResult) {
                             if (isCorrect) btnClass = "bg-green-100 border-green-500 text-green-700";
                             else if (isSelected && !isCorrect) btnClass = "bg-red-100 border-red-500 text-red-700";
                           } else if (isSelected) {
                             btnClass = "bg-ayur-light-saffron border-ayur-saffron";
                           }

                           return (
                             <button 
                               key={idx}
                               onClick={() => handleAnswerSelect(idx)}
                               className={`w-full text-left p-3 md:p-4 rounded-lg border-2 font-medium transition-all text-sm md:text-base ${btnClass}`}
                               disabled={showResult}
                             >
                               {opt}
                             </button>
                           );
                         })}
                       </div>

                       <div className="flex justify-between border-t pt-6">
                         <button 
                           onClick={() => setCurrentMcqIndex(prev => Math.max(0, prev - 1))}
                           disabled={currentMcqIndex === 0}
                           className="px-4 py-2 text-gray-500 font-bold hover:text-gray-800 disabled:opacity-50"
                         >
                           Previous
                         </button>
                         {showResult && currentMcqIndex < selectedChapter.mcqs.length - 1 ? (
                            <button 
                              onClick={() => setCurrentMcqIndex(prev => prev + 1)}
                              className="px-6 py-2 bg-ayur-green text-white rounded-lg font-bold hover:bg-green-700"
                            >
                              Next Question
                            </button>
                         ) : !showResult ? (
                           <button 
                             onClick={() => setShowResult(true)}
                             className="px-6 py-2 bg-ayur-saffron text-white rounded-lg font-bold hover:bg-orange-600"
                           >
                             Submit Quiz
                           </button>
                         ) : (
                           <div className="text-green-600 font-bold self-center">Completed!</div>
                         )}
                       </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 text-gray-500">
                      <i className="fas fa-tasks text-4xl mb-3 opacity-30"></i>
                      <p>No practice questions available.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Sathi AI Floating Widget */}
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col items-end safe-area-bottom">
            {isSathiOpen && (
                <div className="mb-3 md:mb-4 bg-white w-[85vw] md:w-96 rounded-2xl shadow-2xl border-2 border-ayur-gold overflow-hidden flex flex-col h-[60vh] md:max-h-[500px] animate-slide-up origin-bottom-right">
                    <div className="bg-gradient-to-r from-ayur-brown to-ayur-saffron p-3 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <i className="fas fa-user-md"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Sathi AI</h3>
                                <p className="text-[10px] opacity-90">Personalized Academic Assistant</p>
                            </div>
                        </div>
                        <button onClick={() => setIsSathiOpen(false)} className="text-white/80 hover:text-white"><i className="fas fa-times"></i></button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-3 bg-ayur-cream/30 min-h-[300px] scrollbar-hide" ref={sathiScrollRef}>
                        {sathiMessages.map((msg) => (
                            <div key={msg.id} className={`flex mb-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-xl text-xs md:text-sm ${msg.role === 'user' ? 'bg-ayur-green text-white rounded-br-none' : 'bg-white border text-gray-800 rounded-bl-none prose prose-sm'}`}>
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {sathiLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border p-3 rounded-xl rounded-bl-none flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-ayur-brown rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-ayur-brown rounded-full animate-bounce delay-100"></div>
                                    <div className="w-1.5 h-1.5 bg-ayur-brown rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-white border-t">
                        <div className="flex gap-2">
                            <input 
                                className="flex-1 border rounded-full px-3 py-2 text-xs md:text-sm focus:outline-none focus:border-ayur-green"
                                placeholder="Ask about Nidan, Chikitsa or Studies..."
                                value={sathiInput}
                                onChange={(e) => setSathiInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSathiSend()}
                            />
                            <button 
                                onClick={handleSathiSend}
                                disabled={sathiLoading}
                                className="w-9 h-9 bg-ayur-green text-white rounded-full flex items-center justify-center hover:bg-green-700 disabled:opacity-50"
                            >
                                <i className="fas fa-paper-plane text-xs"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="flex flex-col items-center">
                <button 
                    onClick={() => setIsSathiOpen(!isSathiOpen)}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg flex items-center justify-center text-xl md:text-2xl transition-all transform hover:scale-105 ${isSathiOpen ? 'bg-gray-700 text-white rotate-45' : 'bg-gradient-to-r from-ayur-gold to-ayur-saffron text-white animate-bounce-slow'}`}
                >
                    {isSathiOpen ? <i className="fas fa-plus"></i> : <i className="fas fa-comment-medical"></i>}
                </button>
                <span className="text-[10px] font-bold text-ayur-brown bg-white/90 px-2 py-0.5 rounded-full shadow-md mt-1 backdrop-blur-sm border border-gray-200 whitespace-nowrap">
                  Sathi AI
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};