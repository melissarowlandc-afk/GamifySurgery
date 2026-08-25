import {
  FIRST_TUTORIAL_CASE_ID,
  SECOND_TUTORIAL_CASE_ID,
  type DecisionNode,
  type ResultGate,
  type SyntheticClinicalCase,
} from "@gamify-surgery/clinical-content";
import {
  PROTOTYPE_ALERT_SCHEDULING,
  PROTOTYPE_AMBIENT_ALERT_DEFINITIONS,
  PROTOTYPE_WALKOUT_REVIEW_DEFINITIONS,
  isPrototypeAlertEligible,
  renderPrototypeAlert,
  type PrototypeAlertDefinition,
  type PrototypeDissatisfactionCause,
} from "@gamify-surgery/balance-config";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
  validateDomainContext,
} from "./context";
import { selectRoutineClinicalCase } from "./clinical-selection";
import {
  canAdmitPatient,
  getEligibleServiceRoute,
  getEmergencyGlp1Status,
  getFacilityProgressionStatus,
  getCurrentCapabilities,
  getRoomDefinition,
  getStaffRoleDefinition,
} from "./selectors";
import {
  RANDOMNESS_CONTRACT_VERSION,
  RANDOM_STREAMS,
  deterministicInteger,
  deterministicShuffle,
} from "./randomness";
import {
  applyFsrsReview,
  createNewFsrsCard,
  createSchedulerPins,
  schedulerPinsMatch,
} from "./fsrs-adapter";
import {
  createPatientDisplayName,
  createPatientPixelAppearance,
  createPixelAppearance,
  createStaffDisplayName,
  normalizePixelAppearance,
  roleStyleForStaffDefinition,
} from "./appearance";
import {
  advanceAmbientPedestrians,
  getNextAmbientPedestrianTick,
} from "./ambient-pedestrians";
import {
  findDeterministicFacilityPath,
  getRoomNavigableTiles,
  getRoomNavigationAnchor,
  getRoomWaitingAnchors,
  getRotatedFootprint,
  isInsideFacility,
  roomsOverlap,
  rotateDirection,
} from "./spatial";
import {
  getDoorCells,
  validateDoorPlacement,
} from "./doors";
import {
  evaluateFacilityExperienceConditions,
  synchronizeFacilityConditionOccurrences,
} from "./facility-experience";
import { synchronizeFacilityOperationalAlertOccurrences } from "./facility-alert-conditions";
import {
  advanceEmployeeMovement,
  getEmployeeArrival,
  getEffectiveEmployeeMorale,
} from "./staff";
import type {
  AnswerRecord,
  DoorState,
  DomainContext,
  DomainEvent,
  EmployeeState,
  EncounterSettlement,
  EncounterState,
  GameCommand,
  GameState,
  GridPoint,
  OperationReceipt,
  PatientDissatisfactionCause,
  PatientMovementKind,
  PatientMovementState,
  PendingResult,
  PlacedRoom,
  TerminalFeedback,
  CreateCampaignOptions,
} from "./types";

// Receipts exist for immediate command feedback and a short idempotency
// window. Retaining hundreds of one-per-minute clock receipts made every
// subsequent state clone and autosave progressively more expensive without
// adding player-visible history.
const MAX_TRANSIENT_OPERATION_RECEIPTS = 96;
const MAX_TRANSIENT_TICK_OPERATION_RECEIPTS = 4;
const MAX_TRANSIENT_EVENTS = 500;
function clonePlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function findCase(context: DomainContext, caseId: string): SyntheticClinicalCase | null {
  return (
    context.clinicalRelease.cases.find((clinicalCase) => clinicalCase.id === caseId) ??
    null
  );
}

function getPublicEntrance(
  state: GameState,
  context: DomainContext,
): {
  room: PlacedRoom;
  inside: GridPoint;
  outside: GridPoint;
} | null {
  const exteriorDoor = state.doors.find((door) => door.exterior);
  const room = exteriorDoor
    ? state.rooms.find((candidate) => candidate.id === exteriorDoor.roomId)
    : null;
  const definition = room
    ? getRoomDefinition(room.roomDefinitionId, context)
    : null;
  const cells =
    exteriorDoor && room && definition
      ? getDoorCells(exteriorDoor, room, definition)
      : null;
  return room && cells
    ? {
        room,
        inside: cells.inside,
        outside: cells.outside,
      }
    : null;
}

function getRoomDestinationById(
  state: GameState,
  context: DomainContext,
  roomId: string,
): GridPoint | null {
  const room = state.rooms.find((candidate) => candidate.id === roomId);
  const definition = room
    ? getRoomDefinition(room.roomDefinitionId, context)
    : null;
  return room && definition
    ? getRoomNavigationAnchor(room, definition)
    : null;
}

function facilityPath(
  state: GameState,
  context: DomainContext,
  start: GridPoint,
  goal: GridPoint,
): GridPoint[] {
  return findDeterministicFacilityPath(
    start,
    goal,
    state.rooms,
    state.doors,
    (definitionId) => getRoomDefinition(definitionId, context),
  );
}

function joinPaths(...paths: readonly GridPoint[][]): GridPoint[] {
  const joined: GridPoint[] = [];
  for (const path of paths) {
    for (const point of path) {
      const previous = joined.at(-1);
      if (!previous || previous.x !== point.x || previous.y !== point.y) {
        joined.push({ ...point });
      }
    }
  }
  return joined;
}

function straightSidewalkPath(start: GridPoint, goal: GridPoint): GridPoint[] {
  const path: GridPoint[] = [{ ...start }];
  let cursor = { ...start };
  while (cursor.x !== goal.x) {
    cursor = {
      x: cursor.x + Math.sign(goal.x - cursor.x),
      y: cursor.y,
    };
    path.push(cursor);
  }
  while (cursor.y !== goal.y) {
    cursor = {
      x: cursor.x,
      y: cursor.y + Math.sign(goal.y - cursor.y),
    };
    path.push(cursor);
  }
  return path;
}

function getEncounterSidewalkPoint(
  state: GameState,
  context: DomainContext,
  encounterId: string,
  distance: number,
): GridPoint | null {
  const entrance = getPublicEntrance(state, context);
  if (!entrance) {
    return null;
  }
  const direction =
    deterministicInteger(
      state.campaignSeed,
      RANDOM_STREAMS.routineArrivalTiming,
      `${encounterId}:sidewalk-direction.v1`,
      2,
    ) === 0
      ? -1
      : 1;
  return {
    x: clamp(
      entrance.outside.x + direction * distance,
      0,
      context.balanceRelease.facility.gridWidth - 1,
    ),
    y: entrance.outside.y,
  };
}

function getEncounterArrivalStart(
  state: GameState,
  context: DomainContext,
  encounterId: string,
): GridPoint | null {
  const entrance = getPublicEntrance(state, context);
  if (!entrance) {
    return null;
  }
  const leftSide =
    deterministicInteger(
      state.campaignSeed,
      RANDOM_STREAMS.routineArrivalTiming,
      `${encounterId}:sidewalk-direction.v1`,
      2,
    ) === 0;
  return {
    // Start beyond the permitted map extent so a newly admitted patient enters
    // from completely offscreen instead of materializing on the sidewalk.
    x: leftSide ? -2 : context.balanceRelease.facility.gridWidth + 1,
    y: entrance.outside.y,
  };
}

function pathFromOutsideToRoom(
  state: GameState,
  context: DomainContext,
  outsideStart: GridPoint,
  roomId: string,
): GridPoint[] {
  const entrance = getPublicEntrance(state, context);
  const destination = getRoomDestinationById(state, context, roomId);
  if (!entrance || !destination) {
    return [];
  }
  return joinPaths(
    straightSidewalkPath(outsideStart, entrance.outside),
    [entrance.inside],
    facilityPath(state, context, entrance.inside, destination),
  );
}

function pathFromLocationToRoom(
  state: GameState,
  context: DomainContext,
  start: GridPoint,
  roomId: string,
): GridPoint[] {
  const destination = getRoomDestinationById(state, context, roomId);
  if (!destination) {
    return [];
  }
  if (start.y >= context.balanceRelease.facility.gridHeight) {
    return pathFromOutsideToRoom(state, context, start, roomId);
  }
  return facilityPath(state, context, start, destination);
}

function pathFromLocationToFacilityPoint(
  state: GameState,
  context: DomainContext,
  start: GridPoint,
  destination: GridPoint,
): GridPoint[] {
  const entrance = getPublicEntrance(state, context);
  const gridHeight = context.balanceRelease.facility.gridHeight;
  const startIsOutside = start.y >= gridHeight;
  const destinationIsOutside = destination.y >= gridHeight;
  if (startIsOutside && destinationIsOutside) {
    return straightSidewalkPath(start, destination);
  }
  if (destinationIsOutside) {
    if (!entrance) {
      return [];
    }
    return joinPaths(
      pathFromLocationToExit(state, context, start),
      straightSidewalkPath(entrance.outside, destination),
    );
  }
  if (startIsOutside) {
    if (!entrance) {
      return [];
    }
    return joinPaths(
      straightSidewalkPath(start, entrance.outside),
      [entrance.inside],
      facilityPath(state, context, entrance.inside, destination),
    );
  }
  return facilityPath(state, context, start, destination);
}

function pathFromLocationToExit(
  state: GameState,
  context: DomainContext,
  start: GridPoint,
): GridPoint[] {
  const entrance = getPublicEntrance(state, context);
  if (!entrance) {
    return [];
  }
  if (start.y >= context.balanceRelease.facility.gridHeight) {
    return straightSidewalkPath(start, entrance.outside);
  }
  return joinPaths(
    facilityPath(state, context, start, entrance.inside),
    [entrance.outside],
  );
}

function pathFromLocationToOffscreen(
  state: GameState,
  context: DomainContext,
  start: GridPoint,
  encounterId: string,
): GridPoint[] {
  const endpoint = getEncounterArrivalStart(
    state,
    context,
    encounterId,
  );
  const entrance = getPublicEntrance(state, context);
  if (!endpoint || !entrance) {
    return [];
  }
  if (start.y >= context.balanceRelease.facility.gridHeight) {
    return straightSidewalkPath(start, endpoint);
  }
  return joinPaths(
    pathFromLocationToExit(state, context, start),
    straightSidewalkPath(entrance.outside, endpoint),
  );
}

function movementDuration(
  path: readonly GridPoint[],
  context: DomainContext,
): number {
  return Math.ceil(
    Math.max(0, path.length - 1) /
      context.balanceRelease.facility.characterTravelTilesPerTick,
  );
}

function remainingMovementDuration(
  movement: PatientMovementState | null,
  context: DomainContext,
): number {
  if (!movement) {
    return 0;
  }
  return Math.ceil(
    Math.max(0, movement.path.length - 1 - movement.pathIndex) /
      context.balanceRelease.facility.characterTravelTilesPerTick,
  );
}

function getNextIdleActionTick(
  state: GameState,
  context: DomainContext,
  stableId: string,
): number {
  const environment = context.balanceRelease.environment;
  const spread =
    environment.idleActionMaximumMinutes -
    environment.idleActionMinimumMinutes +
    1;
  return (
    state.facilityTick +
    environment.idleActionMinimumMinutes +
    deterministicInteger(
      state.campaignSeed,
      RANDOM_STREAMS.environment,
      `${stableId}:idle-at:${state.facilityTick}`,
      spread,
    )
  );
}

function createPatientMovement(
  state: GameState,
  context: DomainContext,
  kind: PatientMovementKind,
  path: GridPoint[],
  destinationRoomInstanceId: string | null,
): PatientMovementState | null {
  if (path.length <= 1) {
    return null;
  }
  return {
    kind,
    path: path.map((point) => ({ ...point })),
    pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick,
    destinationRoomInstanceId,
  };
}

function chooseCareRoom(
  state: GameState,
  context: DomainContext,
  start: GridPoint,
  encounterId: string,
): { roomId: string; path: GridPoint[] } | null {
  const occupiedRoomIds = new Set(
    Object.values(state.encounters)
      .filter(
        (encounter) =>
          encounter.id !== encounterId &&
          encounter.lifecycle !== "resolved" &&
          encounter.patientLocation !== null,
      )
      .flatMap((encounter) => [
        ...(encounter.assignedRoomInstanceId
          ? [encounter.assignedRoomInstanceId]
          : []),
        ...(encounter.queuedCareRoomInstanceId
          ? [encounter.queuedCareRoomInstanceId]
          : []),
        ...(encounter.patientMovement?.destinationRoomInstanceId
          ? [encounter.patientMovement.destinationRoomInstanceId]
          : []),
      ]),
  );
  const candidates = state.rooms
    .filter(
      (room) =>
        room.roomDefinitionId === "room.examination" &&
        !occupiedRoomIds.has(room.id),
    )
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((room) => ({
      roomId: room.id,
      path: pathFromLocationToRoom(state, context, start, room.id),
    }))
    .filter((candidate) => candidate.path.length > 0)
    .sort(
      (left, right) =>
        left.path.length - right.path.length ||
        left.roomId.localeCompare(right.roomId),
    );
  return candidates[0] ?? null;
}

function encounterHasExaminationRoomReservation(
  state: GameState,
  encounter: EncounterState,
): boolean {
  const reservedRoomIds = [
    encounter.assignedRoomInstanceId,
    encounter.queuedCareRoomInstanceId,
    encounter.patientMovement?.destinationRoomInstanceId ?? null,
  ].filter((roomId): roomId is string => roomId !== null);

  return reservedRoomIds.some(
    (roomId) =>
      state.rooms.find((room) => room.id === roomId)
        ?.roomDefinitionId === "room.examination",
  );
}

function chooseWaitingDestination(
  state: GameState,
  context: DomainContext,
  encounter: EncounterState,
): { roomId: string | null; path: GridPoint[] } {
  const start = encounter.patientLocation;
  const entrance = getPublicEntrance(state, context);
  if (!start || !entrance) {
    return { roomId: null, path: [] };
  }

  const occupiedPoints = new Set(
    Object.values(state.encounters)
      .filter(
        (candidate) =>
          candidate.id !== encounter.id &&
          candidate.lifecycle !== "resolved",
      )
      .flatMap((candidate) => [
        ...(candidate.patientLocation
          ? [candidate.patientLocation]
          : []),
        ...(candidate.patientMovement?.path.at(-1)
          ? [candidate.patientMovement.path.at(-1)!]
          : []),
      ])
      .map((point) => `${point.x},${point.y}`),
  );
  const startsLeft =
    deterministicInteger(
      state.campaignSeed,
      RANDOM_STREAMS.routineArrivalTiming,
      `${encounter.id}:sidewalk-direction.v1`,
      2,
    ) === 0;

  const waitingRooms = state.rooms
    .filter((room) => room.roomDefinitionId === "room.waiting")
    .sort((left, right) => left.id.localeCompare(right.id))
    .flatMap((room) => {
      const definition = getRoomDefinition(
        room.roomDefinitionId,
        context,
      );
      if (!definition) {
        return [];
      }
      const doorTileKeys = new Set(
        state.doors
          .filter((door) => door.roomId === room.id)
          .flatMap((door) => {
            const cells = getDoorCells(door, room, definition);
            return cells
              ? [`${cells.inside.x},${cells.inside.y}`]
              : [];
          }),
      );
      return [{ room, definition, doorTileKeys }];
    });

  // Every authored Waiting Room anchor corresponds to a chair that is visible
  // in the room art. Fill those seats across every Waiting Room before using
  // the non-room overflow hierarchy.
  for (const {
    room: waitingRoom,
    definition,
    doorTileKeys,
  } of waitingRooms) {
    for (const anchor of getRoomWaitingAnchors(
      waitingRoom,
      definition,
    )) {
      const key = `${anchor.x},${anchor.y}`;
      if (
        doorTileKeys.has(key) ||
        occupiedPoints.has(key)
      ) {
        continue;
      }
      const path = pathFromLocationToFacilityPoint(
        state,
        context,
        start,
        anchor,
      );
      if (path.length > 0) {
        return { roomId: waitingRoom.id, path };
      }
    }
  }

  const frontDeskOccupiedByWaitingPatient = Object.values(state.encounters).some(
    (candidate) =>
      candidate.id !== encounter.id &&
      candidate.lifecycle === "waiting_unopened" &&
      candidate.patientMovement?.kind !== "arriving_for_check_in" &&
      (candidate.assignedRoomInstanceId === entrance.room.id ||
        candidate.patientMovement?.destinationRoomInstanceId ===
          entrance.room.id) &&
      candidate.patientLocation !== null,
  );
  if (!frontDeskOccupiedByWaitingPatient) {
    const frontDefinition = getRoomDefinition(
      entrance.room.roomDefinitionId,
      context,
    );
    const frontAnchors = frontDefinition
      ? getRoomWaitingAnchors(entrance.room, frontDefinition)
      : [];
    const orderedFrontAnchors = [...frontAnchors].sort(
      (left, right) =>
        (startsLeft ? left.x - right.x : right.x - left.x) ||
        left.y - right.y,
    );
    for (const anchor of orderedFrontAnchors) {
      if (occupiedPoints.has(`${anchor.x},${anchor.y}`)) {
        continue;
      }
      const path = pathFromLocationToFacilityPoint(
        state,
        context,
        start,
        anchor,
      );
      if (path.length > 0) {
        return { roomId: entrance.room.id, path };
      }
    }
  }

  const queueCandidates: GridPoint[] = [];
  for (
    let distance = 1;
    distance < context.balanceRelease.facility.gridWidth;
    distance += 1
  ) {
    for (const direction of startsLeft ? [-1, 1] : [1, -1]) {
      const x = entrance.outside.x + direction * distance;
      if (
        x >= 0 &&
        x < context.balanceRelease.facility.gridWidth
      ) {
        queueCandidates.push({ x, y: entrance.outside.y });
      }
    }
  }
  const queuePoint =
    queueCandidates.find(
      (point) => !occupiedPoints.has(`${point.x},${point.y}`),
    ) ?? entrance.outside;
  return {
    roomId: null,
    path: joinPaths(
      pathFromLocationToExit(state, context, start),
      straightSidewalkPath(entrance.outside, queuePoint),
    ),
  };
}

function pointInsideRoom(
  point: GridPoint,
  room: PlacedRoom,
  context: DomainContext,
): boolean {
  const definition = getRoomDefinition(
    room.roomDefinitionId,
    context,
  );
  if (!definition) {
    return false;
  }
  const footprint = getRotatedFootprint(
    definition,
    room.orientation,
  );
  return (
    point.x >= room.x &&
    point.x < room.x + footprint.width &&
    point.y >= room.y &&
    point.y < room.y + footprint.height
  );
}

function roomHasActiveCharacterOrRoute(
  state: GameState,
  room: PlacedRoom,
  context: DomainContext,
): boolean {
  const routeTouchesRoom = (path: readonly GridPoint[]) =>
    path.some((point) => pointInsideRoom(point, room, context));

  for (const encounter of Object.values(state.encounters)) {
    if (encounter.lifecycle === "resolved") {
      continue;
    }
    if (
      encounter.assignedRoomInstanceId === room.id ||
      encounter.queuedCareRoomInstanceId === room.id ||
      encounter.patientMovement?.destinationRoomInstanceId === room.id ||
      (encounter.patientLocation &&
        pointInsideRoom(encounter.patientLocation, room, context)) ||
      (encounter.patientMovement &&
        routeTouchesRoom(
          encounter.patientMovement.path.slice(
            encounter.patientMovement.pathIndex,
          ),
        )) ||
      (encounter.pendingResult?.deliveredAtTick === null &&
        (encounter.pendingResult.patientTravel?.originRoomInstanceId ===
          room.id ||
          encounter.pendingResult.patientTravel
            ?.destinationRoomInstanceId === room.id ||
          routeTouchesRoom(
            encounter.pendingResult.patientTravel?.outboundPath ?? [],
          ) ||
          routeTouchesRoom(
            encounter.pendingResult.patientTravel?.returnPath ?? [],
          ) ||
          routeTouchesRoom(
            encounter.pendingResult.offsiteTravel?.outboundPath ?? [],
          ) ||
          routeTouchesRoom(
            encounter.pendingResult.offsiteTravel?.returnPath ?? [],
          )))
    ) {
      return true;
    }
  }

  if (
    state.employees.some(
      (employee) =>
        employee.homeRoomInstanceId === room.id ||
        pointInsideRoom(employee.location, room, context) ||
        routeTouchesRoom(employee.path.slice(employee.pathIndex)),
    )
  ) {
    return true;
  }
  return (
    pointInsideRoom(
      state.environment.founderLocation,
      room,
      context,
    ) ||
    routeTouchesRoom(
      state.environment.founderActivity?.path.slice(
        state.environment.founderActivity.pathIndex,
      ) ?? [],
    )
  );
}

function assertPinnedContext(state: GameState, context: DomainContext): void {
  if (
    state.clinicalReleaseId !== context.clinicalRelease.id ||
    state.balanceReleaseId !== context.balanceRelease.id
  ) {
    throw new Error("Reducer context does not match the campaign's pinned releases.");
  }
  if (
    !schedulerPinsMatch(
      state.schedulerPins,
      context.balanceRelease.learning.parameterSetId,
    )
  ) {
    throw new Error("Reducer context does not match the campaign's scheduler pins.");
  }
  if (state.randomGeneratorVersion !== RANDOMNESS_CONTRACT_VERSION) {
    throw new Error(
      "Reducer context does not match the campaign's randomness contract.",
    );
  }
}

