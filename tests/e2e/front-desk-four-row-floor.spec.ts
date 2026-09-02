import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

import {
  getProfile,
  installLevelOneVisualState,
  PROFILE_KEY,
  startClinic,
} from "./helpers";

test.beforeAll(() => mkdirSync("artifacts/screenshots", { recursive: true }));

test("renders the Front Desk's full 5x4 Build Mode floor and destination-aware north doors at 100%", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Capture the controlled desktop Build Mode proof.");
  await page.setViewportSize({ width: 1600, height: 1100 });
  await startClinic(page, "Front Desk Tile Reviewer", "Front Desk Tile Clinic");
  await installLevelOneVisualState(page);
  // Phase A leaves the protected D3 exterior entrance as the only Front Desk
  // door, so Place Door can visibly expose the exact remaining candidates.
  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  await expect(page.getByRole("navigation", { name: "Build Mode tools" })).toBeVisible();
  await page.getByRole("button", { name: "Place Door" }).click();
  await page.addStyleTag({ content: ".facility-pause-indicator { visibility: hidden !important; }" });
  await page.waitForTimeout(180);
  await page.screenshot({
    path: "artifacts/screenshots/front-desk-four-row-floor-build-candidates-100-desktop.png",
    animations: "disabled",
  });

  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((item) => item.campaignId === profile.activeCampaignId);
  if (!campaign) throw new Error("Active campaign is missing.");
  const state = JSON.parse(campaign.serializedState) as Record<string, any>;
  // Offsets 1/2 both enter Examination (one wide opening); offset 3 enters
  // Bathroom (a distinct neighboring destination and therefore a separate jamb).
  state.doors = (state.doors ?? []).filter((door: { roomId: string; exterior: boolean }) =>
    door.roomId !== "room.instance.founder_desk" || door.exterior,
  );
  expect(state.doors).toContainEqual(expect.objectContaining({
    roomId: "room.instance.founder_desk", side: "south", offset: 2, exterior: true,
  }));
  state.doors.push(
    { id: "door.review.front-desk.exam.1", roomId: "room.instance.founder_desk", side: "north", offset: 1, exterior: false },
    { id: "door.review.front-desk.exam.2", roomId: "room.instance.founder_desk", side: "north", offset: 2, exterior: false },
    { id: "door.review.front-desk.bath.3", roomId: "room.instance.founder_desk", side: "north", offset: 3, exterior: false },
    { id: "door.review.front-desk.east.1", roomId: "room.instance.founder_desk", side: "east", offset: 1, exterior: false },
    { id: "door.review.front-desk.west.1", roomId: "room.instance.founder_desk", side: "west", offset: 1, exterior: false },
  );
  state.paused = true;
  campaign.serializedState = JSON.stringify(state);
  await page.evaluate(({ key, next }) => window.localStorage.setItem(key, JSON.stringify(next)), {
    key: PROFILE_KEY,
    next: profile,
  });
  const doorProof = await page.context().newPage();
  await doorProof.setViewportSize({ width: 1600, height: 1100 });
  await doorProof.goto("/?prototype-tools=0");
  const resume = doorProof.getByRole("button", { name: "Resume Front Desk Tile Clinic" });
  if (await resume.isVisible()) await resume.click();
  await expect(doorProof.getByTestId("facility-canvas")).toBeVisible();
  await doorProof.addStyleTag({ content: ".facility-pause-indicator { visibility: hidden !important; }" });
  await doorProof.waitForTimeout(180);
  await doorProof.screenshot({
    path: "artifacts/screenshots/front-desk-four-row-floor-door-runs-100-desktop.png",
    animations: "disabled",
  });
  await doorProof.close();
});
