import { expect, test } from '@playwright/test';

for (const width of [1440, 390]) {
  test(`visible images preserve intrinsic proportions at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    if (width === 1440) {
      const avatar = page.locator('[class*="rf-ai-av"] img');
      await avatar.scrollIntoViewIfNeeded();
      await expect(avatar).toBeInViewport();
      await expect.poll(() => avatar.evaluate(img => img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0)).toBe(true);
      const avatarMetrics = await avatar.evaluate(img => {
        if (!(img instanceof HTMLImageElement)) throw new Error('Expected an image element');
        const rect = img.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          ratioError: Math.abs((rect.width / rect.height) / (img.naturalWidth / img.naturalHeight) - 1),
        };
      });
      expect(avatarMetrics.width).toBeCloseTo(12, 1);
      expect(avatarMetrics.height).toBeCloseTo(14.4, 1);
      expect(avatarMetrics.ratioError).toBeLessThanOrEqual(0.02);
    }
    let checked = 0;
    for (const image of await page.locator('img').all()) {
      if (!await image.isVisible()) continue;
      // Bring below-fold images into view without scrolling clipped marquee copies horizontally.
      const reachable = await image.evaluate(img => {
        const rect = img.getBoundingClientRect();
        if (rect.right <= 0 || rect.left >= innerWidth) return false;
        window.scrollTo({ top: scrollY + rect.top - 150, behavior: 'instant' });
        return true;
      });
      if (!reachable) continue;
      const visible = await image.evaluate(img => {
        let bounds = img.getBoundingClientRect();
        let left = Math.max(0, bounds.left), right = Math.min(innerWidth, bounds.right);
        let top = Math.max(0, bounds.top), bottom = Math.min(innerHeight, bounds.bottom);
        for (let parent: Element | null = img; parent; parent = parent.parentElement) {
          const style = getComputedStyle(parent);
          if (style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
          bounds = parent.getBoundingClientRect();
          if (['hidden', 'clip', 'auto', 'scroll'].includes(style.overflowX)) {
            left = Math.max(left, bounds.left); right = Math.min(right, bounds.right);
          }
          if (['hidden', 'clip', 'auto', 'scroll'].includes(style.overflowY)) {
            top = Math.max(top, bounds.top); bottom = Math.min(bottom, bounds.bottom);
          }
        }
        return right > left && bottom > top;
      });
      if (!visible) continue;
      await expect.poll(() => image.evaluate(img => img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0)).toBe(true);
      const metrics = await image.evaluate(img => {
        if (!(img instanceof HTMLImageElement)) throw new Error('Expected an image element');
        const css = getComputedStyle(img);
        // object-fit works in the content box, excluding the tile's padding and border.
        const contentWidth = parseFloat(css.width) - (css.boxSizing === 'border-box'
          ? parseFloat(css.paddingLeft) + parseFloat(css.paddingRight) + parseFloat(css.borderLeftWidth) + parseFloat(css.borderRightWidth) : 0);
        const contentHeight = parseFloat(css.height) - (css.boxSizing === 'border-box'
          ? parseFloat(css.paddingTop) + parseFloat(css.paddingBottom) + parseFloat(css.borderTopWidth) + parseFloat(css.borderBottomWidth) : 0);
        let renderedWidth = contentWidth, renderedHeight = contentHeight;
        if (css.objectFit === 'contain' || css.objectFit === 'cover' || css.objectFit === 'scale-down' || css.objectFit === 'none') {
          const scale = css.objectFit === 'cover' ? Math.max(contentWidth / img.naturalWidth, contentHeight / img.naturalHeight)
            : css.objectFit === 'none' ? 1 : Math.min(contentWidth / img.naturalWidth, contentHeight / img.naturalHeight, css.objectFit === 'scale-down' ? 1 : Infinity);
          renderedWidth = img.naturalWidth * scale;
          renderedHeight = img.naturalHeight * scale;
        }
        return {
          src: img.currentSrc, renderedWidth, renderedHeight,
          ratioError: Math.abs((renderedWidth / renderedHeight) / (img.naturalWidth / img.naturalHeight) - 1),
        };
      });
      expect(metrics.renderedWidth, metrics.src).toBeGreaterThan(0);
      expect(metrics.renderedHeight, metrics.src).toBeGreaterThan(0);
      expect(metrics.ratioError, metrics.src).toBeLessThanOrEqual(0.02);
      checked++;
    }
    expect(checked).toBeGreaterThan(10);
  });
}
