import { expect, test, type Locator, type Page } from '@playwright/test';

const AGENT_PROMPT =
  'I am running late 1h over my schedule, check my teams meetings and send an email to every person I have a meeting with to rearrange my meetings.';
const RECIPIENTS = ['Maya Nassar', 'Karim Haddad', 'Lina Mansour'];
const RESPONSIVE_WIDTHS = [1121, 1120, 841, 840, 681, 680, 421, 420, 390, 375, 320];
const runtimeErrorsByPage = new WeakMap<Page, string[]>();

async function waitForPhase(visual: Locator, phase: string) {
  await expect(visual).toHaveAttribute('data-agent-phase', phase, { timeout: 12_000 });
}

function transitionDelayMs(value: string) {
  const firstDelay = value.split(',')[0].trim();
  return Number.parseFloat(firstDelay) * (firstDelay.endsWith('ms') ? 1 : 1000);
}

async function transformScale(cell: Locator) {
  return cell.evaluate((node) => {
    const transform = getComputedStyle(node).transform;
    if (transform === 'none') return 1;
    return Number.parseFloat(transform.slice(transform.indexOf('(') + 1).split(',')[0]);
  });
}

async function expectInside(inner: Locator, outer: Locator, label: string) {
  const [innerBox, outerBox] = await Promise.all([inner.boundingBox(), outer.boundingBox()]);
  expect(innerBox, `${label} must render`).not.toBeNull();
  expect(outerBox, 'agent visual must render').not.toBeNull();
  if (!innerBox || !outerBox) return;

  const tolerance = 1;
  expect(innerBox.x, `${label} left edge`).toBeGreaterThanOrEqual(outerBox.x - tolerance);
  expect(innerBox.y, `${label} top edge`).toBeGreaterThanOrEqual(outerBox.y - tolerance);
  expect(innerBox.x + innerBox.width, `${label} right edge`).toBeLessThanOrEqual(
    outerBox.x + outerBox.width + tolerance,
  );
  expect(innerBox.y + innerBox.height, `${label} bottom edge`).toBeLessThanOrEqual(
    outerBox.y + outerBox.height + tolerance,
  );
}

async function expectNoOverflow(locator: Locator, label: string) {
  const box = await locator.evaluate((node) => ({
    clientHeight: node.clientHeight,
    clientWidth: node.clientWidth,
    scrollHeight: node.scrollHeight,
    scrollWidth: node.scrollWidth,
  }));
  expect(box.scrollHeight, `${label} vertical overflow`).toBeLessThanOrEqual(box.clientHeight + 1);
  expect(box.scrollWidth, `${label} horizontal overflow`).toBeLessThanOrEqual(box.clientWidth + 1);
}

async function expectCursorTargets(cursor: Locator, app: Locator, label: string) {
  const [cursorTip, appBox] = await Promise.all([
    cursor.evaluate((node) => {
      const matrix = (node as SVGGraphicsElement).getScreenCTM();
      if (!matrix) return null;
      const point = new DOMPoint(3, 2.5).matrixTransform(matrix);
      return { x: point.x, y: point.y };
    }),
    app.boundingBox(),
  ]);
  expect(cursorTip, `${label} cursor must render`).not.toBeNull();
  expect(appBox, `${label} app must render`).not.toBeNull();
  if (!cursorTip || !appBox) return;
  const appCenter = {
    x: appBox.x + appBox.width / 2,
    y: appBox.y + appBox.height / 2,
  };
  const tolerance = appBox.width * 0.2;
  expect(Math.abs(cursorTip.x - appCenter.x), `${label} cursor x target`).toBeLessThan(tolerance);
  expect(Math.abs(cursorTip.y - appCenter.y), `${label} cursor y target`).toBeLessThan(tolerance);
}

async function openCapabilities(page: Page) {
  await page.goto('/');
  const card = page.locator('[data-capability="agent"]');
  await card.scrollIntoViewIfNeeded();
  return {
    card,
    visual: card.locator('[data-agent-phase]'),
    prompt: card.locator('[data-agent-prompt] p'),
  };
}

test.beforeEach(async ({ page }) => {
  const runtimeErrors: string[] = [];
  runtimeErrorsByPage.set(page, runtimeErrors);
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
});

