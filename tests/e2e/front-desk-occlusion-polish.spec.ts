import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import {
  getProfile,
  installLevelOneVisualState,
  PROFILE_KEY,
  startClinic,
} from "./helpers";

const SCREENSHOTS = "artifacts/screenshots";

test.beforeAll(() => mkdirSync(SCREENSHOTS, { recursive: true }));

async function openFixture(page: Page): Promise<void> {
  await startClinic(page, "Front Desk Polish Founder", "Front Desk Polish Clinic");
  await installLevelOneVisualState(page);
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((item) => item.campaignId === profile.activeCampaignId);
  if (!campaign) throw new Error("Active campaign is missing.");
  const state = JSON.parse(campaign.serializedState) as Record<string, any>;
  state.doors = (state.doors ?? []).filter((door: { roomId: string; side: string }) =>
    !(door.roomId === "room.instance.founder_desk" && door.side === "north"),
  );
  state.doors.push({
    id: "door.polish.front-desk.north", roomId: "room.instance.founder_desk",
    side: "north", offset: 1, exterior: false,
  });
  state.paused = true;
  campaign.serializedState = JSON.stringify(state);
  await page.addInitScript(({ key, next }) => window.localStorage.setItem(key, JSON.stringify(next)), {
    key: PROFILE_KEY, next: profile,
  });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: "Resume Front Desk Polish Clinic" });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.waitForFunction(() => typeof (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGaitSnapshot === "function");
  await page.addStyleTag({ content: ".facility-pause-indicator { visibility: hidden !important; }" });
}

async function poseFounder(page: Page, location: { x: number; y: number }, direction: string): Promise<any> {
  return page.evaluate(({ location, direction }) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    Object.assign(scene.bridge.viewModel.founder, {
      location, path: [], pathIndex: 0, moving: false, direction, activityLabel: undefined,
    });
    scene.bridge.viewModel.paused = true;
    scene.routeMotionTracks.clear();
    scene.update(0, 0);
    const actor = scene.characterBitmapContainers.get("character:founder").getByName("actor");
    return {
      gait: host.__facilityGaitSnapshot()["character:founder"],
      source: { cutX: actor.frame.cutX, cutY: actor.frame.cutY, cutWidth: actor.frame.cutWidth, cutHeight: actor.frame.cutHeight },
      visible: actor.visible,
    };
  }, { location, direction });
}

test("proves Front Desk actor scale, full counter crop, doorway cutout, and structural wall occlusion", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Capture controlled desktop Front Desk occlusion evidence.");
  await page.setViewportSize({ width: 1600, height: 1100 });
  await openFixture(page);
  const facility = page.getByTestId("facility-canvas");

  const seated = await poseFounder(page, { x: 35, y: 29 }, "front");
  expect(seated.gait).toMatchObject({ visible: true, pose: "seated", direction: "front", originY: 181 / 192 });
  expect(seated.source).toMatchObject({ cutWidth: 128, cutHeight: 192 });
  await facility.screenshot({ path: `${SCREENSHOTS}/front-desk-founder-seated-100-desktop.png`, animations: "disabled" });

  // C4 is open floor beside the counter, so the captured feet are not hidden
  // by furniture while the renderer still uses the Front Desk room scale.
  const standingFront = await poseFounder(page, { x: 36, y: 30 }, "front");
  expect(standingFront.gait).toMatchObject({ visible: true, pose: "idle", direction: "front", originY: 181 / 192 });
  expect(standingFront.source).toMatchObject({ cutWidth: 128, cutHeight: 192 });
  expect(standingFront.gait.displayWidth).toBe(seated.gait.displayWidth);
  expect(standingFront.gait.displayHeight).toBe(seated.gait.displayHeight);
  await facility.screenshot({ path: `${SCREENSHOTS}/front-desk-founder-standing-front-100-desktop.png`, animations: "disabled" });

  const standingSide = await poseFounder(page, { x: 36, y: 30 }, "left");
  expect(standingSide.gait).toMatchObject({ visible: true, pose: "idle", direction: "left", originY: 181 / 192 });
  expect(standingSide.source).toMatchObject({ cutWidth: 128, cutHeight: 192 });
  await facility.screenshot({ path: `${SCREENSHOTS}/front-desk-founder-standing-side-100-desktop.png`, animations: "disabled" });

  const live = await page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    scene.update(0, 0);
    const entries = [...scene.fixtureBitmapImages.entries()].map(([key, image]: [string, any]) => ({
      key, depth: image.depth, x: image.x, y: image.y, width: image.displayWidth, height: image.displayHeight,
      cutX: image.frame.cutX, cutY: image.frame.cutY, cutWidth: image.frame.cutWidth, cutHeight: image.frame.cutHeight,
      visible: image.visible,
    }));
    const structural = entries.filter((entry) => entry.key.includes("-occluder:"));
    const frontDeskNorthStructural = structural.filter((entry) =>
      entry.key.includes("front-desk-v5:") &&
      (entry.key.includes("north-wall-") || entry.key.includes("north-short-")),
    );
    const frontDeskNorthBase = entries.filter((entry) =>
      entry.key.includes("front-desk-v5:") &&
      (entry.key.includes("north-wall-") || entry.key.includes("north-short-")) &&
      !entry.key.includes("-occluder:"),
    );
    const counter = entries.find((entry) =>
      entry.cutX === 476 && entry.cutY === 78 && entry.cutWidth === 520 && entry.cutHeight === 314,
    );
    const decor = entries.filter((entry) => entry.key.includes("front-desk-v5:decor:"));
    const wallDecor = [...scene.wallDecorGraphics.entries()].map(([key, graphics]: [string, any]) => ({
      key, depth: graphics.depth, visible: graphics.visible,
    }));
    return { entries, structural, frontDeskNorthStructural, frontDeskNorthBase, counter, decor, wallDecor, actorDepth: scene.characterBitmapContainers.get("character:founder").depth };
  });
  expect(live.counter).toMatchObject({ cutX: 476, cutY: 78, cutWidth: 520, cutHeight: 314, visible: true });
  expect(live.structural.length).toBeGreaterThanOrEqual(4);
  // Only side/south copies are foreground; north walls stay behind contents.
  expect(live.structural.filter((entry: any) => entry.depth > live.actorDepth).length).toBeGreaterThanOrEqual(4);
  // This fully backed north run deliberately has no tall-wall decor slot.
  expect(live.decor).toEqual([]);
  // Other Level 1 rooms exercise the wall-band generic decor layer, above
  // base north walls but below sortable furniture and characters.
  expect(live.wallDecor.length).toBeGreaterThan(0);
  expect(live.wallDecor.every((entry: any) => entry.visible && entry.depth < live.actorDepth)).toBe(true);
  expect(live.frontDeskNorthBase.length).toBeGreaterThan(0);
  expect(live.frontDeskNorthBase.every((entry: any) => entry.depth < live.actorDepth)).toBe(true);
  expect(live.frontDeskNorthStructural).toEqual([]);
  await facility.screenshot({ path: `${SCREENSHOTS}/front-desk-occlusion-normal-100-desktop.png`, animations: "disabled" });

  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  await expect(page.getByRole("navigation", { name: "Build Mode tools" })).toBeVisible();
  await facility.screenshot({ path: `${SCREENSHOTS}/front-desk-occlusion-build-100-desktop.png`, animations: "disabled" });
});
