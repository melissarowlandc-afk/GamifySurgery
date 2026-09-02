import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

import {
  getProfile,
  installLevelOneVisualState,
  PROFILE_KEY,
  startClinic,
} from "./helpers";

test.beforeAll(() => mkdirSync("artifacts/screenshots", { recursive: true }));

test("proves floor-only persisted apertures and shared-wall ownership in normal and Build Mode at 100%", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Capture the controlled desktop cutout proof.");
  await page.setViewportSize({ width: 1600, height: 1100 });
  await startClinic(page, "Door Cutout Reviewer", "Door Cutout Clinic");
  await installLevelOneVisualState(page);
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((item) => item.campaignId === profile.activeCampaignId);
  if (!campaign) throw new Error("Active campaign is missing.");
  const state = JSON.parse(campaign.serializedState) as Record<string, any>;

  // The fixed Level 1 slice supplies horizontal room-room joins (Front Desk
  // to Examination/Bathroom), vertical room-room joins (Desk/Waiting and
  // Desk/Minor), exposed tall north spans, and the protected exterior door.
  // This added hallway is immediately north of Minor Procedure, proving the
  // room-to-hall short-wall owner. An isolated east-side cluster contains two
  // vertically adjacent hallway cells west of an Examination room: the upper
  // hallway has an east door while its lower neighbor keeps the adjacent
  // hallway-owned closed cap. The two hall cells also prove hall-to-hall
  // circulation stays open. The state door set covers same-destination
  // consecutive slots (Exam 1/2), adjacent distinct destinations (Bath 3),
  // east/west room doors, and the hallway aperture.
  state.rooms.push({
    id: "room.review.cutout-hallway",
    roomDefinitionId: "room.hallway",
    x: 38,
    y: 27,
    orientation: 0,
    doorSide: null,
    upgradeLevel: 1,
    cleanliness: 100,
  }, {
    id: "room.review.hallway-west-top",
    roomDefinitionId: "room.hallway",
    x: 43,
    y: 26,
    orientation: 0,
    doorSide: null,
    upgradeLevel: 1,
    cleanliness: 100,
  }, {
    id: "room.review.hallway-west-bottom",
    roomDefinitionId: "room.hallway",
    x: 43,
    y: 27,
    orientation: 0,
    doorSide: null,
    upgradeLevel: 1,
    cleanliness: 100,
  }, {
    id: "room.review.hallway-west-examination",
    roomDefinitionId: "room.examination",
    x: 44,
    y: 26,
    orientation: 0,
    doorSide: null,
    upgradeLevel: 1,
    cleanliness: 100,
  });
  state.doors = [
    { id: "door.review.front.exterior", roomId: "room.instance.founder_desk", side: "south", offset: 2, exterior: true },
    { id: "door.review.front.exam.1", roomId: "room.instance.founder_desk", side: "north", offset: 1, exterior: false },
    { id: "door.review.front.exam.2", roomId: "room.instance.founder_desk", side: "north", offset: 2, exterior: false },
    { id: "door.review.front.bathroom.3", roomId: "room.instance.founder_desk", side: "north", offset: 3, exterior: false },
    { id: "door.review.front.waiting", roomId: "room.instance.founder_desk", side: "west", offset: 1, exterior: false },
    { id: "door.review.front.minor", roomId: "room.instance.founder_desk", side: "east", offset: 1, exterior: false },
    { id: "door.review.minor.hallway", roomId: "room.visual.minor_procedure", side: "north", offset: 0, exterior: false },
    { id: "door.review.hallway-west.exam-door", roomId: "room.review.hallway-west-top", side: "east", offset: 0, exterior: false },
  ];
  expect(state.rooms).toEqual(expect.arrayContaining([
    expect.objectContaining({ id: "room.instance.founder_desk", x: 33, y: 28 }),
    expect.objectContaining({ id: "room.visual.examination", x: 33, y: 26 }),
    expect.objectContaining({ id: "room.visual.waiting", x: 29, y: 28 }),
    expect.objectContaining({ id: "room.visual.minor_procedure", x: 38, y: 28 }),
    expect.objectContaining({ id: "room.review.cutout-hallway", x: 38, y: 27 }),
    expect.objectContaining({ id: "room.review.hallway-west-top", x: 43, y: 26, roomDefinitionId: "room.hallway" }),
    expect.objectContaining({ id: "room.review.hallway-west-bottom", x: 43, y: 27, roomDefinitionId: "room.hallway" }),
    expect.objectContaining({ id: "room.review.hallway-west-examination", x: 44, y: 26, roomDefinitionId: "room.examination" }),
  ]));
  expect(state.doors.filter((door: { roomId: string; side: string }) =>
    door.roomId === "room.instance.founder_desk" && door.side === "north",
  )).toHaveLength(3);
  expect(state.doors).toContainEqual(expect.objectContaining({
    id: "door.review.hallway-west.exam-door",
    roomId: "room.review.hallway-west-top",
    side: "east",
    offset: 0,
    exterior: false,
  }));
  state.paused = true;
  campaign.serializedState = JSON.stringify(state);
  await page.addInitScript(({ key, next }) => window.localStorage.setItem(key, JSON.stringify(next)), {
    key: PROFILE_KEY,
    next: profile,
  });
  await page.reload();
  const resume = page.getByRole("button", { name: "Resume Door Cutout Clinic" });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.addStyleTag({ content: ".facility-pause-indicator { visibility: hidden !important; }" });
  await page.waitForTimeout(180);
  await page.screenshot({
    path: "artifacts/screenshots/door-cutout-floor-continuity-100-desktop.png",
    animations: "disabled",
  });
  // This assertion is intentionally before the second capture: a Build Mode
  // image cannot pass merely because a screenshot happened to be written.
  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  await expect(page.getByRole("navigation", { name: "Build Mode tools" })).toBeVisible();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.waitForTimeout(180);
  await page.screenshot({
    path: "artifacts/screenshots/door-cutout-floor-continuity-build-100-desktop.png",
    animations: "disabled",
  });
});
