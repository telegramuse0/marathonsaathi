'use client';

import { useEffect, useMemo, useState } from 'react';
import EventFeedback from '@/components/premium/EventFeedback';
import SiteFooter from '@/components/premium/SiteFooter';
import SiteHeader from '@/components/premium/SiteHeader';
import { supabase } from '@/lib/supabase';

type Race = { id: number; name: string; venue: string | null; date: string | null; distance: string | null; image: string | null };

function indiaToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

function displayDate(value: string | null) {
  if (!value) return 'Date not listed';
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function EventReviewsPage() {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  useEffect(() => {
    let active = true;
    const loadRaces = async () => {
      const { data, error } = await supabase.from('marathons').select('id,name,venue,date,distance,image').order('date', { ascending: false }).limit(300);
      if (active) {
        if (!error) {
          const today = indiaToday();
          const completed = ((data || []) as Race[]).filter((race) => race.date && race.date.slice(0, 10) < today);
          setRaces(completed);
          const requestedId = Number(new URLSearchParams(window.location.search).get('eventId'));
          if (requestedId) setSelectedRace(completed.find((race) => race.id === requestedId) || null);
        }
        setLoading(false);
      }
    };
    void loadRaces();
    return () => { active = false; };
  }, []);

  const filteredRaces = useMemo(() => {
    const term = search.trim().toLowerCase();
    return races.filter((race) => `${race.name} ${race.venue} ${race.distance}`.toLowerCase().includes(term));
  }, [races, search]);

  const chooseRace = (race: Race | null) => {
    setSelectedRace(race);
    window.history.replaceState(null, '', race ? `/reviews?eventId=${race.id}` : '/reviews');
  };

  const distances = selectedRace?.distance?.split(/[,|•]/).map((item) => item.trim()).filter(Boolean) || [];

  return <main className="min-h-screen bg-[#faf8f4]">
    <SiteHeader />
    <section className="review-hub page-width">
      <div className="review-hub-intro">
        <span className="eyebrow">RUNNER FEEDBACK · RACE EXPERIENCES</span>
        <h1>{selectedRace ? <>Share your <em>race review.</em></> : <>Find the event you want to <em>review.</em></>}</h1>
        <p>{selectedRace ? 'Apna honest experience share karein, jisse agle runners ko race choose karne me madad mile.' : 'Event search karein ya recent races me se chunein, phir apna honest feedback share karein.'}</p>
      </div>

      {!selectedRace ? <>
        <label className="review-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Enter the event name" aria-label="Search event name" /></label>
        <div className="review-recent-heading"><div><span className="eyebrow">SHARE YOUR RACE EXPERIENCE</span><h2>Recent events</h2></div><span>{filteredRaces.length} {filteredRaces.length === 1 ? 'event' : 'events'}</span></div>
        {loading ? <div className="review-empty">Loading recent events…</div> : filteredRaces.length ? <div className="review-race-list">
          {filteredRaces.map((race) => <article key={race.id} className="review-race-item">
            <button type="button" className="review-race-select" onClick={() => chooseRace(race)} aria-label={`Review ${race.name}`}>
              <span className="review-race-thumb">{race.image ? <img src={race.image} alt={`${race.name} event`} loading="lazy" /> : <span aria-hidden="true">🏃</span>}</span>
              <span className="review-race-copy"><strong>{race.name}</strong><span>{displayDate(race.date)} · {race.venue || 'Location not listed'}</span><small>{race.distance || 'Race distance not listed'}</small></span>
              <span className="review-race-arrow" aria-hidden="true">→</span>
            </button>
          </article>)}
        </div> : <div className="review-empty">{races.length ? 'No events match that search. Try a different event name or city.' : 'Recent completed races will appear here after they are added.'}</div>}
      </> : <>
        <button type="button" className="review-back-link" onClick={() => chooseRace(null)}>← Browse recent events</button>
        <div className="review-selected-race"><div className="review-selected-image">{selectedRace.image ? <img src={selectedRace.image} alt={`${selectedRace.name} event`} /> : <span aria-hidden="true">🏃</span>}</div><div><span className="eyebrow">SELECTED EVENT</span><h2>{selectedRace.name}</h2><p>{displayDate(selectedRace.date)} · {selectedRace.venue || 'Location not listed'}</p><small>{selectedRace.distance}</small></div></div>
        <EventFeedback eventId={selectedRace.id} eventName={selectedRace.name} eventDate={selectedRace.date || ''} eventImage={selectedRace.image || ''} eventDistances={distances} />
      </>}
    </section>
    <SiteFooter />
  </main>;
}
