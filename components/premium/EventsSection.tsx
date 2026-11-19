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
  };
}

function calendarUrl(event: Marathon) {
  const date = (event.eventDate || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return '';
  const [year, month, day] = date.split('-').map(Number);
  const start = new Date(Date.UTC(year, month - 1, day));
  const end = new Date(Date.UTC(year, month - 1, day + 1));
  const compact = (value: Date) => value.toISOString().slice(0, 10).replaceAll('-', '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.name,
    dates: `${compact(start)}/${compact(end)}`,
    details: [event.description, event.registrationUrl ? `Registration: ${event.registrationUrl}` : ''].filter(Boolean).join('\n\n'),
    location: [event.city, event.state].filter(Boolean).join(', '),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function EventsSection({ featuredOnly = true }: { featuredOnly?: boolean }) {
  const [events, setEvents] = useState<Marathon[]>(marathons);
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState<'upcoming' | 'completed' | 'all'>('all');

  useEffect(() => {
    let active = true;

    const loadEvents = async () => {
      const { data, error } = await supabase
        .from('marathons')
        .select('id,name,description,venue,date,distance,status,registration_link,image,schedule')
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
    const aFeatured = a.status.toLowerCase().includes('featured') ? 0 : 1;
    const bFeatured = b.status.toLowerCase().includes('featured') ? 0 : 1;
    if (featuredOnly && aFeatured !== bFeatured) return aFeatured - bFeatured;
    return new Date(a.eventDate || a.date).getTime() - new Date(b.eventDate || b.date).getTime();
  }), [events, featuredOnly]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sortedEvents
      .filter((event) => featuredOnly ? !isPastEvent(event.eventDate || event.date) : eventFilter === 'all' || (eventFilter === 'completed') === isPastEvent(event.eventDate || event.date))
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
                  {!isPastEvent(event.eventDate || event.date) && calendarUrl(event) && <a className="event-action event-action-calendar" href={calendarUrl(event)} target="_blank" rel="noreferrer"><Icon name="calendar" size={15} /> Add to Calendar</a>}
                </div>
              </> : <>
              <div className="event-meta"><span><Icon name="calendar" size={15} /> {event.date}</span><span><Icon name="pin" size={15} /> {event.city}</span></div>
              <h3>{event.name}</h3>
              <div className="event-bottom"><span>{event.distance}</span></div>
              <div className="event-actions">
                {event.id && <Link className="event-action event-action-detail" href={`/events/${event.id}`}>View Details</Link>}
                {!isPastEvent(event.eventDate || event.date) && event.registrationUrl && <a className="event-action event-action-register" href={event.registrationUrl} target="_blank" rel="noreferrer">Register Now <Icon name="arrow" size={15} /></a>}
                {!isPastEvent(event.eventDate || event.date) && calendarUrl(event) && <a className="event-action event-action-calendar" href={calendarUrl(event)} target="_blank" rel="noreferrer"><Icon name="calendar" size={15} /> Add to Calendar</a>}
              </div>
              </>}
            </div>
          </article>
        )) : <div className="empty-state">No races found for “{search}”. Try another city.</div>}
      </div>
    </section>
  );
}

function isPastEvent(value: string) {
  if (!value) return false;
  const parsed = new Date(value.length === 10 ? `${value}T23:59:59` : value);
  return !Number.isNaN(parsed.getTime()) && parsed.getTime() < Date.now();
}
