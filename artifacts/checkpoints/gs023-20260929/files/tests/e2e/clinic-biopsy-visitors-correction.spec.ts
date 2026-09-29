import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import {
  gameReducer,
  getRoomDefinition,
  getRoomNavigationAnchor,
  type GameState,
} from "@gamify-surgery/game-domain";

import { getActiveState, getProfile, PROFILE_KEY, startClinic } from "./helpers";

const SCREENSHOTS = ".local-dev/clinic-playtest-visitors";
const GRID_WIDTH = 72;
const GRID_HEIGHT = 32;

test.beforeAll(() => mkdirSync(SCREENSHOTS, { recursive: true }));
test.setTimeout(150_000);

async function installSeed(page: Page, state: GameState, name: string, marker: string): Promise<void> {
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((item) => item.campaignId === profile.activeCampaignId)!;
  campaign.name = name;
  campaign.serializedState = JSON.stringify(state);
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ key, value, seedMarker }) => {
    if (sessionStorage.getItem(seedMarker)) return;
    sessionStorage.setItem(seedMarker, "1");
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: PROFILE_KEY, value: profile, seedMarker: marker });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: `Resume ${name}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

function installProcedureRooms(state: GameState): void {
  Object.assign(state, {
    facilityLevel: 2,
    cash: 50_000,
    cashCents: 5_000_000,
    paused: true,
    simulationSpeed: 4,
    nextRoutineArrivalTick: Number.MAX_SAFE_INTEGER,
    nextFinancialPostingTick: Number.MAX_SAFE_INTEGER,
    serviceAppointmentsEnabled: false,
    encounters: {},
    serviceOperations: [],
    serviceIncomeReceipts: [],
    openChartEncounterId: null,
    attendedEncounterId: null,
  });
  state.environment.founderActivity = null;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.rooms = [
    { id: "room.instance.founder_desk", roomDefinitionId: "room.front_desk", x: 33, y: 28, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...Array.from({ length: 5 }, (_, index) => ({ id: `clinic.hall.${index}`, roomDefinitionId: "room.hallway", x: 32, y: 24 + index, orientation: 0 as const, doorSide: null, upgradeLevel: 1, cleanliness: 100 })),
    { id: "clinic.exam", roomDefinitionId: "room.examination", x: 29, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "clinic.minor", roomDefinitionId: "room.minor_procedure", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
  ];
  state.doors = [
    { id: "clinic.front.exterior", roomId: "room.instance.founder_desk", side: "south", offset: 2, exterior: true },
    { id: "clinic.front.hall", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    { id: "clinic.minor.hall", roomId: "clinic.minor", side: "west", offset: 1, exterior: false },
    { id: "clinic.exam.hall", roomId: "clinic.exam", side: "east", offset: 1, exterior: false },
  ];
  state.employees = [];
}

async function freshProcedureState(page: Page): Promise<GameState> {
  await startClinic(page, "Biopsy Founder", "Biopsy Clinic");
  const state = (await getActiveState(page)) as unknown as GameState;
  installProcedureRooms(state);
  return state;
}

function preparePagetQuestion(state: GameState): GameState {
  const next = gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId: "paget.admit",
    encounterId: "paget-punch",
    caseId: "case.mammary-paget.crusted-nipple",
    patientDisplayName: "Paget Punch Patient",
    arrivalClass: "routine",
  });
  const encounter = next.encounters["paget-punch"]!;
  const index = encounter.frozenCase.decisionNodes.findIndex((node) =>
    node.id === "node.mammary-paget.crusted-nipple.1");
  expect(index).toBeGreaterThanOrEqual(0);
  const exam = next.rooms.find((room) => room.id === "clinic.exam")!;
  encounter.currentNodeIndex = index;
  encounter.steps.forEach((step, stepIndex) => {
    step.status = stepIndex < index ? "completed" : stepIndex === index ? "action_required" : "locked";
  });
  encounter.patientMovement = null;
  encounter.patientLocation = getRoomNavigationAnchor(
    exam,
    getRoomDefinition(exam.roomDefinitionId)!,
    "primary",
  );
  Object.assign(encounter, {
    assignedRoomInstanceId: exam.id,
    queuedCareRoomInstanceId: null,
    waitingDestination: null,
    checkInStatus: "checked_in",
    lifecycle: "active_action_required",
  });
  next.openChartEncounterId = null;
  next.attendedEncounterId = null;
  return next;
}

async function answerCorrect(page: Page, encounterId: string): Promise<void> {
  await page.getByText("Paget Punch Patient", { exact: true }).click();
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).openChartEncounterId).toBe(encounterId);
  const state = (await getActiveState(page)) as unknown as GameState;
  const encounter = state.encounters[encounterId]!;
  const choice = encounter.frozenCase.decisionNodes[encounter.currentNodeIndex]!.answerChoices.find((item) => item.isCorrect)!;
  expect(choice.id).toBe("full_thickness_1");
  await page.getByRole("button", { name: new RegExp(`^${choice.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`) }).click();
  await page.getByRole("button", { name: "Enact Plan", exact: true }).click();
  const close = page.getByRole("button", { name: "Return to clinic", exact: true });
  if (await close.isVisible()) await close.click();
}

async function resume(page: Page, speed: "1x" | "4x" = "4x"): Promise<void> {
  await page.getByRole("button", { name: `Set facility speed to ${speed}` }).click();
  await page.getByRole("button", { name: "Resume facility time" }).click();
}

async function pause(page: Page): Promise<void> {
  const button = page.getByRole("button", { name: "Pause facility time" });
  if (await button.isVisible()) await button.click();
}

async function center(page: Page, roomId: string): Promise<void> {
  await page.evaluate((id) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    const room = scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === id);
    const layout = scene.layout;
    scene.applyCamera({ ...scene.cameraView, panX: 0, panY: 0 });
    scene.applyCamera({
      ...scene.cameraView,
      panX: scene.scale.width / 2 - (layout.originX + (room.tileX + room.width / 2) * layout.tileSize),
      panY: scene.scale.height / 2 - (layout.originY + (room.tileY + room.height / 2) * layout.tileSize),
    });
    scene.refreshLayout(true);
    scene.drawCharacters();
  }, roomId);
}

function actorSnapshot(page: Page, key: string) {
  return page.evaluate((actorKey) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    const actor = scene.characterBitmapContainers.get(actorKey);
    return actor ? { visible: actor.visible, x: actor.x, y: actor.y } : null;
  }, key);
}

async function centerOnGridPoint(page: Page, point: { x: number; y: number }): Promise<void> {
  await page.evaluate((location) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    scene.applyCamera({ ...scene.cameraView, panX: 0, panY: 0 });
    const layout = scene.layout;
    const centerX = layout.originX + (location.x + 0.5) * layout.tileSize;
    const baseY = scene.actorBaseY(location.y);
    scene.applyCamera({
      ...scene.cameraView,
      panX: scene.scale.width / 2 - centerX,
      panY: scene.scale.height / 2 - baseY,
    });
    scene.refreshLayout(true);
    scene.drawCharacters();
  }, point);
}

function actorViewportSnapshot(page: Page, key: string) {
  return page.evaluate((actorKey) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    const actor = scene.characterBitmapContainers.get(actorKey);
    if (!actor) return null;
    const bounds = actor.getBounds();
    return {
      visible: actor.visible,
      x: actor.x,
      y: actor.y,
      bounds: { left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom },
      viewport: { width: scene.scale.width, height: scene.scale.height },
      intersectsViewport: bounds.right > 0 && bounds.left < scene.scale.width && bounds.bottom > 0 && bounds.top < scene.scale.height,
    };
  }, key);
}

test("the exact Paget full-thickness punch choice works in Minor Procedure before external pathology", async ({ page }) => {
  const state = preparePagetQuestion(await freshProcedureState(page));
  state.environment.founderActivity = {
    kind: "attend_encounter",
    targetId: "paget-punch",
    path: [{ ...state.environment.founderLocation }],
    pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick,
    workMinutesRemaining: Number.MAX_SAFE_INTEGER,
  };
  await installSeed(page, state, "Paget punch", "clinic-biopsy-punch.seed");
  await answerCorrect(page, "paget-punch");

  let current = (await getActiveState(page)) as unknown as GameState;
  expect(current.encounters["paget-punch"]!.pendingResult).toMatchObject({
    routeId: "route.nipple_areolar_biopsy.in_house",
    serviceIncomeLineId: "income.minor_procedure_sampling",
    serviceIncomeFee: 150,
  });
  expect(current.encounters["paget-punch"]!.patientMovement?.kind).not.toBe("leaving_after_resolution");
  await resume(page, "1x");
  await expect.poll(async () => {
    const saved = (await getActiveState(page)) as unknown as GameState;
    const active = saved.encounters["paget-punch"]!;
    const sampling = active.pendingResult?.timingPhases?.find((phase) =>
      phase.id === "phase.nipple_areolar_biopsy.sampling");
    return Boolean(sampling && active.pendingResult?.patientTravel?.destinationRoomInstanceId === "clinic.minor" &&
      active.patientMovement === null &&
      active.pendingResult?.onsiteReturn?.status === "awaiting_service_completion" &&
      active.pendingResult.providerReservation?.kind === "founder" &&
      active.pendingResult.serviceIncomeFee === 150 &&
      active.pendingResult.timingPhases &&
      active.pendingResult.timingPhases.some((phase) => phase.id === "phase.nipple_areolar_biopsy.sampling" &&
        sampling!.startsAtTick <= saved.facilityTick && saved.facilityTick < sampling!.endsAtTick));
  }, { timeout: 60_000 }).toBe(true);
  await pause(page);

  current = (await getActiveState(page)) as unknown as GameState;
  const pending = current.encounters["paget-punch"]!.pendingResult!;
  const sampling = pending.timingPhases!.find((phase) => phase.id === "phase.nipple_areolar_biopsy.sampling")!;
  expect(pending).toMatchObject({
    patientTravel: { destinationRoomInstanceId: "clinic.minor" },
    providerReservation: { kind: "founder" },
    onsiteReturn: { status: "awaiting_service_completion" },
  });
  expect(sampling.endsAtTick - sampling.startsAtTick).toBe(15);
  expect(current.serviceIncomeReceipts.filter((receipt) => receipt.actorId === "paget-punch")).toHaveLength(0);
  await center(page, "clinic.minor");
  expect(await actorSnapshot(page, "character:patient:paget-punch")).toMatchObject({ visible: true });
  expect(await actorSnapshot(page, "character:founder")).toMatchObject({ visible: true });
  await page.screenshot({ path: `${SCREENSHOTS}/paget-punch-in-minor-procedure.png`, animations: "disabled" });

  await page.reload();
  const resumeCampaign = page.getByRole("button", { name: "Resume Paget punch" });
  if (await resumeCampaign.isVisible()) await resumeCampaign.click();
  expect(((await getActiveState(page)) as unknown as GameState).encounters["paget-punch"]!.pendingResult).toMatchObject({
    patientTravel: { destinationRoomInstanceId: "clinic.minor" },
    serviceIncomeFee: 150,
  });
  await resume(page, "4x");
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).serviceIncomeReceipts.filter((receipt) => receipt.actorId === "paget-punch").length, { timeout: 75_000 }).toBe(1);
  await pause(page);
  current = (await getActiveState(page)) as unknown as GameState;
  expect(current.serviceIncomeReceipts.filter((receipt) => receipt.actorId === "paget-punch")).toEqual([expect.objectContaining({ grossAmount: 150 })]);
  expect(current.encounters["paget-punch"]!.pendingResult).toMatchObject({
    routeId: "route.nipple_areolar_biopsy.in_house",
    deliveredAtTick: null,
  });
});

function prepareScheduledUltrasound(state: GameState, seed: string): GameState {
  state.campaignSeed = seed;
  Object.assign(state, { facilityLevel: 1, paused: true, simulationSpeed: 1,
    nextRoutineArrivalTick: Number.MAX_SAFE_INTEGER, nextFinancialPostingTick: Number.MAX_SAFE_INTEGER,
    serviceAppointmentsEnabled: true, nextServiceAppointmentTicks: { "income.ultrasound": 1 },
    lastServiceAppointmentArrivalTick: null, encounters: {}, serviceOperations: [], serviceIncomeReceipts: [] });
  state.rooms = [
    { id: "room.instance.founder_desk", roomDefinitionId: "room.front_desk", x: 33, y: 28, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.test.ultrasound", roomDefinitionId: "room.ultrasound", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...[24, 25, 26, 27, 28].map((y) => ({ id: `room.test.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1, cleanliness: 100 })),
  ];
  state.doors = [
    { id: "door.test.ultrasound", roomId: "room.test.ultrasound", side: "south", offset: 2, exterior: false },
    { id: "door.test.ultrasound.staff", roomId: "room.test.ultrasound", side: "west", offset: 1, exterior: false },
    { id: "door.test.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    { id: "door.test.exterior", roomId: "room.instance.founder_desk", side: "south", offset: 2, exterior: true },
  ];
  const room = state.rooms.find((item) => item.id === "room.test.ultrasound")!;
  const location = getRoomNavigationAnchor(room, getRoomDefinition(room.roomDefinitionId)!, "staff");
  state.employees = [{ id: "employee.test.imaging", staffRoleDefinitionId: "staff.imaging_technician", displayName: "Imaging Technician", appearance: state.founder.appearance, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 26, morale: 75, trainingLevel: 1, homeRoomInstanceId: room.id, location, path: [location], pathIndex: 0, lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null }];
  return state;
}

