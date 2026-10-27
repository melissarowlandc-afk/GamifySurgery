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
  const rows = panel.locator(".goal-row:visible");
  await expect(rows).toHaveCount(expectedCount);
  await expect(panel).toHaveCSS("flex-shrink", "0");
  await expect(panel).toHaveCSS("max-height", "none");
  for (const list of await panel.locator(".goal-list:visible").all()) await expect(list).toHaveCSS("flex-shrink", "0");
  const measurements = await panel.evaluate(element => {
    const panel = element as HTMLElement;
    const lists = [...panel.querySelectorAll<HTMLElement>(".goal-list")].filter(list => !list.hidden);
    const panelBounds = panel.getBoundingClientRect();
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
      listFitsContent: lists.every(list => list.scrollHeight <= list.clientHeight + 1),
      panelScrollTop: panel.scrollTop,
      listScrollTops: lists.map(list => list.scrollTop),
      rows: lists.flatMap(list => [...list.children].map(row => {
        const listBounds = list.getBoundingClientRect();
        const bounds = row.getBoundingClientRect();
        const label = row.querySelector<HTMLElement>(".goal-label")!;
        const progress = row.querySelector<HTMLElement>(".goal-progress")!;
        const labelRange = document.createRange(); labelRange.selectNodeContents(label);
        const progressRange = document.createRange(); progressRange.selectNodeContents(progress);
        const labelLines = [...labelRange.getClientRects()];
        const progressBounds = progressRange.getBoundingClientRect();
        return {
          text: label.textContent,
          labelFits: textFits(label), progressFits: textFits(progress),
          labelLines: labelLines.length,
          sameLine: Boolean(labelLines[0] && progressBounds.top < labelLines[0].bottom + 1 && progressBounds.bottom > labelLines[0].top - 1),
          tabularProgress: getComputedStyle(progress).fontVariantNumeric.includes("tabular-nums"),
          rightAligned: Math.abs(progress.getBoundingClientRect().right - row.querySelector(".goal-line")!.getBoundingClientRect().right) <= 1,
          fullName: label.title,
          description: document.getElementById(label.getAttribute("aria-describedby")!)?.textContent,
          insideList: bounds.top >= listBounds.top - 1 && bounds.bottom <= listBounds.bottom + 1,
          insidePanel: bounds.top >= panelBounds.top - 1 && bounds.bottom <= panelBounds.bottom + 1,
        };
      })),
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
  expect(measurements.listScrollTops.every(top => top === 0)).toBe(true);
  for (const row of measurements.rows) {
    expect(row, row.text ?? "Goal").toMatchObject({ labelFits: true, progressFits: true, insideList: true, insidePanel: true, sameLine: true, rightAligned: true, tabularProgress: true });
    expect(row.description).toContain(row.fullName);
  }
  for (const goal of measurements.optionalGoals) {
    expect(goal, goal.text ?? "Optional goal").toMatchObject({ labelFits: true, progressFits: true, insidePanel: true });
  }
  // When the content exceeds even the entire rail, each full row stays reachable there.
  for (const row of await panel.locator(".goal-row:visible, .goal-secondary-chip").all()) {
    await row.scrollIntoViewIfNeeded();
    expect(await row.evaluate(element => {
      const label = element.getBoundingClientRect();
      const rail = element.closest(".operations-column")!.getBoundingClientRect();
      return label.top >= rail.top - 1 && label.bottom <= rail.bottom + 1;
    })).toBe(true);
  }
  await page.locator(".operations-column").evaluate(element => { element.scrollTop = 0; });
}

/** Test-only reconstruction of the prior Level 4 panel: full labels and stacked
 * progress, every required goal listed. Global rail/typography CSS is unchanged;
 * these are the original classes and DOM, without the new compact-goals wrapper.
 * Measure in the same rail at the same width/font, then remove the inert clone. */
async function measurePreviousLevelFourPanel(page: Page): Promise<number> {
  return page.locator(".operations-column > .goals-panel").evaluate(source => {
    const previous = source.cloneNode(true) as HTMLElement;
    previous.inert = true;
    previous.setAttribute("aria-hidden", "true");
    previous.style.cssText = `position:fixed;left:-10000px;top:0;width:${source.getBoundingClientRect().width}px;visibility:hidden;margin:0`;
    for (const node of previous.querySelectorAll("[id]")) node.removeAttribute("id");
    const list = document.createElement("ul"); list.className = "goal-list";
    for (const goal of source.querySelectorAll<HTMLElement>(".goal-row")) {
      const row = document.createElement("li"); row.className = goal.classList.contains("is-complete") ? "is-complete" : "";
      const icon = document.createElement("span"); icon.textContent = row.className ? "■" : "□"; icon.setAttribute("aria-hidden", "true");
      const content = document.createElement("div"); content.className = "goal-content";
      const label = document.createElement("span"); label.className = "goal-label"; label.textContent = goal.querySelector<HTMLElement>(".goal-label")!.title;
      const progress = document.createElement("small"); progress.textContent = goal.querySelector<HTMLElement>(".goal-progress")!.title;
      label.append(progress); content.append(label); row.append(icon, content); list.append(row);
    }
    previous.querySelector(".compact-goals")!.replaceWith(list);
    source.parentElement!.append(previous);
    try { return previous.getBoundingClientRect().height; }
    finally { previous.remove(); }
  });
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
  const introductoryGoalCount = await page.locator(".goals-panel .goal-row:visible").count();
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
    { id: "l4-ready", level: 4, count: 5, completed: 5, campaign: "Level 5 M6 goals" },
    { id: "launch-unmet", level: 4, count: 5, completed: 4, campaign: "Level 5 M10 ordinary launch" },
    { id: "goals-unlocked", level: 5, count: 3, completed: 3, campaign: "Level 5 M6 goals" },
  ]) {
    test(`Level ${scenario.level} compact goals (${scenario.id}) stay readable while Alerts scrolls independently`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "desktop-chrome", "One controlled desktop browser checks every desktop viewport.");
      await installRememberedLocalAccess(page);
      await page.goto(`${qaOrigin}/level4-rooms-qa.html?level5=${scenario.id}&layout=desktop`);
      expect(await page.evaluate(() => location.origin)).toBe(qaOrigin);
      await page.getByRole("button", { name: `Resume ${scenario.campaign} (${scenario.id})`, exact: true }).click();
      await expect(page.getByTestId("facility-canvas")).toBeVisible();
      await expect(page.locator(".goals-panel > .panel-heading")).toContainText(`Level ${scenario.level} goals`);
      await page.evaluate(() => document.fonts.ready);
      const panel = page.locator(".operations-column > .goals-panel");
      const toggle = panel.getByRole("button", { name: `✓ ${scenario.completed} of ${scenario.count} done` });
      await expect(panel.locator(".goal-row")).toHaveCount(scenario.count);
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      for (const viewport of goalViewports) {
        await page.setViewportSize(viewport);
        assertDesktopLayout(await readMetrics(page));
        await assertReadableGoals(page, scenario.count - scenario.completed);
        await expect(panel.locator(".completed-goal-list")).toBeHidden();
        const beforePx = scenario.level === 4 && viewport.width === 1280 ? await measurePreviousLevelFourPanel(page) : undefined;
        const afterPx = (await panel.boundingBox())!.height;
        // The native button must respond to both keyboard activation keys.
        await toggle.focus(); await page.keyboard.press("Enter");
        await expect(toggle).toHaveAttribute("aria-expanded", "true");
        await assertReadableGoals(page, scenario.count);
        if (beforePx !== undefined) {
          const expandedPx = (await panel.boundingBox())!.height;
          expect(beforePx).toBeGreaterThan(afterPx);
          expect(beforePx).toBeGreaterThan(expandedPx);
          const report = {
            viewport, scenario: scenario.id, beforePx, afterPx, expandedPx, reductionPx: beforePx - afterPx,
            baseline: "Prior full-label, stacked-progress DOM reconstructed in the same rail with unchanged global CSS and loaded fonts",
          };
          await testInfo.attach(`level-4-goals-height-1280x720-${scenario.id}`, { body: JSON.stringify(report, null, 2), contentType: "application/json" });
          console.info(`Level 4 goals (${scenario.id}) at 1280x720: before ${beforePx}px, after ${afterPx}px (${expandedPx}px expanded); reduction ${report.reductionPx}px.`);
        }
        await page.screenshot({ path: testInfo.outputPath(`goals-level-${scenario.level}-${scenario.id}-${viewport.width}x${viewport.height}-expanded.png`), animations: "disabled" });
        await toggle.focus(); await page.keyboard.press("Space");
        await expect(toggle).toHaveAttribute("aria-expanded", "false");
        if (scenario.id === "l4-ready") await expect(panel.getByRole("button", { name: "Advance to Level 5" })).toBeVisible();
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
        await page.screenshot({ path: testInfo.outputPath(`goals-level-${scenario.level}-${scenario.id}-${viewport.width}x${viewport.height}-collapsed.png`), animations: "disabled" });
      }
      // Deliberately shorter than the content: only the rail may scroll the goals.
      await page.setViewportSize({ width: 1280, height: 280 });
      // Some QA saves restore an open chart sheet, which overlays the rail at this height.
      if (await page.locator("aside.chart-sheet").count()) await page.keyboard.press("Escape");
      await toggle.click();
      await assertReadableGoals(page, scenario.count);
      const rail = page.locator(".operations-column");
      expect(await rail.evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true);
      const lastGoal = rail.locator(".goal-row:visible").last();
      await lastGoal.scrollIntoViewIfNeeded();
      // Either the rail or the page may scroll at this extreme height; the
      // requirement is that the final goal becomes fully visible, unclipped.
      await expect(lastGoal).toBeInViewport({ ratio: 1 });
    });
  }

  test("phone goals use compact rows, 44px disclosures and remember expansion after reopening", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "phone-chrome", "The manager checks the phone shell with the Pixel 7 project.");
    await installRememberedLocalAccess(page);
    await page.goto(`${qaOrigin}/level4-rooms-qa.html?level5=launch-unmet&layout=phone`);
    expect(await page.evaluate(() => location.origin)).toBe(qaOrigin);
    await page.getByRole("button", { name: "Resume Level 5 M10 ordinary launch (launch-unmet)", exact: true }).click();
    await page.locator(".mobile-goals-chip").click();
    const goals = page.locator(".mobile-goals");
    const toggle = goals.getByRole("button", { name: "✓ 4 of 5 done" });
    for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 393, height: 851 }]) {
      await page.setViewportSize(viewport);
      await expect(goals.locator(".goal-row:visible")).toHaveCount(1);
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      expect((await toggle.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const row = goals.locator(".goal-row:visible");
      await expect(row.locator(".goal-label")).toHaveText("Clinical XP");
      await expect(row.locator(".goal-progress")).toHaveText("749/750");
      await expect(row.locator(".goal-progress")).toHaveCSS("font-variant-numeric", "tabular-nums");
      const label = (await row.locator(".goal-label").boundingBox())!;
      const progress = (await row.locator(".goal-progress").boundingBox())!;
      expect(progress.x).toBeGreaterThan(label.x);
      expect(Math.abs(label.y - progress.y)).toBeLessThanOrEqual(1);
      await expect(goals.locator(".goal-secondary-label")).toHaveText("Optional: Quality review");
      await page.screenshot({ path: testInfo.outputPath(`phone-compact-goals-${viewport.width}x${viewport.height}.png`), animations: "disabled" });
    }
    await toggle.click();
    await expect(goals.locator(".goal-row:visible")).toHaveCount(5);
    await expect(goals.locator('.goal-label[title="Complete a pediatric visit with its parent"]')).toHaveAccessibleDescription("Complete a pediatric visit with its parent");
    await page.goBack();
    await expect(goals).toHaveCount(0);
    await page.locator(".mobile-goals-chip").click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await page.screenshot({ path: testInfo.outputPath("phone-compact-goals-expanded.png"), animations: "disabled" });
  });
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
