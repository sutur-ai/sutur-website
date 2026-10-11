import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const repoRoot = new URL('../../', import.meta.url);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.goto(new URL('scripts/og-image/card.html', repoRoot).href, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => image.decode()));
  });
  await page.screenshot({
    path: fileURLToPath(new URL('public/og.jpg', repoRoot)),
    type: 'jpeg',
    quality: 92,
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
  const families = await page.evaluate(() => [...document.fonts]
    .filter(font => font.status === 'loaded').map(font => font.family));
  console.log('fonts loaded:', [...new Set(families)].join(', '));
} finally {
  await browser.close();
}
