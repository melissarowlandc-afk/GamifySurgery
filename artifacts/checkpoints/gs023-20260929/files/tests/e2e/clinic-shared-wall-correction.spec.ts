import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

import { getActiveState, getProfile, PROFILE_KEY, startClinic } from "./helpers";

const CAPTURE_STAGE = process.env.WALL_CAPTURE_STAGE ?? "after";
const SCREENSHOTS = `.local-dev/clinic-playtest-walls/${CAPTURE_STAGE}`;

test.beforeAll(() => mkdirSync(SCREENSHOTS, { recursive: true }));

test("approved north/south neighbors retain one southern short wall", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Controlled private capture of shared approved-room walls.");
  await page.setViewportSize({ width: 1600, height: 1100 });
  await startClinic(page, "Shared Wall Reviewer", "Shared Wall Clinic");

  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((item) => item.campaignId === profile.activeCampaignId);
  if (!campaign) throw new Error("Active campaign is missing.");
  const state = (await getActiveState(page)) as Record<string, any>;
  Object.assign(state, {
    paused: true,
    facilityLevel: 2,
    nextRoutineArrivalTick: Number.MAX_SAFE_INTEGER,
    serviceAppointmentsEnabled: false,
    rooms: [
      // Complete adjacency, then partial adjacency (offset zero stays exposed).
      { id: "wall.full.north", roomDefinitionId: "room.minor_procedure", x: 5, y: 5, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "wall.full.south", roomDefinitionId: "room.minor_procedure", x: 5, y: 8, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "wall.partial.north", roomDefinitionId: "room.minor_procedure", x: 11, y: 5, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "wall.partial.south", roomDefinitionId: "room.minor_procedure", x: 12, y: 8, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      // Endoscopy's supported rotated footprint exercises the same ownership rule.
      { id: "wall.rotated.north", roomDefinitionId: "room.endoscopy", x: 18, y: 5, orientation: 270, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "wall.rotated.south", roomDefinitionId: "room.endoscopy", x: 18, y: 9, orientation: 270, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ],
    doors: [],
  });
  campaign.name = "Shared Wall Clinic";
  campaign.serializedState = JSON.stringify(state);
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ key, value }) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: PROFILE_KEY, value: profile });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: "Resume Shared Wall Clinic" });
  if (await resume.isVisible()) await resume.click();
  const canvas = page.getByTestId("facility-canvas");
  await expect(canvas).toBeVisible();
  await page.waitForFunction(() => Boolean((document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame?.scene?.getScene("facility-scene")));
  await page.addStyleTag({ content: ".facility-pause-indicator { visibility: hidden !important; }" });
  await page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    const room = scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === "wall.partial.north");
    const layout = scene.layout;
    scene.applyCamera({ ...scene.cameraView, panX: 0, panY: 0 });
    scene.applyCamera({
      ...scene.cameraView,
      panX: scene.scale.width / 2 - (layout.originX + (room.tileX + 5) * layout.tileSize),
      panY: scene.scale.height / 2 - (layout.originY + (room.tileY + 3) * layout.tileSize),
    });
    scene.refreshLayout(true);
  });
  await page.screenshot({
    path: `${SCREENSHOTS}/approved-shared-walls-${CAPTURE_STAGE}.png`,
    animations: "disabled",
  });

  const backedSouth = await page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    return Object.fromEntries(["wall.full.north", "wall.partial.north", "wall.rotated.north"].map((id) => {
      const room = scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === id);
      return [id, [...scene.getBackedHorizontalOffsets(room, "south")]];
    }));
  });
  expect(backedSouth).toEqual({
    "wall.full.north": [0, 1, 2],
    "wall.partial.north": [1, 2],
    "wall.rotated.north": [0, 1, 2],
  });

});
