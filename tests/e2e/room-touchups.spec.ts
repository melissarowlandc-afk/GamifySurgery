import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { getProfile, PROFILE_KEY, startClinic } from "./helpers";

// Owner-approved room touch-ups (2026-10-07). Seeds one facility with a
// corridor backed by Level 3/imaging rooms plus standalone rooms, then
// captures each room and checks the layering rules the owner asked for.
// Run against a separate server, never the owner's 4173 origin, e.g.
// GAMIFY_E2E_EXTERNAL_SERVER=1 GAMIFY_E2E_BASE_URL=http://127.0.0.1:5175

const OUT = "artifacts/screenshots/room-touchups";
const CORRIDOR_Y = 8;
const backed = [
  ["lab", "room.laboratory", 3, 3], ["pharmacy", "room.pharmacy", 6, 3], ["workshop", "room.maintenance_workshop", 9, 3],
  ["or", "room.ambulatory_or", 12, 4], ["break", "room.staff_break", 16, 4], ["xray", "room.xray", 20, 3],
  ["ultrasound", "room.ultrasound", 23, 3], ["ct", "room.ct", 26, 4], ["office", "room.surgeon_office", 30, 2],
  ["vending", "room.vending", 32, 2],
] as const;
const standalone = [
  ["exam", "room.examination", 36, 2], ["waiting", "room.waiting", 40, 2], ["bath", "room.bathroom", 45, 2],
  ["minor", "room.minor_procedure", 48, 2], ["phleb", "room.phlebotomy", 52, 2], ["tele", "room.glp1_telehealth_suite", 56, 2],
  ["evs", "room.evs_closet", 60, 2], ["coffee", "room.coffee_kiosk", 63, 2], ["endo", "room.endoscopy", 36, 18],
  ["recovery", "room.periop_recovery", 41, 18], ["training", "room.training", 48, 18],
] as const;

