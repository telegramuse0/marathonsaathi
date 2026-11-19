'use client';

import Image from 'next/image';
import type { FormEvent } from 'react';
import type { Marathon, SiteTab, StoreProduct } from '@/types/site';

type Props = {
  activeTab: SiteTab;
  isDarkMode: boolean;
  handleTabChange: (tab: SiteTab) => void;
  handleAiConsult: (event: FormEvent<HTMLFormElement>) => void;
  aiPrompt: string;
  setAiPrompt: (value: string) => void;
  aiResponse: string | null;
  aiLoading: boolean;
  marathons: Marathon[];
  formatDate: (date: string) => string;
  handleInterest: (id: number) => void;
  interestedUsers: Record<number, boolean>;
  interestCounts: Record<number, number>;
  storeProducts: StoreProduct[];
  productsLoading: boolean;
  productsError: string | null;};

export default function HomeView(props: Props) {
  const {
    activeTab, isDarkMode, handleTabChange, handleAiConsult, aiPrompt, setAiPrompt, aiResponse, aiLoading, marathons, formatDate, handleInterest, interestedUsers, interestCounts, storeProducts, productsLoading, productsError,
  } = props;
  const stateCount = new Set(marathons.map((marathon) => marathon.state).filter(Boolean)).size;
  const distanceCount = new Set(marathons.map((marathon) => marathon.distance).filter(Boolean)).size;

  return (
    <>
{/* HOME TAB */}
    {activeTab === 'home' && (
      <div className="space-y-16 pb-20">
        <div className={`relative overflow-hidden pt-20 pb-16 px-6 lg:px-12 border-b transition-colors ${
          isDarkMode ? 'bg-slate-950 border-slate-900' : 'bg-slate-950 border-slate-200'
        }`}>
          {/* Atmospheric running-photo hero background with readable brand overlay */}
          <div className="absolute inset-0 bg-cover bg-center opacity-65" style={{ backgroundImage: "url('/hero-banner.png')" }} aria-hidden="true" />
          <div className="absolute inset-0 bg-slate-950/35" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/15" aria-hidden="true" />
          <div className="absolute -top-24 -right-20 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" aria-hidden="true" />
          <div className="absolute top-0 left-0 right-0 h-1.5 flex z-10" aria-hidden="true"><span className="w-1/3 bg-orange-500" /><span className="w-1/3 bg-white" /><span className="w-1/3 bg-emerald-600" /></div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6 text-center lg:text-left">
              <div className="flex items-center justify-center gap-3 lg:justify-start">
                <Image
                  src="/marathonsaathi-logo.png"
                  alt=""
                  width={76}
                  height={76}
                  priority
                  className="h-16 w-16 rounded-2xl bg-white object-contain p-1 shadow-lg shadow-black/20 sm:h-[76px] sm:w-[76px]"
                />
                <div className="text-left">
                  <p className="text-xl font-black tracking-tight text-white sm:text-2xl">Marathon<span className="text-orange-400">Saathi</span></p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/65">Har Race Ka Saathi</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-500 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
                India&apos;s Ultimate Marathon Discovery Platform
              </span>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white hero-title">
                Find, Track & Conquer Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-white">Marathon</span>
              </h1>
              <p className="max-w-xl mx-auto text-base text-white/85 sm:text-lg lg:mx-0">
                Discover verified Indian running events, check official finish times, access Kwikpic event photo galleries, and plan your race calendar effortlessly.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
                <button onClick={() => handleTabChange('events')} className="bg-orange-500 hover:bg-orange-400 text-white font-extrabold px-8 py-4 rounded-xl shadow-xl shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] pulse-cta cursor-pointer">
                  Explore Marathons
                </button>
              </div>
            </div>

                        <aside className="relative rounded-3xl border border-white/15 bg-slate-950/75 p-6 text-white shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8">
              <div className="absolute -right-2 -top-3 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-lg">Runner Hub</div>
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">Your running home base</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">A better way to find your next race.</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="text-2xl font-black">{marathons.length}</div>
                  <div className="mt-1 text-[11px] text-white/65">Race listings</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="text-2xl font-black text-orange-300">{stateCount}</div>
                  <div className="mt-1 text-[11px] text-white/65">States covered</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="text-2xl font-black text-emerald-300">{distanceCount}</div>
                  <div className="mt-1 text-[11px] text-white/65">Race formats</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="text-2xl font-black text-sky-300">{storeProducts.length}</div>
                  <div className="mt-1 text-[11px] text-white/65">Gear picks</div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => handleTabChange('events')} className="rounded-xl bg-white/10 px-3 py-3 text-left text-xs font-bold text-white transition hover:bg-white/15">Browse races <span className="float-right text-orange-300">→</span></button>
                <button type="button" onClick={() => handleTabChange('calendar')} className="rounded-xl bg-white/10 px-3 py-3 text-left text-xs font-bold text-white transition hover:bg-white/15">Race calendar <span className="float-right text-orange-300">→</span></button>
                <button type="button" onClick={() => handleTabChange('submit')} className="rounded-xl bg-white/10 px-3 py-3 text-left text-xs font-bold text-white transition hover:bg-white/15">List your event <span className="float-right text-orange-300">→</span></button>
              </div>
            </aside>
          </div>
        </div>

        {/* AI Smart Race Advisor */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="bg-gradient-to-r from-slate-900 to-[#0F172A] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="max-w-3xl space-y-4">
              <span className="bg-orange-500/20 text-orange-400 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-orange-500/30">
                AI Smart Race Advisor
              </span>
              <h3 className="text-3xl sm:text-4xl font-black">Which race fits your goal? Ask AI Coach.</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Describe your target distance, preferred month, or city, and our AI running coach will curate the ideal match instantly.
              </p>
              <form onSubmit={handleAiConsult} className="flex flex-col sm:flex-row gap-3 pt-2">
                <input 
                  type="text" 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Half Marathon in Mumbai in January..." 
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
                <button type="submit" disabled={aiLoading} className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-3.5 rounded-xl transition text-sm cursor-pointer shadow-lg">
                  {aiLoading ? 'Analyzing...' : 'Consult AI Coach'}
                </button>
              </form>
              {aiResponse && (
                <div className="bg-orange-950/90 border border-orange-500/60 p-5 rounded-2xl text-orange-100 text-sm mt-4 leading-relaxed shadow-inner">
                  <strong className="block text-orange-300 mb-1 font-black">AI Coach Recommendation:</strong>
                  {aiResponse}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Featured Marathons Section */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black">Featured Marathons</h2>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Handpicked major Indian marathons coming up soon.</p>
            </div>
            <button onClick={() => handleTabChange('events')} className="text-orange-500 hover:text-orange-600 text-sm font-bold flex items-center gap-1 cursor-pointer">
              View All Events →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marathons.slice(0, 3).map((marathon) => (
              <div key={marathon.id} className={`rounded-3xl p-6 flex flex-col justify-between border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-orange-500/50' : 'bg-white border-slate-200 shadow-sm hover:border-orange-400'
              }`}>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-orange-500/10 text-orange-500 text-xs font-bold px-3 py-1 rounded-full border border-orange-500/20">
                      {marathon.badge}
                    </span>
                    <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{marathon.city}, {marathon.state}</span>
                  </div>
                  <h3 className="text-lg font-black mb-2">{marathon.name}</h3>
                  <p className={`text-xs mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>📅 {formatDate(marathon.date)}</p>
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
                  <span className="text-xs text-blue-800 font-bold">⭐ {marathon.rating} / 5.0</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      {/* RUNNER'S STORE */}
      <section className={`max-w-7xl mx-auto px-6 lg:px-12 pb-4 space-y-8`}>
        <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-transparent to-blue-800/10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-xs font-bold text-orange-500">RUNNER&apos;S STORE</span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-black">Gear Up for Your Next Race</h2>
              <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Running essentials selected for your training and race day.</p>
            </div>
            <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Prices and availability may change at the retailer.</span>
          </div>
        </div>

        {productsLoading ? (
          <div className={`rounded-2xl border p-8 text-center text-sm ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>Loading runner gear…</div>
        ) : productsError ? (
          <div className={`rounded-2xl border p-8 text-center text-sm ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>{productsError}</div>
        ) : storeProducts.length === 0 ? (
          <div className={`rounded-2xl border p-8 text-center ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
            <div className="text-3xl mb-3">👟</div>
            <h3 className="font-bold">New running gear coming soon</h3>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Our team is adding useful running essentials. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {storeProducts.map((product) => (
              <article key={product.id} className={`overflow-hidden rounded-3xl border flex flex-col transition hover:-translate-y-1 ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-orange-500/50' : 'bg-white border-slate-200 shadow-sm hover:border-orange-400 hover:shadow-lg'}`}>
                <div className={`h-52 flex items-center justify-center p-4 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image_url} alt={product.name} loading="lazy" className="max-h-full max-w-full object-contain rounded-xl" />
                  ) : <div className="text-6xl" aria-label="No product image">🏃</div>}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="self-start rounded-full bg-orange-500/10 px-3 py-1 text-[11px] font-bold text-orange-500">{product.category}</span>
                  <h3 className="mt-3 text-lg font-black">{product.name}</h3>
                  {product.description && <p className={`mt-2 text-sm leading-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{product.description}</p>}
                  <div className="mt-auto pt-4">
                    {product.price !== null && product.price !== undefined && <p className="text-xl font-black mb-4">₹{Number(product.price).toLocaleString('en-IN')}</p>}
                    <div className="grid grid-cols-1 gap-2">
                      {product.amazon_url && <a href={product.amazon_url} target="_blank" rel="sponsored nofollow noopener noreferrer" className="rounded-xl bg-orange-600 hover:bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white transition">Buy on Amazon ↗</a>}
                      {product.flipkart_url && <a href={product.flipkart_url} target="_blank" rel="sponsored nofollow noopener noreferrer" className={`rounded-xl border px-4 py-3 text-center text-sm font-bold transition ${isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-100' : 'border-slate-300 hover:bg-slate-100 text-slate-800'}`}>Buy on Flipkart ↗</a>}
                      {!product.amazon_url && !product.flipkart_url && <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Purchase links coming soon.</p>}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        <p className={`text-xs leading-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Affiliate disclosure: Some links may be affiliate links. If you buy through them, MarathonSaathi may earn a commission at no extra cost to you.</p>
      </section>

      </div>
    )}
    </>
  );
}
