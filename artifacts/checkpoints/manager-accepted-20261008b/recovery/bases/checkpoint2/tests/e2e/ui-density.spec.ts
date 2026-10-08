import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

import { installLevelOneVisualState, startClinic } from "./helpers";

test.beforeAll(() => mkdirSync("artifacts/screenshots", { recursive: true }));

test("desktop primary bars stay compact and move Build Mode status into the HUD", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Desktop density proof.");
  await startClinic(page, "Density Reviewer", "Density Clinic");

  const tutorialDismiss = page.getByRole("button", { name: "Got It" });
  if (await tutorialDismiss.isVisible()) {
    await tutorialDismiss.click();
  }

  const notice = page.locator(".footer-content-notice");
  const footer = page.locator(".footer-bar");
  const resourceChip = page.locator(".resource-chip").first();
  const facilityHost = page.locator(".facility-host");
  const splitter = page.getByRole("separator", {
    name: "Resize facility map and clinical desk",
  });

  await expect(notice).toHaveCount(1);
  await expect(notice).toBeVisible();
  await expect(page.locator(".global-content-notice")).toHaveCount(0);
  await expect(splitter).toBeVisible();
  await expect(page.locator(".facility-pause-indicator")).toHaveCount(0);

  const geometry = await page.evaluate(() => {
    const box = (selector: string) =>
      document.querySelector(selector)?.getBoundingClientRect();
    const footer = box(".footer-bar");
    const status = box(".footer-status");
    const notice = box(".footer-content-notice");
    const actions = box(".footer-actions");
    const hud = document.querySelector<HTMLElement>(".resource-bar-main");
    const learning = document.querySelector<HTMLElement>(".resource-level-chip");
    const learningParts = learning
      ? [
          learning.querySelector<HTMLElement>(".resource-chip-heading"),
          learning.querySelector<HTMLElement>(".resource-chip-heading strong"),
          learning.querySelector<HTMLElement>(".xp-progress"),
          learning.querySelector<HTMLElement>(".resource-xp-row small"),
        ]
      : [];
    const chipBounds = [...document.querySelectorAll<HTMLElement>(".resource-chip")]
      .map((chip) => chip.getBoundingClientRect());
    const controlBounds = [...document.querySelectorAll<HTMLElement>(
      ".resource-controls button",
    )]
      .map((control) => control.getBoundingClientRect())
      .filter((control) => control.width > 0 && control.height > 0);
    const hudBounds = hud?.getBoundingClientRect();
    const footerActionBounds = [...document.querySelectorAll<HTMLElement>(
      ".footer-actions button",
    )]
      .map((action) => action.getBoundingClientRect())
      .filter((action) => action.width > 0 && action.height > 0);
    return {
      footerHeight: footer?.height ?? 0,
      chipHeight: box(".resource-chip")?.height ?? 0,
      facilityHeight: box(".facility-frame")?.height ?? 0,
      hostHeight: box(".facility-host")?.height ?? 0,
      splitterHeight: box(".workspace-splitter-row")?.height ?? 0,
      footerChildrenStayInside: [status, notice, actions].every(
        (child) =>
          child && footer && child.top >= footer.top && child.bottom <= footer.bottom,
      ),
      chipsWithinTarget: chipBounds.every(
        (chip) => chip.height >= 46 && chip.height <= 48,
      ),
      hudControlsStayInside: Boolean(
        hudBounds &&
          controlBounds.every(
            (control) =>
              control.left >= hudBounds.left &&
              control.right <= hudBounds.right &&
              control.top >= hudBounds.top &&
              control.bottom <= hudBounds.bottom,
          ),
      ),
      learningLayoutFits: Boolean(
        learning &&
          learningParts.length === 4 &&
          learningParts.every(
            (part) =>
              part &&
              part.scrollWidth <= part.clientWidth &&
              part.scrollHeight <= part.clientHeight &&
              part.getBoundingClientRect().left >= learning.getBoundingClientRect().left &&
              part.getBoundingClientRect().right <= learning.getBoundingClientRect().right &&
              part.getBoundingClientRect().top >= learning.getBoundingClientRect().top &&
              part.getBoundingClientRect().bottom <= learning.getBoundingClientRect().bottom,
          ),
      ),
      footerActionsStayInside: Boolean(
        footer &&
          footerActionBounds.every(
            (action) =>
              action.left >= footer.left &&
              action.right <= footer.right &&
              action.top >= footer.top &&
              action.bottom <= footer.bottom,
          ),
      ),
    };
  });
  expect(geometry.footerHeight).toBeLessThanOrEqual(24);
  expect(geometry.chipHeight).toBeGreaterThanOrEqual(46);
  expect(geometry.chipHeight).toBeLessThanOrEqual(48);
  await expect(page.locator(".facility-heading")).toHaveCount(0);
  await expect(facilityHost).toBeVisible();
  expect(Math.abs(geometry.facilityHeight - geometry.hostHeight)).toBeLessThanOrEqual(6);
  expect(geometry.splitterHeight).toBe(18);
  expect(geometry.footerChildrenStayInside).toBe(true);
  expect(geometry.chipsWithinTarget).toBe(true);
  expect(geometry.hudControlsStayInside).toBe(true);
  expect(geometry.learningLayoutFits).toBe(true);
  expect(geometry.footerActionsStayInside).toBe(true);

  await page.screenshot({
    path: "artifacts/screenshots/ui-density-extra-compact-wide-desktop.png",
    animations: "disabled",
  });

  await page.getByRole("button", { name: "Pause facility time" }).click();
  await expect(page.locator(".facility-pause-indicator")).toContainText(
    "GAME PAUSED",
  );
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect(page.locator(".facility-pause-indicator")).toHaveCount(0);

  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  await expect(page.getByText("BUILD MODE", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Facility time is stopped while you remodel.", {
      exact: true,
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => {
      const message = document.querySelector<HTMLElement>(
        ".facility-time-chip.is-build-mode .resource-chip-content > strong",
      );
      const chip = document.querySelector<HTMLElement>(
        ".facility-time-chip.is-build-mode",
      );
      if (!message || !chip) return false;
      const messageBounds = message.getBoundingClientRect();
      const chipBounds = chip.getBoundingClientRect();
      return (
        message.textContent === "Facility time is stopped while you remodel." &&
        message.scrollWidth <= message.clientWidth &&
        message.scrollHeight <= message.clientHeight &&
        messageBounds.left >= chipBounds.left &&
        messageBounds.right <= chipBounds.right &&
        messageBounds.top >= chipBounds.top &&
        messageBounds.bottom <= chipBounds.bottom
      );
    }),
  ).toBe(true);
  await expect(page.locator(".facility-pause-indicator")).toHaveCount(0);
  await page.screenshot({
    path: "artifacts/screenshots/ui-density-extra-compact-wide-build.png",
    animations: "disabled",
  });
});