function createEncounter(
  state: GameState,
  context: DomainContext,
  input: {
    encounterId: string;
    clinicalCase: SyntheticClinicalCase;
    patientDisplayName?: string;
    arrivalClass: EncounterState["arrivalClass"];
    protectedGuaranteeId: string | null;
    patienceExempt?: boolean;
  },
): EncounterState {
  const patienceExempt =
    input.arrivalClass === "tutorial" || input.patienceExempt === true;
  const frozenCase = clonePlain(input.clinicalCase);
  const approvedProfiles = frozenCase.approvedInstantiationProfiles;
  if (approvedProfiles && approvedProfiles.length > 0) {
    const selectedProfile =
      approvedProfiles[
        deterministicInteger(
          state.campaignSeed,
          RANDOM_STREAMS.clinicalPresentation,
          `${input.encounterId}|${frozenCase.id}|approved-profile.v1`,
          approvedProfiles.length,
        )
      ]!;
    frozenCase.selectedInstantiationProfileId = selectedProfile.id;
    frozenCase.presentation = selectedProfile.presentation;
    if (selectedProfile.prototypeDemographics) {
      frozenCase.prototypeDemographics = clonePlain(
        selectedProfile.prototypeDemographics,
      );
    }
    if (selectedProfile.prototypeVitalSigns) {
      frozenCase.prototypeVitalSigns = clonePlain(
        selectedProfile.prototypeVitalSigns,
      );
    }
    if (selectedProfile.chiefComplaint) {
      frozenCase.chiefComplaint = selectedProfile.chiefComplaint;
    }
  }
  for (const node of frozenCase.decisionNodes) {
    if (node.shuffleAnswers) {
      node.answerChoices = deterministicShuffle(
        node.answerChoices,
        state.campaignSeed,
        RANDOM_STREAMS.answerOrder,
        `${input.encounterId}|${node.id}`,
      );
    }
  }
  const patientSexLabel =
    frozenCase.prototypeDemographics?.sexLabel;
  const patientDisplayName =
    input.patientDisplayName ??
    createPatientDisplayName(
      state.campaignSeed,
      input.encounterId,
      patientSexLabel,
    );
  const entrance = getPublicEntrance(state, context);
  const arrivalStart = getEncounterArrivalStart(
    state,
    context,
    input.encounterId,
  );
  const frontCenter = entrance
    ? getRoomDestinationById(state, context, entrance.room.id)
    : null;
  const arrivalPath =
    entrance && arrivalStart && frontCenter
      ? joinPaths(
          straightSidewalkPath(arrivalStart, entrance.outside),
          [entrance.inside],
          facilityPath(state, context, entrance.inside, frontCenter),
        )
      : [];
  const movement = createPatientMovement(
    state,
    context,
    "arriving_for_check_in",
    arrivalPath,
    entrance?.room.id ?? null,
  );
  return {
    id: input.encounterId,
    clinicalReleaseId: context.clinicalRelease.id,
    frozenCase,
    feedAttentionKind: null,
    feedAttentionStartedAtTick: null,
    patientDisplayName,
    patientAppearance: createPatientPixelAppearance(
      state.campaignSeed,
      input.encounterId,
      patientSexLabel,
    ),
    patientSatisfaction:
      context.balanceRelease.patientSatisfaction.startingValue,
    idleWaitingSinceTick: movement ? null : state.facilityTick,
    lastSatisfactionDecayAtTick: state.facilityTick,
    walkoutThreshold: deterministicInteger(
      state.campaignSeed,
      RANDOM_STREAMS.patientWalkout,
      `${input.encounterId}:threshold.v1`,
      context.balanceRelease.patientSatisfaction
        .walkoutThresholdMaximum + 1,
    ),
    satisfactionWarningsShown: [],
    dissatisfactionByCause: {},
    facilityExperienceAtCheckIn: null,
    finalPatientSatisfaction: null,
    resolvedAtFacilityTick: null,
    arrivalClass: input.arrivalClass,
    protectedGuaranteeId: input.protectedGuaranteeId,
    lifecycle: "waiting_unopened",
    resolutionReason: null,
    patientLocation:
      movement?.path[0] ??
      frontCenter ??
      null,
    patientMovement: movement,
    assignedRoomInstanceId: entrance?.room.id ?? null,
    queuedCareRoomInstanceId: null,
    nextIdleActionAtFacilityTick: getNextIdleActionTick(
      state,
      context,
      input.encounterId,
    ),
    currentNodeIndex: 0,
    firstOpenedAtTick: null,
    waiting: {
      arrivedAtTick: state.facilityTick,
      departureDueTick: patienceExempt
        ? null
        : state.facilityTick +
          context.balanceRelease.patientPatience.routineDurationTicks,
      patienceExempt,
      warningThresholdsShown: [],
    },
    answers: [],
    steps: frozenCase.decisionNodes.map((node, nodeIndex) => ({
      nodeIndex,
      decisionNodeId: node.id,
      questionVariantId: node.questionVariantId,
      primaryConceptId: node.primaryConceptId,
      status: nodeIndex === 0 ? "action_required" : "locked",
      answer: null,
      result: null,
    })),
    pendingResult: null,
    deliveredResultNarratives: [],
    terminalFeedback: null,
    settlementId: null,
  };
}

function recordReceipt(
  state: GameState,
  command: GameCommand,
  status: OperationReceipt["status"],
  message: string,
): GameState {
  state.operationReceipts[command.operationId] = {
    operationId: command.operationId,
    commandType: command.type,
    status,
    message,
    facilityTick: state.facilityTick,
  };
  if (command.type === "ADVANCE_TICK") {
    const tickReceiptIds = Object.keys(state.operationReceipts).filter(
      (receiptId) =>
        state.operationReceipts[receiptId]?.commandType ===
        "ADVANCE_TICK",
    );
    for (const receiptId of tickReceiptIds.slice(
      0,
      Math.max(
        0,
        tickReceiptIds.length -
          MAX_TRANSIENT_TICK_OPERATION_RECEIPTS,
      ),
    )) {
      delete state.operationReceipts[receiptId];
    }
  }
  const receiptIds = Object.keys(state.operationReceipts);
  if (receiptIds.length > MAX_TRANSIENT_OPERATION_RECEIPTS) {
    for (const receiptId of receiptIds.slice(
      0,
      receiptIds.length - MAX_TRANSIENT_OPERATION_RECEIPTS,
    )) {
      delete state.operationReceipts[receiptId];
    }
  }
  return state;
}

function rejectCommand(
  state: GameState,
  command: GameCommand,
  message: string,
): GameState {
  return recordReceipt(clonePlain(state), command, "rejected", message);
}

function appendEvent(state: GameState, event: DomainEvent): void {
  if (!state.events.some((existing) => existing.id === event.id)) {
    state.events.push(event);
    if (state.events.length > MAX_TRANSIENT_EVENTS) {
      state.events.splice(0, state.events.length - MAX_TRANSIENT_EVENTS);
    }
  }
}

function beginPatientFeedAttention(
  encounter: EncounterState,
  kind: NonNullable<EncounterState["feedAttentionKind"]>,
  facilityTick: number,
): void {
  encounter.feedAttentionKind = kind;
  encounter.feedAttentionStartedAtTick = facilityTick;
}

function clearPatientFeedAttention(
  encounter: EncounterState,
): void {
  encounter.feedAttentionKind = null;
  encounter.feedAttentionStartedAtTick = null;
}

function maybeEmitDelayedPatientAttention(
  state: GameState,
): void {
  const delay =
    PROTOTYPE_ALERT_SCHEDULING.patientAttentionDelayMinutes;
  for (const encounter of Object.values(state.encounters)) {
    const kind = encounter.feedAttentionKind;
    const startedAtTick = encounter.feedAttentionStartedAtTick;
    if (
      kind === null ||
      startedAtTick === null ||
      state.facilityTick - startedAtTick <= delay
    ) {
      continue;
    }

    const currentStep = encounter.steps[encounter.currentNodeIndex];
    const conditionStillActive =
      state.openChartEncounterId !== encounter.id &&
      (kind === "checked_in"
        ? encounter.lifecycle === "waiting_unopened" &&
          encounter.firstOpenedAtTick === null
        : encounter.lifecycle === "active_action_required" &&
          currentStep?.status === "action_required");
    if (!conditionStillActive) {
      clearPatientFeedAttention(encounter);
      continue;
    }

    const expectedDefinitionId =
      kind === "checked_in"
        ? "alert.patient.arrived"
        : kind === "result_ready"
          ? "alert.patient.result-ready"
          : "alert.patient.decision-required";
    if (
      state.events.some(
        (event) =>
          event.encounterId === encounter.id &&
          event.definitionId === expectedDefinitionId &&
          event.facilityTick >= startedAtTick,
      )
    ) {
      continue;
    }

    const eventId = `event.patient-attention.${encounter.id}.${kind}.${startedAtTick}`;
    if (kind === "checked_in") {
      appendEvent(state, {
        id: eventId,
        type: "patient_arrived",
        facilityTick: state.facilityTick,
        encounterId: encounter.id,
        message: `${encounter.patientDisplayName} checked in and is waiting.`,
        priority: "action_required",
        definitionId: "alert.patient.arrived",
        target: { kind: "encounter", id: encounter.id },
      });
      continue;
    }

    const pendingLabel =
      encounter.pendingResult?.pendingLabel ?? "New information";
    appendEvent(state, {
      id: eventId,
      type: kind === "result_ready" ? "result_ready" : "patient_arrived",
      facilityTick: state.facilityTick,
      encounterId: encounter.id,
      message:
        kind === "result_ready"
          ? `${encounter.patientDisplayName}: ${pendingLabel} is ready.`
          : `${encounter.patientDisplayName} is ready for a clinical decision.`,
      priority: "action_required",
      definitionId:
        expectedDefinitionId,
      target: { kind: "encounter", id: encounter.id },
    });
  }
}

function bothTutorialEncountersResolved(state: GameState): boolean {
  return [TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID].every(
    (encounterId) => {
      const encounter = state.encounters[encounterId];
      return encounter !== undefined && encounter.resolutionReason !== null;
    },
  );
}

function getAmbientDelay(
  state: GameState,
  kind: "first" | "recurring",
): number {
  const minimum =
    kind === "first"
      ? PROTOTYPE_ALERT_SCHEDULING.firstAmbientMinimumMinutes
      : Math.max(
          PROTOTYPE_ALERT_SCHEDULING.recurringAmbientMinimumMinutes,
          PROTOTYPE_ALERT_SCHEDULING.minimumAmbientSeparationMinutes,
        );
  const maximum =
    kind === "first"
      ? PROTOTYPE_ALERT_SCHEDULING.firstAmbientMaximumMinutes
      : PROTOTYPE_ALERT_SCHEDULING.recurringAmbientMaximumMinutes;
  const spread = maximum - minimum + 1;
  return (
    minimum +
    deterministicInteger(
      state.campaignSeed,
      RANDOM_STREAMS.flavorEvents,
      `ambient.${kind}.delay.${state.alertHumor.ambientSequence}`,
      spread,
    )
  );
}

function hasCheckedInPatient(state: GameState): boolean {
  return Object.values(state.encounters).some((encounter) => {
    if (
      encounter.resolutionReason !== null ||
      encounter.patientLocation === null
    ) {
      return false;
    }
    const movementKind = encounter.patientMovement?.kind;
    return (
      movementKind !== "arriving_for_check_in" &&
      movementKind !== "returning_from_offsite_testing" &&
      movementKind !== "departing_for_offsite_testing"
    );
  });
}

function getEligibleAmbientDefinitions(
  state: GameState,
): PrototypeAlertDefinition[] {
  const roomDefinitionIds = new Set(
    state.rooms.map((room) => room.roomDefinitionId),
  );
  return PROTOTYPE_AMBIENT_ALERT_DEFINITIONS.filter((definition) =>
    isPrototypeAlertEligible(definition, {
      facilityLevel: state.facilityLevel,
      roomDefinitionIds,
      objectIds: new Set(["water_cooler"] as const),
      hasCheckedInPatient: hasCheckedInPatient(state),
    }),
  );
}

function pickWeighted<T extends { selectionWeight: number }>(
  values: readonly T[],
  state: GameState,
  purposeId: string,
): T {
  if (values.length === 0) {
    throw new Error("A deterministic weighted selection needs a candidate.");
  }
  const totalWeight = values.reduce(
    (total, value) => total + Math.max(1, value.selectionWeight),
    0,
  );
  let draw = deterministicInteger(
    state.campaignSeed,
    RANDOM_STREAMS.flavorEvents,
    purposeId,
    totalWeight,
  );
  for (const value of values) {
    draw -= Math.max(1, value.selectionWeight);
    if (draw < 0) {
      return value;
    }
  }
  return values.at(-1)!;
}

function appendBoundedHistory(
  history: string[],
  value: string,
  maximumLength: number,
): string[] {
  const withoutDuplicate = history.filter((candidate) => candidate !== value);
  withoutDuplicate.push(value);
  return withoutDuplicate.slice(-maximumLength);
}

function maybeEmitAmbientMessage(state: GameState): void {
  const humor = state.alertHumor;
  if (
    humor.alertsTutorialAcknowledgedAtTick === null ||
    humor.nextAmbientAlertTick === null ||
    state.facilityTick < humor.nextAmbientAlertTick ||
    !bothTutorialEncountersResolved(state)
  ) {
    return;
  }

  const eligible = getEligibleAmbientDefinitions(state);
  if (eligible.length === 0) {
    humor.nextAmbientAlertTick =
      state.facilityTick +
      PROTOTYPE_ALERT_SCHEDULING.minimumAmbientSeparationMinutes;
    return;
  }

  let cycleCandidates = eligible.filter(
    (definition) =>
      !humor.ambientUsedDefinitionIds.includes(definition.id),
  );
  if (cycleCandidates.length === 0) {
    humor.ambientCycle += 1;
    humor.ambientUsedDefinitionIds = [];
    cycleCandidates = eligible;
  }
  const nonRecentCandidates = cycleCandidates.filter(
    (definition) =>
      !humor.recentAmbientDefinitionIds.includes(definition.id),
  );
  const definition = pickWeighted(
    nonRecentCandidates.length > 0
      ? nonRecentCandidates
      : cycleCandidates,
    state,
    `ambient.definition.${humor.ambientCycle}.${humor.ambientSequence}`,
  );
  const variant = pickWeighted(
    definition.variants,
    state,
    `ambient.variant.${definition.id}.${humor.ambientSequence}`,
  );
  const rendered = renderPrototypeAlert(definition, {}, variant.id);
  appendEvent(state, {
    id: `event.ambient.${humor.ambientSequence}.${state.facilityTick}`,
    type: "ambient_message",
    facilityTick: state.facilityTick,
    encounterId: null,
    message: rendered.body,
    priority: "flavor",
    definitionId: rendered.definitionId,
    alertCategory: definition.category,
    alertVariantId: rendered.variantId,
    target: {
      kind: "campaign",
      id: state.campaignId,
    },
  });
  humor.ambientUsedDefinitionIds.push(definition.id);
  humor.recentAmbientDefinitionIds = appendBoundedHistory(
    humor.recentAmbientDefinitionIds,
    definition.id,
    PROTOTYPE_ALERT_SCHEDULING.recentAmbientHistoryLimit,
  );
  humor.ambientSequence += 1;
  humor.nextAmbientAlertTick =
    state.facilityTick + getAmbientDelay(state, "recurring");
}

function reduceAcknowledgeAlertsTutorial(
  state: GameState,
  command: Extract<
    GameCommand,
    { type: "ACKNOWLEDGE_ALERTS_TUTORIAL" }
  >,
): GameState {
  const secondTutorial =
    state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID];
  if (secondTutorial?.resolutionReason === null || !secondTutorial) {
    return rejectCommand(
      state,
      command,
      "The Alerts tutorial unlocks after the second tutorial encounter.",
    );
  }
  const next = clonePlain(state);
  if (next.alertHumor.alertsTutorialAcknowledgedAtTick === null) {
    next.alertHumor.alertsTutorialAcknowledgedAtTick =
      next.facilityTick;
    next.alertHumor.nextAmbientAlertTick =
      next.facilityTick + getAmbientDelay(next, "first");
  }
  return recordReceipt(
    next,
    command,
    "applied",
    "Alerts tutorial acknowledged.",
  );
}

function getCurrentNode(encounter: EncounterState): DecisionNode | null {
  return encounter.frozenCase.decisionNodes[encounter.currentNodeIndex] ?? null;
}

