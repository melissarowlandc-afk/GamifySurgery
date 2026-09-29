import { expect, test, type Page } from "@playwright/test";
import {
  gameReducer,
  getCurrentQuestion,
  getEncounterPatientLocation,
  getRoomDefinition,
  getRoomNavigationAnchor,
  type GameState,
} from "@gamify-surgery/game-domain";
import { mkdirSync } from "node:fs";
import {
  PROFILE_KEY,
  getActiveState,
  getProfile,
  startClinic,
} from "./helpers";

const EVIDENCE = ".local-dev/gs025-browser/departures";

type DepartureFixture = {
  id: "minor" | "ultrasound";
  roomId: string;
  caseId: string;
  conceptId: string;
};

const DEPARTURE_FIXTURES: readonly DepartureFixture[] = [
  {
    id: "minor",
    roomId: "room.gs025.minor",
    caseId: "case.breast-cyst.under-30-painful-simple",
    conceptId: "concept.breast-cyst.symptomatic-simple-aspiration",
  },
  {
    id: "ultrasound",
    roomId: "room.gs025.ultrasound",
    caseId: "case.lactational-breast-abscess.tender-upper-breast",
    conceptId: "concept.lactational-breast-abscess.selected-drainage",
  },
];

test.beforeAll(() => mkdirSync(EVIDENCE, { recursive: true }));

