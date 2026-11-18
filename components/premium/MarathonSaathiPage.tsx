import SiteHeader from './SiteHeader';
import HeroSection from './HeroSection';
import RunnerHub from './RunnerHub';
import EventsSection from './EventsSection';
import CommunityBand from './CommunityBand';
import SiteFooter from './SiteFooter';
import AffiliateProductsSection from './AffiliateProductsSection';

export default function MarathonSaathiPage() {
  return (
    <main>
      <SiteHeader />
      <HeroSection />
      <RunnerHub />
      <EventsSection featuredOnly />
      <CommunityBand />
      <AffiliateProductsSection />
      <SiteFooter />
    </main>
  );
}