function scheduleResult(
  state: GameState,
  context: DomainContext,
  encounter: EncounterState,
  node: DecisionNode,
  gate: ResultGate,
): PendingResult | null {
  const selected = getEligibleServiceRoute(
    state,
    gate.resultTypeId,
    gate.allowedServiceRouteIds,
    context,
  );
  if (!selected) {
    return null;
  }
  return {
    operationId: `result.${encounter.id}.${node.id}.${gate.id}`,
    gateId: gate.id,
    originatingNodeIndex: encounter.currentNodeIndex,
    resultTypeId: gate.resultTypeId,
    pendingLabel: gate.pendingLabel,
    resultNarrative: gate.resultNarrative,
    routeId: selected.route.id,
    routeDisplayName: selected.route.displayName,
    scheduledAtTick: state.facilityTick,
    serviceDurationTicks: selected.timing.serviceDurationTicks,
    durationTicks: selected.timing.durationTicks,
    dueTick: state.facilityTick + selected.timing.durationTicks,
    deliveredAtTick: null,
    offsiteReturnStartedAtTick: null,
    offsiteTravel: null,
    patientTravel: clonePlain(selected.timing.patientTravel),
  };
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function applyPatientSatisfactionDelta(
  encounter: EncounterState,
  delta: number,
  cause: PatientDissatisfactionCause,
  facilityTick: number,
): number {
  const before = encounter.patientSatisfaction;
  encounter.patientSatisfaction = clamp(before + delta, 0, 100);
  const appliedDelta = encounter.patientSatisfaction - before;
  if (appliedDelta < 0) {
    const previous = encounter.dissatisfactionByCause[cause];
    encounter.dissatisfactionByCause[cause] = {
      pointsLost: (previous?.pointsLost ?? 0) - appliedDelta,
      lastAppliedAtFacilityTick: facilityTick,
    };
  }
  return appliedDelta;
}

function applyFacilityExperienceAtCheckIn(
  state: GameState,
  encounter: EncounterState,
  context: DomainContext,
): void {
  if (encounter.facilityExperienceAtCheckIn !== null) {
    return;
  }
  if (encounter.arrivalClass === "tutorial") {
    encounter.facilityExperienceAtCheckIn = {
      appliedAtFacilityTick: state.facilityTick,
      totalPenalty: 0,
      conditions: [],
    };
    return;
  }
  const evaluation = evaluateFacilityExperienceConditions(
    state,
    context,
  );
  let remainingPenalty = evaluation.totalPenalty;
  const conditions = evaluation.conditions.flatMap((condition) => {
    const appliedPenalty = Math.min(
      condition.penalty,
      remainingPenalty,
    );
    remainingPenalty -= appliedPenalty;
    if (appliedPenalty <= 0) {
      return [];
    }
    applyPatientSatisfactionDelta(
      encounter,
      -appliedPenalty,
      condition.cause,
      state.facilityTick,
    );
    return [
      {
        conditionKey: condition.conditionKey,
        penalty: appliedPenalty,
        cause: condition.cause,
      },
    ];
  });
  encounter.facilityExperienceAtCheckIn = {
    appliedAtFacilityTick: state.facilityTick,
    totalPenalty: evaluation.totalPenalty - remainingPenalty,
    conditions,
  };
}

function adjustCash(state: GameState, deltaDollars: number): void {
  const deltaCents = Math.round(deltaDollars * 100);
  state.cashCents = Math.max(0, state.cashCents + deltaCents);
  state.cash = state.cashCents / 100;
}

function getDecisionXpAward(
  encounter: EncounterState,
  correct: boolean,
  context: DomainContext,
): number {
  if (correct && encounter.id === TUTORIAL_ENCOUNTER_ID) {
    return context.balanceRelease.clinicalSettlement
      .firstTutorialCorrectDecisionXp;
  }
  return correct
    ? context.balanceRelease.clinicalSettlement
        .clinicalXpPerCorrectFirstAnswer
    : context.balanceRelease.clinicalSettlement
        .clinicalXpPerIncorrectFirstAnswer;
}

function getEndedEncounterSatisfaction(
  state: GameState,
  context: DomainContext,
  excludedEncounterId: string | null = null,
): number | null {
  const ended = Object.values(state.encounters)
    .filter(
      (encounter) =>
        encounter.id !== excludedEncounterId &&
        encounter.finalPatientSatisfaction !== null &&
        encounter.resolvedAtFacilityTick !== null &&
        (encounter.resolutionReason === "completed" ||
          encounter.resolutionReason === "walkout"),
    )
    .sort(
      (left, right) =>
        (right.resolvedAtFacilityTick ?? 0) -
          (left.resolvedAtFacilityTick ?? 0) ||
        right.id.localeCompare(left.id),
    )
    .slice(
      0,
      context.balanceRelease.patientSatisfaction.rollingWindowSize,
    );
  if (ended.length === 0) {
    return null;
  }
  return Math.round(
    ended.reduce(
      (total, candidate) =>
        total + (candidate.finalPatientSatisfaction ?? 0),
      0,
    ) / ended.length,
  );
}

function appendSuccessMessage(
  state: GameState,
  definitionId: string,
  eventId: string,
  encounter: EncounterState,
): void {
  const rendered = renderPrototypeAlert(definitionId, {
    patient_name: encounter.patientDisplayName,
  });
  appendEvent(state, {
    id: eventId,
    type: "success_message",
    facilityTick: state.facilityTick,
    encounterId: encounter.id,
    message: rendered.body,
    priority: "informational",
    definitionId: rendered.definitionId,
    alertCategory: "success",
    alertVariantId: rendered.variantId,
    target: {
      kind: "encounter",
      id: encounter.id,
    },
  });
}

function settleEncounter(
  state: GameState,
  context: DomainContext,
  encounter: EncounterState,
): void {
  if (encounter.settlementId !== null) {
    return;
  }
  const balance = context.balanceRelease.clinicalSettlement;
  const totalAnswers = encounter.answers.length;
  const correctAnswers = encounter.answers.filter((answer) => answer.correct).length;
  const incorrectAnswers = totalAnswers - correctAnswers;
  const completionRevenue =
    state.facilityLevel === 0
      ? balance.levelZeroBasePayment +
        balance.levelZeroPerQuestionPayment * totalAnswers +
        balance.levelZeroPerCorrectPayment * correctAnswers
      : balance.levelOneBasePayment +
        balance.levelOnePerQuestionPayment * totalAnswers +
        balance.levelOnePerCorrectPayment * correctAnswers;
  const satisfactionDelta = encounter.patientSatisfaction - 100;
  const clinicalXpAwarded = encounter.answers.reduce(
    (total, answer) =>
      total + getDecisionXpAward(encounter, answer.correct, context),
    0,
  );
  const netCashDelta = completionRevenue;
  const settlementId = `settlement.${encounter.id}.completion`;
  const settlement: EncounterSettlement = {
    id: settlementId,
    encounterId: encounter.id,
    completionRevenue,
    qualityRevenueBonus: 0,
    incorrectFinancialConsequence: 0,
    netCashDelta,
    satisfactionDelta,
    clinicalXpAwarded,
    correctAnswers,
    incorrectAnswers,
    terminalOutcomeSeverity: encounter.terminalFeedback?.outcome?.severity ?? null,
    settledAtFacilityTick: state.facilityTick,
  };

  encounter.settlementId = settlementId;
  state.settlements.push(settlement);
  adjustCash(state, netCashDelta);
  appendEvent(state, {
    id: `event.${settlementId}`,
    type: "encounter_settled",
    facilityTick: state.facilityTick,
    encounterId: encounter.id,
    message: `Encounter complete: +$${netCashDelta}.`,
    priority: "informational",
    definitionId: "alert.patient.complete",
    target: {
      kind: "encounter",
      id: encounter.id,
    },
    reward: {
      cashDelta: netCashDelta,
      learningXpDelta: 0,
      satisfactionDelta,
    },
  });
  if (encounter.arrivalClass !== "tutorial") {
    const firstOrdinaryDefinitionId =
      "alert.success.first-ordinary-patient-resolved";
    const priorOrdinaryCompleted = Object.values(
      state.encounters,
    ).some(
      (candidate) =>
        candidate.id !== encounter.id &&
        candidate.arrivalClass !== "tutorial" &&
        candidate.resolutionReason === "completed",
    );
    if (!priorOrdinaryCompleted) {
      appendSuccessMessage(
        state,
        firstOrdinaryDefinitionId,
        `event.success.first-ordinary.${encounter.id}`,
        encounter,
      );
    }

    const previousSatisfaction = getEndedEncounterSatisfaction(
      state,
      context,
      encounter.id,
    );
    const currentSatisfaction = getEndedEncounterSatisfaction(
      state,
      context,
    );
    if (
      currentSatisfaction !== null &&
      currentSatisfaction > 90 &&
      previousSatisfaction !== null &&
      previousSatisfaction <= 90
    ) {
      appendSuccessMessage(
        state,
        "alert.success.satisfaction-above-90",
        `event.success.satisfaction-above-90.${encounter.id}`,
        encounter,
      );
    }
  }
}

function applyCompletionExperience(
  state: GameState,
  context: DomainContext,
  encounter: EncounterState,
): void {
  const config = context.balanceRelease.patientSatisfaction;
  const clinicalRooms = state.rooms.filter(
    (room) =>
      getRoomDefinition(room.roomDefinitionId, context)?.kind !==
      "hallway",
  );
  const averageCleanliness =
    clinicalRooms.length === 0
      ? 100
      : clinicalRooms.reduce(
          (total, room) => total + (room.cleanliness ?? 100),
          0,
        ) / clinicalRooms.length;
  const cleanlinessModifier =
    averageCleanliness >= config.cleanRoomThreshold
      ? config.cleanRoomCompletionBonus
      : averageCleanliness <= config.dirtyRoomThreshold
        ? -config.dirtyRoomCompletionPenalty
        : 0;
  const upgradeModifier = Math.min(
    config.maximumRoomUpgradeBonus,
    clinicalRooms.reduce(
      (total, room) =>
        total +
        Math.max(0, room.upgradeLevel - 1) *
          config.roomUpgradeBonusPerLevel,
      0,
    ),
  );
  const amenityModifier = Math.min(
    config.maximumAmenityCompletionBonus,
    [...new Set(clinicalRooms.map((room) => room.roomDefinitionId))]
      .map(
        (definitionId) =>
          getRoomDefinition(definitionId, context)
            ?.satisfactionOnBuild ?? 0,
      )
      .reduce((total, value) => total + value, 0),
  );
  const averageMorale =
    state.employees.length === 0
      ? null
      : state.employees.reduce(
          (total, employee) => total + employee.morale,
          0,
        ) / state.employees.length;
  const staffModifier =
    averageMorale === null
      ? 0
      : averageMorale >= config.happyStaffMoraleThreshold
        ? config.happyStaffCompletionBonus
        : averageMorale <= config.unhappyStaffMoraleThreshold
          ? -config.unhappyStaffCompletionPenalty
          : 0;
  applyPatientSatisfactionDelta(
    encounter,
    cleanlinessModifier,
    "poor_cleanliness",
    state.facilityTick,
  );
  applyPatientSatisfactionDelta(
    encounter,
    upgradeModifier,
    "general",
    state.facilityTick,
  );
  applyPatientSatisfactionDelta(
    encounter,
    amenityModifier,
    "missing_amenities",
    state.facilityTick,
  );
  applyPatientSatisfactionDelta(
    encounter,
    staffModifier,
    "general",
    state.facilityTick,
  );
  for (const room of clinicalRooms) {
    room.cleanliness = clamp(
      (room.cleanliness ?? 100) -
        config.roomCleanlinessLossPerEncounter,
      0,
      100,
    );
  }
}

function resolveTerminalFeedback(
  node: DecisionNode,
  answerChoiceId: string,
  correct: boolean,
): TerminalFeedback {
  if (correct) {
    return {
      kind: "completion",
      outcome: null,
      consequence: null,
      correction: null,
      // Only incorrect final decisions need the explicit corrective/outcome
      // acknowledgement. A correct completion may be flipped or resolved
      // immediately.
      acknowledged: true,
    };
  }
  const disposition = node.terminalDispositions.find(
    (candidate) => candidate.answerChoiceId === answerChoiceId,
  );
  if (!disposition) {
    throw new Error("Validated content is missing a final wrong-answer disposition.");
  }
  if (disposition.kind === "no_terminal_outcome") {
    return {
      kind: "correction",
      outcome: null,
      consequence: disposition.consequenceNarrative,
      correction: node.explanation,
      acknowledged: false,
    };
  }
  return {
    kind: "terminal_outcome",
    outcome: clonePlain(disposition.outcome),
    consequence: disposition.outcome.narrative,
    correction: node.explanation,
    acknowledged: false,
  };
}

function reduceOpenChart(
  state: GameState,
  command: Extract<GameCommand, { type: "OPEN_CHART" }>,
  context: DomainContext,
): GameState {
  const encounter = state.encounters[command.encounterId];
  if (!encounter) {
    return rejectCommand(state, command, "This chart does not exist.");
  }
  if (
    state.openChartEncounterId !== null &&
    state.openChartEncounterId !== command.encounterId
  ) {
    return rejectCommand(
      state,
      command,
      "Close the currently open chart before opening another patient.",
    );
  }
  if (
    encounter.patientMovement?.kind === "arriving_for_check_in" ||
    encounter.patientMovement?.kind === "leaving_after_walkout" ||
    encounter.patientMovement?.kind === "leaving_after_resolution"
  ) {
    return rejectCommand(
      state,
      command,
      encounter.patientMovement.kind === "arriving_for_check_in"
        ? "The patient is still walking to check-in."
        : "The patient is already leaving the clinic.",
    );
  }
  const next = clonePlain(state);
  const nextEncounter = next.encounters[command.encounterId]!;

  next.openChartEncounterId = nextEncounter.id;
  clearPatientFeedAttention(nextEncounter);
  const isFirstOpening =
    nextEncounter.lifecycle === "waiting_unopened";
  const isReturnedResultOpening =
    nextEncounter.lifecycle === "active_action_required" &&
    nextEncounter.pendingResult?.offsiteTravel !== null &&
    nextEncounter.pendingResult?.offsiteTravel !== undefined &&
    nextEncounter.pendingResult.deliveredAtTick !== null &&
    nextEncounter.currentNodeIndex >
      nextEncounter.pendingResult.originatingNodeIndex;
  if (
    isFirstOpening ||
    (isReturnedResultOpening &&
      !encounterHasExaminationRoomReservation(next, nextEncounter))
  ) {
    const currentMovement = nextEncounter.patientMovement;
    const start =
      currentMovement?.path.at(-1) ??
      nextEncounter.patientLocation ??
      getPublicEntrance(next, context)?.outside ??
      null;
    const destination =
      start === null
        ? null
        : chooseCareRoom(next, context, start, nextEncounter.id);
    if (destination) {
      if (
        currentMovement?.kind === "walking_to_waiting" ||
        currentMovement?.kind === "idle_within_room"
      ) {
        nextEncounter.queuedCareRoomInstanceId =
          destination.roomId;
      } else {
        startPatientMovement(
          next,
          context,
          nextEncounter,
          "walking_to_care",
          destination.path,
          destination.roomId,
        );
      }
    }
    if (isFirstOpening) {
      nextEncounter.lifecycle = "active_action_required";
      nextEncounter.firstOpenedAtTick ??= next.facilityTick;
    }
  }
  nextEncounter.idleWaitingSinceTick =
    nextEncounter.patientMovement !== null
      ? null
      : nextEncounter.idleWaitingSinceTick;
  nextEncounter.lastSatisfactionDecayAtTick = next.facilityTick;
  if (nextEncounter.lifecycle === "active_action_required") {
    next.attendedEncounterId = nextEncounter.id;
  } else {
    next.attendedEncounterId = null;
  }
  return recordReceipt(next, command, "applied", "Chart opened.");
}

function reduceCloseChart(
  state: GameState,
  command: Extract<GameCommand, { type: "CLOSE_CHART" }>,
  context: DomainContext,
): GameState {
  const encounter = state.encounters[command.encounterId];
  if (
    !encounter ||
    (encounter.lifecycle === "waiting_unopened" &&
      state.openChartEncounterId !== encounter.id)
  ) {
    return rejectCommand(state, command, "This chart is not open.");
  }
  const next = clonePlain(state);
  const nextEncounter = next.encounters[command.encounterId]!;
  if (next.openChartEncounterId === command.encounterId) {
    next.openChartEncounterId = null;
  }
  if (next.attendedEncounterId === command.encounterId) {
    next.attendedEncounterId = null;
  }
  if (
    nextEncounter.lifecycle === "resolved_summary_available" &&
    nextEncounter.terminalFeedback?.acknowledged
  ) {
    nextEncounter.lifecycle = "resolved";
    nextEncounter.idleWaitingSinceTick = null;
    if (nextEncounter.patientMovement === null) {
      const exitPath = nextEncounter.patientLocation
        ? pathFromLocationToOffscreen(
            next,
            context,
            nextEncounter.patientLocation,
            nextEncounter.id,
          )
        : [];
      startPatientMovement(
        next,
        context,
        nextEncounter,
        "leaving_after_resolution",
        exitPath,
        null,
      );
    }
  } else if (nextEncounter.lifecycle === "active_action_required") {
    nextEncounter.idleWaitingSinceTick = next.facilityTick;
    nextEncounter.lastSatisfactionDecayAtTick = next.facilityTick;
    beginPatientFeedAttention(
      nextEncounter,
      nextEncounter.pendingResult?.deliveredAtTick !== null &&
        nextEncounter.pendingResult?.deliveredAtTick !== undefined &&
        nextEncounter.currentNodeIndex >
          nextEncounter.pendingResult.originatingNodeIndex
        ? "result_ready"
        : "clinical_decision",
      next.facilityTick,
    );
  }
  return recordReceipt(
    next,
    command,
    "applied",
    nextEncounter.lifecycle === "resolved"
      ? "Chart filed in Resolved."
      : "Chart closed; the patient remains Active.",
  );
}

function reduceSubmitAnswer(
  state: GameState,
  command: Extract<GameCommand, { type: "SUBMIT_ANSWER" }>,
  context: DomainContext,
): GameState {
  const encounter = state.encounters[command.encounterId];
  if (
    !encounter ||
    encounter.lifecycle !== "active_action_required" ||
    (encounter.patientMovement !== null &&
      encounter.patientMovement.kind !== "walking_to_care" &&
      encounter.patientMovement.kind !== "walking_to_waiting" &&
      encounter.patientMovement.kind !== "idle_within_room")
  ) {
    return rejectCommand(state, command, "No answer-ready question exists.");
  }
  const node = getCurrentNode(encounter);
  if (!node || node.id !== command.decisionNodeId) {
    return rejectCommand(state, command, "The question is stale or does not match.");
  }
  const choice = node.answerChoices.find(
    (candidate) => candidate.id === command.answerChoiceId,
  );
  if (!choice) {
    return rejectCommand(state, command, "The selected answer does not exist.");
  }
  const reviewedAtMs =
    command.reviewedAtMs ??
    state.createdAtRealMs +
      state.facilityTick * 60_000 +
      state.reviewIntents.length;
  if (!Number.isSafeInteger(reviewedAtMs) || reviewedAtMs < 0) {
    return rejectCommand(
      state,
      command,
      "The learning review needs a valid real-world timestamp.",
    );
  }
  const currentHistory =
    state.learningHistories[node.primaryConceptId] ?? {
      conceptId: node.primaryConceptId,
      card: createNewFsrsCard(state.createdAtRealMs),
      reviews: [],
    };
  if (
    currentHistory.card.lastReviewAtMs !== null &&
    reviewedAtMs < currentHistory.card.lastReviewAtMs
  ) {
    return rejectCommand(
      state,
      command,
      "The learning review timestamp is older than the previous review.",
    );
  }

  const isFinalNode =
    encounter.currentNodeIndex === encounter.frozenCase.decisionNodes.length - 1;
  let scheduledResult: PendingResult | null = null;
  if (!isFinalNode && node.resultGateAfter) {
    scheduledResult = scheduleResult(
      state,
      context,
      encounter,
      node,
      node.resultGateAfter,
    );
    if (!scheduledResult) {
      return rejectCommand(
        state,
        command,
        "No permitted result route is currently available.",
      );
    }
  }

  const next = clonePlain(state);
  const nextEncounter = next.encounters[command.encounterId]!;
  clearPatientFeedAttention(nextEncounter);
  const rating = choice.isCorrect ? "Good" : "Again";
  const scheduledReview = applyFsrsReview(
    currentHistory.card,
    rating,
    reviewedAtMs,
    context.balanceRelease.learning,
  );
  const nextHistory = clonePlain(currentHistory);
  nextHistory.card = scheduledReview.card;
  nextHistory.reviews.push({
    id: `review.${nextEncounter.id}.${node.id}`,
    encounterId: nextEncounter.id,
    decisionNodeId: node.id,
    questionVariantId: node.questionVariantId,
    patientPresentationVariantId:
      nextEncounter.frozenCase.patientPresentationVariantId,
    primaryConceptId: node.primaryConceptId,
    answerChoiceId: choice.id,
    correct: choice.isCorrect,
    rating,
    reviewedAtMs,
    facilityTick: next.facilityTick,
    schedulerLog: scheduledReview.log,
  });
  next.learningHistories[node.primaryConceptId] = nextHistory;
  const answerRecord: AnswerRecord = {
    decisionNodeId: node.id,
    primaryConceptId: node.primaryConceptId,
    answerChoiceId: choice.id,
    correct: choice.isCorrect,
    ratingIntent: rating,
    answeredAtFacilityTick: next.facilityTick,
    explanation: node.explanation,
    correctedForward: !choice.isCorrect && !isFinalNode,
  };
  nextEncounter.answers.push(answerRecord);
  const satisfactionConfig = context.balanceRelease.patientSatisfaction;
  const careSatisfactionDelta = choice.isCorrect
    ? satisfactionConfig.correctCareRecovery
    : -satisfactionConfig.incorrectCarePenalty;
  const satisfactionBeforeDecision = nextEncounter.patientSatisfaction;
  applyPatientSatisfactionDelta(
    nextEncounter,
    careSatisfactionDelta,
    "general",
    next.facilityTick,
  );
  const learningXpAwarded = getDecisionXpAward(
    nextEncounter,
    choice.isCorrect,
    context,
  );
  next.clinicalXp += learningXpAwarded;
  const currentStep = nextEncounter.steps[nextEncounter.currentNodeIndex];
  if (!currentStep || currentStep.decisionNodeId !== node.id) {
    throw new Error("Encounter step history does not match the current node.");
  }
  currentStep.answer = clonePlain(answerRecord);
  next.reviewIntents.push({
    id: `review-intent.${nextEncounter.id}.${node.id}`,
    encounterId: nextEncounter.id,
    decisionNodeId: node.id,
    primaryConceptId: node.primaryConceptId,
    rating,
    facilityTick: next.facilityTick,
    reviewedAtMs,
  });
  appendEvent(next, {
    id: `event.clinical-decision.${nextEncounter.id}.${node.id}`,
    type: "clinical_decision_recorded",
    facilityTick: next.facilityTick,
    encounterId: nextEncounter.id,
    message: choice.isCorrect
      ? `${nextEncounter.patientDisplayName}: correct decision recorded. +${learningXpAwarded} Learning XP.`
      : `${nextEncounter.patientDisplayName}: corrective teaching provided.`,
    priority: "informational",
    definitionId: choice.isCorrect
      ? "event.clinical.decision-correct"
      : "event.clinical.decision-corrective",
    target: {
      kind: "encounter",
      id: nextEncounter.id,
    },
    reward: {
      cashDelta: 0,
      learningXpDelta: learningXpAwarded,
      satisfactionDelta:
        nextEncounter.patientSatisfaction - satisfactionBeforeDecision,
    },
  });

  if (isFinalNode) {
    currentStep.status = "completed";
    nextEncounter.terminalFeedback = resolveTerminalFeedback(
      node,
      choice.id,
      choice.isCorrect,
    );
    nextEncounter.lifecycle = "resolved_summary_available";
    nextEncounter.resolutionReason = "completed";
    applyCompletionExperience(next, context, nextEncounter);
    nextEncounter.finalPatientSatisfaction =
      nextEncounter.patientSatisfaction;
    nextEncounter.resolvedAtFacilityTick = next.facilityTick;
    nextEncounter.idleWaitingSinceTick = null;
    // The panel remains open for terminal feedback and the optional summary,
    // but completed charts no longer receive Active-patient attendance rules.
    next.openChartEncounterId = nextEncounter.id;
    if (next.attendedEncounterId === nextEncounter.id) {
      next.attendedEncounterId = null;
    }
    if (nextEncounter.protectedGuaranteeId) {
      next.criticalGuarantees[nextEncounter.protectedGuaranteeId] = "satisfied";
    }
    settleEncounter(next, context, nextEncounter);
  } else if (scheduledResult) {
    currentStep.status = "feedback_pending";
    currentStep.result = clonePlain(scheduledResult);
    nextEncounter.pendingResult = scheduledResult;
    nextEncounter.lifecycle = "active_action_required";
    nextEncounter.idleWaitingSinceTick = null;
    nextEncounter.lastSatisfactionDecayAtTick = next.facilityTick;
  } else {
    currentStep.status = "feedback_pending";
    nextEncounter.lifecycle = "active_action_required";
    nextEncounter.idleWaitingSinceTick = null;
    nextEncounter.lastSatisfactionDecayAtTick = next.facilityTick;
  }

  return recordReceipt(
    next,
    command,
    "applied",
    choice.isCorrect
      ? "Answer recorded as Good."
      : "Answer recorded as Again; review the correction before care continues.",
  );
}

function configurePendingResultTiming(
  state: GameState,
  context: DomainContext,
  encounter: EncounterState,
  pending: PendingResult,
  originReadyTick: number,
  origin: GridPoint,
): boolean {
  pending.scheduledAtTick = originReadyTick;
  pending.durationTicks = pending.serviceDurationTicks;
  pending.dueTick = originReadyTick + pending.serviceDurationTicks;
  if (pending.patientTravel) {
    const frozenOrigin = state.rooms.find(
      (room) =>
        room.id === pending.patientTravel?.originRoomInstanceId,
    );
    const expectedOriginDefinitionId =
      frozenOrigin?.roomDefinitionId ?? null;
    const originRoomCandidates = [
      encounter.queuedCareRoomInstanceId,
      encounter.patientMovement?.destinationRoomInstanceId ?? null,
      encounter.assignedRoomInstanceId,
    ].filter((roomId): roomId is string => roomId !== null);
    const actualOriginRoom =
      originRoomCandidates
        .map((roomId) =>
          state.rooms.find((room) => room.id === roomId),
        )
        .find(
          (room) =>
            room !== undefined &&
            (expectedOriginDefinitionId === null ||
              room.roomDefinitionId === expectedOriginDefinitionId),
        ) ??
      state.rooms.find((room) => {
        if (
          expectedOriginDefinitionId !== null &&
          room.roomDefinitionId !== expectedOriginDefinitionId
        ) {
          return false;
        }
        const definition = getRoomDefinition(
          room.roomDefinitionId,
          context,
        );
        return (
          definition !== null &&
          getRoomNavigableTiles(room, definition, state.doors).some(
            (point) => point.x === origin.x && point.y === origin.y,
          )
        );
      });
    if (!actualOriginRoom) {
      return false;
    }
    const outboundPath = pathFromLocationToRoom(
      state,
      context,
      origin,
      pending.patientTravel.destinationRoomInstanceId,
    );
    const destination = outboundPath.at(-1);
    const returnPath = destination
      ? facilityPath(state, context, destination, origin)
      : [];
    if (outboundPath.length === 0 || returnPath.length === 0) {
      return false;
    }
    const speed =
      context.balanceRelease.facility.characterTravelTilesPerTick;
    const outboundTicks = Math.ceil(
      Math.max(0, outboundPath.length - 1) /
        speed,
    );
    const returnTicks = Math.ceil(
      Math.max(0, returnPath.length - 1) /
        speed,
    );
    const minimumDurationTicks = outboundTicks + returnTicks;
    if (pending.durationTicks < minimumDurationTicks) {
      pending.durationTicks = minimumDurationTicks;
      pending.dueTick = originReadyTick + minimumDurationTicks;
    }
    pending.patientTravel.originRoomInstanceId = actualOriginRoom.id;
    pending.patientTravel.outboundPath = outboundPath.map((point) => ({
      ...point,
    }));
    pending.patientTravel.returnPath = returnPath.map((point) => ({
      ...point,
    }));
    pending.patientTravel.tilesPerTick = speed;
    pending.patientTravel.outboundStartTick = originReadyTick;
    pending.patientTravel.outboundArrivalTick =
      originReadyTick + outboundTicks;
    pending.patientTravel.returnArrivalTick = pending.dueTick;
    pending.patientTravel.serviceCompletionTick =
      pending.dueTick - returnTicks;
    pending.offsiteTravel = null;
    return (
      pending.patientTravel.serviceCompletionTick >=
      pending.patientTravel.outboundArrivalTick
    );
  }

  const entrance = getPublicEntrance(state, context);
  if (!entrance) {
    return false;
  }
  const outboundPath = pathFromLocationToOffscreen(
    state,
    context,
    origin,
    encounter.id,
  );
  const offscreenEndpoint = outboundPath.at(-1) ?? null;
  const returnPath = offscreenEndpoint
    ? pathFromOutsideToRoom(
        state,
        context,
        offscreenEndpoint,
        entrance.room.id,
      )
    : [];
  if (
    offscreenEndpoint === null ||
    outboundPath.length === 0 ||
    returnPath.length === 0
  ) {
    return false;
  }
  const speed =
    context.balanceRelease.facility.characterTravelTilesPerTick;
  const outboundTicks = movementDuration(outboundPath, context);
  const returnTicks = movementDuration(returnPath, context);
  const minimumDurationTicks = outboundTicks + returnTicks;
  if (pending.durationTicks < minimumDurationTicks) {
    pending.durationTicks = minimumDurationTicks;
    pending.dueTick = originReadyTick + minimumDurationTicks;
  }
  const outboundArrivalTick = originReadyTick + outboundTicks;
  const returnStartTick = pending.dueTick - returnTicks;
  if (returnStartTick < outboundArrivalTick) {
    return false;
  }
  pending.offsiteTravel = {
    version: "offsite-patient-travel.v1",
    direction:
      offscreenEndpoint.x < entrance.outside.x ? -1 : 1,
    outboundPath: outboundPath.map((point) => ({ ...point })),
    returnPath: returnPath.map((point) => ({ ...point })),
    tilesPerTick: speed,
    outboundStartTick: originReadyTick,
    outboundArrivalTick,
    returnStartTick,
    returnArrivalTick: pending.dueTick,
  };
  return true;
}

function getPendingResultOriginPlan(
  state: GameState,
  context: DomainContext,
  encounter: EncounterState,
): { origin: GridPoint; readyTick: number } | null {
  let origin =
    encounter.patientMovement?.path.at(-1) ??
    encounter.patientLocation;
  if (!origin) {
    return null;
  }
  let readyTick =
    state.facilityTick +
    remainingMovementDuration(encounter.patientMovement, context);
  if (encounter.queuedCareRoomInstanceId) {
    const carePath = pathFromLocationToRoom(
      state,
      context,
      origin,
      encounter.queuedCareRoomInstanceId,
    );
    if (carePath.length === 0) {
      return null;
    }
    readyTick += movementDuration(carePath, context);
    origin = carePath.at(-1)!;
  }
  return { origin: { ...origin }, readyTick };
}

function beginPendingResultTravel(
  state: GameState,
  encounter: EncounterState,
  context: DomainContext,
): void {
  const pending = encounter.pendingResult;
  if (!pending || pending.deliveredAtTick !== null) {
    return;
  }
  if (
    pending.patientTravel === null &&
    pending.offsiteTravel &&
    encounter.patientMovement === null &&
    state.facilityTick >= pending.offsiteTravel.outboundStartTick &&
    state.facilityTick < pending.offsiteTravel.outboundArrivalTick
  ) {
    startPatientMovement(
      state,
      context,
      encounter,
      "departing_for_offsite_testing",
      pending.offsiteTravel.outboundPath,
      null,
    );
  }
}

function ensureLegacyOffsiteTravel(
  state: GameState,
  encounter: EncounterState,
  context: DomainContext,
): void {
  const pending = encounter.pendingResult;
  if (
    !pending ||
    pending.deliveredAtTick !== null ||
    pending.patientTravel !== null ||
    pending.offsiteTravel !== null ||
    pending.offsiteReturnStartedAtTick !== null ||
    encounter.patientMovement !== null
  ) {
    return;
  }
  const entrance = getPublicEntrance(state, context);
  const offscreenEndpoint = getEncounterArrivalStart(
    state,
    context,
    encounter.id,
  );
  if (!entrance || !offscreenEndpoint) {
    return;
  }
  const outboundPath = encounter.patientLocation
    ? pathFromLocationToOffscreen(
        state,
        context,
        encounter.patientLocation,
        encounter.id,
      )
    : [{ ...offscreenEndpoint }];
  const returnPath = pathFromOutsideToRoom(
    state,
    context,
    offscreenEndpoint,
    entrance.room.id,
  );
  if (outboundPath.length === 0 || returnPath.length === 0) {
    return;
  }
  const outboundTicks = movementDuration(outboundPath, context);
  const returnTicks = movementDuration(returnPath, context);
  const outboundStartTick = state.facilityTick;
  const outboundArrivalTick = outboundStartTick + outboundTicks;
  const earliestArrivalTick = outboundArrivalTick + returnTicks;
  if (pending.dueTick < earliestArrivalTick) {
    pending.dueTick = earliestArrivalTick;
    pending.durationTicks = Math.max(
      pending.durationTicks,
      pending.dueTick - pending.scheduledAtTick,
    );
  }
  pending.offsiteTravel = {
    version: "offsite-patient-travel.v1",
    direction: offscreenEndpoint.x < entrance.outside.x ? -1 : 1,
    outboundPath: outboundPath.map((point) => ({ ...point })),
    returnPath: returnPath.map((point) => ({ ...point })),
    tilesPerTick:
      context.balanceRelease.facility.characterTravelTilesPerTick,
    outboundStartTick,
    outboundArrivalTick,
    returnStartTick: pending.dueTick - returnTicks,
    returnArrivalTick: pending.dueTick,
  };
}

function reduceAcknowledgeDecisionFeedback(
  state: GameState,
  command: Extract<
    GameCommand,
    { type: "ACKNOWLEDGE_DECISION_FEEDBACK" }
  >,
  context: DomainContext,
): GameState {
  const encounter = state.encounters[command.encounterId];
  const currentStep =
    encounter?.steps[encounter.currentNodeIndex];
  if (
    !encounter ||
    encounter.lifecycle !== "active_action_required" ||
    !currentStep ||
    currentStep.decisionNodeId !== command.decisionNodeId ||
    currentStep.status !== "feedback_pending" ||
    currentStep.answer === null
  ) {
    return rejectCommand(
      state,
      command,
      "No intermediate decision feedback is waiting.",
    );
  }

  const next = clonePlain(state);
  const nextEncounter = next.encounters[command.encounterId]!;
  clearPatientFeedAttention(nextEncounter);
  const nextStep = nextEncounter.steps[nextEncounter.currentNodeIndex]!;
  if (
    nextEncounter.pendingResult &&
    nextEncounter.pendingResult.originatingNodeIndex ===
      nextEncounter.currentNodeIndex
  ) {
    const originPlan = getPendingResultOriginPlan(
      next,
      context,
      nextEncounter,
    );
    if (
      !originPlan ||
      !configurePendingResultTiming(
        next,
        context,
        nextEncounter,
        nextEncounter.pendingResult,
        originPlan.readyTick,
        originPlan.origin,
      )
    ) {
      return rejectCommand(
        state,
        command,
        "The patient cannot complete that service route within its authored duration.",
      );
    }
    beginPendingResultTravel(
      next,
      nextEncounter,
      context,
    );
    nextStep.result = clonePlain(nextEncounter.pendingResult);
    nextStep.status = "result_pending";
    nextEncounter.lifecycle = "active_pending_result";
    nextEncounter.idleWaitingSinceTick = null;
    nextEncounter.lastSatisfactionDecayAtTick = next.facilityTick;
    if (next.openChartEncounterId === nextEncounter.id) {
      next.openChartEncounterId = null;
    }
    if (next.attendedEncounterId === nextEncounter.id) {
      next.attendedEncounterId = null;
    }
    return recordReceipt(
      next,
      command,
      "applied",
      "Feedback reviewed; the corrected service is now underway.",
    );
  }

  nextStep.status = "completed";
  nextEncounter.currentNodeIndex += 1;
  const followingStep =
    nextEncounter.steps[nextEncounter.currentNodeIndex];
  if (!followingStep) {
    return rejectCommand(
      state,
      command,
      "The encounter has no next decision.",
    );
  }
  followingStep.status = "action_required";
  nextEncounter.lifecycle = "active_action_required";
  nextEncounter.idleWaitingSinceTick = null;
  nextEncounter.lastSatisfactionDecayAtTick = next.facilityTick;
  if (next.openChartEncounterId !== nextEncounter.id) {
    beginPatientFeedAttention(
      nextEncounter,
      "clinical_decision",
      next.facilityTick,
    );
  }
  return recordReceipt(
    next,
    command,
    "applied",
    "Feedback reviewed; the next decision is ready.",
  );
}

function reduceAcknowledgeFeedback(
  state: GameState,
  command: Extract<GameCommand, { type: "ACKNOWLEDGE_TERMINAL_FEEDBACK" }>,
): GameState {
  const encounter = state.encounters[command.encounterId];
  if (
    !encounter ||
    encounter.lifecycle !== "resolved_summary_available" ||
    !encounter.terminalFeedback
  ) {
    return rejectCommand(state, command, "No terminal feedback is ready.");
  }
  const next = clonePlain(state);
  next.encounters[command.encounterId]!.terminalFeedback!.acknowledged = true;
  return recordReceipt(next, command, "applied", "Terminal feedback acknowledged.");
}

function getNextRoutineArrivalTick(
  state: GameState,
  context: DomainContext,
  firstArrival = false,
): number {
  const arrivals = context.balanceRelease.arrivals;
  if (firstArrival) {
    const span =
      arrivals.firstArrivalMaximumMinutes -
      arrivals.firstArrivalMinimumMinutes +
      1;
    return (
      state.facilityTick +
      arrivals.firstArrivalMinimumMinutes +
      deterministicInteger(
        state.campaignSeed,
        RANDOM_STREAMS.routineArrivalTiming,
        "arrival.first.v1",
        span,
      )
    );
  }
  const variation = arrivals.routineVariationMinutes;
  const offset =
    deterministicInteger(
      state.campaignSeed,
      RANDOM_STREAMS.routineArrivalTiming,
      `arrival.${state.routineArrivalSequence}.v1`,
      variation * 2 + 1,
    ) - variation;
  const advertising =
    context.balanceRelease.advertising.levels.find(
      (level) => level.level === state.advertisingLevel,
    ) ?? context.balanceRelease.advertising.levels[0]!;
  const adjustedInterval = Math.round(
    ((arrivals.routineBaseIntervalMinutes + offset) *
      advertising.arrivalIntervalMultiplierPercent) /
      100,
  );
  return (
    state.facilityTick +
    Math.max(1, adjustedInterval)
  );
}

function maybeAdmitAutomaticPatient(
  state: GameState,
  context: DomainContext,
  selectedAtRealMs: number,
): void {
  if (
    state.facilityLevel === 0 &&
    !state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID] &&
    state.encounters[TUTORIAL_ENCOUNTER_ID]?.resolutionReason === "completed"
  ) {
    const secondTutorial = context.clinicalRelease.cases.find(
      (clinicalCase) => clinicalCase.id === SECOND_TUTORIAL_CASE_ID,
    );
    if (!secondTutorial) {
      throw new Error("The protected second tutorial case is missing.");
    }
    state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID] = createEncounter(
      state,
      context,
      {
        encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
        clinicalCase: secondTutorial,
        arrivalClass: "tutorial",
        protectedGuaranteeId: "guarantee.level0.second-tutorial",
      },
    );
    state.criticalGuarantees["guarantee.level0.second-tutorial"] =
      "in_progress";
    return;
  }
  if (state.facilityTick < state.nextRoutineArrivalTick) {
    return;
  }

  if (state.facilityLevel === 0) {
    const introIds = [TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID];
    const introComplete = introIds.every(
      (id) => state.encounters[id]?.resolutionReason === "completed",
    );
    const stage = context.balanceRelease.facility.stageDefinitions.find(
      (candidate) => candidate.level === 0,
    );
    const completedCount = Object.values(state.encounters).filter(
      (encounter) => encounter.resolutionReason === "completed",
    ).length;
    if (
      !introComplete ||
      !stage ||
      (state.clinicalXp >= stage.minimumClinicalXp &&
        completedCount >= stage.minimumCompletedEncounters)
    ) {
      return;
    }
  }

  if (!canAdmitPatient(state, "routine", context)) {
    return;
  }

  const eligibleCases = context.clinicalRelease.cases
    .filter(
      (clinicalCase) =>
        clinicalCase.routineEligible &&
        clinicalCase.earliestFacilityStage <= state.facilityLevel &&
        clinicalCase.requiredCapabilityIds.every((capabilityId) =>
          getCurrentCapabilities(state, context).has(capabilityId),
        ),
    )
    .sort((left, right) => left.id.localeCompare(right.id));
  if (eligibleCases.length === 0) {
    return;
  }
  const selection = selectRoutineClinicalCase(
    state,
    eligibleCases,
    selectedAtRealMs,
  );
  if (!selection) {
    // Do not repeatedly poll every simulation minute when every learned
    // concept is still ahead of its real-world FSRS due date.
    state.nextRoutineArrivalTick = getNextRoutineArrivalTick(state, context);
    return;
  }
  const sequence = state.routineArrivalSequence;
  const clinicalCase = selection.clinicalCase;
  const encounterId = `encounter.auto.${state.facilityLevel}.${sequence}`;
  state.encounters[encounterId] = createEncounter(state, context, {
    encounterId,
    clinicalCase,
    arrivalClass: "routine",
    protectedGuaranteeId: null,
    // Level 0 recovery patients exist specifically to prevent an incorrect
    // tutorial from blocking progression. They may wait indefinitely until
    // the player is ready; ordinary Level 1 patients retain normal patience.
    patienceExempt: state.facilityLevel === 0,
  });
  state.routineArrivalSequence += 1;
  state.nextRoutineArrivalTick = getNextRoutineArrivalTick(state, context);
}

