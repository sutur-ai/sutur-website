import { sectionLinks } from '@/components/sections/navigation';

const footerLogoSource = '/brand/design-system/sutur-wordmark-soft.png';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <a className="wordmark" href="#top" aria-label="Sutur home">
          <img
            src="/brand/design-system/sutur-wordmark-soft.png"
            alt="sutur"
            width={128}
            height={46}
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
          <a href="mailto:hello@sutur.ai">hello@sutur.ai</a>
          <span>Beirut, Lebanon</span>
        </div>
      </div>

      <div className="copyright">
        <span>© 2026 Sutur. All rights reserved.</span>
        <span>One clear operating system.</span>
      </div>

      <svg
        className="footer-outline-logo"
        viewBox="0 0 2250 816"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter
            id="footer-logo-outline"
            x="0"
            y="0"
            width="2250"
            height="816"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feMorphology
              in="SourceAlpha"
              operator="erode"
              radius="7"
              result="erodedLogo"
            />
            <feComposite in="SourceGraphic" in2="erodedLogo" operator="out" />
          </filter>
        </defs>
        <image
          href={footerLogoSource}
          width="2250"
          height="816"
          filter="url(#footer-logo-outline)"
        />
      </svg>
    </footer>
  );
}
