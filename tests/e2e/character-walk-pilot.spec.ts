import { mkdirSync, readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import {
  getProfile,
  installLevelOneVisualState,
  PROFILE_KEY,
  startClinic,
  type PersistedProfile,
} from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots/gs026-simple-walk-pilot";
const EXPANSION_SCREENSHOT_DIRECTORY = "artifacts/screenshots/gs026-uniform-walk-batch";
const stillRegistry = JSON.parse(readFileSync("apps/player/src/art/characterStillRegistry.generated.json", "utf8")) as any;
const walkRegistry = JSON.parse(readFileSync("apps/player/src/art/characterWalkRegistry.generated.json", "utf8")) as any;
const blueStill = stillRegistry.characters.find((entry: any) => entry.id === "patient.adult.039");
const blueWalk = walkRegistry.characters[0];

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true });
  mkdirSync(EXPANSION_SCREENSHOT_DIRECTORY, { recursive: true });
});

async function openFixture(page: Page, stillId = "patient.adult.039"): Promise<Page> {
  await startClinic(page, "Walk Pilot Founder", "Walk Pilot Clinic");
  await installLevelOneVisualState(page);
  const profile = await getProfile(page) as PersistedProfile;
  const active = profile.campaigns.find((campaign) => campaign.campaignId === profile.activeCampaignId)!;
  const state = JSON.parse(active.serializedState) as any;
  state.paused = true;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.founder.appearance = { ...state.founder.appearance, stillId, roleStyle: "founder" };
  state.founder.location = { x: 30, y: 30 };
  state.founder.path = [];
  state.founder.moving = false;
  active.serializedState = JSON.stringify(state);
  // Leave the running app before installing the fixture. Its pagehide handler
  // saves state, so writing storage first would let teardown overwrite it.
  await page.goto("/gamify-surgery-launcher-health.json");
  await page.evaluate(({ key, value }) => localStorage.setItem(key, value), {
    key: PROFILE_KEY,
    value: JSON.stringify(profile),
  });
  const context = page.context();
  await page.close();
  const capture = await context.newPage();
  await capture.setViewportSize({ width: 1440, height: 1000 });
  await capture.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = capture.getByRole("button", { name: /Resume Walk Pilot Clinic/ });
  if (await resume.isVisible()) await resume.click();
  await expect(capture.getByTestId("facility-canvas")).toBeVisible();
  await capture.waitForFunction(() =>
    typeof (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGaitSnapshot === "function",
  );
  return capture;
}

async function actor(page: Page, key: string) {
  return page.evaluate((actorKey) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    const container = scene.characterBitmapContainers.get(actorKey);
    const image = container?.getByName("actor");
    return {
      x: container?.x, y: container?.y,
      visible: Boolean(container?.visible),
      neutralVisible: Boolean(scene.characterGraphics.get(actorKey)?.visible),
      atlas: image?.getData("gait-atlas-id"),
      direction: image?.getData("gait-direction"),
      pose: image?.getData("gait-pose"),
      stillId: image?.getData("gait-still-id"),
    };
  }, key);
}

