'use client';

import type { ResultLinkItem, SiteTab } from '@/types/site';

type Props = {
  activeTab: SiteTab;
  isDarkMode: boolean;
  resultsLinks: ResultLinkItem[];};

export default function ResultsView(props: Props) {
  const {
    activeTab, isDarkMode, resultsLinks,
  } = props;

  return (
    <>
{/* RESULTS & PHOTOS TAB */}
    {activeTab === 'results' && (
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className={`p-8 rounded-3xl border text-center space-y-3 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h2 className="text-2xl font-black">Race Results & Organizer Photos</h2>
          <p className={`text-xs max-w-lg mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Access official runner timing results and download high-resolution event photos (via Kwikpic and organizer links).
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {resultsLinks.map((item) => (
            <div key={item.id} className={`p-6 rounded-3xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                  Official Archive
                </span>
                <h3 className="text-lg font-black mt-2">{item.eventName}</h3>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Direct links for timing certificates and event photography galleries.</p>
              </div>

              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <a href={item.resultsUrl} target="_blank" rel="noopener noreferrer" className={`flex-1 md:flex-initial text-xs font-bold px-5 py-3 rounded-xl transition text-center border ${
                  isDarkMode ? 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                }`}>
                  Official Timing Results
                </a>
                <a href={item.photosUrl} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-initial bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-orange-600/30 transition text-center">
                  View Event Photos (Kwikpic)
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
    </>
  );
}
