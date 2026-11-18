import { Marathon } from '@/types';

export default function EventCard({ marathon }: { marathon: Marathon }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all flex flex-col group">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img 
          src={marathon.image} 
          alt={marathon.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#0F172A] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {marathon.distance}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-[#F97316] transition-colors">{marathon.name}</h3>
        <div className="space-y-2 text-sm text-[#64748B] mb-6 flex-grow">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-calendar text-[#F97316] w-4"></i>
            <span>{marathon.date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-location-dot text-[#F97316] w-4"></i>
            <span>{marathon.city}, {marathon.state}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 pt-4 border-t border-[#E2E8F0] mt-auto">
          <a href={marathon.registrationUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2.5 px-4 border border-[#F97316] text-[#F97316] hover:bg-[#F97316]/5 font-medium rounded-lg text-sm transition-all">Details</a>
          <a href={marathon.registrationUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2.5 px-4 bg-[#F97316] hover:bg-[#ea580c] text-white font-medium rounded-lg text-sm transition-all">Register →</a>
        </div>
      </div>
    </div>
  );
}