function applyOperatingExpenses(
  state: GameState,
  context: DomainContext,
): void {
  const hourlyRoomExpense = state.rooms.reduce((total, room) => {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    return (
      total +
      (definition?.upkeepPerExpenseInterval ?? 0) +
      (definition?.upkeepPerUpgradeLevel ?? 0) *
        Math.max(0, room.upgradeLevel - 1)
    );
  }, 0);
  const hourlyStaffExpense = state.employees.reduce(
    (total, employee) => total + employee.salaryPerExpenseInterval,
    0,
  );
  const hourlyAdvertisingExpense =
    context.balanceRelease.advertising.levels.find(
      (level) => level.level === state.advertisingLevel,
    )?.hourlyCost ?? 0;
  const hourlyExpense =
    hourlyRoomExpense + hourlyStaffExpense + hourlyAdvertisingExpense;
  // One simulation tick is one minute. Accruing in one-sixtieth-of-a-cent
  // units keeps the result identical across speed changes, pauses, and reloads.
  state.operatingAccrualSixtiethCents += hourlyExpense * 100;
  if (state.facilityTick < state.nextFinancialPostingTick) {
    return;
  }

  const postedCents = Math.floor(
    state.operatingAccrualSixtiethCents / 60,
  );
  state.operatingAccrualSixtiethCents %= 60;
  const postingInterval =
    context.balanceRelease.economy.postingIntervalMinutes;
  while (state.nextFinancialPostingTick <= state.facilityTick) {
    state.nextFinancialPostingTick += postingInterval;
  }
  if (postedCents <= 0) {
    return;
  }
  const paidCents = Math.min(state.cashCents, postedCents);
  const shortfallCents = postedCents - paidCents;
  state.cashCents -= paidCents;
  state.cash = state.cashCents / 100;
  const expense = postedCents / 100;
  state.totalOperatingExpenses += expense;
  if (shortfallCents > 0 && state.employees.length > 0) {
    const moraleDecay =
      context.balanceRelease.insolvency.moraleDecayPerPosting;
    const quittingThreshold =
      context.balanceRelease.insolvency.employeeQuittingThreshold;
    const quittingEmployees = state.employees.filter((employee) => {
      employee.morale = clamp(employee.morale - moraleDecay, 0, 100);
      return employee.morale <= quittingThreshold;
    });
    if (quittingEmployees.length > 0) {
      const quittingIds = new Set(
        quittingEmployees.map((employee) => employee.id),
      );
      state.employees = state.employees.filter(
        (employee) => !quittingIds.has(employee.id),
      );
      for (const employee of quittingEmployees) {
        appendEvent(state, {
          id: `event.staff-quit.${employee.id}.${state.facilityTick}`,
          type: "staff_quit",
          facilityTick: state.facilityTick,
          encounterId: null,
          message: `${employee.displayName} quit after another unpaid expense cycle.`,
          priority: "action_required",
          definitionId: "alert.staff.quit-insolvency",
          target: { kind: "campaign", id: state.campaignId },
        });
      }
    }
  }
  appendEvent(state, {
    id: `event.operating-expense.${state.facilityTick}`,
    type: "operating_expense",
    facilityTick: state.facilityTick,
    encounterId: null,
    message:
      shortfallCents > 0
        ? `Operating costs $${expense.toFixed(2)}; cash is $0 and staff morale fell.`
        : `Operating costs -$${expense.toFixed(2)}.`,
    priority: shortfallCents > 0 ? "action_required" : "informational",
    definitionId: "alert.finance.expense",
    target: {
      kind: "campaign",
      id: state.campaignId,
    },
  });
}

function getNextLitterSpawnTick(
  state: GameState,
  context: DomainContext,
): number {
  const config = context.balanceRelease.environment;
  const spread =
    config.litterSpawnMaximumMinutes -
    config.litterSpawnMinimumMinutes +
    1;
  return (
    state.facilityTick +
    config.litterSpawnMinimumMinutes +
    deterministicInteger(
      state.campaignSeed,
      RANDOM_STREAMS.environment,
      `litter.delay.${state.environment.litterSequence}`,
      spread,
    )
  );
}

function getWaterCoolerLocation(
  state: GameState,
  context: DomainContext,
) {
  const frontRoom = state.rooms.find((room) =>
    context.balanceRelease.facility.protectedRoomDefinitionIds.includes(
      room.roomDefinitionId,
    ),
  );
  const definition = frontRoom
    ? getRoomDefinition(frontRoom.roomDefinitionId, context)
    : null;
  return frontRoom && definition
    ? {
        x: frontRoom.x,
        y:
          frontRoom.y +
          Math.min(
            1,
            getRotatedFootprint(definition, frontRoom.orientation).height -
              1,
          ),
      }
    : state.environment.founderLocation;
}

function addWaitingPatientSatisfaction(
  state: GameState,
  amount: number,
): void {
  if (amount <= 0) {
    return;
  }
  for (const encounter of Object.values(state.encounters)) {
    if (
      encounter.resolutionReason === null &&
      encounter.idleWaitingSinceTick !== null
    ) {
      encounter.patientSatisfaction = clamp(
        encounter.patientSatisfaction + amount,
        0,
        100,
      );
    }
  }
}