test("Blue Glasses visibly steps in all four cardinals while pause, stop, seats, and fallback remain static", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "One desktop Phaser proof is sufficient.");

  let releaseWalk!: () => void;
  const walkGate = new Promise<void>((resolve) => { releaseWalk = resolve; });
  const requestedWalkPaths = new Set<string>();
  await page.context().route("**/gs026-simple-walk-pilot-v1/**", async (route) => {
    requestedWalkPaths.add(new URL(route.request().url()).pathname);
    await walkGate;
    await route.continue();
  });

  const capture = await openFixture(page);
  await capture.addStyleTag({ content: ".facility-pause-indicator { visibility: hidden !important; }" });
  const standingSouthId = `character-still:patient.adult.039:${blueStill.poses.stand.south.sha256.slice(0, 12)}`;
  await expect.poll(() => actor(capture, "character:founder")).toMatchObject({
    visible: true, neutralVisible: false, atlas: standingSouthId, stillId: "patient.adult.039",
  });

  await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    Object.assign(scene.bridge.viewModel.founder, {
      location: { x: 30, y: 30 },
      path: Array.from({ length: 20 }, (_, index) => ({ x: 30 + index, y: 30 })),
      pathIndex: 0, moving: true, direction: "side",
    });
    scene.bridge.viewModel.paused = false;
    scene.routeMotionTracks.clear();
    scene.characterMotionSnapshots.clear();
    scene.update(0, 0);
  });
  await expect.poll(() => requestedWalkPaths.size).toBe(32);
  await expect.poll(() => actor(capture, "character:founder")).toMatchObject({
    visible: true, neutralVisible: false, atlas: standingSouthId, stillId: "patient.adult.039",
  });
  releaseWalk();
  await expect.poll(() => actor(capture, "character:founder").then((value) => value.atlas), { timeout: 15_000 })
    .toMatch(/^character-still:patient\.adult\.039:(?!75b8570c59a1)/);

  await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    scene.scene.pause();
    const model = scene.bridge.viewModel as any;
    model.paused = false;
    model.buildMode = undefined;
    model.simulationSpeed = 1;
    model.realMillisecondsPerFacilityMinuteAt1x = 1_000;
    model.characterTravelTilesPerFacilityMinute = 2;
    const base = { ...model.founder.appearance, stillId: "patient.adult.039", roleStyle: "patient" };
    const paths = {
      south: Array.from({ length: 12 }, (_, index) => ({ x: 30, y: 26 + index })),
      north: Array.from({ length: 12 }, (_, index) => ({ x: 34, y: 34 - index })),
      east: Array.from({ length: 12 }, (_, index) => ({ x: 28 + index, y: 30 })),
      west: Array.from({ length: 12 }, (_, index) => ({ x: 38 - index, y: 28 })),
      fallback: Array.from({ length: 12 }, (_, index) => ({ x: 28 + index, y: 32 })),
    };
    model.patients = Object.entries(paths).map(([direction, path]: any) => ({
      instanceId: `walk-${direction}`, location: path[0], path, pathIndex: 0,
      moving: true, direction: direction === "east" || direction === "west" || direction === "fallback" ? "side" : direction === "south" ? "front" : "back",
      rightFacing: direction === "east" || direction === "fallback",
      appearance: direction === "fallback" ? { ...base, stillId: "patient.adult.038" } : base,
    }));
    scene.characterWalkMilliseconds = 0;
    scene.characterPresentationWasFrozen = false;
    scene.routeMotionTracks.clear();
    scene.characterMotionSnapshots.clear();
    scene.update(0, 0);
  });
  const fallbackStandingId = `character-still:patient.adult.038:${stillRegistry.characters.find((entry: any) => entry.id === "patient.adult.038").poses.stand.east.sha256.slice(0, 12)}`;
  await expect.poll(() => actor(capture, "character:patient:walk-fallback")).toMatchObject({
    visible: true, neutralVisible: false, atlas: fallbackStandingId,
  });

  const samples = await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    const paths = Object.fromEntries((scene.bridge.viewModel.patients as any[]).map((patient) => [patient.instanceId.replace("walk-", ""), patient.path]));
    scene.characterWalkMilliseconds = 0;
    scene.characterPresentationWasFrozen = false;
    scene.routeMotionTracks.clear();
    scene.characterMotionSnapshots.clear();
    const read = () => Object.fromEntries(Object.keys(paths).map((direction) => {
      const key = `character:patient:walk-${direction}`;
      const container = scene.characterBitmapContainers.get(key);
      const image = container?.getByName("actor");
      return [direction, { x: container?.x, y: container?.y, atlas: image?.getData("gait-atlas-id"), pose: image?.getData("gait-pose"), flip: image?.getData("gait-flip-x") }];
    }));
    const result = [];
    scene.update(0, 0);
    for (let phase = 0; phase < 8; phase += 1) {
      if (phase > 0) scene.update(phase * 180, 180);
      result.push(read());
    }
    return result;
  });

  for (const direction of ["south", "east", "west", "north"] as const) {
    const directionSamples = samples.map((sample: any) => sample[direction]);
    expect(new Set(directionSamples.map((sample: any) => sample.atlas)).size).toBe(8);
    expect(directionSamples.every((sample: any) => sample.pose === "walk-neutral" && sample.flip === false)).toBe(true);
    expect(directionSamples.some((sample: any, index: number) => index > 0 &&
      (sample.x !== directionSamples[index - 1].x || sample.y !== directionSamples[index - 1].y))).toBe(true);
    const expected = blueWalk.directions[direction].frames.map((frame: any) =>
      `character-still:patient.adult.039:${frame.sha256.slice(0, 12)}`);
    expect(directionSamples.map((sample: any) => sample.atlas)).toEqual(expected);
  }
  const fallbackSamples = samples.map((sample: any) => sample.fallback);
  expect(new Set(fallbackSamples.map((sample: any) => sample.atlas)).size).toBe(1);
  expect(fallbackSamples.some((sample: any, index: number) => index > 0 &&
    (sample.x !== fallbackSamples[index - 1].x || sample.y !== fallbackSamples[index - 1].y))).toBe(true);
  await capture.getByTestId("facility-canvas").screenshot({
    path: `${SCREENSHOT_DIRECTORY}/four-cardinal-visible-steps.png`, animations: "disabled",
  });

  const frozenAndStatic = await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    const model = scene.bridge.viewModel as any;
    const read = (key: string) => { const container = scene.characterBitmapContainers.get(key); const image = container?.getByName("actor"); return { x: container?.x, y: container?.y, atlas: image?.getData("gait-atlas-id") }; };
    const key = "character:patient:walk-south";
    model.paused = true; scene.update(2_000, 900); const pausedA = read(key); scene.update(2_900, 900); const pausedB = read(key);
    model.paused = false; scene.update(3_800, 900); const resumeDiscard = read(key); scene.update(3_980, 180); const resumed = read(key);
    model.buildMode = {}; scene.update(4_880, 900); const buildA = read(key); scene.update(5_780, 900); const buildB = read(key); model.buildMode = undefined;
    const patient = model.patients.find((value: any) => value.instanceId === "walk-south");
    Object.assign(patient, { moving: false, path: [], pathIndex: 0, direction: "front", pose: undefined, seated: false });
    scene.routeMotionTracks.delete(key); scene.characterMotionSnapshots.delete(key); scene.update(6_000, 0); const stopped = read(key);
    Object.assign(patient, { pose: "seated", seated: true }); scene.characterMotionSnapshots.delete(key); scene.update(6_000, 0); const seated = read(key);
    return { pausedA, pausedB, resumeDiscard, resumed, buildA, buildB, stopped, seated };
  });
  expect(frozenAndStatic.pausedB).toEqual(frozenAndStatic.pausedA);
  expect(frozenAndStatic.resumeDiscard).toEqual(frozenAndStatic.pausedA);
  expect(frozenAndStatic.resumed.atlas).not.toBe(frozenAndStatic.resumeDiscard.atlas);
  expect(frozenAndStatic.buildB).toEqual(frozenAndStatic.buildA);
  expect(frozenAndStatic.stopped.atlas).toBe(standingSouthId);
  const seatedId = `character-still:patient.adult.039:${blueStill.poses.sit.south.sha256.slice(0, 12)}`;
  expect(frozenAndStatic.seated.atlas).toBe(standingSouthId);
  await expect.poll(() => actor(capture, "character:patient:walk-south").then((value) => value.atlas)).toBe(seatedId);
  await capture.close();
});

