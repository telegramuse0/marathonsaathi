"use client";

import { useMemo, useState } from "react";

type IconName = "arrow" | "calendar" | "pin" | "search" | "spark" | "shoe" | "trophy" | "camera" | "bag" | "users" | "menu" | "close" | "whatsapp" | "facebook" | "instagram" | "mail";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></>,
    shoe: <><path d="M3 16.5c2.6 0 4.4-.5 6-2.5l1.5-2 3.4 2.2a10 10 0 0 0 5.6 1.7H21v4H3v-3.4Z" /><path d="m10 14 2 1M7 16l2 .2M13 12l2-3 2 2" /></>,
    trophy: <><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" /><path d="M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4" /></>,
    camera: <><path d="M4 7h3l1.5-2h7L17 7h3v12H4z" /><circle cx="12" cy="13" r="3.5" /></>,
    bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-1a6 6 0 0 1 12 0v1H3ZM16 5.2a3 3 0 0 1 0 5.7M18 14a5 5 0 0 1 3 4.6v1h-3" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    whatsapp: <><path d="M20 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-4A8 8 0 1 1 20 11.5Z" /><path d="M9 8.5c.5 2.5 2 4 4.5 5l1-1 2 1c-.2 1.3-1.2 2-2.5 2-3.5-.5-6-3-6.5-6.5 0-1.3.7-2.3 2-2.5l1 2-1 1Z" /></>,
    facebook: <path d="M14 8h3V4h-3a5 5 0 0 0-5 5v2H6v4h3v5h4v-5h3l1-4h-4V9a1 1 0 0 1 1-1Z" />,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

const marathons = [
  { name: "Delhi Marathon", date: "12 Oct 2026", city: "New Delhi", distance: "Multiple distances", status: "Featured" },
  { name: "Mumbai Marathon", date: "20 Nov 2026", city: "Mumbai", distance: "Half & full marathon", status: "Coming up" },
  { name: "Kolkata Marathon", date: "15 Dec 2026", city: "Kolkata", distance: "Multiple distances", status: "Open" },
];

