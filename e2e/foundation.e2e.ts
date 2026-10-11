import { expect, test } from '@playwright/test';

for (const width of [390, 1280, 1440, 1920, 2560]) {
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
    await page.evaluate(() => document.fonts.ready);
    // Test the h2 in viewport pixels, including the page's CSS zoom.
    for (const id of ['what', 'teams', 'control', 'start', 'faq', 'book']) {
      await page.evaluate(async id => {
        location.hash = id;
        document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' });
        let stableFrames = 0;
        let previous = window.scrollY;
        for (let frame = 0; frame < 120 && stableFrames < 4; frame++) {
          await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
          const current = window.scrollY;
          stableFrames = Math.abs(current - previous) < 0.01 ? stableFrames + 1 : 0;
          previous = current;
        }
      }, id);
      await expect.poll(async () => page.evaluate(id => {
        const heading = document.querySelector(`#${id} h2`)!.getBoundingClientRect();
        const header = document.querySelector('header')!.getBoundingClientRect();
        return Math.abs(heading.top - header.bottom - 56);
      }, id), { message: `${id} h2 must land 56px below the header` }).toBeLessThanOrEqual(0.5);
    }
    const detachedDots = await page.evaluate(() => {
      return [...document.querySelectorAll('h1 .dot, h2 .dot')].filter(dot => {
        let previous = dot.previousSibling;
        while (previous && (previous.nodeType !== Node.TEXT_NODE || !previous.textContent?.replace(/\u2060/g, '').trim())) previous = previous.previousSibling;
        if (!previous) return true;
        const text = previous.textContent ?? '';
        const range = document.createRange();
        range.setStart(previous, text.trimEnd().lastIndexOf(' ') + 1);
        range.setEnd(previous, text.trimEnd().length);
        const word = range.getBoundingClientRect();
        const punctuation = dot.getBoundingClientRect();
        return punctuation.top < word.top || punctuation.bottom > word.bottom;
      }).map(dot => dot.parentElement?.textContent);
    });
    expect(detachedDots).toEqual([]);
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
