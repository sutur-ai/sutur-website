import { expect, test } from '@playwright/test';

test('hero autoplays, pauses off screen, and resumes to approval', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const app = page.getByRole('region', { name: 'The Rafic app at work' });
  await expect(app).toHaveAttribute('data-step', '1');
  await page.locator('footer').scrollIntoViewIfNeeded();
  await expect(app).toHaveClass(/idle/);
  const step = await app.getAttribute('data-step');
  await page.waitForTimeout(2200);
  await expect(app).toHaveAttribute('data-step', step!);
  await app.scrollIntoViewIfNeeded();
  await expect(app.getByRole('button', { name: 'Approve', exact: true })).toBeVisible({ timeout: 7000 });
  await app.getByRole('button', { name: 'Approve', exact: true }).click();
  await expect(app.getByRole('status')).toHaveText('Approved · 6 reminders sent');
  await expect(app.getByText('Message Rafic', { exact: true })).toBeVisible();
  await app.getByRole('button', { name: 'Play again' }).click();
  await expect(app).toHaveAttribute('data-step', '0');
});

for (const width of [390, 1440]) {
  test(`hero reduced motion, keyboard decisions, and scenario switching at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const app = page.getByRole('region', { name: 'The Rafic app at work' });
    await app.scrollIntoViewIfNeeded();
    if (width === 390) await expect(app.locator('aside')).toBeHidden();
    else await expect(app.locator('aside')).toBeVisible();
    for (const [label, seconds] of [['Chase overdue invoices', 3], ['Prep my Monday', 3], ['Resize the campaign', 4]] as const) {
      const chip = page.getByRole('button', { name: label, exact: true });
      await chip.focus();
      await page.keyboard.press('Enter');
      await expect(chip).toHaveAttribute('aria-pressed', 'true');
      await expect(app.getByText(`Thought for ${seconds}s`)).toBeVisible();
      const deny = app.getByRole('button', { name: 'Deny', exact: true });
      await deny.focus();
      await expect(deny).toBeFocused();
      expect(await deny.evaluate(node => getComputedStyle(node).outlineStyle)).not.toBe('none');
      await page.keyboard.press('Enter');
      await expect(app.getByRole('status')).toHaveText('Denied · nothing was sent');
      await app.getByRole('button', { name: 'Play again' }).click();
      await app.getByRole('button', { name: 'Approve', exact: true }).click();
      await expect(app.getByRole('status')).toContainText('Approved ·');
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}