test("phone footer keeps the single notice readable without horizontal overflow", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "phone-chrome", "Phone density proof.");
  await startClinic(page, "Phone Density Reviewer", "Phone Density Clinic");

  await expect(page.locator(".footer-content-notice")).toHaveCount(1);
  await expect(page.locator(".footer-content-notice")).toBeVisible();
  await expect(page.locator(".global-content-notice")).toHaveCount(0);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);
});

test("compact desktop retains dense operations panels and construction tools", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "compact-desktop-chrome",
    "Compact desktop density proof.",
  );
  await startClinic(page, "Compact Density Reviewer", "Compact Density Clinic");
  await installLevelOneVisualState(page);

  await expect(page.locator(".goals-panel")).toBeVisible();
  await expect(page.locator(".operations-column .staff-panel")).toHaveCount(0);
  await expect(page.locator(".event-message-board")).toBeVisible();
  await expect(page.locator(".patient-folder").first()).toBeVisible();
  await expect(page.locator(".footer-content-notice")).toHaveCount(1);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);

  const compactGeometry = await page.evaluate(() => ({
    panelHeading: document.querySelector(".goals-panel .panel-heading")?.getBoundingClientRect().height ?? 0,
    patientTab: document.querySelector(".patient-tab")?.getBoundingClientRect().height ?? 0,
    footerHeight: document.querySelector(".footer-bar")?.getBoundingClientRect().height ?? 0,
    noticeBelowControls: (() => {
      const notice = document.querySelector(".footer-content-notice")?.getBoundingClientRect();
      const status = document.querySelector(".footer-status")?.getBoundingClientRect();
      const actions = document.querySelector(".footer-actions")?.getBoundingClientRect();
      return Boolean(
        notice && status && actions && notice.top >= Math.max(status.bottom, actions.bottom),
      );
    })(),
  }));
  expect(compactGeometry.panelHeading).toBeLessThanOrEqual(36);
  expect(compactGeometry.patientTab).toBeLessThanOrEqual(58);
  expect(compactGeometry.footerHeight).toBeLessThanOrEqual(34);
  expect(compactGeometry.noticeBelowControls).toBe(true);

  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  await expect(page.getByRole("navigation", { name: "Build Mode tools" })).toBeVisible();
  await expect(page.locator(".build-tool-toolbar .button").first()).toBeVisible();
  const compactContainment = await page.evaluate(() => {
    const message = document.querySelector<HTMLElement>(
      ".facility-time-chip.is-build-mode .resource-chip-content > strong",
    );
    const chip = document.querySelector<HTMLElement>(
      ".facility-time-chip.is-build-mode",
    );
    const toolbar = document.querySelector<HTMLElement>(".build-tool-toolbar");
    const panel = document.querySelector<HTMLElement>(".build-mode-panel");
    if (!message || !chip || !toolbar || !panel) {
      return { buildMessageFits: false, toolbarButtonsFit: false };
    }
    const chipBounds = chip.getBoundingClientRect();
    const messageBounds = message.getBoundingClientRect();
    const toolbarBounds = toolbar.getBoundingClientRect();
    const panelBounds = panel.getBoundingClientRect();
    const toolbarButtonsFit = [...toolbar.querySelectorAll<HTMLElement>("button")]
      .every((button) => {
        const bounds = button.getBoundingClientRect();
        return (
          bounds.left >= toolbarBounds.left &&
          bounds.right <= toolbarBounds.right &&
          bounds.top >= toolbarBounds.top &&
          bounds.bottom <= toolbarBounds.bottom &&
          bounds.right <= panelBounds.right &&
          button.scrollWidth <= button.clientWidth &&
          button.scrollHeight <= button.clientHeight
        );
      });
    return {
      buildMessageFits:
        message.textContent === "Facility time is stopped while you remodel." &&
        message.scrollWidth <= message.clientWidth &&
        message.scrollHeight <= message.clientHeight &&
        messageBounds.left >= chipBounds.left &&
        messageBounds.right <= chipBounds.right &&
        messageBounds.top >= chipBounds.top &&
        messageBounds.bottom <= chipBounds.bottom,
      toolbarButtonsFit,
      hudHeight: chipBounds.height,
      buildMessageHeight: messageBounds.height,
      toolbarHeight: toolbarBounds.height,
      toolbarWidth: toolbarBounds.width,
    };
  });
  expect(compactContainment.buildMessageFits).toBe(true);
  expect(compactContainment.toolbarButtonsFit).toBe(true);
  await page.screenshot({
    path: "artifacts/screenshots/ui-density-extra-compact-compact-desktop.png",
    animations: "disabled",
  });
});

