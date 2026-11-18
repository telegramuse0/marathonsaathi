'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SiteHeader from '@/components/premium/SiteHeader';
import SiteFooter from '@/components/premium/SiteFooter';
import { supabase } from '@/lib/supabase';

type EventRecord = {
  id: number;
  name: string;
  city: string;
  state: string;
  date: string;
  distance: string | string[];
  registrationUrl?: string;
  photosUrl?: string;
  resultsUrl?: string;
  organizer: string;
  badge?: string;
  rating?: number;

  // Event media
  bannerImage?: string;
  image?: string;
  imageUrl?: string;
  photoUrl?: string;

  // Admin / organizer details
  about?: string;
  venue?: string;
  entryFee?: string;
  schedule?: string;
  awards?: string;
  runnerBenefits?: string;

  // Optional organizer/contact fields if your event object already has them
  organizerEmail?: string;
  organizerPhone?: string;
  organizerWebsite?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
};

function formatDate(value: string) {
  const raw = String(value || '').trim();
  if (!raw) return 'Date TBA';

  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T00:00:00` : raw
  );

  if (Number.isNaN(date.getTime())) return 'Date TBA';

  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function splitDistances(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value
      .map(String)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getEventBanner(event: EventRecord) {
  return (
    event.bannerImage ||
    event.imageUrl ||
    event.image ||
    event.photoUrl ||
    ''
  );
}

function Icon({
  type,
}: {
  type:
    | 'calendar'
    | 'location'
    | 'distance'
    | 'organizer'
    | 'info'
    | 'clock'
    | 'phone'
    | 'mail'
    | 'globe'
    | 'instagram'
    | 'facebook'
    | 'whatsapp';
}) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (type === 'calendar') {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 9h18" />
      </svg>
    );
  }

  if (type === 'location') {
    return (
      <svg {...common}>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }

  if (type === 'distance') {
    return (
      <svg {...common}>
        <path d="M6 3v18M18 3v18M6 8h12M6 16h12" />
        <path d="M3 6h3M15 6h6M3 18h3M15 18h6" />
      </svg>
    );
  }

  if (type === 'organizer') {
    return (
      <svg {...common}>
        <circle cx="12" cy="7" r="3" />
        <path d="M5 21a7 7 0 0 1 14 0M4 12h16" />
      </svg>
    );
  }

  if (type === 'info') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 10v6M12 7h.01" />
      </svg>
    );
  }

  if (type === 'clock') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (type === 'phone') {
    return (
      <svg {...common}>
        <path d="M6.5 3.5 9 3l2 5-2 1.5a15 15 0 0 0 5.5 5.5L16 13l5 2-.5 2.5A3 3 0 0 1 17.5 20C10 19.5 4.5 14 4 6.5A3 3 0 0 1 6.5 3.5Z" />
      </svg>
    );
  }

  if (type === 'mail') {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  if (type === 'globe') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
      </svg>
    );
  }

  if (type === 'instagram') {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M17.5 6.5h.01" />
      </svg>
    );
  }

  if (type === 'facebook') {
    return (
      <svg {...common}>
        <path d="M14 8h3V4h-3a5 5 0 0 0-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9a1 1 0 0 1 1-1Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M20 4.5A9.5 9.5 0 0 0 4.8 17.7L4 21l3.4-.9A9.5 9.5 0 1 0 20 4.5Z" />
      <path d="M8 9.5c.5 3 3 5.5 6 6l1.5-1.5-2-1.2-1 .8a6.2 6.2 0 0 1-2.6-2.6l.8-1L9.5 8 8 9.5Z" />
    </svg>
  );
}

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<EventRecord | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadEvent = async () => {
      const id = Number(params?.id);
      if (!id) { setLoaded(true); return; }
      const { data, error } = await supabase.from('marathons').select('*').eq('id', id).maybeSingle();
      if (error) console.error('Could not load event details:', error);
      if (active && data) {
        const row = data as Record<string, unknown>;
        const venue = String(row.venue || '');
        const location = venue.split(',').map((part) => part.trim());
        setEvent({
          id: Number(row.id), name: String(row.name || ''), city: location[0] || 'India', state: location.slice(1).join(', '), rating: Number(row.rating || 5),
          date: String(row.date || ''), distance: String(row.distance || ''), registrationUrl: String(row.registration_link || ''),
          organizer: String(row.organizer || 'Event Organizer'), badge: String(row.status || 'Upcoming'), bannerImage: String(row.image || ''),
          about: String(row.description || ''), venue: String(row.location_details || ''), entryFee: String(row.fee || ''),
          schedule: String(row.schedule || ''), awards: String(row.awards || ''), runnerBenefits: String(row.runner_benefits || ''),
          photosUrl: String(row.photos_url || ''), resultsUrl: String(row.results_url || ''),
        });
      } else if (active) setEvent(null);
      if (active) setLoaded(true);
    };
    void loadEvent();
    return () => { active = false; };
  }, [params]);

  const distances = useMemo(
    () => splitDistances(event?.distance),
    [event]
  );

  if (!loaded) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-5 py-10">
          <div className="h-5 w-28 bg-slate-100 rounded mb-6 animate-pulse" />
          <div className="h-[380px] bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-5">
        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-900">Event Not Found</h1>
          <p className="text-sm text-slate-500 mt-2">
            This event is no longer available.
          </p>
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-5 bg-orange-600 text-white font-bold px-6 py-3 rounded-xl"
          >
            Back to Events
          </button>
        </div>
      </main>
    );
  }

  const banner = getEventBanner(event);

  const detailSections = [
    {
      key: 'about',
      title: 'ABOUT THIS EVENT',
      value: event.about,
      icon: 'info' as const,
    },
    {
      key: 'venue',
      title: 'VENUE & LOCATION',
      value: event.venue,
      icon: 'location' as const,
    },
    {
      key: 'schedule',
      title: 'EVENT SCHEDULE & KEY TIMINGS',
      value: event.schedule,
      icon: 'clock' as const,
    },
    {
      key: 'fees',
      title: 'ENTRY FEES & REGISTRATION',
      value: event.entryFee,
      icon: 'info' as const,
    },
    {
      key: 'awards',
      title: 'AWARDS & PRIZES',
      value: event.awards,
      icon: 'info' as const,
    },
    {
      key: 'benefits',
      title: 'RUNNER BENEFITS',
      value: event.runnerBenefits,
      icon: 'info' as const,
    },
  ].filter((item) => String(item.value || '').trim());

  const hasOrganizerContact =
    event.organizerPhone ||
    event.organizerEmail ||
    event.organizerWebsite ||
    event.instagram ||
    event.facebook ||
    event.whatsapp;

  return (
    <main className="min-h-screen bg-white text-slate-900" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* FONT + small global details-page polish */}
      <style jsx global>{`
        .ms-condensed {
          font-family:
            "Arial Narrow",
            "Roboto Condensed",
            "Helvetica Neue",
            Arial,
            sans-serif;
          letter-spacing: 0.035em;
        }

        .ms-body {
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }
      `}</style>

      <div className="ms-body">

        <SiteHeader />

        {/* Breadcrumb */}
        <div className="border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 text-xs text-slate-500">
            <button
              type="button"
              onClick={() => router.back()}
              className="hover:text-orange-600 transition font-semibold"
            >
              Events
            </button>
            <span className="mx-2">›</span>
            <span>{event.city}</span>
            <span className="mx-2">›</span>
            <strong className="text-slate-900">{event.name}</strong>
          </div>
        </div>

        {/* Hero banner */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-7">
          <div className="relative overflow-hidden rounded-2xl border border-slate-300 bg-slate-200 shadow-sm">
            {banner ? (
              <img
                src={banner}
                alt={`${event.name} banner`}
                className="block w-full h-[250px] sm:h-[360px] lg:h-[430px] object-cover"
              />
            ) : (
              <div className="h-[250px] sm:h-[360px] lg:h-[430px] bg-slate-200 flex items-center justify-center">
                <div className="text-center">
                  <p className="ms-condensed text-2xl font-black text-slate-400">
                    EVENT BANNER
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Banner will appear when provided by organizer or admin.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Title */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-7 pb-6 text-center">
          <div className="flex justify-center flex-wrap gap-2 mb-3">
            {event.badge && (
              <span className="bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                {event.badge}
              </span>
            )}
          </div>

          <h1 className="ms-condensed text-3xl sm:text-4xl lg:text-5xl font-black uppercase">
            {event.name}
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Organized by{' '}
            <strong className="text-slate-800">{event.organizer}</strong>
          </p>
        </section>

        {/* Quick facts */}
        <section className="border-y border-slate-200 bg-slate-50">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 items-center">
                <div className="w-11 h-11 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                  <Icon type="calendar" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">
                    Date
                  </p>
                  <p className="font-bold text-sm mt-1 break-words">
                    {formatDate(event.date)}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 items-center">
                <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Icon type="location" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">
                    Location
                  </p>
                  <p className="font-bold text-sm mt-1 break-words">
                    {event.city}, {event.state}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 items-center">
                <div className="w-11 h-11 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <Icon type="distance" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">
                    Distances
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {distances.length ? (
                      distances.map((distance) => (
                        <span
                          key={distance}
                          className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold"
                        >
                          {distance}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm font-bold">TBA</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 items-center">
                <div className="w-11 h-11 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
                  <Icon type="organizer" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">
                    Organizer
                  </p>
                  <p className="font-bold text-sm mt-1 break-words">
                    {event.organizer}
                  </p>
                </div>
              </div>

            </div>

            {/* Primary action */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              {event.registrationUrl && (
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-500 text-white font-black uppercase px-8 py-3.5 rounded-xl text-sm transition"
                >
                  Register Now
                </a>
              )}

              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-8 py-3.5 rounded-xl text-sm transition"
              >
                Back to Events
              </button>
            </div>
          </div>
        </section>

        {/* Accordion content */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
          <div className="space-y-5">

            {detailSections.map((section) => {
              const isOpen = openSection === section.key;

              return (
                <article
                  key={section.key}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpenSection(isOpen ? null : section.key)
                    }
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-7 py-6 text-left hover:bg-slate-50 transition"
                  >
                    <span className="flex items-center gap-4 min-w-0">
                      <span className="w-11 h-11 rounded-full bg-slate-100 text-orange-600 flex items-center justify-center shrink-0">
                        <Icon type={section.icon} />
                      </span>

                      <span className="ms-condensed text-xl sm:text-2xl font-black text-slate-900">
                        {section.title}
                      </span>
                    </span>

                    <span
                      className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      <span className="text-xl leading-none">⌄</span>
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-7 pb-7">
                      <div className="border-t border-slate-100 pt-5">
                        <p className="text-sm sm:text-base text-slate-600 leading-7 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                          {section.value}
                        </p>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}

            {/* Organizer information */}
            <article className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <button
                type="button"
                aria-expanded={openSection === 'organizer'}
                onClick={() =>
                  setOpenSection(
                    openSection === 'organizer' ? null : 'organizer'
                  )
                }
                className="w-full flex items-center justify-between gap-4 px-5 sm:px-7 py-6 text-left hover:bg-slate-50 transition"
              >
                <span className="flex items-center gap-4 min-w-0">
                  <span className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Icon type="organizer" />
                  </span>
                  <span className="ms-condensed text-xl sm:text-2xl font-black">
                    CONTACT & ORGANIZER INFO
                  </span>
                </span>

                <span
                  className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 transition-transform ${
                    openSection === 'organizer' ? 'rotate-180' : ''
                  }`}
                >
                  <span className="text-xl leading-none">⌄</span>
                </span>
              </button>

              {openSection === 'organizer' && (
                <div className="px-5 sm:px-7 pb-7">
                  <div className="border-t border-slate-100 pt-5 space-y-5">

                    <div>
                      <p className="ms-condensed text-lg font-black uppercase">
                        Organizer
                      </p>
                      <p className="text-sm font-semibold text-slate-700 mt-2">
                        {event.organizer}
                      </p>
                    </div>

                    {hasOrganizerContact ? (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {event.organizerPhone && (
                          <a
                            href={`tel:${event.organizerPhone}`}
                            className="flex items-center gap-3 border border-slate-200 rounded-xl p-4 hover:border-orange-300 transition"
                          >
                            <Icon type="phone" />
                            <span className="text-sm font-semibold break-all">
                              {event.organizerPhone}
                            </span>
                          </a>
                        )}

                        {event.organizerEmail && (
                          <a
                            href={`mailto:${event.organizerEmail}`}
                            className="flex items-center gap-3 border border-slate-200 rounded-xl p-4 hover:border-orange-300 transition"
                          >
                            <Icon type="mail" />
                            <span className="text-sm font-semibold break-all">
                              {event.organizerEmail}
                            </span>
                          </a>
                        )}

                        {event.organizerWebsite && (
                          <a
                            href={event.organizerWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 border border-slate-200 rounded-xl p-4 hover:border-orange-300 transition"
                          >
                            <Icon type="globe" />
                            <span className="text-sm font-semibold break-all">
                              Visit Official Website
                            </span>
                          </a>
                        )}

                        {event.whatsapp && (
                          <a
                            href={event.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 border border-slate-200 rounded-xl p-4 hover:border-orange-300 transition"
                          >
                            <Icon type="whatsapp" />
                            <span className="text-sm font-semibold">
                              WhatsApp
                            </span>
                          </a>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">
                        Organizer contact details will be shown here when provided by the organizer or admin.
                      </p>
                    )}

                    {(event.instagram || event.facebook) && (
                      <div>
                        <p className="ms-condensed text-lg font-black uppercase mb-3">
                          Follow the Organizer
                        </p>

                        <div className="flex flex-wrap gap-3">
                          {event.instagram && (
                            <a
                              href={event.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:text-orange-600 hover:border-orange-300 transition"
                              aria-label="Instagram"
                            >
                              <Icon type="instagram" />
                            </a>
                          )}

                          {event.facebook && (
                            <a
                              href={event.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:text-orange-600 hover:border-orange-300 transition"
                              aria-label="Facebook"
                            >
                              <Icon type="facebook" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </article>

          </div>
        </section>

        {/* Final registration CTA */}
        {(event.photosUrl || event.resultsUrl) && (
          <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-8">
            <div className="flex flex-wrap gap-3">
              {event.photosUrl && <a href={event.photosUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center border border-slate-200 text-slate-800 font-bold px-6 py-3 rounded-xl text-sm">Official Photos</a>}
              {event.resultsUrl && <a href={event.resultsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-xl text-sm">Timing / Results</a>}
            </div>
          </section>
        )}
        {event.registrationUrl && (
          <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-12">
            <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div>
                <h2 className="ms-condensed text-2xl sm:text-3xl font-black text-white uppercase">
                  Ready to Run?
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Complete your registration on the official event website.
                </p>
              </div>

              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center justify-center bg-orange-600 hover:bg-orange-500 text-white font-black uppercase px-7 py-3.5 rounded-xl text-sm transition"
              >
                Register Now
              </a>
            </div>
          </section>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
