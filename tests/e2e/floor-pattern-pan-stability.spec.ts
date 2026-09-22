import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import {
  getProfile,
  installLevelOneVisualState,
  PROFILE_KEY,
  startClinic,
} from "./helpers";

const SCREENSHOTS = "artifacts/screenshots";
const ROOM_IDS = [
  "proof.exam.horizontal",
  "proof.exam.vertical",
  "proof.waiting",
  "proof.xray",
] as const;

type LiveSprite = {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tilePositionX: number;
  tilePositionY: number;
  tileScaleX: number;
  tileScaleY: number;
  visible: boolean;
};

type SurfaceSnapshot = {
  originX: number;
  originY: number;
  tileSize: number;
  sprites: LiveSprite[];
  sidewalkPatch: number[];
  hallwayPatch: number[];
};

test.beforeAll(() => mkdirSync(SCREENSHOTS, { recursive: true }));

async function installFloorFixture(page: Page): Promise<void> {
  await startClinic(page, "Floor Phase Reviewer", "Floor Phase Clinic");
  await installLevelOneVisualState(page);
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((item) => item.campaignId === profile.activeCampaignId);
  if (!campaign) throw new Error("Active campaign is missing.");
  const state = JSON.parse(campaign.serializedState) as Record<string, any>;
  state.rooms = [
    { id: "proof.waiting", roomDefinitionId: "room.waiting", x: 28, y: 27, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "proof.xray", roomDefinitionId: "room.xray", x: 31, y: 25, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "proof.exam.horizontal", roomDefinitionId: "room.examination", x: 35, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "proof.exam.vertical", roomDefinitionId: "room.examination", x: 39, y: 25, orientation: 90, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...Array.from({ length: 15 }, (_, index) => ({
      id: `proof.hallway.${index}`,
      roomDefinitionId: "room.hallway",
      x: 27 + index,
      y: 30,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    })),
  ];
  state.doors = [];
  state.environment = {
    ...state.environment,
    founderLocation: { x: 44, y: 31 },
    founderActivity: null,
  };
  state.employees = [];
  state.encounters = {};
  state.paused = true;
  campaign.serializedState = JSON.stringify(state);
  await page.addInitScript(({ key, next }) => window.localStorage.setItem(key, JSON.stringify(next)), {
    key: PROFILE_KEY,
    next: profile,
  });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: "Resume Floor Phase Clinic" });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.waitForFunction(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    return Boolean(host?.__facilityGame?.scene?.getScene("facility-scene"));
  });
  await page.addStyleTag({ content: ".facility-pause-indicator { visibility: hidden !important; }" });
}

async function snapshotSurfaces(page: Page): Promise<SurfaceSnapshot> {
  return page.evaluate((roomIds) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    scene.bridge.viewModel.paused = true;
    scene.routeMotionTracks.clear();
    scene.update(0, 0);
    const layout = scene.layout;
    const expected = [
      "environment:sidewalk",
      ...roomIds.map((id) => `environment:floor:${id}`),
    ];
    const sprites = expected.map((key) => {
      const sprite = scene.environmentSprites.get(key);
      if (!sprite) throw new Error(`Missing environment TileSprite ${key}`);
      return {
        key,
        x: sprite.x,
        y: sprite.y,
        width: sprite.width,
        height: sprite.height,
        tilePositionX: sprite.tilePositionX,
        tilePositionY: sprite.tilePositionY,
        tileScaleX: sprite.tileScaleX,
        tileScaleY: sprite.tileScaleY,
        visible: sprite.visible,
      };
    });
    const readPatch = (x: number, y: number, width: number, height: number) => {
      const canvas = host.querySelector("canvas") as HTMLCanvasElement;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("Facility canvas has no 2D context.");
      return Array.from(context.getImageData(Math.round(x), Math.round(y), width, height).data);
    };
    // These are open, room-local pavement/plank patches. They avoid all
    // walls, curb, furniture, people, planters, and the Build grid boundaries.
    const slabWidth = Math.max(32, Math.round(layout.tileSize * 1.25));
    const sidewalkJoint = Math.round((26 * layout.tileSize) / slabWidth) * slabWidth;
    const sidewalkX = layout.originX + sidewalkJoint - 2;
    const sidewalkY = layout.sidewalkTop + 0.36 * layout.tileSize;
    const sidewalkPatch = readPatch(
      sidewalkX,
      sidewalkY,
      slabWidth + 6,
      6,
    );
    const hallwayX = layout.originX + 31.12 * layout.tileSize;
    const hallwayY = layout.originY + 30 * layout.tileSize + 3;
    const hallwayPatch = readPatch(
      hallwayX,
      hallwayY,
      Math.floor(layout.tileSize * 2.6),
      Math.max(12, Math.floor(layout.tileSize - 7)),
    );
    return {
      originX: layout.originX,
      originY: layout.originY,
      tileSize: layout.tileSize,
      sprites,
      sidewalkPatch,
      hallwayPatch,
    };
  }, ROOM_IDS);
}

