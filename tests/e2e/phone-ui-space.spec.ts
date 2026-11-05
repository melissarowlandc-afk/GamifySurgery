import { expect, test, type Page } from "@playwright/test";
import { startClinic } from "./helpers";

// Native phone selectors deliberately avoid the desktop chart/build adapters.
// Run locally with --project=phone-chrome. No hosted account or real reports.
async function startPhone(page: Page) {
  await page.addInitScript(() => localStorage.setItem("gamify-surgery.presentation-layout.v1", "phone"));
  await startClinic(page, "Phone UI Fixture", "Phone UI Clinic", false);
  await expect(page.locator(".mobile-shell")).toBeVisible();
}

async function visibleItems(page: Page, container: string, items: string) {
  return page.locator(container).evaluate((root, selector) => {
    const clip = root.getBoundingClientRect();
    return [...root.querySelectorAll<HTMLElement>(selector)].filter(item => {
      const box = item.getBoundingClientRect();
      return box.width > 0 && box.height > 0 && box.top >= clip.top && box.bottom <= clip.bottom + 1;
    }).length;
  }, items);
}

for (const viewport of [{ width: 390, height: 844 }, { width: 375, height: 667 }]) {
  test(`phone menus use compact rows and single-tap Close at ${viewport.width}x${viewport.height}`, async ({ page }, info) => {
    test.skip(info.project.name !== "phone-chrome", "Native phone UI; desktop is unchanged.");
    await page.setViewportSize(viewport); await startPhone(page);
    await page.getByRole("button", { name: "Pause facility time", exact: true }).click();
    await page.getByRole("button", { name: "Build", exact: true }).click();
    const catalog = page.locator(".mobile-build-catalog"); await expect(catalog).toBeVisible();
    const choices = catalog.locator("[data-build-room-option]");
    const first = await choices.nth(0).boundingBox(), second = await choices.nth(1).boundingBox();
    expect(first).not.toBeNull(); expect(second).not.toBeNull();
    expect(Math.abs(first!.y - second!.y)).toBeLessThanOrEqual(1);
    expect(second!.x).toBeGreaterThan(first!.x + first!.width);
    const capacity = await visibleItems(page, ".mobile-sheet-body", "[data-build-room-option]");
    expect(capacity).toBeGreaterThanOrEqual(viewport.height === 844 ? 4 : 2);
    await info.attach("phone-visible-build-choices", { body: JSON.stringify({ viewport, visibleChoices: capacity }), contentType: "application/json" });
    await page.screenshot({ path: info.outputPath("build-compact.png"), animations: "disabled" });
    const about = catalog.getByText("Details", { exact: true }).first();
    await about.click(); await expect(about.locator("..")).toHaveAttribute("open", "");
    await about.click(); await page.getByRole("tab", { name: "My Rooms", exact: true }).click();
    await catalog.getByRole("button", { name: "Open Front Desk", exact: true }).click();
    await expect(page.locator(".mobile-build-room")).toBeVisible();
    await page.getByRole("button", { name: "Close Front Desk", exact: true }).click();
    await expect(catalog).toHaveCount(0); await expect(page.locator(".mobile-build-room")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Done", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Done", exact: true }).click();
    await expect(page.locator(".mobile-build-controls")).toHaveCount(0);

    for (const name of ["Patients", "Alerts"] as const) {
      await page.locator(".mobile-tab-bar").getByRole("button", { name: new RegExp(`^${name}(,|$)`) }).click();
      await expect(page.getByRole("dialog", { name, exact: true })).toBeVisible();
      await page.getByRole("button", { name: `Close ${name}`, exact: true }).click();
      await expect(page.getByRole("dialog", { name, exact: true })).toHaveCount(0);
    }
    await page.getByRole("button", { name: "Manage", exact: true }).click();
    await page.getByRole("button", { name: "Close Manage", exact: true }).click();
    await expect(page.locator(".mobile-manage")).toHaveCount(0);
    await page.getByRole("button", { name: "More clinic options", exact: true }).click();
    await expect(page.getByRole("button", { name: "Help", exact: true })).toBeVisible();
    await page.screenshot({ path: info.outputPath("more-compact.png"), animations: "disabled" });
    await page.getByRole("button", { name: "Close More", exact: true }).click();
    await page.getByRole("button", { name: /^Cash .*Show income and costs/ }).click();
    await expect(page.getByRole("dialog", { name: "Money", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Close Money", exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator(".mobile-tab-bar button").evaluateAll(buttons => buttons.every(button => button.getBoundingClientRect().height >= 44))).toBe(true);
  });
}

test("phone chart flags sit beside Close and remain nonmodal", async ({ page }, info) => {
  test.skip(info.project.name !== "phone-chrome", "Native phone chart.");
  await page.setViewportSize({ width: 390, height: 844 }); await startPhone(page);
  await page.getByRole("button", { name: "Facility speed 1x. Cycle speed", exact: true }).click();
  await page.getByRole("button", { name: "Facility speed 2x. Cycle speed", exact: true }).click();
  await page.locator(".mobile-tab-bar").getByRole("button", { name: /^Patients(,|$)/ }).click();
  const patient = page.locator(".mobile-patient-card[data-patient-id]").first();
  await expect(patient).toBeVisible({ timeout: 30_000 }); await patient.click();
  const chart = page.getByRole("dialog", { name: "Patient chart", exact: true }); await expect(chart).toBeVisible();
  const flag = chart.getByRole("button", { name: "Flag this question for developer review", exact: true });
  const close = chart.getByRole("button", { name: "Close Patient chart", exact: true });
  const flagBox = await flag.boundingBox(), closeBox = await close.boundingBox();
  expect(flagBox).not.toBeNull(); expect(closeBox).not.toBeNull();
  expect(Math.abs(flagBox!.y - closeBox!.y)).toBeLessThanOrEqual(1);
  expect(flagBox!.width).toBeGreaterThanOrEqual(44); expect(flagBox!.height).toBeGreaterThanOrEqual(44);
  await expect(chart.locator(".mobile-decision .question-flag-control")).toHaveCount(0);
  await expect(chart.getByRole("button", { name: "Close chart", exact: true })).toHaveCount(0);
  await flag.click(); await expect(chart.getByRole("textbox")).toBeVisible();
  await expect(close).toBeEnabled(); await expect(page.getByRole("button", { name: "Pause facility time", exact: true })).toBeEnabled();
  await chart.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(chart.getByRole("textbox")).toHaveCount(0);
  await page.screenshot({ path: info.outputPath("chart-header-compact.png"), animations: "disabled" });
  await close.click(); await expect(chart).toHaveCount(0);
});
