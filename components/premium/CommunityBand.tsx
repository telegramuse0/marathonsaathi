import { Icon } from './Icon';

export default function CommunityBand() {
  return (
    <section className="community-band" id="community">
      <div className="page-width community-inner">
        <div className="community-mark"><Icon name="shoe" size={30} /></div>
        <div><span className="eyebrow">BETTER TOGETHER</span><h2>Big miles are better <em>shared.</em></h2><p>From your first 5K to your next personal best, find encouragement for every step.</p></div>
        <a className="button button-orange" href="https://www.facebook.com/groups/1630375035508276" target="_blank" rel="noreferrer">Join the community <Icon name="arrow" /></a>
      </div>
    </section>
  );
}
