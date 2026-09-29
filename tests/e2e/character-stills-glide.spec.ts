import { mkdirSync, readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import {
  getActiveState,
  getProfile,
  installLevelOneVisualState,
  openCampaignScreen,
  startClinic,
  type PersistedProfile,
} from "./helpers";

const SCREENSHOT_DIRECTORY = process.env.GAMIFY_STILL_GLIDE_SCREENSHOT_ROOT ??
  "artifacts/screenshots/gs026-runtime";
const PROFILE_KEY = "gamify-surgery.prototype.profile.v1";
const registry = JSON.parse(readFileSync("apps/player/src/art/characterStillRegistry.generated.json", "utf8")) as any;
function still(id: string, posture: "stand" | "sit", direction: "south" | "east" | "west" | "north") {
  return registry.characters.find((entry: any) => entry.id === id)!.poses[posture][direction] as { url: string; sha256: string; anchors: { seatContactY?: number } };
}

type LiveSnapshot = {
  atlasId?: string; frame?: string; flipX?: boolean; direction?: string; pose?: string;
  visible: boolean; displayWidth?: number; displayHeight?: number; originY?: number;
};

test.beforeAll(() => mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true }));

async function openProofFixture(page: Page): Promise<Page> {
  await startClinic(page, "GS026 Proof Founder", "GS026 Proof Clinic");
  await installLevelOneVisualState(page);
  const profile = await getProfile(page) as PersistedProfile;
  const active = profile.campaigns.find((campaign) => campaign.campaignId === profile.activeCampaignId)!;
  const state = JSON.parse(active.serializedState) as any;
  state.paused = true;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.founder.appearance = { ...state.founder.appearance, stillId: "founder.01", roleStyle: "founder" };
  state.employees[0].appearance = { ...state.employees[0].appearance, stillId: "gs022-new-employee-001", roleStyle: "receptionist" };
  const patient = Object.values(state.encounters)[0] as any;
  if (patient?.patientAppearance) patient.patientAppearance = { ...patient.patientAppearance, stillId: "gs022-new-person-001", roleStyle: "patient" };
  active.serializedState = JSON.stringify(state);
  await page.evaluate(({ key, value }) => localStorage.setItem(key, value), { key: PROFILE_KEY, value: JSON.stringify(profile) });

  // Keep the source tab alive: its pagehide handler must not overwrite this
  // controlled persisted fixture while the capture tab renders it.
  const capture = await page.context().newPage();
  await capture.setViewportSize({ width: 1440, height: 1000 });
  await capture.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = capture.getByRole("button", { name: /Resume GS026 Proof Clinic/ });
  if (await resume.isVisible()) await resume.click();
  await expect(capture.getByTestId("facility-canvas")).toBeVisible();
  await capture.waitForFunction(() => typeof (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGaitSnapshot === "function");
  return capture;
}

async function snapshots(page: Page): Promise<Record<string, LiveSnapshot>> {
  return page.evaluate(() => (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGaitSnapshot());
}

test("live Phaser glides GS-026 stills by cardinal direction and preserves corrected seated anchors", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "One desktop renderer proof is sufficient.");
  const capture = await openProofFixture(page);
  await capture.addStyleTag({ content: ".facility-pause-indicator { visibility: hidden !important; }" });

  const seated = await capture.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    const model = scene.bridge.viewModel as any;
    const waitingRoom = model.rooms.find((value: any) => value.definitionId === "room.waiting");
    if (!waitingRoom) throw new Error("Waiting room was not available.");
    const supportLocation = (() => {
      for (let y = waitingRoom.tileY; y < waitingRoom.tileY + 4; y += 1) for (let x = waitingRoom.tileX; x < waitingRoom.tileX + 4; x += 1) {
        if (scene.getApprovedActorSupportDisplayPosition({ x, y }, false, "waiting-seat")) return { x, y };
      }
      throw new Error("Waiting-room approved seated support was not found.");
    })();
    const frontLocation = (() => {
      for (let y = 20; y < 42; y += 1) for (let x = 20; x < 48; x += 1) {
        if (scene.getFrontDeskV5ActorDisplayPosition({ x, y }, false, "public")?.seatTarget) return { x, y };
      }
      throw new Error("Front Desk visitor support was not found.");
    })();
    const front = scene.getFrontDeskV5ActorDisplayPosition(frontLocation, false, "public");
    if (!front?.seatTarget) throw new Error("Front Desk visitor support was not available.");
    model.paused = true;
    model.patients = [
      { instanceId: "gs026-p01", location: frontLocation, path: [], pathIndex: 0, moving: false, direction: "front", pose: "seated", supportRole: "front-desk-public", appearance: { ...model.founder.appearance, stillId: "patient.adult.001", roleStyle: "patient" } },
      { instanceId: "gs026-p40", location: supportLocation, path: [], pathIndex: 0, moving: false, direction: "front", pose: "seated", supportRole: "waiting-seat", appearance: { ...model.founder.appearance, stillId: "patient.adult.040", roleStyle: "patient" } },
    ];
    scene.routeMotionTracks.clear(); scene.characterMotionSnapshots.clear(); scene.update(0, 0);
    return { front, waiting: scene.getApprovedActorSupportDisplayPosition(supportLocation, false, "waiting-seat"), waitingRoom: waitingRoom.definitionId };
  });
  expect(seated.waitingRoom).toBe("room.waiting");
  await expect.poll(() => snapshots(capture).then((value) => value["character:patient:gs026-p01"]?.visible)).toBe(true);
  const seatedActors = await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    const read = (key: string) => { const container = scene.characterBitmapContainers.get(key); const actor = container?.getByName("actor"); return { y: container?.y, width: actor?.displayWidth, height: actor?.displayHeight, atlas: actor?.getData("gait-atlas-id"), frame: actor?.getData("gait-frame") }; };
    return { p01: read("character:patient:gs026-p01"), p40: read("character:patient:gs026-p40") };
  });
  const p01Seat = still("patient.adult.001", "sit", "south");
  const p40Seat = still("patient.adult.040", "sit", "south");
  for (const [proof, asset, display] of [[seatedActors.p01, p01Seat, seated.front], [seatedActors.p40, p40Seat, seated.waiting]] as const) {
    expect(proof.width).toBeCloseTo(proof.height / 2, 5);
    expect(Math.abs(proof.y - (display.baseY + (287 - asset.anchors.seatContactY!) * proof.height / 320))).toBeLessThanOrEqual(0.51);
    expect(proof.atlas).toMatch(/^character-still:/);
    expect(proof.frame).toMatch(/^frame:character-still:/);
  }
  const pausedRedraw = await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    scene.update(0, 0);
    return ["character:patient:gs026-p01", "character:patient:gs026-p40"].map((key) => scene.characterBitmapContainers.get(key)?.y);
  });
  expect(pausedRedraw).toEqual([seatedActors.p01.y, seatedActors.p40.y]);
  await capture.getByTestId("facility-canvas").screenshot({ path: `${SCREENSHOT_DIRECTORY}/corrected-seats.png`, animations: "disabled" });
  await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    const patients = scene.bridge.viewModel.patients as any[];
    Object.assign(patients[0], { location: { x: 31, y: 31 }, pose: "idle", seated: false });
    Object.assign(patients[1], { location: { x: 33, y: 31 }, pose: "idle", seated: false });
    scene.bridge.viewModel.paused = false; scene.characterMotionSnapshots.clear(); scene.update(0, 0);
  });
  await expect.poll(() => snapshots(capture).then((value) => value["character:patient:gs026-p01"]?.visible && value["character:patient:gs026-p40"]?.visible)).toBe(true);
  const standing = await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    const size = (key: string) => { const actor = scene.characterBitmapContainers.get(key)?.getByName("actor"); return { width: actor?.displayWidth, height: actor?.displayHeight }; };
    return { p01: size("character:patient:gs026-p01"), p40: size("character:patient:gs026-p40") };
  });
  expect(standing.p01).toEqual({ width: seatedActors.p01.width, height: seatedActors.p01.height });
  expect(standing.p40).toEqual({ width: seatedActors.p40.width, height: seatedActors.p40.height });
  await capture.getByTestId("facility-canvas").screenshot({ path: `${SCREENSHOT_DIRECTORY}/corrected-standing-comparison.png`, animations: "disabled" });

  await capture.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    const model = scene.bridge.viewModel as any;
    model.paused = false; model.characterTravelTilesPerFacilityMinute = 30; model.realMillisecondsPerFacilityMinuteAt1x = 60_000; model.simulationSpeed = 1;
    const base = { version: "pixel-avatar.v1", bodyShape: "average", hairStyle: "short", skinTone: 1, hairShade: 1, faceStyle: "round", outfitStyle: "plain", outfitShade: 1, accessory: "none", headVariant: 0, bodyVariant: 0, roleStyle: "patient" };
    model.patients = [
      ["south", "patient.adult.001", Array.from({ length: 14 }, (_, index) => ({ x: 29, y: 30 + index }))], ["north", "patient.adult.040", Array.from({ length: 14 }, (_, index) => ({ x: 31, y: 31 - index }))],
      ["east", "gs022-new-person-001", Array.from({ length: 14 }, (_, index) => ({ x: 33 + index, y: 30 }))], ["west", "gs022-new-employee-001", Array.from({ length: 14 }, (_, index) => ({ x: 38 - index, y: 31 }))],
    ].map(([id, stillId, path]: any) => ({ instanceId: `gs026-route-${id}`, location: path[0], path, pathIndex: 0, moving: true, direction: "front", appearance: { ...base, stillId } }));
    scene.routeMotionTracks.clear(); scene.characterMotionSnapshots.clear(); scene.update(0, 0);
  });
  await capture.waitForTimeout(1_000);
  const routeResult = await capture.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    const read = () => Object.fromEntries([...scene.characterBitmapContainers.entries()].filter(([key]: any) => key.includes("gs026-route")).map(([key, value]: any) => { const actor = value.getByName("actor"); return [key, { x: value.x, y: value.y, atlas: actor.getData("gait-atlas-id"), frame: actor.getData("gait-frame"), flip: actor.getData("gait-flip-x"), direction: actor.getData("gait-direction"), pose: actor.getData("gait-pose") }]; }));
    // The fixture's persisted campaign remains paused outside this one
    // renderer-only sample. The first update drops the normal resume delta;
    // the two following live Scene updates advance its adjacent-node route.
    scene.bridge.viewModel.paused = false;
    scene.update(0, 0); const first = read(); scene.characterPhase = 1; scene.update(0, 200); const second = read(); scene.characterPhase = 2; scene.update(0, 200); return { first, second, third: read() };
  });
  for (const direction of ["south", "north", "east", "west"] as const) {
    const key = `character:patient:gs026-route-${direction}`;
    const first = routeResult.first[key]; const second = routeResult.second[key]; const third = routeResult.third[key];
    const id = direction === "south" ? "patient.adult.001" : direction === "north" ? "patient.adult.040" : direction === "east" ? "gs022-new-person-001" : "gs022-new-employee-001";
    const asset = still(id, "stand", direction);
    expect(second.atlas).toBe(`character-still:${id}:${asset.sha256.slice(0, 12)}`); expect(second.frame).toBe(`frame:character-still:${id}:${asset.sha256.slice(0, 12)}:0`); expect(second.flip).toBe(false);
    expect(second.pose).toBe("walk-neutral");
    expect([second.atlas, third.atlas]).toEqual([first.atlas, first.atlas]);
    expect([second.frame, third.frame]).toEqual([first.frame, first.frame]);
    expect(second.x !== first.x || second.y !== first.y, `${direction} route advances: ${JSON.stringify({ first, second, third })}`).toBe(true);
    expect(second.atlas).not.toMatch(/^(character:actors-|character:patients-|character:founders-)/);
  }
  await capture.getByTestId("facility-canvas").screenshot({ path: `${SCREENSHOT_DIRECTORY}/four-cardinal-glide.png`, animations: "disabled" });
  await capture.close();
});

