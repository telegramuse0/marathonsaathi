'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import SiteHeader from '@/components/premium/SiteHeader';
import SiteFooter from '@/components/premium/SiteFooter';

type ArchiveEvent = { id: number; name: string; venue: string | null; date: string; distance: string | null; photos_url: string | null; results_url: string | null };

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ResultsPage() {
  const [events, setEvents] = useState<ArchiveEvent[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadEvents = async () => {
      const { data, error } = await supabase.from('marathons')
        .select('id,name,venue,date,distance,photos_url,results_url')
        .order('date', { ascending: false });
      if (error) console.error('Could not load race archive:', error);
      if (active) {
        setEvents(((data || []) as ArchiveEvent[]).filter((event) => event.photos_url || event.results_url));
        setLoading(false);
      }
    };
    void loadEvents();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return events.filter((event) => `${event.name} ${event.venue || ''}`.toLowerCase().includes(query));
  }, [events, search]);

  return (
    <main>
      <SiteHeader />
      <section className="archive-intro page-width">
        <span className="eyebrow">RACE DAY, REMEMBERED</span>
        <h1>Results &amp; <em>Photos.</em></h1>
        <p>Search an event and open its official timing results or photo gallery.</p>
        <label className="search-box"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search event or city" aria-label="Search race results and photos" /></label>
      </section>
      <section className="archive-list page-width" aria-live="polite">
        {loading ? <p className="archive-empty">Loading race archive…</p> : filtered.length ? filtered.map((event) => {
          const city = (event.venue || '').split(',')[0]?.trim();
          return (
            <article className="archive-card" key={event.id}>
              <div className="archive-meta"><span>{formatDate(event.date)}</span>{city && <span>{city}</span>}</div>
              <h2>{event.name}</h2>
              {event.distance && <p>{event.distance}</p>}
              <div className="archive-actions">
                {event.photos_url && <a className="event-action event-action-secondary" href={event.photos_url} target="_blank" rel="noreferrer">Official Photos ↗</a>}
                {event.results_url && <a className="event-action" href={event.results_url} target="_blank" rel="noreferrer">Timing / Results ↗</a>}
              </div>
            </article>
          );
        }) : <div className="archive-empty"><h2>{search ? 'No events found' : 'Race archive is getting ready'}</h2><p>{search ? 'Try another event name or city.' : 'Official timing and event photos will appear here when added by the admin.'}</p></div>}
      </section>
      <SiteFooter />
    </main>
  );
}
