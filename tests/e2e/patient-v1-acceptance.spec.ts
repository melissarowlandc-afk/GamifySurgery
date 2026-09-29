import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";
import {
  getActiveState,
  getProfile,
  installLevelOneVisualState,
  startClinic,
  PROFILE_KEY,
} from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots/gs026-runtime/compatibility";

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true });
});

async function openPatientVisualFixture(page: import("@playwright/test").Page) {
  await startClinic(page, "Patient Art Founder", "Patient Art Clinic");
  await installLevelOneVisualState(page);
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await expect(page.locator(".patient-tab")).toHaveCount(1);
}

function patientIdentity(
  state: Awaited<ReturnType<typeof getActiveState>>,
  encounterId: string,
): string {
  const encounter = (state as unknown as {
    encounters: Record<string, { patientAppearance?: { patientIdentityId?: string } }>;
  }).encounters[encounterId];
  const identityId = encounter?.patientAppearance?.patientIdentityId;
  if (!identityId) {
    throw new Error(`Expected ${encounterId} to have a migrated patient identity.`);
  }
  return identityId;
}

function patientStillId(
  state: Awaited<ReturnType<typeof getActiveState>>,
  encounterId: string,
): string {
  const encounter = (state as unknown as {
    encounters: Record<string, { patientAppearance?: { stillId?: string } }>;
  }).encounters[encounterId];
  const stillId = encounter?.patientAppearance?.stillId;
  if (!stillId) throw new Error(`Expected ${encounterId} to have a cosmetic still identity.`);
  return stillId;
}

