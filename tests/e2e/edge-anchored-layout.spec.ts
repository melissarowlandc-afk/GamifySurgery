import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import { startClinic } from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

interface LayoutMetrics {
  grid: { left: number; right: number; width: number };
  leftRail: { left: number; right: number; width: number };
  center: { left: number; right: number; width: number };
  rightRail: { left: number; right: number; width: number };
  frame: { left: number; top: number; right: number; bottom: number; width: number; height: number };
  host: { left: number; top: number; right: number; bottom: number; width: number; height: number };
  overlay: { left: number; top: number; right: number; bottom: number; width: number; height: number };
  canvasHost: { width: number; height: number; clientWidth: number; clientHeight: number };
  bitmap: { width: number; height: number };
  overlayBackground: string;
  scrollWidth: number;
  viewportWidth: number;
}

const desktopViewports = [
  { width: 1920, height: 1080, screenshot: "ultrawide" },
  { width: 1440, height: 1000, screenshot: "desktop" },
  { width: 1280, height: 720, screenshot: "laptop" },
  { width: 1024, height: 768, screenshot: "compact" },
] as const;

function assertApproximately(actual: number, expected: number, tolerance = 1): void {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
}

async function readMetrics(page: Page): Promise<LayoutMetrics> {
  await expect.poll(async () => page.evaluate(() => {
    const host = document.querySelector<HTMLElement>("[data-testid='facility-canvas']");
    const canvas = host?.querySelector("canvas");
    return Boolean(host && canvas && canvas.width > 1 && canvas.height > 1);
  })).toBe(true);

  return page.evaluate(() => {
    const readRect = (selector: string) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) throw new Error(`Missing ${selector}.`);
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      };
    };
    const canvasHost = document.querySelector<HTMLElement>(
      "[data-testid='facility-canvas']",
    );
    const bitmap = canvasHost?.querySelector("canvas");
    if (!canvasHost || !bitmap) throw new Error("Facility canvas is missing.");
    const canvasRect = canvasHost.getBoundingClientRect();
    return {
      grid: readRect(".game-grid-workspaces"),
      leftRail: readRect(".patient-rail-column"),
      center: readRect(".clinic-workspace"),
      rightRail: readRect(".operations-column"),
      frame: readRect(".facility-frame"),
      host: readRect(".facility-host"),
      overlay: readRect(".facility-zoom-overlay"),
      canvasHost: {
        width: canvasRect.width,
        height: canvasRect.height,
        clientWidth: canvasHost.clientWidth,
        clientHeight: canvasHost.clientHeight,
      },
      bitmap: { width: bitmap.width, height: bitmap.height },
      overlayBackground: getComputedStyle(
        document.querySelector<HTMLElement>(".facility-zoom-overlay")!,
      ).backgroundColor,
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    };
  });
}

async function dismissTutorialIfVisible(page: Page): Promise<void> {
  const dismiss = page.getByRole("button", { name: "Got It" });
  if (await dismiss.isVisible()) {
    await dismiss.click();
  }
}

function assertDesktopLayout(metrics: LayoutMetrics): void {
  assertApproximately(metrics.grid.left, 0);
  assertApproximately(metrics.grid.right, metrics.viewportWidth);
  assertApproximately(metrics.leftRail.left, 0);
  assertApproximately(metrics.rightRail.right, metrics.viewportWidth);
  const leftGap = metrics.center.left - metrics.leftRail.right;
  const rightGap = metrics.rightRail.left - metrics.center.right;
  expect(leftGap).toBeGreaterThan(0);
  expect(rightGap).toBeGreaterThan(0);
  assertApproximately(leftGap, rightGap);
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewportWidth);
  assertApproximately(metrics.host.left, metrics.frame.left + 3, 1);
  assertApproximately(metrics.host.right, metrics.frame.right - 3, 1);
  assertApproximately(metrics.host.top, metrics.frame.top + 3, 1);
  assertApproximately(metrics.host.bottom, metrics.frame.bottom - 3, 1);
  expect(metrics.overlay.left).toBeGreaterThanOrEqual(metrics.host.left);
  expect(metrics.overlay.right).toBeLessThanOrEqual(metrics.host.right);
  expect(metrics.overlay.top).toBeGreaterThanOrEqual(metrics.host.top);
  expect(metrics.overlay.bottom).toBeLessThanOrEqual(metrics.host.bottom);
  expect(metrics.host.right - metrics.overlay.right).toBeLessThanOrEqual(12);
  expect(metrics.overlay.top - metrics.host.top).toBeLessThanOrEqual(12);
  expect(metrics.overlay.width).toBeLessThan(180);
  expect(metrics.overlay.height).toBeLessThan(48);
  expect(metrics.overlayBackground).toMatch(/^rgb\((?:[0-4]?\d), (?:[0-4]?\d), (?:[0-4]?\d)\)$/);
  assertApproximately(metrics.canvasHost.width, metrics.host.width);
  assertApproximately(metrics.canvasHost.height, metrics.host.height);
  assertApproximately(metrics.bitmap.width, metrics.canvasHost.clientWidth);
  assertApproximately(metrics.bitmap.height, metrics.canvasHost.clientHeight);
}

