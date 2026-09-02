import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import {
  setFastFacilitySpeed,
  startClinic,
  waitForDecisionChoices,
  waitForFirstPatientReady,
} from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

async function startVisualClinic(page: Page): Promise<void> {
  await startClinic(
    page,
    "Visual Test Founder",
    "Visual Test Surgical Clinic",
  );
  const turnOffTutorials = page.getByRole("button", {
    name: "Turn off tutorials",
  });
  if (await turnOffTutorials.isVisible({ timeout: 2_000 })) {
    await turnOffTutorials.click();
  }
  await setFastFacilitySpeed(page);
  await waitForFirstPatientReady(page);
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

  await startVisualClinic(page);
  const facility = page.locator(".facility-frame");
  const before = await facility.boundingBox();
  expect(before).not.toBeNull();

  await page
    .locator(".patient-folder.is-waiting .patient-tab")
    .first()
    .click();
  await waitForDecisionChoices(page);
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

test("Build Mode replaces the desk while keeping clinic and operations visible", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The construction composition only needs one desktop check.",
  );

  await startVisualClinic(page);
  const facility = page.locator(".facility-frame");
  const before = await facility.boundingBox();
  expect(before).not.toBeNull();

  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  const constructionDesk = page.getByRole("region", {
    name: "Construction desk",
  });
  await expect(constructionDesk.locator(".build-mode-panel")).toBeVisible();
  await expect(page.locator(".operations-column .staff-panel")).toHaveCount(0);
  await expect(page.locator(".operations-column .goals-panel")).toBeVisible();
  await expect(page.locator(".operations-column .event-message-board")).toHaveCount(0);
  await expect(page.locator(".operations-column .build-mode-panel")).toHaveCount(
    0,
  );

  for (let step = 0; step < 10; step += 1) {
    await page.getByRole("button", { name: "Zoom facility out" }).click();
  }
  await expect(page.locator(".facility-zoom-overlay")).toContainText("10%");
  await expect(
    page.getByRole("button", { name: "Zoom facility out" }),
  ).toBeDisabled();
  const after = await facility.boundingBox();
  expect(after).not.toBeNull();
  expect(Math.abs(after!.height - before!.height)).toBeLessThanOrEqual(1);

  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/visual-build-mode-desktop.png`,
    fullPage: false,
    animations: "disabled",
  });
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/july28-build-mode-desktop.png`,
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
  await startVisualClinic(page);
  await page
    .locator(".patient-folder.is-waiting .patient-tab")
    .first()
    .click();
  await waitForDecisionChoices(page);

  const chart = page.locator(".paper-chart");
  await expect(chart).toBeVisible();
  const box = await chart.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.width).toBeLessThanOrEqual(390);
  expect(box!.height).toBeLessThanOrEqual(844);
  await expect(
    page.locator(".chart-step-column.is-current .answer-choice").first(),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close patient chart" }),
  ).toBeVisible();

  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/visual-chart-phone.png`,
    fullPage: false,
    animations: "disabled",
  });
});

test("captures phone-width tutorial and Build Mode usability", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "Phone handoff captures use one explicit viewport.",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await startClinic(
    page,
    "Phone Tutorial Founder",
    "Phone Tutorial Surgical Clinic",
  );
  await setFastFacilitySpeed(page);
  const firstPatient = await waitForFirstPatientReady(page);
  await page.getByRole("button", { name: "Got It" }).click();
  await firstPatient.click();
  await waitForDecisionChoices(page);
  await expect(
    page.getByRole("heading", {
      name: "Read across the chart, then choose",
    }),
  ).toBeVisible();
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/july28-tutorial-phone.png`,
    fullPage: false,
    animations: "disabled",
  });

  await page.getByRole("button", { name: "Turn off tutorials" }).click();
  await page.getByRole("button", { name: "Close patient chart" }).click();
  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  await expect(
    page.getByRole("button", { name: "Done / Save" }),
  ).toBeVisible();
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/july28-build-mode-phone.png`,
    fullPage: false,
    animations: "disabled",
  });
});
