import { mkdirSync } from "node:fs";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { getProfile, PROFILE_KEY, startClinic } from "./helpers";

const SCREENSHOTS = "artifacts/screenshots/approved-room-runtime/interactions";
test.beforeAll(() => mkdirSync(SCREENSHOTS, { recursive: true }));

async function openFixture(page: Page): Promise<Locator> {
  await startClinic(page, "Interaction Reviewer", "Approved Room Interactions");
  const profile = await getProfile(page);
  const index = profile.campaigns.findIndex((item) => item.campaignId === profile.activeCampaignId);
  const state = JSON.parse(profile.campaigns[index]!.serializedState) as any;
  state.paused = true; state.facilityLevel = 2; state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.rooms = [
    { id: "approved.front", roomDefinitionId: "room.front_desk", x: 2, y: 3, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "approved.endo-0", roomDefinitionId: "room.endoscopy", x: 10, y: 3, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "approved.endo-270", roomDefinitionId: "room.endoscopy", x: 16, y: 3, orientation: 270, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "approved.recovery", roomDefinitionId: "room.periop_recovery", x: 22, y: 3, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "approved.recovery-hall", roomDefinitionId: "room.hallway", x: 24, y: 2, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "approved.phleb-270", roomDefinitionId: "room.phlebotomy", x: 30, y: 3, orientation: 270, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "approved.telehealth-270", roomDefinitionId: "room.glp1_telehealth_suite", x: 34, y: 3, orientation: 270, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
  ];
  state.doors = [];
  profile.campaigns[index] = { ...profile.campaigns[index]!, serializedState: JSON.stringify(state) };
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: PROFILE_KEY, value: profile });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  await page.getByRole("button", { name: "Resume Approved Room Interactions" }).click();
  await page.addStyleTag({ content: ".facility-pause-indicator,.tutorial-overlay,.modal-backdrop { visibility:hidden !important; }" });
  const canvas = page.getByTestId("facility-canvas");
  await expect(canvas).toBeVisible();
  await page.waitForFunction(() => Boolean((document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame?.scene?.getScene("facility-scene")));
  return canvas;
}

async function centerRoom(page: Page, instanceId: string): Promise<{ x: number; y: number; width: number; height: number; tile: number }> {
  return page.evaluate((instanceId) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    scene.applyCamera({ ...scene.cameraView, panX: 0, panY: 0 });
    const room = scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === instanceId);
    if (!room) throw new Error(`Missing live room ${instanceId}`);
    let layout = scene.layout;
    const centerX = layout.originX + (room.tileX + room.width / 2) * layout.tileSize;
    const centerY = layout.originY + (room.tileY + room.height / 2) * layout.tileSize;
    scene.applyCamera({ ...scene.cameraView, panX: scene.scale.width / 2 - centerX, panY: scene.scale.height / 2 - centerY });
    scene.refreshLayout(true); scene.drawCharacters(); layout = scene.layout;
    return { x: layout.originX + room.tileX * layout.tileSize, y: layout.originY + room.tileY * layout.tileSize, width: room.width * layout.tileSize, height: room.height * layout.tileSize, tile: layout.tileSize };
  }, instanceId);
}

async function captureRoom(page: Page, canvas: Locator, instanceId: string, filename: string): Promise<void> {
  const capture = await centerRoom(page, instanceId);
  await captureBounds(page, canvas, capture, filename);
}

async function captureBounds(
  page: Page,
  canvas: Locator,
  capture: { x: number; y: number; width: number; height: number; tile: number },
  filename: string,
): Promise<void> {
  // Scene mutations update display objects synchronously; allow Phaser's next
  // render frame to present them to the canvas before pixel capture.
  await page.waitForTimeout(100);
  const box = await canvas.boundingBox();
  if (!box) throw new Error("Missing canvas box");
  await page.screenshot({
    path: `${SCREENSHOTS}/${filename}`,
    clip: { x: Math.max(box.x, box.x + capture.x - 12), y: Math.max(box.y, box.y + capture.y - capture.tile * 2), width: Math.min(box.width, capture.width + 24), height: Math.min(box.height, capture.height + capture.tile * 2 + 16) },
    animations: "disabled",
  });
}

