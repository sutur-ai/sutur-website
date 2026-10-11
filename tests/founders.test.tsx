import { readFileSync } from 'node:fs';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Founders } from '../src/components/sections/Founders';

vi.stubGlobal('React', React);
it('renders the four original logos with design alt text and intrinsic dimensions', () => {
  const markup = renderToStaticMarkup(<Founders />);
  expect(markup.match(/<img /g)).toHaveLength(4);
  for (const [file, alt] of [
    ['american-university-of-beirut.png', 'American University of Beirut'],
    ['university-of-toronto.svg', 'University of Toronto'],
    ['uclouvain.png', 'UCLouvain'],
    ['boston-consulting-group.png', 'Boston Consulting Group'],
  ]) {
    const tag = markup.match(new RegExp(`<img[^>]*src="/brand/founders/${file}"[^>]*>`))?.[0] ?? '';
    expect(tag).toContain(`alt="${alt}"`);
    if (file.endsWith('.png')) {
      const png = readFileSync(new URL(`../public/brand/founders/${file}`, import.meta.url));
      expect(tag).toContain(`width="${png.readUInt32BE(16)}"`);
      expect(tag).toContain(`height="${png.readUInt32BE(20)}"`);
    } else {
      expect(tag).toContain('width="428.5" height="159"');
    }
  }
});
