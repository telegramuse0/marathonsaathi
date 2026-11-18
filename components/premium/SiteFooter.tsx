import Image from 'next/image';
import { Icon } from './Icon';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-width footer-main">
        <div className="footer-brand">
          <a className="brand brand-light" href="/" aria-label="MarathonSaathi home"><Image src="/logo.png" alt="" width={48} height={48} className="brand-logo" /><span className="brand-copy"><strong>Marathon<span>Saathi</span></strong><small>Har Race Ka Saathi</small></span></a>
          <p>Every runner deserves a race worth running.</p>
          <div className="footer-social"><span>FOLLOW US</span><a aria-label="WhatsApp" href="https://wa.me/?text=Hello%20MarathonSaathi"><Icon name="whatsapp" /></a><a aria-label="Facebook community" href="https://www.facebook.com/groups/1630375035508276" target="_blank" rel="noreferrer"><Icon name="facebook" /></a><a aria-label="Instagram" href="https://www.instagram.com/"><Icon name="instagram" /></a></div>
        </div>
        <div className="footer-links"><span className="footer-label">EXPLORE</span><a href="/events">Find a race</a><a href="/results">Results &amp; photos</a><a href="/#store">Runner’s gear</a></div>
        <div className="footer-contact"><span className="footer-label">EMAIL US</span><a href="mailto:marathonsaathi@gmail.com"><Icon name="mail" size={17} /><span>marathonsaathi@gmail.com</span></a></div>
      </div>
      <div className="page-width footer-bottom"><span>© 2026 MarathonSaathi. All rights reserved.</span><span>RUN WITH HEART <b>✳</b> RUN TOGETHER</span><a href="/">Back to top ↑</a></div>
    </footer>
  );
}
