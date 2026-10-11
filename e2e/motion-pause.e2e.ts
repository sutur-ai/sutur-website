import { expect, test } from '@playwright/test';

test('first keyboard target pauses CSS loops and remembers the choice', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  const toggle = page.locator('.motion-toggle');
  await expect(toggle).toHaveAccessibleName('Pause animations');
  await expect(toggle).toBeFocused();
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');

  const visual = page.getByRole('img', { name: 'Rafic in Photoshop: it types a new headline, then changes the sun shape from orange to violet', exact: true });
  await visual.scrollIntoViewIfNeeded();
  await expect.poll(() => visual.evaluate(element => {
    const loop = [...element.querySelectorAll<HTMLElement>('*')].find(child => {
      const style = getComputedStyle(child);
      return style.animationIterationCount.includes('infinite') && style.animationPlayState === 'running';
    });
    if (loop) loop.setAttribute('data-motion-test-loop', '');
    return Boolean(loop);
  })).toBe(true);
  const loop = page.locator('[data-motion-test-loop]').first();
  await page.keyboard.press('Space');
  await expect(toggle).toHaveText('Play animations');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => loop.evaluate(element => getComputedStyle(element).animationPlayState)).toBe('paused');
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveText('Pause animations');
  await expect.poll(() => loop.evaluate(element => getComputedStyle(element).animationPlayState)).toBe('running');
  await page.keyboard.press('Space');
  await page.reload();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Play animations', exact: true })).toBeFocused();
  await expect(page.locator('html')).toHaveClass(/animations-paused/);
});

test('the keyboard control works with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Pause animations', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Play animations', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('paused phone menu and scroll entrances remain visible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveClass(/animations-paused/);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const menu = page.locator('#phone-menu');
  await expect(menu).toHaveCSS('opacity', '1');
  const link = menu.locator('a[href="#what"]');
  await expect(link).toHaveCSS('opacity', '1');
  await expect(link).toBeVisible();
  await link.click();
  const reveal = page.locator('#what .sec-head.rv');
  await reveal.scrollIntoViewIfNeeded();
  await expect(reveal).toHaveCSS('opacity', '1');
  await expect(reveal).toHaveCSS('transform', 'none');
});