test("renders the owner-approved room touch-ups", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "One desktop capture set.");
  test.setTimeout(240_000);
  mkdirSync(OUT, { recursive: true });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await startClinic(page, "Touch-up Reviewer", "Room Touch-ups");
  const profile = await getProfile(page);
  const index = profile.campaigns.findIndex((candidate) => candidate.campaignId === profile.activeCampaignId);
  const state = JSON.parse(profile.campaigns[index]!.serializedState) as any;
  state.paused = true; state.facilityLevel = 3; state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  const room = (id: string, roomDefinitionId: string, x: number, y: number) =>
    ({ id: `touchup.${id}`, roomDefinitionId, x, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  let x = 2;
  const added: any[] = [];
  const doors: any[] = [];
  for (const [id, definitionId, , width] of backed) {
    added.push(room(id, definitionId, x, CORRIDOR_Y + 1));
    doors.push({ id: `door.touchup.${id}`, roomId: `touchup.${id}`, side: "north", offset: 1, exterior: false });
    x += width;
  }
  for (let cx = 1; cx <= x; cx += 1) added.push(room(`hall.${cx}`, "room.hallway", cx, CORRIDOR_Y));
  for (let cy = CORRIDOR_Y + 1; cy <= CORRIDOR_Y + 4; cy += 1) added.push(room(`hall.w.${cy}`, "room.hallway", 1, cy));
  for (const [id, definitionId, rx, ry] of standalone) added.push(room(id, definitionId, rx, ry));
  // Passable-door sample: vending north door into the machine (now legal).
  state.rooms = [...state.rooms.filter((candidate: any) => candidate.roomDefinitionId === "room.front_desk"), ...added];
  state.doors = [...state.doors.filter((door: any) => door.exterior), ...doors];
  profile.campaigns[index] = { ...profile.campaigns[index]!, serializedState: JSON.stringify(state) };
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: PROFILE_KEY, value: profile });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  await page.getByRole("button", { name: "Resume Room Touch-ups" }).click();
  await page.addStyleTag({ content: ".facility-pause-indicator,.tutorial-overlay,.modal-backdrop { visibility:hidden !important; }" });
  const canvas = page.getByTestId("facility-canvas");
  await expect(canvas).toBeVisible();
  await page.waitForFunction(() => Boolean((document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame?.scene?.getScene("facility-scene")));
  // Decor textures load with the room atlases.
  await expect.poll(() => page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    return [...scene.fixtureBitmapImages.keys()].filter((key: string) => key.startsWith("touchup")).length;
  }), { timeout: 20_000 }).toBeGreaterThan(20);

  const capture = async (name: string, tileX: number, tileY: number, width: number, height: number) => {
    await page.evaluate(({ tileX, tileY, width, height }) => {
      const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
      scene.applyCamera({ ...scene.cameraView, panX: 0, panY: 0 });
      const l = scene.layout;
      const cx = l.originX + (tileX + width / 2) * l.tileSize, cy = l.originY + (tileY + height / 2) * l.tileSize;
      scene.applyCamera({ ...scene.cameraView, panX: scene.scale.width / 2 - cx, panY: scene.scale.height / 2 - cy });
      scene.refreshLayout(true);
    }, { tileX, tileY, width, height });
    await page.waitForTimeout(150);
    const rect = await page.evaluate(({ tileX, tileY, width, height }) => {
      const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
      const l = scene.layout, cam = scene.cameras.main;
      return { x: l.originX + tileX * l.tileSize - cam.scrollX, y: l.originY + tileY * l.tileSize - cam.scrollY, w: width * l.tileSize, h: height * l.tileSize, t: l.tileSize };
    }, { tileX, tileY, width, height });
    const box = (await canvas.boundingBox())!;
    const clipX = Math.max(box.x, box.x + rect.x - 16), clipY = Math.max(box.y, box.y + rect.y - rect.t * 1.4);
    const clip = { x: clipX, y: clipY, width: Math.min(box.x + box.width - clipX, rect.w + 32), height: Math.min(box.y + box.height - clipY, rect.h + rect.t * 1.4 + 24) };
    console.log(`capture ${name} tile=(${tileX},${tileY}) ${width}x${height} clip=${JSON.stringify(clip)}`);
    await page.screenshot({ path: `${OUT}/${name}.png`, clip, animations: "disabled", timeout: 15_000 });
  };
  await capture("corridor-west", 1, CORRIDOR_Y, 15, 6);
  await capture("corridor-east", 16, CORRIDOR_Y, 18, 6);
  for (const [id] of [...backed, ...standalone]) {
    const r = await page.evaluate((id) => {
      const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
      const v = scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === `touchup.${id}`);
      return { x: v.tileX, y: v.tileY, w: v.width, h: v.height };
    }, id);
    // Backed rooms include the corridor tile row above them.
    const backedRoom = backed.some(([candidate]) => candidate === id);
    await capture(id, r.x, backedRoom ? r.y - 1 : r.y, r.w, backedRoom ? r.h + 1 : r.h);
  }

  // Imaging rooms dim only while a scan is in progress. Simulate one in the
  // presentation model (the game derives it from service/travel state).
  const roomRect = async (id: string) => page.evaluate((id) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    const v = scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === `touchup.${id}`);
    return { x: v.tileX, y: v.tileY, w: v.width, h: v.height };
  }, id);
  const setImaging = (ids: string[]) => page.evaluate((ids) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    // React replaces the bridge model on each render; keep the override.
    const bridge = scene.bridge;
    let current = bridge.viewModel;
    Object.defineProperty(bridge, "viewModel", {
      configurable: true,
      get: () => ({ ...current, imagingActiveRoomInstanceIds: ids }),
      set: (value) => { current = value; },
    });
    scene.refreshLayout(true);
  }, ids);
  await setImaging(["touchup.xray", "touchup.ultrasound"]);
  for (const id of ["xray", "ultrasound"]) {
    const r = await roomRect(id);
    await capture(`${id}-imaging`, r.x, r.y - 1, r.w, r.h + 1);
  }
  const tintedTops = await page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    return [...scene.fixtureBitmapImages.keys()].filter((key: string) => key.includes("touchup.ultrasound") && key.endsWith(":tint")).length;
  });
  expect(tintedTops).toBeGreaterThan(0);
  await setImaging([]);

  // Layering rule: kept north-wall furniture sorts by its own floor line, so a
  // corridor walker (north of it) has a lower depth and draws behind it.
  const depths = await page.evaluate((corridorY) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    const fridge = [...scene.fixtureBitmapImages.entries()].find(([key]: [string]) => key.startsWith("approved:touchup.lab:") && key.includes(":fridge:"));
    const l = scene.layout;
    const walkerBaseline = l.originY + (corridorY + .55) * l.tileSize;
    const walkerDepth = 100_000 + Math.round(walkerBaseline) * 128 + 64;
    return { fridge: fridge ? (fridge[1] as any).depth : null, walker: walkerDepth };
  }, CORRIDOR_Y);
  expect(depths.fridge).not.toBeNull();
  expect(depths.fridge!).toBeGreaterThan(depths.walker);
  expect(errors).toEqual([]);
});
