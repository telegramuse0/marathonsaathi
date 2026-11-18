'use client';

import React, { useState } from 'react';

export default function AICoach() {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAiAdvice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiRecommendation(null);
    setTimeout(() => {
      setAiLoading(false);
      setAiRecommendation(`AI Coach Analysis for "${aiPrompt}": Based on your running goals, we recommend targeting the JBG Kolkata Marathon or Tata Mumbai Marathon for optimal pacing and course layout.`);
    }, 1000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
      <div className="bg-[#0F172A] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-orange-500/30">
            AI Smart Race Advisor
          </div>
          <h3 className="text-3xl sm:text-4xl font-black">Not sure which race matches your current endurance?</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Describe your target distance, preferred month, or city, and our AI running coach will curate the ideal match instantly.
          </p>

          <form onSubmit={handleAiAdvice} className="flex flex-col sm:flex-row gap-3 pt-2">
            <input 
              type="text" 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. I want a flat half marathon in December near Mumbai..." 
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5500]"
            />
            <button type="submit" disabled={aiLoading} className="bg-[#FF5500] hover:bg-[#e04c00] text-white font-black px-6 py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg">
              {aiLoading ? <span>Analyzing...</span> : <span>Consult AI Coach</span>}
            </button>
          </form>

          {aiRecommendation && (
            <div className="bg-orange-950/90 border border-orange-500/60 p-5 rounded-2xl text-orange-100 text-sm mt-4 leading-relaxed shadow-inner">
              <strong className="block text-orange-300 mb-1 font-black">AI Coach Recommendations:</strong>
              {aiRecommendation}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}