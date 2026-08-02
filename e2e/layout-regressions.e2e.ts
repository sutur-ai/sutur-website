import { expect, test } from '@playwright/test';

test('footer ends with the current outlined Sutur artwork below the copyright line', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');

    const footer = page.locator('.site-footer');
    const copyright = footer.locator('.copyright');
    const logo = footer.locator('.footer-outline-logo');
    await footer.scrollIntoViewIfNeeded();

    await expect(footer.locator('.footer-outline-wordmark')).toHaveCount(0);
    await expect(copyright).toContainText('© 2026 Sutur. All rights reserved.');
    await expect(logo).toHaveCount(1);
    await expect(logo).toHaveAttribute('aria-hidden', 'true');
    await expect(logo.locator('image').first()).toHaveAttribute(
      'href',
      '/brand/design-system/sutur-wordmark-soft.png',
    );

    const metrics = await footer.evaluate((node) => {
      const copyright = node.querySelector('.copyright')!;
      const logo = node.querySelector('.footer-outline-logo')!;
      const footerBox = node.getBoundingClientRect();
      const copyrightBox = copyright.getBoundingClientRect();
      const logoBox = logo.getBoundingClientRect();
      return {
        followsCopyright: Boolean(
          copyright.compareDocumentPosition(logo) & Node.DOCUMENT_POSITION_FOLLOWING,
        ),
        isLastElement: node.lastElementChild === logo,
        belowCopyright: logoBox.top >= copyrightBox.bottom,
        wideEnough: logoBox.width >= Math.min(footerBox.width * 0.75, 1_000),
        contained:
          logoBox.left >= footerBox.left - 1 &&
          logoBox.right <= footerBox.right + 1 &&
          logoBox.bottom <= footerBox.bottom + 1,
      };
    });

    expect(metrics.followsCopyright).toBe(true);
    expect(metrics.isLastElement).toBe(true);
    expect(metrics.belowCopyright).toBe(true);
    expect(metrics.wideEnough).toBe(true);
    expect(metrics.contained).toBe(true);
  }
});

test('reviews stay structured and contained from desktop through 320px', async ({ page }) => {
  for (const width of [1440, 1025, 1024, 760, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');

    const reviews = page.locator('#reviews');
    await reviews.scrollIntoViewIfNeeded();

    await expect(reviews.locator('.review-card')).toHaveCount(3);
    await expect(reviews.locator('.review-identity h3')).toHaveText([
      'Charles Arbid',
      'Ibrahim Jarkass',
      'Dr. Amin Chaptini',
    ]);
    await expect(reviews.locator('.review-company')).toHaveText([
      'Retailinc',
      'FixPro',
      'Chaptini Smile Clinic',
    ]);
    await expect(reviews.locator('blockquote')).toHaveCount(0);

    const metrics = await reviews.evaluate((node) => {
      const sectionBox = node.getBoundingClientRect();
      const cards = [...node.querySelectorAll('.review-card')];
      return {
        documentFitsViewport: document.documentElement.scrollWidth <= window.innerWidth,
        cardsContained: cards.every((card) => {
          const cardBox = card.getBoundingClientRect();
          return cardBox.left >= sectionBox.left - 1 && cardBox.right <= sectionBox.right + 1;
        }),
      };
    });

    expect(metrics.documentFitsViewport, `${width}px document overflow`).toBe(true);
    expect(metrics.cardsContained, `${width}px review containment`).toBe(true);
  }
});

test('booking fields stay compact without shrinking accessible controls', async ({ page }) => {
  for (const { width, maxFormHeight } of [
    { width: 1440, maxFormHeight: 760 },
    { width: 390, maxFormHeight: 1050 },
  ]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');

    const form = page.locator('.booking-lead-form');
    await form.scrollIntoViewIfNeeded();

    const metrics = await form.evaluate((node) => {
      const form = node as HTMLFormElement;
      const controls = [...form.querySelectorAll('input, select, textarea')];
      const emptyErrors = [...form.querySelectorAll('.booking-form-grid em:empty')];
      const grid = form.querySelector('.booking-form-grid')!;
      return {
        height: form.getBoundingClientRect().height,
        rowGap: Number.parseFloat(getComputedStyle(grid).rowGap),
        shortestControl: Math.min(
          ...controls.map((control) => control.getBoundingClientRect().height),
        ),
        emptyErrorsHidden: emptyErrors.every(
          (error) => getComputedStyle(error).display === 'none',
        ),
      };
    });

    expect(metrics.rowGap, `${width}px form row gap`).toBeLessThanOrEqual(12);
    expect(metrics.shortestControl, `${width}px shortest form control`).toBeGreaterThanOrEqual(44);
    expect(metrics.emptyErrorsHidden, `${width}px empty error rows`).toBe(true);
    expect(metrics.height, `${width}px form height`).toBeLessThan(maxFormHeight);
  }
});
