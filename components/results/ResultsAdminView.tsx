'use client';

import type { FormEvent } from 'react';
import type { ResultLinkItem, SiteTab } from '@/types/site';

type Props = {
  activeTab: SiteTab;
  isDarkMode: boolean;
  resultsLinks: ResultLinkItem[];
  newResultForm: { eventName: string; resultsUrl: string; photosUrl: string };
  setNewResultForm: (value: { eventName: string; resultsUrl: string; photosUrl: string }) => void;
  handleAddResultLink: (event: FormEvent<HTMLFormElement>) => void;
  editingId: number | null;
  editForm: { eventName: string; resultsUrl: string; photosUrl: string };
  setEditForm: (value: { eventName: string; resultsUrl: string; photosUrl: string }) => void;
  saveEdit: (id: number) => void;
  startEditing: (item: ResultLinkItem) => void;
  deleteResultLink: (id: number) => void;};

export default function ResultsAdminView(props: Props) {
  const {
    activeTab, isDarkMode, resultsLinks, newResultForm, setNewResultForm, handleAddResultLink, editingId, editForm, setEditForm, saveEdit, startEditing, deleteResultLink,
  } = props;

  return (
    <>
{/* ADMIN DASHBOARD TAB */}
    {activeTab === 'admin' && (
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className={`p-8 rounded-3xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-orange-500/30">
              Admin Control Center
            </span>
            <h2 className="text-2xl font-black mt-2">Manage Event Results & Photo Links</h2>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Add, edit, or remove organizer timing results and Kwikpic links dynamically.</p>
          </div>
        </div>

        <div className={`p-6 rounded-3xl border space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className="text-base font-black text-orange-500">Add New Event Result & Photo Link</h3>
          <form onSubmit={handleAddResultLink} className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <input 
              type="text" 
              required 
              placeholder="Event Name (e.g. Pune Marathon 2026)" 
              value={newResultForm.eventName} 
              onChange={(e) => setNewResultForm({...newResultForm, eventName: e.target.value})} 
              className={`p-3 rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} 
            />
            <input 
              type="url" 
              required 
              placeholder="Official Results URL" 
              value={newResultForm.resultsUrl} 
              onChange={(e) => setNewResultForm({...newResultForm, resultsUrl: e.target.value})} 
              className={`p-3 rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} 
            />
            <input 
              type="url" 
              placeholder="Kwikpic Photos URL" 
              value={newResultForm.photosUrl} 
              onChange={(e) => setNewResultForm({...newResultForm, photosUrl: e.target.value})} 
              className={`p-3 rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} 
            />
            <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-xl transition cursor-pointer shadow-md">
              Add Entry
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-black">Existing Event Links ({resultsLinks.length})</h3>
          {resultsLinks.map((item) => (
            <div key={item.id} className={`p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {editingId === item.id ? (
                <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <input 
                    type="text" 
                    value={editForm.eventName} 
                    onChange={(e) => setEditForm({...editForm, eventName: e.target.value})} 
                    className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`} 
                  />
                  <input 
                    type="url" 
                    value={editForm.resultsUrl} 
                    onChange={(e) => setEditForm({...editForm, resultsUrl: e.target.value})} 
                    className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`} 
                  />
                  <input 
                    type="url" 
                    value={editForm.photosUrl} 
                    onChange={(e) => setEditForm({...editForm, photosUrl: e.target.value})} 
                    className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`} 
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <h4 className="text-base font-black">{item.eventName}</h4>
                  <p className={`text-xs truncate max-w-md ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Results: {item.resultsUrl}</p>
                  <p className={`text-xs truncate max-w-md ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Photos: {item.photosUrl}</p>
                </div>
              )}

              <div className="flex items-center space-x-2 text-xs">
                {editingId === item.id ? (
                  <button onClick={() => saveEdit(item.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                    Save
                  </button>
                ) : (
                  <button onClick={() => startEditing(item)} className={`px-4 py-2 rounded-xl font-bold border transition cursor-pointer ${
                    isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                  }`}>
                    Edit
                  </button>
                )}
                <button onClick={() => deleteResultLink(item.id)} className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
    </>
  );
}
