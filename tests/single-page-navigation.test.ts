import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const appRoot = new URL('../src/app', import.meta.url).pathname;
const sourceRoot = new URL('../src', import.meta.url).pathname;
const navigationUrl = new URL('../src/components/sections/navigation.ts', import.meta.url);
const navigation = existsSync(navigationUrl) ? readFileSync(navigationUrl, 'utf8') : '';
const header = readFileSync(
  new URL('../src/components/sections/Header.tsx', import.meta.url),
  'utf8',
);
const footer = readFileSync(
  new URL('../src/components/sections/SiteFooter.tsx', import.meta.url),
  'utf8',
);
const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');
const homepageSources = [
  '../src/app/page.tsx',
  '../src/components/sections/CompanyCapabilities.tsx',
  '../src/components/sections/WhyUs.tsx',
  '../src/components/sections/Reviews.tsx',
  '../src/components/sections/FaqSection.tsx',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8')).join('\n');

function collectPages(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectPages(path);
    return entry.name === 'page.tsx' ? [relative(appRoot, path)] : [];
  });
}

function collectSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(path);
    return ['.ts', '.tsx'].includes(extname(entry.name)) ? [path] : [];
  });
}

describe('single-page website architecture', () => {
  it('ships only the homepage route', () => {
    expect(collectPages(appRoot)).toEqual(['page.tsx']);
  });

  it('uses Alex’s exact navigation labels for live homepage sections', () => {
    const expectedLinks = [
      ["Capabilities", '#capabilities'],
      ['Why us', '#why-us'],
      ['Reviews', '#reviews'],
      ['FAQ', '#questions'],
    ] as const;

    for (const [label, href] of expectedLinks) {
      expect(navigation).toContain(`['${label}', '${href}']`);
      expect(homepageSources).toContain(`id="${href.slice(1)}"`);
    }

    expect(header).toContain('sectionLinks.map');
    expect(header).toContain('href="#book"');
    expect(header).toContain('>Book a call<');
    expect(header).toMatch(
      /<a href="#book" onClick=\{\(\) => setOpen\(false\)\}>\s+Book a call <ArrowIcon \/>/,
    );
    expect(footer).toContain('sectionLinks.map');
    expect(footer).toContain('>Book a call</a>');
  });

  it('contains no links to deleted internal routes', () => {
    const staleLinks = collectSourceFiles(sourceRoot).flatMap((path) => {
      const source = readFileSync(path, 'utf8');
      return [...source.matchAll(/href=["']\/(?!\/)[^"']*["']/g)].map(
        (match) => `${relative(sourceRoot, path)}: ${match[0]}`,
      );
    });

    expect(staleLinks).toEqual([]);
    expect(header).not.toContain("from 'next/link'");
    expect(header).not.toContain('usePathname');
  });

  it('uses one fixed-header offset so anchor targets are not double-spaced', () => {
    expect(css).toContain('scroll-padding-top: calc(var(--header-height) + var(--space-3))');
    expect(css).not.toContain('scroll-margin-top');
  });

  it('removes components that existed only for deleted routes', () => {
    expect(existsSync(new URL('../src/components/sections/PageHero.tsx', import.meta.url))).toBe(false);
    expect(existsSync(new URL('../src/components/sections/AgentHandoffMock.tsx', import.meta.url))).toBe(false);
  });
});
