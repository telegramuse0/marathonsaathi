'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Review = {
  id: number;
  runner_name: string;
  route_rating: number;
  organization_rating: number;
  water_rating: number;
  overall_rating: number;
  comment: string | null;
  created_at: string;
};

const ratingLabels = [
  ['route_rating', 'Route'],
  ['organization_rating', 'Organization'],
  ['water_rating', 'Water stations'],
  ['overall_rating', 'Overall experience'],
] as const;

export default function EventFeedback({ eventId, eventName, eventDate }: { eventId: number; eventName: string; eventDate: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [runnerName, setRunnerName] = useState('');
  const [runnerEmail, setRunnerEmail] = useState('');
  const [registrationReference, setRegistrationReference] = useState('');
  const [ratings, setRatings] = useState({ route_rating: 5, organization_rating: 5, water_rating: 5, overall_rating: 5 });
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const raceDate = new Date(`${eventDate.slice(0, 10)}T23:59:59`);
  const feedbackOpen = Boolean(eventDate) && !Number.isNaN(raceDate.getTime()) && raceDate.getTime() < Date.now();

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error } = await supabase.from('event_feedback')
        .select('id,runner_name,route_rating,organization_rating,water_rating,overall_rating,comment,created_at')
        .eq('event_id', eventId).eq('is_verified', true).order('created_at', { ascending: false });
      if (active) {
        if (!error) setReviews((data || []) as Review[]);
        setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [eventId]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const { error } = await supabase.from('event_feedback').insert({
      event_id: eventId,
      runner_name: runnerName.trim(),
      runner_email: runnerEmail.trim().toLowerCase(),
      registration_reference: registrationReference.trim(),
      ...ratings,
      comment: comment.trim() || null,
      is_verified: false,
    });
    setSaving(false);
    if (error) {
      setMessage(error.code === '23505' ? 'Aap is event ke liye feedback pehle submit kar chuke hain.' : 'Feedback submit nahi hua. Thodi der baad phir try karein.');
      return;
    }
    setMessage('Shukriya! Registration reference verify hone ke baad aapka feedback publish hoga.');
    setRunnerName('');
    setRunnerEmail('');
    setRegistrationReference('');
    setComment('');
  };

  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.overall_rating, 0) / reviews.length : 0;

  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-12" aria-labelledby="event-feedback-heading">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50 to-white px-5 py-5 sm:px-7">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-orange-600">Runner scorecard</p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
            <h2 id="event-feedback-heading" className="text-xl font-black text-slate-900 sm:text-2xl">Event feedback</h2>
            {!loading && reviews.length > 0 && <p className="text-sm font-bold text-slate-700">★ {average.toFixed(1)} <span className="font-normal text-slate-500">from {reviews.length} verified runner{reviews.length === 1 ? '' : 's'}</span></p>}
          </div>
          <p className="mt-1 text-sm text-slate-600">Route, organization aur water stations ke baare mein apna experience share karein.</p>
        </div>

        {reviews.length > 0 && <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7">
          {reviews.slice(0, 6).map((review) => <article key={review.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3"><strong className="text-sm text-slate-800">{review.runner_name}</strong><span className="text-xs font-bold text-amber-600">★ {review.overall_rating}/5</span></div>
            <p className="mt-1 text-[11px] text-slate-500">Route {review.route_rating}/5 · Organization {review.organization_rating}/5 · Water {review.water_rating}/5</p>
            {review.comment && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{review.comment}</p>}
          </article>)}
        </div>}

        {feedbackOpen ? <form onSubmit={submit} className="space-y-4 border-t border-slate-100 p-5 sm:p-7">
          <h3 className="font-bold text-slate-900">Share your race experience</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input required maxLength={60} value={runnerName} onChange={(e) => setRunnerName(e.target.value)} placeholder="Your name" className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400" />
            <input required type="email" maxLength={254} value={runnerEmail} onChange={(e) => setRunnerEmail(e.target.value)} placeholder="Email (kept private)" className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400" />
            <input required minLength={3} maxLength={80} value={registrationReference} onChange={(e) => setRegistrationReference(e.target.value)} placeholder="Registration ID or bib number (for verification)" className="sm:col-span-2 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {ratingLabels.map(([key, label]) => <label key={key} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
              {label}<select aria-label={`${label} rating`} value={ratings[key]} onChange={(e) => setRatings((current) => ({ ...current, [key]: Number(e.target.value) }))} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">{[5, 4, 3, 2, 1].map((score) => <option key={score} value={score}>{score} / 5</option>)}</select>
            </label>)}
          </div>
          <textarea maxLength={1000} rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder={`What should runners know about ${eventName}? (optional)`} className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400" />
          <div className="flex flex-wrap items-center gap-3"><button disabled={saving} className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-500 disabled:opacity-60">{saving ? 'Submitting…' : 'Submit feedback'}</button><p className="text-xs text-slate-500">Feedback is shown after registration details are checked.</p></div>
          {message && <p role="status" className="text-sm font-semibold text-slate-700">{message}</p>}
        </form> : <p className="border-t border-slate-100 px-5 py-5 text-sm text-slate-500 sm:px-7">Race ke baad runners apna feedback share kar sakenge.</p>}
      </div>
    </section>
  );
}
