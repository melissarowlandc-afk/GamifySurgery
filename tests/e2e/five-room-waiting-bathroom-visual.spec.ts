import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import {
  getProfile,
  installLevelOneVisualState,
  PROFILE_KEY,
  startClinic,
} from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

async function installWaitingBathroomCaptureState(
  source: Page,
  orientation: 0 | 90,
  exactNorthDoorConflict = false,
): Promise<Page> {
  const profile = await getProfile(source);
  const active = profile.campaigns.find((campaign) => campaign.campaignId === profile.activeCampaignId);
  if (!active) throw new Error("Active campaign is missing.");
  const state = JSON.parse(active.serializedState) as {
    paused?: boolean;
    rooms: Array<{ id: string; orientation: number }>;
    doors?: Array<{ id: string; roomId: string; side: string; offset: number; exterior: boolean }>;
  };
  const waiting = state.rooms.find((room) => room.id === "room.visual.waiting");
  const bathroom = state.rooms.find((room) => room.id === "room.visual.bathroom");
  if (!waiting || !bathroom) throw new Error("Waiting/Bathroom visual rooms are missing.");
  waiting.orientation = orientation;
  // Start both normal captures without a north opening so the north-wall
  // pieces can be inspected as actual wall-mounted decoration.
  state.doors = (state.doors ?? []).filter((door) =>
    door.roomId !== "room.visual.waiting" && door.roomId !== "room.visual.bathroom",
  );
  if (exactNorthDoorConflict) {
    // Live persisted north doors occupy the exact board/mirror cells and
    // prove whole-art suppression in the production scene.
    state.doors.push(
      { id: "door.visual.waiting.north-art", roomId: "room.visual.waiting", side: "north", offset: 1, exterior: false },
      { id: "door.visual.bathroom.north-mirror", roomId: "room.visual.bathroom", side: "north", offset: 0, exterior: false },
      { id: "door.visual.xray.north-marker", roomId: "room.visual.xray", side: "north", offset: 1, exterior: false },
      { id: "door.visual.control.north-display", roomId: "room.visual.imaging_control", side: "north", offset: 1, exterior: false },
      { id: "door.visual.procedure.north-sign", roomId: "room.visual.minor_procedure", side: "north", offset: 1, exterior: false },
    );
  }
  state.paused = true;
  active.serializedState = JSON.stringify(state);
  await source.evaluate(({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)), {
    key: PROFILE_KEY,
    value: profile,
  });

  const capture = await source.context().newPage();
  await capture.setViewportSize({ width: 1440, height: 1000 });
  await capture.goto("/?prototype-tools=0");
  const resume = capture.getByRole("button", { name: "Resume Vale Surgical Clinic" });
  if (await resume.isVisible()) await resume.click();
  await expect(capture.getByTestId("facility-canvas")).toBeVisible();
  await capture.addStyleTag({ content: ".facility-pause-indicator { visibility: hidden !important; }" });
  await capture.waitForTimeout(180);
  return capture;
}

test.beforeAll(() => mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true }));

test("renders normal north-wall decor plus an exact north-door suppression proof for Waiting and Bathroom", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Capture one controlled actual-app desktop proof.");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await startClinic(page, "Dr. Rowan Vale", "Vale Surgical Clinic");
  await installLevelOneVisualState(page);

  const horizontalNormal = await installWaitingBathroomCaptureState(page, 0);
  await horizontalNormal.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/five-room-waiting-bathroom-100-horizontal-normal.png`,
    animations: "disabled",
  });
  const verticalNormal = await installWaitingBathroomCaptureState(page, 90);
  await verticalNormal.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/five-room-waiting-bathroom-100-vertical-normal.png`,
    animations: "disabled",
  });
  const conflict = await installWaitingBathroomCaptureState(page, 0, true);
  await conflict.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/five-room-waiting-bathroom-100-horizontal-north-door.png`,
    animations: "disabled",
  });
  await horizontalNormal.close();
  await verticalNormal.close();
  await conflict.close();
});

test("renders normal and exact-conflict X-ray, Imaging Control, and Minor Procedure evidence", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Capture one controlled actual-app desktop proof.");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await startClinic(page, "Dr. Rowan Vale", "Vale Surgical Clinic");
  await installLevelOneVisualState(page);

  const normal = await installWaitingBathroomCaptureState(page, 0);
  await normal.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/five-room-clinical-100-normal.png`,
    animations: "disabled",
  });
  await normal.getByRole("button", { name: "Enter Build Mode" }).click();
  const placeDoor = normal.getByRole("button", { name: "Place Door" });
  await expect(placeDoor).toBeVisible();
  await placeDoor.evaluate((button) => (button as HTMLButtonElement).click());
  await expect(placeDoor).toHaveAttribute("aria-pressed", "true");
  await normal.waitForTimeout(160);
  await normal.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/five-room-clinical-100-door-zones.png`,
    animations: "disabled",
  });
  const conflict = await installWaitingBathroomCaptureState(page, 0, true);
  await conflict.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/five-room-clinical-100-north-door-conflicts.png`,
    animations: "disabled",
  });
  await normal.close();
  await conflict.close();
});
