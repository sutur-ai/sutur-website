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

describe("homepage section rhythm", () => {
  it("alternates light and dark surfaces across every content section", () => {
    const surfaces = [
      ...page.matchAll(/<section className="[^"]*surface-(paper|ink)[^"]*"/g),
    ].map(([, surface]) => surface);

    expect(surfaces).toEqual([
      "paper",
      "ink",
      "paper",
      "ink",
      "paper",
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
});
