import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import { installRememberedLocalAccess, startClinic } from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

interface ColumnRect {
  left: number; top: number; right: number; bottom: number; width: number; height: number;
}

interface LayoutMetrics {
  grid: ColumnRect;
  leftRail: ColumnRect;
  center: ColumnRect;
  rightRail: ColumnRect;
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
    return Boolean(host && canvas && canvas.width > 1 && canvas.height > 1 &&
      Math.abs(canvas.width - host.clientWidth) <= 1 && Math.abs(canvas.height - host.clientHeight) <= 1);
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
  for (const column of [metrics.leftRail, metrics.center, metrics.rightRail]) {
    expect(column.top).toBeGreaterThanOrEqual(metrics.grid.top - 1);
    expect(column.bottom).toBeLessThanOrEqual(metrics.grid.bottom + 1);
    expect(column.height).toBeGreaterThan(0);
  }
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

async function assertReadableGoals(page: Page, expectedCount: number): Promise<void> {
  const panel = page.locator(".operations-column > .goals-panel");
  const rows = panel.locator(":scope > .goal-list > li");
  await expect(rows).toHaveCount(expectedCount);
  await expect(panel).toHaveCSS("flex-shrink", "0");
  await expect(panel).toHaveCSS("max-height", "none");
  await expect(panel.locator(":scope > .goal-list")).toHaveCSS("flex-shrink", "0");
  const measurements = await panel.evaluate(element => {
    const panel = element as HTMLElement;
    const list = panel.querySelector<HTMLElement>(".goal-list")!;
    const panelBounds = panel.getBoundingClientRect();
    const listBounds = list.getBoundingClientRect();
    const textFits = (node: HTMLElement) => {
      const bounds = node.getBoundingClientRect();
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      const rectangles: DOMRect[] = [];
      while (walker.nextNode()) {
        const range = document.createRange();
        range.selectNodeContents(walker.currentNode);
        rectangles.push(...range.getClientRects());
      }
      return node.scrollWidth <= node.clientWidth + 1 && node.scrollHeight <= node.clientHeight + 1 &&
        rectangles.length > 0 && rectangles.every(rect => rect.width > 0 && rect.height > 0 &&
          rect.left >= bounds.left - 1 && rect.right <= bounds.right + 1 &&
          rect.top >= bounds.top - 1 && rect.bottom <= bounds.bottom + 1);
    };
    return {
      panelFitsContent: panel.scrollHeight <= panel.clientHeight + 1,
      listFitsContent: list.scrollHeight <= list.clientHeight + 1,
      panelScrollTop: panel.scrollTop,
      listScrollTop: list.scrollTop,
      rows: [...list.children].map(row => {
        const bounds = row.getBoundingClientRect();
        const label = row.querySelector<HTMLElement>(".goal-label")!;
        const progress = label.querySelector<HTMLElement>("small")!;
        return {
          text: label.textContent,
          labelFits: textFits(label), progressFits: textFits(progress),
          insideList: bounds.top >= listBounds.top - 1 && bounds.bottom <= listBounds.bottom + 1,
          insidePanel: bounds.top >= panelBounds.top - 1 && bounds.bottom <= panelBounds.bottom + 1,
        };
      }),
      optionalGoals: [...panel.querySelectorAll<HTMLElement>(".goal-secondary-chip")].map(chip => {
        const bounds = chip.getBoundingClientRect();
        const label = chip.querySelector<HTMLElement>(".goal-secondary-label")!;
        return {
          text: label.textContent,
          labelFits: textFits(label), progressFits: textFits(chip.querySelector<HTMLElement>(".goal-secondary-progress")!),
          insidePanel: bounds.top >= panelBounds.top - 1 && bounds.bottom <= panelBounds.bottom + 1,
        };
      }),
    };
  });
  expect(measurements.panelFitsContent, JSON.stringify(measurements)).toBe(true);
  expect(measurements.listFitsContent, JSON.stringify(measurements)).toBe(true);
  expect(measurements.panelScrollTop).toBe(0);
  expect(measurements.listScrollTop).toBe(0);
  for (const row of measurements.rows) {
    expect(row, row.text ?? "Goal").toMatchObject({ labelFits: true, progressFits: true, insideList: true, insidePanel: true });
  }
  for (const goal of measurements.optionalGoals) {
    expect(goal, goal.text ?? "Optional goal").toMatchObject({ labelFits: true, progressFits: true, insidePanel: true });
  }
  // When the content exceeds even the entire rail, each full row stays reachable there.
  for (const row of await panel.locator(":scope > .goal-list > li, .goal-secondary-chip").all()) {
    await row.scrollIntoViewIfNeeded();
    expect(await row.evaluate(element => {
      const label = element.getBoundingClientRect();
      const rail = element.closest(".operations-column")!.getBoundingClientRect();
      return label.top >= rail.top - 1 && label.bottom <= rail.bottom + 1;
    })).toBe(true);
  }
  await page.locator(".operations-column").evaluate(element => { element.scrollTop = 0; });
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
  const introductoryGoalCount = await page.locator(".goals-panel > .goal-list > li").count();
  expect(introductoryGoalCount).toBeGreaterThan(0);
  for (const viewport of desktopViewports) {
    await page.setViewportSize(viewport);
    const metrics = await readMetrics(page);
    assertDesktopLayout(metrics);
    await assertReadableGoals(page, introductoryGoalCount);
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

test.describe("desktop goals in the disposable Level 4/5 QA shell", () => {
  // The manager starts `node tools/qa/level-four-rooms.mjs` separately on 5184.
  // These fixtures never use the owner's canonical 4173 origin/profile.
  const qaOrigin = "http://127.0.0.1:5184";
  const goalViewports = [
    { width: 1280, height: 720 }, { width: 1366, height: 768 },
    { width: 1440, height: 900 }, { width: 1536, height: 864 },
    { width: 1920, height: 1080 },
  ];
  for (const scenario of [
    { id: "l4-ready", level: 4, count: 5 },
    { id: "goals-unlocked", level: 5, count: 3 },
  ]) {
    test(`Level ${scenario.level} goals stay readable while Alerts scrolls independently`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "desktop-chrome", "One controlled desktop browser checks every desktop viewport.");
      await installRememberedLocalAccess(page);
      await page.goto(`${qaOrigin}/level4-rooms-qa.html?level5=${scenario.id}&layout=desktop`);
      expect(await page.evaluate(() => location.origin)).toBe(qaOrigin);
      await page.getByRole("button", { name: `Resume Level 5 M6 goals (${scenario.id})`, exact: true }).click();
      await expect(page.getByTestId("facility-canvas")).toBeVisible();
      await expect(page.locator(".goals-panel > .panel-heading")).toContainText(`Level ${scenario.level} goals`);
      await page.evaluate(() => document.fonts.ready);
      for (const viewport of goalViewports) {
        await page.setViewportSize(viewport);
        assertDesktopLayout(await readMetrics(page));
        await assertReadableGoals(page, scenario.count);
        const alerts = page.locator(".operations-column > .event-message-board");
        await expect(alerts).toHaveCSS("min-height", "0px");
        await expect(alerts).toHaveCSS("flex-grow", "1");
        await expect(alerts).toHaveCSS("overflow-y", "auto");
        await expect(alerts).toHaveAttribute("tabindex", "0");
        const goalsBefore = await page.locator(".goals-panel").boundingBox();
        const scroll = await alerts.evaluate(element => {
          element.scrollTop = element.scrollHeight;
          const rail = element.parentElement!;
          const goals = rail.querySelector(".goals-panel")!.getBoundingClientRect();
          return {
            available: element.scrollHeight - element.clientHeight, top: element.scrollTop, height: element.clientHeight,
            remainingRailHeight: rail.clientHeight - goals.height - parseFloat(getComputedStyle(rail).rowGap),
            borderHeight: element.getBoundingClientRect().height - element.clientHeight,
            railOverflows: rail.scrollHeight > rail.clientHeight,
          };
        });
        if (scroll.remainingRailHeight > scroll.borderHeight + 1) {
          expect(scroll.height).toBeGreaterThan(0);
          if (scroll.available > 1) expect(scroll.top).toBeGreaterThan(0);
        } else expect(scroll.railOverflows).toBe(true);
        expect(await page.locator(".operations-column").evaluate(element => element.scrollTop)).toBe(0);
        expect(await page.locator(".goals-panel").boundingBox()).toEqual(goalsBefore);
        await alerts.evaluate(element => { element.scrollTop = 0; });
        await page.screenshot({ path: testInfo.outputPath(`goals-level-${scenario.level}-${viewport.width}x${viewport.height}.png`), animations: "disabled" });
      }
      // Deliberately shorter than the content: only the rail may scroll the goals.
      await page.setViewportSize({ width: 1280, height: 280 });
      await assertReadableGoals(page, scenario.count);
      const rail = page.locator(".operations-column");
      expect(await rail.evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true);
      const lastGoal = rail.locator(".goal-list > li").last();
      await lastGoal.scrollIntoViewIfNeeded();
      // Either the rail or the page may scroll at this extreme height; the
      // requirement is that the final goal becomes fully visible, unclipped.
      await expect(lastGoal).toBeInViewport({ ratio: 1 });
    });
  }
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