function maybeSpawnLitter(
  state: GameState,
  context: DomainContext,
): void {
  const environment = state.environment;
  const config = context.balanceRelease.environment;
  if (state.facilityTick < environment.nextLitterSpawnTick) {
    return;
  }
  environment.litterSequence += 1;
  environment.nextLitterSpawnTick = getNextLitterSpawnTick(state, context);
  if (environment.litterItems.length >= config.maximumLitterItems) {
    return;
  }

  const blocked = new Set<string>([
    `${environment.founderLocation.x},${environment.founderLocation.y}`,
    ...environment.litterItems.map(
      (item) => `${item.location.x},${item.location.y}`,
    ),
    ...state.employees.map(
      (employee) => `${employee.location.x},${employee.location.y}`,
    ),
  ]);
  for (const door of state.doors) {
    const room = state.rooms.find((candidate) => candidate.id === door.roomId);
    const definition = room
      ? getRoomDefinition(room.roomDefinitionId, context)
      : null;
    const cells =
      room && definition ? getDoorCells(door, room, definition) : null;
    if (cells) {
      blocked.add(`${cells.inside.x},${cells.inside.y}`);
      blocked.add(`${cells.outside.x},${cells.outside.y}`);
    }
  }
  const cooler = getWaterCoolerLocation(state, context);
  blocked.add(`${cooler.x},${cooler.y}`);

  const candidates = state.rooms
    .flatMap((room) => {
      const definition = getRoomDefinition(room.roomDefinitionId, context);
      return definition?.kind === "room"
        ? getRoomNavigableTiles(room, definition, state.doors).map(
            (location) => ({
              roomId: room.id,
              location,
            }),
          )
        : [];
    })
    .filter(
      ({ location }) => !blocked.has(`${location.x},${location.y}`),
    )
    .sort(
      (left, right) =>
        left.roomId.localeCompare(right.roomId) ||
        left.location.y - right.location.y ||
        left.location.x - right.location.x,
    );
  if (candidates.length === 0) {
    return;
  }
  const selected =
    candidates[
      deterministicInteger(
        state.campaignSeed,
        RANDOM_STREAMS.environment,
        `litter.location.${environment.litterSequence}`,
        candidates.length,
      )
    ]!;
  const litter = {
    id: `litter.${environment.litterSequence}`,
    roomId: selected.roomId,
    location: { ...selected.location },
    spawnedAtFacilityTick: state.facilityTick,
  };
  environment.litterItems.push(litter);
  appendEvent(state, {
    id: `event.${litter.id}.appeared`,
    type: "litter_appeared",
    facilityTick: state.facilityTick,
    encounterId: null,
    message: "A piece of litter has achieved independent facility status.",
    priority: "flavor",
    definitionId: "alert.environment.litter-appeared",
    target: { kind: "room", id: litter.roomId },
  });
}

function drainWaterCooler(
  state: GameState,
  context: DomainContext,
): void {
  const environment = state.environment;
  const config = context.balanceRelease.environment;
  while (environment.nextWaterCoolerDrainTick <= state.facilityTick) {
    const previous = environment.waterCoolerFillPercent;
    environment.waterCoolerFillPercent = clamp(
      previous - config.waterCoolerDrainPerInterval,
      0,
      100,
    );
    environment.nextWaterCoolerDrainTick +=
      config.waterCoolerDrainIntervalMinutes;
    // The actionable occurrence is materialized only when the cooler is
    // actually empty. Low-but-refillable state remains visible on the object
    // itself and does not create a duplicate feed row.
  }
}

function maybeAssignReceptionistWaterRefill(
  state: GameState,
  context: DomainContext,
): void {
  const environment = state.environment;
  if (
    environment.waterCoolerFillPercent > 0 ||
    environment.waterCoolerEmptySinceTick === null ||
    environment.founderActivity?.kind === "refill_water" ||
    state.employees.some(
      (employee) => employee.facilityTask?.kind === "refill_water",
    )
  ) {
    return;
  }

  const refillDelay =
    context.balanceRelease.environment
      .receptionistWaterRefillDelayMinutes;
  const receptionist = state.employees
    .filter(
      (employee) =>
        employee.staffRoleDefinitionId === "staff.receptionist" &&
        !employee.facilityTask &&
        !(
          environment.founderActivity?.kind === "praise_employee" &&
          environment.founderActivity.targetId === employee.id
        ) &&
        state.facilityTick >=
          Math.max(
            environment.waterCoolerEmptySinceTick!,
            employee.hiredAtFacilityTick,
          ) +
            refillDelay,
    )
    .sort(
      (left, right) =>
        left.hiredAtFacilityTick - right.hiredAtFacilityTick ||
        left.id.localeCompare(right.id),
    )[0];
  if (!receptionist) {
    return;
  }

  const path = findDeterministicFacilityPath(
    receptionist.location,
    getWaterCoolerLocation(state, context),
    state.rooms,
    state.doors,
    (definitionId) => getRoomDefinition(definitionId, context),
  );
  if (path.length === 0) {
    return;
  }

  receptionist.path = path;
  receptionist.pathIndex = 0;
  receptionist.lastMovedAtFacilityTick = state.facilityTick;
  receptionist.facilityTask = {
    kind: "refill_water",
    startedAtFacilityTick: state.facilityTick,
    workMinutesRemaining:
      context.balanceRelease.environment.founderInteractionMinutes,
  };
}

function advanceEmployeeFacilityTasks(
  state: GameState,
  context: DomainContext,
): void {
  for (const employee of state.employees) {
    const task = employee.facilityTask;
    if (!task) {
      continue;
    }
    if (employee.pathIndex < employee.path.length - 1) {
      continue;
    }

    task.workMinutesRemaining -= 1;
    if (task.workMinutesRemaining > 0) {
      continue;
    }

    if (
      task.kind === "refill_water" &&
      state.environment.waterCoolerFillPercent <= 0
    ) {
      state.environment.waterCoolerFillPercent = 100;
      addWaitingPatientSatisfaction(
        state,
        context.balanceRelease.environment
          .waterRefillSatisfactionBonus,
      );
    }
    employee.facilityTask = null;
    employee.nextIdleActionAtFacilityTick = getNextIdleActionTick(
      state,
      context,
      employee.id,
    );
  }
}

function completeFounderActivity(
  state: GameState,
  context: DomainContext,
): void {
  const activity = state.environment.founderActivity;
  if (!activity) {
    return;
  }
  const config = context.balanceRelease.environment;
  if (activity.kind === "collect_litter") {
    const litter = state.environment.litterItems.find(
      (item) => item.id === activity.targetId,
    );
    if (litter) {
      state.environment.litterItems =
        state.environment.litterItems.filter(
          (item) => item.id !== litter.id,
        );
      const room = state.rooms.find((candidate) => candidate.id === litter.roomId);
      if (room) {
        room.cleanliness = clamp(
          (room.cleanliness ?? 100) + config.litterCleanupRestore,
          0,
          100,
        );
      }
      addWaitingPatientSatisfaction(
        state,
        config.litterCleanupSatisfactionBonus,
      );
      state.environment.founderLitterCleanups += 1;
      state.environment.lastLitterCleanupAtTick =
        state.facilityTick;
      const rendered = renderPrototypeAlert(
        "alert.success.trash-cleaned",
      );
      appendEvent(state, {
        id: `event.${litter.id}.collected.${state.facilityTick}`,
        type: "litter_collected",
        facilityTick: state.facilityTick,
        encounterId: null,
        message: rendered.body,
        priority: "informational",
        definitionId: rendered.definitionId,
        alertCategory: "success",
        alertVariantId: rendered.variantId,
        target: { kind: "room", id: litter.roomId },
      });
    }
  } else if (activity.kind === "refill_water") {
    state.environment.waterCoolerFillPercent = 100;
    addWaitingPatientSatisfaction(
      state,
      config.waterRefillSatisfactionBonus,
    );
    const rendered = renderPrototypeAlert(
      "alert.success.water-refilled",
    );
    appendEvent(state, {
      id: `event.water-refilled.${state.facilityTick}`,
      type: "water_cooler_refilled",
      facilityTick: state.facilityTick,
      encounterId: null,
      message: rendered.body,
      priority: "informational",
      definitionId: rendered.definitionId,
      alertCategory: "success",
      alertVariantId: rendered.variantId,
      target: { kind: "campaign", id: state.campaignId },
    });
  } else if (activity.kind === "praise_employee") {
    const employee = state.employees.find(
      (candidate) => candidate.id === activity.targetId,
    );
    if (employee) {
      employee.morale = clamp(
        employee.morale + config.praiseMoraleBonus,
        0,
        100,
      );
      employee.lastPraisedAtFacilityTick = state.facilityTick;
      appendEvent(state, {
        id: `event.employee-praised.${employee.id}.${state.facilityTick}`,
        type: "employee_praised",
        facilityTick: state.facilityTick,
        encounterId: null,
        message: `${employee.displayName} was praised. Morale is ${employee.morale}%.`,
        priority: "flavor",
        definitionId: "alert.staff.praised",
        target: { kind: "employee", id: employee.id },
      });
    }
  }
  state.environment.founderActivity = null;
}

function advanceFounderActivity(
  state: GameState,
  context: DomainContext,
): void {
  const activity = state.environment.founderActivity;
  if (!activity) {
    return;
  }
  if (activity.pathIndex < activity.path.length - 1) {
    const elapsedTicks = Math.max(
      1,
      state.facilityTick - activity.lastMovedAtFacilityTick,
    );
    activity.pathIndex = Math.min(
      activity.path.length - 1,
      activity.pathIndex +
        elapsedTicks *
          context.balanceRelease.facility
            .characterTravelTilesPerTick,
    );
    activity.lastMovedAtFacilityTick = state.facilityTick;
    state.environment.founderLocation = {
      ...activity.path[activity.pathIndex]!,
    };
    return;
  }
  activity.workMinutesRemaining -= 1;
  if (activity.workMinutesRemaining <= 0) {
    completeFounderActivity(state, context);
  }
}

const DISSATISFACTION_CAUSE_ORDER: readonly PatientDissatisfactionCause[] = [
  "excessive_waiting",
  "poor_cleanliness",
  "missing_amenities",
  "no_receptionist",
  "imaging_unavailable",
  "general",
];

function getPrimaryDissatisfactionCause(
  encounter: EncounterState,
): PrototypeDissatisfactionCause {
  const ranked = DISSATISFACTION_CAUSE_ORDER.flatMap((cause, index) => {
    const state = encounter.dissatisfactionByCause[cause];
    return state
      ? [
          {
            cause,
            index,
            pointsLost: state.pointsLost,
            lastAppliedAtFacilityTick:
              state.lastAppliedAtFacilityTick,
          },
        ]
      : [];
  }).sort(
    (left, right) =>
      right.pointsLost - left.pointsLost ||
      right.lastAppliedAtFacilityTick -
        left.lastAppliedAtFacilityTick ||
      left.index - right.index,
  );
  return ranked[0]?.cause ?? "general";
}

function createWalkoutReview(
  state: GameState,
  encounter: EncounterState,
): {
  definitionId: string;
  variantId: string;
  category: "walkout_review";
  rating: 1 | 2;
  cause: PrototypeDissatisfactionCause;
  message: string;
} {
  const cause = getPrimaryDissatisfactionCause(encounter);
  let definitions = PROTOTYPE_WALKOUT_REVIEW_DEFINITIONS.filter(
    (definition) =>
      definition.dissatisfactionCauses?.includes(cause),
  );
  if (definitions.length === 0) {
    definitions = PROTOTYPE_WALKOUT_REVIEW_DEFINITIONS.filter(
      (definition) =>
        definition.dissatisfactionCauses?.includes("general"),
    );
  }
  const definition = pickWeighted(
    definitions,
    state,
    `walkout.definition.${encounter.id}`,
  );
  const nonRecentVariants = definition.variants.filter(
    (variant) =>
      !state.alertHumor.recentWalkoutReviewVariantIds.includes(
        variant.id,
      ),
  );
  const lastReviewVariantId =
    state.alertHumor.recentWalkoutReviewVariantIds.at(-1);
  const nonConsecutiveVariants = definition.variants.filter(
    (variant) => variant.id !== lastReviewVariantId,
  );
  const variant = pickWeighted(
    nonRecentVariants.length > 0
      ? nonRecentVariants
      : nonConsecutiveVariants.length > 0
        ? nonConsecutiveVariants
        : definition.variants,
    state,
    `walkout.variant.${encounter.id}`,
  );
  const ratings = definition.reviewRatings ?? [1, 2];
  const severityRating = encounter.patientSatisfaction < 30 ? 1 : 2;
  const rating = ratings.includes(severityRating)
    ? severityRating
    : ratings[0]!;
  const rendered = renderPrototypeAlert(
    definition,
    {
      patient_name: encounter.patientDisplayName,
      satisfaction: encounter.patientSatisfaction,
    },
    variant.id,
  );
  state.alertHumor.recentWalkoutReviewVariantIds =
    appendBoundedHistory(
      state.alertHumor.recentWalkoutReviewVariantIds,
      rendered.variantId,
      PROTOTYPE_ALERT_SCHEDULING.recentReviewHistoryLimit,
    );
  return {
    definitionId: rendered.definitionId,
    variantId: rendered.variantId,
    category: "walkout_review",
    rating,
    cause,
    message: rendered.body,
  };
}

function finalizePatientWalkout(
  state: GameState,
  encounter: EncounterState,
): void {
  encounter.lifecycle = "resolved";
  encounter.resolutionReason = "walkout";
  encounter.terminalFeedback = null;
  encounter.settlementId = null;
  encounter.finalPatientSatisfaction = encounter.patientSatisfaction;
  encounter.resolvedAtFacilityTick = state.facilityTick;
  encounter.idleWaitingSinceTick = null;
  encounter.pendingResult = null;
  encounter.patientMovement = null;
  encounter.patientLocation = null;
  if (state.openChartEncounterId === encounter.id) {
    state.openChartEncounterId = null;
  }
  if (state.attendedEncounterId === encounter.id) {
    state.attendedEncounterId = null;
  }
  if (encounter.protectedGuaranteeId) {
    state.criticalGuarantees[encounter.protectedGuaranteeId] = "pending";
  }
  const review = createWalkoutReview(state, encounter);
  appendEvent(state, {
    id: `event.left-before-seen.${encounter.id}`,
    type: "left_before_seen",
    facilityTick: state.facilityTick,
    encounterId: encounter.id,
    message: `New ${review.rating}-star review from ${encounter.patientDisplayName}: ${review.message}`,
    priority: "informational",
    definitionId: review.definitionId,
    alertCategory: review.category,
    alertVariantId: review.variantId,
    walkoutReview: {
      rating: review.rating,
      cause: review.cause,
    },
    target: {
      kind: "encounter",
      id: encounter.id,
    },
  });
}

function completePatientMovement(
  state: GameState,
  encounter: EncounterState,
  context: DomainContext,
): void {
  const movement = encounter.patientMovement;
  if (!movement) {
    return;
  }
  const finalLocation = movement.path.at(-1) ?? null;
  encounter.patientLocation = finalLocation ? { ...finalLocation } : null;
  encounter.patientMovement = null;
  if (movement.destinationRoomInstanceId) {
    encounter.assignedRoomInstanceId =
      movement.destinationRoomInstanceId;
  } else if (
    movement.kind === "walking_to_waiting" ||
    movement.kind === "departing_for_offsite_testing" ||
    movement.kind === "leaving_after_resolution" ||
    movement.kind === "leaving_after_walkout"
  ) {
    encounter.assignedRoomInstanceId = null;
  }

  switch (movement.kind) {
    case "arriving_for_check_in":
      // Check-in makes the chart available immediately, but ordinary walking
      // to a waiting place is not idle waiting and must not consume patience.
      applyFacilityExperienceAtCheckIn(state, encounter, context);
      encounter.idleWaitingSinceTick = null;
      encounter.lastSatisfactionDecayAtTick = state.facilityTick;
      beginPatientFeedAttention(
        encounter,
        "checked_in",
        state.facilityTick,
      );
      {
        const destination = chooseWaitingDestination(
          state,
          context,
          encounter,
        );
        startPatientMovement(
          state,
          context,
          encounter,
          "walking_to_waiting",
          destination.path,
          destination.roomId,
        );
      }
      return;
    case "walking_to_waiting":
      encounter.idleWaitingSinceTick = state.facilityTick;
      encounter.lastSatisfactionDecayAtTick = state.facilityTick;
      if (encounter.queuedCareRoomInstanceId) {
        const roomId = encounter.queuedCareRoomInstanceId;
        const path = encounter.patientLocation
          ? pathFromLocationToRoom(
              state,
              context,
              encounter.patientLocation,
              roomId,
            )
          : [];
        encounter.queuedCareRoomInstanceId = null;
        startPatientMovement(
          state,
          context,
          encounter,
          "walking_to_care",
          path,
          roomId,
        );
        return;
      }
      if (encounter.lifecycle === "resolved") {
        if (encounter.patientLocation) {
          startPatientMovement(
            state,
            context,
            encounter,
            "leaving_after_resolution",
            pathFromLocationToOffscreen(
              state,
              context,
              encounter.patientLocation,
              encounter.id,
            ),
            null,
          );
        }
        return;
      }
      if (encounter.lifecycle === "active_pending_result") {
        encounter.idleWaitingSinceTick = null;
        beginPendingResultTravel(state, encounter, context);
      }
      return;
    case "walking_to_care":
      encounter.queuedCareRoomInstanceId = null;
      if (encounter.lifecycle === "resolved") {
        if (encounter.patientLocation) {
          startPatientMovement(
            state,
            context,
            encounter,
            "leaving_after_resolution",
            pathFromLocationToOffscreen(
              state,
              context,
              encounter.patientLocation,
              encounter.id,
            ),
            null,
          );
        }
        return;
      }
      if (encounter.lifecycle === "active_pending_result") {
        encounter.idleWaitingSinceTick = null;
        beginPendingResultTravel(state, encounter, context);
        return;
      }
      // Opening the chart already made the decision available. Reaching the
      // examination destination only completes the physical movement.
      encounter.lifecycle = "active_action_required";
      encounter.firstOpenedAtTick ??= state.facilityTick;
      encounter.idleWaitingSinceTick =
        state.openChartEncounterId === encounter.id
          ? null
          : state.facilityTick;
      encounter.lastSatisfactionDecayAtTick = state.facilityTick;
      state.attendedEncounterId =
        state.openChartEncounterId === encounter.id
          ? encounter.id
          : state.attendedEncounterId;
      if (state.openChartEncounterId !== encounter.id) {
        beginPatientFeedAttention(
          encounter,
          "clinical_decision",
          state.facilityTick,
        );
      }
      return;
    case "departing_for_offsite_testing":
      encounter.patientLocation = null;
      return;
    case "returning_from_offsite_testing": {
      // Reaching the Front Desk completes the return trip and makes the
      // existing chart eligible for its next decision. The patient then moves
      // to the same deterministic waiting hierarchy used after first check-in.
      encounter.idleWaitingSinceTick = null;
      encounter.lastSatisfactionDecayAtTick = state.facilityTick;
      const destination = chooseWaitingDestination(
        state,
        context,
        encounter,
      );
      startPatientMovement(
        state,
        context,
        encounter,
        "walking_to_waiting",
        destination.path,
        destination.roomId,
      );
      return;
    }
    case "idle_within_room":
      if (encounter.lifecycle === "resolved") {
        encounter.queuedCareRoomInstanceId = null;
        if (encounter.patientLocation) {
          startPatientMovement(
            state,
            context,
            encounter,
            "leaving_after_resolution",
            pathFromLocationToOffscreen(
              state,
              context,
              encounter.patientLocation,
              encounter.id,
            ),
            null,
          );
        }
        return;
      }
      if (encounter.queuedCareRoomInstanceId) {
        const roomId = encounter.queuedCareRoomInstanceId;
        const path = encounter.patientLocation
          ? pathFromLocationToRoom(
              state,
              context,
              encounter.patientLocation,
              roomId,
            )
          : [];
        encounter.queuedCareRoomInstanceId = null;
        startPatientMovement(
          state,
          context,
          encounter,
          "walking_to_care",
          path,
          roomId,
        );
        return;
      }
      if (encounter.lifecycle === "active_pending_result") {
        encounter.idleWaitingSinceTick = null;
        beginPendingResultTravel(state, encounter, context);
        return;
      }
      encounter.nextIdleActionAtFacilityTick = getNextIdleActionTick(
        state,
        context,
        encounter.id,
      );
      return;
    case "leaving_after_resolution":
      encounter.patientLocation = null;
      return;
    case "leaving_after_walkout":
      finalizePatientWalkout(state, encounter);
  }
}

function startPatientMovement(
  state: GameState,
  context: DomainContext,
  encounter: EncounterState,
  kind: PatientMovementKind,
  path: GridPoint[],
  destinationRoomInstanceId: string | null,
): number {
  if (path.length === 0) {
    return -1;
  }
  if (path.length > 0) {
    encounter.patientLocation = { ...path[0]! };
  }
  encounter.patientMovement = createPatientMovement(
    state,
    context,
    kind,
    path,
    destinationRoomInstanceId,
  );
  if (!encounter.patientMovement) {
    encounter.patientMovement = {
      kind,
      path:
        path.length > 0
          ? path.map((point) => ({ ...point }))
          : encounter.patientLocation
            ? [{ ...encounter.patientLocation }]
            : [],
      pathIndex: Math.max(0, path.length - 1),
      lastMovedAtFacilityTick: state.facilityTick,
      destinationRoomInstanceId,
    };
    completePatientMovement(state, encounter, context);
    return 0;
  }
  return movementDuration(path, context);
}

