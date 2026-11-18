'use client';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F0] via-white to-[#FDFBF7] py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content Area */}
          <div className="lg:col-span-6 space-y-6 z-10 text-left">
            
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-900 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase border border-orange-200">
              <span>⚡</span> INDIA&apos;S MARATHON DISCOVERY PLATFORM
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#0F172A] tracking-tight leading-[1.05]">
              FIND YOUR <br />
              <span className="text-[#FF6600] drop-shadow-sm">NEXT MARATHON</span>
            </h1>

            <p className="text-base sm:text-lg font-medium text-slate-600 max-w-lg leading-relaxed">
              Discover upcoming marathons across India. Search races, compare events, explore details and register—all in one place.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#events" 
                className="bg-[#FF6600] hover:bg-[#e05700] text-white font-black px-8 py-4 rounded-xl shadow-xl shadow-orange-600/35 transition flex items-center gap-2.5 text-sm tracking-wide"
              >
                <i className="fa-solid fa-person-running text-lg"></i>
                <span>EXPLORE EVENTS</span>
              </a>
              <a 
                href="#ai-coach" 
                className="bg-white hover:bg-slate-50 text-slate-800 font-bold px-8 py-4 rounded-xl border-2 border-slate-200 transition flex items-center gap-2.5 text-sm shadow-sm"
              >
                <i className="fa-solid fa-circle-info text-[#FF6600]"></i>
                <span>LEARN MORE</span>
              </a>
            </div>

          </div>

          {/* Right Hero Image (hero-banner.png) */}
          <div className="lg:col-span-6 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/20 to-amber-500/20 rounded-[36px] blur-2xl -z-10"></div>
            <div className="relative w-full aspect-[16/10] rounded-[28px] overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
              <Image 
                src="/hero-banner.png" 
                alt="Marathon Saathi Runners Banner" 
                fill 
                className="object-cover" 
                priority
              />
            </div>
          </div>

        </div>

        {/* Stats Bar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/60 border border-slate-100">
          <div className="flex items-center gap-4 p-3 border-b sm:border-b-0 sm:border-r border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF6600] flex items-center justify-center text-xl font-black">
              📅
            </div>
            <div>
              <div className="text-2xl font-black text-[#0F172A]">500+</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Events Listed</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 border-b sm:border-b-0 sm:border-r border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF6600] flex items-center justify-center text-xl font-black">
              📍
            </div>
            <div>
              <div className="text-2xl font-black text-[#0F172A]">25+</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">States Covered</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF6600] flex items-center justify-center text-xl font-black">
              👥
            </div>
            <div>
              <div className="text-2xl font-black text-[#0F172A]">10K+</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Runners</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
