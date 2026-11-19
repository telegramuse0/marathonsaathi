'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Review = {
  id: number; event_id: number; runner_name: string; bib_number: string | null;
  distance: string | null; overall_rating: number; comment: string | null; created_at: string;
};
type Reply = { id: number; review_id: number; author_name: string; message: string; created_at: string };

export default function AdminReviewManagerPanel() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [eventNames, setEventNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    const [reviewResult, replyResult] = await Promise.all([
      supabase.from('event_feedback').select('id,event_id,runner_name,bib_number,distance,overall_rating,comment,created_at').order('created_at', { ascending: false }).limit(100),
      supabase.from('event_feedback_replies').select('id,review_id,author_name,message,created_at').order('created_at', { ascending: false }).limit(200),
    ]);
    if (!reviewResult.error) {
      const items = (reviewResult.data || []) as Review[];
      setReviews(items);
      const eventIds = [...new Set(items.map((item) => item.event_id))];
      if (eventIds.length) {
        const { data } = await supabase.from('marathons').select('id,name').in('id', eventIds);
        setEventNames(Object.fromEntries((data || []).map((event) => [Number(event.id), event.name])));
      } else setEventNames({});
    }
    if (!replyResult.error) setReplies((replyResult.data || []) as Reply[]);
    setLoading(false);
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const deleteReview = async (review: Review) => {
    if (!window.confirm(`Delete ${review.runner_name}'s review? Its replies will also be removed.`)) return;
    setBusy(`review-${review.id}`); setNotice('');
    const { error } = await supabase.from('event_feedback').delete().eq('id', review.id);
    setBusy(null);
    if (error) { setNotice('Review delete nahi hua. Admin access check karke phir try karein.'); return; }
    setReviews((current) => current.filter((item) => item.id !== review.id));
    setReplies((current) => current.filter((item) => item.review_id !== review.id));
    setNotice('Review deleted.');
  };

  const deleteReply = async (reply: Reply) => {
    if (!window.confirm(`Delete ${reply.author_name}'s reply?`)) return;
    setBusy(`reply-${reply.id}`); setNotice('');
    const { error } = await supabase.from('event_feedback_replies').delete().eq('id', reply.id);
    setBusy(null);
    if (error) { setNotice('Reply delete nahi hua. Admin access check karke phir try karein.'); return; }
    setReplies((current) => current.filter((item) => item.id !== reply.id));
    setNotice('Reply deleted.');
  };

  return <section id="admin-reviews" className="scroll-mt-24 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-sm font-black uppercase tracking-wider text-slate-900">Runner reviews & replies</h2><p className="mt-1 text-xs text-slate-500">Recent 100 reviews and 200 replies. Review delete karne par uske replies bhi delete honge.</p></div>
      <button type="button" onClick={() => void refresh()} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">Refresh</button>
    </div>
    {notice && <p role="status" className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">{notice}</p>}
    {loading ? <p className="py-6 text-sm text-slate-500">Loading reviews…</p> : reviews.length === 0 ? <p className="py-6 text-sm text-slate-500">No reviews yet.</p> : <div className="space-y-3">
      {reviews.map((review) => <article key={review.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0"><p className="text-xs font-black uppercase tracking-wide text-orange-700">{eventNames[review.event_id] || `Event #${review.event_id}`}</p><h3 className="mt-1 font-bold text-slate-900">{review.runner_name} <span className="text-xs font-medium text-slate-500">· Bib {review.bib_number || '—'} · {review.distance || '—'}</span></h3><p className="mt-1 text-xs text-slate-500">{new Date(review.created_at).toLocaleString()} · {review.overall_rating}/5 stars</p>{review.comment && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{review.comment}</p>}</div>
          <button type="button" disabled={busy === `review-${review.id}`} onClick={() => void deleteReview(review)} className="shrink-0 rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-700 disabled:opacity-50">{busy === `review-${review.id}` ? 'Deleting…' : 'Delete review'}</button>
        </div>
        {replies.filter((reply) => reply.review_id === review.id).map((reply) => <div key={reply.id} className="mt-3 flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3"><div><p className="text-xs font-bold text-slate-800">{reply.author_name} <span className="font-normal text-slate-400">· {new Date(reply.created_at).toLocaleString()}</span></p><p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{reply.message}</p></div><button type="button" disabled={busy === `reply-${reply.id}`} onClick={() => void deleteReply(reply)} className="shrink-0 text-xs font-bold text-rose-700 disabled:opacity-50">{busy === `reply-${reply.id}` ? '…' : 'Delete reply'}</button></div>)}
      </article>)}
    </div>}
  </section>;
}

