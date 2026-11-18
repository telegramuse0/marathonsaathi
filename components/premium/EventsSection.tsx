'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Icon } from './Icon';
import { marathons, type Marathon } from './data';

type MarathonRow = {
  id: number;
  name: string | null;
  venue: string | null;
  date: string | null;
  distance: string | null;
  status: string | null;
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
    date: formatEventDate(row.date),
    city: locationParts[0] || 'India',
    distance: row.distance?.trim() || 'Multiple distances',
    status: row.status?.trim() || 'Upcoming',
  };
}

export default function EventsSection() {
  const [events, setEvents] = useState<Marathon[]>(marathons);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;

    const loadEvents = async () => {
      const { data, error } = await supabase
        .from('marathons')
        .select('id,name,venue,date,distance,status')
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

  const filtered = useMemo(
    () => events.filter((event) => `${event.name} ${event.city}`.toLowerCase().includes(search.toLowerCase())),
    [events, search],
  );

  return (
    <section className="events-section page-width" id="events">
      <div className="section-heading">
        <div><span className="eyebrow">THE ROAD IS CALLING</span><h2>Find your next <em>race.</em></h2></div>
        <a className="text-link" href="#all-events">View all events <Icon name="arrow" size={17} /></a>
      </div>
      <div className="event-tools">
        <p>Good runs start with a date on the calendar.</p>
        <label className="search-box"><Icon name="search" size={19} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by city or event" aria-label="Search marathons by city or event" /><kbd>⌘ K</kbd></label>
      </div>
      <div className="event-grid" id="all-events">
        {filtered.length ? filtered.map((event, index) => (
          <article className="event-card" key={event.id ?? event.name}>
            <div className={`event-art event-art-${index + 1}`}><span className="event-status">{event.status}</span><span className="event-number">{String(index + 1).padStart(2, '0')}</span><span className="event-art-label">MARATHON<br />SAATHI</span></div>
            <div className="event-info">
              <div className="event-meta"><span><Icon name="calendar" size={15} /> {event.date}</span><span><Icon name="pin" size={15} /> {event.city}</span></div>
              <h3>{event.name}</h3>
              <div className="event-bottom"><span>{event.distance}</span><a href="#community" aria-label={`Learn more about ${event.name}`}><Icon name="arrow" size={18} /></a></div>
            </div>
          </article>
        )) : <div className="empty-state">No races found for “{search}”. Try another city.</div>}
      </div>
    </section>
  );
}
