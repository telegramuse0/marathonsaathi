import { Icon } from './Icon';

export default function CommunityBand() {
  return (
    <section className="community-band" id="community">
      <div className="page-width community-inner">
        <div className="community-mark"><Icon name="shoe" size={30} /></div>
        <div><span className="eyebrow">BETTER TOGETHER</span><h2>Big miles are better <em>shared.</em></h2><p>From your first 5K to your next personal best, find encouragement for every step.</p></div>
        <a className="button button-orange" href="https://wa.me/?text=I%27d%20like%20to%20join%20the%20MarathonSaathi%20running%20community">Join the community <Icon name="arrow" /></a>
      </div>
    </section>
  );
}
