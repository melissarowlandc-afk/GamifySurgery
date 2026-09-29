import { expect, test, type Page } from "@playwright/test";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  gameReducer,
  getEncounterPatientLocation,
  getRoomCareAnchor,
  getRoomDefinition,
  getRoomNavigationAnchor,
  getRoomWaitingAnchors,
  type GameState,
  type GridPoint,
  type PlacedRoom,
} from "@gamify-surgery/game-domain";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PROFILE_KEY, getActiveState, getProfile, startClinic } from "./helpers";

const SCREENSHOT_ROOT = process.env.GAMIFY_SEATING_SCREENSHOT_ROOT ??
  ".local-dev/gs025-seating-browser/screenshots";
const SOUTH_SEAT_ROOT = process.env.GAMIFY_SOUTH_SEAT_SCREENSHOT_ROOT ??
  ".local-dev/gs025-south-seat";
const SOUTH_SEAT_CAPTURE_PHASE = process.env.GAMIFY_SOUTH_SEAT_CAPTURE_PHASE ?? "before";
const WAITING_PHLEBOTOMY_ROOT = process.env.GAMIFY_WAITING_PHLEBOTOMY_SCREENSHOT_ROOT ??
  ".local-dev/gs025-waiting-phlebotomy";
const WAITING_PHLEBOTOMY_CAPTURE_PHASE =
  process.env.GAMIFY_WAITING_PHLEBOTOMY_CAPTURE_PHASE ?? "before";
const GLP1_SEATING_ROOT = process.env.GAMIFY_GLP1_SEATING_SCREENSHOT_ROOT ??
  ".local-dev/gs025-glp1-seating";
const SIDE_CHAIR_ROOT = process.env.GAMIFY_SIDE_CHAIR_SCREENSHOT_ROOT ??
  ".local-dev/gs025-side-chair-layering";
const SIDE_CHAIR_CAPTURE_PHASE = process.env.GAMIFY_SIDE_CHAIR_CAPTURE_PHASE ?? "before";
const CHARACTER_REGISTRY = JSON.parse(readFileSync(
  "apps/player/src/art/characterStillRegistry.generated.json",
  "utf8",
)) as {
  characters: Array<{
    id: string;
    poses: Record<"stand" | "sit", Record<"north" | "east" | "south" | "west", { sha256: string }>>;
  }>;
};

type SupportRole =
  | "waiting-seat"
  | "front-desk-staff"
  | "examination-patient"
  | "examination-clinician"
  | "ultrasound-patient"
  | "ultrasound-clinician"
  | "minor-procedure-patient"
  | "minor-procedure-clinician"
  | "ct-patient"
  | "ct-operator"
  | "glp1-np-station-1"
  | "glp1-np-station-2";

type RenderedActor = {
  key: string;
  supportRole?: SupportRole;
  supportId?: string;
  supportRoomId?: string;
  pose?: string;
  direction?: string;
  atlasId?: string;
  stillId?: string;
  textureUrl?: string;
  visible: boolean;
  x?: number;
  y?: number;
  depth?: number;
  displayWidth?: number;
  displayHeight?: number;
};

const room = (
  id: string,
  roomDefinitionId: string,
  x: number,
  y: number,
  orientation: 0 | 270 = 0,
): PlacedRoom => ({
  id,
  roomDefinitionId,
  x,
  y,
  orientation,
  doorSide: null,
  upgradeLevel: 1,
  cleanliness: 100,
});

const definitionFor = (placed: PlacedRoom) => {
  const definition = getRoomDefinition(placed.roomDefinitionId);
  if (!definition) throw new Error(`Missing definition for ${placed.roomDefinitionId}.`);
  return definition;
};

function isolateState(state: GameState, rooms: PlacedRoom[]): GameState {
  const frontDesk = state.rooms.find((candidate) => candidate.roomDefinitionId === "room.front_desk");
  if (!frontDesk) throw new Error("Fresh campaign did not contain Front Desk.");
  state.facilityLevel = 2;
  state.cash = 20_000;
  state.cashCents = 2_000_000;
  state.paused = true;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.founderActivity = null;
  state.environment.ambientPedestrians = [];
  state.environment.litterItems = [];
  state.rooms = [frontDesk, ...rooms];
  state.doors = [];
  state.employees = [];
  state.encounters = {};
  state.serviceOperations = [];
  state.retailOperations = [];
  state.retailExternalActors = [];
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  return state;
}

function addPatient(
  state: GameState,
  id: string,
  placed: PlacedRoom,
  location: GridPoint,
  waiting = false,
): GameState {
  const caseId = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
    (candidate) => candidate.earliestFacilityStage <= 1,
  )?.id;
  if (!caseId) throw new Error("No Level 1 clinical case is available for the visual fixture.");
  const next = gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId: `gs025.seating.${id}.admit`,
    encounterId: id,
    caseId,
    patientDisplayName: id,
    arrivalClass: "routine",
  });
  const encounter = next.encounters[id]!;
  encounter.patientMovement = null;
  encounter.patientLocation = { ...location };
  encounter.assignedRoomInstanceId = placed.id;
  encounter.queuedCareRoomInstanceId = null;
  encounter.waitingDestination = waiting
    ? { roomInstanceId: placed.id, location: { ...location }, kind: "chair" }
    : null;
  encounter.checkInStatus = "checked_in";
  encounter.lifecycle = waiting ? "waiting_unopened" : "active_action_required";
  encounter.nextIdleActionAtFacilityTick = Number.MAX_SAFE_INTEGER;
  return next;
}

function addEmployee(
  state: GameState,
  id: string,
  role: string,
  homeRoomInstanceId: string,
  location: GridPoint,
  facilityTask: GameState["employees"][number]["facilityTask"] = null,
): void {
  state.employees.push({
    id,
    staffRoleDefinitionId: role,
    displayName: id,
    appearance: state.founder.appearance,
    hiredAtFacilityTick: 0,
    salaryPerExpenseInterval: 0,
    morale: 90,
    trainingLevel: 1,
    homeRoomInstanceId,
    location: { ...location },
    path: [{ ...location }],
    pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick,
    lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER,
    facilityTask,
  });
}

function addInServiceOperation(
  state: GameState,
  input: {
    id: string;
    incomeLineId: string;
    encounterId: string;
    roomId: string;
    location: GridPoint;
    employeeIds?: string[];
    provider?: "founder";
  },
): void {
  state.serviceOperations.push({
    id: input.id,
    incomeLineId: input.incomeLineId,
    catalogVersion: 1,
    actorKind: "encounter",
    actorId: input.encounterId,
    displayName: input.encounterId,
    appearance: state.encounters[input.encounterId]!.patientAppearance,
    status: "in_service",
    createdAtFacilityTick: state.facilityTick,
    waitDeadlineFacilityTick: Number.MAX_SAFE_INTEGER,
    startedAtFacilityTick: state.facilityTick,
    completedAtFacilityTick: null,
    cancelledAtFacilityTick: null,
    quoteFee: 0,
    phaseIndex: 0,
    phaseStartedAtFacilityTick: state.facilityTick,
    phaseEndsAtFacilityTick: state.facilityTick + 60,
    reservedRoomInstanceIds: [input.roomId],
    reservedEmployeeIds: input.employeeIds ?? [],
    providerReservation: input.provider ? { kind: "founder" } : null,
    location: { ...input.location },
    path: [{ ...input.location }],
    pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick,
    cancellationReason: null,
    resourceQueueVersion: 1,
  });
}

