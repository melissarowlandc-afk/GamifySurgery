import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { installLevelOneVisualState, startClinic } from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

test.beforeAll(() => mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true }));

async function startManagementFixture(page: Page, suffix: string) {
  await startClinic(page, `Management ${suffix}`, `Management ${suffix} Clinic`);
  await installLevelOneVisualState(page);
}

async function expectNoHorizontalOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}

test("Management Mode keeps its desk controls, lifecycle, and containment across responsive layouts", async ({
  page,
}, testInfo) => {
  await startManagementFixture(page, testInfo.project.name);

  const managementTrigger = page.getByRole("button", {
    name: "Enter Management Mode",
    exact: true,
  });
  const buildTrigger = page.getByRole("button", {
    name: "Enter Build Mode",
    exact: true,
  });
  const desk = page.locator(".desk-workspace");
  await managementTrigger.scrollIntoViewIfNeeded();
  await expect(managementTrigger).toBeVisible();
  await expect(buildTrigger).toBeVisible();
  await expect(page.locator(".operations-column .staff-panel")).toHaveCount(0);
  await expect(page.locator(".operations-column .goals-panel")).toBeVisible();
  await expect(page.locator(".operations-column .event-message-board")).toBeVisible();
  await expect(page.locator(".empty-desk-paper")).toHaveCount(0);
  await expect(desk).toContainText("Clinical desk");
  await expect(desk).toContainText("Open a patient chart to place it here.");

  const triggerGeometry = await Promise.all([
    managementTrigger.boundingBox(),
    buildTrigger.boundingBox(),
  ]);
  const [managementBox, buildBox] = triggerGeometry;
  expect(managementBox).not.toBeNull();
  expect(buildBox).not.toBeNull();
  expect(managementBox!.x).toBeLessThan(buildBox!.x);
  expect(buildBox!.x - (managementBox!.x + managementBox!.width)).toBeGreaterThanOrEqual(4);
  expect(Math.abs(managementBox!.height - buildBox!.height)).toBeLessThanOrEqual(1);

  await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect(page.locator(".facility-pause-indicator")).toHaveCount(0);
  await managementTrigger.click();
  await expect(page.getByText("MANAGEMENT MODE", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Facility time is stopped while you manage staff.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator(".facility-pause-indicator")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Pause facility time" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Resume facility time" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Set facility speed to 2x" })).toBeDisabled();
  await expect(managementTrigger).toHaveCount(0);
  await expect(buildTrigger).toHaveCount(0);
  const managementHudContainment = await page.evaluate(() => {
    const chip = document.querySelector<HTMLElement>(
      ".facility-time-chip.is-management-mode",
    );
    const content = chip?.querySelector<HTMLElement>(".resource-chip-content");
    const message = chip?.querySelector<HTMLElement>(
      ".resource-chip-content > strong",
    );
    if (!content || !message) return null;
    const contentBox = content.getBoundingClientRect();
    const messageBox = message.getBoundingClientRect();
    return {
      exactCopy:
        message.textContent === "Facility time is stopped while you manage staff.",
      noEllipsis: !message.textContent?.includes("…"),
      noHorizontalClip: message.scrollWidth <= message.clientWidth,
      noVerticalClip: message.scrollHeight <= message.clientHeight,
      contained:
        messageBox.left >= contentBox.left - 1 &&
        messageBox.right <= contentBox.right + 1 &&
        messageBox.top >= contentBox.top - 1 &&
        messageBox.bottom <= contentBox.bottom + 1,
    };
  });
  expect(managementHudContainment).toEqual({
    exactCopy: true,
    noEllipsis: true,
    noHorizontalClip: true,
    noVerticalClip: true,
    contained: true,
  });

  const panel = page.locator(".management-panel");
  const staffList = panel.locator(".staff-role-list");
  await expect(panel).toBeVisible();
  await expect(panel.locator(".staff-member-card").first()).toBeVisible();
  await expect(panel.getByRole("button", { name: "Fire" }).first()).toBeVisible();
  await expect(panel.getByRole("button", { name: /Increase .* salary/ }).first()).toBeVisible();
  const containment = await page.evaluate(() => {
    const panel = document.querySelector<HTMLElement>(".management-panel");
    const list = document.querySelector<HTMLElement>(".management-panel .staff-role-list");
    const desk = document.querySelector<HTMLElement>(".desk-workspace");
    if (!panel || !list || !desk) return null;
    const panelBox = panel.getBoundingClientRect();
    const deskBox = desk.getBoundingClientRect();
    return {
      panelInsideDesk:
        panelBox.left >= deskBox.left - 1 &&
        panelBox.right <= deskBox.right + 1 &&
        panelBox.top >= deskBox.top - 1 &&
        panelBox.bottom <= deskBox.bottom + 1,
      listScrollsInternally: getComputedStyle(list).overflowY === "auto",
      panelIsFixed: getComputedStyle(panel).position === "fixed",
    };
  });
  expect(containment).toEqual({
    panelInsideDesk: true,
    listScrollsInternally: true,
    panelIsFixed: false,
  });
  await expectNoHorizontalOverflow(page);

  if (testInfo.project.name === "laptop-chrome") {
    await page.screenshot({
      path: `${SCREENSHOT_DIRECTORY}/management-mode-laptop.png`,
      fullPage: false,
      animations: "disabled",
    });
  }
  if (testInfo.project.name === "compact-desktop-chrome") {
    await page.screenshot({
      path: `${SCREENSHOT_DIRECTORY}/management-mode-compact-desktop.png`,
      fullPage: false,
      animations: "disabled",
    });
  }
  if (testInfo.project.name === "phone-chrome") {
    await page.screenshot({
      path: `${SCREENSHOT_DIRECTORY}/management-mode-phone.png`,
      fullPage: false,
      animations: "disabled",
    });
  }

  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(page.getByRole("button", { name: "Resume facility time" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.getByRole("button", { name: "Pause facility time" }).click();
  await expect(page.locator(".facility-pause-indicator")).toBeVisible();
  await managementTrigger.click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(page.locator(".facility-pause-indicator")).toBeVisible();
});

test("Management Mode yields its desk to charts and tracks the splitter", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "laptop-chrome" && testInfo.project.name !== "desktop-chrome",
    "Chart priority uses desktop workspace projects; splitter drag uses full-height desktop.",
  );
  await startManagementFixture(page, `chart ${testInfo.project.name}`);
  const managementTrigger = page.getByRole("button", {
    name: "Enter Management Mode",
    exact: true,
  });
  const buildTrigger = page.getByRole("button", {
    name: "Enter Build Mode",
    exact: true,
  });
  await managementTrigger.click();
  const desk = page.locator(".desk-workspace");
  const panel = page.locator(".management-panel");
  const splitter = page.getByRole("separator", {
    name: "Resize facility map and clinical desk",
  });
  if (testInfo.project.name === "desktop-chrome") {
    const beforeDesk = await desk.boundingBox();
    const splitterBox = await splitter.boundingBox();
    expect(beforeDesk).not.toBeNull();
    expect(splitterBox).not.toBeNull();
    await page.mouse.move(splitterBox!.x + splitterBox!.width / 2, splitterBox!.y + splitterBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(splitterBox!.x + splitterBox!.width / 2, splitterBox!.y - 110, { steps: 8 });
    await page.mouse.up();
    const raisedDesk = await desk.boundingBox();
    const raisedPanel = await panel.boundingBox();
    expect(raisedDesk!.height).toBeGreaterThan(beforeDesk!.height + 80);
    expect(raisedPanel!.height).toBeLessThanOrEqual(raisedDesk!.height + 1);
    const raisedSplitterBox = await splitter.boundingBox();
    expect(raisedSplitterBox).not.toBeNull();
    await page.mouse.move(raisedSplitterBox!.x + raisedSplitterBox!.width / 2, raisedSplitterBox!.y + raisedSplitterBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(raisedSplitterBox!.x + raisedSplitterBox!.width / 2, raisedSplitterBox!.y + 60, { steps: 6 });
    await page.mouse.up();
    const loweredDesk = await desk.boundingBox();
    expect(loweredDesk!.height).toBeLessThan(raisedDesk!.height - 5);
  }
  await expectNoHorizontalOverflow(page);

  await page.locator(".patient-tab").first().click();
  const chart = page.locator(".paper-chart");
  await expect(chart).toBeVisible();
  await expect(panel).toHaveCount(0);
  await expect(managementTrigger).toHaveCount(0);
  await expect(buildTrigger).toHaveCount(0);
  const [chartBox, chartDeskBox] = await Promise.all([chart.boundingBox(), desk.boundingBox()]);
  expect(chartBox).not.toBeNull();
  expect(chartDeskBox).not.toBeNull();
  const edgeDeltas = {
    left: Math.abs(chartBox!.x - chartDeskBox!.x),
    top: Math.abs(chartBox!.y - chartDeskBox!.y),
    right: Math.abs(
      chartDeskBox!.x + chartDeskBox!.width - (chartBox!.x + chartBox!.width),
    ),
    bottom: Math.abs(
      chartDeskBox!.y + chartDeskBox!.height - (chartBox!.y + chartBox!.height),
    ),
  };
  expect(edgeDeltas.left).toBeLessThanOrEqual(4);
  expect(edgeDeltas.top).toBeLessThanOrEqual(4);
  expect(edgeDeltas.right).toBeLessThanOrEqual(4);
  expect(edgeDeltas.bottom).toBeLessThanOrEqual(4);
  if (testInfo.project.name === "laptop-chrome") {
    await page.screenshot({
      path: `${SCREENSHOT_DIRECTORY}/management-mode-laptop-chart-priority.png`,
      fullPage: false,
      animations: "disabled",
    });
  }
  await page.getByRole("button", { name: "Close patient chart" }).click();
  await expect(managementTrigger).toBeVisible();
  await expect(buildTrigger).toBeVisible();
});
