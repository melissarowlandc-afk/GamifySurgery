import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

import {
  getProfile,
  installLevelOneVisualState,
  PROFILE_KEY,
  startClinic,
} from "./helpers";

test.beforeAll(() => mkdirSync("artifacts/screenshots", { recursive: true }));

test("renders short backed north walls, partial joins, a live door gap, and open hallway circulation at 100%", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Capture controlled desktop backed-wall evidence.");
  await page.setViewportSize({ width: 1600, height: 1100 });
  await startClinic(page, "Backed Wall Reviewer", "Backed Wall Clinic");
  await installLevelOneVisualState(page);
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((item) => item.campaignId === profile.activeCampaignId);
  if (!campaign) throw new Error("Active campaign is missing.");
  const state = JSON.parse(campaign.serializedState) as Record<string, any>;
  // This production-shaped slice keeps the Front Desk backed by Examination
  // and Bathroom, adds a real one-cell hallway north of Minor Procedure for
  // its partial hallway-backed edge, and retains the ordinary X-ray/Control
  // partial northern join from the visual fixture.
  state.rooms.push({
    id: "hallway.review.minor-procedure.north",
    roomDefinitionId: "room.hallway",
    x: 39,
    y: 27,
    orientation: 0,
    doorSide: null,
    upgradeLevel: 1,
    cleanliness: 100,
  });
  state.doors = (state.doors ?? []).filter((door: { roomId: string }) =>
    door.roomId !== "room.instance.founder_desk",
  );
  state.doors.push({
    id: "door.review.front-desk.backed-north",
    roomId: "room.instance.founder_desk",
    side: "north",
    offset: 1,
    exterior: false,
  });
  state.paused = true;
  campaign.serializedState = JSON.stringify(state);
  await page.addInitScript(({ key, next }) => window.localStorage.setItem(key, JSON.stringify(next)), {
    key: PROFILE_KEY,
    next: profile,
  });
  await page.reload();
  const resume = page.getByRole("button", { name: "Resume Backed Wall Clinic" });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.addStyleTag({ content: ".facility-pause-indicator { visibility: hidden !important; }" });
  await page.waitForTimeout(180);
  await page.screenshot({
    path: "artifacts/screenshots/backed-north-room-walls-100-desktop.png",
    animations: "disabled",
  });
});
