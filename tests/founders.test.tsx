import { existsSync } from 'node:fs';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Founders } from '../src/components/sections/Founders';

vi.stubGlobal('React', React);
it('renders the four right-sized logos with design alt text and intrinsic dimensions', () => {
  const markup = renderToStaticMarkup(<Founders />);
  expect(markup.match(/<img /g)).toHaveLength(4);
  for (const [file, alt, width] of [
    ['american-university-of-beirut.webp', 'American University of Beirut', 327],
    ['university-of-toronto.webp', 'University of Toronto', 294],
    ['uclouvain.webp', 'UCLouvain', 471],
    ['boston-consulting-group.webp', 'Boston Consulting Group', 519],
  ]) {
    const tag = markup.match(new RegExp(`<img[^>]*src="/brand/founders/${file}"[^>]*>`))?.[0] ?? '';
    expect(tag).toContain(`alt="${alt}"`);
    expect(existsSync(new URL(`../public/brand/founders/${file}`, import.meta.url))).toBe(true);
    expect(tag).toContain(`width="${width}" height="109"`);
    expect(tag).toContain('loading="lazy" decoding="async"');
  }
});
