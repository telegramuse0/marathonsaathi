'use client';

import type { Marathon, SiteTab } from '@/types/site';

type Props = {
  activeTab: SiteTab;
  isDarkMode: boolean;
  marathons: Marathon[];
  handleInterest: (id: number) => void;
  interestedUsers: Record<number, boolean>;};

export default function CalendarView(props: Props) {
  const {
    activeTab, isDarkMode, marathons, handleInterest, interestedUsers,
  } = props;

  return (
    <>
{/* CALENDAR TAB */}
    {activeTab === 'calendar' && (
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className={`p-8 rounded-3xl border text-center space-y-3 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h2 className="text-2xl font-black">Pan-India Race Calendar 2026-2027</h2>
          <p className={`text-xs max-w-lg mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Plan your running season ahead with verified upcoming marathon dates and locations across India.</p>
        </div>

        <div className="space-y-4">
          {marathons.map((m) => (
            <div key={m.id} className={`p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition ${
              isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-orange-500/40' : 'bg-white border-slate-200 shadow-sm hover:border-orange-400'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-500/10 text-orange-500 text-[10px] font-bold px-2.5 py-0.5 rounded-md">{m.date}</span>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{m.city}, {m.state}</span>
                </div>
                <h4 className="text-base font-black">{m.name}</h4>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Categories: {m.distance} • By {m.organizer}</p>
              </div>
              <button onClick={() => handleInterest(m.id)} className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition whitespace-nowrap cursor-pointer shadow-md">
                {interestedUsers[m.id] ? 'Marked Interested' : 'Mark Interested'}
              </button>
            </div>
          ))}
        </div>
      </div>
    )}
    </>
  );
}
