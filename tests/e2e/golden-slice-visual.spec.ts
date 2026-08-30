import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import {
  installLevelOneVisualState,
  startClinic,
} from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

async function openGoldenSlice(page: Page): Promise<void> {
  await startClinic(
    page,
    "Dr. Rowan Vale",
    "Vale Surgical Clinic",
  );
  await installLevelOneVisualState(page);
  await expect(page.getByText("Level 1", { exact: true }).first()).toBeVisible();
  const resumeButton = page.getByRole("button", {
    name: "Resume facility time",
  });
  if (await resumeButton.isVisible()) {
    await resumeButton.click();
  }
}

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true });
});

test("renders the actual Level 1 golden slice on desktop", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "Golden-slice captures use one controlled desktop viewport.",
  );
  await page.setViewportSize({ width: 1374, height: 1273 });
  await openGoldenSlice(page);
  const facilityFill = await page.evaluate(() => {
    const frame = document.querySelector<HTMLElement>(".facility-frame");
    const heading = document.querySelector<HTMLElement>(".facility-heading");
    const host = document.querySelector<HTMLElement>(".facility-host");
    if (!frame || !heading || !host) {
      return null;
    }
    return {
      unusedHeight:
        frame.clientHeight - heading.offsetHeight - host.offsetHeight,
    };
  });
  expect(facilityFill?.unusedHeight).toBeLessThanOrEqual(8);
  await page
    .getByRole("button", { name: /Quinn Hart portrait/ })
    .click();
  await expect(page.locator(".paper-chart")).toBeVisible();
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/level-1-golden-slice-desktop.png`,
    fullPage: false,
    animations: "disabled",
  });
});

test("renders the actual Level 1 golden slice at phone width", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "Phone capture uses an explicit viewport in one browser project.",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await openGoldenSlice(page);
  const phoneCanvasMetrics = await page.evaluate(() => {
    const host = document.querySelector<HTMLElement>(
      '[data-testid="facility-canvas"]',
    );
    const canvas = host?.querySelector("canvas");
    const hostRect = host?.getBoundingClientRect();
    const canvasRect = canvas?.getBoundingClientRect();
    return {
      host: hostRect
        ? { width: hostRect.width, height: hostRect.height }
        : null,
      canvas: canvasRect
        ? {
            cssWidth: canvasRect.width,
            cssHeight: canvasRect.height,
            width: canvas?.width,
            height: canvas?.height,
          }
        : null,
    };
  });
  expect(phoneCanvasMetrics.host?.height).toBeGreaterThan(150);
  expect(phoneCanvasMetrics.canvas?.height).toBeGreaterThan(150);
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/level-1-golden-slice-phone.png`,
    fullPage: false,
    animations: "disabled",
  });
});

test("shows matching representations in the developer visual QA gallery", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The gallery is captured once at desktop width.",
  );
  await openGoldenSlice(page);
  await page.goto("/?prototype-tools=0&visual-qa=characters");
  await page
    .getByRole("button", { name: "Resume Vale Surgical Clinic" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Character Visual QA" }),
  ).toBeVisible();
  expect(await page.locator(".character-qa-card").count()).toBeGreaterThanOrEqual(50);
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/character-qa-gallery.png`,
    fullPage: false,
    animations: "disabled",
  });
});

test("captures the same clinic in normal and Build Mode", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The mode comparison is captured once at the controlled desktop viewport.",
  );
  await page.setViewportSize({ width: 1374, height: 900 });
  await openGoldenSlice(page);
  const facility = page.locator(".facility-frame");
  await expect(facility).toBeVisible();
  const normal = await facility.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/level-1-mode-normal.png`,
    animations: "disabled",
  });

  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  await expect(
    page.getByRole("button", { name: "Done / Save" }),
  ).toBeVisible();
  const build = await facility.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/level-1-mode-build.png`,
    animations: "disabled",
  });

  const normalData = normal.toString("base64");
  const buildData = build.toString("base64");
  await page.setViewportSize({ width: 1800, height: 760 });
  await page.setContent(`
    <style>
      * { box-sizing: border-box; }
      html, body { margin: 0; background: #CAC8BB; color: #232720; }
      body { padding: 16px; font-family: "Courier New", monospace; }
      .pair { display: inline-grid; grid-template-columns: auto auto; gap: 16px; }
      figure { margin: 0; padding: 8px; border: 3px solid #232720; background: #F0EDDD; }
      figcaption { margin-bottom: 7px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
      img { display: block; max-width: 850px; image-rendering: pixelated; }
    </style>
    <main class="pair" aria-label="Normal and Build Mode comparison">
      <figure>
        <figcaption>Normal mode — material floors, no construction grid</figcaption>
        <img alt="Level 1 clinic in normal mode" src="data:image/png;base64,${normalData}">
      </figure>
      <figure>
        <figcaption>Build Mode — translucent placement grid</figcaption>
        <img alt="Same Level 1 clinic in Build Mode" src="data:image/png;base64,${buildData}">
      </figure>
    </main>
  `);
  await page.locator(".pair").screenshot({
    path: `${SCREENSHOT_DIRECTORY}/level-1-normal-build-pair.png`,
    animations: "disabled",
  });
});
