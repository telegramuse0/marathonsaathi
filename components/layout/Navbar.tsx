'use client';

import React from 'react';
import Image from 'next/image';

type Tab =
  | 'home'
  | 'events'
  | 'calendar'
  | 'results'
  | 'submit'
  | 'admin'
  | 'about'
  | 'terms'
  | 'privacy'
  | 'contact';

type NavbarProps = {
  activeTab: string;
  isDarkMode: boolean;
  mobileMenuOpen: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleTabChange: (tab: Tab) => void;
};

const navItems: { label: string; tab: Tab }[] = [
  { label: 'Home', tab: 'home' },
  { label: 'Browse Events', tab: 'events' },
  { label: 'Race Calendar', tab: 'calendar' },
  { label: 'Results & Photos', tab: 'results' },
];

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M20.5 15.3A8.5 8.5 0 0 1 8.7 3.5 8.5 8.5 0 1 0 20.5 15.3Z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export default function Navbar({
  activeTab,
  isDarkMode,
  mobileMenuOpen,
  setIsDarkMode,
  setMobileMenuOpen,
  handleTabChange,
}: NavbarProps) {
  const navigate = (tab: Tab) => {
    handleTabChange(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors ${
        isDarkMode
          ? 'bg-slate-950/90 border-slate-800 text-white'
          : 'bg-white/95 border-slate-200 text-slate-900'
      }`}
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate('home')}
          className="group flex items-center gap-3 text-left"
          aria-label="MarathonSaathi Home"
        >
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition-transform group-hover:-translate-y-0.5">
            <Image src="/marathonsaathi-logo.png" alt="" fill sizes="44px" className="object-contain p-0.5" />
          </span>

          <span className="leading-none">
            <span className="block text-[18px] font-extrabold tracking-[-0.04em]">
              Marathon<span className="text-orange-600">Saathi</span>
            </span>
            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Har Race Ka Saathi
            </span>
          </span>
        </button>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = activeTab === item.tab;

            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => navigate(item.tab)}
                className={`rounded-lg px-4 py-2.5 text-[13px] font-bold transition ${
                  active
                    ? isDarkMode
                      ? 'bg-slate-800 text-white'
                      : 'bg-orange-50 text-orange-700'
                    : isDarkMode
                      ? 'text-slate-400 hover:bg-slate-900 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => navigate('submit')}
            className="ml-2 rounded-lg bg-orange-600 px-4 py-2.5 text-[13px] font-extrabold text-white shadow-sm shadow-orange-600/20 transition hover:bg-orange-500"
          >
            List Your Event
          </button>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDarkMode((current) => !current)}
            aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDarkMode ? 'Light theme' : 'Dark theme'}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
              isDarkMode
                ? 'border-slate-700 bg-slate-900 text-amber-300 hover:border-slate-600'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border md:hidden ${
              isDarkMode
                ? 'border-slate-700 bg-slate-900 text-slate-200'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div
          className={`border-t px-5 pb-5 pt-3 md:hidden ${
            isDarkMode
              ? 'border-slate-800 bg-slate-950'
              : 'border-slate-100 bg-white'
          }`}
        >
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = activeTab === item.tab;

              return (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() => navigate(item.tab)}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                    active
                      ? isDarkMode
                        ? 'bg-slate-800 text-white'
                        : 'bg-orange-50 text-orange-700'
                      : isDarkMode
                        ? 'text-slate-300 hover:bg-slate-900'
                        : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => navigate('submit')}
              className="mt-2 w-full rounded-xl bg-orange-600 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-orange-500"
            >
              List Your Event
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
