import Image from 'next/image';
import { Icon } from './Icon';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-width footer-main">
        <div className="footer-brand">
          <a className="brand brand-light" href="#home" aria-label="MarathonSaathi home"><Image src="/logo.png" alt="" width={48} height={48} className="brand-logo" /><span className="brand-copy"><strong>Marathon<span>Saathi</span></strong><small>Har Race Ka Saathi</small></span></a>
          <p>Every runner deserves a race worth running.</p>
          <div className="footer-social"><span>FOLLOW US</span><a aria-label="WhatsApp" href="https://wa.me/?text=Hello%20MarathonSaathi"><Icon name="whatsapp" /></a><a aria-label="Facebook" href="https://www.facebook.com/"><Icon name="facebook" /></a><a aria-label="Instagram" href="https://www.instagram.com/"><Icon name="instagram" /></a></div>
        </div>
        <div className="footer-links"><span className="footer-label">EXPLORE</span><a href="#events">Marathons</a><a href="#results">Results</a><a href="#photos">Event photos</a><a href="#store">Runner’s Store</a></div>
        <div className="footer-contact"><span className="footer-label">EMAIL US</span><a href="mailto:marathonsaathi@gmail.com"><Icon name="mail" size={17} /><span>marathonsaathi@gmail.com</span></a></div>
      </div>
      <div className="page-width footer-bottom"><span>© 2026 MarathonSaathi. All rights reserved.</span><span>RUN WITH HEART <b>✳</b> RUN TOGETHER</span><a href="#home">Back to top ↑</a></div>
    </footer>
  );
}
