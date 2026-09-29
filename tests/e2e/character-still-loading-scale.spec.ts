import { mkdirSync, readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import {
  getProfile,
  installLevelOneVisualState,
  startClinic,
  PROFILE_KEY,
  type PersistedProfile,
} from "./helpers";

const SCREENSHOT_DIRECTORY = process.env.GAMIFY_STILL_LOADING_SCREENSHOT_ROOT ??
  "artifacts/screenshots/gs026-loading-scale";
const registry = JSON.parse(
  readFileSync("apps/player/src/art/characterStillRegistry.generated.json", "utf8"),
) as {
  characters: Array<{
    id: string;
    poses: Record<"stand" | "sit", Record<"south" | "east" | "west" | "north", {
      url: string;
      sha256: string;
      anchors: { floorY: number; seatContactY?: number };
      visibleBounds: { y: number };
    }>>;
  }>;
};

const entry = (id: string) => registry.characters.find((candidate) => candidate.id === id)!;
const asset = (id: string, posture: "stand" | "sit", direction: "south" | "east" | "west" | "north") =>
  entry(id).poses[posture][direction];

test.beforeAll(() => mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true }));

async function openFixture(page: Page): Promise<Page> {
  await startClinic(page, "Loading Scale Founder", "Loading Scale Clinic");
  await installLevelOneVisualState(page);
  const profile = await getProfile(page) as PersistedProfile;
  const active = profile.campaigns.find((campaign) => campaign.campaignId === profile.activeCampaignId)!;
  const state = JSON.parse(active.serializedState) as any;
  state.paused = true;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.founder.appearance = { ...state.founder.appearance, stillId: "founder.18", roleStyle: "founder" };
  state.founder.location = { x: 31, y: 30 };
  state.founder.path = [];
  state.founder.moving = false;
  active.serializedState = JSON.stringify(state);
  await page.evaluate(({ key, value }) => localStorage.setItem(key, value), {
    key: PROFILE_KEY,
    value: JSON.stringify(profile),
  });

  const capture = await page.context().newPage();
  await capture.setViewportSize({ width: 1440, height: 1000 });
  await capture.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = capture.getByRole("button", { name: /Resume Loading Scale Clinic/ });
  if (await resume.isVisible()) await resume.click();
  await expect(capture.getByTestId("facility-canvas")).toBeVisible();
  await capture.waitForFunction(() =>
    typeof (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGaitSnapshot === "function",
  );
  return capture;
}

async function liveActor(page: Page, key: string) {
  return page.evaluate((actorKey) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    const container = scene.characterBitmapContainers.get(actorKey);
    const actor = container?.getByName("actor");
    const graphics = scene.characterGraphics.get(actorKey);
    return {
      containerVisible: Boolean(container?.visible),
      neutralVisible: Boolean(graphics?.visible),
      x: container?.x,
      y: container?.y,
      width: actor?.displayWidth,
      height: actor?.displayHeight,
      stillId: actor?.getData("gait-still-id"),
      atlas: actor?.getData("gait-atlas-id"),
      direction: actor?.getData("gait-direction"),
      pose: actor?.getData("gait-pose"),
    };
  }, key);
}

