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
const navigation = readFileSync(
  new URL('../src/components/sections/navigation.ts', import.meta.url),
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
const capabilitiesComponent = readFileSync(
  new URL('../src/components/sections/CompanyCapabilities.tsx', import.meta.url),
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
describe('website design-system theme', () => {
  it('keeps the intended light and deep homepage rhythm', () => {
    const hero = page.indexOf('className="hero scroll-section surface-ink"');
    const capabilities = page.indexOf('<CompanyCapabilities />');
    const whyUs = page.indexOf('<WhyUs />');
    const reviews = page.indexOf('<Reviews />');
    const questions = page.indexOf('<FaqSection />');
    const booking = page.indexOf('className="booking-section scroll-section surface-soft"');
    const footer = page.indexOf('<SiteFooter />');

    expect(hero).toBeGreaterThan(-1);
    expect(capabilities).toBeGreaterThan(hero);
    expect(whyUs).toBeGreaterThan(capabilities);
    expect(page).not.toContain('className="section team scroll-section surface-ink"');
    expect(reviews).toBeGreaterThan(whyUs);
    expect(questions).toBeGreaterThan(reviews);
    expect(booking).toBeGreaterThan(questions);
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
      '--booking-embed-height:',
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
    expect(theme).toContain('--radius-card: 1.125rem');
    expect(theme).toContain('--radius-pill: 999px');
  });

  it('opens with the approved human copy and preserves the branded interactive orbit', () => {
    expect(page).toContain('Connect your business<SignalDot />');
    expect(page).toContain('<em>Automate the busywork<SignalDot /></em>');
    expect(css).toMatch(/\.hero-copy h1\s*{[^}]*font-weight:\s*var\(--weight-bold\)/s);
    expect(css).toMatch(/\.hero-copy h1 em\s*{[^}]*font-weight:\s*inherit/s);
    expect(page).toContain('<AgentOrbit />');
    expect(page).not.toContain('className="hero-brand"');
    expect(page).toContain('surface-ink');
  });

  it('renders display punctuation as orange square signals', () => {
    expect(existsSync(new URL('../src/components/ui/SignalDot.tsx', import.meta.url))).toBe(true);
    expect(page).toContain('Connect your business<SignalDot />');
    expect(page).toContain('<em>Automate the busywork<SignalDot /></em>');
    expect(page).toContain('Choose a time that works<SignalDot />');
    expect(capabilitiesComponent).toContain('One connected business<SignalDot />');
    expect(capabilitiesComponent).toContain('<em>Three ways to move it forward<SignalDot /></em>');
    expect(capabilitiesComponent).toContain('<h3>{capability.title}<SignalDot /></h3>');

    expect(css).toMatch(/\.signal-dot\s*{[^}]*display:\s*inline-block[^}]*width:\s*0\.16em[^}]*height:\s*0\.16em[^}]*background:\s*var\(--active-orange\)/s);
  });

  it('uses natural scrolling and complete reduced-motion fallbacks', () => {
    expect(css).not.toContain('scroll-snap-type');
    expect(css).not.toContain('scroll-snap-align');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('animation-duration: 0.01ms !important');
    expect(orbitCss).toContain('@media (prefers-reduced-motion: reduce)');
  });

  it('keeps the floating booking control available away from contact/footer with the agent mark', () => {
    expect(header).toContain("const [scrolled, setScrolled] = useState(false)");
    expect(header).toContain("const [showFloatingCta, setShowFloatingCta] = useState(false)");
    expect(header).toContain('currentScrollY > 96');
    expect(header).not.toContain('afterPrimaryContent');
    expect(header).toContain('setShowFloatingCta(!footerIsVisible)');
    expect(header).toContain("floating-cta${showFloatingCta ? ' is-visible' : ''}");
    expect(header).toContain('src="/brand/design-system/sutur-icon-soft.png"');
    expect(header).toContain('Book a call');
    expect(header).toContain('href="#book"');
    expect(css).toMatch(/\.floating-cta > img\s*{[^}]*object-fit:\s*contain/s);
    expect(css).toMatch(/\.floating-cta\s*{[^}]*right:\s*auto[^}]*left:\s*50%[^}]*transform:\s*translate\(-50%,\s*0\.75rem\)/s);
    expect(css).toMatch(/\.floating-cta\s*{[^}]*opacity:\s*0[^}]*pointer-events:\s*none/s);
    expect(css).toMatch(/\.floating-cta\.is-visible\s*{[^}]*opacity:\s*1[^}]*pointer-events:\s*auto[^}]*transform:\s*translate\(-50%,\s*0\)/s);
  });

  it('uses the approved homepage section navigation and keeps the header fixed while it condenses into a pill', () => {
    for (const link of [
      "['Capabilities', '#capabilities']",
      "['Why us', '#why-us']",
      "['Reviews', '#reviews']",
      "['FAQ', '#questions']",
    ]) {
      expect(navigation).toContain(link);
    }
    expect(header).toContain('href="#book">Book a call</a>');
    expect(css).toMatch(/\.site-header\s*{[^}]*position:\s*fixed[^}]*background:\s*var\(--deep-interface\)/s);
    expect(css).toMatch(/\.site-header\s*{[^}]*width:\s*min\(82rem, max\(58rem, 70vw\), calc\(100% - 2rem\)\)/s);
    expect(css).toMatch(/\.site-header\.is-floating\s*{[^}]*width:\s*min\(64rem, max\(52rem, 58vw\), calc\(100% - 3rem\)\)/s);
    expect(css).toMatch(/\.site-header\.is-floating\s*{[^}]*border-radius:\s*var\(--radius-pill\)/s);
  });

  it('removes decorative micro-titles and the hero module coverage strip', () => {
    expect(page).not.toContain('Tailored Odoo · Practical AI agents');
    expect(page).not.toContain('module-coverage');
    expect(css).not.toContain('.module-coverage');
    expect(css).not.toContain('.hero-eyebrow');
    expect(css).not.toContain('.page-kicker');
    expect(css).not.toContain('.eyebrow');
  });

  it('scales desktop content and typography fluidly with bounded clamps', () => {
    expect(theme).toContain('--content-width: 120rem');
    expect(theme).toContain('--page-gutter: clamp(1.25rem, 4vw, 5rem)');
    expect(theme).toContain('--type-display: clamp(3.5rem, 5.2vw, 6.25rem)');
    expect(theme).toContain('--hero-min-height: clamp(42rem, 92svh, 55rem)');
    expect(css).toContain('padding-inline: max(var(--page-gutter), calc((100vw - var(--content-width)) / 2))');
    expect(orbitCss).toContain('width: min(100%, var(--hero-visual-max))');
  });


  it('uses the larger English wordmark and agent-mark favicon', () => {
    expect(header).toContain('/brand/design-system/sutur-wordmark-soft.png');
    expect(header).not.toContain('/brand/design-system/sutur-wordmark-arabic-soft.png');
    expect(header).toContain('alt="sutur"');
    expect(css).toMatch(/\.site-header \.wordmark img\s*{[^}]*height:\s*2\.125rem/s);
    expect(layout).toContain("icon: '/brand/design-system/sutur-agent-favicon.png'");
    expect(layout).toContain("apple: '/brand/design-system/sutur-agent-favicon.png'");
    expect(existsSync(new URL('../public/brand/design-system/sutur-agent-favicon.png', import.meta.url))).toBe(true);
  });

  it('keeps mobile navigation accessible, compact, and full-width', () => {
    expect(header).toContain('aria-expanded={open}');
    expect(header).toContain('aria-controls="mobile-navigation"');
    expect(css).toMatch(/@media \(max-width: 760px\)[\s\S]*\.site-header\.is-floating[\s\S]*height:\s*var\(--header-floating-height\)/s);
    expect(css).toMatch(/@media \(max-width: 760px\)[\s\S]*\.site-header \.mobile-menu\s*{[^}]*width:\s*100%/s);
    expect(css).toMatch(/@media \(max-width: 760px\)[\s\S]*\.floating-cta\s*{[^}]*display:\s*none/s);
  });

  it('keeps the required lead form and Calendly scheduler together without a modal', () => {
    expect(bookingComponent).toContain("'use client'");
    expect(bookingComponent).toContain('validateBookingDetails');
    expect(bookingComponent).toContain('<form');
    expect(bookingComponent).toContain('className="booking-lead-form"');
    expect(bookingComponent).toContain('action="mailto:hello@sutur.ai?subject=Sutur%20discovery%20call"');
    expect(bookingComponent).toContain('method="post"');
    expect(bookingComponent).toContain('encType="text/plain"');
    for (const label of [
      'First name',
      'Last name',
      'Location',
      'Phone number',
      'Business name',
    ]) {
      expect(bookingComponent).toContain(label);
    }
    expect(bookingComponent).toContain('            Email\n            <input');
    expect(bookingComponent).toContain('className="booking-label-text"');
    expect(bookingComponent).toContain('<small>(optional)</small>');
    expect(bookingComponent).toContain('Complete your details to unlock available times.');
    expect(bookingComponent).toContain("calendarReady ? 'is-ready' : 'is-locked'");
    expect(bookingComponent).toContain('if (calendarReady)');
    expect(bookingComponent).toContain('setCalendarReady(false)');
    expect(bookingComponent).toContain('setCalendarUrl(baseCalendarUrl)');
    expect(bookingComponent).toContain('getCalendlyEmbedUrl(calendlyEventUrl, values)');
    expect(bookingComponent).toContain("window.matchMedia('(max-width: 1024px)')");
    expect(bookingComponent).toContain('maxLength={BOOKING_FIELD_LIMITS.firstName}');
    expect(bookingComponent).toContain('maxLength={BOOKING_FIELD_LIMITS.email}');
    expect(bookingComponent).toContain('maxLength={BOOKING_FIELD_LIMITS.businessName}');
    expect(bookingComponent).toContain('<iframe');
    expect(bookingComponent).toContain('title="Book a Sutur discovery call"');
    expect(bookingComponent).toContain('mailto:hello@sutur.ai');
    expect(bookingComponent).not.toContain('dialog.showModal()');
    expect(bookingComponent).not.toContain('card-scene');
    expect(css).toContain('.booking-flow');
    expect(css).toContain('.booking-lead-form');
    expect(css).toContain('.booking-calendar-gate');
    expect(css).not.toContain('.booking-modal');
    expect(css).not.toContain('.card-scene');
  });
});