const shortcuts: { title: string; description: string; icon: IconName; href: string; tone: string }[] = [
  { title: "Discover events", description: "Find your next start line", icon: "calendar", href: "#events", tone: "orange" },
  { title: "Track results", description: "Celebrate every finish", icon: "trophy", href: "#results", tone: "blue" },
  { title: "Event photos", description: "Relive race day", icon: "camera", href: "#photos", tone: "green" },
  { title: "Runner’s Store", description: "Gear up for the miles", icon: "bag", href: "#store", tone: "sand" },
  { title: "Join community", description: "Run farther, together", icon: "users", href: "#community", tone: "lavender" },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const filtered = useMemo(() => marathons.filter((event) =>
    `${event.name} ${event.city}`.toLowerCase().includes(search.toLowerCase())
  ), [search]);

  return (
    <main>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#home" aria-label="MarathonSaathi home">
            <img src="/logo.png" alt="" className="brand-logo" />
            <span className="brand-copy"><strong>Marathon<span>Saathi</span></strong><small>Har Race Ka Saathi</small></span>
          </a>
          <button className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? "close" : "menu"} /></button>
          <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a><a href="#events" onClick={() => setMenuOpen(false)}>Marathons</a><a href="#results" onClick={() => setMenuOpen(false)}>Results</a><a href="#photos" onClick={() => setMenuOpen(false)}>Photos</a><a href="#community" onClick={() => setMenuOpen(false)}>Community</a>
            <a href="#events" className="nav-cta" onClick={() => setMenuOpen(false)}>Find a race <Icon name="arrow" size={16} /></a>
          </nav>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-content page-width">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow"><span className="eyebrow-dot" /> INDIA’S RUNNING COMMUNITY</div>
            <h1>Every race has<br />a <em>story.</em> Find yours.</h1>
            <p>Discover marathons across India, find your people, and make every finish line feel closer.</p>
            <div className="hero-actions"><a className="button button-orange" href="#events">Explore marathons <Icon name="arrow" /></a><a className="button button-glass" href="#community"><Icon name="users" /> Join the community</a></div>
            <div className="hero-note"><span className="mini-avatars"><i>R</i><i>A</i><i>M</i></span><span>Made for every kind of runner</span></div>
          </div>
          <div className="hero-stamp"><span>RUN<br />YOUR<br />INDIA</span><b>✳</b></div>
          <div className="hero-caption"><span>01 / 03</span><i /> FIND YOUR NEXT START LINE</div>
        </div>
        <div className="tricolor-rule"><i /><i /><i /></div>
      </section>

      <section className="hub-section page-width" aria-labelledby="hub-title">
        <div className="hub-card">
          <div className="hub-heading"><div><span className="eyebrow">YOUR RUNNER HUB</span><h2 id="hub-title">One place. <em>Every mile.</em></h2></div><span className="hub-badge"><Icon name="spark" size={15} /> MADE FOR RUNNERS</span></div>
          <div className="hub-stats">
            <div className="hub-stat"><strong>03</strong><span>Featured races</span></div><div className="stat-divider" />
            <div className="hub-stat"><strong>01</strong><span>Running community</span></div><div className="stat-divider" />
            <div className="hub-stat"><strong>∞</strong><span>Reasons to run</span></div>
            <a className="hub-link" href="#events">Explore the hub <Icon name="arrow" size={17} /></a>
          </div>
          <div className="shortcut-grid">{shortcuts.map((item) => <a className="shortcut" href={item.href} key={item.title}><span className={`shortcut-icon ${item.tone}`}><Icon name={item.icon} size={21} /></span><span className="shortcut-text"><strong>{item.title}</strong><small>{item.description}</small></span><span className="shortcut-arrow"><Icon name="arrow" size={16} /></span></a>)}</div>
        </div>
      </section>

      <section className="events-section page-width" id="events">
        <div className="section-heading"><div><span className="eyebrow">THE ROAD IS CALLING</span><h2>Find your next <em>race.</em></h2></div><a className="text-link" href="#all-events">View all events <Icon name="arrow" size={17} /></a></div>
        <div className="event-tools"><p>Good runs start with a date on the calendar.</p><label className="search-box"><Icon name="search" size={19} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by city or event" aria-label="Search marathons by city or event" /><kbd>⌘ K</kbd></label></div>
        <div className="event-grid" id="all-events">{filtered.length ? filtered.map((event, index) => <article className="event-card" key={event.name}><div className={`event-art event-art-${index + 1}`}><span className="event-status">{event.status}</span><span className="event-number">0{index + 1}</span><span className="event-art-label">MARATHON<br />SAATHI</span></div><div className="event-info"><div className="event-meta"><span><Icon name="calendar" size={15} /> {event.date}</span><span><Icon name="pin" size={15} /> {event.city}</span></div><h3>{event.name}</h3><div className="event-bottom"><span>{event.distance}</span><a href="#community" aria-label={`Learn more about ${event.name}`}><Icon name="arrow" size={18} /></a></div></div></article>) : <div className="empty-state">No races found for “{search}”. Try another city.</div>}</div>
      </section>

      <section className="community-band" id="community"><div className="page-width community-inner"><div className="community-mark"><Icon name="shoe" size={30} /></div><div><span className="eyebrow">BETTER TOGETHER</span><h2>Big miles are better <em>shared.</em></h2><p>From your first 5K to your next personal best, find encouragement for every step.</p></div><a className="button button-orange" href="https://wa.me/?text=I%27d%20like%20to%20join%20the%20MarathonSaathi%20running%20community">Join the community <Icon name="arrow" /></a></div></section>

      <section className="coming-section page-width">
        <div className="coming-card" id="results"><span className="coming-icon"><Icon name="trophy" size={22} /></span><span className="eyebrow">YOUR MILESTONES</span><h3>Results, worth remembering.</h3><p>Your race-day achievements deserve a place of their own. Check back as we build the runner results hub.</p><span className="coming-label">RESULTS HUB · COMING SOON</span></div>
        <div className="coming-card photo-card" id="photos"><span className="coming-icon"><Icon name="camera" size={22} /></span><span className="eyebrow">RACE DAY, AGAIN</span><h3>Keep the finish-line feeling.</h3><p>Race photos make the hard miles last forever. Event galleries are on their way.</p><span className="coming-label">EVENT PHOTOS · COMING SOON</span></div>
        <div className="coming-card store-card" id="store"><span className="coming-icon"><Icon name="bag" size={22} /></span><span className="eyebrow">GEAR FOR THE JOURNEY</span><h3>Your next run starts here.</h3><p>We’re getting the Runner’s Store ready with essentials for the miles ahead.</p><span className="coming-label">RUNNER’S STORE · COMING SOON</span></div>
      </section>

      <footer className="site-footer"><div className="page-width footer-main"><div className="footer-brand"><a className="brand brand-light" href="#home"><img src="/logo.png" alt="" className="brand-logo" /><span className="brand-copy"><strong>Marathon<span>Saathi</span></strong><small>Har Race Ka Saathi</small></span></a><p>Every runner deserves a race worth running.</p><div className="footer-social"><span>FOLLOW US</span><a aria-label="WhatsApp" href="https://wa.me/?text=Hello%20MarathonSaathi"><Icon name="whatsapp" /></a><a aria-label="Facebook" href="https://www.facebook.com/"><Icon name="facebook" /></a><a aria-label="Instagram" href="https://www.instagram.com/"><Icon name="instagram" /></a></div></div><div className="footer-links"><span className="footer-label">EXPLORE</span><a href="#events">Marathons</a><a href="#results">Results</a><a href="#photos">Event photos</a><a href="#store">Runner’s Store</a></div><div className="footer-contact"><span className="footer-label">EMAIL US</span><a href="mailto:marathonsaathi@gmail.com"><Icon name="mail" size={17} /><span>marathonsaathi@gmail.com</span></a></div></div><div className="page-width footer-bottom"><span>© 2026 MarathonSaathi. All rights reserved.</span><span>RUN WITH HEART <b>✳</b> RUN TOGETHER</span><a href="#home">Back to top ↑</a></div></footer>
    </main>
  );
}
