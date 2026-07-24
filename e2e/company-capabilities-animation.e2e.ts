import { expect, test, type Locator, type Page } from '@playwright/test';

const AGENT_PROMPT =
  'I am running late 1h over my schedule, check my teams meetings and send an email to every person I have a meeting with to rearrange my meetings.';
const RESPONSIVE_WIDTHS = [1121, 1120, 841, 840, 681, 680, 421, 420, 390, 375, 320];
const REVIEW_WIDTHS = [1120, 320];
const runtimeErrorsByPage = new WeakMap<Page, string[]>();

async function waitForPhase(visual: Locator, phase: string, timeout = 12_000) {
  await expect(visual).toHaveAttribute('data-agent-phase', phase, { timeout });
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

async function expectCursorCentered(cursor: Locator, app: Locator, label: string) {
  await expect
    .poll(async () => {
      const [cursorTip, appBox] = await Promise.all([
        cursor.evaluate((node) => {
          const matrix = (node as SVGGraphicsElement).getScreenCTM();
          if (!matrix) return null;
          const point = new DOMPoint(3, 2.5).matrixTransform(matrix);
          return { x: point.x, y: point.y };
        }),
        app.boundingBox(),
      ]);
      if (!cursorTip || !appBox) return Number.POSITIVE_INFINITY;
      const appCenter = { x: appBox.x + appBox.width / 2, y: appBox.y + appBox.height / 2 };
      return Math.max(
        Math.abs(cursorTip.x - appCenter.x),
        Math.abs(cursorTip.y - appCenter.y),
      ) / appBox.width;
    }, { message: `${label} cursor must settle over the notification`, timeout: 900 })
    .toBeLessThan(0.22);
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

async function observeDirectRestore(visual: Locator) {
  await visual.evaluate((node) => {
    const state = window as typeof window & {
      __agentPhaseHistory?: string[];
      __agentForbiddenTasks?: string[];
    };
    state.__agentPhaseHistory = [node.getAttribute('data-agent-phase') ?? 'missing'];
    state.__agentForbiddenTasks = [];
    const recordForbiddenTask = (element: Element) => {
      const ownTask = element.getAttribute('data-agent-task');
      if (ownTask === 'complete' || ownTask === 'completed') state.__agentForbiddenTasks?.push(ownTask);
      element.querySelectorAll('[data-agent-task="complete"], [data-agent-task="completed"]').forEach((task) => {
        state.__agentForbiddenTasks?.push(task.getAttribute('data-agent-task') ?? 'missing');
      });
    };
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-agent-phase') {
          const nextPhase = node.getAttribute('data-agent-phase') ?? 'missing';
          const history = state.__agentPhaseHistory;
          if (history && history.at(-1) !== nextPhase) history.push(nextPhase);
        }
        mutation.addedNodes.forEach((addedNode) => {
          if (addedNode instanceof Element) recordForbiddenTask(addedNode);
        });
      }
    }).observe(node, {
      attributes: true,
      attributeFilter: ['data-agent-phase'],
      childList: true,
      subtree: true,
    });
  });
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

