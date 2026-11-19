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
  };
}

export default function EventsSection({ featuredOnly = true }: { featuredOnly?: boolean }) {
  const [events, setEvents] = useState<Marathon[]>(marathons);
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState<'upcoming' | 'completed' | 'all'>('all');

  useEffect(() => {
    let active = true;

    const loadEvents = async () => {
      const indianToday = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
      }).format(new Date());
      const { data, error } = featuredOnly
        ? await supabase.from('marathons')
          .select('id,name,venue,date,distance,status,registration_link,image,organizer,fee,registration_closes,is_featured')
          .eq('is_featured', true).gte('date', indianToday).order('date', { ascending: true }).limit(60)
        : await supabase.from('marathons')
          .select('id,name,description,venue,date,distance,status,registration_link,image')
          .order('date', { ascending: true });

      if (error) {
        console.error('Could not load public marathon events:', error);
        return;
      }

      if (active) {
        setEvents(((data || []) as MarathonRow[]).map(toPublicEvent));
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
      .slice(0, featuredOnly ? 3 : undefined);
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
              <span className="event-status">{event.status}</span><span className="event-number">{String(index + 1).padStart(2, '0')}</span>
              {!event.imageUrl && <span className="event-art-label">MARATHON<br />SAATHI</span>}
            </div>}
            <div className="event-info">
              {!featuredOnly ? <>
                <h3>{event.name}</h3>
                {event.description && <p className="event-list-description">{event.description}</p>}
                <div className="event-actions">
                  {event.id && <Link className="event-action event-action-detail" href={`/events/${event.id}`}>View Details</Link>}
                  {!isPastEvent(event.eventDate || event.date) && event.registrationUrl && <a className="event-action event-action-register" href={event.registrationUrl} target="_blank" rel="noreferrer">Register Now <Icon name="arrow" size={15} /></a>}
                </div>
              </> : <>
              <div className="event-meta"><span><Icon name="calendar" size={15} /> {event.date}</span><span><Icon name="pin" size={15} /> {event.city}</span></div>
              <h3>{event.name}</h3>
              <div className="event-distance-list">{event.distance.split(/[,|•]/).map((distance) => distance.trim()).filter(Boolean).slice(0, 4).map((distance) => <span key={distance}>{distance}</span>)}</div>
              <div className="event-card-details">
                {event.organizer && <span>{event.organizer}</span>}
                <div className="event-card-price-info">
                  <strong>{event.entryFee ? (/^\d+(\.\d+)?$/.test(event.entryFee) ? `₹${Number(event.entryFee).toLocaleString('en-IN')} onwards` : event.entryFee) : 'Fee details soon'}</strong>
                  <span>{event.registrationCloses ? `Registration closes ${formatEventDate(event.registrationCloses)}` : 'Registration open'}</span>
                </div>
              </div>
              <div className="event-actions">
                {event.id && <Link className="event-action event-action-detail" href={`/events/${event.id}`}>View Details</Link>}
                {!isPastEvent(event.eventDate || event.date) && event.registrationUrl && <a className="event-action event-action-register" href={event.registrationUrl} target="_blank" rel="noreferrer">Register Now <Icon name="arrow" size={15} /></a>}
              </div>
              </>}
            </div>
          </article>
        )) : <div className="empty-state">{featuredOnly ? 'Featured races will appear here soon.' : `No races found for “${search}”. Try another city.`}</div>}
      </div>
    </section>
  );
}

function isPastEvent(value: string) {
  if (!value) return false;
  const parsed = new Date(value.length === 10 ? `${value}T23:59:59` : value);
  return !Number.isNaN(parsed.getTime()) && parsed.getTime() < Date.now();
}
