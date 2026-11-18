'use client';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <section className="bg-white border-y border-[#E2E8F0] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#64748B]">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search marathon, city or state..." 
                className="w-full pl-11 pr-4 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all"
              />
            </div>
            <button className="bg-[#0F172A] hover:bg-slate-800 text-white font-medium px-8 py-3.5 rounded-xl transition-all shadow-sm">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}