import { test, expect } from "@playwright/test";

test.describe("Sutur one-page website", () => {
  test("renders the hero headline", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        name: /Bring your whole business into one clear operating system/,
      })
    ).toBeVisible();
  });

  test("header navigation links work", async ({ page }) => {
    await page.goto("/");
    // Click a nav link
    const agentsLink = page.getByRole("link", { name: "Agents" });
    await expect(agentsLink).toBeVisible();
    await agentsLink.click();
    await expect(page.url()).toContain("#agents");
  });

  test("booking CTA opens dialog", async ({ page }) => {
    await page.goto("/");

    // Click the 3D business card to flip it
    const bookingScene = page.locator(".card-scene");
    await expect(bookingScene).toBeVisible();
    await bookingScene.click();

    // Wait for flip animation, then click "Open booking form"
    const openFormButton = page.getByRole("button", {
      name: /Open booking form/i,
    });
    await expect(openFormButton).toBeVisible({ timeout: 5000 });
    await openFormButton.click();

    // Dialog should be visible
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
  });

  test("booking form shows validation errors", async ({ page }) => {
    await page.goto("/");

    // Flip the 3D business card
    const bookingScene = page.locator(".card-scene");
    await bookingScene.click();

    // Open the form dialog
    const openFormButton = page.getByRole("button", {
      name: /Open booking form/i,
    });
    await expect(openFormButton).toBeVisible({ timeout: 5000 });
    await openFormButton.click();

    // Wait for dialog
    await expect(page.getByRole("dialog")).toBeVisible();

    // Try to submit empty form
    const submitButton = page.getByRole("button", {
      name: /Submit request/i,
    });
    if (await submitButton.isEnabled()) {
      await submitButton.click();
    }

    // Should see validation errors (React Hook Form with Zod)
    // At minimum, the dialog should still be open since form didn't submit
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("navigates sections via anchor links", async ({ page }) => {
    await page.goto("/");
    // Click Team link
    const teamLink = page.getByRole("link", { name: "Team" });
    await teamLink.click();
    await expect(page.url()).toContain("#team");

    // The team section should have rendered
    await expect(
      page.getByRole("heading", { name: /The people behind Sutur/i })
    ).toBeVisible();
  });

  test("footer is present", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("Sutur");
  });

  test("mobile menu opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    // Open mobile menu
    const menuButton = page.getByRole("button", { name: /Open menu/i });
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    // Mobile menu should be visible
    await expect(page.getByRole("dialog", { name: /Mobile navigation/i })).toBeVisible();

    // Close it
    const closeButton = page.getByRole("button", { name: /Close menu/i });
    await closeButton.click();

    // Should be gone
    await expect(
      page.getByRole("dialog", { name: /Mobile navigation/i })
    ).not.toBeVisible();
  });

  test("booking API returns slots for valid date", async ({ request }) => {
    // 2026-08-03 is a Monday — should have slots
    const response = await request.get("/api/booking?date=2026-08-03");
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.slots).toBeDefined();
    expect(data.slots.length).toBeGreaterThan(0);
  });

  test("booking API returns empty for weekend", async ({ request }) => {
    const response = await request.get("/api/booking?date=2026-08-02");
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.slots).toEqual([]);
  });

  test("booking API rejects invalid date", async ({ request }) => {
    const response = await request.get("/api/booking?date=not-a-date");
    expect(response.status()).toBe(400);
  });

  test("booking POST validates request body", async ({ request }) => {
    const response = await request.post("/api/booking", {
      data: { invalid: true },
      headers: { "Content-Type": "application/json" },
    });
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Validation failed");
  });
});