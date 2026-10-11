import { expect, test } from '@playwright/test';

test('mobile memory loop keeps the next section at a constant document position', async ({ page }) => {
  test.setTimeout(45_000);
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);

  const memory = page.getByRole('img', { name: /^A tree: Rafic at the top/ });
  await memory.scrollIntoViewIfNeeded();
  await expect(memory).not.toHaveClass(/\bidle\b/);
  await expect(memory.locator('em')).toHaveCount(3);
  await expect(page.locator('#teams')).toBeAttached();
  await memory.evaluate(async element => {
    await Promise.all([...element.querySelectorAll('img')].map(image => image.decode()));
  });

  const samples = await memory.evaluate(async element => {
    const rows = [...element.querySelectorAll('em')].map(badge => badge.parentElement!);
    const nextSection = document.querySelector('#teams')!;
    const animations = rows.map(row => row.getAnimations().find(animation =>
      animation.effect?.getTiming().duration === 15_000));
    if (animations.some(animation => !animation || animation.playState !== 'running')) {
      throw new Error('All three New-row animations must run during the mobile layout check');
    }
    const samples = [];
    const start = performance.now();
    for (let index = 0; index <= 30; index++) {
      const delay = start + index * 500 - performance.now();
      if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
      samples.push({
        top: nextSection.getBoundingClientRect().top + window.scrollY,
        heights: rows.map(row => row.getBoundingClientRect().height),
        times: animations.map(animation => Number(animation!.currentTime)),
        opacities: rows.map(row => Number(getComputedStyle(row).opacity)),
        paused: element.classList.contains('idle'),
      });
    }
    return samples;
  });

  expect(samples).toHaveLength(31);
  expect(samples.every(sample => !sample.paused)).toBe(true);
  const tops = samples.map(sample => sample.top);
  expect(Math.max(...tops) - Math.min(...tops), 'next section shifts over the 15s loop').toBeLessThanOrEqual(0.5);
  for (let index = 0; index < 3; index++) {
    const heights = samples.map(sample => sample.heights[index]);
    expect(Math.min(...heights), 'each New row reserves its final space').toBeGreaterThan(20);
    expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(0.5);
    expect(samples[30].times[index] - samples[0].times[index]).toBeGreaterThanOrEqual(14_900);
    const opacities = samples.map(sample => sample.opacities[index]);
    expect(Math.max(...opacities) - Math.min(...opacities), 'row appearance still animates').toBeGreaterThan(0.9);
  }
});