function assertPanContract(before: SurfaceSnapshot, after: SurfaceSnapshot): void {
  const deltaX = after.originX - before.originX;
  const deltaY = after.originY - before.originY;
  expect([before.originX, before.originY, after.originX, after.originY].every(Number.isInteger)).toBe(true);
  expect(deltaX || deltaY).not.toBe(0);
  expect(after.tileSize).toBe(before.tileSize);
  const afterByKey = new Map(after.sprites.map((sprite) => [sprite.key, sprite]));
  for (const sprite of before.sprites) {
    const moved = afterByKey.get(sprite.key);
    expect(moved, `missing ${sprite.key} after pan`).toBeDefined();
    expect(moved).toMatchObject({ visible: true });
    expect(moved!.x - sprite.x).toBe(deltaX);
    expect(moved!.y - sprite.y).toBe(deltaY);
    expect(moved!.tilePositionX).toBe(sprite.tilePositionX);
    expect(moved!.tilePositionY).toBe(sprite.tilePositionY);
    expect(moved!.tileScaleX).toBe(sprite.tileScaleX);
    expect(moved!.tileScaleY).toBe(sprite.tileScaleY);
  }
  const expectSameCanvasPatch = (name: string, beforePatch: number[], afterPatch: number[]) => {
    expect(afterPatch).toHaveLength(beforePatch.length);
    // Phaser Graphics redraws can alter a translucent composited RGB channel
    // by one level. More than one proves a changed local material pattern.
    const channelDeltas = beforePatch.map((value, index) =>
      Math.abs(value - (afterPatch[index] ?? value)),
    );
    const maximumChannelDelta = Math.max(...channelDeltas);
    const changedChannels = channelDeltas.filter((delta) => delta > 1).length;
    expect(maximumChannelDelta, `${name} local canvas patch changed (${changedChannels} channels)`).toBeLessThanOrEqual(1);
  };
  expectSameCanvasPatch("sidewalk", before.sidewalkPatch, after.sidewalkPatch);
  expectSameCanvasPatch("hallway", before.hallwayPatch, after.hallwayPatch);
}

async function dragCamera(page: Page): Promise<void> {
  const canvas = page.locator("[data-testid='facility-canvas'] canvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("Facility canvas has no screen bounds.");
  // 53 px is intentionally not a sidewalk-slabbing multiple. The blank upper
  // left canvas is outside the fixture and room proof arrangement.
  await page.mouse.move(box.x + 110, box.y + 90);
  await page.mouse.down();
  await page.mouse.move(box.x + 163, box.y + 53, { steps: 6 });
  await page.mouse.up();
  await page.evaluate(() => new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  ));
}

test("keeps authored and procedural floor patterns fixed through real normal and Build camera drags", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Capture one deterministic desktop Chrome canvas proof.");
  await page.setViewportSize({ width: 1600, height: 1100 });
  await installFloorFixture(page);
  const facility = page.getByTestId("facility-canvas");

  const normalBefore = await snapshotSurfaces(page);
  await dragCamera(page);
  const normalAfter = await snapshotSurfaces(page);
  assertPanContract(normalBefore, normalAfter);
  await facility.screenshot({ path: `${SCREENSHOTS}/floor-pattern-pan-normal-100-desktop.png`, animations: "disabled" });

  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  await expect(page.getByRole("navigation", { name: "Build Mode tools" })).toBeVisible();
  await page.waitForFunction(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    return Boolean(host?.__facilityGame?.scene?.getScene("facility-scene"));
  });
  const buildBefore = await snapshotSurfaces(page);
  await dragCamera(page);
  const buildAfter = await snapshotSurfaces(page);
  assertPanContract(buildBefore, buildAfter);
  await page.getByTestId("facility-canvas").screenshot({ path: `${SCREENSHOTS}/floor-pattern-pan-build-100-desktop.png`, animations: "disabled" });
});
