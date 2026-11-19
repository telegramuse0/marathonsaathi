import SiteFooter from '@/components/premium/SiteFooter';
import SiteHeader from '@/components/premium/SiteHeader';

export default function TermsPage() {
  return <main className="min-h-screen bg-[#faf8f4]">
    <SiteHeader />
    <article className="legal-page page-width">
      <span className="eyebrow">MARATHONSAATHI</span>
      <h1>Terms &amp; <em>Conditions.</em></h1>
      <p className="legal-updated">Last updated: 19 November 2026</p>
      <p>By using MarathonSaathi, you agree to these terms. The website helps runners discover races and connect to official event information.</p>
      <h2>Event information and registration</h2>
      <p>Event dates, fees, distances, closing dates and other details are supplied by event organizers or public sources. Please confirm the latest information on the official registration page before booking. Registration, payments, event delivery, cancellations, refunds and race results are handled by the event organizer.</p>
      <h2>External links</h2>
      <p>Registration, results, photo and product buttons may open third-party websites. Those websites have their own terms and privacy practices; MarathonSaathi does not control them.</p>
      <h2>Runner reviews</h2>
      <p>Reviews and star ratings are opinions submitted by runners. Keep reviews relevant, honest and respectful. Do not post personal or confidential information, abusive content, or material you do not have permission to share.</p>
      <h2>Website use</h2>
      <p>Do not misuse the website, attempt to disrupt it, or submit unlawful, misleading or harmful material. We may remove content or limit access when needed to protect runners and the service.</p>
      <h2>Affiliate links</h2>
      <p>Some product links may earn MarathonSaathi a commission. Product prices and availability are set by the seller and can change.</p>
      <h2>Contact</h2>
      <p>Questions about these terms? <a href="/contact">Contact the MarathonSaathi team</a>.</p>
    </article>
    <SiteFooter />
  </main>;
}

