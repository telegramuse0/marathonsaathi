'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Review = {
  id: number;
  event_id: number;
  runner_name: string;
  bib_number: string | null;
  distance: string | null;
  route_rating: number;
  organization_rating: number;
  water_rating: number;
  overall_rating: number;
  comment: string | null;
};

type EventReviewGroup = { eventId: number; eventName: string; reviews: Review[]; average: number; totalCount: number };

export default function RecentReviewsSection() {
  const [groups, setGroups] = useState<EventReviewGroup[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error } = await supabase.from('event_feedback')
        .select('id,event_id,runner_name,bib_number,distance,route_rating,organization_rating,water_rating,overall_rating,comment,created_at')
        .eq('is_verified', true).order('created_at', { ascending: false }).limit(36);
      if (error || !data?.length) {
        if (active) setLoaded(true);
        return;
      }

      const eventIds: number[] = [];
      const grouped = new Map<number, Review[]>();
      for (const review of data as Review[]) {
        const current = grouped.get(review.event_id) || [];
        if (!current.length && eventIds.length < 3) eventIds.push(review.event_id);
        if (eventIds.includes(review.event_id) && current.length < 3) grouped.set(review.event_id, [...current, review]);
      }
      const [{ data: events }, { data: allRatings }] = await Promise.all([
        supabase.from('marathons').select('id,name').in('id', eventIds),
        supabase.from('event_feedback').select('event_id,overall_rating').eq('is_verified', true).in('event_id', eventIds),
      ]);
      if (active) {
        const eventNames = new Map((events || []).map((event) => [event.id, event.name]));
        const scores = new Map<number, { total: number; count: number }>();
        for (const rating of allRatings || []) {
          const score = scores.get(rating.event_id) || { total: 0, count: 0 };
          score.total += rating.overall_rating;
          score.count += 1;
          scores.set(rating.event_id, score);
        }
        setGroups(eventIds.map((eventId) => {
          const score = scores.get(eventId) || { total: 0, count: 0 };
          return { eventId, eventName: eventNames.get(eventId) || 'Race event', reviews: grouped.get(eventId) || [], average: score.count ? score.total / score.count : 0, totalCount: score.count };
        }));
        setLoaded(true);
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  return <section className="recent-reviews-section page-width" aria-labelledby="recent-reviews-title">
    <div className="section-heading">
      <div><span className="eyebrow">REAL RUNNERS · REAL RACE DAYS</span><h2 id="recent-reviews-title">Recent race <em>reviews.</em></h2></div>
      <Link className="text-link" href="/reviews">Write a review <span aria-hidden="true">↗</span></Link>
    </div>
    {groups.length ? <div className="home-review-groups">
      {groups.map((group) => {
        return <section className="home-review-group" key={group.eventId} aria-label={`${group.eventName} reviews`}>
          <div className="home-review-group-heading">
            <Link href={`/reviews?eventId=${group.eventId}`} className="recent-review-title">{group.eventName}</Link>
            <span><b>★</b> {group.average.toFixed(1)} <small>({group.totalCount} ratings)</small></span>
          </div>
          <div className="home-review-carousel" aria-label={`Swipe through recent reviews for ${group.eventName}`}>
            {group.reviews.map((review) => <article key={review.id} className="home-review-card">
              <div className="home-review-score"><span aria-label={`${review.overall_rating} out of 5 stars`}>{'★'.repeat(review.overall_rating)}<i>{'★'.repeat(5 - review.overall_rating)}</i></span><strong>{review.overall_rating}/5</strong></div>
              <p className="home-review-runner">{review.runner_name}<small>Bib {review.bib_number || '—'} · {review.distance || 'Race distance'}</small></p>
              <p className="home-review-comment">{review.comment || 'Shared a race experience with the running community.'}</p>
              <p className="home-review-categories">Route {review.route_rating} · Organisation {review.organization_rating} · Water {review.water_rating}</p>
            </article>)}
          </div>
          <p className="home-review-swipe-hint">Swipe to see more reviews <span aria-hidden="true">→</span></p>
        </section>;
      })}
    </div> : <div className="recent-reviews-empty">{loaded ? 'Runner reviews will appear here after the first race review.' : 'Loading recent runner reviews…'}</div>}
  </section>;
}