function fixtureState(
  state: GameState,
  fixture: DepartureFixture,
  includeWaitingRoom = false,
): GameState {
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
  const minor = fixture.id === "minor";
  state.rooms = [
    ...state.rooms.filter((room) => room.roomDefinitionId === "room.front_desk"),
    {
      id: "room.gs025.exam",
      roomDefinitionId: "room.examination",
      x: minor ? 29 : 34,
      y: minor ? 23 : 26,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
    {
      id: fixture.roomId,
      roomDefinitionId: minor ? "room.minor_procedure" : "room.ultrasound",
      x: 33,
      y: 23,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
    ...(includeWaitingRoom
      ? [{
          id: "room.gs025.waiting",
          roomDefinitionId: "room.waiting",
          x: 29,
          y: 28,
          orientation: 0 as const,
          doorSide: null,
          upgradeLevel: 1 as const,
          cleanliness: 100,
        }]
      : []),
    ...([24, 25, 26, 27, 28] as const).map((y) => ({
      id: `room.gs025.hall.${y}`,
      roomDefinitionId: "room.hallway",
      x: 32,
      y,
      orientation: 0 as const,
      doorSide: null,
      upgradeLevel: 1 as const,
      cleanliness: 100,
    })),
  ];
  state.doors = [
    { id: "door.gs025.front", roomId: "room.instance.founder_desk", side: "south", offset: 2, exterior: true },
    { id: "door.gs025.front-hall", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    { id: "door.gs025.exam", roomId: "room.gs025.exam", side: minor ? "east" : "south", offset: 1, exterior: false },
    ...(includeWaitingRoom
      ? [{
          id: "door.gs025.waiting",
          roomId: "room.gs025.waiting",
          side: "east" as const,
          offset: 0,
          exterior: false,
        }]
      : []),
    ...(minor
      ? [{ id: "door.gs025.minor", roomId: fixture.roomId, side: "west" as const, offset: 1, exterior: false }]
      : [
          { id: "door.gs025.ultrasound.patient", roomId: fixture.roomId, side: "south" as const, offset: 2, exterior: false },
          { id: "door.gs025.ultrasound.staff", roomId: fixture.roomId, side: "west" as const, offset: 1, exterior: false },
        ]),
  ];
  state.employees = minor
    ? []
    : [{
        id: "employee.gs025.imaging",
        staffRoleDefinitionId: "staff.imaging_technician",
        displayName: "Imaging Technician",
        appearance: state.founder.appearance,
        hiredAtFacilityTick: 0,
        salaryPerExpenseInterval: 26,
        morale: 90,
        trainingLevel: 1,
        homeRoomInstanceId: fixture.roomId,
        location: { x: 32, y: 24 },
        path: [{ x: 32, y: 24 }],
        pathIndex: 0,
        lastMovedAtFacilityTick: 0,
        lastPraisedAtFacilityTick: null,
        nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER,
        facilityTask: null,
      }];
  return state;
}

function seedQuestion(
  state: GameState,
  caseId: string,
  conceptId: string,
  encounterId: string,
): GameState {
  const next = gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId: `${encounterId}.admit`,
    encounterId,
    caseId,
    patientDisplayName: `${encounterId} Patient`,
    arrivalClass: "routine",
  });
  const encounter = next.encounters[encounterId]!;
  const index = encounter.frozenCase.decisionNodes.findIndex(
    (node) => node.primaryConceptId === conceptId,
  );
  if (index < 0) throw new Error(`Missing ${conceptId} in ${caseId}.`);
  encounter.currentNodeIndex = index;
  encounter.steps.forEach((step, stepIndex) => {
    step.status = stepIndex < index
      ? "completed"
      : stepIndex === index
        ? "action_required"
        : "locked";
  });
  const exam = next.rooms.find((room) => room.id === "room.gs025.exam")!;
  encounter.patientMovement = null;
  encounter.patientLocation = getRoomNavigationAnchor(
    exam,
    getRoomDefinition(exam.roomDefinitionId)!,
    "primary",
  );
  encounter.assignedRoomInstanceId = exam.id;
  encounter.checkInStatus = "checked_in";
  encounter.queuedCareRoomInstanceId = null;
  encounter.waitingDestination = null;
  encounter.lifecycle = "active_action_required";
  next.openChartEncounterId = null;
  next.attendedEncounterId = null;
  return next;
}

function seedTerminalQuestion(
  state: GameState,
  fixture: DepartureFixture,
  encounterId: string,
): GameState {
  const next = gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId: `${encounterId}.admit`,
    encounterId,
    caseId: fixture.caseId,
    patientDisplayName: `${fixture.id} departure patient`,
    arrivalClass: "routine",
  });
  const encounter = next.encounters[encounterId]!;
  const index = encounter.frozenCase.decisionNodes.findIndex(
    (node) => node.primaryConceptId === fixture.conceptId,
  );
  if (index < 0 || index !== encounter.frozenCase.decisionNodes.length - 1) {
    throw new Error(`${fixture.id} fixture must point at a terminal procedure decision.`);
  }
  encounter.currentNodeIndex = index;
  encounter.steps.forEach((step, stepIndex) => {
    step.status = stepIndex < index ? "completed" : "action_required";
  });
  const exam = next.rooms.find((room) => room.id === "room.gs025.exam")!;
  encounter.patientMovement = null;
  encounter.patientLocation = getRoomNavigationAnchor(
    exam,
    getRoomDefinition(exam.roomDefinitionId)!,
    "primary",
  );
  encounter.assignedRoomInstanceId = exam.id;
  encounter.checkInStatus = "checked_in";
  encounter.queuedCareRoomInstanceId = null;
  encounter.waitingDestination = null;
  encounter.lifecycle = "active_action_required";
  next.openChartEncounterId = null;
  next.attendedEncounterId = null;
  return next;
}

async function installFixture(
  page: Page,
  state: GameState,
  campaignName: string,
  marker: string,
): Promise<void> {
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find(
    (candidate) => candidate.campaignId === profile.activeCampaignId,
  );
  if (!campaign) throw new Error("Active isolated campaign is missing.");
  campaign.name = campaignName;
  campaign.serializedState = JSON.stringify(state);
  profile.tutorialsEnabled = false;
  await page.addInitScript(
    ({ storageKey, value, sessionMarker }) => {
      if (sessionStorage.getItem(sessionMarker)) return;
      sessionStorage.setItem(sessionMarker, "installed");
      localStorage.setItem(storageKey, JSON.stringify(value));
    },
    { storageKey: PROFILE_KEY, value: profile, sessionMarker: marker },
  );
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: `Resume ${campaignName}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

async function enactTerminalProcedure(page: Page, encounterId: string): Promise<void> {
  await page.getByText("departure patient", { exact: false }).click();
  await expect.poll(async () => {
    const state = (await getActiveState(page)) as unknown as GameState;
    return state.openChartEncounterId === encounterId;
  }).toBe(true);
  const state = (await getActiveState(page)) as unknown as GameState;
  const question = getCurrentQuestion(state, encounterId)!;
  const correct = question.node.answerChoices.find((choice) => choice.isCorrect)!;
  await page.getByRole("button", {
    name: new RegExp(`^${correct.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
  }).click();
  if (question.node.resultGateAfter !== null) {
    await page.getByRole("button", { name: "Enact Plan", exact: true }).click();
    const returnToClinic = page.getByRole("button", { name: "Return to clinic", exact: true });
    if (await returnToClinic.isVisible()) await returnToClinic.click();
  } else {
    await page.getByRole("button", { name: "Resolve Completed Chart", exact: true }).click();
  }
}

