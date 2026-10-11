import { expect, test } from '@playwright/test';
import { getCalendlyEmbedUrl } from '../src/lib/booking/calendly';

for (const width of [390, 1280, 1440, 1920, 2560]) {
  test(`booking heading anchor preserves the 56px gap at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('#book')).toHaveCSS('scroll-margin-top', /px$/);
    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    if (await menu.isVisible()) {
      await menu.click();
      await page.locator('#phone-menu a[href="#book"]').click();
    } else {
      await page.locator('.nav-cta').click();
    }
    await expect.poll(() => page.evaluate(() => {
      const heading = document.querySelector('#book h2')!.getBoundingClientRect();
      const header = document.querySelector('header')!.getBoundingClientRect();
      return Math.abs(heading.top - header.bottom - 56);
    })).toBeLessThanOrEqual(1);
  });
}

for (const width of [360, 390, 1440]) {
  test(`booking keeps validated Calendly prefill at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#book');
    const form = page.locator('.booking-lead-form');
    await expect(form).toContainText('Step 1 of 2 · Your details');
    await form.getByRole('button', { name: 'Choose a time' }).click();
    await expect(form.locator('[name="firstName"]')).toBeFocused();
    await expect(page.locator('.booking-calendar-frame')).toHaveCount(0);

    const details = {
      firstName: ' Karim ', lastName: ' Karim ', country: 'Lebanon',
      city: ' Beirut ', phone: ' +961 70 123 456 ', email: ' karim@example.com ',
      businessName: ' Cedar Foods ', tellUsMore: ' Prepare the weekly brief. ',
    };
    for (const [field, value] of Object.entries(details)) {
      const control = form.locator(`[name="${field}"]`);
      if (field === 'country') await control.selectOption(value);
      else await control.fill(value);
    }
    await form.getByRole('button', { name: 'Choose a time' }).click();
    await expect(form).toHaveCount(0);
    const calendar = page.locator('.booking-calendar');
    await expect(calendar).toBeFocused();
    await expect(calendar).toContainText('Step 2 of 2 · Choose a time');
    const frame = page.locator('.booking-calendar-frame');
    await expect(frame).toBeAttached();
    if (width <= 390) {
      const bounds = await frame.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.width).toBeGreaterThanOrEqual(320);
      expect(bounds!.width).toBeGreaterThanOrEqual(width - 40);
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    }
    const actual = new URL((await frame.getAttribute('src'))!);
    const expected = getCalendlyEmbedUrl(`${actual.origin}${actual.pathname}`, details);
    expect(actual.toString()).toBe(expected);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test('booking omits a blank optional note from Calendly', async ({ page }) => {
  await page.goto('/#book');
  const form = page.locator('.booking-lead-form');
  for (const [field, value] of Object.entries({ firstName: 'Karim', lastName: 'Karim', city: 'Beirut', phone: '+961 70 123 456', email: 'karim@example.com' })) {
    await form.locator(`[name="${field}"]`).fill(value);
  }
  await form.locator('[name="country"]').selectOption('Lebanon');
  await form.getByRole('button', { name: 'Choose a time' }).click();
  const frame = page.locator('.booking-calendar-frame');
  await expect(frame).toBeAttached();
  const url = new URL((await frame.getAttribute('src'))!);
  expect(url.searchParams.get('a4')).toBe('');
  expect(url.searchParams.has('a5')).toBe(false);
});
