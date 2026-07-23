import Link from 'next/link';

const primary = [
  ['Product', '/product'],
  ['Solutions', '/solutions'],
  ['Pricing', '/pricing'],
  ['About', '/about'],
] as const;

const resources = [
  ['Insights', '/insights'],
  ['Contact', '/contact'],
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="wordmark" href="/" aria-label="Sutur home">
          <img
            src="/brand/design-system/sutur-wordmark-soft.png"
            alt="sutur"
            width={128}
            height={46}
          />
        </Link>
        <p>Tailored Odoo and practical AI agents for clearer operations.</p>
      </div>

      <div>
        <h2>Explore</h2>
        <nav className="footer-links" aria-label="Footer navigation">
          {primary.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
      </div>

      <div>
        <h2>Resources</h2>
        <nav className="footer-links" aria-label="Footer resources">
          {resources.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
      </div>

      <div>
        <h2>Contact</h2>
        <div className="footer-links">
          <a href="mailto:hello@sutur.ai">hello@sutur.ai</a>
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
