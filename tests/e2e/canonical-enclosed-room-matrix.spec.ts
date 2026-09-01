import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

import {
  getActiveState,
  installLevelTwoVisualState,
  startClinic,
} from "./helpers";

const enclosedRoomIds = [
  "room.waiting", "room.bathroom", "room.xray", "room.imaging_control",
  "room.minor_procedure", "room.ultrasound", "room.ct", "room.phlebotomy",
  "room.evs_closet", "room.endoscopy", "room.periop_recovery", "room.training",
  "room.coffee_kiosk", "room.glp1_telehealth_suite",
] as const;

test.beforeAll(() => mkdirSync("artifacts/screenshots", { recursive: true }));

test("renders every canonical enclosed room in controlled 100% production review captures", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Capture controlled desktop review evidence.");
  // A wide native-resolution viewport preserves the map's actual 100% player
  // zoom while keeping each room large enough for visual art inspection.
  await page.setViewportSize({ width: 2880, height: 1400 });
  await startClinic(page, "Canonical Room Reviewer", "Canonical Room Clinic");
  await installLevelTwoVisualState(page);
  const state = await getActiveState(page);
  const definitions = new Set((state.rooms as Array<{ roomDefinitionId: string }>).map((room) => room.roomDefinitionId));
  for (const definitionId of enclosedRoomIds) expect(definitions.has(definitionId)).toBe(true);
  expect(definitions.has("room.hallway")).toBe(true);
  const canvas = page.getByTestId("facility-canvas");
  await expect(canvas).toBeVisible();
  const canvasBox = await canvas.boundingBox();
  if (!canvasBox) throw new Error("Facility canvas bounds are unavailable.");
  // The persisted Level 2 fixture runs from x=8 through x=58. Pan the real
  // camera (without CSS scaling or zoom controls) to inspect both halves at
  // the displayed 100% scale; a downward drag keeps the north room row clear
  // of the HUD rather than reducing its size.
  await page.mouse.move(canvasBox.x + canvasBox.width * 0.5, canvasBox.y + canvasBox.height * 0.45);
  await page.mouse.down();
  await page.mouse.move(canvasBox.x + canvasBox.width * 0.74, canvasBox.y + canvasBox.height * 0.77, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(120);
  await page.screenshot({
    path: "artifacts/screenshots/canonical-enclosed-room-100-left-desktop.png",
    animations: "disabled",
  });
  await page.mouse.move(canvasBox.x + canvasBox.width * 0.74, canvasBox.y + canvasBox.height * 0.77);
  await page.mouse.down();
  await page.mouse.move(canvasBox.x + canvasBox.width * 0.26, canvasBox.y + canvasBox.height * 0.77, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(120);
  await page.screenshot({
    path: "artifacts/screenshots/canonical-enclosed-room-100-right-desktop.png",
    animations: "disabled",
  });
});