test.afterEach(async ({ page }) => {
  expect(runtimeErrorsByPage.get(page) ?? []).toEqual([]);
});

test('runs the causal workflow and stale timers cannot survive cancellation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const { card, visual, prompt } = await openCapabilities(page);

  await card.hover();
  await waitForPhase(visual, 'collapsing');
  await waitForPhase(visual, 'typing');
  await expect
    .poll(async () => {
      const length = ((await prompt.textContent()) ?? '').length;
      return length > 0 && length < AGENT_PROMPT.length;
    })
    .toBe(true);

  await page.locator('#capabilities-title').hover();
  await waitForPhase(visual, 'idle');
  await page.waitForTimeout(900);
  await expect(prompt).toHaveText('');

  await card.hover();
  await waitForPhase(visual, 'checking');
  await expect(visual.locator('[data-agent-meeting]')).toHaveCount(3);
  for (const recipient of RECIPIENTS) await expect(visual).toContainText(recipient);

  await waitForPhase(visual, 'drafting');
  await waitForPhase(visual, 'validated');
  await expect(visual.locator('[data-agent-app-badge]')).toHaveCount(2);
  await expect(visual.locator('[data-agent-app-badge]')).toHaveText(['3', '3']);

  await waitForPhase(visual, 'opening-teams');
  const cursor = visual.locator('[data-agent-cursor]');
  const teamsWindow = visual.locator('[data-agent-window="teams"]');
  await expect(cursor).toHaveAttribute('data-agent-cursor', 'teams');
  await expect
    .poll(async () => Number.parseFloat(await teamsWindow.evaluate((node) => getComputedStyle(node).opacity)), {
      timeout: 1_300,
    })
    .toBeGreaterThan(0.98);
  await expect(cursor).toHaveAttribute('data-agent-cursor', 'teams');
  await expectCursorTargets(cursor, visual.locator('[data-agent-app="teams"]'), 'Teams');

  await waitForPhase(visual, 'opening-gmail');
  const gmailWindow = visual.locator('[data-agent-window="gmail"]');
  await expect(cursor).toHaveAttribute('data-agent-cursor', 'gmail');
  await expect
    .poll(async () => Number.parseFloat(await gmailWindow.evaluate((node) => getComputedStyle(node).opacity)), {
      timeout: 1_300,
    })
    .toBeGreaterThan(0.98);
  await expect(cursor).toHaveAttribute('data-agent-cursor', 'gmail');
  await expect(teamsWindow).toHaveCSS('opacity', '1');
  await expectCursorTargets(cursor, visual.locator('[data-agent-app="gmail"]'), 'Gmail');

  await waitForPhase(visual, 'complete');
  await expect(prompt).toHaveText(AGENT_PROMPT);
  await expect(visual.locator('[data-agent-draft]')).toHaveCount(3);
  await expect(visual.locator('g[data-integration]')).toHaveCount(13);
  for (const recipient of RECIPIENTS) await expect(visual).toContainText(recipient);

  await page.locator('#capabilities-title').hover();
  await waitForPhase(visual, 'idle');
  await expect(prompt).toHaveText('');
});

test('stack enters from bottom-right, exits from top-left, and final app windows show changes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const { card, visual } = await openCapabilities(page);
  const cells = visual.locator('g[data-integration]');

  await card.hover();
  await waitForPhase(visual, 'collapsing');
  const enterFirst = transitionDelayMs(await cells.first().evaluate((node) => getComputedStyle(node).transitionDelay));
  const enterLast = transitionDelayMs(await cells.last().evaluate((node) => getComputedStyle(node).transitionDelay));
  expect(enterFirst, 'top-left should enter after bottom-right').toBeGreaterThan(enterLast);
  await expect
    .poll(async () => (await transformScale(cells.first())) > (await transformScale(cells.last())), {
      message: 'top-left should still be larger during entry',
    })
    .toBe(true);

  await expect
    .poll(async () => Math.abs((await transformScale(cells.first())) - 0.46), {
      message: 'integration stack should finish collapsing before exit',
    })
    .toBeLessThan(0.02);
  await page.locator('#capabilities-title').hover();
  await waitForPhase(visual, 'idle');
  const exitFirst = transitionDelayMs(await cells.first().evaluate((node) => getComputedStyle(node).transitionDelay));
  const exitLast = transitionDelayMs(await cells.last().evaluate((node) => getComputedStyle(node).transitionDelay));
  expect(exitFirst, 'top-left should exit before bottom-right').toBeLessThan(exitLast);
  await expect
    .poll(async () => (await transformScale(cells.first())) > (await transformScale(cells.last())), {
      message: 'top-left should be larger during exit',
    })
    .toBe(true);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'networkidle' });
  const reducedCard = page.locator('[data-capability="agent"]');
  const reducedVisual = reducedCard.locator('[data-agent-phase]');
  await reducedCard.scrollIntoViewIfNeeded();
  await reducedCard.hover();
  await waitForPhase(reducedVisual, 'complete');
  await expect(reducedVisual.locator('[data-agent-app="teams"]')).toBeVisible();
  await expect(reducedVisual.locator('[data-agent-app="gmail"]')).toBeVisible();
  await expect(reducedVisual.locator('[data-agent-app-badge]')).toHaveText(['3', '3']);
  await expect(reducedVisual.locator('[data-agent-window="teams"] [data-agent-window-row]')).toHaveCount(3);
  await expect(reducedVisual.locator('[data-agent-window="gmail"] [data-agent-window-row]')).toHaveCount(3);
});

