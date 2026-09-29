import { expect, test, type Page } from "@playwright/test";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  gameReducer,
  getEncounterPatientLocation,
  getCurrentQuestion,
  getRoomDefinition,
  getRoomNavigationAnchor,
  type GameState,
} from "@gamify-surgery/game-domain";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PROFILE_KEY,
  getActiveState,
  getProfile,
  startClinic,
} from "./helpers";

const SHOTS = process.env.GAMIFY_PROCEDURE_SCREENSHOT_ROOT ?? "artifacts/screenshots";

type ProcedureFixture = "minor" | "ultrasound" | "no-ultrasound";

test.beforeAll(() => mkdirSync(SHOTS, { recursive: true }));

function fixtureState(state: GameState, fixture: ProcedureFixture): GameState {
  state.facilityLevel = 1;
  state.cash = 20_000;
  state.cashCents = 2_000_000;
  state.paused = true;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.founderActivity = null;
  state.rooms = [
    ...state.rooms.filter((room) => room.roomDefinitionId === "room.front_desk"),
    { id: "room.procedure.exam", roomDefinitionId: "room.examination", x: fixture === "minor" ? 29 : 34, y: fixture === "minor" ? 23 : 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...(fixture === "minor" ? [{ id: "room.procedure.minor", roomDefinitionId: "room.minor_procedure", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 }] : []),
    ...(fixture === "ultrasound" ? [{ id: "room.procedure.ultrasound", roomDefinitionId: "room.ultrasound", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 }] : []),
    ...([24, 25, 26, 27, 28] as const).map((y) => ({ id: `room.procedure.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  ];
  state.doors = [
    { id: "door.procedure.front", roomId: "room.instance.founder_desk", side: "south", offset: 2, exterior: true },
    { id: "door.procedure.front-hall", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    { id: "door.procedure.exam", roomId: "room.procedure.exam", side: fixture === "minor" ? "east" : "south", offset: fixture === "minor" ? 1 : 1, exterior: false },
    ...(fixture === "minor" ? [{ id: "door.procedure.minor", roomId: "room.procedure.minor", side: "west", offset: 1, exterior: false }] : []),
    ...(fixture === "ultrasound" ? [
      { id: "door.procedure.ultrasound.patient", roomId: "room.procedure.ultrasound", side: "south", offset: 2, exterior: false },
      { id: "door.procedure.ultrasound.staff", roomId: "room.procedure.ultrasound", side: "west", offset: 1, exterior: false },
    ] : []),
  ];
  state.employees = fixture === "ultrasound" ? [{
    id: "employee.procedure.imaging", staffRoleDefinitionId: "staff.imaging_technician",
    displayName: "Imaging Technician", appearance: state.founder.appearance,
    hiredAtFacilityTick: 0, salaryPerExpenseInterval: 26, morale: 90,
    trainingLevel: 1, homeRoomInstanceId: "room.procedure.ultrasound",
    location: { x: 32, y: 24 }, path: [{ x: 32, y: 24 }], pathIndex: 0,
    lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null,
  }] : [];
  return state;
}

function seedQuestion(state: GameState, caseId: string, conceptId: string, encounterId: string): GameState {
  let next = gameReducer(state, {
    type: "ADMIT_PATIENT", operationId: `${encounterId}.admit`, encounterId, caseId,
    patientDisplayName: `${encounterId} Patient`, arrivalClass: "routine",
  });
  const encounter = next.encounters[encounterId]!;
  const index = encounter.frozenCase.decisionNodes.findIndex((node) => node.primaryConceptId === conceptId);
  if (index < 0) throw new Error(`Missing ${conceptId} in ${caseId}.`);
  encounter.currentNodeIndex = index;
  encounter.steps.forEach((step, stepIndex) => {
    step.status = stepIndex < index ? "completed" : stepIndex === index ? "action_required" : "locked";
  });
  encounter.patientMovement = null;
  const exam = next.rooms.find((room) => room.id === "room.procedure.exam")!;
  encounter.patientLocation = getRoomNavigationAnchor(
    exam,
    getRoomDefinition(exam.roomDefinitionId)!,
    "primary",
  );
  encounter.assignedRoomInstanceId = "room.procedure.exam";
  encounter.checkInStatus = "checked_in";
  encounter.queuedCareRoomInstanceId = null;
  encounter.waitingDestination = null;
  encounter.lifecycle = "active_action_required";
  next.openChartEncounterId = null;
  next.attendedEncounterId = null;
  return next;
}

async function installOnce(page: Page, state: GameState, name: string, marker: string): Promise<void> {
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((candidate) => candidate.campaignId === profile.activeCampaignId);
  if (!campaign) throw new Error("Active campaign is missing.");
  campaign.name = name;
  campaign.serializedState = JSON.stringify(state);
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ storageKey, value, sessionMarker }) => {
    if (sessionStorage.getItem(sessionMarker)) return;
    sessionStorage.setItem(sessionMarker, "installed");
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, { storageKey: PROFILE_KEY, value: profile, sessionMarker: marker });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: `Resume ${name}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

async function openAndEnact(page: Page, encounterId: string): Promise<GameState> {
  await page.getByText(`${encounterId} Patient`, { exact: true }).click();
  await expect.poll(async () => {
    const state = (await getActiveState(page)) as unknown as GameState;
    return state.openChartEncounterId === encounterId && state.encounters[encounterId]?.patientMovement === null;
  }, { timeout: 30_000 }).toBe(true);
  const state = (await getActiveState(page)) as unknown as GameState;
  const question = getCurrentQuestion(state, encounterId)!;
  const hasResultGate = question.node.resultGateAfter !== null;
  const correct = question.node.answerChoices.find((choice) => choice.isCorrect)!;
  await page.getByRole("button", { name: new RegExp(`^${correct.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`) }).click();
  if (hasResultGate) {
    await page.getByRole("button", { name: "Enact Plan", exact: true }).click({ timeout: 10_000 });
    const returnToClinic = page.getByRole("button", { name: "Return to clinic", exact: true });
    if (await returnToClinic.isVisible()) await returnToClinic.click({ timeout: 10_000 });
    await expect.poll(async () => {
      const latest = (await getActiveState(page)) as unknown as GameState;
      return latest.encounters[encounterId]?.lifecycle;
    }).toBe("active_pending_result");
  } else {
    await page.getByRole("button", { name: "Resolve Completed Chart", exact: true }).click({ timeout: 10_000 });
  }
  return (await getActiveState(page)) as unknown as GameState;
}

async function resumeAt4x(page: Page): Promise<void> {
  const fast = page.getByRole("button", { name: "Set facility speed to 4x" });
  if (await fast.isVisible()) await fast.click();
  const resume = page.getByRole("button", { name: "Resume facility time" });
  if (await resume.isVisible()) await resume.click();
}

async function resumeAt1x(page: Page): Promise<void> {
  const normal = page.getByRole("button", { name: "Set facility speed to 1x" });
  if (await normal.isVisible()) await normal.click();
  const resume = page.getByRole("button", { name: "Resume facility time" });
  if (await resume.isVisible()) await resume.click();
}

async function pause(page: Page): Promise<void> {
  const pauseButton = page.getByRole("button", { name: "Pause facility time" });
  if (await pauseButton.isVisible()) await pauseButton.click();
}

async function centerRoomInView(page: Page, roomInstanceId: string): Promise<void> {
  await page.evaluate((id) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host?.__facilityGame?.scene?.getScene("facility-scene");
    const room = scene?.bridge?.viewModel?.rooms?.find((candidate: any) => candidate.instanceId === id);
    if (!scene || !room) throw new Error(`Missing live room ${id}.`);
    scene.applyCamera({ ...scene.cameraView, panX: 0, panY: 0 });
    const layout = scene.layout;
    const centerX = layout.originX + (room.tileX + room.width / 2) * layout.tileSize;
    const centerY = layout.originY + (room.tileY + room.height / 2) * layout.tileSize;
    scene.applyCamera({ ...scene.cameraView, panX: scene.scale.width / 2 - centerX, panY: scene.scale.height / 2 - centerY });
    scene.refreshLayout(true);
    scene.drawCharacters();
  }, roomInstanceId);
}

async function renderedActors(page: Page, encounterId: string) {
  await page.waitForFunction((id) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host?.__facilityGame?.scene?.getScene("facility-scene");
    return scene?.bridge?.viewModel?.patients?.some((candidate: any) => candidate.instanceId === id);
  }, encounterId, { timeout: 10_000 });
  return page.evaluate((id) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host?.__facilityGame?.scene?.getScene("facility-scene");
    const view = scene?.bridge?.viewModel;
    const patient = view?.patients?.find((candidate: any) => candidate.instanceId === id);
    const graphic = (key: string) => {
      const item = scene?.characterBitmapContainers?.get(key) ?? scene?.characterGraphics?.get(key);
      const bounds = item?.getBounds?.();
      return item && bounds ? { visible: item.visible, x: item.x, y: item.y, left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom } : null;
    };
    return {
      logicalPatient: patient?.location ?? null,
      logicalFounder: view?.founder?.location ?? null,
      logicalStaff: view?.staff?.map((candidate: any) => ({ id: candidate.instanceId, location: candidate.location })) ?? [],
      patient: graphic(`character:patient:${id}`),
      founder: graphic("character:founder"),
      staff: view?.staff?.map((candidate: any) => graphic(`character:staff:${candidate.instanceId}`)) ?? [],
      rooms: view?.rooms?.map((room: any) => ({ instanceId: room.instanceId, tileX: room.tileX, tileY: room.tileY, width: room.width, height: room.height })) ?? [],
      layout: scene?.layout ? { originX: scene.layout.originX, originY: scene.layout.originY, tileSize: scene.layout.tileSize } : null,
    };
  }, encounterId);
}

function expectRenderedInRoom(
  rendered: { visible: boolean; x: number; y: number; left: number; right: number; top: number; bottom: number } | null,
  room: { tileX: number; tileY: number; width: number; height: number } | undefined,
  layout: { originX: number; originY: number; tileSize: number } | null,
): void {
  expect(rendered).toMatchObject({ visible: true });
  expect(room).toBeDefined();
  expect(layout).not.toBeNull();
  const centerX = rendered!.x;
  const footY = rendered!.y;
  expect(centerX).toBeGreaterThan(layout!.originX + room!.tileX * layout!.tileSize);
  expect(centerX).toBeLessThan(layout!.originX + (room!.tileX + room!.width) * layout!.tileSize);
  expect(footY).toBeGreaterThan(layout!.originY + room!.tileY * layout!.tileSize);
  expect(footY).toBeLessThan(layout!.originY + (room!.tileY + room!.height + 1) * layout!.tileSize);
}

function expectRenderedOutsideRoom(
  rendered: { visible: boolean; x: number; y: number } | null,
  room: { tileX: number; tileY: number; width: number; height: number } | undefined,
  layout: { originX: number; originY: number; tileSize: number } | null,
): void {
  expect(rendered).toMatchObject({ visible: true });
  expect(room).toBeDefined();
  expect(layout).not.toBeNull();
  const left = layout!.originX + room!.tileX * layout!.tileSize;
  const right = left + room!.width * layout!.tileSize;
  const top = layout!.originY + room!.tileY * layout!.tileSize;
  const bottom = top + (room!.height + 1) * layout!.tileSize;
  expect(
    rendered!.x < left || rendered!.x > right ||
    rendered!.y < top || rendered!.y > bottom,
  ).toBe(true);
}

function expectRenderedAt(logical: { x: number; y: number } | null, rendered: { visible: boolean; x: number; y: number; left: number; right: number; top: number; bottom: number } | null): void {
  expect(logical).not.toBeNull();
  expect(rendered).toMatchObject({ visible: true });
  // Bounds are real Phaser output, while the tolerated vertical band permits
  // the sprite's feet-relative drawing baseline.
  expect(rendered!.right - rendered!.left).toBeGreaterThan(4);
  expect(rendered!.bottom - rendered!.top).toBeGreaterThan(4);
}

test("approved ultrasound FNA occupies the patient and imaging tech for 60 minutes", async ({ page }, testInfo) => {
  testInfo.setTimeout(120_000);
  test.skip(testInfo.project.name !== "desktop-chrome", "Desktop browser acceptance only.");
  await startClinic(page, "Procedure FNA Founder", "Procedure FNA Clinic");
  const encounterId = "procedure-fna";
  let state = fixtureState((await getActiveState(page)) as unknown as GameState, "ultrasound");
  state = seedQuestion(state, "case.thyroid-nodule.palpable-referral", "concept.thyroid-nodule.fna-selection", encounterId);
  await installOnce(page, state, "Procedure FNA Clinic", "procedure-fna-install");
  let pendingState = await openAndEnact(page, encounterId);
  let pending = pendingState.encounters[encounterId]!.pendingResult!;
  expect(pending).toMatchObject({
    routeId: "route.thyroid_fna.in_house",
    approvedProcedureTimingVersion: 1,
    imagingTechnicianId: "employee.procedure.imaging",
    providerReservation: null,
  });
  expect(pending.timingPhases?.filter((phase) => phase.resourceBound).map((phase) => phase.durationTicks)).toEqual([60]);
  await resumeAt4x(page);
  await expect.poll(async () => {
    const current = (await getActiveState(page)) as unknown as GameState;
    const active = current.encounters[encounterId]!.pendingResult!;
    return current.facilityTick >= active.timingPhases![0]!.startsAtTick + 3 && current.facilityTick < active.timingPhases![0]!.endsAtTick;
  }, { timeout: 45_000 }).toBe(true);
  await centerRoomInView(page, "room.procedure.ultrasound");
  await page.screenshot({ path: `${SHOTS}/gs023-procedure-fna-unpaused.png`, animations: "disabled" });
  await pause(page);
  pendingState = (await getActiveState(page)) as unknown as GameState;
  pending = pendingState.encounters[encounterId]!.pendingResult!;
  const phase = pending.timingPhases![0]!;
  expect(phase.endsAtTick - phase.startsAtTick).toBe(60);
  expect(pendingState.encounters[encounterId]!.assignedRoomInstanceId).toBeNull();
  expect(pending.patientTravel?.destinationRoomInstanceId).toBe("room.procedure.ultrasound");
  expect(getEncounterPatientLocation(pendingState, encounterId)).toEqual(pending.patientTravel?.outboundPath.at(-1));
  expect(pendingState.environment.founderActivity).toBeNull();
  expect(pendingState.employees[0]!.facilityTask).toMatchObject({ kind: "perform_imaging" });
  const live = await renderedActors(page, encounterId);
  expectRenderedAt(live.logicalPatient, live.patient);
  expectRenderedAt(live.logicalFounder, live.founder);
  expectRenderedAt(live.logicalStaff[0]?.location ?? null, live.staff[0] ?? null);
  const ultrasoundRoom = live.rooms.find((room: any) => room.instanceId === "room.procedure.ultrasound");
  expectRenderedInRoom(live.patient, ultrasoundRoom, live.layout);
  expectRenderedInRoom(live.staff[0] ?? null, ultrasoundRoom, live.layout);
  expectRenderedOutsideRoom(live.founder, ultrasoundRoom, live.layout);
  await page.screenshot({ path: `${SHOTS}/gs023-procedure-fna-live.png`, animations: "disabled" });

});

test("diagnostic skin biopsy leaves the minor room after 15 minutes and persists its external result", async ({ page }, testInfo) => {
  testInfo.setTimeout(120_000);
  test.skip(testInfo.project.name !== "desktop-chrome", "Desktop browser acceptance only.");
  await startClinic(page, "Procedure Skin Founder", "Procedure Skin Clinic");
  const encounterId = "procedure-skin";
  let state = fixtureState((await getActiveState(page)) as unknown as GameState, "minor");
  const candidate = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((clinicalCase) => clinicalCase.decisionNodes.some((node) => node.resultGateAfter?.resultTypeId === "service.cutaneous_lesion_biopsy"));
  if (!candidate) throw new Error("No diagnostic skin biopsy case is available.");
  const node = candidate.decisionNodes.find((item) => item.resultGateAfter?.resultTypeId === "service.cutaneous_lesion_biopsy")!;
  state = seedQuestion(state, candidate.id, node.primaryConceptId, encounterId);
  await installOnce(page, state, "Procedure Skin Clinic", "procedure-skin-install");
  await openAndEnact(page, encounterId);
  await resumeAt1x(page);
  await expect.poll(async () => {
    const current = (await getActiveState(page)) as unknown as GameState;
    const pending = current.encounters[encounterId]!.pendingResult!;
    return current.facilityTick >= pending.timingPhases![0]!.startsAtTick + 2 && current.facilityTick < pending.timingPhases![0]!.endsAtTick;
  }, { timeout: 45_000 }).toBe(true);
  let current = (await getActiveState(page)) as unknown as GameState;
  let pending = current.encounters[encounterId]!.pendingResult!;
  expect(pending.timingPhases![0]!.endsAtTick - pending.timingPhases![0]!.startsAtTick).toBe(15);
  expect(current.encounters[encounterId]!.assignedRoomInstanceId).toBeNull();
  expect(getEncounterPatientLocation(current, encounterId)).toEqual(pending.patientTravel?.outboundPath.at(-1));
  const skinLive = await renderedActors(page, encounterId);
  expectRenderedAt(skinLive.logicalPatient, skinLive.patient);
  expectRenderedAt(skinLive.logicalFounder, skinLive.founder);
  const minorRoom = skinLive.rooms.find((room: any) => room.instanceId === "room.procedure.minor");
  expectRenderedInRoom(skinLive.patient, minorRoom, skinLive.layout);
  expectRenderedInRoom(skinLive.founder, minorRoom, skinLive.layout);
  await centerRoomInView(page, "room.procedure.minor");
  await page.screenshot({ path: `${SHOTS}/gs023-procedure-skin-unpaused.png`, animations: "disabled" });
  await page.screenshot({ path: `${SHOTS}/gs023-procedure-skin-live.png`, animations: "disabled" });
  await pause(page);
  await resumeAt4x(page);
  await expect.poll(async () => {
    const latest = (await getActiveState(page)) as unknown as GameState;
    const result = latest.encounters[encounterId]!.pendingResult!;
    return latest.facilityTick >= result.patientTravel!.returnArrivalTick && latest.facilityTick < result.dueTick;
  }, { timeout: 45_000 }).toBe(true);
  await centerRoomInView(page, "room.instance.founder_desk");
  await page.screenshot({ path: `${SHOTS}/gs023-procedure-skin-returned-unpaused.png`, animations: "disabled" });
  await pause(page);
  current = (await getActiveState(page)) as unknown as GameState;
  pending = current.encounters[encounterId]!.pendingResult!;
  expect(current.encounters[encounterId]!.assignedRoomInstanceId).not.toBe("room.procedure.minor");
  expect(current.encounters[encounterId]!.waitingDestination?.roomInstanceId).not.toBe("room.procedure.minor");
  const skinReturned = await renderedActors(page, encounterId);
  expectRenderedAt(skinReturned.logicalPatient, skinReturned.patient);
  expect(getEncounterPatientLocation(current, encounterId)).toEqual(current.encounters[encounterId]!.waitingDestination?.location);
  const roomLeft = skinReturned.layout!.originX + minorRoom!.tileX * skinReturned.layout!.tileSize;
  const roomRight = roomLeft + minorRoom!.width * skinReturned.layout!.tileSize;
  const roomTop = skinReturned.layout!.originY + minorRoom!.tileY * skinReturned.layout!.tileSize;
  const roomBottom = roomTop + (minorRoom!.height + 1) * skinReturned.layout!.tileSize;
  expect(
    skinReturned.patient!.x < roomLeft || skinReturned.patient!.x > roomRight ||
    skinReturned.patient!.y < roomTop || skinReturned.patient!.y > roomBottom,
  ).toBe(true);
  await page.screenshot({ path: `${SHOTS}/gs023-procedure-skin-returned.png`, animations: "disabled" });
  const beforeReload = JSON.parse(JSON.stringify(current.encounters[encounterId]!.pendingResult));
  await page.reload();
  const resume = page.getByRole("button", { name: "Resume Procedure Skin Clinic" });
  if (await resume.isVisible()) await resume.click();
  const reloaded = (await getActiveState(page)) as unknown as GameState;
  expect(reloaded.encounters[encounterId]!.pendingResult).toEqual(beforeReload);
});

test("office banding is a 30-minute minor-room operation", async ({ page }, testInfo) => {
  testInfo.setTimeout(90_000);
  test.skip(testInfo.project.name !== "desktop-chrome", "Desktop browser acceptance only.");
  await startClinic(page, "Procedure Banding Founder", "Procedure Banding Clinic");
  const encounterId = "procedure-banding";
  let state = fixtureState((await getActiveState(page)) as unknown as GameState, "minor");
  state = seedQuestion(state, "case.internal-hemorrhoids.commute", "concept.internal-hemorrhoids.office-banding-selection", encounterId);
  await installOnce(page, state, "Procedure Banding Clinic", "procedure-banding-install");
  await openAndEnact(page, encounterId);
  await resumeAt4x(page);
  await expect.poll(async () => {
    const current = (await getActiveState(page)) as unknown as GameState;
    const operation = current.serviceOperations.find((item) => item.actorId === encounterId && item.status === "in_service");
    return Boolean(operation && current.facilityTick >= operation.phaseStartedAtFacilityTick! + 2 && current.facilityTick < operation.phaseEndsAtFacilityTick!);
  }, { timeout: 45_000 }).toBe(true);
  const bandingLive = await renderedActors(page, encounterId);
  const minorRoom = bandingLive.rooms.find((room: any) => room.instanceId === "room.procedure.minor");
  const bandingState = (await getActiveState(page)) as unknown as GameState;
  writeFileSync(
    ".local-dev/gs023-procedure-browser/banding-render-diagnostic.json",
    JSON.stringify({
      facilityTick: bandingState.facilityTick,
      encounter: bandingState.encounters[encounterId],
      derivedPatientLocation: getEncounterPatientLocation(bandingState, encounterId),
      operation: bandingState.serviceOperations.find((item) => item.actorId === encounterId),
      live: bandingLive,
    }, null, 2),
  );
  await page.screenshot({ path: `${SHOTS}/gs023-procedure-banding-diagnostic.png`, animations: "disabled" });
  expectRenderedInRoom(bandingLive.patient, minorRoom, bandingLive.layout);
  expectRenderedInRoom(bandingLive.founder, minorRoom, bandingLive.layout);
  await centerRoomInView(page, "room.procedure.minor");
  await page.screenshot({ path: `${SHOTS}/gs023-procedure-banding-unpaused.png`, animations: "disabled" });
  await pause(page);
  const current = (await getActiveState(page)) as unknown as GameState;
  const operation = current.serviceOperations.find((item) => item.actorId === encounterId)!;
  expect(operation.phaseEndsAtFacilityTick! - operation.phaseStartedAtFacilityTick!).toBe(30);
  expect(operation.reservedRoomInstanceIds).toEqual(["room.procedure.minor"]);
  expect(current.environment.founderActivity).toMatchObject({ kind: "perform_service" });
  await page.screenshot({ path: `${SHOTS}/gs023-procedure-banding-live.png`, animations: "disabled" });
});

test("reflux monitoring stays offsite and generic procedure visitors cannot appear", async ({ page }, testInfo) => {
  testInfo.setTimeout(90_000);
  test.skip(testInfo.project.name !== "desktop-chrome", "Desktop browser acceptance only.");
  await startClinic(page, "Procedure Reflux Founder", "Procedure Reflux Clinic");
  const encounterId = "procedure-reflux";
  let state = fixtureState((await getActiveState(page)) as unknown as GameState, "minor");
  const candidate = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((clinicalCase) => clinicalCase.decisionNodes.some((node) => node.resultGateAfter?.resultTypeId === "service.ambulatory_reflux_monitoring"));
  if (!candidate) throw new Error("No reflux monitoring case is available.");
  const node = candidate.decisionNodes.find((item) => item.resultGateAfter?.resultTypeId === "service.ambulatory_reflux_monitoring")!;
  state = seedQuestion(state, candidate.id, node.primaryConceptId, encounterId);
  state.serviceAppointmentsEnabled = true;
  state.nextServiceAppointmentTicks = {
    ...state.nextServiceAppointmentTicks,
    "income.minor_procedure_simple": state.facilityTick + 1,
  };
  await installOnce(page, state, "Procedure Reflux Clinic", "procedure-reflux-install");
  const current = await openAndEnact(page, encounterId);
  const pending = current.encounters[encounterId]!.pendingResult!;
  expect(pending.routeId).toBe("route.ambulatory_reflux_monitoring.outsourced");
  expect(pending.resourceReservations ?? []).toEqual([]);
  expect(pending.approvedProcedureTimingVersion).toBeUndefined();
  expect(current.serviceOperations).toEqual([]);
  expect(current.encounters[encounterId]!.assignedRoomInstanceId).not.toBe("room.procedure.minor");
  await resumeAt4x(page);
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).facilityTick, { timeout: 20_000 }).toBeGreaterThan(current.facilityTick + 20);
  await pause(page);
  const advanced = (await getActiveState(page)) as unknown as GameState;
  expect(advanced.serviceOperations.filter((operation) => operation.actorKind === "visitor" && operation.incomeLineId.includes("minor_procedure"))).toEqual([]);
});
