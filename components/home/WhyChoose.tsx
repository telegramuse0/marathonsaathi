export default function WhyChoose() {
  return (
    <section id="why-us" className="bg-white border-y border-[#E2E8F0] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">Why Marathon Saathi?</h2>
          <p className="text-[#64748B] text-lg">Everything you need to find your next race.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-[#E2E8F0]">
            <div className="w-12 h-12 bg-[#F97316]/10 text-[#F97316] rounded-xl flex items-center justify-center text-xl font-bold mb-6">
              <i className="fa-solid fa-compass"></i>
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-3">1. DISCOVER</h3>
            <p className="text-[#64748B] leading-relaxed">Find marathons across India in one centralized destination.</p>
          </div>

          <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-[#E2E8F0]">
            <div className="w-12 h-12 bg-[#F97316]/10 text-[#F97316] rounded-xl flex items-center justify-center text-xl font-bold mb-6">
              <i className="fa-solid fa-scale-balanced"></i>
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-3">2. COMPARE</h3>
            <p className="text-[#64748B] leading-relaxed">Compare event details, venues, and distances before choosing.</p>
          </div>

          <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-[#E2E8F0]">
            <div className="w-12 h-12 bg-[#F97316]/10 text-[#F97316] rounded-xl flex items-center justify-center text-xl font-bold mb-6">
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-3">3. REGISTER</h3>
            <p className="text-[#64748B] leading-relaxed">Go directly to official organizer registration portals safely.</p>
          </div>
        </div>
      </div>
    </section>
  );
}