function addImagingPendingResult(
  state: GameState,
  encounterId: string,
  placed: PlacedRoom,
  technicianId: string,
  serviceId: "service.ct" | "service.ultrasound",
): void {
  const encounter = state.encounters[encounterId]!;
  const operationId = `gs025.pending.${encounterId}`;
  const result = {
    operationId,
    gateId: `gs025.gate.${encounterId}`,
    originatingNodeIndex: encounter.currentNodeIndex,
    resultTypeId: serviceId,
    pendingLabel: "Acquisition in progress",
    resultNarrative: "Synthetic visual fixture result",
    routeId: serviceId === "service.ct" ? "route.ct.in_house" : "route.ultrasound.in_house",
    routeDisplayName: serviceId === "service.ct" ? "Onsite CT" : "Onsite ultrasound",
    scheduledAtTick: state.facilityTick,
    serviceDurationTicks: 60,
    durationTicks: 60,
    dueTick: state.facilityTick + 60,
    deliveredAtTick: null,
    offsiteReturnStartedAtTick: null,
    offsiteTravel: null,
    patientTravel: {
      version: "patient-travel.v1" as const,
      originRoomInstanceId: placed.id,
      destinationRoomInstanceId: placed.id,
      outboundPath: [encounter.patientLocation!],
      returnPath: [encounter.patientLocation!],
      tilesPerTick: 1,
      outboundStartTick: state.facilityTick,
      outboundArrivalTick: state.facilityTick,
      serviceCompletionTick: state.facilityTick + 60,
      returnArrivalTick: state.facilityTick + 60,
    },
    timingPhases: [{
      id: "acquisition",
      durationTicks: 60,
      resourceBound: true,
      startsAtTick: state.facilityTick,
      endsAtTick: state.facilityTick + 60,
    }],
    resourceReservations: [{
      roomDefinitionId: placed.roomDefinitionId,
      staffRoleDefinitionId: "staff.imaging_technician",
    }],
    imagingTechnicianId: technicianId,
  };
  encounter.pendingResult = result;
  encounter.lifecycle = "active_pending_result";
  encounter.steps[encounter.currentNodeIndex]!.status = "result_pending";
  encounter.steps[encounter.currentNodeIndex]!.result = result;
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
  if (campaign.campaignId !== state.campaignId) {
    campaign.campaignId = state.campaignId;
    profile.activeCampaignId = state.campaignId;
  }
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
  expect(await page.evaluate(() => location.origin)).toBe("http://127.0.0.1:4197");
  const resume = page.getByRole("button", { name: `Resume ${campaignName}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.addStyleTag({
    content: ".tutorial-overlay,.tutorial-card,.prototype-toolbar,.game-announcement,.facility-pause-indicator{display:none!important}",
  });
}

async function centerRoom(page: Page, roomId: string, zoom = 1.6): Promise<void> {
  await page.evaluate(({ id, requestedZoom }) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host?.__facilityGame?.scene?.getScene("facility-scene");
    const target = scene?.bridge?.viewModel?.rooms?.find((candidate: any) => candidate.instanceId === id);
    if (!scene || !target) throw new Error(`Missing live room ${id}.`);
    scene.applyCamera({ ...scene.cameraView, zoom: requestedZoom, panX: 0, panY: 0 });
    scene.refreshLayout(true);
    const x = scene.layout.originX + (target.tileX + target.width / 2) * scene.layout.tileSize;
    const y = scene.layout.originY + (target.tileY + target.height / 2) * scene.layout.tileSize;
    scene.applyCamera({
      ...scene.cameraView,
      zoom: requestedZoom,
      panX: scene.scale.width / 2 - x,
      panY: scene.scale.height / 2 - y,
    });
    scene.refreshLayout(true);
    scene.drawCharacters();
  }, { id: roomId, requestedZoom: zoom });
}

async function renderedActors(page: Page, keys: string[]): Promise<Record<string, RenderedActor>> {
  await page.waitForFunction((expected) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host?.__facilityGame?.scene?.getScene("facility-scene");
    if (!scene) return false;
    return expected.every((key: string) => {
      const container = scene.characterBitmapContainers?.get(key);
      const actor = container?.getByName("actor");
      return Boolean(
        container?.visible && actor?.visible && actor.texture?.key !== "__DEFAULT" &&
        actor.displayWidth > 4 && actor.displayHeight > 8,
      );
    });
  }, keys, { timeout: 20_000 });
  return page.evaluate((expected) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene");
    return Object.fromEntries(expected.map((key: string) => {
      const container = scene.characterBitmapContainers.get(key);
      const actor = container.getByName("actor");
      const source = actor.texture?.source?.[0]?.source;
      return [key, {
        key,
        supportRole: container.getData("actor-support-role") ?? undefined,
        supportId: container.getData("actor-support-id") ?? undefined,
        supportRoomId: container.getData("actor-support-room-instance-id") ?? undefined,
        pose: actor.getData("gait-pose"),
        direction: actor.getData("gait-direction"),
        atlasId: actor.getData("gait-atlas-id"),
        stillId: actor.getData("gait-still-id"),
        textureUrl: source?.currentSrc ?? source?.src,
        visible: Boolean(container.visible && actor.visible),
        x: container.x,
        y: container.y,
        depth: container.depth,
        displayWidth: actor.displayWidth,
        displayHeight: actor.displayHeight,
      }];
    }));
  }, keys);
}

function renderedCardinal(actor: RenderedActor): "north" | "east" | "south" | "west" | undefined {
  const entry = CHARACTER_REGISTRY.characters.find((candidate) => candidate.id === actor.stillId);
  const hash = actor.atlasId?.split(":").at(-1);
  const pose = actor.pose === "seated" || actor.pose === "exam-table" ? "sit" : "stand";
  return entry && hash
    ? (Object.entries(entry.poses[pose]).find(([, asset]) => asset.sha256.startsWith(hash))?.[0] as
        "north" | "east" | "south" | "west" | undefined)
    : undefined;
}

async function projectedRoles(page: Page): Promise<Record<string, string | undefined>> {
  return page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const model = host.__facilityGame.scene.getScene("facility-scene").bridge.viewModel;
    return Object.fromEntries([
      ["character:founder", model.founder.supportRole],
      ...model.staff.map((actor: any) => [`character:staff:${actor.instanceId}`, actor.supportRole]),
      ...model.patients.map((actor: any) => [`character:patient:${actor.instanceId}`, actor.supportRole]),
      ...(model.serviceVisitors ?? []).map((actor: any) => [`character:service-visitor:${actor.actorId}`, actor.supportRole]),
    ]);
  });
}

async function capture(page: Page, name: string): Promise<void> {
  await page.mouse.move(8, 8);
  await page.screenshot({ path: join(SCREENSHOT_ROOT, name), fullPage: true });
}

function saveSouthSeatState(name: string, state: GameState): void {
  writeFileSync(
    join(SOUTH_SEAT_ROOT, "states", `${name}.json`),
    `${JSON.stringify(state, null, 2)}\n`,
  );
}

async function captureSouthSeatAtZoom(
  page: Page,
  roomId: string,
  zoom: 1 | 1.6,
  name: string,
  actorKeys: string[],
): Promise<void> {
  await centerRoom(page, roomId, zoom);
  const actors = await renderedActors(page, actorKeys);
  writeFileSync(
    join(SOUTH_SEAT_ROOT, "states", `${name}.actors.json`),
    `${JSON.stringify(actors, null, 2)}\n`,
  );
  await page.mouse.move(8, 8);
  await page.getByTestId("facility-canvas").screenshot({
    path: join(SOUTH_SEAT_ROOT, SOUTH_SEAT_CAPTURE_PHASE, `${name}.png`),
    animations: "disabled",
  });
}

async function captureWaitingPhlebotomyAtZoom(
  page: Page,
  roomId: string,
  zoom: 1 | 1.6,
  name: string,
  actorKeys: string[],
): Promise<Record<string, RenderedActor | null>> {
  await centerRoom(page, roomId, zoom);
  const actors = await renderedActors(page, actorKeys);
  writeFileSync(
    join(
      WAITING_PHLEBOTOMY_ROOT,
      WAITING_PHLEBOTOMY_CAPTURE_PHASE,
      `${name}.actors.json`,
    ),
    `${JSON.stringify(actors, null, 2)}\n`,
  );
  await page.mouse.move(8, 8);
  await page.getByTestId("facility-canvas").screenshot({
    path: join(WAITING_PHLEBOTOMY_ROOT, WAITING_PHLEBOTOMY_CAPTURE_PHASE, `${name}.png`),
    animations: "disabled",
  });
  return actors;
}

function advanceUntil(
  state: GameState,
  label: string,
  predicate: (candidate: GameState) => boolean,
  maximumTicks = 240,
): GameState {
  let next = { ...state, paused: false };
  for (let index = 0; index <= maximumTicks; index += 1) {
    if (predicate(next)) return next;
    const previousTick = next.facilityTick;
    next = gameReducer(next, {
      type: "ADVANCE_TICK",
      operationId: `gs025.seating.${label}.${index}`,
    });
    if (next.facilityTick === previousTick) {
      throw new Error(`${label} did not advance beyond facility tick ${previousTick}.`);
    }
  }
  throw new Error(`${label} did not reach its expected state within ${maximumTicks} ticks.`);
}

function createRealPhlebotomyOrder(
  state: GameState,
  orientation: 0 | 270,
  pathway: "pending-result" | "terminal-collection",
): { state: GameState; encounterId: string; roomId: string; employeeId: string } {
  const exam = room(`room.gs025.phleb.exam.${orientation}`, "room.examination", 34, 26, 0);
  const phlebotomy = room(
    `room.gs025.phleb.station.${orientation}`,
    "room.phlebotomy",
    29,
    orientation === 270 ? 23 : 26,
    orientation,
  );
  const ultrasound = room(
    `room.gs025.phleb.ultrasound.${orientation}`,
    "room.ultrasound",
    33,
    23,
    0,
  );
  const halls = [
    ...[24, 25, 26, 27, 28].map((y) =>
      room(`room.gs025.phleb.v.${orientation}.${y}`, "room.hallway", 32, y),
    ),
    ...(orientation === 270
      ? [30, 31].map((x) => room(`room.gs025.phleb.r.${x}`, "room.hallway", x, 26))
      : []),
  ];
  let next = createInitialGameState(undefined, {
    campaignId: state.campaignId,
    campaignSeed: state.campaignSeed,
    createdAtRealMs: state.createdAtRealMs,
  });
  next.rooms = next.rooms.filter((candidate) => candidate.id !== "room.instance.starter_examination");
  next.doors = next.doors.filter((candidate) => candidate.roomId !== "room.instance.starter_examination");
  next.rooms.push(exam, ultrasound, ...halls, phlebotomy);
  next.doors.push(
    { id: `door.gs025.phleb.ultrasound.${orientation}`, roomId: ultrasound.id, side: "south", offset: 2, exterior: false },
    { id: `door.gs025.phleb.ultrasound.staff.${orientation}`, roomId: ultrasound.id, side: "west", offset: 1, exterior: false },
    { id: `door.gs025.phleb.front.${orientation}`, roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    { id: `door.gs025.phleb.station.${orientation}`, roomId: phlebotomy.id, side: orientation === 270 ? "south" : "east", offset: 1, exterior: false },
  );
  next.facilityLevel = 2;
  next.cash = 20_000;
  next.cashCents = 2_000_000;
  next.paused = true;
  next.serviceAppointmentsEnabled = false;
  next.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  next.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  next.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  next.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  next.environment.founderActivity = null;
  next.environment.ambientPedestrians = [];
  next.environment.litterItems = [];
  next.employees = [];
  next.encounters = {};
  next.serviceOperations = [];
  next.openChartEncounterId = null;
  next.attendedEncounterId = null;
  const employeeId = `employee.gs025.phlebotomist.${orientation}`;
  const employeeStart = getRoomCareAnchor(
    phlebotomy,
    definitionFor(phlebotomy),
    orientation === 270 ? "clinician" : "patient",
  );
  addEmployee(next, employeeId, "staff.phlebotomist", phlebotomy.id, employeeStart);
  next.employees[0]!.appearance = {
    ...next.employees[0]!.appearance,
    stillId: "gs022-new-employee-015",
    roleStyle: "phlebotomist",
  };

  const encounterId = `GS025 Phlebotomy ${pathway} ${orientation}`;
  const pendingSelection = pathway === "pending-result"
    ? PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases
        .flatMap((candidate) => candidate.decisionNodes.map((node, nodeIndex) => ({
          candidate,
          node,
          nodeIndex,
        })))
        .find(({ node }) => node.resultGateAfter?.resultTypeId === "service.basic_labs")
    : undefined;
  if (pathway === "pending-result" && !pendingSelection) {
    throw new Error("No ordinary basic-labs PendingResult case is available.");
  }
  const caseId = pendingSelection?.candidate.id ?? "case.fhh.suggestive-results-confirmation";
  next = gameReducer(next, {
    type: "ADMIT_PATIENT",
    operationId: `${encounterId}.admit`,
    encounterId,
    caseId,
    patientDisplayName: encounterId,
    arrivalClass: "routine",
  });
  const encounter = next.encounters[encounterId]!;
  const nodeIndex = pendingSelection?.nodeIndex ?? encounter.frozenCase.decisionNodes.length - 1;
  encounter.currentNodeIndex = nodeIndex;
  encounter.steps.forEach((step, index) => {
    step.status = index < nodeIndex ? "completed" : index === nodeIndex ? "action_required" : "locked";
  });
  encounter.patientMovement = null;
  encounter.patientLocation = { x: 35, y: 27 };
  encounter.assignedRoomInstanceId = exam.id;
  encounter.queuedCareRoomInstanceId = null;
  encounter.waitingDestination = null;
  encounter.checkInStatus = "checked_in";
  encounter.lifecycle = "active_action_required";
  next.openChartEncounterId = encounterId;
  next.attendedEncounterId = encounterId;
  const node = encounter.frozenCase.decisionNodes[nodeIndex]!;
  const correct = node.answerChoices.find((choice) => choice.isCorrect)!;
  next = gameReducer(next, {
    type: "SUBMIT_ANSWER",
    operationId: `${encounterId}.submit`,
    encounterId,
    decisionNodeId: node.id,
    answerChoiceId: correct.id,
    reviewedAtMs: 10_000,
  });
  if (pathway === "pending-result") {
    next = gameReducer(next, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK",
      operationId: `${encounterId}.ack`,
      encounterId,
      decisionNodeId: node.id,
    });
  }
  return { state: next, encounterId, roomId: phlebotomy.id, employeeId };
}

function createRealGlp1Suite(
  state: GameState,
  orientation: 0 | 270,
): {
  state: GameState;
  roomId: string;
  employeeIds: [string, string];
  stationLocations: [GridPoint, GridPoint];
} {
  const suite = room(
    `room.gs025.glp1.${orientation}`,
    "room.glp1_telehealth_suite",
    29,
    orientation === 270 ? 23 : 22,
    orientation,
  );
  let next = createInitialGameState(undefined, {
    campaignId: state.campaignId,
    campaignSeed: `gs025-glp1-seating-${orientation}`,
    createdAtRealMs: state.createdAtRealMs,
  });
  next.facilityLevel = 2;
  next.cash = 100_000;
  next.cashCents = 10_000_000;
  next.paused = true;
  next.serviceAppointmentsEnabled = false;
  next.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  next.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  next.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  next.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  next.environment.founderActivity = null;
  next.environment.ambientPedestrians = [];
  next.environment.litterItems = [];
  next.employees = [];
  next.encounters = {};
  next.serviceOperations = [];
  next.rooms.push(
    ...Array.from({ length: 12 }, (_, index) =>
      room(`room.gs025.glp1.hall.${orientation}.${20 + index}`, "room.hallway", 32, 20 + index),
    ),
    ...(orientation === 270
      ? [30, 31].map((x) => room(`room.gs025.glp1.branch.${x}`, "room.hallway", x, 26))
      : []),
    suite,
  );
  next.doors.push(
    {
      id: `door.gs025.glp1.front.${orientation}`,
      roomId: "room.instance.founder_desk",
      side: "west",
      offset: 0,
      exterior: false,
    },
    {
      id: `door.gs025.glp1.suite.${orientation}`,
      roomId: suite.id,
      side: orientation === 270 ? "south" : "east",
      offset: 1,
      exterior: false,
    },
  );
  const employeeIds: [string, string] = [
    `employee.gs025.glp1.${orientation}.a`,
    `employee.gs025.glp1.${orientation}.b`,
  ];
  for (const employeeId of employeeIds) {
    next = gameReducer(next, {
      type: "HIRE_STAFF",
      operationId: `gs025.glp1.${orientation}.hire.${employeeId}`,
      employeeId,
      staffRoleDefinitionId: "staff.glp1_np",
    });
    expect(next.operationReceipts[`gs025.glp1.${orientation}.hire.${employeeId}`]).toMatchObject({
      status: "applied",
    });
  }
  for (const employeeId of employeeIds) {
    const employee = next.employees.find((candidate) => candidate.id === employeeId)!;
    expect(employee.homeRoomInstanceId).toBe(suite.id);
    employee.nextIdleActionAtFacilityTick = Number.MAX_SAFE_INTEGER;
  }
  const stationLocations = employeeIds.map((employeeId) => {
    const employee = next.employees.find((candidate) => candidate.id === employeeId)!;
    return { ...employee.path.at(-1)! };
  }) as [GridPoint, GridPoint];
  expect(new Set(stationLocations.map((location) => `${location.x},${location.y}`)).size).toBe(2);
  return { state: next, roomId: suite.id, employeeIds, stationLocations };
}

async function captureGlp1Stage(
  page: Page,
  state: GameState,
  input: {
    orientation: 0 | 270;
    stage: "moving" | "active-100" | "active-160";
    roomId: string;
    employeeIds: [string, string];
    zoom: 1 | 1.6;
  },
): Promise<Record<string, RenderedActor>> {
  const root = join(GLP1_SEATING_ROOT, "proof");
  mkdirSync(root, { recursive: true });
  const snapshot = { ...state, paused: true };
  writeFileSync(
    join(root, `glp1-${input.orientation}-${input.stage}.state.json`),
    `${JSON.stringify(snapshot, null, 2)}\n`,
  );
  await installFixture(
    page,
    snapshot,
    `GS025 GLP1 ${input.orientation}`,
    `gs025-glp1-${input.orientation}-${input.stage}`,
  );
  await centerRoom(page, input.roomId, input.zoom);
  const keys = input.employeeIds.map((employeeId) => `character:staff:${employeeId}`);
  const actors = await renderedActors(page, keys);
  writeFileSync(
    join(root, `glp1-${input.orientation}-${input.stage}.actors.json`),
    `${JSON.stringify(actors, null, 2)}\n`,
  );
  await page.mouse.move(8, 8);
  await page.getByTestId("facility-canvas").screenshot({
    path: join(root, `glp1-${input.orientation}-${input.stage}.png`),
    animations: "disabled",
  });
  return actors;
}

function exactSideChairState(
  name: string,
  create: () => GameState,
): GameState {
  const statePath = join(SIDE_CHAIR_ROOT, "before", "states", `${name}.json`);
  if (SIDE_CHAIR_CAPTURE_PHASE !== "before") {
    if (!existsSync(statePath)) throw new Error(`Missing exact side-chair baseline ${statePath}.`);
    return JSON.parse(readFileSync(statePath, "utf8")) as GameState;
  }
  const state = create();
  mkdirSync(join(SIDE_CHAIR_ROOT, "before", "states"), { recursive: true });
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
  return state;
}

function deterministicSideChairInitial(state: GameState, seed: string): GameState {
  return createInitialGameState(undefined, {
    campaignId: state.campaignId,
    campaignSeed: `gs025-side-chair-${seed}`,
    createdAtRealMs: state.createdAtRealMs,
  });
}

async function captureSideChairScene(
  page: Page,
  state: GameState,
  input: {
    name: string;
    roomId: string;
    actorKeys: string[];
    zoom: 1 | 1.6;
  },
): Promise<{
  actors: Record<string, RenderedActor>;
  fixtureLayers: Array<{ key: string; depth: number; visible: boolean }>;
  camera: { zoom: number; panX: number; panY: number };
  chairLayers: Array<{
    layer: "full" | "rear" | "south-arm";
    depth: number;
    visible: boolean;
    roomId?: string;
    supportIds: string[];
    drawId?: string;
    occupied: boolean;
  }>;
}> {
  const phaseRoot = join(SIDE_CHAIR_ROOT, SIDE_CHAIR_CAPTURE_PHASE);
  mkdirSync(phaseRoot, { recursive: true });
  await installFixture(
    page,
    { ...state, paused: true },
    `GS025 Side Chair ${input.name}`,
    `gs025-side-chair-${SIDE_CHAIR_CAPTURE_PHASE}-${input.name}`,
  );
  await centerRoom(page, input.roomId, input.zoom);
  const actors = input.actorKeys.length > 0
    ? await renderedActors(page, input.actorKeys)
    : {};
  const fixtureLayers = await page.evaluate((roomId) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene");
    return [...scene.fixtureBitmapImages.entries()]
      .filter(([key]: [string, any]) => key.includes(`approved:${roomId}:`))
      .map(([key, image]: [string, any]) => ({
        key,
        depth: image.depth,
        visible: Boolean(image.visible),
      }));
  }, input.roomId);
  const chairLayers = await page.evaluate((roomId) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene");
    return scene.children.list.flatMap((item: any) => {
      const layer = item.getData?.("approved-chair-layer");
      const itemRoomId = item.getData?.("approved-chair-room-instance-id");
      if (!layer || itemRoomId !== roomId) return [];
      const rawSupportIds = item.getData?.("approved-chair-support-ids");
      return [{
        layer,
        depth: item.depth,
        visible: Boolean(item.visible),
        roomId: itemRoomId ?? undefined,
        supportIds: Array.isArray(rawSupportIds) ? rawSupportIds : [],
        drawId: item.getData?.("approved-chair-draw-id") ?? item.getData?.("approved-draw-id") ?? undefined,
        occupied: item.getData?.("approved-chair-occupied") === true,
      }];
    });
  }, input.roomId) as Array<{
    layer: "full" | "rear" | "south-arm";
    depth: number;
    visible: boolean;
    roomId?: string;
    supportIds: string[];
    drawId?: string;
    occupied: boolean;
  }>;
  const camera = await page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene");
    return {
      zoom: scene.cameraView.zoom,
      panX: scene.cameraView.panX,
      panY: scene.cameraView.panY,
    };
  });
  expect(camera.zoom).toBe(input.zoom);
  expect(Math.abs(camera.panX) + Math.abs(camera.panY)).toBeGreaterThan(0);
  if (SIDE_CHAIR_CAPTURE_PHASE !== "before") {
    const beforeActorsPath = join(SIDE_CHAIR_ROOT, "before", `${input.name}.actors.json`);
    if (!existsSync(beforeActorsPath)) {
      throw new Error(`Missing exact side-chair actor baseline ${beforeActorsPath}.`);
    }
    const before = JSON.parse(readFileSync(beforeActorsPath, "utf8")) as {
      actors: Record<string, RenderedActor>;
    };
    for (const key of input.actorKeys) {
      expect(actors[key]!.stillId).toBe(before.actors[key]!.stillId);
    }
  }
  writeFileSync(
    join(phaseRoot, `${input.name}.actors.json`),
    `${JSON.stringify({ actors, fixtureLayers, chairLayers, camera }, null, 2)}\n`,
  );
  await page.mouse.move(8, 8);
  await page.getByTestId("facility-canvas").screenshot({
    path: join(phaseRoot, `${input.name}.png`),
    animations: "disabled",
  });
  return { actors, fixtureLayers, chairLayers, camera };
}

function expectOccupiedSideChairLayers(
  capture: Awaited<ReturnType<typeof captureSideChairScene>>,
  input: {
    actorKeys: string[];
    supportIds: string[];
    roomId: string;
  },
): void {
  if (SIDE_CHAIR_CAPTURE_PHASE === "before") return;
  const actors = input.actorKeys.map((key) => capture.actors[key]!);
  expect(actors.map((actor) => actor.supportId)).toEqual(input.supportIds);
  expect(actors.every((actor) => actor.supportRoomId === input.roomId)).toBe(true);
  for (const [index, supportId] of input.supportIds.entries()) {
    const rear = capture.chairLayers.find((layer) =>
      layer.visible && layer.layer === "rear" && layer.supportIds.includes(supportId),
    );
    const southArm = capture.chairLayers.find((layer) =>
      layer.visible && layer.layer === "south-arm" && layer.supportIds.includes(supportId),
    );
    expect(rear, `missing visible rear layer for ${supportId}`).toBeTruthy();
    expect(southArm, `missing visible south arm for ${supportId}`).toBeTruthy();
    expect(southArm!.occupied).toBe(true);
    expect(rear!.depth).toBeLessThan(actors[index]!.depth!);
    expect(actors[index]!.depth).toBeLessThan(southArm!.depth);
  }
}

function expectVacantSideChairLayers(
  capture: Awaited<ReturnType<typeof captureSideChairScene>>,
  roomId: string,
  supportIds: string[],
): void {
  if (SIDE_CHAIR_CAPTURE_PHASE === "before") return;
  for (const supportId of supportIds) {
    expect(capture.chairLayers.some((layer) =>
      layer.visible && layer.roomId === roomId && layer.layer === "full" && layer.supportIds.includes(supportId),
    ), `missing restored full chair for ${supportId}`).toBe(true);
    expect(capture.chairLayers.some((layer) =>
      layer.visible && layer.roomId === roomId && layer.layer === "south-arm" && layer.supportIds.includes(supportId),
    ), `unexpected foreground arm for vacant ${supportId}`).toBe(false);
  }
}

async function capturePhlebotomyStage(
  page: Page,
  state: GameState,
  input: {
    pathway: string;
    orientation: 0 | 270;
    stage: "midwalk" | "collection" | "release";
    encounterId: string;
    employeeId: string;
    roomId: string;
    actorKey?: string;
  },
): Promise<Record<string, RenderedActor | null>> {
  const root = join(WAITING_PHLEBOTOMY_ROOT, "phlebotomy-flow");
  mkdirSync(root, { recursive: true });
  const snapshot = { ...state, paused: true };
  writeFileSync(
    join(root, `${input.pathway}-${input.orientation}-${input.stage}.state.json`),
    `${JSON.stringify(snapshot, null, 2)}\n`,
  );
  await installFixture(
    page,
    snapshot,
    `GS025 ${input.pathway} ${input.orientation}`,
    `gs025-${input.pathway}-${input.orientation}-${input.stage}`,
  );
  await centerRoom(page, input.roomId, 1.6);
  const keys = [
    input.actorKey ?? `character:patient:${input.encounterId}`,
    `character:staff:${input.employeeId}`,
  ];
  const actors = await renderedActors(page, keys);
  writeFileSync(
    join(root, `${input.pathway}-${input.orientation}-${input.stage}.actors.json`),
    `${JSON.stringify(actors, null, 2)}\n`,
  );
  await page.getByTestId("facility-canvas").screenshot({
    path: join(root, `${input.pathway}-${input.orientation}-${input.stage}.png`),
    animations: "disabled",
  });
  return actors;
}

test.describe.configure({ mode: "serial" });
test.use({ viewport: { width: 1440, height: 1000 } });
test.beforeAll(() => mkdirSync(SCREENSHOT_ROOT, { recursive: true }));
test.beforeAll(() => {
  mkdirSync(join(SOUTH_SEAT_ROOT, SOUTH_SEAT_CAPTURE_PHASE), { recursive: true });
  mkdirSync(join(SOUTH_SEAT_ROOT, "states"), { recursive: true });
});
test.beforeAll(() => {
  mkdirSync(join(WAITING_PHLEBOTOMY_ROOT, WAITING_PHLEBOTOMY_CAPTURE_PHASE), {
    recursive: true,
  });
});

for (const orientation of [0, 270] as const) {
  test(`waiting-room chairs use their authored directions at ${orientation} degrees`, async ({ page }) => {
    await startClinic(page, `GS025 Waiting ${orientation}`, `GS025 Waiting ${orientation}`);
    let state = (await getActiveState(page)) as unknown as GameState;
    const waitingRoom = room("room.gs025.waiting", "room.waiting", 28, 24, orientation);
    state = isolateState(state, [waitingRoom]);
    const anchors = getRoomWaitingAnchors(waitingRoom, definitionFor(waitingRoom));
    expect(anchors).toHaveLength(4);
    for (const [index, anchor] of anchors.entries()) {
      state = addPatient(state, `GS025 Waiting ${orientation} ${index + 1}`, waitingRoom, anchor, true);
    }
    await installFixture(page, state, `GS025 Waiting ${orientation}`, `gs025-waiting-${orientation}`);
    await centerRoom(page, waitingRoom.id);

    const keys = anchors.map((_, index) => `character:patient:GS025 Waiting ${orientation} ${index + 1}`);
    const roles = await projectedRoles(page);
    for (const key of keys) expect(roles[key]).toBe("waiting-seat");
    const actors = await renderedActors(page, keys);
    for (const key of keys) {
      expect(actors[key]).toMatchObject({ supportRole: "waiting-seat", pose: "seated", visible: true });
      expect(actors[key]!.supportId).toBeTruthy();
    }
    expect(new Set(keys.map((key) => actors[key]!.supportId)).size).toBe(4);
    const textureDirections = keys.map((key) => renderedCardinal(actors[key]!));
    expect(new Set(textureDirections)).toEqual(
      orientation === 0
        ? new Set(["south", "east", "west"])
        : new Set(["east", "north", "south"]),
    );
    await capture(page, `waiting-${orientation}-authored-seat-directions.png`);
  });
}

test("waiting-phlebotomy follow-up baseline: fixed compatible south-bench identities remain stable at 100 and 160 percent", async ({ page }) => {
  await startClinic(page, "GS025 Waiting Phlebotomy", "GS025 Waiting Phlebotomy");
  const normalizedStatePath = join(
    WAITING_PHLEBOTOMY_ROOT,
    "before",
    "waiting-south-bench.normalized-state.json",
  );
  let state: GameState;
  let waitingRoom: PlacedRoom;
  if (WAITING_PHLEBOTOMY_CAPTURE_PHASE !== "before" && existsSync(normalizedStatePath)) {
    state = JSON.parse(readFileSync(normalizedStatePath, "utf8")) as GameState;
    waitingRoom = state.rooms.find((candidate) => candidate.id === "room.gs025.waiting-phlebotomy")!;
  } else {
    state = (await getActiveState(page)) as unknown as GameState;
    waitingRoom = room("room.gs025.waiting-phlebotomy", "room.waiting", 28, 24, 0);
    state = isolateState(state, [waitingRoom]);
    const anchors = getRoomWaitingAnchors(waitingRoom, definitionFor(waitingRoom));
    state = addPatient(state, "GS025 Waiting Male 032", waitingRoom, anchors[0]!, true);
    state.encounters["GS025 Waiting Male 032"]!.frozenCase.prototypeDemographics = {
      ageYears: 37,
      sexLabel: "Male",
    };
    state.encounters["GS025 Waiting Male 032"]!.patientAppearance = {
      ...state.encounters["GS025 Waiting Male 032"]!.patientAppearance,
      patientIdentityId: "patient.adult.032",
      stillId: "patient.adult.032",
      roleStyle: "patient",
    };
    state = addPatient(state, "GS025 Waiting Female 007", waitingRoom, anchors[1]!, true);
    state.encounters["GS025 Waiting Female 007"]!.frozenCase.prototypeDemographics = {
      ageYears: 37,
      sexLabel: "Female",
    };
    state.encounters["GS025 Waiting Female 007"]!.patientAppearance = {
      ...state.encounters["GS025 Waiting Female 007"]!.patientAppearance,
      patientIdentityId: "patient.adult.007",
      stillId: "patient.adult.007",
      roleStyle: "patient",
    };
  }

  await installFixture(
    page,
    state,
    "GS025 Waiting Phlebotomy",
    `gs025-waiting-phlebotomy-${WAITING_PHLEBOTOMY_CAPTURE_PHASE}`,
  );
  const live = (await getActiveState(page)) as unknown as GameState;
  expect(live.encounters["GS025 Waiting Male 032"]!.patientAppearance).toMatchObject({
    patientIdentityId: "patient.adult.032",
    stillId: "patient.adult.032",
  });
  expect(live.encounters["GS025 Waiting Female 007"]!.patientAppearance).toMatchObject({
    patientIdentityId: "patient.adult.007",
    stillId: "patient.adult.007",
  });
  if (WAITING_PHLEBOTOMY_CAPTURE_PHASE === "before") {
    writeFileSync(normalizedStatePath, `${JSON.stringify(live, null, 2)}\n`);
  }

  const keys = [
    "character:patient:GS025 Waiting Male 032",
    "character:patient:GS025 Waiting Female 007",
  ];
  const roles = await projectedRoles(page);
  expect(keys.map((key) => roles[key])).toEqual([
    "waiting-seat",
    "waiting-seat",
  ]);
  for (const [zoom, suffix] of [[1, "100"], [1.6, "160"]] as const) {
    const actors = await captureWaitingPhlebotomyAtZoom(
      page,
      waitingRoom.id,
      zoom,
      `waiting-south-bench-${suffix}`,
      keys,
    );
    expect(actors[keys[0]!]!.stillId).toBe("patient.adult.032");
    expect(actors[keys[1]!]!.stillId).toBe("patient.adult.007");
  }
});

test("waiting-phlebotomy diagnostic: compare additional north shifts without changing support depth or scale", async ({ page }) => {
  const normalizedStatePath = join(
    WAITING_PHLEBOTOMY_ROOT,
    "before",
    "waiting-south-bench.normalized-state.json",
  );
  if (!existsSync(normalizedStatePath)) throw new Error("The identity-safe Waiting baseline is missing.");
  await startClinic(page, "GS025 Waiting Shift Diagnostic", "GS025 Waiting Shift Diagnostic");
  const state = JSON.parse(readFileSync(normalizedStatePath, "utf8")) as GameState;
  const waitingRoom = state.rooms.find(
    (candidate) => candidate.id === "room.gs025.waiting-phlebotomy",
  );
  if (!waitingRoom) throw new Error("The normalized Waiting baseline room is missing.");
  await installFixture(
    page,
    state,
    "GS025 Waiting Shift Diagnostic",
    "gs025-waiting-shift-diagnostic",
  );
  const keys = [
    "character:patient:GS025 Waiting Male 032",
    "character:patient:GS025 Waiting Female 007",
  ];
  const live = (await getActiveState(page)) as unknown as GameState;
  expect(live.encounters["GS025 Waiting Male 032"]!.patientAppearance.stillId).toBe(
    "patient.adult.032",
  );
  expect(live.encounters["GS025 Waiting Female 007"]!.patientAppearance.stillId).toBe(
    "patient.adult.007",
  );
  await centerRoom(page, waitingRoom.id, 1.6);
  const diagnosticRoot = join(WAITING_PHLEBOTOMY_ROOT, "diagnostic-north-shifts");
  mkdirSync(diagnosticRoot, { recursive: true });
  for (const [label, northShiftTiles] of [
    ["current", 0],
    ["north-015", 0.15],
    ["north-025", 0.25],
    ["north-035", 0.35],
  ] as const) {
    await page.evaluate((shiftTiles) => {
      const host = document.querySelector("[data-testid='facility-canvas']") as any;
      const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
      scene.__gs025OriginalApprovedSupport ??= scene.getApprovedActorSupportDisplayPosition;
      const original = scene.__gs025OriginalApprovedSupport;
      scene.getApprovedActorSupportDisplayPosition = function (...args: any[]) {
        const result = original.apply(this, args);
        return result && args[2] === "waiting-seat"
          ? { ...result, baseY: result.baseY - shiftTiles * this.layout.tileSize }
          : result;
      };
      scene.characterMotionSnapshots.clear();
      scene.drawCharacters();
    }, northShiftTiles);
    const actors = await renderedActors(page, keys);
    expect(actors[keys[0]!]!.stillId).toBe("patient.adult.032");
    expect(actors[keys[1]!]!.stillId).toBe("patient.adult.007");
    writeFileSync(
      join(diagnosticRoot, `${label}-160.actors.json`),
      `${JSON.stringify(actors, null, 2)}\n`,
    );
    await page.getByTestId("facility-canvas").screenshot({
      path: join(diagnosticRoot, `${label}-160.png`),
      animations: "disabled",
    });
  }
  await page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    scene.getApprovedActorSupportDisplayPosition = scene.__gs025OriginalApprovedSupport;
    scene.characterMotionSnapshots.clear();
    scene.drawCharacters();
  });
});

test("phlebotomy orientation 0: a real pending-result order arrives, collects, and releases both supports", async ({ page }) => {
  await startClinic(page, "GS025 Phlebotomy Pending", "GS025 Phlebotomy Pending");
  const initial = (await getActiveState(page)) as unknown as GameState;
  const fixture = createRealPhlebotomyOrder(initial, 0, "pending-result");
  let state = fixture.state;
  let encounter = state.encounters[fixture.encounterId]!;
  expect(encounter.pendingResult).toMatchObject({
    phlebotomyArrivalGatedVersion: 1,
    phlebotomistId: fixture.employeeId,
    routeId: "route.basic_labs.phlebotomy_sendout",
  });
  expect(encounter.pendingResult?.patientTravel?.outboundPath.length).toBeGreaterThan(1);
  const midwalkActors = await capturePhlebotomyStage(page, state, {
    pathway: "pending-result",
    orientation: 0,
    stage: "midwalk",
    encounterId: fixture.encounterId,
    employeeId: fixture.employeeId,
    roomId: fixture.roomId,
  });
  const midwalkRoles = await projectedRoles(page);
  expect(midwalkRoles[`character:patient:${fixture.encounterId}`]).toBeUndefined();
  expect(midwalkRoles[`character:staff:${fixture.employeeId}`]).toBeUndefined();
  expect(midwalkActors[`character:patient:${fixture.encounterId}`]?.pose).not.toBe("seated");

  state = advanceUntil(state, "pending-result.collection", (candidate) => {
    const pending = candidate.encounters[fixture.encounterId]?.pendingResult;
    const collection = pending?.timingPhases?.find((phase) => phase.resourceBound);
    const employee = candidate.employees.find((item) => item.id === fixture.employeeId);
    return Boolean(
      collection && candidate.facilityTick >= collection.startsAtTick &&
      candidate.facilityTick < collection.endsAtTick && employee?.facilityTask?.targetId === pending?.operationId &&
      employee.pathIndex === employee.path.length - 1,
    );
  });
  encounter = state.encounters[fixture.encounterId]!;
  const pending = encounter.pendingResult!;
  const collection = pending.timingPhases!.find((phase) => phase.resourceBound)!;
  expect(collection.endsAtTick - collection.startsAtTick).toBe(15);
  expect(getEncounterPatientLocation(state, fixture.encounterId)).toEqual(
    pending.patientTravel!.outboundPath.at(-1),
  );
  const activeActors = await capturePhlebotomyStage(page, state, {
    pathway: "pending-result",
    orientation: 0,
    stage: "collection",
    encounterId: fixture.encounterId,
    employeeId: fixture.employeeId,
    roomId: fixture.roomId,
  });
  expect(activeActors[`character:patient:${fixture.encounterId}`]).toMatchObject({
    supportRole: "phlebotomy-patient",
    supportId: "chair:patient",
    pose: "seated",
  });
  expect(activeActors[`character:staff:${fixture.employeeId}`]).toMatchObject({
    supportRole: "phlebotomy-clinician",
    supportId: "stool:clinician",
    pose: "seated",
  });

  state = advanceUntil(state, "pending-result.release", (candidate) => {
    const currentEncounter = candidate.encounters[fixture.encounterId];
    const employee = candidate.employees.find((item) => item.id === fixture.employeeId);
    return Boolean(currentEncounter?.patientMovement && employee?.facilityTask === null);
  });
  expect(state.encounters[fixture.encounterId]!.pendingResult?.deliveredAtTick).toBeNull();
  await capturePhlebotomyStage(page, state, {
    pathway: "pending-result",
    orientation: 0,
    stage: "release",
    encounterId: fixture.encounterId,
    employeeId: fixture.employeeId,
    roomId: fixture.roomId,
  });
  const releaseRoles = await projectedRoles(page);
  expect(releaseRoles[`character:patient:${fixture.encounterId}`]).toBeUndefined();
  expect(releaseRoles[`character:staff:${fixture.employeeId}`]).toBeUndefined();
});

test("phlebotomy orientation 270: a real GS023 collection visitor arrives, collects, and releases both supports", async ({ page }) => {
  await startClinic(page, "GS025 Phlebotomy GS023", "GS025 Phlebotomy GS023");
  const initial = (await getActiveState(page)) as unknown as GameState;
  const configured = createRealPhlebotomyOrder(initial, 270, "pending-result");
  let state = configured.state;
  state.encounters = {};
  state.serviceOperations = [];
  state.serviceAppointmentsEnabled = true;
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  const employee = state.employees.find((item) => item.id === configured.employeeId)!;
  employee.facilityTask = null;
  state = gameReducer(state, {
    type: "START_SERVICE_OPERATION",
    operationId: "gs025.phlebotomy.gs023.start",
    incomeLineId: "income.collection",
    actorKind: "visitor",
  });
  const created = state.serviceOperations[0]!;
  const diagnosticRoot = join(WAITING_PHLEBOTOMY_ROOT, "phlebotomy-flow");
  mkdirSync(diagnosticRoot, { recursive: true });
  writeFileSync(
    join(diagnosticRoot, "gs023-collection-270-created-state.json"),
    `${JSON.stringify({
      state,
      receipt: state.operationReceipts["gs025.phlebotomy.gs023.start"],
    }, null, 2)}\n`,
  );
  expect(created).toMatchObject({
    incomeLineId: "income.collection",
    actorKind: "visitor",
    status: "waiting_for_resources",
    reservedRoomInstanceIds: [],
    reservedEmployeeIds: [],
  });
  state = advanceUntil(state, "gs023-collection.reserved", (candidate) => {
    const operation = candidate.serviceOperations.find((item) => item.id === created.id);
    return Boolean(
      operation?.status === "walking_to_service" &&
      operation.reservedRoomInstanceIds[0] === configured.roomId &&
      operation.reservedEmployeeIds[0] === configured.employeeId,
    );
  });
  const reserved = state.serviceOperations.find((item) => item.id === created.id)!;
  expect(reserved).toMatchObject({
    incomeLineId: "income.collection",
    actorKind: "visitor",
    status: "walking_to_service",
    reservedRoomInstanceIds: [configured.roomId],
    reservedEmployeeIds: [configured.employeeId],
  });
  const actorKey = `character:service-visitor:${created.actorId}`;
  state = advanceUntil(state, "gs023-collection.midwalk", (candidate) => {
    const operation = candidate.serviceOperations.find((item) => item.id === created.id);
    return operation?.status === "walking_to_service" && operation.pathIndex < operation.path.length - 1;
  });
  const midwalkActors = await capturePhlebotomyStage(page, state, {
    pathway: "gs023-collection",
    orientation: 270,
    stage: "midwalk",
    encounterId: created.actorId,
    actorKey,
    employeeId: configured.employeeId,
    roomId: configured.roomId,
  });
  const midwalkRoles = await projectedRoles(page);
  expect(midwalkRoles[actorKey]).toBeUndefined();
  expect(midwalkActors[actorKey]?.pose).not.toBe("seated");

  state = advanceUntil(state, "gs023-collection.active", (candidate) =>
    candidate.serviceOperations.some((item) => item.id === created.id && item.status === "in_service"),
  );
  const active = state.serviceOperations.find((item) => item.id === created.id)!;
  expect(active.phaseEndsAtFacilityTick! - active.phaseStartedAtFacilityTick!).toBe(15);
  const activeActors = await capturePhlebotomyStage(page, state, {
    pathway: "gs023-collection",
    orientation: 270,
    stage: "collection",
    encounterId: created.actorId,
    actorKey,
    employeeId: configured.employeeId,
    roomId: configured.roomId,
  });
  expect(activeActors[actorKey]).toMatchObject({
    supportRole: "phlebotomy-patient",
    supportId: "chair:patient",
    pose: "seated",
  });
  expect(activeActors[`character:staff:${configured.employeeId}`]).toMatchObject({
    supportRole: "phlebotomy-clinician",
    supportId: "stool:clinician",
    pose: "seated",
  });

  state = advanceUntil(state, "gs023-collection.release", (candidate) => {
    const operation = candidate.serviceOperations.find((item) => item.id === created.id);
    const worker = candidate.employees.find((item) => item.id === configured.employeeId);
    return operation?.status === "leaving" && worker?.facilityTask === null;
  });
  await capturePhlebotomyStage(page, state, {
    pathway: "gs023-collection",
    orientation: 270,
    stage: "release",
    encounterId: created.actorId,
    actorKey,
    employeeId: configured.employeeId,
    roomId: configured.roomId,
  });
  const releaseRoles = await projectedRoles(page);
  expect(releaseRoles[actorKey]).toBeUndefined();
  expect(releaseRoles[`character:staff:${configured.employeeId}`]).toBeUndefined();
});

test("south-seat baseline: Waiting 0 bench uses fixed patient identities at 100 and 160 percent", async ({ page }) => {
  await startClinic(page, "GS025 South Bench", "GS025 South Bench");
  let state = (await getActiveState(page)) as unknown as GameState;
  const waitingRoom = room("room.gs025.south-bench", "room.waiting", 28, 24, 0);
  state = isolateState(state, [waitingRoom]);
  const anchors = getRoomWaitingAnchors(waitingRoom, definitionFor(waitingRoom));
  state = addPatient(state, "GS025 South Bench 001", waitingRoom, anchors[0]!, true);
  state.encounters["GS025 South Bench 001"]!.frozenCase.prototypeDemographics = {
    ageYears: 50,
    sexLabel: "Female",
  };
  state.encounters["GS025 South Bench 001"]!.patientAppearance = {
    ...state.encounters["GS025 South Bench 001"]!.patientAppearance,
    stillId: "patient.adult.013",
    patientIdentityId: "patient.adult.013",
    roleStyle: "patient",
  };
  state = addPatient(state, "GS025 South Bench 040", waitingRoom, anchors[1]!, true);
  state.encounters["GS025 South Bench 040"]!.frozenCase.prototypeDemographics = {
    ageYears: 52,
    sexLabel: "Female",
  };
  state.encounters["GS025 South Bench 040"]!.patientAppearance = {
    ...state.encounters["GS025 South Bench 040"]!.patientAppearance,
    stillId: "patient.adult.013",
    patientIdentityId: "patient.adult.013",
    roleStyle: "patient",
  };
  saveSouthSeatState("waiting-0-bench", state);
  await installFixture(page, state, "GS025 South Bench", "gs025-south-bench");
  const keys = ["character:patient:GS025 South Bench 001", "character:patient:GS025 South Bench 040"];
  const roles = await projectedRoles(page);
  expect(keys.map((key) => roles[key])).toEqual(["waiting-seat", "waiting-seat"]);
  await captureSouthSeatAtZoom(page, waitingRoom.id, 1, "waiting-0-bench-100", keys);
  await captureSouthSeatAtZoom(page, waitingRoom.id, 1.6, "waiting-0-bench-160", keys);
});

test("south-seat baseline: Waiting 270 south chair uses fixed patient identity at 100 and 160 percent", async ({ page }) => {
  await startClinic(page, "GS025 South Chair", "GS025 South Chair");
  let state = (await getActiveState(page)) as unknown as GameState;
  const waitingRoom = room("room.gs025.south-chair", "room.waiting", 28, 24, 270);
  state = isolateState(state, [waitingRoom]);
  const anchors = getRoomWaitingAnchors(waitingRoom, definitionFor(waitingRoom));
  state = addPatient(state, "GS025 South Chair 040", waitingRoom, anchors[3]!, true);
  state.encounters["GS025 South Chair 040"]!.frozenCase.prototypeDemographics = {
    ageYears: 50,
    sexLabel: "Female",
  };
  state.encounters["GS025 South Chair 040"]!.patientAppearance = {
    ...state.encounters["GS025 South Chair 040"]!.patientAppearance,
    stillId: "patient.adult.013",
    patientIdentityId: "patient.adult.013",
    roleStyle: "patient",
  };
  saveSouthSeatState("waiting-270-south-chair", state);
  await installFixture(page, state, "GS025 South Chair", "gs025-south-chair");
  const key = "character:patient:GS025 South Chair 040";
  expect((await projectedRoles(page))[key]).toBe("waiting-seat");
  await captureSouthSeatAtZoom(page, waitingRoom.id, 1, "waiting-270-south-chair-100", [key]);
  await captureSouthSeatAtZoom(page, waitingRoom.id, 1.6, "waiting-270-south-chair-160", [key]);
});

test("south-seat baseline: Front Desk secretary uses fixed identity at 100 and 160 percent", async ({ page }) => {
  await startClinic(page, "GS025 South Secretary", "GS025 South Secretary");
  let state = (await getActiveState(page)) as unknown as GameState;
  state = isolateState(state, []);
  const frontDesk = state.rooms.find((candidate) => candidate.roomDefinitionId === "room.front_desk")!;
  const staffAnchor = getRoomNavigationAnchor(frontDesk, definitionFor(frontDesk), "staff");
  addEmployee(state, "employee.gs025.south-secretary", "staff.receptionist", frontDesk.id, staffAnchor);
  state.employees[0]!.appearance = {
    ...state.employees[0]!.appearance,
    stillId: "gs022-new-employee-001",
    roleStyle: "receptionist",
  };
  state.environment.founderLocation = { x: 1, y: 1 };
  saveSouthSeatState("front-desk-secretary", state);
  await installFixture(page, state, "GS025 South Secretary", "gs025-south-secretary");
  const key = "character:staff:employee.gs025.south-secretary";
  expect((await projectedRoles(page))[key]).toBe("front-desk-staff");
  await captureSouthSeatAtZoom(page, frontDesk.id, 1, "front-desk-secretary-100", [key]);
  await captureSouthSeatAtZoom(page, frontDesk.id, 1.6, "front-desk-secretary-160", [key]);
});

test("Ultrasound and Minor Procedure attach patients and working partners to paired furniture", async ({ page }) => {
  await startClinic(page, "GS025 Care Pairs", "GS025 Care Pairs");
  let state = (await getActiveState(page)) as unknown as GameState;
  const ultrasound = room("room.gs025.ultrasound", "room.ultrasound", 26, 23);
  const minor = room("room.gs025.minor", "room.minor_procedure", 31, 23);
  state = isolateState(state, [ultrasound, minor]);

  const ultrasoundPatient = getRoomCareAnchor(ultrasound, definitionFor(ultrasound), "patient");
  const ultrasoundClinician = getRoomCareAnchor(ultrasound, definitionFor(ultrasound), "clinician");
  state = addPatient(state, "GS025 Ultrasound Patient", ultrasound, ultrasoundPatient);
  addEmployee(
    state,
    "employee.gs025.ultrasound",
    "staff.imaging_technician",
    ultrasound.id,
    ultrasoundClinician,
    { kind: "perform_service", targetId: "operation.gs025.ultrasound", startedAtFacilityTick: state.facilityTick, workMinutesRemaining: 60 },
  );
  addInServiceOperation(state, {
    id: "operation.gs025.ultrasound",
    incomeLineId: "income.procedure.image_guided_breast_abscess_aspiration",
    encounterId: "GS025 Ultrasound Patient",
    roomId: ultrasound.id,
    location: ultrasoundPatient,
    employeeIds: ["employee.gs025.ultrasound"],
  });

  const minorPatient = getRoomCareAnchor(minor, definitionFor(minor), "patient");
  const minorClinician = getRoomCareAnchor(minor, definitionFor(minor), "clinician");
  state = addPatient(state, "GS025 Minor Patient", minor, minorPatient);
  addInServiceOperation(state, {
    id: "operation.gs025.minor",
    incomeLineId: "income.procedure.breast_cyst_aspiration.v2",
    encounterId: "GS025 Minor Patient",
    roomId: minor.id,
    location: minorPatient,
    provider: "founder",
  });
  state.environment.founderLocation = { ...minorClinician };
  state.environment.founderActivity = {
    kind: "perform_service",
    targetId: "operation.gs025.minor",
    path: [{ ...minorClinician }],
    pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick,
    workMinutesRemaining: 60,
  };

  await installFixture(page, state, "GS025 Care Pairs", "gs025-care-pairs");
  const expected: Array<{ roomId: string; keys: [string, string]; roles: [SupportRole, SupportRole]; shot: string }> = [
    {
      roomId: ultrasound.id,
      keys: ["character:patient:GS025 Ultrasound Patient", "character:staff:employee.gs025.ultrasound"],
      roles: ["ultrasound-patient", "ultrasound-clinician"],
      shot: "ultrasound-patient-technician-facing.png",
    },
    {
      roomId: minor.id,
      keys: ["character:patient:GS025 Minor Patient", "character:founder"],
      roles: ["minor-procedure-patient", "minor-procedure-clinician"],
      shot: "minor-procedure-patient-founder-facing.png",
    },
  ];
  for (const fixture of expected) {
    await centerRoom(page, fixture.roomId);
    const roles = await projectedRoles(page);
    expect(fixture.keys.map((key) => roles[key])).toEqual(fixture.roles);
    const actors = await renderedActors(page, fixture.keys);
    expect(actors[fixture.keys[0]]).toMatchObject({ supportRole: fixture.roles[0], pose: "exam-table" });
    expect(actors[fixture.keys[1]]).toMatchObject({ supportRole: fixture.roles[1], pose: "seated" });
    expect(actors[fixture.keys[0]]!.supportId).toContain("table");
    expect(actors[fixture.keys[1]]!.supportId).toContain("stool");
    expect(renderedCardinal(actors[fixture.keys[0]]!)).toBe("south");
    expect(renderedCardinal(actors[fixture.keys[1]]!)).toBe("north");
    await capture(page, fixture.shot);
  }
});

test("an external ultrasound service visitor occupies the patient bed while the technician uses the stool", async ({ page }) => {
  await startClinic(page, "GS025 Service Visitor", "GS025 Service Visitor");
  let state = (await getActiveState(page)) as unknown as GameState;
  const ultrasound = room("room.gs025.visitor-ultrasound", "room.ultrasound", 27, 23);
  state = isolateState(state, [ultrasound]);
  const patientAnchor = getRoomCareAnchor(ultrasound, definitionFor(ultrasound), "patient");
  const clinicianAnchor = getRoomCareAnchor(ultrasound, definitionFor(ultrasound), "clinician");
  addEmployee(
    state,
    "employee.gs025.visitor-ultrasound",
    "staff.imaging_technician",
    ultrasound.id,
    clinicianAnchor,
    { kind: "perform_service", targetId: "operation.gs025.visitor-ultrasound", startedAtFacilityTick: state.facilityTick, workMinutesRemaining: 5 },
  );
  state.serviceOperations.push({
    id: "operation.gs025.visitor-ultrasound",
    incomeLineId: "income.bladder_scan",
    catalogVersion: 1,
    actorKind: "visitor",
    actorId: "visitor.gs025.ultrasound",
    displayName: "Ultrasound Service Visitor",
    appearance: state.founder.appearance,
    status: "in_service",
    createdAtFacilityTick: state.facilityTick,
    waitDeadlineFacilityTick: Number.MAX_SAFE_INTEGER,
    startedAtFacilityTick: state.facilityTick,
    completedAtFacilityTick: null,
    cancelledAtFacilityTick: null,
    quoteFee: 20,
    phaseIndex: 0,
    phaseStartedAtFacilityTick: state.facilityTick,
    phaseEndsAtFacilityTick: state.facilityTick + 5,
    reservedRoomInstanceIds: [ultrasound.id],
    reservedEmployeeIds: ["employee.gs025.visitor-ultrasound"],
    providerReservation: null,
    location: { ...patientAnchor },
    path: [{ ...patientAnchor }],
    pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick,
    cancellationReason: null,
    resourceQueueVersion: 1,
  });
  await installFixture(page, state, "GS025 Service Visitor", "gs025-service-visitor");
  await centerRoom(page, ultrasound.id);

  const visitorKey = "character:service-visitor:visitor.gs025.ultrasound";
  const techKey = "character:staff:employee.gs025.visitor-ultrasound";
  const roles = await projectedRoles(page);
  expect([roles[visitorKey], roles[techKey]]).toEqual(["ultrasound-patient", "ultrasound-clinician"]);
  const actors = await renderedActors(page, [visitorKey, techKey]);
  expect(actors[visitorKey]).toMatchObject({ supportRole: "ultrasound-patient", pose: "exam-table" });
  expect(actors[visitorKey]!.supportId).toContain("table");
  expect(renderedCardinal(actors[visitorKey]!)).toBe("south");
  expect(actors[techKey]).toMatchObject({ supportRole: "ultrasound-clinician", pose: "seated" });
  expect(actors[techKey]!.supportId).toContain("stool");
  expect(renderedCardinal(actors[techKey]!)).toBe("north");
  await capture(page, "ultrasound-service-visitor-and-technician.png");
});

test("CT patient faces away from the scanner while the imaging operator stands at the console", async ({ page }) => {
  await startClinic(page, "GS025 CT", "GS025 CT");
  let state = (await getActiveState(page)) as unknown as GameState;
  const ct = room("room.gs025.ct", "room.ct", 27, 22);
  state = isolateState(state, [ct]);
  const patientAnchor = getRoomCareAnchor(ct, definitionFor(ct), "patient");
  const operatorAnchor = getRoomCareAnchor(ct, definitionFor(ct), "clinician");
  state = addPatient(state, "GS025 CT Patient", ct, patientAnchor);
  addEmployee(state, "employee.gs025.ct", "staff.imaging_technician", ct.id, operatorAnchor);
  addImagingPendingResult(state, "GS025 CT Patient", ct, "employee.gs025.ct", "service.ct");
  state.employees[0]!.facilityTask = {
    kind: "perform_imaging",
    targetId: "gs025.pending.GS025 CT Patient",
    startedAtFacilityTick: state.facilityTick,
    workMinutesRemaining: 60,
  };
  await installFixture(page, state, "GS025 CT", "gs025-ct");
  await centerRoom(page, ct.id);

  const patientKey = "character:patient:GS025 CT Patient";
  const operatorKey = "character:staff:employee.gs025.ct";
  const roles = await projectedRoles(page);
  expect([roles[patientKey], roles[operatorKey]]).toEqual(["ct-patient", "ct-operator"]);
  const actors = await renderedActors(page, [patientKey, operatorKey]);
  expect(actors[patientKey]).toMatchObject({ supportRole: "ct-patient", pose: "exam-table" });
  expect(actors[patientKey]!.supportId).toContain("scanner");
  expect(renderedCardinal(actors[patientKey]!)).toBe("south");
  expect(actors[operatorKey]).toMatchObject({ supportRole: "ct-operator", pose: "idle" });
  expect(actors[operatorKey]!.supportId).toContain("console");
  expect(renderedCardinal(actors[operatorKey]!)).toBe("north");
  await capture(page, "ct-patient-and-standing-console-operator.png");
});

test("EVS workers sort on both sides of the CT console without inheriting operator pose", async ({ page }) => {
  await startClinic(page, "GS025 CT EVS", "GS025 CT EVS");
  let state = (await getActiveState(page)) as unknown as GameState;
  const ct = room("room.gs025.ct.evs", "room.ct", 27, 22);
  state = isolateState(state, [ct]);
  const behind = { x: ct.x + 3, y: ct.y + 1 };
  const inFront = { x: ct.x + 3, y: ct.y + 3 };
  const cleaningTask = {
    kind: "clean_room" as const,
    targetId: ct.id,
    startedAtFacilityTick: state.facilityTick,
    workMinutesRemaining: 5,
  };
  addEmployee(state, "employee.gs025.evs.behind", "staff.evs_worker", ct.id, behind, cleaningTask);
  addEmployee(state, "employee.gs025.evs.front", "staff.evs_worker", ct.id, inFront, cleaningTask);
  state.environment.founderLocation = { x: 1, y: 1 };
  await installFixture(page, state, "GS025 CT EVS", "gs025-ct-evs");
  await centerRoom(page, ct.id);

  const keys = ["character:staff:employee.gs025.evs.behind", "character:staff:employee.gs025.evs.front"];
  const roles = await projectedRoles(page);
  expect(keys.map((key) => roles[key])).toEqual([undefined, undefined]);
  const actors = await renderedActors(page, keys);
  for (const key of keys) {
    expect(actors[key]!.supportRole).toBeUndefined();
    expect(actors[key]!.pose).toBe("idle");
    expect(renderedCardinal(actors[key]!)).toBe("south");
  }
  const consoleDepth = await page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene");
    const consoleEntry = [...scene.fixtureBitmapImages.entries()].find(([id, image]: [string, any]) =>
      id.includes(":console") && image.visible,
    );
    if (!consoleEntry) throw new Error("Visible CT console fixture was not found.");
    return consoleEntry[1].depth as number;
  });
  expect(actors[keys[0]]!.depth).toBeLessThan(consoleDepth);
  expect(actors[keys[1]]!.depth).toBeGreaterThan(consoleDepth);
  await capture(page, "ct-evs-behind-and-in-front-of-console.png");
});

test("Front Desk receptionist remains seated with the chair visible behind the desk", async ({ page }) => {
  await startClinic(page, "GS025 Front Desk", "GS025 Front Desk");
  let state = (await getActiveState(page)) as unknown as GameState;
  state = isolateState(state, []);
  const frontDesk = state.rooms.find((candidate) => candidate.roomDefinitionId === "room.front_desk")!;
  const staffAnchor = getRoomNavigationAnchor(frontDesk, definitionFor(frontDesk), "staff");
  addEmployee(state, "employee.gs025.receptionist", "staff.receptionist", frontDesk.id, staffAnchor);
  state.environment.founderLocation = { x: 1, y: 1 };
  await installFixture(page, state, "GS025 Front Desk", "gs025-front-desk");
  await centerRoom(page, frontDesk.id);

  const key = "character:staff:employee.gs025.receptionist";
  expect((await projectedRoles(page))[key]).toBe("front-desk-staff");
  const actor = (await renderedActors(page, [key]))[key]!;
  await capture(page, "front-desk-receptionist-chair-and-desk-layering.png");
  expect(actor).toMatchObject({ supportRole: "front-desk-staff", pose: "seated", visible: true });
  expect(renderedCardinal(actor)).toBe("south");
  const layers = await page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene");
    const chair = [...scene.fixtureBitmapImages.entries()].find(([id, image]: [string, any]) =>
      id.includes("receptionist-chair") && image.visible,
    );
    const desk = [...scene.fixtureBitmapImages.entries()].find(([id, image]: [string, any]) =>
      id.includes(":desk") && image.visible,
    );
    return {
      chairVisible: Boolean(chair?.[1]?.visible),
      chairDepth: chair?.[1]?.depth,
      deskDepth: desk?.[1]?.depth,
      actorDepth: scene.characterBitmapContainers.get("character:staff:employee.gs025.receptionist")?.depth,
    };
  });
  expect(layers.chairVisible, "occupied receptionist chair must remain rendered").toBe(true);
  expect(layers.actorDepth).toBeGreaterThan(layers.chairDepth);
  expect(layers.actorDepth).toBeLessThan(layers.deskDepth);
});

for (const orientation of [0, 270] as const) {
  test(`Examination Room ${orientation} seats the patient and founder facing each other`, async ({ page }) => {
    await startClinic(page, `GS025 Exam ${orientation}`, `GS025 Exam ${orientation}`);
    let state = (await getActiveState(page)) as unknown as GameState;
    const exam = room("room.gs025.exam", "room.examination", 28, 24, orientation);
    state = isolateState(state, [exam]);
    const patientAnchor = getRoomCareAnchor(exam, definitionFor(exam), "patient");
    const clinicianAnchor = getRoomCareAnchor(exam, definitionFor(exam), "clinician");
    state = addPatient(state, `GS025 Exam Patient ${orientation}`, exam, patientAnchor);
    state.environment.founderLocation = { ...clinicianAnchor };
    state.environment.founderActivity = {
      kind: "attend_encounter",
      targetId: `GS025 Exam Patient ${orientation}`,
      path: [{ ...clinicianAnchor }],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: 10,
    };
    await installFixture(page, state, `GS025 Exam ${orientation}`, `gs025-exam-${orientation}`);
    await centerRoom(page, exam.id);

    const patientKey = `character:patient:GS025 Exam Patient ${orientation}`;
    const founderKey = "character:founder";
    const roles = await projectedRoles(page);
    expect(roles[patientKey]).toBe("examination-patient");
    expect(roles[founderKey]).toBe("examination-clinician");
    const actors = await renderedActors(page, [patientKey, founderKey]);
    expect(actors[patientKey]).toMatchObject({ supportRole: "examination-patient", pose: "exam-table" });
    expect(actors[founderKey]).toMatchObject({ supportRole: "examination-clinician", pose: "seated" });
    expect(actors[patientKey]!.supportId).toContain("table");
    expect(actors[founderKey]!.supportId).toContain("stool");
    expect(renderedCardinal(actors[patientKey]!)).toBe(orientation === 0 ? "west" : "south");
    expect(renderedCardinal(actors[founderKey]!)).toBe(orientation === 0 ? "east" : "north");
    if (orientation === 0) {
      const initialTick = await page.evaluate(() => {
        const host = document.querySelector("[data-testid='facility-canvas']") as any;
        return host.__facilityGame.scene.getScene("facility-scene").bridge.viewModel.facilityTick as number;
      });
      await page.getByRole("button", { name: "Resume facility time" }).click();
      await expect.poll(async () => page.evaluate(() => {
        const host = document.querySelector("[data-testid='facility-canvas']") as any;
        return host.__facilityGame.scene.getScene("facility-scene").bridge.viewModel.facilityTick as number;
      })).toBeGreaterThan(initialTick);
      await page.getByRole("button", { name: "Pause facility time" }).click();
      await centerRoom(page, exam.id);
      const afterCycle = await renderedActors(page, [patientKey, founderKey]);
      expect(afterCycle[patientKey]).toMatchObject({ supportRole: "examination-patient", pose: "exam-table" });
      expect(afterCycle[founderKey]).toMatchObject({ supportRole: "examination-clinician", pose: "seated" });
    }
    await capture(page, `exam-${orientation}-patient-founder-facing.png`);
  });
}

test("side-chair layering: shared Waiting bench reconciles 0-1-2-1-0 without rebuilding either room", async ({ page }) => {
  await startClinic(page, "GS025 Side Bench Lifecycle", "GS025 Side Bench Lifecycle");
  const active = (await getActiveState(page)) as unknown as GameState;
  const firstRoom = room("room.gs025.side.waiting.lifecycle.a", "room.waiting", 27, 24, 270);
  const secondRoom = room("room.gs025.side.waiting.lifecycle.b", "room.waiting", 33, 24, 270);
  let state = deterministicSideChairInitial(active, "waiting-bench-lifecycle");
  state = isolateState(state, [firstRoom, secondRoom]);
  const actorKeys: string[] = [];
  for (const [roomIndex, waiting] of [firstRoom, secondRoom].entries()) {
    for (const [anchorIndex, anchor] of getRoomWaitingAnchors(waiting, definitionFor(waiting)).slice(0, 2).entries()) {
      const encounterId = `GS025 Side Bench Lifecycle ${roomIndex + 1}-${anchorIndex + 1}`;
      state = addPatient(state, encounterId, waiting, anchor, true);
      actorKeys.push(`character:patient:${encounterId}`);
    }
  }
  await installFixture(
    page,
    { ...state, paused: true },
    "GS025 Side Bench Lifecycle",
    "gs025-side-bench-lifecycle",
  );
  await centerRoom(page, firstRoom.id, 1);
  await renderedActors(page, actorKeys);
  const initialized = await page.evaluate(({ firstRoomId, secondRoomId }) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    const model = scene.bridge.viewModel;
    const supportFor = (patient: any) => {
      const container = scene.characterBitmapContainers.get(`character:patient:${patient.instanceId}`);
      return {
        roomId: container?.getData("actor-support-room-instance-id"),
        supportId: container?.getData("actor-support-id"),
      };
    };
    const firstBench = model.patients.filter((patient: any) => {
      const support = supportFor(patient);
      return support.roomId === firstRoomId && String(support.supportId).startsWith("bench:seat-");
    });
    const secondBench = model.patients.filter((patient: any) => {
      const support = supportFor(patient);
      return support.roomId === secondRoomId && String(support.supportId).startsWith("bench:seat-");
    });
    (globalThis as any).__gs025BenchLifecycle = {
      originalPatients: [...model.patients],
      firstBench,
      secondBench,
      baseImages: new Map(
        [...scene.approvedSideChairRuntimes.entries()].map(([key, runtime]: [string, any]) => [key, runtime.baseImage]),
      ),
    };
    return {
      firstIds: firstBench.map((patient: any) => patient.instanceId),
      secondIds: secondBench.map((patient: any) => patient.instanceId),
    };
  }, { firstRoomId: firstRoom.id, secondRoomId: secondRoom.id });
  expect(initialized.firstIds).toHaveLength(2);
  expect(initialized.secondIds).toHaveLength(2);

  const phaseRoot = join(SIDE_CHAIR_ROOT, SIDE_CHAIR_CAPTURE_PHASE, "bench-lifecycle");
  mkdirSync(phaseRoot, { recursive: true });
  const sequence = [
    { label: "0", count: 0 },
    { label: "1a", count: 1 },
    { label: "2", count: 2 },
    { label: "1b", count: 1 },
    { label: "0-final", count: 0 },
  ] as const;
  for (const stage of sequence) {
    const result = await page.evaluate(({ count, firstRoomId, secondRoomId }) => {
      const host = document.querySelector("[data-testid='facility-canvas']") as any;
      const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
      const lifecycle = (globalThis as any).__gs025BenchLifecycle;
      const firstIds = new Set(lifecycle.firstBench.map((patient: any) => patient.instanceId));
      const keep = lifecycle.originalPatients.filter((patient: any) => !firstIds.has(patient.instanceId));
      scene.bridge.viewModel.patients.splice(
        0,
        scene.bridge.viewModel.patients.length,
        ...keep,
        ...lifecycle.firstBench.slice(0, count),
      );
      scene.drawCharacters();
      const snapshots = scene.debugApprovedSideChairLayerSnapshot();
      const first = snapshots.find((item: any) =>
        item.roomInstanceId === firstRoomId && item.supportIds.includes("bench:seat-1"),
      );
      const second = snapshots.find((item: any) =>
        item.roomInstanceId === secondRoomId && item.supportIds.includes("bench:seat-1"),
      );
      const stableBaseImages = [...scene.approvedSideChairRuntimes.entries()].every(
        ([key, runtime]: [string, any]) => lifecycle.baseImages.get(key) === runtime.baseImage,
      );
      const visibleFirstBenchActors = lifecycle.firstBench.slice(0, count).map((patient: any) => {
        const container = scene.characterBitmapContainers.get(`character:patient:${patient.instanceId}`);
        return {
          id: patient.instanceId,
          roomId: container?.getData("actor-support-room-instance-id"),
          supportId: container?.getData("actor-support-id"),
          depth: container?.depth,
          visible: Boolean(container?.visible),
        };
      });
      return { first, second, stableBaseImages, visibleFirstBenchActors };
    }, { count: stage.count, firstRoomId: firstRoom.id, secondRoomId: secondRoom.id });
    expect(result.stableBaseImages).toBe(true);
    expect(result.first).toBeTruthy();
    expect(result.second).toBeTruthy();
    expect(result.first.baseLayer).toBe(stage.count === 0 ? "full" : "rear");
    expect(result.first.foregroundVisible).toBe(stage.count > 0);
    expect(result.second.baseLayer).toBe("rear");
    expect(result.second.foregroundVisible).toBe(true);
    expect(result.visibleFirstBenchActors).toHaveLength(stage.count);
    expect(result.visibleFirstBenchActors.every((actor) =>
      actor.roomId === firstRoom.id && String(actor.supportId).startsWith("bench:seat-") && actor.visible,
    )).toBe(true);
    if (stage.count > 0) {
      expect(result.first.foregroundDepth).toBeGreaterThan(
        Math.max(...result.visibleFirstBenchActors.map((actor) => actor.depth)),
      );
    }
    writeFileSync(
      join(phaseRoot, `${stage.label}.json`),
      `${JSON.stringify(result, null, 2)}\n`,
    );
    await page.mouse.move(8, 8);
    await page.getByTestId("facility-canvas").screenshot({
      path: join(phaseRoot, `${stage.label}.png`),
      animations: "disabled",
    });
  }
});

for (const orientation of [0, 270] as const) {
  test(`GLP-1 suite ${orientation} seats two actually assigned NPs at distinct computers only after arrival`, async ({ page }) => {
    await startClinic(page, `GS025 GLP1 ${orientation}`, `GS025 GLP1 ${orientation}`);
    const initial = (await getActiveState(page)) as unknown as GameState;
    const fixture = createRealGlp1Suite(initial, orientation);
    let state = fixture.state;
    mkdirSync(join(GLP1_SEATING_ROOT, "proof"), { recursive: true });
    writeFileSync(
      join(GLP1_SEATING_ROOT, "proof", `glp1-${orientation}-hired.state.json`),
      `${JSON.stringify(state, null, 2)}\n`,
    );
    const employees = () => fixture.employeeIds.map((employeeId) =>
      state.employees.find((candidate) => candidate.id === employeeId)!,
    );
    const movingTargetId = [...fixture.employeeIds].sort((leftId, rightId) => {
      const left = state.employees.find((candidate) => candidate.id === leftId)!;
      const right = state.employees.find((candidate) => candidate.id === rightId)!;
      return right.path.length - left.path.length;
    })[0]!;
    state = advanceUntil(state, `glp1-${orientation}.near-station`, (candidate) => {
      const moving = candidate.employees.find((employee) => employee.id === movingTargetId)!;
      const remaining = moving.path.length - 1 - moving.pathIndex;
      return moving.pathIndex > 0 && remaining > 0 && remaining <= 4;
    }, 600);
    const movingActors = await captureGlp1Stage(page, state, {
      orientation,
      stage: "moving",
      roomId: fixture.roomId,
      employeeIds: fixture.employeeIds,
      zoom: 1.6,
    });
    const movingKey = `character:staff:${movingTargetId}`;
    expect((await projectedRoles(page))[movingKey]).toBeUndefined();
    expect(movingActors[movingKey]).toMatchObject({ visible: true });
    expect(movingActors[movingKey]!.supportRole).toBeUndefined();
    expect(movingActors[movingKey]!.pose).not.toBe("seated");

    state = advanceUntil(state, `glp1-${orientation}.arrived`, (candidate) =>
      fixture.employeeIds.every((employeeId, index) => {
        const employee = candidate.employees.find((item) => item.id === employeeId)!;
        const station = fixture.stationLocations[index]!;
        return employee.location.x === station.x && employee.location.y === station.y;
      }),
    600);
    const arrived = employees();
    expect(arrived.map((employee) => employee.homeRoomInstanceId)).toEqual([
      fixture.roomId,
      fixture.roomId,
    ]);
    expect(new Set(arrived.map((employee) => `${employee.location.x},${employee.location.y}`)).size).toBe(2);

    const keys = fixture.employeeIds.map((employeeId) => `character:staff:${employeeId}`);
    const expectedRoles = ["glp1-np-station-1", "glp1-np-station-2"] as const;
    const expectedSupports = ["telehealth:leftSeat", "telehealth:rightSeat"] as const;
    const expectedDirections = orientation === 0
      ? ["east", "west"] as const
      : ["north", "south"] as const;
    let activeActors: Record<string, RenderedActor> = {};
    for (const [stage, zoom] of [["active-100", 1], ["active-160", 1.6]] as const) {
      activeActors = await captureGlp1Stage(page, state, {
        orientation,
        stage,
        roomId: fixture.roomId,
        employeeIds: fixture.employeeIds,
        zoom,
      });
      const roles = await projectedRoles(page);
      keys.forEach((key, index) => {
        expect(roles[key]).toBe(expectedRoles[index]);
        expect(activeActors[key]).toMatchObject({
          supportRole: expectedRoles[index],
          supportId: expectedSupports[index],
          pose: "seated",
          visible: true,
          stillId: movingActors[key]!.stillId,
        });
        expect(renderedCardinal(activeActors[key]!)).toBe(expectedDirections[index]);
      });
    }
    expect(new Set(keys.map((key) => activeActors[key]!.supportId)).size).toBe(2);

    const layers = await page.evaluate(({ roomId, actorKeys }) => {
      const host = document.querySelector("[data-testid='facility-canvas']") as any;
      const scene = host.__facilityGame.scene.getScene("facility-scene");
      const fixtures = [...scene.fixtureBitmapImages.entries()]
        .filter(([key, image]: [string, any]) => key.includes(`approved:${roomId}:`) && image.visible)
        .map(([key, image]: [string, any]) => ({ key, depth: image.depth }));
      return {
        fixtures,
        actorDepths: actorKeys.map((key: string) => scene.characterBitmapContainers.get(key)?.depth),
      };
    }, { roomId: fixture.roomId, actorKeys: keys });
    const chairDepths = ["chair1", "chair2"].map((id) =>
      layers.fixtures.find((fixtureLayer) => fixtureLayer.key.includes(`:${id}:`))?.depth,
    );
    const stationDepth = layers.fixtures.find((fixtureLayer) =>
      fixtureLayer.key.includes(":station:"),
    )?.depth;
    writeFileSync(
      join(GLP1_SEATING_ROOT, "proof", `glp1-${orientation}-active-160.layers.json`),
      `${JSON.stringify(layers, null, 2)}\n`,
    );
    expect(chairDepths.every((depth) => typeof depth === "number")).toBe(true);
    expect(typeof stationDepth).toBe("number");
    // East/west chairs expose their rear/base layer below the seated actor;
    // the separately asserted south-arm overlay remains above that actor.
    if (orientation === 0) {
      expect(layers.actorDepths[0]).toBeGreaterThan(chairDepths[0]!);
      expect(layers.actorDepths[1]).toBeGreaterThan(chairDepths[1]!);
      expect(layers.actorDepths[0]).toBeLessThan(stationDepth!);
      expect(layers.actorDepths[1]).toBeLessThan(stationDepth!);
    } else {
      expect(layers.actorDepths[0]).toBeGreaterThan(stationDepth!);
      expect(layers.actorDepths[1]).toBeLessThan(stationDepth!);
      expect(layers.actorDepths[0]).toBeLessThan(chairDepths[0]!);
      expect(layers.actorDepths[1]).toBeGreaterThan(chairDepths[1]!);
    }
  });
}

for (const orientation of [0, 270] as const) {
  test(`side-chair layering: Waiting ${orientation} preserves exact occupied, vacant, and moving states`, async ({ page }) => {
    await startClinic(page, `GS025 Side Waiting ${orientation}`, `GS025 Side Waiting ${orientation}`);
    const active = (await getActiveState(page)) as unknown as GameState;
    const roomId = `room.gs025.side.waiting.${orientation}`;
    const occupied = exactSideChairState(`waiting-${orientation}-occupied`, () => {
      let state = deterministicSideChairInitial(active, `waiting-${orientation}`);
      const waiting = room(roomId, "room.waiting", 28, 24, orientation);
      state = isolateState(state, [waiting]);
      const anchors = getRoomWaitingAnchors(waiting, definitionFor(waiting));
      anchors.forEach((anchor, index) => {
        state = addPatient(state, `GS025 Side Waiting ${orientation} ${index + 1}`, waiting, anchor, true);
      });
      return state;
    });
    const actorKeys = [1, 2, 3, 4].map((index) =>
      `character:patient:GS025 Side Waiting ${orientation} ${index}`,
    );
    await captureSideChairScene(page, occupied, {
      name: `waiting-${orientation}-occupied-100`, roomId, actorKeys, zoom: 1,
    });
    const occupied160 = await captureSideChairScene(page, occupied, {
      name: `waiting-${orientation}-occupied-160`, roomId, actorKeys, zoom: 1.6,
    });
    const actorBySupport = Object.fromEntries(
      Object.entries(occupied160.actors).map(([key, actor]) => [actor.supportId!, { key, actor }]),
    );
    if (orientation === 0) {
      expect(renderedCardinal(actorBySupport["leftChair:seat-1"]!.actor)).toBe("east");
      expect(renderedCardinal(actorBySupport["rightChair:seat-1"]!.actor)).toBe("west");
      expectOccupiedSideChairLayers(occupied160, {
        actorKeys: [
          actorBySupport["leftChair:seat-1"]!.key,
          actorBySupport["rightChair:seat-1"]!.key,
        ],
        supportIds: ["leftChair:seat-1", "rightChair:seat-1"],
        roomId,
      });
    } else {
      expect(renderedCardinal(actorBySupport["bench:seat-1"]!.actor)).toBe("east");
      expect(renderedCardinal(actorBySupport["bench:seat-2"]!.actor)).toBe("east");
      expect(renderedCardinal(actorBySupport["leftChair:seat-1"]!.actor)).toBe("north");
      expect(renderedCardinal(actorBySupport["rightChair:seat-1"]!.actor)).toBe("south");
      expectOccupiedSideChairLayers(occupied160, {
        actorKeys: [
          actorBySupport["bench:seat-1"]!.key,
          actorBySupport["bench:seat-2"]!.key,
        ],
        supportIds: ["bench:seat-1", "bench:seat-2"],
        roomId,
      });
    }

    const vacant = exactSideChairState(`waiting-${orientation}-vacant`, () => ({
      ...occupied,
      encounters: {},
      openChartEncounterId: null,
      attendedEncounterId: null,
    }));
    const vacantCapture = await captureSideChairScene(page, vacant, {
      name: `waiting-${orientation}-vacant-160`, roomId, actorKeys: [], zoom: 1.6,
    });
    expectVacantSideChairLayers(
      vacantCapture,
      roomId,
      orientation === 0
        ? ["leftChair:seat-1", "rightChair:seat-1"]
        : ["bench:seat-1", "bench:seat-2"],
    );

    if (orientation === 0) {
      const movingKey = actorBySupport["leftChair:seat-1"]!.key;
      const movingEncounterId = movingKey.replace("character:patient:", "");
      const moving = exactSideChairState("waiting-0-moving", () => {
        const state = JSON.parse(JSON.stringify(occupied)) as GameState;
        const movingEntry = state.encounters[movingEncounterId]!;
        const destination = { ...movingEntry.waitingDestination!.location };
        const origin = { x: destination.x, y: destination.y + 1 };
        movingEntry.patientLocation = origin;
        movingEntry.patientMovement = {
          kind: "walking_to_waiting",
          path: [origin, destination],
          pathIndex: 0,
          lastMovedAtFacilityTick: state.facilityTick,
          destinationRoomInstanceId: roomId,
        };
        return state;
      });
      const movingCapture = await captureSideChairScene(page, moving, {
        name: "waiting-0-moving-160", roomId, actorKeys: [movingKey], zoom: 1.6,
      });
      expect(movingCapture.actors[movingKey]!.supportRole).toBeUndefined();
      expect(movingCapture.actors[movingKey]!.pose).not.toBe("seated");
      expectVacantSideChairLayers(movingCapture, roomId, ["leftChair:seat-1"]);
    }
  });
}

for (const orientation of [0, 270] as const) {
  test(`side-chair layering: GLP-1 ${orientation} preserves actual arrival, vacancy, and pan/zoom`, async ({ page }) => {
    await startClinic(page, `GS025 Side GLP1 ${orientation}`, `GS025 Side GLP1 ${orientation}`);
    const active = (await getActiveState(page)) as unknown as GameState;
    const roomId = `room.gs025.glp1.${orientation}`;
    const employeeIds: [string, string] = [
      `employee.gs025.glp1.${orientation}.a`,
      `employee.gs025.glp1.${orientation}.b`,
    ];
    const occupied = exactSideChairState(`glp1-${orientation}-occupied`, () => {
      const fixture = createRealGlp1Suite(active, orientation);
      return advanceUntil(fixture.state, `side-glp1-${orientation}.arrived`, (candidate) =>
        fixture.employeeIds.every((employeeId, index) => {
          const employee = candidate.employees.find((item) => item.id === employeeId)!;
          const station = fixture.stationLocations[index]!;
          return employee.location.x === station.x && employee.location.y === station.y;
        }), 600);
    });
    const actorKeys = employeeIds.map((employeeId) => `character:staff:${employeeId}`);
    await captureSideChairScene(page, occupied, {
      name: `glp1-${orientation}-occupied-100`, roomId, actorKeys, zoom: 1,
    });
    const occupied160 = await captureSideChairScene(page, occupied, {
      name: `glp1-${orientation}-occupied-160`, roomId, actorKeys, zoom: 1.6,
    });
    if (orientation === 0) {
      expect(renderedCardinal(occupied160.actors[actorKeys[0]!]!)).toBe("east");
      expect(renderedCardinal(occupied160.actors[actorKeys[1]!]!)).toBe("west");
      expectOccupiedSideChairLayers(occupied160, {
        actorKeys,
        supportIds: ["telehealth:leftSeat", "telehealth:rightSeat"],
        roomId,
      });
    } else {
      expect(renderedCardinal(occupied160.actors[actorKeys[0]!]!)).toBe("north");
      expect(renderedCardinal(occupied160.actors[actorKeys[1]!]!)).toBe("south");
      if (SIDE_CHAIR_CAPTURE_PHASE !== "before") {
        expect(occupied160.chairLayers.some((layer) => layer.visible && layer.layer === "south-arm")).toBe(false);
      }
    }

    const vacant = exactSideChairState(`glp1-${orientation}-vacant`, () => ({
      ...occupied,
      employees: [],
    }));
    const vacantCapture = await captureSideChairScene(page, vacant, {
      name: `glp1-${orientation}-vacant-160`, roomId, actorKeys: [], zoom: 1.6,
    });
    if (orientation === 0) {
      expectVacantSideChairLayers(vacantCapture, roomId, ["telehealth:leftSeat", "telehealth:rightSeat"]);
    }

    const moving = exactSideChairState(`glp1-${orientation}-moving`, () => {
      const fixture = createRealGlp1Suite(active, orientation);
      const movingTargetId = fixture.employeeIds[0];
      return advanceUntil(fixture.state, `side-glp1-${orientation}.moving`, (candidate) => {
        const employee = candidate.employees.find((item) => item.id === movingTargetId)!;
        const remaining = employee.path.length - 1 - employee.pathIndex;
        return employee.pathIndex > 0 && remaining > 0 && remaining <= 4;
      }, 600);
    });
    const movingCapture = await captureSideChairScene(page, moving, {
      name: `glp1-${orientation}-moving-160`, roomId, actorKeys, zoom: 1.6,
    });
    expect(movingCapture.actors[actorKeys[0]!]!.supportRole).toBeUndefined();
    expect(movingCapture.actors[actorKeys[0]!]!.pose).not.toBe("seated");
    if (orientation === 0 && SIDE_CHAIR_CAPTURE_PHASE !== "before") {
      expect(movingCapture.chairLayers.some((layer) =>
        layer.visible && layer.layer === "south-arm" && layer.supportIds.includes("telehealth:leftSeat"),
      )).toBe(false);
    }
  });
}

test("side-chair layering: rotated phlebotomy patient chair preserves real movement, occupancy, and vacancy", async ({ page }) => {
  await startClinic(page, "GS025 Side Phlebotomy", "GS025 Side Phlebotomy");
  const active = (await getActiveState(page)) as unknown as GameState;
  const roomId = "room.gs025.phleb.station.270";
  const encounterId = "GS025 Phlebotomy pending-result 270";
  const employeeId = "employee.gs025.phlebotomist.270";
  const occupied = exactSideChairState("phlebotomy-270-occupied", () => {
    const initial = deterministicSideChairInitial(active, "phlebotomy-270");
    const fixture = createRealPhlebotomyOrder(initial, 270, "pending-result");
    return advanceUntil(fixture.state, "side-phlebotomy-270.collection", (candidate) => {
      const pending = candidate.encounters[encounterId]?.pendingResult;
      const collection = pending?.timingPhases?.find((phase) => phase.resourceBound);
      const employee = candidate.employees.find((item) => item.id === employeeId);
      return Boolean(
        collection && candidate.facilityTick >= collection.startsAtTick &&
        candidate.facilityTick < collection.endsAtTick &&
        employee?.pathIndex === employee.path.length - 1,
      );
    });
  });
  const actorKeys = [
    `character:patient:${encounterId}`,
    `character:staff:${employeeId}`,
  ];
  await captureSideChairScene(page, occupied, {
    name: "phlebotomy-270-occupied-100", roomId, actorKeys, zoom: 1,
  });
  const occupied160 = await captureSideChairScene(page, occupied, {
    name: "phlebotomy-270-occupied-160", roomId, actorKeys, zoom: 1.6,
  });
  expect(renderedCardinal(occupied160.actors[actorKeys[0]!]!)).toBe("east");
  expect(renderedCardinal(occupied160.actors[actorKeys[1]!]!)).toBe("west");
  expectOccupiedSideChairLayers(occupied160, {
    actorKeys: [actorKeys[0]!],
    supportIds: ["chair:patient"],
    roomId,
  });

  const vacant = exactSideChairState("phlebotomy-270-vacant", () => ({
    ...occupied,
    encounters: {},
    serviceOperations: [],
    employees: [],
    openChartEncounterId: null,
    attendedEncounterId: null,
  }));
  const vacantCapture = await captureSideChairScene(page, vacant, {
    name: "phlebotomy-270-vacant-160", roomId, actorKeys: [], zoom: 1.6,
  });
  expectVacantSideChairLayers(vacantCapture, roomId, ["chair:patient"]);

  const moving = exactSideChairState("phlebotomy-270-moving", () => {
    const initial = deterministicSideChairInitial(active, "phlebotomy-270");
    return createRealPhlebotomyOrder(initial, 270, "pending-result").state;
  });
  const movingCapture = await captureSideChairScene(page, moving, {
    name: "phlebotomy-270-moving-160", roomId, actorKeys, zoom: 1.6,
  });
  expect(movingCapture.actors[actorKeys[0]!]!.supportRole).toBeUndefined();
  expect(movingCapture.actors[actorKeys[0]!]!.pose).not.toBe("seated");
  if (SIDE_CHAIR_CAPTURE_PHASE !== "before") {
    expect(movingCapture.chairLayers.some((layer) =>
      layer.visible && layer.layer === "south-arm" && layer.supportIds.includes("chair:patient"),
    )).toBe(false);
  }
});
