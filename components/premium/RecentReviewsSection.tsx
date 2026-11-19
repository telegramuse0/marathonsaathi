'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type RecentReview = {
  id: number;
  event_id: number;
  runner_name: string;
  overall_rating: number;
  comment: string | null;
  created_at: string;
  eventName: string;
};

export default function RecentReviewsSection() {
  const [reviews, setReviews] = useState<RecentReview[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error } = await supabase.from('event_feedback')
        .select('id,event_id,runner_name,overall_rating,comment,created_at')
        .eq('is_verified', true).order('created_at', { ascending: false }).limit(6);
      if (error || !data?.length) {
        if (active) setLoaded(true);
        return;
      }
      const ids = [...new Set(data.map((review) => review.event_id))];
      const { data: events } = await supabase.from('marathons').select('id,name').in('id', ids);
      if (active) {
        const names = new Map((events || []).map((event) => [event.id, event.name]));
        setReviews(data.map((review) => ({ ...review, eventName: names.get(review.event_id) || 'Race event' })) as RecentReview[]);
        setLoaded(true);
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  return (
    <section className="recent-reviews-section page-width" aria-labelledby="recent-reviews-title">
      <div className="section-heading">
        <div><span className="eyebrow">REAL RUNNERS · REAL RACE DAYS</span><h2 id="recent-reviews-title">Recent race <em>reviews.</em></h2></div>
        <Link className="text-link" href="/events">Explore races <span aria-hidden="true">↗</span></Link>
      </div>
      {reviews.length ? <div className="recent-reviews-grid">
        {reviews.map((review) => <article key={review.id} className="recent-review-card">
          <div className="recent-review-stars" aria-label={`${review.overall_rating} out of 5 stars`}>{'★'.repeat(review.overall_rating)}<span>{'★'.repeat(5 - review.overall_rating)}</span></div>
          <p className="recent-review-comment">{review.comment || 'Shared a race experience with the community.'}</p>
          <div className="recent-review-by"><strong>{review.runner_name}</strong><span>{review.eventName}</span></div>
          <Link href={`/events/${review.event_id}`} className="recent-review-link">Read race details <span aria-hidden="true">→</span></Link>
        </article>)}
      </div> : <div className="recent-reviews-empty">{loaded ? 'Runner reviews will appear here after the first race review.' : 'Loading recent runner reviews…'}</div>}
    </section>
  );
}