test("cold turns retain colored identity art and identity scale stays stable through a paused cold seat", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "One controlled desktop renderer proof is sufficient.");

  let releaseEast!: () => void;
  let releaseSeat!: () => void;
  const eastGate = new Promise<void>((resolve) => { releaseEast = resolve; });
  const seatGate = new Promise<void>((resolve) => { releaseSeat = resolve; });
  const requestedStillPaths: string[] = [];
  page.context().on("request", (request) => {
    const path = new URL(request.url()).pathname;
    if (path.includes("/gs026-stills-v1/")) requestedStillPaths.push(path);
  });
  await page.context().route("**/gs026-stills-v1/founder.18/stand-east.png", async (route) => {
    await eastGate;
    await route.continue();
  });
  await page.context().route("**/gs026-stills-v1/patient.adult.040/sit-south.png", async (route) => {
    await seatGate;
    await route.continue();
  });

  const capture = await openFixture(page);
  await capture.addStyleTag({ content: ".facility-pause-indicator { visibility: hidden !important; }" });
  const founderKey = "character:founder";
  const founderSouth = asset("founder.18", "stand", "south");
  const founderEast = asset("founder.18", "stand", "east");
  await expect.poll(() => liveActor(capture, founderKey)).toMatchObject({
    containerVisible: true,
    neutralVisible: false,
    atlas: `character-still:founder.18:${founderSouth.sha256.slice(0, 12)}`,
    direction: "front",
  });

  await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    const founder = scene.bridge.viewModel.founder;
    Object.assign(founder, {
      location: { x: 31, y: 30 },
      path: Array.from({ length: 6 }, (_, index) => ({ x: 31 + index, y: 30 })),
      pathIndex: 0, moving: true, direction: "side",
    });
    scene.bridge.viewModel.paused = false;
    scene.bridge.viewModel.characterTravelTilesPerFacilityMinute = 30;
    scene.bridge.viewModel.realMillisecondsPerFacilityMinuteAt1x = 60_000;
    scene.routeMotionTracks.delete("character:founder");
    scene.update(0, 0);
  });
  const retainedSteps = [];
  for (let index = 0; index < 3; index += 1) {
    await capture.evaluate((time) => {
      const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
      scene.update(time, 250);
    }, 250 + index * 250);
    retainedSteps.push(await liveActor(capture, founderKey));
  }
  const retained = retainedSteps.at(-1)!;
  expect(retained).toMatchObject({
    containerVisible: true,
    neutralVisible: false,
    stillId: "founder.18",
    atlas: `character-still:founder.18:${founderSouth.sha256.slice(0, 12)}`,
    direction: "front",
  });
  expect(new Set(retainedSteps.map((step) => step.x)).size).toBeGreaterThan(1);
  expect(retainedSteps.every((step) => step.containerVisible && !step.neutralVisible)).toBe(true);
  await capture.getByTestId("facility-canvas").screenshot({
    path: `${SCREENSHOT_DIRECTORY}/cold-east-retains-south.png`, animations: "disabled",
  });

  releaseEast();
  await expect.poll(() => liveActor(capture, founderKey)).toMatchObject({
    containerVisible: true,
    neutralVisible: false,
    atlas: `character-still:founder.18:${founderEast.sha256.slice(0, 12)}`,
    direction: "side",
  });

  const initialRequests = requestedStillPaths.filter((path) => !path.includes("/sit-") && !path.includes("/clipboard"));
  const requestedByIdentity = new Map<string, Set<string>>();
  for (const path of initialRequests) {
    const match = /\/gs026-stills-v1\/([^/]+)\/(stand-(?:south|east|west|north))\.png$/.exec(path);
    if (!match) continue;
    const poses = requestedByIdentity.get(match[1]!) ?? new Set<string>();
    poses.add(match[2]!);
    requestedByIdentity.set(match[1]!, poses);
  }
  expect(requestedByIdentity.get("founder.18")).toEqual(new Set([
    "stand-south", "stand-east", "stand-west", "stand-north",
  ]));
  expect([...requestedByIdentity.values()].every((poses) => poses.size <= 4)).toBe(true);

  const proof = await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    const model = scene.bridge.viewModel as any;
    const base = {
      version: "pixel-avatar.v1", bodyShape: "average", hairStyle: "short", skinTone: 1,
      hairShade: 1, faceStyle: "round", outfitStyle: "plain", outfitShade: 1,
      accessory: "none", headVariant: 0, bodyVariant: 0,
    };
    Object.assign(model.founder, {
      location: { x: 29, y: 30 }, path: [], moving: false, direction: "front",
      appearance: { ...base, stillId: "founder.18", roleStyle: "founder" },
    });
    model.staff = [{
      instanceId: "scale-employee", displayName: "Employee", roleDisplayName: "Staff",
      homeRoomInstanceId: null, location: { x: 31, y: 30 }, path: [], moving: false,
      direction: "front", appearance: { ...base, stillId: "gs022-new-employee-001", roleStyle: "receptionist" },
    }];
    model.patients = [{
      instanceId: "scale-p40", displayName: "Patient", status: "active",
      location: { x: 33, y: 30 }, path: [], moving: false, direction: "front",
      appearance: { ...base, stillId: "patient.adult.040", roleStyle: "patient" },
    }];
    model.ambientPedestrians = [
      ["scale-founder01", "founder.01", 35], ["scale-founder11", "founder.11", 37],
    ].map(([instanceId, stillId, x]) => ({
      instanceId, location: { x, y: 30 }, path: [], moving: false, direction: "front",
      appearance: { ...base, stillId, roleStyle: "founder" },
    }));
    model.paused = false;
    scene.routeMotionTracks.clear();
    scene.characterMotionSnapshots.clear();
    scene.update(0, 0);
    return true;
  });
  expect(proof).toBe(true);

  const scaleActors = {
    "founder.18": "character:founder",
    "gs022-new-employee-001": "character:staff:scale-employee",
    "patient.adult.040": "character:patient:scale-p40",
    "founder.01": "character:ambient:scale-founder01",
    "founder.11": "character:ambient:scale-founder11",
  } as const;
  await expect.poll(async () =>
    (await Promise.all(Object.values(scaleActors).map((key) => liveActor(capture, key))))
      .every((actor) => actor.containerVisible && !actor.neutralVisible),
  ).toBe(true);
  const rendered = Object.fromEntries(await Promise.all(Object.entries(scaleActors).map(async ([id, key]) => [id, await liveActor(capture, key)])));
  const founder01Height = rendered["founder.01"]!.height!;
  const referenceWorldHeight = founder01Height * 246 / 320;
  for (const [id, actor] of Object.entries(rendered)) {
    const south = asset(id, "stand", "south");
    const visibleWorldHeight = actor.height! * (south.anchors.floorY - south.visibleBounds.y) / 320;
    expect(visibleWorldHeight).toBeLessThanOrEqual(referenceWorldHeight + 1);
  }
  await capture.getByTestId("facility-canvas").screenshot({
    path: `${SCREENSHOT_DIRECTORY}/identity-height-cap.png`, animations: "disabled",
  });

  await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    scene.bridge.viewModel.founder.appearance.stillId = "future.unknown";
    scene.characterMotionSnapshots.delete("character:founder");
    scene.update(0, 0);
  });
  await expect.poll(() => liveActor(capture, founderKey)).toMatchObject({
    containerVisible: false,
    neutralVisible: true,
  });
  await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    scene.bridge.viewModel.founder.appearance.stillId = "founder.18";
    scene.characterMotionSnapshots.delete("character:founder");
    scene.update(0, 0);
  });
  await expect.poll(() => liveActor(capture, founderKey)).toMatchObject({
    containerVisible: true,
    neutralVisible: false,
    stillId: "founder.18",
  });

  const patientKey = "character:patient:scale-p40";
  const standingPatient = await liveActor(capture, patientKey);
  const seatTarget = await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    const model = scene.bridge.viewModel as any;
    const room = model.rooms.find((candidate: any) => candidate.definitionId === "room.waiting");
    if (!room) throw new Error("Waiting room missing.");
    let selected: any;
    for (let y = room.tileY; y < room.tileY + 4 && !selected; y += 1) {
      for (let x = room.tileX; x < room.tileX + 4 && !selected; x += 1) {
        const display = scene.getApprovedActorSupportDisplayPosition({ x, y }, false, "waiting-seat");
        if (display) selected = { location: { x, y }, display };
      }
    }
    if (!selected) throw new Error("Waiting room seat support missing.");
    const patient = model.patients.find((candidate: any) => candidate.instanceId === "scale-p40");
    Object.assign(patient, { location: selected.location, path: [], moving: false, direction: "front", pose: "seated", supportRole: "waiting-seat" });
    model.paused = false;
    scene.characterMotionSnapshots.delete("character:patient:scale-p40");
    scene.update(0, 0);
    return selected.display;
  });
  const coldSeat = await liveActor(capture, patientKey);
  expect(coldSeat).toMatchObject({
    containerVisible: true,
    neutralVisible: false,
    atlas: `character-still:patient.adult.040:${asset("patient.adult.040", "stand", "south").sha256.slice(0, 12)}`,
  });
  expect({ width: coldSeat.width, height: coldSeat.height }).toEqual({
    width: standingPatient.width, height: standingPatient.height,
  });
  await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    scene.bridge.viewModel.paused = true;
    scene.update(0, 0);
  });
  expect((await liveActor(capture, patientKey)).y).toBe(coldSeat.y);

  releaseSeat();
  const seatedAsset = asset("patient.adult.040", "sit", "south");
  await expect.poll(() => liveActor(capture, patientKey)).toMatchObject({
    containerVisible: true,
    neutralVisible: false,
    atlas: `character-still:patient.adult.040:${seatedAsset.sha256.slice(0, 12)}`,
    pose: "seated",
  });
  const loadedSeat = await liveActor(capture, patientKey);
  expect({ width: loadedSeat.width, height: loadedSeat.height }).toEqual({
    width: standingPatient.width, height: standingPatient.height,
  });
  const expectedSeatBase = seatTarget.baseY +
    (seatedAsset.anchors.floorY - seatedAsset.anchors.seatContactY!) * loadedSeat.height! / 320;
  expect(Math.abs(loadedSeat.y! - expectedSeatBase)).toBeLessThanOrEqual(0.51);
  expect(loadedSeat.y).toBe(coldSeat.y);
  await capture.getByTestId("facility-canvas").screenshot({
    path: `${SCREENSHOT_DIRECTORY}/paused-cold-seat-upgrade.png`, animations: "disabled",
  });
  await capture.close();
});
