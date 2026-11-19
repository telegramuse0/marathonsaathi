'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Icon } from './Icon';

type Review = {
  id: number;
  event_id: number;
  runner_name: string;
  bib_number: string | null;
  distance: string | null;
  overall_rating: number;
  comment: string | null;
};
type EventReviewGroup = {
  eventId: number;
  eventName: string;
  image: string;
  date: string;
  distance: string;
  city: string;
  reviews: Review[];
  average: number;
  totalCount: number;
};

const formatDate = (value: string) => {
  if (!value) return 'Date to be announced';
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' });
};

export default function RecentReviewsSection() {
  const [groups, setGroups] = useState<EventReviewGroup[]>([]);
  const [activeReview, setActiveReview] = useState<Record<number, number>>({});
  const [loaded, setLoaded] = useState(false);
  const touchStart = useRef<Record<number, number>>({});

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error } = await supabase.from('event_feedback')
        .select('id,event_id,runner_name,bib_number,distance,overall_rating,comment,created_at')
        .eq('is_verified', true).order('created_at', { ascending: false }).limit(60);
      if (error || !data?.length) { if (active) setLoaded(true); return; }

      const eventIds: number[] = [];
      const grouped = new Map<number, Review[]>();
      for (const review of data as Review[]) {
        const current = grouped.get(review.event_id) || [];
        if (!current.length && eventIds.length < 3) eventIds.push(review.event_id);
        if (eventIds.includes(review.event_id) && current.length < 3) grouped.set(review.event_id, [...current, review]);
      }
      const [{ data: events }, { data: allRatings }] = await Promise.all([
        supabase.from('marathons').select('id,name,image,date,distance,venue').in('id', eventIds),
        supabase.from('event_feedback').select('event_id,overall_rating').eq('is_verified', true).in('event_id', eventIds),
      ]);
      if (!active) return;
      const eventMap = new Map((events || []).map((event) => [Number(event.id), event]));
      const scores = new Map<number, { total: number; count: number }>();
      for (const rating of allRatings || []) {
        const score = scores.get(rating.event_id) || { total: 0, count: 0 };
        score.total += rating.overall_rating;
        score.count += 1;
        scores.set(rating.event_id, score);
      }
      setGroups(eventIds.map((eventId) => {
        const event = eventMap.get(eventId);
        const score = scores.get(eventId) || { total: 0, count: 0 };
        const location = (event?.venue || '').split(',').map((part: string) => part.trim()).filter(Boolean)[0] || 'India';
        return {
          eventId, eventName: event?.name || 'Race event', image: event?.image || '', date: event?.date || '',
          distance: event?.distance || '', city: location, reviews: grouped.get(eventId) || [],
          average: score.count ? score.total / score.count : 0, totalCount: score.count,
        };
      }));
      setLoaded(true);
    };
    void load();
    return () => { active = false; };
  }, []);

  return <section className="recent-reviews-section page-width" aria-labelledby="recent-reviews-title">
    <div className="recent-race-reviews-panel">
      <div className="recent-race-reviews-bar" id="recent-reviews-title">Recent Race Reviews</div>
      {groups.length ? <div className="recent-race-review-list">
        {groups.map((group) => {
          const reviewIndex = (activeReview[group.eventId] || 0) % Math.max(group.reviews.length, 1);
          const review = group.reviews[reviewIndex];
          const initials = (review?.runner_name || 'Runner').trim().split(/\s+/).slice(0, 2).map((name) => name[0]?.toUpperCase()).join('');
          return <article className="recent-race-review-row" key={group.eventId}>
            <Link href={`/events/${group.eventId}`} className="recent-race-poster" aria-label={`Open ${group.eventName}`}>
              {group.image ? <img src={group.image} alt={`${group.eventName} poster`} loading="lazy" /> : <span aria-hidden="true">🏃</span>}
            </Link>
            <div className="recent-race-event-info">
              <Link href={`/reviews?eventId=${group.eventId}`} className="recent-race-event-title">{group.eventName}</Link>
              <time dateTime={group.date}>{formatDate(group.date)}</time>
              <div className="recent-race-event-type"><span><Icon name="spark" size={15} /> Running</span><i aria-hidden="true">•</i><span><Icon name="pin" size={15} /> {group.city}</span></div>
              {group.distance && <p className="recent-race-distance">{group.distance}</p>}
              <Link href={`/reviews?eventId=${group.eventId}`} className="recent-race-rating"><b>★ {group.average.toFixed(0)}</b><span>{group.totalCount} {group.totalCount === 1 ? 'review' : 'reviews'}</span></Link>
            </div>
            <div className="recent-race-review-side" onTouchStart={(e) => { touchStart.current[group.eventId] = e.changedTouches[0]?.clientX || 0; }} onTouchEnd={(e) => {
              const start = touchStart.current[group.eventId] || 0;
              const delta = (e.changedTouches[0]?.clientX || start) - start;
              if (Math.abs(delta) > 45 && group.reviews.length > 1) setActiveReview((current) => ({ ...current, [group.eventId]: (reviewIndex + (delta < 0 ? 1 : group.reviews.length - 1)) % group.reviews.length }));
            }}>
              {review && <div className="recent-race-review-quote" key={review.id}>
                <div className="recent-race-review-author"><span aria-hidden="true">{initials}</span><strong>{review.runner_name}</strong></div>
                <p>{review.comment || 'Shared a race experience with the running community.'}</p>
                <div className="recent-race-runner-details">Bib {review.bib_number || '—'} <i>·</i> {review.distance || group.distance || 'Race distance'} <span aria-label={`${review.overall_rating} out of 5 stars`}>{'★'.repeat(review.overall_rating)}<em>{'★'.repeat(5 - review.overall_rating)}</em></span></div>
              </div>}
              {group.reviews.length > 1 && <div className="recent-race-review-dots" aria-label={`Review ${reviewIndex + 1} of ${group.reviews.length}`}>
                {group.reviews.map((item, index) => <button key={item.id} type="button" className={index === reviewIndex ? 'is-active' : ''} onClick={() => setActiveReview((current) => ({ ...current, [group.eventId]: index }))} aria-label={`Show review ${index + 1}`} aria-current={index === reviewIndex ? 'true' : undefined} />)}
              </div>}
            </div>
          </article>;
        })}
      </div> : <div className="recent-reviews-empty">{loaded ? 'Runner reviews will appear here after the first race review.' : 'Loading recent runner reviews…'}</div>}
      <Link className="recent-race-reviews-link" href="/reviews">Go to race reviews <span aria-hidden="true">→</span></Link>
    </div>
  </section>;
}

