import { readFileSync } from 'node:fs';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Header } from '../src/components/layout/Header';
import { Footer } from '../src/components/layout/Footer';
import { Hero } from '../src/components/hero/Hero';
import { AppsStrip } from '../src/components/apps/AppsStrip';
import { HubVisual } from '../src/components/capabilities/HubVisual';
import { NightShiftVisual } from '../src/components/capabilities/NightShiftVisual';
import { PhotoshopVisual } from '../src/components/capabilities/PhotoshopVisual';
import { MemoryTreeVisual } from '../src/components/capabilities/MemoryTreeVisual';
import { Founders } from '../src/components/sections/Founders';
import { APP_ROW_1, APP_ROW_2 } from '../src/content/apps';
import postcss from 'postcss';

vi.stubGlobal('React', React);
const aboveFold = [Header, Hero];
const belowFold = [HubVisual, NightShiftVisual, PhotoshopVisual, MemoryTreeVisual, Founders, Footer];

it('sizes every rendered image, defers below-fold images, and preserves WebP intrinsic ratios', () => {
  for (const Component of [...aboveFold, AppsStrip, ...belowFold]) {
    const markup = renderToStaticMarkup(<Component />);
    const images = markup.match(/<img\b[^>]*>/g) ?? [];
    expect(images.length).toBeGreaterThan(0);
    for (const tag of images) {
      const src = tag.match(/src="([^"]+)"/)![1];
      const width = Number(tag.match(/width="([^"]+)"/)?.[1]);
      const height = Number(tag.match(/height="([^"]+)"/)?.[1]);
      expect(width, src).toBeGreaterThan(0);
      expect(height, src).toBeGreaterThan(0);
      if (belowFold.includes(Component)) {
        expect(tag, src).toContain('loading="lazy"');
        expect(tag, src).toContain('decoding="async"');
        expect(markup, src).not.toContain(`<link rel="preload" as="image" href="${src}"`);
      }
      if (src.endsWith('.webp')) {
        const bytes = readFileSync(new URL(`../public${src}`, import.meta.url));
        expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
        // These assets use the lossless VP8L chunk; its packed header stores dimensions.
        let offset = 12;
        while (bytes.toString('ascii', offset, offset + 4) !== 'VP8L' && offset < bytes.length) {
          const size = bytes.readUInt32LE(offset + 4);
          offset += 8 + size + (size % 2);
        }
        expect(offset).toBeLessThan(bytes.length);
        const bits = bytes.readUInt32LE(offset + 9);
        expect(width, src).toBe((bits & 0x3fff) + 1);
        expect(height, src).toBe(((bits >>> 14) & 0x3fff) + 1);
      }
    }
  }
});

it('renders the hero headline in SSR without an entrance or reveal animation', () => {
  const markup = renderToStaticMarkup(<Hero />);
  expect(markup).toContain('<h1 class="disp">Rafic does the');
  const ancestors = markup.slice(0, markup.indexOf('<h1'));
  expect(ancestors).not.toMatch(/class="[^"]*\brv\b|opacity:0|visibility:hidden/);
  const css = readFileSync(new URL('../src/components/hero/Hero.module.css', import.meta.url), 'utf8');
  for (const selector of ['hero', 'hero-grid', 'hero h1']) {
    const rule = css.match(new RegExp(`\\.${selector}\\{([^}]+)\\}`))![1];
    expect(rule).not.toMatch(/animation|opacity|visibility/);
  }
});

it('loads both copies of the first app row eagerly and only the second row lazily', () => {
  const markup = renderToStaticMarkup(<AppsStrip />);
  const images = markup.match(/<img\b[^>]*>/g)!;
  const boundary = APP_ROW_1.length * 2;
  expect(images).toHaveLength(boundary + APP_ROW_2.length * 2);
  for (const [index, tag] of images.entries()) {
    expect(tag).toContain(`loading="${index < boundary ? 'eager' : 'lazy'}"`);
    expect(tag).toContain('decoding="async"');
  }
});

it('keeps the AI avatar height automatic and fits non-square marks inside square tiles', () => {
  const rules = (file: string, selector: string) => {
    const result: Record<string, string> = {};
    postcss.parse(readFileSync(new URL(`../src/components/${file}`, import.meta.url), 'utf8'))
      .walkRules(selector, rule => { rule.walkDecls(decl => { result[decl.prop] = decl.value; }); });
    return result;
  };
  expect(rules('hero/Hero.module.css', '.rf-ai-av img').height).toBe('auto');
  for (const [file, selector] of [
    ['hero/Hero.module.css', '.eyebrow img'],
    ['hero/Hero.module.css', '.rf-brand img'],
    ['apps/AppsStrip.module.css', '.app-tile img'],
    ['capabilities/Hub.module.css', '.node img'],
    ['capabilities/MemoryTree.module.css', '.t-root img'],
    ['capabilities/NightShift.module.css', '.fcard img'],
    ['capabilities/Photoshop.module.css', '.ps-rafic-l img'],
  ]) expect(rules(file, selector)['object-fit']).toBe('contain');
});
