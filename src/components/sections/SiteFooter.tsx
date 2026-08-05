import { sectionLinks } from '@/components/sections/navigation';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <a className="footer-logo-lockup" href="#top" aria-label="Sutur home">
          <img
            src="/brand/design-system/sutur-wordmark-soft.png"
            alt="Sutur"
            width={2250}
            height={816}
          />
          <span aria-hidden="true">|</span>
          <img
            src="/brand/design-system/sutur-wordmark-arabic-soft.png"
            alt="ستور"
            width={2250}
            height={1055}
          />
        </a>
        <p>Tailored Odoo and practical AI agents for clearer operations.</p>
      </div>

      <div>
        <h2>Navigate</h2>
        <nav className="footer-links" aria-label="Footer navigation">
          {sectionLinks.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
          <a href="#book">Book a call</a>
        </nav>
      </div>

      <div>
        <h2>Contact</h2>
        <div className="footer-links">
          <a href="tel:+9613230063">+961(0)3230063</a>
          <span>Beirut, Lebanon</span>
        </div>
      </div>

      <div className="copyright">
        <span>© 2026 Sutur. All rights reserved.</span>
        <span>One clear operating system.</span>
      </div>
    </footer>
  );
}