test("anchors a seated founder to the approved Front Desk chair and hides the empty chair", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Controlled desktop interaction capture.");
  const canvas = await openFixture(page);
  const result = await page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    const room = scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === "approved.front");
    Object.assign(scene.bridge.viewModel.founder, { location: { x: room.tileX + 2, y: room.tileY + 1 }, path: [], pathIndex: 0, moving: false, direction: "front", activityLabel: undefined, seated: true });
    scene.bridge.viewModel.staff = []; scene.characterMotionSnapshots.clear(); scene.routeMotionTracks.clear(); scene.update(0, 0);
    const gait = host.__facilityGaitSnapshot()["character:founder"];
    const founderContainer = scene.characterBitmapContainers.get("character:founder");
    const expectedDisplay = scene.getFrontDeskV5ActorDisplayPosition(scene.bridge.viewModel.founder.location, false, "staff");
    const chairKeys = [...scene.fixtureBitmapImages.entries()].filter(([key, image]: [string, any]) => key.startsWith("approved:approved.front:") && key.includes("receptionist-chair") && image.visible).map(([key]: [string, any]) => key);
    const chairVisible = chairKeys.length > 0;
    const approvedFixtureCount = [...scene.fixtureBitmapImages.keys()].filter((key: string) => key.startsWith("approved:approved.front:")).length;
    const approvedCoolers = [...scene.fixtureBitmapImages.entries()].filter(([key, image]: [string, any]) => key.startsWith("approved:approved.front:") && image.visible && image.frame.cutWidth === 294 && image.frame.cutHeight === 710);
    const legacyCoolers = [...scene.fixtureBitmapImages.entries()].filter(([key, image]: [string, any]) => image.visible && (key.includes("environment:water-cooler") || key.includes("shadow:water-cooler")));
    return { gait, chairVisible, chairKeys, approvedFixtureCount, approvedCoolerCount: approvedCoolers.length, legacyCoolerCount: legacyCoolers.length, coolerCrop: approvedCoolers[0]?.[1].frame.cutY, actorPosition: { x: founderContainer.x, y: founderContainer.y }, expectedDisplay };
  });
  expect(result.gait).toMatchObject({ visible: true, pose: "seated", direction: "front" });
  expect(Math.abs(result.actorPosition.x - result.expectedDisplay.centerX)).toBeLessThanOrEqual(1);
  expect(Math.abs(result.actorPosition.y - result.expectedDisplay.baseY)).toBeLessThanOrEqual(1);
  expect(result.chairKeys).toEqual([]);
  expect(result.approvedFixtureCount).toBeGreaterThan(0);
  expect(result.approvedCoolerCount).toBe(1);
  expect(result.legacyCoolerCount).toBe(0);
  const frontBounds = await centerRoom(page, "approved.front");
  // Reapply the isolated presentation state after camera callbacks refresh the bridge.
  await page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    const room = scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === "approved.front");
    Object.assign(scene.bridge.viewModel.founder, { location: { x: room.tileX + 2, y: room.tileY + 1 }, path: [], pathIndex: 0, moving: false, direction: "front", activityLabel: undefined, seated: true });
    scene.bridge.viewModel.staff = []; scene.characterMotionSnapshots.clear(); scene.routeMotionTracks.clear(); scene.update(0, 0);
  });
  await captureBounds(page, canvas, frontBounds, "front-desk-founder-seated.png");
  const emptyCooler = await page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    Object.assign(scene.bridge.viewModel.waterCooler, { fillPercent: 0, needsRefill: true, highlighted: true });
    scene.refreshLayout(true);
    const approved = [...scene.fixtureBitmapImages.entries()].filter(([key, image]: [string, any]) => key.startsWith("approved:approved.front:") && image.visible && image.frame.cutWidth === 294 && image.frame.cutHeight === 710);
    const legacy = [...scene.fixtureBitmapImages.entries()].filter(([key, image]: [string, any]) => image.visible && (key.includes("environment:water-cooler") || key.includes("shadow:water-cooler")));
    return { count: approved.length, legacyCount: legacy.length, cropY: approved[0]?.[1].frame.cutY };
  });
  expect(emptyCooler.count).toBe(1);
  expect(emptyCooler.legacyCount).toBe(0);
  expect(emptyCooler.cropY).not.toBe(result.coolerCrop);
  await captureBounds(page, canvas, frontBounds, "front-desk-founder-seated-empty-water.png");
});

test("opens a reciprocal Recovery N3 doorway and hides only its owned bay and partition", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Controlled desktop interaction capture.");
  const canvas = await openFixture(page);
  const snapshot = () => page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    const recovery = scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === "approved.recovery");
    const hallway = scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === "approved.recovery-hall");
    const visible = (fragment: string) => [...scene.fixtureBitmapImages.entries()].some(([key, image]: [string, any]) => key.startsWith("approved:approved.recovery:") && key.includes(fragment) && image.visible);
    return {
      n3Bed: visible("N3.bed"), n4Bed: visible("N4.bed"), s3Bed: visible("S3.bed"),
      partitionN: scene.fixtureGraphics.has("approved-procedural:approved.recovery:partitionN"),
      partitionS: scene.fixtureGraphics.has("approved-procedural:approved.recovery:partitionS"),
      recoveryOpenings: scene.getRoomDoorOpenings(recovery),
      hallwayOpenings: scene.getRoomDoorOpenings(hallway),
    };
  });
  const recoveryBounds = await centerRoom(page, "approved.recovery");
  const closed = await snapshot();
  expect(closed).toMatchObject({ n3Bed: true, n4Bed: true, s3Bed: true, partitionN: true, partitionS: true });
  await captureBounds(page, canvas, recoveryBounds, "recovery-n3-closed-adjacent-hall.png");
  await page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    scene.bridge.viewModel.doors = [{ instanceId: "interaction.recovery.n3", roomInstanceId: "approved.recovery", side: "north", offset: 2, exterior: false }];
    scene.refreshLayout(true);
  });
  const opened = await snapshot();
  expect(opened.n3Bed).toBe(false);
  expect(opened.n4Bed).toBe(true);
  expect(opened.s3Bed).toBe(true);
  expect(opened.partitionN).toBe(false);
  expect(opened.partitionS).toBe(true);
  expect(opened.recoveryOpenings).toEqual(expect.arrayContaining([expect.objectContaining({ side: "north", offset: 2 })]));
  expect(opened.hallwayOpenings).toEqual(expect.arrayContaining([expect.objectContaining({ side: "south", offset: 0 })]));
  await captureBounds(page, canvas, recoveryBounds, "recovery-n3-open-adjacent-hall.png");
});

