'use client';

import React from 'react';
import Image from 'next/image';
import type { SiteTab } from '@/types/site';

type FooterProps = {
  onNavigate?: (tab: SiteTab) => void;
};

type IconName =
  | 'instagram'
  | 'facebook'
  | 'whatsapp'
  | 'mail'
  | 'arrow'
  | 'chevron';

const INTERNAL_TABS = new Set([
  'home',
  'events',
  'submit',
  'admin',
  'about',
  'terms',
  'privacy',
  'contact',
]);

function Icon({ name }: { name: IconName }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (name === 'instagram') {
    return (
      <svg {...common}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.4" cy="6.7" r="0.7" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === 'facebook') {
    return (
      <svg {...common}>
        <path d="M14.2 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.5-1.4H17V5.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2h-2.5V14h2.5v7" />
      </svg>
    );
  }

  if (name === 'whatsapp') {
    return (
      <svg {...common}>
        <path d="M20.4 3.6A11.7 11.7 0 0 0 12 1.1 11.7 11.7 0 0 0 1.9 18.7L1 23l4.4-1.1A11.7 11.7 0 0 0 12 22.9h.1A11.8 11.8 0 0 0 20.4 3.6Z" />
        <path d="M8.2 7.1c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.9c.1.3.1.5-.1.7l-.7.8c.6 1.1 1.5 2 2.6 2.6l.8-.7c.2-.2.4-.2.7-.1l1.9.8c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.4.2-1.3.5-1.7.5-2.2 0-6.7-3.9-6.7-6.7 0-.4.3-1.3.7-1.7Z" />
      </svg>
    );
  }

  if (name === 'mail') {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m4.5 7 7.5 6 7.5-6" />
      </svg>
    );
  }

  if (name === 'arrow') {
    return (
      <svg {...common}>
        <path d="M5 12h13" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

export default function Footer({
  onNavigate,
}: FooterProps) {
  const go = (tab: SiteTab) => {
    if (onNavigate && INTERNAL_TABS.has(tab)) {
      onNavigate(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    window.location.href = `/?tab=${encodeURIComponent(tab)}`;
  };

  return (
    <footer
      className="relative overflow-hidden bg-[#07101F] text-white"
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Very subtle background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-[-80px] h-72 w-72 rounded-full bg-orange-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-120px] left-[-100px] h-72 w-72 rounded-full bg-blue-500/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr] lg:gap-12">

          {/* Brand */}
          <div>
            <button
              type="button"
              onClick={() => go('home')}
              className="group flex items-center gap-3 text-left"
              aria-label="Go to MarathonSaathi Home"
            >
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-white/20 transition-transform duration-200 group-hover:-translate-y-0.5">
                <Image src="/marathonsaathi-logo.png" alt="" fill sizes="48px" className="object-contain p-0.5" />
              </span>

              <span>
                <span className="block text-[18px] font-extrabold tracking-[-0.03em]">
                  Marathon<span className="text-orange-500">Saathi</span>
                </span>
                <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Find Your Next Race
                </span>
              </span>
            </button>

            <p className="mt-5 max-w-md text-[13px] leading-6 text-slate-400">
              Find upcoming races, compare distances, discover event details
              and stay connected with the Indian running community.
            </p>

            <div className="mt-6">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Follow Us
              </p>

              <div className="flex gap-2.5">
                <a
                  href="https://instagram.com/marathonsaathi"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70 text-slate-400 transition hover:border-orange-500/50 hover:bg-orange-500 hover:text-white"
                >
                  <Icon name="instagram" />
                </a>

                <a
                  href="https://whatsapp.com/channel/0029VbCF30w4NVicqzcGS236"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70 text-slate-400 transition hover:border-orange-500/50 hover:bg-orange-500 hover:text-white"
                >
                  <Icon name="whatsapp" />
                </a>

                <a
                  href="https://facebook.com/marathonsaathi"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70 text-slate-400 transition hover:border-orange-500/50 hover:bg-orange-500 hover:text-white"
                >
                  <Icon name="facebook" />
                </a>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-white">
              Explore
            </h3>

            <nav className="space-y-3.5">
              <button
                type="button"
                onClick={() => go('home')}
                className="group flex items-center gap-2 text-[13px] font-medium text-slate-400 transition hover:text-white"
              >
                Home
                <span className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100">
                  <Icon name="arrow" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => go('events')}
                className="group flex items-center gap-2 text-[13px] font-medium text-slate-400 transition hover:text-white"
              >
                Browse Events
                <span className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100">
                  <Icon name="arrow" />
                </span>
              </button>

            </nav>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-white">
              MarathonSaathi
            </h3>

            <nav className="space-y-3.5">
              <button
                type="button"
                onClick={() => go('about')}
                className="group flex items-center gap-2 text-[13px] font-medium text-slate-400 transition hover:text-white"
              >
                About Us
                <span className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100">
                  <Icon name="arrow" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => go('privacy')}
                className="group flex items-center gap-2 text-[13px] font-medium text-slate-400 transition hover:text-white"
              >
                Privacy Policy
                <span className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100">
                  <Icon name="arrow" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => go('terms')}
                className="group flex items-center gap-2 text-[13px] font-medium text-slate-400 transition hover:text-white"
              >
                Terms &amp; Conditions
                <span className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100">
                  <Icon name="arrow" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => go('contact')}
                className="group flex items-center gap-2 text-[13px] font-medium text-slate-400 transition hover:text-white"
              >
                Contact Us
                <span className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100">
                  <Icon name="arrow" />
                </span>
              </button>
            </nav>
          </div>

          {/* Contact / Organizer */}
          <div>
            <h3 className="mb-5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-white">
              For Organizers
            </h3>

            <p className="text-[13px] leading-6 text-slate-400">
              Want runners to discover your race on MarathonSaathi?
            </p>

            <button
              type="button"
              onClick={() => go('submit')}
              className="group mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-[12px] font-extrabold text-white shadow-lg shadow-orange-600/15 transition hover:bg-orange-500"
            >
              List Your Event
              <span className="transition group-hover:translate-x-0.5">
                <Icon name="arrow" />
              </span>
            </button>

            <div className="mt-6 border-t border-slate-800 pt-5">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Contact
              </p>

              <a
                href="mailto:marathonsaathi@gmail.com"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-300 transition hover:text-orange-500"
              >
                <Icon name="mail" />
                <span className="whitespace-nowrap">marathonsaathi@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom legal strip */}
        <div className="mt-11 border-t border-slate-800 pt-6">
          <p className="mx-auto max-w-5xl text-center text-[11px] leading-5 text-slate-500">
            MarathonSaathi is a race discovery and community platform. We do
            not organize or manage events. Event information, registration and
            race outcomes are provided by the respective organizers.
          </p>

          <div className="mt-5 flex flex-col items-center justify-between gap-2 text-[10px] font-medium text-slate-600 sm:flex-row">
            <span>© 2026 MarathonSaathi. All rights reserved.</span>
            <span>Made for Indian Runners</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
