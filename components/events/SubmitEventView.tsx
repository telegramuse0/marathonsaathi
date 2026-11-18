'use client';

import type { SiteTab } from '@/types/site';

type Props = {
  activeTab: SiteTab;
  isDarkMode: boolean;
  submitForm: { name: string; organizer: string; email: string; contact: string; city: string; state: string; date: string; distance: string; socialLink: string; docFile: File | null };
  setSubmitForm: (value: { name: string; organizer: string; email: string; contact: string; city: string; state: string; date: string; distance: string; socialLink: string; docFile: File | null }) => void;
  submitSuccess: boolean;
  setSubmitSuccess: (value: boolean) => void;};

export default function SubmitEventView(props: Props) {
  const {
    activeTab, isDarkMode, submitForm, setSubmitForm, submitSuccess, setSubmitSuccess,
  } = props;

  return (
    <>
{/* SUBMIT RACE TAB */}
    {activeTab === 'submit' && (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className={`p-8 sm:p-10 rounded-3xl border space-y-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xl'}`}>
          <div>
            <h2 className="text-2xl font-black">Submit a Marathon Event</h2>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              List your upcoming running event for free. Please provide complete organizer contact details and legal permissions/proposals for verification.
            </p>
          </div>

          {submitSuccess ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 p-5 rounded-2xl text-xs font-bold text-center space-y-2">
              <p className="text-sm font-black">Event & Legal Documents Submitted Successfully!</p>
              <p className="font-normal">Our verification team will review your credentials and publish the event within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitSuccess(true); }} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Marathon Event Name *</label>
                  <input type="text" required placeholder="e.g. City Run 2026" value={submitForm.name} onChange={(e) => setSubmitForm({...submitForm, name: e.target.value})} className={`w-full p-3 rounded-xl text-sm border focus:outline-none focus:border-orange-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Organizer / Club Name *</label>
                  <input type="text" required placeholder="e.g. Sports Foundation" value={submitForm.organizer} onChange={(e) => setSubmitForm({...submitForm, organizer: e.target.value})} className={`w-full p-3 rounded-xl text-sm border focus:outline-none focus:border-orange-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Organizer Email *</label>
                  <input type="email" required placeholder="organizer@example.com" value={submitForm.email} onChange={(e) => setSubmitForm({...submitForm, email: e.target.value})} className={`w-full p-3 rounded-xl text-sm border focus:outline-none focus:border-orange-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Contact Mobile Number *</label>
                  <input type="tel" required placeholder="+91 98765 43210" value={submitForm.contact} onChange={(e) => setSubmitForm({...submitForm, contact: e.target.value})} className={`w-full p-3 rounded-xl text-sm border focus:outline-none focus:border-orange-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={`block font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>City *</label>
                  <input type="text" required placeholder="e.g. Kolkata" value={submitForm.city} onChange={(e) => setSubmitForm({...submitForm, city: e.target.value})} className={`w-full p-3 rounded-xl text-sm border focus:outline-none focus:border-orange-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>State *</label>
                  <input type="text" required placeholder="e.g. West Bengal" value={submitForm.state} onChange={(e) => setSubmitForm({...submitForm, state: e.target.value})} className={`w-full p-3 rounded-xl text-sm border focus:outline-none focus:border-orange-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Race Date *</label>
                  <input type="date" required value={submitForm.date} onChange={(e) => setSubmitForm({...submitForm, date: e.target.value})} className={`w-full p-3 rounded-xl text-sm border focus:outline-none focus:border-orange-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Distances Offered *</label>
                  <input type="text" required placeholder="e.g. Full, Half, 10K, 5K" value={submitForm.distance} onChange={(e) => setSubmitForm({...submitForm, distance: e.target.value})} className={`w-full p-3 rounded-xl text-sm border focus:outline-none focus:border-orange-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Social Media / Website Link</label>
                  <input type="url" placeholder="https://instagram.com/your-event" value={submitForm.socialLink} onChange={(e) => setSubmitForm({...submitForm, socialLink: e.target.value})} className={`w-full p-3 rounded-xl text-sm border focus:outline-none focus:border-orange-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                </div>
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                  Legal & Permissions Documentation (PDF / Proposal / Authority Letters) *
                </label>
                <input 
                  type="file" 
                  required 
                  accept=".pdf,.jpg,.png,.doc,.docx"
                  onChange={(e) => setSubmitForm({...submitForm, docFile: e.target.files?.[0] ?? null})}
                  className={`w-full p-3 rounded-xl text-sm border focus:outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-800'}`} 
                />
                <p className={`text-[10px] mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Upload official permission letters, safety clearance, or event proposal documents for verification.</p>
              </div>

              <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-orange-600/30 cursor-pointer mt-4">
                Submit Event & Documents for Review
              </button>
            </form>
          )}
        </div>
      </div>
    )}
    </>
  );
}
