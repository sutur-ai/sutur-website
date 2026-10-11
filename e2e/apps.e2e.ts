import { expect, test } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`apps preserve row order, logo space and reduced motion at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const strip = page.getByRole('region', { name: 'Apps Rafic works with' });
    const rows = strip.locator(':scope > div').filter({ has: page.locator('img') });
    await expect(rows).toHaveCount(2);
    await expect(strip.locator('img')).toHaveCount(78);
    await expect(strip.getByText('Outlook', { exact: true })).toHaveCount(2);
    await expect(strip.getByText('Any app with an API. Rafic proposes the connection, you approve it.')).toBeVisible();
    if (width === 1440) {
      const top = await rows.first().evaluate(element => element.getBoundingClientRect().top);
      expect(top).toBeGreaterThan(0);
      expect(top).toBeLessThan(900);
    }
    await strip.scrollIntoViewIfNeeded();
    const results = await rows.evaluateAll(elements => elements.map(row => {
      const track = row.firstElementChild!;
      const copies = [...track.children];
      const firstCard = copies[0].firstElementChild!;
      const logo = firstCard.querySelector('img')!;
      return {
        animation: getComputedStyle(track).animationName,
        transform: getComputedStyle(track).transform,
        firstName: firstCard.children[1].textContent,
        hidden: copies.map(copy => copy.getAttribute('aria-hidden')),
        widths: copies.map(copy => copy.getBoundingClientRect().width),
        cardWidth: firstCard.getBoundingClientRect().width,
        logo: [logo.width, logo.height, logo.complete, logo.naturalWidth > 0],
      };
    }));
    for (const [index, result] of results.entries()) {
      expect(result.animation).toBe('none');
      expect(result.transform).toBe('none');
      expect(result.firstName).toBe(index === 0 ? 'Outlook' : 'Figma');
      expect(result.hidden).toEqual([null, 'true']);
      expect(result.widths[0]).toBe(result.widths[1]);
      expect(result.cardWidth).toBe(width === 390 ? 150 : 172);
      expect(result.logo).toEqual([23, 23, true, true]);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('apps roll in opposite directions and pause on hover and off screen', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const strip = page.getByRole('region', { name: 'Apps Rafic works with' });
  await strip.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(strip).not.toHaveClass(/idle/);
  const rows = strip.locator(':scope > div').filter({ has: page.locator('img') });
  const tracks = rows.locator(':scope > div');
  await expect(tracks.first()).toHaveCSS('animation-duration', '80s');
  await expect(tracks.last()).toHaveCSS('animation-duration', '90s');
  await expect(tracks.first()).toHaveCSS('animation-direction', 'normal');
  await expect(tracks.last()).toHaveCSS('animation-direction', 'reverse');
  for (const track of await tracks.all()) await expect(track).toHaveCSS('animation-play-state', 'running');
  for (const row of await rows.all()) {
    await row.hover();
    await expect(row.locator(':scope > div')).toHaveCSS('animation-play-state', 'paused');
  }
  await page.mouse.move(0, 0);
  await page.locator('footer').scrollIntoViewIfNeeded();
  await expect(strip).toHaveClass(/idle/);
  for (const track of await tracks.all()) await expect(track).toHaveCSS('animation-play-state', 'paused');
  await strip.scrollIntoViewIfNeeded();
  await expect(strip).not.toHaveClass(/idle/);
  for (const track of await tracks.all()) await expect(track).toHaveCSS('animation-play-state', 'running');
});