function advancePatientMovements(
  state: GameState,
  context: DomainContext,
): void {
  const tilesPerTick =
    context.balanceRelease.facility.characterTravelTilesPerTick;
  for (const encounter of Object.values(state.encounters)) {
    const movement = encounter.patientMovement;
    if (!movement) {
      continue;
    }
    const elapsedTicks = Math.max(
      1,
      state.facilityTick - movement.lastMovedAtFacilityTick,
    );
    movement.pathIndex = Math.min(
      Math.max(0, movement.path.length - 1),
      movement.pathIndex + elapsedTicks * tilesPerTick,
    );
    movement.lastMovedAtFacilityTick = state.facilityTick;
    const location = movement.path[movement.pathIndex];
    if (location) {
      encounter.patientLocation = { ...location };
    }
    if (movement.pathIndex >= movement.path.length - 1) {
      completePatientMovement(state, encounter, context);
    }
  }
}

function maybeStartPatientIdleMovements(
  state: GameState,
  context: DomainContext,
): void {
  const config = context.balanceRelease.environment;
  for (const encounter of Object.values(state.encounters)) {
    if (
      encounter.patientMovement !== null ||
      encounter.patientLocation === null ||
      encounter.patientLocation.y >=
        context.balanceRelease.facility.gridHeight ||
      encounter.assignedRoomInstanceId === null ||
      state.openChartEncounterId === encounter.id ||
      state.facilityTick < encounter.nextIdleActionAtFacilityTick ||
      (encounter.lifecycle !== "waiting_unopened" &&
        encounter.lifecycle !== "active_action_required")
    ) {
      continue;
    }
    encounter.nextIdleActionAtFacilityTick = getNextIdleActionTick(
      state,
      context,
      encounter.id,
    );
    const roll = deterministicInteger(
      state.campaignSeed,
      RANDOM_STREAMS.environment,
      `${encounter.id}:idle-roll:${state.facilityTick}`,
      100,
    );
    if (roll >= config.idleActionChancePercent) {
      continue;
    }
    const room = state.rooms.find(
      (candidate) => candidate.id === encounter.assignedRoomInstanceId,
    );
    const definition = room
      ? getRoomDefinition(room.roomDefinitionId, context)
      : null;
    if (!room || !definition) {
      continue;
    }
    const blockedDoorTiles = new Set(
      state.doors
        .filter((door) => door.roomId === room.id)
        .flatMap((door) => {
          const cells = getDoorCells(door, room, definition);
          return cells ? [`${cells.inside.x},${cells.inside.y}`] : [];
        }),
    );
    const destinations = getRoomNavigableTiles(
      room,
      definition,
      state.doors,
    )
      .filter(
        (point) =>
          (point.x !== encounter.patientLocation!.x ||
            point.y !== encounter.patientLocation!.y) &&
          !blockedDoorTiles.has(`${point.x},${point.y}`),
      )
      .sort(
        (left, right) =>
          left.y - right.y || left.x - right.x,
      );
    if (destinations.length === 0) {
      continue;
    }
    const target =
      destinations[
        deterministicInteger(
          state.campaignSeed,
          RANDOM_STREAMS.environment,
          `${encounter.id}:idle-destination:${state.facilityTick}`,
          destinations.length,
        )
      ]!;
    const outboundPath = facilityPath(
      state,
      context,
      encounter.patientLocation,
      target,
    );
    if (outboundPath.length > 1) {
      const currentWaitingSeat =
        room.roomDefinitionId === "room.waiting" &&
        getRoomWaitingAnchors(room, definition).some(
          (anchor) =>
            anchor.x === encounter.patientLocation!.x &&
            anchor.y === encounter.patientLocation!.y,
        )
          ? { ...encounter.patientLocation }
          : null;
      const returnPath = currentWaitingSeat
        ? facilityPath(
            state,
            context,
            target,
            currentWaitingSeat,
          )
        : [];
      const idlePath =
        currentWaitingSeat && returnPath.length > 1
          ? joinPaths(outboundPath, returnPath)
          : outboundPath;
      startPatientMovement(
        state,
        context,
        encounter,
        "idle_within_room",
        idlePath,
        encounter.assignedRoomInstanceId,
      );
    }
  }
}

function reduceAdvanceTick(
  state: GameState,
  command: Extract<GameCommand, { type: "ADVANCE_TICK" }>,
  context: DomainContext,
): GameState {
  const next = clonePlain(state);
  if (next.paused) {
    return recordReceipt(
      next,
      command,
      "applied",
      "Facility time remains paused; no tick advanced.",
    );
  }
  next.facilityTick += 1;
  const operatingTicksPerDay =
    (context.balanceRelease.clock.dayEndHour -
      context.balanceRelease.clock.dayStartHour) *
    60;
  if (next.facilityTick % operatingTicksPerDay === 0) {
    const dayNumber = Math.floor(next.facilityTick / operatingTicksPerDay) + 1;
    next.emergencyGlp1.dayNumber = dayNumber;
    next.emergencyGlp1.usesToday = 0;
    next.emergencyGlp1.lastFlavorMessage = null;
    appendEvent(next, {
      id: `event.day-rollover.${dayNumber}`,
      type: "day_rollover",
      facilityTick: next.facilityTick,
      encounterId: null,
      message: `Day ${dayNumber} begins at 8 AM.`,
      priority: "informational",
      definitionId: "event.facility.day-rollover",
      target: {
        kind: "campaign",
        id: next.campaignId,
      },
    });
  }

  advancePatientMovements(next, context);
  maybeStartPatientIdleMovements(next, context);
  advanceAmbientPedestrians(next, context);

  for (const encounter of Object.values(next.encounters)) {
    if (
      encounter.lifecycle !== "active_pending_result" ||
      !encounter.pendingResult ||
      encounter.pendingResult.deliveredAtTick !== null
    ) {
      continue;
    }
    ensureLegacyOffsiteTravel(next, encounter, context);
    beginPendingResultTravel(next, encounter, context);
    const offsiteTravel = encounter.pendingResult.offsiteTravel;
    if (
      offsiteTravel &&
      encounter.patientMovement === null &&
      encounter.patientLocation === null &&
      next.facilityTick >= offsiteTravel.returnStartTick &&
      encounter.pendingResult.offsiteReturnStartedAtTick === null
    ) {
      encounter.pendingResult.offsiteReturnStartedAtTick =
        next.facilityTick;
      const entrance = getPublicEntrance(next, context);
      startPatientMovement(
        next,
        context,
        encounter,
        "returning_from_offsite_testing",
        offsiteTravel.returnPath,
        entrance?.room.id ?? null,
      );
    }
  }

  for (const encounter of Object.values(next.encounters)) {
    if (
      encounter.lifecycle === "active_pending_result" &&
      encounter.pendingResult &&
      encounter.pendingResult.deliveredAtTick === null &&
      encounter.pendingResult.dueTick <= next.facilityTick
    ) {
      if (
        encounter.patientMovement?.kind ===
        "returning_from_offsite_testing"
      ) {
        continue;
      }
      if (
        encounter.pendingResult.offsiteTravel &&
        (encounter.pendingResult.offsiteReturnStartedAtTick === null ||
          encounter.patientLocation === null)
      ) {
        continue;
      }
      encounter.pendingResult.deliveredAtTick = next.facilityTick;
      if (encounter.pendingResult.patientTravel) {
        encounter.patientLocation =
          encounter.pendingResult.patientTravel.returnPath.at(-1) ??
          encounter.patientLocation;
        encounter.assignedRoomInstanceId =
          encounter.pendingResult.patientTravel.originRoomInstanceId;
      }
      const completedStep =
        encounter.steps[encounter.pendingResult.originatingNodeIndex];
      if (
        !completedStep ||
        completedStep.decisionNodeId !==
          encounter.frozenCase.decisionNodes[
            encounter.pendingResult.originatingNodeIndex
          ]?.id
      ) {
        throw new Error("Pending result does not match encounter step history.");
      }
      completedStep.result = clonePlain(encounter.pendingResult);
      completedStep.status = "completed";
      encounter.deliveredResultNarratives.push(
        encounter.pendingResult.resultNarrative,
      );
      encounter.currentNodeIndex += 1;
      encounter.steps[encounter.currentNodeIndex]!.status = "action_required";
      encounter.lifecycle = "active_action_required";
      const completedRoute = context.balanceRelease.services
        .flatMap((service) => service.routes)
        .find((route) => route.id === encounter.pendingResult?.routeId);
      const configuredResultSatisfactionDelta =
        completedRoute?.satisfactionOnResult ?? 0;
      if (configuredResultSatisfactionDelta !== 0) {
        applyPatientSatisfactionDelta(
          encounter,
          configuredResultSatisfactionDelta,
          encounter.pendingResult.resultTypeId.includes("xray")
            ? "imaging_unavailable"
            : "general",
          next.facilityTick,
        );
      }
      encounter.idleWaitingSinceTick =
        next.openChartEncounterId === encounter.id
          ? null
          : next.facilityTick;
      encounter.lastSatisfactionDecayAtTick = next.facilityTick;
      if (next.openChartEncounterId !== encounter.id) {
        beginPatientFeedAttention(
          encounter,
          "result_ready",
          next.facilityTick,
        );
      }
    }
  }

  const satisfaction = context.balanceRelease.patientSatisfaction;
  const hasWaitingRoom = next.rooms.some(
    (room) => room.roomDefinitionId === "room.waiting",
  );
  for (const encounter of Object.values(next.encounters)) {
    if (
      (encounter.lifecycle !== "waiting_unopened" &&
        encounter.lifecycle !== "active_action_required") ||
      encounter.waiting.patienceExempt ||
      encounter.idleWaitingSinceTick === null ||
      next.openChartEncounterId === encounter.id ||
      (encounter.patientMovement !== null &&
        encounter.patientMovement.kind !== "idle_within_room")
    ) {
      continue;
    }
    const graceEndsAt =
      encounter.idleWaitingSinceTick + satisfaction.idleGraceMinutes;
    const decayBaseTick = Math.max(
      graceEndsAt,
      encounter.lastSatisfactionDecayAtTick,
    );
    const elapsedSinceDecayBase = next.facilityTick - decayBaseTick;
    if (elapsedSinceDecayBase < satisfaction.decayIntervalMinutes) {
      continue;
    }
    const intervals = Math.floor(
      elapsedSinceDecayBase / satisfaction.decayIntervalMinutes,
    );
    const baseDecay = satisfaction.decayPerInterval * intervals;
    const decay =
      encounter.lifecycle === "waiting_unopened" && !hasWaitingRoom
        ? Math.max(
            1,
            Math.round(
              (baseDecay *
                satisfaction.sidewalkDecayMultiplierPercent) /
                100,
            ),
          )
        : baseDecay;
    applyPatientSatisfactionDelta(
      encounter,
      -baseDecay,
      "excessive_waiting",
      next.facilityTick,
    );
    const missingWaitingRoomDecay = Math.max(0, decay - baseDecay);
    if (missingWaitingRoomDecay > 0) {
      applyPatientSatisfactionDelta(
        encounter,
        -missingWaitingRoomDecay,
        "missing_amenities",
        next.facilityTick,
      );
    }
    encounter.lastSatisfactionDecayAtTick =
      decayBaseTick +
      intervals * satisfaction.decayIntervalMinutes;

    for (const threshold of satisfaction.warningThresholds) {
      if (
        encounter.patientSatisfaction <= threshold &&
        !encounter.satisfactionWarningsShown.includes(threshold)
      ) {
        encounter.satisfactionWarningsShown.push(threshold);
        appendEvent(next, {
          id: `event.patience-warning.${encounter.id}.${threshold}`,
          type: "patience_warning",
          facilityTick: next.facilityTick,
          encounterId: encounter.id,
          message: `${encounter.patientDisplayName} is waiting - ${encounter.patientSatisfaction}% satisfaction.`,
          priority: threshold <= 20 ? "critical" : "action_required",
          definitionId: "alert.patient.patience",
          target: {
            kind: "encounter",
            id: encounter.id,
          },
        });
      }
    }

    if (
      encounter.patientSatisfaction <= encounter.walkoutThreshold ||
      encounter.patientSatisfaction === 0
    ) {
      encounter.idleWaitingSinceTick = null;
      clearPatientFeedAttention(encounter);
      if (next.openChartEncounterId === encounter.id) {
        next.openChartEncounterId = null;
      }
      if (next.attendedEncounterId === encounter.id) {
        next.attendedEncounterId = null;
      }
      const exitPath = encounter.patientLocation
        ? pathFromLocationToOffscreen(
            next,
            context,
            encounter.patientLocation,
            encounter.id,
          )
        : [];
      const exitDuration = startPatientMovement(
        next,
        context,
        encounter,
        "leaving_after_walkout",
        exitPath,
        null,
      );
      if (exitDuration === 0) {
        continue;
      }
      appendEvent(next, {
        id: `event.patient-leaving.${encounter.id}`,
        type: "patience_warning",
        facilityTick: next.facilityTick,
        encounterId: encounter.id,
        message: `${encounter.patientDisplayName} is leaving the clinic.`,
        priority: "critical",
        definitionId: "alert.patient.leaving",
        target: {
          kind: "encounter",
          id: encounter.id,
        },
      });
    }
  }

  applyOperatingExpenses(next, context);
  maybeAssignReceptionistWaterRefill(next, context);
  advanceEmployeeMovement(next, context);
  advanceEmployeeFacilityTasks(next, context);
  advanceFounderActivity(next, context);
  drainWaterCooler(next, context);
  maybeSpawnLitter(next, context);
  maybeAdmitAutomaticPatient(
    next,
    context,
    command.advancedAtRealMs ??
      next.createdAtRealMs + next.facilityTick * 60_000,
  );
  maybeEmitDelayedPatientAttention(next);
  synchronizeFacilityConditionOccurrences(next, context);
  synchronizeFacilityOperationalAlertOccurrences(next, context);
  maybeEmitAmbientMessage(next);

  return recordReceipt(next, command, "applied", "Facility time advanced once.");
}

function reducePlaceRoom(
  state: GameState,
  command: Extract<GameCommand, { type: "PLACE_ROOM" }>,
  context: DomainContext,
): GameState {
  const definition = getRoomDefinition(command.roomDefinitionId, context);
  if (!definition) {
    return rejectCommand(state, command, "The room definition does not exist.");
  }
  if (definition.unlockFacilityLevel > state.facilityLevel) {
    return rejectCommand(
      state,
      command,
      `${definition.displayName} unlocks at Level ${definition.unlockFacilityLevel}.`,
    );
  }
  const existingInstanceCount = state.rooms.filter(
    (room) => room.roomDefinitionId === definition.id,
  ).length;
  if (
    definition.maximumInstances !== null &&
    existingInstanceCount >= definition.maximumInstances
  ) {
    return rejectCommand(
      state,
      command,
      `${definition.displayName} has reached its maximum of ${definition.maximumInstances}.`,
    );
  }
  const placedRoomTypes = new Set(
    state.rooms.map((room) => room.roomDefinitionId),
  );
  const missingDependency = definition.requiredRoomDefinitionIds.find(
    (requiredId) => !placedRoomTypes.has(requiredId),
  );
  if (missingDependency) {
    const required = getRoomDefinition(missingDependency, context);
    return rejectCommand(
      state,
      command,
      `Build ${required?.displayName ?? missingDependency} first.`,
    );
  }
  if (
    !Number.isInteger(command.x) ||
    !Number.isInteger(command.y) ||
    command.x < 0 ||
    command.y < 0
  ) {
    return rejectCommand(state, command, "Room coordinates must be grid cells.");
  }
  if (state.rooms.some((room) => room.id === command.roomId)) {
    return rejectCommand(state, command, "That room instance ID already exists.");
  }
  const orientation = command.orientation ?? 0;
  if (
    orientation !== 0 &&
    orientation !== 90 &&
    orientation !== 180 &&
    orientation !== 270
  ) {
    return rejectCommand(
      state,
      command,
      "Rooms may rotate only in 90-degree steps.",
    );
  }
  const facility = context.balanceRelease.facility;
  const placedRoom: PlacedRoom = {
    id: command.roomId,
    roomDefinitionId: command.roomDefinitionId,
    x: command.x,
    y: command.y,
    orientation,
    doorSide: null,
    upgradeLevel: 1,
    cleanliness: 100,
  };
  if (
    !isInsideFacility(
      placedRoom,
      definition,
      facility.gridWidth,
      facility.gridHeight,
    )
  ) {
    return rejectCommand(state, command, "The room does not fit inside the facility.");
  }
  const overlaps = state.rooms.some((placedRoom) => {
    const placedDefinition = getRoomDefinition(
      placedRoom.roomDefinitionId,
      context,
    );
    return (
      placedDefinition !== null &&
      roomsOverlap(
        placedRoom,
        placedDefinition,
        {
          id: command.roomId,
          roomDefinitionId: command.roomDefinitionId,
          x: command.x,
          y: command.y,
          orientation,
          doorSide: null,
          upgradeLevel: 1,
          cleanliness: 100,
        },
        definition,
      )
    );
  });
  if (overlaps) {
    return rejectCommand(state, command, "The room overlaps an existing room.");
  }
  if (state.cash < definition.constructionCost) {
    return rejectCommand(state, command, "There is not enough cash for this room.");
  }
  const next = clonePlain(state);
  next.rooms.push(placedRoom);
  adjustCash(next, -definition.constructionCost);
  const successDefinitionId =
    definition.id === "room.waiting"
      ? "alert.success.waiting-room-constructed"
      : definition.id === "room.xray"
        ? "alert.success.xray-constructed"
        : null;
  const renderedSuccess = successDefinitionId
    ? renderPrototypeAlert(successDefinitionId, {
        room_name: definition.displayName,
      })
    : null;
  appendEvent(next, {
    id: `event.room-placed.${command.roomId}`,
    type: "room_placed",
    facilityTick: next.facilityTick,
    encounterId: null,
    message:
      renderedSuccess?.body ?? `${definition.displayName} placed.`,
    priority: "informational",
    definitionId:
      renderedSuccess?.definitionId ?? "alert.facility.room-placed",
    ...(renderedSuccess
      ? {
          alertCategory: "success" as const,
          alertVariantId: renderedSuccess.variantId,
        }
      : {}),
    target: {
      kind: "room",
      id: command.roomId,
    },
  });
  return recordReceipt(next, command, "applied", "Room placed and cash deducted once.");
}

function reduceSellRoom(
  state: GameState,
  command: Extract<GameCommand, { type: "SELL_ROOM" }>,
  context: DomainContext,
): GameState {
  const room = state.rooms.find((candidate) => candidate.id === command.roomId);
  if (!room) {
    return rejectCommand(state, command, "That room does not exist.");
  }
  const definition = getRoomDefinition(room.roomDefinitionId, context);
  if (!definition) {
    return rejectCommand(state, command, "The room definition does not exist.");
  }
  const facility = context.balanceRelease.facility;
  if (facility.protectedRoomDefinitionIds.includes(room.roomDefinitionId)) {
    return rejectCommand(state, command, "The Front Desk cannot be sold.");
  }
  if (
    state.employees.some(
      (employee) => employee.homeRoomInstanceId === room.id,
    )
  ) {
    return rejectCommand(
      state,
      command,
      "Reassign employees before selling their home room.",
    );
  }
  if (roomHasActiveCharacterOrRoute(state, room, context)) {
    return rejectCommand(
      state,
      command,
      "Wait for every character and reserved route to clear this room before selling it.",
    );
  }

  const remainingRooms = state.rooms.filter(
    (candidate) => candidate.id !== room.id,
  );
  const remainingDefinitionIds = new Set(
    remainingRooms.map((candidate) => candidate.roomDefinitionId),
  );
  for (const remainingRoom of remainingRooms) {
    const remainingDefinition = getRoomDefinition(
      remainingRoom.roomDefinitionId,
      context,
    );
    const missing = remainingDefinition?.requiredRoomDefinitionIds.find(
      (requiredId) => !remainingDefinitionIds.has(requiredId),
    );
    if (missing) {
      return rejectCommand(
        state,
        command,
        `${remainingDefinition?.displayName ?? "Another room"} still depends on this room type.`,
      );
    }
  }
  for (const employee of state.employees) {
    const role = getStaffRoleDefinition(employee.staffRoleDefinitionId, context);
    const missing = role?.requiredRoomDefinitionIds.find(
      (requiredId) => !remainingDefinitionIds.has(requiredId),
    );
    if (missing) {
      return rejectCommand(
        state,
        command,
        `${employee.displayName} still requires this room type.`,
      );
    }
  }
  const upgradeInvestment = definition.upgradeCosts
    .slice(0, Math.max(0, room.upgradeLevel - 1))
    .reduce((total, cost) => total + cost, 0);
  const refund = Math.floor(
    ((definition.constructionCost + upgradeInvestment) *
      facility.roomResalePercent) /
      100,
  );
  const next = clonePlain(state);
  next.rooms = remainingRooms;
  next.doors = next.doors.filter((door) => door.roomId !== room.id);
  adjustCash(next, refund);
  appendEvent(next, {
    id: `event.room-sold.${room.id}.${command.operationId}`,
    type: "room_sold",
    facilityTick: next.facilityTick,
    encounterId: null,
    message: `${definition.displayName} sold for $${refund}.`,
  });
  return recordReceipt(
    next,
    command,
    "applied",
    `${definition.displayName} sold for 25% of invested construction costs.`,
  );
}

