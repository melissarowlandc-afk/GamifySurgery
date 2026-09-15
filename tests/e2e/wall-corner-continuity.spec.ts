import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { getProfile, installLevelOneVisualState, PROFILE_KEY, startClinic } from "./helpers";

test.beforeAll(() => mkdirSync("artifacts/screenshots", { recursive: true }));

test("proves shared tall corners, backed corners, and door gaps in normal and Build mode", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Controlled desktop wall-continuity evidence.");
  await page.setViewportSize({ width: 1600, height: 1100 });
  await startClinic(page, "Wall Corner Reviewer", "Wall Corner Clinic");
  await installLevelOneVisualState(page);
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((item) => item.campaignId === profile.activeCampaignId)!;
  const state = JSON.parse(campaign.serializedState) as Record<string, any>;
  state.rooms = [
    { id: "room.proof.front-desk", roomDefinitionId: "room.front_desk", x: 33, y: 28, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.proof.exam-horizontal", roomDefinitionId: "room.examination", x: 39, y: 28, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.proof.exam-vertical", roomDefinitionId: "room.examination", x: 43, y: 27, orientation: 90, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.proof.backed", roomDefinitionId: "room.waiting", x: 28, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "hallway.proof.backed-northwest", roomDefinitionId: "room.hallway", x: 28, y: 25, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.proof.corner-door", roomDefinitionId: "room.waiting", x: 28, y: 30, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
  ];
  state.doors = [
    { id: "door.proof.front.south", roomId: "room.proof.front-desk", side: "south", offset: 2, exterior: true },
    { id: "door.proof.corner.north", roomId: "room.proof.corner-door", side: "north", offset: 0, exterior: false },
    { id: "door.proof.corner.west", roomId: "room.proof.corner-door", side: "west", offset: 0, exterior: false },
  ];
  state.environment = { ...state.environment, founderLocation: { x: 36, y: 30 }, founderActivity: null };
  state.paused = true; campaign.serializedState = JSON.stringify(state);
  await page.addInitScript(({ key, next }) => window.localStorage.setItem(key, JSON.stringify(next)), { key: PROFILE_KEY, next: profile });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: "Resume Wall Corner Clinic" }); if (await resume.isVisible()) await resume.click();
  const facility = page.getByTestId("facility-canvas"); await expect(facility).toBeVisible();
  await page.addStyleTag({ content: ".facility-pause-indicator { visibility: hidden !important; }" });
  const readLiveProof = () => page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any; const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    scene.bridge.viewModel.paused = true;
    Object.assign(scene.bridge.viewModel.founder, { location: { x: 36, y: 30 }, moving: false, direction: "front", path: [], pathIndex: 0 }); scene.routeMotionTracks.clear(); scene.update(0, 0);
    const images = [...scene.fixtureBitmapImages.entries()].map(([key, image]: [string, any]) => ({ key, x: image.x, y: image.y, width: image.displayWidth, height: image.displayHeight, depth: image.depth, visible: image.visible }));
    const room = (id: string) => images.filter((item) => item.key.includes(id));
    const decor = [...scene.wallDecorGraphics.entries()].map(([key, graphics]: [string, any]) => ({ key, depth: graphics.depth, visible: graphics.visible }));
    const rect = (x: number, y: number, width: number, height: number) => ({ x: scene.layout.originX + x * scene.layout.tileSize, y: scene.layout.originY + y * scene.layout.tileSize, width: width * scene.layout.tileSize, height: height * scene.layout.tileSize });
    return { front: room("room.proof.front-desk"), horizontal: room("room.proof.exam-horizontal"), vertical: room("room.proof.exam-vertical"), backed: room("room.proof.backed"), corner: room("room.proof.corner-door"), decor, founderDepth: scene.characterBitmapContainers.get("character:founder").depth, rects: { front: rect(33, 28, 5, 4), horizontal: rect(39, 28, 3, 2), vertical: rect(43, 27, 2, 3), backed: rect(28, 26, 4, 3), corner: rect(28, 30, 4, 3) } };
  });
  const assertLiveContract = (proof: Awaited<ReturnType<typeof readLiveProof>>) => {
    const component = (set: any[], fragment: string) => set.find((item) => item.key.includes(fragment));
    const top = (item: any) => item.y - item.height / 2;
    const left = (item: any) => item.x - item.width / 2;
    const shell = (set: any[], rectangle: { x: number; y: number; width: number; height: number }) => {
      const west = component(set, "west-return-0"); const east = component(set, "east-return-0"); const north = component(set, "north-wall-0");
      expect(west).toBeDefined(); expect(east).toBeDefined(); expect(north).toBeDefined();
      return { west, east, north, floorTop: rectangle.y, floorHeight: rectangle.height };
    };
    const front = shell(proof.front, proof.rects.front); const horizontal = shell(proof.horizontal, proof.rects.horizontal); const vertical = shell(proof.vertical, proof.rects.vertical);
    for (const room of [front, horizontal, vertical]) {
      expect(top(room.west)).toBe(top(room.north)); expect(top(room.east)).toBe(top(room.north));
      expect(room.west.height).toBe(room.floorHeight + room.north.height); expect(room.east.height).toBe(room.floorHeight + room.north.height);
    }
    expect(horizontal.west.width).toBe(front.west.width); expect(horizontal.east.width).toBe(front.east.width);
    expect(vertical.west.width).toBe(front.west.width); expect(vertical.east.width).toBe(front.east.width);

    const backedWest = component(proof.backed, "west-return"); const backedShort = component(proof.backed, "north-short-");
    expect(backedWest).toBeDefined(); expect(backedShort).toBeDefined();
    const backedFloorTop = proof.rects.backed.y; const backedFloorHeight = proof.rects.backed.height;
    expect(top(backedWest)).toBe(backedFloorTop); expect(backedWest.height).toBe(backedFloorHeight);
    // The short-wall source has an odd rendered pixel height, so Phaser centers
    // its visible bitmap on the floor edge at a half-pixel while its shell bound
    // remains anchored there.
    expect(Math.abs(top(backedShort) - backedFloorTop)).toBeLessThanOrEqual(0.5);

    const cornerNorth = component(proof.corner, "north-wall-0"); const cornerWest = component(proof.corner, "west-return"); const cornerEast = component(proof.corner, "east-return-0");
    expect(cornerNorth).toBeDefined(); expect(cornerWest).toBeDefined(); expect(cornerEast).toBeDefined();
    const unit = proof.rects.corner.width / 4; const cornerFloorLeft = proof.rects.corner.x; const cornerFloorTop = proof.rects.corner.y;
    expect(left(cornerNorth)).toBe(cornerFloorLeft + unit); expect(top(cornerWest)).toBe(cornerFloorTop + unit);
    const overlaps = (item: any, x: number, y: number, width: number, height: number) => left(item) < x + width && item.x + item.width / 2 > x && top(item) < y + height && item.y + item.height / 2 > y;
    expect(proof.corner.filter((item: any) => (item.key.includes("north-wall") || item.key.includes("west-return")) && overlaps(item, cornerFloorLeft, cornerFloorTop - cornerNorth.height, unit, cornerNorth.height))).toEqual([]);
    expect(proof.corner.filter((item: any) => item.key.includes("west-return") && overlaps(item, cornerFloorLeft - cornerEast.width / 2, cornerFloorTop, cornerEast.width, unit))).toEqual([]);
    expect(proof.corner.filter((item: any) => item.key.includes("north-") && item.key.includes("occluder"))).toEqual([]);

    const northBase = component(proof.front, "north-wall-0"); const westOccluder = component(proof.front, "west-return-0-occluder"); const eastOccluder = component(proof.front, "east-return-0-occluder"); const southOccluder = component(proof.front, "front-0-occluder");
    expect(northBase).toBeDefined(); expect(westOccluder).toBeDefined(); expect(eastOccluder).toBeDefined(); expect(southOccluder).toBeDefined();
    const frontDecor = proof.front.filter((item: any) => item.key.includes("front-desk-v5:decor:"));
    expect(frontDecor.length).toBeGreaterThan(0); expect(frontDecor.every((item: any) => item.visible && item.depth > northBase.depth && item.depth < proof.founderDepth)).toBe(true);
    expect(northBase.depth).toBeLessThan(proof.founderDepth); expect(proof.founderDepth).toBeLessThan(westOccluder.depth); expect(proof.founderDepth).toBeLessThan(eastOccluder.depth); expect(proof.founderDepth).toBeLessThan(southOccluder.depth);
  };
  const proof = await readLiveProof();
  assertLiveContract(proof);
  await facility.screenshot({ path: "artifacts/screenshots/wall-corner-continuity-normal-100-desktop.png", animations: "disabled" });
  await page.getByRole("button", { name: "Enter Build Mode" }).click(); await expect(page.getByRole("navigation", { name: "Build Mode tools" })).toBeVisible();
  assertLiveContract(await readLiveProof());
  await facility.screenshot({ path: "artifacts/screenshots/wall-corner-continuity-build-100-desktop.png", animations: "disabled" });
});
