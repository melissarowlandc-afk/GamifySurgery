import { mkdirSync, readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { getProfile, PROFILE_KEY, startClinic } from "./helpers";

// Owner-approved hallway decor (2026-10-07): benches, plants, art, sanitizer
// stands and runner rugs along hallways whose walls are shared with rooms.
// The fixture is the room/door layout of a 63-room Level 3 facility where
// every hallway tile is flanked by rooms. Run against a separate server,
// never the owner's 4173 origin, e.g.
// GAMIFY_E2E_EXTERNAL_SERVER=1 GAMIFY_E2E_BASE_URL=http://127.0.0.1:5181

const OUT = process.env.HALLWAY_OUT ?? "artifacts/screenshots/hallway-decor";
const layout = JSON.parse(readFileSync("tests/e2e/fixtures/hallway-decor-level3-layout.json", "utf8")) as {
  rooms: [string, string, number, number, number, string | null][];
  doors: [string, string, string, number, boolean][];
};

test("renders hallway decor along room-backed corridors", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "One desktop capture set.");
  test.setTimeout(180_000);
  mkdirSync(OUT, { recursive: true });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await startClinic(page, "Hallway Reviewer", "Hallway Decor");
  const profile = await getProfile(page);
  const index = profile.campaigns.findIndex((candidate) => candidate.campaignId === profile.activeCampaignId);
  const state = JSON.parse(profile.campaigns[index]!.serializedState) as any;
  state.paused = true; state.facilityLevel = 3; state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.rooms = layout.rooms.map(([id, roomDefinitionId, x, y, orientation, doorSide]) =>
    ({ id, roomDefinitionId, x, y, orientation, doorSide, upgradeLevel: 1, cleanliness: 100 }));
  state.doors = layout.doors.map(([id, roomId, side, offset, exterior]) => ({ id, roomId, side, offset, exterior }));
  profile.campaigns[index] = { ...profile.campaigns[index]!, serializedState: JSON.stringify(state) };
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: PROFILE_KEY, value: profile });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  await page.getByRole("button", { name: "Resume Hallway Decor" }).click();
  await page.addStyleTag({ content: ".facility-pause-indicator,.tutorial-overlay,.modal-backdrop { visibility:hidden !important; }" });
  const canvas = page.getByTestId("facility-canvas");
  await expect(canvas).toBeVisible();
  await page.waitForFunction(() => Boolean((document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame?.scene?.getScene("facility-scene")));
  const decorCount = () => page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    return [...scene.fixtureBitmapImages.keys()].filter((key: string) => key.startsWith("touchup-corridor:")).length;
  });
  await expect.poll(decorCount, { timeout: 20_000 }).toBeGreaterThan(8);

  const capture = async (name: string, tileX: number, tileY: number, width: number, height: number, zoom?: number) => {
    await page.evaluate(({ tileX, tileY, width, height, zoom }) => {
      const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
      scene.applyCamera({ ...scene.cameraView, ...(zoom ? { zoom } : {}), panX: 0, panY: 0 });
      scene.refreshLayout(true);
      const l = scene.layout;
      const cx = l.originX + (tileX + width / 2) * l.tileSize, cy = l.originY + (tileY + height / 2) * l.tileSize;
      scene.applyCamera({ ...scene.cameraView, panX: scene.scale.width / 2 - cx, panY: scene.scale.height / 2 - cy });
      scene.refreshLayout(true);
    }, { tileX, tileY, width, height, zoom });
    await page.waitForTimeout(250);
    const rect = await page.evaluate(({ tileX, tileY, width, height }) => {
      const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
      const l = scene.layout, cam = scene.cameras.main;
      return { x: l.originX + tileX * l.tileSize - cam.scrollX, y: l.originY + tileY * l.tileSize - cam.scrollY, w: width * l.tileSize, h: height * l.tileSize, t: l.tileSize };
    }, { tileX, tileY, width, height });
    const box = (await canvas.boundingBox())!;
    const clipX = Math.max(box.x, box.x + rect.x - 16), clipY = Math.max(box.y, box.y + rect.y - rect.t);
    const clip = { x: clipX, y: clipY, width: Math.min(box.x + box.width - clipX, rect.w + 32), height: Math.min(box.y + box.height - clipY, rect.h + rect.t + 24) };
    await page.screenshot({ path: `${OUT}/${name}.png`, clip, animations: "disabled", timeout: 15_000 });
  };
  await capture("facility", 23, 18, 23, 14);
  await capture("facility-zoomed-out", 23, 18, 23, 14, .5);
  await capture("south-edge", 35, 29, 10, 4, 2.2);
  await capture("west-wing", 23, 21, 12, 7, 1.6);
  await capture("east-wing", 33, 20, 13, 9, 1.6);
  console.log(`corridor decor images: ${await decorCount()}`);
  expect(errors).toEqual([]);
});
