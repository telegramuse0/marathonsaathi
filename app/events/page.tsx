import EventsSection from '@/components/premium/EventsSection';
import SiteHeader from '@/components/premium/SiteHeader';
import SiteFooter from '@/components/premium/SiteFooter';

export default function EventsPage() {
  return (
    <main>
      <SiteHeader />
      <div className="route-intro page-width">
        <span className="eyebrow">YOUR NEXT START LINE</span>
        <h1>Find a <em>race.</em></h1>
        <p>Browse upcoming and completed running events across India.</p>
      </div>
      <EventsSection featuredOnly={false} />
      <SiteFooter />
    </main>
  );
}
