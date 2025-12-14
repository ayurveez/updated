import React, { useState } from 'react';
import { generateWellnessAdvice, isAiConfigured, checkAiServer } from '../services/geminiService';
import { useEffect, useState } from 'react';

export const Wellness: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    checkAiServer().then(ok => { if (mounted) setAiAvailable(ok); });
    return () => { mounted = false; };
  }, []);

  const topics = [
    { id: 'exam-pressure', icon: 'fa-book-open', label: 'Exam Pressure' },
    { id: 'anxiety', icon: 'fa-wind', label: 'General Anxiety' },
    { id: 'focus', icon: 'fa-brain', label: 'Improving Focus' },
    { id: 'sleep', icon: 'fa-bed', label: 'Sleep Issues' },
  ];

  const handleTopicClick = async (topic: string) => {
    setActiveTopic(topic);
    setLoading(true);
    setAdvice(null);
    try {
      const result = await generateWellnessAdvice(topic);
      setAdvice(result);
    } catch (err) {
      setAdvice("Unable to retrieve wellness advice at this moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-ayur-brown mb-4">Wellness & Exam Success</h2>
        <p className="max-w-2xl mx-auto text-gray-600">
          BAMS is demanding. Use ancient wisdom to manage modern stress. Select a concern below to get Ayurvedic solutions.
        </p>
        {aiAvailable === false && (
          <div className="mt-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded">
            AI is not available on the server. Set `GEMINI_API_KEY` in Vercel project settings.
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => aiAvailable !== false && handleTopicClick(t.label)}
            disabled={aiAvailable === false}
            className={`p-4 rounded-xl shadow-md transition-all flex flex-col items-center gap-3 border-2 ${
              activeTopic === t.label 
                ? 'bg-ayur-saffron text-white border-ayur-saffron transform scale-105' 
                : 'bg-white text-gray-700 border-transparent hover:border-ayur-saffron'
            } ${aiAvailable === false ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <i className={`fas ${t.icon} text-2xl`}></i>
            <span className="font-semibold">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[300px] border border-gray-100">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full py-12 text-ayur-green">
             <i className="fas fa-leaf fa-spin text-3xl mb-4"></i>
             <p>Brewing Ayurvedic wisdom...</p>
          </div>
        )}
        
        {!loading && !advice && (
          <div className="text-center text-gray-400 py-12">
            <i className="fas fa-heart text-4xl mb-4 text-gray-300"></i>
            <p>Select a topic above to receive personalized guidance.</p>
          </div>
        )}

        {!loading && advice && (
          <div className="animation-fade-in">
            <h3 className="text-xl font-bold text-ayur-brown mb-4 border-b pb-2">
              Guidance for {activeTopic}
            </h3>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {advice}
            </div>
            <div className="mt-8 bg-ayur-cream p-4 rounded-lg border border-ayur-gold/30">
              <h4 className="font-bold text-ayur-brown mb-2"><i className="fas fa-star text-ayur-saffron"></i> Ayurveez Recommendation</h4>
              <p className="text-sm">
                Consistent practice reduces anxiety. Check out our 
                <span className="font-bold text-ayur-green"> Exam Series Lectures</span> and 
                <span className="font-bold text-ayur-green"> Practice MCQs</span> to build confidence before the big day.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