for (const identity of [
  { id: "patient.adult.035", slug: "navy-vest" },
  { id: "patient.adult.043", slug: "brown-beanie" },
  { id: "patient.adult.032", slug: "gray-overshirt" },
  { id: "retained.gray-braid", slug: "gray-braid" },
]) test(`${identity.slug} uses its ordered eight-frame cycle in every cardinal`, async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "One desktop Phaser proof is sufficient.");
  const capture = await openFixture(page, identity.id);
  await capture.addStyleTag({ content: ".facility-pause-indicator { visibility: hidden !important; }" });
  const walk = walkRegistry.characters.find((entry: any) => entry.id === identity.id);
  const still = stillRegistry.characters.find((entry: any) => entry.id === identity.id);

  await capture.evaluate((stillId) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    const model = scene.bridge.viewModel as any;
    model.paused = false;
    model.simulationSpeed = 1;
    model.realMillisecondsPerFacilityMinuteAt1x = 1_000;
    model.characterTravelTilesPerFacilityMinute = 2;
    const appearance = { ...model.founder.appearance, stillId, roleStyle: "patient" };
    const paths = {
      south: Array.from({ length: 12 }, (_, index) => ({ x: 30, y: 26 + index })),
      north: Array.from({ length: 12 }, (_, index) => ({ x: 34, y: 34 - index })),
      east: Array.from({ length: 12 }, (_, index) => ({ x: 28 + index, y: 30 })),
      west: Array.from({ length: 12 }, (_, index) => ({ x: 38 - index, y: 28 })),
    };
    model.patients = Object.entries(paths).map(([direction, path]: any) => ({
      instanceId: `expansion-${direction}`, location: path[0], path, pathIndex: 0,
      moving: true, direction: direction === "east" || direction === "west" ? "side" : direction === "south" ? "front" : "back",
      rightFacing: direction === "east", appearance,
    }));
    scene.characterWalkMilliseconds = 0;
    scene.characterPresentationWasFrozen = false;
    scene.routeMotionTracks.clear();
    scene.characterMotionSnapshots.clear();
    scene.update(0, 0);
  }, identity.id);

  await expect.poll(async () => {
    const values = await Promise.all(["south", "east", "west", "north"].map((direction) => actor(capture, `character:patient:expansion-${direction}`)));
    return values.every((value) => value.visible && !value.neutralVisible && value.stillId === identity.id && value.atlas?.startsWith(`character-still:${identity.id}:`));
  }, { timeout: 15_000 }).toBe(true);

  const samples = await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    scene.scene.pause();
    scene.characterWalkMilliseconds = 0;
    scene.characterPresentationWasFrozen = false;
    scene.routeMotionTracks.clear();
    scene.characterMotionSnapshots.clear();
    const read = () => Object.fromEntries(["south", "east", "west", "north"].map((direction) => {
      const container = scene.characterBitmapContainers.get(`character:patient:expansion-${direction}`);
      const image = container?.getByName("actor");
      return [direction, { x: container?.x, y: container?.y, atlas: image?.getData("gait-atlas-id"), flip: image?.getData("gait-flip-x") }];
    }));
    const result = [];
    scene.update(0, 0);
    result.push(read());
    for (let phase = 1; phase < 8; phase += 1) { scene.update(phase * 180, 180); result.push(read()); }
    return result;
  });

  for (const direction of ["south", "east", "west", "north"] as const) {
    const values = samples.map((sample: any) => sample[direction]);
    expect(values.map((value: any) => value.atlas)).toEqual(walk.directions[direction].frames.map((frame: any) =>
      `character-still:${identity.id}:${frame.sha256.slice(0, 12)}`));
    expect(values.every((value: any) => value.flip === false)).toBe(true);
    expect(values.some((value: any, index: number) => index > 0 && (value.x !== values[index - 1].x || value.y !== values[index - 1].y))).toBe(true);
  }

  const staticResult = await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    const model = scene.bridge.viewModel as any;
    const patient = model.patients.find((value: any) => value.instanceId === "expansion-south");
    const key = "character:patient:expansion-south";
    const read = () => { const image = scene.characterBitmapContainers.get(key)?.getByName("actor"); return { atlas: image?.getData("gait-atlas-id"), width: image?.displayWidth, height: image?.displayHeight }; };
    model.paused = true; scene.update(2_000, 900); const pausedA = read(); scene.update(2_900, 900); const pausedB = read();
    model.paused = false; Object.assign(patient, { moving: false, path: [], pathIndex: 0, direction: "front", seated: false, pose: undefined });
    scene.routeMotionTracks.delete(key); scene.characterMotionSnapshots.delete(key); scene.update(3_000, 0); const stopped = read();
    Object.assign(patient, { seated: true, pose: "seated" }); scene.characterMotionSnapshots.delete(key); scene.update(3_000, 0); const firstSeatDraw = read();
    return { pausedA, pausedB, stopped, firstSeatDraw };
  });
  expect(staticResult.pausedB).toEqual(staticResult.pausedA);
  expect(staticResult.stopped.atlas).toBe(`character-still:${identity.id}:${still.poses.stand.south.sha256.slice(0, 12)}`);
  expect(staticResult.firstSeatDraw.width).toBe(staticResult.stopped.width);
  expect(staticResult.firstSeatDraw.height).toBe(staticResult.stopped.height);
  await expect.poll(() => actor(capture, "character:patient:expansion-south").then((value) => value.atlas))
    .toBe(`character-still:${identity.id}:${still.poses.sit.south.sha256.slice(0, 12)}`);
  await capture.getByTestId("facility-canvas").screenshot({
    path: `${EXPANSION_SCREENSHOT_DIRECTORY}/${identity.slug}-four-cardinal.png`, animations: "disabled",
  });
  await capture.close();
});