test('runs the accepted workflow, restores over open apps, and rearms only after pointer leave', async ({ page }) => {
  test.setTimeout(50_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  const { card, visual, prompt } = await openCapabilities(page);
  const cells = visual.locator('g[data-integration]');
  await expect(
    visual.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'),
  ).toHaveCount(0);
  await observeDirectRestore(visual);
  await card.hover();

  await waitForPhase(visual, 'typing');
  await expect(visual.locator('[data-agent-task="understanding"]')).toHaveCount(0);
  await expect.poll(async () => ((await prompt.textContent()) ?? '').length).toBeGreaterThan(0);
  await waitForPhase(visual, 'understanding');
  await expect(prompt).toHaveText(AGENT_PROMPT);
  await expect(visual.locator('[data-agent-user-avatar]')).toBeVisible();
  await expect(visual.locator('[data-agent-task="understanding"]')).toBeVisible();

  await waitForPhase(visual, 'checking');
  await expect(visual.locator('[data-agent-persistent-apps] [data-agent-window]')).toHaveCount(2);
  await expect(visual.locator('[data-agent-window="teams"] [data-agent-window-row]')).toHaveCount(3);
  await waitForPhase(visual, 'drafting');
  await expect(visual.locator('[data-agent-window="gmail"] [data-agent-window-row]')).toHaveCount(3);
  await waitForPhase(visual, 'validated');
  await expect(visual.locator('[data-agent-app-badge]')).toHaveText(['1', '1']);

  await waitForPhase(visual, 'selecting-teams');
  await expect(visual.locator('[data-agent-review-workspace]')).toHaveCount(0);
  await expectCursorCentered(
    visual.locator('[data-agent-cursor]'),
    visual.locator('[data-agent-app="teams"]'),
    'Teams',
  );
  await waitForPhase(visual, 'opening-teams');
  await expect(visual.locator('[data-agent-review-window="teams"]')).toBeVisible();

  await waitForPhase(visual, 'selecting-gmail');
  await expect(visual.locator('[data-agent-review-window="teams"]')).toBeVisible();
  await expectCursorCentered(
    visual.locator('[data-agent-cursor]'),
    visual.locator('[data-agent-app="gmail"]'),
    'Gmail',
  );
  await waitForPhase(visual, 'opening-gmail');
  await expect(visual.locator('[data-agent-review-window]')).toHaveCount(2);

  await waitForPhase(visual, 'restoring');
  await expect(visual.locator('[data-agent-review-window]')).toHaveCount(2);
  await expect(visual.locator('[data-agent-restore-backdrop]')).toHaveCount(1);
  const layerOrder = await visual.evaluate((node) => {
    const readZ = (selector: string) => Number.parseInt(getComputedStyle(node.querySelector(selector)!).zIndex, 10);
    return {
      windows: readZ('[data-agent-review-workspace]'),
      backdrop: readZ('[data-agent-restore-backdrop]'),
      honeycomb: readZ('[data-agent-stack-layer]'),
    };
  });
  expect(layerOrder.windows).toBeLessThan(layerOrder.backdrop);
  expect(layerOrder.backdrop).toBeLessThan(layerOrder.honeycomb);

  await waitForPhase(visual, 'restored');
  await expect(card).toHaveAttribute('data-agent-active', 'true');
  await expect(visual.locator('[data-agent-review-workspace]')).toHaveCount(0);
  await expect(visual.locator('[data-agent-restore-backdrop]')).toHaveCount(0);
  await expect(visual.locator('[data-agent-validated-apps]')).toHaveCount(0);
  expect(new Set(await cells.evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).transform)))).toEqual(
    new Set(['none']),
  );

  const observed = await page.evaluate(() => {
    const state = window as typeof window & {
      __agentPhaseHistory?: string[];
      __agentForbiddenTasks?: string[];
    };
    return { phases: state.__agentPhaseHistory ?? [], forbiddenTasks: state.__agentForbiddenTasks ?? [] };
  });
  const gmailOpeningIndex = observed.phases.indexOf('opening-gmail');
  expect(gmailOpeningIndex).toBeGreaterThanOrEqual(0);
  expect(observed.phases.slice(gmailOpeningIndex)).toEqual(['opening-gmail', 'restoring', 'restored']);
  expect(observed.forbiddenTasks).toEqual([]);

  await page.waitForTimeout(900);
  await waitForPhase(visual, 'restored');
  await page.locator('#capabilities-title').hover();
  await waitForPhase(visual, 'idle');
  await card.hover();
  await waitForPhase(visual, 'collapsing');
});

