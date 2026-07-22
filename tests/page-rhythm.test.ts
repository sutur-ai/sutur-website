import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync(
  new URL("../src/app/page.tsx", import.meta.url),
  "utf8",
);
const css = readFileSync(
  new URL("../src/app/globals.css", import.meta.url),
  "utf8",
);
const header = readFileSync(
  new URL("../src/components/sections/Header.tsx", import.meta.url),
  "utf8",
);
const layout = readFileSync(
  new URL("../src/app/layout.tsx", import.meta.url),
  "utf8",
);

describe("homepage design-system theme", () => {
  it("keeps the intended light and deep section rhythm", () => {
    const renderedPage = page.replace(
      "<CompanyCapabilities />",
      '<section className="surface-paper" />',
    );
    const surfaces = [
      ...renderedPage.matchAll(/<section className="[^"]*surface-(paper|ink)[^"]*"/g),
    ].map(([, surface]) => surface);

    expect(surfaces).toEqual(["ink", "paper", "ink", "paper"]);
  });

  it("defines the four source palette colors exactly", () => {
    expect(css).toContain("--deep-interface: #3b1447");
    expect(css).toContain("--soft-signal: #ead1e5");
    expect(css).toContain("--active-orange: #f57e20");
    expect(css).toContain("--data-violet: #906fb1");
  });

  it("uses the Montserrat Gotham substitute for display and body type", () => {
    expect(css).toContain("family=Montserrat:wght@400;500;600;700;900");
    expect(css).toContain('--font-display: "Montserrat", "Gotham"');
    expect(css).toContain('--font-body: "Montserrat", "Gotham"');
    expect(css).toMatch(/h1,\s*h2,\s*h3\s*{[^}]*font-weight:\s*900/s);
  });

  it("keeps the site flat-first with no CSS gradients", () => {
    expect(css).not.toContain("gradient(");
    expect(css).toMatch(/\.surface-ink\s*{[^}]*background:\s*var\(--deep-interface\)/s);
    expect(css).toMatch(/\.surface-paper\s*{[^}]*background:\s*var\(--surface-page\)/s);
  });

  it("uses sharp orange signal squares and brand radii", () => {
    expect(css).toMatch(/\.eyebrow::before,[\s\S]*width:\s*9px[\s\S]*height:\s*9px[\s\S]*background:\s*var\(--active-orange\)/s);
    expect(css).toContain("--radius-lg: 20px");
    expect(css).toContain("--radius-pill: 999px");
    expect(css).toMatch(/\.card-front::after\s*{[^}]*background:\s*var\(--active-orange\)/s);
  });

  it("opens with the existing human copy and a branded interactive orbit", () => {
    expect(page).toContain("Connect your business.");
    expect(page).toContain("<em>Automate the busywork.</em>");
    expect(page).toContain("<AgentOrbit />");
    expect(page).not.toContain('className="hero-brand"');
    expect(css).toMatch(/\.hero\s*{[^}]*background:\s*var\(--deep-interface\)/s);
  });

  it("uses natural scrolling and reduced-motion fallbacks", () => {
    expect(css).not.toContain("scroll-snap-type");
    expect(page).not.toContain("<SectionScroll />");
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*scroll-behavior:\s*auto/s);
  });

  it("reveals the floating discovery control only after the page is scrolled", () => {
    expect(header).toContain("window.scrollY > 96");
    expect(header).toContain("className={`floating-cta${scrolled ? ' is-visible' : ''}`}");
    expect(css).toMatch(/\.floating-cta\s*{[^}]*opacity:\s*0/s);
    expect(css).toMatch(/\.floating-cta\.is-visible\s*{[^}]*opacity:\s*1/s);
  });

  it("uses a fixed deep header that condenses into a pill", () => {
    expect(header).toContain("site-header${scrolled ? ' is-floating' : ''}");
    expect(css).toMatch(/\.site-header\s*{[^}]*position:\s*fixed[^}]*background:\s*var\(--deep-interface\)/s);
    expect(css).toMatch(/\.site-header\.is-floating\s*{[^}]*border-radius:\s*var\(--radius-pill\)/s);
  });

  it("uses the supplied bilingual brand assets and branded favicon", () => {
    expect(header).toContain("/brand/design-system/sutur-wordmark-soft.png");
    expect(header).toContain("/brand/design-system/sutur-wordmark-arabic-soft.png");
    expect(header).toContain('className="wordmark-divider"');
    expect(page).toContain("/brand/design-system/sutur-wordmark-soft.png");
    expect(layout).toContain("/brand/design-system/sutur-icon-deep.png");
  });

  it("keeps mobile navigation accessible and compact", () => {
    expect(header).toContain('aria-expanded={open}');
    expect(header).toContain('aria-controls="mobile-navigation"');
    expect(header).toContain('id="mobile-navigation"');
    expect(css).toMatch(/@media\s*\(max-width:\s*760px\)[\s\S]*\.site-header \.mobile-menu\s*{[^}]*width:\s*100%/s);
  });
});