function reduceUpgradeRoom(
  state: GameState,
  command: Extract<GameCommand, { type: "UPGRADE_ROOM" }>,
  context: DomainContext,
): GameState {
  const room = state.rooms.find((candidate) => candidate.id === command.roomId);
  if (!room) {
    return rejectCommand(state, command, "That room does not exist.");
  }
  const definition = getRoomDefinition(room.roomDefinitionId, context);
  if (!definition) {
    return rejectCommand(state, command, "The room definition does not exist.");
  }
  if (room.upgradeLevel >= definition.maximumUpgradeLevel) {
    return rejectCommand(
      state,
      command,
      `${definition.displayName} is already at Upgrade Level ${room.upgradeLevel}.`,
    );
  }
  const upgradeCost = definition.upgradeCosts[room.upgradeLevel - 1];
  if (upgradeCost === undefined) {
    return rejectCommand(
      state,
      command,
      "The next upgrade cost is not configured.",
    );
  }
  if (state.cash < upgradeCost) {
    return rejectCommand(state, command, "There is not enough cash for this upgrade.");
  }
  const next = clonePlain(state);
  const nextRoom = next.rooms.find((candidate) => candidate.id === room.id)!;
  nextRoom.upgradeLevel = (nextRoom.upgradeLevel + 1) as PlacedRoom["upgradeLevel"];
  adjustCash(next, -upgradeCost);
  const renderedSuccess = renderPrototypeAlert(
    "alert.success.room-upgraded",
    {
      room_name: definition.displayName,
      room_level: nextRoom.upgradeLevel,
    },
  );
  appendEvent(next, {
    id: `event.room-upgraded.${room.id}.${nextRoom.upgradeLevel}`,
    type: "room_upgraded",
    facilityTick: next.facilityTick,
    encounterId: null,
    message: renderedSuccess.body,
    priority: "informational",
    definitionId: renderedSuccess.definitionId,
    alertCategory: "success",
    alertVariantId: renderedSuccess.variantId,
    target: {
      kind: "room",
      id: room.id,
    },
  });
  return recordReceipt(
    next,
    command,
    "applied",
    `${definition.displayName} upgraded for $${upgradeCost}.`,
  );
}

function reduceMoveRoom(
  state: GameState,
  command: Extract<GameCommand, { type: "MOVE_ROOM" }>,
  context: DomainContext,
): GameState {
  const room = state.rooms.find((candidate) => candidate.id === command.roomId);
  if (!room) {
    return rejectCommand(state, command, "That room does not exist.");
  }
  if (
    context.balanceRelease.facility.protectedRoomDefinitionIds.includes(
      room.roomDefinitionId,
    )
  ) {
    return rejectCommand(
      state,
      command,
      "The Front Desk and public entrance remain anchored to the sidewalk.",
    );
  }
  const definition = getRoomDefinition(room.roomDefinitionId, context);
  if (
    !definition ||
    !Number.isSafeInteger(command.x) ||
    !Number.isSafeInteger(command.y)
  ) {
    return rejectCommand(state, command, "Choose a valid grid location.");
  }
  if (roomHasActiveCharacterOrRoute(state, room, context)) {
    return rejectCommand(
      state,
      command,
      "Wait for every character and reserved route to clear this room before moving it.",
    );
  }
  const candidate: PlacedRoom = {
    ...room,
    x: command.x,
    y: command.y,
  };
  const facility = context.balanceRelease.facility;
  if (
    !isInsideFacility(
      candidate,
      definition,
      facility.gridWidth,
      facility.gridHeight,
    )
  ) {
    return rejectCommand(state, command, "The room does not fit inside the facility.");
  }
  const overlap = state.rooms.some((other) => {
    if (other.id === room.id) {
      return false;
    }
    const otherDefinition = getRoomDefinition(
      other.roomDefinitionId,
      context,
    );
    return (
      otherDefinition !== null &&
      roomsOverlap(candidate, definition, other, otherDefinition)
    );
  });
  if (overlap) {
    return rejectCommand(state, command, "The room overlaps an existing room.");
  }
  const next = clonePlain(state);
  const nextRoom = next.rooms.find((candidateRoom) => candidateRoom.id === room.id)!;
  nextRoom.x = command.x;
  nextRoom.y = command.y;
  appendEvent(next, {
    id: `event.room-moved.${room.id}.${command.operationId}`,
    type: "room_moved",
    facilityTick: next.facilityTick,
    encounterId: null,
    message: `${definition.displayName} moved. Check its doors before returning to play.`,
    priority: "informational",
    target: { kind: "room", id: room.id },
  });
  return recordReceipt(next, command, "applied", `${definition.displayName} moved.`);
}

function reduceRotateRoom(
  state: GameState,
  command: Extract<GameCommand, { type: "ROTATE_ROOM" }>,
  context: DomainContext,
): GameState {
  const room = state.rooms.find((candidate) => candidate.id === command.roomId);
  if (!room) {
    return rejectCommand(state, command, "That room does not exist.");
  }
  if (
    context.balanceRelease.facility.protectedRoomDefinitionIds.includes(
      room.roomDefinitionId,
    )
  ) {
    return rejectCommand(
      state,
      command,
      "The Front Desk orientation is anchored to the sidewalk.",
    );
  }
  const definition = getRoomDefinition(room.roomDefinitionId, context);
  if (!definition) {
    return rejectCommand(state, command, "The room definition does not exist.");
  }
  if (roomHasActiveCharacterOrRoute(state, room, context)) {
    return rejectCommand(
      state,
      command,
      "Wait for every character and reserved route to clear this room before rotating it.",
    );
  }
  const orientation = ((room.orientation + 90) % 360) as PlacedRoom["orientation"];
  const candidate: PlacedRoom = { ...room, orientation };
  const facility = context.balanceRelease.facility;
  if (
    !isInsideFacility(
      candidate,
      definition,
      facility.gridWidth,
      facility.gridHeight,
    )
  ) {
    return rejectCommand(
      state,
      command,
      "The rotated room does not fit inside the facility.",
    );
  }
  const overlap = state.rooms.some((other) => {
    if (other.id === room.id) {
      return false;
    }
    const otherDefinition = getRoomDefinition(
      other.roomDefinitionId,
      context,
    );
    return (
      otherDefinition !== null &&
      roomsOverlap(candidate, definition, other, otherDefinition)
    );
  });
  if (overlap) {
    return rejectCommand(
      state,
      command,
      "The rotated room overlaps an existing room.",
    );
  }
  const next = clonePlain(state);
  const nextRoom = next.rooms.find((candidateRoom) => candidateRoom.id === room.id)!;
  nextRoom.orientation = orientation;
  for (const door of next.doors.filter((candidateDoor) => candidateDoor.roomId === room.id)) {
    door.side = rotateDirection(door.side, 90);
  }
  nextRoom.doorSide =
    next.doors.find(
      (door) => door.roomId === room.id && !door.exterior,
    )?.side ?? null;
  appendEvent(next, {
    id: `event.room-rotated.${room.id}.${command.operationId}`,
    type: "room_rotated",
    facilityTick: next.facilityTick,
    encounterId: null,
    message: `${definition.displayName} rotated 90 degrees.`,
    priority: "informational",
    target: { kind: "room", id: room.id },
  });
  return recordReceipt(next, command, "applied", `${definition.displayName} rotated.`);
}

function reducePlaceDoor(
  state: GameState,
  command: Extract<GameCommand, { type: "PLACE_DOOR" }>,
  context: DomainContext,
): GameState {
  if (state.doors.some((door) => door.id === command.doorId)) {
    return rejectCommand(state, command, "That door ID already exists.");
  }
  const door: DoorState = {
    id: command.doorId,
    roomId: command.roomId,
    side: command.side,
    offset: command.offset,
    exterior: command.exterior === true,
  };
  const facility = context.balanceRelease.facility;
  const validation = validateDoorPlacement(
    door,
    state.rooms,
    state.doors,
    (definitionId) => getRoomDefinition(definitionId, context),
    facility.gridWidth,
    facility.gridHeight,
    new Set(facility.protectedRoomDefinitionIds),
  );
  if (!validation.valid) {
    return rejectCommand(
      state,
      command,
      validation.reason ?? "That door cannot be placed there.",
    );
  }
  const next = clonePlain(state);
  next.doors.push(door);
  const nextRoom = next.rooms.find((room) => room.id === door.roomId);
  if (nextRoom && !door.exterior && nextRoom.doorSide === null) {
    nextRoom.doorSide = door.side;
  }
  appendEvent(next, {
    id: `event.door-placed.${door.id}`,
    type: "door_placed",
    facilityTick: next.facilityTick,
    encounterId: null,
    message: "Door placed.",
    priority: "informational",
    target: { kind: "room", id: door.roomId },
  });
  return recordReceipt(next, command, "applied", "Door placed for $0.");
}

function reduceRemoveDoor(
  state: GameState,
  command: Extract<GameCommand, { type: "REMOVE_DOOR" }>,
  context: DomainContext,
): GameState {
  const door = state.doors.find((candidate) => candidate.id === command.doorId);
  if (!door) {
    return rejectCommand(state, command, "That door does not exist.");
  }
  if (door.exterior) {
    return rejectCommand(
      state,
      command,
      "The public Front Desk entrance cannot be removed.",
    );
  }
  const room = state.rooms.find(
    (candidate) => candidate.id === door.roomId,
  );
  if (room && roomHasActiveCharacterOrRoute(state, room, context)) {
    return rejectCommand(
      state,
      command,
      "Wait for every character and reserved route to clear this doorway before removing it.",
    );
  }
  const next = clonePlain(state);
  next.doors = next.doors.filter((candidate) => candidate.id !== door.id);
  const nextRoom = next.rooms.find((room) => room.id === door.roomId);
  if (nextRoom) {
    nextRoom.doorSide =
      next.doors.find(
        (candidate) =>
          candidate.roomId === door.roomId && !candidate.exterior,
      )?.side ?? null;
  }
  appendEvent(next, {
    id: `event.door-removed.${door.id}.${command.operationId}`,
    type: "door_removed",
    facilityTick: next.facilityTick,
    encounterId: null,
    message: "Door removed.",
    priority: "informational",
    target: { kind: "room", id: door.roomId },
  });
  return recordReceipt(next, command, "applied", "Door removed.");
}

function reduceAdmitPatient(
  state: GameState,
  command: Extract<GameCommand, { type: "ADMIT_PATIENT" }>,
  context: DomainContext,
): GameState {
  if (state.encounters[command.encounterId]) {
    return rejectCommand(state, command, "That encounter ID already exists.");
  }
  const clinicalCase = findCase(context, command.caseId);
  if (!clinicalCase) {
    return rejectCommand(state, command, "The clinical case does not exist.");
  }
  if (clinicalCase.earliestFacilityStage > state.facilityLevel) {
    return rejectCommand(
      state,
      command,
      `This patient becomes eligible at Level ${clinicalCase.earliestFacilityStage}.`,
    );
  }
  const capabilities = getCurrentCapabilities(state, context);
  const missingCapabilityId = clinicalCase.requiredCapabilityIds.find(
    (capabilityId) => !capabilities.has(capabilityId),
  );
  if (missingCapabilityId) {
    return rejectCommand(
      state,
      command,
      `This patient requires unavailable clinic capability ${missingCapabilityId}.`,
    );
  }
  if (command.arrivalClass === "tutorial" && !clinicalCase.tutorialEligible) {
    return rejectCommand(state, command, "This case is not tutorial eligible.");
  }
  if (
    command.arrivalClass === "progression_critical" &&
    !command.protectedGuaranteeId
  ) {
    return rejectCommand(
      state,
      command,
      "A progression-critical admission needs a guarantee ID.",
    );
  }
  if (!canAdmitPatient(state, command.arrivalClass, context)) {
    return rejectCommand(
      state,
      command,
      command.arrivalClass === "routine"
        ? "At capacity - new routine patients are paused."
        : "All routine and reserved workload slots are occupied.",
    );
  }

  const next = clonePlain(state);
  const guaranteeId = command.protectedGuaranteeId ?? null;
  next.encounters[command.encounterId] = createEncounter(next, context, {
    encounterId: command.encounterId,
    clinicalCase,
    patientDisplayName: command.patientDisplayName,
    arrivalClass: command.arrivalClass,
    protectedGuaranteeId: guaranteeId,
  });
  if (guaranteeId) {
    next.criticalGuarantees[guaranteeId] = "in_progress";
  }
  return recordReceipt(
    next,
    command,
    "applied",
    "Patient is approaching the clinic.",
  );
}

function reduceHireStaff(
  state: GameState,
  command: Extract<GameCommand, { type: "HIRE_STAFF" }>,
  context: DomainContext,
): GameState {
  const definition = getStaffRoleDefinition(
    command.staffRoleDefinitionId,
    context,
  );
  if (!definition) {
    return rejectCommand(state, command, "The staff role does not exist.");
  }
  if (definition.unlockFacilityLevel > state.facilityLevel) {
    return rejectCommand(
      state,
      command,
      `${definition.displayName} unlocks at Level ${definition.unlockFacilityLevel}.`,
    );
  }
  if (state.employees.some((employee) => employee.id === command.employeeId)) {
    return rejectCommand(state, command, "That employee ID already exists.");
  }
  const employeesInRole = state.employees.filter(
    (employee) => employee.staffRoleDefinitionId === definition.id,
  );
  if (employeesInRole.length >= definition.maximumEmployees) {
    return rejectCommand(
      state,
      command,
      `${definition.displayName} staffing is at its ${definition.maximumEmployees}/${definition.maximumEmployees} prototype maximum.`,
    );
  }
  const placedRoomTypes = new Set(
    state.rooms.map((room) => room.roomDefinitionId),
  );
  const missingRoom = definition.requiredRoomDefinitionIds.find(
    (roomDefinitionId) => !placedRoomTypes.has(roomDefinitionId),
  );
  if (missingRoom) {
    const room = getRoomDefinition(missingRoom, context);
    return rejectCommand(
      state,
      command,
      `Build ${room?.displayName ?? missingRoom} before hiring this role.`,
    );
  }
  if (state.cash < definition.hiringCost) {
    return rejectCommand(state, command, "There is not enough cash for this hire.");
  }

  const next = clonePlain(state);
  const generatedName = createStaffDisplayName(
    next.campaignSeed,
    command.employeeId,
  );
  const requestedName = command.displayName?.trim();
  const baseName = requestedName || generatedName;
  const duplicateNameCount = next.employees.filter(
    (candidate) => candidate.displayName === baseName,
  ).length;
  const displayName =
    duplicateNameCount === 0
      ? baseName
      : `${baseName} ${duplicateNameCount + 1}`;
  const arrival = getEmployeeArrival(
    next,
    definition.id,
    command.employeeId,
    context,
  );
  if (!arrival) {
    return rejectCommand(
      state,
      command,
      "The employee has no connected path from the Front Desk to the required room.",
    );
  }
  const employee: EmployeeState = {
    id: command.employeeId,
    staffRoleDefinitionId: definition.id,
    displayName,
    appearance: createPixelAppearance(
      next.campaignSeed,
      "staff",
      command.employeeId,
      roleStyleForStaffDefinition(definition.id),
    ),
    hiredAtFacilityTick: next.facilityTick,
    salaryPerExpenseInterval: definition.salaryPerExpenseInterval,
    morale: definition.baseMorale,
    trainingLevel: 1,
    homeRoomInstanceId: arrival.homeRoomInstanceId,
    location: arrival.location,
    path: arrival.path,
    pathIndex: 0,
    lastMovedAtFacilityTick: next.facilityTick,
    lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: getNextIdleActionTick(
      next,
      context,
      command.employeeId,
    ),
    facilityTask: null,
  };
  next.employees.push(employee);
  adjustCash(next, -definition.hiringCost);
  const successDefinitionId =
    definition.id === "staff.receptionist"
      ? "alert.success.receptionist-hired"
      : definition.id === "staff.imaging_technician"
        ? "alert.success.imaging-technician-hired"
        : null;
  const renderedSuccess = successDefinitionId
    ? renderPrototypeAlert(successDefinitionId, {
        employee_name: employee.displayName,
      })
    : null;
  appendEvent(next, {
    id: `event.staff-hired.${employee.id}`,
    type: "staff_hired",
    facilityTick: next.facilityTick,
    encounterId: null,
    message:
      renderedSuccess?.body ??
      `${employee.displayName} hired as ${definition.displayName}.`,
    priority: "informational",
    definitionId:
      renderedSuccess?.definitionId ?? "alert.staff.hired",
    ...(renderedSuccess
      ? {
          alertCategory: "success" as const,
          alertVariantId: renderedSuccess.variantId,
        }
      : {}),
    target: {
      kind: "employee",
      id: employee.id,
    },
  });
  return recordReceipt(next, command, "applied", "Employee hired.");
}

function reduceSetEmployeeSalary(
  state: GameState,
  command: Extract<GameCommand, { type: "SET_EMPLOYEE_SALARY" }>,
  context: DomainContext,
): GameState {
  const employee = state.employees.find(
    (candidate) => candidate.id === command.employeeId,
  );
  if (!employee) {
    return rejectCommand(state, command, "That employee does not exist.");
  }
  const role = getStaffRoleDefinition(employee.staffRoleDefinitionId, context);
  if (!role) {
    return rejectCommand(state, command, "The staff role does not exist.");
  }
  const salary = command.salaryPerExpenseInterval;
  if (
    !Number.isInteger(salary) ||
    salary < role.minimumSalaryPerExpenseInterval ||
    salary > role.maximumSalaryPerExpenseInterval ||
    (salary - role.minimumSalaryPerExpenseInterval) %
      role.salaryAdjustmentStep !==
      0
  ) {
    return rejectCommand(
      state,
      command,
      `Salary must be $${role.minimumSalaryPerExpenseInterval}-$${role.maximumSalaryPerExpenseInterval} in $${role.salaryAdjustmentStep} steps.`,
    );
  }
  const next = clonePlain(state);
  const nextEmployee = next.employees.find(
    (candidate) => candidate.id === employee.id,
  )!;
  nextEmployee.salaryPerExpenseInterval = salary;
  nextEmployee.morale = getEffectiveEmployeeMorale(nextEmployee, context);
  appendEvent(next, {
    id: `event.staff-salary.${employee.id}.${command.operationId}`,
    type: "staff_salary_changed",
    facilityTick: next.facilityTick,
    encounterId: null,
    message: `${employee.displayName}'s salary is now $${salary} per expense cycle; morale is ${nextEmployee.morale}%.`,
    priority: "informational",
    definitionId: "event.staff.salary-changed",
    target: {
      kind: "employee",
      id: employee.id,
    },
  });
  return recordReceipt(
    next,
    command,
    "applied",
    "Employee salary and morale updated.",
  );
}

function reduceFireEmployee(
  state: GameState,
  command: Extract<GameCommand, { type: "FIRE_EMPLOYEE" }>,
): GameState {
  const employee = state.employees.find(
    (candidate) => candidate.id === command.employeeId,
  );
  if (!employee) {
    return rejectCommand(state, command, "That employee does not exist.");
  }

  const next = clonePlain(state);
  next.employees = next.employees.filter(
    (candidate) => candidate.id !== command.employeeId,
  );
  if (
    next.environment.founderActivity?.kind === "praise_employee" &&
    next.environment.founderActivity.targetId === command.employeeId
  ) {
    next.environment.founderActivity = null;
  }
  appendEvent(next, {
    id: `event.staff-fired.${employee.id}.${command.operationId}`,
    type: "staff_fired",
    facilityTick: next.facilityTick,
    encounterId: null,
    message: `${employee.displayName} was fired. Payroll has one fewer opinion.`,
    priority: "informational",
    definitionId: "alert.staff.fired",
    target: {
      kind: "employee",
      id: employee.id,
    },
  });
  return recordReceipt(
    next,
    command,
    "applied",
    `${employee.displayName} was fired.`,
  );
}

function reduceLevelUp(
  state: GameState,
  command: Extract<GameCommand, { type: "LEVEL_UP" }>,
  context: DomainContext,
): GameState {
  const progression = getFacilityProgressionStatus(state, context);
  if (progression.nextFacilityLevel === null) {
    return rejectCommand(
      state,
      command,
      "Level 2 is outside this prototype and remains locked.",
    );
  }
  if (!progression.eligible) {
    return rejectCommand(
      state,
      command,
      "The current level requirements are not complete.",
    );
  }
  const next = clonePlain(state);
  next.facilityLevel = progression.nextFacilityLevel;
  next.clinicalXp = 0;
  next.nextRoutineArrivalTick = getNextRoutineArrivalTick(next, context);
  appendEvent(next, {
    id: `event.facility-level.${next.facilityLevel}`,
    type: "facility_level_advanced",
    facilityTick: next.facilityTick,
    encounterId: null,
    message: `Facility advanced to Level ${next.facilityLevel}.`,
    priority: "action_required",
    definitionId: "alert.progress.level-complete",
    target: {
      kind: "campaign",
      id: next.campaignId,
    },
  });
  return recordReceipt(next, command, "applied", "Facility level advanced.");
}