async function orderResultGatedService(
  page: Page,
  encounterId: string,
): Promise<GameState> {
  await page.getByText(`${encounterId} Patient`, { exact: true }).click();
  await expect.poll(async () => {
    const state = (await getActiveState(page)) as unknown as GameState;
    return state.openChartEncounterId === encounterId;
  }).toBe(true);
  const state = (await getActiveState(page)) as unknown as GameState;
  const question = getCurrentQuestion(state, encounterId)!;
  expect(question.node.resultGateAfter).not.toBeNull();
  const correct = question.node.answerChoices.find((choice) => choice.isCorrect)!;
  await page.getByRole("button", {
    name: new RegExp(`^${correct.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
  }).click();
  await page.getByRole("button", { name: "Enact Plan", exact: true }).click();
  const returnToClinic = page.getByRole("button", { name: "Return to clinic", exact: true });
  if (await returnToClinic.isVisible()) await returnToClinic.click();
  await expect.poll(async () => {
    const current = (await getActiveState(page)) as unknown as GameState;
    return current.encounters[encounterId]?.lifecycle;
  }).toBe("active_pending_result");
  return (await getActiveState(page)) as unknown as GameState;
}

function advanceStateToTick(
  state: GameState,
  targetTick: number,
  operationPrefix: string,
): GameState {
  let next = structuredClone(state);
  next.paused = false;
  const maximumSteps = Math.max(0, targetTick - next.facilityTick) + 1;
  for (let step = 0; step < maximumSteps && next.facilityTick < targetTick; step += 1) {
    const advanced = gameReducer(next, {
      type: "ADVANCE_TICK",
      operationId: `${operationPrefix}.${next.facilityTick + 1}`,
    });
    if (advanced.facilityTick <= next.facilityTick) {
      throw new Error(`Synthetic time jump stalled at facility tick ${next.facilityTick}.`);
    }
    next = advanced;
  }
  if (next.facilityTick !== targetTick) {
    throw new Error(`Synthetic time jump ended at ${next.facilityTick}; expected ${targetTick}.`);
  }
  return next;
}

function advanceTerminalOperationNearCompletion(
  state: GameState,
  encounterId: string,
): GameState {
  let next = structuredClone(state);
  next.paused = false;
  for (let step = 0; step < 240; step += 1) {
    const operation = next.serviceOperations.find(
      (candidate) => candidate.actorId === encounterId,
    );
    if (
      operation?.status === "in_service" &&
      operation.phaseEndsAtFacilityTick !== null &&
      operation.phaseEndsAtFacilityTick - next.facilityTick <= 2
    ) {
      next.paused = true;
      return next;
    }
    const advanced = gameReducer(next, {
      type: "ADVANCE_TICK",
      operationId: `gs025.departure.seed.${encounterId}.${next.facilityTick + 1}`,
    });
    if (advanced.facilityTick <= next.facilityTick) {
      throw new Error(`Terminal operation replay stalled at facility tick ${next.facilityTick}.`);
    }
    next = advanced;
  }
  throw new Error(`Terminal operation ${encounterId} did not reach its final two work minutes.`);
}

async function expectTerminalOperationCreated(
  page: Page,
  encounterId: string,
): Promise<GameState> {
  const state = (await getActiveState(page)) as unknown as GameState;
  const operation = state.serviceOperations.find(
    (candidate) => candidate.actorId === encounterId,
  );
  expect(operation, "the accepted terminal procedure must create its patient operation").toBeDefined();
  expect(operation!.status).toBe("waiting_for_resources");
  const submitReceipt = Object.values(state.operationReceipts)
    .filter((receipt) => receipt.commandType === "SUBMIT_ANSWER")
    .at(-1);
  expect(submitReceipt).toMatchObject({ status: "applied" });
  return state;
}

async function resumeAt(page: Page, speed: "1x" | "4x"): Promise<void> {
  const speedButton = page.getByRole("button", {
    name: `Set facility speed to ${speed}`,
  });
  if (await speedButton.isVisible()) await speedButton.click();
  const resume = page.getByRole("button", { name: "Resume facility time" });
  if (await resume.isVisible()) await resume.click();
}

async function pause(page: Page): Promise<void> {
  const button = page.getByRole("button", { name: "Pause facility time" });
  if (await button.isVisible()) await button.click();
}

async function centerOnPoint(page: Page, point: { x: number; y: number }): Promise<void> {
  await page.evaluate((target) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host?.__facilityGame?.scene?.getScene("facility-scene");
    if (!scene?.layout) throw new Error("Missing live facility scene.");
    // Start every evidence frame from the canonical camera.  Applying a delta
    // to a prior proof frame accumulates pan and can put the actor off canvas.
    scene.applyCamera({ ...scene.cameraView, panX: 0, panY: 0 });
    scene.refreshLayout(true);
    const x = scene.layout.originX + (target.x + 0.5) * scene.layout.tileSize;
    const y = scene.layout.originY + (target.y + 0.5) * scene.layout.tileSize;
    scene.applyCamera({
      ...scene.cameraView,
      panX: scene.scale.width / 2 - x,
      panY: scene.scale.height / 2 - y,
    });
    scene.refreshLayout(true);
    scene.drawCharacters();
  }, point);
}

async function renderedPatient(page: Page, encounterId: string) {
  return page.evaluate((id) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host?.__facilityGame?.scene?.getScene("facility-scene");
    const patient = scene?.bridge?.viewModel?.patients?.find((item: any) => item.instanceId === id);
    const key = `character:patient:${id}`;
    const bitmapContainer = scene?.characterBitmapContainers?.get(key);
    const bitmapActor = bitmapContainer?.getByName?.("actor");
    const bitmapBounds = bitmapContainer?.getBounds?.();
    const actor = bitmapContainer ?? scene?.characterGraphics?.get(key);
    const bounds = actor?.getBounds?.();
    return {
      logical: patient?.location ?? null,
      moving: patient?.moving ?? false,
      path: patient?.path ?? null,
      pathIndex: patient?.pathIndex ?? null,
      actor: actor && bounds
        ? { visible: actor.visible, x: actor.x, y: actor.y, width: bounds.width, height: bounds.height }
        : null,
      bitmap: bitmapContainer && bitmapActor && bitmapBounds
        ? {
            visible: bitmapContainer.visible && bitmapActor.visible,
            textureKey: bitmapActor.texture?.key ?? null,
            x: bitmapContainer.x,
            y: bitmapContainer.y,
            width: bitmapBounds.width,
            height: bitmapBounds.height,
          }
        : null,
    };
  }, encounterId);
}

async function waitForRenderedPatientBitmap(
  page: Page,
  encounterId: string,
): Promise<void> {
  await page.waitForFunction((id) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host?.__facilityGame?.scene?.getScene("facility-scene");
    const container = scene?.characterBitmapContainers?.get(`character:patient:${id}`);
    const actor = container?.getByName?.("actor");
    return Boolean(
      container?.visible &&
      actor?.visible &&
      actor.texture?.key &&
      actor.texture.key !== "__DEFAULT",
    );
  }, encounterId, { polling: "raf", timeout: 15_000 });
}

async function pauseWhenLivePatientReaches(
  page: Page,
  encounterId: string,
  target: { x: number; y: number },
  moving: boolean,
): Promise<void> {
  await page.waitForFunction(
    ({ id, point, expectedMoving }) => {
      const host = document.querySelector("[data-testid='facility-canvas']") as any;
      const scene = host?.__facilityGame?.scene?.getScene("facility-scene");
      const patient = scene?.bridge?.viewModel?.patients?.find(
        (candidate: any) => candidate.instanceId === id,
      );
      const matches = patient?.location?.x === point.x &&
        patient?.location?.y === point.y &&
        patient.moving === expectedMoving;
      if (matches) {
        (document.querySelector("button[aria-label='Pause facility time']") as HTMLButtonElement | null)?.click();
      }
      return matches;
    },
    { id: encounterId, point: target, expectedMoving: moving },
    { polling: "raf", timeout: 30_000 },
  );
  await expect(page.getByRole("button", { name: "Pause facility time" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
}

async function pauseOnLiveDeparture(
  page: Page,
  encounterId: string,
  zone: "interior" | "exterior",
): Promise<void> {
  await page.waitForFunction(
    ({ id, targetZone }) => {
      const host = document.querySelector("[data-testid='facility-canvas']") as any;
      const scene = host?.__facilityGame?.scene?.getScene("facility-scene");
      const patient = scene?.bridge?.viewModel?.patients?.find(
        (candidate: any) => candidate.instanceId === id,
      );
      const location = patient?.location;
      if (!patient?.moving || !location || !patient.path || patient.pathIndex === undefined) {
        return false;
      }
      const stillOnPath = patient.pathIndex > 0 && patient.pathIndex < patient.path.length - 1;
      const matches = stillOnPath &&
        (targetZone === "interior" ? location.y < 32 : location.y >= 32);
      if (matches) {
        (document.querySelector("button[aria-label='Pause facility time']") as HTMLButtonElement | null)?.click();
      }
      return matches;
    },
    { id: encounterId, targetZone: zone },
    { polling: "raf", timeout: 30_000 },
  );
  await expect(page.getByRole("button", { name: "Pause facility time" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
}

test("GS-025 returns a tech-only ultrasound patient through Front Desk before the next chart decision", async ({ page }, testInfo) => {
  testInfo.setTimeout(150_000);
  test.skip(testInfo.project.name !== "desktop-chrome", "Desktop Phaser proof only.");
  const fixture = DEPARTURE_FIXTURES.find((candidate) => candidate.id === "ultrasound")!;
  const encounterId = "gs025-postservice-fna";
  const campaignName = "GS025 postservice FNA";
  await startClinic(page, "GS025 Postservice Founder", campaignName);
  let state = fixtureState(
    (await getActiveState(page)) as unknown as GameState,
    fixture,
    true,
  );
  state = seedQuestion(
    state,
    "case.thyroid-nodule.palpable-referral",
    "concept.thyroid-nodule.fna-selection",
    encounterId,
  );
  await installFixture(page, state, campaignName, "gs025-postservice-install");

  // This is a real new order through the chart UI. The later reducer replay is
  // only a bounded time jump to the final two minutes of its frozen room work.
  state = await orderResultGatedService(page, encounterId);
  let pending = state.encounters[encounterId]!.pendingResult!;
  expect(pending).toMatchObject({
    routeId: "route.thyroid_fna.in_house",
    approvedProcedureTimingVersion: 1,
    imagingTechnicianId: "employee.gs025.imaging",
    providerReservation: null,
    onsiteReturn: {
      version: "onsite-front-desk-return.v1",
      status: "awaiting_service_completion",
      frontDeskArrivalTick: null,
    },
  });
  expect(state.environment.founderActivity).toBeNull();
  const work = pending.timingPhases!.find((phase) => phase.resourceBound)!;
  expect(work.endsAtTick - work.startsAtTick).toBe(60);
  const waitingTarget = state.encounters[encounterId]!.waitingDestination;
  expect(waitingTarget).toMatchObject({ roomInstanceId: "room.gs025.waiting" });
  const frontDesk = state.rooms.find(
    (room) => room.id === "room.instance.founder_desk",
  )!;
  const frontDeskTarget = getRoomNavigationAnchor(
    frontDesk,
    getRoomDefinition(frontDesk.roomDefinitionId)!,
    "primary",
  );

  state = advanceStateToTick(state, work.endsAtTick - 2, "gs025.postservice.seed");
  state.paused = true;
  pending = state.encounters[encounterId]!.pendingResult!;
  expect(state.facilityTick).toBe(work.endsAtTick - 2);
  const serviceLocation = getEncounterPatientLocation(state, encounterId);
  expect(serviceLocation).toEqual(
    pending.patientTravel!.outboundPath.at(-1),
  );
  expect(state.employees[0]!.facilityTask).toMatchObject({ kind: "perform_imaging" });
  expect(state.environment.founderActivity).toBeNull();
  await installFixture(page, state, campaignName, "gs025-postservice-near-completion");

  await centerOnPoint(page, serviceLocation!);
  await waitForRenderedPatientBitmap(page, encounterId);
  const serviceActor = await renderedPatient(page, encounterId);
  expect(serviceActor.bitmap).toMatchObject({ visible: true });
  expect(serviceActor.bitmap!.textureKey).not.toBe("__DEFAULT");
  await page.screenshot({ path: `${EVIDENCE}/postservice-fna-tech-only.png` });

  const chartButton = page.getByRole("button").filter({
    hasText: `${encounterId} Patient`,
  }).first();
  await expect(chartButton).not.toHaveAccessibleName(/^Action required/);
  await resumeAt(page, "1x");
  await pauseWhenLivePatientReaches(page, encounterId, frontDeskTarget, true);
  await centerOnPoint(page, frontDeskTarget);
  await waitForRenderedPatientBitmap(page, encounterId);
  const deskActor = await renderedPatient(page, encounterId);
  expect(deskActor.logical).toEqual(frontDeskTarget);
  expect(deskActor.bitmap).toMatchObject({ visible: true });
  expect(deskActor.bitmap!.textureKey).not.toBe("__DEFAULT");
  await expect(chartButton).not.toHaveAccessibleName(/^Action required/);
  await page.screenshot({ path: `${EVIDENCE}/postservice-fna-front-desk.png` });

  await resumeAt(page, "1x");
  await pauseWhenLivePatientReaches(
    page,
    encounterId,
    waitingTarget!.location,
    false,
  );
  await centerOnPoint(page, waitingTarget!.location);
  await waitForRenderedPatientBitmap(page, encounterId);
  const waitingActor = await renderedPatient(page, encounterId);
  expect(waitingActor.logical).toEqual(waitingTarget!.location);
  expect(waitingActor.bitmap).toMatchObject({ visible: true });
  expect(waitingActor.bitmap!.textureKey).not.toBe("__DEFAULT");
  await expect(chartButton).not.toHaveAccessibleName(/^Action required/);
  await page.screenshot({ path: `${EVIDENCE}/postservice-fna-waiting.png` });

  await resumeAt(page, "4x");
  await expect(chartButton).toHaveAccessibleName(/^Action required/, {
    timeout: 30_000,
  });
  await pause(page);
  await expect.poll(async () => {
    const final = (await getActiveState(page)) as unknown as GameState;
    return {
      lifecycle: final.encounters[encounterId]?.lifecycle,
      delivered: final.encounters[encounterId]?.pendingResult?.deliveredAtTick !== null,
      attention: final.encounters[encounterId]?.feedAttentionKind,
    };
  }, { timeout: 15_000 }).toEqual({
    lifecycle: "active_action_required",
    delivered: true,
    attention: "result_ready",
  });
  await page.screenshot({ path: `${EVIDENCE}/postservice-fna-action-ready.png` });
});

for (const fixture of DEPARTURE_FIXTURES) {
  test(`GS-025 visibly routes ${fixture.id} terminal procedure patient through exit before removal`, async ({ page }, testInfo) => {
    testInfo.setTimeout(150_000);
    test.skip(testInfo.project.name !== "desktop-chrome", "Desktop Phaser proof only.");
    const campaignName = `GS025 ${fixture.id} departure`;
    const encounterId = `gs025-${fixture.id}-departure`;
    await startClinic(page, `GS025 ${fixture.id} Founder`, campaignName);
    let state = fixtureState((await getActiveState(page)) as unknown as GameState, fixture);
    state = seedTerminalQuestion(state, fixture, encounterId);
    await installFixture(page, state, campaignName, `gs025-${fixture.id}-install`);
    await enactTerminalProcedure(page, encounterId);
    state = await expectTerminalOperationCreated(page, encounterId);
    // The order and frozen resource work are created through the chart UI.
    // Replay only to the final two work minutes so both the 15- and 60-minute
    // procedures enter the same bounded, normal-speed visual departure proof.
    state = advanceTerminalOperationNearCompletion(state, encounterId);
    await installFixture(
      page,
      state,
      campaignName,
      `gs025-${fixture.id}-near-completion`,
    );

    // The exit itself is intentionally observed at normal speed so a single
    // facility tick cannot conceal an actor deletion.
    await resumeAt(page, "1x");

    // Facility state autosaves every 15 ticks, so persisted-state polling can
    // skip this short walk. Observe the live Phaser bridge every animation
    // frame and pause through the same visible UI control used by the player.
    await pauseOnLiveDeparture(page, encounterId, "interior");
    let interiorActor = await renderedPatient(page, encounterId);
    const interior = interiorActor.logical!;
    await centerOnPoint(page, interior);
    await waitForRenderedPatientBitmap(page, encounterId);
    interiorActor = await renderedPatient(page, encounterId);
    expect(interiorActor.logical).toEqual(interior);
    expect(interiorActor.moving).toBe(true);
    expect(interiorActor.pathIndex).toBeGreaterThan(0);
    expect(interiorActor.pathIndex).toBeLessThan(interiorActor.path!.length - 1);
    expect(interiorActor.actor).toMatchObject({ visible: true });
    expect(interiorActor.actor!.width).toBeGreaterThan(4);
    expect(interiorActor.bitmap).toMatchObject({ visible: true });
    expect(interiorActor.bitmap!.textureKey).not.toBe("__DEFAULT");
    expect(interiorActor.bitmap!.width).toBeGreaterThan(4);
    await page.screenshot({ path: `${EVIDENCE}/${fixture.id}-departure-interior.png` });

    await resumeAt(page, "1x");
    await pauseOnLiveDeparture(page, encounterId, "exterior");
    let exteriorActor = await renderedPatient(page, encounterId);
    const exterior = exteriorActor.logical!;
    await centerOnPoint(page, exterior);
    await waitForRenderedPatientBitmap(page, encounterId);
    exteriorActor = await renderedPatient(page, encounterId);
    expect(exteriorActor.logical).toEqual(exterior);
    expect(exteriorActor.moving).toBe(true);
    expect(exteriorActor.pathIndex).toBeGreaterThan(0);
    expect(exteriorActor.pathIndex).toBeLessThan(exteriorActor.path!.length - 1);
    expect(exteriorActor.actor).toMatchObject({ visible: true });
    expect(exteriorActor.bitmap).toMatchObject({ visible: true });
    expect(exteriorActor.bitmap!.textureKey).not.toBe("__DEFAULT");
    expect(exteriorActor.bitmap!.width).toBeGreaterThan(4);
    await page.screenshot({ path: `${EVIDENCE}/${fixture.id}-departure-exterior.png` });

    await resumeAt(page, "1x");
    await page.waitForFunction((id) => {
      const host = document.querySelector("[data-testid='facility-canvas']") as any;
      const scene = host?.__facilityGame?.scene?.getScene("facility-scene");
      return !scene?.bridge?.viewModel?.patients?.some(
        (candidate: any) => candidate.instanceId === id,
      );
    }, encounterId, { polling: "raf", timeout: 30_000 });
    await expect.poll(async () => {
      const final = (await getActiveState(page)) as unknown as GameState;
      return final.encounters[encounterId]?.patientLocation === null &&
        final.encounters[encounterId]?.patientMovement === null;
    }, { timeout: 45_000 }).toBe(true);
    expect((await renderedPatient(page, encounterId)).actor).toBeNull();
  });
}
