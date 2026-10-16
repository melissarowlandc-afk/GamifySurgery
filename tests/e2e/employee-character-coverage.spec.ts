import { mkdirSync, readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { STAFF_CHARACTER_STILLS } from "@gamify-surgery/game-domain";

import {
  getProfile,
  installLevelOneVisualState,
  PROFILE_KEY,
  startClinic,
  type PersistedProfile,
} from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots/employee-character-coverage";
const registry = JSON.parse(readFileSync("apps/player/src/art/characterStillRegistry.generated.json", "utf8")) as any;
const directions = ["south", "east", "west", "north"] as const;

test.beforeAll(() => mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true }));

function staffEntries() {
  return registry.characters.filter((entry: any) => entry.category === "employee");
}

function registryEntry(id: string) {
  return registry.characters.find((entry: any) => entry.id === id);
}

function appearance(stillId: string, roleStyle: string) {
  return {
    version: "pixel-avatar.v1", bodyShape: "average", hairStyle: "short", skinTone: 1,
    hairShade: 1, faceStyle: "round", outfitStyle: "plain", outfitShade: 1,
    accessory: "none", headVariant: 0, bodyVariant: 0, stillId, roleStyle,
  };
}

async function openRosterFixture(page: Page): Promise<Page> {
  await startClinic(page, "Employee Coverage Founder", "Employee Coverage Clinic");
  await installLevelOneVisualState(page);
  const profile = await getProfile(page) as PersistedProfile;
  const active = profile.campaigns.find((campaign) => campaign.campaignId === profile.activeCampaignId)!;
  const state = JSON.parse(active.serializedState) as any;
  const roster = staffEntries().slice(0, 43);
  state.paused = true;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.employees = roster.map((entry: any, index: number) => ({
    id: `employee.coverage.${index}`,
    staffRoleDefinitionId: entry.role,
    displayName: `Coverage ${index}`,
    appearance: appearance(entry.id, entry.role.replace("staff.", "")),
    hiredAtFacilityTick: index,
    salaryPerExpenseInterval: 0,
    morale: 75,
    trainingLevel: 1,
    homeRoomInstanceId: null,
    location: { x: 24 + (index % 8) * 2, y: 23 + Math.floor(index / 8) * 2 },
    path: [], pathIndex: 0, lastMovedAtFacilityTick: 0,
    lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 100, facilityTask: null,
  }));
  active.serializedState = JSON.stringify(state);
  await page.goto("/gamify-surgery-launcher-health.json");
  await page.evaluate(({ key, value }) => localStorage.setItem(key, value), {
    key: PROFILE_KEY, value: JSON.stringify(profile),
  });
  const capture = await page.context().newPage();
  await capture.setViewportSize({ width: 1440, height: 1000 });
  await capture.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = capture.getByRole("button", { name: /Resume Employee Coverage Clinic/ });
  if (await resume.isVisible()) await resume.click();
  await expect(capture.getByTestId("facility-canvas")).toBeVisible();
  await capture.waitForFunction(() => typeof (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGaitSnapshot === "function");
  return capture;
}

test("all staff still registry art is addressable and the GS-026 roster stays unique after browser reload", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "One controlled desktop proof is sufficient.");
  const staff = staffEntries();
  const newStaff = staff.filter((entry: any) => entry.id.startsWith("gs026-employee-"));
  expect(staff).toHaveLength(45);
  expect(newStaff).toHaveLength(25);
  expect(new Set(staff.map((entry: any) => entry.id)).size).toBe(45);
  expect(STAFF_CHARACTER_STILLS).toHaveLength(47);
  const capture = await openRosterFixture(page);
  const assets: string[] = [];
  for (const staffStill of STAFF_CHARACTER_STILLS) {
    const entry = registryEntry(staffStill.stillId);
    expect(entry, `runtime art is registered for ${staffStill.stillId}`).toBeDefined();
    for (const posture of ["stand", "sit"] as const) for (const direction of directions) {
      const asset = entry.poses[posture][direction];
      expect(asset).toMatchObject({ width: 160, height: 320 });
      expect(asset.url).toMatch(/gs026-(stills|employee-expansion)-v1\/.*\/(stand|sit)-(south|east|west|north)\.png$/);
      expect(asset.visibleBounds.width).toBeGreaterThan(0);
      expect(asset.visibleBounds.height).toBeGreaterThan(0);
      if (posture === "sit") expect(typeof asset.anchors.seatContactY).toBe("number");
      assets.push(asset.url);
    }
  }
  const responses = await Promise.all(assets.map((url) => capture.request.get(`/${url}`)));
  expect(responses).toHaveLength(376);
  for (const response of responses) {
    expect(response.status()).toBe(200);
    expect((await response.body()).byteLength).toBeGreaterThan(100);
  }
  const rosterState = await getProfile(capture) as PersistedProfile;
  const serialized = rosterState.campaigns.find((campaign) => campaign.campaignId === rosterState.activeCampaignId)!.serializedState;
  const ids = JSON.parse(serialized).employees.map((employee: any) => employee.appearance.stillId);
  expect(ids).toHaveLength(43);
  expect(new Set(ids).size).toBe(43);
  await capture.reload();
  const resume = capture.getByRole("button", { name: /Resume Employee Coverage Clinic/ });
  if (await resume.isVisible()) await resume.click();
  const afterReload = await getProfile(capture) as PersistedProfile;
  expect(JSON.parse(afterReload.campaigns.find((campaign) => campaign.campaignId === afterReload.activeCampaignId)!.serializedState).employees.map((employee: any) => employee.appearance.stillId)).toEqual(ids);
  await capture.close();
});

