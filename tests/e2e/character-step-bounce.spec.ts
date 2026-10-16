import { mkdirSync, readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import {
  getProfile,
  installLevelOneVisualState,
  PROFILE_KEY,
  startClinic,
  type PersistedProfile,
} from "./helpers";

const SCREENSHOT_DIRECTORY = process.env.GAMIFY_STEP_BOUNCE_SCREENSHOT_ROOT ??
  "artifacts/screenshots/gs026-step-bounce-runtime";
const registry = JSON.parse(
  readFileSync("apps/player/src/art/characterStillRegistry.generated.json", "utf8"),
) as any;

test.beforeAll(() => mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true }));

async function waitForTwoAnimationFrames(page: Page): Promise<void> {
  await page.evaluate(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
}

async function openFixture(page: Page): Promise<Page> {
  await startClinic(page, "Bounce Proof Founder", "Bounce Proof Clinic");
  await installLevelOneVisualState(page);
  const profile = await getProfile(page) as PersistedProfile;
  const active = profile.campaigns.find((campaign) =>
    campaign.campaignId === profile.activeCampaignId
  )!;
  const state = JSON.parse(active.serializedState) as any;
  state.paused = true;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.founder.appearance = {
    ...state.founder.appearance,
    stillId: "patient.adult.039",
    roleStyle: "founder",
  };
  state.founder.location = { x: 30, y: 30 };
  state.founder.path = [];
  state.founder.moving = false;
  active.serializedState = JSON.stringify(state);
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
  const resume = capture.getByRole("button", { name: /Resume Bounce Proof Clinic/ });
  if (await resume.isVisible()) await resume.click();
  await expect(capture.getByTestId("facility-canvas")).toBeVisible();
  await capture.waitForFunction(() =>
    typeof (document.querySelector("[data-testid='facility-canvas']") as any)
      ?.__facilityGaitSnapshot === "function"
  );
  return capture;
}

test("all runtime movement uses a directional still with a frozen seven-pixel bounce", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "One desktop Phaser proof is sufficient.");
  const walkRequests: string[] = [];
  page.context().on("request", (request) => {
    if (request.url().includes("gs026-simple-walk-pilot-v1")) walkRequests.push(request.url());
  });
  const capture = await openFixture(page);
  await capture.addStyleTag({ content: ".facility-pause-indicator { visibility: hidden !important; }" });
  const keys = await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)
      .__facilityGame.scene.getScene("facility-scene") as any;
    scene.scene.pause();
    const model = scene.bridge.viewModel as any;
    model.paused = false;
    model.buildMode = undefined;
    model.simulationSpeed = 1;
    model.realMillisecondsPerFacilityMinuteAt1x = 1_000;
    model.characterTravelTilesPerFacilityMinute = 2;
    Object.assign(model.founder, {
      location: { x: 30, y: 30 },
      path: Array.from({ length: 12 }, (_, index) => ({ x: 30 + index, y: 30 })),
      pathIndex: 0,
      moving: true,
      direction: "side",
    });
    const eastPath = (x: number, y: number) =>
      Array.from({ length: 12 }, (_, index) => ({ x: x + index, y }));
    const staff = model.staff[0];
    Object.assign(staff, {
      location: { x: 28, y: 32 }, path: eastPath(28, 32), pathIndex: 0,
      moving: true, direction: "side", rightFacing: true,
    });
    model.patients = [{
      instanceId: "bounce-patient", location: { x: 28, y: 34 },
      path: eastPath(28, 34), pathIndex: 0, moving: true, direction: "side",
      rightFacing: true,
      appearance: { ...model.founder.appearance, stillId: "patient.adult.001", roleStyle: "patient" },
    }];
    model.serviceVisitors = [{
      instanceId: "bounce-visitor-instance", actorId: "bounce-visitor",
      displayName: "Bounce visitor", location: { x: 28, y: 36 },
      path: eastPath(28, 36), pathIndex: 0, moving: true, direction: "side",
      rightFacing: true,
      appearance: { ...model.founder.appearance, stillId: "gs022-new-person-001", roleStyle: "patient" },
    }];
    scene.characterStepBounceMilliseconds = 0;
    scene.characterPresentationWasFrozen = false;
    scene.routeMotionTracks.clear();
    scene.characterMotionSnapshots.clear();
    scene.characterStepBounceStates.clear();
    const keys = [
      "character:founder",
      `character:staff:${staff.instanceId}`,
      "character:patient:bounce-patient",
      "character:service-visitor:bounce-visitor",
    ];
    scene.update(0, 0);
    return keys;
  });
  await expect.poll(() => capture.evaluate((actorKeys) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)
      .__facilityGame.scene.getScene("facility-scene") as any;
    scene.drawCharacters();
    return actorKeys.every((key) => {
      const container = scene.characterBitmapContainers.get(key);
      return Boolean(container?.visible && container.getByName("actor")?.visible);
    });
  }, keys)).toBe(true);
  const movingEvidence = await capture.evaluate((actorKeys) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)
      .__facilityGame.scene.getScene("facility-scene") as any;
    const read = () => Object.fromEntries(actorKeys.map((key) => {
      const container = scene.characterBitmapContainers.get(key);
      const actor = container?.getByName("actor");
      return [key, {
        groundY: container?.y, depth: container?.depth, actorLocalY: actor?.y,
        angle: actor?.angle, atlas: actor?.getData("gait-atlas-id"), pose: actor?.getData("gait-pose"),
      }];
    }));
    scene.characterStepBounceMilliseconds = 0;
    scene.characterStepBounceStates.clear();
    scene.characterMotionSnapshots.clear();
    scene.routeMotionTracks.clear();
    scene.update(0, 0);
    const ground = read();
    scene.characterStepBounceMilliseconds = 250;
    scene.drawCharacters();
    return { ground, peak: read(), keys: actorKeys };
  }, keys);
  await waitForTwoAnimationFrames(capture);
  await capture.getByTestId("facility-canvas").screenshot({
    path: `${SCREENSHOT_DIRECTORY}/directional-still-little-bounce-peak.png`,
    animations: "disabled",
  });
  await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)
      .__facilityGame.scene.getScene("facility-scene") as any;
    scene.characterStepBounceMilliseconds = 0;
    scene.drawCharacters();
  });
  await waitForTwoAnimationFrames(capture);
  await capture.getByTestId("facility-canvas").screenshot({
    path: `${SCREENSHOT_DIRECTORY}/directional-still-little-bounce-ground.png`,
    animations: "disabled",
  });
  await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)
      .__facilityGame.scene.getScene("facility-scene") as any;
    scene.characterStepBounceMilliseconds = 250;
    scene.drawCharacters();
  });
  const staticEvidence = await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)
      .__facilityGame.scene.getScene("facility-scene") as any;
    const model = scene.bridge.viewModel as any;
    const read = () => {
      const container = scene.characterBitmapContainers.get("character:founder");
      const actor = container?.getByName("actor");
      return { groundY: container?.y, depth: container?.depth, actorLocalY: actor?.y, angle: actor?.angle, atlas: actor?.getData("gait-atlas-id"), pose: actor?.getData("gait-pose") };
    };
    model.paused = true;
    scene.update(2_000, 1_750);
    const paused = read();
    model.paused = false;
    scene.update(10_000, 8_000);
    const resumedWithoutLeap = read();
    model.buildMode = {};
    scene.update(12_000, 2_000);
    const buildFrozen = read();
    model.buildMode = undefined;
    Object.assign(model.founder, {
      location: { x: 30, y: 30 },
      path: Array.from({ length: 12 }, (_, index) => ({ x: 30, y: 30 + index })),
      pathIndex: 0,
      moving: true,
      direction: "front",
      seated: false,
    });
    scene.routeMotionTracks.clear();
    scene.characterStepBounceMilliseconds = 250;
    scene.drawCharacters();
    const northPeak = read();
    Object.assign(model.founder, { path: [], pathIndex: 0, moving: false, seated: true });
    scene.routeMotionTracks.clear();
    scene.drawCharacters();
    const seatedImmediately = read();
    Object.assign(model.founder, {
      location: { x: 30, y: 30 },
      path: Array.from({ length: 12 }, (_, index) => ({ x: 30, y: 30 + index })),
      pathIndex: 0,
      moving: true,
      direction: "front",
      seated: false,
    });
    scene.routeMotionTracks.clear();
    scene.characterStepBounceStates.clear();
    scene.characterStepBounceMilliseconds = 0;
    scene.drawCharacters();
    scene.characterStepBounceMilliseconds = 250;
    scene.drawCharacters();
    const restartPeak = read();
    Object.assign(model.founder, {
      path: [], pathIndex: 0, moving: false, direction: "front", seated: false,
    });
    scene.routeMotionTracks.clear();
    scene.characterMotionSnapshots.clear();
    scene.drawCharacters();
    const stopStart = read();
    scene.drawCharacters();
    const repeatedStopStart = read();
    scene.characterStepBounceMilliseconds = 310;
    scene.drawCharacters();
    const halfwayStop = read();
    scene.drawCharacters();
    const repeatedHalfwayStop = read();
    scene.characterStepBounceMilliseconds = 370;
    scene.drawCharacters();
    const stopped = read();
    Object.assign(model.founder, { seated: true });
    scene.characterMotionSnapshots.clear();
    scene.update(10_000, 0);
    const seated = read();
    return { paused, resumedWithoutLeap, buildFrozen, northPeak, seatedImmediately, restartPeak, stopStart, repeatedStopStart, halfwayStop, repeatedHalfwayStop, stopped, seated };
  });

  const entry = registry.characters.find((candidate: any) => candidate.id === "patient.adult.039");
  const eastStanding = `character-still:patient.adult.039:${entry.poses.stand.east.sha256.slice(0, 12)}`;
  for (const key of movingEvidence.keys) {
    const ground = movingEvidence.ground[key];
    const peak = movingEvidence.peak[key];
    expect(ground.actorLocalY).toBeCloseTo(0, 10);
    expect(peak.actorLocalY).toBeCloseTo(-7, 5);
    expect(peak.angle).toBeCloseTo(0, 5);
    expect(peak.groundY).toBe(ground.groundY);
    expect(peak.depth).toBe(ground.depth);
    expect(peak.atlas).toBe(ground.atlas);
    expect(peak.pose).toBe("walk-neutral");
  }
  expect(movingEvidence.ground["character:founder"].atlas).toBe(eastStanding);
  expect(staticEvidence.paused).toEqual(movingEvidence.peak["character:founder"]);
  expect(staticEvidence.resumedWithoutLeap).toEqual(movingEvidence.peak["character:founder"]);
  expect(staticEvidence.buildFrozen).toEqual(movingEvidence.peak["character:founder"]);
  expect(staticEvidence.northPeak.actorLocalY).toBeCloseTo(-7, 5);
  expect(Math.abs(staticEvidence.northPeak.angle)).toBeCloseTo(1.5, 5);
  expect(staticEvidence.seatedImmediately.actorLocalY).toBeCloseTo(0, 10);
  expect(staticEvidence.seatedImmediately.angle).toBeCloseTo(0, 10);
  expect(staticEvidence.restartPeak.actorLocalY).toBeCloseTo(-7, 5);
  expect(Math.abs(staticEvidence.restartPeak.angle)).toBeCloseTo(1.5, 5);
  expect(staticEvidence.repeatedStopStart).toEqual(staticEvidence.stopStart);
  expect(staticEvidence.stopStart.actorLocalY).toBeCloseTo(-7, 5);
  expect(Math.abs(staticEvidence.stopStart.angle)).toBeCloseTo(1.5, 5);
  expect(staticEvidence.halfwayStop.actorLocalY).toBeCloseTo(-3.5, 5);
  expect(Math.abs(staticEvidence.halfwayStop.angle)).toBeCloseTo(0.75, 5);
  expect(staticEvidence.repeatedHalfwayStop).toEqual(staticEvidence.halfwayStop);
  expect(staticEvidence.stopped.actorLocalY).toBeCloseTo(0, 10);
  expect(staticEvidence.stopped.angle).toBeCloseTo(0, 10);
  expect(staticEvidence.seated.actorLocalY).toBeCloseTo(0, 10);
  expect(staticEvidence.seated.angle).toBeCloseTo(0, 10);
  expect(walkRequests).toEqual([]);
  await capture.close();
});
