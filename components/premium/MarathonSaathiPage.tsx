import SiteHeader from './SiteHeader';
import HeroSection from './HeroSection';
import RunnerHub from './RunnerHub';
import EventsSection from './EventsSection';
import CommunityBand from './CommunityBand';
import ResultsPhotosSection from './ResultsPhotosSection';
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
      <ResultsPhotosSection />
      <AffiliateProductsSection />
      <SiteFooter />
    </main>
  );
}
