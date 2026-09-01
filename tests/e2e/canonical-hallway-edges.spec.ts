import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

import {
  getProfile,
  installLevelTwoVisualState,
  PROFILE_KEY,
  startClinic,
} from "./helpers";

test.beforeAll(() => mkdirSync("artifacts/screenshots", { recursive: true }));

test("renders open Level 2 hallway edges in the canonical component grammar at 100%", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Capture controlled desktop hallway evidence.");
  await page.setViewportSize({ width: 1600, height: 1100 });
  await startClinic(page, "Hallway Reviewer", "Hallway Review Clinic");
  await installLevelTwoVisualState(page);
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((item) => item.campaignId === profile.activeCampaignId);
  if (!campaign) throw new Error("Active campaign is missing.");
  const state = JSON.parse(campaign.serializedState) as Record<string, any>;
  const founder = state.rooms.find((room: { id: string }) => room.id === "room.instance.founder_desk");
  if (!founder) throw new Error("Founder room is missing.");
  // A production-persisted review slice: three connected hallway cells keep
  // their internal edges open; the two end caps expose east/west, their north
  // edge is fully exposed, and the left cell keeps a genuine shallow south lip.
  state.rooms = [
    founder,
    { id: "hallway.review.west", roomDefinitionId: "room.hallway", x: 39, y: 27, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "hallway.review.center", roomDefinitionId: "room.hallway", x: 40, y: 27, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "hallway.review.east", roomDefinitionId: "room.hallway", x: 41, y: 27, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
  ];
  state.doors = [
    { id: "door.review.exterior", roomId: founder.id, side: "south", offset: 2, exterior: true },
    { id: "door.review.hall", roomId: founder.id, side: "north", offset: 0, exterior: false },
  ];
  state.employees = (state.employees ?? []).slice(0, 1).map((employee: Record<string, any>) => ({
    ...employee, homeRoomInstanceId: founder.id, location: { x: 40, y: 27 }, path: [], pathIndex: 0,
  }));
  state.paused = true;
  campaign.serializedState = JSON.stringify(state);
  await page.addInitScript(({ key, next }) => window.localStorage.setItem(key, JSON.stringify(next)), {
    key: PROFILE_KEY, next: profile,
  });
  await page.reload();
  const resume = page.getByRole("button", { name: "Resume Hallway Review Clinic" });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.addStyleTag({ content: ".facility-pause-indicator { visibility: hidden !important; }" });
  await page.screenshot({
    path: "artifacts/screenshots/canonical-hallway-100-edges-desktop.png",
    animations: "disabled",
  });
});
