'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Footer from '@/components/Footer';

type ResultLinkItem = {
  id: number;
  eventId?: number;
  eventName?: string;
  resultsUrl?: string;
  photosUrl?: string;
  category?: string;
  date?: string;
};

type Marathon = {
  id: number;
  name: string;
  city: string;
  state: string;
  date: string;
};

const RESULTS_KEY = 'marathon_saathi_results_links';
const EVENTS_KEY = 'marathon_saathi_list';

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value
  );

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function ResultsPage() {
  const [results, setResults] = useState<ResultLinkItem[]>([]);
  const [events, setEvents] = useState<Marathon[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = () => {
      try {
        const savedResults = localStorage.getItem(RESULTS_KEY);
        const savedEvents = localStorage.getItem(EVENTS_KEY);

        setResults(savedResults ? JSON.parse(savedResults) : []);
        setEvents(savedEvents ? JSON.parse(savedEvents) : []);
      } catch {
        setResults([]);
        setEvents([]);
      }
    };

    load();

    window.addEventListener('storage', load);
    window.addEventListener('marathon-saathi-data-updated', load);

    return () => {
      window.removeEventListener('storage', load);
      window.removeEventListener('marathon-saathi-data-updated', load);
    };
  }, []);

  const eventMap = useMemo(
    () => new Map(events.map((event) => [event.id, event])),
    [events]
  );

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    return results.filter((item) => {
      const event = item.eventId ? eventMap.get(item.eventId) : undefined;

      const searchable = [
        item.eventName,
        item.category,
        event?.name,
        event?.city,
        event?.state,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return !query || searchable.includes(query);
    });
  }, [results, search, eventMap]);

  return (
    <main
      className="min-h-screen bg-slate-50 text-slate-900"
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-12">
          <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-orange-700">
            Race Results
          </span>

          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Results & Photos
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Search an event and quickly open the official race results or
            organizer-provided event photo gallery.
          </p>

          <div className="mt-7">
            <div className="relative">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search event name, city or race..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-12">
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-slate-500">
            {filteredResults.length} {filteredResults.length === 1 ? 'event' : 'events'} found
          </p>
        </div>

        {filteredResults.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-black">No results found</h2>
            <p className="mt-2 text-sm text-slate-500">
              Try another event name or city.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResults.map((item) => {
              const event = item.eventId
                ? eventMap.get(item.eventId)
                : undefined;

              const name = event?.name || item.eventName || 'Race Event';

              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        {event?.city && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase text-slate-600">
                            {event.city}
                          </span>
                        )}

                        {event?.date && (
                          <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black uppercase text-orange-700">
                            {formatDate(event.date)}
                          </span>
                        )}

                        {item.category && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase text-blue-700">
                            {item.category}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-3 break-words text-xl font-black tracking-tight sm:text-2xl">
                        {name}
                      </h2>

                      {event?.state && (
                        <p className="mt-1 text-sm text-slate-500">
                          {event.city}, {event.state}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:w-[310px]">
                      {item.resultsUrl && (
                        <a
                          href={item.resultsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                        >
                          Race Results
                        </a>
                      )}

                      {item.photosUrl && (
                        <a
                          href={item.photosUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-800 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                        >
                          Event Photos
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
