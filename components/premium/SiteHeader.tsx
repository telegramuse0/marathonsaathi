'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from './Icon';

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner">
          <Link className="brand" href="/" aria-label="MarathonSaathi home">
          <Image src="/logo.png" alt="" width={48} height={48} className="brand-logo" />
          <span className="brand-copy"><strong>Marathon<span>Saathi</span></strong><small>Har Race Ka Saathi</small></span>
          </Link>
        <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <Link href="/" onClick={closeMenu}>Home</Link>
          <Link href="/results" onClick={closeMenu}>Results &amp; Photos</Link>
          <Link href="/events" className="nav-cta" onClick={closeMenu}>Find a race <Icon name="arrow" size={16} /></Link>
        </nav>
      </div>
    </header>
  );
}
