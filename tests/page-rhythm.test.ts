import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const page = readFileSync(new URL('../src/app/page.tsx', import.meta.url), 'utf8');
const layout = readFileSync(new URL('../src/app/layout.tsx', import.meta.url), 'utf8');
const theme = readFileSync(new URL('../src/app/theme.css', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');
const header = readFileSync(
  new URL('../src/components/sections/Header.tsx', import.meta.url),
  'utf8',
);
const bookingComponent = readFileSync(
  new URL('../src/components/booking/Booking.tsx', import.meta.url),
  'utf8',
);
const capabilitiesCss = readFileSync(
  new URL('../src/components/sections/CompanyCapabilities.module.css', import.meta.url),
  'utf8',
);
const orbitCss = readFileSync(
  new URL('../src/components/brand/AgentOrbit.module.css', import.meta.url),
  'utf8',
);
const moduleCss = readFileSync(
  new URL('../src/components/brand/ModuleGrid.module.css', import.meta.url),
  'utf8',
);

const fullCss = [theme, css, capabilitiesCss, orbitCss, moduleCss].join('\n');
const pageRoutes = ['product', 'solutions', 'pricing', 'about', 'insights', 'contact'];

describe('website design-system theme', () => {
  it('keeps the intended light and deep homepage rhythm', () => {
    const hero = page.indexOf('className="hero scroll-section surface-ink"');
    const capabilities = page.indexOf('<CompanyCapabilities />');
    const agentDemo = page.indexOf('<AgentActionDemo />');
    const team = page.indexOf('className="section team scroll-section surface-ink"');
    const booking = page.indexOf('className="booking-section scroll-section surface-soft"');
    const footer = page.indexOf('<SiteFooter />');

    expect(hero).toBeGreaterThan(-1);
    expect(capabilities).toBeGreaterThan(hero);
    expect(agentDemo).toBeGreaterThan(capabilities);
    expect(team).toBeGreaterThan(agentDemo);
    expect(booking).toBeGreaterThan(team);
    expect(footer).toBeGreaterThan(booking);
  });

  it('imports one centralized theme source containing the exact deck palette', () => {
    expect(css).toContain('@import "./theme.css";');
    expect(theme).toContain('--deep-interface: #3b1447');
    expect(theme).toContain('--soft-signal: #ead1e5');
    expect(theme).toContain('--active-orange: #f57e20');
    expect(theme).toContain('--data-violet: #906fb1');
  });

  it('centralizes typography, layout, component sizing, and motion knobs', () => {
    for (const token of [
      '--font-display:',
      '--font-body:',
      '--type-display:',
      '--content-width:',
      '--page-gutter:',
      '--section-space:',
      '--header-height:',
      '--capability-visual-height:',
      '--booking-card-width:',
      '--radius-card:',
      '--motion-fast:',
      '--ease-out:',
    ]) {
      expect(theme).toContain(token);
    }
    expect(theme).toContain('--font-display: "Gotham Black", "Montserrat"');
    expect(theme).toContain('--font-body: "Gotham Book", "Montserrat"');
    expect(theme).toContain('--weight-black: 900');
    expect(theme).toContain('--weight-book: 400');
  });

  it('keeps the site flat-first with no CSS gradients', () => {
    expect(fullCss).not.toMatch(/(?:linear|radial|conic)-gradient\(/);
  });

  it('uses orange only as an active signal and rounds controls as pills', () => {
    expect(css).toMatch(/\.header-cta,[\s\S]*background:\s*var\(--active-orange\)/s);
    expect(css).toMatch(/\.floating-cta > span\s*{[^}]*background:\s*var\(--active-orange\)/s);
    expect(theme).toContain('--radius-card: 1.125rem');
    expect(theme).toContain('--radius-pill: 999px');
  });

  it('opens with the approved human copy and preserves the branded interactive orbit', () => {
    expect(page).toContain('Connect your business.');
    expect(page).toContain('Automate the busywork.');
    expect(page).toContain('<AgentOrbit />');
    expect(page).not.toContain('className="hero-brand"');
    expect(page).toContain('surface-ink');
  });

  it('uses natural scrolling and complete reduced-motion fallbacks', () => {
    expect(css).not.toContain('scroll-snap-type');
    expect(css).not.toContain('scroll-snap-align');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('animation-duration: 0.01ms !important');
    expect(orbitCss).toContain('@media (prefers-reduced-motion: reduce)');
  });

  it('reveals the floating discovery control after primary content and hides it near the footer', () => {
    expect(header).toContain("const [scrolled, setScrolled] = useState(false)");
    expect(header).toContain("const [showFloatingCta, setShowFloatingCta] = useState(false)");
    expect(header).toContain('currentScrollY > 96');
    expect(header).toContain('capabilities.getBoundingClientRect().bottom <= window.innerHeight * 0.35');
    expect(header).toContain('afterPrimaryContent && !footerIsVisible');
    expect(header).toContain("floating-cta${showFloatingCta ? ' is-visible' : ''}");
    expect(header).toContain('href="/contact"');
    expect(css).toMatch(/\.floating-cta\s*{[^}]*opacity:\s*0[^}]*pointer-events:\s*none/s);
    expect(css).toMatch(/\.floating-cta\.is-visible\s*{[^}]*opacity:\s*1[^}]*pointer-events:\s*auto/s);
  });

  it('uses the deck navigation and a non-overlapping header that condenses into a pill', () => {
    for (const link of [
      "['Product', '/product']",
      "['Solutions', '/solutions']",
      "['Pricing', '/pricing']",
      "['About', '/about']",
    ]) {
      expect(header).toContain(link);
    }
    expect(css).toMatch(/\.site-header\s*{[^}]*position:\s*absolute[^}]*background:\s*var\(--deep-interface\)/s);
    expect(css).toMatch(/\.site-header\.is-floating\s*{[^}]*border-radius:\s*var\(--radius-pill\)/s);
  });

  it('ships every route specified by the design deck', () => {
    for (const route of pageRoutes) {
      expect(existsSync(new URL(`../src/app/${route}/page.tsx`, import.meta.url))).toBe(true);
    }
  });

  it('uses the supplied bilingual brand assets and branded favicon', () => {
    expect(header).toContain('/brand/design-system/sutur-wordmark-soft.png');
    expect(header).toContain('/brand/design-system/sutur-wordmark-arabic-soft.png');
    expect(header).toContain('alt="sutur"');
    expect(header).toContain('alt="سطور"');
    expect(layout).toContain("icon: '/brand/design-system/sutur-icon-deep.png'");
  });

  it('keeps mobile navigation accessible, compact, and full-width', () => {
    expect(header).toContain('aria-expanded={open}');
    expect(header).toContain('aria-controls="mobile-navigation"');
    expect(css).toMatch(/@media \(max-width: 760px\)[\s\S]*\.site-header\.is-floating[\s\S]*height:\s*var\(--header-floating-height\)/s);
    expect(css).toMatch(/@media \(max-width: 760px\)[\s\S]*\.site-header \.mobile-menu\s*{[^}]*width:\s*100%/s);
    expect(css).toMatch(/@media \(max-width: 760px\)[\s\S]*\.floating-cta\s*{[^}]*display:\s*none/s);
  });

  it('uses a native modal booking flow with announced field errors and clean reopening', () => {
    expect(bookingComponent).toContain('dialog.showModal()');
    expect(bookingComponent).toContain('onCancel={(event) =>');
    expect(bookingComponent).toContain('aria-invalid={Boolean(errors.name)}');
    expect(bookingComponent).toContain('aria-describedby="booking-name-error"');
    expect(bookingComponent).toMatch(/function openBooking\(\)[\s\S]*setSent\(false\)[\s\S]*setOpen\(true\)/s);
    expect(bookingComponent).toMatch(/function closeBooking\(\)[\s\S]*setOpen\(false\)[\s\S]*setSent\(false\)/s);
    expect(css).toContain('.booking-modal::backdrop');
  });
});
