import AffiliateProductsSection from '@/components/premium/AffiliateProductsSection';
import SiteFooter from '@/components/premium/SiteFooter';
import SiteHeader from '@/components/premium/SiteHeader';

export default function ShopPage() {
  return <main>
    <SiteHeader />
    <div className="route-intro page-width shop-route-intro">
      <span className="eyebrow">GEAR FOR EVERY RUN</span>
      <h1>Runner’s <em>Shop.</em></h1>
      <p>Browse all our running essentials and choose a store to shop.</p>
    </div>
    <AffiliateProductsSection featuredOnly={false} />
    <SiteFooter />
  </main>;
}