test("new nurse, EVS, and NP use directional still textures with the standing bounce and no walk fallback", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "One controlled desktop proof is sufficient.");
  const capture = await openRosterFixture(page);
  const requests: string[] = [];
  capture.context().on("request", (request) => {
    if (request.url().includes("gs026-simple-walk-pilot-v1")) requests.push(request.url());
  });
  await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    const model = scene.bridge.viewModel as any;
    const directions = [["front", false, 1], ["back", false, 1], ["side", true, 1], ["side", false, -1]];
    const entries = [["gs026-employee-001", "periop_nurse"], ["gs026-employee-014", "evs_worker"], ["gs026-employee-018", "glp1_np"]]
      .flatMap(([stillId, roleStyle], row) => directions.map(([direction, rightFacing, delta], column) =>
        [stillId, roleStyle, direction, rightFacing, delta, { x: 25 + column * 8, y: 24 + row * 3 }],
      ));
    model.staff = entries.map(([stillId, roleStyle, direction, rightFacing, delta, location]: any, index: number) => ({
      instanceId: `employee.live.${index}`, displayName: stillId, roleDisplayName: roleStyle,
      homeRoomInstanceId: null, location, path: [location, { x: location.x + delta, y: location.y }], pathIndex: 0, moving: true,
      direction, rightFacing, appearance: {
        version: "pixel-avatar.v1", bodyShape: "average", hairStyle: "short", skinTone: 1,
        hairShade: 1, faceStyle: "round", outfitStyle: "plain", outfitShade: 1,
        accessory: "none", headVariant: 0, bodyVariant: 0, stillId, roleStyle,
      },
    }));
    model.patients = [0, 4, 8].map((staffIndex, index) => ({
      instanceId: `employee.seated.${index}`, location: { x: 25 + index * 8, y: 31 }, path: [], pathIndex: 0,
      moving: false, direction: "front", pose: "seated", seated: true,
      appearance: { ...model.staff[staffIndex].appearance },
    }));
    model.paused = false;
    scene.characterMotionSnapshots.clear(); scene.routeMotionTracks.clear(); scene.characterStepBounceStates.clear();
    scene.characterStepBounceMilliseconds = 250; scene.update(0, 0); scene.drawCharacters();
    const read = (key: string) => {
      const actor = scene.characterBitmapContainers.get(key)?.getByName("actor");
      return { atlas: actor?.getData("gait-atlas-id"), direction: actor?.getData("gait-direction"), pose: actor?.getData("gait-pose"), localY: actor?.y, visible: actor?.visible };
    };
    return read("character:staff:employee.live.0");
  });
  await expect.poll(() => capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    return Array.from({ length: 12 }, (_, index) => `character:staff:employee.live.${index}`)
      .concat(Array.from({ length: 3 }, (_, index) => `character:patient:employee.seated.${index}`))
      .every((key) => Boolean(scene.characterBitmapContainers.get(key)?.getByName("actor")?.visible));
  })).toBe(true);
  const evidence = await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    const read = (key: string) => {
      const actor = scene.characterBitmapContainers.get(key)?.getByName("actor");
      return { atlas: actor?.getData("gait-atlas-id"), direction: actor?.getData("gait-direction"), pose: actor?.getData("gait-pose"), localY: actor?.y, visible: actor?.visible, width: actor?.displayWidth, height: actor?.displayHeight };
    };
    return {
      standing: Array.from({ length: 12 }, (_, index) => read(`character:staff:employee.live.${index}`)),
      seated: Array.from({ length: 3 }, (_, index) => read(`character:patient:employee.seated.${index}`)),
    };
  });
  for (const [index, value] of evidence.standing.entries()) {
    const id = ["gs026-employee-001", "gs026-employee-014", "gs026-employee-018"][Math.floor(index / 4)]!;
    const cardinal = (["south", "north", "east", "west"] as const)[index % 4]!;
    expect(value.visible).toBe(true);
    expect(value.atlas).toBe(`character-still:${id}:${registryEntry(id).poses.stand[cardinal].sha256.slice(0, 12)}`);
    expect(value.pose).toBe("walk-neutral");
    expect(value.localY).toBeLessThan(0);
    expect(value.localY).toBeGreaterThanOrEqual(-3);
  }
  expect(evidence.standing.map((value: any) => value.direction)).toEqual(["front", "back", "side", "side", "front", "back", "side", "side", "front", "back", "side", "side"]);
  for (const [index, value] of evidence.seated.entries()) {
    const id = ["gs026-employee-001", "gs026-employee-014", "gs026-employee-018"][index]!;
    expect(value.atlas).toMatch(new RegExp(`^character-still:${id}:`));
    expect(value.pose).toBe("seated");
    expect(value.width).toBe(evidence.standing[index * 4]!.width);
    expect(value.height).toBe(evidence.standing[index * 4]!.height);
  }
  expect(requests).toEqual([]);
  await capture.getByTestId("facility-canvas").screenshot({ path: `${SCREENSHOT_DIRECTORY}/new-staff-runtime.png`, animations: "disabled" });
  await capture.close();
});
