import { expect, test } from '@playwright/test';

test('footer ends with a large outlined Sutur wordmark below the copyright line', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');

    const footer = page.locator('.site-footer');
    const wordmark = footer.locator('.footer-outline-wordmark');
    await footer.scrollIntoViewIfNeeded();

    await expect(wordmark).toHaveCount(1);
    await expect(wordmark).toHaveText('sutur');
    await expect(wordmark).toHaveAttribute('aria-hidden', 'true');

    const metrics = await footer.evaluate((node) => {
      const copyright = node.querySelector('.copyright')!;
      const wordmark = node.querySelector('.footer-outline-wordmark')!;
      const footerStyle = getComputedStyle(node);
      const wordmarkStyle = getComputedStyle(wordmark);
      const footerBox = node.getBoundingClientRect();
      const copyrightBox = copyright.getBoundingClientRect();
      const wordmarkBox = wordmark.getBoundingClientRect();
      return {
        followsCopyright: Boolean(
          copyright.compareDocumentPosition(wordmark) & Node.DOCUMENT_POSITION_FOLLOWING,
        ),
        footerBackground: footerStyle.backgroundColor,
        fill: wordmarkStyle.color,
        strokeColor: wordmarkStyle.webkitTextStrokeColor,
        strokeWidth: Number.parseFloat(wordmarkStyle.webkitTextStrokeWidth),
        fontSize: Number.parseFloat(wordmarkStyle.fontSize),
        belowCopyright: wordmarkBox.top >= copyrightBox.bottom,
        contained:
          wordmarkBox.left >= footerBox.left - 1 &&
          wordmarkBox.right <= footerBox.right + 1,
      };
    });

    expect(metrics.followsCopyright).toBe(true);
    expect(metrics.fill).toBe(metrics.footerBackground);
    expect(metrics.strokeColor).not.toBe(metrics.footerBackground);
    expect(metrics.strokeWidth).toBeGreaterThanOrEqual(1);
    expect(metrics.fontSize).toBeGreaterThanOrEqual(width * 0.15);
    expect(metrics.belowCopyright).toBe(true);
    expect(metrics.contained).toBe(true);
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