test("patient-v1 keeps the same identity through map/list/chart and reload", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Captured once at the controlled desktop viewport.");
  await page.setViewportSize({ width: 1374, height: 1000 });
  await openPatientVisualFixture(page);

  const profileForChart = await getProfile(page);
  const campaignForChart = profileForChart.campaigns.find(
    (campaign) => campaign.campaignId === profileForChart.activeCampaignId,
  );
  if (!campaignForChart) throw new Error("Missing active campaign.");
  const chartState = JSON.parse(campaignForChart.serializedState) as {
    encounters: Record<string, { checkInStatus: string }>;
  };
  chartState.encounters["encounter.visual.patient.3"]!.checkInStatus = "checked_in";
  campaignForChart.serializedState = JSON.stringify(chartState);
  await page.evaluate(({ profileKey, nextProfile }) => {
    window.localStorage.setItem(profileKey, JSON.stringify(nextProfile));
  }, { profileKey: PROFILE_KEY, nextProfile: profileForChart });
  await page.addInitScript(({ profileKey, nextProfile }) => {
    window.localStorage.setItem(profileKey, JSON.stringify(nextProfile));
  }, { profileKey: PROFILE_KEY, nextProfile: profileForChart });
  await page.reload();
  const resumeCampaign = page.getByRole("button", { name: /Resume Patient Art Clinic/ });
  if (await resumeCampaign.isVisible()) await resumeCampaign.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();

  const resumeTime = page.getByRole("button", { name: "Resume facility time" });
  if (await resumeTime.isVisible()) await resumeTime.click();

  const before = await getActiveState(page);
  const jordanIdentity = patientIdentity(before, "encounter.visual.patient.3");
  const jordanStillId = patientStillId(before, "encounter.visual.patient.3");
  expect(jordanIdentity).toMatch(/^patient\.adult\.\d{3}$/);

  const jordanTab = page.getByRole("button", { name: /Quinn Hart portrait/ });
  await expect(jordanTab).toBeVisible();
  const thumbnail = jordanTab.locator("img.pixel-avatar-still");
  await expect(jordanTab.locator(".pixel-avatar")).toHaveAttribute("data-still-id", jordanStillId);
  await expect(thumbnail).toHaveAttribute("src", new RegExp(`gs026-stills-v1/${jordanStillId.replaceAll(".", "\\.")}/stand-south\\.png$`));
  const thumbnailSrc = await thumbnail.getAttribute("src");
  expect(thumbnailSrc).toBeTruthy();
  await jordanTab.click();
  const chartPortrait = page.locator(".chart-identity-column img.pixel-avatar-still");
  await expect(chartPortrait).toHaveAttribute("src", thumbnailSrc!);
  await expect(page.locator(".facility-host canvas")).toBeVisible();
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/patient-v1-map-list-chart-desktop.png`,
    fullPage: false,
    animations: "disabled",
  });

  await page.reload();
  const resume = page.getByRole("button", { name: /Resume Patient Art Clinic/ });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  const after = await getActiveState(page);
  expect(patientIdentity(after, "encounter.visual.patient.3")).toBe(jordanIdentity);
  expect(patientStillId(after, "encounter.visual.patient.3")).toBe(jordanStillId);
  await expect(page.getByRole("button", { name: /Quinn Hart portrait/ })
    .locator("img.pixel-avatar-still"))
    .toHaveAttribute("src", new RegExp(`gs026-stills-v1/${jordanStillId.replaceAll(".", "\\.")}/stand-south\\.png$`));
});

test("patient-v1 map is responsive and the QA gallery exposes every roster identity", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Captures are controlled in the desktop browser project.");
  await page.setViewportSize({ width: 390, height: 844 });
  await openPatientVisualFixture(page);
  await expect(page.locator(".patient-tab img.pixel-avatar-still").first())
    .toHaveAttribute("src", /gs026-stills-v1\/.*\/stand-south\.png$/);
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/patient-v1-map-list-phone.png`,
    fullPage: false,
    animations: "disabled",
  });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/?prototype-tools=0&visual-qa=characters");
  const resume = page.getByRole("button", { name: /Resume Patient Art Clinic/ });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByRole("heading", { name: "Character Visual QA" })).toBeVisible();
  const roster = page.locator('[data-character-id^="patient.adult."]');
  await expect(roster).toHaveCount(50);
  await expect(page.locator(".character-qa-card")).toHaveCount(128);
  await expect(roster.first().locator("[data-static-pose]")).toHaveCount(8);
  await expect(roster.first().locator('[data-static-pose="stand-south"] img.pixel-avatar-still'))
    .toHaveAttribute("src", /stand-south\.png$/);
  await expect(roster.first().locator('[data-static-pose="sit-north"] img.pixel-avatar-still'))
    .toHaveAttribute("src", /sit-north\.png$/);
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/patient-v1-qa-gallery-desktop.png`,
    fullPage: false,
    animations: "disabled",
  });
});

test("character QA exposes explicit static cardinals without mirrored or gait-cycle art", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Captured once from the desktop QA gallery.");
  await page.setViewportSize({ width: 1374, height: 1000 });
  await openPatientVisualFixture(page);
  await page.goto("/?prototype-tools=0&visual-qa=characters");
  const resume = page.getByRole("button", { name: /Resume Patient Art Clinic/ });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByRole("heading", { name: "Character Visual QA" })).toBeVisible();

  for (const id of ["patient.adult.001", "gs022-new-employee-001", "founder.01"] as const) {
    const person = page.locator(`[data-character-id="${id}"]`);
    await expect(person).toBeVisible();
    for (const pose of ["stand-south", "stand-east", "stand-west", "stand-north", "sit-south", "sit-east", "sit-west", "sit-north"] as const) {
      const proof = person.locator(`[data-static-pose="${pose}"]`);
      await expect(proof).toBeVisible();
      await expect(proof.locator("img.pixel-avatar-still")).toHaveAttribute("src", new RegExp(`/${pose}\\.png$`));
    }
    await expect(person.locator('[data-live-route-frame]')).toHaveCount(0);
  }
  await page.locator('[data-character-id="patient.adult.001"]').screenshot({
    path: `${SCREENSHOT_DIRECTORY}/character-static-cardinals.png`,
    animations: "disabled",
  });
});

test("FacilityScene glides each live non-founder on one phase-invariant lateral still", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Captures a real Phaser facility canvas once from the controlled desktop renderer.");
  await page.setViewportSize({ width: 1374, height: 1000 });
  await openPatientVisualFixture(page);
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: /Resume Patient Art Clinic/ });
  if (await resume.isVisible()) await resume.click();
  const facility = page.getByTestId("facility-canvas");
  await expect(facility).toBeVisible();
  await page.waitForFunction(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as (HTMLDivElement & {
      __facilityGaitSnapshot?: () => unknown;
    }) | null;
    return typeof host?.__facilityGaitSnapshot === "function";
  });

  const configureHorizontalRoutes = async (east: boolean) => page.evaluate((movingEast) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as (HTMLDivElement & {
      __facilityGame?: { scene: { getScene: (key: string) => unknown } };
    });
    const scene = host.__facilityGame!.scene.getScene("facility-scene") as {
      bridge: { viewModel: Record<string, unknown> };
      routeMotionTracks: Map<string, unknown>;
    };
    const model = scene.bridge.viewModel as {
      paused: boolean;
      characterTravelTilesPerFacilityMinute: number;
      realMillisecondsPerFacilityMinuteAt1x: number;
      patients: Array<Record<string, unknown>>;
      staff: Array<Record<string, unknown>>;
      ambientPedestrians?: Array<Record<string, unknown>>;
    };
    const startX = movingEast ? 25 : 35;
    const step = movingEast ? 1 : -1;
    const route = Array.from({ length: 14 }, (_, index) => ({ x: startX + index * step, y: 31 }));
    // Preserve the persisted paused campaign while allowing the actual Phaser
    // renderer to sample its real movement/presentation seams in this opt-in
    // proof page. The domain save itself is never dispatched or changed.
    model.paused = false;
    model.characterTravelTilesPerFacilityMinute = 0.01;
    model.realMillisecondsPerFacilityMinuteAt1x = 1000;
    const apply = (actor: Record<string, unknown>, yOffset: number) => {
      const actorRoute = route.map((point) => ({ ...point, y: point.y + yOffset }));
      actor.location = actorRoute[0]; actor.path = actorRoute; actor.pathIndex = 0;
      actor.moving = true; actor.direction = "side";
    };
    const proofPatient = model.patients.find((patient) => patient.instanceId === "encounter.visual.patient.2")!;
    const proofStaff = model.staff.find((staff) => staff.instanceId === "employee.visual.receptionist")!;
    apply(proofPatient, 0);
    apply(proofStaff, 1);
    model.ambientPedestrians = [{
      instanceId: "ambient.facility-gait-proof",
      appearance: proofPatient.appearance,
      location: { ...route[0], y: 33 }, path: route.map((point) => ({ ...point, y: 33 })),
      pathIndex: 0, moving: true, direction: "side",
    }];
    scene.routeMotionTracks.clear();
  }, east);
  const snapshotAt = async (phase: number) => page.evaluate((nextPhase) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as (HTMLDivElement & {
      __facilityGame?: { scene: { getScene: (key: string) => unknown } };
      __facilityGaitSnapshot?: () => unknown;
    });
    const scene = host.__facilityGame!.scene.getScene("facility-scene") as {
      characterPhase: number;
      update: (time: number, delta: number) => void;
    };
    scene.characterPhase = nextPhase;
    // Run the exact FacilityScene update path synchronously after pinning the
    // phase. This avoids test timing jitter while still inspecting the live
    // Phaser actor objects that map rendering uses.
    scene.update(0, 0);
    return host.__facilityGaitSnapshot!() as Record<string, {
      atlasId?: string; flipX?: boolean; direction?: string; pose?: string;
    }>;
  }, phase);
  const verify = async (east: boolean) => {
    await configureHorizontalRoutes(east);
    const actorKeys = [
      "character:patient:encounter.visual.patient.2",
      "character:staff:employee.visual.receptionist",
      "character:ambient:ambient.facility-gait-proof",
    ] as const;
    await expect.poll(async () => {
      const snapshot = await snapshotAt(.1);
      return actorKeys.every((key) => Boolean(snapshot[key]?.atlasId));
    }).toBe(true);
    const snapshots: Array<Record<string, { atlasId?: string; flipX?: boolean; direction?: string; pose?: string }>> = [];
    for (let index = 0; index < 9; index += 1) snapshots.push(await snapshotAt(.1 + index * .5));
    const framesFor = (key: string) => snapshots.map((snapshot) => snapshot[key]!);
    const patientFrames = framesFor("character:patient:encounter.visual.patient.2");
    const staffFrames = framesFor("character:staff:employee.visual.receptionist");
    const passerFrames = framesFor("character:ambient:ambient.facility-gait-proof");
    for (const frames of [patientFrames, staffFrames, passerFrames]) {
      expect(frames.every((frame) => frame.direction === "side")).toBe(true);
      expect(frames.every((frame) => frame.pose === "walk-neutral")).toBe(true);
      expect(frames.every((frame) => frame.flipX === false)).toBe(true);
      expect(new Set(frames.map((frame) => frame.atlasId)).size).toBe(1);
      expect(frames[0]!.atlasId).toMatch(/^character-still:[^:]+:[0-9a-f]{12}$/);
    }
    return { patient: patientFrames[0]!.atlasId, staff: staffFrames[0]!.atlasId, passer: passerFrames[0]!.atlasId };
  };
  const west = await verify(false);
  await facility.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/character-gait-live-facility-west.png`,
    animations: "disabled",
  });
  const east = await verify(true);
  expect(east.patient).not.toBe(west.patient);
  expect(east.staff).not.toBe(west.staff);
  expect(east.passer).not.toBe(west.passer);
  await facility.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/character-gait-live-facility-east.png`,
    animations: "disabled",
  });
});

test("ambient passer preserves its patient-v1 identity without becoming a chart", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "The persisted-passer proof uses one browser project.");
  await openPatientVisualFixture(page);
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((item) => item.campaignId === profile.activeCampaignId);
  if (!campaign) throw new Error("Missing active campaign.");
  const state = JSON.parse(campaign.serializedState) as {
    environment: { ambientPedestrians: unknown[] };
  };
  state.environment.ambientPedestrians = [{
    id: "ambient-pedestrian.patient-v1-proof",
    appearance: {
      version: "pixel-avatar.v1", bodyShape: "average", hairStyle: "short",
      skinTone: 2, hairShade: 1, faceStyle: "round", outfitStyle: "plain",
      outfitShade: 1, accessory: "none", headVariant: 0, bodyVariant: 0,
      roleStyle: "patient", patientIdentityId: "patient.adult.035",
    },
    path: Array.from({ length: 76 }, (_, index) => ({ x: index - 2, y: 32 })),
    pathIndex: 31,
    lastMovedAtFacilityTick: 0,
  }];
  campaign.serializedState = JSON.stringify(state);
  await page.addInitScript(({ profileKey, nextProfile }) => {
    window.localStorage.setItem(profileKey, JSON.stringify(nextProfile));
  }, { profileKey: PROFILE_KEY, nextProfile: profile });
  await page.goto("/?prototype-tools=0");
  const resume = page.getByRole("button", { name: /Resume Patient Art Clinic/ });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  const reloaded = await getActiveState(page) as unknown as {
    environment: { ambientPedestrians: Array<{ id: string; appearance: { patientIdentityId?: string; stillId?: string } }> };
  };
  expect(reloaded.environment.ambientPedestrians).toHaveLength(1);
  expect(reloaded.environment.ambientPedestrians[0]?.appearance.patientIdentityId)
    .toBe("patient.adult.035");
  expect(reloaded.environment.ambientPedestrians[0]?.appearance.stillId)
    .toBe("patient.adult.035");
  await expect(page.getByRole("button", { name: /ambient-pedestrian/ })).toHaveCount(0);
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/patient-v1-ambient-passer-desktop.png`,
    fullPage: false,
    animations: "disabled",
  });
});
