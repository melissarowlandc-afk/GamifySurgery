import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

import { startClinic } from "./helpers";

test.beforeAll(() => mkdirSync("artifacts/screenshots", { recursive: true }));

test("desktop splitter reallocates the facility and desk without changing canvas scale", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Desktop workspace behavior.");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await startClinic(page, "Splitter Reviewer", "Splitter Clinic");

  const splitter = page.getByRole("separator", {
    name: "Resize facility map and clinical desk",
  });
  const map = page.locator(".facility-frame");
  const desk = page.locator(".desk-workspace");
  const buildButton = page.getByRole("button", { name: "Enter Build Mode" });
  await expect(splitter).toBeVisible();
  await expect(buildButton).toBeVisible();
  const before = {
    map: await map.boundingBox(),
    desk: await desk.boundingBox(),
    build: await buildButton.boundingBox(),
  };
  expect(before.map).not.toBeNull();
  expect(before.desk).not.toBeNull();
  expect(before.build).not.toBeNull();
  const splitterBox = await splitter.boundingBox();
  expect(splitterBox).not.toBeNull();

  await page.mouse.move(
    splitterBox!.x + splitterBox!.width / 2,
    splitterBox!.y + splitterBox!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    splitterBox!.x + splitterBox!.width / 2,
    splitterBox!.y - 110,
    { steps: 8 },
  );
  await page.mouse.up();

  const after = {
    map: await map.boundingBox(),
    desk: await desk.boundingBox(),
    build: await buildButton.boundingBox(),
  };
  expect(after.map!.height).toBeLessThan(before.map!.height - 80);
  expect(after.desk!.height).toBeGreaterThan(before.desk!.height + 80);
  expect(after.build!.y).toBeLessThan(before.build!.y - 80);

  await splitter.focus();
  const keyboardBefore = Number(await splitter.getAttribute("aria-valuenow"));
  await page.keyboard.press("ArrowDown");
  await expect(splitter).toHaveAttribute(
    "aria-valuenow",
    String(keyboardBefore + 2),
  );

  const raisedSplitterBox = await splitter.boundingBox();
  expect(raisedSplitterBox).not.toBeNull();
  await page.mouse.move(
    raisedSplitterBox!.x + raisedSplitterBox!.width / 2,
    raisedSplitterBox!.y + raisedSplitterBox!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    raisedSplitterBox!.x + raisedSplitterBox!.width / 2,
    raisedSplitterBox!.y + 60,
    { steps: 6 },
  );
  await page.mouse.up();

  const afterDownwardDrag = {
    map: await map.boundingBox(),
    desk: await desk.boundingBox(),
    build: await buildButton.boundingBox(),
  };
  expect(afterDownwardDrag.map!.height).toBeGreaterThan(after.map!.height + 5);
  expect(afterDownwardDrag.desk!.height).toBeLessThan(after.desk!.height - 5);
  expect(afterDownwardDrag.build!.y).toBeGreaterThan(after.build!.y + 5);

  const canvas = page.getByTestId("facility-canvas");
  await expect(canvas).toBeVisible();
  await expect.poll(async () => canvas.evaluate((host) => {
    const bitmap = host.querySelector("canvas");
    return bitmap ? { width: bitmap.width, height: bitmap.height } : null;
  })).not.toBeNull();
  const hostSize = await canvas.evaluate((host) => ({
    width: host.clientWidth,
    height: host.clientHeight,
  }));
  const bitmap = await canvas.evaluate((host) => {
    const element = host.querySelector("canvas");
    return element ? { width: element.width, height: element.height } : null;
  });
  // CSS layout may retain a fractional pixel while Phaser receives the
  // observer's integer bitmap size; a one-pixel rounding difference is exact
  // host-resize behavior, not a zoom or proportion change.
  expect(Math.abs(bitmap!.width - hostSize.width)).toBeLessThanOrEqual(1);
  expect(Math.abs(bitmap!.height - hostSize.height)).toBeLessThanOrEqual(1);

  const tutorialDismiss = page.getByRole("button", { name: "Got It" });
  if (await tutorialDismiss.isVisible()) {
    await tutorialDismiss.click();
  }

  await page.screenshot({
    path: "artifacts/screenshots/workspace-splitter-desktop-map-reduced.png",
    animations: "disabled",
  });
  await buildButton.click();
  await expect(page.getByRole("button", { name: "Done / Save" })).toBeVisible();

  const storedShare = await splitter.getAttribute("aria-valuenow");
  await page.getByRole("button", { name: "Done / Save" }).click();
  await expect(buildButton).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Resume Splitter Clinic" }).click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await expect(splitter).toHaveAttribute("aria-valuenow", storedShare!);
});
