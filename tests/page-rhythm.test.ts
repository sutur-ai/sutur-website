import { existsSync, readFileSync } from "node:fs";
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
const sectionScrollUrl = new URL(
  "../src/components/sections/SectionScroll.tsx",
  import.meta.url,
);
const sectionScroll = existsSync(sectionScrollUrl)
  ? readFileSync(sectionScrollUrl, "utf8")
  : "";

describe("homepage section rhythm", () => {
  it("alternates light and dark surfaces across every content section", () => {
    const surfaces = [
      ...page.matchAll(/<section className="[^"]*surface-(paper|ink)[^"]*"/g),
    ].map(([, surface]) => surface);

    // Hero + solution open as a continuous dark block. The former "Why Sutur"
    // section is intentionally gone; its ideas now live in the hero.
    expect(surfaces).toEqual([
      "ink",
      "ink",
      "paper",
      "ink",
      "ink",
      "paper",
    ]);
  });

  it("snaps viewport scrolling to sections with smooth motion", () => {
    expect(css).toMatch(/html\s*{[^}]*scroll-snap-type:\s*y mandatory/s);
    expect(css).toMatch(
      /\.scroll-section[^{]*{[^}]*scroll-snap-align:\s*start/s,
    );
    expect(css).toMatch(
      /\.scroll-section[^{]*{[^}]*scroll-snap-stop:\s*always/s,
    );
    expect(css).toMatch(/html\s*{[^}]*scroll-behavior:\s*smooth/s);
  });

  it("disables mandatory snapping when reduced motion is requested", () => {
    expect(css).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*html\s*{[^}]*scroll-snap-type:\s*none/s,
    );
  });

  it("collapses the desktop header after leaving the top of the page", () => {
    expect(header).toMatch(/useEffect/);
    expect(header).toMatch(/window\.scrollY/);
    expect(header).toMatch(/is-collapsed/);
    expect(css).toMatch(
      /header\.is-collapsed\s*{[^}]*transform:\s*translateY\(-100%\)/s,
    );
  });

  it("constrains desktop sections to one viewport and restores natural mobile flow", () => {
    expect(css).toMatch(
      /@media\s*\(min-width:\s*901px\)[\s\S]*section\.scroll-section\s*{[^}]*height:\s*100svh/s,
    );
    expect(css).toMatch(
      /@media\s*\(min-width:\s*901px\)[\s\S]*\.hero\.scroll-section\s*{[^}]*height:\s*calc\(100svh\s*-\s*82px\)/s,
    );
    expect(css).toMatch(
      /@media\s*\(max-width:\s*900px\)[\s\S]*section\.scroll-section\s*{[^}]*height:\s*auto/s,
    );
  });

  it("turns any desktop wheel gesture into one fixed-duration section transition", () => {
    expect(page).toContain("<SectionScroll />");
    expect(sectionScroll).toMatch(/const TRANSITION_MS = 760/);
    expect(sectionScroll).toMatch(/requestAnimationFrame/);
    expect(sectionScroll).toMatch(/addEventListener\('wheel',[\s\S]*passive: false/);
    expect(sectionScroll).toMatch(/matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);
    expect(sectionScroll).toMatch(/gestureLocked/);
  });

  it("shows accessible animated cues for the available scroll directions", () => {
    expect(sectionScroll).toContain('className="section-cue section-cue-up"');
    expect(sectionScroll).toContain('className="section-cue section-cue-down"');
    expect(sectionScroll).toContain('aria-label="Previous section"');
    expect(sectionScroll).toContain('aria-label="Next section"');
    expect(sectionScroll).toMatch(/dispatchEvent\([\s\S]*new WheelEvent/);
    expect(sectionScroll).toContain('<svg');
    expect(sectionScroll).toContain('className="section-cue-line"');
    expect(css).toMatch(/\.section-cue\s*{[^}]*background:\s*transparent/s);
    expect(css).toMatch(/\.section-cue\s*{[^}]*border:\s*0/s);
    expect(css).toMatch(/@keyframes\s+cue-down/);
    expect(css).toMatch(/@keyframes\s+cue-up/);
  });
});
