import { expect, test } from '@playwright/test';
import { SX_TEAMS } from '../src/content/useCases';
import { SX_FAQ } from '../src/content/faq';

test('team buttons work with Tab, Enter and Space and preserve focus', async ({ page }) => {
  await page.goto('/#teams');
  const group = page.getByRole('group', { name: 'Choose a team' });
  await group.getByRole('button', { name: 'Operations', exact: true }).focus();
  let index = 0;
  for (const team of Object.values(SX_TEAMS)) {
    const button = group.getByRole('button', { name: team.label, exact: true });
    await expect(button).toBeFocused();
    await button.press(index % 2 ? 'Space' : 'Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(group.locator('[aria-pressed="true"]')).toHaveCount(1);
    for (const ask of team.asks) {
      await expect(page.locator('#team-asks')).toContainText(`“${ask.q}”`);
      for (const app of ask.apps) await expect(page.locator('#team-asks')).toContainText(app);
    }
    await expect(button).toBeFocused();
    if (++index < 5) await page.keyboard.press('Tab');
  }
});

test('FAQ starts open, switches one answer at a time and closes with keyboard activation', async ({ page }) => {
  await page.goto('/#faq');
  const faq = page.locator('#faq');
  await expect(faq.locator('[aria-expanded="true"]')).toHaveCount(1);
  await expect(page.locator('#faq-answer-0')).toBeVisible();
  await faq.getByRole('button').first().focus();
  for (let index = 0; index < SX_FAQ.length; index++) {
    const button = faq.getByRole('button', { name: SX_FAQ[index].q, exact: true });
    if (index > 0) {
      await page.keyboard.press('Tab');
      await expect(button).toBeFocused();
      await button.press(index % 2 ? 'Space' : 'Enter');
    }
    await expect(button).toHaveAttribute('aria-controls', `faq-answer-${index}`);
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(faq.locator('[aria-expanded="true"]')).toHaveCount(1);
    await expect(page.locator(`#faq-answer-${index}`)).toHaveText(SX_FAQ[index].a);
    for (let other = 0; other < SX_FAQ.length; other++) {
      if (other !== index) await expect(page.locator(`#faq-answer-${other}`)).toBeHidden();
    }
  }
  await page.keyboard.press('Enter');
  await expect(faq.locator('[aria-expanded="true"]')).toHaveCount(0);
  await page.keyboard.press('Space');
  await expect(page.locator('#faq-answer-4')).toBeVisible();
});

test('content changes show their final state without animation under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#teams');
  await page.getByRole('group', { name: 'Choose a team' }).getByRole('button', { name: 'Creative' }).click();
  await page.locator('#faq').getByRole('button', { name: SX_FAQ[4].q }).click();
  for (const selector of ['#team-asks > div', '#faq-answer-4 p']) {
    expect(await page.locator(selector).first().evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  }
});

test('team cards and FAQ answers use the approved entry animation timings', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#teams');
  await page.getByRole('group', { name: 'Choose a team' }).getByRole('button', { name: 'Finance', exact: true }).click();
  await page.locator('#faq').getByRole('button', { name: SX_FAQ[4].q }).click();
  for (const [selector, duration] of [['#team-asks > div', '0.4s'], ['#faq-answer-4 p', '0.3s']]) {
    const animation = await page.locator(selector).first().evaluate(element => {
      const style = getComputedStyle(element);
      return { name: style.animationName, duration: style.animationDuration, iterations: style.animationIterationCount };
    });
    expect(animation.name).not.toBe('none');
    expect(animation.duration).toBe(duration);
    expect(animation.iterations).toBe('1');
  }
});