test("hides only the first rotated room window for a physical north-one door or backing", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Controlled desktop interaction capture.");
  await openFixture(page);
  const snapshot = (roomId: string) => page.evaluate((roomId) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    const fixtureVisible = (id: string) => [...scene.fixtureBitmapImages.entries()].some(([key, image]: [string, any]) =>
      key.startsWith(`approved:${roomId}:`) && key.includes(id) && image.visible,
    );
    const room = scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === roomId);
    return {
      window1: fixtureVisible("window-1"), window2: fixtureVisible("window-2"),
      plant1: fixtureVisible("plant1"), plant2: fixtureVisible("plant2"),
      openings: scene.getRoomDoorOpenings(room),
    };
  }, roomId);

  expect(await snapshot("approved.phleb-270")).toMatchObject({ window1: true, window2: true });
  await page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    scene.bridge.viewModel.doors = [{ instanceId: "interaction.phleb.n1", roomInstanceId: "approved.phleb-270", side: "north", offset: 0, exterior: true }];
    scene.refreshLayout(true);
  });
  const opened = await snapshot("approved.phleb-270");
  expect(opened).toMatchObject({ window1: false, window2: true });
  expect(opened.openings).toEqual(expect.arrayContaining([expect.objectContaining({ side: "north", offset: 0 })]));

  expect(await snapshot("approved.telehealth-270")).toMatchObject({ window1: true, window2: true, plant1: true, plant2: true });
  await page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    const telehealth = scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === "approved.telehealth-270");
    const hallway = scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === "approved.recovery-hall");
    scene.bridge.viewModel.rooms.push({ ...hallway, instanceId: "approved.telehealth-hall", tileX: telehealth.tileX, tileY: telehealth.tileY - 1 });
    scene.refreshLayout(true);
  });
  expect(await snapshot("approved.telehealth-270")).toMatchObject({ window1: false, window2: true, plant1: false, plant2: true });
});

test("switches Endoscopy empty and occupied-covered art and restores both approved orientations", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Controlled desktop interaction capture.");
  const canvas = await openFixture(page);
  const roomIds = ["approved.endo-0", "approved.endo-270"] as const;
  const signatures = async () => page.evaluate((ids) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    return Object.fromEntries(ids.map((roomId) => [roomId, [...scene.fixtureBitmapImages.entries()].filter(([key, image]: [string, any]) => key.startsWith(`approved:${roomId}:`) && image.visible).map(([key, image]: [string, any]) => `${key}:${image.frame.cutX},${image.frame.cutY},${image.frame.cutWidth},${image.frame.cutHeight}`).sort()]));
  }, roomIds) as Promise<Record<string, string[]>>;
  for (const roomId of roomIds) await captureRoom(page, canvas, roomId, `${roomId.slice(9)}-empty.png`);
  const empty = await signatures();
  await page.evaluate((ids) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    scene.bridge.viewModel.endoscopyOccupancy = { roomInstanceIds: [...ids], patientInstanceIds: [], serviceVisitorInstanceIds: ["interaction.procedure"] };
    scene.refreshLayout(true); scene.drawCharacters();
  }, roomIds);
  const occupied = await signatures();
  for (const roomId of roomIds) {
    expect(occupied[roomId]).not.toEqual(empty[roomId]);
    expect(occupied[roomId]).toHaveLength(empty[roomId]!.length);
    const bounds = await centerRoom(page, roomId);
    await page.evaluate((ids) => {
      const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
      scene.bridge.viewModel.endoscopyOccupancy = { roomInstanceIds: [...ids], patientInstanceIds: [], serviceVisitorInstanceIds: ["interaction.procedure"] };
      scene.refreshLayout(true); scene.drawCharacters();
    }, roomIds);
    await captureBounds(page, canvas, bounds, `${roomId.slice(9)}-occupied.png`);
  }
  await page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    scene.bridge.viewModel.endoscopyOccupancy = undefined; scene.refreshLayout(true); scene.drawCharacters();
  });
  const restored = await signatures();
  for (const roomId of roomIds) {
    expect(restored[roomId]).toEqual(empty[roomId]);
    await captureRoom(page, canvas, roomId, `${roomId.slice(9)}-restored.png`);
  }
});