async function scheduledVisitorProof(page: Page, wantedSide: -1 | 1): Promise<void> {
  await startClinic(page, `Visitor ${wantedSide}`, `Visitor ${wantedSide}`);
  const base = (await getActiveState(page)) as unknown as GameState;
  let selected: GameState | null = null;
  for (let index = 0; index < 32 && !selected; index += 1) {
    const candidate = prepareScheduledUltrasound(structuredClone(base), `visitor-side.${index}`);
    candidate.paused = false;
    const advanced = gameReducer(candidate, { type: "ADVANCE_TICK", operationId: `discover.${index}` });
    if (Math.sign(advanced.serviceOperations[0]?.visitorTravel?.offscreenEndpoint.x ?? 0) === wantedSide) {
      candidate.paused = true;
      selected = candidate;
    }
  }
  expect(selected).not.toBeNull();
  await installSeed(page, selected!, `Visitor ${wantedSide}`, `clinic-visitor-${wantedSide}.seed`);
  await resume(page, "1x");
  await expect.poll(async () => {
    const current = (await getActiveState(page)) as unknown as GameState;
    const visitor = current.serviceOperations[0];
    return visitor?.status === "arriving" &&
      visitor.location?.y === GRID_HEIGHT &&
      visitor.location.x >= 2 && visitor.location.x <= GRID_WIDTH - 3;
  }, { timeout: 60_000, intervals: [100, 250, 500] }).toBe(true);
  await pause(page);
  let state = (await getActiveState(page)) as unknown as GameState;
  let operation = state.serviceOperations[0]!;
  expect(Math.sign(operation.visitorTravel!.offscreenEndpoint.x)).toBe(wantedSide);
  expect(operation.pathIndex).toBeGreaterThan(0);
  expect(operation.location).toMatchObject({ y: GRID_HEIGHT });
  expect(operation.location!.x).toBeGreaterThanOrEqual(2);
  expect(operation.location!.x).toBeLessThanOrEqual(GRID_WIDTH - 3);
  const key = `character:service-visitor:${operation.actorId}`;
  const arrivalLocation = { ...operation.location! };
  const arrivalPathIndex = operation.pathIndex;
  await centerOnGridPoint(page, arrivalLocation);
  expect(await actorViewportSnapshot(page, key)).toMatchObject({ visible: true, intersectsViewport: true });
  await page.screenshot({ path: `${SCREENSHOTS}/visitor-${wantedSide}-sidewalk-arrival.png`, animations: "disabled" });
  await page.reload(); const resumeCampaign = page.getByRole("button", { name: `Resume Visitor ${wantedSide}` }); if (await resumeCampaign.isVisible()) await resumeCampaign.click();
  state = (await getActiveState(page)) as unknown as GameState;
  expect(state.serviceOperations[0]).toMatchObject({
    actorId: operation.actorId,
    status: "arriving",
    location: arrivalLocation,
    pathIndex: arrivalPathIndex,
    visitorTravel: { offscreenEndpoint: operation.visitorTravel!.offscreenEndpoint },
  });
  await resume(page, "1x");
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).serviceOperations[0]?.status, { timeout: 60_000 }).toBe("in_service");
  await pause(page); state = (await getActiveState(page)) as unknown as GameState; operation = state.serviceOperations[0]!;
  expect(operation.phaseEndsAtFacilityTick! - operation.phaseStartedAtFacilityTick!).toBe(45);
  expect(state.serviceIncomeReceipts).toHaveLength(0); await center(page, "room.test.ultrasound"); expect(await actorSnapshot(page, key)).toMatchObject({ visible: true });
  await page.screenshot({ path: `${SCREENSHOTS}/visitor-${wantedSide}-ultrasound.png`, animations: "disabled" });
  await resume(page, "4x");
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).serviceOperations[0]?.status, { timeout: 60_000 }).toBe("leaving");
  await pause(page);
  await resume(page, "1x");
  await expect.poll(async () => {
    const current = (await getActiveState(page)) as unknown as GameState;
    const visitor = current.serviceOperations[0];
    return visitor?.status === "leaving" &&
      visitor.location?.y === GRID_HEIGHT &&
      visitor.location.x >= 2 && visitor.location.x <= GRID_WIDTH - 3;
  }, { timeout: 60_000, intervals: [100, 250, 500] }).toBe(true);
  await pause(page);
  state = (await getActiveState(page)) as unknown as GameState;
  operation = state.serviceOperations[0]!;
  const departureLocation = { ...operation.location! };
  const departurePathIndex = operation.pathIndex;
  expect(operation.path.at(-1)).toEqual(operation.visitorTravel!.offscreenEndpoint);
  await centerOnGridPoint(page, departureLocation);
  expect(await actorViewportSnapshot(page, key)).toMatchObject({ visible: true, intersectsViewport: true });
  await page.screenshot({ path: `${SCREENSHOTS}/visitor-${wantedSide}-sidewalk-departure.png`, animations: "disabled" });
  await page.reload(); const reloadResume = page.getByRole("button", { name: `Resume Visitor ${wantedSide}` }); if (await reloadResume.isVisible()) await reloadResume.click();
  expect(((await getActiveState(page)) as unknown as GameState).serviceOperations[0]).toMatchObject({
    actorId: operation.actorId,
    status: "leaving",
    location: departureLocation,
    pathIndex: departurePathIndex,
    visitorTravel: { offscreenEndpoint: operation.visitorTravel!.offscreenEndpoint },
  });
  await resume(page, "4x"); await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).serviceOperations[0]?.status, { timeout: 60_000 }).toBe("completed"); await pause(page);
  state = (await getActiveState(page)) as unknown as GameState;
  expect(state.serviceOperations[0]).toMatchObject({ location: null, pathIndex: operation.path.length - 1 });
  expect(state.serviceIncomeReceipts).toEqual([expect.objectContaining({ actorId: operation.actorId, grossAmount: 120 })]);
  expect(await actorSnapshot(page, key)).toBeNull();
}

test("scheduled ultrasound visitor walks the full left sidewalk route", async ({ page }) => { await scheduledVisitorProof(page, -1); });
test("scheduled ultrasound visitor walks the full right sidewalk route", async ({ page }) => { await scheduledVisitorProof(page, 1); });
