'use client';

import type { Marathon, SiteTab } from '@/types/site';

type Props = {
  activeTab: SiteTab;
  isDarkMode: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  selectedDistance: string;
  setSelectedDistance: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  filteredMarathons: Marathon[];
  handleInterest: (id: number) => void;
  interestedUsers: Record<number, boolean>;
  interestCounts: Record<number, number>;};

export default function EventsView(props: Props) {
  const {
    activeTab, isDarkMode, searchQuery, setSearchQuery, selectedCity, setSelectedCity, selectedDistance, setSelectedDistance, sortBy, setSortBy, filteredMarathons, handleInterest, interestedUsers, interestCounts,
  } = props;

  return (
    <>
{/* EVENTS TAB */}
    {activeTab === 'events' && (
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-8">
        <div className={`p-6 rounded-3xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <h2 className="text-2xl font-black">Browse Marathons & Races</h2>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Search through verified marathons across India.</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search city or marathon..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-orange-500 flex-grow md:w-64 ${
                isDarkMode ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            <select 
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className={`px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-orange-500 ${
                isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="All">All Cities</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Mumbai">Mumbai</option>
              <option value="New Delhi">New Delhi</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Vasco da Gama">Goa</option>
            </select>
            <select
  value={selectedDistance}
  onChange={(e) => setSelectedDistance(e.target.value)}
  className={`px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-orange-500 ${
    isDarkMode
      ? 'bg-slate-950 border-slate-800 text-white'
      : 'bg-slate-50 border-slate-300 text-slate-900'
  }`}
>
  <option value="All">All Distances</option>
  <option value="5K">5K</option>
  <option value="10K">10K</option>
  <option value="Half">Half Marathon</option>
  <option value="Full">Full Marathon</option>
</select>
<select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className={`px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-orange-500 ${
    isDarkMode
      ? 'bg-slate-950 border-slate-800 text-white'
      : 'bg-slate-50 border-slate-300 text-slate-900'
  }`}
>
  <option value="upcoming">Upcoming First</option>
  <option value="latest">Latest First</option>
  <option value="popular">Top Rated</option>
</select>
        
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarathons.map((marathon) => (
            <div key={marathon.id} className={`rounded-3xl p-6 flex flex-col justify-between border transition ${
              isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-orange-500/50' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-orange-500/10 text-orange-500 text-xs font-bold px-3 py-1 rounded-full border border-orange-500/20">
                    {marathon.badge}
                  </span>
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{marathon.city}</span>
                </div>
                <h3 className="text-lg font-black mb-2">{marathon.name}</h3>
                <p className={`text-xs mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Date: {marathon.date}</p>
                <p className={`text-xs mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Distance: {marathon.distance}</p>
                <div className={`text-xs font-medium px-3 py-2 rounded-xl border mb-4 ${
                  isDarkMode ? 'bg-slate-950/50 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  Organizer: <span className="font-bold">{marathon.organizer}</span>
                </div>
              </div>

              <div className={`pt-4 border-t flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <button 
                  onClick={() => handleInterest(marathon.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    interestedUsers[marathon.id] ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {interestedUsers[marathon.id] ? 'Liked' : 'Like'} ({interestCounts[marathon.id]})
                </button>
                <span className="text-xs text-blue-800 font-bold">⭐ {marathon.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
    </>
  );
}