test("phone normal, Build Mode, and chart preserve readable controls without overflow", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "phone-chrome", "Phone density proof.");
  await startClinic(page, "Phone Full Density Reviewer", "Phone Full Density Clinic");
  await installLevelOneVisualState(page);

  const assertNoOverflow = () =>
    page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  await expect(page.locator(".footer-content-notice")).toBeVisible();
  expect(await assertNoOverflow()).toBe(true);
  expect(
    await page.evaluate(() => {
      const fraction = document.querySelector<HTMLElement>(
        ".resource-xp-row small",
      );
      return Boolean(
        fraction &&
          fraction.scrollWidth <= fraction.clientWidth &&
          fraction.textContent?.includes("/") &&
          fraction.textContent?.includes("XP"),
      );
    }),
  ).toBe(true);
  const phoneActionGeometry = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>(".footer-actions button")]
      .filter((button) => button.getBoundingClientRect().width > 0)
      .map((button) => ({
        height: button.getBoundingClientRect().height,
        minHeight: getComputedStyle(button).minHeight,
      })),
  );
  expect(phoneActionGeometry).not.toHaveLength(0);
  expect(
    phoneActionGeometry.every(
      (action) => action.height >= 36 && action.minHeight === "36px",
    ),
  ).toBe(true);

  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  await expect(page.getByRole("navigation", { name: "Build Mode tools" })).toBeVisible();
  expect(await assertNoOverflow()).toBe(true);
  await page.screenshot({
    path: "artifacts/screenshots/ui-density-extra-compact-phone-build.png",
    animations: "disabled",
  });

  await page.getByRole("button", { name: "Done / Save" }).click();
  await expect(page.getByRole("button", { name: "Enter Build Mode" })).toBeVisible();
  await page.locator(".patient-tab").first().click();
  await expect(page.locator(".paper-chart")).toBeVisible();
  expect(await assertNoOverflow()).toBe(true);
});
