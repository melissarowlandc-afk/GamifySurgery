import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

async function startClinic(page: Page): Promise<void> {
  await page.goto("/");
  await page.getByLabel("Founder name").fill("Visual Test Founder");
  await page.getByRole("button", { name: "Continue" }).click();
  await page
    .getByRole("button", { name: "Build a Surgery Clinic" })
    .click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();

  const tutorialToggle = page.getByRole("checkbox", {
    name: /Tutorial guidance/,
  });
  if (await tutorialToggle.isChecked()) {
    await tutorialToggle.uncheck();
  }
}

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true });
});

test("the facility stays fixed above the clinical desk", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The stable desktop composition only needs one viewport check.",
  );

  await startClinic(page);
  const facility = page.locator(".facility-frame");
  const before = await facility.boundingBox();
  expect(before).not.toBeNull();

  await page.locator(".patient-folder.is-waiting .patient-tab").first().click();
  const chart = page.locator(".paper-chart");
  await expect(chart).toBeVisible();

  const [after, chartBox] = await Promise.all([
    facility.boundingBox(),
    chart.boundingBox(),
  ]);
  expect(after).not.toBeNull();
  expect(chartBox).not.toBeNull();
  expect(Math.abs(after!.height - before!.height)).toBeLessThanOrEqual(1);
  expect(chartBox!.y).toBeGreaterThanOrEqual(after!.y + after!.height - 1);

  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/visual-stable-desk-desktop.png`,
    fullPage: false,
    animations: "disabled",
  });
});

test("Build Mode replaces the desk while keeping clinic and staff visible", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The construction composition only needs one desktop check.",
  );

  await startClinic(page);
  const facility = page.locator(".facility-frame");
  const before = await facility.boundingBox();
  expect(before).not.toBeNull();

  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  const constructionDesk = page.getByRole("region", {
    name: "Construction desk",
  });
  await expect(constructionDesk.locator(".build-mode-panel")).toBeVisible();
  await expect(page.locator(".operations-column .staff-panel")).toBeVisible();
  await expect(page.locator(".operations-column .build-mode-panel")).toHaveCount(
    0,
  );

  await page.getByRole("button", { name: "Zoom facility out" }).click();
  await page.getByRole("button", { name: "Zoom facility out" }).click();
  await expect(page.locator(".facility-heading-actions")).toContainText("60%");
  const after = await facility.boundingBox();
  expect(after).not.toBeNull();
  expect(Math.abs(after!.height - before!.height)).toBeLessThanOrEqual(1);

  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/visual-build-mode-desktop.png`,
    fullPage: false,
    animations: "disabled",
  });
});

test("the paper chart becomes a readable phone-width sheet", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The phone sheet is tested once with an explicit phone viewport.",
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await startClinic(page);
  await page.locator(".patient-folder.is-waiting .patient-tab").first().click();

  const chart = page.locator(".paper-chart");
  await expect(chart).toBeVisible();
  const box = await chart.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.width).toBeLessThanOrEqual(390);
  expect(box!.height).toBeLessThanOrEqual(844);
  await expect(page.getByRole("button", { name: /SIGNAL ALPHA/ })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close patient chart" }),
  ).toBeVisible();

  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/visual-chart-phone.png`,
    fullPage: false,
    animations: "disabled",
  });
});
