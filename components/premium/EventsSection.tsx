'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Icon } from './Icon';
import Link from 'next/link';
import { marathons, type Marathon } from './data';

type MarathonRow = {
  id: number;
  name: string | null;
  description?: string | null;
  venue: string | null;
  date: string | null;
  distance: string | null;
  status: string | null;
  registration_link?: string | null;
  image?: string | null;
  schedule?: string | null;
  organizer?: string | null;
  fee?: string | null;
  registration_closes?: string | null;
  is_featured?: boolean | null;
  lowest_price?: number | null;
  location_details?: string | null;
  organizer_contact_name?: string | null;
  organizer_email?: string | null;
  organizer_phone?: string | null;
  organizer_website?: string | null;
};

function formatEventDate(value: string | null) {
  if (!value) return 'Date to be announced';

  const date = new Date(value.length === 10 ? value + 'T00:00:00' : value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function toPublicEvent(row: MarathonRow): Marathon {
  const locationParts = (row.venue || '').split(',').map((part) => part.trim()).filter(Boolean);

  return {
    id: row.id,
    name: row.name?.trim() || 'Marathon',
    description: row.description?.trim() || `A running event in ${locationParts[0] || 'India'} with ${row.distance?.trim() || 'multiple'} race categories.`,
    date: formatEventDate(row.date),
    eventDate: row.date || '',
    city: locationParts[0] || 'India',
    state: locationParts.slice(1).join(', '),
    distance: row.distance?.trim() || 'Multiple distances',
    status: row.status?.trim() || 'Upcoming',
    registrationUrl: row.registration_link?.trim() || '',
    imageUrl: row.image?.trim() || '',
    schedule: row.schedule?.trim() || '',
    organizer: row.organizer?.trim() || '',
    entryFee: row.fee?.trim() || '',
    registrationCloses: row.registration_closes || '',
    isFeatured: Boolean(row.is_featured),
    lowestPrice: row.lowest_price,
    location: row.location_details?.trim() || row.venue?.trim() || '',
    organizerContactName: row.organizer_contact_name?.trim() || '',
    organizerEmail: row.organizer_email?.trim() || '',
    organizerPhone: row.organizer_phone?.trim() || '',
    organizerWebsite: row.organizer_website?.trim() || '',
  };
}

export default function EventsSection({ featuredOnly = true }: { featuredOnly?: boolean }) {
  const [events, setEvents] = useState<Marathon[]>(marathons);
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState<'upcoming' | 'completed' | 'all'>('all');
  const [eventRatings, setEventRatings] = useState<Record<number, { average: number; count: number }>>({});

  useEffect(() => {
    let active = true;

    const loadEvents = async () => {
      const indianToday = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
      }).format(new Date());
      const { data, error } = featuredOnly
        ? await supabase.from('marathons')
          .select('id,name,description,venue,location_details,date,distance,status,registration_link,image,organizer,organizer_contact_name,organizer_email,organizer_phone,organizer_website,lowest_price,fee,registration_closes,is_featured')
          .eq('is_featured', true).gte('date', indianToday).order('date', { ascending: true }).limit(6)
        : await supabase.from('marathons')
          .select('id,name,description,venue,date,distance,status,registration_link,image')
          .order('date', { ascending: true });

      if (error) {
        console.error('Could not load public marathon events:', error);
        return;
      }

      if (active) {
        const nextEvents = ((data || []) as MarathonRow[]).map(toPublicEvent);
        setEvents(nextEvents);
        const eventIds = nextEvents.map((event) => event.id).filter((id): id is number => typeof id === 'number');
        if (eventIds.length) {
          const { data: reviews, error: reviewError } = await supabase.from('event_feedback')
            .select('event_id,overall_rating').eq('is_verified', true).in('event_id', eventIds);
          if (!reviewError && active) {
            const totals: Record<number, { total: number; count: number }> = {};
            for (const review of reviews || []) {
              const current = totals[review.event_id] || { total: 0, count: 0 };
              current.total += review.overall_rating;
              current.count += 1;
              totals[review.event_id] = current;
            }
            setEventRatings(Object.fromEntries(Object.entries(totals).map(([id, value]) => [id, { average: value.total / value.count, count: value.count }])));
          }
        }
      }
    };

    void loadEvents();

    return () => {
      active = false;
    };
  }, []);

  const sortedEvents = useMemo(() => [...events].sort((a, b) => {
    const aPast = isPastEvent(a.eventDate || a.date);
    const bPast = isPastEvent(b.eventDate || b.date);
    if (aPast !== bPast) return Number(aPast) - Number(bPast);
    return new Date(a.eventDate || a.date).getTime() - new Date(b.eventDate || b.date).getTime();
  }), [events, featuredOnly]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sortedEvents
      .filter((event) => featuredOnly ? Boolean(event.isFeatured) && !isPastEvent(event.eventDate || event.date) : eventFilter === 'all' || (eventFilter === 'completed') === isPastEvent(event.eventDate || event.date))
      .filter((event) => `${event.name} ${event.city}`.toLowerCase().includes(query))
      .slice(0, featuredOnly ? 6 : undefined);
  }, [sortedEvents, search, eventFilter, featuredOnly]);

  return (
    <section className={`events-section page-width ${featuredOnly ? 'featured-events-section' : 'all-events-section'}`} id="events">
      <div className="section-heading">
        <div><span className="eyebrow">{featuredOnly ? 'HANDPICKED FOR RUNNERS' : 'RACES ACROSS INDIA'}</span><h2>{featuredOnly ? <>Featured <em>Events.</em></> : <>Find your next <em>race.</em></>}</h2></div>
        {featuredOnly && <Link className="text-link" href="/events">View all races <Icon name="arrow" size={17} /></Link>}
      </div>
      <div className="event-tools">
        <p>{featuredOnly ? 'Find a start line worth running for.' : 'Search events by name or city; switch between upcoming and completed races.'}</p>
        {!featuredOnly && <label className="search-box"><Icon name="search" size={19} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search event or city" aria-label="Search events by city or event" /></label>}
      </div>
      {!featuredOnly && <div className="event-filters" aria-label="Filter events">
        {(['upcoming', 'completed', 'all'] as const).map((filter) => <button type="button" className={eventFilter === filter ? 'is-active' : ''} onClick={() => setEventFilter(filter)} key={filter}>{filter === 'all' ? 'All races' : filter[0].toUpperCase() + filter.slice(1)}</button>)}
      </div>}
      <div className="event-grid" id={featuredOnly ? 'featured-events' : 'all-events'}>
        {filtered.length ? filtered.map((event, index) => (
          <article className={`event-card ${!featuredOnly ? 'event-list-card' : ''} ${isPastEvent(event.eventDate || event.date) ? 'event-card-completed' : ''}`} key={event.id ?? event.name}>
            {!featuredOnly && <div className="event-list-thumb">
              {event.imageUrl ? <img src={event.imageUrl} alt={`${event.name} event`} loading="lazy" /> : <span aria-hidden="true">🏃</span>}
            </div>}
            {featuredOnly && !isPastEvent(event.eventDate || event.date) && <div className={`event-art event-art-${(index % 3) + 1}`}>
              {event.imageUrl && <img className="event-art-image" src={event.imageUrl} alt={`${event.name} event`} loading="lazy" />}
              <span className="event-status">{event.status}</span>
              {!event.imageUrl && <span className="event-art-label">MARATHON<br />SAATHI</span>}
            </div>}
            <div className="event-info">
              {!featuredOnly ? <>
                <h3>{event.name}</h3>
                {event.description && <p className="event-list-description">{event.description}</p>}
                {event.id && (eventRatings[event.id] || isPastEvent(event.eventDate || event.date)) && <EventRatingLink eventId={event.id} rating={eventRatings[event.id]} />}
                <div className="event-actions">
                  {event.id && <Link className="event-action event-action-detail" href={`/events/${event.id}`}>View Details</Link>}
                  {!isPastEvent(event.eventDate || event.date) && event.registrationUrl && <a className="event-action event-action-register" href={event.registrationUrl} target="_blank" rel="noreferrer">Register Now <Icon name="arrow" size={15} /></a>}
                </div>
              </> : <>
              <div className="event-meta"><span><Icon name="calendar" size={15} /> {event.date}</span></div>
              <h3>{event.name}</h3>
              {event.id && (eventRatings[event.id] || isPastEvent(event.eventDate || event.date)) && <EventRatingLink eventId={event.id} rating={eventRatings[event.id]} />}
              <div className="event-distance-list">{event.distance.split(/[,|•]/).map((distance) => distance.trim()).filter(Boolean).slice(0, 4).map((distance) => <span key={distance}>{distance}</span>)}</div>
              <div className="featured-event-offer">
                <span>{event.registrationCloses ? `Registration closes ${formatEventDate(event.registrationCloses)}` : 'Registration open'}</span>
                <strong>{event.lowestPrice != null ? `₹${Number(event.lowestPrice).toLocaleString('en-IN')} onwards` : event.entryFee ? (/^\d+(\.\d+)?$/.test(event.entryFee) ? `₹${Number(event.entryFee).toLocaleString('en-IN')} onwards` : event.entryFee) : 'Price details soon'}</strong>
              </div>
              <div className="event-actions">
                {!isPastEvent(event.eventDate || event.date) && (event.registrationUrl ? <a className="event-action event-action-register" href={event.registrationUrl} target="_blank" rel="noreferrer">Register Now <Icon name="arrow" size={15} /></a> : <button type="button" className="event-action event-action-register" disabled title="Registration link will be added soon">Register Now</button>)}
                {event.id && <Link className="event-action event-action-detail" href={`/events/${event.id}`}>Event details</Link>}
              </div>
              <div className="featured-event-footer"><span className="featured-event-location"><Icon name="pin" size={15} /> {event.location || `${event.city}${event.state ? `, ${event.state}` : ''}`}</span><span className="featured-event-organizer"><span className="featured-organizer-label">ORGANIZER</span><span className="featured-event-organizer-name">{event.organizer || 'Organizer details soon'}</span></span></div>
              </>}
            </div>
          </article>
        )) : <div className="empty-state">{featuredOnly ? 'Featured races will appear here soon.' : `No races found for “${search}”. Try another city.`}</div>}
      </div>
    </section>
  );
}

function EventRatingLink({ eventId, rating }: { eventId: number; rating?: { average: number; count: number } }) {
  return <Link href={`/reviews?eventId=${eventId}`} className="event-rating-link" aria-label={rating ? `${rating.average.toFixed(1)} stars from ${rating.count} race reviews` : 'Write the first review for this race'}>
    <span aria-hidden="true">★</span> {rating ? <><strong>{rating.average.toFixed(1)}</strong><small>({rating.count} {rating.count === 1 ? 'review' : 'reviews'})</small></> : <small>Write the first review</small>}
  </Link>;
}

function isPastEvent(value: string) {
  if (!value) return false;
  const parsed = new Date(value.length === 10 ? `${value}T23:59:59` : value);
  return !Number.isNaN(parsed.getTime()) && parsed.getTime() < Date.now();
}

