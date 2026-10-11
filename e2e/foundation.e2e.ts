import { expect, test, type Page } from '@playwright/test';

async function waitForScrollToSettle(page: Page) {
  const settled = await page.evaluate(async () => {
    const deadline = performance.now() + 5000;
    let stableSince = performance.now();
    let previousY = window.scrollY;
    let previousHeaderHeight = document.querySelector('header')!.getBoundingClientRect().height;
    while (performance.now() < deadline) {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      const currentY = window.scrollY;
      const currentHeaderHeight = document.querySelector('header')!.getBoundingClientRect().height;
      if (Math.abs(currentY - previousY) > 0.01 || Math.abs(currentHeaderHeight - previousHeaderHeight) > 0.01) stableSince = performance.now();
      previousY = currentY;
      previousHeaderHeight = currentHeaderHeight;
      if (performance.now() - stableSince >= 300) return true;
    }
    return false;
  });
  expect(settled, 'scrollY and header height must remain stable for 300ms').toBe(true);
}

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
    await page.evaluate(() => document.fonts.ready);
    // Use the same anchor links as a visitor, including opening/closing the phone menu.
    for (const id of ['what', 'teams', 'control', 'start', 'faq', 'book']) {
      const menu = page.getByRole('button', { name: 'Menu', exact: true });
      if (await menu.isVisible()) {
        await menu.click();
        await expect(menu).toHaveAttribute('aria-expanded', 'true');
        await page.locator(`#phone-menu a[href="#${id}"]`).click();
        await expect(menu).toHaveAttribute('aria-expanded', 'false');
      } else {
        await page.locator(id === 'book' ? '.nav-cta' : `.nav-links a[href="#${id}"]`).click();
      }
      await expect(page.locator('#phone-menu')).toHaveCount(0);
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await waitForScrollToSettle(page);
      const gap = await page.evaluate(id => {
        const heading = document.querySelector(`#${id} h2`)!.getBoundingClientRect();
        const header = document.querySelector('header')!.getBoundingClientRect();
        return heading.top - header.bottom;
      }, id);
      expect(Math.abs(gap - 56), `${id} h2 gap is ${gap}px`).toBeLessThanOrEqual(1);
    }
    const detachedDots = await page.evaluate(() => {
      return [...document.querySelectorAll('h1 .dot, h2 .dot')].filter(dot => {
        if (!dot.parentElement?.matches('.nowrap') || getComputedStyle(dot.parentElement).whiteSpace !== 'nowrap') return true;
        let previous = dot.previousSibling;
        while (previous && (previous.nodeType !== Node.TEXT_NODE || !previous.textContent?.trim())) previous = previous.previousSibling;
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

for (const width of [721, 900, 1100]) {
  test(`header menu closes for its CTA and desktop resize at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const menu = page.locator('.nav-menu');
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page.locator('.nav-cta').click();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#phone-menu')).toHaveCount(0);
    await expect(page).toHaveURL(/#book$/);
    await waitForScrollToSettle(page);
    const gap = await page.evaluate(() => document.querySelector('#book h2')!.getBoundingClientRect().top - document.querySelector('header')!.getBoundingClientRect().bottom);
    expect(Math.abs(gap - 56)).toBeLessThanOrEqual(1);

    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page.setViewportSize({ width: 1101, height: 900 });
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#phone-menu')).toHaveCount(0);
    await expect(page.locator('.nav-links')).toBeVisible();
    await page.setViewportSize({ width, height: 900 });
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#phone-menu')).toHaveCount(0);
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
