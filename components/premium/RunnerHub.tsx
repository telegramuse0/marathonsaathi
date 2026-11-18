import { Icon } from './Icon';
import { shortcuts } from './data';

export default function RunnerHub() {
  return (
    <section className="hub-section page-width" aria-labelledby="hub-title">
      <div className="hub-card">
        <div className="hub-heading">
          <div><span className="eyebrow">YOUR RUNNER HUB</span><h2 id="hub-title">One place. <em>Every mile.</em></h2></div>
          <span className="hub-badge"><Icon name="spark" size={15} /> MADE FOR RUNNERS</span>
        </div>
        <div className="hub-stats">
          <div className="hub-stat"><strong>03</strong><span>Featured races</span></div><div className="stat-divider" />
          <div className="hub-stat"><strong>01</strong><span>Running community</span></div><div className="stat-divider" />
          <div className="hub-stat"><strong>∞</strong><span>Reasons to run</span></div>
          <a className="hub-link" href="#events">Explore the hub <Icon name="arrow" size={17} /></a>
        </div>
        <div className="shortcut-grid">
          {shortcuts.map((item) => (
            <a className="shortcut" href={item.href} key={item.title}>
              <span className={`shortcut-icon ${item.tone}`}><Icon name={item.icon} size={21} /></span>
              <span className="shortcut-text"><strong>{item.title}</strong><small>{item.description}</small></span>
              <span className="shortcut-arrow"><Icon name="arrow" size={16} /></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
