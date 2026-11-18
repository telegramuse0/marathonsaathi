'use client';

import type { SiteTab } from '@/types/site';

type Props = {
  activeTab: SiteTab;
  isDarkMode: boolean;
  contactForm: { name: string; email: string; message: string };
  setContactForm: (value: { name: string; email: string; message: string }) => void;
  contactSubmitted: boolean;
  setContactSubmitted: (value: boolean) => void;};

export default function InfoView(props: Props) {
  const {
    activeTab, isDarkMode, contactForm, setContactForm, contactSubmitted, setContactSubmitted,
  } = props;

  return (
    <>
{/* ABOUT TAB */}
    {activeTab === 'about' && (
      <div className={`max-w-4xl mx-auto px-6 py-12 space-y-6 rounded-3xl my-8 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <h2 className="text-3xl font-black">About MarathonSaathi 2.0</h2>
        <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          MarathonSaathi is India’s premier discovery and community platform built exclusively for runners. Whether you are training for your very first 5K fun run or chasing a Boston Marathon qualifier, MarathonSaathi connects you with upcoming races across India, verified race results, and organizer event photo links like Kwikpic.
        </p>
      </div>
    )}

    {/* TERMS TAB */}
    {activeTab === 'terms' && (
      <div className={`max-w-4xl mx-auto px-6 py-12 space-y-6 rounded-3xl my-8 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <h2 className="text-3xl font-black">Terms & Conditions</h2>
        <div className={`text-xs space-y-3 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          <p><strong>1. Platform Role:</strong> MarathonSaathi is strictly a discovery and community platform. We do not organize or manage running events.</p>
          <p><strong>2. Organizer Responsibility:</strong> Event details, registrations, fee collections, race execution, and outcomes are solely the responsibility of respective organizers.</p>
        </div>
      </div>
    )}

    {/* PRIVACY TAB */}
    {activeTab === 'privacy' && (
      <div className={`max-w-4xl mx-auto px-6 py-12 space-y-6 rounded-3xl my-8 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <h2 className="text-3xl font-black">Privacy Policy</h2>
        <div className={`text-xs space-y-3 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          <p>At MarathonSaathi, we respect your privacy. We do not collect or sell personal runner data. Any email addresses submitted via Contact Us or event inquiries are used exclusively for communication purposes.</p>
        </div>
      </div>
    )}

    {/* CONTACT US TAB */}
    {activeTab === 'contact' && (
      <div className="max-w-xl mx-auto px-6 py-12">
        <div className={`p-8 rounded-3xl border space-y-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div>
            <h2 className="text-2xl font-black">Contact Us</h2>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Have questions, feedback, or need support? Reach out to us directly.</p>
            <p className="text-xs text-orange-500 font-semibold mt-2">Email: marathonsaathi@gmail.com</p>
          </div>

          {contactSubmitted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 p-4 rounded-2xl text-xs font-bold text-center">
              Message sent successfully! We will get back to you shortly.
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); }} className="space-y-4 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Your Name</label>
                <input type="text" required placeholder="Runner Name" value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} className={`w-full p-3 rounded-xl text-sm border focus:outline-none focus:border-orange-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <div>
                <label className={`block font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Your Email</label>
                <input type="email" required placeholder="runner@example.com" value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} className={`w-full p-3 rounded-xl text-sm border focus:outline-none focus:border-orange-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <div>
                <label className={`block font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Message</label>
                <textarea required rows={4} placeholder="How can we help you?" value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})} className={`w-full p-3 rounded-xl text-sm border focus:outline-none focus:border-orange-500 resize-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-orange-600/30 cursor-pointer">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    )}
    </>
  );
}
