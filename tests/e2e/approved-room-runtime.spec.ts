import { mkdirSync, writeFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { getActiveState, getProfile, PROFILE_KEY, startClinic } from "./helpers";

const rooms = [
  ["front", "room.front_desk", 2, 2, 0], ["exam", "room.examination", 9, 2, 270],
  ["hall", "room.hallway", 14, 2, 0], ["waiting", "room.waiting", 17, 2, 270],
  ["bath", "room.bathroom", 23, 2, 0], ["minor", "room.minor_procedure", 27, 2, 0],
  ["ultrasound", "room.ultrasound", 32, 2, 0], ["xray", "room.xray", 37, 2, 0],
  ["ct", "room.ct", 42, 2, 0], ["phleb", "room.phlebotomy", 48, 2, 270],
  ["evs", "room.evs_closet", 54, 2, 0], ["endo", "room.endoscopy", 2, 13, 270],
  ["recovery", "room.periop_recovery", 9, 13, 0], ["training", "room.training", 18, 13, 0],
  ["coffee", "room.coffee_kiosk", 23, 13, 0], ["telehealth", "room.glp1_telehealth_suite", 28, 13, 270],
  ["exam-0", "room.examination", 36, 13, 0], ["waiting-0", "room.waiting", 41, 13, 0],
  ["phleb-0", "room.phlebotomy", 47, 13, 0], ["endo-0", "room.endoscopy", 52, 13, 0],
  ["telehealth-0", "room.glp1_telehealth_suite", 58, 13, 0],
] as const;

test.beforeAll(() => mkdirSync("artifacts/screenshots/approved-room-runtime", { recursive: true }));

test("renders all approved room packs at their canonical orientations", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "One canonical desktop capture matrix.");
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await startClinic(page, "Approved Room Reviewer", "Approved Room Runtime");
  const profile = await getProfile(page);
  const index = profile.campaigns.findIndex((candidate) => candidate.campaignId === profile.activeCampaignId);
  const state = JSON.parse(profile.campaigns[index]!.serializedState) as any;
  state.paused = true; state.facilityLevel = 2; state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.rooms = rooms.map(([id, roomDefinitionId, x, y, orientation]) => ({ id: `approved.${id}`, roomDefinitionId, x, y, orientation, doorSide: null, upgradeLevel: 1, cleanliness: 100 }));
  state.doors = [];
  profile.campaigns[index] = { ...profile.campaigns[index]!, serializedState: JSON.stringify(state) };
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: PROFILE_KEY, value: profile });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  await page.getByRole("button", { name: "Resume Approved Room Runtime" }).click();
  await page.addStyleTag({ content: ".facility-pause-indicator,.tutorial-overlay,.modal-backdrop { visibility:hidden !important; }" });
  const canvas = page.getByTestId("facility-canvas");
  await expect(canvas).toBeVisible();
  await page.waitForFunction(() => Boolean((document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame?.scene?.getScene("facility-scene")));
  const stateAfter = await getActiveState(page);
  const diagnostics: unknown[] = [];
  expect(new Set((stateAfter.rooms as any[]).map((room) => room.roomDefinitionId))).toEqual(new Set(rooms.map((room) => room[1])));
  for (const [id, definitionId] of rooms) {
    await page.evaluate(({ id }) => {
      const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
      scene.applyCamera({ ...scene.cameraView, panX: 0, panY: 0 });
      const layout = scene.layout;
      const room = scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === `approved.${id}`);
      if (!room) throw new Error(`Missing live room approved.${id}`);
      const centerX = layout.originX + (room.tileX + room.width / 2) * layout.tileSize;
      const centerY = layout.originY + (room.tileY + room.height / 2) * layout.tileSize;
      scene.applyCamera({ ...scene.cameraView, panX: scene.scale.width / 2 - centerX, panY: scene.scale.height / 2 - centerY });
      scene.refreshLayout(true);
    }, { id });
    await page.waitForTimeout(100);
    diagnostics.push(await page.evaluate(({ id }) => {
      const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
      const room = scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === `approved.${id}`);
      const l = scene.layout; const r = room ? { x: l.originX + room.tileX * l.tileSize, y: l.originY + room.tileY * l.tileSize, width: room.width * l.tileSize, height: room.height * l.tileSize } : null;
      return { id, room, cameraView: scene.cameraView, layout: { originX: l.originX, originY: l.originY, tileSize: l.tileSize }, scale: { width: scene.scale.width, height: scene.scale.height }, viewModelCamera: scene.bridge.viewModel.camera, screenRoomRectangle: r, phaserScroll: { x: scene.cameras.main.scrollX, y: scene.cameras.main.scrollY } };
    }, { id }));
    await expect.poll(() => page.evaluate(() => {
      const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
      return Number.isFinite(scene.cameras.main.scrollX) && Number.isFinite(scene.cameras.main.scrollY);
    })).toBe(true);
    if (definitionId !== "room.hallway") await expect.poll(() => page.evaluate((id) => {
      const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
      return [...scene.fixtureBitmapImages.keys()].filter((key: string) => key.startsWith(`approved:approved.${id}:`)).length;
    }, id)).toBeGreaterThan(0);
    const capture = await page.evaluate(({ id }) => {
      const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene"); const room = scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === `approved.${id}`); const l = scene.layout;
      return { x: l.originX + room.tileX*l.tileSize, y: l.originY + room.tileY*l.tileSize, width: room.width*l.tileSize, height: room.height*l.tileSize, tile: l.tileSize };
    }, { id });
    const box = await canvas.boundingBox(); if (!box) throw new Error("Missing canvas box");
    // Some approved front-desk props rise above the nominal rear-wall line.
    // Keep a two-tile north envelope so a source crop is never top-clipped.
    await page.screenshot({ path: `artifacts/screenshots/approved-room-runtime/${id}.png`, clip: { x: Math.max(box.x, box.x + capture.x - 12), y: Math.max(box.y, box.y + capture.y - capture.tile*2), width: Math.min(box.width, capture.width + 24), height: Math.min(box.height, capture.height + capture.tile*2 + 16) }, animations: "disabled" });
  }
  writeFileSync("artifacts/screenshots/approved-room-runtime/camera-diagnostics.json", JSON.stringify(diagnostics, null, 2));
  expect(pageErrors).toEqual([]);
});