test.beforeAll(() => mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true }));

test("anchors desktop rails to viewport edges and gives all extra width to the center", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "One controlled desktop browser checks every desktop viewport.");
  await startClinic(page, "Edge Layout Reviewer", "Edge Layout Clinic");
  await dismissTutorialIfVisible(page);
  await expect(page.locator(".facility-heading")).toHaveCount(0);
  await expect(page.getByRole("group", { name: "Facility map zoom" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Zoom facility out" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Zoom facility in" })).toBeVisible();
  const zoomHitTarget = await page.getByRole("button", { name: "Zoom facility out" }).evaluate((button) => {
    const bounds = button.getBoundingClientRect();
    return document.elementFromPoint(
      bounds.left + bounds.width / 2,
      bounds.top + bounds.height / 2,
    ) === button;
  });
  expect(zoomHitTarget).toBe(true);

  const metricsByViewport: LayoutMetrics[] = [];
  for (const viewport of desktopViewports) {
    await page.setViewportSize(viewport);
    const metrics = await readMetrics(page);
    assertDesktopLayout(metrics);
    metricsByViewport.push(metrics);
    await page.screenshot({
      path: `${SCREENSHOT_DIRECTORY}/edge-anchored-layout-${viewport.screenshot}.png`,
      animations: "disabled",
    });
  }
  for (let index = 0; index < metricsByViewport.length - 1; index += 1) {
    expect(metricsByViewport[index]!.center.width).toBeGreaterThan(
      metricsByViewport[index + 1]!.center.width,
    );
  }

  const initialPercentage = page.locator(".facility-zoom-overlay output");
  const initialZoom = Number.parseInt(await initialPercentage.innerText(), 10);
  expect(initialZoom).toBeGreaterThanOrEqual(10);
  await page.evaluate(() => {
    const proofWindow = window as Window & { __edgeMapTargetCount?: number };
    proofWindow.__edgeMapTargetCount = 0;
    window.addEventListener("pointerdown", (event) => {
      if ((event.target as Element | null)?.closest("[data-testid='facility-canvas']")) {
        proofWindow.__edgeMapTargetCount = (proofWindow.__edgeMapTargetCount ?? 0) + 1;
      }
    }, { capture: true });
  });
  await page.getByRole("button", { name: "Zoom facility out" }).click();
  await expect(initialPercentage).toHaveText(`${initialZoom - 10}%`);
  await page.getByRole("button", { name: "Zoom facility in" }).click();
  await expect(initialPercentage).toHaveText(`${initialZoom}%`);
  expect(await page.evaluate(() => {
    const records = (window as Window & { __edgeMapTargetCount?: number });
    return records.__edgeMapTargetCount ?? 0;
  })).toBe(0);

  const splitter = page.getByRole("separator", {
    name: "Resize facility map and clinical desk",
  });
  const before = await page.locator(".facility-frame").boundingBox();
  const splitterBox = await splitter.boundingBox();
  expect(before).not.toBeNull();
  expect(splitterBox).not.toBeNull();
  await page.mouse.move(splitterBox!.x + splitterBox!.width / 2, splitterBox!.y + splitterBox!.height / 2);
  await page.mouse.down();
  await page.mouse.move(splitterBox!.x + splitterBox!.width / 2, splitterBox!.y - 60, { steps: 5 });
  await page.mouse.up();
  const after = await page.locator(".facility-frame").boundingBox();
  expect(after).not.toBeNull();
  expect(after!.height).toBeLessThan(before!.height - 40);
  assertDesktopLayout(await readMetrics(page));
});

test("keeps the titleless zoom overlay usable and contained on Pixel 7", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "phone-chrome", "Phone behavior is checked with the Pixel 7 project.");
  await startClinic(page, "Edge Phone Reviewer", "Edge Phone Clinic");
  await dismissTutorialIfVisible(page);
  await expect(page.locator(".facility-heading")).toHaveCount(0);
  const overlay = page.getByRole("group", { name: "Facility map zoom" });
  await expect(overlay).toBeVisible();
  await expect(page.getByRole("button", { name: "Zoom facility out" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Zoom facility in" })).toBeVisible();
  const initialZoom = Number.parseInt(
    await page.locator(".facility-zoom-overlay output").innerText(),
    10,
  );
  await page.getByRole("button", { name: "Zoom facility out" }).click();
  await expect(page.locator(".facility-zoom-overlay output")).toHaveText(
    `${initialZoom - 10}%`,
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const contained = await page.evaluate(() => {
    const host = document.querySelector<HTMLElement>(".facility-host")?.getBoundingClientRect();
    const zoom = document.querySelector<HTMLElement>(".facility-zoom-overlay")?.getBoundingClientRect();
    return Boolean(host && zoom && zoom.left >= host.left && zoom.right <= host.right && zoom.top >= host.top && zoom.bottom <= host.bottom);
  });
  expect(contained).toBe(true);
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/edge-anchored-layout-phone.png`,
    animations: "disabled",
  });
});
