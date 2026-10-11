import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/font/local', () => ({
  default: () => ({ variable: 'local-font' }),
}));

import { metadata } from '../src/app/layout';

const sharp = createRequire(import.meta.url)('sharp');

const preview = {
  url: '/og.jpg',
  type: 'image/jpeg',
  width: 1200,
  height: 630,
  alt: 'Rafic by Sutur: Rafic does the work. You approve what matters.',
};

describe('link-preview metadata', () => {
  it('uses the full-size artwork for Open Graph', () => {
    expect(metadata.openGraph?.images).toEqual([preview]);
    expect(metadata.metadataBase?.href).toBe('https://sutur.ai/');
  });

  it('uses the same artwork for a large Twitter card', () => {
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      images: [preview],
    });
  });
});

const renderedImage = new URL('../public/og.jpg', import.meta.url);
it.skipIf(!existsSync(renderedImage))('keeps the rendered JPEG at 1200×630 and under 300 KB', async () => {
  const bytes = readFileSync(renderedImage);
  expect(await sharp(bytes).metadata()).toMatchObject({
    format: 'jpeg',
    width: 1200,
    height: 630,
  });
  expect(bytes.length).toBeLessThan(300_000);
});
