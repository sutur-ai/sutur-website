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
describe("homepage section rhythm", () => {
  it("alternates light and dark surfaces across every content section", () => {
    const surfaces = [
      ...page.matchAll(/<section className="[^"]*surface-(paper|ink)[^"]*"/g),
    ].map(([, surface]) => surface);

    // Every section alternates from the opening ink hero through the final
    // paper booking section.
    expect(surfaces).toEqual([
      "ink",
      "paper",
      "ink",
      "paper",
      "ink",
      "paper",
    ]);
  });

  it("uses natural page scrolling rather than forcing viewport snap", () => {
    expect(css).toMatch(/\/\* 2026 editorial refresh[\s\S]*html\s*{[^}]*scroll-snap-type:\s*none/s);
    expect(page).not.toContain("<SectionScroll />");
  });

  it("keeps reduced-motion users out of decorative animation", () => {
    expect(css).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*scroll-behavior:\s*auto\s*!important/s,
    );
  });

  it("keeps the discovery-call dock visible throughout the page", () => {
    expect(header).toContain('className="floating-cta is-visible"');
    expect(css).toMatch(/\.floating-cta\s*{[^}]*position:\s*fixed/s);
    expect(css).toMatch(/\.floating-cta\.is-visible\s*{[^}]*opacity:\s*1/s);
  });

  it("turns the hero navigation into a compact floating top bar", () => {
    expect(header).toMatch(/window\.scrollY > 96/);
    expect(header).toContain("is-floating");
    expect(css).toMatch(/\.site-header\.is-floating\s*{[^}]*position:\s*fixed/s);
    expect(css).toMatch(/\.site-header\.is-floating\s*{[^}]*top:\s*12px/s);
  });

  it("restores natural section height on desktop and mobile", () => {
    expect(css).toMatch(
      /\.hero\.scroll-section,\s*section\.scroll-section\s*{[^}]*height:\s*auto/s,
    );
    expect(css).toMatch(
      /\.hero\.scroll-section,\s*section\.scroll-section\s*{[^}]*overflow:\s*visible/s,
    );
  });

  it("uses a quiet transparent top bar over the hero", () => {
    expect(header).toContain("site-header${scrolled ? ' is-floating' : ''}");
    expect(header).toContain('aria-label="Primary navigation"');
    expect(css).toMatch(/\.site-header\s*{[^}]*position:\s*absolute/s);
    expect(css).toMatch(/\.site-header\s*{[^}]*background:\s*transparent/s);
  });

  it("exposes an accessible mobile navigation control", () => {
    expect(header).toContain('aria-expanded={open}');
    expect(header).toContain('aria-controls="mobile-navigation"');
    expect(header).toContain('id="mobile-navigation"');
    expect(header).toContain("open ? 'Close' : 'Menu'");
  });
});
