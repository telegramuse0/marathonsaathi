import { Icon } from './Icon';

export default function ComingSoonSection() {
  return (
    <section className="coming-section page-width">
      <div className="coming-card" id="results"><span className="coming-icon"><Icon name="trophy" size={22} /></span><span className="eyebrow">YOUR MILESTONES</span><h3>Results, worth remembering.</h3><p>Your race-day achievements deserve a place of their own. Check back as we build the runner results hub.</p><span className="coming-label">RESULTS HUB · COMING SOON</span></div>
      <div className="coming-card photo-card" id="photos"><span className="coming-icon"><Icon name="camera" size={22} /></span><span className="eyebrow">RACE DAY, AGAIN</span><h3>Keep the finish-line feeling.</h3><p>Race photos make the hard miles last forever. Event galleries are on their way.</p><span className="coming-label">EVENT PHOTOS · COMING SOON</span></div>
      <div className="coming-card store-card" id="store"><span className="coming-icon"><Icon name="bag" size={22} /></span><span className="eyebrow">GEAR FOR THE JOURNEY</span><h3>Your next run starts here.</h3><p>We’re getting the Runner’s Store ready with essentials for the miles ahead.</p><span className="coming-label">RUNNER’S STORE · COMING SOON</span></div>
    </section>
  );
}
