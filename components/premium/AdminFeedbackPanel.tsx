'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type FeedbackRow = {
  id: number;
  event_id: number;
  runner_name: string;
  runner_email: string;
  registration_reference: string;
  route_rating: number;
  organization_rating: number;
  water_rating: number;
  overall_rating: number;
  comment: string | null;
  is_verified: boolean;
  created_at: string;
};

export default function AdminFeedbackPanel() {
  const [items, setItems] = useState<FeedbackRow[]>([]);
  const [eventNames, setEventNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const loadFeedback = useCallback(async () => {
    setLoading(true);
    const [{ data: feedback, error: feedbackError }, { data: events }] = await Promise.all([
      supabase.from('event_feedback').select('*').order('created_at', { ascending: false }),
      supabase.from('marathons').select('id,name'),
    ]);
    if (feedbackError) setError(feedbackError.message);
    else setError('');
    setItems((feedback || []) as FeedbackRow[]);
    setEventNames(Object.fromEntries((events || []).map((event) => [Number(event.id), String(event.name || 'Event')])));
    setLoading(false);
  }, []);

  useEffect(() => { void loadFeedback(); }, [loadFeedback]);

  const setVerified = async (item: FeedbackRow, isVerified: boolean) => {
    setWorkingId(item.id);
    const { error: updateError } = await supabase.from('event_feedback').update({ is_verified: isVerified }).eq('id', item.id);
    if (updateError) setError(updateError.message);
    else setItems((current) => current.map((feedback) => feedback.id === item.id ? { ...feedback, is_verified: isVerified } : feedback));
    setWorkingId(null);
  };

  const remove = async (item: FeedbackRow) => {
    if (!window.confirm(`Delete feedback from ${item.runner_name}?`)) return;
    setWorkingId(item.id);
    const { error: deleteError } = await supabase.from('event_feedback').delete().eq('id', item.id);
    if (deleteError) setError(deleteError.message);
    else setItems((current) => current.filter((feedback) => feedback.id !== item.id));
    setWorkingId(null);
  };

  return (
    <section id="admin-feedback" className="scroll-mt-24 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-sm font-black uppercase tracking-wide text-slate-900">Runner Feedback ({items.length})</h2><p className="mt-1 text-xs text-slate-500">Registration reference check karke feedback publish karein.</p></div>
        <button type="button" onClick={() => void loadFeedback()} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">Refresh</button>
      </div>
      {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700">{error}</p>}
      {loading ? <p className="text-sm text-slate-500">Loading feedback…</p> : items.length === 0 ? <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">Abhi feedback submissions nahi hain.</p> : <div className="space-y-3">
        {items.map((item) => <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2"><strong className="text-sm text-slate-900">{item.runner_name}</strong><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${item.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>{item.is_verified ? 'Verified & published' : 'Needs verification'}</span></div>
              <p className="mt-1 text-xs text-slate-600">{eventNames[item.event_id] || `Event #${item.event_id}`} · {item.runner_email}</p>
              <p className="mt-1 text-xs text-slate-600">Registration/Bib: <strong>{item.registration_reference}</strong></p>
              <p className="mt-2 text-xs font-semibold text-slate-700">Route {item.route_rating}/5 · Organization {item.organization_rating}/5 · Water {item.water_rating}/5 · Overall {item.overall_rating}/5</p>
              {item.comment && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{item.comment}</p>}
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button disabled={workingId === item.id} type="button" onClick={() => void setVerified(item, !item.is_verified)} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">{item.is_verified ? 'Unpublish' : 'Verify & publish'}</button>
              <button disabled={workingId === item.id} type="button" onClick={() => void remove(item)} className="rounded-lg bg-rose-100 px-3 py-2 text-xs font-bold text-rose-700 disabled:opacity-50">Delete</button>
            </div>
          </div>
        </article>)}
      </div>}
    </section>
  );
}
