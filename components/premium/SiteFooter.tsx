import Image from 'next/image';
import { Icon } from './Icon';
import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-width footer-main">
        <div className="footer-brand">
          <Link className="brand brand-light" href="/" aria-label="MarathonSaathi home"><Image src="/logo.png" alt="" width={48} height={48} className="brand-logo" /><span className="brand-copy"><strong>Marathon<span>Saathi</span></strong><small>Har Race Ka Saathi</small></span></Link>
          <p>Every runner deserves a race worth running.</p>
          <div className="footer-social"><span>FOLLOW US</span><a aria-label="WhatsApp" href="https://whatsapp.com/channel/0029VbCF30w4NVicqzcGS236"><Icon name="whatsapp" /></a><a aria-label="Facebook" href="https://www.facebook.com/marathonsaathi" target="_blank" rel="noreferrer"><Icon name="facebook" /></a><a aria-label="Instagram" href="https://www.instagram.com/marathonsaathi"><Icon name="instagram" /></a></div>
        </div>
        <div className="footer-links"><span className="footer-label">EXPLORE</span><Link href="/contact">Contact us</Link><Link href="/terms">Terms &amp; Conditions</Link><Link href="/events">Find a race</Link><Link href="/reviews">Event Review</Link><Link href="/shop">Shop</Link></div>
      </div>
      <div className="page-width footer-bottom"><span>© 2026 MarathonSaathi. All rights reserved.</span><span>RUN WITH HEART <b>✳</b> RUN TOGETHER</span><Link href="/">Back to top ↑</Link></div>
    </footer>
  );
}

