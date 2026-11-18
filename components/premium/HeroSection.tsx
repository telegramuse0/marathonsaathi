import { Icon } from './Icon';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="hero" id="home">
      <div className="hero-image" aria-hidden="true" />
      <div className="hero-content page-width">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow"><span className="eyebrow-dot" /> INDIA’S RUNNING COMMUNITY</div>
          <h1>Every race has<br />a <em>story.</em> Find yours.</h1>
          <p>Discover marathons across India, find your people, and make every finish line feel closer.</p>
          <div className="hero-actions">
            <Link className="button button-orange" href="/events">Explore marathons <Icon name="arrow" /></Link>
            <a className="button button-glass" href="https://www.facebook.com/groups/1630375035508276" target="_blank" rel="noreferrer"><Icon name="users" /> Join the community</a>
          </div>
          <div className="hero-note"><span className="mini-avatars"><i>R</i><i>A</i><i>M</i></span><span>Made for every kind of runner</span></div>
        </div>
        <div className="hero-stamp"><span>RUN<br />YOUR<br />INDIA</span><b>✳</b></div>
        <div className="hero-caption"><span>01 / 03</span><i /> FIND YOUR NEXT START LINE</div>
      </div>
      <div className="tricolor-rule"><i /><i /><i /></div>
    </section>
  );
}