test('stack enters bottom-right-first, exits top-left-first, and stale timers stay cancelled', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const { card, visual, prompt } = await openCapabilities(page);
  const cells = visual.locator('g[data-integration]');

  await card.hover();
  await waitForPhase(visual, 'collapsing');
  const enterFirst = transitionDelayMs(await cells.first().evaluate((node) => getComputedStyle(node).transitionDelay));
  const enterLast = transitionDelayMs(await cells.last().evaluate((node) => getComputedStyle(node).transitionDelay));
  expect(enterFirst).toBeGreaterThan(enterLast);
  await expect.poll(async () => (await transformScale(cells.first())) > (await transformScale(cells.last()))).toBe(true);

  await page.locator('#capabilities-title').hover();
  await waitForPhase(visual, 'idle');
  const exitFirst = transitionDelayMs(await cells.first().evaluate((node) => getComputedStyle(node).transitionDelay));
  const exitLast = transitionDelayMs(await cells.last().evaluate((node) => getComputedStyle(node).transitionDelay));
  expect(exitFirst).toBeLessThan(exitLast);
  await expect.poll(async () => (await transformScale(cells.first())) > (await transformScale(cells.last()))).toBe(true);
  await page.waitForTimeout(900);
  await expect(prompt).toHaveText('');
  await waitForPhase(visual, 'idle');
});

test('touch stays idle, keyboard focus activates, and reduced motion resolves to restored', async ({ page }) => {
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
  await waitForPhase(reducedVisual, 'restored');
  await expect(reducedVisual.locator('[data-agent-review-workspace]')).toHaveCount(0);
  await expect(reducedVisual.locator('g[data-integration]')).toHaveCount(13);
});

test('restored honeycomb stays contained through every responsive regime', async ({ page }) => {
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });

  for (const width of RESPONSIVE_WIDTHS) {
    await page.setViewportSize({ width, height: 1000 });
    const { card, visual } = await openCapabilities(page);
    await page.mouse.move(0, 0);
    await card.hover();
    await waitForPhase(visual, 'restored');
    const cells = visual.locator('g[data-integration]');
    await expect(cells).toHaveCount(13);
    for (let index = 0; index < 13; index += 1) {
      await expectInside(cells.nth(index), visual, `${width}px integration ${index + 1}`);
    }
    const overflow = await visual.evaluate((node) => ({
      x: node.scrollWidth > node.clientWidth + 1,
      y: node.scrollHeight > node.clientHeight + 1,
    }));
    expect(overflow, `${width}px visual overflow`).toEqual({ x: false, y: false });
  }
});

test('split Teams and Gmail review remains equal and contained at production extremes', async ({ page }) => {
  test.setTimeout(55_000);
  for (const width of REVIEW_WIDTHS) {
    await page.setViewportSize({ width, height: 1000 });
    const { card, visual } = await openCapabilities(page);
    await page.mouse.move(0, 0);
    await card.hover();
    await waitForPhase(visual, 'opening-gmail', 22_000);
    await page.waitForTimeout(900);
    const teams = visual.locator('[data-agent-review-window="teams"]');
    const gmail = visual.locator('[data-agent-review-window="gmail"]');
    await expectInside(teams, visual, `${width}px Teams review`);
    await expectInside(gmail, visual, `${width}px Gmail review`);
    const [teamsBox, gmailBox, visualBox] = await Promise.all([
      teams.boundingBox(),
      gmail.boundingBox(),
      visual.boundingBox(),
    ]);
    expect(teamsBox).not.toBeNull();
    expect(gmailBox).not.toBeNull();
    expect(visualBox).not.toBeNull();
    if (teamsBox && gmailBox && visualBox) {
      expect(Math.abs(teamsBox.width - gmailBox.width)).toBeLessThanOrEqual(0.25);
      expect(Math.abs(teamsBox.width + gmailBox.width - (visualBox.width - 2))).toBeLessThanOrEqual(0.25);
      expect(Math.abs(teamsBox.x + teamsBox.width - gmailBox.x)).toBeLessThanOrEqual(0.25);
    }
    await page.locator('#capabilities-title').hover();
    await waitForPhase(visual, 'idle');
  }
});