function reduceEmergencyGlp1Consultation(
  state: GameState,
  command: Extract<
    GameCommand,
    { type: "RUN_EMERGENCY_GLP1_CONSULTATION" }
  >,
  context: DomainContext,
): GameState {
  const status = getEmergencyGlp1Status(state, context);
  if (!status.eligible) {
    return rejectCommand(
      state,
      command,
      status.blockedReason ?? "Emergency consultation is unavailable.",
    );
  }

  const config = context.balanceRelease.emergencyGlp1;
  const next = clonePlain(state);
  if (next.emergencyGlp1.dayNumber !== status.dayNumber) {
    next.emergencyGlp1.dayNumber = status.dayNumber;
    next.emergencyGlp1.usesToday = 0;
    next.emergencyGlp1.lastFlavorMessage = null;
  }

  const useNumber = next.emergencyGlp1.usesToday + 1;
  next.emergencyGlp1.usesToday = useNumber;
  next.emergencyGlp1.totalUses += 1;
  next.emergencyGlp1.lastUsedAtFacilityTick = next.facilityTick;
  adjustCash(next, status.payment);

  let flavorMessage: string | null = null;
  if (useNumber >= config.sarcasmStartsAtUse) {
    const messageIndex =
      next.emergencyGlp1.sarcasmMessagesShown % config.sarcasmLines.length;
    flavorMessage = config.sarcasmLines[messageIndex]!;
    next.emergencyGlp1.sarcasmMessagesShown += 1;
  }
  next.emergencyGlp1.lastFlavorMessage = flavorMessage;

  const usefulMessage =
    `Emergency GLP-1 consultation completed: +$${status.payment}.` +
    (flavorMessage ? ` ${flavorMessage}` : "");
  appendEvent(next, {
    id: `event.emergency-glp1.${command.operationId}`,
    type: "emergency_glp1_consultation",
    facilityTick: next.facilityTick,
    encounterId: null,
    message: usefulMessage,
    priority: "informational",
    definitionId: "alert.finance.emergency-glp1-completed",
    target: {
      kind: "campaign",
      id: next.campaignId,
    },
    reward: {
      cashDelta: status.payment,
      learningXpDelta: 0,
      satisfactionDelta: 0,
    },
  });
  return recordReceipt(next, command, "applied", usefulMessage);
}

function beginFounderActivity(
  state: GameState,
  command: GameCommand,
  context: DomainContext,
  kind: NonNullable<
    GameState["environment"]["founderActivity"]
  >["kind"],
  targetId: string,
  destination: { x: number; y: number },
  message: string,
): GameState {
  if (
    state.environment.founderActivity &&
    state.environment.founderActivity.kind !== "walk_to_point"
  ) {
    return rejectCommand(
      state,
      command,
      "The founder is already completing another facility interaction.",
    );
  }
  const path = pathFromLocationToFacilityPoint(
    state,
    context,
    state.environment.founderLocation,
    destination,
  );
  if (path.length === 0) {
    return rejectCommand(
      state,
      command,
      "The founder cannot reach that destination through the current doors.",
    );
  }
  const next = clonePlain(state);
  next.environment.founderActivity = {
    kind,
    targetId,
    path,
    pathIndex: 0,
    lastMovedAtFacilityTick: next.facilityTick,
    workMinutesRemaining:
      context.balanceRelease.environment.founderInteractionMinutes,
  };
  return recordReceipt(next, command, "applied", message);
}

function getFounderWalkPath(
  state: GameState,
  context: DomainContext,
  requestedDestination: GridPoint,
): GridPoint[] {
  const facility = context.balanceRelease.facility;
  if (
    !Number.isSafeInteger(requestedDestination.x) ||
    !Number.isSafeInteger(requestedDestination.y) ||
    requestedDestination.x < 0 ||
    requestedDestination.x >= facility.gridWidth ||
    requestedDestination.y < 0 ||
    requestedDestination.y > facility.gridHeight
  ) {
    return [];
  }

  if (requestedDestination.y === facility.gridHeight) {
    return pathFromLocationToFacilityPoint(
      state,
      context,
      state.environment.founderLocation,
      requestedDestination,
    );
  }

  const candidates = state.rooms
    .flatMap((room) => {
      if (!pointInsideRoom(requestedDestination, room, context)) {
        return [];
      }
      const definition = getRoomDefinition(
        room.roomDefinitionId,
        context,
      );
      return definition
        ? getRoomNavigableTiles(room, definition, state.doors)
        : [];
    })
    .filter(
      (candidate, index, all) =>
        all.findIndex(
          (other) =>
            other.x === candidate.x && other.y === candidate.y,
        ) === index,
    )
    .sort(
      (left, right) =>
        Math.abs(left.x - requestedDestination.x) +
          Math.abs(left.y - requestedDestination.y) -
          (Math.abs(right.x - requestedDestination.x) +
            Math.abs(right.y - requestedDestination.y)) ||
        left.y - right.y ||
        left.x - right.x,
    );
  for (const candidate of candidates) {
    const path = pathFromLocationToFacilityPoint(
      state,
      context,
      state.environment.founderLocation,
      candidate,
    );
    if (path.length > 0) {
      return path;
    }
  }
  return [];
}

function reduceMoveFounder(
  state: GameState,
  command: Extract<GameCommand, { type: "MOVE_FOUNDER" }>,
  context: DomainContext,
): GameState {
  if (
    state.environment.founderActivity &&
    state.environment.founderActivity.kind !== "walk_to_point"
  ) {
    return rejectCommand(
      state,
      command,
      "The founder is already completing another facility interaction.",
    );
  }
  const path = getFounderWalkPath(
    state,
    context,
    command.destination,
  );
  if (path.length === 0) {
    return rejectCommand(
      state,
      command,
      "The founder cannot reach that spot through the current clinic layout.",
    );
  }

  const next = clonePlain(state);
  if (path.length === 1) {
    next.environment.founderLocation = { ...path[0]! };
    next.environment.founderActivity = null;
    return recordReceipt(
      next,
      command,
      "applied",
      "The founder is already there.",
    );
  }
  next.environment.founderActivity = {
    kind: "walk_to_point",
    targetId: `map.${path.at(-1)!.x}.${path.at(-1)!.y}`,
    path,
    pathIndex: 0,
    lastMovedAtFacilityTick: next.facilityTick,
    workMinutesRemaining: 0,
  };
  return recordReceipt(
    next,
    command,
    "applied",
    "The founder is walking there.",
  );
}

function reduceCollectLitter(
  state: GameState,
  command: Extract<GameCommand, { type: "COLLECT_LITTER" }>,
  context: DomainContext,
): GameState {
  const litter = state.environment.litterItems.find(
    (item) => item.id === command.litterId,
  );
  if (!litter) {
    return rejectCommand(state, command, "That litter is no longer present.");
  }
  const next = beginFounderActivity(
    state,
    command,
    context,
    "collect_litter",
    litter.id,
    litter.location,
    "The founder is walking over to pick up the litter.",
  );
  if (
    next.operationReceipts[command.operationId]?.status === "applied" &&
    next.environment.trashTeachingAcknowledgedAtTick === null
  ) {
    next.environment.trashTeachingAcknowledgedAtTick =
      next.facilityTick;
  }
  return next;
}

function reduceRefillWaterCooler(
  state: GameState,
  command: Extract<GameCommand, { type: "REFILL_WATER_COOLER" }>,
  context: DomainContext,
): GameState {
  if (
    state.employees.some(
      (employee) => employee.facilityTask?.kind === "refill_water",
    )
  ) {
    return rejectCommand(
      state,
      command,
      "The receptionist is already refilling the water cooler.",
    );
  }
  if (
    state.environment.waterCoolerFillPercent >
    context.balanceRelease.environment.waterCoolerLowThreshold
  ) {
    return rejectCommand(state, command, "The water cooler is already full.");
  }
  return beginFounderActivity(
    state,
    command,
    context,
    "refill_water",
    "water-cooler.front-desk",
    getWaterCoolerLocation(state, context),
    "The founder is walking over to refill the water cooler.",
  );
}

function reducePraiseEmployee(
  state: GameState,
  command: Extract<GameCommand, { type: "PRAISE_EMPLOYEE" }>,
  context: DomainContext,
): GameState {
  const employee = state.employees.find(
    (candidate) => candidate.id === command.employeeId,
  );
  if (!employee) {
    return rejectCommand(state, command, "That employee is unavailable.");
  }
  const cooldown = context.balanceRelease.environment.praiseCooldownMinutes;
  if (
    employee.lastPraisedAtFacilityTick !== null &&
    state.facilityTick - employee.lastPraisedAtFacilityTick < cooldown
  ) {
    const remaining =
      cooldown -
      (state.facilityTick - employee.lastPraisedAtFacilityTick);
    return rejectCommand(
      state,
      command,
      `${employee.displayName} can be praised again in ${remaining} min.`,
    );
  }
  return beginFounderActivity(
    state,
    command,
    context,
    "praise_employee",
    employee.id,
    employee.location,
    `The founder is walking over to praise ${employee.displayName}.`,
  );
}

export function createInitialGameState(
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
  options: CreateCampaignOptions = {},
): GameState {
  validateDomainContext(context);
  const createdAtRealMs = options.createdAtRealMs ?? 0;
  if (!Number.isSafeInteger(createdAtRealMs) || createdAtRealMs < 0) {
    throw new Error("Campaign creation needs a valid real-world timestamp.");
  }
  const campaignSeed = options.campaignSeed ?? "prototype-seed-0001";
  const founderName = options.founder?.displayName.trim() ?? "Founder";
  if (founderName.length === 0 || founderName.length > 60) {
    throw new Error("The founder name must contain between 1 and 60 characters.");
  }
  const initialRooms = context.balanceRelease.facility.initialRooms.map(
    (room) => ({
      id: room.id,
      roomDefinitionId: room.roomDefinitionId,
      x: room.x,
      y: room.y,
      orientation: room.orientation,
      doorSide: room.doorSide,
      upgradeLevel: room.upgradeLevel as PlacedRoom["upgradeLevel"],
      cleanliness: 100,
    }),
  );
  const founderRoom =
    initialRooms.find((room) =>
      context.balanceRelease.facility.protectedRoomDefinitionIds.includes(
        room.roomDefinitionId,
      ),
    ) ?? initialRooms[0]!;
  const founderRoomDefinition = getRoomDefinition(
    founderRoom.roomDefinitionId,
    context,
  );
  const founderLocation = founderRoomDefinition
    ? getRoomNavigationAnchor(
        founderRoom,
        founderRoomDefinition,
        "staff",
      )
    : { x: founderRoom.x, y: founderRoom.y };
  const state: GameState = {
    schemaVersion: 6,
    campaignId: options.campaignId ?? "campaign.local.prototype",
    campaignSeed,
    randomGeneratorVersion: RANDOMNESS_CONTRACT_VERSION,
    createdAtRealMs,
    founder: {
      displayName: founderName,
      headId: options.founder?.headId ?? "head.default",
      bodyId: options.founder?.bodyId ?? "body.default",
      appearance:
        options.founder?.appearance
          ? normalizePixelAppearance(
              options.founder.appearance,
              "founder",
            )
          : createPixelAppearance(
              campaignSeed,
              "staff",
              "founder",
              "founder",
            ),
    },
    clinicalReleaseId: context.clinicalRelease.id,
    balanceReleaseId: context.balanceRelease.id,
    schedulerPins: createSchedulerPins(
      context.balanceRelease.learning.parameterSetId,
    ),
    facilityLevel: 0,
    facilityTick: 0,
    paused: false,
    simulationSpeed: 1,
    cash: context.balanceRelease.facility.startingCash,
    cashCents: context.balanceRelease.facility.startingCash * 100,
    operatingAccrualSixtiethCents: 0,
    nextFinancialPostingTick:
      context.balanceRelease.economy.postingIntervalMinutes,
    advertisingLevel: 0,
    clinicalXp: 0,
    openChartEncounterId: null,
    attendedEncounterId: null,
    rooms: initialRooms,
    doors: [
      {
        id: "door.instance.front_entrance",
        roomId: "room.instance.founder_desk",
        side: "south",
        offset: 2,
        exterior: true,
      },
    ],
    employees: [],
    encounters: {},
    learningHistories: Object.fromEntries(
      context.clinicalRelease.concepts.map((concept) => [
        concept.id,
        {
          conceptId: concept.id,
          card: createNewFsrsCard(createdAtRealMs),
          reviews: [],
        },
      ]),
    ),
    reviewIntents: [],
    settlements: [],
    operationReceipts: {},
    events: [],
    criticalGuarantees: {},
    nextRoutineArrivalTick: 0,
    routineArrivalSequence: 0,
    totalOperatingExpenses: 0,
    emergencyGlp1: {
      dayNumber: 1,
      usesToday: 0,
      totalUses: 0,
      lastUsedAtFacilityTick: null,
      sarcasmMessagesShown: 0,
      lastFlavorMessage: null,
    },
    environment: {
      founderLocation,
      founderActivity: null,
      ambientPedestrians: [],
      ambientPedestrianSequence: 0,
      nextAmbientPedestrianTick:
        context.balanceRelease.environment
          .sidewalkPedestrianMinimumMinutes,
      litterItems: [],
      litterSequence: 0,
      trashTeachingAcknowledgedAtTick: null,
      founderLitterCleanups: 0,
      lastLitterCleanupAtTick: null,
      nextLitterSpawnTick:
        context.balanceRelease.environment.litterSpawnMinimumMinutes,
      waterCoolerFillPercent: 100,
      nextWaterCoolerDrainTick:
        context.balanceRelease.environment.waterCoolerDrainIntervalMinutes,
      waterCoolerEmptySinceTick: null,
      nextWaterCoolerReminderTick: null,
      facilityConditionOccurrenceSequence: 0,
      facilityConditionOccurrences: [],
    },
    alertHumor: {
      alertsTutorialAcknowledgedAtTick: null,
      nextAmbientAlertTick: null,
      ambientSequence: 0,
      ambientCycle: 0,
      ambientUsedDefinitionIds: [],
      recentAmbientDefinitionIds: [],
      recentWalkoutReviewVariantIds: [],
    },
  };
  state.environment.nextLitterSpawnTick = getNextLitterSpawnTick(
    state,
    context,
  );
  state.environment.nextAmbientPedestrianTick =
    getNextAmbientPedestrianTick(state, context);
  state.nextRoutineArrivalTick = getNextRoutineArrivalTick(
    state,
    context,
    true,
  );
  const firstTutorial = context.clinicalRelease.cases.find(
    (clinicalCase) => clinicalCase.id === FIRST_TUTORIAL_CASE_ID,
  );
  const secondTutorial = context.clinicalRelease.cases.find(
    (clinicalCase) => clinicalCase.id === SECOND_TUTORIAL_CASE_ID,
  );
  if (!firstTutorial?.tutorialEligible || !secondTutorial?.tutorialEligible) {
    throw new Error("The Level 0 prototype needs two tutorial-eligible cases.");
  }
  state.encounters[TUTORIAL_ENCOUNTER_ID] = createEncounter(state, context, {
    encounterId: TUTORIAL_ENCOUNTER_ID,
    clinicalCase: firstTutorial,
    arrivalClass: "tutorial",
    protectedGuaranteeId: null,
  });
  return state;
}

function reduceGameCommand(
  state: GameState,
  command: GameCommand,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): GameState {
  assertPinnedContext(state, context);
  if (!command.operationId.trim()) {
    throw new Error("Every command needs a stable, nonempty operation ID.");
  }
  if (state.operationReceipts[command.operationId]) {
    return state;
  }

  switch (command.type) {
    case "SET_ADVERTISING_LEVEL": {
      const level = context.balanceRelease.advertising.levels.find(
        (candidate) => candidate.level === command.level,
      );
      if (!level) {
        return rejectCommand(
          state,
          command,
          "That advertising level does not exist.",
        );
      }
      const next = clonePlain(state);
      const previousLevel =
        context.balanceRelease.advertising.levels.find(
          (candidate) => candidate.level === state.advertisingLevel,
        ) ?? context.balanceRelease.advertising.levels[0]!;
      next.advertisingLevel = level.level;
      // Preserve the already-generated arrival variation. Changing advertising
      // scales the remaining wait instead of rerolling or resetting its clock,
      // so repeatedly toggling tiers cannot manufacture or postpone patients.
      if (
        level.level !== previousLevel.level &&
        next.nextRoutineArrivalTick > next.facilityTick
      ) {
        const remainingMinutes =
          next.nextRoutineArrivalTick - next.facilityTick;
        next.nextRoutineArrivalTick =
          next.facilityTick +
          Math.max(
            1,
            Math.round(
              (remainingMinutes *
                level.arrivalIntervalMultiplierPercent) /
                previousLevel.arrivalIntervalMultiplierPercent,
            ),
          );
      }
      return recordReceipt(
        next,
        command,
        "applied",
        `Advertising set to ${level.displayName}.`,
      );
    }
    case "OPEN_CHART":
      return reduceOpenChart(state, command, context);
    case "CLOSE_CHART":
      return reduceCloseChart(state, command, context);
    case "SUBMIT_ANSWER":
      return reduceSubmitAnswer(state, command, context);
    case "ACKNOWLEDGE_TERMINAL_FEEDBACK":
      return reduceAcknowledgeFeedback(state, command);
    case "ACKNOWLEDGE_DECISION_FEEDBACK":
      return reduceAcknowledgeDecisionFeedback(
        state,
        command,
        context,
      );
    case "ACKNOWLEDGE_ALERTS_TUTORIAL":
      return reduceAcknowledgeAlertsTutorial(state, command);
    case "SET_PAUSED": {
      const next = clonePlain(state);
      next.paused = command.paused;
      return recordReceipt(
        next,
        command,
        "applied",
        command.paused ? "Facility paused." : "Facility resumed.",
      );
    }
    case "SET_SIMULATION_SPEED": {
      if (
        !context.balanceRelease.clock.supportedSpeeds.includes(command.speed)
      ) {
        return rejectCommand(
          state,
          command,
          "That facility speed is not supported.",
        );
      }
      const next = clonePlain(state);
      next.simulationSpeed = command.speed;
      return recordReceipt(
        next,
        command,
        "applied",
        `Facility speed set to ${command.speed}x.`,
      );
    }
    case "ADVANCE_TICK":
      return reduceAdvanceTick(state, command, context);
    case "PLACE_ROOM":
      return reducePlaceRoom(state, command, context);
    case "SELL_ROOM":
      return reduceSellRoom(state, command, context);
    case "UPGRADE_ROOM":
      return reduceUpgradeRoom(state, command, context);
    case "MOVE_ROOM":
      return reduceMoveRoom(state, command, context);
    case "ROTATE_ROOM":
      return reduceRotateRoom(state, command, context);
    case "PLACE_DOOR":
      return reducePlaceDoor(state, command, context);
    case "REMOVE_DOOR":
      return reduceRemoveDoor(state, command, context);
    case "HIRE_STAFF":
      return reduceHireStaff(state, command, context);
    case "SET_EMPLOYEE_SALARY":
      return reduceSetEmployeeSalary(state, command, context);
    case "FIRE_EMPLOYEE":
      return reduceFireEmployee(state, command);
    case "COLLECT_LITTER":
      return reduceCollectLitter(state, command, context);
    case "REFILL_WATER_COOLER":
      return reduceRefillWaterCooler(state, command, context);
    case "PRAISE_EMPLOYEE":
      return reducePraiseEmployee(state, command, context);
    case "MOVE_FOUNDER":
      return reduceMoveFounder(state, command, context);
    case "LEVEL_UP":
      return reduceLevelUp(state, command, context);
    case "DEV_FAST_FORWARD": {
      const requested =
        command.tickCount ??
        context.balanceRelease.development.fastForwardTickCount;
      if (!Number.isInteger(requested) || requested <= 0 || requested > 500) {
        return rejectCommand(
          state,
          command,
          "Development fast-forward must be between 1 and 500 ticks.",
        );
      }
      let next = state;
      for (let tick = 1; tick <= requested; tick += 1) {
        next = reduceAdvanceTick(
          next,
          {
            type: "ADVANCE_TICK",
            operationId: `${command.operationId}.tick.${tick}`,
          },
          context,
        );
      }
      return recordReceipt(
        next,
        command,
        "applied",
        `Development fast-forward advanced ${requested} ticks.`,
      );
    }
    case "DEV_ADD_MONEY": {
      const amount = context.balanceRelease.development.addMoneyAmount;
      const next = clonePlain(state);
      adjustCash(next, amount);
      appendEvent(next, {
        id: `event.development-money-added.${command.operationId}`,
        type: "development_money_added",
        facilityTick: next.facilityTick,
        encounterId: null,
        message: `Development tool added $${amount}.`,
      });
      return recordReceipt(
        next,
        command,
        "applied",
        `Development tool added $${amount}.`,
      );
    }
    case "RUN_EMERGENCY_GLP1_CONSULTATION":
      return reduceEmergencyGlp1Consultation(state, command, context);
    case "ADMIT_PATIENT":
      return reduceAdmitPatient(state, command, context);
  }
}

export function gameReducer(
  state: GameState,
  command: GameCommand,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): GameState {
  const next = reduceGameCommand(state, command, context);
  if (next === state) {
    return next;
  }
  // Facility conditions can change through paused build/staff commands as
  // well as through simulation time. Reconcile every applied/rejected clone so
  // history and attention clear at the exact persisted facility tick.
  synchronizeFacilityConditionOccurrences(next, context);
  synchronizeFacilityOperationalAlertOccurrences(next, context);
  return next;
}
