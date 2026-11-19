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
  bib_number: string | null;
  distance: string | null;
  created_at: string;
};

const ratingLabels = [
  ['route_rating', 'Route'],
  ['organization_rating', 'Organization'],
  ['water_rating', 'Water stations'],
  ['overall_rating', 'Overall experience'],
] as const;

function Stars({ value, label, onChange }: { value: number; label: string; onChange?: (rating: number) => void }) {
  return <div role={onChange ? 'radiogroup' : undefined} aria-label={label} className="flex items-center gap-1" title={`${label}: ${value} out of 5`}>
    {[1, 2, 3, 4, 5].map((star) => onChange ? (
      <button key={star} type="button" role="radio" aria-checked={value === star} aria-label={`${star} star${star === 1 ? '' : 's'}`} onClick={() => onChange(star)} className={`text-2xl leading-none transition hover:scale-110 ${star <= value ? 'text-amber-400' : 'text-slate-200'}`}>★</button>
    ) : <span key={star} aria-hidden="true" className={`text-lg leading-none ${star <= value ? 'text-amber-400' : 'text-slate-200'}`}>★</span>)}
  </div>;
}

export default function EventFeedback({ eventId, eventName, eventDate, eventDistances }: { eventId: number; eventName: string; eventDate: string; eventDistances: string[] }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [runnerName, setRunnerName] = useState('');
  const [bibNumber, setBibNumber] = useState('');
  const [distance, setDistance] = useState(eventDistances[0] || '');
  const [ratings, setRatings] = useState({ route_rating: 5, organization_rating: 5, water_rating: 5, overall_rating: 5 });
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [ownerTokens, setOwnerTokens] = useState<Record<string, string>>({});
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);

  const raceDate = new Date(`${eventDate.slice(0, 10)}T23:59:59`);
  const feedbackOpen = Boolean(eventDate) && !Number.isNaN(raceDate.getTime()) && raceDate.getTime() < Date.now();

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem('marathonsaathi-review-keys') || '{}') as Record<string, string>;
      setOwnerTokens(saved);
    } catch {
      setOwnerTokens({});
    }
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error } = await supabase.from('event_feedback')
        .select('id,runner_name,bib_number,distance,route_rating,organization_rating,water_rating,overall_rating,comment,created_at')
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
    const cleanName = runnerName.trim();
    const cleanComment = comment.trim() || null;
    const createdAt = new Date().toISOString();
    let savedReviewId: number | null = null;
    let error: { message?: string } | null = null;
    if (editingReviewId !== null) {
      const token = ownerTokens[String(editingReviewId)];
      const result = await supabase.rpc('edit_own_event_feedback', {
        p_review_id: editingReviewId, p_owner_token: token, p_runner_name: cleanName,
        p_bib_number: bibNumber.trim(), p_distance: distance,
        p_route_rating: ratings.route_rating, p_organization_rating: ratings.organization_rating,
        p_water_rating: ratings.water_rating, p_overall_rating: ratings.overall_rating, p_comment: cleanComment,
      });
      error = result.error || (!result.data ? { message: 'Review edit permission could not be confirmed.' } : null);
      savedReviewId = editingReviewId;
    } else {
      const ownerToken = `${crypto.randomUUID()}${crypto.randomUUID()}`;
      const result = await supabase.from('event_feedback').insert({
        event_id: eventId, runner_name: cleanName, bib_number: bibNumber.trim(), distance,
        ...ratings, comment: cleanComment, is_verified: true, owner_token: ownerToken,
      }).select('id').single();
      error = result.error;
      if (result.data?.id) {
        savedReviewId = Number(result.data.id);
        const nextTokens = { ...ownerTokens, [String(savedReviewId)]: ownerToken };
        setOwnerTokens(nextTokens);
        window.localStorage.setItem('marathonsaathi-review-keys', JSON.stringify(nextTokens));
      }
    }
    setSaving(false);
    if (error) {
      setMessage('Feedback submit nahi hua. Thodi der baad phir try karein.');
      return;
    }
    const updatedReview: Review = { id: savedReviewId || Date.now(), runner_name: cleanName, bib_number: bibNumber.trim(), distance, ...ratings, comment: cleanComment, created_at: createdAt };
    setReviews((current) => editingReviewId !== null ? current.map((review) => review.id === editingReviewId ? { ...review, ...updatedReview } : review) : [updatedReview, ...current]);
    setMessage(editingReviewId !== null ? 'Your review has been updated.' : 'Shukriya! Aapka review ab public hai.');
    setEditingReviewId(null);
    setRunnerName('');
    setBibNumber('');
    setComment('');
    setRatings({ route_rating: 5, organization_rating: 5, water_rating: 5, overall_rating: 5 });
  };

  const startReviewEdit = (review: Review) => {
    setEditingReviewId(review.id);
    setRunnerName(review.runner_name);
    setBibNumber(review.bib_number || '');
    setDistance(review.distance || eventDistances[0] || '');
    setRatings({ route_rating: review.route_rating, organization_rating: review.organization_rating, water_rating: review.water_rating, overall_rating: review.overall_rating });
    setComment(review.comment || '');
    document.getElementById('event-review-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const deleteOwnReview = async (review: Review) => {
    const token = ownerTokens[String(review.id)];
    if (!token || !window.confirm('Delete your review? This cannot be undone.')) return;
    const { data, error } = await supabase.rpc('delete_own_event_feedback', { p_review_id: review.id, p_owner_token: token });
    if (error || !data) {
      setMessage('Review delete nahi ho paya. Thodi der baad phir try karein.');
      return;
    }
    const nextTokens = { ...ownerTokens };
    delete nextTokens[String(review.id)];
    setOwnerTokens(nextTokens);
    window.localStorage.setItem('marathonsaathi-review-keys', JSON.stringify(nextTokens));
    setReviews((current) => current.filter((item) => item.id !== review.id));
    setMessage('Your review has been deleted.');
  };

  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.overall_rating, 0) / reviews.length : 0;

  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-12" aria-labelledby="event-feedback-heading">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50 to-white px-5 py-5 sm:px-7">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-orange-600">Runner scorecard</p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
            <h2 id="event-feedback-heading" className="text-xl font-black text-slate-900 sm:text-2xl">{eventName} reviews</h2>
            {!loading && reviews.length > 0 && <div className="flex items-center gap-2"><Stars value={Math.round(average)} label="Average runner rating" /><p className="text-sm font-bold text-slate-700">{average.toFixed(1)} <span className="font-normal text-slate-500">({reviews.length})</span></p></div>}
          </div>
          <p className="mt-1 text-sm text-slate-600">Route, organization aur water stations par runners ki ratings.</p>
        </div>

        {reviews.length > 0 && <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7">
          {reviews.slice(0, 6).map((review) => <article key={review.id} className="race-review-card rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm text-slate-800">{review.runner_name}</strong><div className="flex items-center gap-2"><Stars value={review.overall_rating} label="Overall runner rating" /><span className="text-xs font-bold text-slate-500">{review.overall_rating}/5</span></div></div>
            <p className="mt-1 text-xs font-semibold text-slate-600">Bib {review.bib_number || '—'} · {review.distance || 'Race distance'}</p>
            {review.comment && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{review.comment}</p>}
            <p className="mt-3 border-t border-slate-200 pt-2 text-[11px] text-slate-500">Route {review.route_rating}/5 · Organisation {review.organization_rating}/5 · Water {review.water_rating}/5</p>
            {ownerTokens[String(review.id)] && <div className="mt-4 flex gap-2 border-t border-slate-200 pt-3"><button type="button" onClick={() => startReviewEdit(review)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">Edit review</button><button type="button" onClick={() => void deleteOwnReview(review)} className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-rose-700">Delete</button></div>}
          </article>)}
        </div>}

        {feedbackOpen ? <form id="event-review-form" onSubmit={submit} className="space-y-4 border-t border-slate-100 p-5 sm:p-7">
          <h3 className="font-bold text-slate-900">{editingReviewId !== null ? 'Edit your race review' : 'Rate your race experience'}</h3>
          <p className="text-xs text-slate-500">{eventDate ? `Race date · ${eventDate}` : 'Race review'}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <input required minLength={2} maxLength={60} value={runnerName} onChange={(e) => setRunnerName(e.target.value)} placeholder="Runner name" aria-label="Runner name" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400" />
            <input required minLength={1} maxLength={30} value={bibNumber} onChange={(e) => setBibNumber(e.target.value)} placeholder="Bib number" aria-label="Bib number" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400" />
            <select required value={distance} onChange={(e) => setDistance(e.target.value)} aria-label="Race distance" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"><option value="">Select distance</option>{eventDistances.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {ratingLabels.map(([key, label]) => <div key={key} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
              <span>{label}</span><Stars value={ratings[key]} label={label} onChange={(rating) => setRatings((current) => ({ ...current, [key]: rating }))} />
            </div>)}
          </div>
          <textarea maxLength={1000} rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder={`What should runners know about ${eventName}? (optional)`} className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400" />
          <div className="flex flex-wrap items-center gap-3"><button disabled={saving || !distance} className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-500 disabled:opacity-60">{saving ? 'Saving…' : editingReviewId !== null ? 'Save changes' : 'Submit review'}</button>{editingReviewId !== null && <button type="button" onClick={() => { setEditingReviewId(null); setRunnerName(''); setBibNumber(''); setComment(''); }} className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700">Cancel</button>}<p className="text-xs text-slate-500">Name, bib number and race distance appear with your review to show your event participation details.</p></div>
          {message && <p role="status" className="text-sm font-semibold text-slate-700">{message}</p>}
        </form> : <p className="border-t border-slate-100 px-5 py-5 text-sm text-slate-500 sm:px-7">Race ke baad runners apna review share kar sakenge.</p>}
      </div>
    </section>
  );
}
