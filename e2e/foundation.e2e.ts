import { expect, test } from '@playwright/test';

for (const width of [390, 1280, 1920, 2560]) {
  test(`foundation fits and navigates at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page).toHaveTitle('Rafic by Sutur');
    await expect(page.locator('h1')).toContainText('Rafic does the work');
    for (const id of ['top', 'what', 'teams', 'control', 'start', 'faq', 'book']) {
      await expect(page.locator(`section#${id}`)).toHaveCount(1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.locator('.fab')).toHaveAttribute('aria-hidden', 'false');
    if (width === 390) {
      const menu = page.getByRole('button', { name: 'Menu', exact: true });
      await menu.click();
      await expect(menu).toHaveAttribute('aria-expanded', 'true');
      await page.getByRole('navigation', { name: 'Menu', exact: true }).getByRole('link', { name: 'What Rafic does' }).click();
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator('#phone-menu')).toHaveCount(0);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // The approved offsets place the section label 56px below the header.
    for (const id of ['what', 'teams', 'start', 'faq']) {
      await page.evaluate(id => { location.hash = id; document.getElementById(id)?.scrollIntoView(); }, id);
      const gap = await page.evaluate(id => {
        const heading = document.querySelector(`#${id} .label`)!.getBoundingClientRect();
        const header = document.querySelector('header')!.getBoundingClientRect();
        return (heading.top - header.bottom) / (header.height / 64);
      }, id);
      expect(gap).toBeCloseTo(56, 0);
    }
    await page.locator('#book').scrollIntoViewIfNeeded();
    await expect(page.locator('.fab')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('.fab')).toHaveAttribute('tabindex', '-1');
    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect(page.locator('.fab')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('.booking-lead-form')).toBeAttached();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test('booking validation and Calendly handoff remain functional', async ({ page }) => {
  await page.goto('/#book');
  const form = page.locator('.booking-lead-form');
  await form.getByRole('button').click();
  await expect(form.locator('[name="firstName"]')).toHaveAttribute('aria-invalid', 'true');
  await form.locator('[name="firstName"]').fill('Ada');
  await form.locator('[name="lastName"]').fill('Lovelace');
  await form.locator('[name="country"]').selectOption('Lebanon');
  await form.locator('[name="city"]').fill('Beirut');
  await form.locator('[name="phone"]').fill('+961 70 123 456');
  await form.locator('[name="email"]').fill('ada@example.com');
  await form.getByRole('button').click();
  await expect(page.locator('.booking-calendar-frame')).toHaveAttribute('src', /calendly\.com/);
});
