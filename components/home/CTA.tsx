export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="bg-[#0F172A] rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Ready for your next race?</h2>
          <p className="text-[#64748B] text-lg mb-8">Discover marathons across India and find the race that&apos;s right for you.</p>
          <a href="#marathons" className="inline-block bg-[#F97316] hover:bg-[#ea580c] text-white font-medium px-8 py-4 rounded-xl shadow-md transition-all text-base">
            Explore Marathons
          </a>
        </div>
      </div>
    </section>
  );
}