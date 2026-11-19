'use client';

import React, { useState } from 'react';

type NavbarTab = 'home' | 'events' | 'calendar' | 'submit' | 'admin' | 'about' | 'terms' | 'privacy' | 'contact';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: NavbarTab) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export default function Navbar({ activeTab, setActiveTab, isDarkMode, setIsDarkMode }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: NavbarTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${
      isDarkMode 
        ? 'bg-slate-950/90 border-slate-800 text-white' 
        : 'bg-white/90 border-slate-200 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo with Professional Vector Icon */}
        <div 
          onClick={() => handleTabClick('home')} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-orange-600/30 group-hover:scale-105 transition">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v7h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-2 0-3.7-1.1-4.5-2.7l-1-2c-.4-.8-1.2-1.3-2.1-1.3-.3 0-.6.1-.9.2L6 8.5V13h2V9.6l1.8-.7z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none">
              Marathon<span className="text-orange-500">Saathi</span>
            </h1>
            <p className={`text-[10px] font-bold tracking-wider uppercase mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Find Your Next Race
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs (Submit Race & Contact Us removed from header) */}
        <nav className="hidden md:flex items-center space-x-2 font-bold text-sm">
          <button 
            onClick={() => handleTabClick('home')} 
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'home' 
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30' 
                : isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => handleTabClick('events')} 
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'events' 
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30' 
                : isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Browse Events
          </button>
          <button 
            onClick={() => handleTabClick('calendar')} 
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'calendar' 
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30' 
                : isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Race Calendar
          </button>
        </nav>

        {/* Right Actions: Theme Toggle & Mobile Hamburger */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle Theme"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition border ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
            className={`md:hidden w-10 h-10 rounded-xl flex items-center justify-center border transition ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
            }`}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              ) : (
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b px-6 py-4 space-y-2 ${
          isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <button 
            onClick={() => handleTabClick('home')} 
            className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${activeTab === 'home' ? 'bg-orange-600 text-white' : 'hover:bg-slate-500/10'}`}
          >
            Home
          </button>
          <button 
            onClick={() => handleTabClick('events')} 
            className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${activeTab === 'events' ? 'bg-orange-600 text-white' : 'hover:bg-slate-500/10'}`}
          >
            Browse Events
          </button>
          <button 
            onClick={() => handleTabClick('calendar')} 
            className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${activeTab === 'calendar' ? 'bg-orange-600 text-white' : 'hover:bg-slate-500/10'}`}
          >
            Race Calendar
          </button>
        </div>
      )}
    </header>
  );
}