test('touch stays idle, keyboard focus works, and reduced motion completes immediately', async ({ page }) => {
  await page.setViewportSize({ width: 840, height: 1000 });
  const { card, visual } = await openCapabilities(page);
  const agentLink = card.locator('a');
  const erpLink = page.locator('[data-capability="erp"] a');

  await card.dispatchEvent('pointerdown', { pointerType: 'touch', bubbles: true });
  await agentLink.focus();
  await page.waitForTimeout(100);
  await expect(card).toHaveAttribute('data-agent-active', 'false');
  await waitForPhase(visual, 'idle');

  await erpLink.focus();
  await page.mouse.move(0, 0);
  await agentLink.focus();
  await waitForPhase(visual, 'collapsing');
  await expect(card).toHaveAttribute('data-agent-active', 'true');
  await erpLink.focus();
  await waitForPhase(visual, 'idle');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'networkidle' });
  const reducedCard = page.locator('[data-capability="agent"]');
  const reducedVisual = reducedCard.locator('[data-agent-phase]');
  await reducedCard.scrollIntoViewIfNeeded();
  await reducedCard.hover();
  await waitForPhase(reducedVisual, 'complete');
  await expect(reducedVisual.locator('[data-agent-prompt] p')).toHaveText(AGENT_PROMPT);
  await expect(reducedVisual.locator('[data-agent-draft]')).toHaveCount(3);
  await expect(
    reducedVisual.locator('span').filter({ hasText: '13 apps' }),
  ).toHaveCSS('transition-delay', '0s');
});

test('completed reduced-motion composition stays inside every responsive regime', async ({ page }) => {
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });

  for (const width of RESPONSIVE_WIDTHS) {
    await page.setViewportSize({ width, height: 1000 });
    const { card, visual } = await openCapabilities(page);
    await page.mouse.move(0, 0);
    await card.hover();
    await waitForPhase(visual, 'complete');

    const prompt = visual.locator('[data-agent-prompt]');
    const task = visual.locator('[data-agent-task="complete"]');
    const teamsWindow = visual.locator('[data-agent-window="teams"]');
    const gmailWindow = visual.locator('[data-agent-window="gmail"]');
    await expectInside(prompt, visual, `${width}px prompt`);
    await expectInside(task, visual, `${width}px task panel`);
    await expectInside(visual.locator('[data-agent-app="teams"]'), visual, `${width}px Teams app`);
    await expectInside(visual.locator('[data-agent-app="gmail"]'), visual, `${width}px Gmail app`);
    await expect(visual.locator('[data-agent-draft]')).toHaveCount(3);
    await expect(visual.locator('g[data-integration]')).toHaveCount(13);

    await expectNoOverflow(prompt, `${width}px prompt`);
    await expectNoOverflow(teamsWindow, `${width}px Teams window`);
    await expectNoOverflow(gmailWindow, `${width}px Gmail window`);

    const cells = visual.locator('g[data-integration]');
    for (let index = 0; index < 13; index += 1) {
      await expectInside(cells.nth(index), visual, `${width}px integration ${index + 1}`);
    }
  }
});
