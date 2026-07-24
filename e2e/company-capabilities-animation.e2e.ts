import { expect, test, type Locator, type Page } from '@playwright/test';

const AGENT_PROMPT =
  'I am running late 1h over my schedule, check my teams meetings and send an email to every person I have a meeting with to rearrange my meetings.';
const RESPONSIVE_WIDTHS = [1121, 1120, 841, 840, 681, 680, 421, 420, 390, 375, 320];
const REVIEW_WIDTHS = [1120, 320];
const runtimeErrorsByPage = new WeakMap<Page, string[]>();

async function waitForPhase(visual: Locator, phase: string, timeout = 12_000) {
  await expect(visual).toHaveAttribute('data-agent-phase', phase, { timeout });
}

async function waitForCustomPhase(visual: Locator, phase: string, timeout = 12_000) {
  await expect(visual).toHaveAttribute('data-custom-phase', phase, { timeout });
}

async function waitForERPPhase(visual: Locator, phase: string, timeout = 12_000) {
  await expect(visual).toHaveAttribute('data-erp-phase', phase, { timeout });
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

async function expectCustomCursorCentered(cursor: Locator, target: Locator, label: string) {
  const [tip, targetBox] = await Promise.all([
    cursor.evaluate((node) => {
      const matrix = (node as SVGGraphicsElement).getScreenCTM();
      if (!matrix) return null;
      const point = new DOMPoint(3, 2.5).matrixTransform(matrix);
      return { x: point.x, y: point.y };
    }),
    target.boundingBox(),
  ]);
  expect(tip, `${label} cursor tip must render`).not.toBeNull();
  expect(targetBox, `${label} file row must render`).not.toBeNull();
  if (!tip || !targetBox) return;
  expect(Math.abs(tip.x - (targetBox.x + targetBox.width / 2)), `${label} cursor x`).toBeLessThanOrEqual(2);
  expect(Math.abs(tip.y - (targetBox.y + targetBox.height / 2)), `${label} cursor y`).toBeLessThanOrEqual(2);
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

async function openCustomCapabilities(page: Page) {
  await page.goto('/');
  const card = page.locator('[data-capability="custom"]');
  await card.scrollIntoViewIfNeeded();
  return {
    card,
    visual: card.locator('[data-custom-phase]'),
  };
}

async function openERPCapabilities(page: Page) {
  await page.goto('/');
  const card = page.locator('[data-capability="erp"]');
  await card.scrollIntoViewIfNeeded();
  return {
    card,
    visual: card.locator('[data-erp-phase]'),
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

test('custom development types two files, verifies checks, restores, and rearms on a new hover edge', async ({ page }) => {
  test.setTimeout(40_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  const { card, visual } = await openCustomCapabilities(page);
  await expect(
    visual.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'),
  ).toHaveCount(0);
  await card.hover();

  await waitForCustomPhase(visual, 'typing-purchase');
  await expect.poll(async () => ((await visual.locator('[data-code-file="purchase_order.py"]').textContent()) ?? '').length).toBeGreaterThan(0);
  await waitForCustomPhase(visual, 'selecting-inventory');
  await expect(visual.locator('[data-cursor-target="inventory"]')).toBeVisible();
  await waitForCustomPhase(visual, 'opening-inventory');
  await expect(visual.locator('[data-file="inventory_sync.py"]')).toHaveAttribute('data-file-active', 'true');
  await expectCustomCursorCentered(
    visual.locator('[data-cursor-target="inventory"]'),
    visual.locator('[data-cursor-target-row]'),
    'automatic story',
  );
  await waitForCustomPhase(visual, 'typing-inventory');
  await expect.poll(async () => ((await visual.locator('[data-code-file="inventory_sync.py"]').textContent()) ?? '').length).toBeGreaterThan(0);
  await waitForCustomPhase(visual, 'verifying');
  await expect(visual.locator('[data-test-result="running"]')).toBeVisible();
  await waitForCustomPhase(visual, 'complete');
  await expect(visual.locator('[data-test-result="passed"]')).toHaveText('8 passed in 0.42s');
  await expect(visual.locator('[data-completion-toast="true"]')).toContainText('Development complete');
  await waitForCustomPhase(visual, 'restoring');
  await expect(visual.locator('[data-test-result="passed"]')).toHaveText('8 passed in 0.42s');
  await expect(visual.locator('[data-completion-toast="true"]')).toContainText('2 files changed · 8 checks passed');
  await waitForCustomPhase(visual, 'restored');
  await expect(card).toHaveAttribute('data-custom-active', 'true');
  await page.waitForTimeout(900);
  await waitForCustomPhase(visual, 'restored');

  await page.locator('#capabilities-title').hover();
  await waitForCustomPhase(visual, 'idle');
  await card.hover();
  await waitForCustomPhase(visual, 'typing-purchase');
});

test('custom development stays touch-safe, supports keyboard and reduced motion, and targets the file exactly', async ({ page }) => {
  test.setTimeout(30_000);
  await page.setViewportSize({ width: 840, height: 1000 });
  let { card, visual } = await openCustomCapabilities(page);
  const customLink = card.locator('a');

  await card.dispatchEvent('pointerdown', { pointerType: 'touch', bubbles: true });
  await customLink.focus();
  await page.waitForTimeout(100);
  await expect(card).toHaveAttribute('data-custom-active', 'false');
  await waitForCustomPhase(visual, 'idle');
  await customLink.dispatchEvent('keydown', { key: 'Tab', bubbles: true });
  await waitForCustomPhase(visual, 'typing-purchase');

  for (const width of [1120, 480, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    ({ card, visual } = await openCustomCapabilities(page));
    const cursor = visual.locator('[data-cursor-target]');
    const target = visual.locator('[data-cursor-target-row]');
    await expect.poll(async () => cursor.evaluate((node) => getComputedStyle(node).getPropertyValue('--cursor-target-x'))).not.toBe('');
    await cursor.evaluate((node) => node.setAttribute('data-cursor-target', 'inventory'));
    await page.waitForTimeout(800);
    await expectCustomCursorCentered(cursor, target, `${width}px`);
    const overflow = await visual.evaluate((node) => ({
      x: node.scrollWidth > node.clientWidth + 1,
      y: node.scrollHeight > node.clientHeight + 1,
    }));
    expect(overflow, `${width}px custom visual overflow`).toEqual({ x: false, y: false });
  }

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.reload({ waitUntil: 'networkidle' });
  card = page.locator('[data-capability="custom"]');
  visual = card.locator('[data-custom-phase]');
  await card.scrollIntoViewIfNeeded();
  await card.hover();
  await waitForCustomPhase(visual, 'complete');
  await expect(visual.locator('[data-test-result="passed"]')).toHaveText('8 passed in 0.42s');
  const completion = visual.locator('[data-completion-toast="true"]');
  await expectInside(completion, visual, '320px reduced-motion completion');
  for (const selector of ['strong', 'span']) {
    const label = completion.locator(selector);
    expect(
      await label.evaluate((node) => node.scrollWidth <= node.clientWidth),
      `320px completion ${selector} must not truncate`,
    ).toBe(true);
  }
});

test('ERP sells one Mug only after its click, loads Payment, and proves the journal entry', async ({ page }) => {
  test.setTimeout(35_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  const { card, visual } = await openERPCapabilities(page);
  await expect(
    visual.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'),
  ).toHaveCount(0);
  await card.hover();

  await waitForERPPhase(visual, 'selecting-pos');
  await waitForERPPhase(visual, 'opening-pos');
  await expect(visual.locator('[data-cart-state="empty"]')).toBeVisible();
  await expect(visual.locator('[data-order-line]')).toHaveCount(0);

  await waitForERPPhase(visual, 'adding-item');
  await page.waitForTimeout(600);
  await expect(visual.locator('[data-cart-state="empty"]')).toBeVisible();
  await expect(visual.locator('[data-order-line]')).toHaveCount(0);
  const mugClickAlignment = await visual.evaluate((node) => {
    const target = node.querySelector('[data-erp-target="product"]')?.getBoundingClientRect();
    const cursor = node.querySelector('[data-erp-cursor="product"]')?.getBoundingClientRect();
    if (!target || !cursor) return Number.POSITIVE_INFINITY;
    return Math.hypot(
      cursor.left - (target.left + target.width / 2),
      cursor.top - (target.top + target.height / 2),
    );
  });
  expect(mugClickAlignment, 'Mug click cursor alignment').toBeLessThanOrEqual(4);
  await waitForERPPhase(visual, 'item-added');
  await expect(visual.locator('[data-order-line]')).toHaveCount(1);
  await expect(visual.locator('[data-order-line]')).toContainText('Mug');
  await expect(visual.locator('[data-cart-thumbnail="mug"]')).toBeVisible();

  await waitForERPPhase(visual, 'selecting-payment');
  await expect(visual.locator('[data-payment-state="ready"]')).toContainText('Payment');
  await expect(visual.locator('[data-payment-spinner]')).toHaveCount(0);
  await waitForERPPhase(visual, 'processing-payment');
  await expect(visual.locator('[data-payment-state="loading"]')).toContainText('Processing payment');
  await expect(visual.locator('[data-payment-spinner]')).toBeVisible();
  await waitForERPPhase(visual, 'payment-success');
  await expect(visual.locator('[data-erp-scene="receipt"]')).toContainText('Payment successful');

  await waitForERPPhase(visual, 'selecting-accounting');
  await expect(visual.locator('[data-erp-target="accounting"]')).toBeVisible();
  await waitForERPPhase(visual, 'opening-accounting');
  await waitForERPPhase(visual, 'journal-items');
  await expect(visual.locator('[data-journal-row]')).toHaveCount(3);
  await waitForERPPhase(visual, 'complete');
  await expect(visual.locator('[data-entry-status="posted"]')).toHaveText('Posted');
  await expect(visual.locator('[data-journal-table] footer')).toContainText('$18.00');
  await expect(visual.locator('[data-completion-toast="true"]')).toContainText('Sale reconciled');

  await page.locator('#capabilities-title').hover();
  await waitForERPPhase(visual, 'idle');
});

test('ERP stays touch-safe and keeps enlarged Accounting proof contained through 320px', async ({ page }) => {
  test.setTimeout(45_000);
  await page.setViewportSize({ width: 840, height: 1000 });
  let { card, visual } = await openERPCapabilities(page);
  const erpLink = card.locator('a');

  await card.dispatchEvent('pointerdown', { pointerType: 'touch', bubbles: true });
  await erpLink.focus();
  await page.waitForTimeout(100);
  await expect(card).toHaveAttribute('data-erp-active', 'false');
  await waitForERPPhase(visual, 'idle');
  await erpLink.dispatchEvent('keydown', { key: 'Tab', bubbles: true });
  await waitForERPPhase(visual, 'selecting-pos');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [1120, 840, 680, 560, 420, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    ({ card, visual } = await openERPCapabilities(page));
    await card.hover();
    await waitForERPPhase(visual, 'complete');
    await page.waitForTimeout(700);

    const rows = visual.locator('[data-journal-row]');
    await expect(rows).toHaveCount(3);
    const proof = await rows.first().evaluate((row) => {
      const reference = row.querySelector('small');
      const visual = row.closest('[data-erp-phase]');
      const table = row.closest('[data-journal-table]');
      const rail = visual?.querySelector('[data-erp-progress]');
      return {
        fontSize: reference ? Number.parseFloat(getComputedStyle(reference).fontSize) : 0,
        gap: table && rail
          ? rail.getBoundingClientRect().top - table.getBoundingClientRect().bottom
          : Number.NEGATIVE_INFINITY,
      };
    });
    expect(proof.fontSize, `${width}px Accounting reference size`).toBeGreaterThanOrEqual(8.75);
    expect(proof.gap, `${width}px Accounting table/progress separation`).toBeGreaterThanOrEqual(3);
    const overflow = await visual.evaluate((node) => ({
      x: node.scrollWidth > node.clientWidth + 1,
      y: node.scrollHeight > node.clientHeight + 1,
    }));
    expect(overflow, `${width}px ERP visual overflow`).toEqual({ x: false, y: false });
  }
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

test('all three capability windows share the first window size on mobile', async ({ page }) => {
  const heights = new Map<number, number>();

  for (const width of [640, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');

    const windows = page.locator('[data-capability] > div:first-child');
    await expect(windows).toHaveCount(3);
    const boxes = await windows.evaluateAll((nodes) =>
      nodes.map((node) => {
        const box = node.getBoundingClientRect();
        return { width: box.width, height: box.height };
      }),
    );

    expect(boxes[1].width, `${width}px ERP window width`).toBeCloseTo(boxes[0].width, 0);
    expect(boxes[1].height, `${width}px ERP window height`).toBeCloseTo(boxes[0].height, 0);
    expect(boxes[2].width, `${width}px custom window width`).toBeCloseTo(boxes[0].width, 0);
    expect(boxes[2].height, `${width}px custom window height`).toBeCloseTo(boxes[0].height, 0);
    heights.set(width, boxes[0].height);
  }

  expect(heights.get(390)!, 'mobile window height must grow with available width').toBeGreaterThan(
    heights.get(320)! + 20,
  );
  expect(heights.get(640)!, 'mobile window height must remain bounded').toBeLessThanOrEqual(320);
});

test('ERP launcher keeps all apps above the progress rail at narrow mobile widths', async ({ page }) => {
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    const { visual } = await openERPCapabilities(page);
    const apps = visual.locator('[class*="odooApp"]');
    const progressRail = visual.locator('[class*="progressRail"]');

    await expect(apps).toHaveCount(14);
    const railBox = await progressRail.boundingBox();
    expect(railBox, `${width}px progress rail must render`).not.toBeNull();
    if (!railBox) continue;

    for (let index = 0; index < 14; index += 1) {
      const appBox = await apps.nth(index).boundingBox();
      expect(appBox, `${width}px ERP app ${index + 1} must render`).not.toBeNull();
      if (!appBox) continue;
      expect(
        appBox.y + appBox.height,
        `${width}px ERP app ${index + 1} must stay above the progress rail`,
      ).toBeLessThanOrEqual(railBox.y - 2);
    }
  }
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
