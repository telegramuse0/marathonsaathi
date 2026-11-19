'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type RecentReview = {
  id: number;
  event_id: number;
  runner_name: string;
  bib_number: string | null;
  distance: string | null;
  overall_rating: number;
  comment: string | null;
  created_at: string;
  eventName: string;
  eventImage: string;
};

export default function RecentReviewsSection() {
  const [reviews, setReviews] = useState<RecentReview[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error } = await supabase.from('event_feedback')
        .select('id,event_id,runner_name,bib_number,distance,overall_rating,comment,created_at')
        .eq('is_verified', true).order('created_at', { ascending: false }).limit(6);
      if (error || !data?.length) {
        if (active) setLoaded(true);
        return;
      }
      const ids = [...new Set(data.map((review) => review.event_id))];
      const { data: events } = await supabase.from('marathons').select('id,name,image').in('id', ids);
      if (active) {
        const eventMap = new Map((events || []).map((event) => [event.id, event]));
        setReviews(data.map((review) => ({ ...review, eventName: eventMap.get(review.event_id)?.name || 'Race event', eventImage: eventMap.get(review.event_id)?.image || '' })) as RecentReview[]);
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
        <Link className="text-link" href="/reviews">Write a review <span aria-hidden="true">↗</span></Link>
      </div>
      {reviews.length ? <div className="recent-reviews-grid">
        {reviews.map((review) => <article key={review.id} className="recent-review-card">
          {review.eventImage && <img src={review.eventImage} alt={`${review.eventName} event`} className="recent-review-image" loading="lazy" />}
          <Link href={`/reviews?eventId=${review.event_id}`} className="recent-review-title">{review.eventName}</Link>
        </article>)}
      </div> : <div className="recent-reviews-empty">{loaded ? 'Runner reviews will appear here after the first race review.' : 'Loading recent runner reviews…'}</div>}
    </section>
  );
}