test("founder choice 36 persists its GS-026 portrait across reload", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "One persisted founder selection proof is sufficient.");
  await openCampaignScreen(page); await page.getByRole("button", { name: "New Campaign" }).click();
  await page.getByRole("button", { name: "Previous founder" }).click();
  await expect(page.getByText("Founder 36 of 36")).toBeVisible();
  const preview = page.locator(".founder-preview-avatar");
  await expect(preview).toHaveAttribute("data-art-source", "gs026-character-still-v1");
  await expect(preview.locator("img.pixel-avatar-still")).toHaveAttribute("src", /characters\/gs026-stills-v1/);
  await page.screenshot({ path: `${SCREENSHOT_DIRECTORY}/founder-choice-36.png`, animations: "disabled" });
  await page.getByLabel("Founder name").fill("Extra Founder"); await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Build a Surgery Clinic" }).click(); await page.getByLabel("Clinic name").fill("Extra Founder Clinic"); await page.getByRole("button", { name: "Open the Clinic" }).click();
  expect((await getActiveState(page) as any).founder.appearance.stillId).toBe("mixed-20260910-patient-02");
  await page.reload(); await page.getByRole("button", { name: /Resume Extra Founder Clinic/ }).click(); await expect(page.getByTestId("facility-canvas")).toBeVisible();
  expect((await getActiveState(page) as any).founder.appearance.stillId).toBe("mixed-20260910-patient-02");
});
