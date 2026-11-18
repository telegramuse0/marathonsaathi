import { Icon } from './Icon';

export default function ResultsPhotosSection() {
  return (
    <section className="results-photos-section page-width" aria-labelledby="results-photos-title">
      <div className="results-photos-icon"><Icon name="trophy" size={22} /><Icon name="camera" size={22} /></div>
      <div className="results-photos-copy">
        <span className="eyebrow">RACE DAY, REMEMBERED</span>
        <h2 id="results-photos-title">Results &amp; <em>Photos</em></h2>
        <p>Find your official timing results and relive the finish line.</p>
      </div>
      <a className="text-link" href="/results">Explore race archive <Icon name="arrow" size={17} /></a>
    </section>
  );
}
